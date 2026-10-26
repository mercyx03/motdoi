# Một Đời — GĐ5: HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN

Ngày 26/10/2026, Claude Code. Nhánh `gd5-event-balancing` tạo từ `b0279da` (GĐ4). Chỉ chạy test chuyên đề, smoke, bản lưu, NPC và regression của phần bị ảnh hưởng; regression đầy đủ để GĐ6. Thiết kế: `docs/PACE-GD5.md`.

## File thay đổi

- Mới: `public/js/life145.js`, `tests/pace-gd5.js`, `tests/update-gd5.js`, `tools/pace-stats.js`, `docs/PACE-GD5.md`, báo cáo này.
- Sửa: `public/js/engine.js` (điểm kiểm tra trong `add`, 3 dòng), `public/js/app.js` (nhịp tự động), `public/js/life130.js`, `public/js/life129.js`, `public/js/life101.js` (điều kiện hợp lệ, giới hạn lặp), `public/index.html`, `tests/update-gd4.js`, nhật ký (`docs/update-extra.json`, `public/data/updates.json`, `CHANGELOG.md`), `docs/BACKLOG.md`, `docs/SAVE-FORMAT.md`, `package.json`.

## Trước / sau (200 đời, cùng seed, `tools/pace-stats.js`)

| Chỉ số | GĐ4 `b0279da` | GĐ5 |
|---|---:|---:|
| Lựa chọn mỗi năm | 2,74 | 2,64 |
| Năm có ≥ 5 lựa chọn | 9,2% | 7,9% |
| Năm có ≥ 2 biến cố lớn | 4,7% | 3,8% |
| Năm có ≥ 3 biến cố lớn | 0,5% | 0,4% |
| Cửa sổ 3 năm có ≥ 3 biến cố | 8,4% | 6,4% |
| Tình huống gần trùng / đời | 0,29 | 0,21 |
| Tình huống khác nhau / đời | 109,9 | 110,7 |
| Cảnh hôn nhân life130 (200 đời) | 0 | 836 |
| Lựa chọn chuỗi GĐ4 (200 đời) | 233 | 231 |

Số ID gặp ≥ 3 lần mỗi đời gần như không đổi (16,5 → 16,7): chủ yếu là chuyện có chu kỳ hợp lý (hỏi cưới, tìm việc, thời tiết, bầu cử 5 năm/lần), không bị cắt. Dòng nhật ký lặp toàn đời gần như không đổi vì phần lớn là lương/thưởng Tết hằng năm (giữ nguyên có chủ đích); câu kể đời thường giống hệt không còn lặp trong 6 năm (kiểm trong test).

Baseline 300 đời (`tools/baseline.js`): tuổi mất 73,45 → 73,92; có bạn đời trong số sống tới 50: 95,8% → 97,7%; lựa chọn đầu năm 2,10 → 2,09; bản lưu trung vị 148,7 → 149,5 KB. Có con trong số sống tới 50: đo riêng 2 mẫu (793 / 795 đời) 34,8% so với 36,7% khi tắt điều tiết — chênh 1,9 điểm, nhỏ hơn sai số mẫu (~2,4). Phiên bản đầu tiên ghép `vn_giuc_cuoi` vào nhóm chủ đề làm giảm ~5 điểm và đã được sửa. Tỷ lệ có bằng đại học VN không đổi (12,7–13,0%).

Chế độ tự động: số lựa chọn/năm −3,5%, năm dày đặc −14%; trên giao diện, 82% lựa chọn là đời thường và được chốt nhanh hơn (1,75 → 1,15 giây). Ước tính thời gian chờ mỗi năm ~4,8 → ~3,3 giây; đây là ước tính từ số liệu, chưa bấm giờ trên trình duyệt.

## Kiểm thử đã chạy trên mã GĐ5 (đều đạt)

