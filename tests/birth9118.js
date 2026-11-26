'use strict';
// 9.11.8: mọi nước có sự kiện riêng ở mọi năm 1900–2025.
const assert = require('assert'), fs = require('fs');
const { gameContext } = require('./hardcore-isolation.js');
let n = 0; const ok = (c, m) => { assert(c, m); n++; };
const G = (c => c.G || c)(gameContext()); const D = G.BIRTH987, BY = G.W.BY;
Object.keys(BY).forEach(c => { const ys = new Set((D.EV[c] || []).map(e => e[0]).concat((D.REV[c] || []).map(e => e[0]))); for (let y = 1900; y <= 2025; y++) ok(ys.has(y), c + ' có sự kiện riêng năm ' + y); });
const fake = { BIRTH987: { ERA: {}, EV: {}, WORLD: [] } };
new Function('globalThis', fs.readFileSync(__dirname + '/../public/js/data-birth9118-fill00.js', 'utf8'))({ G: fake });
const NEW = fake.BIRTH987.EV; let rows = 0; const tone = { joy: 0, grief: 0, '': 0 };
Object.keys(NEW).forEach(c => { ok(BY[c], 'mã nước ' + c); const seen = {}; NEW[c].forEach(e => {
  rows++; tone[e[3]]++;
  ok(e[0] >= 1900 && e[0] <= 1919, c + ' năm 1900–1919: ' + e[0]); ok(e[2] === 1 || e[2] === 2, c + ' mức'); ok(e[3] in tone, c + ' tone');
  ok(e[1].length >= 6 && e[1].indexOf('...') < 0 && !/[.]$/.test(e[1]), c + ' nội dung gọn: ' + e[1]);
  ok(!/có thật|đối chiếu|wikipedia|theo nguồn/i.test(e[1]), c + ' không ghi nguồn: ' + e[1]);
  ok(!seen[e[0]], c + ' một dòng mỗi năm ' + e[0]); seen[e[0]] = 1; }); });
ok(rows >= 3580, 'số dòng ' + rows);
ok(tone.joy >= 1100 && tone.grief >= 550 && tone[''] >= 1600, 'đủ vui/buồn/trung tính ' + JSON.stringify(tone));
console.log('birth9118: ' + n + ' checks OK');
