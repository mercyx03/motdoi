'use strict';
const assert = require('assert');
const { gameContext } = require('./hardcore-isolation.js');
let n = 0; const ok = (c, m) => { assert(c, m); n++; };
const ctx = gameContext(); const G = ctx.G || ctx; const D = G.BIRTH987;
const EV = D.EV, REV = D.REV;
const joy = c => (EV[c] || []).filter(e => e[3] === 'joy').length;
// Mục 3: sự kiện vui cho nước lớn
const joyMin = { ID: 6, MX: 6, US: 6, IN: 8, CN: 8, BR: 9, TR: 8, EG: 7, IR: 7, PK: 9, BD: 7, PH: 8, UG: 7, CD: 4 };
Object.keys(joyMin).forEach(c => ok(joy(c) >= joyMin[c], c + ' có ít nhất ' + joyMin[c] + ' sự kiện vui, hiện ' + joy(c)));
// Mục 2: năm trống
const gapMin = { SD: 22, AF: 25, AO: 17, MZ: 19, NE: 18, ML: 19, YE: 18, CM: 18, TZ: 19, UG: 23, CD: 41 };
Object.keys(gapMin).forEach(c => ok((EV[c] || []).length >= gapMin[c], c + ' ≥ ' + gapMin[c] + ' sự kiện, hiện ' + (EV[c] || []).length));
// Mục 4: thành phố
const revMin = { PK: 25, BD: 21, ET: 17, EG: 19, PH: 22, TR: 25, IR: 24, TZ: 9, UG: 8, CD: 13 };
Object.keys(revMin).forEach(c => ok((REV[c] || []).length >= revMin[c], c + ' có ít nhất ' + revMin[c] + ' sự kiện thành phố, hiện ' + (REV[c] || []).length));
Object.keys(revMin).forEach(c => {
  const cities = (G.W.BY[c] && G.W.BY[c].cities) || [];
  (REV[c] || []).forEach(r => { ok(r[1].every(p => cities.indexOf(p) >= 0), c + ' thành phố hợp lệ ' + r[1]); ok(r[0] >= 1900 && r[0] <= 2025, 'năm ' + r[0]); });
});
// các mốc có ngày đã đối chiếu web
const has = (c, y, w) => (EV[c] || []).some(e => e[0] === y && e[1].indexOf(w) >= 0);
ok(has('UG', 2020, '14/8'), 'Cheptegei 5000 m 14/8/2020');
ok(has('UG', 2020, '7/10'), 'Cheptegei 10000 m 7/10/2020');
ok(has('BD', 2018, '10/6'), 'Bangladesh nữ vô địch Asia Cup 10/6/2018');
ok(has('ML', 2006, 'Grammy'), 'Ali Farka Touré Grammy 2006');
ok((REV.ET || []).some(r => r[0] === 1902 && r[2].indexOf('24/12') >= 0), 'Dire Dawa 24/12/1902');
// không trùng lặp trong cùng nước, không mâu thuẫn năm
['ID','MX','US','IN','CN','BR','TR','EG','IR','PK','BD','PH','UG','CD','SD','AF','AO','MZ','NE','ML','YE','CM','TZ'].forEach(c => {
  const seen = {}; (EV[c] || []).forEach(e => { const k = e[0] + '|' + e[1]; ok(!seen[k], 'trùng ' + c + ' ' + k); seen[k] = 1; ok(['', 'joy', 'grief'].indexOf(e[3]) >= 0, 'tone ' + c); });
});
console.log('birth9102 OK ' + n + ' kiểm tra');
