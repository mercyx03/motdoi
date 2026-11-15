# Giai đoạn 3–5 bối cảnh lịch sử: biến cố có hậu quả nhiều giai đoạn (9.3.0, mở rộng 9.4.0)

Module: `public/js/hist920.js` (biến cố), `public/js/era920-pol.js` (bối cảnh chính trị theo năm). Kiểm thử: `tests/hist920.js`. Mở rộng `E.ERA920`; dùng hệ thống có sẵn (nghĩa vụ quân sự `flags.military`, mất việc `l.job`/`flags.needJob`, bệnh mạn tính `flags.chronic`, cha mẹ qua đời `fam.fAlive`, di cư `H.emigrate`, chuyển nơi ở `H.moveToCity`, cảnh `E.SC` + `E.UPDATE110.next`).

## Cơ chế
- Mỗi biến cố (EP) có: khoảng năm, phạm vi (nước đang sống, vùng/phía, tuổi, giới, nghề, tầng lớp gia đình, nơi ở thành thị/ven biển), xác suất bị ảnh hưởng theo hoàn cảnh, và hậu quả theo mức.
- **Việc dang dở** (`open`): chấn thương tâm lý, di dời, khó khăn kinh tế, bị gán thành phần. Mỗi năm kéo hạnh phúc/tiền/quan hệ xuống; có xác suất nhẹ đi hoặc khép lại phụ thuộc tiền, việc làm, bạn đời, quan hệ, sức khỏe; di dời tối đa 8 năm rồi thành nếp sống. Việc mới mở trong năm nào chỉ bắt đầu tính từ năm sau (không tự giải quyết ngay).
- **Lựa chọn quan trọng** (cảnh `hist920_choice`): nhập ngũ / hoãn / tránh; ở lại / đi (Genève 1954; Nam Tư); ở lại / kinh tế mới / vượt biên (sau 1975). Máy tự chọn theo tính cách (rủi ro, đạo đức, hoài bão) và hoàn cảnh (tiền, tầng lớp). Lựa chọn ghi vào `flags.hist920.did` và đổi các biến cố sau: phía của Việt Nam, đã nhập ngũ, đã tị nạn.
- Quyết định ngẫu nhiên băm theo mã đời + năm + nhãn: tải lại bản lưu không đổi kết quả (có kiểm thử).
- Chỉ áp cho đời có số liệu theo năm và năm thế giới đến 2023. Đời sinh từ 2024: không đổi byte nào (kiểm thử băm).
- Không gán tính cách tốt/xấu theo giàu nghèo, tôn giáo hay dân tộc. Tầng lớp gia đình chỉ ảnh hưởng ở cải cách ruộng đất (đúng cơ chế của chính sách đó); dân tộc chỉ ở làn sóng người Hoa 1978–1979; nghề cha mẹ chỉ ở học tập cải tạo 1975.

## Danh sách biến cố
| Mã | Tên | Năm | Có lựa chọn |
|---|---|---|---|
| `vn_indochina` | Chiến tranh Đông Dương lần thứ nhất | 1950–1953 | không |
| `vn_geneva` | Hiệp định Genève 1954: chia cắt và di cư | 1954–1955 | có (3 phương án tối đa) |
| `vn_land_reform` | Cải cách ruộng đất ở miền Bắc | 1953–1956 | không |
| `vn_war_south` | Chiến tranh ở miền Nam | 1960–1975 | có (3 phương án tối đa) |
| `vn_war_north` | Chiến tranh ở miền Bắc: không kích và sơ tán | 1965–1973 | có (3 phương án tối đa) |
| `vn_1975` | Sau 30/4/1975: chuyển giao, học tập cải tạo, kinh tế mới, vượt biên | 1975–1979 | có (3 phương án tối đa) |
| `vn_exodus_hoa` | Làn sóng rời đi 1978–1979 | 1978–1979 | không |
| `vn_subsidy` | Thời bao cấp và những lần đổi tiền | 1976–1988 | không |
| `vn_cambodia_war` | Chiến tranh biên giới và Campuchia | 1978–1989 | có (3 phương án tối đa) |
| `kh_khmer_rouge` | Chế độ Khmer Đỏ ở Campuchia | 1975–1979 | không |
| `w_oil_recession` | Cú sốc dầu mỏ và suy thoái 1974–1975, 1980–1982 | 1974–1982 | không |
| `w_transition` | Chuyển đổi kinh tế sau 1989–1991 | 1990–1999 | không |
| `w_yugoslav_wars` | Các cuộc chiến tranh ở Nam Tư cũ | 1991–2001 | có (3 phương án tối đa) |
| `w_asia_crisis` | Khủng hoảng tài chính châu Á 1997–1998 | 1997–1999 | không |
| `w_gfc` | Khủng hoảng tài chính toàn cầu 2008 và khủng hoảng nợ châu Âu | 2008–2016 | không |
| `w_tsunami_2004` | Sóng thần Ấn Độ Dương 26/12/2004 | 2004–2004 | không |
| `w_covid` | Đại dịch COVID-19 | 2020–2022 | không |

