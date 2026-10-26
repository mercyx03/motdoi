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

| 9a | Mục 68 · "không nhắc người đã mất như còn sống" (chập chờn, ~1–3 / 250 đời) | **Lỗi do GĐ2**: `E.runHeadless` gọi `resolve` nội bộ (không qua wrapper `E.resolve`), nên trong mô phỏng headless, người yêu quay lại nhận uid mới thay vì uid người cũ. Hồ sơ life138 của "người cũ" vẫn sống và sinh tin tức sau khi người ấy mất | [life142.js](../public/js/life142.js): nối danh tính cả ở hook cuối năm, theo cờ `reunited`; uid tạm được ánh xạ bí danh về uid cũ | Đúng một danh tính cho người quay lại, trong game lẫn trong mô phỏng |
| 9b | Mục 68 (cùng phép quét) | Người lạ ngẫu nhiên (người kể chuyện nghề ở life85…) có thể trùng tên **bố/mẹ kế** đã mất. life89 đã có cơ chế tránh tên người quen nhưng thiếu bố/mẹ kế (life129, thêm sau) | Mở rộng danh sách `known()` của life89 (không tạo cơ chế mới) | Người đã mất không "xuất hiện kể chuyện" |

## B. Lỗi do bài kiểm thử (test được sửa đúng bản chất, có chứng minh)

| # | Lần thất bại | Bằng chứng | Sửa |
|---|---|---|---|
| 9 | Mục 9 · 7 tình huống "không khuôn nào kiểm tra được" | Cả 7 đều mở được trong game qua đường riêng (hook năm, menu cha) nhưng cần trạng thái đặc thù: chu cấp, đề nghị thực tập sinh, nợ bị bán, con đã công khai, tập đoàn… | Thêm ngữ cảnh vào `tests/regression-contexts.js`, dựng bằng đúng API của game. Mục 9 giờ thực sự chạy mọi phương án của cả 7 |
| 10 | Mục 31, 36, 42, 45, 51 (5) | `di_chuc70` được khai báo cố ý `jail:true, trap:true, mil:true` từ v5.6.0, khi đó từ 70 tuổi. Commit 1c09d29 hạ xuống 18 tuổi, nên di chúc xuất hiện trong các test giam giữ có nhân vật 18–31 tuổi. Không tốn lượt, không tốn tiền, AI không tự chọn | Mỗi test chấp nhận **đúng một** ngoại lệ `di_chuc70`; mọi hành động khác vẫn phải bị khóa (mục 51 vẫn đòi ≥ 6 hành động trong trại, không kể di chúc) |
| 11 | Mục 5b (1, chập chờn) | Mốc "nợ ròng ≥ −8 lần" suy từ quy tắc v2.0 (nợ quá hạn bị xóa). Từ commit 60dff47, nợ quá hạn có thể bị **bán**, tăng 12%/năm, chặn ở 6 lần (life140:26) | Tách hai bất biến: phần vay còn lại ≥ −8 (như cũ); nợ đã bán không vượt `max(năm trước × 1,12, 6 lần)` mỗi năm |
| 12 | Mục 60 (1, chập chờn) | Test viết ở v6.5. Từ v8.4.0 thừa kế gồm **tiền mặt + hiện vật** (life103); sống ở nền kinh tế khác thì quy đổi theo thu nhập cơ sở (life83/life103). Đo trên 60 đời: không mất giá trị nào | Kiểm: tiền mặt được cộng đúng một lần, tiền mặt + hiện vật − phải bù = phần thừa kế sau quy đổi |
| 13 | `hardcore-isolation.js` (sau khi hết crash) | Test đòi đời chế độ thường **giống từng byte** ảnh chụp v7.6.0. Từ v8.0, nhiều module cố ý thay đổi chế độ thường | Kiểm đúng mục đích "cách ly": cùng các đời chế độ thường, có và không có life97/life98, phải giống từng byte. Ảnh chụp v7.6.0 giữ lại để tham khảo. Đã thử cố ý vi phạm: test bắt được |

| 14 | Mục 68 (cùng phép quét) | Phép quét so theo tên, chỉ loại trừ con / anh chị em / bạn bè / bạn đời còn sống; chưa tính người quen do life138 sinh riêng (bạn cùng lớp, thầy cô, đồng nghiệp — có từ v8.5). Ví dụ "Ousmane Kaboré": bạn cùng lớp tiểu học (còn sống) trùng tên bố dượng đã mất | Tính thêm người quen life138 còn sống có khóa `class:`/`teacher:`/`colleague:`. Không tính hồ sơ khóa theo uid (có thể chính là người đã mất), nên lỗi 9a vẫn bị bắt |

