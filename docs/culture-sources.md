# Nguồn dữ liệu văn hóa, con người, lịch sử — Một Đời v6.7.0

## Đợt 8.9.4-country-batch1 — tám nước, mốc tham chiếu 2026

Danh mục URL theo từng dữ kiện có ở public/js/data-country-depth.js (sources) và docs/country-depth-inventory.json (sourceCatalogue và content từng nước). Nguồn: cơ quan giáo dục/lao động/tư pháp của FI, GH, IE, NZ, JP, FR, US, VN; cơ quan văn hóa và du lịch chính thức. Các trang/PDF khó tải toàn văn có trích đoạn chỉ mục được đối chiếu, không được diễn giải thành đã rà mọi sửa đổi pháp luật.

Hồ sơ có ít nhất 3/3/3/5/5/5 mục không đồng nghĩa đã tái hiện trọn văn hóa hay luật. Các đặc điểm pháp lý, ngày lễ và món ăn được phân biệt với nhân vật, chi phí và xác suất mô phỏng. Hoa Kỳ dùng năm ví dụ món vùng Louisiana, không đại diện mọi bang. Lễ Ga/Anlo-Ewe không gán nguồn gốc đó cho toàn Ghana. Nghi thức tôn giáo, quà cưới và đổi tên đều không bắt buộc trong gameplay. Thông tin hiện đại chưa được hồi áp cho quá khứ; game tương lai ghi rõ giả định giữ mốc 2026.


## Batch chiều sâu 8.9.3 — đối chiếu 28/10/2026

- Phần Lan: https://www.visitfinland.com/en/articles/finlands-traditional-and-iconic-foods/ — tên ruisleipä, karjalanpiirakka, lohikeitto, leipäjuusto, kalakukko; giữ khác biệt Karelia/Savo.
- Ghana: https://ghanaculture.gov.gh/regional-representation-and-diversity/ — National Commission on Culture; tên kenkey, banku, tuo zaafi, akple, eto; phân biệt vùng và cộng đồng Ewe.
- Ireland: https://www.ireland.com/en/magazine/food-and-drink/traditional-irish-food/ — Tourism Ireland; soda bread, Waterford Blaa, seafood chowder, smoked salmon, Irish lamb. Nguồn bao quát đảo Ireland; batch chỉ lấy ví dụ có tại Cộng hòa Ireland, không suy luật hay chủ quyền từ nội dung du lịch.
- New Zealand: https://www.mch.govt.nz/engagement-maori/matariki — Ministry for Culture & Heritage; tưởng nhớ, hiện tại, tương lai và khác biệt Puanga; phiên bản ngày lễ công cộng từ 2022, lịch thay đổi theo năm. Game tiến theo năm, không giả định ngày cố định.
- verified chỉ áp dụng tên món và mô tả được đối chiếu; không áp dụng luật lao động, cưới hỏi hay toàn hồ sơ. Chi phí 1–1,5% mức sống năm, chỉ số, xác suất nấu ăn và thành tựu là thiết kế game.


## Nemotron-Personas-Vietnam (NVIDIA & FPT)

