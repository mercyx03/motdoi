# Nghiệm thu Thuế tiền lương và Hiến máu909

30/10/2026, UTC+7. Thực hiện theo yêu cầu chủ dự án; không mở giai đoạn mới. Trạng thái: HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN.

## Thay đổi

- Mở rộng careerYear/life3 và bảng tài chính app: tiền lương cư trú Việt Nam dùng giảm trừ bản thân15,5 triệu/tháng, người phụ thuộc đã đăng ký6,2 triệu; lũy tiến5 bậc. Đầu vào là thu nhập thực sau khấu trừ bảo hiểm của hệ thống hiện có; không thu bảo hiểm lần hai, không đổi tỷ lệ/trần/mức hưởng bảo hiểm. Không coi tiền thưởng xổ số, quà hiến máu, vốn doanh nghiệp hay cổ tức là tiền lương để đánh thuế qua nhánh này.
- Ngưỡng15,5/21,7/27,9/34,1 triệu là thu nhập sau bảo hiểm tương ứng0/1/2/3 người phụ thuộc, không phải mọi mức lương gross. Ví dụ20 triệu sau bảo hiểm =>225.000đ thuế/tháng;15 triệu =>0. Thuế suất chỉ áp phần nằm trong từng bậc; không lấy thuế suất cao nhất nhân toàn bộ thu nhập.
- Đăng ký/ngừng từng người, UID bền vững, chống hai người đăng ký cùng hồ sơ, kiểm lại tuổi/thu nhập/trạng thái sống/học tập. Con dưới18 không áp ngưỡng thu nhập; các trường hợp người lớn cần dữ liệu phù hợp. Dùng ngưỡng thu nhập3 triệu/tháng từ hướng dẫn kỳ2026 đã đối chiếu; mức1 triệu trong góp ý là mức cũ. Không tự suy ra khuyết tật từ ít sức khỏe hoặc thất nghiệp. Người khác cần chứng cứ trực tiếp nuôi dưỡng/không nơi nương tựa trong hồ sơ; không bịa NPC ông bà, cha mẹ bên bạn đời hoặc cô chú chưa có dữ liệu để tạo giảm trừ. Các trường hợp chưa có dữ liệu bị chặn và giải thích; chưa phải hệ thống khai thuế pháp lý đầy đủ.
- Tính tiền lương của nhân vật, không quyết toán hộ gia đình thay cho từng NPC. Không tính ngược thuế các năm đã chốt, không tự hoàn tiền vì đăng ký sau khi kỳ đã chốt. Từ kỳ2026 trở đi giữ cấu hình2026 làm mốc mô phỏng, không dự báo luật cho mọi năm tương lai. Trước2026 giữ hành vi cũ. Chuyến thăm Việt Nam không tự đổi cư trú thuế của người đang sống ở nước ngoài.
- Mở rộng lựa chọn hiến máu trong tu_thien, thân thể138, hồ sơ sức khỏe899 và medBill77. Có nhóm ABO/Rh cố định trong bản lưu, không công bố phân bố nhóm máu ngẫu nhiên trong game là thống kê dân số thật. Chứng nhận là cá nhân, không truyền từ cha mẹ sang con.
- Hiến toàn phần/gạn tách theo tuổi, cân nặng, sức khỏe, thai kỳ và tình trạng sau sinh. Toàn phần kiểm250/350/450ml theo cân nặng và9ml/kg; gạn tách kiểm50kg, trên500ml cần60kg. Cơ sở mô phỏng nhận18–60 tuổi. Chưa mô phỏng mọi chống chỉ định thuốc, huyết áp, tĩnh mạch hoặc quy trình thực của từng bệnh viện; bác sĩ là người quyết định ngoài đời.
- Lịch ngày trong năm365 ngày mô phỏng, không thêm đồng hồ tuổi khác. Lượt tiếp theo phải sau toàn phần84 ngày hoặc tiểu cầu14/21 ngày theo địa điểm; xét loại đã hiến gần nhất, đổi loại và qua năm mới. Toàn phần tối đa4, tiểu cầu tối đa22 lượt/năm là giới hạn bảo thủ của cơ sở game, không phải mục tiêu sức khỏe hay tuyên bố mức tối đa pháp luật thống nhất. Lịch hẹn chưa hoàn tất hết năm/đổi địa điểm được khép để không khóa lượt mới.
- CBC được chốt cho từng lịch, không quay lại kết quả bằng reload. Có lỗi mẫu, Hb/tiểu cầu chưa phù hợp, nhu cầu tiếp nhận và phản ứng sàng lọc cần đối chiếu. Các xác suất/chỉ số sinh ra là hiệu chỉnh gameplay; không phải tần suất bệnh thực theo giới. Kết quả không đủ hiến không tự tạo ung thư, HIV hay bệnh mạn tính. Lượt tạm hoãn/hủy không nhận tiền/quà/chứng nhận.
- Tư vấn theo lời mời do phản ứng sàng lọc không thu phí trong kịch bản. Gói chủ động đối chiếu150.000đ mô phỏng là tự nguyện, báo giá trước, thiếu tiền vẫn được hoãn. Không kết luận một xét nghiệm sàng lọc là chẩn đoán; một số ít hồ sơ cần đánh giá chuyên khoa tiếp. Chưa tích hợp bản án bệnh cụ thể từ kết quả giả lập đó vào ill.
- Bồi dưỡng theo thể tích; gạn tách có đủ ba mức400/600/700 nghìn. Quà tình nguyện có ba mức150/200/250 nghìn với gạn tách. Bồi dưỡng, quà hiện vật và suất ăn tách riêng; không cộng giá trị quà/ăn vào tiền. Hỗ trợ đi lại50.000đ cho cả hình thức nhận bồi dưỡng là quy ước cơ sở trong game theo yêu cầu, không tuyên bố đó là khoản bắt buộc cho mọi nơi ngoài đời. Có lựa chọn nhường quà/sữa bánh giữ giấy+đi lại hoặc chỉ nhận giấy.
- Giấy giữ lượng/thành phần chưa dùng. Bồi hoàn khi có chỉ định truyền tại cơ sở công mô phỏng, đúng thành phần và không quá số lượng. Trừ phần máu trước khi tính BHYT cho phần còn lại, không miễn mọi viện phí hoặc đổi giấy ra tiền. Receipt chống dùng/thu hai lần. Chỉ định riêng nối đợt bệnh máu thực đang có trong game; không từ một CBC lệch mà tự tạo chỉ định truyền. Các chi phí đợt bệnh là giá mô phỏng, không phải bảng giá bệnh viện.
- Ngoài Việt Nam có hồ sơ/giải thích và lối xem giá chuyến bay; không nhận quyền lợi Việt Nam tại chỗ. Các lượt hẹn, xét nghiệm, giấy dùng và tiền đã nhận tồn tại qua save/load. Nút hủy/hoãn thoát được; prompt hệ thống dùng manual:false.

