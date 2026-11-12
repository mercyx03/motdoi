# Backlog sau nghiệm thu GĐ2.5

## Điều kiện thực tế để lập di chúc (`di_chuc70`)

Trạng thái: chủ dự án yêu cầu ngày 26/10/2026; **đã triển khai trong workspace**, kiểm thử chuyên đề đạt, chờ gói chung. GĐ2.5 tiếp tục kiểm theo hành vi và ngoại lệ hiện tại.

Mục tiêu: nhân vật bị giam giữ, bị kiểm soát hoặc không thể liên lạc và tiếp cận thủ tục cần thiết không được tự do lập di chúc như bình thường. Không cấm tuyệt đối mọi trường hợp giam giữ: nếu có điều kiện hợp pháp và thực tế thì vẫn có thể cho phép.

Trước khi triển khai cần khảo sát toàn bộ trạng thái giam giữ/kiểm soát đang có, đường mở hành động và hệ thống di chúc/thừa kế hiện hữu. Xây dựng điều kiện dựa trên hoàn cảnh, khả năng liên lạc và tiếp cận thủ tục; không chỉ chặn bằng một cờ đơn giản. Mở rộng cơ chế hiện có, tránh tạo hệ thống song song.

Nghiệm thu riêng cần có ca: tự do bình thường; bị cô lập/kiểm soát không liên lạc được; bị giam nhưng có điều kiện hợp pháp và thực tế; thay đổi hoàn cảnh qua năm; không làm mất di chúc đã có; tương thích bản lưu cũ. Chi tiết về thủ tục/pháp lý phải được kiểm chứng khi thiết kế, không tự suy diễn thành luật đã áp dụng trong game.

Chỉ bắt đầu khi chủ dự án giao đợt sửa này; không tự gộp vào GĐ3.

## GĐ6 — nghiệm thu tổng thể và regression đầy đủ (chuyển từ GĐ3)

- 8.10.63–65: còn regression toàn bộ trên mã cuối, thiết bị/save thật và xác minh binding Pages REVIEWS_DB. Đã chạy trọng điểm giáo dục, bối cảnh quốc tế, chuỗi hoàng gia, nhiếp chính/hộ tịch, smoke, saves/save-safety/NPC và browser hẹp/rộng; không coi phần chưa chạy là PASS. Công việc chức năng còn mở ở docs/REMAINING-863-PROGRESS.md vẫn đang được triển khai theo yêu cầu hiện tại, không chuyển thành riêng việc nghiệm thu GĐ6.

- 8.10.57: nghiệm thu toàn diện homeschool/England trên mã cuối; bổ sung luật còn unknown (38 bang/DC Mỹ, 11 tỉnh/lãnh thổ Canada, 6 vùng Australia, Northern Ireland), niên đại/ngoại lệ người dạy, văn bằng quốc tế và tuyển sinh từng cơ sở. Kiểm sự kiện trường học ở mọi module, NPC con và tổng giờ giám hộ qua nhiều con; trợ cấp theo tháng/ngày, hồ sơ credential thực tế và tín chỉ trường nhận. Nhóm regression 9,36,46,59 còn 98 lỗi/chưa phân loại hết (6.887.685 kiểm tra đạt); không coi nhóm này PASS. Rà lỗi cũ school-home-police838 (kỳ vọng chuyên nhưng công lập), tái hiện cả khi bỏ module mới. Chi tiết docs/HOMESCHOOL-ENGLAND-PROGRESS.md. Không tuyên bố khu vực chưa xác minh là đã nghiệm thu.

- 8.10.54: hồi quy đầy đủ trên mã cuối cho mô hình thi thống nhất; mô phỏng thế giới/tài chính dài hạn sau cân bằng ngưỡng, kiểm tra mọi trạng thái hỗ trợ và mọi nguyện vọng quốc tế. Đã kiểm trọng điểm theo docs/EXAM-REVIEW-PROGRESS.md; chưa nghiệm thu toàn diện, chỉ Preview. Kiểm chứng binding REVIEWS_DB thực tế và cấu hình deployment tự động trước Production.

- 8.10.53: regression toàn bộ trên mã cuối cho hệ thống Thi thử Cấp 2 vào Cấp 3 (Lớp 10) & Thi thử Đại học (ước lượng khoảng điểm thi, tỷ lệ đỗ từng trường/nguyện vọng, chẩn đoán tâm lý phòng thi `examApt` và cộng điểm thực chiến vào kỳ thi chính thức) (chuyển sang GĐ6 theo chiến lược kiểm thử GĐ4–GĐ5).

- 8.10.52: regression toàn bộ trên mã cuối cho thứ tự kế vị theo nhánh (cháu đích tôn/nữ đẩy chú/dì xuống ở cả chế độ bình đẳng giới lẫn ưu tiên nam giới) và hệ thống tước hiệu xứ sở của Thái tử/Thái nữ cùng bạn đời tại các hoàng gia châu Âu (chuyển sang GĐ6 theo chiến lược kiểm thử GĐ4–GĐ5).

- 8.10.51: regression toàn bộ trên mã cuối cho chương trình học Vương quốc Anh (GB) toàn vùng (England, Scotland, Wales, Northern Ireland) và hệ thống 10 Hoàng gia Châu Âu (tôn giáo, quyền kế vị, phủ quyết dự luật Công giáo của Thân vương Monaco, Đặc quyền màu trắng Vatican, Luật Gia tộc Liechtenstein, quy định tôn giáo con cái và hợp pháp hóa con ngoài giá thú sau sinh tại Monaco) (chuyển sang GĐ6 theo chiến lược kiểm thử GĐ4–GĐ5).

- 8.10.50: regression toàn bộ trên mã cuối cho Lễ Baek-il 100 ngày Hàn Quốc, kế vị nhiều thế hệ Tây Ban Nha, A-Level/IB Anh Quốc, hệ thống đam mê – năng khiếu – sở đoản và 16 nhóm MBTI (chuyển sang GĐ6 theo chiến lược kiểm thử GĐ4–GĐ5).

- 8.10.49: regression toàn bộ trên mã cuối cho hệ thống tôn giáo – đẳng cấp Varna – họ tên – hạn ngạch EWS 10% tại Ấn Độ và đời sống tín ngưỡng theo gia cảnh tại Việt Nam (chuyển sang GĐ6 theo chiến lược kiểm thử GĐ4–GĐ5).

- 8.10.30: regression tổng thể, kiểm chứng chính sách trợ cấp từng địa phương, đối chiếu thực hành mỗi giáo xứ và binding Pages.

- 8.10.29: regression toàn bộ, lịch trình từng vùng UK và các trường chuyên biệt, đối soát chuẩn xét hỗ trợ/vay thực tế, học sinh trao đổi trước đại học và nhiều điểm đến hơn.

- 8.10.28: còn regression toàn bộ, đối chiếu văn hóa từng trường/cộng đồng và kiểm chứng binding Pages.

- 8.10.27-showbiz: cần regression toàn bộ trên mã cuối, kiểm thử chiến dịch dài nhiều nhãn hàng/đổi nghề/qua đời và chuyển đời, các tình huống cực lớn hơn 50 hồ sơ; kiểm chứng binding REVIEWS_DB thực tế. Đã kiểm thử trọng điểm showbiz/câu hỏi/bồi thường, smoke và bản lưu; chỉ Preview, chưa nghiệm thu toàn diện.

### Phần tồn sau MD5 (8.10.24) — 03/11/2026

- **life138 (chặn nghiệm thu tổng thể):** lỗi cũ, lặp lại đúng assertion trên `c2a21cb` và `30152fc`. Chọn "Xem xét" ở `succession139` không chọn ngay người kế nghiệp vì family-dynasty 8.10.8 chuyển sang đề cử/bầu. Cần chủ dự án quyết định hành vi đúng; chưa sửa test, chưa nới assertion.
- **Browser (FIN-01):** 35/44 menu MD4–MD5 đã mở, bấm, lưu/tải ở 390px và 1280px. 9 menu chỉ kiểm được lý do khóa vì cần chuỗi sự kiện mới mở: bonds919, palliative919, function919, tempCare919, illCare919, sibCare919, adopt919, petHome919, directorOffers919. Chưa có kịch bản browser cho: chuỗi nhiều bước của prom (trang phục → bạn đi cùng → dự), hoàng gia tới đám cưới, `doubt920`/`truth920`, `goalAsk920`/`shopAsk920`. Chưa đo zoom 200%; mới đo tương phản chữ phụ (.muted) ở giao diện sáng.
- **Nguồn (FIN-02):** phần lớn bảng prom, lễ trưởng thành, quy tắc kế vị/chấp thuận hôn nhân, đổi diện tại chỗ (trừ Anh), quốc tịch con nuôi (trừ Đức) mới ở mức thứ cấp. Chưa rà lại học phí 22 nước, mức chi trả y tế, bảng miễn thị thực. Singapore: đã ghi theo ICA cho trẻ đăng ký quốc tịch; trẻ có quốc tịch từ khi sinh chưa đọc nguyên văn Hiến pháp. Mức hỗ trợ tiêu hủy là tham số.
- **Giản lược còn lại:**
  - Đổi diện tại chỗ khôi phục trạng thái "ở nước nhà" trong lúc xét visa đại học (không thu vé máy bay); bị từ chối thì ở lại trong nước.
  - Ly hôn khi thụ án dùng một quy trình chung cho mọi nước.
  - Nhà hoàng gia là hư cấu, chỉ Anh có danh mục tước chi tiết; các nước khác mới có kiểu kế vị và cơ quan chấp thuận ở mức tóm tắt.
  - Con của người chơi với thành viên hoàng gia được xếp vào cây kế vị; chưa có chuỗi tranh chấp kế vị nhiều năm.
  - Prom/kỷ yếu chưa có ảnh asset riêng.
  - Ngoại tình phía người chơi vẫn dùng các hệ cũ (life107/108).
  - Mục tiêu riêng "mở cửa hàng" của bạn đời là hồ sơ giản lược, chưa đi qua hệ doanh nghiệp BUSINESS123.
