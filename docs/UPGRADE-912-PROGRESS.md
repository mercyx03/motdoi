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
| §4 | Tài sản: lọc, phân trang, nhóm USD, di chúc | đã có: `life150.js will150_asset` (`assets(l).slice(0,30)`), `life70` di chúc, `currency.js` | — | — | `estate840.js` | Chưa làm |
| §6 | Tìm người yêu 10 lượt/năm, tách gặp/đồng ý | đã có: `life108 dating108`, `life114`, `life129/130` | — | — | `relationships108/841` | Chưa làm |
| §7 | Mở rộng quan hệ người nổi tiếng | đã có: `life148` contacts thượng lưu | — | — | — | Chưa làm |
| §8 | Kết thúc và làm mới danh sách mập mờ | đã có: `life108 network108` (5 người, kết thúc từng người) | — | — | — | Chưa làm |
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

## Backlog phát hiện khi rà soát (chưa sửa, chưa tái hiện đầy đủ)
- Save tự chơi seed 777001: "Em gái: Trần Đức Mạnh · 41 tuổi · đang đi học" — anh chị em có tên nam nhưng ghi em gái và 41 tuổi vẫn "đang đi học". Cần truy vết `sibList`.

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
