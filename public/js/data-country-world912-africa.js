/* §13 lô 3 — châu Phi. Nhiều nước có song song hôn nhân dân sự, tôn giáo và tục lệ; game không gán một tục lệ cho cả nước.
   Số liệu luật là mốc đọc 2026, có ngoại lệ theo ngành/hợp đồng; khu vực phi chính thức rất lớn ở nhiều nước. */
(function (G) {
  'use strict';
  var A = G.E.COUNTRY_WORLD912.add;
  function fr(code, social) { // Bộ luật Lao động phổ biến ở các nước nói tiếng Pháp (mốc đọc, không phải trích nguyên văn)
    return [['Code du travail', 'Bộ luật Lao động ' + code + ' là văn bản chính, cùng thỏa ước tập thể ngành.'], ['Giờ làm', 'Mốc luật thường gặp: 40 giờ/tuần ở khu vực ngoài nông nghiệp.'], ['Phép năm', 'Mốc thường gặp: 2,5 ngày mỗi tháng làm việc.'], ['An sinh xã hội', social], ['Khu vực phi chính thức', 'Phần lớn người lao động làm việc phi chính thức; giữ ghi chép công và khoản nhận.']];
  }
  A('DZ', {
    e: [['Lycée và Baccalauréat', 'Kỳ thi bac quốc gia quyết định vào đại học.'], ['Đào tạo nghề (CFPA)', 'Trung tâm đào tạo nghề và học việc.'], ['Đại học', 'Phân bổ ngành theo điểm bac.']],
    x: 'Baccalauréat (Algeria)',
    f: [['yennayer', 'Yennayer (Năm mới Amazigh)', '12/1', 'fixed', 'nấu couscous mừng năm mới'], ['independence_day', 'Ngày Độc lập', '5/7', 'fixed', 'tham gia hoạt động công cộng', 1962], ['eid_fitr', 'Aïd el-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng, ăn bánh makroud']],
    m: [['Bộ luật Gia đình', 'Hôn nhân theo Bộ luật Gia đình, đăng ký dân sự.'], ['Độ tuổi 19', 'Mốc luật: 19 cho cả hai.'], ['Mahr và lễ', 'Mahr được thỏa thuận; tiệc cưới tùy khả năng.']],
    d: ['Couscous', 'Chakhchoukha', 'Chorba frik', 'Mhadjeb', 'Makroud'],
    w: [['Luật 90-11 về quan hệ lao động', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 2,5 ngày mỗi tháng.'], ['CNAS', 'Quỹ bảo hiểm xã hội cho người làm công.'], ['Lương tối thiểu (SNMG)', 'Mức lương tối thiểu quốc gia.']]
  });
  A('AO', {
    e: [['Ensino secundário', 'Học trung học; mỗi trường đại học có kỳ thi đầu vào riêng.'], ['Ensino técnico-profissional', 'Trung học kỹ thuật và trung tâm nghề INEFOP.'], ['Đại học', 'Đại học Agostinho Neto và trường khác.']],
    f: [['independence_day', 'Ngày Độc lập', '11/11', 'fixed', 'xem diễu hành ở Luanda', 1975], ['carnaval_luanda', 'Carnaval de Luanda', 'Trước Mùa Chay', 'variable', 'xem các nhóm semba diễu hành'], ['peace_day', 'Ngày Hòa bình', '4/4', 'fixed', 'tham gia hoạt động cộng đồng', 2002]],
    m: [['Đăng ký dân sự', 'Hôn nhân dân sự tại cơ quan hộ tịch.'], ['Alembamento', 'Lễ hỏi truyền thống phổ biến; quà được thỏa thuận.'], ['Độ tuổi', 'Hai người phải đủ tuổi luật định và tự nguyện.']],
    d: ['Muamba de galinha', 'Funge', 'Calulu', 'Mufete', 'Cocada amarela'],
    w: [['Lei Geral do Trabalho', 'Luật Lao động chung (2023).'], ['Giờ làm', 'Mốc tham chiếu: 44 giờ/tuần.'], ['INSS', 'Bảo hiểm xã hội quốc gia.'], ['Lương tối thiểu', 'Có mức tối thiểu quốc gia.'], ['Phi chính thức', 'Nhiều người buôn bán nhỏ (zungueira).']]
  });
  A('BJ', {
    e: [['Lycée và Baccalauréat', 'BEPC ở cuối trung học cơ sở, Bac cuối trung học.'], ['Đào tạo kỹ thuật', 'Lycée kỹ thuật và học việc truyền thống.'], ['Đại học Abomey-Calavi', 'Đại học công và tư.']],
    x: 'Baccalauréat (Benin)',
    f: [['vodun_days', 'Ngày Vodun (Vodun Days)', 'Đầu tháng 1, quanh 10/1', 'variable', 'xem lễ ở Ouidah, tôn trọng nghi lễ của cộng đồng'], ['independence_day', 'Ngày Độc lập', '1/8', 'fixed', 'tham gia hoạt động công cộng', 1960], ['gani', 'Lễ hội Gani (Nikki)', 'Theo lịch Hồi giáo', 'lunar', 'xem đoàn kỵ sĩ Baatonu']],
    m: [['Code des personnes et de la famille', 'Bộ luật Gia đình 2004 quy định hôn nhân dân sự một vợ một chồng.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ hỏi', 'Lễ truyền thống của hai gia đình; mức quà được thỏa thuận.']],
    d: ['Amiwo', 'Pâte et sauce gombo', 'Akassa', 'Wagasi (phô mai)', 'Kuli-kuli'],
    w: fr('Benin', 'Quỹ CNSS cho người làm công chính thức.')
  });
  A('BW', {
    e: [['BGCSE', 'Kỳ thi cuối trung học do BEC tổ chức.'], ['Đào tạo nghề (TVET)', 'Trường kỹ thuật và brigade.'], ['Đại học Botswana và BIUST', 'Có tài trợ học phí của chính phủ.']],
    x: 'BGCSE (Botswana)',
    f: [['independence_day', 'Botswana Day', '30/9', 'fixed', 'tham gia hoạt động công cộng', 1966], ['presidents_day', 'President’s Day', 'Tháng 7', 'variable', 'xem thi văn nghệ'], ['domboshaba', 'Lễ hội Domboshaba', 'Tháng 9–10', 'variable', 'tìm hiểu văn hóa Kalanga']],
    m: [['Đăng ký dân sự hoặc tục lệ', 'Có hôn nhân dân sự và hôn nhân tục lệ.'], ['Bogadi (sính lễ)', 'Bogadi phổ biến; mức được hai gia đình thỏa thuận.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Seswaa', 'Bogobe', 'Morogo', 'Magwinya', 'Phane (sâu mopane)'],
    w: [['Employment Act', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 45 giờ/tuần.'], ['Phép năm', 'Mốc luật: 15 ngày làm việc.'], ['Lương tối thiểu', 'Có mức tối thiểu theo ngành.'], ['Thất nghiệp thanh niên', 'Tỷ lệ thất nghiệp thanh niên cao.']]
  });
  A('BF', {
    e: [['Lycée và Baccalauréat', 'BEPC và Bac.'], ['Đào tạo nghề', 'Trung tâm nghề và học việc.'], ['Đại học Joseph Ki-Zerbo', 'Đại học công và tư.']],
    x: 'Baccalauréat (Burkina Faso)',
    f: [['fespaco', 'FESPACO', 'Năm lẻ, tháng 2–3', 'variable', 'xem phim châu Phi ở Ouagadougou'], ['national_day', 'Ngày Quốc khánh', '11/12', 'fixed', 'tham gia hoạt động công cộng', 1958], ['tabaski', 'Tabaski', 'Eid al-Adha', 'lunar', 'chia sẻ bữa ăn với hàng xóm']],
    m: [['Code des personnes et de la famille', 'Hôn nhân dân sự có hiệu lực pháp lý.'], ['Độ tuổi', 'Mốc luật: nam 20, nữ 17, ngoại lệ hẹp.'], ['Chế độ một hay nhiều vợ', 'Luật cho phép lựa chọn chế độ khi đăng ký; game không mặc định.']],
    d: ['Tô (to)', 'Riz gras', 'Poulet bicyclette', 'Babenda', 'Gonré'],
    w: fr('Burkina Faso', 'Quỹ CNSS cho người làm công chính thức.')
  });
  A('BI', {
    e: [['Trung học và kỳ thi quốc gia', 'Kỳ thi quốc gia cuối trung học.'], ['Đào tạo nghề', 'Trường kỹ thuật và nghề.'], ['Đại học Burundi', 'Đại học công.']],
    f: [['independence_day', 'Ngày Độc lập', '1/7', 'fixed', 'tham gia hoạt động công cộng', 1962], ['umuganuro', 'Umuganuro', 'Tháng 8', 'variable', 'xem lễ mừng mùa'], ['unity_day', 'Ngày Đoàn kết', '5/2', 'fixed', 'tham gia hoạt động cộng đồng']],
    m: [['Đăng ký dân sự', 'Hôn nhân dân sự có hiệu lực pháp lý.'], ['Inkwano (sính lễ)', 'Sính lễ truyền thống; mức được thỏa thuận.'], ['Độ tuổi', 'Mốc luật: nam 21, nữ 18.']],
    d: ['Ugali', 'Đậu hầm', 'Chuối nấu (ibitoke)', 'Cá mukeke', 'Brochettes'],
    w: [['Code du travail', 'Bộ luật Lao động 2020.'], ['Giờ làm', 'Mốc tham chiếu: 40 giờ/tuần.'], ['INSS', 'Viện An sinh Xã hội Quốc gia.'], ['Nông nghiệp', 'Phần lớn người dân làm nông.'], ['Phi chính thức', 'Giữ ghi chép công.']]
  });
  A('CV', {
    e: [['Ensino secundário', 'Học trung học 12 năm.'], ['Đào tạo nghề (IEFP)', 'Trung tâm nghề.'], ['Đại học Cabo Verde', 'Nhiều người học tiếp ở Bồ Đào Nha.']],
    f: [['carnaval_mindelo', 'Carnaval do Mindelo', 'Trước Mùa Chay', 'variable', 'xem diễu hành ở São Vicente'], ['independence_day', 'Ngày Độc lập', '5/7', 'fixed', 'tham gia hoạt động công cộng', 1975], ['gamboa', 'Festival da Gamboa', 'Tháng 5 (Praia)', 'variable', 'nghe nhạc morna và funaná']],
    m: [['Lễ dân sự hoặc Công giáo', 'Cả hai được công nhận.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['União de facto', 'Chung sống được công nhận có điều kiện.']],
    d: ['Cachupa', 'Pastel com diabo dentro', 'Buzio', 'Xerém', 'Doce de papaia'],
    w: [['Código Laboral', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 44 giờ/tuần.'], ['INPS', 'Bảo hiểm xã hội.'], ['Du lịch', 'Nhiều việc làm trong ngành du lịch.'], ['Lương tối thiểu', 'Có mức tối thiểu.']]
  });
  A('CM', {
    e: [['Hai hệ: Bac và GCE A Level', 'Hệ tiếng Pháp thi Bac, hệ tiếng Anh thi GCE A Level.'], ['Đào tạo kỹ thuật', 'Trường kỹ thuật và CAP/BT.'], ['Đại học', 'Đại học công có kỳ thi riêng cho trường lớn.']],
    x: 'Baccalauréat / GCE A Level (Cameroon)',
    f: [['national_day', 'Ngày Thống nhất', '20/5', 'fixed', 'xem diễu hành', 1972], ['ngondo', 'Ngondo (Douala)', 'Tháng 12', 'variable', 'xem lễ của người Sawa bên sông Wouri'], ['christmas', 'Giáng sinh', '25/12', 'fixed', 'sum họp gia đình']],
    m: [['Đăng ký dân sự', 'Hôn nhân dân sự có hiệu lực pháp lý.'], ['Chế độ hôn nhân', 'Khi đăng ký chọn một vợ một chồng hoặc đa thê; game không mặc định.'], ['Dot (sính lễ)', 'Sính lễ được thỏa thuận.']],
    d: ['Ndolé', 'Eru', 'Poulet DG', 'Achu', 'Koki'],
    w: fr('Cameroon', 'Quỹ CNPS cho người làm công.')
  });
  A('CF', {
    e: [['Lycée và Baccalauréat', 'Hệ thống giống Pháp; nhiều trường bị gián đoạn vì xung đột.'], ['Đào tạo nghề', 'Trung tâm nghề hạn chế.'], ['Đại học Bangui', 'Đại học công chính.']],
    x: 'Baccalauréat (Cộng hòa Trung Phi)',
    f: [['independence_day', 'Ngày Độc lập', '13/8', 'fixed', 'tham gia hoạt động công cộng', 1960], ['boganda_day', 'Ngày Boganda', '29/3', 'fixed', 'tham gia tưởng niệm'], ['christmas', 'Giáng sinh', '25/12', 'fixed', 'sum họp gia đình']],
    m: [['Đăng ký dân sự', 'Hôn nhân dân sự có hiệu lực pháp lý.'], ['Sính lễ', 'Sính lễ được thỏa thuận.'], ['Độ tuổi', 'Hai người đủ tuổi luật định, tự nguyện.']],
    d: ['Gozo (bánh sắn)', 'Ngunza (lá sắn)', 'Muamba', 'Kanda', 'Lạc rang'],
    w: fr('Cộng hòa Trung Phi', 'Hệ thống an sinh có phạm vi hẹp.')
  });
  A('TD', {
    e: [['Lycée và Baccalauréat', 'Song ngữ Pháp – Ả Rập.'], ['Đào tạo nghề', 'Trung tâm nghề hạn chế.'], ['Đại học N’Djamena', 'Đại học công.']],
    x: 'Baccalauréat (Chad)',
    f: [['independence_day', 'Ngày Độc lập', '11/8', 'fixed', 'tham gia hoạt động công cộng', 1960], ['gerewol', 'Gerewol (Wodaabe)', 'Cuối mùa mưa, khoảng tháng 9', 'variable', 'tìm hiểu lễ hội khi được cộng đồng mời'], ['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng']],
    m: [['Đăng ký dân sự', 'Hôn nhân dân sự, tôn giáo và tục lệ cùng tồn tại.'], ['Sính lễ', 'Sính lễ phổ biến; mức được thỏa thuận.'], ['Độ tuổi', 'Tảo hôn là vấn đề thực tế; game giữ nguyên tắc tự nguyện.']],
    d: ['Boule', 'Daraba', 'Kissar', 'Jarret de boeuf', 'Bánh kê']
    , w: fr('Chad', 'Quỹ CNPS cho người làm công.')
  });
  A('KM', {
    e: [['Lycée và Baccalauréat', 'Hệ thống tiếng Pháp.'], ['Đào tạo nghề', 'Trung tâm nghề.'], ['Đại học Comoros', 'Đại học công.']],
    x: 'Baccalauréat (Comoros)',
    f: [['independence_day', 'Ngày Độc lập', '6/7', 'fixed', 'tham gia hoạt động công cộng', 1975], ['maoulid', 'Maoulid', 'Theo lịch Hồi giáo', 'lunar', 'nghe tụng ca'], ['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng']],
    m: [['Đăng ký hôn nhân', 'Hôn nhân theo luật gia đình.'], ['Grand mariage (anda)', 'Đại hôn lễ truyền thống rất tốn kém; nhiều người chọn lễ nhỏ.'], ['Đồng thuận', 'Hai người tự nguyện.']],
    d: ['Langouste à la vanille', 'Mataba', 'Pilao', 'Mkatra foutra', 'Cá nướng']
    , w: fr('Comoros', 'Hệ thống an sinh có phạm vi hẹp.')
  });
  A('CG', {
    e: [['Lycée và Baccalauréat', 'BEPC và Bac.'], ['Đào tạo kỹ thuật', 'Lycée kỹ thuật.'], ['Đại học Marien Ngouabi', 'Đại học công.']],
    x: 'Baccalauréat (Congo)',
    f: [['independence_day', 'Ngày Độc lập', '15/8', 'fixed', 'tham gia hoạt động công cộng', 1960], ['fespam', 'FESPAM', 'Hai năm một lần, tháng 7', 'variable', 'nghe nhạc châu Phi ở Brazzaville'], ['christmas', 'Giáng sinh', '25/12', 'fixed', 'sum họp gia đình']],
    m: [['Đăng ký dân sự', 'Hôn nhân dân sự có hiệu lực.'], ['Dot', 'Sính lễ truyền thống được thỏa thuận.'], ['Độ tuổi', 'Hai người đủ tuổi luật định.']],
    d: ['Saka-saka', 'Poulet moambe', 'Liboké', 'Chikwangue', 'Maboké']
    , w: fr('Congo', 'Quỹ CNSS cho người làm công.')
  });
  A('CD', {
    e: [['Trung học và Examen d’État', 'Kỳ thi nhà nước cuối trung học.'], ['Đào tạo nghề', 'INPP và trường kỹ thuật.'], ['Đại học Kinshasa và trường khác', 'Đại học công và tư.']],
    x: 'Examen d’État (CHDC Congo)',
    f: [['independence_day', 'Ngày Độc lập', '30/6', 'fixed', 'tham gia hoạt động công cộng', 1960], ['heroes_day', 'Ngày Anh hùng', '16–17/1', 'fixed', 'tham gia tưởng niệm'], ['christmas', 'Giáng sinh', '25/12', 'fixed', 'sum họp gia đình']],
    m: [['Đăng ký dân sự', 'Hôn nhân dân sự có hiệu lực.'], ['Dot', 'Sính lễ là điều kiện phổ biến của hôn nhân tục lệ.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Moambe', 'Fufu', 'Pondu', 'Liboké', 'Chikwangue'],
    w: [['Code du travail', 'Bộ luật Lao động 2002 và sửa đổi.'], ['Giờ làm', 'Mốc luật: 45 giờ/tuần.'], ['CNSS', 'Quỹ An sinh Xã hội Quốc gia.'], ['Khai mỏ', 'Ngành mỏ quan trọng; kiểm tra an toàn kỹ.'], ['Xung đột phía đông', 'Bất ổn ảnh hưởng việc làm ở các tỉnh phía đông.']]
  });
  A('CI', {
    e: [['Lycée và Baccalauréat', 'BEPC và Bac.'], ['Đào tạo kỹ thuật', 'Trường kỹ thuật và nghề.'], ['Đại học Félix Houphouët-Boigny', 'Đại học công và tư; có INP-HB.']],
    x: 'Baccalauréat (Bờ Biển Ngà)',
    f: [['independence_day', 'Ngày Độc lập', '7/8', 'fixed', 'tham gia hoạt động công cộng', 1960], ['abissa', 'Abissa (Grand-Bassam)', 'Tháng 10–11', 'variable', 'xem lễ của người N’zima'], ['fete_masques', 'Lễ hội Mặt nạ (Man)', 'Tháng 2', 'variable', 'xem các điệu múa mặt nạ']],
    m: [['Đăng ký dân sự', 'Chỉ hôn nhân dân sự có hiệu lực; một vợ một chồng.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Dot', 'Sính lễ truyền thống được thỏa thuận.']],
    d: ['Attiéké', 'Kedjenou', 'Alloco', 'Foutou', 'Garba'],
    w: fr('Bờ Biển Ngà', 'Quỹ CNPS cho người làm công.')
  });
  A('DJ', {
    e: [['Lycée và Baccalauréat', 'Hệ thống tiếng Pháp.'], ['Đào tạo nghề', 'Lycée kỹ thuật.'], ['Đại học Djibouti', 'Đại học công.']],
    x: 'Baccalauréat (Djibouti)',
    f: [['independence_day', 'Ngày Độc lập', '27/6', 'fixed', 'tham gia hoạt động công cộng', 1977], ['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng'], ['eid_adha', 'Eid al-Adha', 'Theo lịch Hồi giáo', 'lunar', 'chia sẻ thực phẩm']],
    m: [['Bộ luật Gia đình', 'Hôn nhân theo Bộ luật Gia đình.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Mahr', 'Mahr được thỏa thuận.']],
    d: ['Skoudehkaris', 'Lahoh', 'Fah-fah', 'Cá nướng', 'Halwo'],
    w: fr('Djibouti', 'Quỹ CNSS cho người làm công.')
  });
  A('EG', {
    e: [['Thanaweya Amma', 'Kỳ thi tốt nghiệp trung học quyết định vào đại học.'], ['Trung học kỹ thuật', 'Trường kỹ thuật công nghiệp, thương mại, nông nghiệp.'], ['Đại học', 'Phân bổ qua hệ thống tanseeq theo điểm.']],
    x: 'Thanaweya Amma (Ai Cập)',
    f: [['sham_el_nessim', 'Sham el-Nessim', 'Thứ Hai sau Phục sinh Copt', 'variable', 'dã ngoại công viên cùng gia đình'], ['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'ăn kahk và thăm họ hàng'], ['revolution_day', 'Ngày Cách mạng', '23/7', 'fixed', 'tham gia hoạt động công cộng', 1952]],
    m: [['Đăng ký với ma’zoun', 'Người Hồi giáo đăng ký qua ma’zoun; người Kitô giáo theo nhà thờ và đăng ký.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Shabka và mahr', 'Quà shabka và mahr được hai gia đình thỏa thuận.']],
    d: ['Koshari', 'Ful medames', 'Molokhia', 'Ta’ameya', 'Om Ali'],
    w: [['Luật Lao động 2025', 'Luật lao động mới thay luật 2003, áp dụng từ năm 2025.'], ['Giờ làm', 'Mốc tham chiếu: 8 giờ/ngày, 48 giờ/tuần.'], ['Phép năm', 'Mốc tham chiếu: 21 ngày, tăng theo thâm niên và tuổi.'], ['Bảo hiểm xã hội', 'Cơ quan Bảo hiểm Xã hội Quốc gia.'], ['Lương tối thiểu', 'Mức tối thiểu khu vực tư do hội đồng quốc gia đặt.']]
  });
  A('GQ', {
    e: [['Bachillerato', 'Hệ thống tiếng Tây Ban Nha.'], ['Đào tạo nghề', 'Trung tâm nghề.'], ['UNGE', 'Đại học Quốc gia Guinea Xích Đạo.']],
    f: [['independence_day', 'Ngày Độc lập', '12/10', 'fixed', 'tham gia hoạt động công cộng', 1968], ['christmas', 'Giáng sinh', '25/12', 'fixed', 'sum họp gia đình'], ['easter', 'Lễ Phục sinh', 'Mùa xuân', 'variable', 'dự lễ hoặc nghỉ cùng gia đình']],
    m: [['Đăng ký dân sự hoặc nhà thờ', 'Có hôn nhân dân sự, Công giáo, tục lệ.'], ['Dote', 'Sính lễ truyền thống được thỏa thuận.'], ['Độ tuổi', 'Hai người đủ tuổi luật định.']],
    d: ['Succotash', 'Pepesup', 'Cá nướng', 'Chuối chiên', 'Sắn luộc'],
    w: [['Luật lao động', 'Văn bản chính về hợp đồng.'], ['Dầu khí', 'Ngành dầu khí chiếm phần lớn kinh tế.'], ['INSESO', 'Viện An sinh Xã hội.'], ['Hợp đồng', 'Đối chiếu hợp đồng kỹ.'], ['Phi chính thức', 'Giữ ghi chép công.']]
  });
  A('ER', {
    e: [['Trung học và kỳ thi Sawa', 'Học sinh học năm cuối tại Sawa và thi chứng chỉ trung học.'], ['Đào tạo nghề', 'Trường kỹ thuật.'], ['College', 'Các trường cao đẳng thay đại học trước đây.']],
    f: [['independence_day', 'Ngày Độc lập', '24/5', 'fixed', 'tham gia hoạt động công cộng', 1993], ['meskel', 'Meskel', '27/9', 'fixed', 'xem lửa demera'], ['martyrs_day', 'Ngày Liệt sĩ', '20/6', 'fixed', 'tham gia tưởng niệm']],
    m: [['Đăng ký dân sự', 'Hôn nhân dân sự, tôn giáo và tục lệ.'], ['Lễ hai gia đình', 'Hai gia đình bàn quy mô.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Zigni', 'Injera', 'Tsebhi', 'Shiro', 'Ful']
    , w: [['Nghĩa vụ quốc gia', 'Nghĩa vụ quốc gia kéo dài ảnh hưởng mọi lựa chọn nghề.'], ['Tuyên bố Lao động 118/2001', 'Văn bản chính.'], ['Khu vực nhà nước', 'Nhà nước là chủ lao động lớn.'], ['Đi làm nước ngoài', 'Hạn chế xuất cảnh.'], ['Thông tin hạn chế', 'Dữ liệu độc lập hạn chế.']]
  });
  A('SZ', {
    e: [['EGCSE', 'Kỳ thi cuối trung học Eswatini.'], ['Đào tạo nghề', 'Trường kỹ thuật.'], ['Đại học Eswatini', 'Đại học công.']],
    x: 'EGCSE (Eswatini)',
    f: [['umhlanga', 'Umhlanga (Lễ hội Sậy)', 'Tháng 8–9', 'variable', 'xem lễ hội khi được phép'], ['incwala', 'Incwala', 'Tháng 12–1', 'variable', 'tìm hiểu nghi lễ hoàng gia'], ['independence_day', 'Ngày Độc lập', '6/9', 'fixed', 'tham gia hoạt động công cộng', 1968]],
    m: [['Dân sự hoặc tục lệ', 'Có hôn nhân dân sự và tục lệ Swazi.'], ['Lobola', 'Sính lễ bằng gia súc hoặc tiền; mức được thỏa thuận.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Sishwala', 'Umncweba', 'Emasi', 'Sidvudvu', 'Tinkhobe'],
    w: [['Employment Act 1980', 'Văn bản chính.'], ['Giờ làm', 'Mốc tham chiếu: 48 giờ/tuần.'], ['Lương tối thiểu theo ngành', 'Lệnh lương theo ngành.'], ['ENPF', 'Quỹ Dự phòng Quốc gia.'], ['Thất nghiệp', 'Tỷ lệ thất nghiệp cao.']]
  });
  A('ET', {
    e: [['ESSLCE', 'Kỳ thi quốc gia lớp 12.'], ['TVET', 'Trường kỹ thuật dạy nghề.'], ['Đại học', 'Phân bổ theo điểm thi.']],
    x: 'ESSLCE (Ethiopia)',
    f: [['timkat', 'Timkat', '19/1', 'fixed', 'xem rước tabot'], ['meskel', 'Meskel', '27/9', 'fixed', 'xem lửa demera'], ['enkutatash', 'Enkutatash', '11/9', 'fixed', 'mừng năm mới Ethiopia']],
    m: [['Bộ luật Gia đình', 'Có hôn nhân dân sự, tôn giáo, tục lệ.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ hai gia đình', 'Hai gia đình bàn quy mô.']],
    d: ['Injera', 'Doro wat', 'Kitfo', 'Shiro', 'Tibs'],
    w: [['Tuyên bố Lao động 1156/2019', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['Phép năm', 'Mốc luật: 16 ngày làm việc năm đầu.'], ['Lương hưu', 'Quỹ hưu trí khu vực tư.'], ['Khu công nghiệp', 'Nhiều việc làm ở khu công nghiệp.']]
  });
  A('GA', {
    e: [['Lycée và Baccalauréat', 'Hệ thống giống Pháp.'], ['Đào tạo kỹ thuật', 'Lycée kỹ thuật.'], ['Đại học Omar Bongo', 'Đại học công.']],
    x: 'Baccalauréat (Gabon)',
    f: [['independence_day', 'Ngày Độc lập', '17/8', 'fixed', 'tham gia hoạt động công cộng', 1960], ['christmas', 'Giáng sinh', '25/12', 'fixed', 'sum họp gia đình'], ['eid_adha', 'Eid al-Adha', 'Theo lịch Hồi giáo', 'lunar', 'chia sẻ bữa ăn với hàng xóm']],
    m: [['Đăng ký dân sự', 'Hôn nhân dân sự có hiệu lực.'], ['Dot', 'Sính lễ được thỏa thuận.'], ['Chế độ hôn nhân', 'Khi đăng ký chọn chế độ; game không mặc định.']],
    d: ['Poulet nyembwe', 'Atanga', 'Bâton de manioc', 'Cá nướng', 'Feuilles de manioc'],
    w: fr('Gabon', 'Quỹ CNSS cho người làm công.')
  });
  A('GM', {
    e: [['WASSCE', 'Kỳ thi WAEC cuối trung học.'], ['Đào tạo nghề', 'GTTI và trung tâm nghề.'], ['Đại học Gambia', 'Đại học công.']],
    x: 'WASSCE (Gambia)',
    f: [['independence_day', 'Ngày Độc lập', '18/2', 'fixed', 'tham gia hoạt động công cộng', 1965], ['tobaski', 'Tobaski', 'Eid al-Adha', 'lunar', 'chia sẻ bữa ăn'], ['roots_festival', 'Roots Festival', 'Theo năm, thường tháng 5', 'variable', 'tìm hiểu lịch sử ở Juffureh']],
    m: [['Dân sự, Hồi giáo hoặc tục lệ', 'Có nhiều hình thức hôn nhân được công nhận.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Kola nut và lễ', 'Nghi thức trao hạt kola giữa hai gia đình.']],
    d: ['Domoda', 'Benachin', 'Yassa', 'Superkanja', 'Chakery'],
    w: [['Labour Act', 'Văn bản chính.'], ['Giờ làm', 'Mốc tham chiếu: 48 giờ/tuần.'], ['SSHFC', 'Quỹ An sinh Xã hội và Nhà ở.'], ['Du lịch', 'Nhiều việc làm theo mùa du lịch.'], ['Phi chính thức', 'Giữ ghi chép công.']]
  });
  A('GN', {
    e: [['Lycée và Baccalauréat', 'BEPC và Bac.'], ['Đào tạo kỹ thuật', 'Trường kỹ thuật và nghề.'], ['Đại học Gamal Abdel Nasser', 'Đại học công.']],
    x: 'Baccalauréat (Guinea)',
    f: [['independence_day', 'Ngày Độc lập', '2/10', 'fixed', 'tham gia hoạt động công cộng', 1958], ['tabaski', 'Tabaski', 'Eid al-Adha', 'lunar', 'chia sẻ bữa ăn'], ['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng']],
    m: [['Đăng ký dân sự', 'Hôn nhân dân sự có hiệu lực.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ tôn giáo', 'Lễ Hồi giáo phổ biến; đăng ký vẫn cần.']],
    d: ['Riz sauce arachide', 'Fouti', 'Poulet yassa', 'Fonio', 'Kansiyé']
    , w: fr('Guinea', 'Quỹ CNSS cho người làm công.')
  });
  A('GW', {
    e: [['Ensino secundário', 'Hệ thống tiếng Bồ Đào Nha.'], ['Đào tạo nghề', 'Trung tâm nghề.'], ['Đại học Amílcar Cabral', 'Đại học công.']],
    f: [['independence_day', 'Ngày Độc lập', '24/9', 'fixed', 'tham gia hoạt động công cộng', 1973], ['carnaval', 'Carnaval de Bissau', 'Trước Mùa Chay', 'variable', 'xem mặt nạ diễu hành'], ['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng']],
    m: [['Dân sự hoặc tục lệ', 'Có hôn nhân dân sự và tục lệ.'], ['Sính lễ', 'Mức được thỏa thuận.'], ['Độ tuổi', 'Hai người đủ tuổi luật định.']],
    d: ['Jollof', 'Caldo de mancarra', 'Cá nướng', 'Cơm dừa', 'Hạt điều']
    , w: [['Lei Geral do Trabalho', 'Văn bản chính.'], ['Hạt điều', 'Ngành hạt điều quan trọng, theo mùa.'], ['INSS', 'Bảo hiểm xã hội.'], ['Khu vực công', 'Lương công chức có khi chậm.'], ['Phi chính thức', 'Giữ ghi chép công.']]
  });
  A('KE', {
    e: [['KCSE và CBC', 'KCSE cuối trung học; Chương trình năng lực (CBC) đang thay hệ 8-4-4.'], ['TVET', 'Viện kỹ thuật và quốc gia đa ngành.'], ['Đại học qua KUCCPS', 'Phân bổ ngành qua KUCCPS, có khoản vay HELB.']],
    x: 'KCSE (Kenya)',
    f: [['madaraka', 'Madaraka Day', '1/6', 'fixed', 'tham gia lễ', 1963], ['jamhuri', 'Jamhuri Day', '12/12', 'fixed', 'tham gia hoạt động công cộng', 1963], ['lamu_festival', 'Lamu Cultural Festival', 'Tháng 11', 'variable', 'xem đua thuyền dhow']],
    m: [['Marriage Act 2014', 'Công nhận hôn nhân dân sự, Kitô giáo, Hồi giáo, Hindu và tục lệ; nên đăng ký.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Ruracio/sính lễ', 'Sính lễ tục lệ được thỏa thuận.']],
    d: ['Ugali', 'Nyama choma', 'Sukuma wiki', 'Githeri', 'Pilau'],
    w: [['Employment Act 2007', 'Văn bản chính.'], ['Giờ làm', 'Mốc tham chiếu: 52 giờ/tuần cho nhiều ngành theo lệnh lương.'], ['Phép năm', 'Mốc luật: 21 ngày làm việc.'], ['NSSF và SHIF', 'Quỹ an sinh và quỹ bảo hiểm y tế xã hội (SHA).'], ['Lương tối thiểu', 'Lệnh lương tối thiểu theo ngành và vùng.']]
  });
  A('LS', {
    e: [['LGCSE', 'Kỳ thi cuối trung học Lesotho.'], ['Đào tạo nghề', 'Trường kỹ thuật.'], ['Đại học Quốc gia Lesotho', 'Có học bổng chính phủ.']],
    x: 'LGCSE (Lesotho)',
    f: [['moshoeshoe_day', 'Ngày Moshoeshoe', '11/3', 'fixed', 'tìm hiểu lịch sử'], ['independence_day', 'Ngày Độc lập', '4/10', 'fixed', 'tham gia hoạt động công cộng', 1966], ['morija', 'Morija Arts & Cultural Festival', 'Tháng 10', 'variable', 'xem nghệ thuật Basotho']],
    m: [['Dân sự hoặc tục lệ', 'Có hôn nhân dân sự và tục lệ.'], ['Bohali', 'Sính lễ bằng gia súc; mức được thỏa thuận.'], ['Độ tuổi', 'Hai người đủ tuổi luật định.']],
    d: ['Papa (cháo ngô)', 'Moroho', 'Likhobe', 'Motoho', 'Bánh mì hấp']
    , w: [['Labour Code', 'Văn bản chính.'], ['Ngành may', 'Nhiều việc làm ở nhà máy may.'], ['Làm việc ở Nam Phi', 'Nhiều người làm mỏ ở Nam Phi.'], ['Lương tối thiểu', 'Có mức tối thiểu theo ngành.'], ['Phi chính thức', 'Giữ ghi chép công.']]
  });
  A('LR', {
    e: [['WASSCE', 'Kỳ thi WAEC cuối trung học.'], ['Đào tạo nghề', 'Viện kỹ thuật.'], ['Đại học Liberia', 'Đại học công.']],
    x: 'WASSCE (Liberia)',
    f: [['independence_day', 'Ngày Độc lập', '26/7', 'fixed', 'tham gia hoạt động công cộng', 1847], ['thanksgiving', 'Lễ Tạ ơn', 'Thứ Năm đầu tháng 11', 'variable', 'dự buổi lễ cộng đồng'], ['decoration_day', 'Decoration Day', 'Thứ Tư thứ hai tháng 3', 'variable', 'dọn mộ người thân']],
    m: [['Dân sự hoặc tục lệ', 'Có hôn nhân dân sự và tục lệ.'], ['Sính lễ', 'Mức được thỏa thuận.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Jollof', 'Palm butter', 'Cassava leaf', 'Fufu', 'Pepper soup'],
    w: [['Decent Work Act 2015', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['NASSCORP', 'Quỹ an sinh xã hội.'], ['Lương tối thiểu', 'Có mức tối thiểu.'], ['Phi chính thức', 'Giữ ghi chép công.']]
  });
  A('LY', {
    e: [['Trung học và chứng chỉ', 'Kỳ thi chứng chỉ trung học.'], ['Đào tạo nghề', 'Viện kỹ thuật.'], ['Đại học', 'Đại học công; bất ổn ảnh hưởng học tập.']],
    f: [['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng'], ['independence_day', 'Ngày Độc lập', '24/12', 'fixed', 'tham gia hoạt động công cộng', 1951], ['ghadames', 'Lễ hội Ghadames', 'Tháng 10', 'variable', 'tìm hiểu văn hóa ốc đảo']],
    m: [['Luật gia đình', 'Hôn nhân theo luật gia đình Hồi giáo.'], ['Độ tuổi 20', 'Mốc luật: 20, ngoại lệ được tòa cho phép.'], ['Mahr', 'Mahr được thỏa thuận.']],
    d: ['Bazeen', 'Couscous', 'Shorba', 'Asida', 'Mbakbaka']
    , w: [['Luật Quan hệ Lao động 2010', 'Văn bản chính.'], ['Khu vực công', 'Nhà nước là chủ lao động lớn.'], ['Dầu mỏ', 'Ngành dầu mỏ chi phối kinh tế.'], ['Bất ổn', 'Chia rẽ chính quyền ảnh hưởng lương và việc làm.'], ['Lao động nước ngoài', 'Lao động di cư dễ bị tổn thương.']]
  });
  A('MG', {
    e: [['Lycée và Baccalauréat', 'BEPC và Bac.'], ['Đào tạo kỹ thuật', 'Lycée kỹ thuật.'], ['Đại học Antananarivo', 'Đại học công.']],
    x: 'Baccalauréat (Madagascar)',
    f: [['independence_day', 'Ngày Độc lập', '26/6', 'fixed', 'xem đèn lồng và pháo hoa', 1960], ['famadihana', 'Famadihana', 'Tháng 7–9 (vùng cao nguyên)', 'variable', 'tìm hiểu lễ khi được gia đình mời'], ['alahamady_be', 'Alahamady Be', 'Năm mới Malagasy, khoảng tháng 3', 'lunar', 'tham gia nghi lễ ở Ambohimanga']],
    m: [['Đăng ký dân sự', 'Hôn nhân dân sự có hiệu lực.'], ['Vodiondry', 'Lễ hỏi truyền thống; quà được thỏa thuận.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Romazava', 'Ravitoto', 'Mofo gasy', 'Koba', 'Lasary'],
    w: fr('Madagascar', 'Quỹ CNaPS cho người làm công.')
  });
  A('MW', {
    e: [['MSCE', 'Kỳ thi cuối trung học Malawi.'], ['Đào tạo nghề', 'Trường kỹ thuật TEVET.'], ['Đại học', 'Đại học công.']],
    x: 'MSCE (Malawi)',
    f: [['independence_day', 'Ngày Độc lập', '6/7', 'fixed', 'tham gia hoạt động công cộng', 1964], ['lake_of_stars', 'Lake of Stars Festival', 'Tháng 9–10', 'variable', 'nghe nhạc bên hồ'], ['kamuzu_day', 'Kamuzu Day', '14/5', 'fixed', 'tham gia hoạt động công cộng']],
    m: [['Dân sự, tôn giáo hoặc tục lệ', 'Luật Hôn nhân 2015 công nhận nhiều hình thức.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lobola', 'Ở một số vùng; mức được thỏa thuận.']],
    d: ['Nsima', 'Chambo', 'Ndiwo', 'Kondowole', 'Mandasi'],
    w: [['Employment Act 2000', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['Lương tối thiểu', 'Có mức tối thiểu.'], ['Nông nghiệp', 'Phần lớn làm nông.'], ['Quỹ hưu trí', 'Luật Hưu trí bắt buộc với người làm công.']]
  });
  A('ML', {
    e: [['Lycée và Baccalauréat', 'DEF và Bac.'], ['Đào tạo nghề', 'Trung tâm nghề.'], ['Đại học Bamako', 'Đại học công.']],
    x: 'Baccalauréat (Mali)',
    f: [['independence_day', 'Ngày Độc lập', '22/9', 'fixed', 'tham gia hoạt động công cộng', 1960], ['festival_niger', 'Festival sur le Niger (Ségou)', 'Tháng 2', 'variable', 'nghe nhạc bên sông'], ['tabaski', 'Tabaski', 'Eid al-Adha', 'lunar', 'chia sẻ bữa ăn']],
    m: [['Bộ luật Gia đình', 'Hôn nhân dân sự và tôn giáo được công nhận.'], ['Chế độ hôn nhân', 'Khi đăng ký chọn chế độ; game không mặc định.'], ['Độ tuổi', 'Mốc luật: nam 18, nữ 16.']],
    d: ['Tiguadege na', 'Tô', 'Riz au gras', 'Fakoye', 'Dégué'],
    w: fr('Mali', 'Viện INPS cho người làm công.')
  });
  A('MR', {
    e: [['Lycée và Baccalauréat', 'Song ngữ Ả Rập – Pháp.'], ['Đào tạo nghề', 'Trung tâm nghề.'], ['Đại học Nouakchott', 'Đại học công.']],
    x: 'Baccalauréat (Mauritania)',
    f: [['independence_day', 'Ngày Độc lập', '28/11', 'fixed', 'tham gia hoạt động công cộng', 1960], ['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng'], ['villes_anciennes', 'Festival des Villes Anciennes', 'Theo năm', 'variable', 'tìm hiểu Chinguetti, Ouadane']],
    m: [['Bộ luật Gia đình', 'Hôn nhân theo luật gia đình.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Mahr', 'Mahr được thỏa thuận.']],
    d: ['Thieboudienne', 'Méchoui', 'Couscous', 'Zrig', 'Trà bạc hà']
    , w: fr('Mauritania', 'Quỹ CNSS cho người làm công.')
  });
  A('MU', {
    e: [['HSC (Cambridge)', 'Chứng chỉ trung học cao cấp.'], ['Đào tạo nghề (MITD)', 'Viện đào tạo nghề.'], ['Đại học Mauritius', 'Học phí miễn cho bậc cử nhân trường công.']],
    x: 'HSC (Mauritius)',
    f: [['independence_day', 'Ngày Độc lập', '12/3', 'fixed', 'tham gia hoạt động công cộng', 1968], ['cavadee', 'Thaipoosam Cavadee', 'Tháng 1–2', 'lunar', 'xem rước của cộng đồng Tamil'], ['spring_festival', 'Tết Nguyên đán', 'Đầu năm âm lịch', 'lunar', 'xem múa lân ở Port Louis']],
    m: [['Đăng ký dân sự', 'Hôn nhân dân sự tại văn phòng hộ tịch.'], ['Lễ tôn giáo', 'Lễ Hindu, Hồi giáo, Công giáo phổ biến.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Dholl puri', 'Rougaille', 'Biryani Mauritius', 'Gâteau piment', 'Mine frit'],
    w: [['Workers’ Rights Act 2019', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 45 giờ/tuần.'], ['Lương tối thiểu', 'Có lương tối thiểu quốc gia.'], ['CSG', 'Đóng Đóng góp Xã hội Chung.'], ['Du lịch', 'Nhiều việc làm trong khách sạn.']]
  });
  A('MA', {
    e: [['Baccalauréat', 'Kỳ thi bac khu vực và quốc gia.'], ['Đào tạo nghề (OFPPT)', 'Trung tâm đào tạo nghề.'], ['Đại học', 'Đại học mở và trường lớn có tuyển chọn.']],
    x: 'Baccalauréat (Morocco)',
    f: [['throne_day', 'Ngày Ngai vàng', '30/7', 'fixed', 'tham gia hoạt động công cộng'], ['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng'], ['imilchil', 'Moussem Imilchil', 'Tháng 9', 'variable', 'tìm hiểu lễ hội người Amazigh vùng Atlas']],
    m: [['Moudawana', 'Bộ luật Gia đình 2004; hôn nhân lập trước adoul.'], ['Độ tuổi 18', 'Mốc luật: 18, có ngoại lệ do thẩm phán.'], ['Sadaq', 'Sadaq được thỏa thuận.']],
    d: ['Tajine', 'Couscous', 'Harira', 'Pastilla', 'Msemen'],
    w: [['Code du travail 2004', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 44 giờ/tuần.'], ['Phép năm', 'Mốc luật: 1,5 ngày mỗi tháng.'], ['CNSS và AMO', 'Bảo hiểm xã hội và y tế bắt buộc.'], ['SMIG', 'Lương tối thiểu.']]
  });
  A('MZ', {
    e: [['Ensino secundário', 'Kỳ thi lớp 12.'], ['Đào tạo kỹ thuật', 'Trường kỹ thuật – nghề.'], ['Đại học Eduardo Mondlane', 'Đại học công có kỳ thi đầu vào.']],
    f: [['independence_day', 'Ngày Độc lập', '25/6', 'fixed', 'tham gia hoạt động công cộng', 1975], ['heroes_day', 'Ngày Anh hùng', '3/2', 'fixed', 'tham gia tưởng niệm'], ['marrabenta', 'Marrabenta Festival', 'Tháng 2', 'variable', 'nghe nhạc marrabenta']],
    m: [['Lei da Família', 'Công nhận hôn nhân dân sự, tôn giáo và tục lệ.'], ['Lobolo', 'Sính lễ phổ biến ở miền nam; mức được thỏa thuận.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Matapa', 'Galinha à zambeziana', 'Piri-piri', 'Xima', 'Caril de camarão'],
    w: [['Lei do Trabalho 2023', 'Luật Lao động mới.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['INSS', 'Bảo hiểm xã hội.'], ['Lương tối thiểu theo ngành', 'Có mức theo ngành.'], ['Bất ổn Cabo Delgado', 'Xung đột ảnh hưởng việc làm phía bắc.']]
  });
  A('NA', {
    e: [['NSSCAS', 'Chứng chỉ trung học cao cấp Namibia.'], ['VTC', 'Trung tâm đào tạo nghề.'], ['UNAM và NUST', 'Có quỹ hỗ trợ NSFAF.']],
    x: 'NSSCAS (Namibia)',
    f: [['independence_day', 'Ngày Độc lập', '21/3', 'fixed', 'tham gia hoạt động công cộng', 1990], ['heroes_day', 'Ngày Anh hùng', '26/8', 'fixed', 'tham gia tưởng niệm'], ['windhoek_karneval', 'Windhoek Karneval', 'Tháng 4', 'variable', 'xem diễu hành']],
    m: [['Dân sự hoặc tục lệ', 'Có hôn nhân dân sự và tục lệ.'], ['Lobola', 'Ở một số cộng đồng; mức được thỏa thuận.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Kapana', 'Oshifima', 'Potjiekos', 'Biltong', 'Mopane worms'],
    w: [['Labour Act 2007', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 45 giờ/tuần.'], ['Phép năm', 'Mốc luật: 4 tuần liên tiếp.'], ['Social Security Commission', 'Ủy ban An sinh Xã hội.'], ['Lương tối thiểu', 'Có lương tối thiểu quốc gia từ 2025.']]
  });
  A('NE', {
    e: [['Lycée và Baccalauréat', 'BEPC và Bac.'], ['Đào tạo nghề', 'Trung tâm nghề.'], ['Đại học Abdou Moumouni', 'Đại học công.']],
    x: 'Baccalauréat (Niger)',
    f: [['cure_salee', 'Cure Salée (In-Gall)', 'Tháng 9', 'variable', 'tìm hiểu lễ của người chăn nuôi'], ['republic_day', 'Ngày Cộng hòa', '18/12', 'fixed', 'tham gia hoạt động công cộng', 1958], ['tabaski', 'Tabaski', 'Eid al-Adha', 'lunar', 'chia sẻ bữa ăn']],
    m: [['Dân sự, Hồi giáo, tục lệ', 'Có nhiều hình thức hôn nhân.'], ['Độ tuổi', 'Tảo hôn phổ biến; game giữ nguyên tắc tự nguyện, không ép.'], ['Sadaki', 'Sính lễ được thỏa thuận.']],
    d: ['Djerma stew', 'Tuwo', 'Kilishi', 'Fura', 'Dambou']
    , w: fr('Niger', 'Quỹ CNSS cho người làm công.')
  });
  A('NG', {
    e: [['WASSCE/NECO và JAMB UTME', 'Kỳ thi cuối trung học và kỳ thi JAMB vào đại học.'], ['Technical college và polytechnic', 'Trường kỹ thuật và bách khoa.'], ['Đại học', 'Xét theo UTME và kỳ kiểm tra của trường.']],
    x: 'JAMB UTME (Nigeria)',
    f: [['independence_day', 'Ngày Độc lập', '1/10', 'fixed', 'tham gia hoạt động công cộng', 1960], ['durbar', 'Durbar (Kano)', 'Dịp Eid', 'lunar', 'xem đoàn kỵ sĩ diễu hành'], ['new_yam', 'Lễ hội Khoai mới (Iri ji)', 'Tháng 8–9', 'variable', 'tham gia lễ mừng mùa của người Igbo']],
    m: [['Đăng ký theo luật hoặc tục lệ', 'Có hôn nhân theo Marriage Act, Hồi giáo và tục lệ.'], ['Sính lễ', 'Mức được thỏa thuận; khác theo vùng.'], ['Độ tuổi', 'Luật quyền trẻ em đặt 18 nhưng không áp đồng đều mọi bang.']],
    d: ['Jollof rice', 'Egusi soup', 'Suya', 'Pounded yam', 'Moi moi'],
    w: [['Labour Act', 'Văn bản chính, cùng các luật chuyên ngành.'], ['Lương tối thiểu quốc gia', 'Mức tối thiểu quốc gia điều chỉnh năm 2024.'], ['Lương hưu đóng góp', 'Chương trình hưu trí đóng góp bắt buộc.'], ['NSITF', 'Quỹ bồi thường tai nạn lao động.'], ['Phi chính thức', 'Phần lớn người làm việc phi chính thức.']]
  });
  A('RW', {
    e: [['Kỳ thi quốc gia NESA', 'Kỳ thi cuối trung học quốc gia.'], ['TVET', 'Trường kỹ thuật và RP.'], ['Đại học Rwanda', 'Có học bổng chính phủ.']],
    x: 'Kỳ thi quốc gia (Rwanda)',
    f: [['liberation_day', 'Ngày Giải phóng', '4/7', 'fixed', 'tham gia hoạt động công cộng', 1994], ['umuganura', 'Umuganura', 'Thứ Sáu đầu tháng 8', 'variable', 'mừng mùa màng'], ['kwibuka', 'Kwibuka', '7/4', 'fixed', 'tham gia tưởng niệm trong không khí trang nghiêm']],
    m: [['Đăng ký dân sự', 'Chỉ hôn nhân dân sự có hiệu lực.'], ['Inkwano', 'Sính lễ truyền thống được thỏa thuận.'], ['Độ tuổi 21', 'Mốc luật: 21.']],
    d: ['Isombe', 'Brochettes', 'Ugali', 'Ibihaza', 'Matoke'],
    w: [['Luật Lao động 2018', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 45 giờ/tuần.'], ['RSSB', 'Cơ quan An sinh Xã hội Rwanda.'], ['Umuganda', 'Ngày lao động cộng đồng hằng tháng.'], ['Phi chính thức', 'Giữ ghi chép công.']]
  });
  A('ST', {
    e: [['Ensino secundário', 'Hệ thống tiếng Bồ Đào Nha.'], ['Đào tạo nghề', 'Trung tâm nghề.'], ['USTP', 'Đại học São Tomé và Príncipe.']],
    f: [['independence_day', 'Ngày Độc lập', '12/7', 'fixed', 'tham gia hoạt động công cộng', 1975], ['auto_floripes', 'Auto de Floripes', '15/8 (Príncipe)', 'fixed', 'xem kịch đường phố'], ['christmas', 'Giáng sinh', '25/12', 'fixed', 'sum họp gia đình']],
    m: [['Dân sự hoặc nhà thờ', 'Có hôn nhân dân sự và Công giáo.'], ['Chung sống', 'Chung sống không đăng ký phổ biến.'], ['Độ tuổi', 'Hai người đủ tuổi luật định.']],
    d: ['Calulu', 'Cá nướng', 'Chuối nướng', 'Cacao', 'Feijoada']
    , w: [['Lei do Trabalho', 'Văn bản chính.'], ['Cacao', 'Ngành cacao quan trọng.'], ['INSS', 'Bảo hiểm xã hội.'], ['Du lịch', 'Ngành du lịch nhỏ đang phát triển.'], ['Phi chính thức', 'Giữ ghi chép công.']]
  });
  A('SN', {
    e: [['Lycée và Baccalauréat', 'BFEM và Bac.'], ['Đào tạo nghề', 'Trung tâm nghề và học việc.'], ['Đại học Cheikh Anta Diop', 'Đại học công.']],
    x: 'Baccalauréat (Senegal)',
    f: [['independence_day', 'Ngày Độc lập', '4/4', 'fixed', 'xem diễu hành', 1960], ['tabaski', 'Tabaski', 'Eid al-Adha', 'lunar', 'chia sẻ bữa ăn'], ['magal_touba', 'Grand Magal de Touba', 'Theo lịch Hồi giáo', 'lunar', 'hành hương khi phù hợp đức tin']],
    m: [['Code de la famille', 'Hôn nhân dân sự hoặc tôn giáo được đăng ký.'], ['Chế độ hôn nhân', 'Người chồng chọn chế độ một vợ hoặc nhiều vợ khi đăng ký; game không mặc định.'], ['Độ tuổi', 'Mốc luật: nam 18, nữ 16.']],
    d: ['Thieboudienne', 'Yassa poulet', 'Mafé', 'Thiakry', 'Pastels'],
    w: fr('Senegal', 'IPRES (hưu trí) và CSS (an sinh) cho người làm công.')
  });
  A('SC', {
    e: [['Trung học và A Level', 'Học sinh thi IGCSE/A Level.'], ['Đào tạo nghề', 'Học viện chuyên ngành.'], ['Đại học Seychelles', 'Nhiều người học nước ngoài.']],
    f: [['national_day', 'Ngày Độc lập', '29/6', 'fixed', 'tham gia hoạt động công cộng', 1976], ['festival_kreol', 'Festival Kreol', 'Tháng 10', 'variable', 'xem nhạc và ẩm thực Creole'], ['constitution_day', 'Ngày Hiến pháp', '18/6', 'fixed', 'tham gia hoạt động công cộng']],
    m: [['Đăng ký dân sự', 'Hôn nhân dân sự tại văn phòng hộ tịch.'], ['Lễ nhà thờ', 'Tùy chọn.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Cà ri bạch tuộc', 'Ladob', 'Cá nướng', 'Cơm dừa', 'Salad bulbe palmiste'],
    w: [['Employment Act 1995', 'Văn bản chính.'], ['Giờ làm', 'Mốc tham chiếu: 40 giờ/tuần.'], ['Lương tối thiểu', 'Có mức tối thiểu quốc gia.'], ['Du lịch', 'Nhiều việc làm trong khu nghỉ dưỡng.'], ['Quỹ hưu trí', 'Quỹ Hưu trí Seychelles.']]
  });
  A('SL', {
    e: [['WASSCE', 'Kỳ thi WAEC cuối trung học.'], ['Đào tạo kỹ thuật', 'Viện kỹ thuật.'], ['Đại học', 'Fourah Bay College và trường khác.']],
    x: 'WASSCE (Sierra Leone)',
    f: [['independence_day', 'Ngày Độc lập', '27/4', 'fixed', 'tham gia hoạt động công cộng', 1961], ['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng'], ['lantern_parade', 'Lantern Parade (Freetown)', 'Dịp lễ lớn', 'variable', 'xem diễu hành đèn lồng']],
    m: [['Dân sự, tôn giáo, tục lệ', 'Có nhiều hình thức hôn nhân.'], ['Độ tuổi 18', 'Mốc luật: 18 từ 2024.'], ['Sính lễ', 'Mức được thỏa thuận.']],
    d: ['Cassava leaves', 'Groundnut stew', 'Jollof', 'Fufu', 'Pepper soup'],
    w: [['Employment Act 2023', 'Luật việc làm mới.'], ['NASSIT', 'Quỹ An sinh Xã hội.'], ['Lương tối thiểu', 'Có mức tối thiểu.'], ['Khai mỏ', 'Ngành mỏ quan trọng.'], ['Phi chính thức', 'Giữ ghi chép công.']]
  });
  A('SO', {
    e: [['Kỳ thi quốc gia lớp 12', 'Kỳ thi quốc gia đã được tổ chức lại.'], ['Đào tạo nghề', 'Trung tâm nghề.'], ['Đại học', 'Nhiều trường tư.']],
    f: [['independence_day', 'Ngày Độc lập', '1/7', 'fixed', 'tham gia hoạt động công cộng', 1960], ['eid_fitr', 'Ciidul Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng'], ['eid_adha', 'Ciidul Adxa', 'Theo lịch Hồi giáo', 'lunar', 'chia sẻ thực phẩm']],
    m: [['Luật gia đình', 'Hôn nhân theo luật gia đình và Hồi giáo.'], ['Mahr (meher)', 'Được thỏa thuận.'], ['Đồng thuận', 'Hai người tự nguyện; tảo hôn là rủi ro thực tế.']],
    d: ['Canjeero', 'Bariis iskukaris', 'Suqaar', 'Muufo', 'Halwo'],
    w: [['Bộ luật Lao động 1972', 'Văn bản cũ, thực thi hạn chế.'], ['Phi chính thức', 'Phần lớn việc làm phi chính thức.'], ['Kiều hối', 'Nhiều gia đình dựa vào kiều hối.'], ['An ninh', 'Bất ổn ảnh hưởng nơi làm việc.'], ['Chăn nuôi', 'Ngành chăn nuôi quan trọng.']]
  });
  A('ZA', {
    e: [['National Senior Certificate (Matric)', 'Kỳ thi quốc gia lớp 12.'], ['TVET college', 'Trường đào tạo nghề công.'], ['Đại học', 'Có hỗ trợ NSFAS.']],
    x: 'National Senior Certificate (Nam Phi)',
    f: [['freedom_day', 'Freedom Day', '27/4', 'fixed', 'tham gia hoạt động cộng đồng', 1994], ['heritage_day', 'Heritage Day', '24/9', 'fixed', 'nướng braai cùng bạn bè'], ['youth_day', 'Youth Day', '16/6', 'fixed', 'tìm hiểu sự kiện Soweto 1976']],
    m: [['Marriage Act và tục lệ', 'Có hôn nhân dân sự, tục lệ (đăng ký theo luật riêng) và civil union.'], ['Lobola', 'Sính lễ phổ biến trong hôn nhân tục lệ; mức được thỏa thuận.'], ['Hôn nhân bình đẳng', 'Từ 2006, hai người cùng giới có thể kết hôn.']],
    d: ['Bobotie', 'Bunny chow', 'Braai', 'Pap', 'Malva pudding'],
    w: [['BCEA', 'Luật Điều kiện Việc làm Cơ bản.'], ['Giờ làm', 'Mốc luật: 45 giờ/tuần.'], ['Phép năm', 'Mốc luật: 21 ngày liên tiếp.'], ['UIF', 'Quỹ Bảo hiểm Thất nghiệp.'], ['Lương tối thiểu quốc gia', 'Có lương tối thiểu quốc gia.']]
  });
  A('SS', {
    e: [['Chứng chỉ trung học Nam Sudan', 'Kỳ thi quốc gia lớp 12.'], ['Đào tạo nghề', 'Trung tâm nghề hạn chế.'], ['Đại học Juba', 'Đại học công.']],
    f: [['independence_day', 'Ngày Độc lập', '9/7', 'fixed', 'tham gia hoạt động công cộng', 2011], ['christmas', 'Giáng sinh', '25/12', 'fixed', 'sum họp gia đình'], ['easter', 'Lễ Phục sinh', 'Mùa xuân', 'variable', 'dự lễ cộng đồng']],
    m: [['Hôn nhân tục lệ', 'Hôn nhân tục lệ phổ biến, sính lễ bằng gia súc.'], ['Độ tuổi', 'Tảo hôn là rủi ro thực tế; game giữ nguyên tắc tự nguyện.'], ['Đăng ký', 'Đăng ký giúp bảo vệ quyền lợi.']],
    d: ['Kisra', 'Asida', 'Mullah', 'Cá phơi', 'Ful']
    , w: [['Labour Act 2017', 'Văn bản chính.'], ['Phi chính thức', 'Phần lớn việc làm phi chính thức.'], ['Xung đột', 'Bất ổn ảnh hưởng việc làm và đi lại.'], ['Dầu mỏ', 'Ngành dầu mỏ chi phối ngân sách.'], ['Khu vực công', 'Lương công chức có khi chậm.']]
  });
  A('SD', {
    e: [['Sudan School Certificate', 'Kỳ thi quốc gia cuối trung học, bị gián đoạn do chiến tranh từ 2023.'], ['Đào tạo kỹ thuật', 'Trường kỹ thuật.'], ['Đại học', 'Đại học công; nhiều trường phải dời đi.']],
    x: 'Sudan School Certificate',
    f: [['independence_day', 'Ngày Độc lập', '1/1', 'fixed', 'tham gia hoạt động cộng đồng', 1956], ['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng'], ['mawlid', 'Mawlid', 'Theo lịch Hồi giáo', 'lunar', 'xem lễ của các nhóm Sufi']],
    m: [['Luật Tình trạng Cá nhân', 'Hôn nhân theo luật Hồi giáo; Kitô giáo theo quy định riêng.'], ['Mahr', 'Được thỏa thuận.'], ['Chiến tranh', 'Di tản ảnh hưởng thủ tục và gia đình.']],
    d: ['Ful medames', 'Kisra', 'Asida', 'Mullah', 'Tamia']
    , w: [['Luật Lao động', 'Văn bản chính.'], ['Chiến tranh từ 2023', 'Xung đột làm mất việc và di tản lớn.'], ['Khu vực công', 'Lương có khi bị gián đoạn.'], ['Nông nghiệp', 'Nhiều người làm nông.'], ['Lao động di cư', 'Nhiều người phải đi làm nước khác.']]
  });
  A('TZ', {
    e: [['CSEE và ACSEE', 'Kỳ thi NECTA lớp 4 và lớp 6 trung học.'], ['VETA', 'Cơ quan đào tạo nghề.'], ['Đại học', 'Có khoản vay HESLB.']],
    x: 'ACSEE (Tanzania)',
    f: [['union_day', 'Ngày Liên hiệp', '26/4', 'fixed', 'tham gia hoạt động công cộng', 1964], ['independence_day', 'Ngày Độc lập', '9/12', 'fixed', 'tham gia hoạt động công cộng', 1961], ['sauti_za_busara', 'Sauti za Busara (Zanzibar)', 'Tháng 2', 'variable', 'nghe nhạc châu Phi']],
    m: [['Luật Hôn nhân 1971', 'Công nhận dân sự, tôn giáo, tục lệ.'], ['Mahari', 'Sính lễ được thỏa thuận.'], ['Độ tuổi', 'Luật còn ngoại lệ cho nữ; tảo hôn là rủi ro thực tế.']],
    d: ['Ugali', 'Nyama choma', 'Pilau', 'Chipsi mayai', 'Mishkaki'],
    w: [['Employment and Labour Relations Act 2004', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 45 giờ/tuần.'], ['Phép năm', 'Mốc luật: 28 ngày liên tiếp.'], ['NSSF', 'Quỹ An sinh Xã hội.'], ['Lương tối thiểu theo ngành', 'Có mức theo ngành.']]
  });
  A('TG', {
    e: [['Lycée và Baccalauréat', 'BEPC và Bac.'], ['Đào tạo kỹ thuật', 'Lycée kỹ thuật.'], ['Đại học Lomé', 'Đại học công.']],
    x: 'Baccalauréat (Togo)',
    f: [['independence_day', 'Ngày Độc lập', '27/4', 'fixed', 'tham gia hoạt động công cộng', 1960], ['evala', 'Evala (Kara)', 'Tháng 7', 'variable', 'xem đấu vật truyền thống'], ['epe_ekpe', 'Epé Ekpé (Glidji)', 'Tháng 9', 'variable', 'xem lễ đá thiêng của người Guin']],
    m: [['Đăng ký dân sự', 'Hôn nhân dân sự có hiệu lực.'], ['Dot', 'Sính lễ được thỏa thuận.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Fufu', 'Akoumé', 'Ablo', 'Gboma dessi', 'Koklo meme'],
    w: fr('Togo', 'Quỹ CNSS cho người làm công.')
  });
  A('TN', {
    e: [['Baccalauréat', 'Kỳ thi bac quốc gia.'], ['Đào tạo nghề', 'Trung tâm nghề.'], ['Đại học', 'Phân bổ theo điểm bac.']],
    x: 'Baccalauréat (Tunisia)',
    f: [['independence_day', 'Ngày Độc lập', '20/3', 'fixed', 'tham gia hoạt động công cộng', 1956], ['eid_fitr', 'Eid al-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng'], ['carthage_festival', 'Festival International de Carthage', 'Tháng 7–8', 'variable', 'xem biểu diễn ở nhà hát cổ']],
    m: [['Code du statut personnel', 'Bộ luật 1956: một vợ một chồng, đăng ký dân sự.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Mahr', 'Mahr tượng trưng được thỏa thuận.']],
    d: ['Couscous', 'Brik', 'Lablabi', 'Shakshuka', 'Makroudh'],
    w: [['Code du travail', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần, nhiều nơi áp 40 giờ.'], ['CNSS', 'Bảo hiểm xã hội.'], ['SMIG', 'Lương tối thiểu.'], ['Hợp đồng', 'Năm 2025 có thay đổi về hợp đồng có thời hạn.']]
  });
  A('UG', {
    e: [['UCE và UACE', 'Kỳ thi UNEB lớp 4 và 6 trung học.'], ['BTVET', 'Đào tạo kỹ thuật và nghề.'], ['Đại học Makerere và trường khác', 'Có suất học bổng chính phủ.']],
    x: 'UACE (Uganda)',
    f: [['independence_day', 'Ngày Độc lập', '9/10', 'fixed', 'tham gia hoạt động công cộng', 1962], ['martyrs_day', 'Ngày Các Thánh Tử đạo', '3/6', 'fixed', 'hành hương Namugongo khi phù hợp đức tin'], ['heroes_day', 'Ngày Anh hùng', '9/6', 'fixed', 'tham gia tưởng niệm']],
    m: [['Dân sự, tôn giáo, tục lệ', 'Có nhiều hình thức hôn nhân.'], ['Kwanjula/sính lễ', 'Lễ giới thiệu và sính lễ phổ biến; mức được thỏa thuận.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Matooke', 'Rolex (bánh cuộn trứng)', 'Luwombo', 'Posho', 'Groundnut stew'],
    w: [['Employment Act 2006', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['NSSF', 'Quỹ An sinh Xã hội.'], ['Lương tối thiểu', 'Chưa có mức chung được áp dụng thực tế.'], ['Phi chính thức', 'Giữ ghi chép công.']]
  });
  A('ZM', {
    e: [['Grade 12 (ECZ)', 'Kỳ thi cuối trung học do ECZ tổ chức.'], ['TEVETA', 'Đào tạo kỹ thuật và nghề.'], ['Đại học Zambia', 'Có khoản vay HELSB.']],
    x: 'Grade 12 (Zambia)',
    f: [['independence_day', 'Ngày Độc lập', '24/10', 'fixed', 'tham gia hoạt động công cộng', 1964], ['kuomboka', 'Kuomboka', 'Cuối mùa mưa, tháng 3–4', 'variable', 'xem thuyền hoàng gia Lozi'], ['ncwala', 'Ncwala', 'Tháng 2', 'variable', 'xem lễ mừng mùa của người Ngoni']],
    m: [['Dân sự hoặc tục lệ', 'Có hôn nhân dân sự và tục lệ.'], ['Lobola', 'Sính lễ phổ biến; mức được thỏa thuận.'], ['Độ tuổi 18', 'Mốc luật: 18 cho hôn nhân dân sự.']],
    d: ['Nshima', 'Ifisashi', 'Kapenta', 'Chikanda', 'Vitumbuwa'],
    w: [['Employment Code Act 2019', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['NAPSA', 'Quỹ hưu trí quốc gia.'], ['Khai mỏ đồng', 'Ngành đồng quan trọng; kiểm tra an toàn.'], ['Lương tối thiểu theo ngành', 'Có mức theo ngành.']]
  });
  A('ZW', {
    e: [['ZIMSEC O và A Level', 'Kỳ thi quốc gia.'], ['Đào tạo nghề', 'Trường bách khoa và nghề.'], ['Đại học Zimbabwe', 'Đại học công.']],
    x: 'ZIMSEC A Level (Zimbabwe)',
    f: [['independence_day', 'Ngày Độc lập', '18/4', 'fixed', 'tham gia hoạt động công cộng', 1980], ['heroes_day', 'Ngày Anh hùng', 'Thứ Hai thứ hai tháng 8', 'variable', 'tham gia tưởng niệm'], ['hifa', 'HIFA (Harare)', 'Theo năm', 'variable', 'xem biểu diễn nghệ thuật']],
    m: [['Marriages Act 2022', 'Thống nhất hôn nhân dân sự và tục lệ; nên đăng ký.'], ['Lobola (roora)', 'Sính lễ phổ biến; mức được thỏa thuận.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Sadza', 'Muriwo', 'Nyama', 'Dovi', 'Mopane worms'],
    w: [['Labour Act', 'Văn bản chính.'], ['NSSA', 'Cơ quan An sinh Xã hội.'], ['Tiền tệ biến động', 'Lương có thể trả bằng USD hoặc ZiG.'], ['Phi chính thức', 'Phần lớn việc làm phi chính thức.'], ['Giờ làm', 'Theo thỏa ước ngành và hợp đồng.']]
  });
})(globalThis.G);
