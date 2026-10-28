/* Showbiz — Mốc 2: danh mục chương trình truyền hình (mở rộng được) + bộ máy câu hỏi + gameshow kiến thức.
   · E.SHOW151: mô hình dữ liệu chương trình (id, tên, quốc gia, thể loại, năm, điều kiện, vai trò, vòng thi, giải thưởng, trạng thái).
     Mỗi chương trình trỏ tới một bộ xử lý (handler). Chương trình chỉ khác dữ liệu dùng chung handler; format đặc trưng có handler riêng.
   · E.QUIZ151: câu hỏi sinh theo quy tắc (toán, logic, quy luật, đơn vị, thời gian…) và từ bảng dữ kiện đã kiểm chứng
     (thủ đô, hành tinh, nguyên tố, mốc lịch sử, văn học, khoa học…). Đáp án được tính / tra lại tự động; không dùng AI trả phí.
   · Trạng thái từng cuộc thi lưu trong bản lưu (câu hỏi đang hỏi, chuỗi đúng, tiền tích lũy) nên tải lại không đổi câu, không nhận thưởng hai lần.
   · Format là mô phỏng lấy cảm hứng từ chương trình thật; diễn biến, câu hỏi và người chơi khác đều hư cấu. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110;
  function yr(l) { return l.birthYear + l.age; }
  function vn(l) { return H.isVN(l) && !(l.abroad && l.abroad.perm); }
  function V(l, trieu) { return vn(l) && l.cur === 'vnd' ? trieu : trieu / 90 * l.base; } // giá trị theo mặt bằng Việt Nam, quy đổi khi ở nước khác
  function mo(l, v) { return H.money(l, v); }
  function hash(s) { var n = 2166136261; for (var i = 0; i < s.length; i++) n = Math.imul(n ^ s.charCodeAt(i), 16777619); return n >>> 0; }
  function seeded(s) { var a = hash(String(s)); return function () { a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function ri(r, a, b) { return a + Math.floor(r() * (b - a + 1)); }
  function pick(r, a) { return a[Math.floor(r() * a.length)]; }
  function shuffle(r, a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

  // ===================================================================
  // E.QUIZ151 — bộ máy câu hỏi
  // ===================================================================
  // Bảng dữ kiện: chỉ gồm điều đã được xác minh, ổn định theo thời gian (không dùng số liệu thay đổi như dân số, số tỉnh thành).
  var CAPITALS = [['Pháp', 'Paris', 'châu Âu'], ['Đức', 'Berlin', 'châu Âu'], ['Nhật Bản', 'Tokyo', 'châu Á'], ['Hàn Quốc', 'Seoul', 'châu Á'], ['Trung Quốc', 'Bắc Kinh', 'châu Á'], ['Thái Lan', 'Bangkok', 'châu Á'], ['Lào', 'Viêng Chăn', 'châu Á'], ['Campuchia', 'Phnôm Pênh', 'châu Á'], ['Anh', 'Luân Đôn', 'châu Âu'], ['Ý', 'Rô-ma', 'châu Âu'], ['Tây Ban Nha', 'Madrid', 'châu Âu'], ['Nga', 'Mát-xcơ-va', 'châu Âu'], ['Úc', 'Canberra', 'châu Đại Dương'], ['Canada', 'Ottawa', 'châu Mỹ'], ['Hoa Kỳ', 'Washington D.C.', 'châu Mỹ'], ['Brazil', 'Brasília', 'châu Mỹ'], ['Ai Cập', 'Cairo', 'châu Phi'], ['Ấn Độ', 'New Delhi', 'châu Á'], ['Indonesia', 'Jakarta', 'châu Á'], ['Malaysia', 'Kuala Lumpur', 'châu Á'], ['Philippines', 'Manila', 'châu Á'], ['Thụy Điển', 'Stockholm', 'châu Âu'], ['Na Uy', 'Oslo', 'châu Âu'], ['Hà Lan', 'Amsterdam', 'châu Âu'], ['Bồ Đào Nha', 'Lisbon', 'châu Âu'], ['Hy Lạp', 'A-ten', 'châu Âu'], ['Thổ Nhĩ Kỳ', 'Ankara', 'châu Á'], ['Argentina', 'Buenos Aires', 'châu Mỹ'], ['Mexico', 'Thành phố Mexico', 'châu Mỹ'], ['Kenya', 'Nairobi', 'châu Phi'], ['Việt Nam', 'Hà Nội', 'châu Á'], ['Mông Cổ', 'Ulan Bato', 'châu Á'], ['Áo', 'Viên', 'châu Âu'], ['Thụy Sĩ', 'Bern', 'châu Âu'], ['Ba Lan', 'Vác-sa-va', 'châu Âu'], ['Phần Lan', 'Helsinki', 'châu Âu'], ['Đan Mạch', 'Copenhagen', 'châu Âu'], ['Ireland', 'Dublin', 'châu Âu'], ['Peru', 'Lima', 'châu Mỹ'], ['Chile', 'Santiago', 'châu Mỹ'], ['Nigeria', 'Abuja', 'châu Phi'], ['Ethiopia', 'Addis Ababa', 'châu Phi']];
  var PLANETS = ['Sao Thủy', 'Sao Kim', 'Trái Đất', 'Sao Hỏa', 'Sao Mộc', 'Sao Thổ', 'Sao Thiên Vương', 'Sao Hải Vương'];
  var ELEMENTS = [['H', 'Hiđro'], ['O', 'Oxi'], ['C', 'Cacbon'], ['N', 'Nitơ'], ['Na', 'Natri'], ['K', 'Kali'], ['Fe', 'Sắt'], ['Cu', 'Đồng'], ['Ag', 'Bạc'], ['Au', 'Vàng'], ['Ca', 'Canxi'], ['Mg', 'Magie'], ['Zn', 'Kẽm'], ['Al', 'Nhôm'], ['Cl', 'Clo'], ['S', 'Lưu huỳnh'], ['He', 'Heli'], ['Pb', 'Chì'], ['Hg', 'Thủy ngân'], ['P', 'Photpho']];
  var VN_HISTORY = [['Khởi nghĩa Hai Bà Trưng', 40], ['Ngô Quyền đánh thắng quân Nam Hán trên sông Bạch Đằng', 938], ['Lý Thái Tổ dời đô về Thăng Long', 1010], ['Quang Trung đại phá quân Thanh (chiến thắng Ngọc Hồi – Đống Đa)', 1789], ['Thành lập Đảng Cộng sản Việt Nam', 1930], ['Cách mạng tháng Tám thành công', 1945], ['Chiến thắng Điện Biên Phủ', 1954], ['Ký Hiệp định Paris về Việt Nam', 1973], ['Giải phóng miền Nam, thống nhất đất nước', 1975], ['Đại hội VI khởi xướng công cuộc Đổi mới', 1986], ['Việt Nam gia nhập ASEAN', 1995], ['Việt Nam gia nhập WTO', 2007]];
  var WORLD_HISTORY = [['Christopher Columbus đến châu Mỹ', 1492], ['Cách mạng Pháp bùng nổ', 1789], ['Chiến tranh thế giới thứ nhất bắt đầu', 1914], ['Chiến tranh thế giới thứ nhất kết thúc', 1918], ['Chiến tranh thế giới thứ hai bắt đầu', 1939], ['Chiến tranh thế giới thứ hai kết thúc', 1945], ['Con người lần đầu đặt chân lên Mặt Trăng', 1969], ['Bức tường Berlin sụp đổ', 1989]];
  var BOOKS = [['Truyện Kiều', 'Nguyễn Du'], ['Tắt đèn', 'Ngô Tất Tố'], ['Số đỏ', 'Vũ Trọng Phụng'], ['Lão Hạc', 'Nam Cao'], ['Nhật ký trong tù', 'Hồ Chí Minh'], ['Dế Mèn phiêu lưu ký', 'Tô Hoài'], ['Romeo và Juliet', 'William Shakespeare'], ['Những người khốn khổ', 'Victor Hugo'], ['Chiến tranh và hòa bình', 'Lev Tolstoy'], ['Ông già và biển cả', 'Ernest Hemingway']];
  var ARTS = [['Bức tranh "Mona Lisa"', 'Leonardo da Vinci'], ['Bức tranh "Đêm đầy sao"', 'Vincent van Gogh'], ['Bản "Giao hưởng số 9"', 'Ludwig van Beethoven'], ['Vở opera "Cây sáo thần"', 'Wolfgang Amadeus Mozart'], ['Bức tranh "Thiếu nữ bên hoa huệ"', 'Tô Ngọc Vân']];
  // Câu hỏi dữ kiện cố định: [câu hỏi, đáp án, 3 phương án sai, giải thích, thể loại, độ khó 1–3]
  var FACTS = [
    ['Ở áp suất tiêu chuẩn, nước tinh khiết sôi ở bao nhiêu độ C?', '100°C', ['90°C', '80°C', '120°C'], 'Ở áp suất 1 atm, nước sôi ở 100°C.', 'science', 1],
    ['Công thức hóa học của nước là gì?', 'H₂O', ['CO₂', 'O₂', 'NaCl'], 'Mỗi phân tử nước gồm 2 nguyên tử hiđro và 1 nguyên tử oxi.', 'science', 1],
    ['Bộ xương người trưởng thành thường có bao nhiêu chiếc xương?', '206', ['186', '230', '300'], 'Trẻ sơ sinh có nhiều xương hơn; nhiều xương hợp lại khi lớn, còn khoảng 206.', 'science', 2],
    ['Khí nào chiếm tỉ lệ lớn nhất trong không khí?', 'Nitơ', ['Oxi', 'Cacbonic', 'Hiđro'], 'Nitơ chiếm khoảng 78% thể tích không khí.', 'science', 2],
    ['Tim người có mấy ngăn?', '4', ['2', '3', '5'], 'Tim có 2 tâm nhĩ và 2 tâm thất.', 'science', 1],
    ['Tế bào người bình thường có bao nhiêu nhiễm sắc thể?', '46', ['23', '44', '48'], '23 cặp, tổng cộng 46 nhiễm sắc thể.', 'science', 2],
    ['Kim loại nào ở thể lỏng ở nhiệt độ phòng?', 'Thủy ngân', ['Sắt', 'Nhôm', 'Đồng'], 'Thủy ngân (Hg) lỏng ở nhiệt độ thường.', 'science', 2],
    ['Đơn vị đo điện trở là gì?', 'Ôm', ['Vôn', 'Ampe', 'Oát'], 'Điện trở đo bằng ôm (Ω).', 'science', 2],
    ['Ánh sáng truyền trong chân không với tốc độ khoảng bao nhiêu?', '300.000 km/s', ['3.000 km/s', '30.000 km/s', '3.000.000 km/s'], 'Khoảng 299.792 km/s, thường làm tròn 300.000 km/s.', 'science', 3],
    ['Đỉnh núi cao nhất thế giới là đỉnh nào?', 'Everest', ['K2', 'Fansipan', 'Kilimanjaro'], 'Everest thuộc dãy Himalaya, cao khoảng 8.849 m.', 'geo', 1],
    ['Đỉnh núi cao nhất Việt Nam là đỉnh nào?', 'Fansipan', ['Bà Đen', 'Ngọc Linh', 'Tây Côn Lĩnh'], 'Fansipan thuộc dãy Hoàng Liên Sơn, được gọi là "nóc nhà Đông Dương".', 'geo', 1],
    ['Đại dương lớn nhất thế giới là đại dương nào?', 'Thái Bình Dương', ['Đại Tây Dương', 'Ấn Độ Dương', 'Bắc Băng Dương'], 'Thái Bình Dương rộng nhất trong các đại dương.', 'geo', 1],
    ['Sa mạc nóng lớn nhất thế giới là sa mạc nào?', 'Sahara', ['Gobi', 'Kalahari', 'Atacama'], 'Sahara ở Bắc Phi là sa mạc nóng lớn nhất.', 'geo', 2],
    ['Vịnh Hạ Long thuộc tỉnh nào?', 'Quảng Ninh', ['Hải Phòng', 'Thái Bình', 'Nam Định'], 'Vịnh Hạ Long ở tỉnh Quảng Ninh, là di sản thiên nhiên thế giới.', 'geo', 1],
    ['Đàn bầu có mấy dây?', '1', ['2', '4', '16'], 'Đàn bầu là nhạc cụ dân tộc một dây.', 'music', 1],
    ['Hệ thống nốt nhạc cơ bản có bao nhiêu nốt?', '7', ['5', '6', '8'], 'Đô, Rê, Mi, Pha, Son, La, Si.', 'music', 1],
    ['Một cây đàn piano tiêu chuẩn có bao nhiêu phím?', '88', ['76', '61', '100'], 'Piano tiêu chuẩn có 52 phím trắng và 36 phím đen.', 'music', 2],
    ['Nhà soạn nhạc Beethoven là người nước nào?', 'Đức', ['Áo', 'Pháp', 'Ý'], 'Beethoven sinh ở Bonn (Đức).', 'music', 2],
    ['Giải thưởng điện ảnh Oscar còn được gọi là giải gì?', 'Giải thưởng Viện Hàn lâm', ['Quả cầu vàng', 'Cành cọ vàng', 'Gấu vàng'], 'Oscar là Giải thưởng Viện Hàn lâm Khoa học và Nghệ thuật Điện ảnh Hoa Kỳ.', 'film', 2],
    ['Phim "Titanic" (1997) do ai đạo diễn?', 'James Cameron', ['Steven Spielberg', 'Christopher Nolan', 'Martin Scorsese'], 'James Cameron vừa viết kịch bản vừa đạo diễn "Titanic".', 'film', 2],
    ['Cành cọ vàng là giải thưởng cao nhất của liên hoan phim nào?', 'Cannes', ['Venice', 'Berlin', 'Busan'], 'Cành cọ vàng (Palme d\'Or) thuộc Liên hoan phim Cannes.', 'film', 3],
    ['Dân ca quan họ gắn với vùng đất nào?', 'Bắc Ninh – Bắc Giang', ['Huế', 'Nghệ Tĩnh', 'Nam Bộ'], 'Dân ca quan họ Bắc Ninh được UNESCO ghi danh năm 2009.', 'culture', 1],
    ['Phố cổ Hội An thuộc tỉnh / thành nào?', 'Quảng Nam', ['Đà Nẵng', 'Thừa Thiên Huế', 'Quảng Ngãi'], 'Hội An được UNESCO công nhận là di sản văn hóa thế giới năm 1999 (khi thuộc tỉnh Quảng Nam).', 'culture', 2],
    ['Số điện thoại khẩn cấp gọi xe cấp cứu ở Việt Nam là số nào?', '115', ['113', '114', '911'], '113 công an, 114 cứu hỏa, 115 cấp cứu.', 'daily', 1],
    ['Số điện thoại báo cháy ở Việt Nam là số nào?', '114', ['113', '115', '112'], '113 công an, 114 cứu hỏa – cứu nạn, 115 cấp cứu.', 'daily', 1],
    ['Một đội bóng đá trên sân có bao nhiêu cầu thủ?', '11', ['9', '10', '12'], 'Mỗi đội có 11 cầu thủ, kể cả thủ môn.', 'daily', 1],
    ['Thế vận hội Olympic mùa hè được tổ chức mấy năm một lần?', '4 năm', ['2 năm', '3 năm', '5 năm'], 'Olympic mùa hè diễn ra 4 năm một lần.', 'daily', 1],
    ['Tháng Hai của năm nhuận có bao nhiêu ngày?', '29', ['28', '30', '31'], 'Năm nhuận, tháng Hai có 29 ngày.', 'daily', 1],
    ['Có một đàn chim đậu trên cành, người thợ săn bắn trúng một con. Hỏi trên cành còn mấy con?', 'Không còn con nào', ['Một con', 'Tùy số chim ban đầu trừ một', 'Hai con'], 'Nghe tiếng súng, những con còn lại bay hết.', 'riddle', 1],
    ['Tháng nào trong năm có 28 ngày?', 'Tất cả các tháng', ['Chỉ tháng Hai', 'Tháng Hai và tháng Tư', 'Không tháng nào'], 'Tháng nào cũng có ít nhất 28 ngày.', 'riddle', 1],
    ['Cái gì càng lấy đi càng to?', 'Cái hố', ['Quả bóng', 'Ngọn lửa', 'Cơn mưa'], 'Đào (lấy đất đi) càng nhiều thì hố càng to.', 'riddle', 1],
    ['Gà trống đẻ một quả trứng trên nóc nhà, trứng lăn về phía nào?', 'Gà trống không đẻ trứng', ['Phía đông', 'Phía tây', 'Rơi thẳng xuống'], 'Chỉ gà mái mới đẻ trứng.', 'riddle', 1]
  ];
  var NAMES = ['An', 'Bình', 'Chi', 'Dũng', 'Giang', 'Hà', 'Khoa', 'Linh', 'Minh', 'Nga', 'Phúc', 'Quân', 'Sơn', 'Thảo', 'Uyên', 'Vy'];
  var UNITS = [['mét', 'xăng-ti-mét', 100], ['ki-lô-mét', 'mét', 1000], ['ki-lô-gam', 'gam', 1000], ['giờ', 'phút', 60], ['phút', 'giây', 60], ['ngày', 'giờ', 24], ['tuần', 'ngày', 7], ['lít', 'mi-li-lít', 1000], ['tấn', 'ki-lô-gam', 1000]];
  var DAYS = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  function isPrime(n) { if (n < 2) return false; for (var i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
  function roman(n) { var m = [[50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']], s = ''; m.forEach(function (x) { while (n >= x[0]) { s += x[1]; n -= x[0]; } }); return s; }
  // phương án sai dạng số: gần đáp án, khác nhau, không âm
  function nearNums(r, a, spread) { var out = [], tries = 0; while (out.length < 3 && tries++ < 60) { var d = ri(r, 1, Math.max(2, spread)) * (r() < 0.5 ? -1 : 1), v = a + d; if (v >= 0 && v !== a && out.indexOf(v) < 0) out.push(v); } var k = 1; while (out.length < 3) { if (out.indexOf(a + k) < 0) out.push(a + k); k++; } return out; }
  function others(r, list, ans, n) { return shuffle(r, list.filter(function (x) { return x !== ans; })).slice(0, n || 3); }
  // Mỗi bộ sinh trả về { sig, text, correct, wrong[], explain, cat, diff, verify() } — verify tính lại đáp án độc lập với text.
  var GEN = {
    arith: { cat: 'math', n: function () { return 90 * 90 * 2 + 90 * 8 * 2 + 9 * 9 * 9 * 90; }, make: function (r, d) {
      var a, b, c, op, ans, text;
      if (d === 1) { a = ri(r, 10, 99); b = ri(r, 10, 99); op = r() < 0.5 ? '+' : '−'; if (op === '−' && b > a) { var t = a; a = b; b = t; } ans = op === '+' ? a + b : a - b; text = a + ' ' + op + ' ' + b + ' = ?'; }
      else if (d === 2) { a = ri(r, 12, 99); b = ri(r, 2, 9); if (r() < 0.5) { op = '×'; ans = a * b; text = a + ' × ' + b + ' = ?'; } else { op = ':'; ans = a; a = a * b; text = a + ' : ' + b + ' = ?'; } }
      else { a = ri(r, 2, 9); b = ri(r, 2, 9); c = ri(r, 11, 99); ans = a * b * 10 + c; text = a + ' × ' + b + ' × 10 + ' + c + ' = ?'; }
      return { sig: 'arith:' + text, text: 'Tính nhanh: ' + text, correct: String(ans), wrong: nearNums(r, ans, d === 3 ? 20 : 9).map(String), explain: text.replace('?', String(ans)), verify: function () { return String(Function('return ' + text.replace('= ?', '').replace(/×/g, '*').replace(/−/g, '-').replace(/:/g, '/'))()); } };
    } },
    percent: { cat: 'math', n: function () { return 5 * 50; }, make: function (r) {
      var p = pick(r, [10, 20, 25, 50, 75]), n = ri(r, 1, 50) * 20, ans = n * p / 100;
      return { sig: 'pct:' + p + ':' + n, text: p + '% của ' + fmt(n) + ' là bao nhiêu?', correct: fmt(ans), wrong: nearNums(r, ans, Math.max(5, ans / 4)).map(fmt), explain: fmt(n) + ' × ' + p + ' : 100 = ' + fmt(ans), verify: function () { return fmt(n * p / 100); } };
    } },
    sequence: { cat: 'pattern', n: function () { return 20 * 9 + 9 * 3 * 5 + 15 + 9 * 9; }, make: function (r, d) {
      var kind = d === 1 ? 'arith' : d === 2 ? pick(r, ['geo', 'square', 'arith']) : pick(r, ['fib', 'alt', 'square']), s = [], nxt, rule;
      if (kind === 'arith') { var a = ri(r, 1, 20), st = ri(r, 2, 10); for (var i = 0; i < 5; i++) s.push(a + st * i); nxt = a + st * 5; rule = 'mỗi số hơn số trước ' + st + ' đơn vị'; }
      else if (kind === 'geo') { var g = ri(r, 1, 9), q = pick(r, [2, 3]); for (var j = 0; j < 5; j++) s.push(g * Math.pow(q, j)); nxt = g * Math.pow(q, 5); rule = 'mỗi số gấp ' + q + ' lần số trước'; }
      else if (kind === 'square') { var o = ri(r, 1, 15); for (var k = 0; k < 5; k++) s.push((o + k) * (o + k)); nxt = (o + 5) * (o + 5); rule = 'là bình phương các số liên tiếp từ ' + o; }
      else if (kind === 'fib') { var x = ri(r, 1, 9), y = ri(r, 1, 9); s = [x, y]; while (s.length < 6) s.push(s[s.length - 1] + s[s.length - 2]); nxt = s[4] + s[5]; s = s.slice(0, 6); rule = 'mỗi số bằng tổng hai số liền trước'; }
      else { var b0 = ri(r, 10, 30), up = ri(r, 3, 9), dn = ri(r, 1, up - 1); s = [b0]; for (var m = 0; m < 5; m++) s.push(m % 2 ? s[m] - dn : s[m] + up); nxt = s.length % 2 ? s[s.length - 1] + up : s[s.length - 1] - dn; rule = 'xen kẽ cộng ' + up + ' rồi trừ ' + dn; }
      return { sig: 'seq:' + s.join(','), text: 'Số tiếp theo của dãy: ' + s.join(', ') + ', ?', correct: String(nxt), wrong: nearNums(r, nxt, Math.max(4, Math.round(nxt / 6))).map(String), explain: 'Quy luật: ' + rule + ' → ' + nxt + '.', verify: function () { return String(nxt); } };
    } },
    order: { cat: 'logic', n: function () { return 4 * Math.pow(900, 4) / 24; }, make: function (r, d) {
      var nums = []; while (nums.length < 4) { var v = d === 1 ? ri(r, 10, 99) : ri(r, 100, 999); if (nums.indexOf(v) < 0) nums.push(v); }
      var mode = pick(r, ['max', 'min', 'second']), sorted = nums.slice().sort(function (a, b) { return a - b; }), ans = mode === 'max' ? sorted[3] : mode === 'min' ? sorted[0] : sorted[1];
      var q = mode === 'max' ? 'Số nào lớn nhất?' : mode === 'min' ? 'Số nào nhỏ nhất?' : 'Xếp tăng dần, số nào đứng thứ hai?';
      return { sig: 'ord:' + mode + nums.join(','), text: q + ' ' + nums.join(' · '), correct: String(ans), wrong: nums.filter(function (x) { return x !== ans; }).map(String), explain: 'Thứ tự tăng dần: ' + sorted.join(' < ') + '.', verify: function () { return String(ans); } };
    } },
    units: { cat: 'daily', n: function () { return UNITS.length * 99; }, make: function (r) {
      var u = pick(r, UNITS), x = ri(r, 2, 100), ans = x * u[2];
      return { sig: 'unit:' + u[0] + x, text: x + ' ' + u[0] + ' bằng bao nhiêu ' + u[1] + '?', correct: fmt(ans), wrong: [fmt(x * u[2] / 10), fmt(x * u[2] * 10), fmt(ans + u[2])].filter(function (w) { return w !== fmt(ans); }), explain: '1 ' + u[0] + ' = ' + fmt(u[2]) + ' ' + u[1] + ', nên ' + x + ' ' + u[0] + ' = ' + fmt(ans) + ' ' + u[1] + '.', verify: function () { return fmt(x * u[2]); } };
    } },
    clock: { cat: 'daily', n: function () { return 24 * 12 * 20 + 7 * 60; }, make: function (r) {
      if (r() < 0.5) { var h = ri(r, 0, 23), m = ri(r, 0, 11) * 5, add = ri(r, 1, 20) * 5, t = (h * 60 + m + add) % 1440, hh = function (v) { var a = Math.floor(v / 60), b = v % 60; return (a < 10 ? '0' : '') + a + ':' + (b < 10 ? '0' : '') + b; };
        var w = [t + 10, t - 10, t + 60].map(function (v) { return hh((v + 1440) % 1440); });
        return { sig: 'clk:' + h + m + add, text: 'Bây giờ là ' + hh(h * 60 + m) + '. Sau ' + add + ' phút nữa là mấy giờ?', correct: hh(t), wrong: w, explain: hh(h * 60 + m) + ' + ' + add + ' phút = ' + hh(t) + '.', verify: function () { return hh((h * 60 + m + add) % 1440); } }; }
      var d0 = ri(r, 0, 6), plus = ri(r, 2, 60), ans = DAYS[(d0 + plus) % 7];
      return { sig: 'day:' + d0 + ':' + plus, text: 'Hôm nay là ' + DAYS[d0] + '. ' + plus + ' ngày nữa là thứ mấy?', correct: ans, wrong: others(r, DAYS, ans), explain: plus + ' ngày = ' + Math.floor(plus / 7) + ' tuần và ' + plus % 7 + ' ngày, nên là ' + ans + '.', verify: function () { return DAYS[(d0 + plus) % 7]; } };
    } },
    change: { cat: 'math', n: function () { return 90 * 4; }, make: function (r) {
      var price = ri(r, 11, 99) * 1000, paid = pick(r, [100000, 200000, 500000]); if (paid <= price) paid = 100000; var ans = paid - price;
      return { sig: 'chg:' + price + ':' + paid, text: 'Mua món hàng giá ' + fmt(price) + ' đồng, đưa tờ ' + fmt(paid) + ' đồng. Được thối lại bao nhiêu?', correct: fmt(ans) + ' đồng', wrong: nearNums(r, ans / 1000, 9).map(function (v) { return fmt(v * 1000) + ' đồng'; }), explain: fmt(paid) + ' − ' + fmt(price) + ' = ' + fmt(ans) + ' đồng.', verify: function () { return fmt(paid - price) + ' đồng'; } };
    } },
    height: { cat: 'logic', n: function () { return 16 * 15 * 14 * 2; }, make: function (r) {
      var p = shuffle(r, NAMES).slice(0, 3), q = r() < 0.5 ? 'cao nhất' : 'thấp nhất', ans = q === 'cao nhất' ? p[0] : p[2];
      return { sig: 'h:' + p.join() + q, text: p[0] + ' cao hơn ' + p[1] + '. ' + p[1] + ' cao hơn ' + p[2] + '. Ai ' + q + '?', correct: ans, wrong: [p[1], q === 'cao nhất' ? p[2] : p[0], 'Không xác định được'], explain: 'Thứ tự từ cao đến thấp: ' + p.join(' > ') + '.', verify: function () { return ans; } };
    } },
    ages: { cat: 'logic', n: function () { return 20 * 30; }, make: function (r) {
      var diff = ri(r, 2, 21), young = ri(r, 5, 34), old = young + diff, sum = old + young, names = shuffle(r, NAMES).slice(0, 2);
      return { sig: 'age:' + diff + ':' + sum, text: names[0] + ' hơn ' + names[1] + ' ' + diff + ' tuổi, tổng tuổi hai người là ' + sum + '. ' + names[0] + ' bao nhiêu tuổi?', correct: String(old), wrong: [String(young), String(old + 1), String(old - 1)], explain: '(' + sum + ' + ' + diff + ') : 2 = ' + old + '.', verify: function () { return String((sum + diff) / 2); } };
    } },
    prime: { cat: 'math', n: function () { return 200; }, make: function (r) {
      var primes = [], comps = []; for (var i = 10; i < 100; i++) (isPrime(i) ? primes : comps).push(i); var ans = pick(r, primes), w = shuffle(r, comps.filter(function (c) { return c % 2 && c % 5; })).slice(0, 3);
      return { sig: 'prime:' + ans + w.join(), text: 'Số nào dưới đây là số nguyên tố?', correct: String(ans), wrong: w.map(String), explain: ans + ' chỉ chia hết cho 1 và chính nó; ' + w.map(function (c) { for (var d = 3; d < c; d++) if (c % d === 0) return c + ' = ' + d + ' × ' + c / d; return c; }).join('; ') + '.', verify: function () { return isPrime(ans) && w.every(function (c) { return !isPrime(c); }) ? String(ans) : 'lỗi'; } };
    } },
    roman: { cat: 'culture', n: function () { return 49; }, make: function (r) {
      var n = ri(r, 4, 49), s = roman(n);
      return { sig: 'rom:' + n, text: 'Số La Mã ' + s + ' bằng bao nhiêu?', correct: String(n), wrong: nearNums(r, n, 6).map(String), explain: s + ' = ' + n + '.', verify: function () { return String(n); } };
    } },
    capital: { cat: 'geo', n: function () { return CAPITALS.length * 2; }, make: function (r, d) {
      var c = pick(r, CAPITALS);
      if (d >= 2 && r() < 0.4) { var conts = ['châu Á', 'châu Âu', 'châu Mỹ', 'châu Phi', 'châu Đại Dương'];
        return { sig: 'cont:' + c[0], text: c[1] + ' là thủ đô của một quốc gia thuộc châu lục nào?', correct: c[2], wrong: others(r, conts, c[2]), explain: c[1] + ' là thủ đô của ' + c[0] + ' (' + c[2] + ').', verify: function () { return CAPITALS.filter(function (x) { return x[1] === c[1]; })[0][2]; } }; }
      return { sig: 'cap:' + c[0], text: 'Thủ đô của ' + c[0] + ' là thành phố nào?', correct: c[1], wrong: others(r, CAPITALS.map(function (x) { return x[1]; }), c[1]), explain: 'Thủ đô của ' + c[0] + ' là ' + c[1] + '.', verify: function () { return CAPITALS.filter(function (x) { return x[0] === c[0]; })[0][1]; } };
    } },
    planet: { cat: 'science', n: function () { return 8 + 3; }, make: function (r) {
      var mode = ri(r, 0, 3);
      if (mode === 0) { var i = ri(r, 0, 7); return { sig: 'pl:' + i, text: 'Tính từ Mặt Trời, hành tinh thứ ' + (i + 1) + ' là hành tinh nào?', correct: PLANETS[i], wrong: others(r, PLANETS, PLANETS[i]), explain: 'Thứ tự: ' + PLANETS.join(', ') + '.', verify: function () { return PLANETS[i]; } }; }
      var q = [['Hành tinh nào lớn nhất Hệ Mặt Trời?', 'Sao Mộc'], ['Hành tinh nào gần Mặt Trời nhất?', 'Sao Thủy'], ['Hành tinh nào được gọi là "hành tinh đỏ"?', 'Sao Hỏa']][mode - 1];
      return { sig: 'pl:' + q[0], text: q[0], correct: q[1], wrong: others(r, PLANETS, q[1]), explain: q[1] + '.', verify: function () { return q[1]; } };
    } },
    element: { cat: 'science', n: function () { return ELEMENTS.length * 2; }, make: function (r) {
      var e = pick(r, ELEMENTS), rev = r() < 0.5;
      return rev ? { sig: 'el:n:' + e[0], text: 'Nguyên tố có ký hiệu hóa học "' + e[0] + '" là gì?', correct: e[1], wrong: others(r, ELEMENTS.map(function (x) { return x[1]; }), e[1]), explain: e[0] + ' là ký hiệu của ' + e[1] + '.', verify: function () { return e[1]; } }
        : { sig: 'el:s:' + e[0], text: 'Ký hiệu hóa học của ' + e[1].toLowerCase() + ' là gì?', correct: e[0], wrong: others(r, ELEMENTS.map(function (x) { return x[0]; }), e[0]), explain: e[1] + ' có ký hiệu ' + e[0] + '.', verify: function () { return e[0]; } };
    } },
    history: { cat: 'history', n: function () { return (VN_HISTORY.length + WORLD_HISTORY.length) * 2 + 66; }, make: function (r, d, ctx) {
      var list = ctx && ctx.vn === false ? WORLD_HISTORY : r() < 0.7 ? VN_HISTORY : WORLD_HISTORY, e = pick(r, list);
      if (d >= 2 && r() < 0.5) { var o = pick(r, list.filter(function (x) { return x[1] !== e[1]; })), first = e[1] < o[1] ? e : o;
        return { sig: 'hf:' + e[0] + o[0], text: 'Sự kiện nào diễn ra trước?', correct: first[0], wrong: [first === e ? o[0] : e[0]], explain: e[0] + ' (' + e[1] + '), ' + o[0] + ' (' + o[1] + ').', verify: function () { return (e[1] < o[1] ? e : o)[0]; } }; }
      return { sig: 'hy:' + e[0], text: e[0] + ' vào năm nào?', correct: String(e[1]), wrong: nearNums(r, e[1], e[1] > 1000 ? 12 : 30).map(String), explain: e[0] + ': năm ' + e[1] + '.', verify: function () { return String(e[1]); } };
    } },
    literature: { cat: 'culture', n: function () { return BOOKS.length + ARTS.length; }, make: function (r) {
      var art = r() < 0.35, e = pick(r, art ? ARTS : BOOKS), pool = (art ? ARTS : BOOKS).map(function (x) { return x[1]; });
      return { sig: 'lit:' + e[0], text: (art ? e[0] + ' là tác phẩm của ai?' : 'Tác phẩm "' + e[0] + '" do ai viết?'), correct: e[1], wrong: others(r, pool, e[1]), explain: e[0] + ' — ' + e[1] + '.', verify: function () { return e[1]; } };
    } },
    fact: { cat: 'mixed', n: function () { return FACTS.length; }, make: function (r, d, ctx) {
      var pool = FACTS.filter(function (f) { return Math.abs(f[5] - d) <= 1 && !(ctx && ctx.vn === false && VN_ONLY.test(f[0] + ' ' + f[1] + ' ' + f[2].join(' '))); }); var f = pick(r, pool.length ? pool : FACTS);
      return { sig: 'fact:' + f[0], text: f[0], correct: f[1], wrong: f[2].slice(), explain: f[3], cat: f[4], verify: function () { return f[1]; } };
    } }
  };
  var VN_ONLY = /Việt Nam|Hội An|Hạ Long|quan họ|Fansipan|Đàn bầu|Bà Đen|Ngọc Linh|Tây Côn Lĩnh|Quảng Ninh|Quảng Nam/;
  var GEN_KEYS = Object.keys(GEN);
  function variants() { return GEN_KEYS.reduce(function (s, k) { return s + GEN[k].n(); }, 0); }
  // Sinh một câu hỏi trắc nghiệm, tránh lặp chữ ký gần đây và tránh cùng dạng liên tiếp.
  function generate(seed, o) {
    o = o || {}; var r = seeded(seed), d = o.diff || 1, recent = o.recent || [], lastKind = o.lastKind, q, kind, tries = 0;
    var kinds = o.kinds || (o.vn === false ? GEN_KEYS.filter(function (k) { return k !== 'change'; }) : GEN_KEYS); // tiền đồng chỉ hỏi ở bản Việt Nam
    do { kind = pick(r, kinds.length > 1 ? kinds.filter(function (k) { return k !== lastKind; }) : kinds); q = GEN[kind].make(r, d, o); } while (recent.indexOf(q.sig) >= 0 && tries++ < 25);
    var opts = shuffle(r, [q.correct].concat(q.wrong.filter(function (w, i, a) { return w !== q.correct && a.indexOf(w) === i; }).slice(0, o.choices ? o.choices - 1 : 3)));
    return { sig: q.sig, kind: kind, cat: q.cat || GEN[kind].cat, diff: d, text: q.text, options: opts, answer: opts.indexOf(q.correct), explain: q.explain, check: q.verify() };
  }
  function verify(q) { return q.answer >= 0 && q.options[q.answer] === q.check && new Set(q.options).size === q.options.length; }
  E.QUIZ151 = { generate: generate, verify: verify, variants: variants, kinds: GEN_KEYS, facts: FACTS.length, tables: { capitals: CAPITALS.length, elements: ELEMENTS.length, history: VN_HISTORY.length + WORLD_HISTORY.length, books: BOOKS.length + ARTS.length } };

  // ===================================================================
  // E.SHOW151 — danh mục chương trình và trạng thái tham gia
  // ===================================================================
  function S(l) { var s = l.flags.show151 || (l.flags.show151 = {}); if (!Array.isArray(s.history)) s.history = []; if (!s.paid || typeof s.paid !== 'object') s.paid = {}; if (!Array.isArray(s.recent)) s.recent = []; if (!s.invites || typeof s.invites !== 'object') s.invites = {}; return s; }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function jobCat(l) { var c = l.job && E.jobDef ? E.jobDef(l) : null; return c ? c.cat : null; }
  function famous(l) { return (l.fame || 0) >= 1e5; }
  function knowledge(l) { return U.clamp(((l.st && l.st.kno) || 40) / 100 * 0.7 + Math.min(1, (l.edu || 0) / 7) * 0.3, 0, 1); }
  var SHOWS = {};
  function define(id, o) { o.id = id; SHOWS[id] = o; return o; }
  function hist(l, id) { return S(l).history.filter(function (h) { return h.id === id; }); }
  function season(l, sh) { return Math.max(1, yr(l) - sh.from + 1); }
  function airing(l, sh) { var y = yr(l); return y >= sh.from && (!sh.to || y <= sh.to) && (sh.country === 'ANY' ? true : sh.country === 'WORLD' ? (l.abroad && l.abroad.code || l.country) !== 'VN' : (l.abroad && l.abroad.code || l.country) === sh.country); }
  // Điều kiện theo vai trò; trả về true hoặc lý do
  function canJoin(l, sh, role) {
    if (!free(l)) return 'Hiện không thể tham gia';
    if (!E.SHOW151.airing(l, sh)) return sh.to && yr(l) > sh.to ? 'Chương trình đã ngừng sản xuất' : yr(l) < sh.from ? 'Chương trình chưa ra đời' : 'Chương trình không phát sóng ở nơi bạn sống';
    var R = sh.roles[role]; if (!R) return 'Chương trình không có vai trò này';
    if (S(l).active) return 'Đang tham gia một chương trình khác';
    var h = hist(l, sh.id).filter(function (x) { return x.role === role; }), last = h[h.length - 1];
    if (R.once && h.length) return 'Mỗi người chỉ tham gia một lần';
    if (last && yr(l) - last.year < (R.gap || 1)) return 'Đã tham gia mùa gần đây, chờ mùa sau';
    var w = R.why ? R.why(l) : true; return w;
  }
  function invitedBack(l, id) { var x = S(l).invites[id]; return x && yr(l) <= x.until; }

  // ===================================================================
  // Bộ chạy chung: mỗi bước là một menu lựa chọn; handler quyết định nội dung và kết quả
  // ===================================================================
  var HANDLERS = {};
  function A(l) { return S(l).active; }
  // Bộ xử lý theo vai trò (huấn luyện viên / giám khảo có luật riêng), mặc định theo chương trình
  function hd(a) { var sh = SHOWS[a.id], R = sh && sh.roles[a.role]; return HANDLERS[R && R.handler || sh.handler]; }
  function token(l) { return A(l) && A(l).token; }
  function begin(l, r, log, id, role, o) {
    var sh = SHOWS[id], s = S(l); if (canJoin(l, sh, role) !== true) return null;
    var a = { id: id, role: role, year: yr(l), age: l.age, season: season(l, sh), token: id + ':' + yr(l) + ':' + hash(l.id + id + l.age).toString(36), step: 0, manual: o && o.manual != null ? o.manual : true, log: [] };
    s.active = a; delete s.invites[id];
    hd(a).start(l, r, a, sh);
    var feeBase = sh.roles[role].fee || sh.fee; if (feeBase && role !== 'contestant' && role !== 'player') { var fee = V(l, feeBase * (1 + Math.log10(1 + (l.fame || 0) / 1e5))); pay(l, a, 'fee', fee, 'Cát-xê ' + sh.name); }
    log((role === 'contestant' || role === 'player' ? 'Bạn đăng ký tham gia ' : 'Bạn nhận lời ' + sh.roles[role].n + ' ') + sh.name + ' mùa ' + a.season + '.', 'neutral');
    queue(l, r);
    return a;
  }
  function queue(l, r) { var a = A(l); if (!a) return; X.next(l, 'show151_step', r, { token: a.token, step: a.step }, { manual: a.manual }); }
  // Trả tiền đúng một lần cho mỗi khoản (mùa, vai trò, loại khoản)
  function pay(l, a, kind, v, why) { var key = a.token + ':' + kind; if (S(l).paid[key] || !(v > 0)) return 0; S(l).paid[key] = l.age; H.cash(l, v, why); a.earned = (a.earned || 0) + v; return v; }
  function finish(l, log, res) {
    var a = A(l); if (!a) return null; var sh = SHOWS[a.id], s = S(l);
    var prize = res.prize > 0 ? pay(l, a, 'prize', res.prize, 'Tiền thưởng ' + sh.name) : 0;
    var fameGain = Math.round((res.fame || 0) * (1 + (l.fame || 0) / 2e6));
    l.fame = (l.fame || 0) + fameGain;
    var rec = { id: a.id, name: sh.name, role: a.role, season: a.season, year: a.year, age: a.age, result: res.result, rank: res.rank || null, prize: prize, earned: a.earned || 0, highlight: res.highlight || null };
    s.history.push(rec); if (s.history.length > 60) s.history.splice(0, s.history.length - 60);
    delete s.active;
    if (res.invite) s.invites[res.invite.id || a.id] = { until: yr(l) + (res.invite.years || 2), why: res.invite.why || 'được khán giả nhớ tới' };
    if (res.hap) H.fx(l, { hap: res.hap });
    log(sh.name + ' mùa ' + a.season + ': ' + res.result + (prize ? ', nhận ' + mo(l, prize) : '') + (fameGain > 0 ? '. Có thêm ' + U.fmtNum(fameGain) + ' người biết đến bạn' : '') + '.', res.good ? 'good' : 'neutral');
    if (res.mem) H.mem(l, res.mem, 4);
    return rec;
  }
  X.menu('show151_step', function (l) { var a = A(l); return a ? SHOWS[a.id].name + ' · ' + hd(a).title(l, a, SHOWS[a.id]) : 'Chương trình truyền hình'; },
    function (l) { return A(l) ? true : 'Không có chương trình đang diễn ra'; },
    function (l, d) { var a = A(l); if (!a || d && d.arg && d.arg.token !== a.token) return 'Chương trình đã kết thúc.'; return hd(a).text(l, a, SHOWS[a.id]); },
    function (l, arg) {
      var a = A(l); if (!a || arg.token !== a.token || arg.step !== a.step) return [];
      return hd(a).rows(l, a, SHOWS[a.id]).map(function (row) { var run = row.run; row.run = function (l, r, log) { var b = A(l); if (!b || b.token !== arg.token || b.step !== arg.step) return; b.step++; run(l, r, log); if (A(l) === b && !b.waiting) queue(l, r); }; /* đang chơi trò nhỏ thì chờ trò đó kết thúc */ return row; });
    });
  // Chế độ Tự động trả lời theo hiểu biết của nhân vật, không phải chọn ngẫu nhiên.
  E.DEC.show151_step.auto = function (l, d, r) {
    var a = A(l), keys = d.data && d.data.keys || [], allowed = function (k) { var i = keys.indexOf(k); return i >= 0 && d.opts.some(function (o) { return o.k === String(i); }); };
    var k = a && hd(a).auto ? hd(a).auto(l, a, r, allowed) : null;
    if (k != null && allowed(k)) return String(keys.indexOf(k));
    var first = d.opts.find(function (o) { return o.k !== 'cancel'; }); return first ? first.k : 'cancel';
  };
  // Trả lời câu hỏi: hàng lựa chọn A/B/C/D
  var LETTER = ['A', 'B', 'C', 'D'];
  function qRows(l, a, onAnswer, hide) { return a.q.options.map(function (o, i) { return (hide || []).indexOf(i) >= 0 ? null : { k: 'o' + i, l: LETTER[i] + '. ' + o, run: function (l, r, log) { onAnswer(l, r, log, i === a.q.answer, i); } }; }).filter(Boolean); }
  function autoAnswer(l, a, r, bonus) { var q = a.q, p = U.clamp(0.25 + knowledge(l) * 0.7 - (q.diff - 1) * 0.12 + (bonus || 0), 0.1, 0.97); if (r() < p) return 'o' + q.answer; var wrong = q.options.map(function (o, i) { return i; }).filter(function (i) { return i !== q.answer && (a.hide || []).indexOf(i) < 0; }); return wrong.length ? 'o' + pick(r, wrong) : 'o' + q.answer; }
  function newQ(l, a, diff, o) {
    var s = S(l); a.qn = (a.qn || 0) + 1;
    var q = generate(a.token + ':' + a.qn, Object.assign({ diff: diff, recent: s.recent, lastKind: a.q && a.q.kind, vn: vn(l) }, o || {}));
    s.recent.push(q.sig); if (s.recent.length > 80) s.recent.splice(0, s.recent.length - 80);
    a.q = q; a.hide = null; return q;
  }
  function verdict(a, okAns, picked) { var q = a.q; return (okAns ? 'Đúng! ' : 'Chưa đúng' + (picked != null ? ' (bạn chọn ' + LETTER[picked] + ')' : '') + '. Đáp án: ' + LETTER[q.answer] + '. ' + q.options[q.answer] + '. ') + q.explain; }
  function note(a, t) { a.log.push(t); if (a.log.length > 6) a.log.shift(); }
  function recap(a) { return a.log.length ? a.log.slice(-2).join('\n') + '\n\n' : ''; }

  // ---------- Nhanh Như Chớp: thang chuỗi đúng liên tiếp ----------
  // Luật mô phỏng: 15 câu hỏi nhanh; đúng thì lên một bậc, sai thì về bậc 0; điểm là chuỗi đúng dài nhất.
  // Đạt chuỗi 10 câu đúng liên tiếp: giải 20 triệu đồng (bản mô phỏng Việt Nam). Không được bỏ qua câu.
  HANDLERS.streak = {
    start: function (l, r, a, sh) { a.qi = 0; a.streak = 0; a.best = 0; a.total = sh.questions; a.helper = companion(l); newQ(l, a, 1, { choices: 3 }); },
    title: function (l, a) { return 'Câu ' + (a.qi + 1) + '/' + a.total; },
    text: function (l, a, sh) { return recap(a) + 'Chuỗi đúng hiện tại: ' + a.streak + ' · dài nhất: ' + a.best + ' · cần ' + sh.target + ' câu liên tiếp để nhận ' + mo(l, V(l, sh.prize)) + '.' + (a.helper && !a.helperUsed ? ' Bạn có thể nhờ ' + a.helper.name + ' gợi ý một lần.' : '') + '\n\n' + a.q.text; },
    rows: function (l, a, sh) {
      var self = this, rows = qRows(l, a, function (l, r, log, okAns, i) { self.answer(l, r, log, a, sh, okAns, i); }, a.hide);
      if (a.helper && !a.helperUsed) rows.push({ k: 'help', l: 'Nhờ ' + a.helper.name + ' gợi ý (một lần)', run: function (l, r) { a.helperUsed = true; a.step--; var right = r() < a.helper.skill; a.hide = a.q.options.map(function (o, i) { return i; }).filter(function (i) { return right ? i !== a.q.answer : i === a.q.answer; }).slice(0, 1); note(a, a.helper.name + ' thì thầm: "Không phải ' + LETTER[a.hide[0]] + ' đâu."'); } });
      return rows;
    },
    answer: function (l, r, log, a, sh, okAns, i) {
      a.qi++; note(a, 'Câu ' + a.qi + ': ' + verdict(a, okAns, i));
      if (okAns) { a.streak++; a.best = Math.max(a.best, a.streak); } else a.streak = 0;
      if (a.best >= sh.target || a.qi >= a.total || a.total - a.qi + a.streak < sh.target) return this.end(l, log, a, sh); /* không còn đủ câu để đạt chuỗi mục tiêu thì kết thúc, điểm là chuỗi dài nhất */
      newQ(l, a, a.streak >= 6 ? 3 : a.streak >= 3 ? 2 : 1, { choices: 3 });
    },
    end: function (l, log, a, sh) {
      var win = a.best >= sh.target, celeb = a.role === 'celeb';
      finish(l, log, { result: win ? 'đạt chuỗi ' + a.best + ' câu đúng liên tiếp — chiến thắng' : 'chuỗi đúng dài nhất ' + a.best + ' câu', prize: win && !celeb ? V(l, sh.prize) : 0, fame: win ? 15000 : 2000 + a.best * 500, good: win, hap: win ? 6 : 1, rank: a.best,
        highlight: win && celeb ? 'tiền thưởng ủng hộ quỹ từ thiện' : null, invite: win || a.best >= 7 ? { years: 3, why: 'khán giả nhớ màn trả lời nhanh' } : null, mem: win ? 'Trả lời đúng ' + a.best + ' câu liên tiếp trên trường quay ' + sh.name + '.' : null });
      if (win && celeb) log('Tiền thưởng của khách mời nổi tiếng được chuyển cho quỹ từ thiện, không vào tài khoản của bạn.', 'neutral');
    },
    auto: function (l, a, r, allowed) { if (a.helper && !a.helperUsed && a.streak >= 7 && allowed('help')) return 'help'; return autoAnswer(l, a, r, a.hide ? 0.2 : 0); }
  };
  function companion(l) {
    var f = (l.friends || []).filter(function (x) { return x.alive !== false; })[0] || (l.partner && l.partner.alive !== false ? l.partner : null) || l.bff;
    return f ? { name: f.name, skill: 0.55 + Math.min(0.3, (f.close || 50) / 300) } : { name: 'người dẫn chương trình', skill: 0.5 };
  }

  // ---------- Ai Là Triệu Phú: thang tiền 15 câu, mốc an toàn, 4 quyền trợ giúp ----------
  var LADDER_150 = [0.2, 0.4, 0.6, 1, 2, 3, 6, 10, 14, 22, 30, 40, 60, 85, 150];
  function ladder(l, sh) { var top = sh.top(l), k = top / 150; return LADDER_150.map(function (v) { return V(l, v * k); }); }
  HANDLERS.ladder = {
    start: function (l, r, a) { a.qi = 0; a.life = { fifty: true, audience: true, phone: true, expert: true }; newQ(l, a, 1); },
    title: function (l, a) { return 'Câu hỏi số ' + (a.qi + 1); },
    text: function (l, a, sh) { var L = ladder(l, sh), safe = a.qi >= 10 ? L[9] : a.qi >= 5 ? L[4] : 0; return recap(a) + 'Câu hỏi số ' + (a.qi + 1) + ' trị giá ' + mo(l, L[a.qi]) + '. Đang có ' + mo(l, a.qi ? L[a.qi - 1] : 0) + ', mốc an toàn ' + mo(l, safe) + ' (câu 5 và câu 10).' + (a.hint ? '\n' + a.hint : '') + '\n\n' + a.q.text; },
    rows: function (l, a, sh) {
      var self = this, rows = qRows(l, a, function (l, r, log, okAns, i) { self.answer(l, r, log, a, sh, okAns, i); }, a.hide), L = ladder(l, sh);
      var life = [['fifty', '50:50 — bỏ hai phương án sai'], ['audience', 'Hỏi ý kiến khán giả trong trường quay'], ['phone', 'Gọi điện thoại cho người thân'], ['expert', 'Hỏi tổ tư vấn tại chỗ']];
      life.forEach(function (x) { if (a.life[x[0]]) rows.push({ k: x[0], l: x[1], run: function (l, r) { a.step--; a.life[x[0]] = false; self.help(l, r, a, x[0]); } }); });
      if (a.qi > 0) rows.push({ k: 'stop', l: 'Dừng cuộc chơi, mang về ' + mo(l, L[a.qi - 1]), run: function (l, r, log) { self.end(l, log, a, sh, L[a.qi - 1], 'dừng cuộc chơi ở câu ' + (a.qi + 1)); } });
      return rows;
    },
    help: function (l, r, a, k) {
      var q = a.q, wrong = q.options.map(function (o, i) { return i; }).filter(function (i) { return i !== q.answer && (a.hide || []).indexOf(i) < 0; });
      if (k === 'fifty') { a.hide = (a.hide || []).concat(shuffle(r, wrong).slice(0, Math.max(0, wrong.length - 1))); a.hint = 'Còn lại hai phương án.'; return; }
      var acc = k === 'audience' ? 0.75 - (q.diff - 1) * 0.15 : k === 'phone' ? companion(l).skill - (q.diff - 1) * 0.1 : 0.7 - (q.diff - 1) * 0.08;
      var right = r() < acc, pickI = right ? q.answer : pick(r, wrong.length ? wrong : [q.answer]);
      if (k === 'audience') { var vis = q.options.map(function (o, i) { return i; }).filter(function (i) { return (a.hide || []).indexOf(i) < 0; }), share = {}, top = Math.round(35 + r() * 35), rest = 100 - top, oth = vis.filter(function (i) { return i !== pickI; }), wts = oth.map(function () { return 0.2 + r(); }), wsum = wts.reduce(function (x, y) { return x + y; }, 0); share[pickI] = top; oth.forEach(function (i, j) { share[i] = j === oth.length - 1 ? rest - oth.slice(0, j).reduce(function (x, k) { return x + share[k]; }, 0) : Math.round(rest * wts[j] / wsum); }); a.hint = 'Khán giả: ' + vis.map(function (i) { return LETTER[i] + ' ' + share[i] + '%'; }).join(' · ') + '.'; }
      else a.hint = (k === 'phone' ? companion(l).name + ' trả lời qua điện thoại: ' : 'Tổ tư vấn nhận định: ') + '"Mình nghiêng về ' + LETTER[pickI] + '. ' + q.options[pickI] + (right ? '."' : ', nhưng không chắc lắm."');
    },
    answer: function (l, r, log, a, sh, okAns, i) {
      var L = ladder(l, sh); note(a, 'Câu ' + (a.qi + 1) + ': ' + verdict(a, okAns, i)); a.hint = null;
      if (!okAns) return this.end(l, log, a, sh, a.qi >= 10 ? L[9] : a.qi >= 5 ? L[4] : 0, 'trả lời sai câu ' + (a.qi + 1));
      a.qi++; if (a.qi >= 15) return this.end(l, log, a, sh, L[14], 'vượt qua cả 15 câu hỏi');
      newQ(l, a, a.qi >= 10 ? 3 : a.qi >= 5 ? 2 : 1);
    },
    end: function (l, log, a, sh, money, how) {
      var win = a.qi >= 15;
      finish(l, log, { result: how, prize: money, fame: win ? 2e5 : a.qi >= 10 ? 3e4 : 3000, good: money > 0, hap: win ? 12 : money > 0 ? 3 : -2, rank: a.qi, invite: null, mem: win ? 'Chinh phục câu hỏi số 15 của ' + sh.name + '.' : null });
    },
    auto: function (l, a, r, allowed) {
      var p = U.clamp(0.25 + knowledge(l) * 0.7 - (a.q.diff - 1) * 0.12, 0.1, 0.95);
      if (p < 0.45 && !a.hide && allowed('fifty')) return 'fifty';
      if (p < 0.5 && !a.hint && allowed('audience')) return 'audience';
      if (a.qi >= 10 && p < 0.55 && allowed('stop')) return 'stop';
      return autoAnswer(l, a, r, a.hint ? 0.15 : 0);
    }
  };

  // ---------- Đấu Trường 100: một người đấu với 100 người ----------
  HANDLERS.mob = {
    start: function (l, r, a) { a.mob = 100; a.bank = 0; a.qi = 0; newQ(l, a, 1, { choices: 3 }); },
    title: function (l, a) { return 'Còn ' + a.mob + ' người trong đấu trường'; },
    text: function (l, a, sh) { return recap(a) + 'Còn ' + a.mob + '/100 người thách đấu. Tiền tích lũy: ' + mo(l, a.bank) + '. Trả lời sai thì mất toàn bộ tiền tích lũy.\n\n' + a.q.text; },
    rows: function (l, a, sh) { var self = this, rows = qRows(l, a, function (l, r, log, okAns, i) { self.answer(l, r, log, a, sh, okAns, i); }); if (a.qi >= 3 && a.bank > 0) rows.push({ k: 'stop', l: 'Dừng lại, nhận ' + mo(l, a.bank), run: function (l, r, log) { self.end(l, log, a, sh, a.bank, 'dừng cuộc chơi khi còn ' + a.mob + ' người'); } }); return rows; },
    answer: function (l, r, log, a, sh, okAns, i) {
      a.qi++;
      if (!okAns) { note(a, verdict(a, false, i)); return this.end(l, log, a, sh, 0, 'trả lời sai khi còn ' + a.mob + ' người'); }
      var rr = seeded(a.token + ':mob' + a.qi), p = U.clamp(0.82 - (a.q.diff - 1) * 0.15, 0.4, 0.95), out = 0; for (var k = 0; k < a.mob; k++) if (rr() > p) out++;
      a.mob -= out; a.bank += V(l, sh.perHead) * out * (1 + a.qi * 0.15);
      note(a, verdict(a, true) + ' ' + out + ' người trả lời sai bị loại.');
      if (a.mob <= 0) return this.end(l, log, a, sh, V(l, sh.grand), 'đánh bại toàn bộ 100 người');
      newQ(l, a, a.mob <= 20 ? 3 : a.mob <= 60 ? 2 : 1, { choices: 3 });
    },
    end: function (l, log, a, sh, money, how) { var win = a.mob <= 0; finish(l, log, { result: how, prize: money, fame: win ? 8e4 : 4000, good: money > 0, hap: win ? 10 : money ? 3 : -2, rank: 100 - a.mob }); },
    auto: function (l, a, r, allowed) { var p = U.clamp(0.25 + knowledge(l) * 0.7 - (a.q.diff - 1) * 0.12, 0.1, 0.95); if (a.bank > V(l, 20) && p < 0.5 && allowed('stop')) return 'stop'; return autoAnswer(l, a, r); }
  };

  // ---------- Đường Lên Đỉnh Olympia: 4 thí sinh, 4 phần thi, tuần → tháng → quý → năm ----------
  var STAGES = ['Cuộc thi tuần', 'Cuộc thi tháng', 'Cuộc thi quý', 'Chung kết năm'];
  var KEYWORDS = [['ĐIỆN BIÊN PHỦ', 'history'], ['THĂNG LONG', 'history'], ['BẠCH ĐẰNG', 'history'], ['FANSIPAN', 'geo'], ['THÁI BÌNH DƯƠNG', 'geo'], ['QUANG HỢP', 'science'], ['TRUYỆN KIỀU', 'culture'], ['HẠ LONG', 'geo']];
  function rivals(l, a, n) { var rr = seeded(a.token + ':npc'); return Array.from({ length: n }, function () { var sex = rr() < 0.5 ? 'M' : 'F'; return { name: H.stranger(l, rr, sex), skill: 0.45 + rr() * 0.4, speed: 0.4 + rr() * 0.5, pts: 0 }; }); }
  HANDLERS.olympia = {
    start: function (l, r, a) { a.stage = a.stage || 0; this.episode(l, a); },
    episode: function (l, a) { a.part = 'kd'; a.pi = 0; a.pts = 0; a.npc = rivals(l, a, 3); var kw = KEYWORDS[hash(a.token + a.stage) % KEYWORDS.length]; a.kw = kw[0]; a.opened = 0; a.kwDone = false; newQ(l, a, 1 + Math.min(1, a.stage)); },
    title: function (l, a) { return STAGES[a.stage] + ' · ' + { kd: 'Khởi động', cnv: 'Vượt chướng ngại vật', tt: 'Tăng tốc', vd: 'Về đích' }[a.part]; },
    board: function (a) { return 'Điểm: bạn ' + a.pts + ' · ' + a.npc.map(function (n) { return n.name + ' ' + n.pts; }).join(' · '); },
    text: function (l, a) {
      var intro = { kd: 'Khởi động: bấm chuông giành quyền trả lời, đúng +10, sai −5. Có thể không bấm chuông.', cnv: 'Chướng ngại vật có ' + a.kw.replace(/ /g, '').length + ' chữ cái. Mỗi câu hỏi hàng ngang trả lời đúng mở thêm một gợi ý. Đoán đúng từ khóa càng sớm càng nhiều điểm; đoán sai thì dừng phần thi này.', tt: 'Tăng tốc: ai trả lời đúng nhanh hơn được nhiều điểm hơn (40 · 30 · 20 · 10).', vd: 'Về đích: chọn giá trị câu hỏi 10, 20 hoặc 30 điểm; trả lời sai bị trừ một nửa.' }[a.part];
      var clue = a.part === 'cnv' ? '\nGợi ý đã mở: ' + (a.opened ? a.kw.split('').map(function (c, i) { return c === ' ' ? ' ' : i < a.opened * 2 ? c : '_'; }).join('') : 'chưa có') : '';
      return recap(a) + this.board(a) + '\n' + intro + clue + (a.q ? '\n\n' + a.q.text : '');
    },
    rows: function (l, a, sh) {
      var self = this;
      if (a.part === 'vd' && a.vdPick == null) return [10, 20, 30].map(function (v) { return { k: 'v' + v, l: 'Chọn câu hỏi ' + v + ' điểm', run: function (l, r) { a.vdPick = v; a.step--; newQ(l, a, v / 10 + (a.stage >= 2 ? 0 : -0) > 3 ? 3 : v / 10); } }; });
      var rows = qRows(l, a, function (l, r, log, okAns, i) { self.answer(l, r, log, a, sh, okAns, i, false); });
      if (a.part === 'kd') rows.push({ k: 'pass', l: 'Không bấm chuông', run: function (l, r, log) { self.answer(l, r, log, a, sh, false, null, true); } });
      if (a.part === 'cnv' && !a.kwDone) {
        var rr = seeded(a.token + ':kw' + a.stage), pool = shuffle(rr, KEYWORDS.map(function (k) { return k[0]; }).filter(function (k) { return k !== a.kw; })).slice(0, 3).concat([a.kw]); pool = shuffle(rr, pool);
        pool.forEach(function (w, i) { rows.push({ k: 'kw' + i, l: 'Bấm chuông đoán chướng ngại vật: ' + w, run: function (l, r, log) { self.keyword(l, r, log, a, sh, w === a.kw); } }); });
      }
      return rows;
    },
    npcTurn: function (a, rr, diff) { var best = null; a.npc.forEach(function (n) { var ok = rr() < n.skill - (diff - 1) * 0.1, t = rr() * (1.2 - n.speed); if (ok && (!best || t < best.t)) best = { n: n, t: t }; }); return best; },
    answer: function (l, r, log, a, sh, okAns, i, passed) {
      var rr = seeded(a.token + ':' + a.stage + a.part + a.pi), q = a.q, me = U.clamp(0.4 + knowledge(l) * 0.5, 0.2, 0.95), npc = this.npcTurn(a, rr, q.diff), myT = rr() * (1.2 - me);
      if (a.part === 'kd') {
        if (passed) { if (npc) { npc.n.pts += 10; note(a, npc.n.name + ' giành quyền và trả lời đúng: ' + q.options[q.answer] + '.'); } else note(a, 'Không ai trả lời đúng. Đáp án: ' + q.options[q.answer] + '.'); }
        else if (npc && npc.t < myT * 0.6) { npc.n.pts += 10; note(a, npc.n.name + ' bấm chuông nhanh hơn và trả lời đúng: ' + q.options[q.answer] + '.'); }
        else { a.pts += okAns ? 10 : -5; note(a, 'Bạn bấm chuông. ' + verdict(a, okAns, i)); }
      } else if (a.part === 'cnv') { if (okAns) a.opened++; note(a, 'Hàng ngang ' + (a.pi + 1) + ': ' + verdict(a, okAns, i) + (okAns ? ' Mở thêm gợi ý.' : '')); a.npc.forEach(function (n) { if (rr() < n.skill * 0.25 * (a.pi + 1) / 4 && !a.kwDone) { a.kwDone = true; n.pts += 60 - a.pi * 10; note(a, n.name + ' đoán đúng chướng ngại vật "' + a.kw + '".'); } }); }
      else if (a.part === 'tt') { var faster = a.npc.filter(function (n) { return rr() < n.skill - (q.diff - 1) * 0.1 && rr() * (1.2 - n.speed) < myT; }).length, pts = okAns ? [40, 30, 20, 10][Math.min(3, faster)] : 0; a.pts += pts; a.npc.forEach(function (n, j) { if (rr() < n.skill) n.pts += [30, 20, 10][j % 3]; }); note(a, verdict(a, okAns, i) + (okAns ? ' Bạn đứng thứ ' + (faster + 1) + ' về tốc độ, +' + pts + ' điểm.' : '')); }
      else { var v = a.vdPick; a.pts += okAns ? v : -Math.round(v / 2); note(a, 'Câu ' + v + ' điểm: ' + verdict(a, okAns, i)); a.npc.forEach(function (n) { n.pts += rr() < n.skill ? 20 : -5; }); a.vdPick = null; }
      a.pi++; this.advance(l, r, log, a, sh);
    },
    keyword: function (l, r, log, a, sh, right) { if (a.kwDone) return; a.kwDone = true; if (right) { var p = 60 - a.opened * 10; a.pts += p; note(a, 'Bạn đoán đúng chướng ngại vật "' + a.kw + '", +' + p + ' điểm!'); } else { note(a, 'Đoán sai chướng ngại vật, bạn dừng phần thi này. Từ khóa là "' + a.kw + '".'); a.pi = 4; } this.advance(l, r, log, a, sh); },
    advance: function (l, r, log, a, sh) {
      var limit = { kd: 6, cnv: 4, tt: 4, vd: 3 }[a.part];
      if (a.pi >= limit || a.part === 'cnv' && a.kwDone && a.pi >= 1) { var order = ['kd', 'cnv', 'tt', 'vd'], nx = order[order.indexOf(a.part) + 1]; if (!nx) return this.result(l, r, log, a, sh); a.part = nx; a.pi = 0; }
      if (a.part === 'vd') { a.q = null; return; }
      newQ(l, a, a.part === 'tt' ? 2 + (a.stage >= 2 ? 1 : 0) : 1 + Math.min(2, a.stage));
    },
    result: function (l, r, log, a, sh) {
      var all = [{ name: 'Bạn', pts: a.pts, me: true }].concat(a.npc).sort(function (x, y) { return y.pts - x.pts; }), rank = all.findIndex(function (x) { return x.me; }) + 1;
      note(a, STAGES[a.stage] + ': ' + all.map(function (x) { return x.name + ' ' + x.pts; }).join(' · ') + '.');
      if (rank === 1 && a.stage < 3) { log('Bạn giành vòng nguyệt quế ' + STAGES[a.stage].toLowerCase() + ' và vào ' + STAGES[a.stage + 1].toLowerCase() + '.', 'good'); l.fame = (l.fame || 0) + 2000 * (a.stage + 1); a.stage++; this.episode(l, a); return; }
      var champion = rank === 1, prize = champion ? V(l, 200) : a.stage >= 2 ? V(l, 20 * (5 - rank)) : 0;
      finish(l, log, { result: champion ? 'vô địch Chung kết năm' : 'xếp thứ ' + rank + ' ' + STAGES[a.stage].toLowerCase(), prize: prize, fame: champion ? 1.5e5 : 3000 * (a.stage + 1), good: champion || a.stage >= 1, hap: champion ? 15 : a.stage ? 4 : 1, rank: rank, highlight: champion ? 'học bổng du học' : null, mem: champion ? 'Đêm chung kết ' + sh.name + ', bạn giương cao chiếc cúp.' : a.stage ? 'Lọt vào ' + STAGES[a.stage].toLowerCase() + ' ' + sh.name + '.' : null });
      if (champion) { l.flags.olympiaChampion151 = yr(l); if (l.st) l.st.kno = Math.min(100, l.st.kno + 5); }
    },
    auto: function (l, a, r, allowed) { if (a.part === 'vd' && a.vdPick == null) return knowledge(l) > 0.7 ? 'v30' : knowledge(l) > 0.5 ? 'v20' : 'v10'; if (a.part === 'kd' && knowledge(l) < 0.35 && r() < 0.5) return 'pass'; return autoAnswer(l, a, r); }
  };

  // ---------- Siêu Trí Tuệ: ghi nhớ + tính nhẩm + quy luật, giám khảo chấm, đối đầu ----------
  HANDLERS.memory = {
    start: function (l, r, a) { a.round = 0; a.score = 0; a.ch = 0; a.npc = rivals(l, a, 2); this.setup(l, a); },
    setup: function (l, a) {
      var rr = seeded(a.token + ':m' + a.round + a.ch), kind = ['digits', 'items', 'calc'][a.ch];
      a.kind = kind; a.shown = false;
      if (kind === 'digits') { var n = 6 + a.round * 2, ds = Array.from({ length: n }, function () { return ri(rr, 0, 9); }), pos = ri(rr, 1, n); a.memo = ds.join(' '); var c = String(ds[pos - 1]), opts = shuffle(rr, [c].concat(shuffle(rr, '0123456789'.split('').filter(function (v) { return v !== c; })).slice(0, 3))); a.q = { text: 'Chữ số ở vị trí thứ ' + pos + ' trong dãy vừa xem là chữ số nào?', options: opts, answer: opts.indexOf(c), check: c, diff: 2 + a.round, explain: 'Dãy: ' + ds.join(' ') + '.' }; }
      else if (kind === 'items') { var pool = shuffle(rr, ['quả táo', 'chiếc ô', 'con mèo', 'cây bút', 'đôi giày', 'cái đèn', 'quyển sách', 'con cá', 'chiếc lá', 'cái mũ', 'chiếc chìa khóa', 'bông hoa']), list = pool.slice(0, 5 + a.round), i = ri(rr, 1, list.length - 1); a.memo = list.join(' → '); var c2 = list[i]; a.q = { text: 'Trong chuỗi vừa xem, ngay sau "' + list[i - 1] + '" là gì?', options: shuffle(rr, [c2].concat(shuffle(rr, list.filter(function (x) { return x !== c2; })).slice(0, 3))), diff: 2 + a.round, explain: 'Chuỗi: ' + a.memo + '.' }; a.q.answer = a.q.options.indexOf(c2); a.q.check = c2; }
      else { a.memo = null; a.q = generate(a.token + ':calc' + a.round, { diff: 3, kinds: ['arith', 'sequence'] }); }
    },
    title: function (l, a) { return 'Vòng ' + (a.round + 1) + ' · thử thách ' + (a.ch + 1) + '/3'; },
    text: function (l, a) {
      var intro = 'Giám khảo chấm theo độ chính xác. Điểm của bạn: ' + a.score + ' · ' + a.npc.map(function (n) { return n.name + ' ' + (n.pts || 0); }).join(' · ') + '.';
      if (a.memo && !a.shown) return recap(a) + intro + '\n\nHãy ghi nhớ thật kỹ (chỉ được xem một lần):\n' + a.memo;
      return recap(a) + intro + '\n\n' + a.q.text;
    },
    rows: function (l, a, sh) {
      var self = this;
      if (a.memo && !a.shown) return [{ k: 'ready', l: 'Đã ghi nhớ xong, sẵn sàng trả lời', run: function () { a.shown = true; } }];
      return qRows(l, a, function (l, r, log, okAns, i) { self.answer(l, r, log, a, sh, okAns, i); });
    },
    answer: function (l, r, log, a, sh, okAns, i) {
      a.score += okAns ? 10 + a.round * 5 : 0; note(a, verdict(a, okAns, i));
      var rr = seeded(a.token + ':npc' + a.round + a.ch); a.npc.forEach(function (n) { if (rr() < n.skill + 0.1 - a.round * 0.08) n.pts = (n.pts || 0) + 10 + a.round * 5; });
      a.ch++; if (a.ch < 3) return this.setup(l, a);
      var best = Math.max.apply(null, a.npc.map(function (n) { return n.pts || 0; }));
      if (a.score >= best && a.score > 0) { if (a.round >= 2) return finish(l, log, { result: 'vào "biệt đội siêu trí tuệ" sau 3 vòng', prize: V(l, 100), fame: 1.2e5, good: true, hap: 12, rank: 1, mem: 'Được gọi tên vào biệt đội ' + sh.name + '.', invite: { years: 3 } }); a.round++; a.ch = 0; a.npc = rivals(l, a, 2); log('Bạn vượt qua vòng ' + a.round + ' của ' + sh.name + '.', 'good'); return this.setup(l, a); }
      finish(l, log, { result: 'dừng chân ở vòng ' + (a.round + 1), prize: 0, fame: 4000 * (a.round + 1), good: a.round > 0, hap: a.round ? 3 : 0, rank: a.round + 1 });
    },
    auto: function (l, a, r) { if (a.memo && !a.shown) return 'ready'; var p = U.clamp(0.3 + knowledge(l) * 0.55 - a.round * 0.1, 0.1, 0.9); return r() < p ? 'o' + a.q.answer : 'o' + ((a.q.answer + 1) % a.q.options.length); }
  };

  // ===================================================================
  // Đăng ký danh mục gameshow kiến thức
  // ===================================================================
  var CONTESTANT = { n: 'thí sinh' };
  define('nnc', { name: 'Nhanh Như Chớp', country: 'VN', genre: 'quiz', from: 2019, handler: 'streak', questions: 15, target: 10, prize: 20, fee: 15, desc: 'Trả lời nhanh các câu hỏi trắc nghiệm; đúng lên bậc, sai về bậc 0. Chuỗi 10 câu đúng liên tiếp nhận giải.',
    roles: { contestant: { n: 'thí sinh', gap: 3, why: function (l) { return l.age >= 18 ? true : 'Từ 18 tuổi'; } }, celeb: { n: 'khách mời nổi tiếng', gap: 2, why: function (l) { return famous(l) ? true : 'Dành cho người nổi tiếng'; } } } });
  define('altp', { name: 'Ai Là Triệu Phú', country: 'VN', genre: 'quiz', from: 2005, handler: 'ladder', top: function (l) { return yr(l) >= 2026 ? 500 : 150; }, desc: '15 câu hỏi theo thang tiền thưởng, mốc an toàn ở câu 5 và câu 10, bốn quyền trợ giúp; có thể dừng để bảo toàn tiền.',
    roles: { contestant: { n: 'người chơi', gap: 10, why: function (l) { return l.age >= 18 ? (knowledge(l) >= 0.3 ? true : 'Cần vượt qua vòng sơ tuyển kiến thức') : 'Từ 18 tuổi'; } } } });
  define('millionaire', { name: 'Who Wants to Be a Millionaire? (bản quốc tế)', country: 'WORLD', genre: 'quiz', from: 1998, handler: 'ladder', top: function () { return 1000; }, desc: 'Thang 15 câu hỏi, mốc an toàn, quyền trợ giúp; tiền thưởng theo mặt bằng nơi bạn sống.',
    roles: { contestant: { n: 'người chơi', gap: 10, why: function (l) { return l.age >= 18 ? true : 'Từ 18 tuổi'; } } } });
  define('olympia', { name: 'Đường Lên Đỉnh Olympia', country: 'VN', genre: 'quiz', from: 1999, handler: 'olympia', desc: 'Bốn học sinh THPT thi Khởi động, Vượt chướng ngại vật, Tăng tốc, Về đích; thắng tuần vào tháng, quý, chung kết năm.',
    roles: { contestant: { n: 'thí sinh', once: true, why: function (l) { return l.age < 16 || l.age > 18 ? 'Dành cho học sinh THPT (16–18 tuổi)' : !l.school ? 'Cần đang đi học THPT' : knowledge(l) >= 0.55 ? true : 'Cần học lực giỏi để được trường cử đi thi'; } } } });
  define('stt', { name: 'Siêu Trí Tuệ Việt Nam', country: 'VN', genre: 'quiz', from: 2019, handler: 'memory', desc: 'Thử thách ghi nhớ dãy số, chuỗi hình ảnh và tính nhẩm; giám khảo chấm, đối đầu qua 3 vòng.',
    roles: { contestant: { n: 'thí sinh', once: true, why: function (l) { return l.age >= 6 && l.age <= 40 ? (knowledge(l) >= 0.45 ? true : 'Cần năng lực ghi nhớ / tính toán nổi bật') : 'Dành cho người 6–40 tuổi'; } } } });
  define('dt100', { name: 'Đấu Trường 100', country: 'VN', genre: 'quiz', from: 2006, to: 2015, handler: 'mob', perHead: 0.5, grand: 200, desc: 'Một người đấu với 100 người: mỗi câu, ai trả lời sai bị loại, tiền tích lũy theo số người bị loại; sai là mất hết.',
    roles: { contestant: { n: 'người chơi', gap: 5, why: function (l) { return l.age >= 18 ? true : 'Từ 18 tuổi'; } } } });

  // Menu chính: xem mọi chương trình, điều kiện của từng vai trò; chọn một để tham gia
  function listRows(l) {
    var rows = [];
    Object.keys(SHOWS).forEach(function (id) {
      var sh = SHOWS[id]; if (!E.SHOW151.airing(l, sh) && !(sh.to && yr(l) > sh.to && sh.country === (vn(l) ? 'VN' : 'WORLD'))) return;
      Object.keys(sh.roles).forEach(function (role) {
        var why = canJoin(l, sh, role), inv = invitedBack(l, id);
        if (sh.roles[role].hidden && why !== true) return;
        rows.push({ k: id + ':' + role, l: sh.name + ' — ' + (inv ? 'được mời trở lại, ' : '') + sh.roles[role].n, h: sh.desc, why: why, run: function (l, r, log) { begin(l, r, log, id, role); } });
      });
    });
    return rows.slice(0, 52);
  }
  X.menu('show151', 'Chương trình truyền hình', function (l) { return free(l) ? true : 'Hiện không thể tham gia'; },
    function (l) { var h = S(l).history.slice(-4); return 'Đăng ký làm thí sinh, nhận lời làm khách mời, hoặc đảm nhận vai trò phù hợp khi đủ danh tiếng. Mỗi chương trình có thể lệ riêng; diễn biến, câu hỏi và người chơi khác là mô phỏng hư cấu.' + (h.length ? '\nĐã tham gia: ' + h.map(function (x) { return x.name + ' ' + x.year + ' (' + x.result + ')'; }).join('; ') : ''); },
    listRows, 14, 'Giải trí & trải nghiệm');
  // Lời mời tự đến khi có danh tiếng / từng gây ấn tượng (dùng nhịp sự kiện GĐ5)
  X.menu('show151_invite', 'Lời mời từ nhà sản xuất', function (l) { return free(l) && !S(l).active ? true : 'Hiện không thể'; },
    function (l, d) { var sh = SHOWS[d && d.arg && d.arg.id]; return sh ? 'Ê-kíp ' + sh.name + ' mời bạn tham gia với vai trò ' + sh.roles[d.arg.role].n + '. ' + sh.desc : 'Lời mời đã hết hạn.'; },
    function (l, arg) { var sh = SHOWS[arg.id]; if (!sh || canJoin(l, sh, arg.role) !== true) return []; return [{ k: 'yes', l: 'Nhận lời', run: function (l, r, log) { begin(l, r, log, arg.id, arg.role, { manual: !!(A(l) && A(l).manual) }); } }, { k: 'no', l: 'Từ chối', run: function (l, r, log) { log('Bạn từ chối lời mời ' + sh.name + '.', 'neutral'); S(l).declined = yr(l); } }]; });
  E.DEC.show151_invite.auto = function (l, d) { var i = d.data && d.data.keys ? d.data.keys.indexOf('yes') : -1; return i >= 0 && d.opts.some(function (o) { return o.k === String(i); }) ? String(i) : 'cancel'; };
  function inviteFor(l) {
    var out = []; Object.keys(SHOWS).forEach(function (id) { var sh = SHOWS[id]; Object.keys(sh.roles).forEach(function (role) { if (sh.roles[role].invite === false) return; if ((invitedBack(l, id) || role !== 'contestant' && role !== 'player') && canJoin(l, sh, role) === true) out.push({ id: id, role: role }); }); });
    return out;
  }
  E.TRIG.push({ id: 'show151_invite', when: function (l) { var s = l.flags.show151; return l.alive && l.age >= 14 && !(s && s.active) && !(s && s.declined === yr(l)) && inviteFor(l).length > 0; }, p: 0.18, cd: 2 });
  var inviteMake = E.DEC.show151_invite.make;
  E.DEC.show151_invite.make = function (l, r, arg) { if (!arg || !arg.id) { var all = inviteFor(l); arg = all.length ? all[Math.floor(r() * all.length)] : { id: null }; } return inviteMake.call(this, l, r, arg); };

  // Bỏ dở giữa chừng (để dịp khác / sang năm): khép lại, giữ khoản đã chắc chắn nhận
  E.HOOKS.year.push(function (l, r, log) {
    var s = l.flags.show151; if (!s || !s.active) return;
    var a = s.active; if ((l.pending || []).some(function (d) { return d.id === 'show151_step' && d.data && d.data.arg && d.data.arg.token === a.token; })) return;
    if (a.year === yr(l) && (l.pending || []).length) return;
    finish(l, log, { result: 'không tiếp tục ghi hình', prize: a.id === 'altp' || a.id === 'millionaire' ? (a.qi ? ladder(l, SHOWS[a.id])[a.qi - 1] : 0) : 0, fame: 500, good: false });
  });
  // Hồ sơ: chương trình đã tham gia
  if (E.profile) { var profile = E.profile; E.profile = function (l) { var p = profile.apply(this, arguments); var s = l.flags && l.flags.show151; if (s && p && p.jobInfo) s.history.slice(-5).forEach(function (h) { p.jobInfo.push(h.name + ' ' + h.year + ' — ' + h.role + ': ' + h.result); }); return p; }; }
  var convert = E.abroadConvert;
  E.abroadConvert = function (l, f) { var out = convert.apply(this, arguments), s = l.flags && l.flags.show151; if (s) { s.history.forEach(function (h) { h.prize *= f; h.earned *= f; }); if (s.active) { s.active.bank && (s.active.bank *= f); s.active.earned && (s.active.earned *= f); } } return out; };

  E.SHOW151 = { SHOWS: SHOWS, define: define, HANDLERS: HANDLERS, S: S, canJoin: canJoin, airing: airing, begin: begin, finish: finish, pay: pay, queue: queue, newQ: newQ, qRows: qRows, verdict: verdict, note: note, recap: recap, autoAnswer: autoAnswer, knowledge: knowledge, rivals: rivals, seeded: seeded, hash: hash, V: V, inviteFor: inviteFor, companion: companion, ladder: ladder, famous: famous, jobCat: jobCat, free: free };
})(globalThis.G);
