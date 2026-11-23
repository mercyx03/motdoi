/* Một Đời — 9.8.9 bổ sung sự kiện 1900–2025 và bối cảnh theo thành phố: châu Á, Trung Đông.
   ev: [năm, sự kiện, mức (mặc định 1), sắc thái]; reg: [[thành phố], từ, đến, giai đoạn, đời sống]; rev: [năm, [thành phố], sự kiện, mức, sắc thái]. Nguồn thứ cấp, đối chiếu 23/11/2026. */
(function (G) {
  'use strict';
  var D = G.BIRTH987 || (G.BIRTH987 = { ERA: {}, EV: {}, WORLD: [] }); D.REG = D.REG || {}; D.REV = D.REV || {};
  // Bỏ dòng trùng với dữ liệu 9.8.8: cùng năm và chung từ hai chữ có nghĩa trở lên thì giữ dòng cũ.
  var STOP = { 'năm': 1, 'của': 1, 'được': 1, 'những': 1, 'người': 1, 'trong': 1, 'cho': 1, 'với': 1, 'các': 1, 'một': 1, 'lần': 1, 'đầu': 1, 'tiên': 1, 'lớn': 1 };
  function wd(t) { return String(t).toLowerCase().split(/[^\p{L}\d]+/u).filter(function (x) { return x.length >= 3 && !STOP[x]; }); }
  function dup(c, r) { var a = wd(r[1]); return (D.EV[c] || []).some(function (e) { if (e[0] !== r[0]) return false; var b = wd(e[1]); return e[1] === r[1] || a.filter(function (x) { return b.indexOf(x) >= 0; }).length >= 2; }); }
  function ev(c, rows) { rows.forEach(function (r) { if (!dup(c, r)) (D.EV[c] || (D.EV[c] = [])).push([r[0], r[1], r[2] || 1, r[3] || '']); }); }
  function reg(c, rows) { D.REG[c] = (D.REG[c] || []).concat(rows); }
  function rev(c, rows) { D.REV[c] = (D.REV[c] || []).concat(rows.map(function (r) { return [r[0], r[1], r[2], r[3] || 1, r[4] || '']; })); }

  ev('CN', [[1905, 'bãi bỏ chế độ khoa cử'], [1908, 'Từ Hi Thái hậu và vua Quang Tự qua đời, Phổ Nghi lên ngôi'], [1912, 'vua Thanh thoái vị, Trung Hoa Dân Quốc thành lập', 2], [1915, 'Viên Thế Khải tự xưng hoàng đế'], [1916, 'Viên Thế Khải qua đời, đất nước rơi vào cảnh quân phiệt cát cứ'],
    [1921, 'Đảng Cộng sản Trung Quốc thành lập'], [1925, 'Tôn Trung Sơn qua đời; phong trào 30/5 ở Thượng Hải'], [1926, 'quân Quốc dân đảng tiến hành Bắc phạt'], [1927, 'Quốc – Cộng đổ vỡ, đàn áp công nhân ở Thượng Hải', 1, 'grief'], [1928, 'chính quyền Nam Kinh thống nhất đất nước trên danh nghĩa'],
    [1932, 'Nhật dựng nước Mãn Châu quốc'], [1934, 'Hồng quân bắt đầu cuộc Trường Chinh'], [1936, 'sự biến Tây An, Quốc – Cộng hợp tác chống Nhật'], [1938, 'phá đê Hoàng Hà để chặn quân Nhật, hàng trăm nghìn người chết', 2, 'grief'], [1942, 'nạn đói ở Hà Nam', 2, 'grief'],
    [1944, 'Nhật mở chiến dịch Ichi-Go đánh xuyên miền nam Trung Quốc', 1, 'grief'], [1946, 'nội chiến Quốc – Cộng bùng nổ trở lại', 2, 'grief'], [1948, 'lạm phát phi mã của đồng kim viên khoán', 1, 'grief'], [1950, 'Luật Hôn nhân mới; cải cách ruộng đất; tham chiến ở Triều Tiên', 2], [1953, 'kế hoạch năm năm đầu tiên'],
    [1956, 'phong trào Trăm hoa đua nở'], [1957, 'chiến dịch chống phái hữu', 1, 'grief'], [1959, 'nạn đói lớn bắt đầu; hội nghị Lư Sơn', 2, 'grief'], [1960, 'Liên Xô rút chuyên gia về nước'], [1962, 'chiến tranh biên giới với Ấn Độ'],
    [1964, 'thử thành công bom nguyên tử đầu tiên'], [1967, 'thử bom khinh khí'], [1969, 'xung đột biên giới Trung – Xô ở đảo Trân Bảo'], [1970, 'phóng vệ tinh nhân tạo đầu tiên Đông Phương Hồng 1'], [1972, 'Tổng thống Mỹ Nixon thăm Trung Quốc', 2],
    [1979, 'lập quan hệ ngoại giao với Mỹ; chiến tranh biên giới với Việt Nam', 2], [1984, 'lần đầu giành huy chương vàng Olympic'], [1990, 'Bắc Kinh đăng cai Đại hội Thể thao châu Á'], [1994, 'khởi công đập Tam Hiệp'], [1998, 'đại hồng thủy trên sông Trường Giang', 2, 'grief'],
    [2006, 'đường sắt Thanh Hải – Tây Tạng thông xe'], [2011, 'tai nạn tàu cao tốc Ôn Châu', 1, 'grief'], [2012, 'Tập Cận Bình trở thành Tổng Bí thư'], [2013, 'đề xướng sáng kiến Vành đai và Con đường'], [2015, 'vụ nổ kho hóa chất ở Thiên Tân; công bố chấm dứt chính sách một con', 1, ''],
    [2018, 'bỏ giới hạn nhiệm kỳ chủ tịch nước'], [2019, 'biểu tình kéo dài ở Hồng Kông; kỷ niệm 70 năm quốc khánh'], [2021, 'chính sách ba con; kỷ niệm 100 năm thành lập Đảng'], [2024, 'tàu Thường Nga 6 mang mẫu đất từ vùng tối của Mặt Trăng về Trái Đất', 1, 'joy']]);
  reg('CN', [[['Thượng Hải'], 1900, 1942, 'Thượng Hải tô giới', 'Khu tô giới của các nước phương Tây và Nhật, ngân hàng, vũ trường, xưởng dệt; người nghèo sống trong khu ổ chuột ven sông'],
    [['Cáp Nhĩ Tân'], 1932, 1945, 'Mãn Châu quốc', 'Nhật cai trị qua chính quyền bù nhìn, người Nhật di dân sang khai khẩn; Đơn vị 731 thí nghiệm trên người gần Cáp Nhĩ Tân'],
    [['Trùng Khánh'], 1938, 1945, 'thủ đô thời chiến', 'Chính phủ dời về Trùng Khánh, thành phố bị máy bay Nhật ném bom liên tục, dân trú trong hầm núi'],
    [['Côn Minh'], 1938, 1946, 'hậu phương kháng chiến', 'Đại học Tây Nam Liên hợp sơ tán về Côn Minh; đường Miến Điện chở hàng viện trợ'],
    [['Thâm Quyến', 'Quảng Châu'], 1980, 2025, 'đặc khu kinh tế, công xưởng thế giới', 'Làng chài Thâm Quyến thành siêu đô thị, công nhân từ khắp nơi đổ về nhà máy điện tử, may mặc; Quảng Châu là cửa ngõ buôn bán'],
    [['Cáp Nhĩ Tân'], 1993, 2010, 'vành đai rỉ sét Đông Bắc', 'Nhà máy quốc doanh đóng cửa, hàng triệu công nhân bị cho nghỉ việc; mùa đông lạnh giá, lễ hội băng đăng'],
    [['Lhasa'], 1951, 2025, 'Tây Tạng dưới chính quyền Trung Quốc', 'Từ 1951 do Bắc Kinh quản lý, cuộc nổi dậy 1959 và Đạt Lai Lạt Ma lưu vong; đường sắt năm 2006 đưa người Hán và du khách tới'],
    [['Trùng Khánh'], 1997, 2025, 'thành phố trực thuộc trung ương', 'Đập Tam Hiệp buộc hơn một triệu người dọc sông Trường Giang di dời; đô thị đồi núi nhiều tầng'],
    [['Thượng Hải'], 1990, 2025, 'Phố Đông và trung tâm tài chính', 'Khu Phố Đông từ đồng ruộng thành rừng nhà chọc trời, tàu điện ngầm dày đặc']]);
  rev('CN', [[1931, ['Vũ Hán', 'Nam Kinh'], 'đại lũ sông Dương Tử nhấn chìm thành phố', 2, 'grief'], [1936, ['Tây An'], 'sự biến Tây An, Tưởng Giới Thạch bị giữ lại', 1, ''], [1937, ['Thượng Hải'], 'trận Thượng Hải kéo dài ba tháng', 2, 'grief'],
    [1938, ['Vũ Hán'], 'trận Vũ Hán', 1, 'grief'], [1959, ['Lhasa'], 'cuộc nổi dậy, Đạt Lai Lạt Ma rời sang Ấn Độ', 2, ''], [1976, ['Thiên Tân', 'Bắc Kinh'], 'chấn động từ trận động đất Đường Sơn', 2, 'grief'],
    [1989, ['Bắc Kinh'], 'biểu tình ở Quảng trường Thiên An Môn bị trấn áp', 2, 'grief'], [1999, ['Hàng Châu'], 'Jack Ma lập Alibaba trong một căn hộ', 1, ''], [2008, ['Thành Đô', 'Trùng Khánh'], 'động đất Tứ Xuyên', 2, 'grief'], [2008, ['Bắc Kinh'], 'Thế vận hội Bắc Kinh', 2, 'joy'],
    [2008, ['Lhasa'], 'bất ổn và phong tỏa', 1, ''], [2010, ['Thượng Hải'], 'Expo Thượng Hải', 1, 'joy'], [2014, ['Côn Minh'], 'tấn công bằng dao ở ga tàu', 1, 'grief'], [2016, ['Hàng Châu'], 'hội nghị G20', 1, ''],
    [2020, ['Vũ Hán'], 'thành phố bị phong tỏa 76 ngày vì COVID-19', 2, 'grief'], [2022, ['Thượng Hải'], 'phong tỏa hai tháng', 2, 'grief']]);

  ev('IN', [[1905, 'chia cắt Bengal gây phong trào tẩy chay hàng Anh'], [1906, 'thành lập Liên đoàn Hồi giáo toàn Ấn'], [1911, 'thủ đô dời từ Calcutta về Delhi'], [1915, 'Mahatma Gandhi trở về Ấn Độ'], [1920, 'phong trào bất hợp tác'], [1928, 'biểu tình phản đối Ủy ban Simon'],
    [1931, 'khánh thành New Delhi'], [1935, 'Đạo luật Chính phủ Ấn Độ cho các tỉnh tự trị'], [1937, 'bầu cử các tỉnh, đảng Quốc đại thắng lớn'], [1942, 'phong trào “Rời khỏi Ấn Độ”', 2], [1946, 'bạo loạn tôn giáo ở Calcutta', 1, 'grief'], [1951, 'cuộc tổng tuyển cử đầu tiên bắt đầu'],
    [1956, 'tổ chức lại các bang theo ngôn ngữ'], [1961, 'sáp nhập Goa'], [1964, 'Thủ tướng Nehru qua đời', 2, 'grief'], [1965, 'chiến tranh với Pakistan'], [1966, 'Indira Gandhi làm thủ tướng'], [1969, 'quốc hữu hóa ngân hàng'],
    [1974, 'thử hạt nhân Pokhran'], [1977, 'đảng Janata đánh bại Quốc đại sau tình trạng khẩn cấp'], [1980, 'Indira Gandhi trở lại nắm quyền'], [1982, 'Đại hội Thể thao châu Á ở Delhi, truyền hình màu'], [1989, 'chính phủ liên minh thay đảng Quốc đại'],
    [1992, 'phá đền Babri, bạo loạn tôn giáo lan rộng', 2, 'grief'], [1993, 'loạt đánh bom ở Bombay', 2, 'grief'], [1998, 'thử hạt nhân lần hai'], [1999, 'xung đột Kargil với Pakistan'], [2000, 'lập ba bang mới Jharkhand, Chhattisgarh, Uttarakhand'],
    [2002, 'bạo loạn ở Gujarat', 2, 'grief'], [2006, 'luật bảo đảm việc làm nông thôn'], [2010, 'Đại hội Thể thao Khối Thịnh vượng chung ở Delhi'], [2012, 'vụ cưỡng hiếp tập thể ở Delhi gây phẫn nộ cả nước', 1, 'grief'],
    [2013, 'lũ quét ở Uttarakhand', 1, 'grief'], [2014, 'Narendra Modi thắng cử; tàu Mangalyaan bay tới quỹ đạo sao Hỏa', 2], [2017, 'áp dụng thuế hàng hóa và dịch vụ thống nhất (GST)'], [2019, 'bãi bỏ quy chế đặc biệt của Jammu và Kashmir; Modi tái đắc cử'],
    [2020, 'phong tỏa toàn quốc, lao động di cư đi bộ về quê', 2, 'grief'], [2024, 'khánh thành đền Ram ở Ayodhya; Modi bước vào nhiệm kỳ thứ ba'], [2025, 'xung đột quân sự ngắn với Pakistan sau vụ tấn công ở Pahalgam', 1, '']]);
  reg('IN', [[['Kolkata'], 1900, 1911, 'thủ đô Ấn Độ thuộc Anh', 'Calcutta là trung tâm hành chính, văn hóa Bengal phục hưng'],
    [['Kolkata'], 1977, 2011, 'Mặt trận Cánh tả cầm quyền', 'Ba mươi tư năm chính quyền cộng sản ở Tây Bengal, cải cách ruộng đất, công nghiệp trì trệ'],
    [['Bengaluru', 'Hyderabad', 'Pune', 'Chennai'], 1995, 2025, 'thủ phủ công nghệ thông tin', 'Công ty phần mềm, tổng đài quốc tế, kỹ sư trẻ từ khắp nước đổ về; kẹt xe và giá nhà tăng'],
    [['Mumbai'], 1960, 2025, 'thủ đô tài chính và Bollywood', 'Sở giao dịch chứng khoán, xưởng phim, khu ổ chuột Dharavi cạnh tòa tháp; tàu điện ngoại ô chật cứng'],
    [['Dehradun'], 2000, 2025, 'bang Uttarakhand mới', 'Thủ phủ của bang tách khỏi Uttar Pradesh năm 2000; du lịch núi, hành hương'],
    [['Patna'], 1990, 2005, 'Bihar thời Lalu Prasad', 'Tội phạm, bắt cóc, đường sá xuống cấp; nhiều người rời Bihar đi làm thuê']]);
  rev('IN', [[1911, ['Delhi'], 'lễ Durbar, Delhi được chọn làm thủ đô mới', 1, ''], [1943, ['Kolkata'], 'nạn đói Bengal, người đói tràn về Calcutta', 2, 'grief'], [1946, ['Kolkata'], 'ngày Hành động trực tiếp, bạo loạn đẫm máu', 2, 'grief'],
    [1984, ['Bhopal'], 'rò rỉ khí độc nhà máy Union Carbide', 2, 'grief'], [1984, ['Delhi'], 'bạo loạn chống người Sikh sau vụ ám sát Indira Gandhi', 2, 'grief'], [1992, ['Lucknow', 'Kanpur'], 'phá đền Babri ở Ayodhya', 2, 'grief'],
    [2001, ['Ahmedabad'], 'động đất Gujarat', 2, 'grief'], [2004, ['Chennai'], 'sóng thần ập vào bờ biển', 2, 'grief'], [2005, ['Mumbai'], 'trận mưa lụt lịch sử ngày 26/7', 2, 'grief'], [2008, ['Jaipur'], 'loạt đánh bom ở phố cổ', 1, 'grief'],
    [2010, ['Delhi'], 'Đại hội Thể thao Khối Thịnh vượng chung', 1, ''], [2013, ['Dehradun'], 'lũ quét Kedarnath', 2, 'grief'], [2015, ['Chennai'], 'lũ lụt lớn', 1, 'grief'], [2023, ['Bengaluru'], 'tàu Chandrayaan-3 được điều khiển từ trung tâm ISRO', 1, 'joy']]);

  ev('JP', [[1902, 'liên minh Anh – Nhật'], [1910, 'sáp nhập Triều Tiên'], [1918, 'bạo loạn vì giá gạo'], [1925, 'đàn ông được phổ thông đầu phiếu; luật trị an hạn chế tự do'], [1927, 'khủng hoảng tài chính Chiêu Hòa'], [1931, 'sự biến Mãn Châu'],
    [1932, 'Thủ tướng Inukai bị sĩ quan trẻ ám sát'], [1933, 'rút khỏi Hội Quốc Liên'], [1936, 'binh biến ngày 26/2'], [1940, 'ký Hiệp ước Ba bên với Đức và Ý'], [1942, 'thất bại ở trận Midway'], [1944, 'máy bay Mỹ bắt đầu ném bom các thành phố', 2, 'grief'],
    [1946, 'Thiên hoàng tuyên bố mình không phải thần linh; cải cách ruộng đất'], [1950, 'chiến tranh Triều Tiên mang về đơn hàng cho công nghiệp'], [1951, 'ký Hòa ước San Francisco'], [1955, 'thành lập Đảng Dân chủ Tự do'], [1956, 'gia nhập Liên Hợp Quốc'],
    [1968, 'trở thành nền kinh tế lớn thứ hai thế giới'], [1972, 'Okinawa được trả lại; Thế vận hội mùa đông Sapporo'], [1976, 'bê bối Lockheed'], [1978, 'hiệp ước hòa bình và hữu nghị với Trung Quốc'], [1985, 'Hiệp định Plaza; máy bay JAL 123 rơi', 1, 'grief'],
    [1990, 'bong bóng chứng khoán vỡ'], [1993, 'Đảng Dân chủ Tự do lần đầu mất quyền'], [1997, 'công ty chứng khoán Yamaichi phá sản'], [1998, 'Thế vận hội mùa đông Nagano'], [2001, 'Koizumi Junichirō làm thủ tướng'], [2004, 'động đất Chūetsu'],
    [2009, 'Đảng Dân chủ thắng cử, thay đổi chính quyền'], [2012, 'Abe Shinzō trở lại làm thủ tướng'], [2016, 'động đất Kumamoto', 1, 'grief'], [2018, 'mưa lũ miền tây Nhật Bản', 1, 'grief'], [2020, 'dời Thế vận hội vì đại dịch'], [2025, 'Takaichi Sanae trở thành nữ thủ tướng đầu tiên', 1, '']]);
  reg('JP', [[['Hiroshima'], 1945, 1955, 'thành phố hồi sinh sau bom nguyên tử', 'Người sống sót hibakusha mang bệnh phóng xạ, nhà tạm dựng trên đống tro tàn'],
    [['Sendai'], 2011, 2016, 'tái thiết sau sóng thần', 'Nhà tạm cho người sơ tán, đê biển cao, nhiều làng ven biển không còn'],
    [['Kobe'], 1995, 2000, 'tái thiết sau động đất', 'Nhà ở tạm, đường cao tốc dựng lại; tình nguyện viên khắp nước đổ về']]);
  rev('JP', [[1945, ['Hiroshima'], 'bom nguyên tử ngày 6/8', 2, 'grief'], [1945, ['Tokyo'], 'trận bom cháy đêm 9 – 10/3', 2, 'grief'], [1945, ['Osaka', 'Nagoya', 'Kobe', 'Yokohama', 'Kawasaki'], 'thành phố bị bom cháy tàn phá', 2, 'grief'],
    [1972, ['Sapporo'], 'Thế vận hội mùa đông', 1, 'joy'], [1995, ['Kobe'], 'đại động đất Hanshin', 2, 'grief'], [1995, ['Tokyo'], 'tấn công khí sarin ở tàu điện ngầm', 2, 'grief'], [2011, ['Sendai'], 'sóng thần ngày 11/3', 2, 'grief'],
    [2014, ['Hiroshima'], 'lở đất sau mưa lớn', 1, 'grief'], [2018, ['Sapporo'], 'động đất Hokkaido, mất điện toàn đảo', 1, 'grief'], [2021, ['Tokyo'], 'Thế vận hội không khán giả', 1, ''], [2025, ['Osaka'], 'Expo 2025', 1, 'joy']]);

  ev('KR', [[1905, 'Hiệp ước bảo hộ, Nhật nắm quyền ngoại giao'], [1909, 'An Jung-geun ám sát Itō Hirobumi'], [1929, 'phong trào sinh viên Gwangju'], [1940, 'người Triều Tiên bị buộc đổi họ tên kiểu Nhật', 1, 'grief'], [1949, 'nhà lãnh đạo độc lập Kim Ku bị ám sát'],
    [1965, 'bình thường hóa quan hệ với Nhật; đưa quân sang Việt Nam'], [1968, 'đặc công miền Bắc tập kích Nhà Xanh'], [1972, 'Hiến pháp Yushin'], [1983, 'máy bay KAL 007 bị bắn rơi; vụ đánh bom ở Rangoon', 1, 'grief'], [1986, 'Đại hội Thể thao châu Á ở Seoul'],
    [1992, 'Kim Young-sam đắc cử, tổng thống dân sự đầu tiên sau nhiều thập kỷ'], [1994, 'sập cầu Seongsu', 1, 'grief'], [1995, 'sập trung tâm thương mại Sampoong', 2, 'grief'], [1998, 'Kim Dae-jung nhậm chức, chính sách Ánh dương'], [2000, 'hội nghị thượng đỉnh liên Triều lần đầu', 2],
    [2003, 'hỏa hoạn tàu điện ngầm Daegu', 1, 'grief'], [2008, 'biểu tình thắp nến phản đối nhập khẩu thịt bò Mỹ'], [2010, 'tàu Cheonan chìm; pháo kích đảo Yeonpyeong', 1, 'grief'], [2012, 'bài hát Gangnam Style lan khắp thế giới', 1, 'joy'], [2015, 'dịch MERS'],
    [2016, 'các cuộc biểu tình thắp nến đòi phế truất tổng thống'], [2021, 'phim Squid Game gây sốt toàn cầu'], [2023, 'đăng cai Jamboree Hướng đạo thế giới ở Saemangeum']]);
  rev('KR', [[1948, ['Jeju'], 'cuộc nổi dậy 3/4 và thảm sát dân thường', 2, 'grief'], [1950, ['Busan'], 'Busan thành thủ đô tạm thời, người tị nạn dồn về', 2, ''], [1980, ['Gwangju'], 'khởi nghĩa dân chủ bị quân đội đàn áp', 2, 'grief'],
    [1988, ['Seoul'], 'Thế vận hội Seoul', 2, 'joy'], [2002, ['Busan'], 'Đại hội Thể thao châu Á', 1, 'joy'], [2003, ['Daegu'], 'hỏa hoạn tàu điện ngầm', 2, 'grief'], [2014, ['Incheon'], 'Đại hội Thể thao châu Á', 1, ''],
    [2020, ['Daegu'], 'ổ dịch COVID-19 lớn đầu tiên', 2, 'grief'], [2022, ['Seoul'], 'thảm kịch đám đông Itaewon', 2, 'grief']]);
  reg('KR', [[['Ulsan', 'Changwon'], 1970, 2025, 'thành phố công nghiệp nặng', 'Xưởng đóng tàu, nhà máy ô tô Hyundai, hóa dầu; công nhân sống trong khu nhà của công ty'],
    [['Suwon'], 1980, 2025, 'thủ phủ Samsung', 'Khu tổ hợp điện tử Samsung, kỹ sư trẻ và căn hộ mới'], [['Jeju'], 1990, 2025, 'đảo du lịch', 'Tuần trăng mật, khách Trung Quốc, nữ thợ lặn haenyeo']]);

  ev('ID', [[1908, 'tổ chức Budi Utomo ra đời'], [1928, 'Lời thề Thanh niên về một dân tộc, một ngôn ngữ'], [1942, 'Nhật chiếm Đông Ấn thuộc Hà Lan', 2, 'grief'], [1947, 'Hà Lan mở chiến dịch quân sự'], [1950, 'trở thành nhà nước đơn nhất'], [1959, 'Sukarno áp đặt “dân chủ có chỉ đạo”'],
    [1963, 'tiếp quản Tây Papua'], [1967, 'Suharto nắm quyền tổng thống'], [1975, 'đưa quân vào Đông Timor'], [1997, 'khủng hoảng tiền tệ, đồng rupiah mất giá mạnh', 2, 'grief'], [1999, 'bầu cử tự do đầu tiên sau 44 năm; Đông Timor bỏ phiếu độc lập'],
    [2004, 'bầu tổng thống trực tiếp lần đầu'], [2005, 'hiệp định hòa bình Aceh'], [2006, 'động đất Yogyakarta', 1, 'grief'], [2010, 'núi lửa Merapi phun trào', 1, 'grief'], [2014, 'Joko Widodo đắc cử tổng thống'], [2019, 'quyết định dời thủ đô sang Kalimantan'],
    [2022, 'thảm kịch sân vận động Kanjuruhan', 1, 'grief'], [2024, 'Prabowo Subianto đắc cử tổng thống'], [2025, 'biểu tình lớn cuối tháng 8 về phụ cấp của nghị sĩ']]);
  rev('ID', [[1945, ['Surabaya'], 'trận Surabaya chống quân Anh', 2, 'grief'], [1998, ['Jakarta'], 'bạo loạn tháng Năm, Suharto từ chức', 2, 'grief'], [2002, ['Denpasar'], 'đánh bom hộp đêm ở Kuta', 2, 'grief'], [2006, ['Yogyakarta'], 'động đất', 2, 'grief'],
    [2010, ['Yogyakarta'], 'núi lửa Merapi phun trào', 2, 'grief'], [2018, ['Palembang', 'Jakarta'], 'Đại hội Thể thao châu Á', 1, 'joy'], [2018, ['Surabaya'], 'đánh bom nhà thờ', 1, 'grief'], [2018, ['Makassar'], 'đón người sơ tán từ động đất Palu', 1, '']]);
  reg('ID', [[['Jakarta'], 1970, 2025, 'siêu đô thị chìm dần', 'Kẹt xe, ngập lụt, đất lún; nhiều người từ các đảo khác đến tìm việc'], [['Denpasar'], 1970, 2025, 'Bali du lịch', 'Đền chùa Hindu, khách sạn ven biển, ruộng bậc thang']]);

  ev('PK', [[1956, 'hiến pháp đầu tiên, tên nước Cộng hòa Hồi giáo'], [1958, 'tướng Ayub Khan đảo chính'], [1965, 'chiến tranh với Ấn Độ'], [1967, 'thủ đô mới Islamabad'], [1970, 'cuộc tổng tuyển cử đầu tiên; bão Bhola ở Đông Pakistan', 2], [1977, 'tướng Zia-ul-Haq đảo chính'],
    [1988, 'Zia tử nạn máy bay; Benazir Bhutto thành nữ thủ tướng đầu tiên của một nước Hồi giáo', 2], [1999, 'tướng Musharraf đảo chính'], [2008, 'Musharraf từ chức'], [2011, 'Osama bin Laden bị tiêu diệt ở Abbottabad'], [2018, 'Imran Khan làm thủ tướng'],
    [2023, 'Imran Khan bị bắt, bạo loạn ngày 9/5'], [2024, 'cuộc tổng tuyển cử gây tranh cãi'], [2025, 'xung đột quân sự ngắn với Ấn Độ tháng 5', 1, '']]);
  rev('PK', [[1995, ['Karachi'], 'bạo lực sắc tộc và giao tranh ở các khu phố', 1, 'grief'], [2007, ['Islamabad'], 'cuộc vây hãm Lal Masjid', 1, 'grief'], [2007, ['Rawalpindi'], 'Benazir Bhutto bị ám sát sau buổi mít tinh', 2, 'grief'],
    [2009, ['Peshawar'], 'loạt đánh bom liên tiếp', 1, 'grief'], [2013, ['Quetta'], 'đánh bom nhắm vào người Hazara', 1, 'grief'], [2014, ['Peshawar'], 'tấn công trường học quân đội', 2, 'grief'], [2023, ['Peshawar'], 'đánh bom thánh đường trong khu cảnh sát', 1, 'grief']]);
  reg('PK', [[['Islamabad'], 1967, 2025, 'thủ đô xây mới', 'Thành phố quy hoạch dưới chân đồi Margalla, công chức và đại sứ quán'], [['Peshawar', 'Quetta'], 1979, 2025, 'vùng biên giới với Afghanistan', 'Trại tị nạn Afghanistan, chợ biên giới; bạo lực của các nhóm vũ trang']]);

  ev('BD', [[1988, 'đại hồng thủy nhấn chìm phần lớn đất nước', 2, 'grief'], [1990, 'phong trào lật đổ tướng Ershad'], [1998, 'lũ lụt kéo dài nhiều tháng', 1, 'grief'], [2007, 'bão Sidr; chính phủ lâm thời do quân đội hậu thuẫn', 1, 'grief'], [2009, 'Sheikh Hasina trở lại; binh biến lực lượng biên phòng'],
    [2016, 'tấn công quán cà phê Holey Artisan ở Dhaka', 1, 'grief'], [2021, 'kỷ niệm 50 năm độc lập'], [2025, 'chính phủ lâm thời của Muhammad Yunus chuẩn bị bầu cử']]);
  rev('BD', [[1971, ['Dhaka'], 'chiến dịch Searchlight đêm 25/3', 2, 'grief'], [1991, ['Chittagong'], 'siêu bão đổ bộ', 2, 'grief'], [2013, ['Dhaka'], 'sập tòa nhà Rana Plaza ở Savar', 2, 'grief'], [2017, ['Chittagong'], 'hàng trăm nghìn người Rohingya tới Cox\'s Bazar', 2, '']]);

  ev('PH', [[1935, 'Thịnh vượng chung Philippines tự trị'], [1942, 'cuộc hành quân chết chóc Bataan', 2, 'grief'], [1953, 'Ramon Magsaysay đắc cử'], [1965, 'Ferdinand Marcos đắc cử'], [1987, 'hiến pháp mới; chìm phà Doña Paz', 1, 'grief'], [1990, 'động đất Luzon', 1, 'grief'],
    [1998, 'Joseph Estrada đắc cử'], [2001, 'cách mạng EDSA lần hai'], [2009, 'bão Ketsana gây ngập Manila'], [2010, 'Benigno Aquino III đắc cử'], [2017, 'giao tranh ở Marawi'], [2019, 'đăng cai SEA Games'], [2020, 'núi lửa Taal phun trào']]);
  rev('PH', [[1945, ['Manila', 'Quezon City'], 'trận Manila tàn phá thủ đô', 2, 'grief'], [1990, ['Baguio'], 'động đất tàn phá thành phố', 2, 'grief'], [2009, ['Manila', 'Quezon City', 'Caloocan'], 'lũ bão Ondoy', 2, 'grief'],
    [2013, ['Zamboanga'], 'cuộc vây hãm thành phố', 1, 'grief'], [2013, ['Cebu', 'Iloilo'], 'động đất Bohol và siêu bão Haiyan', 2, 'grief'], [2016, ['Davao'], 'thị trưởng Rodrigo Duterte của Davao trở thành tổng thống', 1, '']]);

  ev('TH', [[1917, 'tham gia Thế chiến I bên phe Đồng minh'], [1941, 'quân Nhật vào Thái Lan'], [1957, 'thống chế Sarit đảo chính'], [1966, 'Bangkok đăng cai Đại hội Thể thao châu Á'], [1991, 'đảo chính quân sự'], [2001, 'Thaksin Shinawatra thắng cử'],
    [2008, 'phe áo vàng chiếm sân bay Bangkok'], [2019, 'bầu cử; lễ đăng quang Vua Vajiralongkorn'], [2020, 'thanh niên biểu tình đòi cải cách'], [2023, 'bầu cử, Srettha Thavisin làm thủ tướng'], [2024, 'Paetongtarn Shinawatra làm thủ tướng'], [2025, 'xung đột biên giới với Campuchia tháng 7', 1, 'grief']]);
  rev('TH', [[2004, ['Phuket'], 'sóng thần tàn phá bờ biển', 2, 'grief'], [2004, ['Hat Yai'], 'bạo lực ly khai bùng phát lại ở miền cực nam', 1, 'grief'], [2010, ['Bangkok'], 'giải tán người biểu tình áo đỏ', 2, 'grief'], [2011, ['Bangkok'], 'đại lũ', 2, 'grief'], [2023, ['Bangkok'], 'xả súng ở trung tâm thương mại Siam Paragon', 1, 'grief']]);
  reg('TH', [[['Hat Yai'], 2004, 2025, 'vùng xung đột miền cực nam', 'Phiến quân ly khai, trạm kiểm soát quân đội ở Pattani, Yala, Narathiwat'], [['Pattaya', 'Phuket'], 1975, 2025, 'thành phố du lịch biển', 'Khách sạn, quán bar, du khách khắp thế giới']]);

  ev('MM', [[1930, 'cuộc nổi dậy nông dân Saya San'], [1936, 'sinh viên bãi khóa'], [1974, 'hiến pháp xã hội chủ nghĩa'], [1990, 'NLD thắng cử nhưng quân đội không trao quyền'], [1991, 'Aung San Suu Kyi đoạt Nobel Hòa bình'], [2005, 'dời thủ đô về Naypyidaw'],
    [2010, 'Aung San Suu Kyi được trả tự do'], [2016, 'tổng thống dân sự đầu tiên sau hơn 50 năm']]);
  rev('MM', [[1988, ['Yangon'], 'biểu tình 8888 bị bắn vào đám đông', 2, 'grief'], [2008, ['Yangon'], 'bão Nargis tàn phá', 2, 'grief'], [2021, ['Yangon', 'Mandalay'], 'biểu tình phản đối đảo chính bị đàn áp', 2, 'grief'], [2025, ['Mandalay', 'Naypyidaw'], 'động đất 7,7 độ', 2, 'grief']]);
  reg('MM', [[['Naypyidaw'], 2005, 2025, 'thủ đô hành chính mới', 'Đại lộ rộng mênh mông, công chức sống trong khu nhà phân theo màu mái']]);

  ev('MY', [[1941, 'Nhật đổ bộ Kota Bharu'], [1948, 'ban bố tình trạng khẩn cấp'], [1981, 'Mahathir Mohamad làm thủ tướng'], [1996, 'tháp đôi Petronas hoàn thành'], [2003, 'Mahathir nghỉ hưu sau 22 năm'], [2008, 'liên minh cầm quyền mất đa số hai phần ba'], [2020, 'khủng hoảng chính trị, thay chính phủ'], [2022, 'Anwar Ibrahim làm thủ tướng']]);
  rev('MY', [[1998, ['Kuala Lumpur'], 'phong trào Reformasi sau khi Anwar Ibrahim bị cách chức', 1, ''], [2013, ['Kota Kinabalu'], 'cuộc đối đầu Lahad Datu ở Sabah', 1, ''], [2014, ['Kuala Lumpur'], 'chuyến bay MH370 mất tích', 2, 'grief']]);
  reg('MY', [[['Kuching', 'Kota Kinabalu'], 1963, 2025, 'Sarawak và Sabah trên đảo Borneo', 'Rừng mưa, dầu cọ, gỗ; nhiều dân tộc bản địa, tự trị hơn bán đảo']]);

  ev('IR', [[1908, 'tìm thấy dầu mỏ ở Masjed Soleyman'], [1921, 'Reza Khan đảo chính'], [1925, 'triều Pahlavi lên ngôi'], [1935, 'đổi tên quốc tế từ Ba Tư thành Iran'], [1941, 'Anh và Liên Xô chiếm đóng, Mohammad Reza lên ngôi'], [1951, 'quốc hữu hóa dầu mỏ'],
    [1963, 'Cách mạng Trắng'], [1971, 'lễ kỷ niệm 2.500 năm đế quốc Ba Tư'], [1978, 'biểu tình lan rộng chống nhà vua'], [1990, 'động đất Manjil – Rudbar', 2, 'grief'], [1997, 'Mohammad Khatami đắc cử'], [2005, 'Mahmoud Ahmadinejad đắc cử'], [2009, 'Phong trào Xanh sau bầu cử'],
    [2013, 'Hassan Rouhani đắc cử'], [2018, 'Mỹ rút khỏi thỏa thuận hạt nhân, tái áp lệnh trừng phạt'], [2020, 'tướng Soleimani bị giết; máy bay Ukraine bị bắn nhầm', 1, 'grief'], [2024, 'Tổng thống Raisi tử nạn trực thăng']]);
  rev('IR', [[1980, ['Ahvaz'], 'Iraq tấn công tỉnh Khuzestan', 2, 'grief'], [1978, ['Tehran'], 'ngày Thứ Sáu Đen', 2, 'grief'], [2009, ['Tehran'], 'biểu tình lớn trên đường phố', 1, ''], [2017, ['Tabriz'], 'động đất biên giới Iran – Iraq', 1, 'grief']]);

  ev('TR', [[1908, 'cách mạng Thanh niên Thổ khôi phục hiến pháp'], [1912, 'chiến tranh Balkan'], [1922, 'bãi bỏ vương triều Ottoman'], [1924, 'bãi bỏ chức Caliph'], [1934, 'phụ nữ được đi bầu; luật bắt buộc dùng họ'], [1939, 'động đất Erzincan', 1, 'grief'],
    [1946, 'chế độ đa đảng'], [1950, 'Đảng Dân chủ thắng cử'], [1952, 'gia nhập NATO'], [1971, 'quân đội ra tối hậu thư buộc chính phủ từ chức'], [1984, 'PKK bắt đầu nổi dậy vũ trang'], [1997, 'quân đội ép chính phủ Hồi giáo từ chức'],
    [2001, 'khủng hoảng tài chính'], [2002, 'Đảng AKP thắng cử'], [2005, 'bắt đầu đàm phán gia nhập EU'], [2013, 'biểu tình công viên Gezi'], [2017, 'trưng cầu chuyển sang chế độ tổng thống'], [2018, 'khủng hoảng tiền tệ, đồng lira mất giá'], [2025, 'thị trưởng Istanbul Ekrem İmamoğlu bị bắt, biểu tình lan rộng']]);
  rev('TR', [[1999, ['Istanbul', 'Bursa'], 'động đất Marmara', 2, 'grief'], [2016, ['Istanbul'], 'tấn công sân bay Atatürk', 1, 'grief'], [2023, ['Gaziantep', 'Adana', 'Diyarbakır'], 'động đất Kahramanmaraş', 2, 'grief']]);
  reg('TR', [[['Diyarbakır'], 1984, 1999, 'vùng xung đột đông nam', 'Giao tranh giữa quân đội và PKK, nhiều làng người Kurd bị dời đi'], [['Diyarbakır'], 2015, 2016, 'giao tranh đô thị', 'Lệnh giới nghiêm ở khu phố cổ Sur'],
    [['Istanbul'], 1923, 2025, 'đô thị lớn nhất nối hai châu lục', 'Thủ đô chuyển về Ankara nhưng Istanbul vẫn là trung tâm kinh tế; dân nhập cư từ Anatolia'], [['Ankara'], 1923, 2025, 'thủ đô mới', 'Thành phố công chức xây dựng từ thị trấn nhỏ']]);

  ev('IQ', [[1920, 'cuộc nổi dậy chống Anh'], [1932, 'độc lập, gia nhập Hội Quốc Liên'], [1941, 'đảo chính Rashid Ali, Anh chiếm lại'], [1968, 'đảng Baath lên nắm quyền'], [1972, 'quốc hữu hóa dầu mỏ'], [1979, 'Saddam Hussein làm tổng thống'], [1990, 'xâm chiếm Kuwait, bị cấm vận', 2],
    [2005, 'bầu cử và hiến pháp mới'], [2006, 'đánh bom đền Samarra, xung đột giáo phái; Saddam bị xử tử', 2, 'grief'], [2011, 'quân Mỹ rút'], [2019, 'phong trào biểu tình Tishreen'], [2021, 'Giáo hoàng Phanxicô thăm Iraq']]);
  rev('IQ', [[1991, ['Erbil', 'Sulaymaniyah'], 'người Kurd nổi dậy, vùng tự trị hình thành dưới vùng cấm bay', 2, ''], [1991, ['Basra', 'Najaf', 'Karbala'], 'cuộc nổi dậy của người Shia bị dập tắt', 2, 'grief'], [2007, ['Baghdad'], 'bạo lực giáo phái lên đỉnh điểm', 2, 'grief'],
    [2014, ['Mosul'], 'IS chiếm thành phố', 2, 'grief'], [2017, ['Mosul'], 'Mosul được giải phóng sau chín tháng giao tranh', 2, ''], [2017, ['Erbil', 'Sulaymaniyah'], 'trưng cầu độc lập của người Kurd', 1, '']]);
  reg('IQ', [[['Erbil', 'Sulaymaniyah'], 1992, 2025, 'Khu tự trị Kurdistan', 'Chính quyền khu vực riêng, an toàn hơn phần còn lại, dầu khí và xây dựng']]);

  ev('AF', [[1929, 'vua Amanullah thoái vị sau nổi dậy'], [1933, 'Zahir Shah lên ngôi'], [1964, 'hiến pháp quân chủ lập hiến'], [1973, 'Daoud Khan lật đổ chế độ quân chủ'], [1978, 'cách mạng Saur'], [1992, 'chính quyền Najibullah sụp đổ, nội chiến'],
    [2004, 'hiến pháp mới và bầu cử tổng thống'], [2014, 'bầu cử tổng thống tranh cãi'], [2020, 'thỏa thuận Doha giữa Mỹ và Taliban'], [2022, 'động đất Paktika', 1, 'grief'], [2025, 'động đất ở tỉnh Kunar', 1, 'grief']]);
  rev('AF', [[1994, ['Kabul'], 'giao tranh giữa các phe tàn phá thủ đô', 2, 'grief'], [2001, ['Kandahar'], 'Taliban rời thành phố cuối cùng', 1, ''], [2021, ['Kabul'], 'đánh bom sân bay giữa cuộc di tản', 2, 'grief'], [2023, ['Herat'], 'động đất', 2, 'grief']]);

  ev('SA', [[1902, 'Ibn Saud chiếm Riyadh'], [1924, 'chiếm Hejaz cùng Mecca'], [1953, 'Ibn Saud qua đời'], [1973, 'cấm vận dầu mỏ với phương Tây'], [1975, 'vua Faisal bị ám sát'], [2005, 'vua Abdullah lên ngôi'], [2015, 'vua Salman lên ngôi; can thiệp quân sự ở Yemen'],
    [2017, 'Mohammed bin Salman làm thái tử, chiến dịch bắt giữ ở Ritz-Carlton'], [2019, 'tấn công cơ sở dầu Abqaiq; mở cửa du lịch'], [2024, 'được trao quyền đăng cai World Cup 2034']]);
  rev('SA', [[1979, ['Mecca'], 'nhóm vũ trang chiếm Đại Thánh đường', 2, 'grief'], [1990, ['Mecca'], 'giẫm đạp trong đường hầm khi hành hương', 1, 'grief'], [2015, ['Mecca'], 'thảm kịch giẫm đạp ở Mina', 2, 'grief'], [2009, ['Jeddah'], 'lũ quét', 1, 'grief']]);

  ev('NP', [[1990, 'phong trào nhân dân đưa lại chế độ đa đảng'], [1996, 'phái Maoist khởi đầu nổi dậy'], [2006, 'hiệp định hòa bình chấm dứt nội chiến'], [2025, 'biểu tình của thế hệ Z, thủ tướng Oli từ chức']]);
  ev('LK', [[1931, 'phổ thông đầu phiếu'], [1956, 'luật chỉ dùng tiếng Sinhala'], [1960, 'Sirimavo Bandaranaike thành nữ thủ tướng đầu tiên thế giới'], [1971, 'nổi dậy của JVP'], [1987, 'hiệp định Ấn Độ – Sri Lanka'], [1989, 'JVP nổi dậy lần hai bị đàn áp', 1, 'grief'], [2024, 'Anura Kumara Dissanayake đắc cử tổng thống']]);
  reg('LK', [[['Jaffna', 'Batticaloa'], 1983, 2009, 'vùng nội chiến', 'Giao tranh giữa quân đội và LTTE, cấm vận nhiên liệu, nhiều gia đình người Tamil chạy sang Ấn Độ, phương Tây']]);
  rev('LK', [[1995, ['Jaffna'], 'quân đội chiếm lại Jaffna, dân sơ tán ồ ạt', 2, 'grief'], [2004, ['Galle', 'Batticaloa'], 'sóng thần', 2, 'grief'], [2019, ['Colombo', 'Negombo', 'Batticaloa'], 'đánh bom nhà thờ và khách sạn ngày Phục sinh', 2, 'grief']]);
  ev('KH', [[1997, 'giao tranh ở Phnôm Pênh'], [2013, 'bầu cử gây tranh cãi'], [2025, 'xung đột biên giới với Thái Lan', 1, 'grief']]);
  rev('KH', [[1975, ['Phnôm Pênh'], 'Khmer Đỏ buộc toàn thành phố di tản', 2, 'grief'], [1992, ['Siem Reap'], 'Angkor được công nhận Di sản Thế giới', 1, 'joy']]);
  ev('LA', [[2018, 'vỡ đập thủy điện ở Attapeu', 1, 'grief']]);
  ev('KZ', [[1949, 'vụ thử hạt nhân đầu tiên ở Semipalatinsk'], [1961, 'Gagarin bay vào vũ trụ từ Baikonur'], [1997, 'dời thủ đô về Akmola (Astana)'], [2019, 'Nursultan Nazarbayev từ chức, thủ đô đổi tên Nur-Sultan'], [2022, 'thủ đô trở lại tên Astana']]);
  ev('UZ', [[2023, 'hiến pháp mới được thông qua']]);
  ev('SY', [[1920, 'trận Maysalun, Pháp chiếm Damascus'], [1958, 'hợp nhất với Ai Cập thành Cộng hòa Ả Rập Thống nhất'], [1963, 'đảng Baath lên nắm quyền'], [1967, 'mất cao nguyên Golan', 2], [1970, 'Hafez al-Assad nắm quyền'], [2000, 'Hafez qua đời, Bashar al-Assad lên thay'],
    [2013, 'tấn công hóa học ở Ghouta', 2, 'grief'], [2015, 'Nga can thiệp quân sự'], [2025, 'bạo lực ở vùng ven biển; chính quyền chuyển tiếp', 1, 'grief']]);
  rev('SY', [[2012, ['Aleppo'], 'giao tranh chia đôi thành phố', 2, 'grief'], [2016, ['Aleppo'], 'quân chính phủ chiếm lại phía đông Aleppo', 2, 'grief'], [2014, ['Homs'], 'phe nổi dậy rời phố cổ Homs sau cuộc vây hãm', 2, 'grief'], [2017, ['Deir ez-Zor'], 'kết thúc cuộc vây hãm của IS', 1, '']]);
  ev('YE', [[1994, 'nội chiến ngắn giữa hai miền'], [2011, 'biểu tình Mùa xuân Ả Rập, tổng thống Saleh từ chức'], [2014, 'phe Houthi chiếm Sana\'a'], [2023, 'phe Houthi tấn công tàu trên Biển Đỏ']]);
  ev('IL', [[1956, 'khủng hoảng Suez'], [1977, 'Menachem Begin thắng cử; Tổng thống Ai Cập Sadat đến Jerusalem'], [1982, 'chiến tranh Liban'], [1987, 'Intifada lần một'], [1991, 'tên lửa Scud của Iraq bắn vào Israel'], [2000, 'Intifada lần hai'], [2005, 'rút khỏi Dải Gaza'], [2006, 'chiến tranh với Hezbollah'], [2014, 'chiến tranh Gaza']]);
  ev('KP', [[2017, 'thử tên lửa xuyên lục địa và bom nhiệt hạch']]);
  ev('MN', [[1924, 'thành lập Cộng hòa Nhân dân Mông Cổ'], [1961, 'gia nhập Liên Hợp Quốc'], [1992, 'hiến pháp dân chủ'], [2022, 'biểu tình phản đối tham nhũng trong xuất khẩu than']]);
  ev('SG', [[2010, 'Thế vận hội Trẻ đầu tiên'], [2024, 'Lawrence Wong làm thủ tướng']]);
})(globalThis.G);
