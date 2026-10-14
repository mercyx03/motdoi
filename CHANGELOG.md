# Nhật ký phiên bản — Một Đời

**Nguyên tắc cập nhật:** bản mới = toàn bộ tính năng bản trước + tính năng mới + sửa lỗi.
Trước khi phát hành, bộ kiểm thử hồi quy (`node tests/regression.js`) phải đạt 100%.
Mỗi lỗi đã sửa đều được bổ sung một bài kiểm thử để không tái phát.

## v2.9.0 — 15/10/2026

Giữ nguyên toàn bộ tính năng v2.8.0. Vận động viên đang thi đấu ở đời chơi dở tự được gắn câu lạc bộ / môn võ.

### Mới
- **Nghề vận động viên chia theo từng môn**: bóng đá, bóng rổ, bóng chuyền, bơi lội, điền kinh, cầu lông, bóng bàn, quần vợt, võ thuật (karate, taekwondo, vovinam, pencak silat, boxing, judo), cử tạ, bắn cung, thể dục dụng cụ, đua xe đạp, bi-a, golf. Năng khiếu thể thao lúc nhỏ sẽ rơi vào một trong các môn này.
  - **Danh xưng riêng từng môn**, ví dụ: cầu thủ học viện → cầu thủ hạng Nhất → cầu thủ V.League → tuyển thủ quốc gia; kình ngư đội tuyển quốc gia; tay vợt hệ thống ATP / WTA; cơ thủ hàng đầu thế giới; cua-rơ; golfer chuyên nghiệp…
  - **Thu nhập khác nhau theo môn**: cầu thủ V.League, tay vợt quốc tế, cơ thủ bi-a, golfer hàng đầu kiếm nhiều hơn hẳn các môn ít khán giả.
  - **Tuổi đỉnh cao và giải nghệ theo môn**: thể dục dụng cụ giải nghệ sớm (~27), bơi lội ~28, bóng đá ~35, bắn cung ~42, golf ~45, bi-a ~48.
  - **Môn đồng đội** (bóng đá, bóng rổ, bóng chuyền) có câu lạc bộ thật (Hà Nội FC, Công an Hà Nội, Saigon Heat, Biên Phòng…), vô địch giải quốc gia cùng câu lạc bộ, rất hiếm khi có huy chương Olympic.
  - **Sự kiện riêng**:
    - Bóng đá: vô địch V.League, ASEAN Cup (năm chẵn), vòng loại World Cup; lời mời sang J-League, K-League, Thai League.
    - Quần vợt: vô địch giải ATP Challenger. Bơi lội: phá kỷ lục quốc gia. Bi-a: World Cup carom 3 băng. Golf: giải chuyên nghiệp. Võ thuật: đai vô địch châu Á.
    - Trận đấu lớn: thi đấu hết mình (dễ chấn thương) hay chừng mực. Ngôi sao thì có hợp đồng quảng cáo.
  - Mọi huy chương ghi rõ môn, ví dụ "SEA Games 2027 (bóng đá)".
- **Con đường phát triển năng khiếu**: có năng khiếu toán, ngoại ngữ, âm nhạc, hội họa, ăn nói, khéo tay hay kinh doanh thì được hỏi có muốn theo đuổi không (theo nghiêm túc / học cho vui / thôi).
  - Theo đuổi thì đi thi từng cấp, mỗi cấp chọn ôn hết sức, thi bình thường hoặc bỏ. Ví dụ toán: cấp trường → huyện → tỉnh → kỳ thi học sinh giỏi quốc gia (VMO) → Olympic Toán học Quốc tế (IMO).
  - Mỗi năm luyện tập năng khiếu tiến bộ. Bắt đầu muộn thì vào thẳng cấp hợp tuổi; quá tuổi một cấp thi thì dừng.
  - Thành tích mở cơ hội: giải quốc gia được tuyển thẳng đại học; huy chương quốc tế có học bổng toàn phần. Âm nhạc, hội họa, ăn nói, khéo tay, kinh doanh đạt giải lớn thì được mời làm ca sĩ, nhà thiết kế, MC, kỹ sư, được rót vốn khởi nghiệp.
- **Concert theo thể loại** (hành động "Đi xem ca nhạc, concert"): chọn nghệ sĩ Việt Nam, concert các chương trình "Say Hi" / Anh tài, K-pop Hàn Quốc, nghệ sĩ Âu Mỹ, Rap Việt hay rapper Mỹ.
  - Nghệ sĩ Việt: Sơn Tùng M-TP, Jack - J97, HIEUTHUHAI, Quang Hùng MasterD, Dương Domic, Đen Vâu, Mỹ Tâm, Hòa Minzy, AMEE, tlinh…
  - Chương trình: Anh trai "Say Hi", Em xinh "Say Hi", Tinh hà "Say Hi", Anh trai vượt ngàn chông gai. Thần tượng từ chương trình được gọi là "anh trai / em xinh / anh tài + tên".
  - K-pop: BTS, BLACKPINK, TWICE, SEVENTEEN, IVE, aespa, CORTIS, Stray Kids, LE SSERAFIM, ENHYPEN, BABYMONSTER, ILLIT… Âu Mỹ: Taylor Swift, Dua Lipa, Justin Bieber, Olivia Rodrigo, The Weeknd… Rap Việt: Đen Vâu, Binz, Rhymastic, RPT MCK, Low G…, có cả đêm rap underground, battle rap. Rapper Mỹ: Drake, Kendrick Lamar, Travis Scott, Eminem…
  - Nghệ sĩ già đi theo năm sinh rồi thôi biểu diễn; những năm sau có thế hệ mới.
  - Dưới 16 tuổi phải xin bố mẹ đưa đi (nhà không khá giả hoặc đi nước ngoài thì có thể bị từ chối); 16–17 tuổi tự đi trong nước, ra nước ngoài phải có người lớn. Concert ở nước ngoài tốn thêm vé máy bay, khách sạn.
- **Sở thích từ nhỏ**: mê rap, nhảy, guitar, vẽ, chụp ảnh, nấu ăn, đọc sách, K-pop, đá bóng (khác nhau theo giới tính và năng khiếu).
  - Dồn sức thì giỏi lên; đủ giỏi thì có thể thành nghề: mê rap → đi casting chương trình rap → rapper; nhảy → vũ công; guitar → nhạc sĩ; chụp ảnh → nhiếp ảnh gia; nấu ăn → đầu bếp.
