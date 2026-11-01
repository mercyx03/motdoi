# Nâng cấp 8.10.12 (mã 912) — theo dõi tiến độ theo PROMPT_CLAUDE_CODE_UPDATE_MOT_DOI.md

**Trạng thái: ĐANG TRIỂN KHAI — chưa nghiệm thu toàn diện, chưa phát hành.** Không deploy Production.

## Nền tảng đã ghi nhận
- Nhánh `codex/life-context-upgrade`, HEAD gốc `30152fc` (8.10.11 gameshow-crime). Working tree ban đầu: `.local-state-review.txt`, `Claude.md`, `PROMPT_CLAUDE_CODE_UPDATE_MOT_DOI.md` chưa theo dõi — giữ nguyên, không stage.
- Runtime: Node v24.20.0, Windows 10, Chrome headless qua `tests/lib/cdp.js`. Máy đo: Intel i5-10200H 8 luồng, 16 GB.
- Kiến trúc: JS chia module, thứ tự nạp theo `public/index.html`; build `tools/build.js` (esbuild). Module mới nạp sau `blood-donation.js`, trước ranh giới UI `scene.js`.

## Bảng yêu cầu → module → save → UI → test → trạng thái

| Mục | Yêu cầu | Module/hàm cuối cùng | Dữ liệu save | UI | Test | Trạng thái |
|---|---|---|---|---|---|---|
| §3 | Chọn khối THPT không bị bỏ lỡ, không âm thầm A00 | `khoi-track.js` (`E.KHOI912.due`, bọc `DEC.chon_khoi`, trigger cũ, `HOOKS.gradUpper[0]`), điểm gọi trong `engine.js beginYear` | `l.khoi` (giữ nguyên), `l.flags.khoi912 {v,src,at,changes,hist}` | Tình huống chọn khối có môn thi; mục Học tập "Chọn khối thi THPT / Xem – đổi khối thi"; `app.js` gắn `byHand912` khi người chơi bấm | `tests/khoi912.js` (269), `tests/ui912-browser.js`, `update840`, `exam127` | **Đã sửa, đã kiểm chứng** |
| §5 | Lag, khung hồ sơ trống, click trễ | `life109.js` wrapper `E.actions` (bỏ deep-clone theo từng hành động); `css/style.css` `.modal.profile` | không đổi | Bảng hành động, hồ sơ chi tiết | `tests/perf912.js` (20), `tests/ui912-browser.js` | **Đã sửa 2 nguyên nhân gốc, đã kiểm chứng**; các màn khác chưa đo hết (xem dưới) |
| §4 | Tài sản: lọc, phân trang, nhóm USD, di chúc | `asset-picker.js` (`E.ASSET912`): menu `sell912`/`sell912_ok` (thay luồng bán của `quan_ly_dau_tu` khi người chơi bấm), thay `will150_asset` (life150) và `giftAsset112` (life112); ô tìm kiếm trong `app.js` | không thêm trường bắt buộc; dùng `uid110` sẵn có, `flags.will150.specific`, `flags.family129.trades`; trạng thái lọc nằm trong `pending[0].data.arg` | Bán / tặng con / di chúc: nhóm USD, loại, trạng thái, tìm, sắp xếp, 20 mục/trang | `tests/assets912.js` (192), `tests/assets912-browser.js`, `feedback-e`, `estate840`, `expansion842`, `family129`, `browser-feedback-menus e` | **Đã làm, đã kiểm chứng** (cho thuê: hệ hiện tại tự cho thuê mọi BĐS đầu tư, chưa có menu chọn căn để cho thuê/ngừng thuê) |
| §6 | Tìm người yêu 10 lượt/năm, tách gặp/đồng ý | `romance912.js` (`E.ROMANCE912`): bọc `E.resolve` (đếm lượt, gắn cờ `search912` cho chuỗi quyết định từ lượt tìm), `DEC.love.apply` (quyền từ chối), `tim_nguoi_yeu`/`dating108`/`network108` (điều kiện trong handler); `engine.js prune` cho phép quyết định từ lượt tìm tới 85 tuổi | `flags.romance912 {v,at,used,streak,hist}` | Hiển thị đã dùng/còn lại trong bộ lọc, Tìm một nửa, danh sách mập mờ; gợi ý nới bộ lọc khi quá hẹp | `tests/romance912.js` (114), `browser-dating-app`, `relationships108/841`, `family129/130` | **Đã làm, đã kiểm chứng** |
| §7 | Mở rộng quan hệ người nổi tiếng | đã có: `life148` contacts thượng lưu | — | — | — | Chưa làm |
| §8 | Kết thúc và làm mới danh sách mập mờ | `romance912.js`: lựa chọn `reset912` + xác nhận `network912_reset`; bọc `network108_person` (kết thúc không cần lượt gặp); làm quen người mới dùng chung lượt tìm, có thể gặp lại người cũ | `flags.network912 {v,ended[],resetAt}`; người cũ giữ `relation108` | Danh sách mập mờ | `tests/romance912.js` | **Đã làm, đã kiểm chứng** |
| §9 | Chủ động chu cấp | đã có: chu cấp trong `life129/130` | — | — | — | Chưa làm |
| §10 | Gói cố vấn 5 triệu USD +50/chuyên môn | đã có: `life170 heir5m`, `HEIR_FIELDS` | — | — | `leadership-education169-170.js` | Chưa làm |
| §11 | Y tế, di truyền, thai kỳ, phát triển trẻ | đã có: `health-aging.js`, `blood-donation.js`, `family-origins.js`, `family.js` | — | — | `blood910`, `health-tax909` | Chưa làm (cần tra nguồn y tế) |
| §12 | Phi pháp, băng nhóm, nhà tù | đã có: `crime-depth.js` (CRIME911), `life176`, `H.jail`, `E.jailYear` | — | — | `crime911.js` | Chưa làm |
| §13 | Làm sâu quốc gia | đã có: `data-country-depth.js`, `life173`, `tools/audit-country-depth.js` | — | — | bộ test quốc gia | Chưa làm |
| §14 | Rà soát liên hệ thống | — | — | — | — | Backlog đang ghi nhận |

