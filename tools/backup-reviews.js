/* Một Đời — sao lưu đánh giá (v6.6.0)
   · mặc định: tải toàn bộ đánh giá công khai (số sao, nội dung, thời gian) từ /api/reviews về backups/reviews-YYYY-MM-DD.json
   · --d1: xuất nguyên cơ sở dữ liệu D1 bằng Wrangler (cần đăng nhập `npx wrangler login` trước) về backups/reviews-YYYY-MM-DD.sql
   Ví dụ: npm run backup:reviews        npm run backup:reviews -- --d1        node tools/backup-reviews.js https://motdoi.site */
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..'), DIR = path.join(ROOT, 'backups');
const args = process.argv.slice(2), site = (args.find(a => /^https?:\/\//.test(a)) || process.env.MOTDOI_URL || 'https://motdoi.site').replace(/\/+$/, '');
const day = new Date().toISOString().slice(0, 10);
fs.mkdirSync(DIR, { recursive: true });
async function publicBackup() {
  const all = []; let offset = 0, head = null;
  for (let guard = 0; guard < 2000; guard++) {
    const r = await fetch(site + '/api/reviews?offset=' + offset + '&limit=100', { cache: 'no-store' });
    if (!r.ok) throw Error('Máy chủ trả về ' + r.status);
    const v = await r.json(); if (!v.ok) throw Error('API báo lỗi ' + (v.code || ''));
    if (!head) head = { total: v.total, average: v.average, distribution: v.distribution };
    all.push(...v.reviews); offset += v.reviews.length;
    if (!v.reviews.length || offset >= (v.matched != null ? v.matched : v.total)) break;
  }
  const file = path.join(DIR, 'reviews-' + day + '.json');
  fs.writeFileSync(file, JSON.stringify({ site, savedAt: new Date().toISOString(), ...head, reviews: all }, null, 2));
  console.log('Đã sao lưu ' + all.length + ' / ' + head.total + ' đánh giá → ' + path.relative(ROOT, file));
  if (all.length !== head.total) { console.error('Cảnh báo: số đánh giá tải về khác tổng số trên máy chủ.'); process.exitCode = 1; }
}
function d1Backup() {
  const file = path.join(DIR, 'reviews-' + day + '.sql');
  const r = spawnSync('npx', ['wrangler', 'd1', 'export', 'motdoi-reviews', '--remote', '--output', file], { stdio: 'inherit', shell: process.platform === 'win32', cwd: ROOT });
  if (r.status !== 0) { console.error('Xuất D1 không thành công. Kiểm tra đã chạy `npx wrangler login` và tên database là motdoi-reviews.'); process.exit(r.status || 1); }
  console.log('Đã xuất toàn bộ database D1 → ' + path.relative(ROOT, file));
}
if (args.includes('--d1')) d1Backup();
else publicBackup().catch(e => { console.error('Sao lưu thất bại: ' + e.message); process.exit(1); });
