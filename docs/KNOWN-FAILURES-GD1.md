# Lỗi kiểm thử có sẵn trước GĐ1

Danh sách lỗi của bộ hồi quy và các test chuyên đề, chạy trên mã **trước GĐ1** (tag `pre-gd1`, `public/` giống hệt `pre-gd0` / `3fea0d5`). GĐ1 không sửa, không xóa, không đổi kết quả mong đợi của các test này.

## Cách tái hiện

Cách đơn giản nhất là chạy đủ bộ hồi quy (1–2 giờ):

```bash
node tests/regression.js
```

Chạy theo nhóm để nhanh hơn (đây là cách đã dùng cho báo cáo này):

```bash
node tests/regression-shard.js 9
```

```bash
MOTDOI_DEC_IDS=direct111,companyName137,companyTransfer137,companyMerge137,academicCase125,comeOut130,supportRules130,groupRoles137,auditionPrep139,childrenSuccession139,collectors140 node tests/regression-shard.js 9
```

Lệnh cuối chạy trong khoảng 1 phút và cho đúng 197 lỗi, tái hiện ổn định qua nhiều lần chạy.

```bash
node tests/hardcore-isolation.js
```

## Mục 9 — 197 lỗi

| Tình huống | Số lỗi | Nguyên nhân |
|---|---|---|
| `direct111` (học Y diện tuyển thẳng) | 16 | `direct111` ghi `l.uniName` rồi gọi `DEC.major.apply`. Với ngành Y, [life40.js:53](../public/js/life40.js) gán lại `l.uniName = uniFor(...)` thành `null`, vì trường Y thường được chọn ở bước sau. Sau đó [life67.js:102](../public/js/life67.js) ghi nhật ký "Xác nhận học Y khoa tại **null** · 6 năm". **Ảnh hưởng dữ liệu:** bản lưu của người chơi đi đường này mất tên trường (`uniName = null`) và có một dòng nhật ký chứa chữ `null`. Không làm hỏng việc lưu/tải. |
| `companyName137`, `companyTransfer137`, `companyMerge137` | 58 mỗi tình huống | Hai phương án "Xác nhận" / "Hủy" có gợi ý `h: null` thay vì chuỗi. Giao diện lọc giá trị rỗng (`[…, o.h].filter(Boolean)` trong app.js) nên **người chơi không thấy chữ hỏng**; test hồi quy yêu cầu gợi ý phải là chuỗi. |
| `academicCase125`, `comeOut130`, `supportRules130`, `groupRoles137`, `auditionPrep139`, `childrenSuccession139`, `collectors140` | 1 mỗi tình huống | "kiểm tra được trên ít nhất một khuôn": không khuôn nhân vật nào của test (và `tests/regression-contexts.js` không có ngữ cảnh) thỏa điều kiện mở các menu này (vụ việc học thuật đang mở, con công khai xu hướng, nợ bị bán cho bên đòi nợ…). Đây là **thiếu độ phủ kiểm thử**, không phải lỗi game. |

## Các mục khác — 9 lỗi

| Mục | Lỗi |
|---|---|
| 5b | `world: nợ không phình vô hạn` (thấp nhất −8,2 lần thu nhập cơ sở) |
| 22 | `tuổi thơ đa dạng, hiếm khi lặp lại` (lặp 8,42%) |
| 31 | `trong quân ngũ không làm được việc khác` |
| 35 | `Cùng giới mà gọi vợ/chồng …` (×3) và `cặp đôi cùng giới không bị gọi nhầm "vợ" / "chồng"` |
| 36 | `bị giam trong trại lừa đảo thì không làm được việc gì …` |
| 38 | `chơi ở nước khác ít lặp câu` (8,2% dòng nhật ký lặp) |
| 42 | `việc bạn muốn làm trong tù đổi thành việc trong trại …` |
| 45 | `năm cuối trong tù chỉ mở các thao tác trong trại` |
| 51 | `bị giam ở trại lừa đảo: "việc bạn muốn làm" chỉ còn các việc trong trại` |

### Mục 60: lỗi chập chờn, phát hiện ở GĐ2, có sẵn từ trước

`tiền thừa kế được cộng đúng một lần vào tiền mặt, đúng bằng phần của con`:
- Khi người con được "sống tiếp ở tuổi hiện tại" (`E.heirAtAge`), khoản thừa kế nhận được đôi khi nhỏ hơn `E.heirShare(P, k)`, ví dụ 24.383 so với 58.316.
- Tái hiện trên mã **trước GĐ2** (`pre-gd2`): 2/14 đời mẫu với đồng hồ cố định, 1/11 với giờ thật. Sau GĐ2: 0/11 và 2/9.
- Test regression chỉ kiểm đời đầu tiên tìm được, mà `life.id` theo giờ thật đổi mỗi lần chạy, nên lỗi lúc hiện lúc ẩn.
- Nằm ở phần tính thừa kế, ngoài phạm vi GĐ2; chưa sửa.

Các lỗi ở mục 5b, 22, 38 là ngưỡng thống kê. Chúng có thể chập chờn vì `life.id` lấy theo đồng hồ thật (xem `docs/TESTING-GD0.md`).

## Test chuyên đề

`tests/hardcore-isolation.js` bị crash với lỗi `TypeError: Cannot read properties of undefined (reading 'localChild')` tại life129.js. Ở chế độ "trước bản 8.3", test cố ý không nạp `life100.js`, nhưng `life129.js` (thêm sau đó) gọi `E.FAMILY100.localChild`. Test này dùng fixture `tests/fixtures/normal-before-hardcore-redesign.json`.

## Tổng hợp

| | Trước GĐ1 | Sau GĐ1 |
|---|---|---|
| Lỗi hồi quy mục 9 (11 tình huống trên) | 197 | 197 (danh sách giống hệt) |
| Lỗi hồi quy các mục liên quan lưu/tải, NPC, tài chính (7, 12, 15, 19, 20, 42, 44, 45, 52, 60, 68, 70, 72, 75) | 2 (mục 42, 45) | 2 (giống hệt) |
| Lỗi hồi quy các mục còn lại | 7 | chưa chạy lại sau GĐ1 (bộ rất chậm; GĐ1 không đụng các luồng đó) |
| Test chuyên đề crash | 1 (`hardcore-isolation.js`) | 1 (cùng lỗi) |

**Sau GĐ2:** chạy lại 14 mục liên quan cùng 17 test chuyên đề, kết quả giống hệt GĐ1 (2 lỗi mục 42, 45; `hardcore-isolation.js` crash như cũ). Mục 0: 323/323 đạt.

Số kiểm tra "đạt" giữa hai lần chạy chênh nhau vài trăm (ví dụ 203.388 so với 202.596). Nguyên nhân là `life.id` theo giờ thật làm khuôn nhân vật và số mẫu sinh ra khác nhau. Không có kiểm tra nào chuyển từ đạt sang lỗi.

Không lỗi nào ở trên được xếp loại "bắt buộc sửa để bảo vệ bản lưu":
- `direct111` làm mất một trường hiển thị (tên trường đại học) khi đang chơi, không làm mất bản lưu.
- Sửa lỗi này là thay đổi gameplay của luồng nhập học, nên để giai đoạn sau, kèm test riêng.
