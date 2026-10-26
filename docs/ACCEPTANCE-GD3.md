# Một Đời — GĐ3 đã triển khai, đang nghiệm thu toàn bộ (Preview)

## Mã nguồn và bảo vệ dữ liệu

- Nhánh `gd3-context-weighting`, tạo từ `e9fd613595e5d142ce43e680af7e9e7046defb88`, chứa `bad8ed9`.
- Repository xác minh `mercyx03/motdoi`; GitHub hiện public (khác tài liệu cũ private), giữ nguyên visibility. Quyền push có, dry-run nhánh mới đạt. Không có workflow .github trong cây; chưa truy cập cấu hình tích hợp Cloudflare, không tự deploy.
- Ba file riêng audit-world-520.json, .local-state-review.txt, Claude.md giữ nguyên, hash trước/sau khớp; bản sao bảo vệ ở .cache/gd3-protected, không commit. ZIP cũ cũng được sao lưu tại đó.
- Node 24.20.0, npm 11.19.0, Git 2.55.0, esbuild 0.28.2. Không thay dependencies.
- Gameplay: đúng 50 TRIG có metadata, hệ số 0,5–2, không đổi schema, ID, điều kiện, cooldown, hậu quả lựa chọn hoặc số registry. Chi tiết và danh sách đầy đủ ở CONTEXT-WEIGHTING-GD3.md và gd3-triggers.json.

## Kiểm thử thực hiện

- Context: **4.658 assertion đạt**, gồm 60 fixture, dữ liệu thiếu/null, NPC trust/personality, trọng số 0 và ngoài miền, không ghi dữ liệu, điều kiện/DEC.valid/cooldown/max/dead/jail, phân bố cùng RNG.
- Smoke 11/11; 60 fixture thuộc 10 phiên bản: 10/10; save-safety 10/10; NPC 14/14.
- Regression fixes GĐ2.5 8/8; Hardcore isolation 12 đời thường giống từng byte khi có/không life97/life98.
- Khi bỏ metadata GĐ3: 12 cuộc đời hoàn chỉnh giống từng byte với e9fd613, gồm RNG và bản lưu. So p/when/cd/max/rep/child/cw của 50 trigger với checkout GĐ2.5 đạt.
- Regression **404.591 assertion đạt**, không có assertion thất bại trong các lượt hoàn tất: 0–4, 7–8, 10–12, 17, 19, 21, 28, 30, 46, 52, 55, 59, 68–69, 75; mục 9 lọc đúng 50 ID, 11.652 lượt lựa chọn, **41/50 ID có phương án thực sự được thực thi** theo khuôn/điều kiện của test. Không gọi đây là phủ toàn bộ 50 lựa chọn hoặc toàn bộ game.
- Nhóm gộp 17/19/21 timeout 240 giây; không tính đạt. Tách 17 (52,2s), 19 (162,5s), 21 (55,6s), từng nhóm đạt trong giới hạn 300s. Mục 9 lọc hoàn tất 47,9s. Không chạy lại toàn bộ regression khổng lồ.
- Test save-safety ban đầu thất bại vì hai seed không còn sống tới 100 (90/93 tuổi). Dùng snapshot tuổi 100 có thật từ mã GĐ2.5 để kiểm lưu dài, giữ các assertion lưu/tải/migration/chơi tiếp; ghi rõ nguồn fixture, không đổi gameplay để ép tuổi thọ.
- Cú pháp 8 file JS sửa/thêm đạt; diff check theo CRLF đạt. index.html vốn có xuống dòng hỗn hợp, giữ nguyên từng dòng cũ.
- Nhật ký: 1440×1000 và 390×844 trên Edge headless; mục mới, trạng thái chưa phát hành, không tràn ngang, tìm không dấu, lọc, tải thêm, không pageerror đều đạt. Ảnh/log tạm ở .cache/gd3-protected. Không truy cập tài khoản hoặc DB Production.

## Baseline và hiệu năng

Mô phỏng 400 đời/mã với cùng seed/đồng hồ. Baseline GĐ2.5 mới tái lập đúng tuổi mất 73,97 và median save 147,2 KB của nghiệm thu cũ. Không ghi đè fixture baseline GĐ0.

| Chỉ số | GĐ2.5 | GĐ3 |
|---|---:|---:|
| Tuổi mất trung bình | 73,97 | 73,41 |
| Sống tới 50 | 88,5% | 88,0% |
| Có con trong nhóm sống tới 50 | 25,7% | 26,1% |
| Đại học VN, sống tới 25 | 11,7% | 13,7% |
| Năm có việc | 52,2% | 52,5% |
| Năm có nợ | 24,1% | 23,2% |
| Lựa chọn đầu năm | 2,08 | 2,10 |
| Bản lưu trung vị (cách đo baseline cũ) | 147,2 KB | 146,9 KB |

GĐ3 chủ đích đổi phân bố, không coi chênh lệch là lỗi mặc định hoặc chứng minh cân bằng tối ưu. Không đổi mô hình tử vong. Tuổi thọ và học vấn có biến động mẫu; không thể kết luận nhân quả cho từng trigger từ mẫu 400 đời.