- **Thêm việc giải trí**: xem phim ở rạp (đi với bạn, với người yêu), hát karaoke, đi công viên / khu vui chơi (trẻ con), rủ bạn đá bóng / chơi thể thao, đi xem bóng đá ở sân, đi phượt / cắm trại, xem show rap / battle rap (mê rap thì lên battle luôn), chơi game ở nhà.
- **Thêm việc chăm sóc tâm hồn**: thiền / yoga, đọc sách, leo núi / dã ngoại, massage / xông hơi.
- **Tâm linh theo tôn giáo**: hành động ghi đúng theo đạo — "Đi lễ nhà thờ" (Công giáo), "Đi nhà thờ (Tin Lành)", "Đi chùa lễ Phật", "Đến thánh thất Cao Đài", "Tụng kinh, làm việc thiện (Hòa Hảo)", "Đến thánh đường Hồi giáo", "Lên đền tháp Chăm", Hindu, Sikh, Do Thái, Đạo giáo. Không theo tôn giáo thì "Thắp hương tổ tiên, tĩnh tâm".
  - Có dịp lễ riêng: Công giáo rước lễ lần đầu, thêm sức, lễ Giáng sinh nửa đêm, tháng hoa dâng Đức Mẹ; Phật giáo khóa tu mùa hè, lễ Vu Lan (cài hoa hồng đỏ khi còn mẹ, hoa hồng trắng khi mẹ đã mất), cầu an rằm tháng Giêng; Hồi giáo tháng Ramadan; Cao Đài đại lễ Tòa Thánh Tây Ninh; người Chăm lễ hội Katê; không tôn giáo thì tảo mộ Thanh minh, giỗ ông bà, cúng ông Công ông Táo.
- **Bảng "Nghề & lương" hiện chi tiết từng môn thể thao**: dưới nghề vận động viên có danh sách từng môn, kèm các bậc danh xưng, mức lương, tuổi đỉnh cao, tuổi giải nghệ, môn đồng đội hay cá nhân.
- **Nhóm nghề "Pháp luật & tòa án"** tách riêng trong bảng nghề:
  - Gồm luật sư, thẩm phán, kiểm sát viên (công tố viên), công chứng viên.
  - Nghề mới: điều tra viên, chấp hành viên thi hành án, thừa phát lại, trợ giúp viên pháp lý.
  - Sự kiện riêng:
    - Kiểm sát viên phát hiện hồ sơ có dấu hiệu oan sai.
    - Thẩm phán làm chủ tọa đại án tham nhũng: xử độc lập hay nghe "góp ý".
    - Điều tra viên hỏi cung nghi phạm cứng đầu.
    - Chấp hành viên cưỡng chế nhà của gia đình nghèo.
    - Thừa phát lại lập vi bằng.
    - Trợ giúp viên pháp lý bào chữa miễn phí cho người nghèo.
  - Có hướng chuyển nghề: điều tra viên → luật sư hình sự, chấp hành viên → mở văn phòng thừa phát lại.
- **Vé số / Vietlott theo tỉ lệ thật**:
  - Tỉ lệ trúng giải cao nhất:
    - Xổ số kiến thiết: 1/1.000.000.
    - Mega 6/45: 1/8.145.060.
    - Power 6/55: Jackpot 1 là 1/28.989.675, Jackpot 2 là 1/4.831.613.
  - Giải nhỏ (trùng 3 số) thỉnh thoảng có.
  - Có thể mua 1 vé, 10 vé, 5 vé Vietlott hoặc mua đều cả năm.
  - Giải trên 10 triệu bị trừ thuế thu nhập cá nhân 10%.
  - Trúng lớn có thể đổi đời:
    - **Nhận giải**: đeo mặt nạ giấu danh tính (vẫn có thể bị lộ) hoặc lên nhận công khai (nổi tiếng).
    - **Người lạ "nhận vơ"**, ví dụ "nhớ anh không, xưa anh bế mày suốt", "ngày xưa anh đỡ cho chú nhát dao, chú nhớ không?", "xưa cô thay tã cho mày suốt"… Có thể cho, hỏi vặn lại hoặc từ chối.
    - **Họ hàng tìm đến**: cho, cho vay (có người trả, có người không) hoặc từ chối.
    - **Tiêu tiền**: gửi tiết kiệm, lo cho gia đình, mua sắm xa xỉ, làm từ thiện. Có cả "cơ hội đầu tư" mà phần lớn là lừa đảo.

### Sửa lỗi
- Kỷ niệm đáng nhớ trùng nội dung với kỷ niệm đã có giờ được gắn ⭐ thay vì bị bỏ qua.
- Môn đồng đội không còn ra huy chương Olympic quá dễ.
- Concert của thần tượng dùng chung một luật theo tuổi, không còn hai luật chồng nhau.
- Kiểm thử: ngưỡng trung vị tài sản ở chế độ thế giới nới lên dưới 70, vì đời chơi có thêm nhiều nguồn thu (thể thao, năng khiếu).

## v2.8.0 — 15/10/2026

Giữ nguyên toàn bộ tính năng v2.7.0. Xe mua từ bản cũ vẫn giữ nguyên và vẫn tính chi phí nuôi xe.

### Mới
- **Tiền bạc rõ ràng hơn**:
  - Dưới "Tài sản ròng" có bảng chia từng khoản: tiền mặt / tài khoản, tiết kiệm & đầu tư, nhà ở, nhà cho thuê & cửa hàng, xe, các khoản nợ. Rê chuột vào từng dòng có giải thích.
  - Tiền mặt âm được cảnh báo rõ ("bạn tiêu nhiều hơn số tiền đang có").
  - Bảng tài chính ghi "Cả năm dư ra / hụt …" kèm giải thích (thu trừ chi, đã cộng/trừ vào tiền mặt) và số tiền mặt hiện có.
  - Bỏ dấu "~" dễ nhầm với dấu trừ, thay bằng chữ "khoảng".
- **Mua xe theo số tiền đang có** (làm lại hoàn toàn):
  - Bước 1, chọn phân khúc: xe số, tay ga, xe máy điện, côn tay & phân khối lớn, ô tô hạng A, B, C, SUV 7 chỗ / hạng D, xe sang, xe thể thao & siêu xe. Mỗi phân khúc ghi khoảng giá và "trả thẳng được mấy mẫu / cần trả góp".
  - Bước 2, chọn mẫu xe cụ thể (Wave Alpha, Vision, SH, VinFast Evo, Exciter, Kawasaki Z900, i10, Vios, City, VF 5, Mazda 3, CX-5, Fortuner, Camry, Mercedes C 300, BMW 330i, Porsche 911, Lamborghini, Rolls-Royce…). Mỗi mẫu có giá lăn bánh tham khảo, thông số, ưu và nhược điểm.
  - Đủ tiền thì trả thẳng (tính cả tiền bán xe cũ). Chưa đủ thì gợi ý trả góp, ghi rõ trả trước bao nhiêu, vay bao nhiêu, mỗi năm trả khoảng bao nhiêu: ô tô vay ngân hàng, xe máy vay công ty tài chính.
- **Người thân, bạn bè mất đều ghi lý do** hợp với tuổi: người trẻ hay gặp tai nạn giao thông, đuối nước; trung niên là ung thư, nhồi máu cơ tim, đột quỵ; người già là tuổi già sức yếu, suy tim, viêm phổi. Có tính cả thói quen (bố nghiện rượu thì có thể mất vì xơ gan).
- **Làm chủ cửa hàng / quán**:
  - Bị mất việc làm thuê thì có lựa chọn "Tập trung điều hành … của mình". Căn cước hiện "chủ spa / thẩm mỹ viện…" thay vì nghề cũ hay "thất nghiệp". Không bị trừ hạnh phúc như người thất nghiệp.
  - Chủ cơ sở không còn "Xin tăng lương".
