# Chính sách theo thời đại — bảng xuất xứ và kiểm chứng (cập nhật 8.10.20)

Áp dụng cho `E.ERA917.POLICIES` (`public/js/era917.js`) và các cơ chế dùng chúng trong `econ918.js`, `travel918.js`, `life3.js`, `blood-donation.js`.

## Cách đọc mức kiểm chứng

Ngày đối chiếu: 02/11/2026 (UTC+7). Mỗi chính sách đã ban hành có trường `ver`, hiển thị trong game:

| `ver` | Nhãn trong game | Nghĩa |
|---|---|---|
| `official` | Đã xác minh (nguồn chính thức) | Đã mở và đọc trang của cơ quan nhà nước (chinhphu.vn / xaydungchinhsach.chinhphu.vn) trong đợt này |
| `secondary` | Đã ban hành (mới đối chiếu nguồn thứ cấp) | Văn bản có thật, số liệu khớp giữa nhiều nguồn (báo chí, cổng tỉnh, trang luật), nhưng chưa đọc nguyên văn văn bản gốc |
| `unread` | Đã ban hành (chưa đọc lại nguồn) | Chưa đọc lại trong đợt này |

Không chính sách nào được gắn "Đã xác minh" chỉ vì có tên văn bản. Mục `check` của từng chính sách (hiện trong game sau chữ "Chưa xác minh:") ghi phần còn nghi vấn.

## Bảng

