'use strict';

const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, P = E.ERA920.POL, H = E.ERA920.HIST, C = E.CTX945, R = E.ERA969;
const rng = () => .75;
const quiet = () => {};

function life(country, year, city, age = 0) {
  const result = E.createLife({ mode: 'world', country, year: year - age, city, urban: true, seed: 981 });
  result.age = age;
  result.id = 'recovery-geography981';
  result.indep = age >= 18;
  result.money = result.base * 10;
  return result;
}

function load(life) { return E.migrate(JSON.parse(JSON.stringify(life))); }
function host(life, code, city, extra = {}) {
  life.abroad = { code, name: G.W.BY[code].name, perm: true, ...extra };
  life.city = life.place = city;
}
function group(life, kind) {
  return E.DEC.ctx945_event.make(life, rng, { kind, cc: E.H.resCode(life), y: life.birthYear + life.age, city: P.residentCity(life) });
}

let checks = 0;
for (const { code, births } of G.W.C) {
  for (let year = 1900; year <= 2025; year++) {
    const list = P.cities(code, year);
    if (births > 0) assert(list.length, code + '/' + year);
    for (const city of list) {
      assert(P.cityAllowed(code, year, city), code + '/' + year + '/' + city);
      assert(P.cityLabel(code, year, city), code + '/' + year + '/' + city);
      checks++;
    }
  }
}

assert(!P.cities('PH', 1900).includes('Quezon City'));
assert(!P.cities('PH', 1938).includes('Quezon City'));
assert(P.cities('PH', 1939).includes('Quezon City'));
assert.notEqual(life('PH', 1900, 'Quezon City').city, 'Quezon City');
assert.equal(life('PH', 1939, 'Quezon City').city, 'Quezon City');
assert.match(life('AU', 1913, 'Canberra').birthPlace, /khu xây dựng Canberra/);
assert.match(life('AU', 1927, 'Canberra').birthPlace, /^Canberra/);
assert.match(life('ZA', 1955, 'Soweto').birthPlace, /tây nam Johannesburg/);
assert.match(life('ZA', 1963, 'Soweto').birthPlace, /^Soweto/);
assert.equal(P.cityLabel('ZA', 2001, 'Polokwane'), 'Pietersburg');
assert.equal(P.cityLabel('ZA', 2002, 'Pietersburg'), 'Polokwane');
for (const [year, name] of [[1925, 'Katerynoslav'], [1926, 'Dnipropetrovsk'], [2015, 'Dnipropetrovsk'], [2016, 'Dnipro']]) {
  const l = life('UA', year, 'Dnipro');
  assert.match(l.birthPlace, new RegExp('^' + name));
  assert.equal(P.canonicalCity(name), 'Dnipro');
}
const legacy = life('PH', 1910, 'Manila');
legacy.city = legacy.place = legacy.birthCity = 'Quezon City';
legacy.birthPlace = 'Quezon City, Philippines';
assert.match(P.birthText(load(legacy)), /^khu vực sau này là Quezon City/);
assert.equal(legacy.birthPlace, 'Quezon City, Philippines');

const moving = life('PH', 1938, 'Manila', 24);
moving.urban = false;
const move = { id: 'city', data: { dest: 'Quezon City', cc: 'PH' } };
const initial = { city: moving.city, place: moving.place, money: moving.money, job: moving.job, moved: moving.movedTo };
E.DEC.city.apply(moving, move, 'go', rng, quiet);
assert.deepEqual({ city: moving.city, place: moving.place, money: moving.money, job: moving.job, moved: moving.movedTo }, initial);
assert(!moving.flags.cityAsked);
moving.age++;
E.DEC.city.apply(moving, move, 'go', rng, quiet);
assert.equal(moving.city, 'Quezon City');
const uk = life('UA', 1950, 'Kyiv', 24), logs = [];
const birth = uk.birthPlace;
uk.urban = false;
E.DEC.city.apply(uk, { id: 'city', data: { dest: 'Dnipropetrovsk', cc: 'UA' } }, 'go', rng, message => logs.push(message));
assert.equal(uk.city, 'Dnipro');
assert(logs.some(message => /Dnipropetrovsk/.test(message)));
uk.age += 66;
assert.match(E.placeText(load(uk)), /^Dnipro/);
assert.equal(P.birthText(load(uk)), birth);

const vietnam = life('VN', 1965, null, 24);
assert(E.WORLD120.move(vietnam, 'Hà Nội', quiet, 'Chuyển nơi ở'));
assert(E.H.moveToCity(vietnam, 'Sài Gòn'));
assert.equal(vietnam.prov.old, 'TP. Hồ Chí Minh');
assert.match(E.placeText(vietnam), /Sài Gòn/);

