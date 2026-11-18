# Khởi nghiệp theo vốn và kinh tế cơ sở kinh doanh (9.4.5)

## Vì sao sửa
Người chơi báo mở doanh nghiệp "năm nào cũng lỗ". Đo lại hai lớp kinh doanh có sẵn cho thấy hai nguyên nhân:

1. **Công ty (life123/128/133)**: lương ban điều hành (`BUSINESS133.pay`) là `l.base × hệ số` bất kể công ty lớn nhỏ. Công ty vốn 200 triệu (khoảng 2,2 lần mức sống cơ sở) có giám đốc thuê ngoài lỗ trung bình 60% vốn mỗi năm, 100% số năm đều lỗ; giám đốc nội bộ lỗ 34% vốn. Nay lương nhân với hệ số quy mô `clamp(giá trị công ty / (12 × l.base), 0,08, 1)`: công ty từ 12 lần mức sống trở lên trả đầy đủ như trước; công ty nhỏ vẫn lỗ nếu thuê giám đốc đắt (6%/năm với giám đốc thuê ngoài, 0% với nội bộ), không còn lỗ gần hết vốn.
2. **Cơ sở kinh doanh (`wealth.js`, `l.ventures`)**: khách năm đầu chỉ 60% và năm hai 88% trong khi chi phí cố định đủ, nên 80–87% cơ sở lỗ năm đầu, mất 25–35% vốn. Sau đó lãi lại rất cao (25–30%/năm trên vốn) và gần như không ai đóng cửa (sống sót 5 năm 83–94%). Nay khách năm đầu 76%, năm hai 93%; chi phí duy trì 3% vốn; thêm rủi ro đóng cửa hằng năm ngoài thua lỗ (bị đòi mặt bằng, kiệt sức, giấy phép, tranh chấp), cao hơn khi đang lỗ và trong hai năm đầu; ngành thực phẩm chịu giá nguyên liệu tăng; chủ vừa đi làm vừa đứng quầy chỉ bán được 62% thời gian.
   Kết quả đo (120 cơ sở mỗi loại): năm 1 lỗ ở 54–65% cơ sở, trung bình −3% đến −13% vốn; năm 2 trở lại có lãi; sống sót 5 năm 57–62% (quán cà phê, nhà hàng, spa, gym), 85% (cửa hàng tiện lợi), 76% (khách sạn mini).

Không cần lúc nào cũng có lãi: năm đầu lỗ, đóng cửa và thua lỗ vẫn xảy ra, nhưng đúng mức thực tế hơn.

## Hệ thống khởi nghiệp (`public/js/startup944.js`)
Mở rộng các hệ thống có sẵn, không dựng sổ sách riêng: danh mục thêm vào `E.wealth.BIZ`, cơ sở lưu trong `l.ventures` và hạch toán lãi lỗ bằng `wealth.investYear`; vay dùng `H.addLoan` (`family`, `bank`); công ty dùng `companySector133`.

Mục "Khởi nghiệp theo vốn" (nhóm Tiền bạc) gồm các bước:

1. **Chọn mô hình theo vốn.** 14 mô hình trong 3 tầng (vốn nhỏ ≤ 100 triệu: xe bánh mì, xe cá viên chiên, quầy trà sữa, shop thời trang online, sạp quần áo ở chợ; vốn vừa 100–600 triệu: tiệm tạp hóa, giặt ủi, nail/làm tóc, cửa hàng quần áo, quán cơm, tiệm bánh; vốn lớn trên 600 triệu: nhượng quyền trà sữa/cà phê, xưởng nhỏ, trang trại), cộng lối thành lập công ty và góp vốn startup. Mỗi dòng có bản phân tích: lãi/lỗ dự kiến năm 1, năm 2, khi ổn định, số năm hoàn vốn, điểm hòa vốn, quỹ dự phòng (3 tháng chi phí cố định) và rủi ro đóng cửa.
2. **Huy động vốn.** Tiền tự có; vay người thân (không lãi, tối đa 30–60% vốn tùy điều kiện gia đình, phải trả dần); vay ngân hàng (tối đa 70% vốn, cần không nợ xấu gần đây và dưới 70 tuổi); hoặc chuẩn bị thêm một năm (không tốn tiền, tay nghề khi khai trương tốt hơn). Khoản vay là nợ cá nhân thật: đóng cửa mà chưa trả hết vẫn còn nợ.
3. **Khai trương.** Chất lượng điều hành `q` phụ thuộc kiến thức, năng khiếu kinh doanh/ăn nói, kinh nghiệm nghề liên quan (ví dụ từng làm bếp thì mở quán ăn vững hơn) và năm chuẩn bị.
4. **Đánh giá cuối năm 1, năm 2** (và khi thua lỗ kéo dài, cách ít nhất 3 năm): giữ nguyên, quảng bá và nâng chất lượng, cắt chi phí cố định, đổi mặt hàng, thuê người đứng quầy (khi bạn còn đi làm), hoặc sang nhượng thu về 20–50% vốn.
5. **Sự kiện hằng năm** theo ngành: kiểm tra vệ sinh an toàn thực phẩm, giải tỏa vỉa hè (chỉ quầy ngoài đường), đối thủ mở cạnh bên, đơn lớn dịp lễ, hàng tồn ế, nhân viên chính nghỉ việc, chủ ốm, được nhiều người nhắc đến trên mạng. Mỗi sự kiện có 2–3 cách xử lý với chi phí và hậu quả khác nhau.
6. **Góp vốn startup (vốn lớn).** 10%, 25% hoặc 40% tiền mặt, có hoặc không thẩm định kỹ (3%). Kết quả sau 3–7 năm: mất trắng 62% (50% nếu thẩm định kỹ), thu về 0,4–1,6 lần 25% (30%), 2–6 lần 10% (15%), 8–25 lần 3% (5%). Kỳ vọng khoảng 1 lần vốn.

