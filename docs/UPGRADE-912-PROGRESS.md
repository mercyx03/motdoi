# Nâng cấp 8.10.12 (mã 912) — theo dõi tiến độ theo PROMPT_CLAUDE_CODE_UPDATE_MOT_DOI.md

**Trạng thái (02/11/2026, 8.10.20): MD1 §11–§14 đã triển khai; Phần B (MD2) B1–B8 đã làm; Phần C (MD3) C1–C11 đã có cơ chế cốt lõi, còn nhiều mục con chưa làm/chưa kiểm chứng (bảng đối chiếu ở "Đợt 11"). Chưa nghiệm thu toàn diện. 8.10.19 ghi released theo yêu cầu trong chat, chưa có xác nhận upload; 8.10.20 là bản đóng gói, chưa phát hành.** Không tự deploy Production.

## Hồ sơ tiếp nối (đọc trước khi làm tiếp)
- Đã xong và kiểm chứng: §3 khối THPT, §5 lag bảng hành động + hồ sơ trong suốt, §4 bộ chọn tài sản, §6 lượt tìm/đồng ý, §8 làm mới danh sách mập mờ, §10 gói cố vấn (+ sửa tỷ giá USD ở life170/life176).
- Đã xong thêm (8.10.13): §9 chu cấp chủ động, §7 người nổi tiếng.
- Đã xong thêm (8.10.14): phần lớn §12.
- Đã xong thêm (8.10.15): §11.1–11.3 di truyền, sàng lọc, đa thai.
- Đã xong thêm (8.10.16): §11.4–11.5 bệnh mắc phải, ung thư, phát triển trẻ.
- Đã xong thêm (8.10.17): §13 đủ 195/195 nước đạt tối thiểu có nguồn + tích hợp (187 hồ sơ mới loại `compiled-912`), §12 thủ lĩnh nhóm/kế vị/tan rã + trợ giúp pháp lý trong trại, §11 suy thận/suy gan theo giai đoạn, §14 bộ quét bất biến + 4 lỗi tái hiện đã sửa. Chi tiết ở mục "Đợt 9 (8.10.17)" bên dưới.
- **Việc tiếp theo cụ thể:** chủ dự án quyết định thứ tự nén thu nhập/thuế (life115 vs tax-resident); sau đó C4 BHYT/BHNT, C3 chỉ số theo ngành, chặn bán nhà ở xã hội 5 năm, du học/lao động nước ngoài đòi hộ chiếu, đọc nguyên văn các văn bản đang ở mức "nguồn thứ cấp".
- Thứ tự đề xuất cho phần còn lại: (phần còn lại của §12)  phi pháp/nhà tù (bắt đầu bằng kiểm kê mọi lời gọi `H.jail`, `jailUntil`, `CRIME911`, `life176`) → §11 y tế/di truyền (bắt buộc tra nguồn chính thức trước khi mã hóa, ghi URL/ngày) → §13 quốc gia (chạy lại `tools/audit-country-depth.js`, lập bảng 195 × 6 miền) → §14.
- Các điểm mở rộng đã có sẵn: `E.ROMANCE912` (lượt tìm, đồng ý), `E.ASSET912` (bộ chọn/phân trang, `E.usdToLocal`), `E.KHOI912`, sổ ghi `ledger912` trong khóa thừa kế.

## Nền tảng đã ghi nhận
- Nhánh `codex/life-context-upgrade`, HEAD gốc `30152fc` (8.10.11 gameshow-crime). Working tree ban đầu: `.local-state-review.txt`, `Claude.md`, `PROMPT_CLAUDE_CODE_UPDATE_MOT_DOI.md` chưa theo dõi — giữ nguyên, không stage.
- Runtime: Node v24.20.0, Windows 10, Chrome headless qua `tests/lib/cdp.js`. Máy đo: Intel i5-10200H 8 luồng, 16 GB.
- Kiến trúc: JS chia module, thứ tự nạp theo `public/index.html`; build `tools/build.js` (esbuild). Module mới nạp sau `blood-donation.js`, trước ranh giới UI `scene.js`.

## Bảng yêu cầu → module → save → UI → test → trạng thái

| Mục | Yêu cầu | Module/hàm cuối cùng | Dữ liệu save | UI | Test | Trạng thái |
|---|---|---|---|---|---|---|
| §3 | Chọn khối THPT không bị bỏ lỡ, không âm thầm A00 | `khoi-track.js` (`E.KHOI912.due`, bọc `DEC.chon_khoi`, trigger cũ, `HOOKS.gradUpper[0]`), điểm gọi trong `engine.js beginYear` | `l.khoi` (giữ nguyên), `l.flags.khoi912 {v,src,at,changes,hist}` | Tình huống chọn khối có môn thi; mục Học tập "Chọn khối thi THPT / Xem – đổi khối thi"; `app.js` gắn `byHand912` khi người chơi bấm | `tests/khoi912.js` (269), `tests/ui912-browser.js`, `update840`, `exam127` | **Đã sửa, đã kiểm chứng** |
| §5 | Lag, khung hồ sơ trống, click trễ | `life109.js` wrapper `E.actions` (bỏ deep-clone theo từng hành động); `css/style.css` `.modal.profile` | không đổi | Bảng hành động, hồ sơ chi tiết | `tests/perf912.js` (20), `tests/ui912-browser.js` | **Đã sửa 2 nguyên nhân gốc, đã kiểm chứng**; các màn khác chưa đo hết (xem dưới) |
| §4 | Tài sản: lọc, phân trang, nhóm USD, di chúc | `asset-picker.js` (`E.ASSET912`): menu `sell912`/`sell912_ok` (thay luồng bán của `quan_ly_dau_tu` khi người chơi bấm), thay `will150_asset` (life150) và `giftAsset112` (life112); ô tìm kiếm trong `app.js` | không thêm trường bắt buộc; dùng `uid110` sẵn có, `flags.will150.specific`, `flags.family129.trades`; trạng thái lọc nằm trong `pending[0].data.arg` | Bán / tặng con / di chúc: nhóm USD, loại, trạng thái, tìm, sắp xếp, 20 mục/trang | `tests/assets912.js` (192), `tests/assets912-browser.js`, `feedback-e`, `estate840`, `expansion842`, `family129`, `browser-feedback-menus e` | **Đã làm, đã kiểm chứng** (cho thuê: hệ hiện tại tự cho thuê mọi BĐS đầu tư, chưa có menu chọn căn để cho thuê/ngừng thuê) |
| §6 | Tìm người yêu 10 lượt/năm, tách gặp/đồng ý | `romance912.js` (`E.ROMANCE912`): bọc `E.resolve` (đếm lượt, gắn cờ `search912` cho chuỗi quyết định từ lượt tìm), `DEC.love.apply` (quyền từ chối), `tim_nguoi_yeu`/`dating108`/`network108` (điều kiện trong handler); `engine.js prune` cho phép quyết định từ lượt tìm tới 85 tuổi | `flags.romance912 {v,at,used,streak,hist}` | Hiển thị đã dùng/còn lại trong bộ lọc, Tìm một nửa, danh sách mập mờ; gợi ý nới bộ lọc khi quá hẹp | `tests/romance912.js` (114), `browser-dating-app`, `relationships108/841`, `family129/130` | **Đã làm, đã kiểm chứng** |
| §7 | Mở rộng quan hệ người nổi tiếng | `celeb912.js` (`E.CELEB912`) trên contact của `life148` (`E.ELITE148.meet/find/contacts`); `life148 prune` giữ người đang có quan hệ | trên contact: `rel912 {stage,trust,gifts,hist,n,y}`, `fame912`, `marital912`, `orient912`, `city912`, `openness912`; `flags.celeb912 {used,demand,band}`; người yêu: `partner.contact148` | Mục “Mở rộng quan hệ với người nổi tiếng” (Tình yêu & hôn nhân) | `tests/celeb912.js` (26), `tests/social913-browser.js` | **Đã làm, đã kiểm chứng** (chưa nối thai kỳ cho nhánh một đêm) |
| §8 | Kết thúc và làm mới danh sách mập mờ | `romance912.js`: lựa chọn `reset912` + xác nhận `network912_reset`; bọc `network108_person` (kết thúc không cần lượt gặp); làm quen người mới dùng chung lượt tìm, có thể gặp lại người cũ | `flags.network912 {v,ended[],resetAt}`; người cũ giữ `relation108` | Danh sách mập mờ | `tests/romance912.js` | **Đã làm, đã kiểm chứng** |
| §9 | Chủ động chu cấp | `sponsor912.js` (`E.SPONSOR912`), mở rộng hệ chu cấp life80/life130 | `flags.sponsor912 {cands[], deals[], serial}` | “Chủ động hỗ trợ một người trưởng thành”, “Các thỏa thuận hỗ trợ của bạn” | `tests/sponsor912.js` (164), `tests/social913-browser.js` | **Đã làm, đã kiểm chứng** |
| §10 | Gói cố vấn 5 triệu USD +50/chuyên môn | `life170.js` (mở rộng tại chỗ: `usdAmount`, `heirYear`, `heirComplete`, hook bù một lần, mô tả gói); `E.usdToLocal` trong `asset-picker.js`; `life176.js usdAmount` | `courses170[*].ledger912`, `done912`, `policy912` | Mô tả gói, tiến độ trong menu chọn chuyên môn (đã cộng/tối đa/dự kiến còn) | `tests/heir912.js` (23), `feedback-features895`, `leadership-education169-170`, `enterprise-chains173` | **Đã làm, đã kiểm chứng** |
| §11 | Y tế, di truyền, thai kỳ, phát triển trẻ | `genetics912.js` (`E.GENETICS912`) theo khung di truyền ABO của `blood-donation.js`; nối `STANDING158.relativeFacts`, `childOpts/createLife`, `E.migrate`, `E.resolve` + hook năm (bắt mọi ca sinh) | `flags.genetics912 {self, parents, tests, births}`, `flags.cond912`; trên con: `genes912`, `cond912`, `multi912`, `monozygotic912`, `legacy912` | “Khám sức khỏe & sàng lọc di truyền”, “Kế hoạch chăm sóc sức khỏe cho con”, hồ sơ con | `tests/genetics912.js` (1195), `tests/health915-browser.js`, `blood910`, `health-tax909`, family* | **11.1–11.5 đã làm, đã kiểm chứng** (`health915.js`: ung thư theo giai đoạn, phác đồ, tác dụng phụ, chế phẩm máu, buồng truyền, tái phát, lao, mất ngủ, lupus, tóc, phát triển trẻ; `tests/health915.js` 984); suy thận/suy gan theo giai đoạn đã làm ở 8.10.17 (`E.ORGAN917`, `tests/organ917.js` 118) |
| §12 | Phi pháp, băng nhóm, nhà tù (+8.10.17 lãnh đạo nhóm, pháp lý trong trại: `crimeLeader912`, `crimeSplit912`, `tg_phap_ly912`, `tests/crime917.js` 1.329) | `crime912.js` (`E.CRIME912`) mở rộng CRIME911 + life47; bọc `H.jail`, `E.careerYear`, `E.startJob`, `E.underworldRisk/DeathRisk`, `CRIME911.rate`; life47/crime-depth đọc qua hàm công khai | `flags.crime912 {territory, hires, sentences}`; trên `crime911.crew[*]`: `role912, skill912, trait912, cut912, hist912` | “Đàn em, địa bàn và rủi ro”, bảng rủi ro trong kế hoạch năm, lựa chọn yểm trợ khi bị đánh úp | `tests/crime912.js` (299), `tests/crime913-browser.js`, `crime911`, `update490` | **Đã làm phần lớn, đã kiểm chứng**; trại giam giữ chuỗi sẵn có của CRIME911/life43 (chưa thêm mới) |
| §13 | Làm sâu quốc gia | `data-country-world912*.js` (dữ liệu, nạp trước `life173`) mở rộng `COUNTRY_DEPTH_DATA`; `tools/country-sources-912.js` (kiểm URL, bảng 195 × 6) | `flags.culture173.cases` sẵn có | Câu chuyện riêng ở nơi đang sống, đối chiếu lao động, lễ hội, món ăn, chuẩn bị cưới | `country-minimum-content` (399.955), `browser-country-minimum-content` (14 nước × 390/1280), `audit-country-depth` | **195/195 đạt tối thiểu có nguồn + tích hợp; 187 hồ sơ `compiled-912` chưa đối chiếu từng câu** |
| §14 | Rà soát liên hệ thống | `tests/integrity917.js` (bất biến tiền/NaN/nhật ký/quyết định/ID/anh chị em/nhiều thế hệ); sửa `life92`, `wealth`, `life73`, `health915` | — | — | `integrity917` (160 đời: 2.633; 600 đời: 9.208) | **4 lỗi tái hiện đã sửa; phần còn lại ở backlog** |

