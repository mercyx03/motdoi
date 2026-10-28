# Bóng đá chuyên nghiệp 8.9.2 — mô hình và nghiệm thu

## Audit và tích hợp

Đã đọc các điểm kết nối trong careers.js, sports.js, engine.js, childhood/scenarios,
life3/52 (thu nhập, BHXH, thành tích), life89 (hợp đồng trẻ), life110 (menu có kiểm tra),
life120/138/146/173 (địa phương, danh tính, học tập, cư trú), life161/162 (vòng đời hợp đồng),
esports-data/esports-finance và life174 (nghề nhà nước).

Hệ thống cũ tự nâng bậc theo skill, trao cúp/huy chương theo xác suất, không có lịch đấu
hoặc hợp đồng bóng đá. Vì vậy mở rộng nghề `vdv` và `E.SPORTS`, không thêm nghề cầu thủ
song song. Dữ liệu ở football-data.js; logic ở football.js; menu qua UPDATE110;
tiền lương trả về `careerYear` để finance chỉ cộng một lần. Hỗ trợ học viện là khoản riêng,
không phải lương cầu thủ. Không gọi Worker hoặc D1 để lưu/công bố nhật ký.

Nghề khác vẫn đi qua chuỗi careerYear cũ, sở trường/skill của nghề hiện tại không bị hobby
bóng đá ghi đè. Chặn các sự kiện bóng đá cũ trao cúp, chuyển nước và ký trẻ bên ngoài
điều kiện hệ thống mới. Bản lưu vận động viên bóng đá cũ nhận hợp đồng chuyển tiếp hai năm;
không tự tạo dữ liệu bóng đá trên save nghề khác. Không sửa life174 hoặc các file bảo vệ.

## Gameplay hiện có

- Phát hiện cơ hội 10–12 tuổi, bắt đầu địa phương, tự chọn vị trí và chương trình tập.
- Thử nhiều CLB; nhận/từ chối/hẹn thử lại/đề nghị cấp thấp/liên hệ từ đội khác;
  nhận lời mời bằng thao tác riêng, không tự đưa vào đội ngẫu nhiên.
- U15/U17/U19/U21, hỗ trợ đào tạo, học văn hóa, ảnh hưởng gia đình; hợp đồng chuyên nghiệp
  từ 16 tuổi, gia hạn/chuyển nhượng, cho mượn một năm rồi trở về, hết hạn tự do.
- Mười chỉ số chuyên môn, phong độ/thể lực/tiềm năng/ổn định/hồi phục; trọng số theo vị trí,
  lối chơi theo chiến thuật, chấn thương khi tập/đấu, tuổi đỉnh cao và suy giảm.
- Lương USD danh nghĩa theo thị trường, đội, vai trò, vị trí, tuổi, năng lực/danh tiếng;
  thưởng ra sân, phí ký một lần, tài trợ khi đủ danh tiếng quốc tế; chi phí thuế/đại diện
  mô phỏng 15%. Thu nhập được quy đổi bằng đơn vị tài chính hiện có, phí chuyển nhượng
  thuộc đội bóng. Hợp đồng không trả lương hai lần trong cùng năm.
- Mùa giải rút gọn bốn đội mỗi hạng, lượt đi/về, mô phỏng các trận còn lại để tạo BXH;
  cúp loại trực tiếp, cúp châu lục vòng bảng rồi knock-out, kiểm thành tích mùa trước.
  Club World Cup từ 2025 theo chu kỳ bốn năm, cần vô địch cúp châu lục trong bốn mùa trước.
- Triệu tập U17/U20/U23/đội tuyển lớn; giao hữu, vòng loại năm trước giải, vé dự VCK lưu lại;
  kiểm quốc tịch gốc, liên đoàn, tuổi, thể lực, năng lực/phong độ và phút thi đấu.
- Thành tích CLB/đội tuyển, danh hiệu theo kết quả và điều kiện có ra sân; lịch sử mùa/hợp đồng,
  HLV có tên/ID/tính cách/tín nhiệm/lịch sử theo từng CLB. Giải nghệ và nghề HLV/tuyển trạch/
  bình luận có điều kiện; không thay đổi quốc tịch khi chuyển nơi cư trú.

