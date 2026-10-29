/* Một Đời — Quản trị viên mở khóa toàn bộ thành tựu cho một tài khoản trên D1 Database
   Dùng:
     node tools/admin-unlock-achievements.js <tên đăng nhập>
     npx wrangler d1 execute motdoi-reviews --remote --file backups/unlock-achievements-<tên>.sql
*/
'use strict';
const fs = require('fs'), path = require('path');
const username = String(process.argv[2] || '').trim().toLowerCase();
if (!/^[a-z0-9_.]{3,24}$/.test(username)) {
  console.error('Cần tên đăng nhập hợp lệ (3–24 ký tự a-z, 0-9, dấu chấm, gạch dưới).');
  process.exit(1);
}

const { gameContext } = require('../tests/hardcore-isolation');
const G = gameContext();
const achs = G.E.ACHIEVEMENTS || [];
console.log('Tổng số thành tựu trong game:', achs.length);

const achStore = {};
const now = Date.now();
achs.forEach(a => {
  achStore[a.id] = { at: now };
});

const achJson = JSON.stringify(achStore).replace(/'/g, "''");
const q = s => "'" + s.replace(/'/g, "''") + "'";

const sql = [
  '-- Mở khóa 100% (' + achs.length + ') thành tựu cho tài khoản ' + username,
  'INSERT INTO game_saves(account_id, data, rev, updated_at)',
  'SELECT id, json_object(\'v\', 1, \'ach\', json(\'' + achJson + '\'), \'tree\', json(\'[]\'), \'mem\', json(\'[]\'), \'recent\', json(\'[]\')), 1, CAST(strftime(\'%s\', \'now\') AS INTEGER) * 1000',
  'FROM game_accounts WHERE username = ' + q(username),
  'ON CONFLICT(account_id) DO UPDATE SET',
  '  data = json_set(game_saves.data, \'$.ach\', json(\'' + achJson + '\')),',
  '  rev = game_saves.rev + 1,',
  '  updated_at = CAST(strftime(\'%s\', \'now\') AS INTEGER) * 1000;',
  '',
  '-- Kiểm tra kết quả',
  'SELECT a.username, s.account_id, s.rev, s.updated_at,',
  '  (SELECT COUNT(*) FROM json_each(json_extract(s.data, \'$.ach\'))) AS so_thanh_tuu',
  'FROM game_saves s',
  'JOIN game_accounts a ON a.id = s.account_id',
  'WHERE a.username = ' + q(username) + ';'
].join('\n') + '\n';

const dir = path.join(__dirname, '..', 'backups');
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, 'unlock-achievements-' + username + '.sql');
fs.writeFileSync(file, sql);

console.log('Tài khoản:', username);
console.log('Đã tạo file SQL: ' + path.relative(path.join(__dirname, '..'), file));
console.log('Bạn có thể chạy bằng Wrangler:');
console.log('  npx wrangler d1 execute motdoi-reviews --remote --file ' + path.relative(path.join(__dirname, '..'), file).replace(/\\/g, '/'));
console.log('Hoặc copy nội dung trong file này dán vào Cloudflare D1 Console.');
