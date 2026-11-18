'use strict';

const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const { E } = gameContext();
const C = E.CTX945, P = E.ERA920.POL, R = E.ERA969, H = E.ERA920.HIST;
const rng = () => .75;
const quiet = () => {};

function life(country, city, year, age = 0) {
  const person = E.createLife({ mode: 'world', country, city, urban: true, year: year - age, seed: 982 });
  return Object.assign(person, { id: 'history982', age, pending: [], sched: [], money: person.base * 10 });
}

function student(city, year, age = 12) {
  return Object.assign(life('CD', city, year, age), {
    school: age < 12 ? 'primary' : age < 15 ? 'lower' : 'upper',
    schoolEnd: age >= 15 ? 18 : null,
    yearsInSchool: age - 6,
    edu: age < 12 ? 0 : age < 15 ? 1 : 2
  });
}

function load(person) {
  return E.migrate(JSON.parse(JSON.stringify(person)));
}

function findSchool(person) {
  return person.pending.find(decision => decision.id === 'ctx945_event' && decision.data.arg.kind === 'school');
}

function choose(person, decision, key) {
  const choice = decision.opts.find(option => decision.data.keys?.[+option.k] === key || option.k === key);
  assert(choice, key);
  person.pending = [decision];
  E.resolve(person, choice.k);
}

for (const [cc, year, kind, ruler, text] of [
  ['SG', 1941, 'colony', 'Anh', /Eo biển/],
  ['SG', 1942, 'occupation', 'Nhật Bản', /tháng 2/],
  ['SG', 1943, 'occupation', 'Nhật Bản', /chiếm đóng/],
  ['SG', 1945, 'transition', 'Anh', /tháng 9/],
  ['SG', 1946, 'colony', 'Anh', /thuộc địa riêng/],
  ['SG', 1959, 'selfGovernment', 'Anh', /tự trị/],
  ['SG', 1963, 'federation', null, /Malaysia/],
  ['SG', 1965, 'independent', null, /9\/8\/1965/],
  ['NA', 1915, 'occupation', 'Nam Phi', /quân quản/],
  ['NA', 1930, 'mandate', 'Nam Phi', /Hội Quốc Liên/],
  ['NA', 1966, 'occupation', 'Nam Phi', /chấm dứt ủy trị/],
  ['NA', 1989, 'transition', 'Nam Phi', /Liên Hợp Quốc/],
  ['NA', 1990, 'independent', null, /21\/3\/1990/],
  ['SO', 1960, 'independent', null, /hợp nhất/],
  ['SO', 2004, 'transition', null, /Chuyển tiếp/],
  ['SO', 2015, 'federal', null, /thành lập năm 2012/],
  ['LY', 1938, 'colony', 'Ý', /cai trị của Ý/],
  ['LY', 1944, 'occupation', 'Anh và Pháp', /Fezzan/]
]) {
  assert.equal(C.at(cc, year).authority.kind, kind, cc + '/' + year);
  assert.equal(C.colonyAt(cc, year), ruler);
  assert.match(P.status(cc, year), text);
  assert.equal(P.status(cc, year), C.at(cc, year).authority.text);
}
assert.equal(C.at('SG', 1943).warKind, 'occ');
assert.equal(C.at('SG', 1946).war, 0);
assert.equal(C.at('SO', 2015).warKind, 'ins');

const child = life('SG', 'Singapore', 1943);
E.finishYear(child);
assert(child.log.some(entry => /chiếm đóng của Nhật Bản/.test(entry.t)));
assert(!child.log.some(entry => /thuộc địa của Anh/.test(entry.t)));
const transition = life('SG', 'Singapore', 1945, 20);
transition.flags.indep945 = 'fighter'; // Legacy flag must not reward a change of occupier.
E.finishYear(transition);
assert(!transition.flags.statusHero945);
assert(!transition.log.some(entry => /đất nước chấm dứt ách/.test(entry.t)));
const oldExam = E.DEC.ctx945_event.make(transition, rng, { kind: 'col_exam', y: 1945, cc: 'SG' });
assert(!E.DEC.ctx945_event.valid(transition, oldExam.data));

for (const [year, city, war, school, label] of [
  [2022, 'Goma', 2, 1, /Rutshuru/],
  [2023, 'Goma', 2, 1, /sức ép/],
  [2024, 'Goma', 3, 2, /Sake/],
  [2025, 'Goma', 3, 2, /tháng 1/],
  [2022, 'Bukavu', 1, 0, /Bắc Kivu/],
  [2023, 'Bukavu', 1, 0, /Bắc Kivu/],
  [2024, 'Bukavu', 1, 1, /gián đoạn/],
  [2025, 'Bukavu', 3, 2, /tháng 2/],
  [2025, 'Kinshasa', 0, 0, null]
]) {
  const c = C.levelAt('CD', year, city);
  assert.equal(c.war, war, city + '/' + year);
  assert.equal(c.school, school);
  if (label) assert.match(c.labels.war, label);
  if (year < 2025) assert.doesNotMatch(c.labels.war || '', /chiếm Goma|vào Bukavu/);
}
assert(C.localEvacuationRoute('CD', 2023, 'Goma', 'Bukavu'));
assert(!C.localEvacuationRoute('CD', 2024, 'Goma', 'Bukavu'));
assert(!C.localEvacuationRoute('CD', 2025, 'Bukavu', 'Goma'));

