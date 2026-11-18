/* Một Đời — 9.5.5 bổ sung bảng bối cảnh: các biến cố lớn còn thiếu theo nước và năm (xung đột, nạn đói, dịch bệnh, khủng hoảng kinh tế, thiên tai) và vùng trong nước.
   Nguồn: các bài Wikipedia về từng sự kiện; đối chiếu kiểm tra độ phủ bằng danh sách 311 biến cố đã biết (xem docs/BOI-CANH-THOI-DAI-955.md).
   Cùng định dạng các bảng trước: WAR [nước, từ, đến, mức, loại, tên]; FAM [nước, từ, đến, mức, tên]; EPI [nước, từ, đến, mức, tên]; ECON [nước, từ, đến, mức, loại, tên]; DIS [nước, năm, mức, tên];
   ZONE [nước, từ, đến, 'thành phố (regex)', {war|fam|dis: ±n hoặc '=n'}, nhãn]. Mọi sự kiện mức 2–3 phải có vùng hoặc có lý do giữ đồng đều (ZONE_NATIONAL); tests/ctx952.js kiểm tra. */
(function (G) {
  'use strict';
  var D = G.CTX945_DATA; if (!D) return;
  var Z = [], NAT = [];
  function z(cc, a, b, re, d, n) { Z.push([cc, a, b, re, d, n]); }
  function nat(cc, a, b, why) { NAT.push([cc, a, b, why]); }
  function natG(g, a, b, why) { (D.GRP[g] || [g]).forEach(function (c) { nat(c, a, b, why); }); }

  var WAR = [
    ['CZ', 1968, 1968, 1, 'occ', 'Quân đội Khối Warsaw đưa vào Tiệp Khắc (8/1968)'], ['SK', 1968, 1968, 1, 'occ', 'Quân đội Khối Warsaw đưa vào Tiệp Khắc (8/1968)'],
    ['GE', 2008, 2008, 1, 'war', 'Chiến tranh Nga–Gruzia (8/2008)'],
    ['PS', 1987, 1993, 2, 'ins', 'Intifada thứ nhất'], ['PS', 2000, 2005, 3, 'ins', 'Intifada thứ hai'],
    ['LY', 2012, 2013, 1, 'civil', 'Bất ổn và dân quân sau cuộc nổi dậy 2011'], ['LY', 2014, 2020, 2, 'civil', 'Nội chiến Libya lần hai'],
    ['JO', 1970, 1971, 1, 'civil', 'Tháng Chín Đen (1970–71)'],
    ['UG', 1996, 2006, 2, 'ins', 'Quân Kháng chiến Chúa (LRA) ở miền bắc Uganda'],
    ['ZA', 1984, 1994, 1, 'ins', 'Bạo lực chính trị cuối thời apartheid'],
    ['MN', 1937, 1939, 1, 'terror', 'Thanh trừng chính trị ở Mông Cổ'],
    ['HN', 1982, 1990, 1, 'ins', 'Căn cứ Contra và quân đội Mỹ ở Honduras'],
    ['BO', 1952, 1952, 1, 'civil', 'Cách mạng Bolivia (4/1952)'],
    ['EC', 1995, 1995, 1, 'war', 'Chiến tranh Cenepa với Peru'],
    ['PA', 1989, 1990, 1, 'war', 'Mỹ đưa quân vào Panama (12/1989)'],
    ['FI', 1939, 1940, 2, 'war', 'Chiến tranh Mùa đông'], ['FI', 1941, 1944, 2, 'war', 'Chiến tranh Tiếp diễn'], ['FI', 1944, 1945, 1, 'war', 'Chiến tranh Lapland'],
    ['SU', 1914, 1917, 2, 'war', 'Thế chiến thứ nhất trên đất Đế quốc Nga']
  ];
  var FAM = [
    ['IN', 1965, 1967, 1, 'Nạn đói Bihar 1966–67'], ['IN', 1900, 1902, 2, 'Nạn đói Ấn Độ 1899–1900'],
    ['AO', 1985, 2002, 2, 'Thiếu lương thực vì nội chiến Angola'], ['MW', 2002, 2002, 2, 'Nạn đói Malawi 2002'], ['ZW', 2002, 2009, 2, 'Thiếu lương thực ở Zimbabwe'],
    ['SAH', 1968, 1974, 2, 'Hạn hán Sahel 1968–74'], ['NG', 1973, 1974, 1, 'Hạn hán Sahel ở miền bắc Nigeria'],
    ['KE', 2008, 2009, 1, 'Hạn hán Đông Phi 2008–09'], ['NE', 2010, 2010, 2, 'Nạn đói Niger 2010'], ['ET', 2015, 2016, 2, 'Hạn hán Ethiopia 2015–16'],
    ['AF', 2021, 2023, 2, 'Khủng hoảng lương thực Afghanistan sau 2021'], ['HT', 2021, 2023, 1, 'Thiếu lương thực vì bạo lực băng đảng ở Haiti']
  ];
  var EPI = [
    ['US', 1952, 1953, 1, 'Dịch bại liệt 1952'], ['CN', 2003, 2003, 1, 'SARS 2003'], ['SG', 2003, 2003, 1, 'SARS 2003'],
    ['MX', 2009, 2009, 1, 'Cúm A (H1N1) 2009'], ['BR', 2015, 2016, 1, 'Dịch Zika 2015–16'], ['KR', 2015, 2015, 1, 'Dịch MERS 2015'],
    ['CD', 2018, 2020, 2, 'Dịch Ebola ở miền đông Congo'], ['YE', 2016, 2020, 2, 'Dịch tả ở Yemen'], ['ZW', 2008, 2009, 2, 'Dịch tả Zimbabwe 2008–09'],
    ['PE', 1991, 1992, 1, 'Dịch tả Peru 1991'], ['ID', 1961, 1964, 1, 'Đại dịch tả El Tor lan từ Indonesia'], ['IN', 1994, 1994, 1, 'Dịch hạch Surat 1994'],
    ['TH', 1990, 2000, 2, 'Đại dịch HIV/AIDS ở Thái Lan'], ['RU', 2000, 2015, 1, 'Dịch HIV ở Nga'], ['UA', 2000, 2015, 1, 'Dịch HIV ở Ukraina'], ['NG', 1995, 2010, 1, 'Dịch HIV ở Nigeria'],
    ['IT', 2020, 2020, 3, 'Đợt COVID-19 đầu tiên ở Ý'], ['IR', 2020, 2020, 3, 'Đợt COVID-19 đầu tiên ở Iran'], ['US', 2020, 2021, 3, 'Đợt COVID-19 nặng ở Mỹ'], ['GB', 2020, 2021, 3, 'Đợt COVID-19 nặng ở Anh'],
    ['VN', 2021, 2021, 2, 'Đợt Delta của COVID-19 ở Việt Nam'], ['CN', 2020, 2020, 2, 'Đợt COVID-19 đầu tiên ở Trung Quốc']
  ];
  var ECON = [
    ['US', 1973, 1975, 1, 'dep', 'cú sốc dầu mỏ và suy thoái 1973–75'], ['GB', 1973, 1976, 1, 'dep', 'suy thoái, lạm phát và khủng hoảng IMF 1976'], ['JP', 1974, 1975, 1, 'dep', 'cú sốc dầu mỏ 1973–74'], ['FR', 1974, 1975, 1, 'dep', 'cú sốc dầu mỏ'], ['IT', 1974, 1976, 1, 'dep', 'cú sốc dầu mỏ và lạm phát'],
    ['US', 1980, 1982, 1, 'dep', 'suy thoái đầu thập niên 1980'], ['GB', 1979, 1982, 1, 'dep', 'suy thoái và thất nghiệp đầu thập niên 1980'],
    ['JP', 1991, 2002, 1, 'dep', 'thập niên mất mát sau vỡ bong bóng'], ['SE', 1991, 1993, 1, 'dep', 'khủng hoảng ngân hàng Bắc Âu'], ['FI', 1991, 1993, 2, 'dep', 'khủng hoảng ngân hàng và mất thị trường Liên Xô'], ['NO', 1988, 1992, 1, 'dep', 'khủng hoảng ngân hàng Na Uy'],
    ['MX', 1994, 1995, 2, 'dep', 'khủng hoảng Tequila'], ['BR', 1998, 1999, 1, 'dep', 'khủng hoảng tiền tệ Brazil'], ['TR', 2001, 2001, 2, 'dep', 'khủng hoảng tài chính Thổ Nhĩ Kỳ 2001'], ['EC', 1998, 2000, 2, 'dep', 'khủng hoảng ngân hàng và đô la hóa Ecuador'], ['UY', 2002, 2002, 2, 'dep', 'khủng hoảng Uruguay 2002'], ['VE', 1989, 1990, 1, 'dep', 'khủng hoảng và bạo loạn Caracazo'],
    ['RU', 2014, 2016, 1, 'dep', 'suy thoái Nga 2014–16'], ['PT', 2010, 2014, 1, 'dep', 'khủng hoảng nợ và thắt lưng buộc bụng ở Bồ Đào Nha'], ['IT', 2011, 2014, 1, 'dep', 'khủng hoảng nợ công và suy thoái ở Ý'],
    ['NG', 1983, 1986, 2, 'dep', 'suy thoái và điều chỉnh cơ cấu ở Nigeria'], ['ZM', 1990, 1993, 2, 'col', 'khủng hoảng kinh tế Zambia'], ['PH', 1983, 1985, 2, 'dep', 'khủng hoảng nợ và chính trị ở Philippines'],
    ['CZ', 1991, 1992, 1, 'col', 'chuyển đổi kinh tế Tiệp Khắc'], ['SK', 1991, 1993, 1, 'col', 'chuyển đổi kinh tế Slovakia'], ['HU', 1990, 1993, 1, 'col', 'chuyển đổi kinh tế Hungary'],
    ['EG', 2016, 2017, 1, 'dep', 'thả nổi đồng bảng Ai Cập và lạm phát'], ['AR', 2018, 2020, 1, 'dep', 'khủng hoảng tiền tệ Argentina'], ['LB', 1984, 1990, 2, 'hyp', 'lạm phát và đồng tiền mất giá thời nội chiến Liban'], ['IR', 2018, 2020, 1, 'hyp', 'trừng phạt, lạm phát cao ở Iran'],
    ['VN', 1986, 1988, 3, 'hyp', 'siêu lạm phát 1986–88 sau đợt đổi tiền 1985'], ['IN', 1991, 1991, 1, 'dep', 'khủng hoảng cán cân thanh toán 1991'], ['ID', 1965, 1966, 3, 'hyp', 'siêu lạm phát Indonesia 1965–66'], ['ZW', 1999, 2006, 1, 'dep', 'suy thoái kéo dài ở Zimbabwe'],
    ['AR', 1989, 1990, 3, 'hyp', 'siêu lạm phát Argentina 1989–90'], ['YU', 1989, 1991, 2, 'hyp', 'lạm phát phi mã cuối thời Nam Tư'], ['IL', 1983, 1985, 1, 'hyp', 'lạm phát phi mã Israel 1983–85'], ['TR', 1994, 1994, 1, 'dep', 'khủng hoảng tiền tệ Thổ Nhĩ Kỳ 1994'], ['CD', 1991, 1993, 3, 'hyp', 'cướp bóc 1991 và siêu lạm phát ở Zaire'], ['MK', 1992, 1993, 1, 'hyp', 'lạm phát Macedonia sau độc lập']
  ];
  var DIS = [
    ['IN', 2004, 1, 'Sóng thần Ấn Độ Dương 2004 (bờ biển Tamil Nadu)'], ['US', 2005, 1, 'Bão Katrina 2005'], ['CO', 1985, 2, 'Núi lửa Nevado del Ruiz phá hủy Armero'], ['IT', 1908, 3, 'Động đất và sóng thần Messina 1908'], ['IT', 1980, 1, 'Động đất Irpinia 1980'], ['IT', 2009, 1, 'Động đất L’Aquila 2009'],
    ['VN', 1971, 2, 'Lũ lớn miền Bắc 1971'], ['VN', 1997, 2, 'Bão Linda 1997 ở Nam Bộ'], ['VN', 1999, 1, 'Lũ lịch sử miền Trung 1999'], ['VN', 2006, 1, 'Bão Xangsane 2006'], ['VN', 2017, 1, 'Bão Damrey 2017'], ['VN', 2020, 1, 'Mưa lũ lớn miền Trung 2020'],
    ['NL', 1953, 2, 'Lũ biển Bắc 1953'], ['AU', 2009, 1, 'Cháy rừng Black Saturday 2009'], ['AU', 2019, 1, 'Cháy rừng lớn 2019–20'], ['NZ', 2011, 1, 'Động đất Christchurch 2011'], ['AF', 2022, 1, 'Động đất Afghanistan 2022'], ['DE', 2021, 1, 'Lũ Ahr và miền tây Đức 2021'], ['FR', 2003, 1, 'Đợt nóng châu Âu 2003'], ['IT', 2003, 1, 'Đợt nóng châu Âu 2003'], ['RU', 2010, 1, 'Đợt nóng và cháy rừng Nga 2010']
  ];

  // ===== vùng trong nước =====
  z('GB', 1969, 1998, 'Belfast', { war: '=1' }, 'Xung đột Bắc Ireland tập trung ở Belfast và Derry; phần còn lại của Vương quốc Anh chịu ảnh hưởng nhẹ');
  z('ES', 1968, 2010, 'Bilbao', { war: '=1' }, 'ETA hoạt động mạnh nhất ở xứ Basque');
  z('US', 2005, 2005, 'Houston|New York', { dis: '=1' }, 'Tị nạn bão Katrina: Houston tiếp nhận hàng chục nghìn người di tản');
  z('NZ', 2011, 2011, 'Christchurch', { dis: '=2' }, 'Động đất Christchurch phá hủy khu trung tâm');
  z('NZ', 2011, 2011, 'Auckland|Wellington|Hamilton|Dunedin', { dis: '=0' }, 'Các thành phố khác không bị ảnh hưởng trực tiếp');
  z('IT', 1908, 1908, 'Palermo', { dis: '=1' }, 'Messina nằm bên kia eo biển; Palermo chỉ chịu rung chuyển và làn sóng tị nạn');
  z('IT', 1908, 1908, 'Rome|Milan|Naples|Turin|Genoa|Bologna|Florence|Bari', { dis: '=0' }, 'Động đất tập trung ở Messina và Reggio Calabria');
  z('IT', 1980, 1980, 'Naples', { dis: '=1' }, 'Động đất Irpinia gây thiệt hại nặng ở vùng Campania và Basilicata');
  z('IT', 1980, 1980, 'Rome|Milan|Turin|Palermo|Genoa|Bologna|Florence|Bari', { dis: '=0' }, 'Chỉ ảnh hưởng miền nam');
  z('IT', 2009, 2009, 'Rome', { dis: '=0' }, 'Chỉ ảnh hưởng vùng Abruzzo');
  z('IN', 2004, 2004, 'Chennai', { dis: '=1' }, 'Sóng thần tràn bờ biển Tamil Nadu');
  z('IN', 2004, 2004, 'Delhi|Jaipur|Lucknow|Patna|Kanpur|Indore|Bhopal|Bengaluru|Hyderabad|Pune|Ahmedabad|Mumbai|Kolkata', { dis: '=0' }, 'Các thành phố nội địa và phía tây không bị ảnh hưởng');
  z('CO', 1985, 1985, 'Medellín|Cali|Barranquilla|Cartagena|Bucaramanga|Bogotá', { dis: '=0' }, 'Núi lửa Ruiz chỉ chôn vùi Armero và vùng Tolima');
  z('AU', 2009, 2009, 'Melbourne', { dis: '=1' }, 'Cháy rừng Victoria, khói phủ Melbourne');
  z('AU', 2009, 2009, 'Sydney|Brisbane|Perth|Adelaide|Canberra', { dis: '=0' }, 'Ngoài bang Victoria không bị ảnh hưởng trực tiếp');
  z('AU', 2019, 2019, 'Sydney|Canberra', { dis: '=1' }, 'Khói cháy rừng phủ kín Sydney và Canberra');
  z('AU', 2019, 2019, 'Perth|Adelaide|Brisbane|Melbourne', { dis: '=0' }, 'Ít bị ảnh hưởng hơn');
  z('DE', 2021, 2021, 'Cologne|Düsseldorf', { dis: '=1' }, 'Lũ Ahr và Erft ở Rheinland');
  z('DE', 2021, 2021, 'Berlin|Hamburg|Munich|Frankfurt|Stuttgart|Leipzig|Dresden', { dis: '=0' }, 'Ngoài miền tây ít ảnh hưởng');
  z('FR', 2003, 2003, 'Paris|Lyon', { dis: '=2' }, 'Đợt nóng 2003 gây nhiều ca tử vong ở người già trong thành phố lớn');
  z('IT', 2003, 2003, 'Rome|Milan|Turin', { dis: '=1' }, 'Đợt nóng 2003');
  z('NL', 1953, 1953, 'Rotterdam', { dis: '=1' }, 'Lũ nước dâng tràn vùng đồng bằng Zeeland và Nam Holland');
  z('NL', 1953, 1953, 'Groningen|Utrecht|Eindhoven', { dis: '=0' }, 'Ít ảnh hưởng ngoài vùng ven biển phía tây nam');
  z('RU', 2010, 2010, 'Moscow|Nizhny Novgorod|Kazan', { dis: '=2' }, 'Khói cháy rừng và đợt nóng kỷ lục quanh Moscow');
  z('RU', 2010, 2010, 'Saint Petersburg|Novosibirsk|Yekaterinburg|Chelyabinsk|Omsk|Samara|Vladivostok', { dis: '=0' }, 'Ít bị ảnh hưởng hơn');
  z('VN', 1971, 1971, 'Hà Nội|Hạ Long|Hải Dương|Hưng Yên|Nam Định|Thái Bình|Ninh Bình|Hà Nam|Vĩnh Yên|Việt Trì', { dis: '=2' }, 'Lũ sông Hồng vỡ đê, ngập Hà Nội và đồng bằng Bắc Bộ');
  z('VN', 1971, 1971, 'Cần Thơ|Cà Mau|Rạch Giá|Sài Gòn|Hồ Chí Minh|Huế|Đà Nẵng|Nha Trang|Buôn Ma Thuột|Pleiku|Đà Lạt', { dis: '=0' }, 'Ngoài miền Bắc không bị ảnh hưởng trực tiếp');
  z('VN', 1997, 1997, 'Cà Mau|Bạc Liêu|Rạch Giá|Sóc Trăng', { dis: '=2' }, 'Bão Linda đổ bộ mũi Cà Mau, thiệt hại nặng nhất về người và nhà');
  z('VN', 1997, 1997, 'Hà Nội|Hạ Long|Huế|Đà Nẵng|Nha Trang|Sài Gòn|Hồ Chí Minh', { dis: '=0' }, 'Ngoài Nam Bộ không bị ảnh hưởng');
  z('VN', 1999, 1999, 'Huế|Đà Nẵng|Tam Kỳ|Quảng Ngãi|Đồng Hới|Đông Hà', { dis: '=2' }, 'Lũ lịch sử miền Trung tháng 11/1999');
  z('VN', 2020, 2020, 'Huế|Đông Hà|Đồng Hới|Đà Nẵng', { dis: '=2' }, 'Mưa lũ lịch sử miền Trung 2020');
  z('VN', 2017, 2017, 'Nha Trang|Tuy Hòa|Quy Nhơn', { dis: '=2' }, 'Bão Damrey đổ bộ vùng Khánh Hòa và Phú Yên');
  z('VN', 2006, 2006, 'Đà Nẵng|Huế|Tam Kỳ', { dis: '=2' }, 'Bão Xangsane đổ bộ Đà Nẵng');
  z('GE', 2008, 2008, 'Tbilisi', { war: '=0' }, 'Giao tranh ở Nam Ossetia và quanh Gori; Tbilisi bị đe dọa nhưng không bị tấn công');
  z('FI', 1939, 1944, 'Tampere|Oulu|Turku', { war: '=1' }, 'Không quân Liên Xô ném bom các thành phố lớn nhưng mặt trận ở Karelia');
  z('FI', 1944, 1945, 'Oulu', { war: '=2' }, 'Chiến tranh Lapland: quân Đức rút và tàn phá phía bắc');
  z('PS', 1987, 1993, 'Gaza|Khan Younis|Hebron|Nablus|Jenin', { war: 1 }, 'Intifada thứ nhất bùng lên mạnh ở Gaza và Bờ Tây');
    z('LY', 2014, 2020, 'Benghazi|Tripoli', { war: 1 }, 'Giao tranh nặng ở Benghazi (2014–17) và Tripoli (2019–20)');
  z('UG', 1996, 2006, 'Gulu|Lira', { war: 1 }, 'LRA hoạt động mạnh nhất ở miền bắc, hàng trăm nghìn người sống trong trại tị nạn');
  z('UG', 1996, 2006, 'Kampala|Jinja|Mbarara|Mbale', { war: -1 }, 'Miền nam và thủ đô ổn định hơn');
  // lý do giữ đồng đều cho các sự kiện mức 2–3 chưa có vùng
  nat('PS', 1987, 1993, 'Lãnh thổ nhỏ, cả Bờ Tây và Gaza đều chịu Intifada');
  nat('PS', 2000, 2005, 'Lãnh thổ nhỏ, cả Bờ Tây và Gaza đều chịu Intifada thứ hai');
  nat('LY', 2014, 2020, 'Chia hai chính quyền, các thành phố ven biển cùng chịu bất ổn');
  nat('UG', 1996, 2006, 'Miền bắc chịu LRA, miền nam ổn định; đã có vùng cho Gulu và Lira');
  nat('FI', 1939, 1940, 'Hầu hết các thành phố bị ném bom hoặc huy động; chiến sự trên đất ở Karelia');
  nat('FI', 1941, 1944, 'Cuộc chiến toàn quốc, thành phố lớn bị không quân Liên Xô ném bom');
  nat('AO', 1985, 2002, 'Nội chiến lan khắp cả nước, đói nhất ở vùng cao nguyên');
  nat('MW', 2002, 2002, 'Hạn hán và mất mùa trên toàn quốc');
  nat('ZW', 2002, 2009, 'Thiếu lương thực và siêu lạm phát trên toàn quốc');
  nat('IN', 1900, 1902, 'Hạn hán và nạn đói trải dài nhiều vùng của Ấn Độ thuộc Anh');
  nat('NE', 2010, 2010, 'Hạn hán Sahel toàn quốc');
  nat('ET', 2015, 2016, 'Hạn hán El Niño toàn quốc');
  nat('AF', 2021, 2023, 'Khủng hoảng lương thực toàn quốc sau 2021');
  natG('SAH', 1968, 1974, 'Hạn hán Sahel trải dài suốt vành đai');
  natG('SU', 1914, 1917, 'Đế quốc Nga: chiến sự ở miền tây, huy động và thiếu lương thực toàn quốc');
  nat('CO', 1985, 1985, 'Thảm họa Armero ở vùng Tolima, các thành phố lớn không bị ảnh hưởng (đã có vùng)');
  nat('IT', 1908, 1908, 'Thảm họa Messina; các thành phố trong danh sách chủ yếu ở xa (đã có vùng)');
  nat('NL', 1953, 1953, 'Lũ biển Bắc: đã có vùng cho Rotterdam');
  nat('VN', 1971, 1971, 'Lũ miền Bắc: đã có vùng');
  nat('VN', 1997, 1997, 'Bão Linda: đã có vùng');
  nat('DE', 2021, 2021, 'Lũ miền tây: đã có vùng');

  (D.WAR = D.WAR || []).push.apply(D.WAR, WAR);
  (D.FAM = D.FAM || []).push.apply(D.FAM, FAM);
  (D.EPI = D.EPI || []).push.apply(D.EPI, EPI);
  (D.ECON = D.ECON || []).push.apply(D.ECON, ECON);
  (D.DIS = D.DIS || []).push.apply(D.DIS, DIS);
  (D.ZONE = D.ZONE || []).push.apply(D.ZONE, Z);
  D.ZONE_NATIONAL = (D.ZONE_NATIONAL || []).concat(NAT);
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
