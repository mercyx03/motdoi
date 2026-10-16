# Nhật ký phiên bản — Một Đời

**Nguyên tắc cập nhật:** bản mới = toàn bộ tính năng bản trước + tính năng mới + sửa lỗi.
Trước khi phát hành, bộ kiểm thử hồi quy (`node tests/regression.js`) phải đạt 100%.
Mỗi lỗi đã sửa đều được bổ sung một bài kiểm thử để không tái phát.

## v4.1.0 — 16/10/2026

Giữ nguyên toàn bộ tính năng v4.0.0. Bản này làm theo góp ý của người chơi.

### Sửa lỗi câu chữ
- Nhật ký tuổi 14 không còn câu "mấy chục năm sau đọc lại vẫn còn bật cười" (nhân vật mới 14 tuổi). Các câu "lớn lên nhớ lại…" trong sự kiện tuổi nhỏ cũng được viết lại cho đúng thời điểm.

### Nghĩa vụ quân sự đủ 24 tháng
- Nhập ngũ năm 18 tuổi thì ra quân năm 20 tuổi (trước đây ra quân ngay năm 19 tuổi).
- Thêm các sự kiện trong quân ngũ: kiểm tra bắn đạn thật, hành quân dã ngoại, Tết trong quân ngũ (đứng gác đêm giao thừa, văn nghệ), chiếc điện thoại lén, thư / quà từ hậu phương (người yêu có thể chờ hoặc chia tay), hội thao quân sự, tăng gia sản xuất. Năm đầu: huấn luyện tân binh, về đơn vị và 2 chuyện; năm sau: 3 chuyện, không lặp lại.
- Trợ cấp xuất ngũ và trợ cấp tạo việc làm theo mức lương cơ sở:
  - năm 2026: khoảng 25,3 triệu đồng (lương cơ sở 2,53 triệu);
  - từ 2027: khoảng 45,5 triệu đồng theo mức đề xuất mới (sửa Nghị định 27/2016/NĐ-CP).
  - Áp dụng cả khi thi trượt trường sĩ quan rồi xuất ngũ.

### Con thành tài / phá gia chi tử
- Con học giỏi (18–45 tuổi) có thể thành tài: đỗ thủ khoa, học bổng du học, giải Olympic, giám đốc chi nhánh, bác sĩ giỏi, khởi nghiệp thành công, bảo vệ luận án tiến sĩ.
- Con ham chơi có thể thành phá gia chi tử: cờ bạc, cá độ, vay tín dụng đen, bị đòi nợ tận nhà. Có thể:
  - trả nợ cho con;
  - trình báo công an về nhóm cho vay nặng lãi và bắt con tự chịu trách nhiệm;
  - bán đất, bán nhà trả nợ.

### Đất, vàng mất giá
- Khi lô đất hoặc số vàng tích trữ giảm từ 15% so với giá mua, bạn được hỏi: bán ngay cắt lỗ, bán một nửa, giữ chờ thị trường hồi, hay mua thêm khi giá rẻ. Không hỏi lại trong vòng 3 năm.

### Cặp đôi đồng giới
- Ở Việt Nam pháp luật chưa công nhận hôn nhân cùng giới: hai bạn có thể về chung sống với nhau, hoặc cùng sang một nước đã công nhận hôn nhân đồng giới.
- Danh sách nước được chọn (bấm để chọn, có trang "Xem thêm"): Thái Lan (từ 2025), Úc, Canada, Hoa Kỳ, Hà Lan, Đức, Pháp, Vương quốc Anh, Tây Ban Nha, New Zealand, các nước Bắc Âu, Ireland, Bỉ, Thụy Sĩ, Áo, Bồ Đào Nha, Brazil, Argentina, Mexico, Chile, Colombia, Nam Phi… (chỉ những nước đã hợp pháp hóa).
- Sang đó thì đăng ký kết hôn hợp pháp. Cuộc sống chuyển hẳn sang nước đó: tiền tiết kiệm, khoản vay, vàng, đất, cổ phiếu được quy đổi theo tỉ giá thực; mua sắm, nhà cửa, việc làm tính theo nước đó.
- **Làm việc từ xa:** khi định cư nước ngoài có thể nhận việc online cho công ty Việt Nam (lập trình, biên dịch, viết nội dung, dạy học online). Vẫn gửi tiền về cho bố mẹ được như trước.
- **Về Việt Nam sống một thời gian:**
  - Bán nhà bên đó, trả vé máy bay (tính bằng tiền nước sở tại, khoảng 15 triệu đồng), đổi tiền sang tiền Việt.
  - Về sống ở quê cũ, mua sắm bằng tiền Việt. Việc làm từ xa vẫn giữ được.
  - Muốn quay lại thì đổi tiền Việt sang tiền nước đó, trả vé máy bay (khoảng 25 triệu đồng), tìm chỗ ở và việc làm lại.
  - Hoặc chỉ bay về thăm nhà rồi quay lại.

### Sửa lỗi logic
- Di cư từ Việt Nam: tiền tiết kiệm, khoản vay, giá trị xe, vàng, đất, cổ phiếu, tiền mã hóa được quy đổi theo tỉ giá danh nghĩa và mức giá của nước đến (trước đây quy đổi lệch).
- Ra quân không còn ghi hai lần dòng "xuất ngũ".

## v4.0.0 — 16/10/2026

Bản lớn, gộp toàn bộ v3.9.0 (đại học theo ngành, bảo vệ tốt nghiệp, ngành Y, số liệu nghề — xem bên dưới) cùng các nội dung mới.

### Số liệu nghề sát thực tế
- Số liệu theo thực tế bệnh viện công ở Việt Nam (~250 ngày làm việc / năm):

  | Chuyên khoa | Mỗi năm |
  |---|---|
  | Nội | 6.000–10.000 lượt khám (25–40 lượt / ngày) |
  | Nhi | 7.000–12.000 lượt khám |
  | Da liễu | 8.000–14.000 lượt khám |
  | Ngoại | 180–320 ca mổ |
  | Chấn thương chỉnh hình | 220–380 ca mổ |
  | Phẫu thuật thẩm mỹ | 150–300 ca |
  | Sản | 250–450 ca đỡ đẻ, mổ lấy thai |
  | Gây mê hồi sức | 600–1.000 ca gây mê |
  | Chẩn đoán hình ảnh | 8.000–14.000 phim |

- Bác sĩ thực hành làm dưới sự giám sát nên ít ca hơn. Trưởng khoa, giám đốc bệnh viện bận quản lý nên ít ca chuyên môn.
- Các nghề khác chỉnh lại cho sát thực tế:
  - nha sĩ 1.200–2.500 ca răng;
  - điều dưỡng 60–100 ca trực đêm;
  - dược sĩ 12.000–25.000 đơn thuốc;
  - giáo viên 120–250 học trò mỗi năm học;
  - tài xế công nghệ 4.000–7.000 cuốc;
  - shipper 9.000–16.000 đơn;
  - đầu bếp 25.000–60.000 suất ăn.

### Tân binh toàn năng
- Nam ca sĩ trẻ / tân binh 16–24 tuổi (hoặc có năng khiếu âm nhạc) có thể được mời.
- Thể thức: Kỳ sát hạch 1 (đánh giá đầu vào) → Kỳ sát hạch 2 → Kỳ sát hạch 3 (vũ đạo, có thể tập nhảy trước) → Survival showcase (chọn đội hình thăng cấp) → Giai đoạn thăng cấp (đối đầu nhóm nhạc quốc tế) → Chung kết – Sân khấu tinh hoa (chọn đội hình debut 7 thành viên).
- Phần lớn bị loại qua các kỳ sát hạch; chỉ khoảng 1/4 được debut nhóm nhạc.

### Giải thưởng chung kết
- **Anh trai / Em xinh / Tinh hà "Say Hi":** quán quân, Best 5, cùng các giải phụ: The Best Leader, The Best Performer, The Best Group Performance, The Best Transformer, The Best Showcase, The Best Hit. Quán quân Tinh hà nhận giải 1 tỷ đồng.
- **Anh trai vượt ngàn chông gai:**
  - Gia tộc Anh tài Toàn năng, Thủ lĩnh Gia tộc, danh hiệu Chiến tướng (từ 2026).
  - Các giải bình chọn: Anh Tài được yêu thích nhất, Anh Tài quốc dân, Anh Tài có điệu nhảy sexy, Nam thần giải trí, Anh Tài truyền cảm hứng, Anh Tài năng lượng, Anh Tài ấm áp.
