# Tiến độ nâng cấp theo góp ý người chơi

Nhánh `player-feedback-upgrade` (tạo từ `1f8248d`, GĐ6). Trạng thái: HOÀN THÀNH · HOÀN THÀNH CÓ GIỚI HẠN · CHƯA HOÀN THÀNH · BỊ CHẶN.
Mỗi mốc: sửa code → test chuyên đề + test module bị ảnh hưởng → nhật ký → commit/push → dist/dist.zip. Không chạy lại regression toàn bộ.

## Mốc A — Sửa lỗi và hành động gia đình

| Yêu cầu | Trạng thái | Module | Test | Ghi chú |
|---|---|---|---|---|
| A1 Con cái sau nhiều lần ly hôn | HOÀN THÀNH | life45 (`divKids`, lưu mã bạn đời trước ly hôn), life146 (`residence146`) | feedback-a, relationships841 | Con có `coParent108` gắn đúng cuộc hôn nhân; bản lưu cũ không có thông tin người cùng nuôi: con đã có nơi ở không bị phân xử lại. Mục xem nơi ở / chăm sóc / giám hộ và đề nghị đổi nơi ở từng con (cha/mẹ kia và con ≥ 12 tuổi có quyền từ chối). Con nuôi hiện "cha/mẹ nuôi hợp pháp"; cha/mẹ kế chưa có quyền giám hộ riêng. |
| A2 Về Việt Nam / chuyển nước sau du học | HOÀN THÀNH | life146 (`abroadMove146`), migrate114 chỉ dẫn | feedback-a | Phân biệt học / hợp đồng / thực tập sinh / định cư; dừng học hoặc chịu phí chấm dứt hợp đồng; bán nhà, quy đổi tiền, giữ quốc tịch; chưa đủ điều kiện thì hiện lý do. Chuyển thành phố trong nước vẫn dùng mục cũ. |
| A3 Crash khi hẹn hò qua app | HOÀN THÀNH CÓ GIỚI HẠN | life79 | feedback-a, browser-dating-app | Tìm và sửa một vòng lặp có thể chạy vô hạn khi tạo hồ sơ (sở thích); giữ danh sách hồ sơ khi mở lại. 7.190 lượt thử engine không lỗi. Bổ sung ở cuối đợt: thử trên Chrome thật (headless) 12 lượt mở app → lướt thêm → thu nhỏ / mở lại → nhắn tin, VN và quốc tế, 390px / 1280px: không treo, không lỗi JavaScript, danh sách không đổi khi mở lại. Vẫn chưa tái hiện được đúng thao tác / thiết bị của người chơi đã báo lỗi nên giữ mức “có giới hạn”. |
| A4 Quy trình Audition | HOÀN THÀNH | life139 | feedback-a, audition139 | Chuẩn bị hồ sơ (ảnh, video) → đăng ký đúng công ty theo nước, điều kiện tuổi → 3 vòng có lý do → đề nghị / chuẩn bị sang nước ngoài (luồng cũ) hoặc thử lại / ứng tuyển trong nước. |
| A5 Mời bố mẹ về sống chung | HOÀN THÀNH | life146 (`parentsHome146`) | feedback-a | Mời bố, mẹ hoặc cả hai; xét tin cậy, tuổi, nhà ở, nước ngoài; có thể từ chối; không đổi sở hữu nhà. |

Kiểm thử mốc A: feedback-a 39 · smoke 11/11 · saves-compat 10/10 · save-safety 10/10 · NPC 14/14 · family830/104/126/129/130 · relationships108/841 · audition139 · life138 · integration-gd6 · regression mục 9 lọc 14 tình huống (79.362), mục 32, 57, 58, 71.

## Mốc B — Đồng bộ dữ liệu và tinh gọn giao diện

