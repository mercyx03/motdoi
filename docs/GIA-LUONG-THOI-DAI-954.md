# Bản 9.5.4 — lương, giá nhà theo thời đại; hợp đồng cầu thủ; thừa kế

## Lương và giá theo thời đại (`price954.js`)
Trước đây `l.base` cố định nên người sinh 1960 hay 1985 có lương, tiền nhà, học phí của năm nay. Nay `rel(l)` lấy `gdpRel` của nước đang cư trú tại năm sống (`E.ERA920.at`), giới hạn 0,06–1,25, và trước 1950 giảm thêm tối đa 45% (như `ctx945.pov`). `H.setBase` và `E.createLife` đặt lại hệ số; hook năm đầu tiên cập nhật `l.base` khi hệ số lệch trên 0,4%.

| Việt Nam | Thu nhập cơ sở / hiện nay |
|---|---|
| sinh 1950 | khoảng 13% |
| sinh 1960 | khoảng 16% |
| sinh 1985 | khoảng 18% |
| sinh 2000 | khoảng 34% |
| sinh từ 2024 | 100% |

- Mọi khoản tính theo bội số `l.base` (lương, ăn ở, tiền nhà, con cái, xe máy, giá nhà ngoài Việt Nam) đổi đồng bộ. Ở Việt Nam, giá nhà (`housePrice`) và các khoản `V()` là số tuyệt đối nên được nhân hệ số `flags.eraK954`.
- Xe ô tô giữ giá thực (không nhân hệ số): ô tô thời 1985–2000 bằng nhiều chục năm thu nhập, nên gần như không ai mua.
- Tiền đã tích lũy giữ nguyên số, không quy đổi: kinh tế lớn lên thì thu nhập lớn theo, của cải cũ thành tương đối nhỏ.
- Giới hạn: một số bảng giá tuyệt đối riêng của từng module (ngoài `V()` và giá nhà) chưa nhân hệ số; thuế và bảo hiểm Việt Nam dùng ngưỡng hiện nay nên người thu nhập thấp thời xưa hầu như không phải nộp.

## Bóng đá (`football.js`)
- `wageNow(l, c)`: lương năm hiện hành = lương hợp đồng × (1 + `raise`)^số năm đã qua. `raise` 8% cho cầu thủ trẻ tiềm năng, 5% ngôi sao, 3% thường, 2% trên 30 tuổi, 0 khi hợp đồng một năm.
- `release`: hợp đồng từ 3 năm có điều khoản giải phóng `(2 + 0,5 × số năm) × lương`.
- Quyết định hết hạn: chỉ hỏi một lần cho mỗi hợp đồng, ở năm cuối. `renew` thương lượng với CLB hiện tại theo `negotiationChance`; `raise` đòi thêm 25% lương nhưng khó hơn 22 điểm phần trăm.
- Cầu thủ tự do: mỗi năm tối đa ba lời mời theo phong độ, CLB cùng nước ưu tiên; chờ nhiều mùa làm giảm phong độ và tên tuổi.

## Thừa kế
`E.WILL70.forKid` trong `life68.js` dùng bản di sản chưa chia lại, còn màn cuối đời và phân chia tài sản dùng bản đã chia lại ở `life150.js`. Nay cả hai dùng một bản.