- **Tân binh toàn năng:** Tân binh dẫn đầu bảng điểm cá nhân (được diễn solo ở chung kết), Tân binh được yêu thích nhất.

### Tham gia show
- Cả chương trình (các vòng thi, nhật ký) diễn ra trọn trong một năm.
- Có thể tham gia lại mùa sau hoặc chương trình khác sau ít nhất 2 năm, tối đa 3 lần trong đời. Đã vô địch / debut thì không thi lại chính chương trình đó.
- Tinh hà "Say Hi" có trong danh sách chương trình từ năm 2026.
- Chuyện đã gặp ở 3 đời gần nhất giờ càng ít gặp lại ở đời mới.

### Show hẹn hò trên truyền hình
- Độc thân, 20–42 tuổi, hồ sơ nổi bật (học vấn, việc làm, giao tiếp, danh tiếng) thì được bạn bè đăng ký hoặc tự đăng ký.
- **Bạn muốn hẹn hò:** ngồi sau hàng rào trái tim, giới thiệu bản thân, người thân góp ý, 2 phút trò chuyện rồi cùng bấm nút. Cả hai bấm thì thành đôi.
- **Người ấy là ai:**
  - Nữ tham gia: là nữ chính, xem ngoại hình, phong cách, nghề nghiệp của 5 chàng trai.
  - Mini game 3 vòng (ngoại hình & nghề → tài năng → câu hỏi riêng) để loại dần, có ban cố vấn đoán giúp (đúng hay sai tùy độ tinh ý).
  - Mỗi lần loại, chương trình công bố sự thật: độc thân thật, đã có người yêu, hay là người đồng tính trà trộn.
  - Chung cuộc chọn người ấy; độc thân và hợp nhau thì về với nhau.
  - Nam tham gia: là một trong 5 chàng trai, qua 3 vòng (giới thiệu bản thân → tài năng → thuyết phục) cố gắng để nữ chính chọn mình.
- **Đảo thiên đường** (đến 35 tuổi): sống chung trên đảo Phú Quốc với các bạn trẻ độc thân, thử thách vận động, thắng thì được hẹn hò ở khu nghỉ dưỡng "thiên đường". Ngày cuối cả hai cùng chọn nhau mới thành đôi.

## v3.9.0 — 16/10/2026 (gộp vào v4.0.0)

Giữ nguyên toàn bộ tính năng v3.8.1. Bản này làm theo góp ý của người chơi.

### Sự kiện
- Không xóa sự kiện nào. Mọi sự kiện vẫn xuất hiện ngẫu nhiên để mỗi đời mỗi khác.
- Đã rà soát lại: sự kiện nghề nghiệp chỉ xảy ra với đúng nghề (hoặc nghề gần, VD người mẫu được mời đóng phim).

### Đại học: số năm học theo ngành, bảo vệ tốt nghiệp
- **Số năm học:**
  - Ngành thường: 4 năm.
  - Kỹ sư Bách khoa, Kiến trúc: 5 năm.
  - Dược: 5 năm.
  - Y đa khoa, Răng – Hàm – Mặt, Y học cổ truyền: 6 năm.
  - Bác sĩ quân y (Học viện Quân y): 7 năm.
  - Điều dưỡng: 4 năm.
  - Cao đẳng: 2 năm.
- **Có tên trường theo ngành và nơi học,** VD Đại học Bách khoa Hà Nội, Kinh tế Quốc dân, Đại học Y Hà Nội, Đại học Y Dược TP.HCM, Đại học Huế, Đại học Cần Thơ…
- **Năm cuối phải bảo vệ đồ án / khóa luận** (ngành y thi tốt nghiệp lý thuyết, lâm sàng):
  - Có thể rớt và phải học thêm một năm để bảo vệ lại.
  - Sinh viên Bách khoa hay "dính" 1–2 lần, trừ khi học rất giỏi.
  - Thuê người làm hộ thì dễ bị hội đồng phát hiện.
- **Thực tập cuối khóa** (ngân hàng, công ty kiểm toán, văn phòng luật, trường THPT, công ty thiết kế…): thực tập tốt có thể được giữ lại làm chính thức sau khi ra trường.

### Ngành Y
- **Chọn hướng học:** bác sĩ đa khoa, răng hàm mặt, y học cổ truyền, dược, điều dưỡng, bác sĩ quân y.
- **Thực tập ở bệnh viện lớn theo nơi học:**
  - Hà Nội: Bạch Mai, Việt Đức, Bệnh viện K, Nhi Trung ương, Phụ sản Trung ương.
  - TP.HCM: Chợ Rẫy, Từ Dũ, Nhi Đồng 1, Bệnh viện Đại học Y Dược, Nhân dân 115.
  - Các tỉnh khác: Trung ương Huế, Đa khoa Trung ương Cần Thơ, Trung ương Thái Nguyên, Việt Tiệp…
  - Quân y: Bệnh viện 108, 103, 175.
- **Tình huống khi thực tập:** ca trực đêm đầu tiên, lần đầu vào phòng mổ (có khi choáng ngã), bệnh nhân đầu tiên ra đi, người nhà bệnh nhân quát tháo, tự tay ép tim cấp cứu.
- **Thi bác sĩ nội trú** (năm cuối, học giỏi): đỗ thì học thêm 3 năm, ra trường chuyên môn vững.
- **Chọn chuyên khoa** (bác sĩ đa khoa, quân y), thu nhập khác nhau:
  - Cao hơn: phẫu thuật thẩm mỹ, chấn thương chỉnh hình, da liễu, tim mạch.
  - Trung bình: nội, ngoại, sản, nhi, chẩn đoán hình ảnh, gây mê hồi sức, ung bướu, tâm thần.
  - Răng hàm mặt vốn thu nhập cao.
- **Về công tác đúng nơi theo chuyên khoa** (sản → Từ Dũ / Phụ sản Trung ương, nhi → Nhi Đồng 1 / Nhi Trung ương, ung bướu → Bệnh viện K…). Ra trường phải thực hành 18 tháng mới có chứng chỉ hành nghề.
- **Giàu thì mở phòng khám** theo chuyên môn (nha khoa, da liễu, sản…).

### Số liệu nghề tự ghi trong nhật ký (không phải lựa chọn)
- Bác sĩ: đã khám bao nhiêu lượt bệnh nhân, mổ bao nhiêu ca. Nha sĩ: điều trị bao nhiêu ca răng. Có cột mốc (VD 10.000 lượt bệnh nhân, 1.000 ca mổ).
- Các nghề khác cũng vậy:
  - giáo viên, giảng viên (số học trò);
  - luật sư, công an (vụ việc);
  - tài xế công nghệ (cuốc xe), shipper (đơn hàng);
  - đầu bếp (suất ăn), ca sĩ (show diễn);
  - lập trình viên (dự án), kỹ sư xây dựng, kiến trúc sư (công trình);
  - thợ tóc (lượt khách), nông dân (tấn lúa), phóng viên (bài báo);
  - hướng dẫn viên (đoàn khách), môi giới nhà đất (giao dịch)…
- Hồ sơ có mục "Số liệu nghề nghiệp" và chuyên khoa.

### Sửa lỗi
- Dược sĩ, nha sĩ, bác sĩ thú y có câu kể riêng thay vì "những ca trực đêm ở bệnh viện".

## v3.8.1 — 16/10/2026

Sửa lỗi theo góp ý người chơi.

- **Đã đón bố mẹ về ở cùng mà vẫn bị hỏi "Về thăm nhà":**
  - Trước đây vẫn có "gọi video hỏi thăm", và chọn "dành một ngày ở nhà" thì lại ra câu "mẹ dặn năng về hơn".
  - Nay khi sống cùng nhà với bố mẹ (đã đón về ở cùng, hoặc chưa ra ở riêng, chưa lập gia đình), hành động đổi thành **"Dành thời gian cho bố mẹ"** với các lựa chọn:
    - dành trọn một ngày đưa bố mẹ đi chợ, đi chùa, đi khám, xem lại album ảnh cũ…;
    - về sớm ăn cơm tối cùng bố mẹ;
    - biếu bố mẹ ít tiền tiêu.
  - Ở xa thì vẫn về thăm, gọi video như cũ.
