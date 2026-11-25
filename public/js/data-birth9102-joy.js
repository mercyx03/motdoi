/* Một Đời — 9.10.2 bổ sung sự kiện vui cho các nước lớn và nước thiếu sự kiện vui (mục 3). Nguồn thứ cấp; các mốc có ngày cụ thể đã đối chiếu web 25/11/2026. */
(function (G) {
  'use strict';
  var D = G.BIRTH987 || (G.BIRTH987 = { ERA: {}, EV: {}, WORLD: [] });
  var STOP = { 'năm': 1, 'của': 1, 'được': 1, 'những': 1, 'người': 1, 'trong': 1, 'cho': 1, 'với': 1, 'các': 1, 'một': 1, 'lần': 1, 'đầu': 1, 'tiên': 1, 'lớn': 1 };
  function wd(t) { return String(t).toLowerCase().split(/[^\p{L}\d]+/u).filter(function (x) { return x.length >= 3 && !STOP[x]; }); }
  function dup(c, r) { var a = wd(r[1]); return (D.EV[c] || []).some(function (e) { if (e[0] !== r[0]) return false; var b = wd(e[1]); return e[1] === r[1] || a.filter(function (x) { return b.indexOf(x) >= 0; }).length >= 2; }); }
  function ev(c, rows) { rows.forEach(function (r) { if (!dup(c, r)) (D.EV[c] || (D.EV[c] = [])).push([r[0], r[1], r[2] || 1, r[3] || '']); }); }
  var J = 'joy', Gr = 'grief';
  ev('ID', [[1958, 'đội tuyển cầu lông Indonesia lần đầu giành Thomas Cup', 2, J], [1962, 'đăng cai Á vận hội ở Jakarta', 2, J], [1985, 'FAO ghi nhận Indonesia tự túc được gạo', 2, J], [1992, 'Susi Susanti và Alan Budikusuma giành hai vàng cầu lông Olympic đầu tiên ở Barcelona', 2, J], [2002, 'đội cầu lông vô địch Thomas Cup ở Quảng Châu', 1, J], [2019, 'tàu điện ngầm MRT Jakarta mở cửa', 2, J]]);
  ev('MX', [[1955, 'đăng cai Đại hội Thể thao Liên Mỹ ở Mexico City', 1, J], [1968, 'Thế vận hội mùa hè khai mạc ở Mexico City ngày 12/10, lần đầu tổ chức ở châu Mỹ Latin', 2, J], [1990, 'Octavio Paz nhận giải Nobel Văn học', 2, J], [2012, 'đội tuyển bóng đá nam giành vàng Olympic London', 2, J], [2019, 'Alfonso Cuarón nhận Oscar đạo diễn cho phim Roma', 2, J]]);
  ev('US', [[1927, 'Charles Lindbergh bay một mình qua Đại Tây Dương, hạ cánh ở Paris ngày 21/5', 2, J], [1955, 'Disneyland mở cửa ở California ngày 17/7', 1, J], [1964, 'ban nhạc Beatles lên truyền hình Ed Sullivan ngày 9/2', 2, J], [1969, 'lễ hội âm nhạc Woodstock', 2, J], [1980, '"Phép màu trên băng": đội khúc côn cầu nghiệp dư thắng Liên Xô 4–3 ngày 22/2', 2, J], [1994, 'đăng cai World Cup', 1, J]]);
  ev('IN', [[1913, 'Rabindranath Tagore nhận giải Nobel Văn học', 2, J], [1928, 'đội khúc côn cầu giành vàng Olympic Amsterdam', 2, J], [1951, 'Á vận hội đầu tiên tổ chức ở New Delhi', 2, J], [1982, 'Á vận hội New Delhi, truyền hình màu phát sóng rộng', 2, J], [1994, 'Sushmita Sen và Aishwarya Rai lần lượt đăng quang Hoa hậu Hoàn vũ và Hoa hậu Thế giới', 1, J], [1998, 'Amartya Sen nhận giải Nobel Kinh tế', 2, J], [2007, 'đội tuyển thắng Pakistan, vô địch T20 World Cup đầu tiên', 2, J], [2014, 'tàu vũ trụ Mangalyaan vào quỹ đạo sao Hỏa', 2, J]]);
  ev('CN', [[1984, 'Hứa Hải Phong giành huy chương vàng Olympic đầu tiên của Trung Quốc, tại Los Angeles', 2, J], [1990, 'đăng cai Á vận hội ở Bắc Kinh', 2, J], [2012, 'Mạc Ngôn nhận giải Nobel Văn học', 2, J], [2015, 'Đồ Hữu Hữu nhận giải Nobel Y học', 2, J], [2019, 'tàu Hằng Nga 4 hạ cánh xuống mặt xa Mặt Trăng ngày 3/1', 2, J], [2022, 'Thế vận hội mùa đông ở Bắc Kinh', 2, J]]);
  ev('BR', [[1959, 'João Gilberto ra album mở đầu bossa nova', 2, J], [1984, 'Sambadrome Rio khai trương, Joaquim Cruz vàng 800 m Olympic Los Angeles', 1, J], [1988, 'Ayrton Senna lần đầu vô địch F1', 2, J], [2016, 'đội bóng đá nam giành vàng Olympic Rio', 2, J]]);
  ev('TR', [[2000, 'Galatasaray vô địch UEFA Cup', 2, J], [2002, 'đội tuyển giành hạng ba World Cup', 2, J], [2003, 'Sertab Erener thắng Eurovision', 2, J], [2005, 'chung kết Champions League ở Istanbul, Liverpool lội ngược dòng', 1, J], [2006, 'Orhan Pamuk nhận giải Nobel Văn học', 2, J], [2013, 'đường hầm Marmaray nối hai châu Âu–Á khánh thành', 2, J]]);
  ev('EG', [[1961, 'Tháp Cairo khánh thành', 1, J], [1975, 'kênh đào Suez mở lại sau tám năm', 2, J], [2008, 'vô địch Cúp châu Phi lần thứ sáu', 1, J], [2010, 'vô địch Cúp châu Phi lần thứ ba liên tiếp', 1, J], [2017, 'Mohamed Salah ghi bàn đưa Ai Cập tới World Cup sau 28 năm', 2, J]]);
  ev('IR', [[1956, 'Gholamreza Takhti giành vàng đấu vật Olympic Melbourne', 2, J], [1997, 'Abbas Kiarostami nhận Cành cọ vàng Cannes', 2, J], [2000, 'Hossein Rezazadeh giành vàng cử tạ Olympic Sydney', 2, J], [2012, 'phim "Một cuộc chia ly" thắng Oscar phim nước ngoài', 2, J]]);
  ev('PK', [[1954, 'đội tuyển thắng Anh ở Oval trong chuyến thi đấu đầu tiên', 2, J], [1978, 'vô địch World Cup khúc côn cầu', 1, J], [1994, 'vô địch World Cup khúc côn cầu ở Sydney', 1, J], [2009, 'vô địch T20 World Cup ở Lord\'s', 2, J], [2014, 'Malala Yousafzai nhận giải Nobel Hòa bình', 2, J]]);
  ev('BD', [[1983, 'Ngân hàng Grameen thành lập thành ngân hàng độc lập', 2, J], [1985, 'đăng cai Đại hội Thể thao Nam Á ở Dhaka', 1, J], [2011, 'đồng đăng cai Cricket World Cup, lễ khai mạc ở Dhaka', 2, J], [2018, 'đội nữ vô địch Cúp châu Á, thắng Ấn Độ ở chung kết ngày 10/6', 2, J]]);
  ev('PH', [[1969, 'Gloria Diaz đăng quang Hoa hậu Hoàn vũ', 2, J], [2008, 'Manny Pacquiao thắng Oscar De La Hoya', 2, J], [2015, 'Pia Wurtzbach đăng quang Hoa hậu Hoàn vũ', 2, J], [2019, 'đăng cai Đại hội Thể thao Đông Nam Á, đứng đầu bảng huy chương', 2, J]]);
  ev('UG', [[1954, 'đập Owen Falls ở Jinja khánh thành', 2, J], [2020, 'Joshua Cheptegei phá kỷ lục thế giới 5.000 m ngày 14/8 và 10.000 m ngày 7/10', 2, J]]);
  ev('CD', [[1968, 'Zaire vô địch Cúp châu Phi', 2, J], [1974, 'Zaire vô địch Cúp châu Phi lần hai và dự World Cup', 2, J], [2016, 'đội tuyển vô địch CHAN', 1, J]]);
  ev('SD', [[1970, 'Sudan vô địch Cúp châu Phi', 2, J]]);
  ev('AF', [[2008, 'Rohullah Nikpai giành huy chương Olympic đầu tiên của Afghanistan', 2, J], [2018, 'đội cricket đá trận Test đầu tiên', 1, J]]);
  ev('AO', [[2006, 'Angola dự World Cup lần đầu', 2, J]]);
  ev('MZ', [[2000, 'Maria Mutola giành vàng 800 m Olympic Sydney, huy chương vàng đầu tiên của Mozambique', 2, J]]);
  ev('ML', [[2006, 'Ali Farka Touré và Toumani Diabaté nhận giải Grammy tháng Hai', 2, J]]);
  ev('YE', [[2010, 'đăng cai Gulf Cup ở Aden và Abyan', 1, J]]);
  ev('CM', [[1984, 'đội tuyển vô địch Cúp châu Phi lần đầu', 2, J], [1988, 'đội tuyển vô địch Cúp châu Phi lần hai', 2, J]]);
})(globalThis.G);
