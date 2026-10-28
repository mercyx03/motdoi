# Một Đời 8.9.5-actions — nghiệm thu trọng điểm

Trạng thái: HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN.

## Phạm vi

- Bỏ lựa chọn Hardcore và hai module chiến dịch khỏi danh sách tải. Bản lưu cũ chuyển sang normal, giữ tài sản và lịch sử; bỏ pending/sched `hc_*`.
- E.act không trả phí mở. Token theo lựa chọn qua menu con; thực hiện mới tính lượt. Hủy, cấu hình có bước tiếp theo và sự kiện hệ thống miễn lượt. Giữ kiểm tra giới hạn ở bước thực hiện, tránh áp dụng hiệu ứng khi hết lượt; migrate hoàn phí mở cũ đúng một lần.
- Giữ các ID quyết định cũ để tương thích, bỏ ACT gap_ban trùng lặp. Menu bạn thân chọn theo uid110, hỗ trợ người trùng tên và gọi video khi ở xa.
- Phân nhóm lớn/nhóm nhỏ/hành động có tiêu đề và đường kẻ; tách gia đình, bạn bè, tình yêu. Bộ lọc bạn đời đánh dấu phương án đã chọn, vẫn bấm đổi tiếp được.
- Lời mượn đồ chơi có ngữ cảnh bày mâm sinh nhật. Không thay nội dung lịch sử lễ hội.
- Chứng chỉ kiểm tra ngày cấp hiện tại khi sự kiện hết hạn được thực hiện; xóa cờ đến hạn cũ khi có chứng chỉ mới. JLPT/Goethe vẫn theo cơ chế không hết hạn.
- Tin bạn thân gặp chuyện dùng hỗ trợ từ xa khi khác nơi ở. Các thẻ gặp bạn cũ đã lưu và lựa chọn hẹn mai thăm viện cũng được đối chiếu khoảng cách.
- Chuyến về thăm ngắn ngày dùng chi phí đi lại hiện có, có bước xem/đặt vé và quay lại. Không gọi hàm dừng du học, chuyển định cư hay cấp bằng. Không mô phỏng cấp phép visa thực tế; người chơi được nhắc kiểm tra giấy tờ tái nhập cảnh.

## Kiểm tra

- `node tests/actions894.js`: PASS — lượt xem/thực hiện, menu lồng, hủy, reload, cap, bắt buộc miễn lượt, bạn trùng tên, khoảng cách, chuyến về thăm, chứng chỉ, chuyển save Hardcore.
- `node tests/smoke.js`: 11/11 PASS. Cảnh báo đã biết: tạo đời với giờ thật không quyết định hoàn toàn chỉ bởi seed; danh tính có Date.now/Math.random, lưu/tải giữ id.
- `node tests/saves-compat.js`: 10/10 PASS, 60 fixture từ các phiên bản cũ; không phải dữ liệu cá nhân. Cảnh báo gỡ thẻ Hardcore là chủ đích.
- `node tests/save-safety.js`: 10/10 PASS.
- `node tests/npc-identity.js`: 14/14 PASS.
- `node tests/family830.js`: PASS 3970 tương tác gia đình; `node tests/payment-ui126.js`: PASS xác nhận chi lớn.
- `node tests/regression-shard.js 13,14,28,52,72`: 498 PASS, 0 lỗi. `13,75`: 8 PASS, 0 lỗi; nhóm 75 chuyển sang kiểm tra chế độ đã bỏ, giữ bộ kiểm tra lịch sử trong nhánh dành cho cấu hình cũ.
- `node tests/hardcore-campaign.js`: chạy bộ tương thích thay cho chiến dịch đã bỏ, PASS.
- `node tests/actions894-browser.js`: Chrome 390/1280 px PASS, click đổi bộ lọc hai lần, lưu đúng, không mất lượt, đường kẻ 2px, không tràn ngang/lỗi runtime. Có thể chạy với TEST_URL trỏ bản dist.

Nguồn đối chiếu hạn IELTS: https://ielts.org/organisations/ielts-for-organisations/verifying-ielts-results — khuyến nghị hai năm từ ngày thi. Trong game tính bằng tuổi/năm, không mô phỏng ngày thi trong năm.

## Giao và khôi phục

Nhật ký mới `actions-friends-distance-895`, trạng thái packaged; chưa có xác nhận upload thực tế. Không tự deploy, sửa Pages/DNS/D1. Binding `REVIEWS_DB` Production chưa kiểm chứng.

Commit trước đợt: `8768635556d82fc4c5c4740fb1c0563240fd8440`.
Khi cần khôi phục: tạo commit revert commit đợt này, đóng gói lại và chủ dự án upload qua Dashboard; không reset/force-push lịch sử chung.

Chưa nghiệm thu: regression toàn bộ mã cuối, mẫu save thật gặp lỗi trong video, Android/iOS thật, cấu hình Cloudflare thực tế. Ghi tại GĐ6 của BACKLOG. Build/ZIP chỉ đạt khi lệnh package cuối thành công và đã đọc đối chiếu nội dung; báo cáo giao ghi kết quả thực tế.

## Bản đóng gói cuối

- `npm run package:cloudflare`: PASS. 28 file, ZIP 2.570.796 byte, SHA-256 `FB73FE6A6C3E7872287923C4841247003A07C009405271C5F8AF2C99EA8830FC`.
- Loading: 8 cuộc đời hoàn chỉnh giữa nguồn và bản nén giống nhau, hash tài nguyên/SEO/font/cache PASS. Admin catalogue 1.574 mục, quyền truy cập PASS.
- ZIP được mở lại, đối chiếu toàn bộ tên/nội dung với dist; `index.html` ở gốc, có Worker/routes/headers và `.well-known/ai-catalog.json`.
- Mục 8.9.5 đứng đầu JSON/HTML nhúng trong dist và ZIP. Chrome 390/1280 trên dist PASS; trang cập nhật cùng hai kích thước PASS tìm kiếm không dấu, nhãn packaged và không tràn ngang/lỗi runtime. Công cụ trạng thái phát hành đạt 398 kiểm tra.
- Repository GitHub `mercyx03/motdoi` công khai, tài khoản kết nối có quyền push/admin. Nhánh hiện tại `codex/life-context-upgrade`, remote origin đã đối chiếu. Không có workflow .github trong checkout; quy trình dự án là chủ dự án upload Dashboard. Không gọi lệnh deploy.
- Các lần build trước được dựng lại sau tinh chỉnh mã; chỉ ZIP cuối có hash trên là bản bàn giao. Không dùng artifact cũ để nghiệm thu.
