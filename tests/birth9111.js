'use strict';
const assert = require('assert');
const { gameContext } = require('./hardcore-isolation.js');
let n = 0; const ok = (c, m) => { assert(c, m); n++; };
const ctx = gameContext(); const G = ctx.G || ctx; const D = G.BIRTH987;
const gaps = c => { const ys = new Set((D.EV[c] || []).map(e => e[0]).concat((D.REV[c] || []).map(e => e[0]))); let g = 0; for (let y = 2000; y <= 2025; y++) if (!ys.has(y)) g++; return g; };
// số năm 2000–2025 còn trống tối đa sau đợt 9.11.1
const maxGap = { NG: 3, PK: 3, CD: 2, ID: 1, ET: 4, BD: 3, BR: 0, MX: 0, TZ: 6, EG: 4, PH: 4, KE: 5, UG: 7 };
Object.keys(maxGap).forEach(c => ok(gaps(c) <= maxGap[c], c + ' còn trống 2000–2025: ' + gaps(c) + ' (tối đa ' + maxGap[c] + ')'));
const added = ['NG', 'PK', 'CD', 'ID', 'ET', 'BD', 'BR', 'MX', 'TZ', 'EG', 'PH', 'KE', 'UG'];
// đọc riêng các dòng của đợt này bằng cách chạy file dữ liệu trên một G rỗng
const rowsNew = {}; { const fake = { BIRTH987: { ERA: {}, EV: {}, WORLD: [] } }; new Function('globalThis', require('fs').readFileSync(__dirname + '/../public/js/data-birth9111-pop.js', 'utf8').replace(/\}\)\(globalThis\.G\);\s*$/, '})(globalThis.G);'))({ G: fake }); Object.assign(rowsNew, fake.BIRTH987.EV); }
ok(Object.keys(rowsNew).length === added.length, 'đủ ' + added.length + ' nước trong đợt này');
let total = 0;
added.forEach(c => (rowsNew[c] || []).forEach(e => { total++; ok(e[0] >= 2000 && e[0] <= 2025, c + ' năm hợp lệ ' + e[0]); ok(e[2] === 1 || e[2] === 2, c + ' mức hợp lệ'); ok(['', 'joy', 'grief'].includes(e[3] || ''), c + ' tone hợp lệ'); ok(e[1].length > 12, c + ' có nội dung: ' + e[1]); ok(!/dựa trên|có thật|nguồn|wikipedia|đối chiếu/i.test(e[1]), c + ' không ghi nguồn/“có thật” trong chữ hiển thị: ' + e[1]); }));
ok(total >= 130, 'tổng số dòng đợt này ' + total);
added.forEach(c => { const seen = {}; (D.EV[c] || []).forEach(e => { const k = e[0] + '|' + e[1]; ok(!seen[k], c + ' không trùng ' + k); seen[k] = 1; }); });
let j = 0, g = 0, t = 0; added.forEach(c => (rowsNew[c] || []).forEach(e => { t++; if (e[3] === 'joy') j++; if (e[3] === 'grief') g++; }));
ok(j >= 12 && g >= 40 && (t - j - g) >= 25, 'cân bằng vui/buồn/trung tính: ' + j + '/' + g + '/' + (t - j - g));
console.log('birth9111: ' + n + ' checks OK');
