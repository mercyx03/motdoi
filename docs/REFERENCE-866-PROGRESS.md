# Đợt66 — đang hoàn thiện toàn yêu cầu

## Phạm vi đã triển khai

- NaN ở voters908: lỗi100/p.length (p là đối tượng) sửa thành số cha mẹ còn sống. Quyền điều hành và cổ phần giữ độc lập; không sửa tiền, cap table hoặc mã người.
- Bỏ bước đổi tên đại học hàng loạt sang tên nhóm giả; sửa Oxford/Cambridge, Harvard/MIT, Stanford và tên UCLA. Gợi ý theo firstObject846 dựa trên nhóm ngành của danh mục có sẵn, không thêm điểm hay đảm bảo trúng tuyển.
- DELF A1/A2/B1/B2 và DALF C1 trong5 mức tiếng Pháp đang hỗ trợ; giữ số cấp độ cũ. Chưa thêm C2 để tránh đổi thang và cơ chế hiện có không cần thiết.
- life112 dùng nguồn Vietcombank VND10/11/2026 10:01:01+07:00. Snapshot chuẩn hóa trong REFERENCE-VCB-866.json. Không tạo lãi suất36tháng online khi nguồn không niêm yết; không tự cộng thưởng theo năm hoặc online. Hợp đồng mới giữ provenance/earlyRate riêng; hợp đồng cũ giữ tên/rate/early fallback0.2%. Chưa có biểu cho nơi/tiền khác thì chưa mở hợp đồng mới; vẫn tất toán hợp đồng cũ. Công thức tiền lãi của game vẫn gom theo năm, chưa đối chiếu lịch ngày/365 cho tất cả hợp đồng; không khẳng định thanh toán y hệt ngân hàng thực.
- royal866 nối coParent108 theo relation108 và mã gia phả hiện có. Người trùng tên không bị gộp; bạn đời mới không tự thay cha mẹ lúc sinh. Không dời nhánh/họ/ID của dữ liệu cũ. Thiếu nguồn giữ chưa xác định; mâu thuẫn đánh dấu pending và chặn auto accession. Giữ ngày biết nguồn đầu tiên; họ đã có không bị ghi đè.
- Gỡ một số nhãn thừa ở đời sống/công việc/hoàng gia; chi phí/giá chưa có báo giá giữ từ ước tính. Đây chưa phải chuyển toàn bộ dữ liệu game thành dữ liệu đã xác minh.

## Nguồn đã dùng

- https://www.france-education-international.fr/hub/diplomes-tests?langue=fr — DELF A1–B2, DALF C1/C2; bằng không hết hạn theo FEI. Game chưa tăng số cấp lênC2.
- https://www.vietcombank.com.vn/vi-VN/KHCN/Cong-cu-Tien-ich/KHCN---Lai-suat — currentDataInterestRate trong HTML công khai; VND Savings/FixedDeposit/Online. Giữ mốc nguồn và không gọi bảng này là báo giá tương lai.
- https://www.ox.ac.uk/admissions/undergraduate/courses/course-listing/medicine — A1006năm, A*AA, hạn15/10/2026; CHƯA biến thông tin này thành cơ chế nhập học đầy đủ.
- https://hms.harvard.edu/education-admissions/md-program/admissions/preparing-apply/prerequisite-courses — đường MD và môn tiên quyết; CHƯA sửa xong toàn bộ đường Y/Luật sau bachelor tạiMỹ.
- https://www.ucla.edu/about — UCLA là cơ sở riêng; không gộp Berkeley.
- https://www.harvard.edu/visit/ ; https://www.stanford.edu/contact/ — trường/địa điểm.

## Kiểm thử và artifact

Ghi kết quả thực tế sau khi hoàn tất đợt kiểm tra. Không chạy regression toàn diện theo yêu cầu. Build và ZIP chỉ Preview khi dữ liệu/toàn phạm vi còn mở. Không deploy; binding REVIEWS_DB Production chưa xác minh. Artifact còn bao gồm thay đổi healthsys919 có sẵn của workspace không nằm trong commit đợt này.

## Còn phải tiếp tục — không gộp vào nghiệm thu toàn diện