## Đợt 11 (8.10.20) — tiếp Phần C, kiểm chứng nguồn, thử giao diện

Baseline: commit `c69d094` (8.10.19). Git sạch, khớp origin trước khi bắt đầu.

**Bằng chứng phát hành 8.10.19:** mục `state-drama-era-819` mang `releaseStatus: released` (22:56 01/11/2026 +07:00) vì chủ dự án yêu cầu trong chat "nhớ ghi là đã phát hành ... để tôi phát hành" — tức được đánh dấu **trước** khi upload. Trong repository không có xác nhận upload thực tế. Coi là **chưa xác nhận đã lên Production**. Bản 8.10.20 để `packaged`, không đánh dấu phát hành.

### Đối chiếu Phần C (cuối đợt 11, sau khi làm tiếp theo yêu cầu "làm hết")

| Mục | Đã làm (có cơ chế + test) | Còn giản lược / giả định | Chưa kiểm chứng |
|---|---|---|---|
| C1 ba lớp | verified/projection/simulated; mức đối chiếu nguồn `ver` hiện trong game | — | nhiều văn bản mới đối chiếu nguồn thứ cấp (docs/ERA-POLICY-917.md) |
| C2 đồng hồ, kịch bản | năm thế giới; kịch bản chọn một lần; vòng đời đề xuất → thí điểm → áp dụng → đánh giá lại; Cân bằng chậm, chọn lọc; **cán bộ đề xuất toàn quốc (cấp bộ) hoặc thí điểm ở tỉnh (cấp tỉnh), có thẩm định, tốn ngân sách đơn vị** | thí điểm tỉnh chỉ tác động người sống trong tỉnh đó (dữ liệu dân cư không sinh hàng loạt) | — |
| C3 giá, lương, ngân sách | lịch sử giá chung theo nước/năm; **chỉ số riêng nhà ở, y tế, học phí, đi lại (so với mặt bằng lương, trần 0,9–1,1); lãi suất điều hành; tỷ giá**; ngân sách gia đình, quỹ khẩn cấp, tự cắt chi; **lương công vụ theo lương cơ sở 2,53 triệu và lương hưu điều chỉnh** | lãi suất/tỷ giá mới hiển thị, chưa đổi lãi khoản vay cũ (giữ hợp đồng danh nghĩa theo C3) | — |
| C4 thuế, bảo hiểm | phiếu lương tách quỹ; **BHYT hộ gia đình đóng hằng năm, mất thẻ khi không đóng; quỹ hưu trí tự nguyện trừ thuế, rút đúng/trước tuổi; bảo hiểm nhân thọ có thời gian chờ và loại trừ bệnh có sẵn** | khám trái tuyến dùng tham số sẵn có của life77 | lỗi có sẵn: life115 nén thu nhập sau thuế |
| C5 lao động | thai sản; nghỉ ốm; trần thất nghiệp; đào tạo lại; **tăng ca ×150% có trần 200/300 giờ, phép năm; thực tập (có/không phụ cấp) mở việc khi tốt nghiệp; người khuyết tật: xác định mức độ → trợ cấp hằng tháng, điều chỉnh nơi làm việc; thu nhập tối thiểu (giả định, An sinh mở rộng)** | khuyết tật dựa trên dev915 của health915 (trẻ sinh từ bản di truyền) | mốc ngày ốm, hệ số trợ cấp |
| C6 gia đình, nhà ở | trợ cấp trẻ (giả định); nhà ở xã hội; **vay sinh viên NHCSXH; miễn học phí trừ vào chi phí con; BHYT trẻ dưới 16 (giả định); bán/chuyển căn hộ xã hội trước 5 năm → khoản vay ưu đãi đến hạn ngay** | khóa 5 năm xử lý sau khi giao dịch (các mục bán/tặng sẵn có không bị chặn trước) | — |
| C7 giao thông, DN | vùng phát thải thấp Hà Nội; vé xe buýt (giả định); **thuế hộ kinh doanh/TNDN trừ tiền thật từ 2026 (ưu đãi xe đưa đón đúng cách tính); lệ phí trước bạ xe xăng/điện khi mua xe** | doanh thu ước tính = 4 × lợi nhuận; lệ phí ô tô điện sau 2027 là giả định | — |
| C8 ngoại hình | 8.10.19 | lão hóa theo cá nhân chưa đổi | — |
| C9 quốc tịch, hộ chiếu, visa | quốc tịch/hộ chiếu con; hộ chiếu người chơi; miễn thị thực / **e-visa** / visa; xét cố định theo năm; du lịch cùng con; **sang nước ngoài học/làm việc tự làm hộ chiếu có lệ phí** | danh sách miễn thị thực/e-visa theo nguồn thứ cấp | — |
| C10 hiến máu | 18–60; 65 theo kịch bản | — | TT 26/2013 còn hiệu lực? |
| C11 drama × thời đại | giá cả leo thang; chăm cha mẹ (nối tình huống `care`); chuyển đổi số; **cán bộ đề xuất chính sách** | — | — |
| C12 kiểm thử | xem "Kiểm thử đợt 11" | Monte Carlo theo kịch bản chưa làm riêng | — |

### File đã sửa
- Mới: `public/js/econ918.js`, `public/js/travel918.js`, `public/js/welfare918.js`, `tests/econ918.js`, `tests/welfare918.js`.
- Sửa thêm cho phần hoàn thiện: `tax-resident.js` (trừ quỹ hưu tự nguyện), `expansion.js` (bảo hiểm nhân thọ), `life3.js` (hệ số lương công vụ trước bảo hiểm/thuế), `engine.js` (điểm nối E.livingCost918), tests depth900/update500 (fixture có hộ chiếu/visa — quy tắc mới, không bỏ assertion).
- Sửa: `public/js/era917.js` (nguồn, mức kiểm chứng, kịch bản Cân bằng, lịch sử giá chung, lương tối thiểu vùng/mức tham chiếu theo năm, `cname`, `custody`), `public/js/drama917.js` (điểm nối `more`, giới hạn chung d917/d918), `public/js/life3.js` (trần căn cứ đóng), `public/js/abroad-depth.js` (cần hộ chiếu; xét visa cố định), `public/js/life147.js` (nhóm con cho mục mới), `public/js/app.js` + `public/css/style.css` (văn bản nhiều dòng), `public/index.html` (thứ tự script, khóa cache), `tests/era917.js`, `tests/regression-contexts.js`, `package.json` (8.10.20, thêm econ918 vào test:upgrade912), `docs/ERA-POLICY-917.md`, `CHANGELOG.md`, `docs/update-extra.json`, `public/data/updates.json`.

### Lỗi tìm thấy khi thử và đã sửa
1. Phiếu lương lệch tiền thật với người thu nhập trên 1,2 lần mức cơ sở (life115 nén sau thuế) → phiếu ghi dòng "Điều chỉnh thu nhập bền vững của game", thực nhận khớp sổ (kể cả xem phiếu năm trước).
2. Tên nước hiện mã ("VN", "KR") ở mục quốc tịch con (`cname` gọi API không tồn tại).
3. Văn bản tình huống nhiều dòng bị dồn một đoạn (ảnh hưởng cả state917/era917/drama917 của 8.10.19).
4. Chuỗi chăm cha mẹ ban đầu là trigger độc lập, trùng tình huống `care` của engine → chuyển thành diễn biến tiếp theo của lựa chọn gốc.
5. Trợ cấp trẻ (8.10.19) lọc theo trường không tồn tại (`custodyOther`) → dùng `custody`.
6. Số thập phân dùng dấu chấm.

### Thử giao diện (trình duyệt tích hợp, máy chủ dev)
Dựng bản lưu thử (VN, 40 tuổi, Phó Thủ tướng, vợ quốc tịch Hàn, 2 con, Hà Nội, xe máy), tải lại trang và "Tiếp tục sống" nhiều lần (lưu/tải). Đã bấm: Phiếu lương; Ngân sách gia đình (bật tự cắt chi, mở lại thấy trạng thái); Nhà ở xã hội (từ chối đúng vì thu nhập); Chính sách theo thời đại; Nhịp biến cố; Chăm sóc da (phân trang, "← Quay lại"); Hộ chiếu (nộp → chờ → nút ẩn → năm sau cấp); Quốc tịch và hộ chiếu của con (nộp hộ chiếu cho con → năm sau cấp, hạn 5 năm); Hồ sơ chức vụ; Nhân sự (giao nhiệm vụ, 3 → 2 việc); Dự án công (ngân sách đơn vị giảm, tiền riêng không đổi); Xin thôi giữ chức → "Suy nghĩ lại" (giữ chức); Đào tạo lại (đăng ký → khóa khác ẩn → năm sau hoàn thành); tình huống gốc "Mẹ đã già yếu" → chuỗi chăm mẹ được tạo và lưu. Mobile 375 px: phiếu lương hiển thị đủ, không tràn ngang.
Chưa thử trên giao diện: các quyết định hệ thống nghỉ ốm, vùng phát thải thấp, đến lượt nhà ở xã hội, chuỗi giá cả leo thang (đã kiểm bằng test và regression mục 9 với ngữ cảnh dựng sẵn); du lịch gia đình bằng giao diện; trình duyệt thật ngoài khung tích hợp.

