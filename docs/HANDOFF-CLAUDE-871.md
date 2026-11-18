> Cập nhật12/11/2026: nhóm góp ý người chơi72 và hồ sơ J.D./MD đã được triển khai tiếp; xem PLAYER-FEEDBACK-872.md và cuối BACKLOG.md để biết kiểm thử, giới hạn và artifact hiện tại. Snapshot dưới vẫn giữ các nhóm dữ liệu rộng chưa hoàn tất.

> Cập nhật 12/11/2026: chủ dự án đã yêu cầu tiếp tục. dist/dist.zip hiện là Preview8.10.71 mới (3511204byte), quick và school-context871 đã đạt; xem cuối BACKLOG.md. Nội dung dưới là snapshot bàn giao11/11, các câu artifact cũ/chưa build đã được mốc mới thay thế. Phạm vi toàn BACKLOG vẫn chưa xong.

# Bàn giao cho Claude — Một Đời, phần tiếp sau 8.10.70

Cập nhật lúc 13:39 ngày 11/11/2026, UTC+7. Chủ dự án yêu cầu ghi bàn giao và chuyển sang Claude; dừng triển khai tính năng mới tại đây.

## 1. Phạm vi người dùng đã giao

Hoàn thành toàn bộ mục TRIỂN KHAI còn mở trong docs/BACKLOG.md, thay dữ liệu/tên tự đặt bằng dữ liệu thật có nguồn, sửa các nhóm test lỗi, kiểm thử trọng điểm, cuối cùng build dist và dist.zip mới để chủ dự án upload. Không dừng sau từng mục nhỏ. BỎ QUA nghiệm thu toàn diện/full regression; KHÔNG bỏ các phần chức năng/dữ liệu còn thiếu bằng cách chuyển chúng sang GĐ6.

Yêu cầu trước đó gồm: nội dung đúng nơi cư trú/gia đình ở mọi quốc gia; hoàng gia/nhiều thế hệ/tước/tên/kế vị; trường/ngành thật; NaN% người kế nghiệp; nhật ký phát hành. Không chỉ xóa chữ “mô phỏng” rồi gọi xác suất, học phí hoặc luật tự đặt là dữ liệu thật. Nhân vật và kết quả cuộc đời vẫn là gameplay, không phải đời thật của người mang tên đó.

**TRẠNG THÁI: CHƯA HOÀN THÀNH TOÀN BỘ BACKLOG. Các thay đổi sau 8.10.70 còn ở working tree, chưa đóng gói, chưa commit/push.**

## 2. Workspace, Git, artifact và những file cần giữ

- Workspace: C:\Users\TTDVVL-PC\Desktop\motdoi\motdoi\motdoi\motdoi-main
- Shell: PowerShell. Node v24.20.0. Python trong PATH từng trỏ WindowsApps và không chạy được; dùng Node cho sửa file.
- Nhánh: codex/life-context-upgrade.
- HEAD: d6565f5 — feat: add verified UCL, VFF, Australian visa and FSCS references (8.10.70).
- Remote: origin https://github.com/mercyx03/motdoi.git.
- package.json và mục nhật ký đầu vẫn 8.10.70. Chưa thêm mục 8.10.71; hậu tố 871 của test/hàm chỉ là tên làm việc, không phải đã phát hành.
- dist.zip hiện là GÓI CŨ 8.10.70, 3,489,787 byte, sửa lúc 08:09:02 11/11/2026. dist/index.html lúc 08:08:52. SHA256 ZIP: 739021540FE06042B0391D958D16787C48B7F96E30DAEDEE38E22844ADF09AC7.
- dist.zip đã dirty từ trước công việc tiếp sau 8.10.70. Không suy ra nó chứa thay đổi mới chỉ vì git status có M.
- dist được ignore, dist.zip tracked. Không thay chính sách artifact.
- Đã xác minh remote công khai, quyền push/admin và không có workflow/hook/deployment ở lượt trước. CẦN xác minh lại ngay trước commit/push; không coi đây là kiểm tra quyền hiện thời.
- Không có tiến trình kiểm thử của lượt bàn giao còn chạy: quick và hai browser đã hoàn tất.

