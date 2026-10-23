# Tải trang và giao diện điện thoại

## Thay đổi

- Trang chủ chỉ chạy bộ khởi động 5.860 byte JavaScript trước nén; 110 module game được chia thành 28 phần, tải khi khu vực thiết lập sắp xuất hiện hoặc người chơi bấm một chức năng cần engine.
- Mỗi phần giữ nguyên nội dung và thứ tự phụ thuộc. Tải tệp song song nhưng thực thi tuần tự, nhường một lượt xử lý giữa các phần.
- Khi mạng lỗi, hiện trạng thái và cho thử lại từ phần chưa tải; lưu thao tác bấm đầu tiên để thực hiện sau khi khởi tạo. Chưa chạy game thì không dựng engine, không mở vòng lặp mô phỏng.
- Font WOFF2 lưu trong public/fonts, kèm giấy phép SIL OFL; giữ Be Vietnam Pro 400/600/700 và Playfair Display 700. Bỏ Lora, dùng Georgia cho lời kể serif; tải trước hai subset của Be Vietnam Pro 400 để ưu tiên đoạn giới thiệu. Giữ font-display: swap.
- Build chèn toàn bộ CSS trang chủ vào HTML, không trì hoãn stylesheet khiến trang mất định dạng. Bản source vẫn dùng stylesheet trực tiếp.
- Tệp JavaScript và font có hash cache một năm, immutable. HTML, sitemap, robots, lịch sử cập nhật và tài nguyên tên cố định được kiểm tra lại để không giữ bản cũ.
- Điện thoại dùng thanh điều khiển gọn, menu nút phụ, nhóm hành động theo lưới, nhật ký cuộn và hộp lựa chọn vừa màn hình.

## Xác minh

- npm run test:loading: ngân sách bộ khởi động dưới 10 KB, hash từng phần, cú pháp JS, nội dung và thứ tự mọi module, font nội bộ, CSS, sitemap, robots và cache.
- Edge headless: chỉ một script lúc mở trang; không gọi Google Fonts; đổi giao diện, chào đời Hardcore, tải tiếp bản lưu, mở tài khoản/nghề nghiệp và thử lại khi một phần tải lỗi.
- Bản source chưa build: chọn Toàn thế giới trước khi engine tải xong vẫn được thực hiện, chào đời, tạm dừng, menu điện thoại và hồ sơ hoạt động.
- Kiểm tra không tràn ngang ở 320, 360, 390, 430 và 1280 px.
- 260 kiểm tra cấu trúc trang; 336 kiểm tra sửa thai kỳ/gia đình; 3.566 kiểm tra giao lưu gia đình; 76 kiểm tra quan hệ; 141 kiểm tra thừa kế; 9 kiểm tra Đài tưởng niệm đã qua.
- Đối chiếu bốn cuộc đời hoàn chỉnh với bundle trước tối ưu: Việt Nam, Nhật, Mỹ và Hardcore cho JSON trạng thái giống hệt nhau.
- Bộ snapshot v7.6.0 trong tests/hardcore-isolation.js chưa khớp các thay đổi gameplay có trước lần tối ưu này. Đã đối chiếu trực tiếp với dist trước tối ưu để xác nhận không phải sai khác mới; không tự ghi đè fixture cũ.
- Tạo lại lịch sử cập nhật để kiểm tra các mục đã xóa không được thêm trở lại.

Chưa đo lại Lighthouse trên website đã triển khai. Số đo trình duyệt localhost không thay thế Lighthouse giả lập mạng/CPU và dữ liệu INP thực tế. Cần tải dist mới lên Cloudflare rồi đo lại Mobile/Desktop, LCP, TBT và theo dõi INP thực tế; không công bố điểm số mục tiêu như kết quả đã đạt.
