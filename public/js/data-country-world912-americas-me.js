/* §13 lô 4 — châu Mỹ (trừ Hoa Kỳ đã có) và Trung Đông. Các nước Caribe nói tiếng Anh dùng kỳ thi CXC (CSEC/CAPE).
   Số liệu luật là mốc đọc 2026; lộ trình giảm giờ làm đang diễn ra ở một số nước được ghi là lộ trình, không phải mốc đã xong. */
(function (G) {
  'use strict';
  var A = G.E.COUNTRY_WORLD912.add;
  function cxc(college) { return [['CSEC và CAPE (CXC)', 'Kỳ thi khu vực Caribe ở cuối trung học và dự bị đại học.'], ['Đào tạo kỹ thuật', 'Chứng chỉ nghề CVQ/TVET tại ' + college + '.'], ['Đại học', 'Học tại ' + college + ', UWI hoặc nước ngoài; có học bổng hạn chế.']]; }
  var CXC = 'CAPE (kỳ thi Caribe CXC)';
  A('AG', {
    e: cxc('Antigua State College'), x: CXC,
    f: [['carnival', 'Antigua Carnival', 'Cuối tháng 7–đầu tháng 8', 'variable', 'xem diễu hành J’ouvert và nhạc soca'], ['independence_day', 'Ngày Độc lập', '1/11', 'fixed', 'tham gia hoạt động công cộng', 1981], ['sailing_week', 'Antigua Sailing Week', 'Cuối tháng 4', 'variable', 'xem đua thuyền buồm']],
    m: [['Giấy phép kết hôn', 'Xin giấy phép tại Bộ Tư pháp.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ nhà thờ hoặc dân sự', 'Cả hai được công nhận.']],
    d: ['Fungee và pepperpot', 'Ducana', 'Saltfish', 'Dứa đen Antigua', 'Conch water'],
    w: [['Antigua and Barbuda Labour Code', 'Văn bản chính.'], ['Giờ làm', 'Mốc tham chiếu: 40 giờ/tuần.'], ['Social Security', 'Quỹ An sinh Xã hội.'], ['Du lịch', 'Nhiều việc làm theo mùa du lịch.'], ['Lương tối thiểu', 'Có mức tối thiểu.']]
  });
  A('AR', {
    e: [['Secundario', 'Không có kỳ thi quốc gia chung; đại học công phần lớn tuyển mở.'], ['Escuelas técnicas', 'Trung học kỹ thuật và viện đào tạo.'], ['Đại học công miễn học phí', 'Một số trường có năm dự bị như CBC của UBA.']],
    f: [['carnaval', 'Carnaval (Gualeguaychú)', 'Tháng 1–2', 'variable', 'xem diễu hành'], ['independence_day', 'Ngày Độc lập', '9/7', 'fixed', 'ăn locro cùng gia đình', 1816], ['revolucion_mayo', 'Revolución de Mayo', '25/5', 'fixed', 'tham gia lễ ở trường']],
    m: [['Đăng ký dân sự', 'Kết hôn tại Registro Civil.'], ['Hôn nhân bình đẳng', 'Từ 2010, hai người cùng giới có thể kết hôn.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Asado', 'Empanadas', 'Locro', 'Milanesa', 'Alfajores'],
    w: [['Ley de Contrato de Trabajo', 'Luật 20.744 và thỏa ước ngành.'], ['Giờ làm', 'Mốc luật: 8 giờ/ngày, 48 giờ/tuần.'], ['Phép năm', 'Mốc: 14 ngày theo lịch, tăng theo thâm niên.'], ['Aguinaldo', 'Lương tháng 13 chia hai kỳ.'], ['Lạm phát', 'Lạm phát cao làm lương cần điều chỉnh thường xuyên.']]
  });
  A('BS', {
    e: [['BGCSE', 'Kỳ thi cuối trung học Bahamas.'], ['BTVI', 'Viện kỹ thuật và nghề.'], ['University of The Bahamas', 'Đại học quốc gia.']],
    x: 'BGCSE (Bahamas)',
    f: [['junkanoo', 'Junkanoo', '26/12 và 1/1', 'fixed', 'xem diễu hành trang phục và trống'], ['independence_day', 'Ngày Độc lập', '10/7', 'fixed', 'tham gia hoạt động công cộng', 1973], ['emancipation_day', 'Emancipation Day', 'Thứ Hai đầu tháng 8', 'variable', 'tham gia tưởng niệm']],
    m: [['Giấy phép kết hôn', 'Xin giấy phép tại Văn phòng Hộ tịch.'], ['Độ tuổi 18', 'Mốc luật: 18 (dưới 18 cần đồng ý).'], ['Lễ nhà thờ', 'Phổ biến nhưng tùy chọn.']],
    d: ['Conch salad', 'Cracked conch', 'Peas n’ rice', 'Guava duff', 'Johnny cake'],
    w: [['Employment Act 2001', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['NIB', 'Bảo hiểm Quốc gia.'], ['Du lịch', 'Ngành du lịch chiếm phần lớn việc làm.'], ['Lương tối thiểu', 'Có mức tối thiểu.']]
  });
  A('BB', {
    e: cxc('Barbados Community College'), x: CXC,
    f: [['crop_over', 'Crop Over', 'Tháng 7–Thứ Hai đầu tháng 8 (Grand Kadooment)', 'variable', 'xem diễu hành và nhạc soca'], ['independence_day', 'Ngày Độc lập', '30/11', 'fixed', 'tham gia hoạt động công cộng', 1966], ['errol_barrow_day', 'Errol Barrow Day', '21/1', 'fixed', 'tìm hiểu lịch sử']],
    m: [['Giấy phép kết hôn', 'Xin giấy phép tại văn phòng chính phủ.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ dân sự hoặc nhà thờ', 'Cả hai được công nhận.']],
    d: ['Cou-cou và cá chuồn', 'Macaroni pie', 'Fish cakes', 'Pudding and souse', 'Sốt ớt Bajan'],
    w: [['Employment Rights Act 2012', 'Văn bản chính.'], ['Giờ làm', 'Mốc tham chiếu: 40 giờ/tuần.'], ['NIS', 'Bảo hiểm Quốc gia.'], ['Lương tối thiểu quốc gia', 'Có mức tối thiểu.'], ['Du lịch', 'Nhiều việc làm trong du lịch.']]
  });
  A('BZ', {
    e: cxc('University of Belize'), x: CXC,
    f: [['garifuna_day', 'Garifuna Settlement Day', '19/11', 'fixed', 'xem tái hiện cuộc đổ bộ ở Dangriga'], ['independence_day', 'Ngày Độc lập', '21/9', 'fixed', 'tham gia hoạt động công cộng', 1981], ['st_georges_caye', 'St. George’s Caye Day', '10/9', 'fixed', 'xem diễu hành']],
    m: [['Giấy phép kết hôn', 'Xin tại Văn phòng Hộ tịch.'], ['Độ tuổi 18', 'Mốc luật: 18 (16–18 cần đồng ý).'], ['Lễ dân sự hoặc nhà thờ', 'Cả hai được công nhận.']],
    d: ['Rice and beans', 'Stew chicken', 'Hudut', 'Fry jacks', 'Garnaches'],
    w: [['Labour Act', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 45 giờ/tuần.'], ['Social Security Board', 'Quỹ An sinh Xã hội.'], ['Lương tối thiểu', 'Có mức tối thiểu.'], ['Du lịch và nông nghiệp', 'Hai ngành chính.']]
  });
  A('BO', {
    e: [['Bachillerato', 'Tốt nghiệp trung học; đại học có kỳ thi hoặc khóa dự bị riêng.'], ['Institutos técnicos', 'Viện kỹ thuật.'], ['Đại học công', 'UMSA, UMSS và trường khác.']],
    f: [['carnaval_oruro', 'Carnaval de Oruro', 'Trước Mùa Chay', 'variable', 'xem điệu múa diablada'], ['alasitas', 'Alasitas', '24/1 (La Paz)', 'fixed', 'mua đồ thu nhỏ cầu may'], ['independence_day', 'Ngày Độc lập', '6/8', 'fixed', 'tham gia hoạt động công cộng', 1825]],
    m: [['Đăng ký dân sự', 'Kết hôn tại SERECI.'], ['Unión libre', 'Chung sống tự do được công nhận có điều kiện.'], ['Độ tuổi 18', 'Mốc luật: 18 (16 có đồng ý).']],
    d: ['Salteñas', 'Silpancho', 'Sajta de pollo', 'Api con pastel', 'Anticucho'],
    w: [['Ley General del Trabajo', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['Aguinaldo', 'Lương tháng 13.'], ['Phi chính thức', 'Phần lớn việc làm phi chính thức.'], ['Hưu trí', 'Hệ thống hưu trí công.']]
  });
  A('BR', {
    e: [['Ensino médio và ENEM', 'ENEM dùng cho SISU và nhiều trường.'], ['Ensino técnico (SENAI, Institutos Federais)', 'Trung học kỹ thuật.'], ['Đại học công miễn học phí', 'Tuyển qua SISU, có hạn ngạch.']],
    x: 'ENEM (Brazil)',
    f: [['carnaval', 'Carnaval', 'Trước Mùa Chay', 'variable', 'xem diễu hành hoặc theo bloco đường phố'], ['festa_junina', 'Festa Junina', 'Tháng 6', 'variable', 'mặc trang phục quê, nhảy quadrilha'], ['independence_day', 'Ngày Độc lập', '7/9', 'fixed', 'xem diễu hành', 1822]],
    m: [['Đăng ký dân sự', 'Kết hôn tại cartório.'], ['Hôn nhân bình đẳng', 'Từ 2013, hai người cùng giới có thể kết hôn.'], ['União estável', 'Chung sống ổn định được công nhận.']],
    d: ['Feijoada', 'Pão de queijo', 'Moqueca', 'Coxinha', 'Brigadeiro'],
    w: [['CLT', 'Bộ luật Lao động hợp nhất.'], ['Giờ làm', 'Mốc luật: 44 giờ/tuần.'], ['Phép năm', 'Mốc luật: 30 ngày.'], ['13º salário và FGTS', 'Lương tháng 13 và quỹ bảo đảm.'], ['INSS', 'Bảo hiểm xã hội.']]
  });
  A('CA', {
    e: [['Trung học theo tỉnh bang', 'Không có kỳ thi quốc gia; mỗi tỉnh có yêu cầu tốt nghiệp riêng.'], ['College và học nghề (Red Seal)', 'College và học nghề; chứng nhận Red Seal liên tỉnh.'], ['Đại học', 'Có khoản vay sinh viên liên bang và tỉnh.']],
    f: [['canada_day', 'Canada Day', '1/7', 'fixed', 'xem pháo hoa', 1867], ['truth_reconciliation', 'Ngày Sự thật và Hòa giải', '30/9', 'fixed', 'mặc áo cam và tìm hiểu lịch sử trường nội trú'], ['thanksgiving', 'Thanksgiving', 'Thứ Hai thứ hai tháng 10', 'variable', 'ăn bữa tối gia đình']],
    m: [['Giấy phép theo tỉnh', 'Mỗi tỉnh cấp giấy phép kết hôn.'], ['Hôn nhân bình đẳng', 'Từ 2005, hai người cùng giới có thể kết hôn.'], ['Độ tuổi tối thiểu', 'Luật liên bang: không dưới 16; tỉnh có quy định đồng ý.']],
    d: ['Poutine', 'Butter tarts', 'Tourtière', 'Nanaimo bar', 'Bannock'],
    w: [['Luật tiêu chuẩn việc làm tỉnh', 'Phần lớn người lao động theo luật tỉnh; một số ngành theo Canada Labour Code.'], ['Giờ làm', 'Ngưỡng làm thêm thường là 40 hoặc 44 giờ tùy tỉnh.'], ['Phép năm', 'Mốc thường gặp: 2 tuần, tăng theo thâm niên.'], ['CPP/QPP', 'Hưu trí công.'], ['EI', 'Bảo hiểm việc làm.']]
  });
  A('CL', {
    e: [['Enseñanza media và PAES', 'Kỳ thi PAES cho tuyển sinh đại học.'], ['Liceos técnico-profesionales, CFT, IP', 'Trung học kỹ thuật và trung tâm đào tạo.'], ['Đại học', 'Có chính sách miễn học phí theo thu nhập (gratuidad).']],
    x: 'PAES (Chile)',
    f: [['fiestas_patrias', 'Fiestas Patrias', '18–19/9', 'fixed', 'đến fondas và nhảy cueca'], ['we_tripantu', 'We Tripantu', 'Quanh 21–24/6', 'solar', 'tìm hiểu năm mới Mapuche'], ['la_tirana', 'Fiesta de La Tirana', '16/7', 'fixed', 'xem điệu múa tôn giáo']],
    m: [['Đăng ký dân sự', 'Kết hôn tại Registro Civil.'], ['Hôn nhân bình đẳng', 'Từ 2022, hai người cùng giới có thể kết hôn.'], ['Acuerdo de Unión Civil', 'Có kết hợp dân sự.']],
    d: ['Empanadas de pino', 'Pastel de choclo', 'Cazuela', 'Completo', 'Sopaipillas'],
    w: [['Código del Trabajo', 'Văn bản chính.'], ['Luật 40 giờ', 'Lộ trình giảm từ 45 giờ: 44 (2024), 42 (2026), 40 (2028).'], ['Phép năm', 'Mốc luật: 15 ngày làm việc.'], ['AFP', 'Hưu trí tài khoản cá nhân, có cải cách 2025.'], ['Lương tối thiểu', 'Mức tối thiểu điều chỉnh định kỳ.']]
  });
  A('CO', {
    e: [['Saber 11 (ICFES)', 'Kỳ thi quốc gia cuối trung học.'], ['SENA', 'Đào tạo nghề và kỹ thuật miễn phí.'], ['Đại học', 'Có chương trình hỗ trợ học phí trường công.']],
    x: 'Saber 11 (Colombia)',
    f: [['carnaval_barranquilla', 'Carnaval de Barranquilla', 'Trước Mùa Chay', 'variable', 'xem diễu hành'], ['feria_flores', 'Feria de las Flores (Medellín)', 'Tháng 8', 'variable', 'xem silleteros'], ['independence_day', 'Ngày Độc lập', '20/7', 'fixed', 'tham gia hoạt động công cộng', 1810]],
    m: [['Dân sự hoặc tôn giáo có hiệu lực', 'Lễ tôn giáo có thể có hiệu lực dân sự khi đăng ký.'], ['Hôn nhân bình đẳng', 'Từ 2016, hai người cùng giới có thể kết hôn.'], ['Độ tuổi 18', 'Mốc luật: 18 từ 2025.']],
    d: ['Bandeja paisa', 'Ajiaco', 'Arepa', 'Sancocho', 'Empanadas'],
    w: [['Código Sustantivo del Trabajo', 'Văn bản chính, có cải cách 2025.'], ['Lộ trình 42 giờ', 'Giảm dần tới 42 giờ/tuần vào giữa 2026.'], ['Phép năm', 'Mốc luật: 15 ngày làm việc.'], ['Prima de servicios', 'Thưởng hai lần mỗi năm.'], ['Lương tối thiểu', 'Điều chỉnh hằng năm.']]
  });
  A('CR', {
    e: [['Educación diversificada', 'Tốt nghiệp trung học; mỗi đại học công có kỳ thi riêng.'], ['INA', 'Viện Học nghề Quốc gia.'], ['Đại học công', 'UCR, TEC và trường khác.']],
    f: [['independence_day', 'Ngày Độc lập', '15/9 (đêm 14/9 rước đèn lồng)', 'fixed', 'xem học sinh rước faroles', 1821], ['virgen_angeles', 'Romería Virgen de los Ángeles', '2/8', 'fixed', 'hành hương tới Cartago khi phù hợp đức tin'], ['fiestas_palmares', 'Fiestas de Palmares', 'Tháng 1', 'variable', 'đi hội chợ']],
    m: [['Dân sự hoặc Công giáo', 'Cả hai có hiệu lực.'], ['Hôn nhân bình đẳng', 'Từ 2020, hai người cùng giới có thể kết hôn.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Gallo pinto', 'Casado', 'Olla de carne', 'Chifrijo', 'Tres leches'],
    w: [['Código de Trabajo', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['Phép năm', 'Mốc luật: 2 tuần sau 50 tuần làm.'], ['Aguinaldo', 'Lương tháng 13.'], ['CCSS', 'Quỹ An sinh Xã hội.']]
  });
  A('CU', {
    e: [['Preuniversitario và pruebas de ingreso', 'Kỳ thi đầu vào đại học.'], ['Politécnicos', 'Trường kỹ thuật.'], ['Đại học công miễn phí', 'Đại học La Habana và trường khác.']],
    x: 'Pruebas de ingreso (Cuba)',
    f: [['carnaval_santiago', 'Carnaval de Santiago', 'Tháng 7', 'variable', 'xem comparsas'], ['triunfo_revolucion', 'Ngày Cách mạng Thành công', '1/1', 'fixed', 'tham gia hoạt động công cộng', 1959], ['parrandas', 'Parrandas de Remedios', '24/12', 'fixed', 'xem pháo và xe hoa']],
    m: [['Código de las Familias 2022', 'Luật Gia đình mới; cho phép hôn nhân cùng giới.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Đăng ký tại notaría', 'Đăng ký với công chứng hoặc hộ tịch.']],
    d: ['Ropa vieja', 'Moros y cristianos', 'Lechón asado', 'Yuca con mojo', 'Tostones'],
    w: [['Código de Trabajo 2014', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 44 giờ/tuần.'], ['Phép năm', 'Một tháng có lương sau 11 tháng làm.'], ['Khu vực tư nhân (MIPYME)', 'Doanh nghiệp nhỏ tư nhân được phép từ 2021.'], ['Khủng hoảng kinh tế', 'Thiếu hụt và mất điện ảnh hưởng việc làm.']]
  });
  A('DM', {
    e: cxc('Dominica State College'), x: CXC,
    f: [['creole_festival', 'World Creole Music Festival', 'Tháng 10', 'variable', 'nghe nhạc Creole'], ['independence_day', 'Ngày Độc lập', '3/11', 'fixed', 'mặc trang phục wob dwiyet', 1978], ['mas_domnik', 'Mas Domnik (Carnival)', 'Trước Mùa Chay', 'variable', 'xem diễu hành']],
    m: [['Giấy phép kết hôn', 'Xin tại cơ quan chính phủ.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ nhà thờ', 'Phổ biến nhưng tùy chọn.']],
    d: ['Callaloo soup', 'Bakes và saltfish', 'Titiri accra', 'Sancoche', 'Bánh dừa'],
    w: [['Labour Standards Act', 'Văn bản chính.'], ['Dominica Social Security', 'Quỹ An sinh Xã hội.'], ['Nông nghiệp', 'Chuối và nông sản quan trọng.'], ['Thiên tai', 'Bão ảnh hưởng nơi làm việc.'], ['Nguồn', 'Không có trang quốc gia ILO; dùng cổng chính phủ Dominica.']]
  });
  A('DO', {
    e: [['Bachillerato và Pruebas Nacionales', 'Kỳ thi quốc gia cuối trung học.'], ['INFOTEP', 'Viện đào tạo nghề.'], ['Đại học', 'UASD và trường tư.']],
    x: 'Pruebas Nacionales (Cộng hòa Dominica)',
    f: [['carnaval', 'Carnaval', 'Tháng 2', 'variable', 'xem diablos cojuelos'], ['independence_day', 'Ngày Độc lập', '27/2', 'fixed', 'tham gia hoạt động công cộng', 1844], ['restauracion', 'Ngày Khôi phục', '16/8', 'fixed', 'tham gia hoạt động công cộng', 1863]],
    m: [['Dân sự hoặc nhà thờ', 'Cả hai có hiệu lực khi đăng ký.'], ['Độ tuổi 18', 'Mốc luật: 18 từ 2021, không ngoại lệ.'], ['Đăng ký', 'Đăng ký tại văn phòng hộ tịch.']],
    d: ['La bandera', 'Mangú', 'Sancocho', 'Mofongo', 'Habichuelas con dulce'],
    w: [['Código de Trabajo', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 44 giờ/tuần.'], ['Phép năm', 'Mốc luật: 14 ngày sau một năm.'], ['Salario de Navidad', 'Lương tháng 13.'], ['TSS', 'Hệ thống an sinh xã hội.']]
  });
  A('EC', {
    e: [['Bachillerato', 'Tuyển sinh đại học công do từng trường và hệ thống quy định.'], ['Institutos técnicos y tecnológicos', 'Đào tạo kỹ thuật.'], ['Đại học công miễn học phí', 'Có kỳ đánh giá đầu vào.']],
    f: [['inti_raymi', 'Inti Raymi', 'Quanh 21/6', 'solar', 'tham gia lễ hội Kichwa ở Otavalo'], ['difuntos', 'Día de los Difuntos', '2/11', 'fixed', 'uống colada morada, ăn guaguas de pan'], ['primer_grito', 'Primer Grito de Independencia', '10/8', 'fixed', 'tham gia hoạt động công cộng', 1809]],
    m: [['Đăng ký dân sự', 'Kết hôn tại Registro Civil.'], ['Hôn nhân bình đẳng', 'Từ 2019, hai người cùng giới có thể kết hôn.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Encebollado', 'Llapingachos', 'Ceviche Ecuador', 'Fanesca', 'Hornado'],
    w: [['Código del Trabajo', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 15 ngày.'], ['Décimo tercero và cuarto', 'Hai khoản lương bổ sung.'], ['IESS', 'Viện An sinh Xã hội.']]
  });
  A('SV', {
    e: [['Bachillerato và AVANZO', 'Bài đánh giá AVANZO cuối trung học.'], ['ITCA-FEPADE', 'Trường kỹ thuật.'], ['Universidad de El Salvador', 'Đại học công.']],
    x: 'AVANZO (El Salvador)',
    f: [['fiestas_agostinas', 'Fiestas Agostinas', 'Đầu tháng 8', 'variable', 'xem lễ rước La Bajada'], ['independence_day', 'Ngày Độc lập', '15/9', 'fixed', 'xem diễu hành', 1821], ['dia_cruz', 'Día de la Cruz', '3/5', 'fixed', 'trang trí cây thánh giá bằng trái cây']],
    m: [['Đăng ký dân sự', 'Kết hôn tại tòa thị chính hoặc công chứng.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ nhà thờ', 'Tùy chọn.']],
    d: ['Pupusas', 'Yuca frita', 'Panes con pollo', 'Sopa de pata', 'Quesadilla salvadoreña'],
    w: [['Código de Trabajo', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 44 giờ/tuần.'], ['Phép năm', 'Mốc luật: 15 ngày.'], ['ISSS và AFP', 'Bảo hiểm xã hội và hưu trí.'], ['Kiều hối', 'Nhiều gia đình dựa vào kiều hối.']]
  });
  A('GD', {
    e: cxc('T.A. Marryshow Community College'), x: CXC,
    f: [['spicemas', 'Spicemas', 'Tháng 8', 'variable', 'xem diễu hành Jab Jab'], ['independence_day', 'Ngày Độc lập', '7/2', 'fixed', 'tham gia hoạt động công cộng', 1974], ['fishermans_birthday', 'Fisherman’s Birthday', '29/6', 'fixed', 'xem đua thuyền ở Gouyave']],
    m: [['Giấy phép kết hôn', 'Xin tại văn phòng Thủ tướng.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ nhà thờ', 'Phổ biến.']],
    d: ['Oil down', 'Callaloo soup', 'Kem nhục đậu khấu', 'Roti', 'Lambi'],
    w: [['Employment Act', 'Văn bản chính.'], ['NIS', 'Bảo hiểm Quốc gia.'], ['Lương tối thiểu', 'Có mức tối thiểu theo ngành.'], ['Du lịch', 'Nhiều việc làm trong du lịch.'], ['Gia vị', 'Ngành nhục đậu khấu quan trọng.']]
  });
  A('GT', {
    e: [['Diversificado', 'Tốt nghiệp trung học.'], ['INTECAP', 'Viện đào tạo kỹ thuật.'], ['USAC', 'Đại học công có kỳ thi đầu vào.']],
    f: [['semana_santa', 'Semana Santa (Antigua)', 'Tuần trước Phục sinh', 'variable', 'xem thảm hoa alfombras'], ['barriletes', 'Barriletes gigantes (Sumpango)', '1/11', 'fixed', 'xem diều khổng lồ'], ['independence_day', 'Ngày Độc lập', '15/9', 'fixed', 'xem rước đuốc', 1821]],
    m: [['Đăng ký dân sự', 'Kết hôn tại tòa thị chính hoặc công chứng.'], ['Độ tuổi 18', 'Mốc luật: 18 từ 2017.'], ['Lễ cộng đồng Maya', 'Một số cộng đồng có nghi thức riêng.']],
    d: ['Pepián', 'Jocón', 'Kak’ik', 'Tamales', 'Rellenitos'],
    w: [['Código de Trabajo', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 44 giờ/tuần ca ngày.'], ['Phép năm', 'Mốc luật: 15 ngày làm việc.'], ['Aguinaldo và Bono 14', 'Hai khoản thưởng hằng năm.'], ['IGSS', 'Viện An sinh Xã hội.']]
  });
  A('GY', {
    e: cxc('Government Technical Institute'), x: CXC,
    f: [['mashramani', 'Mashramani', '23/2', 'fixed', 'xem diễu hành'], ['phagwah', 'Phagwah', 'Khoảng tháng 3', 'lunar', 'chơi bột màu'], ['diwali', 'Diwali', 'Khoảng tháng 10–11', 'lunar', 'xem diễu hành đèn']],
    m: [['Đăng ký hoặc lễ tôn giáo', 'Có hôn nhân dân sự và tôn giáo được đăng ký.'], ['Độ tuổi 18', 'Mốc luật: 18 (16 có đồng ý).'], ['Lễ Hindu, Hồi giáo, Kitô', 'Nhiều cộng đồng tôn giáo.']],
    d: ['Pepperpot', 'Cook-up rice', 'Metemgee', 'Roti và cà ri', 'Chow mein'],
    w: [['Labour Act', 'Văn bản chính.'], ['NIS', 'Bảo hiểm Quốc gia.'], ['Dầu khí', 'Ngành dầu khí tăng trưởng nhanh.'], ['Lương tối thiểu', 'Có mức tối thiểu.'], ['Giờ làm', 'Mốc tham chiếu: 40 giờ/tuần.']]
  });
  A('HT', {
    e: [['Baccalauréat', 'Kỳ thi bac quốc gia; bất ổn an ninh gây gián đoạn học tập.'], ['Centres de formation', 'Trung tâm đào tạo nghề.'], ['Université d’État', 'Đại học công.']],
    x: 'Baccalauréat (Haiti)',
    f: [['independence_day', 'Ngày Độc lập', '1/1', 'fixed', 'ăn soup joumou', 1804], ['kanaval', 'Kanaval', 'Trước Mùa Chay', 'variable', 'xem diễu hành'], ['fet_gede', 'Fèt Gede', '1–2/11', 'fixed', 'tìm hiểu lễ tưởng nhớ khi được cộng đồng mời']],
    m: [['Đăng ký dân sự', 'Kết hôn trước nhân viên hộ tịch.'], ['Plasaj', 'Chung sống không đăng ký phổ biến.'], ['Độ tuổi', 'Mốc luật: nam 18, nữ 15; game giữ nguyên tắc trưởng thành, tự nguyện.']],
    d: ['Soup joumou', 'Griot', 'Diri ak djon djon', 'Pikliz', 'Pen patat'],
    w: [['Code du travail', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['Bất ổn an ninh', 'Băng nhóm ảnh hưởng đi lại và việc làm.'], ['Lương tối thiểu theo ngành', 'Có mức theo ngành.'], ['Phi chính thức', 'Phần lớn việc làm phi chính thức.']]
  });
  A('HN', {
    e: [['Bachillerato', 'Tốt nghiệp trung học.'], ['INFOP', 'Viện đào tạo nghề.'], ['UNAH', 'Đại học công có bài thi PAA.']],
    f: [['feria_juniana', 'Feria Juniana', 'Tháng 6 (San Pedro Sula)', 'variable', 'đi hội chợ'], ['independence_day', 'Ngày Độc lập', '15/9', 'fixed', 'xem diễu hành', 1821], ['carnaval_ceiba', 'Carnaval de La Ceiba', 'Tháng 5', 'variable', 'xem diễu hành']],
    m: [['Đăng ký dân sự', 'Kết hôn trước cơ quan dân sự.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ nhà thờ', 'Tùy chọn.']],
    d: ['Baleadas', 'Plato típico', 'Sopa de caracol', 'Tamales', 'Pastelitos'],
    w: [['Código del Trabajo', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 44 giờ/tuần.'], ['Phép năm', 'Tăng theo thâm niên.'], ['IHSS', 'Viện An sinh Xã hội.'], ['Maquila', 'Nhiều việc làm ở nhà máy may.']]
  });
  A('JM', {
    e: cxc('HEART/NSTA Trust và UTech'), x: CXC,
    f: [['emancipation_day', 'Emancipation Day', '1/8', 'fixed', 'tham gia tưởng niệm', 1838], ['independence_day', 'Ngày Độc lập', '6/8', 'fixed', 'tham gia hoạt động công cộng', 1962], ['jonkonnu', 'Jonkonnu', 'Mùa Giáng sinh', 'variable', 'xem diễu hành mặt nạ']],
    m: [['Giấy phép kết hôn', 'Xin giấy phép và lễ do người được ủy quyền.'], ['Độ tuổi 18', 'Mốc luật: 18 (16 có đồng ý).'], ['Lễ nhà thờ', 'Phổ biến.']],
    d: ['Ackee and saltfish', 'Jerk chicken', 'Rice and peas', 'Patties', 'Bammy'],
    w: [['Luật lao động Jamaica', 'Nhiều luật về giờ làm, nghỉ phép, chấm dứt.'], ['Giờ làm', 'Mốc tham chiếu: 40 giờ/tuần.'], ['NIS và NHT', 'Bảo hiểm và quỹ nhà ở.'], ['Lương tối thiểu', 'Có mức tối thiểu quốc gia.'], ['Du lịch', 'Nhiều việc làm trong du lịch.']]
  });
  A('MX', {
    e: [['Bachillerato', 'Tuyển sinh đại học qua kỳ thi của từng trường (như UNAM) hoặc EXANI-II.'], ['CONALEP', 'Trung học kỹ thuật.'], ['Đại học công và tư', 'UNAM, IPN và trường khác.']],
    x: 'EXANI-II hoặc kỳ thi của từng đại học (Mexico)',
    f: [['dia_muertos', 'Día de Muertos', '1–2/11', 'fixed', 'dựng bàn thờ ofrenda và ăn pan de muerto'], ['independence_day', 'Ngày Độc lập', '15–16/9', 'fixed', 'nghe tiếng hô Grito', 1810], ['guelaguetza', 'Guelaguetza (Oaxaca)', 'Tháng 7', 'variable', 'xem múa các vùng']],
    m: [['Đăng ký dân sự', 'Kết hôn tại Registro Civil.'], ['Hôn nhân bình đẳng', 'Từ 2022, mọi bang công nhận hôn nhân cùng giới.'], ['Độ tuổi 18', 'Mốc luật: 18 từ 2019.']],
    d: ['Tacos al pastor', 'Mole poblano', 'Pozole', 'Tamales', 'Chiles en nogada'],
    w: [['Ley Federal del Trabajo', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần; đang có lộ trình giảm dần.'], ['Phép năm', 'Mốc luật: 12 ngày năm đầu từ 2023.'], ['Aguinaldo', 'Tối thiểu 15 ngày lương.'], ['IMSS và Infonavit', 'Bảo hiểm xã hội và quỹ nhà ở.']]
  });
  A('NI', {
    e: [['Bachillerato', 'Tốt nghiệp trung học.'], ['INATEC', 'Đào tạo kỹ thuật.'], ['UNAN', 'Đại học công.']],
    f: [['griteria', 'La Gritería', '7/12', 'fixed', 'hô "¿Quién causa tanta alegría?" và nhận quà nhỏ'], ['independence_day', 'Ngày Độc lập', '15/9', 'fixed', 'xem diễu hành', 1821], ['santo_domingo', 'Fiestas de Santo Domingo', 'Tháng 8 (Managua)', 'variable', 'xem rước']],
    m: [['Đăng ký dân sự', 'Kết hôn trước cơ quan dân sự.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ nhà thờ', 'Tùy chọn.']],
    d: ['Gallo pinto', 'Nacatamal', 'Vigorón', 'Indio viejo', 'Quesillo'],
    w: [['Código del Trabajo', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['Phép năm', 'Mốc luật: 30 ngày mỗi năm.'], ['INSS', 'Viện An sinh Xã hội.'], ['Lương tối thiểu theo ngành', 'Có mức theo ngành.']]
  });
  A('PA', {
    e: [['Bachillerato', 'Tốt nghiệp trung học.'], ['INADEH', 'Viện đào tạo nghề.'], ['Universidad de Panamá', 'Đại học công.']],
    f: [['carnaval', 'Carnaval', 'Trước Mùa Chay', 'variable', 'xem diễu hành ở Las Tablas'], ['fiestas_patrias', 'Fiestas Patrias', '3/11', 'fixed', 'xem diễu hành ban nhạc trường', 1903], ['corpus_christi', 'Corpus Christi (Diablos danzantes)', 'Tháng 5–6', 'variable', 'xem điệu múa quỷ']],
    m: [['Đăng ký dân sự', 'Kết hôn tại Registro Civil.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ nhà thờ', 'Tùy chọn.']],
    d: ['Sancocho panameño', 'Arroz con pollo', 'Carimañola', 'Patacones', 'Ropa vieja'],
    w: [['Código de Trabajo', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['Phép năm', 'Mốc luật: 30 ngày sau 11 tháng.'], ['Décimo tercer mes', 'Lương tháng 13 chia ba kỳ.'], ['CSS', 'Quỹ An sinh Xã hội.']]
  });
  A('PY', {
    e: [['Bachillerato', 'Tốt nghiệp trung học.'], ['SNPP', 'Đào tạo nghề.'], ['UNA', 'Đại học công.']],
    f: [['san_juan', 'San Juan Ara', '24/6', 'fixed', 'chơi trò dân gian và ăn món ngô'], ['independence_day', 'Ngày Độc lập', '14–15/5', 'fixed', 'tham gia hoạt động công cộng', 1811], ['caacupe', 'Lễ Đức Mẹ Caacupé', '8/12', 'fixed', 'hành hương khi phù hợp đức tin']],
    m: [['Đăng ký dân sự', 'Kết hôn tại Registro Civil.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ nhà thờ', 'Tùy chọn.']],
    d: ['Sopa paraguaya', 'Chipa', 'Mbejú', 'Vorí vorí', 'Tereré'],
    w: [['Código del Trabajo', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['Phép năm', 'Mốc luật: 12 ngày sau một năm.'], ['Aguinaldo', 'Lương tháng 13.'], ['IPS', 'Viện Dự phòng Xã hội.']]
  });
  A('PE', {
    e: [['Secundaria', 'Không có kỳ thi quốc gia chung; mỗi đại học có kỳ thi riêng.'], ['Institutos (SENATI, SENCICO)', 'Đào tạo kỹ thuật.'], ['Đại học', 'Đại học công miễn học phí, kỳ thi cạnh tranh.']],
    f: [['inti_raymi', 'Inti Raymi', '24/6 (Cusco)', 'fixed', 'xem tái hiện lễ Mặt Trời'], ['fiestas_patrias', 'Fiestas Patrias', '28–29/7', 'fixed', 'xem diễu hành', 1821], ['candelaria', 'Virgen de la Candelaria (Puno)', 'Tháng 2', 'variable', 'xem điệu múa']],
    m: [['Đăng ký dân sự', 'Kết hôn tại thị chính.'], ['Độ tuổi 18', 'Mốc luật: 18 từ 2023.'], ['Lễ nhà thờ', 'Tùy chọn.']],
    d: ['Ceviche', 'Lomo saltado', 'Ají de gallina', 'Causa limeña', 'Anticuchos'],
    w: [['Chế độ lao động tư nhân', 'Nghị định 728 và luật liên quan.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['Phép năm', 'Mốc luật: 30 ngày.'], ['Gratificaciones và CTS', 'Thưởng tháng 7, tháng 12 và quỹ bù thời gian công tác.'], ['EsSalud và AFP/ONP', 'Y tế và hưu trí.']]
  });
  A('KN', {
    e: cxc('Clarence Fitzroy Bryant College'), x: CXC,
    f: [['sugar_mas', 'Sugar Mas', 'Cuối tháng 12–đầu tháng 1', 'variable', 'xem diễu hành'], ['independence_day', 'Ngày Độc lập', '19/9', 'fixed', 'tham gia hoạt động công cộng', 1983], ['culturama', 'Culturama (Nevis)', 'Cuối tháng 7–tháng 8', 'variable', 'xem biểu diễn văn hóa']],
    m: [['Giấy phép kết hôn', 'Xin giấy phép tại cơ quan chính phủ.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ nhà thờ', 'Phổ biến.']],
    d: ['Saltfish với chuối cay', 'Coconut dumplings', 'Goat water', 'Conkies', 'Black pudding'],
    w: [['Luật lao động', 'Văn bản chính về hợp đồng.'], ['Social Security Board', 'Quỹ An sinh Xã hội.'], ['Du lịch', 'Nhiều việc làm trong du lịch.'], ['Lương tối thiểu', 'Có mức tối thiểu.'], ['Nguồn', 'Không có trang quốc gia ILO; dùng cổng chính phủ.']]
  });
  A('LC', {
    e: cxc('Sir Arthur Lewis Community College'), x: CXC,
    f: [['carnival', 'Saint Lucia Carnival', 'Tháng 7', 'variable', 'xem diễu hành'], ['independence_day', 'Ngày Độc lập', '22/2', 'fixed', 'tham gia hoạt động công cộng', 1979], ['jounen_kweyol', 'Jounen Kwéyòl', 'Chủ nhật cuối tháng 10', 'variable', 'thử món Creole và mặc trang phục truyền thống']],
    m: [['Giấy phép kết hôn', 'Xin giấy phép tại cơ quan hộ tịch.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ nhà thờ', 'Phổ biến.']],
    d: ['Green fig và saltfish', 'Bouyon', 'Accra', 'Cocoa tea', 'Bakes'],
    w: [['Labour Code 2006', 'Văn bản chính.'], ['NIC', 'Quỹ Bảo hiểm Quốc gia.'], ['Giờ làm', 'Mốc tham chiếu: 40 giờ/tuần.'], ['Du lịch', 'Nhiều việc làm trong du lịch.'], ['Lương tối thiểu', 'Có mức tối thiểu.']]
  });
  A('VC', {
    e: cxc('St. Vincent and the Grenadines Community College'), x: CXC,
    f: [['vincy_mas', 'Vincy Mas', 'Cuối tháng 6–tháng 7', 'variable', 'xem diễu hành'], ['independence_day', 'Ngày Độc lập', '27/10', 'fixed', 'tham gia hoạt động công cộng', 1979], ['nine_mornings', 'Nine Mornings', '16–24/12', 'fixed', 'dậy sớm tham gia hoạt động cộng đồng']],
    m: [['Giấy phép kết hôn', 'Xin giấy phép tại cơ quan chính phủ.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ nhà thờ', 'Phổ biến.']],
    d: ['Bánh mì quả nướng và cá jack chiên', 'Callaloo soup', 'Buljol', 'Pelau', 'Coconut tart'],
    w: [['Protection of Employment Act', 'Văn bản chính.'], ['NIS', 'Bảo hiểm Quốc gia.'], ['Nông nghiệp', 'Chuối và mũi tên ăn được.'], ['Du lịch', 'Việc làm ở Grenadines.'], ['Nguồn', 'Không có trang quốc gia ILO; dùng cổng chính phủ.']]
  });
  A('SR', {
    e: [['VWO/HAVO', 'Hệ thống gốc Hà Lan, kỳ thi cuối cấp.'], ['NATIN', 'Học viện kỹ thuật tự nhiên.'], ['Anton de Kom Universiteit', 'Đại học công.']],
    f: [['keti_koti', 'Keti Koti', '1/7', 'fixed', 'tham gia lễ tưởng niệm bãi bỏ nô lệ', 1863], ['independence_day', 'Ngày Độc lập', '25/11', 'fixed', 'tham gia hoạt động công cộng', 1975], ['phagwa', 'Holi Phagwa', 'Khoảng tháng 3', 'lunar', 'chơi bột màu']],
    m: [['Đăng ký dân sự', 'Kết hôn tại văn phòng hộ tịch.'], ['Lễ tôn giáo', 'Lễ Hindu, Hồi giáo, Kitô được đăng ký theo luật.'], ['Độ tuổi', 'Hai người đủ tuổi luật định.']],
    d: ['Roti', 'Pom', 'Moksi alesi', 'Bami', 'Saoto soup'],
    w: [['Luật lao động', 'Có luật về hợp đồng và chấm dứt.'], ['Lương tối thiểu', 'Có mức tối thiểu.'], ['Hưu trí', 'Quỹ hưu trí quốc gia.'], ['Khai mỏ', 'Ngành vàng và dầu quan trọng.'], ['Lạm phát', 'Lạm phát cao ảnh hưởng thu nhập thực.']]
  });
  A('TT', {
    e: cxc('UTT và COSTAATT'), x: CXC,
    f: [['carnival', 'Carnival', 'Thứ Hai–Thứ Ba trước Lễ Tro', 'variable', 'xem diễu hành và nhạc steelpan'], ['diwali', 'Divali', 'Khoảng tháng 10–11', 'lunar', 'thắp đèn deya'], ['emancipation_day', 'Emancipation Day', '1/8', 'fixed', 'tham gia diễu hành', 1838]],
    m: [['Giấy phép hoặc lễ tôn giáo', 'Luật Hôn nhân thống nhất từ 2017.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ nhiều cộng đồng', 'Lễ Hindu, Hồi giáo, Kitô.']],
    d: ['Doubles', 'Roti', 'Pelau', 'Bake and shark', 'Callaloo'],
    w: [['Industrial Relations Act', 'Văn bản chính.'], ['Minimum Wages Act', 'Lương tối thiểu.'], ['NIS', 'Bảo hiểm Quốc gia.'], ['Dầu khí', 'Ngành năng lượng quan trọng.'], ['Giờ làm', 'Mốc tham chiếu: 40 giờ/tuần.']]
  });
  A('UY', {
    e: [['Bachillerato', 'Không có kỳ thi quốc gia; Đại học Cộng hòa tuyển mở.'], ['UTU', 'Giáo dục kỹ thuật – nghề.'], ['Universidad de la República và UTEC', 'Đại học công miễn học phí.']],
    f: [['carnaval', 'Carnaval (40 ngày)', 'Tháng 1–3', 'variable', 'xem murgas và candombe'], ['semana_turismo', 'Semana de Turismo', 'Tuần trước Phục sinh', 'variable', 'đi xem rodeo Criolla'], ['independence_day', 'Ngày Độc lập', '25/8', 'fixed', 'tham gia hoạt động công cộng', 1825]],
    m: [['Đăng ký dân sự', 'Kết hôn tại Registro Civil.'], ['Hôn nhân bình đẳng', 'Từ 2013, hai người cùng giới có thể kết hôn.'], ['Độ tuổi 18', 'Mốc luật: 18 từ 2023.']],
    d: ['Chivito', 'Asado', 'Milanesa', 'Torta frita', 'Dulce de leche'],
    w: [['Luật lao động', 'Nhiều luật và hội đồng lương ba bên.'], ['Giờ làm', 'Mốc luật: 8 giờ/ngày; công nghiệp 48, thương mại 44 giờ/tuần.'], ['Phép năm', 'Mốc luật: 20 ngày.'], ['Aguinaldo', 'Lương tháng 13.'], ['BPS', 'Ngân hàng An sinh Xã hội.']]
  });
  A('VE', {
    e: [['Bachillerato', 'Tốt nghiệp trung học.'], ['INCES', 'Đào tạo nghề.'], ['Đại học', 'Đại học công miễn học phí; nhiều giảng viên đã ra nước ngoài.']],
    f: [['carnaval_callao', 'Carnaval de El Callao', 'Trước Mùa Chay', 'variable', 'xem calypso'], ['diablos_yare', 'Diablos Danzantes de Yare', 'Corpus Christi', 'variable', 'xem điệu múa quỷ'], ['independence_day', 'Ngày Độc lập', '5/7', 'fixed', 'tham gia hoạt động công cộng', 1811]],
    m: [['Đăng ký dân sự', 'Kết hôn tại cơ quan hộ tịch.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ nhà thờ', 'Tùy chọn.']],
    d: ['Arepas', 'Pabellón criollo', 'Hallacas', 'Cachapa', 'Tequeños'],
    w: [['LOTTT 2012', 'Luật Lao động.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Lương bằng phụ cấp', 'Phần lớn thu nhập là phụ cấp không lương.'], ['Siêu lạm phát', 'Lương danh nghĩa mất giá nhanh.'], ['Di cư', 'Hàng triệu người đã ra nước ngoài làm việc.']]
  });
  // Trung Đông
  A('BH', {
    e: [['Chứng chỉ trung học Bahrain', 'Kỳ thi cuối trung học.'], ['Bahrain Polytechnic', 'Đào tạo ứng dụng.'], ['University of Bahrain', 'Đại học công.']],
    f: [['national_day', 'Ngày Quốc khánh', '16–17/12', 'fixed', 'xem pháo hoa'], ['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng'], ['spring_culture', 'Spring of Culture', 'Tháng 2–4', 'variable', 'xem biểu diễn văn hóa']],
    m: [['Luật Gia đình 2017', 'Luật gia đình thống nhất.'], ['Độ tuổi', 'Mốc luật: 16 có ngoại lệ do tòa.'], ['Mahr', 'Được thỏa thuận.']],
    d: ['Machboos', 'Muhammar', 'Harees', 'Halwa Bahrain', 'Gabout'],
    w: [['Luật Lao động 36/2012', 'Văn bản chính khu vực tư.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['Phép năm', 'Mốc luật: 30 ngày.'], ['SIO', 'Tổ chức Bảo hiểm Xã hội.'], ['Lao động nước ngoài', 'Cần giấy phép LMRA.']]
  });
  A('IR', {
    e: [['Konkur', 'Kỳ thi tuyển sinh đại học quốc gia, có cải cách dùng điểm học bạ.'], ['Fanni-Herfei', 'Trung học kỹ thuật – nghề.'], ['Đại học công và Azad', 'Đại học công miễn học phí theo điểm.']],
    x: 'Konkur (Iran)',
    f: [['nowruz', 'Nowruz', '20–21/3', 'fixed', 'bày bàn haft-sin và thăm họ hàng'], ['chaharshanbe_suri', 'Chaharshanbe Suri', 'Tối thứ Ba cuối năm', 'variable', 'nhảy qua lửa nhỏ, chú ý an toàn'], ['yalda', 'Đêm Yalda', '20–21/12', 'fixed', 'đọc thơ Hafez, ăn lựu']],
    m: [['Đăng ký hôn nhân', 'Hôn nhân tôn giáo được đăng ký tại văn phòng công chứng hôn nhân.'], ['Độ tuổi', 'Luật có độ tuổi thấp cho nữ với điều kiện; game giữ nguyên tắc trưởng thành, tự nguyện.'], ['Mehrieh', 'Mahr được ghi trong hợp đồng.']],
    d: ['Chelow kabab', 'Ghormeh sabzi', 'Tahdig', 'Fesenjan', 'Ash reshteh'],
    w: [['Luật Lao động 1990', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 44 giờ/tuần.'], ['Phép năm', 'Mốc luật: một tháng mỗi năm.'], ['Tổ chức An sinh Xã hội', 'Bảo hiểm và hưu trí.'], ['Lạm phát và trừng phạt', 'Ảnh hưởng thu nhập thực.']]
  });
  A('IQ', {
    e: [['Kỳ thi bộ lớp 12', 'Kỳ thi quốc gia lớp 12.'], ['Đào tạo nghề', 'Trường kỹ thuật.'], ['Đại học', 'Phân bổ qua hệ thống tuyển sinh trung tâm.']],
    x: 'Kỳ thi bộ lớp 12 (Iraq)',
    f: [['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng, ăn kleicha'], ['nowruz', 'Newroz (Kurdistan)', '21/3', 'fixed', 'đốt lửa và đi dã ngoại'], ['arbaeen', 'Arbaeen', '40 ngày sau Ashura', 'lunar', 'tìm hiểu cuộc hành hương tới Karbala']],
    m: [['Luật Tình trạng Cá nhân', 'Hôn nhân đăng ký tại tòa án; có sửa đổi gây tranh cãi năm 2025.'], ['Độ tuổi', 'Mốc luật chung 18, ngoại lệ do tòa; game giữ nguyên tắc tự nguyện.'], ['Mahr', 'Được thỏa thuận.']],
    d: ['Masgouf', 'Dolma', 'Kubba', 'Quzi', 'Kleicha'],
    w: [['Luật Lao động 37/2015', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['Phép năm', 'Mốc luật: 20 ngày.'], ['Luật An sinh 2023', 'Mở rộng an sinh cho khu vực tư.'], ['Khu vực công', 'Nhà nước là chủ lao động lớn.']]
  });
  A('IL', {
    e: [['Bagrut', 'Kỳ thi trúng tuyển cuối trung học.'], ['Trường kỹ thuật', 'Trung học và cao đẳng kỹ thuật.'], ['Đại học', 'Xét Bagrut và bài thi tâm trắc.']],
    x: 'Bagrut (Israel)',
    f: [['rosh_hashanah', 'Rosh Hashanah', 'Tháng 9–10', 'lunar', 'ăn táo chấm mật ong'], ['pesach', 'Pesach', 'Mùa xuân', 'lunar', 'dự bữa Seder khi được mời'], ['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'chúc mừng hàng xóm Ả Rập']],
    m: [['Hôn nhân tôn giáo', 'Trong nước chỉ có hôn nhân qua tòa án tôn giáo; hôn nhân dân sự ở nước ngoài được đăng ký.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Chung sống', 'Chung sống được công nhận một số quyền.']],
    d: ['Falafel', 'Hummus', 'Shakshuka', 'Sabich', 'Jachnun'],
    w: [['Luật Giờ làm và Nghỉ ngơi', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 42 giờ/tuần.'], ['Phép năm', 'Tăng theo thâm niên.'], ['Bituah Leumi', 'Bảo hiểm Quốc gia.'], ['Xung đột', 'Tình hình an ninh ảnh hưởng việc làm.']]
  });
  A('JO', {
    e: [['Tawjihi', 'Kỳ thi trung học quốc gia.'], ['Vocational Training Corporation', 'Đào tạo nghề.'], ['Đại học', 'Tuyển sinh thống nhất theo điểm Tawjihi.']],
    x: 'Tawjihi (Jordan)',
    f: [['independence_day', 'Ngày Độc lập', '25/5', 'fixed', 'tham gia hoạt động công cộng', 1946], ['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng, ăn ma’amoul'], ['jerash_festival', 'Jerash Festival', 'Tháng 7', 'variable', 'xem biểu diễn ở di tích La Mã']],
    m: [['Luật Tình trạng Cá nhân', 'Hôn nhân qua tòa án tôn giáo.'], ['Độ tuổi 18', 'Mốc luật: 18, ngoại lệ từ 16.'], ['Mahr', 'Được thỏa thuận.']],
    d: ['Mansaf', 'Maqluba', 'Falafel', 'Knafeh', 'Zarb'],
    w: [['Luật Lao động 8/1996', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['Phép năm', 'Mốc luật: 14 ngày, 21 ngày sau 5 năm.'], ['SSC', 'Tổng công ty An sinh Xã hội.'], ['Người tị nạn', 'Người tị nạn cần giấy phép làm việc.']]
  });
  A('KW', {
    e: [['Thanawiya', 'Chứng chỉ trung học.'], ['PAAET', 'Cơ quan giáo dục ứng dụng và đào tạo.'], ['Kuwait University', 'Đại học công.']],
    f: [['national_day', 'Ngày Quốc khánh', '25/2', 'fixed', 'xem pháo hoa', 1961], ['liberation_day', 'Ngày Giải phóng', '26/2', 'fixed', 'tham gia lễ', 1991], ['hala_february', 'Hala February', 'Tháng 2', 'variable', 'xem hòa nhạc']],
    m: [['Luật Tình trạng Cá nhân', 'Hôn nhân theo luật tôn giáo.'], ['Độ tuổi', 'Có sửa đổi nâng độ tuổi năm 2025.'], ['Mahr', 'Được thỏa thuận.']],
    d: ['Machboos', 'Gers ogaily', 'Harees', 'Mutabbaq zubaidi', 'Balaleet'],
    w: [['Luật Lao động 6/2010', 'Văn bản chính khu vực tư.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['Phép năm', 'Mốc luật: 30 ngày.'], ['Kafala', 'Lao động nước ngoài gắn với chủ bảo lãnh.'], ['Kuwait hóa', 'Ưu tiên tuyển công dân Kuwait.']]
  });
  A('LB', {
    e: [['Bac libanais', 'Kỳ thi bac quốc gia.'], ['Trường kỹ thuật', 'Trung học kỹ thuật.'], ['Đại học', 'Đại học Liban và đại học tư như AUB, USJ.']],
    x: 'Bac libanais (Lebanon)',
    f: [['independence_day', 'Ngày Độc lập', '22/11', 'fixed', 'tham gia hoạt động công cộng', 1943], ['baalbeck', 'Baalbeck International Festival', 'Mùa hè', 'variable', 'xem biểu diễn ở đền cổ'], ['christmas', 'Giáng sinh', '25/12', 'fixed', 'chúc mừng hàng xóm Kitô giáo']],
    m: [['Hôn nhân tôn giáo', 'Trong nước chỉ có hôn nhân theo 18 cộng đồng tôn giáo; hôn nhân dân sự ở nước ngoài được đăng ký.'], ['Độ tuổi', 'Khác theo cộng đồng tôn giáo.'], ['Mahr', 'Được thỏa thuận.']],
    d: ['Tabbouleh', 'Kibbeh', 'Manakish', 'Fattoush', 'Knefeh'],
    w: [['Bộ luật Lao động 1946', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['Phép năm', 'Mốc luật: 15 ngày.'], ['NSSF', 'Quỹ An sinh Xã hội Quốc gia.'], ['Khủng hoảng', 'Khủng hoảng tài chính từ 2019 làm lương mất giá.']]
  });
  A('OM', {
    e: [['General Education Diploma', 'Chứng chỉ giáo dục phổ thông.'], ['Vocational colleges', 'Cao đẳng nghề.'], ['Sultan Qaboos University', 'Đại học công.']],
    f: [['national_day', 'Ngày Quốc khánh', 'Tháng 11', 'fixed', 'xem diễu hành'], ['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng, ăn halwa'], ['muscat_nights', 'Muscat Nights', 'Tháng 1–2', 'variable', 'đi lễ hội gia đình']],
    m: [['Luật Tình trạng Cá nhân', 'Hôn nhân theo luật tôn giáo.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Mahr', 'Được thỏa thuận.']],
    d: ['Shuwa', 'Majboos', 'Harees', 'Halwa Oman', 'Mashuai'],
    w: [['Luật Lao động 2023', 'Luật mới thay luật 2003.'], ['Giờ làm', 'Mốc luật: 45 giờ/tuần.'], ['Phép năm', 'Mốc luật: 30 ngày.'], ['Quỹ Bảo trợ Xã hội', 'Hệ thống an sinh hợp nhất.'], ['Oman hóa', 'Ưu tiên tuyển công dân.']]
  });
  A('PS', {
    e: [['Tawjihi', 'Kỳ thi trung học quốc gia; chiến sự ở Gaza làm gián đoạn học tập.'], ['Đào tạo nghề', 'Trung tâm nghề.'], ['Đại học', 'Birzeit, An-Najah và trường khác.']],
    x: 'Tawjihi (Palestine)',
    f: [['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng, ăn ka’ak'], ['christmas_bethlehem', 'Giáng sinh ở Bethlehem', '24–25/12', 'fixed', 'xem lễ ở Quảng trường Máng cỏ'], ['olive_harvest', 'Mùa hái ô-liu', 'Tháng 10–11', 'variable', 'giúp gia đình thu hoạch']],
    m: [['Tòa án tôn giáo', 'Hôn nhân qua tòa Hồi giáo hoặc nhà thờ.'], ['Độ tuổi 18', 'Mốc luật: 18 từ 2019, ngoại lệ do tòa.'], ['Mahr', 'Được thỏa thuận.']],
    d: ['Musakhan', 'Maqluba', 'Knafeh Nabulsieh', 'Falafel', 'Mansaf'],
    w: [['Luật Lao động 7/2000', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 45 giờ/tuần.'], ['Chiếm đóng và chiến tranh', 'Hạn chế đi lại và chiến sự ảnh hưởng nặng việc làm.'], ['Làm việc ở Israel', 'Cần giấy phép, có thể bị thu hồi.'], ['Lương tối thiểu', 'Có mức tối thiểu.']]
  });
  A('QA', {
    e: [['Thanawiya', 'Chứng chỉ trung học.'], ['Community College of Qatar', 'Đào tạo ứng dụng.'], ['Qatar University', 'Đại học công; Education City có nhiều trường quốc tế.']],
    f: [['national_day', 'Ngày Quốc khánh', '18/12', 'fixed', 'xem diễu hành'], ['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng'], ['sports_day', 'Ngày Thể thao Quốc gia', 'Thứ Ba thứ hai tháng 2', 'variable', 'tham gia hoạt động thể thao']],
    m: [['Luật Gia đình 2006', 'Hôn nhân theo luật gia đình.'], ['Độ tuổi', 'Mốc luật: nam 18, nữ 16.'], ['Mahr', 'Được thỏa thuận.']],
    d: ['Machboos', 'Harees', 'Thareed', 'Luqaimat', 'Balaleet'],
    w: [['Luật Lao động 14/2004', 'Văn bản chính, có cải cách 2020.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['Phép năm', 'Mốc luật: 3 tuần, 4 tuần sau 5 năm.'], ['Lương tối thiểu', 'Lương tối thiểu không phân biệt quốc tịch từ 2021.'], ['Đổi việc', 'Lao động có thể đổi chủ không cần giấy phép xuất cảnh.']]
  });
  A('SA', {
    e: [['Qudurat và Tahsili', 'Các bài thi của Qiyas dùng cho tuyển sinh đại học.'], ['TVTC', 'Tổng công ty Đào tạo Kỹ thuật và Nghề.'], ['Đại học', 'Có học bổng trong và ngoài nước.']],
    x: 'Qudurat/Tahsili (Ả Rập Xê Út)',
    f: [['national_day', 'Ngày Quốc khánh', '23/9', 'fixed', 'xem pháo hoa', 1932], ['founding_day', 'Ngày Thành lập', '22/2', 'fixed', 'mặc trang phục truyền thống'], ['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng']],
    m: [['Luật Tình trạng Cá nhân 2022', 'Luật gia đình mới.'], ['Độ tuổi 18', 'Mốc luật: 18, ngoại lệ do tòa.'], ['Mahr', 'Được thỏa thuận.']],
    d: ['Kabsa', 'Jareesh', 'Mutabbaq', 'Saleeg', 'Chà là và qahwa'],
    w: [['Luật Lao động', 'Có sửa đổi năm 2025.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần, 36 giờ trong Ramadan với người Hồi giáo.'], ['Phép năm', 'Mốc luật: 21 ngày, 30 ngày sau 5 năm.'], ['GOSI', 'Bảo hiểm xã hội.'], ['Nitaqat', 'Tỷ lệ tuyển công dân Ả Rập Xê Út.']]
  });
  A('SY', {
    e: [['Kỳ thi bac Syria', 'Kỳ thi quốc gia cuối trung học.'], ['Trường nghề', 'Trung học nghề.'], ['Đại học', 'Đại học Damascus, Aleppo và trường khác.']],
    x: 'Bac Syria',
    f: [['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng, ăn ma’amoul'], ['christmas', 'Giáng sinh', '25/12', 'fixed', 'chúc mừng hàng xóm Kitô giáo'], ['evacuation_day', 'Ngày Sơ tán (Độc lập)', '17/4', 'fixed', 'tham gia hoạt động cộng đồng', 1946]],
    m: [['Tòa án tôn giáo', 'Hôn nhân theo luật tình trạng cá nhân và tòa tôn giáo.'], ['Độ tuổi 18', 'Mốc luật: 18, ngoại lệ do tòa.'], ['Mahr', 'Được thỏa thuận.']],
    d: ['Kibbeh', 'Fattoush', 'Shawarma', 'Muhammara', 'Halawet el-jibn'],
    w: [['Luật Lao động 17/2010', 'Văn bản chính.'], ['Chuyển tiếp từ cuối 2024', 'Thay đổi chính quyền ảnh hưởng thể chế và việc làm.'], ['Tái thiết', 'Nhiều việc làm trong xây dựng và dịch vụ.'], ['Người hồi hương', 'Nhiều người trở về cần giấy tờ.'], ['Lương thấp', 'Lương danh nghĩa thấp so với giá.']]
  });
  A('AE', {
    e: [['Trung học UAE', 'Từ 2024 không bắt buộc EmSAT để vào đại học.'], ['Higher Colleges of Technology', 'Đào tạo ứng dụng.'], ['UAE University', 'Đại học công và nhiều trường quốc tế.']],
    f: [['national_day', 'Ngày Quốc khánh', '2/12', 'fixed', 'xem pháo hoa', 1971], ['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng'], ['dubai_shopping', 'Dubai Shopping Festival', 'Tháng 12–1', 'variable', 'xem pháo hoa và chợ đêm; không bắt buộc mua sắm']],
    m: [['Luật Tình trạng Cá nhân', 'Người Hồi giáo theo luật gia đình; người không theo đạo có hôn nhân dân sự.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Hôn nhân dân sự', 'Abu Dhabi có tòa án gia đình dân sự từ 2021.']],
    d: ['Machboos', 'Luqaimat', 'Harees', 'Thareed', 'Balaleet'],
    w: [['Nghị định-luật 33/2021', 'Luật Lao động khu vực tư.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['Phép năm', 'Mốc luật: 30 ngày.'], ['Bảo hiểm thất nghiệp (ILOE)', 'Bắt buộc từ 2023.'], ['WPS', 'Lương trả qua hệ thống bảo vệ tiền lương.']]
  });
  A('YE', {
    e: [['Kỳ thi trung học', 'Kỳ thi quốc gia bị chia tách do chiến tranh.'], ['Đào tạo nghề', 'Trung tâm nghề hạn chế.'], ['Đại học', 'Đại học Sana’a, Aden và trường khác.']],
    f: [['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng'], ['unity_day', 'Ngày Thống nhất', '22/5', 'fixed', 'tham gia hoạt động cộng đồng', 1990], ['revolution_day', 'Ngày Cách mạng', '26/9', 'fixed', 'tham gia hoạt động cộng đồng', 1962]],
    m: [['Luật Tình trạng Cá nhân', 'Hôn nhân theo luật tôn giáo.'], ['Độ tuổi', 'Luật chưa đặt tuổi tối thiểu; tảo hôn là rủi ro thực tế, game giữ nguyên tắc trưởng thành, tự nguyện.'], ['Mahr', 'Được thỏa thuận.']],
    d: ['Saltah', 'Mandi', 'Fahsa', 'Bint al-sahn', 'Zurbian'],
    w: [['Luật Lao động 5/1995', 'Văn bản chính.'], ['Chiến tranh', 'Xung đột kéo dài làm mất việc và lương.'], ['Khu vực công', 'Lương công chức bị gián đoạn nhiều năm.'], ['Phi chính thức', 'Phần lớn việc làm phi chính thức.'], ['Kiều hối', 'Nhiều gia đình dựa vào kiều hối.']]
  });
})(globalThis.G);
