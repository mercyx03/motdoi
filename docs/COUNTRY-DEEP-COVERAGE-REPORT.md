# Kiểm kê chiều sâu quốc gia — 28/10/2026 (UTC+7)

Trạng thái: ĐANG TRIỂN KHAI THEO BATCH, chưa nghiệm thu nhiệm vụ 195 quốc gia.

## Tiến độ mới nhất — đợt 8.9.4-country-batch1

**8/195 quốc gia đạt độ phủ tối thiểu có nguồn và đường tích hợp; còn 187 nước. Chưa hoàn tất yêu cầu tổng thể.** Không gộp dữ liệu regional, số thành tựu hoặc số bản ghi rỗng vào tám nước này.

| Quốc gia | Giáo dục | Lễ/ngày kỷ niệm | Cưới hỏi | Món ăn | Thông tin lao động | Câu chuyện riêng |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| FI — Phần Lan | 3 | 3 | 3 | 5 | 5 | 5 |
| GH — Ghana | 3 | 3 | 3 | 5 | 5 | 5 |
| IE — Ireland | 3 | 3 | 3 | 5 | 5 | 5 |
| NZ — New Zealand | 3 | 3 | 3 | 5 | 5 | 5 |
| JP — Nhật Bản | 3 | 3 | 3 | 5 | 5 | 5 |
| FR — Pháp | 3 | 3 | 3 | 5 | 5 | 5 |
| US — Hoa Kỳ | 3 | 3 | 3 | 5 | 5 | 5 |
| VN — Việt Nam | 3 | 3 | 3 | 5 | 5 | 5 |

Chi tiết từng mục, mã sự kiện, mốc tham chiếu và URL nguồn nằm trong country-depth-inventory.json; mảng remaining liệt kê đúng 187 mã chưa đạt. fullyAccepted=false được giữ cho tất cả nước: đạt đếm mục có nguồn và kết nối không đồng nghĩa đã nghiệm thu toàn diện hoặc tái hiện hết văn hóa/pháp luật.

### Gameplay trong đợt mới

- data-country-depth.js chỉ chứa dữ liệu, nạp trước life173; mở rộng PROFILES/HOL/FOOD, state culture173 và WORLD120/UPDATE110 hiện hữu, không tạo engine hoặc save schema song song. Resolver cũ thêm trường depth, giữ tương thích trường cũ.
- 40 câu chuyện có tên, tình huống và căn cứ riêng: Lukio/Matriculation, BECE/TVET, Leaving Certificate/PLC, NCEA/UE, Common Test, lycée/CAP, học khu/CTE Hoa Kỳ, THPT/nghề Việt Nam. Những chuyện lễ và cưới gắn với cộng đồng và cơ chế địa phương; không chỉ thay tên nước.
- Mỗi chuyện có bước khởi đầu và ít nhất hai lượt theo dõi ở năm sau. Có thất bại/thử lại, giảm nhịp/dừng, giới hạn một hành động/chuyện/năm; hệ thống đưa tối đa một chuyện riêng/năm và ưu tiên lịch hẹn đến hạn. Có menu chủ động ở Hành động.
- Người liên quan hư cấu dùng LIFE138.person với ID, tính cách, mục tiêu và lịch sử ổn định. Đổi công việc/người yêu hoặc người cùng chuẩn bị mất thì ngắt kế hoạch, không chuyển tiến bộ sang người khác. Di cư giữ lịch sử nhưng chặn tác động từ sự kiện đang chờ sai nơi ở.
- Học thuật, ứng dụng, nghề có tác động chỉ số khác nhau và ảnh hưởng chuẩn bị thi/tìm việc qua hệ thống hiện có. Trao đổi công việc có thể tăng uy tín nghề; chuẩn bị cưới tác động affection108 hiện có; bản đồ/vật dụng chuẩn bị làm giảm lo lắng có thời hạn, cần rà lại. Không tự cấp bằng/tín chỉ, nhận việc, trả bồi thường hoặc đăng ký hôn nhân.
- Năm nội dung lao động/nước có menu đối chiếu: mỗi năm một mục, lưu hồ sơ theo nước, giúp xác suất trao đổi chuyện công việc. Con số luật không dùng làm lương hoặc tiền thưởng giả.
- Thông tin mới lấy mốc tham chiếu 2026; không dùng cho quá khứ. Tương lai game ghi rõ là giả định giữ mốc tham chiếu, không tuyên bố luật ngoài đời tương lai không đổi. Lịch cố định/biến đổi/âm lịch/cộng đồng được tách riêng; lễ công cộng không tự gán dân tộc hay tín ngưỡng cho nhân vật.
- Nhánh đăng ký hôn nhân khác giới tại VN từ 2015 chặn nam dưới 20/nữ dưới 18; chuẩn bị cưới không tự đăng ký. Đề nghị tài trợ cưới của con bỏ mặc định sính lễ cho mọi gia đình, giữ nguyên quyền xem/ngân sách/đồng ý hoặc từ chối.
- 15 mục lễ mới, thêm 25 món vào luồng nấu ăn (tổng 40 món tại 8 nước), 10 thành tựu mở rộng từ kho hiện hữu; giữ toàn bộ thành tựu cũ và bóng đá.