- **Game theo thể loại sở trường**: năng khiếu FPS chơi Valorant, CS2, Đột Kích, Delta Force, PUBG Mobile, Free Fire, Call of Duty Mobile; MOBA chơi Liên Minh Huyền Thoại, Dota 2, Liên Quân Mobile, Mobile Legends: Bang Bang, Tốc Chiến. Ở quán net chơi bản máy tính; nhà nghèo, nông thôn hay chơi bản điện thoại. Tuyển thủ, streamer thi đấu đúng game sở trường.

### Sửa lỗi logic
- **44 tuổi đi xin việc lại bị mời "thực tập sinh"**: người đã đi làm nhiều năm vào thẳng bậc hợp với tuổi và kinh nghiệm. Sinh viên mới ra trường vẫn bắt đầu từ thực tập.
- **Trợ cấp hưu trí xã hội 0,4 triệu/tháng**: đúng theo Luật Bảo hiểm xã hội 2024 (hiệu lực 1/7/2025) là **500.000 đ/tháng**, mức chung cả nước, cho người từ 75 tuổi không có lương hưu (từ 70 tuổi nếu thuộc hộ nghèo / cận nghèo). Trước đây mức này bị nhân theo vùng nên ra 0,4 triệu, và nhân vật không có lương hưu còn nhận trợ cấp ngay từ lúc nghỉ việc. Bảng tài chính ghi "Trợ cấp / con biếu" thay vì "Lương hưu".
- **Mời mở chi nhánh khi tiền mặt đang âm** và chỉ còn nút "Giữ quy mô": giờ chỉ mời khi đủ tiền, hoặc vay được ngân hàng (tự bỏ ra 30%).
- Không còn nhắc mẹ đã mất ("Mẹ khóc", "Mẹ mua cho con búp bê", "Mẹ dạy tô son").
- Anh chị em ruột không trùng tên gọi. Ở nước ngoài, anh chị em được gọi bằng tên chứ không phải họ, vì cả nhà cùng họ.
- Không còn lặp tin trong cùng năm: thi đỗ bằng lái hai lần, "có chắt" hai lần, nhiều khoản nợ cùng loại bị xử lý cùng lúc, nhận cùng một việc hai lần, nhiều căn nhà cho thuê cùng bỏ trống.
- Nhân vật mất vào cuối năm không còn để treo câu hỏi "Học tiếp sau đại học?".

## v2.7.0 — 14/10/2026

Giữ nguyên toàn bộ tính năng v2.6.0.

### Mới
- **Bố cục gọn hơn**:
  - Khung "Việc bạn muốn làm" chỉ còn một hàng nhóm việc (Tình cảm, Học tập, Tiền bạc…). Bấm một nhóm mới hiện các việc trong nhóm, nên nhật ký cuộc đời có nhiều chỗ hơn. Game nhớ nhóm bạn mở lần trước.
  - Khung "Gia đình & những người thân" chuyển lên đầu cột bên phải.
- **Số lượt hành động theo tuổi**: dưới 10 tuổi 3 lượt, 10–17 tuổi 7 lượt, từ 18 tuổi không giới hạn.
- **Game tự chọn việc**: nếu năm trước bạn không tự làm việc gì, game đôi khi tự chọn ngẫu nhiên một việc (bạn vẫn quyết định các lựa chọn trong đó).
- **Trọng tâm "Cân bằng"** (từ 21 tuổi): cân bằng công việc, sức khỏe, gia đình và trau dồi kỹ năng. Mọi chỉ số tăng nhẹ, thăng tiến đều mà không kiệt sức.
- **Người yêu có nghề nghiệp**: người mới quen hiện cả công việc (đang làm gì, sinh viên, đã nghỉ hưu). Quen khoảng 2 năm hoặc khi đã cưới thì biết được lương. Bảng gia đình hiện nghề và thu nhập (hoặc "thu nhập: chưa rõ"). Người ấy ra trường đi làm, được thăng chức, nghỉ hưu theo năm tháng.
- **Ai trả tiền buổi hẹn**: nữ hẹn hò với nam thì phần lớn bạn nam giành trả; nam thì thường tự trả, đôi khi được người yêu "bao" (nhất là khi người ấy kiếm nhiều hơn); cùng giới thì thường chia đôi.
- **Bố mẹ khá giả chu cấp** tiền sinh hoạt cho con từ 15 đến khoảng 26 tuổi, nhiều hay ít tùy thu nhập của bố mẹ (đang đi học nhận nhiều nhất).
- **Mua xe trả thẳng hoặc trả góp**: mỗi loại ô tô có hai lựa chọn. Trả thẳng khi đủ tiền (tính cả tiền bán xe cũ); trả góp thì trả trước 30%, vay ngân hàng 70% (siêu xe không cho vay).
- **Tự đặt tên thú cưng**: tự tay chọn nhận nuôi thì được đặt tên (hoặc giữ tên gợi ý).

## v2.6.0 — 14/10/2026

Giữ nguyên toàn bộ tính năng v2.5.0.

### Mới
- **Thu nhỏ hộp lựa chọn**: nút "⤓ Thu nhỏ" (hoặc phím Esc) để tạm đóng hộp lựa chọn, xem các bảng, đổi trọng tâm năm nay… Đời tạm dừng trong lúc đó. Thanh "Đang chờ bạn chọn" ở cuối màn hình để mở lại (hoặc Esc / phím cách).
- **Tuổi thơ 0–15 đa dạng hơn**:
  - Hơn 120 dòng kể chuyện nhỏ theo từng độ tuổi (biết lẫy, rụng răng sữa, người bạn tưởng tượng, đọc trộm truyện dưới chăn…). Mỗi câu chỉ xuất hiện một lần trong một đời.
  - Câu chuyện khác nhau theo giới tính (bé trai bắn bi, thả diều, đá bóng; bé gái nhảy dây, chơi đồ hàng, tết tóc), theo nông thôn / thành thị, nhà nghèo / nhà khá giả.
  - 22 tình huống có lựa chọn mới: nhặt được ví, trèo hái trộm xoài, rủ tắm sông, bạn mới chuyển đến bị trêu, Hội khỏe Phù Đổng, thi vẽ tranh, sinh nhật, chọc tổ ong, lén chơi điện thoại của mẹ, hội làng, chuyện ma, cứu mèo, nạp game, video TikTok đầu tiên, lá thư không tên.
  - Riêng bé trai: đá bóng vỡ kính, bị thách đánh nhau, đua xe đạp thả dốc. Riêng bé gái: mái tóc, thỏi son của mẹ. Bé gái mê K-pop nhiều hơn.
- Bé gái ít bị rủ đi net chơi Liên Minh hơn hẳn (trừ khi có năng khiếu game).

### Sửa / điều chỉnh
- "Hai anh em giận nhau" đổi theo giới tính ("hai chị em"…), có nhiều cách kể. Gãy tay lúc nhỏ chỉ xảy ra một lần. Sinh nhật nhà nghèo / nhà khá có nhiều cách kể hơn.

## v2.5.0 — 14/10/2026

