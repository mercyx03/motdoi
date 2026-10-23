# Build production gọn

Chạy npm ci một lần sau khi tải source, rồi npm run build. Chỉ tải thư mục dist hoặc dist.zip lên Cloudflare; public là mã nguồn phát triển.

- Đúng 24 file triển khai; JavaScript trang đầu 4.391 byte trước nén; bốn gói game tải khi cần.
- esbuild nén JS/CSS, rút gọn tên biến, bỏ chú thích; không xuất source map hay sao chép module nguồn, tài liệu, package.json vào dist.
- Giữ đầy đủ CSS trong HTML để không hiện trang mất định dạng. Gom font thành bốn WOFF2 đầy đủ ký tự, font-display: swap.
- Giữ logo mới, cache theo hash, thao tác bấm trong lúc đang tải và cơ chế thử lại khi mạng lỗi.
- Nhận diện sự kiện du lịch/cho con tiền bằng nhãn ổn định thay vì hình thức mã hàm, tránh minify đổi hành vi.
- Mã chạy trong trình duyệt vẫn có thể tải xuống. Minify làm mã khó đọc hơn, không phải biện pháp bảo mật hay mã hóa bí mật.

## Kiểm tra

- tests/loading.js: 24 file; không có source map/module nguồn rời; hash/cú pháp, font, CSS, canonical, sitemap/robots và cache.
- Tám cuộc đời hoàn chỉnh cho trạng thái JSON giống hệt giữa nguồn và bản nén: Việt Nam 34/63 tỉnh, Nhật, Mỹ, Đức, Ấn Độ và Hardcore.
- tests/update660.js: 14 kiểm tra build và một cuộc đời hoàn chỉnh trong engine production.
- Edge: một script lúc mở trang, không tải font Google; chào đời Hardcore, lưu/tải, Toàn thế giới, tài khoản/nghề nghiệp và thử lại sau lỗi mạng.
- 23 kiểm tra API trên Worker đã nén: tài khoản, bình luận, phân trang, chuyển đổi đánh giá và gửi sao.
- 336 kiểm tra thai kỳ/gia đình, 3.566 kiểm tra giao lưu gia đình đã qua.
- Logo/CSS không tràn ngang ở ba trang điện thoại; bản source chưa build vẫn chạy được.

Chưa đo lại Lighthouse trên website đã triển khai. Số đo localhost không thay thế Lighthouse giả lập mạng/CPU hoặc INP thực tế.

Kiểm tra cũ ngoài phạm vi: snapshot v7.6.0 không còn khớp gameplay các phiên bản sau; bộ community đầy đủ có một khẳng định biên tập về độ dài/số gạch đầu dòng nhật ký cập nhật. Không ghi đè fixture hoặc bỏ kiểm tra; API trên Worker đã nén được kiểm tra riêng.

## Hồ sơ xuất phát

Hồ sơ đầy đủ được dựng sẵn từ engine và cùng template giao diện khi build, theo Việt Nam/Toàn thế giới, bản đồ và độ khó. Trang hiển thị hồ sơ trước khi tải engine; khi bấm Sống đời này, chuyển đúng seed đang xem vào game. Xuất phát điểm khác tạo hồ sơ mới bằng engine. Giữ 24 file và JavaScript/CSS minified.
