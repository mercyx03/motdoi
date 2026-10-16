/* Một Đời — v3.3:
   · nghĩa vụ quân sự 2 năm: 3 tháng huấn luyện tân binh, về đơn vị, diễn tập, cứu hộ, về phép, xuất ngũ — trong thời gian đó không có chuyện đời thường bên ngoài
   · hoạt động hợp tuổi (người già không đi battle rap, cắm trại phượt…)
   · đầu tư đa dạng: cổ phiếu từng công ty / quỹ chỉ số, tiền mã hóa theo chu kỳ tăng – giảm, rủi ro sàn sập, coin "rug pull" */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function A(id, g, label, o) { var x = { id: id, g: g, l: label }; for (var k in o) x[k] = o[k]; E.ACT.push(x); }
  function fx(l, o) { H.fx(l, o); }
  function mo(l, v) { return H.money(l, v); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function vnd(l) { return isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  function V(l, tr) { return vnd(l) ? tr : tr / 90 * l.base; }
  function pct(x) { return (x >= 0 ? '+' : '−') + Math.abs(Math.round(x * 100)) + '%'; }

  // ===================================================================
  // 1. NGHĨA VỤ QUÂN SỰ
  // ===================================================================
  function inMil(l) { return !!(l.flags.military && l.age < l.flags.military); }
  E.inMil = inMil;
  E.milYear = function (l, r, a) {
    var L = [];
    if (!l.flags.milTB) { L.push(['nv_tan_binh'], ['nv_don_vi']); }
    else {
      var pool = ['nv_dien_tap', 'nv_cuu_ho', 'nv_phep', 'nv_dong_doi'];
      if (isVN(l) && l.flags.milGood && !l.flags.milDang) pool.push('nv_dang');
      for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
      L.push([pool[0]], [pool[1]]);
    }
    return L;
  };
  var MV = function (l) { return isVN(l) ? 'Quân đội nhân dân Việt Nam' : 'quân đội'; };
  SC('nv_tan_binh', {
    title: '3 tháng huấn luyện tân binh', major: 0,
    text: function (l) { return 'Cắt tóc ngắn, nhận quân trang, ' + (isVN(l) ? 'mặc bộ quân phục màu xanh lá cây' : 'mặc quân phục') + '. Ba tháng đầu học điều lệnh đội ngũ, gấp chăn màn vuông thành sắc cạnh, chạy 3 km mỗi sáng, tập bắn đạn thật, hành quân mang vác nặng. Đêm đầu tiên cả tiểu đội trằn trọc vì nhớ nhà.'; },
    opts: [
      { k: 'gang', l: 'Cố gắng hết sức, tập nghiêm túc', ai: { w: 1.3, amb: 0.8 }, run: function (l, r, log) { l.flags.milTB = true; fx(l, { hea: 5, kno: 2 }); if (ch(r, 0.45)) { l.flags.milGood = true; log('Hoàn thành huấn luyện tân binh, bắn đạn thật đạt loại giỏi — được biểu dương "chiến sĩ tiêu biểu" của đại đội.', 'good'); fx(l, { hap: 5 }); H.mem(l, 'Buổi lễ tuyên thệ chiến sĩ mới, giọng cả trung đội vang lên dưới cờ.', 4); } else log('Hoàn thành ba tháng huấn luyện tân binh. Người đen sạm, rắn rỏi hẳn ra, gấp chăn đã ' + (isVN(l) ? 'vuông như bánh chưng.' : 'vuông vức như cắt bằng thước.'), 'good'); } },
      { k: 'nho', l: 'Nhớ nhà, đêm nào cũng viết thư về', ai: { w: 0.8, soc: 0.6 }, run: function (l, r, log) { l.flags.milTB = true; fx(l, { hap: -2, soc: 4 }); log('Những tuần đầu nhớ nhà đến phát khóc. Tiểu đội trưởng và đồng đội động viên, dần dần bạn quen với nếp sống quân ngũ.', 'neutral'); } },
      { k: 'luoi', l: 'Lười tập, tìm cách trốn việc', ai: { bad: 0.8, risk: 0.6, w: 0.3 }, run: function (l, r, log) { l.flags.milTB = true; fx(l, { karma: -3, hea: 1 }); if (ch(r, 0.5)) { log('Bị phát hiện trốn tập, bị kiểm điểm trước đơn vị và phải chạy phạt thêm. Từ đó bạn chăm chỉ hơn.', 'bad'); fx(l, { hap: -4 }); } else log('Tập uể oải, cuối khóa huấn luyện chỉ đạt loại trung bình.', 'neutral'); } }
    ]
  });
  SC('nv_don_vi', {
    title: 'Về đơn vị', text: 'Hết 3 tháng tân binh, bạn được phân về đơn vị. Chỉ huy hỏi nguyện vọng chuyên môn trong gần 2 năm còn lại.',
    opts: [
      { k: 'bo_binh', l: 'Chiến sĩ bộ binh', h: 'Huấn luyện chiến đấu, rèn thể lực', ai: { w: 1 }, run: function (l, r, log) { l.flags.milRole = 'bộ binh'; fx(l, { hea: 4 }); log('Về đại đội bộ binh: sáng thao trường, chiều tăng gia trồng rau, nuôi lợn, tối sinh hoạt chính trị.', 'neutral'); } },
      { k: 'lai_xe', l: 'Học lái xe quân sự', h: 'Được học và thi bằng lái ô tô', ai: { w: 1, smart: 0.5 }, run: function (l, r, log) { l.flags.milRole = 'lái xe'; l.lic = l.lic || {}; l.lic.B = true; (l.licAt = l.licAt || {}).B = l.age; log('Được cử đi học lái xe quân sự, thi đỗ bằng lái — ra quân đã có nghề trong tay.', 'good'); fx(l, { kno: 2, hap: 3 }); } },
      { k: 'quan_y', l: 'Học quân y', h: 'Sơ cứu, chăm sóc thương binh', ai: { w: 0.7, smart: 0.8 }, run: function (l, r, log) { l.flags.milRole = 'quân y'; fx(l, { kno: 4, karma: 2 }); log('Theo học lớp quân y của sư đoàn: băng bó, sơ cứu, phát thuốc cho anh em.', 'good'); } },
      { k: 'anh_nuoi', l: 'Làm "anh nuôi" ở bếp ăn', h: 'Nấu ăn cho cả đơn vị', ai: { w: 0.6 }, run: function (l, r, log) { l.flags.milRole = 'anh nuôi'; fx(l, { soc: 3 }); if (!l.hobby) { l.hobby = 'nauan'; l.hobbySk = 30; } log('Thành "anh nuôi" của đại đội: dậy từ 4 giờ sáng nấu cơm cho cả trăm người, tay nghề bếp lên trông thấy.', 'good'); } },
      { k: 'thong_tin', l: 'Lính thông tin liên lạc', h: 'Học vận hành máy móc, liên lạc', ai: { w: 0.6, smart: 0.6 }, run: function (l, r, log) { l.flags.milRole = 'thông tin'; fx(l, { kno: 3 }); log('Về tiểu đoàn thông tin, học vận hành máy thông tin và kéo dây liên lạc.', 'neutral'); } }
    ]
  });
  SC('nv_dien_tap', {
    title: 'Diễn tập dã ngoại', text: 'Đơn vị hành quân dã ngoại 30 km, mang ba lô hơn 20 kg, ngủ võng trong rừng một tuần để diễn tập. Một đồng đội bị chuột rút giữa đường.',
    opts: [
      { k: 'giup', l: 'Mang đỡ ba lô cho đồng đội', ai: { w: 1.3, soc: 0.8 }, run: function (l, r, log) { fx(l, { hea: -2, soc: 5, karma: 2 }); l.flags.milGood = true; log('Vác hai ba lô suốt chặng cuối. Về đến nơi cả tiểu đội vỗ vai, chỉ huy khen trước hàng quân.', 'good'); H.mem(l, 'Chặng hành quân vác đỡ ba lô cho đồng đội.', 3); } },
      { k: 'minh', l: 'Lo phần mình cho xong', ai: { w: 0.8 }, run: function (l, r, log) { fx(l, { hea: 2 }); log('Hoàn thành cuộc hành quân, mỏi rã rời nhưng không ai bỏ cuộc.', 'neutral'); } }
    ]
  });
  SC('nv_cuu_ho', {
    title: 'Lệnh cứu hộ', text: function (l) { return 'Mưa lũ lớn ở ' + (isVN(l) ? 'miền Trung' : 'một tỉnh lân cận') + ', nhiều nhà dân bị cô lập. Đơn vị được lệnh lên đường cứu hộ ngay trong đêm.'; },
    opts: [
      { k: 'dau', l: 'Xung phong vào tuyến đầu', ai: { w: 1.2, risk: 0.5 }, run: function (l, r, log) { if (ch(r, 0.06)) { log('Lội nước xiết cõng người già ra khỏi vùng ngập, bạn bị trượt chân va vào đá, gãy tay phải nằm viện quân y.', 'bad'); fx(l, { hea: -10, karma: 8 }); } else { log('Cùng đồng đội đưa hàng chục người dân ra khỏi vùng ngập. Một bà cụ nắm tay bạn: "Có bộ đội là dân yên tâm." Đơn vị được tặng bằng khen.', 'big'); fx(l, { karma: 8, hap: 6, soc: 4 }); l.flags.milGood = true; H.mem(l, 'Đêm lội lũ cõng bà cụ ra khỏi căn nhà ngập nước.', 6); } } },
      { k: 'hau_can', l: 'Làm hậu cần, chuyển nhu yếu phẩm', ai: { w: 1 }, run: function (l, r, log) { fx(l, { karma: 4, hap: 3 }); log('Thức trắng mấy đêm bốc vác mì tôm, nước sạch, áo phao cho bà con vùng lũ.', 'good'); } }
    ]
  });
  SC('nv_phep', {
    title: 'Được về phép', text: function (l) { return 'Bạn được nghỉ phép 10 ngày về thăm nhà' + (l.partner ? ', ' + l.partner.name + ' đang đợi' : '') + '.'; },
    opts: [
      { k: 'nha', l: 'Về nhà với gia đình', ai: { w: 1.2 }, run: function (l, r, log) { H.cash(l, -V(l, 1), 'Tàu xe về phép'); fx(l, { hap: 8, soc: 3 }); log('Về phép, mẹ nấu cả mâm cơm, hàng xóm sang hỏi chuyện quân ngũ. Mười ngày trôi qua nhanh như chớp.', 'good'); H.mem(l, 'Mười ngày phép đầu tiên, khoác ba lô về đến đầu ngõ.', 4); } },
      { k: 'nguoi_yeu', l: function (l) { return l.partner ? 'Dành thời gian cho ' + l.partner.name : 'Ở lại đơn vị, nhường phép cho đồng đội'; }, ai: { w: 0.8 }, run: function (l, r, log) {
        if (!l.partner) { fx(l, { karma: 3, soc: 3 }); log('Nhường suất phép cho đồng đội có bố ốm nặng.', 'good'); return; }
        if (l.partner.status === 'dating' && ch(r, 0.15)) { log(l.partner.name + ' nói lời chia tay: "Hai năm xa quá, ' + E.xung(l).me + ' không đợi được."', 'bad'); l.partner = null; l.exes = (l.exes || 0) + 1; fx(l, { hap: -10 }); }
        else { log('Mười ngày phép bên ' + l.partner.name + ', hứa ngày ra quân sẽ về ngay.', 'good'); fx(l, { hap: 8 }); } } }
    ]
  });
  SC('nv_dong_doi', {
    title: 'Chuyện đồng đội', text: 'Một đồng đội nhà nghèo nhận tin mẹ ốm nặng, không đủ tiền vào viện.',
    opts: [
      { k: 'gop', l: 'Góp phụ cấp cùng cả tiểu đội', h: function (l) { return '~' + mo(l, V(l, 1)); }, ai: { w: 1.3, soc: 1 }, run: function (l, r, log) { H.cash(l, -V(l, 1), 'Góp giúp đồng đội'); fx(l, { karma: 4, soc: 5 }); log('Cả tiểu đội góp phụ cấp gửi về cho mẹ đồng đội. Tình đồng chí từ đó thân như anh em ruột.', 'good'); H.mem(l, 'Tình đồng đội những năm quân ngũ.', 3); } },
      { k: 'hoi', l: 'Chỉ hỏi thăm động viên', ai: { w: 0.6 }, run: function (l, r, log) { fx(l, { soc: 1 }); log('Ngồi động viên đồng đội cả buổi tối.', 'neutral'); } }
    ]
  });
  SC('nv_dang', {
    title: 'Được giới thiệu kết nạp Đảng', valid: function (l) { return isVN(l); },
    text: 'Vì rèn luyện tốt, chi bộ đơn vị giới thiệu bạn đi học lớp cảm tình Đảng và xem xét kết nạp trước khi ra quân.',
    opts: [
      { k: 'yes', l: 'Học tập, phấn đấu được kết nạp', ai: { w: 1, amb: 1 }, run: function (l, r, log) { l.flags.milDang = true; l.flags.dangVien = true; fx(l, { hap: 4, kno: 2 }); log('Được kết nạp Đảng ngay trong quân ngũ — hồ sơ thêm sáng khi xin việc ở cơ quan nhà nước sau này.', 'big'); H.mem(l, 'Ngày đứng trước cờ Đảng đọc lời tuyên thệ.', 4); } },
      { k: 'no', l: 'Chưa sẵn sàng', ai: { w: 0.5 }, run: function (l, r, log) { l.flags.milDang = true; log('Xin lùi lại, để mình rèn luyện thêm.', 'neutral'); } }
    ]
  });
  SC('nv_xuat_ngu', {
    title: 'Ra quân', major: 1,
    text: function (l) { return 'Hai năm nghĩa vụ sắp hết' + (l.flags.milRole ? ' (bạn là lính ' + l.flags.milRole + ')' : '') + '. Ra quân được nhận trợ cấp xuất ngũ, trợ cấp tạo việc làm và được ưu tiên khi học nghề, tuyển dụng. Bạn tính sao?'; },
    opts: [
      { k: 've', l: 'Xuất ngũ về địa phương', h: function (l) { return 'Trợ cấp khoảng ' + mo(l, V(l, 25)) + ', được hỗ trợ học nghề'; }, ai: { w: 1.4 }, run: function (l, r, log) { H.cash(l, V(l, 25), 'Trợ cấp xuất ngũ, tạo việc làm'); l.flags.milVet = true; log('Nhận trợ cấp xuất ngũ ' + mo(l, V(l, 25)) + ', chia tay đồng đội trong nước mắt rồi về quê.', 'good'); H.mem(l, 'Buổi chia tay đồng đội ngày ra quân, ai cũng khóc.', 5); } },
      { k: 'si_quan', l: 'Thi vào trường sĩ quan quân đội', h: 'Học 4 năm, ra trường mang quân hàm Thiếu úy', req: function (l) { return l.edu >= 3; }, ai: { amb: 1.2, w: 0.5 }, run: function (l, r, log) { if (ch(r, 0.35 + (l.st.kno - 60) / 150 + (l.flags.milGood ? 0.15 : 0))) { l.flags.military = null; l.school = 'police'; l.schoolEnd = l.age + 4; l.flags.policeTrack = 'quan_doi'; log('Thi đỗ trường sĩ quan — từ người lính nghĩa vụ trở thành học viên sĩ quan.', 'big'); fx(l, { hap: 8 }); } else { var x = V(l, E.milAllowance ? E.milAllowance(l) : 25); H.cash(l, x, 'Trợ cấp xuất ngũ, tạo việc làm'); l.flags.milVet = true; log('Thi trượt trường sĩ quan, đành xuất ngũ về địa phương với trợ cấp ' + mo(l, x) + '.', 'neutral'); } } },
      { k: 'cn', l: 'Ở lại làm quân nhân chuyên nghiệp', h: 'Có lương, chế độ, BHXH', ai: { w: 0.5 }, run: function (l, r, log) { l.flags.military = null; E.startJob(l, 'quan_doi', r, log, true); log('Đăng ký ở lại đơn vị làm quân nhân chuyên nghiệp ' + (l.flags.milRole ? 'ngành ' + l.flags.milRole : '') + '.', 'big'); fx(l, { hap: 4 }); } }
    ]
  });
  ['nv_tan_binh', 'nv_don_vi', 'nv_dien_tap', 'nv_cuu_ho', 'nv_phep', 'nv_dong_doi', 'nv_dang', 'nv_xuat_ngu'].forEach(function (id) { if (id !== 'nv_xuat_ngu' && id !== 'nv_tan_binh') E.MAJOR[id] = 0; });
  // vào quân ngũ là vào luôn khóa huấn luyện tân binh
  var uniAp = E.DEC.uni.apply;
  E.DEC.uni.apply = function (l, d, k, r, log) { var x = uniAp.apply(this, arguments); if (k === 'military' && inMil(l)) { H.chain(l, 'nv_don_vi'); H.chain(l, 'nv_tan_binh'); } return x; };
  // phụ cấp quân ngũ (khoảng 1 triệu đồng/tháng) là thu nhập trong 2 năm, ăn ở trong doanh trại
  var cyM = E.careerYear;
  E.careerYear = function (l) { if (inMil(l)) { fx(l, { hea: 2 }); return V(l, 12.5); } return cyM.apply(this, arguments); };
  // ghi nhận lúc bắt đầu mê một thần tượng
  E.HOOKS.year.push(function (l, r, log, a) { if (l.idol && l.flags.idolName !== l.idol) { l.flags.idolName = l.idol; l.flags.idolAt = a; } });

  // ===================================================================
  // 2. HOẠT ĐỘNG HỢP TUỔI
  // ===================================================================
  var MAXAGE = { show_rap: 45, phuot: 55, xem_bong_da: 75, concert: 55, di_nhau: 75, bang_lai: 75, khoi_nghiep: 72, tim_viec: 72, hoc_dien: 50, cong_vien: 13, karaoke: 80, tim_nguoi_yeu: 85, ca_do_act: 80 };
  E.ACT.forEach(function (a) { if (MAXAGE[a.id] != null && (a.max == null || a.max > MAXAGE[a.id])) a.max = MAXAGE[a.id]; });
  E.TRIG.forEach(function (t) {
    if (/^(concert|concert_di|show_rap|nhan_tin|so_thich)$/.test(t.id)) { var w0 = t.when; t.when = function (l, a) { return a <= (t.id === 'nhan_tin' ? 45 : 50) && w0.apply(this, arguments); }; }
  });

  // ===================================================================
  // 3. ĐẦU TƯ ĐA DẠNG: CỔ PHIẾU TỪNG CÔNG TY, QUỸ CHỈ SỐ, TIỀN MÃ HÓA THEO CHU KỲ
  // ===================================================================
  // mu: lợi suất kỳ vọng / năm (ngoài biến động thị trường), sd: độ biến động riêng, beta: độ nhạy với thị trường, div: cổ tức
  var STK_VN = [
    { k: 'E1VFVN30', n: 'quỹ ETF VN30 (30 công ty lớn nhất)', mu: 0.02, sd: 0.04, beta: 1, div: 0.02 },
    { k: 'VCB', n: 'Vietcombank (ngân hàng)', mu: 0.03, sd: 0.14, beta: 0.9, div: 0.01 },
    { k: 'FPT', n: 'FPT (công nghệ)', mu: 0.07, sd: 0.2, beta: 1.1, div: 0.02 },
    { k: 'VNM', n: 'Vinamilk (sữa, tiêu dùng)', mu: -0.01, sd: 0.12, beta: 0.6, div: 0.05 },
    { k: 'HPG', n: 'Hòa Phát (thép)', mu: 0.02, sd: 0.3, beta: 1.4, div: 0.01 },
    { k: 'MWG', n: 'Thế Giới Di Động (bán lẻ)', mu: 0.02, sd: 0.28, beta: 1.2, div: 0.01 },
    { k: 'GAS', n: 'PV GAS (năng lượng)', mu: 0, sd: 0.18, beta: 0.8, div: 0.05 },
    { k: 'PENNY', n: 'một mã "penny" đang được thổi giá', mu: -0.12, sd: 0.7, beta: 1.8, div: 0, risky: 0.1 }
  ];
  var STK_W = [
    { k: 'SPY', n: 'quỹ ETF S&P 500 (500 công ty lớn của Mỹ)', mu: 0.02, sd: 0.04, beta: 1, div: 0.015 },
    { k: 'AAPL', n: 'Apple (công nghệ)', mu: 0.05, sd: 0.22, beta: 1.1, div: 0.005 },
    { k: 'MSFT', n: 'Microsoft (phần mềm)', mu: 0.05, sd: 0.2, beta: 1, div: 0.008 },
    { k: 'NVDA', n: 'NVIDIA (chip, trí tuệ nhân tạo)', mu: 0.1, sd: 0.45, beta: 1.6, div: 0 },
    { k: 'KO', n: 'Coca-Cola (tiêu dùng)', mu: -0.01, sd: 0.1, beta: 0.5, div: 0.03 },
    { k: 'TM', n: 'Toyota (ô tô)', mu: 0, sd: 0.18, beta: 0.9, div: 0.025 },
    { k: 'PENNY', n: 'một cổ phiếu "penny" trên mạng xã hội', mu: -0.12, sd: 0.7, beta: 1.8, div: 0, risky: 0.1 }
  ];
  function stocks(l) { return isVN(l) || (l.abroad && !l.abroad.perm) ? STK_VN : STK_W; }
  function stk(l, k) { return stocks(l).concat(STK_VN, STK_W).filter(function (s) { return s.k === k; })[0]; }
  var MKT_RET = { 'tăng mạnh': 0.2, 'bình thường': 0.06, 'đi xuống': -0.14, 'sập': -0.32 };
  // tiền mã hóa: chu kỳ thị trường riêng
  var CREG = {
    'tăng mạnh (bull)': { m: 0.7, next: { 'tăng mạnh (bull)': 0.45, 'đi ngang': 0.25, 'giảm sâu (bear)': 0.3 } },
    'đi ngang': { m: 0.02, next: { 'tăng mạnh (bull)': 0.3, 'đi ngang': 0.45, 'giảm sâu (bear)': 0.25 } },
    'giảm sâu (bear)': { m: -0.45, next: { 'đi ngang': 0.45, 'giảm sâu (bear)': 0.35, 'sập': 0.1, 'tăng mạnh (bull)': 0.1 } },
    'sập': { m: -0.7, next: { 'giảm sâu (bear)': 0.6, 'đi ngang': 0.4 } }
  };
  var COINS = [
    { k: 'BTC', n: 'Bitcoin (BTC)', beta: 1, sd: 0.3 },
    { k: 'ETH', n: 'Ethereum (ETH)', beta: 1.2, sd: 0.4 },
    { k: 'SOL', n: 'một altcoin lớn (SOL)', beta: 1.5, sd: 0.55 },
    { k: 'MEME', n: 'một đồng memecoin đang hot trên mạng', beta: 2.2, sd: 1, rug: 0.3 }
  ];
  function coin(k) { return COINS.filter(function (c) { return c.k === k; })[0]; }
  function idle(l) { return Math.max(0, l.money - l.base * 0.3); }
  function hold(l, key) { return l[key] || (l[key] = {}); }
  function sum(o) { var s = 0; for (var k in (o || {})) s += o[k].v || 0; return s; }
  E.portValue = function (l) { return sum(l.port) + sum(l.coins); };
  var nw0 = E.netWorth; E.netWorth = function (l) { return nw0.apply(this, arguments) + E.portValue(l); };
  function buyInto(l, key, k, amt, why) { var h = hold(l, key); h[k] = h[k] || { v: 0, basis: 0 }; h[k].v += amt; h[k].basis += amt; H.cash(l, -amt, why); }
  function sellAll(l, key, log, label) {
    var h = l[key] || {}, tot = 0, bas = 0; for (var k in h) { tot += h[k].v; bas += h[k].basis; }
    if (tot <= 0) return; H.cash(l, tot, 'Bán ' + label); l[key] = {};
    log('Bán toàn bộ ' + label + ', thu về ' + mo(l, tot) + ' (' + (tot >= bas ? 'lãi ' + mo(l, tot - bas) : 'lỗ ' + mo(l, bas - tot)) + ').', tot >= bas ? 'good' : 'bad');
  }
  SC('co_phieu', {
    title: 'Mua cổ phiếu', valid: function (l) { return l.indep; },
    text: function (l) { var M = l.mkt ? l.mkt.stock : 'bình thường'; return 'Thị trường chứng khoán đang ' + M + '. Tiền nhàn rỗi: ' + mo(l, idle(l)) + (sum(l.port) > 0 ? '. Danh mục hiện có: ' + mo(l, sum(l.port)) : '') + '. Mỗi lần bỏ vào khoảng 20% tiền nhàn rỗi. Cổ phiếu lên xuống theo thị trường và theo từng công ty; công ty lớn thì ổn định, có cổ tức, "cổ phiếu penny" thì như canh bạc.'; },
    opts: [].concat(STK_VN.map(function (s) { return s.k; }), STK_W.map(function (s) { return 'w' + s.k; })).map(function (key) {
      var w = key.charAt(0) === 'w' && key !== 'wPENNY' ? true : key === 'wPENNY';
      var k = w ? key.slice(1) : key;
      return { k: key, l: function (l) { var s = stk(l, k); return 'Mua ' + s.n; }, h: function (l) { var s = stk(l, k); return mo(l, idle(l) * 0.2) + ' · ' + (s.risky ? 'cực kỳ rủi ro' : s.sd >= 0.35 ? 'biến động mạnh' : s.sd >= 0.18 ? 'biến động vừa' : 'ổn định') + (s.div ? ' · cổ tức ~' + Math.round(s.div * 100) + '%/năm' : ''); },
        req: function (l) { var list = stocks(l); return (w ? list === STK_W : list === STK_VN) && idle(l) > l.base * 0.05; },
        ai: function (l) { var s = stk(l, k); return s.risky ? 0.2 : s.k === 'E1VFVN30' || s.k === 'SPY' ? 1.4 : 0.7; },
        run: function (l, r, log) { var s = stk(l, k), x = idle(l) * 0.2; buyInto(l, 'port', s.k, x, 'Mua cổ phiếu ' + s.k); log('Mua ' + mo(l, x) + ' ' + s.n + '.', 'neutral'); } };
    }).concat([
      { k: 'sell', l: 'Bán hết cổ phiếu đang có', req: function (l) { return sum(l.port) > 0.5; }, ai: { w: 0.3 }, run: function (l, r, log) { sellAll(l, 'port', log, 'cổ phiếu'); } },
      { k: 'no', l: 'Thôi, chưa mua', ai: { w: 0.5 }, run: function () { } }
    ])
  });
  SC('tien_ao', {
    title: 'Đầu tư tiền mã hóa', valid: function (l) { return l.indep && l.age >= 18; },
    text: function (l) { var R = l.cmkt || 'đi ngang'; return 'Thị trường tiền mã hóa đang ' + R + '. Mỗi lần bỏ vào khoảng 15% tiền nhàn rỗi (' + mo(l, idle(l) * 0.15) + ')' + (sum(l.coins) > 0 ? '; đang nắm giữ ' + mo(l, sum(l.coins)) : '') + '. Giá có thể gấp đôi trong vài tháng — hoặc mất 80% trong vài tuần. Sàn giao dịch cũng có thể phá sản.'; },
    opts: COINS.map(function (c) {
      return { k: c.k, l: 'Mua ' + c.n, h: c.rug ? 'Có thể tăng trăm lần, nhưng phần lớn về 0' : c.k === 'BTC' ? 'Đồng lớn nhất, ít rủi ro nhất trong tiền ảo — vẫn rất biến động' : 'Biến động mạnh hơn Bitcoin',
        req: function (l) { return idle(l) > l.base * 0.05; }, ai: { risk: 1.2, w: c.rug ? 0.3 : 0.6 },
        run: function (l, r, log) { var x = idle(l) * 0.15; buyInto(l, 'coins', c.k, x, 'Mua ' + c.k); log('Mua ' + mo(l, x) + ' ' + c.n + '.', 'neutral'); } };
    }).concat([
      { k: 'sell', l: 'Bán hết tiền mã hóa đang giữ', req: function (l) { return sum(l.coins) > 0.5; }, ai: { w: 0.4 }, run: function (l, r, log) { sellAll(l, 'coins', log, 'tiền mã hóa'); } },
      { k: 'no', l: 'Thôi, tránh xa cho lành', ai: { w: 0.8, smart: 0.6 }, run: function () { } }
    ])
  });
  // nối vào "Đầu tư": mua cổ phiếu / tiền ảo mở bảng chọn chi tiết
  if (E.DEC.dau_tu) E.DEC.dau_tu.def.opts.forEach(function (o) {
    if (o.k === 'stock') { o.l = 'Mua cổ phiếu (chọn công ty, quỹ chỉ số)'; o.h = 'Mở danh sách cổ phiếu'; o.run = function (l, r, log) { H.chain(l, 'co_phieu'); }; }
    if (o.k === 'crypto') { o.l = 'Đầu tư tiền mã hóa'; o.h = 'Bitcoin, Ethereum, altcoin, memecoin — rất rủi ro'; o.run = function (l, r, log) { H.chain(l, 'tien_ao'); }; }
  });
  A('ban_dau_tu_moi', 'Tiền bạc', 'Bán cổ phiếu / tiền mã hóa', { min: 18, avail: function (l) { return E.portValue(l) > 0.5 ? true : 'Chưa nắm giữ cổ phiếu / tiền ảo'; }, sc: 'ban_dt_moi' });
  SC('ban_dt_moi', {
    title: 'Bán bớt đầu tư', valid: function (l) { return E.portValue(l) > 0.5; },
    text: function (l) { return 'Cổ phiếu: ' + mo(l, sum(l.port)) + ' · tiền mã hóa: ' + mo(l, sum(l.coins)) + '.'; },
    opts: [
      { k: 'port', l: 'Bán hết cổ phiếu', req: function (l) { return sum(l.port) > 0.5; }, run: function (l, r, log) { sellAll(l, 'port', log, 'cổ phiếu'); } },
      { k: 'coins', l: 'Bán hết tiền mã hóa', req: function (l) { return sum(l.coins) > 0.5; }, run: function (l, r, log) { sellAll(l, 'coins', log, 'tiền mã hóa'); } },
      { k: 'keep', l: 'Giữ tiếp', run: function () { } }
    ]
  });
  // biến động mỗi năm
  E.HOOKS.year.push(function (l, r, log, a) {
    if (!l.alive) return;
    // chu kỳ thị trường tiền mã hóa (chạy cho mọi người để giá cả nhất quán theo năm)
    var cur = l.cmkt || 'đi ngang', nx = CREG[cur].next, x = r(), acc = 0, nxt = cur;
    for (var k in nx) { acc += nx[k]; if (x < acc) { nxt = k; break; } }
    l.cmkt = nxt;
    var M = MKT_RET[(l.mkt && l.mkt.stock) || 'bình thường'] || 0.06;
    if (l.port && sum(l.port) > 0) {
      var parts = [], before = sum(l.port), divs = 0;
      for (var s in l.port) {
        var S = stk(l, s) || { mu: 0, sd: 0.2, beta: 1, div: 0 }, h = l.port[s];
        if (S.risky && ch(r, S.risky)) { parts.push(s + ' bị hủy niêm yết (−100%)'); h.v = 0; continue; }
        var g = Math.max(-0.85, S.beta * (M - 0.06) + 0.06 + S.mu + U.normal(r) * S.sd);
        h.v *= 1 + g; divs += h.v * S.div; parts.push(s + ' ' + pct(g));
      }
      for (var s2 in l.port) if (!(l.port[s2].v > 0.01)) delete l.port[s2];
      if (divs > 0) H.cash(l, divs, 'Cổ tức');
      log('Danh mục cổ phiếu: ' + parts.join(' · ') + ' — tổng ' + mo(l, sum(l.port)) + (divs > 0 ? ', nhận cổ tức ' + mo(l, divs) : '') + '.', 'money');
    }
    if (l.coins && sum(l.coins) > 0) {
      var cp = [], base = CREG[nxt].m;
      if (ch(r, 0.015)) { for (var c0 in l.coins) l.coins[c0].v *= 0.5; log('Sàn giao dịch tiền mã hóa bạn dùng tuyên bố phá sản, rút được chưa tới một nửa số tiền.', 'bad'); fx(l, { hap: -8 }); }
      for (var c in l.coins) {
        var C = coin(c) || { beta: 1, sd: 0.4 }, hc = l.coins[c];
        if (C.rug && ch(r, C.rug)) { cp.push(c + ' bị "rug pull", về 0'); hc.v = 0; continue; }
        var gc = Math.max(-0.95, base * C.beta + U.normal(r) * C.sd);
        if (C.rug && ch(r, 0.05)) gc = 5 + r() * 15; // hiếm khi memecoin tăng vọt
        hc.v *= 1 + gc; cp.push(c + ' ' + pct(gc));
      }
      for (var c2 in l.coins) if (!(l.coins[c2].v > 0.01)) delete l.coins[c2];
      log('Tiền mã hóa (thị trường ' + nxt + '): ' + cp.join(' · ') + ' — còn ' + mo(l, sum(l.coins)) + '.', 'money');
      if (nxt === 'sập' && sum(l.coins) > l.base) { fx(l, { hap: -6 }); if (l.mind) l.mind.stress += 10; }
    }
  });
  // hồ sơ chi tiết có thêm danh mục đầu tư
  var pf0 = E.profile;
  if (pf0) E.profile = function (l) { var P = pf0.apply(this, arguments); for (var s in (l.port || {})) P.assets.push(['Cổ phiếu ' + s, l.port[s].v]); for (var c in (l.coins || {})) P.assets.push(['Tiền mã hóa ' + c, l.coins[c].v]); P.net = E.netWorth(l); return P; };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