Giữ nguyên toàn bộ tính năng v2.4.0. Đời đang chơi dở vẫn chơi tiếp; công an đang tại ngũ được tự xếp vào một ngành.

### Mới
- **Nghề mới**: chủ quán ăn, chủ nhà hàng / chuỗi nhà hàng, tiệm điện thoại (bán → sửa → chủ tiệm → chủ chuỗi), thám tử tư, công chứng viên, chủ phòng khám tư, chủ đầu tư bất động sản. Ngoài ra có các vị trí chỉ vào được qua gia đình hoặc đi lên từ dưới: ban điều hành tập đoàn → chủ tịch tập đoàn (hàng trăm tỷ mỗi năm), lãnh đạo ngân hàng → chủ tịch HĐQT, chính trường (văn phòng tỉnh ủy → bí thư tỉnh ủy → ủy viên Trung ương; ở nước ngoài: hội đồng thành phố → thị trưởng → nghị sĩ → bộ trưởng).
- **Hướng đi logic giữa các nghề**: làm lâu, có kinh nghiệm và vốn thì được mời rẽ hướng. Ví dụ:
  - quản lý quán / bếp trưởng → mở quán ăn → nâng lên nhà hàng;
  - pha chế → mở quán cà phê; thợ sửa xe, sửa điện thoại → mở tiệm riêng;
  - nhân viên cầm đồ, tiệm vàng → tự mở tiệm;
  - công an lâu năm → thám tử tư; thẩm phán, kiểm sát viên → luật sư; luật sư → công chứng viên;
  - bác sĩ → phòng khám tư; giáo viên → trung tâm dạy thêm; kỹ sư xây dựng → chủ thầu;
  - môi giới bất động sản → chủ đầu tư; ngân hàng → lãnh đạo khối; lập trình viên → startup; shipper → shop online.
- **Sinh ra trong gia đình siêu giàu (~1%)**: tài phiệt, chủ ngân hàng, hoặc gia đình chính trị.
  - Tuổi thơ gia giáo: trường quốc tế, vệ sĩ, lịch học kín, phải giữ thể diện gia đình.
  - 17 tuổi gia đình vạch sẵn con đường: nghe theo (du học Mỹ ngành quản trị, hoặc học Luật để vào chính trường; chu cấp hằng năm), thỏa hiệp, hoặc **từ chối thì bị cắt chu cấp**.
  - Ra trường vào thẳng cơ nghiệp gia đình. Có "ô dù" nên thăng tiến nhanh hơn.
  - **Hôn nhân sắp đặt môn đăng hộ đối**: đòi cưới người mình yêu có thể bị gạch tên.
  - Tranh quyền thừa kế với anh chị em. Gia đình có thể sa sút (bố bị kỷ luật, tập đoàn khủng hoảng).
  - Bố mẹ mất: người nghe lời được thừa kế cổ phần, ngồi vào ghế của bố; người bị cắt không có tên trong di chúc. Bị cắt rồi về sau vẫn có cơ hội làm lành.
  - Sống tiếp đời con: con cháu vẫn sinh ra trong gia đình đó.
- **Sự kiện riêng theo từng nghề**:
  - *Thám tử tư*: phần lớn là vụ theo dõi ngoại tình (thù lao vài chục triệu một vụ), xác minh đối tác, tìm người. Theo dõi đúng luật thì chậm; gắn định vị lén thì phạm luật; bám sát thì dễ bị phát hiện và bị đánh. Hoàn thành xuất sắc được thưởng thêm, uy tín tăng.
  - *Công an chia 6 ngành*: CSGT (xe sang say rượu, đua xe, người quen xin bỏ qua), hình sự (truy bắt hung thủ, băng cướp), phòng chống ma túy (đường dây xuyên biên giới, trùm ma túy mua chuộc), kinh tế (giải cứu người bị lừa sang Campuchia, hàng giả, lừa đảo tiền ảo), cơ động, khu vực. Lập công thì được huân chương, thăng hàm vượt cấp. Có thể hy sinh, bị trả thù; nhận hối lộ thì có thể bị khởi tố.
  - *Luật sư*: ly hôn đại gia, tranh chấp hợp đồng, bào chữa miễn phí cho người nghèo, "chạy án" (có thể bị tước thẻ).
  - *Thẩm phán, kiểm sát viên*: phong bì trước phiên tòa.
  - *Bác sĩ*: ca mổ cấp cứu nguy kịch, người nhà bệnh nhân hành hung.
  - *Giáo viên*: dạy thêm, phụ huynh xin nâng điểm, học sinh cá biệt.
  - *Chủ quán, nhà hàng*: khách tố ngộ độc, food reviewer, tăng tiền mặt bằng, bếp chính đòi tăng lương.
  - *Tiệm điện thoại*: máy gian. *Cầm đồ*: xe không giấy tờ.
  - *Xây dựng*: "rút ruột" công trình. *Nhà báo*: điều tra thực phẩm bẩn hoặc nhận tiền ém bài.
  - *Môi giới*: thổi giá. *Ngân hàng*: gài bảo hiểm, duyệt vay cho "sân sau".
  - *Chính trường*: bầu cử đại biểu Quốc hội (2026, 2031…), lời đề nghị "cơ chế", đoàn thanh tra. Sai phạm tích lại thì sớm muộn bị phát hiện.
  - *Tập đoàn*: trái phiếu đến hạn khi thị trường đóng băng, cơ hội thâu tóm đối thủ.

### Sửa / điều chỉnh
- Bố mẹ trong gia đình siêu giàu không còn "bị cắt giảm nhân sự".
- Con nhà giàu từ chối làm ăn phi pháp không còn nói "nghèo cũng không làm chuyện thất đức".

## v2.4.0 — 14/10/2026

Giữ nguyên toàn bộ tính năng v2.3.0. Sửa các lỗi logic do người chơi thử phát hiện, thêm cách tiêu tiền cho người giàu và anh chị em ruột. Đời đang chơi dở tự được bổ sung anh chị em, hạng nhà, hạng xe.

### Sửa lỗi logic
- **Bố mẹ đã mất vẫn xuất hiện**: "Về thăm bố mẹ" chỉ nhắc người còn sống (không còn chuyện bố đã mất mà vẫn "khoe cây cảnh"). Bỏ lựa chọn "mua tivi cho bố mẹ" khi bố mẹ đã khuất. "Bố mẹ cần đến bạn" không còn nhắc người đã mất. Lời đe dọa đòi nợ và chuyện nhờ người nhà trả nợ đổi theo hoàn cảnh: tuổi già thì là các con hoặc anh chị em.
- **"Lần đầu đặt chân đến Hàn Quốc"** sau khi đã đi xuất khẩu lao động ở đó: game nhớ các nước đã từng đến (du lịch, XKLĐ, du học, định cư). Quay lại thì ghi "Quay lại…", và khi chọn điểm đến sẽ ưu tiên nơi chưa đi.
- **Concert ở tuổi 71, thần tượng không già đi**: thần tượng có năm sinh, già đi theo thời gian, đến tuổi thì làm đêm diễn chia tay rồi giải nghệ. Những năm 2060+ có thế hệ ca sĩ mới (tên hư cấu). Hành động "Đi concert" chỉ còn đến 55 tuổi.
- **Nợ treo 60 năm**:
  - Tín dụng đen xử lý ngay năm sau. Ngân hàng và công ty tài chính xử lý sau 3 năm trễ hạn liên tiếp hoặc 5 năm trễ hạn cộng dồn.
  - Thông tin nợ xấu được **xóa khỏi CIC sau 5 năm** không trễ hạn.
  - Khoản vay mua nhà phải tất toán khi 75 tuổi (tự trả, con cái góp, hoặc bán nhà).
  - Ngân hàng, app vay và công ty tài chính không cho người già vay.
  - Sửa lỗi ngân hàng vừa phát mại nhà lại báo "Trả hết khoản vay mua nhà".
