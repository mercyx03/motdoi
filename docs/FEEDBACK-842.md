# Nâng cấp theo góp ý 8.10.42

Không mở giai đoạn mới. Trạng thái: HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN. Artifact Preview.

## Phạm vi

- life113/life106: tách hướng dẫn, chỉnh sửa, gửi bài khỏi thực nghiệm; ba lượt gửi/năm (tính cả từ chối), giới hạn dữ liệu 1–4 hướng/công trình, lưu cũ có completed vẫn dùng được. Chỉnh sửa tăng chất lượng, không tự tăng tiến độ hoặc bằng cấp. Chuẩn bị sau đại học tối đa ba năm giúp xác suất bảo vệ, giữ thời gian học.
- romance912: khoảng cách theo nơi sống riêng, không suy từ quốc tịch. Bản lưu cũ không bị gán yêu xa tùy tiện; nhân vật xác nhận hoàn cảnh học/làm xa qua menu. Bốn cuộc hẹn có tác động/năm, kiểm tra đúng người/năm/chống replay, chi tiền khi gặp thành công; thăm trực tiếp chỉ trong nước, người lớn. Có đồng thuận, chờ chuyển chỗ ở, khả năng hoãn và xa cách nếu mất liên lạc.
- life124: 34 hình thức tham khảo chia năm nhóm, hai buổi/năm, phí/quỹ dự phòng, năm chủ đề, phản hồi và nhìn lại năm sau. Đây là cơ chế tham khảo theo biểu tượng, không phải bộ máy lập lá số thực từ giờ sinh. Sáu lễ gia đình riêng lượt, sáu mục đích cầu nguyện chung một chuyến/năm, sáu hướng tín ngưỡng. Truyền thống/căn số là diễn giải văn hóa, không lời khẳng định năng lực siêu nhiên; nhân vật có thể tự nguyện tham dự sau hai năm tìm hiểu. Con có trạng thái riêng và giữ qua kế tục, không gán căn số cho tất cả con. Không phạt vì từ chối hầu lễ; bất an có thể giảm nhờ trao đổi hỗ trợ. Hành vi ép tiền có hồ sơ xác minh qua hai bước/năm trước hậu quả pháp lý mô phỏng, không gán tội cho tín ngưỡng.
- Worker: migration schema 2 → 3, thêm author_name; bổ sung tên các tài khoản còn sống, lưu tên tại lúc đăng và ngay trước xóa trong cùng batch. Tài khoản còn tồn tại tiếp tục hiện tên hiện tại; tên dự phòng chỉ dùng khi tài khoản biến mất. Tài khoản đăng ký lại không nhận bình luận của ID cũ; tài khoản xóa không giữ quyền admin.

## Giới hạn nghiệm thu

Không có thay đổi Production/DNS/D1. ZIP không cấu hình binding REVIEWS_DB; cần chủ dự án giữ binding hiện có. Tên đã mất do xóa tài khoản trước migration không thể suy ra từ dữ liệu còn lại. Không tự phục hồi bằng tên đoán hoặc đọc database Production.

Workspace có sửa đổi healthsys919.js và các test của chủ dự án từ trước; không stage hay sửa các đường dẫn này. Build từ workspace sẽ chứa thay đổi sức khỏe hiện có, vì vậy ZIP không phải bản dựng sạch chỉ từ commit mới.

## Kiểm thử

- Chuyên đề feedback842: 138 kiểm tra; comment-author842: 17 kiểm tra, gồm migration v2, tài khoản đã xóa, tên đổi và đăng ký lại.
- Smoke 11/11; saves-compat 10/10; save-safety 10/10; NPC 14/14. Cảnh báo cũ: seed theo giờ thực và quyết định Hardcore cũ không còn tồn tại, không báo là lỗi mới.
- Regression liên quan PASS: expansion842 (357), adult106 (105), romance912 (114), world120 (74), relationships108 (76), community-speed (11), inbox-client (6), notifications (9), review126 (5), update-release (873).
- community.js FAIL ở assertion tiêu đề nhật ký <=85 ký tự. Đối chiếu HEAD xác nhận cùng năm mục cũ: md4b-beauty-star-823 (91), household-policy-820 (111), state-career-source-cadre-fix-818 (117), countries-crime-organ-integrity-817 (139), school-assets-romance-upgrade-812 (96). Không sửa lịch sử cũ để vượt test, không tính nhóm này PASS.
- Browser Chrome headless: năm menu và nhật ký, kích thước 390/1280; tìm kiếm không dấu, bộ lọc, tải thêm, điều hướng đến phương pháp. Không tràn ngang, không lỗi JavaScript. Ảnh trong .cache/feedback842-browser. Đây không phải kiểm tra trên điện thoại thật.
- Đối chiếu giữ nguyên 101 mục biên tập và 165 mục dữ liệu cũ; mục mới đứng đầu. Build loading so sánh 8 cuộc đời nguồn/bản nén, API admin dùng DB bộ nhớ. ZIP đọc lại đủ tên và SHA-256 mỗi tệp.
- Chưa chạy regression toàn bộ, thiết bị thật và save người góp ý; chưa xác minh Pages REVIEWS_DB. Không tuyên bố Production-ready.

## Git và khôi phục

Remote origin: https://github.com/mercyx03/motdoi.git, repository public, connector xác nhận quyền push. Nhánh codex/life-context-upgrade, HEAD trước thay đổi 5f8ad13f18f9244045ee8a6255cf3fba1e32cb97. Nhánh remote trùng HEAD trước thay đổi; không có thư mục .github/workflows trong checkout, đọc .github trên nhánh remote trả 404. Không thay đổi cấu hình triển khai. Liên kết webhook bên ngoài và cấu hình Cloudflare không được kiểm chứng.

Nếu cần quay lại giao diện/game, chủ dự án dùng gói ổn định trước đó qua Dashboard hoặc checkout commit trước trong bản sao riêng rồi chạy npm run package:cloudflare. Không reset hay ghi đè workspace đang có sửa đổi. Cột author_name là bổ sung; giữ cột/dữ liệu này khi quay lại Worker cũ, không xóa DB.
