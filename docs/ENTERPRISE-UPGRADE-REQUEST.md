# MỘT ĐỜI — HOÀN THIỆN A–E VÀ NÂNG CẤP TOÀN DIỆN QUẢN TRỊ DOANH NGHIỆP, TẬP ĐOÀN

## 0. NHIỆM VỤ TỔNG THỂ

Bạn là Codex, tiếp tục phát triển game mô phỏng cuộc đời **Một Đời** tại `https://motdoi.site`, repository `mercyx03/motdoi`.

Tôi giao **hai nhiệm vụ bắt buộc phải hoàn thành trong cùng đợt nâng cấp**:

**Nhiệm vụ 1:** Hoàn thiện tất cả phần còn thiếu của đợt nâng cấp logic cuộc sống A–E, dựa trên checkpoint `cfd8fd3` và `docs/LIFE-CONTEXT-PROGRESS.md`.

**Nhiệm vụ 2:** Triển khai đầy đủ hệ thống quản trị doanh nghiệp, tập đoàn, báo cáo tài chính, chiến lược phát triển, nhân sự, đào tạo người kế nghiệp và cố vấn dài hạn.

**Đây là yêu cầu lập trình thực tế, không phải yêu cầu lập kế hoạch. Hãy triển khai, kiểm thử, commit, push và đóng gói bản build cuối cùng.**

### Tiếp nhận mã nguồn

1. Kiểm tra repository, nhánh hiện tại, HEAD và Git status.
2. Đọc `AGENTS.md`, tài liệu tiến độ A–E và các module liên quan.
3. Tiếp tục từ HEAD mới nhất trên nhánh `codex/life-context-upgrade` hoặc nhánh kế thừa chứa toàn bộ thay đổi đã xác minh.
4. Không quay về commit cũ hoặc `main`.
5. Giữ nguyên ba file cá nhân được bảo vệ và các thay đổi chưa commit không thuộc nhiệm vụ.
6. Không reset cứng, force push hoặc ghi đè công việc chưa được lưu.
7. Kiểm tra chức năng đã có trước khi bổ sung, không viết lại hệ thống tương đương.

### Nguyên tắc thực hiện

- GĐ0–GĐ6 và các phần đã nghiệm thu trước đây không cần chạy lại toàn bộ.
- Không chạy regression 77 mục chỉ để xác nhận một thay đổi nhỏ.
- Không mô phỏng hàng nghìn cuộc đời nhiều lần không cần thiết.
- Không xóa, vô hiệu hóa hoặc thay thế sự kiện cũ.
- Không tạo hệ thống tài chính hay doanh nghiệp song song với engine hiện tại.
- Không thay đổi ID NPC, ID doanh nghiệp hoặc schema bản lưu cũ một cách không cần thiết.
- Không bỏ assertion, sửa kỳ vọng test để che lỗi hoặc giảm độ phủ chỉ để PASS.
- Chỉ kiểm thử lại phần liên quan đến mã vừa sửa.
- Gom thay đổi theo module để tránh build và test lặp.
- Không tự deploy Production.
- Không tự merge vào `main`.

**Tuyệt đối không tuyên bố hoàn thành toàn bộ nếu vẫn còn chức năng chưa triển khai hoặc chưa kiểm chứng.**

---

# PHẦN A — HOÀN THIỆN TOÀN BỘ NÂNG CẤP LOGIC CUỘC SỐNG CÒN THIẾU

## A1. Hoàn thiện liên kết sự kiện với gia cảnh

Checkpoint trước đã sửa sự kiện thôi nôi và một số logic học tập. Hãy tiếp tục mở rộng sang các sự kiện liên quan:

- Sinh nhật, lễ Tết, cưới hỏi và họp mặt gia đình.
- Học tập, học thêm, học bổng, du học.
- Chăm sóc sức khỏe, chữa bệnh và bảo hiểm.
- Du lịch, nghỉ dưỡng và giải trí.
- Mua sắm, nhà ở, xe cộ.
- Khởi nghiệp, kinh doanh, đầu tư.
- Nuôi dạy con và chăm sóc cha mẹ.
- Hoạt động xã hội, tiệc doanh nhân, giới thượng lưu.

Yêu cầu:

- Gia đình khó khăn có ít lựa chọn tốn kém hơn, nhưng vẫn có các lựa chọn giản dị và cơ hội nhận hỗ trợ.
- Gia đình giàu có có khả năng tiếp cận dịch vụ, giáo dục và quan hệ chất lượng cao hơn.
- Không mặc định người nghèo luôn gặp xui xẻo hoặc người giàu luôn thành công.
- Các lựa chọn phải xét tài chính, tuổi, sức khỏe, quan hệ, nơi sống và thời kỳ.
- Chi phí phải phù hợp quốc gia và sức mua.
- Tận dụng hệ thống trọng số hoàn cảnh GĐ3, chuỗi hậu quả GĐ4 và điều tiết GĐ5.
- Không sửa hàng nghìn sự kiện bằng tay nếu có thể dùng cơ chế chung.
- Giữ các ID và nội dung cũ, chỉ bổ sung điều kiện hoặc phương án hợp lý.

