/* Một Đời — 9.10.0 bổ sung sự kiện thật (đợt 3, châu Phi): nâng các nước còn mỏng, thêm thể thao, văn hóa, đời sống.
   Cùng quy tắc chống trùng với data-birth989-more.js. Nguồn thứ cấp, đối chiếu 25/11/2026. */
(function (G) {
  'use strict';
  var D = G.BIRTH987 || (G.BIRTH987 = { ERA: {}, EV: {}, WORLD: [] });
  var STOP = { 'năm': 1, 'của': 1, 'được': 1, 'những': 1, 'người': 1, 'trong': 1, 'cho': 1, 'với': 1, 'các': 1, 'một': 1, 'lần': 1, 'đầu': 1, 'tiên': 1, 'lớn': 1 };
  function wd(t) { return String(t).toLowerCase().split(/[^\p{L}\d]+/u).filter(function (x) { return x.length >= 3 && !STOP[x]; }); }
  function dup(c, r) { var a = wd(r[1]); return (D.EV[c] || []).some(function (e) { if (e[0] !== r[0]) return false; var b = wd(e[1]); return e[1] === r[1] || a.filter(function (x) { return b.indexOf(x) >= 0; }).length >= 2; }); }
  function ev(c, rows) { rows.forEach(function (r) { if (!dup(c, r)) (D.EV[c] || (D.EV[c] = [])).push([r[0], r[1], r[2] || 1, r[3] || '']); }); }
  var J = 'joy', Gr = 'grief';

  ev('TZ', [[1964, 'cách mạng Zanzibar lật đổ vương triều Sultan', 2], [1974, 'Filbert Bayi phá kỷ lục thế giới 1.500 m ở Christchurch', 1, J], [2015, 'John Magufuli thắng cử tổng thống', 1]]);
  ev('UG', [[1972, 'John Akii-Bua giành vàng 400 m rào ở Munich', 1, J], [1993, 'vương quốc Buganda được phục hồi, Kabaka Mutebi lên ngôi', 1, J], [2012, 'Stephen Kiprotich giành vàng marathon ở London', 1, J]]);
  ev('AO', [[1976, 'Angola được kết nạp vào Liên Hợp Quốc', 1], [2006, 'lần đầu đội tuyển dự World Cup', 1, J], [2008, 'bầu cử quốc hội đầu tiên sau nội chiến', 1]]);
  ev('NE', [[1991, 'hội nghị quốc gia chủ quyền mở đường cho đa đảng', 1], [1996, 'quân đội đảo chính do Ibrahim Baré Maïnassara cầm đầu', 1], [2011, 'Mahamadou Issoufou thắng cử sau thời kỳ quân quản', 1]]);
  ev('ML', [[1960, 'Liên bang Mali với Senegal tan vỡ sau vài tháng', 1], [2002, 'đăng cai Cúp châu Phi', 1, J]]);
  ev('CM', [[1972, 'đăng cai Cúp châu Phi tại Yaoundé', 1, J], [2000, 'đội bóng đá giành huy chương vàng Olympic Sydney', 2, J]]);
  ev('SO', [[1964, 'chiến sự biên giới với Ethiopia', 1, Gr], [2000, 'hội nghị Arta ở Djibouti lập chính phủ chuyển tiếp', 1], [2022, 'Hassan Sheikh Mohamud trở lại làm tổng thống', 1]]);
  ev('CI', [[1990, 'thánh đường Đức Bà Hòa Bình ở Yamoussoukro được thánh hiến', 1], [1992, 'đội tuyển vô địch Cúp châu Phi ở Dakar sau loạt luân lưu', 2, J], [2000, 'Laurent Gbagbo lên nắm quyền sau bầu cử hỗn loạn', 1]]);
  ev('TD', [[1996, 'cuộc bầu cử tổng thống đa đảng đầu tiên', 1], [2010, 'Chad và Sudan bình thường hóa quan hệ', 1], [2018, 'hiến pháp mới tăng quyền tổng thống', 1]]);
  ev('BF', [[1966, 'Sangoulé Lamizana nắm quyền sau biểu tình', 1], [1980, 'đảo chính quân sự của đại tá Zerbo', 1], [2013, 'đội tuyển vào chung kết Cúp châu Phi', 1, J], [2015, 'đảo chính hụt rồi sụp đổ nhanh', 1]]);
  ev('ZM', [[1969, 'cải cách Mulungushi, quốc hữu hóa các mỏ đồng', 1], [1976, 'đường sắt Tazara nối Zambia với cảng Dar es Salaam được bàn giao', 2], [2011, 'Michael Sata thắng cử tổng thống', 1]]);
  ev('MW', [[1993, 'trưng cầu dân ý chọn chế độ đa đảng', 2], [2004, 'Bingu wa Mutharika thắng cử', 1], [2014, 'Peter Mutharika thắng cử tổng thống', 1]]);
  ev('SN', [[1966, 'Liên hoan Nghệ thuật Da đen thế giới đầu tiên ở Dakar', 2, J], [1979, 'cuộc đua Paris–Dakar đầu tiên đến đích', 1, J], [2019, 'đội tuyển vào chung kết Cúp châu Phi', 1, J], [2021, 'biểu tình dữ dội sau vụ bắt Ousmane Sonko', 1, Gr]]);
  ev('GN', [[1973, 'Amílcar Cabral bị ám sát ở Conakry', 2, Gr], [1993, 'cuộc bầu cử đa đảng đầu tiên', 1], [2010, 'Alpha Condé thắng cử tổng thống', 1], [2020, 'trưng cầu dân ý đổi hiến pháp gây biểu tình', 1, Gr]]);
  ev('ZW', [[1980, 'đội khúc côn cầu nữ giành vàng Olympic Moscow', 2, J], [2004, 'Kirsty Coventry giành vàng 200 m ngửa ở Athens', 1, J]]);
  ev('BJ', [[1989, 'chính quyền từ bỏ chủ nghĩa Mác–Lênin', 1], [2011, 'Boni Yayi tái đắc cử', 1], [2019, 'bầu cử quốc hội không có phe đối lập', 1, Gr]]);
  ev('BI', [[1966, 'chế độ quân chủ bị bãi bỏ sau đảo chính', 1], [1976, 'Jean-Baptiste Bagaza nắm quyền sau đảo chính', 1], [1987, 'Pierre Buyoya đảo chính', 1], [2018, 'trưng cầu dân ý đổi hiến pháp', 1]]);
  ev('RW', [[1973, 'Juvénal Habyarimana nắm quyền sau đảo chính', 1], [2010, 'Kagame tái đắc cử', 1], [2015, 'trưng cầu dân ý cho phép kéo dài nhiệm kỳ', 1], [2018, 'Arsenal ký tài trợ "Visit Rwanda"', 1, J]]);
  ev('SS', [[1972, 'hiệp định Addis Ababa chấm dứt cuộc nội chiến đầu tiên của Sudan', 2], [1983, 'cuộc nội chiến thứ hai bùng nổ, SPLA ra đời', 2, Gr], [2011, 'trưng cầu dân ý tháng Một, gần 99% chọn tách ra khỏi Sudan', 2], [2012, 'Guor Marial chạy marathon Olympic London dưới cờ Olympic', 1, J], [2016, 'giao tranh ở Juba tháng Bảy', 2, Gr], [2016, 'lần đầu có đoàn vận động viên dự Olympic Rio', 1, J]]);
  ev('TG', [[1991, 'hội nghị quốc gia đòi đa đảng', 1], [1992, 'trưng cầu dân ý thông qua hiến pháp', 1], [2006, 'lần đầu đội tuyển dự World Cup', 1, J], [2008, 'Benjamin Boukpeti giành huy chương Olympic đầu tiên', 1, J], [2010, 'xe đội tuyển bị tấn công ở Cabinda trước Cúp châu Phi', 2, Gr], [2020, 'Faure Gnassingbé tái đắc cử', 1]]);
  ev('SL', [[1967, 'đảo chính quân sự sau bầu cử sít sao', 1], [1971, 'tuyên bố thành nước cộng hòa', 1], [1996, 'Ahmad Tejan Kabbah thắng cử', 1], [2007, 'Ernest Koroma thắng cử', 1], [2018, 'Julius Maada Bio thắng cử', 1]]);
  ev('CF', [[1993, 'Ange-Félix Patassé thắng cử đa đảng', 1], [2015, 'Giáo hoàng Phanxicô thăm Bangui', 2, J], [2016, 'Faustin-Archange Touadéra thắng cử', 1]]);
  ev('CG', [[1968, 'Marien Ngouabi đảo chính', 1], [1972, 'đội tuyển vô địch Cúp châu Phi', 2, J], [1991, 'hội nghị quốc gia ở Brazzaville', 1], [2015, 'trưng cầu dân ý đổi hiến pháp', 1]]);
  ev('LR', [[1926, 'tập đoàn Firestone mở đồn điền cao su ở Harbel', 1], [1944, 'William Tubman nhậm chức, cầm quyền gần ba thập niên', 1], [1979, 'biểu tình giá gạo ở Monrovia', 2, Gr], [1990, 'Samuel Doe bị bắt và giết', 2, Gr]]);
  ev('MR', [[1957, 'Nouakchott được chọn làm thủ đô tương lai', 1], [1984, 'Maaouya Ould Taya đảo chính', 1], [1989, 'xung đột với Senegal, hàng chục nghìn người phải rời đi', 2, Gr], [2005, 'đảo chính lật Ould Taya', 1], [2014, 'Mohamed Ould Abdel Aziz tái đắc cử', 1]]);
  ev('TN', [[1961, 'khủng hoảng Bizerte với Pháp', 2, Gr], [1964, 'quốc hữu hóa đất của người nước ngoài', 1], [2002, 'đánh bom giáo đường Do Thái ở Djerba', 2, Gr], [2004, 'đội tuyển vô địch Cúp châu Phi trên sân nhà', 1, J]]);
  ev('ER', [[1941, 'quân Anh chiếm Keren, đánh bại quân Ý', 2], [1962, 'Ethiopia sáp nhập Eritrea', 2, Gr], [2001, 'đàn áp báo chí độc lập và các nhà cải cách', 1, Gr], [2015, 'Daniel Teklehaimanot mặc áo núi ở Tour de France', 1, J]]);
  ev('GM', [[1996, 'trưng cầu dân ý và bầu cử, Yahya Jammeh đắc cử', 1], [2013, 'rút khỏi Khối Thịnh vượng chung', 1], [2018, 'Ủy ban Sự thật, Hòa giải và Bồi thường được thành lập', 1], [2021, 'Adama Barrow tái đắc cử', 1]]);
  ev('NA', [[1959, 'đụng độ ở khu Old Location Windhoek', 2, Gr], [1971, 'Tòa án Công lý Quốc tế phán việc Nam Phi chiếm giữ là bất hợp pháp', 1], [1989, 'bầu cử dưới sự giám sát của Liên Hợp Quốc', 2], [1992, 'Frankie Fredericks giành hai huy chương Olympic đầu tiên của Namibia', 1, J]]);
  ev('GA', [[1964, 'đảo chính hụt bị quân Pháp can thiệp dập tắt', 1], [2018, 'Ali Bongo bị đột quỵ ở Riyadh', 1], [2019, 'đảo chính hụt tháng Một', 1]]);
  ev('GW', [[1994, 'cuộc bầu cử đa đảng đầu tiên', 2], [2005, 'Vieira trở lại làm tổng thống', 1], [2014, 'José Mário Vaz thắng cử', 1], [2019, 'Umaro Sissoco Embaló thắng cử', 1]]);
})(globalThis.G);
