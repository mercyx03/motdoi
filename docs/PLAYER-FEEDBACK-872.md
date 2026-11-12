# Góp ý người chơi — 8.10.72

Trạng thái: HOÀN THÀNH TRIỂN KHAI NHÓM GÓP Ý — đang kiểm thử/đóng gói; chưa nghiệm thu toàn diện. Không đồng nghĩa đã hoàn tất toàn bộ dữ liệu trong BACKLOG.

## Phạm vi đã triển khai

- Ngành Y: sửa hạn dự kiến khi nội trú kéo dài ba năm; sửa lại mốc cho bản lưu có hồ sơ nhập học, hướng Y và nội trú đủ căn cứ. Không coi bảo vệ đạt là đã tốt nghiệp nếu còn thiếu điều kiện. Hook tại thời điểm tốt nghiệp ghi đúng ngành, trường, tuổi hoàn tất và hướng đào tạo. Nâng bản lưu chỉ phục hồi bằng có bản ghi xác nhận.
- Menu: đang học chỉ xem tiến độ/đóng; người tốt nghiệp chuyển sang tìm việc theo bằng hiện có hoặc chủ động chọn chương trình khác. Đóng nguyện vọng không gọi ngã rẽ phổ thông hoặc tự chọn đi làm. Ngành Y có mục nghề nghiệp riêng để tiếp cận vị trí theo hướng đã học, dùng cơ chế tuyển dụng hiện có.
- Anh: thu gọn thông tin dài trong details, giữ nguyên nội dung bảng điểm/điều kiện. Hồ sơ có submitted → nhận kết quả → offer → xác nhận nhập học, rút và hết hạn. Kết quả dùng lại bộ xét tuyển hiện hữu trên bản sao để không đổi việc học/tiền khi mới xem kết quả; xác nhận kiểm lại điều kiện trên nhân vật thật. Đây là các bước thao tác trong game, chưa là mô hình toàn bộ lịch UCAS từng kỳ/trường.
- Nhịp sự kiện: giảm chuyện ngẫu nhiên không lặp, tối đa một chuyện đời thường và có năm bỏ trống ở cổng trigger. Lịch hẹn, các mốc bắt buộc, chuỗi rep và thao tác chủ động không đi qua cổng này. Giảm nhịp bù sự kiện tuổi thơ, giữ mốc một tuổi.
- Cổ phần: hỏi mua 1%, nửa phần hoặc toàn bộ phần của từng cổ đông gia đình trưởng thành. Người bán có thể từ chối/counteroffer; chờ năm sau, kiểm tra tiền dự phòng, đúng danh tính, cổ phần và hạn. Thanh toán từ tiền cá nhân sang sổ người bán, không dùng tiền công ty. Có phân trang và liên kết sang bầu người điều hành, vận động, liên minh. Các cơ chế phiếu và bổ nhiệm hiện có tiếp tục áp dụng.
- Di sản: lưu ánh xạ danh tính cổ đông/anh chị em qua đời con theo tên, giới và mốc sinh xác định; nhận công ty dùng danh tính chuẩn, không tạo NPC trùng. Đã kiểm thực tế di sản chia 50/50 và gia đình ba anh chị em.
- Cám dỗ: cơ hội tăng theo tài sản/fame nhưng có trần và cooldown. Ưu tiên người quen trưởng thành phù hợp, loại người thân; không đổi bạn đời hoặc tự ngoại tình theo mức giàu. Từ chối lưu ranh giới với người đó. Chọn ngoại tình mở xác nhận của hệ quan hệ107/108; giữ một danh tính. Nhắn tin có lịch tiếp diễn sau hai năm, nêu tên và tuổi lúc bắt đầu, không áp sang người phối ngẫu khác hoặc người đã mất.
- Hoàng gia: panel và nút Hoàng gia cho phối ngẫu còn sống đang kết hôn; đúng nhà/country của phối ngẫu, các nút tuân theo quyền hiện có. Ẩn khi ly hôn/góa nếu bản thân không thuộc hoàng gia.
- Phim: lưu các phim đóng máy chờ phát hành khi nhận phim tiếp; xử lý từng token dù trùng tên, chống nhận tiền/thành tích hai lần. Giao diện liệt kê hàng chờ, lưu/tải và đổi tiền giữ dự án.
- Lương quản lý gia đình/chủ tịch: loại khỏi nhánh thuế lợi nhuận kinh doanh cá nhân, tiếp tục tính theo tiền lương; giữ chi phí công ty và gross trước điều chỉnh.
- Phần tiếp từ phiên trước: J.D. Harvard có tài liệu, CAS, LSAT, xét/phỏng vấn, thư nhận học, giới hạn ba lần nộp; MD Harvard/UCLA và J.D. Harvard đúng niên hạn cho tuyển sinh mới. Dùng STUDY54 hiện hữu.

## Kiểm thử

Các ca chuyên đề: medical-progress872 (19), uk-application872 (12), professional-degree872 (16), hls872 (19), family-shares872 (20), films872 (8), temptation872, pacing872 (902), courses871 (40), institutions867 (804), education-fallback-graduation (104), university136, player107 (84), business137 (80), treasury-deals165-166 (123), dynasty908 (2285), continuity101 (361), showbiz-actor (51), relationships108 (76), md5-920 (118), welfare918 (160), pace-gd5 (184) đều đạt ở các lượt chạy đã ghi. Suite nhịp sự kiện có đo 30 đời; không thay thế full regression.

Chrome390/1280: education872-browser đạt8 view, gồm đóng menu Y và chuỗi Anh nộp → kết quả → xác nhận; bảng điểm/điều kiện đầy đủ trong details. royal-panel872-browser đạt8 view thường/đã cưới/ly hôn/góa; không lỗi JS hoặc tràn ngang. Quick trên mã cuối sẽ ghi bổ sung sau khi kết thúc.

