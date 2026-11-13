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

## Tiếp tục sau gói 8.10.73

- Tuyển sinh: bổ sung lượt thi SAT/ACT vào hồ sơ MIT và yêu cầu TARA đúng kỳ khi xem quyết định Computer Science BSc (G400) tại UCL. Bài thi giữ điểm từng phần, chi phí theo tiền địa phương, kết quả qua lưu/tải. Thư nhận UCL đã được cấp trước khi thay đổi vẫn dùng được. Việc xác nhận nhập học chỉ xét đúng nguyện vọng đã nhận thư. Game gom thời điểm đăng ký và thi vào lượt năm; lịch ngày thi, hỗ trợ lệ phí và đầy đủ yêu cầu riêng của các chương trình vẫn mở.
- Học tại nhà Québec: chọn ngày cuối đi học, nộp thông báo trong 10 ngày và kế hoạch học trong 30 ngày, phân kỳ theo năm học. Giữ hạn vắt qua năm mới và báo trễ hạn trên hồ sơ. Các vùng, nghĩa vụ và ngoại lệ còn lại vẫn mở.
- Bóng đá: ghi nơi sinh đã có căn cứ của cha/mẹ ruột trong các ca sinh hỗ trợ được, giữ thêm một đời ông/bà ruột khi chuyển thế hệ. Xét căn cứ này cùng quốc tịch đã có. Thiếu hồ sơ cũ, con nuôi và mang thai hộ không tự suy ra quan hệ sinh học. Liên đoàn trong Vương quốc Anh, lịch thi đấu và các ngoại lệ còn lại vẫn mở.
- Ly hôn England/Wales: hồ sơ không tống đạt được ghi các lần tìm địa chỉ, cho nộp D13B và chờ quyết định riêng trước khi tiếp tục xin conditional order. Còn tống đạt theo phương thức thay thế, hỗ trợ án phí và các nước khác.
- Hoàng gia Tây Ban Nha: dùng Hiến pháp 1876 cho nhánh kế vị trong gia phả hư cấu từ ngày công bố 02/07/1876 đến mốc gián đoạn 13/09/1923. Quân chủ dưới 16 tuổi cần nhiếp chính; xét cha/mẹ góa, thân nhân đủ điều kiện hoặc Hội đồng Bộ trưởng tạm quyền. Còn nhánh giám hộ/mất khả năng và quyết định Cortes trong giai đoạn này, quy tắc 1975–1978, Monaco 1882 và các ngoại lệ châu Âu.
- Gia đình: AI theo số con đã chọn, kể cả chọn không có con. Khi hàng chờ đã đầy, game chỉ ghi thời điểm hỏi chuyện có con nếu câu hỏi thực sự được đưa vào hàng chờ. Tỷ lệ AI có con trong mẫu lớn vẫn cần đo.
- Gói dist/dist.zip đang là 8.10.73 Preview (c4dc33f). Các thay đổi sau gói ở trên chưa nằm trong ZIP. Phần đối chiếu 187 hồ sơ quốc gia và các nhóm dữ liệu rộng khác vẫn mở.

Kiểm thử đã chạy: các bộ chuyên đề giáo dục, gia đình, bóng đá và hoàng gia. Smoke 11/11, tương thích bản lưu 10/10, an toàn bản lưu 10/10, định danh NPC 14/14. Cảnh báo nền về seed và thẻ Hardcore cũ vẫn xuất hiện. Trình duyệt đạt 8 lượt ở 390/1280 px, gồm nộp hồ sơ UCL, dự TARA, xem kết quả và xác nhận nhập học đúng chương trình.

Nguồn trực tiếp: https://mitadmissions.org/apply/firstyear/tests-scores/ , https://esat-tmua.ac.uk/about-the-tests/tara/ , https://www.ucl.ac.uk/engineering/computer-science/study/undergraduate/tara-admissions-test-computer-science-courses , https://www.quebec.ca/en/education/preschool-elementary-and-secondary-schools/programs-training-evaluation/homeschooling/process-steps , https://www.gov.uk/divorce-missing-husband-wife , https://www.boe.es/gazeta/dias/1876/07/02/pdfs/GMD-1876-184.pdf , https://www.congreso.es/es/cem/primoriv

## Gói 8.10.74 — doanh nghiệp gia đình, niêm yết, đổi nơi sống