- Lịch sử MD4: xem các mục dưới.

### (Lịch sử) Phần tồn MD4 sau 8.10.23 — 02/11/2026

- Đã làm ở 8.10.23 các mục giản lược liệt kê ngay dưới (xem docs/UPGRADE-912-PROGRESS.md Đợt 13). Còn: ly thân khi ở tù không tự thành ly hôn pháp lý; khóa tiếng 1 năm không đổi diện tại chỗ; mức tiền y tế/hỗ trợ tiêu hủy/quy tắc quốc tịch con nuôi là tham số; regression đầy đủ 0–99 và test trình duyệt tự động vẫn chưa chạy.

### (Lịch sử) Phần tồn MD4 8.10.22-md4 — 02/11/2026

- Chưa làm/giản lược: nhận nuôi quốc tế có chuyển nước (chưa có luồng di cư cho trẻ vị thành niên); học tiếng 1 năm ở nước ngoài rồi chuyển diện; đặt họ con theo luật Đức mới chỉ ở mức lựa chọn; gia súc và bệnh gia súc (game chưa có chăn nuôi); cơ sở bảo trợ "chăm sóc tạm thời" khi cha mẹ còn quyền nuôi chưa là khởi đầu riêng; D10 mới có chuỗi người thân hỗ trợ/xa cách chung, chưa có chuỗi riêng cho người trong tù/bệnh dài hạn.
- Nguồn ở mức thứ cấp (docs/MD4-SOURCES.md): mốc 21 tuổi chọn quốc tịch Singapore, mức tiền y tế 2025 các nước, học phí 22 điểm đến, bảng miễn thị thực theo cặp hộ chiếu. Cần đọc nguyên văn trước khi nâng mức kiểm chứng.
- Cân bằng cần theo dõi: số người nổi tiếng ≥100 nghìn follower tăng (62 so với 38 trên 600 đời) vì bỏ hệ số phạt quy mô; tỷ lệ tình trạng bẩm sinh/sa sút trí tuệ/đột tử trẻ là tham số trò chơi.
- Chưa chạy: regression đầy đủ mục 0–99 trên mã 8.10.22; kiểm thử trình duyệt các menu mới trên điện thoại/máy tính (mới kiểm bằng engine headless).

### Phần tồn MD1 8.10.17-md1 — 01/11/2026

- §13: 187 hồ sơ quốc gia `compiled-912` mới chỉ kiểm URL nguồn tồn tại/đúng nước (561/748); cần đối chiếu từng câu (luật lao động, độ tuổi kết hôn, ngày lễ) với trang nguồn và nâng `confidence` khi đã xác minh. 187 URL trang quốc gia UNESCO chưa kiểm được vì máy chủ ngắt kết nối — chạy lại `node tools/country-sources-912.js --check --retry --only=culture` vào lúc khác (tuần tự, có nghỉ, không đổi User-Agent). Câu chuyện nhiều năm của 187 nước dựng theo mẫu; có thể viết tay dần theo nước có nhiều người chơi.
- `tests/browser-country-minimum-content.js` (đã thêm TH, KE, BR, DE, SA, FJ): toàn bộ kiểm tra gameplay đạt; assertion cuối đòi mục nhật ký mới nhất là bản "8 quốc gia" đã lỗi thời từ khi có các bản 8.10.x — cần chủ dự án quyết định cách kiểm mới (không tự nới).
- Test hỏng sẵn, đã kiểm trên cả HEAD 30eceed và mã 8.10.17 (cùng assertion): `update451`, `update453`, `update454` (kỳ vọng cũ về khóa cache theo phiên bản chung, nay dùng khóa theo module); `update460` (hành vi đúng — không tính phí, không áp sang con khác — nhưng so sánh JSON toàn bộ con nên vỡ khi module sau tự thêm `uid110`/`blood909`); `life138` (test đòi "Xem xét" chọn ngay anh chị em, trong khi `family-dynasty.js` 8.10.8 cố ý chuyển sang đề cử/bầu năm sau); `football-payroll901` ("contract survives health and sporting reductions" — chưa điều tra, ngoài phạm vi MD1); `blood910-browser` (đòi nhật ký mới nhất là 8.10.10). Không sửa assertion trong đợt này.
- Chưa tái hiện: anh chị em "tên nam nhưng ghi em gái" (seed 777001 cũ); quét 760 đời và 12 chuỗi 4 thế hệ không có ca lệch giới tính.
- §12/§11 mới là tham số gameplay; chưa có Monte Carlo toàn đời cho tỷ lệ khủng hoảng lãnh đạo theo nghề và tuổi thọ người bệnh thận/gan theo quốc gia.
- Phần B/C (8.10.20): B1–B8 và C1–C11 đã có cơ chế (bảng đối chiếu ở docs/UPGRADE-912-PROGRESS.md Đợt 11). Còn giản lược: lãi suất/tỷ giá mới hiển thị (không đổi khoản vay cũ theo nguyên tắc giữ hợp đồng danh nghĩa); thí điểm chính sách tỉnh chỉ tác động người sống trong tỉnh; khóa bán nhà ở xã hội xử lý sau giao dịch; doanh thu kinh doanh ước tính = 4 × lợi nhuận; lệ phí trước bạ ô tô điện sau 2027 là giả định; Monte Carlo theo kịch bản chưa làm riêng. Cần đọc nguyên văn các văn bản đang ở mức nguồn thứ cấp.
- **Đã sửa (8.10.20, theo quyết định của chủ dự án):** thứ tự thuế — trước đây life115 nén thu nhập sau khi đã tính thuế TNCN trên lương chưa nén. Nay tax-resident (và thuế kinh doanh ở welfare918) điều chỉnh thu nhập bền vững trước rồi mới tính thuế; engine không điều chỉnh lần hai; bảng Tài chính năm có dòng "Điều chỉnh thu nhập bền vững (cân bằng game)" và thực nhận đặt sau thuế. Người thu nhập cao nộp thuế ít hơn trước (ca thử: 5,65 → 1,73 triệu/tháng).
- **Đã sửa (8.10.21):** nhà ở xã hội — "Đổi nhà" và "Tặng nhà cho con" bị chặn trước khi đủ 5 năm (có lý do, không thu tiền); bán bắt buộc khi định cư nước ngoài vẫn xử lý sau giao dịch (khoản vay ưu đãi đến hạn ngay).
- **Đã sửa (8.10.21):** `tests/chains-gd4.js` — so sánh GĐ4 nay loại drama917 khỏi cả hai ngữ cảnh (drama917 có test riêng); 190 kiểm tra đạt.
- **Đã sửa (8.10.21):** "Sếp đổ lỗi" (cs_do_loi) chỉ xảy ra khi có cấp trên trực tiếp (E.hasBoss), kể cả tình huống đang chờ trong bản lưu.
- **Đã sửa (8.10.21):** `tests/blood910-updates.js` — bỏ giả định "mục 8.10.10 là mục mới nhất / tổng số mục = mốc cũ + 1"; vẫn kiểm mục 910 còn nguyên, đã phát hành, đồng bộ, và nội dung mọi mục cũ không đổi (chỉ cho phép sửa siêu dữ liệu phát hành).
- Bằng chứng phát hành 8.10.19: nhật ký ghi released theo yêu cầu trong chat trước khi upload; chưa có xác nhận upload thực tế trong repository.
- Regression mục 0–8 chạy lại trên mã 8.10.18 (01/11/2026): 272.734 đạt / 5 lỗi (cùng 5 loại đã phân loại). Chênh tuổi thọ/nợ so với HEAD trong regression (71,4/19,9% so với 72,3/16,8%) đã đo lại có kiểm soát bằng cùng script (3.000 đời VN seed 100000+i·7919, nợ trên 600 đời seed 88000+i): HEAD 71,89/17,7%, 8.10.18 trước sửa 71,69/17,6%, sau sửa 71,67/17,6% → nợ không tăng, tuổi thọ −0,2 năm do bệnh thận/gan; phần chênh còn lại là dao động giữa các lượt regression (ID đời theo giờ thật). Đã sửa thêm: chi phí theo dõi cơ bản không thu trùng với ngân sách y tế của engine; chi phí chuyên khoa giữ dự phòng 0,5 lần thu nhập cơ sở.
- Người chơi báo "chọn cuộc đời rồi không bấm được nút nào": chưa tái hiện trên mã nguồn và dist 8.10.17 (VN/thế giới, 1280/375 px, không lỗi JS). Cần trình duyệt/thiết bị, bản đang dùng, có tiếp tục bản lưu cũ không, ảnh màn hình.
- Regression "hơn 60% tình huống xuất hiện tự nhiên" (52,6%) do thêm 975 câu chuyện chỉ dành cho cư dân từng nước — chủ dự án quyết định có loại khỏi mẫu số không. "major từng xuất hiện" (HEAD 1/1.500) và trầm cảm sau sinh ở mẫu 250 đời là ngưỡng mong manh theo RNG. "Sự kiện sau khi qua đời" còn nguồn ngoài health915 chưa tìm (có cả ở HEAD).

### Di truyền nhóm máu và sau hiến 8.10.10 — 30/10/2026