Bổ sung gia đình nghệ thuật nhiều thế hệ, kỳ vọng nối nghiệp và cơ hội casting phù hợp độ tuổi, nhưng không bắt buộc con cái phải theo nghề bố mẹ.

## A2. Hoàn thiện hồ sơ và tài chính riêng của người thân

Mở rộng hồ sơ bạn đời và con cái:

- Thu nhập cá nhân.
- Tiền tiết kiệm.
- Chi phí sinh hoạt.
- Nợ cá nhân.
- Tài sản riêng.
- Tài sản chung.
- Tài sản được tặng.
- Tài sản thừa kế.
- Cổ phần doanh nghiệp.
- Bằng cấp và chứng chỉ.
- Thành tích học tập, nghề nghiệp.
- Uy tín nghề nghiệp và cộng đồng.
- Quan hệ xã hội và mạng lưới kinh doanh.

Tài chính phải có lịch sử và nguồn phát sinh hợp lý, không tự random lại khi mở hồ sơ.

Phân biệt rõ:

- Tiền của bố mẹ.
- Tiền của con.
- Tiền của bạn đời.
- Tài sản chung.
- Tài sản riêng.
- Tài sản doanh nghiệp.

Không tự chuyển tiền giữa các cá nhân nếu không có giao dịch hoặc sự kiện hợp lệ.

Không nhân đôi tài sản khi kết hôn, ly hôn, tặng tài sản, chuyển cổ phần hoặc thừa kế.

Không tạo hồ sơ tài chính trưởng thành vô lý cho trẻ nhỏ.

## A3. Hoàn thiện nhượng quyền và chuyển nhượng doanh nghiệp

Phân biệt các hành động:

**Nhượng quyền thương mại**
- Cho phép đối tác khai thác thương hiệu hoặc mô hình kinh doanh.
- Có phí ban đầu, phí định kỳ, điều kiện hợp đồng.
- Có thể phát sinh vi phạm, gia hạn hoặc chấm dứt hợp đồng.
- Không tự chuyển quyền sở hữu toàn bộ doanh nghiệp.

**Bán doanh nghiệp**
- Có người mua.
- Có định giá và đàm phán.
- Có điều kiện thanh toán.
- Chuyển quyền sở hữu sau khi giao dịch hợp lệ.

**Chuyển cổ phần cho con**
- Chuyển tỷ lệ sở hữu.
- Đồng bộ hồ sơ tài sản.
- Không tự chuyển quyền điều hành.

**Giao quyền điều hành**
- Có thể bổ nhiệm CEO hoặc tổng giám đốc.
- Người được bổ nhiệm không nhất thiết sở hữu công ty.

**Kế nghiệp gia đình**
- Có thể chọn người kế nhiệm.
- Xét năng lực, kinh nghiệm, quan hệ và nguyện vọng.
- Có thể từ chối hoặc chưa đủ khả năng tiếp quản.

Các hành động phải kết nối với hệ thống doanh nghiệp, di chúc, gia đình và quyền lực kinh tế hiện có.

## A4. Rà soát tăng trưởng và định giá tập đoàn dài hạn

Kiểm tra các trường hợp:

- Công ty tăng trưởng qua 10–30 năm.
- Công ty có giá trị rất lớn.
- Doanh nghiệp lãi nhưng thiếu tiền mặt.
- Công ty vay nợ để mở rộng.
- Công ty trả cổ tức.
- Công ty có nhiều công ty con.
- Chủ sở hữu nắm cổ phần ở nhiều doanh nghiệp.
- Công ty phá sản, sáp nhập hoặc được mua lại.

Phân biệt vốn, tài sản, nợ, doanh thu, lợi nhuận, định giá và tài sản cá nhân.

Không tự ý giảm tài sản của bản lưu cũ chỉ vì con số lớn.

Nếu phát hiện công thức sai, sửa nguyên nhân gốc và bảo vệ dữ liệu cũ.

## A5. Hoàn thiện đội ngũ quản lý truyền thông

Từ hệ thống ủy quyền hiện tại, bổ sung các vai trò:

- Quản lý cá nhân.
- Trợ lý.
- Social Media Manager.
- Booking Manager.
- PR Manager.
- Biên tập viên.
- Nhiếp ảnh gia.
- Quản lý quảng cáo.
- Đội ngũ truyền thông chuyên nghiệp.

Mỗi vai trò có:

- Năng lực.
- Mức lương.
- Hợp đồng.
- Phạm vi công việc.
- Hiệu suất.
- Khả năng nghỉ việc hoặc bị thay thế.