## C. Không phải lỗi (giữ nguyên)

- 3/200 con nhà thế lực không được gia đình sắp xếp việc học vì ở 16 tuổi **tự chọn "theo nghề"** sở thích (trợ lý trang điểm, ca sĩ đám cưới) và rời trường. Đây là lựa chọn hợp lệ.
- Catalogue admin có số mục thay đổi giữa các lần build (1504/1505/1506), vì được sinh từ các đời mô phỏng ngẫu nhiên khi build.

## D. Tổng kết số liệu

| | Số lượng |
|---|---|
| Lần thất bại ban đầu ở mục 9 | 197 (GĐ0); 196 khi chụp lại đầu GĐ2.5. Số lượt thử phụ thuộc khuôn nhân vật sinh theo giờ thật |
| Lỗi ở các mục khác ghi nhận trước GĐ2.5 | 9 (GĐ0) + mục 60 và mục 42 "gia đình sắp xếp việc học" (chập chờn) |
| Test chuyên đề crash | 1 (`hardcore-isolation.js`) |
| Lộ thêm khi nghiệm thu GĐ2.5 | mục 5/20 (thu nhập sau khi mất), mục 58 (`confirm()` từ GĐ1), mục 68 (người đã mất "sống lại" trong tin tức: lỗi do GĐ2 + trùng tên) |
| Nguyên nhân gốc | **16**: 10 thuộc engine/dữ liệu (A1–A8, 9a, 9b), 6 thuộc bài kiểm thử (B9–B14; B13 đi kèm A6) |
| Đã sửa | **16 / 16**, mỗi nguyên nhân có test tái hiện trong `tests/regression-fixes.js` (8 ca) hoặc được kiểm bằng chính bộ hồi quy |

## E. Kết quả nghiệm thu (trung thực, kể cả phần chưa hoàn tất)

| Lần chạy | Mã | Kết quả |
|---|---|---|
| Mục 9 đầy đủ (2 nửa) | `a64130d` | **0 lỗi**: 2.424.204 + 2.764.930 kiểm tra; 904/1.298 tình huống được kiểm (trước đây 897) |
| 76 mục còn lại | `a64130d` | **1 lỗi**: mục 68 "nhật ký không nhắc người đã mất như còn sống (1)". Đã tìm ra nguyên nhân và sửa ở `a0721a5` (9a, 9b, B14) |
| Mục 9, nửa đầu | `a0721a5` (mã cuối) | **0 lỗi**: 2.422.452 kiểm tra |
| Mục 9, nửa sau | `a0721a5` | **CHƯA HOÀN TẤT**: tiến trình bị dừng sau 588 giây, chưa có kết quả |
| 76 mục còn lại | `a0721a5` | **CHƯA HOÀN TẤT**: bị dừng ở mục 16 (sau 1.132 giây), chưa có kết quả |
| Phép quét "người đã mất sống lại" (cùng logic mục 68, giờ thật) | `a0721a5` | 0 trường hợp / 3.000 đời. Trước khi sửa: 10 / 3.000 |
| 30 test chuyên đề (gia đình, nợ, thừa kế, doanh nghiệp, Hardcore, tuyển sinh…) | `a64130d` | Đạt hết. 5 test trọng điểm chạy lại trên `a0721a5`: đạt |
| Test nhanh (smoke, 60 bản lưu, an toàn bản lưu, NPC, tái hiện GĐ2.5) | `a0721a5` | Đạt hết |
| Build production | `a0721a5` | Đạt (28 file triển khai, `dist.zip` không đổi) |

**Kết luận:** GĐ2.5 **chưa nghiệm thu hoàn toàn**. Mọi nguyên nhân gốc đã biết đều có bản sửa và test tái hiện đạt, nhưng bộ hồi quy đầy đủ **trên mã cuối cùng** (`a0721a5`) mới chạy xong nửa đầu mục 9. Việc đầu tiên cần làm: chạy lại nửa sau mục 9 và 76 mục còn lại trên mã cuối.

## F. Ảnh hưởng gameplay đã đo (baseline 400 đời, `pre-gd2-5` → `31e30ab`)

- Tỷ lệ có bằng đại học +6,4% (11,0% → 11,7%), do sửa lối kẹt khi trượt lớp 10.
- Câu nhật ký lặp −6,4%; dòng trung tính −6,1%, do không còn ghi lặp khoản phí thường niên.
- Các chỉ số khác lệch dưới 2,5%. Dung lượng bản lưu không đổi (147 KB trung vị).
- Chưa đo lại baseline và hiệu năng sau hai commit cuối (`a64130d`, `a0721a5`); hai commit này chỉ đổi nhật ký, cách gọi và việc nối danh tính.
