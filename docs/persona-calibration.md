# Đối chiếu mô phỏng với Nemotron-Personas-Vietnam

Tạo bằng `node tools/persona-calibration.js` ngày 2026-10-19. Game: 600 đời Việt Nam, lấy mẫu mỗi 3 năm từ 18 tuổi. Dữ liệu: 1000000 persona (NVIDIA & FPT, CC BY 4.0).

## Học vấn

| Nhóm tuổi | Không có học vấn | Tiểu học | Trung học cơ sở | Trung học phổ thông | Trung cấp / Cao đẳng | Đại học | Sau đại học |
|---|---|---|---|---|---|---|---|
| 18–29 | 1% / 1% | 5% / 2% | 9% / 10% | 35% / 52% | 21% / 17% | 25% / 16% | 3% / 2% |
| 30–44 | 1% / 3% | 5% / 6% | 8% / 21% | 19% / 27% | 25% / 21% | 30% / 20% | 11% / 3% |
| 45–59 | 1% / 5% | 5% / 11% | 8% / 27% | 19% / 26% | 25% / 17% | 29% / 14% | 12% / 2% |
| 60+ | 1% / 10% | 4% / 19% | 8% / 29% | 18% / 23% | 25% / 10% | 30% / 8% | 13% / 1% |

(mỗi ô: game / dữ liệu)

## Tình trạng hôn nhân

| Nhóm tuổi | Độc thân | Đã kết hôn | Ly hôn | Góa |
|---|---|---|---|---|
| 18–29 | 72% / 58% | 27% / 41% | 1% / 1% | 0% / 0% |
| 30–44 | 20% / 12% | 74% / 83% | 4% / 3% | 1% / 1% |
| 45–59 | 7% / 6% | 77% / 87% | 9% / 3% | 7% / 4% |
| 60+ | 9% / 8% | 46% / 62% | 12% / 2% | 33% / 28% |

(mỗi ô: game / dữ liệu)

## Chênh lệch từ 15 điểm phần trăm trở lên

- Học vấn, 18–29, Trung học phổ thông: game 35% so với dữ liệu 52%
- Học vấn, 45–59, Trung học cơ sở: game 8% so với dữ liệu 27%
- Học vấn, 45–59, Đại học: game 29% so với dữ liệu 14%
- Học vấn, 60+, Trung học cơ sở: game 8% so với dữ liệu 29%
- Học vấn, 60+, Đại học: game 30% so với dữ liệu 8%
- Tình trạng hôn nhân, 60+, Đã kết hôn: game 46% so với dữ liệu 62%

Lưu ý: bộ dữ liệu là persona tổng hợp chỉ từ 18 tuổi, game là mô phỏng nhiều thế hệ trong tương lai (sinh từ 2026), nên một số chênh lệch là hợp lý (ví dụ thế hệ sau học cao hơn).