### Kiểm thử đợt 11

Test chuyên đề trên mã cuối: `era917` 179, `econ918` 378, `welfare918` 155, `drama917` 218, `state917` 67, `state-career174` 222, `integrity917` 2.670 (0 lỗi), `health-tax909` 1.071, `career109` 698, `abroad917` 18, `continuity906` 2.069, `feedback-b` 1.513, `feedback843` 253, `depth900` 58, `update500` 163.015, `update458` 124, `update511` 1.030, `blood910` 10.556 — đều đạt. `depth900`/`update500` đổi fixture (có hộ chiếu, visa đã cấp) vì quy tắc mới; không bỏ assertion. Regression mục 9 cho 20 quyết định mới/đổi: 103.071 đạt, 0 lỗi.

Test hỏng sẵn (cũng lỗi trên baseline c69d094): `blood910-updates` (chụp nhật ký 8.10.10), `chains-gd4` (giả định có đời không chạm chuỗi, trái với drama 8.10.19).

Regression toàn bộ (tests/regression-shard.js, so với baseline c69d094 trong worktree tạm):

| Phần | Mã cuối 8.10.20 | Baseline 8.10.19 | Nhận xét |
|---|---|---|---|
| 0–8, 5b | 273.877 đạt / 4 lỗi | 272.101 / 5 | Cùng loại: nợ nặng cuối đời VN (18,5% so với 14,7%), sự kiện sau khi qua đời (1 đời), "major" (mong manh), 60% tình huống tự nhiên |
| 10–40 | 351.413 đạt / 10 lỗi (trước khi sửa lỗi xe thuê) → sửa, mục 28 chạy lại 66/0 | 354.926 / 10 | 9 loại còn lại đều có ở baseline |
| 41–99 | 714 / 2 | 714 / 2 | "70 tuổi…" có ở cả hai; "nhật ký nhắc người đã mất như còn sống (1)" mới thấy ở mã cuối, baseline có lỗi khác ("60% kết hôn") — chỉ số mẫu, chưa phân tích |
| 9 (cùng tập ID từng shard) | 0 lỗi hành vi; 43 tình huống không có khuôn | 0 lỗi hành vi; 60 không có khuôn | Chỉ `nhap_quoc_tich` mới thiếu khuôn; chạy riêng thì cả hai bản đều thiếu (chỉ tới được qua `dinh_cu`) — chưa giải thích hết |

Lỗi tìm thấy nhờ regression và đã sửa: tình huống `treat` hẹn trước khi bệnh đã không còn (engine thêm `valid`); chỉ số đi lại nhân cả xăng/sạc của xe thuê theo hợp đồng.

Đo cân bằng 1.000 đời VN cùng seed (scratchpad bal918.js): baseline tuổi thọ 71,64, chết với tài sản âm 18,6%, tiền mặt trung vị tuổi 40 = 2,94 lần mức cơ sở → mã cuối 71,06 / 18,7% / 3,04; 4,38 chuỗi biến cố/đời (baseline 3,54); ~1,2 lần nghỉ ốm/đời. Regression mục 5: nợ nặng cuối đời VN 14,7% → 18,5% — **cần theo dõi**: chi phí thật mới (BHYT hộ gia đình, thuế kinh doanh, nghỉ ốm không lương) chưa có thu nhập tăng tương ứng ở khu vực tư.

**Lượt cuối sau khi sửa thứ tự thuế (02/11/2026):**
- Regression toàn bộ: mục 0–8 273.646 đạt / 5 lỗi (cùng loại đã có ở baseline: sự kiện sau khi qua đời, nợ nặng, "major", 60% tình huống tự nhiên); mục 10–40 358.410 đạt / 8 lỗi (cả 8 loại đều có ở baseline); mục 41–99 712 / 4 → sửa phí hộ chiếu trẻ theo gia đình ra nước ngoài (trước đây trừ vào tiền của trẻ), mục 65 chạy lại 6/0; mục 9 (3 shard) 0 lỗi hành vi, 43 tình huống không có khuôn (baseline cùng thành phần: 60).
- Nợ nặng cuối đời: con số trong regression dao động mạnh giữa các lượt (14,7% → 20,6%) vì ID nhân vật ngẫu nhiên làm đời rẽ nhánh. Đo lại trên đúng 600 seed của phép kiểm (88000+i), tắt từng khoản: BHYT hộ gia đình là nguyên nhân lớn nhất (−1,5 điểm), chỉ số ngành (−0,8), các khoản khác không đáng kể. Sau khi hỗ trợ 70% phí BHYT cho hộ cận nghèo và thu hẹp chỉ số ngành về 0,9–1,1: **14,5% so với baseline 15,0%; tuổi thọ 72,13 so với 71,94**.
- Thuế: thuế TNCN và thuế kinh doanh tính trên thu nhập sau điều chỉnh bền vững; bảng Tài chính năm thử trên giao diện cộng trừ khớp (37,84 − 3,97 − 8,58 − 0,49 = 24,80 triệu/tháng).

Thử giao diện thêm (sau phần hoàn thiện): BHYT và quỹ hưu trí tự nguyện (đăng ký 1 triệu/tháng), Hỗ trợ người khuyết tật (nộp hồ sơ cho con), Đề xuất và thí điểm chính sách (lãnh đạo UBND Đà Nẵng chỉ thấy 3 chính sách địa phương, nộp đề án vé xe buýt → lưu và thẩm định năm sau), chuỗi "Một năm chăm mẹ" hiện trên giao diện. Lỗi thao tác thử: bấm tự động đã chọn "nghỉ việc"/"mua nhà" ở vài tình huống — do công cụ thử, không phải game.

## Đợt 10 (8.10.19) — Phần B (MD2) và Phần C (MD3), phạm vi đã làm

| Mục | Nội dung | File | Test | Trạng thái |
|---|---|---|---|---|
| B1–B3 | Chức vụ gắn bộ/tỉnh/thành phố (`l.job.post917`: agency, territory, kind, lịch sử chuyển chức, phân loại thăng/điều động/hạ); tên chức danh "· Bộ X", "· tỉnh Y", "Thành ủy · thành phố …"; NHNN `employer123` đúng; bản lưu cũ ghi "chưa xác định" (bổ sung trong mục Chức vụ), không bịa | `public/js/state917.js` | `tests/state917.js` (67) | Đã làm |
| B4 | Xin thôi giữ chức có xác nhận (hạ một bậc, ghi hồ sơ); kiểm điểm người đứng đầu có giải trình, cách chức qua `lower()` | `state917.js` | `state917.js` | Đã làm |
| B5–B6 | Nhân sự trong đơn vị (tên, tính cách, năng lực, liêm chính chưa biết đến khi đánh giá); thẩm quyền: không (<4), đề nghị (4–5, cấp trên có thể từ chối), quyết định (≥6); tối đa 3 việc/năm; người được nâng đỡ giúp hoặc bất đồng | `state917.js` | `state917.js` | Đã làm |
| B7 | Dự án công: ngân sách đơn vị = thu nhập cơ sở × bậc × 1,5/năm, tách tiền riêng, tối đa 2 dự án, cú sốc tiến độ, nghiệm thu đạt/không đạt; KPI tăng tự nhiên dừng ở 70 | `state917.js`, `life174.js` | `state917.js` | Đã làm |
| B8 | 9 chuỗi biến cố nhiều năm trên `E.CHAIN144` (không thêm bộ điều phối mới); bộ khởi phát chung: tối đa 1 chuỗi mới/năm, 2 chuỗi drama mở, chờ 6 năm/loại; cường độ Êm đềm ×0,5 / Cân bằng ×1 / Nhiều biến động ×1,6 chỉ đổi tần suất | `public/js/drama917.js` | `tests/drama917.js` (219) | Đã làm |
| C1–C2 | Năm thế giới, bảng chính sách ba lớp có nguồn, kịch bản chọn một lần, năm hiệu lực giả định băm theo nhân vật và lưu | `public/js/era917.js`, `docs/ERA-POLICY-917.md` | `tests/era917.js` (144) | Đã làm |
| C3 | Chỉ số giá/lương tham khảo, tích lũy từng năm, không đổi tiền | `era917.js` | `era917.js` | Đã làm phần hiển thị; ngân sách hộ chưa làm |
| C4 | Lộ trình hưu 2019 qua `E.retirementAge125`; kịch bản Cải cách +3 tháng/năm đến 63/62 | `era917.js` | `era917.js` | Đã làm; bảng lương gộp/thực nhận theo quỹ chưa làm |
| C5 | Thai sản (trợ cấp một lần, nghỉ hưởng thay lương, không truy lĩnh con cũ); trần thất nghiệp 5 × lương tối thiểu vùng | `era917.js`, `life3.js` | `era917.js` | Đã làm; nghỉ ốm/đào tạo lại chưa làm |
| C6 | Trợ cấp trẻ dưới 6 tuổi (chỉ kịch bản An sinh mở rộng) | `era917.js` | — (chạy qua đời đầy đủ) | Một phần |
| C8 | Chăm sóc da (mặc định không tốn tiền, có trần qua `LOOKS134.improve`), mụn tuổi dậy thì, phong cách trang điểm không khóa giới/sắc tộc; tóc dùng `hair915` sẵn có | `era917.js` | `era917.js` | Đã làm |
| C9 | Quốc tịch con: đủ điều kiện ≠ có; đăng ký quốc tịch thứ hai; hộ chiếu làm thủ tục, dưới 14 tuổi 5 năm | `era917.js` | `era917.js` | Đã làm; visa du lịch chưa làm |
| C10 | Tuổi hiến máu 60, kịch bản mở rộng 65 cho người hiến nhắc lại khỏe | `era917.js`, `blood-donation.js` | `era917.js` | Đã làm |
| C7, C11 | Giao thông/thuế doanh nghiệp; biến cố gắn chính sách | — | — | **Chưa làm** |

