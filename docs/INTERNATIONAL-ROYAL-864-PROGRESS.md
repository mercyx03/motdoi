# Bối cảnh quốc tế và đời sống hoàng gia — mốc64

Đây là mốc triển khai tiếp, KHÔNG phải hoàn tất toàn bộ yêu cầu. Tiếp tục theo docs/REMAINING-863-PROGRESS.md.

- international864 mở rộng CULTURE173/CHILDHOOD898 và quyết định hiện có. Chọn nơi cư trú, tín ngưỡng và gốc Việt được ghi trong hồ sơ; không mặc định nghi lễ Việt Nam cho195 nơi sống. Gốc Việt/tự học tập tục vẫn được giữ tự nguyện. Không mặc định mọi công dân cùng một tôn giáo.
- Thêm lịch lễ theo local/faith/origin hiện có; giữ provenance của dữ liệu. Một nguồn gắn với profile không có nghĩa từng câu đã được xác minh ngoài đời.
- Buổi vườn hoàng gia có xin phép/người chăm sóc, không dùng cơ chế trộm quả. Sửa dịp lễ cho vai trò quân ngũ/chấp hành án/xa nhà; chặn lễ1/6 bắt buộc và mâm rượu tuổi thơ Việt Nam ở nơi khác.
- royal864 nối scenes860 với ba chủ đề theo tuổi ở27nước; chúng là chủ đề gia đình hư cấu theo bối cảnh, không là nghĩa vụ pháp lý/tập tục bắt buộc. available/valid860 cùng chặn sai quốc gia.
- Hồ sơ court864 dùng CHAIN144 bốn giai đoạn qua ít nhất5năm: kiểm chứng, ý kiến thành viên, kết luận thử, xét lại. Có chi phí quỹ riêng hữu hạn, bằng chứng khác lời kể, ủng hộ/phản đối dựa quan hệ, sức ép gây mất tin cậy.
- Mọi người dùng memberID920. Hồ sơ/vai trò nằm trong house để snapshot/restore hiện có remapID qua thế hệ; seq gia tộc chống đụng ID chuỗi giữa các đời. Vai trò dự án không là chức vụ nhà nước, không truyền ngôi hoặc cấp tước.
- Chặn mở lặp, token lặp, người tham gia qua đời, rời hoàng gia, vắng thời gian; đổi ngôi phải xét lại; hết thời gian thử chuyển chờ xét lại.
- international864852, royal864808, royal860153 kiểm tra đạt. Kiểm tra bổ sung/build ghi sau khi chạy.

Còn tiếp tục: dữ liệu giáo dục chi tiết, ngoại lệ tước châu Âu, Monaco trước2002/2015 và nhiếp chính mất khả năng/hai hội đồng, Tây Ban Nha lịch sử/họ/nhiếp chính/chuyển tiếp. Không deploy, không coi mốc này là nghiệm thu toàn diện.

## Kiểm tra mốc64

- Smoke11/11, saves10/10, save-safety10/10, NPC14/14 PASS; cảnh báo legacy hc_story và seedDate.now được giữ rõ.
- feedback842138, childhood859855, childhood898229, family13067, chains-gd4192 PASS. Fixture chains bỏ cả module phụ thuộc860/864 hai phía phép cô lập; không nới điều kiện gameplay.
- Browser nguồn8menu/action390/1280 PASS, nhật ký tìm không dấu/lọc/tải thêm.
- package:cloudflare PASS28files, ZIP3451202bytes, SHA25698403046AB4AA3D554BCA92E405314C615701314304150E85A28CDD32DB2DBCB. Hash toàn bộZIP/dist trùng; loading/tám đời source-build và adminAPIcục bộ đạt. REVIEWS_DBProduction chưa xác minh.
- Remoteoriginmercyx03/motdoi public, push/admin được xác minh;0workflow/0hook/0deployment. Không deploy. Artifact chứa healthsys919 có thay đổi ngoài phạm vi không stage.

- Browser bản dist cũng8menu/action390/1280PASS, đã xem ảnh royalCourt864 điện thoại; update-release1083 và update-history-timezonesPASS; JSONsource/dist vàHTML đồng bộ,186mục cũ nguyên dữ liệu.
