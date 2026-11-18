# Bối cảnh thời đại theo nước và năm sinh (9.5.0)

Mục tiêu: một đời sinh vào năm nào, ở nước nào thì mọi thứ phải đúng với hoàn cảnh năm đó: chiến tranh thì thiếu ăn, mất cha mẹ, nghỉ học; nạn đói thì trẻ nhỏ dễ chết; thời chưa có thì không có lễ thôi nôi bốc đồ, trường quốc tế, học thêm; nước đóng cửa thì khó đi nước ngoài. Không tạo hệ thống song song: mô-đun mới cắm vào `E.ERA920` (số liệu theo năm và bối cảnh chính trị), `E.HIST` (sang chấn, di dời, thiếu thốn), `E.TRIG`, `E.DEC`, `E.HOOKS.year` và `E.devGdp` có sẵn.

## Tệp

| Tệp | Vai trò |
|---|---|
| `public/js/data-ctx945.js` | Bảng dữ liệu: chiến tranh, nạn đói, dịch bệnh, khủng hoảng kinh tế, thiên tai, hạn chế xuất cảnh, thời thuộc địa, nhóm nước |
| `public/js/ctx945.js` | Logic: tra cứu bối cảnh `E.CTX945.of(l)`, tử vong cộng thêm, gia đình, phong tục, tần suất sự kiện, việc của thời loạn |
| `public/js/religion945.js` | Tôn giáo theo từng nước (sửa lỗi dữ liệu), kể cả giáo phái Kitô giáo |
| `public/js/era920.js` | Nền tử vong và thiếu thốn trước 1950 |
| `public/js/engine.js` | Nhân tần suất sự kiện, lương thực, tôn giáo khi tạo đời, trần kiến thức |
| `public/js/faith830.js`, `life124.js` | Giáo phái Kitô giáo theo nước thay vì mặc định phương Tây |
| `public/js/royal847.js` | Đường cong kiến thức bão hòa hơn |
| `tools/verify-ctx945.js` | Đối chiếu bảng dữ liệu với danh sách Wikipedia đã tải |
| `tests/ctx945.js` | 2.356 phép kiểm |

## Nguồn

Bảng chiến tranh, nạn đói, dịch bệnh, thiên tai, khủng hoảng được dựng từ các danh sách Wikipedia (danh sách nạn đói, chiến tranh theo thế kỷ, danh sách dịch bệnh, danh sách động đất và thiên tai lớn, khủng hoảng kinh tế, phong tỏa biên giới), tải ngày 15/11/2026. Mỗi dòng ghi một nhãn ngắn để hiện trong nhật ký đời. Dữ liệu đánh dấu `ver: 'secondary'` (nguồn thứ cấp, mức độ là ước lượng của game, không phải số liệu thống kê chính thức). Không dùng dữ liệu 1in8b.

Số dòng: chiến tranh 241, nạn đói 79, dịch bệnh 29, khủng hoảng kinh tế 58, thiên tai 35, hạn chế xuất cảnh 30, thời thuộc địa 51 (bổ sung cho bảng bối cảnh chính trị có sẵn).

Công cụ `node tools/verify-ctx945.js` (cần mạng) so với danh sách Wikipedia: nạn đói khớp 78/79, chiến tranh mức 3 khớp 92/96. Các dòng không khớp là do khác từ khóa (ví dụ Cuba 1991–95, vài dòng Bắc Macedonia, Romania, Singapore, Kuwait), không phải thiếu dữ liệu.

## Cơ chế

### 1. Tra cứu bối cảnh một năm (`of(l)`)
Trả về mức chiến sự (`war` 1–3), nạn đói (`fam`), dịch (`epi`), kinh tế (`econ`), thiên tai (`dis`), hạn chế xuất cảnh (`restrict`), thuộc địa, và `hard` (mức tổng hợp: chiến tranh, nạn đói, dịch từ mức 2, thiên tai hoặc khủng hoảng nặng; kinh tế nhẹ như bao cấp không tính). Có thêm `pov` (mức nghèo nền) tính theo GDP bình quân tuyệt đối của nước năm đó nhân với số liệu tương đối của `ERA920`, và `lux` (mức hưởng thụ có thể có).

