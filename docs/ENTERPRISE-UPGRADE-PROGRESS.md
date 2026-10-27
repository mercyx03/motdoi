# Một Đời — đang triển khai nâng cấp A–E và quản trị doanh nghiệp

## Checkpoint 8.8.1-contracts — chỉ Preview

Chưa hoàn thành hai nhiệm vụ tổng thể, chưa hoàn thành mốc 1 và chưa nghiệm thu Production. Không coi checkpoint này là bản nâng cấp quản trị doanh nghiệp hoàn chỉnh. Tiếp tục trên `codex/life-context-upgrade`, nền tảng `cfd8fd3`; không quay về main. Yêu cầu đầy đủ được lưu ở `ENTERPRISE-UPGRADE-REQUEST.md` để không cần người dùng gửi lại.

## Phần đã triển khai và kiểm chứng trong checkpoint

- `life161`: chín vai trò truyền thông trên kênh life131, hợp đồng 1–3 năm, năng lực cố định theo người được thuê, lương theo hợp đồng, hết hạn/nghỉ việc/thiếu ngân sách/chấm dứt, tuyển người thay thế. Đội ngũ cũ chuyển đổi giữ cấp, mức lương và kỳ đã trả. Nhân sự chung và hợp đồng dùng cùng vòng trả lương; không trừ hai lần. Chất lượng theo năng lực có trần tương đương cấp 3. Hiệu suất đọc năng lực, uy tín và tương tác hiện có.
- `life160`: phạm vi đăng bài, livestream, quảng cáo, giao lưu theo chuyên môn; lương hiển thị đúng tổng hợp đồng. Giữ giới hạn bốn video, một livestream và lời mời quảng cáo cần duyệt. Phí lương đã được cho phép khi ký hợp đồng; không tự phát sinh hợp đồng quảng cáo lớn.
- `life162`: hợp đồng K-pop trên agency hiện có: chuyển công ty có thể bị từ chối, gia hạn hai năm, tạm nghỉ/tiếp tục, hết hạn, bị loại khi đánh giá thấp, lời mời tiếp cận từ công ty khác. Người chưa thành niên xét người giám hộ và học tập, tiếp tục đào tạo tại chỗ. Hồi hương và audition người lớn dùng life139. Giữ peers, UID, kỹ năng, tháng đào tạo, lịch sử đánh giá và nợ đào tạo khi ký lại.
- Điều chỉnh life139 để gia hạn K-pop không bị chốt cứng ở năm thứ năm; hợp đồng ngoài Hàn Quốc giữ vòng đời cũ. Bước chuyển sang đào tạo toàn thời gian ở tuổi 18 vẫn qua chuẩn bị ngôn ngữ/giấy tờ/cư trú.
- Lễ Tết/sinh nhật/cưới hỏi: thêm cách giản dị không tốn tiền và tiệc nhà hàng, cùng giới hạn một dịp/năm. Du lịch gia đình thêm thời gian nghỉ tại nhà không tốn tiền và dịch vụ riêng. Hộ đang nợ vẫn chọn được phương án miễn phí; chi phí trả theo mức sống hiện tại. Không thay thế sự kiện cũ.

## Checklist toàn bộ yêu cầu

“Chưa hoàn thành” bao gồm phần mới triển khai một phần hoặc chưa kiểm chứng đủ. Các phần sẵn có ở cfd8fd3 không tự được coi là đã hoàn tất yêu cầu mở rộng.

