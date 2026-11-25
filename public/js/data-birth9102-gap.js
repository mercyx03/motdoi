/* Một Đời — 9.10.2 bổ sung sự kiện cho các năm còn trống ở nước lớn và nước đông dân (mục 2). Nguồn thứ cấp; các mốc có ngày cụ thể đã đối chiếu web 25/11/2026. */
(function (G) {
  'use strict';
  var D = G.BIRTH987 || (G.BIRTH987 = { ERA: {}, EV: {}, WORLD: [] });
  var STOP = { 'năm': 1, 'của': 1, 'được': 1, 'những': 1, 'người': 1, 'trong': 1, 'cho': 1, 'với': 1, 'các': 1, 'một': 1, 'lần': 1, 'đầu': 1, 'tiên': 1, 'lớn': 1 };
  function wd(t) { return String(t).toLowerCase().split(/[^\p{L}\d]+/u).filter(function (x) { return x.length >= 3 && !STOP[x]; }); }
  function dup(c, r) { var a = wd(r[1]); return (D.EV[c] || []).some(function (e) { if (e[0] !== r[0]) return false; var b = wd(e[1]); return e[1] === r[1] || a.filter(function (x) { return b.indexOf(x) >= 0; }).length >= 2; }); }
  function ev(c, rows) { rows.forEach(function (r) { if (!dup(c, r)) (D.EV[c] || (D.EV[c] = [])).push([r[0], r[1], r[2] || 1, r[3] || '']); }); }
  var J = 'joy', Gr = 'grief';
  ev('SD', [[1958, 'tướng Abboud đảo chính', 2], [1976, 'cuộc đảo chính bất thành của phe Ansar', 2, Gr], [1998, 'Mỹ đánh bom nhà máy dược al-Shifa', 2, Gr], [2010, 'cuộc bầu cử đa đảng đầu tiên sau hai thập kỷ', 2], [2020, 'hiệp định hòa bình Juba', 2], [2021, 'quân đội đảo chính, chính quyền dân sự sụp đổ', 2, Gr]]);
  ev('AF', [[1953, 'Daoud Khan làm thủ tướng', 1], [1959, 'phụ nữ được bỏ mạng che mặt tự nguyện', 2], [1988, 'ký Hiệp định Geneva về việc Liên Xô rút quân', 2], [1998, 'Taliban thảm sát ở Mazar-i-Sharif', 2, Gr], [2009, 'bầu cử tổng thống gây nhiều tranh cãi', 1]]);
  ev('AO', [[1956, 'thành lập phong trào MPLA', 2], [1977, 'vụ đảo chính bất thành của Nito Alves', 2, Gr], [1988, 'trận Cuito Cuanavale kết thúc', 2], [1994, 'ký Nghị định thư Lusaka', 2]]);
  ev('MZ', [[1969, 'Eduardo Mondlane bị ám sát', 2, Gr], [1984, 'hiệp ước Nkomati với Nam Phi', 2], [2016, 'bê bối nợ ngầm của chính phủ', 2, Gr], [2021, 'phiến quân tấn công Palma', 2, Gr]]);
  ev('NE', [[1973, 'hạn hán Sahel gây nạn đói', 2, Gr], [1990, 'xung đột người Tuareg ở Tchin-Tabaraden', 2, Gr], [2009, 'Tandja trưng cầu dân ý kéo dài nhiệm kỳ', 2], [2013, 'tấn công mỏ uranium ở Arlit', 2, Gr], [2015, 'Boko Haram tấn công vùng Diffa', 2, Gr]]);
  ev('ML', [[1962, 'cuộc nổi dậy của người Tuareg đầu tiên', 2, Gr], [1990, 'người Tuareg nổi dậy ở miền bắc', 2], [1996, 'lễ "Ngọn lửa Hòa bình" ở Timbuktu', 2], [2015, 'ký thỏa thuận hòa bình Algiers', 2], [2019, 'thảm sát ở Ogossagou', 2, Gr]]);
  ev('YE', [[1963, 'khởi nghĩa Radfan chống Anh', 2], [1986, 'nội chiến ở Aden', 2, Gr], [2004, 'cuộc nổi dậy Houthi bùng nổ', 2, Gr], [2018, 'chiến dịch giành Hodeidah', 2, Gr]]);
  ev('CM', [[1958, 'Ruben Um Nyobè bị sát hại', 2, Gr], [1971, 'Ernest Ouandié bị xử tử', 2, Gr], [1992, 'cuộc bầu cử tổng thống đa đảng đầu tiên', 2], [2008, 'bạo loạn vì giá lương thực và nhiên liệu', 2, Gr]]);
  ev('TZ', [[1977, 'thành lập đảng Chama Cha Mapinduzi', 2], [1983, 'chiến dịch trấn áp "kẻ phá hoại kinh tế"', 2], [1992, 'bãi bỏ chế độ độc đảng', 2], [2001, 'cảnh sát đàn áp biểu tình ở Zanzibar', 2, Gr], [2005, 'Jakaya Kikwete đắc cử', 2]]);
  ev('UG', [[1966, 'khủng hoảng Mengo, Obote tấn công cung của Kabaka', 2, Gr], [1987, 'phong trào Thánh Linh của Alice Lakwena tan rã', 2], [1995, 'ban hành hiến pháp mới', 2], [1996, 'cuộc bầu cử tổng thống trực tiếp đầu tiên', 2], [2006, 'bầu cử đa đảng đầu tiên sau nhiều năm', 2], [2018, 'Bobi Wine bị bắt, biểu tình ở Kampala', 2, Gr], [2021, 'bầu cử bị cắt internet', 2, Gr]]);
  ev('CD', [[1966, 'đổi tên Léopoldville thành Kinshasa', 1], [1973, 'chính sách "Zaire hóa" tịch thu cơ sở kinh doanh', 2, Gr], [1992, 'giáo dân diễu hành đòi mở lại Hội nghị Quốc gia bị đàn áp', 2, Gr], [1999, 'ký hiệp định ngừng bắn Lusaka', 2], [2005, 'trưng cầu dân ý về hiến pháp', 2], [2011, 'bầu cử tổng thống gây tranh cãi', 2, Gr], [2016, 'biểu tình chống hoãn bầu cử bị đàn áp', 2, Gr], [2023, 'Tshisekedi tái đắc cử', 2]]);
})(globalThis.G);
