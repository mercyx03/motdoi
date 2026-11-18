# Gia đình và kỷ niệm đón bé 8.10.44

HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN. Không mở giai đoạn mới. Không deploy Production.

## Phạm vi và đối chiếu

Bản 8.10.39 đã có tự động dưới 4 tuổi; việc sáng tạo từ 13, ca làm theo VN/US/GB và mặc định bảo thủ cho nơi khác; chăm da 13 tuổi, ngân sách gia đình dưới 16; hộ chiếu/chuyến đi cùng người lớn; ở nhà/góp bill/ra riêng; chi phí trường tư/công/cao đẳng/nghề, học bổng và vay phần thiếu; IVF và mang thai hộ nhánh VN/GB. Giữ các cơ chế này và kiểm thử lại, không tuyên bố là toàn bộ đều mới.

Bổ sung:

- engine: thoi_noi dưới 4 tuổi do tự động chọn ổn định theo ID/sở thích đã có, lưu infantChoice844; không yêu cầu em bé tự quyết. Mốc 4 là quy ước tương tác game, không kết luận mọi trẻ không có ký ức trước tuổi này.
- life121: lịch ngắn 6/12 giờ mỗi tuần, từ 16 thêm 16 giờ; thu nhập theo lịch, giữ school, một đợt thực hiện/năm. Không đổi giới hạn tuổi ca chính thức và giấy phép đã có; không mô phỏng toàn bộ luật địa phương. Gia đình có thể ở chung sau kết hôn khi bạn đời và bố mẹ thu xếp được; việc bị hoãn được lưu trong năm, không bấm lại để đổi kết quả. Hỗ trợ dọn nhà kiểm ngân sách và ghi chi gia đình.
- study829: yêu cầu hỗ trợ 0/25/50/75/100% phần còn lại, giới hạn bởi khả năng gia đình; giữ học bổng, học phí, sinh hoạt, tiền riêng trước khoản vay, lãi đã ký không tự thay. Áp nhánh Hoa Kỳ hiện có, không mở vay chung mọi nước.
- life108: mô hình một đợt thử/năm dưới45 gồm sáu cơ hội thay bốn. Tham số từng cơ hội: 18–29 .23; 30–34 .19; 35–39 .09; 40–44 .04. Đây là tham số chơi, không ước tính cá nhân/chu kỳ thực hoặc tỷ lệ sinh sống. 45–49 chỉ .015/đợt, 50–54 .005 nếu chưa có trạng thái mãn kinh; 55+ bằng0. Mốc mãn kinh mô phỏng 48–55 theo danh tính, giữ trạng thái xuyên save; khi có trạng thái, tự nhiên và IVF bằng trứng bản thân đang mô phỏng bị chặn. Không xóa thai kỳ đã có. Không triển khai chẩn đoán 12 tháng mất kinh hoặc trứng hiến/tất cả phác đồ. IVF/mang thai hộ giữ nhánh pháp lý và phí hiện có, không tự mở ở mọi quốc gia.
- faith830: Baek-il100 ngày / đầy tháng30 ngày cùng nằm trong năm sinh do game theo năm. Chọn hình thức trước, quy mô sau, có phí, dự phòng, hoãn, ảnh và quà hiện vật. Mỗi bé một lần, không sinh tiền/lãi quà; tiệc không thực hiện rửa tội/dâng con. Gia đình Kitô giáo KR có tiệc ảnh/cầu nguyện, không bắt cúng Samshin; VN không bắt mọi nhà cúng Mụ. Tiệc nhà/studio/sự kiện do khả năng và lựa chọn, không gán tính cách theo giàu nghèo.

## Nguồn kiểm tra 05/11/2026 (UTC+7)

