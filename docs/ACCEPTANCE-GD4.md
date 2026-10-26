# Một Đời — GĐ4: HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN

Ngày 26/10/2026, Claude Code. Nhánh `gd4-multiyear-consequences` tạo từ `21bca64` (GĐ3 đã chốt, chưa nghiệm thu toàn diện). Theo chiến lược của chủ dự án: chỉ chạy test chuyên đề, smoke, bản lưu, NPC và regression của phần bị ảnh hưởng; regression đầy đủ để GĐ6.

## Phạm vi

- 8 chuỗi hậu quả nhiều năm trên sự kiện đã có: giáo dục, nghề nghiệp, kinh doanh, tài chính, gia đình, hôn nhân, bạn bè, sức khỏe. Thiết kế và bảng chuỗi: `docs/CONSEQUENCES-GD4.md`.
- Mã: `public/js/life144.js` (mới), `public/index.html` (nạp module). Không sửa engine, không tăng `SAVE_SCHEMA`.
- Test: `tests/chains-gd4.js` (mới), `tests/regression-contexts.js` (ngữ cảnh cho 15 tình huống chuỗi), `tests/update-gd4.js` (mới), `tests/update-gd3.js` (không còn giả định GĐ3 là mục đầu).
- Nhật ký: `docs/update-extra.json`, `public/data/updates.json` (mục `gd4-multiyear-consequences`, 8.5.0-gd4, packaged, releasedAt null), `CHANGELOG.md`.
- Tài liệu: `docs/CONSEQUENCES-GD4.md`, `docs/SAVE-FORMAT.md`, `docs/BACKLOG.md`, báo cáo này; `package.json` thêm `test:chains`.
- Ba file riêng (audit-world-520.json, .local-state-review.txt, Claude.md) không stage/commit.

## Kiểm thử đã chạy trên mã GĐ4

| Nhóm | Kết quả |
|---|---|
| `tests/chains-gd4.js` | **197 kiểm tra đạt**: khởi tạo đúng điều kiện (và không mở khi không đủ điều kiện), giai đoạn trong đúng khoảng thời gian, không thực thi hai lần (kể cả quyết định cũ sau khi tải lại), lưu/tải/migrate hai lần, dữ liệu hỏng, NPC trùng tên/đổi tên/đã mất, kết thúc chuỗi, qua đời, tiền & tin cậy, giới hạn 4/12, 60 bản lưu cũ chơi tiếp 6 năm, 50 trigger GĐ3, 40 đời mô phỏng. Nhánh xác suất đã đi qua: giới thiệu việc, hòa giải, bạn quay lại giúp, đau tái phát. |
| GĐ3 không đổi | 7/40 đời không chạm chuỗi giống **từng byte** khi bỏ GĐ4; `tests/context-weighting.js` 4.658 kiểm tra đạt. |
| Smoke | 11/11 (1 cảnh báo đã biết về life.id theo giờ thật) |
| Bản lưu | saves-compat 10/10; save-safety 10/10 |
| NPC | npc-identity 14/14 |
| Module liên quan | followups840 1.473; family130 66; debt140 24; relationships841 336; adult106 105; hardcore-isolation đạt |
| Regression liên quan | mục 7 (lưu/tiếp tục) 30 đạt; mục 68 (người đã mất) 19 đạt; mục 9 lọc 25 tình huống (15 chuỗi + 10 gốc/được mở lại) **44.142 đạt, 0 lỗi**, 2.780 lượt chọn, 24/25 có phương án được thực thi |
| Nhật ký | update-gd4, update-gd3, update-release 135 kiểm tra đạt (trên dist) |
| Trình duyệt | Bản build: trang Cập nhật hiện mục GĐ4 đầu, GĐ3 thứ hai, đều "chưa phát hành", không tràn ngang; trang game nạp `E.CHAIN144` (15 tình huống) và mô phỏng 6 đời trong bundle nén không lỗi console. Chưa bấm thử popup chuỗi trong giao diện chơi. |

