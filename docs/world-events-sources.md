# Sự kiện thế giới — v4.7.0

## Đợt 8.9.4 — 40 câu chuyện của tám quốc gia

Mỗi bản ghi lifeEvents trong data-country-depth.js có ID, countryCode, nguồn, tuổi, loại điều kiện, tình huống và mục tiêu riêng. life173 đăng ký bằng WORLD120.incident/UPDATE110, chọn theo năm tất định, lưu tại culture173.cases; có lời hẹn và ít nhất hai lượt theo dõi thành công, thất bại giữ tiến độ để thử lại. Mentor hư cấu dùng LIFE138.person; đối tác tình cảm dùng ID người yêu hiện tại, không tự tạo người yêu mới. Uy tín nghề và affection108 đi vào hệ thống nghề/quan hệ hiện hữu. Không tự tạo bằng/tiền lương/bồi thường/đăng ký kết hôn. Mỗi năm một chuyện riêng mới được xếp, ưu tiên hẹn đến hạn; có menu mở chủ động. Hồ sơ sai nước, mốc năm, tuổi, nghề hoặc người yêu không được áp dụng tác động.


## Batch 8.9.3 — 28/10/2026

Nguồn ẩm thực FI/GH/IE và lễ Matariki NZ: xem mục Batch chiều sâu 8.9.3 trong culture-sources.md. Sự kiện world_cuisine173 mở từ tuổi 12 khi tự do sinh hoạt và đang cư trú đúng nước, xác suất năm 24% bằng seed riêng. Một năm chỉ có một hành động học/nấu/trò chuyện, công thức học năm trước mới thực hành; nấu thất bại có thể thử lại năm sau. Công thức và món thành công lưu theo mã nước, không xóa khi di cư. Sự kiện chưa xử lý gắn countryCode lúc tạo và kiểm lại trước tác động; không suy nguồn gốc từ pool tên. Lễ quê gốc/tín ngưỡng vẫn có lý do riêng, không cộng vào thành tựu ba năm lễ địa phương ở nước khác.


Tham khảo cách phân biệt hoàn cảnh theo quốc gia của https://1in8b.life/en/ ; các câu chuyện, câu chữ và cơ chế trong bản cập nhật này được viết riêng, không sao chép kho sự kiện hay các tỷ lệ của trang đó.

136 tình huống: 106 câu chuyện gắn 53 quốc gia; 30 câu chuyện chung áp dụng theo hoàn cảnh ở 194 quốc gia ngoài Việt Nam. Không phải mỗi nước đều có 136 câu chuyện riêng.

## Quy ước

- Đây là tình huống đời sống hư cấu. Không khẳng định có chương trình / ưu đãi cụ thể ở mọi địa phương; không mô phỏng quyền pháp lý tự động, học phí thực tế, tần suất tội phạm hay tình hình chiến sự hiện hành.
- Địa điểm là quốc gia đang sống (`abroad.code` nếu có, nếu không là `country`). Hoạt động được kể như cơ hội tại cộng đồng, không mặc định tôn giáo, sắc tộc, tập quán hay khả năng thể chất của nhân vật.
- Trải nghiệm ẩm thực dùng phần giới thiệu, hình ảnh hoặc hỏi nguyên liệu; không tự cho ăn món kiêng / gây dị ứng. Yoga / sauna / chạy bộ có phương án nghe giới thiệu, nghỉ hoặc hoạt động nhẹ, không ép tập nặng.
- Ngân sách buổi tìm hiểu = 1,5% thu nhập cơ sở năm trong đơn vị tiền hiện tại; chỉ người từ 18 tuổi, đủ tiền mới được trả. Đây là cân bằng game, không phải báo giá thị trường. Không có thưởng tiền / cấp bằng / chuyển việc tự động.
- Tối đa hai tình huống được giải quyết mỗi năm; kể cả từ chối vẫn ghi nhận đã gặp để giảm lặp. Cùng ID cần cách tám năm. Các giới hạn áp dụng cả tự động lẫn chủ động. Lịch sử theo ID được giữ sau khi chuyển nước và mở bản lưu.

## Nguồn văn hóa đối chiếu

