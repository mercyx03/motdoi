'use strict';

const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const { E } = gameContext(), C = E.CTX945, P = E.ERA920.POL, R = E.ERA969, Hist = E.ERA920.HIST;
const rng = () => .95;
const quiet = () => {};

function life(country, city, year, age, gender = 'F') {
  const l = E.createLife({ mode: 'world', country, city, year: year - age, gender, urban: true, seed: 984 });
  return Object.assign(l, { id: 'era984-' + city, age, alive: true, city, place: city, school: null,
    schoolEnd: null, pending: [], sched: [], job: null, ill: null, indep: age >= 18, money: l.base * 25 });
}
const load = l => E.migrate(JSON.parse(JSON.stringify(l)));
const keys = d => Array.from(d.opts, o => E.UPDATE110.menuKey(d, o.k));
function context(l, kind) {
  return E.DEC.ctx945_event.make(l, rng, { kind, cc: E.H.resCode(l), city: P.residentCity(l), y: l.birthYear + l.age });
}
function choose(l, id, d, key) {
  const o = d.opts.find(opt => E.UPDATE110.menuKey(d, opt.k) === key);
  assert(o, id + '/' + key);
  if (id === 'ctx945_event') E.DEC[id].apply(l, d, o.k, rng, quiet);
  else { l.pending = [d]; E.resolve(l, o.k); }
}

for (const [country, city, year] of [['SD', 'Khartoum', 2024], ['LB', 'Tyre', 2024]]) {
  let evacuee = life(country, city, year, 25);
  evacuee.job = { id: 'ke_toan' };
  evacuee.income = evacuee.base;
  const d = context(evacuee, 'expel'), to = C.refuge(evacuee), money = evacuee.money;
  assert(to && d.opts.some(o => o.l.includes(to)));
  choose(evacuee, 'ctx945_event', d, 'go');
  const expectedMoney = evacuee.money;
  assert(expectedMoney < money);
  assert.equal(P.residentCity(evacuee), to);
  assert.equal(evacuee.job, null);
  assert.equal(evacuee.income, 0);
  assert(evacuee.flags.needJob);
  assert(!E.DEC.ctx945_event.valid(evacuee, d.data));
  choose(evacuee, 'ctx945_event', d, 'go');
  assert.equal(evacuee.money, expectedMoney);
  evacuee = load(evacuee);
  const q = R.currentRecovery(evacuee);
  assert.equal(q.from, city);
  assert.equal(q.destination984.city, to);
  assert.equal(q.history.filter(h => h.choice === 'relocate').length, 1);
  assert(!R.returnReady(evacuee, q));
}

const gaza = life('PS', 'Gaza', 2025, 14);
gaza.school = 'lower';
assert.equal(C.refuge(gaza), null);
choose(gaza, 'ctx945_event', context(gaza, 'shelter'), 'flee');
assert.equal(gaza.city, 'Gaza');
assert(R.currentRecovery(gaza).shelter984);
assert.equal(R.currentRecovery(gaza).destination984.city, 'Gaza');
assert(!gaza.flags.ctx945.refuge);

const seekingAsylum = life('SD', 'Khartoum', 2025, 26);
choose(seekingAsylum, 'ctx945_event', context(seekingAsylum, 'expel'), 'cross');
assert.notEqual(E.H.resCode(seekingAsylum), 'SD');
assert.equal(R.currentRecovery(seekingAsylum).from, 'Khartoum');
assert.equal(R.currentRecovery(seekingAsylum).country, 'SD');
assert.equal(R.currentRecovery(seekingAsylum).destination984.country, E.H.resCode(seekingAsylum));

for (const [country, city, home] of [['SD', 'Port Sudan', 'El Fasher'], ['PS', 'Ramallah', 'Gaza']]) {
  const l = life(country, city, 2025, 25), q = { from: home, country, at: 2024 };
  assert(!R.returnReady(l, q));
  l.age += 1;
  assert(!R.returnReady(load(l), q), home + ' needs more than a calendar change to allow return');
}
assert(!C.localEvacuationRoute('PS', 2026, 'Ramallah', 'Gaza'));
assert(C.safeReturn('JP', 2015, 'Osaka', 'Sendai'), 'a completed historical crisis can reopen the way');

