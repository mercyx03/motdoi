# Tiến độ nâng cấp Showbiz, Gameshow, Idol và Hẹn hò

Nhánh `player-feedback-upgrade` (tiếp sau bản 8.6.0 `acc6aa5`). Mỗi mốc: sửa code → test chuyên đề + test module bị ảnh hưởng → nhật ký (chưa phát hành) → commit/push → dist/dist.zip → checkpoint.

## Mốc 1 — Kiểm tra và bảo toàn showbiz cũ

Kiểm tra bằng mã nguồn hiện tại, lịch sử Git (147 commit, `git log --all -G`) và `tests/showbiz-audit.js` (chơi thật từng chương trình bằng lựa chọn tự động).

| Nội dung | Có từ trước | Tình trạng | Vai trò người chơi | Bằng chứng |
|---|---|---|---|---|
| Anh Trai "Say Hi", Tinh Hà "Say Hi", Em Xinh "Say Hi", Anh Trai Vượt Ngàn Chông Gai, Tân Binh Toàn Năng | Có (life39) | Chơi được: 4–7 vòng, bị loại / được cứu / chung kết | Thí sinh (ca sĩ, rapper, nhạc sĩ… theo giới tính, tuổi, danh tiếng; Tân Binh từ 2025) | showbiz-audit |
| Bạn Muốn Hẹn Hò, Người Ấy Là Ai, Đảo Thiên Đường | Có (life41) | Chơi được, mỗi chương trình gói gọn trong 1 lựa chọn; có thể có người yêu sau chương trình | Người tham gia độc thân 20–42 tuổi ở Việt Nam | showbiz-audit |
| Running Man Việt Nam, 2 Ngày 1 Đêm | Có (life32 + life48) | Chơi được: khách mời 2 tập / thành viên cố định 6 tập, nhiều chặng, cát-xê theo tập | Khách mời / thành viên cố định khi nổi tiếng (≥100.000) và thuộc nghề giải trí | showbiz-audit |
| Diễn viên: học diễn, casting (web drama, phim truyền hình, điện ảnh), doanh thu phòng vé, quảng cáo, xưởng phim | Có (life32, life60) | Chơi được | Diễn viên | showbiz-audit |
| Audition công ty giải trí, thực tập sinh | Có (life139, mốc A) | Chơi được, chỉ từ 18 tuổi | Thực tập sinh | showbiz-audit, audition139 |
| Xem truyền hình, concert, show rap, fan meeting, danh sách nghệ sĩ các show để làm fan | Có (leisure, life73) | Còn | Khán giả / fan | showbiz-audit |
| Rap Việt | Chỉ có ở vai khán giả (thể loại concert, danh sách thí sinh để theo dõi) | Chưa từng có phần thi | — | life73 |
| Nhanh Như Chớp | Không (chỉ là cụm từ trong một câu văn) | Bổ sung mới ở mốc 2 | — | git log |
| Vietnam Idol, Giọng Hát Việt, Ca Sĩ Mặt Nạ, Ai Là Triệu Phú, Olympia, Siêu Trí Tuệ, Đấu Trường 100, Running Man Hàn Quốc, New Journey to the West, The Genius, The Devil's Plan, Bloody Game, Single's Inferno, Heart Signal, EXchange/Transit Love, I Am Solo, Produce 101, Girls Planet 999, Boys Planet, I-LAND, Universe Ticket | Không có trong bất kỳ commit nào | Bổ sung mới | — | git log --all -G |

Kết luận mốc 1: không có nội dung bị mất cần khôi phục. Đính chính báo cáo phát hành 8.6.0: “Đảo Thiên Đường” **có** trong game (life41); lần kiểm tra trước tìm phân biệt hoa thường nên bỏ sót. Mốc 1 không có thay đổi gameplay nên không có mục nhật ký riêng.

## Mốc 2 — Gameshow kiến thức

