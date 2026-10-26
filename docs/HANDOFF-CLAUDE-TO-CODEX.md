# Bàn giao: Claude → Codex (Một Đời v8.5.0, GĐ0–GĐ2.5)

Tài liệu này giúp người tiếp quản làm tiếp ngay mà không phải đọc lại toàn bộ lịch sử. Mọi quy tắc phát triển nằm trong `CLAUDE.md` (gốc repo) và vẫn có hiệu lực.

## 1. Trạng thái Git

| Mốc | Nhánh / tag | Nội dung |
|---|---|---|
| Mã gốc | `main` = `3fea0d5`, tag `pre-gd0` | Chưa bị sửa |
| GĐ0 | nhánh `gd0-test-foundation` (`becb6eb`), tag `pre-gd1` | Nền tảng kiểm thử |
| GĐ1 | nhánh `gd1-save-safety` (`62e66ea`), tag `pre-gd2` | An toàn bản lưu |
| GĐ2 | nhánh `gd2-npc-identity` (`56717c6`, `3135b08`), tag `pre-gd2-5` | Danh tính, tính cách, quan hệ NPC |
| GĐ2.5 | nhánh **`gd2-5-regression-fixes`** (`e353976` → `31e30ab` → `a64130d` → `a0721a5` → commit bàn giao) | Sửa lỗi regression tồn đọng (chưa nghiệm thu hoàn toàn, xem mục 5) |

- Các nhánh nối tiếp nhau theo thứ tự trên. **Chưa push, chưa deploy, chưa merge vào `main`.**
- Muốn khôi phục về trước một giai đoạn: `git switch` sang tag `pre-…` tương ứng.
- Các file chưa commit **của chủ dự án**, không được đụng tới: `audit-world-520.json`, `Claude.md`, `.local-state-review.txt`.
- **Xuống dòng:** `public/index.html` và nhiều file `.js` trong cây làm việc dùng CRLF. Khi sửa bằng script phải giữ nguyên CRLF; `sed -i` đã từng biến toàn bộ index.html thành LF.

## 2. Kiến trúc cần biết

- Trò chơi là JS thuần. `public/index.html` nạp các script theo thứ tự; `tools/build.js` gộp và nén chúng (esbuild) vào `dist/`. Triển khai lên Cloudflare (Workers/Pages) qua `wrangler.toml` và `public/_worker.js`.
- **Lõi** `public/js/engine.js`: vòng năm `beginYear → resolve → finishYear → endYear`; các registry `DEC` (1.298), `TRIG`, `ACT`, `EVENTS`, `HOOKS.year`.
- **Module mở rộng** `lifeNN.js`: bọc (wrap) các hàm lõi theo chuỗi. Module mới phải chèn vào index.html **trước `scene.js`** (ranh giới engine/UI của bản build).
- `E.runHeadless` gọi `resolve` **nội bộ** của engine, **bỏ qua** mọi wrapper gắn vào `E.resolve`. Logic nào bắt buộc phải chạy ở mọi đường thì đặt vào hook năm, không chỉ trong wrapper `E.resolve` (xem lỗi 9a trong `docs/REGRESSION-FIXES-GD2.5.md`).
- `life.id = Date.now() + Math.random()`, và life126/130/138/141 lấy `l.id` làm hạt giống, nên **cùng seed vẫn cho ra cuộc đời khác nhau** khi dùng giờ thật. Các test nhanh dùng đồng hồ cố định (`tests/lib/quick.js`, có `G.testClock.reset()`). Bộ regression gốc dùng giờ thật nên một số kiểm tra thống kê có thể dao động.

## 3. Những gì đã làm

