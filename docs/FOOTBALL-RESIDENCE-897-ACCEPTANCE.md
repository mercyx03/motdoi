# Bóng đá và cư trú 8.9.7 — nghiệm thu trọng điểm

Trạng thái: HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN.

## Phạm vi

- Đồng bộ năng khiếu bóng đá có kiểm soát, không lấy điểm của ngành khác; tối đa ba CLB đàm phán/năm, một lần/CLB. Hiện điều kiện và kết quả, xem hợp đồng trước khi ký, không mất lượt khi chỉ xem.
- Hợp đồng chuyên nghiệp phục hồi nghề vận động viên bị thiếu, giữ lịch sử, không tìm việc tự động; lương chỉ trả một lần/năm. Ký đổi nghề có lựa chọn rõ, kiểm tuổi và đi lại trước khi sửa trạng thái.
- Kiểm nơi cư trú cho thi cử/công quyền Việt Nam, dữ liệu lựa chọn cũ sau chuyển nước, sự kiện địa phương, bầu cử và tác động chính sách. Đi concert xuyên biên giới có chi phí/điều kiện, giữ xem trực tuyến. Chương trình phổ thông trực tiếp được bảo lưu khi chuyển nước, không tự cấp bằng.
- Nhật ký mới và các mục packaged chuyển Đã phát hành theo yêu cầu trực tiếp của chủ dự án lúc 2026-10-28T22:40:12+07:00. Đây là cập nhật nhãn trong artifact bàn giao, không xác nhận upload. Không deploy, không sửa D1.

## Kiểm thử

PASS: football897, residence897; football-career179, country-survival273; actions894; smoke11/11; saves-compat10/10 (60 mẫu), save-safety10/10, NPC14/14. World12074, civic11846, world-culture173854; country-minimum16418, country-depth1210; regression nhóm13,14,26,36,52,72,73:513 đạt/0 lỗi. Update-release397 kiểm tra.

Chrome nguồn:390/1280, click thật chọn thị trường/CLB/đàm phán/lời mời/ký, kết quả hiện trực tiếp, lượt, nghề chính, reload, không tràn ngang/lỗi runtime. Chrome dist và kiểm build/ZIP được xác nhận trong báo cáo bàn giao sau đóng gói.

Hai kiểm thử cũ adult106 và public116 FAIL giống nhau khi chạy đối chiếu mã HEAD trước đợt sửa (đọc mã cũ trong bộ nhớ, không reset checkout). Adult106 thiếu khung bảo vệ tiến sĩ ở mốc test cũ; public116 còn kỳ vọng trần lương Hardcore trong khi chế độ đã bỏ. Không tính hai bài này đạt, không nới assertion. Cần bảo trì riêng trong GĐ6.

## Giới hạn và khôi phục

Chưa chạy regression toàn bộ, chưa có mẫu lưu thật của người báo lỗi, chưa kiểm iOS/Android thật hoặc binding Pages REVIEWS_DB. Không khẳng định đã bắt mọi tình huống địa phương trong game; các quy tắc mới nằm ở registry cư trú và các cơ chế liên quan.

Mốc trước:1b74a1104833a15ae3bf5a6a15993f8a519e8099. Khi cần, revert commit đợt này, đóng gói lại và chủ dự án upload thủ công; không force push. Giữ nguyên audit-world-520.json, .local-state-review.txt và Claude.md của chủ dự án.

## Kết quả artifact cuối

package:cloudflare PASS:28 file triển khai; ZIP2.597.236 byte, SHA256 B26C88786E3D09338A4B074D8B177793D8FD20BC6C131560BB7E971BD7AA3937. Đã đọc lại mọi entry và đối chiếu nội dung với dist. Loading/hash/font/SEO/cache, tám cuộc đời nguồn so mã nén và admin catalogue1578 mục đạt.

Chrome dist390/1280: click luồng bóng đá, lưu/tải, nghề chính, số lượt, kết quả trực tiếp, không tràn ngang/lỗi runtime đạt. Trang cập nhật: mục897 đầu, nhãn Đã phát hành và tìm không dấu đạt ở cả hai cỡ. Chrome dist kiểm khung thi Việt Nam cũ, hoạt động nơi cư trú, concert xuyên biên giới/người vị thành niên và gọi video gia đình đạt. Nhật ký JSON/HTML nhúng/ZIP khớp, không còn packaged.

Chưa sẵn sàng nghiệm thu Production toàn diện theo chính sách dự án; chủ dự án tự upload.
