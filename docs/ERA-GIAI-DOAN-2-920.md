# Giai đoạn 2 bối cảnh lịch sử: số liệu quốc gia theo năm 1950–2023 (9.2.0)

Module: `public/js/data-era920.js` (dữ liệu, sinh tự động), `public/js/era920.js` (nối vào engine), `public/js/era920-pol.js` (tên nước, tình trạng chính trị, tên thành phố). Công cụ sinh dữ liệu: `tools/build-era-data920.js`. Kiểm thử: `tests/era920.js`.

## Phạm vi
- Đời sinh từ **1950 đến 2023** có số liệu **theo năm của đúng nước** (195 nước trong game): tuổi thọ lúc sinh, tổng tỷ suất sinh, tử vong dưới 5 tuổi, tỷ lệ dân đô thị, GDP bình quân tương đối, thuê bao di động, đường dây điện thoại cố định, tỷ lệ dân dùng internet. Đời sinh 2024 trở đi giữ đường tắt: không đổi một byte so với trước (có kiểm thử băm).
- Đời sinh **1900–1949** vẫn chọn được nhưng ở nhóm "thử nghiệm": chưa có số liệu dân số theo từng nước và từng năm trước 1950 (UN WPP bắt đầu từ 1950; chỉ khoảng 30 nước có chuỗi tuổi thọ trước đó), nên game dùng mức 1950 và chỉ chặn công nghệ sai thời (giai đoạn 1). Không bịa số liệu cho khoảng này.

## Nguồn dữ liệu (tải 2026-11-15T00:30:00+07:00, không dùng dữ liệu của 1in8b)
| Mã | Nội dung | Nguồn | Tệp | SHA-256 |
|---|---|---|---|---|
| `le` | UN WPP 2024 (qua Our World in Data), tuổi thọ lúc sinh | https://ourworldindata.org/grapher/life-expectancy | `owid-life-expectancy.csv` | `6336e80067d72cd910e5b03a4150bbb203fb8f22c6a9c0c43e91aba07038720b` |
| `tfr` | UN WPP 2024 (qua Our World in Data), tổng tỷ suất sinh | https://ourworldindata.org/grapher/children-per-woman-un | `owid-children-per-woman-un.csv` | `9043a1bf4f21969b81953bdffee871fc87ae7f25bbed245bdb18699b6f59402e` |
| `u5` | UN IGME và Gapminder (qua Our World in Data), tử vong dưới 5 tuổi (%) | https://ourworldindata.org/grapher/child-mortality | `owid-child-mortality.csv` | `ac87ef5c0c4ba409b95e8c85833ab51093476b2475e315cba5dd079154e175ff` |
| `urb` | UN World Urbanization Prospects (qua Our World in Data), % dân số đô thị | https://ourworldindata.org/grapher/share-of-population-urban | `owid-share-of-population-urban.csv` | `d5cb1a4c58b6c7a1953ba5c5361966114add7c4cc722f085952110f7d7ffaa94` |
| `gdp` | Maddison Project Database 2023 (qua Our World in Data), GDP bình quân đầu người | https://ourworldindata.org/grapher/gdp-per-capita-maddison-project-database | `owid-gdp-per-capita-maddison-project-database.csv` | `0545ad6ca37529206af49f9f964f17af927e8c154c1fe8d3813c523e0d2f43f8` |
| `mob` | ITU/World Bank WDI IT.CEL.SETS.P2 (qua Our World in Data), thuê bao di động trên 100 dân | https://ourworldindata.org/grapher/mobile-cellular-subscriptions-per-100-people | `owid-mobile-cellular-subscriptions-per-100-people.csv` | `54fcd151b592ce937a3903fd3e9f19f92b9a7f13af20911e6a3b79159bc927a8` |
| `fix` | ITU/World Bank WDI IT.MLT.MAIN.P2 (qua Our World in Data), đường dây điện thoại cố định trên 100 dân | https://ourworldindata.org/grapher/fixed-telephone-subscriptions-per-100-people | `owid-fixed-telephone-subscriptions-per-100-people.csv` | `730bc92334d0cc59a2fcb5826f3d888076142a35202889939162e476f1d9a242` |
| `net` | ITU/World Bank WDI IT.NET.USER.ZS (qua Our World in Data), % dân số dùng internet | https://ourworldindata.org/grapher/share-of-individuals-using-the-internet | `owid-internet.csv` | `fa47251d5a7378dfd9349a196bbb6a202158caf103c300cdcdf09b1da1c6d4f7` |
- Tệp nguồn CSV không đưa vào kho mã (khoảng 5 MB); công cụ ghi lại URL và SHA-256 để kiểm tra lại. Giấy phép: Our World in Data CC BY 4.0; UN WPP CC BY 3.0 IGO; Maddison Project Database CC BY 4.0; ITU/World Bank WDI CC BY 4.0. Tệp dữ liệu sinh ra: 316 KB.
- Mã quốc gia ISO3 của nguồn được đổi sang ISO2 bằng bảng thực thể quốc gia của Gapminder (`ddf--entities--geo--country.csv`, CC BY 4.0), chỉ dùng cho việc ánh xạ mã.

