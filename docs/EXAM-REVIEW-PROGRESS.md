# Rà soát hệ thống thi — 8.10.54

Trạng thái: HOÀN THÀNH TRIỂN KHAI — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN, chỉ Preview. Không bắt đầu giai đoạn mới, không deploy Production.

## Phạm vi đã triển khai

- Thay phần thi thử hiện hữu trong royal847 bằng chấm từng môn chung với thi thật, dự báo và thi lại; tách ảnh chụp đầu vào, công thức và biến động phòng thi. Kiến thức cao có nền tới 9,2/10/môn; bỏ tâm lý ẩn gây tụt nhiều điểm.
- Chuyển tiến độ cũ một lần sang kỹ năng có giới hạn; luyện giảm dần, hai khối nhiều tuần/năm, có mệt mỏi. Kỹ năng chuyên/năng khiếu mới theo đúng môn; giữ kết quả kỳ thi cũ và không sửa điểm thật qua thi thử.
- Khóa kết quả theo kỳ/năm/tổ hợp/môn, seed riêng; xem lại menu và tải lại không đổi kết quả. Điều kiện xem/đổi tổ hợp chỉ đọc thay vì tạo trạng thái khi xem báo cáo.
- Thay danh mục tên trường gắn ngưỡng chưa kiểm chứng bằng nhóm mô phỏng; giữ ID và lịch sử cũ. Điều kiện khối, ngành, ngôn ngữ, thành tích, năng khiếu dùng hệ có sẵn. Không đưa phần trăm đỗ lên giao diện.
- Báo cáo tiếng Việt có giờ UTC+7, điểm từng môn, thấp/kỳ vọng/cao, trạng thái, điều kiện còn thiếu; giải thích sau thi lấy từ các thành phần đã chấm và lưu. Giữ các lối tắt vào đổi khối/nguyện vọng.
- Nhật ký packaged: exam-model-review-81054. Giữ nguyên tất cả mục lịch sử cũ.

Công thức và giới hạn: EXAM-MODEL.md. Dữ liệu cân bằng: EXAM-CALIBRATION.json.

## Kiểm thử

- exam-model: 565 kiểm tra, gồm giới hạn điểm/thang, không cộng trùng, tiến bộ giảm dần, hạn chế luyện, migration một lần, trạng thái cũ, báo cáo thuần, cùng seed, dữ liệu giải thích khớp kết quả, đổi nguyện vọng/tổ hợp, 9 tổ hợp hiện có, môn chuyên và năng khiếu.
- 96.000 thí sinh/48 nhóm, 2.000/nhóm: sai lệch tỷ lệ vượt ngưỡng cạnh tranh lớn nhất 1,2411 điểm phần trăm; sai lệch điểm trung bình lớn nhất 0,09046; thiên lệch gộp −0,04953 điểm phần trăm. Đây là kiểm tra mô hình game, không xác suất tuyển sinh thật.
- Chrome: bốn báo cáo/bấm luyện ở 390px và 1280px, không tràn ngang, không lỗi JavaScript; đã xem ảnh chụp và chỉnh nội dung. Bản dist cũng đạt: tìm kiếm nhật ký không dấu, bộ lọc, tải thêm, nhãn packaged và chống tràn ngang ở cả hai kích thước.
- Smoke 11/11; saves-compat 10/10; save-safety 10/10; NPC 14/14 đều đạt. Cảnh báo cũ: ID đời theo giờ thật khiến toàn cuộc đời cùng seed chưa giống byte; các tình huống hc_story đã bỏ vẫn được fixture cũ nhắc tới. Seed kỳ thi mới được kiểm riêng và tái lập.
- exam127 244; khoi912 257; royal847 244; world120 74; university136; adult106 105; update840 1.043 đạt trên mã cuối.
- Regression mục 9: 10 luồng, gồm thi thử, lớp 10, chuyên/ôn chuyên, đổi tổ hợp, luyện thi, nguyện vọng, thi lại; đạt 18.192 kiểm tra/1.268 lượt chọn trên 10 luồng ở mã cuối. Mục 46 đạt 8; mục 36/59 đạt 30.
- update-release 976; update-history-timezones đạt; giữ nguyên mọi mục cũ sau chạy build-update-history và mục mới nằm đầu.
- update-history843: FAIL do test cố định rằng bản 8.10.43 phải còn packaged; dữ liệu HEAD trước đợt này đã released. Không sửa lịch sử phát hành để ép test đạt. Không phải lỗi mới do đợt thi; chưa chỉnh test cũ ngoài phạm vi.

## Git, build và giới hạn bàn giao

Repository đã xác minh qua GitHub: mercyx03/motdoi, public; tài khoản mercyx03 có quyền push/admin. Nhánh hiện tại codex/life-context-upgrade, remote origin. Remote khớp e7a9bd1 trước đợt sửa. API công khai không thấy workflow hoặc deployment đã đăng ký. Chưa kiểm chứng cấu hình Pages thực tế; không chạy deploy, không đổi cấu hình.

Giữ nguyên các thay đổi có sẵn ở healthsys919.js, world-country-jobs832-browser.js, healthsys-rx-cap.js và các tệp riêng. Không đưa chúng vào commit này. Build từ workspace sẽ bao gồm thay đổi y tế đã có ở nguồn; đó là giới hạn tái dựng artifact từ riêng commit này, cần chủ dự án kiểm tra trước Production. Không xóa/ghi đè/commit Claude.md, .local-state-review.txt hoặc audit-world-520.json.

Chưa chạy hồi quy đầy đủ. Các mục còn lại chuyển GĐ6 trong BACKLOG. REVIEWS_DB/Worker chỉ kiểm cục bộ qua lệnh package; chưa xác minh binding Pages hay API Production. Chỉ chủ dự án upload Dashboard.

Khôi phục mã trước đợt: e7a9bd1. Sau commit có thể git revert commit của đợt này, đóng gói lại và chủ dự án upload gói đã kiểm; không reset/force push hoặc làm mất thay đổi riêng đang có.

## Artifact đã kiểm chứng

- npm run package:cloudflare: PASS; loading 28 file, 8 cuộc đời nguồn/build giống nhau, admin/API quyền truy cập cục bộ đạt.
- dist/ và dist.zip mới ở gốc dự án, 28 file; ZIP 3.331.896 byte. Đọc lại toàn bộ tên/nội dung, so SHA-256 với dist theo script đóng gói.
- SHA-256 ZIP: A861B3158F86D771CF2EB40AE4DE0FC03C9EC923AB93E6ABF94FBE42FC7CC5BF.
- index.html ở gốc ZIP, giữ _worker.js/_routes.json/_headers/.well-known/ai-catalog.json. Mục exam-model-review-81054 có trong dữ liệu và HTML dist/ZIP, đứng đầu, packaged; toàn bộ mục lịch sử cũ không thay đổi.
- Chrome trên dist: bốn báo cáo/bấm luyện và trang nhật ký (tìm không dấu/lọc/tải thêm), 390/1280px PASS.
- Chưa sẵn sàng Production: thiếu hồi quy toàn diện, binding thực tế; có thay đổi y tế riêng đã tồn tại trong workspace như đã nêu.
