/* Một Đời — v2.3: tài sản đầu tư (tiết kiệm, vàng, cổ phiếu, đất, hụi/họ, bảo hiểm), sức khỏe tinh thần,
   đời riêng của con cái (học hành, nghề nghiệp, lạc lối, phụng dưỡng), học hành chi tiết (khối thi, điểm thi THPT, luyện thi, chuyển trường). */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function T(id, when, p, cd) { E.TRIG.push({ id: id, when: when, p: p, cd: cd || 0 }); }
  function A(id, g, label, o) { var x = { id: id, g: g, l: label }; for (var k in o) x[k] = o[k]; E.ACT.push(x); }
  function EV(c, p, run) { E.EVENTS.push({ c: c, p: p, run: run }); }
  function fx(l, o) { H.fx(l, o); }
  function cashB(l, x, why) { H.cash(l, x * l.base, why); }
  function mb(l, x) { return H.mb(l, x); }
  function mo(l, v) { return H.money(l, v); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped); }
  function pct(x) { return (x >= 0 ? '+' : '−') + Math.abs(Math.round(x * 100)) + '%'; }

  // ===================================================================
  // DỮ LIỆU MẶC ĐỊNH & NÂNG CẤP ĐỜI LƯU TỪ BẢN CŨ
  // ===================================================================
  function initKid(k) {
    if (k.close == null) k.close = 70;
    if (k.study == null) k.study = 50;
    if (k.edu == null) k.edu = 0;
    if (k.inc == null) k.inc = 0;
    return k;
  }
  E.migrateExt = function (l) {
    if (!l.assets) l.assets = { save: 0, gold: 0, stock: 0, land: 0 };
    if (!l.basis) l.basis = { save: 0, gold: 0, stock: 0, land: 0 };
    if (!l.mkt) l.mkt = { stock: 'bình thường', land: 'bình thường', landYrs: 0 };
    if (!l.mind) l.mind = { stress: 15 };
    (l.kids || []).forEach(initKid);
    return l;
  };

  // ===================================================================
  // 1. TÀI SẢN: TIẾT KIỆM · VÀNG · CỔ PHIẾU · ĐẤT
  // Lợi suất tính theo giá trị thực (đã trừ lạm phát) vì thu nhập cơ sở trong game không đổi theo thời gian.
  // ===================================================================
  var ASSET_NAME = { save: 'sổ tiết kiệm', gold: 'vàng', stock: 'cổ phiếu', land: 'đất' };
  var STOCK = { // trạng thái thị trường chứng khoán: [lợi suất trung bình, độ lệch, chuyển trạng thái]
    'tăng mạnh': [0.22, 0.12, { 'tăng mạnh': 0.55, 'bình thường': 0.3, 'sập': 0.15 }],
    'bình thường': [0.06, 0.12, { 'tăng mạnh': 0.18, 'bình thường': 0.65, 'đi xuống': 0.14, 'sập': 0.03 }],
    'đi xuống': [-0.14, 0.1, { 'bình thường': 0.5, 'đi xuống': 0.35, 'sập': 0.15 }],
    'sập': [-0.35, 0.1, { 'bình thường': 0.55, 'đi xuống': 0.25, 'tăng mạnh': 0.2 }]
  };
  var LAND = {
    'bình thường': [0.05, 0.05, { 'bình thường': 0.85, 'sốt': 0.12, 'đóng băng': 0.03 }],
    'sốt': [0.3, 0.1, { 'sốt': 0.55, 'vỡ bong bóng': 0.3, 'bình thường': 0.15 }],
    'vỡ bong bóng': [-0.3, 0.08, { 'đóng băng': 0.8, 'bình thường': 0.2 }],
    'đóng băng': [-0.03, 0.04, { 'đóng băng': 0.6, 'bình thường': 0.4 }]
  };
  function next(r, tbl) { return U.wkey(r, Object.keys(tbl).map(function (k) { return k + ':' + tbl[k]; }).join(',')); }
  function hasAssets(l) { return E.assetTotal(l) > 0.5; }
  function landSellable(l) { return l.mkt.land !== 'đóng băng' && l.mkt.land !== 'vỡ bong bóng'; }
  // bán tài sản: trả về số tiền thu về
  function sell(l, k, log, why, r) {
    var A = l.assets, v = A[k] || 0;
    if (v <= 0.5) return 0;
    var got = v;
    if (k === 'land' && !landSellable(l)) got = v * 0.8; // thị trường đóng băng: phải bán cắt lỗ
    if (k === 'stock' && l.mkt.stock === 'sập') got = v * 0.97;
    var b = l.basis[k] || v;
    H.cash(l, got, why || 'Bán ' + ASSET_NAME[k]);
    A[k] = 0; l.basis[k] = 0;
    if (log) log('Bán hết ' + ASSET_NAME[k] + ', thu về ' + mo(l, got) + ' (' + (got >= b ? 'lãi ' + mo(l, got - b) : 'lỗ ' + mo(l, b - got)) + ').', got >= b ? 'good' : 'bad');
    return got;
  }
  function buy(l, k, amt, log) {
    amt = Math.max(0, Math.min(amt, l.money));
    if (amt <= 0.5) return 0;
    l.money -= amt; l.assets[k] = (l.assets[k] || 0) + amt; l.basis[k] = (l.basis[k] || 0) + amt;
    return amt;
  }
  function idle(l) { return Math.max(0, l.money - l.base * 0.3); }

  SC('dau_tu', {
    title: 'Đầu tư',
    text: function (l) {
      return 'Bạn có ' + mo(l, l.money) + ' tiền mặt' + (hasAssets(l) ? ', cùng ' + mo(l, E.assetTotal(l)) + ' đang đầu tư' : '') + '. Thị trường chứng khoán đang ' + l.mkt.stock +
        ', đất đai ' + (l.mkt.land === 'sốt' ? 'đang SỐT — ai cũng bàn chuyện lướt đất' : l.mkt.land) + '.';
    },
    opts: [
      { k: 'saving', l: 'Gửi tiết kiệm có kỳ hạn', h: function (l) { return mo(l, idle(l) * 0.6) + ' · an toàn, lãi thấp'; }, ai: { w: 1.4 }, run: function (l, r, log) { var x = buy(l, 'save', idle(l) * 0.6); log(x > 0 ? 'Gửi ' + mo(l, x) + ' vào sổ tiết kiệm. Chậm mà chắc.' : 'Không còn tiền nhàn rỗi để gửi.', 'neutral'); } },
      { k: 'gold', l: 'Mua vàng tích trữ', h: function (l) { return mo(l, idle(l) * 0.5) + ' · giữ giá, lên xuống thất thường'; }, ai: { w: 1 }, run: function (l, r, log) { var x = buy(l, 'gold', idle(l) * 0.5); if (x > 0) log('Xếp hàng mua ' + mo(l, x) + ' vàng nhẫn cất tủ.', 'neutral'); } },
      { k: 'stock', l: 'Mua cổ phiếu', h: function (l) { return mo(l, idle(l) * 0.4) + ' · thị trường đang ' + l.mkt.stock; }, ai: { risk: 1, smart: 0.6 }, run: function (l, r, log) { var x = buy(l, 'stock', idle(l) * 0.4); if (x > 0) log('Mở tài khoản chứng khoán, giải ngân ' + mo(l, x) + '.' + (l.mkt.stock === 'tăng mạnh' ? ' Ai cũng đang lãi, bạn sợ lỡ tàu.' : ''), 'neutral'); fx(l, { hap: 1 }); } },
      { k: 'land', l: function (l) { return l.mkt.land === 'sốt' ? 'Lướt đất đang "sốt"' : 'Mua một lô đất'; }, h: function (l) { return mo(l, idle(l) * 0.8) + (l.mkt.land === 'sốt' ? ' · giá tăng từng tuần, cũng có thể vỡ bong bóng' : ' · tăng giá bền, khó bán khi thị trường đóng băng'); },
        req: function (l) { return idle(l) >= l.base * 0.8; }, ai: { risk: 1.2 }, run: function (l, r, log) { var x = buy(l, 'land', idle(l) * 0.8); if (x > 0) { log('Xuống tiền ' + mo(l, x) + ' mua một lô đất' + (l.mkt.land === 'sốt' ? ' giữa cơn sốt, cò đất gọi điện suốt ngày.' : '.'), 'neutral'); H.mem(l, 'Ngày cầm sổ đỏ lô đất đầu tiên.', 2); } } },
      { k: 'crypto', l: 'Đổ tiền vào tiền mã hóa', ai: { risk: 1.6 }, run: function (l, r, log) { var x = r(), m = Math.max(0, l.money) * 0.5; if (x < 0.15) { cashB(l, -m * 0.9 / l.base, 'Mất trắng tiền mã hóa'); log('Sàn tiền ảo sập, mất gần như toàn bộ.', 'bad'); fx(l, { hap: -15 }); H.mem(l, 'Ngày nhìn tài khoản tiền ảo về gần con số 0.', 5); } else if (x < 0.55) { cashB(l, -m * 0.4 / l.base, 'Lỗ tiền mã hóa'); log('Đu đỉnh, cắt lỗ đau đớn.', 'bad'); fx(l, { hap: -6 }); } else if (x < 0.92) { cashB(l, m * 0.5 / l.base, 'Lãi tiền mã hóa'); log('Tiền ảo tăng giá, lãi đậm.', 'good'); fx(l, { hap: 5 }); } else { cashB(l, m * 3 / l.base, 'Lãi lớn tiền mã hóa'); log('Gấp mấy lần vốn nhờ tiền mã hóa!', 'big'); fx(l, { hap: 12 }); } } },
      { k: 'no', l: 'Thôi, giữ tiền mặt cho chắc', ai: { w: 0.5 }, run: function (l, r, log) { log('Giữ tiền mặt, không đầu tư gì.', 'neutral'); } }
    ]
  });

  SC('ban_tai_san', {
    title: 'Bán / rút tài sản', valid: function (l) { return hasAssets(l) || !!l.ins; },
    text: function (l) {
      var A = l.assets, s = Object.keys(ASSET_NAME).filter(function (k) { return A[k] > 0.5; }).map(function (k) { var g = A[k] / (l.basis[k] || A[k]) - 1; return ASSET_NAME[k] + ' ' + mo(l, A[k]) + ' (' + pct(g) + ')'; });
      return 'Tài sản đang có: ' + (s.length ? s.join(' · ') : 'không có') + (l.ins ? ' · hợp đồng bảo hiểm (' + l.ins.name + ')' : '') + '.' + (!landSellable(l) && A.land > 0.5 ? ' Thị trường đất đang ' + l.mkt.land + ', bán lúc này phải cắt lỗ.' : '');
    },
    opts: ['save', 'gold', 'stock', 'land'].map(function (k) {
      return { k: k, l: function (l) { return 'Bán / rút ' + ASSET_NAME[k] + ' — ' + mo(l, l.assets[k]); }, req: function (l) { return l.assets[k] > 0.5; }, ai: { w: 0.5 }, run: function (l, r, log) { sell(l, k, log, null, r); } };
    }).concat([
      { k: 'ins', l: 'Hủy hợp đồng bảo hiểm trước hạn', h: 'Chỉ nhận lại một phần tiền đã đóng', req: function (l) { return !!l.ins; }, ai: { w: 0.2 }, run: function (l, r, log) { surrender(l, log); } },
      { k: 'keep', l: 'Thôi, cứ giữ', ai: { w: 1 }, run: function () { } }
    ])
  });

  // ---------- Hụi / họ ----------
  SC('choi_hui', {
    title: 'Rủ chơi hụi', prep: function (l, r) { return { c: Math.round(l.base * U.pick(r, [0.06, 0.08, 0.12]) * 10) / 10, who: pick(r, ['Cô Ba bán tạp hóa đầu hẻm', 'Bà chủ hụi trong xóm', 'Dì hàng xóm'].concat(l.job && !l.retired ? ['Chị đồng nghiệp ở công ty'] : [l.age >= 55 ? 'Bà bạn cùng hội người cao tuổi' : 'Chị bạn cùng xóm'])) }; },
    valid: function (l) { return !l.hui && l.indep; },
    text: function (l, d) { return d.who + ' rủ bạn vào một dây hụi 5 phần, mỗi năm góp ' + mo(l, d.c) + '. "Hốt hụi sớm thì có vốn làm ăn, hốt cuối thì như gửi tiết kiệm lãi cao!"'; },
    opts: [
      { k: 'early', l: 'Vào hụi, bỏ thăm hốt sớm để lấy vốn', h: 'Hốt ngay năm sau nhưng phải trả lãi ~15%', ai: { risk: 0.8, w: 0.8 }, run: function (l, r, log, d) { l.hui = { c: d.c, n: 5, y: 0, pos: 1, bid: 0.85, who: d.who }; log('Vào dây hụi của ' + d.who.toLowerCase() + ', định hốt sớm lấy vốn.', 'neutral'); } },
      { k: 'late', l: 'Vào hụi, hốt cuối lấy lãi', h: 'Như gửi tiết kiệm lãi cao — nếu hụi không vỡ', ai: { w: 1 }, run: function (l, r, log, d) { l.hui = { c: d.c, n: 5, y: 0, pos: 5, bid: 1.15, who: d.who }; log('Vào dây hụi của ' + d.who.toLowerCase() + ', để dành hốt cuối.', 'neutral'); } },
      { k: 'no', l: 'Thôi, nghe chuyện vỡ hụi nhiều rồi', ai: { w: 1.2, smart: 0.5 }, run: function (l, r, log) { log('Từ chối chơi hụi.', 'neutral'); } }
    ]
  });
  T('choi_hui', function (l, a) { return isVN(l) && a >= 22 && a <= 65 && l.indep && !l.hui && free(l); }, function (l) { return l.sex === 'F' ? 0.05 : 0.025; }, 8);

  function huiYear(l, r, log) {
    var h = l.hui; if (!h) return;
    h.y++;
    if (r() < 0.06) { // chủ hụi ôm tiền bỏ trốn
      var lost = h.got ? 0 : h.c * h.y;
      log('VỠ HỤI! ' + h.who + ' ôm tiền bỏ trốn.' + (lost > 0 ? ' Bạn mất trắng ' + mo(l, lost) + ' tiền góp.' : ' May mà bạn đã hốt hụi từ trước.'), 'bad');
      if (lost > 0) { fx(l, { hap: -10 }); H.mem(l, 'Ngày nghe tin vỡ hụi, cả xóm kéo đến nhà chủ hụi thì nhà đã khóa cửa.', 4); }
      l.hui = null; return;
    }
    H.cash(l, -h.c, 'Góp hụi');
    if (!h.got && h.y >= h.pos) { h.got = true; var amt = h.c * h.n * h.bid; H.cash(l, amt, 'Hốt hụi'); log('Hốt hụi được ' + mo(l, amt) + '.', 'good'); }
    if (h.y >= h.n) { log('Mãn dây hụi, ' + (h.bid > 1 ? 'một khoản lãi kha khá.' : 'coi như vay được vốn đúng lúc.'), 'neutral'); l.hui = null; }
  }

  // ---------- Bảo hiểm nhân thọ ----------
  SC('bao_hiem', {
    title: 'Lời mời mua bảo hiểm nhân thọ', prep: function (l, r) { return { who: pick(r, ['Một người bạn cũ mới làm tư vấn bảo hiểm', 'Nhân viên ngân hàng khi bạn ra gửi tiết kiệm', 'Đồng nghiệp cũ giờ là "trưởng nhóm bảo hiểm"']) }; },
    valid: function (l) { return !l.ins && l.indep; },
    text: function (l, d) { return d.who + ' nhiệt tình giới thiệu gói bảo hiểm: "Vừa bảo vệ, vừa tích lũy, lãi còn cao hơn gửi tiết kiệm!"'; },
    opts: [
      { k: 'protect', l: 'Mua gói bảo vệ sức khỏe & tử kỳ', h: function (l) { return mb(l, 0.03) + '/năm · chi trả khi bệnh hiểm nghèo, không có tiền tích lũy'; }, ai: { w: 1, smart: 0.8 }, run: function (l, r, log) { l.ins = { type: 'protect', name: 'bảo hiểm sức khỏe & tử kỳ', prem: l.base * 0.03, since: l.age, term: 20, paid: 0, val: 0 }; log('Mua bảo hiểm sức khỏe & tử kỳ. Mong là không bao giờ phải dùng đến.', 'neutral'); } },
      { k: 'invest', l: 'Mua gói "liên kết đầu tư" 15 năm', h: function (l) { return mb(l, 0.08) + '/năm · hủy trước hạn mất phần lớn tiền'; }, ai: { w: 0.6 }, run: function (l, r, log) { var bad = r() < 0.35; l.ins = { type: 'invest', name: 'bảo hiểm liên kết đầu tư', prem: l.base * 0.08, since: l.age, term: 15, paid: 0, val: 0, poor: bad }; log('Ký hợp đồng bảo hiểm liên kết đầu tư 15 năm' + (bad ? '. Đọc kỹ mới thấy phí quản lý cao ngất.' : '.'), 'neutral'); } },
      { k: 'no', l: 'Từ chối khéo', ai: { w: 1 }, run: function (l, r, log) { log('Từ chối mua bảo hiểm, giữ mối quan hệ.', 'neutral'); } }
    ]
  });
  T('bao_hiem', function (l, a) { return a >= 24 && a <= 50 && l.indep && !l.ins && free(l) && l.money > 0; }, 0.04, 10);
  function surrender(l, log) {
    var I = l.ins; if (!I) return;
    var back = I.type === 'invest' ? I.val * (l.age - I.since < 5 ? 0.3 : 0.75) : 0;
    if (back > 0) H.cash(l, back, 'Tiền hủy hợp đồng bảo hiểm');
    log('Hủy hợp đồng ' + I.name + (back > 0 ? ', nhận lại ' + mo(l, back) + ' trên ' + mo(l, I.paid) + ' đã đóng.' : '.'), back < I.paid * 0.6 ? 'bad' : 'neutral');
    l.ins = null;
  }
  function insYear(l, r, log, a) {
    var I = l.ins; if (!I) return;
    if (!l.indep || (l.jailUntil != null && a < l.jailUntil)) return;
    if (l.money < -l.base * 1.5 && a - I.since >= 1) { log('Không kham nổi phí bảo hiểm, đành để hợp đồng mất hiệu lực.', 'bad'); l.ins = null; return; }
    H.cash(l, -I.prem, 'Phí bảo hiểm'); I.paid += I.prem;
    if (I.type === 'invest') I.val = (I.val + I.prem * (I.poor ? 0.6 : 0.85)) * (1 + (I.poor ? 0.01 : 0.03));
    // bệnh hiểm nghèo vừa phát hiện: bảo hiểm chi trả
    if (l.ill && !l.ill.insPaid && l.ill.since >= I.since) {
      l.ill.insPaid = true; var pay = l.base * (I.type === 'protect' ? 1.5 : 0.8);
      H.cash(l, pay, 'Bảo hiểm chi trả bệnh hiểm nghèo'); log('Công ty bảo hiểm chi trả ' + mo(l, pay) + ' tiền điều trị ' + l.ill.n + '.', 'good'); H.mem(l, 'Lúc nhận khoản chi trả bảo hiểm, bạn thở phào vì đã mua năm ấy.', 2);
    }
    if (a - I.since + 1 >= I.term) {
      if (I.type === 'invest') { H.cash(l, I.val, 'Đáo hạn bảo hiểm'); log('Hợp đồng bảo hiểm đáo hạn, nhận ' + mo(l, I.val) + ' (đã đóng ' + mo(l, I.paid) + ').', I.val >= I.paid ? 'good' : 'bad'); }
      else log('Hợp đồng bảo hiểm sức khỏe hết hạn.', 'neutral');
      l.ins = null;
    }
  }

  // ---------- cập nhật tài sản mỗi năm ----------
  function assetsYear(l, r, log, a) {
    var M = l.mkt, ps = M.stock, pl = M.land;
    M.stock = next(r, STOCK[ps][2]);
    M.landYrs = M.land === 'sốt' ? M.landYrs + 1 : 0;
    var lt = LAND[pl][2];
    if (pl === 'sốt' && M.landYrs >= 3) lt = { 'vỡ bong bóng': 0.6, 'bình thường': 0.4 };
    M.land = next(r, lt);
    var interested = l.indep && a >= 20;
    var newsOk = l.flags.landNewsAt == null || a - l.flags.landNewsAt >= (l.assets.land > 0.5 ? 4 : 8); // v5.6.1: người có đất cũng không nghe tin năm nào cũng như năm nào // v3.8.1: tin thị trường đất không nhắc năm nào cũng như năm nào
    if (interested && newsOk && M.land !== pl && (M.land === 'sốt' || M.land === 'vỡ bong bóng' || l.assets.land > 0.5) && r() < 0.8 && (l.flags.landNewsAt = a) != null)
      log(M.land === 'sốt' ? (isVN(l) && !(l.abroad && l.abroad.perm) ? pick(r, ['Thị trường đất nóng sốt: cò đất dựng lều ngoài bãi đất trống, người người đổ xô đi mua.', 'Sốt đất lan về tận vùng ven, mảnh ruộng cũ của hàng xóm bỗng có giá cả tỷ.', 'Đi đâu cũng nghe bàn chuyện đất nền, phân lô; bạn bè rủ nhau góp vốn "lướt sóng".']) : pick(r, ['Giá nhà đất tăng vọt, đi đâu cũng nghe người ta bàn chuyện mua nhà, mua đất.', 'Giá nhà tăng chóng mặt, người trẻ than thở không biết bao giờ mới mua nổi một căn.', 'Thị trường bất động sản nóng lên, ngân hàng đua nhau mời vay mua nhà.', 'Báo chí liên tục đưa tin giá nhà lập đỉnh mới, môi giới gọi điện mời chào mỗi ngày.', 'Khu ngoại ô vắng vẻ ngày nào giờ mọc lên toàn dự án, giá rao bán đội lên từng tháng.', 'Người thuê nhà than tiền thuê tăng liên tục vì giá nhà đất leo thang.'])) : M.land === 'vỡ bong bóng' ? pick(r, ['Bong bóng đất vỡ — giá đất lao dốc, nhiều người ôm nợ ngân hàng.', 'Giá nhà đất sụt mạnh, nhiều người mua lúc đỉnh giờ cắt lỗ không ai mua.', 'Thị trường nhà đất lao dốc, dự án bỏ dở nằm phơi nắng.']) : M.land === 'đóng băng' ? pick(r, ['Thị trường đất đóng băng, rao bán mãi không ai hỏi.', 'Nhà đất ế ẩm, biển rao bán treo kín các con phố.', 'Giao dịch nhà đất gần như đứng im, môi giới chuyển nghề hàng loạt.']) : pick(r, ['Thị trường đất trở lại bình thường.', 'Giá nhà đất chững lại, người mua người bán đều dè chừng.', 'Thị trường bất động sản dần ổn định sau những biến động.']), 'neutral');
    if (interested && M.stock === 'sập' && ps !== 'sập' && (l.assets.stock > 0.5 || (r() < 0.3 && (l.flags.stockNewsAt == null || a - l.flags.stockNewsAt >= 8)))) { l.flags.stockNewsAt = a; log(pick(r, ['Chứng khoán sập mạnh, bảng điện đỏ lửa nhiều phiên liền.', 'Thị trường chứng khoán lao dốc, nhà đầu tư ngồi nhìn tài khoản bốc hơi.', 'Cổ phiếu giảm sàn hàng loạt, các nhóm đầu tư trên mạng im bặt.']), 'neutral'); }
    var A = l.assets, core = function () { return (A.save || 0) + (A.gold || 0) + (A.stock || 0) + (A.land || 0); }, before = core(); // v2.4: chỉ 4 loại tài sản tài chính (nhà cho thuê, cơ sở kinh doanh tính riêng)
    if (before > 0.5) {
      var g = { save: 0.025, gold: 0.03 + U.normal(r) * 0.13, stock: STOCK[M.stock][0] + U.normal(r) * STOCK[M.stock][1], land: LAND[M.land][0] + U.normal(r) * LAND[M.land][1] };
      Object.keys(g).forEach(function (k) { if (g[k] > 0) g[k] *= E.difficulty(l).passive; if (A[k] > 0) A[k] = Math.max(0, A[k] * (1 + Math.max(-0.7, g[k]))); });
      var after = core(), parts = Object.keys(ASSET_NAME).filter(function (k) { return A[k] > 0.5; }).map(function (k) { return ASSET_NAME[k] + ' ' + pct(g[k]); });
      log('Tài sản đầu tư: ' + parts.join(' · ') + ' — tổng ' + mo(l, after) + ' (' + (after >= before ? 'tăng ' + mo(l, after - before) : 'giảm ' + mo(l, before - after)) + ').', 'money');
      if (M.stock === 'sập' && A.stock > l.base * 0.5) { fx(l, { hap: -5 }); l.mind.stress += 6; }
    }
    // hết tiền mặt: phải bán bớt tài sản (tiết kiệm → vàng → cổ phiếu → đất)
    if (l.money < 0 && before > 0.5) {
      ['save', 'gold', 'stock', 'land'].forEach(function (k) {
        if (l.money >= 0 || !(A[k] > 0.5)) return;
        var need = -l.money, v = A[k], haircut = k === 'land' && !landSellable(l) ? 0.8 : 1;
        var part = Math.min(v, need / haircut);
        A[k] -= part; l.basis[k] = Math.max(0, (l.basis[k] || 0) * (A[k] / (A[k] + part)));
        H.cash(l, part * haircut, 'Bán ' + ASSET_NAME[k] + ' để trang trải');
        log('Hết tiền mặt, phải bán ' + ASSET_NAME[k] + ' lấy ' + mo(l, part * haircut) + ' trang trải.', 'bad');
      });
    }
    huiYear(l, r, log);
    insYear(l, r, log, a);
  }

  // ===================================================================
  // 2. SỨC KHỎE TINH THẦN: căng thẳng tích tụ, kiệt sức, trầm cảm sau sinh, khủng hoảng tuổi trung niên, trị liệu
  // ===================================================================
  var HIGH_STRESS = { sale: 4, office: 3, med: 5, uniform: 3, state: 2, show: 3, creator: 3, crime: 7, esport: 3, free: 2, biz: 4, service: 2 };
  function mindYear(l, r, log, a) {
    var M = l.mind;
    if (a < 12) { M.stress = Math.max(0, M.stress - 5); return; }
    var c = l.job ? E.jobDef(l) : null, d = -4 + U.normal(r) * 5;
    if (l.focus === 'work') d += 8; else if (l.focus === 'rest') d -= 7; else if (l.focus === 'social') d -= 3; else if (l.focus === 'health') d -= 4;
    if (c) d += HIGH_STRESS[c.cat] || 1;
    if (l.school === 'upper' && a >= 16 && l.focus === 'study') d += 4; // áp lực thi cử
    if (l.money < 0 && l.indep) d += 6;
    if (H.debtTotal(l) > l.base * 2) d += 5;
    if (l.ill) d += 6;
    if (!l.job && !l.school && !l.retired && l.indep && a >= 20 && a <= 58) d += 5;
    d += l.kids.filter(function (k) { return k.alive && a - k.born < 6; }).length * 2;
    if (H.pets(l).length) d -= 3;
    if (l.flags.exercise) d -= 3;
    if (l.partner && l.partner.status !== 'dating') d -= 2;
    if (l.mind.therapyUntil >= a) d -= 15;
    if (l.st.hap < 30) d += 3;
    M.stress = U.clamp(M.stress + d, 0, 100);
    if (M.stress > 70) { l.st.hea -= (M.stress - 70) / 10; l.st.hap -= (M.stress - 70) / 8; }
    if (M.stress >= 78 && (M.burnAt == null || a - M.burnAt >= 4) && l.job && a >= 20) { M.burnAt = a; H.sched(l, 'kiet_suc', 1); }
  }
  SC('kiet_suc', {
    title: 'Kiệt sức', tone: 'dark', valid: function (l) { return !!l.job; },
    text: function (l) { return 'Sáng nào mở mắt ra cũng thấy sợ phải đi làm. Đau đầu, mất ngủ, cáu gắt với cả người thân. Công việc ' + E.jobTitle(l) + ' đang vắt kiệt bạn.'; },
    opts: [
      { k: 'leave', l: 'Xin nghỉ phép dài ngày', h: 'Mất một phần thu nhập năm nay', ai: { w: 1 }, run: function (l, r, log) { cashB(l, -0.05, 'Nghỉ phép không lương'); l.mind.stress -= 30; fx(l, { hap: 6, hea: 3 }); log('Xin nghỉ phép hai tuần, tắt điện thoại, ngủ bù và đi bộ mỗi sáng.', 'good'); } },
      { k: 'therapy', l: 'Gặp chuyên gia tâm lý', h: function (l) { return mb(l, 0.05); }, ai: { smart: 1 }, run: function (l, r, log) { cashB(l, -0.05, 'Trị liệu tâm lý'); l.mind.therapyUntil = l.age + 1; l.mind.stress -= 25; fx(l, { hap: 8 }); l.flags.therapyN = (l.flags.therapyN || 0) + 1; log(l.flags.therapyN === 1 ? 'Bắt đầu đi trị liệu tâm lý. Lần đầu tiên có người giúp bạn gỡ từng nút thắt.' : pick(r, ['Quay lại gặp chuyên gia tâm lý, cùng nhau gỡ những nút thắt mới.', 'Lại đi trị liệu một đợt. Lần này bạn biết mình cần gì hơn.', 'Hẹn lại chuyên gia tâm lý quen, nói hết những gì dồn nén mấy tháng nay.']), 'good'); H.mem(l, 'Buổi trị liệu đầu tiên, bạn khóc như một đứa trẻ rồi thấy nhẹ nhõm lạ thường.', 4); } },
      { k: 'quit', l: 'Nghỉ việc, nghỉ ngơi một thời gian', h: 'Không có thu nhập cho đến khi tìm việc mới', ai: { risk: 0.8, w: 0.5 }, run: function (l, r, log) { log('Nộp đơn nghỉ việc ' + E.jobTitle(l) + '. Cần thời gian để sống lại.', 'neutral'); l.job = null; l.flags.needJob = true; l.mind.stress -= 40; fx(l, { hap: 5 }); } },
      { k: 'push', l: 'Gồng tiếp, ai mà chẳng mệt', ai: { amb: 1, w: 0.7 }, run: function (l, r, log) { l.mind.stress += 5; if (ch(r, 0.25)) { log('Ngất xỉu ngay tại chỗ làm, phải nhập viện truyền dịch.', 'bad'); fx(l, { hea: -10, hap: -5 }); cashB(l, -0.03, 'Viện phí'); H.mem(l, 'Ngày tỉnh dậy trong bệnh viện vì làm việc quá sức.', 4); } else { log('Gồng mình làm tiếp. Mắt thâm quầng, tóc bắt đầu bạc.', 'bad'); fx(l, { hea: -4, hap: -3 }); } } }
    ]
  });
  SC('tram_cam_sau_sinh', {
    title: 'Sau ngày sinh con', tone: 'dark',
    prep: function (l) { var self = l.sex === 'F' && !(l.partner && l.partner.sex === 'F' && l.flags.partnerBore); return { self: self, p: l.partner ? l.partner.name : '' }; },
    valid: function (l, d) { return (d && d.self) || l.sex === 'F' || !!(l.partner && l.partner.alive); },
    text: function (l, d) { return d.self ? 'Từ ngày sinh con, bạn hay khóc vô cớ, mất ngủ triền miên, thấy mình là người mẹ tồi. Ai cũng bảo "phụ nữ đẻ ai chẳng thế".' : d.p + ' từ ngày sinh con hay khóc một mình, bỏ ăn, có lúc nói những câu khiến bạn lạnh người.'; },
    opts: [
      { k: 'doctor', l: function (l, d) { return d.self ? 'Đi khám bác sĩ tâm lý' : 'Đưa ' + d.p + ' đi khám bác sĩ tâm lý'; }, h: function (l) { return mb(l, 0.04); }, ai: { smart: 1.2, w: 1 }, run: function (l, r, log, d) { cashB(l, -0.04, 'Điều trị trầm cảm sau sinh'); log(d.self ? 'Được chẩn đoán trầm cảm sau sinh và điều trị kịp thời. Từ từ bạn mỉm cười lại được với con.' : 'Bác sĩ chẩn đoán trầm cảm sau sinh. Nhờ phát hiện sớm, ' + d.p + ' dần hồi phục.', 'good'); fx(l, { hap: 6 }); if (d.self) l.mind.stress -= 20; } },
      { k: 'family', l: function (l, d) { return d.self ? 'Nhờ chồng / gia đình thay phiên chăm con' : 'Xin nghỉ phép ở nhà chăm vợ con'; }, ai: { soc: 1, w: 1 }, run: function (l, r, log, d) { if (ch(r, 0.7)) { log(d.self ? 'Cả nhà thay phiên trông con, bạn được ngủ trọn giấc. Mọi thứ dần ổn hơn.' : 'Ở nhà cùng vợ chăm con mấy tuần, hai vợ chồng gần nhau hơn.', 'good'); fx(l, { hap: 5, soc: 3 }); if (!d.self) cashB(l, -0.03, 'Nghỉ phép chăm vợ con'); } else { log('Có người phụ nhưng nỗi buồn vẫn chưa dứt, phải đi khám mới đỡ.', 'neutral'); cashB(l, -0.03, 'Điều trị tâm lý'); } } },
      { k: 'ignore', l: function (l, d) { return d.self ? 'Tự chịu đựng, rồi sẽ qua' : '"Phụ nữ đẻ ai chẳng thế"'; }, ai: { w: 0.4 }, run: function (l, r, log, d) { if (d.self) { log('Những tháng ngày u tối kéo dài, bạn thu mình lại.', 'bad'); fx(l, { hap: -12, hea: -4 }); l.mind.stress += 20; } else { log('Bạn gạt đi. ' + d.p + ' ngày càng xa cách, căn nhà lạnh lẽo hẳn.', 'bad'); fx(l, { hap: -8, karma: -3 }); if (ch(r, 0.2) && l.partner && l.partner.status !== 'dating') { log(d.p + ' bế con về nhà ngoại, không quay lại nữa.', 'bad'); H.endPartner(l, log, 'div'); } } } }
    ]
  });
  SC('khung_hoang_40', {
    title: 'Khủng hoảng tuổi trung niên',
    text: function (l) { return 'Bước qua tuổi ' + l.age + ', bạn chợt tự hỏi: mình đã sống đúng với điều mình muốn chưa? Ngày nào cũng giống ngày nào.'; },
    opts: [
      { k: 'passion', l: 'Bỏ việc, theo đuổi đam mê bấy lâu', req: function (l) { return !!l.job; }, h: 'Mất thu nhập ổn định', ai: { risk: 1.2, w: 0.5 }, run: function (l, r, log) { if (!l.job) { log('Muốn bỏ hết để sống cho mình, nhưng hoàn cảnh đã khác rồi.', 'neutral'); return; } log('Nghỉ ' + E.jobTitle(l) + ' để làm điều mình thích. Ai cũng bảo bạn điên.', 'big'); l.job = null; l.flags.needJob = true; fx(l, { hap: 8 }); l.mind.stress -= 15; H.mem(l, 'Ngày nộp đơn nghỉ việc ở tuổi ' + l.age + ' để sống cho mình.', 5); } },
      { k: 'buy', l: 'Mua một món đồ chơi đắt tiền (mô tô phân khối lớn, máy ảnh…)', h: function (l) { return mb(l, 0.4); }, req: function (l) { return l.money > l.base * 0.4; }, ai: { w: 0.6 }, run: function (l, r, log) { cashB(l, -0.4, 'Mua đồ chơi tuổi trung niên'); log('Tậu một chiếc mô tô phân khối lớn. Vui được vài tháng rồi nó nằm phủ bạt trong gara.', 'neutral'); fx(l, { hap: 4 }); } },
      { k: 'trip', l: 'Một chuyến đi xa một mình', h: function (l) { return mb(l, 0.08); }, ai: { w: 1 }, run: function (l, r, log) { cashB(l, -0.08, 'Chuyến đi một mình'); log('Đi một mình suốt dọc Tây Bắc. Đứng trên đỉnh đèo, bạn thấy lòng nhẹ tênh.', 'good'); fx(l, { hap: 8 }); l.mind.stress -= 15; H.mem(l, 'Một mình trên đỉnh đèo lộng gió, năm ' + l.age + ' tuổi.', 4); } },
      { k: 'affair', l: 'Một mối quan hệ ngoài luồng', req: function (l) { return !!(l.partner && l.partner.status !== 'dating'); }, ai: { bad: 1.5, risk: 0.8, w: 0.3 }, run: function (l, r, log) { if (!l.partner) return; fx(l, { karma: -10 }); if (ch(r, 0.45)) { log('Bị phát hiện ngoại tình. Gia đình tan vỡ.', 'bad'); fx(l, { hap: -15 }); H.mem(l, 'Ánh mắt ' + l.partner.name + ' ngày mọi chuyện vỡ lở.', 5); H.endPartner(l, log, 'div'); } else { log('Một mối quan hệ lén lút. Mỗi đêm về nhà là một lần day dứt.', 'bad'); fx(l, { hap: -3 }); l.mind.stress += 10; } } },
      { k: 'list', l: 'Viết lại danh sách những điều muốn làm, thay đổi từng chút', ai: { smart: 0.6, w: 1 }, run: function (l, r, log) { log('Viết lại danh sách ước mơ: học đàn, chạy bộ, về thăm quê thường hơn. Cuộc sống có thêm màu sắc.', 'good'); fx(l, { hap: 5, kno: 2 }); l.flags.exercise = true; l.mind.stress -= 10; } }
    ]
  });
  T('khung_hoang_40', function (l, a) { return a >= 40 && a <= 52 && !l.flags.midlife && free(l); }, function (l) { return 0.05 + (l.mind.stress > 50 ? 0.05 : 0); }, 99);
  SC('tri_lieu', {
    title: 'Chăm sóc sức khỏe tinh thần', text: function (l) { return 'Mức căng thẳng của bạn đang ở ' + Math.round(l.mind.stress) + '/100. Bạn muốn làm gì cho tâm trí mình?'; },
    opts: [
      { k: 'course', l: 'Một liệu trình với chuyên gia tâm lý', h: function (l) { return mb(l, 0.05); }, ai: { w: 1, smart: 0.8 }, run: function (l, r, log) { cashB(l, -0.05, 'Trị liệu tâm lý'); l.mind.therapyUntil = l.age + 1; l.mind.stress -= 20; fx(l, { hap: 6 }); log('Đi trị liệu tâm lý mỗi tuần. Học được cách gọi tên cảm xúc của mình.', 'good'); } },
      { k: 'meditate', l: 'Tập thiền, viết nhật ký mỗi tối', ai: { w: 1 }, run: function (l, r, log) { l.mind.stress -= 10; fx(l, { hap: 3 }); log('Mỗi tối mười phút thiền và vài dòng nhật ký. Đầu óc tĩnh lại.', 'good'); } },
      { k: 'digital', l: 'Cai mạng xã hội một tháng', ai: { w: 0.6 }, run: function (l, r, log) { if (ch(r, 0.6)) { l.mind.stress -= 12; log('Xóa mạng xã hội một tháng, bất ngờ thấy mình đọc được cả cuốn sách.', 'good'); fx(l, { hap: 4, kno: 2 }); } else { log('Được ba ngày lại cài lại. Thôi để lần sau.', 'neutral'); } } }
    ]
  });

  // ===================================================================
  // 3. ĐỜI RIÊNG CỦA CON CÁI
  // ===================================================================
  var KID_JOBS_BAN = { an_xin: 1, phu_giup: 1, scam_kh: 1, xkld: 1 };
  function kidJobPick(l, k, r) {
    var preferred = E.childCareer126 && E.childCareer126(l, k); if (preferred && r() < .65) return preferred;
    var ids = Object.keys(E.CAR).filter(function (id) { var c = E.CAR[id]; return !KID_JOBS_BAN[id] && !c.fame && c.skillRank == null && c.sec !== 'crime' && !c.ladder && (c.edu || 0) <= k.edu && !(c.vnOnly && !isVN(l)) && !((c.vnOnly || c.cat === 'state') && l.abroad && l.abroad.perm); }); // v7.0: gia đình đã định cư nước ngoài thì con không làm công chức ở Việt Nam
    return U.wpick(r, ids, function (id) { var c = E.CAR[id]; return (c.w || 1) * (c.hidden ? 0.15 : 1) * (k.edu >= 5 && (c.edu || 0) >= 5 ? 4 : 1) * (k.edu >= 5 && (c.edu || 0) < 3 ? 0.2 : 1); });
  }
  function kidIncome(l, k) {
    if (!k.job || !E.CAR[k.job]) return 0;
    var c = E.CAR[k.job], m = c.vn[Math.min(k.rank || 0, c.vn.length - 1)];
    var sc = l.cur === 'vnd' ? Math.pow(l.base / 90, 0.45) : l.base / 90;
    return m * sc * (k.edu >= 5 ? 1.08 : 1) * (k.boost || 1);
  }
  function kidTitle(k) { var c = E.CAR[k.job]; return c ? c.t[Math.min(k.rank || 0, c.t.length - 1)] : ''; }
  E.kidTitle = kidTitle; E.kidIncome = kidIncome;
  // con cái phụng dưỡng: phụ thuộc thu nhập và tình cảm của con
  E.kidSupport = function (l, k) {
    initKid(k);
    if (k.jail) return 0;
    var inc = k.inc * 12;
    if (!inc) return l.base * (k.close >= 50 ? 0.04 : 0.01);
    var share = k.close >= 70 ? 0.14 : k.close >= 45 ? 0.08 : k.close >= 25 ? 0.03 : 0;
    return Math.min(inc * share, l.base * 0.6);
  };
  function kidsYear(l, r, log, a) {
    l.kids.forEach(function (k) {
      if (!k.alive) return;
      initKid(k);
      var ka = a - k.born;
      if (ka < 1) return;
      // tình cảm cha mẹ – con cái
      var dc = U.normal(r) * 2 + (l.focus === 'social' ? 2.5 : l.focus === 'work' ? -1 : 0) - (l.abroad && !l.abroad.perm ? 3 : 0) - (l.jailUntil != null && a < l.jailUntil ? 5 : 0) - (l.addict && (l.addict.alcohol || l.addict.gamble || l.addict.drugs) ? 2 : 0);
      k.close = U.clamp(k.close + dc + (ka > 25 ? -0.5 : 0), 0, 100);
      // học hành của con
      if (ka >= 6 && ka <= 17) k.study = U.clamp(k.study + U.normal(r) * 5 + (l.fam.q >= 4 ? 0.5 : 0) + (k.close >= 60 ? 1 : -1) + (k.tutor ? 1.5 : 0), 0, 100);
      // tuổi mới lớn: lạc lối
      if (ka >= 13 && ka <= 20 && !k.vice && r() < 0.012 + (k.close < 40 ? 0.03 : 0) + (l.addict && (l.addict.gamble || l.addict.drugs) ? 0.02 : 0)) {
        k.vice = U.wkey(r, 'game:5,bỏ học:3,đua xe:2,ma túy:0.6');
        H.sched(l, 'con_lac_loi', 0, { n: k.name });
      }
      // 18 tuổi: ngã rẽ của con — bố mẹ góp ý
      if (ka === 18 && !k.path18) { k.path18 = true; H.sched(l, 'con_18', 0, { n: k.name }); }
      // tốt nghiệp
      if (k.uniUntil && ka >= k.uniUntil) { k.uniUntil = null; k.edu = Math.max(k.edu, 5); log('Con ' + k.name + ' tốt nghiệp đại học.', 'good'); fx(l, { hap: 5 }); H.mem(l, 'Ngày dự lễ tốt nghiệp của ' + k.name + ', bạn khóc lúc nào không hay.', 4); }
      if (!k.uniUntil) k.tuition = 0;
      if (k.tuition && l.indep) H.cash(l, -k.tuition, 'Tiền học cho ' + k.name);
      // đi làm
      if (!k.job && !k.uniUntil && ka >= 19 && ka <= 60 && !k.jail && (ka >= 22 || k.edu < 5) && r() < 0.6) {
        if (k.vice === 'ma túy' && r() < 0.6) return;
        k.edu = Math.max(k.edu, ka >= 18 ? 3 : 2);
        k.job = kidJobPick(l, k, r); k.rank = 0; k.jyrs = 0; k.inc = kidIncome(l, k);
        if (ka <= 30) log('Con ' + k.name + ' đi làm ' + kidTitle(k) + ', lương ' + mo(l, k.inc) + '/tháng.', 'good');
      } else if (k.job) {
        k.jyrs = (k.jyrs || 0) + 1;
        var c = E.CAR[k.job];
        if (c && (k.rank || 0) < c.t.length - 1 && k.jyrs >= (c.yrs[k.rank || 0] || 4) && r() < 0.25 + (k.study - 50) / 200) {
          k.rank = (k.rank || 0) + 1; k.jyrs = 0; k.inc = kidIncome(l, k);
          if (k.rank === c.t.length - 1 || r() < 0.4) log('Con ' + k.name + (/^(chủ|giám đốc|tổng giám đốc|chủ tịch)/.test(kidTitle(k)) ? ' trở thành ' : ' được lên ') + kidTitle(k) + '.', 'good');
          if (k.rank === c.t.length - 1 && c.t.length >= 3) { fx(l, { hap: 6 }); H.mem(l, 'Ngày ' + k.name + ' báo tin được bổ nhiệm ' + kidTitle(k) + ', bạn khoe khắp họ hàng.', 4); }
        }
        if (ka >= 60) { k.job = null; k.inc = k.inc * 0.5; }
      }
      // con đã lớn mà xa cách
      if (ka >= 25 && k.close < 25 && !k.coldNoted && a >= 55) { k.coldNoted = true; log('Con ' + k.name + ' bận rộn, cả năm chỉ về thăm được một lần, gọi điện vài câu rồi tắt.', 'bad'); fx(l, { hap: -4 }); }
      if (k.jail && ka >= k.jail) { k.jail = null; log('Con ' + k.name + ' mãn hạn tù trở về.', 'neutral'); }
    });
  }

  SC('con_18', {
    title: 'Con mười tám tuổi', major: 1,
    prep: function (l, r, arg) { var k = kidByName(l, arg && arg.n); return k ? { n: k.name, s: k.study, sex: k.sex } : null; },
    valid: function (l, d) { var k = kidByName(l, d && d.n); return !!(k && k.alive); },
    text: function (l, d) { return d.n + ' vừa học xong phổ thông' + (d.s >= 65 ? ', học lực khá giỏi' : d.s < 40 ? ', học hành lẹt đẹt' : '') + '. Con đứng trước ngã rẽ đầu đời — và bạn có tiếng nói.'; },
    opts: [
      { k: 'uni', l: 'Ủng hộ con học đại học', h: function (l) { return 'Hỗ trợ ' + mb(l, 0.15) + '/năm trong 4 năm'; }, ai: function (l, d) { return 0.4 + d.s / 60; }, run: function (l, r, log, d) { var k = kidByName(l, d.n); if (!k) return; var pass = ch(r, 0.05 + k.study / 140); if (pass) { k.edu = 3; k.uniUntil = l.age - k.born + 4; k.tuition = l.base * 0.15; k.close = Math.min(100, k.close + 5); log('Con ' + d.n + ' thi đỗ đại học! Cả nhà mở tiệc nhỏ.', 'good'); fx(l, { hap: 6 }); H.mem(l, 'Ngày ' + d.n + ' đỗ đại học, bạn khoe với cả xóm.', 3); } else { k.edu = 4; log('Con ' + d.n + ' thi trượt đại học, quyết định đi học nghề.', 'bad'); } } },
      { k: 'abroad', l: 'Cho con đi du học', h: function (l) { return mb(l, 0.8) + '/năm · cần dư dả'; }, req: function (l) { return l.money > l.base * 3; }, ai: { cost: 3, amb: 1, w: 0.6 }, run: function (l, r, log, d) { var k = kidByName(l, d.n); if (!k) return; k.uniUntil = l.age - k.born + 4; k.tuition = l.base * 0.8; k.abroadStudy = true; k.boost = 1.3; log('Tiễn con ' + d.n + ' ra sân bay đi du học. Căn nhà bỗng rộng thênh thang.', 'big'); H.mem(l, 'Ở sân bay, ' + d.n + ' ngoái lại vẫy tay rồi khuất sau cửa an ninh.', 5); } },
      { k: 'voc', l: 'Khuyên con học nghề cho chắc', ai: { w: 0.8 }, run: function (l, r, log, d) { var k = kidByName(l, d.n); if (!k) return; k.edu = 4; log('Con ' + d.n + ' đi học nghề, hai năm sau có tay nghề vững.', 'neutral'); } },
      { k: 'work', l: 'Bảo con đi làm sớm phụ giúp gia đình', ai: { w: 0.4 }, run: function (l, r, log, d) { var k = kidByName(l, d.n); if (!k) return; k.edu = 3; k.close -= 10; log('Con ' + d.n + ' gác lại giấc mơ giảng đường, đi làm phụ giúp nhà.', 'bad'); cashB(l, 0.05, 'Con phụ giúp'); } },
      { k: 'free', l: 'Để con tự quyết định cuộc đời mình', ai: { w: 1 }, run: function (l, r, log, d) { var k = kidByName(l, d.n); if (!k) return; k.close = Math.min(100, k.close + 8); if (k.study >= 60 && ch(r, 0.6)) { k.uniUntil = l.age - k.born + 4; k.tuition = l.base * 0.1; log('Con ' + d.n + ' tự chọn ngành, tự thi đỗ đại học. Bạn chỉ việc tin con.', 'good'); } else { k.edu = 3; log('Con ' + d.n + ' chọn đi làm, tự lập từ sớm.', 'neutral'); } } }
    ]
  });
  function kidByName(l, n) { return l.kids.filter(function (k) { return k.alive && k.name === n; })[0] || null; }
  var VICE_TXT = { game: 'bỏ bê mọi thứ, ngày đêm cắm mặt vào game', 'bỏ học': 'trốn học triền miên, giờ đòi nghỉ học hẳn', 'đua xe': 'tụ tập đua xe trái phép ban đêm', 'ma túy': 'dính vào ma túy' };
  SC('con_lac_loi', {
    title: 'Con lạc lối', tone: 'dark',
    prep: function (l, r, arg) { var k = kidByName(l, arg && arg.n); return k ? { n: k.name, v: k.vice } : null; },
    valid: function (l, d) { var k = kidByName(l, d && d.n); return !!(k && k.vice); },
    text: function (l, d) { return 'Bạn bàng hoàng phát hiện ' + d.n + ' ' + (VICE_TXT[d.v] || 'đang lạc lối') + '.'; },
    opts: [
      { k: 'talk', l: 'Gác mọi việc, dành thời gian ở bên con', ai: { soc: 1, w: 1.2 }, run: function (l, r, log, d) { var k = kidByName(l, d.n); if (!k) return; if (ch(r, d.v === 'ma túy' ? 0.35 : 0.65)) { k.vice = null; k.close = Math.min(100, k.close + 12); log('Kiên nhẫn ở bên con suốt mấy tháng. ' + d.n + ' dần quay về.', 'good'); H.mem(l, 'Đêm ' + d.n + ' gục vào vai bạn: "Con xin lỗi bố mẹ."', 5); } else { k.close = Math.min(100, k.close + 4); log('Đã cố gắng nhưng ' + d.n + ' vẫn chưa thoát ra được.', 'bad'); fx(l, { hap: -5 }); } } },
      { k: 'strict', l: 'Cấm đoán, kỷ luật thật nghiêm', ai: { w: 1 }, run: function (l, r, log, d) { var k = kidByName(l, d.n); if (!k) return; if (ch(r, 0.4)) { k.vice = null; k.close -= 5; log('Kỷ luật sắt giúp ' + d.n + ' tỉnh ra, dù con giận bạn một thời gian.', 'neutral'); } else { k.close -= 15; log(d.n + ' bỏ nhà đi, mấy ngày sau mới tìm thấy.', 'bad'); fx(l, { hap: -8 }); } } },
      { k: 'rehab', l: 'Đưa con đi cai nghiện / trường giáo dưỡng', req: function (l, d) { return d.v === 'ma túy' || d.v === 'đua xe'; }, h: function (l) { return mb(l, 0.2); }, ai: { w: 0.8 }, run: function (l, r, log, d) { var k = kidByName(l, d.n); if (!k) return; cashB(l, -0.2, 'Cai nghiện cho con'); if (ch(r, 0.55)) { k.vice = null; log('Sau một năm ở trung tâm, ' + d.n + ' trở về khỏe mạnh.', 'good'); } else { log('Ra trung tâm được ít lâu, ' + d.n + ' lại tái nghiện.', 'bad'); fx(l, { hap: -8 }); if (ch(r, 0.3)) { k.jail = l.age - k.born + 3; log('Con ' + d.n + ' bị bắt và lĩnh án 3 năm tù.', 'bad'); H.mem(l, 'Ngày đứng ở tòa nhìn ' + d.n + ' bị dẫn đi.', 6); } } } },
      { k: 'ignore', l: 'Bận quá, để con tự lớn', ai: { w: 0.5 }, run: function (l, r, log, d) { var k = kidByName(l, d.n); if (!k) return; k.close -= 15; log('Không có thời gian cho con. Khoảng cách ngày một xa.', 'bad'); if (d.v === 'ma túy' && ch(r, 0.4)) { k.jail = l.age - k.born + 4; log('Con ' + d.n + ' bị bắt vì liên quan đến ma túy.', 'bad'); fx(l, { hap: -15 }); } } }
    ]
  });
  SC('con_xin_von', {
    title: 'Con xin vốn làm ăn',
    prep: function (l, r) { var ks = l.kids.filter(function (k) { return k.alive && l.age - k.born >= 24 && l.age - k.born <= 42 && !k.askedVon; }); var k = ks[0]; return k ? { n: k.name, p: pick(r, ['mở quán cà phê', 'mở xưởng nhỏ', 'mở cửa hàng online', 'làm đại lý vật liệu', 'mở phòng khám riêng']) } : null; },
    valid: function (l, d) { return !!(d && d.n ? kidByName(l, d.n) : l.kids.some(function (k) { return k.alive && l.age - k.born >= 24 && l.age - k.born <= 42 && !k.askedVon; })) && l.money > l.base * 1.5; },
    text: function (l, d) { return d.n + ' về nhà, ngập ngừng xin bố mẹ một khoản để ' + d.p + '.'; },
    opts: [
      { k: 'give', l: 'Cho con vốn', h: function (l) { return mb(l, 1); }, ai: { w: 1, soc: 0.5 }, run: function (l, r, log, d) { var k = kidByName(l, d.n); if (!k) return; k.askedVon = true; cashB(l, -1, 'Cho ' + d.n + ' vốn làm ăn'); k.close = Math.min(100, k.close + 12); if (ch(r, 0.5)) { k.boost = (k.boost || 1) * 1.8; k.inc = kidIncome(l, k); log(d.n + ' ' + d.p + ' làm ăn phát đạt, sau vài năm thu nhập gấp đôi.', 'good'); H.mem(l, 'Ngày khai trương của ' + d.n + ', con nắm tay bạn cắt băng.', 4); } else { log('Việc ' + d.p + ' của ' + d.n + ' thất bại. Con buồn mãi vì làm mất tiền của bố mẹ.', 'bad'); } } },
      { k: 'lend', l: 'Cho vay, có giấy tờ đàng hoàng', ai: { w: 0.8, smart: 0.5 }, run: function (l, r, log, d) { var k = kidByName(l, d.n); if (!k) return; k.askedVon = true; cashB(l, -0.6, 'Cho ' + d.n + ' vay'); if (ch(r, 0.6)) { cashB(l, 0.65, d.n + ' trả nợ'); log(d.n + ' trả đủ tiền sau ba năm, còn biếu thêm.', 'good'); } else { k.close -= 5; log(d.n + ' làm ăn thua lỗ, khoản vay coi như mất.', 'bad'); } } },
      { k: 'no', l: 'Từ chối — con phải tự lập', ai: { w: 0.7 }, run: function (l, r, log, d) { var k = kidByName(l, d.n); if (!k) return; k.askedVon = true; k.close -= 8; log('Từ chối cho ' + d.n + ' vốn. Con im lặng ra về.', 'neutral'); } }
    ]
  });
  T('con_xin_von', function (l, a) { return free(l) && l.money > l.base * 1.5 && l.kids.some(function (k) { return k.alive && a - k.born >= 24 && a - k.born <= 42 && !k.askedVon; }); }, 0.05, 6);
  SC('con_bo_be', {
    title: 'Tuổi già quạnh quẽ',
    prep: function (l) { var k = l.kids.filter(function (k) { return k.alive && k.close < 40 && l.age - k.born >= 25; })[0]; return k ? { n: k.name } : null; },
    valid: function (l) { return l.kids.some(function (k) { return k.alive && k.close < 40 && l.age - k.born >= 25; }); },
    text: function (l, d) { return 'Tết năm nay ' + d.n + ' lại báo bận không về. Mâm cơm chiều ba mươi chỉ có ' + (l.partner ? 'hai ông bà' : 'mình bạn') + '.'; },
    opts: [
      { k: 'visit', l: 'Tự bắt xe lên thăm con', ai: { w: 1, soc: 0.6 }, run: function (l, r, log, d) { var k = kidByName(l, d.n); if (!k) return; k.close = Math.min(100, k.close + 10); log('Xách giỏ quà quê lên thăm ' + d.n + '. Con ôm bạn, mắt đỏ hoe: "Con xin lỗi."', 'good'); fx(l, { hap: 6 }); H.mem(l, 'Chuyến xe đêm lên thành phố thăm ' + d.n + '.', 4); } },
      { k: 'call', l: 'Gọi điện nói thật lòng mình nhớ con', ai: { w: 1 }, run: function (l, r, log, d) { var k = kidByName(l, d.n); if (!k) return; if (ch(r, 0.6)) { k.close = Math.min(100, k.close + 10); log('Sau cuộc gọi, ' + d.n + ' thu xếp về thăm nhà ngay tuần sau.', 'good'); fx(l, { hap: 4 }); } else { log(d.n + ' ậm ừ hứa hẹn rồi lại quên.', 'bad'); fx(l, { hap: -3 }); } } },
      { k: 'accept', l: 'Thôi, con còn lo cuộc sống của nó', ai: { w: 0.7 }, run: function (l, r, log, d) { log('Lặng lẽ ăn Tết một mình, không trách con.', 'neutral'); fx(l, { hap: -4 }); } }
    ]
  });
  T('con_bo_be', function (l, a) { return a >= 60 && free(l) && l.kids.some(function (k) { return k.alive && k.close < 40 && a - k.born >= 25; }); }, 0.12, 5);

  // các tình huống con cái có sẵn (bản cũ) giờ ảnh hưởng đến đứa con cụ thể
  function wrapApply(id, fn) { var D = E.DEC[id]; if (!D) return; var old = D.apply; D.apply = function (l, dec, k, r, log) { old.call(D, l, dec, k, r, log); fn(l, dec, k, r, log); }; }
  wrapApply('con_hoc', function (l, dec, k) { var c = kidByName(l, dec.data && dec.data.n); if (!c) return; if (k === 'intl') { c.study = U.clamp(c.study + 10, 0, 100); c.boost = 1.1; } else if (k === 'extra') { c.study = U.clamp(c.study + 5, 0, 100); c.tutor = true; } else if (k === 'free') c.close = Math.min(100, c.close + 5); });
  wrapApply('con_hu', function (l, dec, k) { var c = kidByName(l, dec.data && dec.data.n); if (!c) return; if (k === 'strict') c.close = U.clamp(c.close - 6, 0, 100); else if (k === 'talk') { c.close = Math.min(100, c.close + 8); c.study = U.clamp(c.study + 4, 0, 100); } else if (k === 'ignore') { c.close = U.clamp(c.close - 10, 0, 100); c.study = U.clamp(c.study - 5, 0, 100); } });
  // sinh con: khởi tạo đời con, trầm cảm sau sinh
  wrapApply('kid', function (l, dec, k, r) {
    if (k !== 'yes') return;
    var c = l.kids[l.kids.length - 1]; if (!c || c.born !== l.age) return;
    initKid(c);
    // ghi lại hoàn cảnh gia đình lúc con chào đời (dùng cho "sống tiếp đời con")
    c.pInc = l.income / 12 || 0; c.pJob = l.job ? E.jobTitle(l) : l.school ? 'đang đi học' : ''; c.mateInc = l.partner && l.partner.age < 62 ? l.base * 0.75 / 12 : 0;
    c.mate = l.partner ? { name: l.partner.name, sex: l.partner.sex, age: l.partner.age } : null;
    // gia cảnh khi con chào đời: theo thu nhập cả nhà so với mức trung bình, hoặc theo tài sản nếu cao hơn
    var nwb = E.netWorth(l) / l.base, qW = nwb < 1 ? 1 : nwb < 5 ? 2 : nwb < 15 ? 3 : nwb < 40 ? 4 : 5;
    var ib = (c.pInc + c.mateInc) / (l.base / 12), qI = ib < 0.9 ? 1 : ib < 1.6 ? 2 : ib < 2.6 ? 3 : ib < 4.5 ? 4 : 5;
    c.q = Math.max(qW, qI);
    c.home = l.ownHouse ? 'nhà riêng' : l.urban ? 'nhà thuê' : 'nhà riêng';
    if (!dec.data.adopt && l.partner && (l.sex === 'F' || l.partner.sex === 'F') && r() < 0.13) {
      if (l.sex !== 'F') l.flags.partnerBore = true;
      H.sched(l, 'tram_cam_sau_sinh', 0);
    }
  });
  // bị bắt nạt để lại vết thương tinh thần
  wrapApply('bat_nat', function (l, dec, k) { if (k === 'endure') l.mind.stress += 12; else if (k === 'tell' || k === 'friend') l.mind.stress -= 3; });

  // ===================================================================
  // 4. HỌC HÀNH CHI TIẾT: khối thi, luyện thi, điểm thi tốt nghiệp THPT, học bổng, chuyển trường, bắt nạt qua mạng
  // ===================================================================
  var KHOI_TALENT = { 'toán học': 'A00', 'ngoại ngữ': 'D01', 'hội họa': 'H00', 'ăn nói': 'C00', 'kinh doanh': 'A01', 'khéo tay': 'A00' };
  SC('chon_khoi', {
    title: 'Chọn khối thi đại học',
    text: 'Lên lớp 11, cô chủ nhiệm yêu cầu cả lớp chọn khối thi để vào lớp ôn tương ứng. Chọn khối nào cũng là chọn sẵn một nhóm ngành cho tương lai.',
    valid: function (l) { return !l.khoi && (l.school === 'upper' || l.school === 'priv'); },
    opts: Object.keys(E.KHOI).map(function (k) {
      var K = E.KHOI[k];
      return { k: k, l: 'Khối ' + k + ' (' + K.n + ')', h: 'Hợp ngành ' + K.m.map(function (m) { return E.MAJORS[m].split(' – ')[0]; }).join(', '),
        ai: function (l) { return (KHOI_TALENT[l.talent] === k ? 4 : 1) * ({ A00: 3, A01: 2, B00: 1.5, C00: 1.2, D01: 3, H00: 0.4 }[k]); },
        run: function (l, r, log) { l.khoi = k; log('Chọn khối ' + k + ' (' + K.n + '), vào lớp ôn chuyên sâu.', 'neutral'); } };
    })
  });
  T('chon_khoi', function (l, a) { return isVN(l) && a === 16 && !l.khoi && (l.school === 'upper' || l.school === 'priv'); }, 1, 99);
  SC('luyen_thi', {
    title: 'Năm cuối cấp: luyện thi',
    text: function (l) { return 'Còn một năm nữa là thi tốt nghiệp THPT' + (l.khoi ? ' khối ' + l.khoi : '') + '. Bạn bè đứa nào cũng chạy sô ba trung tâm luyện thi.'; },
    valid: function (l) { return (l.school === 'upper' || l.school === 'priv') && !l.flags.luyenThi; },
    opts: [
      { k: 'center', l: 'Đăng ký luyện thi ở trung tâm nổi tiếng', h: function (l) { return l.fam.q <= 2 ? 'Bố mẹ phải vay mượn thêm' : 'Học từ sáng đến tối'; }, ai: { smart: 0.8, w: 1.2 }, run: function (l, r, log) { l.flags.luyenThi = 2; l.mind.stress += 12; fx(l, { kno: 4, hap: -3 }); if (l.fam.q <= 2) l.flags.famDebt = true; log('Ngày ba ca: trường, trung tâm, về nhà làm đề đến khuya.', 'neutral'); } },
      { k: 'online', l: 'Học online, tự ôn theo lộ trình', ai: { w: 1 }, run: function (l, r, log) { l.flags.luyenThi = 1; fx(l, { kno: 3 }); l.mind.stress += 5; log('Đăng ký khóa học online, tự kỷ luật ôn từng chuyên đề.', 'neutral'); } },
      { k: 'self', l: 'Tự ôn với bạn bè', ai: { soc: 0.8, w: 0.8 }, run: function (l, r, log) { l.flags.luyenThi = 1; fx(l, { kno: 2, soc: 2 }); log('Lập nhóm ôn thi với mấy đứa bạn thân, vừa học vừa cười.', 'good'); } },
      { k: 'slack', l: 'Kệ, đến đâu hay đến đó', ai: { w: 0.4, risk: 0.6 }, run: function (l, r, log) { l.flags.luyenThi = -1; fx(l, { hap: 4, kno: -2 }); log('Năm cuối cấp vẫn ung dung chơi bời.', 'neutral'); } }
    ]
  });
  T('luyen_thi', function (l, a) { return isVN(l) && a === 17 && (l.school === 'upper' || l.school === 'priv') && !l.flags.luyenThi; }, 0.9, 99);
  E.rollExamScore = function (l, r) {
    var lt = l.flags.luyenThi || 0;
    var knowledge = U.clamp(l.st.kno, 0, 100);
    // v5.6.1: điểm sát thực tế — năng lực làm bài cố định theo từng người; trung bình ~23–24, học sinh siêu giỏi vẫn có thể đạt 30, học kém có thể trượt tốt nghiệp (dưới 15)
    if (l.flags.examApt == null) { var ah = { rs: (l.rs ^ 0x3e1a7) | 0 }; l.flags.examApt = U.clamp(U.normal(function () { return U.rand(ah); }), -2.6, 2.6); }
    var apt = l.flags.examApt;
    var s = 16 + (knowledge - 50) * .14 + apt * 2 + (l.focus === 'study' ? .6 : 0) + lt * .45 + (KHOI_TALENT[l.talent] === l.khoi ? .4 : 0) - (l.mind && l.mind.stress > 80 ? 1 : 0) + U.clamp(U.normal(r), -1.2, 1.2) * .8;
    if (apt > 1.8 && knowledge >= 95) s += (apt - 1.8) * 4.5; // học siêu giỏi: có cơ hội chạm điểm tuyệt đối
    if (apt < -1.7 && knowledge < 85) s -= (-1.7 - apt) * 4; // học rất kém: có thể trượt tốt nghiệp
    if (knowledge >= 95) s = Math.max(20, s);
    s = Math.round(U.clamp(s, 5, 30) * 4) / 4;
    return s;
  };
  // điểm thi tốt nghiệp THPT (thang 30 điểm cho 3 môn của khối)
  E.HOOKS.gradUpper.push(function (l, r, log) {
    if (!isVN(l)) return;
    if (!l.khoi) l.khoi = KHOI_TALENT[l.talent] || (r() < 0.5 ? 'A00' : 'D01');
    var s = E.rollExamScore(l, r);
    l.examScore = s;
    var txt = U.fmtNum(s, 2).replace(/,?0+$/, '');
    log('Thi tốt nghiệp THPT khối ' + l.khoi + ': ' + txt + ' điểm' + (s >= 29 ? ' — điểm thi xuất sắc!' : s >= 27 ? ' — điểm rất cao!' : s < 15 ? ' — thấp hơn mong đợi.' : '.'), s >= 27 ? 'big' : s < 15 ? 'bad' : 'neutral');
    if (s >= 27) { l.flags.scholar = true; H.mem(l, 'Ngày tra điểm thi: ' + txt + ' điểm, cả nhà vỡ òa.', 5); fx(l, { hap: 8 }); }
    else if (s < 15) fx(l, { hap: -5 });
    if (s >= 29) { l.fame = Math.max(l.fame || 0, 3000); }
    if (s >= 30) H.mem(l, 'Ngày nhận tin thủ khoa với điểm tuyệt đối 30/30.', 6);
    if (s < 15) failHS(l, log);
  });
  // v5.6.1: điểm quá thấp thì trượt tốt nghiệp THPT, chưa có bằng; năm sau được thi lại, học nghề hoặc đi làm
  function failHS(l, log) {
    for (var i = l.log.length - 1; i >= 0 && l.log[i].a === l.age; i--) if (/^Tốt nghiệp (THPT|trung học phổ thông)\.$/.test(l.log[i].t)) { l.log.splice(i, 1); break; }
    l.edu = Math.min(l.edu, 2); l.flags.uniNext = null; l.flags.hsFail = (l.flags.hsFail || 0) + 1;
    log('Trượt tốt nghiệp THPT — chưa có bằng tốt nghiệp. Cầm tờ giấy báo điểm mà không dám về nhà.', 'bad');
    H.mem(l, 'Năm trượt tốt nghiệp THPT, cả nhà không ai nói câu nào.', 4);
    H.sched(l, 'thi_lai_tn', 1);
  }
  SC('thi_lai_tn', {
    title: 'Thi lại tốt nghiệp THPT', valid: function (l) { return l.edu < 3 && !!l.flags.hsFail && !l.school; },
    text: 'Năm ngoái bạn trượt tốt nghiệp THPT. Năm nay có thể đăng ký thi lại (hệ giáo dục thường xuyên hoặc thí sinh tự do), học nghề, hoặc đi làm luôn.',
    opts: [
      { k: 'thi', l: 'Ôn kỹ rồi thi lại', ai: { w: 1.3, smart: 1 }, run: function (l, r, log) {
        var s = Math.min(30, Math.max(E.rollExamScore(l, r), 12) + 2.5 + r() * 2); s = Math.round(s * 4) / 4; l.examScore = s;
        if (s >= 15) { l.edu = Math.max(l.edu, 3); log('Thi lại tốt nghiệp THPT: ' + U.fmtNum(s, 2).replace(/,?0+$/, '') + ' điểm — đỗ, có bằng tốt nghiệp.', 'good'); fx(l, { hap: 6 }); if (E.DEC.uni) l.pending.unshift(E.DEC.uni.make(l, r)); }
        else if ((l.flags.hsFail || 0) < 2) { l.flags.hsFail++; log('Thi lại vẫn trượt tốt nghiệp. Năm sau còn một cơ hội nữa.', 'bad'); fx(l, { hap: -6 }); H.sched(l, 'thi_lai_tn', 1); }
        else { l.flags.needJob = true; log('Thi lại vẫn trượt. Bạn quyết định thôi, đi làm kiếm sống.', 'bad'); fx(l, { hap: -5 }); }
      } },
      { k: 'nghe', l: 'Học trung cấp nghề', ai: { w: 0.8 }, run: function (l, r, log) { l.school = 'voc'; l.schoolEnd = l.age + 2; log('Đăng ký học trung cấp nghề, vừa học nghề vừa học văn hóa.', 'neutral'); } },
      { k: 'lam', l: 'Đi làm luôn', ai: { w: 0.7 }, run: function (l, r, log) { l.flags.needJob = true; log('Thôi không thi nữa, đi làm kiếm tiền.', 'neutral'); } }
    ]
  });
  if (E.MAJOR) E.MAJOR.thi_lai_tn = 1;
  // học bổng đại học
  EV(function (l, a) { return (l.school === 'uni' || l.school === 'abroad') && (l.flags.scholar || l.st.kno >= 72) && !l.flags.scholarGot; }, 0.5, function (l, a, r, log) {
    l.flags.scholarGot = true; var full = !!l.flags.scholar && r() < 0.6;
    log(full ? 'Nhận học bổng toàn phần nhờ điểm thi xuất sắc.' : 'Nhận học bổng khuyến khích học tập của trường.', 'good');
    cashB(l, full ? 0.3 : 0.08, full ? 'Học bổng toàn phần' : 'Học bổng khuyến khích'); fx(l, { hap: 5, kno: 2 });
    if (full) H.mem(l, 'Cầm quyết định học bổng toàn phần, bạn gọi ngay về cho mẹ.', 4);
  });
  SC('chuyen_truong', {
    title: 'Chuyển trường', prep: function (l, r) { return { why: pick(r, ['Bố chuyển công tác', 'Nhà chuyển đến chỗ ở mới', 'Bố mẹ muốn cho bạn vào trường tốt hơn']) }; },
    text: function (l, d) { return d.why + ', bạn phải chuyển sang một ngôi trường lạ, xa hết bạn bè cũ.'; },
    opts: [
      { k: 'open', l: 'Chủ động làm quen bạn mới', ai: { soc: 1, w: 1 }, run: function (l, r, log) { if (ch(r, 0.7)) { log('Tuần đầu đã có hội bạn mới cùng ăn trưa.', 'good'); fx(l, { soc: 4, hap: 3 }); } else { log('Cố làm quen nhưng bị cả lớp ra rìa một thời gian.', 'bad'); fx(l, { hap: -4 }); l.mind.stress += 6; } } },
      { k: 'miss', l: 'Nhớ bạn cũ, viết thư / nhắn tin mỗi ngày', ai: { w: 1 }, run: function (l, r, log) { log('Ngày nào cũng nhắn tin với đám bạn cũ, mãi mới quen trường mới.', 'neutral'); fx(l, { hap: -2 }); if (l.bff && l.bff.alive) l.bff.close += 4; } },
      { k: 'study', l: 'Vùi đầu vào học cho quên', ai: { smart: 0.6, w: 0.8 }, run: function (l, r, log) { log('Lặng lẽ vùi đầu vào sách vở, điểm số tăng vọt.', 'neutral'); fx(l, { kno: 3, soc: -2 }); } }
    ]
  });
  T('chuyen_truong', function (l, a) { return a >= 7 && a <= 15 && l.school && !l.flags.transfer && free(l); }, 0.02, 99);
  E.TRIG.forEach(function (t) { if (t.id === 'chuyen_truong') t.child = true; });
  wrapApply('chuyen_truong', function (l) { l.flags.transfer = true; });
  SC('bat_nat_mang', {
    title: 'Bị bắt nạt trên mạng', text: 'Ai đó lập nhóm chat chế ảnh bạn, cả khối chuyền tay nhau cười cợt.',
    opts: [
      { k: 'report', l: 'Chụp màn hình, báo thầy cô & bố mẹ', ai: { smart: 0.8, w: 1 }, run: function (l, r, log) { if (ch(r, 0.7)) { log('Nhà trường xử lý, nhóm chat bị giải tán, người lập nhóm phải xin lỗi.', 'good'); fx(l, { hap: 3 }); } else { log('Báo rồi nhưng chẳng ai làm gì. Bạn thấy mình vô hình.', 'bad'); fx(l, { hap: -5 }); l.mind.stress += 8; } } },
      { k: 'off', l: 'Khóa mạng xã hội một thời gian', ai: { w: 1 }, run: function (l, r, log) { log('Khóa hết tài khoản. Vài tuần sau mọi người cũng quên.', 'neutral'); l.mind.stress -= 2; } },
      { k: 'back', l: 'Đăng bài đáp trả', ai: { risk: 1, w: 0.6 }, run: function (l, r, log) { if (ch(r, 0.4)) { log('Bài đáp trả hài hước được cả khối ủng hộ, kẻ bắt nạt im bặt.', 'good'); fx(l, { soc: 4, hap: 4 }); } else { log('Cuộc khẩu chiến leo thang, bạn bị chế ảnh nhiều hơn.', 'bad'); fx(l, { hap: -8 }); l.mind.stress += 12; } } },
      { k: 'endure', l: 'Im lặng chịu đựng', ai: { w: 0.5 }, run: function (l, r, log) { log('Đêm nào cũng đọc lại những bình luận ác ý rồi khóc.', 'bad'); fx(l, { hap: -8 }); l.mind.stress += 15; H.mem(l, 'Những đêm đọc bình luận ác ý về mình đến sáng.', 3); } }
    ]
  });
  T('bat_nat_mang', function (l, a) { return a >= 12 && a <= 17 && l.school && free(l); }, 0.03, 4);
  E.TRIG.forEach(function (t) { if (t.id === 'bat_nat_mang') t.child = true; });

  // ===================================================================
  // HÀNH ĐỘNG CHỦ ĐỘNG MỚI
  // ===================================================================
  A('ban_tai_san', 'Tiền bạc', 'Bán / rút tài sản', { min: 18, avail: function (l) { return hasAssets(l) || l.ins ? true : 'Chưa có tài sản đầu tư'; } });
  A('mua_bao_hiem', 'Tiền bạc', 'Mua bảo hiểm', { min: 20, sc: 'bao_hiem', avail: function (l) { return l.ins ? 'Đang có hợp đồng bảo hiểm' : !l.indep ? 'Chưa tự lập' : true; }, ai: { w: 0.05 } });
  A('tri_lieu', 'Sức khỏe & tâm hồn', 'Chăm sóc tinh thần', { min: 12, ai: function (l) { return l.mind && l.mind.stress > 60 ? 0.6 : 0.03; } });

  // ===================================================================
  // ĐĂNG KÝ VÀO VÒNG NĂM & PHÂN LOẠI NGÃ RẼ
  // ===================================================================
  E.HOOKS.year.push(function (l, r, log, a) {
    E.migrateExt(l);
    mindYear(l, r, log, a);
    if (l.indep || E.assetTotal(l) > 0.5 || l.hui || l.ins) assetsYear(l, r, log, a);
    kidsYear(l, r, log, a);
  });
  ['con_18', 'con_lac_loi', 'khung_hoang_40', 'kiet_suc', 'chon_khoi'].forEach(function (id) { E.MAJOR[id] = 1; });
  E.ASSET_NAME = ASSET_NAME;

  // ===================================================================
  // 5. "SỐNG TIẾP ĐỜI CON": tạo tham số cho một đời mới, sinh ra là con của nhân vật vừa mất
  // ===================================================================
  E.childOpts = function (l, k) {
    initKid(k);
    // v2.4: đã định cư hẳn ở nước ngoài thì con sinh ra ở nước đó (trước đây vẫn sinh ở Việt Nam)
    var VN = G.VN, vn = isVN(l) && l.mode === 'vn' && !(l.abroad && l.abroad.perm);
    var vice = l.addict && l.addict.drugs ? 'drugs' : l.addict && l.addict.gamble ? 'gamble' : l.addict && l.addict.alcohol ? 'alcohol' : E.isCrime && l.job && E.isCrime(l) ? 'gang' : null;
    var me = { name: l.name, sex: l.sex, age: k.born, job: k.pJob || (l.peakTitle || 'làm công ăn lương'), inc: k.pInc != null ? k.pInc : l.base * 0.8 / 12 };
    // tuổi & thu nhập của bạn đời được ghi lại đúng lúc con chào đời
    var mate = k.mate ? { name: k.mate.name, sex: k.mate.sex, age: U.clamp(k.mate.age, 16, 70), job: k.mateInc > 0 ? 'làm công ăn lương' : 'nội trợ', inc: k.mateInc || 0 } : null;
    var o = {
      mode: l.mode, variant: l.variant, difficulty: l.difficulty, year: l.birthYear + k.born, name: k.name, gender: k.sex, lifeMin: l.lifeMin,
      parent: { me: me, mate: mate, q: k.q || l.fam.q, sibs: Math.max(0, l.kids.length - 1), vice: vice, home: k.home || (l.ownHouse ? (l.houseName || 'nhà riêng') : l.urban ? 'nhà thuê' : 'nhà riêng'), gen: l.gen || 1, lineage: l.lineage || [], years: l.birthYear + '–' + (l.death ? l.death.year : l.birthYear + l.age) }
    };
    if (vn) {
      var city = l.movedTo && VN.byName[l.movedTo] ? l.movedTo : null;
      o.oldProv = city || l.prov.old; o.eth = l.eth; o.urban = !!(l.urban || city);
    } else {
      o.mode = 'world'; o.country = l.abroad && l.abroad.perm ? l.abroad.code : l.country; o.urban = !!l.urban;
      if (!(l.abroad && l.abroad.perm)) o.city = l.city;
    }
    return o;
  };
  E.ext = { kidsYear: kidsYear, assetsYear: assetsYear, mindYear: mindYear, sell: sell, buy: buy, initKid: initKid };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