## §3 — Lỗi chọn khối THPT: tái hiện và nguyên nhân đã xác nhận
- Tái hiện: mô phỏng 300 đời Việt Nam (seed 5001–5300, AI tự chọn). 198 người thi tốt nghiệp THPT, **28 người (14%) không bao giờ thấy tình huống chọn khối** và bị gán khối lúc tốt nghiệp.
- Phân loại 28/28 ca: năm 16 tuổi hàng đợi đã đủ 3 quyết định (`difficulty.cap`), trigger `chon_khoi` xáo trộn ngẫu nhiên cùng các trigger khác và chỉ đúng `a === 16`, nên không còn cơ hội nào khác. Hook `gradUpper` (expansion.js) sau đó gán `KHOI_TALENT[talent] || (r()<.5 ? 'A00' : 'D01')` không có nhật ký.
- Nguyên nhân phụ (đọc mã): đời thứ hai trở đi trigger bị nhân 0,4 vì `prevSeen`; học viên bổ túc THPT (`flags.gdtx.lvl===3`) không bao giờ được hỏi; học sinh vào THPT muộn bị hỏi từ lớp 10.
- Sửa: hỏi bắt buộc theo giai đoạn học (từ lớp 11 tới hết năm thi, theo `schoolEnd`/`gdtx.until`), trước trigger ngẫu nhiên, chỉ một quyết định chờ; chỉ ở Việt Nam. Sau sửa: 199/199 người thi tốt nghiệp đều được hỏi (cùng 300 seed).
- Nguồn lựa chọn: `manual` (bấm tay), `auto` (chế độ tự động/AI), `legacy` (save cũ đã có khối — giữ nguyên, vẫn cho đổi nếu còn học), `school` (tới kỳ thi vẫn chưa có khối: chỉ save cũ/đời do máy; có nhật ký). Giữ phép thử RNG cũ ở nhánh `school`.
- Đổi khối: tối đa 2 lần; năm thi đổi thì kiến thức −3 và căng thẳng +8; trước năm thi căng thẳng +2. Hủy không tốn lượt. Sau khi có điểm thi/bằng THPT thì khóa, không sửa lịch sử điểm.
- Nước khác: không hỏi, không gán khối (không có A00 ngoài Việt Nam).

