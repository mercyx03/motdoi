# Mô hình thi 8.10.54

Phạm vi: thi thử lớp 10, Đại học, thi thật và thi lại tại Việt Nam. Mở rộng API MOCK_EXAM853 đang có trong royal847; không tạo sổ tiến độ song song. Mọi ngưỡng và phương thức dưới đây là mô phỏng, không phải dữ liệu tuyển sinh thật.

## Dữ liệu và công thức

`inputs` chỉ đọc: kiến thức 0–100, thành tích đúng môn, tổ hợp, kỹ năng năng khiếu, luyện thi 0–6, tập trung, stress 0–100, mệt mỏi và năm luyện. Năm khác tự hết mệt do các đợt luyện cũ. Hỗ trợ học tập đã duyệt tại Việt Nam nâng phần quản lý thời gian có giới hạn, thay cho cộng thẳng 0,5 điểm. Tâm lý ẩn examApt và phần phạt Hardcore ngoài mô hình không còn tác động vào bài thi Việt Nam; các hệ thống đời sống khác vẫn giữ nguyên.

Mỗi kỹ năng `format/time/hard/special/stable` nằm trong 0–1. Luyện chuyên/năng khiếu mới lưu riêng theo môn trong specificV2; không luyện Toán rồi cộng sang chuyên Anh, không luyện vẽ rồi cộng sang hát. Mức chuyên tổng quát từ migration cũ vẫn được bảo toàn có trần; khi chấm lấy mức lớn hơn giữa tiến độ cũ và kỹ năng đúng môn, không cộng trùng. Môn văn hóa:

- Nền B = 0,092 × kiến thức; kiến thức 100 cho nền 9,2/10 mỗi môn, không còn trần 23/30 hay 35/50.
- Mức thành thạo M = 0,035 × dạng đề + 0,025 × thời gian + 0,025 × câu khó + 0,015 × luyện thi/6. Hỗ trợ học tập chỉ nâng phần kỹ năng thời gian lên tối thiểu 0,5.
- Thi chuyên riêng thêm 0,06 × kỹ năng chuyên vào M. M được chặn ở 0,3.
- Năng lực A = B + (10 − B) × M. Giữ sàn thành tích đúng môn hiện hữu: trường 7,5; tỉnh 8,5; quốc gia/tuyển chọn 9; quốc tế 10. Không cộng tổng lần nữa.
- Trạng thái S = (ưu tiên học ? 0,12 : 0) − max(0, stress − 40) × 0,004 − mệt × 0,006. Nếu sàn thành tích bảo vệ điểm thì ghi phần trạng thái thực sự đã áp dụng, không gán việc bảo vệ sàn thành vận may.
- Biên độ D = (0,7 − 0,35 × ổn định) × (1 + stress/200).
- Điểm = làm tròn 0,25 của clamp(max(sàn, A + S) + room × D, 0, 10), sau đó áp dụng sàn đúng môn. room phân bố đều [-1,1], dùng chung cho các môn trong một kỳ để mô phỏng trạng thái ngày thi tương quan.

Môn nghệ thuật dùng B = 0,08 × kỹ năng + 0,012 × kiến thức + 0,4 nếu năng khiếu tương ứng đúng tổ hợp. M = 0,08 × kỹ năng chuyên/năng khiếu + 0,025 × chuẩn bị năng khiếu + 0,015 × chuẩn bị chuyên ngành (0–4), cùng trạng thái/biên độ/giới hạn như trên. Không áp sàn HSG văn hóa cho biểu diễn/vẽ.

Tổng lớp 10 = Toán ×2 + Văn ×2 + Anh, tối đa 50; đây là một phương thức hư cấu, không áp quy chế của địa phương thật. Lộ trình thi chuyên có bài riêng /10, mốc 7,8; không cộng vào /50. Các tổ hợp nghệ thuật H00/V00/S00/N00 dùng môn văn hóa và nghệ thuật đúng bảng EXAM127. Vòng năng khiếu riêng /10 là điều kiện ở nhóm nghệ thuật, không cộng thêm vào /30. Không so thang khác nhau bằng một quy đổi ngầm.

## Dự báo, kết quả và migration

`calculate(inputs, room)` là hàm thuần duy nhất cho thi thử/thi thật/dự báo. Dự báo thấp/cao là toàn biên mô hình [-1,1]; kỳ vọng là trung bình 101 điểm lưới, có sai số làm tròn nhỏ. Dữ liệu từng môn trong báo cáo là điểm giữa khoảng. Khoảng chỉ áp dụng khi giữ nguyên dữ liệu đầu vào; không bao phủ biến cố tương lai chưa xảy ra. Không tạo tỷ lệ phần trăm đỗ trên giao diện.

