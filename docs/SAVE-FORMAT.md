# Bản lưu và phiên bản cấu trúc (từ GĐ1)

## Khóa lưu trữ (giữ nguyên từ bản 1.0)

| Khóa | Nội dung |
|---|---|
| `mkn.current` | Cuộc đời đang chơi: `{ life, cohort, speed, auto, at }` |
| `mkn.memorial` | Đài tưởng niệm (tối đa 60 bản tóm tắt) |
| `mkn.lastEnd` | Cuộc đời vừa kết thúc gần nhất (1 bản) |
| `mkn.recent`, `mkn.tree`, `mkn.ach`, `mkn.settings`, … | Như trước |
| `mkn.branch112`, `mkn.childBranch112` | Đời cha/mẹ và đời con khi chuyển góc nhìn |
| `mkn.current.held` (mới) | Tối đa 2 bản `mkn.current` không mở được, cất lại trước khi có thể bị ghi đè |
| `<khóa>.held` (mới) | Tương tự, cho mọi khóa khác bị hỏng JSON |
| `mkn.saveErrors` (mới) | 10 lỗi lưu gần nhất, mỗi dòng dưới 300 ký tự |

## Phiên bản cấu trúc `life.sv`

- `life.sv` là phiên bản **cấu trúc dữ liệu**, khác với phiên bản game `life.v`. Bản lưu chưa có `sv` được coi là `0`. Phiên bản hiện tại là `E.SAVE_SCHEMA = 2`: v1 do GĐ1 đặt; v2 do GĐ2 thêm (hợp nhất danh tính và độ tin cậy NPC, xem `docs/NPC-IDENTITY-GD2.md`).
- `E.checkSave(life)` kiểm tra mà không sửa gì, trả về `{ ok, code, sv, max }`. Các mã lỗi:
  - `INVALID`: thiếu `name`, `age` hoặc `birthYear`.
  - `BAD_SCHEMA`: `sv` không phải số nguyên ≥ 0.
  - `FUTURE_SCHEMA`: `sv` lớn hơn mức game hỗ trợ.
- `E.migrate(life)`:
  1. Gặp bản không hợp lệ hoặc thuộc cấu trúc tương lai thì **ném lỗi có `code` và không sửa đối tượng**.
  2. Chạy lần lượt các bước trong `SCHEMA_STEPS` có `to` lớn hơn `sv` của bản lưu.
  3. Chạy phần chuẩn hóa sẵn có cùng chuỗi `E.migrateExt` của các module, ở mọi lần nạp như trước.
  4. Gán `sv = SAVE_SCHEMA`.
- Chạy `migrate` nhiều lần cho kết quả như một lần, có test `tests/save-safety.js` (ca 2) kiểm cho 60 bản lưu cũ.

### Thêm một bước nâng cấp

1. Tăng `SAVE_SCHEMA`.
2. Thêm `{ to: <số mới>, run: function (l) { … } }` vào cuối `SCHEMA_STEPS` trong `public/js/engine.js`, hoặc từ một module gọi `E.registerSchemaStep({ to, run })` (giống life142). Bước này phải:
   - chỉ đổi dạng dữ liệu, không đổi diễn biến gameplay;
   - không xóa trường chưa nhận diện;
   - chạy lại trên dữ liệu đã nâng cấp mà không đổi gì thêm.
3. Thêm fixture của phiên bản trước (`npm run fixtures:saves`, cộng commit hiện tại vào danh sách) và chạy `npm run test:quick`.

## Lưu trên trình duyệt (`G.SaveStore`, `public/js/save-store.js`)

- **Ghi**:
  - Đóng gói JSON có bắt lỗi (`SERIALIZE`).
  - Chặn bản lớn hơn 4,5 triệu ký tự (`TOO_LARGE`).
  - Phân loại lỗi ghi: `QUOTA` (đầy bộ nhớ), `BLOCKED` (bị chặn), `WRITE` (khác).
  - Đọc lại sau khi ghi để chắc dữ liệu đã nằm trong bộ nhớ (`VERIFY`).
  - Ghi thất bại thì giá trị cũ vẫn còn, vì không bao giờ xóa trước khi ghi.
- **Đọc**:
  - JSON hỏng được cất sang `<khóa>.held`. Game trả về giá trị mặc định nhưng không ghi đè bản hỏng chưa được cất.
- **Mở cuộc đời đang chơi dở** (`inspect`):
  - Kiểm tra cấu trúc, chạy `migrate` trên bản sao.
  - Nếu hỏng, thuộc cấu trúc mới hơn hoặc nâng cấp lỗi, trang chủ báo lý do kèm các nút **Tải bản lưu về máy / Thử lại / Bỏ bản lưu này**. Dữ liệu được giữ nguyên.
  - Bắt đầu đời mới khi còn bản không mở được: game cất bản đó sang `mkn.current.held` trước. Nếu không cất được thì không ghi đè, và báo cho người chơi.
- **Lưu thất bại khi đang chơi**:
  - Thanh cảnh báo hiện lý do, kèm các nút **Thử lưu lại / Tải bản lưu về máy**.
  - "Lưu & về trang chủ" chỉ rời đời khi đã lưu thật.
  - "Quay lại đời cha/mẹ" chỉ chuyển khi đã lưu được đời con.
- **Đồng bộ tài khoản**:
  - Đo cả số ký tự (≤ 1.450.000) và số byte UTF-8 (≤ 1.550.000) trước khi gửi, vì máy chủ giới hạn 1.500.000 ký tự và 1.600.000 byte.
  - Quá lớn thì bỏ cuộc đời đang chơi khỏi gói gửi; vẫn quá thì không gửi.
  - Lỗi đồng bộ tự động được ghi nhận và báo một lần cho mỗi loại lỗi. Trước đây lỗi bị bỏ qua im lặng.

## Chuỗi hậu quả GĐ4 (`flags.chains144`)

Không tăng `SAVE_SCHEMA`. Trường mới chỉ xuất hiện khi nhân vật gặp sự kiện gốc; tối đa 4 chuỗi đang chạy, 12 chuỗi đã khép, mỗi chuỗi giữ 6 bước gần nhất. `E.migrateExt` (life144) bỏ giá trị hỏng, lọc bản ghi thiếu trường và giữ nguyên loại chuỗi chưa biết. Lịch hẹn giai đoạn nằm trong `l.sched` như các tình huống hẹn trước khác. Chi tiết: `docs/CONSEQUENCES-GD4.md`.

## Nhịp sự kiện GĐ5 (`flags.pace145`)

`{ v:1, h:[[tuổi, mức 'd'|'m'|'s', nhóm, dấu vân, id], …], trip }`, tối đa 24 dòng. Không tăng `SAVE_SCHEMA`; `E.migrateExt` (life145) bỏ giá trị hỏng và dòng sai cấu trúc. Chi tiết: `docs/PACE-GD5.md`.
