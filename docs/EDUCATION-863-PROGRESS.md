# Giáo dục — phần tiếp tục8.10.63

Đang triển khai trong yêu cầu hoàn thiện toàn bộ. Sổ tổng: docs/REMAINING-863-PROGRESS.md. Các quy tắc mới là ảnh chụp nguồn10/11/2026, không hồi tố vào đời cũ. legalEffectiveAt để null khi nguồn không cho ngày hiệu lực; checkedAt không phải ngày luật ra đời.

## Dữ liệu và nguồn

- Nguồn theo từng vùng tại public/js/education863-data.js. Bổ sung38 bang/DC Mỹ,11 tỉnh/lãnh thổ Canada,6 vùngÚc và Northern Ireland; tổng danh mục76 vùng. Mode notice/registration/approval/allowed khác nhau. Louisiana và South Carolina tách đường, Tennessee có independent/umbrella. Utah/Wyoming theo thay đổi2025, Nebraska ghi nhận Rule13 hiện hành2026. Không tự cấp hỗ trợ cho mọi homeschool.
- Alberta: home-education trênAlberta.ca xác minh supervised/notification-only và hạn nhận; cap928.03CAD niên khóa2026–27 từ trang nhà cung cấp WISDOM (nguồn sơ cấp của chương trình), không trình bày là trần vĩnh viễn. Những năm tương lai trong game dùng tham số mô phỏng2026.
- Prairie South: AP270 ngày05/06/2024 và mẫu reimbursement đang được cơ sở công bố. Trần500CAD, kindergarten250; hạn tài trợ15/9 khác hạn nộp đăng ký15/8. Chỉ đúngdivision/cư trúMooseJaw hoặc mãdivision đã có. Không áp choSaskatoon/toànSK.
- NZ: nguồn BộGiáodục về khoản đầu theo phần kỳ và declaration; ngày bắt đầu/ngày ngoài nước lưu riêng, tránh chồng lặp và nhận hai lần. Lịch hồ sơ là ngày trong năm mô phỏng, không đồng hồ thật.
- Văn bằng: GED current state table, HiSET bulletin/scoring, CollegeBoard AP/SAT, Cambridge private candidates, IB DP passing criteria, DBE/Umalusi NSC, NESA HSC, VCAA VCE. URL có trong cấu hình. Phí/provider/tiếp nhận là mô phỏng; không là danh bạ hay báo giá thật. Cambridge giới hạn syllabus/options, không coi mọi môn có coursework là tự do thi.
- Các môn GCSE bổ sung: AQA8464/8461/8462/8463,8673,8633,8688; Pearson1JA0/1AA0/1TU0/1RU0. NaUy vẫn là lớp bổ trợ nếu chưa có văn bằng đúng năm; không tự gắn nhãnGCSE.
- Oxford: tham chiếu Medicine A*AA và tổ hợp Chemistry+các khoa học; Maths A*A*A, Maths/FurtherMaths theo thông tin của trường. Bộ kiểm tra chỉ kết luận phần học thuật đã biết; thi tuyển, phỏng vấn và quyết định nhận tách riêng.

## Cơ chế

Giờ dạy lưu trên cùng giám hộ, child context giữ liên kết không enumerable để không tạo vòng lặp save. Chi phí lưu chứng từ; hoàn tiền không vượt chi thực/trần; tutor không tự biến thành vật liệu được hoàn. Trợ cấpNZ giữ từng kỳ. Hồ sơ cũ không ghi rõ ngày bắt đầu dùng quy tắc thận trọng, không tự trả cả năm bắt đầu.

Khoa học GCSE chọn combined/separate trước đăng ký ở đời mới. Combined giữ hai điểm và haiaward; ba khoa học riêng giữ từng môn. Trung tâm phải hỗ trợ practical. Bản lưu cũ đã có đăng ký/kết quả không bị ép viết lại. Môn học không tự là một văn bằng.

Provider nhận hồ sơ rồi học/chuẩn bị thành phần đánh giá, sau đó thi. Dùng MOCK_EXAM853; kết quả khóa theo môn/kỳ qua cả việc nộp hồ sơ lại. AP/SAT không cấp diploma. IB kiểm tổng/HL/SL/core và điểm thấp; HiSET có tổng và essay; NSC có mứcHomeLanguage và số môn yêu cầu. HSC/VCE hoàn thành học phần có đánh giá theo năm và giữ hồ sơ; không tự cóATAR từ diploma.

Dual enrollment cần tiếp nhận trước học phần. Trường nhận xét transfer ở năm sau, giữ accepted/rejected riêng và không cộng trùng. Quay lại trường giữ học bạ/đối chiếu ở kỳ sau. Cơ sở cao đẳng mô phỏng xét diploma rồi mới cho nhập học; IGCSE không tự thành bằng cuối phổ thông hoặc suất đại học.

## Kiểm tra

education863 hiện291 kiểm tra; study-home857204; royal847248. Browser nguồn8 menu/hành động ở390/1280 đạt; smoke11, saves10, save-safety10, NPC14 đạt ở mốc đã chạy. Build/ZIP và các kiểm tra cuối ghi bổ sung sau. Không coi đây là nghiệm thu toàn diện hoặc bằng chứng APIProduction.

## Bản đóng gói checkpoint giáo dục

- package:cloudflare PASS;28 file, ZIP3.436.027 byte, SHA256 7F955A29DF0F05538D09CA4638F66B1768EB1D5CCA16F50B80D6DAB50332965F. Đã đối chiếu toàn bộ tên/nội dung từng entry ZIP với dist theo công cụ package.
- Loading/API cục bộ,8 cuộc đời nguồn/build giống nhau, catalog2865 sự kiện đạt.185 mục nhật ký cũ giữ nguyên; bản63 mới nằm đầu nguồn/dist/HTML, packaged.
- Browserdist8 menu/hành động390/1280 đạt; không tràn hoặc lỗi JS. Chưa nghiệm thu toàn diện. Không deploy; REVIEWS_DB thực tế chưa xác minh.
- Github đã kiểm đúng origin mercyx03/motdoi public, quyền push/admin;0workflow/0hook/0deployment. Chỉ push nhánh hiện tại. Các phần quốc tế/hoàng gia của yêu cầu vẫn tiếp tục trong sổ tổng.
