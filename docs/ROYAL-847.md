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


## Bổ sung 8.10.48 — Hoàng gia Na Uy, Hoàng gia Đan Mạch & Hạn ngạch Suất học / Tôn giáo Ấn Độ

5. **Đào tạo Người kế vị & Nghi lễ Hoàng gia Na Uy (`royalNorwayTrack848`)**
   - Định hướng rèn thành "công dân kiểu mẫu" trước khi trở thành vị vua: học trường mẫu giáo và phổ thông công lập địa phương (trường làng), tự đi bộ đến trường cùng trẻ em thường dân.
   - Quân sự bắt buộc (bờ biển dài & chiến lược NATO): Học viện Hải quân / Không quân Hoàng gia và 12 tháng thực chiến tại Tiểu đoàn Công binh Quốc gia (`Ingeniørbataljonen`).
   - Đại học tập trung Khoa học Chính trị, Luật Hiến pháp và Phát triển Bền vững / Môi trường; được phép du học nước ngoài.
   - Nghi lễ thế tục (bỏ đăng quang truyền thống từ năm 1908): tuyên thệ trước Quốc hội (`Storting`), Lễ Ban Phước (`Consecration/Blessing`) tại Nhà thờ Nidaros ở Trondheim với Vương miện chỉ đặt trên bàn thờ làm biểu tượng lịch sử (tuyệt đối không đội); Quốc khánh 17/5 "không duyệt binh" mặc trang phục `Bunad` trên ban công Cung điện Oslo vẫy chào đoàn diễu hành thiếu nhi; đời thường tự lái xe / đi phương tiện công cộng; quốc yến ưu tiên sản vật địa phương thân thiện môi trường.

6. **Đào tạo Người kế vị & Nghi lễ Hoàng gia Đan Mạch (`royalDenmarkTrack848`)**
   - Hòa nhập hệ thống trường công lập: học trường tiểu học công lập `Tranegårdskolen` bình đẳng cùng con em thợ điện, kỹ sư tại Copenhagen.
   - Đại học & Quốc tế: học Khoa học Chính trị tại Đại học Aarhus, du học Đại học Harvard (Mỹ) dưới tên giả để tránh truyền thông.
   - Quân sự chuyên sâu: khóa đào tạo Sĩ quan tại Doanh trại `Antvorskov` và khóa huấn luyện sinh tồn khắc nghiệt của Lực lượng Người nhái Tinh nhuệ thuộc Hải quân Đan Mạch (`Frømandskorpset`).
   - Nghi lễ tối giản (bỏ đăng quang tôn giáo từ năm 1849): bàn giao quyền lực tại Hội đồng Nhà nước; Thủ tướng tuyên bố 3 lần trên ban công Cung điện `Christiansborg`; nhà vua mới xuất hiện trong bộ quân phục không đội vương miện (báu vật hoàng gia chỉ trưng bày trong bảo tàng); diễu hành xe ngựa ấm áp theo văn hóa `Hygge` và lễ tạ ơn dân sự tại nhà thờ.

7. **Ấn Độ (`IN`): Hệ thống Đẳng cấp, Tôn giáo, Cải đạo & Hạn ngạch Suất học (`indiaQuotaFaith848`)**
   - Nguồn gốc đẳng cấp trong cổ thư Hindu (`Manusmriti`, thuyết Nghiệp & Luân hồi) và làn sóng cải đạo sang Phật giáo Tân xe (`Navayana` năm 1956 do Tiến sĩ B.R. Ambedkar khởi xướng).
   - Hệ thống hạn ngạch Hiến pháp Ấn Độ: `SC` (15% chỉ tiêu, chủ yếu là Dalit), `ST` (7.5% chỉ tiêu, bộ tộc thiểu số), `OBC` (27% chỉ tiêu, tầng lớp trung gian tụt hậu) so với `General` (cạnh tranh điểm chuẩn rất cao tại `IIT`, `AIIMS`). Sinh viên `SC`/`ST` được miễn học phí, ký túc xá miễn phí và trợ cấp sinh hoạt.
   - Giao thoa pháp lý – tôn giáo: người Dalit cải đạo sang Phật giáo Navayana / Sikh giáo vẫn giữ tư cách pháp lý `SC`; nhưng nếu cải đạo sang Kitô giáo hoặc Hồi giáo thì bị mất tư cách pháp lý `SC` và mất suất học bổng/hạn ngạch ưu tiên dù định kiến xã hội thực tế chưa biến mất.
   - Dịch chuyển xã hội vào hàng ngũ trí thức/công chức và tranh luận xã hội gay gắt giữa nhóm General và nhóm hạn ngạch.
   - Đánh dấu phát hành (`released`) cho cả hai mục nhật ký `8.10.47` và `8.10.48` theo yêu cầu của chủ dự án.
