# Nguồn dữ liệu văn hóa, con người, lịch sử — Một Đời v6.7.0

## Nemotron-Personas-Vietnam (NVIDIA & FPT)

- Bộ dữ liệu: https://huggingface.co/datasets/nvidia/Nemotron-Personas-Vietnam
- Phát triển bởi NVIDIA Corporation cùng FPT Smart Cloud và Viện Quantum AI & Cyber Security (FPT Corporation).
- Giấy phép: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/ . Game ghi công tại mục Giới thiệu → Nguồn dữ liệu trên trang chủ, nêu rõ dữ liệu đã được chọn lọc, chuyển đổi, điều chỉnh, và NVIDIA cùng các đơn vị phát triển không tài trợ, bảo trợ hay xác nhận trò chơi.
- Quy mô: 1.000.000 persona tổng hợp (synthetic), dựng theo phân bố nhân khẩu học, địa lý của Việt Nam (Niên giám thống kê, số liệu Tổng cục Thống kê theo mô tả của bộ dữ liệu). Các trường gồm vùng kinh tế – xã hội (6 vùng), thành thị / nông thôn, tuổi, giới tính, học vấn, hôn nhân, nghề nghiệp, sở thích, ẩm thực, văn hóa.
- Cách dùng trong game (v6.9): dùng TOÀN BỘ 1.000.000 persona (11 file parquet), đọc bằng `tools/personas-from-parquet.py`, tổng hợp bằng `tools/build-personas.js`: tần suất nghề nghiệp, sở thích, thể thao, nơi du lịch, văn nghệ, món ăn, lễ hội theo vùng × thành thị / nông thôn × nhóm tuổi và theo 34 tỉnh, thành (dựa vào địa danh được nhắc trong mô tả persona); kỹ năng và mục tiêu theo nghề; học vấn, hôn nhân theo vùng / tuổi. Kết quả ghi vào `public/js/data-personas-vn.js`. Game không chép nguyên văn persona nào. Món đặc trưng theo tỉnh lấy theo danh sách đặc sản đã được biết rộng rãi, dữ liệu persona chỉ dùng để xếp thứ tự.
- Đối chiếu mô phỏng: `tools/persona-calibration.js` → `docs/persona-calibration.md`.
- Lưu ý: đây là dữ liệu tổng hợp. Game chỉ dùng như phân bố tham khảo cho người quen, thú vui, món quê, không coi là sự thật về một người hay địa phương cụ thể.

## Di sản văn hóa phi vật thể được UNESCO ghi danh

Gồm 16 di sản: Nhã nhạc Cung đình Huế (2003); Không gian văn hóa Cồng chiêng Tây Nguyên (2005); Dân ca Quan họ Bắc Ninh (2009); Ca trù (2009); Hội Gióng ở đền Phù Đổng và đền Sóc (2010); Hát Xoan Phú Thọ (2011, chuyển sang danh sách đại diện 2017); Tín ngưỡng thờ cúng Hùng Vương (2012); Đờn ca tài tử Nam Bộ (2013); Ví, Giặm Nghệ Tĩnh (2014); Nghi lễ và trò chơi kéo co (2015); Thờ Mẫu Tam phủ (2016); Bài chòi Trung Bộ (2017); Thực hành Then của người Tày, Nùng, Thái (2019); Nghệ thuật Xòe Thái (2021); Nghệ thuật làm gốm của người Chăm (2022); Lễ hội Vía Bà Chúa Xứ núi Sam (2024).

- Danh mục UNESCO: https://ich.unesco.org/en/state/viet-nam-VN
- Tổng hợp: https://baolaocai.vn/16-di-san-van-hoa-phi-vat-the-cua-viet-nam-duoc-unesco-ghi-danh-post394379.html

## Lịch sử

Game chỉ dùng các mốc đã được ghi nhận chính thức trong sách giáo khoa Lịch sử Việt Nam, không thêm diễn giải chính trị:

- 938 trận Bạch Đằng (Ngô Quyền); 1077 phòng tuyến sông Như Nguyệt (Lý Thường Kiệt); 1288 trận Bạch Đằng (Trần Hưng Đạo).
- 1428 khởi nghĩa Lam Sơn thắng lợi, "Bình Ngô đại cáo"; 1789 chiến thắng Ngọc Hồi – Đống Đa (Quang Trung).
- 2/9/1945 Tuyên ngôn Độc lập; 7/5/1954 chiến thắng Điện Biên Phủ; 30/4/1975 giải phóng miền Nam, thống nhất đất nước.
- 1986 Đại hội VI khởi xướng Đổi mới; 1995 gia nhập ASEAN; 2007 gia nhập WTO.
- 1/7/2025: sắp xếp còn 34 tỉnh, thành phố, chính quyền địa phương hai cấp (Nghị quyết 202/2025/QH15).

## Pháp luật dùng trong sự kiện

- Bộ luật Lao động 2019: Điều 112 (nghỉ lễ, tết: Tết Dương lịch 1 ngày, Tết Âm lịch 5 ngày, 30/4 1 ngày, 1/5 1 ngày, Quốc khánh 2 ngày, Giỗ Tổ Hùng Vương 1 ngày); Điều 98 (làm việc ngày lễ được trả ít nhất 300%, chưa kể tiền lương ngày lễ).
- Luật Bầu cử đại biểu Quốc hội và đại biểu Hội đồng nhân dân 2015, Điều 69: cử tri phải tự mình đi bầu, không được nhờ người khác bầu thay (trừ trường hợp không tự viết được phiếu, khuyết tật, ốm đau theo khoản 3, 4).
- Ngày Thương binh – Liệt sĩ 27/7.

## Trích dẫn Nemotron-Personas-Vietnam (theo thẻ dữ liệu)

```
@software{nvidia/Nemotron-Personas-Vietnam,
  author = {Thanh-Tung, Hoang and Hoang, Tuan-Anh and Le-Dinh, Duy and Nguyen, Thuy-Duong and Le, Van and Tran, Quan Minh and Tong, Vu and Nguyen, Que and Juluru, Nirmal Kumar and Prayaga, Shyamala and Sharabiani, Ashton and Acharya, Evan and Sadeghi, Bardiya and Jennings, Will and Praveen, Kiran and Corneil, Dane and Meyer, Yev},
  title = {Nemotron-Personas-Vietnam: Synthetic Personas Aligned to Real-World Distributions for Vietnam},
  month = {October},
  year = {2026},
  url = {https://huggingface.co/datasets/nvidia/Nemotron-Personas-Vietnam}
}
```