| Chương trình | Quốc gia, thời gian | Format mô phỏng | Trạng thái |
|---|---|---|---|
| Nhanh Như Chớp | VN, từ 2019 | 15 câu, đúng lên bậc / sai về 0, chuỗi 10 câu liên tiếp → 20 triệu; 1 lần nhờ người thân gợi ý; khách mời nổi tiếng: cát-xê, tiền thắng gửi từ thiện | HOÀN THÀNH |
| Ai Là Triệu Phú | VN, từ 2005 (câu 15: 150 triệu, từ 2026: 500 triệu) | 15 câu, mốc câu 5 / 10, 50:50, hỏi khán giả (tỉ lệ cộng 100%), gọi điện, tổ tư vấn, dừng cuộc chơi | HOÀN THÀNH |
| Who Wants to Be a Millionaire? | Quốc tế | Như trên, tiền theo mặt bằng nơi ở | HOÀN THÀNH |
| Đường Lên Đỉnh Olympia | VN, từ 1999, học sinh THPT 16–18 học giỏi | 4 thí sinh, Khởi động (+10/−5, bấm chuông), Vượt chướng ngại vật (từ khóa), Tăng tốc (40/30/20/10), Về đích (10/20/30); tuần → tháng → quý → năm | HOÀN THÀNH |
| Siêu Trí Tuệ Việt Nam | VN, từ 2019 | Ghi nhớ dãy số / chuỗi hình ảnh (ẩn khi hỏi), tính nhẩm; 3 vòng đối đầu | HOÀN THÀNH |
| Đấu Trường 100 | VN, 2006–2015 | 1 đấu 100, loại người sai, tiền tích lũy, dừng hoặc mất hết | HOÀN THÀNH |

Bộ câu hỏi `E.QUIZ151`: 17 dạng (sinh theo tham số: tính nhanh, phần trăm, dãy số 5 kiểu, sắp xếp, đổi đơn vị, giờ / thứ, thối tiền, suy luận chiều cao, bài toán tuổi, số nguyên tố, số La Mã; tra bảng đã kiểm chứng: 42 thủ đô + châu lục, 8 hành tinh, 20 nguyên tố, 20 mốc lịch sử, 15 tác phẩm, 32 câu dữ kiện cố định). Kiểm thử 30.000 câu: 0 lỗi; 3.000 phép tính được tính lại độc lập; 60 câu liên tiếp không lặp; bản quốc tế không hỏi dữ kiện riêng Việt Nam.

Kiểm thử mốc 1–2: showbiz-audit 56 · showbiz-quiz 4.047 · browser-showbiz (4 chương trình × 2 kích thước) · hồi quy mục 9 cho show151 / show151_step / show151_invite · smoke · saves-compat · save-safety · NPC · pace-gd5 · integration-gd6 · integration-feedback · feedback-b · update-*.

## Mốc 3 — Gameshow vận động, chiến thuật, hẹn hò, âm nhạc

| Chương trình | Quốc gia, thời gian | Format / luật | Trạng thái |
|---|---|---|---|
| Running Man Việt Nam, 2 Ngày 1 Đêm | VN (có sẵn) | Giữ nguyên mùa quay life48 + thử thách có đáp án life64; thêm nhiệm vụ đặc biệt sau mỗi tập (chỉ thưởng danh tiếng, độ thân) | HOÀN THÀNH |
| Running Man (Hàn Quốc) | KR, từ 2010 | Khách mời 1 tập: săn manh mối + xé bảng tên | HOÀN THÀNH |
| New Journey to the West | KR, từ 2015 | Khách mời: oẳn tù tì, đoán số, bốc bát | HOÀN THÀNH |
| The Genius | KR, 2013–2015 | 8 người, đấu giá kín / số duy nhất / hợp tác–phản bội, garnet, miễn loại, đấu loại bốc sỏi (Nim), chung kết | HOÀN THÀNH |
| The Devil's Plan | KR, từ 2023 | Như trên, thứ tự trò khác | HOÀN THÀNH |
| Bloody Game | KR, từ 2021 | Như trên, 5 vòng | HOÀN THÀNH |
| Single's Inferno, Heart Signal, EXchange (Transit Love), I Am Solo | KR, từ 2021 / 2017 / 2021 / 2021 | Hồ sơ, gu, hấp dẫn, giới thiệu, thi giành quyền hẹn, hẹn hò, tin nhắn ẩn danh, đối thủ tình cảm, người yêu cũ, lựa chọn cuối hai chiều, tiếp tục hẹn hò bằng E.DEC.love | HOÀN THÀNH |
| Người Ấy Là Ai, Đảo Thiên Đường, Bạn Muốn Hẹn Hò | VN (có sẵn, nhiều vòng) | Giữ nguyên | GIỮ NGUYÊN |
| Rap Việt | VN, từ 2020 | Tuyển chọn (HLV chọn, nón vàng khi cả 4 chọn → bỏ vòng đối đầu), đối đầu, bứt phá, bán kết, chung kết | HOÀN THÀNH |
| Giọng Hát Việt | VN, 2012–2019 | Giấu mặt (quay ghế), chọn HLV, đối đầu (có thể được giành), loại trực tiếp, liveshow, chung kết | HOÀN THÀNH |
| Vietnam Idol | VN, 2007–2016, từ 2023 | Thử giọng 3 giám khảo (≥2 đồng ý, vé vàng), nhà hát, Gala bình chọn, chung kết | HOÀN THÀNH |
| Ca Sĩ Mặt Nạ | VN, 2022–2023 | Nghệ sĩ nổi tiếng, mặt nạ, giấu giọng, bị đoán đủ 3 gợi ý hoặc bình chọn thấp → tháo mặt nạ, Mặt nạ vàng | HOÀN THÀNH |
| HLV Rap Việt / Giọng Hát Việt, giám khảo Vietnam Idol | VN | Chọn 3 thí sinh, 3 vòng huấn luyện (kỹ thuật / cảm xúc / sân khấu), loại dần, kết quả mùa | HOÀN THÀNH |