### 2. Tử vong cộng thêm
Mỗi năm cộng hazard theo tuổi và giới: nạn đói nặng nhất với trẻ sơ sinh và người già, chiến tranh nặng với nam tuổi chiến đấu, dịch theo mức độ, thiên tai theo năm. Trước 1950 dùng đủ mức vì nền tử vong lúc đó chưa gồm các biến cố; từ 1950 chỉ 20% vì chuỗi số liệu của Liên Hợp Quốc đã gồm phần lớn phần tử vong do khủng hoảng. Nền trước 1950 trong `era920.js` thấp hơn tuổi thọ kỳ vọng và cao hơn tỷ lệ chết dưới 5 tuổi (`preE`, `preU`).

### 3. Gia đình
Cha mẹ có thể mất vì chiến tranh, nạn đói, dịch; thu nhập hộ và lương thực theo hệ số bối cảnh; nhà trường gián đoạn khi chiến sự hoặc nạn đói nặng.

### 4. Phong tục chỉ có khi hoàn cảnh cho phép
Thôi nôi bốc đồ, sinh nhật, mẫu giáo, đồ chơi mua sẵn, học chữ sớm, lò luyện thi, tiệc cưới linh đình có điều kiện: năm sớm nhất, mức biến cố tối đa, mức nghèo tối đa và mức khá giả của nhà (`l.fam.q`). Ví dụ lễ thôi nôi không có giữa nạn đói hoặc chiến tranh và khó có ở nhà nghèo trước 1960; trường quốc tế và học thêm chỉ có từ khoảng 1990 và không có ở vùng chiến sự hay nạn đói.

### 5. Xuất cảnh
Xuất khẩu lao động, du học, di cư, xin visa và hộ chiếu bị chặn khi nước đóng cửa (mức 3: Bức màn sắt 1950–87, Trung Quốc 1950–78, Triều Tiên, Cuba 1960–2012, Việt Nam 1975–86, Myanmar 1962–2011…); mức 2 chỉ nhà khá giả có quan hệ mới đi được.

### 6. Tần suất sự kiện
Hệ số nhân vào xác suất: sự kiện xa xỉ (hòa nhạc, mua sắm, game, du lịch…) giảm theo mức khó khăn, sự kiện nguy hiểm (cướp, bom, bão lũ, bắt bớ, nợ nần…) tăng, sự kiện chiến tranh tăng khi có chiến sự. Ở nước và năm không có biến cố (ví dụ đời sinh 2026 ở Việt Nam, Nhật Bản, Hàn Quốc) kết quả giống hệt khi không có mô-đun, kiểm chứng bằng băm.

### 7. Việc của thời loạn, đói, dịch
Tìm chỗ trú, xếp hàng khẩu phần, nhịn đói, con ốm, nghỉ học, bị gọi nhập ngũ, mất việc, dịch bệnh, dựng lại cuộc sống, bị ép làm chỉ điểm. Việc chưa giải quyết tiếp diễn sang năm sau và để lại sang chấn, di dời, thiếu thốn qua `E.HIST`.

### 8. Tôn giáo
`religion945.js` thay phân bố tôn giáo mặc định bằng bảng theo nước (châu Phi, các nước Ả Rập, Balkan, châu Mỹ Latinh, châu Đại Dương, các nước giàu) và trọng số giáo phái. Sửa lỗi "Chính thống giáo Đông phương" xuất hiện ở Rwanda và các nước tương tự; chế độ Việt Nam không đổi.

### 9. Kiến thức và điểm thi
Trần kiến thức bão hòa mềm (`KNOW_KNEE853=90`, độ dốc 0,5) cộng suy giảm hằng năm khi vượt 58, để điểm thi trung bình gần 21–23 thay vì 23 trở lên; hạng thi vẫn phân hóa.

## Giới hạn đã biết

- Mức độ biến cố là ước lượng; một số cuộc xung đột nhỏ hoặc cục bộ không có.
- Bối cảnh được áp theo nước và năm, chưa theo vùng trong nước (vùng chiến sự và vùng yên ổn của cùng một nước dùng chung mức).
- Thời thuộc địa chủ yếu hiện qua ghi chú và hạn chế; chưa có chuỗi sự kiện riêng cho từng thuộc địa.
- Bản lưu cũ: đời đang chơi tiếp tục bình thường, các trường mới được tính khi cần; không đổi định dạng lưu.
- Đời sinh 1950 trở đi ở nước và năm không có biến cố gần như không đổi; kết quả thống kê dao động giữa các lần chạy vì dùng `Date` thật.