## Nguồn đối chiếu

Đã tra cứu nguồn chính thức ngày30/10/2026; tách yêu cầu người dùng với số liệu được cập nhật. Không dùng dự thảo2020 tìm thấy qua tìm kiếm làm căn cứ hiện hành.

- Biểu thuế và giảm trừ2026: https://baochinhphu.vn/nhieu-thay-doi-ve-thue-doi-voi-ca-nhan-va-ho-kinh-doanh-102260106104740091.htm và https://xaydungchinhsach.chinhphu.vn/quy-dinh-moi-ve-khau-tru-thue-thu-nhap-ca-nhan-119260703150410707.htm
- Thu nhập người phụ thuộc3 triệu và hồ sơ: https://baochinhphu.vn/quy-dinh-moi-ve-thue-thu-nhap-ca-nhan-102260707165524772.htm ; Thông tư87/2026: https://vanban.chinhphu.vn/?docid=218772&pageid=27160 ; Nghị định253/2026: https://chinhphu.vn/?docid=218684&pageid=27160
- Lộ trình tuổi nghỉ hưu thông thường dùng để đối chiếu điều kiện người lớn: https://baochinhphu.vn/quy-dinh-moi-ve-tuoi-nghi-huu-102283105.htm (không sửa cơ chế nghỉ nghề hiện có).
- Tiêu chuẩn tuổi/cân nặng và điều kiện: https://syt.bacninh.gov.vn/documents/184573/87394101/Phu_luc_so_4-_Tieu_chuan_va_tri_hoan_hien_mau.pdf (nội dung tiêu chuẩn có trong kết quả tra cứu; máy chủ PDF có lần timeout khi mở trực tiếp, không coi đã đọc toàn bộ PDF).
- Khoảng cách/tiếp nhận: https://vienhuyethoc.vn/hien-tieu-cau-ban-co-biet/ và https://bvhhtmct.vn/hien-tieu-cau-ban-co-biet/ ; nguồn hướng dẫn12 tuần/3 tuần và cơ sở Cần Thơ2 tuần khác nhau, không chọn một mốc áp toàn thế giới.
- Mức bồi dưỡng: https://pbgdpl.gov.vn/Pages/gioi-thieu-van-ban.aspx?ItemID=4253&l=Gioithieuvanbanmoi
- Quyền lợi tình nguyện/chứng nhận: https://vienhuyethoc.vn/quyen-loi-cua-nguoi-hien-mau-tinh-nguyen/