- Bộ dữ liệu: https://huggingface.co/datasets/nvidia/Nemotron-Personas-Vietnam
- Phát triển bởi NVIDIA Corporation cùng FPT Smart Cloud và Viện Quantum AI & Cyber Security (FPT Corporation).
- Giấy phép: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/ . Game ghi công tại mục Giới thiệu → Nguồn dữ liệu trên trang chủ, nêu rõ dữ liệu đã được chọn lọc, chuyển đổi, điều chỉnh, và NVIDIA cùng các đơn vị phát triển không tài trợ, bảo trợ hay xác nhận trò chơi.
- Quy mô: 1.000.000 persona tổng hợp (synthetic), dựng theo phân bố nhân khẩu học, địa lý của Việt Nam (Niên giám thống kê, số liệu Tổng cục Thống kê theo mô tả của bộ dữ liệu). Các trường gồm vùng kinh tế – xã hội (6 vùng), thành thị / nông thôn, tuổi, giới tính, học vấn, hôn nhân, nghề nghiệp, sở thích, ẩm thực, văn hóa.
- Cách dùng trong game (v6.9): dùng TOÀN BỘ 1.000.000 persona (11 file parquet), đọc bằng `tools/personas-from-parquet.py`, tổng hợp bằng `tools/build-personas.js`: tần suất nghề nghiệp, sở thích, thể thao, nơi du lịch, văn nghệ, món ăn, lễ hội theo vùng × thành thị / nông thôn × nhóm tuổi và theo 34 tỉnh, thành (dựa vào địa danh được nhắc trong mô tả persona); kỹ năng và mục tiêu theo nghề; học vấn, hôn nhân theo vùng / tuổi. Kết quả ghi vào `public/js/data-personas-vn.js`. Game không chép nguyên văn persona nào. Món đặc trưng theo tỉnh lấy theo danh sách đặc sản đã được biết rộng rãi, dữ liệu persona chỉ dùng để xếp thứ tự.
- Đối chiếu mô phỏng: `tools/persona-calibration.js` → `docs/persona-calibration.md`.
- Lưu ý: đây là dữ liệu tổng hợp. Game chỉ dùng như phân bố tham khảo cho người quen, thú vui, món quê, không coi là sự thật về một người hay địa phương cụ thể.

## Di sản văn hóa phi vật thể được UNESCO ghi danh

Gồm 16 di sản: Nhã nhạc Cung đình Huế (2003); Không gian văn hóa Cồng chiêng Tây Nguyên (2005); Dân ca Quan họ Bắc Ninh (2009); Ca trù (2009); Hội Gióng ở đền Phù Đổng và đền Sóc (2010); Hát Xoan Phú Thọ (2011, chuyển sang danh sách đại diện 2017); Tín ngưỡng thờ cúng Hùng Vương (2012); Đờn ca tài tử Nam Bộ (2013); Ví, Giặm Nghệ Tĩnh (2014); Nghi lễ và trò chơi kéo co (2015); Thờ Mẫu Tam phủ (2016); Bài chòi Trung Bộ (2017); Thực hành Then của người Tày, Nùng, Thái (2019); Nghệ thuật Xòe Thái (2021); Nghệ thuật làm gốm của người Chăm (2022); Lễ hội Vía Bà Chúa Xứ núi Sam (2024).

- Danh mục UNESCO: https://ich.unesco.org/en/state/viet-nam-VN
- Tổng hợp: https://baolaocai.vn/16-di-san-van-hoa-phi-vat-the-cua-viet-nam-duoc-unesco-ghi-danh-post394379.html

## Lịch sử

Game chỉ dùng các mốc đã được ghi nhận chính thức trong sách giáo khoa Lịch sử Việt Nam, không thêm diễn giải chính trị:

- 938 trận Bạch Đằng (Ngô Quyền); 1077 phòng tuyến sông Như Nguyệt (Lý Thường Kiệt); 1288 trận Bạch Đằng (Trần Hưng Đạo).
- 1428 khởi nghĩa Lam Sơn thắng lợi, "Bình Ngô đại cáo"; 1789 chiến thắng Ngọc Hồi – Đống Đa (Quang Trung).
- 2/9/1945 Tuyên ngôn Độc lập; 7/5/1954 chiến thắng Điện Biên Phủ; 30/4/1975 giải phóng miền Nam, thống nhất đất nước.
- 1986 Đại hội VI khởi xướng Đổi mới; 1995 gia nhập ASEAN; 2007 gia nhập WTO.
- 1/7/2025: sắp xếp còn 34 tỉnh, thành phố, chính quyền địa phương hai cấp (Nghị quyết 202/2025/QH15).

## Pháp luật dùng trong sự kiện

