/* Một Đời — 9.2 (giai đoạn 2 bối cảnh lịch sử): tên nước, tình trạng chính trị và tên thành phố THEO NĂM.
   Mở rộng E.ERA920 (era920.js) và đường văn bản có sẵn (E.famLogic, E.placeText); không thêm hệ thống riêng.
   · STATUS[mã nước]: các khoảng năm [từ, đến, mô tả]. Chỉ ghi sự kiện chính trị-pháp lý đã được ghi nhận rộng rãi (độc lập, thống nhất, tan rã, chia cắt, đổi quốc hiệu).
     Đây là bối cảnh: không phải số liệu thống kê, không đánh giá đúng sai về phía nào; mức kiểm chứng: đã đối chiếu ngày 15/11/2026 với bách khoa trực tuyến (118 khẳng định đại diện, 83 năm độc lập; xem docs/ERA-DOI-CHIEU-NGUON-940.md), nguồn THỨ CẤP, chưa đọc văn bản gốc.
   · NAMES: tên nước dùng thời đó (Miến Điện, Zaire...). CITIES: tên thành phố đổi theo năm (Sài Gòn trước 2/7/1976, Bombay, Leningrad...) thay vào văn bản nhật ký/cảnh/vị trí khi năm thế giới nhỏ hơn mốc đổi tên.
   · Mô tả hiện ở màn thiết lập (E.ERA920.status), ở dòng nhật ký đầu đời và mỗi khi tình trạng đổi trong đời (E.HOOKS.year). Các mốc chính trị được tra độc lập với chuỗi số liệu nhân khẩu. */
