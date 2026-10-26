# GĐ2.5 — Xử lý lỗi regression tồn đọng

Mỗi nguyên nhân gốc có một ca trong `tests/regression-fixes.js`, được viết để **thất bại trên mã trước khi sửa** (tag `pre-gd2-5`) và đạt sau khi sửa. Riêng các nguyên nhân thuộc test (nhóm B) được kiểm bằng chính bộ hồi quy.

## A. Lỗi engine / dữ liệu (đã sửa trong mã game)

| # | Lần thất bại | Nguyên nhân gốc | Sửa | Ảnh hưởng gameplay |
|---|---|---|---|---|
| 1 | Mục 9 · `direct111` (16) | Tuyển thẳng ghi `flags.study54.admitted` **sau** khi gọi `DEC.major.apply`, nên `uniFor` ([life40.js:30](../public/js/life40.js)) chọn lại trường theo thành phố. Ngành Y ra `null`; ngành khác **âm thầm đổi sang trường khác** trường đã chọn. | [life111.js](../public/js/life111.js): ghi `admitted` trước, đúng như life67/life102 | Tuyển thẳng vào đúng trường người chơi chọn |
| 2 | Mục 9 · `companyName137`, `companyTransfer137`, `companyMerge137` (174) | Hàm `form()` của [life137.js](../public/js/life137.js) tạo phương án "Xác nhận/Hủy" thiếu gợi ý `h`; mọi quyết định khác đều có `h` dạng chuỗi | Thêm `h: ''` | Không thay đổi gameplay. Test kèm kiểm bảo toàn cổ phần khi tặng và giá trị khi sáp nhập |
| 3 | Mục 35 (2) | Câu "Bạn đưa **vợ/chồng** đi trong đêm…" (bỏ trốn khỏi bên đòi nợ, [life140.js](../public/js/life140.js)) viết chung chung, nên cặp cùng giới bị gọi nhầm | `H.partnerWord` → "vợ"/"chồng"/"người bạn đời"; nhãn người thân ở life137 thêm `label` (giữ `kind` làm khóa phân loại) | Cách gọi đúng |
| 4 | Mục 22, 38 (2) | Hook life138 thu phí "chăm sóc và học tập thường niên" ghi **cùng một câu** mỗi năm. Khi từ chối thì ghi "chuyển sang phương án rẻ hơn" kể cả khi đã ở phương án rẻ nhất. Câu thanh toán ([life53.js](../public/js/life53.js)) không nói chi cho việc gì | Chỉ ghi khi cách chi trả thay đổi; chỉ "chuyển" khi thật sự chuyển; câu thanh toán nói rõ khoản chi | Tiền thu/chi y như cũ; lặp câu tuổi thơ 8,5% → 1,2% |
| 5 | Mục 42 · "gia đình sắp xếp việc học" (1, chập chờn) | Thi lớp 10 ([life125.js](../public/js/life125.js)): trượt phương án "công lập địa phương" thì báo "cần chọn phương án khác" nhưng không mở lại; "chờ đợt sau" cũng không có đợt sau. Học sinh kẹt ngoài trường | Trượt thì mở lại lựa chọn ngay (bỏ phương án vừa trượt); "chờ đợt sau" được xét lại năm sau (dưới 18 tuổi) | Con nhà thế lực được gia đình sắp xếp học: 89,5% → 96%; tỷ lệ có bằng đại học +6,4% |
| 6 | `hardcore-isolation.js` (crash) | [life129.js](../public/js/life129.js) gọi `E.FAMILY100.localChild` mà không kiểm module có được nạp hay không (life134 có kiểm) | Thêm điều kiện như life134 | Không thay đổi khi chơi bình thường |
| 7 | Mục 5 và 20 (2, chập chờn; lộ ra khi nghiệm thu GĐ2.5) | Wrapper `careerYear` của [life105.js](../public/js/life105.js) (nhạc) và [life34.js](../public/js/life34.js) (cày thuê) ghi thu nhập **sau dòng qua đời** khi nhân vật mất giữa năm | Không ghi khi đã mất | Nhật ký đúng thứ tự |
| 8 | Mục 58 · "không dùng confirm()" (1; lộ ra khi nghiệm thu GĐ2.5) | **Lỗi do GĐ1**: thẻ "Bỏ bản lưu chưa mở được" dùng `confirm()`, bị chặn trong trình duyệt tích hợp | Dùng `ask()` của game | Nút bấm được trong Facebook/Zalo… |

## B. Lỗi do bài kiểm thử (test được sửa đúng bản chất, có chứng minh)

| # | Lần thất bại | Bằng chứng | Sửa |
|---|---|---|---|
| 9 | Mục 9 · 7 tình huống "không khuôn nào kiểm tra được" | Cả 7 đều mở được trong game qua đường riêng (hook năm, menu cha) nhưng cần trạng thái đặc thù: chu cấp, đề nghị thực tập sinh, nợ bị bán, con đã công khai, tập đoàn… | Thêm ngữ cảnh vào `tests/regression-contexts.js`, dựng bằng đúng API của game. Mục 9 giờ thực sự chạy mọi phương án của cả 7 |
| 10 | Mục 31, 36, 42, 45, 51 (5) | `di_chuc70` được khai báo cố ý `jail:true, trap:true, mil:true` từ v5.6.0, khi đó từ 70 tuổi. Commit 1c09d29 hạ xuống 18 tuổi, nên di chúc xuất hiện trong các test giam giữ có nhân vật 18–31 tuổi. Không tốn lượt, không tốn tiền, AI không tự chọn | Mỗi test chấp nhận **đúng một** ngoại lệ `di_chuc70`; mọi hành động khác vẫn phải bị khóa (mục 51 vẫn đòi ≥ 6 hành động trong trại, không kể di chúc) |
| 11 | Mục 5b (1, chập chờn) | Mốc "nợ ròng ≥ −8 lần" suy từ quy tắc v2.0 (nợ quá hạn bị xóa). Từ commit 60dff47, nợ quá hạn có thể bị **bán**, tăng 12%/năm, chặn ở 6 lần (life140:26) | Tách hai bất biến: phần vay còn lại ≥ −8 (như cũ); nợ đã bán không vượt `max(năm trước × 1,12, 6 lần)` mỗi năm |
| 12 | Mục 60 (1, chập chờn) | Test viết ở v6.5. Từ v8.4.0 thừa kế gồm **tiền mặt + hiện vật** (life103); sống ở nền kinh tế khác thì quy đổi theo thu nhập cơ sở (life83/life103). Đo trên 60 đời: không mất giá trị nào | Kiểm: tiền mặt được cộng đúng một lần, tiền mặt + hiện vật − phải bù = phần thừa kế sau quy đổi |
| 13 | `hardcore-isolation.js` (sau khi hết crash) | Test đòi đời chế độ thường **giống từng byte** ảnh chụp v7.6.0. Từ v8.0, nhiều module cố ý thay đổi chế độ thường | Kiểm đúng mục đích "cách ly": cùng các đời chế độ thường, có và không có life97/life98, phải giống từng byte. Ảnh chụp v7.6.0 giữ lại để tham khảo. Đã thử cố ý vi phạm: test bắt được |

## C. Không phải lỗi (giữ nguyên)

- 3/200 con nhà thế lực không được gia đình sắp xếp việc học vì ở 16 tuổi **tự chọn "theo nghề"** sở thích (trợ lý trang điểm, ca sĩ đám cưới) và rời trường. Đây là lựa chọn hợp lệ.
- Catalogue admin có số mục thay đổi giữa các lần build (1504/1505/1506), vì được sinh từ các đời mô phỏng ngẫu nhiên khi build.
