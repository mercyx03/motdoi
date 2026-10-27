/* Góp ý người chơi — Mốc E: thỏa thuận tài sản trước hôn nhân, chia tài sản khi ly hôn, di chúc chi tiết, đồng bộ sở hữu.
   · Mở rộng hệ thống sẵn có: contract108 (thỏa thuận trước khi cưới), settlement107 (sau ly hôn), di_chuc / E.WILL70 (di chúc),
     E.ESTATE84 + điểm móc estateItems / allocateCompanies (sang tên hiện vật), sổ tài sản life148.
   · Hôn nhân bắt đầu sau bản cập nhật được ghi nhận tài sản trước hôn nhân; hôn nhân trong bản lưu cũ giữ cách chia cũ.
   · Chia tài sản bảo toàn: tài sản của bạn giảm đúng phần người kia nhận, không tạo tiền từ hư không; tài sản của con,
     của bố mẹ, của người khác (món đã tặng) không bao giờ bị đem chia.
   · Đây là mô phỏng trong game, không phải tư vấn pháp lý; mỗi quốc gia có quy định khác nhau. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, C = E.ELITE148;
  function mo(l, v) { return H.money(l, v); }
  function vn(l) { return H.isVN(l) && !(l.abroad && l.abroad.perm); }
  function hash(s) { var n = 2166136261; for (var i = 0; i < s.length; i++) n = Math.imul(n ^ s.charCodeAt(i), 16777619); return n >>> 0; }
  function seeded(s) { var a = hash(s); return function () { a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function S(l) { var s = l.flags.marital150 || (l.flags.marital150 = {}); if (!Array.isArray(s.cases)) s.cases = []; return s; }
  function married(p) { return !!(p && p.alive !== false && (p.status === 'married' || p.status === 'cohabit')); }
  function fresh(p) { return !!(p && p.marital150 && !p.marital150.legacy); }
  function homeDebt(l) { return (l.mortgage || 0) + (l.loans || []).filter(function (x) { return x.type === 'home'; }).reduce(function (s, x) { return s + (x.bal || 0); }, 0); }
  function houseEquity(l) { return l.ownHouse ? Math.max(0, (l.houseVal || 0) - homeDebt(l)) : 0; }
  function companies(l) { return E.BUSINESS123 ? (E.BUSINESS123.companies(l) || []).filter(function (c) { return !c.merged && c.share > 0; }) : []; }
  function bizEquity(l) { return (l.ventures || []).reduce(function (s, v) { return s + (v.cap || 0); }, 0) + companies(l).reduce(function (s, c) { return s + Math.max(0, c.value) * c.share / 100; }, 0); }

  // ===================================================================
  // E1. Chế độ tài sản / thỏa thuận trước hôn nhân
  // ===================================================================
  var REGIME = {
    legal: { n: 'Chế độ tài sản theo luật định', d: 'Tài sản có trước khi cưới và tài sản được thừa kế riêng là của ai người nấy; tài sản tạo ra trong hôn nhân là tài sản chung, khi ly hôn chia có xét công sức đóng góp, lỗi và việc nuôi con.' },
    half: { n: 'Chia đôi tài sản chung, không xét đóng góp', d: 'Tài sản riêng giữ nguyên; tài sản chung luôn chia 50/50.' },
    homeOnly: { n: 'Thu nhập ai nấy giữ, chỉ nhà ở chung chia đôi', d: 'Mỗi người tự quản lý thu nhập và khoản đầu tư của mình; chỉ phần nhà ở tạo dựng trong hôn nhân được chia đôi.' },
    contribution: { n: 'Chia tài sản chung theo đóng góp (60/40)', d: 'Người có thu nhập cao hơn nhận 60% tài sản chung, người còn lại 40%.' },
    business: { n: 'Doanh nghiệp là tài sản riêng của người sở hữu', d: 'Công ty, cửa hàng, cổ phần doanh nghiệp không bị chia; các tài sản chung khác theo luật định.' },
    separate: { n: 'Tài sản riêng hoàn toàn', d: 'Không chuyển tài sản cho nhau khi ly hôn.' },
    limited: { n: 'Chuyển 10% tài sản khi ly hôn', d: 'Thỏa thuận cố định 10% tiền và nhà ở.' }
  };
  function regimeOf(p) {
    if (p && p.marital150 && p.marital150.regime) return p.marital150.regime;
    var c = p && p.contract108; if (c && c.regime150) return c.regime150;
    return c && c.share === 0 ? 'separate' : c && c.share === 0.1 ? 'limited' : 'legal';
  }
  function lawText(l) { return vn(l) ? 'Theo luật Việt Nam, vợ chồng có thể lập văn bản thỏa thuận chế độ tài sản trước khi kết hôn (công chứng); nếu không, áp dụng chế độ theo luật định.' : 'Quy định về thỏa thuận tài sản hôn nhân khác nhau giữa các quốc gia; game mô phỏng một cách chung.'; }
  // Người kia chấp nhận điều khoản tùy độ công bằng với hoàn cảnh của họ
  function prenupChance(l, key) {
    var p = l.partner, mine = Math.max(0, l.income || 0), theirs = Math.max(0, (p.inc || 0) * 12), richer = mine >= theirs, bond = p.affection108 == null ? 70 : p.affection108;
    var c = { half: 0.85, homeOnly: richer ? 0.45 : 0.75, contribution: richer ? 0.4 : 0.8, business: bizEquity(l) > 0 ? 0.6 : 0.9 }[key] || 0.5;
    return U.clamp(c + (bond - 70) / 200, 0.05, 0.95);
  }
  if (E.DEC.contract108) {
    var opts108 = E.DEC.contract108.def.opts, cancel = opts108.findIndex(function (o) { return o.k === 'cancel'; });
    opts108.splice(cancel < 0 ? opts108.length : cancel, 0, { k: 'custom150', l: 'Lập thỏa thuận tài sản chi tiết (tùy chọn)', h: 'Thu nhập, nhà ở, doanh nghiệp, cách chia', run: function (l, r, log, d) { if (!E.DEC.contract108.valid(l, d)) return; d.done = true; X.next(l, 'prenup150', r, { at: d.at, who: d.who, style: d.style }); } });
  }
  X.menu('prenup150', 'Thỏa thuận tài sản trước hôn nhân', function (l) { return l.partner && l.partner.status === 'dating' ? true : 'Chỉ lập trước khi kết hôn'; },
    function (l) { return lawText(l) + ' Thỏa thuận là tùy chọn và cần cả hai đồng ý; không ảnh hưởng nghĩa vụ nuôi con. Đây là mô phỏng, không phải tư vấn pháp lý.'; },
    function (l, arg) {
      if (!l.partner || arg.who !== l.partner.relation108) return [];
      return ['half', 'homeOnly', 'contribution', 'business'].map(function (k) { return { k: k, l: REGIME[k].n, h: REGIME[k].d, run: function (l, r, log) { prenup(l, r, log, k, arg); } }; })
        .concat([{ k: 'legal', l: 'Thôi, dùng chế độ theo luật định', run: function (l, r, log) { prenup(l, r, log, 'legal', arg); } }]);
    });
  function prenup(l, r, log, key, arg) {
    var p = l.partner; if (!p || p.status !== 'dating') return false;
    if (key !== 'legal' && r() >= prenupChance(l, key)) { log(p.name + ' chưa đồng ý với điều khoản “' + REGIME[key].n.toLowerCase() + '”. Hai người hoãn cưới để trao đổi thêm.', 'neutral'); return false; }
    var def = E.DEC.contract108.def.opts.find(function (o) { return o.k === 'default'; }), d = { at: l.age, who: arg.who, style: arg.style, done: false };
    def.run(l, r, log, d);
    if (p.contract108) p.contract108.regime150 = key;
    if (p.marital150) p.marital150.regime = key;
    if (key !== 'legal') log('Hai bạn ký thỏa thuận: ' + REGIME[key].n.toLowerCase() + '.', 'neutral');
    return true;
  }

  // ===================================================================
  // Ghi nhận tài sản trước hôn nhân (chỉ cho hôn nhân bắt đầu từ bản cập nhật này)
  // ===================================================================
  function startMarriage(l, p, pre) { if (!p || p.marital150) return; p.marital150 = { since: l.age, pre: Math.max(0, pre), inherited: 0, cur: l.cur, regime: regimeOf(p) }; }
  var resolve = E.resolve;
  E.resolve = function (l) {
    var before = l.partner, st = before && before.status, net = l.alive ? E.netWorth(l) : 0, out = resolve.apply(this, arguments), p = l.partner;
    if (married(p) && !p.marital150 && (p !== before || st === 'dating')) startMarriage(l, p, net);
    return out;
  };
  var cash = H.cash;
  H.cash = function (l, v, why) { var p = l.partner; if (v > 0 && why && /thừa kế/i.test(why) && married(p) && fresh(p)) p.marital150.inherited += v; return cash.apply(this, arguments); };
  var convert = E.abroadConvert;
  E.abroadConvert = function (l, f) {
    var out = convert.apply(this, arguments), p = l.partner;
    if (fresh(p)) { p.marital150.pre *= f; p.marital150.inherited *= f; }
    if (l.flags.marital150) S(l).cases.forEach(function (c) { ['pool', 'due', 'paid'].forEach(function (k) { if (typeof c[k] === 'number') c[k] *= f; }); });
    return out;
  };

  // ===================================================================
  // E2. Chia tài sản khi ly hôn
  // ===================================================================
  function pools(l, p) {
    var m = p.marital150, net = Math.max(0, E.netWorth(l)), sep = Math.min(net, (m.pre || 0) + (m.inherited || 0)), common = Math.max(0, net - sep), rg = regimeOf(p), pool = common;
    if (rg === 'homeOnly') pool = Math.min(common, houseEquity(l));
    if (rg === 'business') pool = Math.max(0, common - bizEquity(l));
    if (rg === 'separate') pool = 0;
    return { net: net, separate: sep, common: common, pool: pool, regime: rg };
  }
  function contribution(l, p) { var mine = Math.max(0, l.income || 0), theirs = Math.max(0, (p.inc || 0) * 12); return mine + theirs > 0 ? theirs / (mine + theirs) : 0.5; }
  function ratio(l, p, o) {
    o = o || {}; var rg = regimeOf(p), c = contribution(l, p);
    if (rg === 'half') return 0.5;
    if (rg === 'contribution') return c > 0.5 ? 0.6 : c < 0.5 ? 0.4 : 0.5;
    var r = 0.3 + c * 0.4;
    if (l.flags.affair107 || o.fault) r += 0.1;
    if (o.custody) r += o.custody;
    if (p.status === 'cohabit') r *= 0.6; // chung sống không đăng ký: chia theo phần đóng góp thực tế
    return U.clamp(r, 0.15, 0.8);
  }
  function snapshot(l) { return { money: l.money, houseVal: l.houseVal, mortgage: l.mortgage, ownHouse: l.ownHouse, loans: (l.loans || []).map(function (x) { return x.bal; }) }; }
  function restore(l, s) { l.money = s.money; l.houseVal = s.houseVal; l.mortgage = s.mortgage; l.ownHouse = s.ownHouse; (l.loans || []).forEach(function (x, i) { if (s.loans[i] != null) x.bal = s.loans[i]; }); }
  // Chuyển đúng `due` giá trị tài sản cho người kia; trả lại phần thực chuyển (không bao giờ vượt tài sản đang có).
  function payOut(l, due, exId, exName) {
    var start = E.netWorth(l), left = due, detail = [];
    function took(label, v) { if (v > 1e-9) { left -= v; detail.push([label, v]); } }
    var c = Math.min(Math.max(0, l.money), left); l.money -= c; took('tiền mặt', c);
    if (left > 1e-9) {
      var cats = [], books = X.peek(l).bankBooks || [], A = l.assets || {};
      var bookV = books.reduce(function (s, b) { return s + (b.principal || 0); }, 0); if (bookV > 0) cats.push({ n: 'sổ tiết kiệm', v: bookV, scale: function (k) { books.forEach(function (b) { b.principal *= k; }); } });
      ['save', 'gold', 'stock', 'land'].forEach(function (key) { if ((A[key] || 0) > 0) cats.push({ n: { save: 'tiền gửi', gold: 'vàng', stock: 'cổ phiếu', land: 'đất' }[key], v: A[key], scale: function (k) { A[key] *= k; if (l.basis && l.basis[key]) l.basis[key] *= k; } }); });
      var pos = l.marketBook && l.marketBook.positions || {}, posKeys = Object.keys(pos);
      if (posKeys.length) { var full = E.netWorth(l), saved = posKeys.map(function (s) { return pos[s].qty; }); posKeys.forEach(function (s) { pos[s].qty = 0; }); var mv = full - E.netWorth(l); posKeys.forEach(function (s, i) { pos[s].qty = saved[i]; }); if (mv > 0) cats.push({ n: 'vàng / cổ phiếu theo số lượng', v: mv, scale: function (k) { posKeys.forEach(function (s) { pos[s].qty *= k; if (typeof pos[s].cost === 'number') pos[s].cost *= k; }); } }); }
      var propV = (l.props || []).reduce(function (s, p) { return s + (p.v || 0); }, 0); if (propV > 0) cats.push({ n: 'bất động sản', v: propV, scale: function (k) { l.props.forEach(function (p) { p.v *= k; if (p.basis) p.basis *= k; }); l.props = l.props.filter(function (p) { return p.v > 1e-6; }); } });
      var mine = l.flags.elite148 ? C.mine(l) : [], itemV = mine.reduce(function (s, x) { return s + (x.value || 0); }, 0);
      if (itemV > 0) cats.push({ n: 'đồ sưu tầm, tài sản xa xỉ', v: itemV, scale: function (k) { var give = itemV * (1 - k); mine.slice().sort(function (a, b) { return a.value - b.value; }).forEach(function (x) { if (give > 1e-9 && x.value <= give + 1e-9) { give -= x.value; C.transfer(l, x, exId, exName); } else if (give > 1e-9) { x.value -= give; give = 0; } }); } });
      var eq = houseEquity(l); if (eq > 0) cats.push({ n: 'nhà ở', v: eq, scale: function (k) { if (k <= 1e-9) { l.ownHouse = false; l.houseVal = 0; l.mortgage = 0; l.loans = (l.loans || []).filter(function (x) { return x.type !== 'home'; }); } else l.houseVal = homeDebt(l) + eq * k; } });
      var venV = (l.ventures || []).reduce(function (s, v) { return s + (v.cap || 0); }, 0); if (venV > 0) cats.push({ n: 'cơ sở kinh doanh', v: venV, scale: function (k) { l.ventures.forEach(function (v) { v.cap *= k; }); } });
      var cos = companies(l), coV = cos.reduce(function (s, c) { return s + Math.max(0, c.value) * c.share / 100; }, 0); if (coV > 0) cats.push({ n: 'cổ phần doanh nghiệp', v: coV, scale: function (k) { cos.forEach(function (c) { c.share *= k; }); } });
      var total = cats.reduce(function (s, x) { return s + x.v; }, 0);
      if (total > 0) { var f = Math.min(1, left / total); cats.forEach(function (x) { x.scale(1 - f); took(x.n, x.v * f); }); }
    }
    var paid = Math.max(0, start - E.netWorth(l));
    return { paid: paid, unpaid: Math.max(0, due - paid), detail: detail };
  }
  function divorceSplit(l, p, before, r, log) {
    var key = (p.nameBeforeCustomization || p.name) + '|' + p.since, s = S(l);
    if (s.cases.some(function (c) { return c.key === key; })) return null;
    restore(l, before);
    var q = pools(l, p), rg = q.regime, rt = ratio(l, p), due = rg === 'limited' ? 0.1 * (Math.max(0, l.money) + houseEquity(l)) : q.pool * rt;
    var exId = 'ex:' + (p.relation108 || p.name), res = payOut(l, due, exId, p.name);
    var c = { key: key, name: p.name, rel: p.relation108 || null, regime: rg, net: q.net, separate: q.separate, common: q.common, pool: q.pool, ratio: rt, due: due, paid: res.paid, detail: res.detail, at: l.age, stage: 'proposed' };
    X.uid(l, c); s.cases.push(c); if (s.cases.length > 12) s.cases.shift();
    log('Chia tài sản với ' + p.name + ' (' + REGIME[rg].n.toLowerCase() + '): tài sản riêng của bạn ' + mo(l, q.separate) + ' giữ nguyên; tài sản chung ' + mo(l, q.pool) + ', ' + p.name + ' nhận ' + Math.round(rt * 100) + '% = ' + mo(l, res.paid) + (res.detail.length ? ' (' + res.detail.map(function (x) { return x[0] + ' ' + mo(l, x[1]); }).join(', ') + ')' : '') + '.' + (res.unpaid > 0.5 ? ' Còn thiếu ' + mo(l, res.unpaid) + ' vì không đủ tài sản để chia.' : ''), 'neutral');
    var pend = (l.pending || []).find(function (d) { return d.id === 'settlement107' && d.data && d.data.key === key; });
    if (pend) { pend.data.before = Math.max(0, before.money); pend.data.lost = Math.min(pend.data.before, Math.max(0, before.money - l.money)); pend.data.case150 = c.uid110; var fresh150 = E.DEC.settlement107.make(l, r, pend.data); Object.keys(pend).forEach(function (k) { if (!/^(id|title|text|opts|data|tone)$/.test(k)) fresh150[k] = pend[k]; }); l.pending[l.pending.indexOf(pend)] = fresh150; }
    return c;
  }
  function wrapDivorce(fn) {
    return function (l) {
      var p = l.partner, was = married(p) && fresh(p) ? snapshot(l) : null, out = fn.apply(this, arguments);
      if (was && l.partner !== p) divorceSplit(l, p, was, H.rf(l), function (t, k) { l.log.push({ a: l.age, y: l.birthYear + l.age, t: t, k: k || 'neutral' }); });
      return out;
    };
  }
  E.DEC.divorce.apply = wrapDivorce(E.DEC.divorce.apply);
  var endPartner = H.endPartner;
  H.endPartner = function (l, log, how) { if (how !== 'div') return endPartner.apply(this, arguments); return wrapDivorce(endPartner).apply(this, arguments); };
  // Sau ly hôn: thêm lựa chọn ra tòa (nhiều giai đoạn) vào bước thỏa thuận sẵn có
  function caseOf(l, d) { return d && d.case150 && S(l).cases.find(function (c) { return c.uid110 === d.case150; }) || null; }
  if (E.DEC.settlement107) {
    var sd = E.DEC.settlement107.def, stext = sd.text;
    sd.text = function (l, d) {
      var t = typeof stext === 'function' ? stext(l, d) : stext, c = caseOf(l, d); if (!c) return t;
      return 'Cuộc hôn nhân với ' + c.name + ' đã kết thúc. Chế độ: ' + REGIME[c.regime].n.toLowerCase() + '. Tài sản ròng khi ly hôn ' + mo(l, c.net) + ': tài sản riêng (trước hôn nhân, được thừa kế) ' + mo(l, c.separate) + ', tài sản chung được chia ' + mo(l, c.pool) + '. ' + c.name + ' nhận ' + Math.round(c.ratio * 100) + '% (đã xét đóng góp thu nhập' + (l.flags.affair107 ? ', lỗi ngoại tình' : '') + ') = ' + mo(l, c.paid) + '. Tài sản của các con và của người khác không bị chia. Bạn có thể chấp nhận, nhờ hòa giải hoặc ra tòa. Quyền nuôi con được giải quyết riêng.';
    };
    sd.opts.push({ k: 'court150', l: 'Ra tòa phân chia lại tài sản chung', h: function (l) { return 'Án phí, luật sư ' + mo(l, l.base * 0.05) + '; khoảng một năm mới có phán quyết'; }, req: function (l, d) { return !!caseOf(l, d) && l.money >= l.base * 0.05; },
      run: function (l, r, log, d) {
        var c = caseOf(l, d); if (!c || !E.DEC.settlement107.valid(l, d) || l.money < l.base * 0.05) return;
        d.done = true; (l.flags.settled107 || (l.flags.settled107 = [])).push(d.key);
        H.cash(l, -l.base * 0.05, 'Án phí, luật sư chia tài sản ly hôn'); c.stage = 'court'; c.until = l.age + 1;
        log('Bạn nộp đơn đề nghị tòa phân chia lại tài sản chung với ' + c.name + '. Phán quyết dự kiến sau khoảng một năm.', 'neutral');
        if ((l.kids || []).some(function (k) { return k.alive && l.age - k.born < 18; }) && !l.pending.some(function (x) { return x.id === 'quyen_nuoi_con'; })) { l.flags.divEx = d.name; X.next(l, 'quyen_nuoi_con', r, undefined, { manual: false }); }
      } });
  }
  function courtYear(l, r, log) {
    S(l).cases.forEach(function (c) {
      if (c.stage !== 'court' || l.age < c.until) return;
      var kids = (l.kids || []).filter(function (k) { return k.alive !== false && l.age - k.born < 18 && k.coParent108 && c.rel && k.coParent108.id === c.rel; });
      var custody = kids.length ? (kids.filter(function (k) { return k.custody === 'ex'; }).length - kids.filter(function (k) { return k.custody === 'me' || !k.custody; }).length) / kids.length * 0.05 : 0;
      var noise = (seeded(c.uid110 + ':court')() - 0.5) * 0.16, now = U.clamp(c.ratio + custody + noise, 0.15, 0.8), delta = (c.ratio - now) * c.pool;
      if (delta > 0) { var back = Math.min(delta, c.paid); H.cash(l, back, 'Phán quyết chia tài sản ly hôn'); c.paid -= back; log('Tòa xác định ' + c.name + ' được ' + Math.round(now * 100) + '% tài sản chung; ' + c.name + ' hoàn lại cho bạn ' + mo(l, back) + '.', 'good'); }
      else if (delta < 0) { var more = Math.min(-delta, Math.max(0, l.money)); H.cash(l, -more, 'Phán quyết chia tài sản ly hôn'); c.paid += more; log('Tòa xác định ' + c.name + ' được ' + Math.round(now * 100) + '% tài sản chung; bạn trả thêm ' + mo(l, more) + '.', 'bad'); }
      else log('Tòa giữ nguyên cách chia tài sản với ' + c.name + '.', 'neutral');
      c.ratio = now; c.stage = 'closed';
    });
  }

  // ===================================================================
  // E3. Di chúc chi tiết: tài sản cụ thể, truất quyền, người thi hành, quyền điều hành
  // ===================================================================
  function W(l) { var w = l.flags.will150 || (l.flags.will150 = {}); if (!w.specific || typeof w.specific !== 'object') w.specific = {}; if (!Array.isArray(w.exclude)) w.exclude = []; if (!w.manage || typeof w.manage !== 'object') w.manage = {}; return w; }
  function heirKeys(l) {
    var out = [];
    (l.kids || []).forEach(function (k, i) { if (k.alive !== false) out.push({ key: 'k' + i, name: k.name, kid: i, adult: l.age - k.born >= 18 }); });
    var p = l.partner && l.partner.alive !== false && l.partner.status !== 'dating' ? l.partner : null; if (p) out.push({ key: 'p', name: p.name, spouse: true });
    return out;
  }
  function assets(l) {
    var out = [];
    if (l.ownHouse && (l.houseVal || 0) > 0) out.push({ key: 'home', n: l.houseName || 'căn nhà đang ở', v: l.houseVal });
    (l.props || []).forEach(function (p) { if ((p.v || 0) > 0) out.push({ key: 'prop:' + X.uid(l, p), n: p.n, v: p.v }); });
    (l.ventures || []).forEach(function (v) { if ((v.cap || 0) > 0) out.push({ key: 'venture:' + X.uid(l, v), n: v.n, v: v.cap }); });
    companies(l).forEach(function (c) { out.push({ key: 'company:' + X.uid(l, c), n: 'Cổ phần ' + c.name + ' (' + Math.round(c.share) + '%)', v: Math.max(0, c.value) * c.share / 100, company: c }); });
    if (l.flags.elite148) C.mine(l).forEach(function (x) { out.push({ key: 'item:' + x.uid110, n: x.name, v: x.value }); });
    return out;
  }
  function nameOf(l, key) { var h = heirKeys(l).find(function (x) { return x.key === key; }); return h ? h.name : null; }
  function protectedHeir(l, h, atAge) { return h.spouse && vn(l) || h.kid != null && (atAge != null ? atAge : l.age) - l.kids[h.kid].born < 18; }
  X.menu('will150', 'Di chúc chi tiết', function (l) { return l.alive && l.age >= 18 ? true : 'Từ 18 tuổi'; },
    function (l) {
      var w = W(l), base = l.flags.will70, debt = (l.loans || []).reduce(function (s, x) { return s + (x.bal || 0); }, 0) + (l.mortgage || 0);
      var lines = ['Tài sản vẫn thuộc về bạn khi còn sống; di chúc chỉ có hiệu lực khi bạn qua đời và có thể sửa bất cứ lúc nào.',
        'Tỷ lệ chia: ' + (base ? ({ personal: 'chỉ để lại lời nhắn', equal: 'chia đều cho các con', spouse: 'để lại cho bạn đời', family: 'nửa bạn đời, nửa các con', charity: 'để lại cho xã hội', custom: 'tự chia theo tỷ lệ' }[base.plan] || base.plan) : 'chưa có — phần không ghi chia theo pháp luật') + '.',
        'Tài sản giao cụ thể: ' + (Object.keys(w.specific).length ? Object.keys(w.specific).map(function (k) { var a = assets(l).find(function (x) { return x.key === k; }); return (a ? a.n : 'tài sản không còn') + ' → ' + (nameOf(l, w.specific[k]) || 'người nhận không còn'); }).join('; ') : 'chưa có') + '.',
        'Không cho hưởng thừa kế: ' + (w.exclude.length ? w.exclude.map(function (k) { return nameOf(l, k) || 'không còn'; }).join(', ') : 'không') + '.',
        'Người thi hành di chúc: ' + (w.executor ? w.executor.name : 'chưa chỉ định') + '.',
        'Nợ hiện tại ' + mo(l, debt) + ' sẽ được trả từ di sản trước khi chia. Tài sản đã tặng người khác không còn trong di sản.'];
      if (vn(l)) lines.push('Theo luật Việt Nam, vợ/chồng và con chưa thành niên luôn được ít nhất 2/3 một suất thừa kế theo pháp luật dù di chúc ghi khác.');
      return lines.join('\n');
    },
    function (l) {
      var rows = [{ k: 'ratio', l: 'Viết / sửa tỷ lệ chia và lời nhắn', run: function (l, r) { var d = E.DEC.di_chuc.make(l); d.manual = true; l.pending.unshift(d); } },
        { k: 'specific', l: 'Giao tài sản cụ thể cho từng người', why: assets(l).length ? true : 'Chưa có tài sản hiện vật để giao', run: function (l, r) { X.next(l, 'will150_asset', r); } },
        { k: 'exclude', l: 'Không cho một người con hưởng thừa kế', why: heirKeys(l).some(function (h) { return h.kid != null; }) ? true : 'Chưa có con', run: function (l, r) { X.next(l, 'will150_exclude', r); } },
        { k: 'executor', l: 'Chỉ định người thi hành di chúc', run: function (l, r) { X.next(l, 'will150_executor', r); } }];
      if (companies(l).length) rows.push({ k: 'manage', l: 'Giao quyền điều hành doanh nghiệp (khác với quyền sở hữu)', run: function (l, r) { X.next(l, 'will150_manage', r); } });
      rows.push({ k: 'clear', l: 'Xóa các điều khoản chi tiết', why: Object.keys(W(l).specific).length || W(l).exclude.length || W(l).executor || Object.keys(W(l).manage).length ? true : 'Chưa có điều khoản chi tiết', run: function (l, r, log) { delete l.flags.will150; log('Bạn xóa các điều khoản chi tiết trong di chúc; tỷ lệ chia giữ nguyên.', 'neutral'); } });
      return rows;
    }, 18, 'Tiền bạc');
  X.menu('will150_asset', 'Giao tài sản cụ thể', function (l) { return l.alive && l.age >= 18 ? true : 'Từ 18 tuổi'; },
    'Món được giao cụ thể tính vào phần hưởng của người nhận; nếu giá trị vượt phần hưởng, người nhận bù chênh lệch cho những người khác. Nếu di sản không đủ trả nợ, tài sản có thể phải bán.',
    function (l) { var w = W(l); return assets(l).slice(0, 30).map(function (a) { return { k: a.key, l: a.n + ' · ' + mo(l, a.v) + (w.specific[a.key] ? ' → ' + (nameOf(l, w.specific[a.key]) || '?') : ''), run: function (l, r) { X.next(l, 'will150_to', r, { asset: a.key }); } }; }); });
  X.menu('will150_to', 'Người nhận tài sản', function (l) { return l.alive && l.age >= 18 ? true : 'Từ 18 tuổi'; },
    function (l, d) { var a = assets(l).find(function (x) { return x.key === (d && d.arg && d.arg.asset); }); return a ? 'Giao ' + a.n + ' (' + mo(l, a.v) + ') cho:' : 'Tài sản không còn.'; },
    function (l, arg) {
      var a = assets(l).find(function (x) { return x.key === arg.asset; }); if (!a) return [];
      var w = W(l), rows = heirKeys(l).map(function (h) { return { k: h.key, l: h.name + (h.spouse ? ' (bạn đời)' : ' (con)'), why: w.exclude.indexOf(h.key) >= 0 ? 'Người này đang bị ghi không hưởng thừa kế' : true, run: function (l, r, log) { W(l).specific[a.key] = h.key; log('Di chúc: ' + a.n + ' giao cho ' + h.name + '.', 'neutral'); } }; });
      if (w.specific[a.key]) rows.push({ k: 'none', l: 'Bỏ chỉ định, chia theo tỷ lệ', run: function (l, r, log) { delete W(l).specific[a.key]; log('Di chúc: ' + a.n + ' chia theo tỷ lệ chung.', 'neutral'); } });
      return rows;
    });
  X.menu('will150_exclude', 'Người không được hưởng thừa kế', function (l) { return l.alive && l.age >= 18 ? true : 'Từ 18 tuổi'; },
    function (l) { return 'Chỉ áp dụng với con đã trưởng thành.' + (vn(l) ? ' Theo luật Việt Nam, con chưa thành niên và vợ/chồng vẫn được ít nhất 2/3 một suất thừa kế; điều khoản trái luật sẽ không có hiệu lực.' : '') + ' Người bị loại thường dễ khởi kiện tranh chấp.'; },
    function (l) {
      var w = W(l);
      return heirKeys(l).filter(function (h) { return h.kid != null; }).map(function (h) { var on = w.exclude.indexOf(h.key) >= 0; return { k: h.key, l: (on ? 'Khôi phục quyền thừa kế cho ' : 'Không cho ') + h.name + (on ? '' : ' hưởng thừa kế'), why: on || h.adult ? true : 'Con chưa thành niên luôn được hưởng thừa kế', run: function (l, r, log) { var x = W(l); if (on) x.exclude.splice(x.exclude.indexOf(h.key), 1); else { x.exclude.push(h.key); Object.keys(x.specific).forEach(function (k) { if (x.specific[k] === h.key) delete x.specific[k]; }); } log('Di chúc: ' + h.name + (on ? ' được khôi phục quyền thừa kế.' : ' không được hưởng thừa kế.'), 'neutral'); } }; });
    });
  X.menu('will150_executor', 'Người thi hành di chúc', function (l) { return l.alive && l.age >= 18 ? true : 'Từ 18 tuổi'; },
    'Người thi hành di chúc quản lý việc phân chia, không trở thành chủ sở hữu di sản. Văn phòng luật độc lập làm giảm nguy cơ tranh chấp, thu phí khoảng 1% di sản.',
    function (l) {
      var rows = heirKeys(l).filter(function (h) { return h.spouse || h.adult; }).map(function (h) { return { k: h.key, l: h.name, run: function (l, r, log) { W(l).executor = { key: h.key, name: h.name, kind: h.spouse ? 'spouse' : 'kid' }; log('Di chúc: ' + h.name + ' là người thi hành.', 'neutral'); } }; });
      (l.friends || []).filter(function (f) { return f.alive !== false; }).slice(0, 3).forEach(function (f) { rows.push({ k: 'f:' + f.name, l: f.name + ' (bạn thân)', run: function (l, r, log) { W(l).executor = { key: 'f:' + f.name, name: f.name, kind: 'friend' }; log('Di chúc: ' + f.name + ' là người thi hành.', 'neutral'); } }); });
      rows.push({ k: 'lawyer', l: 'Văn phòng luật độc lập (phí khoảng 1% di sản)', run: function (l, r, log) { W(l).executor = { key: 'lawyer', name: 'Văn phòng luật độc lập', kind: 'lawyer' }; log('Di chúc: giao văn phòng luật độc lập thi hành.', 'neutral'); } });
      return rows;
    });
  X.menu('will150_manage', 'Quyền điều hành doanh nghiệp', function (l) { return l.alive && l.age >= 18 ? true : 'Từ 18 tuổi'; },
    'Quyền điều hành là vị trí quản lý; cổ phần (quyền sở hữu) vẫn chia theo di chúc và pháp luật. Người được giao điều hành vẫn có thể từ chối.',
    function (l) {
      var rows = [];
      companies(l).slice(0, 6).forEach(function (c) { var key = 'company:' + X.uid(l, c); heirKeys(l).filter(function (h) { return h.kid != null && h.adult; }).forEach(function (h) { rows.push({ k: key + '>' + h.key, l: h.name + ' điều hành ' + c.name + (W(l).manage[key] === h.key ? ' (đang chọn)' : ''), run: function (l, r, log) { W(l).manage[key] = h.key; log('Di chúc: ' + h.name + ' được giao điều hành ' + c.name + '; cổ phần vẫn chia theo tỷ lệ.', 'neutral'); } }); }); });
      return rows;
    });

  // ---- Áp điều khoản khi tính di sản (chỉ đọc; không đổi dữ liệu của người đã mất) ----
  var memo = typeof WeakMap === 'function' ? new WeakMap() : null;
  function spouseOwn(l) {
    var p = l.partner; if (!married(p) || !fresh(p)) return 0;
    var q = pools(l, p); return q.regime === 'separate' || q.regime === 'limited' ? 0 : q.pool * 0.5;
  }
  function derive(l, s) {
    if (!s || !(s.net > 0)) return s;
    var w = l.flags.will150, own = Math.min(s.net, spouseOwn(l));
    if (!w && own <= 0) return s;
    var at = l.death ? l.death.age : l.age, out = JSON.parse(JSON.stringify(s)), notes = out.notes || (out.notes = []), p = l.partner;
    // 1) Phần tài sản chung của vợ/chồng thuộc về vợ/chồng, không phải di sản
    if (own > 0) { var k = (s.net - own) / s.net; out.list.forEach(function (x) { x.amount *= k; }); out.law.forEach(function (x) { x.amount *= k; }); out.unassigned *= k; out.list.push({ name: p.name, amount: own, spouse: true, own150: true }); notes.push(p.name + ' nhận lại phần của mình trong tài sản chung (' + mo(l, own) + ') trước khi chia di sản.'); }
    var estate = s.net - own;
    // 2) Người con bị truất quyền (chỉ con đã trưởng thành; không áp dụng với người được luật bảo vệ)
    (w && w.exclude || []).forEach(function (key) {
      var i = +key.slice(1), kid = l.kids[i]; if (!kid || kid.alive === false) return;
      if (at - kid.born < 18) { notes.push('Điều khoản không cho ' + kid.name + ' hưởng thừa kế không có hiệu lực vì ' + kid.name + ' chưa thành niên.'); return; }
      var cut = 0; out.list = out.list.filter(function (x) { if (x.kid === i && !x.own150) { cut += x.amount; return false; } return true; }); out.law = out.law.filter(function (x) { if (x.kid === i) { cut += x.amount; return false; } return true; });
      var rest = out.law.length ? out.law : out.list.filter(function (x) { return x.kid != null || x.spouse && !x.own150; });
      if (cut > 0 && rest.length) { var tot = rest.reduce(function (n, x) { return n + x.amount; }, 0); rest.forEach(function (x) { x.amount += tot > 0 ? cut * x.amount / tot : cut / rest.length; }); notes.push(kid.name + ' không được hưởng thừa kế theo di chúc.'); }
      else if (cut > 0) { out.list.push({ name: kid.name, amount: cut, kid: i }); notes.push('Không còn người thừa kế khác nên phần của ' + kid.name + ' vẫn giữ nguyên.'); }
    });
    // 3) Việt Nam: vợ/chồng còn sống được ít nhất 2/3 suất thừa kế theo pháp luật
    if (vn(l) && married(p) && p.status === 'married' && estate > 0) {
      var heirs = heirKeys(l).length, floor = heirs ? estate / heirs * 2 / 3 : 0, got = out.list.concat(out.law).filter(function (x) { return x.spouse && !x.own150; }).reduce(function (n, x) { return n + x.amount; }, 0);
      if (floor - got > 1e-6) { var need = floor - got, pool = out.list.concat(out.law).filter(function (x) { return !x.spouse && !(x.kid != null && at - l.kids[x.kid].born < 18); }), tt = pool.reduce(function (n, x) { return n + x.amount; }, 0); var take = Math.min(need, tt); if (tt > 0) pool.forEach(function (x) { x.amount -= take * x.amount / tt; }); out.list.push({ name: p.name, amount: take, spouse: true }); notes.push(p.name + ' được bảo đảm ít nhất 2/3 suất thừa kế theo pháp luật.'); }
    }
    // 4) Phí thi hành di chúc của văn phòng luật
    if (w && w.executor && w.executor.kind === 'lawyer' && estate > 0) { var fee = estate * 0.01, all = out.list.concat(out.law).filter(function (x) { return !x.own150; }), sum = all.reduce(function (n, x) { return n + x.amount; }, 0); if (sum > 0) { all.forEach(function (x) { x.amount -= fee * x.amount / sum; }); out.list.push({ name: 'Văn phòng luật thi hành di chúc', amount: fee, other: true, fee150: true }); } }
    out.list = out.list.filter(function (x) { return x.amount > 1e-9; }); out.law = out.law.filter(function (x) { return x.amount > 1e-9; });
    return out;
  }
  if (E.WILL70) {
    var est = E.WILL70.estate;
    E.WILL70.estate = function (l) { var s = est.apply(this, arguments); if (!s || !l.flags || !(l.flags.will150 || married(l.partner) && fresh(l.partner))) return s; if (memo && memo.has(s)) return memo.get(s); var d = derive(l, s); if (memo) memo.set(s, d); return d; };
  }
  // Hiện vật: đồ sưu tầm vào di sản; tài sản được giao cụ thể đi trước khi chia theo tỷ lệ
  if (E.BUSINESS137) {
    var estateItems = E.BUSINESS137.estateItems, allocateCompanies = E.BUSINESS137.allocateCompanies;
    E.BUSINESS137.estateItems = function (l) {
      var a = estateItems.apply(this, arguments);
      if (l.flags && l.flags.elite148) C.mine(l).forEach(function (x) { if (x.value > 0.5) a.push({ t: 'item148', n: x.name, v: x.value, data: { cat: x.cat, name: x.name, buy: x.buy, value: x.value, uid: x.uid110 } }); });
      return a;
    };
    E.BUSINESS137.allocateCompanies = function (l, hs, items) {
      var w = l.flags && l.flags.will150, rest = items;
      if (w && Object.keys(w.specific).length) {
        rest = []; var room = Math.max(0, hs.net) - hs.list.reduce(function (n, p) { return n + p.items.reduce(function (m, y) { return m + y.v; }, 0); }, 0);
        items.forEach(function (x) {
          var key = x.t === 'home' ? 'home' : x.t === 'prop' && x.data && x.data.uid110 ? 'prop:' + x.data.uid110 : x.t === 'venture' && x.data && x.data.uid110 ? 'venture:' + x.data.uid110 : x.t === 'company137' && x.data && x.data.uid110 ? 'company:' + x.data.uid110 : x.t === 'item148' ? 'item:' + x.data.uid : null;
          var to = key && w.specific[key], p = to && hs.list.find(function (h) { return h.key === to; });
          if (p && x.v <= room + 1e-9) { room -= x.v; p.items.push(x); x.to = p.key; x.specific150 = true; } else rest.push(x); /* di sản không đủ (nợ lớn) thì món đó quay về luồng chia / bán thông thường */
        });
      }
      return allocateCompanies.call(this, l, hs, rest);
    };
  }

  // ---- Tranh chấp di chúc, quyền điều hành: truyền sang đời con ----
  function disputeOf(l) {
    var base = l.flags.will70, w = l.flags.will150; if (!base && !w) return null;
    var s = E.WILL70 && E.WILL70.estate ? E.WILL70.estate(l) : null; if (!s || !(s.net > 0)) return null;
    var kids = (l.kids || []).map(function (k, i) { return { i: i, name: k.name, got: s.list.concat(s.law).filter(function (x) { return x.kid === i; }).reduce(function (n, x) { return n + x.amount; }, 0) }; }).filter(function (x) { return l.kids[x.i].alive !== false; });
    if (kids.length < 2) return null;
    var max = Math.max.apply(null, kids.map(function (x) { return x.got; })), min = Math.min.apply(null, kids.map(function (x) { return x.got; }));
    var uneven = (w && w.exclude.length) || max > 0 && min < max * 0.5; if (!uneven) return null;
    var ex = w && w.executor, p = 0.45 * (ex ? ex.kind === 'lawyer' ? 0.35 : 0.7 : 1) * (base && base.note ? 0.85 : 1);
    var rnd = seeded(l.id + ':dispute150');
    if (rnd() >= p) return { happened: false, chance: p };
    var low = kids.slice().sort(function (a, b) { return a.got - b.got; })[0], adjust = rnd() < 0.45, gap = (max - min) * 0.15;
    return { happened: true, chance: p, claimant: low.i, claimantName: low.name, adjusted: adjust, amount: adjust ? gap : 0, mean: kids.reduce(function (n, x) { return n + x.got; }, 0) / kids.length, shares: kids };
  }
  var fin = E.finale;
  E.finale = function (l) {
    var st = fin.apply(this, arguments);
    if (l.alive || !l.death || l.death.age < 18) return st;
    var w = l.flags.will150, d = disputeOf(l), lines = [];
    if (w && w.executor) lines.push(w.executor.name + ' thi hành di chúc (quản lý việc phân chia, không phải chủ sở hữu di sản).');
    if (w) Object.keys(w.manage).forEach(function (key) { var c = companies(l).find(function (x) { return 'company:' + x.uid110 === key; }), h = heirKeys(l).find(function (x) { return x.key === w.manage[key]; }); if (c && h) lines.push(h.name + ' được giao điều hành ' + c.name + '; cổ phần chia theo di chúc.'); });
    if (d && d.happened) lines.push(d.claimantName + ' khởi kiện vì cho rằng phần chia chưa công bằng. ' + (d.adjusted ? 'Sau hòa giải, những người thừa kế khác bù thêm cho ' + d.claimantName + ' ' + mo(l, d.amount) + '.' : 'Tòa giữ nguyên di chúc.'));
    var s = E.WILL70 && E.WILL70.estate ? E.WILL70.estate(l) : null; if (s && s.notes && s.notes.length) lines = lines.concat(s.notes.filter(function (n) { return /tài sản chung|không được hưởng|2\/3 suất|không có hiệu lực|vẫn giữ nguyên/.test(n); }));
    if (lines.length) st.push({ h: 'Thi hành di chúc', x: 'Các điều khoản chi tiết trong di chúc được thực hiện.', list: lines });
    return st;
  };
  var childOpts = E.childOpts;
  E.childOpts = function (l, k) {
    var o = childOpts.apply(this, arguments), i = (l.kids || []).indexOf(k), w = l.flags.will150;
    if (!l.alive && l.death && o.parent) {
      var d = disputeOf(l), extra = {};
      if (d && d.happened && d.adjusted && d.amount > 0) { var mine = d.shares.find(function (x) { return x.i === i; }); if (mine) extra.dispute = { at: 1 + (seeded(l.id + ':d2')() < 0.5 ? 1 : 0), amount: i === d.claimant ? d.amount : -Math.min(d.amount / Math.max(1, d.shares.length - 1), mine.got), name: d.claimantName, cur: l.cur, base: l.base }; }
      if (w) { var m = []; Object.keys(w.manage).forEach(function (key) { var c = companies(l).find(function (x) { return 'company:' + x.uid110 === key; }), h = heirKeys(l).find(function (x) { return x.key === w.manage[key]; }); if (c && h) m.push({ company: c.name, manager: h.name, self: h.kid === i }); }); if (m.length) extra.manage = m; }
      if (Object.keys(extra).length) o.parent.will150 = extra;
    }
    return o;
  };
  var createLife = E.createLife;
  E.createLife = function (opts) { var life = createLife.apply(this, arguments), x = opts && opts.parent && opts.parent.will150; if (x) { var y = JSON.parse(JSON.stringify(x)); if (y.dispute && y.dispute.cur !== life.cur) y.dispute.amount *= life.base / y.dispute.base; if (y.dispute) { var f = life.flags.heirOf, h = opts.parent.heir; y.dispute.age = (f && Number.isFinite(f.at) ? f.at : h && Number.isFinite(h.at) ? h.at : life.age) + y.dispute.at; } life.flags.heirWill150 = y; } return life; };
  function heirYear(l, r, log) {
    var x = l.flags.heirWill150, f = l.flags.heirOf;
    // Đồ sưu tầm được thừa kế vào sổ tài sản của người nhận (một lần)
    if (f && f.items && f.itemsDone && !f.items150 && l.age >= 18) {
      f.items150 = true;
      f.items.filter(function (y) { return y.t === 'item148' && y.data; }).forEach(function (y) { C.addItem(l, { cat: y.data.cat, name: y.data.name, buy: y.data.value > 0 ? y.data.buy * y.v / y.data.value : y.v, value: y.v, from: 'thừa kế' }); log('Bạn nhận ' + y.n + ' (' + mo(l, y.v) + ') trong phần thừa kế.', 'good'); });
      var p = l.partner; if (married(p) && fresh(p)) p.marital150.inherited += f.items.reduce(function (n, y) { return n + (y.v || 0); }, 0);
    }
    if (!x) return;
    if (x.manage && f && f.itemsDone && !x.manageDone) {
      x.manageDone = true;
      x.manage.forEach(function (m) {
        var c = companies(l).find(function (y) { return y.name === m.company; }); if (!c) return;
        if (m.self) { if (E.BUSINESS133) E.BUSINESS133.ensure(c).roles.ceo = { kind: 'self', since: l.age }; log('Theo di chúc, bạn được giao điều hành ' + m.company + '; quyền sở hữu vẫn theo phần cổ phần bạn nhận.', 'neutral'); return; }
        var sib = (l.sibList || []).concat(l.flags.futureSibs || []).find(function (s) { return (s.name || s.n) === m.manager && s.alive !== false; }); if (!sib || !E.BUSINESS133) return; /* anh chị em trong đời con dùng trường n */
        E.BUSINESS133.ensure(c).roles.ceo = { kind: 'relative', personId: X.uid(l, sib), name: sib.name || sib.n, skill: 0.6, since: l.age };
        log('Theo di chúc, ' + (sib.name || sib.n) + ' điều hành ' + m.company + '; phần cổ phần của bạn vẫn là của bạn.', 'neutral');
      });
    }
    var dd = x.dispute; if (dd && !dd.done && l.age >= dd.age) {
      dd.done = true;
      if (dd.amount > 0) { H.cash(l, dd.amount, 'Hòa giải tranh chấp thừa kế'); log('Vụ tranh chấp di chúc khép lại: bạn được các anh chị em bù thêm ' + mo(l, dd.amount) + '.', 'good'); }
      else if (dd.amount < 0) { var pay = Math.min(-dd.amount, Math.max(0, l.money)); H.cash(l, -pay, 'Hòa giải tranh chấp thừa kế'); log('Vụ tranh chấp di chúc với ' + dd.name + ' khép lại: bạn góp ' + mo(l, pay) + ' bù cho ' + dd.name + '.', 'neutral'); }
    }
  }

  // ===================================================================
  // Vòng năm
  // ===================================================================
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive) return;
    var p = l.partner;
    if (married(p) && !p.marital150) p.marital150 = p.since === l.age ? { since: l.age, pre: Math.max(0, E.netWorth(l)), inherited: 0, cur: l.cur, regime: regimeOf(p) } : { legacy: true };
    if (l.flags.marital150) courtYear(l, r, log);
    heirYear(l, r, log);
  });

  E.MARITAL150 = { REGIME: REGIME, regimeOf: regimeOf, pools: pools, ratio: ratio, payOut: payOut, divorceSplit: divorceSplit, prenup: prenup, prenupChance: prenupChance, startMarriage: startMarriage, courtYear: courtYear, cases: function (l) { return S(l).cases; } };
  E.WILL150 = { W: W, assets: assets, heirKeys: heirKeys, derive: derive, dispute: disputeOf, spouseOwn: spouseOwn, heirYear: heirYear };
})(globalThis.G);