| Yêu cầu | Trạng thái | Module | Test | Ghi chú |
|---|---|---|---|---|
| B1 Nghề nghiệp / thu nhập NPC thống nhất | HOÀN THÀNH | life147 (`E.CAREER147`, bọc `E.kidTitle` / `E.kidIncome`) | feedback-b | Nguồn duy nhất là `roles[*].personId` của công ty / tập đoàn (life133, life137), so theo mã định danh nên người trùng tên không bị gán nhầm. Bổ nhiệm có hiệu lực ngay; lương công ty thay cho lương nghề cũ (không cộng đôi); nghề cũ đứng yên và được khôi phục khi miễn nhiệm. Áp dụng con, vợ/chồng; anh chị em chỉ hiển thị chức vụ. |
| B2 Hồ sơ con cái chi tiết | HOÀN THÀNH | life147 (`E.CHILD147`), app.js trang hồ sơ | feedback-b, browser-feedback-b | Sức khỏe, dị ứng, lớp, học lực, hạnh kiểm, thành tích; thân thiết với người chơi, cha/mẹ còn lại, cha/mẹ kế, từng anh chị em, ông bà; tiết kiệm, trợ cấp, quà, tài sản riêng, thừa kế; kỷ niệm. Dữ liệu chưa có (dị ứng, độ thân với người khác) tạo một lần theo danh tính và lưu `profile147`. Mục tài sản riêng / thừa kế sẽ có dữ liệu từ mốc D–E. |
| B3 Menu Gia đình & tình cảm 5 nhóm | HOÀN THÀNH | life147 (`E.MENU147`), app.js `renderActions` | feedback-b, browser-feedback-b | Nhóm lớn → nhóm con → danh sách; nút quay lại; ghi nhớ nhóm con. Hành động không đổi ý nghĩa; nhóm "Gia đình & bạn bè" (bạn bè, về nước sống) giữ nguyên. |
| B4 Menu Tiền bạc & tài sản 5 nhóm | HOÀN THÀNH | như trên | feedback-b, browser-feedback-b | "Chi tiêu & sinh hoạt" chứa chi tiêu định kỳ và lối tắt các việc tiêu tiền như mục Chi tiêu cũ. Thử 390px và 1280px, không tràn ngang, không lỗi JavaScript. |

Kiểm thử mốc B: feedback-b 616 · browser-feedback-b (Chrome headless qua `tests/lib/cdp.js`, 2 kích thước) · feedback-a 39 · smoke · saves-compat · save-safety 10/10 · NPC 14/14 · business128/133/137/143, business-ui137 · children141 · family104/126/129/130/830 · expansion842 · budget-ui126 · integration-gd6 30 · relationships841 · heir-family770 · estate840. Kiểm thử trình duyệt phát hiện và đã sửa một lỗi giao diện (nút nhóm con không gắn sự kiện) trước khi commit.

## Mốc C — Giới thượng lưu, gia tộc, tập đoàn

| Yêu cầu | Trạng thái | Module | Test | Ghi chú |
|---|---|---|---|---|
| C1 Phân tầng đời sống | HOÀN THÀNH | life148 (`tier`) | feedback-c | Tài sản ròng / `l.base` (mức sống từng nước) + tập đoàn / danh tiếng. Trải nghiệm, quy mô tiệc, địa điểm, sưu tầm khóa theo tầng và theo năm xuất hiện dịch vụ (ở Việt Nam muộn hơn). |
| C2 Tổ chức tiệc | HOÀN THÀNH | life148 (`party148` → `_plan` → `_guests`) | feedback-c, browser-feedback-menus | 5 loại, 4 quy mô, 6 địa điểm, 4 nhóm khách. Từng khách nhận lời / từ chối theo thân thiết, khoảng cách, mâu thuẫn, chênh lệch tầng lớp. Kết quả: uy tín, thân thiết, người quen mới, bị chê phô trương, sự cố. Tối đa 2 tiệc/năm, mỗi loại 1 lần. |
| C3 Thương vụ hợp tác | HOÀN THÀNH | life148 (`deal148`, `_terms`, `_track`, `dealYear`) | feedback-c, browser-feedback-menus | Xét tin cậy, uy tín, năng lực, quy mô so với đối tác. Kéo dài 2–4 năm; lãi bị chặn ≤ 2,5 lần vốn; thất bại; đối tác thiếu trung thực → tranh chấp → kiện (1–2 năm) / hòa giải / bỏ qua. Tối đa 3 thương vụ mở. |
| C4 NPC liên kết xuyên sự kiện | HOÀN THÀNH | life148 (`people`, `meet`, `seen`, `label`) | feedback-c | Mã `uid110` cố định; lịch sử gặp; tính cách ẩn độc lập với giàu nghèo / nghề; già đi, qua đời; người mất không còn trong menu; trùng tên có nhãn năm sinh; tối đa 60 người, không xóa đối tác đang làm ăn. Mốc D dùng tiếp cho giới thiệu con. |
| C5 Người đứng đầu gia tộc | HOÀN THÀNH | life148 (`familyHead148`, `_member`, `_conflict`, `familyYear`) | feedback-c, browser-feedback-menus | Họp gia đình, quyền lợi hằng năm (chi từ tiền của bạn), hỗ trợ một lần, mâu thuẫn sinh từ chức vụ / quyền lợi chênh lệch và leo thang theo năm; bổ nhiệm qua menu doanh nghiệp sẵn có (chỉ công ty > 50%); kế nhiệm qua `childrenSuccession139`; di chúc nối ở mốc E. Không đụng tài sản riêng người thân. |
| C6 Trải nghiệm thượng lưu, sưu tầm | HOÀN THÀNH | life148 (`elite148`, `collect148`, sổ `items`) | feedback-c, browser-feedback-menus | 7 trải nghiệm; 8 loại tài sản; giá trị biến động, phí duy trì, bán gấp khi thiếu tiền; tặng đổi chủ; chỉ món của bạn tính vào tài sản ròng; quy đổi khi đổi tiền tệ. Thừa kế đồ sưu tầm hoàn thiện ở mốc E. |

