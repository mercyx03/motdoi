# Di truyền, sàng lọc và đa thai (8.10.15, mã 912) — nguồn và phần giản lược

**Đây là mô phỏng trò chơi, không phải công cụ chẩn đoán hay tư vấn y khoa.** Mọi con số trong `public/js/genetics912.js` là **tham số gameplay** lấy cảm hứng từ các nguồn dưới đây. Ngày truy cập: 01/11/2026.

## Nguồn đã đọc
| Nội dung | Nguồn | Điều lấy ra |
|---|---|---|
| Tan máu β | MedlinePlus Genetics — Beta thalassemia, https://medlineplus.gov/genetics/condition/beta-thalassemia/ | Lặn NST thường (HBB); phổ biến ở Địa Trung Hải, Bắc Phi, Trung Đông, Ấn Độ, Trung Á, Đông Nam Á |
| Người mang gen thalassemia ở Việt Nam | Tổng quan "Thalassemia in Viet Nam", Hemoglobin 2022, https://pubmed.ncbi.nlm.nih.gov/35950578/ ; nghiên cứu 5.880 thai phụ 2022 (trích trong tìm kiếm) | ~13,8% mang gen (điều tra quốc gia 2017, trích thứ cấp); thai phụ: 7,82% α, 5,31% β |
| G6PD | MedlinePlus — G6PD deficiency, https://medlineplus.gov/genetics/condition/glucose-6-phosphate-dehydrogenase-deficiency/ ; các nghiên cứu vùng ở Việt Nam (Tropical Medicine and Health 2009, https://www.jstage.jst.go.jp/article/tmh/37/1/37_2008-26/_article/-char/en ; sàng lọc sơ sinh Cần Thơ) | Liên kết X; ~1/10 nam người Mỹ gốc Phi; nam Kinh ~0,5–1,3%, một số nhóm dân tộc cao hơn nhiều |
| Hemophilia | MedlinePlus — Hemophilia, https://medlineplus.gov/genetics/condition/hemophilia/ | Liên kết X lặn; hemophilia A 1/4.000–1/5.000 bé trai |
| Bạch tạng da–mắt | MedlinePlus — Oculocutaneous albinism, https://medlineplus.gov/genetics/condition/oculocutaneous-albinism/ | Lặn NST thường; 1/4.000–7.000 (châu Phi), 1/12.000–15.000 (châu Âu) |
| PKU | MedlinePlus — Phenylketonuria, https://medlineplus.gov/genetics/condition/phenylketonuria/ | Lặn NST thường; Mỹ 1/25.000; phần lớn phát hiện nhờ sàng lọc sơ sinh và điều trị sớm |
| Wilson | MedlinePlus — Wilson disease, https://medlineplus.gov/genetics/condition/wilson-disease/ | Lặn NST thường; ~1/30.000 |
| SMA | MedlinePlus — Spinal muscular atrophy, https://medlineplus.gov/genetics/condition/spinal-muscular-atrophy/ ; J Mol Diagn 2011 (PMC3069864) | Lặn NST thường; 1/8.000–10.000; type I ~một nửa, khởi phát vài tháng đầu, phần lớn không qua tuổi thơ sớm nếu không điều trị; type II 6–12 tháng; type III sau tuổi thơ sớm, tuổi thọ thường bình thường; người mang gen ~1/50 (1/38–1/70) |
| Xơ nang | MedlinePlus — Cystic fibrosis, https://medlineplus.gov/genetics/condition/cystic-fibrosis/ | Lặn NST thường; 1/2.500–3.500 (người da trắng ở Mỹ), 1/17.000 (Mỹ gốc Phi), 1/31.000 (Mỹ gốc Á) |
| Hội chứng Down | MedlinePlus — Down syndrome, https://medlineplus.gov/genetics/condition/down-syndrome/ ; bảng theo tuổi mẹ GFMER (trích Thompson et al.), https://www.gfmer.ch/Books/Reproductive_health/Chromosome_Table1.htm | ~1/700; tăng theo tuổi mẹ; đa số không di truyền; ~một nửa có dị tật tim; khuyết tật trí tuệ thường nhẹ–vừa. Mốc khi sinh: 25–29: 1/1.100; 30: 1/900; 35: 1/350; 40: 1/100; ≥45: 1/25 |
| Sinh đôi | PLoS ONE 2011 (PMC3182188); Human Reproduction (qua tin tổng hợp) | Cùng trứng ~3,5–4‰ mọi nơi; khác trứng thay đổi mạnh (Nhật ~6‰, Trung Phi 18–30‰; Đông Nam Á, Nam Á thấp); toàn cầu ~12‰ |
| Khuyến nghị sàng lọc người mang gen SMA | ACMG (trích trong tài liệu phòng xét nghiệm) | Đề nghị sàng lọc trước/đầu thai kỳ cho mọi người |

