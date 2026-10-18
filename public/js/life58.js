/* v4.8.0 — mua / bán theo số lượng và bảng giá thị trường có nguồn, thời điểm. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, C = G.CUR;
  var SEED = G.MARKET_SEED, latest = copy(SEED);
  var GOLD = ['SJC', 'NHAN', 'PNJ'], VN = ['E1VFVN30', 'VCB', 'FPT', 'VNM', 'HPG', 'MWG', 'GAS'], US = ['SPY', 'AAPL', 'MSFT', 'NVDA', 'KO', 'TM'];
  function copy(x) { return JSON.parse(JSON.stringify(x)); }
  function positive(x) { return typeof x === 'number' && isFinite(x) && x > 0; }
  function goodQuote(q, symbol) {
    var s = SEED.quotes[symbol];
    return !!s && q && q.symbol === symbol && q.kind === s.kind && q.currency === s.currency && positive(q.bid) && positive(q.ask) && q.ask >= q.bid && q.ask < 1e12 && isFinite(Date.parse(q.asOf));
  }
  function goodFx(x) { return x && positive(x.usdVnd) && x.usdVnd > 1000 && x.usdVnd < 1e6 && isFinite(Date.parse(x.asOf)); }
  function book(l) {
    if (!l.marketBook) l.marketBook = { positions: {}, quotes: copy(latest.quotes), fx: copy(latest.fx), serial: 0, revision: 0 };
    return l.marketBook;
  }
  function quote(l, symbol) { return l.marketBook && l.marketBook.quotes[symbol] || latest.quotes[symbol]; }
  function fx(l) { return l.marketBook && l.marketBook.fx || latest.fx; }
  function convert(l, amount, currency) {
    if (l.cur === 'vnd') return currency === 'VND' ? amount / 1e6 : amount * fx(l).usdVnd / 1e6;
    return (currency === 'VND' ? amount / fx(l).usdVnd : amount) / C.priceLevel(l.gdp);
  }
  function native(l, amount, currency) {
    var usd = l.cur === 'vnd' ? amount * 1e6 / fx(l).usdVnd : amount * C.priceLevel(l.gdp);
    return currency === 'USD' ? usd : usd * fx(l).usdVnd;
  }
  function value(l) {
    var p = l.marketBook && l.marketBook.positions || {};
    return Object.keys(p).reduce(function (sum, symbol) { var q = quote(l, symbol); return sum + (q && positive(p[symbol].qty) ? convert(l, p[symbol].qty * q.bid, q.currency) : 0); }, 0);
  }
  function sync(l, data) {
    var b = book(l), changed = false, simulated = b.simAt != null;
    Object.keys(SEED.quotes).forEach(function (symbol) {
      var q = data && data.quotes && data.quotes[symbol], old = b.quotes[symbol];
      if (!goodQuote(q, symbol)) return;
      var clean = Object.assign({}, SEED.quotes[symbol], { bid: q.bid, ask: q.ask, asOf: q.asOf });
      if (Date.parse(q.asOf) >= Date.parse(latest.quotes[symbol].asOf)) latest.quotes[symbol] = copy(clean);
      // Sau khi mô phỏng bắt đầu, lấy giá thật chỉ để tham khảo / làm mốc cho đời mới.
      if (simulated || Date.parse(q.asOf) < Date.parse(old.asOf)) return;
      if (q.bid !== old.bid || q.ask !== old.ask || q.asOf !== old.asOf) { b.quotes[symbol] = clean; changed = true; }
    });
    if (goodFx(data && data.fx)) {
      var cleanFx = Object.assign({}, SEED.fx, { usdVnd: data.fx.usdVnd, asOf: data.fx.asOf });
      if (Date.parse(data.fx.asOf) >= Date.parse(latest.fx.asOf)) latest.fx = copy(cleanFx);
      if (!simulated && Date.parse(data.fx.asOf) >= Date.parse(b.fx.asOf) && (b.fx.usdVnd !== data.fx.usdVnd || b.fx.asOf !== data.fx.asOf)) { b.fx = cleanFx; changed = true; }
    }
    if (changed) b.revision++;
    return changed;
  }
  function stamp(q) {
    return q.simYear != null ? 'Giá mô phỏng năm ' + q.simYear + ' (' + (q.change >= 0 ? '+' : '') + U.fmtNum(q.change * 100, 1) + '% trong năm); mốc ngoài đời: ' + time(q.asOf) : 'Mốc giá ngoài đời: ' + time(q.asOf);
  }
  function simulateYear(l, ignored, log) {
    var b = l.marketBook;
    if (!b || !l.alive || b.simAt === l.age) return;
    if (b.marketRs == null) b.marketRs = ((l.rs || 0) ^ 0x6a09e667) | 0;
    var holder = { rs: b.marketRs }, r = function () { return U.rand(holder); };
    var gold = U.clamp(.02 + U.normal(r) * .12, -.30, .40);
    var vn = .04 + U.normal(r) * .15, us = .04 + U.normal(r) * .13;
    var shock = r(); if (shock < .06) { vn -= .25; us -= .22; } else if (shock > .94) { vn += .25; us += .22; }
    var parts = [];
    Object.keys(b.quotes).forEach(function (symbol) {
      var q = b.quotes[symbol], isGold = q.kind === 'gold', etf = symbol === 'E1VFVN30' || symbol === 'SPY';
      var growth = isGold ? gold : U.clamp((VN.indexOf(symbol) >= 0 ? vn : us) + U.normal(r) * (etf ? .04 : symbol === 'NVDA' ? .30 : .16), etf ? -.35 : -.65, etf ? .45 : .90);
      var digits = q.currency === 'VND' ? 1 : 100, floor = q.currency === 'VND' ? 1 : .01, oldBid = q.bid;
      q.bid = Math.max(floor, Math.min(9e11, Math.round(q.bid * (1 + growth) * digits) / digits));
      q.ask = Math.max(q.bid, Math.min(9e11, Math.round(q.ask * (1 + growth) * digits) / digits));
      q.simYear = l.birthYear + l.age; q.change = q.bid / oldBid - 1;
      if (b.positions[symbol] && b.positions[symbol].qty > 0) parts.push(symbol + ' ' + (q.change >= 0 ? '+' : '') + U.fmtNum(q.change * 100, 1) + '%');
    });
    b.marketRs = holder.rs; b.simAt = l.age; b.revision++;
    if (parts.length && log) log('Giá đầu tư mô phỏng năm ' + (l.birthYear + l.age) + ': ' + parts.join(' · ') + '. Số lượng giữ nguyên; giá trị danh mục theo giá bán được: ' + H.money(l, value(l)) + '.', 'money');
  }
  E.HOOKS.year.push(simulateYear);
  function free(l) { return l.alive && l.age >= 18 && l.indep && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.flags.military && l.age < l.flags.military) && !(l.abroad && l.abroad.trapped); }
  function qty(raw, symbol, unit) {
    if (!/^\d+(?:[.,]\d+)?$/.test(String(raw))) return NaN;
    var x = Number(String(raw).replace(',', '.')) * (unit === 'luong' ? 10 : 1), gold = GOLD.indexOf(symbol) >= 0;
    if (!positive(x) || x > 1e9 || Math.abs(x * (gold ? 10 : 1) - Math.round(x * (gold ? 10 : 1))) > 1e-7) return NaN;
    return gold ? Math.round(x * 10) / 10 : x;
  }
  function max(l, symbol, side) {
    var b = book(l), q = quote(l, symbol), step = q.kind === 'gold' ? 10 : 1;
    if (side === 'sell') return b.positions[symbol] ? b.positions[symbol].qty : 0;
    var affordable = Math.floor((Math.max(0, l.money) / convert(l, q.ask, q.currency) + 1e-10) * step) / step;
    var safe = Math.floor(Number.MAX_SAFE_INTEGER / (q.currency === 'VND' ? 1 : 100) / q.ask * step) / step;
    return Math.max(0, Math.min(1e9, affordable, safe));
  }
  function signature(l) { return [l.age, l.cur, l.gdp, l.abroad && l.abroad.code || '', l.country].join('|'); }
  function valid(l, d) { var b = l.marketBook; return free(l) && !!b && d && goodQuote(quote(l, d.symbol), d.symbol) && d.at === signature(l) && d.token === b.serial && d.revision === b.revision && !d.done; }
  function evaluate(l, d) {
    if (!valid(l, d)) return { ok: false, message: 'Hoàn cảnh hoặc bảng giá đã đổi. Mở lại giao dịch để xem giá mới.' };
    var q = quote(l, d.symbol), n = qty(d.quantity, d.symbol, d.unit), price = d.side === 'sell' ? q.bid : q.ask;
    if (!isFinite(n)) return { ok: false, message: q.kind === 'gold' ? 'Nhập số dương, theo bước 0,1 chỉ hoặc 0,01 lượng.' : 'Nhập số cổ phiếu nguyên dương.' };
    if (n > max(l, d.symbol, d.side) + 1e-8) return { ok: false, message: d.side === 'sell' ? 'Số lượng bán vượt số đang giữ.' : 'Tiền mặt không đủ cho số lượng này.' };
    var total = Math.round(price * n * (q.currency === 'VND' ? 1 : 100)) / (q.currency === 'VND' ? 1 : 100);
    if (!Number.isSafeInteger(Math.round(total * (q.currency === 'VND' ? 1 : 100)))) return { ok: false, message: 'Tổng tiền quá lớn để tính chính xác; hãy chia giao dịch nhỏ hơn.' };
    var cash = convert(l, total, q.currency);
    if (!isFinite(cash) || d.side !== 'sell' && cash > l.money + 1e-10) return { ok: false, message: 'Tiền mặt không đủ sau khi làm tròn tổng tiền.' };
    var h = l.marketBook.positions[d.symbol], avg = d.side === 'sell' && h && h.qty > 0 ? h.basis / h.qty : null;
    return { ok: true, qty: n, total: total, cash: cash, price: price, average: avg, difference: avg == null ? null : price - avg, percent: avg > 0 ? (price / avg - 1) * 100 : null, profit: avg == null ? null : total - avg * n }; 
  }
  function fmt(x, currency) { return U.fmtNum(x, currency === 'VND' ? 0 : 2) + ' ' + currency; }
  function time(s) { var d = new Date(s); return isNaN(d.getTime()) ? s : d.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false }); }
  function comparison(l, d, e) {
    e = e || evaluate(l, d); if (!e.ok || d.side !== 'sell') return '';
    var q = quote(l, d.symbol), movement = e.difference > 1e-8 ? 'tăng' : e.difference < -1e-8 ? 'giảm' : 'không đổi';
    var rate = e.percent == null ? 'không tính % vì giá vốn bằng 0' : (e.percent >= 0 ? '+' : '') + U.fmtNum(e.percent, 2) + '%';
    return 'So với giá mua bình quân: ' + fmt(e.average, q.currency) + '/' + q.unit + ' → giá bán được hiện tại ' + fmt(e.price, q.currency) + '/' + q.unit + '. Chênh lệch ' + movement + ' ' + fmt(Math.abs(e.difference), q.currency) + '/' + q.unit + ' (' + rate + '). ' +
      (e.profit >= 0 ? 'Lãi' : 'Lỗ') + ' dự kiến khi bán ' + U.fmtNum(e.qty, q.kind === 'gold' ? 1 : 0) + ' ' + q.unit + ': ' + fmt(Math.abs(e.profit), q.currency) + '. ' +
      (q.kind === 'gold' ? 'So sánh giá bạn mua với giá cửa hàng mua lại; đã phản ánh chênh lệch mua–bán vàng. ' : '') + 'Mua nhiều lần dùng giá vốn bình quân; chưa trừ phí / thuế thực tế.';
  }
  function summary(l, d) {
    var e = evaluate(l, d), q = quote(l, d.symbol);
    if (!e.ok) return e.message;
    return (d.side === 'sell' ? 'Bạn nhận: ' : 'Bạn trả: ') + fmt(e.total, q.currency) + ' · ' + H.money(l, e.cash) + '. ' + U.fmtNum(e.qty, q.kind === 'gold' ? 1 : 0) + ' ' + q.unit + ' × ' + fmt(e.price, q.currency) + (d.side === 'sell' ? '\n' + comparison(l, d, e) : '');
  }
  function execute(l, d, log) {
    var e = evaluate(l, d); if (!e.ok) { if (log) log(e.message, 'neutral'); return false; }
    var b = book(l), q = quote(l, d.symbol), h = b.positions[d.symbol] || { qty: 0, basis: 0 }, sell = d.side === 'sell';
    if (sell) {
      var removed = h.basis * e.qty / h.qty;
      h.qty = Math.max(0, Math.round((h.qty - e.qty) * 10) / 10); h.basis = Math.max(0, h.basis - removed);
      H.cash(l, e.cash, 'Bán ' + e.qty + ' ' + q.unit + ' ' + q.name);
      if (h.qty > 0) b.positions[d.symbol] = h; else delete b.positions[d.symbol];
      if (log) log('Bán ' + e.qty + ' ' + q.unit + ' ' + q.name + ', nhận ' + fmt(e.total, q.currency) + '; ' + (e.total >= removed ? 'lãi ' : 'lỗ ') + fmt(Math.abs(e.total - removed), q.currency) + ' theo giá vốn. ' + comparison(l, d, e) + ' ' + stamp(q) + '.', e.total >= removed ? 'good' : 'bad');
    } else {
      h.qty = Math.round((h.qty + e.qty) * 10) / 10; h.basis += e.total; b.positions[d.symbol] = h;
      H.cash(l, -e.cash, 'Mua ' + e.qty + ' ' + q.unit + ' ' + q.name);
      if (log) log('Tự trả ' + fmt(e.total, q.currency) + ' mua ' + e.qty + ' ' + q.unit + ' ' + q.name + ', đơn giá ' + fmt(q.ask, q.currency) + '/' + q.unit + '. ' + stamp(q) + '.', 'neutral');
    }
    d.done = true; b.serial++; return true;
  }
  function queue(l, r, id, arg) { l.pending.unshift(E.DEC[id].make(l, r, arg)); }
  function legacy(l) {
    var rows = [];
    function add(symbol, holder, valueKey, basisHolder, basisKey) {
      var v = holder && holder[valueKey], q = quote(l, symbol); if (!positive(v)) return;
      var step = q.kind === 'gold' ? 10 : 1, n = Math.floor((v / convert(l, q.bid, q.currency) + 1e-10) * step) / step;
      if (n > 0) rows.push({ symbol: symbol, holder: holder, valueKey: valueKey, basisHolder: basisHolder, basisKey: basisKey, qty: n, value: v });
    }
    add('NHAN', l.assets, 'gold', l.basis, 'gold');
    VN.concat(US).forEach(function (symbol) { var p = l.port && l.port[symbol]; add(symbol, p, 'v', p, 'basis'); });
    return rows;
  }
  E.SC('market_convert', { title: 'Quy đổi khoản cũ sang số lượng',
    prep: function (l) { var b = book(l); return { at: signature(l), token: b.serial, revision: b.revision }; },
    valid: function (l, d) { var b = l.marketBook; return free(l) && legacy(l).length > 0 && (!d || !d.at || b && d.at === signature(l) && d.token === b.serial && d.revision === b.revision); },
    text: function (l) { return 'Bản cũ chỉ lưu giá trị, chưa biết số lượng gốc. Bạn có thể quy đổi theo giá bán được đang hiển thị: ' + legacy(l).map(function (x) { var q = quote(l, x.symbol); return q.name + ' → ' + x.qty + ' ' + q.unit + ' (' + stamp(q) + ')'; }).join(' · ') + '. Tổng giá trị tài sản được giữ nguyên; phần nhỏ chưa đủ một đơn vị giao dịch vẫn ở khoản cũ. Đây là quy đổi kế toán tại thời điểm này, không tái tạo số lượng hay tỷ giá mua trong quá khứ.'; },
    opts: [{ k: 'convert', l: 'Quy đổi theo bảng giá này · không thu phí', run: function (l, r, log, d) {
      if (!E.DEC.market_convert.valid(l, d)) return;
      var b = book(l);
      legacy(l).forEach(function (x) {
        var q = quote(l, x.symbol), used = Math.min(x.value, convert(l, x.qty * q.bid, q.currency)), fraction = used / x.value;
        var basis = x.basisHolder && x.basisHolder[x.basisKey] != null ? x.basisHolder[x.basisKey] : x.value, h = b.positions[x.symbol] || { qty: 0, basis: 0 };
        h.qty = Math.round((h.qty + x.qty) * 10) / 10; h.basis += native(l, basis * fraction, q.currency); b.positions[x.symbol] = h;
        x.holder[x.valueKey] = Math.max(0, x.value - used); if (x.basisHolder) x.basisHolder[x.basisKey] = Math.max(0, basis * (1 - fraction));
        log('Quy đổi khoản cũ ' + q.name + ' thành ' + x.qty + ' ' + q.unit + ' theo giá đang lưu; giữ nguyên tổng giá trị, không thay đổi tiền mặt.', 'neutral');
      });
      b.serial++;
    } }, { k: 'no', l: 'Giữ khoản cũ, chưa quy đổi', run: function () {} }]
  });
  var close = { k: 'no', l: 'Đóng lại, không giao dịch', ai: { w: .4 }, run: function () {} };
  function items(kind) { return kind === 'gold' ? GOLD : VN.concat(US); }
  function list(id, title, kind, side) {
    E.SC(id, { title: title, valid: free, text: function (l) {
      book(l); return 'Giá ngoài đời làm mốc ban đầu; sau đó giá tăng / giảm ngẫu nhiên theo từng năm trong game, không phải dự báo thị trường thật. Chọn mã rồi nhập số lượng. Vàng: 1 lượng = 10 chỉ. Cổ phiếu dùng giá phiên gần nhất được nguồn công bố; chưa tính phí môi giới và thuế giao dịch. Tiền mặt: ' + H.money(l, l.money) + '.';
    }, opts: items(kind).map(function (symbol) { return {
      k: symbol, l: function (l) { var q = quote(l, symbol); return (side === 'sell' ? 'Bán ' : 'Mua ') + q.name + ' (' + symbol + ')'; },
      h: function (l) { var q = quote(l, symbol), h = book(l).positions[symbol]; return (side === 'sell' ? 'Bạn bán: ' + fmt(q.bid, q.currency) : 'Bạn mua: ' + fmt(q.ask, q.currency)) + '/' + q.unit + (h ? ' · giữ ' + h.qty + ' ' + q.unit : '') + ' · ' + q.source + ' · ' + stamp(q); },
      req: function (l) { return side === 'sell' ? max(l, symbol, side) > 0 : kind === 'gold' || (l.cur === 'vnd' ? VN : US).indexOf(symbol) >= 0; },
      run: function (l, r) { queue(l, r, 'market_trade', { symbol: symbol, side: side }); }
    }; }).concat([close]) });
  }
  list('market_gold', 'Mua vàng theo số lượng', 'gold', 'buy');
  list('co_phieu', 'Mua cổ phiếu theo số lượng', 'stock', 'buy');
  list('market_sell_gold', 'Bán vàng theo số lượng', 'gold', 'sell');
  list('market_sell_stock', 'Bán cổ phiếu theo số lượng', 'stock', 'sell');
  E.SC('market_trade', { title: function (l, d) { var q = quote(l, d.symbol); return (d.side === 'sell' ? 'Bán ' : 'Mua ') + (q ? q.name : 'tài sản'); }, valid: valid,
    prep: function (l, r, arg) {
      if (!arg || !SEED.quotes[arg.symbol]) return {};
      var b = book(l), q = quote(l, arg.symbol), side = arg.side === 'sell' ? 'sell' : 'buy';
      b.serial++; var defaultQty = Math.min(max(l, arg.symbol, side), q.kind === 'gold' ? 1 : 100);
      return { symbol: arg.symbol, side: side, quantity: String(arg.quantity || defaultQty || 1), unit: arg.unit === 'luong' && q.kind === 'gold' ? 'luong' : 'base', at: signature(l), revision: b.revision, token: b.serial };
    }, text: function (l, d) {
      var q = quote(l, d.symbol); if (!q) return 'Chưa có mã tài sản hợp lệ.';
      return 'Bạn mua: ' + fmt(q.ask, q.currency) + '/' + q.unit + ' · Bạn bán: ' + fmt(q.bid, q.currency) + '/' + q.unit + '.\nNguồn: ' + q.source + ' · ' + stamp(q) + ' (giờ Việt Nam cho mốc ngoài đời).\nĐang giữ: ' + max(l, d.symbol, 'sell') + ' ' + q.unit + '. Tiền mặt: ' + H.money(l, l.money) + '. Tỷ giá quy đổi: 1 USD = ' + fmt(fx(l).usdVnd, 'VND') + ' (' + time(fx(l).asOf) + ').\nNhập số lượng rồi xác nhận; giao dịch không tính phí môi giới / thuế thực tế.';
    }, opts: [{ k: 'confirm', l: 'Xác nhận số lượng đang nhập', run: function (l, r, log, d) { execute(l, d, log); } }, close]
  });
  E.SC('market_menu', { title: 'Vàng và cổ phiếu · thị trường mô phỏng', valid: free,
    text: function (l) { return 'Giá vàng và cổ phiếu sẽ tăng / giảm ngẫu nhiên sau mỗi năm trong game; vàng thường biến động nhẹ hơn cổ phiếu. Danh mục theo số lượng: ' + H.money(l, value(l)) + ' (định giá theo giá bán được, không tính hai lần vào tiền mặt). Chọn mua hoặc bán; mỗi mã ghi nguồn và thời điểm riêng. Khoản đầu tư của bản cũ vẫn giữ nguyên trong mục bán khoản cũ vì chưa từng lưu số lượng gốc.'; },
    opts: [{ k: 'gold', l: 'Mua vàng · nhập chỉ hoặc lượng', run: function (l, r) { queue(l, r, 'market_gold'); } }, { k: 'stock', l: 'Mua cổ phiếu / quỹ · nhập số lượng', run: function (l, r) { queue(l, r, 'co_phieu'); } },
      { k: 'sell_gold', l: 'Bán một phần hoặc toàn bộ vàng', req: function (l) { return GOLD.some(function (s) { return max(l, s, 'sell') > 0; }); }, run: function (l, r) { queue(l, r, 'market_sell_gold'); } },
      { k: 'sell_stock', l: 'Bán một phần hoặc toàn bộ cổ phiếu', req: function (l) { return VN.concat(US).some(function (s) { return max(l, s, 'sell') > 0; }); }, run: function (l, r) { queue(l, r, 'market_sell_stock'); } },
      { k: 'convert', l: 'Xem quy đổi khoản vàng / cổ phiếu cũ sang số lượng', req: function (l) { return legacy(l).length > 0; }, run: function (l, r) { queue(l, r, 'market_convert'); } }, close]
  });
  if (E.DEC.dau_tu) E.DEC.dau_tu.def.opts.forEach(function (o) { if (o.k === 'gold') { o.l = 'Mua vàng · chọn loại và số lượng'; o.h = 'Bảng giá mua / bán có nguồn và thời điểm'; o.run = function (l, r) { queue(l, r, 'market_gold'); }; } });
  ['ban_tai_san', 'ban_dt_moi'].forEach(function (id) {
    var D = E.DEC[id], before = D.valid;
    D.valid = function (l, d) { return before(l, d) || free(l) && value(l) > 0; };
    D.def.opts.unshift({ k: 'market', l: 'Vàng / cổ phiếu theo số lượng · chọn phần muốn bán', req: function (l) { return free(l) && value(l) > 0; }, run: function (l, r) { queue(l, r, 'market_menu'); } });
    D.def.opts.forEach(function (o) { if (/^(gold|stock|port)$/.test(o.k)) { var label = o.l; o.l = function (l, d) { return (typeof label === 'function' ? label(l, d) : label) + ' (khoản mô phỏng cũ)'; }; } });
  });
  E.ACT.push({ id: 'market_menu', g: 'Tiền bạc', l: 'Vàng / cổ phiếu · bảng giá & số lượng', min: 18, sc: 'market_menu', avail: function (l) { return free(l) ? true : 'Cần đủ 18 tuổi, tự lập và được tự do giao dịch'; }, ai: { w: .1 } });
  var net = E.netWorth, total = E.assetTotal, profile = E.profile;
  E.netWorth = function (l) { return net(l) + value(l); };
  E.assetTotal = function (l) { return total(l) + value(l); };
  if (profile) E.profile = function (l) { var p = profile(l); Object.keys(l.marketBook && l.marketBook.positions || {}).forEach(function (s) { var q = quote(l, s), h = l.marketBook.positions[s]; p.assets.push([q.name + ' · ' + h.qty + ' ' + q.unit, convert(l, h.qty * q.bid, q.currency)]); }); p.net = E.netWorth(l); return p; };
  async function refresh(l, fetcher, current) {
    var response = await (fetcher || fetch)('/api/market', { cache: 'no-store', signal: typeof AbortSignal !== 'undefined' ? AbortSignal.timeout(12000) : undefined });
    if (!response.ok || !(response.headers.get('content-type') || '').includes('application/json')) throw Error('Chưa lấy được bảng giá mới. Đang giữ giá có thời điểm đã ghi.');
    var data = await response.json();
    if (!data.quotes || !Object.keys(data.quotes).some(function (s) { return goodQuote(data.quotes[s], s); })) throw Error('Nguồn chưa trả bảng giá hợp lệ.');
    if (current && !current()) return 'Đã đóng bảng giao dịch; chưa áp dụng giá mới.';
    sync(l, data); if (l.marketBook.simAt != null) return 'Đã kiểm tra mốc ngoài đời để tham khảo; giá mô phỏng trong cuộc đời này được giữ, không đặt lại.'; return data.errors && data.errors.length ? 'Một số nguồn chưa cập nhật được; các mã đó giữ thời điểm cũ.' : 'Đã kiểm tra bảng giá mới nhất từ nguồn.';
  }
  // Giá chạy mô phỏng riêng; số lượng / giá vốn không bị nhân lợi suất của danh mục cũ.
  E.MARKET = { book: book, quote: quote, value: value, sync: sync, refresh: refresh, qty: qty, max: max, valid: valid, evaluate: evaluate, execute: execute, summary: summary, free: free, convert: convert, native: native, fmt: fmt, symbols: GOLD.concat(VN, US), simulateYear: simulateYear, stamp: stamp, comparison: comparison };
})(G);
