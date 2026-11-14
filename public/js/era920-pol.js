/* Một Đời — 9.2 (giai đoạn 2 bối cảnh lịch sử): tên nước, tình trạng chính trị và tên thành phố THEO NĂM.
   Mở rộng E.ERA920 (era920.js) và đường văn bản có sẵn (E.famLogic, E.placeText); không thêm hệ thống riêng.
   · STATUS[mã nước]: các khoảng năm [từ, đến, mô tả]. Chỉ ghi sự kiện chính trị-pháp lý đã được ghi nhận rộng rãi (độc lập, thống nhất, tan rã, chia cắt, đổi quốc hiệu).
     Đây là bối cảnh: không phải số liệu thống kê, không đánh giá đúng sai về phía nào; mức kiểm chứng: kiến thức công khai (Liên Hợp Quốc, bách khoa), CHƯA đối chiếu từng dòng với nguồn chính thức trong phiên làm việc này.
   · NAMES: tên nước dùng thời đó (Miến Điện, Zaire...). CITIES: tên thành phố đổi theo năm (Sài Gòn trước 2/7/1976, Bombay, Leningrad...) thay vào văn bản nhật ký/cảnh/vị trí khi năm thế giới nhỏ hơn mốc đổi tên.
   · Mô tả hiện ở màn thiết lập (E.ERA920.status), ở dòng nhật ký đầu đời và mỗi khi tình trạng đổi trong đời (E.HOOKS.year). Đời sinh từ 2024 trở đi không đổi. */
