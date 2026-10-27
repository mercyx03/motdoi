# Một Đời — nghiệm thu nâng cấp doanh nghiệp và văn phòng gia đình

Ngày kiểm tra: 28/10/2026 (Asia/Saigon). Nhánh codex/life-context-upgrade.
Trạng thái: hoàn thành triển khai, nghiệm thu tích hợp và đóng gói đạt. Kết quả commit/push thực tế ghi trong báo cáo bàn giao.

## Phạm vi

- A–E trước đó: giữ nền tảng gia cảnh, tài chính người thân, truyền thông/K-pop, chuyển nhượng/nhượng quyền; không làm lại các mục đã PASS. Đối chiếu ENTERPRISE-UPGRADE-PROGRESS.md.
- B: báo cáo năm, phân bổ chi phí công bố rõ, dòng tiền ba nhóm, so sánh và biểu đồ 10 kỳ.
- C–E: bảy chiến lược nhiều năm, quy mô nhân viên, lương/thưởng/đào tạo, năng suất/lòng tin/chất lượng/quản trị và đánh giá theo số liệu.
- F: bảy nhóm tình huống lãnh đạo, định danh ổn định, chi phí thật, bàn giao/nghỉ việc và biểu quyết gắn giao dịch thực.
- G–H: bảy chương trình thực tập 2–3 năm; 13 lĩnh vực cố vấn, khóa 6 tháng/1/2/3 năm; lưu tiến độ, kết quả, trợ cấp và lịch sử học.
- Bổ sung: quản gia dinh thự, người phục vụ, sáu chức danh trợ lý/văn phòng gia đình, hợp đồng/lương/nghỉ hưu/đề cử người thân cần duyệt; từng nhiệm vụ/budget ủy quyền.
- Tiệc: sáu cấp, mục đích, địa điểm, số khách, mời NPC riêng, năm nhóm dịch vụ; duyệt dự toán và dự phòng, rủi ro/danh tiếng, lưu người dự để gặp lại.

## Quy tắc mô phỏng cần biết

Tiền mặt công ty là một phần tài sản công ty, không cộng thêm vào tiền người chơi. Công ty cũ phân bổ đầu kỳ 25% vốn thành tiền mặt; không dựng báo cáo quá khứ. Doanh thu theo mô hình ngành, giá vốn/marketing/nghiên cứu là phân bổ có giải thích. Quỹ lương từ nhân sự, ban điều hành từ vai trò; khấu hao và tổn thất từ dự án. Các mục phân bổ không thu tiền lần thứ hai.

Lợi nhuận sau thuế = doanh thu − giá vốn − lương/chi phí vận hành/quản lý − khấu hao/tổn thất − lãi vay − thuế mô phỏng. Chi đầu tư tài sản đi vào dòng tiền đầu tư; khấu hao không chi tiền lần nữa. Khoản vay/vốn góp, trả gốc và cổ tức nằm ở tài trợ. Mỗi báo cáo đối chiếu tiền đầu kỳ + kinh doanh + đầu tư + tài trợ = tiền cuối kỳ. Cổ tức giới hạn bởi lợi nhuận giữ lại và tiền sau dự phòng. Chuyển dịch định giá không phải dòng tiền.

Khóa sáu tháng tổng kết tại bước sang năm vì engine dùng năm. Thực tập dành con 18–35 tuổi chưa có việc/chương trình học không tương thích. Người thân có thể từ chối. Học xong không tự bổ nhiệm CEO. Các chương trình và quyền cổ phần là hai việc riêng.

Lương riêng trả từ tiền cá nhân; công việc ủy quyền có hạn mức tách riêng. Không tự ký thương vụ lớn hoặc chuyển tài sản. Trợ lý báo cáo/gợi ý và mở đúng luồng duyệt có sẵn. Quản gia cần dinh thự thuộc sở hữu; nghỉ hưu báo trước, ứng viên không tự nối chức vụ. Tiệc dùng cùng giới hạn hai dịp/năm, mỗi mục đích một lần; phát sinh nằm trong khoản dự phòng đã được duyệt.

## Bằng chứng

Xem bảng kiểm trong ENTERPRISE-UPGRADE-PROGRESS.md. Các test mới có đối chiếu tiền, quyền hạn, tính một lần/năm, lưu/tải, tuổi, danh tính, kế nhiệm và hậu quả nhiều năm. Năm chuỗi tích hợp có kiểm thử thực thi, không chỉ lời kể.

Không chạy lại toàn bộ 77 nhóm cũ theo yêu cầu của chủ dự án. Hồi quy đã chạy tập trung vào hệ thống bị thay đổi. Bản lưu kiểm thử là fixture tạo bởi engine cũ; chưa có mẫu thật của người chơi. Cảnh báo cùng seed nhưng giờ thật tạo life.id khác là vấn đề đã biết, không sửa ID để che cảnh báo.

## Artifact cuối

Production build và package:cloudflare PASS. dist/ và dist.zip tạo mới: 28 tệp, ZIP 2.511.045 byte. SHA-256: BDCB3BC3FA43C9BC4326FB34FB5B3F5937D977EE26D7BE7DCE2673095F8B1327. Toàn bộ tên/nội dung ZIP khớp dist. Loading 8 cuộc đời nguồn/bundle, API local và Chrome trên dist tại 390/1280 đều đạt. Chủ dự án có thể dùng gói để Direct Upload; cần kiểm tra binding thực tế cho API.

## Phát hành và phục hồi

Chỉ chủ dự án upload. Không deploy, merge main, đổi DNS hoặc database. Gói cần REVIEWS_DB trên Pages cho tài khoản/bình luận; kiểm API local không xác nhận binding thực tế. Nhật ký tĩnh không dùng D1. Chỉ đổi trạng thái phát hành khi chủ dự án xác nhận thời điểm upload.

Checkpoint trước phạm vi tích hợp: 8081574. Có thể tạo checkout riêng từ commit đó, chạy package:cloudflare và tự upload gói phục hồi. Không reset/force-push nhánh đang làm và không động tới ba tệp cá nhân.