Liên kết với chế độ tự động:

- Đăng bài.
- Livestream.
- Sắp xếp lịch.
- Tìm hợp đồng quảng cáo.
- Đề xuất giao lưu người nổi tiếng.
- Quản lý nội dung.
- Theo dõi tăng trưởng.

Không tự ký hợp đồng lớn hoặc chi vượt ngân sách được ủy quyền.

Không tăng follower hoặc thu nhập vô hạn.

## A6. Hoàn thiện chuyển và rời công ty thực tập sinh K-pop

Bổ sung:

- Xin chuyển công ty.
- Kết thúc hợp đồng.
- Bị loại khỏi chương trình đào tạo.
- Gia hạn hợp đồng.
- Được công ty khác tiếp cận.
- Tạm nghỉ vì học tập hoặc sức khỏe.
- Trở về quốc gia cư trú nếu phù hợp.
- Thử audition lại sau khi rời công ty.

Phải giữ lịch sử thực tập, kỹ năng và danh tính NPC.

Với người chưa thành niên, xét người giám hộ, học tập, nơi cư trú và điều kiện phù hợp.

Không xóa hoặc viết lại hệ thống audition, K-pop và Showbiz đang có.

---

# PHẦN B — BÁO CÁO TÀI CHÍNH VÀ DÒNG TIỀN DOANH NGHIỆP

## B1. Xây dựng báo cáo tài chính hằng năm

Mỗi doanh nghiệp phải có mục **Báo cáo tài chính**, hiển thị:

- Doanh thu.
- Giá vốn hoặc chi phí trực tiếp.
- Lợi nhuận gộp.
- Chi phí vận hành.
- Chi phí nhân sự.
- Chi phí quản lý.
- Chi phí marketing.
- Chi phí nghiên cứu và phát triển.
- Chi phí khấu hao nếu mô hình có dữ liệu.
- Lãi vay.
- Thuế mô phỏng.
- Lợi nhuận trước thuế.
- Lợi nhuận sau thuế.
- Tiền mặt doanh nghiệp.
- Dư nợ vay.
- Cổ tức.
- Lợi nhuận giữ lại.
- Tiền tái đầu tư.
- Dòng tiền kinh doanh.
- Dòng tiền đầu tư.
- Dòng tiền tài trợ.
- Dòng tiền ròng.

Tận dụng dữ liệu doanh nghiệp đang có.

Không tự tạo bộ tài chính độc lập với số liệu hiện tại.

### Quy tắc tính toán

- Doanh thu không phải lợi nhuận.
- Lợi nhuận không phải tiền mặt.
- Tiền vay không phải doanh thu.
- Vốn điều lệ không phải tiền mặt sẵn có.
- Giá trị cổ phần không phải tiền mặt.
- Chi đầu tư tài sản không mặc định là toàn bộ chi phí hoạt động.
- Trả nợ gốc không được tính như chi phí lãi vay.
- Cổ tức không được trả vượt nguồn có thể phân phối.
- Không cộng lợi nhuận công ty trực tiếp vào tài khoản cá nhân.
- Không ghi nhận cùng một giao dịch hai lần.

Ví dụ: Doanh thu 100 tỷ, chi phí 75 tỷ, lãi vay 5 tỷ và thuế mô phỏng 4 tỷ thì lợi nhuận sau thuế là 16 tỷ. Nhưng dòng tiền có thể khác do đầu tư, trả nợ và vốn lưu động.

### Dữ liệu lịch sử

Mỗi năm tài chính phải được chốt một lần.

Không được tính lại và thay đổi số liệu năm trước chỉ vì người chơi mở bảng.

Nếu dữ liệu bản lưu cũ không đủ chi tiết, dùng phương án chuyển đổi tương thích và đánh dấu số liệu ước tính khi cần. Không trình bày số liệu dựng lại như báo cáo lịch sử chính xác.

## B2. So sánh năm hiện tại và năm trước

Hiển thị:

- Giá trị năm nay.
- Giá trị năm trước.
- Chênh lệch.
- Tỷ lệ tăng giảm.
- Xu hướng tài chính.

Áp dụng cho doanh thu, lợi nhuận, dòng tiền, nợ và nhân sự.

Doanh nghiệp chưa đủ một năm không có báo cáo năm trước giả.

## B3. Biểu đồ tài chính

Tạo biểu đồ:

- Doanh thu 5–10 năm.
- Lợi nhuận 5–10 năm.
- Dòng tiền.
- Nhân viên.

Có thể chuyển giữa các chỉ số.

Hỗ trợ điện thoại và máy tính.

Ưu tiên giải pháp nhẹ, không tăng đáng kể kích thước build.

---

# PHẦN C — CHIẾN LƯỢC PHÁT TRIỂN DOANH NGHIỆP

## C1. Các quyết định chiến lược

Bổ sung:

