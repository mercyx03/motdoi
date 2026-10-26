# GĐ4 — Hậu quả liên hoàn nhiều năm

Module: `public/js/life144.js` (`E.CHAIN144`). Không có engine sự kiện thứ hai: mỗi chuỗi là một bản ghi nhỏ, các giai đoạn chạy qua cơ chế sẵn có.

| Cơ chế có sẵn | Vai trò trong GĐ4 |
|---|---|
| `E.SC` / `E.DEC` | Mỗi giai đoạn có lựa chọn là một tình huống thường (`ch144_*`), hoặc mở lại tình huống sẵn có (`bo_tuc`, `divorce`). |
| `l.sched` (`H.sched`) | Hẹn giai đoạn sang năm sau, kèm `{cid, token}`. Bị trì hoãn (tù, nghĩa vụ) thì không làm lại hậu quả. |
| `E.HOOKS.year` | Mỗi năm xét điều kiện, hủy chuỗi không còn hợp lệ, hẹn giai đoạn kế tiếp. |
| `E.NPC` (GĐ2) | Giữ người liên quan bằng uid/`parent:m`; tin cậy đọc/ghi đúng nguồn chuẩn. |
| `E.CONTEXT143` (GĐ3) | Hệ số hoàn cảnh 0,5–2 nhân vào xác suất giai đoạn (áp lực tiền, cơ hội nghề, mệt mỏi, gắn bó bạn bè, chăm bố mẹ…). |
| `E.migrateExt` | Làm sạch dữ liệu chuỗi khi tải; bản lưu cũ không có chuỗi thì không tạo gì. |
| `E.TRAPS` | Giữ nguyên cho hậu quả một bước; GĐ4 dành cho chuỗi nhiều giai đoạn có lựa chọn. |

## Dữ liệu lưu (`l.flags.chains144`)

```
{ v:1, seq, stageAt, count:{kind:n},
  active:[{ id:'debt:3', kind, since, stage, next, due, last, tries,
            origin:{dec, k, age}, npc:{ref, name}|null, data:{…}, open:{at, token}|null, hist:[≤6] }],   // ≤ 4
  done:[{ id, kind, since, end, result, origin, hist:[≤3] }] }                                       // ≤ 12
```

- Không tăng `SAVE_SCHEMA`: trường mới nằm trong `flags`, bản cũ không có thì coi như chưa có chuỗi. `migrateExt` bỏ dữ liệu hỏng, lọc bản ghi thiếu trường, giữ nguyên loại chuỗi chưa biết (của phiên bản mới hơn).
- Mỗi giai đoạn mở có `token = id#stage@năm`. Lựa chọn chỉ có tác dụng khi token khớp; chạy xong token bị xóa → không thực thi hai lần, kể cả bản lưu còn quyết định cũ.
- Số ngẫu nhiên của giai đoạn băm theo nhân vật/chuỗi/năm, không rút RNG chung: đời không chạm chuỗi giống từng byte với GĐ3.

## Quy tắc chung

- Một chuỗi mỗi loại tại một thời điểm; giáo dục tối đa 1 lần/đời, các loại khác tối đa 2 lần/đời; tối đa 4 chuỗi cùng lúc.
- Mỗi năm tối đa một lựa chọn từ chuỗi (kể cả chế độ tự động). Lời kết thúc chỉ ghi một lần.
- Không tạo khoản vay mới; chỉ trả bớt đúng khoản vay gốc (khớp loại + năm vay). Khoản vay bị engine xử lý vỡ nợ không bị kể là "đã trả xong".
- Nhân vật qua đời: hook dừng, lựa chọn chuỗi không còn hợp lệ. Chuỗi không được thừa kế sang đời con.
- Mỗi giai đoạn có khoảng thời gian `[next, due]`; năm cuối xác suất nhân đôi nhưng không bắt buộc. Hết hạn thì chuyển giai đoạn hoặc khép chuỗi theo hoàn cảnh.

## 8 chuỗi