### Nguồn và giới hạn

Nguồn chính: Finnish National Agency for Education, Suomi/InfoFinland/Visit Finland; GES/WAEC, Quốc hội Ghana và National Commission on Culture; Chính phủ Ireland, Workplace Relations Commission, Citizens Information và National Museum of Ireland; NZQA, Employment New Zealand, govt.nz, DOC và Tourism New Zealand; MEXT/DNC/MHLW/MOJ/JNTO Nhật; giáo dục/văn hóa Pháp, Service Public và France.fr; US Department of Education, Department of Labor, USAGov/OPM và cơ quan du lịch Louisiana; cổng Chính phủ/Bộ Tư pháp Việt Nam và Vietnam Tourism. URL chính xác ở sourceCatalogue của inventory và data-country-depth.js. Có nguồn PDF/website chặn tải toàn văn; các trích đoạn được chỉ mục từ nguồn chính thức được dùng cho dữ kiện tương ứng, không tuyên bố đã kiểm toàn văn mọi văn bản hay mọi sửa đổi luật.

Ba mục cưới bao gồm đặc điểm pháp lý/tình huống chuẩn bị, không có nghĩa ba phong tục bắt buộc. Món Louisiana không được mô tả là đại diện mọi bang Hoa Kỳ; món các vùng Bretagne/Provence, Savo hay Hội An giữ chú thích vùng. Những loại ngày nghỉ và trường hợp pháp lý có ngoại lệ được ghi rõ, không mô phỏng đủ mọi miễn trừ/ngành/bang/tỉnh. Chi phí, xác suất, nhân vật và chuỗi diễn tiến là hư cấu cân bằng game.

### Kiểm tra đợt mới