**Mở rộng chi nhánh**
- Tốn vốn.
- Tăng năng lực kinh doanh.
- Có rủi ro thất bại.

**Tăng nhân sự**
- Tăng năng lực vận hành.
- Tăng chi phí lương.
- Có thể tăng doanh thu.

**Đầu tư công nghệ**
- Tăng năng suất.
- Có thể giảm chi phí dài hạn.
- Tác động tùy ngành.

**Nâng cao chất lượng sản phẩm**
- Tốn chi phí nghiên cứu, đào tạo hoặc sản xuất.
- Có thể tăng uy tín và sức cạnh tranh.

**Mở rộng ra nước ngoài**
- Chọn quốc gia mục tiêu.
- Xét vốn, năng lực, thị trường và điều kiện kinh doanh.
- Có chi phí, thời gian và rủi ro.

**Tiết giảm chi phí**
- Có thể tăng lợi nhuận ngắn hạn.
- Cắt giảm quá mức có thể gây bất mãn và giảm chất lượng.

**Tái đầu tư lợi nhuận**
- Giữ lại tiền phát triển.
- Giảm nguồn cổ tức.
- Có thể cải thiện tăng trưởng dài hạn.

## C2. Cơ chế chiến lược

Mỗi chiến lược có:

- Điều kiện mở khóa.
- Ngân sách.
- Thời gian thực hiện.
- Người phụ trách nếu phù hợp.
- Xác suất kết quả theo bối cảnh.
- Hiệu quả ngắn hạn.
- Hiệu quả dài hạn.
- Rủi ro và hậu quả.

Không tăng chỉ số vô hạn bằng cách bấm lặp.

Không cho phép dùng cùng một khoản tiền để tài trợ nhiều chiến lược nếu nguồn tiền không đủ.

Không cho phép doanh nghiệp mở rộng vô hạn mà không có nhân lực, vốn hoặc năng lực vận hành.

Kết quả chiến lược phải ảnh hưởng đến báo cáo tài chính, nhân viên và uy tín.

---

# PHẦN D — ĐÁNH GIÁ HIỆU SUẤT

## D1. Chỉ số hiệu suất doanh nghiệp

Bổ sung:

- Hiệu quả kinh doanh.
- Tăng trưởng doanh thu.
- Biên lợi nhuận.
- Khả năng thanh toán.
- Sức khỏe dòng tiền.
- Năng suất lao động.
- Hoàn thành mục tiêu.
- Hài lòng nhân viên.
- Uy tín doanh nghiệp.
- Niềm tin khách hàng và đối tác.
- Chất lượng quản trị.

Không tạo các chỉ số ngẫu nhiên độc lập với tình hình công ty.

Nếu dùng điểm tổng hợp, phải có công thức minh bạch.

## D2. Đánh giá cuối năm

Ví dụ nhận xét:

- Doanh thu tăng nhưng lợi nhuận giảm.
- Doanh nghiệp tăng trưởng tốt.
- Chi phí nhân sự đang vượt tốc độ tăng năng suất.
- Dòng tiền thiếu hụt.
- Đầu tư công nghệ bắt đầu có hiệu quả.
- Mở rộng quốc tế chưa đạt kỳ vọng.
- Nhân viên mất niềm tin vào ban lãnh đạo.

Nhận xét phải dựa trên dữ liệu và các quyết định đã thực hiện.

---

# PHẦN E — NHÂN SỰ VÀ QUY MÔ DOANH NGHIỆP

## E1. Số lượng nhân viên

Mỗi doanh nghiệp có số lượng nhân viên phù hợp với:

- Ngành nghề.
- Quy mô doanh thu.
- Số chi nhánh.
- Năng suất.
- Công nghệ.
- Chiến lược.
- Khả năng tài chính.

Không tạo hàng nghìn NPC riêng cho nhân viên phổ thông.

Sử dụng số lượng tổng hợp, chỉ tạo NPC có danh tính cho nhân sự quản lý và những người thực sự tương tác.

Nếu bản lưu cũ chưa có số nhân viên, khởi tạo theo quy tắc có thể giải thích và không thay đổi ngẫu nhiên khi mở giao diện.

## E2. Quản lý nhân sự

Bổ sung các hành động:

**Tuyển dụng**
- Chọn số lượng.
- Có chi phí tuyển dụng.
- Có chi phí lương.
- Có thể thiếu ứng viên phù hợp.

**Bổ nhiệm quản lý**
- Chọn người phù hợp.
- Có thể bổ nhiệm người thân.
- Xét năng lực và kinh nghiệm.

**Điều chỉnh lương thưởng**
- Tăng lương.
- Thưởng thành tích.
- Điều chỉnh chính sách đãi ngộ.
- Có tác động tới chi phí và sự hài lòng.

**Đào tạo**
- Chọn ngân sách.
- Chọn mục tiêu.
- Có thời gian thực hiện.
- Tăng năng suất hoặc kỹ năng theo kết quả.