- **Tên nhân vật không đồng nhất khi chơi ở các nước khác:**
  - Trước đây nhân vật nữ sinh con thì mỗi đứa con mang một họ ngẫu nhiên.
  - Nay con mang họ cha theo đúng kiểu đặt tên từng nước: phần lớn các nước là họ cha; nước dùng tên cha làm họ (Ethiopia, Somalia, Malaysia…) là tên cha; nước hai họ (Tây Ban Nha, Bồ Đào Nha, Mỹ Latinh) là họ cha + họ mẹ.
  - Anh chị em không còn trùng tên nhau.
- **Lặp câu khi chơi ở các nước khác:**
  - Tin "cò đất dựng lều" là chuyện ở Việt Nam, nay ở nước khác đổi thành tin nhà đất chung.
  - Tin thị trường đất, chứng khoán có nhiều cách kể và cách nhau ít nhất 8 năm.
  - Ramadan, Eid, Giáng sinh, Phục sinh có nhiều câu kể khác nhau và thưa hơn.
  - Vào bệnh viện tư có nhiều cách kể.
  - Tỉ lệ dòng nhật ký lặp lại ở các nước khác giảm từ 5,2% xuống 3,8%.
- **Trúng số nhận giải công khai:** người lạ "nhận vơ" và họ hàng chắc chắn tìm đến trong những năm ngay sau đó.
- Người trên 85 tuổi mắc ung thư càng hiếm khi khỏi hẳn.

## v3.8.0 — 16/10/2026

Giữ nguyên toàn bộ tính năng v3.7.0. Bản này làm theo góp ý của người chơi.

### Sửa lỗi
- **Thi trượt đại học bị kẹt ở ngã rẽ "Mười tám tuổi":**
  - Lỗi cũ: ôn thi lại một năm mà điểm thi vẫn giữ nguyên, nên trượt mãi, lại được ôn thi lại không giới hạn.
  - Nay mỗi năm ôn thi lại điểm thi tăng thêm khoảng 1–3,5 điểm. Được ôn thi lại tối đa 2 lần (thi 3 lần), sau đó phải chọn học nghề hoặc đi làm.
  - Tiêu đề ghi đúng "Thi lại đại học — lần thứ 2 / 3" thay vì "Mười tám tuổi" khi đã 20 tuổi.
- **Người 81 tuổi bị "đi học chứng chỉ":** học chứng chỉ, thi lại IELTS chỉ đến 60 tuổi; thi bằng lái đến 70 tuổi.
- **Đi ô tô bị CSGT phạt "không đội mũ bảo hiểm":** nay lỗi theo đúng loại xe. Ô tô: không thắt dây an toàn, chạy quá tốc độ, dùng điện thoại khi lái, đi sai làn (mức phạt theo Nghị định 168/2024). Xe máy: không đội mũ bảo hiểm, đi sai làn.
- **Trại lừa đảo:** bị giam thì không chi tiêu, mua sắm, đi chơi, yêu đương, cưới hỏi, chuyển nhà được; không có chuyện đời thường bên ngoài. Chi tiêu định kỳ cũng tạm dừng.

### Ca sĩ tham gia show thực tế
- Ca sĩ nam trẻ là tân binh tiềm năng hoặc đã có tiếng có thể được mời tham gia **Anh trai "Say Hi"**. Ca sĩ nữ có thể được mời **Em xinh "Say Hi"**. Nghệ sĩ nam từ 30 tuổi, có tên tuổi (ca sĩ, diễn viên, MC, vận động viên…) có thể được mời **Anh trai vượt ngàn chông gai**.
- **Anh trai / Em xinh "Say Hi":** Bài nhóm liên quân → Livestage 1 → Livestage 2 → Livestage 3 → Livestage 4 (Dance battle) → Chung kết (nhóm Best 5, quán quân).
- **Anh trai vượt ngàn chông gai:** Đêm Hội ngộ → Công diễn 1 → 2 → 3 → 4 → 5 → Đêm chung kết (Gia tộc Anh tài Toàn năng).
- Mỗi vòng được ghép đội / "nhà" ngẫu nhiên với các anh trai, em xinh, anh tài thật của chương trình. Có thể được bầu làm đội trưởng. Mỗi vòng chọn cách trình diễn:
  - "gánh" phần khó nhất;
  - diễn chắc phần sở trường;
  - thử ý tưởng mới / học nhạc cụ, võ thuật mới.
- Trước vòng **Dance battle** có thể tập nhảy ngày đêm để không bị lộ điểm yếu.
- **Kịch tính:** điểm thấp thì rơi vào nhóm có nguy cơ dừng chân, rồi có thể được fan bình chọn cứu (Say Hi) hoặc được các anh tài bỏ phiếu hồi sinh (Anh tài). Đủ mạnh thì vào Best 5, vô địch, hoặc được gọi tên vào Gia tộc Anh tài Toàn năng.
- Dù dừng chân ở vòng nào cũng nổi tiếng hơn, cát-xê tăng.

### Giữ nhịp game vừa phải
- Bản này thêm nhiều sự kiện mới, nên để mỗi đời không bị dồn quá nhiều lựa chọn (giữ dưới 90 lựa chọn / đời):
  - Các sự kiện mới phần lớn chỉ xảy ra 1 lần mỗi đời.
  - "Mua sắm", "nhặt được ví" tối đa 1 lần; "anh chị em vay tiền", "bạn mượn tiền", "việc online", CSGT, đèn vàng tối đa 2 lần.
  - Từ chối mua nhà thì lâu hơn mới bị hỏi lại.

### Concert & thần tượng
- **Concert theo từng chương trình, từng mùa**, với đầy đủ nghệ sĩ:
  - Anh trai "Say Hi" mùa 1 (2024) — 30 anh trai;
  - Anh trai "Say Hi" mùa 2 (2025) — 30 anh trai;
  - Em xinh "Say Hi" — 30 em xinh;
  - Tinh hà "Say Hi" (2026) — 24 anh trai;
  - Anh trai vượt ngàn chông gai 2024 và 2026.
- Chọn chương trình → hiện toàn bộ nghệ sĩ (10 người một trang) → chọn **bias** để ủng hộ (hoặc "thương hết cả đội hình"). Đi concert thì giơ banner tên bias, có lúc được bias bắn tim.
- **Fanmeeting:** săn vé thường hoặc VIP (hi-touch, chụp ảnh nhóm). Có cơ hội được thần tượng bốc thăm gọi tên lên sân khấu, chụp polaroid ký tặng, hỏi han, đọc thư của bạn, tặng quà.
- **Chuyện làm fan:** fan project sinh nhật thần tượng (màn hình LED, từ thiện), cày vote đêm chung kết, săn photocard bias, đón thần tượng ở sân bay (văn minh hay chen lấn), cãi nhau trên mạng.

### Kỹ năng đã học thì có lúc dùng đến
- Học bơi, học võ, học sơ cứu (khi nhỏ hoặc qua mục "Học bơi / học võ / học sơ cứu"). Nghề công an, quân đội, y tế, ngư dân cũng có sẵn kỹ năng phù hợp.
- **Biết võ:** gặp người bị bắt nạt, giật đồ giữa phố → can thiệp, được ghi nhận "hành động dũng cảm".
- **Biết bơi:** đi biển gặp đứa trẻ đuối nước → bơi ra cứu. Không biết bơi mà liều thì rất nguy hiểm.
- **Biết sơ cứu:** gặp người ngưng tim → ép tim, hồi sức chờ xe cấp cứu.
- **Năng khiếu có dịp thể hiện:** hát mừng đám cưới, vẽ chân dung tặng bà, đóng vai chính tiểu phẩm cuối năm, chỉ đường cho du khách nước ngoài, kèm toán cho em, làm MC bất đắc dĩ, sửa đồ cho hàng xóm, trang điểm cho cô dâu, vô địch giải game ở quán net, thắng cờ các cụ ở công viên…

### Tương tác theo trend
- **Mua nước "lấy lòng"** người yêu, vợ / chồng, anh chị em, bạn thân. Chọn món theo menu: trà sữa trân châu đường đen, trà sữa Đài Loan, matcha latte, trà đào cam sả, cà phê muối, bạc xỉu, hồng trà macchiato, sữa tươi trân châu đường đen, trà sữa nướng, trà vải, oolong sữa, kem ốc quế…, kèm quán hay bán.
  - Mua trúng món tủ thì người ấy hết dỗi.
  - Hỏi "uống gì?" có khi nhận về câu kinh điển "Gì cũng được".
