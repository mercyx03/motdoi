/* §14 (8.10.17): quét bất biến liên hệ thống trên nhiều đời, nhiều nước và nhiều thế hệ.
   Mỗi bất biến là một lỗi có thể tái hiện nếu hỏng; số đời/seed cố định để chạy lại được. */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E;
let count = 0; const fails = [];
const ok = (x, m) => { count++; if (!x) fails.push(m); };
const bad = s => typeof s !== 'string' || /undefined|NaN|\[object|Infinity/.test(s);
function finiteDeep(o, path, seen = new Set()) {
  if (o == null || typeof o !== 'object' || seen.has(o)) return null; seen.add(o);
  for (const k of Object.keys(o)) { const v = o[k]; if (typeof v === 'number' && !Number.isFinite(v)) return path + '.' + k; const r = finiteDeep(v, path + '.' + k, seen); if (r) return r; }
  return null;
}
function check(l, tag) {
  ok(!l.alive && l.death, tag + ': life ended');
  ok(Number.isFinite(l.money) && Number.isFinite(l.houseVal || 0), tag + ': money finite');
  for (const k of ['hea', 'hap', 'kno', 'soc']) ok(Number.isFinite(l.st[k]) && l.st[k] >= 0 && l.st[k] <= 100, tag + ': stat ' + k);
  const nf = finiteDeep(l.flags, 'flags'); ok(!nf, tag + ': no NaN/Infinity in flags (' + nf + ')');
  const lb = l.log.find(e => bad(e.t)); ok(!lb, tag + ': clean log — ' + (lb && lb.t));
  ok(l.pending.length === 0, tag + ': no dangling decision');
  const di = l.log.findIndex(e => e.k === 'death'); ok(di === l.log.length - 1, tag + ': nothing after death');
  const kids = l.kids || [];
  const uids = kids.map(k => k.uid110).filter(Boolean); ok(new Set(uids).size === uids.length, tag + ': unique child ids');
  kids.forEach(k => { ok(k.born <= l.death.age, tag + ': child ' + k.name + ' not born after death'); ok(!(k.died != null && k.died < k.born), tag + ': child death after birth'); });
  (l.sibList || []).forEach(s => { const sa = l.death.age - s.born; if (s.alive && sa >= 23) ok(s.job !== 'đang đi học', tag + ': adult sibling ' + s.n + ' (' + sa + ') still "in school"'); ok(s.sex === 'M' || s.sex === 'F', tag + ': sibling sex set'); });
  if (l.partner) ok(l.partner.age == null || l.partner.age >= 16 || l.partner.alive === false, tag + ': partner adult');
  const ppl = E.LIFE138 && l.flags.life138 && l.flags.life138.people ? Object.keys(l.flags.life138.people) : []; ok(new Set(ppl).size === ppl.length, tag + ': unique NPC ids');
  const o = l.flags.organ917; if (o && o.kidney) ok(o.kidney.egfr > 0 && /^G[1-5]|^G3[ab]$/.test(o.kidney.stage), tag + ': kidney record valid');
  const c = l.flags.crime912; if (c && c.group && c.group.crisis) ok(c.group.crisis.stage === 1 || c.group.crisis.stage === 2, tag + ': crisis stage valid');
  if (l.jailUntil != null && l.alive) ok(!l.job || !E.isCrime(l), tag + ': not working crime job while imprisoned');
}
// 1. Nhiều đời VN và quốc tế (mỗi vùng vài nước), chơi tự động tới cuối đời.
const countries = ['VN', 'US', 'JP', 'NG', 'BR', 'DE', 'IN', 'EG', 'FJ', 'MX', 'SE', 'KE', 'TH', 'PE', 'SA', 'VA'];
let n = 0;
const LIVES = +process.env.INTEGRITY_N || 160, SEED0 = +process.env.INTEGRITY_SEED || 917100;
for (let i = 0; i < LIVES; i++) {
  const cc = countries[i % countries.length];
  const l = cc === 'VN' ? E.createLife({ mode: 'vn', seed: SEED0 + i }) : E.createLife({ mode: 'world', country: cc, seed: SEED0 + i });
  E.runHeadless(l); check(l, cc + '#' + i); n++;
}
// 2. Bốn thế hệ nối tiếp: hồ sơ anh chị em, tiền, NPC nhất quán; lưu/tải hai lần không đổi.
for (let s = 0; s < 12; s++) {
  let l = E.createLife({ mode: 'vn', seed: 917500 + s * 31 }); E.runHeadless(l); check(l, 'gen1#' + s);
  for (let g = 2; g <= 4; g++) {
    const kids = (l.kids || []).filter(k => k.alive !== false && l.death.age - k.born >= 0); if (!kids.length) break;
    const k = kids[0], c = E.createLife(E.childOpts(l, k)); E.runHeadless(c); check(c, 'gen' + g + '#' + s);
    const a = E.migrate(JSON.parse(JSON.stringify(c))); E.migrateExt(a); const b = E.migrate(JSON.parse(JSON.stringify(a))); E.migrateExt(b);
    ok(JSON.stringify(a) === JSON.stringify(b), 'gen' + g + '#' + s + ': migration idempotent on deep save');
    ok(c.gen === (l.gen || 1) + 1, 'gen' + g + '#' + s + ': generation counter');
    l = c;
  }
}
console.log('integrity917: ' + count + ' checks over ' + n + ' lives + multi-generation chains; failures: ' + fails.length);
if (fails.length) { const by = {}; fails.forEach(f => { const k = f.replace(/^[^:]+: /, '').replace(/ — .*/, '').replace(/\(.*\)/, '()').replace(/sibling .* \(\d+\)/, 'sibling ()').replace(/child .* not/, 'child not'); (by[k] = by[k] || []).push(f); }); Object.keys(by).forEach(k => console.log(' ✗ ' + k + ' ×' + by[k].length + ' e.g. ' + by[k][0])); process.exitCode = 1; }
else console.log('PASS integrity917');