## Tham số trò chơi (không phải thống kê)
- **Người lính Việt Nam**: nguy cơ chết 2% mỗi năm (4% giai đoạn 1965–1972), nhân 1,5 cho miền Bắc/Việt Cộng; nguy cơ bị thương 5% (10%). Mốc đối chiếu (nguồn thứ cấp 15/11/2026): quân đội miền Nam khoảng 220.000–313.000 người chết, miền Bắc và Việt Cộng 444.000–1.100.000 tùy người ước tính (Lewy, Rummel, số liệu Việt Nam công bố 1995). Chưa xác nhận được tổng số người từng nhập ngũ, nên các tỷ lệ chỉ đúng bậc độ lớn, không phải tỷ lệ thật.
- **Vượt biên**: chết 20%, bị chặn 20%, đến nơi 60%. Mốc: gần 800.000 người đến nơi an toàn, ước tính 200.000–250.000 người chết trên biển (UNHCR theo Nghia Vo), tức khoảng 20–24% số người ra đi; tỷ lệ bị chặn không có nguồn. Nước định cư Hoa Kỳ 55 / Úc 15 / Canada 14 / Pháp 9 / Đức 4 / Anh 3: nguồn chỉ xác nhận Hoa Kỳ nhận hơn một nửa và nhóm dẫn đầu là Hoa Kỳ, Úc, Pháp, Canada; thứ tự và tỷ lệ còn lại là tham số.
- **Lạm phát phi mã** làm mất tiền để dành: nhóm Liên Xô cũ, Serbia, Bosnia mất 60% năm đầu và 30% các năm sau (Nga 1992 khoảng 2.500%; các nguồn báo cáo tiền gửi tiết kiệm gần như mất hết), nhóm khác 35% và 20%. Các nguồn chênh về lạm phát 1993 của Nga (240% đến 840%) nên không dùng số cụ thể.
- **COVID-19**: tỷ lệ nhiễm mỗi năm 8% / 20% / 35% (2020 / 2021 / 2022), cộng dồn khoảng 50%; nghiên cứu tổng hợp huyết thanh đăng PLOS Medicine 2022 thấy 47,9% ở châu Âu thu nhập cao và 33,7% ở châu Mỹ thu nhập cao sau Omicron 3/2022.
- **Khmer Đỏ**: nguy cơ chết thêm 5–10% mỗi năm theo tuổi, ×1,4 cho người từng ở thành phố, ×1,5 cho nghề giáo dục, y tế, công chức, quân nhân: cộng dồn bốn năm khoảng 20–30%, cùng bậc với ước tính 1,5–2 triệu trên khoảng 7–8 triệu dân; chưa so với nguồn từng nhóm.

## Mức kiểm chứng
- Ngày tháng và sự kiện là kiến thức công khai (bách khoa, Liên Hợp Quốc, tài liệu nghiên cứu về chiến tranh Đông Dương, Hiệp định Genève, cải cách ruộng đất và sửa sai 1956, 30/4/1975, chế độ Khmer Đỏ, chuyển đổi kinh tế Đông Âu, chiến tranh Nam Tư, khủng hoảng 1997 và 2008, sóng thần 26/12/2004, COVID-19). **Đã đối chiếu ngày 15/11/2026 với bách khoa trực tuyến và kết quả tìm kiếm web (mức `ver: secondary`)**, chưa đọc văn bản gốc hay nghiên cứu học thuật; kết quả và các chỗ nguồn còn khác nhau ở `docs/ERA-DOI-CHIEU-NGUON-940.md`.
- Các câu trong game giữ cách nói trung tính, không số liệu thương vong cụ thể ngoài vài mốc rất quen thuộc (ngày 17/4/1975, 26/12/2004, tháng/năm).

## Giới hạn / chưa làm
- Chưa có: chính sách từng nước theo năm (hưu trí, bảo hiểm y tế, giáo dục bắt buộc, quyền bầu cử); Rwanda 1994 và các cuộc diệt chủng khác (game không có danh tính nhóm nên chỉ ghi bối cảnh, không bịa danh tính ngẫu nhiên); đảo chính, độc tài, nội chiến ngoài danh sách trên chỉ có dòng bối cảnh, chưa có cơ chế.
- Việt Nam: vùng trong thời chiến chia theo tỉnh sinh ra (63 tỉnh hiện nay), không theo địa giới thời đó; Quảng Trị (giới tuyến) không bị gán phía; không mô hình thành viên gia đình đi tập kết hay mất tích.
- Nhật 2011 (động đất, sóng thần), Chernobyl 1986, Syria, Arab Spring, Ukraine 2022 chưa có cơ chế (chỉ có dòng bối cảnh cho Syria, Ukraine).

