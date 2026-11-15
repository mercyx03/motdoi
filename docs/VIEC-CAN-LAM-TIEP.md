# Việc cần làm tiếp (chuyển máy)

Cập nhật: 2026-11-14, sau bản 9.0.2 (xem mục Trạng thái 9.0.x). Nhánh làm việc: `codex/life-context-upgrade`.

## Làm ngay khi về máy
1. Chạy `git push origin codex/life-context-upgrade` (máy ảo không push được). Commit gần nhất: `f9c701a` (8.10.79), trước đó `7344142` và `02ee4d1` (8.10.78).
2. Tự upload `dist.zip` bằng Dashboard nếu chưa upload. Không chạy lệnh deploy production, không đụng DNS/Pages/DB production.
3. Nhật ký cập nhật 8.10.78 và 8.10.79 đã đặt `released`; cần commit thay đổi này nếu chưa có.
4. Thử bằng trình duyệt thật: sống ở Anh/Úc/Singapore/Canada có việc làm, xem dòng thuế ở bảng lương; chuyển nước khi còn vay thế chấp.
5. Chạy `regression.js` đầy đủ (chưa chạy hết được ở máy ảo).

## Không commit, không xóa
`audit-world-520.json`, `.local-state-review.txt`, `Claude.md`, `public/js/healthsys919.js`, `tests/healthsys-rx-cap.js`, `PROMPT*.md`, `docs/HANDOFF-CLAUDE-874.md`. `REVIEWS_DB` production chưa kiểm chứng; gói vẫn là Preview.

## Trạng thái 9.0.x (14/11/2026)
- 9.0.0 và 9.0.1 đã ghi released; 9.0.2 (rà logic hàng loạt) đang packaged, chờ chủ xác nhận up. Chưa push nhánh `codex/life-context-upgrade`.
- Rà logic: quét 2.400 đời ở 20 nước (script nằm ở thư mục scratch của phiên; mẫu có sẵn ở `tools/logic-audit.js`), đã sửa kẹt Sixth Form ở Anh, nghỉ hưu lặp, cờ cần việc của trẻ di cư, trần số con. Kiểm thử: `tests/logic902.js`.
- Test cũ còn fail từ trước (kiểm trên HEAD gốc, không do 9.0.x): `royal847`; `context-weighting` (kỳ vọng xác suất tất định, engine nay có thêm nhân tử ngẫu nhiên); `continuity101` (học bổng thay lương); `community` (13 tiêu đề nhật ký cũ dài hơn 85 ký tự). `tests/feedback843.js` đã cập nhật theo nhập tịch nhiều giai đoạn (hồi quy do `nat880.js`, đã sửa test).
- Chưa sửa, đã đo: nhân vật AI sinh ít con hơn tỷ suất sinh (Nigeria 0,45 con/đời so với 5,9; Mỹ 0,44 so với 1,5): tuổi bị hỏi chuyện con trung vị 38–41 và xác suất thụ thai thấp; cần đo vài trăm đời mỗi nước trước khi chỉnh.
- Bối cảnh lịch sử 1900–2026 (yêu cầu của chủ): giai đoạn 1 đã làm ở 9.1.0 (packaged): ô "Năm sinh (thử nghiệm)", `public/js/era902.js` chặn công nghệ, nghề, sự kiện sai thời; mô tả và bảng mốc ở `docs/ERA-GIAI-DOAN-1-910.md`; kiểm thử `tests/era902.js` và thước đo độc lập `tests/era-oracle902.js`. Bảng mốc ghi theo kiến thức công khai, CHƯA đọc lại từng nguồn gốc trong phiên: cần đối chiếu trước khi dùng làm khẳng định lịch sử.
- Giai đoạn 2 (đã làm ở 9.2.0, packaged): số liệu quốc gia theo năm 1950–2023 (tuổi thọ, sinh đẻ, tử vong dưới 5 tuổi, đô thị, GDP tương đối, di động, internet) nối vào tử vong, sinh con, ngưỡng phát triển; tên nước và thành phố theo năm; xem `docs/ERA-GIAI-DOAN-2-920.md`. Giai đoạn 3–5 (đã làm một phần ở 9.3.0, packaged): 17 biến cố lịch sử có hậu quả nhiều năm và lựa chọn được ghi nhớ (Việt Nam 1950–1989, Khmer Đỏ, Đông Âu, Nam Tư, khủng hoảng, COVID-19), bối cảnh chính trị 148 nước; xem `docs/ERA-GIAI-DOAN-3-5-930.md`.
- Còn lại của bối cảnh lịch sử (sau 9.4.0): (1) lương, giá, chi phí y tế theo năm: CHƯA làm, vì `l.base` là đơn vị chung cho thu nhập và chi phí ở khoảng 1.000 chỗ; nhân `base` theo GDP làm tiền tiết kiệm bị xói mòn như lạm phát và đổi các khoản giá tuyệt đối, cần thiết kế lại đơn vị tiền; (2) chính sách từng nước: mới có hôn nhân cùng giới theo năm; còn hưu trí, bảo hiểm y tế, giáo dục bắt buộc, quyền bầu cử, hình sự hóa quan hệ cùng giới theo năm; (3) biến cố còn thiếu: Rwanda và diệt chủng (cần quyết định danh tính nhóm), Arab Spring, nhiều đảo chính; (4) số liệu trước 1950 (chỉ khoảng 30 nước có tuổi thọ, 12 nước có tỷ suất sinh, cần xử lý chuỗi không đều); (5) TV, điện, nước sạch theo năm (không có chuỗi mở theo năm); (6) đọc văn bản gốc và nghiên cứu học thuật cho các điểm nhạy cảm, đối chiếu từng nước Xô viết và Nam Tư cũ.

