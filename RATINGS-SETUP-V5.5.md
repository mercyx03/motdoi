# Bật trang đánh giá công khai — V5.5.1

Giao diện mới nằm tại `/reviews.html`. Điểm được lưu chung trong Cloudflare D1, không gửi email. Không có đánh giá mẫu hay đánh giá giả.

## Thiết lập một lần trên Cloudflare Pages

1. Trong Cloudflare, vào **Storage & databases → D1 SQL Database → Create database**. Đặt tên `motdoi-reviews`, tạo cơ sở dữ liệu.
2. Vào **Workers & Pages → dự án web chính → Settings → Bindings → Add → D1 database**.
3. **Variable name phải là `REVIEWS_DB`**. Chọn database vừa tạo. Lưu binding cho môi trường Production.
4. Sau khi gắn binding, giải nén ZIP V5.5.1 và tải toàn bộ nội dung lên thành bản Production mới. `_worker.js` và `_routes.json` phải nằm ở gốc như trước. Cloudflare yêu cầu triển khai lại để binding có hiệu lực.
5. Mở `/reviews.html`, chọn số sao và gửi. Mở trang đó bằng trình duyệt khác: đánh giá vừa gửi phải xuất hiện và điểm trung bình cập nhật.

Bảng dữ liệu được tạo tự động khi có yêu cầu đầu tiên. Không cần chạy SQL thủ công. Web test chỉ chia sẻ đánh giá với web chính nếu bạn cố ý gắn cùng database; nên dùng database riêng cho test.

## Khi chưa gắn D1

Trang hiện thông báo kho lưu trữ chưa được kết nối, không báo gửi thành công và không bịa số lượt. Chỉ tải ZIP lên chưa đủ để lưu chung. Không cần bật email, FormSubmit hay cung cấp email nhận.

## Dữ liệu và giới hạn

- Lưu điểm 1–5, review tối đa 1.000 ký tự, thời gian và mã trình duyệt đã băm. Không lưu tên, email, IP hoặc dữ liệu nhân vật trong bảng đánh giá. API công khai chỉ trả điểm, review và thời gian. Bảng cũ được nâng cấp tự động để thêm review; các lượt đánh giá hiện có được giữ.
- Cùng mã trình duyệt gửi lại sẽ cập nhật đánh giá cũ, không cộng lượt mới; cần chờ một phút giữa các lần gửi. Xóa dữ liệu trình duyệt hoặc dùng thiết bị khác sẽ tạo mã mới. Đây là đánh giá ẩn danh, không xác minh danh tính người chơi.
- Giới hạn IP một phút trong bộ nhớ Worker là lớp chống gửi dồn cơ bản, không thay thế hệ thống chống bot. Giới hạn cập nhật một đánh giá được kiểm tra trực tiếp trong D1.
- Số liệu và 20 đánh giá mới nhất được đọc từ D1; có nút xem thêm và làm mới. Không chèn đánh giá mặc định.
- Khi bấm Đánh giá từ cuộc đời đang chơi, game tạm dừng và mở trang đánh giá trong tab mới.

## Nếu triển khai bằng Wrangler Workers

Sau khi tạo D1, thêm binding thật vào `wrangler.toml` trước khi triển khai:

```toml
[[d1_databases]]
binding = "REVIEWS_DB"
database_name = "motdoi-reviews"
database_id = "ID database do Cloudflare cung cấp"
```

Không dùng dòng placeholder làm ID thật. Với Pages tải ZIP, dùng các bước dashboard phía trên.

Nguồn: [Cloudflare Pages D1 bindings](https://developers.cloudflare.com/pages/functions/bindings/#d1-databases), [D1 prepared statements](https://developers.cloudflare.com/d1/worker-api/prepared-statements/).
