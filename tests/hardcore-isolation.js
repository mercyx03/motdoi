/* Legacy v7.6.0 snapshots. CLI excludes the intentional v8.3 family module; exported gameContext loads all current modules by default. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto'), assert = require('assert');
const root = path.join(__dirname, '..', 'public'), fixture = path.join(__dirname, 'fixtures', 'normal-before-hardcore-redesign.json');
const tick = Date.UTC(2026, 9, 21);
class Clock extends Date { constructor(...a) { super(...(a.length ? a : [tick])); } static now() { return tick; } }
function gameContext(options) {
  let seed = 78123;
  const math = Object.create(Math); math.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const c = { console, Math: math, Date: Clock, JSON, Buffer, TextEncoder, TextDecoder }; c.globalThis = c; vm.createContext(c);
  for (const m of fs.readFileSync(path.join(root, 'index.html'), 'utf8').matchAll(/<script src="(js\/[^"?]+)/g)) {
    if (options && options.skip && options.skip.includes(m[1])) continue;
    if (!(options&&options.legacyBeforeFamily830&&m[1]==='js/life100.js')&&!/\/(app|music|card|scene2d|scene|account)\.js$/.test(m[1])) vm.runInContext(fs.readFileSync(path.join(root, m[1]), 'utf8'), c, { filename: m[1] });
  }
  return c.G;
}
function game() { return gameContext().E; }
module.exports = { game, gameContext };
if (require.main === module) {
const cases = [
  ...Array.from({ length: 6 }, (_, i) => ({ mode: 'vn', variant: i % 2 ? '63' : '34', seed: 78100 + i, year: 2026 })),
  ...['US', 'JP', 'IN', 'NG', 'DE', 'BR'].map((country, i) => ({ mode: 'world', country, seed: 78200 + i, year: 2026 }))
];
const E = gameContext({legacyBeforeFamily830:true}).E, results = cases.map(opts => {
  const l = E.createLife(opts); E.runHeadless(l); const state = Object.assign({}, l); delete state.v;
  return { opts, hash: crypto.createHash('sha256').update(JSON.stringify(state)).digest('hex'), age: l.age, money: l.money, logs: l.log.length };
});
if (process.argv.includes('--capture')) {
  assert(!fs.existsSync(fixture), 'Do not overwrite the v7.6.0 baseline');
  fs.writeFileSync(fixture, JSON.stringify({ version: '7.6.0', capturedBeforeRedesign: true, results }, null, 2) + '\n');
  console.log('Captured ' + results.length + ' complete normal-mode states before changes.');
} else {
  // GĐ2.5: ảnh chụp v7.6.0 chỉ còn để tham khảo — từ v8.0 nhiều module mới cố ý thay đổi chế độ thường, nên không thể giống từng byte.
  // Điều test này bảo vệ là TÍNH CÁCH LY: mã Hardcore (life97, life98) không được làm đổi một byte nào của đời chế độ thường.
  const expected = JSON.parse(fs.readFileSync(fixture, 'utf8')), legacySame = results.filter((r, i) => JSON.stringify(r) === JSON.stringify(expected.results[i])).length;
  const hash = E2 => cases.map(opts => { const l = E2.createLife(opts); E2.runHeadless(l); const state = Object.assign({}, l); delete state.v; return crypto.createHash('sha256').update(JSON.stringify(state)).digest('hex'); });
  const withHC = hash(gameContext().E), withoutHC = hash(gameContext({ skip: ['js/life97.js', 'js/life98.js'] }).E);
  withHC.forEach((h, i) => assert.strictEqual(h, withoutHC[i], 'Hardcore code changed a normal-mode life: ' + JSON.stringify(cases[i])));
  const H = gameContext().E, hc = H.createLife({ mode: 'vn', seed: 78300, difficulty: 'hardcore' }); for (let i = 0; i < 20 && hc.alive; i++) { H.beginYear(hc, {}); let g = 0; while (hc.pending.length && g++ < 64) H.resolve(hc, H.autoKey(hc)); if (hc.alive) H.finishYear(hc); g = 0; while (hc.pending.length && g++ < 64) H.resolve(hc, H.autoKey(hc)); H.endYear(hc); }
  assert(hc.difficulty === 'hardcore' && H.hardcoreState(hc), 'Hardcore lives still run the dedicated campaign');
  console.log('PASS: Hardcore isolation — ' + cases.length + ' normal-mode lives are byte-identical with and without life97/life98; Hardcore campaign active. (Legacy v7.6.0 snapshot, informational: ' + legacySame + '/' + cases.length + ' unchanged.)');
}
}
