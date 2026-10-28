/* Một Đời — v6.1.0: thưởng Tết / thưởng cuối năm theo ngành nghề
   · người làm công ăn lương: thưởng tính bằng số tháng lương, tùy ngành (ngân hàng, dầu khí, công nghệ, sản xuất, dịch vụ, khu vực nhà nước…)
   · nhân theo kết quả kinh doanh năm đó (năm khó khăn chỉ có quà Tết), uy tín và cấp bậc của bạn
   · mới vào làm trong năm thì thưởng ít; chủ cơ sở, người làm tự do, nghề phi pháp không có thưởng
   · ở nước ngoài: Nhật / Hàn thưởng hai kỳ, Philippines lương tháng 13 bắt buộc, Đức lương tháng 13, Singapore AWS… */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, isVN = H.isVN;
  function mo(l, v) { return H.money(l, v); }
  // [từ, đến] số tháng lương thưởng cho năm bình thường
  var IND = [
    [/^(ngan_hang|ngan_hang_cao)$/, [3, 6], 'ngân hàng'],
    [/^(gian_khoan|dnnn)$/, [2.5, 5], 'doanh nghiệp năng lượng / nhà nước lớn'],
    [/^(dev|data|ky_su|ky_su_co_dien)$/, [1.5, 3.5], 'công nghệ'],
    [/^(sale_bds|sale_oto|sale_bh|sale_b2b|sale_mp|telesale)$/, [1, 4], 'kinh doanh (theo doanh số)'],
    [/^(ke_toan|kiem_toan|van_phong|nhan_su|marketing|logistics|luat_su|kien_truc|thiet_ke|ky_su_xd)$/, [1, 2.5], 'văn phòng'],
    [/^(cong_nhan|tho_may|tho_han|tho_dien|ky_thuat_vien|tho_moc|tho_mo|tai_xe_tai|thuyen_vien)$/, [1, 1.8], 'sản xuất'],
    [/^(phi_cong|tiep_vien|kskl)$/, [2, 4], 'hàng không'],
    [/^(bac_si|dieu_duong|duoc_si|nha_si|thu_y)$/, [0.8, 2], 'y tế'],
    [/^(cong_chuc|vien_chuc|can_bo_xa|hanh_chinh_cong|chinh_tri|dang_uy|ngan_hang_nn|trung_uong|thanh_tra|kiem_toan|thue|hai_quan|tham_phan|kiem_sat|ngoai_giao|qltt|kiem_lam|cong_an|quan_doi|giao_vien|giang_vien|gv_mam_non|nghien_cuu|dieu_tra_vien|chap_hanh_vien|tro_giup_phap_ly)$/, [0.4, 0.8], 'khu vực nhà nước'],
    [/^(phuc_vu|barista|bartender|le_tan|thu_ngan|dau_bep|bao_ve|giup_viec|hdv|tho_toc|barber|nail|spa|makeup)$/, [0.5, 1.2], 'dịch vụ'],
    [/^(phong_vien|mc_tv|bien_kich|dao_dien)$/, [1, 2], 'truyền thông']
  ];
  var WORLD = { JP: [2.5, 5, 'thưởng hai kỳ mùa hè và cuối năm'], KR: [1.5, 4, 'thưởng cuối năm'], CN: [1, 3, 'thưởng cuối năm (年终奖)'], TW: [1.5, 3, 'thưởng cuối năm'], SG: [1, 3, 'AWS lương tháng 13 và thưởng hiệu suất'], PH: [1, 1.5, 'lương tháng 13 bắt buộc'], DE: [0.8, 1.2, 'lương tháng 13 (Weihnachtsgeld)'], AT: [1.8, 2.2, 'lương tháng 13 và 14'], US: [0.2, 1, 'thưởng cuối năm'], GB: [0.2, 0.8, 'thưởng cuối năm'] };
  function indOf(id) { for (var i = 0; i < IND.length; i++) if (IND[i][0].test(id)) return IND[i]; return [null, [0.8, 1.5], 'doanh nghiệp']; }
  function eligible(l) {
    if (!l.alive || !l.job || l.retired || !l.indep || (l.jailUntil != null && l.age < l.jailUntil) || (l.abroad && l.abroad.trapped)) return false;
    if (E.isCrime && E.isCrime(l)) return false;
    if (!H.isEmployee(l) || (E.isFreelanceJob && E.isFreelanceJob(l)) || l.job.fam) return false;
    var c = E.jobDef(l); if (!c || c.fame || c.cat === 'biz' || c.owner) return false;
    return (l.income || 0) > 0;
  }
  E.tetBonusEligible = eligible;
  E.tetBonus = function (l, r) {
    var id = E.resolveJob(l.job.id), here = (l.abroad && l.abroad.perm && l.abroad.code) || l.country, vn = here === 'VN';
    var rng = vn ? indOf(id) : WORLD[here] ? [null, [WORLD[here][0], WORLD[here][1]], WORLD[here][2]] : [null, [0.5, 1.2], 'thưởng cuối năm'];
    var lo = rng[1][0], hi = rng[1][1], months = lo + r() * (hi - lo), x = r(), mood;
    if (x < 0.15) { months *= 0.15 + r() * 0.25; mood = 'bad'; } else if (x > 0.82) { months *= 1.3 + r() * 0.4; mood = 'good'; } else mood = 'normal';
    var rep = l.job.rep == null ? 50 : l.job.rep; months *= (0.8 + rep / 250) * (1 + (l.job.rank || 0) * 0.08);
    var newbie = l.job.since != null && l.age - l.job.since < 1; if (newbie) months *= 0.25;
    var monthly = (l.income || 0) / 12;
    return { months: Math.max(0, months), amount: Math.max(0, months * monthly), mood: mood, ind: rng[2], vn: vn, newbie: newbie, pub: vn && /nhà nước/.test(rng[2]) };
  };
  E.HOOKS.year.unshift(function (l, r, log, a) {
    if (!eligible(l) || l.flags.tetAt === a) return;
    l.flags.tetAt = a;
    var b = E.tetBonus(l, r), m = Math.round(b.months * 10) / 10, mStr = (m >= 1 ? m.toLocaleString('vi-VN') : m.toLocaleString('vi-VN')) + ' tháng lương';
    if (b.amount < l.base * 0.005) { log(b.vn ? 'Tết năm nay ' + (b.newbie ? 'mới vào làm nên' : 'công ty khó khăn,') + ' chỉ được nhận giỏ quà Tết và bao lì xì đầu năm.' : 'Cuối năm chỉ nhận được một phần quà nhỏ từ công ty.', 'neutral'); return; }
    H.cash(l, b.amount, b.vn ? 'Thưởng Tết' : 'Thưởng cuối năm');
    var t;
    if (b.vn) {
      if (b.pub) t = 'Cuối năm ở cơ quan nhà nước không có thưởng Tết như doanh nghiệp, chỉ có tiền thưởng theo quy định và quà Tết: khoảng ' + mStr + ' (' + mo(l, b.amount) + ').';
      else if (b.newbie) t = 'Mới vào làm chưa đủ năm, Tết này được thưởng ' + mStr + ' (' + mo(l, b.amount) + '), vẫn vui vì có tiền về quê.';
      else if (b.mood === 'good') t = U.pick(r, ['Năm nay ' + b.ind + ' làm ăn khấm khá, thưởng Tết ' + mStr + ' (' + mo(l, b.amount) + '). Cả phòng reo lên khi nhận thông báo.', 'Công ty vượt kế hoạch, thưởng Tết hẳn ' + mStr + ' (' + mo(l, b.amount) + ') kèm giỏ quà to.']);
      else if (b.mood === 'bad') t = U.pick(r, ['Năm nay công ty khó khăn, thưởng Tết chỉ ' + mStr + ' (' + mo(l, b.amount) + ') kèm hộp bánh.', 'Kinh tế ảm đạm, thưởng Tết teo tóp còn ' + mo(l, b.amount) + ', ai cũng thở dài.']);
      else t = U.pick(r, ['Thưởng Tết ' + mStr + ' (' + mo(l, b.amount) + '), vừa đủ sắm Tết và biếu bố mẹ.', 'Nhận lương tháng 13 và thưởng Tết, tổng cộng ' + mStr + ' (' + mo(l, b.amount) + ').', 'Thưởng Tết năm nay ' + mo(l, b.amount) + ' (' + mStr + '), như mọi năm.']);
    } else t = 'Cuối năm nhận ' + b.ind + ': ' + mStr + ' (' + mo(l, b.amount) + ')' + (b.mood === 'good' ? ', công ty có một năm làm ăn tốt.' : b.mood === 'bad' ? ', năm khó khăn nên ít hơn mọi năm.' : '.');
    log(t, b.mood === 'bad' ? 'neutral' : 'good'); H.fx(l, { hap: b.mood === 'good' ? 4 : b.mood === 'bad' ? -1 : 2 });
  });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