- **90 tuổi mắc ung thư vẫn khỏi, rồi lại mắc bệnh khác**:
  - Khả năng khỏi bệnh nặng giảm mạnh theo tuổi.
  - Bệnh mạn tính (tiểu đường, huyết áp, suy thận, viêm gan B, xơ gan, HIV) không "khỏi" nữa: được kiểm soát và phải uống thuốc suốt đời (có chi phí thuốc men). Không bị chẩn đoán lại bệnh đã mắc.
  - Đã từng bị ung thư thì ít bị ung thư mới hơn.
- **Tình huống lặp đi lặp lại**: mỗi hành động chỉ làm được 1 lần mỗi năm. AI không chọn lại cùng một việc trong 3 năm. Mỗi tình huống ngẫu nhiên cách nhau ít nhất 2 năm.
- Bỏ dòng "Nguồn tham khảo" ở bảng Nghề & lương.

### Mới
- **Chứng chỉ ngoại ngữ theo nơi định đến**: IELTS 4.5→8.5, JLPT N5→N1 (Nhật), TOPIK 1→6 (Hàn), HSK 1→6 (Trung/Đài), Goethe A1→C1 (Đức).
  - Đi XKLĐ phải học tiếng cấp tốc. Có sẵn chứng chỉ thì được đơn hàng lương cao hơn.
  - Sống ở nước ngoài lâu thì tiếng bản xứ tự lên.
- **Xe theo mức giàu có**: xe máy, xe máy điện, ô tô điện, ô tô phổ thông, SUV 7 chỗ, xe hạng sang, xe thể thao, siêu xe. Đổi xe thì bán lại xe cũ. Xe sang tốn chi phí nuôi xe mỗi năm.
- **Nhà theo mức giàu có**: hành động "Đổi nhà to hơn" để lên nhà phố nhiều tầng, căn hộ cao cấp, biệt thự, dinh thự. Bán nhà cũ, tất toán nợ cũ, vay thêm nếu thiếu. Nhà càng to chi phí duy trì càng cao.
- **Đầu tư làm ăn**:
  - Mua căn hộ, nhà mặt phố, ki-ốt cho thuê: thu tiền thuê hằng năm, giá lên xuống theo thị trường đất, có khi bỏ trống.
  - Mở cửa hàng tiện lợi, quán cà phê, nhà hàng, spa, phòng gym: lãi lỗ theo năm và theo kinh tế. Lãi đều thì được mời **mở thêm chi nhánh**; lỗ liên tiếp thì đóng bớt chi nhánh hoặc **phá sản**.
  - Có thể bán nhà cho thuê hoặc sang nhượng cửa hàng.
- **Anh chị em ruột** có tên, tuổi, nghề và độ thân thiết.
  - Mẹ có thể sinh thêm em khi bạn còn nhỏ.
  - Tuổi nhỏ có giành đồ chơi, anh chị chở đi học, bênh vực. Lớn lên có đám cưới anh chị em và lên chức chú/cô/cậu/dì/bác.
  - Anh chị em hỏi vay tiền (có thể trả lại sau vài năm), hành động "Gặp anh chị em" (tụ họp, du lịch chung, phụ giúp tiền).
  - Bố mẹ mất thì **chia tài sản thừa kế**: chia đều, nhường, hoặc tranh chấp ra tòa. Anh chị em già đi rồi mất.
- **Nghỉ hưu linh hoạt**:
  - Chủ doanh nghiệp không có tuổi nghỉ hưu cố định: còn khỏe thì làm đến 70–78 tuổi, rồi giao lại cơ nghiệp cho con.
  - Người nghỉ hưu còn khỏe, có vốn được hỏi muốn an hưởng, mở cửa hàng/quán nhỏ (vẫn nhận lương hưu) hay mua nhà cho thuê.

## v2.3.0 — 14/10/2026

Giữ nguyên toàn bộ tính năng v2.2.0. Đời đang chơi dở được tự bổ sung tài sản, mức căng thẳng và chỉ số của con cái.

### Mới
- **⭐ Đánh dấu khoảnh khắc**: mỗi dòng nhật ký có ngôi sao. Khoảnh khắc đã đánh dấu được ưu tiên khi nhân vật hồi tưởng cuối đời, hiện ở màn kết thúc, trong link chia sẻ và trên ảnh thẻ.
- **Tài sản & tiền bạc**:
  - Danh mục đầu tư giữ qua nhiều năm: sổ tiết kiệm, vàng, cổ phiếu, đất. Lãi lỗ hằng năm theo chu kỳ thị trường: chứng khoán tăng mạnh / đi xuống / sập; đất bình thường / **sốt** / **vỡ bong bóng** / đóng băng. Đất đóng băng thì bán phải cắt lỗ.
  - Hết tiền mặt thì phải bán bớt tài sản.
  - Hành động mới "Bán / rút tài sản". Bảng tài chính hiện từng khoản kèm % lãi/lỗ.
  - **Chơi hụi/họ**: hốt sớm lấy vốn (trả lãi) hoặc hốt cuối lấy lãi — và có thể **vỡ hụi**, chủ hụi ôm tiền bỏ trốn.
  - **Bảo hiểm nhân thọ**: gói bảo vệ (chi trả khi mắc bệnh hiểm nghèo) hoặc gói "liên kết đầu tư" 15 năm. Gói liên kết có thể phí cao, hủy sớm mất phần lớn tiền.
- **Sức khỏe tinh thần**:
  - Chỉ số **Căng thẳng** tích tụ theo công việc, nợ nần, con nhỏ, bệnh tật, thi cử. Nó giảm khi nghỉ ngơi, có thú cưng, tập thể dục, trị liệu. Quá tải thì sức khỏe và hạnh phúc đi xuống.
  - **Kiệt sức** (nghỉ phép / trị liệu / nghỉ việc / gồng tiếp).
  - **Trầm cảm sau sinh** (của bạn hoặc của vợ).
  - **Khủng hoảng tuổi trung niên**: bỏ việc theo đam mê, mua mô tô, đi một mình, ngoại tình…
  - Hành động "Chăm sóc tinh thần": trị liệu, thiền, cai mạng xã hội.