Lỗi phát hiện trong lúc kiểm và đã sửa: lời kể giới thiệu việc thiếu tên nghề (`undefined`); ngữ cảnh test anh chị em sai cấu trúc. Lần đầu mô phỏng cho thấy chuỗi bạn bè quá dày → giới hạn mỗi loại tối đa 2 lần/đời (giáo dục 1), giảm xác suất "bạn quay lại giúp".

## Mô phỏng nhiều năm

300 đời headless (VN/thế giới, mã cuối): 252 đời có ít nhất một chuỗi, 458 lựa chọn chuỗi (≈0,02 mỗi năm sống), 0 lỗi, không vượt giới hạn. Số chuỗi: bạn bè 367, sức khỏe 63, nợ 37, hôn nhân 30, gia đình 21, nghề nghiệp 8, giáo dục 5, kinh doanh 5. Kết quả có cả tích cực, trung tính, tiêu cực — bạn bè: giúp lại 87, gắn bó 154, làm lành 42, xa cách 36, bạn mất 20; nợ: trả góp 19, trả hết 4, vỡ nợ 9, rạn quan hệ 2; gia đình: hòa giải 5, dần ấm lại 8, xa cách 7; hôn nhân: hàn gắn 26, chia tay 1; sức khỏe: hồi phục 59, mạn tính 1, đổi việc 1. Nhóm giáo dục, nghề nghiệp, kinh doanh hiếm vì sự kiện gốc vốn hiếm (đúng theo xác suất GĐ3). Trong 40 đời của test: không có đời nào có hơn một lựa chọn chuỗi trong một năm, không xử lý sau khi mất, không tạo khoản vay.

## Hiệu năng và bản lưu

Đo 3 lượt × 60 đời, cùng seed, xen kẽ thứ tự có/không GĐ4, warm-up: ms/năm thay đổi **−4,9%, −3,6%, +0,8%** → không thấy chậm đi đo được (nhiễu lớn hơn chênh lệch). Bản lưu trung vị cuối đời 152,6–155,8 KB → 155,1–156,9 KB (+0,1–1,6%, gồm cả khác biệt diễn biến). Đo headless cục bộ, chưa profiling thiết bị người chơi.

## Chưa kiểm chứng (chuyển GĐ6, xem BACKLOG.md)

- Regression đầy đủ 0–75 + 5b, mục 9 đủ 1.313 tình huống; mục 6 cần đo lại tỷ lệ tình huống xuất hiện tự nhiên.
- Popup chuỗi trong giao diện chơi thật, chế độ tự động trên trình duyệt; bản lưu thật của người chơi.
- Lỗi có từ trước: cảnh hôn nhân life130 và `familyObjection130` không bao giờ xuất hiện từ trigger; không sửa trong GĐ4 (chờ chủ dự án quyết định).

## Build và phát hành

- `npm run package:cloudflare`: **PASS**. dist và dist.zip tại `C:/Users/bluef/Downloads/motdoi/motdoi/motdoi/motdoi-main`. 28 file, ZIP **2.321.302 byte**, SHA-256 `e75f1549d8571e9971627bf0567bab54392d76a3bf227fd578696ca87c928558`. Tên và nội dung 28 entry khớp dist; có index.html ở gốc, `_worker.js`, `_routes.json`, `_headers`, `.well-known`. Loading 8 đời nguồn/bản nén giống nhau; admin catalogue 1.522 mục với D1 trong bộ nhớ.
- Worker vẫn cần binding D1 `REVIEWS_DB` ở Pages (không nằm trong ZIP); không kiểm cấu hình Production.
- Nhật ký: GĐ3 và GĐ4 đều `packaged`. Gói này là **Preview**; chưa chạy regression đầy đủ. Nếu chủ dự án quyết định upload: chạy `node tools/release-update.js <id> --released-at <thời điểm thực tế>` cho từng mục được phát hành, đóng gói lại rồi upload.
- Không deploy, không merge main, không force push.

## Khôi phục

Bản trước: `21bca64` (GĐ3). Quay lại: revert commit GĐ4 hoặc checkout `21bca64` ở thư mục khác và đóng gói lại; bản lưu có `flags.chains144` vẫn mở được ở GĐ3 (trường bị bỏ qua, lịch hẹn `ch144_*` không còn tình huống tương ứng nên bị bỏ khi đến hạn).