**Đánh giá nhân sự**
- Năng suất.
- Chất lượng công việc.
- Kinh nghiệm.
- Gắn bó.
- Nghỉ việc.
- Tiềm năng thăng tiến.

Không trừ chi phí lương hai lần giữa hệ thống nhân sự và báo cáo tài chính.

---

# PHẦN F — SỰ KIỆN BAN LÃNH ĐẠO

## F1. CEO đề nghị tăng lương hoặc thưởng

Các lựa chọn:
- Đồng ý.
- Đồng ý một phần.
- Từ chối.
- Thưởng theo kết quả.
- Đàm phán lại.

Tác động đến chi phí, lòng trung thành và hiệu suất.

## F2. CFO phát hiện khoản chi bất thường

Các lựa chọn:
- Kiểm toán.
- Điều tra.
- Tạm dừng khoản chi.
- Bỏ qua.
- Xử lý khi có bằng chứng.

Kết quả có thể là lỗi kế toán, khoản chi hợp lệ, quản lý yếu kém hoặc gian lận.

Không mặc định là tham nhũng.

## F3. Giám đốc xuất sắc được đề nghị thăng chức

Có thể:
- Tăng lương.
- Thưởng.
- Thăng chức.
- Giao chi nhánh.
- Đưa vào ban điều hành.

Giữ nguyên UID và hồ sơ NPC.

## F4. Lãnh đạo xin nghỉ để sang đối thủ

Có thể:
- Giữ chân.
- Tăng đãi ngộ.
- Đàm phán bàn giao.
- Tìm người thay thế.
- Chấp nhận cho nghỉ.

Nếu nghỉ thật, chức vụ và hiệu suất phải thay đổi.

## F5. Con được bổ nhiệm nhưng thiếu kinh nghiệm

Có thể:
- Thuê cố vấn.
- Đưa đi đào tạo.
- Giảm phạm vi trách nhiệm.
- Chuyển vị trí.
- Cho cơ hội chứng minh năng lực.

Có thể tiến bộ hoặc tiếp tục mắc sai lầm.

Không tự động thành công vì là con chủ doanh nghiệp.

## F6. Hội đồng quản trị bất đồng về mua lại công ty

Có thể:
- Thảo luận lại.
- Đàm phán.
- Điều chỉnh giá.
- Biểu quyết.
- Hoãn hoặc hủy.

Phải xét tỷ lệ cổ phần và quyền biểu quyết.

## F7. Nhân viên mất niềm tin

Nguyên nhân:
- Cắt giảm lương.
- Sa thải.
- Quyết định sai.
- Không thực hiện cam kết.
- Môi trường làm việc xấu.

Hậu quả:
- Giảm năng suất.
- Tăng nghỉ việc.
- Giảm uy tín.
- Phát sinh yêu cầu cải thiện.

Có thể phục hồi qua chính sách và hành động phù hợp.

### Quy tắc chung

- Không xuất hiện CEO/CFO nếu doanh nghiệp không có chức vụ tương ứng.
- Không tự tạo hội đồng quản trị không phù hợp.
- Không lặp khủng hoảng vô lý mỗi năm.
- Các sự kiện quan trọng có hậu quả kéo dài.
- Tận dụng GĐ4 và GĐ5.
- Không spam popup khi sở hữu nhiều công ty.
- Các sự kiện phải liên kết với số liệu thực tế.

---

# PHẦN G — CHO CON THỰC TẬP 2–3 NĂM TẠI TẬP ĐOÀN

## G1. Chương trình thực tập

Cho phép con đủ tuổi và điều kiện tham gia:

- Thực tập quản trị.
- Thực tập kinh doanh.
- Thực tập tài chính.
- Thực tập nhân sự.
- Thực tập công nghệ.
- Thực tập chi nhánh.
- Chương trình đào tạo kế nhiệm.

Có thể chọn chương trình 2 hoặc 3 năm.

### Năm 1 — Làm quen

- Học quy trình.
- Làm việc cùng nhân viên.
- Được đánh giá thái độ và năng lực.

### Năm 2 — Thực hành

- Tham gia dự án.
- Học quản lý nhóm.
- Có thể mắc sai lầm hoặc đạt thành tích.

### Năm 3 — Đánh giá kế nghiệp

- Đảm nhận dự án quan trọng hơn.
- Được đánh giá năng lực.
- Có thể nhận lời mời làm việc chính thức.
- Có thể chưa đủ điều kiện giữ chức vụ cao.

### Quy tắc

- Lưu UID và lịch sử của con.
- Không bắt buộc con kế nghiệp.
- Con có thể từ chối.
- Không tự động trở thành CEO.
- Không tăng kỹ năng vô hạn.
- Có trợ cấp hoặc lương nếu phù hợp.
- Không làm việc toàn thời gian ở hai nơi không tương thích.
- Liên kết với chức vụ, cổ phần, gia đình và di chúc.

