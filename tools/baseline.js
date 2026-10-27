/* Đo chỉ số nền (baseline) của gameplay để so sánh trước / sau mỗi giai đoạn nâng cấp. Chỉ đọc, không đổi game.
   Chạy:  node tools/baseline.js                    → in chỉ số (mặc định 120 đời)
          node tools/baseline.js --lives 300        → nhiều mẫu hơn
          node tools/baseline.js --save             → ghi tests/fixtures/baseline.json
          node tools/baseline.js --compare          → so với tests/fixtures/baseline.json (chỉ báo chênh lệch, không chặn)
   Dùng đồng hồ kiểm thử cố định của tests/lib/quick.js nên cùng mã nguồn cho cùng kết quả. */
'use strict';
const fs = require('fs'), path = require('path');
const { loadGame, settle, ROOT } = require('../tests/lib/quick');
const FILE = path.join(ROOT, 'tests', 'fixtures', 'baseline.json');
const arg = k => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const N = Math.max(10, +(arg('--lives') || 120));

function measure() {
  const G = loadGame(), E = G.E, t0 = Date.now();
  const trigIds = {}; E.TRIG.forEach(t => { trigIds[t.id] = (trigIds[t.id] || 0) + 1; });
  const m = {
    version: G.VERSION, lives: N,
    registry: { DEC: Object.keys(E.DEC).length, TRIG: E.TRIG.length, ACT: E.ACT.length, EVENTS: E.EVENTS.length, hooksYear: E.HOOKS.year.length,
      trigConstP: E.TRIG.filter(t => typeof t.p !== 'function').length, trigDuplicateIds: Object.keys(trigIds).filter(k => trigIds[k] > 1) }
  };
  const ages = [], sizes = [], logLens = [], people = [], flagKB = {}, tone = {}, dec = {}, queued = {};
  let years = 0, begin = 0, fin = 0, finMax = 0, reach50 = 0, withKid = 0, kids = 0, partnered = 0, uni25 = 0, n25 = 0, repeats = 0, jobYears = 0, debtYears = 0;
  for (let i = 0; i < N; i++) {
    const l = E.createLife({ mode: i % 3 ? 'vn' : 'world', seed: 880000 + i * 13, difficulty: i % 10 === 9 ? 'hardcore' : 'normal' });
    let g = 0, everPartner = false;
    while (l.alive && g++ < 130) {
      E.beginYear(l, { auto: true }); begin += l.pending.length; l.pending.forEach(d => { dec[d.id] = (dec[d.id] || 0) + 1; });
      settle(E, l);
      if (l.alive) E.finishYear(l);
      fin += l.pending.length; finMax = Math.max(finMax, l.pending.length); l.pending.forEach(d => { queued[d.id] = (queued[d.id] || 0) + 1; dec[d.id] = (dec[d.id] || 0) + 1; });
      settle(E, l); E.endYear(l); years++;
      if (l.partner) everPartner = true; if (l.job) jobYears++; if ((l.loans || []).some(x => x.bal > 0.5)) debtYears++;
    }
    ages.push(l.death ? l.death.age : l.age);
    const raw = JSON.stringify(l); sizes.push(raw.length); logLens.push(l.log.length);
    for (const k in l.flags) flagKB[k] = (flagKB[k] || 0) + JSON.stringify(l.flags[k] == null ? 0 : l.flags[k]).length;
    if (l.flags.life138) people.push(Object.keys(l.flags.life138.people || {}).length);
    l.log.forEach(e => { tone[e.k || '-'] = (tone[e.k || '-'] || 0) + 1; });
    const seen = {}; l.log.forEach(e => { seen[e.t] = (seen[e.t] || 0) + 1; }); repeats += Object.values(seen).filter(n => n > 1).length;
    if ((l.death ? l.death.age : l.age) >= 50) { reach50++; if (l.kids.length) withKid++; kids += l.kids.length; if (everPartner) partnered++; }
    if ((l.death ? l.death.age : l.age) >= 25 && l.mode === 'vn') { n25++; if (l.edu >= 5) uni25++; }
  }
  const avg = a => a.length ? +(a.reduce((s, x) => s + x, 0) / a.length).toFixed(2) : 0, med = a => { const b = a.slice().sort((x, y) => x - y); return b[b.length >> 1] || 0; };
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => ({ id: k, perLife: +(v / N).toFixed(2) }));
  m.life = { avgDeathAge: avg(ages), reach50Pct: +(100 * reach50 / N).toFixed(1), withChildPctOf50: reach50 ? +(100 * withKid / reach50).toFixed(1) : 0, avgKidsOf50: reach50 ? +(kids / reach50).toFixed(2) : 0,
    everPartnerPctOf50: reach50 ? +(100 * partnered / reach50).toFixed(1) : 0, uniDegreePctVN25: n25 ? +(100 * uni25 / n25).toFixed(1) : 0, jobYearPct: +(100 * jobYears / years).toFixed(1), debtYearPct: +(100 * debtYears / years).toFixed(1) };
  m.events = { decisionsPerYearBegin: +(begin / years).toFixed(2), decisionsPerYearFinish: +(fin / years).toFixed(2), finishQueueMax: finMax,
    topDecisions: top(dec, 15), topFinishQueued: top(queued, 10), repeatedLogTextsPerLife: +(repeats / N).toFixed(1) };
  const toneTotal = (tone.good || 0) + (tone.bad || 0) + (tone.neutral || 0);
  m.tone = { good: tone.good || 0, bad: tone.bad || 0, neutral: tone.neutral || 0, big: tone.big || 0, money: tone.money || 0, goodToBad: tone.bad ? +((tone.good || 0) / tone.bad).toFixed(2) : null, badPct: toneTotal ? +(100 * (tone.bad || 0) / toneTotal).toFixed(1) : 0 };
  m.save = { medianKB: +(med(sizes) / 1024).toFixed(1), maxKB: +(Math.max(...sizes) / 1024).toFixed(1), medianLog: med(logLens), maxLog: Math.max(...logLens),
    life138PeopleAvg: avg(people), life138PeopleMax: people.length ? Math.max(...people) : 0,
    topFlagNamespacesKB: Object.entries(flagKB).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => ({ ns: k, avgKB: +(v / N / 1024).toFixed(2) })) };
  m.seconds = +((Date.now() - t0) / 1000).toFixed(1);
  return m;
}
function flat(o, p, out) { for (const k in o) { const v = o[k], q = p ? p + '.' + k : k; if (typeof v === 'number') out[q] = v; else if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, q, out); } return out; }

