# Danh tính, tính cách và quan hệ NPC (GĐ2)

Lớp cầu nối là `public/js/life142.js` (`E.NPC`). Lớp này không có kho NPC riêng: mỗi thông tin chỉ có **một nguồn có thẩm quyền**, các module khác đọc/ghi qua nguồn đó.

## 1. Bảng ánh xạ trước GĐ2 (đã khảo sát)

| Người | Nơi tạo / lưu | Định danh đang dùng | Nguồn tính cách | Nguồn tin cậy / quan hệ |
|---|---|---|---|---|
| Bố, mẹ | `l.fam` (engine), không có object riêng | `'mother'`/`'father'` (life138), `parent:N` (family100), **`'parent:m:<tên>'`** (life113) | `fam.mTrait/fTrait` (life90, 16 kiểu) **và** `life138.people.mother.trait` (8 kiểu, ngẫu nhiên riêng) | `family100.trust/tension` **và** `life138.trust` |
| Bạn đời | `l.partner` (engine, family.js, life74, life80…) | `uid110` cấp khi cần, `family100.uid` | `traits130` (life130) **và** `life138.trait` **và** kiểu phản ứng family100 băm theo tên | `family100.trust/tension`, `p.close` **và** `life138.trust` |
| Người cũ | `flags.exList` (life80) | **theo tên** | không có (mất khi chia tay) | không có (mất khi chia tay) |
| Con | `l.kids[i]` | `uid110`, `parentId` (life54), `family100.uid`, `'child:<uid>'` (life113), chỉ số mảng (family100, có kiểm tra uid) | `persona141.traits` (life141), `future126.trait` (life126), `life138.trait`, kiểu family100 băm theo tên | `persona141.trust/attach/fear`, `k.close` **và** `family100.trust` **và** `life138.trust` |
| Anh chị em | `l.sibList` | `uid110` | `life138.trait` | `close` (độ thân), `life138.trust` |
| Bạn bè, bạn thân | `l.friends`, `l.bff` (life74) | `uid110`; bạn thân thành người yêu nối **theo tên** | `life138.trait` | `close`, `life138.trust` |
| Bạn cùng lớp, thầy cô, đồng nghiệp | `flags.life138.people` | khóa `class:…`, `teacher:…`, `colleague:…` | `life138.trait` | `life138.trust` |
| Người đã mất | `flags.deadPartners` (life89) | **theo tên** | — | — |

## 2. Xung đột đã xác định và cách xử lý

