# Rà soát và bổ sung gia đình

## Tính năng

- Xác nhận trước lựa chọn chi lớn: dự tính trên bản sao, không làm đổi tiền hoặc ngẫu nhiên của cuộc đời thật. Ngưỡng từ 50% mức sống cơ sở năm hoặc 20% tiền mặt. Người chơi xác nhận mới thực hiện; hủy quay về hộp lựa chọn, dừng tự chọn trong lúc cân nhắc. Đây là ước tính theo các nhánh mô phỏng, không phải cam kết giá mọi trường hợp.
- Mua vàng/cổ phiếu có nhập ngân sách, hỗ trợ triệu/tỷ, số tiền VND, số thập phân và phân nhóm nghìn; ngoại tệ dùng số theo đồng tiền hiện tại. Chuyển thành số lượng được mua, không trực tiếp trừ tiền khi nhập.
- Con có tính cách bền vững trong bản lưu. Định hướng quân đội, kinh doanh, nghệ thuật, giải trí, y học, khoa học hoặc tự chọn. Tính cách, sở thích và quan hệ ảnh hưởng đồng ý/từ chối; điều kiện học vấn, tuổi và nghề vẫn được kiểm tra.
- Giới thiệu người trưởng thành có tuổi, nghề, gia cảnh và quan điểm sống hư cấu. Đồng ý gặp chưa phải kết hôn. Có thời gian tìm hiểu, có thể chia tay; ép buộc làm giảm quan hệ, không tạo hôn lễ.
- Mục Đổi tên vợ/chồng đã tồn tại ở Gia đình sau khi kết hôn; xác minh lại lưu/tải, tên hợp lệ, nhận dạng không đổi và không cho đổi tên người đang hẹn hò.

## Sửa lỗi trong đợt rà soát

- Điều kiện ngoại ngữ không được chặn trước vì một nguyện vọng sai khối; kiểm tra khối trước khi kiểm tra yêu cầu chứng chỉ.
- Giảm thông báo trạng thái kéo dài không có diễn biến mới: hồ sơ gia đình, điều kiện tốt nghiệp và bản tin mô phỏng. Không xóa hồ sơ hoặc tự cấp bằng.
- Lưu riêng lợi nhuận vận hành và vốn đầu kỳ để đối chiếu hệ số chế độ khó với hiệu chỉnh kinh tế hiện tại.
- Tránh đổi ngẫu nhiên nghề bố mẹ đã có trong gia đình đặc biệt khi thêm truyền thống gia đình.
- Giới hạn xử lý nợ sinh hoạt hiện có cũng áp dụng cho sinh viên trưởng thành chưa tự lập; không bỏ qua giới hạn này khi chậm tốt nghiệp.
- Không chuyển chỗ ở theo tên trường trống; lễ kỷ niệm phải đúng năm sự kiện.
- AI chọn nguyện vọng tuân thủ đầu vào ngoại ngữ; thông báo hồ sơ thiếu điều kiện không lặp liên tục trong cùng năm.
- Giữ nguyên chặn đánh giá 1–2 sao. Chỉ cập nhật bài kiểm tra cũ vốn còn kỳ vọng được gửi điểm này.
- Sửa bộ nạp của các bài kiểm tra cũ để đọc đúng script tải trì hoãn. Cập nhật kiểm tra theo thay đổi đã có: bộ hỗ trợ riêng, các mục bị khóa được ẩn, hiệu chỉnh thu nhập, học bổ túc chủ động và điều kiện chứng chỉ.
- Kiểm tra vận đen bằng tăng nguy cơ biến cố ở cùng điều kiện, không bắt mọi mẫu ngẫu nhiên cuối đời phải nghèo hơn (thừa kế và lựa chọn có thể khác).

## Kiểm tra tập trung

`family126`, `payment-ui126`, `family104`, `world120`, `adult106`, `public116`, `civic118`, `logic844`, `inheritance-currency117`; cộng đồng, thông báo, quan hệ; kiểm tra các khối hồi quy tổng và các bài cập nhật cũ. Kết quả cuối của toàn bộ đợt được ghi trong báo cáo xác minh.


## Kết quả cuối ngày 24/10

- Hồi quy tổng đã chạy đủ các mục 0–75 và 5b bằng nhóm độc lập, giữ nguyên cỡ mẫu. Những nhóm đầu có lỗi được giữ lại làm bằng chứng; chạy lại các mục bị ảnh hưởng sau sửa, không gộp số kiểm tra lặp thành số kiểm tra duy nhất.
- 0–4: 8.677 đạt, 0 lỗi; 5b/21/24: 223 đạt, 0 lỗi. Nhóm sau gồm 800 đời rà soát học tập, 600 đời mỗi chế độ kiểm tra nợ, 6.000 hồ sơ gia đình và các mẫu chống lặp nguyên bản.
- Các nhánh bị lỗi hoặc thiếu bối cảnh trong mục 9: 80.629 đạt, 0 lỗi (5.576 lượt chọn); bổ sung kiểm tra hồ sơ liên hôn có đủ đối tượng: 4.305 đạt, 0 lỗi. Khuôn mới mô tả đúng điều kiện để không bỏ qua các nhánh nối tiếp; không nới điều kiện trong game để chạy bài kiểm tra.
- Mục 28: 66 đạt, 0 lỗi, bổ sung chứng chỉ còn hạn vào hồ sơ nghiên cứu sinh theo điều kiện đã có.
- Các mục lỗi trước đó 38–39, 44, 49, 51 đã chạy lại; lần cuối mục 38: 7 đạt, 0 lỗi. Các mục 59, 61–62, 75: 2.132 đạt, 0 lỗi.
- Toàn bộ chuỗi bài cập nhật cũ đã chạy, các bài lỗi do bộ nạp hoặc giả định cũ đã sửa và chạy lại: update462 (272), update550 (60), update660 (15), update840 (1.019) đều qua. Chính sách chặn 1–2 sao được giữ trong sản phẩm và kiểm tra bằng SQLite thật.
- Tập trung: family126 23; family104 101; world120 74; adult106 105; public116 53; civic118 46; inheritance-currency117 12; career109 698; logic844 9; community-support 10; review126 6. Các bài xác nhận khoản chi và ngân sách vàng cũng qua.
- Bản đóng gói: kiểm tra tải, băm tài nguyên, cú pháp và 8 cuộc đời đầy đủ giống hệt nguồn đều qua. ZIP gồm 28 tệp đúng từng byte với dist, index.html ở gốc ZIP.
- Không có triển khai Cloudflare hay kiểm tra trên điện thoại thật trong đợt này. Kiểm tra hộp xác nhận và ngân sách dùng VM cho các hàm giao diện liên quan.
