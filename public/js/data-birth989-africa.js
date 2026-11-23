/* Một Đời — 9.8.9 bổ sung sự kiện 1900–2025 và bối cảnh theo thành phố: châu Phi, Trung Đông còn thiếu, châu Đại Dương.
   Nước lớn nhiều mốc, nước nhỏ ít mốc. Nguồn thứ cấp, đối chiếu 23/11/2026. */
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

  ev('NG', [[1914, 'Anh hợp nhất miền Bắc và miền Nam thành Nigeria'], [1929, 'cuộc nổi dậy của phụ nữ Aba'], [1960, 'Nigeria độc lập', 2, 'joy'], [1966, 'hai cuộc đảo chính, thảm sát người Igbo ở miền bắc', 2, 'grief'], [1967, 'Biafra ly khai, nội chiến', 2, 'grief'], [1970, 'nội chiến kết thúc'],
    [1975, 'đảo chính lật đổ Gowon'], [1979, 'nền Đệ nhị Cộng hòa'], [1983, 'đảo chính của Buhari'], [1993, 'hủy kết quả bầu cử 12/6'], [1995, 'nhà văn Ken Saro-Wiwa bị xử tử'], [1999, 'trở lại chính quyền dân sự', 2], [2009, 'Boko Haram nổi dậy', 2, 'grief'], [2014, 'Boko Haram bắt cóc nữ sinh Chibok; dịch Ebola được chặn', 2, 'grief'],
    [2015, 'Buhari thắng cử, lần đầu phe đối lập thay chính quyền'], [2020, 'biểu tình #EndSARS'], [2023, 'Bola Tinubu làm tổng thống; bỏ trợ giá xăng']]);
  reg('NG', [[['Maiduguri'], 2009, 2025, 'vùng Boko Haram', 'Đánh bom chợ, bắt cóc, trại người tản cư quanh thành phố'], [['Port Harcourt'], 1990, 2025, 'đồng bằng dầu mỏ Niger', 'Giếng dầu, ống dẫn bị khoan trộm, sông ngòi ô nhiễm, bắt cóc công nhân dầu'],
    [['Enugu'], 1967, 1970, 'Biafra', 'Vùng ly khai bị phong tỏa, nạn đói nặng nề'], [['Lagos'], 1970, 2025, 'siêu đô thị', 'Kẹt xe triền miên, chợ Balogun, Nollywood, khu ổ chuột ven đầm phá']]);
  rev('NG', [[2014, ['Lagos'], 'chặn đứng dịch Ebola ở thành phố', 1, ''], [2020, ['Lagos'], 'nổ súng vào người biểu tình ở trạm thu phí Lekki', 2, 'grief'], [2010, ['Jos'], 'xung đột sắc tộc – tôn giáo', 2, 'grief'], [2012, ['Kano'], 'đánh bom phối hợp của Boko Haram', 2, 'grief']]);

  ev('ET', [[1913, 'Hoàng đế Menelik II qua đời'], [1930, 'Haile Selassie đăng quang'], [1936, 'Ý chiếm Addis Ababa', 2, 'grief'], [1941, 'giải phóng khỏi Ý'], [1960, 'đảo chính hụt'], [1974, 'Derg lật đổ Hoàng đế', 2], [1977, 'chiến tranh Ogaden; Khủng bố Đỏ', 2, 'grief'],
    [1984, 'nạn đói lớn', 2, 'grief'], [1991, 'Derg sụp đổ', 2], [1993, 'Eritrea tách ra'], [1998, 'chiến tranh với Eritrea', 2, 'grief'], [2005, 'bạo lực sau bầu cử'], [2011, 'khởi công đập Đại Phục hưng'], [2018, 'Abiy Ahmed làm thủ tướng, hòa giải với Eritrea'],
    [2019, 'Abiy nhận giải Nobel Hòa bình'], [2020, 'chiến tranh Tigray', 2, 'grief'], [2022, 'hiệp định Pretoria'], [2025, 'khánh thành đập Đại Phục hưng']]);
  reg('ET', [[['Mekelle'], 2020, 2022, 'Tigray bị phong tỏa', 'Mất điện, mất mạng, ngân hàng đóng, thiếu lương thực và thuốc']]);
  rev('ET', [[1984, ['Mekelle', 'Gondar'], 'nạn đói ở miền bắc', 2, 'grief']]);

  ev('EG', [[1906, 'sự kiện Denshawai'], [1919, 'cách mạng chống Anh'], [1922, 'Anh công nhận độc lập'], [1928, 'Huynh đệ Hồi giáo thành lập'], [1942, 'trận El Alamein'], [1952, 'cách mạng của Sĩ quan Tự do', 2], [1956, 'quốc hữu hóa kênh Suez', 2], [1967, 'thua Chiến tranh Sáu ngày', 2, 'grief'],
    [1970, 'Nasser qua đời; đập Aswan hoàn thành', 1, 'grief'], [1973, 'chiến tranh tháng Mười'], [1977, 'bạo loạn bánh mì'], [1979, 'hòa ước với Israel'], [1981, 'Tổng thống Sadat bị ám sát', 2, 'grief'], [1992, 'động đất Cairo'], [1997, 'thảm sát du khách ở Luxor', 1, 'grief'],
    [2011, 'cách mạng 25/1, Mubarak từ chức', 2], [2012, 'Mohamed Morsi đắc cử'], [2013, 'quân đội lật đổ Morsi; giải tán người biểu tình ở Rabaa', 2, 'grief'], [2014, 'Sisi làm tổng thống'], [2016, 'thả nổi đồng bảng'], [2021, 'tàu Ever Given mắc kẹt ở kênh Suez'], [2025, 'khánh thành Đại Bảo tàng Ai Cập']]);
  rev('EG', [[2011, ['Cairo'], 'biểu tình ở quảng trường Tahrir', 2, ''], [2012, ['Port Said'], 'thảm họa sân vận động', 1, 'grief'], [1997, ['Luxor'], 'thảm sát du khách', 2, 'grief']]);

  ev('ZA', [[1902, 'chiến tranh Boer kết thúc'], [1910, 'Liên bang Nam Phi'], [1913, 'luật Đất đai Người bản xứ'], [1948, 'Đảng Quốc gia thực thi apartheid', 2, 'grief'], [1960, 'thảm sát Sharpeville', 2, 'grief'], [1964, 'Nelson Mandela bị tù chung thân'], [1976, 'khởi nghĩa học sinh Soweto', 2, 'grief'],
    [1990, 'Mandela ra tù', 2, 'joy'], [1994, 'bầu cử đa sắc tộc, Mandela làm tổng thống', 2, 'joy'], [1995, 'vô địch World Cup bóng bầu dục'], [1996, 'Ủy ban Sự thật và Hòa giải'], [2008, 'bạo lực bài ngoại'], [2010, 'đăng cai World Cup', 1, 'joy'],
    [2012, 'thảm sát thợ mỏ Marikana', 1, 'grief'], [2013, 'Mandela qua đời', 1, 'grief'], [2018, 'Cyril Ramaphosa làm tổng thống'], [2021, 'bạo loạn tháng Bảy'], [2023, 'cắt điện luân phiên kỷ lục'], [2024, 'chính phủ đoàn kết quốc gia'], [2025, 'đăng cai hội nghị G20']]);
  reg('ZA', [[['Soweto'], 1963, 1993, 'khu định cư da đen', 'Người da đen bị dồn vào đây, phải mang thẻ thông hành để vào thành phố làm việc'], [['Cape Town'], 1966, 1982, 'xóa khu District Six', 'Hàng chục nghìn người da màu bị cưỡng chế dời ra Cape Flats'],
    [['Johannesburg', 'Pretoria', 'Durban', 'Cape Town'], 1950, 1990, 'đô thị apartheid', 'Bãi biển, xe buýt, trường học, khu ở tách riêng theo chủng tộc']]);
  rev('ZA', [[1976, ['Soweto'], 'học sinh xuống đường, cảnh sát nổ súng', 2, 'grief'], [2017, ['Cape Town'], 'hạn hán đe dọa “Ngày Số 0” cạn nước', 1, ''], [2022, ['Durban'], 'lũ lụt KwaZulu-Natal', 2, 'grief']]);

  ev('KE', [[1920, 'thành thuộc địa Kenya'], [1952, 'khởi nghĩa Mau Mau, tình trạng khẩn cấp', 2, 'grief'], [1963, 'Kenya độc lập', 2, 'joy'], [1978, 'Jomo Kenyatta qua đời'], [1982, 'đảo chính hụt'], [1998, 'đánh bom đại sứ quán Mỹ ở Nairobi', 2, 'grief'], [2002, 'Mwai Kibaki thắng cử'],
    [2007, 'bạo lực sau bầu cử', 2, 'grief'], [2010, 'hiến pháp mới'], [2013, 'tấn công trung tâm Westgate', 1, 'grief'], [2015, 'thảm sát đại học Garissa', 1, 'grief'], [2022, 'William Ruto đắc cử'], [2024, 'biểu tình phản đối dự luật tài chính']]);
  ev('TZ', [[1961, 'Tanganyika độc lập'], [1964, 'cách mạng Zanzibar; hợp nhất thành Tanzania'], [1967, 'Tuyên bố Arusha về chủ nghĩa xã hội Ujamaa'], [1979, 'chiến tranh lật đổ Idi Amin'], [1998, 'đánh bom đại sứ quán Mỹ'], [2021, 'Samia Suluhu Hassan làm nữ tổng thống đầu tiên']]);
  ev('CD', [[1908, 'Bỉ tiếp quản Congo từ Vua Leopold'], [1960, 'độc lập; khủng hoảng Congo', 2], [1961, 'Patrice Lumumba bị sát hại', 1, 'grief'], [1965, 'Mobutu nắm quyền'], [1971, 'đổi tên thành Zaire'], [1974, 'trận quyền anh “Rumble in the Jungle”'], [1997, 'Mobutu bị lật đổ'],
    [1998, 'Chiến tranh Congo lần hai', 2, 'grief'], [2003, 'chính phủ chuyển tiếp'], [2018, 'dịch Ebola ở miền đông'], [2019, 'Félix Tshisekedi nhậm chức'], [2025, 'M23 chiếm Goma và Bukavu', 2, 'grief']]);
  reg('CD', [[['Goma', 'Bukavu'], 1996, 2025, 'miền đông chiến loạn', 'Dân quân, trại tị nạn, mỏ khoáng sản bị tranh giành']]);
  rev('CD', [[2002, ['Goma'], 'núi lửa Nyiragongo phun trào', 2, 'grief'], [2021, ['Goma'], 'Nyiragongo phun trào lần nữa', 1, '']]);
  ev('DZ', [[1945, 'thảm sát Sétif', 2, 'grief'], [1954, 'chiến tranh giành độc lập', 2], [1962, 'Algérie độc lập', 2, 'joy'], [1965, 'Boumédiène đảo chính'], [1988, 'bạo loạn tháng Mười'], [1992, 'hủy bầu cử, Thập niên Đen', 2, 'grief'], [2019, 'phong trào Hirak, Bouteflika từ chức']]);
  ev('MA', [[1912, 'thành xứ bảo hộ của Pháp'], [1956, 'Maroc độc lập', 2], [1975, 'Cuộc tuần hành Xanh vào Tây Sahara'], [2011, 'hiến pháp mới sau biểu tình'], [2022, 'vào bán kết World Cup', 1, 'joy'], [2023, 'động đất Al Haouz', 2, 'grief']]);
  rev('MA', [[2003, ['Casablanca'], 'đánh bom liều chết', 2, 'grief'], [2023, ['Marrakesh'], 'động đất làm hư hại phố cổ', 2, 'grief']]);
  ev('SD', [[1956, 'Sudan độc lập'], [1969, 'Nimeiry đảo chính'], [1983, 'nội chiến lần hai'], [1989, 'Omar al-Bashir đảo chính'], [2003, 'xung đột Darfur', 2, 'grief'], [2011, 'Nam Sudan tách ra'], [2019, 'Bashir bị lật đổ', 2], [2023, 'nội chiến giữa quân đội và RSF', 2, 'grief']]);
  reg('SD', [[['Khartoum', 'Omdurman'], 2023, 2025, 'thủ đô thành chiến trường', 'Dân bỏ chạy, bệnh viện đóng cửa, chợ bị cướp phá'], [['El Fasher', 'Nyala'], 2003, 2025, 'Darfur', 'Làng bị đốt, trại tản cư, nạn đói']]);
  ev('UG', [[1962, 'Uganda độc lập'], [1971, 'Idi Amin đảo chính', 2], [1972, 'trục xuất người gốc Á'], [1979, 'Amin bị lật đổ'], [1986, 'Yoweri Museveni nắm quyền'], [2000, 'dịch Ebola ở Gulu']]);
  ev('GH', [[1957, 'Ghana độc lập đầu tiên ở châu Phi hạ Sahara', 2, 'joy'], [1966, 'Nkrumah bị lật đổ'], [1979, 'Jerry Rawlings nắm quyền'], [1992, 'trở lại đa đảng'], [2007, 'phát hiện mỏ dầu ngoài khơi']]);
  ev('AO', [[1961, 'chiến tranh giành độc lập'], [1975, 'Angola độc lập, nội chiến', 2], [2002, 'Jonas Savimbi chết, nội chiến kết thúc', 2], [2017, 'João Lourenço kế nhiệm dos Santos']]);
  ev('MZ', [[1964, 'FRELIMO khởi nghĩa'], [1975, 'Mozambique độc lập', 2], [1977, 'nội chiến', 2, 'grief'], [1992, 'hòa ước Rome'], [2000, 'đại hồng thủy'], [2019, 'bão Idai tàn phá Beira', 2, 'grief']]);
  ev('ZW', [[1965, 'Rhodesia đơn phương tuyên bố độc lập'], [1980, 'Zimbabwe độc lập', 2], [2000, 'cải cách ruộng đất'], [2008, 'siêu lạm phát', 2, 'grief'], [2017, 'Mugabe bị buộc từ chức']]);
  ev('RW', [[1962, 'Rwanda độc lập'], [1994, 'diệt chủng người Tutsi', 2, 'grief'], [2003, 'hiến pháp mới']]);
  ev('CI', [[1960, 'Bờ Biển Ngà độc lập'], [1993, 'Houphouët-Boigny qua đời'], [2002, 'nội chiến'], [2011, 'khủng hoảng sau bầu cử']]);
  ev('CM', [[1960, 'Cameroon độc lập'], [1986, 'khí độc hồ Nyos', 1, 'grief'], [2016, 'khủng hoảng vùng nói tiếng Anh']]);
  ev('SN', [[1960, 'Sénégal độc lập'], [2000, 'Abdoulaye Wade thắng cử'], [2002, 'phà Joola chìm', 2, 'grief'], [2024, 'Bassirou Diomaye Faye đắc cử']]);
  ev('LY', [[1911, 'Ý xâm lược'], [1951, 'Libya độc lập'], [1969, 'Gaddafi đảo chính', 2], [2011, 'nội chiến, Gaddafi bị giết', 2], [2023, 'lũ vỡ đập Derna', 2, 'grief']]);
  ev('TN', [[1956, 'Tunisia độc lập'], [1987, 'Ben Ali thay Bourguiba'], [2011, 'Cách mạng Hoa Nhài', 2], [2015, 'tấn công bảo tàng Bardo và bãi biển Sousse', 1, 'grief'], [2021, 'Tổng thống Saied đình chỉ quốc hội']]);
  ev('SO', [[1960, 'Somalia độc lập'], [1969, 'Siad Barre đảo chính'], [1991, 'nhà nước sụp đổ', 2, 'grief'], [1993, 'trận Mogadishu'], [2011, 'nạn đói', 2, 'grief'], [2017, 'đánh bom xe tải ở Mogadishu', 2, 'grief']]);
  ev('ML', [[1960, 'Mali độc lập'], [2012, 'đảo chính; phiến quân chiếm miền bắc', 2], [2013, 'Pháp can thiệp'], [2020, 'đảo chính']]);
  ev('ZM', [[1964, 'Zambia độc lập'], [1991, 'trở lại đa đảng'], [1993, 'tai nạn máy bay đội tuyển bóng đá', 1, 'grief'], [2012, 'vô địch cúp châu Phi', 1, 'joy']]);

  ev('AU', [[1901, 'Liên bang Úc thành lập', 2], [1915, 'trận Gallipoli', 2, 'grief'], [1927, 'quốc hội dời về Canberra'], [1932, 'cầu cảng Sydney khánh thành'], [1942, 'Darwin bị Nhật ném bom'], [1956, 'Thế vận hội Melbourne'], [1967, 'trưng cầu công nhận người bản địa'], [1973, 'Nhà hát Opera Sydney khánh thành'],
    [1974, 'bão Tracy tàn phá Darwin'], [1983, 'cháy rừng Thứ Tư Tro Tàn'], [1996, 'thảm sát Port Arthur, siết luật súng', 2, 'grief'], [1999, 'trưng cầu giữ chế độ quân chủ'], [2000, 'Thế vận hội Sydney', 2, 'joy'], [2008, 'lời xin lỗi Thế hệ bị Cướp'],
    [2009, 'cháy rừng Thứ Bảy Đen', 2, 'grief'], [2017, 'hợp pháp hóa hôn nhân đồng giới'], [2020, 'mùa cháy rừng Mùa hè Đen', 2, 'grief'], [2022, 'Anthony Albanese làm thủ tướng'], [2023, 'trưng cầu Tiếng nói cho người bản địa thất bại'], [2025, 'cấm trẻ dưới 16 dùng mạng xã hội']]);
  rev('AU', [[2014, ['Sydney'], 'vụ bắt con tin ở quán cà phê Lindt', 1, 'grief'], [2022, ['Brisbane'], 'lũ lụt lớn', 1, 'grief'], [2009, ['Melbourne'], 'cháy rừng Thứ Bảy Đen quanh thành phố', 2, 'grief']]);
  ev('NZ', [[1907, 'thành quốc gia tự trị'], [1931, 'động đất Hawke\'s Bay'], [1953, 'Edmund Hillary lên đỉnh Everest; thảm họa tàu Tangiwai'], [1985, 'tàu Rainbow Warrior bị đánh chìm'], [1987, 'phi hạt nhân hóa'], [2011, 'động đất Christchurch', 2, 'grief'], [2019, 'thảm sát ở thánh đường Christchurch; núi lửa Whakaari', 2, 'grief']]);
  rev('NZ', [[2011, ['Christchurch'], 'động đất phá hủy trung tâm thành phố', 2, 'grief'], [2019, ['Christchurch'], 'xả súng ở hai thánh đường', 2, 'grief'], [2023, ['Auckland'], 'lũ lụt và bão Gabrielle', 1, 'grief']]);

  ev('SA', [[1902, 'Ibn Saud chiếm Riyadh'], [1932, 'Vương quốc Ả Rập Xê Út thành lập', 2], [1938, 'phát hiện dầu ở Dammam'], [1973, 'cấm vận dầu mỏ'], [1979, 'vụ chiếm Đại Thánh đường Mecca', 2], [1990, 'quân Mỹ đóng ở vùng Vịnh'], [2015, 'thảm họa giẫm đạp ở Mina; can thiệp quân sự ở Yemen', 1, 'grief'],
    [2017, 'Mohammed bin Salman thành thái tử'], [2018, 'phụ nữ được lái xe; nhà báo Khashoggi bị sát hại']]);
  ev('AE', [[1971, 'UAE thành lập', 2], [2010, 'tòa tháp Burj Khalifa khánh thành'], [2020, 'phóng tàu thăm dò sao Hỏa'], [2021, 'Expo Dubai']]);
  ev('JO', [[1946, 'Jordan độc lập'], [1970, 'Tháng Chín Đen'], [1994, 'hòa ước với Israel'], [1999, 'Vua Hussein qua đời; Abdullah II lên ngôi'], [2005, 'đánh bom khách sạn ở Amman']]);
  ev('LB', [[1943, 'Lebanon độc lập'], [1975, 'nội chiến bùng nổ', 2, 'grief'], [1982, 'Israel xâm lược, thảm sát Sabra và Shatila', 2, 'grief'], [1990, 'nội chiến kết thúc'], [2005, 'Thủ tướng Rafik Hariri bị ám sát'], [2006, 'chiến tranh Israel – Hezbollah'], [2019, 'khủng hoảng ngân hàng'], [2020, 'vụ nổ cảng Beirut', 2, 'grief'], [2024, 'chiến tranh Israel – Hezbollah', 2, 'grief']]);
  rev('LB', [[2020, ['Beirut'], 'vụ nổ cảng phá hủy nhiều khu phố', 2, 'grief']]);
  ev('EE', [[1918, 'Estonia tuyên bố độc lập'], [1940, 'Liên Xô sáp nhập'], [1988, 'Cách mạng Ca hát'], [1991, 'khôi phục độc lập', 2], [1994, 'phà Estonia chìm', 2, 'grief'], [2004, 'gia nhập EU và NATO'], [2007, 'tranh cãi tượng đài Người lính Đồng'], [2011, 'dùng đồng euro']]);
})(globalThis.G);
