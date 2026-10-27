# Một Đời — GĐ6: kiểm thử tích hợp, ổn định gameplay và chuẩn bị phát hành

Ngày 26/10/2026, Claude Code. Nhánh `gd6-integration-release` tạo từ `681e10f` (GĐ5). Trạng thái cuối: **NGHIỆM THU TOÀN DIỆN HOÀN THÀNH, SẴN SÀNG CHO PHÁT HÀNH** (chi tiết và giới hạn ở mục 5).

## 1. Lỗi tích hợp tìm thấy và đã sửa

| Lỗi | Phát hiện bằng | Có từ | Sửa |
|---|---|---|---|
| Chế độ Tự động đứng chờ mãi: sự kiện hệ thống (thời tiết `weather125`, người đòi nợ `collectors140`, chuyển nơi ở `localLife138`, khoảnh khắc với con `moment141`, đám cưới của con `childWedding129`, con chia sẻ chuyện riêng `comeOut130`, kết thúc du học `abroad107_finish`, các sự kiện `C.event`) bị gắn cờ "người chơi tự mở" | Hành trình trình duyệt (kẹt ở 5 tuổi, rồi 15 tuổi), sau đó quét 120 đời | trước GĐ3 (life107–141) | Các hàm xếp hàng nhận `{manual:false}` cho sự kiện hệ thống; bản lưu cũ còn sự kiện bị gắn nhầm được gỡ cờ khi tải; quét lại: 0 |
| Bước nối tiếp của lựa chọn do AI chốt cũng bị gắn "tự mở" (ví dụ nguyện vọng lớp 10, bầu cử, mua nhà) | Quét 120 đời | trước GĐ3 | `app.js`: AI vừa chọn thì các bước nối tiếp để AI làm tiếp; người chơi tự bấm thì giữ như cũ |
| Bật/tắt Tự động hoặc "Chỉ ngã rẽ lớn" khi đang mở lựa chọn không có tác dụng (bật thì đứng chờ, tắt thì AI vẫn chọn) | Trình duyệt | trước GĐ3 | `reapplyDecisionMode()` hiện lại lựa chọn theo chế độ mới |
| `familyObjection130` (phản đối, không tổ chức cưới) xuất hiện với vợ chồng đã cưới, nhiều cặp > 20 năm | Thống kê 600 đời | lộ ra từ GĐ5 khi mở lại cảnh | Chỉ với cặp chưa cưới; test cũ dựng cảnh với cặp đã cưới được sửa theo |
| GĐ5 bọc `ev.run` của mọi sự kiện kể chuyện → 2 bộ test tra cứu sự kiện theo mã nguồn hỏng (`update457`, `update553`) | 77 bộ test module | GĐ5 | Bộ lọc nhật ký đặt trong vòng gọi sự kiện của engine; chặn du lịch qua điều kiện `c`, không bọc `run` |
| GĐ5 ghi lịch sử nhịp ngay cả khi lựa chọn không có tác dụng → "chọn phương án không hợp lệ thì không đổi gì" bị vi phạm (`update4100`) | 77 bộ test module | GĐ5 | Chỉ ghi khi lựa chọn thực sự thay đổi trạng thái |
| `community` cấm mọi số phiên bản trong nhật ký, mâu thuẫn quy định ghi phiên bản từ GĐ3 | 77 bộ test module | GĐ3 | Test cho phép phiên bản ở trường `version`, vẫn cấm trong tiêu đề/nội dung |
| Crash "Cannot read properties of null (reading name)": lựa chọn chuỗi hôn nhân GĐ4 đã hẹn vẫn hiện sau khi bạn đời không còn (hook năm chưa kịp khép chuỗi) | Regression mục 5 (lượt 2) | GĐ4 | Điều kiện hủy chuỗi được kiểm cả trong bước hợp lệ của lựa chọn |
| Cờ học bổng lệch với điểm thi: thi lại tốt nghiệp (`thi_lai_tn`) hoặc điểm tính khi nộp nguyện vọng ≥ 27 không ghi học bổng | Regression mục 19 (lượt 2) | trước GĐ3, lộ ra khi đường chơi đổi | Cùng quy tắc với lượt thi chính ở cả ba chỗ |
| Quy tắc GĐ5 "AI không thêm hoạt động vào năm bận" chặn luôn việc game tự chọn giúp người chơi bỏ trống năm trước ở chế độ thủ công (109/2000, ngưỡng > 160) | Regression mục 23 (lượt 2); chạy lại trên GĐ5 cũng hỏng, GĐ4 đạt | GĐ5 | Quy tắc chỉ áp ở chế độ tự động |
| Nhóm chủ đề "đổi nghề" của GĐ5 gộp gợi ý đổi nghề với quyết định đổi nghề thật → số đời đổi hướng sự nghiệp 22–26/400 (GĐ4) còn 9–15/400 | Regression mục 21 (lượt 3: 8/400, ngưỡng > 8); đo lại 2 × 400 đời trên GĐ4 / GĐ5 / GĐ6 | GĐ5 | Bỏ nhóm này; đo lại 16–22/400 |
| `tests/update520.js` ghi đè file riêng `audit-world-520.json` ở gốc dự án mỗi lần chạy | Kiểm hash ba file riêng trước khi commit | trước GĐ3 | Khôi phục đúng nội dung gốc từ bản sao bảo vệ (hash `1f3526dd…` khớp lúc bắt đầu GĐ6); test giờ ghi vào `.cache/` |

