# Nghiệm thu GĐ2.5 tại Codex — 26/10/2026

Trạng thái: nghiệm thu mã nguồn/kiểm thử GĐ2.5 đã đạt bằng các nhóm rời nhau. Không bắt đầu GĐ3, không deploy website. Gói triển khai được xác minh cục bộ; cấu hình D1 và hành vi production thực tế chưa được truy cập/kiểm chứng.

## Phạm vi và mã nguồn

- Bàn giao tại `2ab504d`, nhánh `gd2-5-regression-fixes`; mã gameplay vẫn giống `a0721a5`. Codex chỉ sửa kiểm thử và quy trình công cụ/tài liệu.
- Bổ sung quy trình trong AGENTS.md, lệnh package:cloudflare và hướng dẫn đóng gói. Không thay đổi gameplay.
- `origin` trỏ tới https://github.com/mercyx03/motdoi.git; connector xác nhận repository private và quyền push. Git dry-run thành công; commit quy trình `8adb524` đã push, remote ref được đọc lại khớp SHA. Không đổi visibility, merge main hay force push. Không có workflow .github trong cây mã; chủ dự án cho biết dùng Pages Direct Upload thủ công. Chưa truy cập cấu hình tích hợp Cloudflare thực tế.
- Giữ nguyên audit-world-520.json, .local-state-review.txt và Claude.md, không stage/commit.

## Kiểm tra đã đạt

- Cú pháp: 281 file JavaScript cấp đầu của public/js, tests và tools.
- Smoke 11/11; tương thích 60 fixture từ 10 phiên bản: 10/10 ca; save-safety 10/10; NPC 14/14.
- regression-fixes: 8/8 ca, 0 thất bại, 0 timeout.
- Hardcore isolation: 12 đời thường giống từng byte khi có/không life97/life98.
- continuity101: 361 kiểm tra; business137: 79; family830: 3.970 tương tác, 40 drama, đạt.
- Regression mục 68 chạy riêng: 19 kiểm tra, 0 lỗi.
- Regression 0–4: 8.707 kiểm tra, 0 lỗi; 5b: 113 kiểm tra, 0 lỗi.
- Build mới: 28 file, 4 game bundles; loading test gồm 8 đời nguồn/bản nén giống nhau, hash/tài nguyên/cú pháp/font/SEO/cache đạt. Admin catalogue kiểm từ chối anonymous/member/client role và xác nhận quyền admin phía server đạt với D1 trong bộ nhớ.
- ZIP mới đọc lại toàn bộ 28 entry, so tên và SHA-256 với dist; có index.html gốc, .well-known, Worker và cấu hình routes/headers. Xem CLOUDFLARE-PACKAGING.md.

## Regression đã hoàn tất

Không dùng kết quả a64130d thay cho nghiệm thu mã cuối. Danh sách DEC lấy từ registry mã cuối, đủ 1.298 ID: ban đầu nhóm 130 ID, phần đuôi được tách nhóm 32 ID và menu nặng chạy riêng. Tổng 15 nhóm hoàn tất không chồng lấn, phủ đủ danh sách ID. Chạy đủ phương án và 4 lần lặp như mục 9 gốc. Các mục khác chạy riêng qua regression-shard.js; 5b được chọn riêng vì không thuộc dải số.

- **76 mục ngoài mục 9: đạt**, gồm đầy đủ 0–8, 5b và 10–75. Mục 16/30 được chạy lại sau sửa; không tính lần lỗi ban đầu là đạt.
- **Mục 9: 5.250.739 lần kiểm tra đạt, 0 lỗi**, 366.977 lượt chọn; 903/1.298 tình huống có phương án thực sự được thực thi. Các ID còn lại theo điều kiện/ngoại lệ có sẵn trong bộ test, không được hiểu là đã thực thi mọi lựa chọn của cả 1.298 tình huống.
- Mục 16 sau sửa đạt hai lần cùng kết quả 195,0 lựa chọn/đời, giữ nguyên 300 + 200 đời và trần 200. Bốn lần giờ thật trước sửa: 201,1 (lỗi), 197,4 (đạt), 194,8 (đạt), 201,6 (lỗi). Cùng đồng hồ cố định: mã trước 195,2; mã cuối 195,0.
- Mục 30 sau sửa đạt 29 kiểm tra. Trần 4 cũ mâu thuẫn khai báo brand105_offer max:12/cd:2 có sẵn trước GĐ2.5. Chỉ sự kiện này dùng trần 12, kèm assertion cấu hình; mọi sự kiện khác giữ trần 4. Phép cố ý tăng bộ đếm lên 26 bị bắt đúng mong đợi.
- Kiểm tra AI của mục 9 nay dùng selectedIds, tránh kiểm lại toàn registry ở mỗi shard. Không lọc ID thì selectedIds vẫn là toàn bộ registry. Các nhóm trước tối ưu đã kiểm thừa AI toàn registry và đều đạt; nhóm cuối được xác minh với bộ lọc mới. Không bỏ loại assertion hoặc giảm bốn lần lặp phương án.
- Có log tiến độ tùy chọn MOTDOI_DEC_PROGRESS=1 (ID) hoặc =2 (khuôn/phương án/lần lặp). Lượt familyProfiles138 riêng có 67 khuôn, 9.264 lượt chọn và 133.146 kiểm tra đạt.