- Bộ luật Lao động 2019: Điều 112 (nghỉ lễ, tết: Tết Dương lịch 1 ngày, Tết Âm lịch 5 ngày, 30/4 1 ngày, 1/5 1 ngày, Quốc khánh 2 ngày, Giỗ Tổ Hùng Vương 1 ngày); Điều 98 (làm việc ngày lễ được trả ít nhất 300%, chưa kể tiền lương ngày lễ).
- Luật Bầu cử đại biểu Quốc hội và đại biểu Hội đồng nhân dân 2015, Điều 69: cử tri phải tự mình đi bầu, không được nhờ người khác bầu thay (trừ trường hợp không tự viết được phiếu, khuyết tật, ốm đau theo khoản 3, 4).
- Ngày Thương binh – Liệt sĩ 27/7.

## Trích dẫn Nemotron-Personas-Vietnam (theo thẻ dữ liệu)

```
@software{nvidia/Nemotron-Personas-Vietnam,
  author = {Thanh-Tung, Hoang and Hoang, Tuan-Anh and Le-Dinh, Duy and Nguyen, Thuy-Duong and Le, Van and Tran, Quan Minh and Tong, Vu and Nguyen, Que and Juluru, Nirmal Kumar and Prayaga, Shyamala and Sharabiani, Ashton and Acharya, Evan and Sadeghi, Bardiya and Jennings, Will and Praveen, Kiran and Corneil, Dane and Meyer, Yev},
  title = {Nemotron-Personas-Vietnam: Synthetic Personas Aligned to Real-World Distributions for Vietnam},
  month = {October},
  year = {2026},
  url = {https://huggingface.co/datasets/nvidia/Nemotron-Personas-Vietnam}
}
```

## Hệ thống hồ sơ văn hóa và thể chế 195 quốc gia (v8.9.0 — `public/js/life173.js`)

Từ phiên bản 8.9.0, game mở rộng lớp bản địa hóa văn hóa và thể chế cho toàn bộ 195 quốc gia trong `G.W.C` theo kiến trúc 3 tầng, tách biệt rõ **quốc gia cư trú hiện tại** (`resCode`) và **nguồn gốc / di sản gia đình** (`hasVNOrigin` / `culturalContext173`):

### 1. Kiến trúc 3 tầng dữ liệu (`E.CULTURE173`)
- **Tầng 1 — Hồ sơ quốc gia chuyên sâu (`level: 'deep'`, 27 quốc gia)**: Việt Nam (`VN`), Nhật Bản (`JP`), Hàn Quốc (`KR`), Trung Quốc (`CN`), Hoa Kỳ (`US`), Vương quốc Anh (`GB`), Pháp (`FR`), Đức (`DE`), Ấn Độ (`IN`), Thái Lan (`TH`), Singapore (`SG`), Malaysia (`MY`), Indonesia (`ID`), Philippines (`PH`), Úc (`AU`), Canada (`CA`), Brazil (`BR`), Mexico (`MX`), Nga (`RU`), Ý (`IT`), Tây Ban Nha (`ES`), Hà Lan (`NL`), Thụy Điển (`SE`), Thụy Sĩ (`CH`), Các Tiểu vương quốc Ả Rập Thống nhất (`AE`), Ả Rập Xê Út (`SA`), Nigeria (`NG`).
- **Tầng 2 — Hồ sơ quốc gia xác thực (`level: 'country'`)**: Đài Loan (`TW`), Hồng Kông (`HK`), New Zealand (`NZ`), Phần Lan (`FI`), Na Uy (`NO`), Đan Mạch (`DK`), Ba Lan (`PL`), Áo (`AT`), Bỉ (`BE`), Ireland (`IE`), Bồ Đào Nha (`PT`), Hy Lạp (`GR`), Séc (`CZ`), Thổ Nhĩ Kỳ (`TR`), Ai Cập (`EG`), Maroc (`MA`), Nam Phi (`ZA`), Kenya (`KE`), Ghana (`GH`), Ethiopia (`ET`), Argentina (`AR`), Chile (`CL`), Colombia (`CO`), Peru (`PE`), Cuba (`CU`), Pakistan (`PK`), Bangladesh (`BD`), Sri Lanka (`LK`), Nepal (`NP`), Campuchia (`KH`), Lào (`LA`), Myanmar (`MM`), Kazakhstan (`KZ`), Uzbekistan (`UZ`), Israel (`IL`), Iran (`IR`), Qatar (`QA`).
- **Tầng 3 — Khung văn hóa vùng địa lý & phổ quát (`level: 'regional'`)**: Tất cả các quốc gia còn lại trong 195 nước đều được ánh xạ vào 13 vùng văn hóa – địa lý (`east_asia`, `se_asia`, `south_asia`, `central_asia`, `mena`, `west_europe`, `north_europe`, `south_europe`, `east_europe`, `north_america`, `latam`, `sub_saharan`, `oceania`) với lễ hội, ẩm thực, học đường, trưởng thành, đám cưới và môi trường làm việc trung tính, xác thực theo vùng — tuyệt đối không gán nhầm sự kiện Việt Nam và không tự bịa phong tục thiếu căn cứ.

