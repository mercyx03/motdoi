/* Golden snapshots captured from v7.6.0 before the Hardcore-only redesign. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto'), assert = require('assert');
const root = path.join(__dirname, '..', 'public'), fixture = path.join(__dirname, 'fixtures', 'normal-before-hardcore-redesign.json');
const tick = Date.UTC(2026, 9, 21);
class Clock extends Date { constructor(...a) { super(...(a.length ? a : [tick])); } static now() { return tick; } }
function game() {
  let seed = 78123;
  const math = Object.create(Math); math.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const c = { console, Math: math, Date: Clock, JSON, Buffer, TextEncoder, TextDecoder }; c.globalThis = c; vm.createContext(c);
  for (const m of fs.readFileSync(path.join(root, 'index.html'), 'utf8').matchAll(/<script src="(js\/[^"?]+)/g)) {
    if (!/\/(app|music|card|scene2d|scene|account)\.js$/.test(m[1])) vm.runInContext(fs.readFileSync(path.join(root, m[1]), 'utf8'), c, { filename: m[1] });
  }
  return c.G.E;
}
module.exports = { game };
if (require.main === module) {
const cases = [
  ...Array.from({ length: 6 }, (_, i) => ({ mode: 'vn', variant: i % 2 ? '63' : '34', seed: 78100 + i, year: 2026 })),
  ...['US', 'JP', 'IN', 'NG', 'DE', 'BR'].map((country, i) => ({ mode: 'world', country, seed: 78200 + i, year: 2026 }))
];
const E = game(), results = cases.map(opts => {
  const l = E.createLife(opts); E.runHeadless(l); const state = Object.assign({}, l); delete state.v;
  return { opts, hash: crypto.createHash('sha256').update(JSON.stringify(state)).digest('hex'), age: l.age, money: l.money, logs: l.log.length };
});
if (process.argv.includes('--capture')) {
  assert(!fs.existsSync(fixture), 'Do not overwrite the v7.6.0 baseline');
  fs.writeFileSync(fixture, JSON.stringify({ version: '7.6.0', capturedBeforeRedesign: true, results }, null, 2) + '\n');
  console.log('Captured ' + results.length + ' complete normal-mode states before changes.');
} else {
  const expected = JSON.parse(fs.readFileSync(fixture, 'utf8'));
  results.forEach((r, i) => assert.deepStrictEqual(r, expected.results[i], 'Normal mode changed: ' + JSON.stringify(r.opts)));
  console.log('PASS: all ' + results.length + ' complete normal-mode states match the v7.6.0 baseline byte for byte (excluding release version).');
}
}
