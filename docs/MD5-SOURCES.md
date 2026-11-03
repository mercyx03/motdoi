# MD5 (8.10.24) — Nguồn, phạm vi và mức kiểm chứng

Ngày đọc: 03/11/2026 (UTC+7). Mức kiểm chứng:
- **official**: đã đọc trang của cơ quan nhà nước/tổ chức gốc trong đợt này.
- **secondary**: nguồn thứ cấp hoặc kiến thức chung, chưa đọc nguyên văn. Chỉ là đầu mối, chưa phải bằng chứng cuối.
- **unverified**: không có nguồn; trò chơi chỉ dùng tham số chung và ghi rõ trong game.
- **parameter**: thông số cân bằng game, không phải số liệu thật.

Một URL chỉ dùng cho đúng claim ghi bên cạnh, không dùng để đánh dấu cả nhóm nước là đã xác minh.

## FIN — luật, cư trú, quốc tịch

| Claim trong game | Nguồn | Mức | Giản lược |
|---|---|---|---|
| Visa học ngắn hạn ở Anh không chuyển được sang Student visa từ trong nước | https://www.gov.uk/student-visa/switch-to-this-visa (danh sách diện không được chuyển có "short-term student visa"); https://www.gov.uk/study-visit-visa (không gia hạn được) | official | `fix920 SWITCH.GB = leave` |
| Đổi diện tại chỗ sau khóa tiếng ở JP, KR, DE, AU, CA, US | — | secondary | Ghi nguồn thứ cấp trong lời kể; các nước khác `unverified` → nộp từ nước nhà |
| Đức: trẻ dưới 18 tuổi lúc nộp đơn, được nhận nuôi hợp lệ theo luật Đức, có quốc tịch Đức. Bản án nước ngoài phải chấm dứt quan hệ với cha mẹ cũ và tương đương luật Đức | https://www.gesetze-im-internet.de/stag/__6.html (§6 StAG) | official | `ADOPT.DE = auto` |
| Mỹ: con nuôi diện IR-3, dưới 18 tuổi, sống cùng cha/mẹ là công dân thì tự có quốc tịch (Child Citizenship Act 2000, INA 320) | Trang USCIS trả 403 khi đọc tự động. Kết quả tìm kiếm dẫn tới uscis.gov "U.S. Citizenship for an Adopted Child" và adoption.state.gov | secondary | `ADOPT.US = auto`. Chưa tách IR-3 với IR-4 |
| Pháp (adoption plénière), Anh (tòa Anh/La Hay; trường hợp khác phải đăng ký), Canada, Úc (nộp hồ sơ), Nhật (nhập tịch giản lược) | — | secondary | Nước khác → `unverified`, nộp hồ sơ, xét sau ≥1 năm |
| Singapore: chỉ được từ bỏ quốc tịch từ 21 tuổi. Trẻ được cấp quốc tịch được giữ quốc tịch khác đến 21 tuổi; muốn giữ quốc tịch Singapore phải từ bỏ quốc tịch nước ngoài và tuyên thệ (Oath of Renunciation, Allegiance and Loyalty) trước 22 tuổi, nếu không sẽ mất quốc tịch vào sinh nhật 22. Người lớn không được giữ hai quốc tịch | Trang ICA (ica.gov.sg, citizenship renunciation; ask.gov.sg/ica). Đọc qua kết quả tìm kiếm vì URL trực tiếp trả 404 | secondary (gần official) | **Chưa sửa mã** cho mốc 21 tuổi: quy tắc trên là của *trẻ được cấp quốc tịch (registered minors)*. Trẻ có quốc tịch theo huyết thống từ khi sinh cần đọc nguyên văn Hiến pháp Singapore. Ghi BACKLOG FIN-02 |
| Ly hôn khi đang chấp hành án: vợ/chồng vẫn có quyền yêu cầu tòa giải quyết | Kiến thức chung về Luật HN&GĐ 2014 (Điều 51) | secondary | Một quy trình chung cho mọi nước: hòa giải, có thể hoãn (tối đa 2 lần), chờ thông báo khi mất liên lạc. Xác suất là tham số |
| Hỗ trợ tiêu hủy gia súc 35% giá trị, trần 2 lần mức cơ sở/năm, đàn mới nhập trong năm chỉ hỗ trợ một nửa | — | parameter | Chưa đối chiếu văn bản hỗ trợ dịch bệnh của từng nước |

