# Phát hành GĐ3–GĐ6 lên motdoi.site (chủ dự án tự thực hiện)

Gói trong repo luôn để nhật ký ở trạng thái **packaged** ("Bản chuẩn bị · chưa phát hành"). Chỉ ghi ngày phát hành khi bạn thực sự upload. Không có bước nào ở đây chạm vào database Production.

## 1. Trước khi upload

1. Mở terminal tại `C:\Users\bluef\Downloads\motdoi\motdoi\motdoi\motdoi-main`, đúng nhánh đã nghiệm thu (`gd6-integration-release` hoặc nhánh bạn đã merge).
2. Xem các mục đang chờ:
   ```
   node tools/release-update.js
   ```
   Hiện tại: `gd6-integration-release`, `gd5-event-balancing`, `gd4-multiyear-consequences`, `gd3-context-weighting`.
3. Khi đã sẵn sàng upload (cùng ngày, gần thời điểm upload), ghi **thời điểm thực tế có múi giờ** cho tất cả các mục phát hành cùng đợt:
   ```
   node tools/release-update.js --all-packaged --released-at 2026-11-02T20:15:00+07:00
   ```
   Hoặc chỉ một số mục: `node tools/release-update.js gd5-event-balancing gd6-integration-release --released-at <thời điểm>`.
   Công cụ từ chối thời điểm thiếu múi giờ, ở tương lai (quá 5 phút), sớm hơn ngày chuẩn bị, ID không tồn tại hoặc trùng; một ID sai thì không ghi mục nào. Các mục cùng đợt nhận cùng một thời điểm.
4. Đóng gói lại (bắt buộc, vì trạng thái nhật ký nằm trong gói):
   ```
   npm run package:cloudflare
   ```
   Kiểm tra dòng `PASS: 28 files; ZIP … bytes; SHA256 …`, và cuối lệnh không còn "Mục chưa phát hành".

## 2. Upload trên Cloudflare Dashboard

1. Cloudflare Dashboard → **Workers & Pages** → chọn đúng Pages project đang phục vụ motdoi.site.
2. **Settings → Bindings (Functions)**: xác nhận D1 binding tên `REVIEWS_DB` trỏ tới database hiện có (không tạo database mới, không đổi tên). Nếu project có môi trường Preview riêng, binding Preview không được trỏ vào database Production khi thử nghiệm có ghi dữ liệu.
3. **Deployments → Create deployment / Upload assets** → chọn file `dist.zip` (hoặc thư mục `dist`) vừa đóng gói. Nếu Dashboard cho chọn môi trường, có thể upload Preview trước, kiểm tra, rồi mới upload Production.
4. Không đổi DNS, tên miền, cấu hình project.

## 3. Kiểm tra ngay sau khi upload

- `https://motdoi.site/` mở được; bấm "Sống đời này", sống vài năm, bật/tắt Tự động khi đang có lựa chọn.
- Tải lại trang → "Tiếp tục sống" đúng tuổi, đúng tên.
- `https://motdoi.site/updates.html`: 4 mục mới hiện "Đã phát hành" với ngày đã ghi; tổng 95 mục.
- `https://motdoi.site/api/reviews` trả về 200 (binding D1 hoạt động); đăng nhập/bình luận vẫn dùng dữ liệu cũ.
- Điện thoại: trang chủ, màn hình chơi, trang Cập nhật không tràn ngang.

Sau khi ổn: commit `docs/update-extra.json`, `public/data/updates.json`, `dist.zip` với thông điệp ghi rõ đã phát hành, rồi push.

## 4. Nếu có lỗi sau khi phát hành

- Nhanh nhất: Dashboard → **Deployments** → chọn bản triển khai trước → **Rollback to this deployment**. Không ảnh hưởng database.
- Hoặc upload lại gói cũ: `git show 21bca64:dist.zip > dist-gd3.zip` (GĐ3), `git show e9fd613:dist.zip > dist-gd25.zip` (GĐ2.5, bản đang chạy Production trước đợt này) rồi upload file đó.
- Nếu ngày phát hành ghi sai (ví dụ upload trễ): `node tools/release-update.js <id…> --released-at <thời điểm đúng> --correct`, đóng gói lại, upload lại.
- Nếu rollback hẳn về bản cũ: khôi phục hai file nhật ký từ commit trước khi ghi phát hành (`git checkout <commit> -- docs/update-extra.json public/data/updates.json`) để không ghi nhận "đã phát hành" cho bản không còn chạy.
- Bản lưu người chơi: GĐ3–GĐ6 không đổi `SAVE_SCHEMA`. Đã kiểm cả hai chiều: 60 bản lưu cũ chơi tiếp trên mã mới; 29 bản lưu tạo bằng mã GĐ6 (45 tuổi, đều có dữ liệu chuỗi GĐ4 / nhịp GĐ5) mở và chơi tiếp 5 năm trên mã GĐ2.5 `e9fd613` mà không lỗi (các trường mới bị bỏ qua). Rollback không làm hỏng bản lưu, nhưng chuyện kéo dài nhiều năm sẽ dừng ở bản cũ.
