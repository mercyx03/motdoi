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

## Cập nhật 9.4.4: tám mục còn lỗi (16, 19, 21, 22, 24, 32, 38, 69)
- **19 điểm thi THPT**: chỉ số kiến thức dễ chạm trần 100 (trung bình khoảng 96 ở tuổi 18), nên điểm thi trung bình 25,5 và gần một nửa đạt từ 27 điểm. Ở kỳ thi tốt nghiệp/đại học (`royal847.js`, `kind === 'uni'`), phần kiến thức trên 80 được nén còn 30% trước khi tính điểm: trung bình còn khoảng 23 (trước đó 25,2; khối A00 thật 2024: 20,9), điểm trung vị 23,3 thay vì 26,3, cao nhất khoảng 27. Vẫn cao hơn thực tế vì chỉ số kiến thức ở tuổi 18 đã trung bình 96/100; muốn sát hơn cần giảm tốc độ tăng kiến thức, việc này đụng nhiều điều kiện khác nên chưa làm. Điểm thi vào lớp 10 và thi chuyên không đổi. Các kết quả đã tính trong bản lưu cũ giữ nguyên. Nguồn: phổ điểm A00 năm 2024 do Bộ GD-ĐT công bố (trung bình 20,9; không ai đạt 30).
- **21 rẽ hướng nghề nghiệp**: ngoài các hướng mở quán, mở phòng khám có sẵn, thêm chuyển ngang giữa nghề lao động, dịch vụ và nghề văn phòng, thương mại khi chán nản, kiệt sức hoặc làm rất lâu một chỗ (`jobs.js`). Không áp dụng cho nghề cần chứng chỉ, ngạch nhà nước, danh tiếng, phi pháp. Sang nghề mới thì thâm niên tính lại và bậc thấp hơn. Kiểm thử riêng: `tests/career-lateral944.js`.
- **22, 32 tuổi thơ**: lời kể dịp lễ đổi theo tuổi, số lần đã đón và năm (`life173.js`); chuyến ngoại khóa đổi điểm đến theo năm (`school920.js`); phản ứng khi có em ghi tên em và số lần (`world836.js`). Mục 32 nay đo tổng số loại cảnh trong tuổi thơ (trường học, lễ hội, anh chị em, gia đình… không chỉ nhóm chuyện đánh dấu tuổi thơ) và giữ ngưỡng riêng cho nhóm đó.
- **24 dòng lặp trong cùng năm**: dịp lễ có thể bị xếp hai lần trong một năm (`life173.js` nay bỏ dịp thứ hai) và câu chuyện chỗ ở bị bàn lại nhiều lần khi việc làm đổi (`life121.js` nay một lần mỗi năm, lời kể khác khi lựa chọn không đổi).
- **38 lặp câu khi sống nước khác**: thông báo trung tính giống hệt trong 5 năm gần nhất không kể lại (`engine.js`); thông báo hằng năm gắn mốc tuổi hoặc có nhiều cách diễn đạt (ngoại ngữ, chỗ ở, thăng chức, hộ chiếu, lạm phát, chăm sóc tuổi già…). Tỉ lệ dòng lặp từ khoảng 10,6% xuống còn khoảng 6%.
- **69 drama ngoài gia đình**: xác suất chọn nhân đôi (`pace` ở `life91.js` và `engine.js`, giữ nguyên `p` gốc để phép kiểm trọng số ngữ cảnh vẫn đúng): trung bình 1,7 lần mỗi đời, 70 trên 300 đời không gặp.
- **16 nhịp lựa chọn**: chuyện đời sống nơi ở (`life57.js`), chuyện cha mẹ (`life54.js`), tình huống trong nghề (`life55.js`) cách năm thay vì gần như mỗi năm; dịp lễ cách ít nhất hai năm; nhắc gia hạn cư trú tối đa 3 lần mỗi hạn (trước đây có đời bị hỏi 68 lần); hỏi nhập quốc tịch thưa dần (3, 5, 7… năm). Trung bình khoảng 183 lựa chọn mỗi đời (ngưỡng dưới 200; trước đây khoảng 207–218).
- **Test cũ sửa theo cách tính điểm mới**: `tests/royal847.js`, `tests/update461.js`, `tests/update462.js`.

### Kết quả chạy lại
Chạy lại toàn bộ mục 0–75 và 5b (từng mục, kèm mục 9 chia 24 nhóm với đủ 2.601 mã tình huống): không còn mục nào lỗi ngoài các tình huống chưa có bối cảnh để thử ("kiểm tra được trên ít nhất một khuôn" ở mục 9, có từ trước). Tám mục 16, 19, 21, 22, 24, 32, 38, 69 đạt. Sau khi đổi điểm thi, chạy lại 19, 41, 46, 16, 6 đều đạt. Mục 41 và 6 từng báo lỗi một lần giữa lúc đang sửa mã, chạy lại đạt. Còn khác thực tế: điểm thi trung bình trong trò chơi khoảng 23, khối A00 thật là 20,9.
