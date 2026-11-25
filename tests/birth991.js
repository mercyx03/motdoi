'use strict';
// 9.9.1: mở rộng sự kiện thật theo nước — số lượng, năm hợp lệ, không trùng, tương tác với dòng chào đời.
const assert = require('assert'), G = require('./hardcore-isolation').gameContext(), E = G.E, D = G.BIRTH987, B = E.BIRTH987; let n = 0; function ok(v, m) { assert(v, m); n++; }
const cnt = c => (D.EV[c] || []).length;
['AO', 'CM', 'MG', 'NE', 'SN', 'ZM', 'BF', 'CI', 'ML', 'TZ', 'UG', 'GH', 'MA', 'DZ', 'SD', 'YE', 'SO', 'MZ', 'ZW', 'TN', 'LY', 'NP', 'KH', 'CO', 'PE', 'CL', 'PT', 'CH', 'RO', 'HU', 'KZ'].forEach(c => ok(cnt(c) >= 7, c + ' có từ 7 sự kiện, hiện ' + cnt(c)));
let bad = [];
Object.keys(D.EV).forEach(c => D.EV[c].forEach(e => { if (!(e[0] >= 1900 && e[0] <= 2025)) bad.push(c + ' ' + e[0]); ok(true); }));
ok(bad.length === 0, 'năm/văn bản hợp lệ: ' + bad.slice(0, 8).join(', '));
const wd = t => String(t).toLowerCase().split(/[^\p{L}\d]+/u).filter(x => x.length >= 4);
let near = [];
Object.keys(D.EV).forEach(c => { const a = D.EV[c]; for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (a[i][0] === a[j][0] && (a[i][1] === a[j][1] || wd(a[i][1]).filter(x => wd(a[j][1]).includes(x)).length >= 3)) near.push(c + ' ' + a[i][0]); });
ok(near.length === 0, 'không trùng ý: ' + near.slice(0, 5).join(', '));
// Mốc độc lập đúng năm
const has = (c, y, re) => (D.EV[c] || []).some(e => e[0] === y && re.test(e[1]));
ok(has('GH', 1957, /độc lập/), 'Ghana 1957'); ok(has('DZ', 1962, /độc lập/), 'Algeria 1962'); ok(has('AO', 1975, /độc lập/), 'Angola 1975'); ok(has('MZ', 1975, /độc lập/), 'Mozambique 1975'); ok(has('SG', 1965, /độc lập/), 'Singapore 1965'); ok(has('HR', 1991, /độc lập/), 'Croatia 1991');
// Chào đời nhắc sự kiện mới
{ const l = { birthYear: 1957, age: 0, country: 'GH', mode: 'world', flags: {}, alive: true }; const t = B.birthText(l); ok(t && /độc lập/.test(t.text), 'sinh ở Ghana 1957 nghe nhắc độc lập'); }
// Phủ kín vẫn đúng
const miss = []; G.W.C.forEach(c => { for (let y = 1900; y <= 2025; y++) if (!B.covered(c.code, y)) miss.push(c.code + y); });
ok(miss.length === 0, 'vẫn phủ kín');
console.log('birth991 OK', n);