| ID | Lớp / mức | Nội dung dùng trong game | Nguồn đã đọc | Hiệu lực | Chưa xác minh / giản lược |
|---|---|---|---|---|---|
| vn_retire_2019 | verified / official | Nam 62 tuổi từ 2028, nữ 60 tuổi từ 2035; nam +3 tháng/năm, nữ +4 tháng/năm | [xaydungchinhsach.chinhphu.vn — tra cứu tuổi nghỉ hưu](https://xaydungchinhsach.chinhphu.vn/tra-cuu-tuoi-nghi-huu-thoi-diem-nghi-huu-cua-nguoi-lao-dong-theo-nam-sinh-119241029170451525.htm) (BLLĐ 2019 Đ169; NĐ 135/2020 k2 Đ4) | 2021→ | Bảng của trang khớp công thức game (vd. nữ 2028 = 57 tuổi 8 tháng). Engine theo năm: tháng lẻ làm tròn lên. Ngoại lệ lao động nặng nhọc chưa mô hình |
| vn_pit_2026 | verified / official | Giảm trừ 15,5 triệu/tháng bản thân, 6,2 triệu/người phụ thuộc | [xaydungchinhsach.chinhphu.vn — giảm trừ gia cảnh](https://xaydungchinhsach.chinhphu.vn/quy-dinh-giam-tru-gia-canh-119260703144038062.htm) | — | **Sửa**: căn cứ là Nghị định 253/2026/NĐ-CP (bản trước ghi nhầm "nghị quyết UBTVQH"). Trang không nêu kỳ tính thuế bắt đầu; ngưỡng thu nhập người phụ thuộc do Bộ Tài chính quy định (game giữ 3 triệu) |
| vn_citizenship | verified / official | Một bên cha/mẹ VN: có quốc tịch VN khi thỏa thuận chọn lúc đăng ký khai sinh; sinh ở VN không thỏa thuận được vẫn có quốc tịch VN | [xaydungchinhsach.chinhphu.vn — quốc tịch trẻ em](https://xaydungchinhsach.chinhphu.vn/xac-dinh-quoc-tich-viet-nam-cua-tre-em-sinh-ra-co-cha-hoac-me-la-cong-dan-viet-nam-con-nguoi-kia-la-cong-dan-nuoc-ngoai-119250712063445326.htm) (k2 Đ16 Luật Quốc tịch; NĐ 191/2025) | — | Luật Quốc tịch sửa đổi 2025 chưa đọc nguyên văn. Quy tắc quốc tịch nước khác (danh sách nơi sinh `SOLI`) chưa xác minh, game ghi rõ trên màn |
| vn_maternity | verified / secondary | Trợ cấp một lần = 2 × mức tham chiếu tại tháng sinh; mức tham chiếu = lương cơ sở 2,34 triệu, **2,53 triệu từ 01/7/2026** | Khoản 4 Đ58, k13 Đ141 Luật BHXH 2024 (thuvienphapluat, luatvietnam); NĐ 161/2026 (hatinh.gov.vn, tapchicongthuong.vn) | 01/7/2025→ | **Sửa**: thêm mức 2,53 triệu từ 7/2026 (trước chỉ dùng 2,34). Tháng sinh năm 2026 băm theo nhân vật. Số ngày nghỉ của cha theo nguồn thứ cấp |
| vn_unemployment | verified / secondary | 60% bình quân 6 tháng; trần 5 × lương tối thiểu vùng; 3 tháng cho 12 tháng đầu, +1 tháng mỗi 12 tháng, tối đa 12 | Luật Việc làm 2025 số 74/2025/QH15 Đ37–39 (hiệu lực 01/01/2026; baolaocai, lsvn, luatvietnam); NĐ 293/2025 lương tối thiểu vùng (hatinh.gov.vn, baophapluat) | 2015→; luật mới 2026→ | **Sửa**: lương tối thiểu vùng 2026 là I 5,31 / II 4,73 / III 4,14 / IV 3,70 triệu (bản trước dùng mức 2024: 4,96/4,41/3,86/3,45). Game gán thành thị = vùng I, nông thôn = vùng III. Cách diễn đạt trần trong luật 2025 chưa đọc nguyên văn |
| vn_tuition_2025 | verified / secondary | Miễn học phí mầm non, phổ thông công lập từ năm học 2025–2026 | NQ 217/2025/QH15 (cổng pbgdpl.cantho.gov.vn, baolaocai, luatvietnam); NĐ 238/2025 | 2025→ | Chỉ hiển thị; chưa nối chi phí học của game |
| vn_blood_age | verified / secondary | Người hiến 18–60 tuổi | TT 26/2013/TT-BYT Đ4 (dẫn qua trang y khoa/luật). Trang vncdc.gov.vn: **lỗi kết nối (ECONNRESET) ngày 02/11/2026** | — | Chưa xác nhận thông tư còn hiệu lực. Mốc cân nặng 42/45 kg, khoảng cách 12 tuần chưa dùng trong game ngoài phần blood-donation sẵn có |
| vn_passport_child | verified / secondary | Dưới 14 tuổi hạn 5 năm, không gia hạn; từ 14 tuổi 10 năm | Luật XNC 2019 (thuvienphapluat, hoatieu) | — | Lệ phí 200.000 đ theo một nguồn; nguồn khác ghi 180.000 đ — chưa xác minh |
| vn_social_housing | verified / secondary | Chưa có nhà; thu nhập ≤ 20 triệu (độc thân) / 40 triệu (vợ chồng); vay NHCSXH 5,4%/năm | NĐ 261/2025/NĐ-CP sửa NĐ 100/2024 (hatinh.gov.vn, luatvietnam, voh) | 10/10/2025→ | Hệ số địa phương, thứ tự ưu tiên, thời hạn cấm bán (game dùng 5 năm) chưa đọc nguyên văn |
| vn_sick_leave | verified / secondary | 75% tiền lương đóng BHXH; ngày = tháng/24; 30/40/60 ngày theo số năm đóng | Luật BHXH 2024 Đ43–45 (thuvienphapluat, lsvn) | 01/7/2025→ | Các nguồn không thống nhất mốc ngày; 30/40/60 là giả định gần nhất, chưa đối chiếu nguyên văn Đ43 |
| vn_cit_2025 | verified / secondary | TNDN 20%; doanh thu năm trước < 3 tỷ: 15%; 3–50 tỷ: 17% | Luật Thuế TNDN 67/2025/QH15 Đ10; TT 20/2026/TT-BTC (misa, gvlawyers) | kỳ tính thuế 2025→ | Chỉ là bảng ước tính: sổ tiền game chưa thu riêng thuế TNDN |
| vn_hanoi_lez | verified / secondary | Thí điểm vùng phát thải thấp từ 01/7/2026 (phố cổ – Hoàn Kiếm, theo khung giờ); kế hoạch toàn Vành đai 1 từ 2028, Vành đai 3 từ 2030 | Chỉ thị 20/CT-TTg (12/7/2025); báo chí 7/2026 (vietnamnet, vov, lsvn) | 2026→ | Phạm vi giai đoạn 1 các nguồn mâu thuẫn; mốc 2028/2030 là kế hoạch |
| vn_si_rates | verified / unread | NLĐ đóng BHXH 8%, BHYT 1,5%, BHTN 1%; đơn vị đóng 17,5% / 3% / 1% (hiển thị trên phiếu lương) | — | — | Chưa đọc lại; tỷ lệ phần đơn vị chỉ để hiển thị |
| vn_ageing_proj | projection / unread | 65+ đạt khoảng 14% quanh 2034 | Dự báo dân số 2024–2074 (nso.gov.vn) | — | Chưa đọc lại; chỉ hiển thị |
| Miễn thị thực ASEAN (travel918) | — / chưa xác minh | TH, SG, MY, PH, KH, LA, MM, BN miễn thị thực ngắn ngày | Trang đại lý vé và công ty luật (vietnambooking, congtyluatacc) | — | **Chưa xác minh**: các nguồn mâu thuẫn (Indonesia, số ngày Singapore). Game ghi rõ "nguồn thứ cấp" trên màn |

## Kịch bản giả định (`simulated`)

Không có nguồn pháp lý; đều gắn nhãn "Kịch bản giả định" và có vòng đời đề xuất (3 năm trước) → thí điểm (năm trước) → áp dụng → đánh giá lại mỗi 5 năm. Năm áp dụng băm theo nhân vật, lưu trong `l.flags.era917.eff`, không reroll khi tải.

| ID | Cải cách thận trọng | Cân bằng (mặc định) | An sinh mở rộng | Tác động gameplay |
|---|---|---|---|---|
| sim_retire_up | 2042–2050 | — | — | +3 tháng/năm đến nam 63, nữ 62 |
| sim_child_allowance | — | — | 2032–2040 | 0,5 triệu/tháng mỗi trẻ dưới 6 tuổi đang ở cùng |
| sim_father_leave | — | 2040–2050 | 2032–2040 | Cha nghỉ chăm con 1 tháng, gắn bó với con +4 |
| sim_blood_65 | — | 2048–2058 | 2040–2048 | Người hiến nhắc lại khỏe mạnh hiến đến 65 |
| sim_free_bus | — | 2036–2045 | 2030–2036 | Học sinh, người từ 60 tuổi không xe riêng ở đô thị: chi đi lại công cộng còn 20% |
| sim_commute_deduct | — | — | 2034–2042 | Bảng thuế TNDN: chi xe đưa đón tính 150% (giảm thu nhập tính thuế, trần 10% lợi nhuận, không hoàn tiền) |

**Vì sao "Cân bằng" có chính sách giả định:** bản 8.10.19 để Cân bằng = không bật gì, khiến một đời đến năm 2100 vẫn y như luật 2026. Theo C2 (thế giới tiến triển theo thời đại), Cân bằng nay áp dụng muộn hơn và ít hơn kịch bản mở rộng các chính sách ít tốn ngân sách, không tăng tuổi hưu, không trợ cấp tiền mặt mới. Cửa sổ của Cân bằng luôn không sớm hơn kịch bản gốc (`tests/era917.js` kiểm). Bản lưu 8.10.19 giữ nguyên năm đã băm cho kịch bản gốc (khóa `eff[id]`); cửa sổ mới dùng khóa `eff[id:kịch bản]`.

## Kinh tế theo thời đại (C3)

- Sổ tiền của game tính theo mặt bằng giá 2026. Tiền mặt, nợ, giao dịch cũ không bị quy đổi lại.
- `E.ERA917.macro(nước, năm)`: lạm phát 2,5–4,5%/năm, lương thực tăng 1,5–3,5%/năm; khoảng 8% số năm là năm lạm phát cao (6–9%, lương thực −1…+1%). Chung cho mọi nhân vật cùng nước cùng năm.
- Tác động thật: chi thiết yếu năm đó × (1 + áp lực), áp lực = (lạm phát − 3,5%) − (lương thực − 2,5%) × 0,5, giới hạn −2%…+5%. Năm lạm phát cao có thể mở chuỗi "Giá cả tăng, ngân sách gia đình chật".

## Bổ sung 8.10.20 (`welfare918.js`) — các mục còn lại của Phần C

| ID | Lớp / mức | Dùng trong game | Nguồn | Chưa xác minh / giả định |
|---|---|---|---|---|
| vn_pubwage_2026 | verified / secondary | Lương công vụ (bảng hệ số × 2,34 triệu) nhân theo lương cơ sở 2,53 triệu từ 7/2026; lương hưu điều chỉnh nửa năm 2026 | NĐ 161/2026 (hatinh.gov.vn, tapchicongthuong.vn) | Mức điều chỉnh lương hưu 2026 theo lương cơ sở là giản lược |
| sim_pubwage_index | simulated (mọi kịch bản) | Sau 2026: tăng thực 0% / 0,3% / 0,6% mỗi năm theo kịch bản, trần +15% | — | Giả định; áp trước bảo hiểm và thuế (life3) nên phiếu lương khớp |
| vn_bhyt_household | verified / secondary | BHYT hộ gia đình 4,5% × 2,53 triệu × 12 ≈ 1,37 triệu/năm cho người không thuộc diện được đóng (hộ cận nghèo được hỗ trợ 70%); không đóng thì mất thẻ | Luật BHYT; mức chi trả ở life77 | Giảm từ người thứ hai chưa mô hình; khám trái tuyến dùng tham số `cover` sẵn có của life77 |
| vn_vol_pension | verified / unread | Quỹ hưu trí tự nguyện: trừ thuế TNCN tối đa 1 triệu/tháng (tax-resident), tăng thực 2%/năm, rút trước tuổi mất 10% | Quy định thuế TNCN cũ | Mức trừ theo luật 2025 chưa đọc; 2%/năm và 10% là tham số gameplay |
| vn_overtime | verified / secondary | Làm thêm ×150%, trần 200 giờ/năm (300 giờ cho một số ngành); phép năm 12 ngày; tiền phép chưa nghỉ chỉ trả khi thôi việc | BLLĐ 2019 Đ98, 107, 113 | Danh mục ngành 300 giờ giản lược theo nhóm nghề |
| vn_student_loan | verified / secondary | Vay 4 triệu/tháng × 10 tháng/năm học, lãi 0,55%/tháng, trả sau tốt nghiệp | QĐ 05/2022/QĐ-TTg | Điều kiện hộ nghèo/cận nghèo giản lược (gia đình q ≤ 2 hoặc ít tiền) |
| vn_disability_allow | verified / secondary | Trẻ/người khuyết tật nặng 1 triệu/tháng, đặc biệt nặng 1,25 triệu/tháng sau khi xác định mức độ | NĐ 20/2021 sửa bởi NĐ 76/2024 (mức chuẩn 500.000 đ) | Hệ số theo tuổi giản lược; mức độ xác định bằng số ngẫu nhiên băm |
| vn_ev_fee | verified / secondary | Lệ phí trước bạ: ô tô xăng 10% (Hà Nội 12%), xe máy 2% (5% thành phố lớn), ô tô điện 0% đến hết 2026 | NĐ 10/2022 và gia hạn | Ô tô điện 2027–2028: 50% mức xe xăng, từ 2029 bằng xe xăng — **giả định** |
| vn_hkd_tax | verified / secondary | Hộ kinh doanh: miễn đến 500 triệu doanh thu/năm, trên đó 1,5% doanh thu; doanh nghiệp (doanh thu ≥ 3 tỷ hoặc quy mô lớn) TNDN 15/17/20% trên lợi nhuận; **trừ tiền thật từ 2026** | Luật 67/2025; quy định thuế hộ kinh doanh 2026 | Doanh thu ước tính = 4 × lợi nhuận; tỷ lệ theo ngành giản lược |
| sim_basic_income | simulated (An sinh mở rộng) | 1 triệu/tháng cho người 18–60 thu nhập < 0,5 mức cơ sở | — | Giả định, tách BHTN |
| sim_child_health | simulated (Mở rộng; Cân bằng muộn hơn) | BHYT 100% cho trẻ dưới 16 | — | Giả định |
| Chỉ số theo ngành (C3) | — | Giá ngành **so với mặt bằng lương**: nhà ở −0,3…+0,7%/năm, y tế −0,4…+0,6%, học phí −0,5…+0,4%, đi lại −0,8…+0,4%; trần 0,9–1,1 (sổ tiền theo giá 2026, lương thực khu vực tư không tăng nên chỉ đo phần lệch so với lương); lãi suất điều hành 3–6% (+2 năm lạm phát cao); tỷ giá mất giá 0,5–3%/năm | Tham số gameplay | Áp vào thuê nhà, y tế, chi phí xe (E.vehicleAnnual), phần học phí của chi phí con; không đổi tiền/nợ cũ |
| Miễn học phí (NQ 217/2025) | verified / secondary | Từ năm học 2025–2026, trừ phần học phí khỏi chi phí con 3–17 tuổi ở Việt Nam | — | Giả định mọi trẻ học trường công |
| E-visa (travel918) | — / chưa xác minh | Ấn Độ, Sri Lanka, Kenya, Azerbaijan: nộp trực tuyến, phí thấp hơn, vẫn xét duyệt | Nguồn thứ cấp | Danh sách chưa đối chiếu |
