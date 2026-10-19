/* Một Đời — v6.7.0: con người, văn hóa, lịch sử Việt Nam sát thực tế hơn
   · dùng số liệu tổng hợp từ Nemotron-Personas-Vietnam (NVIDIA & FPT, CC BY 4.0; xem data-personas-vn.js):
     người quen quanh bạn có nghề nghiệp, sở thích đúng với vùng miền, thành thị / nông thôn, lứa tuổi;
     thú vui phổ biến theo vùng và tuổi; món ăn quê nhà theo vùng
   · di sản văn hóa phi vật thể được UNESCO ghi danh gắn với đúng địa phương, lễ tết của các dân tộc
   · bài học lịch sử (chỉ những mốc đã được ghi nhận chính thức), chuyện ông bà kể, Ngày Thương binh – Liệt sĩ 27/7,
     Giỗ Tổ Hùng Vương, kỳ nghỉ 30/4 – 1/5 và quyền lợi khi làm ngày lễ (Bộ luật Lao động 2019),
     bầu cử đại biểu Quốc hội và HĐND (Luật Bầu cử 2015: cử tri phải tự mình đi bầu)
   Nguồn: docs/culture-sources.md */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, VN = G.VN;
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function vn(l) { return H.isVN(l) && l.mode === 'vn' && !(l.abroad && (l.abroad.perm || l.abroad.trapped)); }
  function year(l) { return l.birthYear + l.age; }
  function T(id, when, p, cd, max, rep) { E.TRIG.push({ id: id, when: function (l, a) { return free(l) && when(l, a); }, p: p, cd: cd || 4, max: max || 1, rep: !!rep }); }
  function KT(id, a0, a1, when, cw) { E.TRIG.push({ id: id, when: function (l, a) { return a >= a0 && a <= a1 && free(l) && (!when || when(l, a)); }, p: 0.08, cd: 99, child: true, cw: cw || 1, max: 1 }); }
  function mom(l) { return l.fam.mAlive ? 'mẹ' : l.fam.fAlive && !l.fam.noDad ? 'bố' : 'bà'; }

  // ===================================================================
  // 1. SỐ LIỆU PERSONA THEO VÙNG
  // ===================================================================
  var P = G.PERSONAS_VN && G.PERSONAS_VN.regions || {};
  var REG = { DBSH: 'DBSH', MNPB: 'MNPB', BTB: 'BTB', NTB: 'BTB', TN: 'TN', DNB: 'DNB', DBSCL: 'DBSCL' };
  var REG_NAME = { DBSH: 'đồng bằng Bắc Bộ', MNPB: 'miền núi phía Bắc', BTB: 'miền Trung', TN: 'Tây Nguyên', DNB: 'miền Đông Nam Bộ', DBSCL: 'miền Tây Nam Bộ' };
  var COMMON = ['phở', 'bánh mì', 'trà', 'cà phê', 'hải sản', 'ốc', 'xôi', 'chè', 'cơm gà', 'vịt', 'bún bò', 'gà nướng', 'cá kho', 'thịt kho'];
  function regionCode(name) { var p = VN && VN.byName && VN.byName[name]; return p ? REG[p.region] || null : null; }
  function homeRegion(l) { return (l.prov && REG[l.prov.region]) || regionCode(l.prov && l.prov.old) || null; }
  function liveRegion(l) { return (l.movedTo && regionCode(l.movedTo)) || homeRegion(l); }
  function group(l, reg) { var g = reg || liveRegion(l); if (!g) return null; return P[g + '_' + (l.urban ? 'u' : 'r')] || P[g + '_r'] || P[g + '_u'] || null; }
  function wpick(r, list, skip) { var a = (list || []).filter(function (x) { return !skip || skip.indexOf(x[0]) < 0; }); if (!a.length) return null; var t = a.reduce(function (s, x) { return s + x[1]; }, 0), z = r() * t; for (var i = 0; i < a.length; i++) { z -= a[i][1]; if (z <= 0) return a[i][0]; } return a[a.length - 1][0]; }
  function band(a) { return a < 30 ? 'y' : a < 45 ? 'm' : a < 60 ? 'o' : 's'; }
  function hobbies(g, age) { if (!g) return []; var b = g.hobAge && g.hobAge[band(age)]; return b && b.length >= 6 ? b : g.hob; }
  function low(s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : ''; }
  // nghề trong dữ liệu là danh từ chỉ người ("Tiểu thương chợ", "Bác sĩ") hoặc hoạt động ("Trồng cà phê", "Kinh doanh online")
  function jobPhrase(j) { j = low(j); if (/^nghỉ hưu/.test(j)) return 'đã ' + j; return /^(trồng|kinh doanh|đang|nội trợ|làm|buôn|bán|chăn|nuôi|đánh|học)/.test(j) ? j : 'làm ' + j; }
  E.PERSONA = { region: liveRegion, group: group, regionName: function (k) { return REG_NAME[k] || ''; } };
  function call(l, age, sex) { var d = age - l.age; return d >= 18 ? (sex === 'F' ? 'cô' : 'chú') : d >= 3 ? (sex === 'F' ? 'chị' : 'anh') : d >= -3 ? 'bạn' : 'em'; }

  SC('pv_nguoi_quen', {
    title: 'Người quanh ta',
    prep: function (l, r) {
      var g = group(l); if (!g) return { none: true };
      var sx = r() < 0.5 ? 'M' : 'F', age = U.clamp(l.age + U.randint(r, -12, 22), 18, 85), RET = g.job.filter(function (x) { return /^(Nghỉ hưu|Hưu trí)/.test(x[0]); }).map(function (x) { return x[0]; }), job;
      if (age >= 60 && r() < 0.65 && RET.length) job = pick(r, RET); else job = wpick(r, g.job, RET.concat(age < 23 ? [] : ['Học sinh THPT'])) || 'Làm tự do';
      var hs = hobbies(g, age), h1 = wpick(r, hs) || 'Đọc sách', h2 = wpick(r, hs, [h1]) || 'Nấu ăn';
      return { n: H.stranger(l, r, sx), sex: sx, age: age, job: job, h1: h1, h2: h2, w: l.urban ? pick(r, ['khu phố', 'tổ dân phố', 'chung cư']) : pick(r, ['xóm', 'làng', 'thôn']) };
    },
    valid: function (l, d) { return !d || !d.none; },
    text: function (l, d) { if (!d || d.none) return ''; var c = call(l, d.age, d.sex); return 'Ở ' + d.w + ', bạn quen ' + c + ' ' + d.n + ', ' + d.age + ' tuổi, ' + jobPhrase(d.job) + '. Lúc rảnh, ' + c + ' ấy thích ' + low(d.h1) + ' và ' + low(d.h2) + '.'; },
    opts: [
      { k: 'cung', l: function (l, d) { return 'Rủ nhau cùng ' + low(d.h1); }, ai: { soc: 1, w: 1.2 }, run: function (l, r, log, d) { var c = call(l, d.age, d.sex); log(pick(r, ['Cuối tuần ấy bạn cùng ' + c + ' ' + d.n + ' ' + low(d.h1) + '. Từ đó gặp nhau là nói chuyện không dứt.', 'Lần đầu thử ' + low(d.h1) + ', bạn vụng về nhưng ' + c + ' ' + d.n + ' kiên nhẫn chỉ cho từng chút.', 'Hai người hẹn nhau ' + low(d.h1) + ' mấy lần. Có thêm một người quen tốt bụng ngay gần nhà.']), 'good'); H.fx(l, { hap: 3, soc: 2 }); } },
      { k: 'nghe', l: function (l, d) { return 'Hỏi chuyện nghề của ' + call(l, d.age, d.sex) + ' ấy'; }, ai: { smart: 1 }, run: function (l, r, log, d) { var c = call(l, d.age, d.sex); log(pick(r, ['Nghe ' + c + ' ' + d.n + ' kể chuyện ' + jobPhrase(d.job) + ', bạn mới biết nghề nào cũng có cái khó riêng.', c.charAt(0).toUpperCase() + c.slice(1) + ' ' + d.n + ' kể say sưa về công việc ' + jobPhrase(d.job) + '. Bạn học được vài điều hay.']), 'neutral'); H.fx(l, { kno: 1, soc: 1 }); } },
      { k: 'chao', l: 'Chỉ chào hỏi xã giao', run: function (l, r, log, d) { log('Mỗi lần gặp nhau ở ' + d.w + ', hai bên gật đầu chào, hỏi thăm vài câu.', 'neutral'); } }
    ] });
  T('pv_nguoi_quen', function (l, a) { return vn(l) && a >= 16 && !!group(l); }, 0.07, 7, 3, true);

  SC('pv_thu_vui', {
    title: 'Một thú vui mới',
    prep: function (l, r) { var g = group(l); if (!g) return { none: true }; var have = (l.flags.hobbies || []).slice(), hs = hobbies(g, l.age), a = []; for (var i = 0; i < 3; i++) { var h = wpick(r, hs, have.concat(a)); if (h) a.push(h); } return a.length >= 2 ? { list: a, reg: liveRegion(l) } : { none: true }; },
    valid: function (l, d) { return !d || !d.none; },
    text: function (l, d) { if (!d || d.none) return ''; return 'Ở ' + (REG_NAME[d.reg] || 'chỗ bạn ở') + ', người tuổi bạn hay dành thời gian rảnh cho mấy thú vui này. Bạn muốn thử cái nào?'; },
    opts: [0, 1, 2].map(function (i) { return { k: 'h' + i, l: function (l, d) { return d.list && d.list[i] ? 'Thử ' + low(d.list[i]) : ''; }, req: function (l, d) { return !!(d && d.list && d.list[i]); }, ai: { w: 1 }, run: function (l, r, log, d) { var h = d.list[i]; l.flags.hobbies = (l.flags.hobbies || []).concat([h]).slice(-4); log(pick(r, ['Bạn bắt đầu ' + low(h) + '. Mấy tháng sau đã thành thói quen mỗi tuần.', 'Thử ' + low(h) + ' vài lần, bạn thấy đầu óc nhẹ nhõm hẳn.', 'Bạn tìm được hội ' + low(h) + ' ngay gần nhà, quen thêm vài người bạn mới.']), 'good'); H.fx(l, { hap: 3, soc: 1 }); } }; }).concat([{ k: 'thoi', l: 'Thôi, mình không có thời gian', run: function (l, r, log) { log('Bạn bận quá, để dành thú vui cho lúc khác.', 'neutral'); } }]) });
  T('pv_thu_vui', function (l, a) { return vn(l) && a >= 15 && a <= 80 && (l.flags.hobbies || []).length < 4 && !!group(l); }, 0.05, 8, 3, true);
  E.HOOKS.year.unshift(function (l, r, log, a) {
    var hs = l.flags && l.flags.hobbies; if (!hs || !hs.length || !l.alive || a < 15) return;
    if (r() < 0.12) { var h = hs[Math.floor(r() * hs.length)]; log(pick(r, ['Năm nay vẫn giữ thói quen ' + low(h) + ' mỗi cuối tuần.', 'Những lúc mệt mỏi, ' + low(h) + ' giúp bạn cân bằng lại.']), 'neutral'); H.fx(l, { hap: 1 }); }
  });

  SC('pv_mon_que', {
    title: 'Nhớ món quê',
    prep: function (l, r) { var g = group(l, homeRegion(l)); var d = g && wpick(r, (g.dish || []).filter(function (x) { return COMMON.indexOf(x[0]) < 0; }).slice(0, 12)); return d ? { d: d, reg: homeRegion(l) } : { none: true }; },
    valid: function (l, d) { return !d || !d.none; },
    text: function (l, d) { if (!d || d.none) return ''; return 'Sống xa quê, có hôm bạn thèm đến quặn lòng món ' + d.d + ' — món ' + mom(l) + ' vẫn nấu, món quen thuộc của ' + (REG_NAME[d.reg] || 'quê nhà') + '.'; },
    opts: [
      { k: 'nau', l: 'Tự vào bếp nấu theo trí nhớ', ai: { w: 1.1 }, run: function (l, r, log, d) { l.flags.homeDish = (l.flags.homeDish || 0) + 1; log(ch(r, 0.5) ? 'Nấu theo trí nhớ, vị không giống hẳn nhưng ăn vào thấy như được về nhà.' : 'Nấu hỏng một lần, lần thứ hai thì ra đúng vị ngày xưa. Bạn chụp ảnh gửi về cho gia đình.', 'good'); H.fx(l, { hap: 3 }); } },
      { k: 'goi', l: function (l) { return 'Gọi điện hỏi ' + mom(l) + ' cách nấu'; }, req: function (l) { return l.fam.mAlive || l.fam.fAlive; }, ai: { soc: 1 }, run: function (l, r, log, d) { l.flags.homeDish = (l.flags.homeDish || 0) + 1; log('Cuộc gọi hỏi cách nấu ' + d.d + ' kéo dài cả tiếng, toàn chuyện ở nhà.', 'good'); H.fx(l, { hap: 4 }); H.mem(l, 'Cuộc gọi về nhà hỏi cách nấu ' + d.d + '.', 2); } },
      { k: 'quan', l: 'Đi tìm quán của người cùng quê', run: function (l, r, log, d) { log('Tìm được một quán nhỏ của người cùng quê. Ăn bát ' + d.d + ', nghe giọng nói quen thuộc, bạn ngồi lâu hơn dự định.', 'good'); H.fx(l, { hap: 2, soc: 1 }); } }
    ] });
  T('pv_mon_que', function (l, a) { return a >= 18 && H.isVN(l) && (!!l.movedTo || !!l.abroad) && !!homeRegion(l); }, 0.06, 7, 3, true);

  // ===================================================================
  // 2. DI SẢN VĂN HÓA PHI VẬT THỂ (UNESCO) GẮN VỚI ĐỊA PHƯƠNG
  // ===================================================================
  var HER = [
    { id: 'quan_ho', n: 'Dân ca Quan họ Bắc Ninh', p: ['Bắc Ninh', 'Bắc Giang'], t: 'Hội Lim mùa xuân, liền anh liền chị mặc áo the, khăn xếp, nón quai thao hát đối đáp trên thuyền và trong sân đình.' },
    { id: 'xoan', n: 'Hát Xoan Phú Thọ', p: ['Phú Thọ'], t: 'Đầu xuân, phường Xoan hát mừng ở đình làng, những làn điệu cổ được truyền từ đời này sang đời khác.' },
    { id: 'hung_vuong', n: 'Tín ngưỡng thờ cúng Hùng Vương', p: ['Phú Thọ'], t: 'Mùng 10 tháng 3 âm lịch, dòng người về Đền Hùng dâng hương tưởng nhớ các Vua Hùng.' },
    { id: 'giong', n: 'Hội Gióng ở đền Phù Đổng và đền Sóc', p: ['Hà Nội'], t: 'Hội Gióng tái hiện truyền thuyết Thánh Gióng đánh giặc Ân, cờ lau, trống chiêng rộn ràng.' },
    { id: 'ca_tru', n: 'Nghệ thuật Ca trù', p: ['Hà Nội', 'Hải Dương', 'Hưng Yên', 'Bắc Ninh', 'Nam Định', 'Thái Bình', 'Hà Tĩnh', 'Nghệ An', 'Thanh Hóa', 'Quảng Bình', 'Ninh Bình', 'Hà Nam'], t: 'Một tối nghe ca trù: tiếng phách giòn, đàn đáy trầm, đào nương ngân nga những câu hát cổ.' },
    { id: 'nha_nhac', n: 'Nhã nhạc Cung đình Huế', p: ['Thừa Thiên Huế', 'Huế'], t: 'Buổi diễn Nhã nhạc trong Đại Nội, những âm thanh trang nghiêm của cung đình xưa.' },
    { id: 'cong_chieng', n: 'Không gian văn hóa Cồng chiêng Tây Nguyên', p: ['Kon Tum', 'Gia Lai', 'Đắk Lắk', 'Đắk Nông', 'Lâm Đồng'], t: 'Đêm lễ hội bên ánh lửa, tiếng cồng chiêng vang vọng núi rừng, mọi người nắm tay nhau múa xoang.' },
    { id: 'vi_giam', n: 'Dân ca Ví, Giặm Nghệ Tĩnh', p: ['Nghệ An', 'Hà Tĩnh'], t: 'Những câu ví, giặm mộc mạc vang lên trong buổi sinh hoạt câu lạc bộ dân ca của xã.' },
    { id: 'tai_tu', n: 'Nghệ thuật Đờn ca tài tử Nam Bộ', reg: ['DNB', 'DBSCL'], t: 'Chiều cuối tuần, mấy ông bác trong xóm ôm đàn kìm, đàn tranh, ca vọng cổ bên bộ ván gỗ.' },
    { id: 'bai_choi', n: 'Nghệ thuật Bài chòi Trung Bộ', p: ['Quảng Bình', 'Quảng Trị', 'Thừa Thiên Huế', 'Huế', 'Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa'], t: 'Hội bài chòi ngày Tết, anh hiệu hô câu thai, ai trúng con bài thì gõ mõ reo vui.' },
    { id: 'tho_mau', n: 'Thực hành Tín ngưỡng thờ Mẫu Tam phủ của người Việt', p: ['Nam Định', 'Hà Nội', 'Thái Bình', 'Hà Nam', 'Ninh Bình', 'Thanh Hóa', 'Bắc Ninh', 'Hải Phòng'], t: 'Lễ hội ở phủ Mẫu, tiếng hát văn hòa cùng những giá hầu đồng sặc sỡ.' },
    { id: 'keo_co', n: 'Nghi lễ và trò chơi kéo co', p: ['Lào Cai', 'Vĩnh Phúc', 'Bắc Ninh', 'Hà Nội'], t: 'Hội làng đầu năm có kéo co ngồi, hai bên dân làng hò reo cổ vũ.' },
    { id: 'gom_cham', n: 'Nghệ thuật làm gốm của người Chăm', p: ['Ninh Thuận'], t: 'Ở làng gốm Bàu Trúc, các nghệ nhân nặn gốm bằng tay, đi vòng quanh bàn xoay, nung gốm ngoài trời.' },
    { id: 'ba_chua_xu', n: 'Lễ hội Vía Bà Chúa Xứ núi Sam', p: ['An Giang'], t: 'Mùa lễ Vía Bà ở Châu Đốc, người Việt, Khmer, Chăm, Hoa cùng về núi Sam.' },
    { id: 'then', n: 'Thực hành Then của người Tày, Nùng, Thái', eth: ['Tày', 'Nùng', 'Thái'], t: 'Tiếng đàn tính và câu hát Then trong buổi lễ của bản, ông bà bảo đó là lời cầu chúc bình an.' },
    { id: 'xoe', n: 'Nghệ thuật Xòe Thái', eth: ['Thái'], p: ['Lai Châu', 'Sơn La', 'Điện Biên', 'Yên Bái'], t: 'Cả bản nắm tay nhau thành vòng xòe quanh đống lửa, ai đi ngang qua cũng được kéo vào.' }
  ];
  E.HERITAGE_VN = HER;
  function heritageFor(l) {
    var p = l.prov && l.prov.old, reg = l.prov && l.prov.region, eth = l.eth;
    return HER.filter(function (h) { return (h.p && h.p.indexOf(p) >= 0) || (h.reg && h.reg.indexOf(reg) >= 0) || (h.eth && h.eth.indexOf(eth) >= 0); });
  }
  E.heritageFor = heritageFor;
  SC('vh_di_san', {
    title: function (l, d) { return d && d.h ? d.h.n : 'Di sản quê hương'; },
    prep: function (l, r) { var a = heritageFor(l).filter(function (h) { return !(l.flags.dsSeen || {})[h.id]; }); return a.length ? { h: pick(r, a) } : { none: true }; },
    valid: function (l, d) { return !d || !d.none; },
    text: function (l, d) { if (!d || d.none) return ''; return d.h.t + ' Đây là di sản văn hóa phi vật thể của quê bạn được UNESCO ghi danh.'; },
    opts: [
      { k: 'tham_gia', l: 'Hòa vào cùng mọi người', ai: { soc: 1, w: 1.3 }, run: function (l, r, log, d) { (l.flags.dsSeen || (l.flags.dsSeen = {}))[d.h.id] = l.age; log(pick(r, ['Bạn hòa vào không khí ấy, thấy tự hào về quê mình.', 'Lần đầu tự mình tham gia, bạn hiểu vì sao ông bà quý những điều này đến thế.']), 'good'); H.fx(l, { hap: 3, soc: 2 }); H.mem(l, d.h.n + ' ở quê nhà.', 3); } },
      { k: 'hoc', l: 'Xin học từ nghệ nhân trong vùng', ai: { smart: 1 }, run: function (l, r, log, d) { (l.flags.dsSeen || (l.flags.dsSeen = {}))[d.h.id] = l.age; l.flags.dsLearn = (l.flags.dsLearn || 0) + 1; log('Bạn theo một nghệ nhân lớn tuổi học mấy tháng. Bà / ông dặn: "Giữ được cái này là giữ được hồn quê."', 'good'); H.fx(l, { kno: 2, hap: 2, karma: 2 }); } },
      { k: 'xem', l: 'Đứng xem một lúc rồi về', run: function (l, r, log, d) { (l.flags.dsSeen || (l.flags.dsSeen = {}))[d.h.id] = l.age; log('Bạn đứng xem một lúc rồi về. Âm thanh ấy còn văng vẳng mãi.', 'neutral'); H.fx(l, { hap: 1 }); } }
    ] });
  T('vh_di_san', function (l, a) { return vn(l) && a >= 7 && heritageFor(l).some(function (h) { return !(l.flags.dsSeen || {})[h.id]; }); }, 0.07, 5, 3, true);

  // lễ tết của các dân tộc (theo dân tộc của bạn)
  var FEST = {
    'Khmer': [['Tết Chôl Chnăm Thmây', 'Giữa tháng 4, cả phum sóc lên chùa làm lễ, đắp núi cát, té nước chúc nhau năm mới an lành.'], ['Lễ Sene Dolta', 'Mùa lễ cúng ông bà, con cháu đi xa cũng về, mang lễ vật lên chùa.'], ['Lễ hội Ok Om Bok', 'Đêm rằm tháng 10 âm lịch, cúng trăng, đút cốm dẹp cho trẻ con, cả xóm đi xem đua ghe ngo.']],
    'Tày': [['Lễ hội Lồng tồng', 'Tháng Giêng, cả bản ra đồng làm lễ xuống đồng, ném còn, kéo co, cầu mùa màng tươi tốt.']],
    'Nùng': [['Lễ hội Lồng tồng', 'Tháng Giêng, cả bản ra đồng làm lễ xuống đồng, ném còn, cầu mưa thuận gió hòa.']],
    'Mông': [['Tết của người Mông', 'Cuối năm, nhà nhà giã bánh dày, mặc váy áo mới, trai gái thổi khèn, ném pao.'], ['Lễ hội Gầu tào', 'Đầu xuân, lễ hội Gầu tào cầu phúc, cầu may, cây nêu dựng giữa bãi đất rộng.']],
    'Thái': [['Lễ hội Xên bản, Xên mường', 'Cả bản làm lễ cầu bình an, sau đó múa xòe quanh đống lửa đến khuya.']],
    'Mường': [['Lễ hội Khai hạ', 'Đầu năm, người Mường mở hội Khai hạ, đánh chiêng, chơi đu, ném còn.']],
    'Ê Đê': [['Lễ mừng lúa mới', 'Mùa lúa chín, cả buôn làm lễ mừng lúa mới, uống rượu cần, nghe cồng chiêng.']],
    'Gia Rai': [['Lễ mừng lúa mới', 'Thu hoạch xong, làng làm lễ mừng lúa mới, cồng chiêng vang suốt đêm.']],
    'Ba Na': [['Lễ mừng lúa mới', 'Thu hoạch xong, làng làm lễ mừng lúa mới ở nhà rông.']],
    'Chăm': [['Lễ hội Katê', 'Mùa lễ Katê, người Chăm về đền tháp, tiếng trống Ginăng, kèn Saranai rộn ràng.']],
    'Hoa': [['Tết Nguyên tiêu', 'Rằm tháng Giêng, phố người Hoa rực đèn lồng, múa lân, viếng hội quán.']]
  };
  E.ETHNIC_FESTIVALS = FEST;
  SC('vh_le_dan_toc', {
    title: function (l, d) { return d && d.f ? d.f[0] : 'Lễ hội của dân tộc mình'; },
    prep: function (l, r) { var a = FEST[l.eth]; return a ? { f: pick(r, a) } : { none: true }; },
    valid: function (l, d) { return !d || !d.none; },
    text: function (l, d) { if (!d || d.none) return ''; return d.f[1]; },
    opts: [
      { k: 've', l: function (l) { return l.movedTo || l.abroad ? 'Thu xếp về quê dự lễ' : 'Cùng gia đình tham gia trọn vẹn'; }, ai: { soc: 1, w: 1.3 }, run: function (l, r, log, d) { l.flags.ethFest = (l.flags.ethFest || 0) + 1; log(pick(r, ['Bạn mặc trang phục truyền thống, cùng gia đình dự lễ. Thấy mình thuộc về nơi này.', 'Gặp lại họ hàng, bạn bè cũ trong ngày lễ, ai cũng hỏi han rối rít.']), 'good'); H.fx(l, { hap: 4, soc: 2 }); H.mem(l, d.f[0] + ' cùng gia đình.', 3); } },
      { k: 'ban', l: 'Bận việc, chỉ gọi điện chúc mừng', run: function (l, r, log) { log('Năm nay bận, bạn chỉ gọi điện về chúc mừng. Nhìn ảnh mọi người gửi lên mà nhớ.', 'neutral'); H.fx(l, { hap: -1 }); } }
    ] });
  T('vh_le_dan_toc', function (l, a) { return H.isVN(l) && !!FEST[l.eth] && a >= 5; }, 0.1, 4, 3, true);

  // ===================================================================
  // 3. LỊCH SỬ & CÔNG DÂN — chỉ những mốc đã được ghi nhận chính thức
  // ===================================================================
  var HIST = [
    ['Năm 938', 'Ngô Quyền đánh tan quân Nam Hán trên sông Bạch Đằng, mở ra thời kỳ độc lập lâu dài.'],
    ['Năm 1077', 'Lý Thường Kiệt chặn đứng quân Tống ở phòng tuyến sông Như Nguyệt; bài thơ "Nam quốc sơn hà" gắn với cuộc kháng chiến này.'],
    ['Năm 1288', 'Hưng Đạo Đại vương Trần Quốc Tuấn đánh tan quân Nguyên Mông trên sông Bạch Đằng.'],
    ['Năm 1428', 'Khởi nghĩa Lam Sơn do Lê Lợi lãnh đạo toàn thắng; Nguyễn Trãi viết "Bình Ngô đại cáo".'],
    ['Năm 1789', 'Vua Quang Trung đại phá quân Thanh, làm nên chiến thắng Ngọc Hồi – Đống Đa.'],
    ['Ngày 2/9/1945', 'Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình, khai sinh nước Việt Nam Dân chủ Cộng hòa.'],
    ['Ngày 7/5/1954', 'Chiến thắng Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu".'],
    ['Ngày 30/4/1975', 'Giải phóng hoàn toàn miền Nam, thống nhất đất nước.'],
    ['Năm 1986', 'Đại hội đại biểu toàn quốc lần thứ VI của Đảng khởi xướng công cuộc Đổi mới.'],
    ['Năm 1995 và 2007', 'Việt Nam gia nhập ASEAN (1995) và trở thành thành viên Tổ chức Thương mại Thế giới WTO (2007).'],
    ['Ngày 1/7/2025', 'Cả nước sắp xếp lại còn 34 tỉnh, thành phố và vận hành chính quyền địa phương hai cấp.']
  ];
  E.HISTORY_VN = HIST;
  SC('ls_bai_hoc', {
    title: 'Tiết Lịch sử',
    prep: function (l, r) { var seen = l.flags.lsSeen || [], a = HIST.map(function (x, i) { return i; }).filter(function (i) { return seen.indexOf(i) < 0; }); return { i: a.length ? pick(r, a) : Math.floor(r() * HIST.length) }; },
    text: function (l, d) { if (!d || d.i == null) return ''; var h = HIST[d.i]; return 'Tiết Lịch sử hôm nay: ' + h[0] + ', ' + low(h[1]); },
    opts: [
      { k: 'chu_y', l: 'Chăm chú nghe, ghi chép', ai: { smart: 1, w: 1.2 }, run: function (l, r, log, d) { (l.flags.lsSeen || (l.flags.lsSeen = [])).push(d.i); l.flags.lsGood = (l.flags.lsGood || 0) + 1; log(pick(r, ['Bạn ghi chép cẩn thận, về nhà kể lại cho cả nhà nghe.', 'Bài học khiến bạn tò mò, tối ấy tìm đọc thêm sách về giai đoạn này.']), 'good'); H.fx(l, { kno: 2 }); } },
      { k: 'hoi', l: 'Giơ tay hỏi thêm thầy cô', ai: { soc: 1 }, run: function (l, r, log, d) { (l.flags.lsSeen || (l.flags.lsSeen = [])).push(d.i); l.flags.lsGood = (l.flags.lsGood || 0) + 1; log('Thầy cô khen câu hỏi hay, kể thêm nhiều chi tiết không có trong sách giáo khoa.', 'good'); H.fx(l, { kno: 2, soc: 1 }); } },
      { k: 'ngu_gat', l: 'Lơ đãng nhìn ra cửa sổ', ai: { w: 0.6 }, run: function (l, r, log) { log('Bạn lơ đãng cả tiết. Đến bài kiểm tra mới cuống cuồng học thuộc.', 'neutral'); } }
    ] });
  E.TRIG.push({ id: 'ls_bai_hoc', when: function (l, a) { return a >= 10 && a <= 17 && !!l.school && H.isVN(l) && l.mode === 'vn' && free(l); }, p: 0.1, cd: 3, max: 3, rep: false });

  // ông bà kể chuyện ngày xưa (theo thế hệ của ông bà)
  SC('ls_ong_ba_ke', {
    title: 'Chuyện ngày xưa của ông bà',
    prep: function (l, r) {
      var gy = l.birthYear - 55, a = [];
      if (gy <= 1978) a.push('thời bao cấp, cả nhà xếp hàng từ sáng sớm mua gạo, mua dầu bằng tem phiếu');
      if (gy <= 1985) a.push('những năm đầu Đổi mới, nhà bắt đầu có chiếc xe máy đầu tiên, cả xóm ra xem');
      a.push('ngày xưa cả xóm chỉ có một chiếc tivi, tối nào cũng kéo nhau sang xem nhờ');
      a.push('ngày xưa đi học phải lội bộ mấy cây số, mùa mưa đường trơn như mỡ');
      a.push('ông bà gặp nhau ở buổi lao động công ích của xã, rồi cưới nhau chỉ với mâm cơm và chè thuốc');
      a.push('cái Tết đầu tiên trong căn nhà mới, cả nhà ngồi canh nồi bánh chưng đến sáng');
      return { s: pick(r, a) };
    },
    text: function (l, d) { if (!d || d.none) return ''; return 'Tối mùa đông, ông bà kể chuyện ' + d.s + '.'; },
    opts: [
      { k: 'nghe', l: 'Ngồi nghe, hỏi thêm', ai: { w: 1.3 }, run: function (l, r, log, d) { log('Bạn nghe say sưa, hỏi hết câu này đến câu khác. Ông bà cười: "Giờ các cháu sướng hơn nhiều rồi."', 'good'); H.fx(l, { hap: 2, kno: 1, karma: 1 }); H.mem(l, 'Ông bà kể chuyện ' + d.s + '.', 3); } },
      { k: 'ghi', l: 'Ghi lại vào sổ nhật ký', ai: { smart: 1 }, run: function (l, r, log, d) { log('Bạn ghi lại chuyện ông bà kể vào sổ. Nhiều năm sau đọc lại, thấy quý vô cùng.', 'good'); H.fx(l, { kno: 1, hap: 1 }); H.mem(l, 'Cuốn sổ ghi chuyện ông bà kể.', 3); } },
      { k: 'game', l: 'Mải chơi điện thoại', ai: { w: 0.5 }, run: function (l, r, log) { log('Bạn mải chơi điện thoại. Lớn lên mới tiếc vì không nghe kỹ hơn.', 'neutral'); } }
    ] });
  KT('ls_ong_ba_ke', 6, 14, function (l) { return H.isVN(l) && l.mode === 'vn'; }, 1.1);

  // Ngày Thương binh – Liệt sĩ 27/7
  SC('ls_27_7', { title: 'Ngày Thương binh – Liệt sĩ 27/7', text: 'Ngày 27/7, địa phương tổ chức thắp nến tri ân ở nghĩa trang liệt sĩ, thăm hỏi các gia đình thương binh, liệt sĩ.', opts: [
    { k: 'thap', l: 'Đến nghĩa trang thắp nén nhang', ai: { moral: 1, w: 1.3 }, run: function (l, r, log) { log(pick(r, ['Hàng nghìn ngọn nến sáng lên giữa những hàng bia mộ. Bạn đứng lặng rất lâu trước những ngôi mộ ghi "Liệt sĩ chưa xác định được thông tin".', 'Bạn thắp nhang, dọn cỏ quanh những ngôi mộ ít người lui tới. Một cụ bà cảm ơn, bảo con bà nằm ở hàng thứ ba.']), 'good'); H.fx(l, { karma: 3, hap: 1 }); l.flags.triAn = (l.flags.triAn || 0) + 1; H.mem(l, 'Đêm thắp nến tri ân ở nghĩa trang liệt sĩ.', 3); } },
    { k: 'tham', l: 'Cùng Đoàn thanh niên thăm gia đình chính sách', ai: { soc: 1 }, run: function (l, r, log) { l.flags.triAn = (l.flags.triAn || 0) + 1; log('Bạn theo đoàn đến thăm một bác thương binh. Bác kể chuyện ngày xưa, giọng vẫn sang sảng.', 'good'); H.fx(l, { karma: 3, soc: 1 }); } },
    { k: 'ban', l: 'Bận, chỉ dành một phút tưởng niệm', run: function (l, r, log) { log('Bận việc, bạn dành một phút lặng im tưởng niệm.', 'neutral'); } }] });
  T('ls_27_7', function (l, a) { return vn(l) && a >= 12; }, 0.04, 10, 3);

  // Giỗ Tổ Hùng Vương
  SC('gio_to', { title: 'Giỗ Tổ Hùng Vương', text: function (l) { return 'Mùng 10 tháng 3 âm lịch, cả nước nghỉ lễ Giỗ Tổ Hùng Vương.' + (l.prov && l.prov.old === 'Phú Thọ' ? ' Quê bạn có Đền Hùng, những ngày này người các nơi đổ về rất đông.' : ''); }, opts: [
    { k: 'den_hung', l: 'Về Đền Hùng dâng hương', ai: { w: 1 }, run: function (l, r, log) { if (l.prov && l.prov.old !== 'Phú Thọ' && l.indep) H.cash(l, -l.base * 0.01, 'Đi lễ Đền Hùng'); l.flags.denHung = true; log(pick(r, ['Leo hết mấy trăm bậc đá lên đền Thượng, đông nghịt người mà ai cũng vui vẻ nhường nhau.', 'Bạn dâng hương ở Đền Hùng, ăn bánh chưng, bánh giầy, nghe hát Xoan dưới chân núi.']), 'good'); H.fx(l, { hap: 2 }); } },
    { k: 'nha', l: 'Ở nhà thắp hương, nghỉ ngơi cùng gia đình', ai: { w: 1.2 }, run: function (l, r, log) { log('Ngày nghỉ lễ, bạn thắp nén hương, cả nhà quây quần ăn bữa cơm.', 'good'); H.fx(l, { hap: 2 }); } }] });
  T('gio_to', function (l, a) { return vn(l) && a >= 10; }, 0.03, 10, 2);

  // kỳ nghỉ 30/4 – 1/5 (Bộ luật Lao động 2019: Điều 112 ngày nghỉ, Điều 98 làm ngày lễ được trả ít nhất 300%)
  SC('le_30_4', { title: 'Kỳ nghỉ 30/4 – 1/5', text: 'Kỳ nghỉ lễ Ngày Giải phóng miền Nam, thống nhất đất nước và Quốc tế Lao động. Công ty hỏi ai muốn đi làm, làm ngày lễ được trả ít nhất 300% lương, chưa kể tiền lương ngày lễ.', opts: [
    { k: 'du_lich', l: 'Đi du lịch biển', h: function (l) { return 'Khoảng ' + H.money(l, l.base * 0.08); }, ai: { w: 1.1 }, run: function (l, r, log) { H.cash(l, -l.base * 0.08, 'Du lịch dịp 30/4'); log(pick(r, ['Kẹt xe cả tiếng ra khỏi thành phố, nhưng ra tới biển thì quên hết mệt.', 'Biển đông nghịt người, giá phòng tăng gấp đôi, vẫn vui vì cả nhà được đi cùng nhau.']), 'good'); H.fx(l, { hap: 4 }); } },
    { k: 've_que', l: 'Về quê thăm bố mẹ', req: function (l) { return l.fam.mAlive || l.fam.fAlive; }, ai: { soc: 1, w: 1.1 }, run: function (l, r, log) { log('Về quê mấy ngày, ăn cơm mẹ nấu, ngủ trưa trên chiếc chõng tre.', 'good'); H.fx(l, { hap: 3 }); } },
    { k: 'tang_ca', l: 'Đi làm ngày lễ lấy lương 300%', ai: { amb: 1 }, run: function (l, r, log) { var x = (l.income || l.base) / 365 * 2 * 3; H.cash(l, x, 'Lương làm ngày lễ 30/4 – 1/5'); l.flags.tangCaLe = (l.flags.tangCaLe || 0) + 1; log('Đi làm hai ngày lễ, cuối tháng nhận thêm khoản lương gấp ba. Mệt nhưng đáng.', 'neutral'); H.fx(l, { hea: -1 }); } }] });
  T('le_30_4', function (l, a) { return vn(l) && a >= 20 && a <= 62 && !!l.job && l.indep; }, 0.05, 8, 3);

  // bầu cử đại biểu Quốc hội và HĐND các cấp (5 năm một lần; năm 2026, 2031, 2036…)
  SC('bau_cu', { title: 'Ngày bầu cử', text: 'Năm nay cả nước bầu cử đại biểu Quốc hội và đại biểu Hội đồng nhân dân các cấp. Danh sách và tiểu sử ứng cử viên được niêm yết ở khu phố.', opts: [
    { k: 'tim_hieu', l: 'Đọc kỹ tiểu sử, chương trình hành động rồi đi bầu', ai: { smart: 1, w: 1.3 }, run: function (l, r, log) { log('Bạn đọc kỹ tiểu sử từng người, sáng chủ nhật cầm thẻ cử tri đi bầu từ sớm.', 'good'); H.fx(l, { kno: 1, karma: 1 }); l.flags.voted = (l.flags.voted || 0) + 1; } },
    { k: 'di_som', l: 'Đi bầu từ sáng sớm', ai: { w: 1.1 }, run: function (l, r, log) { log(pick(r, ['Bạn đi bầu từ sớm. Tổ bầu cử phát cho bạn tờ phiếu và hướng dẫn tận tình.', 'Lần đầu đi bầu cử, bạn hơi hồi hộp khi bỏ lá phiếu vào hòm.']), 'good'); l.flags.voted = (l.flags.voted || 0) + 1; } },
    { k: 'nho', l: 'Bận, nhờ người nhà bầu hộ', ai: { w: 0.5 }, run: function (l, r, log) { log('Tổ bầu cử giải thích: theo Luật Bầu cử, cử tri phải tự mình đi bầu, không được nhờ người khác bầu thay. Bạn thu xếp quay lại bỏ phiếu trước giờ đóng hòm.', 'neutral'); l.flags.voted = (l.flags.voted || 0) + 1; } }] });
  T('bau_cu', function (l, a) { var y = year(l); return vn(l) && a >= 18 && y >= 2026 && (y - 2026) % 5 === 0 && l.flags.votedAt !== y; }, function (l) { return (l.flags.voted || 0) < 2 ? 0.3 : 0.04; }, 4, 99, true);
  var bauApply = E.DEC.bau_cu.apply; E.DEC.bau_cu.apply = function (l) { l.flags.votedAt = year(l); return bauApply.apply(this, arguments); };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
