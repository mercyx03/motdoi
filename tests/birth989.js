'use strict';
// 9.8.9: bối cảnh theo vùng/thành phố, mọi nước mọi năm 1900–2025 đều có ít nhất một dòng, sự kiện cả nước không lặp với sự kiện vùng.
const assert = require('assert'), G = require('./hardcore-isolation').gameContext(), E = G.E, D = G.BIRTH987, B = E.BIRTH987; let n = 0; function ok(v, m) { assert(v, m); n++; }
const codes = G.W.C.map(c => c.code);
// 1. Phủ kín: mỗi nước, mỗi năm 1900–2025 đều có sự kiện, tin thế giới hoặc chỉ số đời sống.
let miss = [];
codes.forEach(c => { for (let y = 1900; y <= 2025; y++) if (!B.covered(c, y)) miss.push(c + ' ' + y); });
ok(miss.length === 0, 'mọi nước mọi năm đều có nội dung: thiếu ' + miss.slice(0, 10).join(', '));
for (let y = 1900; y <= 2025; y++) ok(D.WORLD.some(e => e[0] === y), 'có tin thế giới năm ' + y);
// 2. Nước lớn nhiều sự kiện, nước nhỏ ít mà vẫn có.
const cnt = c => (D.EV[c] || []).length;
['US', 'CN', 'IN', 'RU', 'JP', 'DE', 'GB', 'FR', 'BR', 'VN', 'ID', 'KR'].forEach(c => ok(cnt(c) >= 40, c + ' có từ 40 sự kiện, hiện ' + cnt(c)));
['NG', 'EG', 'MX', 'IT', 'ES', 'ZA', 'AU', 'TR', 'IR', 'PK'].forEach(c => ok(cnt(c) >= 18, c + ' có từ 18 sự kiện, hiện ' + cnt(c)));
// 3. Dữ liệu vùng hợp lệ: tên thành phố có trong danh sách của game (hoặc tỉnh/mã vùng Việt Nam, khu vực Berlin), năm đúng khoảng, không trùng.
const vnNames = new Set(); (G.VN.P63 || []).concat(G.VN.P34 || []).forEach(p => [p.name, p.city, p.old, p.neu].forEach(x => x && vnNames.add(x)));
['DBSH', 'MNPB', 'BTB', 'NTB', 'TN', 'DNB', 'DBSCL'].forEach(r => vnNames.add('@' + r));
const known = c => c === 'VN' ? vnNames : new Set(((G.W.BY[c] || {}).cities || []).concat(c === 'DE' ? ['Đông Berlin', 'Tây Berlin'] : []));
Object.keys(D.REG).forEach(c => { const k = known(c); D.REG[c].forEach(r => { ok(Array.isArray(r[0]) && r[0].length, c + ' REG có nơi'); r[0].forEach(p => ok(k.has(p), c + ' REG nơi có trong game: ' + p)); ok(r[1] >= 1900 && r[2] <= 2025 && r[1] <= r[2], c + ' REG năm ' + r[1]); ok(r[3] && r[4] && r[4].length >= 25, c + ' REG mô tả ' + r[3]); }); });
Object.keys(D.REV).forEach(c => { const k = known(c), seen = new Set(); D.REV[c].forEach(e => { ok(e[0] >= 1900 && e[0] <= 2025, c + ' REV năm'); e[1].forEach(p => ok(k.has(p), c + ' REV nơi có trong game: ' + p)); ok([1, 2].includes(e[3]) && ['', 'joy', 'grief'].includes(e[4]), c + ' REV mức'); const id = e[0] + e[2]; ok(!seen.has(id), c + ' REV không trùng ' + id); seen.add(id); }); });
// 4. Sự kiện cả nước không trùng ý trong cùng năm (dữ liệu bổ sung không lặp dữ liệu 9.8.8).
const wd = t => String(t).toLowerCase().split(/[^\p{L}\d]+/u).filter(x => x.length >= 4);
let near = [];
Object.keys(D.EV).forEach(c => { const a = D.EV[c]; for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (a[i][0] === a[j][0]) { const A = wd(a[i][1]), Bw = wd(a[j][1]); if (A.filter(x => Bw.includes(x)).length >= 3) near.push(c + ' ' + a[i][0]); } });
ok(near.length === 0, 'không có sự kiện trùng ý: ' + near.slice(0, 5).join(', '));
// 5. Việt Nam theo vùng: tỉnh miền Bắc thời 1965–1972, ĐBSCL, cả bộ 63 tỉnh lẫn 34 tỉnh sau sắp xếp.
function life(o) { return E.createLife(Object.assign({ seed: 11 }, o)); }
{ const l = { birthYear: 1968, age: 0, country: 'VN', mode: 'vn', flags: {}, alive: true, prov: { old: 'Thái Bình', neu: 'Hưng Yên', region: 'DBSH' } };
  const t = B.birthText(l); ok(t && t.reg && /miền Bắc/.test(t.reg[3]), 'Thái Bình 1968 có bối cảnh miền Bắc'); ok(/Riêng ở/.test(t.text), 'dòng chào đời có phần vùng'); }
{ const l = { birthYear: 1968, age: 0, country: 'VN', mode: 'vn', flags: {}, alive: true, prov: { old: 'Cần Thơ', neu: 'Cần Thơ', region: 'DBSCL' } };
  const t = B.birthText(l); ok(t && t.reg && /Việt Nam Cộng hòa/.test(t.reg[3]), 'Cần Thơ 1968 thuộc Việt Nam Cộng hòa'); }