Kiểm thử trọng điểm alen, bố mẹ sinh học/đổi bạn đời/con nuôi, Rh thai kỳ, chuyển đời, phản hồi sau hiến, tư vấn, lời mời thiếu máu và bạch cầu hạt; smoke/bản lưu và các hệ gia đình bị ảnh hưởng. Chưa chạy lại toàn bộ regression GĐ6 trên mã cuối; chưa kiểm chứng binding REVIEWS_DB Production. Phân bố vùng và xác suất sàng lọc/lời mời là tham số mô phỏng, D/d giản lược, không là công cụ tư vấn y khoa hoặc huyết thống. Cần mở rộng trong GĐ6 kiểm mọi lối sinh con/nhận nuôi và quy trình theo cơ sở, thuốc/chống chỉ định, anti-D và theo dõi chuyên khoa thực tế.

### Sửa lương cầu thủ 8.10.3 — 29/10/2026

Kiểm thử trọng điểm lương hợp đồng, tài chính cá nhân, bóng đá, sức khỏe, nghề nghiệp, smoke và bản lưu; rà soát tự động 40 đời. Chưa chạy toàn bộ regression trên mã cuối, chưa xác minh binding REVIEWS_DB Production. Artifact Preview; không tự bù lương các năm cũ vì không có lịch sử đủ tin cậy. Chờ nghiệm thu tổng thể GĐ6.

### Nội dung quốc gia 8.9.4-country-batch1

Mục tiêu 195 nước chưa hoàn tất. Tám nước FI/GH/IE/NZ/JP/FR/US/VN hiện có tối thiểu 3 giáo dục, 3 lễ, 3 cưới, 5 món, 5 lao động, 5 câu chuyện/nước; 187 mã còn lại ở country-depth-inventory.json. Cần nghiên cứu/biên tập và nối gameplay cho từng nước, không tự nhân bản regional. Có 40 chuỗi theo năm, NPC riêng, đối chiếu lao động, chặn tác động sai nước và dữ liệu luật trước mốc tham chiếu. Thông tin tham chiếu 2026 không bảo đảm luật ngoài đời tương lai; tiếp tục rà ngoại lệ và lịch sử chính sách. Chưa chạy đủ 77 nhóm regression trên mã 8.9.4; kiểm tra thống kê kết hôn mục 63 vẫn cần điều tra, không hạ ngưỡng. Đợt này là Preview/chưa nghiệm thu 195 nước; xem COUNTRY-DEEP-COVERAGE-REPORT.md.


### Batch quốc gia/thành tựu 8.9.3 — 28/10/2026

Nhiệm vụ chiều sâu 195 quốc gia còn đang triển khai: xem COUNTRY-DEEP-COVERAGE-REPORT.md và country-depth-inventory.json. Mới bổ sung ẩm thực FI/GH/IE, Matariki NZ, kiểm soát nơi cư trú và 149 thành tựu; chưa có nước nào được nghiệm thu đủ sáu lĩnh vực. Cần hoàn thiện nguồn, dữ liệu và năm sự kiện riêng/nước theo từng batch. Chưa chạy đầy đủ 77 nhóm hồi quy. Lượt chạy nhóm 0–4,61–65,70–72 phát hiện lỗi khóa cache (đã sửa) và kiểm tra thống kê hôn nhân mục 63 chưa đạt (55% so với >60%, chưa xác định nguyên nhân). Không tính nhóm đó PASS; cần điều tra trên mã cuối, không hạ ngưỡng. Binding REVIEWS_DB Production chưa kiểm chứng. Bản đóng gói lượt này vẫn Preview/chưa nghiệm thu tổng thể, dù mục nhật ký được chủ dự án yêu cầu ghi Đã phát hành.


Theo chiến lược chủ dự án ngày 26/10/2026: GĐ3 kết thúc ở trạng thái **HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN**. Các mục dưới đây **chưa chạy trên mã GĐ3** (gameplay `b3ada6f`), không được coi là PASS. GĐ4–GĐ5 bổ sung danh sách của mình vào mục này; GĐ6 chạy toàn bộ trên mã cuối.

- Regression `tests/regression.js` chưa chạy trên GĐ3: mục 5 (6.300 đời), 5b, 6, 13–16, 18, 20, 22–27, 29, 31–45, 47–51, 53–54, 56–58, 60–67, 70–74.
- Mục 9 đầy đủ 1.298 tình huống (manifest SHA-256 `3b1996364a8aefdf8f6d93548777013e1e04ea91271cbd9a60313437b81b278c`, không đổi so với GĐ2.5). GĐ3 chỉ chạy lọc đúng 50 ID có trọng số; 41/50 ID có phương án thực sự được thực thi. Nên chạy theo các nhóm 130/32 ID như GĐ2.5 (tổng khoảng 48 phút máy nếu tuần tự).
- Các bộ `npm run test:*` chuyên đề còn lại (update/family/business/social/university…) chưa chạy trên mã GĐ3, trừ context, smoke, saves, save-safety, NPC, updates.
- Kiểm thử trình duyệt toàn bộ game (không chỉ trang Cập nhật) và bản lưu thật của người chơi.
- Theo dõi cân bằng tài chính GĐ3: mẫu 60 đời cho thấy số đời âm tiền 8→11, 6→8, 5→8; cần mẫu lớn trước khi kết luận.
- Ghi chú rà soát GĐ3 (chưa sửa, không chặn): `E.CONTEXT143.probability` kẹp xác suất về tối đa 1 trước khi nhân hệ số độ khó sự kiện; với trigger có p gốc cao và hệ số >1, độ khó giảm sự kiện sẽ tác động từ mức đã kẹp. Chỉ ảnh hưởng 50 trigger có nhãn; đánh giá lại khi chạy phân bố đầy đủ.

### Bổ sung từ GĐ4 (chưa chạy, không tính PASS)

- Regression đầy đủ trên mã GĐ4: toàn bộ mục 0–75 + 5b và mục 9 đủ 1.313 tình huống (registry tăng 15 tình huống `ch144_*`). Mục 6 có ngưỡng "hơn 60% tình huống xuất hiện tự nhiên"; 15 tình huống chuỗi chỉ mở khi có sự kiện gốc nên tỷ lệ có thể giảm nhẹ — cần đo lại.
- GĐ4 đã chạy: mục 7, mục 68, mục 9 lọc 25 tình huống liên quan (24/25 có phương án được thực thi).
- Kiểm thử trình duyệt cho lựa chọn chuỗi trong giao diện chơi (popup, chế độ tự động, lưu giữa năm) chưa chạy; mới kiểm qua engine headless.
- Lỗi có từ trước, chưa sửa (cần chủ dự án quyết định vì bật lại nội dung): các cảnh hôn nhân life130 và `familyObjection130` không bao giờ xuất hiện từ trigger do `valid(l, {})` trả về false. Khi sửa, cân nhắc tần suất và có thể nối thêm làm gốc chuỗi hôn nhân/gia đình của GĐ4.

### Bổ sung từ GĐ5 (chưa chạy, không tính PASS)

- Regression đầy đủ trên mã GĐ5; mục 6 cần đo lại vì GĐ5 mở lại 11 tình huống và thay đổi nhịp.
- GĐ5 đã chạy: mục 7, 16, 30, mục 9 lọc 14 tình huống bị ảnh hưởng. Mục 30 lần đầu bắt `marriageMoney130` ×5 → đã hạ `max`.
- Đã sửa lỗi cảnh hôn nhân life130 / `familyObjection130` / `status129` / `map_mo101` / `casual101` / `public_scandal101` (xem PACE-GD5.md); mục ghi ở GĐ4 về lỗi này đã xử lý.
- Bấm giờ chế độ tự động và kiểm giao diện các cảnh vừa mở lại trên trình duyệt.
- Tỷ lệ có con: GĐ5 thấp hơn 1,9 điểm khi tắt điều tiết (trong sai số); đo lại với mẫu lớn.

## Sau GĐ6

### Đã xử lý trong GĐ6

- Các mục GĐ3–GĐ5 "chưa chạy" ở trên: regression đầy đủ đã chạy trên mã GĐ6 (xem ACCEPTANCE-GD6.md).
- Chế độ Tự động đứng chờ: sự kiện hệ thống (thời tiết, người đòi nợ, chuyển nơi ở, khoảnh khắc với con, đám cưới của con, con chia sẻ chuyện riêng, kết thúc du học…) bị gắn nhầm "người chơi tự mở"; bước nối tiếp của lựa chọn do AI chốt cũng bị gắn như vậy. Đổi Tự động khi đang có lựa chọn không có tác dụng.
- `familyObjection130` xuất hiện với vợ chồng đã cưới nhiều năm → chỉ còn với cặp chưa cưới.
- Ba bộ test module hỏng từ GĐ5 do bọc `ev.run` và ghi lịch sử khi lựa chọn không có tác dụng; `community` hỏng từ GĐ3 do cấm số phiên bản trong toàn bộ nhật ký.
- Regression lượt 2–3 bắt thêm: crash chuỗi hôn nhân GĐ4 khi bạn đời không còn; cờ học bổng lệch điểm thi lại; quy tắc AI của GĐ5 chặn việc tự chọn giúp ở chế độ thủ công; nhóm "đổi nghề" của GĐ5 làm giảm đổi hướng sự nghiệp ~45%. Đã sửa cả bốn.

### Còn lại

- Tỷ lệ AI có con thấp (đã ghi từ GĐ2.5) — hạng mục cân bằng gameplay, không thuộc GĐ6.
- `life.id` phụ thuộc giờ thật: cùng seed với giờ thật cho đời khác nhau (cảnh báo smoke) — không đổi cấu trúc ID trong GĐ6.
- Điều kiện lập di chúc theo hoàn cảnh (`di_chuc70`) — đã triển khai và kiểm thử, chờ gói chung.
- Danh sách nhóm chủ đề chống lặp (GĐ5) mới bao phủ các cụm đã thấy trong số liệu; mở rộng khi có thêm dữ liệu người chơi.
- Bấm giờ chế độ Tự động trên thiết bị người chơi thật; profiling giao diện điện thoại.
- Bản lưu thật của người chơi chưa có mẫu để kiểm (chỉ có bản lưu do máy tạo).
- 25 nâng cấp gameplay chuyên sâu: chưa bắt đầu, chờ chủ dự án giao.


