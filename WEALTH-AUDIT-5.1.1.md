# Rà soát kinh tế V5.1.1

Ảnh 2.173 tỷ là 2.173 tỷ đồng (hai nghìn một trăm bảy mươi ba tỷ). Chưa có bản lưu của nhân vật trong ảnh nên chưa thể truy nguyên chính xác nhân vật đó.

## Phát hiện và sửa
- Đổi tiền chưa đồng bộ: số dư tiền mặt đổi nhưng lịch sử đóng bảo hiểm, lương hưu, lương bạn đời/bố mẹ, mức lương lưu và một số tài sản/doanh thu kinh doanh chưa đổi. Có thể làm sai thu nhập/định giá sau khi đi hoặc về nước.
- USD nội bộ là USD PPP: chuyển giữa hai quốc gia cần điều chỉnh mức giá; không được giữ nguyên số PPP rồi hiểu theo mức giá mới.
- Kinh doanh cũ thiếu chi phí quản lý chuỗi và tái đầu tư. Bổ sung cạnh tranh, quản lý khi người chơi còn đi làm/đã cao tuổi, chi phí mở rộng chuỗi và tái đầu tư thường niên. Nhà cho thuê trừ bảo trì/quản lý.
- Chặn hạch toán lợi nhuận trùng trong cùng tuổi.

Không đặt trần 500 tỷ, không cắt tài sản của bản lưu cũ. Bản sửa áp dụng cho phép tính và dòng tiền về sau. Không thể tự phục hồi số tiền sai trong quá khứ nếu thiếu lịch sử giao dịch.

## Mô phỏng cân bằng
100 cuộc đời từ seed 880100–880199, đơn vị quy về VND trước khi thống kê. Cả hai nhóm đều đã có sửa đổi tiền; đây chỉ là so sánh cân bằng kinh doanh. Các quyết định sau đó có thể khác do tiền mặt thay đổi.
- Trước điều chỉnh kinh doanh: cao nhất khoảng 550 tỷ; 1/100 vượt 500 tỷ.
- Sau điều chỉnh: cao nhất khoảng 232 tỷ; 0/100 vượt 500 tỷ. Trung vị toàn mẫu khoảng 7,31 tỷ; 39 nhân vật xuất thân nhóm 1–2 có trung vị khoảng 5,03 tỷ.

Các con số là kết quả mô phỏng game, không phải số liệu kinh tế thực và không đảm bảo mọi lượt chơi đều dưới 500 tỷ. Nghề chính trên thẻ kết thúc không thể hiện đầy đủ nguồn thu từ đầu tư, kinh doanh, bạn đời hay thừa kế.

Chạy kiểm tra: node tests/update511.js
Chạy mẫu cân bằng: node tools/audit-wealth.js
