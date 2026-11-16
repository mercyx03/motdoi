# Bản 9.5.3 — tuổi thơ nhỏ đa dạng hơn

## Vấn đề
Ở tuổi 3–7 chỉ có ít chuyện có lựa chọn nên “lạc mẹ giữa chợ phiên” xuất hiện ở khoảng một phần tư số đời qua hai tình huống riêng (`bi_lac` và `k6_lac_cho`), lại luôn là chợ phiên kể cả ở nơi và thời chưa có chợ phiên.

## Đã đổi
- Hợp nhất: mỗi đời gặp tối đa một lần (`flags.lost953`), xác suất mỗi năm giảm còn 0,6% và trọng số chọn còn 0,22. Đo trên 250 đời: Việt Nam 1990 khoảng 1%, 2000 khoảng 3%.
- Nơi bị lạc: `crowd(l)` chọn trong chợ, ngày hội, siêu thị (chỉ khi thành thị, từ 1996 ở Việt Nam hoặc từ 1960 ở nước đủ giàu), bến xe hoặc nhà ga (thành thị, từ 1930). Nhà có nghề buôn bán thì dễ ở chợ và ít khi lạc lâu.
- Hậu quả nhiều năm (chuỗi `lost953`, một giai đoạn sau 1–3 năm): sợ chỗ đông người (`flags.crowdFear953`) làm mất một nửa số dịp hội hè, hòa nhạc, cắm trại, tham quan đến tuổi 24 và tự hết ở 16 tuổi với một nửa số người; hoặc học thuộc địa chỉ (`flags.knowsWay953`) làm tăng 1,6 lần khả năng gặp chuyện tự đi xe buýt. Xem pháo hoa đứng ở rìa có thể làm nguôi nỗi sợ.
- Vùng chiến sự hoặc thiên tai nặng (chiến sự hoặc thiên tai mức 2 trở lên theo `E.CTX945.of`): cảnh đi chợ bị chặn, thay bằng thất lạc khi chạy loạn. Chuỗi `sep953`: sau 1–2 năm được hỏi tìm tin, sau 1–3 năm nữa có đoàn tụ hoặc chưa có tin (`flags.missingFam953`).

## Chuyện mới theo hoàn cảnh
| Chuyện | Tuổi | Hoàn cảnh quyết định |
|---|---|---|
| Với tay lên bếp | 2–5 | vật nóng đổi theo năm và nơi ở; tiếp cận y tế quyết định bỏng nhẹ hay để sẹo |
| Bờ nước sau nhà | 3–7 | chỉ nông thôn hoặc ven biển; số người trông quyết định có vớt kịp hay không |
| Nuốt nhầm đồ | 2–4 | dầu hỏa, nước tẩy, viên giặt hoặc thuốc bảo vệ cây trồng tùy năm và nghề của bố mẹ |
| Cơn sốt giữa đêm | 1–6 | dịch trong vùng, cơ sở y tế xa hay gần; có thể co giật do sốt và tái phát |
| Nhà có thêm em bé | 2–7 | chỉ khi có em mới sinh; đổi mức thân thiết với em |
| Đêm hội | 3–9 | chỉ thời bình; nguôi nỗi sợ chỗ đông người |
| Trò giả làm người lớn | 2–6 | theo nghề của bố mẹ |
| Chuyến đi xa đầu tiên | 4–9 | phương tiện theo năm và nơi ở |
| Phụ giúp việc nhỏ | 4–8 | theo nông thôn hoặc thành thị |
| Thất lạc khi chạy loạn | 2–10 | chỉ ở vùng chiến sự hoặc thiên tai nặng |

## Giới hạn
- Mức tiếp cận y tế là một chỉ số đơn giản (nơi ở, mức phát triển của nước, chiến sự, dịch); không nói gì về tính cách hay sự chăm sóc của gia đình.
- Các chuỗi của tuổi thơ đến đúng năm cố định theo mã đời để cùng hạt giống diễn ra như nhau.
