# Một Đời — Showbiz, scandal hợp đồng và gameshow 8.10.27

Trạng thái: **HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN**. Bản Preview, nhật ký packaged; không tự deploy.

## Phạm vi

- Mở rộng life151/life156 và hợp đồng quang_cao hiện hữu. Hồ sơ truyền thông giữ nguyên người liên quan, lựa chọn, thời điểm và hậu quả xuyên năm; đối tác quảng bá dùng danh bạ ELITE148, có thể từ chối. Không tạo quan hệ yêu đương từ quảng bá.
- Hợp đồng công bố trước mức 200/300/500% cát-xê thực nhận; gói an toàn nhận 75% cát-xê, trần 100%. Mức này là tổng yêu cầu, không cộng hoàn cát-xê thêm lần nữa; không là mô tả quy định pháp luật thật.
- Chuỗi riêng cho từng nhãn hàng: tạm dừng chiến dịch, yêu cầu, đối chiếu, đề nghị giảm, nhận hòa giải hoặc tranh chấp, kết quả sang năm, ghi nghĩa vụ, trả hết/một phần/trả dần và tất toán. Đời tư/tin đồn không tự chứng minh vi phạm. Bỏ mặc yêu cầu 2 năm chuyển tranh chấp, năm tiếp theo có kết quả theo căn cứ của tình huống.
- Nghĩa vụ đã xác nhận mới trừ tài sản ròng; yêu cầu chưa chấp nhận không tính nợ. Trả dần dự kiến 3 năm, dự phòng sinh hoạt 25% mức cơ sở khi tự trích; thiếu tiền không xóa dư nợ. Phí chậm trả 2% dư nợ/năm, trần 20% nghĩa vụ gốc. Quá hạn kéo dài hoặc hồ sơ nghiêm trọng có thể hoãn hợp đồng mới. Sổ nghĩa vụ tích hợp hồ sơ tài sản, đổi tiền và lưu/tải; không giả thành nợ ngân hàng bị bán cho bên đòi nợ.
- Không hồi tố điều khoản vào pending/hợp đồng cũ chưa công bố; chặn ký lại cùng quyết định và thu phí năm trùng lặp.
- Bộ câu hỏi 17 → 25 dạng: số dư, đường đi, mật mã chữ, biến đổi chuỗi, tập hợp, năng suất, bắt tay, chuông. Ghi 1.200 chữ ký xuyên mùa; thử tối đa 301 ứng viên khi gặp câu trùng, không cam kết kho vô hạn. Mức khó dùng nhóm suy luận riêng. Siêu Trí Tuệ nhớ 18–34 chữ số, chọn cụm 6 chữ số, chuỗi 10–12 đồ vật và câu suy luận.

## Kiểm chứng đã thực hiện

- showbiz-media827: 5.421 kiểm tra; showbiz-contract827: 47; showbiz-quiz: 4.047 (gồm sinh/kiểm tra 30.000 câu).
- showbiz-games 585; actor 51; idol 70; integration-showbiz 95: PASS.
- test:quick: smoke 11/11, saves 10/10, save-safety 10/10, NPC 14/14. Cảnh báo seed theo giờ thật và fixture Hardcore cũ bỏ sự kiện không còn tồn tại là cảnh báo đã có, không báo thành lỗi mới.
- Regression mục 9 cho 9 id bị ảnh hưởng: 1.592 lượt chọn, 22.973 kiểm tra, 0 lỗi trên mã cuối. Không chạy toàn bộ regression.
- Chrome: 12 luồng ở 390/1280px gồm scandal, bồi thường và bốn show kiến thức; không lỗi JS/tràn ngang. Chạy ngoài sandbox vì localhost của máy chủ trong sandbox bị chặn. Sửa test cũ để chờ MotDoiBoot trước khi dựng đời.
- update827: đối chiếu chính xác toàn bộ 150 mục cũ với b15490d; JSON nguồn/dist và dữ liệu nhúng HTML giống nhau. update827-browser: cả hai kích thước, trạng thái packaged, tìm kiếm không dấu, bộ lọc Tính năng và tải thêm. update-release: 716 kiểm tra.
- tests/update-showbiz.js dùng snapshot acc6aa5 đã thất bại ở releasedAt lịch sử (Z so với .000Z); không sửa lịch sử hay nới test để che lỗi. Bộ update827 đối chiếu baseline ngay trước đợt này đạt. Đưa rà soát test lịch sử vào GĐ6.
- npm run package:cloudflare: build riêng, loading/resource hashes và 8 đời nguồn/nén giống nhau; admin API cục bộ PASS. Script đọc lại tất cả entry và so SHA-256 nội dung với dist, giữ file dấu chấm và cấu hình Worker/Pages. Không gọi Cloudflare API.

## Git và bàn giao

- Baseline/khôi phục: b15490df5004a2b32a596e2b337709631db7aa54.
- Nhánh codex/life-context-upgrade, origin https://github.com/mercyx03/motdoi.git. Connector xác minh repository public, tài khoản có push/admin; remote branch trùng baseline trước đợt sửa. Không có GitHub workflows được theo dõi; dự án quy định Direct Upload do chủ dự án thực hiện. Không merge main/force push/deploy.
- Bảo toàn Claude.md, .local-state-review.txt, các prompt và audit-world-520.json; không stage dữ liệu riêng. dist được ignore, dist.zip được theo dõi theo chính sách hiện tại.
- Chưa kiểm chứng REVIEWS_DB trên Pages thực tế; nhật ký tĩnh không dùng D1, không sửa database Production. Regression tổng thể và chiến dịch dài nhiều nhãn hàng/đổi nghề/chuyển đời còn ở GĐ6 (BACKLOG).
- Khôi phục: checkout b15490d trong bản sao/worktree riêng, chạy package:cloudflare rồi chủ dự án tự upload gói đã kiểm tra. Không reset/force push nhánh đang làm; nếu cần hoàn tác mã đã push, tạo commit revert có kiểm tra.
