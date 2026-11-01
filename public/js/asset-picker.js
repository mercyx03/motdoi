/* Bộ chọn tài sản dùng chung cho bán, tặng con và giao tài sản trong di chúc.
   · Trước đây: "Bán nhà cho thuê / sang nhượng" chỉ bán được tài sản ĐẦU TIÊN trong danh sách (wealth.js);
     di chúc chỉ hiện 30 tài sản đầu (life150) và mọi menu UPDATE110 cắt cứng 54 dòng → tài sản phía sau không chọn được.
   · Nay: lọc theo nhóm giá trị quy đổi USD (khoảng liên tục [min, max)), loại, trạng thái, tìm theo tên/địa điểm, sắp xếp,
     phân trang 20 mục; mỗi trang chỉ dựng 20 dòng nên không render hàng nghìn nút.
   · Tỷ giá chốt một lần khi mở danh sách (arg.fx) và đi theo mọi bước lọc/chuyển trang của lượt đó.
   · Tài sản và người nhận dùng ID ổn định (uid110), không so tên. Xác nhận luôn kiểm tra lại trong handler. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, C = G.CUR;
  var PAGE = 20; // số tài sản mỗi trang
  // Nhóm giá trị theo USD danh nghĩa. Ranh giới nửa mở: tài sản 5,8 triệu USD thuộc nhóm [1; 6) triệu, không bị bỏ sót.
  var M = 1e6, BUCKETS = [
    { k: 'b0', min: 0, max: 1 * M, n: 'Dưới 1 triệu USD', hint: 'dưới 1 triệu' },
    { k: 'b1', min: 1 * M, max: 6 * M, n: '1–5 triệu USD', hint: 'từ 1 đến dưới 6 triệu' },
    { k: 'b2', min: 6 * M, max: 16 * M, n: '6–15 triệu USD', hint: 'từ 6 đến dưới 16 triệu' },
    { k: 'b3', min: 16 * M, max: 31 * M, n: '16–30 triệu USD', hint: 'từ 16 đến dưới 31 triệu' },
    { k: 'b4', min: 31 * M, max: 51 * M, n: '31–50 triệu USD', hint: 'từ 31 đến dưới 51 triệu' },
    { k: 'b5', min: 51 * M, max: 101 * M, n: '51–100 triệu USD', hint: 'từ 51 đến dưới 101 triệu' },
    { k: 'b6', min: 101 * M, max: 251 * M, n: '101–250 triệu USD', hint: 'từ 101 đến dưới 251 triệu' },
    { k: 'b7', min: 251 * M, max: 501 * M, n: '251–500 triệu USD', hint: 'từ 251 đến dưới 501 triệu' },
    { k: 'b8', min: 501 * M, max: 1001 * M, n: '501–1.000 triệu USD', hint: 'từ 501 đến dưới 1.001 triệu' },
    { k: 'b9', min: 1001 * M, max: Infinity, n: 'Trên 1 tỷ USD', hint: 'từ 1.001 triệu trở lên' }];
  var KINDS = { home: 'Nhà đang ở', residence: 'Nhà ở khác', rental: 'Bất động sản cho thuê', business: 'Cơ sở kinh doanh', company: 'Cổ phần doanh nghiệp', item: 'Hiện vật, sưu tầm' };
  var STATUS = { own: 'Đang sở hữu, sử dụng', rented: 'Đang cho thuê', vacant: 'Cho thuê, đang trống', mortgaged: 'Đang thế chấp / vay', operating: 'Đang kinh doanh', shares: 'Cổ phần' };
  var SORTS = [['vd', 'Giá trị giảm dần'], ['va', 'Giá trị tăng dần'], ['n', 'Tên A→Z']];

  // Giá trị nội bộ của game → USD danh nghĩa. Dùng cùng công thức hiển thị của currency.js (không thêm tỷ giá cứng).
  function fxFactor(l) {
    if (l.cur === 'vnd') return 1e6 / C.VND; // đơn vị nội bộ: triệu đồng
    var code = l.country, gdp = l.gdp;
    if (l.abroad && l.abroad.perm && G.W && G.W.BY[l.abroad.code]) { code = l.abroad.code; gdp = G.W.BY[l.abroad.code].gdp; }
    return C.priceLevel(gdp || 20); // USD sức mua → USD danh nghĩa
  }
  function bucketOf(usd) { for (var i = 0; i < BUCKETS.length; i++) if (usd >= BUCKETS[i].min && usd < BUCKETS[i].max) return BUCKETS[i]; return BUCKETS[0]; }
  function homeDebt(l) { return (l.mortgage || 0) + (l.loans || []).filter(function (x) { return x.type === 'home'; }).reduce(function (a, x) { return a + (x.bal || 0); }, 0); }
  function place(l, o) { return o && (o.city || o.place) || l.movedTo || l.city || l.place || ''; }

  // Danh mục chuẩn hóa. key trùng khóa di chúc của life150 để thi hành di chúc nhận đúng tài sản.
  function all(l) {
    var out = [];
    if (l.ownHouse && (l.houseVal || 0) > 0) out.push({ key: 'home', id: 'home', kind: 'home', n: l.houseName || 'Căn nhà đang ở', place: place(l), v: l.houseVal, status: homeDebt(l) > 0 ? 'mortgaged' : 'own', debt: homeDebt(l) });
    (l.props || []).forEach(function (p) { if (!((p.v || 0) > 0)) return; var id = X.uid(l, p); out.push({ key: 'prop:' + id, id: id, kind: p.residential112 ? 'residence' : 'rental', n: p.n, place: place(l, p), v: p.v, basis: p.basis, status: p.residential112 ? 'own' : p.empty > 0 ? 'vacant' : 'rented', obj: p }); });
    (l.ventures || []).forEach(function (v) { if (!((v.cap || 0) > 0)) return; var id = X.uid(l, v); out.push({ key: 'venture:' + id, id: id, kind: 'business', n: v.n, place: place(l, v), v: v.cap, status: 'operating', obj: v }); });
    if (E.WILL150) E.WILL150.assets(l).forEach(function (a) {
      if (/^company:/.test(a.key)) out.push({ key: a.key, id: a.key.slice(8), kind: 'company', n: a.n, place: a.company && a.company.city || '', v: a.v, status: 'shares' });
      else if (/^item:/.test(a.key)) out.push({ key: a.key, id: a.key.slice(5), kind: 'item', n: a.n, place: '', v: a.v, status: 'own' });
    });
    return out;
  }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
  function view(l, list, arg) {
    var fx = Number.isFinite(arg.fx) && arg.fx > 0 ? arg.fx : fxFactor(l);
    list.forEach(function (a) { a.usd = a.v * fx; a.bucket = bucketOf(a.usd).k; });
    var q = norm(arg.q).trim(), f = list.filter(function (a) { return (!arg.kind || a.kind === arg.kind) && (!arg.status || a.status === arg.status) && (!q || norm(a.n + ' ' + a.place).indexOf(q) >= 0); });
    var counts = {}; BUCKETS.forEach(function (b) { counts[b.k] = { n: 0, v: 0 }; }); f.forEach(function (a) { counts[a.bucket].n++; counts[a.bucket].v += a.v; });
    var shown = f.filter(function (a) { return !arg.bucket || a.bucket === arg.bucket; }), s = arg.sort || 'vd';
    shown.sort(function (a, b) { return s === 'va' ? a.v - b.v || (a.n < b.n ? -1 : 1) : s === 'n' ? (a.n < b.n ? -1 : a.n > b.n ? 1 : b.v - a.v) : b.v - a.v || (a.n < b.n ? -1 : 1); });
    var pages = Math.max(1, Math.ceil(shown.length / PAGE)), page = U.clamp(arg.page | 0, 0, pages - 1);
    return { fx: fx, all: list, filtered: f, shown: shown, counts: counts, page: page, pages: pages, items: shown.slice(page * PAGE, page * PAGE + PAGE) };
  }
  function money(l, v, fx) { return H.money(l, v) + (l.cur === 'vnd' || l.country !== 'US' ? ' (≈ ' + U.fmtNum(Math.round(v * fx)) + ' USD)' : ''); }
  function summary(l, arg, src) {
    var V = view(l, src(l), arg), tot = V.filtered.reduce(function (n, a) { return n + a.v; }, 0), b = arg.bucket && BUCKETS.find(function (x) { return x.k === arg.bucket; });
    var empty = BUCKETS.filter(function (x) { return !V.counts[x.k].n; }).map(function (x) { return x.n; });
    return 'Có ' + V.all.length + ' tài sản hợp lệ' + (V.filtered.length !== V.all.length ? ', ' + V.filtered.length + ' khớp bộ lọc' : '') + ' · tổng ' + money(l, tot, V.fx) + '.' +
      (b ? ' Nhóm ' + b.n + ' (' + b.hint + ' USD): ' + V.shown.length + ' tài sản.' : '') +
      (arg.q ? ' Tìm: “' + arg.q + '”.' : '') + (arg.kind ? ' Loại: ' + KINDS[arg.kind] + '.' : '') + (arg.status ? ' Trạng thái: ' + STATUS[arg.status] + '.' : '') +
      ' Sắp xếp: ' + SORTS.find(function (x) { return x[0] === (arg.sort || 'vd'); })[1] + '. Trang ' + (V.page + 1) + '/' + V.pages + '.' +
      (V.shown.length ? '' : ' Không có tài sản nào khớp — hãy nới bộ lọc hoặc xóa tìm kiếm.') +
      (empty.length && empty.length < BUCKETS.length ? ' Nhóm chưa có tài sản: ' + empty.join(', ') + '.' : '') +
      ' Quy đổi USD theo tỷ giá chốt lúc mở danh sách' + (l.cur === 'vnd' ? ' (1 USD ≈ ' + U.fmtNum(C.VND) + ' đ)' : '') + '; nhóm dùng khoảng [từ; đến) nên giá trị lẻ như 5,8 triệu USD vẫn thuộc nhóm 1–5 triệu.';
  }
  // Dòng điều hướng + dòng tài sản của trang hiện tại (≤ 40 dòng, dưới trần 54 của UPDATE110).
  function rows(id, l, arg, src, pick, label) {
    var V = view(l, src(l), arg), base = Object.assign({}, arg, { fx: V.fx, picker912: true });
    function go(k, l2, ch) { return { k: k, l: l2, run: function (l, r) { X.next(l, id, r, Object.assign({}, base, ch)); } }; }
    var out = V.items.map(function (a) { var x = pick(l, a, base); return { k: 'a:' + a.key, l: (label ? label(l, a) : a.n) + ' · ' + H.money(l, a.v), h: [a.place, KINDS[a.kind], STATUS[a.status], '≈ ' + U.fmtNum(Math.round(a.usd)) + ' USD', x.h].filter(Boolean).join(' · '), why: x.why, run: x.run }; });
    if (V.page > 0) out.push(go('pg:prev', '‹ Trang trước (' + V.page + '/' + V.pages + ')', { page: V.page - 1 }));
    if (V.page < V.pages - 1) out.push(go('pg:next', 'Trang sau › (' + (V.page + 2) + '/' + V.pages + ')', { page: V.page + 1 }));
    out.push(go('b:all', (arg.bucket ? '' : '✓ ') + 'Mọi mức giá · ' + V.filtered.length + ' tài sản', { bucket: null, page: 0 }));
    BUCKETS.forEach(function (b) { var c = V.counts[b.k]; if (c.n || arg.bucket === b.k) out.push(Object.assign(go('b:' + b.k, (arg.bucket === b.k ? '✓ ' : '') + b.n + ' · ' + c.n + ' tài sản · tổng ' + H.money(l, c.v), { bucket: b.k, page: 0 }), { h: 'Khoảng ' + b.hint + ' USD', why: c.n ? true : 'Nhóm này chưa có tài sản' })); });
    var kinds = Object.keys(KINDS).filter(function (k) { return V.all.some(function (a) { return a.kind === k; }); }), ki = kinds.indexOf(arg.kind);
    if (kinds.length > 1 || arg.kind) out.push(go('f:kind', 'Loại: ' + (arg.kind ? KINDS[arg.kind] : 'tất cả') + ' (bấm để đổi)', { kind: ki + 1 < kinds.length ? kinds[ki + 1] : null, page: 0 }));
    var sts = Object.keys(STATUS).filter(function (k) { return V.all.some(function (a) { return a.status === k; }); }), si = sts.indexOf(arg.status);
    if (sts.length > 1 || arg.status) out.push(go('f:status', 'Trạng thái: ' + (arg.status ? STATUS[arg.status] : 'tất cả') + ' (bấm để đổi)', { status: si + 1 < sts.length ? sts[si + 1] : null, page: 0 }));
    var so = SORTS.findIndex(function (x) { return x[0] === (arg.sort || 'vd'); });
    out.push(go('f:sort', 'Sắp xếp: ' + SORTS[so][1] + ' (bấm để đổi)', { sort: SORTS[(so + 1) % SORTS.length][0], page: 0 }));
    if (arg.q) out.push(go('f:q', 'Xóa tìm kiếm “' + arg.q + '”', { q: '', page: 0 }));
    return out;
  }
  // Menu có bộ chọn: text(l, arg) thêm phần giải thích riêng của từng luồng.
  function menu(id, title, why, intro, src, pick, min, group, label) {
    X.menu(id, title, why, function (l, d) { var arg = d && d.arg || {}; return (typeof intro === 'function' ? intro(l, arg) : intro) + '\n' + summary(l, arg, src); },
      function (l, arg) { return rows(id, l, arg || {}, src, pick, label); }, min, group);
    E.DEC[id].picker912 = true;
  }
  // Ô tìm kiếm: giao diện gọi requery khi người chơi gõ (có debounce ở app.js). Giữ nguyên token lượt hành động.
  function requery(l, q) {
    var d = l.pending && l.pending[0]; if (!d || !E.DEC[d.id] || !E.DEC[d.id].picker912) return null;
    var arg = Object.assign({}, d.data && d.data.arg || {}, { q: String(q || '').slice(0, 60), page: 0 });
    var n = E.DEC[d.id].make(l, U.rand(l), arg);
    ['requested', 'actionId850', 'actionYear850', 'deferredTurn894'].forEach(function (k) { if (d.data && d.data[k] != null) n.data[k] = d.data[k]; });
    n.manual = d.manual; l.pending[0] = n; return n;
  }

  // ===== 1. Bán tài sản đầu tư (thay danh sách chỉ bán được món đầu tiên) =====
  var FAM = E.FAMILY129;
  function tradesLeft(l) { return FAM ? 4 - FAM.trades(l, 'quan_ly_dau_tu') : 4; }
  function sellable(l) { return all(l).filter(function (a) { return a.kind === 'rental' || a.kind === 'residence' || a.kind === 'business'; }); }
  function salePrice(a) { return a.kind === 'business' ? a.v * 0.7 : a.v; }
  function willNote(l, key) { var w = l.flags.will150, to = w && w.specific && w.specific[key]; if (!to) return ''; var h = E.WILL150.heirKeys(l).find(function (x) { return x.key === to; }); return 'Đang được giao trong di chúc cho ' + (h ? h.name : 'người nhận không còn') + '; bán thì điều khoản đó hết hiệu lực.'; }
  function sellReason(l) { if (!l.alive) return 'Cuộc đời đã kết thúc'; if (!sellable(l).length) return 'Chưa có bất động sản cho thuê, nhà ở khác hoặc cơ sở kinh doanh'; if (tradesLeft(l) <= 0) return 'Đã đủ 4 giao dịch năm nay'; return true; }
  menu('sell912', 'Bán tài sản / sang nhượng cơ sở', sellReason,
    function (l) { return 'Chọn đúng tài sản muốn bán; bước sau xem giá, lãi/lỗ và hậu quả trước khi xác nhận. Giao dịch hoàn tất năm nay: ' + (4 - tradesLeft(l)) + '/4.'; },
    sellable, function (l, a, arg) { return { h: willNote(l, a.key), run: function (l, r) { X.next(l, 'sell912_ok', r, { key: a.key, fx: arg.fx, back: arg }); } }; }, 22, null);
  E.SC('sell912_ok', {
    title: 'Xác nhận bán tài sản',
    prep: function (l, r, arg) { return { at: l.age, arg: arg || {}, done: false }; },
    valid: function (l, d) { return sellReason(l) === true && (!d || !d.arg || !d.arg.key || sellable(l).some(function (a) { return a.key === d.arg.key; })) && (!d || d.at == null || d.at === l.age && !d.done); },
    text: function (l, d) {
      var a = sellable(l).find(function (x) { return x.key === (d.arg || {}).key; }); if (!a) return 'Tài sản không còn thuộc sở hữu của bạn.';
      var fx = d.arg.fx || fxFactor(l), price = salePrice(a), gain = a.kind === 'business' ? null : price - (a.basis != null ? a.basis : price);
      return a.n + (a.place ? ' tại ' + a.place : '') + '. Giá bán dự kiến ' + money(l, price, fx) + (a.kind === 'business' ? ' (sang nhượng khoảng 70% vốn đã bỏ)' : '') + '.' +
        (gain != null ? ' So với giá vốn: ' + (gain >= 0 ? 'lãi ' : 'lỗ ') + H.money(l, Math.abs(gain)) + '.' : '') +
        (a.kind === 'rental' ? ' Sau khi bán sẽ không còn tiền thuê từ tài sản này.' : a.kind === 'business' ? ' Cơ sở và các chi nhánh dừng tạo thu nhập cho bạn.' : '') +
        (willNote(l, a.key) ? ' ' + willNote(l, a.key) : '') + ' Tiền về tài khoản cá nhân của bạn một lần.';
    },
    opts: [{ k: 'confirm', l: 'Xác nhận bán', run: function (l, r, log, d) {
      if (!E.DEC.sell912_ok.valid(l, d)) return;
      var a = sellable(l).find(function (x) { return x.key === d.arg.key; }); if (!a) return;
      d.done = true; var price = salePrice(a);
      if (a.kind === 'business') { var vi = l.ventures.indexOf(a.obj); if (vi < 0) return; l.ventures.splice(vi, 1); if (price > 0) H.cash(l, price, 'Sang nhượng ' + a.n); log('Sang nhượng ' + a.n + ', thu về ' + H.money(l, price) + '.', 'neutral'); }
      else { var pi = l.props.indexOf(a.obj); if (pi < 0) return; l.props.splice(pi, 1); H.cash(l, price, 'Bán ' + a.n); var basis = a.basis != null ? a.basis : price; log('Bán ' + a.n + ' được ' + H.money(l, price) + ' (' + (price >= basis ? 'lãi ' + H.money(l, price - basis) : 'lỗ ' + H.money(l, basis - price)) + ').', price >= basis ? 'good' : 'bad'); }
      var w = l.flags.will150; if (w && w.specific && w.specific[a.key]) { delete w.specific[a.key]; log('Điều khoản di chúc giao ' + a.n + ' hết hiệu lực vì tài sản đã bán; phần giá trị nay nằm trong tiền mặt, chia theo tỷ lệ chung.', 'neutral'); }
      if (FAM) { FAM.trades(l, 'quan_ly_dau_tu'); var s = FAM.state(l).trades; s.quan_ly_dau_tu = (s.quan_ly_dau_tu || 0) + 1; }
      if (l.flags.estate65) delete l.flags.estate65;
    } }, { k: 'back', l: 'Quay lại danh sách', run: function (l, r, log, d) { if (d) d.done = true; X.next(l, 'sell912', r, d && d.arg && d.arg.back || {}); } }, { k: 'cancel', l: 'Thôi, cứ giữ', run: function (l, r, log, d) { if (d) d.done = true; } }]
  });
  // Hành động "Bán nhà cho thuê / sang nhượng cửa hàng" mở bộ chọn mới khi người chơi tự bấm; AI vẫn dùng tình huống cũ.
  var sellAct = E.ACT.find(function (a) { return a.id === 'quan_ly_dau_tu'; });
  if (sellAct) { sellAct.sc = 'sell912'; var av0 = sellAct.avail; sellAct.avail = function (l) { var x = sellReason(l); return x === true ? (av0 ? av0(l) : true) : x; }; }

  // ===== 2. Di chúc: giao tài sản cụ thể (bỏ giới hạn 30 món) =====
  if (E.WILL150) {
    var WL = E.WILL150;
    function heirName(l, key) { var h = WL.heirKeys(l).find(function (x) { return x.key === key; }); return h ? h.name : null; }
    menu('will150_asset', 'Giao tài sản cụ thể', function (l) { return l.alive && l.age >= 18 ? true : 'Từ 18 tuổi'; },
      'Món được giao cụ thể tính vào phần hưởng của người nhận; nếu giá trị vượt phần hưởng, người nhận bù chênh lệch cho những người khác. Nếu di sản không đủ trả nợ, tài sản có thể phải bán. Tài sản bán trước khi bạn mất thì điều khoản tự hết hiệu lực; người nhận mất trước thì món đó chia theo tỷ lệ chung.',
      all, function (l, a) { var to = WL.W(l).specific[a.key]; return { h: to ? '→ ' + (heirName(l, to) || 'người nhận không còn') : 'chưa giao', run: function (l, r) { X.next(l, 'will150_to', r, { asset: a.key }); } }; });
  }
  // ===== 3. Tặng tài sản cho con (bỏ trần 54 dòng) =====
  if (E.ASSETS112 && E.DEC.giftAsset112) {
    function giftList(l) { return E.ASSETS112.assets(l).map(function (a) { var key = a.kind === 'primary' ? 'home' : a.kind === 'venture' ? 'venture:' + a.id : 'prop:' + a.id, b = all(l).find(function (x) { return x.key === key; }); return b ? Object.assign({}, b, { gift: a }) : null; }).filter(Boolean); }
    menu('giftAsset112', 'Chọn tài sản tặng cho con', function (l) { return X.reason(l, 18) === true ? (l.indep ? true : 'Cần tự lập để giao dịch tài sản') : X.reason(l, 18); },
      function (l, arg) { var k = E.ASSETS112.children(l).find(function (k) { return X.uid(l, k) === arg.kid; }); return k ? 'Người nhận: ' + k.name + '. Chuyển nhượng trọn cơ sở gồm các chi nhánh; nhà được sang tên, con tự chọn có dọn tới hay không. Nhà đang thế chấp phải tất toán trước khi tặng.' : 'Người nhận không còn đủ điều kiện.'; },
      giftList, function (l, a, arg) {
        var fee = a.v * 0.01, ok = l.money >= fee + l.base * 0.3;
        return { h: 'Phí ' + H.money(l, fee), why: ok ? true : 'Thiếu phí và quỹ dự phòng', run: function (l, r, log) { giftOne(l, r, log, a.gift.id, arg.kid); } };
      });
    // Tặng một tài sản theo ID: dựng lại tình huống gốc của life112 (đã bị thay) bằng logic tương đương, kiểm tra lại mọi điều kiện.
    function giftOne(l, r, log, id, kidId) {
      var actual = E.ASSETS112.assets(l).find(function (x) { return x.id === id; }), kid = E.ASSETS112.children(l).find(function (k) { return X.uid(l, k) === kidId; });
      if (!actual || !kid || l.money < actual.value * 0.01 + l.base * 0.3) return;
      if (r() > U.clamp(0.5 + (kid.close || 50) / 200, 0.5, 0.95)) { log(kid.name + ' chưa sẵn sàng nhận và quản lý tài sản. Chưa sang tên hay thu phí.', 'neutral'); return; }
      H.cash(l, -actual.value * 0.01, 'Phí tặng tài sản');
      var payload = JSON.parse(JSON.stringify(actual.obj)), key = actual.kind === 'primary' ? 'home' : actual.kind === 'venture' ? 'venture:' + actual.id : 'prop:' + actual.id;
      if (actual.kind === 'primary') { l.ownHouse = false; l.houseVal = 0; l.houseName = null; l.houseK = null; l.houseTier = 0; }
      else if (actual.kind === 'venture') l.ventures = l.ventures.filter(function (v) { return X.uid(l, v) !== actual.id; });
      else l.props = l.props.filter(function (h) { return X.uid(l, h) !== actual.id; });
      (kid.gifts112 || (kid.gifts112 = [])).push({ id: actual.id, kind: actual.kind === 'primary' ? 'home' : actual.kind, data: payload, at: l.age - kid.born, cur: l.cur, base: l.base });
      delete l.flags.estate65; if (l.flags.will70) delete l.flags.will70.settlement;
      var w = l.flags.will150; if (w && w.specific && w.specific[key]) { delete w.specific[key]; log('Điều khoản di chúc với ' + actual.name + ' hết hiệu lực vì tài sản đã tặng.', 'neutral'); }
      log('Bạn sang tên ' + actual.name + ' cho ' + kid.name + '. Tài sản đã rời sở hữu của bạn, không còn nằm trong di sản.', 'big');
    }
  }

  // Quy đổi USD danh nghĩa → tiền nội bộ (dùng chung cho học phí, dịch vụ tính bằng USD).
  E.usdToLocal = function (l, usd) { return usd / fxFactor(l); };
  E.ASSET912 = { BUCKETS: BUCKETS, PAGE: PAGE, fxFactor: fxFactor, bucketOf: bucketOf, all: all, view: view, rows: rows, menu: menu, requery: requery, sellable: sellable, KINDS: KINDS, STATUS: STATUS };
})(globalThis.G);