Kỳ thi chính thức lưu `officialV2[kind:age:block:subject]`, gồm điểm, ảnh chụp đầu vào, phần năng lực/trạng thái/biến động, room và thời điểm. Cùng seed và điều kiện cho cùng kết quả. Đời mới giữ seed thi riêng từ seed khởi tạo; đời cũ dùng danh tính đã lưu. Không dùng RNG đang chạy, không phụ thuộc số lần mở menu. Đổi trạng thái sau chấm không sửa kỳ cũ; thi lại năm sau có khóa kỳ mới và cùng công thức. Bản lưu không có kết quả mới vẫn giữ examScore, exam127, hồ sơ THPT và lịch sử cũ. Không hồi dựng kết quả đã hoàn tất bằng công thức mới.

Báo cáo có giờ Việt Nam UTC+7 và năm/tuổi trong game; lần luyện lưu thời điểm, fingerprint trạng thái/tổ hợp/nguyện vọng để cảnh báo hết hiệu lực. Mở báo cáo không ghi save hoặc RNG. Nhật ký sau thi dùng trực tiếp thành phần đã chấm và lưu, không sinh lý do sau kết quả.

Migration modelVersion=2 chạy qua migrateExt khi có tiến độ cũ, hoặc lúc hành động đầu tiên. Khi chỉ xem báo cáo thì dùng phép chiếu thuần tương đương. Giữ các trường cũ làm lịch sử nhưng ngừng cộng điểm từ chúng:

| Tiến độ cũ | Kỹ năng chuyển đổi tối đa |
|---|---|
| hsBonus /4,5 | dạng đề 0,8; câu khó 0,6 |
| hsFloorBonus /3 | thời gian 0,8; ổn định 0,7 |
| hsSpecialBonus /8 | chuyên 0,8 |
| uniBonus /3,5 | dạng đề 0,8; thời gian/câu khó 0,6 |
| aptRecovery /2,5 | ổn định 0,8 |
| nkBonus /2 | năng khiếu 0,8 |

Mỗi tỷ lệ cũ được chặn 0–1 trước chuyển đổi. Không đổi lại theo năm, không xóa công sức, không đổi +8 thành +8/10.

Mỗi lần luyện là một khối nhiều tuần trong lịch năm, tối đa hai khối/năm. Dạng đề: dạng đề +22% phần còn thiếu, thời gian +20%, ổn định +8%. Chuyên sâu: câu khó +25%, chuyên +18%, dạng đề +8%. Chữa lỗi/làm quen phòng thi: thời gian +12%, ổn định +25%, chuyên +15%, stress −8. Luyện thường tăng stress 1 và mệt 4; chuyên sâu tăng stress 4 và mệt 8. Mệt tối đa 20. Không bơm kiến thức liên tục, không sửa điểm thật. Lộ trình ôn chuyên ba tháng sẵn có dùng cùng kỹ năng thay cho cộng kiến thức tạm lúc chấm; kiến thức học được thực sự ở lộ trình đó vẫn giữ.

## Ngưỡng và tên nhóm

Giữ mã trường/ngành để đọc bản lưu cũ; tên danh mục mới là nhóm mô phỏng, lịch sử đã lưu không bị thay tên. Các nhóm THPT dùng mốc [46;45;25;46,5;41;22;37]/50 theo thứ tự danh mục hiện hữu. Nhóm Đại học giữ tham số theo ngành của EDUCATION54 và điều kiện của ARTS84 (khối, ngôn ngữ, tuyển thành tích, năng khiếu), gắn reference simulation/year=null/scale=30. Không gán các mốc này cho Amsterdam, KHTN, Lê Hồng Phong, Nguyễn Khuyến, Y Dược, Bách Khoa, Ngoại Thương hay trường thật khác. Chưa có bộ dữ liệu tuyển sinh thật được xác minh; không tuyên bố quy chế/ngưỡng hiện hành.

## Đo cân bằng

`node tests/exam-model.js` kiểm tra bất biến và ghi .cache/exam-calibration.json; kết quả được giữ tại docs/EXAM-CALIBRATION.json. 96.000 thí sinh độc lập theo danh tính, 48 nhóm: hai kỳ thi × kiến thức 35/60/80/95 × kỹ năng 0/0,5/0,9 × stress 20/90; 2.000 thí sinh/nhóm. Dự báo tỷ lệ vượt mốc cạnh tranh 46/50 hoặc 28,5/30 bằng 1.001 điểm lưới; kết quả thật dùng seed kỳ thi được băm riêng. Sai lệch lớn nhất 1,2411 điểm phần trăm; sai lệch điểm trung bình lớn nhất 0,09046; thiên lệch gộp −0,04953 điểm phần trăm. Các nhóm quá xa ngưỡng có tỷ lệ 0 hoặc 1 do chính mô hình hữu hạn; không diễn giải thành cam kết tương lai.

Đây là kiểm tra tính nhất quán/phân bố của mô hình game, không phải hiệu chuẩn bằng dữ liệu học sinh thật, không kiểm chứng xác suất xã hội. Giao diện chỉ phân loại khả năng thấp/cạnh tranh/khả quan và nêu điều kiện còn thiếu. Hồi quy đầy đủ và ảnh hưởng dài hạn tới mọi lộ trình quốc tế để GĐ6, chưa nghiệm thu toàn diện.