Lỗi tìm thấy khi viết test: hàm băm FNV-1a không có bước trộn cuối → các lần tung theo năm cùng nhân vật tương quan (có đời 25 năm "Nhiều biến động" không có chuyện nào). Đã thêm bước trộn ở `drama917` và `state917`. Một hook năm gọi lại `E.migrateExt` mỗi năm → migration "con sinh trước bản cập nhật" phải chạy một lần theo cờ `era917v`.

Đo có kiểm soát (1.500 đời VN, seed 100000+i·7919, tắt/bật hook năm của drama917 + era917): tuổi thọ 71,65 → 71,23 (chênh 0,42 năm, trong biên nhiễu khi quỹ đạo rẽ nhánh, sai số chuẩn ~0,4); tài sản ròng âm lúc mất 18,9% → 18,9%; 3,53 chuỗi biến cố/đời (tranh công 2.153, tin đồn 1.031, người thân giấu nợ 860, di sản 732, đối tác 229, con ở trường 220, khiếu nại 59, định cư 17); 166 lần trợ cấp một lần khi sinh. Tranh công/tin đồn là hai loại nhiều nhất — theo dõi phản hồi người chơi trước khi chỉnh trọng số.

Lệnh kiểm thử đợt 10: `node tests/state917.js`, `node tests/drama917.js`, `node tests/era917.js`, `MOTDOI_DEC_IDS=<20 quyết định mới> node tests/regression-shard.js 9` (69.143 đạt, 0 lỗi), cùng `npm run test:upgrade912` (đã thêm 3 test mới).
Chưa kiểm chứng: đọc lại nguyên văn nguồn chính sách (xem giới hạn ở docs/ERA-POLICY-917.md); `publicReview116` sau luân chuyển; giao diện mobile của các mục mới (mới kiểm module tải được trên trình duyệt, không lỗi console).

## Đợt 9 (8.10.17) — phần tồn MD1: §13, §12, §11, §14

### §13 — 195 quốc gia
- Kiểm kê trước khi làm (chạy lại `tools/audit-country-depth.js`): 8/195 đạt, 187 còn thiếu. Cơ chế sự kiện nhiều năm, đối chiếu lao động, lễ, món ăn, chuẩn bị cưới **đã có** trong `life173` và chỉ đọc dữ liệu → không tạo hệ thống mới; thêm dữ liệu cho 187 nước qua `E.COUNTRY_WORLD912.add` (cùng trường `education/festivals/marriage/cuisine/labor/lifeEvents`).
- Mỗi nước: 3 lộ trình học (kỳ thi chỉ ghi khi nước đó có; không bịa tên thi), 3 lễ có thời điểm/kiểu lịch/hoạt động, 3 bước cưới hỏi (đăng ký, độ tuổi, tục lệ — không gán một tục cho cả nước), 5 món, 5 mục lao động (văn bản luật, giờ làm, phép, lương/an sinh, thực tế), 5 câu chuyện nhiều năm dựng từ chính dữ liệu đó. Hoàn cảnh thực (chiến tranh, hạn chế học tập với phụ nữ, khủng hoảng) ghi là khó khăn của nhân vật.
- Nguồn theo nước: hồ sơ giáo dục UNESCO GEM, trang quốc gia ILO (10 nước không có trang ILO dùng cổng chính phủ hoặc trang khu vực, ghi rõ), trang quốc gia UNESCO, cổng dữ liệu giới Ngân hàng Thế giới; Vatican dùng trang chính thức của Tòa Thánh/Nhà nước Vatican. `node tools/country-sources-912.js --check` (curl, HTTP 200 + tên nước trong tiêu đề): **561/748 đạt** (giáo dục, lao động, hôn nhân đủ 187×3). **187 URL trang quốc gia UNESCO chưa kiểm được**: máy chủ ngắt kết nối sau loạt yêu cầu đầu (đã kiểm tay thành công TH, KE, VA, KP, PS, FM trước khi bị chặn; mã sai trả 404). Không vượt cơ chế chặn. Kết quả: `docs/country-sources-912.json`; bảng 195 × 6: `docs/COUNTRY-COVERAGE-917.md`.
- Giới hạn trung thực: nội dung 187 nước do Claude biên soạn từ hiểu biết, URL đúng nước nhưng **chưa đối chiếu từng câu** → `metadata.confidence = 'source-linked'`, `authoring = 'compiled-912'`; audit giữ `fullyAccepted: false`. Câu chuyện nhiều năm dựng theo mẫu từ dữ liệu riêng của nước (tên kỳ thi, lễ, quy định), không phải văn bản viết tay riêng cho từng nước như 8 hồ sơ cũ.
- Kiểm thử: `country-minimum-content` 399.955 kiểm tra (195 hồ sơ / 975 câu chuyện; bắt đầu, thất bại, thử lại, hai lượt theo dõi, lưu/tải giữ danh tính, không cấp bằng/việc giả, hiệu lực quan hệ thật; cách ly 195 nước); trình duyệt 14 nước (thêm TH, KE, BR, DE, SA, FJ) × 390/1280: mọi kiểm tra gameplay đạt; assertion cuối "mục nhật ký mới nhất là bản 8 quốc gia" hỏng sẵn (cùng loại lỗi cũ của `blood910-browser`, không nới).

### §12 — Lãnh đạo nhóm, tan rã, pháp lý trong trại (mở rộng `crime912.js`)
- Người chưa đứng đầu có thủ lĩnh NPC ổn định (RNG theo id đời, không reroll khi tải). Khủng hoảng: xác suất 3,5% + sức ép/2500 + 2,5%/mâu thuẫn (+3% khi gắn kết <40), trần 22%/năm (tham số gameplay, `CRIME912.LEAD`). Giai đoạn 1: ủng hộ người kế nhiệm / tự đứng ra (25% + lòng tin đàn em + gắn kết + cấp − mâu thuẫn, 10–75%) / đứng ngoài / rời nhóm. Giai đoạn 2 năm sau: đóng góp 5% thu nhập hoặc thương lượng 2%; người đứng đầu thì củng cố hoặc thu nhỏ. Bỏ qua giai đoạn 1 thì tự lắng xuống, thủ lĩnh giảm tin.
- Người đứng đầu có thể bị đàn em thật thách thức: chia lại việc / giữ vị trí (45% + bảo vệ + gắn kết − mâu thuẫn) / nhường (mất đúng 1 cấp). Tan rã khi gắn kết <25 và ≥3 mâu thuẫn, chờ 4 năm giữa hai lần: giữ người tin ≥50 / theo nhóm khác (−1 cấp) / tạm lặn / rời giới. Không có biến động khi đang ở trại.
- Pháp lý trong trại: mỗi bản án (sổ án `sentences`) một đề nghị; còn ≥2 năm; trợ giúp miễn phí khi tiền < 2 lần thu nhập cơ bản, luật sư 0,6 lần, tự viết đơn. Kết quả sau ≥1 năm: giảm 1 năm (cập nhật sổ án) / thêm 2 điểm xét đặc xá (nối `jailPts` của life43) / không đổi. Xác suất (300 mẫu): tự viết < trợ giúp < trợ giúp có điểm thi đua, trần 60%; không bao giờ thả ngay.
- 200 nhóm yên ổn × 5 năm: phần lớn không có khủng hoảng lãnh đạo nhưng không phải tất cả (kiểm trong test).

### §11 — Bệnh thận mạn và bệnh gan mạn (mở rộng `health915.js`, `E.ORGAN917`)
- Nối `life.ill` sẵn có (`suy thận mạn`, `viêm gan B mạn tính`, `xơ gan do rượu`) và thêm khởi phát từ tiểu đường/tăng huyết áp/lupus (thận), nghiện rượu (gan). Hệ số tử vong của engine thay bằng nguy cơ theo giai đoạn (không cộng chồng), RNG riêng theo id đời + tuổi.
- Thận: eGFR giảm theo nguyên nhân và mức kiểm soát (kiểm chứng bằng công thức độc lập trong test); G4 → chuẩn bị (1 lần); G5 → chọn chạy thận/lọc màng bụng/bảo tồn; danh sách chờ; người thân hiến cần tương thích ABO (nối nhóm máu blood909/910), có quyền từ chối, không hỏi lại; thải ghép. Monte Carlo 300 người 60 tuổi: tử vong 5 năm lọc máu thấp hơn rõ so với bảo tồn.
- Gan: viêm mạn → xơ hóa → còn bù → mất bù; kháng virus HBV giảm tiến triển (×0,2), còn uống rượu ×2,5, đã cai ×0,4 và có thể lùi; DAA chữa HCV 95%; ung thư gan trên nền bệnh gan, tầm soát → giai đoạn I–II, không tầm soát → III–IV (nối phác đồ ung thư 8.10.16); ghép gan do rượu cần đã cai ≥1 năm.
- Chi phí: phần tự trả theo `E.bhytShare` (VN) hoặc mức bao phủ theo GDP; không bảo hiểm thì trả đủ. Nguồn: `docs/HEALTH-GENETICS-912-SOURCES.md` (KDIGO, NIDDK, WHO, MedlinePlus — đọc 01/11/2026).
- 300 đời VN tự chơi: tuổi chết TB nằm trong 66–80, có đời phát sinh chuỗi thận/gan; không lỗi nhật ký. Trình duyệt 390/1280: mở mục "Bệnh thận và bệnh gan mạn", thấy giai đoạn, quyền từ chối của người hiến, người thân cùng nhóm máu, đổi mức điều trị được lưu.

### §14 — Rà soát liên hệ thống
- `tests/integrity917.js`: 16 nước × 10 đời + 12 chuỗi 4 thế hệ (mặc định), tham số `INTEGRITY_N/INTEGRITY_SEED` để quét lớn. Bất biến: tiền và mọi số trong `flags` hữu hạn; chỉ số 0–100; nhật ký sạch; không quyết định treo; không có dòng sau khi qua đời; ID con và NPC không trùng; con không sinh sau khi mất; anh chị em ≥23 tuổi không "đang đi học"; người yêu trưởng thành; hồ sơ thận/khủng hoảng hợp lệ; migrate lưu sâu hai lần không đổi; bộ đếm thế hệ.
- Lỗi đã tái hiện và sửa: (1) anh chị em mang sang đời sau gán cứng "đang đi học" không bao giờ cập nhật (người 49 tuổi vẫn đi học) — `life92` mang theo nghề thật của người con, `wealth.sibYear` cập nhật khi ≥22 tuổi (bản lưu cũ tự sửa năm kế); (2) `flags.sponsor.feltN` NaN vì chỉ khởi tạo khi `feltAt` đã có (`life73`, NaN cũ tự sửa); (3) hook năm của `health915` (8.10.16) vẫn ghi chuyện mất ngủ/lupus sau khi ung thư gây tử vong cùng năm; (4) URL ILO của Bờ Biển Ngà và Thổ Nhĩ Kỳ giải mã sai ký tự (404).
- Chưa tái hiện được (giữ backlog): anh chị em "tên nam nhưng ghi em gái" (seed 777001 cũ) — 0 ca lệch giới tính trong các lần quét.
- Kết quả quét: 160 đời 2.633 kiểm tra 0 lỗi; 600 đời (seed 5.170.000) 9.208 kiểm tra 0 lỗi.

