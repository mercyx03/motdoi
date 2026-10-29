# Một Đời — Nâng cấp chiều sâu nghề nghiệp và di cư 8.10.0

HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN.

## Phạm vi

- Nối fandom/niềm tin/định hướng, quản lý một hoặc ba năm, phần chia thù lao, rời hợp đồng và khủng hoảng nhiều năm vào danh tiếng và kênh hiện có. Cát-xê video, quảng cáo, hoạt động kênh và thu nhập nghề có tác động thật; báo giá quảng cáo chốt một lần.
- Đồng đội định danh, tin cậy/tính cách, thay vị trí và chuyển câu lạc bộ; giữ đối thủ esports và bóng đá qua mùa. Chấn thương/áp lực ảnh hưởng sức mạnh thi đấu và lương; không tạo đồng đội cho môn cá nhân.
- Giải nghệ esports/thể thao giữ tiền và fame, không ép nghề hay cấp 20.000 fame. Có hồ sơ sau giải nghệ; tự ứng tuyển hoặc gây dựng kênh và dùng tìm việc thông thường.
- Mở rộng du học107: thư nhận học/học bổng tách visa, giữ việc/nơi ở khi chờ; phí và hoàn học phí, thời hạn thư, hồ sơ cũ chờ visa, quy đổi khoản dự trù chưa sử dụng. Visa du lịch có mục đích riêng.
- Cư trú: hòa nhập/nhớ nhà/ngoại ngữ và liên lạc; chuyển chương trình đối tác cùng nước lùi mọi mốc học một năm; tìm việc hai năm sau học, xét cư trú lao động qua năm sau, định cư sau tối thiểu bốn năm lao động hợp lệ trong mô phỏng. Tình trạng định cư cũ được giữ. Quá hạn dừng tiến trình làm việc/lương, không tự đổi quốc tịch.
- Hồ sơ định cư114 kiểm lại ngoại ngữ và quỹ khi đến lượt xét; giữ tuyến chuyển nơi ở, giấy phép xuất cảnh, nhập tịch, tiền tệ và API hiện có.

## Tệp thay đổi

public/js/career-depth.js, public/js/abroad-depth.js, public/js/careers.js, public/js/engine.js, public/js/football.js, public/js/life69.js, public/js/life105.js, public/js/life107.js, public/js/life114.js, public/js/life131.js, public/index.html, tests/depth900.js, CHANGELOG.md, docs/update-extra.json, public/data/updates.json, docs/BACKLOG.md, báo cáo này và dist.zip.

Giữ nguyên các sửa đổi cục bộ có sẵn ở public/js/app.js, public/js/life-action-fixes.js, tests/actions-cap895.js và các tệp bảo vệ. Không stage/commit các đường dẫn đó; artifact lấy thư mục public hiện tại nên có chứa các sửa đổi giao diện có sẵn. Không tuyên bố dist.zip chỉ được dựng từ các tệp thuộc commit mới. Không sửa/commit audit-world-520.json, .local-state-review.txt hoặc Claude.md. Không thay chính sách tracking/ignore; giữ CRLF của nguồn trên đĩa, Git vẫn có .gitattributes eol=lf.

## Kiểm thử

- tests/depth900.js: 58 kiểm tra đạt (fandom, hợp đồng, tái diễn khủng hoảng, roster, đối thủ, áp lực/chấn thương, giải nghệ thật, visa đúng mục đích, từ chối/giữ việc, chống lặp, hoàn phí, chuyển học, cư trú/định cư, fluent certificate expiry, JSON roundtrip và giới hạn tuổi).
- npm run test:quick: smoke 11 ca; saves-compat 10 ca/60 fixture lịch sử; save-safety 10 ca; NPC14 ca đều đạt. Fixture mô phỏng không phải bản lưu thật của người chơi. Cảnh báo seed theo giờ thật và fixture Hardcore cũ đã được bộ test giải thích, không coi chúng là tính năng mới.
- careers105:355; world120:74; showbiz-audit:56; football-career:179; feedback-a:39; integration-showbiz:91; football897 và creator132 đều đạt. update560 đạt690 kiểm tra esports. update-showbiz đạt kiểm tra lịch sử.
- Regression trọng điểm31/35/37/48/52:80 đạt,0 lỗi. Chưa chạy regression toàn bộ; không coi nhóm chưa chạy là PASS.
- Chrome headless localhost390/1280:42 kiểm tra, mở8 menu, nhấn Gặp fan và đọc lại lưu, không tràn ngang, nhật ký mới/tìm không dấu. Đã xem ảnh chụp bố cục. Không thay cho Android/iOS thật.
- Nhật ký: mục mới packaged/releasedAt=null, đồng bộ hai nguồn; chạy build-update-history rồi đối chiếu toàn bộ123 mục cũ không thay đổi. update-release:446 kiểm tra đạt. Dữ liệu tĩnh độc lập D1.

## Giới hạn nghiệm thu GĐ6

Cần regression đầy đủ trên mã cuối, cân bằng nhiều cuộc đời nhiều mùa và mức fame, Android/iOS thật, bản lưu thật gặp lỗi, cấu hình Pages/REVIEWS_DB thực tế. Thời hạn/chi phí/xác suất visa là luật mô phỏng, không phải tư vấn luật hoặc danh sách giấy tờ của mỗi quốc gia. Chuyển học là tuyến chương trình đối tác mô phỏng, không cung cấp danh mục mọi trường. Không thay mọi chuyến du lịch sự kiện cũ thành hồ sơ visa; luồng hồ sơ chủ động mới phân biệt mục đích. Môn thể thao ngoài bóng đá dùng sự kiện giải/câu lạc bộ cũ; chưa mô phỏng từng trận đầy đủ như bóng đá/esports. Chưa thử thay người giữa trận hoặc thị trường chuyển nhượng toàn thế giới cho mọi môn.

## Build và Git

Chạy npm run package:cloudflare trên Windows; dùng tools/build.js, loading/admin API cục bộ, ZIP đối chiếu tên và SHA256 từng entry. Giữ _worker.js, _routes.json, _headers và file dấu chấm. Không deploy. Kết quả cuối:28 file triển khai; ZIP2.635.194 byte; SHA256 2CA2180936177771FD99C57FF62847928318A8504EB31D38ABB1AC208EA3C623. Tên/nội dung từng entry bằng dist; JSON và HTML trong ZIP có nhật ký mới packaged. Commit ghi trong báo cáo bàn giao cuối.

Remote origin=https://github.com/mercyx03/motdoi.git; nhánh codex/life-context-upgrade. Kết nối GitHub xác minh repository public, tài khoản có quyền push/admin. Remote nhánh khớp b0b0e759f9f981eeb7856aec9aa98493ac7bb839 trước thay đổi. Không có .github trên nhánh, commit trước không có trạng thái CI/deploy; dự án theo Direct Upload thủ công. Không thay tích hợp hay cấu hình Cloudflare.

## Khôi phục

Mốc trước đợt này: b0b0e759f9f981eeb7856aec9aa98493ac7bb839. Nếu cần hoàn tác, dùng git revert commit của đợt này trên nhánh, kiểm thử/đóng gói lại và để chủ dự án upload hoặc rollback deployment cũ trên Dashboard. Không reset/force-push, không đổi hoặc khôi phục D1 Production từ ZIP.
