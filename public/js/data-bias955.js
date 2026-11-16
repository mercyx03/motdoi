/* Một Đời — 9.5.5 bảng phân biệt đối xử theo thời đại: (1) tình trạng pháp lý và xã hội đối với người đồng tính, song tính theo nước và năm; (2) các chế độ và giai đoạn phân biệt chủng tộc, sắc tộc.
   Mục đích là bối cảnh lịch sử để cuộc đời hợp lý: rào cản pháp luật, việc làm, an toàn; KHÔNG nói gì về tính cách hay giá trị của bất kỳ nhóm nào.
   LGBT: mức 0 = được bảo vệ hoặc chấp nhận phổ biến; 1 = bị kỳ thị, thiếu bảo vệ pháp lý; 2 = bị coi là phạm pháp hoặc bị luật pháp phân biệt; 3 = truy tố hình sự nặng hoặc đàn áp có tổ chức.
   Mỗi nước là các mốc [từ năm, mức]; mức giữ đến mốc kế tiếp. Nước không có dòng: nước còn hình sự hóa ngày nay (W.CRIM) mức 2, nước khác mức 1 trước 2000 và mức 0 từ 2000.
   Mốc dựa trên kiến thức lịch sử phổ biến (luật hình sự hóa, bãi bỏ, luật cấm tuyên truyền); chưa đối chiếu từng mốc với nguồn trực tuyến trong phiên làm việc này; mức là ước lượng, không phải thống kê.
   RACE: [mã, nước, từ, đến, tỷ lệ dân số thuộc nhóm bị phân biệt, mức 1–3, tên chế độ, tên nhóm, vùng (regex thành phố) hoặc null, mức tại vùng]. Tỷ lệ là phần dân cư nước đó, nhân vật thuộc nhóm hay không được rút theo mã đời, không theo gia cảnh. */