- country-minimum-content: 16.418 kiểm tra PASS; từng chuyện đi qua khởi đầu, reload, thất bại, hai lượt tiến bộ, hoàn tất; không tự cấp bằng/cưới; đổi nước chặn tác động; quét cách ly 40 chuyện với 195 nước. Mỗi nước có đường kích hoạt năm thực tế và năm mục lao động có thể chọn. resolve/prune và reload gỡ thẻ sai nước trước khi UI hiện thẻ kế tiếp.
- country-depth-achievements: 1.210 PASS; world-culture173: 854 PASS; smoke 11/11, saves 10/10, save-safety 10/10, NPC 14/14 PASS. Cảnh báo life.id theo giờ thật đã biết vẫn còn.
- World120: 74, exam127: 244, adult106: 105, relationships108: 76, family129: 65, football-career: 180, relationships841: 344 PASS; university136 PASS. Regression 0–4: 8.777 PASS. Các nhóm còn lại chưa được chạy đầy đủ trên mã đợt mới; không gán PASS từ đợt trước.
- Chrome headless thật: browser-country-minimum-content 120 PASS tại 390/1280px, thao tác chọn chuyện và chuẩn bị cho cả 8 nước, giữ NPC/tiến độ trong save, tải lại hiện bước theo dõi năm sau, không lỗi JS/tràn ngang. browser-country-depth-achievements 26 PASS, giữ mục nhật ký/thành tựu cũ sau khi có bản mới. Các lần browser chạy sandbox không có DevTools không được tính PASS; kiểm tra đạt chạy ngoài sandbox trên localhost.
- update-release: 389 PASS; update-history-timezones PASS. Phát hiện công cụ dựng lịch sử so chuỗi ISO khác múi giờ làm bản mới bị tụt sau bản cũ; đã chuyển ba bước sort sang so thời điểm thực. Chạy chính công cụ dựng trên bản sao tách biệt: mục mới còn nguyên và đứng đầu, mọi mục cũ giữ nguyên nội dung/ngày. Dữ liệu JSON và dữ liệu nhúng dist/updates.html đồng nhất, mục mới released.
- npm run package:cloudflare cuối: PASS, 28 file, ZIP 2.607.227 byte, SHA-256 6A16165414E6F227A3724D9E33F570282F62EA7AF6EF0ABC6D659A7EB928C893. Script đọc lại từng entry và so tên/nội dung với dist; loading PASS 8 cuộc đời nguồn/bundle giống nhau, API/admin local PASS (1.687 mục). Giữ Worker/routes/headers/dotfiles. Tổng JS nén 4.031.150 byte, tăng khoảng 1,8% so với đợt trước; bootstrap vẫn 4.405 byte. Đây là đo kích thước, chưa phải benchmark trên điện thoại yếu.
- GitHub: đã xác minh origin mercyx03/motdoi public, quyền push/admin; nhánh codex/life-context-upgrade, mốc trước đợt này 54fd2e41b9ca44521e91dc0c6b3387cafe98081c. Không deploy/merge/đổi cấu hình Cloudflare hoặc database. REVIEWS_DB Production chưa xác minh. Nhật ký country-minimum-eight-894 ghi released theo chỉ định của chủ dự án từ yêu cầu gốc; điều này không phải bằng chứng đã upload Cloudflare và không thay thế nghiệm thu. ZIP vẫn Preview/chưa nghiệm thu tổng thể.
- Các file đợt này: public/js/data-country-depth.js, public/js/life173.js, public/js/life129.js, public/index.html; tools/audit-country-depth.js, tools/build-update-history.js; tests/country-minimum-content.js, tests/browser-country-minimum-content.js, tests/browser-country-depth-achievements.js, tests/update-history-timezones.js; docs/country-depth-inventory.json, docs/COUNTRY-DEEP-COVERAGE-REPORT.md, docs/BACKLOG.md, docs/culture-sources.md, docs/world-events-sources.md, docs/update-extra.json, public/data/updates.json và dist.zip.
- Khôi phục: dùng checkout riêng của 54fd2e4, package lại, chủ dự án tự upload. Giữ bản sao save trước nâng cấp; không hứa mã cũ xử lý được thẻ country_*173 đang chờ trong save mới. Không reset/force-push hoặc đụng ba file được bảo vệ.

### Phần còn lại và tiếp tục

Không thể nghiệm thu toàn bộ 195 nước trong đợt này: cần nghiên cứu và biên tập riêng cho 187 nước còn lại, không đủ căn cứ để tự tạo 3/3/3/5/5/5 cho họ. Mục tiêu toàn bộ vẫn mở, không được báo Hoàn thành. Tiếp tục lấy các mã trong remaining, bổ sung từng quốc gia có nguồn vào data-country-depth.js, chạy tools/audit-country-depth.js và tests/country-minimum-content.js sau mỗi batch; validator tự mở rộng theo dữ liệu, không có hằng số ép đủ 195 hoặc ép số hoàn thành. Giữ tương thích bản lưu và chạy lại build/ZIP sau mỗi đợt đủ điều kiện.

## Kiểm kê trước triển khai

Đọc Claude.md, data-world.js, world-country-index.json, life120/129/138/173, world-economy.js, engine.js, football.js, các tài liệu nguồn và bộ kiểm thử quốc gia. Danh sách chuẩn là G.W.C trong data-world.js, 195 mã duy nhất; tools/world-country-index.json là bản chỉ mục đối chiếu.

life173 hiện phân loại 30 deep, 47 country, 118 regional. Có 78 khóa trong PROFILES nhưng GH chỉ có kỳ thi, không có h/deep nên vẫn bị xếp regional. Vì vậy 118 là số từ resolver thực tế, không phải 132 của báo cáo cũ. 75 nước có danh sách lễ, 30 có hàm kỳ thi, 10 có cấu hình học đường, 6 có cấu hình công sở, 2 có nghi thức trưởng thành. Đây là độ phủ cấu hình, không phải xác nhận chất lượng hoặc pháp luật.