## Tham số gameplay và mức tin cậy
- Tần suất alen theo nhóm dân cư (suy ra từ nhóm tên `pool` của quốc gia): xem bảng `Q`. **Đã đối chiếu** bằng mô phỏng 200.000–400.000 ca sinh/nhóm: SMA ≈1/11.000; xơ nang châu Âu ≈1/3.200, châu Á ≈1/33.000; PKU châu Âu/Mỹ ≈1/25.000; Wilson ≈1/30.000; bạch tạng châu Phi ≈1/4.650, châu Âu ≈1/11.000; hemophilia A ≈1/4.100 bé trai; G6PD nam Đông Nam Á 1%, châu Phi 10%; Down ≈1/925 ở tuổi mẹ 28.
- **Chưa xác minh theo từng nước** (ước lượng): PKU ở Đông Nam Á (để thấp), tan máu ngoài Đông Nam Á, G6PD ở Nam Á/Trung Đông/Đông Á, xơ nang ở Trung Đông. Không có số riêng cho từng dân tộc Việt Nam (đã biết là chênh lệch rất lớn).
- Tỷ lệ phát hiện theo kỹ thuật xét nghiệm (bảng `TESTS.det`) và tỷ lệ "biến thể chưa rõ ý nghĩa" là tham số gameplay thể hiện **giới hạn định tính** (exome không phát hiện tốt mất đoạn SMN1, mất đoạn gen α-globin, đảo đoạn intron 22 của F8; WGS tốt hơn nhưng không tuyệt đối). Không có con số "WES tìm được 85% mọi bệnh".
- Tử vong, chi phí, mức ảnh hưởng sức khỏe của từng tình trạng (`COND`) là tham số gameplay, không phải tiên lượng y khoa.

## Giản lược có chủ đích
- Tan máu α: một locus lặn, không tách α+/α0, không mô hình HbH riêng hay phù thai Bart's.
- Liên kết X: nữ dị hợp không biểu hiện (thực tế một số người có triệu chứng do bất hoạt X lệch).
- Trisomy 21 không di truyền trong mô hình (thể chuyển đoạn di truyền chưa có). Liên kết Y và ty thể: kiến trúc cho phép nhưng chưa thêm bệnh vì chưa đủ căn cứ cho cơ chế gameplay.
- Nhân vật chính chỉ có tình trạng bệnh di truyền khi thừa hưởng từ đời cha/mẹ (sống tiếp đời con); nhân vật mới và con sinh trước bản này chỉ là người mang gen — để không reroll bản lưu cũ.
- Nhóm máu ABO của trẻ sinh đôi do hệ hiến máu (blood910) tính riêng; có thể chưa khớp kiểu gen giữa hai trẻ khác trứng trong một số đường sinh.

