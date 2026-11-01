/* §13 lô 2 — châu Âu. Cùng định dạng với lô châu Á. Với nước EU, giới hạn chung của Chỉ thị Thời giờ Làm việc
   (trung bình tối đa 48 giờ/tuần gồm làm thêm, tối thiểu 4 tuần phép có lương) là mốc nền; luật quốc gia/thỏa ước có thể cao hơn. */
(function (G) {
  'use strict';
  var A = G.E.COUNTRY_WORLD912.add;
  var EU48 = ['Giới hạn chung EU', 'Thời giờ làm việc trung bình không quá 48 giờ/tuần gồm làm thêm, có nghỉ ngơi hằng ngày và hằng tuần.'];
  A('AL', {
    e: [['Gjimnaz và Matura Shtetërore', 'Kỳ thi Matura nhà nước cuối lớp 12 dùng để vào đại học.'], ['Trường nghề (shkolla profesionale)', 'Trung học nghề kèm thực hành tại doanh nghiệp.'], ['Đại học công và tư', 'Xét theo điểm Matura và điểm trung bình.']],
    x: 'Matura Shtetërore (Albania)',
    f: [['summer_day', 'Dita e Verës (Ngày Mùa hè)', '14/3', 'fixed', 'ăn bánh ballokume và dạo chơi ở Elbasan'], ['independence_day', 'Ngày Độc lập', '28/11', 'fixed', 'xem diễu hành ở Vlorë hoặc Tirana', 1912], ['bajram', 'Bajrami i Madh (Eid al-Fitr)', 'Sau Ramadan', 'lunar', 'thăm hỏi hàng xóm; Albania có truyền thống chung sống nhiều tôn giáo']],
    m: [['Đăng ký dân sự', 'Hôn nhân chỉ có hiệu lực khi đăng ký tại văn phòng hộ tịch.'], ['Độ tuổi 18', 'Mốc luật: 18 tuổi.'], ['Lễ gia đình', 'Nhiều gia đình tổ chức tiệc lớn; hai người tự chọn quy mô.']],
    d: ['Tavë kosi', 'Byrek', 'Fërgesë', 'Qofte', 'Flija'],
    w: [['Bộ luật Lao động Albania', 'Văn bản chính, sửa đổi nhiều lần.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: tối thiểu 4 tuần.'], ['Lương tối thiểu', 'Chính phủ công bố mức lương tối thiểu.'], ['Bảo hiểm xã hội', 'Đóng bảo hiểm qua ISSH.']]
  });
  A('AD', {
    e: [['Ba hệ thống trường', 'Có trường Andorra, Pháp và Tây Ban Nha; mỗi hệ có chứng chỉ cuối cấp riêng.'], ['Đào tạo nghề', 'Formació professional trong hệ thống Andorra.'], ['Đại học Andorra', 'Nhiều người học tiếp ở Tây Ban Nha hoặc Pháp.']],
    f: [['meritxell', 'Ngày Đức Mẹ Meritxell (Quốc khánh)', '8/9', 'fixed', 'hành hương tới Meritxell hoặc dã ngoại'], ['sant_joan', 'Sant Joan', '23–24/6', 'fixed', 'xem lửa trại đêm hè an toàn'], ['constitution_day', 'Ngày Hiến pháp', '14/3', 'fixed', 'tham gia hoạt động công cộng', 1993]],
    m: [['Hôn nhân dân sự hoặc giáo hội', 'Có cả hai hình thức được công nhận.'], ['Hôn nhân bình đẳng', 'Từ 2023, hai người cùng giới có thể kết hôn.'], ['Đăng ký', 'Đăng ký tại cơ quan hộ tịch.']],
    d: ['Trinxat', 'Escudella', 'Canelons', 'Coca de llardons', 'Xúc xích Andorra'],
    w: [['Bộ luật Quan hệ Lao động', 'Văn bản chính.'], ['Giờ làm', 'Mốc tham chiếu: 40 giờ/tuần.'], ['Phép năm', 'Có phép năm theo luật.'], ['CASS', 'Quỹ An sinh Xã hội Andorra.'], ['Lao động thời vụ', 'Nhiều việc thời vụ ở khu trượt tuyết; cần giấy phép cư trú làm việc.']]
  });
  A('AM', {
    e: [['Trường phổ thông và kỳ thi thống nhất', 'Kỳ thi thống nhất dùng xét tốt nghiệp và đại học.'], ['College nghề', 'Đào tạo nghề trung cấp.'], ['Đại học', 'Suất miễn phí xét theo điểm thi.']],
    x: 'Kỳ thi thống nhất Armenia',
    f: [['vardavar', 'Vardavar', 'Chủ nhật thứ 14 sau Phục sinh, mùa hè', 'variable', 'té nước vui với bạn bè'], ['independence_day', 'Ngày Độc lập', '21/9', 'fixed', 'xem hòa nhạc', 1991], ['genocide_day', 'Ngày Tưởng niệm 24/4', '24/4', 'fixed', 'đặt hoa ở Tsitsernakaberd']],
    m: [['Đăng ký hộ tịch', 'Hôn nhân dân sự đăng ký tại văn phòng hộ tịch.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ nhà thờ', 'Nhiều cặp làm lễ ở nhà thờ Tông truyền; không bắt buộc.']],
    d: ['Khorovats', 'Dolma', 'Lavash', 'Harissa', 'Gata'],
    w: [['Bộ luật Lao động', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 20 ngày làm việc.'], ['Hưu trí tích lũy', 'Người sinh từ 1974 tham gia hưu trí tích lũy bắt buộc.'], ['Hợp đồng', 'Hợp đồng viết bằng văn bản.']]
  });
  A('AT', {
    e: [['Gymnasium và Matura', 'Kỳ thi Reifeprüfung chuẩn hóa cuối cấp.'], ['Lehre (học nghề kép)', 'Học nghề song song tại doanh nghiệp và trường nghề.'], ['Đại học và Fachhochschule', 'Một số ngành có kỳ thi đầu vào.']],
    x: 'Matura (Reifeprüfung Áo)',
    f: [['christkindlmarkt', 'Chợ Giáng sinh', 'Mùa Vọng, cuối tháng 11–24/12', 'variable', 'dạo chợ, uống punch không cồn hoặc mua đồ thủ công'], ['nationalfeiertag', 'Ngày Quốc khánh', '26/10', 'fixed', 'tham quan các tòa nhà chính phủ mở cửa', 1955], ['fasching', 'Fasching', 'Trước Mùa Chay', 'variable', 'hóa trang và dự vũ hội']],
    m: [['Đăng ký tại Standesamt', 'Hôn nhân dân sự là bắt buộc để được công nhận.'], ['Hôn nhân bình đẳng', 'Từ 2019, hai người cùng giới có thể kết hôn.'], ['Giấy tờ', 'Cần chuẩn bị giấy tờ trước tại văn phòng hộ tịch.']],
    d: ['Wiener Schnitzel', 'Tafelspitz', 'Apfelstrudel', 'Sachertorte', 'Kaiserschmarrn'],
    w: [['Thỏa ước tập thể', 'Lương chủ yếu theo thỏa ước ngành.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần, nhiều thỏa ước ít hơn.'], ['Phép năm', 'Mốc luật: 5 tuần (25 ngày).'], ['Lương tháng 13 và 14', 'Phần lớn thỏa ước có hai khoản lương bổ sung.'], EU48]
  });
  A('AZ', {
    e: [['Trường phổ thông và kỳ thi DİM', 'Kỳ thi của Trung tâm Khảo thí Nhà nước để vào đại học.'], ['Trường nghề', 'Đào tạo nghề sau lớp 9 hoặc 11.'], ['Đại học', 'Xét theo điểm thi tập trung.']],
    x: 'Kỳ thi tuyển sinh DİM (Azerbaijan)',
    f: [['novruz', 'Novruz', '20–21/3', 'fixed', 'nhảy qua lửa nhỏ và làm samani'], ['independence_day', 'Ngày Độc lập', '28/5', 'fixed', 'tham gia hoạt động công cộng', 1918], ['ramazan_bayram', 'Ramazan Bayramı', 'Sau Ramadan', 'lunar', 'thăm hỏi họ hàng']],
    m: [['Đăng ký hộ tịch', 'Đăng ký tại cơ quan nhà nước.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Khám sức khỏe', 'Có khám sức khỏe trước hôn nhân.']],
    d: ['Plov', 'Dolma', 'Qutab', 'Dushbara', 'Pakhlava'],
    w: [['Bộ luật Lao động', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 21 ngày theo lịch, cộng thêm theo nghề.'], ['Bảo hiểm xã hội', 'Đóng qua Quỹ Bảo vệ Xã hội.'], ['Hợp đồng điện tử', 'Hợp đồng lao động đăng ký trên hệ thống điện tử.']]
  });
  A('BY', {
    e: [['Trường phổ thông và kiểm tra tập trung', 'Tuyển sinh đại học qua kỳ thi tập trung.'], ['College nghề', 'Đào tạo nghề và trung cấp.'], ['Đại học', 'Có suất ngân sách và phân công việc sau tốt nghiệp.']],
    f: [['kupalle', 'Kupalle', '6–7/7', 'fixed', 'kết vòng hoa và đi dạo đêm hè'], ['independence_day', 'Ngày Độc lập', '3/7', 'fixed', 'xem hoạt động kỷ niệm'], ['kalyady', 'Kalyady', 'Cuối tháng 12–đầu tháng 1', 'variable', 'hát mừng và chuẩn bị bữa tối gia đình']],
    m: [['Đăng ký ZAGS', 'Hôn nhân đăng ký tại cơ quan hộ tịch.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ nhà thờ', 'Lễ tôn giáo là tùy chọn.']],
    d: ['Draniki', 'Machanka', 'Kalduny', 'Babka', 'Khaladnik'],
    w: [['Bộ luật Lao động', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 24 ngày theo lịch.'], ['Hợp đồng có thời hạn', 'Nhiều người làm theo hợp đồng có thời hạn.'], ['Phân công sau tốt nghiệp', 'Sinh viên học ngân sách có nghĩa vụ làm việc được phân công.']]
  });
  A('BE', {
    e: [['CESS và kỳ thi theo cộng đồng', 'Ba cộng đồng ngôn ngữ có hệ thống riêng; không có một kỳ thi cuối cấp chung toàn quốc.'], ['Giáo dục kỹ thuật và nghề', 'Nhánh kỹ thuật, nghề và học việc kép.'], ['Đại học và hogeschool', 'Phần lớn ngành tuyển mở; y khoa có kỳ thi đầu vào.']],
    f: [['fete_nationale', 'Ngày Quốc khánh Bỉ', '21/7', 'fixed', 'xem diễu hành ở Brussels', 1831], ['carnaval_binche', 'Carnaval de Binche', 'Trước Mùa Chay', 'variable', 'xem các Gilles diễu hành'], ['saint_nicolas', 'Sinterklaas / Saint-Nicolas', '6/12', 'fixed', 'chuẩn bị quà nhỏ cho trẻ em']],
    m: [['Lễ dân sự tại tòa thị chính', 'Hôn nhân dân sự là bắt buộc trước lễ tôn giáo.'], ['Hôn nhân bình đẳng', 'Từ 2003, hai người cùng giới có thể kết hôn.'], ['Hợp đồng hôn nhân', 'Có thể chọn chế độ tài sản qua công chứng.']],
    d: ['Moules-frites', 'Carbonnade flamande', 'Waterzooi', 'Bánh waffle Liège', 'Speculoos'],
    w: [['Thỏa ước tập thể (CCT/CAO)', 'Ủy ban hỗn hợp theo ngành định nhiều điều kiện.'], ['Giờ làm', 'Mốc luật: 38 giờ/tuần.'], ['Phép năm', 'Mốc: 20 ngày cho tuần 5 ngày, tính theo năm trước.'], ['Lương tối thiểu', 'Có mức lương tối thiểu liên ngành.'], ['Chỉ số hóa lương', 'Lương được điều chỉnh theo chỉ số giá.']]
  });
  A('BA', {
    e: [['Trung học và matura', 'Quy định khác nhau giữa các thực thể, bang; không có một kỳ thi chung toàn quốc.'], ['Trường kỹ thuật', 'Trung học kỹ thuật và nghề.'], ['Đại học', 'Mỗi trường có tuyển sinh riêng.']],
    f: [['bajram', 'Ramazanski Bajram', 'Sau Ramadan', 'lunar', 'thăm hàng xóm, ăn baklava'], ['christmas_orthodox', 'Giáng sinh Chính thống', '7/1', 'fixed', 'chúc mừng hàng xóm Chính thống'], ['sarajevo_film', 'Liên hoan phim Sarajevo', 'Tháng 8', 'variable', 'xem chiếu phim ngoài trời']],
    m: [['Đăng ký dân sự', 'Đăng ký tại cơ quan hộ tịch theo luật gia đình của thực thể.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ tôn giáo', 'Tùy chọn, theo cộng đồng của hai người.']],
    d: ['Ćevapi', 'Burek', 'Begova čorba', 'Sarma', 'Tufahija'],
    w: [['Luật lao động theo thực thể', 'Liên bang BiH, Republika Srpska và Brčko có luật riêng.'], ['Giờ làm', 'Mốc tham chiếu: 40 giờ/tuần.'], ['Phép năm', 'Có phép năm tối thiểu theo luật thực thể.'], ['Lương tối thiểu', 'Mỗi thực thể đặt mức riêng.'], ['Đi làm nước ngoài', 'Nhiều người làm việc ở EU.']]
  });
  A('BG', {
    e: [['Kỳ thi DZI (matura)', 'Kỳ thi trình độ nhà nước cuối lớp 12.'], ['Trường nghề', 'Trung học nghề có chứng chỉ trình độ.'], ['Đại học', 'Xét theo điểm matura hoặc kỳ thi riêng.']],
    x: 'DZI (matura Bulgaria)',
    f: [['baba_marta', 'Baba Marta', '1/3', 'fixed', 'tặng nhau vòng martenitsa đỏ trắng'], ['liberation_day', 'Ngày Giải phóng', '3/3', 'fixed', 'tham gia lễ tưởng niệm', 1878], ['alphabet_day', 'Ngày Chữ viết và Văn hóa', '24/5', 'fixed', 'tham gia hoạt động trường học']],
    m: [['Đăng ký dân sự', 'Chỉ hôn nhân dân sự có hiệu lực pháp lý.'], ['Độ tuổi 18', 'Mốc luật: 18, ngoại lệ hẹp từ 16.'], ['Lễ nhà thờ', 'Tùy chọn sau đăng ký.']],
    d: ['Banitsa', 'Shopska salata', 'Kavarma', 'Tarator', 'Kebapche'],
    w: [['Bộ luật Lao động', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 20 ngày làm việc.'], ['Lương tối thiểu', 'Mức tối thiểu quốc gia điều chỉnh hằng năm.'], EU48]
  });
  A('HR', {
    e: [['Gimnazija và Državna matura', 'Kỳ thi matura nhà nước dùng cho tuyển sinh đại học.'], ['Trường nghề', 'Trung học nghề 3 hoặc 4 năm.'], ['Đại học', 'Đăng ký qua hệ thống tuyển sinh quốc gia.']],
    x: 'Državna matura (Croatia)',
    f: [['statehood_day', 'Ngày Nhà nước', '30/5', 'fixed', 'tham gia hoạt động công cộng'], ['rijeka_carnival', 'Lễ hội hóa trang Rijeka', 'Tháng 1–2', 'variable', 'xem diễu hành hóa trang'], ['assumption', 'Lễ Đức Mẹ Lên Trời', '15/8', 'fixed', 'tham gia lễ hội làng hoặc nghỉ hè']],
    m: [['Lễ dân sự hoặc tôn giáo có hiệu lực', 'Lễ tôn giáo của một số giáo hội có hiệu lực dân sự khi đáp ứng điều kiện.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Đối tác chung sống', 'Cặp cùng giới có thể đăng ký đối tác chung sống.']],
    d: ['Peka', 'Črni rižot', 'Štrukli', 'Pašticada', 'Fritule'],
    w: [['Luật Lao động Croatia', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: tối thiểu 4 tuần.'], ['Lương tối thiểu', 'Mức tối thiểu quốc gia.'], EU48]
  });
  A('CY', {
    e: [['Lykeio và kỳ thi Pancyprian', 'Kỳ thi Pancyprian vừa xét tốt nghiệp vừa tuyển sinh đại học công.'], ['Trường kỹ thuật', 'Trung học kỹ thuật và nghề.'], ['Đại học', 'Đại học Síp, các trường tư và học ở Hy Lạp.']],
    x: 'Kỳ thi Pancyprian (Síp)',
    f: [['easter', 'Lễ Phục sinh Chính thống', 'Mùa xuân, theo lịch Chính thống', 'variable', 'nhuộm trứng đỏ và ăn flaouna'], ['kataklysmos', 'Kataklysmos', 'Lễ Hiện xuống Chính thống, mùa hè', 'variable', 'dự lễ hội bên biển'], ['independence_day', 'Ngày Độc lập', '1/10', 'fixed', 'xem diễu hành', 1960]],
    m: [['Lễ dân sự hoặc nhà thờ', 'Cả hai hình thức được công nhận.'], ['Kết hợp dân sự', 'Có kết hợp dân sự cho mọi cặp đôi.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Halloumi', 'Souvlaki', 'Kleftiko', 'Koupepia', 'Loukoumades'],
    w: [['Luật lao động Síp', 'Nhiều luật riêng về hợp đồng, nghỉ, chấm dứt.'], ['Lương tối thiểu quốc gia', 'Áp dụng từ 2023.'], ['Phép năm', 'Mốc luật: 20 ngày cho tuần 5 ngày.'], ['Quỹ An sinh Xã hội', 'Đóng bảo hiểm xã hội và GESY.'], EU48]
  });
  A('CZ', {
    e: [['Gymnázium và maturita', 'Kỳ thi maturita nhà nước và kỳ thi trường.'], ['Trường nghề (učiliště)', 'Chứng chỉ nghề sau 3 năm.'], ['Đại học', 'Học miễn phí bằng tiếng Séc ở trường công.']],
    x: 'Maturita (Séc)',
    f: [['christmas_eve', 'Štědrý den', '24/12', 'fixed', 'ăn cá chép và salad khoai tây cùng gia đình'], ['easter_monday', 'Velikonoční pondělí', 'Thứ Hai Phục sinh', 'variable', 'tham gia trò dân gian, tôn trọng người không muốn tham gia'], ['statehood_day', 'Ngày Độc lập Tiệp Khắc', '28/10', 'fixed', 'tham quan triển lãm', 1918]],
    m: [['Lễ dân sự hoặc tôn giáo', 'Cả hai hình thức có hiệu lực khi đáp ứng điều kiện.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Đối tác đăng ký', 'Cặp cùng giới có quan hệ đối tác với quyền mở rộng từ 2025.']],
    d: ['Svíčková', 'Vepřo knedlo zelo', 'Guláš', 'Trdelník', 'Bramboráky'],
    w: [['Bộ luật Lao động Séc', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: tối thiểu 4 tuần.'], ['Lương tối thiểu', 'Mức tối thiểu quốc gia.'], EU48]
  });
  A('DK', {
    e: [['Gymnasium (STX/HHX/HTX)', 'Kỳ thi studentereksamen cuối cấp.'], ['Erhvervsuddannelse', 'Học nghề kép có học việc.'], ['Đại học và SU', 'Học phí miễn với công dân EU; sinh viên Đan Mạch có trợ cấp SU.']],
    f: [['sankthans', 'Sankthansaften', '23/6', 'fixed', 'đốt lửa trại và hát bài Midsommervisen'], ['constitution_day', 'Grundlovsdag', '5/6', 'fixed', 'nghe các buổi nói chuyện công cộng', 1849], ['fastelavn', 'Fastelavn', 'Trước Mùa Chay', 'variable', 'trẻ em hóa trang và đập thùng']],
    m: [['Lễ dân sự hoặc nhà thờ', 'Cả hai được công nhận; cần giấy chứng nhận điều kiện trước.'], ['Hôn nhân bình đẳng', 'Hai người cùng giới có thể kết hôn.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Smørrebrød', 'Frikadeller', 'Stegt flæsk', 'Æbleskiver', 'Rødgrød med fløde'],
    w: [['Mô hình Đan Mạch', 'Lương và giờ làm chủ yếu theo thỏa ước; không có lương tối thiểu luật định.'], ['Giờ làm', 'Mốc thỏa ước phổ biến: 37 giờ/tuần.'], ['Phép năm', 'Mốc luật: 25 ngày (5 tuần).'], ['Quỹ thất nghiệp (A-kasse)', 'Tham gia tự nguyện để có trợ cấp thất nghiệp.'], EU48]
  });
  A('EE', {
    e: [['Gümnaasium và kỳ thi quốc gia', 'Kỳ thi quốc gia (riigieksamid) cuối cấp.'], ['Trường nghề (kutsekool)', 'Đào tạo nghề và học việc.'], ['Đại học', 'Học tiếng Estonia miễn phí ở trường công.']],
    x: 'Riigieksamid (Estonia)',
    f: [['jaanipaev', 'Jaanipäev', '23–24/6', 'fixed', 'đốt lửa trại đêm hè'], ['independence_day', 'Ngày Độc lập', '24/2', 'fixed', 'xem diễu hành và lễ thượng cờ', 1918], ['song_festival', 'Laulupidu (Liên hoan Ca)', 'Khoảng 5 năm một lần, mùa hè', 'variable', 'hát cùng hàng chục nghìn người']],
    m: [['Đăng ký hộ tịch', 'Đăng ký tại cơ quan hộ tịch hoặc mục sư được ủy quyền.'], ['Hôn nhân bình đẳng', 'Từ 2024, hai người cùng giới có thể kết hôn.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Verivorst', 'Mulgipuder', 'Kama', 'Kiluvõileib', 'Bánh mì lúa mạch đen']
    , w: [['Luật Hợp đồng Lao động', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 28 ngày theo lịch.'], ['Hưu trí cấp hai', 'Có quỹ hưu trí bổ sung.'], EU48]
  });
  A('GE', {
    e: [['Trường phổ thông và Kỳ thi Quốc gia Thống nhất', 'Kỳ thi quốc gia thống nhất dùng cho tuyển sinh và học bổng.'], ['College nghề', 'Đào tạo nghề, nhiều chương trình miễn phí.'], ['Đại học', 'Học bổng nhà nước xét theo điểm thi.']],
    x: 'Kỳ thi Quốc gia Thống nhất Georgia',
    f: [['tbilisoba', 'Tbilisoba', 'Tháng 10', 'variable', 'tham gia hội chợ thu hoạch'], ['independence_day', 'Ngày Độc lập', '26/5', 'fixed', 'xem triển lãm công cộng', 1918], ['christmas_orthodox', 'Giáng sinh Chính thống', '7/1', 'fixed', 'xem diễu hành Alilo']],
    m: [['Đăng ký dân sự', 'Đăng ký tại Public Service Hall.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Supra', 'Tiệc supra có tamada; quy mô tùy hai người.']],
    d: ['Khachapuri', 'Khinkali', 'Pkhali', 'Lobio', 'Churchkhela'],
    w: [['Bộ luật Lao động', 'Sửa đổi lớn năm 2020.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 24 ngày làm việc.'], ['Hưu trí tích lũy', 'Hưu trí tích lũy bắt buộc từ 2019.'], ['Thanh tra lao động', 'Cơ quan thanh tra lao động được mở rộng quyền.']]
  });
  A('DE', {
    e: [['Gymnasium và Abitur', 'Abitur do từng bang tổ chức, có phần thi chung.'], ['Ausbildung (đào tạo nghề kép)', 'Học nghề tại doanh nghiệp và Berufsschule.'], ['Đại học và Fachhochschule', 'Trường công thường không thu học phí cho bằng đầu.']],
    x: 'Abitur (Đức)',
    f: [['weihnachtsmarkt', 'Weihnachtsmarkt', 'Mùa Vọng', 'variable', 'dạo chợ Giáng sinh, mua đồ thủ công'], ['einheit', 'Ngày Thống nhất nước Đức', '3/10', 'fixed', 'tham gia hoạt động công cộng', 1990], ['karneval', 'Karneval / Fasching', 'Trước Mùa Chay', 'variable', 'xem diễu hành ở Köln, Mainz']],
    m: [['Đăng ký tại Standesamt', 'Chỉ hôn nhân tại Standesamt có hiệu lực.'], ['Hôn nhân bình đẳng', 'Từ 2017, hai người cùng giới có thể kết hôn.'], ['Đặt lịch và giấy tờ', 'Cần đăng ký trước, nộp giấy tờ.']],
    d: ['Bratwurst', 'Sauerbraten', 'Brezel', 'Spätzle', 'Schwarzwälder Kirschtorte'],
    w: [['Arbeitszeitgesetz', 'Mốc luật: 8 giờ/ngày, có thể tới 10 giờ nếu bù trung bình.'], ['Phép năm', 'Mốc luật: 20 ngày cho tuần 5 ngày.'], ['Mindestlohn', 'Lương tối thiểu luật định, ủy ban điều chỉnh định kỳ.'], ['Betriebsrat', 'Hội đồng nhân viên có quyền tham vấn.'], ['Bảo hiểm xã hội', 'Hưu trí, y tế, thất nghiệp, chăm sóc dài hạn.']]
  });
  A('GR', {
    e: [['Lykeio và Panhellenic', 'Kỳ thi Panhellenic quyết định tuyển sinh đại học.'], ['EPAL', 'Trung học nghề.'], ['Đại học công', 'Học phí miễn ở bậc cử nhân trường công.']],
    x: 'Kỳ thi Panhellenic (Hy Lạp)',
    f: [['easter', 'Lễ Phục sinh Chính thống', 'Mùa xuân, theo lịch Chính thống', 'variable', 'dự lễ nửa đêm và nướng cừu'], ['oxi_day', 'Ngày Ochi', '28/10', 'fixed', 'xem diễu hành học sinh', 1940], ['independence_day', 'Ngày Độc lập', '25/3', 'fixed', 'xem diễu hành', 1821]],
    m: [['Lễ dân sự hoặc nhà thờ', 'Cả hai có hiệu lực.'], ['Hôn nhân bình đẳng', 'Từ 2024, hai người cùng giới có thể kết hôn.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Moussaka', 'Souvlaki', 'Spanakopita', 'Gemista', 'Baklava'],
    w: [['Luật lao động Hy Lạp', 'Có cải cách năm 2021 và 2023.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 20 ngày tăng theo thâm niên.'], ['ERGANI', 'Đăng ký giờ làm trên hệ thống điện tử.'], EU48]
  });
  A('VA', {
    e: [['Không có hệ thống trường phổ thông riêng', 'Dân số rất nhỏ; trẻ em sống trong Thành Vatican thường học ở trường tại Rome.'], ['Đào tạo nghề trong các cơ quan', 'Một số nghề thủ công, bảo tồn, bảo tàng học qua làm việc.'], ['Các trường giáo hoàng', 'Nhiều đại học giáo hoàng nằm ở Rome, đào tạo thần học, luật giáo hội.']],
    f: [['easter', 'Lễ Phục sinh', 'Mùa xuân', 'variable', 'tham dự thánh lễ ở Quảng trường Thánh Phêrô'], ['saints_peter_paul', 'Lễ Thánh Phêrô và Phaolô', '29/6', 'fixed', 'tham dự các nghi lễ công cộng'], ['christmas', 'Giáng sinh', '25/12', 'fixed', 'xem lễ và lời chúc Urbi et Orbi']],
    m: [['Hôn nhân theo giáo luật', 'Hôn nhân trong Vatican theo giáo luật Công giáo.'], ['Cư trú hạn chế', 'Rất ít người có quyền cư trú; quyền cư trú gắn với công việc.'], ['Thủ tục ở Ý', 'Nhiều cặp làm thủ tục dân sự tại Ý.']],
    d: ['Pasta kiểu Rome', 'Supplì', 'Saltimbocca', 'Carciofi alla romana', 'Maritozzo'],
    w: [['Văn phòng Lao động Tòa Thánh (ULSA)', 'Quan hệ lao động nhân viên được giải quyết qua ULSA.'], ['Nhân viên Tòa Thánh', 'Phần lớn người làm việc là giáo sĩ, tu sĩ hoặc nhân viên giáo dân.'], ['Cư trú', 'Quyền cư trú thường chấm dứt khi kết thúc công việc.'], ['Lao động ngoài', 'Nhiều người sống ở Ý và đi làm hằng ngày.'], ['Nguồn', 'Không có trang ILO quốc gia; dùng trang chính thức của Nhà nước Vatican.']]
  });
  A('HU', {
    e: [['Gimnázium và érettségi', 'Kỳ thi érettségi cấp thường hoặc nâng cao.'], ['Trường nghề (szakképzés)', 'Technikum và trường kỹ năng.'], ['Đại học', 'Xét điểm qua hệ thống felvi.hu.']],
    x: 'Érettségi (Hungary)',
    f: [['national_day', 'Ngày Cách mạng 1848', '15/3', 'fixed', 'cài nơ ba màu và tham gia lễ', 1848], ['st_stephen', 'Ngày Thánh István', '20/8', 'fixed', 'xem pháo hoa ở Budapest'], ['busojaras', 'Busójárás (Mohács)', 'Trước Mùa Chay', 'variable', 'xem lễ hội mặt nạ']],
    m: [['Đăng ký hộ tịch', 'Hôn nhân dân sự là bắt buộc.'], ['Đối tác đăng ký', 'Cặp cùng giới có thể đăng ký đối tác.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Gulyás', 'Lángos', 'Pörkölt', 'Halászlé', 'Dobos torta'],
    w: [['Bộ luật Lao động 2012', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc: 20 ngày cơ bản cộng thêm theo tuổi.'], ['Lương tối thiểu', 'Có lương tối thiểu và mức bảo đảm cho người có bằng.'], EU48]
  });
  A('IS', {
    e: [['Framhaldsskóli và stúdentspróf', 'Chứng chỉ stúdentspróf từ trường trung học.'], ['Đào tạo nghề', 'Học nghề có học việc.'], ['Đại học Iceland', 'Trường công thu phí đăng ký thấp.']],
    f: [['thorrablot', 'Þorrablót', 'Tháng Þorri, khoảng tháng 1–2', 'variable', 'thử các món truyền thống'], ['national_day', 'Ngày Quốc khánh', '17/6', 'fixed', 'tham gia diễu hành', 1944], ['menningarnott', 'Menningarnótt', 'Tháng 8', 'variable', 'xem hòa nhạc ngoài trời ở Reykjavík']],
    m: [['Lễ dân sự hoặc tôn giáo', 'Cả hai được công nhận.'], ['Hôn nhân bình đẳng', 'Hai người cùng giới có thể kết hôn.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Kjötsúpa', 'Plokkfiskur', 'Skyr', 'Hangikjöt', 'Kleinur'],
    w: [['Thỏa ước tập thể', 'Lương theo thỏa ước, bao phủ rộng.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần, có thỏa ước rút ngắn.'], ['Phép năm', 'Mốc luật: 24 ngày.'], ['Quỹ hưu trí', 'Đóng hưu trí nghề nghiệp bắt buộc.'], ['Công đoàn', 'Tỷ lệ tham gia công đoàn rất cao.']]
  });
  A('IT', {
    e: [['Liceo và Esame di Stato (Maturità)', 'Kỳ thi nhà nước cuối cấp.'], ['Istituti tecnici e professionali', 'Trung học kỹ thuật và nghề; có ITS Academy sau phổ thông.'], ['Đại học', 'Nhiều ngành tuyển mở; y khoa có quy trình riêng.']],
    x: 'Maturità (Esame di Stato, Ý)',
    f: [['ferragosto', 'Ferragosto', '15/8', 'fixed', 'nghỉ hè, dã ngoại với bạn bè'], ['festa_repubblica', 'Festa della Repubblica', '2/6', 'fixed', 'xem diễu hành', 1946], ['carnevale', 'Carnevale', 'Trước Mùa Chay', 'variable', 'xem lễ hội hóa trang ở Venice hoặc Viareggio']],
    m: [['Lễ dân sự hoặc lễ hôn phối có hiệu lực', 'Lễ nhà thờ có thể có hiệu lực dân sự (matrimonio concordatario).'], ['Kết hợp dân sự', 'Cặp cùng giới có unione civile từ 2016.'], ['Công bố trước lễ', 'Cần thủ tục pubblicazioni tại thị chính.']],
    d: ['Pasta carbonara', 'Pizza Napoletana', 'Risotto alla milanese', 'Lasagna', 'Tiramisù'],
    w: [['CCNL', 'Thỏa ước lao động quốc gia theo ngành quyết định lương.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: tối thiểu 4 tuần.'], ['TFR', 'Khoản trợ cấp thôi việc tích lũy.'], EU48]
  });
  A('LV', {
    e: [['Trung học và kỳ thi tập trung', 'Kỳ thi tập trung dùng để tốt nghiệp và vào đại học.'], ['Trường nghề', 'Đào tạo nghề có học việc.'], ['Đại học', 'Có suất ngân sách.']],
    x: 'Kỳ thi tập trung Latvia',
    f: [['jani', 'Jāņi (Līgo)', '23–24/6', 'fixed', 'kết vòng hoa và đốt lửa'], ['independence_day', 'Ngày Tuyên bố Độc lập', '18/11', 'fixed', 'xem pháo hoa ở Riga', 1918], ['song_festival', 'Liên hoan Ca và Múa', 'Khoảng 5 năm một lần', 'variable', 'xem hợp xướng lớn']],
    m: [['Đăng ký hộ tịch hoặc nhà thờ', 'Cả hai có hiệu lực.'], ['Quan hệ đối tác', 'Từ 2024 có đăng ký đối tác cho mọi cặp đôi.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Pelēkie zirņi', 'Rupjmaize', 'Sklandrausis', 'Jāņu siers', 'Rasols'],
    w: [['Luật Lao động', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 4 tuần theo lịch.'], ['Lương tối thiểu', 'Mức tối thiểu quốc gia.'], EU48]
  });
  A('LI', {
    e: [['Gymnasium và Matura', 'Liechtensteinisches Gymnasium cấp Matura.'], ['Học nghề kép', 'Học nghề theo mô hình giống Thụy Sĩ.'], ['Đại học Liechtenstein', 'Nhiều người học ở Thụy Sĩ hoặc Áo.']],
    x: 'Matura (Liechtenstein)',
    f: [['staatsfeiertag', 'Ngày Quốc khánh', '15/8', 'fixed', 'xem pháo hoa và tiệc ở Vaduz'], ['funkensonntag', 'Funkensonntag', 'Chủ nhật đầu Mùa Chay', 'variable', 'xem đốt đống lửa lớn'], ['christmas', 'Giáng sinh', '25/12', 'fixed', 'sum họp gia đình']],
    m: [['Lễ dân sự', 'Hôn nhân dân sự tại văn phòng hộ tịch.'], ['Hôn nhân bình đẳng', 'Từ 2025, hai người cùng giới có thể kết hôn.'], ['Giấy tờ', 'Thủ tục chuẩn bị trước.']],
    d: ['Käsknöpfle', 'Ribel', 'Hafaläb', 'Rösti', 'Törkarebl'],
    w: [['Luật lao động', 'Luật Lao động và bộ luật dân sự quy định hợp đồng.'], ['Người đi làm qua biên giới', 'Hơn một nửa người lao động sống ở Áo, Thụy Sĩ.'], ['Phép năm', 'Có phép năm tối thiểu theo luật.'], ['Bảo hiểm xã hội', 'AHV/IV/FAK theo mô hình gần Thụy Sĩ.'], ['Nguồn', 'Không có trang quốc gia ILO; dùng cổng chính thức Liechtenstein.']]
  });
  A('LT', {
    e: [['Gimnazija và brandos egzaminai', 'Kỳ thi trưởng thành cấp nhà nước.'], ['Trường nghề', 'Đào tạo nghề và học việc.'], ['Đại học', 'Xét qua hệ thống LAMA BPO.']],
    x: 'Brandos egzaminai (Lithuania)',
    f: [['joninės', 'Joninės (Rasos)', '23–24/6', 'fixed', 'tìm hoa dương xỉ, đốt lửa'], ['restoration_day', 'Ngày Khôi phục Nhà nước', '16/2', 'fixed', 'tham gia lễ', 1918], ['uzgavenes', 'Užgavėnės', 'Trước Mùa Chay', 'variable', 'đeo mặt nạ, ăn bánh kếp']],
    m: [['Lễ dân sự hoặc nhà thờ', 'Cả hai có hiệu lực khi đăng ký.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Giấy tờ', 'Nộp đơn tại văn phòng hộ tịch.']],
    d: ['Cepelinai', 'Šaltibarščiai', 'Kibinai', 'Šakotis', 'Kugelis'],
    w: [['Bộ luật Lao động 2017', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 20 ngày làm việc.'], ['Lương tối thiểu', 'Mức tối thiểu quốc gia.'], EU48]
  });
  A('LU', {
    e: [['Lycée và diplôme de fin d’études secondaires', 'Học bằng tiếng Đức, Pháp, Luxembourg.'], ['Đào tạo nghề (DAP, DT)', 'Học nghề kép và kỹ thuật.'], ['Đại học Luxembourg', 'Nhiều người học ở nước láng giềng.']],
    f: [['national_day', 'Ngày Quốc khánh', '23/6', 'fixed', 'xem pháo hoa ở Luxembourg-Ville'], ['schueberfouer', 'Schueberfouer', 'Cuối tháng 8–9', 'variable', 'đi hội chợ'], ['buergbrennen', 'Buergbrennen', 'Chủ nhật đầu Mùa Chay', 'variable', 'xem đốt lửa']],
    m: [['Lễ dân sự', 'Hôn nhân dân sự là bắt buộc.'], ['Hôn nhân bình đẳng', 'Hai người cùng giới có thể kết hôn.'], ['PACS', 'Có đăng ký đối tác cho mọi cặp đôi.']],
    d: ['Judd mat Gaardebounen', 'Bouneschlupp', 'Gromperekichelcher', 'Rieslingspaschtéit', 'Quetschentaart'],
    w: [['Bộ luật Lao động', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 26 ngày.'], ['Lương tối thiểu xã hội', 'Có mức cho lao động có tay nghề cao hơn.'], ['Người đi làm qua biên giới', 'Nhiều người sống ở Pháp, Bỉ, Đức.']]
  });
  A('MT', {
    e: [['MATSEC', 'Chứng chỉ SEC và Matriculation do MATSEC tổ chức.'], ['MCAST', 'Đào tạo nghề và kỹ thuật.'], ['Đại học Malta', 'Học phí miễn và có trợ cấp sinh viên.']],
    x: 'MATSEC Matriculation (Malta)',
    f: [['festa', 'Festa làng', 'Mùa hè, mỗi làng một ngày', 'variable', 'xem pháo hoa và rước'], ['independence_day', 'Ngày Độc lập', '21/9', 'fixed', 'tham gia hoạt động công cộng', 1964], ['carnival', 'Karnival ta’ Malta', 'Trước Mùa Chay', 'variable', 'xem xe diễu hành']],
    m: [['Lễ dân sự hoặc nhà thờ', 'Cả hai có hiệu lực.'], ['Hôn nhân bình đẳng', 'Từ 2017, hai người cùng giới có thể kết hôn.'], ['Công bố', 'Cần thủ tục công bố trước.']],
    d: ['Pastizzi', 'Fenkata', 'Ftira', 'Lampuki pie', 'Imqaret'],
    w: [['Luật Việc làm và Quan hệ Công nghiệp', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Phép tính theo giờ, có quy định riêng.'], ['Lương tối thiểu', 'Mức tối thiểu quốc gia và COLA.'], EU48]
  });
  A('MD', {
    e: [['Liceu và BAC', 'Kỳ thi bacalaureat cuối cấp.'], ['Trường nghề', 'Đào tạo nghề, có học kép.'], ['Đại học', 'Suất ngân sách xét theo BAC.']],
    x: 'BAC (Moldova)',
    f: [['martisor', 'Mărțișor', '1/3', 'fixed', 'tặng vòng đỏ trắng'], ['wine_day', 'Ngày Rượu vang Quốc gia', 'Cuối tuần đầu tháng 10', 'variable', 'xem hội chợ thu hoạch nho'], ['independence_day', 'Ngày Độc lập', '27/8', 'fixed', 'tham gia hoạt động công cộng', 1991]],
    m: [['Đăng ký hộ tịch', 'Đăng ký tại cơ quan hộ tịch.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ nhà thờ', 'Tùy chọn sau đăng ký.']],
    d: ['Mămăligă', 'Sarmale', 'Plăcintă', 'Zeamă', 'Răcituri'],
    w: [['Bộ luật Lao động', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 28 ngày theo lịch.'], ['Lương tối thiểu', 'Có mức tối thiểu.'], ['Đi làm nước ngoài', 'Nhiều người làm việc ở EU.']]
  });
  A('MC', {
    e: [['Lycée và baccalauréat', 'Hệ thống theo chương trình Pháp.'], ['Đào tạo nghề', 'Lycée kỹ thuật và khách sạn.'], ['Đại học', 'Phần lớn học ở Pháp; có International University of Monaco.']],
    x: 'Baccalauréat (Monaco)',
    f: [['fete_nationale', 'Ngày Quốc khánh Monaco', '19/11', 'fixed', 'xem lễ ở quảng trường Cung điện'], ['sainte_devote', 'Lễ Thánh Dévote', '27/1', 'fixed', 'xem đốt thuyền tượng trưng'], ['grand_prix', 'Grand Prix Monaco', 'Tháng 5', 'variable', 'theo dõi cuộc đua hoặc tránh khu vực đông']],
    m: [['Lễ dân sự', 'Lễ dân sự tại tòa thị chính.'], ['Hợp đồng chung sống', 'Có hợp đồng chung sống cho mọi cặp đôi.'], ['Lễ nhà thờ', 'Tùy chọn sau lễ dân sự.']],
    d: ['Barbagiuan', 'Socca', 'Stocafi', 'Fougasse Monaco', 'Pissaladière'],
    w: [['Luật lao động Monaco', 'Có luật riêng về hợp đồng và giờ làm.'], ['Giờ làm', 'Mốc tham chiếu: 39 giờ/tuần.'], ['Người đi làm từ Pháp/Ý', 'Phần lớn người lao động sống ngoài Monaco.'], ['Ưu tiên việc làm', 'Có thứ tự ưu tiên tuyển dụng theo quốc tịch và nơi ở.'], ['Nguồn', 'Không có trang quốc gia ILO; dùng cổng chính phủ Monaco.']]
  });
  A('ME', {
    e: [['Gimnazija và matura', 'Kỳ thi matura cuối cấp.'], ['Trường nghề', 'Trung học nghề.'], ['Đại học Montenegro', 'Trường công và tư.']],
    x: 'Matura (Montenegro)',
    f: [['statehood_day', 'Ngày Nhà nước', '13/7', 'fixed', 'tham gia hoạt động công cộng'], ['independence_day', 'Ngày Độc lập', '21–22/5', 'fixed', 'xem hòa nhạc', 2006], ['mimosa', 'Lễ hội Mimosa (Herceg Novi)', 'Tháng 2', 'variable', 'xem diễu hành hoa']],
    m: [['Đăng ký dân sự', 'Đăng ký tại cơ quan hộ tịch.'], ['Đối tác chung sống', 'Cặp cùng giới có đối tác chung sống từ 2021.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Njeguški pršut', 'Kačamak', 'Crni rižot', 'Ćevapi', 'Priganice'],
    w: [['Luật Lao động', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: tối thiểu 20 ngày.'], ['Lao động thời vụ', 'Nhiều việc theo mùa du lịch.'], ['Lương tối thiểu', 'Có mức tối thiểu.']]
  });
  A('NL', {
    e: [['VWO/HAVO và eindexamen', 'Kỳ thi cuối cấp gồm phần trung ương.'], ['MBO', 'Đào tạo nghề nhiều cấp, có học việc (BBL).'], ['HBO và WO', 'Đại học ứng dụng và nghiên cứu; có khoản vay học phí.']],
    x: 'Eindexamen (Hà Lan)',
    f: [['koningsdag', 'Koningsdag', '27/4', 'fixed', 'đi chợ trời và mặc màu cam'], ['sinterklaas', 'Sinterklaas', '5/12', 'fixed', 'tặng quà nhỏ và thơ; hình tượng Zwarte Piet đang được thay đổi'], ['bevrijdingsdag', 'Bevrijdingsdag', '5/5', 'fixed', 'dự lễ hội tự do', 1945]],
    m: [['Lễ dân sự tại thị chính', 'Hôn nhân dân sự là bắt buộc.'], ['Hôn nhân bình đẳng', 'Từ 2001, nước đầu tiên cho phép hôn nhân cùng giới.'], ['Đối tác đăng ký', 'Có partnerschap đăng ký.']],
    d: ['Stamppot', 'Haring', 'Bitterballen', 'Poffertjes', 'Stroopwafel'],
    w: [['CAO (thỏa ước tập thể)', 'Nhiều điều kiện theo CAO ngành.'], ['Arbeidstijdenwet', 'Có giới hạn tối đa ngày và tuần, không quy định giờ chuẩn chung.'], ['Phép năm', 'Mốc luật: 4 lần số giờ tuần.'], ['Lương tối thiểu theo giờ', 'Có lương tối thiểu theo giờ.'], ['Hưu trí nghề nghiệp', 'Quỹ hưu trí qua CAO.']]
  });
  A('MK', {
    e: [['Trung học và matura nhà nước', 'Kỳ thi matura nhà nước.'], ['Trường nghề', 'Trung học nghề.'], ['Đại học', 'Trường công và tư.']],
    x: 'Matura nhà nước (Bắc Macedonia)',
    f: [['ilinden', 'Ilinden', '2/8', 'fixed', 'tham gia lễ', 1903], ['independence_day', 'Ngày Độc lập', '8/9', 'fixed', 'tham gia hoạt động công cộng', 1991], ['vodici', 'Vodici (Lễ Hiển linh)', '19/1', 'fixed', 'xem nghi thức ném thánh giá xuống nước']],
    m: [['Đăng ký dân sự', 'Đăng ký tại cơ quan hộ tịch.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ tôn giáo', 'Tùy chọn.']],
    d: ['Tavče gravče', 'Ajvar', 'Pastrmajlija', 'Shopska salata', 'Burek']
    , w: [['Luật Quan hệ Lao động', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: tối thiểu 20 ngày.'], ['Lương tối thiểu', 'Có mức tối thiểu.'], ['Đi làm nước ngoài', 'Nhiều người làm việc ở EU.']]
  });
  A('NO', {
    e: [['Videregående skole', 'Chương trình chuẩn bị đại học có kỳ thi cuối môn.'], ['Học nghề (fagbrev)', 'Hai năm ở trường và hai năm học việc.'], ['Đại học', 'Trường công không thu học phí với nhiều nhóm.']],
    f: [['syttende_mai', 'Ngày Hiến pháp (17. mai)', '17/5', 'fixed', 'xem diễu hành trẻ em', 1814], ['sankthans', 'Sankthansaften', '23/6', 'fixed', 'đốt lửa bên bờ biển'], ['jul', 'Jul', '24–26/12', 'fixed', 'ăn bữa tối Giáng sinh cùng gia đình']],
    m: [['Lễ dân sự hoặc tôn giáo', 'Cần kiểm tra điều kiện trước qua Skatteetaten.'], ['Hôn nhân bình đẳng', 'Hai người cùng giới có thể kết hôn.'], ['Độ tuổi 18', 'Mốc luật: 18, không ngoại lệ.']],
    d: ['Fårikål', 'Lutefisk', 'Brunost', 'Kjøttkaker', 'Lefse'],
    w: [['Arbeidsmiljøloven', 'Luật Môi trường Làm việc.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần, thỏa ước phổ biến 37,5.'], ['Phép năm', 'Mốc luật: 25 ngày làm việc.'], ['Không có lương tối thiểu chung', 'Một số ngành có thỏa ước mở rộng bắt buộc.'], ['NAV', 'Cơ quan lao động và phúc lợi.']]
  });
  A('PL', {
    e: [['Liceum và matura', 'Kỳ thi matura quốc gia.'], ['Technikum và szkoła branżowa', 'Trung học kỹ thuật và nghề.'], ['Đại học', 'Xét theo điểm matura.']],
    x: 'Matura (Ba Lan)',
    f: [['wigilia', 'Wigilia', '24/12', 'fixed', 'bày 12 món và chia bánh opłatek'], ['wszystkich_swietych', 'Lễ Các Thánh', '1/11', 'fixed', 'thắp nến ở nghĩa trang'], ['independence_day', 'Ngày Độc lập', '11/11', 'fixed', 'tham gia hoạt động công cộng', 1918]],
    m: [['Lễ dân sự hoặc lễ hiệp ước', 'Lễ nhà thờ có thể có hiệu lực dân sự.'], ['Độ tuổi 18', 'Mốc luật: 18; ngoại lệ hẹp cho nữ 16.'], ['Giấy tờ', 'Nộp tại văn phòng hộ tịch.']],
    d: ['Pierogi', 'Bigos', 'Żurek', 'Gołąbki', 'Pączki'],
    w: [['Bộ luật Lao động', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 20 hoặc 26 ngày theo thâm niên.'], ['Lương tối thiểu', 'Mức tối thiểu tháng và giờ.'], EU48]
  });
  A('PT', {
    e: [['Ensino secundário và exames nacionais', 'Kỳ thi quốc gia dùng cho tuyển sinh đại học.'], ['Cursos profissionais', 'Chương trình nghề trong trung học.'], ['Đại học và politécnico', 'Đăng ký qua Concurso Nacional de Acesso.']],
    x: 'Exames nacionais (Bồ Đào Nha)',
    f: [['santo_antonio', 'Festas de Santo António', '12–13/6', 'fixed', 'ăn cá mòi nướng ở Lisbon'], ['sao_joao', 'São João (Porto)', '23–24/6', 'fixed', 'đi hội đêm hè'], ['25_abril', 'Dia da Liberdade', '25/4', 'fixed', 'cài hoa cẩm chướng', 1974]],
    m: [['Lễ dân sự hoặc Công giáo', 'Cả hai có hiệu lực dân sự.'], ['Hôn nhân bình đẳng', 'Từ 2010, hai người cùng giới có thể kết hôn.'], ['Thủ tục trước', 'Mở hồ sơ tại cơ quan hộ tịch.']],
    d: ['Bacalhau à Brás', 'Pastel de nata', 'Francesinha', 'Caldo verde', 'Sardinhas assadas'],
    w: [['Bộ luật Lao động', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 22 ngày làm việc.'], ['Lương tháng 13 và 14', 'Có trợ cấp kỳ nghỉ và Giáng sinh.'], ['Lương tối thiểu', 'Mức tối thiểu quốc gia.']]
  });
  A('RO', {
    e: [['Liceu và Bacalaureat', 'Kỳ thi bacalaureat quốc gia.'], ['Învățământ profesional', 'Trường nghề và học kép.'], ['Đại học', 'Có suất ngân sách.']],
    x: 'Bacalaureat (Romania)',
    f: [['martisor', 'Mărțișor', '1/3', 'fixed', 'tặng vòng đỏ trắng'], ['national_day', 'Ngày Quốc khánh', '1/12', 'fixed', 'xem diễu hành', 1918], ['easter', 'Lễ Phục sinh Chính thống', 'Mùa xuân', 'variable', 'nhuộm trứng đỏ, ăn cozonac']],
    m: [['Đăng ký dân sự', 'Hôn nhân dân sự là bắt buộc trước lễ nhà thờ.'], ['Độ tuổi 18', 'Mốc luật: 18; ngoại lệ từ 16.'], ['Giấy tờ', 'Nộp đơn trước tại thị chính.']],
    d: ['Sarmale', 'Mămăligă', 'Mici', 'Ciorbă de burtă', 'Papanași'],
    w: [['Bộ luật Lao động', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 20 ngày làm việc.'], ['REVISAL', 'Hợp đồng đăng ký trên hệ thống điện tử.'], EU48]
  });
  A('RU', {
    e: [['Trường phổ thông và EGE', 'Kỳ thi quốc gia thống nhất (EGE).'], ['SPO (giáo dục nghề trung cấp)', 'College và technikum.'], ['Đại học', 'Suất ngân sách xét theo điểm EGE.']],
    x: 'EGE (Nga)',
    f: [['maslenitsa', 'Maslenitsa', 'Tuần trước Mùa Chay Chính thống', 'variable', 'ăn bánh blini và đốt hình nộm'], ['new_year', 'Năm mới', '31/12–1/1', 'fixed', 'ăn bữa tối năm mới cùng gia đình'], ['victory_day', 'Ngày Chiến thắng', '9/5', 'fixed', 'tham gia tưởng niệm', 1945]],
    m: [['Đăng ký ZAGS', 'Hôn nhân chỉ có hiệu lực khi đăng ký.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Lễ nhà thờ', 'Tùy chọn, không có hiệu lực pháp lý riêng.']],
    d: ['Borscht', 'Pelmeni', 'Blini', 'Olivier', 'Shchi'],
    w: [['Bộ luật Lao động', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 28 ngày theo lịch.'], ['Sổ lao động điện tử', 'Thông tin việc làm lưu điện tử.'], ['Lương tối thiểu (MROT)', 'Có mức tối thiểu liên bang.']]
  });
  A('SM', {
    e: [['Scuola secondaria superiore', 'Hệ thống gần với Ý.'], ['Đào tạo nghề', 'Trung tâm đào tạo nghề.'], ['Đại học San Marino', 'Nhiều người học tại Ý.']],
    f: [['founding_day', 'Ngày Thánh Marino (Lập quốc)', '3/9', 'fixed', 'xem bắn nỏ'], ['medieval_days', 'Giornate Medioevali', 'Tháng 7', 'variable', 'xem tái hiện trung cổ'], ['captains_regent', 'Lễ nhậm chức Nhiếp chính', '1/4 và 1/10', 'fixed', 'xem nghi lễ công cộng']],
    m: [['Lễ dân sự hoặc tôn giáo', 'Cả hai có hiệu lực.'], ['Kết hợp dân sự', 'Có kết hợp dân sự từ 2018.'], ['Thủ tục trước', 'Công bố trước lễ.']],
    d: ['Torta Tre Monti', 'Piadina', 'Nidi di rondine', 'Cacciatello', 'Bustrengo'],
    w: [['Luật lao động San Marino', 'Văn bản riêng của nước này.'], ['Giờ làm', 'Mốc tham chiếu: 37,5–40 giờ tùy thỏa ước.'], ['Người đi làm từ Ý', 'Nhiều người sống ở Ý.'], ['ISS', 'Viện An sinh Xã hội.'], ['Thỏa ước', 'Thỏa ước ngành quyết định lương.']]
  });
  A('RS', {
    e: [['Gimnazija và matura', 'Kỳ thi matura quốc gia được triển khai dần.'], ['Trường nghề', 'Trung học nghề, có học kép.'], ['Đại học', 'Có suất ngân sách.']],
    f: [['slava', 'Krsna slava', 'Theo vị thánh bảo hộ của gia đình', 'variable', 'được mời dự slava của bạn bè'], ['statehood_day', 'Sretenje (Ngày Nhà nước)', '15–16/2', 'fixed', 'tham gia lễ'], ['exit', 'EXIT Festival (Novi Sad)', 'Tháng 7', 'variable', 'xem hòa nhạc']],
    m: [['Đăng ký dân sự', 'Hôn nhân dân sự là bắt buộc.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Kum', 'Người làm chứng (kum) có vai trò quan trọng.']],
    d: ['Ćevapi', 'Sarma', 'Pljeskavica', 'Karađorđeva šnicla', 'Gibanica'],
    w: [['Luật Lao động', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: tối thiểu 20 ngày.'], ['Lương tối thiểu', 'Có mức tối thiểu.'], ['Đi làm nước ngoài', 'Nhiều người làm việc ở EU.']]
  });
  A('SK', {
    e: [['Gymnázium và maturita', 'Kỳ thi maturita.'], ['Trường nghề', 'Trung học nghề, có học kép.'], ['Đại học', 'Học tiếng Slovakia miễn phí ở trường công.']],
    x: 'Maturita (Slovakia)',
    f: [['christmas_eve', 'Štedrý večer', '24/12', 'fixed', 'ăn kapustnica và cá chép'], ['snp', 'Ngày Khởi nghĩa Quốc gia Slovakia', '29/8', 'fixed', 'tham gia tưởng niệm', 1944], ['easter_monday', 'Thứ Hai Phục sinh', 'Mùa xuân', 'variable', 'tham gia trò dân gian khi được đồng ý']],
    m: [['Lễ dân sự hoặc tôn giáo', 'Cả hai có hiệu lực.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Giấy tờ', 'Nộp tại văn phòng hộ tịch.']],
    d: ['Bryndzové halušky', 'Kapustnica', 'Pirohy', 'Lokše', 'Šúľance'],
    w: [['Bộ luật Lao động', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 4 tuần, 5 tuần từ 33 tuổi.'], ['Lương tối thiểu', 'Mức tối thiểu quốc gia.'], EU48]
  });
  A('SI', {
    e: [['Gimnazija và splošna matura', 'Kỳ thi matura tổng quát.'], ['Trường nghề', 'Trung học nghề và poklicna matura.'], ['Đại học', 'Học miễn phí cho công dân EU.']],
    x: 'Splošna matura (Slovenia)',
    f: [['kurentovanje', 'Kurentovanje (Ptuj)', 'Trước Mùa Chay', 'variable', 'xem kurent hóa trang'], ['statehood_day', 'Ngày Nhà nước', '25/6', 'fixed', 'tham gia lễ', 1991], ['presern_day', 'Ngày Prešeren', '8/2', 'fixed', 'tham quan bảo tàng mở cửa']],
    m: [['Lễ dân sự', 'Hôn nhân dân sự tại cơ quan hành chính.'], ['Hôn nhân bình đẳng', 'Từ 2022, hai người cùng giới có thể kết hôn.'], ['Độ tuổi 18', 'Mốc luật: 18.']],
    d: ['Kranjska klobasa', 'Potica', 'Štruklji', 'Jota', 'Bánh Bled (kremšnita)'],
    w: [['Luật Quan hệ Lao động', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: tối thiểu 4 tuần.'], ['Phụ cấp kỳ nghỉ', 'Người lao động nhận phụ cấp kỳ nghỉ.'], EU48]
  });
  A('ES', {
    e: [['Bachillerato và PAU', 'Kỳ thi PAU (trước đây EBAU) để vào đại học.'], ['Formación Profesional', 'FP trung cấp và cao cấp, có FP kép.'], ['Đại học', 'Xét theo điểm PAU.']],
    x: 'PAU (Tây Ban Nha)',
    f: [['semana_santa', 'Semana Santa', 'Tuần trước Phục sinh', 'variable', 'xem rước, tôn trọng không gian nghi lễ'], ['san_fermin', 'San Fermín (Pamplona)', '6–14/7', 'fixed', 'xem hòa nhạc; không bắt buộc chạy cùng bò'], ['fiesta_nacional', 'Fiesta Nacional', '12/10', 'fixed', 'xem diễu hành']],
    m: [['Lễ dân sự hoặc tôn giáo', 'Cả hai có hiệu lực khi đăng ký.'], ['Hôn nhân bình đẳng', 'Từ 2005, hai người cùng giới có thể kết hôn.'], ['Hồ sơ trước', 'Mở hồ sơ tại Registro Civil.']],
    d: ['Paella', 'Tortilla de patatas', 'Gazpacho', 'Jamón ibérico', 'Churros'],
    w: [['Estatuto de los Trabajadores', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần trung bình năm; có đề xuất giảm.'], ['Phép năm', 'Mốc luật: 30 ngày theo lịch.'], ['SMI', 'Lương tối thiểu liên ngành.'], ['Đăng ký giờ làm', 'Doanh nghiệp phải ghi giờ làm hằng ngày.']]
  });
  A('SE', {
    e: [['Gymnasium', 'Không có kỳ thi cuối cấp quốc gia chung; xét theo điểm, có thể dùng högskoleprovet.'], ['Yrkesprogram và yrkeshögskola', 'Chương trình nghề và cao đẳng nghề.'], ['Đại học', 'Đăng ký qua antagning.se.']],
    f: [['midsommar', 'Midsommar', 'Cuối tuần gần Hạ chí', 'variable', 'nhảy quanh cột hoa'], ['lucia', 'Lucia', '13/12', 'fixed', 'xem đội hát Lucia'], ['national_day', 'Ngày Quốc khánh', '6/6', 'fixed', 'tham gia lễ nhập tịch hoặc hoạt động công cộng']],
    m: [['Lễ dân sự hoặc tôn giáo', 'Cần kiểm tra điều kiện qua Skatteverket.'], ['Hôn nhân bình đẳng', 'Hai người cùng giới có thể kết hôn.'], ['Độ tuổi 18', 'Mốc luật: 18, không ngoại lệ.']],
    d: ['Köttbullar', 'Gravlax', 'Kanelbulle', 'Surströmming', 'Prinsesstårta'],
    w: [['Mô hình Thụy Điển', 'Không có lương tối thiểu luật định; thỏa ước tập thể quyết định.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần.'], ['Phép năm', 'Mốc luật: 25 ngày.'], ['Arbetsförmedlingen', 'Cơ quan việc làm công.'], ['Nghỉ cha mẹ', 'Nghỉ cha mẹ có phần dành riêng cho mỗi người.']]
  });
  A('CH', {
    e: [['Gymnasium và Matura', 'Matura do bang tổ chức.'], ['Học nghề kép (EFZ/CFC)', 'Phần lớn thanh niên học nghề kép.'], ['Đại học và Fachhochschule', 'Có Berufsmaturität để vào trường ứng dụng.']],
    x: 'Matura (Thụy Sĩ)',
    f: [['bundesfeier', 'Ngày Quốc khánh', '1/8', 'fixed', 'xem lửa trại và đèn lồng'], ['fasnacht', 'Basler Fasnacht', 'Sau Thứ Tư Lễ Tro', 'variable', 'xem diễu hành lúc 4 giờ sáng'], ['sechselauten', 'Sechseläuten (Zürich)', 'Tháng 4', 'variable', 'xem đốt người tuyết Böögg']],
    m: [['Lễ dân sự', 'Hôn nhân dân sự là bắt buộc.'], ['Hôn nhân bình đẳng', 'Từ 2022, hai người cùng giới có thể kết hôn.'], ['Thủ tục trước', 'Chuẩn bị hồ sơ tại văn phòng hộ tịch.']],
    d: ['Fondue', 'Raclette', 'Rösti', 'Zürcher Geschnetzeltes', 'Läckerli'],
    w: [['Luật Lao động', 'Tối đa 45 hoặc 50 giờ/tuần theo ngành.'], ['Phép năm', 'Mốc luật: 4 tuần, 5 tuần dưới 20 tuổi.'], ['Lương tối thiểu theo bang', 'Một số bang có lương tối thiểu.'], ['Ba trụ hưu trí', 'AHV, hưu trí nghề nghiệp và tiết kiệm tự nguyện.'], ['GAV', 'Thỏa ước tập thể theo ngành.']]
  });
  A('TR', {
    e: [['Lise và YKS', 'Kỳ thi YKS do ÖSYM tổ chức.'], ['Meslek lisesi', 'Trung học nghề.'], ['Đại học', 'Xét theo điểm YKS.']],
    x: 'YKS (Thổ Nhĩ Kỳ)',
    f: [['ramazan_bayrami', 'Ramazan Bayramı', 'Sau Ramadan', 'lunar', 'hôn tay người lớn tuổi, ăn kẹo'], ['republic_day', 'Ngày Cộng hòa', '29/10', 'fixed', 'xem pháo hoa', 1923], ['hidrellez', 'Hıdırellez', '5–6/5', 'fixed', 'buộc điều ước lên cây']],
    m: [['Lễ dân sự', 'Chỉ hôn nhân dân sự có hiệu lực.'], ['Độ tuổi 18', 'Mốc luật: 18; ngoại lệ từ 17.'], ['Lễ tôn giáo', 'Tùy chọn sau lễ dân sự.']],
    d: ['İskender kebap', 'Lahmacun', 'Mantı', 'Menemen', 'Baklava'],
    w: [['Luật Lao động 4857', 'Văn bản chính.'], ['Giờ làm', 'Mốc luật: 45 giờ/tuần.'], ['Phép năm', 'Mốc luật: 14 ngày (1–5 năm).'], ['SGK', 'Bảo hiểm xã hội.'], ['Lương tối thiểu', 'Điều chỉnh định kỳ.']]
  });
  A('UA', {
    e: [['Trường phổ thông và NMT', 'Bài kiểm tra đa môn quốc gia (NMT) thay ZNO.'], ['Đào tạo nghề', 'Trường nghề và college.'], ['Đại học', 'Xét theo điểm NMT.']],
    x: 'NMT (Ukraine)',
    f: [['independence_day', 'Ngày Độc lập', '24/8', 'fixed', 'mặc vyshyvanka và tham gia hoạt động an toàn', 1991], ['ivana_kupala', 'Ivana Kupala', 'Đêm hè, tháng 6–7', 'variable', 'thả vòng hoa xuống nước'], ['christmas', 'Giáng sinh', '25/12', 'fixed', 'chuẩn bị 12 món và hát koliadky']],
    m: [['Đăng ký hộ tịch', 'Có thể đăng ký trực tuyến hoặc tại cơ quan.'], ['Độ tuổi 18', 'Mốc luật: 18.'], ['Chiến tranh', 'Thiết quân luật ảnh hưởng thủ tục và gia đình.']],
    d: ['Borscht', 'Varenyky', 'Holubtsi', 'Salo', 'Syrnyky'],
    w: [['Bộ luật Lao động', 'Có sửa đổi theo thiết quân luật.'], ['Giờ làm', 'Mốc luật: 40 giờ/tuần, có thể kéo dài trong thiết quân luật.'], ['Phép năm', 'Mốc luật: 24 ngày theo lịch.'], ['Chiến tranh', 'Nhiều người thay đổi nơi làm việc và nơi ở.'], ['Lương tối thiểu', 'Có mức tối thiểu.']]
  });
  A('GB', {
    e: [['A Level, Scottish Highers', 'Anh, Wales, Bắc Ireland dùng GCSE và A Level; Scotland dùng Nationals và Highers.'], ['Apprenticeships và T Levels', 'Học việc và T Level kỹ thuật.'], ['Đại học qua UCAS', 'Học phí và khoản vay khác nhau giữa bốn vùng.']],
    x: 'A Level (Anh) / Highers (Scotland)',
    f: [['bonfire_night', 'Bonfire Night', '5/11', 'fixed', 'xem pháo hoa có tổ chức'], ['christmas', 'Giáng sinh', '25/12', 'fixed', 'ăn bữa tối Giáng sinh'], ['notting_hill', 'Notting Hill Carnival', 'Cuối tuần lễ ngân hàng tháng 8', 'variable', 'xem diễu hành văn hóa Caribe']],
    m: [['Thông báo dự định kết hôn', 'Thông báo trước tại văn phòng đăng ký.'], ['Độ tuổi 18', 'Mốc luật: 18 ở Anh và Wales từ 2023.'], ['Hôn nhân bình đẳng', 'Hai người cùng giới có thể kết hôn.']],
    d: ['Fish and chips', 'Sunday roast', 'Full English breakfast', 'Shepherd’s pie', 'Scones'],
    w: [['Working Time Regulations', 'Trung bình tối đa 48 giờ/tuần, có thể tự nguyện không áp dụng.'], ['Phép năm', 'Mốc luật: 5,6 tuần (28 ngày).'], ['National Living Wage', 'Lương tối thiểu theo độ tuổi.'], ['Hưu trí tự động', 'Tự động tham gia hưu trí nơi làm.'], ['ACAS', 'Cơ quan hòa giải tranh chấp lao động.']]
  });
})(globalThis.G);