Kiểm thử mốc C: feedback-c 82 · browser-feedback-menus c (5 chuỗi × 2 kích thước) · feedback-a/b · smoke · saves-compat · save-safety · NPC · business137/143 · family129/830 · expansion842 · integration-gd6 · heir-family770 · estate840 · inheritance-currency117 · debt140 · pace-gd5 · chains-gd4. Ghi chú: estate840 đếm 133 thay vì 135 kiểm tra vì các kiểm tra có điều kiện sau một ván tự chơi; thêm mục hành động làm thay đổi đường đi ngẫu nhiên (đã xác minh bằng cách bỏ life148 thì về 135), không có kiểm tra nào thất bại.

Giới hạn: các mục mới là hành động người chơi chủ động; chế độ Tự động không tự tổ chức tiệc / ký thương vụ (vòng năm vẫn xử lý thương vụ, quyền lợi, mâu thuẫn, giá trị tài sản trong cả hai chế độ).

## Mốc D — Quan hệ xã hội, người nổi tiếng, hôn nhân

| Yêu cầu | Trạng thái | Module | Test | Ghi chú |
|---|---|---|---|---|
| D1 Kết bạn người có địa vị | HOÀN THÀNH | life149 (`social149`, `social149_person`) | feedback-d, browser-feedback-menus | Dùng mạng lưới NPC của life148. Sự kiện giao lưu theo tầng lớp (người bình dân cũng có hội nhóm nghề nghiệp); ăn tối (từ chối theo chênh lệch địa vị, tin cậy, tính cách); lời khuyên (NPC thiếu trung thực có thể khuyên vụ lợi); kết thân → `l.friends` có liên kết `contact149`. Nhân vật hư cấu. |
| D2 Tương tác người nổi tiếng | HOÀN THÀNH | life149 | feedback-d | Hợp tác quảng bá (cần cơ sở kinh doanh, có thể thất bại); hẹn hò chỉ khi cả hai trưởng thành, độc thân, tuổi tương đồng, hợp xu hướng, đủ tin cậy; dùng đúng quy trình `E.DEC.love`; danh tiếng tăng, tin đồn đời tư hằng năm. |
| D3 Mặt tối giới giải trí | HOÀN THÀNH | life149 (`dark149`, `darkYear`) | feedback-d | 3 tình huống (gạ gẫm trao đổi lợi ích, ép hợp đồng, ép làm việc quá sức); chỉ có từ chối / tìm hỗ trợ / lên tiếng / đổi hướng, không có lựa chọn chấp nhận; tìm hỗ trợ và lên tiếng có kết quả sau 1–2 năm; không lặp trong 6 năm; người lạm quyền không xuất hiện như bạn để kết giao; không khóa con đường nổi tiếng. |
| D4 Giới thiệu đối tượng cho con | HOÀN THÀNH | life149 (`matchmaking149`) → `childMatch126` / `childWedding129` sẵn có | feedback-d, browser-feedback-menus | Ứng viên là con (tạo một lần, ổn định) của NPC đã quen; lọc tuổi, xu hướng, còn sống, chưa kết hôn, chưa được ghép. Hai phía đều có thể từ chối; cưới → thông gia (`inlaw149`); dừng tìm hiểu → người kia được tự do. |
| D5 Quà tặng người thân | HOÀN THÀNH | life149 (`gifts149`), sổ tài sản life148 | feedback-d, browser-feedback-menus | 8 loại, 2–3 mức giá; chủ sở hữu là người nhận; tài sản ròng của bạn giảm đúng giá trị; hồ sơ con hiện tài sản riêng; quá đắt có thể bị từ chối và không trừ tiền; giới hạn tuổi xe; mỗi người 1 món lớn/năm. |
| D6 Cầu hôn | HOÀN THÀNH | life149 (`proposal149`, `_venue`), nút `cau_hon` sẵn có | feedback-d, browser-feedback-menus | Nhẫn tùy chọn (không nhẫn / nhẫn đang có / mua), 6 nơi; xác suất theo tình cảm, thời gian quen, sở thích riêng tư/bất ngờ/giản dị; nhận lời = đính hôn (nhẫn sang tên người kia) → bàn chuyện cưới bằng `marry` → `contract108` sẵn có; từ chối: nhẫn vẫn của bạn, chờ 1 năm. Tự động chọn cầu hôn giản dị hoặc bàn thẳng chuyện về chung nhà. |

