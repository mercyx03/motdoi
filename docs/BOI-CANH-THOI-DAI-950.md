# Bối cảnh thời đại theo nước và năm sinh (9.5.0)

Mục tiêu: một đời sinh vào năm nào, ở nước nào thì mọi thứ phải đúng với hoàn cảnh năm đó: chiến tranh thì thiếu ăn, mất cha mẹ, nghỉ học; nạn đói thì trẻ nhỏ dễ chết; thời chưa có thì không có lễ thôi nôi bốc đồ, trường quốc tế, học thêm; nước đóng cửa thì khó đi nước ngoài. Không tạo hệ thống song song: mô-đun mới cắm vào `E.ERA920` (số liệu theo năm và bối cảnh chính trị), `E.HIST` (sang chấn, di dời, thiếu thốn), `E.TRIG`, `E.DEC`, `E.HOOKS.year` và `E.devGdp` có sẵn.

## Tệp

| Tệp | Vai trò |
|---|---|
| `public/js/data-ctx945.js` | Bảng dữ liệu: chiến tranh, nạn đói, dịch bệnh, khủng hoảng kinh tế, thiên tai, hạn chế xuất cảnh, thời thuộc địa, nhóm nước |
| `public/js/ctx945.js` | Logic: tra cứu bối cảnh `E.CTX945.of(l)`, tử vong cộng thêm, gia đình, phong tục, tần suất sự kiện, việc của thời loạn |
| `public/js/religion945.js` | Tôn giáo theo từng nước (sửa lỗi dữ liệu), kể cả giáo phái Kitô giáo |
| `public/js/era920.js` | Nền tử vong và thiếu thốn trước 1950 |
| `public/js/engine.js` | Nhân tần suất sự kiện, lương thực, tôn giáo khi tạo đời, trần kiến thức |
| `public/js/faith830.js`, `life124.js` | Giáo phái Kitô giáo theo nước thay vì mặc định phương Tây |
| `public/js/royal847.js` | Đường cong kiến thức bão hòa hơn |
| `tools/verify-ctx945.js` | Đối chiếu bảng dữ liệu với danh sách Wikipedia đã tải |
| `tests/ctx945.js` | 2.356 phép kiểm |

## Nguồn

Bảng chiến tranh, nạn đói, dịch bệnh, thiên tai, khủng hoảng được dựng từ các danh sách Wikipedia (danh sách nạn đói, chiến tranh theo thế kỷ, danh sách dịch bệnh, danh sách động đất và thiên tai lớn, khủng hoảng kinh tế, phong tỏa biên giới), tải ngày 15/11/2026. Mỗi dòng ghi một nhãn ngắn để hiện trong nhật ký đời. Dữ liệu đánh dấu `ver: 'secondary'` (nguồn thứ cấp, mức độ là ước lượng của game, không phải số liệu thống kê chính thức). Không dùng dữ liệu 1in8b.

Số dòng: chiến tranh 241, nạn đói 79, dịch bệnh 29, khủng hoảng kinh tế 58, thiên tai 35, hạn chế xuất cảnh 30, thời thuộc địa 51 (bổ sung cho bảng bối cảnh chính trị có sẵn).

Công cụ `node tools/verify-ctx945.js` (cần mạng) so với danh sách Wikipedia: nạn đói khớp 78/79, chiến tranh mức 3 khớp 92/96. Các dòng không khớp là do khác từ khóa (ví dụ Cuba 1991–95, vài dòng Bắc Macedonia, Romania, Singapore, Kuwait), không phải thiếu dữ liệu.

## Cơ chế

### 1. Tra cứu bối cảnh một năm (`of(l)`)
Trả về mức chiến sự (`war` 1–3), nạn đói (`fam`), dịch (`epi`), kinh tế (`econ`), thiên tai (`dis`), hạn chế xuất cảnh (`restrict`), thuộc địa, và `hard` (mức tổng hợp: chiến tranh, nạn đói, dịch từ mức 2, thiên tai hoặc khủng hoảng nặng; kinh tế nhẹ như bao cấp không tính). Có thêm `pov` (mức nghèo nền) tính theo GDP bình quân tuyệt đối của nước năm đó nhân với số liệu tương đối của `ERA920`, và `lux` (mức hưởng thụ có thể có).