## Sau GĐ6 — checkpoint logic cuộc sống 8.8.0-preview

Không mở lại nghiệm thu GĐ0–GĐ6. Yêu cầu A–E mới chưa hoàn tất: xem LIFE-CONTEXT-PROGRESS.md cho danh sách phạm vi còn thiếu. Trên mã cuối cần kiểm thử có mục tiêu: toàn bộ ngân sách/vòng đời người thân; quyền điều hành khác cổ phần, tặng/thừa kế không lặp qua nhiều đời; chi phí/định giá tập đoàn dài hạn; mọi nhánh ủy quyền và dừng hợp đồng truyền thông; thực tập sinh chuyển/rời công ty và hành trình quốc tế. Chưa tính các mục này là PASS. Regression toàn bộ 77 nhóm chưa chạy trên checkpoint (chủ dự án yêu cầu không chạy). Chưa xác minh Pages REVIEWS_DB thực tế; artifact chỉ Preview.

## GĐ6 / nghiệm thu cuối đợt A–E và quản trị doanh nghiệp 8.8.1
Checkpoint hợp đồng chỉ hoàn tất một phần mốc 1. Theo dõi toàn bộ phạm vi còn thiếu tại docs/ENTERPRISE-UPGRADE-PROGRESS.md và yêu cầu gốc ENTERPRISE-UPGRADE-REQUEST.md. Trên mã cuối cần kiểm toàn bộ tài chính người thân/không nhân đôi, nhượng quyền, báo cáo dòng tiền/nợ/cổ tức, chiến lược, nhân sự/CEO/CFO, thực tập 2–3 năm, cố vấn dài hạn và năm chuỗi nhiều năm. Những phần này chưa triển khai hoặc chưa kiểm; không đánh dấu PASS. Giữ yêu cầu không chạy 77 nhóm sau mỗi thay đổi. Binding REVIEWS_DB thực tế chưa kiểm chứng; chưa Production-ready.


### Nghiệm thu cuối đợt 8.8.2-foundation
Mốc nền tảng đã đạt kiểm thử trọng điểm. Trên mã cuối cần nối và kiểm báo cáo/biểu đồ, bảy chiến lược, nhân sự/lãnh đạo, thực tập/cố vấn và năm chuỗi tích hợp; kiểm thêm giao dịch nhượng quyền sau sáp nhập/thừa kế, nhiều thế hệ có nợ bảo đảm, các chế độ tài sản hôn nhân với sổ cá nhân. Không coi các mục chưa chạy là PASS. Ba tệp riêng của chủ dự án giữ nguyên; không deploy.

Mốc 8.8.3-reports đạt kiểm thử trọng điểm (reports 13, treasury 123, business133 29, business137 79, smoke/save/NPC, Chrome); GĐ6 đợt nâng cấp vẫn còn tích hợp chiến lược, nhân sự, lãnh đạo, thực tập, cố vấn và toàn bộ bổ sung quản gia/trợ lý/tiệc. Chưa chạy regression cuối trên toàn bộ phạm vi; không tính các mục đó PASS.

Mốc chiến lược 8.8.4 đã kiểm trọng điểm và build; nghiệm thu cuối đợt vẫn thiếu leadership, thực tập/cố vấn và supplement quản gia/trợ lý/tiệc. Bản nháp chưa nạp không tính PASS.

## Chốt đợt 8.8.5-enterprise — 28/10/2026

Các mục triển khai còn thiếu của checkpoint 8.8.1–8.8.4 nêu trên đã được tích hợp và kiểm thử trong đợt 8.8.5. Hồ sơ hiện hành: ENTERPRISE-UPGRADE-ACCEPTANCE.md và bảng checklist ENTERPRISE-UPGRADE-PROGRESS.md; các ghi chú checkpoint trước là lịch sử. Đã chạy smoke/save/safety/NPC, hồi quy các hệ thống bị ảnh hưởng, năm chuỗi tích hợp và Chrome trên dist; package/ZIP đạt. Không chạy toàn bộ 77 nhóm theo K1 yêu cầu gốc. Còn kiểm chứng ngoài môi trường: mẫu save thật của người chơi, thiết bị thật và binding Pages REVIEWS_DB. Không tự deploy hoặc ghi trạng thái đã phát hành.

## 8.8.6 — Boys Planet và quốc gia

Hoàn thành triển khai, kiểm thử trọng điểm: country-survival 273, showbiz-idol70/games585/quiz4047/dating69/integration92; smoke/save/safety/NPC và Chrome390/1280 đạt. Không chạy toàn bộ regression77; chưa có bản lưu thực tế bị kẹt của người báo lỗi. Bản đóng gói mới giữ packaged tới khi chủ dự án xác nhận upload.


## GĐ6 / nghiệm thu bóng đá chuyên nghiệp 8.9.2

Mô hình rút gọn đã triển khai trực tiếp; xem FOOTBALL-CAREER.md cho audit, cơ chế và giới hạn.
Nghiệm thu cuối còn: regression toàn bộ trên mã cuối, mẫu save thật đang làm cầu thủ, thiết bị thật;
kiểm thế giới đội tuyển độc lập khi nhân vật vắng mặt, nhập tịch kép, thể thức theo thời kỳ,
lên/xuống hạng CLB, lịch VCK đầy đủ và đàm phán nhãn hàng (chưa triển khai, không tính PASS).
Chưa kiểm binding REVIEWS_DB thực tế. Nhãn nhật ký “Đã phát hành” theo chỉ thị riêng của chủ dự án
cho bản bàn giao; không chứng minh website đã upload. Không tự deploy.

## GĐ6 / hành động, bạn thân và tình huống ở xa 8.9.5

Triển khai đợt sửa theo ảnh/video: bỏ Hardcore, lượt thực hiện thay cho lượt mở menu, nhóm hành động, bạn thân, chứng chỉ và chuyến về thăm. Kiểm thử trọng điểm ghi tại ACTIONS-895-ACCEPTANCE.md. Nghiệm thu cuối còn regression toàn bộ trên mã cuối, video/save thực tế gặp lỗi, thiết bị Android/iOS thật và binding Pages REVIEWS_DB. Không tính các phần chưa chạy là PASS; không tự deploy.

## GĐ6 / quản gia, trợ lý và bộ nhớ 8.9.6

Triển khai theo góp ý: bàn làm việc liên tục, dự toán tiệc do nhân sự lập, phạm vi ủy quyền theo nhân sự/tài chính, nén không mất dữ liệu và bản sao đầy đủ. Kiểm trọng điểm tại OFFICE-STORAGE-896-ACCEPTANCE.md. Còn regression toàn bộ trên mã cuối; iPhone Safari/PWA và thiết bị thật; mẫu dữ liệu thực báo lỗi quota; binding REVIEWS_DB Production. Không coi Chrome giả lập quota là đã kiểm Safari thật. Không tự deploy.

## GĐ6 / bóng đá và cư trú 8.9.7

Hoàn thành triển khai, kiểm thử trọng điểm đạt; chưa nghiệm thu toàn diện. Còn regression toàn bộ, thiết bị thật và bản lưu thật của người báo lỗi; binding REVIEWS_DB thực tế. Hai bài adult106/public116 cũng thất bại trên HEAD trước sửa, cần bảo trì riêng: kịch bản bảo vệ tiến sĩ không tạo khung ở mốc cũ; trần lương public116 còn kỳ vọng Hardcore đã loại bỏ. Không tính hai bài này PASS. Nhật ký Đã phát hành theo chỉ thị riêng, không chứng minh website đã upload.

## GĐ6 / hoàn cảnh tuổi thơ 8.9.8

Hoàn thành triển khai trong phạm vi kỳ nghỉ, sở thích và lời hẹn bạn thân; chưa tự bắt đầu 25 hệ thống trong ảnh. Còn regression toàn bộ trên mã cuối, thiết bị thật và mẫu save người báo lỗi. Hai bài chains-gd4/context-weighting thất bại giống trên HEAD trước sửa (friend uid ở kịch bản cũ; gate viec_online đã thêm điều kiện năm), không tính PASS; cần bảo trì riêng. Binding REVIEWS_DB chưa kiểm thực tế.

Regression trọng điểm898:16873 đạt/1 lỗi cũ ở nhóm32 (lời thoại hẹn hò thiếu tên Lan theo test); đối chiếu riêng HEAD trước sửa có đúng lỗi27 đạt/1 FAIL. Chưa tính regression PASS; không đổi hành vi hẹn hò trong đợt tuổi thơ này.

## GĐ6 / hệ thống7–9 và việc gia đình 8.9.9

Phạm vi gồm chuỗi sức khỏe/tuổi già nhiều bước, hồ sơ bệnh tồn tại sau ổn định, tái phát/chi phí/công việc, chăm sóc/tự lập/cô đơn/ký ức; sửa hợp đồng gia đình và danh tính bạn thân quay lại. Còn regression toàn bộ, thiết bị thật, mẫu save báo mất nghề/lương và binding REVIEWS_DB thực tế. Không coi phạm vi ngoài mô hình bệnh đơn đang hoạt động hoặc chuyên khoa/viện dưỡng lão đầy đủ là đã triển khai. Kiểm trọng điểm tại DEPTH-899-ACCEPTANCE.md.