## Phạm vi dữ liệu

16 thị trường / 192 CLB cấu hình: VN, JP, KR, TH, GB, ES, DE, IT, FR, BR, AR, US, MX, EG, ZA, NZ.
Hai đội đầu mỗi thị trường có tên thật; các đội còn lại được ghi rõ mô phỏng.
Giải quốc nội theo tên thị trường; cúp quốc gia; UEFA Champions League/Europa League,
AFC Champions League Elite, Libertadores, CAF Champions League, CONCACAF Champions Cup,
OFC Champions League, FIFA Club World Cup. Asian Cup, Euro, Copa América, AFCON, Gold Cup,
OFC Nations Cup và FIFA World Cup; giải trẻ tổng hợp theo liên đoàn.

## Giới hạn minh bạch

Đây là mô hình gameplay, không phải dữ liệu lương/đội hình thật hoặc tái hiện lịch sử.
Không mô phỏng toàn bộ thế giới, 32/48 đội VCK hay mọi vòng loại chính thức; nhóm bốn đội
và ba vòng loại trực tiếp là mô hình rút gọn. Chưa tự lên/xuống hạng CLB; đổi hạng qua hợp đồng.
Chưa có cấu hình thể thức từng thời kỳ lịch sử; các mốc hiện đại được dùng trong mô phỏng.
Đội tuyển gắn với quốc gia sinh ra của save, chưa xử lý nhập tịch kép/switch liên đoàn.
Vé vòng loại của đội tuyển chỉ được mô phỏng trong mùa nhân vật được triệu tập; chưa có
thế giới đội tuyển hoạt động độc lập khi nhân vật vắng mặt. Tài trợ tự ghi nhận khi đủ điều kiện,
chưa có đàm phán nhãn hàng riêng. Hồi phục tính theo năm với số tuần còn lại; không có điều khiển
thời gian thực. Chưa thêm nghề quản lý CLB mới vì có thể tái sử dụng các nghề quản lý hiện có.
Những giới hạn này không được trình bày là đã triển khai thể thức chính thức đầy đủ.

## Kiểm thử

`node tests/football-career.js`: hành trình nhiều mùa từ 12 đến 39 tuổi, hợp đồng/thu nhập,
giới hạn năng lực/tuổi, từ chối, retry, hết hạn, chuyển nước/quy đổi, loan/return, chấn thương,
không gọi tuyển, điều kiện dự cúp/chu kỳ, không cộng trùng, save cũ và giữ nghề nhà nước.
`node tests/browser-football.js`: menu, click chọn vị trí và lưu thật trên browser headless,
390/1280px, trang cập nhật/nhãn phát hành/tìm không dấu. Ảnh kiểm tra trong .cache/football-review.
Smoke, saves-compat, save-safety, NPC, state-career174, careers105, contracts161-162 và
update-release là nhóm hồi quy có ảnh hưởng. Không suy ra regression đầy đủ từ kiểm thử trọng điểm.

## Tài liệu đối chiếu

- FIFA: https://inside.fifa.com/news/all-six-fifa-member-confederations-assured-places-at-expanded-2025-fifa-club
  (chu kỳ bốn năm và tiêu chí tham dự Club World Cup; mô hình game rút gọn danh sách/vòng đấu).
- AFC: https://www.the-afc.com/en/national/afc_asian_cup.html/news/qualifiers-final-round-md1-preview
  (phân biệt vòng loại và VCK Asian Cup; game không sao chép đầy đủ vòng loại thật).

## Trạng thái bàn giao

HOÀN THÀNH TRIỂN KHAI MÔ HÌNH RÚT GỌN — KIỂM THỬ TRỌNG ĐIỂM — CHƯA NGHIỆM THU TOÀN DIỆN.
Chủ dự án yêu cầu mục nhật ký mới hiển thị “Đã phát hành” ngay trong artifact bàn giao;
đã dùng release-update với thời điểm chuẩn bị thực tế. Nhãn này không chứng minh website đã
được upload. Không deploy Cloudflare hoặc sửa dữ liệu production. Binding REVIEWS_DB chưa kiểm.

