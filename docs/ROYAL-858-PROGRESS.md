# Một Đời — Sổ tiến độ hoàng gia 8.10.58

Trạng thái: HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN. Preview, packaged, chưa phát hành. Đối chiếu nguồn ngày 09/11/2026. Không triển khai Production.

## Kiến trúc và tương thích

Mở rộng ROYAL920/837/847 và BEAUTY919, không tạo gia phả thứ hai. royal858-data.js lưu căn cứ/mốc; royal858.js phân giải danh tính từ mã người hiện có. Quan hệ, thứ tự kế vị, tước/danh xưng, cụm theo cha mẹ, Royal House, công vụ, tên và quyền lợi là dữ liệu riêng. Các quyền ownership/income/government mặc định false; Cornwall có quyền hưởng lợi theo điều kiện riêng, không tự giao toàn hạt hoặc nạp tiền vào tài sản cá nhân. Thu nhập, sở hữu và thừa kế hiện hữu không bị chuyển đổi theo chữ “xứ”.

Migration giữ nguyên titles và lost, ID, quan hệ, tài sản, ledger, log sự kiện. Bản ghi cũ thiếu metadata được liệt kê chưa xác định; không tự chứng nhận sắc lệnh cũ. Chuẩn bị/migration lặp lại không nhân đôi lịch sử. Cache WeakMap không nằm trong save. Tên mới nằm royal858.names, không đổi mã hoặc viết lại tên trong nhật ký đã lưu. Khoản công vụ chưa chi được hoàn lại, không tặng cho người chơi.

## Tiến độ theo nước

| Nước | Đã triển khai / ca mô phỏng kiểm thử | Phần còn thiếu để nghiệm thu toàn diện |
| --- | --- | --- |
| GB | Wales cần grant; Cornwall/Rothesay riêng, nữ và phối ngẫu; LP1917/2012, ngoại lệ1948 nhập phạm vi; George/Charlotte/Louis và con Harry trước/sau đổi ngôi; tên theo Wales/đời tư; Sussex heirsMaleBody và Edinburgh2023 life | Toàn bộ văn thư cá nhân/ngoại lệ trước1917, mọi remainder peerage và thực tế hôn nhân/quyền điền sản lịch sử. 1948 chỉ bật trên người có reference1948, không áp mọi hậu duệ công chúa. |
| ES | Asturias tự động của người thừa kế và danh xưng phối ngẫu theo điều2; Infante/Infanta của con quân chủ/người thừa kế, Grande con Infante; ưu tiên nam, con giả định Leonor | Các quyết định đặc cách riêng và văn bản trước1987 chưa thành bộ lịch sử đầy đủ. |
| BE | Prince/Princess theo thế hệ; Brabant chỉ nhánh con trưởng đủ điều kiện, không mọi người số1; thay đổi quy tắc theo thời kỳ | Ngoại lệ cá nhân AlbertII và sắc lệnh nhận diện riêng chưa có dữ liệu thực nhân vật. Quyền cũ giữ trong ledger, không chứng nhận lại tự động. |
| SE | Tước tỉnh qua grant riêng (Estelle/Östergötland, con thứHalland); scope2019 có mốc, giữ Prince/Princess/duchy, mấtHRH/House/công vụ nhánh chỉ định | Danh mục mọi tỉnh và quyết định từng người chưa đầy đủ. Cấp Prince theo gia hệ trong game ghi royalDecisionModel/scenario, không giả là luật tự động cho mọi thời kỳ. |
| DK | Scope Joachim có mốc1/1/2023, Monpezat/Excellency, giữline; không lan nhánh khác, hậu duệ trong scope áp riêng | Quyết định2008 phải có monpezatBasis; không suy ra họ. Chưa nhập đầy đủ sắc lệnh mọi đời quân chủ. |
| NL | Orange riêng; Netherlands/Orange-Nassau/count/jonkheer có căn cứ khác nhau; grant riêng không giao đất; House khác Family | Ngoại lệ thành viên House chuyển tiếp2002/2013 và mọi sắc lệnh theo người chưa tự nhập. Prince theo gia hệ là mô hình quyết định có nhãn; chưa mô hình đầy đủ giới hạn collateral trong luật lịch sử. |
| LU | Tước Hereditary GrandDuke/Duchess từ18, luật2023; phân biệt phối ngẫu; không tựBourbon-Parma | Chưa mô hình đầy đủ gia quy mọi thời kỳ trước2023; Bourbon cần bourbonBasis riêng. |