Nhãn deep cũ không kiểm tra đủ sáu lĩnh vực; không được diễn giải 30 nước này là đã nghiệm thu chuyên sâu. Hồ sơ regional chủ yếu là địa lý và nội dung phổ quát; không tính là nội dung riêng. Thu nhập quốc gia có ở world-economy.js nhưng không thay thế dữ liệu luật lao động. life129 phụ trách gia đình/lễ, life138 phụ trách danh tính, kỹ năng và quan hệ; chưa có bộ hồ sơ sáu lĩnh vực được xác minh đồng nhất cho 195 nước.

## Đường tích hợp và rủi ro

- Sinh nhân vật dùng country; nơi cư trú dùng resCode, ưu tiên abroad.code. Không thay schema save.
- life173 chọn lễ từ PROFILES, tín ngưỡng cá nhân và nguồn gốc; sáu nhóm sự kiện được đưa vào HOOKS.year qua WORLD120.queue. Tuổi, trường học, nghề và trạng thái tự do kiểm tra trước khi mở.
- Lễ tác động tiền/tâm trạng/quan hệ/hòa nhập; học tập ghi kết quả thi; công sở tác động uy tín; dữ liệu nằm ở flags.culture173 và tồn tại qua lưu/tải.
- Rủi ro phát hiện: tham số lễ id/kind được tin trực tiếp; sự kiện đã xếp hàng chưa ràng buộc nơi cư trú lúc tạo. Đổi nước giữa lúc chờ có thể mang nội dung cũ theo. Nguồn gốc còn suy từ pool tên: cần ngừng suy quốc gia từ ngôn ngữ/tên đối với lựa chọn sự kiện.
- Không tự áp dụng thi cử hoặc luật hiện đại cho quá khứ. Nhiều tên thi hiện tại cần audit lịch sử riêng; chưa tuyên bố xác minh lại toàn bộ dữ liệu cũ.

## Lịch sử batch 8.9.3 (đợt trước)

1. Kiểm kê đủ 195 mã, giữ ảnh trước sửa ở country-depth-baseline.json. tools/audit-country-depth.js tái tạo country-depth-inventory.json, liệt kê tên/mã và sáu lĩnh vực của từng nước, nguồn, trạng thái và điểm nối gameplay.
2. Chặn tham số lễ giả, bỏ suy nguồn gốc từ pool tên. Gắn countryCode cho bảy luồng văn hóa, kiểm lại nơi ở/tuổi/điều kiện lúc áp dụng. Save cũ dựng lại sự kiện hợp lệ từ nơi ở hiện tại; sự kiện hết điều kiện bị bỏ mà không trừ tiền. Không đổi schema save.
3. FI (Phần Lan), GH (Ghana), IE (Ireland): mỗi nước thêm năm món thực chất có nguồn; học công thức, đợi năm sau, nấu có thể thất bại rồi luyện lại, trò chuyện miễn phí. Trạng thái theo nước và công thức được lưu xuyên năm/di cư. Một năm một hành động, từ tuổi 12, chi phí cho người tự lập. Đường kích hoạt HOOKS.year, không chỉ gọi menu thủ công. NZ thêm Matariki từ năm 2022 theo bối cảnh ngày lễ công cộng.
4. Thêm 149 thành tựu: 75 lễ địa phương theo nước, 30 kết quả học đường, 3 căn bếp, 1 Matariki, 40 bóng đá. Dùng E.addAchievements và giao diện/thống kê có sẵn. Lễ đếm năm khác nhau, bóng đá đếm phút ra sân, trận CLB không lấy trận đội tuyển. Thống kê cũ dạng ước lượng không tự nhận thành tựu bóng đá mới. Không hồi dựng nơi tham gia lễ cũ từ nhật ký văn bản.

## Độ phủ sau batch 8.9.3 (mốc lịch sử)

