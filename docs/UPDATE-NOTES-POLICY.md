# Quy tắc nội dung cập nhật

- Liệt kê đầy đủ các thay đổi có ích cho người chơi, không giới hạn ba dòng hoặc ba ý.
- Nêu hành vi mới, điều kiện sử dụng và ảnh hưởng lên cuộc chơi bằng tiếng Việt dễ hiểu.
- Không đưa tên file, mã nguồn, công cụ build, API hoặc chi tiết lập trình vào bài dành cho người chơi.
- Ghi thời điểm thực tế có múi giờ; giao diện hiển thị giờ Việt Nam UTC+7. Không tự đặt giờ tương lai.
- Khi sửa mốc sai, đặt correctedAt để lần dựng sau không khôi phục mốc cũ. Các lần dựng thông thường giữ nguyên ngày phát hành.

## Nguồn dữ liệu và quy trình mỗi đợt nâng cấp

- Nhật ký người chơi đọc nằm trong `public/data/updates.json`. Bản dựng nhúng cùng dữ liệu vào `updates.html` qua `updateHistoryData`, đồng thời sao chép file JSON vào dist; trang ưu tiên dữ liệu nhúng, bản nguồn tải JSON. Nhật ký không dùng API hoặc D1. Bình luận/góp ý là phần riêng dùng `/api/comments` và binding `REVIEWS_DB`.
- Mục viết riêng cần thêm vào `docs/update-extra.json` để không mất khi chạy `tools/build-update-history.js`. Công cụ này còn dùng lịch sử commit, CHANGELOG và nội dung biên tập trong `docs/update-copy.tsv`; không tự chạy lại và chấp nhận thay đổi lịch sử cũ nếu chưa đối chiếu.
- Sau mỗi nâng cấp có thay đổi đáng công bố, thêm mục mới vào đầu danh sách và đồng bộ JSON phục vụ người chơi. Dùng ID duy nhất, thời điểm thực tế, nhãn phù hợp; không tự đổi ngày của các mục cũ. Đối chiếu toàn bộ mục cũ trước/sau, kiểm tra mục mới sống sót qua công cụ tạo lịch sử, rồi xác minh cả JSON và dữ liệu nhúng của build/ZIP.
- Kiểm tra giao diện rộng/hẹp, tìm kiếm không dấu, bộ lọc và tải thêm. Giữ nội dung đầy đủ; không giới hạn tùy tiện số ý.
- Việc commit/push và tạo ZIP không tự cập nhật website. Chủ dự án quyết định upload lên Cloudflare; nhật ký mới chỉ xuất hiện trên website sau lần upload đó. Không sửa hoặc ghi đè D1 để công bố nhật ký tĩnh.

## Trạng thái bản đóng gói

Từ GĐ3, mục mới có version, releaseStatus=packaged và releasedAt=null khi chưa upload. Giao diện ghi rõ chưa phát hành; publishedAt ở bước này là thời điểm chuẩn bị nhật ký, không phải ngày ra mắt. Khi chủ dự án xác nhận phát hành, cập nhật trạng thái/ngày thực tế cùng correctedAt trong docs/update-extra.json để công cụ dựng áp dụng sửa đổi có chủ đích. Không tự suy ra trạng thái phát hành từ commit/push/build. Công cụ giữ nguyên các mục cũ không có correctedAt, kể cả mục không xuất hiện trong dữ liệu commit nhập vào.

## Đánh dấu phát hành (GĐ3 trở đi)

- Trạng thái chỉ nằm ở trường dữ liệu (releaseStatus/releasedAt); không viết “chưa phát hành” hay “đang chuẩn bị” vào title/summary/details, để chữ đó không còn lại sau khi phát hành. Trang Cập nhật tự hiển thị “Bản chuẩn bị · chưa phát hành” (kèm thời điểm chuẩn bị) hoặc “Đã phát hành” (kèm releasedAt). Mục “Mới nhất” ở đầu trang bỏ qua mục chưa phát hành.
- Liệt kê mục đang chờ: node tools/release-update.js (cũng tự in ở cuối npm run package:cloudflare).
- Khi chủ dự án upload Production: (1) chạy node tools/release-update.js <id> --released-at 2026-10-28T20:15:00+07:00 với thời điểm thực tế; (2) npm run package:cloudflare; (3) upload dist.zip mới; (4) commit docs/update-extra.json, public/data/updates.json, dist.zip. Nếu thời điểm upload khác đã ghi, chạy lại với --correct.
- Công cụ từ chối: thiếu ngày, thiếu múi giờ, ngày tương lai (lệch quá 5 phút), sớm hơn thời điểm chuẩn bị, ID không có; cập nhật đồng thời hai file, giữ nguyên mọi mục khác và đặt correctedAt để công cụ dựng lịch sử chấp nhận. Kiểm thử: node tests/update-release.js.
- Gói ZIP còn mục packaged chỉ là bản Preview; nếu lỡ upload, trang sẽ ghi “chưa phát hành” cho tới khi chạy bước trên và upload lại.