// The same place gets the same evacuation options regardless of birthplace.
const newcomer = life('GB', 2025, 'London', 25);
host(newcomer, 'MM', 'Mandalay');
newcomer.job = { id: 'phu_ho', rank: 0, yrs: 2 };
newcomer.income = newcomer.base;
const dest = C.refuge(newcomer);
assert(dest && dest !== 'Mandalay');
const rebuilding = group(newcomer, 'rebuild');
const flee = rebuilding.opts.find(option => /Sơ tán/.test(option.l));
assert(flee);
newcomer.pending = [rebuilding];
E.resolve(newcomer, flee.k);
assert.equal(newcomer.city, dest);
assert.equal(newcomer.country, 'GB');
assert.equal(newcomer.abroad.code, 'MM');
assert.equal(newcomer.job, null);
assert.equal(newcomer.income, 0);
const record = R.displaced(load(newcomer)).recovery969;
assert.equal(record.from, 'Mandalay');
assert.equal(record.country, 'MM');
assert.equal(newcomer.flags.ctx945.refuge.country, 'MM');
assert(!E.DEC.ctx945_event.valid(newcomer, rebuilding.data));
const saved = load(newcomer);
saved.age++;
assert(!R.returnReady(saved, record), 'the end of the crisis table cannot by itself make Mandalay safe');
host(saved, 'JP', 'Osaka');
assert(!R.returnReady(saved, record), 'local return never crosses a border');

const none = life('GB', 2025, 'London', 24);
host(none, 'MM', 'London', { perm: false });
assert.equal(P.residentCity(none), null);
assert.equal(C.refuge(none), null);
assert.equal(E.placeText(none), 'Myanmar');
none.city = none.place = 'Mandalay';
assert(C.refuge(none));
none.flags.homeVisit907 = {};
assert.equal(C.refuge(none), null);
delete none.flags.homeVisit907;
none.abroad.trapped = true;
assert.equal(C.refuge(none), null);

const student = life('GB', 2011, 'London', 22);
host(student, 'JP', 'Sendai', { perm: false, study: true });
student.coast = false;
assert.equal(H.BY.w_tohoku_2011.who(student), 1);
student.city = student.place = 'Osaka';
student.coast = true;
assert.equal(H.BY.w_tohoku_2011.who(student), 0);
const domesticStudent = life('JP', 2011, 'Tokyo', 22);
domesticStudent.cityStudent = { city: 'Sendai' };
assert.equal(H.BY.w_tohoku_2011.who(domesticStudent), 1);

// Open historical consequences keep advancing after the episode catalogue ends.
const ongoing = life('GB', 2023, 'London', 25);
const trauma = H.open(ongoing, 'trauma', 3);
const hardship = H.open(ongoing, 'hardship', 3);
const displaced = H.open(ongoing, 'displaced', 2);
H.processOpen(ongoing, quiet);
ongoing.age++;
delete ongoing.era920;
H.step(ongoing, rng, quiet);
R.recoveryYear(ongoing, rng, quiet);
assert.equal(trauma.n, 1);
assert.equal(hardship.n, 1);
assert.equal(displaced.n, 1);
const resumed = load(ongoing), undo = JSON.stringify(resumed);
H.step(resumed, rng, quiet);
R.recoveryYear(resumed, rng, quiet);
assert.equal(JSON.stringify(resumed), undo, 'the same year is settled once, even after loading');
resumed.age++;
H.step(resumed, rng, quiet);
assert(H.st(resumed).open.find(o => o.k === 'trauma').n >= 2);

const late = life('GB', 2025, 'London', 30);
H.step(late, rng, quiet);
const lateCase = H.open(late, 'hardship', 2);
late.age++;
H.step(late, rng, quiet);
assert.equal(lateCase.n, 1, 'a choice made after the prior turn starts affecting the next year');
const choice = E.DEC.hist920_choice;
const oldDecision = { id: 'w_civil_wars', year981: 2026, country981: 'GB' };
assert(choice.valid(late, oldDecision));
host(late, 'JP', 'Osaka');
assert(!choice.valid(late, oldDecision));

const pupil = life('PH', 2024, 'Manila', 12);
pupil.school = 'lower'; pupil.schoolEnd = 14;
const homeCase = H.open(pupil, 'displaced', 2);
homeCase.recovery969.schoolDue = 2025;
host(pupil, 'MM', 'Mandalay');
pupil.age++;
const hostCase = H.open(pupil, 'displaced', 2);
assert.notEqual(hostCase, homeCase);
assert.equal(hostCase.recovery969.country, 'MM');
assert.equal(hostCase.recovery969.school.kind, 'lower');
assert.equal(homeCase.recovery969.result, 'relocated981');
assert.equal(homeCase.recovery969.schoolDue, undefined);
assert.equal(H.st(pupil).open.filter(o => o.k === 'displaced').length, 1);

console.log('PASS recovery-geography981: ' + checks + ' dated city lookup cases, evacuation by residence, returned residents, legacy save and ongoing aftermath.');