| Yêu cầu | Trạng thái | Phần còn thiếu / bằng chứng |
|---|---|---|
| A1 Gia cảnh | Chưa hoàn thành | Đã mở rộng sum họp/du lịch; còn toàn bộ rà soát chọn lọc y tế, bảo hiểm, học tập, nhà xe, đầu tư, chăm sóc và giao lưu; nghệ thuật nhiều thế hệ/casting trẻ em |
| A2 Tài chính người thân | Chưa hoàn thành | Chưa triển khai sổ thu nhập, tiết kiệm, chi phí, nợ và tích hợp hôn nhân/thừa kế riêng đầy đủ |
| A3 Nhượng quyền, bán, cổ phần, điều hành | Chưa hoàn thành | Giữ hệ thống cổ phần/điều hành cũ; còn nhượng quyền, người mua/đàm phán/thanh toán và tích hợp kế nghiệp |
| A4 Tăng trưởng/định giá dài hạn | Chưa hoàn thành | Chưa kiểm toán công thức và các trường hợp 10–30 năm, nợ, thiếu tiền, công ty con, phá sản/sáp nhập |
| A5 Nhân sự truyền thông | Hoàn thành | Chín vai trò, hợp đồng, lương chung, hiệu suất, nghỉ việc/thay thế, chuyên môn điều khiển quyền tự động; tests/contracts161-162 và UI |
| A6 Vòng đời thực tập sinh K-pop | Hoàn thành | Gia hạn/chuyển/rời/tạm nghỉ/hết hạn/đánh giá, tiếp cận, audition lại, giữ danh tính và kỹ năng; tests/contracts161-162, audition139, showbiz-idol và UI |
| B1 Báo cáo tài chính năm | Chưa hoàn thành | Chưa triển khai báo cáo chi tiết, dòng tiền và chốt năm |
| B2 So sánh năm | Chưa hoàn thành | Chưa có lịch sử báo cáo mới |
| B3 Biểu đồ | Chưa hoàn thành | Chưa triển khai biểu đồ doanh thu/lợi nhuận/dòng tiền/nhân viên |
| C1 Quyết định chiến lược | Chưa hoàn thành | Chi nhánh, tuyển dụng, công nghệ, chất lượng, quốc tế, giảm chi phí, tái đầu tư |
| C2 Vòng đời chiến lược | Chưa hoàn thành | Ngân sách, thời gian, người phụ trách, rủi ro, kết quả và chống bấm lặp |
| D1 Hiệu suất doanh nghiệp | Chưa hoàn thành | Chưa triển khai bộ chỉ số dẫn xuất |
| D2 Đánh giá cuối năm | Chưa hoàn thành | Chưa có nhận xét theo báo cáo và chiến lược |
| E1 Quy mô nhân viên | Chưa hoàn thành | Chưa khởi tạo nhân sự tổng hợp có giải thích cho doanh nghiệp cũ |
| E2 Quản lý nhân sự | Chưa hoàn thành | Tuyển số lượng, lương thưởng, đào tạo/đánh giá và kết nối bổ nhiệm |
| F1 CEO xin tăng lương | Chưa hoàn thành | Chưa triển khai |
| F2 CFO phát hiện chi bất thường | Chưa hoàn thành | Chưa triển khai |
| F3 Giám đốc thăng chức | Chưa hoàn thành | Chưa triển khai |
| F4 Lãnh đạo sang đối thủ | Chưa hoàn thành | Chưa triển khai |
| F5 Con thiếu kinh nghiệm | Chưa hoàn thành | Chưa triển khai |
| F6 HĐQT bất đồng mua lại | Chưa hoàn thành | Chưa triển khai |
| F7 Nhân viên mất niềm tin | Chưa hoàn thành | Chưa triển khai |
| G1 Thực tập 2–3 năm | Chưa hoàn thành | Chưa triển khai chương trình nhiều năm, trợ cấp, đánh giá và bổ nhiệm sau chương trình |
| H1 Cố vấn dài hạn | Chưa hoàn thành | Chưa triển khai hợp đồng, người học, lĩnh vực, tiến độ và chống cộng lại khi tải |
| H2 Nghi thức xã giao | Chưa hoàn thành | Chưa triển khai khóa dài hạn và tác động giao tiếp |
| I1 Năm chuỗi tích hợp | Chưa hoàn thành | Chưa chạy được đầy đủ các chuỗi doanh nghiệp/khủng hoảng/kế nghiệp/giao lưu/quản trị thất bại |
| J Sáu mốc | Chưa hoàn thành | Đang mốc 1; mốc 2–5 chưa bắt đầu, mốc 6 mới đóng gói checkpoint |
| K1 Kiểm thử trọng điểm | Chưa hoàn thành | Đã kiểm phần thay đổi; các phần chưa triển khai chưa có test PASS |
| K2 Nghiệm thu tổng thể | Chưa hoàn thành | Còn phần lớn chức năng và kiểm thử |
| L Bảo toàn gameplay cũ | Chưa hoàn thành | Không xóa ID/registry; các nhóm liên quan đã đạt, chưa kiểm mọi luồng cũ trên mã cuối của toàn đợt |
| M1 GitHub | Chưa hoàn thành | Ghi kết quả commit/push thực tế trong báo cáo checkpoint |
| M2 Changelog | Hoàn thành | Mục 8.8.1-contracts chỉ công bố phần thực sự triển khai, packaged, releasedAt=null |
| M3 Cloudflare | Chưa hoàn thành | Chưa phải artifact cuối của toàn bộ yêu cầu; ghi kết quả gói checkpoint riêng |
| N Báo cáo cuối toàn đợt | Chưa hoàn thành | Chưa được báo hoàn thành cả hai nhiệm vụ |

