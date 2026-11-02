# Nghiệm thu Di truyền nhóm máu và Sau hiến910

30/10/2026, UTC+7. Phạm vi theo yêu cầu chủ dự án, không mở giai đoạn mới. HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN.

## Thay đổi và tương thích

Mở rộng blood-donation909 và gia đình108/908, không tạo menu hiến thường ngày thứ hai. Kiểu gen ABO nhận một alen từ mỗi người sinh học; D/d là mô hình giản lược, không mô phỏng mọi biến thể Rh/weak D. Nhóm máu có sẵn trong save luôn giữ nguyên, bổ sung kiểu gen phù hợp kiểu hình, không suy ngược huyết thống. Con nuôi có nhóm riêng; thai kỳ lưu alen và người đồng sinh, không lấy người bạn đời hiện tại thay người sinh học. Chuyển đời giữ kiểu hình/kiểu gen của con; giấy chứng nhận vẫn thuộc người hiến. Bản lưu cũ có lịch sử hiến không bị tự bịa kết quả xét nghiệm hoặc vận chuyển.

Nhân vật mới chưa có nhóm dùng hai bộ tham số mô phỏng: Việt Nam/Đông Á A=.15, B=.19, O=.66, tần suất Rh âm=.001; nhóm phương Tây A=.25, B=.08, O=.67, Rh âm=.15. Lấy hai alen độc lập, nên bộ Việt Nam cho O43,56%, B28,69%, A22,05%, AB5,7%. Đây không phải khảo sát dân số chính xác; các nước khác nhau không đồng nhất và không dùng tuyên bố Rh âm15–40% chung cho người nước ngoài. Không làm lại phân bố của các nhóm đã lưu.

Đơn vị vừa lấy có trạng thái pending; phản hồi cố định theo ID, lưu/tải không bốc lại. Theo lịch hẹn365 ngày hiện có: toàn phần3–7 ngày, tiểu cầu1–3 ngày, bạch cầu hạt1 ngày; đây là thời điểm phản hồi trong game, không hướng dẫn bảo quản. Người chơi kiểm tra trong menu, tiến con trỏ ngày hẹn mà không tăng tuổi; kết quả quá hạn cũng xử lý qua năm. Ghi ngày/tháng/năm, nhóm máu, vận chuyển/sử dụng hoặc sự cố. Không thu hồi tiền/quà đã hiến vì lỗi vận chuyển; không trả thưởng lần hai. Phản ứng sàng lọc không thành bệnh trong l.ill; lời mời đối chiếu miễn phí và tạm hoãn tiếp nhận, không coi sàng lọc đạt là loại trừ mọi bệnh. Tâm trạng thay đổi nhỏ một lần. CBC hoãn ban đầu không phải lượt hiến, không phát tiền/quà/giấy, có thể buồn nhẹ hoặc bình thường.

Người hiến có thể bật/tắt nhận lời mời thiếu máu. Từ3 lượt, đủ tuổi/sức khỏe/cân nặng/khoảng cách, đang ở Việt Nam mới có cơ hội được gọi; không bỏ qua khám xét nghiệm, luôn từ chối được không phạt. Kịch bản bạch cầu hạt rất hiếm đòi ít nhất8 lượt tiểu cầu, sức khỏe90, cân nặng60kg, tuổi không quá50 và khoảng chờ bảo thủ; chỉ là ngưỡng thiết kế game. Có đánh giá chuyên khoa riêng, có thể hoãn; nếu phù hợp vẫn hỏi đồng ý/rút lui trước thủ thuật. Không tự tạo tiền/giấy bồi hoàn và không hướng dẫn tự dùng thuốc; sau hiến nghỉ ít nhất28 ngày trong mô phỏng. Chưa mô phỏng toàn bộ chống chỉ định, thuốc, liều huy động, xét nghiệm tương hợp hay theo dõi chuyên khoa ngoài đời.

Thai mẹ Rh âm/bố có thể truyền Rh dương có lời nhắc tư vấn sản khoa, lưu kế hoạch kiểm kháng thể, đánh giá thai và dự phòng theo chỉ định. Không tự chẩn đoán, gây bệnh, gây sẩy thai hoặc coi lần mang thai đầu chắc chắn an toàn. Kế hoạch giữ trong hồ sơ thai/con; chưa mô phỏng xét nghiệm thai RHD, anti-D có liều, mẫn cảm miễn dịch hay phác đồ thực tế.

## Nguồn đối chiếu

