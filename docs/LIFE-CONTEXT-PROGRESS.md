# Tiếp quản và nâng cấp logic cuộc sống — CHECKPOINT PREVIEW

**Chưa hoàn tất toàn bộ A–E, chưa nghiệm thu Production.** Không tự chuyển giai đoạn, không deploy.

## Nền tảng đã xác minh
- HEAD gốc 7294c42d1f82874c63607ef4d340a63c62735b42, nhánh player-feedback-upgrade; remote origin https://github.com/mercyx03/motdoi.git. Remote HEAD khớp local qua git ls-remote. Connector GitHub xác nhận repository public, tài khoản có quyền push/admin.
- Nhánh phát triển codex/life-context-upgrade, tạo trực tiếp từ HEAD trên; không quay về main, không reset hoặc đổi lịch sử. Không có workflow GitHub được theo dõi. Tài liệu dự án quy định Direct Upload bằng Dashboard; chưa kiểm chứng cấu hình Pages thực tế và REVIEWS_DB.
- Working tree ban đầu: audit-world-520.json modified; .local-state-review.txt, Claude.md untracked. Giữ nguyên, không stage/commit.
- Đọc Claude.md, AGENTS.md, SHOWBIZ-PROGRESS, PLAYER-FEEDBACK-PROGRESS và module liên quan. Đã có sáu mốc Showbiz 8.7.0: giữ toàn bộ registry, gameshow, diễn viên, thực tập sinh 14 tuổi, debut, show sống còn và tích hợp. Không tạo hệ thống thay thế.

## A — Gia cảnh và xuất thân: triển khai một phần
- life157: mâm thôi nôi theo thu nhập người chăm sóc; đồ chơi phù hợp tuổi; thêm mượn đồ, kỷ niệm giản dị, tiệc nhà/nhà hàng/chuyên nghiệp. Giữ ID cũ, vẫn qua chốt infantDone của life121.
- engine: nghề nghệ thuật của bố mẹ có bảng thu nhập từ nghệ nhân/nghệ sĩ thu nhập thấp tới sản xuất/biểu diễn chuyên nghiệp; không thay nghề trong bản lưu cũ.
- Trẻ có thể học nghệ thuật cùng người thân mỗi năm hoặc chọn sở thích riêng, không tự gán tài năng.
- CONTEXT143: áp lực học tập trẻ xét thu nhập hộ; học bổng vẫn có cơ hội, không tăng xung đột/tính cách xấu theo nghèo. Các cơ chế hoàn cảnh/chuỗi/điều tiết cũ giữ nguyên.
- Còn thiếu: rà soát chọn lọc đầy đủ sinh nhật/Tết/y tế/du lịch/mua sắm/đầu tư và nhiều chuỗi đời sống; nghệ thuật nhiều thế hệ, kỳ vọng và casting trẻ em thành chuỗi.

## B — Hồ sơ, địa vị: triển khai một phần
- life158: sáu tầng lớp, ngưỡng tương đối theo l.base (đơn vị sống tại quốc gia/thời kỳ hiện có), tài sản ròng đọc E.netWorth gồm cổ phần/tài sản/nợ hiện có, nguồn thu hộ và cá nhân; bỏ tăng bậc do follower ở nguồn tier của life148.
- Quyền lực doanh nghiệp đọc các công ty kiểm soát, quy mô vốn, cổ phần, số ngành/vai trò. Không cộng vốn công ty vào tiền mặt. Thiếu số nhân viên thì hiện chưa đủ dữ liệu; quyền lực hỗ trợ xác suất thương vụ ở mức nhỏ, không bảo đảm thành công.
- Danh tiếng nghề nghiệp/công khai/mạng lưới/follower đọc riêng nguồn đang có; không cộng dồn khi mở hồ sơ. Uy tín mạng lưới không được gọi là uy tín toàn cộng đồng.
- Bảng tài sản: tối đa 12 doanh nhân hư cấu qua mạng lưới ELITE148, không đẩy người quen cũ ra khi mạng lưới đủ 60. Hồ sơ có quốc gia, ngành, tài sản và mô hình sở hữu giả lập; cập nhật một lần/năm theo seed, giữ lịch sử 20 năm và quy đổi tiền khi chuyển nước. Không phải thứ hạng toàn dân số.
- Hồ sơ bạn đời/con thêm hình thể từ biography đã lưu, cổ phần trong holders137; chỉ hiện quan điểm người lớn khi đúng tuổi. Nợ/chi phí/tiết kiệm/chứng chỉ chưa có sổ riêng: hiện chưa có dữ liệu.
- Còn thiếu: bộ mô phỏng ngân sách/đời sống riêng đầy đủ cho mỗi người thân, tín nhiệm công chúng độc lập với tín nhiệm kênh, mở rộng nguồn thành tích nghề nghiệp và cộng đồng; phạm vi quốc gia/ngành của bảng còn nhỏ.

