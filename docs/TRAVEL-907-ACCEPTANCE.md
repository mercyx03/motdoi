# Một Đời — Đang nghiệm thu cập nhật đi lại và sinh hoạt địa phương 8.10.7

Theo chỉ thị mới: hoàn thiện cập nhật đi lại, build dist/dist.zip và commit/push trước; nghiệm thu toàn diện tiếp tục sau mốc này rồi đóng gói lại. Không deploy Production.

## Hành vi đã triển khai

- Mở rộng trip50/homeVisit894/culture173 qua travel-context.js, không tạo một hệ thống nhập cư mới.
- Hoạt động quê Việt Nam khi đang ở nước ngoài dẫn tới màn hình mua vé máy bay khứ hồi; concert có điểm đến Việt Nam cũng đi qua bước này trước khi mua vé vào cửa. Báo giá, không tự trừ tiền khi chỉ xem hoặc hủy.
- Sau khi bay, địa điểm thực sự chuyển về Việt Nam cho các hoạt động hợp tuổi/hoàn cảnh. Giữ quốc tịch, việc học, công việc và bản chụp hồ sơ cư trú ở nước đi. Có nút quay lại, không thu vé lượt về lần nữa. Kết thúc chuyến thăm trước kế toán năm; cả đường UI và runHeadless dùng cùng cổng trong engine. Lưu/tải giữa chuyến được hỗ trợ.
- Tiền và tài sản quy đổi theo cơ chế PPP hiện có khi đổi bối cảnh; quay lại đổi ngược, giữ các khoản chi thực sự đã phát sinh. Không tự gia hạn visa. Vé mô phỏng về Việt Nam 8/20/26 triệu đồng khứ hồi mỗi người theo nhóm chặng, hiện bằng tiền đang dùng; không phải báo giá thị trường.
- Máy bay nội địa chọn 63/34 tỉnh/thành Việt Nam hoặc thành phố tại quốc gia đang sống. Nhãn cho biết có thể nối chặng từ sân bay phù hợp; không tuyên bố mọi tỉnh đều có sân bay hoặc mọi cặp đều bay thẳng. Vé khứ hồi mô phỏng Việt Nam 2,4 triệu, ăn ở/hoạt động 1,6 triệu ở mức thường.
- Xe lửa chỉ đi vùng lân cận, 2 ngày, không mở điểm đến xa. Gói mô phỏng Việt Nam: vé khứ hồi 350 nghìn, ăn ở/hoạt động 1,2 triệu; mức dịch vụ tác động phần ăn ở, không nhân vé tùy tiện. Đây là tuyến gần tổng quát, không phải danh mục tuyến đường sắt thật.
- Sinh hoạt/ẩm thực/sự kiện theo nước và thành phố đang có mặt: nối món ăn, dịp lễ, chuyện riêng và việc làm của culture173; thêm bảo tàng, công viên và sinh hoạt cộng đồng có giá, giới hạn năm và hậu quả. Nội dung riêng chuyên sâu phụ thuộc dữ liệu sẵn có; không tuyên bố đã nghiên cứu pháp luật hoặc viết mọi sự kiện riêng cho 195 nước. Các nước đều có hoạt động theo nơi sống và nền văn hóa hiện có.
- Hành động dài hạn như đổi công việc/chương trình/chỗ cư trú cần kết thúc chuyến thăm trước. Các hoạt động vẫn có điều kiện tuổi, tài chính, lịch, quan hệ và giấy tờ; vé máy bay không bỏ qua các điều kiện đó.

## Kiểm thử / trạng thái

- transit907: 1.442 kiểm tra đạt (vé trước concert; 8 điểm đi × Việt Nam/thế giới; giữ tiền/visa/học/việc; lưu/tải; tàu gần; máy bay nội địa; chi phí; nội dung/city tại 195 nước; hủy/thiếu tiền và chuỗi hữu hạn).
- actions894 và continuity906 (2.069 kiểm tra) đạt sau bổ sung cơ chế bay. update500: 163.015 kiểm tra đạt trước sửa cổng kết toán nội bộ; chạy lại ở nghiệm thu tiếp tục.
- Smoke 11/11, saves 10/10, save-safety 10/10, NPC 14/14 đạt trong đợt; kết quả bản mã cuối và browser/build cập nhật bên dưới.
- Chưa nghiệm thu toàn diện. Bộ hồi quy cũ đã chạy đủ 77 nhóm trong đợt trước, có lỗi và 2 nhóm timeout; không tính PASS. Chi tiết tiếp tục ở docs/CONTINUITY-906-ACCEPTANCE.md và GĐ6 docs/BACKLOG.md.

## Vận hành

Nhánh codex/life-context-upgrade; origin https://github.com/mercyx03/motdoi.git, public và có quyền push/admin đã xác minh. Giữ nguyên Claude.md, audit-world-520.json và .local-state-review.txt. Chỉ stage các đường dẫn đã xem xét. Không merge/force, không tự deploy Cloudflare hoặc ghi D1 thật.

Nhật ký mới đặt đầu, giữ mục cũ, nhãn Đã phát hành theo chỉ thị riêng của chủ dự án; nhãn này không xác nhận website đã upload. Binding Pages REVIEWS_DB, thiết bị thật và save thực tế của người báo lỗi chưa được kiểm chứng. Artifact còn là Preview/chưa nghiệm thu đầy đủ.

Khôi phục mốc trước sửa: 96edeff838005b26dab96f8235ab30c6f2668bff. Hoàn tác commit cập nhật bằng git revert, đóng gói lại, chủ dự án upload gói đã kiểm chứng bằng Dashboard; không reset/force nhánh chung.

