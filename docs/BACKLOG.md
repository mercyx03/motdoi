# Backlog sau nghiệm thu GĐ2.5

## Điều kiện thực tế để lập di chúc (`di_chuc70`)

Trạng thái: chủ dự án yêu cầu ngày 26/10/2026; **chưa triển khai**, ngoài phạm vi nghiệm thu GĐ2.5. GĐ2.5 tiếp tục kiểm theo hành vi và ngoại lệ hiện tại.

Mục tiêu: nhân vật bị giam giữ, bị kiểm soát hoặc không thể liên lạc và tiếp cận thủ tục cần thiết không được tự do lập di chúc như bình thường. Không cấm tuyệt đối mọi trường hợp giam giữ: nếu có điều kiện hợp pháp và thực tế thì vẫn có thể cho phép.

Trước khi triển khai cần khảo sát toàn bộ trạng thái giam giữ/kiểm soát đang có, đường mở hành động và hệ thống di chúc/thừa kế hiện hữu. Xây dựng điều kiện dựa trên hoàn cảnh, khả năng liên lạc và tiếp cận thủ tục; không chỉ chặn bằng một cờ đơn giản. Mở rộng cơ chế hiện có, tránh tạo hệ thống song song.

Nghiệm thu riêng cần có ca: tự do bình thường; bị cô lập/kiểm soát không liên lạc được; bị giam nhưng có điều kiện hợp pháp và thực tế; thay đổi hoàn cảnh qua năm; không làm mất di chúc đã có; tương thích bản lưu cũ. Chi tiết về thủ tục/pháp lý phải được kiểm chứng khi thiết kế, không tự suy diễn thành luật đã áp dụng trong game.

Chỉ bắt đầu khi chủ dự án giao đợt sửa này; không tự gộp vào GĐ3.

## GĐ6 — nghiệm thu tổng thể và regression đầy đủ (chuyển từ GĐ3)

Theo chiến lược chủ dự án ngày 26/10/2026: GĐ3 kết thúc ở trạng thái **HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN**. Các mục dưới đây **chưa chạy trên mã GĐ3** (gameplay `b3ada6f`), không được coi là PASS. GĐ4–GĐ5 bổ sung danh sách của mình vào mục này; GĐ6 chạy toàn bộ trên mã cuối.

- Regression `tests/regression.js` chưa chạy trên GĐ3: mục 5 (6.300 đời), 5b, 6, 13–16, 18, 20, 22–27, 29, 31–45, 47–51, 53–54, 56–58, 60–67, 70–74.
- Mục 9 đầy đủ 1.298 tình huống (manifest SHA-256 `3b1996364a8aefdf8f6d93548777013e1e04ea91271cbd9a60313437b81b278c`, không đổi so với GĐ2.5). GĐ3 chỉ chạy lọc đúng 50 ID có trọng số; 41/50 ID có phương án thực sự được thực thi. Nên chạy theo các nhóm 130/32 ID như GĐ2.5 (tổng khoảng 48 phút máy nếu tuần tự).
- Các bộ `npm run test:*` chuyên đề còn lại (update/family/business/social/university…) chưa chạy trên mã GĐ3, trừ context, smoke, saves, save-safety, NPC, updates.
- Kiểm thử trình duyệt toàn bộ game (không chỉ trang Cập nhật) và bản lưu thật của người chơi.
- Theo dõi cân bằng tài chính GĐ3: mẫu 60 đời cho thấy số đời âm tiền 8→11, 6→8, 5→8; cần mẫu lớn trước khi kết luận.
- Ghi chú rà soát GĐ3 (chưa sửa, không chặn): `E.CONTEXT143.probability` kẹp xác suất về tối đa 1 trước khi nhân hệ số độ khó sự kiện; với trigger có p gốc cao và hệ số >1, độ khó giảm sự kiện sẽ tác động từ mức đã kẹp. Chỉ ảnh hưởng 50 trigger có nhãn; đánh giá lại khi chạy phân bố đầy đủ.