Đo hiệu năng riêng sau khi kết thúc regression: 3 lượt × 60 đời/mã, warm-up, thứ tự A/B đảo theo từng đời, seed/clock cố định, chuẩn hóa ms/năm. Chênh lệch **+2,19%, +3,07%, +2,80%**, trung vị **+2,80%** (khoảng +0,05–0,08 ms/năm). Không có tăng dung lượng schema; median bytes ba lượt 172771→172771, 167911→169375, 166495→164411. Đây là mô phỏng headless cục bộ, chưa profiling UI trên thiết bị người chơi.

Tài sản cuối đời/base trong ba mẫu 60 đời có trung vị 3,42→2,56; 3,62→6,11; 5,01→4,16. Số đời âm tiền 8→11, 6→8, 5→8: cần theo dõi thêm khi nghiệm thu diện rộng, chưa kết luận toàn bộ cân bằng tài chính tốt hơn. Phân bố 50 sự kiện thực tế và các phân vị nằm trong gd3-results.json; không dùng vài mẫu thuận lợi để che chênh lệch.

## Changelog và file thay đổi

- Gameplay: public/js/engine.js, public/js/life143.js, public/index.html.
- Test/công cụ: tests/context-weighting.js, tests/save-safety.js, tests/fixtures/gd25-age100.json.gz, tests/update-gd3.js, tests/update-gd3-ui.js, tools/gd3-compare.js, package.json.
- Nhật ký: docs/update-extra.json, public/data/updates.json, public/js/updates.js, tools/build-update-history.js, CHANGELOG.md.
- Quy trình/báo cáo: AGENTS.md, docs/UPDATE-NOTES-POLICY.md, CONTEXT-WEIGHTING-GD3.md, gd3-triggers.json, gd3-results.json, báo cáo này.
- Mục mới “Một Đời — Mỗi cuộc đời, một hoàn cảnh khác nhau!”, nhãn 8.5.0-gd3, publishedAt là thời điểm chuẩn bị thực tế có múi giờ; releaseStatus=packaged, releasedAt=null. Chưa công bố đã ra mắt.
- Đã sửa công cụ dựng lịch sử để giữ các mục biên tập không nằm trong commit import. Toàn bộ 91 mục cũ giữ nguyên; mục mới sống sót qua generator. Không tạo nhật ký thứ hai. Dữ liệu tĩnh, bình luận D1 riêng.

## Giới hạn nghiệm thu và khôi phục

**Preview / CHƯA sẵn sàng upload Production theo chuẩn nghiệm thu toàn bộ.** Chưa chạy đủ mọi mục regression hoặc mọi lựa chọn, chưa kiểm bản lưu thật; chưa xác minh lại REVIEWS_DB/Production. Đã hoàn thành phạm vi triển khai GĐ3 và vòng kiểm tra có giới hạn nêu trên; không chuyển GĐ4.

Bản trước: e9fd613 (nghiệm thu bad8ed9). Khi cần quay lại, bảo vệ ba file riêng và dùng checkout khác tại e9fd613 hoặc revert commit GĐ3 sau khi xem diff; không reset --hard/git clean. Chủ dự án có thể upload lại gói ổn định trước từ commit cũ. Không sửa lịch sử hoặc database.

Thông tin commit/push và SHA/kích thước artifact cuối sẽ được ghi sau khi thực hiện, không dùng artifact của lượt kiểm tra máy nhà làm gói GĐ3.

## Bàn giao artifact đã kiểm chứng

- Mã nguồn commit `b3ada6f810793e8ab038f902cb2fcf842d90da42` đã push origin/gd3-context-weighting, remote ref khớp.
- `npm run package:cloudflare`: **PASS**, build mới sau commit; dist và dist.zip ở gốc dự án. **28 file, 2.302.679 byte**.
- SHA-256 ZIP: `e259ffcdbb7a280a4a38ddd1f4738c12f29ead04038ce7bfa9a1cee8cc429cdf`.
- ZIP đọc lại toàn bộ tên/content SHA-256 khớp dist, có index.html ở gốc, .well-known, _worker.js, _routes.json, _headers. Không có nguồn module/source maps hoặc dữ liệu D1.
- Loading: 8 đời nguồn/bản nén giống nhau; hash/tài nguyên/font/cú pháp/cache đạt. API admin kiểm quyền với D1 trong bộ nhớ đạt, 1.506 mục catalogue.
- `node tests/update-gd3.js` đạt trên build. Trang build qua Edge desktop/mobile, tìm kiếm/lọc/tải thêm/status và không tràn ngang/pageerror đạt.
- Artifact và kết quả build được lưu trong commit tiếp theo trên cùng nhánh; không tạo commit rỗng, không merge main. Tên commit cuối xem lịch sử Git/biên bản chat để tránh tham chiếu hash của chính commit đang tạo.
- **Sẵn sàng upload Production: CHƯA** (Preview, chưa regression toàn bộ và chưa kiểm binding/API thực tế). Không deploy. REVIEWS_DB phải giữ đúng database hiện hữu khi chủ dự án quyết định upload.
