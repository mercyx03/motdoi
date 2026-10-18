/* Một Đời — v2.9: phát triển năng khiếu từ nhỏ. Có năng khiếu (toán, ngoại ngữ, âm nhạc, hội họa, ăn nói, khéo tay, kinh doanh)
   thì được hỏi có muốn theo đuổi không; theo đuổi thì đi thi từng cấp: trường → huyện → tỉnh → quốc gia → quốc tế,
   mỗi cấp có thể ôn luyện hết sức, thi bình thường hoặc bỏ. Thành tích mở ra tuyển thẳng, học bổng, nghề nghiệp. */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function T(id, when, p, cd) { E.TRIG.push({ id: id, when: when, p: p, cd: cd || 0 }); }
  function fx(l, o) { H.fx(l, o); }
  function cashB(l, x, why) { H.cash(l, x * l.base, why); }
  function mb(l, x) { return H.mb(l, x); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped); }
  function yr(l) { return l.birthYear + l.age; }

  // các cấp thi theo năng khiếu: [tên cuộc thi, tuổi từ, tuổi đến, độ khó]
  var TRACK = {
    'toán học': { n: 'toán', club: 'lớp toán nâng cao, câu lạc bộ toán tuổi thơ', st: [
      ['kỳ thi học sinh giỏi toán cấp trường', 8, 11, 0.25], ['kỳ thi học sinh giỏi toán cấp huyện', 10, 13, 0.45], ['kỳ thi học sinh giỏi toán cấp tỉnh', 12, 16, 0.6],
      ['kỳ thi chọn học sinh giỏi quốc gia môn Toán (VMO)', 16, 18, 0.78], ['Olympic Toán học Quốc tế (IMO)', 17, 18, 0.9]] },
    'ngoại ngữ': { n: 'tiếng Anh', club: 'trung tâm tiếng Anh và câu lạc bộ hùng biện tiếng Anh', st: [
      ['cuộc thi tiếng Anh cấp trường', 8, 11, 0.25], ['kỳ thi Olympic tiếng Anh cấp huyện', 10, 13, 0.45], ['kỳ thi học sinh giỏi tiếng Anh cấp tỉnh', 12, 16, 0.6],
      ['kỳ thi học sinh giỏi quốc gia môn tiếng Anh', 16, 18, 0.78], ['cuộc thi hùng biện tiếng Anh quốc tế', 16, 18, 0.88]] },
    'âm nhạc': { n: 'âm nhạc', club: 'lớp thanh nhạc và nhạc cụ ở nhà văn hóa', st: [
      ['hội diễn văn nghệ của trường', 7, 11, 0.2], ['liên hoan tiếng hát thiếu nhi cấp tỉnh', 9, 13, 0.45], ['cuộc thi hát truyền hình dành cho thiếu nhi', 10, 14, 0.7],
      ['cuộc thi tìm kiếm tài năng ca hát toàn quốc', 16, 24, 0.8], ['giải thưởng âm nhạc quốc tế dành cho giọng hát trẻ', 18, 26, 0.9]] },
    'hội họa': { n: 'hội họa', club: 'lớp vẽ ở cung thiếu nhi', st: [
      ['cuộc thi vẽ tranh cấp trường', 7, 11, 0.2], ['cuộc thi vẽ tranh thiếu nhi cấp tỉnh', 9, 13, 0.45], ['cuộc thi vẽ tranh thiếu nhi toàn quốc', 11, 15, 0.65],
      ['triển lãm mỹ thuật trẻ toàn quốc', 16, 24, 0.78], ['cuộc thi vẽ tranh thiếu nhi quốc tế', 12, 16, 0.88]] },
    'ăn nói': { n: 'hùng biện', club: 'câu lạc bộ MC nhí và hùng biện', st: [
      ['cuộc thi kể chuyện cấp trường', 7, 11, 0.2], ['cuộc thi hùng biện cấp huyện', 10, 13, 0.45], ['cuộc thi hùng biện cấp tỉnh', 12, 16, 0.6],
      ['cuộc thi kiến thức truyền hình toàn quốc dành cho học sinh THPT', 16, 18, 0.78], ['cuộc thi hùng biện tiếng Việt khu vực châu Á', 17, 22, 0.88]] },
    'khéo tay': { n: 'sáng tạo kỹ thuật', club: 'câu lạc bộ robot và sáng tạo', st: [
      ['ngày hội sáng tạo của trường', 8, 12, 0.25], ['cuộc thi sáng tạo thanh thiếu niên nhi đồng cấp tỉnh', 10, 15, 0.45], ['cuộc thi khoa học kỹ thuật cấp tỉnh', 13, 17, 0.6],
      ['cuộc thi khoa học kỹ thuật học sinh toàn quốc', 15, 18, 0.75], ['hội chợ khoa học kỹ thuật quốc tế (ISEF)', 16, 18, 0.88]] },
    'kinh doanh': { n: 'khởi nghiệp', club: 'câu lạc bộ khởi nghiệp học sinh', st: [
      ['hội chợ bán hàng của trường', 9, 13, 0.25], ['cuộc thi ý tưởng kinh doanh cấp tỉnh', 12, 16, 0.5], ['cuộc thi khởi nghiệp học sinh toàn quốc', 15, 18, 0.7],
      ['cuộc thi khởi nghiệp sinh viên toàn quốc', 18, 23, 0.8], ['cuộc thi khởi nghiệp sinh viên quốc tế', 19, 24, 0.9]] }
  };
  var PRIZE = ['giải Khuyến khích', 'giải Ba', 'giải Nhì', 'giải Nhất'];
  function track(l) { return TRACK[l.talent] || null; }
  function nk(l) { return l.flags.nk; }
  function stage(l) { var t = track(l), n = nk(l); return t && n && !n.stop && n.lv < t.st.length ? t.st[n.lv] : null; }
  // đúng tuổi của cấp thi hiện tại thì mới được thi
  function canSit(l) { var s = stage(l); return !!(s && l.age >= s[1] && l.age <= s[2] && (l.school || l.age <= 26)); }
  // bắt đầu theo đuổi muộn thì vào thẳng cấp thi hợp với tuổi
  function firstLv(t, a) { for (var i = 0; i < t.st.length; i++) if (a <= t.st[i][2]) return Math.min(i, 2); return t.st.length; }
  function skillOf(l) { return (l.skill || 20) * 0.6 + l.st.kno * 0.4; }

  // 1. phát hiện & quyết định có theo đuổi năng khiếu không
  SC('nk_chon', {
    title: function (l) { return 'Năng khiếu ' + (track(l) ? track(l).n : l.talent); },
    valid: function (l) { return !!track(l) && !nk(l); },
    text: function (l) { var t = track(l); return 'Thầy cô nhận thấy bạn có năng khiếu ' + E.talentText(l) + '. Gợi ý cho bạn theo ' + t.club + ' để đi thi các cấp. Sẽ tốn thêm thời gian và tiền học' + (l.fam.q <= 2 ? ', mà nhà không dư dả.' : '.'); },
    opts: [
      { k: 'yes', l: 'Theo đuổi nghiêm túc, đi thi các cấp', h: function (l) { return (l.fam.q <= 2 ? 'Bố mẹ phải chắt bóp tiền học thêm' : 'Bố mẹ lo tiền học thêm') + ' · mệt hơn, cơ hội lớn hơn'; }, ai: { w: 1.3, amb: 1 }, run: function (l, r, log) { l.flags.nk = { lv: firstLv(track(l), l.age), best: null }; l.skill = Math.min(100, (l.skill || 20) + 8); log('Bắt đầu theo ' + track(l).club + '. Tối nào cũng có bài tập riêng.', 'good'); fx(l, { kno: 2, hap: -1 }); H.mem(l, 'Buổi đầu tiên ở ' + track(l).club + '.', 2); } },
      { k: 'fun', l: 'Chỉ học cho vui, không áp lực thi cử', ai: { w: 1 }, run: function (l, r, log) { l.flags.nk = { lv: 0, stop: true, fun: true }; l.skill = Math.min(100, (l.skill || 20) + 3); log('Giữ năng khiếu như một niềm vui, không đi thi.', 'neutral'); fx(l, { hap: 2 }); } },
      { k: 'no', l: 'Thôi, tập trung học đều các môn', ai: { w: 0.6, smart: 0.4 }, run: function (l, r, log) { l.flags.nk = { lv: 0, stop: true }; log('Gác năng khiếu lại, học đều các môn.', 'neutral'); } }
    ]
  });
  T('nk_chon', function (l, a) { return !!track(l) && !nk(l) && a >= 7 && a <= 12 && free(l); }, 0.5);
  E.MAJOR.nk_chon = 1;

  // 2. từng cấp thi
  SC('nk_thi', {
    title: function (l) { var s = stage(l); return s ? U.cap(s[0]) : 'Kỳ thi'; },
    valid: function (l) { return canSit(l); },
    text: function (l) { var s = stage(l); return 'Bạn được chọn đi thi ' + s[0] + '.' + (nk(l).lv >= 3 ? ' Đây là sân chơi của những người giỏi nhất.' : '') + (l.st.hea < 45 ? ' Dạo này sức khỏe không tốt lắm.' : ''); },
    opts: [
      { k: 'hard', l: 'Ôn luyện hết sức', h: 'Mệt, ít thời gian chơi, cơ hội đạt giải cao nhất', ai: { w: 1.3, amb: 1 }, run: function (l, r, log) { sit(l, r, log, 0.12); fx(l, { hap: -3, hea: -1 }); if (l.mind) l.mind.stress += 6; } },
      { k: 'normal', l: 'Ôn vừa phải, thi bình thường', ai: { w: 1 }, run: function (l, r, log) { sit(l, r, log, 0); } },
      { k: 'skip', l: 'Bỏ không thi, dừng lại ở đây', ai: { w: 0.25 }, run: function (l, r, log) { nk(l).stop = true; log('Quyết định không đi thi nữa, dành thời gian cho việc khác.', 'neutral'); fx(l, { hap: 2 }); } }
    ]
  });
  function sit(l, r, log, bonus) {
    var s = stage(l), n = nk(l), tr = track(l);
    var p = U.clamp(0.35 + (skillOf(l) - 100 * s[3]) / 45 + bonus + (l.st.hea < 40 ? -0.1 : 0), 0.04, 0.92);
    l.skill = Math.min(100, (l.skill || 20) + 3);
    if (!ch(r, p)) { log('Thi ' + s[0] + ' nhưng không có giải. ' + pick(r, ['Về nhà buồn mấy hôm.', 'Thầy động viên: "Năm sau làm lại."', 'Biết thêm mình còn thiếu ở đâu.']), 'neutral'); n.fail = (n.fail || 0) + 1; if (n.fail >= 2) { n.stop = true; log('Sau mấy lần không đạt, bạn dừng việc đi thi.', 'neutral'); } return; }
    var q = U.clamp(Math.floor((p - 0.04) * 4 + r() * 1.5), 0, 3), intl = n.lv === 4;
    var prize = intl ? ['bằng khen', 'huy chương Đồng', 'huy chương Bạc', 'huy chương Vàng'][q] : PRIZE[q];
    log((intl ? 'Giành ' : 'Đạt ') + prize + ' ' + s[0] + '!', q >= 2 || n.lv >= 3 ? 'big' : 'good');
    fx(l, { hap: 4 + q * 2 + n.lv }); n.fail = 0; n.best = { lv: n.lv, q: q, t: s[0], y: yr(l) };
    if (intl && q >= 1) { l.medals.push({ ev: s[0] + ' ' + yr(l), m: q === 3 ? 'vàng' : q === 2 ? 'bạc' : 'đồng', y: yr(l) }); l.fame = (l.fame || 0) + 3e4; H.mem(l, 'Khoảnh khắc được gọi tên nhận ' + prize + ' ' + s[0] + ', lá cờ Việt Nam trên tay.', 8); l.flags.scholar = true; l.uniTier = Math.max(l.uniTier || 1, 1.5); log('Nhiều trường đại học danh tiếng trong và ngoài nước mời bạn với học bổng toàn phần.', 'big'); }
    else if (n.lv === 3 && q >= 1) { l.flags.tuyenThang = true; l.uniTier = Math.max(l.uniTier || 1, 1.35); log('Đạt giải quốc gia — được tuyển thẳng vào đại học.', 'big'); H.mem(l, 'Ngày nhận giấy báo tuyển thẳng đại học nhờ ' + prize + ' quốc gia.', 6); }
    else if (q >= 2 && n.lv <= 2) H.mem(l, prize + ' ' + s[0] + ' — tấm giấy khen bố mẹ treo trang trọng trong nhà.', 3);
    // giải cao thì được vào đội tuyển cấp trên
    if (q >= (n.lv >= 3 ? 1 : 2) && n.lv < tr.st.length - 1) { n.lv++; log('Được chọn vào đội tuyển dự thi ' + tr.st[n.lv][0] + '.', 'good'); }
    // âm nhạc / hội họa / khởi nghiệp: thành tích lớn mở ra con đường nghề nghiệp
    if (n.lv >= 3 && q >= 2 && l.age >= 16) l.flags.nkCareer = l.talent;
  }
  T('nk_thi', function (l) { return canSit(l) && free(l); }, 0.7, 1);
  // mỗi năm luyện tập thì năng khiếu tiến bộ; quá tuổi cấp thi mà chưa lên được thì dừng
  E.HOOKS.year.push(function (l, r, log, a) {
    var n = nk(l), t = track(l); if (!n || !t || n.stop || n.lv >= t.st.length) return;
    l.skill = Math.min(100, (l.skill || 20) + 2 + r() * 2 + (l.focus === 'study' ? 1.5 : 0));
    if (a > t.st[n.lv][2]) { n.stop = true; if (n.lv > 0) log('Hết tuổi dự thi ' + t.st[n.lv][0] + '. Khép lại những năm tháng đi thi ' + t.n + '.', 'neutral'); }
  });

  // 3. thành tích lớn → nghề nghiệp theo năng khiếu
  var CAREER = { 'âm nhạc': ['ca_si', 'Một công ty giải trí mời bạn ký hợp đồng ca sĩ sau thành tích ở cuộc thi.'], 'hội họa': ['tk_thoi_trang', 'Một thương hiệu thời trang mời bạn về làm thiết kế sau triển lãm.'],
    'kinh doanh': ['kd_tu_do', 'Một quỹ đầu tư muốn rót vốn cho dự án khởi nghiệp của bạn.'], 'ăn nói': ['mc_tv', 'Đài truyền hình mời bạn thử vai trò dẫn chương trình.'], 'khéo tay': ['ky_su', 'Một tập đoàn công nghệ mời bạn về làm kỹ sư sau cuộc thi.'] };
  SC('nk_nghe', {
    title: 'Cơ hội từ năng khiếu', valid: function (l) { return !!(l.flags.nkCareer && CAREER[l.flags.nkCareer] && !l.school && !(l.job && E.resolveJob(l.job.id) === CAREER[l.flags.nkCareer][0])); },
    text: function (l) { return CAREER[l.flags.nkCareer][1]; },
    opts: [
      { k: 'yes', l: function (l) { return 'Nhận lời: ' + E.jobLabel(CAREER[l.flags.nkCareer][0]); }, ai: { w: 1.3, amb: 1 }, run: function (l, r, log) { var id = CAREER[l.flags.nkCareer][0]; l.flags.nkCareer = null; E.startJob(l, id, r, log); if (E.CAR[id].fame) l.fame = Math.max(l.fame || 0, 3e4); } },
      { k: 'no', l: 'Cảm ơn, mình chọn con đường khác', ai: { w: 0.6 }, run: function (l, r, log) { l.flags.nkCareer = null; log('Từ chối lời mời, giữ năng khiếu như một kỷ niệm đẹp.', 'neutral'); } }
    ]
  });
  T('nk_nghe', function (l, a) { return !!(l.flags.nkCareer && CAREER[l.flags.nkCareer]) && a >= 17 && !l.school && free(l); }, 0.6);

  // tuyển thẳng: được vào đại học không cần thi (giữ tương thích với điểm thi THPT)
  E.HOOKS.gradUpper.push(function (l, r, log) { if (l.flags.tuyenThang && l.edu >= 3 && l.examScore != null && l.examScore < 27) { l.examScore = 27; l.flags.scholar = true; l.flags.admitDirect = true; log('Nhờ giải quốc gia, bạn được tuyển thẳng mà không cần xét điểm thi.', 'good'); } });

  // đã theo đội tuyển năng khiếu thì không gặp thêm lời mời "đội tuyển học sinh giỏi" chung chung
  if (E.DEC.thi_hsg) { var hv = E.DEC.thi_hsg.valid; E.DEC.thi_hsg.valid = function (l, d) { return !(nk(l) && !nk(l).stop && /toán học|ngoại ngữ/.test(l.talent || '')) && (!hv || hv(l, d)); }; }
  E.talentTrack = { TRACK: TRACK, stage: stage, canSit: canSit, sit: sit };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