Ngoài ra: `tools/release-update.js` ghi được nhiều mục cùng một thời điểm thực tế (`--all-packaged`), kiểm trên bản sao trước, một ID sai thì không ghi gì.

## 2. Kiểm thử

### Bộ nhanh và chuyên đề (mã cuối)

Smoke 11/11 (1 cảnh báo cũ về `life.id` theo giờ thật) · saves-compat 10/10 · save-safety 10/10 · npc-identity 14/14 · context-weighting 4.658 · chains-gd4 191 · pace-gd5 183 · integration-gd6 30 (mới) · regression-fixes 8/8 · hardcore-isolation đạt · update-gd3/4/5/6, update-release 161.

**77/77 bộ test module** trong `package.json` đạt (khoảng 303.000 kiểm tra theo số các bộ tự báo). Lượt đầu (mã GĐ5): 71/76 đạt, 5 bộ hỏng nêu ở mục 1 (bộ thứ 77 bị script bỏ sót vì thiếu dòng cuối, đã chạy riêng và đạt).

### Regression đầy đủ

Ba lượt đầy đủ trên nhánh GĐ6 (92 nhóm: 76 mục + 5b, mục 9 chia 16 nhóm ID). Mỗi lượt có hash mã `public/` lúc bắt đầu; nhóm bị dừng / dở không tính.

- Lượt 1 (mã GĐ5 + sửa đầu): dừng chủ động khi phát hiện lỗi Auto; không dùng kết quả.
- Lượt 2: 89/92 đạt; 3 nhóm hỏng (5, 19, 23) → 3 lỗi ở mục 1, đã sửa.
- Lượt 3 (hash `6d6210b0…`): **91/92 đạt, 5.817.508 kiểm tra**; mục 21 hỏng sát ngưỡng (8/400) → lỗi nhóm "đổi nghề" GĐ5, đã sửa.
- Lượt 4 (mã cuối, hash `160a0c81…`, không đổi tới lúc build): chạy lại 15 nhóm chịu ảnh hưởng của bản sửa cuối (21, 5, 6, 10, 16, 17, 27, 40, 44, 49, 61, 66, 70, 73, 75): **15/15 đạt, 271.250 kiểm tra**.

Trạng thái cuối mỗi nhóm (lấy lượt mới nhất): **92/92 PASS, 0 FAIL, 0 chưa hoàn thành; 5.818.391 kiểm tra**. 77 nhóm còn lại đạt ở lượt 3 trên mã chỉ khác mã cuối ở một luật nhóm chủ đề (bỏ nhóm "đổi nghề"); các nhóm mô phỏng cả đời / nghề nghiệp đã chạy lại.

Mục 9: đủ 1.313 tình huống (manifest SHA-256 `3e022cf6…`), 5.221.598 kiểm tra, 364.697 lượt chọn, **914/1.313 tình huống có phương án thực sự được thực thi**; còn lại là ngoại lệ hợp lệ của bộ test (tình huống theo nghề, menu, nối tiếp cần bối cảnh riêng — đã có test chuyên đề như followups840, chains-gd4) chứ không phải đã thực thi mọi lựa chọn.

