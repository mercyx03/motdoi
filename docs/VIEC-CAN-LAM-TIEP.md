# Việc cần làm tiếp (chuyển máy)

Cập nhật: 2026-11-13, sau bản 8.10.79. Nhánh làm việc: `codex/life-context-upgrade`.

## Làm ngay khi về máy
1. Chạy `git push origin codex/life-context-upgrade` (máy ảo không push được). Commit gần nhất: `f9c701a` (8.10.79), trước đó `7344142` và `02ee4d1` (8.10.78).
2. Tự upload `dist.zip` bằng Dashboard nếu chưa upload. Không chạy lệnh deploy production, không đụng DNS/Pages/DB production.
3. Nhật ký cập nhật 8.10.78 và 8.10.79 đã đặt `released`; cần commit thay đổi này nếu chưa có.
4. Thử bằng trình duyệt thật: sống ở Anh/Úc/Singapore/Canada có việc làm, xem dòng thuế ở bảng lương; chuyển nước khi còn vay thế chấp.
5. Chạy `regression.js` đầy đủ (chưa chạy hết được ở máy ảo).

## Không commit, không xóa
`audit-world-520.json`, `.local-state-review.txt`, `Claude.md`, `public/js/healthsys919.js`, `tests/healthsys-rx-cap.js`, `PROMPT*.md`, `docs/HANDOFF-CLAUDE-874.md`. `REVIEWS_DB` production chưa kiểm chứng; gói vẫn là Preview.

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
