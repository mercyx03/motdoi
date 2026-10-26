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