Trong cuộc chơi tự động, người có vốn thỉnh thoảng tự nghĩ đến chuyện khởi nghiệp (khoảng 1,2% mỗi năm, 5% khi đang thất nghiệp).

## Bảng mô hình (đo 150 cơ sở mỗi loại, đơn vị triệu đồng ở Việt Nam, mức sống cơ sở khoảng 70/năm)
| Tầng | Mô hình | Vốn | Năm 1 lỗ | Sống sót 5 năm | Lãi trung bình năm 3–5 |
|---|---|---|---|---|---|
| Nhỏ | Xe bánh mì / ăn sáng | 18 | 12% | 79% | 51/năm |
| Nhỏ | Xe cá viên chiên | 22 | 24% | 63% | 53/năm |
| Nhỏ | Quầy trà sữa mang đi | 55 | 63% | 46% | 70/năm |
| Nhỏ | Shop thời trang online | 25 | 66% | 48% | 41/năm |
| Nhỏ | Sạp quần áo ở chợ | 60 | 52% | 69% | 44/năm |
| Vừa | Tiệm tạp hóa | 180 | 6% | 91% | 58/năm |
| Vừa | Tiệm giặt ủi | 220 | 54% | 82% | 91/năm |
| Vừa | Tiệm nail / làm tóc | 200 | 65% | 60% | 99/năm |
| Vừa | Cửa hàng quần áo | 250 | 63% | 63% | 79/năm |
| Vừa | Quán cơm | 300 | 65% | 49% | 99/năm |
| Vừa | Tiệm bánh | 350 | 64% | 55% | 112/năm |
| Lớn | Nhượng quyền trà sữa / cà phê | 900 | 36% | 65% | 163/năm |
| Lớn | Xưởng sản xuất nhỏ | 1.800 | 39% | 84% | 328/năm |
| Lớn | Trang trại rau / nuôi trồng | 1.200 | 55% | 70% | 211/năm |

"Lãi" gồm cả công sức của chủ. Mô hình chỉ là tham số trò chơi; chưa đối chiếu số liệu thống kê doanh nghiệp từng nước, và số liệu nước ngoài chỉ quy theo mức sống (`bizV`).

## Chưa làm
- Thuế và giấy phép kinh doanh theo nước, theo quy mô (thuế khoán, hóa đơn điện tử…).
- Thuê và quản lý nhân viên chi tiết, mùa vụ trong năm, hợp đồng thuê mặt bằng nhiều năm.
- Bán cơ sở cho người khác theo định giá, thừa kế cơ sở nhỏ cho con.
- Hiển thị khoản góp vốn startup chưa có kết quả trong bảng tài sản ròng.

## Kết quả kiểm thử
Chạy lại toàn bộ hồi quy mục 0–75, 5b và mục 9 (24 nhóm): đạt, trừ các lỗi ngẫu nhiên ở mục 5 (một dòng nhật ký sau khi qua đời, không tái hiện trong 500 đời thử lại), 5b (tỷ lệ nợ nặng cuối đời ở Việt Nam dao động 10,9–12,7% giữa các lần chạy, ngưỡng 12%; trên cùng 400 đời bản 9.4.4 đo 12,5% và bản hiện tại 11,5%, tức không do phần kinh doanh gây ra), 42 (tỉ lệ bệnh ngẫu nhiên, có sẵn từ bản gốc), 60 (đời con có thể không tạo được, đạt khi chạy lại) và 31 (lãi resort 9,9 tỷ so với ngưỡng 10 tỷ, đã chỉnh chi phí duy trì tài sản lớn và đạt). 100 bài kiểm thử riêng lẻ đều đạt. tests/startup944.js 392 kiểm tra, tests/child-uni944.js 68 kiểm tra.