if (require.main === module) {
  const m = measure();
  if (process.argv.includes('--save')) { fs.writeFileSync(FILE, JSON.stringify(m, null, 2) + '\n'); console.log('Đã ghi ' + path.relative(ROOT, FILE)); }
  if (process.argv.includes('--compare')) {
    if (!fs.existsSync(FILE)) { console.log('Chưa có ' + path.relative(ROOT, FILE) + ' — chạy với --save trước.'); process.exitCode = 1; }
    else {
      const b = JSON.parse(fs.readFileSync(FILE, 'utf8')), A = flat(b, '', {}), B = flat(m, '', {});
      if (b.lives !== m.lives) console.log('⚠ số đời khác nhau (' + b.lives + ' / ' + m.lives + '): so sánh chỉ mang tính tham khảo');
      console.log('So với baseline v' + b.version + ' (' + b.lives + ' đời):');
      Object.keys(B).filter(k => k !== 'seconds' && k !== 'lives').forEach(k => { const x = A[k], y = B[k]; if (x === undefined) return console.log('  + ' + k + ' = ' + y); const d = x ? (y - x) / Math.abs(x) * 100 : (y ? 100 : 0); console.log((Math.abs(d) >= 10 ? '  ⚠ ' : '    ') + k.padEnd(36) + String(x).padStart(10) + ' → ' + String(y).padStart(10) + (d ? ' (' + (d > 0 ? '+' : '') + d.toFixed(1) + '%)' : '')); });
    }
  } else if (!process.argv.includes('--save')) console.log(JSON.stringify(m, null, 2));
}
module.exports = { measure };
