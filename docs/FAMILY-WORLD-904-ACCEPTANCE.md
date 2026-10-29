# Gia đình nguồn cội và học đường thế giới 8.10.4

Trạng thái: HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN.

## Phạm vi

- Mở rộng mc_nhan_nuoi của life88; trẻ 1–15 tuổi, tối đa ba cơ hội cách nhau ba năm. Cập nhật hồ sơ người chăm sóc và bố mẹ nuôi, giữ nguồn gốc.
- Mở rộng mc_tim_bo_me: hồ sơ tìm thân nhân còn mở có thể có kết quả những năm sau. Người thân chủ động tìm đến qua originsContact, xác minh trước khi gặp. Ba/mẹ/cả hai, quan hệ còn chung sống/đã chia tay và điều kiện sống được tạo một lần rồi lưu.
- originsFamily: gặp tối đa một lần/năm, tăng tin cậy; ở lại hoặc ngừng liên hệ; ít nhất hai lần gặp qua các năm mới xin chuyển về, chờ ít nhất một năm, có thể cần chờ thêm với trẻ vị thành niên. Gia đình hiện tại không bị thay ngay lúc chọn. Khi chuyển, giữ household, biographies, family100 cũ; cập nhật nguồn chi phí chăm sóc mới. Người thân ruột cao tuổi có nguy cơ qua đời, không tự trở lại từ hoàn cảnh cha mẹ đã xác định chết.
- Sinh đôi ở nhân vật mới dùng RNG riêng, cùng born=0 trong sibList; tên, vai anh/chị/em, tính cách, tương tác và mức gắn bó riêng. Không sinh thêm trong migrate. Nhánh thừa kế giữ danh sách anh chị em hiện có.
- Giao diện world bỏ danh sách quốc gia, xóa lựa chọn quốc gia cũ cho đời mới. Engine giữ tham số country để hỗ trợ test, thừa kế và tái dựng dữ liệu.
- Nguyện vọng life67 dùng localSchools theo nơi cư trú. Giữ thứ tự, điểm xét, ngành, nhập học, tín chỉ, tốt nghiệp và định danh trường. Không cho hồ sơ xuyên quốc gia hoặc tuyển thẳng Việt Nam liệt kê trường nước ngoài. Không áp IELTS mặc định của Việt Nam cho trường quốc tế.
- 7 trường thật tại JP/KR/TH/CN, thêm trường công lập mô phỏng tại mỗi nước ngoài Việt Nam. Nhóm ngành khái quát, không phải danh mục mọi chương trình; điểm và thời gian trong game là mô hình rút gọn. Các kỳ thi, lễ và môi trường sống dùng hồ sơ văn hóa173 hiện có, không tuyên bố vừa tạo mới toàn bộ.
- Câu lạc bộ học sinh phổ thông 15–18 tuổi: chọn nhóm hoặc về nhà, luyện tập mỗi năm, liên trường sau hai đợt qua các năm, kỹ năng dùng LIFE138. Đổi nhóm đặt lại luyện tập; đổi trường/nước lưu lịch sử và lập nhóm mới. Hồ sơ lưu kết quả, không tự cộng điểm trúng tuyển.

## Đã kiểm

- tests/origins-clubs904.js: nhận nuôi ở 12 tuổi, hồ sơ người nuôi, ở lại, hai lần gặp, chờ chuyển nhà, lưu/tải giữa chuỗi, mẹ/ba/cả hai, không cho cha mẹ đã chết trở về, sinh đôi không trùng và không nhân đôi khi tải, trường địa phương đủ 195 quốc gia, nhập học thật qua nguyện vọng tại bốn quốc gia, hoạt động và kết quả CLB qua các năm.
- npm run test:quick: smoke 11/11, saves 10/10, save-safety 10/10, NPC 14/14. Có các cảnh báo cũ về định danh theo giờ thật và sự kiện Hardcore đã bỏ; không phải lỗi mới.
- tests/world-culture173.js: 854 kiểm tra; tests/world120.js: 74; tests/exam127.js: 244; tests/residence897.js, tests/university136.js đạt.
- family104: 101 kiểm tra; family126: 24; family130: 67 đạt.
- Chrome headless: tests/origins-clubs904-browser.js đạt 390/1280px: selector chỉ ngẫu nhiên, gặp gia đình ruột, chọn CLB, lưu dữ liệu, không tràn ngang hoặc lỗi runtime. Nhật ký đủ 8 ý, nhãn Đã phát hành, tìm không dấu, bộ lọc và tải thêm đạt. Ảnh kiểm tra ở .cache/origins904 (không commit).