## Sửa tương thích phát hiện trong nghiệm thu

Hồ sơ công vụ có KPI phụ thuộc kiến thức/danh tiếng; các giá trị này còn đổi sau hook năm.
Bổ sung gọi syncState hiện có ở cuối endYear để bản trong bộ nhớ và sau tải lại khớp nhau,
không sửa thuật toán hay mã life174. Ca 10-reload-continue đã đạt lại với 55 save cũ chơi tiếp.
Hiển thị báo cáo bóng đá giữ xuống dòng riêng; các hộp lựa chọn khác giữ cách hiển thị cũ.

Workspace trước yêu cầu có nhiều thay đổi chưa commit và hai module life173/life174 chưa được
theo dõi. Gói dist/ZIP dựng từ toàn bộ workspace hiện tại để giữ các nâng cấp đang có; commit
bóng đá chỉ stage phần của yêu cầu này, không thu gom các sửa đổi cũ hoặc file được bảo vệ.
Vì thế artifact bàn giao còn chứa các thay đổi trước đó chưa có trong commit mã nguồn bóng đá.
Chủ dự án đã xác nhận nhánh chỉ upload ZIP thủ công, push không kích hoạt deploy Cloudflare.

Save cầu thủ cũ ở thị trường chưa có cấu hình giữ cơ chế nghề/lương trước đó cho đến khi
chủ động ký hợp đồng trong thị trường hỗ trợ; không tự làm mất thu nhập vì thiếu dữ liệu CLB.

## Kết quả cuối — 28/10/2026, UTC+7

- football-career: PASS 180; chạy lại trên riêng nội dung Git stage cũng PASS 180.
- browser-football trên dist cuối: PASS 32 (390/1280px, thao tác và save, xuống dòng, nhật ký released/tìm không dấu); đã xem ảnh.
- smoke: 11/11; save-safety: 10/10; saves-compat: 10/10; NPC: 14/14.
- state-career174: 50; careers105: 355; contracts161-162: 53; update-release: 369 — PASS.
- package:cloudflare: PASS; loading nguồn/minify qua 8 cuộc đời khớp hoàn toàn; admin/Worker test cục bộ PASS (1642 mục).
- ZIP: 28 file, 2572313 byte; đọc lại toàn bộ entry và đối chiếu SHA-256 với dist PASS.
- SHA256 ZIP: 2B9E038FEF2776AEB38CFA21F9688D274DE5D1C8C3A36D4096CEE569AF22CDFA.
- JSON/HTML trong ZIP: football-career-892 ở đầu, released; 28/10/2026 15:55:41+07:00 theo yêu cầu chủ dự án. Các mục cũ được giữ nguyên.
- Giữ index.html, _worker.js, _routes.json, _headers, .well-known/ai-catalog.json; không binding/database/secrets trong ZIP.
- Chưa chạy regression toàn bộ, chưa có mẫu save cầu thủ thật/thiết bị thật; REVIEWS_DB Pages chưa kiểm. CHƯA production-ready.
- Cảnh báo smoke đã biết: life.id dùng giờ thật nên cùng seed khác ID khi tạo đời mới; save giữ ID.

### File thuộc commit bóng đá

public/js/football-data.js; public/js/football.js; public/js/app.js; public/css/style.css;
public/index.html; docs/update-extra.json; public/data/updates.json; tests/football-career.js;
tests/browser-football.js; tests/loading.js; docs/FOOTBALL-CAREER.md; docs/BACKLOG.md; dist.zip.
Chỉ hai dòng nạp bóng đá và mục nhật ký bóng đá được stage trong các file đang có sửa đổi cũ.

### Khôi phục

Commit trước đợt: 2b9872b84ec1a6fc18b5d03a2a828fa981056571. Để quay lại bản website cũ,
chủ dự án chọn deployment trước trên Cloudflare Dashboard. Với mã nguồn, sao lưu toàn bộ
thay đổi chưa commit trước rồi revert riêng commit bóng đá; không reset cứng hoặc xóa file
đang làm. Build lại theo package:cloudflare và kiểm ZIP trước lần upload kế tiếp.
