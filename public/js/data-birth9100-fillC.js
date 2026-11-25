/* Một Đời — 9.10.0 bổ sung sự kiện thật (đợt 7, bù nốt các nước còn gần mức 12 sự kiện): nâng các nước còn mỏng, thêm thể thao, văn hóa, đời sống.
   Cùng quy tắc chống trùng với data-birth989-more.js. Nguồn thứ cấp, đối chiếu 25/11/2026. */
(function (G) {
  'use strict';
  var D = G.BIRTH987 || (G.BIRTH987 = { ERA: {}, EV: {}, WORLD: [] });
  var STOP = { 'năm': 1, 'của': 1, 'được': 1, 'những': 1, 'người': 1, 'trong': 1, 'cho': 1, 'với': 1, 'các': 1, 'một': 1, 'lần': 1, 'đầu': 1, 'tiên': 1, 'lớn': 1 };
  function wd(t) { return String(t).toLowerCase().split(/[^\p{L}\d]+/u).filter(function (x) { return x.length >= 3 && !STOP[x]; }); }
  function dup(c, r) { var a = wd(r[1]); return (D.EV[c] || []).some(function (e) { if (e[0] !== r[0]) return false; var b = wd(e[1]); return e[1] === r[1] || a.filter(function (x) { return b.indexOf(x) >= 0; }).length >= 2; }); }
  function ev(c, rows) { rows.forEach(function (r) { if (!dup(c, r)) (D.EV[c] || (D.EV[c] = [])).push([r[0], r[1], r[2] || 1, r[3] || '']); }); }
  var J = 'joy', Gr = 'grief';

  ev('AM', [[2020, 'chiến tranh Nagorno-Karabakh lần hai', 2, Gr]]);
  ev('BS', [[1973, 'độc lập ngày 10 tháng Bảy', 2, J]]);
  ev('BH', [[2012, 'giải F1 diễn ra giữa lúc biểu tình', 1]]);
  ev('BZ', [[2000, 'bão Keith', 2, Gr]]);
  ev('BT', [[2006, 'vua Jigme Singye Wangchuck thoái vị nhường ngôi cho con', 2]]);
  ev('BN', [[1998, 'tập đoàn Amedeo của hoàng gia sụp đổ', 2], [2004, 'mở lại quốc hội lập pháp', 1], [2019, 'luật hình sự Hồi giáo gây phản ứng quốc tế', 1]]);
  ev('BG', [[1941, 'gia nhập phe Trục', 2]]);
  ev('CV', [[2011, 'Jorge Carlos Fonseca đắc cử tổng thống', 1]]);
  ev('KM', [[2018, 'trưng cầu dân ý đổi hiến pháp', 1]]);
  ev('CR', [[2018, 'Carlos Alvarado thắng cử', 1]]);
  ev('DJ', [[2008, 'giao tranh biên giới với Eritrea', 2, Gr]]);
  ev('DM', [[1981, 'âm mưu đảo chính bị phát giác', 1]]);
  ev('DO', [[1996, 'Leonel Fernández thắng cử', 1], [2012, 'Danilo Medina nhậm chức', 1]]);
  ev('EC', [[1979, 'Jaime Roldós thắng cử, trở lại dân sự', 2]]);
  ev('GQ', [[1991, 'hiến pháp cho phép đa đảng', 1], [2022, 'Teodoro Obiang tái đắc cử', 1]]);
  ev('SZ', [[1921, 'Sobhuza II lên ngôi vua', 2], [2013, 'bầu cử quốc hội không đảng phái', 1]]);
  ev('GE', [[2024, 'biểu tình phản đối đạo luật "tác nhân nước ngoài"', 2]]);
  ev('GD', [[1979, 'cuộc đảo chính của Maurice Bishop', 2], [1983, 'Mỹ đổ quân vào Grenada', 2, Gr]]);
  ev('GY', [[1966, 'độc lập ngày 26 tháng Năm', 2, J], [1970, 'tuyên bố thành nước cộng hòa hợp tác', 1]]);
  ev('HN', [[2013, 'Juan Orlando Hernández thắng cử', 1]]);
  ev('KI', [[1916, 'trở thành thuộc địa Gilbert và Ellice', 1], [1975, 'quần đảo Ellice tách ra thành Tuvalu', 1]]);
  ev('KG', [[2021, 'trưng cầu dân ý đổi hiến pháp theo hướng tổng thống chế', 1]]);
  ev('LA', [[2016, 'Thongloun Sisoulith nhậm chức', 1]]);
  ev('LS', [[2014, 'âm mưu đảo chính ở Maseru', 2, Gr], [2015, 'Pakalitha Mosisili trở lại làm thủ tướng', 1], [2020, 'Thomas Thabane từ chức thủ tướng', 1]]);
  ev('LI', [[1989, 'Hans-Adam II lên ngôi', 2]]);
  ev('LT', [[1939, 'mất vùng Klaipėda cho Đức', 2, Gr]]);
  ev('MH', [[1944, 'Mỹ chiếm Kwajalein', 2, Gr]]);
  ev('MU', [[1982, 'phe đối lập thắng cử', 1], [1995, 'Navin Ramgoolam lên làm thủ tướng', 1], [2014, 'Anerood Jugnauth trở lại làm thủ tướng', 1]]);
  ev('FM', [[1914, 'Nhật chiếm quần đảo Caroline', 2], [2004, 'bão Chata’an', 2, Gr]]);
  ev('ME', [[1999, 'cuộc ném bom NATO ảnh hưởng tới Nam Tư', 2, Gr], [2003, 'Nam Tư đổi thành Serbia và Montenegro', 1]]);
  ev('NR', [[1920, 'Hội Quốc Liên giao Úc, Anh, New Zealand quản lý', 1]]);
  ev('NI', [[2021, 'Ortega tái đắc cử giữa lúc các đối thủ bị bắt', 2, Gr]]);
  ev('PW', [[1914, 'Nhật chiếm Palau', 2], [1920, 'ủy trị Nhật Bản', 1]]);
  ev('LC', [[1967, 'trở thành quốc gia liên kết', 1], [1997, 'Kenny Anthony lên làm thủ tướng', 1]]);
  ev('VC', [[1984, 'Mitchell thắng cử', 1], [2001, 'Ralph Gonsalves thắng cử', 1]]);
  ev('WS', [[1991, 'bão Val', 2, Gr], [2012, 'bão Evan', 2, Gr]]);
  ev('ST', [[2011, 'Manuel Pinto da Costa trở lại làm tổng thống', 1], [2016, 'Evaristo Carvalho nhậm chức', 1]]);
  ev('SC', [[1979, 'hiến pháp một đảng', 1]]);
  ev('SK', [[2020, 'Igor Matovič lên làm thủ tướng', 1]]);
  ev('SI', [[1991, 'cuộc chiến mười ngày', 2, Gr]]);
  ev('SB', [[2021, 'bạo loạn ở Honiara', 2, Gr]]);
  ev('SR', [[2020, 'Chan Santokhi nhậm chức', 1]]);
  ev('TL', [[2008, 'Ramos-Horta bị bắn bị thương', 2, Gr]]);
  ev('TO', [[1999, 'gia nhập Liên Hợp Quốc', 1]]);
  ev('TT', [[2010, 'Kamla Persad-Bissessar là nữ thủ tướng đầu tiên', 2, J]]);
  ev('TV', [[1943, 'Mỹ lập căn cứ ở Funafuti', 2]]);
  ev('UY', [[1973, 'quân đội đảo chính', 2, Gr], [2013, 'hợp pháp hóa cần sa', 2]]);
})(globalThis.G);
