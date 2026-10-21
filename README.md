# Một Đời

Trò chơi mô phỏng một đời người trên web, phiên bản tiếng Việt lấy cảm hứng từ [1in8b.life](https://1in8b.life/).
Bạn được sinh ra ngẫu nhiên — ở một tỉnh thành Việt Nam, thuộc một trong 54 dân tộc, hoặc ở bất kỳ đâu trong 195 quốc gia — và sống trọn cuộc đời ấy: từng tuổi một, với những ngã rẽ, cám dỗ, mất mát và hạnh phúc, cho đến khúc cuối đời.

Trang web hoàn toàn tĩnh (HTML/CSS/JS thuần, không cần máy chủ, không thư viện ngoài), dữ liệu người chơi lưu trên trình duyệt. Chia sẻ cuộc đời bằng đường link (dữ liệu nằm ngay trong link, không cần cơ sở dữ liệu).

**Hardcore (v7.7.0):** chọn ở mục **Độ khó** trước khi chào đời. Chiến dịch riêng với 98 tình huống theo tuổi và các chặng tiếp nối, có lựa chọn mới ngay từ năm đầu. Môi trường gia đình, cảm xúc và tổn thương ảnh hưởng lâu dài đến stress, chuyện học và cơ hội sau này. Thu nhập lao động còn 18%, lãi dương còn 12%, thu nhập hưu trí còn 45%; các khoản thưởng ngoài lương có hao hụt riêng. Có hỗ trợ miễn phí, cách phục hồi chậm và một cơ hội bứt phá hiếm khi có chuẩn bị phù hợp. Chế độ được lưu cùng nhân vật và giữ sang đời con. Kho sự kiện Thường được giữ riêng; chạy `node tests/hardcore-isolation.js` để so sánh 12 trạng thái cuộc đời với bản trước thay đổi và `node tests/hardcore-campaign.js` để kiểm tra chiến dịch mới.

## Cấu trúc thư mục

```
public/              ← mã nguồn trang web (chạy được trực tiếp)
dist/                ← bản build gọn để đưa lên Cloudflare (npm run build tạo ra, không lưu trên git)
docs/                ← tài liệu nguồn số liệu (không đưa lên web)
  index.html
  logo.svg           ← logo Một Đời
  _headers           ← header bảo mật & cache cho Cloudflare
  css/style.css
  js/util.js         ← tiện ích, RNG có seed, số phiên bản
  js/data-vn.js      ← 63 tỉnh, 34 tỉnh, 54 dân tộc, tên người Việt
  js/data-world.js   ← 195 quốc gia
  js/names.js        ← ~50 bộ tên theo văn hóa
  js/currency.js     ← tiền tệ bản địa 195 nước, quy đổi ra đồng
  js/engine.js       ← lõi mô phỏng: tạo nhân vật, vòng năm, tài chính, nợ, tử vong, AI
  js/careers.js      ← hơn 130 nghề (nhà nước, freelancer, showbiz theo hạng…), thang bậc, lương tham chiếu, danh tiếng, thi đấu, phạm pháp
  js/scenarios.js    ← hơn 130 tình huống (cả thú cưng), chuỗi sự kiện, hành động chủ động, câu chuyện mỗi năm
  js/expansion.js    ← tài sản (tiết kiệm, vàng, cổ phiếu, đất, hụi, bảo hiểm), tâm lý, đời con cái, khối thi & điểm THPT, sống tiếp đời con
  js/wealth.js       ← xe & nhà theo mức giàu, nhà cho thuê, cửa hàng có chi nhánh / phá sản, anh chị em, chứng chỉ ngoại ngữ, kinh doanh sau nghỉ hưu
  js/jobs.js         ← nghề mới, hướng đi giữa các nghề, sự kiện riêng theo nghề, công an theo ngành, gia đình tài phiệt / ngân hàng / chính trị
  js/music.js        ← nhạc nền lofi tự sinh bằng Web Audio (không dùng file nhạc)
  js/card.js         ← ảnh thẻ cuộc đời 1080×1350 (canvas)
  js/finale.js       ← khúc cuối đời, di nguyện, chia sẻ link, 10 đời gần đây
  js/app.js          ← giao diện & vòng chơi
tests/regression.js  ← bộ kiểm thử hồi quy (~320.000 phép kiểm)
tools/serve.js       ← máy chủ chạy thử trên máy
wrangler.toml        ← cấu hình triển khai Cloudflare Workers
CHANGELOG.md         ← nhật ký phiên bản
```

## Chạy thử trên máy

Cần [Node.js](https://nodejs.org/) (bất kỳ bản nào ≥ 16).

```bash
node tools/serve.js
```

Mở http://localhost:8080

## Kiểm thử hồi quy (bắt buộc trước mỗi lần cập nhật)

```bash
node tests/regression.js
```

Phải in ra `✓ Tất cả bài kiểm thử hồi quy đều đạt.` Bộ test kiểm tra: dữ liệu 63/34 tỉnh, 54 dân tộc, 195 nước & tiền tệ; mọi lựa chọn khi tạo nhân vật; tên theo từng nền văn hóa; hàng nghìn cuộc đời tự động; **mọi tình huống × mọi lựa chọn** trên 17 khuôn nhân vật khác nhau; thang bậc nghề (vd. công an không bao giờ lên hàm sớm); nợ xấu, app đen, trần nợ; chuỗi Campuchia, giao thông, du học; khúc cuối đời; link chia sẻ; dữ liệu lưu từ bản 1.0 vẫn chơi tiếp được; và tất cả lỗi từng gặp.

## Đưa lên Cloudflare

### Cách 1 — Kéo thả trên dash.cloudflare.com (dễ nhất)
1. Vào https://dash.cloudflare.com → **Workers & Pages** → **Create** → tab **Pages** → **Upload assets**.
2. Đặt tên dự án, ví dụ `mot-doi` → **Create project**.
3. Chạy `npm run build` (tạo thư mục `dist`), rồi kéo thả **thư mục `dist`** → **Deploy site**.

Cập nhật bản mới: chạy `npm run build`, vào dự án → **Create deployment** → kéo thả lại thư mục `dist`. (Kéo thả `public` vẫn chạy được, chỉ tải chậm hơn vì phải tải hơn 80 file js riêng lẻ.)
Người chơi cũ không mất dữ liệu: khóa lưu trữ được giữ nguyên và dữ liệu cũ tự nâng cấp.

### Cách 2 — Dòng lệnh (Wrangler)
```bash
npx wrangler login
npm run deploy:pages
```
(`npm run deploy:pages` tự chạy kiểm thử hồi quy trước, lỗi thì dừng.)

### Cách 3 — Kết nối GitHub (tự động triển khai khi đẩy code)
Cloudflare **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → Build command: `node tests/regression.js && node tools/build.js` · Build output directory: `dist`.

## Quy trình cập nhật phiên bản
1. Sửa code / thêm tính năng (giữ nguyên toàn bộ tính năng cũ).
2. Mỗi lỗi sửa → thêm 1 bài test vào `tests/regression.js`.
3. Tăng `G.VERSION` trong `public/js/util.js`, đổi `?v=` trong `public/index.html`, ghi mục mới trong `CHANGELOG.md` (test sẽ báo lỗi nếu quên).
4. Chạy `node tests/regression.js` → đạt 100% mới triển khai.
5. Dữ liệu cũ của người chơi được nâng cấp qua `E.migrate()` trong `engine.js`.

## Tài khoản người chơi
- API `/api/account` trong `public/_worker.js`, dùng chung D1 `REVIEWS_DB` (bảng game_accounts, game_sessions, game_saves tự tạo). Không cần cấu hình thêm.
- Mật khẩu băm PBKDF2-SHA256 100.000 vòng; mã phiên chỉ lưu bản băm. Không thu email. Không ai xem được mật khẩu gốc (kể cả quản trị viên).
- Người chơi quên mật khẩu: `npm run reset:password -- <tên đăng nhập>` tạo mật khẩu tạm và file SQL, rồi chạy `npx wrangler d1 execute motdoi-reviews --remote --file backups/reset-<tên>.sql`. Tiến trình giữ nguyên.

## Sao lưu đánh giá
- `npm run backup:reviews` — tải toàn bộ đánh giá công khai về `backups/reviews-NGÀY.json`.
- `npm run backup:reviews -- --d1` — xuất nguyên database D1 (cần `npx wrangler login` trước) về `backups/reviews-NGÀY.sql`.
- Cloudflare D1 còn có Time Travel: khôi phục database về một thời điểm trong quá khứ ngay trên dashboard.

## Thêm tình huống mới
Trong `public/js/scenarios.js`:
```js
SC('ten_tinh_huong', {
  title: 'Tiêu đề', text: function (l) { return 'Mô tả…'; },
  opts: [
    { k: 'a', l: 'Lựa chọn A', ai: { risk: 1 }, run: function (l, r, log) { log('Kết quả…', 'good'); fx(l, { hap: 5 }); } },
    { k: 'b', l: 'Lựa chọn B', ai: { w: 1.2 }, run: function (l, r, log) { /* … */ } }
  ]
});
T('ten_tinh_huong', function (l, a) { return a >= 18; }, 0.05, 3); // điều kiện, xác suất mỗi năm, số năm chờ
```
`ai` là trọng số để AI chọn theo tính cách: `risk` (liều lĩnh), `bad` (việc xấu), `smart`, `soc`, `amb`, `cost`. Bộ test tự động thử mọi lựa chọn của tình huống mới.

## Về số liệu
Số liệu được làm tròn từ Tổng cục Thống kê (Niên giám 2023, Tổng điều tra 2019), Nghị quyết 202/2025/QH15, UN World Population Prospects 2024, World Bank; tỷ giá xấp xỉ 2025. Lương các nghề, tỷ lệ đô thị và thu nhập từng tỉnh là ước tính. Đây là trò chơi để suy ngẫm, không phải công cụ thống kê.