- **Con cái có đời riêng**:
  - Con có học lực, độ thân thiết với bố mẹ, có thể lạc lối (nghiện game, bỏ học, đua xe, ma túy) hoặc vào tù.
  - **Ngã rẽ 18 tuổi của con**: ủng hộ học đại học, du học, học nghề, đi làm sớm hay để con tự quyết.
  - Con đi làm, có nghề và lương riêng, được thăng chức. Con xin vốn làm ăn.
  - Về già: con thân thiết và khá giả thì phụng dưỡng nhiều, con xa cách thì ít về thăm.
  - **Sống tiếp đời con**: khi nhân vật mất, có thể sống lại đời của một người con từ lúc chào đời. Bố/mẹ là chính nhân vật cũ, sinh ra cùng quê, cùng gia cảnh. Có ghi thế hệ và dòng họ.
- **Học hành chi tiết**:
  - **Chọn khối thi** ở lớp 11 (A00, A01, B00, C00, D01, H00). Khối quyết định ngành hợp; học trái khối thì vất vả.
  - **Luyện thi** năm cuối cấp.
  - **Điểm thi tốt nghiệp THPT** thang 30, xét tuyển đại học theo điểm chuẩn (trường lớn ~23, trường địa phương ~18).
  - **Học bổng** (toàn phần nếu điểm thi ≥ 27), chuyển trường, bắt nạt trên mạng.
- **Ảnh thẻ cuộc đời** 1080×1350: chân dung pixel, văn bia, nghề chính, số con, tài sản, bản đồ đời người, khoảnh khắc ⭐. Xem trước rồi tải về hoặc chia sẻ thẳng (điện thoại). Có ở màn kết thúc và màn xem đời được chia sẻ.
- **Nhạc nền lofi chill**: tự sinh bằng Web Audio — piano điện với hợp âm jazz, bass trầm, trống nhẹ có swing, tiếng đĩa than lạo xạo. Không dùng file nhạc nên không lo bản quyền. Nút ♪ trên thanh menu và thanh cuộc đời, có thanh âm lượng; nhớ lựa chọn cho lần sau.

### Sửa / điều chỉnh
- Chuyện "con đỗ đại học" trước đây là ngẫu nhiên, giờ thành ngã rẽ có lựa chọn của bố mẹ và phụ thuộc học lực của con.
- Thu nhập bố mẹ ở đời con không bị kẹp theo bảng nghề chung nữa.

## v2.2.0 — 14/10/2026

Giữ nguyên toàn bộ tính năng v2.1.0. Dữ liệu đang chơi dở được tự bổ sung phần mới (thú cưng cũ chuyển sang hệ thú cưng mới, thu nhập bố mẹ lúc chào đời).

### Mới
- **Hai tầng lựa chọn**: mỗi hộp thoại ghi rõ *Lựa chọn thường ngày* hay **⚡ Ngã rẽ quyết định** (học tiếp hay nghỉ, đại học, ngành, việc làm, cưới, sinh con, lên phố, XKLĐ, mua nhà, khởi nghiệp, ly hôn, điều trị bệnh, sang Campuchia, du học, sa ngã…). Ngã rẽ có viền vàng và lời nhắc cân nhắc. Nút mới **"⚡ Chỉ ngã rẽ lớn"**: AI lo các lựa chọn thường ngày theo tính cách, bạn chỉ dừng lại ở ngã rẽ quyết định (vẫn có thể bấm tự chọn).
- **Thú cưng** như 1in8b: hành động "Nuôi thú cưng" chọn loài — chó (chó ta, Phú Quốc, Poodle, Corgi, Husky, Alaska, Phốc sóc, Golden), mèo (ta, mướp, Anh lông ngắn, Ba Tư, Xiêm), cá cảnh (vàng, betta, koi, rồng), chim (chào mào, yến phụng, vẹt), hamster, thỏ, rùa — mỗi loài có giá mua, chi phí nuôi mỗi tháng và tuổi thọ riêng; tối đa 3 con. "Chơi với thú cưng": dắt đi dạo, tiêm phòng, chụp ảnh (có thể viral), dạy trò. Biến cố: ốm (đi thú y / tự chữa / để mặc), **trộm chó** (VN), đi lạc, đẻ con (giữ lại / cho / bán / triệt sản), chó cắn người. Thú cưng già đi rồi mất, được vẽ trong khung cảnh pixel, có dòng chi phí riêng trong bảng tài chính, xuất hiện ở khúc cuối đời.
- **Thêm ~55 nghề, tổng hơn 130 nghề** (bảng "Nghề & lương" trên trang chủ):
  - *Showbiz theo hạng*: ca sĩ hát đám cưới/phòng trà → hạng C → B → A → diva; diễn viên quần chúng → vai phụ → vai chính → hạng A → ngôi sao; rapper, danh hài, người mẫu, KOL/KOC livestream theo hạng; vũ công → biên đạo, nhạc công → producer, biên kịch, quản lý nghệ sĩ, DJ, MC đám cưới/sự kiện.
  - *Nhà nước*: viên chức, cán bộ xã/phường (công chức → chủ tịch → bí thư), thuế, hải quan, thẩm phán, kiểm sát viên, ngoại giao (tùy viên → đại sứ), quản lý thị trường, kiểm toán nhà nước, kiểm lâm, tập đoàn nhà nước (EVN, Viettel, PetroVietnam…).
  - *Freelancer*: thiết kế, dịch thuật/phiên dịch cabin, content/copywriter, lập trình tự do, dựng video, dạy online, affiliate/TikTok Shop, lồng tiếng.
  - *Nghề khác ở Việt Nam*: phi công (cơ phó → cơ trưởng), tiếp viên, kiểm soát không lưu, hướng dẫn viên, lễ tân → tổng quản lý khách sạn, barista, bartender, thu ngân siêu thị, nhân sự, phân tích dữ liệu, logistics/XNK, kỹ sư xây dựng, kỹ sư cơ điện, thuyền viên viễn dương, giàn khoan, thợ lò, tài xế xe tải/container, thợ mộc, nha sĩ, bác sĩ thú y, giáo viên mầm non, PT gym, barber, thợ xăm, spa, chủ vườn sầu riêng, nuôi tôm, tiệm vàng, cầm đồ, chủ xưởng.
- **Thu nhập bố mẹ thay đổi theo năm**: tăng lương, thăng chức, làm ăn phát đạt/thua lỗ, mất việc rồi tìm lại việc, nội trợ đi làm; **nghỉ hưu** (công chức/công nhân 60–62 tuổi, công an 55) nhận lương hưu ~55–70%; chủ kinh doanh giao lại việc ở 65 tuổi; lao động tự do làm đến 68–72 rồi không có lương hưu, từ 75 tuổi nhận trợ cấp hưu trí xã hội. Bảng gia đình hiện thu nhập hiện tại, so với lúc bạn chào đời. Bố mẹ không lương hưu thì con phải gửi tiền nhiều hơn.
- Hồ sơ xuất phát có thêm dòng **Năng khiếu** riêng và thu nhập từng người (bố · mẹ).

