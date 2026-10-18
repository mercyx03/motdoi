/* Một Đời — v4.5 (góp ý của người chơi):
   · chức vụ cao nhất / gần cao nhất (tổng giám đốc, chủ tịch, cơ trưởng…), chủ cơ sở, làm tự do không bị "sếp" ép
   · trong tù: chỉ có chuyện trong trại (3–4 chuyện mỗi năm), án tính trọn năm; không thi bằng lái, hẹn hò, mua nhà trong tù
   · buôn lậu, ma túy có đường dây, lên cấp dần, ông trùm ít bị bắt; thu nhập theo cấp
   · chủ động mở thêm chi nhánh / mở rộng quy mô khi có tiền
   · năng khiếu game chỉ là thể loại (MOBA / FPS), người chơi tự chọn game
   · chọn concert: chọn nhóm rồi chọn nghệ sĩ
   · lời kể về gia đình đúng hoàn cảnh (không con cháu, không anh chị em, cả nhà đã mất…)
   · giới hạn tuổi một số hoạt động (tập gym…) */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function A(id, g, label, o) { var x = { id: id, g: g, l: label }; for (var k in o) x[k] = o[k]; E.ACT.push(x); }
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
  function jid(l) { return l.job ? E.resolveJob(l.job.id) : null; }
  function parent(l) { return l.fam.mAlive ? 'mẹ' : l.fam.fAlive ? 'bố' : null; }

  // ===================================================================
  // 1. CHỨC CAO KHÔNG BỊ "SẾP" ÉP
  // ===================================================================
  var TOPT = /^(tổng giám đốc|chủ tịch|phó tổng giám đốc|giám đốc|cơ trưởng|bí thư|bộ trưởng|thứ trưởng|giám đốc bệnh viện|hiệu trưởng|viện trưởng|tổng biên tập|chánh án|trưởng khoa|bác sĩ trưởng khoa|tổng đạo diễn|giám đốc sáng tạo)/;
  function hasBoss(l) {
    if (!l.job || l.job.fam || !H.isEmployee(l)) return false;
    if (E.isFreelanceJob && E.isFreelanceJob(l)) return false; // v5.6.4: MC, makeup, tài xế ứng dụng… làm tự do, không có sếp
    var c = E.CAR[jid(l)]; if (!c) return true;
    var rk = l.job.rank || 0, n = c.t.length;
    if (n > 1 && rk >= n - 1) return false;
    if (n >= 4 && rk >= n - 2) return false;
    if (TOPT.test(c.t[Math.min(rk, n - 1)])) return false;
    return true;
  }
  E.hasBoss = hasBoss;
  ['sep_ep', 'vp_cuop_cong', 'ks_du_an', 'cn_cuu_sep', 'pc_met_moi'].forEach(function (id) { var D = E.DEC[id]; if (!D) return; var v0 = D.valid; D.valid = function (l) { return hasBoss(l) && (v0 ? v0.apply(this, arguments) : true); }; });
  if (E.DEC.nh_chi_tieu) { var nc0 = E.DEC.nh_chi_tieu.valid; E.DEC.nh_chi_tieu.valid = function (l) { return hasBoss(l) && (!nc0 || nc0.apply(this, arguments)); }; }
  E.ACT.forEach(function (a) { if (a.id === 'tang_luong') { var av = a.avail; a.avail = function (l) { var x = av ? av(l) : true; return x === true && !hasBoss(l) ? 'Không áp dụng' : x; }; } });

  // ===================================================================
  // 2. GIỚI HẠN TUỔI MỘT SỐ HOẠT ĐỘNG
  // ===================================================================
  var MAXAGE = { tap_gym: 65, da_bong_ban: 60, leo_nui: 65, phuot: 55 };
  E.ACT.forEach(function (a) { if (MAXAGE[a.id] != null && (a.max == null || a.max > MAXAGE[a.id])) a.max = MAXAGE[a.id]; });

  // ===================================================================
  // 3. TRONG TÙ
  // ===================================================================
  E.JAIL_OK = /^(tg_|trai_giam$|treat$|phau_thuat$)/;
  function PJ(id, title, text, opts, valid) { SC(id, { title: title, text: text, valid: function (l) { return inJail(l) && (!valid || valid(l)); }, opts: opts.map(function (o) { return { k: o[0], l: o[1], ai: o[2], run: o[3] }; }) }); }
  function pts(l, x) { l.flags.jailPts = (l.flags.jailPts || 0) + x; }
  PJ('tg_kham_xet', 'Khám xét buồng giam', 'Cán bộ quản giáo bất ngờ khám xét buồng giam. Có người giấu điện thoại, thuốc lá dưới chiếu, nhờ bạn cất giúp.', [
    ['tu_choi', 'Từ chối, không dính vào', { w: 1.3 }, function (l, r, log) { pts(l, 1); log('Từ chối thẳng. Đợt khám xét tìm ra đồ cấm, mấy người bị kỷ luật — bạn không liên quan.', 'good'); }],
    ['giau', 'Cất giúp cho "có nghĩa"', { risk: 1, w: 0.4 }, function (l, r, log) { if (ch(r, 0.5)) { l.jailUntil++; log('Bị phát hiện cất giấu đồ cấm, bị kỷ luật, tăng thêm án một năm.', 'bad'); } else { log('Thoát được đợt khám xét. Người kia nợ bạn một ân tình.', 'neutral'); } }]]);
  PJ('tg_sinh_nhat', 'Sinh nhật trong trại', 'Hôm nay là sinh nhật bạn. Không có bánh kem, chỉ có bữa cơm tù như mọi ngày.', [
    ['im', 'Lặng lẽ cho qua', { w: 1 }, function (l, r, log) { log('Sinh nhật trôi qua lặng lẽ. Tối nằm nhìn lên trần, nhớ những lần sinh nhật ở nhà.', 'neutral'); fx(l, { hap: -2 }); }],
    ['ban', 'Bạn cùng buồng góp bánh kẹo thăm nuôi làm "tiệc"', { w: 1, soc: 1 }, function (l, r, log) { log('Cả buồng góp mấy gói bánh, hát chúc mừng sinh nhật khe khẽ. Lần đầu bạn cười sau nhiều tháng.', 'good'); fx(l, { hap: 3, soc: 2 }); }]]);
  PJ('tg_tin_nha', 'Tin dữ từ nhà', function (l) { return 'Thư nhà báo tin ' + (parent(l) || 'người thân') + ' ốm nặng, nằm viện. Bạn không thể về.'; }, [
    ['don', 'Làm đơn xin về thăm (theo quy định đặc biệt)', { w: 1 }, function (l, r, log) { if (ch(r, 0.25)) log('Được trại xem xét cho về thăm có cán bộ dẫn giải trong một ngày. Nắm tay ' + (parent(l) || 'người thân') + ' mà không nói được câu nào.', 'neutral'); else log('Đơn không được chấp thuận. Bạn chỉ biết viết thư gửi về.', 'bad'); fx(l, { hap: -4 }); }],
    ['thu', 'Viết thư động viên', { w: 1 }, function (l, r, log) { log('Viết thư động viên, hứa sẽ cải tạo tốt để sớm về.', 'neutral'); pts(l, 1); fx(l, { hap: -3 }); }]], function (l) { return !!parent(l); });
  PJ('tg_bep', 'Tổ nhà bếp', 'Trại cần người phụ bếp cho cả phân trại: dậy từ 3 giờ sáng, nấu cơm cho hàng trăm người.', [
    ['nhan', 'Xin vào tổ bếp', { w: 1.2 }, function (l, r, log) { pts(l, 2); fx(l, { hea: -1 }); log('Vào tổ bếp, ngày nào cũng nấu mấy nồi cơm lớn. Mệt nhưng được ghi nhận chăm chỉ.', 'good'); if (!l.hobby) { l.hobby = 'nauan'; l.hobbySk = 20; } }],
    ['khong', 'Thôi, ở tổ cũ', { w: 0.6 }, function (l, r, log) { log('Ở lại tổ lao động cũ.', 'neutral'); }]]);
  PJ('tg_luat_su', 'Kháng cáo', 'Một luật sư trợ giúp pháp lý đến trại, nói hồ sơ của bạn có tình tiết giảm nhẹ chưa được xem xét.', [
    ['khang', 'Làm đơn đề nghị xem xét lại', { w: 1, smart: 1 }, function (l, r, log) { if (ch(r, 0.25) && l.jailUntil - l.age > 1) { l.jailUntil--; log('Tòa xem xét lại, giảm cho bạn một năm án.', 'good'); } else log('Đơn được tiếp nhận nhưng giữ nguyên bản án.', 'neutral'); }],
    ['thoi', 'Thôi, chấp hành án', { w: 0.6 }, function (l, r, log) { log('Chấp hành án, không kháng cáo.', 'neutral'); }]]);
  PJ('tg_tien_ban', 'Tiễn bạn tù', 'Người bạn cùng buồng thân nhất mãn hạn tù. Trước khi đi, anh ta dúi cho bạn bánh xà phòng, cái khăn mặt.', [
    ['dan', 'Dặn bạn ra ngoài sống tử tế', { w: 1.3 }, function (l, r, log) { log('Ôm nhau ở cổng buồng, dặn nhau ra ngoài sống tử tế. Tối ấy bạn nằm nhìn chỗ trống bên cạnh.', 'neutral'); fx(l, { hap: -2, karma: 2 }); }],
    ['hen', 'Hẹn ra tù sẽ tìm nhau "làm ăn"', { bad: 1 }, function (l, r, log) { l.flags.jailContact = true; log('Hẹn ra tù sẽ tìm nhau.', 'neutral'); }]]);
  PJ('tg_cai_nghien', 'Cắt cơn trong trại', 'Vào trại không có ma túy, những cơn thèm thuốc hành hạ bạn từng đêm.', [
    ['cai', 'Cắn răng cắt cơn, theo chương trình cai nghiện', { w: 1.4 }, function (l, r, log) { if (l.addict) l.addict.drugs = false; fx(l, { hea: -6, hap: -4 }); pts(l, 1); log('Những đêm vật vã qua đi. Lần đầu sau nhiều năm, người bạn sạch ma túy.', 'good'); H.mem(l, 'Những đêm cắt cơn trong trại giam.', 4); }]], function (l) { return !!(l.addict && l.addict.drugs); });
  PJ('tg_doi_bong', 'Giải bóng đá phân trại', 'Trại tổ chức giải bóng đá giữa các đội phạm nhân dịp lễ.', [
    ['da', 'Ra sân thi đấu', { w: 1.1 }, function (l, r, log) { fx(l, { hea: 2, hap: 3, soc: 2 }); log(ch(r, 0.4) ? 'Đội bạn vô địch giải, được thưởng thêm suất ăn.' : 'Thua ở bán kết, nhưng cả đội vẫn vui.', 'good'); }],
    ['co_vu', 'Ngồi cổ vũ', { w: 0.8 }, function (l, r, log) { fx(l, { hap: 1 }); log('Ngồi cổ vũ khản cổ.', 'neutral'); }]]);
  PJ('tg_nhat_ky', 'Cuốn sổ nhỏ', 'Bạn xin được một cuốn sổ và cây bút, bắt đầu viết về những năm tháng đã qua.', [
    ['viet', 'Viết thật về những sai lầm của mình', { w: 1.2 }, function (l, r, log) { stress(l, -8); fx(l, { kno: 2, karma: 2 }); log('Viết kín cuốn sổ về những sai lầm, về những người đã làm tổn thương. Viết xong thấy lòng nhẹ hơn.', 'good'); }]]);
  PJ('tg_moi_vao', 'Phạm nhân mới', 'Một cậu thanh niên mới vào trại, mặt còn non choẹt, bị mấy người cũ bắt nạt.', [
    ['bao_ve', 'Đứng ra bênh vực', { w: 1.1, karma: 1 }, function (l, r, log) { fx(l, { karma: 4, hea: -2 }); pts(l, 1); log('Đứng ra bênh cậu ta. Từ đó cậu gọi bạn là "anh / chị", hứa ra tù sẽ làm lại cuộc đời.', 'good'); }],
    ['ke', 'Mặc kệ, ai lo thân nấy', { w: 0.8 }, function (l, r, log) { log('Mặc kệ. Ở đây ai cũng lo thân mình.', 'neutral'); }]]);
  var JPOOL2 = ['tg_tham_nuoi', 'tg_dai_ca', 'tg_lao_dong', 'tg_hoc', 'tg_tron_trai', 'tg_dac_xa', 'tg_tet', 'tg_om', 'tg_ly_hon', 'tg_ban_tu', 'tg_thu_con', 'tg_tu_hoc', 'trai_giam', 'tg_kham_xet', 'tg_sinh_nhat', 'tg_tin_nha', 'tg_bep', 'tg_luat_su', 'tg_tien_ban', 'tg_cai_nghien', 'tg_doi_bong', 'tg_nhat_ky', 'tg_moi_vao'];
  E.jailYear = function (l, r, a) {
    var seen = (l.flags.jailSeen = l.flags.jailSeen || {});
    var ok = function (id) { return E.DEC[id] && E.DEC[id].valid(l, {}); };
    var pool = JPOOL2.filter(function (id) { return ok(id) && !seen[id]; });
    if (pool.length < 4) { l.flags.jailSeen = seen = {}; pool = JPOOL2.filter(ok); }
    for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
    if (l.flags.jailAt === a && pool.indexOf('tg_dai_ca') > 0) { pool.splice(pool.indexOf('tg_dai_ca'), 1); pool.unshift('tg_dai_ca'); }
    var n = 3 + (r() < 0.4 ? 1 : 0);
    return pool.slice(0, n).map(function (id) { seen[id] = 1; return [id]; });
  };
  // Án được kết thúc tại endYear, sau khi thanh năm cuối chạy đủ.

  // ===================================================================
  // 4. PHI PHÁP: ĐƯỜNG DÂY, LÊN CẤP, ÔNG TRÙM
  // ===================================================================
  function setJob(id, t, vn, yrs) { var c = E.CAR[id]; if (!c) return; c.t = t; c.vn = vn; c.yrs = yrs; }
  setJob('buon_lau', ['chân rết vận chuyển hàng lậu', 'đầu nậu đường dây buôn lậu', 'trùm đường dây buôn lậu'], [200, 650, 1800], [3, 5]);
  setJob('ma_tuy', ['bán lẻ ma túy', 'đầu nậu ma túy', 'trùm đường dây ma túy'], [30, 250, 1300], [3, 5]);
  setJob('doi_no', ['đòi nợ thuê', 'đàn em', 'đại ca'], [15, 40, 150], [3, 5]);
  setJob('lua_dao', ['lừa đảo qua mạng', 'quản lý nhóm lừa đảo', 'trùm lừa đảo'], [25, 120, 600], [3, 5]);
  // càng lên cao càng ít trực tiếp nhúng tay, có đàn em, có "ô dù" của băng nhóm — ít bị bắt hơn
  E.crimeRankK = function (l, c) { var n = c.t.length, rk = l.job.rank || 0; if (n <= 1) return 1; return rk >= n - 1 ? 0.25 : rk >= 1 ? 0.6 : 1; };
  var ru0 = E.rankUpText;
  E.rankUpText = function (l, c) {
    if (c.sec === 'crime') { var now = c.t[l.job.rank]; return { t: pick(H.rf ? H.rf(l) : Math.random, ['Được "anh lớn" tin tưởng, giao quản lý cả một mối hàng — giờ là ' + now + ', có đàn em, có người chống lưng.', 'Nắm được cả đường dây, chân rết khắp các tỉnh — giờ là ' + now + '. Tiền nhiều hơn, nhưng kẻ thù cũng nhiều hơn.']), m: 'Năm trở thành ' + now + '.' }; }
    return ru0 ? ru0.apply(this, arguments) : null;
  };
  var CRJ = ['buon_lau', 'ma_tuy', 'lua_dao', 'doi_no', 'cho_vay'];
  function crim(l) { return CRJ.indexOf(jid(l)) >= 0; }
  SC('dd_vao_duong_day', {
    title: 'Vào đường dây', valid: function (l) { return crim(l) && (l.job.rank || 0) === 0 && !l.flags.ddIn; },
    text: function (l) { return jid(l) === 'buon_lau' ? 'Một "anh lớn" ở cửa khẩu để ý bạn chạy hàng nhanh nhẹn, kín miệng, rủ vào hẳn đường dây: có xe, có kho, có người lo đầu ra.' : 'Một tay "anh lớn" muốn kéo bạn vào hẳn đường dây của hắn: có tổ chức, có người lo, chia phần đều.'; },
    opts: [
      { k: 'vao', l: 'Nhận lời, vào đường dây', ai: { bad: 1, amb: 1 }, run: function (l, r, log) { l.flags.ddIn = l.age; l.job.yrs += 1; log('Vào đường dây. Từ nay có tổ chức, có người chống lưng, tiền về đều — nhưng đã vào thì khó mà ra.', 'bad'); fx(l, { karma: -4 }); } },
      { k: 'le', l: 'Làm lẻ một mình cho chắc', ai: { w: 0.8 }, run: function (l, r, log) { log('Từ chối, vẫn làm lẻ một mình.', 'neutral'); l.flags.ddIn = -1; } },
      { k: 'bo', l: 'Sợ quá, bỏ hẳn', ai: { w: 0.5, smart: 1 }, run: function (l, r, log) { if (E.quitCrime) E.quitCrime(l, log, 'Nghe đến "đường dây" thì sợ, bỏ hẳn con đường này.'); } }
    ]
  });
  T('dd_vao_duong_day', function (l) { return crim(l) && (l.job.rank || 0) === 0 && !l.flags.ddIn && l.job.yrs >= 1; }, 0.4, 3, 1);
  SC('dd_mat_hang', {
    title: 'Lô hàng bị bắt', valid: function (l) { return crim(l); },
    prep: function (l, r) { return { x: Math.round((l.job.rank + 1) * (50 + r() * 150)) }; },
    text: function (l, d) { return 'Lực lượng chức năng chặn bắt một chuyến hàng của đường dây, thu giữ toàn bộ. Phần vốn của bạn trong chuyến ấy khoảng ' + mo(l, V(l, d.x)) + '. Tài xế đã bị bắt.'; },
    opts: [
      { k: 'im', l: 'Cắt đứt liên lạc, nằm im một thời gian', ai: { w: 1.2, smart: 1 }, run: function (l, r, log, d) { H.cash(l, -Math.min(V(l, d.x), Math.max(0, l.money)), 'Mất lô hàng'); stress(l, 15); log('Mất trắng lô hàng, thay số điện thoại, nằm im mấy tháng. Đêm nào cũng giật mình.', 'bad'); } },
      { k: 'lo', l: 'Bỏ tiền "lo" cho tài xế, giữ kín đường dây', ai: { bad: 1 }, run: function (l, r, log, d) { H.cash(l, -Math.min(V(l, d.x * 1.5), Math.max(0, l.money)), 'Mất lô hàng, lo cho đàn em'); if (ch(r, 0.35)) H.sched(l, 'bi_bat', 0, { why: 'buôn lậu', sev: 2 }); log('Bỏ tiền lo cho gia đình tài xế để hắn im lặng. Nhưng lời khai thì chẳng ai giữ được mãi.', 'bad'); } },
      { k: 'dau_thu', l: 'Ra đầu thú', ai: { w: 0.4, smart: 1 }, run: function (l, r, log) { H.jail(l, U.randint(r, 2, 4), 'buôn lậu (ra đầu thú, được giảm nhẹ)', log); if (E.quitCrime) E.quitCrime(l, log, 'Ra đầu thú, khai báo thành khẩn.'); } }
    ]
  });
  T('dd_mat_hang', function (l) { return crim(l) && /buon_lau|ma_tuy/.test(jid(l)); }, 0.15, 3, 3);
  SC('dd_tranh_dia_ban', {
    title: 'Tranh giành địa bàn', valid: function (l) { return crim(l) && (l.job.rank || 0) >= 1; },
    text: 'Một băng khác lấn sang địa bàn của bạn, cướp mối, đánh đàn em bạn nhập viện.',
    opts: [
      { k: 'danh', l: 'Cho đàn em "dằn mặt"', ai: { bad: 1.2, risk: 1 }, run: function (l, r, log) { fx(l, { karma: -8 }); if (ch(r, 0.3)) H.jail(l, U.randint(r, 3, 7), 'tổ chức gây rối, cố ý gây thương tích', log); else if (ch(r, 0.05)) H.kill(l, 'bị thanh toán trong một vụ tranh giành địa bàn', log); else log('Hai băng hỗn chiến. Giữ được địa bàn, nhưng đàn em nằm viện mấy đứa.', 'bad'); } },
      { k: 'chia', l: 'Ngồi lại chia địa bàn', ai: { w: 1, smart: 1 }, run: function (l, r, log) { log('Hai bên ngồi lại chia địa bàn. Yên được một thời gian — trong giới này, "hòa" chưa bao giờ lâu.', 'neutral'); } },
      { k: 'rut', l: 'Rút lui, rửa tay gác kiếm', ai: { w: 0.4 }, run: function (l, r, log) { if (E.quitCrime) E.quitCrime(l, log); } }
    ]
  });
  T('dd_tranh_dia_ban', function (l) { return crim(l) && (l.job.rank || 0) >= 1; }, 0.15, 4, 2);
  SC('dd_rua_tien', {
    title: 'Tiền bẩn', valid: function (l) { return crim(l) && (l.job.rank || 0) >= 1 && l.money > l.base * 3; },
    text: 'Tiền về nhiều, nhưng mua nhà, mua xe bằng tiền mặt thì dễ bị để ý. Có người gợi ý mở vài cửa hàng "bình phong".',
    opts: [
      { k: 'mo', l: 'Mở cửa hàng bình phong', ai: { bad: 1 }, run: function (l, r, log) { H.cash(l, -V(l, 300), 'Mở cửa hàng bình phong'); l.flags.front = true; log('Mở mấy cửa hàng làm bình phong. Nhìn bên ngoài, bạn là một ông chủ làm ăn đàng hoàng.', 'neutral'); fx(l, { karma: -4 }); } },
      { k: 'thoi', l: 'Cứ để tiền mặt, tiêu dè chừng', ai: { w: 1 }, run: function (l, r, log) { log('Giấu tiền mặt trong nhà, sống dè chừng.', 'neutral'); stress(l, 6); } }
    ]
  });
  T('dd_rua_tien', function (l) { return crim(l) && (l.job.rank || 0) >= 1 && l.money > l.base * 3; }, 0.12, 5, 1);

  // ===================================================================
  // 5. CHỦ ĐỘNG MỞ THÊM CHI NHÁNH / MỞ RỘNG QUY MÔ
  // ===================================================================
  function owner(l) { if (!l.job || E.isCrime(l)) return false; var c = E.CAR[jid(l)]; return !!c && /^(chủ|giám đốc công ty)/.test(c.t[l.job.rank || 0]) && (l.job.rank || 0) < c.t.length - 1; }
  function expandCost(l) { var c = E.CAR[jid(l)]; return Math.max(l.base * 2, E.monthlyEst(l, c.id, (l.job.rank || 0) + 1) * 18); }
  SC('mo_rong_tu', {
    title: 'Mở thêm chi nhánh / mở rộng quy mô',
    text: function (l) { var s = []; if (owner(l)) s.push(U.cap(E.jobTitle(l)) + ': mở rộng lên ' + E.CAR[jid(l)].t[(l.job.rank || 0) + 1] + ' cần khoảng ' + mo(l, expandCost(l))); (l.ventures || []).forEach(function (v) { s.push(U.cap(v.n) + ' (' + v.br + ' cơ sở): mở thêm một chi nhánh cần khoảng ' + mo(l, v.unit)); }); return (s.length ? s.join('. ') + '.' : 'Bạn chưa có cơ sở kinh doanh nào.') + ' Tiền mặt hiện có ' + mo(l, l.money) + '.'; },
    opts: [
      { k: 'job', l: function (l) { return owner(l) ? 'Mở rộng ' + E.jobTitle(l) : ''; }, h: function (l) { return owner(l) ? mo(l, expandCost(l)) + ' · thành công thì thu nhập tăng mạnh, thất bại thì mất một phần vốn' : ''; }, req: function (l) { return owner(l) && l.money >= expandCost(l); }, ai: { w: 1, amb: 1 }, run: function (l, r, log) { var x = expandCost(l), c = E.CAR[jid(l)]; H.cash(l, -x, 'Mở rộng kinh doanh'); if (ch(r, 0.65 + (l.st.kno - 50) / 300)) { l.job.rank++; l.job.yrs = 0; log('Bỏ ' + mo(l, x) + ' mở rộng quy mô, làm ăn thuận lợi — giờ là ' + E.jobTitle(l) + '.', 'big'); H.mem(l, 'Ngày khai trương cơ sở mới của ' + E.jobTitle(l) + '.', 4); } else { log('Mở rộng quá nhanh, cơ sở mới ế ẩm, phải đóng cửa sau một năm. Mất phần lớn số vốn bỏ ra.', 'bad'); H.cash(l, x * 0.3, 'Thanh lý cơ sở mới'); fx(l, { hap: -6 }); } } },
      { k: 'ven', l: function (l) { var v = (l.ventures || [])[0]; return v ? 'Mở thêm chi nhánh ' + v.n : ''; }, h: function (l) { var v = (l.ventures || [])[0]; return v ? mo(l, v.unit) : ''; }, req: function (l) { var v = (l.ventures || [])[0]; return !!v && v.br < 8 && l.money >= v.unit; }, ai: { w: 1 }, run: function (l, r, log) { var v = l.ventures[0]; H.cash(l, -v.unit, 'Mở chi nhánh ' + v.n); v.br++; v.cap += v.unit; log('Mở thêm một chi nhánh ' + v.n + ', giờ có ' + v.br + ' cơ sở.', 'good'); } },
      { k: 'no', l: 'Thôi, giữ quy mô hiện tại', ai: { w: 0.5 }, run: function () { } }
    ]
  });
  A('mo_rong', 'Công việc', 'Mở thêm chi nhánh / mở rộng quy mô', { min: 20, sc: 'mo_rong_tu', avail: function (l) { var v = (l.ventures || [])[0]; if (!owner(l) && !v) return 'Không áp dụng'; return (owner(l) && l.money >= expandCost(l)) || (v && v.br < 8 && l.money >= v.unit) ? true : 'Chưa đủ vốn để mở rộng'; } });
  // Mỗi cơ sở có lựa chọn riêng, không chỉ cơ sở đầu tiên trong danh sách.
  var expandOpts = E.DEC.mo_rong_tu.def.opts;
  expandOpts.splice(1, 1);
  (E.wealth.BIZ || []).forEach(function (b) {
    function venture(l) { return (l.ventures || []).filter(function (v) { return v.k === b.k; })[0]; }
    expandOpts.splice(expandOpts.length - 1, 0, {
      k: 'ven_' + b.k,
      l: function (l) { var v = venture(l); return v ? 'Mở thêm chi nhánh ' + v.n : ''; },
      h: function (l) { var v = venture(l); return v ? mo(l, v.unit) : ''; },
      req: function (l) { var v = venture(l); return !!v && v.br < 8 && l.money >= v.unit; },
      ai: { w: 1 },
      run: function (l, r, log) { var v = venture(l); if (!v || v.br >= 8 || l.money < v.unit) return; H.cash(l, -v.unit, 'Mở chi nhánh ' + v.n); v.br++; v.cap += v.unit; v.good = 0; log('Mở thêm một chi nhánh ' + v.n + ', giờ có ' + v.br + ' cơ sở.', 'good'); }
    });
  });
  E.ACT.filter(function (a) { return a.id === 'mo_rong'; })[0].avail = function (l) {
    var vs = l.ventures || [];
    if (!owner(l) && !vs.length) return 'Không áp dụng';
    return (owner(l) && l.money >= expandCost(l)) || vs.some(function (v) { return v.br < 8 && l.money >= v.unit; }) ? true : 'Chưa đủ vốn để mở rộng';
  };

  // ===================================================================
  // 6. NĂNG KHIẾU GAME: THỂ LOẠI, TỰ CHỌN GAME
  // ===================================================================
  if (E.GAMES) {
    E.GAMES.moba.pc = ['Liên Minh Huyền Thoại']; E.GAMES.moba.mobile = ['Liên Quân Mobile', 'Mobile Legends: Bang Bang', 'Liên Minh: Tốc Chiến'];
    E.GAMES.fps.pc = ['Valorant', 'Counter-Strike 2', 'Delta Force', 'Đột Kích (CrossFire)', 'Apex Legends', 'Overwatch 2']; E.GAMES.fps.mobile = ['Free Fire', 'Delta Force Mobile', 'Call of Duty Mobile'];
  }
  function gList(l) { var t = l.talentSub === 'FPS' ? 'fps' : 'moba', g = E.GAMES[t]; var L = g.pc.concat(g.mobile); if (!isVN(l)) L = L.filter(function (x) { return x !== 'Liên Quân Mobile'; }); return L; }
  E.gameList = gList;
  SC('chon_game', {
    title: 'Chọn game của mình', valid: function (l) { return l.talent === 'game' && !l.flags.gamePicked; },
    text: function (l) { return 'Bạn có năng khiếu ' + (l.talentSub === 'FPS' ? 'game bắn súng (FPS) — phản xạ nhanh, ngắm chuẩn' : 'game chiến thuật đồng đội (MOBA) — đọc trận tốt, phối hợp giỏi') + '. Bạn muốn theo game nào?'; },
    opts: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (i) { return { k: 'g' + i, l: function (l) { return gList(l)[i] || ''; }, req: function (l) { return !!gList(l)[i]; }, ai: { w: 1 }, run: function (l, r, log) { l.game = gList(l)[i]; l.flags.gamePicked = true; log('Chọn theo ' + l.game + ' — tối nào cũng luyện thêm vài trận.', 'good'); } }; })
  });
  T('chon_game', function (l, a) { return l.talent === 'game' && !l.flags.gamePicked && a >= 8; }, 1, 1, 1);
  E.MAJOR && (E.MAJOR.chon_game = 0);

  // ===================================================================
  // 7. CHỌN CONCERT: NHÓM → NGHỆ SĨ
  // ===================================================================
  var CC = E.CONCERT_CATS;
  function A_(n, b) { return { n: n, b: b }; }
  if (CC) {
    var cast24 = CC.show.shows.filter(function (s) { return s.k === 'atvncg24'; })[0];
    if (cast24 && cast24.m.indexOf('Phan Đinh Tùng') < 0) cast24.m.push('Phan Đinh Tùng');
    CC.kr.n = 'Kpop Hàn Quốc';
    CC.vn.a = [A_('Sơn Tùng M-TP', 1994), A_('Jack - J97', 1997), A_('Soobin Hoàng Sơn', 1992), A_('Mỹ Tâm', 1981), A_('Hà Anh Tuấn', 1984), A_('Đen Vâu', 1989), A_('Hồ Ngọc Hà', 1984), A_('Noo Phước Thịnh', 1988), A_('Hoàng Thùy Linh', 1988), A_('Đông Nhi', 1988), A_('Tóc Tiên', 1989), A_('Vũ.', 1995), A_('Hòa Minzy', 1995), A_('AMEE', 2000), A_('MONO', 2000), A_('Văn Mai Hương', 1994), A_('Phan Mạnh Quỳnh', 1990), A_('Đàm Vĩnh Hưng', 1971), A_('Lệ Quyên', 1981), A_('Hoàng Dũng', 1995)];
    CC.kr.a = [A_('BTS', 1995), A_('BLACKPINK', 1996), A_('TWICE', 1997), A_('SEVENTEEN', 1997), A_('Stray Kids', 2000), A_('NewJeans', 2005), A_('aespa', 2001), A_('IVE', 2004), A_('(G)I-DLE', 1998), A_('LE SSERAFIM', 2002), A_('ENHYPEN', 2003), A_('TOMORROW X TOGETHER', 2001), A_('ATEEZ', 1999), A_('ITZY', 2001), A_('NCT 127', 1997), A_('EXO', 1992), A_('BIGBANG', 1988), A_('Red Velvet', 1995), A_('BABYMONSTER', 2006), A_('RIIZE', 2002), A_('IU', 1993), A_('Hwasa', 1995), A_('PSY', 1977), A_('G-Dragon', 1988)];
    CC.us.n = 'Nghệ sĩ US/UK';
    CC.us.a = [A_('Taylor Swift', 1989), A_('Ed Sheeran', 1991), A_('Coldplay', 1977), A_('Adele', 1988), A_('Bruno Mars', 1985), A_('The Weeknd', 1990), A_('Billie Eilish', 2001), A_('Ariana Grande', 1993), A_('Dua Lipa', 1995), A_('Harry Styles', 1994), A_('Olivia Rodrigo', 2003), A_('Justin Bieber', 1994), A_('Lady Gaga', 1986), A_('Beyoncé', 1981), A_('Sabrina Carpenter', 1999), A_('Post Malone', 1995), A_('Imagine Dragons', 1987), A_('Maroon 5', 1979), A_('Charlie Puth', 1991), A_('Rihanna', 1988), A_('Katy Perry', 1984), A_('Sam Smith', 1992), A_('Lana Del Rey', 1985), A_('Arctic Monkeys', 1986), A_('Shawn Mendes', 1998), A_('Selena Gomez', 1992), A_('Lewis Capaldi', 1996), A_('Chappell Roan', 1998), A_('SZA', 1989), A_('Doja Cat', 1995), A_('Calvin Harris', 1984), A_('Oasis', 1970)];
    CC.rapvn.a = [A_('RPT MCK', 1999), A_('Dangrangto', 2000), A_('B Ray', 1994), A_('Wxrdie', 1999), A_('Binz', 1988), A_('Karik', 1989), A_('Rhymastic', 1990), A_('Suboi', 1990), A_('tlinh', 2000), A_('Low G', 1998), A_('Obito', 1998), A_('Andree Right Hand', 1989), A_('16 Typh', 2000), A_('Seachains', 1995), A_('Wowy', 1988), A_('Double2T', 1998), A_('Đen Vâu', 1989)];
  }
  // Danh mục solo Việt loại toàn bộ người tham gia các show, kể cả nghệ danh khác.
  if (CC) {
    var showNames = {};
    CC.show.shows.forEach(function (s) { s.m.forEach(function (n) { showNames[n.toLowerCase()] = true; }); });
    showNames['soobin hoàng sơn'] = true;
    CC.vn.a = CC.vn.a.filter(function (a) { return !showNames[a.n.toLowerCase()]; });
  }
  var PER = 8;
  SC('concert_nghe_si', {
    title: function (l, d) { return CC[d.cat].n; },
    prep: function (l, r, a) { var all = E.artistsOf(a.cat, l).filter(function (x) { return !x.show; }); var p = a.p || 0; return { cat: a.cat, p: p, cs: all.slice(p * PER, p * PER + PER).map(function (x) { return x.n; }), more: all.length > (p + 1) * PER, all: all.map(function (x) { return x.n; }) }; },
    text: function (l, d) { return 'Chọn nghệ sĩ bạn muốn đi xem concert' + (l.idol && d.all.indexOf(l.idol) >= 0 ? ' (thần tượng của bạn: ' + l.idol + ')' : '') + ':'; },
    opts: Array.apply(null, Array(PER)).map(function (_, i) {
      return { k: 'a' + i, l: function (l, d) { return d.cs[i] || ''; }, req: function (l, d) { return !!d.cs[i]; }, ai: function (l, d) { return d && d.cs[i] === l.idol ? 3 : 1; },
        run: function (l, r, log, d) { l.pending.unshift(E.DEC.concert_di.make(l, r, { cat: d.cat, name: d.cs[i] })); } };
    }).concat([
      { k: 'them', l: 'Xem thêm nghệ sĩ khác ›', req: function (l, d) { return d.more; }, ai: { w: 0 }, run: function (l, r, log, d) { l.pending.unshift(E.DEC.concert_nghe_si.make(l, r, { cat: d.cat, p: d.p + 1 })); } },
      { k: 'thoi', l: 'Thôi, để dịp khác', ai: { w: 0.2 }, run: function () { } }
    ])
  });
  if (E.DEC.concert_chon) E.DEC.concert_chon.def.opts.forEach(function (o) {
    if (o.k === 'no') return;
    if (o.k === 'show') { o.h = function (l) { return E.artistsOf('show', l).map(function (a) { return a.n; }).join(', '); }; return; }
    o.h = ''; o.run = function (l, r) { l.pending.unshift(E.DEC.concert_nghe_si.make(l, r, { cat: o.k })); };
  });

  // ===================================================================
  // 8. LỜI KỂ VỀ GIA ĐÌNH ĐÚNG HOÀN CẢNH
  // ===================================================================
  function kidsAlive(l) { return (l.kids || []).some(function (k) { return k.alive; }); }
  function sibsAlive(l) { return H.sibs ? H.sibs(l).length > 0 : (l.fam && l.fam.sibs > 0); }
  function nobody(l) { return !kidsAlive(l) && !sibsAlive(l) && !(l.fam && (l.fam.mAlive || l.fam.fAlive)) && !(l.partner && l.partner.alive && l.partner.status !== 'dating'); }
  E.hasFamily = function (l) { return !nobody(l); };
  E.famLogic = function (l, t, isLog) {
    if (typeof t !== 'string' || !l || !l.fam || l.age < 1) return t;
    if (!/con cháu|đàn cháu|các con|các cháu|anh chị em|cả nhà|cả gia đình|sum vầy|Đám cưới|Về quê ăn Tết|Tết năm nay/i.test(t)) return t;
    if (!kidsAlive(l) && /[Cc]on cháu|đàn cháu|các con\b|các cháu/.test(t) && !/(cụ già|người ta|nhà người|của cụ|bà cụ|ông cụ)/.test(t)) {
      t = t.replace(/Con cháu tổ chức lễ mừng thọ (\d+) tuổi\./, function (x, n) { return (l.partner && l.partner.alive !== false && l.partner.status !== 'dating' ? (l.partner.sex === l.sex ? 'Bạn và người bạn đời làm mâm cơm, mời hàng xóm, bạn bè đến mừng thọ ' : 'Hai vợ chồng làm mâm cơm, mời hàng xóm, bạn bè đến mừng thọ ') : 'Hàng xóm, bạn bè đến chúc thọ ') + n + ' tuổi.'; })
        .replace('giờ chỉ vui với con cháu', 'giờ chỉ vui với vườn tược, bạn bè').replace('Ở lại gần con cháu', 'Ở lại thành phố').replace('Ở lại thành phố gần con cháu.', 'Ở lại thành phố.').replace('qua con cháu giới thiệu', 'qua bạn bè giới thiệu')
        .replace(/lì xì (cho )?con cháu/g, 'lì xì cho lũ trẻ trong xóm');
      if (/[Cc]on cháu|đàn cháu|các con\b|các cháu/.test(t)) { if (isLog && /chu cấp|ở với con cháu|về ở với|sum vầy|quây quần/.test(t)) return null; t = t.replace(/con cháu/g, 'bà con lối xóm'); }
    }
    if (!sibsAlive(l) && /(^|[^\p{L}])[Aa]nh chị em(?! họ)/u.test(t)) { if (isLog) return null; }
    if (inJail(l) && /^Đám cưới của/.test(t)) t = t.replace('Cả nhà tất bật mấy ngày liền.', 'Bạn đang ở trong trại, chỉ biết gửi lời chúc qua thư.');
    if (nobody(l)) {
      t = t.replace('Tiết Thanh minh, cả nhà đi tảo mộ ông bà.', 'Tiết Thanh minh, một mình đi tảo mộ ông bà, bố mẹ.').replace('Tết năm nay cả nhà sum họp đông đủ.', 'Tết năm nay đón một mình, thắp nén hương cho bố mẹ rồi sang chúc Tết hàng xóm.').replace('Về quê ăn Tết, gói bánh chưng cùng gia đình.', 'Về quê ăn Tết, thắp hương tưởng nhớ ông bà, bố mẹ rồi ghé chúc Tết hàng xóm.');
      if (isLog && /[Cc]ả nhà (sum họp|quây quần|sum vầy|đoàn tụ)|sum vầy/.test(t)) return null;
      // v5.6.4: không còn ai trong gia đình thì "cả nhà lên chùa", "cả nhà ăn chay"… thành chuyện của riêng bạn
      if (isLog) t = t.replace('ngày Rằm cả nhà ăn chay', 'ngày Rằm bạn ăn chay').replace('về ăn bữa cơm sum họp', 'ở lại dùng bữa với bà con trong giáo xứ').replace(/^(Cả nhà|Cả gia đình) /, 'Bạn ').replace(/([,:;—] )(cả nhà|cả gia đình) /g, '$1bạn ');
    }
    return t;
  };
  // "Chia với anh chị em" chỉ khi còn anh chị em
  ['bo_me_can', 'care', 'bo_me_om'].forEach(function (id) { var D = E.DEC[id]; if (!D || !D.def) return; D.def.opts.forEach(function (o) { if (o.k === 'share') o.req = function (l) { return sibsAlive(l); }; }); });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