- [NCBI, hệ ABO](https://www.ncbi.nlm.nih.gov/books/NBK2267/), [NCBI, hệ Rh](https://www.ncbi.nlm.nih.gov/books/NBK2269/): quy luật alen cơ bản; bản HTML có chặn truy cập tự động, dùng tài liệu Bookshelf/PDF và thông tin nguồn chính thức bổ sung, không coi đã đọc toàn bộ sách.
- [NHS nhóm máu](https://www.nhs.uk/tests-and-treatments/blood-groups/): ABO và Rh. [ACOG](https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2017/08/prevention-of-rh-d-alloimmunization), [CUH NHS](https://www.cuh.nhs.uk/patient-information/-guidance-on-the-use-of-routine-antenatal-anti-d-prophylaxis-raadp-and-postnatal-care-for-rhd-negative-women/): khác biệt vùng, khoảng15% Rh âm ở Anh/Bắc Mỹ, nguy cơ mẫn cảm và chăm sóc sản khoa. Không suy ra40% toàn phương Tây.
- [NICE](https://www.nice.org.uk/guidance/htg420/chapter/2-Clinical-need-and-practice): đánh giá RHD và dự phòng anti-D theo chỉ định; không lấy tình huống mô phỏng làm tư vấn cá nhân.
- [Viện Huyết học, hướng dẫn nhận kết quả](https://vienhuyethoc.vn/huong-dan-nhan-ket-qua-hien-mau/): kết quả nhóm máu, sàng lọc đơn vị, tư vấn khi chỉ số cần xem lại và theo dõi hành trình. Tỷ lệ vận chuyển/sàng lọc lỗi và tâm trạng trong game là tham số thiết kế, không tỷ lệ y khoa.
- [NIH Clinical Center, granulocyte donation](https://www.cc.nih.gov/bloodbank/donation-types/donation-of-granulocytes), [Canadian Blood Services](https://professionaleducation.blood.ca/en/transfusion/clinical-guide/granulocyte-transfusion-therapy): người hiến cần đánh giá chuyên môn, quá trình phức tạp và nguy cơ cao hơn; không áp điều kiện hiến toàn phần đơn thuần hoặc tự dùng thuốc.

## Kiểm thử và giới hạn

- tests/blood910.js:10556 kiểm tra, mọi cặp6kiểu gen ABO ×3kiểu gen Rh và16tổ hợp lựa chọn alen; thống kê30000 mẫu; save cũ, sinh thật qua deliver108, đổi bạn đời, nhận nuôi, chuyển đời sống/mất và bắt đầu đời con từ lúc sinh; kết quả chậm/lặp/reload/qua năm, tư vấn miễn phí, Rh và đồng ý bạch cầu hạt.
- health-tax909:1071; relationships108:76; continuity906:2069; regression trọng điểm11/12 file PASS (chi tiết RESULTS). life138 dừng tại fixture cũ “sibling can succeed instead of player”; chạy lại với nguyên blood-donation ở commit619fcd8 vẫn lỗi y hệt. Không ghi bài đó PASS, không quy lỗi này cho di truyền; cơ chế kế vị hiện tại được kiểm trong dynasty908/heir-family770. Chưa nghiệm thu toàn bộ GĐ6.
- Chrome390/1280: thông báo chờ, nhận kết quả, reload, tư vấn miễn phí không tự bệnh/khấu tiền/tăng tuổi,9ý nhật ký Đã phát hành; không lỗi JavaScript/tràn ngang. Ảnh kiểm thực trong .cache/blood910-browser. Nhật ký133mục cũ giữ nguyên; dữ liệu và HTML build phải khớp134mục.
- Smoke, save compatibility, save safety, NPC identity: PASS theo .cache/quick910-final-code.log. Gói loading/API fake DB và ZIP xem RESULTS sau khi build xong. Không có phép thử ghi production.

## Phát hành, Cloudflare và khôi phục

Nhãn Đã phát hành theo chỉ thị trực tiếp trước đó của chủ dự án, thời điểm thực tế công cụ release-update ghi trong dữ liệu; không xác nhận đã upload. Chỉ chủ dự án tự upload Dashboard. GitHub public mercyx03/motdoi, nhánh codex/life-context-upgrade, quyền push đã kiểm; không có workflow được theo dõi trong .github, webhook/deployment ngoài repo chưa kiểm chứng. Không deploy, đổi DNS, D1 hay binding. REVIEWS_DB cần cấu hình Pages thực tế; API cục bộ không chứng minh production.

Bản trước:619fcd8489a8005f4cc05c05a2be809636799943. Nếu có lỗi, chủ dự án có thể upload lại ZIP đã xác minh của commit này hoặc dùng git revert commit910 trên nhánh hiện tại, đóng gói lại rồi tự upload. Không reset/force push. Còn tồn tại fixture regression cũ và nghiệm thu tổng thể GĐ6, nên CHƯA đánh dấu sẵn sàng Production.