- Rà toàn bộ87file/260dòng kiểm kê ban đầu và các từ hư cấu/tham số khác; không được coi bỏ chữ là đã thay bằng dữ liệu thật. Các tên placeholder ngoài những trường đã có, ngân hàng ngoàiVN, giải/CLB bóng đá, dữ liệu di trú/y tế/học phí/điểm tuyển sinh vẫn phải đối chiếu.
- life67 fallback đại học công lập chưa có danh tính; các chương trình chia chung theo nhóm ngành còn có nguy cơ gán ngành sai trường, và tuyển sinh Y/LuậtMỹ chưa tách đúng bachelor/graduate. Ngưỡng điểm hiện là tham số, chưa điểm chuẩn chính thức từng ngành/kỳ.
- Nghĩa vụ giáo dục từng vùng, các luật/chuyển tiếp EU6, Monaco1882/trước2002, Spain trước1978/1987 và đổi thứ tự họ trẻ fullsiblings theo chuyển tiếp2000: xem REMAINING-863-PROGRESS.md/ROYAL-865-PROGRESS.md. Chưa đánh dấu xong.
- Một số sự kiện/chi phí/nhân vật là kết quả phát sinh của cuộc đời, không thể biến thành dữ kiện lịch sử của một người thật. Chỉ dữ liệu tham chiếu có nguồn mới được đánh dấu xác minh.

## Kết quả kiểm tra hiện tại

- PASS: royal86629, reference86623, dynasty9082285, expansion842341, feedback-b1954, royal865158, spain862198, monaco861126, royal85884, royal84359, royal847248, royal860153, royal864808, education863291, children14138, university136, birthday84596. Browser nguồn6view tại390/1280 đạt (trường, ngân hàng, phiếu phụ huynh).
- Bốn test FAIL có cùng lỗi khi chạy lại nguồn nguyên HEAD a5800ea bằng git cat-file, không sửa workspace: depth899 admission keeps employment until visa; origins-clubs904 adopted undefined!=12; life138 sibling can succeed; continuity101 scholarship stipend. Không tính các nhóm này đạt. Cần đối chiếu luồng mới/test cũ, chưa đủ căn cứ gọi đều là bug gameplay.
- Công cụ audit-reference-data quét264filepublic JS/JSON/HTML (trừ nhật ký lịch sử),104file/369dòng có từ khóa mô phỏng/hư cấu/tham số/chưa đối chiếu. Đây là sổ ứng viên cần kiểm chứng, KHÔNG kết luận369lỗi, cũng KHÔNG bằng chứng dữ liệu còn lại đều thật. Snapshot tạm .cache/reference-audit866.json.

Bổ sung cuối66: bỏ bước đổi tên THPT đã có sang nhóm giả; giữ ngưỡng mục tiêu riêng, không công bố đó là điểm chuẩn chính thức. Rà lời phần tuyển sinh/GCSE/IB/học tại nhà và gỡ nhãn thừa, phí chưa có báo giá ghi dự kiến. study-home857204 và education863291 sau sửa đạt.

Kiểm tra bổ sung: exam-model565(n=96000/48nhóm), objects84688, leadership-education39, exam127244, education-fallback-graduation104 PASS. study829 và school-home-police838 FAIL và cùng assertion khi chạy nguồn HEAD a5800ea; tổng6nhóm FAIL nền đã đối chiếu, không tính đạt. Thay kiểm tra cũ yêu cầu đổi tên thật thành giả trong exam-model bằng kiểm tra tách tên cơ sở khỏi ngưỡng điểm mục tiêu và giữ thông báo không phải điểm chuẩn thật.
Smoke11/saves10/save-safety10/NPC14 PASS sau thay đổi ngân hàng; full regression chưa chạy.

Artifact cuối66: npm run package:cloudflare PASS;28file;ZIP3,464,605bytes;SHA256E9B0A4595CCB16BFC86C95B0495C9CA8621C365A82AD95E25395B1EE1A104725. So mọi entry/hash với dist đạt; loading8cuộcđời nguồn/build giống nhau; API/admin cục bộ đạt. Nhật ký189mục,188mục cũ giữ nguyên; nguồn/dist/HTML có66packaged. Chưa đủ toàn phạm vi, CHƯA sẵn sàng Production; không deploy.