## 8.10.16 — Bệnh mắc phải, ung thư, phát triển trẻ (`public/js/health915.js`)
| Nội dung | Nguồn | Điều lấy ra |
|---|---|---|
| Sống còn theo giai đoạn | SEER Cancer Stat Facts (https://seer.cancer.gov/statfacts/html/colorect.html, .../lungb.html, .../breast.html) | Khu trú sống còn 5 năm cao (đại trực tràng 91%), di căn xa thấp (phổi 10,5%, vú 33,8%) |
| Hóa trị, tác dụng phụ | NCI — Chemotherapy to Treat Cancer (https://www.cancer.gov/about-cancer/treatment/types/chemotherapy); SEER training | Tổn thương tế bào phân chia nhanh gây rụng tóc ở "nhiều" chứ không phải tất cả bệnh nhân; tóc mọc lại sau khi ngừng |
| Buồng truyền | NCI — Chemotherapy and You (https://www.cancer.gov/publications/patient-education/chemotherapy-and-you.pdf); tổng quan biến chứng (PMC4588233) | Đặt dưới da qua thủ thuật nhỏ; nhiễm trùng là biến chứng thường gặp nhất, ngoài ra huyết khối, tắc |
| Lao | Cochrane CD001362; Sci Rep 2021 (PMC8295390) | Phác đồ ít nhất 6 tháng cho tỷ lệ thành công cao hơn; ~82% thành công sau 6 tháng trong một nghiên cứu lớn |
| Lupus | Ước tính CDC National Lupus Registry (~72,8/100.000 ở Mỹ) | Hiếm, nữ nhiều hơn nam |
| Mất ngủ | NHIS (PMC4763609); tổng quan toàn cầu 2025 (PubMed 40627924) | ~16–19% người lớn |
| Tự kỷ | CDC ADDM, MMWR 74(SS-2), 2025 (https://www.cdc.gov/autism/data-research/index.html) | ~1/31 trẻ 8 tuổi (Mỹ, 2022), nam hơn 3 lần nữ; khác nhau theo địa phương |
| ADHD | CDC (MMWR 2019; NSCH 2022 qua tin tổng hợp) | ~8,8–11,4% từng được chẩn đoán; nam nhiều hơn nữ |

Tham số gameplay: nguy cơ tử vong do ung thư theo giai đoạn (`HAZ`), hệ số thuyên giảm (`STAGE`), tái phát (`RELAPSE`), tác dụng phụ, biến chứng buồng truyền 4%/năm, lupus, mất ngủ, tỷ lệ các đặc điểm phát triển (`DEV`) — **đều là tham số trò chơi**. Chưa xác minh: tỷ lệ lo âu, OCD, khuyết tật trí tuệ, chậm ngôn ngữ/vận động ở trẻ (ước lượng); chương trình hiến tóc trong game là **hư cấu**; chính sách tạm hoãn hiến máu (12 tháng sau truyền máu; trong lúc điều trị/5 năm theo dõi sau ung thư) là **đơn giản hóa của game**, không phải quy định chung.

Kết quả mô phỏng (150 người/ô, ung thư đại trực tràng, sống sau 5 năm · thuyên giảm):

```
tuổi 40 · I   · điều trị đầy đủ : sống sau 5 năm 98% · thuyên giảm 94%
tuổi 40 · I   · không điều trị  : sống sau 5 năm 97% · thuyên giảm 58%
tuổi 40 · II  · điều trị đầy đủ : sống sau 5 năm 95% · thuyên giảm 89%
tuổi 40 · II  · không điều trị  : sống sau 5 năm 77% · thuyên giảm 37%
tuổi 40 · III · điều trị đầy đủ : sống sau 5 năm 91% · thuyên giảm 81%
tuổi 40 · III · không điều trị  : sống sau 5 năm 68% · thuyên giảm 25%
tuổi 40 · IV  · điều trị đầy đủ : sống sau 5 năm 67% · thuyên giảm 51%
tuổi 40 · IV  · không điều trị  : sống sau 5 năm 15% · thuyên giảm 5%
tuổi 75 · I   · điều trị đầy đủ : sống sau 5 năm 89% · thuyên giảm 91%
tuổi 75 · I   · không điều trị  : sống sau 5 năm 88% · thuyên giảm 51%
tuổi 75 · II  · điều trị đầy đủ : sống sau 5 năm 89% · thuyên giảm 87%
tuổi 75 · II  · không điều trị  : sống sau 5 năm 79% · thuyên giảm 31%
tuổi 75 · III · điều trị đầy đủ : sống sau 5 năm 88% · thuyên giảm 83%
tuổi 75 · III · không điều trị  : sống sau 5 năm 52% · thuyên giảm 14%
tuổi 75 · IV  · điều trị đầy đủ : sống sau 5 năm 56% · thuyên giảm 44%
tuổi 75 · IV  · không điều trị  : sống sau 5 năm 11% · thuyên giảm 5%
```
Toàn đời (400 đời VN tự chơi): tuổi chết trung bình 72,9 → 71,8; số ca được ghi "chết do ung thư" 100 → 126 (engine ghi nguyên nhân là bệnh đang mang trong 75% ca tử vong, nên con số này bao gồm cả người sống chung với ung thư). Giai đoạn IV có điều trị ở người 40 tuổi (67%) cao hơn số liệu SEER đại trực tràng di căn xa — chủ dự án có thể tăng `HAZ.IV` nếu muốn khắc nghiệt hơn.

## Chưa làm trong §11
- Suy gan/suy thận như chuỗi riêng (hiện vẫn là bệnh mạn trong bảng `ILLS`; lupus ghi biến chứng thận như cờ); bệnh nhiễm trùng khác ngoài lao.
- Chẩn đoán trước sinh / xét nghiệm phôi như chuỗi riêng; nối thai kỳ cho nhánh một đêm với người nổi tiếng.
