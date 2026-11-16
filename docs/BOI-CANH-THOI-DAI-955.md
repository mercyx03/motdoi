# Bản 9.5.5 — lương, giá, sự kiện đúng thời đại; phân biệt đối xử

## Lỗi đã sửa ở lương
Ở 9.5.4 `l.base` nhân hệ số thời đại nhưng bảng lương dùng `WEC.scale` (số liệu hiện nay theo nước) nên lương không đổi, chi phí thì đổi. Người sinh Mỹ 1960 có lương 2026 trên mặt bằng chi phí rẻ. `scale()` trong `careers.js` nay nhân `K`. Kiểm tra: lương giáo viên chia thu nhập cơ sở của Mỹ 1960 và 2020 là 1,18 và 0,94; trước đó lệch gấp bốn lần.

## Chặn sai thời
| Tình huống | Từ năm |
|---|---|
| văn hóa thần tượng (kpop, scout, hợp đồng thực tập sinh) | 1996 |
| đêm rap | 1980 |
| clip lan truyền | 2005 |
| mạng xã hội, kênh nội dung | 2006 |
| cuộc thi tìm giọng hát trên truyền hình | 1983 (Việt Nam 2000) |
| truyền hình tìm bạn đời | 1965 (Việt Nam 2008) |
| xuất khẩu lao động | 1960 (Việt Nam 1992) |
| nghề làm móng | 1970 (Việt Nam 1990) |

## Phân biệt đối xử (data-bias955.js)
- Người đồng tính, song tính: mức 0–3 theo nước và năm; ví dụ Anh 1950 mức 3, 1970 mức 2, 2020 mức 0; Nga 2000 mức 1, 2015 mức 2, 2023 mức 3. Tình huống `bias955_lgbt` xuất hiện với xác suất theo mức (4–14%/năm, cách nhau 4 năm), lựa chọn giữ kín, giữ mối quan hệ kín đáo, tìm cộng đồng, công khai, rời đi. Bị lộ: mức 1 mất bạn bè; mức 2 mất việc hoặc bị tống tiền; mức 3 khoảng một nửa số ca bị bắt, còn lại phải hối lộ.
- Phân biệt chủng tộc, sắc tộc: tỷ lệ dân cư thuộc nhóm bị phân biệt theo từng chế độ, rút theo mã đời. Thu nhập bị trừ 4%, 12%, 25% tùy mức; tình huống `bias955_race` có nhẫn nhịn, nhờ cộng đồng, đấu tranh (có thể bị bắt ở mức 3), chuyển đi.
- Chỉ áp cho đời có `l.era920` nên người sinh từ 2024 không đổi.
- Mốc dựa trên kiến thức lịch sử phổ biến, chưa đối chiếu từng mốc với nguồn trực tuyến trong phiên làm việc này; mức là ước lượng.

## Giới hạn
- Chưa mô hình giới tính (chuyển giới), tôn giáo thiểu số riêng, hay phân biệt theo địa phương ngoài vài vùng.
- Thuế và bảo hiểm chỉ chỉnh cho Việt Nam; nước khác giữ nguyên.
- Hợp đồng nhiều năm cho vận động viên ngoài bóng đá chỉ đặt mức sàn thu nhập; ca sĩ, diễn viên dùng hợp đồng công ty giải trí đã có.