| Nhóm | Đã triển khai | Căn cứ / mức xác minh | Còn mở |
|---|---|---|---|
| Cổ phần công ty của bố mẹ | Cơ cấu sở hữu ngẫu nhiên ổn định theo đời (bố mẹ 30–100%, đối tác/quỹ/đại chúng), công ty niêm yết hoặc chưa; bố mẹ có thể tự IPO khi đủ điều kiện. Bản lưu đã bàn kế nghiệp giữ cơ cấu cũ (100%, chia đều). | Quy tắc game. | Danh tính cổ đông ngoài là nhóm chung, chưa thành NPC riêng. |
| Thâu tóm | Mua của đối tác, mua dần trên sàn tối đa 5%/năm, chào mua công khai khi vượt 25/35/45/55/65/75% (Việt Nam từ 2021; 2007–2020 ngưỡng 25% và mỗi 10%), đề nghị bố mẹ chuyển nhượng/tặng theo mức tin tưởng. Trên 50% thì lập hồ sơ công ty với phiếu bầu thật. Anh chị em có tham vọng tự mua dần cổ phần ngoài. | Luật Chứng khoán 54/2019/QH14 Điều 35 (văn bản hợp nhất VPQH trên vbpl.moj.gov.vn). | Ngưỡng các nước ngoài Việt Nam dùng một mốc chung, chưa đối chiếu luật từng nước. |
| IPO và niêm yết | Kiểm toán/chuyển đổi → nộp hồ sơ → xét duyệt → chọn tỷ lệ chào bán; pha loãng người thân và cổ đông ngoài; giá thị trường gấp nhiều lần sổ sách, biến động hằng năm; chi phí công bố thông tin; bán bớt trên sàn. | Việt Nam ≥2021: vốn từ 30 tỷ đồng, hai năm lãi, ROE ≥5%, chào bán ≥15% cho ≥100 nhà đầu tư không phải cổ đông lớn (10% nếu vốn ≥1.000 tỷ) — Luật Chứng khoán 2019 Điều 15, Nghị định 155/2020 Điều 109 (sửa bởi 245/2025, chưa đọc toàn văn sửa đổi). 2007–2020: mức vốn 10 tỷ của Luật 2006. Trước 2000 chưa có sàn. | 2000–2006 và các nước khác dùng điều kiện chung có ghi mức xác minh. |
| Bầu cử và lương | Trúng cử CEO/Chủ tịch nhận chức danh, lương theo quy mô và lợi nhuận, trả từ chi phí công ty; mất chức khi người khác trúng. Công ty gia đình chưa kiểm soát: người thắng nhận chức Phó TGĐ/Chủ tịch, giữ nút bàn giao cũ. Hòa phiếu bổ nhiệm TGĐ theo phía Chủ tịch; Chủ tịch công ty đại chúng Việt Nam không kiêm TGĐ. Lương quản lý gia đình tính lại. | Luật Doanh nghiệp 59/2020/QH14 Điều 153, Điều 156 khoản 2 (đối chiếu qua bản trích). | Bầu Chủ tịch hòa phiếu vẫn bế tắc tới khi một bên mua thêm cổ phần. |
| Niềm tin và thừa kế | Điểm thành tích (học vấn, năng khiếu, huy chương, danh hiệu, kinh nghiệm) và quan hệ → giao chức vụ khi còn trẻ, đề bạt, tặng cổ phần, giao quyền sớm, ưu tiên trong di chúc; con chưa thành niên giữ tối thiểu 2/3 suất. | Bộ luật Dân sự 2015 Điều 644 cho phần bắt buộc ở Việt Nam. | Quy tắc phần bắt buộc các nước khác chưa mã hóa. |
| Thiên phú kinh doanh | +20–30% lợi nhuận dương khi bạn trực tiếp điều hành (theo cấp năng khiếu). | Quy tắc game. | — |
| Đổi nơi sống | Mọi tuyến về nước dùng chuỗi quy đổi đầy đủ; nhà không nợ được giữ thành tài sản và dọn về ở khi quay lại; chi phí chuyển nước 15% thu nhập cơ sở; lao động/du học giữ tiền Việt không bị quy đổi lần hai. | Kiểm tra khứ hồi giá trị tài sản. | Nhà đang vay vẫn bán để tất toán. |
| Giao diện | Nút “Mở lại” bảng menu vừa đóng; gỡ nhãn “mô phỏng” thừa ở 10 module, giữ ghi chú kịch bản chính trị, tham số chưa có nguồn ghi “ước tính”. | Kiểm 390/1280 px. | Rà toàn bộ chuỗi còn lại cùng đợt đối chiếu dữ liệu quốc gia. |

Kiểm thử 8.10.74: business874 (13 nhóm), business133/137, dynasty908 (2285), family-shares872, enterprise-chains173, operations168, reports167, leadership-education169-170, treasury-deals165-166, partner-shop871, receivables873, transit907 (1788), continuity906, child-paths834, life138, audition139, md4-919, health-tax909, feedback-a (cập nhật kỳ vọng phí chuyển nước), feedback-b, update511, update520, backlog-routes873, royal865, healthsys-rx-cap, family830, family126, relationships841, actions894; test:quick: smoke 11/11, saves 10/10, save-safety 10/10, NPC 14/14 (cảnh báo nền Hardcore/seed như cũ). Mô phỏng 40 đời không lỗi. Trình duyệt Chrome headless 390/1280 px: bảng cổ phần gia đình, bảng thâu tóm/niêm yết, nút mở lại, không tràn ngang, không lỗi JS.

Chưa làm trong đợt này (vẫn mở theo checklist bàn giao): đối chiếu 187 hồ sơ quốc gia; danh mục trường/ngành và Y/Luật Mỹ ngoài ba trường; học tại nhà 76 vùng; visa/nhập tịch/phúc lợi theo nước; biểu thuế/ngân hàng/y tế; ly hôn khi thụ án ngoài England/Wales; Monaco 1882 (Legimonaco chưa truy cập được); Tây Ban Nha giám hộ/Cortes; ngoại lệ tước hiệu sáu nước; thể thức giải bóng đá theo mùa và ngoại lệ FIFA; thứ tự chủ nợ cửa hàng; đo tỷ lệ AI có con.