Thử đầu mục 5 vượt thời hạn 300 giây, không có kết luận đạt/thất bại gameplay. Mã thực tế tạo 3.000 đời VN + 300 VN63 + 3.000 thế giới, tổng **6.300 đời**; mô tả 3.300 đời trong tài liệu cũ chưa đầy đủ. Lần chạy riêng có thời hạn dài hơn được dùng để nghiệm thu. Nhóm 6–8 ban đầu bị dừng khi chuyển sang từng mục; không tính là đạt.

Nhóm đuôi mục 9 từng vượt 600 giây; nhóm 32/18 ID cũng có lần vượt 300 giây. Chúng không được tính là đạt; kết quả cuối dùng các nhóm nhỏ hơn đã hoàn tất. Log tạm ở `.cache/gd25-codex/` (ignore); `docs/gd25-codex-results.json` lưu kết quả cuối, hash manifest ID, hash nguồn test, số liệu baseline/hiệu năng và cả lỗi/timeout ban đầu để đối chiếu.

## Baseline 400 đời: pre-gd2-5 → mã cuối

Chạy tools/baseline.js --lives 400 trên hai bộ mã cùng seed và đồng hồ cố định, không dùng --save. Mã cũ được trích bằng git archive vào cache, không chuyển nhánh.

| Chỉ số | Trước | Mã cuối |
|---|---:|---:|
| Tuổi mất trung bình | 74,13 | 73,97 |
| Sống tới 50 tuổi | 88,0% | 88,5% |
| Có con trong số sống tới 50 | 26,1% | 25,7% |
| Từng có bạn đời trong số sống tới 50 | 96,0% | 95,2% |
| Có bằng đại học VN, sống tới 25 | 11,0% | 11,7% |
| Câu nhật ký lặp mỗi đời | 29,6 | 27,7 |
| Bản lưu trung vị | 147,1 KB | 147,2 KB |
| Số quyết định đầu/cuối năm | 2,08 / 0,35 | 2,08 / 0,35 |

Thời gian script ghi nhận: 82,3 → 71,0 giây; thời gian thực ngoài tiến trình: 86,062 → 71,379 giây. Các tác vụ khác chạy đồng thời nên đây là số đo tham khảo, chưa đủ kết luận hiệu năng. Baseline chỉ báo chênh lệch, không phải test pass/fail cân bằng gameplay.

## Đối chứng hiệu năng

Không thay đổi mã game để đo. Giữ toàn bộ số đo trong gd25-codex-results.json:

1. Ba lượt 60 đời mỗi phiên bản trong cùng tiến trình: trung vị thô tăng 14,63%, nhưng thời gian pre dao động 7,045–11,848 giây; không dùng để kết luận.
2. Tiến trình mới cho từng lượt, warm-up 20 đời, GC trước đo, 120 đời/lượt: cùng mã pre dao động 12,425–23,706 giây; current 11,277–23,904 giây. Trung vị chuẩn hóa thô cho chênh lệch +48,41% wall / +41,30% CPU nhưng điều kiện giữa các lượt thay đổi mạnh; không đủ để quy thành hồi quy mã nguồn.
3. Phép đối chứng cuối giảm nhiễu bằng cách warm-up cả hai phiên bản 60 đời, xen kẽ khối 10 đời trong cùng tiến trình, đảo thứ tự AB/BA giữa các khối, GC ngoài khoảng đo, lặp 3 lượt × 120 đời mỗi phiên bản. Không chạy build/regression khác đồng thời. Cùng seed/đồng hồ; chuẩn hóa theo số năm thực sự mô phỏng.

