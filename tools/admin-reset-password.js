/* Một Đời — quản trị viên đặt lại mật khẩu cho một tài khoản (v7.0.1)
   Mật khẩu cũ không thể xem hay khôi phục (chỉ lưu bản băm PBKDF2 một chiều). Công cụ này tạo mật khẩu tạm mới,
   băm giống hệt máy chủ (PBKDF2-SHA256, 100.000 vòng, salt ngẫu nhiên) và tạo file SQL để cập nhật database D1.
   Tiến trình (thành tựu, gia phả, bản lưu) của tài khoản được giữ nguyên; các phiên đăng nhập cũ bị đăng xuất.
   Dùng:
     node tools/admin-reset-password.js <tên đăng nhập>
     npx wrangler d1 execute motdoi-reviews --remote --file backups/reset-<tên>.sql
   Sau đó gửi mật khẩu tạm cho người chơi qua kênh riêng và nhắc họ ghi nhớ. */
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const username = String(process.argv[2] || '').trim().toLowerCase();
if (!/^[a-z0-9_.]{3,24}$/.test(username)) { console.error('Cần tên đăng nhập hợp lệ (3–24 ký tự a-z, 0-9, dấu chấm, gạch dưới).'); process.exit(1); }
const ALPHA = 'abcdefghjkmnpqrstuvwxyz23456789';
const temp = Array.from(crypto.randomBytes(12), b => ALPHA[b % ALPHA.length]).join('').replace(/(.{4})(?=.)/g, '$1-');
const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.pbkdf2Sync(temp, Buffer.from(salt, 'hex'), 100000, 32, 'sha256').toString('hex');
const q = s => "'" + s.replace(/'/g, "''") + "'";
const sql = [
  'UPDATE game_accounts SET pass_hash = ' + q(hash) + ', salt = ' + q(salt) + ', fail_count = 0, lock_until = 0 WHERE username = ' + q(username) + ';',
  'DELETE FROM game_sessions WHERE account_id = (SELECT id FROM game_accounts WHERE username = ' + q(username) + ');',
  'SELECT username, (SELECT COUNT(*) FROM game_saves WHERE account_id = game_accounts.id) AS co_ban_luu FROM game_accounts WHERE username = ' + q(username) + ';'
].join('\n') + '\n';
const dir = path.join(__dirname, '..', 'backups'); fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, 'reset-' + username + '.sql'); fs.writeFileSync(file, sql);
console.log('Tài khoản: ' + username);
console.log('Mật khẩu tạm: ' + temp);
console.log('Đã tạo ' + path.relative(path.join(__dirname, '..'), file) + '. Chạy lệnh sau để áp dụng:');
console.log('  npx wrangler d1 execute motdoi-reviews --remote --file ' + path.relative(path.join(__dirname, '..'), file).replace(/\\/g, '/'));
console.log('Nếu dòng kết quả cuối không hiện tên tài khoản thì tên đăng nhập không tồn tại (không có gì bị thay đổi).');
