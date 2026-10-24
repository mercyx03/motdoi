# Rà soát 8.4.4

Phạm vi: trả nợ, báo cáo chi tiêu, điều kiện định cư, chức vụ sau đổi nghề, phần đánh giá và nội dung cập nhật. Không khẳng định đã chứng minh toàn game không còn lỗi.

Các lỗi đã sửa:
- Thu hồi nợ và tất toán nhà khi lớn tuổi vừa trừ tiền trực tiếp vừa cộng khoản chi để trừ lần nữa. Chỉ quyết toán một lần.
- Mỗi khoản vay tính lại cùng số tiền khả dụng, chưa trừ khoản đã trả và chi phí thiết yếu. Dùng ngân sách còn lại.
- Mortgage cũ được trả sau quyết toán nhưng chưa cập nhật tổng chi/số dư tiết kiệm. Đồng bộ báo cáo với biến động tiền.
- Chứng chỉ không có giá trị trả về undefined khiến so sánh nhỏ hơn 2 không chặn hồ sơ. Coi thiếu chứng chỉ là cấp 0.
- Nhãn lãnh đạo chỉ kiểm tra nhiệm kỳ, chưa kiểm tra nghề đang làm. Chỉ hiển thị khi còn đúng công việc.

Bình chọn: chỉ nhận 4–5 sao mới ở server và client; giữ nguyên dữ liệu cũ và bộ lọc tất cả mức sao. Giao diện công khai phạm vi bình chọn để không gây hiểu lầm. Không ghi thay đổi này trong nhật ký người chơi theo yêu cầu. Bỏ thông báo xúc phạm người đánh giá thấp.

Kiểm tra: 9 hồi quy logic tiền/điều kiện, 61 kiểm tra SQLite đánh giá, 80 lọc/lịch sử đánh giá, 151 cộng đồng, 253 góp ý, 336 quan hệ, 357 mở rộng, 146 thừa kế. Kiểm tra mobile form với đánh giá cũ 2 sao, gửi mới 4 sao và không tràn ngang. Loading xác nhận 24 file, không source map, 8 cuộc đời khớp nguồn/production. Chưa chạy toàn bộ regression 6.000 cuộc đời.
