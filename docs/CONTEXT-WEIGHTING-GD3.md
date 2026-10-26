# GĐ3 — Xác suất sự kiện theo hoàn cảnh

Mốc đối chiếu: `e9fd613` (chứa nghiệm thu `bad8ed9`), nhánh `gd3-context-weighting`. Không bắt đầu GĐ4. Không đổi `G.VERSION`/schema 8.5.0; nhãn gói là `8.5.0-gd3`.

## Kiến trúc và giới hạn

`beginYear` hiện xáo TRIG bằng RNG của cuộc đời, kiểm `when`, cooldown, max, giảm lặp 0,7 và `prevSeen`, rồi thử xác suất theo difficulty. `DEC.valid`, hạn mức hàng đợi và các nhánh chết/quân ngũ/nhà tù tiếp tục chặn. Nhịp tuổi thơ dùng `cw` khi chưa có lựa chọn. GĐ3 thêm hệ số ở hai đường này, không thêm RNG, không sửa `resolve`, hậu quả lựa chọn, lịch hẹn hoặc schema.

`life143.js` nạp sau life142, trước scene.js, gắn `contextTags` vào đúng 50 trigger duy nhất đã có. Các registry DEC/TRIG/ACT/EVENTS và hooks giữ số lượng. Trigger không metadata giữ xác suất cũ. `E.CONTEXT143.factor` cộng các đóng góp có giới hạn rồi kẹp **0,5–2**, tránh nhân chồng. Xác suất opt-in kẹp **0–1**; base 0 vẫn bằng 0. `contextWeight` tùy chọn thay thế các tag; số dương kẹp 0,5–2, không hữu hạn về trung tính; đúng 0 cho phép vô hiệu hóa có chủ đích, được test, không dùng trên 50 trigger. Nhánh tuổi thơ loại trọng số 0 khỏi pool.

Không cache vào bản lưu. Chỉ đọc số hữu hạn đã có: tiền/base, số dư nợ, nhà, thu nhập năm trước, con chưa trưởng thành; thất nghiệp đang mở ở `flags.career109.unemployment.years`; kỹ năng, kiến thức, thâm niên `job.yrs`, uy tín đã tích lũy; sức khỏe/stress, focus, thuốc lá/rượu, bệnh và therapy. Không giả định người chưa có việc là thất nghiệp lâu năm. Nhà chỉ là đệm tài sản nhỏ, không coi là tiền mặt. Không suy đoán lương, chi phí hoặc cơ hội địa phương chưa có dữ liệu đáng tin.

NPC đọc `E.NPC.relation` chỉ khi có UID và dữ liệu quan hệ sẵn có; không gọi khởi tạo danh tính/tính cách. Thiếu quan hệ là trung tính, bỏ qua người chết. Tin cậy con ưu tiên persona141 qua API GĐ2. Tính cách bạn đời đã ảnh hưởng `p` trong life130 nên không nhân lần hai. Độ thân thiết bạn bè phản ánh những lựa chọn đã tích lũy; không tự phát minh lịch sử giúp đỡ. Không dùng dân tộc, giới tính, tôn giáo trong trọng số mới. Điều kiện và xác suất gốc vốn có vẫn giữ nguyên, kể cả điều kiện theo địa phương.

Thăng chức/lương thường niên, bệnh nặng trực tiếp của engine, sự kiện từ hook năm hoặc lịch hẹn không phải TRIG được chọn nên không sửa. 50 trigger chỉ là một phần trải nghiệm, không thể gọi các hệ số là tần suất xuất hiện thực tế mỗi năm: còn điều kiện, cooldown, trần và cạnh tranh hàng đợi.

## Danh sách trước/sau

`docs/gd3-triggers.json` ghi đủ 50 ID, nhóm, p gốc (kể cả hàm), when và child. ID/p/when trước và sau giống nhau; chỉ bổ sung metadata, không tạo 50 sự kiện mới. Tổng registry giữ 687 TRIG và 1.298 DEC.