| Mục | Kết quả | Kiểm tra | Bằng chứng |
|---|---|---:|---|
| 5 | PASS | 10.810 | mã cuối (lượt 4) |
| 5b | PASS | 113 | lượt 3 |
| 6 | PASS | 244.584 | mã cuối (lượt 4) |
| 16 | PASS | 9 | mã cuối (lượt 4) |
| 30 | PASS | 29 | lượt 3 |
| 60 | PASS | 26 | lượt 3 |
| 68 | PASS | 19 | lượt 3 |
| 21 | PASS | 91 | mã cuối (lượt 4) |
| 19 | PASS | 187.884 | lượt 3 |
| 23 | PASS | 27 | lượt 3 |

### Trình duyệt (máy chủ dev, mã nguồn cuối; bản build kiểm riêng ở mục 4)

- Tạo đời mới, chơi thủ công 0–5 tuổi; tải lại trang → "Tiếp tục sống" đúng tên, tuổi, nhật ký.
- Auto 16× từ 5 tới 36 tuổi: học nghề, đi làm, đổi nghề, hẹn hò, một chuỗi GĐ4 (bạn quay lại giúp); không đứng chờ sau khi sửa.
- Tắt Auto giữa chừng, chọn tay 6 lựa chọn (hẹn hò, gia đình hai bên, mua nhà, xác nhận chi lớn…): không nhảy tuổi, không có ghi chú AI.
- Lưu/tải ở 36 tuổi: tuổi, số lựa chọn, người yêu, 238 dòng nhật ký giữ nguyên.
- Điện thoại 375 px: màn hình chơi và hộp lựa chọn, trang Cập nhật (95 mục, 4 mục mới "chưa phát hành") không tràn ngang; không lỗi console.
- API cục bộ qua Worker (`/api/comments`, `/api/reviews`, `/api/market`) trả về 200 với database cục bộ.
- Chưa làm trên trình duyệt: ly hôn / tái hôn / sinh con / NPC qua đời / người chơi qua đời (nhân vật chạy thử chưa tới các mốc này); các trường hợp này có trong regression và mô phỏng.

### Bản lưu

- 60 bản lưu cũ (10 phiên bản) chơi tiếp trên mã mới (saves-compat, chains-gd4, pace-gd5, integration-gd6).
- Lưu/tải giữa đời ở 38 tuổi rồi chơi 12 năm: giống từng byte với không tải lại (8 đời, có dữ liệu GĐ4/GĐ5).
- Chiều ngược lại: 29 bản lưu tạo bằng mã GĐ6 (45 tuổi, đều có dữ liệu GĐ4/GĐ5) mở và chơi tiếp 5 năm trên mã GĐ2.5 `e9fd613` (bản Production hiện tại) không lỗi → rollback an toàn cho bản lưu.

## 3. Thống kê gameplay (600 đời mỗi bản, cùng seed; sai số chuẩn ~2 điểm %; GĐ6 = mã cuối)

| Chỉ số | GĐ4 `b0279da` | GĐ5 `681e10f` | GĐ6 |
|---|---:|---:|---:|
| Cưới trước 30 tuổi (sống tới 30) | 23,9% | 28,2% | 25,9% |
| Có con (sống tới 50) | 28,0% | 26,8% | 29,8% |
| Tuổi cưới / con đầu (trung vị) | 32 / 34 | 31 / 33 | 31 / 33 |
| Lựa chọn mỗi năm | 2,75 | 2,64 | 2,66 |
| Năm có ≥ 2 biến cố lớn | — | 3,7% | 3,8% |
| Tuổi mất trung bình | 71,5 | 72,0 | 72,2 |
| Tài sản cuối đời (lần thu nhập cơ sở, trung vị) | 3,24 | 4,49 | 4,60 |
| Năm có nợ | 22,8% | 24,9% | 24,4% |
| Cảnh hôn nhân life130 | 0 | 1.935 | 1.854 |
| Cảnh / năm hôn nhân · tối đa / đời · cùng cảnh tối đa | — | 0,19 · 15 · 4 | 0,19 · 13 · 4 |
| Cảnh hôn nhân cách < 3 năm · sai trạng thái | — | 0 · 0 | 0 · 0 |
| `familyObjection130` | 0 | 685 | 324 (chỉ cặp chưa cưới) |
| `status129` · `map_mo101` · `casual101` · `public_scandal101` | 0 | 377 · 478 · 261 · 45 | 379 · 501 · 287 · 35 |