Kiểm thử mốc D: feedback-d 78 · browser-feedback-menus d (4 chuỗi × 2 kích thước) · feedback-a/b/c · smoke 11/11 · saves-compat · save-safety 10/10 · NPC 14/14 · relationships108/841 · family104/126/129/130/830 · audition139 · expansion842 · integration-gd6 · pace-gd5 · chains-gd4 · adult106. Đo 80 đời tự chơi: kết hôn 37 (có life149) so với 39 (không), số con 21 so với 26 — trong biên độ ngẫu nhiên.

Ghi chú kiểm thử: smoke `family-relations` từng thất bại ở điều kiện “mẫu 6 đời phải có con” do đường ngẫu nhiên đổi; đã sửa test để chơi thêm tối đa 6 đời khi mẫu chưa có con (bất biến kiểm tra giữ nguyên). `tests/player107.js` (“overseas postgraduate can reach defense”) thất bại cả ở mốc gốc `1f8248d` — lỗi có từ trước, chưa thuộc phạm vi đợt này, ghi vào tồn đọng.

## Mốc E — Tài sản hôn nhân, di chúc, thừa kế

| Yêu cầu | Trạng thái | Module | Test | Ghi chú |
|---|---|---|---|---|
| E1 Thỏa thuận tài sản trước hôn nhân | HOÀN THÀNH | life150 (`prenup150`, thêm lựa chọn vào `contract108` sẵn có) | feedback-e, browser-feedback-menus | Tùy chọn; 4 điều khoản (chia đôi / chỉ nhà ở / theo đóng góp 60-40 / doanh nghiệp riêng) + luật định; người kia đồng ý theo mức công bằng với họ, từ chối → hoãn cưới; lời giải thích theo quốc gia. Thỏa thuận cũ (riêng hoàn toàn / 10%) được hiểu đúng. |
| E2 Chia tài sản khi ly hôn | HOÀN THÀNH | life150 (`divorceSplit`, `payOut`, `court150` trong `settlement107`) | feedback-e, integration-feedback, browser-feedback-menus | Ghi nhận tài sản trước hôn nhân lúc cưới (mọi đường kết hôn qua `E.resolve` + vòng năm); thừa kế trong hôn nhân là tài sản riêng. Tỷ lệ xét đóng góp thu nhập, lỗi ngoại tình, chung sống không đăng ký; chia qua tiền, sổ tiết kiệm, vàng/cổ phiếu, bất động sản, đồ sưu tầm, nhà (kèm nợ vay), cơ sở kinh doanh, cổ phần; tài sản giảm đúng phần chia. Ra tòa: 1 năm, có giới hạn, có xét nuôi con. Hôn nhân trong bản lưu cũ giữ cách chia cũ. |
| E3 Di chúc chi tiết | HOÀN THÀNH | life150 (`will150` + 5 menu con; bọc `E.WILL70.estate`, `estateItems`, `allocateCompanies`, `E.finale`, `E.childOpts`, `E.createLife`) | feedback-e, integration-feedback, browser-feedback-menus | Tỷ lệ (di chúc cũ), tài sản cụ thể (không vượt di sản khi nợ lớn), truất quyền con trưởng thành (vô hiệu với con chưa thành niên), người thi hành (luật sư 1%), quyền điều hành ≠ sở hữu (đời con: anh chị em hoặc chính mình điều hành, cổ phần vẫn chia), phần tài sản chung của vợ/chồng tách khỏi di sản, VN bảo đảm 2/3 suất cho vợ/chồng; tranh chấp có xác suất ổn định, giải quyết 1–2 năm sau ở đời con. |
| E4 Đồng bộ sở hữu | HOÀN THÀNH | life148 (sổ `items`), life149, life150 | feedback-e, integration-feedback | Không chuyển món không phải của mình; đã tặng không tặng lại; di chúc ≤ 100%; không giao một tài sản hai lần; tổng chia = di sản ròng; quyền lợi gia tộc trừ một lần/năm; ly hôn không đụng tài sản con / bố mẹ / quà đã tặng; mỗi ly hôn xử lý một lần; thừa kế đồ sưu tầm đúng một lần; tải lại giữ chủ sở hữu. |

