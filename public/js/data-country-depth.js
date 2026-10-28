/* Country records extend CULTURE173. Facts are dated; all costs/outcomes are game balancing. */
(function (G) {
  'use strict';
  var sources = {
    fiEdu: 'https://www.oph.fi/en/education-system',
    fiWork: 'https://www.suomi.fi/citizen/work-unemployment-and-finances/rules-of-working-life',
    fiLeave: 'https://infofinland.fi/work-and-enterprise/during-employment/holidays-and-leaves',
    fiWedding: 'https://infofinland.fi/en/family/marriage-in-finland/getting-married-in-finland-a-check-list',
    fiFestival: 'https://www.visitfinland.com/en/articles/traditional-finnish-celebrations-and-parties/',
    fiForest: 'https://www.luontoon.fi/en/articles/everymans-rights',
    fiFood: 'https://www.visitfinland.com/en/articles/finlands-traditional-and-iconic-foods/',
    ghEdu: 'https://ges.gov.gh/wp-content/uploads/2022/10/2021-School-Selection-Sensitization-Brochure.pdf',
    ghExam: 'https://waecgh.org/wp-content/uploads/2024/12/Release-of-Provisional-Results.pdf',
    ghWork: 'https://ir.parliament.gh/bitstream/handle/123456789/1874/ACT%20651.pdf?isAllowed=y&sequence=3',
    ghWedding: 'https://abwma.gov.gh/marriage-registration/',
    ghFestival: 'https://ghanaculture.gov.gh/festivals/',
    ghFood: 'https://ghanaculture.gov.gh/regional-representation-and-diversity/',
    ieEdu: 'https://www.gov.ie/en/department-of-education/policies/education/',
    ieTraining: 'https://api.uat.citizensinformation.ie/en/education/further-education-and-training/leaving-school/',
    ieWork: 'https://www.workplacerelations.ie/en/publications_forms/employment-law-explained.pdf',
    iePayslip: 'https://www.workplacerelations.ie/en/what_you_should_know/hours-and-wages/payslips/payslips.html',
    ieWedding: 'https://www.gov.ie/en/department-of-social-protection/services/get-married-in-ireland/',
    ieFestival: 'https://source.museum.ie/en-IE/Collections-Research/Folklife-Collections/Folklife-Collections-List-%281%29/Religion-and-Calendar-Customs/Seasonal-festivals/Winter',
    iePatrick: 'https://www.ireland.ie/en/st-patricks-day-2026/everything-you-need-to-know-about-st-patricks-day/',
    ieFood: 'https://www.ireland.com/en/magazine/food-and-drink/traditional-irish-food/',
    nzEdu: 'https://www2.nzqa.govt.nz/assets/NCEA/Subject-pages/2-Universal-documents/Entering-NCEA-and-NZ-Scholarship-a-guide-for-students-caregivers-and-whanau.pdf',
    nzTraining: 'https://www2.nzqa.govt.nz/pasifika/navigating-pathways/apprenticeships/',
    nzWork: 'https://www.employment.govt.nz/starting-employment/rights-and-responsibilities/employee-rights-and-responsibilities',
    nzWedding: 'https://www.govt.nz/browse/family-and-whanau/getting-married/how-to-get-married-in-nz/registry-ceremonies/',
    nzFestival: 'https://www.govt.nz/browse/work-and-tax/public-holidays-and-work/dates-for-public-holidays-and-anniversary-days/',
    nzMatariki: 'https://www.mch.govt.nz/engagement-maori/matariki',
    nzFood: 'https://www.newzealand.com/us/feature/traditional-maori-foods/',
    nzKiwiana: 'https://www.newzealand.com/int/feature/kiwiana/',
    nzSafety: 'https://www.govt.nz/browse/housing-and-property/home-safety/home-emergency-checklist/',
    nzCoast: 'https://www.doc.govt.nz/nature/habitats/marine/marine-reserves-a-z/'
  };
  var profiles = {
    FI: {
      education: [
        { id: 'lukio', name: 'Lukio và kỳ thi Matriculation', note: 'Nhánh phổ thông hướng tới kỳ thi cuối cấp; dành lịch ôn tập và nghỉ ngơi.', route: 'academic', source: 'fiEdu' },
        { id: 'vet', name: 'Đào tạo nghề Phần Lan', note: 'Học nghề có thực hành và học tại nơi làm việc; không phải Abitur của Đức.', route: 'vocational', source: 'fiEdu' },
        { id: 'uas', name: 'Đại học và đại học khoa học ứng dụng', note: 'Hai loại cơ sở giáo dục đại học; chuẩn bị hồ sơ theo hướng học thuật hoặc ứng dụng.', route: 'applied', source: 'fiEdu' }
      ],
      exam: 'Ylioppilastutkinto (kỳ thi Matriculation Phần Lan)',
      festivals: [
        { id: 'vappu_fi', name: 'Vappu', date: '30/4–1/5', calendar: 'fixed', activity: 'dã ngoại cùng bạn học, xem không khí ngày hội sinh viên và người lao động', source: 'fiFestival' },
        { id: 'juhannus_fi', name: 'Juhannus', date: 'Cuối tuần Hạ chí tháng 6, thay đổi theo năm', calendar: 'variable', activity: 'chọn chuyến nghỉ hè gần hồ hoặc một buổi gặp mặt ở thành phố, tuân thủ cảnh báo lửa', source: 'fiFestival' },
        { id: 'independence_fi', name: 'Itsenäisyyspäivä (Ngày Độc lập)', date: '6/12', calendar: 'fixed', since: 1917, activity: 'tưởng nhớ lịch sử độc lập trong một buổi sinh hoạt cộng đồng', source: 'fiFestival' }
      ],
      marriage: [
        { id: 'impediments', name: 'Kiểm tra điều kiện trước lễ', note: 'Có bước xác minh không có trở ngại kết hôn; không coi đặt tiệc là đã đăng ký.', source: 'fiWedding' },
        { id: 'civil', name: 'Lễ dân sự hoặc lễ tôn giáo đủ thẩm quyền', note: 'Hai người trao đổi cách cử hành; không tự gán tôn giáo cho cả gia đình.', source: 'fiWedding' },
        { id: 'witnesses', name: 'Sắp xếp người chứng kiến', note: 'Lễ cử hành cần người chứng kiến; chọn người thực sự có thể tham dự.', source: 'fiWedding' }
      ],
      cuisine: { dishes: ['Ruisleipä (bánh mì lúa mạch đen)', 'Karjalanpiirakka (bánh Karelia)', 'Lohikeitto (súp cá hồi)', 'Leipäjuusto (phô mai nướng)', 'Kalakukko (bánh mì nhân cá vùng Savo)'], source: 'fiFood' },
      labor: [
        { id: 'collective', name: 'Đối chiếu thỏa ước ngành', note: 'Mức trả công và điều kiện thường được xác lập theo thỏa ước ngành; không bịa một mức sàn quốc gia.', source: 'fiWork' },
        { id: 'hours', name: 'Giờ làm thông thường', note: 'Mốc tham chiếu: tối đa thông thường 8 giờ/ngày và 40 giờ/tuần, có chế độ và thỏa thuận riêng.', source: 'fiWork' },
        { id: 'leave', name: 'Tích lũy phép năm', note: 'Phép tích lũy theo thời gian làm việc và điều kiện hưởng, không tự nhận đủ ngay ngày vào làm.', source: 'fiLeave' },
        { id: 'contract', name: 'Thống nhất công việc và tiền công', note: 'Đọc nội dung quan hệ lao động cùng thỏa ước áp dụng trước khi nhận lịch mới.', source: 'fiWork' },
        { id: 'safety', name: 'An toàn và sức khỏe nơi làm việc', note: 'Người sử dụng lao động có trách nhiệm bảo đảm an toàn; phản ánh cụ thể thay vì tự kết luận lỗi.', source: 'fiWork' }
      ],
      lifeEvents: [
        { id: 'fi_lukio_route', kind: 'education', min: 15, max: 19, title: 'Lukio hay con đường thực hành?', text: 'Sau buổi hướng nghiệp, người tư vấn muốn bạn so sánh việc ôn Matriculation với đào tạo nghề. Bạn cần tự chọn nhịp học, không nhận bằng chỉ nhờ một cuộc nói chuyện.', goal: 'tìm lộ trình học vừa sức', source: 'fiEdu' },
        { id: 'fi_collective_pay', kind: 'work', min: 18, title: 'Bảng lương và thỏa ước ngành', text: 'Một lịch trực mới làm bạn băn khoăn cách tính tiền công. Đại diện nhân viên đề nghị cùng đối chiếu thỏa ước áp dụng và bảng chấm công; chưa có kết luận ai làm sai.', goal: 'làm rõ lịch làm và cách trả công', source: 'fiWork', options: ['Lưu lịch và hẹn đối chiếu thỏa ước', 'Trao đổi riêng để giữ lịch làm vừa sức', 'Tạm giữ lịch cũ, chưa nhận ca mới'], followup: 'Bộ phận nhân sự và bạn đối chiếu từng ca thay vì đoán lương từ một con số trên mạng.' },
        { id: 'fi_forest_access', kind: 'safety', min: 12, title: 'Chuyến đi rừng và quyền tiếp cận thiên nhiên', text: 'Một người bạn rủ đi hái quả rừng. Quyền tiếp cận thiên nhiên có giới hạn về loài được bảo vệ, khu vực và gây hại; bạn không thử nấm lạ hay tự đốt lửa.', goal: 'đi cùng người có kinh nghiệm và giữ gìn khu rừng', source: 'fiForest', options: ['Chuẩn bị bản đồ và kiểm tra nội quy khu vực', 'Chọn lối mòn gần nhà, chỉ quan sát', 'Hoãn chuyến đi, giữ thời gian nghỉ'], followup: 'Bạn dùng lại bản đồ và nội quy đã lưu trong chuyến đi sau; lịch trình an toàn hơn chứ không bảo đảm mọi rủi ro biến mất.' },
        { id: 'fi_juhannus_plan', kind: 'community', min: 12, title: 'Một mùa Juhannus không cần chạy đua chi phí', text: 'Nhóm bạn đang chia việc cho kỳ nghỉ Juhannus. Không ai buộc phải thuê nhà nghỉ bên hồ: bạn có thể chọn buổi gặp ở thành phố, chia chi phí trước hoặc giữ cuối tuần cho gia đình.', goal: 'giữ buổi gặp phù hợp ngân sách của cả nhóm', source: 'fiFestival', options: ['Cùng lập ngân sách và hẹn lại năm sau', 'Chọn buổi gặp ngắn ở thành phố', 'Xin nghỉ lần này, giữ liên lạc'], followup: 'Nhóm đối chiếu khoản đã chi và điều chỉnh kế hoạch Juhannus, thay vì mặc định ai cũng đủ tiền thuê nhà nghỉ.' },
        { id: 'fi_civil_wedding', kind: 'marriage', min: 18, title: 'Sắp xếp lễ cử hành tại Phần Lan', text: 'Hai bạn muốn một lễ nhỏ nhưng còn cần kiểm tra giấy tờ, cách cử hành và người chứng kiến. Người yêu muốn được cùng quyết định; việc đặt tiệc không tự hoàn tất hôn nhân.', goal: 'thống nhất cách tổ chức với người yêu', source: 'fiWedding', followup: 'Hai bạn kiểm lại sự đồng thuận, người chứng kiến và ngân sách; đăng ký kết hôn vẫn là quyết định riêng của cả hai.' }
      ]
    },
    GH: {
      education: [
        { id: 'bece', name: 'BECE và chọn trường sau Junior High', note: 'Kết quả và yêu cầu liên quan tham gia quá trình chọn, xếp trường SHS/TVET.', route: 'academic', source: 'ghEdu' },
        { id: 'tvet', name: 'Nhánh TVET tại Ghana', note: 'Tìm hướng đào tạo kỹ thuật, nghề và địa điểm học phù hợp; không tự đảm bảo có việc.', route: 'vocational', source: 'ghEdu' },
        { id: 'wassce', name: 'WASSCE tại Ghana', note: 'Chuẩn bị kỳ thi cuối cấp và hồ sơ học tiếp theo yêu cầu của cơ sở dự tuyển.', route: 'applied', source: 'ghExam' }
      ],
      exam: 'WASSCE (Ghana)',
      festivals: [
        { id: 'homowo_gh', name: 'Homowo của cộng đồng Ga', date: 'Mùa lễ theo cộng đồng, thường tháng 8–9', calendar: 'community', activity: 'lắng nghe câu chuyện vượt nạn đói và tìm hiểu bữa lễ kpokpoi khi được cộng đồng mời', source: 'ghFestival' },
        { id: 'aboakyer_gh', name: 'Aboakyer ở Winneba', date: 'Thứ Bảy đầu tiên tháng 5', calendar: 'variable', activity: 'xem các hoạt động công cộng của lễ hội tại Winneba, tôn trọng hướng dẫn địa phương', source: 'ghFestival' },
        { id: 'hogbetsotso_gh', name: 'Hogbetsotso của cộng đồng Anlo-Ewe', date: 'Tháng 11, theo lịch cộng đồng', calendar: 'community', activity: 'tìm hiểu ký ức di cư và các hoạt động công cộng của cộng đồng Anlo-Ewe', source: 'ghFestival' }
      ],
      marriage: [
        { id: 'ordinance', name: 'Hôn nhân theo Ordinance', note: 'Một hình thức pháp lý riêng; không coi mọi đám cưới Ghana là lễ Kitô giáo.', source: 'ghWedding' },
        { id: 'customary', name: 'Hôn nhân theo tập quán', note: 'Cách tổ chức phụ thuộc cộng đồng; không áp đặt một nghi thức hay mức quà cưới cho cả nước.', source: 'ghWedding' },
        { id: 'mohammedan', name: 'Hôn nhân theo Mohammedan law', note: 'Là một loại đăng ký được địa phương liệt kê; chỉ tìm hiểu khi phù hợp lựa chọn của đôi bên.', source: 'ghWedding' }
      ],
      cuisine: { dishes: ['Kenkey (bột ngô lên men)', 'Banku (bột ngô và sắn)', 'Tuo zaafi (món bột vùng Bắc Ghana)', 'Akple (món bột của cộng đồng Ewe)', 'Eto (khoai nghiền với dầu cọ)'], source: 'ghFood' },
      labor: [
        { id: 'written', name: 'Nội dung hợp đồng theo Act 651', note: 'Có yêu cầu văn bản và thông tin việc làm trong các trường hợp luật quy định; không đồng nhất làm thuê với tự kinh doanh.', source: 'ghWork' },
        { id: 'hours', name: 'Khung giờ làm thông thường', note: 'Act 651 nêu mốc thông thường 8 giờ/ngày hoặc 40 giờ/tuần cùng các ngoại lệ.', source: 'ghWork' },
        { id: 'leave', name: 'Phép năm có lương', note: 'Act 651 quy định ít nhất 15 ngày làm việc phép năm theo điều kiện của luật.', source: 'ghWork' },
        { id: 'rest', name: 'Nghỉ hằng tuần', note: 'Act 651 có quy định khoảng nghỉ liên tục hằng tuần; kiểm tra lịch trước khi nhận thêm ca.', source: 'ghWork' },
        { id: 'maternity', name: 'Nghỉ thai sản', note: 'Mốc tham chiếu Act 651 là ít nhất 12 tuần, cùng các trường hợp được kéo dài.', source: 'ghWork' }
      ],
      lifeEvents: [
        { id: 'gh_bece_choices', kind: 'education', min: 14, max: 19, title: 'Chọn SHS hay TVET sau BECE', text: 'Bạn và người tư vấn xem lựa chọn trường, hướng nghề và chi phí đi lại. Một lựa chọn nổi tiếng nhưng ở xa chưa chắc phù hợp gia đình; kết quả xếp trường không được hứa trước.', goal: 'cân nhắc ngành học, chỗ ở và đường đến trường', source: 'ghEdu' },
        { id: 'gh_tvet_practice', kind: 'training', min: 18, title: 'Buổi thực hành TVET đầu tiên', text: 'Người hướng dẫn muốn bạn luyện thao tác cơ bản trước khi nhận việc khó. Bạn cần hỏi rõ nội dung học, thời gian và khoản chi, thay vì trả tiền chỉ vì lời hứa có việc.', goal: 'học kỹ năng có thể chứng minh bằng thực hành', source: 'ghEdu', options: ['Thống nhất bài thực hành và lịch đánh giá', 'Học buổi nhập môn trước khi cam kết', 'Chưa tham gia, giữ tiền và tìm hiểu thêm'], followup: 'Người hướng dẫn cho bạn làm lại bài thực hành. Tiến bộ được ghi nhận, nhưng không tự tạo bằng nghề hay hợp đồng lao động.' },
        { id: 'gh_work_rest', kind: 'work', min: 18, title: 'Lịch làm và ngày nghỉ theo Act 651', text: 'Cơ sở hư cấu nơi bạn làm muốn điều chỉnh lịch. Bạn có thể lưu lịch, trao đổi khoảng nghỉ và kiểm tra điều khoản áp dụng; chưa có kết luận vi phạm chỉ từ một lời đồn.', goal: 'giữ hồ sơ lịch làm và khoảng nghỉ', source: 'ghWork', options: ['Ghi lịch và đề nghị đối chiếu hợp đồng', 'Đề xuất ca phù hợp sức khỏe', 'Chưa nhận lịch mới khi còn chưa rõ'], followup: 'Bạn cùng người phụ trách đối chiếu lịch với nội dung đã thống nhất; uy tín đến từ trao đổi có căn cứ, không phải tố cáo để chiếm việc.' },
        { id: 'gh_homowo_guest', kind: 'community', min: 12, title: 'Được mời tìm hiểu Homowo', text: 'Một người quen trong cộng đồng Ga mời bạn dự phần hoạt động công cộng dịp Homowo. Bạn hỏi trước việc nào khách có thể tham gia, không tự nhận nghi thức của cộng đồng là truyền thống của mọi gia đình Ghana.', goal: 'tham gia với sự đồng ý và tôn trọng cộng đồng', source: 'ghFestival', options: ['Hỏi việc phù hợp rồi cùng chuẩn bị', 'Lắng nghe câu chuyện và dự phần công cộng', 'Cảm ơn lời mời, xin để dịp khác'], followup: 'Người quen nhớ cách bạn hỏi và lắng nghe; năm sau hai bên dễ trao đổi kế hoạch hơn mà không áp đặt niềm tin.' },
        { id: 'gh_wedding_form', kind: 'marriage', min: 18, title: 'Chọn hình thức cưới phù hợp ở Ghana', text: 'Hai gia đình có mong muốn khác nhau. Bạn và người yêu cần cùng tìm hiểu hình thức pháp lý, tập quán của chính cộng đồng và ngân sách; không tự mặc định sính lễ hay tôn giáo.', goal: 'để đôi bên có tiếng nói trong chuyện cưới', source: 'ghWedding', followup: 'Hai bạn quay lại lựa chọn pháp lý và phần lễ tự nguyện. Chỉ những điều cả hai thống nhất mới được đưa vào kế hoạch.' }
      ]
    },
    IE: {
      education: [
        { id: 'junior', name: 'Junior Cycle', note: 'Ba năm đầu sau tiểu học, có đánh giá trong lớp và kỳ thi theo hệ thống Ireland.', route: 'academic', source: 'ieEdu' },
        { id: 'leaving', name: 'Senior Cycle và Leaving Certificate', note: 'Có thể có Transition Year tự chọn trước phần cuối của bậc trung học.', route: 'applied', source: 'ieEdu' },
        { id: 'plc', name: 'PLC và apprenticeship', note: 'Có lối học tiếp thiên về thực hành hoặc học nghề; kiểm tra yêu cầu của chương trình.', route: 'vocational', source: 'ieTraining' }
      ],
      exam: 'Leaving Certificate (Ireland)',
      festivals: [
        { id: 'patrick_ie', name: 'Lá Fhéile Pádraig (Ngày Thánh Patrick)', date: '17/3', calendar: 'fixed', activity: 'xem diễu hành hoặc tham gia sinh hoạt địa phương, không bắt buộc uống đồ có cồn', source: 'iePatrick' },
        { id: 'samhain_ie', name: 'Halloween và ký ức Samhain', date: '31/10', calendar: 'fixed', activity: 'nghe chuyện dân gian và chuẩn bị một buổi hóa trang phù hợp tuổi', source: 'ieFestival' },
        { id: 'christmas', name: 'Nollaig (Giáng sinh tại Ireland)', date: '25/12', calendar: 'fixed', activity: 'chọn cách sum họp hoặc giúp đỡ hàng xóm phù hợp tín ngưỡng của gia đình', source: 'ieFestival' }
      ],
      marriage: [
        { id: 'notice', name: 'Thông báo trước lễ', note: 'Quy trình thông thường yêu cầu thông báo trực tiếp ít nhất ba tháng trước lễ.', source: 'ieWedding' },
        { id: 'ceremony', name: 'Lễ dân sự, tôn giáo hoặc thế tục', note: 'Trao đổi lựa chọn cùng người yêu và người cử hành được công nhận.', source: 'ieWedding' },
        { id: 'witnesses', name: 'Hai người chứng kiến', note: 'Cần hai người chứng kiến đủ 18 tuổi; sự hiện diện của gia đình không thay thủ tục.', source: 'ieWedding' }
      ],
      cuisine: { dishes: ['Soda bread (bánh mì dùng muối nở)', 'Waterford Blaa (bánh mì mềm Waterford)', 'Seafood chowder (súp hải sản)', 'Smoked salmon (cá hồi hun khói)', 'Irish lamb (món thịt cừu Ireland)'], source: 'ieFood' },
      labor: [
        { id: 'terms', name: 'Điều khoản việc làm bằng văn bản', note: 'Có nghĩa vụ cung cấp thông tin việc làm theo quy định; nên kiểm tra trước khi nhận ca.', source: 'ieWork' },
        { id: 'working_time', name: 'Thời giờ làm và nghỉ', note: 'Luật thời giờ làm việc điều chỉnh giới hạn bình quân và các khoảng nghỉ; không coi làm thêm là không giới hạn.', source: 'ieWork' },
        { id: 'annual_leave', name: 'Quyền phép năm', note: 'Quyền nghỉ phép có trả lương phụ thuộc thời gian làm việc và quy định áp dụng.', source: 'ieWork' },
        { id: 'payslip', name: 'Bảng kê tiền lương', note: 'Người lao động được nhận bảng kê lương khi trả lương; đối chiếu khoản khấu trừ trước khi kết luận.', source: 'iePayslip' },
        { id: 'sector', name: 'Thỏa thuận theo ngành', note: 'Một số ngành có thỏa thuận hoặc lệnh ngành bổ sung điều kiện; không dùng một mức cho mọi nghề.', source: 'ieWork' }
      ],
      lifeEvents: [
        { id: 'ie_leaving_plan', kind: 'education', min: 15, max: 19, title: 'Lịch học quanh Leaving Certificate', text: 'Người tư vấn hỏi bạn muốn ưu tiên học thuật, thực hành hay một năm chuyển tiếp phù hợp. Bạn còn cần thời gian ngủ và sinh hoạt; điểm một buổi đánh giá không quyết định cả cuộc đời.', goal: 'giữ lịch học phù hợp với mục tiêu sau phổ thông', source: 'ieEdu' },
        { id: 'ie_plc_path', kind: 'training', min: 18, title: 'Một lối đi qua PLC', text: 'Bạn đang cân nhắc khóa Post Leaving Certificate để tìm hiểu một lĩnh vực thực hành. Người phụ trách giải thích nội dung và yêu cầu, không hứa việc làm hay quyền vào đại học tự động.', goal: 'thử hướng học thực hành trước cam kết dài hạn', source: 'ieTraining', options: ['Lập kế hoạch học và đối chiếu yêu cầu', 'Dự buổi giới thiệu trước khi đăng ký', 'Tạm hoãn để giữ ngân sách'], followup: 'Bạn xem lại sản phẩm học tập và yêu cầu đầu vào tiếp theo; kinh nghiệm giúp chọn hướng, không tự đổi bằng cấp.' },
        { id: 'ie_payslip_check', kind: 'work', min: 18, title: 'Đọc payslip trước khi nhận thêm ca', text: 'Bảng kê lương kỳ này có khoản bạn chưa hiểu. Bạn có thể giữ bản kê, đối chiếu số giờ và hỏi bộ phận phụ trách thay vì mặc định mọi khoản khấu trừ đều sai.', goal: 'hiểu khoản thu nhập và lịch làm thực tế', source: 'iePayslip', options: ['Lưu bảng kê, hẹn giải thích từng khoản', 'Trao đổi riêng về ca làm vừa sức', 'Chưa nhận thêm ca khi khoản cũ chưa rõ'], followup: 'Bạn mang bảng kê và lịch ca đã lưu tới buổi trao đổi. Thông tin rõ hơn giúp thương lượng thực tế, không tự sinh tiền truy lĩnh.' },
        { id: 'ie_wedding_notice', kind: 'marriage', min: 18, title: 'Đừng đặt lễ trước khi tính lịch thông báo', text: 'Hai bạn thích một ngày cưới ở Ireland nhưng còn cần tính bước thông báo trước, cách cử hành và hai người chứng kiến. Việc giữ chỗ chỉ là chuẩn bị, chưa tự đăng ký kết hôn.', goal: 'cùng người yêu lập lịch cưới thực tế', source: 'ieWedding', followup: 'Hai bạn kiểm lại lịch hẹn và sự sẵn sàng trước khi quyết định cưới; không vì đã đặt cọc mà bỏ qua mong muốn của nhau.' },
        { id: 'ie_samhain_story', kind: 'community', min: 12, title: 'Một tối kể chuyện Halloween', text: 'Người quen rủ bạn giúp một buổi kể chuyện về Halloween và ký ức Samhain. Gia đình có trẻ nhỏ muốn hoạt động vừa vui vừa không quá đáng sợ, và cần tránh chi tiêu chạy theo đám đông.', goal: 'tổ chức buổi gặp phù hợp tuổi và ngân sách', source: 'ieFestival', options: ['Cùng soạn chuyện và hẹn nhóm đọc năm sau', 'Ghé một buổi hóa trang giản dị', 'Không dự, giữ thời gian riêng'], followup: 'Nhóm đọc điều chỉnh câu chuyện theo phản hồi năm trước; người quen ghi nhận cách bạn tôn trọng trẻ nhỏ và khác biệt niềm tin.' }
      ]
    },
    NZ: {
      education: [
        { id: 'ncea', name: 'NCEA với các mức 1, 2, 3', note: 'Chuẩn bị đánh giá theo chuẩn và tích lũy tín chỉ; không phải một kỳ Gaokao duy nhất.', route: 'academic', source: 'nzEdu' },
        { id: 'ue', name: 'University Entrance', note: 'Điều kiện vào đại học được xét riêng; đạt NCEA Level 3 không tự đủ mọi yêu cầu.', route: 'applied', source: 'nzEdu' },
        { id: 'apprentice', name: 'New Zealand Apprenticeship', note: 'Có hướng đào tạo tại nơi làm việc, đi tới chứng chỉ theo chương trình; cần đáp ứng yêu cầu tuyển.', route: 'vocational', source: 'nzTraining' }
      ],
      exam: 'NCEA và điều kiện University Entrance (New Zealand)',
      festivals: [
        { id: 'waitangi_nz', name: 'Waitangi Day', date: '6/2; ngày nghỉ bù có quy tắc riêng', calendar: 'fixed', since: 1976, activity: 'tìm hiểu Hiệp ước Waitangi qua các hoạt động công cộng và lắng nghe các góc nhìn', source: 'nzFestival' },
        { id: 'anzac_nz', name: 'Anzac Day tại New Zealand', date: '25/4; ngày nghỉ bù có quy tắc riêng', calendar: 'fixed', since: 1966, activity: 'tham dự hoạt động tưởng niệm tự nguyện, không biến ngày tưởng niệm thành tiệc bắt buộc', source: 'nzFestival' },
        { id: 'matariki_nz', name: 'Matariki (năm mới Māori)', date: 'Thay đổi theo năm; ngày lễ công cộng từ 2022', calendar: 'variable', since: 2022, activity: 'tưởng nhớ người đã khuất, chia sẻ bữa ăn và nghĩ về năm tới; một số cộng đồng dùng dấu mốc Puanga', source: 'nzMatariki' }
      ],
      marriage: [
        { id: 'licence', name: 'Chuẩn bị marriage licence', note: 'Quy trình thông thường cần giấy phép trước lễ ít nhất ba ngày làm việc.', source: 'nzWedding' },
        { id: 'celebrant', name: 'Chọn người cử hành và địa điểm', note: 'Lễ registry theo quy định, hoặc tìm hiểu lựa chọn personalised; không mặc định một nghi thức Māori cho mọi cặp.', source: 'nzWedding' },
        { id: 'witnesses', name: 'Hai người chứng kiến hiểu buổi lễ', note: 'Đôi bên, người cử hành và người chứng kiến cần cùng hiện diện theo quy định.', source: 'nzWedding' }
      ],
      cuisine: { dishes: ['Hāngī (bữa ăn nấu trong hố đất)', 'Kūmara (khoai lang trong ẩm thực Māori)', 'Greenshell mussels (vẹm xanh)', 'Whitebait fritters (bánh cá nhỏ)', 'Pavlova (bánh meringue phổ biến cả ở Úc)'], source: 'nzFood', extraSources: ['nzKiwiana'] },
      labor: [
        { id: 'agreement', name: 'Thỏa thuận lao động bằng văn bản', note: 'Người lao động cần có thỏa thuận bằng văn bản; điều khoản không được thấp hơn quyền tối thiểu.', source: 'nzWork' },
        { id: 'leave', name: 'Phép năm', note: 'Mốc tham chiếu: bốn tuần sau 12 tháng liên tục, có trường hợp chi trả theo chế độ riêng.', source: 'nzWork' },
        { id: 'sick', name: 'Nghỉ ốm', note: 'Mốc tham chiếu: mười ngày sau khi đủ điều kiện thời gian làm việc; không phải ai cũng hưởng ngay khi vào làm.', source: 'nzWork' },
        { id: 'breaks', name: 'Khoảng nghỉ và nghỉ ăn', note: 'Có quyền nghỉ theo điều kiện ca; nghỉ ngắn và nghỉ ăn có cách trả công khác nhau.', source: 'nzWork' },
        { id: 'records', name: 'Quyền tối thiểu và hồ sơ việc làm', note: 'Không thể đánh đổi các quyền tối thiểu chỉ vì đã ký đồng ý; giữ thỏa thuận và hồ sơ giờ làm để đối chiếu.', source: 'nzWork' }
      ],
      lifeEvents: [
        { id: 'nz_ncea_credits', kind: 'education', min: 15, max: 19, title: 'Không nhầm NCEA với University Entrance', text: 'Người tư vấn giúp bạn đối chiếu tín chỉ và môn cần cho hướng học tiếp. Bạn có thể chọn hướng học thuật hoặc tìm đào tạo tại nơi làm việc; một tờ kết quả không tự đảm bảo mọi chương trình nhận hồ sơ.', goal: 'chọn chuẩn học phù hợp hướng học tiếp', source: 'nzEdu' },
        { id: 'nz_coast_care', kind: 'community', min: 12, title: 'Một buổi chăm sóc vùng biển được bảo vệ', text: 'Nhóm cộng đồng rủ bạn nhặt rác gần một khu bảo tồn biển. Họ nhắc tìm hiểu nội quy từng khu, không tự thu nhặt sinh vật hay làm phiền động vật để chụp ảnh.', goal: 'giúp vùng biển mà không gây hại hệ sinh thái', source: 'nzCoast', options: ['Học nội quy rồi nhận phần việc phù hợp', 'Tham gia buổi ngắn, không can thiệp sinh vật', 'Không dự lần này, giữ lịch riêng'], followup: 'Nhóm phân công dựa trên kinh nghiệm bạn đã có; việc đóng góp đều đặn tạo quan hệ, không trao quyền tự ý khai thác khu bảo tồn.' },
        { id: 'nz_household_kit', kind: 'safety', min: 18, title: 'Đồ dự phòng và kế hoạch liên lạc', text: 'Gia đình muốn rà lại kế hoạch ứng phó mất điện hoặc thiên tai. Bạn kiểm vật dụng, người cần hỗ trợ và cách liên lạc; chuẩn bị không có nghĩa năm nay chắc chắn xảy ra động đất.', goal: 'giữ một kế hoạch liên lạc và vật dụng còn dùng được', source: 'nzSafety', options: ['Lập kế hoạch, mua vật dụng còn thiếu', 'Rà lại vật dụng sẵn có, chưa mua thêm', 'Hẹn lại khi đã cân đối ngân sách'], followup: 'Bạn kiểm lại hạn dùng và người liên hệ trong kế hoạch; sự chuẩn bị cần duy trì, không phải một lựa chọn miễn nhiễm thiên tai suốt đời.' },
        { id: 'nz_season_agreement', kind: 'work', min: 18, title: 'Đọc thỏa thuận trước mùa làm mới', text: 'Một cơ sở hư cấu đưa bạn lịch ca thay đổi theo mùa. Bạn muốn hiểu khoản nghỉ, cách ghi giờ và điều kiện việc làm trước khi nhận, thay vì đổi quyền nghỉ lấy một lời hứa trả thêm.', goal: 'làm rõ điều khoản và nhịp nghỉ của công việc', source: 'nzWork', options: ['Giữ bản thỏa thuận và hẹn trao đổi điều khoản', 'Đề xuất lịch vừa sức, chưa nhận mọi ca', 'Chưa nhận lịch mới khi còn chưa rõ'], followup: 'Bạn đối chiếu giờ thực làm với thỏa thuận đã giữ. Kết quả trao đổi phụ thuộc hoàn cảnh; game không tự trả tiền bồi thường.' },
        { id: 'nz_registry_plan', kind: 'marriage', min: 18, title: 'Giấy phép, người cử hành và hai nhân chứng', text: 'Hai bạn cân nhắc lễ registry gọn nhẹ hoặc lễ được chuẩn bị riêng. Cần tính giấy phép, sự hiện diện và lịch của người cử hành; không có lựa chọn nào tự đăng ký hộ hai người.', goal: 'cùng người yêu chuẩn bị một lễ có sự đồng thuận', source: 'nzWedding', followup: 'Hai bạn kiểm lại người chứng kiến và lịch trước khi quyết định kết hôn; khoản đã chuẩn bị không thay thế sự đồng thuận hiện tại.' }
      ]
    }
  };
  Object.assign(sources, {
    jpEdu: 'https://www.mext.go.jp/en/policy/education/overview/',
    jpExam: 'https://www.dnc.ac.jp/kyotsu/shiken_gaiyou/gyoumu_keihi.html',
    jpWork: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudouseisaku/chushoukigyou/joken_kankyou_rule.html',
    jpTerms: 'https://jsite.mhlw.go.jp/aichi-roudoukyoku/youkoso/faq.html',
    jpWedding: 'https://www.moj.go.jp/ONLINE/FAMILYREGISTER/5-2',
    jpFestival: 'https://www.japan.travel/en/japans-local-treasures/kodaira-furusato-mura-2020/',
    jpNewYear: 'https://www.japan.travel/en/sg/story/enjoy-new-year-japan-tips-toshikoshi-and-shogatsu/',
    jpObon: 'https://www.japan.travel/en/de/story/obon-japan/',
    jpFood: 'https://www.japan.travel/it/local-specialities/local-foods/',
    frEdu: 'https://www.education.gouv.fr/reussir-au-lycee/le-lycee-41642',
    frTraining: 'https://www.education.gouv.fr/se-former-par-l-apprentissage-2216',
    frHours: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F1911?lang=en&successfulShare=true',
    frLeave: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F2258?trk=public_post_main-feed-card-text',
    frRest: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F2327',
    frPayslip: 'https://entreprendre.service-public.gouv.fr/vosdroits/F559?lang=en',
    frTerms: 'https://entreprendre.service-public.gouv.fr/vosdroits/F23107?lang=en',
    frWedding: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F930?edit=1&lang=fr',
    frMusic: 'https://fetedelamusique.culture.gouv.fr/actualites/presentation-de-la-fete-de-la-musique2',
    frNational: 'https://www.france.fr/fr/article/france-fete-nationale/',
    frHoliday: 'https://www.service-public.gouv.fr/entreprendre/vosdroits/F2405',
    frFood: 'https://www.france.fr/fr/liste-theme/gastronomie-vin/',
    usEdu: 'https://www.ed.gov/about/ed-overview/federal-role-in-education',
    usTraining: 'https://www.ed.gov/adult-programs/adult-education-laws-and-policy/guidelines-vocational-education-programs',
    usWork: 'https://www.dol.gov/agencies/whd/flsa/',
    usRecords: 'https://www.dol.gov/general/topic/wages/wagesrecordkeeping',
    usWedding: 'https://www.usa.gov/marriage-certificate',
    usNames: 'https://www.usa.gov/name-change',
    usFestival: 'https://www.opm.gov/frequently-asked-questions/pay-and-leave-faq/pay-administration/what-are-federal-holidays/?os=v',
    usFood: 'https://www.explorelouisiana.com/articles/louisianas-famous-dishes',
    vnEdu: 'https://vpcp.chinhphu.vn/phe-duyet-khung-co-cau-he-thong-giao-duc-quoc-dan-11516512.htm',
    vnWork: 'https://chinhphu.vn/?docid=198540&pageid=27160',
    vnWedding: 'https://vbpl.moj.gov.vn/Toaannhandantoicao/Pages/vbpq-toanvan.aspx?ItemID=97615&dvid=331',
    vnCivil: 'https://datafiles.chinhphu.vn/cpp/files/vbpq/2014/12/60.signed.pdf',
    vnFestival: 'https://vietnam.travel/node/616',
    vnFood: 'https://vietnam.travel/things-to-do/21-must-try-vietnamese-dishes/'
  });
  profiles.JP = {
    education: [
      { id: 'common', name: 'Common Test và yêu cầu riêng của trường', note: 'Điểm kỳ thi chung là một phần của đường tuyển sinh; cần kiểm tra yêu cầu trường dự tuyển.', route: 'academic', source: 'jpExam' },
      { id: 'kosen', name: 'Kōsen (college of technology)', note: 'Có chương trình kỹ thuật liên tục sau bậc trung học cơ sở, khác lộ trình đại học thông thường.', route: 'vocational', source: 'jpEdu' },
      { id: 'higher', name: 'Đại học, junior college và trường chuyên môn', note: 'Các loại cơ sở có mục tiêu đào tạo khác nhau; chọn theo năng lực và định hướng, không chỉ danh tiếng.', route: 'applied', source: 'jpEdu' }
    ],
    festivals: [
      { id: 'shogatsu', name: 'Shōgatsu', date: 'Năm mới, đầu tháng 1', calendar: 'fixed', activity: 'sum họp đầu năm và chọn cách thăm đền chùa phù hợp gia đình', source: 'jpNewYear' },
      { id: 'obon', name: 'Obon', date: 'Tháng 7 hoặc 8 tùy địa phương', calendar: 'community', activity: 'tưởng nhớ tổ tiên hoặc xem Bon Odori khi phù hợp lựa chọn gia đình', source: 'jpObon' },
      { id: 'setsubun_jp', name: 'Setsubun', date: 'Đầu tháng 2, ngày thay đổi theo năm', calendar: 'variable', activity: 'xem hoặc tham gia hoạt động ném đậu mamemaki phù hợp độ tuổi và nội quy nơi tổ chức', source: 'jpFestival' }
    ],
    marriage: [
      { id: 'notification', name: 'Kon-in todoke', note: 'Tìm hiểu tờ thông báo kết hôn; tiệc cưới tự nó không thay việc đăng ký.', source: 'jpWedding' },
      { id: 'witnesses', name: 'Chữ ký hai người chứng kiến trưởng thành', note: 'Tờ thông báo có phần chữ ký hai người chứng kiến; đôi bên cần chuẩn bị đúng giấy tờ.', source: 'jpWedding' },
      { id: 'identity', name: 'Đối chiếu nội dung và hồ sơ nhân thân', note: 'Hai người kiểm tra thông tin cần ghi và giấy tờ phù hợp trường hợp của mình, không tự điền hộ khi chưa đồng ý.', source: 'jpWedding' }
    ],
    cuisine: { dishes: ['Sushi', 'Tempura (món tẩm bột chiên)', 'Yakitori (thịt gà xiên nướng)', 'Tonkatsu (thịt heo tẩm bột)', 'Shabu-shabu (lẩu nhúng)'], source: 'jpFood' },
    labor: [
      { id: 'hours', name: 'Khung giờ làm thông thường', note: 'Mốc thông thường 8 giờ/ngày, 40 giờ/tuần; có chế độ ngoại lệ.', source: 'jpWork' },
      { id: 'agreement36', name: 'Thỏa thuận làm thêm theo Điều 36', note: 'Làm thêm cần đáp ứng yêu cầu thỏa thuận và giới hạn áp dụng; không chỉ dựa vào lời quản lý.', source: 'jpWork' },
      { id: 'premium', name: 'Trả công làm thêm', note: 'Làm thêm, ban đêm và ngày nghỉ theo luật có mức phụ trội khác nhau; cần phân loại đúng ca.', source: 'jpWork' },
      { id: 'leave', name: 'Phép năm có điều kiện', note: 'Quyền phép có điều kiện về thời gian làm và chuyên cần; không tự coi phép là vắng việc không lương.', source: 'jpTerms' },
      { id: 'terms', name: 'Thông tin điều kiện lao động', note: 'Tiền công, thời giờ và thời hạn việc làm cần được thông tin theo quy định.', source: 'jpTerms' }
    ],
    lifeEvents: [
      { id: 'jp_common_plan', kind: 'education', min: 15, max: 19, title: 'Common Test chưa phải toàn bộ hồ sơ', text: 'Người tư vấn nhắc bạn đối chiếu kỳ thi chung với yêu cầu riêng từng trường. Có thể dành thời gian cho hướng kỹ thuật hoặc ứng dụng thay vì chỉ tăng giờ luyện đề.', goal: 'chọn lộ trình và giữ lịch ôn có thể duy trì', source: 'jpExam' },
      { id: 'jp_technical_visit', kind: 'training', min: 18, title: 'Buổi tìm hiểu chương trình kỹ thuật Nhật Bản', text: 'Một người hướng dẫn hư cấu đề nghị bạn xem nội dung thực hành và điều kiện chương trình trước khi chọn học tiếp. Buổi trải nghiệm không tự cấp chứng chỉ hay hứa có việc.', goal: 'đối chiếu khả năng với cách học kỹ thuật', source: 'jpEdu', options: ['Chuẩn bị một bài thực hành và hẹn nhận góp ý', 'Dự buổi giới thiệu rồi cân nhắc', 'Giữ ngân sách, chưa theo chương trình'], followup: 'Bạn mang sản phẩm thực hành trở lại, đối chiếu phần đã tiến bộ và điều kiện học tiếp còn thiếu.' },
      { id: 'jp_overtime_36', kind: 'work', min: 18, title: 'Bảng giờ làm và thỏa thuận 36', text: 'Lịch làm thêm của đơn vị hư cấu kéo dài qua buổi tối. Bạn muốn biết ca nào thuộc làm thêm, thỏa thuận nào áp dụng và còn đủ thời gian nghỉ hay không.', goal: 'đối chiếu ca làm với thỏa thuận và giới hạn', source: 'jpWork', options: ['Giữ bảng giờ và hẹn kiểm tra thỏa thuận', 'Đề xuất bớt ca tối để giữ sức', 'Chưa nhận ca ngoài lịch đã rõ'], followup: 'Bạn dùng bảng giờ đã lưu để trao đổi từng ca. Có căn cứ giúp thương lượng nhưng không tự đảm bảo truy lĩnh hay thăng chức.' },
      { id: 'jp_setsubun_group', kind: 'community', min: 12, title: 'Giúp một buổi Setsubun của khu phố', text: 'Người quen rủ bạn hỗ trợ phần công cộng của buổi mamemaki. Nhóm muốn người dự tôn trọng hướng dẫn, tuổi của trẻ và lựa chọn tín ngưỡng; không có nghi thức nào bắt buộc với bạn.', goal: 'giúp buổi sinh hoạt vui và phù hợp người tham dự', source: 'jpFestival', options: ['Hỏi cách hỗ trợ, nhận phần việc vừa sức', 'Ghé xem phần công cộng, không tham gia nghi thức', 'Xin nghỉ lần này và cảm ơn lời mời'], followup: 'Người quen nhớ phần việc bạn từng hỗ trợ và hỏi ý trước khi xếp lịch Setsubun năm sau.' },
      { id: 'jp_konin_plan', kind: 'marriage', min: 18, title: 'Cùng đọc kon-in todoke', text: 'Hai bạn bàn chuyện cưới, rồi nhận ra cần kiểm tra tờ đăng ký, nội dung nhân thân và hai chữ ký người chứng kiến. Chụp ảnh hay đặt tiệc không tự hoàn thành thủ tục.', goal: 'thống nhất hồ sơ và mong muốn của hai người', source: 'jpWedding', followup: 'Hai bạn cùng kiểm nội dung đã chuẩn bị, chỉ tiếp tục khi cả hai còn đồng thuận; nghi thức gia đình là phần lựa chọn riêng.' }
    ]
  };
  profiles.FR = {
    education: [
      { id: 'general', name: 'Baccalauréat général', note: 'Nhánh phổ thông chuẩn bị nền tảng để học tiếp; lựa chọn môn và hướng sau lycée cần nhất quán.', route: 'academic', source: 'frEdu' },
      { id: 'technological', name: 'Baccalauréat technologique', note: 'Nhánh công nghệ chuẩn bị những hướng học tiếp phù hợp như STS hoặc IUT.', route: 'applied', source: 'frEdu' },
      { id: 'cap', name: 'CAP, bac professionnel và apprentissage', note: 'Có hướng nghề, học tại trường hoặc theo chương trình kết hợp tại nơi làm việc.', route: 'vocational', source: 'frTraining' }
    ],
    festivals: [
      { id: 'bastille', name: 'Quốc khánh Pháp', date: '14/7', calendar: 'fixed', since: 1880, activity: 'chọn xem hoạt động công cộng hoặc một buổi gặp ở khu phố dịp 14/7', source: 'frNational' },
      { id: 'musique_fr', name: 'Fête de la musique', date: '21/6', calendar: 'fixed', since: 1982, activity: 'nghe những buổi diễn công cộng miễn phí, giữ thời gian nghỉ và nội quy địa phương', source: 'frMusic' },
      { id: 'christmas', name: 'Noël', date: '25/12', calendar: 'fixed', activity: 'sum họp hoặc giúp đỡ người quen theo cách phù hợp gia đình', source: 'frHoliday' }
    ],
    marriage: [
      { id: 'mairie', name: 'Lễ dân sự tại mairie', note: 'Hôn nhân có bước cử hành dân sự theo quy định; lễ tôn giáo không thay bước này.', source: 'frWedding' },
      { id: 'bans', name: 'Publication des bans', note: 'Có bước công bố dự định kết hôn trong quy trình thông thường; không coi đặt tiệc là đủ.', source: 'frWedding' },
      { id: 'witnesses', name: 'Người chứng kiến và hồ sơ địa phương', note: 'Đôi bên cùng người chứng kiến tham dự, kiểm tra hồ sơ và liên hệ với commune phù hợp.', source: 'frWedding' }
    ],
    cuisine: { dishes: ['Galette de sarrasin (bánh kiều mạch Bretagne)', 'Crêpes (bánh mỏng)', 'Kouign-amann (bánh Bretagne)', 'Bouillabaisse (súp cá Marseille)', 'Ratatouille (rau hầm vùng Provence)'], source: 'frFood' },
    labor: [
      { id: 'hours', name: 'Mốc thời giờ 35 giờ', note: 'Thời giờ pháp định thông thường của việc tư nhân toàn thời gian là 35 giờ/tuần; không phải trần tuyệt đối mọi chế độ.', source: 'frHours' },
      { id: 'leave', name: 'Tích lũy congés payés', note: 'Phép năm có lương được tích lũy theo điều kiện; cần thống nhất lịch nghỉ.', source: 'frLeave' },
      { id: 'rest', name: 'Nghỉ hằng tuần', note: 'Có khoảng nghỉ hằng tuần tối thiểu và các chế độ ngoại lệ; kiểm tra loại công việc áp dụng.', source: 'frRest' },
      { id: 'payslip', name: 'Bulletin de paie', note: 'Khi trả lương có bảng kê; giữ bản kê và đối chiếu khấu trừ, giờ làm.', source: 'frPayslip' },
      { id: 'terms', name: 'Điều kiện khi nhận việc', note: 'Loại hợp đồng quyết định yêu cầu văn bản và thông tin phải cung cấp.', source: 'frTerms' }
    ],
    lifeEvents: [
      { id: 'fr_lycee_route', kind: 'education', min: 15, max: 19, title: 'Chọn hướng sau lycée', text: 'Người tư vấn đặt cạnh nhau các hướng général, technologique và nghề. Bạn cần nhìn cả môn học, cách học và khả năng đi tiếp, không xem nhánh nghề là thất bại.', goal: 'chọn hướng lycée phù hợp mục tiêu', source: 'frEdu' },
      { id: 'fr_apprentice_visit', kind: 'training', min: 18, title: 'Một buổi ở trung tâm đào tạo apprentissage', text: 'Bạn tìm hiểu chương trình kết hợp học và làm. Người hướng dẫn muốn bạn hỏi rõ nội dung thực hành, yêu cầu và nơi đào tạo trước khi cam kết.', goal: 'hiểu phần học và phần thực hành của chương trình', source: 'frTraining', options: ['Chuẩn bị bài thực hành và hẹn phản hồi', 'Chỉ dự buổi giới thiệu chương trình', 'Chưa cam kết khi chưa cân đối lịch'], followup: 'Người hướng dẫn đối chiếu bài làm và mục tiêu chứng chỉ; bạn còn phải đáp ứng điều kiện chính thức của chương trình.' },
      { id: 'fr_bulletin_paie', kind: 'work', min: 18, title: 'Những dòng trên bulletin de paie', text: 'Bản kê lương có khoản giờ làm và khấu trừ bạn chưa hiểu. Bạn quyết định cách hỏi để làm rõ, không coi 35 giờ là giới hạn cấm mọi giờ làm thêm.', goal: 'hiểu số giờ và khoản trả trên bảng kê', source: 'frPayslip', options: ['Giữ bảng kê và hẹn giải thích từng dòng', 'Thống nhất lại lịch liên lạc và giờ nghỉ', 'Chưa nhận thêm giờ khi khoản cũ chưa rõ'], followup: 'Bạn dùng bảng kê và lịch đã lưu để trao đổi cụ thể; kết quả công việc vẫn phụ thuộc năng lực, không chỉ một phản ánh.' },
      { id: 'fr_musique_neighbours', kind: 'community', min: 12, title: 'Một góc phố trong Fête de la musique', text: 'Người quen muốn nhóm có một buổi nghe nhạc công cộng ngày 21/6. Có người cần nghỉ sớm; bạn có thể cùng sắp lịch, nghe một phần hoặc giữ buổi tối cho mình.', goal: 'giữ niềm vui âm nhạc và nhịp nghỉ của nhóm', source: 'frMusic', options: ['Cùng xem lịch diễn và hẹn điểm gặp', 'Nghe một tiết mục rồi về sớm', 'Không dự nhưng chúc nhóm vui'], followup: 'Nhóm nhớ khung giờ đã thống nhất, điều chỉnh lần gặp sau để không gạt người cần nghỉ sớm ra ngoài.' },
      { id: 'fr_mairie_plan', kind: 'marriage', min: 18, title: 'Lịch mairie trước bữa tiệc', text: 'Hai bạn muốn làm lễ cưới nhưng cần tính hồ sơ, publication des bans, người chứng kiến và nơi cử hành dân sự. Bữa tiệc lớn không tự tạo hiệu lực pháp lý.', goal: 'chuẩn bị lễ dân sự với sự đồng thuận của đôi bên', source: 'frWedding', followup: 'Hai bạn kiểm lại lịch mairie và mong muốn hiện tại; chỉ bước đăng ký thực tế của hệ thống hôn nhân mới thay trạng thái quan hệ.' }
    ]
  };
  profiles.US = {
    exam: 'Hồ sơ tuyển sinh đại học; SAT/ACT tùy yêu cầu từng trường',
    education: [
      { id: 'local', name: 'Điều kiện tốt nghiệp của bang và học khu', note: 'Không có một kỳ thi tốt nghiệp liên bang áp cho mọi học sinh; xem chương trình địa phương.', route: 'academic', source: 'usEdu' },
      { id: 'college', name: 'Community college', note: 'Có lộ trình associate/certificate; khả năng học chuyển tiếp tùy chương trình và cơ sở.', route: 'applied', source: 'usTraining' },
      { id: 'cte', name: 'Career and Technical Education', note: 'Có chương trình nghề ở trung học và sau trung học; lựa chọn phụ thuộc nơi học.', route: 'vocational', source: 'usTraining' }
    ],
    festivals: [
      { id: 'july4', name: 'Independence Day', date: '4/7', calendar: 'fixed', activity: 'tham gia hoạt động công cộng hoặc dã ngoại an toàn, không tự đốt pháo', source: 'usFestival' },
      { id: 'thanks_us', name: 'Thanksgiving', date: 'Thứ Năm thứ tư tháng 11', calendar: 'variable', since: 1863, activity: 'chọn bữa sum họp hoặc giúp đỡ cộng đồng phù hợp quan điểm của gia đình', source: 'usFestival' },
      { id: 'juneteenth_us', name: 'Juneteenth', date: '19/6; ngày lễ liên bang từ 2021', calendar: 'fixed', since: 2021, activity: 'tìm hiểu lịch sử giải phóng và tham gia hoạt động giáo dục công cộng tự nguyện', source: 'usFestival' }
    ],
    marriage: [
      { id: 'license', name: 'Marriage license trước lễ', note: 'Giấy phép cho phép làm lễ, không phải chứng nhận rằng đã kết hôn.', source: 'usWedding' },
      { id: 'state', name: 'Yêu cầu và thời hạn tùy bang', note: 'Liên hệ nơi cấp phép tại bang dự định cưới; không tự áp một quy định chung cho toàn Hoa Kỳ.', source: 'usWedding' },
      { id: 'certificate', name: 'Marriage certificate và lựa chọn tên', note: 'Chứng nhận ghi việc đã cưới; đổi tên là lựa chọn có quy trình và khác biệt theo bang.', source: 'usNames' }
    ],
    cuisine: { dishes: ['Gumbo (món hầm Louisiana)', 'Jambalaya (cơm Louisiana)', 'Étouffée (món sốt vùng Louisiana)', 'Po’boy (bánh mì kẹp Louisiana)', 'Beignets (bánh chiên phổ biến ở New Orleans)'], source: 'usFood', regionalNote: 'Năm ví dụ thuộc Louisiana, không đại diện mọi bang hay mọi gia đình Hoa Kỳ.' },
    labor: [
      { id: 'federal_state', name: 'Liên bang và bang', note: 'FLSA có chuẩn tối thiểu; nếu cùng chịu luật bang với mức bảo vệ tiền công cao hơn thì phải xét mức áp dụng phù hợp.', source: 'usWork' },
      { id: 'overtime', name: 'Overtime theo FLSA', note: 'Người lao động thuộc diện covered, nonexempt có quy tắc trả công làm trên 40 giờ/tuần; không phải mọi người đều cùng diện.', source: 'usWork' },
      { id: 'youth', name: 'Lao động chưa thành niên', note: 'Có quy tắc riêng về tuổi, giờ và loại việc; không coi đủ tuổi trong game là hợp pháp với mọi việc.', source: 'usWork' },
      { id: 'records', name: 'Ghi giờ và tiền công', note: 'Có nghĩa vụ lưu hồ sơ đối với đối tượng được luật bao phủ; đối chiếu từng kỳ thay vì đoán.', source: 'usRecords' },
      { id: 'coverage', name: 'Xác định đối tượng luật bao phủ', note: 'Phải xét diện được bảo vệ và miễn trừ trước khi kết luận quyền overtime; không hứa tự truy lĩnh.', source: 'usWork' }
    ],
    lifeEvents: [
      { id: 'us_district_plan', kind: 'education', min: 15, max: 19, title: 'Đối chiếu yêu cầu của học khu', text: 'Người tư vấn hỏi bạn đã kiểm đủ môn và yêu cầu địa phương chưa. Bạn có thể định hướng học thuật, community college hoặc CTE thay vì tìm một kỳ thi liên bang không tồn tại.', goal: 'giữ kế hoạch học khớp yêu cầu địa phương', source: 'usEdu' },
      { id: 'us_community_college', kind: 'training', min: 18, title: 'Chương trình certificate ở community college', text: 'Bạn đang cân nhắc một chương trình ứng dụng. Người hướng dẫn muốn bạn xem nội dung, tổng chi phí mô phỏng và điều kiện học tiếp; không tự đảm bảo mọi tín chỉ đều chuyển được.', goal: 'thử hướng ứng dụng trước một cam kết học dài hạn', source: 'usTraining', options: ['Chuẩn bị bài thực hành, hẹn đối chiếu chương trình', 'Dự buổi tư vấn rồi cân nhắc', 'Tạm giữ tiền, chưa theo chương trình'], followup: 'Bạn xem sản phẩm học tập và đối chiếu yêu cầu của nơi định học tiếp; kinh nghiệm không thay thế quyết định công nhận tín chỉ.' },
      { id: 'us_flsa_time', kind: 'work', min: 18, title: 'Giờ làm thêm và diện được bảo vệ', text: 'Lịch ca hư cấu có thêm giờ cuối tuần. Bạn cần biết số giờ, diện covered/nonexempt và quy định bang liên quan; chỉ thấy hơn 40 giờ chưa đủ để tự kết luận mọi trường hợp.', goal: 'giữ hồ sơ và hỏi đúng quy định áp dụng', source: 'usWork', options: ['Giữ bảng giờ và hẹn hỏi diện áp dụng', 'Đề xuất ca phù hợp sức khỏe', 'Không nhận thêm khi điều khoản chưa rõ'], followup: 'Bạn mang hồ sơ giờ làm tới buổi trao đổi, phân biệt tiền công thỏa thuận với quyền tối thiểu có điều kiện; không tự nhận khoản bồi thường.' },
      { id: 'us_juneteenth_history', kind: 'community', min: 12, title: 'Buổi tìm hiểu lịch sử Juneteenth', text: 'Người quen mời bạn giúp một buổi đọc và thảo luận công cộng về Juneteenth. Bạn có thể lắng nghe các ký ức cộng đồng, không biến câu chuyện lịch sử thành vai diễn áp lên người thật.', goal: 'cùng cộng đồng học lịch sử một cách tôn trọng', source: 'usFestival', options: ['Đọc tài liệu và nhận việc hỗ trợ buổi gặp', 'Tham gia nghe một phần, chưa nhận việc', 'Xin phép không dự lần này'], followup: 'Nhóm hẹn lại dựa trên phần việc bạn thực sự đã nhận; điều giữ quan hệ là cách lắng nghe, không phải quốc tịch hay nguồn gốc.' },
      { id: 'us_state_wedding', kind: 'marriage', min: 18, title: 'Chọn bang làm lễ trước khi chốt hồ sơ', text: 'Hai bạn đang chọn nơi cưới tại Hoa Kỳ. Giấy phép, thời hạn và việc xin chứng nhận có khác biệt theo bang; bạn muốn kiểm tra trước khi đặt khoản chi lớn.', goal: 'thống nhất nơi cưới và hồ sơ áp dụng cho đôi bên', source: 'usWedding', followup: 'Hai bạn kiểm lại nơi cấp phép và lựa chọn tên; việc đã chuẩn bị không tự tạo chứng nhận kết hôn hay bắt ai đổi tên.' }
    ]
  };
  profiles.VN = {
    education: [
      { id: 'upper', name: 'THPT và hướng học tiếp', note: 'Học phổ thông, chuẩn bị tốt nghiệp và kiểm tra phương thức tuyển sinh của cơ sở muốn vào.', route: 'academic', source: 'vnEdu' },
      { id: 'vocational', name: 'Giáo dục nghề nghiệp', note: 'Có các trình độ sơ cấp, trung cấp, cao đẳng; cần đối chiếu điều kiện và chương trình cụ thể.', route: 'vocational', source: 'vnEdu' },
      { id: 'higher', name: 'Đại học và chương trình ứng dụng', note: 'Chọn ngành và cách học phù hợp năng lực, tài chính; không xem tên trường là bảo đảm có việc.', route: 'applied', source: 'vnEdu' }
    ],
    festivals: [
      { id: 'tet_vn', name: 'Tết Nguyên đán', date: 'Đầu năm âm lịch, đổi ngày dương lịch mỗi năm', calendar: 'lunar', activity: 'sum họp và chuẩn bị bữa Tết theo phong tục chính gia đình', source: 'vnFestival' },
      { id: 'midautumn_vn', name: 'Tết Trung thu Việt Nam', date: '15/8 âm lịch', calendar: 'lunar', activity: 'chuẩn bị đèn lồng hoặc buổi sinh hoạt cho trẻ em phù hợp ngân sách', source: 'vnFestival' },
      { id: 'hung_vn', name: 'Giỗ Tổ Hùng Vương', date: '10/3 âm lịch', calendar: 'lunar', activity: 'tìm hiểu truyền thống tưởng nhớ các Vua Hùng qua hoạt động công cộng phù hợp nơi sống', source: 'vnFestival' }
    ],
    marriage: [
      { id: 'consent', name: 'Tự nguyện và điều kiện kết hôn', note: 'Đôi bên phải tự nguyện và đáp ứng điều kiện; gia đình không quyết định thay hai người.', source: 'vnWedding' },
      { id: 'age', name: 'Kiểm tra độ tuổi pháp lý', note: 'Đối với việc đăng ký được pháp luật công nhận: nam từ đủ 20, nữ từ đủ 18 tuổi.', source: 'vnWedding' },
      { id: 'registration', name: 'Đăng ký khác với lễ cưới', note: 'Hai bên có mặt, xác nhận tự nguyện và ký theo quy trình hộ tịch; đám cưới không thay đăng ký.', source: 'vnCivil' }
    ],
    cuisine: { dishes: ['Phở', 'Bánh mì', 'Bún chả', 'Bánh xèo', 'Cao lầu (Hội An)'], source: 'vnFood' },
    labor: [
      { id: 'contract', name: 'Hợp đồng lao động', note: 'Nội dung, loại và hình thức hợp đồng có quy định; không tự coi thỏa thuận miệng là đủ cho mọi trường hợp.', source: 'vnWork' },
      { id: 'hours', name: 'Thời giờ làm bình thường', note: 'Mốc Bộ luật 2019: không quá 8 giờ/ngày, 48 giờ/tuần, có quy tắc tổ chức theo tuần.', source: 'vnWork' },
      { id: 'annual_leave', name: 'Nghỉ hằng năm', note: 'Mốc thông thường 12 ngày làm việc khi đủ điều kiện; có mức khác theo loại lao động và thâm niên.', source: 'vnWork' },
      { id: 'overtime', name: 'Thỏa thuận làm thêm', note: 'Làm thêm có điều kiện đồng ý, giới hạn và trả công riêng; không tự ép người chơi nhận thêm ca.', source: 'vnWork' },
      { id: 'maternity', name: 'Nghỉ thai sản', note: 'Mốc thông thường sáu tháng với các điều kiện, trường hợp riêng; không đồng nghĩa ai cũng tự nhận trợ cấp ngay.', source: 'vnWork' }
    ],
    lifeEvents: [
      { id: 'vn_upper_route', kind: 'education', min: 15, max: 19, title: 'Chọn hướng sau THPT bằng kế hoạch thật', text: 'Người tư vấn muốn bạn so sánh học tiếp, học nghề và chương trình ứng dụng. Bạn còn phải chuẩn bị tốt nghiệp và xem phương thức xét tuyển, không chỉ chạy theo một điểm chuẩn truyền miệng.', goal: 'đối chiếu năng lực, tài chính và mục tiêu học tiếp', source: 'vnEdu' },
      { id: 'vn_vocational_try', kind: 'training', min: 18, title: 'Thử một phần việc trước khi chọn nghề', text: 'Bạn tìm hiểu một chương trình nghề với người hướng dẫn hư cấu. Họ đề nghị xem bài thực hành và yêu cầu chương trình trước khi đóng khoản chi mô phỏng, không hứa cấp bằng sau một buổi.', goal: 'biết mình hợp cách học và công việc nào', source: 'vnEdu', options: ['Lập bài thực hành và hẹn nhận góp ý', 'Dự buổi giới thiệu, chưa cam kết', 'Giữ ngân sách, tìm hiểu thêm'], followup: 'Bạn đối chiếu tiến bộ với bài thực hành cũ và yêu cầu chương trình. Kết quả giúp định hướng, không tự biến thành bằng nghề hay việc làm.' },
      { id: 'vn_tet_leave', kind: 'work', min: 18, title: 'Lịch phép và ca làm quanh Tết', text: 'Đơn vị hư cấu bàn lịch nghỉ và ca làm trong dịp đông việc. Bạn muốn rõ phép còn lại, khoản làm thêm và nhu cầu gia đình trước khi nhận; không tự lấy lịch nghỉ mẫu áp cho mọi đơn vị.', goal: 'thống nhất lịch phép và ca làm có căn cứ', source: 'vnWork', options: ['Giữ lịch, đối chiếu phép và thỏa thuận làm thêm', 'Đề xuất nhịp làm phù hợp chăm sóc gia đình', 'Chưa nhận ca bổ sung khi chưa rõ điều kiện'], followup: 'Bạn cùng người phụ trách kiểm lại lịch và nội dung đã đồng ý. Không có khoản thưởng Tết hay truy lĩnh nào tự được tạo chỉ vì đã hỏi.' },
      { id: 'vn_midautumn_group', kind: 'community', min: 12, title: 'Đèn Trung thu từ ngân sách nhỏ', text: 'Người quen muốn cùng làm một buổi sinh hoạt Trung thu cho trẻ em. Nhóm cần chọn phần việc vừa sức, tránh so quà và không lấy chuyện đóng góp để gây áp lực cho gia đình ít tiền.', goal: 'giữ buổi sinh hoạt vui, tự nguyện và không chạy đua quà', source: 'vnFestival', options: ['Cùng chia phần việc và hẹn kiểm lại kế hoạch', 'Giúp một phần nhỏ, không nhận khoản chi', 'Không tham gia đợt này, giữ thời gian riêng'], followup: 'Nhóm xem lại phần việc đã nhận và phản hồi của trẻ, chuẩn bị mùa sau theo khả năng thay vì tăng khoản đóng góp bắt buộc.' },
      { id: 'vn_wedding_consent', kind: 'marriage', min: 18, title: 'Chuyện cưới bắt đầu từ ý muốn của hai người', text: 'Hai gia đình đang bàn buổi lễ, còn bạn và người yêu muốn tự thống nhất độ tuổi, đăng ký, ngân sách và cách tổ chức. Không mặc định phải có sính lễ hoặc một tập tục duy nhất cho mọi dân tộc.', goal: 'để cả hai cùng quyết định việc cưới và ngân sách', source: 'vnWedding', followup: 'Hai bạn kiểm lại sự đồng thuận và điều kiện trước khi quyết định. Việc chuẩn bị không tự làm bạn kết hôn hay buộc gia đình tài trợ.' }
    ]
  };
  Object.keys(profiles).forEach(function (cc) {
    var p = profiles[cc]; p.countryCode = cc;
    p.metadata = { verifiedAt: '2026-10-28', referenceYear: 2026, confidence: 'verified', legalFrom: 2026, futurePolicy: 'game-assumption', sources: [] };
    ['education', 'festivals', 'marriage', 'labor', 'lifeEvents'].forEach(function (field) {
      p[field].forEach(function (v) { v.countryCode = cc; if (p.metadata.sources.indexOf(v.source) < 0) p.metadata.sources.push(v.source); });
    });
    p.metadata.sources.push(p.cuisine.source); (p.cuisine.extraSources || []).forEach(function (s) { p.metadata.sources.push(s); });
  });
  G.E.COUNTRY_DEPTH_DATA = { sources: sources, profiles: profiles };
})(globalThis.G);
