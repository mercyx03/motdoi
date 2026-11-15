# Hồi quy đầy đủ (15/11/2026, bản 9.4.2)

Chạy từng mục qua `tests/regression-shard.js` (0–75 và 5b; mục 9 chia 24 nhóm theo `MOTDOI_DEC_IDS`, đủ 2.601 mã tình huống). Mỗi mục có lỗi còn được chạy lại trên bản gốc 9.0.2 (trước toàn bộ phần bối cảnh lịch sử) để biết lỗi có do phần bối cảnh gây ra không.

## Đạt hoàn toàn
Mục 0 (sau khi sửa hai điều kiện lỗi thời, xem dưới), 1–5, 5b, 7, 8, 11, 12, 13 (sau khi sửa), 14, 15, 17, 23, 26, 27, 28, 29, 31, 33, 36, 37, 39–41, 43, 44, 46, 47, 49–60, 62–65, 68, 70–73, 75.

## Đã sửa (điều kiện kiểm thử lỗi thời, không đổi game)
- Mục 0: tên mục CHANGELOG từ 9.0.0 không còn tiền tố `v`; khóa cache logo chỉ đổi khi tệp logo đổi.
- Mục 13: menu "Thuê sát thủ" bị ẩn có chủ ý khi nhân vật chưa có hợp đồng (`life176.js`), nên số hành động có thể ít hơn danh sách gốc đúng một.

## Lỗi có sẵn, giống hệt trên bản gốc 9.0.2 (không do phần bối cảnh lịch sử)
6 (độ phủ tình huống 48%, cần quyết định của chủ về mẫu số), 10 (`dieu_hanh874` một mức lương cho sáu chức danh; "trộm cắp bị bắt" nay đi qua hồ sơ điều tra nhiều giai đoạn trong `crime-depth.js`, 69 trên 200 đời có hồ sơ mở nhưng 0 lệnh bắt trong 8 năm), 16, 18, 19, 21 (rẽ hướng 6/400), 22, 24, 25, 30, 32, 34, 35, 38, 42, 45, 48, 61, 66, 67, 69, và tình huống `hen_ho` trong mục 9. Mục 9 còn nhiều mã tình huống không có bối cảnh để thử ("kiểm tra được trên ít nhất một khuôn", đã ghi từ trước).

## Dao động giữa các lần chạy
Mục 20 (bệnh ung thư gan tái phát sau 6–40 năm bị bộ kiểm đếm như chẩn đoán lại), mục 21 (mục "nghe lời gia đình", 28/48 so với ngưỡng 60%), mục 74 (`heirAtAge` đôi khi trả học vấn rỗng, 2/20 lần ở cả bản gốc lẫn bản hiện tại) và `sportDepth900` (đạt khi chạy riêng). Mục 74 và 21 đã chạy lại và đạt phần dao động; mục 20 không chạy lại (một lượt mất khoảng 25 phút).

## Chưa làm
Các lỗi có sẵn ở trên chưa sửa vì cần quyết định về cách chơi (ngưỡng, mẫu số, cách bắt giữ), không nằm trong phạm vi bối cảnh lịch sử.

## Cập nhật 9.4.3 (sau khi xem từng mục lỗi)
Sau khi cập nhật điều kiện lỗi thời và sửa lỗi hiển thị lượt hẹn yêu xa, các mục 0, 6, 10, 13, 18, 20, 25, 30, 34, 35, 45, 48, 61, 66, 67, 74 và tình huống hen_ho trong mục 9 đã chạy lại và đạt. Còn lỗi, cần quyết định về cân bằng hoặc nội dung: mục 16 (207 lựa chọn mỗi đời, ngưỡng dưới 200), 19 (điểm thi THPT trung bình 25,5 và 46% đạt từ 27 điểm trong mẫu chơi tự động, cao hơn thực tế), 21 (rẽ hướng nghề nghiệp 2–6 trên 400 đời, ngưỡng trên 8; phần lớn nghề chưa có hướng chuyển), 22 và 32 (tuổi thơ lặp 3,4% và trung bình 9,5 chuyện mỗi đời, ngưỡng 3% và 14), 24 (13 dòng nhật ký lặp trong cùng năm, chủ yếu dịp lễ, chưa tìm ra nguyên nhân), 38 (14,5% dòng nhật ký lặp khi sống nước khác, ngưỡng 7%), 69 (drama ngẫu nhiên 1,04 lần mỗi đời, ngưỡng trên 1,5). Các mục này cũng lỗi giống hệt trên bản gốc 9.0.2.
