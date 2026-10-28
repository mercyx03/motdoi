'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, profiles = E.CULTURE173.DEPTH.profiles; let checks = 0;
const ok = (v, m) => { assert(v, m); checks++; }, clone = x => JSON.parse(JSON.stringify(x));
function life(cc, age = 24) {
  const l = E.createLife({ mode: 'world', country: cc, seed: 894, year: 2026 - age });
  Object.assign(l, { age, alive: true, school: null, indep: true, pending: [], money: l.base * 20, jailUntil: null });
  l.id = 'minimum-content-' + cc; l.flags.military = 0; return l;
}
function actorLife(e) {
  const l = life(e.countryCode, e.kind === 'education' ? 16 : 24);
  if (e.kind === 'education') l.school = 'upper';
  if (e.kind === 'work') l.job = { id: 'ke_toan', since: l.age - 1, rank: 0, yrs: 1, rep: 50 };
  if (e.kind === 'marriage') l.partner = { name: 'Người yêu hư cấu', sex: l.sex === 'M' ? 'F' : 'M', age: 24, since: 20, alive: true, status: 'dating', affection108: 65 };
  return l;
}
function choose(l, id, key, random = 0) {
  const d = E.DEC[id].make(l, () => random), index = d.data.keys.indexOf(key);
  ok(index >= 0, id + ': option ' + key); E.DEC[id].apply(l, d, String(index), () => random, () => {}); return d;
}
const titles = new Set(), ids = new Set();
{
  const l = life('VN', 19); l.sex = 'M'; l.partner = { name: 'Bạn gái', sex: 'F', age: 18, since: 17, alive: true, status: 'dating' };
  ok(!E.DEC.marry.valid(l) && E.DEC.marry.make(l).opts.every(o => o.k === 'wait'), 'VN male 19 cannot register');
  const d = E.DEC.marry.make(l); E.DEC.marry.apply(l, d, 'marry', () => .5, () => {}); ok(l.partner.status === 'dating', 'old pending marriage cannot bypass age');
  l.age = 20; ok(E.DEC.marry.valid(l), 'VN age 20/18 eligible for existing marriage path');
}
for (const [cc, p] of Object.entries(profiles)) {
  for (const [field, n] of Object.entries({ education: 3, festivals: 3, marriage: 3, cuisine: 5, labor: 5, lifeEvents: 5 })) {
    const a = field === 'cuisine' ? p.cuisine.dishes : p[field]; ok(a.length >= n, cc + ':' + field + ' minimum');
    ok(new Set(a.map(x => typeof x === 'string' ? x : x.id)).size === a.length, cc + ':' + field + ' unique IDs');
  }
  ok(p.metadata.referenceYear === 2026 && p.metadata.legalFrom === 2026, cc + ' dated legal reference');
  for (const f of p.festivals) ok(E.cultureProfile173(cc).holidays.includes(f.id) && !!E.CULTURE173.HOL[f.id], cc + ' festival gameplay integration');
  for (const e of p.lifeEvents) {
    ok(!titles.has(e.title) && !ids.has(e.id), 'distinct scenario ' + e.id); titles.add(e.title); ids.add(e.id);
    ok(/^https:\/\//.test(E.COUNTRY_DEPTH_DATA.sources[e.source]), e.id + ' real source key');
    let l = actorLife(e); const id = e.eventId;
    ok(E.DEC[id].valid(l), id + ' starts in valid context');
    let d = E.DEC[id].make(l, () => 0), first = d.data.keys[0];
    choose(l, id, first);
    let q = l.flags.culture173.cases[e.id];
    ok(q.status === 'active' && q.progress === 0 && q.due === l.age + 1, id + ' requires later years');
    ok(!E.DEC[id].valid(l), id + ' no repeated action same year');
    const actor = q.actor, partner = q.partner, edu = l.edu, job = l.job && l.job.id;
    l = E.migrate(clone(l)); q = l.flags.culture173.cases[e.id];
    ok(q.actor === actor && q.partner === partner, id + ' identity after reload');
    l.age++; if (l.partner) l.partner.age++;
    choose(l, id, 'review', .999); q = l.flags.culture173.cases[e.id];
    ok(q.status === 'active' && q.progress === 0, id + ' failure persists for retry');
    l.age++; if (l.partner) l.partner.age++;
    choose(l, id, 'review', 0); q = l.flags.culture173.cases[e.id];
    ok(q.progress === 1 && q.status === 'active', id + ' first follow-up is not instant completion');
    l.age++; if (l.partner) l.partner.age++;
    choose(l, id, 'review', 0); q = l.flags.culture173.cases[e.id];
    ok(q.progress === 2 && q.status === 'complete', id + ' two successful follow-ups');
    ok(l.edu === edu && (!l.job || l.job.id === job), id + ' no fake diploma or forced job');
    if (e.kind === 'marriage') ok(l.partner.status === 'dating' && l.partner.affection108 > 65, id + ' real bond effect, no automatic marriage');
    if (e.kind === 'work') ok(l.job.rep > 50, id + ' real career reputation effect');
    if (e.kind === 'safety') { l.age = q.preparedUntil + 1; ok(E.DEC[id].valid(l), id + ' preparation can expire and be renewed'); }
    const stale = actorLife(e), card = E.DEC[id].make(stale, () => 0), money = stale.money; stale.abroad = { code: cc === 'US' ? 'JP' : 'US', perm: true };
    E.DEC[id].apply(stale, card, '0', () => 0, () => {});
    ok(stale.money === money && !(stale.flags.culture173 && stale.flags.culture173.cases && stale.flags.culture173.cases[e.id]), id + ' move blocks stale effects');
    const past = actorLife(e); past.birthYear -= 10; ok(!E.DEC[id].valid(past), id + ' no 2026 policy in past');
  }
  const working = life(cc); working.job = { id: 'ke_toan', since: 20, rank: 0, yrs: 4 };
  choose(working, 'countryLabor173', p.labor[0].id);
  ok(!E.DEC.countryLabor173.make(working, () => 0).opts.some(o => o.k === '0'), cc + ' one policy review per year');
  for (let n = 1; n < p.labor.length; n++) { working.age++; choose(working, 'countryLabor173', p.labor[n].id); }
  ok(Object.keys(working.flags.culture173.laborReviewed[cc]).length >= 5, cc + ' all five labor mechanisms reachable');
  let arrivals = 0;
  for (let n = 0; n < 24; n++) { const l = life(cc); l.id = 'minimum-auto-' + n; E.beginYear(l, { auto: false }); let guard = 0; while (l.alive && l.pending.length && guard++ < 96) E.resolve(l, E.autoKey(l)); E.finishYear(l); if (l.pending.some(d => /^country_/.test(d.id))) arrivals++; }
  ok(arrivals > 0, cc + ' stories reached via real annual pipeline');
}
for (const c of G.W.C) {
  const l = life(c.code);
  for (const e of Object.values(E.CULTURE173.CASES)) {
    const d = E.DEC[e.eventId].make(l, () => .5);
    if (e.countryCode !== c.code) ok(!E.DEC[e.eventId].valid(l) && d.data.keys.length === 0, e.id + ' isolated from ' + c.code);
    ok(!/undefined|\[object Object\]|\uFFFD/.test(d.text), e.id + ' clean text ' + c.code);
  }
  for (const id of ['countryStories173', 'countryLabor173']) E.DEC[id].make(l, () => .5);
}
// A changing relationship cannot lend the old partner's progress to a new person.
{
  const e = profiles.IE.lifeEvents.find(e => e.kind === 'marriage'), l = actorLife(e);
  choose(l, e.eventId, profiles.IE.marriage[0].id); const old = l.partner.uid110;
  l.partner = Object.assign({}, l.partner, { name: 'Người mới', uid110: 'new-partner' }); l.age++;
  ok(!E.DEC[e.eventId].valid(l), 'new partner does not inherit old plan');
  E.beginYear(l, {}); let guard = 0; while (l.pending.length && guard++ < 96) E.resolve(l, E.autoKey(l)); E.finishYear(l);
  ok(l.flags.culture173.cases[e.id].status === 'interrupted' && l.flags.culture173.cases[e.id].partner === old, 'old plan closed with identity retained');
}
// The real decision pipeline prunes stale cards before the UI can show the next one.
{
  const e = profiles.FI.lifeEvents.find(e => e.kind === 'community'), l = actorLife(e), card = E.DEC[e.eventId].make(l, () => 0);
  E.SC('test_country_move894', { opts: [{ k: 'move', l: 'Chuyển nơi ở', run(l) { l.abroad = { code: 'US', perm: true }; } }] });
  l.pending = [E.DEC.test_country_move894.make(l, () => 0), card]; E.resolve(l, 'move');
  ok(!l.pending.some(d => d.id === e.eventId), 'resolve/prune removes the old country story before next card');
  l.pending = [card]; E.migrateExt(l); ok(!l.pending.length, 'reload removes stale country story before UI');
}
console.log('PASS country minimum content: ' + checks + ' checks; ' + Object.keys(profiles).length + ' researched profiles / ' + ids.size + ' distinct multi-year stories; isolation across all 195 countries.');
