# Kiểm thử nền tảng (GĐ0)

GĐ0 chỉ thêm công cụ kiểm thử. Không đổi gameplay, giao diện, cấu trúc bản lưu hay cách triển khai.

## Các tầng kiểm thử

| Lệnh | Thời gian | Dùng khi |
|---|---|---|
| `npm run test:smoke` | ~15 giây | sau mỗi lần sửa |
| `npm run test:saves` | ~5 giây | sau mỗi lần đụng tới dữ liệu lưu, `migrate`, `createLife` |
| `npm run test:save-safety` | ~10 giây | phiên bản cấu trúc, lưu thất bại, JSON hỏng, đồng bộ tài khoản (GĐ1, xem `docs/SAVE-FORMAT.md`) |
| `npm run test:npc` | ~15 giây | danh tính, tính cách, quan hệ NPC (GĐ2, xem `docs/NPC-IDENTITY-GD2.md`) |
| `npm run test:quick` | ~45 giây | gộp bốn lệnh trên |
| `npm run baseline` | ~20 giây | so chỉ số gameplay với `tests/fixtures/baseline.json` (chỉ báo chênh lệch) |
| `npm test` | 1–2 giờ | trước khi phát hành (bộ hồi quy đầy đủ) |

**Smoke test đạt không có nghĩa bộ hồi quy đầy đủ đã đạt.**

Mỗi ca smoke / tương thích chạy trong một tiến trình riêng có thời hạn cứng (`tests/lib/quick.js`). Ca bị treo sẽ bị dừng và ghi `TIMEOUT`, không treo cả bộ.

## Chạy bộ hồi quy đầy đủ theo nhóm

`tests/regression.js` chậm vì hai lý do:

1. Mục 5 hiện giữ 6.300 cuộc đời trong bộ nhớ (3.000 VN, 300 VN63, 3.000 thế giới), nên tốn nhiều RAM.
2. Mục 9 thử mọi phương án của 1.298 tình huống, mỗi phương án 4 lần trên nhiều khuôn nhân vật (lượt Codex quan sát 67 khuôn; vài trăm nghìn lượt, mỗi lượt có sao chép JSON và một năm mô phỏng).

Chạy theo nhóm bằng công cụ có sẵn:

```bash
node tests/regression-shard.js 0-8
```

```bash
MOTDOI_DEC_IDS=job,love,marry node tests/regression-shard.js 9
```

`regression-shard.js` nhận danh sách mục cách nhau bằng dấu phẩy. Dạng khoảng như `0-8` chỉ gồm các mục toàn số; các mục như `5b` phải ghi rõ tên.

## Bản lưu cũ

`tests/fixtures/saves/*.json.gz` do `tools/make-save-fixtures.js` dựng bằng chính mã engine của 10 commit cũ (v2.3.0 → v8.5.0), đọc qua `git show`, đúng cấu trúc `mkn.current` mà `app.js` ghi.

Đây là bản lưu do máy tự chơi tạo ra, **không phải bản lưu thật của người chơi**. Phần khôi phục nhánh đời cha/mẹ (`mkn.branch112`) cần trình duyệt nên chưa được kiểm.

Dựng lại fixture:

```bash
npm run fixtures:saves
```

## Đồng hồ kiểm thử

`createLife` đặt `life.id = Date.now() + Math.random()`, và life126/130/138/141 băm theo `l.id`. Vì vậy với giờ thật, cùng seed vẫn cho ra cuộc đời khác nhau.

Môi trường kiểm thử nhanh dùng đồng hồ cố định và `Math.random` có seed để kết quả tái lập được. Game không bị thay đổi gì.

## Cập nhật nghiệm thu Codex 26/10/2026

Mục 9 nay áp dụng MOTDOI_DEC_IDS cho cả kiểm tra AI; khi ghép các shard rời nhau phủ đủ registry, mọi ID vẫn được kiểm tra, tránh lặp kiểm tra AI toàn registry ở từng shard. Không có bộ lọc thì hành vi kiểm tra đầy đủ giữ nguyên. Bật MOTDOI_DEC_PROGRESS=1 để in ID đang thử, hoặc =2 để in khuôn/phương án/lần lặp. Các menu nhiều phương án nên chạy theo từng ID, không chia chỉ dựa trên số lượng ID. Timeout không phải kết quả đạt.

Riêng mục 16 dùng game context đồng hồ cố định của tests/lib/quick.js để mẫu thống kê tái lập; vẫn giữ 300 + 200 đời và các ngưỡng cũ. Các mục khác vẫn theo cấu hình hiện hữu. Mã game và cách sinh life.id không đổi. Xem docs/ACCEPTANCE-GD2.5-CODEX.md cho bằng chứng và giới hạn.