**Không sửa/xóa/stage/commit các file riêng có sẵn:** Claude.md, .local-state-review.txt, audit-world-520.json, các PROMPT*.md; public/js/healthsys919.js, tests/world-country-jobs832-browser.js, tests/healthsys-rx-cap.js. Đây không phải phần diff của đợt đang bàn giao. Gói build từ workspace sẽ bao gồm thay đổi y tế có sẵn; phải nói rõ khả năng tái dựng từ commit riêng.

Đọc AGENTS.md, Claude.md trước khi làm. Giữ CRLF ở file vốn CRLF; có một số file vốn LF. Không dùng git add .; stage từng đường dẫn. Không reset/checkout đè toàn working tree.

## 3. Đã triển khai trong workspace — phần nào và giới hạn

### A. Di chúc và bối cảnh giam giữ

File: public/js/life68.js, public/js/life150.js; tests/update551.js.

- Cùng cổng điều kiện WILL70 cho trình soạn di chúc cơ bản/chi tiết; chặn lưu/hủy từ card cũ khi bị cô lập, không thể tiếp cận thủ tục.
- Việt Nam từ 2017: có thể xin lịch xác nhận năm sau khi đang thụ án, tùy hoàn cảnh. Khoảng hẹn một năm là đơn vị thời gian game, không phải hạn pháp luật.
- Giữ di chúc cũ; không cấm mọi người bị giam một cách tuyệt đối.
- update551, assets912 đã đạt ở lượt triển khai trước trong đợt này.

### B. Bóng đá

File: public/js/football-data.js, public/js/football.js, tests/football897.js và ba test mới football-*-871.

- Toàn bộ 192 slot CLB/16 thị trường đã có tên thật và nguồn; giữ ID cũ, 192 tên khác nhau, không còn placeholder CLB.
- Hạng dưới gắn mùa tham chiếu. Mỗi nước/hạng có thể dùng mùa khác nhau; đây KHÔNG phải bộ đội hình chính thức của một mùa đồng nhất, không phải dữ liệu lịch sử mọi năm. Hạng cao DE/ES/MX có nguồn hiện hành nhưng chưa đầy đủ metadata mùa.
- Nguồn: liên đoàn/giải/CLB chính thức; riêng một số đội hạng ba Nam Phi dùng SABC. URL nằm cạnh bản ghi. Lương, sức mạnh, phí, kết quả thi đấu vẫn là gameplay, không phải giá/hợp đồng thực.
- Trao đổi đội lên/xuống hạng ở mô hình mùa rút gọn, giữ số đội và mã/hợp đồng; bảng mùa cũ giữ nguyên. Chặn tự động liên thông US/NZ/MX và ranh giới K2/K3 chưa đủ điều kiện.
- Đội tuyển các nước tiếp tục thi đấu độc lập khi nhân vật không được gọi, chấn thương hoặc giải nghệ; không tặng caps/cúp cá nhân.
- Hợp đồng tài trợ: đề nghị, thương lượng một lần, độc quyền nhóm hàng, nhiệm vụ quảng bá, trả tiền một lần, chấm dứt, tất toán khi giải nghệ/hết hợp đồng. Nhãn theo nhóm hàng, không gán hợp đồng giả cho thương hiệu thật.
- CÒN: lịch/luật thực tế từng giải/mùa, các hạn chế lên hạng, FIFA/đổi đội tuyển và quốc tịch kép; chưa hoàn thiện mọi mục bóng đá.

### C. Khóa tiếng → đại học tại chỗ

File: public/js/md4b919.js, public/js/abroad-depth.js, public/js/life107.js, public/js/fix920.js; tests/study-onshore871.js.

- Giữ nơi ở và tiền tệ khi xét đại học tại nước đang học tiếng; không quy đổi tiền hai lần.
- Giữ nơi ở gốc qua onshore920/home920/q.save. Rút, bị từ chối hoặc thư/visa hết hạn trả đúng nơi và hoàn khoản học phí chưa dùng.
- Sửa đường hết hạn khi hook visa chạy trước hook khóa tiếng.
- Giữ thông tin PhD qua bước STUDY_ENTRY900, không xóa offer quá sớm.
- CÒN: quy tắc di trú/đổi diện thực tế theo từng nước và thời kỳ, không coi cùng một workflow là luật chung thật.

### D. Cửa hàng bạn đời và tài chính

File: public/js/kin920.js, public/js/life165.js, public/js/life163.js; tests/partner-shop871.js.

