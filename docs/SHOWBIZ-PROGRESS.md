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

## Mốc 4–6

CHƯA HOÀN THÀNH (đang làm).

## Checkpoint

- Mốc 1–2: commit `8d004e0` (`feat(showbiz-2)`).
- Mốc 3: commit xem lịch sử nhánh (`feat(showbiz-3)`).
