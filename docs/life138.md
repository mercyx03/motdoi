# Gia đình, tuổi học trò và con đường sự nghiệp (138–139)

## Các mục trong game

- **Tình cảm & gia đình → Hồ sơ gia đình và người quen**: nguồn gốc gia đình, đặc điểm ngoại hình, chiều cao/cân nặng, hồ sơ bố mẹ, anh chị em, con và những người quen. Chọn tên để đọc hồ sơ, trò chuyện hoặc hòa giải.
- **Tình cảm & gia đình → Gia đình bàn chuyện người chăm sóc**: trẻ nói mong muốn, người giám hộ quyết định; không mặc định trẻ được tự quyết nơi sống.
- **Học tập → Chăm sóc, trường học và hỗ trợ học phí**: lựa chọn chăm sóc và môi trường học. Nhà trẻ/mẫu giáo không bắt buộc; phương án có phí được xét lại mỗi năm.
- **Học tập → Lớp học, thời khóa biểu và học bạ**: xem lớp hiện tại hoặc học bạ đã ghi. Danh bạ giữ bạn cũ khi chuyển trường. Lịch học là lịch mô phỏng, không phải thời khóa biểu của trường thật.
- **Học tập → Gia sư, học thêm và xin hỗ trợ**: tự ôn miễn phí hoặc xin kinh phí học thêm/gia sư.
- **Học tập → Sở thích và rèn luyện kỹ năng**: đánh dấu yêu thích, chọn cách học và 2/5/8 giờ luyện mỗi tuần. Tối đa ba môn/năm; không cần có năng khiếu bẩm sinh để tiến bộ.
- **Học tập → Ngoại ngữ theo điểm đến**: chuẩn bị ngôn ngữ trước khi nhận đề nghị đào tạo quốc tế.
- **Cuộc sống địa phương → Khám phá nơi đang sống**: hoạt động theo nơi ở hiện tại, tuổi và điều kiện gia đình.
- **Sự nghiệp giải trí → Audition và sự nghiệp giải trí quốc tế**: từ 18 tuổi; audition, đề nghị đào tạo, chi phí, đánh giá, debut hoặc rời chương trình. Các công ty là hư cấu. Chuyến đi đào tạo không tự bán nhà.
- **Doanh nghiệp & tập đoàn → Kế nghiệp doanh nghiệp của bố mẹ**: xuất thân doanh nhân có kế hoạch xét chọn người điều hành. Chọn điều hành không đồng nghĩa nhận cổ phần. Di sản có thể chia cho cả người từ chối điều hành.
- **Doanh nghiệp & tập đoàn → Đào tạo và chọn con kế nghiệp**: dành cho chủ doanh nghiệp, đào tạo từ 16 tuổi và bổ nhiệm từ 18 tuổi khi đủ kinh nghiệm và con đồng ý. Chuyển cổ phần/di chúc dùng hệ thống đã có.

## Tính liên tục và phạm vi mô phỏng

Hồ sơ và học bạ bắt đầu được ghi khi chạy phiên bản mới, không dựng lại các năm đã trôi qua trong save cũ. Nguồn gốc gia đình không tự cấp quốc tịch hoặc quyền nhập cảnh và không quyết định năng lực/tính cách. Số đo là mô phỏng phát triển cơ thể, không phải đánh giá sức khỏe.

Doanh nghiệp bố mẹ được dựng cho xuất thân doanh nhân ngẫu nhiên; đời con chuyển từ một nhân vật đã chơi sử dụng di sản thật của hệ thống 137, không tạo thêm doanh nghiệp xuất thân trùng lặp. Doanh nghiệp tự tạo, cổ phần đã tặng, di chúc và chuyển đời vẫn sử dụng dữ liệu cũ.

## Kiểm tra

`npm run test:life138` kiểm tra hồ sơ, di truyền, số đo, môi trường chăm sóc, lớp học qua nhiều năm, học phí, kỹ năng, audition/đào tạo, hồi hương, kế nghiệp và tương thích ngoại hình/gia đình/doanh nghiệp. Các kiểm tra continuity101, estate840, world120, university136, resume135 và loading được chạy riêng.