---

# Bản 9.5.1 — vùng trong nước, chính sách xã hội lớn, thuộc địa, đại học cho học sinh nổi bật và người sống ở nước khác

## Bối cảnh theo vùng (`data-ctx951.js`, `ZONE`)
61 dòng cho thành phố hoặc tỉnh chịu mức khác mức chung của nước. Nhân vật tra theo thành phố đang sống (`l.city`). Ví dụ: Hà Nội 1965–68 và cuối 1972 bị ném bom nặng, 1969–71 ngừng ném bom; Sài Gòn 1965–67 và 1969–74 tương đối yên; Nam Kỳ không bị nạn đói 1945; Biafra 1967–70 đói và chiến sự nặng trong khi Lagos ngoài vùng; Amsterdam 1944–45 đói còn Eindhoven đã giải phóng; Hiroshima 1945; Leningrad bị vây (nước Nga nói chung chỉ ở mức thiếu lương thực thời chiến); Thành Đô trong Đại nhảy vọt so với Thượng Hải được ưu tiên khẩu phần; Kharkiv so với Lviv năm 2023; Aleppo so với Damascus. Thành phố không có trong bảng dùng mức quốc gia. Mức chỉnh là cộng/trừ hoặc đặt mức (`'=3'`).

## Chính sách xã hội lớn (`SOC`)
57 dòng, ba loại: ruộng đất (`land`: cải cách ruộng đất, tập thể hóa, quốc hữu hóa), chiến dịch chính trị (`purge`: thanh trừng, đấu tố, kiểm điểm, giám sát), di dời (`expel`: chia cắt Ấn Độ – Pakistan, hoán đổi dân cư Hy Lạp – Thổ Nhĩ Kỳ, di dân sau Thế chiến II, vượt biên bằng thuyền, tị nạn Syria, Ukraina…). Mỗi dòng có mức (1–3) và tỷ lệ dân cư vùng chịu ảnh hưởng trực tiếp; một đời chỉ gặp sự kiện nếu "trúng" tỷ lệ đó (tính cố định theo mã đời nên không dao động giữa các lần mở). Không gán số phận theo sắc tộc hay tôn giáo; chiến dịch chính trị tăng xác suất theo mức nổi bật của hồ sơ (học vấn cao, gia đình có của, danh tiếng) như một biến tình huống.

## Sự kiện mới (đều đi qua `ctx945_event`, có nhiều lựa chọn và hậu quả phụ thuộc hoàn cảnh)
| Sự kiện | Điều kiện | Hậu quả chính |
|---|---|---|
| `land` | chính sách ruộng đất đang hiệu lực, nhân vật "trúng" tỷ lệ | nhà ít của được chia thêm, nhà vừa phải nộp một phần, nhà nhiều của mất nhiều; giấu của có thể bị phạt hoặc tù; tham gia ban thi hành; bỏ đi |
| `purge` | chiến dịch chính trị | kiểm điểm, tố giác (mất bạn bè, lương tâm nặng, ghi nhớ trong đời), từ chối (rủi ro bị bắt), rời đi (bị chặn nếu nước đóng cửa) |
| `expel` | di dời, chia cắt | đi theo đoàn người (mất nhà, nguy hiểm), sang nước khác xin cư trú (tạo hồ sơ tị nạn), ở lại ẩn náu (rủi ro rất cao) |
| `col_tax` | thuộc địa | nộp thuế, làm phu thay thuế, né thuế, rời làng |
| `col_exam` | thuộc địa, 10–15 tuổi | thi vào trường thuộc địa (xác suất theo học lực và hoàn cảnh nhà), học thầy đồ, ở nhà phụ việc |
| `col_levy` | thuộc địa, nam, thế chiến hoặc chiến sự | nhập ngũ (đi nhiều năm, dùng cơ chế nghĩa vụ có sẵn), trốn, đút lót |
| `col_movement` | thuộc địa có chiến sự | tham gia, giúp đỡ kín đáo, giữ im lặng, báo tin; khi hết thuộc địa nhật ký nhắc lại lựa chọn đó |
| `hyp_savings` | siêu lạm phát, có tiền tiết kiệm | đổi vàng, mua ngoại tệ, giữ tiền mặt (mất phần lớn), tiêu và trữ hàng |

