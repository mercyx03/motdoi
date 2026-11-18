'use strict';
// 9.1 giai đoạn 1: chọn năm sinh 1900–2026 và chặn nội dung sai thời (era902.js, careers.js, engine.js, app.js).
const assert = require('node:assert/strict');
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { gameContext } = require('./hardcore-isolation');
const { TECH, scan } = require('./era-oracle902');
const G = gameContext(), E = G.E, X = E.ERA902;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
const mk = y => ({ birthYear: y, age: 0 });
// 1. đơn vị: cắt câu, thay từ, nghề, cảnh
{
  ok(X && X.YEAR_MIN === 1900 && X.TECH.length >= 40, 'module nạp, có bảng mốc');
  ok(X.clean(mk(1950), 'Bạn xem YouTube cả tối.', true) === null, 'dòng nhật ký sai thời bị bỏ');
  ok(X.clean(mk(1950), 'Mua nhà. Xem YouTube cả tối. Ngủ sớm.', true) === 'Mua nhà. Ngủ sớm.', 'chỉ cắt câu sai thời, giữ câu còn lại');
  ok(X.clean(mk(2010), 'Bạn xem YouTube cả tối.', true) === 'Bạn xem YouTube cả tối.', 'đã có YouTube thì giữ nguyên');
  ok(X.clean(mk(1950), 'Bạn xem YouTube cả tối.', false) === 'Bạn xem YouTube cả tối.', 'văn bản cảnh mà câu nào cũng sai thì giữ bản gốc (cảnh bị bỏ ở bước khác)');
  ok(X.clean(mk(1930), 'Mason nhắn tin mập mờ với người khác.', true) === 'Mason viết thư mập mờ với người khác.', 'nhắn tin thành viết thư trước 1960');
  ok(X.clean(mk(1975), 'Một tin nhắn bị hiểu khác.', true) === 'Một lời nhắn bị hiểu khác.', 'tin nhắn thành lời nhắn trước 1992');
  ok(X.clean(mk(1995), 'Nhắn tin cho cô ấy.', true) === 'Nhắn tin cho cô ấy.', 'sau 1992 giữ nhắn tin');
  ok(X.clean(mk(1998), 'Gọi video về nhà.', true) === 'Gọi điện về nhà.', 'gọi video thành gọi điện trước 2003');
  ok(X.clean(mk(1950), 'Chi 42.279 INR (tự chi). Mua iPhone Air.', true) === 'Chi 42.279 INR (tự chi).', 'dấu chấm trong số không bị tách câu');
  ok(X.clean({ birthYear: 2026, age: 0 }, 'Bạn xem YouTube và dùng ChatGPT.', true) === 'Bạn xem YouTube và dùng ChatGPT.', 'đời sinh 2026 không đổi');
  ok(X.activeAt(2026).length === 0 && X.activeAt(2023).length > 0 && X.activeAt(2024).length === 0, 'đường tắt từ năm 2024');
}
{
  const l = E.createLife({ mode: 'world', country: 'US', seed: 11, year: 1950 }); l.age = 30; l.school = null; l.indep = true;
  ok(E.startJob(l, 'youtuber', () => .5, () => { }, true) === false && !l.job, 'không nhận nghề YouTuber năm 1980');
  ok(E.startJob(l, 'streamer', () => .5, () => { }, true) === false, 'không nhận nghề streamer năm 1980');
  ok(E.startJob(l, 'tx_cn', () => .5, () => { }, true) === false, 'không nhận tài xế công nghệ năm 1980');
  ok(E.startJob(l, 'ke_toan', () => .5, () => { }, true) !== false && l.job && l.job.id === 'ke_toan', 'nghề có từ trước vẫn nhận được');
  const m = E.createLife({ mode: 'world', country: 'US', seed: 12, year: 2000 }); m.age = 25; m.school = null; m.indep = true; ok(E.startJob(m, 'youtuber', () => .5, () => { }, true) !== false && m.job, 'năm 2025 nhận được nghề YouTuber');
  const old = E.createLife({ mode: 'world', country: 'US', seed: 13, year: 1900 }); old.age = 25; old.school = null; ok(X.jobBlocked(old, 'dev', E.CAR.dev) === true && X.jobBlocked(old, 'phi_cong', E.CAR.phi_cong) === false, 'lập trình viên chưa có năm 1925, phi công có');
}
{
  const l = E.createLife({ mode: 'world', country: 'US', seed: 14, year: 1900 }); l.age = 14; // năm 1914
  const d = E.DEC.tv_xem.make(l, () => .5, {}); ok(d.data && d.data.eraSkip === true && E.DEC.tv_xem.valid(l, d.data) === false, 'cảnh "Mở tivi" năm 1914 bị bỏ');
  const l2 = E.createLife({ mode: 'world', country: 'US', seed: 14, year: 1990 }); l2.age = 20; const d2 = E.DEC.tv_xem.make(l2, () => .5, {}); ok(!(d2.data && d2.data.eraSkip), 'năm 2010 vẫn có cảnh xem tivi');
  const j = E.createLife({ mode: 'world', country: 'DE', seed: 15, year: 1950 }); j.age = 22; j.school = null; j.job = null; const dj = E.DEC.job.make(j, () => .5, {});
  ok(!dj.opts.some(o => /youtuber|streamer|affiliate|tiktok|online/i.test(o.l)), 'danh sách việc làm năm 1972 không có nghề mạng');
  ok(dj.opts.length >= 3, 'danh sách việc làm vẫn còn lựa chọn hợp thời');
}
// 2. đời sinh từ 2026 không đổi một byte so với khi không có module
{
  const hashes = e => [['vn', 'VN'], ['world', 'US'], ['world', 'JP']].map(([mode, cc], i) => { const l = e.createLife({ mode, country: cc, seed: 4400 + i, year: 2026 }); e.runHeadless(l); const s = Object.assign({}, l); delete s.v; return crypto.createHash('sha256').update(JSON.stringify(s)).digest('hex'); });
  const a = hashes(gameContext({ skip: ['js/era902.js'] }).E), b = hashes(gameContext().E); ok(a.every((h, i) => h === b[i]), 'đời sinh 2026 giống hệt khi có và không có era902');
}
// 3. thước đo độc lập: không còn nội dung sai thời ở nhiều năm sinh, đời không bị rút ruột
{
  const years = [1900, 1925, 1950, 1975, 1990, 2000, 2010], CC = ['VN', 'US', 'JP', 'IN', 'NG', 'DE', 'BR', 'GB'];
  let leaks = [], lines = 0, lives = 0;
  for (const y of years) for (let i = 0; i < 6; i++) {
    const cc = CC[i % CC.length], l = E.createLife({ mode: 'world', country: cc, seed: 5500 + i * 17 + y, year: y }); E.runHeadless(l); lives++; lines += l.log.length;
    scan(l).forEach(x => leaks.push(y + ' ' + cc + ' ' + x.id + ': ' + x.text.slice(0, 60)));
  }
  ok(leaks.length === 0, 'không còn nội dung sai thời theo thước đo (' + leaks.length + ' lỗi: ' + leaks.slice(0, 3).join(' | ') + ')');
  ok(lines / lives > 300, 'đời nhiều năm sinh vẫn đủ nội dung (' + Math.round(lines / lives) + ' dòng mỗi đời)');
  const early = E.createLife({ mode: 'world', country: 'US', seed: 5600, year: 1900 }); ok(/1900/.test(early.log[0].t) || early.log[0].y === 1900, 'đời sinh 1900 ghi đúng năm sinh');
}
// 4. giao diện: ô chọn năm sinh, truyền vào createLife, mô tả trung thực về giới hạn
{
  const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8'), app = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'app.js'), 'utf8');
  ok(/id="yearSel"/.test(html) && /id="yearHint"/.test(html), 'có ô chọn năm sinh trong màn thiết lập');
  ok(/js\/era902\.js/.test(html) && html.indexOf('js/era902.js') > html.indexOf('js/fund890.js') && html.indexOf('js/era902.js') < html.indexOf('js/app.js'), 'era902.js nạp sau mọi module nội dung, trước app.js');
  ok(/year: S\.set\.year \|\| undefined/.test(app) && /S\.set\.year = \(\+S\.set\.year >= MIN_YEAR/.test(app), 'năm sinh được kiểm tra và truyền vào createLife');
  ok(/function yearHintText/.test(app) && /công nghệ và sự kiện chưa tồn tại thời đó/.test(app) && /function ctxHintText/.test(app), 'màn chọn năm sinh cho biết điều gì đổi theo năm sinh (bối cảnh từng nước, từ 1950 có số liệu theo năm)');
}
// 5. bản lưu cũ và vòng JSON
{ const l = E.createLife({ mode: 'world', country: 'JP', seed: 5700, year: 1960 }); const o = JSON.parse(JSON.stringify(l)); E.runHeadless(o); ok(!o.alive && isFinite(o.money), 'đời sinh 1960 qua vòng JSON vẫn chạy hết'); }
console.log('PASS era902: ' + n + ' checks');
