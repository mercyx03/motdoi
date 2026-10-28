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

### Bổ sung từ GĐ4 (chưa chạy, không tính PASS)

- Regression đầy đủ trên mã GĐ4: toàn bộ mục 0–75 + 5b và mục 9 đủ 1.313 tình huống (registry tăng 15 tình huống `ch144_*`). Mục 6 có ngưỡng "hơn 60% tình huống xuất hiện tự nhiên"; 15 tình huống chuỗi chỉ mở khi có sự kiện gốc nên tỷ lệ có thể giảm nhẹ — cần đo lại.
- GĐ4 đã chạy: mục 7, mục 68, mục 9 lọc 25 tình huống liên quan (24/25 có phương án được thực thi).
- Kiểm thử trình duyệt cho lựa chọn chuỗi trong giao diện chơi (popup, chế độ tự động, lưu giữa năm) chưa chạy; mới kiểm qua engine headless.
- Lỗi có từ trước, chưa sửa (cần chủ dự án quyết định vì bật lại nội dung): các cảnh hôn nhân life130 và `familyObjection130` không bao giờ xuất hiện từ trigger do `valid(l, {})` trả về false. Khi sửa, cân nhắc tần suất và có thể nối thêm làm gốc chuỗi hôn nhân/gia đình của GĐ4.

### Bổ sung từ GĐ5 (chưa chạy, không tính PASS)

- Regression đầy đủ trên mã GĐ5; mục 6 cần đo lại vì GĐ5 mở lại 11 tình huống và thay đổi nhịp.
- GĐ5 đã chạy: mục 7, 16, 30, mục 9 lọc 14 tình huống bị ảnh hưởng. Mục 30 lần đầu bắt `marriageMoney130` ×5 → đã hạ `max`.
- Đã sửa lỗi cảnh hôn nhân life130 / `familyObjection130` / `status129` / `map_mo101` / `casual101` / `public_scandal101` (xem PACE-GD5.md); mục ghi ở GĐ4 về lỗi này đã xử lý.
- Bấm giờ chế độ tự động và kiểm giao diện các cảnh vừa mở lại trên trình duyệt.
- Tỷ lệ có con: GĐ5 thấp hơn 1,9 điểm khi tắt điều tiết (trong sai số); đo lại với mẫu lớn.

## Sau GĐ6

### Đã xử lý trong GĐ6

- Các mục GĐ3–GĐ5 "chưa chạy" ở trên: regression đầy đủ đã chạy trên mã GĐ6 (xem ACCEPTANCE-GD6.md).
- Chế độ Tự động đứng chờ: sự kiện hệ thống (thời tiết, người đòi nợ, chuyển nơi ở, khoảnh khắc với con, đám cưới của con, con chia sẻ chuyện riêng, kết thúc du học…) bị gắn nhầm "người chơi tự mở"; bước nối tiếp của lựa chọn do AI chốt cũng bị gắn như vậy. Đổi Tự động khi đang có lựa chọn không có tác dụng.
- `familyObjection130` xuất hiện với vợ chồng đã cưới nhiều năm → chỉ còn với cặp chưa cưới.
- Ba bộ test module hỏng từ GĐ5 do bọc `ev.run` và ghi lịch sử khi lựa chọn không có tác dụng; `community` hỏng từ GĐ3 do cấm số phiên bản trong toàn bộ nhật ký.
- Regression lượt 2–3 bắt thêm: crash chuỗi hôn nhân GĐ4 khi bạn đời không còn; cờ học bổng lệch điểm thi lại; quy tắc AI của GĐ5 chặn việc tự chọn giúp ở chế độ thủ công; nhóm "đổi nghề" của GĐ5 làm giảm đổi hướng sự nghiệp ~45%. Đã sửa cả bốn.

### Còn lại

- Tỷ lệ AI có con thấp (đã ghi từ GĐ2.5) — hạng mục cân bằng gameplay, không thuộc GĐ6.
- `life.id` phụ thuộc giờ thật: cùng seed với giờ thật cho đời khác nhau (cảnh báo smoke) — không đổi cấu trúc ID trong GĐ6.
- Điều kiện lập di chúc theo hoàn cảnh (`di_chuc70`) — mục đầu tiên của backlog, chưa triển khai.
- Danh sách nhóm chủ đề chống lặp (GĐ5) mới bao phủ các cụm đã thấy trong số liệu; mở rộng khi có thêm dữ liệu người chơi.
- Bấm giờ chế độ Tự động trên thiết bị người chơi thật; profiling giao diện điện thoại.
- Bản lưu thật của người chơi chưa có mẫu để kiểm (chỉ có bản lưu do máy tạo).
- 25 nâng cấp gameplay chuyên sâu: chưa bắt đầu, chờ chủ dự án giao.


## Sau GĐ6 — checkpoint logic cuộc sống 8.8.0-preview