## §5 — Lag / khung hồ sơ: số đo và nguyên nhân đã xác nhận
1. **Click trễ, khựng mỗi năm**: `E.actions` (gọi mỗi lần vẽ bảng hành động, mỗi năm và mỗi lần bấm nhóm) do `life109.js` sao chép toàn bộ đời bằng JSON một lần cho **mỗi** hành động khả dụng (~150 lần/lượt). Sửa: một bản để liệt kê + một bản kiểm tra dùng chung (sao lại nếu trường cốt lõi bị đổi). So sánh 231 ảnh chụp trạng thái trên 25 đời VN/US: kết quả giống hệt bản cũ.
   - Node 24, cùng dữ liệu, trung vị 7 lần: đời 45 tuổi (≈150 KB) **740,6 → 15,6 ms**; 35 tuổi (≈112 KB) 511,3 → 18,1 ms; 16 tuổi (≈50 KB) 132,5 → 6,6 ms.
   - Chrome (pane nội bộ, save 45 tuổi): bấm nhóm "Tiền bạc & tài sản" 279 → 8 ms; Chrome headless test: 6–15 ms ở 390 px và 1280 px.
2. **Khung hồ sơ trống/không đọc được**: modal hồ sơ dùng lớp `profile` trùng với thẻ "Hồ sơ xuất phát" trang chủ (`.profile { background: 85% surface }`) → nền trong suốt, nội dung khung dưới đè lên bảng game; viên "Đang chờ bạn chọn" (z-index 60) che nút "Đóng hồ sơ" trên điện thoại. Sửa: `.modal.profile` nền đặc, ẩn viên khi mở hồ sơ (theo tiền lệ `.modal.family-profile`).
- Đã kiểm tra: không có lỗi console/promise khi mở hồ sơ, thẻ vợ/chồng/con, bấm nhanh mở/đóng 10 lần. Mở hồ sơ ~10–80 ms.
- Chưa đo: save nhiều đời/nhiều NPC thật của người chơi; listener/bộ nhớ dài hạn; thiết bị di động thật.

## §4 — Tài sản: lỗi đã xác nhận và cách sửa
- **Bán chỉ được món đầu tiên**: tình huống `quan_ly_dau_tu` (wealth.js) có đúng hai lựa chọn "Bán `props[0]`" và "Sang nhượng `ventures[0]`" — không chọn được căn khác. Nay hành động mở `sell912`: chọn đúng tài sản theo ID → màn xác nhận (giá, lãi/lỗ so với giá vốn, mất tiền thuê, điều khoản di chúc bị ảnh hưởng) → bán. Vẫn tính hạn mức 4 giao dịch/năm của `life129`. AI và tình huống cũ giữ nguyên.
- **Di chúc chỉ hiện 30 tài sản đầu** (`assets(l).slice(0,30)`, thứ tự chèn, không phải theo giá) và **mọi menu UPDATE110 cắt 54 dòng** → tài sản thứ 31+/55+ không thể giao/tặng. Nay phân trang 20 mục; menu tối đa ~40 dòng.
- Nhóm giá trị USD: [0;1), [1;6), [6;16), [16;31), [31;51), [51;101), [101;251), [251;501), [501;1001) triệu, ≥1001 triệu. Quy đổi: VN = triệu đồng × 10⁶ / `CUR.VND` (25.400); nước khác = USD sức mua × `CUR.priceLevel(gdp)` — cùng công thức hiển thị của `currency.js`, không thêm tỷ giá cứng. Tỷ giá chốt khi mở danh sách và đi theo mọi bước lọc.
- Quy tắc ghi rõ: tài sản đã chỉ định trong di chúc mà bán/tặng khi còn sống → điều khoản hết hiệu lực (có nhật ký); người nhận mất trước → món đó chia theo tỷ lệ chung (cơ chế `allocateCompanies` sẵn có); viết di chúc không chuyển tài sản khi còn sống.
- Tặng con: giữ nguyên quy tắc life112 (con đồng ý nhận theo độ thân, phí 1%, quỹ dự phòng 30% thu nhập cơ bản, nhà đang thế chấp không tặng được).
- Chưa làm: chọn căn để cho thuê/ngừng cho thuê riêng lẻ (hệ hiện tại không có khái niệm này); tài sản đồng sở hữu với vợ/chồng ở bước bán (chia khi ly hôn đã có trong life150).