## SCHOOL — prom và tiệc cuối cấp

| Mục | Nguồn | Mức |
|---|---|---|
| Studniówka khoảng 100 ngày trước matura, mở màn bằng polonaise, có thầy cô và giáo viên chủ nhiệm | https://www.gov.pl/web/zsckr-w-korolowce-osadzie/studniowka-2026 (24/01/2026) | official (một trường; ngày cụ thể do từng trường chọn) |
| Vanhojen tanssit ở các trường lukio, tháng 2 | https://www.espoo.fi/fi/uutiset/2026/02/kuvia-vanhojen-tansseista-2026 (5–6/02/2026) | official về thời điểm. Khối học sinh (khóa áp chót) là nguồn thứ cấp |
| US/CA, GB, AU/NZ, IT, PH, IN/PK, DE, RU, UA, AT, ZA, PE, KR, JP, TR, HR, RS, HU, VN | — | secondary. Khả năng một trường có tổ chức (`p`) là tham số |

## RITE — lễ trưởng thành

| Mục | Nguồn | Mức |
|---|---|---|
| Ba nghi lễ của nam thanh niên Maasai (Enkipaata, Eunoto, Olng'esherr), khoảng 15–30 tuổi, Kenya, Danh sách cần bảo vệ khẩn cấp từ 2018 | https://ich.unesco.org/en/RL/enkipaata-eunoto-and-olng-esherr-three-male-rites-of-passage-of-the-maasai-community-01390 | official. Game chỉ cho tìm hiểu/quan sát |
| Seijin: lễ cho tuổi 20, tuổi trưởng thành theo luật là 18 từ 4/2022 | Hai URL web-japan.org trả 403 khi đọc | secondary |
| Quinceañera, Quán lễ/Kê lễ, Bar/Bat Mitzvah | — | secondary |
| Rumspringa, Naghol, Sateré-Mawé | — | Đang nghiên cứu: chỉ có thông tin, không nhập vai, không có thử thách đau đớn |

## ROYAL

| Mục | Nguồn | Mức |
|---|---|---|
| Sovereign Grant trả cho công vụ của nguyên thủ, không phải thu nhập riêng. Privy Purse/Duchy of Lancaster chi phần công vụ chưa được Grant chi trả. Tài sản riêng (Balmoral, Sandringham). Cung điện và Crown Jewels thuộc nhà vua với tư cách nguyên thủ, không bán được | https://www.royal.uk/royal-finances | official |
| Kế vị không phân biệt giới (GB 2013, SE, NO, DK, NL, BE, LU); ưu tiên nam (ES, MC); chỉ dòng nam (JP, LI); 6 người đầu hàng kế vị ở Anh cần nhà vua chấp thuận hôn nhân; nữ hoàng tộc Nhật kết hôn với thường dân thì rời hoàng tộc | — | secondary |
| Danh xưng con của công chúa (dòng nữ) không tự có tước Prince/Princess (Letters Patent 1917) | — | secondary |
| Mức ngân sách công vụ (người trị vì 10, working royal 2 lần mức cơ sở/năm) và tiền riêng từ quỹ gia tộc (2 / 1,2 / 0,6 / 0,5) | — | parameter |
| SA, OM, SZ, TH, BN, LI và các nước còn lại | — | unverified: chỉ có loại hình quân chủ và kiểu kế vị, ghi "chưa xác minh" trong game |

## PARENTING

| Mục | Nguồn | Mức |
|---|---|---|
| Trừng phạt thân thể không cải thiện hành vi, gây hại sức khỏe và phát triển, có nguy cơ leo thang. Nên dùng cách nuôi dạy tích cực | https://www.who.int/news-room/fact-sheets/detail/corporal-punishment-and-health | official |
| Hiệu quả các hoạt động nuôi dạy (điểm, căng thẳng, gắn bó) | — | parameter |
