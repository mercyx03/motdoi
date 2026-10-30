# Một Đời — Đang nghiệm thu GĐ6 / sửa liên tục đời con, visa và ngoại ngữ 8.10.6

Trạng thái: đã triển khai các sửa lỗi; kiểm thử trọng điểm đạt. Chưa nghiệm thu toàn diện / chưa đánh dấu production-ready vì hồi quy nguyên khối còn lỗi và quá hạn. Không deploy Production.

## Phạm vi và hành vi

- `life96.js`: sau khi dựng lại những năm đã qua, chép lại ngoại hình của đúng người con, học lực vào kiến thức và các chỉ số `st`/chỉ số có số liệu đã ghi; không dùng số ngẫu nhiên dựng lại để ghi đè số đã biết. Giữ giá trị 0. Áp dụng chuyển đời khi cha/mẹ còn sống, đã mất và con ở tuổi 0. Các chỉ số chưa từng có dữ liệu không được công bố là một hồ sơ đầy đủ đã biết. Giữ luồng nghề, học vấn, tài sản, quà và nợ hiện có.
- `abroad-depth.js`, `life107.js`: nhắc hồ sơ thư nhận học tối đa một lần/năm, chống trùng thẻ đang chờ; để dịp khác đóng thẻ và tiếp tục chơi. Hồ sơ hết hạn hoàn học phí dự trù một lần. Thêm lối gia hạn cư trú riêng; nhắc trước hạn một năm và khi cần thu xếp. Có hợp đồng mới được xin chuyển sang lao động, không tự cấp định cư. Giữ thời gian chờ xét, phí và kết quả mô phỏng.
- `wealth.js`, `life-action-fixes.js`, `life111.js`: chọn tất cả ngôn ngữ hiện hỗ trợ ở mọi nước; Goethe vốn có trong dữ liệu nhưng trước đây bị giấu theo ngữ cảnh, nay chọn được trực tiếp. Bổ sung đường học tiếng Pháp mô phỏng vốn bị thiếu khi visa Pháp đã đòi tiếng Pháp. IELTS/TOPIK/HSK hết hạn có lối thi lại, kể cả đã đánh dấu hết hạn; không tạo kỳ thi hết hạn giả cho JLPT/Goethe. Bảo vệ sau đại học ở nước ngoài dùng ngôn ngữ chương trình. Đây là mô hình game, không phải quy định/chứng chỉ tuyển sinh hoặc nhập cư thực tế.
- `life62.js`, `residence-guards.js`: hoạt động quê Việt Nam phải ở Việt Nam; du lịch gần theo nơi cư trú. Chuyến nội địa đang dở từ save cũ được bổ sung dấu nơi cư trú. Nếu save cũ có gói nội địa Việt Nam tại nước ngoài, ngắt gói, gỡ thẻ và hoàn đúng khoản đã thu một lần nếu tiền tệ còn khớp. Không hoàn chuyến đã kết thúc, không đổi đơn vị tiền tùy ý. Concert ngẫu nhiên và chủ động dùng cùng nơi đến, chi phí đi lại, giới hạn trẻ em và kiểm tra khi đổi nơi ở; xem online vẫn được.
- `data-world.js`: bổ sung tra cứu TW cho tuyến lao động đã tồn tại, để gia hạn/về nước không văng lỗi. Không thêm vào 195 mục sinh ngẫu nhiên; dữ liệu nền là mô hình tương thích kế thừa, không công bố như một bộ thống kê kinh tế mới.
- Sửa các lỗi thấy khi kiểm tra rộng: menu có cả hành động trực tiếp lẫn nhóm con không bị rơi mục; tương tác được từng người thân, giữ hạn mức giao dịch; động viên bạn thân nối lại chuỗi hậu quả; thưởng người theo dõi minigame đồng bộ thống kê và nhật ký có lượt chơi phân biệt.

## Video và kiểm chứng

Đã đọc video do chủ dự án đính kèm ở máy cục bộ: Toronto nhưng chọn Hà Giang theo gói nội địa, rồi chọn nghệ sĩ Việt Nam. Không gửi video ra dịch vụ ngoài và không đưa video vào Git. Không có bản lưu thật của người trong video; kiểm chứng bằng trạng thái tổng hợp người Việt đang sống ở Canada và những nước khác, cả thẻ cũ khi đổi nơi cư trú.

## Kiểm thử và phạm vi còn lại

Kết quả chi tiết được bổ sung bên dưới khi các lệnh kết thúc. Không ghi nhóm đang chạy, lỗi hoặc timeout là PASS. Các fixture đều là bản lưu tổng hợp của bộ kiểm thử, không chứa dữ liệu người chơi thật.