---

# PHẦN H — CỐ VẤN RIÊNG VÀ KHÓA HỌC DÀI HẠN

## H1. Thuê cố vấn riêng

Có thể thuê cho:
- Bản thân.
- Bạn đời.
- Con cái.
- Người kế nhiệm.
- Người thân phù hợp.

Các lĩnh vực:
- Quản trị.
- Tài chính.
- Đầu tư.
- Khởi nghiệp.
- Lãnh đạo.
- Giao tiếp.
- Ngoại ngữ.
- Diễn xuất.
- Âm nhạc.
- Hình ảnh cá nhân.
- Nghề nghiệp.
- Quản lý tài sản.
- Nghi thức xã giao.

Mỗi cố vấn có:
- Chuyên môn.
- Năng lực.
- Chi phí.
- Thời gian hợp đồng.
- Mức phù hợp.
- Hiệu quả đào tạo.

Cho phép khóa 6 tháng, 1 năm, 2 năm hoặc dài hơn khi phù hợp.

Không cộng kỹ năng ngay khi thanh toán.

Không cộng lại điểm khi tải bản lưu.

## H2. Khóa học nghi thức xã giao

Nội dung:
- Giao tiếp trang trọng.
- Nghi thức bàn ăn.
- Chào hỏi và giới thiệu.
- Ứng xử tại tiệc doanh nhân.
- Giao tiếp đối tác quốc tế.
- Phát biểu trước công chúng.
- Văn hóa giao tiếp giữa các quốc gia.
- Xây dựng hình ảnh cá nhân.

Tác động:
- Kỹ năng giao tiếp.
- Sự tự tin.
- Khả năng ứng xử.
- Cơ hội tạo thiện cảm.
- Hiệu quả giao lưu và đàm phán khi phù hợp.

Không tự động tăng tài sản hoặc tầng lớp xã hội.

Không bắt buộc người giàu phải học.

---

# PHẦN I — TÍCH HỢP CÁC HỆ THỐNG

## I1. Các chuỗi logic bắt buộc phải hỗ trợ

**Chuỗi 1 — Tăng trưởng doanh nghiệp**

Mở công ty → tuyển nhân viên → đầu tư công nghệ → năng suất tăng → doanh thu tăng → mở chi nhánh → báo cáo tài chính ghi nhận kết quả.

**Chuỗi 2 — Khủng hoảng dòng tiền**

CEO đề xuất mở rộng → chi phí tăng → dòng tiền thiếu hụt → CFO cảnh báo → nhân viên lo lắng → người chơi tái cơ cấu hoặc tìm nguồn vốn.

**Chuỗi 3 — Kế nghiệp**

Con 20 tuổi → thực tập 3 năm → học cố vấn quản trị → hoàn thành dự án → được bổ nhiệm trưởng bộ phận → có cơ hội trở thành CEO sau nhiều năm.

**Chuỗi 4 — Giới thượng lưu**

Sở hữu tập đoàn → học nghi thức xã giao → tham gia tiệc doanh nhân → gặp đối tác → thương lượng hợp tác → kết quả ảnh hưởng doanh nghiệp.

**Chuỗi 5 — Quản trị thất bại**

Trả cổ tức quá cao → thiếu vốn tái đầu tư → công nghệ lạc hậu → năng suất giảm → đối thủ vượt lên → phải điều chỉnh chiến lược.

Không chỉ viết các ví dụ thành lời kể cố định. Engine phải có logic hỗ trợ.

---

# PHẦN J — KẾ HOẠCH TRIỂN KHAI BẮT BUỘC

## J1. Thứ tự thực hiện

Chia thành 6 mốc:

**Mốc 1 — Hoàn thiện A–E cũ**
- Gia cảnh.
- Tài chính người thân.
- Nhượng quyền.
- Rà soát tập đoàn.
- Truyền thông.
- Thực tập sinh K-pop.

**Mốc 2 — Tài chính doanh nghiệp**
- Báo cáo tài chính.
- Dòng tiền.
- Lịch sử năm.
- Biểu đồ.
- So sánh tăng trưởng.

**Mốc 3 — Chiến lược và hiệu suất**
- Các chiến lược phát triển.
- Chi phí, thời gian, rủi ro.
- Chỉ số hiệu suất.
- Đánh giá cuối năm.

**Mốc 4 — Nhân sự và ban lãnh đạo**
- Số nhân viên.
- Tuyển dụng.
- Bổ nhiệm.
- Lương thưởng.
- Đào tạo.
- Bảy nhóm sự kiện lãnh đạo.

**Mốc 5 — Kế nghiệp và giáo dục**
- Thực tập 2–3 năm.
- Cố vấn riêng.
- Khóa học dài hạn.
- Nghi thức xã giao.