- **Hẹn hò thêm:** ăn mì cay 7 cấp độ, xem Netflix ở nhà, gà rán KFC / Jollibee, buffet tokbokki Dookki, lẩu Haidilao, buffet hải sản Cửu Vân Long, Pizza 4P's. Sống ở nước ngoài thì không hiện các thương hiệu chỉ có ở Việt Nam.
- **Rủ hội bạn đi ăn:** Dookki, gà rán, mì cay, Haidilao, Cửu Vân Long, thịt nướng Hàn Quốc, quán ốc vỉa hè, trà sữa rồi về xem Netflix. Chi phí chia đều, thỉnh thoảng giành bao cả hội.

## v3.7.0 — 15/10/2026

Gộp v3.6.0 (bên dưới) và giữ nguyên toàn bộ tính năng trước đó.

### LGBT+
- **Tạo nhân vật:** mục LGBTQ+ giờ có 4 lựa chọn:
  - **Bột tôm** — đồng tính nam (bottom);
  - **Tóp mỡ** — đồng tính nam (top), lựa chọn mới;
  - **Bé Liên** — đồng tính nữ;
  - **Bi** — song tính, rung động với cả nam lẫn nữ.
- **Tuổi thơ như mọi bạn khác.** Phần lớn nhận ra mình vào khoảng 12–13 tuổi, mỗi kiểu có lời kể riêng (VD tóp mỡ: "lúc nào cũng muốn đứng ra che chắn cho cậu ấy"; bột tôm: "thích được cậu ấy quan tâm"; bé Liên: rung động với cô bạn cùng lớp; bi: thích cả bạn nam lẫn bạn nữ).
- **Hẹn hò, chung sống:**
  - Nam hẹn hò với nam, nữ với nữ; Bi có thể quen cả nam lẫn nữ.
  - Ở Việt Nam, luật chưa công nhận hôn nhân cùng giới nên cặp đôi **về chung một nhà**. Ở nước đã công nhận thì đăng ký kết hôn.
  - Hai người gọi nhau là "người bạn đời". Muốn có con thì nhận con nuôi.
  - Người yêu của tóp mỡ thường là bột tôm và ngược lại.
- **Tình huống mới:**
  - thầm thương bạn cùng lớp;
  - nói thật với bạn thân;
  - đi VietPride / Pride;
  - Tết bị họ hàng giục "bao giờ lấy vợ / lấy chồng", bị mai mối;
  - đưa người yêu cùng giới về ra mắt gia đình;
  - hàng xóm, bà chủ nhà dò hỏi "hai đứa là anh em họ à?";
  - hội bạn trêu "trong nhà ai là tóp mỡ, ai là bột tôm";
  - song tính bị hiểu lầm là "chưa quyết định";
  - câu đùa kỳ thị ở chỗ làm;
  - hội chị em bé Liên;
  - bàn chuyện nhận con nuôi.
- Hồ sơ ghi cách gọi quen thuộc: "Đồng tính nam (tóp mỡ)", "Đồng tính nữ (bé Liên)", "Song tính (bi)".

### Sửa lỗi logic
- Biệt danh sau khi công khai: nữ đồng tính trước đây bị gọi nhầm "bột tôm" (đã sửa thành "bé Liên"); tóp mỡ được gọi là "tóp mỡ"; thêm biệt danh "bi".
- Đòi nợ app: người không đi làm không còn bị "ảnh ghép lan khắp nhóm Zalo công ty"; ở nước ngoài không còn nhắc Zalo.
- Mức thân thiết với con, anh chị em không còn vượt quá 100 (vài lựa chọn cộng thêm mà chưa chặn trên).

### Chống lặp lựa chọn (theo góp ý người chơi)
- Đo lại trên 300 đời người: không có lựa chọn nào bị hỏi hai lần trong cùng một năm. Những lựa chọn lặp lại nhiều qua các năm đã được giới hạn:
  - Lời mời casting của diễn viên: cách năm một lần, tối đa 8 lần một đời (trước đây có đời tới 15 lần).
  - "Mở thêm chi nhánh?": cách nhau ít nhất 3–4 năm, tối đa 6 lần (trước đây tới 11 lần).
  - Chuyện sở thích: tối đa 2 lần một đời, cách nhau 6 năm.
  - Cơn nghiện cờ bạc: cách nhau ít nhất 3 năm, càng về sau càng thưa.
  - Thi năng khiếu: trượt 2 lần (trước đây 3 lần) thì dừng.
  - Trầm cảm (do nhiều biến cố cùng gây ra): cách nhau ít nhất 3 năm, tối đa 4 lần một đời.
  - Khi game tự chọn việc thay bạn (chế độ tự động), mỗi việc tối đa 3 lần một đời.
- Chuyện tuổi thơ riêng theo giới (VD bé gái mê K-pop, bé trai đá bóng) giờ xuất hiện đúng theo trọng số ở mọi lượt, không chỉ ở "nhịp tuổi thơ".

## v3.6.0 — 15/10/2026

Giữ nguyên toàn bộ tính năng v3.5.0. Bản này làm theo góp ý của người chơi.

### Sống ở nước ngoài: mua sắm theo nơi đang sống
- Trước đây, du học rồi định cư Úc vẫn chỉ mua được "nhà cấp 4, chung cư mini ở TP. HCM", xe Wave, VinFast theo giá Việt Nam, vé Vietlott.
- **Nhà:** giá theo thành phố đang sống (VD "Giá nhà ở Brisbane, Úc"), loại nhà kiểu nước ngoài: căn hộ studio, căn hộ 2 phòng ngủ, nhà liền kề (townhouse), nhà riêng có sân vườn, biệt thự, dinh thự. Giá tính theo thu nhập trung bình nước đó.
- **Xe:** giá theo thị trường quốc tế (không gồm thuế nhập khẩu, tiêu thụ đặc biệt như ở Việt Nam), đổi theo mức giá nước đó.
- **Vé số:** xổ số quốc gia nơi đang sống, không còn Vietlott.
- **Nhà cho thuê:** giá theo giá nhà nơi đó.
- Áp dụng cho cả người định cư ở nước ngoài và người sinh ra ở nước khác.

### Mục "💰 Chi tiêu"
- Một mục riêng ở đầu "Việc bạn muốn làm", gom mọi việc tiêu tiền: đầu tư (cổ phiếu, tiền mã hóa, vàng, đất), tìm việc mới, mua nhà, đổi nhà, chuyển chỗ ở, mua xe, du lịch, nhà cho thuê, kinh doanh, bảo hiểm, biếu bố mẹ, từ thiện, khám sức khỏe, vay, trả nợ…
- **Chi tiêu định kỳ:** bật một lần, tự động chi mỗi kỳ, không tốn lượt, khỏi phải chọn lại mỗi năm.
  - Du lịch trong nước 1 lần/năm; du lịch nước ngoài 1 lần/2 năm.
  - Khám sức khỏe định kỳ 1 lần/năm (phát hiện bệnh sớm).
  - Tập gym, biếu bố mẹ hằng tháng, làm từ thiện, học thêm một khóa kỹ năng.
  - Đầu tư đều đặn 10% thu nhập vào quỹ chỉ số.
- Không đủ tiền thì năm đó tạm bỏ qua, không đẩy vào nợ.

### Chế độ nghỉ hưu
- Từ 55 tuổi (nữ từ 50) có thể tự chọn **"Nghỉ hưu"**, có ghi rõ đã đóng BHXH bao nhiêu năm và có lương hưu hay không.
- Trước đây bấm "Nghỉ việc" lúc đến tuổi chỉ là thất nghiệp, nên game cứ hỏi nhận việc mới.
- Đã nghỉ hưu (tự chọn hay đến tuổi) thì **nghỉ hẳn**: không còn bị hỏi nhận việc này việc kia.
- Muốn đi làm lại thì tự bấm "Đi làm lại (đang nghỉ hưu)".

### Mới
- **Chuyển chỗ ở** sang thành phố khác (trong nước, hoặc trong nước đang định cư). Người làm công có thể phải nghỉ việc để tìm việc mới ở nơi ở mới.

## v3.5.0 — 15/10/2026

Giữ nguyên toàn bộ tính năng v3.4.0.

### Năng khiếu → trường chuyên ngành → nghề
- **Định hướng ở tuổi 15–17:** thầy cô và bố mẹ gợi ý hướng đi theo năng khiếu, kèm tên trường và nghề phù hợp. Ba lựa chọn:
  - Theo năng khiếu, luyện thi năng khiếu từ sớm.
  - Học văn hóa là chính, vẫn giữ năng khiếu để mở cả hai đường.
  - Chọn hướng khác.