| Lượt | Chênh lệch wall/năm | Chênh lệch CPU/năm |
|---|---:|---:|
| 1 | +0,02% | +0,60% |
| 2 | +0,59% | +0,74% |
| 3 | +1,52% | +1,73% |

Trên mẫu đối chứng xen kẽ không thấy chậm đi đáng kể (trung vị +0,59% wall/năm, +0,74% CPU/năm). Đây là đo mô phỏng cục bộ, không thay thế profiling toàn bộ menu/UI hoặc kiểm chứng hiệu năng thiết bị người chơi. Các phép đo nhiễu trước đó được giữ nguyên, không xóa hoặc thay bằng kết quả thuận lợi.

## File thay đổi và phạm vi

- AGENTS.md; package.json; tools/package-cloudflare.ps1; docs/CLOUDFLARE-PACKAGING.md: quy trình tự commit/push và đóng gói, giữ quyền deploy cho chủ dự án.
- tests/regression.js: C1/C2, lọc AI theo shard và log tiến độ tùy chọn; không giảm số đời, số lần thử phương án hoặc đổi gameplay.
- docs/HANDOFF-CLAUDE-TO-CODEX.md; docs/REGRESSION-FIXES-GD2.5.md; docs/TESTING-GD0.md; tài liệu này; docs/gd25-codex-results.json: cập nhật nghiệm thu, số lượng mẫu thực tế và bằng chứng.
- docs/BACKLOG.md: điều kiện lập di chúc theo hoàn cảnh, chưa triển khai.
- dist.zip: thay bản cũ bằng ZIP mới đã xác minh; dist tiếp tục được ignore như trước. Không đổi chính sách tracking artifact.

Mã trong public không thay đổi so với a0721a5. Ba file riêng không được stage/commit và hash giữ nguyên trong suốt lượt làm việc.

## Giới hạn và quyết định của chủ dự án

Bản đóng gói cuối: 28 file; dist.zip **2.302.166 byte**, SHA-256 `f936f559d2cc1b689ebcd16bf7b4be58a983cdacbcc0392c0d81624e27e4751f`. Build, loading, API admin và kiểm tra tên/hash toàn bộ entry ZIP đều đạt. index.html ở gốc, đường dẫn ZIP dùng `/`, có file dấu chấm và Worker/routes/headers. Gói sẵn sàng để chủ dự án kiểm tra/upload thủ công; không tuyên bố API production đã được kiểm chứng. Cần xác minh REVIEWS_DB của Pages trước khi đánh dấu toàn bộ môi trường Production đã sẵn sàng.

Chủ dự án đã xác nhận trong chat ngày 26/10/2026: binding REVIEWS_DB đang trỏ đúng database hiện có. Vì vậy **sẵn sàng upload Production: CÓ** theo nghiệm thu cục bộ và xác nhận cấu hình của chủ dự án. Codex không trực tiếp đọc cấu hình Cloudflare, không gọi API production để kiểm chứng và không deploy. Giữ nguyên database/binding khi upload.

- Bản lưu thật và kiểm thử trình duyệt chưa được kiểm chứng trong lượt này.
- life.id còn phụ thuộc giờ thật/ngẫu nhiên, regression thống kê có thể dao động; không đổi cấu trúc ID trong GĐ2.5.
- Headless vẫn bỏ qua wrapper E.resolve; bản sửa tái hợp dùng hook năm, không đổi kiến trúc chung.
- Tỷ lệ AI có con thấp vẫn là hạng mục gameplay sau này.
- Chủ dự án chọn giữ nguyên phạm vi nghiệm thu di_chuc70 hiện tại; thiết kế điều kiện lập di chúc theo hoàn cảnh là hạng mục riêng trong BACKLOG.md, chưa triển khai.
- ZIP hỗ trợ hình thức Direct Upload có _worker.js theo tài liệu Cloudflare. Chủ dự án đã xác nhận binding REVIEWS_DB đúng database hiện hữu; cấu hình này không nằm trong ZIP. Codex không chạy migration/ghi database production, không truy cập Dashboard, không tuyên bố đã kiểm thử API production.