### 2. Nguồn đối chiếu giáo dục, lễ hội và nghi thức trưởng thành
- **UNESCO Intangible Cultural Heritage Lists**:
  - Tết Nguyên đán / Lunar New Year, Chuseok, Seollal, Washoku (Nhật Bản), Día de Muertos (Mexico), Diwali (Ấn Độ), Songkran (Thái Lan), Nowruz (Trung Á & Tây Á), Eid al-Fitr / Eid al-Adha, Mid-Autumn Festival, Thanksgiving, Midsummer, Carnival: https://ich.unesco.org/en/lists
- **Hệ thống kỳ thi tốt nghiệp / tuyển sinh trung học phổ thông quốc gia**:
  - Việt Nam: Kỳ thi tốt nghiệp THPT.
  - Nhật Bản: Kỳ thi chung tuyển sinh đại học (*Daigaku Nyūgaku Kyōtsū Tesuto*).
  - Hàn Quốc: Kỳ thi năng lực học thuật đại học *Suneung* (CSAT).
  - Trung Quốc: Kỳ thi đại học toàn quốc *Gaokao*.
  - Hoa Kỳ: Học bạ trung học kèm kỳ thi chuẩn hóa *SAT / ACT*.
  - Vương quốc Anh: Kỳ thi *GCSE* và *A-Levels* (hoặc *Scottish Highers*).
  - Pháp: Kỳ thi tú tài *Baccalauréat (Le Bac)*.
  - Đức: Kỳ thi tú tài *Abitur*.
  - Ấn Độ: Kỳ thi hội đồng lớp 10 và lớp 12 (*Board Examinations*).
  - Úc: Kỳ thi tốt nghiệp bang và xếp hạng *ATAR*.
  - Brazil: Kỳ thi trung học quốc gia *ENEM*.
  - Nga: Kỳ thi quốc gia thống nhất *EGE*.
  - Singapore: Kỳ thi *GCE O-Level / A-Level*.
  - Nigeria / Tây Phi: Kỳ thi *WASSCE*.
- **Nghi thức trưởng thành và tuổi đầu đời**:
  - Nghi thức tròn 1 tuổi: *Thôi nôi* (Việt Nam), *Doljanchi* (Hàn Quốc), *Erabitori / Ichigatsu* (Nhật Bản), *Zhuazhou / Chu tuế* (Trung Quốc), tiệc sinh nhật đầu đời tại các quốc gia khác.
  - Cột mốc trưởng thành: *Seijin no Hi* (Nhật Bản, 18–20 tuổi), *Seongnyeon-ui Nal* (Hàn Quốc, 19 tuổi), *Quinceañera* (Mexico và Mỹ Latinh, 15 tuổi), *Jugendweihe / Konfirmation* (Đức), *Russefeiring* (Na Uy), *Matric Dance* (Nam Phi).

### 3. Quy ước mô phỏng
- Các sự kiện văn hóa, học đường, lễ hội, đám cưới, nơi làm việc và hòa nhập di cư luôn có lựa chọn tham gia sâu, tham gia vừa phải, giữ truyền thống gia đình gốc (với kiều bào / thế hệ thứ hai) hoặc nghỉ ngơi không tốn kém.
- Không mặc định mọi cá nhân trong cùng một quốc gia đều theo cùng một tôn giáo hay bắt buộc tham gia một nghi lễ cụ thể.
