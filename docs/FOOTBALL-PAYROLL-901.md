# Sửa lương cầu thủ — 8.10.3 (29/10/2026)

Trạng thái: HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN.

## Nguyên nhân và thay đổi

Lương bóng đá trả về từ hợp đồng đã khấu trừ 15% thuế/phí, nhưng bị cơ chế cân bằng thu nhập chung giảm tiếp (phần thu nhập cao chỉ còn hệ số 0,28), rồi còn có thể chịu các hệ số chấn thương/giảm nhịp làm việc. Bỏ giảm chồng cho hợp đồng cầu thủ đang có hiệu lực; thưởng ra sân vẫn phụ thuộc số trận. Dòng góp tiền của bạn đời và các nghề khác giữ cơ chế hiện có.

Quyết toán năm tiếp nhận lương ròng vào tài chính cá nhân, sinh hoạt tính riêng. Lương 9,8 triệu/tháng có phần lương ròng 8,33 triệu/tháng trước sinh hoạt, chưa gồm thưởng. Hồ sơ hiển thị lương cơ bản trước/sau khấu trừ và có dòng thuế/phí âm trong bảng thu nhập.

Chỉ ghi đã trả khi đủ điều kiện nhận lương; dấu đã trả sai trong bản lưu cũ không có quyết toán tương ứng không chặn lần trả hợp lệ. Khôi phục tự lập cho cầu thủ chuyên nghiệp có hợp đồng để tham gia luồng tài chính. Không truy lĩnh các năm cũ do không đủ lịch sử đáng tin cậy; không phát sinh lần trả trùng khi nạp bản lưu đã có quyết toán.

## Kiểm thử đã đạt

- tests/football-payroll901.js: hợp đồng Real Madrid và Việt Nam, 15%, chấn thương/sức khỏe, quyết toán cá nhân thực, cân đối sổ tiền, thưởng ký một lần, hết hạn, ký sau lần kiểm tra chưa có lương, dấu đã trả sai cũ, migrate và chống nhận trùng.
- tests/football-career.js: 179 assertions; tests/football897.js: luồng ký, nghề nghiệp, payroll, migration.
- tests/depth899.js: 555 checks; tests/depth900.js: 58 checks; tests/logic844.js: 9 checks. Hai test cũ được cập nhật: admission phải xin visa trước khi nhập học; hàm finance trích riêng cần truyền inVN trong test harness.
- Smoke: 11/11; saves-compat: 10/10; save-safety: 10/10; npc-identity: 14/14. Cảnh báo đã biết về ID theo thời gian thực và thẻ Hardcore cũ bị loại giữ nguyên.
- tools/logic-audit.js 40: không phát hiện vấn đề theo các tiêu chí tự động trong 40 đời; đây không phải kiểm chứng mọi logic game.
- tests/update-history-timezones.js và tests/update-release.js (476 checks): PASS, lịch sử cũ giữ nguyên.
- Chrome 390/1280: football897-browser.js PASS; hồ sơ thực hiển thị lương ròng và phí; nhật ký mới đầu danh sách, packaged, tìm không dấu, bộ lọc, tải thêm, không tràn ngang/lỗi runtime. Script và ảnh kiểm tra bổ sung ở .cache/payroll-*. Không commit dữ liệu người chơi thật.

## Phát hành và giới hạn

Nhật ký football-payroll-901 ở trạng thái packaged/releasedAt=null. Chưa chạy regression toàn diện trên mã cuối; ghi phần còn thiếu vào GĐ6 docs/BACKLOG.md. Build Direct Upload dùng npm run package:cloudflare; kiểm loading, API admin cục bộ và so toàn bộ ZIP/dist. Binding REVIEWS_DB Production chưa kiểm chứng; không thay database/DNS/project, không deploy. Chủ dự án xác nhận không push vì chưa rõ tác động tự triển khai; chỉ commit và giao ZIP.

Phiên bản trước: e0429be. Nếu cần quay lại, chủ dự án dùng ZIP của commit đó để upload Dashboard; nếu cần hoàn tác mã, tạo commit revert thay vì sửa lịch sử. Không khôi phục database từ ZIP.
