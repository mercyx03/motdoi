# 9.7.0 — Saudi Pro League và họ tên thường dân Tây Ban Nha

## Phạm vi

- Mở rộng danh mục FOOTBALL_DATA bằng bốn CLB Saudi: Al Hilal, Al Nassr, Al Ittihad, Al Ahli. Giữ nguyên toàn bộ ID của 192 CLB cũ. Không tạo hạng dưới hoặc lên/xuống hạng Saudi khi chưa có dữ liệu.
- Giải Saudi có từ 1976; tên Saudi Premier League dùng trước 2008. Thử tuyển, đàm phán, ký lời mời và mua CLB qua doanh nghiệp kiểm tra năm.
- Từ 2023, kỹ năng thi đấu đặc biệt cao hoặc danh tiếng quốc tế cao, cùng năng lực tối thiểu 60/100, có thể được chào tối đa 60 triệu USD/năm. Lương cơ bản, gia hạn và tăng hằng năm đều giữ trần của hợp đồng đã ký. Thưởng trận, tài trợ và phí ký được ghi riêng theo hệ thống hiện có. Trước 2023 không áp dụng khoản lương ngôi sao này; mức lịch sử là ước lượng gameplay.
- Ngân sách, tỷ lệ lương, thời hạn, kết quả thi đấu là cân bằng gameplay; không khẳng định tài chính hay thể thức thật. Danh mục chỉ có bốn CLB đại diện, không tái dựng đầy đủ mọi mùa giải.
- Bộ tên Tây Ban Nha sinh tên đơn/ghép theo tỷ trọng 70/30 và họ phổ biến/ít gặp/ghép theo 70/20/10. Đây là trọng số thiết kế theo yêu cầu, không phải thống kê dân số. Không tự thêm de Todos los Santos, tước hiệu hoặc de trước mọi họ.
- Lưu riêng tên gọi, họ thứ nhất, họ thứ hai và chữ nối. Họ nhiều từ, dấu nối, y bên trong một họ không bị tách thành nhiều thế hệ. García García là hợp lệ; đảo hai họ giống nhau không sinh ra họ López.
- Con lấy họ thứ nhất của từng cha mẹ đã ghi nhận, mặc định cha trước. Được thống nhất mẹ trước từ 2000 (mô hình theo năm); thứ tự được khóa sau người con đầu tiên của cùng cặp cha mẹ. Có lựa chọn chữ y giữa hai họ. Cha mẹ đổi tên không tự sửa tên con đã đăng ký.
- Chỉ một dòng cha/mẹ được ghi nhận thì dùng hai họ của người đó; không đồng nhất ngoài hôn nhân với không có cha được ghi nhận. Truyền dữ liệu khi sống tiếp đời con, sinh đôi và đặt lại tên gọi cho trẻ.
- Đổi thứ tự/cách nối hai họ lúc trưởng thành là hồ sơ chờ sang năm, xem và hoàn tất chủ động, giữ lịch sử và yêu cầu cập nhật giấy tờ theo ID919. Đề nghị dùng hoàn toàn hai họ mẹ không tự được chấp thuận vì muốn tri ân. Hồ sơ xác định chỉ có mẹ có thể được sửa; các hồ sơ khác nhận yêu cầu bổ sung căn cứ. Chưa triển khai điều tra chứng cứ bạo hành hoặc quy trình xét ngoại lệ tư pháp đầy đủ.
- Bản lưu cũ giữ tên nguyên văn, bổ sung cấu trúc có thể phân tích; không bốc lại tên hoặc hồi tố hợp đồng. Hệ thống hoàng gia Tây Ban Nha vẫn dùng SPAIN862.

## Nguồn đối chiếu

Đọc ngày 18/11/2026; các ngưỡng tiền trong game do thiết kế, không lấy làm dữ liệu pháp lý/tài chính.

- AFC, hồ sơ đăng cai Saudi 2027, mục 3.2.1: giải từ 1976 và tổ chức lại năm 2008: https://assets.the-afc.com/migration/a/c/ac-2027-bid-book-saudi-arabia.pdf
- SPL giới thiệu chiến lược đổi mới từ đầu 2023: https://www.spl.com.sa/en/news/about-the-spl
- SPL, danh mục lịch/CLB: https://www.spl.com.sa/en/fixtures-results
- BOE, Ley 40/1999; cho phép cha mẹ thỏa thuận thứ tự họ, hiệu lực 06/02/2000. Dùng mốc năm 2000 do mô hình game theo năm: https://www.boe.es/eli/es/l/1999/11/05/40
- BOE, Ley 20/2011, Điều 49, 53–55: họ đầu của mỗi người, một dòng huyết thống, anh chị em cùng cha mẹ, chữ nối và các thủ tục thay đổi: https://www.boe.es/buscar/act.php?id=BOE-A-2011-12628
- Không diễn giải năm 2017 là lần đầu cho phép đảo họ. Đây là thay đổi về ưu tiên mặc định/thỏa thuận. Không diễn giải Điều 54 là cho phép mọi người tùy ý bỏ họ cha khi đủ 18 tuổi.

## Nghiệm thu

Test chuyên đề: saudi-spain970; regression bóng đá career/897/890/contracts/expiry/payroll/business/world/sponsors/reference; họ tên md4/md4b, spain862/surname871; gia đình family830/129, relationships108, genetics912, heir912; smoke, saves, save-safety, NPC. Kết quả thực tế ghi ở báo cáo cuối; nhóm chưa hoàn tất không tính PASS.

GĐ6 tiếp tục: regression toàn bộ mã cuối; bản lưu thật; toàn bộ mùa bóng Saudi và hạng dưới; thủ tục hộ tịch đầy đủ trước 2000, biến thể vùng/tên của gia đình đa quốc tịch, hồ sơ ngoại lệ có chứng cứ; cấu hình REVIEWS_DB Production. Không deploy trong đợt này.