| GĐ | Kết quả chính | Tài liệu |
|---|---|---|
| 0 | Smoke test có timeout theo từng ca; 60 bản lưu dựng từ 10 phiên bản cũ (`tests/fixtures/saves`, công cụ `tools/make-save-fixtures.js`); baseline gameplay (`tools/baseline.js`) | `docs/TESTING-GD0.md` |
| 1 | Schema bản lưu `life.sv` có các bước nâng cấp tuần tự (`E.registerSchemaStep`); `public/js/save-store.js` (lưu an toàn, giữ lại bản hỏng, kiểm kích thước đồng bộ đám mây theo byte UTF-8); cảnh báo trong UI | `docs/SAVE-FORMAT.md` |
| 2 | `public/js/life142.js` (`E.NPC`): một danh tính, một nguồn tính cách, một nguồn tin cậy cho mỗi NPC; schema v2 gộp tin cậy đúng một lần; người cũ và tin qua đời theo danh tính | `docs/NPC-IDENTITY-GD2.md` |
| 2.5 | Sửa nguyên nhân gốc của toàn bộ lỗi regression tồn đọng | `docs/REGRESSION-FIXES-GD2.5.md` |

## 4. Lệnh kiểm thử

```bash
npm run test:quick
```

Lệnh trên chạy smoke + 60 bản lưu cũ + an toàn bản lưu + NPC, mất khoảng 45 giây. Test tái hiện của GĐ2.5 chạy riêng:

```bash
node tests/regression-fixes.js
```

Bộ regression đầy đủ chạy 1–2 giờ một tiến trình. Nên chia nhóm (xem `docs/TESTING-GD0.md`):

```bash
node tests/regression-shard.js 0-8
```

```bash
MOTDOI_DEC_IDS=<danh sách id> node tests/regression-shard.js 9
```

Build và kiểm tra bản triển khai:

```bash
npm run test:loading
```

```bash
npm run test:admin-events
```

## 5. Kết quả kiểm thử khi bàn giao

Chi tiết đầy đủ ở `docs/REGRESSION-FIXES-GD2.5.md`, mục E.

| Kiểm thử | Mã cuối `a0721a5` (hoặc commit nghiệm thu ngay sau) |
|---|---|
| Kiểm cú pháp toàn bộ `public/js`, `tests`, `tools` | Đạt |
| `npm run test:quick` (smoke 11 · bản lưu cũ 10 · an toàn bản lưu 10 · NPC 14) | Đạt hết |
| `node tests/regression-fixes.js` (8 ca tái hiện GĐ2.5) | Đạt hết |
| Build production (`npm run test:loading`) | Đạt, 28 file, `dist.zip` không đổi |
| Regression mục 9, nửa đầu | Đạt, 0 lỗi |
| Regression mục 9, nửa sau | **Chưa hoàn tất** (bị dừng). Trên `a64130d`: 0 lỗi |
| Regression 76 mục còn lại | **Chưa hoàn tất** (bị dừng ở mục 16). Trên `a64130d`: 1 lỗi (mục 68), đã sửa ở `a0721a5` nhưng chưa chạy lại toàn bộ |

**Ban đầu 197 lần thất bại ở mục 9.** Lần chạy đầy đủ gần nhất (`a64130d`) còn **0**. 16 nguyên nhân gốc đã được sửa (10 engine/dữ liệu, 6 bài kiểm thử).

### Việc Codex cần làm TRƯỚC GĐ3

1. Chạy lại bộ hồi quy đầy đủ trên mã cuối, chia nhóm: `regression-shard.js` cho 76 mục (trừ 9), và mục 9 chia hai nửa bằng `MOTDOI_DEC_IDS`. Mục tiêu: 0 lỗi. Nếu mục 68 hoặc các kiểm tra thống kê (5b, 22, 38, 42, 60) còn lỗi, tái hiện bằng giờ thật nhiều lần trước khi kết luận.
2. Chạy lại `tools/baseline.js --lives 400` và đo hiệu năng sau hai commit cuối, so với `pre-gd2-5`.
3. Xin chủ dự án quyết định về `di_chuc70` trong trại lừa đảo (mục 6.4).
4. Cân nhắc làm `life.id` tái lập được theo seed (mục 6.1). Đây là thay đổi rộng, cần schema step và test riêng.
5. Chủ dự án tự quyết định merge các nhánh `gd0…gd2-5` vào `main`, push và deploy. Claude không làm các bước này.