### Sửa / điều chỉnh
- **"Biến cố: Năng khiếu game (FPS)" là sai logic** — năng khiếu không phải biến cố. Biến cố giờ là hoàn cảnh thật của xuất phát điểm (bố nghiện ngập, thiếu vắng bố, bố/mẹ thất nghiệp, nghèo đói, đường đến trường xa ở miền núi, mùa bão vùng biển, nhà đông con, mẹ sinh khi còn trẻ…); năng khiếu tách sang dòng riêng và viết rõ: "game bắn súng (FPS)", "game chiến thuật đồng đội (MOBA)".
- Bỏ chữ "10 cuộc đời" trên thanh menu và tiêu đề mục (giờ là "Những cuộc đời đã sống"); nút menu thay bằng "Nghề & lương".
- **Thu nhập sát thực tế hơn** (tham chiếu thu nhập bình quân 2025 ~8,4 triệu/tháng, lương cơ sở 2,34 triệu, khảo sát lương tuyển dụng): chủ kinh doanh thu nhập cao hơn hẳn (kinh doanh tự do 18 → chủ tịch tập đoàn 500 triệu/tháng, nhưng rủi ro phá sản); bằng cấp chỉ cộng thêm khi vượt yêu cầu nghề (không cộng dồn hai lần); lương nhà nước theo hệ số, không phụ thuộc trường danh tiếng; thăng chức chậm lại cho đúng thực tế; "xin tăng lương" không còn nhảy bậc khi chưa đủ thâm niên; chênh lệch vùng miền vừa phải; nổi tiếng hạng A/ngôi sao trở nên hiếm (trước đây ca sĩ dễ kiếm hàng tỷ mỗi tháng); bảng lương bố mẹ nhóm giàu nhất hạ cho sát thực tế.
- Phát triển nghề phụ: nông dân ở nông thôn được mời làm nông nhiều hơn.

## v2.1.0 — 14/10/2026

Giữ nguyên toàn bộ tính năng v2.0.0. Dữ liệu đang chơi dở được tự bổ sung phần mới.

### Mới
- **Quay số phận khi bấm "Chào đời"**: 4 ô quay (tỉnh/thành hoặc quốc gia · dân tộc hoặc nơi sinh · giới tính · gia cảnh) chạy rồi dừng dần ở kết quả; có nút bỏ qua, tự rút ngắn với người bật "giảm chuyển động".
- **Tuổi thơ có lựa chọn**: lễ thôi nôi (bốc đồ vật đoán nghề, ảnh hưởng năng khiếu), ngày đầu mẫu giáo, đòi đồ chơi ở chợ, học chữ trước lớp 1, chọn trường, hè này làm gì (học bơi giảm nguy cơ đuối nước, học vẽ/đàn, về quê với ông bà…), làm vỡ đồ, tiền ăn sáng, nuôi chó/mèo, văn nghệ, xin điện thoại, giúp việc nhà, cho bạn chép bài, đội tuyển học sinh giỏi, Trung thu, tiền lì xì & heo đất, lạc mẹ ở chợ phiên. ~84% số năm từ 1–14 tuổi có lựa chọn.
- **Thu nhập của bố, mẹ và cả nhà** trên giấy khai sinh, hồ sơ xuất phát và bảng gia đình (bố/mẹ có thể thất nghiệp, nội trợ).
- **Tranh pixel**: chân dung nhân vật lớn dần theo tuổi (em bé, học sinh quàng khăn đỏ, áo công an, áo blouse, nón lá, tóc bạc…) và khung cảnh gia đình: kiểu nhà theo hoàn cảnh (nhà sàn, trình tường, nhà tạm, mái ngói, nhà ống, chung cư, biệt thự, phòng trọ, trại giam…), quê/phố/núi/biển/sông nước, trời nắng – hoàng hôn – đêm sao theo tâm trạng, cả nhà và thú cưng.
- **Giao diện mới** tông đêm xanh – vàng kim: trang chủ có hero "Một lần sinh ra. Vạn ngã rẽ.", thẻ **Hồ sơ xuất phát** ngẫu nhiên mỗi lần vào trang (nút "Xuất phát điểm khác" và "Sống đời này"), thẻ tính năng, 3 bước cách chơi. Logo mới cùng tông. Giao diện sáng vẫn có ở nút ◐.

### Sửa / điều chỉnh
- Thu nhập tham chiếu của bố mẹ nhóm giàu nhất được hạ cho sát thực tế.
- Bài test chuỗi Campuchia chạy nhiều lượt hơn để ổn định thống kê.

## v2.0.0 — 14/10/2026

Giữ nguyên toàn bộ tính năng v1.0.0 (2 chế độ, 63/34 tỉnh, 54 dân tộc, 195 quốc gia, giới tính & LGBTQ+, giấy khai sinh, sinh cùng giây, quãng lặng, bản đồ đời người, đài tưởng niệm, lưu tiến trình). Dữ liệu người chơi đang chơi dở từ bản 1.0 được tự động nâng cấp.

### Đổi tên & nhận diện
- Đổi tên game thành **Một Đời**, logo mới: cung đường mặt trời mọc rồi lặn trên đường chân trời — một đời người từ lúc sinh đến lúc mất.

### Từng tuổi một
- Năm nào cũng có chuyện kể (lớp 1 → lớp 12, đại học, đi làm, tuổi già…), kèm dòng thu nhập theo **tháng** và chi tiêu cả năm.
- Ký ức: những khoảnh khắc quan trọng được ghi nhớ để hồi tưởng cuối đời.
- Bạn thân từ thuở nhỏ đi cùng suốt cuộc đời: đi net, bị bắt nạt, hỏi vay tiền, đám cưới, nằm viện, ra đi.

### Ngã rẽ tuổi 18 & chuỗi sự kiện
- Lên Hà Nội / TP.HCM học (bằng cấp được trọng dụng hơn) hoặc học gần nhà; thi trường công an / quân đội; du học (học bổng / bố mẹ chi / qua công ty du học — có thể bị lừa); cao đẳng; đi làm; ở nhà phụ bố mẹ; nghĩa vụ quân sự; xuất khẩu lao động trả nợ cho nhà.
- Lên phố: bị chặt chém / cướp ở bến xe, phòng trọ ảo, đa cấp, "việc làm thêm online".
- "Việc nhẹ lương cao" → bị bán sang trại lừa đảo ở Campuchia: cam chịu, trốn thoát, lén liên lạc đại sứ quán, gia đình chuộc — có thể được giải cứu hoặc bỏ mạng.

### Hơn 80 nghề có thang bậc & thu nhập thật
- Công an / quân đội (Thiếu úy → Thiếu tướng, đúng số năm lên hàm, tuổi nghỉ hưu theo cấp), bác sĩ, điều dưỡng, giáo viên, công chức, văn phòng (thực tập → giám đốc), các loại sale, kinh doanh tự do (nước hoa, nhựa, vật liệu…), tài xế công nghệ, xe ôm, shipper, ăn xin, ve chai…
- Làm đẹp & thời trang: makeup, stylist, thiết kế thời trang, tổ chức sự kiện, người mẫu.
- Showbiz & sáng tạo nội dung theo danh tiếng: streamer (Liên Quân, Free Fire, LMHT, Valorant, Delta Force, Minecraft, Roblox…), YouTuber nút bạc / vàng / kim cương, ca sĩ, diễn viên (phim trăm tỷ hoặc flop), scandal & tẩy chay.
- Esports (tuyển thủ, HLV, caster, nhà đầu tư), thể thao (huy chương SEA Games, ASIAD, Olympic), cờ vua / cờ tướng (FM, IM, GM, Kiện tướng).
- Phi pháp: đòi nợ thuê, cho vay nặng lãi, lừa đảo, trộm, ma túy, buôn lậu, nhà cái — kèm bị bắt, xét xử, ngồi tù, ra tù làm lại cuộc đời.
- Nước ngoài: thu nhập & tài sản hiển thị bằng **tiền bản địa** (won, yên, euro…) kèm quy đổi ra đồng.

