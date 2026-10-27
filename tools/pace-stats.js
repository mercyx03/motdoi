/* GĐ5 — đo nhịp sự kiện (chỉ đọc, không đổi game). Dùng để so trước / sau một thay đổi về tần suất.
   node tools/pace-stats.js [--lives 200] [--root <thư mục dự án khác>] [--json]
   --root: đo một bản mã khác (ví dụ trích từ git archive); bộ phân loại mức độ lấy từ public/js/life145.js của bản hiện tại. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const arg = k => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const N = +(arg('--lives') || 200), ROOT = path.resolve(arg('--root') || path.join(__dirname, '..')), HERE = path.join(__dirname, '..');

function load() {
  let seed = 78123; const math = Object.create(Math); math.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  let now = Date.UTC(2026, 9, 1); class Clock extends Date { constructor(...a) { super(...(a.length ? a : [now += 1000])); } static now() { return now += 1000; } }
  const c = { console, Math: math, Date: Clock, JSON, Buffer, TextEncoder, TextDecoder }; c.globalThis = c; vm.createContext(c);
  const pub = path.join(ROOT, 'public');
  const mods = [...fs.readFileSync(path.join(pub, 'index.html'), 'utf8').matchAll(/<script src="(js\/[^"?]+)/g)].map(m => m[1]).filter(f => !/\/(app|music|card|scene2d|scene|account)\.js$/.test(f));
  for (const f of mods) vm.runInContext(fs.readFileSync(path.join(pub, f), 'utf8'), c, { filename: f });
  if (!c.G.E.PACE145) { c.G.PACE145_MEASURE_ONLY = true; vm.runInContext(fs.readFileSync(path.join(HERE, 'public/js/life145.js'), 'utf8'), c, { filename: 'life145.js' }); }
  return c.G;
}
const G = load(), E = G.E, P = E.PACE145;
const marriage130 = /^(marriage\w+130|familyObjection130)$/;
const stat = { lives: N, years: 0, decisions: 0, tiers: { daily: 0, major: 0, shock: 0 }, yearsByCount: {}, shockYears: { 2: 0, 3: 0 }, shock3in3: 0,
  sameIdRepeats: 0, nearDup: 0, logRepeats: 0, flavorRepeats: 0, distinctPerLife: 0, marriage130: 0, chain144: 0, ms: 0 };
let cur = null; const rep3 = {}, busy = {};
Object.keys(E.DEC).forEach(id => { const D = E.DEC[id], ap = D.apply; D.apply = function (l, d) {
  if (cur === l && d) { const t = P.tier(d), y = l._p || (l._p = {}); stat.decisions++; stat.tiers[t]++; const row = y[l.age] || (y[l.age] = { n: 0, s: 0, ids: [] }); row.n++; if (t === 'shock') row.s++; row.ids.push([d.id, P.sig(d)]);
    if (marriage130.test(d.id)) stat.marriage130++; if (/^ch144_/.test(d.id)) stat.chain144++; }
  return ap.apply(this, arguments); }; });
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  const l = E.createLife({ mode: i % 3 ? 'vn' : 'world', seed: 880000 + i * 13, difficulty: i % 10 === 9 ? 'hardcore' : 'normal' });
  cur = l; E.runHeadless(l); cur = null;
  const y = l._p || {}; delete l._p; stat.years += l.age + 1;
  const ids = {}, recent = [];
  for (let a = 0; a <= l.age; a++) {
    const row = y[a] || { n: 0, s: 0, ids: [] };
    stat.yearsByCount[row.n > 4 ? '5+' : row.n] = (stat.yearsByCount[row.n > 4 ? '5+' : row.n] || 0) + 1;
    if (row.s >= 2) stat.shockYears[2]++; if (row.s >= 3) stat.shockYears[3]++;
    if (row.s + ((y[a - 1] || {}).s || 0) + ((y[a - 2] || {}).s || 0) >= 3) stat.shock3in3++;
    row.ids.forEach(([id, s]) => {
      ids[id] = (ids[id] || 0) + 1;
      if (recent.some(r => r.a >= a - 3 && r.id !== id && P.similar(r.s, s) >= 0.75)) stat.nearDup++;
      recent.push({ a, id, s });
    });
  }
  stat.distinctPerLife += Object.keys(ids).length;
  stat.sameIdRepeats += Object.values(ids).filter(n => n >= 3).length;
  for (const id in ids) if (ids[id] >= 3) rep3[id] = (rep3[id] || 0) + 1;
  for (let a = 0; a <= l.age; a++) { const row = y[a]; if (row && row.n >= 5) row.ids.forEach(([id]) => { busy[id] = (busy[id] || 0) + 1; }); }
  const seen = {}; l.log.forEach(e => { const k = e.t.replace(/[0-9][0-9.,]*/g, '#'); seen[k] = (seen[k] || 0) + 1; if (seen[k] > 1) { stat.logRepeats++; if (e.k !== 'money' && e.k !== 'big' && e.k !== 'bad' && e.k !== 'death') stat.flavorRepeats++; } });
}
stat.ms = Date.now() - t0;
const per = (x, d) => +(x / d).toFixed(3);
const out = { root: ROOT, lives: N, years: stat.years, decisionsPerYear: per(stat.decisions, stat.years), tierShare: { daily: per(stat.tiers.daily, stat.decisions), major: per(stat.tiers.major, stat.decisions), shock: per(stat.tiers.shock, stat.decisions) },
  yearsByDecisionCount: stat.yearsByCount, yearsWith2PlusShocks: per(stat.shockYears[2], stat.years), yearsWith3PlusShocks: per(stat.shockYears[3], stat.years), windows3yWith3PlusShocks: per(stat.shock3in3, stat.years),
  idsRepeated3PlusPerLife: per(stat.sameIdRepeats, N), nearDuplicatePerLife: per(stat.nearDup, N), distinctDecisionsPerLife: per(stat.distinctPerLife, N),
  logRepeatsPerLife: per(stat.logRepeats, N), flavorLogRepeatsPerLife: per(stat.flavorRepeats, N), marriage130Scenes: stat.marriage130, chain144Decisions: stat.chain144, msPerYear: per(stat.ms, stat.years) };
if (process.argv.includes('--detail')) out.detail = { repeated3: Object.entries(rep3).sort((a, b) => b[1] - a[1]).slice(0, 30), busyYears: Object.entries(busy).sort((a, b) => b[1] - a[1]).slice(0, 30) };
console.log(JSON.stringify(out, null, process.argv.includes('--json') ? 0 : 1));