Browser nguồn: Chrome 390/1280px đạt chuỗi concert → xem/mua vé máy bay → về Việt Nam → máy bay nội địa + sinh hoạt → trở lại Canada → xe lửa gần + sinh hoạt Canada; không lỗi JS hoặc tràn ngang. Đã sửa quote khoản chi lớn để không tính chuyển đổi tiền là phí lượt về mới. Chuyên đề xác minh phí xác nhận đúng vé thật, lượt về đã trả là 0.

## Artifact và mốc commit ưu tiên

Windows package:cloudflare PASS: 188 module nguồn, 4 bundle minify, 28 tệp triển khai; loading kiểm 8 cuộc đời nguồn/build giống nhau, admin catalogue/API kiểm database giả đạt. ZIP đọc lại đủ tên và SHA-256 từng tệp so dist. dist.zip 2676304 byte; SHA-256 eaf4b9594fcee2acba15f08072b78907075baf5011fbe83c20ca497b37928b9a. Có đủ Worker/routes/headers và file dấu chấm.

Smoke mã cuối 11/11, saves 10/10, save-safety 10/10, NPC 14/14 đạt; có cảnh báo seed theo thời gian và tình huống Hardcore đã bỏ ở một số fixture cũ, không có ca timeout trong các bộ nhanh. Nhật ký 131 mục, giữ 129 mục trước và mục906; docs/public/dist/HTML đồng bộ. Chưa nghiệm thu toàn diện; tiếp tục kiểm trên commit này rồi đóng gói lại theo yêu cầu.

## Nghiệm thu tiếp sau commit ưu tiên (30/10/2026, UTC+7)

- Đã push mốc 2289d62fb0058b0f9eff4a93d4794b95b6b0ef6a trước khi tiếp tục nghiệm thu theo yêu cầu.
- Mã gameplay 907: 156/156 tệp headless và 12/12 tệp browser đạt; browser dùng Chrome 390/1280px. Không thay cho kiểm thiết bị thật. update500 chạy lại đạt 163.015 kiểm tra. Transit907 tăng lên 1.892 kiểm tra, thêm 50 vòng tiền tệ đi/về có lưu/tải; continuity906 đạt 2.069.
- Registry 1.380 mã đã chia 4 nhóm rời, giữ 67 khuôn và 4 lần thử mỗi lựa chọn, đồng hồ kiểm thử cố định, không giảm mẫu. Tổng 422.018 lượt chọn, 6.284.201 assertion đạt / 67 không đạt; cả 4 tiến trình kết thúc trong hạn. Các số này gồm kiểm fixture lặp ở mỗi shard, không phải số ca độc lập. Các mã không mở được bằng fixture chưa được coi là đã kiểm lựa chọn. Manifest/hash và kết quả chi tiết: TRAVEL-907-RESULTS.json.
- Phát hiện reqEdu=99 (ký hiệu đường tuyển dụng đặc thù) bị hiểu thành chỉ số học vấn trong lộ trình quân đội/công an. Chuẩn hóa yêu cầu đại học trong bảng chức vụ, giữ nguyên đường tuyển dụng. state-career174 214/0; stateCareer174 qua registry 2.599/0 sau sửa. public116 53/0, civic118 46/0. Không tuyên bố toàn registry đã PASS sau sửa.
- Chạy lại nhóm cũ: 0 đạt 417/0; 15 đạt 3.358/0 sau thêm pha thi hành di chúc hợp lệ vào whitelist; 20 đạt 6.679/0 sau phân biệt mở menu/mua vé số và anh em sinh đôi; 23+50 đạt 43/0 sau cập nhật quy tắc lượt hành động và RNG chuyện văn hóa; 68 mẫu hiện tại đạt 19/0, không chứng minh mọi trường hợp tên người đã mất đều sạch.
- Nhóm39 còn 19/1: fixture bảo vệ lại gặp tai nạn tử vong ở tuổi22, không thể tiếp tục tốt nghiệp. Đã xác định nguyên nhân fixture; chưa coi bài này đạt. Nhóm6 còn 1 kỳ vọng major cũ; các nhóm16,21,24,25,26,34,38,60 còn thất bại/chưa đối chiếu đầy đủ; nhóm5/5b timeout ở đợt trước chưa được tính đạt.
- Sau sửa bảng chức vụ: smoke11/11, saves10/10, save-safety10/10 đạt; cảnh báo seed thời gian/fixture Hardcore cũ được giữ trong log. NPC14/14 đạt trước thay đổi bảng chức vụ, không chạy lại vì không thay NPC.
- Không thay đổi nhật ký người chơi trong đợt bảo trì kiểm thử này. Mục907 vẫn giữ đầu lịch sử. Không deploy hoặc truy cập database thật. Trạng thái: HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN. Các kiểm rộng đạt trước sửa bảng chức vụ được ghi theo đúng thời điểm, không gán thành regression toàn mã cuối.

Artifact sau nghiệm thu tiếp: package:cloudflare PASS; 28 tệp, ZIP 2.677.802 byte, SHA-256 EDB04CEABE009EFE812F4EA92601CACA97948388DCE371D47D9CBF7C4EECE8CE. ZIP đọc lại và so byte/SHA từng tệp với dist đạt. Loading 8 cuộc đời nguồn/build giống nhau; API/admin đạt trên database giả, không chứng minh binding Production.

Browser dist cuối: transit907-browser Chrome390/1280px PASS trọn chuỗi concert → mua vé bay về Việt Nam → hoạt động/máy bay nội địa → quay lại Canada → tàu gần/sinh hoạt địa phương; không lỗi JS, không tràn ngang. Nhật ký docs/public/dist/HTML cùng131 mục, giữ129 mục cũ; transit907-updates và continuity906-updates PASS.