Trò chơi nhỏ `E.MINI152` (luật xác định, kiểm thử chơi đúng chiến thuật thắng rõ hơn): xé bảng tên 0,99 so với 0,00; manh mối 1,00 / 0,24; oẳn tù tì 0,92 / 0,07; đoán số 1,00 / 0,12; bốc bát là may rủi có thông tin (0,65).

Phát hiện khi làm: chặng thi life48 ở chế độ rút gọn đã có thử thách có đáp án (life64) — giữ nguyên, không chèn đè.

Kiểm thử mốc 3: showbiz-games 585 · showbiz-dating-music 69 · browser-showbiz m3 (4 chương trình × 2 kích thước) · quét chữ hiển thị mọi chương trình (0 lỗi sau khi sửa 2 chỗ "undefined") · hồi quy liên quan.

## Mốc 4 — Sự nghiệp diễn viên

| Nội dung | Module | Trạng thái |
|---|---|---|
| Casting cũ (web / truyền hình / điện ảnh, học diễn, quảng cáo) | life32 | GIỮ NGUYÊN, vai nhận được ghi vào hồ sơ phim |
| Thử vai dự án cụ thể: kịch bản, thể loại, quy mô, ngân sách, đạo diễn và bạn diễn là NPC lâu dài (life148), thử vai → vai quần chúng / phụ / chính, đàm phán cát-xê (1 lần), chuẩn bị vai theo thể loại, trường quay, sự cố, đóng máy | life154 `film154` (lựa chọn mới trong `casting`) | HOÀN THÀNH |
| Phát hành năm sau: doanh thu / lượt xem, điểm đánh giá, thưởng doanh thu vai chính phim ≥ 100 tỷ; mùa giải thưởng năm kế tiếp (Cánh Diều, Bông Sen, Mai Vàng — tên giải; kết quả mô phỏng) | life154 | HOÀN THÀNH |
| Hồ sơ phim, nấc nghề trùng bậc nghề `dien_vien` (quần chúng → vai phụ → vai chính → hạng A → ngôi sao) | life154 `actor154` | HOÀN THÀNH |
| Phim thành công / đoạt giải → lời mời Running Man / 2 Ngày 1 Đêm (lời mời sẵn có của life48), Running Man Hàn Quốc khi ở Hàn | life154 `promote` | HOÀN THÀNH |
| Nhà sản xuất (góp vốn, chia lại sau một năm, có thể lỗ), chuyển nghề đạo diễn (xưởng phim life60) | life154 | HOÀN THÀNH |
| Gương Mặt Thân Quen (VN, từ 2013): thí sinh hóa thân 5 tuần, 3 giám khảo chấm; ngôi sao làm giám khảo | life154 | HOÀN THÀNH |