- Cửa hàng đi qua BUSINESS123/BUSINESS133/TREASURY165, giữ company871. Góp vốn giữ 50%/50%; cho vay không tặng cổ phần người chơi, bạn đời giữ 100%.
- Vốn trừ một lần; cổ tức dùng sổ doanh nghiệp chung, không sinh thêm lương/lãi song song. Cổ tức cho người sống chung được ghi đúng sổ tiền riêng.
- Trả vốn từ savings158 thực có qua RELATIVE163, receipt theo công ty/năm, không trả hai lần. Quy đổi cap/val/owed khi đổi tiền tệ.
- Cửa hàng legacy nâng thành công ty một lần, không thu lại vốn.
- Bổ sung cuối lượt: hiển thị nợ cửa hàng trong tổng nợ cá nhân; đóng cửa hàng không xóa khoản vay, cửa hàng cũ đã đóng không bị mở lại chỉ để trả nợ. Không nhập khoản này vào debt158 gây tự trả hai lần.
- Sau trả vốn cập nhật số dư/nợ/dòng trả nợ của báo cáo người thân trong năm nếu đã có báo cáo.
- CÒN CẦN RÀ: ly hôn/đổi bạn đời, qua đời/chuyển thế hệ, chuyển chủ nợ, khoản phải thu của người chơi trong net worth/di sản. Hiện khoản vay ở shop920 của bạn đời; đừng coi tích hợp kế toán/thừa kế đã hoàn chỉnh. Đoạn cập nhật báo cáo năm được thêm sau lần partner-shop871 đạt16; cần chạy lại và thêm ca có báo cáo năm nếu sửa tiếp.

### E. Công nhận bằng chuyên môn

File: public/js/md4b919.js; tests/md4b-919.js, tests/professional-qualification871.js.

- Điều dưỡng/giáo viên kiểm ngành/bằng tương ứng; không dùng bằng bất kỳ hoặc nghề bác sĩ để thay bằng điều dưỡng.
- Hồ sơ partial/adapt cũ thiếu điều kiện không tự hoàn tất; hồ sơ đã done giữ nguyên.
- CÒN: chi tiết quy định công nhận bằng/đăng ký nghề của từng nước và mốc thời gian.

### F. Tây Ban Nha — đổi thứ tự họ nhóm anh chị em

File: public/js/spain862.js; tests/spain-surname871.js.

- Chuyển tiếp từ 06/02/2000: nhóm trẻ cùng hai cha mẹ đã xác minh, đồng thuận cha mẹ, ghi ý kiến trẻ, nộp rồi có quyết định ở năm sau.
- Giữ tên cũ/lịch sử, không thay kế vị hoặc con khác cha/mẹ. Anh/chị đã trưởng thành không chặn nhóm trẻ; không chọn chính người trưởng thành làm target của thủ tục trẻ.
- Không coi im lặng hành chính là chấp thuận. Kết quả xử lý trong game không phải quyền phủ quyết pháp lý của trẻ.
- CÒN: các thời kỳ/ngoại lệ ngoài phạm vi, mapping case ID khi chuyển thế hệ; kiểm thực tế độ trưởng thành khi lấy ý kiến.

### G. Trường/ngành thật và điều kiện bằng trước

File: public/js/life67.js, public/js/institutions867.js, public/js/life102.js, public/js/life111.js, public/js/royal847.js; tests/courses871.js, courses871-browser.js, player107.js.

