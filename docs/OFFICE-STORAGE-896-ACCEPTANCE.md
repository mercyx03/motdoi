# Một Đời 8.9.6 — văn phòng gia đình và lưu trữ

Trạng thái triển khai: HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN.

## Hành vi đã triển khai

- Mở rộng OFFICE171/PARTY172 hiện có, giữ mã nhân sự, danh tính, lương, hợp đồng, lịch sử và cơ chế tiệc. Không tạo đội ngũ hoặc hệ thống tài chính song song.
- Bàn làm việc xuất hiện khi có nhân sự/hồ sơ, giữ khung khi tuyển, thưởng, giao nhiệm vụ, đổi hạn mức, chuẩn bị và duyệt tiệc. Có nút đóng ở đầu/cuối và phím Esc.
- Trước đây office171 chỉ kiểm tuổi; nay đường tuyển dụng kiểm tự lập và dự phòng theo lương. Ủy quyền cần hợp đồng thực, nhân sự còn sống/đang làm việc/đã trả lương. Giàu ở tuổi 19 vẫn có thể tuyển hợp lệ; tuổi 19 tự nó không mở quyền. Khung ủy quyền cũ không đủ điều kiện được gỡ khi migrate.
- Nhân sự phù hợp xử lý bảo trì, việc nhà, lịch gia đình và báo cáo theo nhiệm vụ/hạn mức. Không thu tiền báo cáo doanh nghiệp khi không có doanh nghiệp hoặc chuẩn bị gặp người quen khi chưa có người phù hợp.
- Thông báo hợp đồng/bàn giao/thiếu lương và báo cáo được tập trung. Có quyền tự gia hạn ba năm, chỉ khi đủ dự phòng hai năm lương; không tự gia hạn người đã báo nghỉ, không tự cài người kế nhiệm.
- Một số hồ sơ CEO/hội đồng/khủng hoảng (`companyLeadershipCase169`, `board123`, `crisis123`) được đưa vào bàn làm việc khi đã có nhân sự phụ trách báo cáo và được giao quyền. Quyết định lớn vẫn do người chơi; xong quay lại bàn làm việc. Không tuyên bố tất cả sự kiện trong game đã chuyển qua trợ lý.
- Tiệc chỉ cần chọn quy mô; nhân sự lập địa điểm/dịch vụ/các khoản dự toán và dự phòng. Chuẩn bị/đổi quy mô không thu tiền. Duyệt dùng PARTY172.host, giữ giới hạn lịch, địa vị, quyền mời, khách có thể từ chối và sổ chi thực tế. Không thay dự thảo tiệc riêng mà người chơi đang tự soạn.
- Duyệt hai lần, kế hoạch khác năm, đổi tiền tệ, nhân sự nghỉ/thay người, thu hồi quyền, thiếu tiền hoặc mất điều kiện địa điểm bị chặn trước khi tổ chức. Tiền tiệc dùng quỹ cá nhân đã duyệt, không rút ngân quỹ công ty.
- Thông báo toast chỉ là trạng thái, không nhận thao tác con trỏ; khắc phục việc toast che nút duyệt trên điện thoại. Đã tái hiện bằng hit test và nhấn chuột thật, không chỉ gọi button.click().

## Lưu trữ và an toàn dữ liệu

- SaveStore đọc cả JSON cũ và envelope `motdoi-lz16-v1`; nén bằng LZ-String 1.5.0, kiểm chiều dài/checksum và giải nén đối chiếu trước khi ghi. MAX_CHARS và giới hạn gửi cloud giữ nguyên.
- Khi quota đầy: thử nén các khóa lịch sử được chỉ định rồi thử ghi tiến trình; không xóa cuộc đời/nhật ký/gia phả để lấy chỗ, không đụng khóa đăng nhập. Lỗi vẫn giữ giá trị trước ở khóa ghi và thông báo chưa lưu.
- Bản hỏng tiếp tục được giữ trong `.held`; dữ liệu xuất/cloud vẫn là JSON thường. Màn hình đầu nhận biết cuộc đời đang nén; trang Cập nhật nạp codec/SaveStore trước account để không đọc nhầm lịch sử nén thành rỗng.
- Menu dấu ba chấm có công cụ Bộ nhớ & sao lưu: kiểm dung lượng kho mkn, nén lại và tải đầy đủ dữ liệu, kèm tiến trình mới nhất trong RAM khi chưa lưu được. Bản sao loại bỏ account/token/ratingVoter. Không yêu cầu xóa dữ liệu Safari hay gỡ PWA.
- Số MB Safari báo là tổng dữ liệu website, không chứng minh dung lượng trống của localStorage. Đây là cách khắc phục quota trong game, không cam kết chữa mọi lỗi Safari/thiết bị chỉ qua ảnh.

Thư viện và nguồn kỹ thuật:

- https://github.com/pieroxy/lz-string/tree/1.5.0 — mã nguồn và MIT license được giữ trong public/js/vendor; giấy phép cũng được đưa vào file notices hiện có `fonts-LICENSE.txt` của gói build.
- https://webkit.org/blog/14403/updates-to-storage-policy/ — lưu trữ website có thể bị từ chối khi chạm quota/thiết bị chịu áp lực lưu trữ; không suy ra mọi loại kho lưu có chung một hạn mức.