// Mild disruption offers continued school in 2023. It returns only as circumstances worsen.
const mild = student('Goma', 2023);
E.beginYear(mild);
const mildMenu = findSchool(mild);
assert(mildMenu);
assert.deepEqual(Array.from(mildMenu.data.keys), ['temp', 'regular']);
choose(mild, mildMenu, 'regular');
const after2023 = load(mild);
after2023.age++;
assert(C.schoolAgenda(after2023));
for (const [city, year] of [['Bukavu', 2023], ['Kinshasa', 2025]]) {
  const unaffected = student(city, year);
  E.beginYear(unaffected);
  assert(!findSchool(unaffected));
}
const obsolete = student('Goma', 2024);
obsolete.pending = [E.DEC.ctx945_event.make(obsolete, rng, { kind: 'school', y: 2024, cc: 'CD', city: 'Goma' })];
E.beginYear(obsolete);
assert(findSchool(obsolete)?.data.arg.regionalSchool);

// Choosing to pause prevents credit and graduation, while temporary school counts the year.
for (const key of ['temp', 'pause']) {
  let pupil = student('Goma', 2024, 17);
  E.beginYear(pupil);
  pupil = load(pupil);
  const pending = findSchool(pupil);
  assert(pending);
  choose(pupil, pending, key);
  const years = pupil.yearsInSchool;
  pupil = load(pupil);
  E.finishYear(pupil);
  assert.equal(pupil.yearsInSchool, years + (key === 'temp' ? 1 : 0));
  assert.equal(pupil.school, key === 'pause' ? 'upper' : null);
  assert.equal(pupil.schoolEnd, key === 'pause' ? 19 : null);
  assert.equal(pupil.edu, key === 'pause' ? 2 : 3);
  if (key === 'pause') {
    pupil.age++;
    pupil.pending = [];
    E.finishYear(pupil);
    assert.equal(pupil.edu, 3);
  }
}

// Staying back in primary school delays the actual transition to lower secondary.
const primary = student('Goma', 2024, 11);
primary.fam.q = 5;
E.beginYear(primary);
choose(primary, findSchool(primary), 'pause');
E.finishYear(primary);
assert.equal(primary.school, 'primary');
primary.age++;
primary.pending = [];
E.beginYear(primary);
assert(!findSchool(primary)); // Same disruption level, no repeated prompt in the following year.
E.finishYear(primary);
assert.equal(primary.school, 'lower');

// A student evacuates within Congo. Housing, re-entry and return are evaluated separately.
let displaced = student('Goma', 2024, 12);
E.beginYear(displaced);
choose(displaced, findSchool(displaced), 'evacuate');
assert.equal(displaced.school, null);
assert.equal(C.of(displaced).war, 0);
assert.notEqual(displaced.city, 'Bukavu');
let recovery = R.currentRecovery(displaced);
assert.equal(recovery.from, 'Goma');
assert.equal(recovery.school.remaining, 3);
assert.equal(recovery.school.calendarAge, 12);
assert.equal(displaced.flags.ctx945.refuge.country, 'CD');
const recoveryMenu = p => E.DEC.recovery969.make(p, rng, {});
assert(!recoveryMenu(displaced).opts.some(o => /Xin tiếp tục/.test(o.l)));
choose(displaced, recoveryMenu(displaced), 'rent');
displaced.age++;
choose(displaced, recoveryMenu(displaced), 'school');
assert(recovery.schoolDue);
assert(!R.returnReady(displaced, recovery));
displaced = load(displaced);
displaced.age++;
R.recoveryYear(displaced, rng, quiet);
recovery = R.currentRecovery(displaced);
assert(recovery.schoolDone);
assert.equal(displaced.school, 'lower');
assert.equal(displaced.schoolEnd, null);
assert.equal(displaced.yearsInSchool, 6);
assert(!R.returnReady(displaced, recovery)); // The data cutoff alone does not reopen travel home.
assert.equal(C.schoolAge(displaced) + 1, 12);

// The re-entry decision evaluates the destination in the year the request comes due.
const blocked = student('Goma', 2024, 12);
H.open(blocked, 'displaced', 2);
blocked.city = blocked.place = 'Bukavu';
const pendingSchool = R.currentRecovery(blocked);
pendingSchool.schoolDue = 2025;
pendingSchool.schoolCountry = 'CD';
pendingSchool.schoolCity = 'Bukavu';
blocked.age++;
R.recoveryYear(blocked, rng, quiet);
assert.equal(blocked.school, null);
assert.equal(pendingSchool.schoolDue, 2026);
console.log('PASS authority-school982: country authority, Congo by year/city, school decisions, save reload, evacuation and re-entry');
