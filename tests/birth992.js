'use strict';
// 9.9.2: đợt 2 sự kiện thật theo nước, cân bằng tông, REV theo thành phố, tương tác dòng chào đời.
const assert = require('assert'), G = require('./hardcore-isolation').gameContext(), E = G.E, D = G.BIRTH987, B = E.BIRTH987; let n = 0; function ok(v, m) { assert(v, m); n++; }
const cnt = c => (D.EV[c] || []).length;
// Tổng và tông
let tot = 0, joy = 0, grief = 0; Object.keys(D.EV).forEach(c => D.EV[c].forEach(e => { tot++; if (e[3] === 'joy') joy++; if (e[3] === 'grief') grief++; }));
ok(tot >= 3300, 'tổng sự kiện ' + tot); ok(joy >= 380, 'sự kiện vui ' + joy); ok(grief < tot * 0.3, 'không quá nặng buồn');
ok(joy / Math.max(1, grief) >= 0.45, 'tỉ lệ vui/buồn hợp lý');
// Nước nhỏ đã có thêm dữ liệu
['BS', 'BB', 'BZ', 'BT', 'BW', 'CV', 'FJ', 'GA', 'GM', 'IS', 'LU', 'MU', 'MC', 'MN', 'NO', 'UY'].forEach(c => ok(cnt(c) >= 5, c + ' ≥5 sự kiện, hiện ' + cnt(c)));
// Nước lớn có mốc nửa đầu thế kỷ XX
['US', 'GB', 'FR', 'DE', 'IT', 'ES', 'IN', 'BR', 'MX', 'JP', 'CN', 'RU', 'TR', 'EG'].forEach(c => ok((D.EV[c] || []).filter(e => e[0] < 1950).length >= 4, c + ' có ≥4 mốc trước 1950'));
// Năm hợp lệ, không trùng ý trong cùng năm
let bad = [], near = [];
const wd = t => String(t).toLowerCase().split(/[^\p{L}\d]+/u).filter(x => x.length >= 4);
Object.keys(D.EV).forEach(c => { const a = D.EV[c]; a.forEach(e => { if (!(e[0] >= 1900 && e[0] <= 2025) || !e[1]) bad.push(c + e[0]); ok(true); }); for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (a[i][0] === a[j][0] && wd(a[i][1]).filter(x => wd(a[j][1]).includes(x)).length >= 3) near.push(c + a[i][0]); });
ok(!bad.length, 'năm hợp lệ ' + bad.slice(0, 5)); ok(!near.length, 'không trùng ý ' + near.slice(0, 5));
// REV: nước mới và địa danh hợp lệ
['AR', 'CO', 'PE', 'CL', 'KE'].forEach(c => ok((D.REV[c] || []).length >= 4, 'REV ' + c));
let rbad = [];
Object.keys(D.REV).forEach(c => { const cities = (G.W.BY[c] && G.W.BY[c].cities) || []; D.REV[c].forEach(r => { if (!(r[0] >= 1900 && r[0] <= 2025)) rbad.push(c + r[0]); if (c !== 'VN' && !r[1].some(p => cities.includes(p) || /^@/.test(p))) rbad.push(c + ':' + r[1]); ok(true); }); });
ok(!rbad.length, 'REV hợp lệ ' + rbad.slice(0, 5));
// Dòng chào đời nhắc sự kiện mới
const hasEv = (c, y) => (D.EV[c] || []).some(e => e[0] === y);
ok(hasEv('NO', 2018), 'Na Uy 2018');
{ const l = { birthYear: 2018, age: 0, country: 'NO', mode: 'world', flags: {}, alive: true }; const t = B.birthText(l); ok(t && t.text, 'sinh ở Na Uy 2018 có dòng chào đời'); }
const miss = []; G.W.C.forEach(c => { for (let y = 1900; y <= 2025; y++) if (!B.covered(c.code, y)) miss.push(c.code + y); });
ok(!miss.length, 'vẫn phủ kín');
console.log('birth992 OK', n);