## Phần ước tính (đã đánh dấu trong dữ liệu, không phải số liệu quan sát)
- **Tử vong dưới 5 tuổi**: nguồn chỉ có từ năm đầu tiên quan sát được (`uf`), 109 nước thiếu một số năm đầu (ví dụ Việt Nam từ 1959). Các năm trước đó được ước từ tuổi thọ UN của chính năm đó bằng hồi quy ln(u5) theo tuổi thọ (bậc hai, hệ số trong `D.fit.u5ln`), cộng độ lệch riêng của nước (trung vị 9 năm đầu có số liệu) giảm dần theo bán rã 15 năm khi lùi xa. Màn thiết lập ghi "ước tính" khi gặp năm này.
- **GDP bình quân tương đối** (so với 2022): Maddison có ở 162 nước, trong đó 23 nước chỉ từ sau 1950 (các nước thuộc Liên Xô từ 1973…); 33 nước hoàn toàn không có (đảo nhỏ, Sudan, Somalia…) được ước từ chênh lệch tuổi thọ so với hiện nay (hồi quy bậc hai `D.fit.gdpLn`). GDP chỉ dùng làm **ngưỡng phát triển** (xem dưới), không đổi tiền lương hay giá.
- Đường dây cố định trước năm đầu tiên có số liệu (1960–1980) giữ giá trị đầu tiên; thuê bao di động trước 1980 và internet trước 1990 là 0.

## Nối vào các hệ thống có sẵn
| Chỗ nối | Thay đổi | Đời sinh từ 2024 |
|---|---|---|
| `engine.js` createLife → `E.ERA920.birth` | Tuổi thọ lúc sinh = tuổi thọ hiện hành của nước + (UN năm sinh − UN 2023); u5 nhân tỷ lệ UN năm sinh / 2023; tổng tỷ suất sinh theo năm (Việt Nam giữ chênh lệch dân tộc, trần 8,5). | không đổi |
| `engine.js` beginYear/finishYear → `E.ERA920.refresh` | Nạp lại `life.mort/mortM/mortF` mỗi năm theo tuổi thọ và u5 CỦA NĂM ĐÓ (trước đây cả đời dùng số liệu hiện nay). | không đổi |
| `engine.js` qx → `E.ERA920.cal` | Hệ số bù: engine cộng thêm tử vong từ bệnh nặng, tai nạn, tiêm chủng, sự kiện (CAL hiệu chỉnh ở tuổi thọ hiện nay); ở mức tử vong cao phần này làm kết quả vượt số liệu. Giảm tuyến tính tới −22% (trẻ dưới 5 tuổi, theo u5) và −20% (người lớn, theo tuổi thọ), bằng 1 ở mức hiện nay. | không đổi |
| `engine.js` setupWorld/setupVN | Xác suất sinh ở đô thị nhân tỷ lệ đô thị hóa năm sinh / hiện nay (không rút thêm số ngẫu nhiên). | không đổi |
| `engine.js` số con mong muốn → `E.ERA920.tfrNow` | Dùng tổng tỷ suất sinh của năm quyết định, không phải năm sinh. | không đổi |
| `engine.js` `dev(l)` → `E.devGdp` | Mức phát triển của năm đang sống thay `life.gdp` ở các ngưỡng: lao động trẻ em, tảo hôn, lao phổi, tiêm chủng, học tập, nghề của mẹ, muốn di cư, hạnh phúc nền. KHÔNG đụng tiền lương, giá cả, tỷ giá, chi phí y tế (xem giới hạn). | bằng `life.gdp` |
| `access890.js` | Mức tiếp cận internet dùng số liệu của năm đang sống (trước đây dùng số liệu 2015–2025 cho cả đời). | không đổi |
| `era902.js` | Mục công nghệ chỉ coi là có khi nước đang sống đủ mức phổ cập (di động ≥ 1/100 dân, internet ≥ 1–10% tùy mục; ngưỡng là tham số trò chơi). "Nhắn tin" đổi thành gọi điện hoặc viết thư theo mức di động, internet và điện thoại cố định của nước đó. | không đổi |
| `engine.js` createLife | Đời Việt Nam sinh trước 2025 dùng 63 tỉnh (hợp nhất 34 tỉnh có hiệu lực từ 2025). | không đổi (sinh 2025 vẫn 34) |

## Tên nước, tình trạng chính trị, tên thành phố (`era920-pol.js`)
- 148 nước có ít nhất một giai đoạn bối cảnh (thuộc địa đến năm độc lập, Liên Xô, Tiệp Khắc, Nam Tư, Đức chia đôi, Việt Nam chia hai miền, apartheid, chiến tranh và độc tài lớn…); 18 tên nước theo năm (Miến Điện, Zaire, Ceylon…); 19 tên thành phố đổi theo năm (Sài Gòn trước 2/7/1976, Bombay, Leningrad…).
- Hiện ở màn thiết lập, dòng nhật ký đầu đời và mỗi khi tình trạng đổi trong đời; tên thành phố cũ thay vào nhật ký, văn bản cảnh và vị trí.
- **Đã đối chiếu ngày 15/11/2026 với bách khoa trực tuyến (nguồn thứ cấp, chưa đọc văn bản gốc)**: 83 năm độc lập và 118 khẳng định chế độ/tên gọi, xem `docs/ERA-DOI-CHIEU-NGUON-940.md`; đây là các mốc công khai (Liên Hợp Quốc, bách khoa); cần đối chiếu trước khi dùng làm khẳng định lịch sử.