Kiểm thử mốc 4: showbiz-actor 51 · browser-showbiz m4 · hồi quy mục 9 (casting, film154, actor154, hoc_dien, quang_cao, show151, gameshow, film_menu: 39.484 đạt) · career109 · careers105 · smoke · saves · save-safety · pace-gd5 · integration-feedback.

## Mốc 5 — Thực tập sinh K-pop và idol

| Nội dung | Module | Trạng thái |
|---|---|---|
| Phát hiện tài năng 14–16 tuổi (hội diễn trường, video, buổi thử giọng, người quen); xác suất theo kỹ năng thật life138 (hát, nhảy, diễn, nhạc cụ, ngoại ngữ), tự tin, sức khỏe, học lực; ngoại hình ≤ 8 điểm tiềm năng; người yếu vẫn có cơ hội nhỏ | life155 `scout155` | HOÀN THÀNH |
| Nhận lời: tìm hiểu công ty (chia doanh thu, ký túc xá, việc học, ~20 giờ / tuần), audition 3 phần, bố mẹ / người giám hộ đồng ý hoặc không (tin cậy, học lực, uy tín công ty), ký cùng người giám hộ | life155 | HOÀN THÀNH |
| Dưới 18 tuổi: vẫn đi học, không chuyển ra nước ngoài (đào tạo bán thời gian, trại hè có người giám hộ); 18 tuổi / tốt nghiệp → đề nghị toàn thời gian qua `audition139` / `auditionPrep139` sẵn có | life155 + life139 | HOÀN THÀNH |
| 3 kỳ đánh giá / năm, 11 thực tập sinh NPC (năng lực, tính cách, tốc độ tiến bộ), xếp hạng, bạn bè, đối thủ, người bị cắt hợp đồng; nợ chi phí đào tạo | life155 `eval155` | HOÀN THÀNH |
| Debut: thành lập nhóm khi xếp hạng cao (hoặc debut theo life139), chọn vị trí (5), concept; mỗi năm quảng bá, fandom, cúp âm nhạc, concert, lưu diễn; chia doanh thu theo hợp đồng sau khi trừ nợ; nhận một lần mỗi năm; mời Running Man Hàn Quốc | life155 `debut155`, `idolYear` | HOÀN THÀNH |
| Produce 101 (2016–2019), Girls Planet 999 (2021, nữ), Boys Planet (từ 2023, nam), I-LAND (từ 2020), Universe Ticket (2023–2024, nữ): xếp hạng A–F, nhiệm vụ nhóm / vị trí / tranh center, chọn bài concept, bình chọn, cắt giảm, chung kết; vào đội hình → nhóm dự án có thời hạn | life155 `survival` | HOÀN THÀNH |

Kiểm thử mốc 5: showbiz-idol 70 · browser-showbiz m5 · hồi quy mục 9 (scout155, eval155, debut155, audition139, auditionPrep139, show151…: 47.254 đạt) · audition139 · life138 · smoke · saves · save-safety · npc-identity 14/14 · pace-gd5 · integration-feedback · feedback-a.

Ghi chú: `npc-identity` ca 2 chọn một đời mẫu bằng tự chơi; thêm sự kiện mới làm đổi đường ngẫu nhiên, đời mẫu ly hôn trong 3 năm của ca kiểm tra nên tra định danh trả về hồ sơ người cũ (cùng định danh). Đã sửa test để chấp nhận đúng trường hợp này (cùng định danh, cùng tên), không nới các trường hợp khác.

## Mốc 6 — Tích hợp

| Nội dung | Module | Trạng thái |
|---|---|---|
| 11 thành tựu mới (E.addAchievements sẵn có) | life156 | HOÀN THÀNH |
| Thành tích tốt ở gameshow kiến thức → lời mời gameshow kiến thức khác (một lần mỗi kết quả) | life156 | HOÀN THÀNH |
| Bốn con đường: diễn viên (quần chúng → vai phụ → phim thành công → Running Man → ngôi sao → giám khảo), idol (15 tuổi → đánh giá → 18 tuổi toàn thời gian → Boys Planet → debut → Running Man Hàn Quốc → lưu diễn), người bình thường (Nhanh Như Chớp 20 triệu → mời Ai Là Triệu Phú), hẹn hò (Heart Signal → hẹn hò → kết hôn qua luồng cưới sẵn có) | integration-showbiz | ĐẠT |

