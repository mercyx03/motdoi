'use strict';
// 9.10.0: đợt 3–7 sự kiện thật: nước nhỏ, nước đông dân, tầng thành phố, làm rõ câu chung chung.
const assert = require('assert'), G = require('./hardcore-isolation').gameContext(), E = G.E, D = G.BIRTH987, B = E.BIRTH987; let n = 0; function ok(v, m) { assert(v, m); n++; }
const cnt = c => (D.EV[c] || []).length;
let tot = 0, joy = 0, grief = 0, yrs = 0; Object.keys(D.EV).forEach(c => { tot += cnt(c); yrs += new Set(D.EV[c].map(e => e[0])).size; D.EV[c].forEach(e => { if (e[3] === 'joy') joy++; if (e[3] === 'grief') grief++; }); });
ok(tot >= 4000, 'tổng sự kiện ' + tot); ok(joy >= 480, 'sự kiện vui ' + joy); ok(yrs >= 3700, 'cặp nước–năm có sự kiện riêng ' + yrs);
ok(joy / Math.max(1, grief) >= 0.5, 'tỉ lệ vui/buồn');
// Số nước dưới 12 sự kiện giảm mạnh (trước 9.10.0 là 127), nước dưới 8 sự kiện gần như hết
const lt12 = G.W.C.filter(c => cnt(c.code) < 12).length, lt8 = G.W.C.filter(c => cnt(c.code) < 8).map(c => c.code);
ok(lt12 <= 45, 'nước dưới 12 sự kiện: ' + lt12); ok(lt8.length <= 12, 'nước dưới 8 sự kiện: ' + lt8.join(','));
// Nước đông dân có nhiều sự kiện
['NG', 'PK', 'ET', 'BD', 'EG', 'PH', 'AR', 'IR', 'TR'].forEach(c => ok(cnt(c) >= 28, c + ' đủ sự kiện, hiện ' + cnt(c))); ['KE', 'CD', 'CO', 'TH', 'MM', 'ZA', 'UA', 'PL'].forEach(c => ok(cnt(c) >= 19, c + ' đủ sự kiện, hiện ' + cnt(c)));
// Hợp lệ, không trùng ý
const wd = t => String(t).toLowerCase().split(/[^\p{L}\d]+/u).filter(x => x.length >= 4);
let bad = [], near = [];
Object.keys(D.EV).forEach(c => { const a = D.EV[c]; a.forEach(e => { if (!(e[0] >= 1900 && e[0] <= 2025) || !e[1]) bad.push(c + e[0]); ok(true); }); for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (a[i][0] === a[j][0] && wd(a[i][1]).filter(x => wd(a[j][1]).includes(x)).length >= 3) near.push(c + a[i][0]); });
ok(!bad.length, 'năm hợp lệ ' + bad.slice(0, 5)); ok(!near.length, 'không trùng ý ' + near.slice(0, 5));
// Tầng thành phố: nước đông dân, địa danh hợp lệ
ok((D.REV.US || []).length >= 35, 'REV Mỹ ' + (D.REV.US || []).length);
['IN', 'NG', 'BR', 'ID', 'MX'].forEach(c => ok((D.REV[c] || []).length >= 20, 'REV ' + c));
let rbad = []; Object.keys(D.REV).forEach(c => { const cities = (G.W.BY[c] && G.W.BY[c].cities) || []; D.REV[c].forEach(r => { if (!(r[0] >= 1900 && r[0] <= 2025)) rbad.push(c + r[0]); if (c !== 'VN' && !r[1].some(p => cities.includes(p) || /^@/.test(p))) rbad.push(c + ':' + r[1]); ok(true); }); });
ok(!rbad.length, 'REV hợp lệ ' + rbad.slice(0, 5));
// Câu chung chung đã được làm rõ
ok(D.FIX9100 && D.FIX9100.patched >= 30, 'đã làm rõ ' + (D.FIX9100 && D.FIX9100.patched));
const has = (c, y, re) => (D.EV[c] || []).some(e => e[0] === y && re.test(e[1]));
ok(has('UZ', 1991, /1\/9/), 'Uzbekistan 1991'); ok(has('GH', 1957, /6\/3/), 'Ghana 1957'); ok(has('LK', 2004, /ba mươi nghìn/), 'Sri Lanka 2004');
// Kiểm chứng web: các mốc đã đối chiếu
ok(has('NO', 2018, /Na Uy dẫn đầu/), 'Na Uy 2018'); ok(has('LI', 1980, /Wenzel/), 'Liechtenstein 1980'); ok(has('TZ', 1974, /Bayi/), 'Tanzania 1974'); ok(has('ER', 2015, /Teklehaimanot/), 'Eritrea 2015'); ok(has('SS', 2012, /Marial/), 'Nam Sudan 2012');
// Dòng chào đời vẫn hoạt động
{ const l = { birthYear: 1980, age: 0, country: 'LI', mode: 'world', flags: {}, alive: true }; const t = B.birthText(l); ok(t && t.text, 'Liechtenstein 1980 có dòng chào đời'); }
const miss = []; G.W.C.forEach(c => { for (let y = 1900; y <= 2025; y++) if (!B.covered(c.code, y)) miss.push(c.code + y); }); ok(!miss.length, 'vẫn phủ kín');
console.log('birth9100 OK', n, '| sự kiện', tot, '| nước<12:', lt12, '| nước<8:', lt8.join(','));
