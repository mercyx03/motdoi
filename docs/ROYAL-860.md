# Một Đời — Đời sống hoàng tộc 8.10.60

HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN. Packaged, chưa phát hành, không deploy.

## Phạm vi và lựa chọn thiết kế

Theo yêu cầu chủ dự án: lợi thế hoàng gia hư cấu trên27quốc gia MONARCHIES, không khẳng định người thật giàu/đẹp hoặc có cùng tập tục. Kế vị và tước tiếp tục dùng ROYAL920/837/858, không tạo gia phả thứ hai. Không sửa chính sách pháp lý theo ngoại hình hoặc ảnh hưởng. Không thêm quyền can thiệp kết quả thi, cấp nghề/quân hàm hoặc miễn điều kiện kết hôn.

royal860 mở rộng registry hiện có: dynasty860 tại flags.royal920 cho quỹ riêng và chỉ số cá nhân; quan hệ trust/tension trên từng member.royal860 theo ID hiện có. Thu nhập chỉ ẩn ở giao diện, giữ fInc/mInc số hữu hạn. engine.parentYear bỏ mô phỏng cắt giảm/nghỉ hưu nghề phổ thông cho nghề hoàng tộc; không chặn cha mẹ có nghề thường. family.allowanceYear nhường cho ledger quỹ riêng để không trả trùng nguồn chu cấp.

## Nguồn lực mô phỏng

Dùng đơn vị tiền hiện hữu và base của cuộc đời. Nhánh chính: reserve5000base, lợi tức200base/năm, stipend30base/năm (người trị vì50), kế hoạch cá nhân80base/năm. Nhánh phụ:1500/80/15/40base. Các số là tham số game theo yêu cầu thuận lợi vật chất, không tài chính thật. Dưới18tuổi có hạn mức chi gia đình200/80base mỗi năm; quỹ trực tiếp thanh toán, không trừ tiền trẻ hoặc public budget. Tuổi6–17tiền tiêu vặt2/1base mỗi năm. Hỗ trợ lớn một lần mỗi năm, stipend và lợi tức chống lặp theo tuổi, ledger tối đa60mục. Quỹ thiếu thì từ chối, không lấy tiền công vụ hoặc đặt Infinity.

LIFE138 vẫn giới hạn quỹ giờ, số môn và mức năng lực. Chỉ bỏ bước từ chối học phí ngẫu nhiên của cha mẹ cho trẻ hoàng gia còn được quỹ hỗ trợ. Public ledger/công vụ giữ nguyên. Rời sinh hoạt hoàng gia dừng các khoản mới, không xóa tài sản cá nhân. Quỹ theo snapshot/restore hiện có khi đổi thế hệ, không nạp lại; đổi tiền tệ qua abroadConvert cũng đổi reserve/ledger.

## Ngoại hình và bản lưu

Tạo mới hoàng gia: looks13490–100một lần, quà chào đời2/1base trừ reserve. Không thay gen/nguồn gốc sinh học, không hồi phục điểm mỗi năm; già đi hoặc sức khỏe vẫn dùng LOOKS134. Migration cũ chỉ bổ sung state, không ghi đè looks/money/ID/log/tước. Chuyển sang con qua registry giữ ngoại hình đã có của người con, không tặng lại quà sơ sinh khi dựng lại tuổi hiện tại. Quan hệ trên house.members đi cùng registry; seen/pressure/influence của nhân vật mới được xét riêng.

## Nội dung và hậu quả

10nhóm: buổi chơi3–6; người hướng dẫn7–12; lần thăm cộng đồng7–15; ảnh riêng13–17; học tập16–22; gặp người hướng dẫn18–40; cạnh tranh vai trò18–70; lộ tài liệu18–75; phân bổ quỹ25–80; truyền kinh nghiệm45–100. Dùng CHAIN144, không engine mới: mở đầu, chuẩn bị sau1–2năm, kết quả sau1–2năm. Mỗi scene một lần; tối đa10chuỗi hoàng gia/một đời, vẫn chịu giới hạn4chuỗi đồng thời và một lựa chọn chuỗi/năm của lõi. Vai trò và điều kiện tuổi kiểm lại.

