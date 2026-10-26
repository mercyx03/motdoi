# Build và đóng gói để chủ dự án upload thủ công

Chạy trên Windows tại gốc repository:

```powershell
npm run package:cloudflare
```

Lệnh này không deploy và không gọi Cloudflare API. Nó dùng build riêng `tools/build.js`, dựng output mới trong `.cache/cloudflare-package-stage`, giữ dist cũ trong cache khi kiểm tra, chạy `tests/loading.js` và `tests/admin-events.js`, rồi tạo ZIP mới và đọc lại từng entry để so SHA-256 với dist. ZIP dùng đường dẫn `/`, có index.html ngay gốc và giữ cả `.well-known/ai-catalog.json`, `_worker.js`, `_headers`, `_routes.json`. Khi build/test/ZIP thất bại trước khi hoàn tất, dist trước đó được khôi phục và ZIP cũ được giữ.

Kết quả thành công: `dist/` và `dist.zip` cùng một bản triển khai. Giữ chính sách Git hiện có: dist được ignore; dist.zip đã được theo dõi trong Git. Không đưa node_modules, tests, mã nguồn module, source map hoặc dữ liệu riêng vào gói. Build dùng allowlist và loading test kiểm tài nguyên/hash, cú pháp, 28 file triển khai và 8 cuộc đời giống nhau giữa nguồn và bản nén.

## Cloudflare Pages Dashboard

Theo [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/), Dashboard nhận ZIP hoặc thư mục và hỗ trợ `_worker.js`. Không cần biên dịch thư mục functions vì dự án dùng advanced mode với Worker đã gộp ở gốc output.

Chủ dự án chọn đúng Pages project đang có và tự upload dist.zip. Không upload nguyên repository. Không đổi DNS, tên miền, project hoặc database. `wrangler.toml` hiện cấu hình Workers static assets; nó không được đưa vào ZIP và không tự thiết lập binding Pages qua Dashboard.

Worker dùng D1 binding **REVIEWS_DB** cho tài khoản, bình luận, đánh giá và admin. Giữ binding trỏ tới database hiện có; ZIP không chứa cấu hình binding, database hay secrets. Preview cũng cần binding riêng đúng môi trường; không dùng database production cho phép thử có ghi dữ liệu. Xem [Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/). Các test API cục bộ dùng database trong bộ nhớ, không chứng minh cấu hình Cloudflare thực tế hoặc di trú dữ liệu thật đã đúng. Không tuyên bố API production đã nghiệm thu nếu chưa kiểm chứng điều đó.

## Điều kiện nghiệm thu

Lệnh đóng gói PASS chỉ xác nhận artifact và kiểm tra cục bộ. Khi regression của giai đoạn chưa hoàn tất, artifact chỉ dành cho Preview và báo **CHƯA sẵn sàng Production**. Xem báo cáo nghiệm thu tương ứng; không suy ra production-ready chỉ từ sự tồn tại của ZIP.

Nếu lỗi script hoặc môi trường, artifact được giữ lại là bản cũ; không trình bày nó là build mới. Không chạy đồng thời hai lệnh package: script từ chối ghi đè backup còn tồn tại để người vận hành kiểm tra bản cần phục hồi.