## Kiểm thử đã chạy

- contracts161-162: 53 kiểm tra PASS; life-context-a 12; life-context-bcd 29; audition139 23; showbiz-idol 70; social131 35; family129 65; creator132 PASS.
- Smoke 11/11, saves-compat 10/10, save-safety 10/10, NPC 14/14. Cảnh báo seed + giờ thực là lỗi đã biết; không đổi định danh đời để che cảnh báo.
- Chrome thực: 8 thao tác tại 390/1280px, kiểm kết quả thực sự lưu, không tràn ngang/lỗi JS. Ảnh trong `.cache/contracts-*.png`.
- Lần chạy browser trong sandbox kết thúc không có dòng PASS và không sinh ảnh: không tính đạt. Lần đầu có quyền chạy Chrome phát hiện test dò chữ “bố mẹ” không khớp cách xưng hô khi chỉ còn mẹ; sửa bộ chọn theo tên hành động, giữ assertion dữ liệu. Lần chạy tiếp đủ 8 luồng PASS.
- Regression toàn bộ 77 nhóm không chạy theo yêu cầu. Không giả lập lại hàng nghìn cuộc đời cho từng thay đổi. Chưa kiểm bản lưu thật của người chơi.

## Tiếp tục

Hoàn tất A1–A4 trước khi đánh dấu mốc 1 xong, sau đó đi đúng thứ tự mốc 2–6 trong bản yêu cầu. Đọc engine finance (đóng góp bạn đời hiện dùng 55% thu nhập), life114 quỹ hỗ trợ con, life147 chức vụ/thu nhập, life150 chế độ tài sản trước khi thêm sổ riêng; phải tránh ghi lại tiền đã góp hộ hoặc quỹ được tặng. Tài chính doanh nghiệp phải sửa tại phép tính companyYear của life133 và các giao dịch life128/137, không dựng sổ độc lập không khớp số dư. Hiện lợi nhuận tính trên vốn, cổ tức khấu trừ 5% và lợi nhuận giữ lại tăng c.value; chưa có cash/debt riêng nên không được trình bày lại thành báo cáo lịch sử chính xác.

## Git / phục hồi

Remote origin https://github.com/mercyx03/motdoi.git, public, connector xác nhận push/admin. Remote nhánh ban đầu khớp cfd8fd3. Không có workflow GitHub được theo dõi; dự án dùng Direct Upload. Cấu hình Pages/binding thực tế chưa kiểm chứng. Không deploy, không sửa DNS/project/database.

Mốc phục hồi nguồn: cfd8fd3. Tạo nhánh phục hồi từ mốc này trong checkout riêng và đóng gói; chủ dự án tự upload. Không reset/force-push nhánh làm việc, không chạm ba tệp riêng. dist bị ignore; dist.zip có tracking, giữ nguyên chính sách.
