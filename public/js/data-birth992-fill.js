/* Một Đời — 9.9.2 bổ sung sự kiện thật (đợt 2): nâng các nước còn mỏng, thêm thể thao, văn hóa, khoa học, đời sống để cân bằng với chuyện chính trị và thảm họa.
   Cùng quy tắc chống trùng với data-birth989-more.js. Nguồn thứ cấp, đối chiếu 25/11/2026. */
(function (G) {
  'use strict';
  var D = G.BIRTH987 || (G.BIRTH987 = { ERA: {}, EV: {}, WORLD: [] });
  var STOP = { 'năm': 1, 'của': 1, 'được': 1, 'những': 1, 'người': 1, 'trong': 1, 'cho': 1, 'với': 1, 'các': 1, 'một': 1, 'lần': 1, 'đầu': 1, 'tiên': 1, 'lớn': 1 };
  function wd(t) { return String(t).toLowerCase().split(/[^\p{L}\d]+/u).filter(function (x) { return x.length >= 3 && !STOP[x]; }); }
  function dup(c, r) { var a = wd(r[1]); return (D.EV[c] || []).some(function (e) { if (e[0] !== r[0]) return false; var b = wd(e[1]); return e[1] === r[1] || a.filter(function (x) { return b.indexOf(x) >= 0; }).length >= 2; }); }
  function ev(c, rows) { rows.forEach(function (r) { if (!dup(c, r)) (D.EV[c] || (D.EV[c] = [])).push([r[0], r[1], r[2] || 1, r[3] || '']); }); }
  var J = 'joy', Gr = 'grief';

  ev('AD', [[1934, 'Boris Skossyreff tự xưng vua Andorra rồi bị trục xuất', 1], [1981, 'lập Hội đồng Điều hành, bước đầu tách quyền hành chính', 1], [1994, 'Andorra gia nhập Hội đồng châu Âu', 1], [2003, 'hai khu trượt tuyết sáp nhập thành Grandvalira', 1, J]]);
  ev('BS', [[1967, 'lần đầu người da màu cầm quyền sau cuộc bầu cử tháng Một', 2, J], [1998, 'khu nghỉ dưỡng Atlantis ở Paradise Island khai trương', 1], [2012, 'đội tiếp sức 4x400 m nam giành huy chương vàng Olympic London', 2, J], [2016, 'Shaunae Miller về đích bằng cú ngã người, giành vàng 400 m Olympic Rio', 2, J]]);
  ev('BB', [[1951, 'phổ thông đầu phiếu được áp dụng', 1, J], [1975, 'cầu thủ Barbados góp công đội tuyển Tây Ấn vô địch Cricket World Cup đầu tiên', 1, J], [2018, 'Mia Mottley trở thành nữ thủ tướng đầu tiên', 2, J]]);
  ev('BZ', [[1961, 'bão Hattie tàn phá thành phố Belize, quyết định dời thủ đô', 2, Gr], [1970, 'thủ đô mới Belmopan bắt đầu hoạt động', 1], [1973, 'đổi tên từ Honduras thuộc Anh thành Belize', 1], [1996, 'Hệ thống rạn san hô chắn Belize được UNESCO công nhận', 1, J]]);
  ev('BJ', [[1996, 'Mathieu Kérékou trở lại làm tổng thống qua bầu cử', 1], [2006, 'Thomas Boni Yayi thắng cử, tổng thống không thuộc nhóm chính khách cũ', 1]]);
  ev('BT', [[1974, 'Bhutan đón nhóm du khách nước ngoài đầu tiên nhân lễ đăng quang', 1, J], [2008, 'lễ đăng quang của vua Jigme Khesar Namgyel Wangchuck', 2, J], [2011, 'đám cưới hoàng gia ở Punakha', 1, J]]);
  ev('BW', [[1971, 'mỏ kim cương Orapa bắt đầu khai thác', 1, J], [1982, 'mỏ Jwaneng, một trong những mỏ kim cương giàu nhất, khánh thành', 2, J], [1998, 'tiểu thuyết đặt ở Gaborone về nữ thám tử Mma Ramotswe ra mắt', 1, J], [2014, 'châu thổ Okavango được UNESCO công nhận di sản', 1, J]]);
  ev('BN', [[1967, 'Sultan Omar Ali Saifuddien thoái vị nhường ngôi cho con trai', 1], [1968, 'lễ đăng quang của Sultan Hassanal Bolkiah', 1, J], [1991, 'tư tưởng "Quân chủ Hồi giáo Mã Lai" trở thành triết lý quốc gia', 1]]);
  ev('CV', [[1988, 'Cesária Évora ra album đầu tiên vang tiếng ở Pháp', 1, J], [2004, 'Cesária Évora thắng giải Grammy', 1, J], [2008, 'Cabo Verde rời danh sách các nước kém phát triển nhất', 2, J]]);
  ev('CF', [[1996, 'các cuộc binh biến liên tiếp ở Bangui', 1, Gr], [2020, 'Touadéra tái đắc cử giữa bất ổn', 1]]);
  ev('KM', [[1997, 'đảo Anjouan tuyên bố ly khai', 1], [2001, 'hiến pháp lập Liên minh Comoros', 1], [2008, 'quân Liên minh châu Phi và Comoros chiếm lại Anjouan', 1]]);
  ev('CG', [[1979, 'Denis Sassou Nguesso lên nắm quyền lần đầu', 1], [2021, 'Sassou Nguesso tái đắc cử', 1]]);
  ev('CR', [[1949, 'phụ nữ được đi bầu', 1, J], [1963, 'núi lửa Irazú phun trào đúng lúc Tổng thống Mỹ Kennedy thăm', 1], [1968, 'núi lửa Arenal đột ngột phun trào', 2, Gr], [1990, 'đội tuyển lần đầu dự World Cup và vào vòng 16 đội', 1, J], [2010, 'Laura Chinchilla trở thành nữ tổng thống đầu tiên', 2, J], [2014, 'đội tuyển vào tứ kết World Cup', 2, J]]);
  ev('CY', [[1955, 'phong trào EOKA phát động đấu tranh đòi liên kết với Hy Lạp', 2], [1964, 'lực lượng gìn giữ hòa bình Liên Hợp Quốc đến đảo', 2], [2003, 'các điểm qua lại trên Lằn ranh Xanh lần đầu mở sau 29 năm', 2, J]]);
  ev('DJ', [[1992, 'hiến pháp mở đường cho đa đảng', 1], [2006, 'cảng Doraleh được nhượng quyền cho nhà khai thác nước ngoài', 1], [2010, 'sửa hiến pháp cho phép nhiệm kỳ thứ ba', 1]]);
  ev('DM', [[1980, 'Eugenia Charles trở thành nữ thủ tướng đầu tiên của vùng Caribe', 2, J], [1981, 'âm mưu đảo chính bị đẩy lùi', 1]]);
  ev('DO', [[1930, 'bão San Zenón tàn phá Santo Domingo', 2, Gr], [1966, 'Joaquín Balaguer thắng cử, thời kỳ dài của ông bắt đầu', 1], [1992, 'Hải đăng Colón khánh thành nhân dịp 500 năm', 1], [1998, 'Sammy Sosa và cuộc đua kỷ lục home run trên đất Mỹ', 1, J]]);
  ev('GQ', [[2004, 'âm mưu đảo chính bằng lính đánh thuê bị phát hiện', 1], [2012, 'Guinea Xích Đạo cùng Gabon đồng đăng cai Cúp châu Phi', 1, J]]);
  ev('SZ', [[2005, 'hiến pháp mới ban hành', 1]]);
  ev('FJ', [[1997, 'hiến pháp mới ban hành', 1], [2009, 'hiến pháp bị bãi bỏ', 1], [2014, 'cuộc bầu cử đầu tiên kể từ cuộc đảo chính 2006', 2, J]]);
  ev('FI', [[1906, 'phụ nữ Phần Lan được bầu cử và ứng cử, đầu tiên ở châu Âu', 2, J], [1924, 'Paavo Nurmi thắng năm huy chương vàng ở Olympic Paris', 2, J], [1952, 'Phần Lan trả xong khoản bồi thường chiến tranh', 1], [1975, 'Định ước Helsinki được ký', 2], [1991, 'Linus Torvalds công bố nhân hệ điều hành Linux ở Helsinki', 2, J], [2000, 'Tarja Halonen trở thành nữ tổng thống đầu tiên', 2, J], [2002, 'Phần Lan dùng đồng euro', 1]]);
  ev('GA', [[1913, 'Albert Schweitzer lập bệnh viện ở Lambaréné', 2, J], [2012, 'Gabon cùng Guinea Xích Đạo đồng đăng cai Cúp châu Phi', 1, J], [2017, 'Gabon đăng cai Cúp châu Phi', 1]]);
  ev('GM', [[1981, 'âm mưu đảo chính tháng Bảy bị đẩy lùi với sự giúp đỡ của Senegal', 1], [2000, 'sinh viên biểu tình bị đàn áp, hơn chục người chết', 1, Gr]]);
  ev('GE', [[1978, 'biểu tình bảo vệ tiếng Georgia ở Tbilisi', 1, J], [1992, 'chiến tranh Abkhazia bắt đầu', 2, Gr], [2012, 'Bidzina Ivanishvili thắng bầu cử quốc hội, lần đầu đổi chính quyền qua bầu cử', 1], [2018, 'Salome Zourabichvili trở thành nữ tổng thống đầu tiên', 1, J]]);
  ev('GD', [[1951, 'phổ thông đầu phiếu được áp dụng', 1], [2005, 'bão Emily đổ vào đảo', 1, Gr], [2012, 'Kirani James giành huy chương vàng chạy 400 m Olympic London', 2, J]]);
  ev('GW', [[1980, 'João Bernardo Vieira nắm quyền sau đảo chính', 1], [1999, 'Vieira bị quân đội phế truất', 1], [2009, 'Tổng thống Vieira bị sát hại', 1, Gr]]);
  ev('GY', [[1953, 'Anh đình chỉ hiến pháp sau thắng cử của Cheddi Jagan', 1], [1980, 'nhà sử học Walter Rodney bị ám sát', 1, Gr], [1985, 'Forbes Burnham qua đời', 1], [2005, 'lũ lụt nặng ở khu duyên hải', 1, Gr], [2019, 'khai thác dầu ngoài khơi bắt đầu', 2]]);
  ev('HT', [[1964, 'François Duvalier tự phong tổng thống trọn đời', 1], [1990, 'Jean-Bertrand Aristide thắng cử', 2, J], [1994, 'Aristide trở lại nắm quyền với sự hỗ trợ của Mỹ', 1], [2008, 'giá lương thực tăng làm bạo loạn, rồi bốn trận bão liên tiếp', 1, Gr], [2016, 'bão Matthew tàn phá miền nam', 2, Gr], [2021, 'động đất ngày 14/8 làm hơn 2.000 người chết', 2, Gr]]);
  ev('VA', [[1958, 'Pius XII qua đời, Gioan XXIII được bầu', 2], [1981, 'Gioan Phaolô II bị bắn ở quảng trường Thánh Phêrô', 2, Gr], [1998, 'Gioan Phaolô II thăm Cuba', 1], [2000, 'Năm Thánh, hàng chục triệu người hành hương', 2, J]]);
  ev('HN', [[1954, 'cuộc đình công lớn ở các đồn điền chuối', 1], [1982, 'đội tuyển lần đầu dự World Cup', 1, J], [2017, 'bầu cử tranh cãi, biểu tình kéo dài', 1, Gr]]);
  ev('HU', [[1938, 'Đại hội Thánh Thể quốc tế ở Budapest', 1], [1953, 'Hungary thắng Anh 6–3 ngay tại Wembley', 2, J], [1954, 'Hungary thua chung kết World Cup trước Tây Đức', 2, Gr], [1974, 'Ernő Rubik phát minh ra khối lập phương Rubik', 2, J], [1991, 'quân Liên Xô rút khỏi Hungary', 2, J], [2000, 'sự cố tràn xyanua ở sông Tisza', 1, Gr], [2010, 'bùn đỏ tràn từ nhà máy nhôm ở Ajka làm chết mười người', 2, Gr]]);
  ev('IS', [[1975, 'Ngày nghỉ của phụ nữ 24/10, đa số phụ nữ ngừng làm việc', 2, J], [1976, 'Cuộc chiến cá tuyết kết thúc với Anh', 1], [2016, 'đội tuyển bóng đá vào tứ kết Euro với tiếng hô Viking', 2, J], [2018, 'lần đầu dự World Cup', 1, J], [2021, 'núi lửa Fagradalsfjall phun trào', 1], [2023, 'thị trấn Grindavík phải sơ tán vì nguy cơ phun trào', 1, Gr]]);
  ev('KW', [[1938, 'phát hiện mỏ dầu Burgan', 2], [1962, 'hiến pháp ban hành, quốc hội đầu tiên', 1], [1982, 'sụp đổ thị trường chứng khoán không chính thức Souk Al-Manakh', 1, Gr], [2006, 'Sabah al-Ahmad lên làm tiểu vương', 1]]);
  ev('KG', [[1916, 'khởi nghĩa Urkun chống nghĩa vụ lao động thời Đế quốc Nga', 2, Gr], [1990, 'xung đột sắc tộc ở Osh', 1, Gr], [2021, 'Sadyr Japarov thắng cử tổng thống', 1]]);
  ev('LA', [[1960, 'đảo chính của Kong Le ở Vientiane', 1], [1973, 'hiệp định Vientiane ngừng bắn', 1], [1994, 'cầu Hữu nghị Thái – Lào khánh thành', 2, J], [2016, 'Lào làm chủ tịch ASEAN', 1]]);
  ev('LV', [[1905, 'cách mạng 1905, nổi dậy ở Riga và nông thôn', 1], [1934, 'Kārlis Ulmanis đảo chính', 1], [1991, 'những chiếc rào chắn tháng Một ở Riga', 2], [2009, 'khủng hoảng kinh tế nặng, bạo loạn ở Riga', 1, Gr]]);
  ev('LS', [[2014, 'âm mưu đảo chính tháng Tám', 1]]);
  ev('LI', [[1995, 'Liechtenstein gia nhập Khu vực Kinh tế châu Âu', 1], [2003, 'trưng cầu dân ý mở rộng quyền lực của hoàng thân', 1], [2004, 'hoàng tử Alois được trao quyền điều hành hằng ngày', 1]]);
  ev('LU', [[1944, 'Luxembourg được quân Mỹ giải phóng tháng Chín', 2, J], [1961, 'Jean-Claude Pascal thắng Eurovision cho Luxembourg', 1, J], [1965, 'France Gall thắng Eurovision cho Luxembourg', 1, J], [2000, 'đại công tước Henri lên ngôi', 1]]);
  ev('MW', [[1915, 'cuộc nổi dậy của John Chilembwe', 1], [1958, 'Hastings Banda về nước dẫn dắt phong trào đòi độc lập', 2, J], [2005, 'thiếu lương thực nghiêm trọng', 1, Gr]]);
  ev('MV', [[1978, 'Maumoon Abdul Gayoom lên làm tổng thống, cầm quyền ba thập niên', 1], [2012, 'Tổng thống Nasheed từ chức', 1], [2018, 'Ibrahim Solih thắng cử', 1]]);
  ev('MU', [[1999, 'bạo loạn sau cái chết của ca sĩ Kaya', 1, Gr]]);
  ev('MC', [[1962, 'hiến pháp mới', 1], [1963, 'căng thẳng với Pháp về thuế', 1], [1997, 'kỷ niệm 700 năm dòng họ Grimaldi cai trị', 1, J], [2011, 'đám cưới của Hoàng tử Albert', 2, J]]);
  ev('MN', [[1921, 'cách mạng nhân dân ngày 11/7', 2], [1961, 'Mông Cổ gia nhập Liên Hợp Quốc', 1], [2006, 'kỷ niệm 800 năm nhà nước Mông Cổ', 2, J], [2008, 'bạo loạn sau bầu cử ở Ulaanbaatar', 1, Gr]]);
  ev('NI', [[1912, 'lính thủy đánh bộ Mỹ vào Nicaragua', 1, Gr], [1934, 'Augusto Sandino bị sát hại', 2, Gr], [1956, 'Anastasio Somoza García bị ám sát', 1], [2007, 'Daniel Ortega trở lại làm tổng thống', 1]]);
  ev('NO', [[1952, 'Thế vận hội mùa đông ở Oslo', 2, J], [1972, 'trưng cầu dân ý bác gia nhập Cộng đồng châu Âu', 1], [1993, 'đàm phán bí mật ở Oslo dẫn tới hiệp định Israel – Palestine', 2], [1994, 'Na Uy lại bác gia nhập Liên minh châu Âu', 1], [2018, 'Na Uy dẫn đầu bảng huy chương Thế vận hội mùa đông', 1, J]]);
  ev('PG', [[1997, 'khủng hoảng Sandline về lính đánh thuê ở Bougainville', 1], [2018, 'Port Moresby đăng cai hội nghị APEC', 1], [2024, 'Giáo hoàng Phanxicô thăm Papua New Guinea', 1, J]]);
  ev('SR', [[1987, 'hiến pháp mới được thông qua', 1], [2020, 'Chan Santokhi thắng cử', 1]]);
  ev('TT', [[1956, 'Eric Williams và đảng PNM thắng cử', 2], [1994, 'Brian Lara lập kỷ lục 375 điểm trong một lượt Test cricket', 2, J], [1995, 'Basdeo Panday là thủ tướng gốc Ấn đầu tiên', 1], [2004, 'Brian Lara lập kỷ lục 400 điểm không bị loại', 2, J]]);
  ev('UZ', [[1937, 'đàn áp lớn nhắm vào giới tinh hoa Uzbekistan', 2, Gr], [1989, 'bạo lực sắc tộc ở thung lũng Fergana', 1, Gr], [1999, 'đánh bom ở Tashkent', 1, Gr]]);
  ev('UY', [[1971, 'Mặt trận Rộng cánh tả ra đời', 1], [2005, 'Tabaré Vázquez, chính phủ cánh tả đầu tiên', 2], [2010, 'đội tuyển vào bán kết World Cup, José Mujica nhậm chức', 2, J], [2011, 'Uruguay vô địch Copa América', 2, J]]);
})(globalThis.G);