Không mở lại nghiệm thu GĐ0–GĐ6. Yêu cầu A–E mới chưa hoàn tất: xem LIFE-CONTEXT-PROGRESS.md cho danh sách phạm vi còn thiếu. Trên mã cuối cần kiểm thử có mục tiêu: toàn bộ ngân sách/vòng đời người thân; quyền điều hành khác cổ phần, tặng/thừa kế không lặp qua nhiều đời; chi phí/định giá tập đoàn dài hạn; mọi nhánh ủy quyền và dừng hợp đồng truyền thông; thực tập sinh chuyển/rời công ty và hành trình quốc tế. Chưa tính các mục này là PASS. Regression toàn bộ 77 nhóm chưa chạy trên checkpoint (chủ dự án yêu cầu không chạy). Chưa xác minh Pages REVIEWS_DB thực tế; artifact chỉ Preview.

## GĐ6 / nghiệm thu cuối đợt A–E và quản trị doanh nghiệp 8.8.1
Checkpoint hợp đồng chỉ hoàn tất một phần mốc 1. Theo dõi toàn bộ phạm vi còn thiếu tại docs/ENTERPRISE-UPGRADE-PROGRESS.md và yêu cầu gốc ENTERPRISE-UPGRADE-REQUEST.md. Trên mã cuối cần kiểm toàn bộ tài chính người thân/không nhân đôi, nhượng quyền, báo cáo dòng tiền/nợ/cổ tức, chiến lược, nhân sự/CEO/CFO, thực tập 2–3 năm, cố vấn dài hạn và năm chuỗi nhiều năm. Những phần này chưa triển khai hoặc chưa kiểm; không đánh dấu PASS. Giữ yêu cầu không chạy 77 nhóm sau mỗi thay đổi. Binding REVIEWS_DB thực tế chưa kiểm chứng; chưa Production-ready.


### Nghiệm thu cuối đợt 8.8.2-foundation
Mốc nền tảng đã đạt kiểm thử trọng điểm. Trên mã cuối cần nối và kiểm báo cáo/biểu đồ, bảy chiến lược, nhân sự/lãnh đạo, thực tập/cố vấn và năm chuỗi tích hợp; kiểm thêm giao dịch nhượng quyền sau sáp nhập/thừa kế, nhiều thế hệ có nợ bảo đảm, các chế độ tài sản hôn nhân với sổ cá nhân. Không coi các mục chưa chạy là PASS. Ba tệp riêng của chủ dự án giữ nguyên; không deploy.

Mốc 8.8.3-reports đạt kiểm thử trọng điểm (reports 13, treasury 123, business133 29, business137 79, smoke/save/NPC, Chrome); GĐ6 đợt nâng cấp vẫn còn tích hợp chiến lược, nhân sự, lãnh đạo, thực tập, cố vấn và toàn bộ bổ sung quản gia/trợ lý/tiệc. Chưa chạy regression cuối trên toàn bộ phạm vi; không tính các mục đó PASS.

Mốc chiến lược 8.8.4 đã kiểm trọng điểm và build; nghiệm thu cuối đợt vẫn thiếu leadership, thực tập/cố vấn và supplement quản gia/trợ lý/tiệc. Bản nháp chưa nạp không tính PASS.

## Chốt đợt 8.8.5-enterprise — 28/10/2026

Các mục triển khai còn thiếu của checkpoint 8.8.1–8.8.4 nêu trên đã được tích hợp và kiểm thử trong đợt 8.8.5. Hồ sơ hiện hành: ENTERPRISE-UPGRADE-ACCEPTANCE.md và bảng checklist ENTERPRISE-UPGRADE-PROGRESS.md; các ghi chú checkpoint trước là lịch sử. Đã chạy smoke/save/safety/NPC, hồi quy các hệ thống bị ảnh hưởng, năm chuỗi tích hợp và Chrome trên dist; package/ZIP đạt. Không chạy toàn bộ 77 nhóm theo K1 yêu cầu gốc. Còn kiểm chứng ngoài môi trường: mẫu save thật của người chơi, thiết bị thật và binding Pages REVIEWS_DB. Không tự deploy hoặc ghi trạng thái đã phát hành.

## 8.8.6 — Boys Planet và quốc gia

Hoàn thành triển khai, kiểm thử trọng điểm: country-survival 273, showbiz-idol70/games585/quiz4047/dating69/integration92; smoke/save/safety/NPC và Chrome390/1280 đạt. Không chạy toàn bộ regression77; chưa có bản lưu thực tế bị kẹt của người báo lỗi. Bản đóng gói mới giữ packaged tới khi chủ dự án xác nhận upload.


## GĐ6 / nghiệm thu bóng đá chuyên nghiệp 8.9.2

Mô hình rút gọn đã triển khai trực tiếp; xem FOOTBALL-CAREER.md cho audit, cơ chế và giới hạn.
Nghiệm thu cuối còn: regression toàn bộ trên mã cuối, mẫu save thật đang làm cầu thủ, thiết bị thật;
kiểm thế giới đội tuyển độc lập khi nhân vật vắng mặt, nhập tịch kép, thể thức theo thời kỳ,
lên/xuống hạng CLB, lịch VCK đầy đủ và đàm phán nhãn hàng (chưa triển khai, không tính PASS).
Chưa kiểm binding REVIEWS_DB thực tế. Nhãn nhật ký “Đã phát hành” theo chỉ thị riêng của chủ dự án
cho bản bàn giao; không chứng minh website đã upload. Không tự deploy.