Bộ hồi quy cũ cần bảo trì ở GĐ6. Không khôi phục Hardcore, tự làm hành động khi người chơi không chọn, giới hạn lượt cũ hoặc bỏ visa để đáp ứng kỳ vọng đã bị thay thế. Những sửa fixture trong đợt này giữ kiểm tra hành vi còn áp dụng: chứng chỉ còn hạn trước bảo vệ; đúng người bạn theo UID; hoàn thành minigame xen kẽ; các chương trình mới; nhập học qua visa; giữ lịch sử nhật ký khi có mục mới; API phản hồi cũ đã dừng. Không giảm số mẫu của hồi quy và không hạ ngưỡng thống kê để tính PASS.

## GitHub, artifact và vận hành

- Nhánh: `codex/life-context-upgrade`; remote `origin`: `https://github.com/mercyx03/motdoi.git`, repository public, quyền push/admin đã xác minh qua GitHub.
- Không có workflow `.github` đang theo dõi. Push nhánh hiện tại theo chỉ thị, không merge/force/deploy. Không xác nhận hook triển khai bên ngoài repository.
- Mốc trước sửa: `96edeff838005b26dab96f8235ab30c6f2668bff`.
- Build bắt buộc: `npm run package:cloudflare`; artifact gốc `dist/`, `dist.zip`, Direct Upload giữ `_worker.js`, `_routes.json`, `_headers`, file dấu chấm. Quy trình đọc lại từng tên file và SHA-256 so với dist.
- Nhật ký tĩnh mới đặt đầu docs/public và nhúng HTML; giữ nguyên 129 mục cũ. Nhãn Đã phát hành theo chỉ thị riêng trước đó của chủ dự án, không chứng minh website đã được upload. Không sửa D1 để công bố nhật ký.
- Binding Pages `REVIEWS_DB`, API/database Production, thiết bị Android/iOS thật và save của người báo lỗi chưa được kiểm chứng. Test API dùng database trong bộ nhớ. Không thay đổi project/DNS/database Production.
- Khôi phục: hoàn tác commit sửa lỗi bằng `git revert <commit-mới>` trên nhánh làm việc, đóng gói lại; chủ dự án upload gói trước đã giữ hoặc gói từ mốc trên qua Dashboard. Không reset/force nhánh chung; sao lưu bản lưu trước khi thử phiên bản.

## Kết quả đã kết thúc trước yêu cầu đi lại 907

- 154/154 tệp kiểm thử không dùng browser đạt trên mã 906 cuối; đã chạy lại 6 bài nhật ký sau khi dist đồng bộ. Không coi đây là hồi quy trên mã 907 bổ sung sau đó.
- Chuyên đề continuity906: 2.069 kiểm tra; visa905: 231; smoke 11/11, saves 10/10, save-safety 10/10, NPC 14/14. Browser khổ 390/1280: 11 tệp đạt trên dist, gồm lần chạy lại browser-feedback-b sau bổ sung chờ lazy loader.
- Hồi quy cũ: đủ 77 nhóm đã được gọi, 58 nhóm đạt, 17 nhóm lỗi, 2 nhóm timeout (5, 5b; 600 giây/nhóm). Không giảm số mẫu, không tính nhóm quá hạn là đạt. Nhóm 9 dừng do fixture nghề cũ truy cập job=null; không phải đã quét hết mọi phương án.
- Chạy lại nhóm 0: 415 đạt/0 lỗi sau cập nhật cách kiểm cache. Chạy lại nhóm 6 sau sửa concert: 257.062 đạt/1 lỗi do không quan sát thấy quyết định major cũ; không còn báo undefined ở concert. Không tính cả nhóm này PASS.
- Còn cần đối chiếu: đoạn kết bệnh/tưởng nhớ, lặp lời kể, người đã mất bị nhắc như còn sống (nhóm68 có 1 trường hợp), mẫu tìm nhiều con, hiệu chuẩn xác suất/nhịp sự kiện. Một số lỗi khác là kỳ vọng cơ chế đã đổi (lượt hành động, nghề bóng đá, menu, gia nghiệp, chuẩn ngoại ngữ). Chưa đánh dấu tất cả là lỗi test cũ để bỏ qua.
- Danh sách nhóm, số assertion và chẩn đoán: CONTINUITY-906-RESULTS.json. Yêu cầu mới 907 tiếp tục kiểm thử trên mã mới; nghiệm thu GĐ6 chưa đạt, không production-ready.
