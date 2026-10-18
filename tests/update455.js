'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert');
const root = path.join(__dirname, '..', 'public'), html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const [, file] of html.matchAll(/<script src="(js\/[^?]+)\?v=[^"]+"><\/script>/g)) if (!['js/app.js', 'js/music.js', 'js/card.js'].includes(file)) vm.runInThisContext(fs.readFileSync(path.join(root, file), 'utf8'), { filename: file });
let checks = 0; const ok = (x, t) => { assert.ok(x, t); checks++; };
const E = G.E, variants = new Set();
for (let i = 0; i < 300; i++) {
  const l = E.createLife({ mode: 'vn', seed: 45500 + i });
  l.fam = { q: 1 + i % 5, mAlive: true, fAlive: true, sibs: 0 }; const seed = l.rs;
  const d = E.birthContext(l); variants.add(d.text);
  ok(d.label === 'Bối cảnh gia đình' && !/biến cố/i.test(d.text), 'mô tả hoàn cảnh cụ thể');
  ok(d.text === E.birthContext(l).text && seed === l.rs, 'vẽ lại không đổi mô tả hay RNG');
  ok(d.text === E.birthContext(JSON.parse(JSON.stringify(l))).text, 'ổn định qua save/load');
  ok((l.fam.q === 5 ? /giàu|dư dả/ : l.fam.q === 4 ? /khá giả|có điều kiện|dư dả/ : l.fam.q === 1 ? /nghèo|thiếu thốn|chật vật/ : /thu nhập thấp|eo hẹp|không dư dả|ít tiền|trung bình|đủ trang trải|bình dân|không giàu/).test(d.text), 'mức sống khớp dữ liệu');
}
ok(variants.size > 110, 'nhiều biến thể kinh tế và nếp nuôi dạy: ' + variants.size);
const l = E.createLife({ mode: 'vn', seed: 45599 });
l.fam = { q: 5, noDad: true, mAlive: true, fAlive: false, sibs: 0, vice: null };
ok(/mẹ/.test(E.birthContext(l).text) && !/bố mẹ|bố chăm sóc/.test(E.birthContext(l).text), 'mẹ đơn thân không xuất hiện hai bố mẹ chăm con');
l.fam.mAlive = false; ok(E.birthContext(l).severe && /không còn bố mẹ/.test(E.birthContext(l).text) && !/bố mẹ coi trọng|mẹ một mình/.test(E.birthContext(l).text), 'mồ côi không có cha mẹ hiện diện');
l.fam = { q: 4, mAlive: true, fAlive: true, sibs: 5, vice: 'drugs', elite: {} };
ok(/ma túy/.test(E.birthContext(l).text) && /đông anh chị em/.test(E.birthContext(l).text) && E.birthContext(l).label === 'Bối cảnh gia đình', 'hiển thị cả bất ổn và gia đình đông con trong cùng bối cảnh');
console.log('PASS: ' + checks + ' kiểm tra bối cảnh gia đình bản 4.5.5 (' + variants.size + ' biến thể).');