| Lĩnh vực | Cấu hình cũ / nội dung bổ sung | Mức xác nhận |
| --- | --- | --- |
| Giáo dục | 30 hàm kỳ thi, 10 cấu hình học đường | Chưa audit lại lịch sử/tuyển sinh của 195 nước |
| Lễ hội | 75 nước có danh sách; NZ thêm Matariki | Nguồn mới NZ được kiểm tra; chưa đủ ba lễ/nước |
| Hôn nhân | Giữ hệ thống hiện có | 195 hồ sơ còn needsResearch về độ phủ/pháp lý |
| Ẩm thực | 3 nước mới, 15 món, một luồng nhiều năm | Tên món có nguồn; chi phí/xác suất là game |
| Lao động | 6 bối cảnh công sở, thu nhập ở hệ thống kinh tế | Chưa xác minh bộ năm chính sách/nước |
| Đời sống | Bảy luồng văn hóa có kiểm nơi cư trú | Chưa có năm câu chuyện riêng cho từng nước |

Resolver cũ sau sửa phân loại: 30 deep, 49 country, 116 regional. GH được phân loại đúng vì có kỳ thi; FI có ẩm thực riêng. Không nâng nhãn deep để che thiếu dữ liệu. IE/NZ vốn đã có dữ liệu country. Không xóa nội dung cũ.

- Hoàn tất đủ sáu lĩnh vực và được xác minh trong lượt này: **chưa có quốc gia nào**.
- Bổ sung nội dung riêng từng phần: **FI, GH, IE, NZ**; ba nước có ẩm thực mới, một nước thêm lễ.
- Danh sách chính xác các nước còn thiếu/chưa xác minh: toàn bộ 195 bản ghi trong country-depth-inventory.json, mỗi bản ghi có completeSixDomains=false và trạng thái từng lĩnh vực. Đây là danh sách kiểm kê, không phải 195 hồ sơ chuyên sâu đã hoàn thiện.
- Nguồn mới: Visit Finland, National Commission on Culture Ghana, Tourism Ireland, Ministry for Culture & Heritage New Zealand; URL và phạm vi xác minh ở culture-sources.md. Không thêm thông số luật lao động/hôn nhân chưa được đối chiếu.

## Thay đổi và kiểm thử — mốc lịch sử 8.9.3

Mã gameplay: public/js/life173.js, public/js/football.js; public/index.html bổ sung/thống nhất khóa phiên bản cache. Kiểm thử: tests/country-depth-achievements.js, tests/browser-country-depth-achievements.js, cập nhật ca sự kiện sơ sinh cũ ở tests/world-culture173.js. Kiểm kê: tools/audit-country-depth.js và hai JSON trong docs. Nhật ký bền vững ở docs/update-extra.json đồng bộ public/data/updates.json; mục country-depth-achievements-893 mang released theo yêu cầu trực tiếp của chủ dự án, không phải bằng chứng đã upload. Các thay đổi bản địa hóa và sự nghiệp nhà nước có sẵn trước lượt này được giữ nguyên và kiểm tra riêng.

Kết quả cuối được bổ sung sau đóng gói. Không tính kiểm tra bị timeout là PASS. Chưa chạy toàn bộ 77 nhóm regression; một kiểm tra tỷ lệ kết hôn của mục 63 không đạt ở lượt lấy mẫu đầu (55% so với ngưỡng >60%). Không sửa ngưỡng để làm xanh test, chưa xác định nguyên nhân. Nhiệm vụ tổng thể 195 quốc gia vẫn đang triển khai; artifact là Preview/chưa nghiệm thu toàn diện.

### Kết quả đã thực hiện