Đợt899: regression34/42/43/49 có82 đạt/1 lỗi cũ ở regex giao diện Chi tiêu (HEAD trước sửa cũng lỗi). Lượt20–49 rộng đã dừng sau hơn10 phút, không tính phần dở/chưa chạy PASS. Cần chạy lại toàn bộ trên mã cuối ở nghiệm thu GĐ6; kiểm547+2 chuyên đề và smoke/save/NPC đã đạt.

## GĐ6 / nghề nghiệp và di cư 8.10.0

Hoàn thành triển khai theo yêu cầu chủ dự án; kiểm thử trọng điểm đạt, chưa nghiệm thu toàn diện. Chi tiết CAREER-ABROAD-8100-ACCEPTANCE.md. Còn regression đầy đủ trên mã cuối, cân bằng nhiều mùa/fame/chấn thương/thu nhập, Android/iOS và save thật, binding Pages REVIEWS_DB thực tế. Visa là mô phỏng; chưa thay mọi sự kiện du lịch cũ hoặc mô phỏng mọi trường/mọi trận của mọi môn. Nhật ký packaged; không tự deploy.


## GĐ6 / gia đình nguồn cội và học đường thế giới 8.10.4

Hoàn thành triển khai; kiểm thử trọng điểm mới, smoke/save/save-safety/NPC, văn hóa 195 nước, cư trú, đại học và thi cử đạt. Còn regression toàn bộ trên mã cuối, Android/iOS thật, mẫu save người chơi và binding Pages REVIEWS_DB thực tế. Ba bài family830 (tương tác người con thứ hai), family129 (purchase 1), adult106 (khung bảo vệ tiến sĩ) lỗi giống HEAD 07e5fec trước sửa; không tính PASS. Cần bảo trì riêng tại GĐ6. Mới có 7 trường thật ở JP/KR/CN/TH; các quốc gia khác dùng trường mô phỏng, chưa là danh mục trường thật toàn cầu. Tuyển sinh dùng thang điểm game, chưa mô phỏng đầy đủ điều kiện pháp lý/từng chương trình của mọi quốc gia. Nhãn nhật ký Đã phát hành theo chỉ thị riêng của chủ dự án, không chứng minh website đã upload. Không tự deploy.

Regression trọng điểm 904: các nhóm 46,50,65,67,68,70,72,73 chạy trọn, 97 đạt/1 lỗi ở nhóm50: kỳ vọng người Việt định cư nước ngoài không dùng chuyện địa phương (đã được văn hóa173 thay đổi). Đối chiếu nguyên HEAD trước sửa nhóm50 cũng 14 đạt/1 cùng lỗi; không tính nhóm này PASS. Ba lỗi kiểm thử cũ nêu trên vẫn còn.


## GĐ6 / sửa đường chuẩn bị visa tiến sĩ 8.10.5

Hoàn thành triển khai, chuyên đề visa905 231 kiểm tra và depth900 58 kiểm tra đạt; cư trú897 và smoke/save/save-safety/NPC đạt. Browser 390/1280px kiểm lối Học tập, giấy tờ/kế hoạch, tải lại và nhập học tiến sĩ. Còn regression toàn bộ trên mã cuối, thiết bị thật, mẫu save thực của người báo lỗi và binding REVIEWS_DB thực tế. Không tính các lỗi cũ của GĐ6 đã ghi ở các đợt trước là đã sửa trong đợt này. Nhật ký Đã phát hành theo chỉ thị trước; không xác nhận upload website, không deploy.

Đợt visa905: regression trọng điểm55/72 đạt22/22; bản dist và nhật ký đạt kiểm Chrome390/1280px; đóng gói28file và ZIP byte-identical. Chưa nghiệm thu toàn diện như giới hạn trên.

## GĐ6 / 8.10.6–8.10.7: nghiệm thu tiếp tục sau cập nhật đi lại

Đã sửa đường visa tự nhắc/gia hạn, đầy đủ lựa chọn ngoại ngữ/Goethe, giữ chỉ số đời con, menu lẫn nhóm, chuỗi bạn thân, khán giả minigame và mã lao động TW. Sau đó chủ dự án yêu cầu ưu tiên hoàn thiện chuyến máy bay về Việt Nam có giá khứ hồi, hoạt động tại nơi đến, máy bay nội địa, xe lửa gần và menu/sự kiện theo nơi đang có mặt; build/commit/push trước, tiếp tục nghiệm thu rồi build lại. Không tự deploy.

Mốc 906: 154 tệp headless đạt; 77 nhóm hồi quy cũ được gọi, 58 đạt/17 lỗi/2 timeout (5 và 5b), chưa nghiệm thu toàn diện. Nhóm0 chạy lại đạt; nhóm6 sau sửa concert vẫn còn 1 kỳ vọng major cũ không được quan sát. Cần sửa fixture nhóm9 (job=null), đối chiếu đoạn kết, độ lặp, trường hợp nhắc người đã mất (nhóm68), mẫu nhiều con và hiệu chuẩn thống kê; không hạ ngưỡng để coi đạt. Chi tiết docs/CONTINUITY-906-ACCEPTANCE.md và docs/CONTINUITY-906-RESULTS.json.

Mã 907 phải được kiểm lại rộng sau mốc commit ưu tiên; còn kiểm thiết bị Android/iOS thật, save người báo lỗi và binding Pages REVIEWS_DB thực tế. Chưa xác nhận mọi sân bay/tuyến tàu thật hoặc mọi nước có bộ sự kiện riêng chuyên sâu: máy bay có chặng nối, xe lửa là tuyến gần tổng quát, nội dung dùng hồ sơ quốc gia/vùng hiện có. Giá vé là mô phỏng. Báo cáo docs/TRAVEL-907-ACCEPTANCE.md.


### GĐ6 — nghiệm thu tiếp sau mốc907 (30/10/2026)

156 tệp headless/12 browser đạt trước sửa bảng chức vụ công vụ; registry 4 shard kết thúc không timeout, 422.018 lượt chọn, còn67 assertion thất bại gồm thiếu context và2 lỗi undefined cùng nguyên nhân. reqEdu99 đã sửa, chuyên đề214/0 và registry tập trung2599/0 đạt. Bổ sung công cụ tools/acceptance-decisions.js và manifest tái lập. Nhóm0/15/20/23/50/68 chạy lại đạt; nhóm39 fixture chết trước bảo vệ lại còn19/1. Chưa giải quyết toàn bộ6/16/21/24/25/26/34/38/60 và timeout5/5b. Không hạ ngưỡng, không tính nhóm thiếu context là PASS. Cần bổ sung context cho các mã chưa kiểm được, đối chiếu lỗi thống kê/fixture, regression mã cuối, thiết bị thật, save người báo lỗi và binding REVIEWS_DB. Chi tiết TRAVEL-907-RESULTS.json / TRAVEL-907-ACCEPTANCE.md. Chưa nghiệm thu toàn diện, chưa production-ready.

### GĐ6 — gia tộc và người kế vị908 (30/10/2026, UTC+7)

Triển khai theo góp ý mới, mở rộng các hệ thống hiện có, không mở giai đoạn mới. Phạm vi/giới hạn tại docs/DYNASTY-908-ACCEPTANCE.md; kết quả tại DYNASTY-908-RESULTS.json. Nhật ký packaged,132 mục tổng, giữ131 mục trước. Kiểm thử trọng điểm mới, tương thích lưu và regression hệ thống bị ảnh hưởng được chạy; không coi các lỗi/timeout GĐ6 trước đó là đã giải quyết. Còn nghiệm thu toàn diện cuối, bổ sung context registry các nhánh hiếm, thiết bị thật, save người góp ý và binding REVIEWS_DB thực tế. Tình huống thông báo con muộn đòi lịch sử phù hợp, không sinh tùy tiện; dữ liệu NPC ông bà/cô chú chưa tồn tại không được bịa thành người ủng hộ. Công ty bố mẹ trước bàn giao vẫn dùng mô hình139, không tuyên bố có báo cáo kho bạc chi tiết cho mọi NPC. HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN khi các kết quả trọng điểm chốt đạt; không deploy.

### GĐ6 — thuế và hiến máu909 (30/10/2026, UTC+7)

Đã triển khai theo yêu cầu, không mở giai đoạn mới. Xem HEALTH-TAX-909-ACCEPTANCE.md và HEALTH-TAX-909-RESULTS.json. Chuyên đề1.071 kiểm tra, smoke/save/save-safety/NPC và regression liên quan; các nhóm hồi quy GĐ6 cũ chưa khép vẫn chưa được coi là PASS. Chưa nghiệm thu toàn diện/thiết bị thật/save người báo lỗi/REVIEWS_DB. Thuế áp mốc2026 cho tiền lương nhân vật cư trúVN, giữ bảo hiểm hiện có; chưa mô phỏng mọi loại thuế, trường hợp cư trú phức tạp hoặc quyết toán cho tất cảNPC. Nhóm người phụ thuộc không có dữ liệu đầy đủ phải bổ sung qua hệ thống NPC, không tự dựng chứng cứ. Hiến máu là mô hình điều kiện/lịch/sàng lọc/quyền lợi, chưa đủ mọi tiêu chuẩn thực của mọi cơ sở; cap4/22 là quy ước bảo thủ game. Nhật ký908/909 đổi Đã phát hành theo chỉ thị trực tiếp, không chứng minh đã upload. Không tự deploy hoặc ghi D1.

### GĐ6 — nghiệm thu trọng điểm game show và đường tối (31/10/2026, UTC+7)