| Nhóm | ID hiện có được nâng cấp | Lý do |
|---|---|---|
| Áp lực tài chính (5) | doi_kem, kd_vay_nong_xoay_von, vd_vay_chua_benh, vd_hoc_phi_con, sv_vay | Dự phòng, nợ, thất nghiệp được theo dõi, thu nhập, tài sản và con nhỏ |
| Kiếm thêm thu nhập (2) | sv_lam_them, viec_online | Nhu cầu tài chính cũng mở cơ hội; không chỉ tăng bất hạnh |
| Đổi nghề (2) | chuyen_huong, cn_chuyen_nghe_tuoi_40 | Mệt mỏi, ưu tiên học lại |
| Cơ hội nghề nghiệp (6) | dev_offer_nuoc_ngoai, sale_khach_lon, bep_cuoc_thi, nc_ket_qua_dot_pha, ks_sang_che, vc_bo_nhiem | Kỹ năng, kiến thức, thâm niên, uy tín |
| Biến động việc làm (2) | vp_sa_thai_ai, cs_cat_giam | Năng lực giảm rủi ro có giới hạn, không miễn nhiễm cắt giảm |
| Mệt mỏi/sức khỏe (5) | fl_burnout_lam_dem, tai_xe_ngu_gat, pc_met_moi, yt_truc_dem_sai_sot, chan_thuong | Stress, sức khỏe, công việc/nghỉ, thói quen |
| Áp lực tinh thần (3) | tram_cam, nhung_ngay_toi, sau_mat_mat | Thêm bạn bè và điều trị đã có; điều kiện mất mát vẫn giữ |
| Bạn đời (4) | marriageTime130, marriageMoney130, marriageGift130, marriageJealous130 | Tin tưởng, căng thẳng quan hệ, thời gian và tiền; quà nhỏ không phụ thuộc giàu nghèo |
| Con cái (3) | con_hoc, con_hu, con_bo_be | Chi phí và quan hệ hiện có; không coi nghèo là hư |
| Cha mẹ/hỗ trợ (3) | bo_me_can, bo_me_mot_minh, grandCare129 | Tuổi cha mẹ còn sống, nhu cầu chăm con |
| Bạn bè (5) | ban_than_moi, ban_than_hen, ban_than_kho, ban_khung_hoang, bb_hop_lop | Giao tiếp, ưu tiên xã hội, độ tin cậy/thân thiết; bạn thân dễ tâm sự hơn |
| Cơ hội học/năng khiếu (5) | thi_hsg, thuc_tap, mc_hoc_bong, phat_hien, len_chuyen | Kiến thức, chú tâm học, tham vọng sẵn có |
| Học cùng nhau (3) | k_nhom_hoc, k_ngoai_khoa, k_thich_mon | Giao tiếp và chú tâm học |
| Áp lực học (2) | k6_diem_kem, nghi_hoc_ngheo | Kiến thức, stress, học tập; điều kiện khó khăn kinh tế gốc vẫn giữ |

## Ví dụ và cách kiểm tra

Trước cooldown/difficulty/cạnh tranh: `doi_kem` base 40%, hoàn cảnh thiếu tiền/nợ/thất nghiệp 2 năm/con nhỏ cho hệ số 1,7 → 68%. Hoàn cảnh có dự phòng cho hệ số 0,6 nhưng **không đủ when nên không xảy ra**; không được diễn giải là người giàu có 24% gặp túng quẫn. `fl_burnout_lam_dem` base 12%: stress 95, sức khỏe 35, focus work → khoảng 18,35%; stress 10, sức khỏe 95, focus rest → 7,2%, chỉ ở nghề phù hợp.

Lệnh: `npm run test:context`, `npm run test:quick`, `node tests/regression-fixes.js`, các shard regression ghi trong báo cáo nghiệm thu. `tools/gd3-compare.js <checkout GĐ2.5>` kiểm byte-identical khi bỏ metadata và đo 3 lượt xen kẽ 60 đời/mã với đồng hồ/seed cố định. Baseline trước/sau: 400 đời qua công cụ baseline hiện có, không ghi đè baseline GĐ0.

Test save-safety tuổi 100 dùng `tests/fixtures/gd25-age100.json.gz`: hai cuộc đời mô phỏng từ e9fd613, seed 100047/vn và 100062/world, chụp lúc còn sống đúng tuổi 100. Mục đích là kiểm bản lưu dài, không áp đặt tuổi thọ của hai seed khi xác suất thay đổi. Giữ nguyên lưu/tải/migration/chơi tiếp và kiểm lịch sử dài. Không có dữ liệu người chơi thật.

## Nhật ký và phát hành

Nguồn tĩnh `docs/update-extra.json` → `public/data/updates.json` → JSON và HTML nhúng trong dist. Không phải D1. Mục `gd3-context-weighting` có version, releaseStatus=packaged, releasedAt=null; thời điểm hiển thị là ngày chuẩn bị nhật ký. Chủ dự án xác nhận upload mới ghi ngày phát hành thật. Công cụ dựng lịch sử giữ nguyên mục biên tập cũ, chỉ sửa mục cũ khi có correctedAt rõ ràng.

Không tự deploy, đổi DNS/binding hoặc database. REVIEWS_DB thuộc cấu hình Pages, không nằm trong ZIP. Build cục bộ không chứng minh API Production. Khi chưa chạy hết regression toàn bộ thì gói là Preview/chưa nghiệm thu toàn bộ.
