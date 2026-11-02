/* Bảng hành động: không sao chép toàn bộ đời cho từng hành động, không sửa bản lưu khi chỉ hiển thị, kết quả ổn định. */
'use strict';
const assert = require('assert'), fs = require('fs'), path = require('path'), E = require('./hardcore-isolation').gameContext().E;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
function play(l, years) { for (let y = 0; y < years && l.alive; y++) { E.beginYear(l, { auto: true }); let g = 0; while (l.pending.length && g++ < 64) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); g = 0; while (l.pending.length && g++ < 64) E.resolve(l, E.autoKey(l)); E.endYear(l); } return l; }
const lives = [play(E.createLife({ mode: 'vn', seed: 777001, year: 1975 }), 45), play(E.createLife({ mode: 'world', country: 'US', seed: 912100, year: 1980 }), 35), play(E.createLife({ mode: 'vn', seed: 912101, year: 2000 }), 16)];
const parse = JSON.parse;
for (const l of lives) {
  const before = JSON.stringify(l);
  let parses = 0; JSON.parse = function () { parses++; return parse.apply(this, arguments); };
  let rows; try { rows = E.actions(l); } finally { JSON.parse = parse; }
  ok(JSON.stringify(l) === before, 'listing actions never changes the save (age ' + l.age + ')');
  ok(parses <= 4, 'actions listing clones the save at most a few times, not per action (' + parses + ')');
  ok(rows.length === E.ACT.length && rows.every(r => r.ok === true || typeof r.ok === 'string'), 'every action has a state');
  ok(JSON.stringify(E.actions(l)) === JSON.stringify(rows), 'listing is deterministic');
  const times = []; for (let i = 0; i < 7; i++) { const t = process.hrtime.bigint(); E.actions(l); times.push(Number(process.hrtime.bigint() - t) / 1e6); }
  times.sort((a, b) => a - b); const median = times[3];
  ok(median < 120, 'actions listing median ' + median.toFixed(1) + ' ms on a ' + Math.round(before.length / 1024) + ' KB save');
  console.log('  age ' + l.age + ' · save ' + Math.round(before.length / 1024) + ' KB · E.actions median ' + median.toFixed(1) + ' ms · ' + parses + ' JSON.parse/call');
}
// Kết quả hiển thị vẫn chặn đúng hành động mà điều kiện tình huống không cho phép.
{
  const l = lives[2]; l.school = 'upper'; l.schoolEnd = 18; l.age = 16; l.edu = 2; l.khoi = null; if (l.flags) delete l.flags.khoi912; l.abroad = null; l.country = 'VN';
  const row = E.actions(l).find(r => r.id === 'khoi912'); ok(row && row.ok === true && /Chọn khối/.test(row.l), 'study menu offers khoi choice to a grade-11 student');
  l.examScore = 24; const row2 = E.actions(l).find(r => r.id === 'khoi912'); ok(row2.ok !== true, 'khoi menu locked after exam');
}
// CSS: hộp hồ sơ trong game có nền đặc, không bị lớp .profile (thẻ trang chủ) làm trong suốt; viên "đang chờ" không che nút đóng.
{
  const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'css', 'style.css'), 'utf8');
  ok(/\.modal\.profile\{background:var\(--surface\)/.test(css), 'profile modal has opaque surface background');
  ok(/body:has\(\.modal\.profile\) #decPill\{visibility:hidden\}/.test(css), 'decision pill hidden over profile');
  ok(css.indexOf('.modal.profile{') > css.indexOf('.profile { border'), 'profile modal rule comes after generic .profile rule');
}
console.log('Hiệu năng bảng hành động & hồ sơ: ' + count + ' checks passed.');