- **Ngã rẽ 18 tuổi** có thêm 3 trường chuyên ngành hợp nhất với năng khiếu. Mỗi trường ghi rõ nội dung thi, khả năng đỗ và nghề có thể làm sau khi ra trường. Đỗ hay trượt tùy trình độ năng khiếu, sự chuẩn bị và điểm văn hóa. Các trường theo năng khiếu:
  - **Ca hát:** Học viện Âm nhạc Quốc gia Việt Nam, Nhạc viện TP. HCM, ĐH Sư phạm Nghệ thuật Trung ương, ĐH Văn hóa Nghệ thuật Quân đội, CĐ Nghệ thuật Hà Nội.
  - **Hội họa:** ĐH Mỹ thuật Việt Nam, ĐH Mỹ thuật TP. HCM, ĐH Mỹ thuật Công nghiệp, ĐH Kiến trúc Hà Nội.
  - **Diễn xuất:** ĐH Sân khấu – Điện ảnh Hà Nội / TP. HCM, ĐH Văn hóa Nghệ thuật Quân đội.
  - **Thể thao:** ĐH Thể dục Thể thao Bắc Ninh / TP. HCM, ĐH Sư phạm TDTT Hà Nội.
  - **Ngoại ngữ:** ĐH Ngoại ngữ – ĐHQG HN, ĐH Hà Nội, Học viện Ngoại giao.
  - **Toán:** ĐH Bách khoa Hà Nội, ĐH Công nghệ, ĐH Khoa học Tự nhiên.
  - **Ăn nói:** Học viện Báo chí và Tuyên truyền, ĐH KHXH&NV, ĐH Luật.
  - **Khéo tay:** Bách khoa, ĐH Sư phạm Kỹ thuật, cao đẳng nghề.
  - **Kinh doanh:** NEU, Ngoại thương, UEH.
  - **Làm đẹp:** thiết kế thời trang, cao đẳng chăm sóc sắc đẹp.
- **Ra trường:** gợi ý nghề đúng chuyên ngành (VD Thanh nhạc → ca sĩ, nhạc công; Sư phạm Âm nhạc → giáo viên; trường quân đội → diễn viên đoàn văn công). Vẫn có thể chọn ngành khác.
- Nhật ký, hồ sơ ghi đúng tên ngành ("Tốt nghiệp đại học ngành Thanh nhạc").
- **Nghề mới:** họa sĩ; diễn viên đoàn văn công quân đội.

### Sự kiện theo bối cảnh ngành (hơn 40 sự kiện)
- **Ca hát:**
  - Mua bài của nhạc sĩ hit-maker (đắt, dễ thành hit hơn), mua bài của nhạc sĩ trẻ, tự sáng tác, hoặc cover. Có bài hay vẫn cần may mắn.
  - Thi các cuộc thi giọng hát / rap / sáng tác trên truyền hình.
  - Clip hát đám cưới bị quay lén rồi lan truyền.
  - Giữ quyền tác giả để nhận tiền bản quyền hằng năm.
  - Hạt xơ dây thanh: nghỉ điều trị hay cố hát tiếp.
  - Mùa show Tết, người hâm mộ quá khích.
  - Đoàn văn công biểu diễn phục vụ bộ đội biên giới.
- **Mỹ thuật, thiết kế:** triển lãm cá nhân, khách đặt vẽ chân dung, đơn "chép tranh" ký tên danh họa (có hậu quả về sau), đấu giá từ thiện, thi phương án kiến trúc, tuần lễ thời trang, mất thẻ nhớ ảnh cưới.
- **Sân khấu – điện ảnh – truyền hình:** phim đầu tay (nghệ thuật hay thương mại), kịch bản bị sửa, sự cố ở đám cưới, dẫn thay chương trình lớn.
- **Thể thao:** phát hiện học trò nghèo có năng khiếu, lời đề nghị khai gian tuổi, khách đòi thuốc tăng cơ.
- **Ngoại ngữ, du lịch:** phiên dịch cabin, phát hiện mình dịch sai, khách mất hộ chiếu, hành khách gây rối trên máy bay.
- **Kỹ thuật:** dự án gấp, sáng kiến – sáng chế, ép ký kiểm định khi chưa thử tải (có hậu quả về sau), rủ khởi nghiệp.
- **Các nghề trước đây chưa có sự kiện riêng:** thợ hàn, thợ mộc, phục vụ, bán hàng rong, bán vé số, công chứng, đầu bếp, trang điểm, thợ xăm, spa.
- Như mọi bản trước, tình huống cám dỗ nào cũng có lựa chọn làm đúng. Cán bộ, công an trong sự kiện làm việc tận tình.

### Tên người Việt tự nhiên hơn
- Trước đây tên đệm và tên gọi được ghép ngẫu nhiên, nên có những tên nghe không giống người Việt như "Trần Tường Hà".
- Nay tên đệm + tên gọi lấy từ danh sách hơn 370 tên có thật, thường gặp (Nguyễn Minh Khôi, Trần Thu Hà, Lê Khánh Linh, Phạm Gia Bảo…).
- Không ghép "Văn" cho nữ, "Thị" cho nam; không trùng họ với tên gọi.

### Sửa lỗi logic
- Trẻ chưa / không đi học không còn có chuyện "làm lớp trưởng", "bị cả lớp trêu" (trước đây dòng này lọt qua bộ lọc cuối năm).
- Không còn "đạt giải học sinh giỏi cấp tỉnh" hai lần trong cùng một năm.
- Học xong, chưa có việc mà bố mẹ vẫn gửi tiền kèm câu "con cứ lo học" → nay câu nói hợp hoàn cảnh.
- Sơ cứu cứu sống sếp không còn được "thăng chức" thành chủ công ty.
- Chủ tiệm, người làm tự do hợp sở trường: "khách hàng tin tưởng" thay vì "được cấp trên để ý".
- Con cái làm chủ công ty: "trở thành chủ công ty" thay vì "được lên chủ công ty".
- Chuyện mẹ chồng nàng dâu chỉ xảy ra khi có chồng (không xảy ra với cặp đôi nữ – nữ).
- Lính nghĩa vụ ở nước ngoài không còn "gấp chăn vuông như bánh chưng".
- Tiền "bao đậu" bằng lái hợp lý hơn.
- Bố mẹ đều đã mất thì không còn "bố mẹ mua cho chiếc xe máy" khi 18 tuổi.

## v3.4.0 — 15/10/2026

Giữ nguyên toàn bộ tính năng v3.3.0.

### Mới
- **Hẹn hò qua mạng** (Tinder, Bumble, Facebook Hẹn hò…): sau khi match có thể gặp:
  - **Người tử tế** (gần một nửa): hẹn cà phê, gọi video, rồi thành người yêu.
  - **Người "đào mỏ"**: hỏi lương, hỏi xe, đòi đi nhà hàng sang, xin điện thoại mới, rồi "mẹ nằm viện cần tiền gấp".
  - **Lừa đầu tư kiểu "sát heo"**: khoe lãi từ "sàn của anh họ", cho rút thử ít tiền, đến khi nạp nhiều thì đòi "thuế 20%" rồi biến mất.
  - **Ảnh ảo (catfish)**: không bao giờ chịu gọi video; gặp ngoài đời thì khác hẳn ảnh.
  - **"Việt kiều / kỹ sư nước ngoài gửi quà"**: bắt đóng "phí hải quan", "phí chống rửa tiền".
  - Có độ **tinh ý**: hiểu biết, từng trải, từng bị lừa thì dễ nhận ra dấu hiệu. Hẹn ở quán bình thường, gọi video, tra ảnh trên mạng là cách thoát; chiều theo thì dễ mất tiền.