## 6. Lỗi và rủi ro còn tồn tại

1. **Cùng seed không tái lập được với giờ thật** (`life.id` ngẫu nhiên). Ảnh hưởng: các test thống kê của regression có thể dao động. Chưa sửa, vì đổi cách sinh id sẽ ảnh hưởng mọi module dùng `l.id` làm hạt giống.
2. **Tỷ lệ có con khi AI tự chơi thấp** (~26% số đời sống tới 50 tuổi có con, so với ~80% trước commit 19cbdfd của life108). Mỗi lần chọn "có con" chỉ là một lần thử ≤ 35%; việc cố có con không được duy trì qua các năm. Đây là việc của GĐ3 (sự kiện nhiều giai đoạn).
3. `E.runHeadless` bỏ qua wrapper `E.resolve`, nên mô phỏng nền (regression, "người sinh cùng giây") không chạy qua các wrapper của life100/109/128/142. Chưa đổi, vì sẽ thay đổi hành vi mọi mô phỏng nền.
4. `di_chuc70` (viết di chúc) được dùng khi bị giam / tại ngũ / ở trại lừa đảo từ 18 tuổi. Theo khai báo trong code, đây là thiết kế có chủ đích; test đã được cho phép đúng ngoại lệ này. **Cần chủ dự án xác nhận** có muốn chặn di chúc ở trại lừa đảo hay không.
5. Chưa kiểm chứng với **bản lưu thật của người chơi** (kho mã không có). Chưa chạy các test trình duyệt dùng playwright (chưa cài).
6. Bộ regression **không có** cách chạy đầy đủ nhanh. Mục 5 giữ khoảng 3.300 đời trong RAM (~3 GB); mục 9 thử khoảng 360.000 lượt chọn.

## 7. Kế hoạch GĐ3–GĐ6 (chưa bắt đầu)

Tất cả phải tuân thủ `CLAUDE.md`: mở rộng hệ thống có sẵn, giữ tương thích bản lưu (dùng `E.registerSchemaStep` nếu đổi cấu trúc), có test tái hiện, không để mô phỏng chậm đi đáng kể.

- **GĐ3 — Xác suất theo bối cảnh.** Thêm trường `tags` tùy chọn cho TRIG; `beginYear` nhân xác suất với hệ số kẹp trong [0,5; 2], tính từ tuổi, nghề, tầng tài chính (`tier()` của life141), sức khỏe, `l.tr`, quan hệ (`E.NPC.relation`), lịch sử. Gắn tag trước cho khoảng 50 trigger xuất hiện nhiều nhất (xem `tests/fixtures/baseline.json`), rồi hiệu chỉnh bằng `tools/baseline.js`.
- **GĐ4 — Hậu quả nhiều giai đoạn.** Mở rộng `E.TRAPS` (jobs2.js) thành chuỗi có `stage`/`ref`/`data` (dạng cũ vẫn đọc được); dùng `H.sched` cho bước tiếp theo. Ưu tiên: hối lộ (jobs2), nợ (life140), vụ việc gia đình (life113), **mong muốn có con (life108)**, và thi cử / tuyển sinh. Mẫu đã làm ở GĐ2.5: life125 mở lại lựa chọn và xét lại năm sau.
- **GĐ5 — Ngân sách sự kiện và cân bằng tông.** Các sự kiện xếp hàng trong `finishYear` (`WORLD120.queue`, family100, moment141…) hiện bỏ qua giới hạn và cooldown của `beginYear`. Cần một hạn mức chung; sự kiện vượt hạn mức thì dời sang năm sau, không bỏ. Thêm giới hạn trọn đời cho weather125/law122/crisis123. Theo dõi tỷ lệ tốt/xấu/trung tính bằng baseline.
- **GĐ6 — Phát hành.** Chạy regression đầy đủ (chia nhóm), build, thử `wrangler pages dev`, cập nhật CHANGELOG và tăng phiên bản (regression bắt buộc có mục CHANGELOG và `?v=` trong index.html), rồi chủ dự án tự quyết định deploy.
