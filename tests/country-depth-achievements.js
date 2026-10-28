'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E; let checks = 0;
const ok = (x, m) => { assert(x, m); checks++; };
const copy = x => JSON.parse(JSON.stringify(x));
function life(cc, age = 20) { const l = E.createLife({ mode: 'world', country: cc, seed: 195, year: 2006 }); Object.assign(l, { age, alive: true, school: null, indep: true, pending: [], jailUntil: null, money: l.base * 100 }); l.flags.life138.ancestry = [cc]; l.id = 'country-depth-fixed'; return l; }
function got(l, id) { return E.achievementsOf(l).some(a => a.id === id); }
function act(l, id, key, random = .1, arg) { const d = E.DEC[id].make(l, () => random, arg); const i = d.data.keys.indexOf(key); ok(i >= 0, id + ':' + key + ' available'); E.DEC[id].apply(l, d, String(i), () => random, () => {}); return d; }
const all = E.ACHIEVEMENTS.map(a => a.id);
ok(new Set(all).size === all.length, 'achievement IDs unique');
for (const c of G.W.C) {
  ok(/^[A-Z]{2}$/.test(c.code), c.code + ' ISO key');
  const l = life(c.code), p = E.cultureProfile173(c.code);
  ok(p.code === c.code && !!p.region, c.code + ' resolves');
  ok(!E.achievementsOf(l).some(a => /^(culture173_|football_)/.test(a.id)), c.code + ' no unearned achievement');
  const forged = E.DEC.world_festival173.make(l, () => .5, { id: 'tet_vn', kind: 'local' });
  if (c.code !== 'VN') ok(!/Tết Nguyên đán/.test(forged.text) && !forged.data.keys.length, c.code + ' forged VN festival blocked');
  l.pool = 'vn';
  if (c.code !== 'VN') ok(!E.culturalContext173(l).origins.includes('VN'), c.code + ' name pool cannot assign origin');
  for (const candidate of E.CULTURE173.candidates(l)) {
    if (candidate.why === 'local' && candidate.id !== 'new_year_common') ok(p.holidays.includes(candidate.id), c.code + ' local festival belongs to profile');
  }
}
for (const cc of ['FI', 'GH', 'IE']) {
  const l = life(cc), food = E.CULTURE173.FOOD[cc];
  ok(food.dishes.length >= 5 && new Set(food.dishes).size === food.dishes.length, cc + ' 5 distinct dishes');
  ok(food.metadata.confidence === 'verified' && food.metadata.sources.length, cc + ' sources');
  act(l, 'world_cuisine173', 'learn');
  ok(!E.DEC.world_cuisine173.valid(l), cc + ' one meaningful action per year');
  ok(!got(l, 'culture173_kitchen_' + cc), cc + ' learning is not cooking');
  for (let n = 0; n < 3; n++) {
    if (n) { l.age++; act(l, 'world_cuisine173', 'learn'); }
    l.age++;
    if (n === 0) { act(l, 'world_cuisine173', 'cook', .999); ok(Object.keys(l.flags.culture173.kitchen.cooked).length === 0, 'failure retained for retry'); l.age++; }
    act(l, 'world_cuisine173', 'cook');
  }
  ok(got(l, 'culture173_kitchen_' + cc), cc + ' achievement after 3 successful recipes');
  ok(got(copy(l), 'culture173_kitchen_' + cc), cc + ' reload preserves achievement');
  l.age++; const d = E.DEC.world_cuisine173.make(l, () => .1), snapshot = JSON.stringify(l.flags.culture173.kitchen); l.abroad = { code: 'JP', perm: true };
  E.DEC.world_cuisine173.apply(l, d, '0', () => .1, () => {});
  ok(JSON.stringify(l.flags.culture173.kitchen) === snapshot, cc + ' stale cuisine no outcome after migration');
  let queued = 0;
  for (let seed = 0; seed < 24; seed++) {
    const q = life(cc); q.id = 'country-cuisine-reachability-' + seed;
    E.beginYear(q, { auto: false });
    let guard = 0;
    while (q.alive && q.pending.length && guard++ < 96) E.resolve(q, E.autoKey(q));
    E.finishYear(q);
    if (q.pending.some(d => d.id === 'world_cuisine173')) queued++;
  }
  ok(queued > 0, cc + ' cuisine reachable through real annual pipeline');
}
{
  const l = life('JP');
  for (let i = 0; i < 3; i++) { act(l, 'world_festival173', 'home', .1, { id: 'shogatsu', kind: 'local' }); l.age++; }
  ok(got(l, 'culture173_local_JP'), '3 local festival years unlock');
  const repeated = life('JP');
  for (let i = 0; i < 3; i++) act(repeated, 'world_festival173', 'home', .1, { id: 'shogatsu', kind: 'local' });
  ok(!got(repeated, 'culture173_local_JP'), 'repeating a festival in one year is not three years');
  const d = E.DEC.world_festival173.make(l, () => .1, { id: 'shogatsu', kind: 'local' }); l.abroad = { code: 'FR', perm: true }; const count = l.flags.culture173.festivals.shogatsu;
  E.DEC.world_festival173.apply(l, d, '0', () => .1, () => {});
  ok(l.flags.culture173.festivals.shogatsu === count, 'stale festival no credit');
  l.pending = [d]; E.migrateExt(l); ok(!l.pending.length, 'stale queued event removed after reload');
}
{
  const l = life('NZ'); l.birthYear = 1980; ok(!E.CULTURE173.candidates(l).some(x => x.id === 'matariki_nz'), 'no modern Matariki public holiday before 2022'); l.birthYear = 2006;
  act(l, 'world_festival173', 'home', .1, { id: 'matariki_nz', kind: 'local' }); ok(got(l, 'culture173_matariki'), 'Matariki actual participation');
}
{
  const l = life('US', 17); l.school = 'upper'; l.st.kno = 100; act(l, 'world_exam173', 'plan', .9);
  ok(got(l, 'culture173_exam_US') && !got(l, 'culture173_exam_JP'), 'exam achievement uses recorded country');
  for (const age of [4, 12, 16, 18, 30]) { const q = life('US', age); q.school = 'upper'; ok(!E.DEC.world_exam173.valid(q), 'exam age gate ' + age); }
}
for (const cc of Object.keys(E.FOOTBALL_DATA.markets)) {
  const l = life('VN'); E.FOOTBALL.init(l, () => .5); const s = l.flags.football, c = E.FOOTBALL_DATA.clubs.find(c => c.country === cc);
  s.seasons = [{ year: 2026, club: c.id, matches: Array.from({ length: 10 }, () => ({ minutes: 0, international: false })) }];
  ok(!got(l, 'football_market_' + cc), cc + ' bench does not count');
  s.seasons[0].matches.forEach(m => m.minutes = 90); ok(got(l, 'football_market_' + cc), cc + ' market from club country');
  s.seasons[0].matches.forEach(m => m.international = true); ok(!got(l, 'football_market_' + cc), cc + ' national games not club games');
}
{
  const l = life('VN'); E.FOOTBALL.init(l, () => .5); const s = l.flags.football;
  s.totals.goals = 99; ok(!got(l, 'football_100_goals'), '99 not 100'); s.totals.goals = 100; ok(got(l, 'football_100_goals'), '100 goals');
  s.trophies = [{ name: 'FIFA World Cup', year: 2026, nation: 'VN' }]; ok(!got(l, 'football_cup_FIFA_World_Cup'), 'trophy without played match insufficient');
  s.seasons = [{ year: 2026, matches: [{ competition: 'FIFA World Cup', minutes: 90, goals: 3, international: true }] }];
  ok(got(l, 'football_cup_FIFA_World_Cup') && got(l, 'football_hat_trick'), 'world cup and hat trick');
  ok(got(copy(l), 'football_100_goals'), 'football reload'); s.legacyFallback = true; ok(!got(l, 'football_100_goals'), 'legacy estimates not awarded');
}
console.log('PASS country depth + achievements: ' + checks + ' checks, fixed seed 195, all 195 countries / 16 football markets.');