- **14 hoạt động hẹn hò**: xem phim, tô tượng, thủy cung, nhà sách – cà phê sách, bảo tàng, workshop gốm / nến thơm, bowling, trượt patin, lẩu nướng, chợ đêm, picnic ngắm hoàng hôn, nấu ăn ở nhà, karaoke, công viên giải trí. Mỗi lần hiện ngẫu nhiên 5 hoạt động, có gợi ý chi phí.
- **Rủ người lạ chơi game cùng** (13–35 tuổi), với các tình huống trớ trêu: "bé Mèo 2k5" hóa ra là anh trai mét tám dùng phần mềm đổi giọng; đồng đội cực hay hóa ra học lớp 5; đứa toxic thành bạn thân; người leo rank cùng hóa ra học cùng trường.
- **Nghề cày thuê rank** cho Liên Quân Mobile, Liên Minh Huyền Thoại, Liên Minh: Tốc Chiến:
  - Liên Quân theo bảng giá thị trường: Đồng → Vàng 3.000 đ/sao; Bạch Kim → Tinh Anh 6.000–7.000 đ; Cao Thủ dưới 25 sao 10.000 đ; 25–50 sao 13.000 đ; trên 50 sao 15.000 đ; Chiến Thần 25.000 đ/sao.
  - Liên Minh Huyền Thoại (theo bậc) và Tốc Chiến (theo sao) dùng giá tham khảo ước lượng.
  - Thu nhập = giá theo mức rank kéo nổi × số sao leo được mỗi ngày × 26 ngày. Trình càng cao càng nhận đơn đắt.
  - Sự cố nghề: tài khoản khách bị khóa, khách quỵt tiền, khách lộ mật khẩu ngân hàng, đơn lớn của streamer. Luôn có lựa chọn làm ăn tử tế.
  - Học sinh giỏi game có thể nhận cày thuê kiếm thêm dịp nghỉ hè (có nhắc rủi ro vi phạm điều khoản của nhà phát hành).
- **35 chuyện tuổi thơ mới**, mỗi chuyện gặp tối đa 1 lần trong đời. Ví dụ: mất điện cả xóm, răng sữa ném lên mái nhà, sâu răng, tiêm phòng, tập xe đạp, học bơi, về quê hè, trò chơi dân gian, thuê truyện tranh, mưa đá, bài văn tả mẹ, ăn cỗ đám cưới, sao đỏ ghi tên, bầu lớp trưởng, Kế hoạch nhỏ, ngày 20/11, cắm trại, xem bóng đá đêm khuya cùng bố, nuôi tằm, đàn gà con, cuốn nhật ký có khóa…

### Chống lặp
- Những chuyện tuổi thơ quen thuộc nhất (sinh nhật, lì xì, thú cưng, lễ hội…) xuất hiện thưa hơn.
- Trung bình mỗi tuổi thơ có khoảng 26 chuyện khác nhau (trước đây khoảng 20).
- **Nhớ chuyện đời trước**: game ghi lại các chuyện đã gặp ở 3 đời gần nhất; đời mới sẽ ít gặp lại các chuyện đó.

### Sửa lỗi logic
- "Mua nhà" khi chưa đủ tiền không còn hiện danh sách lựa chọn trống. Thay vào đó hiện giá tham khảo từng loại nhà và nhắc tích lũy thêm.
- Nhật ký không còn ghi "thu về 0 triệu đ, vay thêm…" khi chỉ có khoản vay.
- Bố / mẹ mất trước khi kịp quyết định chuyện chăm sóc thì không còn "gửi tiền chu cấp cho mẹ".
- Người đã nghỉ hưu hoặc không đi làm không còn được "chị đồng nghiệp ở công ty" rủ chơi hụi.
- Ung thư phát hiện ở tuổi trên 85 hiếm khi thuyên giảm hoàn toàn (trước đây khỏi hơi dễ).

## v3.3.0 — 15/10/2026

Giữ nguyên toàn bộ tính năng v3.2.0.

### Lời lưu ý
- Màn hình "Chào đời", ngay cạnh dòng cảnh báo 15+: "Nhân vật và tình huống đều hư cấu, không ám chỉ cá nhân hay tổ chức nào."
- Chân trang:
  - Ghi "Lấy cảm hứng từ 1 in 8 Billion" (chỉ nhắc tên, bỏ liên kết).
  - Thêm khung **Lưu ý** nổi bật: game mang tính giải trí và tham khảo; nhân vật, sự kiện tạo ngẫu nhiên, không ám chỉ ai; hành vi tiêu cực đưa vào để cảnh báo hậu quả, không cổ xúy; số liệu làm tròn từ nguồn công khai.

### Mới
- **Nghĩa vụ quân sự 2 năm** (trước đây nhập ngũ xong vẫn làm được mọi việc như ở ngoài):
  - Trong 2 năm chỉ có chuyện quân ngũ: không đi chơi, không tìm việc, không có chuyện đời thường bên ngoài. Ăn ở trong doanh trại, có phụ cấp khoảng 1 triệu/tháng.
  - **3 tháng huấn luyện tân binh**: điều lệnh, gấp chăn màn, chạy, bắn đạn thật. Cố gắng thì được biểu dương.
  - **Về đơn vị**: chọn bộ binh, lái xe quân sự (được thi bằng lái), quân y, anh nuôi, thông tin liên lạc.
  - **Năm thứ hai**: diễn tập hành quân, cứu hộ lũ cùng bà con, về phép (người yêu có thể không đợi được), giúp đồng đội khó khăn, được giới thiệu kết nạp Đảng nếu rèn luyện tốt.
  - **Ra quân**: xuất ngũ với trợ cấp, thi trường sĩ quan, hoặc ở lại làm quân nhân chuyên nghiệp.
- **Hoạt động hợp tuổi**: người già không còn đi battle rap, cắm trại phượt, đu concert, giành mic karaoke. Vẫn đọc sách, đi chùa / nhà thờ, tập dưỡng sinh, du lịch.
- **Có nhiều tiền thì mở rộng kinh doanh**: khách sạn mini, khách sạn 4 sao, resort ven biển. Vốn lớn, lãi trên vốn thấp hơn quán xá, dễ điêu đứng khi du lịch đóng băng.
- **Đầu tư đa dạng**:
  - **Cổ phiếu từng công ty**: ngân hàng, công nghệ, sữa, thép, bán lẻ, năng lượng, quỹ chỉ số VN30 (nước ngoài: S&P 500, Apple, Microsoft, NVIDIA…), cả "cổ phiếu penny" dễ mất trắng.
    - Mỗi mã lên xuống theo thị trường và theo từng công ty; công ty lớn có cổ tức.
  - **Tiền mã hóa theo chu kỳ** tăng mạnh / đi ngang / giảm sâu / sập: Bitcoin, Ethereum, altcoin, memecoin.
    - Memecoin có thể tăng vọt nhưng phần lớn bị "rug pull" về 0; sàn giao dịch cũng có thể phá sản.
  - Danh mục đầu tư được tính vào tài sản ròng, có việc "Bán cổ phiếu / tiền mã hóa".
- **Sự kiện & cạm bẫy theo nhóm nghề** (theo tài liệu bạn gửi): gần 100 tình huống mới cho 21 nhóm nghề.
  - Gồm: lao động tự do, nông dân, ngư dân, lao động nước ngoài, công nhân & thợ, buôn bán, sale, văn phòng, cơ quan nhà nước, công an & quân đội, y tế, giáo dục, showbiz, báo chí, sáng tạo nội dung, làm đẹp, thể thao & esports, freelancer, dịch vụ & hàng không, phi pháp.
  - **"Cờ chờ nổ"**: lựa chọn sai (nhận phong bì, làm đẹp sổ sách, bán hàng giả, ký nghiệm thu ẩu…) có lợi trước mắt, nhưng vài năm sau mới bị thanh tra, kiểm tra phát hiện. Hậu quả vẫn tìm đến kể cả khi đã đổi nghề hay nghỉ hưu.
  - Nghề phi pháp có "độ nóng": càng ở lâu càng dễ bị bắt. Có ngã rẽ hoàn lương ("Mẹ chỉ mong con làm ăn lương thiện").
  - Người nổi tiếng dính "phốt" thì dễ bị scandal hơn.
  - **Giữ cân bằng với cơ quan nhà nước, công an, quân đội**:
    - Sự kiện nào cũng có lựa chọn liêm chính, tận tụy, và người làm đúng được ghi nhận, biểu dương.
    - Sai phạm luôn bị cơ quan chức năng phát hiện và xử lý.
    - Có thêm nhiều sự kiện tốt: cứu hộ lũ, ra đảo, công an tìm em bé đi lạc, cán bộ đề xuất cải cách thủ tục một cửa, nhân viên ngân hàng cứu sổ tiết kiệm của cụ già…

### Sửa lỗi
- Vừa mê một thần tượng thì không có ngay "đêm diễn chia tay sân khấu" trong cùng năm.
- Thành tựu trong hồ sơ không còn lẫn chuyện của người khác.

## v3.2.0 — 15/10/2026