### 2. Tử vong cộng thêm
Mỗi năm cộng hazard theo tuổi và giới: nạn đói nặng nhất với trẻ sơ sinh và người già, chiến tranh nặng với nam tuổi chiến đấu, dịch theo mức độ, thiên tai theo năm. Trước 1950 dùng đủ mức vì nền tử vong lúc đó chưa gồm các biến cố; từ 1950 chỉ 20% vì chuỗi số liệu của Liên Hợp Quốc đã gồm phần lớn phần tử vong do khủng hoảng. Nền trước 1950 trong `era920.js` thấp hơn tuổi thọ kỳ vọng và cao hơn tỷ lệ chết dưới 5 tuổi (`preE`, `preU`).

### 3. Gia đình
Cha mẹ có thể mất vì chiến tranh, nạn đói, dịch; thu nhập hộ và lương thực theo hệ số bối cảnh; nhà trường gián đoạn khi chiến sự hoặc nạn đói nặng.

### 4. Phong tục chỉ có khi hoàn cảnh cho phép
Thôi nôi bốc đồ, sinh nhật, mẫu giáo, đồ chơi mua sẵn, học chữ sớm, lò luyện thi, tiệc cưới linh đình có điều kiện: năm sớm nhất, mức biến cố tối đa, mức nghèo tối đa và mức khá giả của nhà (`l.fam.q`). Ví dụ lễ thôi nôi không có giữa nạn đói hoặc chiến tranh và khó có ở nhà nghèo trước 1960; trường quốc tế và học thêm chỉ có từ khoảng 1990 và không có ở vùng chiến sự hay nạn đói.

### 5. Xuất cảnh
Xuất khẩu lao động, du học, di cư, xin visa và hộ chiếu bị chặn khi nước đóng cửa (mức 3: Bức màn sắt 1950–87, Trung Quốc 1950–78, Triều Tiên, Cuba 1960–2012, Việt Nam 1975–86, Myanmar 1962–2011…); mức 2 chỉ nhà khá giả có quan hệ mới đi được.

### 6. Tần suất sự kiện
Hệ số nhân vào xác suất: sự kiện xa xỉ (hòa nhạc, mua sắm, game, du lịch…) giảm theo mức khó khăn, sự kiện nguy hiểm (cướp, bom, bão lũ, bắt bớ, nợ nần…) tăng, sự kiện chiến tranh tăng khi có chiến sự. Ở nước và năm không có biến cố (ví dụ đời sinh 2026 ở Việt Nam, Nhật Bản, Hàn Quốc) kết quả giống hệt khi không có mô-đun, kiểm chứng bằng băm.

### 7. Việc của thời loạn, đói, dịch
Tìm chỗ trú, xếp hàng khẩu phần, nhịn đói, con ốm, nghỉ học, bị gọi nhập ngũ, mất việc, dịch bệnh, dựng lại cuộc sống, bị ép làm chỉ điểm. Việc chưa giải quyết tiếp diễn sang năm sau và để lại sang chấn, di dời, thiếu thốn qua `E.HIST`.

### 8. Tôn giáo
`religion945.js` thay phân bố tôn giáo mặc định bằng bảng theo nước (châu Phi, các nước Ả Rập, Balkan, châu Mỹ Latinh, châu Đại Dương, các nước giàu) và trọng số giáo phái. Sửa lỗi "Chính thống giáo Đông phương" xuất hiện ở Rwanda và các nước tương tự; chế độ Việt Nam không đổi.

### 9. Kiến thức và điểm thi
Trần kiến thức bão hòa mềm (`KNOW_KNEE853=90`, độ dốc 0,5) cộng suy giảm hằng năm khi vượt 58, để điểm thi trung bình gần 21–23 thay vì 23 trở lên; hạng thi vẫn phân hóa.

## Giới hạn đã biết

- Mức độ biến cố là ước lượng; một số cuộc xung đột nhỏ hoặc cục bộ không có.
- Bối cảnh được áp theo nước và năm, chưa theo vùng trong nước (vùng chiến sự và vùng yên ổn của cùng một nước dùng chung mức).
- Thời thuộc địa chủ yếu hiện qua ghi chú và hạn chế; chưa có chuỗi sự kiện riêng cho từng thuộc địa.
- Bản lưu cũ: đời đang chơi tiếp tục bình thường, các trường mới được tính khi cần; không đổi định dạng lưu.
- Đời sinh 1950 trở đi ở nước và năm không có biến cố gần như không đổi; kết quả thống kê dao động giữa các lần chạy vì dùng `Date` thật.
