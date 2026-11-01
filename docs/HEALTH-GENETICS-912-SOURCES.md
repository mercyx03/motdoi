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

## Chưa làm trong §11
- 11.4 bệnh mắc phải (mất ngủ, lao, lupus, suy gan/thận, ung thư theo loại/giai đoạn, hóa trị/xạ trị, buồng truyền, chế phẩm máu theo chỉ định, hiến tóc).
- 11.5 phát triển trẻ và sức khỏe tâm thần (tự kỷ, ADHD, chậm phát triển, khuyết tật trí tuệ, lo âu, OCD).
- Chẩn đoán trước sinh / xét nghiệm phôi như một chuỗi gameplay riêng (hiện chỉ có trong lời tư vấn).
