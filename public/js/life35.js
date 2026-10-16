/* Một Đời — v3.5:
   · con đường năng khiếu → trường chuyên ngành → nghề: có năng khiếu thì được gợi ý trường và nghề phù hợp (VD năng khiếu ca hát:
     Học viện Âm nhạc Quốc gia Việt Nam, Nhạc viện TP. HCM, ĐH Sư phạm Nghệ thuật Trung ương, ĐH Văn hóa Nghệ thuật Quân đội, CĐ Nghệ thuật Hà Nội);
     theo năng khiếu hay chọn hướng khác đều được, nhưng luôn có đề xuất. Thi năng khiếu đỗ hay trượt tùy trình độ và sự chuẩn bị.
   · sự kiện theo bối cảnh từng ngành: ca hát (mua bài hát, tự sáng tác, thi truyền hình, clip lan truyền, bản quyền, giữ giọng), mỹ thuật,
     sân khấu – điện ảnh, thể thao, ngoại ngữ, kỹ thuật, và các nghề trước đây ít sự kiện.
   Mọi nhân vật, tình huống đều hư cấu, không ám chỉ cá nhân hay tổ chức nào. */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function fx(l, o) { H.fx(l, o); }
  function mo(l, v) { return H.money(l, v); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function vnd(l) { return isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  function V(l, tr) { return vnd(l) ? tr : tr / 90 * l.base; }
  function pay(l, tr, why) { var x = Math.min(V(l, tr), Math.max(0, l.money) + l.base * 0.5); H.cash(l, -x, why); return x; }
  function earn(l, tr, why) { var x = V(l, tr); H.cash(l, x, why); return x; }
  function jid(l) { return l.job ? E.resolveJob(l.job.id) : ''; }
  function rk(l) { return l.job ? l.job.rank || 0 : 0; }
  function rep(l, d) { if (l.job) l.job.rep = U.clamp((l.job.rep || 50) + d, 0, 100); }
  function stress(l, d) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + d, 0, 100); }
  function promote(l) { var c = l.job ? E.jobDef(l) : null; if (c && l.job.rank < c.t.length - 1) { l.job.rank++; l.job.yrs = 0; return true; } return false; }
  function sk(l) { return l.skill || 20; }
  function cap(s) { return U.cap(s); }

  // ===================================================================
  // 1. NGHỀ MỚI
  // ===================================================================
  function addJob(id, t, vn, yrs, o) {
    E.CAR[id] = { id: id, t: t, vn: vn, yrs: yrs, cat: o.cat || 'other', sec: o.sec || 'inf', edu: o.edu || 0, major: o.major, majors: o.majors, soft: o.soft,
      talent: o.talent, sex: o.sex, haz: o.haz, crime: o.crime, fame: o.fame, sigma: o.sigma || 0.12, fail: o.fail || 0, hidden: o.hidden, w: o.w || 1,
      rural: o.rural, coast: o.coast, vnOnly: o.vn, ladder: o.ladder, skillRank: o.skillRank, maxAge: o.maxAge, prod: o.prod, promo: o.promo, loss: o.loss, tag: o.tag };
  }
  addJob('hoa_si', ['họa sĩ tự do (vẽ tranh theo đơn)', 'họa sĩ có tranh triển lãm', 'họa sĩ có tên tuổi'], [7, 18, 60], [4, 8], { cat: 'free', sec: 'inf', edu: 0, talent: 'hội họa', sigma: 0.5, w: 0.6 });
  addJob('van_cong', ['diễn viên đoàn văn công quân đội', 'diễn viên chính đoàn văn công', 'trưởng đoàn văn công'], [9, 14, 22], [5, 10], { cat: 'uniform', sec: 'formal', edu: 4, hidden: 1, vn: 1 });

  // ===================================================================
  // 2. NĂNG KHIẾU → TRƯỜNG CHUYÊN NGÀNH → NGHỀ
  // ===================================================================
  // trường: [mã, tên, thành phố, ngành (khóa MAJORS), tên ngành, độ khó 0–1, 'uni' | 'cd', các nghề sau khi ra trường, nội dung thi năng khiếu]
  var HN = 'Hà Nội', SG = 'TP. Hồ Chí Minh';
  var TS = {
    'âm nhạc': { sug: 'ca sĩ, nhạc sĩ – producer, giáo viên âm nhạc, diễn viên đoàn văn công', sch: [
      ['hvan', 'Học viện Âm nhạc Quốc gia Việt Nam', HN, 'art', 'Thanh nhạc', 0.62, 'uni', ['ca_si', 'nhac_si', 'giang_vien'], 'thi thanh nhạc, xướng âm – thẩm âm và kiến thức âm nhạc'],
      ['nvhcm', 'Nhạc viện TP. Hồ Chí Minh', SG, 'art', 'Thanh nhạc', 0.58, 'uni', ['ca_si', 'nhac_si'], 'thi thanh nhạc, xướng âm – thẩm âm và kiến thức âm nhạc'],
      ['spnt', 'Trường Đại học Sư phạm Nghệ thuật Trung ương', HN, 'edu', 'Sư phạm Âm nhạc', 0.4, 'uni', ['giao_vien', 'ca_si', 'nhac_si'], 'thi hát, thẩm âm – tiết tấu'],
      ['vhntqd', 'Trường Đại học Văn hóa Nghệ thuật Quân đội', HN, 'art', 'Thanh nhạc', 0.5, 'uni', ['van_cong', 'ca_si'], 'thi năng khiếu và khám sức khỏe theo tiêu chuẩn quân đội'],
      ['cdnt', 'Trường Cao đẳng Nghệ thuật Hà Nội', HN, null, 'Thanh nhạc', 0.3, 'cd', ['ca_si', 'nhac_si', 'dj'], 'thi hát và thẩm âm']] },
    'hội họa': { sug: 'họa sĩ, thiết kế đồ họa, kiến trúc sư, nhà thiết kế thời trang, giáo viên mỹ thuật', sch: [
      ['mtvn', 'Trường Đại học Mỹ thuật Việt Nam', HN, 'art', 'Hội họa', 0.55, 'uni', ['hoa_si', 'thiet_ke'], 'thi vẽ hình họa (tượng) và bố cục màu'],
      ['mthcm', 'Trường Đại học Mỹ thuật TP. Hồ Chí Minh', SG, 'art', 'Hội họa', 0.52, 'uni', ['hoa_si', 'thiet_ke'], 'thi vẽ hình họa và bố cục màu'],
      ['mtcn', 'Trường Đại học Mỹ thuật Công nghiệp', HN, 'art', 'Thiết kế đồ họa', 0.5, 'uni', ['thiet_ke', 'tk_thoi_trang', 'fl_thiet_ke'], 'thi hình họa và trang trí màu'],
      ['kthn', 'Trường Đại học Kiến trúc Hà Nội', HN, 'art', 'Kiến trúc', 0.56, 'uni', ['kien_truc', 'thiet_ke'], 'thi toán, vật lý và vẽ mỹ thuật (khối V)'],
      ['spnt_mt', 'Trường Đại học Sư phạm Nghệ thuật Trung ương', HN, 'edu', 'Sư phạm Mỹ thuật', 0.38, 'uni', ['giao_vien', 'hoa_si'], 'thi vẽ hình họa và trang trí']] },
    'diễn xuất': { sug: 'diễn viên điện ảnh – truyền hình, đạo diễn, biên kịch, MC, diễn viên đoàn văn công', sch: [
      ['skda', 'Trường Đại học Sân khấu – Điện ảnh Hà Nội', HN, 'art', 'Diễn viên kịch – điện ảnh', 0.6, 'uni', ['dien_vien', 'mc_tv', 'dao_dien'], 'thi diễn tiểu phẩm, hát, múa, đọc thơ và kiểm tra hình thể'],
      ['skdahcm', 'Trường Đại học Sân khấu – Điện ảnh TP. Hồ Chí Minh', SG, 'art', 'Diễn viên kịch – điện ảnh', 0.56, 'uni', ['dien_vien', 'mc_tv'], 'thi diễn tiểu phẩm, hát, múa và kiểm tra hình thể'],
      ['skda_dd', 'Trường Đại học Sân khấu – Điện ảnh Hà Nội', HN, 'art', 'Đạo diễn – Biên kịch', 0.58, 'uni', ['dao_dien', 'bien_kich'], 'thi viết kịch bản ngắn và phỏng vấn chuyên môn'],
      ['vhntqd_dv', 'Trường Đại học Văn hóa Nghệ thuật Quân đội', HN, 'art', 'Diễn viên sân khấu', 0.48, 'uni', ['van_cong', 'dien_vien'], 'thi diễn xuất và khám sức khỏe theo tiêu chuẩn quân đội']] },
    'thể thao': { sug: 'vận động viên, huấn luyện viên, giáo viên thể dục, huấn luyện viên cá nhân (PT)', sch: [
      ['tdttbn', 'Trường Đại học Thể dục Thể thao Bắc Ninh', 'Bắc Ninh', 'edu', 'Huấn luyện thể thao', 0.4, 'uni', ['hlv_tt', 'giao_vien', 'pt_gym'], 'thi năng khiếu thể thao: bật xa, chạy, môn sở trường'],
      ['tdtthcm', 'Trường Đại học Thể dục Thể thao TP. Hồ Chí Minh', SG, 'edu', 'Huấn luyện thể thao', 0.4, 'uni', ['hlv_tt', 'giao_vien', 'pt_gym'], 'thi năng khiếu thể thao: bật xa, chạy, môn sở trường'],
      ['sptdtt', 'Trường Đại học Sư phạm Thể dục Thể thao Hà Nội', HN, 'edu', 'Giáo dục thể chất', 0.32, 'uni', ['giao_vien', 'pt_gym', 'hlv_tt'], 'thi năng khiếu thể thao']] },
    'ngoại ngữ': { sug: 'biên – phiên dịch, ngoại giao, hướng dẫn viên du lịch, tiếp viên hàng không, giáo viên ngoại ngữ', sch: [
      ['ulis', 'Trường Đại học Ngoại ngữ – ĐHQG Hà Nội', HN, 'edu', 'Ngôn ngữ Anh', 0.55, 'uni', ['fl_dich', 'giao_vien', 'hdv', 'tiep_vien'], 'xét tổ hợp có môn tiếng Anh nhân hệ số 2'],
      ['hanu', 'Trường Đại học Hà Nội', HN, 'eco', 'Ngôn ngữ & Kinh doanh quốc tế', 0.55, 'uni', ['fl_dich', 'marketing', 'logistics', 'tiep_vien'], 'xét tổ hợp có môn ngoại ngữ nhân hệ số 2'],
      ['hvng', 'Học viện Ngoại giao', HN, 'law', 'Quan hệ quốc tế', 0.68, 'uni', ['ngoai_giao', 'fl_dich', 'phong_vien'], 'xét điểm thi kết hợp chứng chỉ ngoại ngữ quốc tế'],
      ['xhnvhcm', 'Trường Đại học Khoa học Xã hội và Nhân văn TP. HCM', SG, 'edu', 'Ngôn ngữ Anh', 0.5, 'uni', ['fl_dich', 'giao_vien', 'hdv'], 'xét tổ hợp có môn tiếng Anh']] },
    'toán học': { sug: 'lập trình viên, phân tích dữ liệu, kỹ sư, nhà nghiên cứu, giáo viên toán', sch: [
      ['bk', 'Đại học Bách khoa Hà Nội', HN, 'it', 'Khoa học máy tính', 0.66, 'uni', ['dev', 'data', 'ky_su'], 'xét điểm thi toán – lý – hóa hoặc bài thi đánh giá tư duy'],
      ['khtn', 'Trường Đại học Khoa học Tự nhiên – ĐHQG TP. HCM', SG, 'it', 'Toán – Tin học', 0.56, 'uni', ['dev', 'data', 'nghien_cuu'], 'xét điểm thi khối A'],
      ['uet', 'Trường Đại học Công nghệ – ĐHQG Hà Nội', HN, 'it', 'Công nghệ thông tin', 0.62, 'uni', ['dev', 'data', 'ky_su'], 'xét điểm thi khối A, A1'],
      ['sphn', 'Trường Đại học Sư phạm Hà Nội', HN, 'edu', 'Sư phạm Toán', 0.48, 'uni', ['giao_vien', 'gia_su'], 'xét điểm thi khối A']] },
    'ăn nói': { sug: 'phóng viên – biên tập viên, MC, luật sư, truyền thông – marketing', sch: [
      ['ajc', 'Học viện Báo chí và Tuyên truyền', HN, 'law', 'Báo chí', 0.55, 'uni', ['phong_vien', 'mc_tv', 'marketing'], 'xét điểm thi khối C, D'],
      ['xhnv', 'Trường Đại học Khoa học Xã hội và Nhân văn – ĐHQG Hà Nội', HN, 'law', 'Báo chí – Truyền thông', 0.56, 'uni', ['phong_vien', 'mc_tv', 'fl_content'], 'xét điểm thi khối C, D'],
      ['luathn', 'Trường Đại học Luật Hà Nội', HN, 'law', 'Luật', 0.58, 'uni', ['luat_su', 'cong_chung', 'tham_phan'], 'xét điểm thi khối A, C, D'],
      ['luathcm', 'Trường Đại học Luật TP. Hồ Chí Minh', SG, 'law', 'Luật', 0.56, 'uni', ['luat_su', 'cong_chung', 'kiem_sat'], 'xét điểm thi khối A, C, D']] },
    'khéo tay': { sug: 'kỹ sư cơ điện, kỹ thuật viên, thợ điện – cơ khí lành nghề', sch: [
      ['bk_ck', 'Đại học Bách khoa Hà Nội', HN, 'it', 'Kỹ thuật cơ điện tử', 0.6, 'uni', ['ky_su_co_dien', 'ky_su', 'ky_thuat_vien'], 'xét điểm thi toán – lý – hóa'],
      ['spkt', 'Trường Đại học Sư phạm Kỹ thuật TP. Hồ Chí Minh', SG, 'it', 'Công nghệ kỹ thuật cơ khí', 0.45, 'uni', ['ky_su_co_dien', 'ky_thuat_vien'], 'xét điểm thi khối A'],
      ['cdn', 'Trường cao đẳng nghề (điện – cơ khí)', null, null, 'Điện công nghiệp', 0.12, 'cd', ['tho_dien', 'ky_thuat_vien', 'tho_han'], 'xét học bạ']] },
    'kinh doanh': { sug: 'marketing, kinh doanh – bán hàng, ngân hàng, xuất nhập khẩu, tự khởi nghiệp', sch: [
      ['neu', 'Trường Đại học Kinh tế Quốc dân', HN, 'eco', 'Quản trị kinh doanh', 0.6, 'uni', ['marketing', 'sale_b2b', 'ngan_hang'], 'xét điểm thi khối A, A1, D'],
      ['ftu', 'Trường Đại học Ngoại thương', HN, 'eco', 'Kinh tế đối ngoại', 0.68, 'uni', ['logistics', 'marketing', 'ngan_hang'], 'xét điểm thi khối A, A1, D'],
      ['ueh', 'Trường Đại học Kinh tế TP. Hồ Chí Minh', SG, 'eco', 'Kinh doanh quốc tế', 0.6, 'uni', ['marketing', 'logistics', 'sale_b2b'], 'xét điểm thi khối A, A1, D']] },
    'làm đẹp': { sug: 'chuyên viên trang điểm, thiết kế thời trang, stylist, kỹ thuật viên spa, mở tiệm làm đẹp', sch: [
      ['mtcn_tt', 'Trường Đại học Mỹ thuật Công nghiệp', HN, 'art', 'Thiết kế thời trang', 0.5, 'uni', ['tk_thoi_trang', 'stylist', 'makeup'], 'thi hình họa và trang trí màu'],
      ['cd_sd', 'Trường cao đẳng nghề — ngành chăm sóc sắc đẹp', null, null, 'Chăm sóc sắc đẹp', 0.12, 'cd', ['makeup', 'spa', 'nail', 'tho_toc'], 'xét học bạ']] },
    'game': { sug: 'tuyển thủ esports, streamer, lập trình – thiết kế game, cày thuê rank', sch: [
      ['fpt', 'Trường Đại học FPT', HN, 'it', 'Thiết kế mỹ thuật số (game)', 0.38, 'uni', ['dev', 'thiet_ke', 'streamer'], 'xét học bạ và phỏng vấn']] },
    'cờ': { sug: 'kỳ thủ chuyên nghiệp, huấn luyện viên cờ, giáo viên toán', sch: [] }
  };
  E.TALENT_SCHOOLS = TS;
  function tsOf(l) { return isVN(l) ? TS[l.talent] || null : null; }
  function north(l) { var o = (l.prov && l.prov.old) || ''; return l.region === 'MNPB' || l.region === 'DBSH' || /Thanh Hóa|Nghệ An|Hà Tĩnh/.test(o); }
  function homeCity(l) { var o = (l.prov && l.prov.old) || ''; return /Hà Nội/.test(o) ? HN : /Hồ Chí Minh/.test(o) ? SG : /Bắc Ninh/.test(o) ? 'Bắc Ninh' : ''; }
  function admitP(l, s) {
    var p = 0.3 + (sk(l) - 100 * s[5]) / 35 + (l.st.kno - 55) / 160 + (l.flags.tPrep || 0) * 0.14 + (l.examScore != null ? (l.examScore - 21) / 45 : 0);
    if (/vhntqd/.test(s[0]) && l.st.hea < 55) p -= 0.3;
    return U.clamp(p, 0.04, 0.95);
  }
  // gợi ý 3 trường hợp nhất: gần nhà trước, vừa sức trước
  function schoolsFor(l) {
    var T = tsOf(l); if (!T) return [];
    var nth = north(l);
    return T.sch.slice().sort(function (a, b) { var f = function (s) { return (s[2] == null ? 0 : (s[2] === SG) === !nth ? 0 : 0.25) + Math.abs(s[5] * 100 - sk(l)) / 200; }; return f(a) - f(b); }).slice(0, 3);
  }
  E.talentSchoolsFor = schoolsFor;
  function jobNames(ids) { return ids.slice(0, 3).map(function (id) { return E.CAR[id] ? E.jobLabel(id).replace(/ \(.*\)$/, '') : id; }).join(', '); }
  function pctTxt(p) { return p >= 0.75 ? 'khả năng đỗ cao' : p >= 0.45 ? 'khả năng đỗ trung bình' : p >= 0.2 ? 'khó đỗ' : 'rất khó đỗ'; }

  // 2a. định hướng ở tuổi 15–17: gợi ý trường, nghề theo năng khiếu; theo hay không là quyền của bạn
  SC('nk_dinh_huong', {
    title: 'Định hướng nghề nghiệp',
    valid: function (l) { return !!tsOf(l) && !l.flags.tDinhHuong; },
    text: function (l) {
      var T = tsOf(l), S = schoolsFor(l);
      return 'Lên cấp ba, thầy cô chủ nhiệm và bố mẹ bàn chuyện chọn hướng đi. Với năng khiếu ' + E.talentText(l) + ' (trình độ: ' + (E.talentLevel ? E.talentLevel(l).name : 'khá') + '), bạn có thể theo: ' + T.sug + '.' +
        (S.length ? ' Các trường gợi ý: ' + S.map(function (s) { return s[1] + ' (ngành ' + s[4] + ')'; }).join('; ') + '.' : ' Ngành này không cần trường chuyên — chủ yếu là luyện tập và thi đấu.') + ' Bạn cũng có thể chọn một hướng khác.';
    },
    opts: [
      { k: 'luyen', l: function (l) { return tsOf(l).sch.length ? 'Theo năng khiếu: đi luyện thi năng khiếu từ bây giờ' : 'Theo năng khiếu: luyện tập, thi đấu nghiêm túc'; }, h: function (l) { return 'Khoảng ' + mo(l, V(l, 15)) + ' tiền học thêm mỗi năm · ít thời gian cho các môn văn hóa'; }, ai: { w: 1.2, amb: 0.8 },
        run: function (l, r, log) { l.flags.tDinhHuong = 'luyen'; l.flags.tPrep = 1; l.skill = Math.min(100, sk(l) + 6); if (l.indep) pay(l, 15, 'Luyện thi năng khiếu'); else log('Bố mẹ đóng tiền cho bạn học thêm năng khiếu.', 'neutral'); log('Quyết định theo năng khiếu ' + E.talentText(l) + ': tối nào cũng luyện tập, cuối tuần đi học thầy.', 'good'); fx(l, { hap: 2, kno: -1 }); } },
      { k: 'ca_hai', l: 'Học văn hóa là chính, vẫn giữ năng khiếu để mở cả hai đường', ai: { w: 1, smart: 0.6 },
        run: function (l, r, log) { l.flags.tDinhHuong = 'ca_hai'; l.flags.tPrep = 0.5; l.skill = Math.min(100, sk(l) + 3); log('Vừa học văn hóa vừa giữ năng khiếu — mệt hơn nhưng không phải bỏ đường nào.', 'neutral'); fx(l, { kno: 2 }); stress(l, 4); } },
      { k: 'khac', l: 'Chọn hướng khác, coi năng khiếu là sở thích', ai: { w: 0.7 },
        run: function (l, r, log) { l.flags.tDinhHuong = 'khac'; log('Chọn tập trung vào các môn thi đại học thông thường, năng khiếu để dành làm niềm vui.', 'neutral'); fx(l, { kno: 3 }); } }
    ]
  });
  E.TRIG.push({ id: 'nk_dinh_huong', when: function (l, a) { return a >= 15 && a <= 17 && !!tsOf(l) && /upper|priv/.test(l.school || '') && !l.flags.tDinhHuong && free(l); }, p: 0.55, cd: 1, max: 1 });

  // 2b. ngã rẽ 18 tuổi: thêm lựa chọn thi năng khiếu vào trường chuyên ngành
  var UNI = E.DEC.uni, um0 = UNI.make, ua0 = UNI.auto, up0 = UNI.apply;
  UNI.make = function (l, r) {
    var d = um0.apply(this, arguments), S = schoolsFor(l);
    if (!S.length) return d;
    d.data.ts = S.map(function (s) { return s[0]; });
    var add = S.map(function (s) { var p = admitP(l, s); return { k: 'nk_' + s[0], l: (s[6] === 'cd' ? 'Học ' : 'Thi năng khiếu vào ') + s[1] + ' — ngành ' + s[4], h: (s[6] === 'cd' ? '2 năm · ' : '4 năm · ') + s[8] + ' · ' + pctTxt(p) + ' · ra trường có thể làm: ' + jobNames(s[7]) }; });
    var i = d.opts.findIndex(function (o) { return o.k === 'police'; }); if (i < 0) i = d.opts.findIndex(function (o) { return o.k === 'voc'; });
    Array.prototype.splice.apply(d.opts, [i < 0 ? d.opts.length : i, 0].concat(add));
    d.text += ' Thầy cô gợi ý: với năng khiếu ' + E.talentText(l) + ', bạn có thể thi vào trường chuyên ngành' + (l.flags.tDinhHuong === 'khac' ? ' — dù trước đây bạn đã chọn hướng khác, cánh cửa vẫn mở.' : '.');
    return d;
  };
  UNI.auto = function (l, d, r) {
    var k = ua0.apply(this, arguments), ts = (d.data && d.data.ts) || [];
    if (!ts.length || /^(military|xkld|abroad)$/.test(k)) return k;
    var want = 0.15 + (l.flags.tPrep || 0) * 0.45 + (sk(l) - 50) / 150 - (l.flags.tDinhHuong === 'khac' ? 0.2 : 0);
    if (!ch(r, U.clamp(want, 0, 0.9))) return k;
    var best = ts.map(function (id) { return sch(id); }).sort(function (a, b) { return admitP(l, b) - admitP(l, a); })[0];
    return 'nk_' + best[0];
  };
  function sch(id) { for (var t in TS) for (var i = 0; i < TS[t].sch.length; i++) if (TS[t].sch[i][0] === id) return TS[t].sch[i]; return null; }
  UNI.apply = function (l, d, k, r, log) {
    if (!/^nk_/.test(k)) return up0.apply(this, arguments);
    var s = sch(k.slice(3)); if (!s) return up0.call(this, l, d, 'work', r, log);
    var p = admitP(l, s);
    if (!ch(r, p)) { log('Trượt kỳ thi năng khiếu vào ' + s[1] + '. ' + pick(r, ['Phần thi năng khiếu chưa đủ điểm chuẩn.', 'Thiếu nửa điểm, về nhà khóc cả buổi.', 'Hội đồng nhận xét: "Có tố chất nhưng cần luyện thêm."']), 'bad'); fx(l, { hap: -6 }); l.pending.unshift(E.DEC.uniFail.make(l)); return; }
    var city = s[2] || (l.city || 'tỉnh nhà');
    l.school = s[6] === 'cd' ? 'voc' : 'uni'; l.schoolEnd = l.age + (s[6] === 'cd' ? 2 : 4); // v3.9: cao đẳng 2 năm
    l.major = s[3]; l.majorName = s[4]; l.uniTier = s[5] >= 0.55 ? 1.2 : 1.05; l.uniCity = city;
    if (s[2] && s[2] !== homeCity(l)) l.cityStudent = { city: city, since: l.age };
    l.flags.tSchool = { id: s[0], n: s[1], mn: s[4], jobs: s[7], cd: s[6] === 'cd', at: l.age };
    if (/vhntqd/.test(s[0])) l.flags.milDone = true; // học trường quân đội được tính là đã phục vụ
    log('Đỗ ' + s[1] + ', ngành ' + s[4] + '!', 'big'); fx(l, { hap: 8 }); l.skill = Math.min(100, sk(l) + 3);
    H.mem(l, 'Ngày nhận giấy báo trúng tuyển ' + s[1] + ' — năng khiếu từ nhỏ đã thành con đường.', 5);
  };

  // 2c. ra trường: gợi ý nghề đúng chuyên ngành (vẫn có thể chọn ngành khác)
  var JDESC = { ca_si: 'bắt đầu từ hát phòng trà, đám cưới; nổi hay không còn nhờ bài hát hay và chút may mắn', nhac_si: 'làm nhạc công, phối khí, sáng tác bán bài', giang_vien: 'ở lại trường làm giảng viên', giao_vien: 'về trường phổ thông dạy học, lương ổn định',
    van_cong: 'biên chế đoàn văn công, lương ổn định, đi biểu diễn phục vụ bộ đội', dj: 'chơi nhạc ở bar, sự kiện', hoa_si: 'vẽ tranh theo đơn, triển lãm, bán tranh', thiet_ke: 'làm thiết kế đồ họa ở công ty quảng cáo', tk_thoi_trang: 'thiết kế thời trang',
    kien_truc: 'kiến trúc sư ở công ty thiết kế', fl_thiet_ke: 'nhận thiết kế tự do', dien_vien: 'đi casting, đóng vai nhỏ trước', mc_tv: 'dẫn chương trình ở đài', dao_dien: 'làm trợ lý đạo diễn', bien_kich: 'viết kịch bản phim truyền hình', hlv_tt: 'trợ lý huấn luyện viên ở đội tuyển tỉnh',
    pt_gym: 'huấn luyện viên cá nhân ở phòng gym', fl_dich: 'biên – phiên dịch', hdv: 'hướng dẫn viên du lịch', tiep_vien: 'tiếp viên hàng không', ngoai_giao: 'thi tuyển vào ngành ngoại giao', marketing: 'marketing ở công ty', logistics: 'xuất nhập khẩu', phong_vien: 'phóng viên ở tòa soạn',
    dev: 'lập trình viên', data: 'phân tích dữ liệu', ky_su: 'kỹ sư', nghien_cuu: 'nghiên cứu viên', gia_su: 'dạy thêm', luat_su: 'trợ lý luật sư', cong_chung: 'văn phòng công chứng', tham_phan: 'thi vào ngành tòa án', kiem_sat: 'thi vào ngành kiểm sát', fl_content: 'viết nội dung',
    ky_su_co_dien: 'kỹ sư cơ điện', ky_thuat_vien: 'kỹ thuật viên', tho_dien: 'thợ điện', tho_han: 'thợ hàn', sale_b2b: 'kinh doanh', ngan_hang: 'ngân hàng', stylist: 'stylist', makeup: 'trang điểm', spa: 'spa', nail: 'làm móng', tho_toc: 'làm tóc', streamer: 'streamer' };
  SC('nk_ra_truong', {
    title: 'Tốt nghiệp — làm gì với tấm bằng?',
    valid: function (l) { return !!l.flags.tSchool && !l.job; },
    prep: function (l) { var T = l.flags.tSchool; return { jobs: T.jobs.filter(function (id) { return E.CAR[id] && E.CAR[id].edu <= l.edu; }).slice(0, 3) }; },
    text: function (l) { var T = l.flags.tSchool; return 'Bạn tốt nghiệp ngành ' + T.mn + ' của ' + T.n + '. Với tấm bằng và năng khiếu của mình, hướng đi gợi ý:'; },
    opts: [0, 1, 2].map(function (i) {
      return { k: 'j' + i, l: function (l, d) { var id = d.jobs[i]; return id ? cap(E.offerLabel(l, id)) : ''; }, h: function (l, d) { return JDESC[d.jobs[i]] || ''; }, req: function (l, d) { return !!d.jobs[i]; }, ai: { w: 1.2 - i * 0.2 },
        run: function (l, r, log, d) { var id = d.jobs[i]; E.startJob(l, id, r, log); if (id === 'ca_si' || id === 'dien_vien') l.fame = Math.max(l.fame || 0, 5000); if (id === 'giang_vien') log('Được thầy cô giữ lại trường làm giảng viên.', 'good'); } };
    }).concat([{ k: 'khac', l: 'Tìm việc ở ngành khác', ai: { w: 0.4 }, run: function (l, r, log) { l.flags.needJob = true; log('Cất tấm bằng chuyên ngành, đi tìm việc ở lĩnh vực khác.', 'neutral'); l.pending.unshift(E.DEC.job.make(l, r)); } }])
  });
  E.HOOKS.year.push(function (l, r, log, a) {
    var T = l.flags.tSchool; if (!T || T.out) return;
    if (l.school) return;
    T.out = true;
    if (l.edu < (T.cd ? 4 : 5) || l.job) return; // bỏ học giữa chừng, hoặc đã đi làm
    if (l.flags.postNext != null) return; // học tiếp thạc sĩ
    l.flags.needJob = false;
    if (T.cd) log('Tốt nghiệp ' + T.n + ', ngành ' + T.mn + '.', 'good');
    l.pending.push(E.DEC.nk_ra_truong.make(l, r));
  });
  E.MAJOR && (E.MAJOR.nk_ra_truong = 1, E.MAJOR.nk_dinh_huong = 1);

  // ===================================================================
  // 3. SỰ KIỆN THEO BỐI CẢNH NGÀNH
  // ===================================================================
  var JOBS2 = E.JOBS2 || (E.JOBS2 = {});
  // o = [k, nhãn, ai, chạy, gợi ý (chuỗi hoặc hàm)]
  function J(id, jobs, rmin, rmax, p, cd, title, text, opts, extra) {
    JOBS2[id] = jobs;
    SC(id, { title: title, valid: function (l) { return jobs.indexOf(jid(l)) >= 0; }, text: text, opts: opts.map(function (o) { return { k: o[0], l: o[1], ai: o[2], run: o[3], h: o[4] || '' }; }) });
    E.TRIG.push({ id: id, when: function (l, a) { return jobs.indexOf(jid(l)) >= 0 && rk(l) >= rmin && rk(l) <= rmax && free(l) && (!extra || extra(l, a)); }, p: p, cd: cd, max: 2 });
  }
  var HON = { w: 1.3, bad: -0.5 }, BAD = { bad: 1.2, risk: 0.6, w: 0.5 }, MID = { w: 0.9 }, RISK = { risk: 1, amb: 0.8, w: 0.8 };
  function fame(l, mul, add) { l.fame = Math.max(0, (l.fame || 0) * mul + (add || 0)); }
  function trap(l, key) { (l.flags.traps = l.flags.traps || {})[key] = l.age; }
  function TR(key, p, run) { if (E.TRAPS) E.TRAPS[key] = { p: p, run: run }; }

  // ---------- ÂM NHẠC ----------
  var SINGERS = ['ca_si', 'rapper'];
  function hit(l, r, log, what, big) {
    var x = 0.6 + r() * 0.8, gain = V(l, (20 + rk(l) * 40) * (big ? 2.5 : 1) * x);
    fame(l, big ? 3 : 2, (big ? 4e5 : 1.5e5) * x);
    H.cash(l, gain, 'Show diễn nhờ bài hit');
    log(what + ' Lời mời biểu diễn kéo đến liên tục, cát-xê tăng hẳn (thu về ' + mo(l, gain) + ').', 'big');
    if (promote(l)) log('Bạn trở thành ' + E.jobTitle(l) + '.', 'good');
    H.mem(l, 'Lần đầu nghe cả khán phòng hát theo bài hát của mình.', 6); fx(l, { hap: 10 });
  }
  J('am_mua_bai', SINGERS, 0, 4, 0.3, 3, 'Một bài hát "để đời"', function (l) { return 'Ca sĩ sống bằng bài hát. Bạn cần một ca khúc mới để bật lên — nhưng bài hay thì đắt, và có bài hay rồi vẫn cần chút may mắn mới thành hit.'; }, [
    ['hit', 'Mua bài của một nhạc sĩ chuyên viết hit', RISK, function (l, r, log) { var c = [80, 120, 200, 300, 500][Math.min(4, rk(l))]; pay(l, c, 'Mua bài hát'); if (ch(r, 0.32 + sk(l) / 600)) hit(l, r, log, 'Bài hát mua của nhạc sĩ nổi tiếng thành hit, lọt top thịnh hành, được hát lại khắp mạng xã hội.', true); else { log('Bỏ ' + mo(l, V(l, c)) + ' mua bài, quay MV chỉn chu, nhưng bài ra cùng lúc với mấy ca khúc lớn — lặng lẽ chìm.', 'neutral'); fx(l, { hap: -4 }); } }, function (l) { return 'Khoảng ' + mo(l, V(l, [80, 120, 200, 300, 500][Math.min(4, rk(l))])) + ' · cơ hội thành hit cao nhất'; }],
    ['tre', 'Mua bài của một nhạc sĩ trẻ chưa có tên tuổi', MID, function (l, r, log) { pay(l, 15, 'Mua bài hát'); if (ch(r, 0.15 + sk(l) / 800)) hit(l, r, log, 'Bài hát của cậu nhạc sĩ trẻ vô danh bất ngờ "viral" — cả hai cùng nổi.', false); else log('Bài hát dễ thương nhưng chưa đủ "đinh", được vài trăm nghìn lượt nghe.', 'neutral'); }, function (l) { return 'Khoảng ' + mo(l, V(l, 15)) + ' · may rủi'; }],
    ['tu', 'Tự sáng tác', { smart: 0.8, amb: 0.6 }, function (l, r, log) { var can = l.flags.compose || sk(l) >= 60 || jid(l) === 'rapper'; if (!can && !ch(r, 0.3)) { log('Ngồi cả tháng với cây đàn mà chưa viết được bài nào ưng ý. Sáng tác khó hơn hát nhiều.', 'neutral'); fx(l, { hap: -2 }); return; } l.flags.compose = true; if (ch(r, 0.1 + sk(l) / 500)) { hit(l, r, log, 'Ca khúc tự sáng tác chạm đến người nghe — vừa nổi tiếng vừa giữ trọn tiền bản quyền.', false); l.flags.royalty = (l.flags.royalty || 0) + 10; } else log('Viết xong một bài tâm đắc. Khán giả khen chân thành, chưa thành hit — nhưng bạn đã biết mình viết được.', 'good'); fx(l, { hap: 3 }); }, 'Không tốn tiền mua bài · cần khả năng sáng tác'],
    ['cover', 'Cover lại bản hit cũ cho an toàn', { w: 0.7 }, function (l, r, log) { pay(l, 3, 'Phí xin phép bản quyền bài cover'); fame(l, 1.1, 3000); log('Xin phép tác giả, trả phí bản quyền rồi cover lại bản hit cũ — được khen, có thêm khán giả.', 'neutral'); }, 'Ít rủi ro, ít đột phá']]);
  J('am_thi_truyen_hinh', ['ca_si', 'rapper', 'nhac_si'], 0, 1, 0.22, 4, 'Cuộc thi truyền hình', function (l) { var j = jid(l); return 'Cuộc thi ' + (j === 'rapper' ? 'rap trên truyền hình' : j === 'nhac_si' ? 'sáng tác ca khúc trên truyền hình' : 'tìm kiếm giọng hát trên truyền hình') + ' mở vòng tuyển chọn. Nhiều ca sĩ nổi tiếng hiện nay bước ra từ những cuộc thi như thế này.'; }, [
    ['thi', 'Đi thi, dốc hết sức', RISK, function (l, r, log) { var x = sk(l) / 100 * 0.6 + r() * 0.6; if (x < 0.45) { log('Dừng chân ở vòng giấu mặt — không huấn luyện viên nào quay ghế. Về nhà luyện tiếp.', 'neutral'); fx(l, { hap: -4 }); } else if (x < 0.75) { fame(l, 1.6, 6e4); log('Vào được top 12, được khán giả cả nước biết mặt.', 'good'); fx(l, { hap: 5 }); } else if (x < 0.95) { fame(l, 2.2, 2e5); promote(l); log('Lọt vào đêm chung kết! Dù không giành ngôi quán quân, bạn đã có tên tuổi.', 'big'); H.mem(l, 'Đêm chung kết cuộc thi truyền hình, ánh đèn sân khấu và tiếng hò reo.', 5); } else { fame(l, 3, 5e5); promote(l); promote(l); earn(l, 300, 'Giải quán quân'); log('Giành ngôi QUÁN QUÂN! Tên bạn phủ kín mạng xã hội.', 'big'); H.mem(l, 'Khoảnh khắc được xướng tên quán quân.', 8); } }],
    ['an_toan', 'Đi thi cho biết, không áp lực', MID, function (l, r, log) { if (ch(r, 0.3)) { fame(l, 1.3, 2e4); log('Đi thi cho vui, bất ngờ vào được vòng đối đầu. Có thêm ít người hâm mộ.', 'good'); } else log('Thi vui, dừng ở vòng đầu, quen thêm nhiều bạn cùng nghề.', 'neutral'); fx(l, { soc: 3 }); }],
    ['khong', 'Không thi, tự đi đường của mình', { w: 0.6 }, function (l, r, log) { log('Không đi thi, tiếp tục hát ở phòng trà và làm nhạc riêng.', 'neutral'); }]]);
  J('am_clip_lan_truyen', ['ca_si', 'rapper', 'nhac_si', 'van_cong', 'dj'], 0, 3, 0.1, 5, 'Clip lan truyền', 'Một khán giả quay lén lúc bạn hát ở đám cưới / phòng trà rồi đăng lên mạng. Sau một đêm, clip có vài triệu lượt xem.', [
    ['tan_dung', 'Tranh thủ ra ngay bản thu âm chính thức', RISK, function (l, r, log) { pay(l, 20, 'Thu âm, quay MV nhanh'); if (ch(r, 0.5)) hit(l, r, log, 'Bản chính thức ra đúng lúc cả mạng đang tìm kiếm — thành hit.', false); else { fame(l, 1.4, 3e4); log('Bản chính thức ra hơi muộn, cơn sốt đã qua, nhưng bạn vẫn có thêm nhiều người theo dõi.', 'neutral'); } }],
    ['cam_on', 'Cảm ơn khán giả, cứ hát như bình thường', MID, function (l, r, log) { fame(l, 1.3, 2e4); log('Đăng lời cảm ơn, khách đến phòng trà đông hơn hẳn.', 'good'); }],
    ['go', 'Yêu cầu gỡ clip vì quay không xin phép', { w: 0.3 }, function (l, r, log) { log('Clip được gỡ. Bạn giữ được sự riêng tư, nhưng cơ hội cũng trôi qua.', 'neutral'); }]]);
  J('am_ban_quyen', ['ca_si', 'nhac_si', 'rapper'], 1, 4, 0.12, 5, 'Bài hát bị dùng không xin phép', 'Bạn phát hiện bài hát của mình bị nhiều quán karaoke, kênh mạng xã hội dùng để kiếm tiền mà không xin phép, không trả tiền bản quyền.', [
    ['uy_thac', 'Ủy thác cho trung tâm bảo vệ quyền tác giả âm nhạc thu hộ', HON, function (l, r, log) { l.flags.royalty = (l.flags.royalty || 0) + 6 + rk(l) * 6; log('Ủy thác quyền tác giả: từ nay mỗi năm có một khoản tiền bản quyền đều đặn.', 'good'); }],
    ['kien', 'Gửi thư yêu cầu, rồi kiện bên vi phạm lớn nhất', RISK, function (l, r, log) { pay(l, 10, 'Thuê luật sư'); if (ch(r, 0.6)) { earn(l, 60, 'Bồi thường bản quyền'); log('Tòa xử bạn thắng kiện, bên vi phạm phải bồi thường và xin lỗi công khai.', 'good'); } else log('Vụ kiện kéo dài, tốn kém, cuối cùng hòa giải với khoản tiền nhỏ.', 'neutral'); }],
    ['ke', 'Kệ, càng nhiều người hát càng nổi', { w: 0.5 }, function (l, r, log) { fame(l, 1.1, 5000); log('Bỏ qua chuyện bản quyền — nổi thêm chút nhưng mất một nguồn thu.', 'neutral'); }]]);
  J('am_giu_giong', ['ca_si', 'van_cong'], 0, 4, 0.08, 6, 'Giọng hát có vấn đề', 'Khàn tiếng kéo dài, hát nốt cao bị rè. Bác sĩ chẩn đoán hạt xơ dây thanh vì hát quá nhiều, thức khuya.', [
    ['nghi', 'Nghỉ hát vài tháng, điều trị đến nơi đến chốn', HON, function (l, r, log) { pay(l, 15, 'Điều trị dây thanh'); fx(l, { hea: 2 }); log('Hủy hết show, nghỉ ba tháng điều trị. Giọng hát hồi phục, trong như cũ.', 'good'); }, function (l) { return 'Khoảng ' + mo(l, V(l, 15)) + ' và mất mấy tháng thu nhập'; }],
    ['hat_tiep', 'Uống thuốc rồi hát tiếp, show đã nhận rồi', { risk: 1, w: 0.6 }, function (l, r, log) { earn(l, 20, 'Vẫn chạy show'); if (ch(r, 0.4)) { l.skill = Math.max(10, sk(l) - 20); fame(l, 0.6); log('Gắng hát qua mùa show, rồi một đêm mất tiếng giữa sân khấu. Giọng hát không bao giờ trở lại như xưa.', 'bad'); fx(l, { hap: -10 }); } else log('May mắn qua được mùa show, giọng vẫn ổn — lần sau không dám liều nữa.', 'neutral'); }]]);
  J('am_ban_bai', ['nhac_si'], 0, 3, 0.25, 3, 'Có người muốn mua bài hát', 'Một ca sĩ nổi tiếng nghe bản demo của bạn và muốn mua ca khúc.', [
    ['ban_dut', 'Bán đứt, lấy tiền ngay', MID, function (l, r, log) { var x = earn(l, 20 + rk(l) * 30, 'Bán bài hát'); l.flags.compose = true; log('Bán đứt ca khúc, thu về ' + mo(l, x) + '.' + (ch(r, 0.3) ? ' Mấy tháng sau bài hát thành hit — bạn vừa vui vừa tiếc.' : ''), 'good'); }],
    ['ban_quyen', 'Giữ quyền tác giả, nhận tiền bản quyền theo lượt sử dụng', { smart: 1, w: 1 }, function (l, r, log) { l.flags.compose = true; if (ch(r, 0.35)) { l.flags.royalty = (l.flags.royalty || 0) + 15 + rk(l) * 10; fame(l, 1.5, 3e4); log('Bài hát thành hit, tên bạn xuất hiện trong mọi bảng xếp hạng với vai trò tác giả. Tiền bản quyền đều đặn mỗi năm.', 'big'); promote(l); } else { l.flags.royalty = (l.flags.royalty || 0) + 3; log('Bài hát được nghe vừa phải, tiền bản quyền lai rai.', 'neutral'); } }],
    ['giu', 'Giữ lại, chờ dịp tự ra mắt', { w: 0.5 }, function (l, r, log) { log('Cất bản demo vào ổ cứng, chờ ngày tự phát hành.', 'neutral'); }]]);
  J('am_show_tet', ['ca_si', 'rapper', 'dj'], 1, 4, 0.2, 3, 'Mùa show Tết', 'Bầu show mời chạy show Tết ở các tỉnh: một đêm năm, sáu điểm diễn, cát-xê gấp đôi ngày thường — nhưng Tết không có nhà.', [
    ['chay', 'Nhận hết, chạy show xuyên Tết', { amb: 1, w: 1 }, function (l, r, log) { var x = earn(l, 30 + rk(l) * 40, 'Show Tết'); fx(l, { hea: -3, hap: -2 }); stress(l, 8); log('Giao thừa trên xe khách giữa hai điểm diễn. Thu về ' + mo(l, x) + ', mệt rã rời.', 'neutral'); }],
    ['vua', 'Nhận vừa đủ, mùng Một ở nhà với gia đình', HON, function (l, r, log) { var x = earn(l, 12 + rk(l) * 15, 'Show Tết'); fx(l, { hap: 4 }); log('Chạy vài show trước Tết, mùng Một ở nhà ăn bánh chưng với gia đình. Thu về ' + mo(l, x) + '.', 'good'); }]]);
  J('am_fan_cuong', ['ca_si', 'rapper', 'dien_vien'], 1, 4, 0.08, 6, 'Người hâm mộ quá khích', 'Một người hâm mộ theo bạn từ sân bay về tận nhà, nhắn hàng trăm tin mỗi ngày, có lần còn chờ trước cổng cả đêm.', [
    ['ranh_gioi', 'Nhẹ nhàng nhưng dứt khoát đặt ranh giới, nhờ quản lý hỗ trợ', HON, function (l, r, log) { log('Quản lý gặp riêng người hâm mộ, giải thích rõ ràng. Mọi chuyện lắng xuống.', 'good'); }],
    ['bao_cong_an', 'Trình báo công an khu vực', MID, function (l, r, log) { log('Công an phường đến làm việc, nhắc nhở người hâm mộ. Cán bộ còn dặn bạn cách giữ an toàn khi đi diễn.', 'good'); }],
    ['ke', 'Kệ, nổi tiếng thì phải chịu', { w: 0.5 }, function (l, r, log) { stress(l, 10); fx(l, { hap: -4 }); log('Sống trong cảm giác bị theo dõi, mất ngủ mấy tháng liền.', 'bad'); }]]);
  J('vc_bien_gioi', ['van_cong'], 0, 2, 0.35, 2, 'Biểu diễn phục vụ bộ đội', 'Đoàn văn công được giao đi biểu diễn phục vụ cán bộ, chiến sĩ ở đồn biên phòng vùng cao và các đảo xa.', [
    ['di', 'Xung phong đi', { w: 1.3 }, function (l, r, log) { fx(l, { hap: 6, karma: 4 }); rep(l, 8); log('Hát giữa đồn biên phòng mù sương, chiến sĩ trẻ hát theo mà rưng rưng nhớ nhà. Chuyến đi đáng nhớ nhất đời biểu diễn.', 'good'); H.mem(l, 'Đêm diễn ở đồn biên phòng, cả đơn vị cùng hát.', 5); if (ch(r, 0.3) && promote(l)) log('Được đề bạt: ' + E.jobTitle(l) + '.', 'good'); }],
    ['nhuong', 'Nhường suất cho đồng đội, ở lại tập chương trình mới', MID, function (l, r, log) { log('Ở lại dựng chương trình mới cho đoàn.', 'neutral'); fx(l, { kno: 1 }); }]]);
  J('vc_ra_ngoai', ['van_cong'], 1, 2, 0.12, 5, 'Lời mời ra ngoài', 'Một công ty giải trí mời bạn rời đoàn văn công để làm ca sĩ / diễn viên tự do: cát-xê cao hơn nhiều, nhưng không còn lương ổn định.', [
    ['o_lai', 'Ở lại đoàn, giữ con đường đã chọn', { w: 1.1 }, function (l, r, log) { log('Ở lại đoàn văn công. Lương không cao nhưng ổn định, có lương hưu.', 'neutral'); }],
    ['ra', 'Xin chuyển ra, thử sức ở thị trường giải trí', RISK, function (l, r, log) { var to = l.talent === 'diễn xuất' ? 'dien_vien' : 'ca_si'; E.startJob(l, to, r, log); l.fame = Math.max(l.fame || 0, 3e4); }]]);

  // ---------- MỸ THUẬT, THIẾT KẾ ----------
  J('mt_trien_lam', ['hoa_si'], 0, 2, 0.25, 3, 'Triển lãm cá nhân', 'Bạn đủ tranh cho một triển lãm cá nhân. Thuê phòng tranh, in catalogue, làm khai mạc tốn kha khá.', [
    ['lam', 'Làm triển lãm', RISK, function (l, r, log) { pay(l, 30, 'Tổ chức triển lãm'); var x = r() + sk(l) / 200; if (x > 1) { var g = earn(l, 80 + rk(l) * 120, 'Bán tranh'); promote(l); log('Triển lãm thành công, báo chí viết bài, bán được nhiều tranh (thu về ' + mo(l, g) + ').', 'big'); H.mem(l, 'Đêm khai mạc triển lãm cá nhân đầu tiên.', 5); } else if (x > 0.6) { earn(l, 25, 'Bán tranh'); log('Bán được vài bức, hòa vốn, được giới chuyên môn chú ý.', 'good'); } else log('Khách đến xem đông nhưng chẳng ai mua. Tranh lại chất vào góc xưởng.', 'neutral'); }, function (l) { return 'Khoảng ' + mo(l, V(l, 30)); }],
    ['nhom', 'Góp tranh vào triển lãm nhóm cho đỡ tốn', MID, function (l, r, log) { pay(l, 5, 'Góp triển lãm nhóm'); if (ch(r, 0.4)) { earn(l, 20, 'Bán tranh'); log('Một bức tranh trong triển lãm nhóm được nhà sưu tập mua.', 'good'); } else log('Triển lãm nhóm vui, quen thêm nhiều họa sĩ.', 'neutral'); }]]);
  J('mt_tranh_gia', ['hoa_si'], 0, 2, 0.1, 6, 'Đơn hàng "chép tranh"', 'Một chủ phòng tranh đặt bạn chép lại tranh của các danh họa đã mất, ký tên họ, để bán cho khách như tranh thật. Trả rất hậu.', [
    ['tu_choi', 'Từ chối: chép thì được, giả mạo chữ ký thì không', HON, function (l, r, log) { fx(l, { karma: 4 }); log('Từ chối. Bạn chỉ nhận chép tranh có ghi rõ "bản chép".', 'good'); }],
    ['nhan', 'Nhận, tiền dễ quá', BAD, function (l, r, log) { earn(l, 60, 'Chép tranh giả'); fx(l, { karma: -6 }); trap(l, 'tranh_gia'); log('Nhận đơn, ký tên danh họa lên tranh mình vẽ.', 'bad'); }]]);
  TR('tranh_gia', 0.3, function (l, r, log) { log('Vụ bán tranh giả danh họa bị phanh phui, giới mỹ thuật lên tiếng. Tên bạn bị nêu là người vẽ, không ai đặt tranh nữa, còn bị phạt hành chính.', 'bad'); pay(l, 30, 'Phạt vụ tranh giả'); fame(l, 0.3); if (l.job && E.resolveJob(l.job.id) === 'hoa_si') { l.job = null; l.flags.needJob = true; } });
  J('mt_dat_ve', ['hoa_si', 'fl_thiet_ke', 'thiet_ke'], 0, 3, 0.2, 3, 'Khách đặt vẽ', 'Một khách hàng đặt vẽ chân dung cả gia đình để treo phòng khách, yêu cầu "vẽ đẹp hơn ngoài đời một chút, nhất là bà xã".', [
    ['ve', 'Vẽ chân thực nhưng khéo léo tôn nét đẹp', { w: 1.2 }, function (l, r, log) { var x = earn(l, 8 + rk(l) * 8, 'Vẽ chân dung theo đơn'); log('Khách ưng, giới thiệu thêm ba nhà nữa (thu về ' + mo(l, x) + ').', 'good'); rep(l, 5); }],
    ['sua', 'Chiều khách sửa đi sửa lại đến lần thứ 27', MID, function (l, r, log) { var x = earn(l, 6, 'Vẽ chân dung theo đơn'); stress(l, 8); log('Sửa đến lần thứ 27, khách quay về chọn… bản đầu tiên. Thu về ' + mo(l, x) + '.', 'neutral'); }]]);
  J('mt_dau_gia', ['hoa_si'], 1, 2, 0.12, 5, 'Phiên đấu giá', 'Một bức tranh của bạn được chọn đưa vào phiên đấu giá gây quỹ từ thiện của một nhà đấu giá lớn.', [
    ['dua', 'Đồng ý góp tranh', HON, function (l, r, log) { var x = 0.5 + r(); fame(l, 1.5, 2e4); fx(l, { karma: 3 }); log(x > 1.2 ? 'Bức tranh được trả giá cao gấp ba giá khởi điểm, tiền gây quỹ xây trường cho trẻ em vùng cao. Giá tranh của bạn tăng theo.' : 'Bức tranh được bán với giá vừa phải, toàn bộ góp vào quỹ từ thiện.', 'good'); if (x > 1.2) promote(l); }],
    ['khong', 'Từ chối, tranh đó đã hứa bán cho khách', MID, function (l, r, log) { earn(l, 15, 'Bán tranh'); log('Giữ lời với khách quen.', 'neutral'); }]]);
  J('kt_thi_y_tuong', ['kien_truc'], 0, 3, 0.15, 4, 'Cuộc thi phương án kiến trúc', 'Thành phố tổ chức thi phương án thiết kế một nhà văn hóa thiếu nhi. Bạn có thể thức trắng mấy tuần để làm bài dự thi.', [
    ['thi', 'Dự thi', RISK, function (l, r, log) { stress(l, 10); if (ch(r, 0.2 + sk(l) / 400 + rk(l) * 0.05)) { earn(l, 100, 'Giải nhất phương án kiến trúc'); promote(l); fame(l, 1.5, 1e4); log('Phương án của bạn đoạt giải nhất và được chọn xây dựng!', 'big'); H.mem(l, 'Ngày công trình mình thiết kế khánh thành, lũ trẻ chạy ùa vào.', 6); } else log('Không đoạt giải, nhưng phương án được ban giám khảo khen sáng tạo.', 'neutral'); }],
    ['bo', 'Thôi, việc ở công ty đã đủ mệt', MID, function (l, r, log) { log('Tập trung vào các dự án đang có.', 'neutral'); }]]);
  J('tk_tuan_le_thoi_trang', ['tk_thoi_trang'], 0, 3, 0.15, 4, 'Tuần lễ thời trang', 'Bạn được mời trình diễn bộ sưu tập ở một tuần lễ thời trang quốc tế tổ chức tại Việt Nam. Tự lo chi phí may mẫu, người mẫu.', [
    ['dien', 'Dốc vốn làm bộ sưu tập', RISK, function (l, r, log) { pay(l, 50, 'Làm bộ sưu tập'); if (ch(r, 0.35 + sk(l) / 400)) { fame(l, 2, 3e4); promote(l); earn(l, 90, 'Đơn hàng sau show diễn'); log('Bộ sưu tập được khen, nhiều người nổi tiếng mặc thiết kế của bạn — đơn đặt may kín lịch.', 'big'); } else log('Show diễn ổn, nhưng chưa tạo được dấu ấn, chưa bán được mấy.', 'neutral'); }, function (l) { return 'Khoảng ' + mo(l, V(l, 50)); }],
    ['hen', 'Hẹn mùa sau, chuẩn bị kỹ hơn', MID, function (l, r, log) { log('Lỡ một mùa, dành thời gian hoàn thiện bộ sưu tập.', 'neutral'); }]]);
  J('np_the_nho', ['nhiep_anh'], 0, 3, 0.12, 5, 'Mất thẻ nhớ ảnh cưới', 'Sau buổi chụp ảnh cưới, bạn phát hiện thẻ nhớ bị lỗi, mất gần hết ảnh ngày cưới của khách.', [
    ['thu_that', 'Báo thật, hoàn tiền, xin chụp lại buổi ngoại cảnh miễn phí', HON, function (l, r, log) { pay(l, 8, 'Hoàn tiền cho khách'); rep(l, 3); log('Khách buồn nhưng cảm kích sự thật thà, đồng ý chụp lại ngoại cảnh. Từ đó bạn luôn dùng hai thẻ nhớ.', 'neutral'); }],
    ['giau', 'Giấu, chỉ gửi mấy tấm còn lại, bảo "chỉ có thế"', BAD, function (l, r, log) { rep(l, -15); log('Khách phát hiện, lên mạng "bóc phốt". Mất khách cả mùa cưới.', 'bad'); }]]);

  // ---------- SÂN KHẤU, ĐIỆN ẢNH, TRUYỀN HÌNH ----------
  J('dd_phim_dau_tay', ['dao_dien'], 1, 3, 0.2, 4, 'Bộ phim đầu tay', 'Bạn có cơ hội làm bộ phim điện ảnh đầu tay. Nhà sản xuất cho chọn: phim nghệ thuật đi liên hoan phim, hay phim thương mại kiếm doanh thu.', [
    ['nghe_thuat', 'Phim nghệ thuật, đi liên hoan phim', { smart: 1, w: 1 }, function (l, r, log) { if (ch(r, 0.3 + sk(l) / 500)) { fame(l, 2, 5e4); promote(l); log('Phim được chọn chiếu ở một liên hoan phim quốc tế, nhận giải của ban giám khảo!', 'big'); H.mem(l, 'Đứng trên sân khấu liên hoan phim quốc tế, cầm giải thưởng cho bộ phim đầu tay.', 7); } else log('Phim được giới phê bình khen nhưng ra rạp vắng khách.', 'neutral'); }],
    ['thuong_mai', 'Phim thương mại, hài – tình cảm', RISK, function (l, r, log) { var x = r(); if (x > 0.7) { earn(l, 300, 'Thưởng doanh thu phim'); fame(l, 2, 1e5); promote(l); log('Phim cán mốc trăm tỷ doanh thu phòng vé!', 'big'); } else if (x > 0.3) log('Phim hòa vốn, khán giả chấm điểm trung bình.', 'neutral'); else { log('Phim lỗ nặng, bị chê kịch bản yếu.', 'bad'); fx(l, { hap: -6 }); } }]]);
  J('bk_kich_ban', ['bien_kich'], 0, 3, 0.18, 4, 'Kịch bản bị sửa', 'Nhà sản xuất muốn sửa kịch bản của bạn: thêm cảnh quảng cáo sản phẩm của nhà tài trợ, đổi cái kết buồn thành cái kết có hậu.', [
    ['thuong_luong', 'Thương lượng: giữ tinh thần kịch bản, chấp nhận vài chỗ quảng cáo khéo', { w: 1.2, smart: 0.6 }, function (l, r, log) { rep(l, 5); log('Thương lượng được, phim vẫn giữ được hồn. Nhà sản xuất nhớ tên bạn cho dự án sau.', 'good'); if (ch(r, 0.3)) promote(l); }],
    ['chieu', 'Chiều theo, miễn được trả đủ tiền', MID, function (l, r, log) { earn(l, 10, 'Nhuận bút kịch bản'); log('Phim ra mắt bị chê "quảng cáo lộ liễu". Tiền thì nhận đủ.', 'neutral'); }],
    ['rut', 'Rút kịch bản', { w: 0.4 }, function (l, r, log) { log('Rút kịch bản, chờ nhà sản xuất khác tâm huyết hơn.', 'neutral'); }]]);
  J('mc_dam_cuoi', ['mc_su_kien'], 0, 2, 0.2, 3, 'Sự cố ở đám cưới', 'Đang dẫn lễ cưới thì chú rể… say, lên sân khấu hát ba bài liền không chịu xuống, nhà gái bắt đầu khó chịu.', [
    ['kheo', 'Khéo léo pha trò, mời bố mẹ hai bên lên phát biểu để "cứu" không khí', { w: 1.2 }, function (l, r, log) { rep(l, 6); earn(l, 2, 'Tiền bo đám cưới'); log('Biến sự cố thành tiết mục vui nhất buổi. Nhà trai bo thêm, giới thiệu thêm khách.', 'good'); }],
    ['ke', 'Kệ, đúng giờ thì xuống', MID, function (l, r, log) { log('Buổi lễ trôi qua hơi ngượng ngùng.', 'neutral'); }]]);
  J('mc_dan_lon', ['mc_tv'], 0, 1, 0.15, 4, 'Cơ hội dẫn chương trình lớn', 'MC chính của một chương trình truyền hình lớn bị ốm, đài gọi bạn thay gấp — chỉ có một ngày chuẩn bị.', [
    ['nhan', 'Nhận, thức trắng đêm học kịch bản', RISK, function (l, r, log) { if (ch(r, 0.5 + sk(l) / 300)) { promote(l); fame(l, 1.5, 3e4); log('Dẫn trôi chảy, khán giả khen "MC mới duyên quá". Bạn được giao dẫn chính một chương trình.', 'big'); } else log('Vấp vài chỗ, bị lên mạng chế ảnh. Ít lâu sau mọi người cũng quên.', 'neutral'); }],
    ['tu_choi', 'Từ chối, chưa đủ tự tin', { w: 0.5 }, function (l, r, log) { log('Từ chối, đồng nghiệp khác nhận và nổi lên.', 'neutral'); }]]);

  // ---------- THỂ THAO ----------
  J('hlv_hoc_tro', ['hlv_tt', 'pt_gym', 'giao_vien'], 0, 3, 0.12, 5, 'Một đứa trẻ có năng khiếu', 'Bạn phát hiện một cậu bé nhà nghèo chạy chân đất nhanh hơn mọi học sinh trong trường.', [
    ['dao_tao', 'Kèm cặp miễn phí, xin cho em vào lớp năng khiếu', HON, function (l, r, log) { fx(l, { karma: 6, hap: 4 }); if (ch(r, 0.3)) { rep(l, 10); log('Chiều nào cũng kèm em chạy trên sân đất. Em tiến bộ thần tốc, được gọi vào đội tuyển trẻ quốc gia — bạn mừng như chính mình được chọn.', 'big'); H.mem(l, 'Ngày cậu học trò chân đất được gọi vào đội tuyển trẻ quốc gia.', 5); } else log('Cậu bé được vào lớp năng khiếu của tỉnh, có cơ hội đổi đời.', 'good'); }],
    ['bo_qua', 'Khen một câu rồi thôi', MID, function (l, r, log) { log('Khen cậu bé một câu rồi quên mất.', 'neutral'); }]]);
  J('hlv_khai_tuoi', ['hlv_tt'], 0, 2, 0.1, 6, 'Lời đề nghị "khai lại tuổi"', 'Một phụ huynh nhờ bạn sửa giấy tờ, khai nhỏ tuổi cho con để thi đấu ở giải trẻ cho dễ giành huy chương.', [
    ['tu_choi', 'Từ chối: thể thao phải công bằng', HON, function (l, r, log) { fx(l, { karma: 4 }); log('Từ chối thẳng thắn, giải thích cho phụ huynh hiểu.', 'good'); }],
    ['lam', 'Giúp "một chút"', BAD, function (l, r, log) { earn(l, 10, 'Tiền cảm ơn'); fx(l, { karma: -6 }); if (ch(r, 0.5)) { log('Ban tổ chức kiểm tra giấy tờ, phát hiện gian lận tuổi. Bạn bị đình chỉ công tác huấn luyện.', 'bad'); l.job = null; l.flags.needJob = true; } else log('Trót lọt, nhưng mỗi lần nhìn đứa trẻ đứng trên bục lại thấy áy náy.', 'bad'); }]]);
  J('pt_thuoc_tang_co', ['pt_gym'], 0, 2, 0.12, 5, 'Khách hỏi "thuốc tăng cơ"', 'Một khách tập muốn có cơ bắp thật nhanh để đi thi thể hình, nhờ bạn mua hộ thuốc tăng cơ không rõ nguồn gốc.', [
    ['khuyen', 'Khuyên tập đúng cách, ăn uống khoa học', HON, function (l, r, log) { rep(l, 5); log('Lên giáo án ăn tập nghiêm túc. Khách tiến bộ chậm mà chắc, gắn bó với bạn nhiều năm.', 'good'); }],
    ['ban', 'Bán hộ, ăn chênh lệch', BAD, function (l, r, log) { earn(l, 5, 'Bán thuốc tăng cơ'); fx(l, { karma: -5 }); if (ch(r, 0.4)) { log('Khách bị tổn thương gan phải nhập viện, gia đình tìm đến phòng gym. Bạn bị cho nghỉ việc.', 'bad'); l.job = null; l.flags.needJob = true; } }]]);

  // ---------- NGOẠI NGỮ, DU LỊCH ----------
  J('nn_cabin', ['fl_dich', 'ngoai_giao'], 1, 3, 0.15, 4, 'Phiên dịch hội nghị quốc tế', 'Bạn được mời phiên dịch cabin cho một hội nghị quốc tế lớn: nói song song, không được phép sai.', [
    ['nhan', 'Nhận, chuẩn bị tài liệu thuật ngữ cả tuần', { amb: 1, w: 1.1 }, function (l, r, log) { if (ch(r, 0.45 + l.st.kno / 250)) { var x = earn(l, 25, 'Phiên dịch hội nghị'); promote(l); log('Dịch trôi chảy suốt ba ngày, trưởng đoàn bạn bè quốc tế khen ngợi (thu về ' + mo(l, x) + ').', 'big'); } else { earn(l, 15, 'Phiên dịch hội nghị'); log('Có đoạn dịch hụt vì diễn giả nói quá nhanh, đồng nghiệp ở cabin kịp đỡ. Bài học nhớ đời.', 'neutral'); } }],
    ['tu_choi', 'Từ chối, chưa đủ tự tin', { w: 0.5 }, function (l, r, log) { log('Từ chối, nhận tiếp các hợp đồng dịch viết.', 'neutral'); }]]);
  J('nn_dich_sai', ['fl_dich', 'hdv'], 0, 3, 0.1, 5, 'Phát hiện mình dịch sai', 'Bạn phát hiện bản dịch hợp đồng đã giao cho khách tuần trước có một con số bị dịch sai, có thể khiến khách thiệt hại.', [
    ['bao', 'Báo ngay cho khách, sửa miễn phí', HON, function (l, r, log) { rep(l, 6); log('Khách kịp sửa trước khi ký. Họ quý sự trung thực, giao thêm việc thường xuyên.', 'good'); }],
    ['im', 'Im lặng, chắc không ai để ý', BAD, function (l, r, log) { if (ch(r, 0.5)) { pay(l, 20, 'Bồi thường dịch sai'); rep(l, -20); log('Đối tác phát hiện sai sót, khách thiệt hại và đòi bạn bồi thường.', 'bad'); } else log('Không ai phát hiện. Nhưng bạn biết mình đã sai.', 'neutral'); }]]);
  J('hdv_mat_ho_chieu', ['hdv'], 0, 3, 0.15, 4, 'Khách mất hộ chiếu', 'Một vị khách nước ngoài trong đoàn bị móc túi mất hộ chiếu đúng hôm trước khi bay về.', [
    ['giup', 'Đưa khách đi trình báo, liên hệ đại sứ quán làm giấy tờ', HON, function (l, r, log) { rep(l, 8); fx(l, { karma: 3 }); log('Cùng khách đến công an phường trình báo — cán bộ làm xác nhận rất nhanh, rồi đến đại sứ quán làm giấy thông hành. Khách viết thư khen gửi công ty.', 'good'); }],
    ['ke', 'Bảo khách tự lo, còn phải dẫn cả đoàn', MID, function (l, r, log) { rep(l, -5); log('Khách loay hoay một mình, về nước chấm điểm tour rất thấp.', 'neutral'); }]]);
  J('tv_hanh_khach', ['tiep_vien'], 0, 3, 0.15, 4, 'Hành khách gây rối', 'Một hành khách say rượu to tiếng, đòi hút thuốc trên máy bay và đẩy đồng nghiệp của bạn.', [
    ['quy_trinh', 'Bình tĩnh xử lý theo quy trình, báo cơ trưởng', HON, function (l, r, log) { rep(l, 6); log('Xử lý đúng quy trình. Khi hạ cánh, công an cửa khẩu lên máy bay làm việc với hành khách gây rối.', 'good'); }],
    ['nhin', 'Nhịn cho xong chuyến bay', MID, function (l, r, log) { stress(l, 8); log('Nhịn suốt hai tiếng bay, về nhà mệt rã rời.', 'neutral'); }]]);

  // ---------- KỸ THUẬT, CÔNG NGHỆ ----------
  var ENG = ['ky_su', 'ky_su_co_dien', 'ky_su_xd', 'dev', 'data'];
  J('ks_du_an', ENG, 0, 3, 0.18, 4, 'Dự án gấp', 'Công ty nhận một dự án lớn, hạn chót cực gắt. Sếp đề nghị cả nhóm làm xuyên đêm, cuối tuần trong hai tháng.', [
    ['lam', 'Lao vào làm, cơ hội để chứng tỏ', { amb: 1, w: 1 }, function (l, r, log) { stress(l, 12); fx(l, { hea: -3 }); if (ch(r, 0.5)) { promote(l); log('Dự án về đích đúng hạn. Bạn được thăng chức: ' + E.jobTitle(l) + '.', 'good'); } else log('Dự án xong, thưởng một bữa liên hoan. Bạn sụt mấy cân.', 'neutral'); }],
    ['thuong_luong', 'Đề xuất chia giai đoạn, tuyển thêm người cho hợp lý', { smart: 1, w: 1 }, function (l, r, log) { if (ch(r, 0.55)) { rep(l, 6); log('Sếp đồng ý kế hoạch mới, cả nhóm làm việc bền hơn.', 'good'); } else log('Sếp gạt đi: "Khách không chờ được." Cả nhóm vẫn phải làm thêm.', 'neutral'); }]]);
  J('ks_sang_che', ['ky_su', 'ky_su_co_dien', 'nghien_cuu', 'ky_thuat_vien'], 0, 4, 0.08, 6, 'Một sáng chế nhỏ', 'Bạn cải tiến được một chi tiết máy giúp xưởng tiết kiệm cả tỷ đồng mỗi năm.', [
    ['dang_ky', 'Báo cáo công ty, đăng ký sáng kiến – sáng chế', HON, function (l, r, log) { earn(l, 30, 'Thưởng sáng kiến'); promote(l); H.mem(l, 'Tấm bằng sáng chế đầu tiên mang tên mình.', 5); log('Công ty khen thưởng, sáng kiến được đăng ký bảo hộ, tên bạn đứng tác giả.', 'good'); }],
    ['rieng', 'Giữ lại, định ra ngoài tự làm', RISK, function (l, r, log) { if (ch(r, 0.3)) { earn(l, 150, 'Bán giải pháp kỹ thuật'); log('Mở công ty nhỏ bán giải pháp, ăn nên làm ra.', 'big'); } else log('Định tự làm nhưng thiếu vốn, ý tưởng nằm trong ngăn kéo.', 'neutral'); }]]);
  J('ks_an_toan', ['ky_su_co_dien', 'ky_su_xd', 'ky_su'], 1, 4, 0.1, 6, 'Bỏ qua kiểm định?', 'Nhà thầu muốn đẩy nhanh tiến độ, đề nghị bạn ký biên bản kiểm định hệ thống điện của tòa nhà dù chưa thử tải đầy đủ.', [
    ['khong_ky', 'Không ký khi chưa kiểm tra đủ', HON, function (l, r, log) { fx(l, { karma: 4 }); rep(l, 5); log('Kiên quyết kiểm tra lại, phát hiện một tủ điện lắp sai. Có thể bạn vừa ngăn được một vụ cháy.', 'good'); }],
    ['ky', 'Ký cho kịp tiến độ', BAD, function (l, r, log) { earn(l, 10, 'Tiền "cảm ơn" của nhà thầu'); trap(l, 'kiem_dinh'); log('Ký cho xong.', 'bad'); }]]);
  TR('kiem_dinh', 0.25, function (l, r, log) { log('Tòa nhà bị chập điện gây cháy. Cơ quan điều tra xác định biên bản kiểm định có chữ ký của bạn dù chưa thử tải. Bạn bị kỷ luật, tước chứng chỉ hành nghề.', 'bad'); if (l.job) { l.job = null; l.flags.needJob = true; } pay(l, 50, 'Bồi thường'); fx(l, { hap: -10 }); });
  J('ks_khoi_nghiep', ['ky_su', 'dev', 'data'], 1, 3, 0.1, 6, 'Rủ khởi nghiệp', 'Một người bạn cũ rủ bạn nghỉ việc cùng làm startup công nghệ, góp vốn mỗi người một ít.', [
    ['lam', 'Nghỉ việc, cùng làm startup', RISK, function (l, r, log) { pay(l, 100, 'Góp vốn khởi nghiệp'); var x = r(); if (x > 0.85) { earn(l, 2000, 'Bán lại startup'); log('Startup được một tập đoàn mua lại! Bạn thành triệu phú đô la… bằng tiền Việt.', 'big'); H.mem(l, 'Ngày ký hợp đồng bán startup.', 7); } else if (x > 0.45) log('Startup sống được, lương thấp hơn trước nhưng học được rất nhiều.', 'neutral'); else { log('Hết vốn sau 18 tháng, startup đóng cửa. Quay lại đi làm thuê.', 'bad'); fx(l, { hap: -6 }); } }, function (l) { return 'Góp khoảng ' + mo(l, V(l, 100)); }],
    ['khong', 'Ở lại công ty, hỗ trợ bạn ngoài giờ', MID, function (l, r, log) { log('Giữ việc ổn định, thỉnh thoảng giúp bạn ngoài giờ.', 'neutral'); }]]);

  // ---------- NGHỀ LAO ĐỘNG TRƯỚC ĐÂY ÍT SỰ KIỆN ----------
  J('th_bao_ho', ['tho_han'], 0, 3, 0.15, 5, 'Mặt nạ hàn hỏng', 'Mặt nạ hàn bị nứt kính, chủ xưởng bảo "dùng tạm, tháng sau mua".', [
    ['mua', 'Tự bỏ tiền mua mặt nạ mới', HON, function (l, r, log) { pay(l, 0.5, 'Mua đồ bảo hộ'); log('Bỏ tiền mua mặt nạ mới — mắt là của mình.', 'good'); }],
    ['tam', 'Dùng tạm', { risk: 0.8, w: 0.7 }, function (l, r, log) { if (ch(r, 0.4)) { fx(l, { hea: -6 }); log('Bị "bỏng mắt" do tia hồ quang, đau rát cả tuần, phải nghỉ làm đi khám.', 'bad'); } else log('Dùng tạm mấy tuần, mắt mỏi nhưng chưa sao.', 'neutral'); }],
    ['kien_nghi', 'Đề nghị chủ xưởng trang bị đủ bảo hộ cho cả xưởng', { w: 1 }, function (l, r, log) { if (ch(r, 0.6)) log('Chủ xưởng mua đồ bảo hộ mới cho mọi người. Anh em cảm ơn bạn.', 'good'); else log('Chủ xưởng không vui, nhưng vẫn phải mua.', 'neutral'); }]]);
  J('tm_go_lau', ['tho_moc'], 0, 3, 0.1, 6, 'Lô gỗ không giấy tờ', 'Một khách đặt đóng bộ bàn ghế gỗ quý, tự mang gỗ đến — lô gỗ không có giấy tờ nguồn gốc.', [
    ['tu_choi', 'Từ chối, chỉ nhận gỗ có giấy tờ hợp pháp', HON, function (l, r, log) { log('Từ chối. Ít lâu sau nghe tin kiểm lâm bắt một đường dây buôn gỗ lậu.', 'good'); fx(l, { karma: 3 }); }],
    ['nhan', 'Nhận, tiền công cao', BAD, function (l, r, log) { earn(l, 15, 'Đóng đồ gỗ'); if (ch(r, 0.3)) { pay(l, 30, 'Phạt tàng trữ gỗ lậu'); log('Kiểm lâm kiểm tra xưởng, lô gỗ bị tịch thu, bạn bị phạt hành chính.', 'bad'); } }]]);
  J('tm_mo_xuong', ['tho_moc', 'tho_han', 'tho_may'], 0, 1, 0.12, 6, 'Mở xưởng riêng', 'Tay nghề đã vững, khách quen nhiều, bạn tính mở xưởng riêng.', [
    ['mo', 'Vay mượn mở xưởng nhỏ', RISK, function (l, r, log) { pay(l, 60, 'Mở xưởng'); if (ch(r, 0.55)) { promote(l); log('Xưởng nhỏ đắt hàng, thuê thêm hai thợ phụ.', 'good'); } else log('Xưởng ế mấy tháng đầu, phải làm thêm ngoài giờ để trả nợ.', 'neutral'); }],
    ['o', 'Làm thuê thêm vài năm cho chắc', MID, function (l, r, log) { log('Tiếp tục làm thuê, tích lũy thêm vốn.', 'neutral'); }]]);
  J('pv_khach_bo', ['phuc_vu', 'barista', 'bartender'], 0, 2, 0.15, 4, 'Vị khách đặc biệt', 'Một vị khách ngồi quán nhiều giờ, gọi đúng một ly trà đá, rồi trước khi về để lại tờ tiền bo lớn gấp mấy ngày lương kèm lời nhắn "Cảm ơn em đã cười với tôi hôm nay".', [
    ['cam_on', 'Cảm ơn, nhận và chia với đồng nghiệp', { w: 1.2 }, function (l, r, log) { earn(l, 0.5, 'Tiền bo'); fx(l, { hap: 6 }); log('Chia tiền bo với cả ca làm. Lời nhắn ấy bạn giữ trong ví nhiều năm.', 'good'); }],
    ['giu', 'Giữ riêng', MID, function (l, r, log) { earn(l, 1, 'Tiền bo'); fx(l, { hap: 3 }); log('Giữ riêng khoản tiền bo, mua cho mẹ cái áo mới.', 'good'); }]]);
  J('br_trat_tu', ['ban_rong'], 0, 1, 0.15, 4, 'Đội trật tự đô thị', 'Đội trật tự đô thị đi dẹp hàng rong lấn chiếm vỉa hè đúng lúc bạn đang bán.', [
    ['dep', 'Thu dọn ngay, hỏi chỗ bán hợp lệ', HON, function (l, r, log) { log('Cán bộ phường nhẹ nhàng nhắc nhở và chỉ cho bạn một điểm bán tập trung ở chợ đêm mới mở. Từ đó buôn bán ổn định hơn.', 'good'); rep(l, 4); }],
    ['chay', 'Ôm hàng bỏ chạy', { risk: 0.8, w: 0.7 }, function (l, r, log) { if (ch(r, 0.4)) { pay(l, 1, 'Mất hàng'); log('Chạy vấp ngã, hàng rơi vãi khắp đường.', 'bad'); } else log('Chạy thoát, nửa tiếng sau lại bày ra bán.', 'neutral'); }]]);
  J('vs_khach_trung', ['ve_so'], 0, 1, 0.08, 6, 'Khách trúng số', 'Một bác xe ôm mua của bạn tờ vé số, hôm sau trúng giải nhất.', [
    ['mung', 'Mừng cho bác', { w: 1 }, function (l, r, log) { if (ch(r, 0.6)) { earn(l, 20, 'Khách trúng số "lại quả"'); log('Bác tìm đến tận nơi, dúi cho bạn một phong bì "lấy hên". Cả xóm vé số kéo đến mua của bạn.', 'good'); } else log('Bác lặng lẽ đi lĩnh thưởng, không ai biết bác là ai. Nhưng người ta đồn bạn bán "vé hên", đắt hàng hẳn.', 'good'); fx(l, { hap: 4 }); }]]);
  J('vs_ve_gia', ['ve_so'], 0, 1, 0.12, 5, 'Tờ vé số "trúng"', 'Một người đàn ông lạ đưa tờ vé số "trúng giải 5 triệu", nhờ bạn đổi lấy vé mới và tiền mặt vì "đang vội".', [
    ['do', 'Kiểm tra kỹ số, đối chiếu kết quả rồi mới đổi', { smart: 1, w: 1.2 }, function (l, r, log) { log('Dò lại mới thấy con số bị cạo sửa khéo léo. Người đàn ông vội vàng bỏ đi.', 'good'); fx(l, { kno: 1 }); }],
    ['doi', 'Đổi ngay cho người ta', { w: 0.5 }, function (l, r, log) { pay(l, 3, 'Đổi vé số giả'); log('Mang lên đại lý mới biết vé bị sửa số. Mất trắng mấy ngày tiền lời.', 'bad'); fx(l, { hap: -6 }); }]]);
  J('cc_ho_so_gia', ['cong_chung'], 0, 2, 0.12, 5, 'Hồ sơ đáng ngờ', 'Hai người đến công chứng hợp đồng bán nhà. Ảnh trên căn cước của "chủ nhà" không giống người đang ngồi trước mặt lắm.', [
    ['kiem', 'Đề nghị đối chiếu thêm giấy tờ, xác minh', HON, function (l, r, log) { rep(l, 8); log('Xác minh thì phát hiện căn cước giả. Báo công an — một đường dây chiếm đoạt nhà bị triệt phá, chủ nhà thật cảm ơn bạn.', 'good'); fx(l, { karma: 4 }); }],
    ['lam', 'Công chứng luôn cho nhanh, khách đông', BAD, function (l, r, log) { trap(l, 'cong_chung_gia'); log('Công chứng xong trong mười phút.', 'neutral'); }]]);
  TR('cong_chung_gia', 0.5, function (l, r, log) { log('Chủ nhà thật khởi kiện: hợp đồng mua bán nhà do bạn công chứng dùng giấy tờ giả. Văn phòng phải bồi thường, bạn bị tạm đình chỉ hành nghề.', 'bad'); pay(l, 80, 'Bồi thường công chứng sai'); if (l.job && E.resolveJob(l.job.id) === 'cong_chung') { l.job = null; l.flags.needJob = true; } });
  J('db_cuoc_thi', ['dau_bep', 'chu_quan_an', 'chu_nha_hang'], 0, 2, 0.1, 6, 'Cuộc thi nấu ăn trên truyền hình', 'Một cuộc thi đầu bếp trên truyền hình tuyển thí sinh. Món tủ của bạn được nhiều người khen.', [
    ['thi', 'Đăng ký thi', RISK, function (l, r, log) { if (ch(r, 0.3)) { fame(l, 2, 3e4); promote(l); log('Vào chung kết cuộc thi! Quán của bạn / nhà hàng nơi bạn làm đông khách hẳn.', 'big'); } else log('Bị loại ở vòng hai vì món ăn quá mặn — run tay nêm nhầm.', 'neutral'); fx(l, { soc: 3 }); }],
    ['khong', 'Thôi, nấu cho khách là đủ', MID, function (l, r, log) { log('Ở lại bếp, ngày ngày nấu cho khách quen.', 'neutral'); }]]);
  J('mu_co_dau', ['makeup', 'tho_toc'], 0, 2, 0.15, 4, 'Mùa cưới', 'Mùa cưới, 3 giờ sáng bạn đã có mặt ở nhà cô dâu. Mẹ cô dâu muốn trang điểm "đậm cho ăn ảnh", cô dâu muốn "trong veo tự nhiên".', [
    ['dung_hoa', 'Dung hòa: lớp nền mỏng, tô đậm mắt môi vừa phải', { w: 1.2 }, function (l, r, log) { rep(l, 5); earn(l, 2, 'Trang điểm cô dâu'); log('Cả hai mẹ con đều hài lòng, ảnh cưới lên rất đẹp. Thêm năm khách đặt lịch.', 'good'); }],
    ['nghe_me', 'Nghe theo mẹ cô dâu', MID, function (l, r, log) { earn(l, 1.5, 'Trang điểm cô dâu'); log('Cô dâu nhìn gương hơi buồn, nhưng vẫn cảm ơn bạn.', 'neutral'); }]]);
  J('xam_tre_vi_thanh_nien', ['tho_xam'], 0, 2, 0.12, 5, 'Khách nhỏ tuổi', 'Một cậu học sinh trông chỉ mười lăm, mười sáu tuổi muốn xăm kín cánh tay, nói "bố mẹ em đồng ý rồi".', [
    ['tu_choi', 'Từ chối, hẹn khi đủ 18 tuổi hoặc có bố mẹ đi cùng', HON, function (l, r, log) { log('Từ chối, khuyên em suy nghĩ thêm. Vài hôm sau mẹ em đến cảm ơn bạn.', 'good'); fx(l, { karma: 3 }); }],
    ['xam', 'Xăm luôn, khách là khách', BAD, function (l, r, log) { earn(l, 3, 'Tiền xăm'); if (ch(r, 0.4)) { rep(l, -10); log('Phụ huynh tìm đến làm ầm, đăng lên mạng. Tiệm vắng khách cả tháng.', 'bad'); } }]]);
  J('spa_danh_gia', ['spa', 'nail', 'barber', 'tho_toc'], 0, 3, 0.15, 4, 'Đánh giá một sao', 'Một khách để lại đánh giá một sao kèm lời lẽ nặng nề trên mạng, dù hôm đó bạn đã làm lại miễn phí cho khách.', [
    ['tra_loi', 'Trả lời lịch sự, giải thích, mời khách quay lại', { w: 1.2 }, function (l, r, log) { rep(l, 4); log('Câu trả lời từ tốn được nhiều người khen, khách cũ vào bênh. Tiệm còn đông hơn.', 'good'); }],
    ['cai', 'Cãi tay đôi trên mạng', { risk: 0.6, w: 0.5 }, function (l, r, log) { rep(l, -8); log('Cãi qua cãi lại thành "drama", tiệm mất khách một thời gian.', 'bad'); }]]);

  // tiền bản quyền âm nhạc hằng năm
  E.HOOKS.year.push(function (l, r, log, a) { if (l.flags.royalty > 0 && l.alive) { var x = V(l, l.flags.royalty) * (0.7 + r() * 0.6); H.cash(l, x, 'Tiền bản quyền tác giả'); if (a >= 70) l.flags.royalty *= 0.9; } });

  // tên ngành học của trường chuyên ngành hiển thị đúng ("ngành Thanh nhạc")
  E.majorName = function (l) { return l.majorName || (l.major && E.MAJORS[l.major]) || ''; };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
