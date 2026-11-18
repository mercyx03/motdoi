# Tây Ban Nha — 8.10.62 — Sổ tiến độ

HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN.

Phạm vi do chủ dự án giao trong mục8, mở rộng ROYAL920/837/858 hiện có; không tạo registry nhân vật thứ hai. Nền khôi phục: adb0a5b. Khi làm tiếp, bắt đầu từ danh sách còn thiếu bên dưới.

## Nguồn đã đối chiếu ngày 10/11/2026

| Quy tắc | Nguồn và mốc sử dụng |
| --- | --- |
| Kế vị, Asturias | [Hiến pháp, Điều57](https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229#a57), hiệu lực29/12/1978. Nhánh trước được đại diện trước nhánh sau; cùng hàng con ưu tiên nam, rồi tuổi. Asturias có từ Hiến pháp, không phải đợi sắc lệnh1987. |
| Quân chủ, phối ngẫu, Infante, Grande | [RD1368/1987](https://www.boe.es/buscar/act.php?id=BOE-A-1987-25284), hiệu lực02/12/1987; Điều1–4 và6. Đặc cách Điều3.2 dùng Alteza, phân biệt với Alteza Real. Phối ngẫu Infante cần căn cứ riêng. |
| Các tước phụ của người thừa kế | [Casa Real: Leonor](https://www.casareal.es/ES/FamiliaReal/PrincesaLeonor/Paginas/biografia.aspx): Girona, Viana, Montblanc, Cervera, Balaguer. Lưu nhãn nam/nữ, nguồn và điều kiện riêng. |
| Tước lịch sử Vương miện | [Casa Real: lịch sử](https://www.casareal.es/ES/MonarquiaHistoria/Paginas/historia-monarquia.aspx). Castilla, León, Aragón nằm trong phần mở rộng, không tạo quyền lãnh thổ hiện tại. |
| Hai họ | [Ley20/2011, Điều49](https://www.boe.es/buscar/act.php?id=BOE-A-2011-12628#a49). Khoản2 áp dụng30/06/2017, khác ngày hiệu lực chung30/04/2021. Thứ tự đăng ký đầu áp dụng cho các lần sinh sau có cùng quan hệ cha mẹ. |
| Lugo | [RD323/1995](https://www.boe.es/eli/es/rd/1995/03/03/323): Elena là người nhận gốc, quyền dùng chung thân; BOE ghi hiệu lực04/03/1995. Jaime không phải người nhận gốc trong sắc lệnh này. |
| Palma | [RD1502/1997](https://www.boe.es/eli/es/rd/1997/09/26/1502): Cristina nhận quyền dùng chung thân; hiệu lực17/10/1997. [RD470/2015](https://www.boe.es/eli/es/rd/2015/06/11/470) thu hồi quyền của Cristina. BOE ghi hiệu lực02/07/2015, phân biệt ngày ký11/06 và công bố12/06. |
| Các cặp tước đề xuất | Badajoz: [BOE1967](https://www.boe.es/buscar/doc.php?id=BOE-A-1967-5800); Cádiz: [BOE1972](https://www.boe.es/buscar/doc.php?id=BOE-A-1972-52385); Soria: [đơn vị của người giữ tước](https://fds.es/sobre-la-fds/). Đã có lịch sử sử dụng, không coi là đang trống. Segovia chưa đủ bảng hiệu lực nên bị chặn mặc định. |

Không chép toàn văn luật vào bài công bố. Nhân vật trong game vẫn hư cấu. Các ca tham chiếu Elena/Cristina nhận diện bằng mã hồ sơ, không suy ra từ chuỗi tên giống nhau.

## Đã triển khai

1. Giữ registry/cây/ID cũ. Hàng kế vị có bảo vệ vòng lặp, xét nhánh, giới và tuổi. Sinh thêm con, tử vong, rời hàng và đổi ngôi tính lại vị trí. Nữ đứng đầu nhận Asturias; em trai đủ điều kiện có thể thay thế. Tước không được suy ra từ riêng vị trí2/3/4.
2. Tách người giữ Vương miện và phối ngẫu. Vua/Nữ vương, Vương hậu/Vương phu có cách gọi riêng; lưu Majestad/Alteza Real. Tên trị vì và số La Mã là dữ liệu riêng. Phối ngẫu của cả nam và nữ Asturias nhận danh xưng theo hôn nhân, không nhận quyền kế vị.
3. Con Asturias là Infante/Infanta; con Infante là Grande/Excelencia, không tự nhận địa danh. Chắt xét vai trò cha mẹ. Căn cứ Infante đã phát sinh được giữ; con sinh sau khi cha/mẹ mất vị trí Asturias không tự nhận Infante chỉ vì lịch sử cha mẹ từng đứng đầu. Đặc cách có đề nghị, chờ năm và quyết định mô phỏng có hiệu lực riêng.
4. Giữ tước trên ledger hiện có. Quyền theo hôn nhân lưu holder/user/source/from/until; ly hôn kết thúc quyền dùng của phối ngẫu, không thu hồi tước riêng của người nhận gốc. Thu hồi theo quyết định tác động đúng mục, giữ lịch sử và tước nước khác còn hợp lệ. Ca Palma được kiểm tra cả trước và sau mốc thu hồi.
5. Phong tước xét từng cặp cấp+địa danh và người đang giữ. Khi không có cặp đủ căn cứ, giữ cách gọi hiện tại và báo lý do. Người chơi có thể đề nghị xem xét tái sử dụng tước lịch sử, chờ năm và nhận quyết định riêng ghi “Kịch bản trong game”; sau đó chọn hoặc bốc từ cặp đã được cho phép và chưa có người giữ trong registry. Đây là quyết định hư cấu thay đổi bối cảnh game, không là kết luận tước đang trống ngoài đời. Không tự chuyển sang cấp tước khác chưa xác minh. Tước không tạo đất, tiền hay ngân sách.
6. Nạp đủ sáu nhóm tên nam/nữ người dùng gửi. Gợi ý2–3 tên không lặp, nhánh gần ngôi ưu tiên tên kinh điển. Giữ dấu, sửa Predro thành Pedro, cho nhập Ferdinand như biến thể riêng. Kho gia đình lưu mã người đầu tiên mang tên, người dùng và người được tri ân; tên phối ngẫu có thể vào kho gợi ý.
7. Tách tên chính, tên đệm, cụm de Todos los Santos, hai họ, cách nối khoảng trắng/y/i và tên nhà. Cụm truyền thống bật/tắt được. Hôn nhân giữ tên pháp lý; Letizia Ortiz Rocasolano ở hồ sơ dân sự khác cách gọi Vương hậu trong nghi lễ. Không thêm “de” lặp. Thiếu họ cha mẹ thì ghi chưa xác định, không tự điền Borbón.
8. Có lựa chọn thứ tự họ từ hai dòng cha mẹ theo mốc hiện đại; cùng cha mẹ giữ thứ tự đăng ký đầu. Thứ tự họ không ảnh hưởng kế vị. Form chung hỗ trợ Unicode, hai họ, tên trị vì; document/gia phả giữ tên đầy đủ, sinh hoạt dùng tên ngắn.
9. Save cũ không tự tách chuỗi họ chưa rõ, không đổi ID/tiền/nhật ký/title ledger. Handoff dùng snapshot/restore cũ, giữ nguồn gốc tên và quyết định qua remap ID. Migration chạy lặp an toàn.

## Kiểm thử đã chạy

- spain862:198 kiểm tra; có luồng kidsYear/wed/succeed/snapshot/restore, nữ rồi sinh em trai, đổi ngôi, các thế hệ, hai giới phối ngẫu, Lugo/Palma, quyền dùng/thu hồi/ly hôn/tước nước khác, kho tên, hai họ/anh chị em, Unicode và migration lặp.
- Smoke11/11, saves10/10, save-safety10/10, NPC14/14 đạt. Runner vẫn báo cảnh báo migration cũ và seed phụ thuộc giờ thật; không coi cảnh báo là lỗi mới hoặc giấu chúng.
- royal837:67, royal843:59, royal847:248, royal858:84, royal860:153, monaco861:124, royal-birth-display:186, md5-920:118, children141:38, family130:67 đạt. Test royal847 cập nhật nhãn tiếng Việt mới của phối ngẫu Asturias; điều kiện pháp lý không bị nới để test đạt.
- Browser nguồn:10 menu ở390/1280px, tên Unicode/hai họ/số trị vì lưu được; không tràn ngang/lỗi JS. Kết quả bản build và đóng gói bổ sung sau.

## Còn thiếu để nghiệm thu tổng thể

- Luật trước1978/1987; lựa chọn thứ tự họ trước2017 (chưa phủ quy tắc1999/2000); hộ tịch một dòng cha mẹ/phán quyết và đổi hộ tịch thật chưa mô phỏng đầy đủ.
- Điều57.4 có cờ loại nhánh hiện hữu; Điều57.5 về thoái vị/từ bỏ được giữ dưới dạng trạng thái đã ghi. Chưa mô phỏng toàn bộ soạn, thông qua luật organic và thiết chế Cortes. Không khẳng định một thao tác game là thủ tục nhà nước thật.
- Nhiếp chính Tây Ban Nha, các ngoại lệ chuyển tiếp1987 và danh hiệu danh dự2014 cho từng cá nhân cần ca riêng. Không tự gán danh hiệu trọn đời cho mọi cựu quân chủ.
- Còn cần dữ liệu đầy đủ về lịch sử/hiệu lực các tước địa danh và căn cứ quyền phối ngẫu của từng ca thực tế; không tự coi địa danh hết người giữ là tự do phong lại.
- Engine chủ yếu dùng năm sinh: trường hợp sinh và mất vị trí Asturias trong cùng năm chưa phân giải mọi ngày cụ thể. Chưa chạy regression toàn diện hoặc thiết bị thật; ghi vàoGĐ6.

Không sửa/commit Claude.md, .local-state-review.txt, audit-world-520.json hoặc thay đổi y tế/world-country ngoài phạm vi. Artifact workspace vẫn có mã y tế có sẵn nên không tái tạo chính xác chỉ từ commit Tây Ban Nha. Không deploy; binding REVIEWS_DB Production chưa kiểm chứng. Khôi phục bằng revert commit đợt này, package lại và chủ dự án upload Dashboard.

## Kết quả bản đóng gói cuối

- package:cloudflare PASS:28 file triển khai; loading/API cục bộ,8 cuộc đời nguồn/build giống nhau và catalog2864 sự kiện đạt. ZIP3.416.780 byte, SHA256 5CCFE6AD3C78CB7ABD23DF7009DFC4AD71CB7F1E260CD760B5095B6A6DBA81ED. Công cụ đọc lại toàn bộ tên và SHA256 từng file, so với dist.
- Đã kiểm tra riêng index.html ở gốc, _worker.js, _routes.json, _headers và .well-known/ai-catalog.json. JSON và dữ liệu nhúng HTML ở cả dist/ZIP có8.10.62 đầu tiên;184 mục trước giữ nguyên sau sửa trạng thái được chủ dự án cho phép.
-8.10.60 và8.10.61 ghi đã phát hành08:17:22 ngày10/11/2026 UTC+7;8.10.62 ghi08:31:03.021 cùng ngày theo chỉ định chủ dự án. Việc sửa trạng thái không tự upload website. Không còn mục packaged.
- GitHub origin mercyx03/motdoi public, quyền push/admin xác minh; API trả0 workflow,0 hook,0 deployment. Chỉ push nhánh codex/life-context-upgrade; không merge main hoặc deploy.
- Regression toàn diện chưa chạy, Production CHƯA được nghiệm thu. Còn giới hạn dữ liệu nêu trên và binding REVIEWS_DB thực tế.

- Browser bản dist cuối:10 menu ở390/1280px đạt; đã lưu tên Unicode/hai họ/số La Mã, kiểm tra ba mục đầu đều Đã phát hành, tìm không dấu, lọc Sửa lỗi và tải thêm. Không tràn ngang/lỗi JS; đã xem ảnh giao diện mobile/desktop và nhật ký.
