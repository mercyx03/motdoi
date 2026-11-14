# Đối chiếu Một Đời với 1in8b Engine API (13/11/2026)

Nguồn đã đọc: trang https://1in8b.life/vi/api/, `GET /api/v1` (danh mục, nguồn dữ liệu), `GET /api/v1/openapi.json`,
các danh mục không cần khóa `countries` (172 nước), `causes` (28 mã nguyên nhân qua đời), `jobs` (~70 nghề), `groups`.
Engine 0.10.0, API v1 beta. Trang Methods (tiếng Anh) chưa đọc được vì trình duyệt cần cấp quyền lại.

## 1in8b là gì và dùng dữ liệu nào

- Mô phỏng một đời người từ khi sinh tới khi mất ở 172 nước, năm sinh 1950–2025 hoặc "thế giới tương lai".
- Nguồn công bố trong `/api/v1`: UN WPP 2024, WHO Global Health Estimates 2021, UN IGME (tử vong trẻ em),
  World Bank WDI, UN DESA International Migrant Stock 2020, UNDP HDR, OECD chỉ số giá nhà thực 1970–2025,
  World Bank Pink Sheet (giá hàng hóa 1960–2025), World Happiness Report 2024, cơ quan thống kê quốc gia.
- Điều kiện khi sinh: nhóm thu nhập (1–5), thành thị/nông thôn, tôn giáo gia đình, nhóm dân tộc/đẳng cấp
  (Ấn Độ, Nepal theo danh mục nhà nước), khuyết tật, xu hướng tính dục (giấu kín nơi luật trừng phạt).
- Trong đời: `met` — những gì thế giới mang đến (chiến tranh, thiên tai, mất điện, lần đầu có điện, TV…);
  `trace` từng năm có `electricity_at_home`; quyết định (`decisions`, `pick`), chế độ chơi từng bước (`/live`)
  với "trọng tâm của năm" và "bảng chi tiêu"; dòng họ 2–5 thế hệ (`/lineage`).
- Nội dung nhạy cảm (tự tử, đời sống người chuyển giới) chỉ trả về khi yêu cầu, luôn kèm đường dây hỗ trợ.

## Có nên gọi API trực tiếp từ game không

Chưa nên, vì:
1. API cần khóa cá nhân (`k8b_…`), phải giữ ở máy chủ; game hiện là trang tĩnh trên Cloudflare. Nếu muốn dùng,
   chủ dự án cần xin khóa (api@1in8b.life, có gói miễn phí 2.000 đơn vị/tháng) và thêm một Cloudflare Pages Function
   làm trung gian. Không thực hiện trong gói này vì không có khóa và AGENTS.md cấm thay đổi production.
2. Điều khoản: phải ghi "1in8b Engine (1in8b.life)" khi trình bày kết quả; không được trình bày như số liệu chính thức
   hay dự báo; không dùng để huấn luyện AI; không bán lại API.
3. Game đã có bộ máy riêng cho 195 nước. Theo CLAUDE.md (không tạo hệ thống trùng), hướng đúng là dùng cùng
   nguồn mở mà 1in8b dùng để hiệu chỉnh hệ thống sẵn có.

## So sánh và việc đã làm trong 8.10.77

| Hạng mục | 1in8b | Một Đời trước 8.10.77 | 8.10.77 |
|---|---|---|---|
| Nguyên nhân qua đời | Theo WHO GHE 2021 từng nước, tuổi, giới | Bảng tay theo vùng; người thân dùng một danh sách chung kiểu Việt Nam cho mọi nước | Theo tỷ trọng 3 nhóm của từng nước (WHO GHE qua WDI) và tỷ lệ giao thông, bạo lực, lao, sốt rét, HIV, tiêu chảy, ngộ độc; người thân dùng cùng cơ chế theo nước gốc |
| Điện tại nhà | `electricity_at_home` từng năm | Chỉ có sự kiện mất điện ở vài nước | Xác suất có điện theo nước, năm, thành thị/nông thôn, nhóm thu nhập (WDI); nhà chưa có điện được kéo điện dần; học dưới đèn dầu |
| Nhóm thu nhập, thành thị/nông thôn | Có | Có (`fam.q`, `urban`) | Dùng thêm cho điện |
| Tôn giáo, khuyết tật, xu hướng tính dục | Có | Có một phần (tôn giáo, LGBTQ+, một số khuyết tật) | Chưa đổi |
| Đẳng cấp Ấn Độ/Nepal | Danh mục nhà nước | Có một phần | Chưa đổi |
| Dòng họ nhiều thế hệ | 2–5 thế hệ | Có chuyển đời con | Chưa đổi |
| Giá nhà theo năm | OECD 1970–2025 | Giá nhà theo nước | Việc tồn đọng |
| Di cư theo cộng đồng thật | UN Migrant Stock 2020 | Điểm đến theo danh sách game | Việc tồn đọng |
| Hạnh phúc theo nước | WHR 2024 | Không | Việc tồn đọng |
| Nghề | ~70 mã, có nghề địa phương (hải nữ Jeju, idol K-pop) | Nhiều nghề hơn, sâu theo VN | Không cần |