## Nhóm 1: ngân hàng và y tế theo nơi (8.10.80 đã làm phần chính, gói packaged)
- Ngân hàng: `bank880.js` có Anh, Mỹ, Canada, Úc từ 2026 (nguồn BoE, FDIC, Fed G.19, Bank of Canada, RBA). Đã có thêm lãi vay mua nhà Mỹ (Freddie Mac PMMS) và nhãn lãi theo nước ở `scenarios.js`. Còn thiếu: Singapore (MAS đã ngừng chuỗi lãi suất ngân hàng, cần nguồn khác), lãi theo năm trước 2026, bảo hiểm tiền gửi SDIC Singapore.
- Y tế: `health880.js` có NHS England phí kê đơn/PPC và Nhật Bản từ 70 tuổi. Chưa đọc được nguyên văn MHLW cho tỷ lệ 70–74 và ngưỡng thu nhập ngang người đang làm (đang dùng 383/520 vạn yên); trang `iryouhoken01` chỉ là ảnh và PDF, cần đọc tay hoặc tìm trang văn bản khác. Các nước khác vẫn là nguồn thứ cấp của `healthsys919.js`.
- Thuế (tax879): đã thêm Scotland 2023–24 trở đi, National Insurance từ 2024–25, đối chiếu hai ngưỡng Singapore. Còn thiếu: phụ phí Medicare, thuế tỉnh Canada, giảm trừ cá nhân.

## Nhóm chưa làm
2. Visa, nhập tịch, phúc lợi theo nước.
3. Homeschool theo 76 vùng.
4. Thể thức bóng đá / FIFA.
5. Khoảng 3.454 dòng hồ sơ quốc gia còn nguồn chung (hiện 251/3705 có nguồn riêng).
6. Nhịp yêu và cưới của nhân vật AI (đo trong `docs/REVIEW-1IN8B-874.md`): khoảng 0,4 đến 0,7 con mỗi đời, cần đo hàng trăm đời mỗi nước trước khi chỉnh. Hai lần chỉnh trước cho kết quả nhiễu và đã hoàn lại.

## Quy tắc cần nhớ
Mở rộng hệ thống có sẵn, giữ tương thích bản lưu cũ, viết kiểm thử, giữ CRLF, `git add` từng file, không force push, ghi chú phát hành để `packaged` cho tới khi chủ xác nhận, dùng giờ thật có múi giờ.

## Lệnh hữu ích
- Kiểm thử nhanh: `npm run test:quick`
- Đóng gói: `ESBUILD_BINARY_PATH=<esbuild> python3 pack.py` (cần esbuild và pack.py từ máy ảo, bản sao nằm ở thư mục scratch của phiên cũ; nếu mất, dùng quy trình trong `docs/CLOUDFLARE-PACKAGING.md`)
- Cập nhật lịch sử: sửa `docs/update-extra.json` rồi `node tools/build-update-history.js`
