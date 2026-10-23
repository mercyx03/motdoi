# Thư viện sự kiện dành cho quản trị viên

Mở Tài khoản → Thư viện toàn bộ sự kiện sau khi đăng nhập tài khoản có quyền admin trên máy chủ. Mercy0310 cần giữ quyền admin hiện có trong D1; không cấp quyền theo tên đăng nhập hay dữ liệu phía trình duyệt.

Có 1.316 mục từ registry game: lựa chọn, biến cố ngẫu nhiên, lời kể và diễn biến hằng năm. Hỗ trợ tìm kiếm nội dung/mã, lọc nhóm, mở chi tiết và tải JSON. Mỗi lần hiện 20 mục để tránh giao diện quá nặng.

Nội dung động hiển thị công thức/hàm điều kiện và xử lý, không giả định có cùng kết quả cho mọi nhân vật. Không chạy thử sự kiện trên cuộc đời đang chơi. Registry phản ánh định nghĩa đang hoạt động của bản build, không bao gồm phiên bản định nghĩa đã bị module sau thay thế.

Dữ liệu được nhúng trong Worker phía máy chủ, không có file JSON công khai. API kiểm tra phiên đăng nhập và role admin từ D1 trong từng yêu cầu, trả no-store. Mã nguồn local có placeholder; dùng npm run build để đưa catalog đầy đủ vào dist.

Kiểm tra: tests/admin-events.js chặn khách, thành viên, giả role và admin đã thu hồi; xác nhận admin nhận đầy đủ nhóm và mã duy nhất. Giao diện điện thoại đã kiểm tra tìm kiếm, chi tiết, quay lại tài khoản. Bản dist vẫn 24 file đã minify.