## §6 / §8 — Tình cảm: lỗi đã xác nhận, cân bằng trước/sau
- Đã xác nhận bằng đọc mã + test: hành động "Tìm người yêu" chỉ 1 lần/năm (khóa `actAt` chung); `life43.js` đặt `max = 55` và engine bỏ mọi quyết định `love` khi tuổi > `E.LOVE_MAX` (55) dù lời thoại cho người 60+ đã có sẵn; bấm "Tìm hiểu nhau" là thành người yêu ngay (người kia không có quyền từ chối); kết thúc một người trong danh sách mập mờ bị chặn khi hết lượt gặp; làm quen người mới trong danh sách không giới hạn.
- Sửa: 10 lượt tìm/năm (một bộ đếm cho Tìm người yêu, bộ lọc hẹn hò, làm quen trong danh sách mập mờ); đổi bộ lọc không tốn lượt; lượt 11 bị chặn trong handler, không chỉ ẩn nút. Chuyện tình tự đến vẫn giữ mốc 55 tuổi như cũ (không đổi RNG của đời thường); người chủ động đi tìm được tới 85 tuổi.
- Mức đồng ý (tham số gameplay): 0,5 cơ sở; −0,025 mỗi năm chênh tuổi vượt 6; ngoại hình ±0,2; thu nhập −0,05…+0,1; giao tiếp ±0,17; tâm trạng ±0,08; mỗi mối tình cũ −0,02 (tối đa −0,12); nghiệp xấu −0,08; nghiện −0,1; mỗi lần bị từ chối liên tiếp +0,08 (tối đa +0,24); kẹp 0,15–0,88. Không có hệ số theo tôn giáo, dân tộc, giàu/nghèo cố định. Chỉ áp cho người gặp qua lượt tìm; chuyện đời khác giữ cơ chế cũ; quyết định cũ trong bản lưu (không có cờ) chạy như trước.
- Mô phỏng 300 seed/nhóm, cách tìm "nhờ mai mối":

| Nhóm | Gặp được người/lượt | Đồng ý khi gặp (sau) | Có người yêu trong 1 năm — trước (1 lượt, đồng ý 100%) | Sau (≤10 lượt, có thể từ chối) |
|---|---|---|---|---|
| 22 tuổi · giao tiếp 50 · thu nhập thấp | 66% | 51% | 66% | 98% |
| 22 tuổi · giao tiếp 80 · thu nhập cao | 66% | 70% | 66% | 100% |
| 35 tuổi · giao tiếp 50 | 66% | 55% | 66% | 99% |
| 35 tuổi · giao tiếp 20 | 66% | 46% | 66% | 97% |
| 50 tuổi · giao tiếp 50 · thu nhập cao | 66% | 64% | 66% | 99% |
| 62 tuổi · giao tiếp 50 | 66% | 54% | **0%** (bị khóa) | 97% |

  Mỗi lần gặp không bảo đảm đồng ý; dùng đủ 10 lượt thì gần như ai cũng có tiến triển trong năm — chủ dự án có thể giảm `BAL.searchMax` hoặc `streakStep` trong `romance912.js` nếu thấy quá dễ.
