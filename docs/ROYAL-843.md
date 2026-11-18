# Sửa kế tục hoàng gia 8.10.43

Trạng thái: HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN. Không mở giai đoạn mới, không deploy Production.

## Nguyên nhân và thay đổi

Đời con trước đây chỉ mang parent.royal (tier/title), tạo nhà mới theo ID đời mới. Registry, tước và họ hàng không được chuyển; thứ tự bị dựng lại với nhánh sai. kidsYear cũng bỏ qua mọi con có royal920, nên không sửa được hồ sơ thiếu; quy tắc GB chỉ nhìn giới tính cha/mẹ và bỏ sót con nữ quân vương.

- Thêm snapshot registry trong E.childOpts và phục hồi khi tạo đời con; E.heirAtAge phục hồi snapshot sau mô phỏng tới tuổi hiện tại. Ánh xạ chính xác ID người con thành player, player cũ thành ancestor ổn định; sửa liên kết cha/mẹ, phối ngẫu, seat/founder và trạng thái từng người. Giữ tước nguyên bản, kể cả lost; không phong tước chỉ theo thứ tự.
- Chuyển houses, met và people837; không chuyển ngân sách, ledger, quan hệ hẹn hò hay hồ sơ công vụ cá nhân của cha/mẹ sang con. Không biến tiền công thành tài sản riêng.
- Con được đối chiếu dữ liệu đang có; hồ sơ member thiếu được dựng lại bằng đúng ID con đã lưu. Cấp bù tước còn thiếu cho con nữ quân vương theo quy tắc mô phỏng hiện có; không xóa quyết định thu hồi tước. Quyền tước và quyền kế vị vẫn riêng, con nuôi không tự có quyền huyết thống.
- Danh sách Vai trò trong hoàng gia / trẻ hoàng gia có tước và vị trí; mở hành động vai trò cho người sinh trong hoàng tộc, không chỉ sau đám cưới.
- Bản lưu đã chuyển đời và mất registry trước bản sửa không có đủ chứng cứ để tái dựng chính xác cả gia tộc cũ; cần bản lưu đời cha/mẹ để khôi phục đúng, không bịa họ hàng. Đường bắt đầu từ sơ sinh mang snapshot gia tộc hiện có, không phải bộ dựng lịch sử mọi tước trong quá khứ; houseYear không mô phỏng lại cái chết trước mốc snapshot.

## Nhật ký

Chủ dự án chỉ định dùng giờ Việt Nam ngay bây giờ: công cụ release-update đã ghi 8.10.42 released lúc 2026-11-05T07:57:36+07:00. Mục 8.10.41 giữ nội dung trong docs/update-extra.json, private=true; bộ dựng loại ID private sau bước gộp để lịch sử cũ không tự làm hiện lại. Dữ liệu public và HTML build không chứa mục này. Trang còn lọc private để tương thích dữ liệu cũ. Bình luận D1 giữ nguyên.

## Nghiệm thu

Chuyên đề royal843: 59 kiểm tra; nhật ký update-history843: 172 kiểm tra gồm dữ liệu/HTML build, giữ lịch sử và private không hiện lại sau rebuild. Regression royal837 67, md5-920 117, heir-family770 32, children141 38, faith830, feedback842 138 và update-release 866 đều đạt. Smoke 11/11, saves 10/10, save-safety 10/10, NPC 14/14 đạt. Cảnh báo cũ về ID thời gian thực và quyết định Hardcore cũ không còn tồn tại được giữ nguyên.

continuity101.js FAIL ở "scholarship stipend replaces old salary". Đã chạy cùng assertion bằng royal920/royal837 của HEAD trước sửa (5becc47) trong bộ nạp VM, không ghi đè mã nguồn; lỗi giống hệt. Không tính nhóm này PASS hoặc tuyên bố đã sửa.

Chrome headless đạt 390/1280px: Vai trò, danh sách trẻ và chuyển đời con thật qua E.heirAtAge; có tước/vị trí, không undefined/NaN, không tràn ngang. Nhật ký 8.10.42 đã phát hành, 8.10.41 ẩn cả tìm kiếm, 8.10.43 packaged; bộ lọc và tải thêm đạt. Ảnh trong .cache/royal843-browser. Không tương đương thiết bị thật.

Cloudflare package PASS: 28 tệp, ZIP 3.228.640 byte; SHA-256 7B994AFD0293C3604A93A0EAFD76989628821D9B84D52D0C9010574DE4F16F67. Đọc lại từng tên/nội dung ZIP và so dist bằng SHA-256. Loading PASS gồm 8 cuộc đời nguồn/bản nén; API admin dùng DB bộ nhớ, không chứng minh Pages binding. Giữ _worker.js/_routes.json/_headers/.well-known. Không thay Worker/D1 trong đợt này.

Git: origin mercyx03/motdoi public, connector xác nhận quyền push; nhánh codex/life-context-upgrade, remote HEAD trước push trùng 5becc47. Không có thay đổi workflow hoặc cấu hình triển khai. Binding và webhook Cloudflare ngoài repository chưa xác minh. Chưa regression toàn bộ, thiết bị thật, save thật hoặc binding Pages. Workspace có healthsys919.js và các test sửa sẵn; không sửa hay stage chúng. ZIP build từ workspace có phần sức khỏe đó, không phải bản dựng sạch chỉ từ commit đợt này.

Khôi phục: commit trước 5becc47f16270d53cf872bebd38dddc8782c8cb3; dựng trong bản sao riêng rồi chủ dự án upload Dashboard, không reset workspace có thay đổi.