Những giới hạn trên là dữ liệu chưa phủ, không được báo PASS hoặc đồng nhất với quy định thật. Nhân vật game vẫn hư cấu. Quyết định giả định dùng scenario và ngày hiệu lực; tham chiếu lịch sử chỉ áp phạm vi được nhập, không tìm người bằng tên chuỗi.

## Nguồn và mốc hiệu lực

Mốc theo năm/tháng dùng precision, không khẳng định chính xác ngày. Mốc null nghĩa cần quyết định riêng. Một số nguồn chính thức chặn truy cập trực tiếp (College of Arms, eJustice); đối chiếu nội dung lập chỉ mục và văn bản công bố, vẫn giữ URL chính thức trong cấu hình. Không khẳng định đã truy cập thành công trang bị chặn.

| Quy tắc | Mốc | Nguồn / phạm vi |
| --- | --- | --- |
| uk1917 | 1917-11-30 | [uk1917](https://www.college-of-arms.gov.uk/resources/styles-and-titles-of-the-royal-family) — Con của quân chủ, cháu qua con trai; ngoại lệ chắt trưởng nam và Lord/Lady theo văn thư. |
| uk2012 | 2012-12-31 | [uk2012](https://www.thegazette.co.uk/notice/L-60384-1738680) — Tất cả con của con trai trưởng của Prince of Wales. |
| uk1948 | 1948-10-22 | [uk1948](https://www.college-of-arms.gov.uk/resources/styles-and-titles-of-the-royal-family) — Ngoại lệ cho con Princess Elizabeth và Duke of Edinburgh; chỉ áp khi có phạm vi được ghi rõ. |
| wales | quyết định riêng | [wales](https://researchbriefings.files.parliament.uk/documents/CBP-9372/CBP-9372.pdf) — Tước phong riêng, không tự có vì đứng đầu hàng kế vị. |
| cornwall | 1337-01-01 (year) | [cornwall](https://www.duchyofcornwall.org/faqs/) — Con trai trưởng còn sống của quân chủ đồng thời là người thừa kế; không cấp mặc định cho nữ hoặc cháu. |
| rothesay | 1469-01-01 (year) | [rothesay](https://www.gov.uk/government/publications/kings-or-princes-consent/kings-and-princes-consent) — Điều kiện con trai trưởng của quân chủ; dùng tại Scotland. Chưa có căn cứ tự cấp nữ thừa kế. |
| ukSurname | 1960-02-08 | [ukSurname](https://www.royal.uk/royal-family-name) — Nhà Windsor và họ Mountbatten-Windsor là hai dữ liệu khác nhau; cần đúng dòng hậu duệ. |
| sussex | 2018-07-16 | [sussex](https://www.thegazette.co.uk/notice/3071743) — Ca tham chiếu: heirs male of the body lawfully begotten. |
| edinburgh | 2023-03-10 | [edinburgh](https://www.royal.uk/news-and-activity/2023-03-10/the-king-confers-the-dukedom-of-edinburgh-upon-the-prince-edward) — Ca tham chiếu sáng lập năm 2023: chỉ suốt đời người nhận. |
| spain | 1987-12-02 | [spain](https://www.boe.es/eli/es/rd/1987/11/06/1368/con) — Điều 2 Asturias/phối ngẫu; điều 3 Infante; điều 4 con Infante là Grande; điều 6 quyền dùng tước cá nhân chung thân. |
| belgium | 2015-11-12 | [belgium](https://www.ejustice.just.fgov.be/cgi/article_body.pl?language=fr&caller=summary&pub_date=2015-11-24&numac=2015021075) — Con/cháu trực hệ quân chủ và người thừa kế theo sắc lệnh; quyền cũ được giữ riêng, không hồi tố xóa. |
| brabant | 2001-10-16 | [brabant](https://www.monarchie.be/en/royal-family/princess-elisabeth-duchess-of-brabant) — Tước riêng của con trưởng quân chủ; kiểm nhánh đại diện, không gán cho mọi người đứng số 1. |
| sweden | 1980-01-01 | [sweden](https://www.kungahuset.se/english/royal-house) — Prince/Princess, HRH và Royal House tách nhau; tước tỉnh do quyết định riêng. |
| se2019 | 2019-10-07 | [se2019](https://www.kungahuset.se/english/archive/press-releases/2021-03-28-prince-julian-herbert-folke-duke-of-halland) — Nguồn xác nhận quyết định 7/10/2019; chỉ áp nhánh được chỉ định. Giữ Prince/Princess và dukedom, tách HRH/Royal House. |
| estelle | 2012-02-24 | [estelle](https://www.kungahuset.se/english/royal-house/hrh-princess-estelle) — Ca đối chiếu cá nhân, không là tước mặc định cho mọi người thừa kế. |
| monpezat | 2008-04-30 (month) | [monpezat](https://www.kongehuset.dk/en/news/changes-in-titles-and-forms-of-address-in-the-royal-family) — Grant theo nhánh được chỉ định, không đồng nghĩa họ pháp lý. |
| dk2023 | 2023-01-01 | [dk2023](https://www.kongehuset.dk/en/news/changes-in-titles-and-forms-of-address-in-the-royal-family) — Hậu duệ Joachim: Count/Countess of Monpezat, Excellency; giữ thứ tự kế vị. |
| netherlands | 2002-06-12 | [netherlands](https://www.koninklijkhuis.nl/onderwerpen/koninklijk-huis/titels-en-aanspreektitels) — Phân biệt Orange, Netherlands, Orange-Nassau, Count, Jonkheer; danh xưng và họ theo sắc lệnh từng nhánh. |
| nlHouse | 2002-06-12 | [nlHouse](https://www.royal-house.nl/topics/monarchy/royal-house/royal-house-and-royal-family) — Royal House khác Royal Family; xét độ thân thuộc và quyền kế vị. |
| luxembourg | 2023-07-01 | [luxembourg](https://monarchie.lu/en/luxembourg-monarchy/constitutional-monarchy) — Người thừa kế từ 18 tuổi dùng Hereditary Grand Duke/Duchess; không tự gắn Bourbon-Parma. |
| bourbon | quyết định riêng | [bourbon](https://monarchie.lu/en/luxembourg-monarchy/former-sovereigns/hrh-grand-duke-henri) — Căn cứ theo người/dòng riêng, không suy ra từ tước kế vị. |
| crownGB | 2015-03-26 | [crownGB](https://www.legislation.gov.uk/ukpga/2013/20) — Ưu tiên giới chỉ bỏ cho người sinh sau 28/10/2011; tước quý tộc dùng remainder riêng. |
| crownES | 1978-12-29 | [crownES](https://www.casareal.es/EN/corona/Paginas/la-corona-hoy_orden.aspx) — Ưu tiên nam trong cùng hàng con; đại diện theo nhánh. |

## Tên, nghi thức và vòng đời

Form sinh con nối FAMILY53.name, thêm nhiều tên đệm; form royalName858 tách tên nghi lễ, daily, họ và service. Chấp nhận Unicode/tên kép/gạch nối; tổ tiên tri ân lưu ID. Top6 có trao đổi theo năm tiếp theo, không veto. Họ kép Tây Ban Nha nhập nguyên thứ tự; “de Todos los Santos” là thành phần tên nhập theo nhân vật, không tự thêm cho mọi người. Windsor/Bernadotte/Monpezat không tự biến thành họ pháp lý. Mountbatten-Windsor chỉ khi có cờ dòng1960 và ngoại lệ hôn nhân phù hợp.

Hồ sơ/gia phả/bảng kế vị đọc cùng identity. Năm mới, sinh con, migration, đặt tên và đồng bộ tước hiện hữu nối resolver. Phong tước có xác nhận của quân chủ hoặc đề nghị chờ năm sau; đổi ngôi khiến đề nghị cũ cần xét lại. Quyết định thu hẹp scope hiệu lực về sau không đụng tài sản hoặc line. Công vụ thực tế mới tạo phản ứng trang phục; bốn loại nhiệm vụ ánh xạ ceremony/outdoor/charity/formal. Bình luận có positive/neutral/critical và theo dõi năm sau; không thu tước.

## Kiểm thử và điều kiện build

- royal858: 84 kiểm tra; royal837, royal843, royal847, royal-birth-display, md5-920; children141, family130, looks134.
- Smoke/saves/save-safety/NPC chạy test:quick; không dùng bản lưu thật hoặc dữ liệu cá nhân.
- Browser: 8 lượt menu ở390/1280px, form lưu tênUnicode, không tràn/lỗiJS. Screenshot tại .cache (không commit).
- Regression có chọn lọc các hệ chịu ảnh hưởng; chưa chạy toàn bộ. Chưa phân loại lại lỗi section9 đã ghi ở đợt8.10.57. GĐ6 cần toàn bộ mã cuối, thiết bị thật, save thật, ngoại lệ lịch sử và bindingREVIEWS_DB.
- Quy trình package:cloudflare phải đạt, tên/nội dungZIP so toàn bộdist; nhật kýJSON/HTML và lịch sử cũ kiểm riêng. Kết quả build cuối ghi trong báo cáo giao việc.

## Git và dữ liệu ngoài phạm vi

Giữ nguyên thay đổi có sẵn healthsys919.js, world-country-jobs832-browser.js, healthsys-rx-cap.js và tệp riêng; không stage. Artifact workspace có phần y tế đó, không thể tái dựng đúng từ riêng commit hoàng gia. Không sửa/commit Claude.md, .local-state-review.txt, audit-world-520.json. Giữdist bịignore, dist.zip tracked.

Worker/API chỉ kiểm cục bộ; chưa xác minhPages REVIEWS_DB hayAPIProduction. Chủ dự án tựuploadDashboard. Khôi phục từ nền4c551d0 bằng git revert commit đợt này rồi package lại; không reset/force-push hoặc xóa thay đổi riêng.

## Kết quả đóng gói và kiểm tra cuối

- test:quick: smoke11/11, saves10/10, save-safety10/10, NPC14/14, không timeout. Cảnh báo cũ seed phụ thuộc Date.now và hc_story không còn trong fixture được giữ nguyên.
- royal85884, royal83767, royal84359, royal847248, royal-birth-display186, md5-920117, children14138, family13067, looks13475 (kèm adopted appearance), study-home857242 đều đạt. update-release1023 và update-history-timezones đạt.
- Browser bản dist: tám menu ở390/1280px, lưu tên Unicode; nhật ký đầu danh sách8.10.58, tìm không dấu, lọc, tải thêm đạt, không tràn/lỗiJS. Đã xem screenshot hồ sơ/tên và trang cập nhật.
- npm run package:cloudflare PASS;28 file triển khai; loading/hash/tám cuộc đời source-build trùng; admin/API cục bộ đạt. dist.zip3.380.560 byte, SHA256 D281C98698A5E379B52B4AC9E228FE795566F2DA10630BF9E558AC9CAE508373. Package đọc lại toàn bộ tên/nội dungZIP so SHA256 từng file với dist.
- Xác minh thêm rootindex.html,_worker.js,_routes.json,_headers,.well-known/ai-catalog.json; JSON/HTML trongZIP có royal-titles-names-81058, packaged/releasedAtnull đúng;180 mục cũ giữ nguyên.
- GitHub origin mercyx03/motdoi: public, có quyềnpush/admin; API đọc0workflow,0hook,0deployment. Chỉ push nhánh hiện tại, không merge/deploy. Pages binding chưa xác minh.
- Sẵn sàngProduction: CHƯA, còn nghiệm thu tổng thể và giới hạn dữ liệu nêu trên; artifact có thay đổi y tế ngoài commit.

## Monaco — bản8.10.61

Mở rộng nguồn danh tính chung sangMC, tách luật theo quân chủ, quốc tịch, nhiếp chính, HSH/SAS và tước/nhánh/tên. Sổ tiếp tục và nguồn: docs/MONACO-861-PROGRESS.md. Không áp lại bảng tước tự động cũ choMC.

## Tây Ban Nha8.10.62

Asturias/Infante/Grande, quyền phối ngẫu và hai họ mở rộng từ registry chung; không cấpLugo mặc định nữa. Nguồn, ca nghiệm thu và giới hạn: docs/SPAIN-862-PROGRESS.md.