- Làm mới danh sách mập mờ: xác nhận ghi số người bị kết thúc và tên; giữ gia đình bí mật (phải kết thúc riêng); con chung, thai kỳ, nghĩa vụ nuôi con không bị đụng tới; người đã kết thúc lưu trong `flags.network912.ended` (tối đa 30), có 15% cơ hội gặp lại khi làm quen sau ≥2 năm (cùng danh tính, tuổi tăng đúng số năm); làm mới tối đa 1 lần/năm.
- Lỗi có sẵn (không do đợt này): `tests/life138.js` hỏng ở assertion "sibling can succeed instead of player" ngay trên HEAD gốc `30152fc`.

## Backlog phát hiện khi rà soát (chưa sửa, chưa tái hiện đầy đủ)
- Save tự chơi seed 777001: "Em gái: Trần Đức Mạnh · 41 tuổi · đang đi học" — anh chị em có tên nam nhưng ghi em gái và 41 tuổi vẫn "đang đi học". Cần truy vết `sibList`.

## Lệnh kiểm thử đã chạy (đợt 3 — tình cảm)
| Lệnh | Exit | Kết quả |
|---|---|---|
| `node tests/romance912.js` | 0 | 114 checks |
| `node tests/browser-dating-app.js` | 0 | 12 lượt, VN + quốc tế, 390 + 1280 |
| `relationships108, relationships841, family104, family129, family130, looks134, children141, social-personal131, actions894, actions-cap895, feedback-e, expansion842` | 0 | PASS |
| `node tests/life138.js` | 1 | Hỏng sẵn trên HEAD gốc 30152fc (đã kiểm bằng worktree riêng) |
| `smoke, saves-compat, save-safety, npc-identity, khoi912, assets912, perf912` | 0 | PASS |

## Lệnh kiểm thử đã chạy (đợt 2 — tài sản)
| Lệnh | Exit | Kết quả |
|---|---|---|
| `node tests/assets912.js` | 0 | 192 checks |
| `node tests/assets912-browser.js` | 0 | Chrome 390 + 1280 PASS |
| `feedback-e, estate840, expansion842, family129` | 0 | PASS (family129: thêm bước xác nhận bán vào thao tác, giữ nguyên kỳ vọng 4 giao dịch và siết thêm: hết lượt thì không mở được) |
| `node tests/browser-feedback-menus.js e` | 0 | 8 chuỗi menu, 390 + 1280 |
| `smoke, saves-compat, save-safety, npc-identity, khoi912, perf912` | 0 | PASS (cảnh báo cũ như đợt 1) |

## Lệnh kiểm thử đã chạy (đợt 1)
| Lệnh | Exit | Kết quả |
|---|---|---|
| `node tests/khoi912.js` | 0 | 269 checks |
| `node tests/perf912.js` | 0 | 20 checks |
| `node tests/ui912-browser.js` | 0 | Chrome 390 + 1280 PASS |
| `node tests/smoke.js` | 0 | 11 đạt, 1 cảnh báo cũ (life.id theo giờ thật) |
| `node tests/saves-compat.js` | 0 | 10 đạt, 7 cảnh báo cũ (hc_story đã bỏ) |
| `node tests/save-safety.js` | 0 | 10 đạt |
| `node tests/npc-identity.js` | 0 | 14 đạt |
| `exam127, university136, adult106, world120, update840, career109, actions894, actions-cap895, relationships108, relationships841, family129, continuity101, pace-gd5, chains-gd4, context-weighting` | 0 | PASS (context-weighting cho kết quả giống hệt HEAD gốc) |