## C — Kinh tế/doanh nghiệp: triển khai một phần, tận dụng phần đã có
- life159 + app: chức vụ tự điều hành hiện cả khi không có việc ngoài; phân biệt vai trò chính/kiêm nhiệm; không tự thêm lương. Giữ đồng bộ người thân ở life147.
- Không thấy giới hạn số công ty ở bản gốc mới nhất. Test xác nhận tạo 2–3 công ty, mỗi lần chỉ trừ vốn một lần và ID được gán ngay. Rào cản tìm thấy là học vấn mô phỏng: giải thích trên màn quản lý, cho phép chủ doanh nghiệp dùng CEO thuê có năng lực >=60/100 để mở rộng khi chưa hoàn thành THPT, vẫn giữ yêu cầu vốn/tự lập/pháp lý.
- Phí kiểm toán/pháp lý thường niên xét vốn, lợi nhuận, số công ty/ngành, hiển thị giá trước khi bật. Không trần hóa/giảm lại tài sản cũ, không thu hai lần cùng năm.
- Phân biệt bổ nhiệm và sở hữu, chuyển cổ phần, sáp nhập, di chúc theo tài sản, người thi hành, người điều hành và tranh chấp đã có tại life137/139/150: giữ nguyên, kiểm thử liên quan.
- Còn thiếu: nhượng quyền thương mại (khác bán công ty) và luồng đối tác mua/đàm phán bán chi tiết; rà soát đủ lợi nhuận/định giá/nợ/thuế của tập đoàn qua thời gian dài, quyền biểu quyết đặc biệt. Chưa tái hiện đúng bản lưu/ảnh 69 tuổi mà người chơi mô tả. Không tuyên bố đã sửa nguyên nhân tăng trưởng vô lý khi chưa có bằng chứng.

## D — Kỹ năng/K-pop/truyền thông: triển khai một phần
- life138: chất lượng/tốc độ học khác nhau, phí theo số giờ, lớp nâng cao/chuyên nghiệp và hỗ trợ cộng đồng, lợi suất giảm, tối đa 3 môn và 12 giờ/tuần với trẻ hoặc 20 với người lớn. Từ chối học trả phí không khóa tự học; không nhân điểm/tiền sau lưu tải.
- life155: từ 13 tuổi trên cùng hệ thống, rap riêng; mạng xã hội chỉ thêm xác suất có giới hạn khi đủ kỹ năng, nguồn phát hiện phụ thuộc trường học/video/người quen có thật. Giữ điều kiện giám hộ, học tập, chuẩn bị đi Hàn và quốc tịch.
- life160: ủy quyền từng quyền trên kênh/nhân sự life131, tối đa 4 video và một livestream/năm, lương dùng chung; quảng cáo/giao lưu là lời mời để người chơi duyệt, không ký tự động. Một báo cáo/kênh/năm, lịch sử 12 năm, token năm ngăn lặp sau nạp. Dừng khi thiếu nhân sự hoặc nền tảng ngừng. Giới hạn follower áp dụng cả tăng fame để không tiếp tục tăng khi kênh đã chạm trần.
- Còn thiếu: từng chức danh nhân sự (quản lý cá nhân, booking, PR, nhiếp ảnh...) với hợp đồng/năng lực riêng; ủy quyền ngân sách/hợp đồng nhỏ; chuyển/rời công ty của thực tập sinh chưa thành niên đầy đủ.