## Kiểm thử / nhật ký / vận hành

Số đo và danh sách chốt trong HEALTH-TAX-909-RESULTS.json. Chuyên đề health-tax909 có1.071 kiểm tra; kiểm ví dụ thuế, biên bậc, điều kiện đăng ký, bảo hiểm không đổi, quy đổi, cân nặng/thể tích, tạm hoãn, quyền lợi từng chế độ, chống lặp, giới hạn năm, lưu/tải và bồi hoàn. Regression doanh nghiệp137 được cập nhật kỳ vọng tiền lương thực nhận sau thuế; vẫn kiểm nguyên lương gốc được chi từ công ty, không hạ kiểm tra bảo toàn tài sản. Test908 đổi giả định mới nhất/packaged vì có909 và chủ dự án yêu cầu đổi nhãn.

Theo chỉ thị trực tiếp mới nhất, dùng release-update.js ghi nhãn908 và909 thành released với thời điểm đổi nhãn thực tế có múi giờ. Đây là ngoại lệ theo yêu cầu chủ dự án đối với quy tắc packaged trước upload; không xác nhận owner đã upload và không tự deploy.133 mục,131 mục cũ giữ nguyên;908 chỉ đổi trường trạng thái/thời điểm chủ đích. Docs/public/HTML trong build phải khớp và được thử ở390/1280px.

Không chạy lại toàn bộ regression GĐ6 trong đợt này; các thất bại/timeout cũ ở BACKLOG chưa được tính PASS. Chưa kiểm Android/iOS thật, save thật của người báo lỗi hoặc binding Pages REVIEWS_DB. Không sửa D1 thật. Repository/branch/remote kiểm trước push; dist ignore, dist.zip được track, không đổi chính sách artifact. Giữ nguyên Claude.md, audit-world-520.json và .local-state-review.txt.

Mốc trước cập nhật:7e92020899452620e3f3377840a076e25961804c. Khôi phục bằng sao lưu save trên thiết bị, revert commit909 rồi package:cloudflare và chủ dự án upload Dashboard; không reset/force/deploy tự động. Bản cũ chưa có giao diện mới, cần giữ bản sao save trước hạ phiên bản.

## Kết quả chốt

Chuyên đề mới1.071 kiểm tra đạt;21/21 tệp hồi quy liên quan đạt. Business13780 kiểm tra (lương gốc/thuế/thực nhận và bảo toàn chi phí); feedback-e75 và integration-feedback1.047 đạt. Smoke11/11, saves10/10, save-safety10/10, NPC14/14 đạt,0 timeout. Có cảnh báo seed đồng hồ và fixture Hardcore đã ngừng hỗ trợ; không ghi những cảnh báo đó là kiểm thử đã bỏ. Browser dist390/1280px đạt đăng ký phụ thuộc, ngân sách có dòng thuế/thực nhận, CBC qua reload, tiền/giấy đúng và nhật ký909/908 Đã phát hành; browser908 cũ chạy lại đạt. Đã xem ảnh điện thoại của ngân sách, CBC và bài nhật ký mới.

Build Windows PASS:191 module,4 bundle,28 tệp. dist.zip 2714650 byte; SHA-256 A97BDF89605A7103610B5C031522788A68263B35406361312D06CA2FBD607F4C. ZIP đọc lại so toàn bộ tên và byte với dist; loading8 cuộc đời nguồn/build khớp; admin/API chỉ dùng database giả,1.648 mục catalogue/1.040 bản xem trước.133 mục cập nhật,131 mục cũ nguyên vẹn,908 chỉ đổi trạng thái chủ đích; docs/public/dist/HTML và generator đạt. Binding REVIEWS_DB thực tế chưa kiểm chứng; không deploy. Nhãn released theo ủy quyền không biến artifact thành nghiệm thu toàn diện/production-ready.
