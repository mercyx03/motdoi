/* Một Đời — Phần C (8.10.19): thời đại, chính sách và đời sống theo năm thế giới.
   · Năm thế giới = năm sinh + tuổi (không lấy năm máy). Mỗi chính sách có lớp: verified (đã xác minh, có nguồn, hiệu lực),
     projection (dự báo, không thành luật) và simulated (kịch bản giả định của game, gắn nhãn rõ).
   · Kịch bản tương lai: Cải cách thận trọng / Cân bằng / An sinh mở rộng. Mặc định Cân bằng = giữ quy định đã xác minh,
     không bật chính sách giả định. Chọn một lần; năm hiệu lực băm theo nhân vật, lưu lại, không reroll khi tải.
   · Tiền trong game tính theo mặt bằng giá cố định; chỉ số giá/lương chỉ để quy đổi tham khảo, không nhân tiền mặt hay nợ.
   · Kết nối hệ sẵn có: tuổi nghỉ hưu (E.retirementAge125 → careers.js), trợ cấp thất nghiệp (life3.js), hiến máu
     (blood-donation.js), ngoại hình (E.LOOKS134), quốc tịch (life70 E.isCitizenOf, partner.homeCountry), tóc (health915). */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110;
  if (!X) return;
  var BASE_YEAR = 2026;
  var SCEN = { reform: { n: 'Cải cách thận trọng', d: 'Tuổi nghỉ hưu có thể tăng chậm sau kỳ đánh giá; quyền lợi giữ ở mức hiện hành.' },
    balanced: { n: 'Cân bằng', d: 'Giữ quy định đã xác minh; một số chính sách giả định ít tốn ngân sách được thí điểm muộn hơn và chậm hơn kịch bản mở rộng, không tăng tuổi nghỉ hưu.' },
    expanded: { n: 'An sinh mở rộng', d: 'Thí điểm trợ cấp trẻ nhỏ, nghỉ chăm con cho cha dài hơn và mở rộng tuổi hiến máu cho người hiến nhắc lại khỏe mạnh.' } };
  // Bảng chính sách. src: nguồn chính thức đã đối chiếu khi viết (xem docs/ERA-POLICY-917.md); chưa đọc lại được thì ghi trong note.
  var POLICIES = [
    { id: 'vn_retire_2019', ver: 'official', dom: 'Hưu trí', cc: 'VN', layer: 'verified', from: 2021, to: null, src: 'Bộ luật Lao động 2019 Điều 169; Nghị định 135/2020/NĐ-CP',
      note: 'Điều kiện lao động bình thường: nam 60 tuổi 3 tháng (2021), mỗi năm +3 tháng đến 62 (2028); nữ 55 tuổi 4 tháng (2021), mỗi năm +4 tháng đến 60 (2035). Game tính theo năm: tháng lẻ làm tròn sang năm tuổi kế tiếp.' },
    { id: 'vn_si_rates', ver: 'unread', dom: 'Bảo hiểm', cc: 'VN', layer: 'verified', from: 2016, to: null, src: 'Luật BHXH, Luật BHYT, Luật Việc làm (tỷ lệ đóng phần người lao động)',
      note: 'Người lao động đóng BHXH 8%, BHYT 1,5%, BHTN 1% — tổng 10,5% là ba quỹ, không phải riêng BHXH.' },
    { id: 'vn_pit_2026', ver: 'official', dom: 'Thuế', cc: 'VN', layer: 'verified', from: 2026, to: null, src: 'Nghị định 253/2026/NĐ-CP hướng dẫn Luật Thuế TNCN (xaydungchinhsach.chinhphu.vn, đọc 02/11/2026)', check: 'Trang nguồn không nêu rõ kỳ tính thuế bắt đầu; ngưỡng thu nhập người phụ thuộc do Bộ Tài chính quy định',
      note: 'Giảm trừ bản thân 15,5 triệu/tháng, người phụ thuộc 6,2 triệu/tháng; mục Thuế tiền lương dùng đúng mức này. Các kỳ trước 2026 có mức khác.' },
    { id: 'vn_maternity', ver: 'secondary', dom: 'Thai sản', cc: 'VN', layer: 'verified', from: 2025, to: null, src: 'Luật BHXH 2024 (hiệu lực 1/7/2025)',
      note: 'Mẹ đóng BHXH đủ điều kiện nghỉ 6 tháng, hưởng 100% bình quân tiền lương làm căn cứ đóng (thay cho lương, không cộng thêm); trợ cấp một lần 2 lần mức tham chiếu tại tháng sinh (khoản 4 Điều 58; mức tham chiếu = lương cơ sở: 2,34 triệu, 2,53 triệu từ 01/7/2026 theo NĐ 161/2026); cha đang đóng BHXH nghỉ 5–14 ngày làm việc tùy trường hợp sinh.', check: 'Số ngày nghỉ của cha theo nguồn thứ cấp' },
    { id: 'vn_unemployment', ver: 'secondary', dom: 'Thất nghiệp', cc: 'VN', layer: 'verified', from: 2015, to: null, src: 'Luật Việc làm 2013 Điều 49–50 (đến 2025); Luật Việc làm 2025 số 74/2025/QH15 Điều 37–39 (từ 01/01/2026); NĐ 293/2025/NĐ-CP lương tối thiểu vùng từ 01/01/2026',
      note: 'Hưởng 60% bình quân tiền lương đóng BHTN 6 tháng gần nhất, tối đa 5 lần lương tối thiểu vùng (2026: vùng I 5,31; II 4,73; III 4,14; IV 3,70 triệu); 3 tháng cho 12 tháng đóng đầu, thêm 1 tháng mỗi 12 tháng, tối đa 12 tháng. Tự nghỉ đúng luật vẫn có thể hưởng; đơn phương nghỉ trái luật thì không. Người tham gia BHTN có thể được hỗ trợ đào tạo nghề (Điều 37).', check: 'Mức trần theo luật 2025 lấy từ nguồn thứ cấp; game gán thành thị = vùng I, nông thôn = vùng III' },
    { id: 'vn_tuition_2025', ver: 'secondary', dom: 'Giáo dục', cc: 'VN', layer: 'verified', from: 2025, to: null, src: 'Nghị quyết 217/2025/QH15 về miễn, hỗ trợ học phí',
      note: 'Miễn học phí mầm non, phổ thông công lập từ năm học 2025–2026; tiền ăn, đồ dùng, dịch vụ ngoài học phí vẫn do gia đình chi.' },
    { id: 'vn_blood_age', ver: 'secondary', dom: 'Hiến máu', cc: 'VN', layer: 'verified', from: 2017, to: null, src: 'Thông tư 26/2013/TT-BYT Điều 4 (tiêu chuẩn người hiến máu); trang vncdc.gov.vn không truy cập được ngày 02/11/2026', check: 'Chưa xác nhận thông tư còn hiệu lực hay đã được thay thế',
      note: 'Người hiến 18–60 tuổi, đủ cân nặng và sức khỏe theo sàng lọc của cơ sở tiếp nhận.' },
    { id: 'vn_citizenship', ver: 'official', dom: 'Quốc tịch', cc: 'VN', layer: 'verified', from: 2009, to: null, src: 'Luật Quốc tịch Việt Nam Điều 15–16; Nghị định 191/2025/NĐ-CP (xaydungchinhsach.chinhphu.vn, đọc 02/11/2026)', check: 'Luật sửa đổi 2025 chưa đọc nguyên văn',
      note: 'Cha mẹ đều là công dân Việt Nam → con có quốc tịch Việt Nam. Một bên là công dân Việt Nam: con có quốc tịch Việt Nam khi cha mẹ thỏa thuận bằng văn bản lúc đăng ký khai sinh; sinh trên lãnh thổ Việt Nam mà không thỏa thuận được thì vẫn có quốc tịch Việt Nam.' },
    { id: 'vn_passport_child', ver: 'secondary', dom: 'Giấy tờ', cc: 'VN', layer: 'verified', from: 2020, to: null, src: 'Luật Xuất cảnh, nhập cảnh của công dân Việt Nam 2019; Thông tư 25/2021/TT-BTC sửa bởi TT 63/2023/TT-BTC (lệ phí)', check: 'Lệ phí 200.000 đ theo nguồn thứ cấp, nguồn khác ghi 180.000 đ',
      note: 'Hộ chiếu phổ thông cho trẻ dưới 14 tuổi có thời hạn 5 năm, không gia hạn; từ 14 tuổi 10 năm. Lệ phí cấp mới 200.000 đồng. Hộ chiếu phải làm thủ tục, không tự có khi đủ điều kiện quốc tịch.' },
    { id: 'vn_ageing_proj', ver: 'unread', dom: 'Dân số', cc: 'VN', layer: 'projection', from: 2024, to: 2074, src: 'Tổng cục/Cục Thống kê — Dự báo dân số Việt Nam 2024–2074, phương án trung bình',
      note: 'Tỷ lệ người 65+ đạt khoảng 14% quanh năm 2034 (dân số già). Đây là dự báo có độ bất định, không phải luật.' },
    { id: 'sim_retire_up', dom: 'Hưu trí', cc: 'VN', layer: 'simulated', scen: 'reform', win: { reform: [2042, 2050] }, from: [2042, 2050], to: null, src: 'Kịch bản giả định của game',
      note: 'Sau kỳ đánh giá quỹ hưu trí, tuổi nghỉ hưu tăng 3 tháng/năm đến nam 63, nữ 62. Công bố trước 3 năm; người sát tuổi nghỉ chỉ chịu mức tăng nhỏ, không nhảy vọt.' },
    { id: 'sim_child_allowance', dom: 'Gia đình', cc: 'VN', layer: 'simulated', scen: 'expanded', win: { expanded: [2032, 2040] }, from: [2032, 2040], to: null, src: 'Kịch bản giả định của game',
      note: 'Thí điểm trợ cấp nuôi trẻ dưới 6 tuổi đang cư trú tại Việt Nam, trả cho hộ trực tiếp nuôi, mỗi trẻ một nguồn.' },
    { id: 'sim_father_leave', dom: 'Thai sản', cc: 'VN', layer: 'simulated', scen: 'expanded', win: { expanded: [2032, 2040], balanced: [2040, 2050] }, from: [2032, 2040], to: null, src: 'Kịch bản giả định của game',
      note: 'Cha đang đóng BHXH được nghỉ chăm con 1 tháng hưởng chế độ (thay cho 5–14 ngày).' },
    { id: 'sim_blood_65', dom: 'Hiến máu', cc: 'VN', layer: 'simulated', scen: 'expanded', win: { expanded: [2040, 2048], balanced: [2048, 2058] }, from: [2040, 2048], to: null, src: 'Kịch bản giả định của game',
      note: 'Người từng hiến nhắc lại, sức khỏe tốt được bác sĩ chấp thuận có thể hiến đến 65 tuổi; người hiến lần đầu vẫn tối đa 60.' },
    { id: 'vn_social_housing', ver: 'secondary', dom: 'Nhà ở', cc: 'VN', layer: 'verified', from: 2025, to: null, src: 'Luật Nhà ở 2023; Nghị định 100/2024/NĐ-CP sửa bởi NĐ 261/2025/NĐ-CP (hiệu lực 10/10/2025)',
      note: 'Mua/thuê mua nhà ở xã hội: chưa có nhà thuộc sở hữu, thu nhập không quá 20 triệu/tháng (độc thân) hoặc 40 triệu/tháng (vợ chồng); vay ưu đãi Ngân hàng Chính sách xã hội 5,4%/năm. Có danh sách chờ theo nguồn cung.', check: 'Số liệu từ báo chí và cổng tỉnh, chưa đọc nguyên văn nghị định' },
    { id: 'vn_sick_leave', ver: 'secondary', dom: 'Ốm đau', cc: 'VN', layer: 'verified', from: 2025, to: null, src: 'Luật BHXH 2024 số 41/2024/QH15 Điều 43–45 (hiệu lực 01/7/2025)',
      note: 'Nghỉ ốm có xác nhận của cơ sở y tế hưởng 75% tiền lương làm căn cứ đóng BHXH; một ngày = mức tháng / 24. Thời gian hưởng trong năm từ 30 đến 70 ngày tùy điều kiện làm việc và số năm đóng (game dùng 30/40/60 ngày theo dưới 15 / 15–30 / từ 30 năm, điều kiện bình thường).', check: 'Mốc 30/40/60 ngày chưa đối chiếu nguyên văn Điều 43' },
    { id: 'vn_cit_2025', ver: 'secondary', dom: 'Thuế doanh nghiệp', cc: 'VN', layer: 'verified', from: 2025, to: null, src: 'Luật Thuế TNDN số 67/2025/QH15 Điều 10 (hiệu lực 01/10/2025, áp dụng từ kỳ tính thuế 2025); Thông tư 20/2026/TT-BTC',
      note: 'Thuế suất phổ thông 20%; doanh nghiệp doanh thu năm trước dưới 3 tỷ đồng 15%, từ 3 đến 50 tỷ đồng 17% (trừ công ty liên kết không đủ điều kiện). Ưu đãi chi phí là giảm thu nhập tính thuế, không phải hoàn tiền.', check: 'Nguồn tư vấn/báo chí' },
    { id: 'vn_hanoi_lez', ver: 'secondary', dom: 'Giao thông', cc: 'VN', layer: 'verified', from: 2026, to: null, src: 'Chỉ thị 20/CT-TTg (12/7/2025); thông báo của Hà Nội về thí điểm vùng phát thải thấp (báo chí 7/2026)',
      note: 'Hà Nội thí điểm vùng phát thải thấp từ 01/7/2026 ở khu phố cổ – hồ Hoàn Kiếm theo khung giờ; dự kiến toàn Vành đai 1 từ 2028, trong Vành đai 3 từ 2030. Xe máy chạy xăng bị hạn chế theo giờ, không cấm toàn bộ.', check: 'Phạm vi giai đoạn 1 các nguồn mâu thuẫn; mốc 2028/2030 là kế hoạch, có thể điều chỉnh' },
    { id: 'sim_free_bus', dom: 'Giao thông', cc: 'VN', layer: 'simulated', scen: 'expanded', win: { expanded: [2030, 2036], balanced: [2036, 2045] }, from: [2030, 2036], to: null, src: 'Kịch bản giả định của game',
      note: 'Miễn vé xe buýt/metro cho học sinh và người từ 60 tuổi ở đô thị có mạng lưới công cộng; người ở vùng xa vẫn dùng xe riêng.' },
    { id: 'sim_commute_deduct', dom: 'Thuế doanh nghiệp', cc: 'VN', layer: 'simulated', scen: 'expanded', win: { expanded: [2034, 2042] }, from: [2034, 2042], to: null, src: 'Kịch bản giả định của game',
      note: 'Chi phí xe đưa đón người lao động có chứng từ được tính 150% khi xác định thu nhập tính thuế TNDN, có trần. Ví dụ: chi 100, tính chi phí 150, thuế suất 20% → giảm thuế 30, không hoàn 150.' }
  ];
  // 8.10.20 (tiếp C): các chính sách dùng trong welfare918.js
  POLICIES.push(
    { id: 'vn_pubwage_2026', ver: 'secondary', dom: 'Lương công vụ', cc: 'VN', layer: 'verified', from: 2026, to: null, src: 'Nghị định 161/2026/NĐ-CP (lương cơ sở 2,53 triệu từ 01/7/2026; hatinh.gov.vn, tapchicongthuong.vn)', note: 'Lương cơ sở tăng từ 2,34 lên 2,53 triệu/tháng; lương công chức, viên chức theo hệ số tăng tương ứng (khoảng 8%, cao hơn lạm phát năm đó).', check: 'Lịch điều chỉnh sau 2026 chưa có; game dùng kịch bản' },
    { id: 'sim_pubwage_index', all: true, dom: 'Lương công vụ', cc: 'VN', layer: 'simulated', scen: 'balanced', win: { balanced: [2028, 2028], reform: [2028, 2028], expanded: [2028, 2028] }, from: [2028, 2028], to: null, src: 'Kịch bản giả định của game', note: 'Sau 2026, lương cơ sở và lương hưu được điều chỉnh định kỳ theo lạm phát; phần tăng thực: 0%/năm (Cải cách thận trọng), 0,3%/năm (Cân bằng), 0,6%/năm (An sinh mở rộng); trần +15% so với 2026.' },
    { id: 'vn_bhyt_household', ver: 'secondary', dom: 'Bảo hiểm y tế', cc: 'VN', layer: 'verified', from: 2015, to: null, src: 'Luật BHYT (mức đóng hộ gia đình 4,5% mức tham chiếu, giảm dần từ người thứ hai); life77 (mức chi trả)', note: 'Người không thuộc diện được đóng/hỗ trợ tự mua BHYT hộ gia đình khoảng 4,5% × mức tham chiếu × 12 tháng/người/năm. Khám đúng tuyến BHYT trả 80% (trẻ dưới 6 tuổi, hộ nghèo 100%, người hưởng lương hưu 95%).', check: 'Mức giảm từ người thứ hai chưa mô hình' },
    { id: 'vn_vol_pension', ver: 'unread', dom: 'Hưu trí tự nguyện', cc: 'VN', layer: 'verified', from: 2019, to: null, src: 'Quy định thuế TNCN về khoản đóng quỹ hưu trí tự nguyện được trừ (tối đa 1 triệu đồng/tháng theo luật cũ)', note: 'Khoản đóng quỹ hưu trí tự nguyện được trừ khi tính thuế TNCN tới 1 triệu/tháng; rút trước tuổi mất ưu đãi thuế.', check: 'Mức trừ theo Luật Thuế TNCN 2025 chưa đọc' },
    { id: 'vn_overtime', ver: 'secondary', dom: 'Giờ làm', cc: 'VN', layer: 'verified', from: 2021, to: null, src: 'Bộ luật Lao động 2019 Điều 98, 107, 113', note: 'Làm thêm ngày thường trả ít nhất 150% lương giờ; tối đa 40 giờ/tháng, 200 giờ/năm (một số ngành 300 giờ). Phép năm 12 ngày; tiền phép chưa nghỉ chỉ trả khi thôi việc.', check: 'Danh mục ngành được 300 giờ chưa mô hình chi tiết' },
    { id: 'vn_student_loan', ver: 'secondary', dom: 'Vay sinh viên', cc: 'VN', layer: 'verified', from: 2022, to: null, src: 'Quyết định 05/2022/QĐ-TTg (tín dụng học sinh, sinh viên; NHCSXH)', note: 'Sinh viên hộ nghèo, cận nghèo, hoàn cảnh khó khăn vay tối đa 4 triệu/tháng, lãi 0,55%/tháng; trả sau khi ra trường.', check: 'Mức vay/lãi theo nguồn thứ cấp' },
    { id: 'vn_disability_allow', ver: 'secondary', dom: 'Người khuyết tật', cc: 'VN', layer: 'verified', from: 2021, to: null, src: 'Nghị định 20/2021/NĐ-CP sửa bởi NĐ 76/2024 (mức chuẩn trợ giúp xã hội 500.000 đ từ 01/7/2024)', note: 'Người khuyết tật nặng hưởng trợ cấp xã hội hằng tháng = mức chuẩn × hệ số (trẻ khuyết tật nặng hệ số 2,0; đặc biệt nặng 2,5) sau khi được xác định mức độ khuyết tật.', check: 'Hệ số theo nhóm tuổi theo nguồn thứ cấp' },
    { id: 'vn_ev_fee', ver: 'secondary', dom: 'Giao thông', cc: 'VN', layer: 'verified', from: 2022, to: null, src: 'Nghị định 10/2022/NĐ-CP và các nghị định gia hạn (lệ phí trước bạ ô tô điện)', note: 'Ô tô điện chạy pin được miễn lệ phí trước bạ đến hết tháng 2/2027; ô tô xăng 10–12%, xe máy 2% (5% ở thành phố lớn lần đầu).', check: 'Mức sau 2027 chưa có văn bản: game dùng 50% mức xe xăng đến 2029 rồi bằng xe xăng (giả định)' },
    { id: 'vn_hkd_tax', ver: 'secondary', dom: 'Thuế kinh doanh', cc: 'VN', layer: 'verified', from: 2026, to: null, src: 'Luật Thuế TNDN 67/2025; quy định thuế hộ kinh doanh từ 2026 (bỏ thuế khoán, ngưỡng doanh thu không chịu thuế 500 triệu/năm)', note: 'Hộ kinh doanh doanh thu đến 500 triệu/năm không nộp thuế; trên mức đó nộp theo tỷ lệ trên doanh thu (game dùng 1,5% cho thương mại – dịch vụ). Doanh nghiệp nộp TNDN 15/17/20% trên lợi nhuận.', check: 'Tỷ lệ theo ngành và cách tính ngưỡng chưa đọc nguyên văn' },
    { id: 'sim_basic_income', dom: 'Thu nhập tối thiểu', cc: 'VN', layer: 'simulated', scen: 'expanded', win: { expanded: [2045, 2052] }, from: [2045, 2052], to: null, src: 'Kịch bản giả định của game', note: 'Thí điểm hỗ trợ thu nhập tối thiểu 1 triệu/tháng cho người 18–60 tuổi có thu nhập rất thấp; tách hẳn trợ cấp thất nghiệp.' },
    { id: 'sim_child_health', dom: 'Y tế trẻ em', cc: 'VN', layer: 'simulated', scen: 'expanded', win: { expanded: [2034, 2042], balanced: [2045, 2055] }, from: [2034, 2042], to: null, src: 'Kịch bản giả định của game', note: 'BHYT chi trả 100% khám chữa bệnh đúng tuyến cho trẻ dưới 16 tuổi (hiện hành: dưới 6 tuổi).' }
  );
  var STAGE = { proposed: 'Đề xuất, đang lấy ý kiến', pilot: 'Thí điểm', on: 'Đang áp dụng', review: 'Đang đánh giá lại', none: 'Chưa có trong kịch bản này' };
  var LAYER = { verified: 'Đã xác minh', projection: 'Dự báo', simulated: 'Kịch bản giả định' };
  // Mức đối chiếu nguồn (đọc lại ngày 02/11/2026): chỉ 'official' mới hiện là đã xác minh với nguồn chính thức.
  var VERLABEL = { official: 'Đã xác minh (nguồn chính thức)', secondary: 'Đã ban hành (mới đối chiếu nguồn thứ cấp)', unread: 'Đã ban hành (chưa đọc lại nguồn)' };
  function layerLabel(p) { return p.layer === 'verified' ? VERLABEL[p.ver] || VERLABEL.unread : LAYER[p.layer]; }
  var BAL = { minWage: { I: 4.96, II: 4.41, III: 3.86, IV: 3.45 }, minWage2026: { I: 5.31, II: 4.73, III: 4.14, IV: 3.70 }, refWage: 2.34, refWage2026: 2.53, childAllowance: 0.5, cpi: [0.025, 0.045], realWage: [0.015, 0.035] }; // triệu đ/tháng

  function dec(x, n) { return Number(x).toFixed(n).replace('.', ','); } // số thập phân kiểu Việt
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; h = Math.imul(h, 3266489909); h ^= h >>> 16; return h >>> 0; }
  function u(l, tag) { return hash(l.id + ':e917:' + tag) / 4294967296; }
  function year(l, age) { return (l.birthYear || BASE_YEAR) + (age == null ? l.age : age); }
  function st(l) {
    var s = l.flags.era917; if (!s || typeof s !== 'object') s = l.flags.era917 = { scen: 'balanced', chosen: false, eff: {} };
    if (!SCEN[s.scen]) s.scen = 'balanced'; if (!s.eff || typeof s.eff !== 'object') s.eff = {};
    POLICIES.forEach(function (p) {
      if (Array.isArray(p.from) && s.eff[p.id] == null) s.eff[p.id] = p.from[0] + Math.floor(u(l, p.id) * (p.from[1] - p.from[0] + 1));
      // 8.10.20: cửa sổ cho kịch bản khác kịch bản gốc; khóa cũ eff[id] vẫn là năm của kịch bản gốc
      Object.keys(p.win || {}).forEach(function (sc) { var key = p.id + ':' + sc, w = p.win[sc]; if (sc !== p.scen && s.eff[key] == null) s.eff[key] = w[0] + Math.floor(u(l, key) * (w[1] - w[0] + 1)); });
    });
    return s;
  }
  function effFrom(l, p, sc) {
    var ov = l.flags && l.flags.era917 && l.flags.era917.override && l.flags.era917.override[p.id];
    if (ov != null && !sc) { var b0 = effFrom(l, p, st(l).scen); return b0 == null ? ov : Math.min(ov, b0); }
    if (!Array.isArray(p.from)) return p.from;
    sc = sc || st(l).scen; if (p.layer === 'simulated' && !(p.win && p.win[sc]) && sc !== p.scen) return null;
    return sc === p.scen ? st(l).eff[p.id] : st(l).eff[p.id + ':' + sc];
  }
  // Vòng đời chính sách giả định: đề xuất (3 năm trước) → thí điểm (năm trước) → áp dụng → đánh giá lại mỗi 5 năm.
  function stage(l, p, y) {
    var f = effFrom(l, p); y = y == null ? year(l) : y; if (f == null) return 'none';
    if (y < f - 3) return 'none'; if (y < f - 1) return 'proposed'; if (y < f) return 'pilot';
    return p.layer === 'simulated' && (y - f) > 0 && (y - f) % 5 === 0 ? 'review' : 'on';
  }
  function vnHere(l) { return l.country === 'VN' && !(l.abroad && l.abroad.perm); }
  function active(l, id, y) {
    var p = POLICIES.find(function (x) { return x.id === id; }); if (!p) return false; y = y == null ? year(l) : y;
    var pl = st(l).pilot && st(l).pilot[id], pv = l.prov && (l.prov.neu || l.prov.old);
    if (pl && pv && pl.prov === pv && y >= pl.from && vnHere(l)) return true; // thí điểm địa phương
    var f = effFrom(l, p); if (f == null) return false; return y >= f && (p.to == null || y <= p.to);
  }

  // ---------- C3: chỉ số giá, lương danh nghĩa (tham khảo) ----------
  // Lịch sử giá chung theo quốc gia và năm (mọi nhân vật cùng nước thấy cùng năm lạm phát cao), không theo nhân vật.
  function macro(cc, t) {
    var w = function (tag) { return hash('macro918:' + cc + ':' + tag + ':' + t) / 4294967296; }, shock = w('shock') < 0.08;
    var a = shock ? 0.06 + w('cpi') * 0.03 : BAL.cpi[0] + w('cpi') * (BAL.cpi[1] - BAL.cpi[0]);
    var g = shock ? -0.01 + w('wg') * 0.02 : BAL.realWage[0] + w('wg') * (BAL.realWage[1] - BAL.realWage[0]);
    return { cpi: a, real: g, shock: shock };
  }
  function index(l, y) {
    y = y == null ? year(l) : y; var cpi = 1, wage = 1, cc = (l.abroad && l.abroad.perm && l.abroad.code) || l.country || 'VN';
    for (var t = BASE_YEAR + 1; t <= y; t++) { var m = macro(cc, t); cpi *= 1 + m.cpi; wage *= (1 + m.cpi) * (1 + m.real); }
    if (y < BASE_YEAR) { cpi = Math.pow(1.035, y - BASE_YEAR); wage = Math.pow(1.06, y - BASE_YEAR); }
    return { cpi: cpi, wage: wage, real: wage / cpi };
  }
  // ---------- C4: tuổi nghỉ hưu theo lộ trình ----------
  function retireAge(l, sex, y) {
    var m = sex !== 'F', base;
    if (y <= 2020) base = m ? 60 : 55;
    else base = m ? Math.min(62, 60 + 0.25 * (y - 2020)) : Math.min(60, 55 + (4 / 12) * (y - 2020));
    if (active(l, 'sim_retire_up', y)) { var f = effFrom(l, POLICIES.find(function (p) { return p.id === 'sim_retire_up'; }), 'reform'); base = Math.min(m ? 63 : 62, base + 0.25 * (y - f + 1)); }
    return base;
  }
  var ret0 = E.retirementAge125;
  E.retirementAge125 = function (l, age) {
    var c = l && l.job && E.jobDef ? E.jobDef(l) : null;
    if (c && !c.ladder && vnHere(l) && ((l.sex !== 'F' && age === 62) || (l.sex === 'F' && age === 60))) age = Math.ceil(retireAge(l, l.sex, year(l)) - 1e-9);
    return ret0 ? ret0(l, age) : age;
  };
  // ---------- C5: thất nghiệp — trần 5 lần lương tối thiểu vùng ----------
  function region(l) { return l.urban ? 'I' : 'III'; }
  function minWage(l, y) { return ((y == null ? year(l) : y) >= 2026 ? BAL.minWage2026 : BAL.minWage)[region(l)]; }
  function refWage(l, y, tag) { y = y == null ? year(l) : y; return y >= 2027 || (y === 2026 && u(l, 'month' + (tag || '')) >= 0.5) ? BAL.refWage2026 : BAL.refWage; } // tháng sinh trong năm 2026 băm theo nhân vật
  E.unemploymentCap917 = function (l) { return vnHere(l) ? 5 * minWage(l) : Infinity; };
  // ---------- C10: tuổi hiến máu tối đa ----------
  function bloodMax(l) { var b = l.flags && l.flags.blood909, repeat = !!(b && Array.isArray(b.history) && b.history.length >= 3); return active(l, 'sim_blood_65') && repeat && l.st.hea >= 70 ? 65 : 60; }

  // ---------- C5/C6: thai sản và trợ cấp trẻ theo năm thế giới ----------
  function insured(l) { return !!(l.si && l.si.last != null && l.si.last >= l.age - 1 && l.job); }
  function partnerInsured(l) { var p = l.partner; return !!(p && p.alive !== false && (p.job || p.jobTitle) && !/nội trợ|thất nghiệp|tự do|làm thuê/i.test(String(p.job || p.jobTitle || ''))); }
  function birthYear(l, k) {
    if (k.mat917 || k.adopted || k.adopt || l.age - k.born > 1 || !vnHere(l)) return;
    var mom = l.sex === 'F' ? insured(l) : partnerInsured(l), dad = l.sex === 'F' ? partnerInsured(l) : insured(l);
    var self = l.sex === 'F' ? 'mom' : 'dad', who = mom ? 'mom' : dad ? 'dad' : null;
    k.mat917 = { y: year(l, k.born), lump: 0, who: who };
    if (!active(l, 'vn_maternity', year(l, k.born))) return;
    var parts = [];
    if (who === self && (l.sex === 'F' || !mom)) { var lump = 2 * refWage(l, year(l, k.born), k.name); H.cash(l, lump, 'Trợ cấp một lần khi sinh con (BHXH)'); k.mat917.lump = lump; parts.push('nhận trợ cấp một lần ' + H.money(l, lump)); }
    if (l.sex === 'F' && mom) parts.push('nghỉ thai sản 6 tháng, quỹ BHXH chi thay lương (không cộng thêm lương)');
    if (l.sex !== 'F' && insured(l)) parts.push(active(l, 'sim_father_leave', year(l, k.born)) ? 'nghỉ chăm con 1 tháng theo chính sách thí điểm' : 'nghỉ chăm vợ sinh 5–14 ngày làm việc');
    if (l.sex !== 'F' && insured(l)) { k.close = U.clamp((k.close || 60) + (active(l, 'sim_father_leave', year(l, k.born)) ? 4 : 1), 0, 100); }
    if (!who) parts.push('gia đình chưa ai đóng BHXH nên không có chế độ thai sản; vẫn được khám thai và sinh theo BHYT nếu có thẻ');
    k.mat917.note = parts.join('; ');
    return parts;
  }
  function allowance(l, log) {
    if (!vnHere(l) || !active(l, 'sim_child_allowance')) return;
    var s = st(l); if (s.allowAt === l.age) return; s.allowAt = l.age;
    var kids = (l.kids || []).filter(function (k) { return k.alive !== false && l.age - k.born < 6 && k.custody !== 'other' && k.custody !== 'ex'; });
    if (!kids.length) return;
    var v = BAL.childAllowance * 12 * kids.length; H.cash(l, v, 'Trợ cấp nuôi trẻ dưới 6 tuổi (thí điểm, kịch bản)');
    s.allowPaid = (s.allowPaid || 0) + v;
    if (!s.allowLogged) { s.allowLogged = true; log('Chương trình thí điểm (kịch bản An sinh mở rộng) trả trợ cấp nuôi trẻ dưới 6 tuổi: ' + H.money(l, BAL.childAllowance) + '/tháng mỗi trẻ.', 'good'); }
  }

  // ---------- C9: quốc tịch và hộ chiếu của con ----------
  var SOLI = ['US', 'CA', 'MX', 'BR', 'AR', 'CL', 'PE', 'CO', 'VE', 'EC', 'BO', 'PY', 'UY', 'CR', 'PA', 'GT', 'HN', 'NI', 'SV', 'JM', 'TT', 'BB', 'GY', 'BZ', 'CU', 'DM', 'GD', 'LC', 'VC', 'AG', 'KN', 'FJ', 'TZ', 'LS', 'CD', 'PK']; // jus soli rộng (chưa xác minh từng ngoại lệ)
  function myCits(l) { var a = [l.country].concat(l.flags.citizen || []); if (l.flags.renounced) a = a.filter(function (c) { return c !== l.flags.renounced || c === l.country; }); return a.filter(function (c, i) { return c && a.indexOf(c) === i; }); }
  function kidRec(l, k) {
    var c = k.cit917; if (c && typeof c === 'object') return c;
    var fresh = l.age - k.born <= 1;
    c = k.cit917 = { born: fresh ? (l.abroad && l.abroad.perm ? l.abroad.code : l.country) : null, other: l.partner && l.partner.alive !== false && !k.adopted ? (l.partner.homeCountry || l.partner.country || null) : null, agreeVN: null, cits: [], passports: [], pending: null, inferred: !fresh };
    if (!fresh) { c.cits = [l.country]; } // bản lưu cũ: giữ quốc tịch như trước, không tự thêm
    return c;
  }
  function eligible(l, k) {
    var c = kidRec(l, k), mine = myCits(l), out = [], other = c.other;
    mine.forEach(function (x) { if (out.indexOf(x) < 0) out.push(x); });
    if (other && out.indexOf(other) < 0) out.push(other);
    if (c.born && SOLI.indexOf(c.born) >= 0 && out.indexOf(c.born) < 0) out.push(c.born);
    return out.map(function (cc) {
      var why = cc === c.born && mine.indexOf(cc) < 0 && cc !== other ? 'sinh tại nước áp dụng nơi sinh' : 'theo cha/mẹ';
      var cond = null;
      if (cc === 'VN' && other && other !== 'VN' && mine.indexOf('VN') >= 0) cond = c.born === 'VN' ? 'sinh tại Việt Nam: có quốc tịch Việt Nam kể cả khi chưa thỏa thuận' : 'cần cha mẹ thỏa thuận bằng văn bản khi đăng ký khai sinh';
      var verified = cc === 'VN' || false;
      return { cc: cc, why: why, cond: cond, verified: verified };
    });
  }
  function cname(cc) { var W = G.W; return W && W.BY && W.BY[cc] && W.BY[cc].name || cc; }
  function passportValid(l, k, cc) { var p = (kidRec(l, k).passports || []).find(function (x) { return x.cc === cc; }); return p && p.until > l.age - k.born ? p : null; }
  function kidsYear(l, log) {
    (l.kids || []).forEach(function (k) {
      if (k.alive === false) return; var c = kidRec(l, k), age = l.age - k.born;
      if (!c.inferred && age <= 1 && !c.cits.length) {
        // tự động: quốc tịch mặc định theo quy tắc nơi đăng ký khai sinh; quốc tịch thứ hai cần đăng ký riêng
        if (myCits(l).indexOf('VN') >= 0 && (!c.other || c.other === 'VN' || c.born === 'VN')) c.cits.push('VN');
        else c.cits.push(myCits(l)[0]);
      }
      if (c.pending && c.pending.at < l.age) {
        var q = c.pending; c.pending = null;
        if (q.kind === 'cit') { if (c.cits.indexOf(q.cc) < 0) c.cits.push(q.cc); log('Hồ sơ quốc tịch ' + cname(q.cc) + ' của ' + k.name + ' được chấp thuận.', 'good'); }
        if (q.kind === 'pp') { c.passports = c.passports.filter(function (x) { return x.cc !== q.cc; }); c.passports.push({ cc: q.cc, issued: age, until: age + (age < 14 ? 5 : 10) }); log('Hộ chiếu ' + cname(q.cc) + ' của ' + k.name + ' đã được cấp, hạn đến khi con ' + (age + (age < 14 ? 5 : 10)) + ' tuổi.', 'good'); }
      }
    });
  }
  X.menu('citizen917', 'Quốc tịch và hộ chiếu của con', function (l) { var r = X.reason(l, 18); if (r !== true) return r; return (l.kids || []).some(function (k) { return k.alive !== false && l.age - k.born < 18; }) ? true : 'Cần có con dưới 18 tuổi'; }, function (l) {
    return 'Quốc tịch xét theo quốc tịch cha mẹ lúc sinh, nơi sinh và luật từng nước; không suy từ ngoại hình. Đủ điều kiện chưa có nghĩa là đã có quốc tịch; hộ chiếu là giấy tờ phải làm thủ tục riêng và có hạn. Quốc tịch của con không tự cho cha mẹ quyền cư trú hay làm việc.\n' +
      (l.kids || []).filter(function (k) { return k.alive !== false && l.age - k.born < 18; }).map(function (k) {
        var c = kidRec(l, k), el = eligible(l, k);
        return '• ' + k.name + ' (' + (l.age - k.born) + ' tuổi' + (c.born ? ', sinh tại ' + cname(c.born) : ', nơi sinh chưa ghi nhận trong bản lưu cũ') + '): quốc tịch ' + (c.cits.map(cname).join(', ') || 'chưa đăng ký') +
          '; đủ điều kiện xét: ' + el.map(function (e) { return cname(e.cc) + ' (' + e.why + (e.cond ? '; ' + e.cond : '') + (e.verified ? '' : '; quy tắc nước này chưa xác minh chi tiết') + ')'; }).join(', ') +
          '; hộ chiếu: ' + (c.passports.filter(function (p) { return p.until > l.age - k.born; }).map(function (p) { return cname(p.cc) + ' còn hạn đến ' + p.until + ' tuổi'; }).join(', ') || 'chưa có') + (c.pending ? '; đang chờ xử lý hồ sơ' : '');
      }).join('\n');
  }, function (l) {
    var out = [];
    (l.kids || []).filter(function (k) { return k.alive !== false && l.age - k.born < 18; }).forEach(function (k) {
      var c = kidRec(l, k);
      eligible(l, k).forEach(function (e) {
        if (c.cits.indexOf(e.cc) < 0) out.push({ k: 'cit:' + k.name + ':' + e.cc, l: 'Đăng ký quốc tịch ' + cname(e.cc) + ' cho ' + k.name, h: 'Lệ phí và giấy tờ ~' + H.money(l, l.base * 0.01) + ' · xử lý trong năm sau' + (e.cond ? ' · ' + e.cond : ''), why: c.pending ? 'Đang có hồ sơ chờ xử lý' : l.money < l.base * 0.01 ? 'Chưa đủ tiền lệ phí' : true,
          run: function (l, r, log) { var q = kidRec(l, k); if (q.pending || q.cits.indexOf(e.cc) >= 0) return; H.cash(l, -l.base * 0.01, 'Hồ sơ quốc tịch cho con'); if (e.cc === 'VN') q.agreeVN = true; q.pending = { kind: 'cit', cc: e.cc, at: l.age }; log('Nộp hồ sơ quốc tịch ' + cname(e.cc) + ' cho ' + k.name + '; chờ cơ quan có thẩm quyền xem xét.', 'neutral'); } });
      });
      c.cits.forEach(function (cc) {
        var pp = passportValid(l, k, cc), fee = cc === 'VN' ? 0.2 : l.base * 0.015;
        out.push({ k: 'pp:' + k.name + ':' + cc, l: (pp ? 'Làm lại' : 'Làm') + ' hộ chiếu ' + cname(cc) + ' cho ' + k.name, h: 'Lệ phí ~' + H.money(l, fee) + ' · cha/mẹ đứng tên khai thay · cấp trong năm sau', why: c.pending ? 'Đang có hồ sơ chờ xử lý' : pp && pp.until - (l.age - k.born) > 1 ? 'Hộ chiếu còn hạn' : l.money < fee ? 'Chưa đủ tiền lệ phí' : true,
          run: function (l, r, log) { var q = kidRec(l, k); if (q.pending) return; H.cash(l, -fee, 'Lệ phí hộ chiếu cho con'); q.pending = { kind: 'pp', cc: cc, at: l.age }; log('Nộp hồ sơ hộ chiếu ' + cname(cc) + ' cho ' + k.name + '.', 'neutral'); } });
      });
    });
    return out;
  }, 18, 'Gia đình');

  // ---------- C8: chăm sóc da, mụn tuổi dậy thì, trang điểm (mở rộng LOOKS134, không thêm chỉ số sắc đẹp mới) ----------
  var ROUTINE = { none: { n: 'Không theo chế độ riêng', c: 0 }, basic: { n: 'Cơ bản: rửa mặt, dưỡng ẩm, chống nắng', c: 0.006 }, thorough: { n: 'Chuyên sâu: thêm serum/đặc trị', c: 0.03 } };
  var MAKEUP = { none: 'Không trang điểm', natural: 'Tự nhiên (no-makeup makeup)', clean: 'Clean girl', igari: 'Igari', douyin: 'Douyin', latina: 'Latina', strawberry: 'Strawberry', wasian: 'Wasian (theo cách người chơi gọi)' };
  function care(l) { var s = l.flags.care917; if (!s || typeof s !== 'object') { s = l.flags.care917 = { routine: 'none', makeup: 'none', acne: null }; } if (!ROUTINE[s.routine]) s.routine = 'none'; if (!MAKEUP[s.makeup]) s.makeup = 'none'; return s; }
  function carePayment(l,cost,label){
    if(l.age<16 && (l.fam.mAlive||l.fam.fAlive&&!l.fam.noDad)){
      var family=E.childExpense(l,cost,label,false,true);if(family.ok)return true;
    }
    if(l.money>=cost){H.cash(l,-cost,label);return true;}
    return l.age<18 && !!(l.fam.mAlive||l.fam.fAlive&&!l.fam.noDad) && E.childExpense(l,cost,label,false,true).ok;
  }
  function careYear(l, log) {
    var s = care(l); if (s.at === l.age) return; s.at = l.age;
    if (l.age === 12 && s.acne == null) s.acne = u(l, 'acne') < 0.55 ? { sev: u(l, 'acneSev') < 0.75 ? 'nhẹ' : 'vừa', until: 15 + Math.floor(u(l, 'acneEnd') * 5), seen: false } : false;
    if (s.acne && l.age > s.acne.until) { s.acne = false; log('Mụn tuổi dậy thì của bạn đã dịu hẳn.', 'good'); }
    if (s.acne && s.acne.sev === 'vừa' && !s.acne.seen && l.mind) l.mind.stress = U.clamp(l.mind.stress + 1, 0, 100);
    var R = ROUTINE[s.routine]; if (R.c && l.age >= 13) {
      var cost = l.base * R.c; if (carePayment(l,cost,'Chăm sóc da')) { if (E.LOOKS134 && E.LOOKS134.improve && u(l, 'care' + l.age) < (s.routine === 'thorough' ? 0.45 : 0.4)) E.LOOKS134.improve(l, l, 1, 6); if (s.routine === 'thorough' && u(l, 'irr' + l.age) < 0.08) log('Da bị kích ứng với sản phẩm đặc trị; bạn tạm ngưng vài tuần. Đắt hơn không có nghĩa là hợp da hơn.', 'neutral'); }
      else { s.routine = 'none'; log('Không đủ tiền duy trì chế độ chăm sóc da; bạn tạm ngưng.', 'neutral'); }
    }
  }
  X.menu('care917', 'Chăm sóc da và phong cách', function (l) { return X.reason(l, 13); }, function (l) {
    var s = care(l); return 'Chế độ chăm sóc: ' + ROUTINE[s.routine].n + '. Phong cách trang điểm: ' + MAKEUP[s.makeup] + '.' + (s.acne ? ' Đang có mụn tuổi dậy thì mức ' + s.acne.sev + (s.acne.seen ? ' (đã được bác sĩ da liễu tư vấn).' : '.') : '') +
      ' Chăm sóc giúp da ổn định hơn theo thời gian nhưng không ngăn lão hóa và không thay đổi ngoại hình nền; mức cộng ngoại hình có trần chung với các cách chăm sóc khác. Trang điểm là lựa chọn thẩm mỹ, không khóa theo giới tính hay sắc tộc, và không bắt buộc. Tóc và hiến tóc ở mục Tóc.';
  }, function (l) {
    var s = care(l), out = [];
    Object.keys(ROUTINE).forEach(function (k) { out.push({ k: 'r:' + k, l: (s.routine === k ? '✓ ' : '') + ROUTINE[k].n, h: ROUTINE[k].c ? '~' + H.money(l, l.base * ROUTINE[k].c) + '/năm, tự động mỗi năm đến khi đổi' : 'Không tốn tiền', why: s.routine === k ? 'Đang dùng' : true, run: function (l, r, log) { care(l).routine = k; log('Bạn chuyển sang chế độ chăm sóc: ' + ROUTINE[k].n + '.', 'neutral'); } }); });
    if (l.age >= 13) Object.keys(MAKEUP).forEach(function (k) { out.push({ k: 'm:' + k, l: (s.makeup === k ? '✓ ' : '') + 'Trang điểm: ' + MAKEUP[k], h: 'Chỉ đổi phong cách, không đổi chỉ số', why: s.makeup === k ? 'Đang dùng' : true, run: function (l, r, log) { care(l).makeup = k; log('Phong cách mới: ' + MAKEUP[k] + '.', 'neutral'); } }); });
    if (s.acne && !s.acne.seen) out.push({ k: 'derm', l: 'Đi khám da liễu về mụn', h: '~' + H.money(l, l.base * 0.01) + ' · mụn thường dịu sớm hơn', why: l.money >= l.base * 0.01 || !l.indep ? true : 'Chưa đủ tiền', run: function (l, r, log) { var q = care(l); if (!q.acne || q.acne.seen) return; if (!carePayment(l,l.base*.01,'Khám da liễu')) {log('Chưa đủ ngân sách khám da liễu.','neutral');return;} q.acne.seen = true; q.acne.until = Math.max(l.age, q.acne.until - 2); log('Bác sĩ da liễu tư vấn cách chăm sóc phù hợp lứa tuổi; mụn sẽ dịu sớm hơn.', 'good'); } });
    return out;
  }, 13, 'Đời sống');

  // ---------- C2: màn hình chính sách theo thời đại, chọn kịch bản một lần ----------
  X.menu('era917', 'Chính sách theo thời đại', function (l) { return X.reason(l, 16); }, function (l) {
    var s = st(l), y = year(l), ix = index(l, y), here = vnHere(l);
    var rows = POLICIES.filter(function (p) { return p.layer !== 'simulated' || effFrom(l, p) != null; }).map(function (p) {
      var f = effFrom(l, p), on = active(l, p.id, y), sg = p.layer === 'simulated' ? STAGE[stage(l, p, y)] : on ? 'đang áp dụng' : f > y ? 'dự kiến từ ' + f : 'hết hiệu lực';
      return '• [' + layerLabel(p) + '] ' + p.dom + ': ' + p.note + ' — ' + sg + (p.layer === 'simulated' ? ' (năm áp dụng trong đời này: ' + f + ')' : '') + '. Nguồn: ' + p.src + '.' + (p.check ? ' Chưa xác minh: ' + p.check + '.' : '');
    });
    return 'Năm ' + y + '. Kịch bản tương lai: ' + SCEN[s.scen].n + ' — ' + SCEN[s.scen].d + (s.chosen ? ' (đã chọn, cố định cho cả đời)' : ' (mặc định, có thể chọn một lần)') + '.\n' +
      (here ? '' : 'Bạn đang sống ngoài Việt Nam: các quy định Việt Nam dưới đây chỉ để tham khảo; nước sở tại dùng hồ sơ quốc gia riêng (mục Quốc gia).\n') +
      'Tuổi nghỉ hưu theo lộ trình năm nay: nam ' + fmtAge(retireAge(l, 'M', y)) + ', nữ ' + fmtAge(retireAge(l, 'F', y)) + '.\n' +
      'Quy đổi tham khảo so với ' + BASE_YEAR + ': giá cả ×' + dec(ix.cpi, 2) + ', lương danh nghĩa bình quân ×' + dec(ix.wage, 2) + ', sức mua lương thực tế ×' + dec(ix.real, 2) + '. Tiền trong game tính theo mặt bằng giá ' + BASE_YEAR + ', nên số dư không bị nhân theo lạm phát.\n' + rows.join('\n');
  }, function (l) {
    var s = st(l); return Object.keys(SCEN).map(function (k) { return { k: 's:' + k, l: (s.scen === k ? '✓ ' : '') + 'Kịch bản: ' + SCEN[k].n, h: SCEN[k].d, why: s.chosen ? (s.scen === k ? 'Đang dùng' : 'Đã chọn kịch bản cho đời này') : s.scen === k && k === 'balanced' ? true : true,
      run: function (l, r, log) { var q = st(l); if (q.chosen) return; q.scen = k; q.chosen = true; q.chosenAt = l.age; log('Bạn chọn kịch bản tương lai: ' + SCEN[k].n + '. Kịch bản cố định cho cả đời này.', 'neutral'); } }; });
  }, 16, 'Đời sống');
  function fmtAge(a) { var y = Math.floor(a + 1e-9), m = Math.round((a - y) * 12); return y + (m ? ' tuổi ' + m + ' tháng' : ' tuổi'); }

  // ---------- hook năm và bản lưu ----------
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !l.flags) return; st(l); if (l.flags.era917v == null) l.flags.era917v = 1;
    (l.kids || []).forEach(function (k) { if (k.alive === false) return; var p = birthYear(l, k); if (p && p.length) log('Con chào đời: ' + p.join('; ') + '.', 'neutral'); });
    kidsYear(l, log); allowance(l, log); careYear(l, log);
  });
  var mig = E.migrateExt; E.migrateExt = function (l) {
    if (mig) mig(l); if (!l || !l.flags) return;
    ['era917', 'care917'].forEach(function (k) { if (l.flags[k] != null && typeof l.flags[k] !== 'object') delete l.flags[k]; });
    // bản lưu trước 8.10.19: con đã sinh không nhận truy lĩnh trợ cấp thai sản
    if (l.flags.era917v == null) { l.flags.era917v = 1; (l.kids || []).forEach(function (k) { if (k && !k.mat917 && l.age - k.born > 0) k.mat917 = { y: year(l, k.born), legacy: true }; }); }
  };
  E.ERA917 = { layerLabel: layerLabel, VERLABEL: VERLABEL, stage: stage, effFrom: effFrom, macro: macro, minWage: minWage, refWage: refWage, vnHere: vnHere, STAGE: STAGE, POLICIES: POLICIES, SCEN: SCEN, LAYER: LAYER, BAL: BAL, state: st, year: year, active: active, index: index, retireAge: retireAge, bloodMax: bloodMax, eligible: eligible, kidRec: kidRec, care: care, birth: birthYear };
})(globalThis.G);