Sửa trong khi kiểm thử tích hợp: life108 gán `undefined` cho vài trường hồ sơ người yêu (vd. `workplace108`), làm thứ tự khóa sau khi lưu / tải khác bản đang chơi (lỗi ẩn có từ trước, lộ ra khi đường ngẫu nhiên đổi); nay chỉ chép trường có giá trị. Không ảnh hưởng lối chơi, nhưng giúp kiểm thử lưu / tải giống hệt từng ký tự.

Kiểm thử cuối đợt: integration-showbiz 91 · showbiz-audit 56 · showbiz-quiz 4.047 · showbiz-games 585 · showbiz-dating-music 69 · showbiz-actor 51 · showbiz-idol 70 · hồi quy mục 9 cho 23 tình huống mới / liên quan (95.739 đạt, 0 lỗi) · trình duyệt: browser-showbiz 24 lượt, browser-feedback-menus 26, browser-feedback-b, browser-dating-app · audition139 · life138 · career109 · careers105 · smoke · saves-compat · save-safety · npc-identity · pace-gd5 · chains-gd4 · integration-gd6 · integration-feedback · feedback-a…e · relationships108/841 · family830 · update-release · update-showbiz / update-feedback (chạy lại sau khi dựng dist mới).

## Tổng hợp

- Danh mục mới (E.SHOW151): 25 chương trình + 10 chương trình sẵn có (life39: 5 show âm nhạc; life41: 3 show hẹn hò; life48: Running Man Việt Nam, 2 Ngày 1 Đêm).
- Câu hỏi (E.QUIZ151): 17 dạng; đo 20.000 lượt mỗi dạng ra số câu khác nhau: tính nhanh 10.268, sắp xếp 20.000, số nguyên tố 16.875, suy luận chiều cao 6.372, giờ / thứ 4.911, dãy số 977, đổi đơn vị 891, tuổi 600, thối tiền 267, phần trăm 250, lịch sử 208, thủ đô / châu lục 84, số La Mã 46, nguyên tố 40, dữ kiện cố định 32, văn học – nghệ thuật 15, hành tinh 11. 100.000 lượt sinh ra 25.761 câu khác nhau. Không gian tham số lý thuyết lớn (~10¹¹, chủ yếu do bài sắp xếp số) nhưng không tuyên bố vô hạn; các dạng tra bảng có số câu hữu hạn.

## Giới hạn còn lại

- Các format là mô phỏng lấy cảm hứng; không tái hiện chính xác mọi luật / mùa phát sóng (ví dụ thể lệ chi tiết Olympia, Vietnam Idol 2023 chưa xác minh đầy đủ qua nguồn công khai).
- Show Hàn Quốc chỉ mở khi sống / hoạt động ở Hàn Quốc, là thực tập sinh / idol công ty Hàn, hoặc rất nổi tiếng.
- Thực tập sinh dưới 18 tuổi không chuyển ra nước ngoài (đào tạo bán thời gian trong nước); không mô phỏng chi tiết hợp đồng lao động thực tế từng nước.
- Các mục mới chủ yếu là hành động người chơi chủ động; chế độ Tự động chỉ tham gia khi có lời mời / sự kiện kích hoạt (lời mời khách mời nổi tiếng, được công ty chú ý, mời quay lại).
- Người Ấy Là Ai, Đảo Thiên Đường, Bạn Muốn Hẹn Hò giữ nguyên format cũ (đã có nhiều vòng), không nâng cấp lên bộ hẹn hò mới.

## Checkpoint

- Mốc 1–2: commit `8d004e0` (`feat(showbiz-2)`).
- Mốc 3: commit `8df3c4d` (`feat(showbiz-3)`).
- Mốc 4: commit `9803381` (`feat(showbiz-4)`).
- Mốc 5: commit `30e1b3f` (`feat(showbiz-5)`).
- Mốc 6: commit xem lịch sử nhánh (`feat(showbiz-6)`).