## Kiểm thử đã chạy

- `tests/office896.js`: PASS điều kiện, dự toán/tổng phí, không trả trùng, thu hồi quyền, người thay thế, thiếu tiền, khác năm, giữ bản draft, gia hạn có quyền, trả lương/nhiệm vụ một lần/năm, migrate.
- `tests/storage896.js`: PASS giữ 60 cuộc đời, Unicode/NUL, nén/lưu khi quota, checksum hỏng được giữ, inspect/migrate và bản sao không có thông tin đăng nhập.
- `tests/office896-browser.js`: Chrome 390/1280 PASS; thao tác chuột thật/hit test trên nút, duyệt tiệc, chỉnh liên tiếp, quota/thử lưu lại, phạm vi ủy quyền tuổi 19, hồ sơ CEO vào inbox và quay lại sau quyết định; không tràn ngang/lỗi runtime.
- `tests/storage896-browser.js`: Chrome 390/1280 PASS; tiếp tục đời nén, giữ 60 cuộc đời, trang Cập nhật/account đọc cùng codec, không tràn ngang/lỗi runtime.
- Smoke 11/11; saves-compat 10/10 (60 fixture); save-safety 10/10; NPC identity 14/14: PASS. Smoke có cảnh báo đã biết về tạo đời với giờ thật không hoàn toàn quyết định bởi seed.
- Hồi quy bị ảnh hưởng: office-parties171-172 33, treasury-deals165-166 123, enterprise-chains173 20, memorial-history 9: PASS. actions894 và payment-ui126 PASS. update-release 407 kiểm tra PASS.
- Không chạy toàn bộ regression. Fixture là dữ liệu tổng hợp, không phải bản lưu người báo lỗi. Chưa kiểm iPhone Safari/PWA thật, mẫu dữ liệu quota thật hoặc binding Pages REVIEWS_DB Production; ghi tiếp tại GĐ6 của BACKLOG.

## Git, phát hành và khôi phục

Repository `mercyx03/motdoi` công khai; kết nối có quyền push/admin. Remote origin và nhánh `codex/life-context-upgrade` đã đối chiếu; không có workflow .github trong checkout. Quy trình dự án là chủ dự án upload Dashboard. Không chạy deploy, sửa Pages/DNS hoặc D1.

Nhật ký `office-storage-896` giữ packaged/releasedAt null tới khi chủ dự án xác nhận upload. Không công bố đã phát hành chỉ từ commit hoặc ZIP.

Commit trước đợt: `02db6f9c3633e8b6a77b5355847a28c18a6e7527`. Khi cần quay lại logic cũ: xuất bản sao đầy đủ trước, tạo commit revert chọn lọc và đóng gói lại; giữ codec SaveStore/LZ-String/boot trên các trang đọc dữ liệu để bản nén đã ghi vẫn mở được. Không upload trực tiếp build cũ không có codec lên dữ liệu đã nén. Không reset/force-push lịch sử chung.

## Build cuối và bàn giao

- `npm run package:cloudflare`: PASS trên Windows. dist và dist.zip cùng bản mới, 28 file triển khai, ZIP 2.588.260 byte.
- SHA-256: `74EFED94B65B14E52E21E766D9E391D22BD1CBE2994D6903A496DADC8A83C901`.
- Đã mở ZIP, so toàn bộ tên và nội dung với dist. index ở gốc; Worker/routes/headers và file dấu chấm đầy đủ.
- Loading: hash tài nguyên/SEO/font/cache và 8 cuộc đời hoàn chỉnh nguồn/bản nén giống nhau PASS. Admin catalog: 1.574 mục, quyền truy cập PASS.
- Chrome trên chính dist: office896-browser thao tác chuột thật/hit test 390/1280 PASS (bao gồm toast không chặn nút); storage896-browser 390/1280 PASS.
- Nhật ký 8.9.6 đầu danh sách JSON và HTML nhúng, cùng nội dung trong ZIP. Chrome 390/1280 kiểm nhãn packaged, tìm kiếm không dấu và không tràn ngang PASS. MIT notice của LZ-String có trong gói.
- Không tự deploy; Production readiness CHƯA do chưa nghiệm thu tổng thể và chưa kiểm thiết bị Safari/PWA thật/binding thực tế.

Các file thay đổi: `public/js/office-inbox.js`, `public/js/life171.js`, `public/js/app.js`, `public/js/save-store.js`, `public/js/boot.js`, `public/js/vendor/lz-string.js`, `public/js/vendor/lz-string.LICENSE.txt`, `public/index.html`, `public/updates.html`, `public/css/style.css`, `tools/build.js`; các kiểm thử `office896.js`, `office896-browser.js`, `storage896.js`, `storage896-browser.js`, `save-safety.js`; `CHANGELOG.md`, `docs/BACKLOG.md`, `docs/update-extra.json`, `public/data/updates.json`, báo cáo này và `dist.zip`.

Giữ nguyên ba file riêng được bảo vệ, không stage/commit `audit-world-520.json`, `.local-state-review.txt`, `Claude.md`.
