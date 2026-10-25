# Rà soát bản hiện tại — 25/10/2026

## Các nhóm tính năng mới đang có

- Gia đình: chuyển đời và di chúc, nhận nuôi, nơi sống của con sau ly hôn, ông bà chăm cháu, họp phụ huynh, đám cưới của con, lễ Tết/sinh nhật, hồ sơ bạn đời và cháu.
- Tình cảm: tính cách bạn đời, sự kiện hôn nhân, phản đối từ gia đình, xu hướng tính dục và việc con chia sẻ khi trưởng thành, hỗ trợ tự nguyện và quan hệ chu cấp.
- Mạng xã hội: ứng dụng riêng của người chơi, các chủ đề kênh, game cụ thể, video/Shorts/Reels/Story, viral, tiền video, hợp đồng review và quảng cáo, thiết bị/nhân sự/phòng thu, bạn bè sáng tạo nội dung.
- Doanh nghiệp: 11 ngành, vốn và cổ phần, ban điều hành, phát hành cổ phiếu, chính sách cổ tức, tập đoàn và vai trò chủ tịch.
- Ngoại hình và sức khỏe: chỉ số cho nhân vật/bạn đời/con, chăm sóc và tập luyện, nha sĩ/tái khám/điều trị, liên hệ giữa danh tiếng mạng xã hội và công việc.
- Học tập/nghề nghiệp: điểm thi theo thành tích, học lại/bổ túc, lộ trình nghề, công vụ và trách nhiệm cộng đồng.
- Giao diện/tài khoản: QR ủng hộ, thông báo bình luận, đồng bộ tiến trình, xác nhận khoản chi lớn, lịch sử cập nhật.

Hai thay đổi Anh giáo trước đó đã được hoàn tác. Module life133 hiện là doanh nghiệp, không phải module Anh giáo đã xóa.

## Lỗi đã sửa trong lần rà soát

1. Tiếp tục bản lưu giữa năm: ứng dụng trước đây luôn gọi beginYear rồi có thể chạy lại finishYear, dù năm đã tính tiền/sự kiện. Khi _yearRun đã bật, nay tiếp tục lựa chọn đang chờ hoặc thanh thời gian; không tính năm lần nữa.
2. Đồng bộ mạng xã hội ở trang không tải engine: applyLocal trước đây bỏ qua cấu hình máy chủ. Nay dùng kho cục bộ dự phòng và giữ timestamp gốc; dữ liệu không hợp lệ không ghi đè.
3. Ngoại hình con nuôi: mã kiểm tra adopt trong khi bản lưu dùng adopted. Nay nhận cả hai dạng, không tính di truyền từ cha mẹ nuôi.
4. Kiểm thử ghế chủ tịch, nhiệm kỳ công vụ và đáo hạn tiết kiệm gọi theo vị trí hook nên lệch khi thêm module. Nay kiểm tra đúng chức năng. Khôi phục vòng kiểm thử tự phát sự kiện gia đình bị dính trong dòng chú thích.

## Hai lỗi trong ảnh trước đó

Commit 873bce4 đã sửa mục mạng xã hội trên trang Cập nhật, lời thoại bố mẹ theo tuổi, hiển thị các lựa chọn cuối năm ngay trong năm và dọn lựa chọn quá hạn từ bản lưu cũ. Đợt này bổ sung kiểm thử tình huống bố Huỳnh Hữu Thắng với nhân vật 7 tuổi: lời thoại không còn kế hoạch người lớn, lựa chọn được xử lý và không báo hết hạn.

## Kiểm thử đạt

- Gia đình: 3.970 kiểm tra ở bộ family830; family104, family126, family129, family130 cũng đạt.
- release850: hồ sơ/lựa chọn, doanh nghiệp, thi cử, thế giới và tính liên tục bản lưu đều đạt.
- Ngoại hình: 75 kiểm tra và kiểm tra độc lập ngoại hình con nuôi.
- Mạng xã hội: hoạt động, thu nhập, hợp đồng, cấu hình riêng, đồng bộ có/không engine, tuổi và chống nhận tiền lặp.
- logic844, notifications, community-speed, inbox-client, relationships108/841, payment-ui126, budget-ui126.
- careers105 (355), adult106 (105), career109 (698), public116 (53), civic118 (46), feedback843 (253), expansion842 (357).
- community (151), update550 (60), update651 (80), update690 (34).
- resume135: tải lại giữa năm không chạy lại mô phỏng, tình huống cha con ở tuổi 7.

## Giới hạn

Bộ regression.js toàn bộ đã khởi chạy ở chế độ native nhưng dừng trong giai đoạn mô phỏng hàng loạt; chưa có kết quả cuối và không được tính là đã đạt. Các bộ kiểm thử chuyên biệt nói trên đã chạy xong. Không khẳng định toàn bộ game không còn lỗi; lần rà soát này không kiểm tra trực tiếp Safari iPhone hoặc dữ liệu tài khoản thật trên máy chủ.

Bản đóng gói: build đạt; loading.js đạt (28 tệp, 8 cuộc đời nguồn/bản nén giống nhau); admin-events đạt (1.472 mục, kiểm tra quyền); dist.zip đã đối chiếu từng byte với đủ 28 tệp build.
