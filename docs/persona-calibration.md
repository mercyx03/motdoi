# Đối chiếu mô phỏng với Nemotron-Personas-Vietnam

Tạo bằng `node tools/persona-calibration.js` ngày 2026-10-19. Game: 600 đời Việt Nam, lấy mẫu mỗi 3 năm từ 18 tuổi. Dữ liệu: 181819 persona (NVIDIA & FPT, CC BY 4.0).

## Học vấn

| Nhóm tuổi | Không có học vấn | Tiểu học | Trung học cơ sở | Trung học phổ thông | Trung cấp / Cao đẳng | Đại học | Sau đại học |
|---|---|---|---|---|---|---|---|
| 18–29 | 1% / 1% | 5% / 2% | 9% / 10% | 35% / 53% | 21% / 17% | 25% / 16% | 3% / 2% |
| 30–44 | 1% / 3% | 5% / 6% | 8% / 21% | 19% / 27% | 25% / 21% | 30% / 20% | 11% / 3% |
| 45–59 | 1% / 5% | 5% / 11% | 8% / 26% | 19% / 26% | 24% / 17% | 30% / 14% | 12% / 2% |
| 60+ | 1% / 10% | 5% / 19% | 8% / 29% | 20% / 22% | 24% / 10% | 31% / 9% | 12% / 1% |

(mỗi ô: game / dữ liệu)

## Tình trạng hôn nhân

| Nhóm tuổi | Độc thân | Đã kết hôn | Ly hôn | Góa |
|---|---|---|---|---|
| 18–29 | 72% / 57% | 27% / 41% | 1% / 1% | 0% / 0% |
| 30–44 | 21% / 12% | 73% / 84% | 5% / 3% | 2% / 1% |
| 45–59 | 6% / 6% | 76% / 86% | 11% / 3% | 7% / 4% |
| 60+ | 8% / 8% | 45% / 62% | 12% / 2% | 34% / 28% |

(mỗi ô: game / dữ liệu)

## Chênh lệch từ 15 điểm phần trăm trở lên

- Học vấn, 18–29, Trung học phổ thông: game 35% so với dữ liệu 53%
- Học vấn, 45–59, Trung học cơ sở: game 8% so với dữ liệu 26%
- Học vấn, 45–59, Đại học: game 30% so với dữ liệu 14%
- Học vấn, 60+, Trung học cơ sở: game 8% so với dữ liệu 29%
- Học vấn, 60+, Đại học: game 31% so với dữ liệu 9%
- Tình trạng hôn nhân, 60+, Đã kết hôn: game 45% so với dữ liệu 62%

Lưu ý: bộ dữ liệu là persona tổng hợp chỉ từ 18 tuổi, game là mô phỏng nhiều thế hệ trong tương lai (sinh từ 2026), nên một số chênh lệch là hợp lý (ví dụ thế hệ sau học cao hơn).
