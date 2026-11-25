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

  ev('MG', [[1996, 'Tổng thống Zafy bị luận tội', 1], [2013, 'Hery Rajaonarimampianina thắng cử', 1], [2018, 'Andry Rajoelina trở lại làm tổng thống', 1]]);
  ev('ZM', [[2015, 'Edgar Lungu thắng cử bầu cử sớm sau khi Sata qua đời', 1]]);
  ev('GT', [[1978, 'thảm sát Panzós', 2, Gr], [1982, 'Ríos Montt đảo chính', 2], [2013, 'Ríos Montt bị kết án diệt chủng', 2], [2018, 'núi lửa Fuego phun trào', 2, Gr]]);
  ev('EC', [[1998, 'hiệp ước hòa bình với Peru', 2], [2007, 'Rafael Correa nhậm chức']]);
  ev('PG', [[1951, 'núi lửa Lamington phun trào', 2, Gr], [1973, 'tự trị nội bộ', 1], [2011, 'Peter O’Neill lên làm thủ tướng', 1]]);
  ev('BO', [[1904, 'hiệp ước hòa bình với Chile, mất đường ra biển', 2, Gr], [1946, 'Tổng thống Villarroel bị treo cổ', 2, Gr], [1971, 'Banzer đảo chính', 2], [2003, 'Chiến tranh Khí đốt', 2, Gr], [2009, 'hiến pháp mới, quốc gia đa dân tộc', 2]]);
  ev('TJ', [[2003, 'trưng cầu dân ý đổi hiến pháp', 1], [2013, 'Rahmon tái đắc cử', 1], [2016, 'trưng cầu dân ý cho phép Rahmon tái cử không giới hạn', 1], [2020, 'Rahmon đắc cử nhiệm kỳ thứ năm', 1], [2022, 'bất ổn ở Gorno-Badakhshan', 2, Gr]]);
  ev('DO', [[1966, 'Joaquín Balaguer thắng cử', 1], [2003, 'ngân hàng Baninter sụp đổ', 2, Gr]]);
  ev('HN', [[1982, 'hiến pháp mới sau nhiều năm quân quản', 1], [2017, 'tranh cãi kết quả bầu cử', 2, Gr], [2021, 'Xiomara Castro là nữ tổng thống đầu tiên', 2]]);
  ev('LA', [[1960, 'Kong Le đảo chính', 1], [2021, 'khánh thành đường sắt Lào–Trung Quốc', 2, J]]);
  ev('RO', [[1940, 'tối hậu thư của Liên Xô và mất lãnh thổ', 2, Gr]]);
  ev('KG', [[1936, 'trở thành nước cộng hòa riêng trong Liên Xô', 1], [2017, 'Sooronbay Jeenbekov thắng cử', 1]]);
  ev('PY', [[1947, 'nội chiến', 2, Gr], [1999, 'Phó Tổng thống Argaña bị ám sát', 2, Gr]]);
  ev('NI', [[2007, 'Daniel Ortega trở lại làm tổng thống', 1]]);
  ev('TM', [[1999, 'Niyazov được phong tổng thống trọn đời', 1], [2008, 'hiến pháp mới', 1], [2022, 'Serdar Berdimuhamedow đắc cử', 1]]);
  ev('ER', [[2008, 'xung đột biên giới với Djibouti', 2, Gr]]);
  ev('SV', [[2009, 'Mauricio Funes thắng cử, phe cánh tả lần đầu cầm quyền', 2]]);
  ev('AE', [[2009, 'khủng hoảng nợ của Dubai', 2, Gr]]);
  ev('CZ', [[1969, 'Jan Palach tự thiêu để phản đối', 2, Gr], [1977, 'Hiến chương 77 ra đời', 2], [1993, 'tách khỏi Slovakia và lập nước Séc', 2]]);
  ev('OM', [[1920, 'hiệp ước Seeb', 1], [1932, 'Said bin Taimur lên ngôi', 1], [1958, 'bán thành phố Gwadar cho Pakistan', 1]]);
  ev('LB', [[1958, 'khủng hoảng chính trị, Mỹ đổ quân', 2, Gr]]);
  ev('PA', [[1968, 'Omar Torrijos nắm quyền sau đảo chính', 2], [1987, 'khủng hoảng chống Noriega', 2, Gr]]);
  ev('BW', [[1985, 'đột kích của quân Nam Phi vào Gaborone', 2, Gr], [1998, 'Festus Mogae nhậm chức', 1]]);
  ev('BG', [[1912, 'chiến tranh Balkan lần thứ nhất', 2, Gr], [1946, 'bãi bỏ chế độ quân chủ', 2]]);
  ev('GQ', [[1969, 'người Tây Ban Nha rời đi sau khủng hoảng', 2], [1982, 'hiến pháp mới', 1], [2004, 'âm mưu đảo chính với lính đánh thuê bị phát giác', 2], [2015, 'đăng cai Cúp châu Phi vào phút chót', 1, J]]);
  ev('LS', [[1965, 'cuộc bầu cử đầu tiên', 1], [1993, 'bầu cử đa đảng sau hai mươi ba năm', 2], [2012, 'Tom Thabane lên làm thủ tướng', 1]]);
  ev('SK', [[1999, 'bầu cử tổng thống trực tiếp lần đầu', 1], [2018, 'nhà báo Ján Kuciak bị sát hại', 2, Gr]]);
  ev('KW', [[1976, 'quốc hội bị đình chỉ', 1], [1986, 'quốc hội lại bị giải tán', 1], [2009, 'những nữ nghị sĩ đầu tiên', 2, J]]);
  ev('GE', [[2012, 'Bidzina Ivanishvili thắng cử, đổi chính quyền', 1]]);
  ev('AM', [[1965, 'biểu tình lớn tưởng niệm diệt chủng ở Yerevan', 2], [1999, 'vụ xả súng trong quốc hội', 2, Gr], [2008, 'biểu tình sau bầu cử tháng Ba', 2, Gr]]);
  ev('TL', [[1975, 'FRETILIN tuyên bố độc lập rồi Indonesia xâm lược', 2, Gr], [1999, 'lực lượng INTERFET vào Đông Timor', 2], [2012, 'phái bộ Liên Hợp Quốc kết thúc', 1]]);
  ev('UY', [[1930, 'đăng cai và vô địch World Cup đầu tiên', 2, J], [1950, 'Maracanazo thắng Brazil ở chung kết World Cup', 2, J], [1985, 'trở lại chế độ dân sự', 2]]);
  ev('JM', [[1938, 'bạo loạn lao động', 2], [2010, 'cuộc đột kích Tivoli Gardens', 2, Gr]]);
  ev('MD', [[1989, 'ngôn ngữ Moldova được công nhận là ngôn ngữ nhà nước', 1], [2001, 'phe cộng sản thắng cử', 1], [2015, 'vụ mất một tỷ đô la từ hệ thống ngân hàng', 2, Gr], [2020, 'Maia Sandu đắc cử, nữ tổng thống đầu tiên', 2]]);
  ev('AL', [[1928, 'Zog lên ngôi vua', 1], [1991, 'bầu cử đa đảng đầu tiên', 2]]);
  ev('BA', [[1990, 'bầu cử đa đảng đầu tiên', 1], [1993, 'cầu cổ Mostar bị phá', 2, Gr], [2004, 'cầu Mostar được dựng lại', 2, J]]);
  ev('KM', [[1961, 'tự trị nội bộ', 1], [2002, 'hiến pháp mới lập liên bang', 1], [2016, 'Azali Assoumani trở lại làm tổng thống', 1]]);
  ev('SZ', [[1967, 'hiến pháp tự trị', 1], [2005, 'hiến pháp mới được ký', 1], [2021, 'biểu tình đòi dân chủ bị đàn áp', 2, Gr]]);
  ev('QA', [[1972, 'Khalifa bin Hamad lên cầm quyền', 1], [2006, 'đăng cai Á vận hội Doha', 2, J], [2019, 'vô địch Cúp châu Á', 2, J]]);
  ev('SB', [[1976, 'chính quyền tự trị', 1], [2000, 'hiệp định hòa bình Townsville', 2], [2006, 'bạo loạn ở Honiara', 2, Gr], [2013, 'sóng thần ở đảo Santa Cruz', 2, Gr], [2014, 'lũ lớn ở Honiara', 2, Gr]]);
  ev('DJ', [[1967, 'trưng cầu dân ý, vẫn là lãnh thổ Pháp', 1], [2011, 'biểu tình theo làn sóng Mùa xuân Ả Rập', 1]]);
  ev('LT', [[1989, 'Con đường Baltic', 2, J]]);
  ev('BH', [[1973, 'hiến pháp và quốc hội đầu tiên', 1], [2001, 'Hiến chương Hành động Quốc gia', 2], [2020, 'bình thường hóa quan hệ với Israel', 1]]);
  ev('MK', [[1903, 'khởi nghĩa Ilinden', 2], [1944, 'phiên họp ASNOM đặt nền cho nước Macedonia hiện đại', 2]]);
  ev('SI', [[1941, 'bị chia cắt và chiếm đóng', 2, Gr], [1990, 'trưng cầu dân ý chọn độc lập', 2], [2008, 'đảm nhiệm luân phiên chủ tịch EU', 1]]);
  ev('FJ', [[1999, 'Mahendra Chaudhry là thủ tướng gốc Ấn đầu tiên', 2], [2014, 'bầu cử đầu tiên sau chế độ quân sự', 1], [2022, 'Sitiveni Rabuka trở lại làm thủ tướng', 1]]);
  ev('GY', [[1953, 'hiến pháp bị đình chỉ', 2], [1992, 'bầu cử tự do, Cheddi Jagan đắc cử', 2]]);
  ev('TT', [[1958, 'lập Liên bang Tây Ấn', 1]]);
})(globalThis.G);