**Mốc 6 — Tích hợp và đóng gói**
- Kiểm tra tương thích.
- Kiểm thử UI.
- Changelog.
- GitHub.
- Build.
- dist và dist.zip.

### Quy tắc tiến độ

- Không dừng sau mốc 1 rồi báo hoàn thành toàn bộ.
- Không chỉ viết tài liệu mà không triển khai.
- Không bỏ qua mốc khó.
- Không thay thế yêu cầu bằng tính năng đơn giản hơn mà không thông báo.
- Không tự giảm phạm vi để tiết kiệm quota.
- Nếu gặp giới hạn thời gian/quota, phải hoàn thành checkpoint an toàn và ghi rõ phần chưa làm; tiếp tục từ checkpoint đó ở lượt sau.
- Sau mỗi mốc, commit và push phần đã kiểm chứng.
- Không bắt tôi lặp lại toàn bộ prompt ở lượt sau.

---

# PHẦN K — KIỂM THỬ HIỆU QUẢ

## K1. Kiểm thử theo phạm vi ảnh hưởng

Không chạy lại toàn bộ GĐ0–GĐ6.

Không chạy 77 nhóm regression sau mỗi mốc.

Ưu tiên các test:

- Sự kiện theo gia cảnh.
- Tài chính người thân.
- Không nhân đôi tài sản.
- Nhượng quyền và chuyển cổ phần.
- Hợp đồng nhân viên truyền thông.
- Chuyển công ty thực tập sinh.
- Báo cáo tài chính.
- Dòng tiền và cổ tức.
- Doanh nghiệp lãi nhưng thiếu tiền.
- Doanh nghiệp nợ lớn.
- Chiến lược phát triển.
- Tuyển dụng và lương.
- Bổ nhiệm và nghỉ việc.
- Sự kiện CEO/CFO.
- Con thực tập 2–3 năm.
- Cố vấn dài hạn.
- Khóa học nghi thức xã giao.
- Lưu và tải giữa các chuỗi nhiều năm.

Sau khi tích hợp, chạy smoke test và regression chọn lọc.

Nếu có thay đổi cấu trúc bản lưu, phải kiểm tra tương thích với bản lưu cũ và bản lưu mới.

Không chạy các vòng mô phỏng dài vô ích.

Không bỏ qua lỗi tài chính hoặc mất dữ liệu.

## K2. Tiêu chí nghiệm thu

Chỉ được đánh dấu hoàn thành khi:

- Các chức năng có thể thao tác trên giao diện.
- Logic thực sự hoạt động.
- Dữ liệu được lưu và tải đúng.
- Không tạo tiền hoặc tài sản vô hạn.
- Không làm mất chức năng cũ.
- Không phát sinh lỗi JavaScript nghiêm trọng.
- Các test liên quan đạt.
- Build production thành công.
- dist và dist.zip được tạo mới từ mã cuối cùng.

Tạo bảng checklist cho từng yêu cầu, ghi trạng thái:
- Hoàn thành.
- Chưa hoàn thành.
- Bị chặn và nguyên nhân.

Không dùng trạng thái hoàn thành cho chức năng chỉ mới có giao diện nhưng chưa có logic.

---

# PHẦN L — BẢO TOÀN GAMEPLAY CŨ

Không xóa, thay thế hoặc làm mất:

- Anh Trai Say Hi.
- Tinh Hà Say Hi.
- Em Xinh Say Hi.
- Anh Trai Vượt Ngàn Chông Gai.
- Tân Binh Toàn Năng.
- Running Man.
- 2 Ngày 1 Đêm.
- Người Ấy Là Ai.
- Đảo Thiên Đường.
- Các gameshow khác đã có.
- Hệ thống diễn viên, ca sĩ, idol, K-pop.
- Hệ thống audition.
- Các nghề nghiệp.
- Thành tựu.
- Sự kiện cũ.
- Chuỗi hậu quả.
- Bản lưu người chơi.
- Các nâng cấp GĐ0–GĐ6.
- Các phần A–E đã hoàn thành trước checkpoint.

Không thay toàn bộ registry sự kiện.

Không tự đổi ID các chương trình hoặc nghề nghiệp.

---

# PHẦN M — GITHUB, CHANGELOG VÀ CLOUDFLARE

## M1. Commit và push sau từng mốc

Sau mỗi mốc hoàn thành và kiểm thử đạt:

1. Commit mã nguồn và test liên quan.
2. Push lên GitHub `mercyx03/motdoi`.
3. Ghi checkpoint và phần còn thiếu.
4. Cập nhật Changelog dành cho người chơi.
5. Build production.
6. Tạo lại `dist`.
7. Tạo lại `dist.zip`.
8. Kiểm tra toàn bộ file ZIP.
9. Xác minh `index.html` ở gốc.
10. Xác minh các file Worker và cấu hình nếu cần.

Không tự deploy.

Không merge vào `main`.