['63', '34'].forEach(v => { const l = life({ mode: 'vn', variant: v, year: 1985 }); const h = B.places(l, 'VN'); ok(h.some(x => x.charAt(0) === '@'), 'bộ ' + v + ' tỉnh có mã vùng'); ok(B.regAt('VN', 1985, h) || B.eraAt('VN', 1985), 'bộ ' + v + ' tỉnh có bối cảnh'); });
{ const l = { birthYear: 1960, age: 16, country: 'VN', mode: 'vn', flags: {}, alive: true, city: 'thành phố Vũng Tàu', prov: { old: 'Bà Rịa – Vũng Tàu', neu: 'TP. Hồ Chí Minh', region: 'DNB', merged: true } };
  ok(!B.places(l, 'VN', 1976).includes('TP. Hồ Chí Minh'), 'trước 2025 chưa tính tỉnh mới sau sáp nhập'); ok(B.places(l, 'VN', 2025).includes('TP. Hồ Chí Minh'), 'từ 2025 tính tỉnh mới');
  ok(!B.regEventsAt('VN', 1975, B.places(l, 'VN', 1975)).some(e => e[1].length === 1 && e[1][0] === 'TP. Hồ Chí Minh'), 'không nhận sự kiện riêng của TP. Hồ Chí Minh trước sáp nhập'); }
// 6. Thành phố nước ngoài: Đông/Tây Berlin, Leningrad bị phong tỏa, miền Nam nước Mỹ thời Jim Crow.
ok(/Cộng hòa Dân chủ Đức/.test((B.regAt('DE', 1975, ['Leipzig']) || [])[3]), 'Leipzig 1975 thuộc Đông Đức');
ok(/Cộng hòa Liên bang/.test((B.regAt('DE', 1975, ['Hamburg']) || [])[3]), 'Hamburg 1975 thuộc Tây Đức');
ok(/bức tường/.test((B.regAt('DE', 1975, ['Tây Berlin']) || [])[3]), 'Tây Berlin ưu tiên dòng cụ thể nhất');
ok(!B.regAt('DE', 1995, ['Hamburg']), 'không còn Tây Đức sau 1990');
ok(/phong tỏa/.test((B.regAt('RU', 1942, ['Saint Petersburg']) || [])[3]), 'Leningrad 1942');
ok(/Jim Crow/.test((B.regAt('US', 1950, ['Atlanta']) || [])[3]) && !B.regAt('US', 1950, ['Boston']), 'Jim Crow chỉ ở miền Nam');
// 7. Chống lặp: sự kiện vùng thay cho phần trùng của sự kiện cả nước.
{ const evs = [[2008, 'động đất Tứ Xuyên; Thế vận hội Bắc Kinh', 2, 'grief']]; const t = B.trimNational(evs, ['động đất Tứ Xuyên làm Thành Đô rung chuyển']); ok(t.length === 1 && !/Tứ Xuyên/.test(t[0][1]) && /Thế vận hội/.test(t[0][1]), 'bỏ phần trùng, giữ phần khác'); ok(B.trimNational(evs, []).length === 1, 'không có vùng thì giữ nguyên'); }
// 8. Mỗi năm đều có một dòng; không lặp; tất định.
function run(o, ages) { const l = life(o), logs = []; const log = t => logs.push(l.age + ':' + t); B.onBirth(l, log); for (let a = 1; a <= ages; a++) { l.age = a; B.year(l, () => .5, log); B.year(l, () => .5, log); } return logs; }
[['world', 'FJ', 1930], ['world', 'BT', 1960], ['world', 'US', 1950], ['vn', null, 1920]].forEach(([m, c, y]) => {
  const o = m === 'vn' ? { mode: 'vn', variant: '63', year: y } : { mode: 'world', country: c, year: y }, a = run(o, 40), b = run(o, 40);
  for (let age = 5; age <= 40; age++) ok(a.some(t => t.startsWith(age + ':')), (c || 'VN') + ' ' + y + ' tuổi ' + age + ' có dòng bối cảnh');
  ok(new Set(a).size === a.length, (c || 'VN') + ' không lặp dòng');
  ok(JSON.stringify(a) === JSON.stringify(b), (c || 'VN') + ' tất định'); });
// 9. Bản lưu cũ (cờ 9.8.8 chưa có rkey) vẫn chạy.
{ const l = life({ mode: 'world', country: 'GB', year: 1970 }); l.flags.birth987 = { y: 1970, cc: 'GB', key: 'GB:x', events: [], seen: {} }; l.age = 10; const logs = []; B.year(l, () => .5, t => logs.push(t)); ok(logs.length >= 1, 'bản lưu cũ vẫn nhận bối cảnh'); }
console.log('birth989: ' + n + ' kiểm tra đạt');
