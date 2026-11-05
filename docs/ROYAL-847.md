# ROYAL-847 — Đào tạo người kế vị, tuổi thơ quý tộc & nghi thức đón em bé Hoàng gia (8.10.47)

## Phạm vi đã triển khai

1. **Chương trình đào tạo Người kế vị Thụy Điển (`royalSwedenTrack847`)**
   - Tuân thủ quy định Hiến pháp Thụy Điển về học tập trong nước (`domesticOnly: true`).
   - Đào tạo quân sự bắt buộc ngắn hạn nhưng toàn diện: nghĩa vụ quân sự cơ bản, chiến thuật sinh tồn, cấu trúc phòng thủ quốc gia (`mil_basic`), tiếp nối khóa đào tạo sĩ quan tại Học viện Phòng vệ Thụy Điển qua đủ 3 quân chủng Lục quân, Hải quân, Không quân (`mil_officers`). Khi lên ngôi, Quốc vương/Nữ hoàng giữ cấp bậc tối cao trong cả ba quân chủng (`supremeCommander847` & `supremeRank`).
   - Đào tạo hiến định và đối ngoại không mang tính tranh cử đảng phái: học sâu về Hiến pháp Thụy Điển, hoạt động của Quốc hội (`Riksdag`) và quan hệ Hoàng gia – Chính phủ (`riksdag`); khóa đào tạo đặc biệt tại Bộ Ngoại giao Thụy Điển (`UD`) về đối ngoại, an ninh toàn cầu và thương mại quốc tế (`ud_diplomacy`); thực tập ngắn hạn tại Liên Hợp Quốc (`UN`) hoặc đại sứ quán Thụy Điển ở nước ngoài mà không vi phạm luật cư trú (`un_embassy`).
   - Đa ngôn ngữ: ngoài tiếng Thụy Điển, rèn thông thạo tiếng Anh, tiếng Pháp và tiếng Đức (`langs_eu`).

2. **Tuổi thơ Hoàng gia, Bảo mẫu đa ngôn ngữ, Trường nội trú, Nghệ thuật, An ninh & Mạng xã hội (`royalUpbringing847`)**
   - **Bảo mẫu châu Âu**: số lượng ít nhưng chất lượng cao, giúp trẻ học tự nhiên ngoại ngữ thứ 2/thứ 3 (Tây Ban Nha, Pháp, Đức...) và tăng dần mức tự lập (`autonomy`) theo độ tuổi.
   - **Ngôn ngữ truyền thống/bản địa**: Hoàng gia Anh (`GB`) học thêm tiếng Wales (`Cymraeg`); Hoàng gia Đan Mạch (`DK`), Na Uy (`NO`), Thụy Điển (`SE`) học thêm ngôn ngữ Bắc Âu láng giềng; Hoàng gia Bỉ (`BE`) gắn với 3 ngôn ngữ quốc gia (Hà Lan, Pháp, Đức).
   - **Công vụ sớm & Quy tắc tách phương tiện**: từ 5–6 tuổi bắt đầu theo cha mẹ dự sự kiện trang nghiêm, lễ phép, bắt tay, chào hỏi (`child_duty`); từ 7–8 tuổi trở lên bắt buộc tách máy bay riêng / xe chở riêng cho người trong nhánh kế vị trực tiếp để bảo vệ danh sách kế vị (`separate_travel` và tự động kích hoạt ở tuổi lên 7).
   - **Trường nội trú quý tộc & 10 môn nghệ thuật/thể thao**: tuổi thiếu niên (12–18) có trường nội trú quý tộc chia phân khu nam sinh / nữ sinh; rèn luyện Cưỡi ngựa & Polo, Múa ba lê, Bắn cung, Đua thuyền buồm, Khiêu vũ cung đình, Thưởng trà, Đánh cờ, Đàn Harp, Hội họa và Thơ ca.
   - **An ninh, Bạn bè & Mạng xã hội**: có đội vệ sĩ hộ tống giữ khoảng cách không để người lạ tự ý chạm vào thành viên hoàng gia khi chưa được phép; kết bạn với bạn thường dân, khá giả hoặc quý tộc và đi dạo kín đáo (đặc biệt văn hóa giản dị, gần gũi tại Bắc Âu `SE`, `NO`, `DK`). Tài khoản chính thức do đội ngũ truyền thông quản lý; cá nhân hạn chế dùng mạng xã hội hoặc chỉ dùng tài khoản clone ẩn danh có tên kỳ lạ khi được phép (tự ý lập tài khoản khi còn nhỏ dễ bị rò rỉ và nhắc nhở).

3. **Cập nhật danh hiệu khi kết hôn, lên hàng kế vị đứng đầu hoặc đăng quang (`syncTitles`)**
   - Đồng bộ tự động danh hiệu của người kế vị số 1 (`heirApparent847`) và người bạn đời (`consortStyle847` / `royalConsortTitle847`) theo từng quốc gia (`GB`, `SE`, `NO`, `DK`, `BE`, `ES`, `MC`) khi kết hôn hoặc khi chuyển giao ngôi vị.

