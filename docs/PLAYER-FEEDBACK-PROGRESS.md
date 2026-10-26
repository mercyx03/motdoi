# Tiến độ nâng cấp theo góp ý người chơi

Nhánh `player-feedback-upgrade` (tạo từ `1f8248d`, GĐ6). Trạng thái: HOÀN THÀNH · HOÀN THÀNH CÓ GIỚI HẠN · CHƯA HOÀN THÀNH · BỊ CHẶN.
Mỗi mốc: sửa code → test chuyên đề + test module bị ảnh hưởng → nhật ký → commit/push → dist/dist.zip. Không chạy lại regression toàn bộ.

## Mốc A — Sửa lỗi và hành động gia đình

| Yêu cầu | Trạng thái | Module | Test | Ghi chú |
|---|---|---|---|---|
| A1 Con cái sau nhiều lần ly hôn | HOÀN THÀNH | life45 (`divKids`, lưu mã bạn đời trước ly hôn), life146 (`residence146`) | feedback-a, relationships841 | Con có `coParent108` gắn đúng cuộc hôn nhân; bản lưu cũ không có thông tin người cùng nuôi: con đã có nơi ở không bị phân xử lại. Mục xem nơi ở / chăm sóc / giám hộ và đề nghị đổi nơi ở từng con (cha/mẹ kia và con ≥ 12 tuổi có quyền từ chối). Con nuôi hiện "cha/mẹ nuôi hợp pháp"; cha/mẹ kế chưa có quyền giám hộ riêng. |
| A2 Về Việt Nam / chuyển nước sau du học | HOÀN THÀNH | life146 (`abroadMove146`), migrate114 chỉ dẫn | feedback-a | Phân biệt học / hợp đồng / thực tập sinh / định cư; dừng học hoặc chịu phí chấm dứt hợp đồng; bán nhà, quy đổi tiền, giữ quốc tịch; chưa đủ điều kiện thì hiện lý do. Chuyển thành phố trong nước vẫn dùng mục cũ. |
| A3 Crash khi hẹn hò qua app | HOÀN THÀNH CÓ GIỚI HẠN | life79 | feedback-a | Tìm và sửa một vòng lặp có thể chạy vô hạn khi tạo hồ sơ (sở thích); giữ danh sách hồ sơ khi mở lại. 7.190 lượt thử engine trên 240 trạng thái không lỗi. Chưa tái hiện được đúng lỗi người chơi gặp trên giao diện (khung trình duyệt kiểm thử bị ẩn, không vẽ trang). |
| A4 Quy trình Audition | HOÀN THÀNH | life139 | feedback-a, audition139 | Chuẩn bị hồ sơ (ảnh, video) → đăng ký đúng công ty theo nước, điều kiện tuổi → 3 vòng có lý do → đề nghị / chuẩn bị sang nước ngoài (luồng cũ) hoặc thử lại / ứng tuyển trong nước. |
| A5 Mời bố mẹ về sống chung | HOÀN THÀNH | life146 (`parentsHome146`) | feedback-a | Mời bố, mẹ hoặc cả hai; xét tin cậy, tuổi, nhà ở, nước ngoài; có thể từ chối; không đổi sở hữu nhà. |

Kiểm thử mốc A: feedback-a 39 · smoke 11/11 · saves-compat 10/10 · save-safety 10/10 · NPC 14/14 · family830/104/126/129/130 · relationships108/841 · audition139 · life138 · integration-gd6 · regression mục 9 lọc 14 tình huống (79.362), mục 32, 57, 58, 71.

## Mốc B — Đồng bộ dữ liệu và tinh gọn giao diện

| Yêu cầu | Trạng thái |
|---|---|
| B1 Nghề nghiệp / thu nhập NPC thống nhất | CHƯA HOÀN THÀNH |
| B2 Hồ sơ con cái chi tiết | CHƯA HOÀN THÀNH |
| B3 Menu Gia đình & tình cảm 5 nhóm | CHƯA HOÀN THÀNH |
| B4 Menu Tiền bạc & tài sản 5 nhóm | CHƯA HOÀN THÀNH |

## Mốc C — Giới thượng lưu, gia tộc, tập đoàn

| Yêu cầu | Trạng thái |
|---|---|
| C1 Phân tầng đời sống theo tài sản / địa vị | CHƯA HOÀN THÀNH |
| C2 Tổ chức tiệc | CHƯA HOÀN THÀNH |
| C3 Thương vụ hợp tác | CHƯA HOÀN THÀNH |
| C4 NPC liên kết xuyên sự kiện | CHƯA HOÀN THÀNH |
| C5 Người đứng đầu gia tộc | CHƯA HOÀN THÀNH |
| C6 Trải nghiệm thượng lưu, sưu tầm | CHƯA HOÀN THÀNH |

## Mốc D — Quan hệ xã hội, người nổi tiếng, hôn nhân

| Yêu cầu | Trạng thái |
|---|---|
| D1 Kết bạn người có địa vị | CHƯA HOÀN THÀNH |
| D2 Tương tác người nổi tiếng | CHƯA HOÀN THÀNH |
| D3 Mặt tối giới giải trí | CHƯA HOÀN THÀNH |
| D4 Giới thiệu đối tượng cho con | CHƯA HOÀN THÀNH |
| D5 Quà tặng người thân | CHƯA HOÀN THÀNH |
| D6 Cầu hôn | CHƯA HOÀN THÀNH |

## Mốc E — Tài sản hôn nhân, di chúc, thừa kế

| Yêu cầu | Trạng thái |
|---|---|
| E1 Thỏa thuận tài sản trước hôn nhân | CHƯA HOÀN THÀNH |
| E2 Chia tài sản khi ly hôn | CHƯA HOÀN THÀNH |
| E3 Di chúc chi tiết | CHƯA HOÀN THÀNH |
| E4 Đồng bộ sở hữu tài sản | CHƯA HOÀN THÀNH |

## Checkpoint

- Mốc A: commit xem lịch sử nhánh (thông điệp `feat(feedback-a)`).