- Danh sách di sản văn hóa phi vật thể UNESCO, tra theo quốc gia và tên: https://ich.unesco.org/en/lists
- Washoku (Nhật): https://ich.unesco.org/en/RL/washoku-traditional-dietary-cultures-of-the-japanese-notably-for-the-celebration-of-new-year-00869
- Sauna (Phần Lan): https://ich.unesco.org/en/RL/sauna-culture-in-finland-01596
- Hawker culture (Singapore): https://ich.unesco.org/en/RL/hawker-culture-in-singapore-community-dining-and-culinary-practices-in-a-multicultural-urban-context-01568
- Kente (Ghana): https://ich.unesco.org/es/RL/artesania-de-tejido-tradicional-kente-02130

Những tình huống trường học, thư viện, nhà ở, đồng nghiệp, kỹ năng số và sinh hoạt là kịch bản hư cấu phổ quát được biên soạn theo bối cảnh. Không coi các lời mời đó là dữ liệu thống kê hoặc chương trình đang triển khai thực tế.

## Mở rộng bản địa hóa đời sống và sự kiện văn hóa 195 quốc gia — v8.9.0 (`public/js/life173.js`)

Từ phiên bản 8.9.0, hệ thống sự kiện thế giới được mở rộng với lớp hồ sơ văn hóa – thể chế 3 tầng (`E.CULTURE173`) và ngữ cảnh văn hóa cá nhân (`E.culturalContext173`):

- **Tách biệt quốc gia cư trú và nguồn gốc gia đình**:
  - `E.resCode(l)` xác định quốc gia cư trú hiện tại (`l.abroad.code` nếu đang ở nước ngoài, bao gồm cả định cư lâu dài `abroad.perm = true`, ngược lại là `l.country`).
  - `E.inVN(l)` kiểm tra nhân vật hiện đang sống tại Việt Nam (`resCode === 'VN'`).
  - `E.hasVNOrigin(l)` kiểm tra nhân vật hoặc cha mẹ có nguồn gốc Việt Nam (sinh tại Việt Nam, định cư từ Việt Nam, hoặc cha/mẹ mang quốc tịch Việt Nam trong `flags.life138.ancestry`).
- **6 nhóm kịch bản tương tác dài hạn (`world_*173`)**:
  - `world_festival173`: Lễ hội lớn theo quốc gia cư trú (Shōgatsu, Seollal/Chuseok, Tết Nguyên đán, Thanksgiving, Diwali, Songkran, Día de Muertos, Eid al-Fitr, Oktoberfest, Bastille Day, Midsummer, Carnival...) kèm lựa chọn giữ Tết cổ truyền cho kiều bào Việt Nam ở nước ngoài.
  - `world_school173`: Đời sống học đường bản địa (câu lạc bộ *Bukatsu* Nhật Bản, tự học buổi tối *Yaja* Hàn Quốc, *Prom & Varsity* Bắc Mỹ, định hướng *Gymnasium/Abitur* Đức, *Sixth Form* Anh, *Maison des Lycéens* Pháp...).
  - `world_exam173`: Kỳ thi tốt nghiệp / tuyển sinh cuối cấp trung học theo đúng thể chế giáo dục từng nước (*Gaokao*, *Suneung*, *Kyōtsū Test*, *SAT/ACT*, *A-Levels*, *Baccalauréat*, *Abitur*, *Board Exams*, *ATAR*, *ENEM*, *EGE*...), ghi nhận kết quả vào hồ sơ học vấn.
  - `world_coming173`: Cột mốc trưởng thành bản địa (*Seijin no Hi*, *Seongnyeon-ui Nal*, *Quinceañera*, *Milestone 18/21*...).
  - `world_workplace173`: Văn hóa công sở đặc trưng từng nước/vùng (*Nomikai* & *Senpai–Kōhai* Nhật Bản, *Hoesik* Hàn Quốc, *Fika* Bắc Âu, *Betriebsrat* Đức, *At-will & Performance Review* Hoa Kỳ, *Apéro* Pháp, *Majlis* Trung Đông...).
  - `world_integration173`: Chuỗi sự kiện hòa nhập văn hóa và gìn giữ bản sắc dành cho người di cư, du học sinh, lao động quốc tế và thế hệ thứ hai.
- **Lễ gia đình và tiệc tùng bản địa hóa (`celebration129`, `party148`, `luxuryParty172`)**:
  - Tự động hiển thị các lễ hội phù hợp với quốc gia cư trú, đồng thời mở thêm lựa chọn đón Tết cổ truyền cho gia đình gốc Việt ở nước ngoài và luôn có lựa chọn sum họp giản dị không tốn kém.
