# Đối chiếu tính năng và sửa lỗi 8.4.1

| Nhóm tính năng được yêu cầu | Kết quả đối chiếu | Mã / kiểm thử |
| --- | --- | --- |
| Bộ lọc tuổi, giới tính, quốc tịch; hồ sơ nơi sống, trường, nghề | Đã có; hồ sơ trường / nơi làm việc chỉ có khi gặp đúng bối cảnh | life108; relationships108 |
| Bồi đắp tình cảm, cưới chậm, thỏa thuận tài sản | Đã có; người ấy có thể từ chối | life108; relationships108, relationships841 |
| Con trước cưới / ngoài hôn nhân, xác suất, chờ sinh, khoảng cách, người cùng làm cha mẹ | Đã có; đã sửa giao tiếp giữa thai kỳ mới và sự kiện cũ, hủy thai và chống sinh trùng | life74, life108; relationships108, relationships841 |
| Mập mờ nhiều người, một đêm, mái nhà bí mật | Đã có; mái nhà bí mật mất phí ban đầu, duy trì và có nguy cơ bị phát hiện | life107, life108; player107, relationships108 |
| Trách nhiệm nuôi con | Đã có chi phí nuôi con chung; con ở với người kia có chu cấp tới 18 tuổi. Nhánh đơn thân giữ lại đúng quyền nuôi con | life74; relationships841 |
| Hướng nghiệp con, golf / du thuyền / sưu tầm / tiệc | Đã có; hướng nghiệp không tự thay nghề của con | life108 |
| Hướng dẫn và đăng ký cao học, tiến sĩ sau 30 tuổi | Đã có; cần bằng trước đó, học phí và bảo vệ thành công | life106, life108; adult106, relationships108 |
| Nhiều ngành mỗi trường và tự chọn du học | Đã có; chọn bậc, nước, trường, ngành trước khi trả phí / chuyển nơi sống | life102, life107; update840, player107 |
| Diễu binh, cứu hộ, chiến dịch, xét hàm sớm, chức vụ cụ thể | Đã có; thành tích không thay yêu cầu đào tạo và chức vụ | life107; player107 |
| Nâng đỡ nghệ sĩ đàn em | Đã có; tốn phí, chưa chắc thành công | life107; player107 |
| Tự thay điện thoại / máy tính | Đã có bật từng loại và tổng ngân sách năm. 8.4.1 bổ sung hạn mức từng lần mua của từng loại, vẫn giữ tiền dự phòng | life107; player107, relationships841 |
| Ngoại tình, ly hôn, hòa giải tài sản | Đã có; sửa hàn gắn chưa kết thúc ngoại tình, câu hỏi ly hôn áp sai người, dữ liệu hòa giải thiếu gây NaN và hỏi quyền nuôi con lặp | life107, life108; player107, relationships841 |
| Bạn thân đã cưới, CSGT ở tuổi cao | Đã có chặn bạn thân đã có gia đình; CSGT chỉ khi còn lái xe, tuổi 16–85, không thuê tài xế | life74, scenarios; player107 |
| Đoàn, Đảng, Mặt trận, HĐND, UBND | Đã có hành động riêng, điều kiện tuổi / học vấn; không bảo đảm có chức vụ | life106; adult106 |
| Tự lưu Đài tưởng niệm | Đã có khi kết thúc đời / tới trang kết; xử lý lỗi lưu, phục hồi bản cũ, không thêm bản trùng, tối đa 60 đời gần nhất | memorial-history, app; memorial-history |
| Ca sĩ tự tìm show, học hát, casting, hợp tác, Instagram | Đã có; quỹ thời gian chung, mỗi hoạt động có chi phí / rủi ro | life105; careers105 |
| Fan showbiz và nhãn hàng | Đã có lời mời và tự gửi hồ sơ; không bảo đảm được chọn | life105; careers105 |
| Single, EP, album lớn | Đã có mức vốn khác nhau; mỗi đợt phát hành dùng hai phần quỹ thời gian, có thể lỗ | life105; careers105 |
| Thu nhập sau chi phí; học chuyên môn / việc thêm | Đã có mức chi phí theo nghề và hai hành động riêng cho nghề phù hợp | life105; careers105 |

Phạm vi sửa là các luồng đời thực ở Việt Nam / Toàn thế giới, Thường / Hardcore; không đổi nội dung hoặc engine Fantasy. Bản cũ có câu hỏi ly hôn thiếu danh tính không được phép tự chia tài sản; cần mở lại hành động để lấy câu hỏi mới gắn đúng người.

Bộ kiểm tra hồi quy cũ được cập nhật để đi qua chọn ngành/trường, học phí, bảo vệ luận án và thỏa thuận tài sản trước cưới. Các fixture kiểm tra đặt tên và thừa kế chủ động có nhiều con đúng khoảng cách, không phụ thuộc xác suất thụ thai của chế độ tự chạy; giữ nguyên số mẫu và các kiểm tra tính toàn vẹn.