## Thư mời nhập học và học bổng (`uni945.js`)
Ngã rẽ sau phổ thông (`E.DEC.uni`) có thêm lựa chọn "Xem thư mời nhập học và học bổng" khi nhân vật có thành tích: huy chương quốc tế, giải quốc gia (tuyển thẳng), điểm thi xuất sắc. Điểm thành tích quyết định mức hỗ trợ (toàn phần, 50% hoặc 25% học phí). Gồm tối đa ba thư của trường trong nước (cao nhất, giữa, thấp nhất trong những trường đủ điều kiện, chỉ ngành hợp khối thi; trường năng khiếu giữ quy trình thi riêng) và tối đa hai thư du học (cần đủ ngôn ngữ giảng dạy, nước cho phép xuất cảnh theo bối cảnh, từ 1950). Chọn trường rồi chọn ngành, nhập học qua đúng hệ thống nguyện vọng có sẵn (móc `acceptedOffer872`). Học bổng được giữ nếu học lực khá; tụt dưới mức thì mất; học bổng toàn phần có trợ cấp sinh hoạt hằng năm. Thư du học đi tiếp vào chuỗi du học có sẵn (`abroad107_school`), xét học bổng trả đúng mức trong thư trong một năm. Có thể từ chối để tự đăng ký như thường.

## Học đại học muộn ở nước đang sống (`uni945.js`, menu `lateUni945`)
Dành cho người đang sống ở nước khác (tị nạn, thường trú, nhập quốc tịch) mới học tới phổ thông. Quyền đăng ký: công dân (học phí như người bản xứ); thường trú; người tị nạn được công nhận sau 2 năm (học phí cao hơn khoảng 1,5 lần); người mới đến hoặc chỉ cư trú tạm thì chưa, kèm lý do. Các bước: học bổ túc nếu chưa có bằng phổ thông; học năm dự bị (ngôn ngữ giảng dạy, bổ sung kiến thức) nếu chưa đủ ngôn ngữ; nộp hồ sơ (điểm đầu vào bị trừ nếu ngôn ngữ yếu, người tị nạn có thể bị trừ do bằng cấp cũ chưa được công nhận) rồi mở danh sách nguyện vọng của chính nước sở tại. Người chơi được hỏi lại mỗi vài năm (móc cuối năm, không thêm sự kiện ngẫu nhiên nên đời bình thường không đổi); chế độ tự động tự học dự bị rồi nộp hồ sơ.

## Nợ sâu (`engine.js`)
Khi tiền âm sâu (dưới −1 lần thu nhập cơ sở): ăn ở thanh đạm hơn (bớt tiền ăn, ở ghép/ở nhờ giảm tiền nhà, bớt đi lại). Không trả nổi ba năm liền ở mức sàn thì nợ được cơ cấu lại (thỏa thuận với chủ nợ). Tỷ lệ tài sản ròng âm nặng cuối đời ở Việt Nam đo được từ 10–13% xuống khoảng 6%.

## Kiểm chứng
`tests/ctx951.js` (1.087 kiểm tra), `tests/uni945.js` (232), `tests/ctx945.js` (2.356). `node tools/verify-ctx945.js <thư mục nguồn>`: nạn đói 79/79, chiến tranh mức 3 là 96/96 (Thời kỳ đặc biệt của Cuba và vài từ khóa đã bổ sung). Sửa các test cũ: nhật ký cập nhật (so sánh chuẩn hóa giờ và tiêu đề đã rút gọn, `tests/lib/update-compat.js`), `update460`, mục 21 và mục 9 của hồi quy (xem `KNOWN_UNCOVERED945`).

## Giới hạn còn lại
- 26 tình huống nối tiếp hoặc theo vai trò (hoàng gia, bóng đá, một số chuỗi tòa án) chưa có bối cảnh kiểm thử riêng; danh sách `KNOWN_UNCOVERED945` trong `tests/regression.js` chỉ được bớt đi.
- Vùng chỉ có ở những nơi nêu trong bảng; thành phố khác dùng mức quốc gia. Việt Nam dùng tên tỉnh, các nước khác dùng danh sách thành phố của dữ liệu thế giới.
- Chưa mô hình bản sắc nhóm (ví dụ nhóm bị nhắm tới trong một chiến dịch cụ thể): chỉ có tỷ lệ dân cư vùng chịu ảnh hưởng.
- Hai test trình duyệt cũ (`browser-foundation-updates`, `update827-browser`) cần trình duyệt điều khiển được nên không chạy ở môi trường này.