- COURSE_REFERENCES871 có danh mục đã đối chiếu cho HUS, UIT, UET, HCMUS, HUST, Y Dược Huế; chỉ một tập chương trình hỗ trợ trong game, KHÔNG nói đã liệt kê toàn trường.
- Trả metadata nguồn/năm, hiện trong menu. HUST không còn gán Kỹ thuật phần mềm theo danh mục nhóm chung; HUS dùng Khoa học máy tính và thông tin. Huế thêm Dược học/Y học cổ truyền/Răng-Hàm-Mặt vào các track có sẵn.
- Nguyện vọng tên ngành cũ sai trường bị yêu cầu chọn lại; giữ danh sách, chưa thu tiền/chưa nhập học. Card cũ dùng cùng key nhưng khác tên không âm thầm chọn ngành mới.
- Không đổi bằng đã tốt nghiệp. Named medical track tiếp tục dùng cùng trường, đúng nhóm điều dưỡng/dược/y dự phòng…
- Harvard/Stanford/UCLA MD/J.D. kiểm edu>=5 (đã hoàn thành cử nhân), không nhận thẳng từ THPT/cao đẳng. Chuyển thông tin nguyện vọng qua entryReason ở xét tuyển và dự báo, bỏ NV thiếu điều kiện nhưng vẫn xét NV sau.
- Đây MỚI LÀ cổng bằng trước. CHƯA hoàn thiện MD/J.D. graduate: môn tiên quyết, MCAT/LSAT/GRE, số lần nộp, transcript, trường cấp bằng, thời lượng/bằng chuyên nghiệp, residency/giấy phép hành nghề, bằng cũ sau học lần hai. Luồng nội địa vẫn có thể áp thời lượng/chế độ uni chung; phải làm tiếp, không công bố xong lộ trình Mỹ.
- life107 du học hiện đã loại med khỏi field picker/application; đừng suy ra nó đang cấp MD. law còn là nhóm chung ở nhiều trường, cần rà chương trình thật.
- CÒN: chương trình thật toàn danh mục, điểm/học phí đúng kỳ, fallback trường công lập ở life67 và sau đại học life106, majors generic theo nhóm, văn bằng/điều kiện/tín chỉ từng cơ sở. Không chỉ đổi tên trường giả thành trường thật rồi giữ ngành bất kỳ.
- player107: fixture dùng đúng chương trình HUST mới; đặt tiếng Pháp trước xét hồ sơ; assertion không đủ tiền kiểm không có self/scholar nhưng vẫn có cancel/domestic (đường trong nước đã có), không hạ kiểm tra chống thu tiền.

### H. Sự kiện trường học — thay đổi mới nhất trước bàn giao

File: public/js/school920.js, public/js/app.js; tests/school871-browser.js.

- Sửa bảng bổ sung ghi đè p=0 thành0.55 tại KR. Profile cache cũ p=0 được tắt prom khi đọc; không sửa các dòng nhật ký đã xảy ra.
- Norijada Croatia sửa từ “100 ngày trước” thành ngày học cuối của khối cuối, có nguồn trường Dubrovnik. Nguồn FI bổ sung xác nhận học sinh năm2/lịch theo địa phương.
- HR/IT/KR/CN/BE dùng format gathering cho các buổi chia tay/ghi lời nhắn: không buộc mua/mượn lễ phục, không bắt chọn bạn đi cùng hoặc tập khiêu vũ, lời tham dự không kể thành dạ vũ.
- Bỏ mặc định mọi nước đều đi ăn khuya sau tiệc.
- Chuỗi school920 tự mở bước tiếp sau đăng ký/trang phục/bạn đi cùng/chuẩn bị; không bắt mở lại hành động mỗi bước. Hoàn thành/rút thì dừng, không tính phí/thưởng lại.
- Hai minh họa vector inline cho kỷ yếu/tiệc trong module sẵn có, hiển thị bằng hook ở app.js; không thêm file ảnh ngoài allowlist build, không gọi nguồn ngoài. Đây là hình minh họa, không phải ảnh người thật. Tập hợp dùng hình trang trí trung tính.
- Browser thật headless đã chạy trọn prom/yearbook/gathering ở390/1280, lưu/tải sau tham dự, một ký ức, không lỗiJS/tràn; đã xem ảnh kỷ yếu390.
- CÒN CẦN RÀ NGAY: thêm test engine riêng cho KR p=0, cache/bản lưu/sự kiện KR đã lên lịch, stale card đổi trường/quốc gia. Test browser mới kiểm US/HR, chưa kiểm KR. md5-920 đạt118 sau thêm continuation/art; phần gói cuối và quick chưa chạy SAU thay đổi school/app cuối này.

### I. Tham chiếu/lỗi test khác

- global919.js: Singapore quốc tịch sửa tham chiếu Hiến pháp Điều121, hướng dẫn ICA cho trẻ sinh ngoài nước; chưa phủ luật mọi thời kỳ.
- browser-country-minimum-content.js: tìm đúng mục lịch sử8.9.4 đã phát hành thay vì bắt nó đứng đầu. 14quốc gia ở390/1280 đã đạt lượt trước.
- Bảy nhóm test từng báo lỗi đã chạy lại trong lượt này và đều PASS (xem dưới).