Giữ nguyên toàn bộ tính năng v3.1.0.

### Giao diện (ưu tiên điện thoại)
- Đang có lựa chọn chờ (đã thu nhỏ) **vẫn làm được "Việc bạn muốn làm"**. Làm xong thì quay lại lựa chọn đang chờ, không còn báo "hãy chọn xong lựa chọn đang chờ trước đã".
- Điện thoại:
  - Thanh điều hướng cố định dưới cùng: Việc làm · Nhật ký · Hồ sơ · Tiền bạc · Gia đình, bấm là tới ngay.
  - Các nút phụ (tốc độ, nhạc, tự động, thoát) gom vào nút "⋯" cho thanh trên gọn lại.
  - Hộp lựa chọn trượt từ dưới lên như ứng dụng điện thoại; nút bấm to, dễ chạm hơn.

### Mới
- **Nhà ở chia theo loại**: nhà cấp 4, chung cư mini, chung cư cũ (khu tập thể), chung cư thương mại, nhà phố 3–4 tầng, chung cư cao cấp, biệt thự, dinh thự.
  - Giá theo nơi ở (Hà Nội / TP.HCM, thành phố tỉnh, nông thôn) và mỗi lần xem mỗi khác, không còn "nhà 4 tỷ" y hệt.
  - Ở quê nhà cấp 4 vài trăm triệu; Hà Nội chung cư mini ~1,3 tỷ, chung cư thương mại ~3,8 tỷ, nhà phố ~8 tỷ.
  - Đủ tiền thì trả thẳng, chưa đủ thì vay ngân hàng 70%. Đổi nhà thì bán nhà cũ, trả nợ cũ.
- **Bệnh viện công / tư**:
  - Nhà nghèo lên bệnh viện công: dậy từ 4–5 giờ sáng xếp hàng lấy số, chờ khám cả ngày, nằm ghép giường, đứng đợi lấy thuốc.
  - Nhà giàu vào bệnh viện tư / khoa quốc tế: phòng riêng, khám ngay.
  - Khám sức khỏe cũng chọn công hay tư.
- **Phẫu thuật**: bệnh nặng (ung thư…) hay tai nạn gãy xương phải mổ. Chọn mổ ở bệnh viện công theo bảo hiểm (chờ lịch, phòng đông), mổ dịch vụ, hay bệnh viện tư; có thể bị biến chứng.
- **Răng khôn mọc lệch**: nhổ ở bệnh viện công (xếp hàng) hay nha khoa tư. Để đó thì vài năm sau sưng đau hơn.
- **Nghề diễn viên**:
  - Đi casting: web drama, phim truyền hình, phim điện ảnh; có thể trượt vai.
  - Cát-xê vai chính: web drama từ 70 triệu, phim truyền hình vài trăm triệu, điện ảnh từ 400 triệu đến vài tỷ. Vai phụ ít hơn.
  - Phim điện ảnh có doanh thu phòng vé: phim trăm tỷ thì nổi tiếng hẳn, nhãn hàng tìm đến ký hợp đồng quảng cáo, được mời đóng phim khác; phim thất bại thì bị chê.
  - Học diễn xuất để nâng khả năng diễn (0–100). Người có năng khiếu diễn xuất có thể được mời casting rồi vào nghề.
  - Hợp đồng quảng cáo: nhận nhãn hàng uy tín hay quảng cáo "thần dược" (có thể bị phạt, bị tẩy chay).
- **Game show**: người nổi tiếng được mời tham gia Running Man Việt Nam hoặc 2 Ngày 1 Đêm, có cát-xê cả mùa. Trong game có "anh lớn" Tràng Dương hay bắt nạt người mới và anh cả biệt danh "Thánh Trần" hay nâng đỡ người mới (nhân vật trong game).
- **Tình yêu**:
  - Nhắn tin tán tỉnh: có thể bị "ghost" (đã xem rồi im bặt), mập mờ, hoặc thành đôi.
  - Yêu người chênh tuổi có biệt danh hội bạn trêu: "hồng hài nhi", "ngưu ma vương", "phi công trẻ lái máy bay", "trâu già gặm cỏ non".
  - Công khai xu hướng thì hội bạn thân gọi trìu mến là "bé liên" / "bột tôm".
- **Thi lại chứng chỉ**: IELTS, TOPIK, HSK hết hạn mà lúc đó chọn không thi lại thì game không hỏi nữa. Muốn thi lại thì tự vào "Việc bạn muốn làm → Học tập".

### Sửa lỗi
- **Tiền mã hóa**:
  - Trước đây chơi lâu thì trung bình vẫn lãi, nên nhiều người "spam" để làm giàu.
  - Giờ phần lớn người chơi thua lỗ, thỉnh thoảng mới gặp sóng lớn. Mỗi lần chỉ bỏ vào 30% tiền mặt.
- **Ít trùng lặp hơn**:
  - Mỗi tình huống ngẫu nhiên tối đa 3 lần trong đời, cách nhau ít nhất 4 năm.
  - Từ chối mua nhà nhiều lần thì càng lâu mới hỏi lại.
  - Đổi bằng lái (10 năm) và thi lại IELTS (2 năm) vẫn được hỏi theo hạn.
- Lỗi ở các bản trước: một số điều kiện bổ sung (không còn "cơn thèm mua sắm" khi đã rất giàu, về thăm bố mẹ…) không có tác dụng vì game chép điều kiện cũ lúc khởi động. Đã sửa để luôn dùng điều kiện mới nhất.
- **Tài sản không còn phình to vô lý**: giàu lên thì chi tiêu rộng tay hơn. Về già có của thì thỉnh thoảng cho con tiền mua nhà, làm vốn, lo cho cháu ăn học (rất phổ biến ở Việt Nam).
- Trốn khỏi trại lừa đảo về nước, đi làm lại thì không còn "vừa học đại học vừa đi làm".
- Bố đã mất thì không còn tình huống "bố đi làm đến tối, bố nấu cháo cho mẹ".
- Đã nghỉ học thì kết quả các lựa chọn cũng không còn kể chuyện trên lớp.

## v3.1.0 — 15/10/2026

Giữ nguyên toàn bộ tính năng v3.0.0.

### Mới
- **Nhật ký ghi luôn số tiền**: lựa chọn hay chuyện kể nào tốn tiền (hoặc được tiền) thì dòng nhật ký ghi kèm, ví dụ "Chuyến đi Đà Lạt cùng vợ (chi 5 triệu đ)". Không cần kéo xuống bảng tài chính mới biết bị trừ bao nhiêu.
- **Lựa chọn nào tốn tiền cũng hiện chi phí** ngay dưới lựa chọn, kể cả những lựa chọn trước đây chưa ghi giá (rủ anh chị em đi du lịch, đi nhậu…).
- **Về thăm bố mẹ tốn tiền theo khoảng cách**:
  - Ở gần: chạy xe sang, vài trăm nghìn. Học / làm ở tỉnh khác cùng miền: đi xe khách. Khác miền: vé máy bay. Đang ở nước ngoài: vé máy bay về nước.
  - Có thêm lựa chọn: về ở với bố mẹ cả tuần, gọi video hỏi thăm (không tốn tiền), gửi tiền về biếu.
  - Tết về quê khi đang sống xa nhà cũng phải mua vé (vé mùa Tết đắt hơn).
- **Lựa chọn thường ngày theo nơi đang sống**:
  - Dã ngoại, đi phượt, du lịch chọn địa điểm theo miền bạn đang sống. Ví dụ ở miền Nam thì núi Bà Đen, Cát Tiên, Langbiang; ở miền Bắc thì Cúc Phương, Ba Vì, Tam Đảo.
  - Đang du học hay làm việc ở nước ngoài thì đi chơi ở nước đó: núi Phú Sĩ, Kyoto (Nhật Bản); đảo Jeju, núi Seorak (Hàn Quốc); Blue Mountains (Úc)…
  - Đang ở nước ngoài thì không còn tảo mộ Thanh minh, cúng ông Công ông Táo hay giỗ ông cùng cả nhà. Thưởng cuối năm ở nước ngoài không gọi là "thưởng Tết".
- "Tiền riêng" có giải thích ngay trên bảng: đó là tiền lì xì, tiền tiêu vặt, tiền làm thêm bạn tự để dành khi còn sống cùng bố mẹ.

