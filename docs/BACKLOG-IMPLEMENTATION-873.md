# Triển khai toàn bộ backlog — tiếp từ 00ce612

Phạm vi người dùng: hoàn tất các mục triển khai còn mở, kiểm thử trọng điểm, một gói dist/dist.zip cuối. Bỏ qua nghiệm thu toàn diện. Không chốt đợt chỉ vì xong vài mục; không xóa hoặc đổi tên mục thiếu thành nghiệm thu.

## Ma trận hiện hành

| Nhóm | Đã triển khai trên mã nguồn | Còn mở |
|---|---|---|
| Khoản vay cửa hàng | Quyền thu hồi theo định danh, sao lưu qua chia tay và qua đời, biên nhận, quy đổi tiền và chuyển phần quyền thu qua di sản. Yêu cầu thanh toán từ di sản người vay được xem xét năm sau dựa trên tiền đã ghi nhận. | Thứ tự ưu tiên giữa nhiều chủ nợ, xử lý tài sản phi tiền mặt và thời hiệu theo từng nơi. Các khoản chưa đủ căn cứ vẫn còn trong hồ sơ. |
| Y/Luật Mỹ | Hồ sơ Harvard, Stanford và UCLA qua lộ trình tuyển sinh hiện có. Có GRE, MCAT, PREview, hồ sơ bằng trước, một số học phần tiên quyết, phí hồ sơ theo kỳ và thư nhận học riêng theo trường. | Lịch nộp thật theo ngày, toàn bộ ngoại lệ hồ sơ quốc tế, biểu học phí/hỗ trợ và điều kiện hành nghề theo nơi. |
| Danh mục đại học | Tên ngành MIT 6-3, 14-1, 14-2; Computer Science BSc G400 tại UCL và Computer Science BA tại Cambridge. Có thời lượng chuẩn và thông tin tham chiếu tuyển sinh đã đọc. | Kiểm chứng ngành/học phí/điều kiện của các trường và các kỳ còn lại. Điểm xét chung và bài thi riêng chưa thay hoàn toàn, kể cả SAT/ACT tại MIT và TARA tại UCL. |
| Học tại nhà | Pennsylvania và Québec có bước chọn ngày nộp, đối chiếu thời điểm của kỳ và ghi đúng hạn hoặc trễ hạn vào bản lưu. | Ngoại lệ chuyển vào giữa năm, văn bằng, tín chỉ được trường nhận và thủ tục của các vùng còn thiếu trong danh mục 76 vùng. |
| Quốc gia | Nối nguồn trực tiếp vào một số dòng hôn nhân và lao động của Vương quốc Anh, Canada và Tây Ban Nha. Số liệu kiểm kê tối thiểu của 195 nước vẫn đạt. | Đối chiếu từng mệnh đề trong 187 hồ sơ mở rộng, bổ sung nội dung theo địa phương/gia đình/thời kỳ. Kiểm kê độ phủ không xác nhận đúng từng mệnh đề. |
| Di trú/quốc tịch | Hồ sơ nhập tịch thường theo thời gian cư trú được ghi nhận tại Canada, Mỹ và Úc. Phân biệt năm tạm trú và thường trú, giữ lối đọc bộ đếm của bản lưu cũ khi không có lịch sử chi tiết. | Kiểm chi tiết theo ngày vắng mặt, ngoại lệ hồ sơ, lịch sử chính sách và diện visa/phúc lợi các nước còn lại. |
| Tài chính/y tế | NS&I Guaranteed Growth Bonds có kỳ hạn, lãi gộp, mệnh giá GBP và khóa rút sớm. Bổ sung tham chiếu bảo hiểm tiền gửi Canada/Úc và lời sự kiện khám công cho England, Scotland và Canada theo phạm vi chi trả. | Biểu ngân hàng, thuế/phí, chi phí y tế và quyền lợi cụ thể ở các nước/thời kỳ còn thiếu. |
| Hoàng gia | Menu lịch sử Tây Ban Nha 1975–1978 phân biệt tước cá nhân của Felipe năm 1977 với Hiến pháp 1978. Menu họ tên kiểm đúng cha mẹ đã xác nhận. | Monaco 1882 và các thời kỳ còn thiếu, luật kế vị/nhiếp chính trước 1978 dưới dạng gameplay, các ngoại lệ tước hiệu và hộ tịch châu Âu. |
| Bóng đá | Ghi trận dùng để xét quốc tịch, căn cứ cư trú và đổi đội tuyển. Phân biệt trận cấp trẻ với trận đội tuyển quốc gia. Sân nhà/sân khách được gắn đúng lượt đấu. | Lịch, thể thức, thành phần và điều kiện thăng hạng theo từng giải/mùa, các nhánh căn cứ huyết thống và ngoại lệ của FIFA. |
| Luật gia đình | Hồ sơ ly hôn khi thụ án tại England và Wales có conditional order, yêu cầu final order và quyết định sau đó. Biểu phí 2026 gắn với mốc thay đổi. | Hỗ trợ phí, một số ngoại lệ khi tống đạt, luật Scotland/Bắc Ireland và các nước khác. |
| Rà dữ liệu toàn game | Rà các luồng đã sửa và thêm nguồn ở dữ liệu dùng trực tiếp. | Các mục chưa có căn cứ trong kiểm kê dữ liệu tự đặt và các mô hình dùng chung vẫn cần đối chiếu. |
| Đóng gói | Bản 8.10.73 Preview được đóng gói theo yêu cầu mới. Chi tiết ở mục gói Cloudflare. | Các phần triển khai còn mở theo từng hàng. GĐ6 nghiệm thu toàn diện nằm ngoài yêu cầu hiện tại. |

