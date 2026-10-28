'use strict';
const assert = require('assert');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, F = E.FOOTBALL, D = E.FOOTBALL_DATA;
let checks = 0;
function ok(x, msg) { assert(x, msg); checks++; }
function rng(seed) { return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }; }
function life(age = 12, country = 'VN') {
  const l = E.createLife({ mode: country === 'VN' ? 'vn' : 'world', country, seed: 1752026 });
  Object.assign(l, { age, birthYear: 2014, money: 100000, pending: [], sched: [], job: null, abroad: null, retired: false });
  l.flags.military = 0; l.st.hea = 90; return l;
}
const log = () => {};
function choice(l, id, key, arg) {
  const d = E.DEC[id].make(l, () => .5, arg), i = d.data.keys.indexOf(key);
  ok(i >= 0, `${id} exposes ${key}`); E.DEC[id].apply(l, d, String(i), () => .3, log); return d;
}
// Real path: a local child chooses among academies, develops, earns and retires.
{
  const l = life(), r = rng(175), s = F.init(l, () => .85);
  ok(s.national.country === 'VN' && !l.job, 'child profile leaves job and nationality alone');
  const options = F.trialOptions(l);
  ok(options.length >= 4 && options.every(c => c.country === 'VN'), 'multiple local academies and minor migration guard');
  F.trial(l, 'VN-0', () => .95, log); F.trial(l, 'VN-1', () => .95, log);
  ok(s.offers.length >= 2, 'multiple academy offers are retained for player choice');
  ok(!s.club, 'offer never auto-assigns a club');
  const cash = l.money;
  ok(F.trial(l, 'VN-0', r, log) === false && cash === l.money, 'same trial not repeated or charged');
  const offer = s.offers.find(o => o.club === 'VN-0');
  ok(F.accept(l, offer.id, r, log), 'player accepts chosen academy');
  ok(s.club === 'VN-0' && s.stage === 'youth' && !s.contract, 'academy not mistaken for pro wage');
  ok(F.income(l, r, log) === 0, 'academy has no pro salary');
  let signed = false, nonzero = 0, beforeDecline = 0;
  for (let age = 13; age <= 39; age++) {
    l.age = age; s.training = 'balanced';
    F.annual(l, r, log);
    const o = s.offers.find(o => o.kind === 'pro');
    if (o && (!s.contract || s.contract.end - (l.birthYear + age) <= 1)) signed = F.accept(l, o.id, r, log) || signed;
    if (!s.contract && age >= 16 && s.stage !== 'retired') {
      F.negotiate(l, s.club || 'VN-3', () => .01, log);
      const x = s.offers.find(o => o.kind === 'pro'); if (x) signed = F.accept(l, x.id, r, log) || signed;
    }
    if (l.job) { const pay = E.careerYear(l, r, log); if (pay > 0) nonzero++; ok(E.careerYear(l, r, log) === 0, 'repeat annual payroll returns no second income'); }
    if (age === 28) beforeDecline = s.skills.speed;
    const z = s.seasons.find(z => z.year === l.birthYear + age);
    ok(!!z && new Set(z.matches.map(m => m.id)).size === z.matches.length, 'one season, unique match ids');
    ok(Object.values(s.skills).every(v => v <= s.potential && v <= 100), 'skills bounded by potential');
  }
  ok(signed && nonzero > 5, 'journey signs professional contracts and receives wages over many seasons');
  ok(s.totals.apps > 20 && s.seasons.some(z => z.table.length > 0), 'actual appearances and season standings');
  ok(s.skills.speed < beforeDecline, 'age decline after peak');
  F.retire(l, log); ok(s.stage === 'retired' && !l.job && s.totals.apps > 0, 'retirement preserves statistics');
  l.edu = 3; choice(l, 'footballCareer', 'coachJob'); ok(E.resolveJob(l.job.id) === 'hlv_tt', 'post-retirement coaching career uses existing career');
}
// Refusal, stalled potential, injuries, trial retry and income guards.
{
  const l = life(15), s = F.init(l, () => 0);
  D.skills.forEach(k => s.skills[k] = 1); s.potential = 10; s.form = 10; s.fitness = 10;
  ok(F.trial(l, 'VN-0', () => 0, log) === 'rejected', 'low ability academy refusal');
  l.age++; ok(F.trial(l, 'VN-0', () => 0, log) !== false, 'can retry next year');
  F.annual(l, () => .5, log); ok(Object.values(s.skills).every(v => v <= 10), 'low potential cannot train without bound');
  ok(!F.negotiate(l, 'GB-0', () => 0, log), 'high club rejects inadequate reputation and ability');
  ok(!s.national.called, 'weak local player not guaranteed national selection');
}
function pro(country = 'VN', id = country + '-0') {
  const l = life(25, country), s = F.init(l, () => .8);
  D.skills.forEach(k => s.skills[k] = 85); s.potential = 95; s.reputation = 70; s.form = 80; s.fitness = 95;
  ok(F.negotiate(l, id, () => .01, log), 'qualified player receives contract offer');
  ok(F.accept(l, s.offers[0].id, () => .5, log), 'professional contract acceptance'); return { l, s };
}
{
  const { l, s } = pro(); const r = rng(55), initialMoney = l.money;
  const pay = E.careerYear(l, r, log);
  ok(pay > 0 && l.money === initialMoney, 'pro earnings returned to finance, not directly credited');
  ok(s.earnings.signingUSD > 0 && s.earnings.taxAgentUSD > 0, 'signing and simulated costs itemised');
  const n = s.totals.apps, z = s.seasons[0];
  F.annual(l, r, log); F.season(l, r, log); F.match(l, z, z.matches[0].id, 70, r, false, false);
  ok(s.totals.apps === n, 'annual/season/match re-entry cannot duplicate stats');
  s.injury = 110; l.age++; const cash = l.money;
  F.annual(l, r, log);
  const injured = s.seasons[s.seasons.length - 1];
  ok(s.injury > 0 && injured.matches.every(m => m.minutes === 0), 'long injury prevents club and international appearances');
  ok(!s.national.called, 'injured player not called up');
  ok(l.money === cash, 'injury simulation cannot duplicate signing bonus');
  ok(E.careerYear(l, r, log) > 0 && s.earnings.signingUSD === 0, 'contract salary survives injury; signing paid once');
  l.age = 29; F.annual(l, r, log);
  ok(s.stage === 'free' && !s.contract && F.income(l, r, log) === 0, 'expired contract stops income');
}
{
  const { l, s } = pro(), nationality = l.country;
  l.age++; s.reputation = 95;
  ok(F.negotiate(l, 'JP-0', () => .01, log), 'international transfer needs an actual negotiated offer');
  const offer = s.offers.find(o => o.club === 'JP-0');
  const valueUSD = l.cur === 'vnd' ? l.money * 1e6 / G.CUR.VND : l.money * G.CUR.priceLevel(l.gdp);
  ok(F.accept(l, offer.id, () => .5, log), 'international contract chosen by player');
  ok(l.country === nationality && E.H.resCode(l) === 'JP' && s.national.country === nationality, 'residence changes without changing nationality');
  ok(Math.abs(l.money * G.CUR.priceLevel(G.W.BY[E.H.resCode(l)].gdp) - valueUSD) < .01, 'migration preserves money value and does not pay transfer fee to player');
  ok(s.contracts.length === 1, 'transfer retains old contract history');
  s.role = 'Dự bị'; ok(F.loan(l, () => .5, log), 'reserve can choose loan');
  const parent = s.club; l.age++; F.annual(l, rng(18), log);
  ok(!s.loan && s.club === parent, 'one-year loan returns to parent');
}
// Club competition gates, national confederations and independent calendars.
{
  const { l, s } = pro(); l.birthYear = 2004; l.age = 25; // 2029 Club World Cup cycle
  F.annual(l, rng(101), log);
  let z = s.seasons[s.seasons.length - 1];
  ok(!z.competitions.some(e => /Champions|Club World/.test(e.name)), 'no automatic continental or world entry in first season');
  s.seasons.push({ year: 2028, club: 'VN-0', stage: 'pro', place: 1, matches: [], table: [] });
  s.trophies.push({ year: 2027, club: 'VN-0', name: D.confeds.AFC.club });
  s.seasons = s.seasons.filter(z => z.year !== 2029); delete s.processed;
  s.injury = 0; s.fitness = 95; F.annual(l, rng(77), log); z = s.seasons.find(z => z.year === 2029);
  ok(z.competitions.some(e => e.name === D.confeds.AFC.club), 'prior league result unlocks continental competition');
  ok(z.competitions.some(e => e.name === 'FIFA Club World Cup'), 'recent continental title and cycle unlock world club competition');
  ok(!z.competitions.some(e => /UEFA|Europa/.test(e.name)), 'Vietnamese club cannot play UEFA competitions');
  l.age++; s.injury = 0; s.fitness = 95; F.annual(l, rng(78), log);
  ok(!s.seasons.find(z => z.year === 2030).competitions.some(e => e.name === 'FIFA Club World Cup'), 'world club tournament not annual');
}
{
  const { l, s } = pro(); s.national.country = 'VN'; l.birthYear = 2000; l.age = 26;
  function z(y) { return { year: y, club: s.club, matches: Array.from({ length: 8 }, (_, i) => ({ id: 'club:' + i, minutes: 90, international: false })), competitions: [] }; }
  let season = z(2026); F.national(l, season, () => .01, log);
  ok(s.national.called, 'in-form eligible regular player can be called');
  ok(!season.competitions.some(e => e.name === 'FIFA World Cup'), 'call-up alone does not bypass World Cup qualifiers');
  l.age = 27; s.fitness = 95; s.injury = 0; s.national.qualified['AFC Asian Cup:2027'] = true;
  season = z(2027); F.national(l, season, () => .01, log);
  ok(season.competitions.some(e => e.name === 'AFC Asian Cup'), 'qualified Asian team enters Asian Cup on its calendar');
  ok(!season.competitions.some(e => /European|Copa América|Gold Cup/.test(e.name)), 'national tournaments restricted by confederation');
  l.age = 29; s.fitness = 95; s.injury = 0; season = z(2029); F.national(l, season, () => .01, log);
  ok(season.competitions.some(e => e.name === 'Vòng loại FIFA World Cup'), 'World Cup qualifying played in preceding year');
  ok(!season.competitions.some(e => e.name === 'AFC Asian Cup'), 'continental and world calendars remain independent');
}
// UI entry points and backwards compatibility with other careers.
{
  const l = life(); choice(l, 'footballCareer', 'start'); choice(l, 'footballTraining', 'GK');
  ok(F.peek(l).position === 'GK', 'position selection through real menu');
  choice(l, 'footballMarkets', 'VN');
  ok(E.DEC.footballClubs.make(l, () => .5, { country: 'VN' }).opts.length > 2, 'club selector exposes multiple choices');
  const old = life(30); old.job = { id: 'vdv', rank: 2, club: 'Hà Nội FC', yrs: 3 }; old.talentSub = 'bóng đá'; old.skill = 75;
  E.migrateExt(old); ok(F.peek(old).contract.legacy && old.job.rank === 2, 'legacy athlete migrated without losing rank or club');
  const plain = life(30); E.migrateExt(plain); ok(!F.peek(plain), 'old non-football save remains lazy and unchanged');
  const other = life(30); E.startJob(other, 'cong_chuc', () => .5, log, true); const job = JSON.stringify(other.job); other.skill = 73;
  F.init(other, () => .5); F.annual(other, rng(45), log); ok(JSON.stringify(other.job) === job, 'football hobby leaves state career intact');
  ok(other.skill === 73, 'football hobby never overwrites main career skill');
  ok(E.careerYear(other, rng(44), log) > 0, 'state career salary still runs');
  for (const code of Object.keys(D.markets)) {
    const l = life(25, code), s = F.init(l, () => .5); s.reputation = 30;
    ok(F.wage(l, F.club(code + '-0')) > F.wage(l, F.club(code + '-11')), code + ': elite pays more than semi-pro');
    ok(!!D.confeds[D.markets[code][0]], code + ': valid confederation');
  }
  const l2 = life(25); F.init(l2, () => .5);
  ok(F.wage(l2, F.club('GB-0')) > F.wage(l2, F.club('VN-0')) * 10, 'market wage bands distinct across countries');
}
{
  const { l, s } = pro(); F.annual(l, rng(192), log);
  const loaded = E.migrate(JSON.parse(JSON.stringify(l)));
  ok(JSON.stringify(loaded.flags.football) === JSON.stringify(s), 'football contracts, fixtures, coach identity and stats survive save migration');
  const n = loaded.flags.football.totals.apps; F.annual(loaded, rng(193), log);
  ok(loaded.flags.football.totals.apps === n, 'reload in same year cannot simulate matches again');
  const fresh = life(20); fresh.talentSub = 'bóng đá'; fresh.skill = 99;
  E.startJob(fresh, 'vdv', () => .5, log, true);
  ok(!F.peek(fresh).contract && F.peek(fresh).stage === 'local', 'new athlete job is not a shortcut to an elite contract');
  const old = life(25, 'IN'); old.talentSub = 'bóng đá'; old.job = { id: 'vdv', rank: 1, yrs: 2, club: 'CLB cũ' };
  E.migrateExt(old); const title = E.jobTitle(old);
  ok(F.peek(old).legacyFallback && E.careerYear(old, rng(195), log) > 0, 'legacy player in an unsupported market keeps existing career income');
  ok(E.jobTitle(old) === title && E.monthlyEst(old, 'vdv') > 0, 'unsupported legacy player keeps title and wage estimate');
}
console.log('PASS football career: ' + checks + ' assertions');
