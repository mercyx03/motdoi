'use strict';
const assert = require('assert'), { game } = require('./hardcore-isolation.js');
const E = game(), copy = x => JSON.parse(JSON.stringify(x)); let checks = 0;
function ok(value, message) { checks++; assert(value, message); }
function fresh(seed = 79001) { return E.createLife({ mode: 'vn', difficulty: 'hardcore', year: 2026, seed, noOrphan: true }); }
function rnd(seed) { let x = seed; return () => { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; return x / 4294967296; }; }
ok(E.HARDCORE_CATALOG.length >= 90 && new Set(E.HARDCORE_EVENTS).size === E.HARDCORE_EVENTS.length, 'large dedicated catalog with unique IDs');
for (const meta of E.HARDCORE_CATALOG) {
  for (const broke of [false, true]) {
    const l = fresh(); l.age = Math.floor((meta.min + Math.min(meta.max, 80)) / 2); l.indep = l.age >= 18; l.money = broke ? 0 : l.base * 20;
    l.school = meta.need === 'school' ? (l.age < 11 ? 'primary' : l.age < 15 ? 'lower' : 'upper') : null;
    if (meta.need === 'job') E.startJob(l, 'ke_toan', rnd(2), () => {}, true);
    if (broke) E.hardcoreState(l).supportAt = l.age;
    ok(E.DEC[meta.id].valid(l, {}), meta.id + ' fixture valid');
    const d = E.DEC[meta.id].make(l, rnd(3)); ok(meta.max < 3 ? d.opts.length === 0 : d.opts.length >= 1, meta.id + ' infancy observes; later childhood always has an affordable option');
    ok(!/undefined|NaN|\[object/.test(JSON.stringify(d)), meta.id + ' readable decision');
    for (const option of d.opts) {
      const x = copy(l); x.pending = [copy(d)]; const before = x.money;
      E.resolve(x, option.k);
      ok(isFinite(x.money) && Object.values(x.st).every(Number.isFinite), meta.id + '/' + option.k + ' finite outcome');
      const h = E.hardcoreState(x); ok(h.emotion >= 0 && h.emotion <= 100 && h.trauma >= 0 && h.trauma <= 100, 'bounded emotions / trauma');
      if (x.age < 18) ok(x.money === before, 'children use family reserves, never personal debt');
    }
    const normal = copy(l); normal.difficulty = 'normal'; ok(!E.DEC[meta.id].valid(normal, {}), 'private story never applies to normal mode');
  }
}
let early = 0, aliveAtSix = 0;
for (let i = 0; i < 16; i++) {
  const l = fresh(79100 + i);
  while (l.alive && l.age < 6) {
    E.beginYear(l, { auto: true });
    ok(l.age < 3 ? l.pending.length === 0 : l.pending.length >= 2, 'infants observe; toddlers choose their own actions, seed ' + i + ' age ' + l.age);
    ok(l.pending.every(d => /^hc_/.test(d.id)), 'no ordinary opening celebrations or toddler story pool'); early += l.pending.length;
    let guard = 0; while (l.alive && l.pending.length && guard++ < 30) E.resolve(l, E.autoKey(l));
    if (l.alive) E.finishYear(l); guard = 0; while (l.alive && l.pending.length && guard++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l);
  }
  if (l.alive) aliveAtSix++;
}
ok(aliveAtSix >= 12, 'hard childhood is not scripted unavoidable infant death');
const harmed = fresh(), supported = copy(harmed); harmed.age = supported.age = 12;
Object.assign(E.hardcoreState(harmed), { pressure: 75, trauma: 85, emotion: 18, support: 0 });
Object.assign(E.hardcoreState(supported), { pressure: 25, trauma: 8, emotion: 60, support: 4 });
harmed.mind.stress = supported.mind.stress = 20;
for (let a = 12; a <= 18; a++) { harmed.age = supported.age = a; E.hardcoreYear(harmed, () => 1, () => {}, a); E.hardcoreYear(supported, () => 1, () => {}, a); }
ok(harmed.mind.stress > supported.mind.stress && E.hardcoreState(harmed).emotion < E.hardcoreState(supported).emotion, 'upbringing persists into adult stress and emotion');
ok(harmed.st.hap < supported.st.hap, 'emotion has visible happiness impact');
harmed.st.kno = supported.st.kno = 70;
ok(E.rollExamScore(harmed, rnd(5)) < E.rollExamScore(supported, rnd(5)), 'trauma and lack of support affect examination prospects');
const poor = fresh(); poor.age = 27; poor.school = null; poor.indep = true; poor.money = -poor.base; E.startJob(poor, 'ke_toan', rnd(1), () => {}, true);
let d = E.DEC.hc_story_mang_luoi.make(poor, rnd(8)); ok(d.opts.some(x => x.k === 'c0'), 'free support remains available when broke');
poor.pending = [d]; E.resolve(poor, 'c0'); const healed = E.hardcoreState(poor).emotion;
d = E.DEC.hc_story_mang_luoi.make(poor, rnd(8)); ok(!d.opts.some(x => x.k === 'c0'), 'support cannot be farmed repeatedly in the same year');
ok(healed > 0, 'recovery remains possible');
const chain = fresh(); chain.age = 8; chain.school = 'primary';
E.hardcoreFollowup(chain, 'nha_am', 'patch'); ok(chain.sched.some(x => x.id === 'hc_chain_cho_o_1' && x.at === 9), 'a temporary response has a next-year consequence');
chain.age = 9; chain.pending = [E.DEC.hc_chain_cho_o_1.make(chain, rnd(2))]; E.resolve(chain, 'tung_buoc');
ok(chain.sched.some(x => x.id === 'hc_chain_cho_o_2' && x.at === 11), 'chain continues across years');
chain.age = 11; chain.pending = [E.DEC.hc_chain_cho_o_2.make(chain, rnd(2))]; E.resolve(chain, 'tung_buoc'); ok(E.hardcoreState(chain).chains.cho_o === 0, 'chain can be resolved without infinite debt');
for (const type of ['mil', 'jail', 'trapped']) {
  const l = fresh(); l.age = 24; l.school = null; l.indep = true;
  if (type === 'mil') l.flags.military = 26; else if (type === 'jail') l.jailUntil = 26; else l.abroad = { code: 'KH', name: 'Campuchia', trapped: true, until: 30 };
  ok(E.hardcoreTriggers(l, l.age).length === 0, 'civilian catalog suppressed in restricted setting');
  const row = E.HARDCORE_ROLES.find(x => x.role === type); ok(E.DEC[row.id].valid(l, {}), 'context-specific hardship available');
  const q = E.DEC[row.id].make(l, rnd(7)); for (const o of q.opts) { const x = copy(l); x.pending = [copy(q)]; E.resolve(x, o.k); ok(isFinite(x.money), 'restricted-setting choice resolves'); }
}
const chance = fresh(); chance.age = 30; chance.school = null; chance.indep = true; E.startJob(chance, 'ke_toan', rnd(1), () => {}, true);
Object.assign(E.hardcoreState(chance), { breakthroughRoll: 0.03, training: 5, emotion: 50, trauma: 20 });
const ordinaryChance = copy(chance); E.hardcoreState(ordinaryChance).breakthroughRoll = 0.8;
E.hardcoreYear(chance, () => 0, () => {}, 30); E.hardcoreYear(ordinaryChance, () => 0, () => {}, 30);
ok(chance.sched.some(x => x.id === 'hc_buoc_ngoat') && !ordinaryChance.sched.some(x => x.id === 'hc_buoc_ngoat'), 'rare upward opportunity needs both preparation and a rare opening');
chance.age = 31; chance.pending = [E.DEC.hc_buoc_ngoat.make(chance, rnd(3))]; E.resolve(chance, 'thu');
ok(E.hardcoreState(chance).breakthrough && E.hardcoreState(chance).boostUntil === 36, 'upward opening improves earned income, no instant fortune');
console.log('PASS: ' + checks + ' campaign checks; ' + E.HARDCORE_CATALOG.length + ' age-specific stories, ' + early + ' bespoke opening decisions.');
