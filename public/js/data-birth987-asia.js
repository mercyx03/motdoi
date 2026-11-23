/* Một Đời — 9.8.8 dữ liệu bối cảnh theo nước và năm: Việt Nam, Đông Á, Đông Nam Á, Nam Á, Trung Á.
   [từ, đến, giai đoạn, đời sống thường ngày] và [năm, sự kiện, mức 1|2, 'joy'|'grief'|'']. Nguồn thứ cấp (bách khoa, báo chí), đối chiếu 23/11/2026. */
(function (G) {
  'use strict';
  var D = G.BIRTH987 || (G.BIRTH987 = { ERA: {}, EV: {}, WORLD: [] });
  function add(cc, eras, evs) { D.ERA[cc] = (D.ERA[cc] || []).concat(eras); D.EV[cc] = (D.EV[cc] || []).concat(evs || []); }

  add('VN', [
    [1900, 1929, 'Pháp thuộc, khai thác thuộc địa', 'Phần lớn người dân sống ở làng xã, làm ruộng và nộp thuế thân, thuế ruộng; đồn điền cao su, mỏ than và đường sắt xuyên Đông Dương mọc lên bằng sức người làm thuê'],
    [1930, 1939, 'khủng hoảng kinh tế và phong trào cách mạng', 'Giá lúa gạo sụt mạnh sau khủng hoảng thế giới, nông dân mất ruộng vì nợ; các phong trào đấu tranh và báo chí công khai nở rộ cuối thập niên'],
    [1940, 1945, 'Nhật – Pháp cùng cai trị Đông Dương', 'Lúa bị thu mua bắt buộc, nhiều nơi bị ép nhổ lúa trồng đay; thiếu ăn lan rộng ở miền Bắc'],
    [1946, 1954, 'kháng chiến chống Pháp', 'Nhiều gia đình tản cư khỏi thành phố, vùng tự do và vùng tạm chiếm xen kẽ; trường học, chợ búa hoạt động trong thời chiến'],
    [1955, 1975, 'đất nước chia cắt hai miền', 'Miền Bắc xây dựng hợp tác xã và kinh tế kế hoạch, miền Nam theo kinh tế thị trường có viện trợ Mỹ; chiến tranh leo thang từ giữa thập niên 1960, nhiều gia đình có người ra trận'],
    [1976, 1985, 'thống nhất và thời bao cấp', 'Hàng hóa mua bằng tem phiếu, xếp hàng mua gạo, dầu, vải; lương thấp, nhiều nhà làm thêm, nuôi lợn, trồng rau để sống; chiến tranh biên giới hai đầu đất nước'],
    [1986, 1995, 'Đổi mới, xóa bỏ bao cấp', 'Chợ búa đầy hàng hơn, kinh tế tư nhân và hộ gia đình được làm ăn; những năm đầu lạm phát rất cao, từ đầu thập niên 1990 đời sống khá dần'],
    [1996, 2006, 'công nghiệp hóa và mở cửa hội nhập', 'Xe máy thay xe đạp, khu công nghiệp thu hút lao động từ nông thôn; điện thoại di động và Internet xuất hiện ở thành phố'],
    [2007, 2019, 'hội nhập sau khi vào WTO', 'Đô thị lớn mở rộng nhanh, điện thoại thông minh và mạng xã hội phổ biến; nhiều người trẻ làm nhà máy, văn phòng hoặc buôn bán trực tuyến'],
    [2020, 2021, 'đại dịch COVID-19', 'Học trực tuyến, giãn cách xã hội, nhiều người mất việc hoặc về quê; tiêm vắc-xin đại trà năm 2021'],
    [2022, 2025, 'phục hồi và chuyển đổi số', 'Thanh toán bằng điện thoại, đường cao tốc và đường sắt đô thị mở rộng; năm 2025 tinh gọn bộ máy và sắp xếp lại đơn vị hành chính']
  ], [
    [1905, 'phong trào Đông Du đưa thanh niên sang Nhật học', 1, ''], [1907, 'Đông Kinh Nghĩa Thục mở trường dạy học ở Hà Nội', 1, ''], [1911, 'Nguyễn Tất Thành rời bến Nhà Rồng ra nước ngoài', 1, ''],
    [1930, 'khởi nghĩa Yên Bái và sự ra đời của Đảng Cộng sản Việt Nam', 2, ''], [1940, 'quân Nhật vào Đông Dương; khởi nghĩa Nam Kỳ', 1, 'grief'],
    [1945, 'nạn đói đầu năm ở miền Bắc; Cách mạng tháng Tám và Tuyên ngôn độc lập ngày 2/9', 2, ''], [1946, 'toàn quốc kháng chiến từ đêm 19/12', 2, 'grief'],
    [1954, 'chiến thắng Điện Biên Phủ; Hiệp định Genève chia cắt đất nước ở vĩ tuyến 17, gần một triệu người di cư vào Nam', 2, ''],
    [1963, 'đảo chính lật đổ chính quyền Ngô Đình Diệm ở Sài Gòn', 1, ''], [1964, 'sự kiện Vịnh Bắc Bộ', 1, ''],
    [1965, 'Mỹ đưa quân chiến đấu vào miền Nam và ném bom miền Bắc', 2, 'grief'], [1968, 'tổng tiến công Tết Mậu Thân', 2, 'grief'], [1969, 'Chủ tịch Hồ Chí Minh qua đời', 2, 'grief'],
    [1972, 'mùa hè đỏ lửa; máy bay B-52 ném bom Hà Nội, Hải Phòng dịp cuối năm', 2, 'grief'], [1973, 'Hiệp định Paris được ký, quân Mỹ rút', 2, ''], [1975, 'chiến tranh kết thúc ngày 30/4, đất nước thống nhất', 2, ''],
    [1976, 'Quốc hội chung đặt tên nước Cộng hòa Xã hội Chủ nghĩa Việt Nam', 1, ''], [1977, 'Việt Nam gia nhập Liên Hợp Quốc', 1, 'joy'], [1978, 'chiến tranh biên giới Tây Nam; làn sóng người vượt biển', 2, 'grief'],
    [1979, 'chiến tranh biên giới phía Bắc nổ ra tháng 2', 2, 'grief'], [1981, 'khoán sản phẩm đến nhóm và người lao động (khoán 100) trong nông nghiệp', 1, ''],
    [1985, 'cuộc tổng điều chỉnh giá – lương – tiền và đổi tiền, lạm phát tăng vọt', 2, 'grief'], [1986, 'Đại hội VI khởi xướng công cuộc Đổi mới', 2, ''],
    [1988, 'khoán 10 giao ruộng cho hộ nông dân; hải chiến Gạc Ma ở Trường Sa', 2, ''], [1989, 'Việt Nam từ nước thiếu lương thực trở thành nước xuất khẩu gạo; quân tình nguyện rút khỏi Campuchia', 1, 'joy'],
    [1991, 'bình thường hóa quan hệ với Trung Quốc', 1, ''], [1994, 'Mỹ dỡ bỏ cấm vận thương mại với Việt Nam', 1, 'joy'], [1995, 'Việt Nam gia nhập ASEAN và bình thường hóa quan hệ với Mỹ', 2, 'joy'],
    [1997, 'Internet chính thức có mặt tại Việt Nam', 1, ''], [1999, 'đại hồng thủy miền Trung', 1, 'grief'], [2000, 'Tổng thống Mỹ Bill Clinton thăm Việt Nam', 1, ''],
    [2003, 'SEA Games 22 tổ chức tại Việt Nam; dịch SARS được khống chế sớm', 1, 'joy'], [2006, 'Hà Nội đăng cai Hội nghị APEC', 1, ''], [2007, 'Việt Nam trở thành thành viên WTO', 2, ''],
    [2008, 'đội tuyển bóng đá vô địch AFF Cup lần đầu; Hà Tây sáp nhập vào Hà Nội', 2, 'joy'], [2010, 'Đại lễ kỷ niệm 1000 năm Thăng Long – Hà Nội', 2, 'joy'],
    [2016, 'sự cố môi trường biển ở bốn tỉnh miền Trung', 1, 'grief'], [2018, 'U23 Việt Nam giành ngôi á quân châu Á; đội tuyển vô địch AFF Cup lần hai', 2, 'joy'],
    [2020, 'đại dịch COVID-19; lũ lịch sử miền Trung', 2, 'grief'], [2021, 'làn sóng dịch thứ tư, TP. Hồ Chí Minh giãn cách kéo dài', 2, 'grief'], [2022, 'SEA Games 31 tổ chức tại Hà Nội và các tỉnh lân cận', 1, 'joy'],
    [2024, 'bão Yagi gây thiệt hại nặng ở miền Bắc', 2, 'grief'], [2025, 'kỷ niệm 50 năm thống nhất; cả nước sắp xếp còn 34 tỉnh, thành từ ngày 1/7', 2, '']
  ]);

  add('CN', [
    [1900, 1911, 'cuối triều Thanh', 'Triều đình suy yếu sau các hiệp ước bất bình đẳng; đa số dân làm nông, nạn đói và thiên tai thường xuyên'],
    [1912, 1927, 'Trung Hoa Dân Quốc buổi đầu và thời quân phiệt', 'Các tướng quân phiệt tranh giành từng vùng; phong trào Ngũ Tứ đưa tư tưởng mới vào thành phố'],
    [1928, 1937, 'chính quyền Nam Kinh', 'Thành phố ven biển như Thượng Hải phát triển, nông thôn vẫn nghèo; nội chiến Quốc – Cộng và Nhật chiếm Mãn Châu'],
    [1937, 1949, 'kháng chiến chống Nhật và nội chiến', 'Hàng chục triệu người chạy loạn, lạm phát phi mã cuối thập niên 1940'],
    [1950, 1957, 'những năm đầu nước Cộng hòa Nhân dân', 'Cải cách ruộng đất, công tư hợp doanh; tem phiếu và hộ khẩu bắt đầu gắn chặt người dân với nơi ở'],
    [1958, 1965, 'Đại nhảy vọt và những năm phục hồi', 'Công xã nhân dân, bếp ăn tập thể, luyện thép thủ công; nạn đói lớn 1959–1961'],
    [1966, 1976, 'Cách mạng Văn hóa', 'Trường học đóng cửa nhiều năm, thanh niên thành phố bị đưa về nông thôn; đấu tố và học tập chính trị khắp nơi'],
    [1977, 1991, 'cải cách mở cửa giai đoạn đầu', 'Khôi phục thi đại học, khoán hộ ở nông thôn, đặc khu kinh tế ven biển; chính sách một con nghiêm ngặt'],
    [1992, 2007, 'tăng tốc kinh tế thị trường', 'Hàng trăm triệu lao động nông thôn ra thành phố làm công xưởng; nhà cao tầng, đường cao tốc mọc lên nhanh'],
    [2008, 2019, 'cường quốc kinh tế số', 'Tàu cao tốc, mua sắm và thanh toán qua điện thoại phổ biến; từ 2016 cho phép sinh con thứ hai'],
    [2020, 2022, 'đại dịch và chính sách “không COVID”', 'Xét nghiệm hàng loạt, phong tỏa từng khu dân cư theo đợt'],
    [2023, 2025, 'mở cửa trở lại', 'Kinh tế chậm lại, thị trường nhà đất đi xuống; thanh niên khó tìm việc hơn trước']
  ], [
    [1900, 'phong trào Nghĩa Hòa Đoàn và liên quân tám nước vào Bắc Kinh', 2, 'grief'], [1911, 'Cách mạng Tân Hợi lật đổ nhà Thanh', 2, ''], [1919, 'phong trào Ngũ Tứ', 1, ''],
    [1931, 'Nhật chiếm Mãn Châu; đại lũ sông Dương Tử', 2, 'grief'], [1937, 'chiến tranh Trung – Nhật toàn diện, thảm sát Nam Kinh', 2, 'grief'], [1945, 'Nhật đầu hàng', 2, 'joy'],
    [1949, 'nước Cộng hòa Nhân dân Trung Hoa ra đời', 2, ''], [1958, 'phát động Đại nhảy vọt', 2, ''], [1966, 'bắt đầu Cách mạng Văn hóa', 2, 'grief'], [1971, 'Trung Quốc vào ghế Liên Hợp Quốc', 1, ''],
    [1976, 'động đất Đường Sơn; Mao Trạch Đông qua đời', 2, 'grief'], [1977, 'khôi phục kỳ thi đại học', 2, 'joy'], [1978, 'Hội nghị Trung ương 3 khóa XI mở đầu cải cách', 2, ''], [1980, 'lập đặc khu kinh tế Thâm Quyến; chính sách một con', 2, ''],
    [1989, 'biểu tình và trấn áp ở Thiên An Môn', 2, 'grief'], [1992, 'Đặng Tiểu Bình đi thị sát phía Nam, thúc đẩy kinh tế thị trường', 1, ''], [1997, 'Hồng Kông trở về Trung Quốc', 2, ''], [1999, 'Ma Cao trở về Trung Quốc', 1, ''],
    [2001, 'gia nhập WTO; Bắc Kinh giành quyền đăng cai Olympic', 2, 'joy'], [2003, 'dịch SARS; chuyến bay vào vũ trụ có người lái đầu tiên', 2, ''], [2008, 'động đất Tứ Xuyên; Olympic Bắc Kinh', 2, ''],
    [2010, 'Expo Thượng Hải', 1, 'joy'], [2016, 'chính sách hai con', 1, ''], [2020, 'đại dịch COVID-19 bùng phát từ Vũ Hán', 2, 'grief'], [2022, 'Olympic mùa đông Bắc Kinh; cuối năm dỡ bỏ chính sách không COVID', 2, ''], [2025, 'kỷ niệm 80 năm kết thúc chiến tranh chống Nhật', 1, '']
  ]);

  add('JP', [
    [1900, 1925, 'Minh Trị cuối và Đại Chính', 'Công nghiệp hóa nhanh, đường sắt, trường học phổ cập; thành phố có điện, báo chí và đời sống kiểu phương Tây'],
    [1926, 1945, 'chủ nghĩa quân phiệt và chiến tranh', 'Khủng hoảng nông thôn, quân đội nắm quyền; cuối chiến tranh thành phố bị ném bom, lương thực khan hiếm'],
    [1946, 1954, 'chiếm đóng và tái thiết', 'Chợ đen, nhà cửa đổ nát; hiến pháp mới, cải cách ruộng đất, phụ nữ được đi bầu'],
    [1955, 1973, 'tăng trưởng kinh tế thần kỳ', 'Gia đình mua ti vi, tủ lạnh, máy giặt; người trẻ từ quê lên thành phố làm việc theo tuyển dụng trọn đời'],
    [1974, 1985, 'tăng trưởng ổn định sau khủng hoảng dầu mỏ', 'Ô tô và đồ điện tử Nhật xuất khẩu khắp thế giới; luyện thi đại học khắc nghiệt'],
    [1986, 1991, 'bong bóng kinh tế', 'Giá nhà đất và cổ phiếu tăng vọt, tiệc tùng công ty, du lịch nước ngoài nở rộ'],
    [1992, 2012, 'những thập niên mất mát', 'Kinh tế trì trệ, việc làm hợp đồng ngắn hạn tăng; dân số già đi, sinh ít con'],
    [2013, 2019, 'chính sách Abenomics', 'Du khách quốc tế tăng mạnh, nhiều phụ nữ và người cao tuổi đi làm; thiếu lao động ở nhiều ngành'],
    [2020, 2022, 'đại dịch COVID-19', 'Đeo khẩu trang, làm việc từ xa; Olympic Tokyo dời sang 2021 không có khán giả'],
    [2023, 2025, 'đồng yên yếu và giá cả tăng', 'Lương tăng chậm hơn giá; du lịch quốc tế bùng nổ trở lại']
  ], [
    [1904, 'chiến tranh Nga – Nhật', 2, ''], [1912, 'Thiên hoàng Minh Trị qua đời, mở đầu niên hiệu Đại Chính', 1, ''], [1923, 'đại động đất Kantō tàn phá Tokyo và Yokohama', 2, 'grief'], [1926, 'bắt đầu niên hiệu Chiêu Hòa', 1, ''],
    [1937, 'chiến tranh với Trung Quốc lan rộng', 1, ''], [1941, 'tấn công Trân Châu Cảng, chiến tranh Thái Bình Dương', 2, ''], [1945, 'bom nguyên tử ở Hiroshima và Nagasaki; Nhật đầu hàng', 2, 'grief'],
    [1947, 'hiến pháp mới có hiệu lực', 1, ''], [1952, 'kết thúc thời kỳ chiếm đóng', 1, ''], [1959, 'lễ cưới Thái tử Akihito được truyền hình, ti vi bán chạy', 1, 'joy'], [1960, 'biểu tình lớn phản đối hiệp ước an ninh Mỹ – Nhật', 1, ''],
    [1964, 'Olympic Tokyo và tàu Shinkansen đầu tiên', 2, 'joy'], [1970, 'Expo Osaka', 1, 'joy'], [1973, 'cú sốc dầu mỏ, người dân đổ đi mua giấy vệ sinh', 1, ''], [1989, 'Thiên hoàng Chiêu Hòa qua đời, bắt đầu niên hiệu Bình Thành', 2, ''],
    [1995, 'động đất Kobe; tấn công khí độc ở tàu điện ngầm Tokyo', 2, 'grief'], [2002, 'đồng đăng cai World Cup với Hàn Quốc', 1, 'joy'], [2011, 'động đất, sóng thần và sự cố nhà máy hạt nhân Fukushima', 2, 'grief'],
    [2019, 'bắt đầu niên hiệu Lệnh Hòa', 1, ''], [2021, 'Olympic Tokyo không có khán giả', 1, ''], [2022, 'cựu thủ tướng Abe Shinzō bị ám sát', 1, 'grief'], [2024, 'động đất bán đảo Noto ngày đầu năm', 1, 'grief'], [2025, 'Expo Osaka 2025', 1, 'joy']
  ]);

  add('KR', [
    [1900, 1910, 'Đại Hàn Đế quốc', 'Triều đình nhà Triều Tiên cải cách muộn giữa các cường quốc; Nhật ngày càng khống chế'],
    [1911, 1945, 'Nhật cai trị', 'Ruộng đất và lúa gạo bị khai thác, tiếng Hàn bị hạn chế ở trường học; cuối thời kỳ bị đổi họ tên, bắt lao động và nhập ngũ'],
    [1946, 1960, 'chia cắt, chiến tranh và hậu chiến', 'Nghèo đói, sống nhờ viện trợ; hàng triệu gia đình ly tán sau chiến tranh Triều Tiên'],
    [1961, 1987, 'công nghiệp hóa dưới chính quyền quân sự', 'Nhà máy, đường cao tốc, phong trào Làng mới; giờ làm rất dài, giới nghiêm và kiểm duyệt báo chí'],
    [1988, 1997, 'dân chủ hóa và thịnh vượng', 'Bầu cử trực tiếp, thu nhập tăng, du lịch nước ngoài được tự do; căn hộ chung cư thay nhà truyền thống'],
    [1998, 2002, 'khủng hoảng tài chính châu Á và phục hồi', 'Nhiều người mất việc, dân góp vàng giúp trả nợ nước ngoài; Internet tốc độ cao lan nhanh'],
    [2003, 2019, 'nước công nghệ và làn sóng Hàn Quốc', 'Điện thoại thông minh, phim truyền hình, K-pop lan ra thế giới; áp lực học tập, nhà ở và sinh ít con'],
    [2020, 2022, 'đại dịch COVID-19', 'Xét nghiệm, truy vết và đeo khẩu trang rộng khắp'],
    [2023, 2025, 'tỷ lệ sinh thấp nhất thế giới', 'Già hóa nhanh, giá nhà cao; năm 2024–2025 khủng hoảng chính trị sau lệnh thiết quân luật']
  ], [
    [1910, 'Nhật sáp nhập Triều Tiên', 2, 'grief'], [1919, 'phong trào độc lập 1/3', 2, ''], [1945, 'giải phóng khỏi ách cai trị Nhật', 2, 'joy'], [1948, 'Đại Hàn Dân Quốc thành lập ở miền Nam', 1, ''],
    [1950, 'chiến tranh Triều Tiên bùng nổ', 2, 'grief'], [1953, 'hiệp định đình chiến, hai miền chia cắt', 2, ''], [1960, 'cách mạng tháng Tư lật đổ Lý Thừa Vãn', 1, ''], [1961, 'đảo chính quân sự của Park Chung-hee', 1, ''],
    [1970, 'khánh thành cao tốc Seoul – Busan; phát động phong trào Làng mới', 1, ''], [1979, 'Tổng thống Park Chung-hee bị ám sát', 2, ''], [1980, 'khởi nghĩa dân chủ Gwangju bị đàn áp', 2, 'grief'],
    [1987, 'phong trào dân chủ tháng Sáu, sửa hiến pháp bầu tổng thống trực tiếp', 2, ''], [1988, 'Olympic Seoul', 2, 'joy'], [1997, 'khủng hoảng tài chính, phải vay IMF', 2, 'grief'], [2002, 'đồng đăng cai World Cup, đội nhà vào bán kết', 2, 'joy'],
    [2014, 'thảm họa phà Sewol', 2, 'grief'], [2017, 'Tổng thống Park Geun-hye bị phế truất', 1, ''], [2018, 'Olympic mùa đông Pyeongchang; hội nghị liên Triều', 1, 'joy'], [2020, 'phim Ký sinh trùng đoạt Oscar; đại dịch COVID-19', 1, ''],
    [2022, 'thảm kịch đám đông Itaewon', 1, 'grief'], [2024, 'thiết quân luật ngắn ngủi tháng 12 và luận tội tổng thống', 2, ''], [2025, 'bầu cử tổng thống sớm sau khi Yoon Suk-yeol bị phế truất', 1, '']
  ]);

  add('KP', [
    [1900, 1945, 'triều Triều Tiên cuối và Nhật cai trị', 'Miền bắc bán đảo có mỏ và nhà máy do Nhật xây; người dân bị huy động lao động thời chiến'],
    [1946, 1953, 'chính quyền mới và chiến tranh Triều Tiên', 'Cải cách ruộng đất, rồi chiến tranh tàn phá gần như mọi thành phố'],
    [1954, 1993, 'kinh tế kế hoạch và tập thể hóa', 'Hợp tác xã, phân phối lương thực theo tem phiếu, viện trợ từ Liên Xô và Trung Quốc'],
    [1994, 1999, 'Nạn đói “hành quân gian khổ”', 'Hệ thống phân phối sụp đổ, chợ tự phát xuất hiện; nhiều người vượt biên sang Trung Quốc'],
    [2000, 2025, 'chợ ngầm và biệt lập', 'Chợ trở thành nguồn sống chính cho nhiều gia đình; đi lại, thông tin và Internet bị kiểm soát chặt; biên giới đóng gần như hoàn toàn từ 2020']
  ], [
    [1948, 'Cộng hòa Dân chủ Nhân dân Triều Tiên thành lập', 1, ''], [1950, 'chiến tranh Triều Tiên', 2, 'grief'], [1953, 'đình chiến', 2, ''], [1994, 'Kim Nhật Thành qua đời; lũ lụt mở đầu nạn đói', 2, 'grief'],
    [2006, 'vụ thử hạt nhân đầu tiên', 1, ''], [2011, 'Kim Chính Nhật qua đời, Kim Chính Ân lên thay', 2, ''], [2018, 'các hội nghị thượng đỉnh với Hàn Quốc và Mỹ', 1, ''], [2020, 'đóng cửa biên giới vì đại dịch', 1, '']
  ]);

  add('MN', [
    [1900, 1920, 'cuối thời nhà Thanh và Bogd Khan', 'Người du mục chăn nuôi gia súc trên thảo nguyên, chùa chiền giữ vai trò lớn'],
    [1921, 1952, 'Cộng hòa Nhân dân và thanh trừng', 'Tập thể hóa đàn gia súc; thập niên 1930 hàng nghìn tu sĩ bị giết, chùa bị phá'],
    [1953, 1989, 'nước xã hội chủ nghĩa gắn với Liên Xô', 'Hợp tác xã chăn nuôi, trường học và bệnh viện mở rộng; thành phố Erdenet, Darkhan được xây dựng'],
    [1990, 1999, 'dân chủ hóa và cú sốc kinh tế', 'Viện trợ Xô viết chấm dứt, hàng hóa khan hiếm; nhiều người trở lại chăn nuôi tư nhân'],
    [2000, 2025, 'bùng nổ khai khoáng và đô thị hóa', 'Than và đồng xuất khẩu, khu lều ger vây quanh Ulaanbaatar; mùa đông khắc nghiệt (dzud) làm chết hàng triệu gia súc']
  ], [
    [1911, 'tuyên bố độc lập khỏi nhà Thanh', 1, ''], [1921, 'cách mạng nhân dân', 2, ''], [1937, 'đại thanh trừng', 2, 'grief'], [1990, 'cách mạng dân chủ hòa bình', 2, ''], [2010, 'thiên tai dzud làm chết hàng triệu gia súc', 1, 'grief']
  ]);

  add('LA', [
    [1900, 1953, 'Lào thuộc Pháp', 'Các tiểu vương quốc nông nghiệp lúa nương, ít đường sá; người Việt được đưa sang làm công chức và thợ'],
    [1954, 1975, 'vương quốc trong nội chiến', 'Hoàng gia, phe Pathet Lào và phái trung lập tranh chấp; miền đông bị ném bom dữ dội trên đường mòn Hồ Chí Minh'],
    [1976, 1985, 'nhà nước Cộng hòa Dân chủ Nhân dân buổi đầu', 'Hợp tác xã nông nghiệp, trại cải tạo; nhiều người vượt sông Mekong sang Thái Lan'],
    [1986, 2009, 'cơ chế kinh tế mới', 'Buôn bán tự do trở lại, thủy điện và gỗ xuất khẩu; Viêng Chăn vẫn yên bình như một thị trấn lớn'],
    [2010, 2025, 'đầu tư hạ tầng và nợ nước ngoài', 'Đường sắt Lào – Trung khánh thành năm 2021; đồng kíp mất giá mạnh từ 2022']
  ], [
    [1953, 'độc lập hoàn toàn khỏi Pháp', 1, ''], [1964, 'bắt đầu chiến dịch ném bom kéo dài chín năm', 2, 'grief'], [1975, 'nước Cộng hòa Dân chủ Nhân dân Lào ra đời', 2, ''], [1997, 'gia nhập ASEAN', 1, ''], [2021, 'đường sắt Lào – Trung Quốc khánh thành', 1, 'joy']
  ]);

  add('KH', [
    [1900, 1953, 'Campuchia thuộc Pháp', 'Nông thôn trồng lúa thốt nốt, chùa làng là trung tâm; Phnôm Pênh có khu phố kiểu Pháp'],
    [1954, 1969, 'Vương quốc Sangkum của Sihanouk', 'Thời kỳ tương đối yên bình, xây trường học, nhạc rock Khmer nở rộ ở Phnôm Pênh'],
    [1970, 1975, 'nội chiến Khmer Cộng hòa', 'Bom Mỹ ở vùng biên, dân chạy dồn về Phnôm Pênh'],
    [1975, 1978, 'chế độ Khmer Đỏ', 'Thành phố bị di tản, tiền và trường học bị xóa bỏ; lao động cưỡng bức, khoảng 1,5–2 triệu người chết'],
    [1979, 1992, 'tái thiết sau diệt chủng và nội chiến kéo dài', 'Gia đình tìm lại người thân, mìn rải khắp vùng biên; trại tị nạn ở biên giới Thái Lan'],
    [1993, 2025, 'vương quốc sau bầu cử do Liên Hợp Quốc tổ chức', 'May mặc, du lịch Angkor và xây dựng tăng nhanh; nhiều người đi làm ở Thái Lan']
  ], [
    [1953, 'độc lập khỏi Pháp', 2, 'joy'], [1970, 'đảo chính lật đổ Sihanouk', 2, ''], [1975, 'Khmer Đỏ vào Phnôm Pênh ngày 17/4, di tản toàn thành phố', 2, 'grief'], [1979, 'Khmer Đỏ bị lật đổ', 2, ''],
    [1991, 'Hiệp định hòa bình Paris về Campuchia', 1, ''], [1993, 'tổng tuyển cử do UNTAC tổ chức, khôi phục chế độ quân chủ', 2, ''], [1999, 'gia nhập ASEAN', 1, ''], [2023, 'lần đầu đăng cai SEA Games', 1, 'joy']
  ]);

  add('TH', [
    [1900, 1932, 'quân chủ chuyên chế hiện đại hóa', 'Triều đình xóa chế độ nô lệ, xây đường sắt; xuất khẩu gạo nuôi sống nền kinh tế'],
    [1933, 1957, 'quân chủ lập hiến và chính phủ quân nhân', 'Nhiều cuộc đảo chính; liên minh với Nhật trong Thế chiến'],
    [1958, 1986, 'phát triển dưới các chính phủ quân sự', 'Đường sá, đập thủy lợi, căn cứ Mỹ thời chiến tranh Việt Nam; sinh viên đấu tranh năm 1973 và 1976'],
    [1987, 1996, 'kinh tế bùng nổ', 'Nhà máy ô tô, điện tử; Bangkok tắc đường, du lịch phát triển mạnh'],
    [1997, 2005, 'khủng hoảng tài chính và phục hồi', 'Đồng baht sụp đổ, nhiều người mất việc; chương trình y tế 30 baht từ 2002'],
    [2006, 2025, 'chia rẽ chính trị áo vàng – áo đỏ', 'Đảo chính năm 2006 và 2014, biểu tình kéo dài; đời sống thành phố hiện đại, nông thôn già đi']
  ], [
    [1932, 'cách mạng chuyển sang quân chủ lập hiến', 2, ''], [1939, 'đổi tên nước từ Xiêm thành Thái Lan', 1, ''], [1946, 'Vua Bhumibol lên ngôi', 1, ''], [1973, 'sinh viên lật đổ chính quyền quân sự', 2, ''], [1976, 'thảm sát Đại học Thammasat', 2, 'grief'],
    [1992, 'sự kiện tháng Năm đen', 1, 'grief'], [1997, 'khủng hoảng tài chính châu Á bắt đầu từ Thái Lan', 2, 'grief'], [2004, 'sóng thần Ấn Độ Dương ở bờ biển Andaman', 2, 'grief'], [2006, 'đảo chính lật đổ Thaksin', 1, ''],
    [2010, 'biểu tình áo đỏ bị giải tán', 1, 'grief'], [2011, 'đại lũ lụt Bangkok', 2, 'grief'], [2014, 'đảo chính quân sự', 1, ''], [2016, 'Vua Bhumibol băng hà', 2, 'grief'], [2018, 'giải cứu đội bóng nhí trong hang Tham Luang', 1, 'joy'], [2025, 'hợp pháp hóa hôn nhân cùng giới có hiệu lực', 1, '']
  ]);

  add('MM', [
    [1900, 1947, 'Miến Điện thuộc Anh', 'Đồng bằng Irrawaddy thành vựa lúa xuất khẩu, nhiều lao động Ấn Độ ở Yangon; chiến tranh tàn phá 1942–1945'],
    [1948, 1961, 'độc lập và dân chủ nghị viện', 'Nhiều nhóm vũ trang sắc tộc nổi dậy ngay từ đầu'],
    [1962, 1988, 'Con đường Miến Điện đi lên chủ nghĩa xã hội', 'Kinh tế quốc hữu hóa, đóng cửa với thế giới; nước giàu tài nguyên trở thành một trong những nước nghèo nhất'],
    [1989, 2010, 'chính quyền quân sự SLORC/SPDC', 'Bà Aung San Suu Kyi bị quản thúc nhiều năm; cấm vận phương Tây, nội chiến ở vùng biên'],
    [2011, 2020, 'cải cách bán dân chủ', 'Điện thoại di động và Internet bùng nổ, đầu tư nước ngoài đổ vào; khủng hoảng Rohingya 2017'],
    [2021, 2025, 'đảo chính và nội chiến', 'Phong trào bất tuân dân sự, giao tranh lan rộng; đồng kyat mất giá, nhiều người trẻ trốn lệnh nhập ngũ từ 2024']
  ], [
    [1942, 'Nhật chiếm Miến Điện', 2, 'grief'], [1947, 'tướng Aung San bị ám sát', 2, 'grief'], [1948, 'độc lập khỏi Anh', 2, 'joy'], [1962, 'đảo chính của tướng Ne Win', 2, ''], [1988, 'cuộc nổi dậy 8888 bị đàn áp', 2, 'grief'],
    [2007, 'Cách mạng Cà sa của các nhà sư', 1, ''], [2008, 'bão Nargis', 2, 'grief'], [2015, 'NLD thắng cử', 2, 'joy'], [2017, 'khủng hoảng Rohingya', 2, 'grief'], [2021, 'đảo chính quân sự ngày 1/2', 2, 'grief'], [2025, 'động đất Mandalay ngày 28/3', 2, 'grief']
  ]);

  add('MY', [
    [1900, 1941, 'Mã Lai thuộc Anh', 'Đồn điền cao su và mỏ thiếc thu hút lao động Hoa và Ấn'],
    [1942, 1945, 'Nhật chiếm đóng', 'Thiếu thốn, đàn áp cộng đồng người Hoa'],
    [1946, 1962, 'tình trạng khẩn cấp và độc lập', 'Làng mới được lập để cô lập du kích; Malaya độc lập năm 1957'],
    [1963, 1980, 'Liên bang Malaysia và Chính sách Kinh tế Mới', 'Ưu tiên người Mã Lai sau bạo loạn 1969; dầu cọ và dầu mỏ'],
    [1981, 1997, 'công nghiệp hóa thời Mahathir', 'Ô tô quốc gia Proton, tháp đôi Petronas, khu công nghệ cao'],
    [1998, 2017, 'thịnh vượng trung bình khá', 'Đô thị Klang Valley mở rộng; tranh luận chính trị về tham nhũng'],
    [2018, 2025, 'chuyển giao quyền lực và bất ổn chính trường', 'Lần đầu đổi đảng cầm quyền, nhiều lần thay thủ tướng; đại dịch và phục hồi']
  ], [
    [1957, 'Malaya độc lập ngày 31/8', 2, 'joy'], [1963, 'thành lập Malaysia', 2, ''], [1965, 'Singapore tách khỏi Malaysia', 1, ''], [1969, 'bạo loạn sắc tộc ngày 13/5', 2, 'grief'], [1985, 'chiếc Proton Saga đầu tiên', 1, 'joy'],
    [1998, 'khủng hoảng tài chính; Kuala Lumpur đăng cai Commonwealth Games', 1, ''], [2014, 'mất máy bay MH370 và vụ bắn hạ MH17', 2, 'grief'], [2018, 'liên minh Pakatan Harapan thắng cử', 2, '']
  ]);

  add('SG', [
    [1900, 1941, 'cảng thuộc địa Eo Biển', 'Thương cảng sầm uất của người Hoa, Mã Lai, Ấn; nhà phố chật chội'],
    [1942, 1945, 'Nhật chiếm đóng (Syonan)', 'Thảm sát Sook Ching, lương thực khan hiếm'],
    [1946, 1964, 'tự trị và sáp nhập Malaysia', 'Đình công, bạo loạn, thất nghiệp; khu nhà ổ chuột và nhà công cộng đầu tiên'],
    [1965, 1989, 'quốc gia non trẻ công nghiệp hóa', 'Nhà ở HDB, nghĩa vụ quân sự, nhà máy nước ngoài; kỷ luật xã hội chặt'],
    [1990, 2025, 'trung tâm tài chính giàu có', 'Thu nhập cao, giá sinh hoạt đắt, lao động nước ngoài đông; đường tàu điện phủ khắp đảo']
  ], [
    [1942, 'Singapore thất thủ', 2, 'grief'], [1959, 'tự trị, Lý Quang Diệu làm thủ tướng', 1, ''], [1965, 'độc lập ngày 9/8', 2, ''], [1987, 'tuyến MRT đầu tiên', 1, 'joy'], [2003, 'dịch SARS', 1, 'grief'], [2015, 'Lý Quang Diệu qua đời; 50 năm độc lập', 2, '']
  ]);

  add('ID', [
    [1900, 1941, 'Đông Ấn thuộc Hà Lan', 'Đồn điền mía, cà phê, cao su ở Java và Sumatra; giáo dục chỉ dành cho số ít'],
    [1942, 1949, 'Nhật chiếm đóng và cách mạng độc lập', 'Lao động cưỡng bức romusha, rồi bốn năm chiến tranh với Hà Lan'],
    [1950, 1965, 'thời Sukarno', 'Nhiều đảng phái, lạm phát cao cuối thời kỳ'],
    [1966, 1998, 'Trật tự Mới thời Suharto', 'Tăng trưởng, cách mạng xanh, chương trình kế hoạch hóa gia đình; tự do chính trị bị hạn chế'],
    [1999, 2025, 'thời kỳ Cải cách và dân chủ', 'Bầu cử trực tiếp, phân quyền cho địa phương; xe máy, điện thoại và kinh tế số bùng nổ']
  ], [
    [1945, 'tuyên bố độc lập ngày 17/8', 2, 'joy'], [1949, 'Hà Lan công nhận chủ quyền', 1, ''], [1955, 'Hội nghị Á – Phi ở Bandung', 1, ''], [1965, 'đảo chính hụt và thảm sát chống cộng 1965–1966', 2, 'grief'],
    [1998, 'khủng hoảng tài chính, Suharto từ chức', 2, ''], [2002, 'đánh bom Bali', 1, 'grief'], [2004, 'sóng thần Aceh', 2, 'grief'], [2018, 'động đất và sóng thần Palu; Asian Games Jakarta', 1, '']
  ]);

  add('PH', [
    [1900, 1941, 'Philippines thuộc Mỹ', 'Trường học dạy tiếng Anh, đồn điền đường và dừa; Manila hiện đại hóa'],
    [1942, 1945, 'Nhật chiếm đóng', 'Cuộc hành quân chết chóc Bataan, Manila bị phá hủy năm 1945'],
    [1946, 1971, 'nền cộng hòa thứ ba', 'Tái thiết, cải cách ruộng đất chậm; dân di cư lên Manila'],
    [1972, 1986, 'thiết quân luật thời Marcos', 'Báo chí bị kiểm duyệt, nợ nước ngoài tăng; nhiều người đi làm ở Trung Đông'],
    [1987, 2025, 'dân chủ hậu Quyền lực Nhân dân', 'Kiều hối từ lao động ở nước ngoài nuôi nhiều gia đình; ngành tổng đài quốc tế phát triển; bão lớn hằng năm']
  ], [
    [1946, 'độc lập ngày 4/7', 2, 'joy'], [1972, 'Marcos ban bố thiết quân luật', 2, ''], [1983, 'Benigno Aquino bị ám sát', 1, 'grief'], [1986, 'cách mạng Quyền lực Nhân dân EDSA', 2, 'joy'], [1991, 'núi lửa Pinatubo phun trào', 2, 'grief'],
    [2013, 'siêu bão Haiyan', 2, 'grief'], [2016, 'Rodrigo Duterte nhậm chức, chiến dịch chống ma túy', 1, ''], [2022, 'Ferdinand Marcos Jr. đắc cử tổng thống', 1, '']
  ]);

  add('BN', [
    [1900, 1928, 'vương quốc bảo hộ của Anh', 'Làng nhà sàn trên sông, đánh cá và buôn bán'],
    [1929, 1983, 'dầu mỏ đổi đời và bảo hộ Anh', 'Tìm thấy dầu ở Seria năm 1929; chính phủ có tiền xây trường, bệnh viện'],
    [1984, 2025, 'vương quốc độc lập giàu dầu mỏ', 'Không thuế thu nhập cá nhân, y tế và giáo dục miễn phí; luật Hồi giáo được áp dụng chặt hơn từ 2014']
  ], [[1962, 'cuộc nổi dậy Brunei', 1, ''], [1984, 'độc lập khỏi Anh', 2, 'joy']]);

  add('TL', [
    [1900, 1974, 'Timor thuộc Bồ Đào Nha', 'Làng nông nghiệp trồng cà phê, ít trường học'],
    [1975, 1998, 'Indonesia chiếm đóng', 'Xung đột và nạn đói cuối thập niên 1970 làm chết rất nhiều người; kháng chiến trên núi'],
    [1999, 2001, 'trưng cầu dân ý và Liên Hợp Quốc quản lý', 'Dân quân đốt phá sau khi đa số chọn độc lập'],
    [2002, 2025, 'quốc gia độc lập', 'Ngân sách dựa vào dầu khí; nhiều người trẻ đi làm ở Úc, Anh, Hàn Quốc']
  ], [[1975, 'Indonesia xâm chiếm', 2, 'grief'], [1991, 'thảm sát Santa Cruz ở Dili', 2, 'grief'], [1999, 'trưng cầu dân ý chọn độc lập', 2, ''], [2002, 'độc lập ngày 20/5', 2, 'joy'], [2006, 'khủng hoảng an ninh ở Dili', 1, 'grief'], [2025, 'trở thành thành viên ASEAN', 1, 'joy']]);

  add('IN', [
    [1900, 1918, 'Ấn Độ thuộc Anh', 'Đa số làm nông, nạn đói định kỳ; đường sắt và cảng phục vụ xuất khẩu'],
    [1919, 1947, 'đấu tranh giành độc lập', 'Phong trào bất hợp tác, muối và vải tự dệt của Gandhi; nạn đói Bengal 1943'],
    [1947, 1964, 'độc lập và Nehru', 'Chia cắt kéo theo di cư hàng chục triệu người; kế hoạch năm năm, đập thủy điện, viện công nghệ IIT'],
    [1965, 1990, 'cách mạng xanh và kinh tế đóng', 'Giống lúa mì, lúa năng suất cao chấm dứt nạn đói; phải chờ nhiều năm để có điện thoại, xe máy'],
    [1991, 2013, 'tự do hóa kinh tế', 'Công nghệ thông tin và tổng đài ở Bangalore, Hyderabad; tầng lớp trung lưu tăng nhanh'],
    [2014, 2025, 'Ấn Độ số hóa', 'Thẻ căn cước Aadhaar, thanh toán UPI, dữ liệu di động rẻ; đường sá và sân bay mới']
  ], [
    [1919, 'thảm sát Jallianwala Bagh', 2, 'grief'], [1930, 'cuộc tuần hành muối của Gandhi', 1, ''], [1943, 'nạn đói Bengal', 2, 'grief'], [1947, 'độc lập và chia cắt Ấn Độ – Pakistan', 2, ''], [1948, 'Mahatma Gandhi bị ám sát', 2, 'grief'],
    [1950, 'Hiến pháp có hiệu lực', 1, ''], [1962, 'chiến tranh biên giới với Trung Quốc', 1, ''], [1971, 'chiến tranh với Pakistan, Bangladesh ra đời', 1, ''], [1975, 'tình trạng khẩn cấp 1975–1977', 2, ''],
    [1983, 'đội cricket vô địch World Cup', 1, 'joy'], [1984, 'Indira Gandhi bị ám sát; thảm họa khí độc Bhopal', 2, 'grief'], [1991, 'Rajiv Gandhi bị ám sát; cải cách tự do hóa kinh tế', 2, ''],
    [2001, 'động đất Gujarat', 1, 'grief'], [2004, 'sóng thần Ấn Độ Dương', 1, 'grief'], [2008, 'tấn công khủng bố Mumbai', 2, 'grief'], [2011, 'vô địch World Cup cricket', 1, 'joy'], [2016, 'thu hồi tiền mệnh giá lớn', 1, ''],
    [2021, 'làn sóng COVID-19 Delta', 2, 'grief'], [2023, 'tàu Chandrayaan-3 hạ cánh gần cực nam Mặt Trăng; trở thành nước đông dân nhất thế giới', 2, 'joy']
  ]);

  add('PK', [
    [1900, 1946, 'vùng tây bắc Ấn Độ thuộc Anh', 'Đồng bằng Punjab tưới tiêu bằng kênh đào, vùng núi bộ lạc tự quản'],
    [1947, 1957, 'độc lập và di cư', 'Hàng triệu người tị nạn sau chia cắt; Karachi tràn ngập người mới đến'],
    [1958, 1971, 'chính quyền Ayub Khan và chia cắt Đông – Tây', 'Đập lớn, cách mạng xanh; chiến tranh 1971 mất Đông Pakistan'],
    [1972, 1987, 'Bhutto và Zia', 'Quốc hữu hóa rồi Hồi giáo hóa luật pháp; hàng triệu người Afghanistan tị nạn'],
    [1988, 2007, 'dân chủ chập chờn và Musharraf', 'Luân phiên dân sự – quân sự; nhiều người đi làm vùng Vịnh'],
    [2008, 2025, 'bất ổn an ninh và khủng hoảng kinh tế', 'Khủng bố giảm dần sau 2014, nhưng lạm phát cao, thiếu điện; lũ lớn năm 2010 và 2022']
  ], [
    [1947, 'Pakistan ra đời', 2, ''], [1948, 'Muhammad Ali Jinnah qua đời', 1, 'grief'], [1971, 'chiến tranh, Đông Pakistan trở thành Bangladesh', 2, 'grief'], [1979, 'cựu thủ tướng Zulfikar Ali Bhutto bị xử tử', 1, ''], [1992, 'vô địch World Cup cricket', 1, 'joy'],
    [1998, 'thử hạt nhân', 1, ''], [2005, 'động đất Kashmir', 2, 'grief'], [2007, 'Benazir Bhutto bị ám sát', 2, 'grief'], [2010, 'đại hồng thủy', 2, 'grief'], [2014, 'tấn công trường học Peshawar', 2, 'grief'], [2022, 'lũ lụt nhấn chìm một phần ba đất nước', 2, 'grief']
  ]);

  add('BD', [
    [1900, 1946, 'Bengal thuộc Anh', 'Đồng bằng trồng lúa và đay; nạn đói 1943'],
    [1947, 1970, 'Đông Pakistan', 'Phong trào bảo vệ tiếng Bengal 1952; cảm giác bị Tây Pakistan bỏ rơi; bão Bhola 1970'],
    [1971, 1990, 'độc lập và những năm khó khăn', 'Tái thiết sau chiến tranh, nạn đói 1974, nhiều cuộc đảo chính'],
    [1991, 2025, 'dân chủ nghị viện và ngành may mặc', 'Hàng triệu phụ nữ làm công nhân may; tín dụng vi mô và cầu Padma; năm 2024 sinh viên lật đổ chính phủ']
  ], [
    [1952, 'phong trào ngôn ngữ ngày 21/2', 1, ''], [1970, 'bão Bhola', 2, 'grief'], [1971, 'chiến tranh giải phóng, độc lập', 2, ''], [1974, 'nạn đói', 2, 'grief'], [1975, 'Sheikh Mujibur Rahman bị ám sát', 2, 'grief'],
    [1991, 'siêu bão và trở lại chế độ nghị viện', 1, 'grief'], [2006, 'Muhammad Yunus đoạt Nobel Hòa bình', 1, 'joy'], [2013, 'sập tòa nhà Rana Plaza', 2, 'grief'], [2017, 'đón người Rohingya tị nạn', 1, ''], [2022, 'khánh thành cầu Padma', 1, 'joy'], [2024, 'sinh viên biểu tình, Sheikh Hasina rời đất nước', 2, '']
  ]);

  add('LK', [
    [1900, 1947, 'Ceylon thuộc Anh', 'Đồn điền chè và cao su với lao động người Tamil gốc Ấn'],
    [1948, 1982, 'độc lập và căng thẳng sắc tộc', 'Phúc lợi gạo trợ giá, giáo dục miễn phí; luật chỉ dùng tiếng Sinhala năm 1956'],
    [1983, 2009, 'nội chiến', 'Giao tranh giữa chính phủ và LTTE ở miền bắc và miền đông; nổi dậy JVP ở miền nam cuối thập niên 1980'],
    [2010, 2025, 'hậu chiến và khủng hoảng nợ', 'Tái thiết, du lịch; năm 2022 thiếu nhiên liệu và lương thực, tổng thống phải từ chức']
  ], [
    [1948, 'độc lập', 2, 'joy'], [1972, 'đổi tên nước thành Sri Lanka', 1, ''], [1983, 'bạo loạn tháng Bảy Đen', 2, 'grief'], [1996, 'vô địch World Cup cricket', 1, 'joy'], [2004, 'sóng thần', 2, 'grief'], [2009, 'kết thúc nội chiến', 2, ''], [2019, 'đánh bom ngày lễ Phục sinh', 2, 'grief'], [2022, 'khủng hoảng kinh tế, phong trào Aragalaya', 2, 'grief']
  ]);

  add('NP', [
    [1900, 1950, 'chế độ thủ tướng dòng họ Rana', 'Đất nước đóng cửa, đa số nông dân miền núi không biết chữ'],
    [1951, 1989, 'vương quốc mở cửa dần và chế độ Panchayat', 'Đường sá, trường học, du lịch leo núi bắt đầu'],
    [1990, 2005, 'dân chủ đa đảng và nổi dậy Maoist', 'Xung đột 1996–2006 ở nông thôn; nhiều người trẻ đi làm vùng Vịnh, Malaysia'],
    [2006, 2025, 'hòa bình và nền cộng hòa liên bang', 'Kiều hối là nguồn sống chính; thay chính phủ thường xuyên; năm 2025 thế hệ Z biểu tình lật đổ chính phủ']
  ], [[1951, 'kết thúc chế độ Rana', 1, ''], [1953, 'Tenzing Norgay và Edmund Hillary chinh phục Everest', 2, 'joy'], [2001, 'thảm sát hoàng gia', 2, 'grief'], [2008, 'bãi bỏ chế độ quân chủ', 2, ''], [2015, 'động đất Gorkha; hiến pháp mới', 2, 'grief']]);

  add('BT', [
    [1900, 1951, 'vương quốc núi cách biệt', 'Làng nông nghiệp tự cung tự cấp, không có đường ô tô và tiền giấy'],
    [1952, 2007, 'hiện đại hóa có kiểm soát', 'Đường sá và trường học đầu tiên; triết lý Tổng hạnh phúc quốc gia; truyền hình chỉ có từ 1999'],
    [2008, 2025, 'quân chủ lập hiến', 'Bầu cử nghị viện, thủy điện bán cho Ấn Độ; nhiều thanh niên sang Úc làm việc']
  ], [[1907, 'thành lập triều đại Wangchuck', 1, ''], [1971, 'gia nhập Liên Hợp Quốc', 1, ''], [1999, 'truyền hình và Internet được phép', 1, ''], [2008, 'hiến pháp và bầu cử đầu tiên', 2, '']]);

  add('MV', [
    [1900, 1964, 'vương quốc Hồi giáo dưới bảo hộ Anh', 'Đánh cá ngừ, buôn dừa trên các đảo san hô'],
    [1965, 2007, 'độc lập và du lịch nghỉ dưỡng', 'Khu resort đầu tiên năm 1972; ba mươi năm dưới một tổng thống'],
    [2008, 2025, 'dân chủ đa đảng', 'Malé đông đúc, lo nước biển dâng; du lịch là trụ cột']
  ], [[1965, 'độc lập khỏi Anh', 1, 'joy'], [1968, 'bãi bỏ chế độ quân chủ', 1, ''], [2004, 'sóng thần', 2, 'grief'], [2008, 'bầu cử đa đảng đầu tiên', 1, '']]);

  add('AF', [
    [1900, 1928, 'vương quốc hiện đại hóa thận trọng', 'Bộ lạc và nông thôn tự quản; độc lập hoàn toàn khỏi ảnh hưởng Anh năm 1919'],
    [1929, 1972, 'triều đại Musahiban', 'Ổn định tương đối, Kabul có đại học và phụ nữ đi học ở thành phố'],
    [1973, 1978, 'nền cộng hòa của Daoud', 'Cải cách từ trên xuống, căng thẳng với phe cánh tả và Hồi giáo'],
    [1979, 1989, 'Liên Xô can thiệp và chiến tranh', 'Hàng triệu người tị nạn sang Pakistan, Iran'],
    [1990, 2001, 'nội chiến và Taliban', 'Kabul bị tàn phá; từ 1996 Taliban cấm nữ sinh đi học'],
    [2002, 2021, 'Cộng hòa Hồi giáo có quân đội quốc tế', 'Trường học, điện thoại, truyền hình trở lại; giao tranh với Taliban ở nhiều tỉnh'],
    [2021, 2025, 'Taliban trở lại cầm quyền', 'Bé gái bị cấm học sau lớp 6, phụ nữ bị hạn chế đi làm; kinh tế suy sụp, viện trợ cắt giảm']
  ], [[1919, 'độc lập về đối ngoại sau chiến tranh với Anh', 1, ''], [1979, 'Liên Xô đưa quân vào', 2, 'grief'], [1989, 'quân Liên Xô rút', 1, ''], [1996, 'Taliban chiếm Kabul', 2, 'grief'], [2001, 'Mỹ can thiệp, Taliban sụp đổ', 2, ''], [2021, 'Taliban trở lại Kabul ngày 15/8', 2, 'grief'], [2023, 'động đất Herat', 1, 'grief']]);

  // Trung Á: chung khung Đế quốc Nga → Liên Xô → độc lập 1991, thêm nét riêng từng nước
  var CA = {
    KZ: ['Kazakhstan', 'Chiến dịch khai hoang đất trống, bãi thử hạt nhân Semipalatinsk, sân bay vũ trụ Baikonur', 'Dầu mỏ đưa thu nhập lên cao, thủ đô chuyển về Astana năm 1997', [[1932, 'nạn đói do tập thể hóa đàn gia súc', 2, 'grief'], [1954, 'chiến dịch khai hoang đất trống', 1, ''], [1986, 'biểu tình Jeltoqsan ở Almaty', 1, ''], [1991, 'độc lập ngày 16/12', 2, ''], [2022, 'bạo loạn tháng Một', 1, 'grief']]],
    UZ: ['Uzbekistan', 'Bông vải phủ khắp đồng bằng, kéo theo thảm họa khô cạn biển Aral', 'Chính quyền tập trung kéo dài; từ 2016 cải cách, mở cửa và bỏ lao động cưỡng bức thu hoạch bông', [[1966, 'động đất Tashkent', 1, 'grief'], [1991, 'độc lập', 2, ''], [2005, 'đàn áp ở Andijan', 1, 'grief'], [2016, 'Islam Karimov qua đời, bắt đầu cải cách', 1, '']]],
    TM: ['Turkmenistan', 'Kênh đào Karakum dẫn nước cho đồng bông giữa sa mạc', 'Khí đốt dồi dào nhưng đất nước khép kín, Internet và đi lại bị kiểm soát chặt', [[1948, 'động đất Ashgabat', 2, 'grief'], [1991, 'độc lập', 2, ''], [2006, 'Saparmurat Niyazov qua đời', 1, '']]],
    TJ: ['Tajikistan', 'Thung lũng núi trồng bông, nhà máy nhôm và thủy điện', 'Sau nội chiến 1992–1997, hàng trăm nghìn đàn ông đi làm ở Nga gửi tiền về', [[1991, 'độc lập', 1, ''], [1992, 'nội chiến bùng nổ', 2, 'grief'], [1997, 'hiệp định hòa bình', 1, '']]],
    KG: ['Kyrgyzstan', 'Chăn nuôi trên đồng cỏ núi cao, mỏ vàng và uranium', 'Đời sống nghèo hơn láng giềng, nhiều người làm việc ở Nga; ba lần chính phủ bị lật đổ', [[1991, 'độc lập', 1, ''], [2005, 'Cách mạng Hoa Tulip', 1, ''], [2010, 'lật đổ tổng thống và xung đột sắc tộc ở Osh', 2, 'grief'], [2020, 'biểu tình sau bầu cử', 1, '']]]
  };
  Object.keys(CA).forEach(function (c) {
    var x = CA[c];
    add(c, [
      [1900, 1916, 'cai trị của Đế quốc Nga', 'Người du mục và nông dân ốc đảo dưới quyền các quan Nga; người định cư Nga lấy đất đồng cỏ'],
      [1917, 1929, 'cách mạng và lập các nước cộng hòa Xô viết', 'Nội chiến, phong trào Basmachi; vẽ lại biên giới theo dân tộc'],
      [1930, 1953, 'tập thể hóa thời Stalin', 'Du mục bị ép định cư, nạn đói và thanh trừng; trong Thế chiến nhiều nhà máy và người bị trục xuất dời về đây'],
      [1954, 1985, 'nước cộng hòa Xô viết ổn định', x[1]],
      [1986, 1991, 'perestroika và tan rã Liên Xô', 'Hàng hóa khan hiếm, phong trào dân tộc trỗi dậy'],
      [1992, 2025, 'nước ' + x[0] + ' độc lập', x[2]]
    ], x[3]);
  });
})(globalThis.G);
