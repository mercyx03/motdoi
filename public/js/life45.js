/* Một Đời — v4.4 (góp ý của người chơi):
   · nghề tự do, tự kinh doanh không có chuyện "thăng chức" — chỉ có tay nghề, uy tín, quy mô
   · mua trả góp: kỳ hạn, lãi suất, số tiền mỗi năm / mỗi tháng, tổng phải trả ghi rõ khi chọn; mỗi năm trừ tiền góp và ghi vào nhật ký
   · xưng hô đúng giới tính, đúng vai (phù rể / phù dâu, anh / em)
   · cho con tiền: hỏi ý kiến thay vì tự động, không hỏi trùng với "con xin vốn"
   · hệ quả các mối quan hệ: ly hôn (quyền nuôi con, cấp dưỡng, con buồn), bố mẹ mất khi còn nhỏ (gà trống nuôi con, ở với ông bà),
     ngày giỗ, bố / mẹ già ở một mình, đi bước nữa; góa bụa
   · hồi tưởng cuối đời luôn có người bạn đời (còn sống hay đã mất) */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function fx(l, o) { H.fx(l, o); }
  function mo(l, v) { return H.money(l, v); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function inJail(l) { return l.jailUntil != null && l.age < l.jailUntil; }
  function free(l) { return !inJail(l) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function vnd(l) { return isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  function V(l, tr) { return vnd(l) ? tr : tr / 90 * l.base; }
  function T(id, when, p, cd, max) { E.TRIG.push({ id: id, when: function (l, a) { return free(l) && when(l, a); }, p: p, cd: cd || 4, max: max || 1 }); }
  function stress(l, x) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + x, 0, 100); }
  function minors(l) { return (l.kids || []).filter(function (k) { return k.alive && l.age - k.born < 18; }); }

  // ===================================================================
  // 1. XƯNG HÔ
  // ===================================================================
  // người bạn đời p nói với nhân vật l: p tự xưng là gì (me), gọi l là gì (you)
  E.xung = function (l, p) {
    p = p || l.partner || {}; var ps = p.sex || (l.sex === 'M' ? 'F' : 'M');
    if (ps !== l.sex) return ps === 'M' ? { me: 'anh', you: 'em' } : { me: 'em', you: 'anh' };
    var older = (p.age || l.age) >= l.age; return older ? { me: ps === 'M' ? 'anh' : 'chị', you: 'em' } : { me: 'em', you: l.sex === 'M' ? 'anh' : 'chị' };
  };
  E.weddingRole = function (l) { return l.sex === 'M' ? 'phù rể' : 'phù dâu'; };

  // ===================================================================
  // 2. THĂNG TIẾN: ĐÚNG VỚI ĐẶC THÙ TỪNG NGHỀ
  // ===================================================================
  var SELF = /^(fl_|hoa_si|tho_xam|nhiep_anh|makeup|stylist|mc_su_kien|dj|cay_thue|gia_su|pt_gym|nhac_si|bien_kich|dao_dien|tx_cn|ve_chai|ban_rong|ngu_dan|nong|sau_rieng|nuoi_tom|tham_tu|xe_om|streamer|youtuber|kol_live|caster_es)/;
  function kind(l, c, prev, now) {
    if (/^(chủ|giám đốc công ty|chủ tịch)/.test(now) && !/^(chủ|giám đốc|chủ tịch)/.test(prev)) return 'open';
    if (/^(chủ|giám đốc công ty|chủ tịch)/.test(prev) && c.id !== 'tai_phiet') return 'grow';
    if (c.cat === 'free' || SELF.test(c.id)) return 'self';
    if (c.cat === 'worker' || c.cat === 'beauty') return 'skill';
    return 'promo';
  }
  E.rankKind = function (l) { var c = E.CAR[E.resolveJob(l.job.id)], rk = l.job.rank; return kind(l, c, c.t[Math.max(0, rk - 1)], c.t[rk]); };
  E.rankUpText = function (l, c) {
    var rk = l.job.rank, now = E.jobTitle ? E.jobTitle(l) : c.t[rk], prev = c.t[Math.max(0, rk - 1)], k = kind(l, c, prev, c.t[rk]);
    if (c.id === 'tx_cn') return { t: 'Dành dụm mua được ô tô, chuyển sang chạy ' + now + '.', m: 'Ngày lái chiếc ô tô của mình đi đón vị khách đầu tiên.' };
    if (k === 'open') return { t: 'Tích cóp đủ vốn và kinh nghiệm, bạn mở cơ sở riêng — giờ là ' + now + '.', m: 'Ngày khai trương cơ sở của riêng mình.' };
    if (k === 'grow') return { t: 'Làm ăn phát đạt, mở rộng quy mô — giờ là ' + now + '.', m: 'Ngày cơ ngơi của bạn lớn thành ' + now + '.' };
    if (k === 'self') return { t: 'Làm tự do không có ai "thăng chức" cho mình — nhưng tay nghề, uy tín lên dần, khách tìm đến đông hơn, nhận được việc lớn hơn: giờ bạn là ' + now + '.', m: 'Năm khách hàng bắt đầu tìm đến tận nơi, gọi bạn là ' + now + '.' };
    if (k === 'skill') return { t: 'Lên tay nghề, được giao làm việc chính — giờ là ' + now + '.', m: 'Ngày trở thành ' + now + '.' };
    return { t: 'Được thăng chức: ' + now + '.', m: 'Ngày nhận quyết định bổ nhiệm ' + c.t[rk] + '.' };
  };

  // ===================================================================
  // 3. TRẢ GÓP CÓ KỲ HẠN, GHI RÕ
  // ===================================================================
  var PLAN = { car: { n: 5, rate: 0.1, who: 'ngân hàng' }, fin: { n: 2, rate: 0.3, who: 'công ty tài chính' } };
  function annuity(P, r, n) { return r > 0 ? P * r / (1 - Math.pow(1 + r, -n)) : P / n; }
  E.loanPlan = function (l, price, type, down) {
    var Pn = PLAN[type]; if (!Pn) return ''; down = down == null ? 0.3 : down;
    var Y = price * (1 - down), pay = annuity(Y, Pn.rate, Pn.n), tot = pay * Pn.n;
    return 'Trả trước ' + mo(l, price * down) + ' (' + Math.round(down * 100) + '%), vay ' + Pn.who + ' ' + mo(l, Y) + ' · lãi ' + Math.round(Pn.rate * 100) + '%/năm · góp ' + Pn.n + ' năm, mỗi năm ' + mo(l, pay) + ' (khoảng ' + mo(l, pay / 12) + '/tháng) · tổng phải trả ' + mo(l, tot) + ', tiền lãi ' + mo(l, tot - Y);
  };
  var al0 = H.addLoan;
  H.addLoan = function (l, type, amt) {
    var n0 = (l.loans || []).length, x = al0.apply(this, arguments), L = (l.loans || [])[n0];
    if (L && PLAN[type]) { var Pn = PLAN[type]; L.rate = Pn.rate; L.term = Pn.n; L.pay = annuity(L.bal, Pn.rate, Pn.n); L.veh = true; }
    return x;
  };
  E.loanWhat = function (l, L) { return L.what || (L.veh ? (l.vehName || l.veh || 'xe') : L.name); };

  // ===================================================================
  // 4. CHO CON TIỀN: HỎI Ý KIẾN, KHÔNG TRÙNG
  // ===================================================================
  E.HOOKS.year.forEach(function (h, i) { if (/giftAt/.test(h.toString()) && /mua nhà/.test(h.toString())) E.HOOKS.year[i] = function () { }; });
  function giftable(l, a) { return (l.kids || []).filter(function (k) { return k.alive && a - k.born >= 22 && !(k.gotAt != null && a - k.gotAt < 8); }); }
  SC('cho_con_tien', {
    title: 'Giúp con một khoản', valid: function (l) { return giftable(l, l.age).length > 0 && l.money > l.base * 10; },
    prep: function (l, r) { var k = pick(r, giftable(l, l.age)); return { n: k.name, w: pick(r, ['mua nhà', 'làm vốn kinh doanh', 'lo cho các cháu ăn học', 'trả nợ ngân hàng']), x: l.money * (0.12 + r() * 0.1) }; },
    text: function (l, d) { return 'Con ' + d.n + ' đang cần tiền ' + d.w + '. Bạn đang có ' + mo(l, l.money) + ' tiền tích lũy. Có giúp con không?'; },
    opts: [
      { k: 'cho', l: function (l, d) { return 'Cho con ' + mo(l, d.x) + ' — "bố mẹ còn khỏe, giúp được gì thì giúp"'; }, ai: { w: 1, soc: 0.5 }, run: function (l, r, log, d) { var k = l.kids.filter(function (c) { return c.name === d.n; })[0]; if (!k) return; var x = Math.min(d.x, Math.max(0, l.money)); H.cash(l, -x, 'Cho con ' + d.n); k.gotAt = l.age; k.askedVon = true; k.close = Math.min(100, (k.close || 50) + 8); log('Cho con ' + d.n + ' ' + mo(l, x) + ' ' + d.w + '.', 'good'); fx(l, { hap: 4, karma: 2 }); } },
      { k: 'muon', l: function (l, d) { return 'Cho con mượn ' + mo(l, d.x / 2) + ', con trả dần'; }, ai: { w: 0.8, smart: 0.6 }, run: function (l, r, log, d) { var k = l.kids.filter(function (c) { return c.name === d.n; })[0]; if (!k) return; var x = Math.min(d.x / 2, Math.max(0, l.money)); H.cash(l, -x, 'Cho con ' + d.n + ' mượn'); k.gotAt = l.age; k.askedVon = true; k.owe = (k.owe || 0) + x; log('Cho con ' + d.n + ' mượn ' + mo(l, x) + ' ' + d.w + ', hẹn trả dần.', 'neutral'); } },
      { k: 'khong', l: 'Giữ lại tiền dưỡng già', ai: { w: 0.6 }, run: function (l, r, log, d) { var k = l.kids.filter(function (c) { return c.name === d.n; })[0]; if (k) { k.gotAt = l.age; k.close = Math.max(0, (k.close || 50) - 3); } log('Bảo con tự xoay xở, giữ lại tiền dưỡng già.', 'neutral'); } }
    ]
  });
  T('cho_con_tien', function (l, a) { return a >= 52 && l.indep && l.money > l.base * 15 && giftable(l, a).length > 0; }, 0.3, 4, 3);
  if (E.DEC.con_xin_von) {
    var cv = E.DEC.con_xin_von, cvv = cv.valid, cvm = cv.make;
    cv.valid = function (l, d) { var ok = cvv.apply(this, arguments); if (!ok) return false; var k = d && d.n ? l.kids.filter(function (c) { return c.name === d.n; })[0] : null; return !(k && k.gotAt != null && l.age - k.gotAt < 8); };
    cv.make = function (l, r, a) { l.kids.forEach(function (k) { if (k.gotAt != null && l.age - k.gotAt < 8) k.askedVon = true; }); return cvm.apply(this, arguments); };
    var cva = cv.apply; cv.apply = function (l, d) { var x = cva.apply(this, arguments); var k = d.data && d.data.n ? l.kids.filter(function (c) { return c.name === d.data.n; })[0] : null; if (k) k.gotAt = l.age; return x; };
  }
  // con trả dần tiền đã mượn
  E.HOOKS.year.push(function (l, r, log, a) { (l.kids || []).forEach(function (k) { if (!(k.owe > 0) || !k.alive) return; var p = Math.min(k.owe, Math.max(l.base * 0.3, k.owe * 0.25)); if (ch(r, 0.8)) { k.owe -= p; H.cash(l, p, 'Con ' + k.name + ' trả nợ'); if (k.owe < 0.5) { k.owe = 0; log('Con ' + k.name + ' đã trả hết khoản mượn năm nào.', 'good'); } } }); });

  // ===================================================================
  // 5. HỆ QUẢ CÁC MỐI QUAN HỆ
  // ===================================================================
  SC('quyen_nuoi_con', {
    title: 'Quyền nuôi con', valid: function (l) { return minors(l).length > 0 && !!l.flags.divEx; },
    text: function (l) { var ks = minors(l); return 'Ly hôn với ' + l.flags.divEx + ', còn ' + (ks.length === 1 ? 'con ' + ks[0].name + ' mới ' + (l.age - ks[0].born) + ' tuổi' : ks.length + ' đứa con nhỏ') + '. Ai sẽ nuôi con?'; },
    opts: [
      { k: 'nuoi', l: 'Giành quyền nuôi con', h: 'Một mình nuôi con, vất vả hơn', ai: { w: 1.1 }, run: function (l, r, log) { minors(l).forEach(function (k) { k.custody = 'me'; }); l.flags.single = l.age; log('Tòa giao con cho bạn nuôi. Từ nay một mình vừa đi làm vừa đưa đón con.', 'neutral'); stress(l, 8); } },
      { k: 'ex', l: 'Để con ở với người kia, bạn cấp dưỡng hằng tháng', h: function (l) { return 'Cấp dưỡng khoảng ' + mo(l, V(l, 3)) + '/tháng mỗi con đến năm 18 tuổi'; }, ai: { w: 0.8 }, run: function (l, r, log) { minors(l).forEach(function (k) { k.custody = 'ex'; k.close = Math.max(0, (k.close || 60) - 10); }); log('Con ở với ' + l.flags.divEx + '. Bạn cấp dưỡng hằng tháng, cuối tuần đón con đi chơi.', 'neutral'); fx(l, { hap: -6 }); } },
      { k: 'chung', l: 'Thỏa thuận cùng nuôi, con đi lại hai nhà', ai: { w: 1, soc: 1 }, run: function (l, r, log) { minors(l).forEach(function (k) { k.custody = 'both'; k.close = Math.max(0, (k.close || 60) - 4); }); log('Hai người thỏa thuận cùng nuôi con: tuần này ở nhà bố, tuần sau ở nhà mẹ. Không còn là vợ chồng nhưng vẫn là bố mẹ của con.', 'neutral'); } }
    ]
  });
  SC('con_sau_ly_hon', {
    title: 'Con sau ngày bố mẹ chia tay', valid: function (l) { return minors(l).some(function (k) { return k.custody; }); },
    prep: function (l, r) { var k = pick(r, minors(l).filter(function (k) { return k.custody; })); return { n: k.name }; },
    text: function (l, d) { return 'Từ ngày bố mẹ chia tay, ' + d.n + ' ít nói hẳn, kết quả học tập đi xuống. Cô giáo nhắn: "Dạo này cháu hay ngồi một mình."'; },
    opts: [
      { k: 'noi', l: 'Ngồi xuống nói chuyện, nói rằng bố mẹ vẫn thương con', ai: { w: 1.3, soc: 1 }, run: function (l, r, log, d) { var k = l.kids.filter(function (c) { return c.name === d.n; })[0]; if (k) k.close = Math.min(100, (k.close || 50) + 8); log('Ôm con, nói rằng chuyện người lớn không phải lỗi của con, bố mẹ vẫn thương con như ngày nào. ' + d.n + ' khóc rồi ngủ thiếp đi trong lòng bạn.', 'good'); fx(l, { hap: 2 }); } },
      { k: 'cung_ex', l: 'Hẹn người cũ cùng đưa con đi chơi một buổi', ai: { w: 0.8 }, run: function (l, r, log, d) { var k = l.kids.filter(function (c) { return c.name === d.n; })[0]; if (k) { k.close = Math.min(100, (k.close || 50) + 5); k.study = Math.min(100, (k.study || 50) + 3); } log('Bố mẹ cùng đưa ' + d.n + ' đi công viên. Con cười cả buổi.', 'good'); } },
      { k: 'ban', l: 'Bận quá, để con tự quen dần', ai: { w: 0.4 }, run: function (l, r, log, d) { var k = l.kids.filter(function (c) { return c.name === d.n; })[0]; if (k) { k.close = Math.max(0, (k.close || 50) - 8); k.study = Math.max(0, (k.study || 50) - 5); } log(d.n + ' dần thu mình lại.', 'bad'); } }
    ]
  });
  T('con_sau_ly_hon', function (l, a) { return l.flags.divAt != null && a - l.flags.divAt <= 3 && minors(l).some(function (k) { return k.custody; }); }, 0.4, 4, 1);
  SC('bo_me_mot_minh', {
    title: function (l) { return (l.fam.fAlive ? 'Bố' : 'Mẹ') + ' ở một mình'; }, valid: function (l) { return (l.fam.fAlive !== l.fam.mAlive) && l.indep && !l.flags.caring; },
    text: function (l) { var p = l.fam.fAlive ? 'bố' : 'mẹ', o = l.fam.fAlive ? 'mẹ' : 'bố'; return 'Từ ngày ' + o + ' mất, ' + p + ' ở một mình trong căn nhà cũ. Hàng xóm gọi điện báo ' + p + ' ăn uống thất thường, tối nào cũng ngồi một mình trước bàn thờ.'; },
    opts: [
      { k: 'don', l: function (l) { return 'Đón ' + (l.fam.fAlive ? 'bố' : 'mẹ') + ' về ở cùng'; }, ai: { w: 1, soc: 1 }, run: function (l, r, log) { l.flags.caring = true; log('Đón ' + (l.fam.fAlive ? 'bố' : 'mẹ') + ' về ở cùng. Bữa cơm nhà mình có thêm một người, ' + (l.fam.fAlive ? 'bố' : 'mẹ') + ' vui hẳn lên.', 'good'); fx(l, { hap: 3, karma: 4 }); } },
      { k: 'tham', l: 'Thu xếp về thăm thường xuyên hơn', ai: { w: 1.1 }, run: function (l, r, log) { H.cash(l, -V(l, 4), 'Về thăm ' + (l.fam.fAlive ? 'bố' : 'mẹ')); log('Cuối tuần nào cũng về thăm, gọi video mỗi tối.', 'good'); fx(l, { karma: 2 }); } },
      { k: 'ban', l: 'Bận quá, gửi tiền nhờ người trông giúp', ai: { w: 0.5 }, run: function (l, r, log) { H.cash(l, -V(l, 30), 'Thuê người chăm ' + (l.fam.fAlive ? 'bố' : 'mẹ')); log('Gửi tiền thuê người trông nom. ' + U.cap(l.fam.fAlive ? 'bố' : 'mẹ') + ' không trách, chỉ hỏi "bao giờ con về?"', 'neutral'); fx(l, { hap: -2 }); } }
    ]
  });
  T('bo_me_mot_minh', function (l, a) { return a >= 22 && l.flags.parentLostAt != null && a - l.flags.parentLostAt <= 6 && (l.fam.fAlive !== l.fam.mAlive) && l.indep && !l.flags.caring; }, 0.2, 4, 1);
  SC('di_buoc_nua', {
    title: function (l) { return (l.fam.fAlive ? 'Bố' : 'Mẹ') + ' muốn đi bước nữa'; }, valid: function (l) { return l.fam.fAlive !== l.fam.mAlive; },
    text: function (l) { var p = l.fam.fAlive ? 'bố' : 'mẹ'; return 'Mấy năm sau ngày ' + (l.fam.fAlive ? 'mẹ' : 'bố') + ' mất, ' + p + ' ngập ngừng nói muốn tìm một người bạn già để có đôi có bạn lúc tuổi xế chiều.'; },
    opts: [
      { k: 'ung_ho', l: 'Ủng hộ', ai: { w: 1.1, soc: 1 }, run: function (l, r, log) { var p = l.fam.fAlive ? 'bố' : 'mẹ'; log('Bạn nắm tay ' + p + ': "Miễn ' + p + ' vui là con vui." Đám cưới nhỏ chỉ có người nhà.', 'good'); fx(l, { hap: 2 }); l.flags.stepParent = true; } },
      { k: 'phan_doi', l: 'Phản đối, chưa chấp nhận được', ai: { w: 0.5 }, run: function (l, r, log) { var p = l.fam.fAlive ? 'bố' : 'mẹ'; log('Bạn phản đối. ' + U.cap(p) + ' không nói gì, từ đó ít khi nhắc lại.', 'bad'); fx(l, { hap: -3 }); } }
    ]
  });
  T('di_buoc_nua', function (l, a) { return l.flags.parentLostAt != null && a - l.flags.parentLostAt >= 2 && a - l.flags.parentLostAt <= 8 && (l.fam.fAlive !== l.fam.mAlive) && ((l.fam.fAlive ? l.fam.fAge : l.fam.mAge) + a) <= 72; }, 0.12, 4, 1);
  SC('goa_bua', {
    title: 'Những ngày một mình', valid: function (l) { return l.flags.widowAt != null && !l.partner; },
    text: function (l) { return 'Từ ngày ' + (l.flags.lateSpouse || 'người ấy') + ' mất, căn nhà rộng thênh thang. Bạn vẫn quen tay dọn hai cái bát mỗi bữa cơm.'; },
    opts: [
      { k: 'con', l: 'Dọn về ở với con cháu', req: function (l) { return (l.kids || []).some(function (k) { return k.alive && l.age - k.born >= 22; }); }, ai: { w: 1 }, run: function (l, r, log) { log('Dọn về ở với con cháu. Tiếng trẻ con ríu rít làm nỗi buồn vơi đi.', 'good'); fx(l, { hap: 6 }); stress(l, -10); } },
      { k: 'ban', l: 'Đi sinh hoạt câu lạc bộ, gặp gỡ bạn bè', ai: { w: 1, soc: 1 }, run: function (l, r, log) { log('Tham gia câu lạc bộ dưỡng sinh, đi chùa / nhà thờ, gặp gỡ bạn cũ. Nỗi nhớ vẫn còn, nhưng không còn cô quạnh.', 'good'); fx(l, { hap: 5, soc: 4 }); stress(l, -8); } },
      { k: 'mot_minh', l: 'Ở một mình với những kỷ niệm', ai: { w: 0.6 }, run: function (l, r, log) { log('Ở một mình, ngày ngày lau di ảnh ' + (l.flags.lateSpouse || 'người ấy') + '.', 'neutral'); stress(l, 5); fx(l, { hap: -3 }); } }
    ]
  });
  T('goa_bua', function (l, a) { return l.flags.widowAt != null && a - l.flags.widowAt <= 2 && !l.partner; }, 0.5, 4, 1);
  // theo dõi thay đổi các mối quan hệ mỗi năm
  E.HOOKS.year.push(function (l, r, log, a) {
    if (!l.alive) return;
    var F = l.flags, P = F.relPrev || {}, f = l.fam;
    // ly hôn
    if (P.st && P.st !== 'dating' && (l.exes || 0) > (P.ex || 0) && (!l.partner || l.partner.name !== P.n)) { F.divAt = a; F.divEx = P.n; stress(l, 10); if (minors(l).length && E.DEC.quyen_nuoi_con) l.pending.push(E.DEC.quyen_nuoi_con.make(l, r)); }
    // góa
    if (P.st && P.st !== 'dating' && (l.widowed || 0) > (P.wid || 0)) { F.widowAt = a; F.lateSpouse = P.n; (F.spouses = F.spouses || []).indexOf(P.n) < 0 && F.spouses.push(P.n); stress(l, 15); }
    // bố mẹ mất
    if ((P.m && !f.mAlive) || (P.f && !f.fAlive)) {
      F.parentLostAt = a;
      if (a < 18) {
        if (!f.mAlive && !f.fAlive) { F.orphanAt = a; log('Mồ côi cả bố lẫn mẹ, bạn về ở với ' + pick(r, ['ông bà', 'bà nội', 'bà ngoại', 'cô ruột', 'dì ruột']) + '. Từ đây phải tự lớn lên sớm hơn chúng bạn.', 'bad'); stress(l, 20); if (f.q > 1) f.q--; }
        else F.singleParent = f.fAlive ? 'bố' : 'mẹ';
      }
    }
    if (l.partner && l.partner.status !== 'dating') { F.spouses = F.spouses || []; if (F.spouses.indexOf(l.partner.name) < 0) F.spouses.push(l.partner.name); }
    F.relPrev = { n: l.partner && l.partner.name, st: l.partner && l.partner.status, ex: l.exes || 0, wid: l.widowed || 0, m: !!f.mAlive, f: !!f.fAlive };
    // cấp dưỡng nuôi con
    var pay = minors(l).filter(function (k) { return k.custody === 'ex'; }).length;
    if (pay && l.indep && !inJail(l)) H.cash(l, -V(l, 36) * pay, 'Cấp dưỡng nuôi con');
    if (F.divAt != null && a - F.divAt <= 2 && a > F.divAt) stress(l, 4);
  });
  // gà trống nuôi con / mẹ đơn thân
  E.EVENTS.push({ c: function (l, a) { return !!l.flags.singleParent && a < 18 && a - (l.flags.parentLostAt || 0) >= 1 && (l.flags.singleParent === 'bố' ? l.fam.fAlive : l.fam.mAlive); }, p: 0.35, cd: 3, run: function (l, a, r, log) {
    var p = l.flags.singleParent;
    log(p === 'bố' ? pick(r, ['Từ ngày mẹ mất, bố gà trống nuôi con: sáng nấu cơm, tối kèm bài, có hôm ngủ gục bên bàn.', 'Bố vụng về tết tóc cho bạn đi học, tóc lệch một bên mà bạn vẫn thương.', 'Họp phụ huynh, bố là ông bố duy nhất ngồi giữa các bà mẹ.']) : pick(r, ['Từ ngày bố mất, mẹ làm thêm ca đêm để nuôi con ăn học.', 'Mẹ một mình gánh vác cả nhà, có những đêm bạn thấy mẹ ngồi khóc một mình.', 'Tết đến, mẹ vẫn sắm đủ mâm cỗ, đặt thêm một đôi đũa cho bố.']), 'neutral');
    H.fx(l, { hap: -1 }); if (ch(r, 0.3)) H.fx(l, { kno: -1 });
  } });
  // ngày giỗ
  E.EVENTS.push({ c: function (l, a) { return isVN(l) && !l.abroad && a >= 12 && l.flags.parentLostAt != null && a - l.flags.parentLostAt >= 1 && (!l.fam.mAlive || !l.fam.fAlive); }, p: 0.08, cd: 6, run: function (l, a, r, log) {
    var w = !l.fam.mAlive && !l.fam.fAlive ? pick(r, ['bố', 'mẹ']) : !l.fam.mAlive ? 'mẹ' : 'bố';
    log(pick(r, ['Ngày giỗ ' + w + ', anh em họ hàng về đông đủ, thắp nén hương mà nhớ ' + w + ' quay quắt.', 'Đến ngày giỗ ' + w + ', bạn nấu lại món ' + w + ' thích nhất, đặt lên bàn thờ.', 'Giỗ ' + w + ' năm nay, bạn ngồi kể cho các con nghe về ' + w + ' ngày xưa.']), 'neutral');
  } });

  // người đang dư dả (vừa trúng số, có của ăn của để) thì không ham 'việc nhẹ lương cao'
  if (E.DEC.viec_nhe) { var vn0 = E.DEC.viec_nhe.valid; E.DEC.viec_nhe.valid = function (l) { if (l.money > l.base * 3 || (l.flags.lottoWin && l.flags.lottoWin.amt > l.base)) return false; return vn0 ? vn0.apply(this, arguments) : true; }; }

  // ===================================================================
  // 6. HỒI TƯỞNG CUỐI ĐỜI CÓ NGƯỜI BẠN ĐỜI
  // ===================================================================
  E.spousesOf = function (l) { var s = (l.flags && l.flags.spouses || []).slice(); if (l.partner && l.partner.status !== 'dating' && s.indexOf(l.partner.name) < 0) s.push(l.partner.name); return s; };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