Actor là thành viên trưởng thành còn sống trong cùng registry, ưu tiên nhánh ngoài người trị vì/phối ngẫu. Tin cậy/căng thẳng dựa warmth/open sẵn có, không suy đạo đức từ giàu/nghèo. Chuẩn bị, hòa giải, protocol và thay ngôi ảnh hưởng xác suất. Gây sức ép có thể tăng influence nhưng giảm trust/cred và tăng tension/pressure; hợp tác có kết quả tốt/trung tính. Ký ức và kết quả được giữ. Không giả định lời đồn là chứng cứ; không đổi line hoặc thu tước do thẩm mỹ/tranh vai trò. Actor mất thì khép chuỗi, không tạo người trùng tên thay thế. Rút khỏi một kế hoạch khác với rời quyền kế vị.

## Kiểm thử và bàn giao

Test chuyên đề royal860 kiểm tra27nước, hỗ trợ học, hạn mức và public/private, chống thưởng lặp, nhiều bước tích cực/tiêu cực, actor đã mất, giữ line/tước/ID, migration/ngoại hình cũ, snapshot và đổi tiền. Browser kiểm menu trẻ/người lớnGB/ES/JP tại390/1280, ẩn lương gia đình và thao tác hỗ trợ. Kết quả cuối bổ sung sau khi chạy.

Còn regression toàn bộ, thiết bị/save thật và cân bằng nhiều thế hệ ởGĐ6. Lỗi tests/life138.js ở kế nhiệm doanh nghiệp đã có trước, ghi trong BACKLOG đợt8.10.59; không tự đánh dấuPASS. Giữ y tế/world-country-jobs và tệp riêng ngoài commit; artifact workspace vẫn chứa thay đổi y tế có sẵn, không tái dựng chính xác từ riêng commit này. Không sửa Claude.md/.local-state-review.txt/audit-world-520.json. Không đổi ignore/trackingdist/dist.zip. Worker/API chỉ kiểm cục bộ; bindingREVIEWS_DBProduction chưa kiểm chứng. Khôi phục nền4007ffd bằng revert commit này rồi package lại; chủ dự án tựuploadDashboard.

## Kết quả kiểm chứng cuối

- royal860:153 kiểm tra trên27nước quân chủ; snapshot/restore quỹ, đổi tiền, nghề cha mẹ và ngoại hình/save cũ đạt. Mô phỏng trọn đời hoàng gia GB82tuổi/570log/5chuỗi, JP90tuổi/531log/4chuỗi; không NaN/undefined, quỹ và tiền hữu hạn.
- Smoke11/11; saves10/10; save-safety10/10; NPC14/14 đạt. Cảnh báo cũ seed dùng giờ thật và hc_story trong fixture không còn được giữ riêng, không coi là lỗi mới.
- royal83767,royal84359,royal847248,royal85884,md5-920118,looks13475(kèm adopted appearance),social919110,childhood859855,childhood898229,family13067,royal-birth-display186 đều đạt. update-release1036 và update-history-timezones đạt. Test md5 cập nhật từ trần trợ cấp cũ sang đối chiếu tiền riêng giảm đúng reserve và public ledger giữ nguyên; không bỏ kiểm tra tách ngân sách.
- Browser nguồn:8lượt menu/thao tác ở390/1280px, thu nhập gia đình được ẩn, hỗ trợ có hiệu lực; không tràn ngang/lỗiJS. Đã xem screenshot trẻGB390 và người lớnES1280.
- npm run package:cloudflare PASS;28file triển khai, loading/hash/tám cuộc đời source-build trùng; admin/API cục bộ đạt. dist.zip3.390.421byte; SHA256 CC3EC7B84C417E3EFE8458E43D980C0A6E04F91E4F1D274CCA29C04EE33238E3.
- Đọc lại toàn bộ28entry ZIP và soSHA256 từng file với dist; configroot vàdotfile đủ, JSON/HTML có royal-lifetime-81060.182mục nhật ký cũ giữ nguyên, mục mới đứng đầu vàpackaged. Không tự ghi ngày phát hành.
- Originmercyx03/motdoi làpublic, có quyềnpush/admin; API đọc0workflow,0hook,0deployment. Chỉ pushnhánh codex/life-context-upgrade, không merge/deploy.
- Production-ready CHƯA: còn regression toàn bộ, thiết bị/save thật, cân bằng và bindingREVIEWS_DB; artifact có thay đổi y tế ngoài commit như đã ghi.
- Browser bản dist cuối: 8 lượt menu/thao tác tại 390/1280px đạt; thu nhập ẩn, hỗ trợ và nhật ký mới đúng, không tràn/lỗi JavaScript.