- [US Department of Labor: lao động dưới18](https://www.dol.gov/general/topic/hiring/workersunder18): giới hạn chung công việc phi nông nghiệp từ14, giờ làm và công việc nguy hiểm. Không suy ra mọi bang hoặc mọi nghề giống nhau.
- [GOV.UK: tuổi lao động trẻ](https://www.gov.uk/child-employment), [giấy phép địa phương](https://www.gov.uk/find-licences/child-work-permit-england-wales).
- [Federal Student Aid](https://studentaid.gov/understand-aid/types), [CFPB: nguồn chi trả học tập](https://www.consumerfinance.gov/ask-cfpb/what-are-the-different-ways-to-pay-for-college-or-graduate-school-en-545/). Các tỷ lệ hỗ trợ và lãi trong game là giả lập.
- [ASRM: Age and Fertility](https://www.reproductivefacts.org/news-and-publications/fact-sheets-and-infographics/age-and-fertility-booklet), [HSE Ireland: tuổi và sinh sản](https://www2.hse.ie/pregnancy-birth/trying-for-a-baby/your-fertility/age/), [WHO: mãn kinh](https://www.who.int/news-room/fact-sheets/detail/menopause/). Không coi cơ hội một đợt game là tỷ lệ của một lần quan hệ; không áp một mốc tuổi làm chẩn đoán thật.
- [National Folk Museum of Korea: childbirth rituals](https://folkency.nfm.go.kr/api/file/download/dictionary/123): mốc100 ngày và bánh chia cộng đồng; [Army: một gia đình mừng Baek-il](https://www.army.mil/article/210741/newborn_baby_celebrates_baek_il_in_korea); [Catholic Korea: ảnh mừng100 ngày tại cộng đoàn](https://news.catholic.or.kr/WZ_NP/section/view.asp?cseq=8&seq=213323&tbcode=SEC05). Không khẳng định đại đa số mọi thế hệ đã bỏ nghi lễ, hoặc mọi gia đình VN bắt buộc cúng Mụ.

## Kiểm thử và giới hạn

Chuyên đề life844: 116 kiểm tra mới đạt, gồm phản ứng em bé, tuổi13/16, lịch làm, hỗ trợ đại học, từ chối ở chung không reroll, lễ VN/KR/Kitô giáo, phí/quà/chống replay, mãn kinh và save. growing-up839 đạt; cập nhật kỳ vọng mô hình sáu cơ hội và thay assertion tuổi51 cứng trong relationships108 bằng trạng thái mãn kinh rõ ràng.

Smoke 11/11; saves 10/10; save-safety 10/10; NPC 14/14 đạt. Cảnh báo cũ về ID theo thời gian thực và quyết định Hardcore cũ không còn tồn tại được ghi nhận, không tính là lỗi mới. Regression liên quan PASS: faith830, royal837(67), relationships108(76), family130(67), world120(74), children141(38), era917(179), romance912(114), royal843(59), feedback842(138), update-release(883), update-history843(173 gồm build).

Browser Chrome headless đạt 390/1280: sáu ngữ cảnh teen, học phí, gia đình đã kết hôn, lễ VN, Baek-il KR và chọn quy mô; có tương tác lưu lựa chọn, không tràn ngang hoặc lỗi JS. Nhật ký mới packaged, tìm kiếm, bộ lọc và tải thêm đạt. Ảnh .cache/life844-browser. Lần chạy đầu fixture teen thiếu trường học bị engine lọc như một lựa chọn trường học không còn phù hợp; sửa fixture thành school=lower, không thay sản phẩm để vượt kiểm tra.

Giữ nguyên 103 mục nhật ký biên tập và166 mục dữ liệu cũ. Mục mới đứng đầu, tồn tại trong JSON/HTML build; 8.10.41 vẫn ẩn, 8.10.42 giữ thời điểm phát hành chủ dự án đã chỉ định. Gói ZIP được đọc lại từng tên/SHA-256 so với dist; loading đối chiếu8 cuộc đời nguồn/bản nén và API admin dùng DB bộ nhớ. Gói cuối: 28 tệp, ZIP 3.235.542 byte, SHA-256 7F393AD48F07BC45B9DA0B74CBF73DD1205BE002D0BE82444E45B7F820468D3C.

Git: origin mercyx03/motdoi public, connector xác nhận quyền push; nhánh codex/life-context-upgrade, remote trùng ecbcff7 trước thay đổi. Không thay workflow hoặc cấu hình triển khai; webhook/binding Cloudflare ngoài repository chưa xác minh. Chưa regression toàn bộ, thiết bị thật, save người góp ý hoặc binding Pages. Không thay API/D1. healthsys919.js và các test sửa sẵn thuộc workspace của chủ dự án, không stage; ZIP có phần sức khỏe này, không phải bản dựng sạch riêng commit mới.

Khôi phục: commit trước ecbcff77575c94084f79205ae563c4525aa44993; dựng tại bản sao riêng và upload Dashboard, không reset workspace có sửa đổi.