business137 ban đầu thất bại cùng assertion trên HEAD43df134 khi nạp nguồn nguyên bản bằng git show. Điều tra tìm được tính thuế lợi nhuận lần nữa trên tiền lương quản lý; đã sửa logic và kỳ vọng thu nhập sau điều chỉnh bền vững/PIT, không hạ điều kiện kiểm tra bảo toàn chi phí công ty.

## Giới hạn chưa được đóng

- Chưa có bản lưu thật của người báo lỗi Y. Nếu bằng/lịch sử đã bị xóa hết trước bản này, không đủ căn cứ tự cấp bằng. Không phục hồi phim đã bị ghi đè nếu không còn hợp đồng/token.
- Cổ đông di sản cũ thiếu ánh xạ không tự ghép chỉ theo tên; cần bản lưu có căn cứ danh tính để đối chiếu. Người thân không tự động nhượng cổ phần; chưa thêm NPC tự tổ chức thâu tóm tài sản của người chơi.
- Hồ sơ J.D. nhận GRE đã có kết quả nhưng chưa có hành động thi GRE riêng. MCAT/prerequisites, mọi học phí/học bổng/giấy phép và lịch tuyển sinh từng cơ sở chưa được phủ toàn bộ. Không coi bằng MD/J.D. là mọi giấy phép hành nghề.
- Các nhóm dữ liệu triển khai rộng của yêu cầu trước còn mở trong BACKLOG và HANDOFF-CLAUDE-871; không đẩy sang mục chỉ nghiệm thu. Chưa chạy full regression theo yêu cầu, chưa nghiệm thu thiết bị/save thật và REVIEWS_DB Production.

## Nguồn giáo dục

- https://hls.harvard.edu/jdadmissions/apply-to-harvard-law-school/jdapplicants/
- https://hls.harvard.edu/jdadmissions/apply-to-harvard-law-school/jdapplicants/jd-application-components/
- https://www.lsac.org/lsat/register-lsat/lsat-cas-fees
- https://medstudenthandbook.hms.harvard.edu/105-five-year-md-program
- https://catalog.registrar.ucla.edu/browse/College%20and%20Schools/DavidGeffenSchoolofMedicine/Medical-Programs

Điểm, xác suất, phí sinh hoạt và khoảng xử lý theo năm là cơ chế cuộc đời; không coi là điểm chuẩn hay lịch công bố chính thức. Phần tách thao tác hồ sơ Anh không thêm khẳng định luật tuyển sinh mới.

## Artifact và khôi phục

Chờ kết quả đóng gói mới; không coi gói8.10.71 đang có là bản72. Baseline khôi phục:43df134, nhánh codex/life-context-upgrade. Không deploy Cloudflare; chủ dự án tự upload. Giữ binding REVIEWS_DB đang dùng, không ghi database Production. Thay đổi có sẵn ở healthsys919.js không thuộc đợt sửa/commit này; bản dựng từ workspace vẫn bao gồm nó.

Mã cuối trước đóng gói: smoke11/11, saves10/10, save-safety10/10, NPC14/14 PASS. Các cảnh báo fixture cũ/ID tạo theo giờ được giữ nguyên trong log; không có ca thất bại hoặc timeout.

## Kết quả đóng gói cuối

- npm run package:cloudflare PASS:28file; ZIP3513880byte; SHA2568133799687D4B53CE348885D5B2511BBF6C33541102B4D0B5DBF42C81DA9C21C. So toàn bộ tên/hash ZIP-dist đạt.
- Loading:8cuộc đời nguồn/bundle giống nhau; API/admin cục bộ PASS, không chứng minh REVIEWS_DB Production.
- Trên dist: education872-browser8view và royal-panel872-browser8view390/1280 PASS; nhật ký195mục đồng bộ JSON/HTML, 194mục cũ nguyên dữ liệu,12ý của bản72 hiện đủ. Tìm không dấu/lọc/tải thêm/hẹp-rộng PASS.
- GitHub đã xác minh lại mercyx03/motdoi công khai, push/admin;0workflow/0hook/0deployment. Nhánh codex/life-context-upgrade; không merge main, không deploy.
- Sẵn sàng upload Production: CHƯA theo điều kiện nghiệm thu dự án; artifact là Preview mới. Không chạy full regression theo yêu cầu.
- Khôi phục: dùng dist.zip tại commit43df134 để upload lại Dashboard; giữ bản lưu trước thử nghiệm. Không reset lịch sử nhánh hoặc ghi đè database.

## File thuộc đợt sửa

- Giao diện: public/index.html, public/css/style.css, public/js/app.js.
- Giáo dục: public/js/engine.js, institutions867.js, life102.js, life136.js, life40.js, life67.js (các module trong public/js).
- Gia đình/nghề: public/js/kin920.js, life137.js, life145.js, life154.js, life166.js, star919.js, welfare918.js.
- Phiên bản/nhật ký: package.json, package-lock.json, CHANGELOG.md, docs/update-extra.json, public/data/updates.json; docs/BACKLOG.md, HANDOFF-CLAUDE-871.md và báo cáo này.
- Test mới: education872-browser, family-shares872, films872, hls872, medical-progress872, pacing872, professional-degree872, royal-panel872-browser, temptation872, uk-application872, feedback872-updates-browser trong tests/*.js; điều chỉnh tests/business137.js và tests/courses871.js theo hành vi đã xác minh.
- Artifact theo chính sách hiện hành: dist.zip được theo dõi, dist/ vẫn ignore. Không stage các thay đổi riêng có sẵn hoặc file bảo vệ.