(function (G) {
  'use strict';
  var E = G.E, X = E && E.ERA920; if (!X) return;
  var A = 'thuộc địa của ', P = 'lãnh thổ bảo hộ của ';
  // [mã, năm độc lập, bên cai quản] — ghi cho năm thế giới < năm độc lập
  var DEP = [['MA', 1956, 'Pháp và Tây Ban Nha (bảo hộ)'], ['TN', 1956, 'Pháp (bảo hộ)'], ['SD', 1956, 'Anh và Ai Cập đồng quản lý'], ['KH', 1953, A + 'Pháp (Liên hiệp Pháp)'], ['LA', 1953, A + 'Pháp (Liên hiệp Pháp)'],
    ['GH', 1957, A + 'Anh (Bờ Biển Vàng)'], ['GN', 1958, A + 'Pháp'], ['CM', 1960, 'lãnh thổ do Pháp và Anh quản lý (ủy trị/giám hộ Liên Hợp Quốc)'], ['TG', 1960, 'lãnh thổ do Pháp quản lý'], ['MG', 1960, A + 'Pháp'], ['CD', 1960, A + 'Bỉ (Congo thuộc Bỉ)'],
    ['SO', 1960, 'lãnh thổ do Ý (giám hộ) và Anh quản lý'], ['BJ', 1960, A + 'Pháp'], ['NE', 1960, A + 'Pháp'], ['BF', 1960, A + 'Pháp'], ['CI', 1960, A + 'Pháp'], ['TD', 1960, A + 'Pháp'], ['CF', 1960, A + 'Pháp'], ['CG', 1960, A + 'Pháp'], ['GA', 1960, A + 'Pháp'], ['SN', 1960, A + 'Pháp'], ['ML', 1960, A + 'Pháp'], ['MR', 1960, A + 'Pháp'],
    ['NG', 1960, A + 'Anh'], ['CY', 1960, A + 'Anh'], ['SL', 1961, A + 'Anh'], ['KW', 1961, P + 'Anh'], ['TZ', 1961, A + 'Anh (Tanganyika)'], ['RW', 1962, 'lãnh thổ do Bỉ quản lý (giám hộ Liên Hợp Quốc)'], ['BI', 1962, 'lãnh thổ do Bỉ quản lý (giám hộ Liên Hợp Quốc)'], ['UG', 1962, A + 'Anh'], ['DZ', 1962, 'lãnh thổ của Pháp (Algérie thuộc Pháp)'],
    ['JM', 1962, A + 'Anh'], ['TT', 1962, A + 'Anh'], ['WS', 1962, 'lãnh thổ do New Zealand quản lý (giám hộ Liên Hợp Quốc)'], ['KE', 1963, A + 'Anh'], ['MW', 1964, A + 'Anh (Nyasaland)'], ['ZM', 1964, A + 'Anh (Bắc Rhodesia)'], ['MT', 1964, A + 'Anh'], ['GM', 1965, A + 'Anh'], ['MV', 1965, P + 'Anh'],
    ['BW', 1966, P + 'Anh (Bechuanaland)'], ['LS', 1966, P + 'Anh (Basutoland)'], ['BB', 1966, A + 'Anh'], ['GY', 1966, A + 'Anh (Guiana thuộc Anh)'], ['MU', 1968, A + 'Anh'], ['SZ', 1968, P + 'Anh'], ['GQ', 1968, A + 'Tây Ban Nha'], ['NR', 1968, 'lãnh thổ do Úc, New Zealand và Anh quản lý (giám hộ Liên Hợp Quốc)'],
    ['FJ', 1970, A + 'Anh'], ['TO', 1970, P + 'Anh'], ['BH', 1971, P + 'Anh'], ['QA', 1971, P + 'Anh'], ['AE', 1971, P + 'Anh (các tiểu vương quốc Trucial)'], ['BS', 1973, A + 'Anh'], ['GW', 1974, A + 'Bồ Đào Nha'], ['GD', 1974, A + 'Anh'], ['MZ', 1975, A + 'Bồ Đào Nha'], ['AO', 1975, A + 'Bồ Đào Nha'], ['CV', 1975, A + 'Bồ Đào Nha'], ['ST', 1975, A + 'Bồ Đào Nha'],
    ['KM', 1975, A + 'Pháp'], ['PG', 1975, 'lãnh thổ do Úc quản lý'], ['SR', 1975, A + 'Hà Lan'], ['SC', 1976, A + 'Anh'], ['DJ', 1977, A + 'Pháp'], ['DM', 1978, A + 'Anh'], ['SB', 1978, A + 'Anh'], ['TV', 1978, A + 'Anh (quần đảo Ellice)'], ['LC', 1979, A + 'Anh'], ['VC', 1979, A + 'Anh'], ['KI', 1979, A + 'Anh (quần đảo Gilbert)'],
    ['VU', 1980, 'lãnh thổ do Anh và Pháp đồng quản lý (Tân Hebrides)'], ['BZ', 1981, A + 'Anh (Honduras thuộc Anh)'], ['AG', 1981, A + 'Anh'], ['KN', 1983, A + 'Anh'], ['BN', 1984, P + 'Anh'], ['MH', 1986, 'lãnh thổ ủy thác Liên Hợp Quốc do Hoa Kỳ quản lý'], ['FM', 1986, 'lãnh thổ ủy thác Liên Hợp Quốc do Hoa Kỳ quản lý'], ['PW', 1994, 'lãnh thổ ủy thác Liên Hợp Quốc do Hoa Kỳ quản lý']];
  var STATUS = {};
  function add(cc, a, b, t) { (STATUS[cc] = STATUS[cc] || []).push([a, b, t]); }
  DEP.forEach(function (d) { add(d[0], 1950, d[1] - 1, d[2]); });
  var SOV = 'một nước cộng hòa thuộc Liên Xô';
  ['RU', 'UA', 'BY', 'MD', 'LT', 'LV', 'EE', 'AM', 'AZ', 'GE', 'KZ', 'KG', 'TJ', 'TM', 'UZ'].forEach(function (c) { add(c, 1950, 1990, SOV); add(c, 1991, 1991, 'Liên Xô tan rã (cuối năm 1991)'); });
  ['LT', 'LV', 'EE'].forEach(function (c) { STATUS[c] = [[1950, 1989, 'một nước cộng hòa thuộc Liên Xô (bị sáp nhập năm 1940; nhiều nước không công nhận việc sáp nhập)'], [1990, 1990, 'tuyên bố khôi phục độc lập khỏi Liên Xô nhưng Liên Xô chưa công nhận'], [1991, 1991, 'Liên Xô tan rã (cuối năm 1991); độc lập được công nhận từ tháng 8–9/1991']]; });
  ['CZ', 'SK'].forEach(function (c) { add(c, 1950, 1992, 'Tiệp Khắc (tách thành hai nước ngày 1/1/1993)'); });
  ['SI', 'HR', 'MK'].forEach(function (c) { add(c, 1950, 1990, 'một nước cộng hòa thuộc Nam Tư'); add(c, 1991, 1991, 'tuyên bố độc lập khỏi Nam Tư'); });
  add('BA', 1950, 1991, 'một nước cộng hòa thuộc Nam Tư'); add('BA', 1992, 1995, 'độc lập nhưng có chiến tranh (1992–1995)');
  ['RS', 'ME'].forEach(function (c) { add(c, 1950, 1991, 'Nam Tư'); add(c, 1992, 2002, 'Cộng hòa Liên bang Nam Tư (Serbia và Montenegro)'); add(c, 2003, 2005, 'Liên minh quốc gia Serbia và Montenegro'); });
  add('DE', 1950, 1960, 'nước Đức bị chia thành Tây Đức (CHLB Đức) và Đông Đức (CHDC Đức)'); add('DE', 1961, 1988, 'nước Đức chia đôi; Bức tường Berlin được dựng từ 13/8/1961'); add('DE', 1989, 1989, 'Bức tường Berlin sụp đổ ngày 9/11/1989'); add('DE', 1990, 1990, 'tái thống nhất ngày 3/10/1990');
  add('VN', 1950, 1953, 'chiến tranh Đông Dương lần thứ nhất giữa Pháp và Việt Minh'); add('VN', 1954, 1954, 'Hiệp định Genève (7/1954) chia Việt Nam tại vĩ tuyến 17');
  add('VN', 1955, 1974, 'Việt Nam chia hai miền (Việt Nam Dân chủ Cộng hòa ở phía Bắc, Việt Nam Cộng hòa ở phía Nam); chiến tranh Việt Nam'); add('VN', 1975, 1975, 'chiến tranh Việt Nam kết thúc ngày 30/4/1975'); add('VN', 1976, 1976, 'thống nhất cả nước, Cộng hòa Xã hội Chủ nghĩa Việt Nam từ 2/7/1976');
  ['KR', 'KP'].forEach(function (c) { add(c, 1950, 1953, 'chiến tranh Triều Tiên (đình chiến 27/7/1953)'); });
  add('YE', 1950, 1989, 'Yemen chưa thống nhất (Bắc Yemen và Nam Yemen/Aden), thống nhất 22/5/1990');
  add('BD', 1947, 1954, 'Đông Bengal thuộc Pakistan'); add('BD', 1955, 1970, 'Đông Pakistan (thuộc Pakistan)'); add('BD', 1971, 1971, 'chiến tranh giải phóng, độc lập năm 1971');
  add('ER', 1950, 1951, 'dưới sự quản lý của Anh'); add('ER', 1952, 1990, 'thuộc Ethiopia (liên bang 1952, sáp nhập 1962; chiến tranh đòi độc lập 1961–1991)'); add('ER', 1991, 1992, 'tự quản sau chiến tranh; trưng cầu dân ý năm 1993');
  add('SS', 1950, 2010, 'thuộc Sudan (độc lập tháng 7/2011)');
  add('TL', 1975, 1998, 'bị Indonesia chiếm đóng và sáp nhập năm 1976 (Liên Hợp Quốc không công nhận)'); add('TL', 1999, 2001, 'Liên Hợp Quốc quản lý chuyển tiếp; độc lập 20/5/2002');

  add('ZW', 1950, 1964, A + 'Anh tự quản (Nam Rhodesia)'); add('ZW', 1965, 1979, 'Rhodesia do chính quyền thiểu số da trắng đơn phương tuyên bố độc lập (1965), không được quốc tế công nhận');
  add('ZA', 1950, 1993, 'chế độ phân biệt chủng tộc apartheid (1948–1994)');
  add('KH', 1970, 1974, 'Cộng hòa Khmer; nội chiến'); add('KH', 1975, 1978, 'Campuchia Dân chủ dưới chế độ Khmer Đỏ (17/4/1975–7/1/1979)'); add('KH', 1979, 1988, 'Cộng hòa Nhân dân Campuchia; nội chiến tiếp diễn'); add('KH', 1989, 1992, 'Nhà nước Campuchia; Liên Hợp Quốc quản lý chuyển tiếp 1992–1993');
  // bối cảnh chính trị lớn khác (chỉ ghi các giai đoạn đã được ghi nhận rộng rãi; không gán đúng sai; chưa có cơ chế gameplay riêng ngoài hist920.js)
  [['AR', 1976, 1982, 'chế độ độc tài quân sự (24/3/1976–10/12/1983)'], ['CL', 1973, 1989, 'chế độ quân sự của Pinochet (11/9/1973–11/3/1990)'], ['BR', 1964, 1984, 'chế độ quân sự (1/4/1964–15/3/1985)'], ['UY', 1973, 1984, 'chế độ độc tài dân sự–quân sự (1973–1985)'], ['ES', 1950, 1974, 'chế độ độc tài của Franco (đến cuối năm 1975)'], ['PT', 1950, 1973, 'chế độ Estado Novo (đến Cách mạng Hoa cẩm chướng 25/4/1974)'], ['PT', 1974, 1974, 'Cách mạng Hoa cẩm chướng (25/4/1974)'], ['GR', 1967, 1973, 'chế độ quân sự (21/4/1967–24/7/1974)'], ['CY', 1974, 1974, 'đảo chính và Thổ Nhĩ Kỳ đưa quân vào; đảo bị chia cắt'],
    ['IR', 1979, 1979, 'cách mạng Hồi giáo (1979)'], ['IR', 1980, 1988, 'chiến tranh Iran–Iraq (9/1980–8/1988)'], ['IQ', 1980, 1988, 'chiến tranh Iran–Iraq (9/1980–8/1988)'], ['KW', 1990, 1991, 'Iraq xâm chiếm Kuwait (2/8/1990) và chiến tranh Vùng Vịnh'], ['IQ', 1990, 1991, 'chiến tranh Vùng Vịnh sau khi Iraq xâm chiếm Kuwait'], ['IQ', 2003, 2011, 'chiến tranh Iraq và thời kỳ quân đội nước ngoài hiện diện (3/2003–12/2011)'],
    ['AF', 1979, 1989, 'quân đội Liên Xô can thiệp và chiến tranh (12/1979–2/1989)'], ['AF', 1996, 2000, 'phong trào Taliban cầm quyền phần lớn đất nước'], ['AF', 2001, 2020, 'chiến tranh và sự hiện diện quân sự nước ngoài (10/2001–8/2021)'], ['AF', 2021, 2023, 'Taliban trở lại cầm quyền (8/2021)'],
    ['LB', 1975, 1990, 'nội chiến Liban (4/1975–10/1990)'], ['SY', 2011, 2023, 'nội chiến Syria (từ 2011)'], ['LY', 2011, 2011, 'nội chiến và lật đổ chính quyền cũ (2011)'], ['LY', 2014, 2020, 'nội chiến Libya lần thứ hai (2014–2020)'], ['YE', 2014, 2023, 'nội chiến Yemen (từ 2014)'], ['SS', 2011, 2012, 'độc lập khỏi Sudan (9/7/2011)'], ['SS', 2013, 2023, 'nội chiến Nam Sudan (từ 12/2013)'], ['CF', 2012, 2023, 'xung đột vũ trang ở Cộng hòa Trung Phi (từ 12/2012)'], ['ML', 2012, 2023, 'xung đột ở Mali (từ 1/2012)'], ['ET', 2020, 2022, 'xung đột ở Tigray (11/2020–11/2022)'], ['UA', 2014, 2021, 'Nga sáp nhập Crimea (2014) và chiến sự ở vùng Donbas'], ['UA', 2022, 2023, 'Nga tấn công toàn diện (từ 24/2/2022)'],
    ['ET', 1974, 1990, 'chế độ quân sự Derg và nội chiến (1974–1991)'], ['SL', 1991, 2002, 'nội chiến Sierra Leone (1991–2002)'], ['LR', 1989, 2003, 'các cuộc nội chiến ở Liberia (1989–2003)'], ['AO', 1975, 2001, 'nội chiến Angola (1975–2002)'], ['MZ', 1977, 1991, 'nội chiến Mozambique (1977–1992)'], ['DZ', 1991, 2001, 'nội chiến Algeria (thập niên 1990)'], ['CD', 1996, 2002, 'các cuộc chiến tranh Congo (1996–97 và 1998–2003)'],
    ['RW', 1990, 1993, 'nội chiến Rwanda (1990–1993)'], ['RW', 1994, 1994, 'diệt chủng người Tutsi ở Rwanda (4–7/1994)'], ['BI', 1993, 2004, 'nội chiến Burundi (1993–2005)'], ['NG', 1967, 1970, 'nội chiến Nigeria (Biafra, 1967–1970)'], ['SD', 1983, 2004, 'nội chiến Sudan lần thứ hai (1983–2005)'],
    ['LK', 1983, 2008, 'nội chiến Sri Lanka (1983–5/2009)'], ['CO', 1964, 2015, 'xung đột vũ trang nội bộ Colombia (đến thỏa thuận hòa bình 2016)'], ['NP', 1996, 2005, 'nội chiến do phong trào Maoist phát động (1996–2006)'], ['PE', 1980, 1999, 'xung đột nội bộ Peru (1980–2000)'], ['GT', 1960, 1995, 'nội chiến Guatemala (1960–1996)'], ['SV', 1979, 1991, 'nội chiến El Salvador (1979–1992)'], ['NI', 1979, 1989, 'cách mạng Sandinista (1979) và chiến tranh Contra'],
    ['CU', 1991, 1995, 'thời kỳ đặc biệt sau khi Liên Xô tan rã'], ['KP', 1994, 1998, 'nạn đói nghiêm trọng (1994–1998)'], ['ID', 1965, 1966, 'biến động chính trị và bạo lực hàng loạt (1965–1966)'], ['ID', 1998, 1998, 'khủng hoảng và Suharto từ chức (21/5/1998)'], ['CN', 1959, 1961, 'nạn đói lớn sau phong trào Đại nhảy vọt'], ['CN', 1966, 1976, 'Cách mạng Văn hóa (1966–1976)'], ['CN', 1980, 2015, 'chính sách kế hoạch hóa gia đình "một con" (1980–2015)'],
    ['IN', 1975, 1976, 'tình trạng khẩn cấp (6/1975–3/1977)'], ['PK', 1971, 1971, 'chiến tranh với Ấn Độ và Đông Pakistan ly khai'], ['MM', 1962, 1987, 'chế độ quân sự của Ne Win (từ 3/1962)'], ['MM', 1988, 1988, 'cuộc nổi dậy 8/1988 và quân đội nắm quyền'], ['MM', 2021, 2023, 'quân đội đảo chính (1/2/2021) và xung đột sau đó'], ['LA', 1960, 1974, 'nội chiến Lào (1959–1975)'], ['LA', 1975, 1975, 'Cộng hòa Dân chủ Nhân dân Lào ra đời (12/1975)'],
    ['HU', 1956, 1956, 'cách mạng Hungary (10–11/1956)'], ['RO', 1989, 1989, 'cách mạng Romania (12/1989)'], ['KR', 1961, 1986, 'các chính quyền độc tài quân sự (1961–1987)'], ['KR', 1987, 1987, 'dân chủ hóa sau phong trào tháng 6/1987'], ['PH', 1972, 1980, 'thiết quân luật dưới thời Marcos (9/1972–1/1981)'], ['PH', 1986, 1986, 'cách mạng Quyền lực Nhân dân (2/1986)']]
    .forEach(function (x) { add(x[0], x[1], x[2], x[3]); });
  // Gắn nhãn theo năm. Các mốc trước và sau chuỗi nhân khẩu có cùng cách tra cứu.
  [['IN', 1900, 1946, 'Ấn Độ thuộc Anh; quy chế khác nhau giữa các tỉnh và phiên quốc'],
    ['PK', 1900, 1946, 'khu vực thuộc Ấn Độ thời Anh cai trị; Pakistan chưa thành lập'],
    ['BD', 1900, 1946, 'khu vực Bengal thuộc Ấn Độ thời Anh cai trị'],
    ['IN', 1947, 1947, 'Ấn Độ độc lập và tiểu lục địa bị chia cắt'],
    ['PK', 1947, 1947, 'Pakistan thành lập khi Ấn Độ thuộc Anh chia tách'],
    ['BZ', 1900, 1949, A + 'Anh (Honduras thuộc Anh)'],
    ['GH', 1900, 1949, 'Bờ Biển Vàng dưới quyền Anh; quy chế và ranh giới thay đổi theo vùng'],
    ['KR', 1910, 1945, 'bán đảo Triều Tiên dưới quyền cai trị của Nhật Bản'],
    ['KP', 1910, 1945, 'bán đảo Triều Tiên dưới quyền cai trị của Nhật Bản'],
    ['SS', 1900, 1949, 'miền nam Sudan trong thời kỳ Anh và Ai Cập đồng quản lý'],
    ['DE', 1945, 1948, 'Đức được chia thành các vùng chiếm đóng của Đồng Minh sau chiến tranh'],
    ['DE', 1949, 1949, 'thành lập Cộng hòa Liên bang Đức và Cộng hòa Dân chủ Đức'],
    ['UA', 2024, 2025, 'cuộc chiến sau khi Nga tấn công toàn diện tiếp diễn; nguy cơ thay đổi theo vùng'],
    ['SD', 2023, 2025, 'xung đột vũ trang từ tháng 4/2023 và khủng hoảng di dời'],
    ['MM', 2024, 2025, 'xung đột sau đảo chính tiếp diễn; mức ảnh hưởng khác nhau giữa các vùng'],
    ['PS', 2023, 2025, 'chiến tranh tại Dải Gaza; Bờ Tây chịu bạo lực và hạn chế đi lại theo bối cảnh riêng'],
    ['AF', 2024, 2025, 'Taliban tiếp tục nắm quyền trên thực tế'],
    ['SY', 2024, 2024, 'chiến sự kéo dài; chính quyền Bashar al-Assad sụp đổ vào tháng 12'],
    ['SY', 2025, 2025, 'giai đoạn chuyển tiếp chính trị sau thay đổi chính quyền tháng 12/2024']
  ].forEach(function (x) { add(x[0], x[1], x[2], x[3]); });
  ['RU', 'AM', 'AZ', 'GE'].forEach(function (cc) { add(cc, 1922, 1949, 'thuộc Liên Xô từ khi liên bang thành lập cuối năm 1922; quyền kiểm soát thay đổi ở các vùng chiến sự'); });
  ['UA', 'BY'].forEach(function (cc) { add(cc, 1922, 1949, 'các nước cộng hòa Xô viết tại đây tham gia lập Liên Xô năm 1922; biên giới thời đó khác biên giới hiện nay'); });
  // tên nước dùng thời đó: [mã, từ, đến, tên]
  var NAMES = [['MM', 1950, 1988, 'Miến Điện (Burma)'], ['LK', 1950, 1971, 'Ceylon'], ['CD', 1971, 1996, 'Zaire'], ['BJ', 1960, 1974, 'Dahomey'], ['BF', 1960, 1983, 'Thượng Volta'], ['SZ', 1950, 2017, 'Swaziland'], ['MK', 1991, 2018, 'Macedonia'], ['WS', 1950, 1996, 'Tây Samoa'], ['ZW', 1950, 1979, 'Rhodesia'], ['BZ', 1950, 1972, 'Honduras thuộc Anh'], ['GY', 1950, 1965, 'Guiana thuộc Anh'], ['TV', 1950, 1974, 'quần đảo Ellice'], ['KI', 1950, 1978, 'quần đảo Gilbert'], ['VU', 1950, 1979, 'Tân Hebrides'], ['DJ', 1967, 1976, 'Lãnh thổ người Afar và Issa'], ['KH', 1970, 1974, 'Cộng hòa Khmer'], ['KH', 1975, 1978, 'Campuchia Dân chủ'], ['KH', 1979, 1988, 'Cộng hòa Nhân dân Campuchia']];
  NAMES.push(['IN', 1900, 1946, 'Ấn Độ thuộc Anh'], ['PK', 1900, 1946, 'Ấn Độ thuộc Anh'],
    ['BD', 1900, 1946, 'Bengal, Ấn Độ thuộc Anh'], ['BD', 1947, 1954, 'Đông Bengal, Pakistan'],
    ['BD', 1955, 1970, 'Đông Pakistan'], ['BZ', 1900, 1949, 'Honduras thuộc Anh'],
    ['GH', 1900, 1956, 'Bờ Biển Vàng'], ['SS', 1900, 1955, 'miền nam Sudan thuộc Anh–Ai Cập'],
    ['SS', 1956, 2010, 'miền nam Sudan']);
  // tên thành phố: [tên hiện nay, tên thời đó, năm cuối còn dùng tên cũ, (tùy chọn) năm đầu]
  var CITIES = [['TP. Hồ Chí Minh', 'Sài Gòn', 1975], ['Mumbai', 'Bombay', 1994], ['Chennai', 'Madras', 1995], ['Kolkata', 'Calcutta', 2000], ['Bengaluru', 'Bangalore', 2013], ['Yangon', 'Rangoon', 1988], ['Saint Petersburg', 'Leningrad', 1990, 1924], ['Saint Petersburg', 'Petrograd', 1923, 1914], ['Volgograd', 'Stalingrad', 1960, 1925], ['Volgograd', 'Tsaritsyn', 1924, 1900], ['Almaty', 'Alma-Ata', 1992, 1921], ['Almaty', 'Verny', 1920, 1900], ['Astana', 'Akmola', 1997, 1992], ['Astana', 'Tselinograd', 1991, 1961], ['Astana', 'Akmolinsk', 1960, 1900], ['Bishkek', 'Frunze', 1990, 1926], ['Bishkek', 'Pishpek', 1925, 1900], ['Dushanbe', 'Stalinabad', 1960, 1929], ['Dushanbe', 'Dyushambe', 1928, 1900], ['Kinshasa', 'Léopoldville', 1965], ['Lubumbashi', 'Élisabethville', 1965], ['Harare', 'Salisbury', 1981], ['Mutare', 'Umtali', 1981], ['Gweru', 'Gwelo', 1981], ['Maputo', 'Lourenço Marques', 1975], ['Huambo', 'Nova Lisboa', 1974, 1928], ['Faisalabad', 'Lyallpur', 1976], ['Gqeberha', 'Port Elizabeth', 2020], ['Dnipro', 'Katerynoslav', 1925], ['Dnipro', 'Dnipropetrovsk', 2015, 1926], ['Polokwane', 'Pietersburg', 2001], ['Kota Kinabalu', 'Jesselton', 1967], ['Shah Alam', 'khu vực Batu Tiga', 1962]];
  function resCC(l) { return l ? E.H.resCode(l) : null; }
  // [năm đầu, năm cuối, hình thức cai quản, bên quản lý, mô tả]. Các mốc chuyển giao trong năm có ghi tháng.
  var AUTHORITY = {
    PH: [
      [1900, 1934, 'colony', 'Mỹ', 'Philippines dưới quyền cai trị của Mỹ'],
      [1935, 1940, 'commonwealth', 'Mỹ', 'Thịnh vượng chung Philippines tự trị dưới chủ quyền Mỹ'],
      [1941, 1941, 'commonwealth', 'Mỹ', 'Thịnh vượng chung Philippines dưới chủ quyền Mỹ; Nhật Bản mở cuộc tấn công vào tháng 12/1941'],
      [1942, 1942, 'occupation', 'Nhật Bản', 'Nhật Bản chiếm Manila từ tháng 1/1942; chính phủ Thịnh vượng chung Philippines tiếp tục hoạt động lưu vong'],
      [1943, 1943, 'occupation', 'Nhật Bản', 'Philippines dưới quyền chiếm đóng của Nhật Bản; nền Đệ nhị Cộng hòa do Nhật bảo trợ ra đời tháng 10/1943'],
      [1944, 1944, 'occupation', 'Nhật Bản', 'Nhật Bản còn chiếm phần lớn Philippines; quân Đồng Minh đổ bộ lên Leyte vào tháng 10/1944'],
      [1945, 1945, 'transition', 'Mỹ', 'Đồng Minh giành lại Manila đầu năm 1945 và chính phủ Thịnh vượng chung Philippines trở lại; chiến sự tiếp tục ở nhiều nơi'],
      [1946, 2025, 'independent', null, 'Philippines độc lập từ ngày 4/7/1946']
    ],
    TL: [
      [1900, 1941, 'colony', 'Bồ Đào Nha', 'Đông Timor là thuộc địa Bồ Đào Nha'],
      [1942, 1942, 'occupation', 'Nhật Bản', 'Quân Nhật đổ bộ lên Dili tháng 2/1942 và kiểm soát Đông Timor trong thời chiến'],
      [1943, 1944, 'occupation', 'Nhật Bản', 'Đông Timor dưới quyền chiếm đóng của Nhật Bản; Bồ Đào Nha vẫn tuyên bố chủ quyền thuộc địa'],
      [1945, 1945, 'transition', 'Bồ Đào Nha', 'Nhật Bản chiếm đóng Đông Timor đến khi đầu hàng năm 1945; Bồ Đào Nha trở lại quản lý'],
      [1946, 1974, 'colony', 'Bồ Đào Nha', 'Đông Timor dưới quyền quản lý của Bồ Đào Nha']
    ],
    MY: [
      [1900, 1940, 'regional', null, 'Bán đảo Malaya, Vương quốc Sarawak và Bắc Borneo có các chính quyền riêng dưới ảnh hưởng của Anh'],
      [1941, 1941, 'transition', null, 'Quân Nhật mở cuộc tấn công vào bán đảo Malaya và Borneo tháng 12/1941'],
      [1942, 1944, 'occupation', 'Nhật Bản', 'Nhật Bản chiếm đóng Malaya, Sarawak và Bắc Borneo'],
      [1945, 1945, 'transition', 'Anh', 'Nhật đầu hàng năm 1945; quân quản Anh tiếp quản Malaya, Sarawak và Bắc Borneo'],
      [1946, 1956, 'regional', null, 'Malaya, Sarawak và Bắc Borneo nằm dưới quyền Anh qua các chính quyền riêng'],
      [1957, 1962, 'regional', null, 'Liên bang Malaya độc lập từ 31/8/1957; Sarawak và Bắc Borneo vẫn do Anh quản lý'],
      [1963, 2025, 'federation', null, 'Liên bang Malaysia thành lập ngày 16/9/1963 với Malaya, Sarawak, Sabah và Singapore; Singapore tách ra năm 1965']
    ],
    SG: [
      [1900, 1941, 'colony', 'Anh', 'Singapore thuộc Các khu định cư Eo biển của Anh'],
      [1942, 1942, 'occupation', 'Nhật Bản', 'Nhật Bản chiếm Singapore từ tháng 2/1942'],
      [1943, 1944, 'occupation', 'Nhật Bản', 'Singapore nằm dưới quyền chiếm đóng của Nhật Bản'],
      [1945, 1945, 'transition', 'Anh', 'Nhật Bản chiếm đóng đến tháng 9/1945; quân quản Anh tiếp quản sau khi Nhật đầu hàng'],
      [1946, 1958, 'colony', 'Anh', 'Singapore là thuộc địa riêng của Anh'],
      [1959, 1962, 'selfGovernment', 'Anh', 'Singapore tự trị nội bộ; Anh vẫn phụ trách quốc phòng và đối ngoại'],
      [1963, 1964, 'federation', null, 'Singapore là một bang của Liên bang Malaysia từ tháng 9/1963'],
      [1965, 2025, 'independent', null, 'Singapore độc lập từ ngày 9/8/1965']
    ],
    NA: [
      [1900, 1914, 'protectorate', 'Đức', 'Tây Nam Phi thuộc Đức'],
      [1915, 1919, 'occupation', 'Nam Phi', 'Nam Phi chiếm Tây Nam Phi từ năm 1915 và lập quân quản'],
      [1920, 1965, 'mandate', 'Nam Phi', 'Nam Phi cai quản Tây Nam Phi theo ủy trị của Hội Quốc Liên từ cuối năm 1920'],
      [1966, 1988, 'occupation', 'Nam Phi', 'Liên Hợp Quốc chấm dứt ủy trị năm 1966; Nam Phi vẫn duy trì quyền kiểm soát'],
      [1989, 1989, 'transition', 'Nam Phi', 'Namibia chuyển tiếp sang độc lập dưới sự giám sát của Liên Hợp Quốc'],
      [1990, 2025, 'independent', null, 'Namibia độc lập từ ngày 21/3/1990']
    ],
    SO: [
      [1960, 1960, 'independent', null, 'Somalia thành lập ngày 1/7/1960 khi hai vùng vừa giành độc lập hợp nhất'],
      [1991, 2003, 'fragmented', null, 'Chính quyền trung ương sụp đổ năm 1991; quyền kiểm soát phân tán giữa các vùng'],
      [2004, 2011, 'transition', null, 'Chính phủ Liên bang Chuyển tiếp Somalia được thành lập; quyền kiểm soát còn hạn chế'],
      [2012, 2025, 'federal', null, 'Chính phủ Liên bang Somalia thành lập năm 2012; quyền kiểm soát và an ninh khác nhau theo vùng']
    ],
    LY: [
      [1900, 1910, 'province', 'Đế quốc Ottoman', 'Các vùng của Libya ngày nay thuộc Đế quốc Ottoman'],
      [1911, 1911, 'transition', 'Đế quốc Ottoman và Ý', 'Ý mở cuộc chiến với Đế quốc Ottoman và đổ bộ vào Libya cuối năm 1911'],
      [1912, 1942, 'colony', 'Ý', 'Libya dưới quyền cai trị của Ý; quyền kiểm soát thay đổi theo vùng và thời điểm'],
      [1943, 1950, 'occupation', 'Anh và Pháp', 'Anh quân quản Tripolitania và Cyrenaica, Pháp quân quản Fezzan'],
      [1951, 1951, 'independent', null, 'Libya độc lập từ ngày 24/12/1951']
    ]
  };
  var MALAYA = [
    [1900, 1940, 'protectorate', 'Anh', 'Các bang và khu định cư trên bán đảo Malaya dưới quyền hoặc bảo hộ của Anh'],
    [1946, 1947, 'colony', 'Anh', 'Liên hiệp Malaya dưới quyền Anh từ tháng 4/1946'],
    [1948, 1956, 'federation', 'Anh', 'Liên bang Malaya dưới quyền Anh từ tháng 2/1948'],
    [1957, 1962, 'independent', null, 'Liên bang Malaya độc lập từ ngày 31/8/1957']
  ];
  var BORNEO = {
    sarawak: [
      [1900, 1940, 'protectorate', 'Anh', 'Vương quốc Sarawak do nhà Brooke cai trị dưới sự bảo hộ của Anh'],
      [1946, 1962, 'colony', 'Anh', 'Sarawak trở thành thuộc địa của Anh vào tháng 7/1946'],
      [1963, 2025, 'federation', null, 'Sarawak gia nhập Liên bang Malaysia ngày 16/9/1963']
    ],
    sabah: [
      [1900, 1940, 'protectorate', 'Anh', 'Bắc Borneo do Công ty Bắc Borneo cai quản dưới sự bảo hộ của Anh'],
      [1946, 1962, 'colony', 'Anh', 'Bắc Borneo trở thành thuộc địa của Anh vào tháng 7/1946'],
      [1963, 2025, 'federation', null, 'Bắc Borneo gia nhập Liên bang Malaysia với tên Sabah ngày 16/9/1963']
    ]
  };
  var GERMAN_ZONES = {
    Hamburg: 'Anh', Cologne: 'Anh', Düsseldorf: 'Anh',
    Munich: 'Mỹ', Frankfurt: 'Mỹ', Stuttgart: 'Mỹ', Leipzig: 'Liên Xô', Dresden: 'Liên Xô'
  };
  var GERMAN_STATES = {
    Berlin: 'Berlin', Hamburg: 'Hamburg', Cologne: 'Bắc Rhine–Westphalia', Düsseldorf: 'Bắc Rhine–Westphalia',
    Munich: 'Bayern', Frankfurt: 'Hessen', Stuttgart: 'Baden-Württemberg', Leipzig: 'Sachsen', Dresden: 'Sachsen'
  };
  var MALAYAN_STATES = { 'Johor Bahru': 'Johor', 'George Town': 'Penang', Ipoh: 'Perak', Malacca: 'Malacca', 'Shah Alam': 'Selangor' };
  function authority(from, kind, ruler, text) { return { from: from, kind: kind, ruler: ruler, text: text }; }
  function datedAuthority(rows, y) {
    var row = rows?.find(function (r) { return y >= r[0] && y <= r[1]; });
    return row ? authority(row[0], row[2], row[3], row[4]) : null;
  }
  function malaysiaRegion(y, city) {
    var area = city === 'Kuching' ? 'sarawak' : city === 'Kota Kinabalu' ? 'sabah' : 'malaya';
    if (area === 'malaya' && !G.W.BY.MY.cities.includes(city)) return null;
    var label = area === 'sarawak' ? 'Sarawak' : area === 'sabah' ? (y < 1963 ? 'Bắc Borneo' : 'Sabah') :
      y >= 1963 ? 'Malaysia bán đảo' : y >= 1948 ? 'Liên bang Malaya' : y >= 1946 ? 'Liên hiệp Malaya' : 'Malaya';
    if (area === 'malaya' && y >= 1963) label = city === 'Kuala Lumpur' ? (y >= 1974 ? 'Lãnh thổ Liên bang Kuala Lumpur' : 'Selangor') : MALAYAN_STATES[city];
    return { area: area, label: label, authority: datedAuthority(BORNEO[area] || MALAYA, y) };
  }
  function germanyRegion(y, city) {
    var berlin = city === 'Berlin' || city === 'Đông Berlin' || city === 'Tây Berlin';
    var eastBerlin = city === 'Đông Berlin', westBerlin = city === 'Tây Berlin';
    var zone = GERMAN_ZONES[city], east = eastBerlin || zone === 'Liên Xô';
    var area = east ? 'east' : city === 'Berlin' ? 'berlin' : 'west';
    if (y < 1945 || (!berlin && !G.W.BY.DE.cities.includes(city))) return null;
    if (y >= 1990) return { area: 'unified', label: berlin ? 'Đức' : GERMAN_STATES[city] + ', Đức' };
    if (city === 'Berlin') return { area: area, label: 'bốn khu vực quân quản', authority: authority(1945, 'divided', null,
      'Berlin chia thành bốn khu vực của Liên Xô, Mỹ, Anh và Pháp; quy định sinh sống tùy phía thành phố') };
    if (y < 1949) {
      var power = eastBerlin ? 'Liên Xô' : westBerlin ? 'Mỹ, Anh và Pháp' : zone;
      return { area: area, label: (berlin ? 'khu vực ' : 'vùng quân quản ') + power,
        authority: authority(1945, 'occupation', power, (berlin ? city + ' nằm trong các khu vực do ' : 'Sau chiến tranh, nơi này nằm trong vùng quân quản do ') + power + ' quản lý') };
    }
    var label = east ? (eastBerlin ? 'khu vực Liên Xô tại Berlin' : 'Đông Đức') : (westBerlin ? 'khu vực Mỹ, Anh và Pháp tại Berlin' : 'Tây Đức');
    var text = eastBerlin ? 'Đông Berlin là nơi đặt chính quyền và được Đông Đức coi là thủ đô; địa vị của Berlin vẫn thuộc quy chế bốn cường quốc' :
      westBerlin ? 'Tây Berlin do Mỹ, Anh và Pháp quản lý theo quy chế riêng và gắn bó với Tây Đức' :
      east ? 'Nơi này thuộc Cộng hòa Dân chủ Đức (Đông Đức)' : 'Nơi này thuộc Cộng hòa Liên bang Đức (Tây Đức)';
    var from = 1949, restricted = east && y >= 1961 && y < 1989;
    if (y >= 1952 && y < 1961) { from = 1952; text += '; biên giới liên Đức bị siết từ năm 1952, lối qua giữa hai phía Berlin còn mở'; }
    if (y >= 1961 && y < 1989) { from = 1961; text += '; Bức tường Berlin được dựng từ 13/8/1961'; }
    if (y === 1989) { from = 1989; text += '; các cửa khẩu ở Bức tường Berlin mở từ 9/11/1989'; }
    return { area: area, label: label, restrict: restricted ? 3 : 0,
      authority: authority(from, berlin ? 'specialStatus' : 'independent', null, text) };
  }
  function regionAt(cc, y, city) {
    if (!city || y < 1900) return null;
    city = X.POL.canonicalCity(city);
    if (cc === 'MY') return malaysiaRegion(y, city);
    if (cc === 'DE') return germanyRegion(y, city);
    return null;
  }
  function authorityAt(cc, y, city) {
    return regionAt(cc, y, city)?.authority || datedAuthority(AUTHORITY[cc], y);
  }
  function status(cc, y, city) {
    var authority = authorityAt(cc, y, city);
    if (authority) return authority.text;
    var s = STATUS[cc] || [];
    for (var i = 0; i < s.length; i++) if (y >= s[i][0] && y <= s[i][1]) return s[i][2];
    if (y >= 1900 && y < 1950) {
      var colony = (G.CTX945_DATA?.COLONY || []).find(function (r) { return r[0] === cc && y >= r[1] && y <= r[2] && r[3] !== 'không thuộc địa'; });
      if (colony) return 'khu vực dưới quyền quản lý của ' + colony[3];
    }
    return null;
  }
  function nameAt(cc, y) { for (var i = 0; i < NAMES.length; i++) if (NAMES[i][0] === cc && y >= NAMES[i][1] && y <= NAMES[i][2]) return NAMES[i][3]; return null; }
  function wy(l) { return l && l.birthYear != null ? l.birthYear + (l.age || 0) : 9999; }
  // thay tên thành phố hiện nay bằng tên thời đó (nhận diện ranh giới từ, không dùng lookbehind để chạy được trên Safari cũ)
  var LET = 'A-Za-zÀ-ỹ', CITY_MAX = CITIES.reduce(function (m, c) { return Math.max(m, c[2]); }, 2021), reCache = {};
  function cityRe(name) { return reCache[name] || (reCache[name] = new RegExp('(^|[^' + LET + '])' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![' + LET + '])', 'g')); }
  function rename(l, s) {
    var y = wy(l); if (typeof s !== 'string' || y > CITY_MAX || !s) return s;
    for (var i = 0; i < CITIES.length; i++) {
      var c = CITIES[i]; if (y > c[2] || (c[3] != null && y < c[3]) || s.indexOf(c[0]) < 0) continue;
      s = s.replace(cityRe(c[0]), function (m, p) { return p + c[1]; });
    }
    if (y >= 2019 && y <= 2021 && s.indexOf('Astana') >= 0) s = s.replace(cityRe('Astana'), function (m, p) { return p + 'Nur-Sultan'; });
    return s;
  }
  // Tên hiển thị có thể đã lưu theo thời kỳ; bảng vùng vẫn dùng định danh địa lý hiện có.
  function canonicalCity(s) {
    if(typeof s!=='string')return s;
    CITIES.concat([['Astana','Nur-Sultan']]).forEach(function(c){s=s.replace(cityRe(c[1]),function(m,p){return p+c[0];});});
    return s;
  }
  function note(l) { var cc = resCC(l), y = wy(l); return cc ? status(cc, y, X.POL.residentCity?.(l)) : null; }
  var famLogic0 = E.famLogic;
  E.famLogic = function (l, t, isLog) { var u = famLogic0 ? famLogic0.call(this, l, t, isLog) : t; return u == null ? u : rename(l, u); };
  function datedPlace(l, s) {
    var label = regionAt(l.country, wy(l), l.city)?.label || nameAt(l.country, wy(l)), suffix = ', ' + l.countryName;
    var P = X.POL, city = P.canonicalCity(l.city);
    s = P.canonicalCity(s);
    var local = city && P.cityLabel?.(l.country, wy(l), city);
    if (local && local !== city && typeof s === 'string') {
      s = s.replace(cityRe(city), function (m, prefix) { return prefix + local; });
    }
    s = P.rename(l, s);
    return label && s.endsWith(suffix) ? s.slice(0, -suffix.length) + ', ' + label : s;
  }
  function birthText(l) {
    var P = X.POL, city = l.birthCity;
    if (!city && (l.country === 'DE' || l.country === 'MY')) {
      var name = P.canonicalCity(l.birthPlace?.split(',')[0].replace(/^vùng nông thôn gần /, ''));
      if (name === 'Berlin' && l.country === 'DE' || P.cities?.(l.country, l.birthYear).includes(name)) city = name;
    }
    var birth = { country: l.country, countryName: l.countryName, birthYear: l.birthYear, age: 0, city: city };
    return datedPlace(birth, l.birthPlace);
  }
  var placeText0 = E.placeText;
  if (typeof placeText0 === 'function') E.placeText = function (l) {
    var cc = resCC(l), label = nameAt(cc, wy(l));
    if (l.abroad && l.abroad.code === cc) {
      var city = X.POL.residentCity ? X.POL.residentCity(l) : l.city || l.place;
      var country = regionAt(cc, wy(l), city)?.label || label || l.abroad.name || G.W.BY[cc]?.name || cc;
      return city ? (X.POL.cityLabel ? X.POL.cityLabel(cc, wy(l), city) : rename(l, city)) + ', ' + country : country;
    }
    return datedPlace(l, placeText0.apply(this, arguments));
  };
  // đời có số liệu theo năm: ghi bối cảnh chính trị lúc sinh và mỗi khi tình trạng đổi
  E.HOOKS.year.push(function (l, r, log) {
    var y = wy(l);
    if (!l.alive || y < 1900 || y > 2025) return;
    var cc = resCC(l), city = X.POL.residentCity?.(l), s = status(cc, y, city), m = l.era920 || l.flags.eraPolitical979;
    if (!m && !s) return;
    if (!m) m = l.flags.eraPolitical979 = {};
    var prev = m.polCC && m.polCC !== cc ? undefined : m.pol;
    if (prev === s && m.polCC === cc) return; m.polCC=cc; m.pol = s || null;
    if (!s && prev === undefined) return;
    var nm = regionAt(cc, y, city)?.label || nameAt(cc, y);
    if (s) log((prev === undefined ? 'Bối cảnh năm ' + y + ': ' : 'Năm ' + y + ', bối cảnh nơi bạn sống đổi: ') + (nm ? nm + ' — ' : '') + s + '.', 'info');
    else if (prev) log('Năm ' + y + ': ' + (nameAt(cc, y - 1) ? nameAt(cc, y - 1) + ' không còn dùng tên cũ. ' : '') + 'Tình trạng chính trị nơi bạn sống đã khác trước.', 'info');
  });
  X.POL = { canonicalCity: canonicalCity, birthText: birthText, STATUS: STATUS, NAMES: NAMES, CITIES: CITIES, status: status, authorityAt: authorityAt, regionAt: regionAt, nameAt: nameAt, rename: rename, note: note };
})(globalThis.G);
