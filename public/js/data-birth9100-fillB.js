/* Một Đời — 9.10.0 bổ sung sự kiện thật (đợt 4, bù cho các nước còn dưới 12 sự kiện): nâng các nước còn mỏng, thêm thể thao, văn hóa, đời sống.
   Cùng quy tắc chống trùng với data-birth989-more.js. Nguồn thứ cấp, đối chiếu 25/11/2026. */
(function (G) {
  'use strict';
  var D = G.BIRTH987 || (G.BIRTH987 = { ERA: {}, EV: {}, WORLD: [] });
  var STOP = { 'năm': 1, 'của': 1, 'được': 1, 'những': 1, 'người': 1, 'trong': 1, 'cho': 1, 'với': 1, 'các': 1, 'một': 1, 'lần': 1, 'đầu': 1, 'tiên': 1, 'lớn': 1 };
  function wd(t) { return String(t).toLowerCase().split(/[^\p{L}\d]+/u).filter(function (x) { return x.length >= 3 && !STOP[x]; }); }
  function dup(c, r) { var a = wd(r[1]); return (D.EV[c] || []).some(function (e) { if (e[0] !== r[0]) return false; var b = wd(e[1]); return e[1] === r[1] || a.filter(function (x) { return b.indexOf(x) >= 0; }).length >= 2; }); }
  function ev(c, rows) { rows.forEach(function (r) { if (!dup(c, r)) (D.EV[c] || (D.EV[c] = [])).push([r[0], r[1], r[2] || 1, r[3] || '']); }); }
  var J = 'joy', Gr = 'grief';

  ev('MU', [[1948, 'cuộc bầu cử đầu tiên với quyền bầu cử mở rộng', 1], [1967, 'cuộc bầu cử dẫn tới độc lập', 1], [1999, 'bạo loạn Kaya', 2, Gr], [2020, 'dầu tràn từ tàu Wakashio', 2, Gr]]);
  ev('EE', [[2016, 'Kersti Kaljulaid là nữ tổng thống đầu tiên', 1]]);
  ev('CY', [[1931, 'bạo loạn tháng Mười chống chính quyền thực dân', 2], [1955, 'EOKA bắt đầu chiến dịch vũ trang', 2, Gr]]);
  ev('SR', [[1954, 'Hiến chương Vương quốc cho quyền tự trị', 1], [1991, 'Ronald Venetiaan thắng cử, khôi phục dân chủ', 1]]);
  ev('BT', [[2017, 'đối đầu ở cao nguyên Doklam', 2]]);
  ev('CV', [[1943, 'nạn đói lớn', 2, Gr], [1956, 'PAIGC được thành lập', 2], [2021, 'José Maria Neves đắc cử tổng thống', 1]]);
  ev('VU', [[1906, 'thỏa thuận cai trị chung Anh–Pháp', 2], [1971, 'phong trào Nagriamel nổi lên', 1], [2018, 'núi lửa Ambae phun trào, di dời toàn đảo', 2, Gr], [2023, 'bão Judy và Kevin liên tiếp', 2, Gr]]);
  ev('BZ', [[1931, 'bão tàn phá thành phố Belize', 2, Gr], [1984, 'cuộc bầu cử đầu tiên sau độc lập', 1], [1992, 'Guatemala công nhận Belize', 2]]);
  ev('MV', [[1953, 'tuyên bố lập nước cộng hòa lần đầu', 1], [2013, 'Abdulla Yameen thắng cử', 1]]);
  ev('ME', [[1941, 'Ý chiếm đóng', 2, Gr], [1992, 'lập Cộng hòa Liên bang Nam Tư cùng Serbia', 2], [2007, 'hiến pháp mới', 1]]);
  ev('BN', [[1984, 'độc lập ngày 1 tháng Một', 2, J]]);
  ev('ST', [[1991, 'Miguel Trovoada đắc cử trong bầu cử đa đảng', 1], [1995, 'đảo chính ngắn của quân đội', 1], [2001, 'Fradique de Menezes thắng cử', 1]]);
  ev('WS', [[1900, 'Đức tuyên bố cai trị Samoa', 2], [1976, 'gia nhập Liên Hợp Quốc', 1], [1997, 'đổi tên từ Tây Samoa thành Samoa', 1]]);
  ev('MT', [[1921, 'chế độ tự trị nội bộ', 1], [1987, 'đảng Dân tộc thắng cử, chính sách trung lập', 1], [2013, 'Joseph Muscat thành thủ tướng', 1]]);
  ev('BS', [[1964, 'chính phủ tự trị', 1]]);
  ev('KI', [[1957, 'Anh thử bom ở đảo Christmas', 2, Gr], [2003, 'chuyển công nhận ngoại giao sang Đài Loan', 1], [2008, 'lập khu bảo tồn biển quần đảo Phoenix', 2, J], [2016, 'Taneti Mamau đắc cử', 1]]);
  ev('BB', [[1937, 'bạo loạn của Clement Payne', 2], [1961, 'Errol Barrow lên làm thủ hiến', 1], [2018, 'Mia Mottley là nữ thủ tướng đầu tiên', 2, J]]);
  ev('TO', [[2008, 'Tupou V đăng quang', 1], [2014, 'ʻAkilisi Pohiva làm thủ tướng dân cử', 1]]);
  ev('FM', [[1947, 'thành lãnh thổ ủy trị của Mỹ', 1], [1991, 'gia nhập Liên Hợp Quốc', 1], [2015, 'bão Maysak', 2, Gr]]);
  ev('LC', [[1950, 'đám cháy lớn thiêu rụi Castries', 2, Gr], [2010, 'bão Tomas', 2, Gr]]);
  ev('GD', [[1974, 'độc lập ngày 7 tháng Hai', 2, J], [2004, 'bão Ivan', 2, Gr], [2012, 'Kirani James giành vàng 400 m ở London', 2, J]]);
  ev('SC', [[1903, 'trở thành thuộc địa riêng', 1], [1971, 'khánh thành sân bay quốc tế', 2, J], [2016, 'Danny Faure nhậm chức', 1]]);
  ev('VC', [[1951, 'phổ thông đầu phiếu', 1], [1969, 'tự trị', 1], [1980, 'bão Allen', 2, Gr], [2010, 'bão Tomas', 2, Gr]]);
  ev('AG', [[1981, 'độc lập ngày 1 tháng Mười Một', 2, J], [1989, 'bão Hugo', 2, Gr], [2007, 'đăng cai World Cup cricket', 1, J]]);
  ev('KN', [[1967, 'trở thành quốc gia liên kết', 1], [1989, 'bão Hugo', 2, Gr]]);
  ev('DM', [[1967, 'trở thành quốc gia liên kết', 1], [2015, 'bão Erika gây lở đất', 2, Gr]]);
  ev('AD', [[1993, 'gia nhập Liên Hợp Quốc', 2], [2002, 'bắt đầu dùng đồng euro', 1]]);
  ev('NR', [[1947, 'thành lãnh thổ ủy trị của Liên Hợp Quốc', 1], [1989, 'kiện Úc về phục hồi đất khai thác', 2], [2012, 'mở lại trung tâm tiếp nhận người xin tị nạn', 1]]);
  ev('TV', [[1974, 'trưng cầu dân ý đòi tách khỏi quần đảo Gilbert', 1], [2019, 'Kausea Natano lên làm thủ tướng', 1]]);
  ev('PW', [[1947, 'thành lãnh thổ ủy trị', 1], [1981, 'hiến pháp có hiệu lực', 1], [1993, 'trưng cầu dân ý thông qua Hiệp ước Liên kết', 2], [2017, 'đưa ra "Lời cam kết Palau" cho du khách', 1]]);
  ev('MH', [[1991, 'gia nhập Liên Hợp Quốc', 1]]);
  ev('SM', [[1944, 'bị ném bom nhầm trong chiến tranh', 2, Gr], [1957, 'khủng hoảng chính trị Rovereta', 1], [1992, 'gia nhập Liên Hợp Quốc', 1], [2008, 'lần đầu dự Eurovision', 1, J]]);
})(globalThis.G);
