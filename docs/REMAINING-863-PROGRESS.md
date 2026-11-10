# Tiếp tục hoàn thiện các yêu cầu còn thiếu — bắt đầu từ nền e3eb853

Chủ dự án yêu cầu làm hết các phần còn thiếu đã liệt kê, ngoại trừ nghiệm thu toàn diện. Đây là một công việc liên tục; không dừng sau riêng giáo dục, không tự bắt đầu GĐ mới và không tuyên bố toàn bộ đã xong khi còn mục mở.

## Đã làm trong đợt đang chạy

- Mở rộng STUDY857, không tạo registry học sinh khác. Có cấu hình cơ bản đủ76 vùng trong danh mục Mỹ/Canada/Úc/GB; nguồn từng vùng ở education863-data.js, ảnh chụp10/11/2026. Chưa đồng nghĩa toàn bộ nghĩa vụ pháp lý/ngoại lệ của từng vùng đã được cấu trúc hóa.
- Quỹ giờ giám hộ dùng chung; tối đa6 đợt/24 giờ trong cấu hình mới, giới hạn gia đình theo người chăm sóc. Save cũ giữ giới hạn3/12 khi chưa có cờ phiên bản.
- Alberta supervised và Prairie South SK có hoàn chi phí thực, chứng từ, hạn tiếp nhận, trần; NZ theo phần kỳ/ngày ngoàiNZ.
- Khoa học GCSE hai đường, thêm ngoại ngữ có văn bằng, khóa kết quả. Hồ sơ provider cho GED/HiSET/AP/SAT/IGCSE/A-Level/IB/Leaving/NSC/HSC/VCE. HSC/VCE có học phần và đánh giá từng năm; không chỉ thêm lời kể.
- Học phần dual enrollment, đối chiếu tín chỉ theo cơ sở nhận; học bạ khi quay lại trường; đối chiếu học thuật Oxford và xét hồ sơ/nhập học vào cơ sở mô phỏng.
- education863267 kiểm tra lúc đầu, hiện287; study-home857204 (giảm38 assertion unknown vì các vùng đã mở), royal847248 sau chọn khoa học đúng đường mới; smoke/saves/save-safety/NPC đạt ở mốc trước sửa cuối. Browser nguồn8 menu390/1280 đạt.

## Còn phải tiếp tục cho toàn yêu cầu

1. Giáo dục: hoàn tất kiểm tra giao diện/build; bổ sung dữ liệu tuổi/ngoại lệ/hạn và đường văn bằng vào dữ liệu thay vì chỉ ghi chú khi đã xác minh. Rà lộ trình tuyển sinh, điều kiện riêng và tính toàn vẹn hồ sơ (không cấp bằng từ một nút xác nhận). Nguồn đang có trong các file dữ liệu và lịch sử công cụ; không tự suy ra luật khi chưa đọc nguồn.
2. Nội dung quốc tế: rà ngoài13 sự kiện tuổi thơ đã sửa; bản địa hóa theo nơi sống, vùng văn hóa, loại gia đình và thời kỳ; sự kiện chung phải trung tính, không gán tập tục Việt Nam. Không mặc định mọi nước có cùng phong tục hoặc hoàng gia đều ở cung điện.
3. Hoàng gia: tăng chiều sâu phe phái/tranh vai trò, ảnh hưởng, bằng chứng, nguồn lực và hậu quả nhiều năm; sự kiện riêng cho27 nước theo cơ chế hiện có. Giữ tước và quyền kế vị độc lập với gây sức ép/thẩm mỹ.
4. Tước châu Âu: tiếp tục ngoại lệ thời kỳ/cá nhân của GB/BE/SE/DK/NL/LU từ sổ858; bổ sung dữ liệu có nguồn, không lấy một ca cá nhân thành luật chung.
5. Monaco: bộ luật trước2002/2015, mất khả năng tạm thời, chi tiết hai hội đồng, ngoại lệ tước/phối ngẫu và hộ tịch/phán quyết cần triển khai tiếp.
6. Tây Ban Nha: các bộ luật trước1978/1987, họ trước2017, nhiếp chính, chuyển tiếp1987/2014, tước địa danh và thay đổi cùng năm cần triển khai tiếp.
7. Nhật ký phát hành cũ đã đúng; bản63 mới packaged theo chính sách vì chưa có xác nhận upload riêng. Không deploy. Cuối đợt phải build dist/ZIP mới, kiểm nội dung/nhật ký, commit/push nhánh hiện tại. Chỉ bỏ qua nghiệm thu toàn diện, không bỏ test chuyên đề và tương thích.

## Dữ liệu ngoài phạm vi

Giữ Claude.md, .local-state-review.txt, audit-world-520.json. Không stage healthsys919.js, world-country-jobs832-browser.js, healthsys-rx-cap.js và các PROMPT riêng. Artifact vẫn chứa mã y tế có sẵn trong workspace; không tái dựng chính xác chỉ từ commit đợt này. Remote origin mercyx03/motdoi, nhánh codex/life-context-upgrade; không merge main hoặc deploy Cloudflare.