## 4. Kết quả kiểm thử thực tế và ranh giới

### Vừa chạy trong lượt bàn giao

- courses871:40; institutions867:804; education-fallback-graduation:104; exam-model:565, n=96000/48nhóm; player107:84; university136:PASS.
- courses871-browser:10 lựa chọn/lưu-tải ở390/1280, 5trường; không JS error/tràn ngang.
- partner-shop871:16; relative-finance163:25. Lưu ý đoạn cập nhật báo cáo năm thêm sau lượt16 như mụcD.
- md5-920:118 sau thay đổi artwork/continuation.
- school871-browser:6 chuỗi hoàn chỉnh prom/kỷ yếu/gathering ở390/1280; hoàn thành, reload, không nhân đôi ký ức. Đây là kiểm tra cuối cùng, exit0.
- 7nhóm cũ: depth899557, origins-clubs904PASS, life13840, continuity101361, study829PASS, school-home-police838PASS, football-payroll901PASS.
- npm run test:quick: smoke11, saves10, save-safety10, NPC14 — tất cả PASS, exit0. Đã chạy SAU sửa giáo dục/nợ cửa hàng, nhưng TRƯỚC sửa school920/app cuối lượt.
- Cảnh báo quick đã biết: createLife dùng Date.now/random cho ID khiến seed đời mới không giống hệt; vài card hc_story đã bị loại ở phiên bản cũ. Không giấu cảnh báo, không tính full regression đã đạt.

### Đạt ở các lượt trước của working tree đang bàn giao

- football-reference871132, football-world87111, football-sponsors87114, football897 và payroll901.
- study-onshore87117, professional-qualification8716, spain-surname87116.
- md4b-919133; treasury-deals165-166123; business13329; update551/assets912; một số royal865/royal866 ở sổ tiến độ cũ.
- Không hiểu các kết quả này là kiểm thử toàn bộ mã cuối sau mọi chỉnh sửa.

### Chưa chạy/chưa xác minh

- Chưa full regression/nghiệm thu toàn diện, theo yêu cầu người dùng.
- Chưa browser nguồn/dist cho mọi menu mới (tài trợ, đội tuyển, đổi họ nhóm…), chưa thiết bị thật/bản lưu người báo lỗi.
- Chưa package/loading/admin-events cho diff mới; chưa đối chiếu ZIP mới vì chưa build.
- Chưa kiểm binding Pages REVIEWS_DB Production; không ghi production/D1.

Ảnh browser trong .cache/courses871-*.png, .cache/school871-*.png. Không commit cache.

## 5. Những nhóm còn mở — không được đánh dấu xong

Đọc sổ hiện hành và phân biệt ghi chú lịch sử đã được bản sau xử lý. Không coi toàn bộ câu “còn” trong lịch sử là bug hiện tại, nhưng cũng không chuyển triển khai còn thiếu thành nghiệm thu để đóng việc.

1. Dữ liệu giáo dục: chương trình/tuyển sinh/học phí/điểm từng trường và kỳ; MD/J.D.; các cơ sở fallback; 76vùng học tại nhà mới có cấu hình cơ bản, còn nghĩa vụ/ngoại lệ/hạn/tuổi/giáo viên/văn bằng; tín chỉ/chương trình từng nơi nhận.
2. 195quốc gia: 187hồ sơ compiled-912 chưa đối chiếu từng mệnh đề luật lao động/kết hôn/ngày lễ; nhiều chuyện dựng theo mẫu. Không coi URL tồn tại là xác minh nội dung. Rà toàn game theo nơi sống/gia đình/thời kỳ, không chỉ tuổi5 hay UK.
3. Tài chính/y tế/di trú: ngân hàng ngoài dữ liệuVN, học phí/y tế22điểm đến, miễn thị thực, cư trú/phúc lợi/quốc tịch theo từng nước/thời kỳ, chi phí thật. Các tham chiếu CEC/CCB/189/Graduate/UC/FDIC/FSCS trước đây không đồng nghĩa workflow toàn diện.
4. Hoàng giaGB/BE/SE/DK/NL/LU: ngoại lệ thời kỳ/cá nhân/sắc lệnh, truyền tước và phối ngẫu. Monaco1882/trước2002 và hộ tịch/tước cá nhân. Spaintrước1978/1987, tước địa danh, ngoại lệ chuyển tiếp. Không áp luật hiện tại ngược lịch sử.
5. Bóng đá: luật và lịch thật theo giải/mùa, FIFA/đổi đội tuyển, ngoại lệ thị trường, dữ liệu tiền bạc/giải đấu chưa phủ.
6. Gameplay còn giản lược: ly hôn trong tù theo từng nước; ngoại tình phía người chơi life107/108 còn hệ cũ; các chuyển tiếp cửa hàng/nợ/chủ nợ ở mụcD; một số hệ quả/balance sự kiện quốc gia/hoàng gia dài hạn.
7. Các khoản thuế/phí/chi phí kinh doanh/xe điện sau2027, nguồn đang thứ cấp trong sổ MD4/UPGRADE912 cần rà. Không đưa con số cân bằng game thành báo giá pháp luật.
8. Bộ kiểm kê từ “mô phỏng/hư cấu/tham số” vẫn chưa rà hết. Có bản .cache/reference-audit866.json (104file/369dòng ứng viên ở thời điểm đó), không phải 369lỗi đã xác minh; công cụ tools/audit-reference-data.js (kiểm tên file bằng rg trước khi chạy).
9. Trước hoàn tất còn nhật ký người chơi, version mới, test trọng điểm cuối, build, ZIP, Git. Đây chưa được thực hiện cho diff này.