| Xung đột | Hậu quả trước GĐ2 | Sau GĐ2 |
|---|---|---|
| Tính cách bố/mẹ ở hồ sơ life138 khác life90 | 300/300 đời mẫu: hồ sơ ghi một tính cách, bảng gia đình và sự kiện dùng tính cách khác. Chi phí học thêm do bố mẹ quyết theo nhãn life138. | Mọi nơi đọc `fam.mTrait/fTrait`. Quyết định chi tiêu theo tính cách thật (`cởi mở` 0,9 · `nghiêm khắc` 0,55 · `tằn tiện`/`tiết kiệm` 0,4 · còn lại 0,75). |
| Tin cậy của con ở hai kho | 61/89 trường hợp lệch ≥ 5 điểm. "Lắng nghe" ở family100 không tác động lên `persona141.trust` mà life141 đọc. | `persona141.trust` là nguồn chuẩn. family100, life109, life113 đọc/ghi qua `E.NPC.relView`. `tension` (family100), `attach`/`fear` (life141), `close` vẫn là các chỉ số riêng. |
| Tin cậy trong hồ sơ life138 của bố mẹ, bạn đời, con | "Trò chuyện / làm hòa" chỉ đổi bản sao, không module nào khác thấy. life139 chọn người kế nghiệp theo bản sao này. | Ghi đúng một lần vào nguồn chuẩn (family100 hoặc persona141). life139 đọc nguồn chuẩn. |
| Tính cách bạn đời ở ba nơi | Hồ sơ và kiểu phản ứng family100 không khớp `traits130`. | Hồ sơ hiển thị `traits130`. Kiểu phản ứng family100 suy từ tính cách đầu: nhạy cảm, ghen tuông → `anxious`; gia trưởng, tiết kiệm → `independent`; nóng tính, hoạt bát, hài hước → `direct`; hướng nội → `private`. |
| Tính cách con ở ba nơi | Nhãn life126 và life138 có thể trái với `persona141`. | Nhãn `future126` chỉ dùng khi không mâu thuẫn với `persona141`, nếu mâu thuẫn thì suy từ `persona141`. life126 (định hướng tương lai, xác suất con đồng ý) và hồ sơ life138 dùng cùng nhãn. |
| Bố mẹ trong vụ việc gia đình khóa theo tên | Đổi tên thì vụ việc mất người liên quan. | `'parent:m'`/`'parent:f'`. Mã cũ `'parent:m:<tên>'` vẫn nhận ra. |
| Người cũ khóa theo tên | Hai người cũ trùng tên bị gộp làm một. Quay lại với người cũ tạo người mới, mất lịch sử quan hệ (tin cậy/căng thẳng về mặc định). | Hồ sơ người cũ có `uid` và `ident` (tính cách, family100). Quay lại thì khôi phục đúng danh tính và quan hệ. |
| Tin qua đời lan theo tên | Một người bạn, người yêu mới **trùng tên** với người đã mất có thể bị đánh dấu đã mất. | So theo danh tính (kể cả bí danh). Bản ghi cũ không có uid chỉ khớp tên với người đã quen trước lúc mất. |
| Bạn thân thành người yêu nối theo tên | Đổi tên một bên là đứt liên kết. Hồ sơ life138 có hai mục cho cùng một người. | Người yêu mới dùng chung uid với bạn thân. Bản lưu cũ: giữ cả hai uid, nối bằng bí danh `flags.npcAlias142`, hồ sơ trùng được ẩn chứ không xóa. |
| life138 bịa chuyện đời cho người do module khác quản lý | 12 hồ sơ con có "lập gia đình" giả (300 đời mẫu). | Không sinh chuyện cho con, bạn đời, anh chị em, bạn bè. Vẫn rút số ngẫu nhiên như cũ để không làm lệch diễn biến khác. |

## 3. Nguồn có thẩm quyền

| Người | Định danh | Tính cách | Tin cậy | Chỉ số khác (giữ riêng) |
|---|---|---|---|---|
| Bố, mẹ | `parent:m` / `parent:f` | `fam.mTrait/fTrait` | `family100.trust` | `family100.tension` |
| Bạn đời | `uid110` (+ bí danh) | `traits130` | `family100.trust` | `family100.tension`, `close` |
| Người cũ | `exList[].uid` | `exList[].ident.traits130` | `exList[].ident.family100` | — |
| Con | `uid110` (mã cũ: `parentId`, `child:<uid>`, `family100.uid`) | `persona141.traits` | `persona141.trust` | `family100.tension`, `close`, `persona141.attach/fear` |
| Anh chị em, bạn bè | `uid110` | `life138.trait` | `life138.trust` | `close` (độ thân) |
| Người quen khác | khóa life138 | `life138.trait` | `life138.trust` | — |

`E.NPC.find(l, ref)` nhận mọi dạng mã ở trên và không bao giờ tạo người mới. Người đã mất được trả về với `alive: false`; `adjustTrust` trên người đã mất không có tác dụng.

## 4. Bản lưu (cấu trúc v2)

Bước nâng cấp `to: 2` (đăng ký qua `E.registerSchemaStep`) chạy **một lần** với bản lưu cũ:

- **Con**: `persona141.trust += (family100.trust − 60) + (life138.trust − 55)`, tức là cộng các thay đổi từng chỉ ghi vào bản sao. Kết quả được kẹp 0–100.
- **Bạn đời, bố mẹ**: `family100.trust += life138.trust − 55`. Nếu chưa có family100 mà có thay đổi thì tạo bản ghi mặc định 60 rồi cộng.
- Trường cũ được giữ nguyên trong bản lưu (đánh dấu `merged142`), không xóa, chỉ không còn được đọc.
- Gán `uid110` còn thiếu và nối bí danh bạn thân ↔ người yêu. Không đổi uid nào đã có.

Dữ liệu mới chỉ thêm vài trường nhỏ: `uid` / `ident` trong `exList`, `flags.npcAlias142`, `flags.partnerIdent142` (tối đa 4 bản chụp danh tính người yêu, dùng khi chia tay).
