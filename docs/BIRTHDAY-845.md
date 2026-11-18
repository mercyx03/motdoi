# Khôi phục chọn đồ thôi nôi 8.10.45

HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN. Không mở giai đoạn mới.

Nguyên nhân: showDecision tự giải mọi lựa chọn dưới4 qua E.infantAuto. Nay ngoại lệ đúng thoi_noi ở tuổi1; các hành động chủ động khác vẫn bị khóa dưới4. Chế độ minorOnly không tự bốc lễ này, full auto vẫn dùng E.autoKey ổn định đã có. beginYear ưu tiên đưa lễ vào hàng đợi ở tuổi1 (VN/World, normal/Hardcore), không phụ thuộc may rủi với sự kiện khác. Hàm add chặn lễ đã có world120.infantDone, tránh hiện/cộng thưởng lại. Bản lưu tuổi1 đang chờ lựa chọn có thể tiếp tục chọn; lễ đã xử lý ở bản trước giữ nguyên, không quay lại thời gian hoặc xóa kết quả.

Chuyên đề birthday845:96 kiểm tra trên VN/KR/JP/US và normal/Hardcore, hàng đợi một lễ, chọn tay, save/reload, không thưởng lặp, giới hạn tuổi khác giữ. Smoke11/11, saves10/10, save-safety10/10, NPC14/14 đạt; regression life844(116), growing-up839, expansion842(357), royal843(59), update-release(886) đạt. Cảnh báo cũ về ID thời gian thực và quyết định Hardcore cũ không còn giữ nguyên, không tính là lỗi mới. Chrome headless390/1280 kiểm tra bảng bốc đồ ở chế độ thường/minorOnly, đợi bảng không tự biến mất, bấm bút và xác minh lưu; nhật ký packaged, tìm kiếm không dấu, bộ lọc, tải thêm và không tràn ngang đều đạt. Ảnh .cache/birthday845-browser.

Build loading đạt28 tệp và8 cuộc đời nguồn/bản nén; API admin dùng DB bộ nhớ. ZIP3.236.781 byte, SHA-256220AE289B0FBED47E35A7C67CA1428736BF3F918189549F3CBD72EF0F6CC7564; đọc lại từng tên/nội dung ZIP bằng SHA-256 so với dist. Nhật ký JSON/HTML build có8.10.45 packaged,8.10.43/44 giữ released,8.10.41 vẫn ẩn.

Git origin mercyx03/motdoi public, quyền push được connector xác nhận; nhánh codex/life-context-upgrade, remote trùng cfacb18 trước push. Không đổi workflow hay cấu hình triển khai.

Không thay API/Worker/D1; không deploy. Chưa regression toàn bộ, thiết bị thật, save thật hoặc Pages binding. Workspace có healthsys919.js và test sửa sẵn, không sửa/stage chúng; ZIP từ workspace có phần sức khỏe có sẵn này.

Khôi phục: cfacb18 (bản trước); dựng tại bản sao riêng và upload Dashboard, không reset workspace có sửa đổi.