| Nhóm | Sự kiện gốc (đã có) | Giai đoạn | Kết thúc |
|---|---|---|---|
| Giáo dục | `nghi_hoc_ngheo` → nghỉ học | 18–22 tuổi: rào cản bằng cấp (`ch144_edu_barrier`) → cơ hội học lại bằng `bo_tuc` có sẵn → nhận bằng | returned / progress / unfinished / declined / no_return |
| Nghề nghiệp | `cs_cat_giam` → nhường suất | năm sau còn thất nghiệp: tìm việc (`ch144_job_search`) → 1–6 năm: người đồng nghiệp gọi lại (`ch144_job_referral`), giới thiệu đúng nghề cũ nếu đủ điều kiện | repaid / thanked / tried / declined / faded |
| Kinh doanh | `kd_vay_nong_xoay_von` → vay nóng thành nợ | chủ nợ đến (`ch144_biz_debt`: bán tài sản / thương lượng / đảo nợ) → ngã rẽ (`ch144_biz_crossroad`: mở rộng, giữ quy mô, gồng, đóng cửa) | expanded / steady / survived / struggling / closed / repaid |
| Tài chính | `vd_vay_chua_benh` → vay họ hàng / vay nóng | đến hạn (`ch144_debt_due`) → món nợ cũ (`ch144_debt_end`: bán xe, trả góp, mặc kệ) | repaid / plan / partly / strained / defaulted / lingering |
| Gia đình | `di_buoc_nua` → phản đối bố/mẹ đi bước nữa | khoảng cách (`ch144_fam_distance`) → cơ hội hòa giải, dễ hơn khi có cháu (`ch144_fam_reconcile`) | reconciled / thawing / estranged / lost (bố/mẹ mất trước) |
| Hôn nhân | `divorce` → chọn hàn gắn và còn ở với nhau | sau rạn nứt (`ch144_love_after`) → ngã rẽ theo tin cậy family100 (`ch144_love_cross`) | repaired / fragile / distant / separating (mở lại quyết định ly hôn) / ended |
| Bạn bè | `ban_than_kho` → ở bên / cho vay được trả / làm ngơ | giúp: khi bạn gặp khó, người ấy quay lại giúp (`ch144_friend_return`); làm ngơ: xa cách, xin lỗi (`ch144_friend_drift`) | returned / bond / mended / drifted / gone |
| Sức khỏe | `ld_tai_nan_lao_dong`, `phau_thuat` do tai nạn | phục hồi (`ch144_health_rehab`) → nếu còn đau lưng: tái phát (`ch144_health_flare`), nếu đã tập: kết tốt | recovered / chronic / changed_work |

Ví dụ: 15 tuổi nghỉ học vì nhà nghèo → 19 tuổi xin việc bị đòi bằng THPT, đi hỏi lớp bổ túc → 21 tuổi đăng ký bổ túc THPT buổi tối → 24 tuổi nhận bằng, lời kể nhắc lại năm 15 tuổi. Ví dụ khác: 32 tuổi nhường suất ở lại cho đồng nghiệp đang nuôi con → 33 tuổi học khóa nghề ngắn hạn → 36 tuổi người ấy giới thiệu bạn trở lại nghề văn phòng.

## Ghi nhận khi khảo sát

Các cảnh hôn nhân của life130 (`marriageJealous130`, `marriageMoney130`…) và `familyObjection130` có `valid(l, d)` coi `{}` là dữ liệu đã lập, nên khi trigger gọi `add(id)` (truyền `{}`) chúng luôn bị loại: trong mô phỏng không lần nào xuất hiện. Đây là lỗi có từ trước GĐ4, không sửa trong GĐ4 vì sẽ bật lại nội dung đang tắt, thay đổi tần suất sự kiện ngoài phạm vi. GĐ4 dùng quyết định `divorce` và `di_buoc_nua` (thực sự xuất hiện) làm gốc cho nhóm hôn nhân và gia đình. Xem BACKLOG.md.