(function (G) {
  'use strict';
  var E = G.E, X = E && E.ERA920; if (!X) return;
  var A = 'thuộc địa của ', P = 'lãnh thổ bảo hộ của ';
  // [mã, năm độc lập, bên cai quản] — ghi cho năm thế giới < năm độc lập
  var DEP = [['LY', 1951, 'Anh và Pháp quản lý (Liên Hợp Quốc)'], ['MA', 1956, 'Pháp và Tây Ban Nha (bảo hộ)'], ['TN', 1956, 'Pháp (bảo hộ)'], ['SD', 1956, 'Anh và Ai Cập đồng quản lý'], ['KH', 1953, A + 'Pháp (Liên hiệp Pháp)'], ['LA', 1953, A + 'Pháp (Liên hiệp Pháp)'],
    ['MY', 1957, A + 'Anh (Malaya)'], ['GH', 1957, A + 'Anh (Bờ Biển Vàng)'], ['GN', 1958, A + 'Pháp'], ['CM', 1960, 'lãnh thổ do Pháp và Anh quản lý (ủy trị/giám hộ Liên Hợp Quốc)'], ['TG', 1960, 'lãnh thổ do Pháp quản lý'], ['MG', 1960, A + 'Pháp'], ['CD', 1960, A + 'Bỉ (Congo thuộc Bỉ)'],
    ['SO', 1960, 'lãnh thổ do Ý (giám hộ) và Anh quản lý'], ['BJ', 1960, A + 'Pháp'], ['NE', 1960, A + 'Pháp'], ['BF', 1960, A + 'Pháp'], ['CI', 1960, A + 'Pháp'], ['TD', 1960, A + 'Pháp'], ['CF', 1960, A + 'Pháp'], ['CG', 1960, A + 'Pháp'], ['GA', 1960, A + 'Pháp'], ['SN', 1960, A + 'Pháp'], ['ML', 1960, A + 'Pháp'], ['MR', 1960, A + 'Pháp'],
    ['NG', 1960, A + 'Anh'], ['CY', 1960, A + 'Anh'], ['SL', 1961, A + 'Anh'], ['KW', 1961, P + 'Anh'], ['TZ', 1961, A + 'Anh (Tanganyika)'], ['RW', 1962, 'lãnh thổ do Bỉ quản lý (giám hộ Liên Hợp Quốc)'], ['BI', 1962, 'lãnh thổ do Bỉ quản lý (giám hộ Liên Hợp Quốc)'], ['UG', 1962, A + 'Anh'], ['DZ', 1962, 'lãnh thổ của Pháp (Algérie thuộc Pháp)'],
    ['JM', 1962, A + 'Anh'], ['TT', 1962, A + 'Anh'], ['WS', 1962, 'lãnh thổ do New Zealand quản lý (giám hộ Liên Hợp Quốc)'], ['KE', 1963, A + 'Anh'], ['MW', 1964, A + 'Anh (Nyasaland)'], ['ZM', 1964, A + 'Anh (Bắc Rhodesia)'], ['MT', 1964, A + 'Anh'], ['GM', 1965, A + 'Anh'], ['MV', 1965, P + 'Anh'],
    ['BW', 1966, P + 'Anh (Bechuanaland)'], ['LS', 1966, P + 'Anh (Basutoland)'], ['BB', 1966, A + 'Anh'], ['GY', 1966, A + 'Anh (Guiana thuộc Anh)'], ['MU', 1968, A + 'Anh'], ['SZ', 1968, P + 'Anh'], ['GQ', 1968, A + 'Tây Ban Nha'], ['NR', 1968, 'lãnh thổ do Úc, New Zealand và Anh quản lý (giám hộ Liên Hợp Quốc)'],
    ['FJ', 1970, A + 'Anh'], ['TO', 1970, P + 'Anh'], ['BH', 1971, P + 'Anh'], ['QA', 1971, P + 'Anh'], ['AE', 1971, P + 'Anh (các tiểu vương quốc Trucial)'], ['BS', 1973, A + 'Anh'], ['GW', 1974, A + 'Bồ Đào Nha'], ['GD', 1974, A + 'Anh'], ['MZ', 1975, A + 'Bồ Đào Nha'], ['AO', 1975, A + 'Bồ Đào Nha'], ['CV', 1975, A + 'Bồ Đào Nha'], ['ST', 1975, A + 'Bồ Đào Nha'],
    ['KM', 1975, A + 'Pháp'], ['PG', 1975, 'lãnh thổ do Úc quản lý'], ['SR', 1975, A + 'Hà Lan'], ['SC', 1976, A + 'Anh'], ['DJ', 1977, A + 'Pháp'], ['DM', 1978, A + 'Anh'], ['SB', 1978, A + 'Anh'], ['TV', 1978, A + 'Anh (quần đảo Ellice)'], ['LC', 1979, A + 'Anh'], ['VC', 1979, A + 'Anh'], ['KI', 1979, A + 'Anh (quần đảo Gilbert)'],
    ['VU', 1980, 'lãnh thổ do Anh và Pháp đồng quản lý (Tân Hebrides)'], ['BZ', 1981, A + 'Anh (Honduras thuộc Anh)'], ['AG', 1981, A + 'Anh'], ['KN', 1983, A + 'Anh'], ['BN', 1984, P + 'Anh'], ['NA', 1990, 'lãnh thổ do Nam Phi quản lý (Tây Nam Phi)'], ['MH', 1986, 'lãnh thổ ủy thác Liên Hợp Quốc do Hoa Kỳ quản lý'], ['FM', 1986, 'lãnh thổ ủy thác Liên Hợp Quốc do Hoa Kỳ quản lý'], ['PW', 1994, 'lãnh thổ ủy thác Liên Hợp Quốc do Hoa Kỳ quản lý']];
  var STATUS = {};
  function add(cc, a, b, t) { (STATUS[cc] = STATUS[cc] || []).push([a, b, t]); }
  DEP.forEach(function (d) { add(d[0], 1950, d[1] - 1, d[2]); });
  var SOV = 'một nước cộng hòa thuộc Liên Xô';
  ['RU', 'UA', 'BY', 'MD', 'LT', 'LV', 'EE', 'AM', 'AZ', 'GE', 'KZ', 'KG', 'TJ', 'TM', 'UZ'].forEach(function (c) { add(c, 1950, 1990, SOV); add(c, 1991, 1991, 'Liên Xô tan rã (cuối năm 1991)'); });
  ['CZ', 'SK'].forEach(function (c) { add(c, 1950, 1992, 'Tiệp Khắc (tách thành hai nước ngày 1/1/1993)'); });
  ['SI', 'HR', 'MK'].forEach(function (c) { add(c, 1950, 1990, 'một nước cộng hòa thuộc Nam Tư'); add(c, 1991, 1991, 'tuyên bố độc lập khỏi Nam Tư'); });
  add('BA', 1950, 1991, 'một nước cộng hòa thuộc Nam Tư'); add('BA', 1992, 1995, 'độc lập nhưng có chiến tranh (1992–1995)');
  ['RS', 'ME'].forEach(function (c) { add(c, 1950, 1991, 'Nam Tư'); add(c, 1992, 2002, 'Cộng hòa Liên bang Nam Tư (Serbia và Montenegro)'); add(c, 2003, 2005, 'Liên minh quốc gia Serbia và Montenegro'); });
  add('DE', 1950, 1960, 'nước Đức bị chia thành Tây Đức (CHLB Đức) và Đông Đức (CHDC Đức)'); add('DE', 1961, 1988, 'nước Đức chia đôi; Bức tường Berlin được dựng từ 13/8/1961'); add('DE', 1989, 1989, 'Bức tường Berlin sụp đổ ngày 9/11/1989'); add('DE', 1990, 1990, 'tái thống nhất ngày 3/10/1990');
  add('VN', 1950, 1953, 'chiến tranh Đông Dương lần thứ nhất giữa Pháp và Việt Minh'); add('VN', 1954, 1954, 'Hiệp định Genève (7/1954) chia Việt Nam tại vĩ tuyến 17');
  add('VN', 1955, 1974, 'Việt Nam chia hai miền (Việt Nam Dân chủ Cộng hòa ở phía Bắc, Việt Nam Cộng hòa ở phía Nam); chiến tranh Việt Nam'); add('VN', 1975, 1975, 'chiến tranh Việt Nam kết thúc ngày 30/4/1975'); add('VN', 1976, 1976, 'thống nhất cả nước, Cộng hòa Xã hội Chủ nghĩa Việt Nam từ 2/7/1976');
  ['KR', 'KP'].forEach(function (c) { add(c, 1950, 1953, 'chiến tranh Triều Tiên (đình chiến 27/7/1953)'); });
  add('YE', 1950, 1989, 'Yemen chưa thống nhất (Bắc Yemen và Nam Yemen/Aden), thống nhất 22/5/1990');
  add('BD', 1950, 1970, 'Đông Pakistan (thuộc Pakistan)'); add('BD', 1971, 1971, 'chiến tranh giải phóng, độc lập năm 1971');
  add('ER', 1950, 1951, 'dưới sự quản lý của Anh'); add('ER', 1952, 1990, 'thuộc Ethiopia (liên bang 1952, sáp nhập 1962; chiến tranh đòi độc lập 1961–1991)'); add('ER', 1991, 1992, 'tự quản sau chiến tranh; trưng cầu dân ý năm 1993');
  add('SS', 1950, 2010, 'thuộc Sudan (độc lập tháng 7/2011)');
  add('TL', 1950, 1974, A + 'Bồ Đào Nha (Timor thuộc Bồ)'); add('TL', 1975, 1998, 'bị Indonesia chiếm đóng và sáp nhập năm 1976 (Liên Hợp Quốc không công nhận)'); add('TL', 1999, 2001, 'Liên Hợp Quốc quản lý chuyển tiếp; độc lập 20/5/2002');
  add('SG', 1950, 1962, A + 'Anh'); add('SG', 1963, 1964, 'một bang của Liên bang Malaysia (độc lập riêng 9/8/1965)');
  add('ZW', 1950, 1964, A + 'Anh tự quản (Nam Rhodesia)'); add('ZW', 1965, 1979, 'Rhodesia do chính quyền thiểu số da trắng đơn phương tuyên bố độc lập (1965), không được quốc tế công nhận');
  add('ZA', 1950, 1993, 'chế độ phân biệt chủng tộc apartheid (1948–1994)');
  add('KH', 1970, 1974, 'Cộng hòa Khmer; nội chiến'); add('KH', 1975, 1978, 'Campuchia Dân chủ dưới chế độ Khmer Đỏ (17/4/1975–7/1/1979)'); add('KH', 1979, 1988, 'Cộng hòa Nhân dân Campuchia; nội chiến tiếp diễn'); add('KH', 1989, 1992, 'Nhà nước Campuchia; Liên Hợp Quốc quản lý chuyển tiếp 1992–1993');
  // bối cảnh chính trị lớn khác (chỉ ghi các giai đoạn đã được ghi nhận rộng rãi; không gán đúng sai; chưa có cơ chế gameplay riêng ngoài hist920.js)
  [['AR', 1976, 1982, 'chế độ độc tài quân sự (24/3/1976–10/12/1983)'], ['CL', 1973, 1989, 'chế độ quân sự của Pinochet (11/9/1973–11/3/1990)'], ['BR', 1964, 1984, 'chế độ quân sự (1/4/1964–15/3/1985)'], ['UY', 1973, 1984, 'chế độ độc tài dân sự–quân sự (1973–1985)'], ['ES', 1950, 1974, 'chế độ độc tài của Franco (đến cuối năm 1975)'], ['PT', 1950, 1973, 'chế độ Estado Novo (đến Cách mạng Hoa cẩm chướng 25/4/1974)'], ['PT', 1974, 1974, 'Cách mạng Hoa cẩm chướng (25/4/1974)'], ['GR', 1967, 1973, 'chế độ quân sự (21/4/1967–24/7/1974)'], ['CY', 1974, 1974, 'đảo đảo chính và Thổ Nhĩ Kỳ đưa quân vào; đảo bị chia cắt'],
    ['IR', 1979, 1979, 'cách mạng Hồi giáo (1979)'], ['IR', 1980, 1988, 'chiến tranh Iran–Iraq (9/1980–8/1988)'], ['IQ', 1980, 1988, 'chiến tranh Iran–Iraq (9/1980–8/1988)'], ['KW', 1990, 1991, 'Iraq xâm chiếm Kuwait (2/8/1990) và chiến tranh Vùng Vịnh'], ['IQ', 1990, 1991, 'chiến tranh Vùng Vịnh sau khi Iraq xâm chiếm Kuwait'], ['IQ', 2003, 2011, 'chiến tranh Iraq và thời kỳ quân đội nước ngoài hiện diện (3/2003–12/2011)'],
    ['AF', 1979, 1989, 'quân đội Liên Xô can thiệp và chiến tranh (12/1979–2/1989)'], ['AF', 1996, 2000, 'phong trào Taliban cầm quyền phần lớn đất nước'], ['AF', 2001, 2020, 'chiến tranh và sự hiện diện quân sự nước ngoài (10/2001–8/2021)'], ['AF', 2021, 2023, 'Taliban trở lại cầm quyền (8/2021)'],
    ['LB', 1975, 1990, 'nội chiến Liban (4/1975–10/1990)'], ['SY', 2011, 2023, 'nội chiến Syria (từ 2011)'], ['UA', 2014, 2021, 'Nga sáp nhập Crimea (2014) và chiến sự ở vùng Donbas'], ['UA', 2022, 2023, 'Nga tấn công toàn diện (từ 24/2/2022)'],
    ['ET', 1974, 1990, 'chế độ quân sự Derg và nội chiến (1974–1991)'], ['SO', 1991, 2023, 'nội chiến, không có chính phủ trung ương hiệu lực từ 1991'], ['SL', 1991, 2002, 'nội chiến Sierra Leone (1991–2002)'], ['LR', 1989, 2003, 'các cuộc nội chiến ở Liberia (1989–2003)'], ['AO', 1975, 2001, 'nội chiến Angola (1975–2002)'], ['MZ', 1977, 1991, 'nội chiến Mozambique (1977–1992)'], ['DZ', 1991, 2001, 'nội chiến Algeria (thập niên 1990)'], ['CD', 1996, 2002, 'các cuộc chiến tranh Congo (1996–97 và 1998–2003)'],
    ['RW', 1990, 1993, 'nội chiến Rwanda (1990–1993)'], ['RW', 1994, 1994, 'diệt chủng người Tutsi ở Rwanda (4–7/1994)'], ['BI', 1993, 2004, 'nội chiến Burundi (1993–2005)'], ['NG', 1967, 1970, 'nội chiến Nigeria (Biafra, 1967–1970)'], ['SD', 1983, 2004, 'nội chiến Sudan lần thứ hai (1983–2005)'],
    ['LK', 1983, 2008, 'nội chiến Sri Lanka (1983–5/2009)'], ['CO', 1964, 2015, 'xung đột vũ trang nội bộ Colombia (đến thỏa thuận hòa bình 2016)'], ['NP', 1996, 2005, 'nội chiến do phong trào Maoist phát động (1996–2006)'], ['PE', 1980, 1999, 'xung đột nội bộ Peru (1980–2000)'], ['GT', 1960, 1995, 'nội chiến Guatemala (1960–1996)'], ['SV', 1979, 1991, 'nội chiến El Salvador (1979–1992)'], ['NI', 1979, 1989, 'cách mạng Sandinista (1979) và chiến tranh Contra'],
    ['CU', 1991, 1995, 'thời kỳ đặc biệt sau khi Liên Xô tan rã'], ['KP', 1994, 1998, 'nạn đói nghiêm trọng (1994–1998)'], ['ID', 1965, 1966, 'biến động chính trị và bạo lực hàng loạt (1965–1966)'], ['ID', 1998, 1998, 'khủng hoảng và Suharto từ chức (21/5/1998)'], ['CN', 1959, 1961, 'nạn đói lớn sau phong trào Đại nhảy vọt'], ['CN', 1966, 1976, 'Cách mạng Văn hóa (1966–1976)'], ['CN', 1980, 2015, 'chính sách kế hoạch hóa gia đình "một con" (1980–2015)'],
    ['IN', 1975, 1976, 'tình trạng khẩn cấp (6/1975–3/1977)'], ['PK', 1971, 1971, 'chiến tranh với Ấn Độ và Đông Pakistan ly khai'], ['MM', 1962, 1987, 'chế độ quân sự của Ne Win (từ 3/1962)'], ['MM', 1988, 1988, 'cuộc nổi dậy 8/1988 và quân đội nắm quyền'], ['MM', 2021, 2023, 'quân đội đảo chính (1/2/2021)'], ['LA', 1960, 1974, 'nội chiến Lào (1959–1975)'], ['LA', 1975, 1975, 'Cộng hòa Dân chủ Nhân dân Lào ra đời (12/1975)'],
    ['HU', 1956, 1956, 'cách mạng Hungary (10–11/1956)'], ['RO', 1989, 1989, 'cách mạng Romania (12/1989)'], ['KR', 1961, 1986, 'các chính quyền độc tài quân sự (1961–1987)'], ['KR', 1987, 1987, 'dân chủ hóa sau phong trào tháng 6/1987'], ['PH', 1972, 1980, 'thiết quân luật dưới thời Marcos (9/1972–1/1981)'], ['PH', 1986, 1986, 'cách mạng Quyền lực Nhân dân (2/1986)']]
    .forEach(function (x) { add(x[0], x[1], x[2], x[3]); });
  // tên nước dùng thời đó: [mã, từ, đến, tên]
  var NAMES = [['MM', 1950, 1988, 'Miến Điện (Burma)'], ['LK', 1950, 1971, 'Ceylon'], ['CD', 1971, 1996, 'Zaire'], ['BJ', 1960, 1974, 'Dahomey'], ['BF', 1960, 1983, 'Thượng Volta'], ['SZ', 1950, 2017, 'Swaziland'], ['MK', 1991, 2018, 'Macedonia'], ['WS', 1950, 1996, 'Tây Samoa'], ['ZW', 1950, 1979, 'Rhodesia'], ['BZ', 1950, 1972, 'Honduras thuộc Anh'], ['GY', 1950, 1965, 'Guiana thuộc Anh'], ['TV', 1950, 1977, 'quần đảo Ellice'], ['KI', 1950, 1978, 'quần đảo Gilbert'], ['VU', 1950, 1979, 'Tân Hebrides'], ['DJ', 1967, 1976, 'Lãnh thổ người Afar và Issa'], ['KH', 1970, 1974, 'Cộng hòa Khmer'], ['KH', 1975, 1978, 'Campuchia Dân chủ'], ['KH', 1979, 1988, 'Cộng hòa Nhân dân Campuchia']];
  // tên thành phố: [tên hiện nay, tên thời đó, năm cuối còn dùng tên cũ, (tùy chọn) năm đầu]
  var CITIES = [['TP. Hồ Chí Minh', 'Sài Gòn', 1975], ['Mumbai', 'Bombay', 1994], ['Chennai', 'Madras', 1995], ['Kolkata', 'Calcutta', 2000], ['Bengaluru', 'Bangalore', 2013], ['Yangon', 'Rangoon', 1988], ['Saint Petersburg', 'Leningrad', 1990], ['Volgograd', 'Stalingrad', 1960], ['Almaty', 'Alma-Ata', 1992], ['Astana', 'Akmola', 1997], ['Bishkek', 'Frunze', 1990], ['Dushanbe', 'Stalinabad', 1960], ['Kinshasa', 'Léopoldville', 1965], ['Lubumbashi', 'Élisabethville', 1965], ['Harare', 'Salisbury', 1981], ['Mutare', 'Umtali', 1981], ['Gweru', 'Gwelo', 1981], ['Maputo', 'Lourenço Marques', 1975], ['Huambo', 'Nova Lisboa', 1974]];
  function resCC(l) { return (l && l.abroad && l.abroad.perm && l.abroad.code) || (l && l.country) || null; }
  function status(cc, y) { var s = STATUS[cc]; if (!s) return null; for (var i = 0; i < s.length; i++) if (y >= s[i][0] && y <= s[i][1]) return s[i][2]; return null; }
  function nameAt(cc, y) { for (var i = 0; i < NAMES.length; i++) if (NAMES[i][0] === cc && y >= NAMES[i][1] && y <= NAMES[i][2]) return NAMES[i][3]; return null; }
  function wy(l) { return l && l.birthYear != null ? l.birthYear + (l.age || 0) : 9999; }
  // thay tên thành phố hiện nay bằng tên thời đó (nhận diện ranh giới từ, không dùng lookbehind để chạy được trên Safari cũ)
  var LET = 'A-Za-zÀ-ỹ', CITY_MAX = CITIES.reduce(function (m, c) { return Math.max(m, c[2]); }, 2021), reCache = {};
  function cityRe(name) { return reCache[name] || (reCache[name] = new RegExp('(^|[^' + LET + '])' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![' + LET + '])', 'g')); }
  function rename(l, s) {
    var y = wy(l); if (typeof s !== 'string' || y > CITY_MAX || !s) return s;
    for (var i = 0; i < CITIES.length; i++) {
      var c = CITIES[i]; if (y > c[2] || s.indexOf(c[0]) < 0) continue;
      s = s.replace(cityRe(c[0]), function (m, p) { return p + c[1]; });
    }
    if (y >= 2019 && y <= 2021 && s.indexOf('Astana') >= 0) s = s.replace(cityRe('Astana'), function (m, p) { return p + 'Nur-Sultan'; });
    return s;
  }
  function note(l) { var cc = resCC(l), y = wy(l); return cc ? status(cc, y) : null; }
  var famLogic0 = E.famLogic;
  E.famLogic = function (l, t, isLog) { var u = famLogic0 ? famLogic0.call(this, l, t, isLog) : t; return u == null ? u : rename(l, u); };
  var placeText0 = E.placeText;
  if (typeof placeText0 === 'function') E.placeText = function (l) { return rename(l, placeText0.apply(this, arguments)); };
  // đời có số liệu theo năm: ghi bối cảnh chính trị lúc sinh và mỗi khi tình trạng đổi
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !l.era920 || wy(l) > X.TO) return;
    var cc = l.country, y = wy(l), s = status(cc, y), m = l.era920, prev = m.pol === undefined ? undefined : m.pol;
    if (prev === s) return; m.pol = s || null;
    if (!s && prev === undefined) return;
    var nm = nameAt(cc, y);
    if (s) log((prev === undefined ? 'Bối cảnh năm ' + y + ': ' : 'Năm ' + y + ', bối cảnh nơi bạn sống đổi: ') + (nm ? nm + ' — ' : '') + s + '.', 'info');
    else if (prev) log('Năm ' + y + ': ' + (nameAt(cc, y - 1) ? nameAt(cc, y - 1) + ' không còn dùng tên cũ. ' : '') + 'Tình trạng chính trị nơi bạn sống đã khác trước.', 'info');
  });
  X.POL = { STATUS: STATUS, NAMES: NAMES, CITIES: CITIES, status: status, nameAt: nameAt, rename: rename, note: note };
})(globalThis.G);
