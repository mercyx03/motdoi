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