## Kiểm thử đã chạy

- Smoke 11/11, tương thích bản lưu 10/10, an toàn bản lưu 10/10, định danh NPC 14/14. Cảnh báo nền về seed và các thẻ Hardcore đã bị gỡ vẫn xuất hiện. Bộ bản lưu do engine tạo.
- Tài sản và gia đình: receivables873 (33), partner-shop871 (16), relative-finance163 (25), business137 (80), continuity101 (361), relationships108 (76), md5-920 (118), assets912 (192).
- Giáo dục: professional-degree872 (19), hls872 (19), institutions867 (804), courses871 (40), education-fallback-graduation (104), uk-application872 (12), study-home857 (204), education863 (291).
- Bóng đá, pháp lý và quốc gia: football-world871 (11), football-reference871 (132), football897, football-payroll901, depth900 (59), feedback843 (253), reference866 (23), spain862 (198), spain-surname871 (16), royal865 (158), monaco861 (126), country-minimum-content (399.955) và backlog-routes873.
- Chrome headless kiểm mã nguồn giáo dục ở 390/1280 px: 8 lượt đạt, gồm nộp/xem kết quả/xác nhận nhập học England và đóng màn hình Y không mất tiến độ. Thêm 10 lượt chọn ngành và lưu/tải lại ở 390/1280 px, không lỗi JavaScript hoặc tràn ngang.
- Chưa chạy hồi quy toàn diện. Chưa xác minh REVIEWS_DB trên Pages.

## Nguồn đã đọc

- GOV.UK quản lý di sản/nợ: https://www.gov.uk/probate-estate/settling-debts-and-taxes
- CFPB trách nhiệm nợ người mất có ngoại lệ: https://www.consumerfinance.gov/ask-cfpb/what-happens-to-your-debts-after-you-die-en-1463/
- BLDS2015 Điều615: https://btllang.mod.gov.vn/van-ban/vbpq-do-nha-nuoc-ban-hanh/5001-bo-luat-dan-su-2015.html
- HMS eligibility/prerequisite: https://hms.harvard.edu/education-admissions/md-program/admissions/preparing-apply/eligibility ; https://hms.harvard.edu/education-admissions/md-program/admissions/preparing-apply/prerequisite-courses
- StanfordMD: https://med.stanford.edu/md-admissions/academic-requirements.html
- UCLAMD: https://medschool.ucla.edu/education/md-education/admissions/preparing-to-apply (TraditionalMD:PREview; điều kiện bằng và domestic, phí secondary125; không áp chính sách track khác)
- StanfordJD: https://law.stanford.edu/apply/how-to-apply/jd-application-process/ (kỳ2027:phí85, LSAT/GRE, thư/tài liệu và lịch)
- UCLAJD: https://law.ucla.edu/admissions/jd-admissions/first-year-jd-applicants (kỳ2027:phí75, LSAT/GRE/CAS)
- ETS GRE fee từ01/08/2026: https://www.br.ets.org/content/ets-org/ca/en/gre/test-takers/general-test/register/fees.html ($249 ngoàiChina/India, chưa thuế)
- AMCAS2027: https://students-residents.aamc.org/how-apply-medical-school-amcas/you-apply ($180 đầu tiên, $48 thêm)
- MCAT2026 PDF: https://students-residents.aamc.org/media/11711/download ($355), trang hiện hành đã lên360: phải tách kỳ, không gộp sai mốc.