- country-depth-achievements: **1.195** kiểm tra PASS, seed cố định 195; gồm chống giả lễ VN cho mọi nước, điều kiện tuổi, đổi nơi cư trú giữa sự kiện, ba năm lễ khác nhau, công thức học/thất bại/thử lại/lưu-tải, đường kích hoạt năm thực tế của FI/GH/IE, 16 thị trường bóng đá và không tính dự bị/trận đội tuyển thành trận CLB.
- world-culture173: **854** PASS; football-career: **180** PASS; country-survival: **273** PASS (12 debut/12 bị loại); world120: **74** PASS; state-career174 có sẵn: **50** PASS.
- Smoke **11/11** PASS; saves **10/10**, save-safety **10/10**, NPC **14/14** PASS. Cảnh báo đã biết: giờ thật khiến life.id khác dù cùng seed; save giữ id nên không đồng nghĩa lỗi lưu/tải.
- Regression nhóm 0–4 sau sửa khóa cache: **8.775 PASS, 0 lỗi**. Lượt 0–4,61–65,70–72 trước đó: 9.102 PASS, 11 assertion lỗi (10 tham chiếu/cache đã sửa, 1 tỷ lệ hôn nhân chưa giải quyết). Không coi toàn bộ lượt đó đạt.
- Nhóm 61,62,64,65,70–72 chạy lại trên mã cuối: **217 PASS, 0 lỗi**. Tổng cộng 12 nhóm đã đạt trên mã cuối; nhóm 63 còn kết quả không đạt từ lượt đầu, 64 nhóm khác chưa chạy.
- Chrome thật trên dist cuối: browser-country-depth-achievements **26** PASS ở 390/1280px; học bằng nút UI và lưu công thức, dùng công thức năm sau, bảng thành tựu, nhãn Đã phát hành, tìm không dấu/lọc/tải thêm, không tràn ngang/lỗi JS. browser-football **32** PASS; browser-country-survival PASS ở hai kích thước. Chrome cần quyền kết nối DevTools ngoài sandbox; lần chạy sandbox bị timeout không tính PASS.
- update-release **379** PASS. Đối chiếu dữ liệu nhúng updates.html bằng JSON dist; mục mới đứng đầu và released, toàn bộ mục cũ trong hai file giữ nguyên. Công cụ đóng gói đọc lại cả ZIP, so toàn bộ tên và SHA-256 từng entry với dist.
- npm run package:cloudflare bản cuối: **PASS**, 28 file, ZIP **2.578.610 byte**, SHA-256 **324FFC8851CDFA2BEA1805B4DA3FACDFFDA74BDE0E5E6CB7810934D694146858**. Loading PASS với 8 cuộc đời nguồn/bundle giống nhau; API/admin local PASS (1.644 mục). Giữ _worker.js/_routes.json/_headers/.well-known, không chứa binding hay D1.
- GitHub đã xác minh mercyx03/motdoi là public, quyền admin/push, origin HTTPS, nhánh codex/life-context-upgrade trỏ a41a8e5 trước sửa; checkout không có .github/workflows, tài liệu quy định Direct Upload bằng Dashboard. Không chạy deploy, không đổi cấu hình Cloudflare. REVIEWS_DB thực tế chưa kiểm chứng.
- Mốc khôi phục: a41a8e5790c34f0333b3b07f7ab36d3768afc744. Tạo checkout riêng tại mốc này, package lại và chủ dự án tự upload nếu cần; không reset/force-push hay xóa thay đổi cục bộ được bảo vệ.

## Hướng tiếp tục đã ghi tại mốc 8.9.3

Batch tiếp theo phải chọn một nhóm nước từ inventory, nghiên cứu giáo dục/lễ/hôn nhân/ẩm thực/lao động/đời sống riêng và tích hợp qua cơ chế sẵn có. Ưu tiên hoàn thiện sáu lĩnh vực cho FI/GH/IE/NZ trước khi mở rộng; kiểm tra tên kỳ thi theo thời gian, luật có năm hiệu lực, quyền bang/tỉnh và cộng đồng. Sau đó tiếp tục các nước regional, tránh phát sinh hồ sơ rỗng hoặc regional đổi tên. GĐ6 chạy 77 nhóm đầy đủ trên mã cuối và điều tra tỷ lệ kết hôn trước khi nghiệm thu Production.

## Danh sách đường dẫn trong commit tích hợp 8.9.3

- dist.zip
- docs/BACKLOG.md
- docs/COUNTRY-DEEP-COVERAGE-REPORT.md
- docs/country-depth-baseline.json
- docs/country-depth-inventory.json
- docs/culture-sources.md
- docs/update-extra.json
- docs/world-events-sources.md
- public/data/updates.json
- public/index.html
- public/js/careers.js
- public/js/childhood.js
- public/js/engine.js
- public/js/expansion.js
- public/js/football.js
- public/js/leisure.js
- public/js/life106.js
- public/js/life111.js
- public/js/life122.js
- public/js/life123.js
- public/js/life125.js
- public/js/life129.js
- public/js/life138.js
- public/js/life148.js
- public/js/life157.js
- public/js/life172.js
- public/js/life173.js
- public/js/life174.js
- public/js/life3.js
- public/js/life52.js
- public/js/life78.js
- public/js/life84.js
- public/js/scenarios.js
- tests/browser-country-depth-achievements.js
- tests/country-depth-achievements.js
- tests/state-career174.js
- tests/world-culture173.js
- tools/audit-country-depth.js