---

# Bản 9.5.2 — vùng cho mọi cuộc chiến, nạn đói, thiên tai lớn; sơ tán thật sự

## Độ phủ
Mọi sự kiện mức 2–3 của chiến tranh, nạn đói và thiên tai trong bảng quốc gia (378 sự kiện sau khi mở rộng nhóm nước) hoặc có dòng vùng riêng trong `data-ctx952.js` (327), hoặc nằm trong `ZONE_NATIONAL` kèm lý do vì sao cả nước chịu như nhau (51: ví dụ chiếm đóng và nội chiến Nam Tư 1941–45, nội chiến Liberia, chiếm đóng Singapore, các nước Baltic và Ukraine thời Thế chiến II, nạn đói Moldova 1946–47). `tests/ctx952.js` kiểm tra điều này nên sau này thêm sự kiện mới mà quên vùng sẽ bị báo lỗi.

## Nguyên tắc dựng vùng
- Chỉ dùng các thành phố có trong danh sách của từng nước (Việt Nam dùng tỉnh lỵ). Thành phố khác dùng mức quốc gia.
- Dòng sau ghi đè dòng trước cùng năm: đặt mức nền cho cả nước (regex `.` với `'=0'`) rồi nâng nơi bị trực tiếp.
- Theo địa lý, không theo nhóm người: không gán số phận theo sắc tộc, tôn giáo hay giàu nghèo.
- Sửa cửa sổ quốc gia quá dài bằng dòng thời gian: Việt Nam 1955–1959 hòa bình mong manh, 1960–1964 miền Bắc dựng nước còn miền Nam bất ổn; Kavkaz và Trung Á 1941–45 là hậu phương; các nước Baltic 1921–22 đã hết chiến tranh giành độc lập.

## Biến cố thêm mới
Nội chiến Sudan lần thứ nhất (miền nam, nay là Nam Sudan); biên giới Tây Nam 1977–1978 và phía Bắc 1979–1988 của Việt Nam; Israel–Hezbollah 2024; Israel–Iran 2025; xung đột Amhara 2023–2025; bạo lực băng đảng Ecuador; Taliban và ISKP; thiên tai Managua 1972, Guatemala 1976, Chile 2010, Ecuador 2016, Mexico 2017, Beirut 2020, Haiti 2021, lũ Pakistan 2022, Herat 2023, lũ Maiduguri 2024, lũ Valencia 2024, động đất Myanmar 2025; di dời do nội chiến Sudan 2023 và Liban 2024.

## Sơ tán thật sự (`ctx945.js`)
Lựa chọn "Sơ tán về vùng yên hơn" (chiến sự) và "Rời quê đi tìm nơi có ăn" (nạn đói) trước đây chỉ trừ chỉ số. Nay `refuge(l)` chọn trong ba nơi yên nhất của nước đó (ưu tiên cùng vùng ở Việt Nam; yên hơn ít nhất hai bậc theo 3·chiến sự + 2·đói + thiên tai), cố định theo mã đời. Nhân vật chuyển tới đó và bỏ việc cũ. Quê cũ đã yên (độ khó từ 3 trở xuống, tương đương chiến sự mức 1) sau ít nhất một năm thì mỗi năm có khả năng về; sau bảy năm thì ổn định ở nơi mới. Người đã ở nước ngoài không dùng bảng vùng của quê.

## Màn chọn năm sinh
`app.js` hiện bối cảnh của nước và năm sinh đã chọn, kèm số dòng vùng của năm đó.

## Giới hạn
- Vùng chỉ có ở các thành phố trong danh sách; người ở nông thôn dùng thành phố gần nhất.
- Mức vùng là ước lượng từ mô tả trên Wikipedia, không phải số liệu thống kê.
- Dòng hiển thị trên màn chọn năm sinh chưa kiểm trong trình duyệt ở bản này.