## Việc tồn đọng đề xuất (theo thứ tự lợi ích)

1. Điểm đến di cư theo UN DESA Migrant Stock (người Việt sang Mỹ, Hàn, Nhật, Đài Loan, Úc, Đức theo tỷ lệ thật).
2. Giá nhà thực theo năm cho các nước OECD (OECD Analytical house prices) để mua nhà sớm/muộn có khác biệt thật.
3. Sự kiện thế giới theo năm ở từng nước (`met`): chiến tranh, thiên tai lớn, khủng hoảng — dùng hồ sơ quốc gia hiện có.
4. Tử vong trẻ em theo UN IGME từng năm (hiện dùng một hệ số u5 theo nước).
5. Lần đầu nhà có TV/Internet theo WDI (IT.NET.USER.ZS) nối với các sự kiện TV đang có.
6. Nếu chủ dự án muốn: chế độ "So sánh với 1in8b" qua Pages Function, ghi rõ nguồn và chỉ để tham khảo.

## Nguồn số liệu đã nhập vào game

World Bank WDI (CC BY 4.0), tải 13/11/2026 qua api.worldbank.org: EG.ELC.ACCS.ZS (1990–2023), EG.ELC.ACCS.RU.ZS,
EG.ELC.ACCS.UR.ZS, SH.DTH.COMM.ZS (2019), SH.DTH.INJR.ZS (2021), SH.STA.TRAF.P5, VC.IHR.PSRC.P5, SH.TBS.INCD,
SH.MLR.INCD.P3, SH.DYN.AIDS.ZS, SH.STA.POIS.P5, SH.DYN.NCOM.ZS, SH.STA.WASH.P5. Nằm trong `public/js/data-health874.js`.
Tỷ trọng nhóm nguyên nhân theo tuổi ở mức thế giới là ước tính làm tròn của game từ cấu trúc GHE, không phải số liệu tải về.

## Nhịp yêu–cưới của nhân vật AI (đo 8.10.78, chưa sửa)

- Phễu 25 đời Mỹ sinh 1990: 24 có người yêu, 13 kết hôn (tuổi trung vị khoảng 36), 22 lần được hỏi chuyện con, 18 chọn có, 9 thực sự có con. Chuyện con thường được hỏi muộn (trung vị 36 tuổi) vì cưới muộn.
- Ở quyết định cưới, AI chọn "chưa vội" khoảng 64% số lần (74/116), cao hơn nhiều so với bảng chọn tự động (33%): khi tình cảm dưới 75 điểm, lựa chọn cưới bị ẩn nên chỉ còn "chưa vội" hoặc ngỏ lời sớm.
- Thử tăng tốc độ tăng tình cảm (8→11 điểm/năm), hỏi cưới thường hơn và giảm xác suất chia tay sau 25 tuổi: con/đời Mỹ 0,40→0,53 nhưng Nigeria 0,55→0,50 (40 đời mỗi nước), nằm trong sai số, nên đã hoàn tác. Muốn kết luận cần ít nhất vài trăm đời mỗi nước.

## Đối chiếu lại ngày 14/11/2026 (bản 9.0)

Đã đọc lại trang https://1in8b.life/vi/api/, bản tiếng Anh và `openapi.json` (engine 0.10.13, 172 nước, 5 điểm cuối có khóa, danh mục không khóa và kết nối MCP). Điều khoản cấm thu thập hàng loạt câu trả lời, dựng lại engine, huấn luyện AI trên câu trả lời, nên không lấy dữ liệu từ API; chỉ dùng cùng nguồn mở (WDI, UN, WHO) mà họ công bố.

- Giao diện Một Đời luôn sinh vào năm hiện tại (không có ô chọn năm sinh), nên trục năm sinh 1950–2025 của 1in8b không phải khoảng trống ảnh hưởng người chơi. `createLife` có tham số `year` nhưng tuổi thọ và tử vong dưới 5 tuổi không đổi theo năm sinh; chỉ có ý nghĩa nếu sau này thêm chọn năm sinh.
- Đã làm trong 9.0: mức tiếp cận internet theo nước (WDI IT.NET.USER.ZS) gating sự kiện phụ thuộc internet (`access890.js`).
- Còn tồn đọng: điểm đến di cư theo UN DESA Migrant Stock và hạnh phúc theo WHR 2024 (cần đọc tệp bảng tính, chưa làm), giá nhà OECD theo năm, tử vong trẻ em theo năm (chỉ cần nếu có chọn năm sinh), TV/điện thoại/máy tính tại nhà (WDI không có chỉ số TV).