Đợt 8.10.11 đã tăng độ khó câu hỏi game show và mở rộng lựa chọn/điều tra nghề phi pháp, băng nhóm, tình huống trong tù. Test chuyên đề, smoke, save, save-safety và các regression liên quan đã chạy; còn thiếu regression đầy đủ trên mã cuối, thiết bị thật, save người báo lỗi và xác minh binding Pages REVIEWS_DB thực tế. Không coi các lỗi/nhóm timeout GĐ6 trước đó là PASS hoặc đã giải quyết. Chưa nghiệm thu toàn diện, không deploy.

## GĐ6 / nâng cấp 8.10.12 (mã 912) — khối thi, hiệu năng, tài sản, tình cảm, cố vấn

Trạng thái: **HOÀN THÀNH TRIỂN KHAI MỘT PHẦN — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN**. Đã làm §3, §4, §5 (hai nguyên nhân gốc), §6, §8, §10 của PROMPT_CLAUDE_CODE_UPDATE_MOT_DOI.md; chưa làm §7, §9, §11, §12 (ngoài sửa tỷ giá dịch vụ ngầm), §13, phần lớn §14 — chi tiết trong UPGRADE-912-PROGRESS.md. Chưa chạy regression toàn bộ (tests/regression.js) trên mã cuối; chưa chạy `npm run test:update` đầy đủ; chưa đo trên điện thoại thật và bản lưu nhiều đời thật của người chơi; chưa xác minh binding REVIEWS_DB Production. tests/life138.js hỏng sẵn từ HEAD 30152fc (assertion "sibling can succeed instead of player"). Artifact chỉ Preview.

Cập nhật 8.10.13: thêm §9 chu cấp chủ động và §7 quan hệ người nổi tiếng (kiểm thử trọng điểm đạt, xem UPGRADE-912-PROGRESS.md). Vẫn chưa làm §11, §12, §13, phần lớn §14; vẫn chưa chạy regression toàn bộ trên mã cuối; artifact chỉ Preview.

Cập nhật 8.10.14: phần lớn §12 đường tối (đàn em NPC, địa bàn, bảng rủi ro, tổng hợp án, cân bằng đánh úp) — kiểm thử trọng điểm đạt. Còn §11, §13, phần nhỏ §12 (tan rã/đổi lãnh đạo nhóm, hỗ trợ pháp lý trong trại, chuyển quốc gia khi có hồ sơ), phần lớn §14; chưa chạy regression toàn bộ. 6 test hỏng sẵn từ 30152fc: football-payroll901, update451, update453, update454, update460, life138.

Cập nhật 8.10.15: §11.1–11.3 (di truyền theo cha mẹ, sàng lọc đồng thuận, đa thai) — kiểm thử trọng điểm đạt. Còn §11.4 bệnh mắc phải/ung thư, §11.5 phát triển trẻ, §13 quốc gia, phần nhỏ §12, phần lớn §14; chưa chạy regression toàn bộ.

Cập nhật 8.10.16: §11.4–11.5 (ung thư theo giai đoạn, bệnh mạn, phát triển trẻ) — kiểm thử trọng điểm đạt. Còn §13, phần nhỏ §12, phần lớn §14; chưa chạy regression toàn bộ. Thêm vào danh sách hỏng sẵn: blood910-browser (assertion nhật ký mới nhất).

GĐ6 — Bản 8.10.26-salon còn chờ regression toàn bộ trên mã cuối và đối chiếu bản lưu thực tế của người báo lỗi.

GĐ6 — Bản 8.10.31 còn chờ regression toàn bộ, đối chiếu bản lưu thực tế của người báo lỗi và xác minh cấu hình Pages.

GĐ6 — Bản 8.10.33 về hồ sơ gia đình và dịch vụ ngầm còn chờ regression toàn bộ, kiểm tra thiết bị thật và xác minh binding Pages.

GĐ6 — Bản 8.10.34 còn chờ regression toàn bộ, thiết bị thật và xác minh binding Pages.


GĐ6 — 8.10.36: còn regression toàn bộ mã cuối, thiết bị thật, bản lưu người chơi thật, hiệu chỉnh dữ liệu luật/rủi ro/chi phí và binding REVIEWS_DB thực tế. Phạm vi và giới hạn: docs/WORLD-836.md. Bản Preview, chưa nghiệm thu toàn diện.


GĐ6 — 8.10.37: còn regression toàn bộ mã cuối, thiết bị thật, bản lưu người chơi thật, các ngoại lệ hiến định/giáo hội và binding Pages REVIEWS_DB. Chi tiết phạm vi và phần chưa mô phỏng: docs/ROYAL-837.md. Bản Preview, chưa nghiệm thu toàn diện.


GĐ6 — 8.10.42: còn regression toàn bộ mã cuối, thiết bị thật, save thật và xác minh binding REVIEWS_DB Pages. Cần đối chiếu migration tên bình luận trên bản sao dữ liệu thực tế; không thể phục hồi tên tài khoản đã xóa nếu dữ liệu không còn tên. Chi tiết docs/FEEDBACK-842.md. Artifact chỉ Preview.


GĐ6 — 8.10.43: còn regression toàn bộ, thiết bị thật, bản lưu hoàng gia thật của người báo lỗi và cấu hình Pages REVIEWS_DB. Kế tục giữ cây gia đình hiện có; không tái tạo lịch sử từng tước nếu dữ liệu cũ đã mất. Chi tiết docs/ROYAL-843.md.


GĐ6 — 8.10.44: còn regression toàn bộ mã cuối, thiết bị thật, save thật, các ngoại lệ lao động/giấy phép từng địa phương, luật hỗ trợ sinh sản đầy đủ và xác minh Pages REVIEWS_DB. Mốc tuổi, xác suất và giá là mô hình game, không phải đánh giá phát triển hoặc chẩn đoán cá nhân. Chi tiết docs/FAMILY-844.md.


GĐ6 — 8.10.45: còn regression toàn bộ, thiết bị thật, bản lưu thật và binding Pages REVIEWS_DB. Bản lưu đã bốc xong trước sửa giữ kết quả, không tự xóa tiến độ để bốc lại. Chi tiết docs/BIRTHDAY-845.md.


GĐ6 — 8.10.46: còn regression toàn bộ, thiết bị thật, save người góp ý thật và binding Pages REVIEWS_DB. Giữ lọc ngân sách theo xác nhận lại của chủ dự án; nghề tương lai là hướng rèn luyện, không bổ nhiệm nghề lúc một tuổi. Chi tiết docs/OBJECTS-846.md.

GĐ6 — 8.10.47: còn regression toàn bộ mã cuối, thiết bị thật, bản lưu hoàng gia nhiều thế hệ thật của người chơi và xác minh binding Pages REVIEWS_DB. Chi tiết phạm vi và giới hạn mô phỏng: docs/ROYAL-847.md. Bản Preview, chưa nghiệm thu toàn diện.

GĐ6 — 8.10.48: còn regression toàn bộ mã cuối, thiết bị thật, bản lưu người chơi thật và xác minh binding Pages REVIEWS_DB. Chi tiết phạm vi và giới hạn: docs/ROYAL-847.md. Bản Preview, chưa nghiệm thu toàn diện.

GĐ6 — 8.10.50: còn regression toàn bộ mã cuối, thiết bị thật, bản lưu người chơi thật và xác minh binding Pages REVIEWS_DB. Chi tiết phạm vi và giới hạn: docs/ROYAL-847.md. Bản Preview, chưa nghiệm thu toàn diện.

GĐ6 — 8.10.55: còn regression toàn bộ, thiết bị thật và bản lưu của người góp ý về tốt nghiệp. tests/player107.js hiện thất bại ở bước xét du học cả trên mã trước thay đổi; cần cập nhật dữ liệu kiểm thử theo điều kiện ngôn ngữ hiện hành. Chưa kiểm chứng binding Pages REVIEWS_DB.

GĐ6 — 8.10.56: còn regression tổng thể và bản lưu thật của người báo lỗi gia cảnh hoàng gia. Kiểm tra trọng điểm dùng cuộc đời tạo qua luồng game và bản lưu giả lập; chưa kiểm chứng Pages REVIEWS_DB.

GĐ6 — 8.10.58: còn regression toàn bộ mã cuối, thiết bị thật, bản lưu hoàng gia nhiều thế hệ thực tế, toàn bộ ngoại lệ lịch sử/sắc lệnh từng cá nhân và xác minh Pages REVIEWS_DB. Theo dõi từng nước tại docs/ROYAL-858-PROGRESS.md; khi làm tiếp bắt đầu từ mục còn thiếu. Không coi các mô hình quyết định hư cấu là quy định pháp lý thật.

GĐ6 — 8.10.59: còn regression toàn bộ, thiết bị và save thật; tiếp tục rà nội dung quốc tế ngoài nhóm tuổi thơ đã sửa, không coi 195 nước là 195 bộ phong tục đã nghiên cứu riêng. Chi tiết docs/CHILDHOOD-859.md. Pages REVIEWS_DB chưa xác minh.

GĐ6 — 8.10.59 bổ sung: tests/life138.js lỗi “sibling can succeed instead of player” cả trên hai module childhood trước sửa (HEADc1d2365) và mã mới; cần rà fixture/điều kiện kế nhiệm doanh nghiệp riêng. Không tính đạt nhóm này.

GĐ6 — 8.10.60: còn regression toàn bộ mã cuối, thiết bị và bản lưu hoàng gia thật, cân bằng dài hạn quỹ riêng/ảnh hưởng/chuỗi sự kiện, rà nguồn lực khi thay đổi tiền tệ và các tình huống chuyển thế hệ thực tế. Mô hình ưu đãi hoàng gia hư cấu, không phải dữ liệu tài chính hoặc ngoại hình thật. Pages REVIEWS_DB chưa kiểm chứng. Chi tiết docs/ROYAL-860.md.

