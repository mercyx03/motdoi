# Một Đời — Sổ tiến độ Monaco 8.10.61

HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN. Preview, packaged, chưa phát hành. Đối chiếu ngày 10/11/2026; chủ dự án tự upload, không deploy.

## Bộ luật và phạm vi nguồn

Đã đọc đủ sáu đoạn Điều10: nhánh trực hệ hợp pháp, nhánh anh chị em/hậu duệ, quyền đại diện khi chết/từ chối, cơ chế khuyết ngôi, quốc tịch tại mở kế vị và gia quy áp dụng. Không dùng founder làm gốc xếp toàn bộ họ hàng sau mỗi lần đổi ngôi. Thuật toán DFS ưu tiên nam tại mỗi nhóm anh chị em, giữ nhánh đại diện; từ chối của một người không tự chặn hậu duệ, cấm theo hôn nhân không được chấp thuận xử lý nhánh riêng.

| Quy tắc | Mốc và nguồn chính thức | Đã làm / giới hạn |
| --- | --- | --- |
| Hiến pháp Điều10,11,69 | [Bản hiện hành](https://legimonaco.mc/constitution/), [luật sửa2002/JDM5-4-2002](https://journaldemonaco.gouv.mc/fr/Journaux/2002/Journal-7541); áp dụng6/4/2002 | Đổi gốc theo quân chủ, trực hệ rồi anh chị em/hậu duệ; quốc tịch riêng; hết nhánh chờ chỉ định + đồng thuận hội đồng. Trước2002 không áp hồi tố, ghi chưa đủ dữ liệu và không tự đổi ngôi. |
| Gia quy2,3,6,20,23,24,42 | [Bản2015 công bố5/6](https://journaldemonaco.gouv.mc/Journaux/2015/Journal-8228/Ordonnance-Souveraine-n-5.344-du-2-juin-2015-portant-statuts-de-la-Famille-Souveraine), [hợp nhất](https://legimonaco.mc/tnc/ordonnance/2015/06-02-5.344); mốc áp dụng6/6/2015 theo69 | Người đầu hàng được xét tước hereditary, gồm nữ theo42; tư cách gia đình chủ quyền tách khỏi tước, công vụ và nhân viên Maison Souveraine. Vai trò phối ngẫu/tài sản không là quyền trị vì. |
| Nhiếp chính2015 và sửa2022 | [JDM12/8/2022](https://journaldemonaco.gouv.mc/fr/Journaux/2022/Journal-8603/Ordonnance-Souveraine-n-9.389-du-29-juillet-2022-modifiant-l-Ordonnance-Souveraine-n-5.344-du-2-juin-2015-modifiee), mốc13/8/2022 | Trước sửa: xét phối ngẫu sống sót hoặc người trưởng thành đủ điều kiện/cư trú rồi hội đồng; sau sửa: Hội đồng Nhiếp chính. Trẻ giữ ngôi riêng, hội đồng thực hiện quyền; đủ18 thì kết thúc. Nhiếp chính đang có cập nhật khi đổi bộ luật, giữ lịch sử. Chưa làm đầy đủ trường hợp quân chủ mất khả năng tạm thời. |
| Hai tước cá nhân khi sinh đôi | [Palais10/12/2014](https://www.palais.mc/fr/actualites/s-a-s-le-prince-albert-ii/evenement/2014/decembre/naissances-princieres-3294.html) | Tham chiếu Jacques sinh17:06 sau Gabriella17:04; Baux và Carladès riêng. Chỉ fixture có reference2014 đúng phạm vi mới dùng căn cứ này. Không tự cấp Baux cho mọi người đứng1 hoặc Carladès để bù tụt vị trí. |
| Phối ngẫu và tước nước ngoài | [Charlène](https://www.palais.mc/fr/la-famille-princiere/s-a-s-la-princesse-charlene/biographie-1-6.html), [Caroline/Hanover](https://www.palais.mc/fr/la-famille-princiere/s-a-r-la-princesse-de-hanovre/biographie-1-8.html) | Vương phi của nam quân chủ có đối chiếu công bố; áp cho nhân vật giả định đánh dấu mô phỏng. Chồng nữ quân chủ không tự nhận Prince/HSH; tước gốc và HRH nguồn Hanover giữ riêng. Danh xưng vợ heir/prince theo từng tước cần quyết định kịch bản, không suy quyền sở hữu. |
| Hộ tịch/legitimation | [Code civil226-9 đến226-14](https://legimonaco.mc/code/code-civil/) | Cần xác lập với đúng hai cha mẹ và hôn nhân/phán quyết phù hợp, ghi nhận riêng. Không tự biến dating thành married hoặc hợp pháp hóa mọi trẻ vì người chơi cưới người khác. Chưa triển khai đầy đủ các nhánh phán quyết tư pháp. |

Một số URL Legimonaco timeout khi mở trực tiếp: đã đọc nội dung chỉ mục đầy đủ và các bản JDM truy cập được, giữ nguồn gốc và mốc công bố. Không tuyên bố trang timeout đã mở thành công. Không mô tả toàn bộ luật hộ tịch/ngoại lệ lịch sử là đã phủ.

## Tước, danh tính và tương thích

Mở rộng ROYAL920/837/858 và gia phả đang có. monaco861-data lưu sources/mốc/catalog; monaco861 phân giải Monaco, không có registry người thứ hai. R.order gọi riêng thuật toánMC, các nước khác giữ nguyên. S.identity dùng cùng dữ liệu cho hồ sơ, cây, bảng kế vị và tên. Sáu trục tách nhau: quan hệ, đủ điều kiện/vị trí, apparent/presumptive, tước/kính ngữ, family/công vụ/ngân sách, các lớp tên. HSH/SAS khác HRH; tiếng Việt Điện hạ, Pháp/Anh có mẫu riêng. Tước heir và Baux đều đủ thì mẫu nghi lễ hiển thị cả hai.

Quốc tịch chưa có căn cứ ở save cũ: giữ vị trí dự kiến, eligible=null, không tự đổi ngôi hoặc xác nhận tước tự động. Nhân vật mới có quốc tịch/nhánh từ dữ liệu kịch bản, không là quyết định nhập tịch thật. Nút đối chiếu hồ sơ ghi căn cứ kịch bản, không gọi cơ quan công quyền. Hôn nhân thông qua luồng có chấp thuận vẫn không đưa phối ngẫu vào hàng kế vị. Không dùng tín ngưỡng nuôi dạy làm cấm kế vị MC chưa được chứng minh; cờ cũ còn trong hồ sơ nhưng bộ luật mới không dùng nó làm căn cứ duy nhất.

Prince/Princess cho nhân vật mới theo birthDecision/princeBasis mô phỏng hoặc grant riêng, không áp quy tắc tự truyền vô hạn cho mọi cháu/chắt. Legacy Prince giữ trong ledger, thiếu nguồn thì ghi cần đối chiếu. Baux/Carladès, count/baron khác có holder/territory/remainder riêng. Chỉ quân chủ đủ tuổi, còn sống và không đang nhiếp chính mới cấp quyết định trong menu. Không cấp trùng tước đang có người giữ. Lifetime kết thúc khi holder mất; remainder không rõ không tự truyền. Không tạo đất, doanh thu hoặc quyền quản trị; không đụng quỹ riêng860/public budget.

Fallback bàng hệ dùng hồ sơ scenario trong registry, đề nghị năm trước, hai hội đồng và xác nhận. Phải hết nhánh thông thường; nếu xuất hiện người đủ điều kiện thông thường thì không dùng đề cử để vượt qua. Candidate phải có quan hệ trong gia phả và quốc tịchMC xác định. Chưa mô phỏng thành phần/biểu quyết từng cá nhân của hội đồng hoặc công báo nhà nước thật.

## Tên và kho gia đình

Tên chính + danh sách đệm, birth/daily/ceremonial/service, legalSurname và house giữ riêng qua S.names. Grimaldi là tên nhà trong kịch bản mới; saveRocheval cũ giữ tên/house đã có. Không tự đổi Casiraghi thành Grimaldi vì đủ điều kiện kế vị. Xin đổi tên nhà/họ có đề nghị, chờ năm và quyết định mô phỏng; đổi quân chủ thì cần xét lại. Tên chính thức khi đổi họ ngoài đời cần thủ tục hộ tịch chưa được mô phỏng đầy đủ.

Kho dữ liệu chứa đủ nhóm gợi ý người dùng cung cấp, giữ dấu và chính tả nguyên bản. Catalog có language/culturalSource/sexes/slots/weight. Antoine/Jean/Joseph/Xavier ở mẫu nữ chỉ custom; Marie nam là middle xác suất thấp. Andrea có phân loạiitM/frF, không coi cách phân loại là luật đặt tên. Gợi ý3–4/2–3 chỉ mềm, có mẫu1tên; giới hạn100ký tự/mục thuộc UI, không là giới hạn pháp lý đã xác minh. Chưa xác minh một số biến thể hoặc nghĩa từng tên hiếm; không gọi tất cả là tên tổ tiên có chứng cứ lịch sử.

Chỉ ghi tri ân cụ thể khi người chơi chọn mã tổ tiên. origins lưu từng vị trí; đổi một tên không thừa nhận nhầm nguồn của tên cũ. Pool gia đình giữ firstMember/users/honouredBy, nguồn ngôn ngữ và nhóm;3người sử dụng +2lần tri ân có thể thành truyền thống kịch bản. Người trùng tên giữ ID riêng. Tên phối ngẫu có thể nhập vào pool gia đình đó, không làm thay kho toàn cầu. Kho MC dùng cơ chế tên chung, các nước khác có thể mở rộng sau bằng cấu hình riêng.

Baux không tự thành họ ở trường/giấy tờ; service tùy chỉnh là lựa chọn riêng của người chơi trong game. Tên đầy đủ lưu đúng thứ tựUnicode, các ca Jacques/Gabriella/Albert có trong dữ liệu đối chiếu, không tự tuyên bố họ đang tri ân một người chỉ vì trùng tên.

## Kiểm thử và mục làm tiếp

Test monaco861:124 kiểm tra gồm sinh đôi, nữ rồi có em trai, branch representation/renunciation, hôn nhân không được chấp thuận, quốc tịch chưa biết/ngoại quốc, hội đồng, minor accession, hai mốc nhiếp chính, Baux/Carladès/grant duplicate, foreignHanover, phối ngẫu, kidsYear, Unicode/pool/origins/tradition, snapshot và migration. Browser5menu ở390/1280, formUnicode và gợi ý tên, cây chung. Mô phỏng trọn đờiMC89tuổi/614log không NaN/undefined. Kết quả build/test cuối ghi thêm sau khi chạy.

Khi làm tiếp:1) luật trước2002 và trước2015 chưa phủ;2) danh mục sắc lệnh Prince/Princess/HSH/phối ngẫu/remainder từng cá nhân;3) dữ liệu quốc tịch/cha mẹ thứ hai từ save thật;4) đầy đủ hộ tịch, nhận cha mẹ bằng phán quyết;5) genealogy/source history sâu hơn và regression mã cuối/thiết bị thật. Không tự khẳng định các mục này PASS.

Giữ thay đổi y tế/world-country-jobs và tệp riêng ngoài commit. Artifact workspace chứa mã y tế có sẵn, không tái dựng chính xác từ riêng commitMC. Không sửa Claude.md/.local-state-review.txt/audit-world-520.json. distignored/dist.ziptracked giữ nguyên. Worker/API kiểm cục bộ, bindingREVIEWS_DBProduction chưa kiểm chứng; không deploy. Khôi phục nền1db68c1 bằng revert commitMC rồi package lại, chủ dự án uploadDashboard.

## Kết quả nghiệm thu trọng điểm 10/11/2026

- Smoke11/11, saves10/10, save-safety10/10, NPC14/14 đạt; các cảnh báo migration cũ được runner báo riêng, không là lỗi mới.
- royal837:67, royal843:59, royal847:248, royal858:84, royal860:153, royal-birth-display:186, md5-920:118, children141:38, family130:67, childhood859:855 và monaco861:124 kiểm tra đạt.
- update-release1053 và update-history-timezones đạt; so sánh sâu183mục cũ không đổi. Bản mới đứng đầu, packaged/releasedAtnull, có trong dữ liệu và HTMLdist.
- Browser nguồn và dist:10menu ở390/1280px, lưuUnicode/gợi ý tên/cây chung, không tràn ngang hoặc lỗiJS; đã xem ảnh mobile/desktop.
- package:cloudflare PASS,28file trongdist/ZIP, đối chiếu toàn bộ nội dung; ZIP3403327byte, SHA256 2CA9021BEBC6967A309FB3104804FBE363AE7413A37C7D24CCB9C44A132DD3CD. Local worker/loading và8mô phỏng nguồn/build giống nhau đạt.
- GitHub mercyx03/motdoi public, quyền push/admin xác minh;0workflow,0hook,0deployment được API trả về. Không deploy, không thay đổi database.
- HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN. Regression đầy đủ chưa chạy; lỗi business sibling succession của life138 đã biết từ trước không nằm trong phạm vi này. Production CHƯA: còn nghiệm thu tổng thể và REVIEWS_DB thực tế.