function inSchool(year, age, kind, gender) {
  const l = life('AF', 'Kabul', year, age, gender);
  l.school = kind;
  l.edu = kind === 'primary' ? 0 : kind === 'lower' ? 1 : kind === 'upper' ? 2 : 3;
  l.schoolEnd = kind === 'upper' ? 18 : kind === 'uni' ? 22 : null;
  l.yearsInSchool = Math.max(0, age - 6);
  return l;
}
const primary = inSchool(2023, 11, 'primary');
primary.fam.q = 5;
E.finishYear(primary);
assert.equal(primary.yearsInSchool, 6);
assert.equal(primary.edu, 1);
assert.equal(primary.school, null);
assert.equal(primary.flags.afghanStudy984.paused.calendarAge, 12);
const earlier = inSchool(2020, 11, 'primary');
earlier.fam.q = 5;
E.finishYear(earlier);
assert.equal(earlier.school, 'lower');
const boy = inSchool(2023, 15, 'lower', 'M');
E.beginYear(boy);
assert(boy.pending.some(d => d.id === 'hs' && keys(d).includes('thpt')));

let teenager = inSchool(2023, 15, 'lower');
E.beginYear(teenager);
assert(!teenager.pending.some(d => d.id === 'hs' && keys(d).includes('thpt')));
const lesson = teenager.pending.find(d => d.id === 'afghanStudy984');
assert(lesson && keys(lesson).includes('materials'));
const oldKno = teenager.st.kno;
choose(teenager, 'afghanStudy984', lesson, 'materials');
assert(teenager.st.kno > oldKno);
assert.equal(teenager.edu, 1);
teenager = load(teenager);
assert.equal(teenager.flags.afghanStudy984.years, 1);
assert(!keys(E.DEC.afghanStudy984.make(teenager, rng, {})).includes('materials'));
assert.equal(teenager.school, null);
teenager.age++;
teenager.pending = [];
E.beginYear(teenager);
assert(!teenager.pending.some(d => d.id === 'afghanStudy984'), 'no compulsory reminder for the same interruption');
teenager.abroad = { code:'PK', name:'Pakistan', perm:true };
teenager.city = teenager.place = 'Lahore';
const resume = E.DEC.afghanStudy984.make(teenager, rng, {});
choose(teenager, 'afghanStudy984', resume, 'resume');
assert.equal(teenager.school, 'lower');
assert.equal(teenager.flags.schoolDelay982, 1);

const studying2021 = inSchool(2021, 19, 'uni');
E.beginYear(studying2021);
assert.equal(studying2021.school, 'uni');
const studying2022 = inSchool(2022, 21, 'uni');
E.finishYear(studying2022);
assert.equal(studying2022.school, null);
assert.equal(studying2022.edu, 3, 'blocked saved enrolment does not award a degree');
const university = life('AF', 'Kabul', 2024, 18);
university.edu = 3;
university.flags.uniNext = university.age;
E.beginYear(university);
const application = university.pending.find(d => d.id === 'uni');
assert(application);
assert(!keys(application).some(key => key === 'wishes54' || /^uni_/.test(key)));
assert(keys(application).includes('afghanStudy984'));
assert.equal(R.formalSchoolReason(university, 'uni', null, 'FR'), true);
assert(!E.DEC.study_wishes54.valid(university, {}));

const localDisplaced = inSchool(2020, 13, 'lower');
Hist.open(localDisplaced, 'displaced', 2);
const localCase = R.currentRecovery(localDisplaced);
localCase.schoolDue = 2021; localCase.schoolCountry = 'AF'; localCase.schoolCity = 'Kabul';
localDisplaced.age++;
R.recoveryYear(localDisplaced, rng, quiet);
assert.equal(localDisplaced.school, null);
assert(!localCase.schoolDone);
console.log('PASS evacuation-afghan-education984: true relocation, safe return, education thresholds, old saves and re-entry');