## E — Kiểm thử và đóng gói checkpoint, chưa nghiệm thu toàn bộ
Đã đạt: life-context-a 12; life-context-bcd 29; context-weighting 4.658; life138 38; audition139 23; showbiz-idol 70; social131 35; creator132; business128 16; business133 29; business137 79; business-ui137; feedback-b 664; feedback-c 82; feedback-e 75; integration-showbiz 92; integration-feedback 1.056. Smoke 11/11, saves-compat 10/10, save-safety 10/10, NPC 14/14.

Browser Chrome thật: browser-life-context 8 luồng trên 390/1280px (thôi nôi, địa vị, rèn luyện, bật ủy quyền), tìm kiếm nhật ký không dấu, không tràn ngang/lỗi JS; ảnh ở .cache. Chưa thử tay toàn bộ luồng họ hàng, bảng xếp hạng và tất cả cấu hình auto.

Test cũ dùng H.rf hoặc RNG chỉ ở make trong khi E.resolve dùng RNG riêng: chỉnh bộ test business133/feedback-e để tiêm RNG tại apply đúng nhánh cần kiểm tra; giữ mọi assertion và luồng E.resolve khi kiểm tra hôn nhân. Test business137 đổi kỳ vọng phí theo báo giá quy mô; showbiz-idol kiểm cả chặn 12 và cho 13 tuổi. Không giảm assertion.

Sửa lỗi lưu: SaveStore.inspect kiểm schema trước tình trạng đã mất; bản lưu tương lai luôn được bảo vệ. Lỗi lộ do đời mẫu đã mất trước tuổi mục tiêu; không đổi fixture hoặc ép nhân vật sống.

Không chạy toàn bộ 77 nhóm, không nghiệm thu lại GĐ0–GĐ6. Các nhóm đã đạt không lặp lại nếu không đổi liên quan. Kết quả build/ZIP cuối được ghi sau khi thực hiện.

## Cách tiếp tục và khôi phục
Tiếp tục trên codex/life-context-upgrade; không reset về nhánh cũ. Thực hiện phần còn thiếu A–D rồi tích hợp E, chỉ test phạm vi ảnh hưởng; chưa đánh dấu A–E hoàn thành. Mốc nguồn trước thay đổi: 7294c42. Nếu cần quay lại, tạo nhánh khôi phục từ commit đó và đóng gói riêng; chủ dự án tự upload bản ổn định, không reset/force push nhánh mới và không động vào ba tệp riêng.

## Artifact checkpoint đã xác minh

- npm run package:cloudflare: PASS, loading/runtime nguồn so với bundle và kiểm quyền API cục bộ PASS.
- dist/ và dist.zip mới: 28 file triển khai, ZIP 2.458.687 byte. SHA-256 C92B0FEFBEE4EC744A285BD3217DD6FE23230E2D688109B67ECD250BDCCCD6FC.
- Script đã đọc lại toàn bộ ZIP, đối chiếu từng tên/SHA-256 với dist; có index.html ở gốc, _worker.js, _routes.json, _headers và .well-known. Không có binding hoặc dữ liệu D1.
- life-context-updates: PASS; hai mục packaged đồng bộ trong nguồn/JSON build/HTML nhúng; mọi mục lịch sử cũ nguyên vẹn.
- Bổ sung trình duyệt riêng bảng xếp hạng: 2 luồng ở 390/1280px PASS, hiển thị tách tiền mặt/vốn/cổ phần, không tràn ngang. Tổng 10 luồng mới đã kiểm.
- Source rollback: 7294c42. Chưa hoàn tất A–E; chỉ Preview. Chủ dự án kiểm tra binding REVIEWS_DB riêng cho môi trường thử, không dùng DB Production cho phép thử ghi.