GĐ6 — 8.10.61 Monaco: còn regression toàn bộ mã cuối, thiết bị/save thật nhiều thế hệ, luật trước2002, toàn bộ sắc lệnh tước/phối ngẫu/remainder và hộ tịch từng thời kỳ; mở rộng dữ liệu cha mẹ thứ hai, quốc tịch và giấy tờ từ case thật. Khi làm tiếp bắt đầu mục còn thiếu tại docs/MONACO-861-PROGRESS.md. REVIEWS_DBProduction chưa xác minh; không coi nguồn chưa đủ làPASS.

- GĐ6: Tây Ban Nha8.10.62 — regression toàn diện/thiết bị thật; luật trước1978/1987, họ trước2017, hộ tịch/phán quyết, organic/Cortes/nhiếp chính và dữ liệu tước lịch sử/ngoại lệ cá nhân chưa phủ đầy đủ. Xem docs/SPAIN-862-PROGRESS.md.

### Đợt66 — kiểm thử trọng điểm, không thay nghiệm thu GĐ6

- royal866/reference866/dynasty908/expansion842 và các hệ hoàng gia/giáo dục liên quan đạt; giao diện6view390/1280 đạt ở nguồn. Cần nghiệm thu toàn diện sau khi chốt mã.
- depth899, origins-clubs904, life138, continuity101 FAIL; đã tái hiện cùng assertion trên toàn bộ nguồn public của HEAD a5800ea qua git cat-file, không phải lỗi mới được chứng minh của66. Chưa xem là PASS, cần đối chiếu fixture và đường đi mới trước nghiệm thu.
- Dữ liệu thật toàn game và các chức năng đang thiếu vẫn là công việc triển khai của yêu cầu hiện hành, xem REFERENCE-866-PROGRESS.md; không đẩy các phần này sang GĐ6 chỉ vì người dùng loại trừ nghiệm thu toàn diện.

Bổ sung66: study829, school-home-police838 cũng FAIL cùng assertion trên nguồn HEAD a5800ea. exam-model được cập nhật theo yêu cầu giữ tên trường,565checks đạt; không còn dùng điều kiện bắt buộc tên giả để kiểm tính trung thực của điểm mục tiêu.

### GĐ6 — 8.10.67

- Kiểm thử trọng điểm danh mục và luồng chọn ngành đạt. Còn nghiệm thu tổng thể, thiết bị và bản lưu thực tế, xác minh Pages REVIEWS_DB.
- Dữ liệu triển khai còn thiếu: chương trình và tuyển sinh đã xác minh cho mọi cơ sở, danh mục bóng đá, định cư và phúc lợi theo từng nước, các ngoại lệ pháp lý và tước hiệu lịch sử.
- football-payroll901 tái hiện cùng lỗi kiểm thử trên 8.10.66 và 8.10.67. Các lỗi nền khác theo mục 8.10.66 ở trên.

### 8.10.68 — Dữ liệu còn cần bổ sung

- Đã bổ sung lộ trình MD phổ biến tại Mỹ, sáu tên câu lạc bộ từ VPF/Premier League/LALIGA, tham chiếu Graduate và Universal Credit tại Anh, và hồ sơ thoái vị Tây Ban Nha năm 2014 từ BOE.
- Còn danh mục ngành và quy chế từng trường, lịch sử giải đấu và câu lạc bộ ở các hạng còn thiếu, lộ trình cư trú và phúc lợi ngoài các mục đã xác minh, các sắc lệnh và ngoại lệ pháp lý lịch sử.
- GĐ6 còn nghiệm thu toàn diện, thiết bị/bản lưu thật và xác minh binding Pages REVIEWS_DB.
- 8.10.68: depth899, origins-clubs904, life138, continuity101, study829, school-home-police838 và football-payroll901 đều đạt khi chạy lại. depth900 xác minh đường thường trú cũ và hoàn phí.

### 8.10.69 — Phạm vi dữ liệu đã đối chiếu

- Bổ sung Harvard J.D., bốn CLB V.League 2 theo VPF mùa 2026/27, tham chiếu CEC/CCB Canada, FDIC Mỹ và điều khoản chuyển tiếp về tước danh dự Tây Ban Nha.
- Còn cần đối chiếu chương trình/điểm/học phí theo kỳ, các đội/giải và mùa khác, các diện cư trú/phúc lợi còn thiếu, các văn bản hoàng gia chưa phủ, ngân hàng và chi phí y tế từng nước, nghề và sự kiện theo địa phương.

### 8.10.70 — Tiến độ dữ liệu

- Bổ sung UCL A100 kỳ 2027, bốn đội Hạng Nhì Việt Nam 2026, diện 189 Úc và hạn mức FSCS Anh.
- Các mục rộng ở 8.10.69 vẫn mở; chưa phủ ngành và tuyển sinh từng trường, mùa giải/thị trường còn thiếu, luật và phúc lợi theo thời kỳ, tài chính/y tế/nghề và sự kiện địa phương.

### Tiến độ sau 8.10.70

- Bổ sung 16 CLB hạng hai và hạng ba Đức/Tây Ban Nha theo mùa 2025/26, giữ mã đội và hiện nguồn/mùa trong hồ sơ. football897 và football-payroll901 đạt.
- Các nhóm dữ liệu mở ở trên chưa hoàn tất. Giữ gói 8.10.70 cho tới khi hoàn tất phạm vi và kiểm thử trọng điểm trên mã cuối.

- Điều kiện lập di chúc đã nối cả trình soạn cơ bản và chi tiết. Khi bị cô lập, chặn cả lưu/hủy từ trình soạn cũ; tại Việt Nam từ 2017, người đang thụ án có thể xin lịch xác nhận cho năm sau. Mốc hẹn là quy ước thời gian của game. Tham chiếu Điều 638, Bộ luật Dân sự 91/2015/QH13: https://vanban.chinhphu.vn/default.aspx?docid=183188&pageid=27160 . update551 và assets912 đạt.

- Bóng đá: đã triển khai trao đổi vị trí lên/xuống hạng cho mùa sau trong mô hình rút gọn. Giữ quân số mỗi hạng, giữ hợp đồng và mã đội, lưu bảng cũ và thay đổi hạng qua tải lại. Chưa có lịch/luật theo mùa cho toàn bộ thị trường. Thế giới đội tuyển và hợp đồng tài trợ được bổ sung ở tiến độ bên dưới.
- Singapore: đã đối chiếu Điều 121 Hiến pháp về quốc tịch khi sinh tại Singapore và dẫn hướng dẫn ICA đối với trẻ sinh ở nước ngoài. Chưa phủ các quy định quốc tịch còn lại theo thời kỳ.
- Kiểm thử nhật ký quốc gia tìm đúng mục 8.9.4 đã phát hành bằng truy vấn không dấu. Mục này có thể nằm sau các bản cập nhật mới hơn.

### Tiến độ triển khai tiếp sau 8.10.70 — chưa đóng gói

- Đã thay toàn bộ 192 vị trí CLB trong 16 thị trường bằng tên thật có nguồn tham chiếu; giữ mã đội. Dữ liệu hạng dưới có mùa riêng (không coi đội hình tham chiếu là thành phần thật của mọi năm). Chặn tự chuyển hạng giữa MLS/USL, hệ NZ đang chuyển thể thức, Mexico và ranh giới K2/K3 chưa đủ điều kiện giấy phép. Còn lịch/luật chính thức từng giải và thời kỳ, FIFA/đổi đội tuyển.
- Đã có đội tuyển tiếp tục thi đấu khi nhân vật không được gọi, chấn thương hoặc giải nghệ, không cộng thành tích cá nhân; đàm phán tài trợ, nghĩa vụ quảng bá, thu nhập một lần, chấm dứt và tất toán khi rời nghề. Đây là kết quả phát sinh trong cuộc đời, không phải thành tích/hợp đồng ngoài đời của người thật.
- Đã sửa khóa tiếng sang đại học tại chỗ: giữ nơi ở khi xét, không quy đổi tiền hai lần, dùng nơi ở gốc khi trở về; từ chối/rút/hết hạn trả đúng trạng thái và học phí còn lại.
- Cửa hàng bạn đời đã nối BUSINESS123/TREASURY165 và sổ RELATIVE163: vốn/cổ phần hoặc khoản cho vay, giá trị công ty, trả nợ có biên nhận; không tạo thêm thu nhập cửa hàng giả. Giữ cửa hàng cũ khi nâng bản lưu.
- Công nhận bằng điều dưỡng/giáo viên kiểm đúng ngành; không dùng bằng đại học bất kỳ hoặc nghề bác sĩ thay bằng điều dưỡng. Hồ sơ cũ thiếu ngành không tự hoàn tất.
- Đổi thứ tự họ nhóm trẻ cùng hai cha mẹ tại ES: đồng thuận cha mẹ, ghi ý kiến, nộp và quyết định ở năm sau; lưu tên cũ, không đổi kế vị, không tác động anh chị thành niên hoặc con khác cha/mẹ. Còn lịch sử/ngoại lệ hộ tịch ngoài phạm vi đã cấu trúc.
- Kiểm thử chuyên đề hiện đạt: football-reference871 (132), football-world871 (11), football-sponsors871 (14), study-onshore871 (17), professional-qualification871 (6), spain-surname871 (16), partner-shop871 (13), football897 và football-payroll901. Các mục giáo dục/pháp lý/đời sống quốc gia/tài chính/y tế còn mở vẫn là triển khai, không chuyển sang nghiệm thu để đánh dấu xong.
- Gói dist/dist.zip chưa được dựng lại cho các thay đổi này; không dùng gói 8.10.70 cũ để công bố các mục mới.