Kiểm thử mốc E: feedback-e 75 · integration-feedback 1.132–1.142 (số kiểm tra trong vòng tự chơi thay đổi theo đường ngẫu nhiên) (5 kịch bản + nguyên tắc chung, 16 đời tự chơi) · browser-feedback-menus e (4 chuỗi × 2 kích thước) · feedback-a/b/c/d · estate840 · heir-family770 · inheritance-currency117 · business128/133/137/143 · career109 · chains-gd4 · family104/126/129/130/830 · feedback843 · relationships108/841 · update551 · debt140 · smoke · saves-compat · save-safety · NPC · integration-gd6 · pace-gd5 · expansion842 · children141 · audition139. Tích hợp phát hiện và đã sửa: danh sách mâu thuẫn gia tộc chưa có giới hạn khi toàn mâu thuẫn mở (nay tối đa 10 mở cùng lúc).

## Hồi quy chọn lọc cuối đợt

- Hồi quy mục 9 (mọi tình huống × mọi lựa chọn trên khuôn nhân vật đa dạng), lọc 42 tình huống mới hoặc bị ảnh hưởng. Lần chạy đầu phát hiện 3 lỗi thật, đều đã sửa:
  1. `gifts149`: tên anh chị em hiện "undefined" (anh chị em lưu tên ở trường `n`).
  2. Đồng bộ chức vụ (life147): nhật ký "undefined nhận chức…" khi bổ nhiệm anh chị em, cùng nguyên nhân.
  3. `dark149`: không bao giờ xảy ra trong ván thật vì `l.job` là đối tượng, không phải chuỗi; test cũ gán sai kiểu nên không phát hiện. Đã sửa và cho test dùng `E.startJob`; đo 20 đời ca sĩ 15 năm: 5 đời gặp tình huống, đủ 4 kiểu lựa chọn.
- Thêm ngữ cảnh kiểm thử cho `deal148` và `dark149` trong `tests/regression-contexts.js` (dựng trạng thái bằng hàm của game).
- Thêm `tests/browser-dating-app.js` (A3 trên Chrome thật).

## Checkpoint

- Mốc A: commit `bab7317` (`feat(feedback-a)`).
- Mốc B: commit `07fe3c4` (`feat(feedback-b)`).
- Mốc C: commit `e1fd93f` (`feat(feedback-c)`).
- Mốc D: commit `15a3441` (`feat(feedback-d)`).
- Mốc E + tích hợp: commit xem lịch sử nhánh (`feat(feedback-e)`). Các commit B, C, D chưa kèm `dist.zip` (bản dựng chạy sau commit); commit cuối kèm bản dựng cuối cùng.
