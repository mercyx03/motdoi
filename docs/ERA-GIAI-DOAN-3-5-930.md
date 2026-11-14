# Giai đoạn 3–5 bối cảnh lịch sử: biến cố có hậu quả nhiều giai đoạn (9.3.0)

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
- Nguy cơ chết/bị thương của người lính: 2–4% và 5–10% mỗi năm (đỉnh điểm 1965–1972 gấp đôi), nhân hệ số nhóm lính; nguy cơ vượt biên: chết 15%, bị chặn 25%, đến nơi 60% rồi phân bổ nước định cư Hoa Kỳ 60 / Úc 14 / Canada 14 / Pháp 5 / Đức 4 / Anh 3; lạm phát phi mã làm mất 20–35% tiền để dành; tỷ lệ nhiễm COVID-19 mỗi năm 8% / 20% / 45%; Khmer Đỏ: nguy cơ chết thêm 5–10% mỗi năm theo tuổi, ×1,4 cho người từng ở thành phố, ×1,5 cho nghề giáo dục, y tế, công chức, quân nhân.
- Các tham số này được chọn để biến cố có hậu quả đáng kể trong mô phỏng; chưa được hiệu chỉnh với số liệu thương vong hay kinh tế cụ thể của từng nước và chưa so với ước tính đã công bố. Không dùng để suy ra số liệu lịch sử.

## Mức kiểm chứng
- Ngày tháng và sự kiện là kiến thức công khai (bách khoa, Liên Hợp Quốc, tài liệu nghiên cứu về chiến tranh Đông Dương, Hiệp định Genève, cải cách ruộng đất và sửa sai 1956, 30/4/1975, chế độ Khmer Đỏ, chuyển đổi kinh tế Đông Âu, chiến tranh Nam Tư, khủng hoảng 1997 và 2008, sóng thần 26/12/2004, COVID-19). **Chưa đọc lại từng nguồn trong phiên làm việc này** (mức `ver: public`): cần đối chiếu trước khi dùng làm khẳng định lịch sử cho người chơi.
- Các câu trong game giữ cách nói trung tính, không số liệu thương vong cụ thể ngoài vài mốc rất quen thuộc (ngày 17/4/1975, 26/12/2004, tháng/năm).

## Giới hạn / chưa làm
- Chưa có: chính sách từng nước theo năm (hưu trí, bảo hiểm y tế, giáo dục bắt buộc, quyền bầu cử); Rwanda 1994 và các cuộc diệt chủng khác (game không có danh tính nhóm nên chỉ ghi bối cảnh, không bịa danh tính ngẫu nhiên); đảo chính, độc tài, nội chiến ngoài danh sách trên chỉ có dòng bối cảnh, chưa có cơ chế.
- Việt Nam: vùng trong thời chiến chia theo tỉnh sinh ra (63 tỉnh hiện nay), không theo địa giới thời đó; Quảng Trị (giới tuyến) không bị gán phía; không mô hình thành viên gia đình đi tập kết hay mất tích.
- Nhật 2011 (động đất, sóng thần), Chernobyl 1986, Syria, Arab Spring, Ukraine 2022 chưa có cơ chế (chỉ có dòng bối cảnh cho Syria, Ukraine).