Sổ cần đọc: docs/BACKLOG.md; docs/REFERENCE-866-PROGRESS.md; docs/REMAINING-863-PROGRESS.md; docs/ROYAL-858-PROGRESS.md; docs/ROYAL-865-PROGRESS.md; docs/MONACO-861-PROGRESS.md; docs/SPAIN-862-PROGRESS.md; docs/HOMESCHOOL-ENGLAND-PROGRESS.md; docs/MD4-SOURCES.md; docs/MD5-SOURCES.md; docs/UPGRADE-912-PROGRESS.md; COUNTRY-DEEP-COVERAGE-REPORT.md và country-depth-inventory.json (tìm đúng vị trí bằng rg).

## 6. Thứ tự tiếp nhận đề nghị

1. Đọc hướng dẫn + git diff, không checkout/reset mất việc. Chạy nhanh courses871/partner-shop871/md5-920 và thêm ca KR/cache/stale của mụcH. Rà tiếp các integration chưa chốt (đừng bắt đầu lại những phần đã có).
2. Lập bảng hiện trạng từng mục triển khai của BACKLOG, đối chiếu sổ theo phiên bản; giải quyết toàn phạm vi còn mở, không chỉ sửa vài tên rồi chốt bản.
3. Chạy các test chuyên đề thật sự bị ảnh hưởng, quick/save-safety/NPC và browser hẹp/rộng. Không chạy full regression nếu chủ dự án chưa đổi yêu cầu.
4. Khi chốt: đọc docs/UPDATE-NOTES-POLICY.md và docs/CLOUDFLARE-PACKAGING.md; thêm nhật ký bền vững docs/update-extra.json và đồng bộ public/data/updates.json, bảo toàn lịch sử. Mục mới packaged, releasedAt=null; các yêu cầu đánh dấu phát hành bản cũ KHÔNG cho phép tự phát hành bản mới.
5. Chạy npm run package:cloudflare trên Windows (custom tools/build.js, không Vite); gói mới đủ dist/dist.zip, index.html ở gốcZIP, Worker/routes/headers/.well-known, đọc lại so tất cả tên/hash. Lệnh có backup/restore khi lỗi.
6. Xác minh branch/remote/privacy/quyền/deployment; stage đường dẫn cụ thể, commit/push nhánh hiện tại theo AGENTS. Không merge/forcepush/deploy. Chủ dự án upload Dashboard. Không gọi API ghi Production/D1.
7. Báo cáo tiếng Việt đúng mẫuAGENTS; chưa regression đầy đủ chỉ Preview/chưa nghiệm thu toàn diện, không tự gọi Production-ready. Nêu rõ build chứa thay đổi riêng có sẵn của workspace nếu vẫn giữ chúng.

## 7. Nguồn mới của lượt giáo dục/trường học

URL nằm trong source; các nguồn này chỉ hỗ trợ những trường/niên khóa/điều kiện đã đọc, không bảo chứng toàn bộ cơ chế game:

