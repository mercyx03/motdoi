/* Một Đời — v3.9 (góp ý của người chơi):
   · đại học: ngành thường 4 năm; Bách khoa (kỹ sư), Kiến trúc 5 năm; Dược 5 năm; Y đa khoa, Răng – Hàm – Mặt, Y học cổ truyền 6 năm; Quân y 7 năm; cao đẳng 2 năm
   · năm cuối phải bảo vệ đồ án / khóa luận: có thể rớt và bảo vệ lại; sinh viên Bách khoa hay "dính" 1–2 lần (trừ khi học rất giỏi)
   · học Y: chọn hướng (đa khoa, răng hàm mặt, y học cổ truyền, dược, điều dưỡng, quân y), đi thực tập ở bệnh viện lớn theo nơi học, thi bác sĩ nội trú,
     ra trường chọn chuyên khoa (thu nhập khác nhau: răng hàm mặt, chỉnh hình, thẩm mỹ cao hơn…), giàu thì mở phòng khám theo chuyên môn
   · đi làm: nhật ký tự ghi số liệu nghề (đã khám bao nhiêu lượt, mổ bao nhiêu ca, dạy bao nhiêu khóa, chạy bao nhiêu chuyến…) — không phải lựa chọn
   · thực tập cuối khóa cho các ngành khác (có thể được giữ lại làm việc) */
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
  function jid(l) { return l.job ? E.resolveJob(l.job.id) : ''; }
  function rk(l) { return l.job ? l.job.rank || 0 : 0; }
  function fmt(n) { return U.fmtNum(Math.round(n)); }
  function city(l) { return l.uniCity || ''; }
  function north(c) { return /Hà Nội|Hải Phòng|Thái Nguyên|Nam Định|Bắc Ninh/.test(c); }
  function studying(l) { return l.school === 'uni' || (l.school === 'abroad' && l.abroad && l.abroad.study); }

  // ===================================================================
  // 1. TÊN TRƯỜNG & SỐ NĂM HỌC THEO NGÀNH
  // ===================================================================
  var LOCAL = { 'Huế': 'Đại học Huế', 'Đà Nẵng': 'Đại học Đà Nẵng', 'Cần Thơ': 'Trường Đại học Cần Thơ', 'Thái Nguyên': 'Đại học Thái Nguyên', 'Vinh': 'Trường Đại học Vinh', 'Quy Nhơn': 'Trường Đại học Quy Nhơn', 'Hải Phòng': 'Trường Đại học Hải Phòng', 'Thanh Hóa': 'Trường Đại học Hồng Đức', 'Đà Lạt': 'Trường Đại học Đà Lạt', 'Buôn Ma Thuột': 'Trường Đại học Tây Nguyên', 'Nha Trang': 'Trường Đại học Nha Trang' };
  function uniFor(l, k, r) {
    var c = city(l), hn = /Hà Nội/.test(c), sg = /Hồ Chí Minh/.test(c), strong = (l.examScore != null ? l.examScore >= 24 : l.st.kno >= 66);
    if (!isVN(l) || l.school === 'abroad') return null;
    if (k === 'it') return hn ? (strong ? 'Đại học Bách khoa Hà Nội' : pick(r, ['Trường Đại học Công nghiệp Hà Nội', 'Học viện Công nghệ Bưu chính Viễn thông', 'Trường Đại học Thủy lợi'])) : sg ? (strong ? 'Trường Đại học Bách khoa – ĐHQG TP.HCM' : pick(r, ['Trường Đại học Công nghiệp TP.HCM', 'Trường Đại học Sư phạm Kỹ thuật TP.HCM', 'Trường Đại học Công nghệ Thông tin – ĐHQG TP.HCM'])) : /Đà Nẵng/.test(c) && strong ? 'Trường Đại học Bách khoa – Đại học Đà Nẵng' : LOCAL[c] || 'trường đại học ở ' + c;
    if (k === 'eco') return hn ? pick(r, strong ? ['Trường Đại học Kinh tế Quốc dân', 'Trường Đại học Ngoại thương', 'Học viện Tài chính'] : ['Học viện Ngân hàng', 'Trường Đại học Thương mại']) : sg ? pick(r, strong ? ['Trường Đại học Kinh tế TP.HCM', 'Trường Đại học Kinh tế – Luật'] : ['Trường Đại học Tài chính – Marketing', 'Trường Đại học Ngân hàng TP.HCM']) : LOCAL[c] || 'trường đại học ở ' + c;
    if (k === 'law') return hn ? pick(r, ['Trường Đại học Luật Hà Nội', 'Học viện Báo chí và Tuyên truyền', 'Trường Đại học Khoa học Xã hội và Nhân văn']) : sg ? pick(r, ['Trường Đại học Luật TP.HCM', 'Trường Đại học Khoa học Xã hội và Nhân văn TP.HCM']) : LOCAL[c] || 'trường đại học ở ' + c;
    if (k === 'edu') return hn ? 'Trường Đại học Sư phạm Hà Nội' : sg ? 'Trường Đại học Sư phạm TP.HCM' : /Huế/.test(c) ? 'Trường Đại học Sư phạm – Đại học Huế' : LOCAL[c] || 'trường đại học ở ' + c;
    if (k === 'art') return hn ? pick(r, ['Trường Đại học Kiến trúc Hà Nội', 'Trường Đại học Mỹ thuật Công nghiệp']) : sg ? pick(r, ['Trường Đại học Kiến trúc TP.HCM', 'Trường Đại học Mỹ thuật TP.HCM']) : LOCAL[c] || 'trường đại học ở ' + c;
    return LOCAL[c] || null;
  }
  function medUni(l, track) {
    var c = city(l);
    if (!isVN(l) || l.school === 'abroad') return null;
    if (track === 'qy') return 'Học viện Quân y';
    if (track === 'duoc') return /Hà Nội/.test(c) ? 'Trường Đại học Dược Hà Nội' : /Hồ Chí Minh/.test(c) ? 'Đại học Y Dược TP.HCM' : 'Trường Đại học Y Dược ' + (c || 'Huế');
    if (track === 'yhct') return /Hà Nội/.test(c) ? 'Học viện Y Dược học cổ truyền Việt Nam' : /Hồ Chí Minh/.test(c) ? 'Đại học Y Dược TP.HCM' : 'Trường Đại học Y Dược ' + (c || 'Huế');
    return /Hà Nội/.test(c) ? 'Trường Đại học Y Hà Nội' : /Hồ Chí Minh/.test(c) ? 'Đại học Y Dược TP.HCM' : /Huế/.test(c) ? 'Trường Đại học Y Dược Huế' : /Cần Thơ/.test(c) ? 'Trường Đại học Y Dược Cần Thơ' : /Thái Nguyên/.test(c) ? 'Trường Đại học Y Dược Thái Nguyên' : /Hải Phòng/.test(c) ? 'Trường Đại học Y Dược Hải Phòng' : 'trường y ở ' + (c || 'tỉnh');
  }
  function isBK(l) { return /Bách khoa/.test(l.uniName || (l.flags.tSchool && l.flags.tSchool.n) || ''); }
  var ma0 = E.DEC.major.apply;
  E.DEC.major.apply = function (l, d, k, r, log) {
    var x = ma0.apply(this, arguments);
    l.uniName = uniFor(l, k, r); l.flags.gradTries = 0; l.flags.gradOK = false;
    if (k === 'med') { l.schoolEnd = l.age + 6; l.pending.unshift(E.DEC.nganh_y.make(l, r)); return x; }
    var yrs = (k === 'it' && isBK(l)) || (k === 'art' && /Kiến trúc/.test(l.uniName || '')) ? 5 : 4;
    l.schoolEnd = l.age + yrs; if (l.abroad && l.abroad.study) l.abroad.until = l.schoolEnd;
    if (l.uniName) log('Trường: ' + l.uniName + ' — chương trình ' + yrs + ' năm' + (yrs === 5 ? (k === 'it' ? ' (kỹ sư)' : ' (kiến trúc sư)') : '') + '.', 'neutral');
    return x;
  };

  // ===================================================================
  // 2. NGÀNH Y
  // ===================================================================
  var TRACK = {
    dk: { n: 'Y khoa (bác sĩ đa khoa)', y: 6, job: 'bac_si', d: '6 năm · ra trường thực hành 18 tháng mới có chứng chỉ hành nghề' },
    rhm: { n: 'Răng – Hàm – Mặt', y: 6, job: 'nha_si', d: '6 năm · điểm chuẩn rất cao · ra trường thu nhập cao' },
    yhct: { n: 'Y học cổ truyền', y: 6, job: 'bac_si', spec: 'yhct', d: '6 năm · châm cứu, bốc thuốc, phục hồi chức năng' },
    duoc: { n: 'Dược học', y: 5, job: 'duoc_si', d: '5 năm · làm bệnh viện, công ty dược, mở nhà thuốc' },
    dd: { n: 'Điều dưỡng', y: 4, job: 'dieu_duong', d: '4 năm · dễ xin việc, vất vả, lương thấp hơn bác sĩ' },
    qy: { n: 'Bác sĩ quân y', y: 7, job: 'bac_si', d: '7 năm ở Học viện Quân y · kỷ luật quân đội, ra trường làm ở bệnh viện quân đội' }
  };
  E.MED_TRACK = TRACK;
  SC('nganh_y', {
    title: 'Học ngành gì trong khối Y?', valid: function (l) { return studying(l) && l.major === 'med'; },
    text: function (l) { return 'Bạn đỗ khối ngành sức khỏe. Mỗi hướng học số năm khác nhau, cơ hội nghề nghiệp cũng khác nhau.'; },
    opts: Object.keys(TRACK).map(function (k) {
      var t = TRACK[k];
      return { k: k, l: t.n, h: t.d, req: function (l) { return k !== 'qy' || (isVN(l) && l.st.hea >= 55); }, ai: { w: k === 'dk' ? 1.4 : k === 'rhm' ? 0.6 : k === 'qy' ? 0.3 : 0.8 },
        run: function (l, r, log) { l.med = { track: k, spec: t.spec || (k === 'rhm' ? 'rhm' : null) }; l.majorName = t.n; l.schoolEnd = l.age + t.y; if (l.abroad && l.abroad.study) l.abroad.until = l.schoolEnd; l.uniName = medUni(l, k) || l.uniName; if (k === 'qy') { l.flags.milDone = true; l.uniCity = 'Hà Nội'; }
          log('Vào học ' + t.n + (l.uniName ? ' ở ' + l.uniName : '') + ' — ' + t.y + ' năm đèn sách.', 'good'); } };
    })
  });
  E.MAJOR && (E.MAJOR.nganh_y = 1);
  // bệnh viện thực hành theo nơi học
  function hospitals(l) {
    var c = city(l), t = l.med && l.med.track;
    if (!isVN(l) || l.school === 'abroad') return ['bệnh viện đại học', 'bệnh viện thành phố'];
    if (t === 'qy') return ['Bệnh viện Trung ương Quân đội 108', 'Bệnh viện Quân y 103'];
    if (t === 'rhm') return /Hồ Chí Minh/.test(c) ? ['Bệnh viện Răng Hàm Mặt Trung ương TP.HCM', 'Bệnh viện Răng Hàm Mặt TP.HCM'] : ['Bệnh viện Răng Hàm Mặt Trung ương Hà Nội', 'Bệnh viện Đại học Y Hà Nội'];
    if (/Hà Nội/.test(c)) return ['Bệnh viện Bạch Mai', 'Bệnh viện Hữu nghị Việt Đức', 'Bệnh viện K', 'Bệnh viện Nhi Trung ương', 'Bệnh viện Phụ sản Trung ương'];
    if (/Hồ Chí Minh/.test(c)) return ['Bệnh viện Chợ Rẫy', 'Bệnh viện Từ Dũ', 'Bệnh viện Nhi Đồng 1', 'Bệnh viện Đại học Y Dược TP.HCM', 'Bệnh viện Nhân dân 115'];
    if (/Huế/.test(c)) return ['Bệnh viện Trung ương Huế'];
    if (/Cần Thơ/.test(c)) return ['Bệnh viện Đa khoa Trung ương Cần Thơ'];
    if (/Thái Nguyên/.test(c)) return ['Bệnh viện Trung ương Thái Nguyên'];
    if (/Hải Phòng/.test(c)) return ['Bệnh viện Hữu nghị Việt Tiệp'];
    if (/Đà Nẵng/.test(c)) return ['Bệnh viện Đà Nẵng'];
    return ['bệnh viện đa khoa tỉnh'];
  }
  E.medHospitals = hospitals;
  function workPlace(l, r) {
    var c = city(l), sp = l.med && l.med.spec, hn = /Hà Nội/.test(c) || !/Hồ Chí Minh/.test(c) && north(c);
    if (l.med.track === 'duoc') return pick(r, isVN(l) && !(l.abroad && l.abroad.perm) ? ['khoa Dược của bệnh viện tỉnh', 'một công ty dược', 'chuỗi nhà thuốc lớn'] : ['một chuỗi nhà thuốc', 'một công ty dược']);
    if (!isVN(l) || (l.abroad && l.abroad.perm)) return 'bệnh viện thành phố';
    if (l.med.track === 'qy') return pick(r, hn ? ['Bệnh viện Trung ương Quân đội 108', 'Bệnh viện Quân y 103'] : ['Bệnh viện Quân y 175']);
    var M = { san: hn ? 'Bệnh viện Phụ sản Trung ương' : 'Bệnh viện Từ Dũ', nhi: hn ? 'Bệnh viện Nhi Trung ương' : 'Bệnh viện Nhi Đồng 1', ubuou: hn ? 'Bệnh viện K' : 'Bệnh viện Ung bướu TP.HCM', yhct: hn ? 'Bệnh viện Y học cổ truyền Trung ương' : 'Bệnh viện Y học cổ truyền TP.HCM', tamthan: hn ? 'Bệnh viện Tâm thần Trung ương 1' : 'Bệnh viện Tâm thần TP.HCM', dalieu: hn ? 'Bệnh viện Da liễu Trung ương' : 'Bệnh viện Da liễu TP.HCM', rhm: hn ? 'Bệnh viện Răng Hàm Mặt Trung ương Hà Nội' : 'Bệnh viện Răng Hàm Mặt Trung ương TP.HCM', chinhhinh: hn ? 'Bệnh viện Hữu nghị Việt Đức' : 'Bệnh viện Chấn thương Chỉnh hình TP.HCM', tim: hn ? 'Viện Tim mạch – Bệnh viện Bạch Mai' : 'Viện Tim TP.HCM' };
    if (sp && M[sp]) return M[sp];
    if (l.med.track === 'duoc') return pick(r, ['khoa Dược của bệnh viện tỉnh', 'một công ty dược', 'chuỗi nhà thuốc lớn']);
    if (l.med.track === 'dd') return pick(r, hospitals(l));
    return pick(r, hn ? ['Bệnh viện Bạch Mai', 'Bệnh viện Hữu nghị Việt Đức', 'Bệnh viện đa khoa tỉnh'] : ['Bệnh viện Chợ Rẫy', 'Bệnh viện Nhân dân 115', 'Bệnh viện đa khoa tỉnh']);
  }
  var YT = [
    ['dem', 'Ca trực đêm đầu tiên', function (l, h) { return 'Lần đầu trực đêm ở khoa Cấp cứu ' + h + ': xe cấp cứu về liên tục, bác sĩ hướng dẫn giao bạn theo dõi ba bệnh nhân nặng.'; }, [
      ['hoc', 'Chạy theo bác sĩ, hỏi từng ca, ghi chép đến sáng', { w: 1.2, smart: 1 }, function (l, r, log, h) { fx(l, { kno: 3, hea: -2 }); log('Thức trắng đêm ở ' + h + ', học được nhiều hơn cả một học kỳ trên giảng đường.', 'good'); H.mem(l, 'Ca trực đêm đầu tiên ở ' + h + '.', 4); }],
      ['ngu', 'Tranh thủ chợp mắt ở phòng trực', { w: 0.6 }, function (l, r, log) { log('Chợp mắt được một lúc thì bị gọi dậy, bác sĩ nhắc khéo "trực là phải tỉnh".', 'neutral'); }]]],
    ['mo', 'Lần đầu vào phòng mổ', function (l, h) { return 'Bạn được vào phòng mổ ở ' + h + ' quan sát một ca mổ bụng. Mùi thuốc sát trùng, ánh đèn mổ chói chang…'; }, [
      ['xem', 'Đứng sát bàn mổ, quan sát kỹ', { w: 1 }, function (l, r, log) { if (ch(r, 0.25)) { log('Đứng được nửa tiếng thì choáng váng, ngã ngồi xuống sàn — "nghi lễ" của sinh viên y năm đầu đi viện. Hôm sau quay lại đứng hết ca.', 'neutral'); } else { log('Đứng hết ca mổ bốn tiếng, mắt không rời phẫu trường. Từ đó mê ngoại khoa.', 'good'); l.flags.yNgoai = true; } fx(l, { kno: 2 }); }],
      ['sau', 'Đứng phía sau cho an toàn', { w: 0.8 }, function (l, r, log) { log('Đứng phía sau quan sát, ghi chép từng bước.', 'neutral'); fx(l, { kno: 1 }); }]]],
    ['mat', 'Bệnh nhân đầu tiên ra đi', function (l, h) { return 'Một cụ ông bạn chăm suốt tuần thực tập ở ' + h + ' không qua khỏi. Gia đình cụ khóc ngoài hành lang.'; }, [
      ['o_lai', 'Ở lại an ủi gia đình cụ', { w: 1.2, soc: 1 }, function (l, r, log) { log('Ở lại bên gia đình cụ. Bác sĩ hướng dẫn vỗ vai: "Làm nghề này, phải học cách đứng vững."', 'neutral'); fx(l, { karma: 3, hap: -4 }); H.mem(l, 'Lần đầu tiễn một bệnh nhân ra đi trong đời làm y.', 5); }],
      ['ve', 'Lặng lẽ về phòng trọ khóc một mình', { w: 0.8 }, function (l, r, log) { log('Về phòng trọ khóc cả đêm, rồi sáng mai vẫn đến viện đúng giờ.', 'neutral'); fx(l, { hap: -5 }); }]]],
    ['nha', 'Người nhà bệnh nhân', function (l, h) { return 'Ở ' + h + ', người nhà một bệnh nhân quát tháo vì phải chờ lâu, chỉ thẳng mặt bạn: "Sinh viên thì biết gì!"'; }, [
      ['binh_tinh', 'Bình tĩnh giải thích, mời bác sĩ phụ trách ra', { w: 1.2 }, function (l, r, log) { log('Giữ bình tĩnh giải thích, người nhà dịu lại. Bác sĩ khen bạn biết cách giao tiếp.', 'good'); fx(l, { soc: 2 }); }],
      ['cai', 'Cãi lại', { risk: 0.6, w: 0.4 }, function (l, r, log) { log('Cãi lại, bị khoa nhắc nhở, viết bản tường trình.', 'bad'); fx(l, { hap: -3 }); }]]],
    ['cap_cuu', 'Ca cấp cứu', function (l, h) { return 'Đang trực ở ' + h + ', một bệnh nhân ngừng tim ngay trước mặt bạn, bác sĩ chưa kịp tới.'; }, [
      ['ep_tim', 'Ép tim ngay như đã học', { w: 1.2 }, function (l, r, log) { if (ch(r, 0.5)) { log('Ép tim liên tục đến khi kíp cấp cứu tới — bệnh nhân có mạch trở lại. Cả khoa nhắc tên bạn.', 'big'); fx(l, { karma: 5, hap: 6 }); H.mem(l, 'Lần đầu tự tay giành lại sự sống cho một người.', 7); } else { log('Ép tim đến khi kíp cấp cứu tới, nhưng bệnh nhân không qua khỏi. Bác sĩ bảo bạn đã làm đúng.', 'neutral'); fx(l, { kno: 2 }); } }],
      ['goi', 'Bấm chuông báo động, chạy gọi bác sĩ', { w: 0.8 }, function (l, r, log) { log('Chạy gọi bác sĩ, kíp cấp cứu tới kịp.', 'neutral'); }]]]
  ];
  YT.forEach(function (x) {
    var forDuoc = x[0] === 'nha';
    SC('yt_' + x[0], { title: x[1] + ' (sinh viên y)', valid: function (l) { return studying(l) && l.major === 'med' && (forDuoc || !(l.med && l.med.track === 'duoc')); },
      prep: function (l, r) { return { h: pick(r, hospitals(l)) }; }, text: function (l, d) { return x[2](l, d.h); },
      opts: x[3].map(function (o) { return { k: o[0], l: o[1], ai: o[2], run: function (l, r, log, d) { o[3](l, r, log, d.h); } }; }) });
    E.TRIG.push({ id: 'yt_' + x[0], when: function (l) { return free(l) && studying(l) && l.major === 'med' && (forDuoc || !(l.med && l.med.track === 'duoc')) && l.schoolEnd - l.age <= 4; }, p: 0.22, cd: 1, max: 1 });
  });
  // thi bác sĩ nội trú (năm cuối, học giỏi)
  SC('noi_tru', {
    title: 'Thi bác sĩ nội trú', valid: function (l) { return studying(l) && l.major === 'med' && l.med && /^(dk|rhm|yhct|qy)$/.test(l.med.track); },
    text: function (l) { return 'Năm cuối, bạn có thể thi bác sĩ nội trú — kỳ thi khó nhất ngành y, chỉ dành cho sinh viên giỏi. Đỗ thì học thêm 3 năm, ra trường có chuyên môn vững, được các bệnh viện lớn săn đón.'; },
    opts: [
      { k: 'thi', l: 'Dốc sức ôn thi nội trú', ai: { w: 1, amb: 1, smart: 1 }, run: function (l, r, log) { if (ch(r, Math.max(0.05, (l.st.kno - 60) / 60))) { l.flags.noiTru = true; l.schoolEnd += 3; if (l.abroad && l.abroad.study) l.abroad.until = l.schoolEnd; log('Đỗ bác sĩ nội trú! Thêm 3 năm "cày" ở bệnh viện, nhưng con đường chuyên môn rộng mở.', 'big'); H.mem(l, 'Ngày có tên trong danh sách trúng tuyển bác sĩ nội trú.', 6); fx(l, { hap: 8 }); } else { log('Trượt nội trú, ra trường theo con đường thông thường.', 'neutral'); fx(l, { hap: -3 }); } } },
      { k: 'khong', l: 'Không thi, ra trường đi làm sớm', ai: { w: 0.8 }, run: function (l, r, log) { log('Không thi nội trú, chuẩn bị ra trường đi làm.', 'neutral'); } }
    ]
  });
  E.TRIG.push({ id: 'noi_tru', when: function (l) { return free(l) && studying(l) && l.major === 'med' && l.med && /^(dk|rhm|yhct|qy)$/.test(l.med.track) && l.schoolEnd - l.age === 1 && !l.flags.noiTru && l.st.kno >= 62; }, p: 0.85, cd: 1, max: 1 });
  // chuyên khoa → thu nhập
  var SPEC = {
    noi: ['Nội khoa', 1, 0], ngoai: ['Ngoại khoa', 1.15, 1], nhi: ['Nhi khoa', 0.95, 0], san: ['Sản phụ khoa', 1.2, 1], tim: ['Tim mạch', 1.3, 0], cdha: ['Chẩn đoán hình ảnh', 1.2, 0],
    gmhs: ['Gây mê hồi sức', 1.2, 1], dalieu: ['Da liễu', 1.4, 0], chinhhinh: ['Chấn thương chỉnh hình', 1.5, 1], thammy: ['Phẫu thuật thẩm mỹ', 1.8, 1], tamthan: ['Tâm thần', 0.9, 0], ubuou: ['Ung bướu', 1.15, 0],
    yhct: ['Y học cổ truyền', 0.9, 0], rhm: ['Răng – Hàm – Mặt', 1, 1]
  };
  E.MED_SPEC = SPEC;
  SC('chuyen_khoa', {
    title: 'Chọn chuyên khoa', valid: function (l) { return !!(l.med && !l.med.spec && /^(dk|qy)$/.test(l.med.track)); },
    prep: function (l, r) { var ks = Object.keys(SPEC).filter(function (k) { return !/^(yhct|rhm)$/.test(k); }); for (var i = ks.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = ks[i]; ks[i] = ks[j]; ks[j] = t; } if (l.flags.yNgoai && ks.indexOf('ngoai') > 5) { ks.splice(ks.indexOf('ngoai'), 1); ks.unshift('ngoai'); } return { ks: ks.slice(0, 6) }; },
    text: function (l) { return 'Ra trường, bạn phải chọn chuyên khoa để theo cả đời. Mỗi chuyên khoa một áp lực, một mức thu nhập.' + (l.flags.noiTru ? ' Là bác sĩ nội trú, bạn được ưu tiên chọn.' : ''); },
    opts: [0, 1, 2, 3, 4, 5].map(function (i) {
      return { k: 's' + i, l: function (l, d) { var s = SPEC[d.ks[i]]; return s ? s[0] : ''; }, h: function (l, d) { var s = SPEC[d.ks[i]]; return s ? (s[1] >= 1.4 ? 'thu nhập cao' : s[1] >= 1.15 ? 'thu nhập khá' : s[1] < 1 ? 'thu nhập thấp hơn, ít người theo' : 'thu nhập trung bình') + (s[2] ? ' · nhiều ca mổ, áp lực cao' : ' · khám, điều trị') : ''; }, req: function (l, d) { return !!d.ks[i]; }, ai: { w: 1 },
        run: function (l, r, log, d) { var k = d.ks[i]; l.med.spec = k; log('Chọn chuyên khoa ' + SPEC[k][0] + ', về công tác ở ' + workPlace(l, r) + '. Thực hành 18 tháng để được cấp chứng chỉ hành nghề.', 'good'); } };
    })
  });
  // ra trường: vào nghề theo hướng đã học
  E.HOOKS.year.push(function (l, r, log, a) {
    if (!l.med || l.med.out || studying(l)) return;
    if (l.edu < 5 || (l.abroad && l.abroad.study)) return; l.med.out = true;
    if (l.job) return;
    var t = TRACK[l.med.track]; if (!t) return;
    l.flags.needJob = false;
    E.startJob(l, t.job, r, log);
    if (l.flags.noiTru && l.job && l.job.rank < 1) l.job.rank = 1;
    if (!l.med.spec && /^(dk|qy)$/.test(l.med.track)) { l.pending.push(E.DEC.chuyen_khoa.make(l, r)); return; }
    log('Về công tác ở ' + workPlace(l, r) + (t.job === 'bac_si' || t.job === 'nha_si' ? '. Thực hành 18 tháng để được cấp chứng chỉ hành nghề.' : '.'), 'neutral');
  });
  // thu nhập theo chuyên khoa
  var cy0 = E.careerYear;
  E.careerYear = function (l) { var inc = cy0.apply(this, arguments); if (inc > 0 && l.med && l.med.spec && /^(bac_si|phong_kham)$/.test(jid(l)) && SPEC[l.med.spec]) inc *= SPEC[l.med.spec][1]; return inc; };
  // mở phòng khám theo chuyên môn
  SC('mo_phong_kham_ck', {
    title: 'Mở phòng khám riêng', valid: function (l) { return (jid(l) === 'bac_si' && rk(l) >= 2) || (jid(l) === 'nha_si' && rk(l) === 1); },
    text: function (l) { var s = l.med && SPEC[l.med.spec]; return 'Có tiếng trong nghề, bệnh nhân quen đông. Mở một phòng khám ' + (jid(l) === 'nha_si' ? 'nha khoa' : s ? 'chuyên khoa ' + s[0].toLowerCase() : 'tư') + ' cần khoảng ' + mo(l, V(l, 2500)) + ' (thuê mặt bằng, máy móc, giấy phép).'; },
    opts: [
      { k: 'mo', l: 'Mở phòng khám', h: function (l) { return '~' + mo(l, V(l, 2500)); }, req: function (l) { return l.money >= V(l, 1200); }, ai: { w: 1, amb: 1, risk: 0.5 }, run: function (l, r, log) {
        H.cash(l, -V(l, 2500), 'Mở phòng khám'); var s = l.med && SPEC[l.med.spec];
        if (jid(l) === 'nha_si') { l.job.rank = 2; log('Khai trương phòng khám nha khoa riêng — niềng răng, trồng răng implant, bọc sứ.', 'big'); }
        else { E.startJob(l, 'phong_kham', r, log); l.job.p = 'phòng khám ' + (s ? 'chuyên khoa ' + s[0].toLowerCase() : 'đa khoa'); log('Khai trương ' + l.job.p + ' của riêng mình. Ngày đầu đã kín lịch hẹn.', 'big'); }
        H.mem(l, 'Ngày cắt băng khánh thành phòng khám mang tên mình.', 7); fx(l, { hap: 8 }); } },
      { k: 'khong', l: 'Ở lại bệnh viện, chuyên tâm chuyên môn', ai: { w: 0.8 }, run: function (l, r, log) { log('Ở lại bệnh viện, tiếp tục cống hiến cho chuyên môn.', 'neutral'); } }
    ]
  });
  E.TRIG.push({ id: 'mo_phong_kham_ck', when: function (l, a) { return free(l) && ((jid(l) === 'bac_si' && rk(l) >= 2) || (jid(l) === 'nha_si' && rk(l) === 1)) && a >= 33 && a <= 60 && l.money >= V(l, 1200); }, p: 0.15, cd: 4, max: 2 });

  // ===================================================================
  // 3. BẢO VỆ ĐỒ ÁN / KHÓA LUẬN TỐT NGHIỆP
  // ===================================================================
  function passP(l) {
    var k = l.st.kno, bk = isBK(l), med = l.major === 'med';
    var p = bk ? (k >= 80 ? 0.85 : k >= 70 ? 0.6 : 0.45) : med ? (k >= 70 ? 0.92 : 0.78) : (k >= 60 ? 0.93 : k >= 45 ? 0.82 : 0.68);
    if ((l.flags.gradTries || 0) >= 1) p += 0.2; if ((l.flags.gradTries || 0) >= 2) p += 0.3;
    return Math.min(0.98, p);
  }
  function thesisName(l) { return l.major === 'med' ? 'thi tốt nghiệp bác sĩ (lý thuyết, lâm sàng)' : isBK(l) || l.major === 'it' || /Kiến trúc/.test(l.uniName || '') ? 'đồ án tốt nghiệp' : 'khóa luận tốt nghiệp'; }
  SC('bao_ve_tn', {
    title: function (l) { return 'Bảo vệ ' + thesisName(l); }, valid: function (l) { return studying(l) && l.schoolEnd != null && l.age + 1 >= l.schoolEnd; },
    text: function (l) { return 'Năm cuối ' + (l.uniName || 'đại học') + ': chỉ còn ' + thesisName(l) + ' là ra trường.' + (isBK(l) ? ' Sinh viên Bách khoa vẫn truyền tai nhau: "ra trường đúng hạn là kỳ tích".' : '') + ((l.flags.gradTries || 0) ? ' Đây là lần bảo vệ lại thứ ' + l.flags.gradTries + '.' : ''); },
    opts: [
      { k: 'doc_suc', l: 'Dốc sức làm, thức đêm chỉnh sửa theo góp ý thầy', ai: { w: 1.2, amb: 1, smart: 0.8 }, run: function (l, r, log) { defend(l, r, log, 0.08); fx(l, { hea: -1 }); } },
      { k: 'vua', l: 'Làm vừa sức, kịp hạn là được', ai: { w: 1 }, run: function (l, r, log) { defend(l, r, log, -0.03); } },
      { k: 'thue', l: 'Thuê người làm hộ đồ án / khóa luận', ai: { bad: 1.2, risk: 0.6, w: 0.3 }, run: function (l, r, log) { H.cash(l, -V(l, 8), 'Thuê làm đồ án'); fx(l, { karma: -4 }); if (ch(r, 0.35)) { log('Hội đồng hỏi vài câu là lộ: bạn không hiểu chính bài của mình. Bị đánh trượt, còn bị nhắc nhở kỷ luật.', 'bad'); fail(l, log); } else { log('Bảo vệ trót lọt bằng bài thuê người làm — tấm bằng có, nhưng kiến thức thì không.', 'neutral'); l.flags.gradOK = true; l.st.kno -= 3; } } }
    ]
  });
  E.TRIG.push({ id: 'bao_ve_tn', when: function (l, a) { return free(l) && studying(l) && l.schoolEnd != null && a + 1 >= l.schoolEnd && l.flags.gradTry !== a && !l.flags.gradOK; }, p: 1, cd: 1, rep: true });
  E.MAJOR && (E.MAJOR.bao_ve_tn = 1);
  function defend(l, r, log, b) {
    l.flags.gradTry = l.age;
    if (ch(r, passP(l) + b)) { l.flags.gradOK = true; log('Bảo vệ ' + thesisName(l) + ' thành công' + (l.st.kno >= 75 ? ', hội đồng chấm điểm xuất sắc' : '') + '!', 'good'); fx(l, { hap: 5 }); }
    else { log(pick(r, ['Bảo vệ ' + thesisName(l) + ' thất bại: hội đồng chỉ ra hàng loạt lỗi trong bài, phải làm lại.', 'Rớt tốt nghiệp — phần demo chạy lỗi ngay trước hội đồng.', 'Không qua được buổi bảo vệ, thầy hướng dẫn động viên: "Năm sau làm lại cho chắc."']), 'bad'); fail(l, log); }
  }
  function fail(l, log) { l.flags.gradTries = (l.flags.gradTries || 0) + 1; l.flags.gradTry = l.age; l.flags.gradOK = false; l.schoolEnd = l.age + 2; if (l.abroad && l.abroad.study) l.abroad.until = l.schoolEnd; fx(l, { hap: -6 }); if (l.mind) l.mind.stress = Math.min(100, l.mind.stress + 8); log('Phải học thêm một năm để bảo vệ lại' + (l.flags.gradTries >= 2 ? ' (lần thứ ' + (l.flags.gradTries + 1) + ')' : '') + '.', 'neutral'); }
  // engine gọi trước khi cho tốt nghiệp: chưa qua bảo vệ thì tự bảo vệ (người chơi không kịp chọn / chế độ tự động)
  E.gradFail = function (l, r, log, a) {
    if (!(l.school === 'uni' || (l.school === 'abroad' && l.abroad && l.abroad.study))) return false;
    if (l.flags.gradOK) { l.flags.gradOK = false; l.flags.gradTries = 0; return false; }
    if (l.flags.gradTry === a) return true; // vừa rớt trong năm, đã lùi hạn ra trường
    defend(l, r, log, 0); if (l.flags.gradOK) { l.flags.gradOK = false; l.flags.gradTries = 0; return false; } return true;
  };

  // ===================================================================
  // 4. THỰC TẬP CUỐI KHÓA (ngành khác)
  // ===================================================================
  var INTERN = {
    it: [['một công ty phần mềm lớn', 'dev'], ['một tập đoàn viễn thông', 'ky_su'], ['một startup công nghệ', 'dev']],
    eco: [['một ngân hàng', 'ngan_hang'], ['một công ty kiểm toán', 'ke_toan'], ['phòng marketing của một tập đoàn', 'marketing']],
    law: [['một văn phòng luật sư', 'luat_su'], ['tòa soạn một tờ báo', 'phong_vien']],
    edu: [['một trường THPT (thực tập sư phạm)', 'giao_vien']],
    art: [['một công ty thiết kế kiến trúc', 'kien_truc'], ['một agency quảng cáo', 'thiet_ke']]
  };
  SC('thuc_tap', {
    title: 'Thực tập cuối khóa', valid: function (l) { return studying(l) && !!INTERN[l.major]; },
    prep: function (l, r) { return { p: pick(r, INTERN[l.major]) }; },
    text: function (l, d) { return 'Năm cuối, bạn đi thực tập ở ' + d.p[0] + '. Thực tập tốt có thể được giữ lại làm việc sau khi ra trường.'; },
    opts: [
      { k: 'cham', l: 'Thực tập nghiêm túc, xung phong nhận việc', ai: { w: 1.2, amb: 1 }, run: function (l, r, log, d) { fx(l, { kno: 2 }); if (ch(r, 0.35 + l.st.kno / 300)) { l.flags.internJob = d.p[1]; log('Thực tập ở ' + d.p[0] + ' được đánh giá xuất sắc — trưởng phòng hứa giữ chỗ cho bạn sau khi tốt nghiệp.', 'good'); } else log('Thực tập chăm chỉ ở ' + d.p[0] + ', học được nhiều việc thực tế.', 'good'); } },
      { k: 'xin_dau', l: 'Xin dấu thực tập cho xong', ai: { w: 0.6 }, run: function (l, r, log, d) { log('Xin dấu xác nhận thực tập cho đủ thủ tục, cả kỳ chủ yếu ngồi photo tài liệu.', 'neutral'); } }
    ]
  });
  E.TRIG.push({ id: 'thuc_tap', when: function (l) { return free(l) && studying(l) && !!INTERN[l.major] && l.schoolEnd - l.age <= 2 && !l.flags.internDone; }, p: 0.6, cd: 1, max: 1 });
  var ta0 = E.DEC.thuc_tap.apply; E.DEC.thuc_tap.apply = function (l) { l.flags.internDone = true; return ta0.apply(this, arguments); };
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.flags.internJob || studying(l) || l.edu < 5 || (l.abroad && l.abroad.study)) return;
    var j = l.flags.internJob; l.flags.internJob = null;
    if (l.job || !E.CAR[j]) return;
    l.flags.needJob = false; log('Nơi thực tập năm cuối giữ lời hứa, nhận bạn vào làm chính thức.', 'good'); E.startJob(l, j, r, log);
  });

  // ===================================================================
  // 5. SỐ LIỆU NGHỀ TỰ CHẠY TRONG NHẬT KÝ
  // ===================================================================
  // [đơn vị, [min, max] mỗi năm ở bậc thấp nhất, hệ số tăng mỗi bậc, câu kể (n năm nay, tổng), mốc]
  function surgeon(l) { var s = l.med && SPEC[l.med.spec]; return !!(s && s[2]); }
  var STAT = {
    // v4.0: số liệu theo thực tế bệnh viện công ở Việt Nam (khám ngoại trú 25–45 lượt / ngày, ~250 ngày làm việc; phẫu thuật viên 1–2 ca / ngày…)
    bac_si: function (l) {
      var sp = l.med && l.med.spec, k = rk(l), f = k === 0 ? 0.6 : k >= 5 ? 0.3 : k === 4 ? 0.75 : 1; // thực hành: làm dưới sự giám sát; trưởng khoa, giám đốc: nhiều việc quản lý
      var D = { noi: ['lượt khám', 6000, 10000, 'khám khoảng {n} lượt bệnh nhân'], nhi: ['lượt khám', 7000, 12000, 'khám khoảng {n} lượt bệnh nhi'], tim: ['lượt khám', 4000, 7000, 'khám khoảng {n} lượt bệnh nhân tim mạch'], dalieu: ['lượt khám', 8000, 14000, 'khám khoảng {n} lượt bệnh nhân da liễu'],
        tamthan: ['lượt khám', 2500, 5000, 'khám khoảng {n} lượt bệnh nhân'], ubuou: ['lượt khám', 3000, 6000, 'khám, điều trị khoảng {n} lượt bệnh nhân ung bướu'], yhct: ['lượt điều trị', 3000, 6000, 'châm cứu, bốc thuốc khoảng {n} lượt'],
        cdha: ['ca đọc phim', 8000, 14000, 'đọc khoảng {n} phim X-quang, CT, MRI'], san: ['ca đỡ đẻ, mổ lấy thai', 250, 450, 'đỡ đẻ và mổ lấy thai {n} ca'], ngoai: ['ca mổ', 180, 320, 'đứng mổ {n} ca'], chinhhinh: ['ca mổ', 220, 380, 'mổ {n} ca chấn thương chỉnh hình'],
        thammy: ['ca phẫu thuật', 150, 300, 'thực hiện {n} ca phẫu thuật thẩm mỹ'], gmhs: ['ca gây mê', 600, 1000, 'gây mê cho {n} ca mổ'], rhm: ['ca điều trị răng', 1200, 2500, 'điều trị khoảng {n} ca răng'] }[sp] || ['lượt khám', 5000, 9000, 'khám khoảng {n} lượt bệnh nhân'];
      var big = D[2] >= 2000;
      return [D[0], [D[1] * f, D[2] * f], 0, 'Năm nay ' + D[3], big ? [10000, 50000, 100000, 200000] : [500, 1000, 3000, 5000, 10000]];
    },
    phong_kham: function (l) { return ['lượt khám', [6000, 12000], 0.05, 'Phòng khám đón khoảng {n} lượt bệnh nhân năm nay', [10000, 50000, 100000]]; },
    nha_si: function () { return ['ca điều trị răng', [1200, 2500], 0.05, 'Năm nay điều trị khoảng {n} ca răng (trám, nhổ, niềng, implant)', [5000, 10000, 30000]]; },
    dieu_duong: function () { return ['ca trực đêm', [60, 100], 0, 'Năm nay trực {n} ca đêm, chăm sóc hàng trăm bệnh nhân', [500, 1000, 2000]]; },
    duoc_si: function () { return ['đơn thuốc', [12000, 25000], 0.05, 'Năm nay cấp phát khoảng {n} đơn thuốc', [50000, 100000, 300000]]; },
    giao_vien: function () { return ['học trò', [120, 250], 0, 'Năm học này dạy {n} học trò', [1000, 3000, 5000]]; },
    gv_mam_non: function () { return ['bé', [20, 35], 0.03, 'Năm học này chăm {n} bé', [200, 500]]; },
    giang_vien: function () { return ['sinh viên', [200, 500], 0.05, 'Năm nay dạy khoảng {n} sinh viên', [2000, 5000, 10000]]; },
    luat_su: function () { return ['vụ việc', [10, 30], 0.15, 'Năm nay nhận {n} vụ việc', [100, 300, 500]]; },
    cong_an: function () { return ['vụ việc', [20, 60], 0.08, 'Năm nay tham gia giải quyết {n} vụ việc', [200, 500, 1000]]; },
    tx_cn: function () { return ['chuyến xe', [4000, 7000], 0, 'Năm nay chạy khoảng {n} cuốc xe', [10000, 30000, 60000]]; },
    shipper: function () { return ['đơn hàng', [9000, 16000], 0, 'Năm nay giao khoảng {n} đơn hàng', [20000, 50000, 100000]]; },
    dau_bep: function () { return ['suất ăn', [25000, 60000], 0.05, 'Năm nay nấu khoảng {n} suất ăn', [100000, 300000]]; },
    ca_si: function () { return ['đêm diễn', [30, 90], 0.25, 'Năm nay chạy {n} show diễn', [300, 1000]]; },
    dev: function () { return ['dự án', [2, 6], 0.15, 'Năm nay tham gia {n} dự án phần mềm', [20, 50]]; },
    ky_su_xd: function () { return ['công trình', [1, 3], 0.15, 'Năm nay giám sát {n} công trình', [10, 30]]; },
    kien_truc: function () { return ['công trình', [2, 6], 0.15, 'Năm nay thiết kế {n} công trình', [20, 50, 100]]; },
    tho_toc: function () { return ['lượt khách', [2500, 5000], 0.1, 'Năm nay làm tóc cho khoảng {n} lượt khách', [20000, 50000]]; },
    nong: function (l) { return ['tấn lúa', [6, 14], 0, 'Vụ mùa năm nay thu khoảng {n} tấn lúa', [100, 300]]; },
    phong_vien: function () { return ['bài báo', [80, 200], 0.08, 'Năm nay viết khoảng {n} bài báo', [1000, 3000]]; },
    hdv: function () { return ['đoàn khách', [25, 50], 0.05, 'Năm nay dẫn {n} đoàn khách', [300, 800]]; },
    sale_bds: function () { return ['giao dịch', [2, 12], 0.15, 'Năm nay chốt {n} giao dịch nhà đất', [50, 100]]; }
  };
  E.JOB_STAT = STAT;
  E.HOOKS.year.push(function (l, r, log, a) {
    if (!l.job || !l.alive || !free(l)) return;
    var j = jid(l), f = STAT[j]; if (!f) return;
    var S = f(l), unit = S[0], lo = S[1][0], hi = S[1][1];
    var n = (lo + r() * (hi - lo)) * (1 + rk(l) * S[2]);
    if (n >= 50) n = Math.round(n / 10) * 10; else n = Math.round(n);
    var W = l.work || (l.work = {}), key = j + ':' + unit, before = W[key] || 0; W[key] = before + n;
    var mile = S[4].filter(function (m) { return before < m && W[key] >= m; }).pop();
    var show = { 'lượt khám': 'lượt bệnh nhân', 'ca điều trị răng': 'ca răng' }[unit] || unit;
    if (mile) { log('Cột mốc nghề nghiệp: tính đến nay đã ' + verbOf(j, unit) + ' ' + fmt(mile) + ' ' + show + '.', 'good'); H.mem(l, 'Cột mốc ' + fmt(mile) + ' ' + unit + ' trong đời làm nghề.', 3); }
    else if (before > 0 && r() < 0.25) log(S[3].replace('{n}', fmt(n)) + ' — tính đến nay đã ' + verbOf(j, unit) + ' ' + fmt(W[key]) + ' ' + show + '.', 'quiet');
  });
  function verbOf(j, unit) { return { 'ca mổ': 'mổ', 'lượt khám': 'khám', 'ca điều trị răng': 'điều trị', 'ca trực đêm': 'trực', 'lượt điều trị': 'điều trị', 'ca đọc phim': 'đọc', 'ca đỡ đẻ, mổ lấy thai': 'thực hiện', 'ca phẫu thuật': 'thực hiện', 'ca gây mê': 'gây mê', 'đơn thuốc': 'cấp', 'học trò': 'dạy', 'bé': 'chăm', 'sinh viên': 'dạy', 'vụ việc': 'giải quyết', 'chuyến xe': 'chạy', 'đơn hàng': 'giao', 'suất ăn': 'nấu', 'đêm diễn': 'diễn', 'dự án': 'làm', 'công trình': 'thực hiện', 'lượt khách': 'phục vụ', 'tấn lúa': 'thu hoạch', 'bài báo': 'viết', 'đoàn khách': 'dẫn', 'giao dịch': 'chốt' }[unit] || 'làm'; }
  // hồ sơ: số liệu nghề
  var pf0 = E.profile;
  if (pf0) E.profile = function (l) { var P = pf0.apply(this, arguments); var W = l.work || {}; P.workStats = Object.keys(W).map(function (k) { return fmt(W[k]) + ' ' + k.split(':')[1]; }); if (l.med && l.med.spec && SPEC[l.med.spec]) P.medSpec = SPEC[l.med.spec][0]; return P; };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