## Hiệu chỉnh và kết quả đo
- Mô phỏng 100 đời mỗi ca (mầm cố định), so tuổi thọ thế hệ của engine với tuổi thọ thế hệ dựng từ đường tử vong theo năm (không gồm bệnh/tai nạn):
  | Ca | Mô hình | Mô phỏng (hệ số bù) | Chết trước 5 tuổi: mô phỏng / UN |
  |---|---|---|---|
  | Ấn Độ 1950 | 46,3 | 46,6 | 26% / 27% |
  | Nigeria 1960 | 39,6 | 38,7 | 30% / 32% |
  | Việt Nam 1950 | 53,3 | 50,0 | 28% / 21% (Việt Nam cộng hệ số nhóm dân tộc và giàu nghèo vốn có, nên cao hơn trung bình quốc gia) |
  | Nhật 1950 | 73,6 | 75,4 | 7% / 9% |
  | Nigeria 2000 | 50,9 | 53,6 | 15% / 18% |
  | Hoa Kỳ 2000 | 79,5 | 79,3 | 1% / 1% |
  | Brazil 1970 | 64,9 | 69,5 | 6% / 13% (mẫu 100 đời, sai số khoảng ±3 năm) |
- Không có hệ số bù: Việt Nam 1950 chết trước 5 tuổi 32% so với UN 21%, Nigeria 1960 42% so với 32%.
- `tests/era920.js` kiểm mẫu nhỏ hơn (60 đời) với ngưỡng rộng: chỉ là rào chắn, không thay cho phép đo ở trên.

## Đo lại hệ số bù tử vong (15/11/2026)
- 10 ca (Ấn Độ 1950, Nigeria 1960, Brazil 1970, Nhật 1950, Ai Cập 1965, Indonesia 1960, Mexico 1960, Đức 1950, Kenya 1970, Thổ Nhĩ Kỳ 1965) x 40 đời: chênh trung bình tuổi thọ mô phỏng so với đường tử vong theo năm +1,2 năm; chết trước 5 tuổi bằng 0,90 so với UN. Từng ca lệch tới −2 đến +8 năm (sai số mẫu khoảng ±4 năm). Thử đổi hệ số trẻ em 0,22 thành 0,17 chỉ đổi kết quả trong sai số (0,93), nên giữ nguyên.

## Giới hạn đã biết
- Tiền lương, giá cả, tỷ giá, chi phí y tế và các số tiền tuyệt đối trong game vẫn theo mặt bằng giá 2026 (xem `docs/ERA-POLICY-917.md`). Đời xưa vì vậy giàu hơn thực tế về tiền, nhưng nghèo hơn về y tế, tiêm chủng, đô thị và học tập. Việc đưa GDP vào lương và giá cần sửa chi phí tuyệt đối ở nhiều module; chưa làm.
- Chính sách theo nước và năm (bảo hiểm y tế, lương hưu, giáo dục bắt buộc, quyền bầu cử…) chưa có ngoài `era917.js`: chi phí y tế ở nước giàu vẫn chỉ phụ thuộc `life.gdp` hiện nay.
- Tỷ lệ chết trước 5 tuổi đo thấp hơn UN ở một số ca (Brazil 1970); hệ số bù là tuyến tính theo mức tử vong, chưa phải mô hình theo nguyên nhân.
- Tử vong rất cao trong biến cố (Campuchia 1975–1978 tuổi thọ UN khoảng 12, Rwanda 1994) bị chặn ở sàn 25 của mô hình Gompertz–Makeham; phần chênh được cộng bằng nguy cơ riêng trong `hist920.js` (Campuchia) hoặc chưa mô hình (Rwanda: chỉ ghi bối cảnh, vì game không có danh tính nhóm).
- Tỷ lệ phổ cập công nghệ chỉ có di động, điện thoại cố định và internet; TV, điện, nước sạch theo năm chưa có (điện theo mốc 1990–2023 vẫn ở `data-health874.js`).
- Tổng tỷ suất sinh của đời sinh năm nay vẫn dùng công thức cũ theo u5 (không đổi để giữ nguyên đời hiện nay); công thức đó lệch UN ở một số nước (ví dụ Nigeria 5,9 so với 4,5 của UN 2023).
- Số liệu theo năm lấy ở mức cả nước: không có chênh lệch vùng, thành thị/nông thôn, nhóm thu nhập hay dân tộc ngoài các hệ số tham số vốn có của engine.
- Không có số liệu cho Vatican (trong game dùng mức mặc định).