## Không tính PASS

- family830: “can interact with another child in same year”.
- family129: “purchase 1”.
- adult106: khung bảo vệ tiến sĩ không được tạo ở mốc test cũ.

Cả ba tái hiện với cùng lỗi trên HEAD trước sửa 07e5fec327adc750552175c7b5d0ad94771747bc bằng bộ nạp nguồn git show HEAD trong bộ nhớ; không sửa mã nguồn cũ hoặc đổi kỳ vọng để che lỗi. Nhóm test:family và test:university vì vậy không đạt toàn bộ. Xem phần GĐ6 trong BACKLOG.

Chưa chạy regression toàn bộ, thiết bị Android/iOS thật, mẫu save thật và xác minh binding Pages REVIEWS_DB. Gói này vẫn dành cho Preview khi chưa nghiệm thu toàn diện; nhãn nhật ký “Đã phát hành” là chỉ thị riêng trong yêu cầu lần này, không xác nhận upload Production. Không deploy hoặc ghi D1.

## Nguồn dữ liệu trường

Đối chiếu trang chính thức ngày 29/10/2026. Chỉ ánh xạ nhóm ngành có khoa/chương trình phù hợp, không lấy ngưỡng điểm hay điều kiện nhận nuôi pháp lý ngoài đời từ đây.

- University of Tokyo: https://www.u-tokyo.ac.jp/en/academics/faculties.html
- Kyoto University: https://www.kyoto-u.ac.jp/en/education-campus/education-and-admissions/undergraduate-degree-programs/faculties2
- Seoul National University: https://en.snu.ac.kr/academics/programs/undergraduate
- Yonsei University: https://yonsei.ac.kr/en_sc/2245/subview.do
- Chulalongkorn University: https://www.chula.ac.th/wp-content/uploads/2024/05/CU_Brochure-2024-website_compressed.pdf
- Peking University: https://dean.pku.edu.cn/web/about.php
- Tsinghua University: https://www.tsinghua.edu.cn/en/Admissions/Undergraduate/Degree_Programs.htm
- Văn hóa, thi cử và sinh hoạt địa phương: docs/culture-sources.md (hồ sơ173 có sẵn).

## Đóng gói và GitHub

Lệnh bắt buộc npm run package:cloudflare dựng riêng bằng tools/build.js; giữ 28 file Direct Upload, kiểm cú pháp/tài nguyên/hash và 8 cuộc đời nguồn–build giống nhau; test admin/Worker bằng dữ liệu cục bộ. ZIP được đọc lại so toàn bộ tên và SHA-256 với dist. Lần đóng gói cuối phải chạy sau mọi thay đổi nguồn. Không đưa binding hay dữ liệu D1 vào ZIP.

Repository origin: mercyx03/motdoi, public; connector xác nhận quyền push/admin. Nhánh hiện tại codex/life-context-upgrade, không merge main; không có .github/workflows trong checkout. Cấu hình Pages và deployment hook bên ngoài chưa xác minh; quy trình dự án dùng chủ upload thủ công, không chạy deploy. Không chỉnh quyền, remote hoặc dự án Pages.

Khôi phục mã: commit trước đợt này 07e5fec327adc750552175c7b5d0ad94771747bc. Có thể kiểm tra commit đó trong checkout riêng để đóng gói lại; với nhánh đã chia sẻ dùng git revert commit mới rồi package lại, không force-push hoặc reset lịch sử. Chủ dự án tự upload lại ZIP ổn định qua Dashboard nếu cần.

Regression trọng điểm 904: các nhóm 46,50,65,67,68,70,72,73 chạy trọn, 97 đạt/1 lỗi ở nhóm50: kỳ vọng người Việt định cư nước ngoài không dùng chuyện địa phương (đã được văn hóa173 thay đổi). Đối chiếu nguyên HEAD trước sửa nhóm50 cũng 14 đạt/1 cùng lỗi; không tính nhóm này PASS. Ba lỗi kiểm thử cũ nêu trên vẫn còn.

Artifact cuối: 28 file; dist.zip 2.665.707 byte; SHA-256 363CF877B561586D54D7E4C6D5147A3AE5B309D78DBD3D7C667DBE53EAC45F1A. Kiểm browser cả nguồn và dist cuối tại 390/1280px đều đạt; kiểm trình dựng lịch sử trong bộ nhớ giữ nguyên toàn bộ 128 mục, mục904 đầu danh sách và dữ liệu nhúng/JSON đồng nhất.