(function (G) {
  'use strict';
  var D = G.CTX945_DATA; if (!D) return;
  var LG = {
    US: [[1900, 3], [1962, 2], [2004, 1], [2015, 0]], CA: [[1900, 3], [1969, 2], [1993, 1], [2005, 0]], GB: [[1900, 3], [1967, 2], [2004, 1], [2014, 0]], IE: [[1900, 3], [1988, 2], [1993, 1], [2015, 0]],
    AU: [[1900, 3], [1973, 2], [1997, 1], [2017, 0]], NZ: [[1900, 3], [1986, 1], [2005, 0]], DE: [[1900, 2], [1933, 3], [1969, 2], [1994, 1], [2002, 0]], AT: [[1900, 3], [1971, 2], [1990, 1], [2010, 0]],
    FR: [[1900, 1], [1942, 2], [1982, 1], [1999, 0]], IT: [[1900, 1], [2005, 0]], ES: [[1900, 1], [1936, 3], [1975, 2], [1979, 1], [2005, 0]], PT: [[1900, 2], [1982, 1], [2010, 0]],
    NL: [[1900, 1], [1940, 2], [1946, 1], [1990, 0]], BE: [[1900, 1], [1985, 0]], CH: [[1900, 1], [1992, 0]], SE: [[1900, 2], [1944, 1], [1995, 0]], NO: [[1900, 3], [1972, 1], [2009, 0]], DK: [[1900, 2], [1933, 1], [1989, 0]],
    FI: [[1900, 3], [1971, 1], [2017, 0]], IS: [[1900, 3], [1940, 1], [1996, 0]], PL: [[1900, 2], [1932, 1]], CZ: [[1900, 2], [1962, 1], [2006, 0]], SK: [[1900, 2], [1962, 1]], HU: [[1900, 2], [1961, 1], [2020, 2]], RO: [[1900, 2], [2001, 1]],
    BG: [[1900, 2], [1968, 1]], GR: [[1900, 1], [2015, 0]], RU: [[1900, 2], [1934, 3], [1993, 1], [2013, 2], [2023, 3]], UA: [[1900, 2], [1934, 3], [1991, 1]], BY: [[1900, 2], [1934, 3], [1994, 1]], MD: [[1900, 2], [1934, 3], [1995, 2], [2013, 1]],
    LT: [[1900, 2], [1934, 3], [1993, 1]], LV: [[1900, 2], [1934, 3], [1992, 1], [2022, 0]], EE: [[1900, 2], [1934, 3], [1992, 1], [2016, 0]], GE: [[1900, 2], [1934, 3], [2000, 1]], AM: [[1900, 2], [1934, 3], [2003, 2]], AZ: [[1900, 2], [1934, 3], [2000, 2]],
    KZ: [[1900, 2], [1934, 3], [1998, 1]], UZ: [[1900, 2], [1934, 3], [1991, 3]], TM: [[1900, 2], [1934, 3], [1991, 3]], TJ: [[1900, 2], [1934, 3], [1998, 1]], KG: [[1900, 2], [1934, 3], [1998, 1]],
    RS: [[1900, 2], [1994, 1]], HR: [[1900, 2], [1977, 1]], SI: [[1900, 2], [1977, 1], [2000, 0]], BA: [[1900, 2], [1998, 1]], MK: [[1900, 2], [1996, 1]], ME: [[1900, 2], [1977, 1]], AL: [[1900, 2], [1995, 1]],
    TR: [[1900, 1], [2015, 2]], IL: [[1900, 2], [1988, 1], [2010, 0]], EG: [[1900, 1], [1951, 2]], IR: [[1900, 2], [1979, 3]], IQ: [[1900, 2], [2003, 3], [2009, 2]], SY: [[1900, 2]], LB: [[1900, 2]], JO: [[1900, 1]], SA: [[1900, 3]], YE: [[1900, 3]],
    AE: [[1900, 2]], QA: [[1900, 2]], KW: [[1900, 2]], OM: [[1900, 2]], BH: [[1900, 1]], AF: [[1900, 2], [1996, 3], [2001, 2], [2021, 3]], PK: [[1900, 2]], BD: [[1900, 2]], IN: [[1900, 2], [2018, 1]], LK: [[1900, 2]], NP: [[1900, 2], [2007, 1]], BT: [[1900, 2], [2021, 1]], MV: [[1900, 2]],
    CN: [[1900, 1], [1950, 2], [1997, 1]], TW: [[1900, 1], [2003, 1], [2019, 0]], KR: [[1900, 1]], JP: [[1900, 1]], MN: [[1900, 1], [1961, 2], [1993, 1]], KP: [[1900, 1], [1950, 2]], VN: [[1900, 1]], LA: [[1900, 1]], KH: [[1900, 1], [1975, 3], [1979, 1]],
    TH: [[1900, 1]], MY: [[1900, 2]], SG: [[1900, 2], [2022, 1]], ID: [[1900, 1], [2022, 2]], PH: [[1900, 1]], MM: [[1900, 2]], BN: [[1900, 2], [2014, 3]],
    ZA: [[1900, 2], [1994, 1]], NG: [[1900, 2], [2014, 3]], GH: [[1900, 2]], KE: [[1900, 2]], UG: [[1900, 2], [2014, 3]], TZ: [[1900, 2]], ZW: [[1900, 2]], ZM: [[1900, 2]], MW: [[1900, 2]], ET: [[1900, 2]], SO: [[1900, 3]], SD: [[1900, 3]],
    MA: [[1900, 2]], DZ: [[1900, 2]], TN: [[1900, 2]], LY: [[1900, 2], [2011, 3]], SN: [[1900, 2]], CM: [[1900, 2]], CI: [[1900, 1]], ML: [[1900, 1], [2012, 2]], AO: [[1900, 2], [2021, 1]], MZ: [[1900, 2], [2015, 1]], BW: [[1900, 2], [2019, 1]], NA: [[1900, 2], [2024, 1]],
    CD: [[1900, 1]], RW: [[1900, 1]], MG: [[1900, 1]], BR: [[1900, 1], [1964, 2], [1985, 1]], AR: [[1900, 1], [1976, 2], [1983, 1], [2010, 0]], CL: [[1900, 2], [1999, 1], [2015, 1]], UY: [[1900, 1], [2013, 0]], MX: [[1900, 1], [2010, 1]],
    CO: [[1900, 2], [1981, 1]], PE: [[1900, 1]], VE: [[1900, 1]], EC: [[1900, 2], [1997, 1]], BO: [[1900, 1]], PY: [[1900, 1]], CU: [[1900, 2], [1965, 3], [1969, 2], [1979, 1]], JM: [[1900, 2]], TT: [[1900, 2], [2018, 1]], HT: [[1900, 1]], DO: [[1900, 1]]
  };
  // [mã, nước, từ, đến, tỷ lệ, mức, chế độ, nhóm, vùng, mức tại vùng]
  var RACE = [
    ['us_black_jc', 'US', 1900, 1964, 0.11, 2, 'chế độ phân biệt chủng tộc theo luật (Jim Crow) và phân biệt trong nhà ở, việc làm', 'người Mỹ gốc Phi', 'Atlanta|Houston|Dallas|Miami|San Antonio', 3],
    ['us_black', 'US', 1965, 2025, 0.13, 1, 'bất bình đẳng và phân biệt đối xử còn tồn tại sau các đạo luật dân quyền', 'người Mỹ gốc Phi', null, 0],
    ['us_native', 'US', 1900, 1967, 0.01, 2, 'trường nội trú cưỡng bức và mất đất của người bản địa', 'người bản địa Mỹ', null, 0],
    ['us_asian', 'US', 1900, 1943, 0.015, 2, 'luật loại trừ người gốc Hoa và luật hạn chế sở hữu đất', 'người Mỹ gốc Á', null, 0],
    ['us_nikkei', 'US', 1942, 1945, 0.004, 3, 'diện tập trung người Mỹ gốc Nhật trong chiến tranh', 'người Mỹ gốc Nhật', 'Los Angeles|Seattle|San Diego', 3],
    ['za_apartheid', 'ZA', 1948, 1993, 0.91, 3, 'chế độ phân biệt chủng tộc apartheid', 'người không thuộc nhóm da trắng', null, 0],
    ['za_after', 'ZA', 1994, 2025, 0.90, 1, 'bất bình đẳng kéo dài sau apartheid', 'người da đen và da màu', null, 0],
    ['au_aboriginal', 'AU', 1900, 1972, 0.03, 3, 'chính sách chính phủ tách trẻ em bản địa khỏi gia đình và hạn chế đi lại', 'người bản địa Úc', null, 0],
    ['au_aboriginal2', 'AU', 1973, 2025, 0.03, 1, 'bất bình đẳng kéo dài với người bản địa', 'người bản địa Úc', null, 0],
    ['ca_indigenous', 'CA', 1900, 1996, 0.04, 2, 'trường nội trú dành cho trẻ em bản địa', 'người bản địa Canada', null, 0],
    ['ca_chinese', 'CA', 1900, 1947, 0.01, 2, 'thuế đầu người và luật loại trừ người gốc Hoa', 'người Canada gốc Hoa', null, 0],
    ['nz_maori', 'NZ', 1900, 1970, 0.07, 1, 'phân biệt trong việc làm và đất đai với người Māori', 'người Māori', null, 0],
    ['gb_immigrant', 'GB', 1948, 1975, 0.02, 2, 'phân biệt công khai về nhà ở và việc làm với người nhập cư da màu', 'người nhập cư da màu', null, 0],
    ['gb_minority', 'GB', 1976, 2025, 0.13, 1, 'phân biệt còn tồn tại dù có luật quan hệ chủng tộc', 'người thuộc sắc tộc thiểu số', null, 0],
    ['fr_maghreb', 'FR', 1950, 1975, 0.02, 1, 'phân biệt với người lao động nhập cư từ Bắc Phi', 'người nhập cư Bắc Phi', null, 0],
    ['de_turkish', 'DE', 1960, 2025, 0.05, 1, 'khó khăn và phân biệt với người lao động khách và con cháu họ', 'người gốc Thổ Nhĩ Kỳ', null, 0],
    ['de_jewish', 'DE', 1933, 1945, 0.008, 3, 'cuộc đàn áp dưới chế độ Quốc xã: mất việc, mất tài sản, bị dồn vào khu riêng', 'người Do Thái', null, 0],
    ['de_roma', 'DE', 1933, 1945, 0.002, 3, 'cuộc đàn áp dưới chế độ Quốc xã', 'người Roma và Sinti', null, 0],
    ['at_jewish', 'AT', 1938, 1945, 0.01, 3, 'cuộc đàn áp sau sáp nhập vào Đức', 'người Do Thái', null, 0],
    ['nl_jewish', 'NL', 1940, 1945, 0.01, 3, 'cuộc đàn áp thời chiếm đóng', 'người Do Thái', null, 0],
    ['fr_jewish', 'FR', 1940, 1944, 0.007, 3, 'luật của chính quyền Vichy và cuộc truy bắt thời chiếm đóng', 'người Do Thái', null, 0],
    ['pl_jewish', 'PL', 1939, 1945, 0.09, 3, 'bị dồn vào khu riêng và đàn áp thời chiếm đóng', 'người Do Thái', null, 0],
    ['hu_jewish', 'HU', 1938, 1945, 0.05, 3, 'các đạo luật chống người Do Thái và vụ trục xuất 1944', 'người Do Thái', null, 0],
    ['ro_jewish', 'RO', 1940, 1944, 0.04, 3, 'các đạo luật và bạo lực chống người Do Thái', 'người Do Thái', null, 0],
    ['cz_jewish', 'CZ', 1939, 1945, 0.01, 3, 'cuộc đàn áp thời chiếm đóng', 'người Do Thái', null, 0],
    ['sk_jewish', 'SK', 1939, 1945, 0.02, 3, 'luật của nhà nước Slovakia và các cuộc trục xuất', 'người Do Thái', null, 0],
    ['gr_jewish', 'GR', 1941, 1944, 0.01, 3, 'cuộc đàn áp thời chiếm đóng', 'người Do Thái', null, 0],
    ['lt_jewish', 'LT', 1941, 1944, 0.07, 3, 'cuộc đàn áp thời chiếm đóng', 'người Do Thái', null, 0],
    ['lv_jewish', 'LV', 1941, 1944, 0.05, 3, 'cuộc đàn áp thời chiếm đóng', 'người Do Thái', null, 0],
    ['it_jewish', 'IT', 1938, 1945, 0.001, 2, 'các đạo luật chủng tộc 1938', 'người Do Thái', null, 0],
    ['rw_tutsi', 'RW', 1959, 1989, 0.14, 2, 'phân biệt và các đợt bạo lực nhằm vào người Tutsi', 'người Tutsi', null, 0],
    ['rw_tutsi2', 'RW', 1990, 1994, 0.14, 3, 'cuộc nội chiến và chiến dịch diệt chủng', 'người Tutsi', null, 0],
    ['mm_rohingya', 'MM', 1978, 2011, 0.02, 2, 'bị tước quyền công dân (luật 1982) và hạn chế đi lại', 'người Rohingya', null, 0],
    ['mm_rohingya2', 'MM', 2012, 2025, 0.02, 3, 'bạo lực và cuộc di tản hàng loạt', 'người Rohingya', null, 0],
    ['cn_uyghur', 'CN', 2017, 2025, 0.01, 2, 'hạn chế tôn giáo và giám sát ở Tân Cương', 'người Duy Ngô Nhĩ', null, 0],
    ['in_caste', 'IN', 1900, 1949, 0.16, 3, 'chế độ đẳng cấp: bị coi là "bất khả xúc" và cấm vào đền, giếng nước, trường học', 'người Dalit (tiện dân)', null, 0],
    ['in_caste2', 'IN', 1950, 2025, 0.17, 1, 'phân biệt đẳng cấp còn tồn tại dù đã bị luật cấm', 'người Dalit', null, 0],
    ['jp_korean', 'JP', 1910, 1990, 0.005, 1, 'phân biệt với người Hàn Quốc sống ở Nhật', 'người gốc Triều Tiên ở Nhật', null, 0],
    ['br_afro', 'BR', 1900, 2025, 0.5, 1, 'bất bình đẳng chủng tộc kéo dài từ thời nô lệ', 'người Brazil gốc Phi', null, 0],
    ['lk_tamil', 'LK', 1956, 1982, 0.11, 2, 'đạo luật ngôn ngữ và phân biệt với người Tamil', 'người Tamil', null, 0],
    ['lk_tamil2', 'LK', 1983, 2009, 0.11, 3, 'bạo lực 1983 và nội chiến', 'người Tamil', null, 0],
    ['tr_kurd', 'TR', 1925, 1991, 0.17, 2, 'cấm tiếng Kurd và đàn áp văn hóa', 'người Kurd', null, 0],
    ['tr_kurd2', 'TR', 1992, 2025, 0.17, 1, 'hạn chế dần được nới nhưng còn căng thẳng', 'người Kurd', null, 0],
    ['tr_armenian', 'TR', 1915, 1923, 0.08, 3, 'cuộc trục xuất và diệt chủng thời Thế chiến I', 'người Armenia, Hy Lạp và Assyria', null, 0],
    ['id_chinese', 'ID', 1966, 1997, 0.03, 2, 'cấm chữ Hán và đổi tên cưỡng bức', 'người Indonesia gốc Hoa', null, 0],
    ['id_chinese2', 'ID', 1998, 1998, 0.03, 3, 'cuộc bạo loạn tháng 5/1998', 'người Indonesia gốc Hoa', null, 0],
    ['gt_maya', 'GT', 1960, 1996, 0.4, 2, 'phân biệt và cuộc nội chiến nhằm vào cộng đồng Maya', 'người Maya', null, 0],
    ['gt_maya2', 'GT', 1981, 1983, 0.4, 3, 'chiến dịch tiêu thổ ở vùng cao nguyên', 'người Maya', null, 0],
    ['dz_native', 'DZ', 1900, 1946, 0.88, 3, 'chế độ luật riêng cho người bản xứ thời thuộc địa Pháp', 'người Algeria bản xứ', null, 0],
    ['dz_native2', 'DZ', 1947, 1961, 0.88, 2, 'bất bình đẳng thuộc địa và chiến tranh giành độc lập', 'người Algeria bản xứ', null, 0],
    ['sd_darfur', 'SD', 2003, 2010, 0.2, 3, 'cuộc chiến ở Darfur', 'các cộng đồng ở Darfur', null, 0],
    ['rs_albanian', 'RS', 1989, 1999, 0.14, 2, 'thu hồi quyền tự trị và phân biệt ở Kosovo', 'người Albania ở Kosovo', null, 0]
  ];
  D.BIAS = { LG: LG, RACE: RACE, LV: ['được bảo vệ hoặc chấp nhận phổ biến', 'bị kỳ thị, thiếu bảo vệ pháp lý', 'bị coi là phạm pháp hoặc bị luật pháp phân biệt', 'bị truy tố hình sự nặng hoặc đàn áp có tổ chức'] };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