4. **Nghi thức sinh con Hoàng gia, Đa thai, Đại bác, Đèn màu, Chụp ảnh & Lễ rửa tội (`royalBirthProtocol847`)**
   - **Phân biệt phương pháp sinh & đa thai**:
     - Ca sinh đơn thuận lợi (mẹ khỏe, con khỏe): tại Anh (`GB`) xuất hiện sớm trước bậc thềm Lindo Wing – Bệnh viện St. Mary's vài giờ/1 ngày sau sinh rồi về cung điện; công bố tên sau vài ngày tới 1 tuần.
     - Ca sinh mổ (ca sinh 2, 3, đa thai hoặc theo sức khỏe/nhu cầu thực): ưu tiên tuyệt đối sức khỏe mẹ và bé, không chụp ảnh ngay tại bậc thềm bệnh viện, công bố ngay họ tên và thứ tự chào đời theo luật kế vị, gửi ảnh em bé (cùng anh chị lớn nếu có) cho công chúng và đợi vài tuần hồi phục mới ra mắt tại ban công cung điện.
     - Hỗ trợ sinh đôi (cùng giới / khác giới), sinh ba rất hiếm và sinh tư hoàng gia cực kỳ hiếm; thứ tự phút chào đời (`birthMinuteOrder847`) quyết định trực tiếp thứ tự trong danh sách kế vị (`R.order`).
   - **Thắp đèn danh thắng London (`GB`)**: Cầu Tháp London (`Tower Bridge`), Vòng quay Thiên niên kỷ (`London Eye`), Đài phun nước Quảng trường Trafalgar, Tháp `BT Tower` (chạy chữ LED `"It's a boy/girl"`) và Cầu `Golden Jubilee` chuyển đèn xanh lam, hồng hoặc hồng xen xanh lam (khi sinh đôi nam – nữ).
   - **Nghi thức bắn đại bác đúng giờ**:
     - Anh (`GB`): 13h00 chiều (bắn hôm nay nếu sinh trước 13h, hoặc 13h ngày mai nếu đã qua mốc) với 62 phát tại Tháp London, 41 phát tại Green Park cùng 5 địa điểm pháo lễ.
     - Na Uy (`NO`): đúng 12h00 trưa (hôm nay hoặc ngày mai tùy giờ sinh) bắn 21 phát tại 11 pháo đài và căn cứ quân sự khắp đất nước.
     - Thụy Điển (`SE`): đúng 12h00 trưa bắn 21 phát tại 5 trạm pháo lễ cố định chính.
   - **Ra mắt truyền thông theo văn hóa từng Hoàng gia**:
     - Na Uy (`NO`): rời Bệnh viện Rigshospitalet về dinh thự Skaugum rồi công bố bộ ảnh chân dung chính thức đầu tiên gồm Ba Thế Hệ (Đức Vua, Người kế vị, Em bé mới sinh).
     - Bỉ (`BE`): thông cáo báo chí chính thức bằng 3 ngôn ngữ (Hà Lan, Pháp, Đức); anh chị lớn vào thăm trước, chụp ảnh ngắn (`Photo Call`) tại Bệnh viện Erasme / St. Jan sau 2–3 ngày hồi phục và mở sổ chúc mừng giấy + kỹ thuật số tại Cung điện Hoàng gia Brussels.
     - Tây Ban Nha (`ES`) & Thụy Điển (`SE`): kín tiếng ngày đầu, họp báo ngắn tại bệnh viện sau khi nghỉ ngơi đầy đủ hoặc đăng ảnh chân dung do chính gia đình tự chụp.
     - Monaco (`MC`) & Đan Mạch (`DK`): ra mắt chính thức từ ban công cung điện trước thần dân tại quảng trường sau vài tuần hoặc vào ngày lễ.
   - **Xét duyệt tên & Lễ rửa tội**:
     - Kiểm duyệt nghiêm ngặt tên em bé ở 6 vị trí kế vị đầu tiên (từ chối tên quá tự do/phá cách, yêu cầu tên chuẩn mực truyền thống vương triều).
     - Lễ rửa tội mặc váy bản sao thời Nữ hoàng Victoria (dùng cho cả hoàng tử và công chúa), mời đầy đủ cả hai bên nội – ngoại, trân trọng sui gia dù xuất thân thường dân hay quý tộc.

## Giới hạn & Phần để lại GĐ6

- Các gia tộc hoàng gia trong game giữ tên nhà hư cấu để đảm bảo nguyên tắc mô phỏng an toàn; nghi thức, địa danh và quy tắc văn hóa – hiến định được mô hình hóa phục vụ trải nghiệm gameplay.
- Chưa chạy toàn bộ `tests/regression.js` trên mã cuối (chuyển sang GĐ6 theo chiến lược kiểm thử hiện hành).
- Không chạm các file bẩn có sẵn ngoài phạm vi (`public/js/healthsys919.js`, `tests/world-country-jobs832-browser.js`, `tests/healthsys-rx-cap.js`).
