'use strict';
// 9.11.2: mọi nước có sự kiện riêng ở mọi năm 2000–2025; mốc nhỏ lặp lại không bị kể dồn dập.
const assert = require('assert'), fs = require('fs');
const { gameContext } = require('./hardcore-isolation.js');
let n = 0; const ok = (c, m) => { assert(c, m); n++; };
const ctx = gameContext(); const G = ctx.G || ctx; const D = G.BIRTH987, BY = G.W.BY, E = G.E;
// 1) Phủ 100% năm 2000–2025 cho cả 196 nước
Object.keys(BY).forEach(c => { const ys = new Set((D.EV[c] || []).map(e => e[0]).concat((D.REV[c] || []).map(e => e[0]))); for (let y = 2000; y <= 2025; y++) ok(ys.has(y), c + ' có sự kiện riêng năm ' + y); });
ok(Object.keys(BY).length >= 196, 'đủ 196 nước');
// 2) Dữ liệu của đợt này hợp lệ
const fake = { BIRTH987: { ERA: {}, EV: {}, WORLD: [] } };
new Function('globalThis', fs.readFileSync(__dirname + '/../public/js/data-birth9112-fill.js', 'utf8'))({ G: fake });
const NEW = fake.BIRTH987.EV; let rows = 0; const tone = { joy: 0, grief: 0, '': 0 };
Object.keys(NEW).forEach(c => {
  ok(BY[c], 'mã nước hợp lệ ' + c); const seen = {};
  NEW[c].forEach(e => {
    rows++; tone[e[3]]++;
    ok(e[0] >= 2000 && e[0] <= 2025, c + ' năm hợp lệ ' + e[0]); ok(e[2] === 1 || e[2] === 2, c + ' mức hợp lệ'); ok(e[3] in tone, c + ' tone hợp lệ');
    ok(typeof e[1] === 'string' && e[1].length >= 8 && !/[.]$/.test(e[1]), c + ' câu ngắn gọn, không chấm cuối: ' + e[1]);
    ok(!/có thật|đối chiếu|wikipedia|theo nguồn|dựa trên sự kiện/i.test(e[1]), c + ' không ghi nguồn hay "có thật": ' + e[1]);
    ok(!seen[e[0]], c + ' một dòng mỗi năm trong đợt này ' + e[0]); seen[e[0]] = 1;
  });
});
ok(rows >= 3600, 'đợt này có ' + rows + ' dòng');
ok(tone.joy >= 600 && tone.grief >= 600 && tone[''] >= 1500, 'có cả tin vui, buồn, trung tính ' + JSON.stringify(tone));
// 3) Không trùng nội dung trong cùng năm của một nước (sau khi gộp mọi file dữ liệu)
Object.keys(D.EV).forEach(c => { const k = {}; D.EV[c].forEach(e => { const key = e[0] + '|' + e[1]; ok(!k[key], 'không trùng ' + c + ' ' + key); k[key] = 1; }); });
// 4) Chơi một đời ở nước nhỏ: mốc nhỏ cùng nội dung không được kể lại trong vòng 3 năm
for (const cc of ['BN', 'SM', 'KN', 'TV', 'LI']) {
  const l = E.createLife({ mode: 'world', country: cc, seed: 9112 + cc.charCodeAt(0), year: 1995 }); let g = 0;
  while (l.alive && l.age < 32 && g++ < 40) { E.beginYear(l, { auto: true }); let x = 0; while (l.pending.length && l.alive && x++ < 64) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); x = 0; while (l.pending.length && l.alive && x++ < 64) E.resolve(l, E.autoKey(l)); E.endYear(l); }
  const told = {}; let lines = 0;
  (l.log || []).forEach(x => { const t = typeof x === 'string' ? x : (x.t || x.text || ''); const m = /^Năm (\d{4}) ở [^:]+: (.+)$/.exec(t); if (!m) return; const y = +m[1]; if (y < 2000) return; lines++; const key = m[2]; if (told[key] != null) ok(y - told[key] >= 4 || (NEW[cc] || []).some(e => e[0] === y && e[2] >= 2 && key.toLowerCase().indexOf(e[1].toLowerCase().slice(0, 12)) >= 0), cc + ' mốc nhỏ không lặp trong 3 năm: ' + key); told[key] = y; });
  ok(lines >= 8, cc + ' nhật ký có sự kiện của nước sau năm 2000: ' + lines);
}
// 5) Bản lưu cũ không có khóa rec9112 vẫn chạy
const old = E.createLife({ mode: 'world', country: 'MC', seed: 77, year: 2000 }); Object.keys(old.flags || {}).forEach(k => { const v = old.flags[k]; if (v && typeof v === 'object' && 'rec9112' in v) delete v.rec9112; });
E.beginYear(old, { auto: true }); ok(old.alive, 'bản lưu cũ chạy năm mới bình thường');
console.log('birth9112: ' + n + ' checks OK');
