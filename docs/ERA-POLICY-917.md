# Chính sách theo thời đại — bảng xuất xứ (8.10.19, `public/js/era917.js`)

Ngày soạn: 01/11/2026 (UTC+7). Bảng này ghi nguồn cho từng chính sách trong `E.ERA917.POLICIES`.

**Giới hạn kiểm chứng:** trong đợt này nguồn được lấy từ hiểu biết đã có về văn bản pháp luật và từ danh sách nguồn đầu mối của PROMPT (mục C1). Chưa mở lại được từng URL để đọc nguyên văn hay xác nhận văn bản còn hiệu lực. Vì vậy lớp `verified` ở đây có nghĩa là "quy định đã ban hành, có căn cứ văn bản cụ thể", chưa có nghĩa là "đã đọc lại nguồn gốc trong đợt này". Mục nào cần đọc lại có ghi ở cột cuối.

| ID | Lớp | Lĩnh vực | Căn cứ | Hiệu lực trong game | Giản lược trong game | Cần đọc lại / chưa xác minh |
|---|---|---|---|---|---|---|
| vn_retire_2019 | verified | Hưu trí | Bộ luật Lao động 2019 Điều 169; NĐ 135/2020/NĐ-CP | 2021→ | Tháng lẻ làm tròn lên năm tuổi kế tiếp (engine theo năm); chỉ áp cho nghề không có thang quân hàm/công an (`ladder`) đang dùng 62/60 | Ngoại lệ (lao động nặng nhọc, suy giảm khả năng lao động) chưa mô hình |
| vn_si_rates | verified | Bảo hiểm | Luật BHXH, BHYT, Việc làm | 2016→ | Chỉ hiển thị; tỷ lệ đóng thực tính ở hệ BHXH sẵn có | Luật BHXH 2024 thay đổi một số đối tượng; chưa rà |
| vn_pit_2026 | verified | Thuế | NQ UBTVQH về giảm trừ gia cảnh từ kỳ tính thuế 2026 | 2026→ | `tax-resident.js` đã dùng 15,5/6,2 triệu | Mốc trước 2026 (11/4,4 triệu) chưa áp cho đời sinh sớm |
| vn_maternity | verified | Thai sản | Luật BHXH 2024 (hiệu lực 01/7/2025) | 2025→ | Trợ cấp một lần 2 × 2,34 triệu; nghỉ 6 tháng hưởng **thay** lương (không cộng thêm tiền); cha nghỉ 5–14 ngày ghi nhận gắn bó | Điều kiện số tháng đóng trước sinh rút gọn thành "đang đóng BHXH năm trước"; mức tham chiếu sau 2,34 triệu chưa xác minh |
| vn_unemployment | verified | Thất nghiệp | Luật Việc làm 2013 Đ49–50; NĐ 74/2024/NĐ-CP | 2015→ | Trần 5 × lương tối thiểu vùng (thành thị vùng I 4,96; nông thôn vùng III 3,86 triệu) áp vào `life3.js` | Vùng II/IV chưa gán theo địa bàn; Luật Việc làm 2025 chưa rà |
| vn_tuition_2025 | verified | Giáo dục | NQ 217/2025/QH15 | 2025→ | Chỉ hiển thị | Chưa nối với chi phí học trong game (học phí công lập trong game là khoản gói học tự chọn) |
| vn_blood_age | verified | Hiến máu | Bộ Y tế — vncdc.gov.vn (nguồn 9 của PROMPT) | 2017→ | Giữ 18–60 như `blood-donation.js` | Chưa đọc lại nguồn |
| vn_citizenship | verified | Quốc tịch | Luật Quốc tịch 2008 (sđ 2014) Đ15–17 | 2009→ | Sinh ở VN có cha/mẹ VN → VN; sinh ngoài VN với cha/mẹ nước ngoài → cần thỏa thuận (đăng ký trong mục) | Các nước khác: danh sách nước áp dụng nơi sinh rộng (`SOLI`) là **chưa xác minh**, mỗi dòng ghi "quy tắc nước này chưa xác minh chi tiết" |
| vn_passport_child | verified | Giấy tờ | Luật XNC của công dân VN 2019; TT 25/2021/TT-BTC | 2020→ | Dưới 14 tuổi hạn 5 năm, từ 14 tuổi 10 năm; lệ phí 0,2 triệu; cấp năm sau | Hộ chiếu nước ngoài dùng phí giả lập 1,5% thu nhập cơ sở |
| vn_ageing_proj | projection | Dân số | Dự báo dân số VN 2024–2074 (phương án trung bình) | 2024–2074 | Chỉ hiển thị | — |
| sim_retire_up | simulated | Hưu trí | Kịch bản Cải cách thận trọng | năm băm 2042–2050 | +3 tháng/năm đến 63/62 | Giả định của game |
| sim_child_allowance | simulated | Gia đình | Kịch bản An sinh mở rộng | năm băm 2032–2040 | 0,5 triệu/tháng mỗi trẻ dưới 6 tuổi đang ở VN, mỗi năm trả một lần | Giả định của game |
| sim_father_leave | simulated | Thai sản | Kịch bản An sinh mở rộng | năm băm 2032–2040 | Cha nghỉ 1 tháng: gắn bó với con +4 thay vì +1 | Giả định của game |
| sim_blood_65 | simulated | Hiến máu | Kịch bản An sinh mở rộng | năm băm 2040–2048 | Người đã hiến ≥3 lần, sức khỏe ≥70: đến 65 tuổi | Giả định của game |

## Nguyên tắc đã áp

- Năm thế giới = `birthYear + age`. Kịch bản mặc định **Cân bằng** không bật chính sách giả định nào; chọn kịch bản một lần cho cả đời; năm hiệu lực của chính sách giả định được băm theo `l.id`, lưu vào `l.flags.era917.eff` nên tải lại bản lưu không đổi kết quả.
- Chỉ số giá và lương (CPI 2,5–4,5%/năm, lương thực tăng 1,5–3,5%/năm, tích lũy từng năm) chỉ để quy đổi tham khảo; tiền, nợ, tài sản trong game không bị nhân lên.
- Bản lưu trước 8.10.19: con đã sinh được đánh dấu `mat917.legacy` (chỉ một lần, theo cờ `era917v`), không truy lĩnh trợ cấp; con cũ giữ quốc tịch như trước, nơi sinh ghi "chưa ghi nhận".

## Chưa làm trong Phần C (ghi rõ để không báo nhầm là xong)

- C3 ngân sách hộ gia đình (thiết yếu/tùy chọn, quỹ khẩn cấp) và lương công vụ theo chỉ số: chưa làm — game giữ mặt bằng giá cố định.
- C4 tách bảng lương gộp → thực nhận theo từng quỹ, BHNT, quỹ hưu trí tự nguyện: chưa làm (mục Thuế tiền lương sẵn có vẫn là nơi tính).
- C5 nghỉ ốm, đào tạo lại, giờ làm/tăng ca, thực tập, người khuyết tật: chưa làm.
- C6 nhà ở xã hội, vay sinh viên, y tế trẻ em mở rộng: chưa làm.
- C7 giao thông, thuế xe, ưu đãi chi phí doanh nghiệp: chưa làm.
- C9 visa du lịch theo hộ chiếu, du lịch cùng trẻ: chưa làm (hệ visa du học/cư trú sẵn có không đổi).
- C10 bồi dưỡng hiến máu theo đề xuất người dùng: không hardcode (chưa là quy định đã xác minh).
- C11 tích hợp drama với thời đại: chưa có biến cố gắn trực tiếp với chính sách (ví dụ chờ nhà ở xã hội).
