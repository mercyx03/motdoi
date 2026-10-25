# Xác minh bản 8.5.0

## Phạm vi và sửa lỗi

- Nâng phiên bản hiển thị, tài nguyên và gói dự án lên 8.5.0.
- Sửa dữ liệu bối cảnh truyền vào hồ sơ định hướng và hồ sơ đối tượng liên hôn của con. Các hộp này trước đó có thể báo hoàn cảnh thay đổi dù dữ liệu vẫn tồn tại.
- Lựa chọn chủ động hết hiệu lực được ghi rõ chưa thực hiện. Nếu điều kiện của một phương án thay đổi, không tự chuyển sang phương án khác; không trừ tiền và trả lại lượt hành động chưa dùng trong cùng năm.
- Giữ nguyên chặn đánh giá 1–2 sao.

## Kiểm tra tập trung

- business128: đạt.
- exam127: đạt.
- world120: đạt.
- family126: đạt.
- payment-ui126: đạt.
- budget-ui126: đạt.
- review126: đạt.
- family104: đạt.
- adult106: đạt.
- public116: đạt.
- civic118: đạt.
- career109: đạt.
- logic844: đạt.
- inheritance-currency117: đạt.
- relationships108: đạt.
- relationships841: đạt.
- community: đạt.
- community-support: đạt.
- notifications: đạt.
- community-speed: đạt.
- inbox-client: đạt.
- estate840: đạt.
- continuity101: đạt.
- memorial-history: đạt.

- release850: 14 kiểm tra mới đạt; business128: 16; exam127: 244; world120: 74; continuity101: 361.
- continuity101 cập nhật hồ sơ thử nghiệm có chứng chỉ ngoại ngữ còn hạn đúng điều kiện hiện tại; không bỏ điều kiện ngoại ngữ trong game.
- Toàn bộ 39 bộ kiểm tra cập nhật cũ đạt.
- Kiểm tra tải, băm tài nguyên, cú pháp, 8 cuộc đời đầy đủ giống nguồn và dữ liệu ghi chú nhúng trong trang đều đạt.
- API thư viện Admin xác minh quyền máy chủ, chặn khách/thành viên/giả vai trò và quyền bị thu hồi; 1.430 mục.

Chưa triển khai Cloudflare trong đợt này; chưa kiểm tra trên điện thoại thật. Kết quả không phải khẳng định trò chơi không còn bất kỳ lỗi nào.


## Hồi quy tổng đã hoàn tất

- Nền mã kiểm tra: bản 8.5.0 của đợt rà soát này (commit 3d39e45); các tiến trình được khởi chạy trong khi sửa lỗi và không được khởi động lại hay giảm cỡ mẫu.
- Mục 0–8 và 5b: 252.212 kiểm tra đạt, 0 lỗi.
- Mục 9–30: 4.974.204 kiểm tra đạt, 0 lỗi.
- Mục 31–75: 2.921 kiểm tra đạt, 1 chỉ báo thất bại ban đầu. Chỉ báo ghi “đã từng kết hôn” nhưng chỉ đếm người đang có vợ/chồng, loại người ly hôn/góa. Sửa cách đo theo lịch sử trạng thái hôn nhân tới tuổi 38, giữ nguyên 300 cuộc đời và ngưỡng 60%; không đổi xác suất trong game. Chạy lại mục 63: 121 đạt, 0 lỗi.
- Các sửa lỗi cuối về hộp lựa chọn và hồ sơ gia đình được kiểm tra riêng bằng release850 (14 kiểm tra) và đối chiếu nguồn/bản build.

## Đối chiếu nguồn mới ngày 25/10

Trong lúc các tiến trình chạy, có thêm các commit gia đình và mạng xã hội trong cùng thư mục. Không gán kết quả hồi quy chạy trên nền trước đó cho toàn bộ các thay đổi mới này. Đã kiểm tra lại nguồn và bản đóng gói hiện tại: release850, loading (8 cuộc đời giống nguồn), family129 (65), family130 (66), social-personal131 và đồng bộ thiết lập đều đạt. Các thay đổi mới được giữ nguyên.
