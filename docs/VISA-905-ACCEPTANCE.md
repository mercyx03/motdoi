# Sửa luồng chuẩn bị visa du học tiến sĩ — 8.10.5

HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN.

## Nguyên nhân và thay đổi

studyVisa900 chỉ cung cấp nộp visa hoặc rút thư. Khi thiếu giấy tờ/kế hoạch, menu110 ẩn phương án nộp nhưng không cung cấp thao tác chuẩn bị tại màn hình đó. Sau admission, life107 chỉ ghi lời hướng dẫn tìm menu visa ở nhóm Đời sống, không tự mở bước tiếp theo. Người chơi tiến sĩ khó tìm và tiếp tục đúng hồ sơ.

- abroad-depth.js: tách hai thao tác chuẩn bị hiện có thành preparationRows dùng chung cho visaFile900 và studyVisa900. Giữ nguyên phí, ngân sách dự phòng, giới hạn một lần/năm, mức tối đa và điều kiện nộp. Sau thao tác tại thư nhận học mở lại đúng menu để tiếp tục.
- Thêm action studyVisa900 trong Học tập (giao diện Học tập & công việc → Học tập), chỉ khi có thư đang chờ, chưa đi và chưa nhập học. Bản lưu cũ không cần đổi cấu trúc hay mua lại thư.
- visaFile900 thêm đường quay về thư nhận học cùng quốc gia.
- life107.js: sau trúng tuyển, tự đưa studyVisa900 vào hàng lựa chọn. Chỉ lúc visa đạt mới gọi STUDY_ENTRY900, chuyển nơi ở, đổi tiền và kết thúc công việc.
- Hai test mới: tests/visa905.js và tests/visa905-browser.js. Nhật ký hai JSON, CHANGELOG và BACKLOG được cập nhật, giữ nguyên mọi mục lịch sử cũ.

- migrateExt làm mới pending studyVisa900 hoặc du_hoc dùng menu visa cũ chưa có keys docs/plan. Giữ manual và token hành động, không đổi RNG/tiền; kiểm migrate hai lần không nhân đôi.

## Kiểm thử

- visa905: 231 kiểm tra đạt. Qua hành động E.act/E.resolve đầy đủ cho cả 3 bậc × 2 hình thức học phí; giấy tờ, kế hoạch, quay lại menu, xét visa, nhập học, chi phí, việc làm/nơi ở; thư tiến sĩ cũ qua migrate, du_hoc cũ, menu visa chung, quyết định quá năm, thiếu tiền, ngoại ngữ hết hạn, rút thư không hoàn trùng.
- depth900: 58 kiểm tra đạt; gồm du lịch, từ chối visa, chờ năm sau, nhập học, chuyển trường, cư trú, hết hạn và hoàn học phí.
- residence897 đạt.
- test:quick: smoke 11/11; saves 10/10; save-safety 10/10; NPC 14/14 đạt. Cảnh báo đã biết về seed/giờ thật và lựa chọn Hardcore cũ bị loại giữ nguyên.
- Chrome headless tại 390/1280px: bản lưu giả lập tiến sĩ có thư chờ visa, bấm thật nhóm Học tập & công việc → Học tập → Tiếp tục hồ sơ visa; chuẩn bị giấy tờ và kế hoạch; tải lại, nộp visa và vào school=phd tại US; không tràn ngang hoặc lỗi runtime. Ảnh .cache/visa905 không commit.

## Bàn giao, giới hạn và khôi phục

Không tự deploy, không sửa D1 hoặc cấu hình Cloudflare. Gói chỉ được xác nhận sau npm run package:cloudflare: build riêng tools/build.js, loading, Worker/admin và đọc lại toàn bộ ZIP so tên/SHA-256 với dist. dist bị ignore, dist.zip được theo dõi theo chính sách hiện có.

Chưa chạy toàn bộ regression, chưa dùng thiết bị thật hay bản lưu thật của người báo lỗi, chưa xác minh binding Pages REVIEWS_DB. Các lỗi kiểm thử cũ trong BACKLOG không thuộc phạm vi sửa visa. Không tuyên bố production-ready. Nhật ký có nhãn Đã phát hành theo yêu cầu trước của chủ dự án; nhãn không chứng minh website đã upload.

Commit trước: 14c2f0e87e2096a32e20dc0a06d1ef7fbd950021. Khi cần khôi phục nhánh dùng chung, revert commit sửa visa rồi chạy package:cloudflare; chủ dự án tự upload gói ổn định qua Dashboard. Không force-push hoặc reset lịch sử.

Kiểm cuối: regression-shard 55,72 đạt 22/22; browser trên chính dist ở 390/1280px đạt, gồm làm mới thẻ visa cũ, lối mở trong Học tập, chuẩn bị, lưu/tải, nhập học PhD và nhật ký đủ 4 ý, tìm không dấu, bộ lọc và tải thêm. Trình dựng lịch sử chạy kiểm trong bộ nhớ giữ nguyên toàn bộ 129 mục; JSON và dữ liệu nhúng dist đồng nhất.

package:cloudflare PASS: 28 file, ZIP 2.670.051 byte, SHA-256 BD26290E8DA4C37FF3DA096846192BF4298BE7FCA36EA9E4C483C519CAE59424; đọc lại toàn bộ entry khớp tên/nội dung với dist, loading và admin/Worker cục bộ đạt.

GitHub: origin mercyx03/motdoi là public, connector xác nhận quyền push/admin; nhánh codex/life-context-upgrade khớp commit trước bản sửa. Checkout không có workflow GitHub; deployment hook bên ngoài và binding thực tế chưa xác minh. Không thay remote hoặc cấu hình, không merge main, không deploy.
