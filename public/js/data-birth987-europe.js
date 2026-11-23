/* Một Đời — 9.8.8 dữ liệu bối cảnh theo nước và năm: châu Âu và Liên Xô cũ (trừ Trung Á).
   [từ, đến, giai đoạn, đời sống thường ngày] và [năm, sự kiện, mức 1|2, 'joy'|'grief'|'']. Nguồn thứ cấp, đối chiếu 23/11/2026. */
(function (G) {
  'use strict';
  var D = G.BIRTH987 || (G.BIRTH987 = { ERA: {}, EV: {}, WORLD: [] });
  function add(cc, eras, evs) { D.ERA[cc] = (D.ERA[cc] || []).concat(eras); D.EV[cc] = (D.EV[cc] || []).concat(evs || []); }
  var EU_EARLY = [1900, 1913, 'Belle Époque trước Thế chiến', 'Đường sắt, điện và nhà máy lan rộng; phần đông vẫn sống bằng nông nghiệp hoặc làm thợ, nhiều người di cư sang châu Mỹ'];
  var WWI = [1914, 1918, 'Chiến tranh thế giới thứ nhất', 'Đàn ông ra mặt trận, phụ nữ vào nhà máy; tem phiếu thực phẩm và tin báo tử về từng làng'];
  var INTER = [1919, 1938, 'giữa hai cuộc chiến', 'Cúm Tây Ban Nha, lạm phát rồi Đại suy thoái 1929; radio và điện ảnh trở thành giải trí đại chúng'];
  var WWII = [1939, 1945, 'Chiến tranh thế giới thứ hai', 'Tem phiếu, thiếu ăn, bom đạn hoặc chiếm đóng; nhiều gia đình ly tán'];

  // ===== Tây và Bắc Âu =====
  add('GB', [EU_EARLY, WWI, INTER, WWII,
    [1946, 1959, 'hậu chiến và nhà nước phúc lợi', 'Tem phiếu kéo dài tới 1954, Dịch vụ Y tế Quốc gia (NHS) miễn phí; tái thiết nhà ở công'],
    [1960, 1978, 'thập niên 1960 sôi động và suy giảm công nghiệp', 'Nhạc pop, truyền hình màu; cuối thập niên 1970 đình công và lạm phát'],
    [1979, 1996, 'thời Thatcher và hậu Thatcher', 'Tư nhân hóa, mỏ than đóng cửa, London tài chính bùng nổ; thất nghiệp cao ở miền bắc'],
    [1997, 2007, 'thời New Labour', 'Kinh tế ổn định, đầu tư cho trường học và bệnh viện; Internet và điện thoại di động phổ biến'],
    [2008, 2015, 'khủng hoảng tài chính và thắt lưng buộc bụng', 'Cắt giảm chi tiêu công, lương thực tế đứng yên'],
    [2016, 2025, 'Brexit và hậu đại dịch', 'Rời Liên minh châu Âu, đại dịch, giá sinh hoạt tăng vọt từ 2022']
  ], [[1901, 'Nữ hoàng Victoria qua đời', 1, ''], [1918, 'phụ nữ trên 30 tuổi được đi bầu', 1, ''], [1926, 'tổng đình công', 1, ''], [1940, 'trận chiến nước Anh và đợt ném bom London', 2, 'grief'], [1945, 'chiến thắng ở châu Âu', 2, 'joy'], [1948, 'thành lập NHS; Olympic London', 2, ''],
    [1953, 'lễ đăng quang Nữ hoàng Elizabeth II', 2, 'joy'], [1966, 'đội tuyển Anh vô địch World Cup', 2, 'joy'], [1973, 'gia nhập Cộng đồng châu Âu', 1, ''], [1982, 'chiến tranh Falklands', 1, ''], [1984, 'cuộc đình công của thợ mỏ', 1, ''],
    [1997, 'Công nương Diana qua đời; Hồng Kông được trao trả', 2, 'grief'], [1998, 'Hiệp định Thứ Sáu Tuần Thánh ở Bắc Ireland', 1, 'joy'], [2005, 'đánh bom London ngày 7/7', 2, 'grief'], [2012, 'Olympic London', 2, 'joy'],
    [2016, 'trưng cầu dân ý chọn rời EU', 2, ''], [2020, 'chính thức rời EU; đại dịch COVID-19', 2, 'grief'], [2022, 'Nữ hoàng Elizabeth II băng hà', 2, 'grief'], [2023, 'lễ đăng quang Vua Charles III', 1, '']]);

  add('IE', [[1900, 1915, 'Ireland trong Vương quốc Anh', 'Nông thôn nghèo, di cư sang Mỹ và Anh; phong trào đòi tự trị'],
    [1916, 1923, 'khởi nghĩa, độc lập và nội chiến', 'Khởi nghĩa Phục sinh, chiến tranh độc lập rồi nội chiến'],
    [1924, 1958, 'nhà nước tự do và cộng hòa nông nghiệp', 'Giáo hội có ảnh hưởng lớn, kinh tế khép kín, di cư kéo dài'],
    [1959, 1972, 'mở cửa kinh tế', 'Đầu tư nước ngoài, giáo dục trung học miễn phí từ 1967'],
    [1973, 1993, 'gia nhập châu Âu và khó khăn thập niên 1980', 'Thất nghiệp cao, thế hệ trẻ lại di cư'],
    [1994, 2007, 'Con hổ Celtic', 'Công ty công nghệ đặt trụ sở, giá nhà tăng vọt, người nhập cư đến làm việc'],
    [2008, 2013, 'khủng hoảng ngân hàng', 'Gói cứu trợ của EU và IMF, cắt giảm sâu'],
    [2014, 2025, 'phục hồi và xã hội thế tục hơn', 'Thiếu nhà ở trầm trọng; trưng cầu dân ý thay đổi luật hôn nhân và phá thai']],
    [[1916, 'khởi nghĩa Phục sinh ở Dublin', 2, ''], [1922, 'thành lập Nhà nước Tự do Ireland', 2, ''], [1949, 'trở thành nước cộng hòa', 1, ''], [1972, 'Ngày Chủ nhật Đẫm máu ở Bắc Ireland', 1, 'grief'], [1990, 'đội tuyển vào tứ kết World Cup', 1, 'joy'], [1998, 'Hiệp định Thứ Sáu Tuần Thánh', 2, 'joy'], [2015, 'trưng cầu dân ý thông qua hôn nhân cùng giới', 1, '']]);

  add('FR', [EU_EARLY, WWI, INTER,
    [1939, 1944, 'chiến tranh và Pháp bị chiếm đóng', 'Chính quyền Vichy, tem phiếu, kháng chiến; người Do Thái bị bắt đưa đi'],
    [1945, 1973, 'Ba mươi năm vinh quang', 'Tái thiết, tăng trưởng mạnh, nhà ở xã hội, xe hơi và ti vi vào từng nhà; chiến tranh thuộc địa ở Đông Dương và Algeria'],
    [1974, 2007, 'Pháp hiện đại sau khủng hoảng dầu mỏ', 'Thất nghiệp kéo dài, tàu cao tốc TGV, tuần làm việc 35 giờ; đồng euro thay franc'],
    [2008, 2019, 'khủng hoảng và các cuộc tấn công khủng bố', 'Kinh tế chậm, biểu tình áo vàng 2018'],
    [2020, 2025, 'đại dịch và bất ổn chính trị', 'Cải cách hưu trí gây biểu tình 2023; Olympic Paris 2024; quốc hội chia rẽ']],
    [[1905, 'luật tách nhà thờ khỏi nhà nước', 1, ''], [1916, 'trận Verdun', 2, 'grief'], [1936, 'Mặt trận Bình dân, công nhân có kỳ nghỉ có lương', 1, 'joy'], [1940, 'Pháp thất thủ', 2, 'grief'], [1944, 'giải phóng Paris', 2, 'joy'],
      [1954, 'thua ở Điện Biên Phủ; chiến tranh Algeria bắt đầu', 1, ''], [1958, 'nền Cộng hòa thứ Năm', 1, ''], [1962, 'Algeria độc lập, người hồi hương ồ ạt', 1, ''], [1968, 'biến cố tháng Năm 1968', 2, ''], [1981, 'tàu TGV đầu tiên; bãi bỏ án tử hình', 1, ''],
      [1998, 'vô địch World Cup', 2, 'joy'], [2002, 'đồng euro thay đồng franc', 1, ''], [2015, 'tấn công khủng bố Charlie Hebdo và Paris', 2, 'grief'], [2016, 'tấn công bằng xe tải ở Nice', 1, 'grief'], [2018, 'vô địch World Cup lần hai; phong trào áo vàng', 1, 'joy'], [2019, 'cháy Nhà thờ Đức Bà Paris', 2, 'grief'], [2024, 'Olympic Paris', 2, 'joy']]);

  add('DE', [EU_EARLY, WWI,
    [1919, 1932, 'Cộng hòa Weimar', 'Siêu lạm phát 1923, những năm 1920 sôi động rồi Đại suy thoái với hàng triệu người thất nghiệp'],
    [1933, 1945, 'chế độ Quốc xã và Thế chiến II', 'Đàn áp, diệt chủng người Do Thái; cuối chiến tranh thành phố đổ nát'],
    [1946, 1949, 'chiếm đóng và đổ nát', 'Người tị nạn từ phía đông, chợ đen, cải cách tiền tệ 1948'],
    [1950, 1972, 'phép màu kinh tế ở Tây Đức; xã hội chủ nghĩa ở Đông Đức', 'Tây Đức tái thiết nhanh, đón lao động khách; Đông Đức theo kinh tế kế hoạch và bị Bức tường chia cắt từ 1961'],
    [1973, 1989, 'hai nhà nước Đức', 'Tây Đức thịnh vượng, Đông Đức thiếu hàng tiêu dùng và có cảnh sát chìm Stasi'],
    [1990, 2004, 'thống nhất và chuyển đổi', 'Miền đông mất nhiều việc làm, đồng tiền chung'],
    [2005, 2019, 'nước Đức thời Merkel', 'Thất nghiệp giảm, xuất khẩu mạnh; đón hơn một triệu người tị nạn năm 2015'],
    [2020, 2025, 'đại dịch và khủng hoảng năng lượng', 'Giá điện, khí đốt tăng sau chiến tranh Ukraine; kinh tế trì trệ']],
    [[1923, 'siêu lạm phát', 2, 'grief'], [1933, 'Hitler lên nắm quyền', 2, ''], [1936, 'Olympic Berlin', 1, ''], [1938, 'Đêm Thủy tinh', 2, 'grief'], [1945, 'Đức đầu hàng, chia vùng chiếm đóng', 2, 'grief'], [1948, 'cầu hàng không Berlin', 1, ''],
      [1949, 'thành lập Tây Đức và Đông Đức', 2, ''], [1953, 'cuộc nổi dậy ở Đông Đức', 1, 'grief'], [1954, 'Tây Đức vô địch World Cup', 2, 'joy'], [1961, 'xây Bức tường Berlin', 2, 'grief'], [1972, 'Olympic Munich và vụ bắt cóc con tin', 1, 'grief'],
      [1974, 'Tây Đức vô địch World Cup trên sân nhà', 1, 'joy'], [1989, 'Bức tường Berlin sụp đổ', 2, 'joy'], [1990, 'nước Đức thống nhất; vô địch World Cup', 2, 'joy'], [2006, 'đăng cai World Cup', 1, 'joy'], [2014, 'vô địch World Cup lần thứ tư', 1, 'joy'], [2015, 'đón làn sóng người tị nạn', 1, '']]);

  add('NL', [EU_EARLY, [1914, 1939, 'trung lập và giữa hai cuộc chiến', 'Không tham chiến năm 1914–1918; Đại suy thoái và xây đê Afsluitdijk'], [1940, 1945, 'Đức chiếm đóng', 'Mùa đông đói 1944–1945, người Do Thái bị trục xuất'],
    [1946, 1972, 'tái thiết và nhà nước phúc lợi', 'Dự án Delta chống lũ sau trận lụt 1953; khí đốt Groningen'], [1973, 2007, 'xã hội khoan dung, kinh tế mở', 'Xe đạp, cảng Rotterdam, chính sách tự do về ma túy nhẹ và an tử'],
    [2008, 2025, 'thịnh vượng và tranh luận nhập cư', 'Thiếu nhà ở, chính trường phân mảnh']],
    [[1940, 'Rotterdam bị ném bom', 2, 'grief'], [1945, 'giải phóng', 2, 'joy'], [1953, 'đại lụt Biển Bắc', 2, 'grief'], [2001, 'nước đầu tiên hợp pháp hóa hôn nhân cùng giới', 1, ''], [2013, 'Vua Willem-Alexander lên ngôi', 1, '']]);

  add('BE', [EU_EARLY, WWI, INTER, WWII, [1946, 1972, 'tái thiết và mất Congo', 'Than đá, thép ở Wallonie; Congo độc lập năm 1960'], [1973, 1992, 'suy giảm công nghiệp và liên bang hóa', 'Căng thẳng giữa người nói tiếng Hà Lan và tiếng Pháp'],
    [1993, 2025, 'nhà nước liên bang, thủ đô châu Âu', 'Brussels có các cơ quan EU và NATO; chính phủ thành lập rất chậm']],
    [[1914, 'Đức xâm chiếm Bỉ', 2, 'grief'], [1958, 'Expo Brussels', 1, 'joy'], [1960, 'Congo độc lập', 1, ''], [1993, 'Vua Baudouin qua đời; Bỉ thành nhà nước liên bang', 1, ''], [2016, 'tấn công khủng bố Brussels', 2, 'grief']]);

  add('LU', [EU_EARLY, WWI, INTER, WWII, [1946, 1974, 'thép và thành viên sáng lập châu Âu', 'Ngành thép Arbed nuôi sống đất nước'], [1975, 2025, 'trung tâm tài chính giàu có', 'Ngân hàng, quỹ đầu tư, nhiều người qua biên giới đến làm việc mỗi ngày']],
    [[1940, 'Đức chiếm đóng', 2, 'grief'], [1952, 'trụ sở Cộng đồng Than Thép châu Âu đặt tại Luxembourg', 1, ''], [2020, 'giao thông công cộng miễn phí toàn quốc', 1, 'joy']]);

  add('CH', [EU_EARLY, [1914, 1945, 'trung lập giữa hai cuộc thế chiến', 'Huy động quân đội bảo vệ biên giới, tem phiếu, đón người tị nạn có giới hạn'], [1946, 1990, 'thịnh vượng trung lập', 'Ngân hàng, đồng hồ, dược phẩm; phụ nữ chỉ được bầu cử liên bang từ 1971'],
    [1991, 2025, 'thu nhập cao nhất châu Âu', 'Hiệp định song phương với EU, giá sinh hoạt rất cao']],
    [[1971, 'phụ nữ có quyền bầu cử liên bang', 1, ''], [2002, 'gia nhập Liên Hợp Quốc', 1, '']]);

  add('AT', [EU_EARLY, WWI, [1919, 1937, 'Cộng hòa Áo thứ nhất', 'Vienna Đỏ xây nhà ở công nhân; nội chiến ngắn 1934'], [1938, 1945, 'sáp nhập vào Đức Quốc xã', 'Người Do Thái bị tước tài sản và trục xuất; chiến tranh'],
    [1946, 1955, 'chiếm đóng bốn nước', 'Tái thiết dưới sự quản lý của Đồng minh'], [1956, 1994, 'trung lập và thịnh vượng', 'Du lịch trượt tuyết, nhà nước phúc lợi'], [1995, 2025, 'thành viên EU', 'Kinh tế ổn định, tranh luận về nhập cư']],
    [[1914, 'Thái tử Franz Ferdinand bị ám sát, Thế chiến bùng nổ', 2, 'grief'], [1918, 'đế quốc Áo – Hung tan rã', 2, ''], [1938, 'sáp nhập vào Đức', 2, 'grief'], [1955, 'Hiệp ước Nhà nước, quân chiếm đóng rút', 2, 'joy'], [1995, 'gia nhập EU', 1, '']]);

  add('DK', [EU_EARLY, [1914, 1939, 'trung lập và cải cách xã hội', 'Hợp tác xã nông nghiệp, phụ nữ đi bầu từ 1915'], [1940, 1945, 'Đức chiếm đóng', 'Người dân đưa người Do Thái trốn sang Thụy Điển năm 1943'],
    [1946, 1972, 'nhà nước phúc lợi Bắc Âu', 'Thuế cao, y tế và giáo dục miễn phí'], [1973, 2025, 'thành viên châu Âu, xã hội bình đẳng', 'Xe đạp, năng lượng gió, mô hình linh hoạt trong việc làm']],
    [[1940, 'Đức chiếm đóng', 2, 'grief'], [1943, 'giải cứu người Do Thái', 1, ''], [1972, 'Nữ hoàng Margrethe II lên ngôi', 1, ''], [1992, 'vô địch Euro bóng đá', 1, 'joy'], [2024, 'Vua Frederik X lên ngôi', 1, '']]);

  add('SE', [EU_EARLY, [1914, 1931, 'trung lập và dân chủ hóa', 'Phổ thông đầu phiếu, di cư sang Mỹ giảm dần'], [1932, 1975, 'mô hình nhà dân', 'Nhà nước phúc lợi, trung lập trong Thế chiến II, xây hàng triệu căn hộ'],
    [1976, 1990, 'phúc lợi mở rộng và thuế cao', 'Thủ tướng Olof Palme bị ám sát năm 1986'], [1991, 2025, 'khủng hoảng ngân hàng và cải cách', 'Thị trường hóa dịch vụ công, nhập cư tăng; gia nhập NATO 2024']],
    [[1986, 'Olof Palme bị ám sát', 2, 'grief'], [1994, 'chìm phà Estonia', 2, 'grief'], [1995, 'gia nhập EU', 1, ''], [2024, 'gia nhập NATO', 1, '']]);

  add('NO', [EU_EARLY, [1914, 1939, 'nước Na Uy mới độc lập', 'Đánh cá, vận tải biển, thủy điện'], [1940, 1945, 'Đức chiếm đóng', 'Kháng chiến và chính quyền Quisling'],
    [1946, 1969, 'tái thiết và phúc lợi', 'Đời sống khiêm tốn, xây dựng phúc lợi'], [1970, 2025, 'quốc gia dầu mỏ giàu có', 'Quỹ dầu mỏ quốc gia, thu nhập cao, xe điện phổ biến']],
    [[1905, 'tách khỏi liên minh với Thụy Điển, độc lập', 2, 'joy'], [1940, 'Đức xâm chiếm', 2, 'grief'], [1969, 'phát hiện mỏ dầu Ekofisk', 1, ''], [1994, 'Olympic mùa đông Lillehammer; từ chối gia nhập EU', 1, ''], [2011, 'thảm sát ở Oslo và đảo Utøya', 2, 'grief']]);

  add('FI', [[1900, 1916, 'Đại công quốc trong Đế quốc Nga', 'Phong trào dân tộc, phụ nữ đi bầu từ 1906'], [1917, 1918, 'độc lập và nội chiến', 'Nội chiến Đỏ – Trắng ngắn nhưng đẫm máu'],
    [1919, 1938, 'nước cộng hòa non trẻ', 'Nông nghiệp và lâm nghiệp'], [1939, 1945, 'chiến tranh Mùa đông và chiến tranh Tiếp diễn', 'Mất Karelia, 400 nghìn người phải tái định cư'],
    [1946, 1990, 'trung lập và tái thiết', 'Trả bồi thường chiến tranh cho Liên Xô, công nghiệp hóa'], [1991, 1993, 'suy thoái sâu', 'Mất thị trường Liên Xô, thất nghiệp gần 20%'],
    [1994, 2025, 'công nghệ và thành viên EU', 'Nokia, giáo dục nổi tiếng; gia nhập NATO 2023']],
    [[1917, 'độc lập ngày 6/12', 2, 'joy'], [1939, 'chiến tranh Mùa đông', 2, 'grief'], [1952, 'Olympic Helsinki', 1, 'joy'], [1995, 'gia nhập EU', 1, ''], [2023, 'gia nhập NATO', 1, '']]);

  add('IS', [[1900, 1917, 'Iceland thuộc Đan Mạch', 'Làng chài và trang trại cừu, đời sống khắc nghiệt'], [1918, 1943, 'vương quốc liên minh với Đan Mạch', 'Đánh cá cơ giới hóa'],
    [1944, 1975, 'cộng hòa độc lập và chiến tranh cá tuyết', 'Quân Mỹ đóng căn cứ, mở rộng vùng đánh cá'], [1976, 2007, 'thịnh vượng và ngân hàng bùng nổ', 'Mức sống cao, du lịch bắt đầu'],
    [2008, 2025, 'sụp đổ ngân hàng và du lịch bùng nổ', 'Phục hồi nhờ du khách; núi lửa hoạt động trên bán đảo Reykjanes']],
    [[1944, 'tuyên bố cộng hòa', 2, 'joy'], [1973, 'núi lửa phun trào trên đảo Heimaey', 1, ''], [1980, 'Vigdís Finnbogadóttir thành nữ tổng thống dân cử đầu tiên thế giới', 1, ''], [2008, 'sụp đổ ngân hàng', 2, 'grief'], [2010, 'núi lửa Eyjafjallajökull làm tê liệt hàng không châu Âu', 1, '']]);

  // ===== Nam Âu =====
  add('IT', [EU_EARLY, WWI, [1919, 1922, 'hai năm đỏ', 'Đình công, chiếm ruộng đất'], [1923, 1943, 'chế độ phát xít Mussolini', 'Đàn áp đối lập, chiến tranh ở Ethiopia rồi Thế chiến'],
    [1944, 1957, 'giải phóng và tái thiết', 'Nước cộng hòa ra đời 1946; miền nam nghèo di cư lên bắc'], [1958, 1968, 'phép màu kinh tế', 'Xe Fiat 500, ti vi, nhà máy ở Turin, Milan'],
    [1969, 1987, 'những năm chì', 'Khủng bố cực tả và cực hữu, lạm phát'], [1988, 2007, 'chuyển đổi chính trị', 'Điều tra tham nhũng Tangentopoli, đồng euro'], [2008, 2025, 'trì trệ và già hóa', 'Thanh niên thất nghiệp, sinh ít con; đại dịch tàn phá miền bắc 2020']],
    [[1908, 'động đất Messina', 2, 'grief'], [1922, 'Mussolini tiến về Rome', 2, ''], [1945, 'giải phóng', 2, 'joy'], [1946, 'trưng cầu dân ý thành lập cộng hòa', 2, ''], [1960, 'Olympic Rome', 1, 'joy'], [1966, 'lũ lụt Florence', 1, 'grief'],
      [1978, 'Aldo Moro bị bắt cóc và sát hại', 2, 'grief'], [1980, 'động đất Irpinia; đánh bom ga Bologna', 2, 'grief'], [1982, 'vô địch World Cup', 2, 'joy'], [2006, 'vô địch World Cup', 2, 'joy'], [2020, 'phong tỏa toàn quốc vì COVID-19', 2, 'grief']]);

  add('ES', [EU_EARLY, [1914, 1930, 'trung lập và độc tài Primo de Rivera', 'Nông thôn nghèo, đình công ở Barcelona'], [1931, 1935, 'Đệ nhị Cộng hòa', 'Cải cách ruộng đất, phụ nữ đi bầu, căng thẳng tả – hữu'],
    [1936, 1939, 'nội chiến Tây Ban Nha', 'Giao tranh, ném bom, hàng trăm nghìn người chết và lưu vong'], [1940, 1958, 'thời Franco hậu chiến', 'Năm đói, tem phiếu, đàn áp'],
    [1959, 1974, 'phép màu kinh tế dưới Franco', 'Du lịch biển, di cư từ nông thôn và đi làm ở Đức, Pháp'], [1975, 1985, 'chuyển tiếp dân chủ', 'Hiến pháp 1978, tự do báo chí; khủng bố ETA'],
    [1986, 2007, 'gia nhập châu Âu và bùng nổ', 'Đường cao tốc, tàu AVE, bong bóng nhà đất'], [2008, 2014, 'khủng hoảng và thất nghiệp cao', 'Thất nghiệp vượt 25%, nhiều gia đình mất nhà'], [2015, 2025, 'phục hồi', 'Du lịch kỷ lục, tranh cãi độc lập Catalonia']],
    [[1936, 'nội chiến bùng nổ', 2, 'grief'], [1937, 'Guernica bị ném bom', 1, 'grief'], [1939, 'Franco thắng nội chiến', 2, ''], [1975, 'Franco qua đời, Juan Carlos lên ngôi', 2, ''], [1981, 'đảo chính hụt 23-F', 1, ''],
      [1992, 'Olympic Barcelona và Expo Sevilla', 2, 'joy'], [2004, 'đánh bom tàu ở Madrid', 2, 'grief'], [2010, 'vô địch World Cup', 2, 'joy'], [2017, 'trưng cầu độc lập Catalonia', 1, ''], [2024, 'lũ quét Valencia', 2, 'grief']]);

  add('PT', [[1900, 1909, 'cuối chế độ quân chủ', 'Nông thôn nghèo, mù chữ phổ biến'], [1910, 1925, 'Đệ nhất Cộng hòa bất ổn', 'Hàng chục chính phủ thay nhau'], [1926, 1973, 'Estado Novo của Salazar', 'Kiểm duyệt, cảnh sát chính trị; chiến tranh thuộc địa ở châu Phi từ 1961; di cư sang Pháp'],
    [1974, 1985, 'cách mạng Hoa cẩm chướng', 'Dân chủ, hàng trăm nghìn người từ thuộc địa trở về'], [1986, 2010, 'thành viên châu Âu', 'Đường sá, đồng euro, tăng trưởng chậm sau 2000'], [2011, 2025, 'gói cứu trợ và du lịch phục hồi', 'Thắt lưng buộc bụng rồi du lịch bùng nổ, giá nhà Lisbon tăng mạnh']],
    [[1908, 'vua Carlos I bị ám sát', 1, ''], [1910, 'cách mạng lập cộng hòa', 2, ''], [1974, 'cách mạng Hoa cẩm chướng ngày 25/4', 2, 'joy'], [1986, 'gia nhập Cộng đồng châu Âu', 1, ''], [1998, 'Expo Lisbon', 1, 'joy'], [2016, 'vô địch Euro bóng đá', 1, 'joy']]);

  add('GR', [EU_EARLY, [1914, 1923, 'chiến tranh và thảm họa Tiểu Á', 'Trao đổi dân số với Thổ Nhĩ Kỳ, hơn một triệu người tị nạn'], [1924, 1940, 'cộng hòa rồi độc tài Metaxas', 'Bất ổn chính trị'],
    [1941, 1949, 'chiếm đóng và nội chiến', 'Nạn đói Athens 1941–1942, rồi nội chiến'], [1950, 1966, 'tái thiết', 'Di cư sang Đức, Úc'], [1967, 1974, 'chế độ quân sự', 'Kiểm duyệt, sinh viên nổi dậy 1973'],
    [1975, 2008, 'dân chủ và thành viên châu Âu', 'Du lịch, đồng euro, Olympic 2004'], [2009, 2018, 'khủng hoảng nợ', 'Lương hưu bị cắt, thất nghiệp thanh niên trên 50%'], [2019, 2025, 'phục hồi', 'Du lịch và cháy rừng mùa hè ngày càng dữ dội']],
    [[1923, 'trao đổi dân số với Thổ Nhĩ Kỳ', 2, 'grief'], [1941, 'Đức chiếm đóng', 2, 'grief'], [1967, 'đảo chính của các đại tá', 2, ''], [1974, 'phục hồi dân chủ', 2, 'joy'], [1981, 'gia nhập Cộng đồng châu Âu', 1, ''], [2004, 'vô địch Euro; Olympic Athens', 2, 'joy'], [2010, 'gói cứu trợ đầu tiên', 2, 'grief'], [2023, 'tai nạn tàu Tempi', 1, 'grief']]);

  add('MT', [[1900, 1939, 'thuộc địa Anh', 'Căn cứ hải quân, xưởng đóng tàu'], [1940, 1945, 'cuộc vây hãm Malta', 'Bị ném bom liên tục, thiếu lương thực'], [1946, 1963, 'tái thiết', 'Di cư sang Úc'], [1964, 2003, 'độc lập', 'Du lịch, cộng hòa từ 1974'], [2004, 2025, 'thành viên EU', 'Trò chơi trực tuyến, dịch vụ tài chính, giá nhà tăng']],
    [[1942, 'đảo được trao Huân chương George', 1, ''], [1964, 'độc lập', 2, 'joy'], [2004, 'gia nhập EU', 1, ''], [2017, 'nhà báo Daphne Caruana Galizia bị sát hại', 1, 'grief']]);

  add('CY', [[1900, 1959, 'Síp do Anh cai quản', 'Nông nghiệp, cuộc đấu tranh EOKA 1955–1959'], [1960, 1973, 'cộng hòa độc lập', 'Xung đột giữa cộng đồng Hy Lạp và Thổ Nhĩ Kỳ'], [1974, 2003, 'đảo bị chia cắt', 'Khoảng 200 nghìn người mất nhà; phía nam phát triển du lịch'], [2004, 2025, 'thành viên EU', 'Khủng hoảng ngân hàng 2013, rồi phục hồi']],
    [[1960, 'độc lập', 2, 'joy'], [1974, 'đảo chính và Thổ Nhĩ Kỳ đưa quân vào', 2, 'grief'], [2004, 'gia nhập EU', 1, ''], [2013, 'khủng hoảng ngân hàng', 1, 'grief']]);

  add('AD', [[1900, 1944, 'thân vương quốc miền núi', 'Chăn nuôi, trồng thuốc lá, buôn lậu qua biên giới'], [1945, 1992, 'du lịch và mua sắm miễn thuế', 'Khu trượt tuyết, cửa hàng'], [1993, 2025, 'nhà nước có hiến pháp', 'Gia nhập Liên Hợp Quốc 1993']], [[1993, 'hiến pháp đầu tiên', 1, '']]);
  add('MC', [[1900, 1948, 'thân vương quốc sòng bạc', 'Sòng bạc Monte Carlo nuôi sống đất nước'], [1949, 2004, 'triều Rainier III', 'Lấn biển, Grand Prix, người giàu cư trú'], [2005, 2025, 'triều Albert II', 'Giá nhà đắt nhất thế giới']], [[1929, 'Grand Prix Monaco đầu tiên', 1, ''], [1956, 'Rainier III kết hôn với Grace Kelly', 1, 'joy'], [1982, 'Công nương Grace qua đời', 1, 'grief']]);
  add('SM', [[1900, 1945, 'cộng hòa nhỏ trên núi Titano', 'Nông nghiệp, di cư'], [1946, 2025, 'du lịch và ngân hàng', 'Tem, đồng xu sưu tầm và du khách']], [[1944, 'bị ném bom nhầm dù trung lập', 1, 'grief']]);
  add('VA', [[1900, 1928, 'Tòa Thánh sau khi mất Lãnh địa Giáo hoàng', 'Giáo hoàng tự coi là tù nhân trong Vatican'], [1929, 2025, 'Thành Vatican độc lập', 'Trung tâm Giáo hội Công giáo']], [[1929, 'Hiệp ước Lateran', 2, ''], [1962, 'Công đồng Vatican II khai mạc', 1, ''], [1978, 'Giáo hoàng Gioan Phaolô II được bầu', 1, ''], [2013, 'Giáo hoàng Phanxicô được bầu', 1, ''], [2025, 'Giáo hoàng Phanxicô qua đời, Giáo hoàng Lêô XIV được bầu', 2, '']]);
  add('LI', [[1900, 1918, 'thân vương quốc nông nghiệp', 'Gắn với Áo về hải quan'], [1919, 1959, 'liên minh với Thụy Sĩ', 'Dùng đồng franc Thụy Sĩ'], [1960, 2025, 'công nghiệp và tài chính', 'Thu nhập cao, nhiều người qua biên giới đến làm việc']], [[1984, 'phụ nữ được đi bầu', 1, '']]);

  // ===== Đông Âu theo khung chung =====
  var EAST_SOC = 'Kinh tế kế hoạch, căn hộ khối bê tông, xếp hàng mua hàng; đi nước ngoài và báo chí bị kiểm soát';
  function eastern(cc, pre, interwar, war, soc, fall, after, evs) {
    add(cc, [EU_EARLY.slice(0, 2).concat([pre[0], pre[1]]), [1914, 1918, 'Chiến tranh thế giới thứ nhất', 'Mặt trận chạy qua vùng đất, đàn ông bị gọi nhập ngũ'], [1919, 1938, interwar[0], interwar[1]], [1939, 1945, war[0], war[1]],
      [1946, 1955, 'thiết lập chế độ cộng sản', 'Quốc hữu hóa, tập thể hóa ruộng đất, bắt bớ đối lập'], [1956, 1988, soc[0], soc[1] || EAST_SOC], [1989, 1999, fall[0], fall[1]], [2000, 2025, after[0], after[1]]], evs);
  }
  eastern('PL', ['Ba Lan bị chia cắt giữa Nga, Đức, Áo', 'Không có nhà nước riêng; tiếng Ba Lan bị hạn chế ở trường học'], ['Đệ nhị Cộng hòa Ba Lan', 'Tái lập nhà nước, cải cách ruộng đất, chiến tranh với Nga Xô viết'], ['chiếm đóng và diệt chủng', 'Đức và Liên Xô chia đất, Warsaw bị phá hủy, ba triệu người Do Thái Ba Lan bị giết'],
    ['Ba Lan cộng sản', 'Kinh tế kế hoạch, Giáo hội vẫn rất mạnh; thiếu hàng triền miên'], ['chuyển đổi liệu pháp sốc', 'Thất nghiệp cao, cửa hàng đầy hàng, doanh nghiệp tư nhân bùng nổ'], ['thành viên EU tăng trưởng nhanh', 'Đường cao tốc, nhiều người đi làm ở Anh, Ireland rồi trở về'],
    [[1918, 'tái lập độc lập', 2, 'joy'], [1939, 'Đức và Liên Xô xâm chiếm', 2, 'grief'], [1944, 'khởi nghĩa Warsaw', 2, 'grief'], [1978, 'Hồng y Karol Wojtyła trở thành Giáo hoàng', 2, 'joy'], [1980, 'công đoàn Đoàn Kết ra đời', 2, ''], [1981, 'thiết quân luật', 2, 'grief'],
      [1989, 'bầu cử bán tự do, chính phủ không cộng sản đầu tiên', 2, 'joy'], [2004, 'gia nhập EU', 2, ''], [2010, 'tai nạn máy bay Smolensk', 2, 'grief'], [2022, 'đón hàng triệu người Ukraine chạy nạn', 1, '']]);
  eastern('CZ', ['Bohemia và Moravia trong Đế quốc Áo – Hung', 'Vùng công nghiệp phát triển nhất đế quốc'], ['Tiệp Khắc dân chủ', 'Một trong mười nền công nghiệp lớn thế giới'], ['bị Đức chiếm đóng', 'Xứ bảo hộ Bohemia – Moravia, đàn áp sau vụ ám sát Heydrich'],
    ['Tiệp Khắc xã hội chủ nghĩa', 'Sau Mùa xuân Praha là thời kỳ “bình thường hóa” kiểm soát chặt'], ['Cách mạng Nhung và tách nước', 'Tư nhân hóa bằng phiếu đầu tư, du lịch Praha bùng nổ'], ['Cộng hòa Séc trong EU', 'Nhà máy ô tô, thất nghiệp thấp'],
    [[1918, 'Tiệp Khắc độc lập', 2, 'joy'], [1938, 'Hiệp ước Munich cắt vùng Sudetenland', 2, 'grief'], [1948, 'đảng cộng sản nắm quyền', 1, ''], [1968, 'Mùa xuân Praha bị quân Khối Warszawa dập tắt', 2, 'grief'], [1989, 'Cách mạng Nhung', 2, 'joy'], [1993, 'Tiệp Khắc tách làm hai', 2, ''], [2004, 'gia nhập EU', 1, '']]);
  eastern('SK', ['vùng Thượng Hung trong Áo – Hung', 'Nông thôn nghèo, chính sách Hung hóa'], ['một phần Tiệp Khắc', 'Nông nghiệp lạc hậu hơn phía Séc'], ['Nhà nước Slovakia thân Đức', 'Trục xuất người Do Thái; khởi nghĩa quốc gia 1944'],
    ['Tiệp Khắc xã hội chủ nghĩa', 'Công nghiệp nặng được xây ở Slovakia'], ['Slovakia độc lập', 'Những năm khó khăn và chính quyền Mečiar'], ['thành viên EU và khu vực euro', 'Nhà máy ô tô lớn, dùng đồng euro từ 2009'],
    [[1944, 'khởi nghĩa quốc gia Slovakia', 1, ''], [1968, 'quân Khối Warszawa tiến vào', 2, 'grief'], [1993, 'Slovakia độc lập', 2, 'joy'], [2004, 'gia nhập EU', 1, ''], [2018, 'nhà báo Ján Kuciak bị sát hại', 1, 'grief']]);
  eastern('HU', ['Vương quốc Hungary trong Áo – Hung', 'Budapest thịnh vượng, nông thôn có nhiều điền trang lớn'], ['Hungary thời Horthy', 'Mất hai phần ba lãnh thổ sau Hiệp ước Trianon'], ['chiến tranh bên phe Trục', 'Năm 1944 hơn 400 nghìn người Do Thái bị trục xuất; Budapest bị vây'],
    ['Hungary của Kádár', '“Chủ nghĩa xã hội gu-lát” dễ thở hơn các nước láng giềng'], ['chuyển đổi dân chủ', 'Tư nhân hóa, thất nghiệp tăng'], ['thành viên EU', 'Từ 2010 chính phủ Orbán kéo dài'],
    [[1920, 'Hiệp ước Trianon', 2, 'grief'], [1944, 'Đức chiếm đóng, trục xuất người Do Thái', 2, 'grief'], [1956, 'cách mạng Hungary bị Liên Xô dập tắt', 2, 'grief'], [1989, 'mở biên giới với Áo', 2, 'joy'], [2004, 'gia nhập EU', 1, '']]);
  eastern('RO', ['Vương quốc Romania', 'Nông dân nghèo, khởi nghĩa nông dân 1907'], ['Đại Romania', 'Lãnh thổ mở rộng, dầu mỏ Ploiești'], ['chiến tranh và độc tài Antonescu', 'Diệt chủng người Do Thái và Roma; năm 1944 đổi phe'],
    ['Romania của Ceaușescu', 'Thập niên 1980 cắt điện, sưởi và thực phẩm để trả nợ; cấm phá thai'], ['hậu cách mạng', 'Thời kỳ chuyển đổi khó khăn, nhiều người đi làm ở Ý, Tây Ban Nha'], ['thành viên EU', 'Tăng trưởng nhanh nhưng dân số giảm do di cư'],
    [[1907, 'khởi nghĩa nông dân', 1, 'grief'], [1918, 'thống nhất Đại Romania', 2, ''], [1977, 'động đất Bucharest', 2, 'grief'], [1989, 'cách mạng lật đổ Ceaușescu', 2, ''], [2007, 'gia nhập EU', 1, '']]);
  eastern('BG', ['Công quốc rồi Vương quốc Bulgaria', 'Nông dân trồng hoa hồng, thuốc lá'], ['Bulgaria giữa hai cuộc chiến', 'Đảo chính và ám sát chính trị'], ['đồng minh phe Trục', 'Không trục xuất người Do Thái Bulgaria; 1944 Liên Xô tiến vào'],
    ['Bulgaria thân Liên Xô', 'Chiến dịch đổi tên người gốc Thổ thập niên 1980'], ['chuyển đổi khó khăn', 'Siêu lạm phát 1997, di cư lớn'], ['thành viên EU', 'Thu nhập thấp nhất EU nhưng tăng dần'],
    [[1908, 'tuyên bố độc lập hoàn toàn', 1, ''], [1944, 'Hồng quân tiến vào', 1, ''], [1989, 'Todor Zhivkov mất quyền; người gốc Thổ bị ép rời đi', 2, ''], [2007, 'gia nhập EU', 1, '']]);
  eastern('AL', ['Albania thuộc Ottoman', 'Vùng núi theo luật tục bộ tộc'], ['Albania độc lập và vua Zog', 'Nghèo, phụ thuộc Ý'], ['Ý rồi Đức chiếm đóng', 'Kháng chiến du kích'],
    ['Albania của Enver Hoxha', 'Cô lập tuyệt đối, cấm tôn giáo từ 1967, hàng trăm nghìn lô cốt'], ['sụp đổ và hỗn loạn', 'Di cư ồ ạt bằng tàu sang Ý; sụp đổ đa cấp năm 1997'], ['ổn định và hội nhập', 'Gia nhập NATO, du lịch biển'],
    [[1912, 'tuyên bố độc lập', 2, 'joy'], [1939, 'Ý xâm chiếm', 2, 'grief'], [1991, 'di cư ồ ạt bằng tàu', 2, ''], [1997, 'sụp đổ các mô hình đa cấp, bạo loạn', 2, 'grief'], [2009, 'gia nhập NATO', 1, '']]);

  // Nam Tư cũ
  function yugo(cc, nm, warTxt, after, evs) {
    add(cc, [[1900, 1913, 'vùng Balkan dưới các đế quốc', 'Ottoman và Áo – Hung tranh ảnh hưởng; nông nghiệp'], WWI, [1919, 1940, 'Vương quốc Nam Tư', 'Căng thẳng giữa các dân tộc, nông thôn nghèo'], [1941, 1945, 'chiếm đóng và chiến tranh du kích', 'Nội chiến nhiều phe, thảm sát dân thường'],
      [1946, 1979, 'Nam Tư của Tito', 'Chủ nghĩa xã hội tự quản, đi lại tự do hơn khối Đông; nhiều người đi làm ở Tây Đức'], [1980, 1990, 'khủng hoảng sau Tito', 'Lạm phát rất cao, căng thẳng dân tộc tăng'],
      [1991, 1999, warTxt[0], warTxt[1]], [2000, 2025, after[0], after[1]]], [[1945, 'giải phóng, Nam Tư xã hội chủ nghĩa ra đời', 2, ''], [1980, 'Tito qua đời', 2, 'grief'], [1984, 'Olympic mùa đông Sarajevo', 1, 'joy']].concat(evs));
  }
  yugo('RS', 'Serbia', ['chiến tranh, cấm vận và siêu lạm phát', 'Siêu lạm phát 1993, cấm vận quốc tế; NATO ném bom năm 1999'], ['dân chủ hóa và đàm phán vào EU', 'Kosovo tuyên bố độc lập 2008; phong trào sinh viên 2024–2025'], [[1993, 'siêu lạm phát', 2, 'grief'], [1999, 'NATO ném bom', 2, 'grief'], [2000, 'Milošević bị lật đổ', 2, ''], [2006, 'Montenegro tách ra, Serbia độc lập', 1, ''], [2024, 'sập mái ga Novi Sad', 1, 'grief']]);
  yugo('HR', 'Croatia', ['chiến tranh giành độc lập', 'Vukovar bị phá hủy, chiến dịch Bão táp 1995'], ['thành viên EU', 'Du lịch bờ biển Adriatic, dùng euro từ 2023'], [[1991, 'tuyên bố độc lập, chiến tranh bùng nổ', 2, 'grief'], [1995, 'chiến dịch Bão táp kết thúc chiến tranh', 2, ''], [2013, 'gia nhập EU', 1, ''], [2018, 'á quân World Cup', 1, 'joy']]);
  yugo('SI', 'Slovenia', ['độc lập êm thấm', 'Chiến tranh mười ngày năm 1991 rồi ổn định'], ['nước giàu nhất khối Nam Tư cũ', 'Gia nhập EU 2004, dùng euro 2007'], [[1991, 'độc lập sau chiến tranh mười ngày', 2, 'joy'], [2004, 'gia nhập EU', 1, '']]);
  yugo('BA', 'Bosnia', ['chiến tranh Bosnia', 'Sarajevo bị vây gần bốn năm, diệt chủng Srebrenica'], ['hòa bình Dayton', 'Nhà nước chia theo sắc tộc, thất nghiệp cao, nhiều người trẻ đi nước ngoài'], [[1992, 'chiến tranh và cuộc vây hãm Sarajevo', 2, 'grief'], [1995, 'diệt chủng Srebrenica; Hiệp định Dayton', 2, 'grief'], [2014, 'lũ lụt lớn', 1, 'grief']]);
  yugo('ME', 'Montenegro', ['liên bang với Serbia', 'Cấm vận, buôn lậu'], ['Montenegro độc lập', 'Du lịch bờ biển, dùng đồng euro'], [[2006, 'trưng cầu dân ý độc lập', 2, 'joy'], [2017, 'gia nhập NATO', 1, '']]);
  yugo('MK', 'Bắc Macedonia', ['độc lập hòa bình', 'Cấm vận của Hy Lạp, kinh tế khó khăn'], ['xung đột 2001 và đổi tên nước', 'Hiệp định Ohrid, đổi tên Bắc Macedonia năm 2019'], [[1991, 'độc lập', 1, ''], [2001, 'xung đột vũ trang ngắn', 1, 'grief'], [2019, 'đổi tên thành Bắc Macedonia', 1, ''], [2020, 'gia nhập NATO', 1, '']]);

  // Liên Xô cũ phía tây và Kavkaz
  function sov(cc, pre, sovTxt, ind, evs, warYears) {
    add(cc, [[1900, 1916, pre[0], pre[1]], [1917, 1921, 'cách mạng và nội chiến', 'Chính quyền thay nhau, nạn đói và dịch bệnh'],
      [1922, 1940, warYears ? warYears[0] : 'nước cộng hòa Xô viết thời Stalin', warYears ? warYears[1] : 'Tập thể hóa, nạn đói đầu thập niên 1930, thanh trừng 1937–1938'],
      [1941, 1945, 'Chiến tranh Vệ quốc', 'Chiến tuyến, chiếm đóng hoặc sơ tán; hàng triệu người chết'], [1946, 1964, 'tái thiết hậu chiến', 'Trục xuất, nạn đói 1946–1947 ở một số vùng; sau 1953 nới lỏng'],
      [1965, 1985, sovTxt[0], sovTxt[1]], [1986, 1991, 'perestroika và tan rã Liên Xô', 'Tự do ngôn luận hơn, hàng hóa khan hiếm, phong trào độc lập'], [1992, 2025, ind[0], ind[1]]], evs);
  }
  sov('RU', ['Đế quốc Nga cuối thời Sa hoàng', 'Nông nô vừa được giải phóng vài thập kỷ, công nghiệp hóa ở thành phố; cách mạng 1905'], ['thời trì trệ Brezhnev', 'Ổn định nhưng thiếu hàng tiêu dùng; căn hộ, nhà nghỉ dacha, chiến tranh Afghanistan'],
    ['Liên bang Nga', 'Thập niên 1990 hỗn loạn, mất giá; từ 2000 dầu mỏ mang lại thu nhập; từ 2022 chiến tranh ở Ukraine và lệnh trừng phạt'],
    [[1905, 'cách mạng 1905', 1, ''], [1917, 'cách mạng tháng Hai và tháng Mười', 2, ''], [1941, 'Đức xâm lược Liên Xô', 2, 'grief'], [1945, 'chiến thắng ngày 9/5', 2, 'joy'], [1953, 'Stalin qua đời', 2, ''], [1957, 'phóng vệ tinh Sputnik', 1, 'joy'], [1961, 'Yuri Gagarin bay vào vũ trụ', 2, 'joy'],
      [1980, 'Olympic Moskva', 1, ''], [1986, 'thảm họa Chernobyl', 2, 'grief'], [1991, 'Liên Xô tan rã', 2, ''], [1998, 'vỡ nợ và mất giá đồng rúp', 2, 'grief'], [2004, 'thảm kịch trường học Beslan', 2, 'grief'], [2014, 'Olympic mùa đông Sochi; sáp nhập Crimea', 1, ''], [2018, 'đăng cai World Cup', 1, 'joy'], [2022, 'chiến tranh toàn diện với Ukraine, lệnh động viên một phần', 2, 'grief']]);
  sov('UA', ['vùng Ukraine dưới Nga và Áo – Hung', 'Đồng lúa mì phì nhiêu, nông dân nghèo'], ['Ukraine Xô viết', 'Công nghiệp nặng ở miền đông, nông trang tập thể'],
    ['Ukraine độc lập', 'Thập niên 1990 khó khăn, các cuộc cách mạng 2004 và 2014; từ 2022 chiến tranh toàn diện, hàng triệu người tị nạn'],
    [[1932, 'nạn đói Holodomor', 2, 'grief'], [1941, 'Đức chiếm đóng, thảm sát Babyn Yar', 2, 'grief'], [1986, 'thảm họa Chernobyl', 2, 'grief'], [1991, 'tuyên bố độc lập', 2, 'joy'], [2004, 'Cách mạng Cam', 1, ''], [2014, 'Euromaidan; Nga sáp nhập Crimea, chiến tranh ở Donbas', 2, 'grief'], [2022, 'Nga xâm lược toàn diện', 2, 'grief']],
    ['nước cộng hòa Xô viết thời Stalin', 'Tập thể hóa và nạn đói Holodomor 1932–1933, thanh trừng']);
  sov('BY', ['vùng Belarus của Đế quốc Nga', 'Làng quê nghèo, đông người Do Thái ở thị trấn'], ['Belarus Xô viết', 'Minsk xây lại hoàn toàn, nhà máy máy kéo, xe tải'],
    ['Belarus của Lukashenko', 'Kinh tế nhà nước, kiểm soát chính trị chặt; đàn áp biểu tình 2020'],
    [[1941, 'Đức chiếm đóng, một phần tư dân số thiệt mạng trong chiến tranh', 2, 'grief'], [1986, 'Chernobyl làm nhiễm xạ miền nam', 2, 'grief'], [1991, 'độc lập', 1, ''], [1994, 'Lukashenko đắc cử', 1, ''], [2020, 'biểu tình phản đối kết quả bầu cử', 2, '']]);
  sov('MD', ['Bessarabia trong Đế quốc Nga', 'Vùng nho, nông nghiệp'], ['Moldova Xô viết', 'Rượu vang, trái cây cho cả Liên Xô'],
    ['Moldova độc lập', 'Xung đột Transnistria 1992, nước nghèo nhất châu Âu, hàng trăm nghìn người đi làm nước ngoài'],
    [[1940, 'Liên Xô sáp nhập Bessarabia', 2, ''], [1991, 'độc lập', 1, ''], [1992, 'chiến tranh Transnistria', 1, 'grief'], [2022, 'trở thành ứng viên EU', 1, '']], ['Bessarabia thuộc Romania', 'Vùng nông nghiệp của Đại Romania']);
  sov('LT', ['Litva trong Đế quốc Nga', 'Báo chí tiếng Litva bị cấm tới 1904'], ['Litva Xô viết', 'Nhập cư Nga, kháng chiến rừng xanh tới 1953'],
    ['Litva độc lập', 'Cải cách thị trường, gia nhập EU và NATO 2004, dùng euro 2015'],
    [[1918, 'tuyên bố độc lập', 2, 'joy'], [1940, 'Liên Xô sáp nhập', 2, 'grief'], [1941, 'trục xuất hàng loạt sang Siberia; diệt chủng người Do Thái', 2, 'grief'], [1989, 'Con đường Baltic nối ba nước', 2, ''], [1990, 'tuyên bố khôi phục độc lập', 2, 'joy'], [1991, 'sự kiện tháp truyền hình Vilnius', 1, 'grief'], [2004, 'gia nhập EU và NATO', 1, '']],
    ['Litva độc lập giữa hai cuộc chiến', 'Nhà nước nông nghiệp, thủ đô tạm ở Kaunas']);
  sov('LV', ['Latvia trong Đế quốc Nga', 'Riga là cảng công nghiệp lớn'], ['Latvia Xô viết', 'Người Latvia giảm còn khoảng một nửa dân số'],
    ['Latvia độc lập', 'Khủng hoảng 2009 rất nặng, gia nhập EU và NATO 2004'],
    [[1918, 'tuyên bố độc lập', 2, 'joy'], [1940, 'Liên Xô sáp nhập', 2, 'grief'], [1949, 'trục xuất nông dân sang Siberia', 2, 'grief'], [1989, 'Con đường Baltic', 2, ''], [1991, 'khôi phục độc lập', 2, 'joy'], [2004, 'gia nhập EU và NATO', 1, '']],
    ['Latvia độc lập giữa hai cuộc chiến', 'Nông nghiệp, bơ và thịt xuất khẩu']);
  sov('EE', ['Estonia trong Đế quốc Nga', 'Địa chủ người Đức vùng Baltic, nông dân Estonia'], ['Estonia Xô viết', 'Truyền hình Phần Lan thu được ở Tallinn'],
    ['Estonia độc lập', 'Chính phủ điện tử, Skype; gia nhập EU và NATO 2004'],
    [[1918, 'tuyên bố độc lập', 2, 'joy'], [1940, 'Liên Xô sáp nhập', 2, 'grief'], [1988, 'Cách mạng Hát', 2, ''], [1991, 'khôi phục độc lập', 2, 'joy'], [1994, 'chìm phà Estonia', 2, 'grief'], [2004, 'gia nhập EU và NATO', 1, '']],
    ['Estonia độc lập giữa hai cuộc chiến', 'Cải cách ruộng đất, nông nghiệp và rừng']);
  sov('GE', ['Gruzia trong Đế quốc Nga', 'Vùng rượu vang và chè; giới quý tộc lâu đời'], ['Gruzia Xô viết', 'Nơi nghỉ dưỡng của Liên Xô, kinh tế ngầm phát triển'],
    ['Gruzia độc lập', 'Nội chiến và xung đột Abkhazia, Nam Ossetia đầu thập niên 1990; Cách mạng Hoa hồng 2003; chiến tranh với Nga 2008'],
    [[1918, 'độc lập ngắn ngủi', 1, ''], [1921, 'Hồng quân tiến vào', 2, 'grief'], [1989, 'biểu tình Tbilisi ngày 9/4 bị đàn áp', 2, 'grief'], [1991, 'độc lập', 2, ''], [2003, 'Cách mạng Hoa hồng', 2, ''], [2008, 'chiến tranh với Nga', 2, 'grief']]);
  sov('AM', ['người Armenia giữa Nga và Ottoman', 'Phía Ottoman bị diệt chủng năm 1915'], ['Armenia Xô viết', 'Yerevan xây bằng đá tuff hồng, công nghiệp'],
    ['Armenia độc lập', 'Thập niên 1990 thiếu điện và sưởi; xung đột Karabakh kéo dài tới 2023'],
    [[1915, 'diệt chủng người Armenia ở Đế quốc Ottoman', 2, 'grief'], [1988, 'động đất Spitak', 2, 'grief'], [1991, 'độc lập', 2, ''], [2018, 'Cách mạng Nhung', 1, ''], [2020, 'chiến tranh Karabakh lần hai', 2, 'grief'], [2023, 'hơn 100 nghìn người Armenia rời Karabakh', 2, 'grief']]);
  sov('AZ', ['Azerbaijan trong Đế quốc Nga', 'Bùng nổ dầu mỏ ở Baku'], ['Azerbaijan Xô viết', 'Dầu mỏ và bông'],
    ['Azerbaijan độc lập', 'Chiến tranh Karabakh lần một và người tị nạn; dầu khí đem lại giàu có từ thập niên 2000; giành lại Karabakh 2020–2023'],
    [[1918, 'Cộng hòa Dân chủ Azerbaijan', 1, ''], [1990, 'Tháng Giêng Đen ở Baku', 2, 'grief'], [1991, 'độc lập', 2, ''], [1994, 'ngừng bắn ở Karabakh', 1, ''], [2020, 'chiến tranh Karabakh lần hai', 2, ''], [2023, 'kiểm soát toàn bộ Karabakh', 1, '']]);
})(globalThis.G);