- Hồ sơ FIFA về đổi liên đoàn: https://inside.fifa.com/legal/news/updated-documentation-guidance-player-eligibility-change-association
- Học tại nhà: https://www.pa.gov/agencies/education/resources/policies-acts-and-laws/basic-education-circulars-becs/purdons-statutes/home-education-program và https://www.quebec.ca/en/education/preschool-elementary-and-secondary-schools/programs-training-evaluation/homeschooling/process-steps
- Tiết kiệm NS&I: https://www.nsandi.com/about-us/press-releases/2026/higher-interest-rates-for-nsi-fixed-term-british-savings-bonds-from-today
- Ly hôn và phí: https://www.gov.uk/divorce/apply-for-conditional-order-decree-nisi và https://www.gov.uk/government/news/court-and-tribunal-fees-updates-from-july-2026
- Nhập tịch: https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-citizenship/adult-minor/who.html , https://www.uscis.gov/citizenship/learn-about-citizenship/citizenship-and-naturalization/i-am-a-lawful-permanent-resident-of-5-years , https://immi.homeaffairs.gov.au/citizenship/become-a-citizen/permanent-resident
- Tây Ban Nha 1975–1978: https://www.boe.es/buscar/doc.php?id=BOE-A-1967-5 và https://www.boe.es/eli/es/rd/1977/01/21/54
- Danh mục ngành: https://catalog.mit.edu/degree-charts/ , https://www.ucl.ac.uk/study/prospective-students/undergraduate/courses/computer-science-bsc và https://www.undergraduate.study.cam.ac.uk/courses/computer-science-ba-hons-meng
- Chăm sóc công: https://www.nhs.uk/nhs-services/hospitals/about-nhs-hospital-services/ , https://www.nhsinform.scot/care-support-and-rights/health-rights/access/healthcare-for-overseas-visitors/ và https://www.canada.ca/en/health-canada/services/hospital-care.html
- Monaco: đã tìm thấy hồ sơ gốc quy chế 1882 tại https://legimonaco.mc/tnc/ordonnance/1882/05-15-L002402 và sắc lệnh riêng năm 1944 tại https://legimonaco.mc/tnc/ordonnance/1944/06-02-2.876 . Chưa đọc được toàn văn hai trang từ nguồn này do hết thời gian kết nối. Chưa mã hóa điều kiện nhiếp chính từ hai văn bản.

## Gói Cloudflare 8.10.73

- Đóng gói Preview theo yêu cầu trực tiếp sau khi đã ghi lại các mục BACKLOG còn mở. Nhật ký mới ở đầu danh sách, trạng thái packaged, giữ nguyên 195 mục trước.
- package:cloudflare PASS. ZIP 28 tệp, 3.537.409 byte, SHA256 9DD4A0304881154081B570319621B1AF4174282908B5A61653D2C91C93762F14. Đã đọc lại và so từng tệp với dist. Loading/API cục bộ đạt.
- Nhật ký bản dựng đạt ở 390 và 1280 px, gồm tìm không dấu, lọc và tải thêm. JSON nguồn, JSON dist và dữ liệu nhúng đồng bộ.
- Gói được dựng từ workspace, gồm mã y tế riêng có sẵn. Phần mã riêng giữ ngoài commit. Mốc khôi phục là 00ce612 (gói 8.10.72).
