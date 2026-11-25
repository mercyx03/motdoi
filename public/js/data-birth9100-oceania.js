/* Một Đời — 9.10.0 bổ sung sự kiện thật (đợt 3, châu Đại Dương và các nước nhỏ ở châu Phi): nâng các nước còn mỏng, thêm thể thao, văn hóa, đời sống.
   Cùng quy tắc chống trùng với data-birth989-more.js. Nguồn thứ cấp, đối chiếu 25/11/2026. */
(function (G) {
  'use strict';
  var D = G.BIRTH987 || (G.BIRTH987 = { ERA: {}, EV: {}, WORLD: [] });
  var STOP = { 'năm': 1, 'của': 1, 'được': 1, 'những': 1, 'người': 1, 'trong': 1, 'cho': 1, 'với': 1, 'các': 1, 'một': 1, 'lần': 1, 'đầu': 1, 'tiên': 1, 'lớn': 1 };
  function wd(t) { return String(t).toLowerCase().split(/[^\p{L}\d]+/u).filter(function (x) { return x.length >= 3 && !STOP[x]; }); }
  function dup(c, r) { var a = wd(r[1]); return (D.EV[c] || []).some(function (e) { if (e[0] !== r[0]) return false; var b = wd(e[1]); return e[1] === r[1] || a.filter(function (x) { return b.indexOf(x) >= 0; }).length >= 2; }); }
  function ev(c, rows) { rows.forEach(function (r) { if (!dup(c, r)) (D.EV[c] || (D.EV[c] = [])).push([r[0], r[1], r[2] || 1, r[3] || '']); }); }
  var J = 'joy', Gr = 'grief';

  ev('NZ', [[1907, 'trở thành lãnh thổ tự trị Dominion', 2], [1915, 'Gallipoli, nguồn gốc ngày Anzac', 2, Gr], [1953, 'Edmund Hillary lên đỉnh Everest', 2, J], [1985, 'tàu Rainbow Warrior bị đánh chìm ở Auckland', 2, Gr], [1987, 'All Blacks vô địch Rugby World Cup đầu tiên', 2, J], [2011, 'động đất Christchurch', 2, Gr], [2019, 'vụ xả súng ở hai nhà thờ Hồi giáo Christchurch', 2, Gr]]);
  ev('FJ', [[1970, 'độc lập ngày 10 tháng Mười', 2, J], [1987, 'hai cuộc đảo chính', 2], [2000, 'cuộc đảo chính của George Speight', 2], [2006, 'Bainimarama đảo chính', 2], [2016, 'bão Winston và vàng rugby bảy người ở Rio', 2, J]]);
  ev('SB', [[1942, 'trận Guadalcanal', 2, Gr], [1978, 'độc lập ngày 7 tháng Bảy', 2, J], [2003, 'phái bộ RAMSI đến Honiara', 2], [2007, 'sóng thần ở Tây Solomon', 2, Gr], [2019, 'chuyển công nhận ngoại giao sang Trung Quốc', 1]]);
  ev('VU', [[1980, 'độc lập ngày 30 tháng Bảy', 2, J], [1987, 'bão Uma', 2, Gr], [2015, 'bão Pam', 2, Gr]]);
  ev('WS', [[1914, 'New Zealand chiếm Samoa', 2], [1918, 'dịch cúm cướp đi khoảng một phần năm dân số', 2, Gr], [1929, 'Thứ Bảy Đen, cảnh sát bắn vào đoàn người Mau', 2, Gr], [1962, 'độc lập ngày 1 tháng Một', 2, J], [2009, 'sóng thần', 2, Gr], [2011, 'bỏ ngày 30/12, đổi sang phía tây đường đổi ngày', 1], [2019, 'dịch sởi nghiêm trọng', 2, Gr]]);
  ev('TO', [[1900, 'hiệp ước hữu nghị với Anh', 1], [1953, 'Nữ hoàng Salote dự lễ đăng quang Elizabeth II', 2, J], [1970, 'độc lập ngày 4 tháng Sáu', 2, J], [2006, 'bạo loạn ở thủ đô Nuku’alofa', 2, Gr], [2010, 'bầu cử dân chủ đầu tiên', 1], [2022, 'núi lửa Hunga Tonga phun trào', 2, Gr]]);
  ev('KI', [[1943, 'trận Tarawa', 2, Gr], [1979, 'độc lập ngày 12 tháng Bảy', 2, J], [2019, 'chuyển công nhận ngoại giao sang Trung Quốc', 1]]);
  ev('NR', [[1900, 'phát hiện phốt phát', 2], [1942, 'Nhật chiếm đóng', 2, Gr], [1999, 'gia nhập Liên Hợp Quốc', 1]]);
  ev('TV', [[1975, 'tách khỏi quần đảo Gilbert', 1], [1978, 'độc lập ngày 1 tháng Mười', 2, J], [2000, 'bán hậu tố .tv và gia nhập Liên Hợp Quốc', 1]]);
  ev('PW', [[1944, 'trận Peleliu', 2, Gr], [1994, 'độc lập ngày 1 tháng Mười', 2, J]]);
  ev('FM', [[1944, 'chiến dịch Hailstone ở vịnh Truk', 2, Gr], [1979, 'hiến pháp thành lập liên bang', 1], [1986, 'Hiệp ước Liên kết tự do với Mỹ', 2]]);
  ev('MH', [[1946, 'Mỹ thử bom ở Bikini', 2, Gr], [1954, 'vụ thử Castle Bravo', 2, Gr], [1979, 'tự trị', 1], [1986, 'Hiệp ước Liên kết tự do', 2]]);
  ev('SC', [[1976, 'độc lập ngày 29 tháng Sáu', 2, J], [1977, 'đảo chính của France-Albert René', 1], [1993, 'bầu cử đa đảng', 1], [2020, 'đối lập thắng cử lần đầu', 2]]);
  ev('ST', [[1953, 'vụ thảm sát Batepá', 2, Gr], [1990, 'trưng cầu dân ý mở đường đa đảng', 1], [2003, 'đảo chính hụt', 1]]);
  ev('DJ', [[1991, 'nội chiến bùng nổ', 2, Gr], [1999, 'Ismaïl Omar Guelleh lên làm tổng thống', 1], [2017, 'Trung Quốc mở căn cứ hải quân đầu tiên ở nước ngoài', 1]]);
  ev('BW', [[1967, 'phát hiện mỏ kim cương Orapa', 2], [1980, 'Seretse Khama qua đời', 2]]);
  ev('LS', [[1966, 'độc lập ngày 4 tháng Mười', 2, J], [1970, 'Leabua Jonathan hủy kết quả bầu cử', 1], [1986, 'đảo chính quân sự', 1], [1998, 'quân SADC can thiệp sau bầu cử', 2]]);
  ev('SZ', [[1968, 'độc lập ngày 6 tháng Chín', 2, J], [1973, 'vua Sobhuza hủy hiến pháp', 1], [1982, 'vua Sobhuza II qua đời', 2], [1986, 'Mswati III lên ngôi', 2], [2018, 'đổi tên thành Eswatini', 2]]);
  ev('GQ', [[1968, 'độc lập ngày 12 tháng Mười', 2, J], [1979, 'Macías Nguema bị lật đổ', 2], [1996, 'bắt đầu khai thác dầu quy mô lớn', 2]]);
  ev('CV', [[1975, 'độc lập ngày 5 tháng Bảy', 2, J], [1991, 'bầu cử đa đảng đầu tiên', 1], [2011, 'Cesária Évora qua đời', 2, Gr]]);
  ev('KM', [[1975, 'độc lập ngày 6 tháng Bảy', 2, J], [1995, 'lính đánh thuê đảo chính do Bob Denard cầm đầu', 1], [1999, 'Azali Assoumani đảo chính', 1]]);
  ev('MU', [[1968, 'độc lập ngày 12 tháng Ba', 2, J], [1992, 'chuyển thành nước cộng hòa', 1], [2005, 'đổi chính phủ sau bầu cử', 1]]);
})(globalThis.G);
