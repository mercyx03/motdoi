/* Một Đời — v2.4: tiêu dùng theo mức giàu có (xe điện → siêu xe, nhà phố → dinh thự), bất động sản cho thuê,
   mở cửa hàng / nhà hàng có chi nhánh hoặc phá sản, anh chị em ruột, chứng chỉ ngoại ngữ theo nơi định đến,
   kinh doanh sau khi nghỉ hưu, ghi nhớ những nước đã đặt chân đến. */
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
  function cash(l) { return Math.max(0, l.money); }

  // ===================================================================
  // 1. NGOẠI NGỮ: chứng chỉ theo nơi định đến
  // ===================================================================
  var LANG = {
    en: { n: 'tiếng Anh', cert: 'IELTS', lv: ['4.5', '5.5', '6.5', '7.5', '8.5'], land: 'nước nói tiếng Anh' },
    ja: { n: 'tiếng Nhật', cert: 'JLPT', lv: ['N5', 'N4', 'N3', 'N2', 'N1'], land: 'Nhật Bản' },
    ko: { n: 'tiếng Hàn', cert: 'TOPIK', lv: ['cấp 1', 'cấp 2', 'cấp 3', 'cấp 4', 'cấp 5', 'cấp 6'], land: 'Hàn Quốc' },
    zh: { n: 'tiếng Trung', cert: 'HSK', lv: ['1', '2', '3', '4', '5', '6'], land: 'Trung Quốc / Đài Loan' },
    de: { n: 'tiếng Đức', cert: 'Goethe', lv: ['A1', 'A2', 'B1', 'B2', 'C1'], land: 'Đức' }
  };
  var LANG_OF = { JP: 'ja', KR: 'ko', TW: 'zh', CN: 'zh', HK: 'zh', DE: 'de', AT: 'de', CH: 'de', US: 'en', GB: 'en', AU: 'en', CA: 'en', NZ: 'en', IE: 'en', SG: 'en' };
  var LANG_OF_NAME = { 'Nhật Bản': 'ja', 'Hàn Quốc': 'ko', 'Đài Loan': 'zh', 'Trung Quốc': 'zh', 'Đức': 'de', 'Hoa Kỳ': 'en', 'Úc': 'en', 'Anh': 'en', 'Canada': 'en', 'Singapore': 'en' };
  function langLv(l, k) { return (l.lang && l.lang[k]) || 0; }
  function langCert(l, k) { var L = LANG[k], v = langLv(l, k); return v ? L.cert + ' ' + L.lv[v - 1] : ''; }
  function langNext(l, k) { var v = langLv(l, k); return v < LANG[k].lv.length ? v + 1 : null; }
  // ngôn ngữ phù hợp hoàn cảnh: đang/định sang nước nào thì học tiếng nước đó
  function langCtx(l) {
    var ab = l.abroad, k = ab ? (LANG_OF[ab.code] || LANG_OF_NAME[ab.name]) : null;
    if (k) return k;
    if (l.flags && l.flags.langGoal) return l.flags.langGoal;
    return null;
  }
  function langLabel(l, k) {
    var L = LANG[k], nx = langNext(l, k);
    if (nx == null) return 'Đã có ' + langCert(l, k) + ' — trình độ cao nhất';
    return 'Học ' + L.n + ' — thi ' + L.cert + ' ' + L.lv[nx - 1] + (langLv(l, k) ? ' (đang có ' + L.lv[langLv(l, k) - 1] + ')' : '');
  }
  function inLand(l, k) { return !!(l.abroad && (LANG_OF[l.abroad.code] || LANG_OF_NAME[l.abroad.name]) === k); }
  function studyLang(l, k, r, log) {
    var L = LANG[k], v = langLv(l, k), nx = langNext(l, k);
    if (nx == null) { log('Bạn đã có chứng chỉ ' + L.n + ' cao nhất.', 'neutral'); return; }
    cashB(l, -(0.03 + v * 0.01), 'Học ' + L.n);
    var p = U.clamp(0.78 - v * 0.1 + (l.st.kno - 50) / 150 + (inLand(l, k) ? 0.2 : 0) - (l.age > 45 ? 0.1 : 0), 0.15, 0.95);
    l.lang = l.lang || {};
    if (ch(r, p)) {
      l.lang[k] = nx; l.uniTier = (l.uniTier || 1) + 0.03;
      log('Thi đỗ ' + langCert(l, k) + '! ' + (inLand(l, k) ? 'Giao tiếp với người bản xứ tự tin hẳn, chủ cũng nể hơn.' : nx >= 3 ? 'Hồ sơ xin việc sáng hẳn lên.' : 'Bước đầu đã đọc hiểu được kha khá.'), 'good');
      fx(l, { kno: 3, hap: 3 });
      if (inLand(l, k) && l.abroad.mult) l.abroad.mult *= 1.05;
      if (nx === LANG[k].lv.length) H.mem(l, 'Ngày cầm tấm chứng chỉ ' + langCert(l, k) + ' — bao năm học ' + L.n + ' không uổng.', 4);
    } else { log('Thi ' + L.cert + ' ' + L.lv[nx - 1] + ' nhưng trượt. Hẹn kỳ thi sau.', 'neutral'); fx(l, { kno: 1, hap: -2 }); }
  }
  H.LANG = LANG; H.langCert = langCert; H.langNext = langNext; H.langCtx = langCtx; H.langLabel = langLabel; H.studyLang = studyLang;

  // ===================================================================
  // 2. XE CỘ (v2.8): chọn theo số tiền đang có — từng phân khúc, từng mẫu xe với giá, thông số, ưu nhược điểm;
  // đủ tiền thì trả thẳng, chưa đủ thì gợi ý trả góp. Giá tham khảo đã gồm chi phí lăn bánh (triệu đồng, làm tròn).
  // tier (để tính chi phí nuôi xe, cảnh trong game): 0 xe máy · 1 ô tô phổ thông · 2 hạng sang · 3 thể thao · 4 siêu xe
  // ===================================================================
  // v3.0: chọn nhóm trước — 1. Xe máy (xe số, tay ga, xe điện, côn tay) · 2. Ô tô (phổ thông, thể thao, xe sang, siêu xe) · 3. Thuê xe chạy dịch vụ;
  // mỗi loại liệt kê mẫu xe từ rẻ đến đắt
  var SEGS = [
    { k: 'so', g: 'moto', n: 'Xe số', car: false, d: 'bền, rẻ, tiết kiệm xăng — hợp đi làm, chở hàng' },
    { k: 'ga', g: 'moto', n: 'Xe tay ga', car: false, d: 'cốp rộng, đi phố nhàn, kiểu dáng đẹp' },
    { k: 'dien', g: 'moto', n: 'Xe máy điện', car: false, d: 'êm, gần như không tốn nhiên liệu, phải sạc' },
    { k: 'con', g: 'moto', n: 'Xe côn tay & phân khối lớn', car: false, d: 'mạnh, thể thao, chạy đường dài' },
    { k: 'pho', g: 'car', n: 'Ô tô phổ thông', car: true, of: ['A', 'B', 'C', 'D'], d: 'từ xe cỡ nhỏ đi phố đến SUV 7 chỗ cho gia đình' },
    { k: 'sport', g: 'car', n: 'Xe thể thao', car: true, d: 'lái phấn khích, tăng tốc nhanh — ít chỗ, tốn kém' },
    { k: 'sang', g: 'car', n: 'Xe sang', car: true, of: ['L'], d: 'đẳng cấp, êm ái — nhưng nuôi xe tốn kém' },
    { k: 'super', g: 'car', n: 'Siêu xe', car: true, d: 'tốc độ, hàng hiếm — chi phí bảo dưỡng rất lớn' }
  ];
  var GROUPS = { moto: 'Xe máy', car: 'Ô tô' };
  // p: giá (triệu đ, đã gồm lăn bánh, làm tròn) · t: hạng · up: chi phí nuôi xe mỗi năm (× thu nhập cơ sở, ngoài xăng & gửi xe thông thường)
  var MODELS = [
    { k: 'wave', s: 'so', n: 'Honda Wave Alpha', p: 19, t: 0, sp: '110cc · ~1,7 L xăng/100 km', pro: 'rẻ, cực bền, dễ sửa ở đâu cũng có', con: 'đơn giản, ít tiện nghi' },
    { k: 'sirius', s: 'so', n: 'Yamaha Sirius', p: 22, t: 0, sp: '110cc · ~1,8 L/100 km', pro: 'bốc, tiết kiệm xăng', con: 'cốp nhỏ, ngồi sau hơi chật' },
    { k: 'blade', s: 'so', n: 'Honda Blade 110', p: 21, t: 0, sp: '110cc · phanh đĩa', pro: 'gọn, thể thao, rẻ', con: 'ít tiện ích' },
    { k: 'future', s: 'so', n: 'Honda Future 125', p: 33, t: 0, sp: '125cc phun xăng · ~1,5 L/100 km', pro: 'êm, bền, giữ giá', con: 'đắt so với xe số khác' },
    { k: 'vision', s: 'ga', n: 'Honda Vision', p: 34, t: 0, sp: '110cc · ~1,9 L/100 km · cốp 16 L', pro: 'nhẹ, dễ đi, hợp nữ và người mới', con: 'máy yếu khi chở nặng, lên dốc' },
    { k: 'janus', s: 'ga', n: 'Yamaha Janus', p: 31, t: 0, sp: '125cc · ~1,9 L/100 km', pro: 'rẻ nhất trong xe tay ga, nhẹ', con: 'cốp nhỏ, nhựa mỏng' },
    { k: 'lead', s: 'ga', n: 'Honda Lead', p: 42, t: 0, sp: '125cc · cốp 37 L', pro: 'cốp siêu rộng, sàn để chân lớn', con: 'dáng không thể thao' },
    { k: 'airblade', s: 'ga', n: 'Honda Air Blade 160', p: 58, t: 0, sp: '160cc · phanh ABS', pro: 'mạnh, giữ giá tốt', con: 'yên cao, xe nặng' },
    { k: 'shmode', s: 'ga', n: 'Honda SH Mode', p: 62, t: 0, sp: '125cc · khóa thông minh', pro: 'sang, hợp đi làm văn phòng', con: 'giá cao, dễ bị nhắm trộm' },
    { k: 'vespa', s: 'ga', n: 'Vespa Sprint', p: 85, t: 0, sp: '125cc · thân thép nguyên khối', pro: 'đẹp, cá tính kiểu Ý', con: 'đắt, bảo dưỡng tốn' },
    { k: 'sh160', s: 'ga', n: 'Honda SH 160i', p: 100, t: 0, sp: '160cc · ABS · khóa thông minh', pro: '"vua tay ga", rất giữ giá', con: 'đắt, nặng, dễ bị trộm' },
    { k: 'evo', s: 'dien', n: 'VinFast Evo200', p: 23, t: 0, sp: '~200 km/lần sạc · 70 km/h', pro: 'đi lại gần như miễn phí, êm', con: 'sạc lâu, đi tỉnh xa bất tiện' },
    { k: 'yadea', s: 'dien', n: 'Yadea Voltguard', p: 27, t: 0, sp: '~120 km/lần sạc', pro: 'giá mềm, nhiều mẫu mã', con: 'pin chai nhanh nếu sạc ẩu' },
    { k: 'feliz', s: 'dien', n: 'VinFast Feliz S', p: 30, t: 0, sp: '~198 km/lần sạc · cốp rộng', pro: 'dáng tay ga, không tốn xăng', con: 'pin thuê hoặc mua, nặng' },
    { k: 'theon', s: 'dien', n: 'VinFast Theon S', p: 63, t: 0, sp: '~150 km/lần sạc · 99 km/h', pro: 'mạnh như xe xăng 150cc', con: 'giá cao' },
    { k: 'winner', s: 'con', n: 'Honda Winner X', p: 48, t: 0, sp: '150cc côn tay · ABS', pro: 'mạnh, an toàn', con: 'yên cứng khi đi xa' },
    { k: 'exciter', s: 'con', n: 'Yamaha Exciter 155', p: 52, t: 0, sp: '155cc côn tay · ~2,1 L/100 km', pro: 'mạnh, bốc, "chất" với dân chơi xe', con: 'đi phố kẹt xe mỏi tay côn' },
    { k: 'z900', s: 'con', n: 'Kawasaki Z900', p: 330, t: 0, sp: '948cc · 125 mã lực', pro: 'đỉnh của xe phân khối lớn', con: 'cần bằng A, nóng máy, đắt', up: 0.03 },
    { k: 'vf3', s: 'A', n: 'VinFast VF 3 (điện)', p: 330, t: 1, sp: '4 chỗ · ~210 km/lần sạc', pro: 'rẻ nhất, đi phố siêu tiện', con: 'nhỏ, đi xa phải sạc' },
    { k: 'morning', s: 'A', n: 'Kia Morning', p: 410, t: 1, sp: '1.25L · ~5,5 L/100 km', pro: 'nhỏ gọn, dễ lái cho người mới', con: 'chật khi đi 4 người lớn' },
    { k: 'i10', s: 'A', n: 'Hyundai Grand i10', p: 420, t: 1, sp: '1.2L · ~5,5 L/100 km', pro: 'rẻ, tiết kiệm, nhiều đồ chơi', con: 'cách âm kém, ồn ở tốc độ cao' },
    { k: 'vf5', s: 'B', n: 'VinFast VF 5 (điện)', p: 520, t: 1, sp: 'gầm cao 5 chỗ · ~326 km/lần sạc', pro: 'chi phí vận hành rất thấp', con: 'phụ thuộc trạm sạc khi đi xa' },
    { k: 'vios', s: 'B', n: 'Toyota Vios', p: 560, t: 1, sp: 'sedan 1.5L · ~5,8 L/100 km', pro: 'bền, giữ giá, chạy dịch vụ cũng tốt', con: 'thiết kế đơn giản' },
    { k: 'accent', s: 'B', n: 'Hyundai Accent', p: 570, t: 1, sp: 'sedan 1.5L', pro: 'nhiều tiện nghi so với giá', con: 'mất giá nhanh hơn xe Nhật' },
    { k: 'city', s: 'B', n: 'Honda City', p: 600, t: 1, sp: 'sedan 1.5L · 119 mã lực', pro: 'lái hay, rộng nhất phân khúc', con: 'cách âm trung bình' },
    { k: 'yariscross', s: 'B', n: 'Toyota Yaris Cross', p: 720, t: 1, sp: 'gầm cao · có bản hybrid', pro: 'tiết kiệm, an toàn', con: 'giá cao trong hạng B' },
    { k: 'mazda3', s: 'C', n: 'Mazda 3', p: 720, t: 1, sp: 'sedan 1.5L · nội thất đẹp', pro: 'đẹp, nhiều trang bị', con: 'hàng ghế sau hơi chật' },
    { k: 'cx5', s: 'C', n: 'Mazda CX-5', p: 860, t: 1, sp: 'SUV 5 chỗ 2.0L', pro: 'đẹp, đầm, bán chạy', con: 'ồn lốp ở tốc độ cao' },
    { k: 'vf7', s: 'C', n: 'VinFast VF 7 (điện)', p: 900, t: 1, sp: 'SUV điện · ~430 km/lần sạc', pro: 'mạnh, êm, nhiều công nghệ', con: 'mất giá nhanh' },
    { k: 'crv', s: 'C', n: 'Honda CR-V', p: 1150, t: 1, sp: 'SUV 5+2 chỗ · 1.5 turbo', pro: 'rộng, lái hay, có bản hybrid', con: 'giá cao' },
    { k: 'vf8', s: 'D', n: 'VinFast VF 8 (điện)', p: 1200, t: 1, sp: 'SUV điện · ~470 km/lần sạc', pro: 'mạnh, rộng, êm', con: 'mất giá nhanh', up: 0.01 },
    { k: 'fortuner', s: 'D', n: 'Toyota Fortuner', p: 1250, t: 1, sp: 'SUV 7 chỗ máy dầu', pro: 'bền, đi đường xấu tốt', con: 'cứng, ồn hơn SUV đô thị', up: 0.02 },
    { k: 'everest', s: 'D', n: 'Ford Everest', p: 1350, t: 1, sp: 'SUV 7 chỗ · 2.0 turbo', pro: 'mạnh, nhiều công nghệ an toàn', con: 'to, khó đi phố hẹp', up: 0.02 },
    { k: 'camry', s: 'D', n: 'Toyota Camry', p: 1350, t: 1, sp: 'sedan hạng D · có hybrid', pro: 'êm, "xe sếp", giữ giá', con: 'không hợp đường xấu', up: 0.02 },
    { k: 'gr86', s: 'sport', n: 'Toyota GR86', p: 1800, t: 3, sp: 'coupe 2+2 · 2.4L 228 mã lực · dẫn động cầu sau', pro: 'xe thể thao "rẻ" nhất, lái rất vui', con: 'chật, cứng, ồn', up: 0.06 },
    { k: 'mustang', s: 'sport', n: 'Ford Mustang EcoBoost', p: 3000, t: 3, sp: 'coupe 2.3 turbo · 0–100 km/h ~5,5 giây', pro: 'dáng cơ bắp Mỹ, cả phố ngoái nhìn', con: 'uống xăng, hàng ghế sau chật', up: 0.1 },
    { k: 'z4', s: 'sport', n: 'BMW Z4 sDrive30i', p: 3300, t: 3, sp: 'mui trần 2 chỗ · 258 mã lực', pro: 'mui trần đẹp, lái chính xác', con: 'chỉ 2 chỗ, cốp nhỏ', up: 0.12 },
    { k: 'cayman', s: 'sport', n: 'Porsche 718 Cayman', p: 4300, t: 3, sp: 'động cơ đặt giữa · 300 mã lực', pro: 'cân bằng tuyệt vời, thương hiệu Porsche', con: 'đắt, nhiều tùy chọn tính thêm tiền', up: 0.2 },
    { k: 'porsche911', s: 'sport', n: 'Porsche 911 Carrera', p: 9000, t: 3, sp: 'xe thể thao · 0–100 km/h ~4 giây', pro: 'biểu tượng xe thể thao', con: 'chỉ 2+2 chỗ, nuôi xe rất tốn', up: 0.4 },
    { k: 'bmw3', s: 'L', n: 'BMW 330i', p: 1900, t: 2, sp: 'sedan sang · lái thể thao', pro: 'lái hay nhất hạng sang cỡ nhỏ', con: 'cứng, bảo dưỡng đắt', up: 0.12 },
    { k: 'cclass', s: 'L', n: 'Mercedes-Benz C 300', p: 2000, t: 2, sp: 'sedan sang · 2.0 turbo 258 mã lực', pro: 'đẳng cấp, nội thất đẹp', con: 'bảo dưỡng đắt', up: 0.12 },
    { k: 'glc', s: 'L', n: 'Mercedes-Benz GLC 300', p: 2700, t: 2, sp: 'SUV sang 5 chỗ', pro: 'sang, gầm cao', con: 'đắt', up: 0.15 },
    { k: 'x5', s: 'L', n: 'BMW X5', p: 4300, t: 2, sp: 'SUV sang 5+2 chỗ · 3.0 turbo', pro: 'mạnh, rộng, lái hay', con: 'bảo dưỡng rất đắt', up: 0.18 },
    { k: 'lexusrx', s: 'L', n: 'Lexus RX 350h', p: 4300, t: 2, sp: 'SUV sang hybrid', pro: 'êm, bền, rất giữ giá', con: 'giá rất cao', up: 0.15 },
    { k: 's450', s: 'L', n: 'Mercedes-Benz S 450', p: 5300, t: 2, sp: 'sedan siêu sang · "chuyên cơ mặt đất"', pro: 'êm nhất, ghế sau như phòng khách', con: 'mất giá rất nhanh', up: 0.25 },
    { k: 'lx600', s: 'L', n: 'Lexus LX 600', p: 9000, t: 2, sp: 'SUV 7 chỗ siêu sang · 3.5 V6 tăng áp kép', pro: '"chuyên cơ" off-road, cực bền', con: 'rất đắt, uống xăng', up: 0.3 },
    { k: 'rangerover', s: 'L', n: 'Range Rover', p: 11000, t: 2, sp: 'SUV siêu sang Anh Quốc', pro: 'sang trọng bậc nhất, êm', con: 'đắt, sửa chữa tốn', up: 0.45 },
    { k: 'cullinan', s: 'L', n: 'Rolls-Royce Cullinan', p: 40000, t: 4, sp: 'SUV siêu sang V12', pro: 'đỉnh cao xa xỉ', con: 'gần như không có', up: 1.5 },
    { k: 'artura', s: 'super', n: 'McLaren Artura', p: 16000, t: 4, sp: 'siêu xe hybrid V6 · 680 mã lực', pro: 'nhẹ, công nghệ F1', con: 'gầm thấp, ít đại lý bảo dưỡng', up: 1 },
    { k: 'huracan', s: 'super', n: 'Lamborghini Huracán', p: 20000, t: 4, sp: 'siêu xe V10 · 0–100 km/h ~3 giây', pro: 'cả phố ngoái nhìn', con: 'gầm thấp, khó đi đường Việt Nam', up: 1.2 },
    { k: 'f296', s: 'super', n: 'Ferrari 296 GTB', p: 22000, t: 4, sp: 'siêu xe V6 hybrid · 830 mã lực', pro: 'ngựa chồm Ý, âm thanh mê hoặc', con: 'bảo dưỡng cực đắt', up: 1.3 },
    { k: 'revuelto', s: 'super', n: 'Lamborghini Revuelto', p: 45000, t: 4, sp: 'siêu xe V12 hybrid · 1.015 mã lực', pro: 'hàng hiếm, đỉnh của Lamborghini', con: 'gần như không thể đi phố', up: 2 }
  ];
  MODELS.sort(function (a, b) { return a.p - b.p; }); // mẫu xe liệt kê từ rẻ đến đắt
  var CARS = MODELS.filter(function (m) { return m.t >= 1; }).map(function (m) { return { k: m.k, n: m.n, p: m.p / 100, t: m.t, up: m.up || 0 }; }); // tương thích cũ
  function vnd(l) { return isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  // giá theo tiền đang dùng: ở VN là triệu đồng; nước khác quy đổi theo mức sống
  // v3.6: ở nước ngoài giá xe quy theo đô la Mỹ thực tế (giá ở VN gồm nhiều thuế phí, xe sang / siêu xe đắt gấp đôi, gấp ba) rồi đổi theo mức giá nước đó
  function usdOf(m) { var u = m.p * 1e6 / 25400; return u * (m.t === 0 ? 0.9 : m.t === 1 ? 0.8 : m.t === 2 ? 0.6 : 0.42); }
  function priceOf(l, m) { if (vnd(l)) return m.p; var W = G.W, c = W && W.BY[l.abroad && l.abroad.perm ? l.abroad.code : l.country], g = (c && c.gdp) || l.gdp || 20; return usdOf(m) / G.CUR.priceLevel(g); }
  // phân khúc cũ (A, B, C, D, L, S) vẫn dùng được
  var OLDSEG = { A: 'pho', B: 'pho', C: 'pho', D: 'pho', L: 'sang', S: 'super' };
  function seg(k) { return SEGS.filter(function (s) { return s.k === k; })[0] || SEGS.filter(function (s) { return s.k === OLDSEG[k]; })[0] || SEGS[0]; }
  function members(k) { if (k === 'S') return ['sport', 'super']; if (/^[ABCD]$/.test(k)) return [k]; var s = seg(k); return s.of || [s.k]; }
  function vehTier(l) { return l.veh === 'ô tô' ? (l.vehTier || 1) : 0; }
  function carByK(k) { return MODELS.filter(function (c) { return c.k === k; })[0] || null; }
  function haveFor(l, m) { var sameKind = (l.veh === 'ô tô') === (m.t >= 1); return Math.max(0, l.money) + (l.veh && sameKind ? l.vehVal || 0 : 0); } // đổi cùng loại thì bán xe cũ
  function canLoan(l, m) { return m.t <= 3 && l.indep && H.loanAgeOk(l, m.t >= 1 ? 'car' : 'fin'); }
  function affordCash(l, m) { return haveFor(l, m) >= priceOf(l, m); }
  function affordLoan(l, m) { return canLoan(l, m) && haveFor(l, m) >= priceOf(l, m) * 0.3 && priceOf(l, m) <= Math.max(l.income || 0, l.base * 0.5) * 3.5; }
  function suits(l, m) { return m.t >= 1 ? !(l.veh === 'ô tô' && l.vehK === m.k) && m.t >= vehTier(l) - 1 : l.veh !== 'ô tô' && l.vehK !== m.k; }
  function buyModel(l, m, loan, log) {
    var price = priceOf(l, m), isCar = m.t >= 1, sameKind = (l.veh === 'ô tô') === isCar;
    if (l.veh && sameKind && l.vehVal > 0) { H.cash(l, l.vehVal, 'Bán ' + (l.vehName || l.veh) + ' cũ'); log('Bán lại ' + (l.vehName || l.veh) + ' cũ được ' + mo(l, l.vehVal) + '.', 'neutral'); }
    H.cash(l, -price, 'Mua ' + m.n);
    if (loan) H.addLoan(l, isCar ? 'car' : 'fin', price * 0.7);
    var first = isCar && l.veh !== 'ô tô';
    l.veh = isCar ? 'ô tô' : 'xe máy'; l.vehVal = price; l.vehTier = isCar ? m.t : 0; l.vehName = m.n; l.vehK = m.k; l.vehUp = m.up || 0; l.vehSeg = m.s; l.vehBoughtAt = l.age;
    log('Mua ' + m.n + (loan ? ' trả góp (trả trước 30%, vay ' + (isCar ? 'ngân hàng' : 'công ty tài chính') + ' 70%)' : ' bằng tiền mặt') + ' — ' + m.sp + '.', m.t >= 3 ? 'big' : 'good');
    fx(l, { hap: isCar ? 6 + m.t * 3 : 4, soc: m.t >= 2 ? 3 : 0 });
    if (first) H.mem(l, 'Lần đầu lái chiếc ' + m.n + ' của chính mình về quê, cả xóm ra xem.', 4);
    else if (m.t >= 3) H.mem(l, 'Ngày chiếc ' + m.n + ' lăn bánh ra khỏi showroom, người qua đường ngoái lại nhìn.', 5);
    if (isCar ? !l.lic.B : !l.lic.A1) log('Bạn chưa có bằng lái ' + (isCar ? 'ô tô' : 'xe máy') + ' — ra đường có nguy cơ bị phạt.', 'neutral');
  }
  function segRange(l, s) { var ms = MODELS.filter(function (m) { return members(s.k).indexOf(m.s) >= 0; }); return [Math.min.apply(null, ms.map(function (m) { return priceOf(l, m); })), Math.max.apply(null, ms.map(function (m) { return priceOf(l, m); }))]; }
  function segModels(l, k) { var ms = members(k); return MODELS.filter(function (m) { return ms.indexOf(m.s) >= 0 && suits(l, m); }); }
  function segOk(l, k) { return segModels(l, k).some(function (m) { return affordCash(l, m) || affordLoan(l, m); }); }
  function grpSegs(g) { return SEGS.filter(function (s) { return s.g === g; }); }
  function grpRange(l, g) { var lo = Infinity, hi = 0; grpSegs(g).forEach(function (s) { var x = segRange(l, s); lo = Math.min(lo, x[0]); hi = Math.max(hi, x[1]); }); return [lo, hi]; }
  function segAI(l, s) { var ms = segModels(l, s.k), cashOk = ms.filter(function (m) { return affordCash(l, m); }); var top = Math.max.apply(null, [0].concat(cashOk.map(function (m) { return m.t; }))); return cashOk.length ? (s.car ? 1.2 + top : l.veh === 'ô tô' ? 0.1 : 1) : 0.25; }
  function budgetText(l) {
    var cash = Math.max(0, l.money), old = l.veh && l.vehVal > 0 ? l.vehVal : 0;
    return 'Tiền mặt hiện có ' + mo(l, cash) + (old ? ', cộng tiền bán ' + (l.vehName || l.veh) + ' cũ khoảng ' + mo(l, old) : '') + '.';
  }
  function isDriver(l) { var c = l.job ? E.jobDef(l) : null; return !!(c && (c.tag === 'driver' || /^(xe_om|tx_cn|shipper|tai_xe_tai)$/.test(c.id))); }
  // bước 1: xe máy hay ô tô (hay thuê xe chạy dịch vụ)
  SC('mua_xe', {
    title: 'Mua xe',
    text: function (l) { return (l.veh ? 'Bạn đang đi ' + (l.vehName || l.veh) + '. ' : '') + (l.rentVeh ? 'Đang thuê ' + l.rentVeh.n + ' chạy dịch vụ. ' : '') + budgetText(l) + ' Bạn muốn xem loại xe nào?'; },
    opts: ['moto', 'car'].map(function (g, i) {
      return {
        k: 'g_' + g, l: function (l) { var x = grpRange(l, g); return (i + 1) + '. ' + GROUPS[g] + ' · ' + mo(l, x[0]) + ' – ' + mo(l, x[1]); },
        h: function (l) { return grpSegs(g).filter(function (s) { return segOk(l, s.k); }).map(function (s) { return s.n.toLowerCase(); }).join(' · ') || 'chưa đủ tiền'; },
        req: function (l) { return grpSegs(g).some(function (s) { return segOk(l, s.k); }); },
        ai: function (l) { return Math.max.apply(null, grpSegs(g).filter(function (s) { return segOk(l, s.k); }).map(function (s) { return segAI(l, s); }).concat([0])); },
        run: function (l, r, log) { l.pending.unshift(E.DEC.mua_xe_loai.make(l, r, { g: g })); }
      };
    }).concat([
      { k: 'rent', l: '3. Thuê xe chạy dịch vụ (Xanh SM, Grab, Be…)', h: 'Không cần bỏ vốn mua xe, trả tiền thuê hằng tháng', req: function (l) { return isDriver(l) && !l.rentVeh && !!E.DEC.thue_xe; }, ai: { w: 0.6 }, run: function (l, r, log) { l.pending.unshift(E.DEC.thue_xe.make(l, r)); } },
      { k: 'no', l: 'Thôi, chưa mua', ai: { w: 0.4 }, run: function () { } }])
  });
  // bước 2: chọn loại xe trong nhóm
  SC('mua_xe_loai', {
    title: function (l, d) { return 'Mua ' + (GROUPS[d.g] || 'xe').toLowerCase(); },
    prep: function (l, r, arg) { return { g: (arg && arg.g) || 'moto' }; },
    valid: function (l, d) { return grpSegs((d && d.g) || 'moto').some(function (s) { return segOk(l, s.k); }); },
    text: function (l, d) { return budgetText(l) + ' Chọn loại ' + GROUPS[d.g].toLowerCase() + ':'; },
    opts: SEGS.map(function (s) {
      return {
        k: 'seg_' + s.k, l: function (l) { var g = segRange(l, s); return s.n + ' · ' + mo(l, g[0]) + (g[1] > g[0] ? ' – ' + mo(l, g[1]) : ''); },
        h: function (l) { var ms = segModels(l, s.k), c = ms.filter(function (m) { return affordCash(l, m); }).length, g = ms.filter(function (m) { return !affordCash(l, m) && affordLoan(l, m); }).length; return s.d + ' · ' + (c ? 'trả thẳng được ' + c + ' mẫu' + (g ? ', trả góp thêm ' + g + ' mẫu' : '') : 'cần trả góp'); },
        req: function (l, d) { return d.g === s.g && segOk(l, s.k); },
        ai: function (l) { return segAI(l, s); },
        run: function (l, r, log) { l.pending.unshift(E.DEC.mua_xe_mau.make(l, r, { s: s.k })); }
      };
    }).concat([{ k: 'back', l: 'Quay lại', ai: { w: 0.05 }, run: function (l, r, log) { l.pending.unshift(E.DEC.mua_xe.make(l, r)); } }, { k: 'no', l: 'Thôi, chưa mua', ai: { w: 0.3 }, run: function () { } }])
  });
  // bước 3: chọn mẫu xe (từ rẻ đến đắt) — trả thẳng nếu đủ tiền, không thì trả góp
  SC('mua_xe_mau', {
    title: function (l, d) { return seg(d.s || 'so').n; },
    prep: function (l, r, arg) { var k = arg && arg.s; if (!k) { var ok = SEGS.filter(function (s) { return segOk(l, s.k); }); k = ok.length ? ok[ok.length - 1].k : 'so'; } return { s: k }; },
    valid: function (l, d) { return segModels(l, (d && d.s) || 'so').length > 0; },
    text: function (l, d) { return budgetText(l) + ' Các mẫu ' + seg(d.s).n.toLowerCase() + ' phù hợp với bạn, từ rẻ đến đắt:'; },
    opts: [].concat.apply([], MODELS.map(function (m) {
      var info = function (l) { return m.sp + ' · ưu: ' + m.pro + ' · nhược: ' + m.con + (m.up ? ' · nuôi xe ~' + mb(l, m.up) + '/năm' : ''); };
      return [{
        k: 'm_' + m.k, l: function (l) { return m.n + ' — ' + mo(l, priceOf(l, m)) + ' · trả thẳng'; }, h: info,
        req: function (l, d) { return members(d.s).indexOf(m.s) >= 0 && suits(l, m) && affordCash(l, m); },
        ai: function (l) { return 0.5 + priceOf(l, m) / Math.max(1, haveFor(l, m)) * 2; },
        run: function (l, r, log) { buyModel(l, m, false, log); }
      }, {
        k: 'g_' + m.k, l: function (l) { return m.n + ' — ' + mo(l, priceOf(l, m)) + ' · trả góp'; },
        h: function (l) { if (E.loanPlan) return E.loanPlan(l, priceOf(l, m), m.t >= 1 ? 'car' : 'fin'); return 'Trả trước ' + mo(l, priceOf(l, m) * 0.3) + ', vay ' + mo(l, priceOf(l, m) * 0.7) + (m.t >= 1 ? ' ngân hàng (lãi ~10%/năm, trả mỗi năm ~' : ' công ty tài chính (lãi cao, trả mỗi năm ~') + mo(l, priceOf(l, m) * 0.7 * (m.t >= 1 ? 0.25 : 0.4)) + ') · ' + m.sp; },
        req: function (l, d) { return members(d.s).indexOf(m.s) >= 0 && suits(l, m) && !affordCash(l, m) && affordLoan(l, m); },
        ai: { w: 0.4, risk: 0.8 },
        run: function (l, r, log) {
          if (m.t >= 1 && (!H.canBankLoan(l) || (l.income || 0) <= 0)) { log('Ngân hàng từ chối cho vay mua ' + m.n + ': ' + (H.canBankLoan(l) ? 'không chứng minh được thu nhập.' : 'hồ sơ đang có nợ xấu.'), 'bad'); fx(l, { hap: -3 }); return; }
          buyModel(l, m, true, log);
        }
      }];
    })).concat([{ k: 'back', l: 'Xem loại xe khác', ai: { w: 0.1 }, run: function (l, r, log, d) { l.pending.unshift(E.DEC.mua_xe_loai.make(l, r, { g: seg(d.s).g })); } }, { k: 'no', l: 'Thôi, chưa mua', ai: { w: 0.2 }, run: function () { } }])
  });
  E.ACT.forEach(function (a) { if (a.id === 'mua_xe') { a.l = 'Mua xe / đổi xe'; a.avail = function (l) { return l.vehK === 'cullinan' ? 'Đã có xe đắt nhất' : true; }; a.ai = function (l) { return E.netWorth(l) > l.base * 40 && vehTier(l) < 3 ? 0.3 : vehTier(l) >= 1 ? 0.04 : 0.4; }; } });

  // ===================================================================
  // 3. NHÀ Ở THEO MỨC GIÀU CÓ: nhà bình thường → nhà phố → căn hộ cao cấp → biệt thự → dinh thự
  // ===================================================================
  var HOMES = [
    { t: 1, n: 'nhà bình thường', k: 1, up: 0 },
    { t: 2, n: 'nhà phố nhiều tầng', k: 2, up: 0.01 },
    { t: 3, n: 'căn hộ cao cấp', k: 2.6, up: 0.04 },
    { t: 4, n: 'biệt thự có sân vườn', k: 6, up: 0.12 },
    { t: 5, n: 'dinh thự', k: 18, up: 0.45 }
  ];
  function homeTier(l) { return l.ownHouse ? (l.houseTier || 1) : 0; }
  function homeName(l) { return l.ownHouse ? (l.houseName || 'nhà riêng') : ''; }
  function homeDebt(l) { return (l.loans || []).filter(function (x) { return x.type === 'home'; }).reduce(function (s, x) { return s + x.bal; }, 0) + (l.mortgage || 0); }
  SC('doi_nha', {
    title: 'Đổi nhà', valid: function (l) { return l.ownHouse && l.indep; },
    text: function (l) { return 'Bạn đang ở ' + homeName(l) + ' trị giá khoảng ' + mo(l, l.houseVal) + (homeDebt(l) > 0.5 ? ' (còn nợ ngân hàng ' + mo(l, homeDebt(l)) + ')' : '') + '. Tiền mặt ' + mo(l, l.money) + '. Bán nhà cũ để lên nhà mới?'; },
    opts: HOMES.slice(1).map(function (h) {
      return {
        k: 'h' + h.t, l: function (l) { return 'Chuyển lên ' + h.n; }, h: function (l) { return mo(l, H.housePrice(l) * h.k) + (h.up ? ' · chi phí duy trì ~' + mb(l, h.up) + '/năm' : ''); },
        req: function (l) { return homeTier(l) < h.t; }, ai: { w: h.t <= 3 ? 1 : 0.5, amb: 1 },
        run: function (l, r, log) {
          var price = H.housePrice(l) * h.k, net = l.houseVal - homeDebt(l), have = l.money + net;
          var canLoan = H.canBankLoan(l) && (l.income || 0) > 0 && H.loanAgeOk(l, 'home');
          if (have < price && !(canLoan && have >= price * 0.5)) { log('Đi xem ' + h.n + ' vài lần, tính tới tính lui vẫn chưa đủ tiền.', 'neutral'); return; }
          // bán nhà cũ, tất toán nợ nhà cũ
          var oldDebt = homeDebt(l);
          H.cash(l, l.houseVal, 'Bán nhà cũ');
          if (oldDebt > 0.5) H.cash(l, -oldDebt, 'Tất toán nợ nhà cũ');
          l.loans = (l.loans || []).filter(function (x) { return x.type !== 'home'; }); l.mortgage = 0;
          H.cash(l, -price, 'Mua ' + h.n);
          if (l.money < 0) H.addLoan(l, 'home', -l.money + l.base * 0.2);
          l.houseVal = price; l.houseTier = h.t; l.houseName = h.n;
          log('Bán nhà cũ, dọn về ' + h.n + (homeDebt(l) > 0.5 ? ' (vay ngân hàng phần còn thiếu)' : '') + '.', 'big');
          fx(l, { hap: 6 + h.t, soc: h.t >= 4 ? 4 : 1 });
          H.mem(l, h.t >= 4 ? 'Đêm đầu tiên ở ' + h.n + ', đi một vòng quanh nhà mà vẫn chưa tin là của mình.' : 'Ngày chuyển về ' + h.n + '.', h.t >= 4 ? 5 : 3);
        }
      };
    }).concat([{ k: 'no', l: 'Ở nhà cũ cho quen', ai: { w: 1 }, run: function () { } }])
  });
  A('doi_nha', 'Tiền bạc', 'Đổi nhà to hơn', { min: 25, avail: function (l) { return !l.ownHouse ? 'Chưa có nhà riêng' : homeTier(l) >= 5 ? 'Đã ở dinh thự' : l.money + l.houseVal - homeDebt(l) < H.housePrice(l) * 1.5 ? 'Chưa đủ tiền' : true; }, ai: function (l) { return E.netWorth(l) > H.housePrice(l) * 4 ? 0.25 : 0.02; } });
  // lần đầu mua nhà: gắn hạng nhà
  E.HOOKS.year.push(function (l) { if (l.ownHouse && !l.houseTier) { l.houseTier = 1; l.houseName = l.houseName || 'nhà riêng'; } if (!l.ownHouse) { l.houseTier = 0; } });

  // ===================================================================
  // 4. ĐẦU TƯ KINH DOANH: nhà cho thuê, cửa hàng, nhà hàng — có lãi thì mở chi nhánh, thua lỗ thì phá sản
  // ===================================================================
  var PROPS = [
    { k: 'apt', n: 'căn hộ cho thuê', mult: 0.8, y: 0.05 },
    { k: 'shop', n: 'nhà mặt phố cho thuê', mult: 2.5, y: 0.06 },
    { k: 'kiot', n: 'ki-ốt ở chợ cho thuê', mult: 0.35, y: 0.07 }
  ];
  // v3.0: lãi lỗ theo thực tế — vốn đầu tư, doanh thu mỗi tháng (triệu đồng, mức trung bình ở thành phố), chi phí biến đổi (giá vốn, nguyên liệu, hoa hồng)
  // và chi phí cố định (mặt bằng, nhân viên, điện nước, khấu hao). Đông khách thì lãi đậm; vắng khách thì ngành nhiều chi phí cố định (spa, gym, cà phê) lỗ nhanh.
  var BIZ = [
    { k: 'store', n: 'cửa hàng tiện lợi', cap: 700, rev: 220, vc: 0.82, mg: 0.08, sd: 0.14, cost: 'nhập hàng, mặt bằng, 4 nhân viên ca' },
    { k: 'cafe', n: 'quán cà phê', cap: 450, rev: 85, vc: 0.35, mg: 0.17, sd: 0.2, cost: 'mặt bằng, pha chế, nguyên liệu' },
    { k: 'rest', n: 'nhà hàng', cap: 2200, rev: 550, vc: 0.45, mg: 0.12, sd: 0.18, cost: 'mặt bằng, đầu bếp, phục vụ, thực phẩm' },
    { k: 'spa', n: 'spa / thẩm mỹ viện', cap: 1800, rev: 320, vc: 0.25, mg: 0.2, sd: 0.2, cost: 'mặt bằng, kỹ thuật viên, máy móc, mỹ phẩm' },
    { k: 'gym', n: 'phòng tập gym', cap: 1500, rev: 180, vc: 0.15, mg: 0.2, sd: 0.16, cost: 'mặt bằng, máy tập, huấn luyện viên' },
    // v3.3: có nhiều tiền thì mở khách sạn, resort — lãi trên vốn thấp hơn nhưng quy mô lớn; dễ điêu đứng khi du lịch đóng băng
    { k: 'hotel', n: 'khách sạn mini', cap: 8000, rev: 900, vc: 0.3, mg: 0.18, sd: 0.15, cost: 'nhân viên lễ tân, buồng phòng, điện nước, khấu hao', tour: 1 },
    { k: 'hotel4', n: 'khách sạn 4 sao', cap: 60000, rev: 5500, vc: 0.35, mg: 0.15, sd: 0.14, cost: 'hàng trăm nhân viên, nhà hàng, hồ bơi, khấu hao', tour: 1 },
    { k: 'resort', n: 'resort nghỉ dưỡng ven biển', cap: 150000, rev: 11000, vc: 0.3, mg: 0.14, sd: 0.16, cost: 'nhân sự, bảo dưỡng biệt thự, bãi biển, khấu hao', tour: 1 }
  ];
  BIZ.forEach(function (b) { b.mu = b.mg * b.rev * 12 / b.cap; }); // tỉ suất lãi trên vốn khi làm ăn bình thường (để tương thích)
  function bizV(l, x) { return vnd(l) ? x : x / 90 * l.base; } // ra tiền đang dùng: VN là triệu đồng, nước khác quy theo mức sống
  function bizOf(k) { return BIZ.filter(function (b) { return b.k === k; })[0] || BIZ[0]; }
  function venFix(l, v) { // đời chơi từ bản cũ: suy ra doanh thu theo vốn
    var b = bizOf(v.k);
    if (v.R == null) { v.R = bizV(l, b.rev) * 12 * (v.unit || v.cap) / bizV(l, b.cap); v.q = v.q || 1; }
    if (v.q == null) v.q = 1;
    return b;
  }
  function propPrice(l, p) { return (!vnd(l) && E.homeMin ? E.homeMin(l) * 1.6 : H.housePrice(l)) * p.mult; } // v3.6: ở nước ngoài giá nhà cho thuê theo giá nhà nơi đó
  SC('dau_tu_lon', {
    title: 'Đầu tư làm ăn',
    text: function (l) {
      var n = (l.props || []).length, v = (l.ventures || []).length;
      return 'Bạn có ' + mo(l, l.money) + ' tiền mặt' + (n ? ', ' + n + ' bất động sản cho thuê' : '') + (v ? ', ' + v + ' cơ sở kinh doanh' : '') + '. Tiền để không thì mất giá, đầu tư thì có lãi có lỗ.';
    },
    opts: PROPS.map(function (p) {
      return { k: 'p_' + p.k, l: 'Mua ' + p.n, h: function (l) { return mo(l, propPrice(l, p)) + ' · thu tiền thuê ~' + Math.round(p.y * 100) + '%/năm'; },
        req: function (l) { return cash(l) >= propPrice(l, p); }, ai: { w: 1, smart: 0.5 },
        run: function (l, r, log) {
          var v = propPrice(l, p); H.cash(l, -v, 'Mua ' + p.n);
          (l.props = l.props || []).push({ k: p.k, n: p.n, v: v, basis: v, y: p.y, since: l.age, empty: 0 });
          log('Mua ' + p.n + ' giá ' + mo(l, v) + ', tìm được người thuê ngay tháng sau.', 'good'); fx(l, { hap: 4 });
          if ((l.props || []).length === 1) H.mem(l, 'Tháng đầu tiên nhận tiền cho thuê nhà — tiền tự sinh ra tiền.', 3);
        } };
    }).concat(BIZ.map(function (b) {
      return { k: 'b_' + b.k, l: 'Mở ' + b.n, h: function (l) { return 'Vốn khoảng ' + mo(l, bizV(l, b.cap)) + ' · doanh thu ~' + mo(l, bizV(l, b.rev)) + '/tháng · lãi ròng ~' + mo(l, bizV(l, b.rev * b.mg)) + '/tháng nếu đông khách, vắng khách vẫn phải trả ' + b.cost; },
        req: function (l) { return cash(l) >= bizV(l, b.cap) && !(l.ventures || []).some(function (v) { return v.k === b.k; }); }, ai: { w: 0.6, risk: 1, amb: 1 },
        run: function (l, r, log) {
          var cap = bizV(l, b.cap); H.cash(l, -cap, 'Vốn mở ' + b.n);
          // tay nghề quản lý: năng khiếu kinh doanh, kiến thức, từng làm đúng ngành thì đông khách hơn
          var q = Math.exp(U.normal(r) * 0.22 + (l.talent === 'kinh doanh' || l.talent === 'ăn nói' ? 0.1 : 0) + (l.st.kno - 50) / 400 + (b.k === 'spa' && E.jobDef(l) && E.jobDef(l).cat === 'beauty' ? 0.1 : 0) + (b.k === 'gym' && E.jobDef(l) && E.jobDef(l).cat === 'sport' ? 0.1 : 0));
          (l.ventures = l.ventures || []).push({ k: b.k, n: b.n, cap: cap, unit: cap, br: 1, mu: b.mu, sd: b.sd, yrs: 0, bad: 0, good: 0, R: bizV(l, b.rev) * 12, q: q });
          log('Khai trương ' + b.n + ' với số vốn ' + mo(l, cap) + '.', 'big'); fx(l, { hap: 6 }); H.mem(l, 'Ngày khai trương ' + b.n + ', pháo giấy đỏ rực trước cửa.', 4);
        } };
    })).concat([{ k: 'no', l: 'Thôi, để tiền gửi tiết kiệm', ai: { w: 0.8 }, run: function (l, r, log) { log('Chưa đầu tư gì thêm.', 'neutral'); } }])
  });
  A('dau_tu_lon', 'Tiền bạc', 'Mua nhà cho thuê / mở cửa hàng', { min: 22, avail: function (l) { return !l.indep ? 'Chưa tự lập' : cash(l) < Math.min(H.housePrice(l) * 0.35, l.base * 1.5) ? 'Cần nhiều vốn hơn' : true; }, ai: function (l) { return cash(l) > l.base * 4 ? 0.35 : 0.04; } });

  SC('mo_chi_nhanh', {
    title: 'Mở thêm chi nhánh?', prep: function (l) { var v = (l.ventures || []).filter(function (x) { return x.good >= 2; })[0]; return v ? { k: v.k } : null; },
    valid: function (l, d) { return (l.ventures || []).some(function (x) { return x.good >= 2 && (cash(l) >= x.unit || (H.canBankLoan(l) && cash(l) >= x.unit * 0.3)); }); }, // v2.8: không mời mở chi nhánh khi không có tiền, không vay được
    text: function (l, d) { var v = ven(l, d.k); return v ? U.cap(v.n) + ' của bạn (' + v.br + ' cơ sở) làm ăn phát đạt mấy năm liền. Mở thêm một chi nhánh cần khoảng ' + mo(l, v.unit) + '. Tiền mặt hiện có ' + mo(l, l.money) + '.' : ''; },
    opts: [
      { k: 'yes', l: 'Mở thêm chi nhánh', req: function (l, d) { var v = ven(l, d.k); return v && cash(l) >= v.unit; }, ai: { w: 1.2, amb: 1, risk: 0.5 }, run: function (l, r, log, d) { var v = ven(l, d.k); if (!v) return; H.cash(l, -v.unit, 'Mở chi nhánh ' + v.n); v.br++; v.cap += v.unit; v.good = 0; log('Mở chi nhánh thứ ' + v.br + ' của ' + v.n + '.', 'big'); fx(l, { hap: 6 }); if (v.br === 3) H.mem(l, U.cap(v.n) + ' của bạn đã thành chuỗi ' + v.br + ' cơ sở.', 5); } },
      { k: 'loan', l: 'Vay ngân hàng để mở chi nhánh', h: function (l, d) { var v = ven(l, d.k); return v ? 'Tự bỏ ra ' + mo(l, v.unit * 0.3) + ', vay ' + mo(l, v.unit * 0.7) : ''; }, req: function (l, d) { var v = ven(l, d.k); return v && cash(l) >= v.unit * 0.3 && H.canBankLoan(l); }, ai: { risk: 1.2, amb: 1 }, run: function (l, r, log, d) { var v = ven(l, d.k); if (!v) return; H.addLoan(l, 'bank', v.unit * 0.7); H.cash(l, -v.unit, 'Mở chi nhánh ' + v.n); v.br++; v.cap += v.unit; v.good = 0; log('Vay ngân hàng mở chi nhánh thứ ' + v.br + ' của ' + v.n + '.', 'big'); } },
      { k: 'no', l: 'Giữ quy mô hiện tại cho chắc', ai: { w: 1 }, run: function (l, r, log, d) { var v = ven(l, d.k); if (v) v.good = 0; log('Giữ nguyên quy mô, tập trung làm cho tốt.', 'neutral'); } }
    ]
  });
  function ven(l, k) { return (l.ventures || []).filter(function (x) { return x.k === k; })[0]; }

  SC('quan_ly_dau_tu', {
    title: 'Bán bớt tài sản đầu tư', valid: function (l) { return (l.props || []).length + (l.ventures || []).length > 0; },
    text: function (l) {
      var s = (l.props || []).map(function (p) { return p.n + ' ' + mo(l, p.v); }).concat((l.ventures || []).map(function (v) { return v.n + ' (' + v.br + ' cơ sở, vốn ' + mo(l, v.cap) + ')'; }));
      return 'Đang có: ' + s.join(' · ') + '.';
    },
    opts: [
      { k: 'prop', l: function (l) { var p = (l.props || [])[0]; return p ? 'Bán ' + p.n + ' (khoảng ' + mo(l, p.v) + ')' : ''; }, req: function (l) { return (l.props || []).length > 0; }, ai: { w: 1 }, run: function (l, r, log) { sellProp(l, 0, log); } },
      { k: 'biz', l: function (l) { var v = (l.ventures || [])[0]; return v ? 'Sang nhượng ' + v.n + ' (khoảng ' + mo(l, v.cap * 0.7) + ')' : ''; }, req: function (l) { return (l.ventures || []).length > 0; }, ai: { w: 1 }, run: function (l, r, log) { closeVen(l, 0, log, 0.7, 'Sang nhượng'); } },
      { k: 'keep', l: 'Thôi, cứ giữ', ai: { w: 1 }, run: function () { } }
    ]
  });
  A('quan_ly_dau_tu', 'Tiền bạc', 'Bán nhà cho thuê / sang nhượng cửa hàng', { min: 22, avail: function (l) { return (l.props || []).length + (l.ventures || []).length ? true : 'Chưa có'; } });
  function sellProp(l, i, log) { var p = l.props[i]; if (!p) return; H.cash(l, p.v, 'Bán ' + p.n); l.props.splice(i, 1); log('Bán ' + p.n + ' được ' + mo(l, p.v) + ' (' + (p.v >= p.basis ? 'lãi ' + mo(l, p.v - p.basis) : 'lỗ ' + mo(l, p.basis - p.v)) + ').', p.v >= p.basis ? 'good' : 'bad'); }
  function closeVen(l, i, log, k, how) { var v = l.ventures[i]; if (!v) return; var got = v.cap * k; if (got > 0) H.cash(l, got, how + ' ' + v.n); l.ventures.splice(i, 1); log(how + ' ' + v.n + (got > 0 ? ', thu về ' + mo(l, got) + '.' : '.'), k >= 0.6 ? 'neutral' : 'bad'); }

  function investYear(l, r, log, a) {
    if (a == null) a = l.age;
    if (l.wealthPaidAge === a) return;
    l.wealthPaidAge = a;
    var mkt = l.mkt ? l.mkt.land : 'bình thường';
    // nhà cho thuê: giá theo thị trường đất, tiền thuê theo năm; thỉnh thoảng bỏ trống
    var empties = [];
    (l.props || []).forEach(function (p) {
      if (p.residential112) return; // Homes kept for living never produce rent.
      var g = { 'bình thường': 0.03, 'sốt': 0.15, 'vỡ bong bóng': -0.2, 'đóng băng': -0.02 }[mkt] || 0.02;
      p.v = Math.max(p.basis * 0.3, p.v * (1 + g + U.normal(r) * 0.03));
      var occupied = ch(r, 0.12) ? 0.4 : 1;
      if (occupied < 1) { p.empty++; empties.push(p.n); }
      H.cash(l, p.v * p.y * occupied * E.difficulty(l).passive, 'Tiền cho thuê ' + p.n);
      H.cash(l, -p.v * .012, 'Bảo trì và quản lý ' + p.n);
    });
    if (empties.length) log((empties.length === 1 ? U.cap(empties[0]) : empties.length + ' bất động sản cho thuê') + ' bỏ trống mấy tháng chưa có khách thuê.', 'neutral');
    // cơ sở kinh doanh: lãi lỗ mỗi năm; lãi đều thì được mời mở chi nhánh; lỗ liên tiếp thì phá sản
    for (var i = (l.ventures || []).length - 1; i >= 0; i--) {
      var v = l.ventures[i]; v.yrs++;
      var B = venFix(l, v);
      var econ = l.mkt && l.mkt.stock === 'sập' ? 0.85 : l.mkt && l.mkt.stock === 'tăng mạnh' ? 1.05 : 1;
      // lượng khách năm nay: tay nghề quản lý × kinh tế × dao động; năm đầu còn ít người biết, năm thứ hai mới đông dần
      var dem = v.q * econ * Math.exp(U.normal(r) * B.sd) * (v.yrs === 1 ? 0.6 : v.yrs === 2 ? 0.88 : 1) * (v.br > 1 ? 1.03 : 1);
      if (B.tour && ch(r, 0.03)) { dem *= 0.35; log('Du lịch đóng băng (dịch bệnh, khủng hoảng kinh tế) — ' + v.n + ' vắng khách, phòng trống hàng tháng liền.', 'bad'); }
      // Competition persists across years; multiple branches require paid management.
      v.market = U.clamp((v.market == null ? 1 : v.market) * .8 + .2 + U.normal(r) * .10, .55, 1.2);
      dem *= v.market;
      if (ch(r, .08)) { dem *= .65; log('Khách giảm vì đối thủ mới hoặc nhu cầu chững lại: ' + v.n + '.', 'neutral'); }
      var R = v.R * v.br, rev = R * dem;
      var overhead = R * Math.min(.12, Math.max(0, v.br - 1) * .02);
      var renewal = v.cap * .025;
      var manager = a >= 65 || l.job ? rev * .03 : 0;
      var cost = rev * B.vc + R * (1 - B.vc - B.mg) + overhead + renewal + manager;
      if (rev > cost) cost += (rev - cost) * (1 - E.difficulty(l).passive);
      var prof = rev - cost, rate = prof / Math.max(1e-9, v.cap);
      v.last = { rev: rev, cost: cost, prof: prof };
      H.cash(l, prof, prof >= 0 ? 'Lãi ' + v.n : 'Lỗ ' + v.n);
      if (prof >= R * B.mg * 0.8) { v.good++; v.bad = 0; } else if (prof < 0) { v.bad++; v.good = 0; } else { v.good = Math.max(0, v.good - 1); }
      // tay nghề quản lý khá lên theo năm (hoặc mất khách dần nếu bỏ bê)
      v.q = U.clamp(1 + (v.q - 1) * 0.92 + U.normal(r) * 0.05 + (v.yrs <= 3 ? 0.02 : 0), 0.45, 1.45);
      log(U.cap(v.n) + (v.br > 1 ? ' (' + v.br + ' cơ sở)' : '') + ': doanh thu ~' + mo(l, rev / 12) + '/tháng, chi phí ' + B.cost + ', quản lý và tái đầu tư ~' + mo(l, cost / 12) + '/tháng → ' + (prof >= 0 ? 'lãi ' + mo(l, prof) + ' cả năm.' : 'lỗ ' + mo(l, -prof) + ' cả năm.'), prof >= 0 ? 'good' : 'bad');
      if (v.bad >= 3 || (v.bad >= 2 && l.money < 0)) {
        if (v.br > 1 && v.bad < 4) { v.br--; v.cap -= v.unit; v.bad = 1; log('Thua lỗ kéo dài, phải đóng bớt một chi nhánh ' + v.n + ', còn ' + v.br + ' cơ sở.', 'bad'); fx(l, { hap: -6 }); }
        else { closeVen(l, i, log, 0.15, 'Phá sản, đóng cửa'); fx(l, { hap: -15 }); if (l.mind) l.mind.stress = Math.min(100, l.mind.stress + 15); H.mem(l, 'Ngày gỡ tấm biển ' + v.n + ' xuống — bao nhiêu vốn liếng đổ sông đổ biển.', 6); }
        continue;
      }
      if (v.good >= 2 && free(l) && a < 75 && (cash(l) >= v.unit || (H.canBankLoan(l) && cash(l) >= v.unit * 0.3)) && ch(r, 0.6) && (v.askAt == null || a - v.askAt >= 4) && (l.flags.branchAt == null || a - l.flags.branchAt >= 3) && (l.flags.branchN || 0) < 6 && !(l.sched || []).some(function (s) { return s.id === 'mo_chi_nhanh'; })) { v.askAt = a; l.flags.branchAt = a; l.flags.branchN = (l.flags.branchN || 0) + 1; H.sched(l, 'mo_chi_nhanh', 1); } // v3.7: không hỏi mở chi nhánh năm nào cũng như năm nào
      v.cap *= 1 + Math.max(-0.1, Math.min(0.05, rate * 0.1)); v.unit = v.cap / v.br;
    }
    // về già hoặc nợ nần: bán bớt
    if (l.money < -l.base * 1.5 && (l.props || []).length) { log('Nợ nần dồn dập, phải bán bất động sản cho thuê.', 'bad'); sellProp(l, 0, log); }
    // chi phí duy trì nhà to, xe sang
    var hu = HOMES.filter(function (h) { return h.t === homeTier(l); })[0], vup = l.vehUp != null ? l.vehUp : ({ suv: 0.02, lux: 0.12, sport: 0.4, super: 1.2 }[l.vehK] || 0); // xe mua từ bản cũ
    var upk = (hu ? hu.up : 0) + (E.vehicleAnnual ? 0 : vup);
    if (upk > 0 && l.indep) H.cash(l, -upk * l.base, E.vehicleAnnual ? 'Chi phí duy trì nhà' : 'Chi phí duy trì nhà, xe');
  }

  // ===================================================================
  // 5. ANH CHỊ EM RUỘT
  // ===================================================================
  var SIB_JOBS = ['công nhân', 'giáo viên', 'kế toán', 'buôn bán nhỏ', 'làm nông', 'kỹ sư', 'nhân viên văn phòng', 'tài xế', 'y tá', 'thợ may', 'chủ quán ăn', 'đi xuất khẩu lao động'];
  function initSibs(l) {
    if (l.sibList) return;
    var h = { rs: (l.rs ^ 0x51b5a7) | 0 }, r = function () { return U.rand(h); };
    l.sibList = [];
    for (var i = 0; i < (l.fam.sibs || 0); i++) l.sibList.push(newSib(l, r, -(2 + i * 2 + Math.floor(r() * 2))));
  }
  function newSib(l, r, born) {
    var sex = r() < 0.5 ? 'M' : 'F';
    var nm = H.name(l, r, sex, l.sur);
    // v2.8: anh chị em ruột không trùng tên gọi với nhau và với bạn
    var short = function (n) { return given(l, n.full || n); }, taken = (l.sibList || []).map(function (s) { return short(s.n); }).concat([short(l.name)]);
    for (var t = 0; t < 8 && taken.indexOf(short(nm)) >= 0; t++) nm = H.name(l, r, sex, l.sur);
    return { n: nm.full || nm, sex: sex, born: born, alive: true, close: 55 + Math.floor(r() * 30), job: pick(r, SIB_JOBS), wed: false, kids: 0, q: U.clamp(l.fam.q + Math.round(U.normal(r)), 1, 5) };
  }
  function sibAge(l, s) { return l.age - s.born; }
  function sibs(l) { return (l.sibList || []).filter(function (s) { return s.alive; }); }
  // cách gọi theo vai vế: anh/chị (lớn hơn), em (nhỏ hơn)
  function sibWord(l, s) { return s.born < 0 ? (s.sex === 'M' ? 'anh' : 'chị') : 'em'; }
  function given(l, n) { var w = String(n).split(' '); return l.pool === 'vn' ? w[w.length - 1] : w[0]; } // tên gọi: người Việt là chữ cuối, nước ngoài là chữ đầu
  function sibCall(l, s) { return sibWord(l, s) + ' ' + given(l, s.n); }
  H.sibs = sibs; H.sibCall = sibCall; H.sibWord = sibWord;
  E.sibAge = sibAge;

  function sibYear(l, r, log, a) {
    initSibs(l);
    // mẹ sinh em bé (em út) khi bạn còn nhỏ
    var f = l.fam, young = (l.sibList || []).filter(function (s) { return s.born > 0; }).length;
    if (a >= 1 && a <= 12 && f.mAlive && f.mAge + a <= 40 && young < 2 && !l.flags.knownSibs && ch(r, (l.tfr || 2) > 2.2 ? 0.08 : 0.035)) {
      var s = newSib(l, r, a); l.sibList.push(s); f.ysibs = (f.ysibs || 0) + 1;
      log('Mẹ sinh em bé — bạn có thêm ' + (s.sex === 'M' ? 'em trai' : 'em gái') + ' tên ' + s.n + '.', 'good'); fx(l, { hap: 3 });
      H.mem(l, 'Ngày đầu tiên được bế ' + (s.sex === 'M' ? 'em trai' : 'em gái') + ' bé xíu.', 3);
    }
    sibs(l).forEach(function (s) {
      var sa = sibAge(l, s), w = sibCall(l, s);
      // anh chị em lập gia đình, sinh con
      if (!s.wed && sa >= 22 && sa <= 38 && ch(r, 0.14)) { s.wed = true; log('Đám cưới của ' + w + '. Cả nhà tất bật mấy ngày liền.', 'good'); fx(l, { hap: 2, soc: 2 }); s.close = Math.min(100, s.close + 2); }
      // cháu gọi bạn: con của anh/chị → chú/cô (bên nội) hoặc cậu/dì (bên ngoại); con của em → bác
      if (s.wed && s.kids < 3 && sa >= 24 && sa <= 42 && ch(r, 0.1)) { s.kids++; if (s.kids === 1 && a >= 6) log(U.cap(w) + ' sinh con đầu lòng — bạn lên chức ' + (s.born > 0 ? 'bác' : s.sex === 'M' ? (l.sex === 'M' ? 'chú' : 'cô') : (l.sex === 'M' ? 'cậu' : 'dì')) + '.', 'good'); }
      // anh chị em mất (tuổi già, bệnh tật, tai nạn hiếm)
      var q = sa < 40 ? 0.0012 : Math.min(0.5, 0.002 * Math.exp((sa - 50) * 0.085));
      if (ch(r, q)) { s.alive = false; log(U.cap(w) + ' qua đời ở tuổi ' + sa + (function (c) { return /thanh thản/.test(c) ? ', ' + c : ' vì ' + c; })(H.deathCause(sa, r)) + '.', 'bad'); fx(l, { hap: s.close > 70 ? -14 : -8 }); H.mem(l, 'Ngày tiễn ' + w + ' — người cùng lớn lên dưới một mái nhà.', s.close > 70 ? 5 : 4); }
      s.close = U.clamp(s.close + (ch(r, 0.5) ? -1 : 0), 10, 100);
    });
  }

  // tuổi nhỏ: tranh giành, bênh vực
  SC('sib_tre', {
    title: 'Anh chị em trong nhà', prep: function (l, r) { var ss = sibs(l).filter(function (s) { return Math.abs(sibAge(l, s) - l.age) <= 8 && sibAge(l, s) >= 3; }); if (!ss.length) return null; var s = pick(r, ss); return { i: l.sibList.indexOf(s), t: pick(r, ['giành nhau cái điều khiển tivi', 'tranh nhau cái đùi gà trong mâm cơm', 'cãi nhau vì ai phải rửa bát', 'giành nhau chiếc xe đạp để đi chơi']) }; },
    valid: function (l) { return sibs(l).some(function (s) { return Math.abs(sibAge(l, s) - l.age) <= 8 && sibAge(l, s) >= 3; }); },
    text: function (l, d) { var s = l.sibList[d.i]; return 'Bạn với ' + sibCall(l, s) + ' ' + d.t + '.'; },
    opts: [
      { k: 'give', l: 'Nhường', ai: { w: 1.2 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; s.close = Math.min(100, s.close + 6); log('Nhường ' + sibCall(l, s) + '. Mẹ khen bạn biết điều.', 'good'); fx(l, { karma: 1 }); } },
      { k: 'tell', l: 'Mách bố mẹ', ai: { w: 0.8 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; s.close -= 2; log('Mách bố mẹ, cả hai cùng bị mắng.', 'neutral'); } },
      { k: 'fight', l: 'Không nhường, cãi đến cùng', ai: { risk: 1 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; s.close -= 5; var two = s.born < 0 ? (s.sex === 'M' ? 'Hai anh em' : 'Hai chị em') : (l.sex === 'M' ? 'Hai anh em' : 'Hai chị em'); log(two + ' ' + pick(r, ['giận nhau cả tuần không nói chuyện.', 'cãi nhau to, bị mẹ phạt đứng mỗi đứa một góc.', 'chiến tranh lạnh mấy ngày, rồi lại chia nhau gói bim bim.']), 'bad'); fx(l, { hap: -2 }); } }
    ]
  });
  T('sib_tre', function (l, a) { return a >= 5 && a <= 16 && sibs(l).length > 0; }, 0.12, 3);
  EV(function (l, a) { return a >= 6 && a <= 15 && sibs(l).some(function (s) { return s.born < 0 && sibAge(l, s) >= 12; }); }, 0.06, function (l, a, r, log) {
    var s = pick(r, sibs(l).filter(function (s) { return s.born < 0 && sibAge(l, s) >= 12; })), w = sibCall(l, s);
    var t = pick(r, [U.cap(w) + ' chở bạn đi học bằng chiếc xe đạp cũ.', U.cap(w) + ' giảng lại bài toán khó cho bạn đến khuya.', U.cap(w) + ' đứng ra bênh bạn khi bị đám trẻ trong xóm bắt nạt.']);
    log(t, 'good'); s.close = Math.min(100, s.close + 4); fx(l, { hap: 2 }); H.mem(l, t, 2);
  });
  // lớn lên: vay tiền, gặp khó khăn, chia tài sản
  SC('sib_vay', {
    title: 'Anh chị em hỏi vay tiền', prep: function (l, r) { var ss = sibs(l).filter(function (s) { return sibAge(l, s) >= 22; }); if (!ss.length) return null; var s = pick(r, ss); return { i: l.sibList.indexOf(s), x: pick(r, [0.2, 0.4, 0.8]), why: pick(r, ['mở quán', 'chữa bệnh cho con', 'trả nợ', 'đặt cọc mua nhà', 'làm ăn bị lỗ']) }; },
    valid: function (l) { return l.indep && sibs(l).some(function (s) { return sibAge(l, s) >= 22; }); },
    text: function (l, d) { var s = l.sibList[d.i]; return U.cap(sibCall(l, s)) + ' ngập ngừng hỏi vay ' + mb(l, d.x) + ' để ' + d.why + '. Tiền mặt của bạn: ' + mo(l, l.money) + '.'; },
    opts: [
      { k: 'lend', l: 'Cho vay', req: function (l, d) { return l.money >= d.x * l.base; }, ai: { w: 1, soc: 0.6 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; cashB(l, -d.x, 'Cho ' + sibCall(l, s) + ' vay'); s.close = Math.min(100, s.close + 6); if (ch(r, 0.6)) { H.sched(l, 'sib_tra', U.randint(r, 1, 4), { i: d.i, x: d.x }); log('Cho ' + sibCall(l, s) + ' vay ' + mb(l, d.x) + '. "Người nhà cả, khi nào có thì trả."', 'good'); } else { log('Cho ' + sibCall(l, s) + ' vay ' + mb(l, d.x) + ' — mà trong lòng biết khó đòi.', 'neutral'); } fx(l, { karma: 2 }); } },
      { k: 'gift', l: 'Cho luôn, không cần trả', req: function (l, d) { return l.money >= d.x * l.base * 2; }, ai: { w: 0.5, soc: 1 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; cashB(l, -d.x, 'Giúp ' + sibCall(l, s)); s.close = Math.min(100, s.close + 12); log('Đưa ' + sibCall(l, s) + ' ' + mb(l, d.x) + ', dặn cứ cầm lấy mà lo việc.', 'good'); fx(l, { karma: 4, hap: 2 }); H.mem(l, 'Lần giúp ' + sibCall(l, s) + ' lúc khó khăn.', 3); } },
      { k: 'no', l: 'Từ chối khéo', ai: { w: 0.8 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; s.close -= 8; log('Từ chối cho ' + sibCall(l, s) + ' vay. Bữa cơm gia đình sau đó có phần gượng gạo.', 'neutral'); } }
    ]
  });
  T('sib_vay', function (l, a) { return a >= 24 && a <= 70 && l.indep && free(l); }, 0.05, 5);
  SC('sib_tra', {
    title: 'Trả nợ', prep: function (l, r, arg) { if (arg && arg.i != null) return arg; var s = sibs(l)[0]; return s ? { i: l.sibList.indexOf(s), x: 0.2 } : {}; },
    valid: function (l, d) { var s = d && l.sibList && l.sibList[d.i]; return !!(s && s.alive); },
    text: function (l, d) { return U.cap(sibCall(l, l.sibList[d.i])) + ' mang tiền sang trả.'; },
    opts: [{ k: 'ok', l: 'Nhận lại', run: function (l, r, log, d) { var s = l.sibList[d.i]; cashB(l, d.x, sibCall(l, s) + ' trả nợ'); s.close = Math.min(100, s.close + 3); log(U.cap(sibCall(l, s)) + ' trả lại ' + mb(l, d.x) + ' đã vay, kèm túi quà quê.', 'good'); } }]
  });
  SC('sib_gap', {
    title: 'Anh chị em', prep: function (l, r) { var s = pick(r, sibs(l)); return s ? { i: l.sibList.indexOf(s) } : null; },
    valid: function (l) { return sibs(l).length > 0; },
    text: function (l, d) { var s = l.sibList[d.i]; return U.cap(sibCall(l, s)) + ' năm nay ' + sibAge(l, s) + ' tuổi, ' + (sibAge(l, s) >= 18 ? 'đang ' + (sibAge(l, s) >= 65 ? 'nghỉ ngơi tuổi già' : 'làm ' + s.job) : 'còn đi học') + (s.kids ? ', có ' + s.kids + ' con' : '') + '.'; },
    opts: [
      { k: 'meal', l: 'Rủ cả nhà tụ họp ăn một bữa', run: function (l, r, log, d) { var s = l.sibList[d.i]; s.close = Math.min(100, s.close + 8); var t = pick(r, ['Anh chị em ngồi ôn lại chuyện hồi bé, cười chảy nước mắt.', 'Bữa cơm đông đủ, lũ trẻ con chạy khắp nhà.', 'Cả nhà nâng ly, hẹn năm nào cũng tụ họp như thế này.']); log('Tụ họp với ' + sibCall(l, s) + '. ' + t, 'good'); cashB(l, -0.01, 'Họp mặt gia đình'); fx(l, { hap: 5, soc: 4 }); if (ch(r, 0.3)) H.mem(l, t, 3); } },
      { k: 'trip', l: 'Rủ đi du lịch chung', req: function (l) { return l.money > l.base * 0.15 && l.indep; }, run: function (l, r, log, d) { var s = l.sibList[d.i]; s.close = Math.min(100, s.close + 12); cashB(l, -0.12, 'Du lịch cùng anh chị em'); log('Hai nhà cùng đi du lịch một chuyến — lâu lắm mới được gần nhau như thế.', 'good'); fx(l, { hap: 8, soc: 4 }); H.mem(l, 'Chuyến du lịch cùng ' + sibCall(l, s) + '.', 3); } },
      { k: 'help', l: function (l, d) { return 'Phụ giúp ' + sibCall(l, l.sibList[d.i]) + ' một khoản'; }, h: function (l) { return mb(l, 0.2); }, req: function (l, d) { var s = l.sibList[d.i]; return l.indep && l.money > l.base * 0.4 && s.q <= 2 && sibAge(l, s) >= 18; }, run: function (l, r, log, d) { var s = l.sibList[d.i]; s.close = Math.min(100, s.close + 10); cashB(l, -0.2, 'Giúp ' + sibCall(l, s)); log('Gửi ' + sibCall(l, s) + ' ít tiền trang trải, nhà ' + sibWord(l, s) + ' đang khó.', 'good'); fx(l, { karma: 3 }); } },
      { k: 'call', l: 'Chỉ gọi điện hỏi thăm', run: function (l, r, log, d) { var s = l.sibList[d.i]; s.close = Math.min(100, s.close + 2); log('Gọi điện hỏi thăm ' + sibCall(l, s) + '.', 'neutral'); fx(l, { soc: 1 }); } }
    ]
  });
  A('gap_anh_chi', 'Gia đình & bạn bè', 'Gặp anh chị em', { min: 8, sc: 'sib_gap', avail: function (l) { return sibs(l).length ? true : 'Không có anh chị em'; }, ai: { w: 0.2, soc: 1 } });
  // chia tài sản khi bố mẹ đều đã mất
  SC('chia_tai_san', {
    title: 'Chia tài sản bố mẹ để lại', prep: function (l) { return { v: H.housePrice(l) * (l.fam.q >= 4 ? 1.2 : 0.6) }; },
    valid: function (l) { return !l.fam.mAlive && !l.fam.fAlive && sibs(l).length > 0 && !l.flags.inherit; },
    text: function (l, d) { return 'Bố mẹ đều đã khuất, để lại căn nhà và mảnh đất ở quê trị giá khoảng ' + mo(l, d.v) + '. Anh chị em ' + (sibs(l).length + 1) + ' người ngồi lại bàn chuyện chia.'; },
    opts: [
      { k: 'equal', l: 'Chia đều cho tất cả', ai: { w: 1.4 }, run: function (l, r, log, d) { l.flags.inherit = true; H.cash(l, d.v / (sibs(l).length + 1), 'Phần tài sản bố mẹ để lại'); sibs(l).forEach(function (s) { s.close = Math.min(100, s.close + 3); }); log('Anh chị em chia đều phần tài sản bố mẹ để lại, êm thấm.', 'good'); } },
      { k: 'yield', l: 'Nhường phần mình cho anh chị em khó khăn hơn', ai: { w: 0.6, soc: 1 }, run: function (l, r, log) { l.flags.inherit = true; sibs(l).forEach(function (s) { s.close = Math.min(100, s.close + 10); }); log('Nhường phần thừa kế cho anh chị em. "Mình còn lo được, để các anh chị em giữ lấy hương hỏa."', 'good'); fx(l, { karma: 6, hap: 3 }); H.mem(l, 'Ngày nhường phần đất hương hỏa cho anh chị em.', 4); } },
      { k: 'more', l: 'Đòi phần hơn vì đã chăm bố mẹ nhiều hơn', ai: { risk: 1, bad: 0.6 }, run: function (l, r, log, d) { l.flags.inherit = true; if (ch(r, 0.5)) { H.cash(l, d.v / (sibs(l).length + 1) * 1.5, 'Phần tài sản bố mẹ để lại'); log('Được chia phần hơn, nhưng anh chị em từ đó ít qua lại.', 'neutral'); sibs(l).forEach(function (s) { s.close -= 20; }); } else { cashB(l, -0.15, 'Án phí tranh chấp thừa kế'); log('Anh chị em kéo nhau ra tòa vì chuyện chia đất. Tình thân sứt mẻ.', 'bad'); sibs(l).forEach(function (s) { s.close -= 35; }); fx(l, { hap: -10, karma: -4 }); H.mem(l, 'Phiên tòa chia thừa kế giữa anh chị em ruột.', 5); } } }
    ]
  });
  T('chia_tai_san', function (l, a) { return a >= 25 && sibs(l).length > 0 && !l.fam.mAlive && !l.fam.fAlive && !l.flags.inherit && free(l); }, 0.5);
  E.MAJOR.chia_tai_san = 1;

  // ===================================================================
  // 6. SAU KHI NGHỈ HƯU: an hưởng hay kinh doanh tiếp
  // ===================================================================
  SC('sau_huu', {
    title: 'Nghỉ hưu rồi, làm gì tiếp?', valid: function (l) { return l.retired && l.alive; },
    text: function (l) { return 'Bạn vừa nghỉ hưu, sức khỏe còn tốt, có ' + mo(l, l.money) + ' tiền mặt. Nhiều người cùng tuổi vẫn mở quán, buôn bán nhỏ hay mua nhà cho thuê để có thêm thu nhập.'; },
    opts: [
      { k: 'rest', l: 'An hưởng tuổi già', ai: { w: 1.2 }, run: function (l, r, log) { log('Nghỉ ngơi thật sự: sáng tập thể dục, chiều chăm cháu, tối xem thời sự.', 'good'); fx(l, { hap: 4 }); } },
      { k: 'shop', l: 'Mở cửa hàng / quán nhỏ', h: function (l) { return 'Vốn khoảng ' + mb(l, 0.8); }, req: function (l) { return cash(l) >= l.base * 0.8; }, ai: { w: 0.8, amb: 1, risk: 0.5 }, run: function (l, r, log) {
        cashB(l, -0.8, 'Vốn mở cửa hàng tuổi hưu');
        if (ch(r, 0.55 + (l.st.kno - 50) / 300)) { var id = ch(r, 0.5) ? 'kd_tap_hoa' : 'kd_quan'; l.retired = false; E.startJob(l, id, r, log, true); l.flags.afterRet = l.age + U.randint(r, 6, 12); log('Nghỉ hưu mà không chịu ngồi yên: mở ' + (l.job.p || (id === 'kd_tap_hoa' ? 'tiệm tạp hóa' : 'quán ăn')) + ' trước nhà, vẫn nhận lương hưu đều.', 'big'); fx(l, { hap: 5 }); H.mem(l, 'Ngày khai trương cửa hàng ở tuổi ' + l.age + '.', 4); }
        else { log('Mở cửa hàng được một năm thì ế, đành sang nhượng lại, mất một phần vốn.', 'bad'); cashB(l, 0.4, 'Sang nhượng cửa hàng'); fx(l, { hap: -4 }); }
      } },
      { k: 'rent', l: 'Mua ki-ốt / căn hộ cho thuê lấy lãi', req: function (l) { return cash(l) >= propPrice(l, PROPS[2]); }, ai: { w: 1, smart: 0.6 }, run: function (l, r, log) { var p = cash(l) >= propPrice(l, PROPS[0]) * 1.2 ? PROPS[0] : PROPS[2]; var v = propPrice(l, p); H.cash(l, -v, 'Mua ' + p.n); (l.props = l.props || []).push({ k: p.k, n: p.n, v: v, basis: v, y: p.y, since: l.age, empty: 0 }); log('Dồn tiền hưu mua ' + p.n + ', mỗi tháng có thêm tiền thuê.', 'good'); fx(l, { hap: 3 }); } }
    ]
  });

  // ===================================================================
  // ĐĂNG KÝ VÀO VÒNG NĂM
  // ===================================================================
  var oldMig = E.migrateExt;
  E.migrateExt = function (l) { oldMig(l); if (l.fam) initSibs(l); return l; };
  E.HOOKS.year.push(function (l, r, log, a) {
    initSibs(l);
    if (l.abroad && l.abroad.name) H.visit(l, l.abroad.name);
    // sống ở nước ngoài lâu thì tiếng bản xứ tự lên
    var k = l.abroad ? (LANG_OF[l.abroad.code] || LANG_OF_NAME[l.abroad.name]) : null;
    if (k && k !== 'en' && langNext(l, k) != null && ch(r, 0.3)) { l.lang = l.lang || {}; l.lang[k] = langNext(l, k); log('Sống ở ' + l.abroad.name + ' lâu ngày, ' + LANG[k].n + ' lên hẳn — thi đỗ ' + langCert(l, k) + '.', 'good'); }
    sibYear(l, r, log, a);
    if (l.indep && ((l.props || []).length || (l.ventures || []).length || l.vehK || homeTier(l) >= 2)) investYear(l, r, log, a);
  });
  E.wealth = { MODELS: MODELS, SEGS: SEGS, priceOf: priceOf, isDriver: isDriver, bizV: bizV, CARS: CARS, HOMES: HOMES, PROPS: PROPS, BIZ: BIZ, LANG: LANG, investYear: investYear, sibYear: sibYear, initSibs: initSibs, homeTier: homeTier, vehTier: vehTier };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