| Nhóm | Kết quả |
|---|---|
| `tests/pace-gd5.js` | 181 kiểm tra: 11 tình huống sửa lỗi xuất hiện khi hợp lệ và bị chặn khi không (đang hẹn hò, bạn đời đã mất, dưới 18, dữ liệu cũ, người khác, đã chọn); xuất hiện ở cả thủ công và tự động, cách nhau ≥ 3 năm, ≤ 1 cảnh/năm, < 0,45 cảnh/năm hôn nhân; điều tiết biến cố (không có biến cố thứ ba, thứ hai còn ~35%), AI không thêm vào năm bận; nhóm chủ đề, gần trùng, `rep` được giữ; bị loại không mất cooldown, năm vẫn có tình huống khác; GĐ3 50 trigger và hệ số; GĐ4 hậu quả đã hẹn không bị chặn, ≤ 1 lựa chọn chuỗi/năm; lọc nhật ký; du lịch; lịch sử ≤ 24; migrate dữ liệu hỏng; 60 bản lưu cũ chơi tiếp 5 năm; 30 đời mô phỏng |
| `tests/chains-gd4.js` | 193 kiểm tra (số thay đổi theo nhánh xác suất đi qua) |
| Smoke | 11/11 (1 cảnh báo cũ về life.id). Lần chạy giữa chừng có 1 lỗi "mẫu có cả bạn đời và con cái" — chính là tín hiệu dẫn tới phát hiện và sửa nhóm `vn_giuc_cuoi`; sau sửa đạt |
| Bản lưu / NPC | saves-compat 10/10, save-safety 10/10, npc-identity 14/14 |
| GĐ3 | context-weighting 4.658 đạt |
| Module liên quan | family130 66, family129 65, followups840 1.473, relationships841 336, hardcore-isolation đạt |
| Regression liên quan | mục 7: 30 đạt; mục 16 (nhịp lựa chọn AI): 187,0 lựa chọn/đời ≤ 200, 9 đạt; mục 30 (chống lặp): 29 đạt sau khi hạ `max` (lần đầu bắt đúng `marriageMoney130` ×5); mục 9 lọc 14 tình huống bị ảnh hưởng: 52.046 đạt, 0 lỗi |
| Nhật ký | update-gd5, update-gd4, update-gd3, update-release đạt |

## Hiệu năng và bản lưu

3 lượt × 60 đời xen kẽ GĐ4/GĐ5: ms/năm **−12,3%, −0,1%, −9,4%** (ít bước du lịch hơn; không chậm đi). `flags.pace145` tối đa 24 dòng; không tăng `SAVE_SCHEMA`; bản lưu cũ mở và chơi tiếp được ở GĐ5 (60 bản lưu fixture). Mở bản lưu GĐ5 bằng mã cũ chưa được kiểm.

## Chưa kiểm chứng (GĐ6)

- Regression đầy đủ 0–75 + 5b, mục 9 đủ 1.313 tình huống; mục 6 (tỷ lệ tình huống xuất hiện tự nhiên) cần đo lại.
- Bấm giờ chế độ tự động trên trình duyệt (mới chạy thử: 10 năm / 38 giây ở 16×, 19 lựa chọn tự chốt, không lỗi); giao diện popup các cảnh vừa mở lại.
- Theo dõi tỷ lệ có con với mẫu lớn hơn (chênh 1,9 điểm chưa có ý nghĩa thống kê).
- Danh sách nhóm chủ đề mới bao phủ các cụm đã thấy trong số liệu; các cụm khác cần đo thêm.

## Build và phát hành

- `npm run package:cloudflare`: **PASS**. dist và dist.zip tại `C:/Users/bluef/Downloads/motdoi/motdoi/motdoi/motdoi-main`. 28 file, ZIP **2.319.548 byte**, SHA-256 `657260b72ba993b3805536820ffce0487eb8e98cb2f5a1ca16bf62245cf4c34c`. Tên và nội dung 28 entry khớp dist; có index.html ở gốc, `_worker.js`, `_routes.json`, `_headers`, `.well-known`. Loading 8 đời nguồn/bản nén giống nhau; admin catalogue 1.522 mục với D1 trong bộ nhớ.
- Trình duyệt (bản build): trang Cập nhật hiện mục GĐ5 đầu, GĐ4, GĐ3 sau, đều "chưa phát hành"; chế độ tự động chạy 10 năm ở 16× không lỗi console.
- Worker vẫn cần binding D1 `REVIEWS_DB` ở Pages (không nằm trong ZIP); không kiểm cấu hình Production.
- Nhật ký GĐ3, GĐ4, GĐ5 đều `packaged`. Gói là **Preview**. Nếu chủ dự án upload: chạy `node tools/release-update.js <id> --released-at <thời điểm thực tế>` cho từng mục, đóng gói lại rồi upload.
- Repository `mercyx03/motdoi` hiện **public** (API GitHub ẩn danh trả về visibility public), khác mô tả "riêng tư"; không tự đổi visibility.
- Không deploy, không merge main, không force push.

## Khôi phục

Bản trước: `b0279da` (GĐ4). Quay lại: revert commit GĐ5 hoặc checkout `b0279da` ở thư mục khác và đóng gói lại.