Đổi hướng sự nghiệp (2 × 400 đời, đến 60 tuổi): GĐ4 22–26, GĐ5 13–15, GĐ6 trước sửa 9–14, GĐ6 cuối 16–22.

Chênh lệch tỷ lệ cưới và có con giữa ba bản đều trong khoảng 1–2 sai số chuẩn; không sửa gameplay vì các chênh lệch này. 0,19 cảnh hôn nhân mỗi năm hôn nhân ≈ một cảnh mỗi 5 năm: không dày; không có độc thân bị coi là đã cưới, không có cảnh với người đã mất. Năm "biến cố" không đo được ở GĐ4 vì bộ phân loại có từ GĐ5.

Hiệu năng: mô phỏng headless cùng mức GĐ5 (GĐ5 so với GĐ4: −12%, −0,1%, −9% ms/năm); các sửa GĐ6 không thêm vòng lặp mới.

## 4. Bản build

- `npm run package:cloudflare`: **PASS** trên mã cuối. `dist` và `dist.zip` tại `C:/Users/bluef/Downloads/motdoi/motdoi/motdoi/motdoi-main`. **28 file**, ZIP **2.328.491 byte** (giải nén 6.424.273 byte), SHA-256 `6ee250ae3e9ec6c9bc15823da2d4aac30c937403be55ca735bd2749ba41e6443`.
- Đọc lại ZIP: tên và SHA-256 của 28 entry khớp `dist`; `index.html` ở gốc; có `_worker.js`, `_routes.json` (`/api/market`, `/api/reviews`, `/api/account`, `/api/comments`), `_headers`, `.well-known/ai-catalog.json`, 4 gói game, font, ảnh. Loading test: 8 đời nguồn / bản nén giống nhau; admin catalogue 1.522 mục với D1 trong bộ nhớ.
- Nhật ký trong gói: 95 mục; GĐ6, GĐ5, GĐ4, GĐ3 `packaged`, 91 mục cũ giữ nguyên (update-gd3/4/5/6, update-release 161 kiểm tra).
- Trình duyệt trên bản build: đời mới chơi Auto tới 9 tuổi, không lỗi console; trang Cập nhật đúng thứ tự và trạng thái.
- Worker cần D1 binding `REVIEWS_DB` ở Pages (không nằm trong ZIP). Tôi không truy cập Cloudflare Production; chủ dự án đã xác nhận binding đúng ở GĐ2.5 — cần xem lại trước khi upload (RELEASE-GD6.md).
- Quét 477 file được Git theo dõi (repo public): không có token, khóa, mật khẩu thật hay email cá nhân; chỉ mật khẩu giả cho test D1 trong bộ nhớ.

## 5. Kết luận

**GĐ6 — NGHIỆM THU TOÀN DIỆN HOÀN THÀNH, SẴN SÀNG CHO PHÁT HÀNH** (theo bằng chứng mục 2–4), với hai bước bắt buộc của chủ dự án trước khi upload: ghi thời điểm phát hành thực tế bằng `tools/release-update.js` rồi đóng gói lại, và xác nhận binding `REVIEWS_DB` (xem RELEASE-GD6.md).

Không còn lỗi nghiêm trọng đã biết. Giới hạn còn lại: chưa có bản lưu thật của người chơi; trên trình duyệt chưa đi qua ly hôn / tái hôn / sinh con / NPC qua đời / người chơi qua đời (có trong regression và mô phỏng); 77/92 nhóm regression đạt trên mã chỉ khác mã cuối một luật nhóm chủ đề; chưa đo hiệu năng trên thiết bị người chơi; Production API chưa được kiểm trực tiếp. Danh sách sau GĐ6 ở BACKLOG.md.

Sẵn sàng chuyển sang 25 nâng cấp gameplay chuyên sâu: nền tảng (bản lưu, NPC, xác suất, chuỗi hậu quả, nhịp sự kiện) có test chuyên đề và regression đầy đủ để bảo vệ; mỗi nâng cấp mới nên kèm test chuyên đề, chạy regression của phần bị ảnh hưởng và cập nhật nhật ký người chơi. Chưa bắt đầu nâng cấp nào.

Khôi phục: bản Production hiện tại là GĐ2.5 (`e9fd613`). Rollback bằng Dashboard → Deployments, hoặc upload lại `git show e9fd613:dist.zip`. Bản lưu tạo ở GĐ6 mở được trên GĐ2.5 (29/29).