### Sửa lỗi logic (rà soát tự động hàng trăm đời)
- Bố hoặc mẹ đã mất thì lời kể không còn "bố mẹ khoe với cả xóm", "bố mẹ mua cho", "tiền nong để bố mẹ"… Trẻ mồ côi mẹ thì lời kể tuổi thơ nhắc bố (hoặc ông bà).
- Đã nghỉ học thì không còn chuyện "làm lớp trưởng", "cả lớp ký tên lên bó bột", "bạn cùng lớp"…
- Không có bạn đời thì con ốm nằm viện là "một mình bạn thức trắng trông con", không phải "vợ chồng thay nhau trực".
- Sửa lỗi ở bản 3.0: bộ lọc dòng nhật ký lặp bị sai (lọc nhầm theo chữ "d").

## v3.0.0 — 15/10/2026 (bản cập nhật lớn)

Giữ nguyên toàn bộ tính năng v2.9.0. Đời đang chơi dở vẫn chơi tiếp được.

### Giao diện
- **Nhật ký cuộc đời có nút "Thu gọn / Mở"** và tự cuộn trong khung riêng. Trên điện thoại không còn phải kéo hết đoạn nhật ký mới xem được hồ sơ nhân vật.
- **Nút "👤 Hồ sơ"** trên thanh điều khiển và nút "Xem hồ sơ chi tiết" ở thẻ căn cước. Hồ sơ gồm:
  - công việc, mức lương trước và sau bảo hiểm, số năm đóng BHXH, lương hưu;
  - thu nhập năm vừa qua theo từng nguồn;
  - tài sản;
  - năng khiếu và sở thích (có cấp độ, EXP);
  - học vấn, bằng cấp, chứng chỉ, bằng lái (kèm hạn dùng);
  - thành tựu trong đời.
- Mức căng thẳng hiện theo thang 0–100: thư thái, bình thường, căng thẳng, quá tải, báo động.

### Mới
- **HIV chỉ lây qua 3 đường**: quan hệ tình dục không an toàn, dùng chung kim tiêm, từ mẹ sang con. Không có đường lây thì không bao giờ mắc. Khi chẩn đoán có ghi rõ đường lây và việc điều trị ARV.
- **Lương theo trình độ**:
  - Thạc sĩ, tiến sĩ được trả cao hơn hẳn và vào làm ở bậc cao hơn. Có thể học tiếp tiến sĩ sau thạc sĩ (3–4 năm). Tiến sĩ được mời làm giảng viên, nghiên cứu viên.
  - Có IELTS, JLPT, TOPIK… còn hạn thì lương ở nghề văn phòng, dịch vụ, giáo dục cao hơn.
  - Lời mời việc làm ghi rõ có đúng sở trường không, có đóng BHXH không.
- **Bảo hiểm xã hội**:
  - Làm công ăn lương chính thức đóng BHXH 8%, BHYT 1,5%, BHTN 1%.
  - Mất việc thì nhận trợ cấp thất nghiệp. Có BHYT thì viện phí được chi trả phần lớn.
  - Lương hưu tính theo số năm đóng: đủ 15 năm mới có. Nam 20 năm, nữ 15 năm được 45%, mỗi năm thêm 2%, tối đa 75%.
- **Thu nhập rõ ràng**:
  - Lương không còn "quay số" mỗi năm. Mỗi người có mức năng lực riêng, cộng thâm niên. Thăng chức thì lương năm sau luôn cao hơn.
  - Thu nhập ghi rõ đến từ đâu: lương, lợi nhuận cửa hàng, tiền cho thuê nhà, lãi tiền gửi, thưởng, gia đình cho.
- **Kinh doanh lãi lỗ theo thực tế**:
  - Cửa hàng tiện lợi, quán cà phê, nhà hàng, spa / thẩm mỹ viện, phòng gym có vốn, doanh thu mỗi tháng, chi phí mặt bằng, nhân viên, nguyên liệu như ngoài đời. Ví dụ spa vốn ~1,8 tỷ, làm ăn bình thường lãi khoảng 60–70 triệu/tháng.
  - Năm vắng khách thì lãi ít hoặc lỗ.
- **Làm đúng sở trường**:
  - Năng suất cao, thu nhập cao hơn, vui hơn, bớt căng thẳng.
  - Làm việc không thích thì kém hiệu quả, dễ căng thẳng. Căng thẳng kéo dài làm giảm sức khỏe, các mối quan hệ, dễ dẫn tới trầm cảm.
- **Năng khiếu có cấp độ** (cấp 1 "Mới tập" đến cấp 10 "Huyền thoại", kèm EXP). Rèn giũa thì lên cấp.
- **Bằng lái và chứng chỉ có hạn**:
  - Bằng ô tô B hết hạn sau 10 năm, được hỏi có đổi không. Bằng xe máy A1 / A dùng vĩnh viễn.
  - IELTS, TOPIK, HSK hết hạn sau 2 năm, được hỏi có thi lại không. JLPT, Goethe không thời hạn.
- **Mua xe theo nhóm**:
  - 1. Xe máy: xe số, xe tay ga, xe máy điện, côn tay. 2. Ô tô: phổ thông, xe thể thao, xe sang, siêu xe.
  - Mẫu xe liệt kê từ rẻ đến đắt, có thêm nhiều mẫu (Toyota GR86, Ford Mustang, Porsche 718, Mercedes S 450, Range Rover, Ferrari 296, McLaren Artura…).
- **Thuê xe chạy dịch vụ** (làm tài xế công nghệ):
  - Có 3 lựa chọn: thuê VinFast VF 5 chạy Xanh SM, thuê ô tô xăng chạy Grab / Be, thuê xe máy điện.
  - Xe điện 2 năm phải bảo dưỡng, kiểm tra pin hoặc đổi pin. Xe xăng tự đổ xăng.
- **Xăng xe đổ hằng tuần**: tiền xăng / sạc mỗi tuần theo loại xe, cộng bảo hiểm, gửi xe, bảo dưỡng.
- **Hẹn hò qua ứng dụng**:
  - Có Tinder, Bumble, Hinge, Facebook Hẹn hò; Blued cho nam đồng tính / song tính; HER cho nữ đồng tính / song tính; nhóm kết bạn trung niên cho người lớn tuổi.
  - Có cả lừa tình qua mạng và những buổi hẹn "qua đêm" (dùng bao cao su hay không).
- Kết nạp Đội Thiếu niên Tiền phong (lớp 3), kết nạp Đoàn (cấp 3).

### Sửa lỗi logic
- **Tình huống lặp đi lặp lại**:
  - Mỗi tình huống chờ ít nhất 3 năm mới gặp lại, mỗi lần gặp rồi thì lần sau hiếm hơn, tối đa vài lần trong đời.
  - Hỏi chuyện cưới, sinh con: càng từ chối thì càng lâu mới hỏi lại.
  - Chuyện kể ngẫu nhiên không lặp năm nào cũng như năm nào. Dòng nhật ký y hệt không ghi lại trong vòng 8 năm.
- Lớp 1 không còn "quàng khăn đỏ" (khăn quàng đỏ từ lớp 3).
- 15 tuổi còn ở với bố mẹ thì là **tiền tiêu vặt**, không phải "tiền sinh hoạt". Đi học xa mới là tiền sinh hoạt.
- Đã yêu rồi chia tay thì không còn "mối tình đầu" lần nữa. Người yêu đầu tiên chính là mối tình đầu.
- Thăng chức mà lương giảm: đã sửa. Lương không còn nhảy thất thường giữa các năm (kiểu 52 triệu xuống 4 triệu). Giờ chỉ giảm mạnh khi mất việc, phá sản hoặc nghỉ hưu, và nhật ký ghi rõ lý do.
- 46 tuổi không còn chơi Free Fire: game theo lứa tuổi.
- "Cơn thèm mua sắm":
  - Món đồ hợp tuổi.
  - Đủ tiền thì không gợi ý quẹt thẻ, ví trả sau, vay app.
  - Tài khoản cả chục tỷ thì không còn phải đắn đo.
- "Tìm một nửa" ở tuổi 73 không còn "bạn bè lần lượt có đôi" hay "để ý một người ở trường học". Lời lẽ và lựa chọn hợp tuổi.
- Bố mẹ mất cùng năm không còn trùng đúng một căn bệnh. Nếu cùng mất trong một vụ tai nạn thì ghi rõ.
- Chọn ngẫu nhiên theo trọng số không còn vì sai số làm tròn mà chọn nhầm mục có trọng số 0 (nguyên nhân HIV "tự nhiên").

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
