# Quy trình dự án Một Đời

Áp dụng cho nghiệm thu GĐ2.5, GĐ3–GĐ6, 25 hệ thống gameplay chuyên sâu và mọi đợt sửa lỗi/tối ưu/nội dung sau này. Không tự bắt đầu giai đoạn mới. Đọc `Claude.md` và các module liên quan trước khi lập trình; mở rộng hệ thống hiện có, giữ tương thích bản lưu và Cloudflare.

## Sau mỗi giai đoạn đủ điều kiện nghiệm thu

1. Hoàn thiện phạm vi đã giao; chạy test chuyên đề, smoke và tương thích bản lưu; kiểm tra lỗi mới.
   Nếu có thay đổi đáng công bố cho người chơi, bổ sung nhật ký trước khi build: đọc `docs/UPDATE-NOTES-POLICY.md`, thêm mục bền vững ở `docs/update-extra.json` và đồng bộ `public/data/updates.json`; giữ nguyên các mục cũ. Ghi thời điểm thực tế có múi giờ, dùng lời dễ hiểu, không công bố tính năng chưa triển khai. Kiểm tra mục mới nằm đầu danh sách, có trong dữ liệu/HTML đã build và dùng được trên điện thoại/máy tính. Phân biệt nhật ký tĩnh với bình luận D1; không ghi đè database Production.
2. Chạy `npm run package:cloudflare` trên Windows: lệnh dùng build riêng `tools/build.js`, kiểm loading/API và đóng ZIP có xác minh. Không giả định Vite. Chi tiết và giới hạn trong `docs/CLOUDFLARE-PACKAGING.md`.
3. Luôn chuẩn bị cả `dist/` và `dist.zip` mới ở gốc dự án. ZIP chứa nội dung bên trong dist, có index.html ngay gốc, bao gồm file dấu chấm và cấu hình cần thiết. Đọc lại ZIP, so toàn bộ tên file và nội dung với dist. Không dùng artifact cũ. Nếu thất bại, giữ artifact ổn định trước đó và báo rõ đó là bản cũ.
4. Kiểm tra status, branch, remote và quyền GitHub; xác minh đúng repository, quyền riêng tư và nguy cơ push kích hoạt deployment. Nếu thiếu quyền/remote hoặc có nguy cơ deployment ngoài ý muốn, báo phần thiếu; không tự đổi cấu hình để vượt qua.
5. Tự động commit thay đổi hợp lệ bằng thông điệp rõ ràng và push nhánh hiện tại lên remote đã xác minh. Quy tắc này thay thế yêu cầu cũ tuyệt đối không push. Không merge main, force push, sửa lịch sử hoặc tạo commit rỗng. Stage từng đường dẫn, không dùng git add . mù quáng. Không commit mật khẩu/token/API key/dữ liệu cá nhân/bản lưu thật.
6. Báo cáo tiếng Việt theo mẫu dưới đây. Không coi công việc hoàn tất nếu chưa chuẩn bị build mà không giải thích lý do.

Giữ nguyên, không xóa/ghi đè/commit `audit-world-520.json`, `.local-state-review.txt`, `Claude.md` trừ khi được chủ dự án cho phép. Kiểm tra chính sách artifact đang có trước khi thay đổi ignore/tracking. Giữ CRLF của file nguồn hiện có.

## Cloudflare: chỉ chủ dự án triển khai

Tuyệt đối không tự deploy lên https://motdoi.site, không chạy lệnh deploy production, không thay đổi DNS/tên miền/Pages project/database production. Chủ dự án tự upload bằng Dashboard. ZIP phải hỗ trợ Direct Upload, giữ `_worker.js`, `_routes.json`, `_headers` và tài nguyên liên quan. ZIP không chứa binding hoặc dữ liệu D1: cần kiểm tra binding `REVIEWS_DB` ở Pages và báo riêng những phần chưa kiểm chứng. Không tuyên bố API hoạt động production khi chưa kiểm chứng cấu hình thực tế.

Chỉ đánh dấu production-ready khi hoàn tất phạm vi, test bắt buộc đạt, không có lỗi nghiêm trọng mới, bản lưu cũ tương thích, build và ZIP đạt. Regression đầy đủ chưa xong thì chỉ đánh dấu Preview/chưa nghiệm thu đầy đủ. Công việc chỉ kiểm thử không cần commit rỗng nhưng vẫn build/đóng gói khi đủ điều kiện.

## Mẫu báo cáo bắt buộc

### Một Đời — Hoàn thành [Tên giai đoạn]

**Mã nguồn**
- Nhánh Git:
- Commit mới nhất:
- Các file đã sửa:
- Chức năng đã hoàn thành:

**Kiểm thử**
- Smoke test:
- Test chuyên đề:
- Tương thích bản lưu:
- Regression:
- Lỗi còn tồn tại:

**GitHub**
- Commit: thành công/thất bại/không có thay đổi
- Push: thành công/thất bại/chưa thực hiện
- Tên remote và nhánh đã push:

**Cloudflare build**
- Production build: PASS/FAIL
- Thư mục dist:
- File dist.zip:
- Tổng số file:
- Kích thước ZIP:
- Kiểm tra nội dung ZIP:
- API/Worker/D1 có yêu cầu riêng hay không:
- Sẵn sàng upload Production: CÓ/CHƯA

**Khôi phục**
- Commit hoặc tag của phiên bản trước:
- Hướng dẫn quay lại nếu bản mới có lỗi:

Không báo thành công nếu chưa thực hiện thật. Nếu chưa hoàn tất, ghi rõ trạng thái đang nghiệm thu thay vì dùng tiêu đề Hoàn thành.

## Nhật ký người chơi từ GĐ3 trở đi

Áp dụng GĐ3–GĐ6 và 25 hệ thống chuyên sâu: sau mỗi nâng cấp hoàn thành, viết nhật ký tiếng Việt dễ hiểu, thân thiện với người chơi; tách báo cáo kỹ thuật khỏi nội dung công bố. Đặt mục mới nhất trước, giữ nguyên lịch sử. Mỗi mục mới ghi phiên bản, thời điểm có múi giờ và trạng thái: bản đóng gói chưa phải đã phát hành. Chỉ ghi ngày phát hành thực tế khi chủ dự án xác nhận upload. Đồng bộ docs/update-extra.json và public/data/updates.json; xác minh dữ liệu và HTML trong dist/ZIP, giao diện điện thoại/máy tính. Nhật ký tĩnh không dùng D1; không sửa database Production để công bố.