- Tiếp tục giáo dục: danh mục có nguồn của HUS, UIT, UET, HCMUS, HUST và Y Dược Huế; nguyện vọng/card cũ sai chương trình yêu cầu chọn lại, giữ nguyên bằng đã nhận. MD/J.D. tại Harvard/Stanford/UCLA chặn nhập học khi chưa có bằng cử nhân, dùng chung điều kiện ở xét tuyển và dự báo. Còn môn tiên quyết, bài thi/đánh giá và chương trình graduate đầy đủ; chưa coi đường Y/Luật Mỹ hoàn tất.
- Kiểm thử bổ sung: courses871 (40), institutions867 (804), education-fallback-graduation (104), exam-model (565), player107 (84), university136 đạt. Browser courses871: 10 lượt chọn ngành và lưu/tải ở 390/1280, không lỗi JS/tràn ngang. player107 cập nhật chương trình HUST đã xác minh và ngoại ngữ có trước xét hồ sơ; kiểm tra không đủ tiền vẫn có lối hủy/chuyển học trong nước, không mở hồ sơ thu phí.
- Cửa hàng: sổ tài chính người thân cộng riêng nợ vốn cửa hàng, không đưa vào khoản nợ tự trả hai lần. Cửa hàng đóng vẫn trả khoản vay cá nhân từ tiền riêng, không tái mở công ty cũ. partner-shop871 (16) và relative-finance163 (25) đạt. Chưa đối chiếu đầy đủ chuyển chủ nợ khi qua đời/chuyển thế hệ.

### Bàn giao sang Claude — 11/11/2026 13:39 UTC+7

Chủ dự án yêu cầu ghi chú và chuyển người thực hiện. Trạng thái chi tiết, file đang sửa, kết quả kiểm thử, phần dở/chưa làm và artifact cũ: xem [HANDOFF-CLAUDE-871.md](HANDOFF-CLAUDE-871.md). Chưa hoàn thành toàn bộ triển khai, chưa build/commit/push các thay đổi sau 8.10.70.

Bổ sung cuối trước bàn giao: school920 sửa ghi đè p=0 ở Hàn Quốc, tách buổi chia tay khỏi dạ vũ; sửa mốc Norijada theo nguồn trường, bổ sung nguồn FI; có minh họa vector kỷ yếu/tiệc và mở bước kế tiếp liên tục. md5-920 đạt118; browser school871 đạt6 chuỗi prom/kỷ yếu/gathering ở390/1280, lưu/tải, không lỗiJS/tràn. Còn caKR/cache/stale và quick trên mã cuối sau sửa school/app.

### Tiếp tục sau bàn giao — 8.10.71 Preview, 12/11/2026

- Chủ dự án yêu cầu tiếp tục. Đã chặn thẻ sự kiện trường học cũ sau đổi trường/quốc gia/năm, bổ sung school-context871:19 PASS; md5-920:118, partner-shop871:16; browser school871:6 chuỗi390/1280 PASS.
- Quick trên mã cuối: smoke11/saves10/save-safety10/NPC14 PASS. courses87140/football-reference871132/football-sponsors87114/study-onshore87117/spain-surname87116 PASS. Full regression không chạy theo yêu cầu.
- Nhật ký71 packaged, 193mục cũ nguyên dữ liệu. npm run package:cloudflare PASS:28file,ZIP3511204byte,SHA256C70F857561BD305C8C1D2BF24442989C350A7925EC2C4F571CC4D027F4BE1081; so tên/hash từng entry đạt,loading8cuộcđời/API-admin cục bộ đạt. GiữWorker/routes/headers/.well-known. Gói gồm thay đổi y tế riêng có sẵn ngoài commit.
- Đã xác minh lại originmercyx03/motdoi công khai,push/admin,0workflow/0hook/0deployment bằng API qua credential Git; gh không có trongPATH. Không deploy. REVIEWS_DB chưa kiểm chứng.
- Đây là gói Preview mới cho phần đã triển khai, KHÔNG hoàn tất toàn BACKLOG. Các nhóm giáo dục graduate/học phí/quy chế, dữ liệu quốc gia/di trú/y tế/tài chính, luật hoàng gia lịch sử, thể thức/FIFA và chuyển thế hệ/chủ nợ cửa hàng vẫn mở trong bản bàn giao. Tiếp tục theo phạm vi chủ dự án; không dừng vì có artifact.

### Đang triển khai sau 8.10.71 — chưa đóng gói

- J.D. Harvard: hồ sơ STUDY54 có CAS, thi LSAT/mẫu viết, tài liệu, nộp phí, xét/phỏng vấn/quyết định các năm sau, thư nhận học có hạn và tối đa ba lượt nộp thường. Thư được xác nhận qua luồng nguyện vọng; không dùng điểm THPT để bác thư đã được nhận, không nhập học ngay khi nộp. GRE hiện được nhận qua hồ sơ kết quả nhưng chưa có hành động thi GRE riêng. Chưa gộp vào lộ trình MD/Stanford/UCLA.
- Tách tên/thời lượng J.D. Harvard3năm, MD Harvard/UCLA4năm ở tuyển sinh mới; giữ niên hạn đã học của save cũ. Thêm hook gradUniversity ở đúng lúc engine đã cho tốt nghiệp; bằng chuyên nghiệp không nâng thành PhD. professional-degree87216/hls87219/courses87140/institutions867804/education-fallback-graduation104/university136/player10784 PASS. Chưa chạy quick/browser trên mã này.
- Nguồn J.D.: https://hls.harvard.edu/jdadmissions/apply-to-harvard-law-school/jdapplicants/jd-application-components/ ; phí LSAT/CAS: https://www.lsac.org/lsat/register-lsat/lsat-cas-fees (biểu2026–27). MD: https://medstudenthandbook.hms.harvard.edu/105-five-year-md-program và https://catalog.registrar.ucla.edu/browse/College%20and%20Schools/DavidGeffenSchoolofMedicine/Medical-Programs . Thời gian xử lý theo năm/điểm thi/xác suất là cơ chế cuộc đời, không phải lịch hay điểm chuẩn chính thức.

### Góp ý người chơi — 8.10.72, 12/11/2026

- Đã triển khai các sửa đổi mới: hạn nội trú Y; bằng tốt nghiệp và menu an toàn; tìm vị trí ngành Y; hồ sơ Anh tách nộp/kết quả/nhập học và chi tiết thu gọn; giảm chuyện ngẫu nhiên; thương lượng cổ phần người thân, danh tính qua di sản và liên kết biểu quyết/liên minh; tab phối ngẫu hoàng gia; hàng chờ nhiều phim; cơ hội cám dỗ theo giàu/nổi tiếng và tiếp diễn tin nhắn sau hai năm. Chi tiết, giới hạn và kiểm thử: docs/PLAYER-FEEDBACK-872.md.
- Lương quản lý gia đình/tập đoàn được phân loại thu nhập tiền lương, không tính thêm thuế lợi nhuận doanh nghiệp cá nhân.
- Bằng chỉ khôi phục khi còn bản ghi tốt nghiệp xác nhận. Save cũ đã xóa cả hồ sơ không đủ căn cứ để tự cấp bằng; chưa có save thật người góp ý để đối chiếu. Cổ đông cũ thiếu liên kết danh tính không tự ghép theo tên trùng.
- Các nhóm dữ liệu rộng của yêu cầu trước (danh mục chương trình/học phí/quy chế mọi trường, homeschool theo vùng, đối chiếu từng câu quốc gia, di trú/phúc lợi/y tế/tài chính, luật hoàng gia lịch sử, thể thức/FIFA, chủ nợ cửa hàng khi chuyển thế hệ) VẪN MỞ. Không chuyển thành nghiệm thu đơn thuần hoặc đánh dấu đã hoàn tất toàn BACKLOG.
- GĐ6: chưa nghiệm thu toàn diện, thiết bị/save thật và REVIEWS_DB Production chưa xác minh. Bản72 giữ packaged cho tới khi chủ dự án xác nhận upload.

- Bản72: package:cloudflare PASS28file/3513880byte, SHA2568133799687D4B53CE348885D5B2511BBF6C33541102B4D0B5DBF42C81DA9C21C; loading/API-admin cục bộ và16view giáo dục/phối ngẫu hoàng gia trên dist đạt. Nhật ký195mục,194mục cũ không đổi; kiểm JSON/HTML, tìm/lọc/tải thêm390/1280 đạt. Chi tiết PLAYER-FEEDBACK-872.md.

### Tiếp tục toàn phạm vi sau72

Chủ dự án yêu cầu làm hết mục triển khai rồi mới gói chung, bỏ nghiệm thu toàn diện. Ma trận hiện hành và nguồn/kiểm thử ở [BACKLOG-IMPLEMENTATION-873.md](BACKLOG-IMPLEMENTATION-873.md). Các mục rộng vẫn mở cho đến khi có triển khai và đối chiếu đủ; artifact72 không phải bản của thay đổi đang làm.

Đã qua kiểm thử trọng điểm cho phần đã triển khai về khoản vay cửa hàng, tuyển sinh Y/Luật Mỹ, học tại nhà Pennsylvania/Québec, đổi đội tuyển, nhập tịch theo cư trú, ly hôn England/Wales và sổ kỳ hạn NS&I. Bổ sung dữ liệu ngành, hồ sơ họ tên Tây Ban Nha, nguồn lao động và chi trả y tế cho phạm vi ghi trong ma trận. Các mục triển khai còn lại vẫn mở.

Theo yêu cầu đóng gói riêng sau đó, 8.10.73 Preview đã tạo dist và dist.zip mới. Trạng thái các mục triển khai xem sổ tiến độ. Bản này chưa được xác nhận phát hành.
