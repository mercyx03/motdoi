# Rà soát logic bản 4.6.2 — 16/10/2026

Đã chạy toàn bộ các mục 0–45 của bộ hồi quy theo nhóm, giữ nguyên số mẫu mô phỏng. Những mục phát hiện vấn đề được sửa và chạy lại riêng; không coi kết quả lỗi ban đầu là kết quả đạt.

## Các lỗi đã sửa

- Bạn đời có thu nhập bằng 0 vẫn được công thức dự phòng tạo tiền đóng góp: chỉ tính từ thu nhập thực, hữu hạn, lớn hơn 0.
- Bạn đời có thể thăng chức liên tiếp mà không đủ năm công tác: thêm mốc thâm niên cho mỗi chức vụ.
- Chọn ôn thi lại đã hiện điểm năm sau: giữ kết quả cũ cho tới năm thi, chỉ công bố điểm mới một lần khi đến hạn.
- Khách mời hẹn hò được gán nghề không phù hợp tuổi, hoặc đổi nghề/thu nhập sau ghép đôi: dùng chung hồ sơ nghề theo tuổi và giữ hồ sơ được chọn.
- Vòng show hẹn hò cũ có thể tiếp tục qua năm: gắn năm tạo cảnh và kiểm tra trước khi giải quyết.
- Thua thử thách Đảo thiên đường nhưng lời kể vẫn ở khu nghỉ dưỡng: nội dung theo kết quả thực tế.
- Bản lưu đang chờ cảnh yêu đương vẫn hiện người 16 tuổi là sinh viên: sửa cả hồ sơ trong cảnh chờ và người yêu hiện tại khi khôi phục; kiểm tra mở lại nhiều lần không phát sinh thay đổi thêm.
- Hàm nuôi dạy con trùng tên hàm công khai cập nhật thu nhập bố mẹ: đổi thành `parentingYear`, giữ nguyên `parentYear` cho bố mẹ.
- Concert lưu trữ thiếu tên chương trình có thể hiện `undefined`: thêm nội dung dự phòng.
- Các sự kiện chu cấp khác nhau dùng cùng câu nhật ký trong một năm: thêm bối cảnh riêng vào kết quả.

## Kết quả kiểm tra

| Nhóm | Kết quả đạt | Bằng chứng |
| --- | ---: | --- |
| Dữ liệu, tạo nhân vật, tài nguyên (0–4) | 8.520 | `audit-shard0-final.log` |
| Mô phỏng hàng loạt: 6.300 cuộc đời (5) | 10.810 | `audit-shard5.log` |
| Lỗi cũ, lựa chọn ngẫu nhiên, lưu/tiếp tục (5b–8) | 162.318 | `audit-shard6.log` |
| Mọi lựa chọn trên các khuôn nhân vật (9) | 2.330.756 | `audit-rerun9.log` |
| Nhịp lựa chọn (16), chạy lại | 9 | `audit-rerun16-final.log` |
| Tài sản, học hành, hưu trí (19, 24), chạy lại | 145.447 | `audit-rerun19.log` |
| Concert, chi phí, thi lại, gia đình, trong tù (26, 29, 36, 41–42), chạy lại | 136 | `audit-rerun.log` |
| Show và hẹn hò (40), chạy lại | 19 | `audit-shard40.log` |
| Các bài cập nhật 4.5.1–4.6.2 | 8.438 | `audit-updates-final.log` |

Các mục 10–15, 17–18, 20–23, 25, 27–28, 30–35, 37–39 và 43–45 cũng đã chạy trong các nhóm lớn; không có lỗi còn lại tại các mục đó. Các log ban đầu `audit-shard9.log`, `audit-shard25b.log`, `audit-shard41.log` giữ lại cả kết quả lỗi trước khi sửa. Các mục có kỳ vọng lỗi thời được đối chiếu với cơ chế hiện tại rồi chạy lại theo bảng trên.

Riêng mục 9 thử 150.779 lượt chọn trên 471/672 tình huống bằng khuôn nhân vật chung. Không đồng nghĩa đã kiểm tra tất cả 672 tình huống bằng mọi tổ hợp trạng thái; các chuỗi đặc thù còn có bộ kiểm tra chuyên biệt. Chạy thêm 160 cuộc đời Việt Nam/quốc tế kiểm tra từng năm: chỉ số, tiền hữu hạn, hồ sơ người chưa thành niên, nhật ký sau khi chết.

Đã kiểm tra cú pháp 49 tệp JavaScript. ZIP triển khai được so sánh trực tiếp với các tệp hiện tại trong `public`, gồm tất cả tệp vừa sửa. Chưa triển khai lên website chính hoặc website thử nghiệm; đợt này kiểm tra logic bằng Node, không thao tác giao diện trình duyệt.

## Các kỳ vọng kiểm thử được cập nhật

- Không dùng học lực thấp để suy diễn thành cờ bạc; khuôn thử nợ cờ bạc phải có tiền sử cờ bạc.
- Trong tù hiện có 3–4 sự kiện/năm, không còn giới hạn cũ hai sự kiện.
- Nhật ký chi tiền kiểm tra cả người trả và nguồn tiền riêng.
- Không kiểm tra điểm thi tương lai ngay khi vừa chọn ôn thi.
- Kiểm tra điểm thi, cờ học bổng và mức kiến thức thay cho phân bố điểm từ công thức đã bị thay thế.
- Bổ sung khuôn ngân hàng cấp đầu, người đang bị truy sát, quan hệ chu cấp, mùa Running Man và tham số game được chọn để mở các nhánh đúng điều kiện. Màn hậu trường cũ đã được thay thế được kiểm tra là không còn mở độc lập.
- Thí sinh Tân binh được tạo đúng mức kỹ năng tối thiểu để kiểm tra các vòng thi; không giả định thí sinh không đủ điều kiện đã được nhận.

Có thể chạy lại từng nhóm bằng `node tests/regression-shard.js 0-5`, `5b,6-8`, `9-24` hoặc `25-45`. Bộ gốc vẫn chạy bằng `npm test`; các bài cập nhật chạy bằng `npm run test:update`.