Không force push.

Không commit file cá nhân hoặc secrets.

## M2. Changelog

Thêm một mục cập nhật tổng hợp cho bản nâng cấp mới, có thể chia thành nhiều mục nhỏ nếu phù hợp hệ thống phiên bản.

Nội dung dành cho người chơi phải dễ hiểu, ví dụ:

**Một Đời — Xây dựng đế chế của riêng bạn!**

- Quản lý doanh nghiệp chi tiết hơn.
- Theo dõi doanh thu, lợi nhuận và dòng tiền.
- Mở rộng chi nhánh, đầu tư công nghệ và phát triển quốc tế.
- Tuyển dụng và điều hành nhân sự.
- Đối mặt với những quyết định khó khăn của ban lãnh đạo.
- Đào tạo con cái để kế nghiệp.
- Thuê cố vấn riêng và tham gia khóa học dài hạn.
- Mở rộng những lựa chọn cuộc sống theo hoàn cảnh gia đình.

Giữ trạng thái **chưa phát hành** cho tới khi tôi xác nhận đã upload website.

Không tự đổi ngày phát hành các phiên bản cũ.

## M3. Đóng gói Cloudflare bắt buộc

Sau khi tất cả mã nguồn cuối cùng đã hoàn thiện và các kiểm thử bắt buộc đạt:

**Phải thực hiện lại quy trình build từ mã nguồn cuối cùng.**

Yêu cầu:

- Production build PASS.
- Tạo mới thư mục `dist`.
- Tạo mới `dist.zip`.
- ZIP chứa đúng nội dung `dist`, không lồng thêm một thư mục `dist` bên trong.
- `index.html` ở cấp gốc.
- Có đủ `_worker.js`, `_routes.json`, `_headers` và các file cấu hình thực sự cần thiết.
- Đối chiếu toàn bộ tên file và SHA-256 giữa ZIP với `dist`.
- Không dùng lại ZIP của checkpoint cũ.
- Không để thiếu JavaScript, CSS hoặc asset.
- Kiểm tra loading/runtime cục bộ.
- Kiểm tra API cục bộ nếu có.
- Không ghi đè hoặc thay đổi D1 Production.
- Giữ nguyên yêu cầu binding `REVIEWS_DB`.

**Nếu chưa xác minh được binding Cloudflare thực tế, phải ghi rõ giới hạn đó; không tự tuyên bố đã kiểm chứng Production.**

Sau khi build xong, cho tôi biết chính xác đường dẫn tuyệt đối đến `dist` và `dist.zip` trên máy.

Không tự upload website.

---

# PHẦN N — BÁO CÁO CUỐI CÙNG

Chỉ báo cáo hoàn thành toàn bộ khi cả hai nhiệm vụ đã được thực hiện đầy đủ:

**Nhiệm vụ 1:** Hoàn thiện A–E cũ.

**Nhiệm vụ 2:** Hoàn thiện quản trị doanh nghiệp và đào tạo dài hạn.

Báo cáo:

1. Nhánh Git và commit cuối.
2. Trạng thái push GitHub.
3. Checklist từng yêu cầu.
4. Những tính năng đã hoạt động.
5. Những lỗi đã sửa.
6. Những phần còn thiếu nếu có.
7. Cách tính báo cáo tài chính.
8. Cách hoạt động của chiến lược doanh nghiệp.
9. Hệ thống nhân sự và sự kiện lãnh đạo.
10. Thực tập kế nghiệp.
11. Cố vấn và khóa học.
12. Kiểm thử đã chạy.
13. Kiểm thử chưa chạy.
14. Tương thích bản lưu.
15. Các nội dung cũ đã bảo toàn.
16. Trạng thái Changelog.
17. Đường dẫn `dist`.
18. Đường dẫn `dist.zip`.
19. Kết quả kiểm tra ZIP.
20. Đánh giá bản build có thể dùng Preview hay đã đủ điều kiện đề xuất Production.

**YÊU CẦU CUỐI CÙNG:**

Hãy bắt đầu lập trình trực tiếp từ checkpoint mới nhất, hoàn thành toàn bộ phần còn thiếu của A–E, sau đó triển khai đầy đủ hệ thống quản trị doanh nghiệp, tập đoàn, nhân sự, đào tạo người kế nghiệp và cố vấn dài hạn.

Tôi không muốn một báo cáo triển khai một phần rồi dừng khi vẫn còn khả năng tiếp tục.

Hãy tối ưu thời gian, hạn chế kiểm thử trùng lặp, bảo toàn toàn bộ gameplay hiện có và tiếp tục qua các mốc theo thứ tự.

**Khi hoàn thành, bắt buộc commit, push GitHub, chạy production build và tạo mới cả `dist` lẫn `dist.zip` để tôi có thể trực tiếp upload bản cập nhật lên Cloudflare Pages Dashboard. Không tự deploy.**