- HUS: https://tuyensinh.hus.vnu.edu.vn/dai-hoc
- UIT2025: https://student.uit.edu.vn/cqui/ctdt-khoa-2025
- UET2025: https://tuyensinh.uet.vnu.edu.vn/wp-content/images/Thong-tin-tuyen-sinh-DHCQ-nam-2025-QHI.pdf
- HCMUS2025: https://hcmus.edu.vn/chuong-trinh-dao-tao-trinh-do-dai-hoc-khoa-2025/
- HUST2026: https://hust.edu.vn/uploads/sys/tuyen-sinh/2026_05/danh-muc-chuong-trinh-dao-tao-2026.pdf
- Huế2026: https://huemed-univ.edu.vn/uploads/Thongbao/TTTS2026N5_988.pdf — phần học phí trỏ thông báo riêng, không có số hoàn chỉnh để tự điền.
- HMS: https://hms.harvard.edu/education-admissions/md-program/admissions/preparing-apply/eligibility — bachelor+3nămcollege, môn tiên quyết, giới hạn2lần, không nhận đã từng matriculate trườngY khác; điều kiện quốc tế riêng.
- StanfordMD: https://med.stanford.edu/md-admissions/academic-requirements.html — bachelor/tương đương, điều kiện học trực tiếpUS/CA/UK với bằng ngoài, MCAT theo kỳ; KHÔNG yêu cầu một danh sách môn bắt buộc cứng nhưHarvard.
- UCLAMD: https://medschool.ucla.edu/education/md-education/admissions/preparing-to-apply — bằng từUS/Canada; chưa nối kiểm nguồn bằng trong game.
- HarvardJD: https://hls.harvard.edu/jdadmissions/apply-to-harvard-law-school/jdapplicants/
- StanfordJD: https://law.stanford.edu/apply/how-to-apply/jd-application-process/
- UCLAJD: https://law.ucla.edu/admissions/jd-admissions/frequently-asked-questions
- FI: https://jamsa.fi/ajankohtaista/tiedotteet/jamsan-lukion-penkkarit-ja-vanhojen-tanssit/
- HR: https://pomorska-dubrovnik.hr/upload/dokument_1752054506.pdf (kế hoạch trường2024/25, Norijada ngày học cuối).

## 8. File thay đổi của đợt này để rà trước stage

Đã sửa: docs/BACKLOG.md; public/js/abroad-depth.js, app.js, fix920.js, football-data.js, football.js, global919.js, institutions867.js, kin920.js, life102.js, life107.js, life111.js, life150.js, life163.js, life165.js, life67.js, life68.js, md4b919.js, royal847.js, school920.js, spain862.js; tests/browser-country-minimum-content.js, football897.js, md4b-919.js, player107.js, update551.js.

Test mới chưa tracked: tests/courses871.js, courses871-browser.js, football-reference871.js, football-sponsors871.js, football-world871.js, partner-shop871.js, professional-qualification871.js, school871-browser.js, spain-surname871.js, study-onshore871.js.

Tài liệu này cũng mới, chưa commit. Danh sách này không bao gồm các file riêng cần giữ ở mục2. Luôn kiểm git status/diff thực tế trước stage.

## 9. Trạng thái bàn giao theo mẫu dự án

**Mã nguồn:** nhánh codex/life-context-upgrade; HEADd6565f5; thay đổi mới chưa commit; chức năng/giới hạn xem mục3.

**Kiểm thử:** các kết quả ở mục4; còn kiểm mã cuối sau school920 và phạm vi chưa triển khai; full regression không chạy.

**GitHub:** commit mới chưa thực hiện; push chưa thực hiện; không có nhánh mới đã push trong đợt này.

**Cloudflare build:** chưa chạy cho diff mới. dist/dist.zip là8.10.70cũ, không phải artifact của phần bàn giao. Chưa có tổng file/ZIPhash của bản mới. BindingREVIEWS_DB chưa kiểm chứng. Sẵn sàng upload Production cho diff mới: CHƯA.

**Khôi phục:** HEADd6565f5 là nền mã trước diff; không dùng reset để khôi phục khi có thay đổi riêng. Muốn quay lại, sao lưu working tree rồi xử lý từng diff đã xác minh; sau khi có commit mới thì dùng git revert và package lại, chủ dự án tự upload. Không forcepush, không tự thay Production.
