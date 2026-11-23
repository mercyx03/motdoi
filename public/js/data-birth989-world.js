/* Một Đời — 9.8.9 biên niên thế giới 1900–2025: mỗi năm ít nhất một sự kiện có thật (mức 1). Chỉ hiện khi nước đang sống năm đó không có
   sự kiện riêng, để mọi năm của mọi nước đều có nội dung mà không phải đặt ra sự kiện cho nước nhỏ. Nguồn thứ cấp, đối chiếu 23/11/2026. */
(function (G) {
  'use strict';
  var D = G.BIRTH987 || (G.BIRTH987 = { ERA: {}, EV: {}, WORLD: [] });
  var W = [
    [1900, 'Hội chợ Thế giới ở Paris; tàu điện ngầm Paris khai trương'], [1901, 'giải Nobel lần đầu được trao'], [1902, 'núi lửa Pelée phun trào ở Martinique, xóa sổ thành phố Saint-Pierre'],
    [1903, 'anh em nhà Wright thực hiện chuyến bay có động cơ đầu tiên'], [1904, 'Thế vận hội lần đầu tổ chức ở châu Mỹ (St. Louis)'], [1905, 'Albert Einstein công bố thuyết tương đối hẹp'],
    [1906, 'động đất và hỏa hoạn tàn phá San Francisco'], [1907, 'Hội nghị Hòa bình La Hay lần thứ hai'], [1908, 'xe Ford Model T ra đời, ô tô bắt đầu đến với người bình dân'],
    [1909, 'Louis Blériot lần đầu bay qua eo biển Manche'], [1910, 'sao chổi Halley bay qua, nhiều nơi hoảng sợ ngày tận thế'], [1911, 'Roald Amundsen lần đầu tới Nam Cực'],
    [1912, 'tàu Titanic chìm trên chuyến đi đầu tiên'], [1913, 'Ford đưa dây chuyền lắp ráp vào sản xuất ô tô'], [1915, 'Einstein công bố thuyết tương đối rộng'],
    [1916, 'các trận Verdun và Somme, hơn một triệu binh sĩ thương vong'], [1917, 'cách mạng ở Nga; Mỹ tham chiến'], [1919, 'Hòa ước Versailles được ký'],
    [1920, 'Hội Quốc Liên ra đời'], [1921, 'phát hiện insulin chữa bệnh tiểu đường'], [1922, 'Liên bang Xô viết thành lập; tìm thấy lăng mộ pharaoh Tutankhamun'],
    [1923, 'đại động đất Kantō ở Nhật Bản'], [1924, 'Thế vận hội mùa đông đầu tiên ở Chamonix'], [1925, 'Hiệp ước Locarno đem lại hy vọng hòa bình ở châu Âu'],
    [1926, 'John Logie Baird trình diễn truyền hình lần đầu'], [1927, 'Charles Lindbergh bay một mình qua Đại Tây Dương; phim có tiếng nói đầu tiên'], [1928, 'Alexander Fleming phát hiện penicillin'],
    [1930, 'World Cup bóng đá đầu tiên tổ chức ở Uruguay'], [1931, 'Nhật chiếm Mãn Châu; Đại suy thoái lan khắp thế giới'], [1932, 'Đại suy thoái chạm đáy, hàng chục triệu người thất nghiệp trên thế giới'],
    [1933, 'Hitler lên nắm quyền ở Đức'], [1934, 'Hồng quân Trung Quốc bắt đầu cuộc Trường Chinh'], [1935, 'Ý xâm lược Ethiopia'],
    [1936, 'nội chiến Tây Ban Nha bùng nổ; Thế vận hội Berlin'], [1937, 'chiến tranh Trung – Nhật toàn diện; khí cầu Hindenburg bốc cháy'], [1938, 'Hiệp ước Munich; Đêm Thủy tinh ở Đức'],
    [1940, 'Pháp thất thủ; trận chiến nước Anh trên bầu trời'], [1941, 'Đức tấn công Liên Xô; Nhật tấn công Trân Châu Cảng'], [1942, 'trận Stalingrad bắt đầu; trận Midway'],
    [1943, 'quân Đức đầu hàng ở Stalingrad, bước ngoặt của chiến tranh'], [1944, 'quân Đồng minh đổ bộ Normandie'], [1946, 'Đại hội đồng Liên Hợp Quốc họp phiên đầu tiên; tòa án Nuremberg tuyên án'],
    [1947, 'Ấn Độ và Pakistan độc lập; Chiến tranh Lạnh bắt đầu'], [1948, 'Tuyên ngôn Quốc tế Nhân quyền; Nhà nước Israel ra đời'], [1949, 'nước Cộng hòa Nhân dân Trung Hoa ra đời; NATO thành lập'],
    [1950, 'chiến tranh Triều Tiên bùng nổ'], [1951, 'Cộng đồng Than Thép châu Âu được thành lập'], [1952, 'Mỹ thử quả bom khinh khí đầu tiên'],
    [1953, 'Stalin qua đời; đình chiến ở Triều Tiên; phát hiện cấu trúc ADN; Everest được chinh phục'], [1954, 'chiến thắng Điện Biên Phủ, Hiệp định Genève về Đông Dương'], [1955, 'Hội nghị Á – Phi ở Bandung; Khối Warszawa thành lập'],
    [1956, 'khủng hoảng kênh Suez; cách mạng Hungary'], [1958, 'NASA thành lập; Cộng đồng Kinh tế châu Âu bắt đầu hoạt động'], [1959, 'cách mạng Cuba thắng lợi'],
    [1960, '“năm châu Phi”: mười bảy nước giành độc lập'], [1962, 'khủng hoảng tên lửa Cuba'], [1963, 'Tổng thống Mỹ Kennedy bị ám sát'],
    [1964, 'Thế vận hội Tokyo, lần đầu ở châu Á'], [1965, 'Mỹ đưa quân chiến đấu vào Việt Nam'], [1966, 'Cách mạng Văn hóa bắt đầu ở Trung Quốc'],
    [1967, 'ca ghép tim người đầu tiên ở Nam Phi; chiến tranh Sáu ngày ở Trung Đông'], [1968, 'Martin Luther King bị ám sát; Mùa xuân Praha; làn sóng biểu tình sinh viên'], [1970, 'Ngày Trái Đất đầu tiên'],
    [1971, 'Trung Quốc vào Liên Hợp Quốc; Bangladesh ra đời'], [1972, 'Tổng thống Nixon thăm Trung Quốc'], [1974, 'Tổng thống Nixon từ chức sau vụ Watergate'],
    [1975, 'chiến tranh Việt Nam kết thúc'], [1976, 'Mao Trạch Đông qua đời; động đất Đường Sơn'], [1977, 'ca đậu mùa tự nhiên cuối cùng được ghi nhận ở Somalia'],
    [1978, 'em bé thụ tinh trong ống nghiệm đầu tiên chào đời ở Anh'], [1979, 'cách mạng Hồi giáo Iran; Liên Xô đưa quân vào Afghanistan'], [1980, 'Tổ chức Y tế Thế giới tuyên bố xóa sổ bệnh đậu mùa'],
    [1981, 'những ca AIDS đầu tiên được mô tả; máy tính cá nhân IBM PC ra đời'], [1982, 'chiến tranh Falklands/Malvinas'], [1983, 'mạng máy tính tiền thân của Internet chuyển sang giao thức TCP/IP'],
    [1984, 'thảm họa khí độc Bhopal ở Ấn Độ'], [1985, 'hòa nhạc Live Aid gây quỹ chống nạn đói Ethiopia; phát hiện lỗ thủng tầng ôzôn'], [1986, 'thảm họa hạt nhân Chernobyl'],
    [1987, 'Mỹ và Liên Xô ký hiệp ước loại bỏ tên lửa tầm trung'], [1988, 'Thế vận hội Seoul'], [1990, 'nước Đức thống nhất; Nelson Mandela ra tù'],
    [1992, 'Hội nghị Thượng đỉnh Trái Đất ở Rio; chiến tranh ở Nam Tư cũ'], [1993, 'Liên minh châu Âu ra đời; Hiệp định Oslo'], [1994, 'diệt chủng ở Rwanda; Nelson Mandela làm tổng thống Nam Phi'],
    [1995, 'Tổ chức Thương mại Thế giới (WTO) ra đời'], [1996, 'Taliban chiếm Kabul'], [1997, 'khủng hoảng tài chính châu Á; Hồng Kông trở về Trung Quốc; công bố cừu Dolly nhân bản'],
    [1998, 'Google được thành lập'], [1999, 'đồng euro ra đời; dân số thế giới đạt sáu tỷ'], [2000, 'thế giới bước sang thiên niên kỷ mới; bản phác thảo bộ gen người được công bố'],
    [2002, 'tiền giấy euro bắt đầu lưu hành'], [2003, 'chiến tranh Iraq; dịch SARS'], [2005, 'bão Katrina; YouTube ra đời'],
    [2006, 'sao Diêm Vương bị xếp lại thành hành tinh lùn'], [2007, 'chiếc iPhone đầu tiên ra mắt'], [2009, 'đại dịch cúm H1N1'],
    [2010, 'động đất Haiti; giải cứu 33 thợ mỏ Chile'], [2011, 'Mùa xuân Ả Rập; thảm họa Fukushima; dân số thế giới đạt bảy tỷ'], [2012, 'phát hiện hạt Higgs; Thế vận hội London'],
    [2013, 'siêu bão Haiyan tàn phá Philippines'], [2014, 'dịch Ebola ở Tây Phi'], [2015, 'Thỏa thuận Paris về khí hậu; khủng hoảng người di cư ở châu Âu'],
    [2016, 'Anh bỏ phiếu rời EU; Donald Trump đắc cử tổng thống Mỹ'], [2017, 'phong trào #MeToo lan rộng'], [2018, 'Hội nghị thượng đỉnh Mỹ – Triều Tiên lần đầu ở Singapore'],
    [2019, 'bức ảnh đầu tiên chụp hố đen được công bố; cháy Nhà thờ Đức Bà Paris'], [2021, 'vắc-xin COVID-19 được tiêm trên toàn thế giới'], [2023, 'trí tuệ nhân tạo tạo sinh bùng nổ; động đất Thổ Nhĩ Kỳ – Syria'],
    [2024, 'Thế vận hội Paris; năm nóng nhất từng ghi nhận'], [2025, 'Giáo hoàng Phanxicô qua đời, Giáo hoàng Lêô XIV được bầu']
  ];
  D.WORLD = (D.WORLD || []).concat(W.map(function (x) { return [x[0], x[1], 1, '']; }));
})(globalThis.G);
