/* Một Đời — 9.8.9 bổ sung sự kiện 1900–2025 và bối cảnh theo thành phố: châu Mỹ.
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

  ev('US', [[1901, 'Tổng thống McKinley bị ám sát, Theodore Roosevelt lên thay', 2, 'grief'], [1903, 'anh em Wright bay chuyến đầu tiên'], [1908, 'Ford Model T ra đời'], [1913, 'Cục Dự trữ Liên bang thành lập; thuế thu nhập liên bang'], [1917, 'Mỹ tham chiến Thế chiến I', 2],
    [1918, 'đại dịch cúm lan khắp nước', 2, 'grief'], [1920, 'phụ nữ được quyền bầu cử; bắt đầu lệnh cấm rượu'], [1927, 'Lindbergh bay qua Đại Tây Dương; lũ sông Mississippi'], [1929, 'thị trường chứng khoán sụp đổ', 2, 'grief'], [1933, 'Roosevelt thực hiện Chính sách Mới', 2],
    [1935, 'luật An sinh Xã hội; bão bụi vùng Đồng bằng Lớn', 1, 'grief'], [1941, 'Trân Châu Cảng bị tấn công, Mỹ tham chiến', 2, 'grief'], [1944, 'luật GI Bill cho cựu chiến binh'], [1945, 'Roosevelt qua đời; ném bom nguyên tử xuống Nhật Bản', 2], [1950, 'chiến tranh Triều Tiên'],
    [1954, 'phán quyết Brown chấm dứt phân biệt trường học'], [1955, 'tẩy chay xe buýt Montgomery'], [1957, 'Liên Xô phóng Sputnik, Mỹ lo tụt hậu'], [1962, 'khủng hoảng tên lửa Cuba', 2], [1963, 'Tổng thống Kennedy bị ám sát', 2, 'grief'], [1964, 'luật Dân quyền'],
    [1965, 'đưa quân bộ binh vào Việt Nam', 2], [1968, 'Martin Luther King và Robert Kennedy bị ám sát', 2, 'grief'], [1969, 'Apollo 11 đổ bộ Mặt Trăng', 2, 'joy'], [1973, 'rút quân khỏi Việt Nam; khủng hoảng dầu mỏ'], [1974, 'Nixon từ chức vì Watergate', 2],
    [1979, 'khủng hoảng con tin Iran'], [1981, 'Reagan làm tổng thống; ca AIDS đầu tiên được ghi nhận'], [1986, 'tàu con thoi Challenger nổ', 1, 'grief'], [1991, 'chiến tranh vùng Vịnh'], [1995, 'đánh bom Oklahoma City', 1, 'grief'], [1999, 'xả súng trường Columbine', 1, 'grief'],
    [2001, 'khủng bố 11/9', 2, 'grief'], [2003, 'chiến tranh Iraq'], [2005, 'bão Katrina', 2, 'grief'], [2008, 'khủng hoảng tài chính; Barack Obama đắc cử', 2], [2010, 'luật Chăm sóc Y tế Hợp túi tiền'], [2012, 'xả súng trường Sandy Hook; bão Sandy', 1, 'grief'],
    [2015, 'Tối cao Pháp viện công nhận hôn nhân đồng giới'], [2016, 'Donald Trump đắc cử'], [2020, 'COVID-19; biểu tình sau cái chết của George Floyd', 2, 'grief'], [2021, 'bạo loạn Điện Capitol; Joe Biden nhậm chức', 2], [2022, 'Tối cao Pháp viện bãi bỏ án lệ Roe v. Wade'],
    [2024, 'Trump tái đắc cử sau vụ ám sát hụt'], [2025, 'cháy rừng Los Angeles; chính phủ đóng cửa kéo dài', 1, 'grief']]);
  var SOUTH = ['Atlanta', 'Houston', 'Dallas', 'Miami', 'San Antonio'];
  reg('US', [[SOUTH, 1900, 1964, 'miền Nam thời Jim Crow', 'Trường học, xe buýt, quán ăn phân biệt người da trắng và da đen; người da đen bị cản trở đi bầu'],
    [['Chicago', 'Philadelphia'], 1920, 1970, 'vành đai công nghiệp', 'Nhà máy, lò mổ, xưởng thép tuyển công nhân; người da đen từ miền Nam di cư lên'],
    [['Chicago', 'Philadelphia'], 1975, 1995, 'công nghiệp suy giảm', 'Nhà máy đóng cửa, khu nhà ở xã hội xuống cấp, tội phạm tăng'],
    [['Seattle', 'San Diego'], 1995, 2025, 'thủ phủ công nghệ', 'Công ty phần mềm, công nghệ sinh học, lương cao nhưng giá nhà tăng vọt'],
    [['Los Angeles'], 1920, 2025, 'kinh đô điện ảnh', 'Hollywood, xa lộ, cộng đồng gốc Mexico và châu Á đông đảo'],
    [['New York'], 1900, 1924, 'cửa ngõ người nhập cư', 'Tàu cập đảo Ellis, người Ý, Do Thái, Ireland chen chúc trong các khu chung cư Lower East Side']]);
  rev('US', [[1911, ['New York'], 'cháy xưởng may Triangle', 1, 'grief'], [1968, ['Chicago'], 'bạo loạn sau vụ ám sát King và hỗn loạn Đại hội đảng Dân chủ', 2, 'grief'], [1984, ['Los Angeles'], 'Thế vận hội mùa hè', 1, 'joy'],
    [1992, ['Los Angeles'], 'bạo loạn sau vụ Rodney King', 2, 'grief'], [1994, ['Los Angeles'], 'động đất Northridge', 1, 'grief'], [1996, ['Atlanta'], 'Thế vận hội mùa hè', 1, 'joy'], [2001, ['New York'], 'tòa tháp đôi sụp đổ', 2, 'grief'],
    [2013, ['Boston'], 'đánh bom cuộc thi marathon', 2, 'grief'], 
    [1992, ['Miami'], 'bão Andrew', 2, 'grief'], [2021, ['Houston', 'Dallas', 'San Antonio'], 'bão tuyết làm sập lưới điện Texas', 2, 'grief'], [2017, ['Houston'], 'bão Harvey', 2, 'grief'], [2025, ['Los Angeles'], 'cháy rừng Palisades và Eaton', 2, 'grief']]);

  ev('BR', [[1904, 'khởi nghĩa chống tiêm chủng ở Rio'], [1922, 'Tuần lễ Nghệ thuật Hiện đại'], [1930, 'Getúlio Vargas nắm quyền', 2], [1937, 'chế độ Estado Novo'], [1950, 'thua Uruguay ở chung kết World Cup'], [1958, 'vô địch World Cup lần đầu', 2, 'joy'],
    [1960, 'Brasília thành thủ đô'], [1964, 'đảo chính quân sự', 2], [1968, 'đạo luật AI-5 siết tự do'], [1970, 'vô địch World Cup lần ba', 1, 'joy'], [1985, 'trở lại chính quyền dân sự'], [1988, 'hiến pháp mới'], [1990, 'kế hoạch Collor phong tỏa tiết kiệm'], [1992, 'Collor bị luận tội'],
    [1994, 'Kế hoạch Real chặn siêu lạm phát; vô địch World Cup', 2, 'joy'], [2002, 'Lula đắc cử; vô địch World Cup lần năm', 1, 'joy'], [2013, 'biểu tình phản đối giá vé xe buýt'], [2014, 'đăng cai World Cup, thua Đức 1–7; điều tra Lava Jato'], [2016, 'Dilma Rousseff bị luận tội'],
    [2018, 'Jair Bolsonaro đắc cử'], [2019, 'vỡ đập chất thải mỏ Brumadinho', 1, 'grief'], [2022, 'Lula tái đắc cử'], [2023, 'bạo loạn ở các cơ quan quyền lực Brasília'], [2025, 'COP30 ở Belém']]);
  reg('BR', [[['Rio de Janeiro'], 1980, 2025, 'thành phố của favela', 'Khu ổ chuột trên đồi, băng đảng ma túy và các cuộc đột kích của cảnh sát'], [['São Paulo'], 1950, 2025, 'đầu tàu công nghiệp', 'Nhà máy ô tô ở ABC, người từ Đông Bắc lên làm công nhân'],
    [['Salvador', 'Recife', 'Fortaleza'], 1900, 1990, 'Đông Bắc khô hạn', 'Hạn hán sertão, nhiều gia đình di cư xuống phía nam']]);
  rev('BR', [[1960, ['Brasília'], 'thủ đô mới khánh thành', 2, 'joy'], [1992, ['Rio de Janeiro'], 'Hội nghị Thượng đỉnh Trái Đất', 1, ''], [2013, ['Porto Alegre'], 'hỏa hoạn hộp đêm Kiss ở Santa Maria', 1, 'grief'], [2016, ['Rio de Janeiro'], 'Thế vận hội mùa hè', 2, 'joy'], [2024, ['Porto Alegre'], 'lũ lớn bang Rio Grande do Sul', 2, 'grief']]);

  ev('MX', [[1910, 'Cách mạng Mexico bùng nổ', 2], [1913, 'Mười ngày Bi thảm, Madero bị sát hại', 1, 'grief'], [1917, 'hiến pháp mới'], [1926, 'chiến tranh Cristero'], [1929, 'đảng tiền thân PRI thành lập'], [1938, 'quốc hữu hóa dầu mỏ', 2], [1942, 'chương trình Bracero đưa lao động sang Mỹ'],
    [1953, 'phụ nữ được quyền bầu cử'], [1968, 'thảm sát Tlatelolco; Thế vận hội', 2, 'grief'], [1982, 'khủng hoảng nợ'], [1985, 'động đất Mexico City', 2, 'grief'], [1994, 'NAFTA có hiệu lực; khởi nghĩa Zapatista; khủng hoảng đồng peso', 2], [2000, 'đảng PRI mất quyền sau 71 năm', 2],
    [2006, 'bắt đầu cuộc chiến chống ma túy', 2, 'grief'], [2014, '43 sinh viên Ayotzinapa mất tích', 1, 'grief'], [2017, 'động đất Puebla', 1, 'grief'], [2018, 'López Obrador đắc cử'], [2024, 'Claudia Sheinbaum làm nữ tổng thống đầu tiên']]);
  reg('MX', [[['Tijuana', 'Ciudad Juárez'], 1965, 2025, 'vùng biên giới maquiladora', 'Nhà máy lắp ráp cho Mỹ, dòng người chờ vượt biên'], [['Ciudad Juárez'], 2008, 2025, 'vùng chiến tranh băng đảng', 'Giết chóc, tống tiền, giới nghiêm không chính thức']]);
  rev('MX', [[1985, ['Mexico City'], 'động đất phá hủy hàng trăm tòa nhà', 2, 'grief']]);

  ev('AR', [[1916, 'bầu cử phổ thông đầu tiên'], [1930, 'đảo chính quân sự đầu tiên'], [1946, 'Juan Perón làm tổng thống', 2], [1952, 'Eva Perón qua đời', 1, 'grief'], [1955, 'Perón bị lật đổ'], [1976, 'đảo chính, “Cuộc chiến bẩn thỉu”', 2, 'grief'], [1978, 'vô địch World Cup', 1, 'joy'],
    [1982, 'chiến tranh Falklands/Malvinas', 2, 'grief'], [1983, 'trở lại dân chủ'], [1989, 'siêu lạm phát'], [1994, 'đánh bom trung tâm Do Thái AMIA', 1, 'grief'], [2001, 'khủng hoảng corralito, vỡ nợ', 2, 'grief'], [2013, 'Hồng y Bergoglio thành Giáo hoàng Phanxicô', 1, 'joy'],
    [2022, 'vô địch World Cup lần ba', 2, 'joy'], [2023, 'Javier Milei đắc cử']]);
  ev('CO', [[1948, 'Jorge Eliécer Gaitán bị ám sát, thời kỳ La Violencia', 2, 'grief'], [1964, 'du kích FARC ra đời'], [1985, 'vây chiếm Tòa án Tối cao; núi lửa vùi lấp Armero', 2, 'grief'], [1989, 'ứng viên Galán bị ám sát'], [1993, 'Pablo Escobar bị bắn chết'], [2016, 'hòa ước với FARC', 2], [2022, 'Gustavo Petro đắc cử']]);
  reg('CO', [[['Medellín'], 1980, 1995, 'thành phố của Escobar', 'Băng Medellín, xe bom, sát thủ trẻ đi xe máy'], [['Medellín'], 2005, 2025, 'thành phố đổi mới', 'Cáp treo, thư viện công cộng tới các khu đồi']]);
  ev('PE', [[1980, 'Sendero Luminoso bắt đầu đấu tranh vũ trang', 2, 'grief'], [1990, 'Alberto Fujimori đắc cử'], [1992, 'Fujimori đóng cửa quốc hội; bắt thủ lĩnh Sendero'], [1997, 'giải cứu con tin ở dinh đại sứ Nhật'], [2007, 'động đất Pisco'], [2022, 'Pedro Castillo bị phế truất, biểu tình']]);
  ev('VE', [[1914, 'phát hiện mỏ dầu lớn'], [1958, 'lật đổ Pérez Jiménez'], [1989, 'bạo loạn Caracazo', 2, 'grief'], [1992, 'Hugo Chávez đảo chính thất bại'], [1998, 'Chávez đắc cử', 2], [2002, 'đảo chính hụt'], [2013, 'Chávez qua đời, Maduro lên thay'], [2016, 'thiếu đói và siêu lạm phát', 2, 'grief'], [2019, 'mất điện toàn quốc; khủng hoảng hai tổng thống'], [2024, 'tranh chấp kết quả bầu cử']]);
  ev('CL', [[1906, 'động đất Valparaíso'], [1938, 'Mặt trận Bình dân thắng cử'], [1960, 'động đất Valdivia mạnh nhất lịch sử', 2, 'grief'], [1970, 'Salvador Allende đắc cử'], [1973, 'đảo chính của Pinochet', 2, 'grief'], [1988, 'trưng cầu nói không với Pinochet'], [2010, 'động đất 8,8 độ; giải cứu 33 thợ mỏ', 1, ''], [2019, 'bùng nổ xã hội'], [2022, 'Gabriel Boric nhậm chức']]);
  ev('CA', [[1914, 'tham chiến cùng Anh'], [1917, 'nổ tàu ở Halifax', 1, 'grief'], [1931, 'Quy chế Westminster'], [1949, 'Newfoundland gia nhập'], [1965, 'quốc kỳ lá phong'], [1967, 'kỷ niệm 100 năm, Expo 67 ở Montréal'], [1970, 'khủng hoảng tháng Mười ở Québec'], [1980, 'trưng cầu độc lập Québec lần đầu'], [1982, 'hiến pháp và Hiến chương Quyền'],
    [1995, 'trưng cầu độc lập Québec suýt thắng'], [2005, 'hợp pháp hóa hôn nhân đồng giới'], [2015, 'Justin Trudeau làm thủ tướng'], [2016, 'cháy rừng Fort McMurray'], [2018, 'hợp pháp hóa cần sa'], [2021, 'phát hiện mộ ở các trường nội trú'], [2023, 'mùa cháy rừng tệ nhất lịch sử'], [2025, 'Mark Carney làm thủ tướng; căng thẳng thuế quan với Mỹ']]);
  reg('CA', [[['Montréal', 'Québec'], 1960, 1980, 'Cách mạng Thầm lặng ở Québec', 'Nhà nước thay Giáo hội quản lý trường học, bệnh viện; tiếng Pháp được đề cao']]);
  rev('CA', [[1976, ['Montréal'], 'Thế vận hội mùa hè', 1, 'joy'], [1988, ['Calgary'], 'Thế vận hội mùa đông', 1, 'joy'], [2010, ['Vancouver'], 'Thế vận hội mùa đông', 1, 'joy'], [2013, ['Québec'], 'tàu chở dầu trật bánh ở Lac-Mégantic', 1, 'grief']]);

  ev('CU', [[1902, 'Cuba độc lập dưới ảnh hưởng của Mỹ'], [1933, 'cách mạng lật đổ Machado'], [1952, 'Batista đảo chính'], [1959, 'Cách mạng Cuba thắng lợi', 2], [1961, 'sự kiện Vịnh Con Lợn'], [1980, 'cuộc di tản Mariel'], [1991, 'Thời kỳ Đặc biệt sau khi Liên Xô tan rã', 2, 'grief'], [2016, 'Fidel Castro qua đời'], [2021, 'biểu tình ngày 11/7'], [2024, 'mất điện toàn quốc']]);
  ev('GT', [[1954, 'đảo chính lật đổ Árbenz'], [1976, 'động đất lớn', 1, 'grief'], [1996, 'hiệp định hòa bình chấm dứt nội chiến']]);
  ev('HT', [[1915, 'Mỹ chiếm đóng'], [1957, 'François Duvalier nắm quyền'], [1986, 'Baby Doc bỏ chạy'], [2010, 'động đất Port-au-Prince', 2, 'grief'], [2021, 'Tổng thống Moïse bị ám sát']]);
  ev('DO', [[1930, 'Trujillo nắm quyền'], [1961, 'Trujillo bị ám sát'], [1965, 'nội chiến, Mỹ can thiệp']]);
  ev('EC', [[2007, 'Rafael Correa nhậm chức'], [2016, 'động đất ven biển', 1, 'grief'], [2024, 'tình trạng xung đột vũ trang với băng đảng']]);
  ev('BO', [[1952, 'cách mạng quốc hữu hóa mỏ thiếc'], [2006, 'Evo Morales làm tổng thống bản địa đầu tiên'], [2019, 'khủng hoảng sau bầu cử, Morales rời nước']]);
  ev('NI', [[1979, 'cách mạng Sandinista'], [1990, 'Violeta Chamorro đắc cử'], [2018, 'biểu tình bị đàn áp']]);
  ev('SV', [[1932, 'thảm sát La Matanza'], [1980, 'Tổng giám mục Romero bị sát hại; nội chiến', 2, 'grief'], [1992, 'hiệp định hòa bình'], [2022, 'tình trạng ngoại lệ trấn áp băng đảng']]);
  ev('HN', [[1998, 'bão Mitch tàn phá', 2, 'grief'], [2009, 'đảo chính lật đổ Zelaya']]);
  ev('PA', [[1914, 'kênh đào Panama khánh thành', 2], [1989, 'Mỹ tấn công lật đổ Noriega'], [1999, 'tiếp quản kênh đào', 2, 'joy']]);
  ev('UY', [[1930, 'đăng cai và vô địch World Cup đầu tiên', 1, 'joy'], [1973, 'đảo chính quân sự'], [1985, 'trở lại dân chủ']]);
  ev('PY', [[1932, 'chiến tranh Chaco'], [1954, 'Stroessner nắm quyền'], [1989, 'Stroessner bị lật đổ']]);
  ev('JM', [[1962, 'Jamaica độc lập'], [1988, 'bão Gilbert']]);
  ev('PR', [[2017, 'bão Maria tàn phá', 2, 'grief']]);
})(globalThis.G);
