# GĐ5 — Nhịp sự kiện, chống lặp và tình huống bị chặn ngoài ý muốn

Module: `public/js/life145.js` (`E.PACE145`). Một điểm kiểm tra duy nhất trong `beginYear` của engine (`add(id, arg, src)`): chỉ áp cho tình huống ngẫu nhiên từ trigger và hành động AI tự chọn. Không áp cho tình huống bắt buộc / đã hẹn: bệnh, học hành, việc làm, `l.sched`, chuỗi hậu quả GĐ4, nhịp tuổi thơ, hành động người chơi tự chọn.

## 1. Tình huống bị chặn ngoài ý muốn (sửa nguyên nhân gốc)

`beginYear` gọi `DEC[id].valid(life, arg || {})`. Một số tình huống coi bất kỳ đối tượng dữ liệu nào là "dữ liệu đã chụp" (`!d || d.who === …`), nên `{}` luôn bị loại. Quét 40 đời: 11 trigger có `when()` đúng hàng trăm lần nhưng `valid(l, {})` chưa bao giờ đúng.

| Tình huống | Sửa | Giới hạn mới |
|---|---|---|
| `marriageGift130`, `marriageTime130`, `marriageMove130`, `marriageBuy130`, `marriageJealous130`, `marriageMoney130` (life130) | `d.who == null` = chưa chụp dữ liệu | `max` 30 → 4/đời (chuẩn chống lặp của game, regression mục 30); nhóm chủ đề: cách nhau ≥ 3 năm |
| `familyObjection130` (life130) | như trên | `max` 10 → 3; nhóm với `status129`, cách ≥ 4 năm |
| `status129` (life129) | `d.name == null` | `max` 5 → 4 |
| `map_mo101`, `casual101`, `public_scandal101` (life101) | `d.at == null` | giữ nguyên |

Dữ liệu đã chụp vẫn được kiểm như cũ (khác người, khác năm, đã chọn → loại). Quét lại sau sửa: không còn trigger nào bị chặn kiểu này. `vp_sa_thai_ai` có điều kiện riêng cố ý (life70: chỉ khi có rủi ro mất việc) nên giữ nguyên.

## 2. Ba mức tình huống

- **Biến cố lớn (shock)**: theo ID (bệnh, bị bắt, ly hôn, phẫu thuật, cắt giảm…) hoặc từ khóa trong tiêu đề/nội dung (tai nạn, mất việc, phá sản, đòi nợ, qua đời, thiên tai, lừa đảo, khủng hoảng…).
- **Quyết định quan trọng (major)**: dùng `E.isMajor` sẵn có (học, việc, cưới, con, nhà…).
- **Đời thường (daily)**: còn lại.

## 3. Điều tiết mật độ (chỉ tình huống ngẫu nhiên)

- Năm đã có 2 biến cố lớn: không thêm biến cố thứ ba. Đã có 1: biến cố thứ hai còn 35%.
- Hai năm trước đã có biến cố: xác suất nhân thêm 0,5. Dưới 15 tuổi nhân 0,6. Không cấm hẳn.
- Hành động AI tự chọn chỉ thêm khi năm có dưới 2 lựa chọn.
- Tình huống bị loại không bị tính cooldown / số lần gặp; vòng chọn tiếp tục với tình huống khác.
- Ngưỡng chọn từ đo 200 đời trước GĐ5: 11% lựa chọn là biến cố lớn, 4,7% năm có ≥ 2 biến cố, 8,4% cửa sổ 3 năm có ≥ 3 biến cố.

## 4. Chống lặp

- Nhóm chủ đề (cùng chuyện, khác ID): cảnh hôn nhân life130 (3 năm), áp lực danh phận/gia đình phản đối (4), mập mờ/một đêm (3), bạn thân gọi (2), đổi nghề (3), gặp / nhận nuôi thú cưng (2 — thấy trong lần chạy thử trình duyệt: hai chuyện mèo cùng năm). Mỗi năm tối đa một tình huống mỗi nhóm. `vn_giuc_cuoi` cố ý không ghép nhóm: thử ghép làm giảm cưới hỏi và sinh con ~5 điểm phần trăm.
- Gần trùng: dấu vân tiêu đề (bỏ tên người trong dữ liệu, tên riêng, số); tương đồng ≥ 0,75 với tình huống khác ID trong 3 năm → bỏ. Chuỗi đang diễn ra (`rep`) không bị coi là trùng.
- Nhật ký kể chuyện (sự kiện không lựa chọn): bỏ câu giống hệt đã kể trong 6 năm; không lọc dòng tiền, cột mốc, tin xấu, qua đời.
- Du lịch nhiều bước: tối đa một lời rủ ngẫu nhiên / chuyến AI mỗi năm, không rủ trong năm có biến cố lớn hoặc đã có ≥ 3 lựa chọn. Người chơi tự chọn du lịch như cũ.
- Lịch sử `l.flags.pace145.h`: tối đa 24 dòng, một dòng cho mỗi tình huống mỗi năm (các bước của cùng luồng không đẩy trôi lịch sử). `migrateExt` bỏ dữ liệu hỏng. Không tăng `SAVE_SCHEMA`.

## 5. Chế độ tự động (giao diện)

`app.js`: khi bật tự động, lựa chọn đời thường được AI chốt sau 0,7 + 0,45 giây thay vì 1,1 + 0,65 giây; ngã rẽ quan trọng và biến cố lớn giữ nhịp cũ.

## 6. Công cụ đo

`node tools/pace-stats.js --lives 200 [--root <bản mã khác>] [--detail]`: lựa chọn/năm, tỷ lệ mức, phân bố số lựa chọn mỗi năm, năm nhiều biến cố, lặp ID, gần trùng, lặp nhật ký, số cảnh life130, lựa chọn chuỗi GĐ4.