## Bổ sung 9.4.0
| Mã | Tên | Năm | Có lựa chọn |
|---|---|---|---|
| `w_civil_wars` | Nội chiến và chiến tranh nơi bạn sống (24 nước: Syria 2011–, Ukraina 2022–, Afghanistan 1979–1989, Liban, Sudan, Angola, Mozambique, Liberia, Sierra Leone, Sri Lanka, Colombia, Nepal, Peru, Guatemala, El Salvador, Somalia, Congo, Burundi, Algeria, Ethiopia, Nigeria 1967–1969, Iran–Iraq, Iraq 2003–2011, Lào) | 1960–2023 | có (ở lại / rời nước hoặc chuyển nơi yên hơn; nam 18–60 tuổi ở Ukraina từ 2022 không được rời nước) |
| `w_authoritarian` | Dưới chính quyền độc tài (Argentina, Chile, Brazil, Uruguay, Hy Lạp, Hàn Quốc, Philippines, Ethiopia, Tây Ban Nha, Bồ Đào Nha, Myanmar) | 1950–1990 | có (ở lại / lưu vong) |
| `w_chernobyl` | Thảm họa Chernobyl 26/4/1986 (Ukraina, Belarus, Nga; Gomel 50%, Kyiv và Zhytomyr 30%, nơi khác 3%) | 1986 | không |
| `w_tohoku_2011` | Động đất và sóng thần Tōhoku 11/3/2011 (Nhật, người ở ven biển) | 2011 | không |

- Nội chiến: xác suất bị tác động trực tiếp mỗi năm là tham số (4–30% tùy cuộc chiến); nam 18–45 tuổi có 20% bị thương nếu bị tác động; nơi tị nạn (Syria: Thổ Nhĩ Kỳ 45, Liban 15, Jordan 10, Đức 20, Thụy Điển 5, Hà Lan 5; Ukraina: Ba Lan 40, Đức 25, …) là tham số theo bậc độ lớn, không phải số liệu UNHCR.
- Độc tài: xác suất gia đình bị gây khó dễ 0,6–3% mỗi năm; **không gán quan điểm hay danh tính** cho nhân vật. Nơi lưu vong là tham số.
- Chernobyl: UNSCEAR ghi nhận khoảng 116.000 người sơ tán năm 1986 và ung thư tuyến giáp tăng ở trẻ bị phơi nhiễm; game dùng 1% trẻ bị bệnh tuyến giáp nếu bị tác động, 15% phải rời nhà. Tōhoku: khoảng 20.000 người chết hoặc mất tích; game dùng 2% người ven biển bị tác động, 12% trong số đó tử vong.
- Quảng Trị (bị sông Bến Hải chia đôi) nay được gán phía một lần theo mã đời: 20% phía Bắc (Vĩnh Linh), 80% phía Nam (tham số).
- `era920.js`: hôn nhân cùng giới chỉ hợp pháp từ năm có hiệu lực của từng nước (37 nước, Hà Lan 2001 … Thái Lan 2025) cho đời sinh trước 2024; tổng tỷ suất sinh của đời hiện nay ở nước ngoài Việt Nam dùng số liệu UN 2023 (Nigeria 4,48, Hàn Quốc 0,72) thay công thức theo tử vong trẻ em.

## Bổ sung 9.4.1
- `w_civil_wars` thêm Libya (2011; 2014–2020), Yemen (2014–), Nam Sudan (2013–), Cộng hòa Trung Phi (2012–), Mali (2012–), Myanmar (2021–), Ethiopia Tigray (2020–2022); mỗi nước có thể có nhiều giai đoạn. Đã đối chiếu Wikipedia (10 trên 11 khẳng định khớp tự động; Estonia 20/8/1991 lệch do tên bài); tìm kiếm web không xác nhận thêm được.
- Bối cảnh Baltic: 1950–1989 "bị sáp nhập năm 1940, nhiều nước không công nhận"; 1990 "tuyên bố khôi phục độc lập nhưng Liên Xô chưa công nhận"; 1991 "Liên Xô tan rã; độc lập được công nhận từ tháng 8–9/1991". Trước đây ghi chung "thuộc Liên Xô đến 1990".

## Bổ sung 9.4.3: Rwanda 1990–1997
- `hist920.js` có biến cố `rw_1994`: 1990–1993 chiến sự khiến một phần gia đình phải tạm lánh (12%); 1994 tử vong theo tỉ lệ trung bình toàn dân 9% (tham số, đối chiếu mức ước tính hàng trăm nghìn đến khoảng một triệu người trên khoảng 7 triệu dân), người sống sót chọn tìm chỗ ẩn náu trong nước hoặc vượt biên (CD 55, TZ 25, BI 12, UG 8; tham số) với tổn thương và mất nơi ở được ghi nhớ nhiều năm; 1995 trở đi có hậu quả sống dang dở.
- Trò chơi không mô phỏng nhóm bản sắc của nhân vật nên rủi ro không gán cho nhóm nào và không bịa danh tính ngẫu nhiên; chỉ dòng bối cảnh chính trị (`era920-pol.js`) nêu đúng lịch sử. Đối chiếu Wikipedia (tải 15/11/2026): khoảng 100 ngày, kết thúc giữa tháng 7/1994, gần hai triệu người rời nước, chiến tranh bắt đầu tháng 10/1990. Số tử vong theo từng nhóm không dùng trong mô phỏng.
- Chưa kiểm: số tử vong trên toàn dân (9%) là tham số mô hình, chưa đối chiếu nguồn gốc từng nghiên cứu nhân khẩu học.