### Việc bạn muốn làm (hành động chủ động, 3 lượt/năm)
- Tìm người yêu (app hẹn hò có thể gặp lừa tình), hẹn hò, cầu hôn, sinh con, ly hôn; thi bằng lái; học chứng chỉ / văn bằng 2; tìm việc, xin tăng lương, nghỉ việc, khởi nghiệp; mua xe, mua nhà, vay (ngân hàng, công ty tài chính, người thân, app, vay nóng), trả nợ, đầu tư (tiết kiệm, vàng, chứng khoán, tiền mã hóa, đất nền), vé số / Vietlott, cách chi tiêu, phụng dưỡng bố mẹ; concert thần tượng, du lịch, quán net, đi nhậu; khám sức khỏe, tập thể dục, cai nghiện, từ thiện, đi chùa / nhà thờ; thăm bố mẹ, gặp bạn thân; kiếm tiền bất chính, cá độ.

### Tiền bạc như đời thật
- Bảng thu chi năm: lương/tháng, bạn đời góp, ăn uống, thuê nhà, đi lại, con cái, gửi bố mẹ, thuốc men, trả nợ, mua sắm, khoản phát sinh.
- Nợ: thẻ tín dụng, ví trả sau, vay tiêu dùng, app đen (khủng bố đồng nghiệp & gia đình), vay nóng; trễ hạn → **nợ xấu CIC** → không vay mua nhà, mua xe được; vỡ nợ sau 3 năm.
- Bố mẹ cần sửa nhà, chữa bệnh, mua sắm theo mùa; Tết, đám cưới, mừng cưới.

### Đời sống, cám dỗ & biến cố
- Quán net cỏ (để tiền dưới bàn phím đi vệ sinh, gõ mật khẩu chậm bị nhìn trộm), bắt nạt, quay cóp, thuốc lá điện tử / bóng cười, đi "bão", tỏ tình.
- Giao thông: đèn vàng 3 giây, CSGT (dừng / bỏ chạy → bị đuổi kịp hoặc phạt nguội / xin "bỏ qua"), không bằng lái, say rượu lái xe, ăn vạ, tông người, cướp xe ôm, khách quỵt.
- Gia đình gốc: bố cờ bạc, nghiện rượu, giang hồ, chủ nợ đến nhà; nghèo đói, bỏ học; tiêm chủng theo mức sống — trẻ không tiêm dễ bệnh hơn.
- Bão lũ theo vùng (miền Bắc, miền Trung nhiều; miền Nam ít), chiến tranh & bạo lực băng đảng ở các nước có xung đột, cướp giật, trầm cảm, nghiện ngập.
- Cám dỗ & đạo đức: phong bì, tham nhũng, bán độ, doping, ngoại tình, nhặt được ví, cứu người — điểm **Nhân cách** (thiện ↔ ác).
- Chế độ tự động / người cùng giây: **AI tự quyết theo tính cách** (liều lĩnh, đạo đức, tham vọng, hướng ngoại).

### Khúc cuối đời & chia sẻ
- Chết vì bệnh: phát bệnh → hồi tưởng ký ức → di nguyện cho con cháu → hôn mê → xuôi tay. Chết đột ngột / trẻ nhỏ có khúc cuối riêng.
- Tự lưu **10 cuộc đời gần đây**; **chia sẻ cuộc đời bằng đường link** (người nhận mở ra xem được, không cần tài khoản).

### Sửa lỗi trong quá trình kiểm thử (đã có bài test chống tái phát)
- Tình huống hẹn trước không còn phù hợp (vd. đã nghỉ việc) gây lỗi → kiểm tra hợp lệ trước khi hiện.
- Nợ app đen tăng vô hạn do lãi kép → trần nợ & cơ chế vỡ nợ.
- Sinh viên nhận việc phi pháp vẫn giữ trạng thái đang học → bỏ dở việc học khi nhận việc.
- Tỷ lệ tốt nghiệp đại học bị đẩy lên 65% → hiệu chỉnh lại.
- Tình huống phát hiện tài năng hiện cho người không có năng khiếu.

## v1.0.0 — 14/10/2026 (bản đầu tiên, tên cũ: Một Kiếp Người)

### Tính năng
- **Chế độ Việt Nam**
  - Hai bản đồ hành chính: 63 tỉnh thành (trước 1/7/2025) và 34 tỉnh thành (sau sáp nhập, theo NQ 202/2025/QH15). Ở bản 34 tỉnh, nơi sinh ghi rõ "khu vực tỉnh cũ".
  - Tự chọn tỉnh/thành hoặc ngẫu nhiên theo dân số thực tế.
  - 54 dân tộc: tự chọn hoặc ngẫu nhiên (Kinh 86%, 53 dân tộc còn lại chia 14% theo dân số Tổng điều tra 2019).
  - Tên nhân vật: tự nhập hoặc để trống — tự đặt tên theo phong tục từng nhóm dân tộc.
  - Tôn giáo, kiểu nhà, mức sống, tuổi thọ, tử vong trẻ em thay đổi theo tỉnh và dân tộc.
- **Chế độ Thế giới**: 195 quốc gia, quay theo số trẻ sinh mỗi năm. Chỉ chọn giới tính; tên, thành phố, tôn giáo, gia đình theo quốc gia.
- **Giới tính**: Ngẫu nhiên / Nam / Nữ / LGBTQ+ (Đồng tính nam, Đồng tính nữ, Song tính).
- Giấy khai sinh, 4 em bé "sinh cùng một giây", trọng tâm mỗi năm, quyết định ở các ngã rẽ, quãng lặng ở tuổi 5/15/30/50/70, bản đồ đời người, cáo phó, lời cuối, đài tưởng niệm.
- Tốc độ 1×–16×, tạm dừng, "Tới lựa chọn tiếp", tự động; độ dài một đời 15/30/60 phút; tự lưu tiến trình; sáng/tối; điện thoại.

### Sửa lỗi trong quá trình kiểm thử
- Tuổi thọ mô phỏng thấp hơn thực tế ~5 năm; tỷ lệ đại học quá cao; nhận việc bán hàng rong cùng năm đỗ đại học; mua nhà trả góp bị báo "nợ nần"; tài sản cuối đời âm hàng tỷ; em bé cùng giây hiện sai thành phố sinh; một số câu chữ chưa tự nhiên; sốt xuất huyết xuất hiện quá dày.
