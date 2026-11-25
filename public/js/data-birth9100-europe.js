/* Một Đời — 9.10.0 bổ sung sự kiện thật (đợt 3, châu Âu): nâng các nước còn mỏng, thêm thể thao, văn hóa, đời sống.
   Cùng quy tắc chống trùng với data-birth989-more.js. Nguồn thứ cấp, đối chiếu 25/11/2026. */
(function (G) {
  'use strict';
  var D = G.BIRTH987 || (G.BIRTH987 = { ERA: {}, EV: {}, WORLD: [] });
  var STOP = { 'năm': 1, 'của': 1, 'được': 1, 'những': 1, 'người': 1, 'trong': 1, 'cho': 1, 'với': 1, 'các': 1, 'một': 1, 'lần': 1, 'đầu': 1, 'tiên': 1, 'lớn': 1 };
  function wd(t) { return String(t).toLowerCase().split(/[^\p{L}\d]+/u).filter(function (x) { return x.length >= 3 && !STOP[x]; }); }
  function dup(c, r) { var a = wd(r[1]); return (D.EV[c] || []).some(function (e) { if (e[0] !== r[0]) return false; var b = wd(e[1]); return e[1] === r[1] || a.filter(function (x) { return b.indexOf(x) >= 0; }).length >= 2; }); }
  function ev(c, rows) { rows.forEach(function (r) { if (!dup(c, r)) (D.EV[c] || (D.EV[c] = [])).push([r[0], r[1], r[2] || 1, r[3] || '']); }); }
  var J = 'joy', Gr = 'grief';

  ev('RO', [[1907, 'khởi nghĩa nông dân', 2, Gr], [1976, 'Nadia Comăneci đạt điểm 10 ở Montreal', 2, J], [1977, 'động đất ở Bucharest', 2, Gr], [2007, 'gia nhập Liên minh châu Âu', 2]]);
  ev('CZ', [[1938, 'hiệp ước Munich', 2, Gr], [1948, 'đảo chính tháng Hai của cộng sản', 2], [1968, 'quân Warsaw tiến vào chấm dứt Mùa xuân Praha', 2, Gr], [1998, 'đội khúc côn cầu vô địch Olympic Nagano', 2, J], [2004, 'gia nhập EU', 2]]);
  ev('CH', [[1920, 'Genève được chọn làm trụ sở Hội Quốc Liên', 1], [1971, 'phụ nữ được bỏ phiếu cấp liên bang', 2], [2002, 'gia nhập Liên Hợp Quốc', 1], [2008, 'đồng đăng cai Euro cùng Áo', 1, J]]);
  ev('BG', [[1908, 'tuyên bố hoàn toàn độc lập', 2], [1989, 'Todor Zhivkov bị buộc từ chức', 2], [1994, 'Hristo Stoichkov giành Quả bóng vàng châu Âu', 1, J], [2007, 'gia nhập EU', 2]]);
  ev('SK', [[1939, 'nhà nước Slovakia lệ thuộc Đức', 2], [1944, 'khởi nghĩa dân tộc Slovakia', 2], [1989, 'cuộc biểu tình nến ở Bratislava', 2], [1993, 'tách khỏi Tiệp Khắc ngày 1 tháng Một', 2], [2009, 'dùng đồng euro', 1]]);
  ev('HR', [[1941, 'lập "Nhà nước Độc lập Croatia" dưới Đức–Ý', 2, Gr], [1971, 'Mùa xuân Croatia bị dập tắt', 1], [1995, 'chiến dịch Bão táp', 2], [1998, 'đội tuyển giành huy chương đồng World Cup', 2, J], [2013, 'gia nhập EU', 2], [2018, 'vào chung kết World Cup', 2, J]]);
  ev('MD', [[1940, 'Liên Xô sáp nhập Bessarabia', 2], [1992, 'xung đột Transnistria', 2, Gr], [2009, 'biểu tình sau bầu cử', 1], [2022, 'đón hàng trăm nghìn người tị nạn từ Ukraine', 2]]);
  ev('AL', [[1912, 'tuyên bố độc lập ở Vlorë', 2, J], [1939, 'Ý xâm chiếm', 2, Gr], [1985, 'Enver Hoxha qua đời', 2], [1997, 'sụp đổ các quỹ kim tự tháp, nổi loạn', 2, Gr], [2019, 'động đất ở Durrës', 2, Gr]]);
  ev('BA', [[1914, 'vụ ám sát ở Sarajevo châm ngòi chiến tranh', 2], [1984, 'Thế vận hội mùa đông ở Sarajevo', 2, J], [1995, 'Srebrenica và hiệp định Dayton', 2, Gr], [2014, 'lũ lụt lớn tháng Năm', 2, Gr]]);
  ev('LT', [[1918, 'tuyên bố khôi phục nhà nước', 2], [1940, 'Liên Xô chiếm đóng', 2, Gr], [1991, 'đêm 13 tháng Một ở Vilnius', 2, Gr], [2004, 'gia nhập EU và NATO', 2], [2015, 'dùng đồng euro', 1]]);
  ev('MK', [[1963, 'động đất ở Skopje', 2, Gr], [2018, 'thỏa thuận Prespa với Hy Lạp', 2], [2020, 'gia nhập NATO', 2]]);
  ev('SI', [[1980, 'Tito qua đời ở Ljubljana', 2], [2004, 'gia nhập EU và NATO', 2], [2007, 'dùng đồng euro', 1], [2020, 'Tadej Pogačar thắng Tour de France', 2, J]]);
  ev('LV', [[1918, 'tuyên bố lập nước', 2], [1940, 'Liên Xô chiếm đóng', 2, Gr], [1989, 'Con đường Baltic nối ba nước', 2, J], [2004, 'gia nhập EU và NATO', 2], [2014, 'dùng đồng euro, Riga là thủ đô văn hóa châu Âu', 1, J]]);
  ev('EE', [[1918, 'tuyên bố độc lập ngày 24 tháng Hai', 2], [1988, 'Cách mạng Hát', 2, J], [2003, 'ra mắt Skype', 1, J], [2007, 'cuộc tấn công mạng quy mô lớn', 1], [2011, 'dùng đồng euro', 1]]);
  ev('CY', [[1960, 'độc lập ngày 16 tháng Tám', 2], [1963, 'bạo lực Giáng sinh giữa hai cộng đồng', 2, Gr], [1974, 'đảo chính rồi Thổ Nhĩ Kỳ đổ quân', 2, Gr], [1983, 'tuyên bố lập nước ở phía bắc', 1], [2004, 'gia nhập EU', 2], [2013, 'khủng hoảng ngân hàng, đánh thuế tiền gửi', 2, Gr]]);
  ev('ME', [[1918, 'sáp nhập vào Vương quốc Serb, Croat và Slovene', 2], [2006, 'trưng cầu dân ý chọn độc lập', 2], [2017, 'gia nhập NATO', 2]]);
  ev('LU', [[1940, 'Đức chiếm đóng', 2, Gr], [1944, 'quân Đồng minh giải phóng', 2], [1957, 'là thành viên sáng lập Cộng đồng Kinh tế châu Âu', 1], [1985, 'hiệp định Schengen được ký ở làng Schengen', 2]]);
  ev('MT', [[1942, 'Malta nhận Huân chương Thánh George', 2], [1964, 'độc lập ngày 21 tháng Chín', 2, J], [1974, 'trở thành nước cộng hòa', 1], [1979, 'quân Anh rút đi, Ngày Tự do', 2], [2004, 'gia nhập EU', 2], [2008, 'dùng đồng euro', 1]]);
  ev('VA', [[1929, 'hiệp ước Lateran lập nhà nước Vatican', 2], [1981, 'vụ ám sát Giáo hoàng John Paul II', 2, Gr], [2005, 'John Paul II qua đời, Benedict XVI kế vị', 2], [2013, 'Benedict XVI từ chức, Phanxicô lên ngôi', 2], [2025, 'Giáo hoàng Phanxicô qua đời, Leo XIV được bầu', 2]]);
  ev('MC', [[1929, 'giải đua xe Grand Prix Monaco đầu tiên', 2, J], [1956, 'đám cưới Rainier III và Grace Kelly', 2, J], [1982, 'Công nương Grace qua đời', 2, Gr], [2005, 'Rainier III qua đời, Albert II kế vị', 2], [2011, 'đám cưới Albert II và Charlene', 1, J]]);
  ev('LI', [[1938, 'Franz Josef II lên ngôi', 1], [1980, 'Hanni Wenzel giành hai huy chương vàng ở Lake Placid', 2, J], [1984, 'phụ nữ được bầu cử cấp quốc gia', 2], [2003, 'trưng cầu dân ý mở rộng quyền của hoàng thân', 1]]);
  ev('AD', [[1993, 'hiến pháp thành văn đầu tiên', 2]]);
})(globalThis.G);
