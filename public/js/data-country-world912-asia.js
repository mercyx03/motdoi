/* §13 lô 1 — châu Á & Thái Bình Dương. Định dạng: e = 3 lộ trình học [tên, ghi chú] (học thuật, nghề, bậc cao),
   x = kỳ thi/tuyển sinh chung nếu có, f = 3 lễ [id, tên, thời điểm, kiểu lịch, hoạt động], m = 3 bước cưới [tên, ghi chú],
   d = 5 món, w = 5 mục lao động [tên, ghi chú]. Mốc tham chiếu 2026; số liệu luật là mốc đọc, có ngoại lệ theo ngành/hợp đồng. */
(function (G) {
  'use strict';
  var A = G.E.COUNTRY_WORLD912.add;
  A('AF', {
    e: [['Trung học phổ thông và kỳ thi Kankor', 'Lộ trình học thuật từng dẫn tới kỳ thi vào đại học; từ năm 2021 nữ sinh bị cấm học sau lớp 6 nên nhiều gia đình phải tìm cách học khác.'], ['Học nghề và kỹ thuật', 'Trường kỹ thuật, nghề truyền thống và học việc tại xưởng; cơ hội cho nữ giới rất hạn chế dưới quy định hiện hành.'], ['Đại học công lập và tư thục', 'Đại học bị đóng với phụ nữ từ cuối năm 2022; nam sinh vẫn phải qua xét tuyển và chi phí riêng.']],
    x: 'Kankor (kỳ thi vào đại học Afghanistan)',
    f: [['eid_fitr', 'Eid al-Fitr', 'Kết thúc tháng Ramadan, theo lịch Hồi giáo', 'lunar', 'thăm họ hàng, chuẩn bị bánh kẹo và quần áo mới trong khả năng gia đình'], ['eid_adha', 'Eid al-Adha', 'Tháng Dhu al-Hijjah, theo lịch Hồi giáo', 'lunar', 'cùng gia đình chia sẻ thực phẩm cho họ hàng và người khó khăn'], ['nowruz', 'Nowruz', '21/3 (năm mới theo lịch mặt trời)', 'fixed', 'nhiều gia đình đón năm mới trong phạm vi riêng, nấu haft mewa và đi dạo mùa xuân']],
    m: [['Đồng thuận của hai bên', 'Hôn nhân cần hai người đồng ý; tảo hôn và ép cưới là rủi ro thực tế được game xem là tổn hại, không phải truyền thống bắt buộc.'], ['Nikah và giấy tờ', 'Lễ nikah tôn giáo phổ biến; đăng ký với cơ quan có thẩm quyền giúp bảo vệ quyền lợi về sau.'], ['Bàn bạc mahr và chi phí', 'Mahr và chi phí cưới được thỏa thuận; không ép gia đình vay nợ để tổ chức.']],
    d: ['Kabuli palaw (cơm thập cẩm)', 'Mantu (bánh hấp nhân thịt)', 'Ashak (bánh nhân hẹ)', 'Bolani (bánh nướng nhân rau)', 'Qorma (món hầm)'],
    w: [['Luật Lao động Afghanistan', 'Văn bản năm 2007 vẫn là mốc tham chiếu; thực thi hiện nay không ổn định và khác nhau theo nơi.'], ['Giờ làm', 'Mốc luật thường được nêu là 40 giờ/tuần; nhiều việc phi chính thức không có hợp đồng.'], ['Hạn chế với lao động nữ', 'Nhiều ngành bị hạn chế với phụ nữ từ 2021; game không coi đó là lựa chọn cá nhân của người chơi.'], ['Việc làm phi chính thức', 'Phần lớn lao động ở nông nghiệp, buôn bán nhỏ, làm công nhật; thu nhập bấp bênh.'], ['Ghi chép công và tiền trả', 'Giữ ghi chép buổi làm và khoản đã nhận khi không có hợp đồng viết.']]
  });
  A('BD', {
    e: [['SSC và HSC', 'Hai kỳ thi công cộng ở lớp 10 và lớp 12 quyết định nhiều hướng học tiếp.'], ['Bằng nghề kỹ thuật (diploma)', 'Các viện bách khoa và trung tâm đào tạo kỹ thuật có chương trình diploma và ngắn hạn.'], ['Đại học công lập và tư thục', 'Đại học công lập cạnh tranh qua kỳ tuyển sinh riêng; đại học tư có học phí cao hơn.']],
    x: 'HSC (kỳ thi cuối bậc trung học Bangladesh)',
    f: [['pohela_boishakh', 'Pohela Boishakh', '14/4', 'fixed', 'tham gia tuần hành mừng năm mới Bengal và ăn panta ilish cùng bạn bè'], ['ekushey', 'Ngày Ngôn ngữ Mẹ đẻ (Ekushey)', '21/2', 'fixed', 'đặt hoa tưởng niệm tại Shaheed Minar và đọc thơ tiếng Bengal'], ['eid_fitr', 'Eid ul-Fitr', 'Kết thúc Ramadan, theo lịch Hồi giáo', 'lunar', 'về quê sum họp, chuẩn bị shemai và quà cho trẻ em trong khả năng']],
    m: [['Đăng ký kết hôn (kabin)', 'Hôn nhân Hồi giáo cần đăng ký với kazi; tôn giáo khác có quy định riêng.'], ['Độ tuổi kết hôn', 'Mốc luật: nam 21, nữ 18; tảo hôn bị cấm dù vẫn còn xảy ra.'], ['Thỏa thuận denmohor', 'Khoản denmohor ghi vào giấy kết hôn là quyền của người vợ; của hồi môn bị luật cấm.']],
    d: ['Bhuna khichuri', 'Ilish bhapa (cá hilsa hấp mù tạt)', 'Kacchi biryani', 'Pitha (bánh gạo)', 'Bhorta (món nghiền)'],
    w: [['Luật Lao động Bangladesh 2006', 'Văn bản chính cho quan hệ lao động, đã sửa đổi nhiều lần.'], ['Giờ làm', 'Mốc luật: 8 giờ/ngày, 48 giờ/tuần, làm thêm có giới hạn và trả cao hơn.'], ['Phép năm', 'Phép năm tích theo số ngày đã làm, cùng phép lễ hội và phép ốm có điều kiện.'], ['Lương tối thiểu theo ngành', 'Hội đồng Lương tối thiểu đặt mức theo từng ngành như may mặc; không có một mức chung cho mọi nghề.'], ['An toàn nhà xưởng', 'Sau thảm họa Rana Plaza 2013, kiểm tra an toàn nhà xưởng được chú trọng; báo cáo nguy cơ cụ thể.']]
  });
  A('BT', {
    e: [['Lớp 10 và lớp 12 (BCSE/BHSEC)', 'Kỳ thi cuối lớp 10 và lớp 12 do BCSEA tổ chức quyết định học tiếp.'], ['Viện đào tạo kỹ thuật (TTI)', 'Các viện TTI và Viện Zorig Chusum dạy nghề kỹ thuật và mười ba nghề truyền thống.'], ['Đại học Hoàng gia Bhutan', 'Các trường thành viên và học bổng chính phủ xét theo kết quả lớp 12.']],
    x: 'BHSEC (kỳ thi lớp 12 Bhutan)',
    f: [['losar', 'Losar', 'Đầu năm theo lịch Bhutan', 'lunar', 'thăm gia đình, ăn bữa năm mới và tham gia trò bắn cung giải trí'], ['tshechu', 'Paro Tshechu', 'Mùa xuân theo lịch Bhutan', 'lunar', 'xem các điệu múa mặt nạ cham ở dzong, mặc gho/kira lịch sự'], ['national_day', 'Ngày Quốc khánh Bhutan', '17/12', 'fixed', 'xem lễ kỷ niệm và các hoạt động cộng đồng', 1907]],
    m: [['Đăng ký theo Luật Hôn nhân', 'Hôn nhân được đăng ký với tòa án theo Luật Hôn nhân; lễ truyền thống không thay đăng ký.'], ['Độ tuổi 18', 'Mốc luật: cả hai từ đủ 18 tuổi.'], ['Lễ ban phước', 'Nhiều gia đình mời lama làm lễ; hai người tự quyết quy mô.']],
    d: ['Ema datshi (ớt nấu phô mai)', 'Kewa datshi (khoai tây phô mai)', 'Phaksha paa (thịt heo xào ớt)', 'Momo', 'Cơm đỏ Bhutan'],
    w: [['Luật Lao động và Việc làm 2007', 'Văn bản chính về hợp đồng, giờ làm và an toàn.'], ['Giờ làm', 'Mốc luật: 8 giờ/ngày, 48 giờ/tuần.'], ['Hợp đồng lao động', 'Hợp đồng ghi điều kiện làm việc; đối chiếu trước khi nhận việc.'], ['Quỹ hưu trí', 'Người lao động có thể tham gia quỹ hưu trí và quỹ dự phòng theo quy định.'], ['Thị trường việc làm trẻ', 'Thanh niên tìm việc gặp cạnh tranh lớn; nhiều người cân nhắc đi làm nước ngoài.']]
  });
  A('BN', {
    e: [['Brunei GCE O/A Level', 'Học sinh thi chứng chỉ GCE O Level rồi A Level để vào đại học.'], ['Viện Giáo dục Kỹ thuật (IBTE)', 'IBTE đào tạo chứng chỉ kỹ thuật, nghề và học việc.'], ['Đại học Brunei Darussalam và trường đại học khác', 'UBD, UTB và các trường xét theo kết quả A Level hoặc tương đương.']],
    x: 'GCE A Level (Brunei)',
    f: [['hari_raya', 'Hari Raya Aidilfitri', 'Sau Ramadan, theo lịch Hồi giáo', 'lunar', 'tham gia ngày mở cửa thăm hỏi (open house) và chuẩn bị quà theo khả năng'], ['national_day', 'Ngày Quốc khánh Brunei', '23/2', 'fixed', 'xem diễu hành và hoạt động cộng đồng', 1984], ['sultan_birthday', 'Sinh nhật Quốc vương', '15/7', 'fixed', 'tham gia hoạt động công cộng của khu dân cư']],
    m: [['Luật gia đình Hồi giáo', 'Người Hồi giáo kết hôn theo luật gia đình Hồi giáo; người không theo đạo có luật dân sự riêng.'], ['Khóa học tiền hôn nhân', 'Các cặp Hồi giáo thường tham gia khóa tư vấn trước hôn nhân.'], ['Lễ akad nikah và bersanding', 'Lễ cưới có nhiều phần; hai gia đình bàn ngân sách thay vì chạy đua.']],
    d: ['Ambuyat', 'Nasi katok', 'Kelupis', 'Udang sambal serai', 'Kuih mor'],
    w: [['Lệnh Việc làm 2009', 'Văn bản chính về hợp đồng, giờ làm, nghỉ phép.'], ['Giờ làm', 'Mốc luật thường gặp: 8 giờ/ngày, 44 giờ/tuần.'], ['Quỹ tiết kiệm (TAP/SPK)', 'Người lao động và chủ đóng quỹ tiết kiệm hưu trí theo quy định.'], ['Phép năm', 'Phép năm tăng theo thâm niên, có điều kiện thời gian làm việc.'], ['Lao động nước ngoài', 'Lao động nước ngoài cần giấy phép và chủ bảo lãnh; quyền lợi ghi trong hợp đồng.']]
  });
  A('KH', {
    e: [['Bac II (tốt nghiệp THPT)', 'Kỳ thi quốc gia lớp 12 là điều kiện học đại học.'], ['Trung tâm và viện đào tạo nghề', 'Các viện kỹ thuật có chứng chỉ và bằng nghề, nhiều chương trình ngắn hạn.'], ['Đại học công lập và tư thục', 'Nhiều trường ở Phnom Penh; học bổng chính phủ xét theo kết quả Bac II.']],
    x: 'Bac II (kỳ thi quốc gia Campuchia)',
    f: [['khmer_new_year', 'Choul Chnam Thmey (Năm mới Khmer)', '13 hoặc 14–16/4', 'fixed', 'đi chùa, té nước và chơi trò dân gian cùng hàng xóm'], ['pchum_ben', 'Pchum Ben', 'Tháng 9–10 theo lịch Khmer', 'lunar', 'mang cơm đến chùa tưởng nhớ tổ tiên cùng gia đình'], ['bon_om_touk', 'Bon Om Touk (Lễ hội nước)', 'Rằm tháng Kadeuk, khoảng tháng 11', 'lunar', 'xem đua thuyền trên sông Tonle Sap']],
    m: [['Đăng ký tại xã/phường', 'Hôn nhân được đăng ký tại chính quyền địa phương; lễ cưới không thay đăng ký.'], ['Đủ tuổi luật định', 'Hai người phải đủ tuổi kết hôn theo luật dân sự và tự nguyện.'], ['Lễ cưới truyền thống', 'Lễ Khmer có nhiều nghi thức; gia đình bàn quy mô và tiền mừng phù hợp.']],
    d: ['Amok trey', 'Lok lak', 'Num banh chok', 'Samlor korko', 'Bai sach chrouk (cơm thịt heo nướng)'],
    w: [['Luật Lao động 1997', 'Văn bản chính, áp dụng cùng các thông tư bộ.'], ['Giờ làm', 'Mốc luật: 8 giờ/ngày, 48 giờ/tuần.'], ['Phép năm', 'Mốc luật: 1,5 ngày mỗi tháng làm việc, tăng theo thâm niên.'], ['Lương tối thiểu ngành may', 'Mức lương tối thiểu ngành may, giày da được điều chỉnh hằng năm.'], ['Quỹ An sinh Xã hội (NSSF)', 'Người lao động thuộc diện tham gia NSSF về tai nạn lao động và y tế.']]
  });
  A('CN', {
    e: [['Gaokao', 'Kỳ thi tuyển sinh đại học toàn quốc, tổ chức đầu tháng 6; cách chia môn khác nhau theo tỉnh.'], ['Trường dạy nghề trung cấp và cao đẳng nghề', 'Nhánh nghề sau trung học cơ sở hoặc phổ thông, có thực tập doanh nghiệp.'], ['Đại học và cao học', 'Xét tuyển chủ yếu theo điểm gaokao và chỉ tiêu tỉnh.']],
    x: 'Gaokao (kỳ thi tuyển sinh đại học Trung Quốc)',
    f: [['spring_festival', 'Xuân Tiết (Tết Âm lịch)', 'Đầu năm âm lịch', 'lunar', 'về quê sum họp, ăn bánh chẻo và trao hồng bao trong khả năng'], ['mid_autumn', 'Trung Thu', '15/8 âm lịch', 'lunar', 'ngắm trăng và chia bánh trung thu với gia đình'], ['qingming', 'Thanh Minh', 'Khoảng 4–5/4', 'solar', 'tảo mộ và đi dạo mùa xuân']],
    m: [['Đăng ký tại cơ quan dân chính', 'Hôn nhân chỉ được công nhận khi đăng ký tại cục dân chính.'], ['Độ tuổi luật định', 'Mốc luật: nam 22, nữ 20 tuổi.'], ['Sính lễ (caili)', 'Một số vùng có tục sính lễ cao; chính quyền khuyến khích giảm, hai gia đình tự thỏa thuận.']],
    d: ['Sủi cảo', 'Vịt quay Bắc Kinh', 'Mapo đậu phụ', 'Tiểu long bao', 'Mì kéo Lan Châu'],
    w: [['Luật Lao động và Luật Hợp đồng Lao động', 'Hai văn bản chính; hợp đồng viết là bắt buộc.'], ['Giờ làm', 'Mốc luật: 8 giờ/ngày, 44 giờ/tuần; nhiều nơi áp 40 giờ; làm thêm có trần.'], ['Phép năm có lương', 'Mốc: 5, 10 hoặc 15 ngày theo tổng số năm đã làm.'], ['Bảo hiểm xã hội và quỹ nhà ở', 'Năm loại bảo hiểm và quỹ dự phòng nhà ở; quyền lợi gắn hộ khẩu/nơi đóng.'], ['Văn hóa làm thêm giờ', 'Lịch “996” bị phê phán và trái luật giờ làm; đối chiếu hợp đồng trước khi nhận.']]
  });
  A('IN', {
    e: [['Lớp 12 theo hội đồng thi (CBSE, ICSE, bang)', 'Kết quả lớp 12 và các kỳ thi chung như CUET, JEE, NEET dùng để vào đại học.'], ['ITI và học nghề', 'Viện đào tạo công nghiệp (ITI) và chương trình học việc quốc gia.'], ['Đại học và viện chuyên ngành', 'IIT, NIT, đại học trung ương và bang, mỗi nơi có điều kiện riêng.']],
    x: 'CUET/JEE/NEET (các kỳ thi tuyển sinh chung của Ấn Độ)',
    f: [['diwali', 'Diwali', 'Tháng Kartika, khoảng tháng 10–11', 'lunar', 'thắp đèn diya, trao đồ ngọt với hàng xóm; nhiều gia đình không theo Hindu vẫn tham gia vui'], ['holi', 'Holi', 'Rằm tháng Phalguna, khoảng tháng 3', 'lunar', 'chơi bột màu cùng bạn bè, hỏi ý người khác trước khi ném màu'], ['republic_day', 'Ngày Cộng hòa', '26/1', 'fixed', 'xem diễu hành và chương trình ở trường', 1950]],
    m: [['Luật theo cộng đồng hoặc Luật Hôn nhân Đặc biệt', 'Có luật hôn nhân riêng cho Hindu, Hồi giáo, Kitô giáo; Luật Hôn nhân Đặc biệt 1954 cho hôn nhân dân sự.'], ['Độ tuổi', 'Mốc luật: nam 21, nữ 18.'], ['Của hồi môn bị cấm', 'Đòi của hồi môn là phạm pháp; hai gia đình bàn chi phí cưới công bằng.']],
    d: ['Biryani', 'Masala dosa', 'Chole bhature', 'Dal makhani', 'Pani puri'],
    w: [['Bốn Bộ luật Lao động', 'Các bộ luật về tiền lương, quan hệ lao động, an sinh, an toàn được áp dụng từ cuối năm 2025; quy tắc chi tiết khác nhau theo bang.'], ['Giờ làm', 'Mốc tham chiếu: 48 giờ/tuần, làm thêm trả cao hơn.'], ['Lương tối thiểu', 'Lương tối thiểu do trung ương và bang định theo vùng, nghề.'], ['EPF và ESI', 'Quỹ dự phòng (EPF) và bảo hiểm y tế ESI cho người lao động đủ điều kiện.'], ['Lao động phi chính thức', 'Phần lớn người làm việc ngoài khu vực chính thức; cổng e-Shram dùng để đăng ký.']]
  });
  A('ID', {
    e: [['SMA và Tes Kemampuan Akademik', 'Trung học phổ thông; tuyển sinh đại học công lập qua hệ thống SNPMB (SNBP, UTBK-SNBT).'], ['SMK (trung học nghề)', 'Học nghề song song kiến thức phổ thông, thực tập doanh nghiệp.'], ['Đại học công lập, tư thục và politeknik', 'Nhiều hình thức xét tuyển; politeknik thiên về ứng dụng.']],
    x: 'UTBK-SNBT (kỳ thi vào đại học công lập Indonesia)',
    f: [['lebaran', 'Lebaran (Idul Fitri)', 'Sau Ramadan, theo lịch Hồi giáo', 'lunar', 'về quê (mudik), xin lỗi và tha thứ cho nhau, chia ketupat'], ['independence_day', 'Ngày Độc lập (Tujuh Belasan)', '17/8', 'fixed', 'chơi trò leo cột, đua kéo co cùng hàng xóm', 1945], ['nyepi', 'Nyepi (Bali)', 'Năm mới Saka, khoảng tháng 3', 'lunar', 'ở Bali, tôn trọng ngày im lặng: tắt đèn, không ra đường']],
    m: [['Đăng ký tại KUA hoặc Dukcapil', 'Người Hồi giáo đăng ký tại KUA; tôn giáo khác tại cơ quan hộ tịch.'], ['Độ tuổi 19', 'Mốc luật từ 2019: cả hai từ đủ 19 tuổi.'], ['Tôn giáo của hôn nhân', 'Hôn nhân phải hợp lệ theo tôn giáo của hai người; hôn nhân khác đạo có vướng mắc pháp lý.']],
    d: ['Nasi goreng', 'Rendang', 'Sate ayam', 'Gado-gado', 'Soto ayam'],
    w: [['Luật Nhân lực và Luật Tạo việc làm', 'Luật 13/2003 được sửa bởi luật Cipta Kerja; vẫn có tranh luận và điều chỉnh.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 12 ngày sau 12 tháng làm việc.'], ['Lương tối thiểu tỉnh (UMP)', 'Mỗi tỉnh và một số huyện đặt mức lương tối thiểu riêng.'], ['THR (thưởng lễ)', 'Người lao động được thưởng lễ tôn giáo (THR) theo quy định.']]
  });
  A('KZ', {
    e: [['Trường phổ thông và UNT', 'Kỳ thi quốc gia UNT dùng để xét tốt nghiệp và vào đại học.'], ['College (giáo dục kỹ thuật và nghề)', 'Học sau lớp 9 hoặc 11, nhiều chương trình kép với doanh nghiệp.'], ['Đại học và học bổng nhà nước', 'Grant nhà nước xét theo điểm UNT.']],
    x: 'UNT (kỳ thi quốc gia Kazakhstan)',
    f: [['nauryz', 'Nauryz', '21–23/3', 'fixed', 'nấu nauryz kozhe và thăm hỏi người lớn tuổi'], ['independence_day', 'Ngày Độc lập', '16/12', 'fixed', 'xem hoạt động kỷ niệm', 1991], ['republic_day', 'Ngày Cộng hòa', '25/10', 'fixed', 'tham gia hoạt động công cộng địa phương']],
    m: [['Đăng ký tại cơ quan hộ tịch (ZAGS)', 'Hôn nhân được công nhận khi đăng ký; lễ tôn giáo là tùy chọn.'], ['Độ tuổi 18', 'Mốc luật: từ đủ 18 tuổi, ngoại lệ hẹp.'], ['Lễ truyền thống', 'Một số gia đình có lễ hỏi và kalym; hai người quyết định tham gia đến đâu.']],
    d: ['Beshbarmak', 'Baursak', 'Kazy (xúc xích ngựa)', 'Plov', 'Kurt (phô mai khô)'],
    w: [['Bộ luật Lao động 2015', 'Văn bản chính về hợp đồng và giờ làm.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 24 ngày theo lịch.'], ['Hưu trí ENPF', 'Người lao động đóng quỹ hưu trí thống nhất ENPF.'], ['Hợp đồng viết', 'Hợp đồng lao động lập bằng văn bản, ghi rõ nhiệm vụ và lương.']]
  });
  A('KP', {
    e: [['Trung học 12 năm bắt buộc', 'Thông tin công khai về tuyển chọn vào đại học rất hạn chế; game không bịa chi tiết kỳ thi.'], ['Đào tạo kỹ thuật', 'Đào tạo nghề gắn với phân công lao động của nhà nước.'], ['Đại học', 'Tuyển chọn theo kết quả học, lý lịch và quyết định cơ quan; không phải thị trường tự do.']],
    f: [['lunar_new_year', 'Tết Âm lịch', 'Đầu năm âm lịch', 'lunar', 'thăm người lớn tuổi và ăn món truyền thống cùng gia đình'], ['chuseok', 'Chuseok', '15/8 âm lịch', 'lunar', 'tảo mộ và chuẩn bị bánh songpyeon'], ['liberation_day', 'Ngày Giải phóng', '15/8', 'fixed', 'tham gia hoạt động tập thể do địa phương tổ chức', 1945]],
    m: [['Đăng ký với cơ quan nhà nước', 'Hôn nhân được đăng ký với cơ quan địa phương.'], ['Đồng ý của hai người', 'Game giữ nguyên tắc hai người tự nguyện; áp lực gia đình và tổ chức có thể lớn.'], ['Chi phí cưới', 'Gia đình chuẩn bị theo khả năng; không chạy đua quà.']],
    d: ['Naengmyeon Bình Nhưỡng', 'Kimchi', 'Bánh gạo (tteok)', 'Onban (cơm canh gà)', 'Japchae'],
    w: [['Phân công lao động nhà nước', 'Việc làm chủ yếu do nhà nước phân công; thông tin độc lập rất hạn chế.'], ['Giờ làm', 'Không có dữ liệu đáng tin cho từng nơi; game không đặt con số.'], ['Lao động tập thể', 'Có các đợt huy động lao động tập thể theo quy định.'], ['Hạn chế chuyển việc', 'Đổi nơi làm hoặc nơi ở cần phép; ảnh hưởng mọi quyết định nghề.'], ['Nguồn tham chiếu khu vực', 'Không có trang quốc gia ILO; dùng trang khu vực châu Á – Thái Bình Dương làm đầu mối.']]
  });
  A('KR', {
    e: [['Suneung (CSAT)', 'Kỳ thi năng lực học tập đại học tháng 11; nhiều trường còn xét học bạ.'], ['Trường trung học chuyên nghề (Meister)', 'Trường Meister và trường dạy nghề hướng tới việc làm sớm.'], ['Đại học và cao đẳng', 'Xét tuyển sớm (susi) và thường (jeongsi).']],
    x: 'Suneung (CSAT Hàn Quốc)',
    f: [['seollal', 'Seollal', 'Đầu năm âm lịch', 'lunar', 'cúi chào người lớn (sebae), ăn tteokguk'], ['chuseok', 'Chuseok', '15/8 âm lịch', 'lunar', 'về quê, làm songpyeon; nhiều gia đình rút gọn nghi lễ'], ['hangul_day', 'Ngày Hangul', '9/10', 'fixed', 'tham gia hoạt động viết chữ và đọc sách công cộng']],
    m: [['Khai báo hôn nhân', 'Hôn nhân có hiệu lực khi khai báo tại cơ quan địa phương; lễ cưới không thay khai báo.'], ['Độ tuổi 18', 'Mốc luật: từ 18; dưới 19 cần cha mẹ đồng ý.'], ['Chi phí nhà ở và cưới', 'Áp lực nhà cửa và lễ lớn được bàn nhiều; hai người tự chọn quy mô nhỏ.']],
    d: ['Kimchi jjigae', 'Bibimbap', 'Bulgogi', 'Tteokbokki', 'Samgyeopsal'],
    w: [['Luật Tiêu chuẩn Lao động', 'Văn bản chính về giờ làm, lương, nghỉ.'], ['Tuần 52 giờ', 'Mốc luật: 40 giờ cơ bản + tối đa 12 giờ làm thêm/tuần.'], ['Phép năm', 'Mốc luật: 15 ngày sau một năm, tăng theo thâm niên.'], ['Lương tối thiểu', 'Ủy ban Lương tối thiểu quyết định mức hằng năm.'], ['Bốn bảo hiểm', 'Hưu trí quốc gia, y tế, việc làm và tai nạn lao động.']]
  });
  A('KG', {
    e: [['Trường phổ thông và ORT', 'Kỳ thi ORT dùng cho tuyển sinh đại học và học bổng.'], ['Trường nghề và college', 'Đào tạo nghề sau lớp 9 hoặc 11.'], ['Đại học', 'Suất học ngân sách xét theo ORT.']],
    x: 'ORT (kỳ thi chung Kyrgyzstan)',
    f: [['nooruz', 'Nooruz', '21/3', 'fixed', 'nấu sumolok và thăm họ hàng'], ['independence_day', 'Ngày Độc lập', '31/8', 'fixed', 'xem lễ kỷ niệm', 1991], ['kurman_ait', 'Kurman Ait', 'Eid al-Adha, theo lịch Hồi giáo', 'lunar', 'chia sẻ thực phẩm với họ hàng và người khó khăn']],
    m: [['Đăng ký tại ZAGS', 'Chỉ hôn nhân đăng ký mới được pháp luật công nhận; nikah tôn giáo riêng không đủ.'], ['Độ tuổi 18', 'Mốc luật: 18; bắt cóc cô dâu (ala kachuu) là tội phạm.'], ['Lễ truyền thống', 'Các lễ của hai gia đình có thể đơn giản hóa theo ý hai người.']],
    d: ['Beshbarmak', 'Plov', 'Lagman', 'Boorsok', 'Manty'],
    w: [['Bộ luật Lao động', 'Văn bản chính, có sửa đổi gần đây.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 28 ngày theo lịch.'], ['Quỹ Xã hội', 'Đóng bảo hiểm xã hội cho hưu trí và y tế.'], ['Lao động di cư', 'Nhiều người đi làm ở nước khác; giữ giấy tờ hợp đồng.']]
  });
  A('LA', {
    e: [['Tốt nghiệp THPT', 'Kỳ thi cuối cấp và xét tuyển đại học theo chỉ tiêu.'], ['Trường kỹ thuật dạy nghề', 'Chương trình nghề sau trung học.'], ['Đại học Quốc gia Lào và trường khác', 'Xét tuyển theo kết quả và chỉ tiêu, có suất ưu tiên.']],
    f: [['pi_mai', 'Pi Mai Lao (Tết Lào)', '14–16/4', 'fixed', 'tắm Phật, té nước và buộc chỉ cổ tay (baci)'], ['that_luang', 'Boun That Luang', 'Rằm tháng 12 lịch Lào, khoảng tháng 11', 'lunar', 'dự lễ rước ở Vientiane và dâng lễ ở chùa'], ['ok_phansa', 'Boun Ok Phansa', 'Cuối mùa an cư, khoảng tháng 10', 'lunar', 'thả thuyền hoa đèn trên sông Mê Kông']],
    m: [['Đăng ký tại chính quyền', 'Đăng ký với cơ quan địa phương để được công nhận.'], ['Độ tuổi', 'Hai người phải đủ tuổi luật định và tự nguyện.'], ['Lễ baci và sính lễ', 'Lễ baci phổ biến; sính lễ được thỏa thuận giữa hai gia đình.']],
    d: ['Larb', 'Xôi (khao niao)', 'Tam mak hoong (gỏi đu đủ)', 'Or lam', 'Khao piak sen'],
    w: [['Luật Lao động 2013', 'Văn bản chính về hợp đồng và giờ làm.'], ['Giờ làm', 'Mốc luật: 8 giờ/ngày, 48 giờ/tuần.'], ['Phép năm', 'Mốc luật: 15 ngày sau một năm.'], ['Lương tối thiểu', 'Chính phủ điều chỉnh lương tối thiểu theo từng thời kỳ.'], ['Bảo hiểm xã hội', 'Tham gia quỹ an sinh xã hội quốc gia khi làm việc chính thức.']]
  });
  A('MY', {
    e: [['SPM và STPM/Matrikulasi', 'SPM ở lớp 5 trung học; sau đó STPM, dự bị đại học hoặc diploma.'], ['TVET', 'Đào tạo kỹ thuật và nghề qua nhiều viện công.'], ['Đại học công lập và tư thục', 'Xét tuyển qua UPU cho trường công.']],
    x: 'SPM (Sijil Pelajaran Malaysia)',
    f: [['hari_raya', 'Hari Raya Aidilfitri', 'Sau Ramadan, theo lịch Hồi giáo', 'lunar', 'đến các buổi open house đa sắc tộc'], ['chinese_new_year', 'Tết Nguyên đán', 'Đầu năm âm lịch', 'lunar', 'chúc Tết và ăn yee sang cùng bạn bè'], ['deepavali', 'Deepavali', 'Khoảng tháng 10–11', 'lunar', 'thắp đèn và thăm bạn bè người Ấn']],
    m: [['Luật Hồi giáo hoặc luật dân sự', 'Người Hồi giáo kết hôn theo luật bang; người khác đăng ký theo Luật Cải cách Luật (Hôn nhân và Ly hôn) 1976.'], ['Độ tuổi', 'Hôn nhân dân sự: 18; dưới 21 cần cha mẹ đồng ý.'], ['Khóa tiền hôn nhân', 'Cặp Hồi giáo thường học khóa tiền hôn nhân.']],
    d: ['Nasi lemak', 'Char kway teow', 'Roti canai', 'Laksa', 'Satay'],
    w: [['Đạo luật Việc làm 1955', 'Sửa đổi năm 2022; Sabah và Sarawak có luật riêng.'], ['Giờ làm', 'Mốc luật: 45 giờ/tuần.'], ['Phép năm', 'Mốc: 8, 12 hoặc 16 ngày theo thâm niên.'], ['EPF và SOCSO', 'Quỹ dự phòng hưu trí và bảo hiểm xã hội.'], ['Lương tối thiểu', 'Lệnh lương tối thiểu áp dụng toàn quốc.']]
  });
  A('MV', {
    e: [['IGCSE/A Level', 'Học sinh thi chứng chỉ quốc tế để học tiếp.'], ['Đào tạo nghề TVET', 'Các khóa nghề, nhiều về du lịch và hàng hải.'], ['Đại học Quốc gia Maldives', 'MNU và trường khác; nhiều người đi học nước ngoài.']],
    f: [['independence_day', 'Ngày Độc lập', '26/7', 'fixed', 'xem diễu hành và hoạt động thể thao cộng đồng', 1965], ['eid_fitr', 'Kuda Eid (Eid al-Fitr)', 'Sau Ramadan', 'lunar', 'thăm hỏi và chuẩn bị món ngọt'], ['republic_day', 'Ngày Cộng hòa', '11/11', 'fixed', 'tham gia hoạt động công cộng']],
    m: [['Luật Gia đình Maldives', 'Hôn nhân theo Luật Gia đình, đăng ký tại tòa án gia đình.'], ['Độ tuổi 18', 'Mốc luật: 18 tuổi.'], ['Lễ đơn giản', 'Nhiều cặp chọn lễ nhỏ; hai gia đình bàn ngân sách.']],
    d: ['Mas huni', 'Garudhiya', 'Hedhika (bánh ăn chiều)', 'Bis keemiya', 'Fihunu mas (cá nướng)'],
    w: [['Đạo luật Việc làm 2008', 'Văn bản chính về hợp đồng và nghỉ.'], ['Giờ làm', 'Mốc luật: 48 giờ/tuần.'], ['Phép năm', 'Mốc luật: 30 ngày sau một năm.'], ['Ngành du lịch', 'Nhiều việc làm ở khu nghỉ dưỡng xa nhà; kiểm tra chỗ ở và ngày nghỉ.'], ['Hưu trí MRPS', 'Người lao động đóng hưu trí theo chương trình quốc gia.']]
  });
  A('MN', {
    e: [['Kỳ thi tuyển sinh chung (EYSH)', 'Kỳ thi chung cuối phổ thông dùng để vào đại học.'], ['Trường kỹ thuật dạy nghề', 'Nhiều chương trình cho ngành mỏ, xây dựng, dịch vụ.'], ['Đại học', 'Xét theo điểm thi chung và hồ sơ.']],
    x: 'EYSH (kỳ thi tuyển sinh chung Mông Cổ)',
    f: [['naadam', 'Naadam', '11–15/7', 'fixed', 'xem vật, đua ngựa, bắn cung'], ['tsagaan_sar', 'Tsagaan Sar', 'Năm mới theo lịch Mông Cổ, khoảng tháng 2', 'lunar', 'chúc người lớn tuổi, ăn buuz'], ['independence', 'Ngày Khôi phục Độc lập', '29/12', 'fixed', 'tham gia hoạt động công cộng']],
    m: [['Đăng ký hộ tịch', 'Đăng ký với cơ quan hộ tịch để được công nhận.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ trong ger', 'Một số gia đình làm lễ truyền thống; quy mô do hai người chọn.']],
    d: ['Buuz', 'Khuushuur', 'Khorkhog', 'Tsuivan', 'Suutei tsai (trà sữa)'],
    w: [['Luật Lao động 2021', 'Có hiệu lực từ 2022, thay luật cũ.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Phép cơ bản cộng thêm theo thâm niên và điều kiện.'], ['Bảo hiểm xã hội', 'Đóng hưu trí, y tế, thất nghiệp qua hệ thống quốc gia.'], ['Làm việc mùa đông', 'Điều kiện lạnh cực độ ảnh hưởng an toàn ngoài trời.']]
  });
  A('MM', {
    e: [['Kỳ thi tú tài (matriculation)', 'Kỳ thi cuối lớp 12 là điều kiện vào đại học; hệ thống bị gián đoạn nhiều từ 2021.'], ['Trường kỹ thuật và nghề', 'Các viện kỹ thuật chính phủ và trung tâm tư nhân.'], ['Đại học', 'Tuyển sinh theo điểm tú tài; nhiều sinh viên phải gián đoạn học.']],
    x: 'Kỳ thi tú tài Myanmar',
    f: [['thingyan', 'Thingyan', 'Giữa tháng 4', 'fixed', 'té nước, làm công đức ở chùa'], ['thadingyut', 'Thadingyut', 'Rằm tháng Thadingyut, khoảng tháng 10', 'lunar', 'thắp đèn và lạy tạ người lớn tuổi'], ['tazaungdaing', 'Tazaungdaing', 'Rằm tháng Tazaungmon, khoảng tháng 11', 'lunar', 'thả đèn trời theo quy định an toàn của địa phương']],
    m: [['Luật theo cộng đồng', 'Có quy định riêng cho Phật giáo, Hồi giáo, Kitô giáo; nên làm giấy tờ để bảo vệ quyền lợi.'], ['Đồng thuận', 'Hai người tự nguyện; gia đình góp ý nhưng không quyết thay.'], ['Lễ cưới', 'Lễ có thể đơn giản; hoàn cảnh bất ổn khiến nhiều gia đình thu nhỏ.']],
    d: ['Mohinga', 'Lahpet thoke (gỏi lá trà)', 'Shan khao swe', 'Ohn no khao swe', 'Cà ri kiểu Myanmar'],
    w: [['Luật Nghỉ phép và Ngày nghỉ', 'Văn bản về phép năm và ngày nghỉ; thực thi không đồng đều.'], ['Giờ làm', 'Mốc tham chiếu: 8 giờ/ngày; nhà máy có quy định riêng.'], ['Lương tối thiểu', 'Mức lương tối thiểu theo ngày do nhà nước đặt.'], ['Bất ổn từ 2021', 'Biến động chính trị ảnh hưởng việc làm, giá cả và đi lại.'], ['Bảo hiểm xã hội', 'Hệ thống an sinh có phạm vi hẹp; giữ giấy tờ nơi làm.']]
  });
  A('NP', {
    e: [['SEE và NEB lớp 12', 'Kỳ thi SEE lớp 10 và kỳ thi NEB lớp 12.'], ['CTEVT', 'Hội đồng giáo dục kỹ thuật dạy nghề có chương trình diploma và ngắn hạn.'], ['Đại học Tribhuvan và trường khác', 'Mỗi trường có kỳ tuyển sinh riêng cho nhiều ngành.']],
    x: 'NEB (kỳ thi lớp 12 Nepal)',
    f: [['dashain', 'Dashain', 'Khoảng tháng 9–10', 'lunar', 'nhận tika và lời chúc từ người lớn tuổi'], ['tihar', 'Tihar', 'Khoảng tháng 10–11', 'lunar', 'thắp đèn và tôn vinh các con vật'], ['holi', 'Holi (Fagu Purnima)', 'Khoảng tháng 3', 'lunar', 'chơi màu, hỏi ý người khác trước']],
    m: [['Đăng ký hộ tịch', 'Đăng ký kết hôn tại văn phòng hộ tịch địa phương.'], ['Độ tuổi 20', 'Mốc luật: 20 tuổi cho cả hai.'], ['Của hồi môn', 'Đòi của hồi môn là trái luật; hai gia đình bàn chi phí công bằng.']],
    d: ['Dal bhat', 'Momo', 'Sel roti', 'Gundruk', 'Dhido'],
    w: [['Luật Lao động 2017', 'Văn bản chính về hợp đồng và quyền lợi.'], ['Giờ làm', 'Mốc luật: 8 giờ/ngày, 48 giờ/tuần.'], ['Quỹ An sinh Xã hội', 'Người lao động chính thức đóng Quỹ An sinh Xã hội.'], ['Lương tối thiểu', 'Mức lương tối thiểu điều chỉnh định kỳ.'], ['Đi làm nước ngoài', 'Nhiều người cần giấy phép lao động nước ngoài; cẩn trọng với môi giới.']]
  });
  A('PK', {
    e: [['Matric và Intermediate', 'Kỳ thi lớp 10 (SSC) và lớp 12 (HSSC) do các hội đồng tỉnh tổ chức.'], ['Đào tạo kỹ thuật (TEVTA)', 'Các cơ quan TEVTA tỉnh và NAVTTC có chương trình nghề.'], ['Đại học', 'Nhiều ngành có kỳ thi đầu vào như MDCAT cho y khoa.']],
    x: 'HSSC (kỳ thi Intermediate Pakistan)',
    f: [['eid_fitr', 'Eid ul-Fitr', 'Sau Ramadan', 'lunar', 'thăm họ hàng, trao eidi cho trẻ em'], ['pakistan_day', 'Ngày Pakistan', '23/3', 'fixed', 'xem diễu hành', 1940], ['independence_day', 'Ngày Độc lập', '14/8', 'fixed', 'treo cờ và tham gia hoạt động cộng đồng', 1947]],
    m: [['Nikahnama', 'Hôn nhân Hồi giáo ghi trong nikahnama và đăng ký với hội đồng địa phương.'], ['Độ tuổi', 'Mốc luật khác nhau theo tỉnh (16–18); tảo hôn là vấn đề thực tế.'], ['Haq mehr và chi phí', 'Haq mehr là quyền của người vợ; chi phí cưới nên vừa sức.']],
    d: ['Biryani', 'Nihari', 'Haleem', 'Chapli kebab', 'Karahi'],
    w: [['Luật lao động cấp tỉnh', 'Sau Tu chính án 18 (2010), mỗi tỉnh có luật lao động riêng.'], ['Giờ làm', 'Mốc tham chiếu: 48 giờ/tuần.'], ['Lương tối thiểu tỉnh', 'Các tỉnh tự công bố lương tối thiểu.'], ['EOBI', 'Quỹ hưu trí EOBI cho người lao động chính thức.'], ['Lao động phi chính thức', 'Nhiều người làm không hợp đồng; giữ ghi chép công.']]
  });
  A('PH', {
    e: [['K-12 và Senior High School', 'Lớp 11–12 chia các nhánh học thuật, kỹ thuật-nghề, thể thao, nghệ thuật.'], ['TESDA', 'Chứng chỉ nghề quốc gia (NC) do TESDA cấp.'], ['Đại học và college', 'Mỗi trường có kỳ thi tuyển riêng; trường công có chương trình miễn học phí.']],
    f: [['simbang_gabi', 'Simbang Gabi và Giáng sinh', '16–25/12', 'fixed', 'dự lễ sáng sớm hoặc chỉ đi chợ đêm bibingka cùng bạn bè'], ['sinulog', 'Sinulog', 'Chủ nhật thứ ba tháng 1 (Cebu)', 'variable', 'xem diễu hành múa đường phố'], ['independence_day', 'Ngày Độc lập', '12/6', 'fixed', 'tham gia lễ chào cờ', 1898]],
    m: [['Giấy phép kết hôn', 'Xin giấy phép tại văn phòng hộ tịch địa phương, có buổi tư vấn tiền hôn nhân.'], ['Độ tuổi', 'Mốc luật: 18; dưới 21 cần cha mẹ đồng ý.'], ['Không có ly hôn chung', 'Ngoài người Hồi giáo, luật chưa có ly hôn; chỉ có hủy hôn hoặc vô hiệu — cân nhắc kỹ.']],
    d: ['Adobo', 'Sinigang', 'Lechon', 'Kare-kare', 'Halo-halo'],
    w: [['Bộ luật Lao động', 'Văn bản chính, cùng các luật bổ sung.'], ['Giờ làm', 'Mốc luật: 8 giờ/ngày.'], ['Lương tháng 13', 'Người lao động được nhận lương tháng 13 theo luật.'], ['Phép khuyến khích', 'Mốc luật: 5 ngày phép sau một năm.'], ['SSS, PhilHealth, Pag-IBIG', 'Ba quỹ an sinh, y tế, nhà ở cho người lao động.']]
  });
  A('SG', {
    e: [['GCE O/A Level và IB', 'Kỳ thi quốc gia ở cuối trung học và dự bị đại học.'], ['ITE và polytechnic', 'ITE dạy nghề; polytechnic cấp diploma ứng dụng.'], ['Đại học tự trị', 'NUS, NTU, SMU và trường khác xét theo kết quả và hồ sơ.']],
    x: 'GCE A Level (Singapore)',
    f: [['national_day', 'Ngày Quốc khánh', '9/8', 'fixed', 'xem diễu hành NDP hoặc pháo hoa', 1965], ['chinese_new_year', 'Tết Nguyên đán', 'Đầu năm âm lịch', 'lunar', 'đi thăm hỏi và mua sắm ở Chinatown'], ['hari_raya', 'Hari Raya Puasa', 'Sau Ramadan', 'lunar', 'tham quan chợ Geylang Serai']],
    m: [['Đăng ký tại ROM hoặc ROMM', 'Người Hồi giáo đăng ký tại ROMM; người khác tại ROM.'], ['Độ tuổi', 'Từ 21 có thể tự đăng ký; 18–21 cần đồng ý của cha mẹ.'], ['Nhà ở và BTO', 'Nhiều cặp đăng ký mua căn hộ HDB; hai người bàn kế hoạch tài chính.']],
    d: ['Cơm gà Hải Nam', 'Laksa', 'Cua sốt ớt', 'Char kway teow', 'Kaya toast'],
    w: [['Đạo luật Việc làm', 'Áp dụng cho phần lớn người lao động, có ngoại lệ.'], ['Giờ làm', 'Mốc luật: 44 giờ/tuần.'], ['Phép năm', 'Mốc luật: từ 7 ngày, tăng theo thâm niên tới 14.'], ['CPF', 'Quỹ CPF cho hưu trí, nhà ở, y tế.'], ['Thẻ làm việc', 'Người nước ngoài cần Employment Pass, S Pass hoặc giấy phép khác.']]
  });
  A('LK', {
    e: [['G.C.E. O/L và A/L', 'Kỳ thi O Level và A Level quốc gia; A/L quyết định vào đại học công.'], ['Giáo dục kỹ thuật (NVQ)', 'Hệ chứng chỉ nghề NVQ qua trường kỹ thuật.'], ['Đại học công lập', 'UGC xét tuyển theo z-score A/L.']],
    x: 'G.C.E. A/L (Sri Lanka)',
    f: [['aluth_avurudu', 'Năm mới Sinhala và Tamil', '13–14/4', 'fixed', 'chuẩn bị kiribath và các nghi thức theo giờ lành'], ['vesak', 'Vesak', 'Rằm tháng 5', 'lunar', 'treo đèn lồng và ghé dansal'], ['thai_pongal', 'Thai Pongal', 'Khoảng 14/1', 'solar', 'nấu pongal cùng gia đình Tamil']],
    m: [['Đăng ký hôn nhân chung', 'Đăng ký với cơ quan hộ tịch; người Hồi giáo và Kandy có quy định riêng.'], ['Độ tuổi', 'Mốc luật chung: 18; luật Hồi giáo có quy định riêng đang tranh luận.'], ['Poruwa và lễ Tamil', 'Có nhiều lễ theo cộng đồng; hai người tự chọn.']],
    d: ['Cơm cà ri', 'Hoppers (appa)', 'Kottu roti', 'Pol sambol', 'Lamprais'],
    w: [['Luật Nhân viên Cửa hàng và Văn phòng', 'Áp dụng cho nhiều việc văn phòng; nhà máy có luật riêng.'], ['Giờ làm', 'Mốc tham chiếu: 8 giờ/ngày, 45 giờ/tuần.'], ['EPF và ETF', 'Quỹ hưu trí và quỹ tín thác cho người lao động.'], ['Phép năm', 'Mốc: 14 ngày sau một năm đủ điều kiện.'], ['Gratuity', 'Trợ cấp thôi việc khi làm đủ năm năm.']]
  });
  A('TJ', {
    e: [['Trường phổ thông và kỳ thi tập trung', 'Tuyển sinh đại học qua kỳ thi tập trung của Trung tâm Khảo thí quốc gia.'], ['Trường nghề', 'Đào tạo nghề sau lớp 9 hoặc 11.'], ['Đại học', 'Xét theo điểm kỳ thi tập trung.']],
    f: [['navruz', 'Navruz', '21–24/3', 'fixed', 'nấu sumanak và đi chơi xuân'], ['independence_day', 'Ngày Độc lập', '9/9', 'fixed', 'tham gia hoạt động công cộng', 1991], ['eid_fitr', 'Idi Ramazon', 'Sau Ramadan', 'lunar', 'thăm hỏi họ hàng']],
    m: [['Đăng ký hộ tịch', 'Đăng ký tại cơ quan hộ tịch; cần kiểm tra sức khỏe trước hôn nhân.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Giới hạn chi phí lễ', 'Có luật hạn chế quy mô lễ cưới và lễ lớn.']],
    d: ['Plov (osh)', 'Qurutob', 'Sambusa', 'Shurbo', 'Non (bánh mì tròn)'],
    w: [['Bộ luật Lao động 2016', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Có phép năm có lương theo luật.'], ['Bảo hiểm xã hội', 'Đóng bảo hiểm xã hội nhà nước.'], ['Kiều hối', 'Nhiều gia đình phụ thuộc thu nhập của người đi làm ở nước ngoài.']]
  });
  A('TH', {
    e: [['Mathayom 6 và TCAS', 'Tuyển sinh đại học qua hệ thống TCAS với các bài thi như TGAT/TPAT, A-Level.'], ['Pho Wo Cho / Pho Wo So', 'Chứng chỉ nghề và cao đẳng nghề, có học song song doanh nghiệp.'], ['Đại học công và tư', 'Nhiều vòng xét tuyển trong TCAS.']],
    x: 'TCAS (hệ thống tuyển sinh đại học Thái Lan)',
    f: [['songkran', 'Songkran', '13–15/4', 'fixed', 'tắm tượng Phật, rảy nước lên tay người lớn tuổi và té nước'], ['loy_krathong', 'Loy Krathong', 'Rằm tháng 12 lịch Thái, khoảng tháng 11', 'lunar', 'thả krathong làm từ vật liệu phân hủy'], ['makha_bucha', 'Makha Bucha', 'Rằm tháng 3 lịch Thái', 'lunar', 'đi vòng nến quanh chùa']],
    m: [['Đăng ký tại khet/amphoe', 'Hôn nhân có hiệu lực khi đăng ký tại văn phòng huyện.'], ['Hôn nhân bình đẳng', 'Từ 23/1/2025, hai người cùng giới có thể đăng ký kết hôn.'], ['Sin sod', 'Một số gia đình có sin sod; mức do hai bên thỏa thuận, không bắt buộc.']],
    d: ['Pad thai', 'Tom yum goong', 'Som tam', 'Khao man gai', 'Xôi xoài'],
    w: [['Luật Bảo vệ Lao động 1998', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 8 giờ/ngày, 48 giờ/tuần.'], ['Phép năm', 'Mốc luật: tối thiểu 6 ngày sau một năm.'], ['An sinh xã hội', 'Văn phòng An sinh Xã hội quản lý quỹ.'], ['Lương tối thiểu theo tỉnh', 'Lương tối thiểu theo ngày khác nhau theo tỉnh.']]
  });
  A('TL', {
    e: [['Ensino secundário', 'Học phổ thông và kỳ thi quốc gia lớp 12.'], ['Trung tâm đào tạo nghề', 'Chương trình nghề do SEFOPE và đối tác hỗ trợ.'], ['UNTL và đại học khác', 'Đại học Quốc gia Timor Lorosa’e và trường tư.']],
    f: [['restoration', 'Ngày Khôi phục Độc lập', '20/5', 'fixed', 'tham gia hoạt động cộng đồng', 2002], ['finados', 'Ngày các Đẳng (Finados)', '2/11', 'fixed', 'thắp nến ở nghĩa trang cùng gia đình'], ['christmas', 'Giáng sinh', '25/12', 'fixed', 'dự lễ hoặc sum họp gia đình']],
    m: [['Đăng ký dân sự hoặc Công giáo', 'Hôn nhân dân sự hoặc Công giáo được công nhận.'], ['Barlake', 'Trao đổi barlake giữa hai gia đình phổ biến; mức được thỏa thuận.'], ['Độ tuổi', 'Hai người đủ tuổi luật định và tự nguyện.']],
    d: ['Ikan sabuko (cá thu nướng)', 'Batar da’an', 'Tukir', 'Budu', 'Katupa'],
    w: [['Bộ luật Lao động 2012', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 44 giờ/tuần.'], ['Phép năm', 'Mốc luật: 12 ngày.'], ['An sinh xã hội', 'Hệ thống an sinh đóng góp từ 2017.'], ['Việc làm nước ngoài', 'Có chương trình lao động mùa vụ ở Úc, Hàn Quốc.']]
  });
  A('TM', {
    e: [['Trường phổ thông 12 năm', 'Tuyển sinh đại học qua kỳ thi đầu vào của từng trường.'], ['Trường nghề', 'Đào tạo nghề sau phổ thông.'], ['Đại học', 'Chỉ tiêu do nhà nước định.']],
    f: [['nowruz', 'Nowruz', '21–22/3', 'fixed', 'đi chơi xuân và ăn semeni'], ['independence_day', 'Ngày Độc lập', '27/9', 'fixed', 'xem hoạt động kỷ niệm', 1991], ['melon_day', 'Ngày Dưa Turkmen', 'Chủ nhật thứ hai tháng 8', 'variable', 'thử các giống dưa ở hội chợ']],
    m: [['Đăng ký hộ tịch', 'Đăng ký tại cơ quan hộ tịch.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ truyền thống', 'Hai gia đình bàn quy mô.']],
    d: ['Plov', 'Dograma', 'Ishlekli', 'Chorek', 'Manty'],
    w: [['Bộ luật Lao động 2009', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 30 ngày theo lịch.'], ['Khu vực nhà nước', 'Nhà nước là chủ lao động lớn.'], ['Thông tin hạn chế', 'Dữ liệu độc lập về điều kiện làm việc hạn chế.']]
  });
  A('UZ', {
    e: [['Trường phổ thông và kỳ thi DTM', 'Kỳ thi của Trung tâm Đánh giá Tri thức dùng để vào đại học.'], ['Technikum và college', 'Đào tạo nghề sau lớp 9 hoặc 11.'], ['Đại học', 'Suất ngân sách và hợp đồng học phí xét theo điểm thi.']],
    x: 'Kỳ thi tuyển sinh đại học Uzbekistan',
    f: [['navruz', 'Navruz', '21/3', 'fixed', 'nấu sumalak cùng hàng xóm'], ['independence_day', 'Ngày Độc lập', '1/9', 'fixed', 'xem hòa nhạc công cộng', 1991], ['ramazon_hayit', 'Ramazon Hayit', 'Sau Ramadan', 'lunar', 'thăm hỏi họ hàng']],
    m: [['Đăng ký ZAGS', 'Đăng ký tại cơ quan hộ tịch; kiểm tra sức khỏe trước hôn nhân.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Chi phí lễ cưới', 'Có quy định khuyến khích lễ vừa phải; hai gia đình tự thỏa thuận.']],
    d: ['Plov', 'Samsa', 'Lagman', 'Shashlik', 'Non'],
    w: [['Bộ luật Lao động 2022', 'Có hiệu lực từ 2023.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: tối thiểu 21 ngày.'], ['Hợp đồng viết', 'Hợp đồng lao động lập bằng văn bản.'], ['Lao động di cư', 'Nhiều người đi làm ở Nga, Hàn Quốc; dùng kênh tuyển dụng chính thức.']]
  });
  A('AU', {
    e: [['Year 12 và ATAR', 'Chứng chỉ cuối cấp mỗi bang khác nhau; điểm ATAR dùng cho tuyển sinh đại học.'], ['TAFE và học nghề', 'TAFE, học việc (apprenticeship) và chứng chỉ VET.'], ['Đại học và HECS-HELP', 'Khoản vay HECS-HELP trả lại theo thu nhập.']],
    x: 'ATAR (xếp hạng tuyển sinh đại học Úc)',
    f: [['anzac_day', 'ANZAC Day', '25/4', 'fixed', 'dự lễ bình minh tưởng niệm'], ['naidoc_week', 'NAIDOC Week', 'Tuần đầu tháng 7', 'variable', 'tìm hiểu văn hóa thổ dân và người dân đảo Torres Strait'], ['australia_day', 'Ngày Úc', '26/1', 'fixed', 'tham gia lễ nhập tịch hoặc nghỉ ngơi; ngày này gây tranh cãi với nhiều cộng đồng thổ dân']],
    m: [['Thông báo dự định kết hôn', 'Nộp Notice of Intended Marriage ít nhất một tháng trước lễ.'], ['Người cử hành được ủy quyền', 'Lễ do celebrant được ủy quyền chủ trì, có hai nhân chứng.'], ['Hôn nhân bình đẳng', 'Từ 2017, hai người cùng giới có thể kết hôn.']],
    d: ['Meat pie', 'Barramundi', 'Lamington', 'Pavlova', 'Vegemite toast'],
    w: [['Fair Work Act 2009', 'Văn bản chính, cùng các award theo ngành.'], ['Giờ làm', 'Mốc NES: 38 giờ/tuần cộng giờ hợp lý.'], ['Phép năm', 'Mốc NES: 4 tuần/năm cho toàn thời gian.'], ['Superannuation', 'Chủ đóng hưu trí bắt buộc vào quỹ super.'], ['Lương tối thiểu', 'Ủy ban Fair Work xem xét lương tối thiểu hằng năm.']]
  });
  A('FJ', {
    e: [['Năm 13 và kỳ thi quốc gia', 'Kỳ thi cuối cấp dùng cho tuyển sinh đại học.'], ['Đào tạo nghề (TVET)', 'Trường kỹ thuật và chương trình của Đại học Quốc gia Fiji.'], ['Đại học', 'USP, FNU, Đại học Fiji; có chương trình vay học phí TSLS.']],
    f: [['fiji_day', 'Ngày Fiji', '10/10', 'fixed', 'tham gia hoạt động kỷ niệm', 1970], ['diwali', 'Diwali', 'Khoảng tháng 10–11', 'lunar', 'thắp đèn cùng hàng xóm Ấn-Fiji'], ['bula_festival', 'Bula Festival (Nadi)', 'Tháng 7', 'variable', 'xem diễu hành và gian hàng']],
    m: [['Giấy phép kết hôn', 'Xin giấy phép tại văn phòng hộ tịch.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ truyền thống iTaukei', 'Có nghi thức trao lễ vật; hai gia đình bàn quy mô.']],
    d: ['Kokoda', 'Lovo', 'Rourou', 'Palusami', 'Cà ri Ấn-Fiji'],
    w: [['Employment Relations Act 2007', 'Văn bản chính.'], ['Giờ làm', 'Theo luật và lệnh lương ngành.'], ['Lương tối thiểu quốc gia', 'Có mức lương tối thiểu quốc gia.'], ['FNPF', 'Quỹ Dự phòng Quốc gia Fiji.'], ['Phép năm', 'Mốc luật: 10 ngày sau một năm.']]
  });
  A('KI', {
    e: [['Trung học và chứng chỉ quốc gia', 'Chương trình trung học và kỳ thi chứng chỉ.'], ['Viện Kỹ thuật Kiribati', 'Đào tạo nghề và hàng hải.'], ['USP Kiribati và học bổng', 'Nhiều người học đại học ở nước khác.']],
    f: [['independence_day', 'Ngày Độc lập', '12/7', 'fixed', 'xem thi đấu thể thao và múa truyền thống', 1979], ['gospel_day', 'Ngày Phúc Âm', '11/7', 'fixed', 'tham gia sinh hoạt nhà thờ'], ['youth_day', 'Ngày Thanh niên', 'Tháng 8', 'variable', 'tham gia hoạt động thanh niên']],
    m: [['Đăng ký hôn nhân', 'Đăng ký với cơ quan hộ tịch.'], ['Đồng thuận', 'Hai người tự nguyện.'], ['Lễ trong maneaba', 'Tiệc cộng đồng ở maneaba; chia việc vừa sức.']],
    d: ['Te bua toro (đường dừa)', 'Cá ngừ', 'Babai (khoai môn đầm)', 'Te kabubu (bột dứa dại)', 'Cua dừa'],
    w: [['Bộ luật Việc làm và Quan hệ Công nghiệp 2015', 'Văn bản chính.'], ['Quỹ KPF', 'Quỹ Dự phòng Kiribati.'], ['Việc làm hàng hải', 'Nhiều người làm thủy thủ trên tàu nước ngoài.'], ['Lao động thời vụ', 'Chương trình làm việc ở Úc, New Zealand.'], ['Biến đổi khí hậu', 'Mực nước biển ảnh hưởng đời sống và nơi làm việc.']]
  });
  A('MH', {
    e: [['Trung học công lập', 'Học sinh thi xếp lớp trung học.'], ['Đào tạo nghề', 'Chương trình tại College of the Marshall Islands.'], ['College of the Marshall Islands', 'Nhiều người học tiếp ở Hoa Kỳ theo Compact.']],
    f: [['constitution_day', 'Ngày Hiến pháp', '1/5', 'fixed', 'tham gia hoạt động công cộng', 1979], ['manit_day', 'Manit Day (Ngày Văn hóa)', 'Thứ Sáu cuối tháng 9', 'variable', 'tham gia thi đan lá và chèo thuyền'], ['gospel_day', 'Ngày Phúc Âm', 'Thứ Sáu đầu tháng 12', 'variable', 'xem các nhóm hát kurijmoj']],
    m: [['Đăng ký hôn nhân', 'Đăng ký dân sự hoặc qua nhà thờ.'], ['Đồng thuận', 'Hai người tự nguyện.'], ['Gia đình bên mẹ', 'Đất đai theo dòng mẹ; bàn trước quyền lợi gia đình.']],
    d: ['Bánh mì quả (mã)', 'Cá nướng', 'Jebwe (bột dứa dại)', 'Cua dừa', 'Cơm dừa'],
    w: [['Quy định lao động', 'Có luật lao động và lương tối thiểu.'], ['An sinh xã hội', 'Cơ quan An sinh Xã hội MISSA.'], ['Làm việc ở Hoa Kỳ', 'Công dân có thể làm việc ở Hoa Kỳ theo Compact.'], ['Khu vực công', 'Chính phủ là chủ lao động lớn.'], ['Đánh bắt cá', 'Ngành cá ngừ quan trọng.']]
  });
  A('FM', {
    e: [['Trung học theo bang', 'Bốn bang có hệ thống trung học riêng.'], ['Đào tạo nghề', 'Chương trình nghề tại College of Micronesia.'], ['College of Micronesia', 'Nhiều người học tiếp ở Hoa Kỳ.']],
    f: [['constitution_day', 'Ngày Hiến pháp', '10/5', 'fixed', 'tham gia hoạt động công cộng', 1979], ['yap_day', 'Yap Day', '1/3', 'fixed', 'xem múa truyền thống ở Yap'], ['independence_day', 'Ngày Độc lập', '3/11', 'fixed', 'tham gia hoạt động công cộng', 1986]],
    m: [['Đăng ký theo bang', 'Mỗi bang có quy định đăng ký.'], ['Đồng thuận', 'Hai người tự nguyện.'], ['Phong tục theo đảo', 'Khác nhau giữa Chuuk, Pohnpei, Yap, Kosrae.']],
    d: ['Khoai môn', 'Bánh mì quả', 'Cá ngừ', 'Sakau (lễ uống)', 'Cua dừa'],
    w: [['Quy định theo bang', 'Lương tối thiểu và quy định khác nhau giữa các bang.'], ['An sinh xã hội FSM', 'Cơ quan An sinh Xã hội FSM.'], ['Làm việc ở Hoa Kỳ', 'Công dân có thể làm việc ở Hoa Kỳ theo Compact.'], ['Khu vực công', 'Chính phủ là chủ lao động lớn.'], ['Nguồn', 'Không có trang quốc gia ILO; dùng cổng chính phủ FSM.']]
  });
  A('NR', {
    e: [['Trung học Nauru', 'Học sinh theo chương trình liên kết với Úc.'], ['Đào tạo nghề', 'Trung tâm đào tạo kỹ thuật.'], ['USP Nauru', 'Học từ xa và học bổng ở nước khác.']],
    f: [['independence_day', 'Ngày Độc lập', '31/1', 'fixed', 'xem thi đấu thể thao', 1968], ['angam_day', 'Ngày Angam', '26/10', 'fixed', 'tìm hiểu lịch sử dân số Nauru'], ['constitution_day', 'Ngày Hiến pháp', '17/5', 'fixed', 'tham gia hoạt động cộng đồng']],
    m: [['Đăng ký hôn nhân', 'Đăng ký với cơ quan hộ tịch.'], ['Đồng thuận', 'Hai người tự nguyện.'], ['Gia đình mở rộng', 'Hai gia đình bàn tổ chức.']],
    d: ['Cá ngừ', 'Cơm dừa', 'Bánh dứa dại', 'Cua dừa', 'Mì gói kiểu Nauru'],
    w: [['Khu vực công', 'Chính phủ là chủ lao động lớn.'], ['Hợp đồng lao động', 'Đối chiếu hợp đồng khi làm cho nhà thầu.'], ['Lương hưu', 'Quỹ hưu trí theo quy định quốc gia.'], ['Việc làm hạn chế', 'Thị trường nhỏ; nhiều người đi làm nước ngoài.'], ['Nguồn', 'Không có trang quốc gia ILO; dùng cổng chính phủ Nauru.']]
  });
  A('PW', {
    e: [['Palau High School', 'Trung học công lập chính.'], ['Đào tạo nghề', 'Chương trình tại Palau Community College.'], ['Palau Community College', 'Nhiều người học tiếp ở Hoa Kỳ.']],
    f: [['independence_day', 'Ngày Độc lập', '1/10', 'fixed', 'tham gia hoạt động công cộng', 1994], ['constitution_day', 'Ngày Hiến pháp', '9/7', 'fixed', 'tham gia hoạt động công cộng'], ['youth_day', 'Ngày Thanh niên', '15/3', 'fixed', 'tham gia hoạt động thanh niên']],
    m: [['Đăng ký hôn nhân', 'Đăng ký với cơ quan hộ tịch.'], ['Đồng thuận', 'Hai người tự nguyện.'], ['Phong tục trao đổi', 'Gia đình có nghi thức trao tặng; bàn mức vừa sức.']],
    d: ['Khoai môn', 'Cá nướng', 'Bánh tapioca', 'Cua dừa', 'Ulkoy (bánh rán)'],
    w: [['Lương tối thiểu', 'Có luật lương tối thiểu quốc gia.'], ['An sinh xã hội', 'Quỹ An sinh Xã hội Palau.'], ['Du lịch', 'Nhiều việc làm trong ngành du lịch.'], ['Lao động nước ngoài', 'Nhiều lao động nước ngoài cần giấy phép.'], ['Hợp đồng', 'Đối chiếu hợp đồng trước khi nhận việc.']]
  });
  A('PG', {
    e: [['Lớp 12 và chứng chỉ quốc gia', 'Kỳ thi quốc gia lớp 12 dùng cho chọn vào đại học.'], ['Trường kỹ thuật', 'Trường kỹ thuật và cao đẳng nghề.'], ['Đại học', 'UPNG, PNG UoT và các trường khác.']],
    f: [['independence_day', 'Ngày Độc lập', '16/9', 'fixed', 'xem biểu diễn văn hóa', 1975], ['goroka_show', 'Goroka Show', 'Tháng 9', 'variable', 'xem các nhóm sing-sing từ nhiều vùng'], ['hagen_show', 'Mount Hagen Show', 'Tháng 8', 'variable', 'xem trang phục truyền thống, tôn trọng quy định chụp ảnh']],
    m: [['Đăng ký hoặc hôn nhân tục lệ', 'Luật công nhận cả hôn nhân tục lệ và hôn nhân theo luật.'], ['Bride price', 'Sính lễ phổ biến ở nhiều vùng; mức cao gây áp lực.'], ['Đồng thuận', 'Hai người tự nguyện; bạo lực gia đình là rủi ro cần hỗ trợ.']],
    d: ['Mumu', 'Kaukau (khoai lang)', 'Sago', 'Kokoda', 'Chuối nấu nước dừa'],
    w: [['Employment Act', 'Văn bản chính.'], ['Lương tối thiểu', 'Có mức lương tối thiểu quốc gia.'], ['Superannuation', 'Quỹ hưu trí bắt buộc như Nambawan Super, NASFUND.'], ['Phi chính thức', 'Phần lớn sống bằng nông nghiệp tự cung.'], ['An toàn', 'Kiểm tra an ninh khu vực làm việc.']]
  });
  A('WS', {
    e: [['Năm 13 và kỳ thi SSC', 'Chứng chỉ Samoa cuối trung học.'], ['Đào tạo nghề', 'Chương trình kỹ thuật tại NUS.'], ['Đại học Quốc gia Samoa', 'NUS và học bổng nước ngoài.']],
    f: [['independence_day', 'Ngày Độc lập', '1/6', 'fixed', 'xem diễu hành ở Apia', 1962], ['teuila', 'Teuila Festival', 'Tháng 9', 'variable', 'xem múa siva và đua thuyền'], ['white_sunday', 'White Sunday', 'Chủ nhật thứ hai tháng 10', 'variable', 'xem trẻ em biểu diễn ở nhà thờ']],
    m: [['Đăng ký hôn nhân', 'Đăng ký với cơ quan hộ tịch.'], ['Độ tuổi', 'Mốc luật: 18.'], ['Fa’alavelave', 'Đóng góp cho sự kiện gia đình có thể lớn; bàn mức vừa sức.']],
    d: ['Oka (cá sống trộn dừa)', 'Palusami', 'Umu', 'Sapasui', 'Koko alaisa'],
    w: [['Luật Lao động và Quan hệ Việc làm 2013', 'Văn bản chính.'], ['Giờ làm', 'Mốc tham chiếu: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 10 ngày.'], ['SNPF', 'Quỹ Dự phòng Quốc gia Samoa.'], ['Lao động thời vụ', 'Chương trình làm việc mùa vụ ở Úc, New Zealand.']]
  });
  A('SB', {
    e: [['Trung học và kỳ thi quốc gia', 'Các kỳ thi quốc gia chọn học tiếp.'], ['Trung tâm nghề nông thôn', 'Đào tạo kỹ năng nông thôn.'], ['SINU và USP', 'Đại học Quốc gia Solomon và USP.']],
    f: [['independence_day', 'Ngày Độc lập', '7/7', 'fixed', 'tham gia hoạt động cộng đồng', 1978], ['easter', 'Lễ Phục sinh', 'Mùa xuân, đổi theo năm', 'variable', 'dự lễ hoặc nghỉ cùng gia đình'], ['provincial_day', 'Ngày tỉnh', 'Mỗi tỉnh một ngày riêng', 'variable', 'xem biểu diễn văn hóa của tỉnh']],
    m: [['Hôn nhân theo luật hoặc tục lệ', 'Có cả hôn nhân tục lệ và đăng ký.'], ['Bride price', 'Tiền tục lệ (có nơi dùng tiền vỏ sò); mức do gia đình thỏa thuận.'], ['Đồng thuận', 'Hai người tự nguyện.']],
    d: ['Cá nướng', 'Khoai môn', 'Ulu (bánh mì quả)', 'Cua bùn', 'Cháo cassava'],
    w: [['Labour Act', 'Văn bản chính.'], ['SINPF', 'Quỹ Dự phòng Quốc gia Solomon.'], ['Lương tối thiểu', 'Có mức lương tối thiểu theo giờ.'], ['Phi chính thức', 'Nhiều người làm nông nghiệp và đánh cá.'], ['Lao động thời vụ', 'Chương trình mùa vụ ở Úc, New Zealand.']]
  });
  A('TO', {
    e: [['Kỳ thi chứng chỉ quốc gia', 'Chứng chỉ trung học Tonga.'], ['Viện kỹ thuật', 'Đào tạo nghề.'], ['Đại học Tonga', 'Tonga National University và học bổng nước ngoài.']],
    f: [['heilala', 'Heilala Festival', 'Tháng 7', 'variable', 'xem diễu hành và cuộc thi văn hóa'], ['emancipation_day', 'Ngày Giải phóng', '4/6', 'fixed', 'tham gia hoạt động công cộng', 1862], ['kings_birthday', 'Sinh nhật Nhà vua', '4/7', 'fixed', 'xem lễ kỷ niệm']],
    m: [['Đăng ký hôn nhân', 'Đăng ký với cơ quan hộ tịch.'], ['Độ tuổi', 'Hai người đủ tuổi luật định và tự nguyện.'], ['Vai trò nhà thờ', 'Nhiều đám cưới tổ chức ở nhà thờ; quy mô tùy hai người.']],
    d: ['Lu pulu', 'Ota ika', 'Umu', 'Faikakai', 'Topai']
    , w: [['Employment Relations Act 2020', 'Văn bản chính.'], ['Quỹ hưu trí', 'Quỹ hưu trí quốc gia.'], ['Khu vực công', 'Chính phủ là chủ lao động lớn.'], ['Lao động thời vụ', 'Chương trình mùa vụ ở Úc, New Zealand.'], ['Kiều hối', 'Nhiều gia đình dựa vào người thân ở nước ngoài.']]
  });
  A('TV', {
    e: [['Trung học Motufoua', 'Trường trung học chính.'], ['Viện Đào tạo Hàng hải Tuvalu', 'Đào tạo thủy thủ.'], ['USP Tuvalu', 'Học từ xa và học bổng.']],
    f: [['independence_day', 'Ngày Độc lập', '1/10', 'fixed', 'xem thi đấu thể thao và múa fatele', 1978], ['gospel_day', 'Ngày Phúc Âm', 'Tháng 5', 'variable', 'tham gia sinh hoạt nhà thờ'], ['christmas', 'Giáng sinh', '25/12', 'fixed', 'tham gia tiệc cộng đồng']],
    m: [['Đăng ký hôn nhân', 'Đăng ký với cơ quan hộ tịch.'], ['Đồng thuận', 'Hai người tự nguyện.'], ['Tiệc ở maneapa', 'Tiệc cộng đồng; chia việc vừa sức.']],
    d: ['Pulaka', 'Cá ngừ', 'Bánh mì quả', 'Toddy (nước dừa ngọt)', 'Cua dừa'],
    w: [['Employment Act', 'Văn bản chính.'], ['TNPF', 'Quỹ Dự phòng Quốc gia Tuvalu.'], ['Thủy thủ', 'Nhiều người làm trên tàu nước ngoài.'], ['Khu vực công', 'Chính phủ là chủ lao động lớn.'], ['Biến đổi khí hậu', 'Ảnh hưởng nơi ở và việc làm.']]
  });
  A('VU', {
    e: [['Năm 13 và chứng chỉ quốc gia', 'Học sinh học tiếng Anh hoặc Pháp.'], ['Đào tạo nghề', 'VITE và trung tâm nghề.'], ['Đại học', 'USP Emalus và Đại học Quốc gia Vanuatu.']],
    f: [['independence_day', 'Ngày Độc lập', '30/7', 'fixed', 'xem diễu hành và thể thao', 1980], ['nagol', 'Nagol (nhảy dây trên Pentecost)', 'Tháng 4–6', 'variable', 'xem nghi lễ khi được cộng đồng cho phép'], ['chiefs_day', 'Ngày Tù trưởng Phong tục', '5/3', 'fixed', 'tham gia hoạt động văn hóa']],
    m: [['Hôn nhân tục lệ, dân sự, tôn giáo', 'Có cả ba hình thức.'], ['Bride price', 'Mức sính lễ có hướng dẫn của Hội đồng Tù trưởng.'], ['Đồng thuận', 'Hai người tự nguyện.']],
    d: ['Lap lap', 'Simboro', 'Tuluk', 'Bò Vanuatu nướng', 'Kava']
    , w: [['Employment Act', 'Văn bản chính.'], ['VNPF', 'Quỹ Dự phòng Quốc gia Vanuatu.'], ['Lương tối thiểu', 'Có mức lương tối thiểu.'], ['Lao động thời vụ', 'Chương trình mùa vụ ở Úc, New Zealand.'], ['Thiên tai', 'Bão và động đất ảnh hưởng việc làm.']]
  });
})(globalThis.G);
