/* Một Đời — 9.8.9 bổ sung sự kiện 1900–2025 và bối cảnh theo thành phố: châu Âu, Nga và Liên Xô cũ.
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

  ev('RU', [[1904, 'chiến tranh Nga – Nhật'], [1906, 'Duma quốc gia đầu tiên họp'], [1914, 'Nga bước vào Thế chiến I', 2], [1918, 'hòa ước Brest-Litovsk; gia đình Sa hoàng bị sát hại; nội chiến lan rộng', 2, 'grief'], [1921, 'Chính sách Kinh tế Mới; nạn đói vùng Volga', 2, 'grief'],
    [1922, 'Liên bang Xô viết thành lập'], [1924, 'Lenin qua đời'], [1928, 'kế hoạch năm năm đầu tiên'], [1929, 'tập thể hóa nông nghiệp, trục xuất phú nông', 1, 'grief'], [1932, 'nạn đói khắp các vùng lúa mì', 2, 'grief'], [1934, 'Sergey Kirov bị ám sát'], [1937, 'Đại thanh trừng', 2, 'grief'],
    [1939, 'hiệp ước Xô – Đức không xâm phạm'], [1942, 'trận Stalingrad', 2, 'grief'], [1944, 'kết thúc cuộc phong tỏa Leningrad'], [1946, 'nạn đói hậu chiến', 1, 'grief'], [1949, 'thử thành công bom nguyên tử'], [1956, 'Khrushchev phê phán Stalin'], [1962, 'khủng hoảng tên lửa Cuba'],
    [1964, 'Brezhnev thay Khrushchev'], [1979, 'đưa quân vào Afghanistan'], [1982, 'Brezhnev qua đời'], [1985, 'Gorbachev lên nắm quyền, bắt đầu perestroika'], [1989, 'rút quân khỏi Afghanistan; bầu cử Đại hội Đại biểu Nhân dân'], [1993, 'khủng hoảng hiến pháp, xe tăng bắn vào Nhà Trắng', 2],
    [1994, 'chiến tranh Chechnya lần thứ nhất', 2, 'grief'], [1996, 'Yeltsin tái đắc cử'], [1999, 'chiến tranh Chechnya lần thứ hai; Putin làm thủ tướng rồi quyền tổng thống', 2], [2000, 'tàu ngầm Kursk chìm', 1, 'grief'], [2008, 'chiến tranh với Gruzia; Medvedev làm tổng thống'],
    [2010, 'nắng nóng và cháy rừng kỷ lục', 1, 'grief'], [2011, 'biểu tình phản đối kết quả bầu cử'], [2020, 'sửa đổi hiến pháp'], [2023, 'binh biến của lực lượng Wagner'], [2024, 'Alexei Navalny chết trong tù; tấn công khủng bố Crocus City Hall', 1, 'grief']]);
  reg('RU', [[['Saint Petersburg'], 1941, 1944, 'Leningrad bị phong tỏa', 'Gần 900 ngày bị vây, khẩu phần bánh mì vài trăm gram, hàng trăm nghìn người chết đói và rét'],
    [['Vladivostok'], 1958, 1991, 'thành phố đóng', 'Căn cứ Hạm đội Thái Bình Dương, người nước ngoài không được vào'],
    [['Moscow'], 1992, 2025, 'thủ đô giàu có', 'Tiền dầu khí đổ về, tàu điện ngầm, trung tâm thương mại; giá nhà cao nhất nước']]);
  rev('RU', [[1918, ['Yekaterinburg'], 'gia đình Sa hoàng Nicholas II bị xử bắn', 2, 'grief'], [1993, ['Moscow'], 'xe tăng nã đạn vào Nhà Trắng', 2, ''], [1999, ['Moscow'], 'đánh bom các tòa chung cư', 2, 'grief'], [2002, ['Moscow'], 'vụ bắt con tin ở nhà hát Dubrovka', 2, 'grief'],
    [2003, ['Saint Petersburg'], 'kỷ niệm 300 năm thành phố', 1, 'joy'], [2012, ['Vladivostok'], 'hội nghị APEC, cầu Russky', 1, ''], [2013, ['Chelyabinsk'], 'thiên thạch nổ trên bầu trời, vỡ kính khắp thành phố', 2, ''], [2013, ['Kazan'], 'Đại hội Thể thao Sinh viên Thế giới', 1, 'joy'], [2024, ['Moscow'], 'tấn công khủng bố Crocus City Hall', 2, 'grief']]);

  ev('DE', [[1914, 'Đức bước vào Thế chiến I', 2], [1918, 'cách mạng tháng Mười Một, Hoàng đế thoái vị', 2], [1919, 'Hiến pháp Weimar; Hòa ước Versailles'], [1932, 'sáu triệu người thất nghiệp'], [1934, 'Đêm của những con dao dài'], [1935, 'luật Nuremberg tước quyền công dân người Do Thái', 1, 'grief'],
    [1939, 'xâm lược Ba Lan, Thế chiến II bùng nổ', 2], [1944, 'âm mưu ám sát Hitler ngày 20/7 thất bại'], [1955, 'Tây Đức gia nhập NATO'], [1963, 'Tổng thống Kennedy phát biểu ở Tây Berlin'], [1970, 'Thủ tướng Willy Brandt quỳ gối ở Warsaw'], [1977, '“Mùa thu nước Đức”, khủng bố của RAF'],
    [1982, 'Helmut Kohl làm thủ tướng'], [1998, 'Gerhard Schröder làm thủ tướng'], [2002, 'đồng euro thay đồng mác'], [2005, 'Angela Merkel làm nữ thủ tướng đầu tiên'], [2011, 'quyết định từ bỏ điện hạt nhân sau Fukushima'], [2016, 'tấn công chợ Giáng sinh ở Berlin', 1, 'grief'],
    [2021, 'lũ lụt miền tây; Olaf Scholz làm thủ tướng', 1, 'grief'], [2023, 'đóng cửa ba nhà máy điện hạt nhân cuối cùng'], [2025, 'Friedrich Merz làm thủ tướng sau bầu cử sớm']]);
  var EAST = ['Leipzig', 'Dresden', 'Đông Berlin'], WEST = ['Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Tây Berlin'];
  reg('DE', [[EAST, 1949, 1989, 'Cộng hòa Dân chủ Đức', 'Nhà máy quốc doanh, căn hộ bê tông, chờ hơn mười năm để mua xe Trabant; Stasi theo dõi, đi phương Tây gần như không thể'],
    [EAST, 1990, 2005, 'miền đông sau thống nhất', 'Nhà máy đóng cửa, thất nghiệp cao, nhiều người trẻ chuyển sang miền tây; phố cổ được trùng tu'],
    [WEST, 1949, 1989, 'Cộng hòa Liên bang Đức', 'Phép màu kinh tế, ô tô, kỳ nghỉ ở Ý; lao động khách từ Thổ Nhĩ Kỳ, Nam Âu'],
    [['Tây Berlin'], 1961, 1989, 'hòn đảo bị bức tường bao quanh', 'Thành phố phương Tây giữa lòng Đông Đức, thanh niên đến đây để tránh nghĩa vụ quân sự'],
    [['Frankfurt'], 1998, 2025, 'trung tâm tài chính châu Âu', 'Ngân hàng Trung ương châu Âu, sân bay lớn, nhà chọc trời']]);
  rev('DE', [[1943, ['Hamburg'], 'bão lửa sau đợt ném bom', 2, 'grief'], [1945, ['Dresden'], 'Dresden bị ném bom', 2, 'grief'], [1962, ['Hamburg'], 'lũ lụt từ biển Bắc', 2, 'grief'], [1972, ['Munich'], 'Thế vận hội và vụ bắt con tin', 2, ''],
    [1989, ['Leipzig'], 'các cuộc tuần hành thứ Hai', 2, ''], [2002, ['Dresden'], 'lũ sông Elbe', 2, 'grief'], [2015, ['Cologne'], 'vụ quấy rối đêm Giao thừa', 1, 'grief'], [2016, ['Đông Berlin', 'Tây Berlin', 'Berlin'], 'tấn công chợ Giáng sinh', 2, 'grief']]);

  ev('GB', [[1908, 'luật lương hưu cho người già'], [1914, 'Anh tuyên chiến với Đức', 2], [1916, 'trận Somme', 2, 'grief'], [1921, 'hiệp ước Anh – Ireland'], [1928, 'phụ nữ được bầu cử bình đẳng nam giới'], [1936, 'Vua Edward VIII thoái vị'], [1939, 'tuyên chiến với Đức', 2],
    [1944, 'bom bay V-1 tấn công London'], [1947, 'Ấn Độ độc lập'], [1951, 'Lễ hội nước Anh'], [1956, 'khủng hoảng Suez'], [1963, 'cơn sốt Beatles'], [1969, 'quân đội được điều tới Bắc Ireland'], [1974, 'tuần làm việc ba ngày vì thiếu điện'], [1976, 'phải vay IMF'],
    [1979, 'Mùa đông bất mãn; Margaret Thatcher làm thủ tướng', 2], [1981, 'đám cưới Thái tử Charles và Diana; bạo loạn ở Brixton'], [1987, 'trận bão lớn; thị trường chứng khoán sụp đổ'], [1990, 'Thatcher từ chức sau biểu tình thuế thân'], [1992, 'Ngày thứ Tư Đen, bảng Anh rời ERM'],
    [1994, 'đường hầm eo biển Manche khánh thành'], [1999, 'Quốc hội Scotland và Hội đồng xứ Wales ra đời'], [2003, 'tham chiến ở Iraq'], [2007, 'ngân hàng Northern Rock bị rút tiền ồ ạt'], [2010, 'chính phủ liên minh'], [2011, 'bạo loạn ở London và nhiều thành phố'],
    [2014, 'trưng cầu độc lập Scotland, phe ở lại thắng'], [2017, 'đánh bom Manchester Arena; hỏa hoạn tháp Grenfell', 2, 'grief'], [2019, 'Boris Johnson làm thủ tướng'], [2024, 'Công đảng thắng cử, Keir Starmer làm thủ tướng']]);
  reg('GB', [[['Belfast'], 1969, 1998, 'Bắc Ireland thời “Rắc rối”', 'Chốt chặn quân đội, tường hòa bình chia khu Công giáo và Tin Lành, đánh bom và bắn tỉa'],
    [['Liverpool', 'Manchester', 'Glasgow', 'Leeds', 'Birmingham'], 1979, 1995, 'công nghiệp suy tàn', 'Xưởng đóng tàu, mỏ, nhà máy dệt đóng cửa, thất nghiệp cao'],
    [['Edinburgh', 'Glasgow'], 1999, 2025, 'Scotland có quốc hội riêng', 'Học đại học miễn phí, tranh luận về độc lập'], [['Cardiff'], 1999, 2025, 'xứ Wales tự quản', 'Tiếng Wales được dạy rộng rãi']]);
  rev('GB', [[1952, ['London'], 'màn khói độc làm hàng nghìn người chết', 2, 'grief'], [1972, ['Belfast'], 'ngày thứ Sáu đẫm máu với hàng loạt vụ nổ', 2, 'grief'], [1989, ['Liverpool'], 'thảm họa sân vận động Hillsborough', 2, 'grief'],
    [1996, ['Manchester'], 'quả bom của IRA phá hủy trung tâm thành phố', 2, ''], [2005, ['London'], 'đánh bom tàu điện ngầm và xe buýt', 2, 'grief'], [2012, ['London'], 'Thế vận hội London', 2, 'joy'], [2014, ['Glasgow'], 'Đại hội Thể thao Khối Thịnh vượng chung', 1, 'joy'],
    [2017, ['Manchester'], 'đánh bom sau buổi hòa nhạc', 2, 'grief'], [2017, ['London'], 'hỏa hoạn tháp Grenfell', 2, 'grief']]);

  ev('FR', [[1906, 'Dreyfus được phục hồi danh dự'], [1914, 'trận Marne', 2, 'grief'], [1918, 'đình chiến ngày 11/11', 2, 'joy'], [1924, 'Thế vận hội Paris'], [1934, 'bạo loạn ngày 6/2'], [1939, 'Pháp tuyên chiến', 2], [1942, 'cuộc vây bắt người Do Thái ở Vel d\'Hiv', 2, 'grief'],
    [1945, 'phụ nữ đi bầu lần đầu'], [1946, 'nền Cộng hòa thứ Tư'], [1957, 'ký Hiệp ước Rome'], [1969, 'de Gaulle từ chức'], [1975, 'luật Veil hợp pháp hóa phá thai'], [1989, 'kỷ niệm 200 năm Cách mạng'], [1995, 'đình công giao thông kéo dài'],
    [2003, 'đợt nắng nóng làm hàng chục nghìn người chết', 2, 'grief'], [2005, 'bạo loạn ở các vùng ngoại ô'], [2007, 'Nicolas Sarkozy làm tổng thống'], [2012, 'François Hollande làm tổng thống'], [2017, 'Emmanuel Macron làm tổng thống'], [2023, 'biểu tình phản đối cải cách hưu trí'], [2025, 'chính phủ thay đổi liên tục vì quốc hội chia rẽ']]);
  reg('FR', [[['Strasbourg'], 1900, 1918, 'Alsace thuộc Đức', 'Vùng đất Pháp mất năm 1871, trường học dạy tiếng Đức'], [['Strasbourg'], 1940, 1944, 'bị Đức sáp nhập', 'Thanh niên bị bắt lính cho Đức'],
    [['Lille'], 1975, 2000, 'vùng mỏ và dệt suy tàn', 'Mỏ than, nhà máy dệt đóng cửa, thất nghiệp cao'], [['Toulouse'], 1970, 2025, 'thủ phủ hàng không', 'Nhà máy Airbus, kỹ sư và sinh viên']]);
  rev('FR', [[1944, ['Marseille', 'Nice'], 'quân Đồng minh đổ bộ Provence', 1, ''], [2001, ['Toulouse'], 'nổ nhà máy hóa chất AZF', 1, 'grief'], [2012, ['Toulouse'], 'loạt vụ xả súng của Mohammed Merah', 1, 'grief'], [2015, ['Paris'], 'tấn công Bataclan đêm 13/11', 2, 'grief'],
    [2016, ['Nice'], 'xe tải lao vào đám đông ngày quốc khánh', 2, 'grief'], [2018, ['Strasbourg'], 'xả súng ở chợ Giáng sinh', 1, 'grief'], [2020, ['Nice'], 'tấn công nhà thờ Đức Bà', 1, 'grief']]);

  ev('IT', [[1911, 'chiến tranh chiếm Libya'], [1915, 'Ý tham chiến'], [1929, 'Hiệp ước Lateran với Tòa Thánh'], [1935, 'xâm lược Ethiopia'], [1938, 'luật chủng tộc', 1, 'grief'], [1940, 'tham chiến bên phe Đức'], [1943, 'Mussolini bị lật đổ, Đức chiếm miền bắc', 2],
    [1948, 'hiến pháp cộng hòa có hiệu lực'], [1957, 'ký Hiệp ước Rome'], [1963, 'thảm họa đập Vajont', 1, 'grief'], [1969, 'đánh bom ở Piazza Fontana, Milan', 1, 'grief'], [1976, 'động đất Friuli', 1, 'grief'], [1992, 'điều tra “Bàn tay sạch”; thẩm phán Falcone và Borsellino bị ám sát', 2, 'grief'],
    [1994, 'Silvio Berlusconi lần đầu làm thủ tướng'], [2002, 'đồng euro thay đồng lira'], [2009, 'động đất L\'Aquila', 1, 'grief'], [2011, 'khủng hoảng nợ, chính phủ kỹ trị Monti'], [2016, 'động đất Amatrice', 1, 'grief'], [2022, 'Giorgia Meloni làm nữ thủ tướng đầu tiên']]);
  reg('IT', [[['Naples', 'Palermo', 'Bari'], 1900, 1970, 'miền Nam nghèo', 'Nông dân không đất, hàng triệu người di cư sang châu Mỹ rồi lên Milan, Turin, Đức'],
    [['Palermo', 'Naples'], 1970, 2025, 'miền Nam và mafia', 'Mafia Sicilia, Camorra Napoli; thanh niên thất nghiệp cao, nhiều người lên bắc'],
    [['Milan', 'Turin', 'Genoa'], 1950, 2025, 'tam giác công nghiệp miền Bắc', 'Fiat ở Turin, thời trang và tài chính ở Milan, cảng Genoa; người miền Nam lên làm công nhân']]);
  rev('IT', [[1992, ['Palermo'], 'thẩm phán Falcone và Borsellino bị mafia đánh bom', 2, 'grief'], [2001, ['Genoa'], 'hội nghị G8 và bạo lực biểu tình', 1, 'grief'], [2006, ['Turin'], 'Thế vận hội mùa đông', 1, 'joy'], [2008, ['Naples'], 'khủng hoảng rác thải', 1, ''],
    [2015, ['Milan'], 'Expo Milan', 1, 'joy'], [2018, ['Genoa'], 'sập cầu Morandi', 2, 'grief'], [2020, ['Milan'], 'Lombardy thành tâm dịch COVID-19 của châu Âu', 2, 'grief']]);

  ev('ES', [[1921, 'thảm bại ở Annual tại Maroc', 1, 'grief'], [1923, 'tướng Primo de Rivera nắm quyền'], [1931, 'nền Đệ nhị Cộng hòa ra đời', 2], [1934, 'khởi nghĩa thợ mỏ Asturias'], [1953, 'hiệp ước căn cứ quân sự với Mỹ'], [1959, 'kế hoạch ổn định kinh tế'], [1973, 'Thủ tướng Carrero Blanco bị ETA ám sát'],
    [1977, 'bầu cử tự do đầu tiên sau 41 năm', 2], [1978, 'hiến pháp dân chủ'], [1982, 'đảng PSOE thắng cử; đăng cai World Cup'], [1986, 'gia nhập Cộng đồng châu Âu'], [1997, 'ETA sát hại nghị viên Miguel Ángel Blanco, hàng triệu người xuống đường', 1, 'grief'], [2008, 'bong bóng nhà đất vỡ'],
    [2011, 'phong trào 15-M; ETA tuyên bố ngừng bạo lực'], [2014, 'Vua Felipe VI lên ngôi'], [2018, 'Pedro Sánchez làm thủ tướng'], [2025, 'mất điện toàn bán đảo ngày 28/4', 1, '']]);
  reg('ES', [[['Bilbao'], 1968, 2011, 'xứ Basque thời ETA', 'Đánh bom, ám sát, các doanh nhân bị tống tiền; nhà máy thép suy tàn'], [['Barcelona'], 1977, 2025, 'Catalonia tự trị', 'Tiếng Catalan ở trường học, du lịch đông đúc, tranh luận độc lập']]);
  rev('ES', [[1909, ['Barcelona'], 'Tuần lễ Bi thảm', 2, 'grief'], [1992, ['Seville'], 'Expo Sevilla', 1, 'joy'], [1997, ['Bilbao'], 'bảo tàng Guggenheim khai trương', 1, 'joy'], [2017, ['Barcelona'], 'xe tải lao vào đám đông trên phố La Rambla', 2, 'grief']]);

  ev('UA', [[1917, 'Rada Trung ương tuyên bố tự trị'], [1918, 'Cộng hòa Nhân dân Ukraine tuyên bố độc lập'], [1922, 'gia nhập Liên Xô'], [1937, 'thanh trừng giới trí thức Ukraine', 1, 'grief'], [1944, 'trục xuất người Tatar Krym', 1, 'grief'], [1954, 'Krym được chuyển về Ukraine'],
    [1996, 'hiến pháp mới, đồng hryvnia'], [2010, 'Viktor Yanukovych đắc cử'], [2012, 'đồng đăng cai Euro'], [2019, 'Volodymyr Zelensky đắc cử'], [2023, 'phản công mùa hè; vỡ đập Kakhovka', 2, 'grief']]);
  reg('UA', [[['Lviv'], 1919, 1939, 'Lwów thuộc Ba Lan', 'Thành phố của người Ba Lan, Do Thái, Ukraine'], [['Kharkiv', 'Zaporizhzhia', 'Dnipro'], 2022, 2025, 'vùng tiền tuyến', 'Pháo kích, còi báo động, nhiều gia đình sơ tán']]);
  rev('UA', [[2014, ['Kyiv'], 'cách mạng Maidan', 2, ''], [2014, ['Odesa'], 'xung đột và hỏa hoạn Nhà Công đoàn', 2, 'grief'], [2022, ['Kharkiv'], 'thành phố bị pháo kích liên tục', 2, 'grief'], [2022, ['Zaporizhzhia'], 'nhà máy điện hạt nhân bị chiếm', 1, ''], [2022, ['Lviv'], 'trở thành nơi đón người chạy nạn', 1, '']]);

  ev('PL', [[1920, 'trận Warsaw đẩy lùi Hồng quân'], [1926, 'Piłsudski đảo chính'], [1943, 'khởi nghĩa khu Do Thái Warsaw', 2, 'grief'], [1956, 'nổi dậy Poznań'], [1970, 'công nhân xưởng đóng tàu bị bắn', 1, 'grief'], [1990, 'Lech Wałęsa đắc cử tổng thống'], [1997, 'đại hồng thủy'],
    [2005, 'Giáo hoàng Gioan Phaolô II qua đời', 2, 'grief'], [2012, 'đồng đăng cai Euro'], [2023, 'Donald Tusk trở lại làm thủ tướng']]);
  reg('PL', [[['Gdańsk'], 1920, 1939, 'Thành phố Tự do Danzig', 'Thành phố đa số nói tiếng Đức dưới bảo hộ Hội Quốc Liên'], [['Wrocław'], 1900, 1945, 'Breslau thuộc Đức', 'Thành phố Đức, năm 1945 dân Đức bị trục xuất và người Ba Lan từ Lwów chuyển đến'],
    [['Łódź'], 1900, 1989, 'thành phố dệt', 'Hàng trăm nhà máy dệt, công nhân nữ đông đảo']]);
  rev('PL', [[1939, ['Gdańsk'], 'phát súng đầu tiên của Thế chiến II ở Westerplatte', 2, 'grief'], [1980, ['Gdańsk'], 'đình công xưởng đóng tàu, công đoàn Đoàn Kết ra đời', 2, ''], [1944, ['Warsaw'], 'khởi nghĩa Warsaw', 2, 'grief']]);

  ev('NL', [[1932, 'đê Afsluitdijk hoàn thành'], [1975, 'Suriname độc lập'], [1980, 'Nữ hoàng Beatrix lên ngôi'], [1995, 'lũ sông buộc 250 nghìn người sơ tán'], [2002, 'chính trị gia Pim Fortuyn bị ám sát'], [2004, 'đạo diễn Theo van Gogh bị sát hại']]);
  ev('BE', [[1985, 'thảm họa sân vận động Heysel', 1, 'grief'], [1996, 'vụ Dutroux, Tuần hành Trắng'], [2013, 'Vua Philippe lên ngôi']]);
  ev('SE', [[1921, 'phụ nữ đi bầu lần đầu'], [1967, 'đổi sang lái xe bên phải'], [2003, 'Ngoại trưởng Anna Lindh bị sát hại'], [2018, 'mùa hè cháy rừng']]);
  ev('NO', [[1972, 'trưng cầu từ chối gia nhập Cộng đồng châu Âu']]);
  ev('DK', [[1920, 'sáp nhập Nam Jutland'], [1992, 'trưng cầu từ chối Hiệp ước Maastricht'], [2005, 'khủng hoảng tranh biếm họa']]);
  ev('AT', [[1934, 'nội chiến ngắn ngày tháng Hai'], [1986, 'vụ Waldheim'], [2000, 'chính phủ liên minh với đảng FPÖ bị EU phản đối']]);
  ev('CH', [[1992, 'trưng cầu từ chối gia nhập Khu vực Kinh tế châu Âu']]);
  ev('PT', [[1916, 'tham gia Thế chiến I'], [1961, 'mất Goa; chiến tranh thuộc địa ở Angola bắt đầu'], [2017, 'cháy rừng Pedrógão Grande', 1, 'grief']]);
  ev('GR', [[1912, 'chiến tranh Balkan'], [1936, 'chế độ độc tài Metaxas'], [1999, 'động đất Athens'], [2015, 'trưng cầu nói không với điều kiện cứu trợ']]);
  ev('IE', [[1932, 'Éamon de Valera lên nắm quyền'], [1937, 'hiến pháp mới'], [1973, 'gia nhập Cộng đồng châu Âu'], [2018, 'trưng cầu hợp pháp hóa phá thai']]);
  ev('HU', [[2010, 'Viktor Orbán trở lại nắm quyền']]);
  ev('RO', [[1916, 'Romania tham chiến'], [2004, 'gia nhập NATO']]);
  ev('BG', [[1923, 'khởi nghĩa tháng Chín bị dập tắt'], [1946, 'bãi bỏ chế độ quân chủ'], [2004, 'gia nhập NATO']]);
  ev('CZ', [[1999, 'gia nhập NATO'], [2002, 'lũ lụt lớn ở Praha']]);
})(globalThis.G);
