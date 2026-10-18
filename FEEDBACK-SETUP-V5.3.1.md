# Bật góp ý gửi trực tiếp — V5.3.1

1. Giải nén mot-doi-5.3.1.zip, tải toàn bộ nội dung bên trong lên Cloudflare Pages như các bản trước. Phải có `_worker.js` và `_routes.json` ở gốc bản triển khai; không chỉ tải riêng HTML/JS.
2. Mở website đã triển khai, gửi một góp ý thử ngắn bằng nút **Gửi góp ý**.
3. Chủ website kiểm tra hộp thư đã đăng ký, cả mục Spam, và bấm liên kết kích hoạt từ **FormSubmit**. Đây là xác nhận một lần của dịch vụ nhận thư, không phải bước dành cho người chơi. Nếu dịch vụ yêu cầu xác nhận riêng tên miền web thử/web chính, thực hiện trên đúng website tương ứng.
4. Quay lại website và gửi lại góp ý thử. Sau khi kích hoạt, người chơi chỉ cần bấm Gửi ngay trên web. Không mở mail, không cần đăng nhập email để gửi.

Email nhận chỉ nằm trong mã Worker chạy phía máy chủ. Không xuất hiện trong HTML/JS phía khách, request `/api/feedback` hay phản hồi API. Các tệp mã Worker/cấu hình bị chặn truy cập qua web; không đưa nguyên tệp ZIP mã nguồn thành tài nguyên công khai.

Máy chủ chỉ chuyển các trường góp ý cần thiết đến FormSubmit. Thông tin tuổi/quốc gia/chế độ của nhân vật chỉ kèm theo khi người chơi chọn. Bản nháp giữ trong trình duyệt nếu gửi lỗi hoặc chờ kích hoạt; chỉ xóa khi API xác nhận chấp nhận gửi. Thư đến hộp thư hay Spam phụ thuộc dịch vụ email; không có xác nhận phát đến Inbox từ FormSubmit trong bản này.

Đã kiểm thử API với dịch vụ email giả lập và giao diện trên máy tính/điện thoại. Không tự gửi email thử thật, không tự xác nhận hộp thư hoặc triển khai lên tài khoản Cloudflare của bạn.

Nguồn: https://formsubmit.co/help ; https://formsubmit.co/documentation ; https://formsubmit.co/ajax-documentation