### Đã tái hiện cho Phần B (lỗi `ct_quy_hoach` đã sửa ở 8.10.18 — xem STATE-FIX-1; các điểm khác chưa sửa)
- `ct_quy_hoach` với bộ trưởng (`trung_uong` r5, bậc 8): `valid` = true, chọn "Nhận nhiệm vụ mới" → `chinh_tri` r3 "phó chủ tịch UBND tỉnh" (bậc 7). NHNN r4 hiện đúng "giám đốc Ngân hàng Nhà nước chi nhánh tỉnh" nhưng `employer123` trống. Giám đốc sở → luân chuyển chủ tịch xã → sau 2 năm: các đích ở `stateTransfer174` đều bậc ≥6 (không tụt về phó GĐ sở); đường `publicReview116` cần kiểm tiếp. Bộ trưởng không ghi bộ nào; bí thư tỉnh ủy không gắn tỉnh.

### Regression toàn bộ trên mã cuối (01/11/2026) — so với HEAD gốc 30eceed
- Cách chạy: `tests/regression-shard.js` toàn bộ 77 mục, mục 9 chia theo `MOTDOI_DEC_IDS` thành nhóm rời nhau phủ đủ `E.DEC` (đúng thiết kế file); song song cùng các nhóm đó trên worktree HEAD 30eceed; `MOTDOI_FAIL_LIMIT` để in đủ loại lỗi (assertion không đổi). Lượt `node tests/regression.js` một tiến trình trên HEAD đã dừng ở mục 9 vì chỉ in 40 loại lỗi đầu, không đủ để phân loại.
- Mã cuối (trước khi thêm ngữ cảnh): mục 0–8+5b 273.597 đạt / 5 lỗi; 10–40 349.893 / 9; 41–99 715 / 1; mục 9 (3 nhóm) 6,6 triệu đạt / 53 lỗi khi đã có ngữ cảnh quốc gia. HEAD: 93 lỗi (40 câu chuyện của 8 nước cũ không mở được trên khuôn nào, sự kiện sau khi qua đời ở nhiều đời, `TypeError … reading 'n'` ở mục 5…).
- Chỉ có ở mã mới và đã xử lý: 7 tình huống mới (thận/gan/kế vị) + 935 câu chuyện quốc gia cần ngữ cảnh → thêm vào `tests/regression-contexts.js` (dựng trạng thái bằng API của module); `marriageMove130` (khuôn ngẫu nhiên không có bạn đời đi làm) → thêm ngữ cảnh cố định; tuổi thọ TB VN 72,3 → 70,7 do nguy cơ thận/gan cộng chồng → hiệu chỉnh (2.400 đời cùng seed: 71,87 có chuỗi / 72,17 tắt).
- Còn hỏng, đã phân loại (không nới assertion):
  - "hơn 60% tình huống xuất hiện tự nhiên trong 1.500 đời" — 1253/2382 = 52,6% (HEAD 928/1437 = 64,6%): mẫu số tăng 935 câu chuyện chỉ dành cho cư dân từng nước, gần như không gặp trong 1.500 đời ngẫu nhiên. Cơ chế đã kiểm ở mục 9 bằng ngữ cảnh. **Cần chủ dự án quyết định** có loại câu chuyện theo quốc gia khỏi mẫu số hay không.
  - "quyết định cốt lõi `major` từng xuất hiện" — HEAD chỉ 1/1.500 đời; nay 0 do RNG lệch (đường chọn ngành kiểu cũ hiếm vì life67 đã thay). Ngưỡng mong manh từ trước.
  - "có kiệt sức, trầm cảm sau sinh…" — trầm cảm sau sinh 3 (ngưỡng >5) ở 250 đời; đo 1.000 đời: mới 44, HEAD 45 → không lệch thật, dao động RNG.
  - "tỷ lệ nợ nặng cuối đời hợp lý (vn)" — đã hỏng ở HEAD (16,8%), nay 16,7%.
  - "không có sự kiện nào sau khi qua đời" (VN63#18, W#47) — cùng loại lỗi có ở HEAD (VN#95, W#24, người giàu #52/#85/#185); đã sửa một nguồn (health915) và loại lỗi giảm; còn nguồn khác chưa tìm.
  - Các lỗi mục 10–40/41–99 (cầu thủ tự do, ung thư phẫu thuật 0/40, mục Chi tiêu, lặp câu ở nước ngoài, 70 tuổi thi bằng lái…) có ở cả HEAD.
- Chưa chạy lại toàn bộ sau các sửa cuối; đã chạy lại mục 9 cho mọi tình huống có ngữ cảnh mới và mục 0–8 (xem dòng kết quả ngay dưới).

### Lỗi người chơi báo trong đợt (01/11/2026)
- "Du học xong chọn ở lại làm việc nhưng không có nút Tìm việc": **đã tái hiện và sửa.** Nhánh du học mới (`abroad107_finish` → "Ở lại tìm việc") bị `abroad-depth.js` đổi sang cư trú tìm việc 2 năm (`abroad.perm=false`, `residence900.kind='jobsearch'`), trong khi "Tìm việc" chặn mọi người `perm=false` là "Đang ở nước ngoài theo hợp đồng" → 22/26 đời mất nút. Nay cư trú tìm việc hợp lệ được tìm việc; lao động theo hợp đồng vẫn bị chặn. `tests/abroad917.js` (18). Nhánh cũ `du_hoc_ve` → "Ở lại làm việc, định cư" vẫn đúng (kiểm trên giao diện).
- "Chọn cuộc đời rồi không tương tác được nút nào": **chưa tái hiện được** trên mã nguồn và bản `dist` mới, chế độ Việt Nam/thế giới, khổ 1280 và 375 px (chọn đời → bỏ qua hiệu ứng → bắt đầu → bấm lựa chọn đều chạy, không lỗi JS). Ghi chú: vòng quay ở chế độ thế giới dài hơn (~10 giây), tốc độ mặc định 1 năm ≈ 25 giây nên lúc đầu trông như đứng; build cũ trước khi tối ưu event-catalog mất >25 phút và có thể để lại `dist` thiếu `index.html` nếu bị dừng giữa chừng. Cần thêm thông tin (trình duyệt/thiết bị, bản đang dùng, có tiếp tục bản lưu cũ không, ảnh màn hình).
- Xác nhận sau khi thêm ngữ cảnh: mục 9 cho 986 tình huống mới (975 câu chuyện quốc gia, thận/gan, kế vị nhóm, pháp lý trong trại, marriageMove130) — 241.934 kiểm tra, **0 lỗi**.

### Hiệu chỉnh chi phí/nguy cơ thận–gan (8.10.18)
- Đo có kiểm soát, cùng script và seed (3.000 đời VN cho tuổi thọ; 600 đời cho nợ nặng): HEAD 30eceed 71,89 / 17,7%; 8.10.18 tắt chuỗi thận–gan 72,03 / 17,9%; bật (trước sửa) 71,69 / 17,6%; sau sửa 71,67 / 17,6%. Kết luận: chuỗi không làm tăng nợ, giảm tuổi thọ ~0,2–0,3 năm; số lệch trong regression là dao động giữa các lượt.
- Sửa: `ORG.cost.basic = 0` vì engine đã tính ngân sách y tế hằng năm cho bệnh đang mang (`F.health`) và thuốc bệnh mạn — trước đây thu hai lần; `full` chỉ thu phần thêm; chi phí chuyên khoa (lọc máu, ghép, kháng virus, biến chứng) chỉ trả khi còn dự phòng 0,5 lần thu nhập cơ sở, thiếu thì điều trị gián đoạn (nguy cơ tăng), điều trị tích cực thiếu tiền thì về mức cơ bản.
- Test: organ917 118, health915 984, integrity917, genetics912 1195, smoke, saves-compat, save-safety đạt.

### Phần B — STATE-FIX-1 (8.10.18): cán bộ nguồn không làm tụt chức lãnh đạo cấp cao
- Tái hiện (trước sửa): bộ trưởng `trung_uong` r5 bậc 8, `ct_quy_hoach.valid` = true, "Nhận nhiệm vụ mới" → `chinh_tri` r3 "phó chủ tịch UBND tỉnh" bậc 7. Nguyên nhân: `life84` chỉ chặn bằng `ctPath`; bản vá cũ ở `life174 §5.4` chỉ đổi rank sau khi đã `startJob('chinh_tri')`.
- Sửa ở `life174 §5.4` (không tạo module mới): `valid` trả false khi đang công tác nhà nước VN ở bậc ≥ 5; `nhan.run` kiểm lại lúc thực thi nên quyết định cũ còn chờ chỉ báo giữ nguyên chức. Cán bộ cấp dưới vẫn được quy hoạch như cũ.
- Test: `state-career174` 222 (+8: bộ trưởng, quyết định cũ, GĐ sở, NHNN r5, Tỉnh ủy r6, CT tỉnh, cán bộ cấp dưới), `public116` 53, `civic118` 46, `career109` 698.
- Phần B còn lại (chưa làm): mô hình chức vụ thống nhất (positionId/agency/địa bàn — bộ trưởng ghi bộ nào, bí thư tỉnh ủy tỉnh nào), NHNN `employer123` trống ở r4 khi vào qua `startJob`, kiểm `publicReview116` sau luân chuyển, B4–B9 (bộ máy, nhân sự trong thẩm quyền, liên minh, KPI theo ngành, bộ điều phối drama). Phần C (MD3) chưa bắt đầu.

## §3 — Lỗi chọn khối THPT: tái hiện và nguyên nhân đã xác nhận
- Tái hiện: mô phỏng 300 đời Việt Nam (seed 5001–5300, AI tự chọn). 198 người thi tốt nghiệp THPT, **28 người (14%) không bao giờ thấy tình huống chọn khối** và bị gán khối lúc tốt nghiệp.
- Phân loại 28/28 ca: năm 16 tuổi hàng đợi đã đủ 3 quyết định (`difficulty.cap`), trigger `chon_khoi` xáo trộn ngẫu nhiên cùng các trigger khác và chỉ đúng `a === 16`, nên không còn cơ hội nào khác. Hook `gradUpper` (expansion.js) sau đó gán `KHOI_TALENT[talent] || (r()<.5 ? 'A00' : 'D01')` không có nhật ký.
- Nguyên nhân phụ (đọc mã): đời thứ hai trở đi trigger bị nhân 0,4 vì `prevSeen`; học viên bổ túc THPT (`flags.gdtx.lvl===3`) không bao giờ được hỏi; học sinh vào THPT muộn bị hỏi từ lớp 10.
- Sửa: hỏi bắt buộc theo giai đoạn học (từ lớp 11 tới hết năm thi, theo `schoolEnd`/`gdtx.until`), trước trigger ngẫu nhiên, chỉ một quyết định chờ; chỉ ở Việt Nam. Sau sửa: 199/199 người thi tốt nghiệp đều được hỏi (cùng 300 seed).
- Nguồn lựa chọn: `manual` (bấm tay), `auto` (chế độ tự động/AI), `legacy` (save cũ đã có khối — giữ nguyên, vẫn cho đổi nếu còn học), `school` (tới kỳ thi vẫn chưa có khối: chỉ save cũ/đời do máy; có nhật ký). Giữ phép thử RNG cũ ở nhánh `school`.
- Đổi khối: tối đa 2 lần; năm thi đổi thì kiến thức −3 và căng thẳng +8; trước năm thi căng thẳng +2. Hủy không tốn lượt. Sau khi có điểm thi/bằng THPT thì khóa, không sửa lịch sử điểm.
- Nước khác: không hỏi, không gán khối (không có A00 ngoài Việt Nam).

## §5 — Lag / khung hồ sơ: số đo và nguyên nhân đã xác nhận
1. **Click trễ, khựng mỗi năm**: `E.actions` (gọi mỗi lần vẽ bảng hành động, mỗi năm và mỗi lần bấm nhóm) do `life109.js` sao chép toàn bộ đời bằng JSON một lần cho **mỗi** hành động khả dụng (~150 lần/lượt). Sửa: một bản để liệt kê + một bản kiểm tra dùng chung (sao lại nếu trường cốt lõi bị đổi). So sánh 231 ảnh chụp trạng thái trên 25 đời VN/US: kết quả giống hệt bản cũ.
   - Node 24, cùng dữ liệu, trung vị 7 lần: đời 45 tuổi (≈150 KB) **740,6 → 15,6 ms**; 35 tuổi (≈112 KB) 511,3 → 18,1 ms; 16 tuổi (≈50 KB) 132,5 → 6,6 ms.
   - Chrome (pane nội bộ, save 45 tuổi): bấm nhóm "Tiền bạc & tài sản" 279 → 8 ms; Chrome headless test: 6–15 ms ở 390 px và 1280 px.
2. **Khung hồ sơ trống/không đọc được**: modal hồ sơ dùng lớp `profile` trùng với thẻ "Hồ sơ xuất phát" trang chủ (`.profile { background: 85% surface }`) → nền trong suốt, nội dung khung dưới đè lên bảng game; viên "Đang chờ bạn chọn" (z-index 60) che nút "Đóng hồ sơ" trên điện thoại. Sửa: `.modal.profile` nền đặc, ẩn viên khi mở hồ sơ (theo tiền lệ `.modal.family-profile`).
- Đã kiểm tra: không có lỗi console/promise khi mở hồ sơ, thẻ vợ/chồng/con, bấm nhanh mở/đóng 10 lần. Mở hồ sơ ~10–80 ms.
- Chưa đo: save nhiều đời/nhiều NPC thật của người chơi; listener/bộ nhớ dài hạn; thiết bị di động thật.

## §4 — Tài sản: lỗi đã xác nhận và cách sửa
- **Bán chỉ được món đầu tiên**: tình huống `quan_ly_dau_tu` (wealth.js) có đúng hai lựa chọn "Bán `props[0]`" và "Sang nhượng `ventures[0]`" — không chọn được căn khác. Nay hành động mở `sell912`: chọn đúng tài sản theo ID → màn xác nhận (giá, lãi/lỗ so với giá vốn, mất tiền thuê, điều khoản di chúc bị ảnh hưởng) → bán. Vẫn tính hạn mức 4 giao dịch/năm của `life129`. AI và tình huống cũ giữ nguyên.
- **Di chúc chỉ hiện 30 tài sản đầu** (`assets(l).slice(0,30)`, thứ tự chèn, không phải theo giá) và **mọi menu UPDATE110 cắt 54 dòng** → tài sản thứ 31+/55+ không thể giao/tặng. Nay phân trang 20 mục; menu tối đa ~40 dòng.
- Nhóm giá trị USD: [0;1), [1;6), [6;16), [16;31), [31;51), [51;101), [101;251), [251;501), [501;1001) triệu, ≥1001 triệu. Quy đổi: VN = triệu đồng × 10⁶ / `CUR.VND` (25.400); nước khác = USD sức mua × `CUR.priceLevel(gdp)` — cùng công thức hiển thị của `currency.js`, không thêm tỷ giá cứng. Tỷ giá chốt khi mở danh sách và đi theo mọi bước lọc.
- Quy tắc ghi rõ: tài sản đã chỉ định trong di chúc mà bán/tặng khi còn sống → điều khoản hết hiệu lực (có nhật ký); người nhận mất trước → món đó chia theo tỷ lệ chung (cơ chế `allocateCompanies` sẵn có); viết di chúc không chuyển tài sản khi còn sống.
- Tặng con: giữ nguyên quy tắc life112 (con đồng ý nhận theo độ thân, phí 1%, quỹ dự phòng 30% thu nhập cơ bản, nhà đang thế chấp không tặng được).
- Chưa làm: chọn căn để cho thuê/ngừng cho thuê riêng lẻ (hệ hiện tại không có khái niệm này); tài sản đồng sở hữu với vợ/chồng ở bước bán (chia khi ly hôn đã có trong life150).

## §6 / §8 — Tình cảm: lỗi đã xác nhận, cân bằng trước/sau
- Đã xác nhận bằng đọc mã + test: hành động "Tìm người yêu" chỉ 1 lần/năm (khóa `actAt` chung); `life43.js` đặt `max = 55` và engine bỏ mọi quyết định `love` khi tuổi > `E.LOVE_MAX` (55) dù lời thoại cho người 60+ đã có sẵn; bấm "Tìm hiểu nhau" là thành người yêu ngay (người kia không có quyền từ chối); kết thúc một người trong danh sách mập mờ bị chặn khi hết lượt gặp; làm quen người mới trong danh sách không giới hạn.
- Sửa: 10 lượt tìm/năm (một bộ đếm cho Tìm người yêu, bộ lọc hẹn hò, làm quen trong danh sách mập mờ); đổi bộ lọc không tốn lượt; lượt 11 bị chặn trong handler, không chỉ ẩn nút. Chuyện tình tự đến vẫn giữ mốc 55 tuổi như cũ (không đổi RNG của đời thường); người chủ động đi tìm được tới 85 tuổi.
- Mức đồng ý (tham số gameplay): 0,5 cơ sở; −0,025 mỗi năm chênh tuổi vượt 6; ngoại hình ±0,2; thu nhập −0,05…+0,1; giao tiếp ±0,17; tâm trạng ±0,08; mỗi mối tình cũ −0,02 (tối đa −0,12); nghiệp xấu −0,08; nghiện −0,1; mỗi lần bị từ chối liên tiếp +0,08 (tối đa +0,24); kẹp 0,15–0,88. Không có hệ số theo tôn giáo, dân tộc, giàu/nghèo cố định. Chỉ áp cho người gặp qua lượt tìm; chuyện đời khác giữ cơ chế cũ; quyết định cũ trong bản lưu (không có cờ) chạy như trước.
- Mô phỏng 300 seed/nhóm, cách tìm "nhờ mai mối":

| Nhóm | Gặp được người/lượt | Đồng ý khi gặp (sau) | Có người yêu trong 1 năm — trước (1 lượt, đồng ý 100%) | Sau (≤10 lượt, có thể từ chối) |
|---|---|---|---|---|
| 22 tuổi · giao tiếp 50 · thu nhập thấp | 66% | 51% | 66% | 98% |
| 22 tuổi · giao tiếp 80 · thu nhập cao | 66% | 70% | 66% | 100% |
| 35 tuổi · giao tiếp 50 | 66% | 55% | 66% | 99% |
| 35 tuổi · giao tiếp 20 | 66% | 46% | 66% | 97% |
| 50 tuổi · giao tiếp 50 · thu nhập cao | 66% | 64% | 66% | 99% |
| 62 tuổi · giao tiếp 50 | 66% | 54% | **0%** (bị khóa) | 97% |

  Mỗi lần gặp không bảo đảm đồng ý; dùng đủ 10 lượt thì gần như ai cũng có tiến triển trong năm — chủ dự án có thể giảm `BAL.searchMax` hoặc `streakStep` trong `romance912.js` nếu thấy quá dễ.
- Làm mới danh sách mập mờ: xác nhận ghi số người bị kết thúc và tên; giữ gia đình bí mật (phải kết thúc riêng); con chung, thai kỳ, nghĩa vụ nuôi con không bị đụng tới; người đã kết thúc lưu trong `flags.network912.ended` (tối đa 30), có 15% cơ hội gặp lại khi làm quen sau ≥2 năm (cùng danh tính, tuổi tăng đúng số năm); làm mới tối đa 1 lần/năm.
- Lỗi có sẵn (không do đợt này): `tests/life138.js` hỏng ở assertion "sibling can succeed instead of player" ngay trên HEAD gốc `30152fc`.

## §10 — Gói cố vấn: lỗi đã xác nhận, chính sách +50
- **Học phí sai 10^6 lần ở Việt Nam**: `usdAmount` nhân `usd × 25.000` trong khi đơn vị tiền nội bộ ở VN là triệu đồng → gói 5 triệu USD hiển thị 125.000.000 tỷ đ (đúng ≈127 tỷ đ); nước khác bỏ qua mức giá sức mua. `life176.js` (dịch vụ ngầm) cùng lỗi. Nay dùng `E.usdToLocal` (tỷ giá chung của `currency.js`). Bản lưu: với mức phí cũ không người chơi VN nào đủ tiền đăng ký, nên không có khoản cần hoàn; không thu lại phí của khóa đang học.
- Kiểm kê luật cũ (gói 5 triệu): mỗi năm +4 cho một chuyên môn luân phiên; hoàn thành +15 mỗi chuyên môn → tổng 23 (hình ảnh, nghi thức, giao tiếp) hoặc 19 (4 chuyên môn còn lại).
- **Chính sách mới (cách hiểu "đào tạo 10 năm xong là +50")**: mỗi chuyên môn trong 7 `HEIR_FIELDS` được cộng tổng cộng tối đa **50 điểm từ chính khóa** (gói 1 triệu: 30), 70% rải đều trong 10 năm học, 30% khi hoàn thành đủ 10 năm và đạt đánh giá; không vượt thang 100; **không** cộng 50 vào mọi chỉ số. Sổ ghi `ledger912` theo khóa/chuyên môn nên chạy lại/tải lại không cộng hai lần. Hằng số `HEIR_TOTAL`, `HEIR_STUDY_SHARE` ở đầu `life170.js` để chủ dự án chỉnh.
- Khóa đang học từ bản lưu cũ: tính phần đã nhận theo luật cũ vào sổ ghi, học tiếp tới đúng 50; không thu phí lại. Khóa đã hoàn thành theo luật cũ: bù **một lần** lên 50 (có nhật ký, có sổ ghi); người học đã mất không được bù.
- Phải học đủ 10 năm thực (`done912`), không tự hoàn thành chỉ vì đến tuổi cuối khóa; người học mất → dừng, không cộng sau khi mất; không đạt đánh giá → giữ 70% đã học.
- Tối ưu kèm theo: `X.menu` (life110) tính danh sách dòng một lần cho mỗi lần dựng menu thay vì ~160 lần (menu 2000 tài sản: test assets912 từ 68–124 s xuống 25 s).

## §9 / §7 — Chu cấp chủ động và người nổi tiếng (8.10.13)
- Hệ có sẵn: life80 chỉ cho chu cấp người yêu hiện tại; tình huống `tim_nguoi_cham_lo` biến người được giúp thành người yêu ngay và mặc định gắn tiền với quan hệ. Không thay thế, chỉ mở rộng.
- Chu cấp: 4 ứng viên/năm theo bộ lọc hẹn hò (tạo bằng RNG riêng theo uid + năm, không tiêu RNG game, không tạo lại khi mở hồ sơ). Mức đồng ý (tham số gameplay): 0,55 − 0,25 × tự trọng; khớp mục đích +0,12; vượt ranh giới (độc quyền, gặp hằng tuần, kỳ hạn dài, sai mục đích) −0,2…−0,35 và sinh đề nghị lại; mức quá thấp −0,15; kẹp 0,05–0,92. Gia cảnh giàu/nghèo không phải hệ số (có test). Thanh toán `paidAt` mỗi năm; cần đủ tiền cho năm đầu + cam kết khác + 30% thu nhập cơ bản dự phòng; trễ 2 lần → chấm dứt. Người yêu hiện tại phát hiện: 8%/năm (gặp hằng tháng), 18% (hằng tuần). Khi tin cậy ≥ 60, gặp gỡ ≥ 1 năm và người ấy cởi mở, có tình huống tự nguyện tiến tới hẹn hò; thỏa thuận giữ nguyên điều khoản (không chuyển sang khoản chu cấp người yêu của life80 vì hệ đó tự dừng và có thể chia tay khi người chơi không "giàu").
- Người nổi tiếng: 3 người mới/năm (60% từ 18–35 tuổi; `meet()` của life148 kẹp tối thiểu 22 nên ghi lại năm sinh cho người 18–21). Mỗi năm 10 tương tác, mỗi người 6. Mức hấp dẫn: 0,45 + ngoại hình + giao tiếp + độ ấm áp của người kia − chênh lệch danh tiếng − chênh tuổi > 8 + tin cậy/400. Mô phỏng 200 seed (người chơi 28 tuổi, chọn người độc thân hợp xu hướng, dùng tối đa 6 lượt): làm quen 91–96%; hẹn hò trong năm đầu 9% (giao tiếp 50), 17% (giao tiếp 85), 20% (có danh tiếng). Không bảo đảm; có thể tiếp tục năm sau.
- Chưa làm: thai kỳ cho nhánh một đêm với người nổi tiếng (hàm thụ thai của life108 không xuất ra ngoài); xuống dòng trong thân menu hiển thị liền một đoạn như các menu cũ.

## §12 — Đường tối: kiểm kê, tái hiện và cân bằng (8.10.14)
- Kiểm kê nguồn kết án: một hàm trung tâm `H.jail` (engine) được life43 bọc; ~20 nơi gọi trực tiếp (life43 ×10, scenarios ×4, life46 ×2, life47 ×2, life176, engine). Bắt giữ tự động từ nghề đi qua `CRIME911` (hồ sơ → `bi_bat` qua `sched`); `bi_bat.valid` đã chặn khi đang ở tù.
- Monte Carlo trước sửa (80 đời/nghề × 7 nghề, người chơi theo nghề lâu, quay lại sau khi ra tù, ~24 năm hoạt động/đời): **0 lần kết án khi đang ngồi tù, 0 năm có nhiều án** → giả thuyết "phạt hai lần / tái bắt khi đang tù" **không tái hiện**. Nguồn kết án nhiều nhất là lựa chọn "ra đầu thú" (life43:246) và "Bị bắt" (scenarios:971).
- Vấn đề đã xác nhận: (1) tử vong 38% trong 30 năm, chủ yếu do "bị đánh úp" (life47: 27–42% chết mỗi lần, không có cách giảm, cấp càng cao càng bị đánh úp nhiều); (2) thăng cấp gần như không có (TB cấp 0,3; nhiều người cấp 0 sau 12 năm liên tục) vì công thức chung dựa vào điểm kiến thức; (3) `H.jail` ghi đè `jailUntil`, nên án mới ngắn hơn khi đang thi hành sẽ làm ngắn án cũ (đọc mã; không xuất hiện trong mô phỏng).
- Bảng trước/sau (tham số gameplay; 80 đời/nghề; "có quản lý" = có 1 bảo vệ + 1 cảnh giới kỹ năng 60, chia 10% mỗi người):

| Nghề | Án/10 năm hoạt động (trước → sau → có quản lý) | Năm tù/đời | Chết trong 30 năm | Lãi ròng (× thu nhập cơ bản năm) | Cấp cao nhất TB |
|---|---|---|---|---|---|
| Đòi nợ thuê | 0,28 → 0,29 → 0,33 | 1,0 → 0,9 → 1,3 | 30 → 27 → 15 /76 | 1,8 → 2,0 → 4,3 | 0,3 → 0,5 → 0,5 |
| Cho vay nặng lãi | 0,32 → 0,38 → 0,36 | 1,3 → 1,6 → 1,6 | 24 → 20 → 15 /76 | 5,7 → 4,2 → 2,9 | 0 → 0,2 → 0,3 |
| Lừa đảo | 0,40 → 0,36 → 0,39 | 1,6 → 2,0 → 1,9 | 25 → 16 → 19 /74 | 9,4 → 9,9 → 6,4 | 1,0 → 1,1 → 1,1 |
| Trộm cắp | 0,35 → 0,37 → 0,36 | 1,1 → 1,3 → 1,3 | 30 → 22 → 18 /78 | 0 → 1,6 → 1,0 | 0,1 → 0,4 → 0,5 |
| Ma túy | 0,43 → 0,46 → 0,39 | 1,3 → 1,7 → 1,5 | 37 → 30 → 31 /78 | 6,8 → 5,7 → 18,9 | 0,3 → 0,5 → 0,5 |
| Buôn lậu | 0,41 → 0,48 → 0,39 | 1,6 → 2,0 → 1,6 | 28 → 25 → 12 /77 | 14,7 → 19,0 → 17,0 | 0,4 → 0,6 → 0,5 |
| Nhà cái | 0,38 → 0,38 → 0,37 | 1,4 → 1,6 → 1,4 | 29 → 24 → 15 /75 | 4,6 → 4,9 → 2,5 | 0 → 0 → 0 (nghề một bậc) |
| **Tổng** | ≈ không đổi | | **203 → 164 → 125 /534 (38% → 31% → 23%)** | dao động lớn giữa các seed | |

  Lãi ròng dao động mạnh giữa các seed; phần chia cho đàn em làm giảm lãi ở vài nghề — đó là đánh đổi có chủ đích (an toàn hơn, giữ ít tiền hơn).
- Thay đổi: đàn em NPC (vai trò, kỹ năng, tính cách, lòng tin, phần chia, lịch sử; rời nhóm khi lòng tin < 20, 35% thành người cung cấp thông tin → mở hồ sơ, giảm còn 30% nếu "trung thành"); bảo vệ giảm tối đa 50% nguy cơ tử vong khi bị đánh úp, cảnh giới giảm tối đa 35% khả năng mở hồ sơ, thương lượng giảm tối đa 30% khả năng bị đánh úp — không bao giờ về 0; địa bàn (mở rộng +15 ảnh hưởng, thu 0,6% − chi 0,2% thu nhập cơ bản mỗi điểm/năm, tăng thù địch; mất 30 khi bị kết án, −25/năm khi không ai giữ); bảng rủi ro; thăng cấp theo nhóm/địa bàn/gắn kết (5–60%/năm khi đủ số năm); quay lại cùng nghề giữ cấp cũ − 1; tổng hợp án.
- Không đổi: chuỗi trong trại (học nghề nhiều năm, hòa giải, thư từ, tái hòa nhập của CRIME911; thăm nuôi, lao động, đặc xá có điều kiện điểm thi đua của life43). Chưa thêm: thay đổi lãnh đạo/tan rã nhóm như một chuỗi riêng, hỗ trợ pháp lý trong trại, chuyển quốc gia khi đang có hồ sơ (chưa kiểm thử riêng).
- Lỗi có sẵn từ HEAD gốc 30152fc (đã chạy lại bằng worktree, cùng assertion): `football-payroll901`, `update451`, `update453`, `update454`, `update460`, `life138`.

## §11 — Di truyền, sàng lọc, đa thai (8.10.15)
- Kiểm kê: không có bệnh nào trong danh mục tài liệu tồn tại trước đây; đã có khung kiểu gen ABO/Rh theo cha/mẹ sinh học (blood910), anh chị em sinh đôi lúc ra đời (family-origins) nhưng con của nhân vật không bao giờ sinh đôi. Ca sinh từ thai kỳ đi qua `life108.deliver` gọi thẳng hàm gốc nên không bọc được `DEC.kid.apply` — dùng quét ca sinh sau mỗi `resolve` và cuối năm.
- Nguồn, tham số và giản lược: `docs/HEALTH-GENETICS-912-SOURCES.md` (MedlinePlus Genetics cho từng bệnh, tổng quan thalassemia Việt Nam 2022, các nghiên cứu G6PD vùng, bảng Down theo tuổi mẹ GFMER/Thompson, PLoS ONE 2011 về sinh đôi).
- Mô phỏng 400.000 ca sinh/nhóm (sau chỉnh hemophilia): SMA ≈1/11.000; xơ nang châu Âu ≈1/3.200, châu Á ≈1/33.000; PKU châu Âu ≈1/25.000; Wilson ≈1/30.000; bạch tạng châu Phi ≈1/4.650; hemophilia A ≈1/4.100 bé trai; G6PD nam ĐNA 1%, châu Phi 10%; Down ≈1/925 (tuổi mẹ 28). Đa thai ĐNA (30.000 lần sinh): sinh đôi 7,8‰, cùng trứng 4,4‰, ba thai 7 ca.
- Tan máu β thể nặng, 300 trẻ × 5 năm: tử vong 20 khi chăm sóc đầy đủ so với 148 khi không chăm sóc (tham số gameplay).
- Chưa làm: 11.4 (mất ngủ, lao, lupus, suy gan/thận, ung thư theo loại/giai đoạn, hóa trị/xạ trị, chemoport, chế phẩm máu theo chỉ định, hiến tóc), 11.5 (tự kỷ, ADHD, chậm phát triển, khuyết tật trí tuệ, lo âu, OCD), chẩn đoán trước sinh/xét nghiệm phôi như chuỗi riêng.

## §11.4–11.5 — Bệnh mắc phải, ung thư, phát triển trẻ (8.10.16)
- Mở rộng `life.ill`/`treat` của engine. Phát hiện khi hiệu chỉnh: engine chỉ nhân hệ số với tử vong nền theo tuổi nên người 40 tuổi giai đoạn IV không điều trị vẫn sống ~88% sau 5 năm; nay nguy cơ theo giai đoạn thay hệ số cũ cho ca đã phân giai đoạn. Lần thử đầu làm tuổi thọ trung bình giảm 1,5 năm và nhãn tử vong ung thư +31% (do hệ số thuyên giảm trung bình 0,84 khiến người bệnh sống chung với bệnh lâu hơn) → cân lại hệ số trung bình ≈1 và hạ nguy cơ: tuổi chết TB 72,9 → 71,8.
- Bảng sống còn 5 năm theo giai đoạn/tuổi/điều trị: xem `docs/HEALTH-GENETICS-912-SOURCES.md`.
- `blood-donation.js`: thêm một điểm gọi `E.HEALTH915.deferral` (tạm hoãn sau truyền máu 12 tháng, khi điều trị/theo dõi ung thư — chính sách game).
- `tests/blood910-browser.js` hỏng ở assertion đòi mục nhật ký mới nhất là 8.10.10 — đã sai từ HEAD gốc 30152fc (đã có 8.10.11); các kiểm tra gameplay trước đó đều đạt.

## Backlog phát hiện khi rà soát (chưa sửa, chưa tái hiện đầy đủ)
- Save tự chơi seed 777001: "Em gái: Trần Đức Mạnh · 41 tuổi · đang đi học" — anh chị em có tên nam nhưng ghi em gái và 41 tuổi vẫn "đang đi học". Cần truy vết `sibList`.

## Lệnh kiểm thử đã chạy (đợt 8 — bệnh mắc phải, phát triển trẻ)
| Lệnh | Exit | Kết quả |
|---|---|---|
| `node tests/health915.js` | 0 | 984 checks |
| `node tests/health915-browser.js` (TEST_URL dev) | 0 | Chrome 390 + 1280, gồm hiến tóc |
| `blood910, health-tax909, depth899, genetics912, children141, family129/130/830, continuity101, logic844, feedback843, followups840, update458, update461, dynasty908, relationships841` | 0 | PASS |
| `node tests/blood910-browser.js` | 1 | Hỏng sẵn (assertion nhật ký mới nhất = 8.10.10), gameplay đạt |
| `smoke, saves-compat, save-safety, npc-identity` | 0 | PASS |
| 150 đời tự chơi | — | 0 lỗi |

## Lệnh kiểm thử đã chạy (đợt 7 — di truyền)
| Lệnh | Exit | Kết quả |
|---|---|---|
| `node tests/genetics912.js` | 0 | 1195 checks |
| `node tests/health915-browser.js` | 0 | Chrome 390 + 1280 |
| `blood910 (10556), health-tax909, children141, family104/129/130/830, relationships108/841, dynasty908, continuity101, depth899, romance912, sponsor912, feedback-e, expansion842, update530` | 0 | PASS |
| `smoke, saves-compat, save-safety, npc-identity` | 0 | PASS |
| 120 đời tự chơi (VN/Nigeria) | — | 33/33 trẻ sinh trong game có kiểu gen, không lỗi |

## Lệnh kiểm thử đã chạy (đợt 6 — đường tối)
| Lệnh | Exit | Kết quả |
|---|---|---|
| `node tests/crime912.js` | 0 | 299 checks (RNG cố định) |
| `node tests/crime913-browser.js` | 0 | Chrome 390 + 1280 |
| 73 test có dùng đường tối/án/thu nhập nghề (crime911, update490, careers105, career109, dynasty908, health-tax909, country-*, showbiz-*, update4xx–5xx…) | 0 | PASS, trừ 6 test hỏng sẵn từ HEAD gốc (xem trên) |
| `smoke, saves-compat, save-safety, npc-identity` | 0 | PASS (cảnh báo cũ) |
| Monte Carlo `crime-mc.js` (scratchpad) 80 đời × 7 nghề × 3 cấu hình | — | Bảng trên |

## Lệnh kiểm thử đã chạy (đợt 5 — chu cấp, người nổi tiếng)
| Lệnh | Exit | Kết quả |
|---|---|---|
| `node tests/sponsor912.js` | 0 | 164 checks |
| `node tests/celeb912.js` | 0 | 26 checks |
| `node tests/social913-browser.js` | 0 | Chrome 390 + 1280 |
| `enterprise-chains173, family129, family130, feedback-c, feedback-d, feedback-e, integration-feedback (1073), integration-showbiz, life-context-bcd, office-parties171-172, office896, showbiz-actor, showbiz-dating-music, relationships108, relationships841, romance912` | 0 | PASS |
| `smoke, saves-compat, save-safety, npc-identity, perf912, assets912, khoi912, heir912` | 0 | PASS (cảnh báo cũ) |

## Đóng gói và bàn giao (đợt 8.10.12)
| Bước | Kết quả |
|---|---|
| Nhật ký người chơi | Mục `school-assets-romance-upgrade-812` (8.10.12-upgrade912, packaged, releasedAt null) ở đầu `docs/update-extra.json` và `public/data/updates.json`; CHANGELOG 8.10.12; `tests/update-release.js` PASS 566 |
| `npm run package:cloudflare` | exit 0 · 28 file triển khai · ZIP 2.743.380 byte · SHA-256 2E42842B…9959 · loading/admin-events PASS |
| Đối chiếu dist ↔ ZIP | 28/28 tên file trùng, 0 khác biệt nội dung (SHA-256 từng file); có `index.html`, `_worker.js`, `_routes.json`, `_headers`, `.well-known/ai-catalog.json` ở gốc |
| Bản build | `ui912-browser`, `assets912-browser` PASS trên dist (390 + 1280); trang Cập nhật hiển thị "Bản chuẩn bị · chưa phát hành", 12 ý, không tràn ngang |
| Git | Push `codex/life-context-upgrade` 30152fc..fd4624d lên origin (không force, không merge main, không deploy) |

## Lệnh kiểm thử đã chạy (đợt 4 — gói cố vấn)
| Lệnh | Exit | Kết quả |
|---|---|---|
| `node tests/heir912.js` | 0 | 23 checks |
| `feedback-features895, leadership-education169-170, enterprise-chains173, crime911, career109, feedback-e, expansion842, family129, assets912` | 0 | PASS |
| `node tests/browser-feedback-menus.js` | 0 | 26 chuỗi menu (c, d, e), 390 + 1280 |

## Lệnh kiểm thử đã chạy (đợt 3 — tình cảm)
| Lệnh | Exit | Kết quả |
|---|---|---|
| `node tests/romance912.js` | 0 | 114 checks |
| `node tests/browser-dating-app.js` | 0 | 12 lượt, VN + quốc tế, 390 + 1280 |
| `relationships108, relationships841, family104, family129, family130, looks134, children141, social-personal131, actions894, actions-cap895, feedback-e, expansion842` | 0 | PASS |
| `node tests/life138.js` | 1 | Hỏng sẵn trên HEAD gốc 30152fc (đã kiểm bằng worktree riêng) |
| `smoke, saves-compat, save-safety, npc-identity, khoi912, assets912, perf912` | 0 | PASS |

## Lệnh kiểm thử đã chạy (đợt 2 — tài sản)
| Lệnh | Exit | Kết quả |
|---|---|---|
| `node tests/assets912.js` | 0 | 192 checks |
| `node tests/assets912-browser.js` | 0 | Chrome 390 + 1280 PASS |
| `feedback-e, estate840, expansion842, family129` | 0 | PASS (family129: thêm bước xác nhận bán vào thao tác, giữ nguyên kỳ vọng 4 giao dịch và siết thêm: hết lượt thì không mở được) |
| `node tests/browser-feedback-menus.js e` | 0 | 8 chuỗi menu, 390 + 1280 |
| `smoke, saves-compat, save-safety, npc-identity, khoi912, perf912` | 0 | PASS (cảnh báo cũ như đợt 1) |

## Lệnh kiểm thử đã chạy (đợt 1)
| Lệnh | Exit | Kết quả |
|---|---|---|
| `node tests/khoi912.js` | 0 | 269 checks |
| `node tests/perf912.js` | 0 | 20 checks |
| `node tests/ui912-browser.js` | 0 | Chrome 390 + 1280 PASS |
| `node tests/smoke.js` | 0 | 11 đạt, 1 cảnh báo cũ (life.id theo giờ thật) |
| `node tests/saves-compat.js` | 0 | 10 đạt, 7 cảnh báo cũ (hc_story đã bỏ) |
| `node tests/save-safety.js` | 0 | 10 đạt |
| `node tests/npc-identity.js` | 0 | 14 đạt |
| `exam127, university136, adult106, world120, update840, career109, actions894, actions-cap895, relationships108, relationships841, family129, continuity101, pace-gd5, chains-gd4, context-weighting` | 0 | PASS (context-weighting cho kết quả giống hệt HEAD gốc) |
