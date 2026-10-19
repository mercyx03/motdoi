/* Một Đời — khôi phục đánh giá từ bản sao lưu (v6.7.0)
   Tạo file SQL để thêm lại các đánh giá có trong bản sao lưu JSON (npm run backup:reviews) nhưng không còn trên máy chủ
   (ví dụ những đánh giá bị ghi đè trước bản 6.7). Không xóa, không sửa dòng nào đang có.
   Dùng:  node tools/restore-reviews.js backups/reviews-2026-10-19.json
          npx wrangler d1 execute motdoi-reviews --remote --file backups/restore-reviews.sql */
'use strict';
const fs = require('fs'), path = require('path');
const file = process.argv[2]; if (!file) { console.error('Cần đường dẫn file sao lưu JSON.'); process.exit(1); }
const site = (process.argv[3] || 'https://motdoi.site').replace(/\/+$/, '');
const q = s => "'" + String(s).replace(/'/g, "''") + "'";
(async () => {
  const backup = JSON.parse(fs.readFileSync(file, 'utf8')).reviews || [];
  const live = []; for (let off = 0; off < 100000; off += 100) { const v = await (await fetch(site + '/api/reviews?offset=' + off + '&limit=100', { cache: 'no-store' })).json(); live.push(...v.reviews); if (v.reviews.length < 100) break; }
  const key = x => x.updatedAt + '|' + x.stars + '|' + x.review, have = new Set(live.map(key));
  const missing = backup.filter(x => !have.has(key(x)) && Number.isInteger(x.stars) && x.stars >= 1 && x.stars <= 5 && Number.isFinite(x.updatedAt));
  const sql = missing.map((x, i) => 'INSERT INTO game_reviews(voter_hash, stars, created_at, updated_at, review_text) SELECT ' + q('restored:' + x.updatedAt + ':' + i) + ', ' + x.stars + ', ' + x.updatedAt + ', ' + x.updatedAt + ', ' + q(String(x.review || '').slice(0, 1000)) +
    ' WHERE NOT EXISTS (SELECT 1 FROM game_reviews WHERE created_at = ' + x.updatedAt + ' AND stars = ' + x.stars + ' AND review_text = ' + q(String(x.review || '').slice(0, 1000)) + ');').join('\n');
  const out = path.join(path.dirname(file), 'restore-reviews.sql'); fs.writeFileSync(out, sql + '\n');
  console.log('Tìm thấy ' + missing.length + ' đánh giá có trong bản sao lưu nhưng không còn trên máy chủ → ' + out);
  missing.forEach(x => console.log('  ' + new Date(x.updatedAt).toISOString().slice(0, 16) + ' · ' + x.stars + ' sao · ' + (x.review || '(không có nội dung)').slice(0, 70)));
})().catch(e => { console.error(e.message); process.exit(1); });
