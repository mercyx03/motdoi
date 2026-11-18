'use strict';
const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, C = E.CTX945, P = E.ERA920.POL, T = E.ERA969;
const log = () => {}, rng = () => 0.8;

function born(country, year, city) {
  return E.createLife({ mode: 'world', country, year, city, seed: 979, urban: true });
}

function resident(country, year, city, age = 25) {
  const life = born(country, year - age, city);
  life.age = age;
  life.city = life.place = city;
  life.money = life.base * 10;
  life.indep = age >= 18;
  return life;
}

function event(life, kind) {
  const arg = { kind, y: life.birthYear + life.age, cc: life.country, city: life.city };
  return E.DEC.ctx945_event.make(life, rng, arg);
}

let countryYears = 0;
for (const { code, births } of G.W.C) {
  for (let y = 1900; y <= 2025; y++) {
    const context = C.at(code, y);
    assert([context.war, context.fam, context.dis, context.epi].every(v => Number.isInteger(v) && v >= 0 && v <= 3), `${code}/${y}`);
    if (births > 0) {
      const cities = P.cities(code, y);
      assert(cities.length && cities.every(city => P.cityAllowed(code, y, city)), `${code}/${y}`);
    }
    countryYears++;
  }
}

assert.match(P.status('PK', 1900), /chưa thành lập/);
assert.equal(C.colonyAt('PK', 1946), 'Anh');
assert.equal(C.colonyAt('PK', 1947), null);
assert.equal(C.colonyAt('MA', 1911), null);
assert.match(P.status('DE', 1948), /các vùng chiếm đóng/);
assert.match(P.status('DE', 1949), /Cộng hòa Dân chủ Đức/);
assert.match(P.nameAt('BD', 1954), /Đông Bengal/);
assert.equal(P.nameAt('BD', 1955), 'Đông Pakistan');
assert.match(P.status('KR', 1945), /Nhật Bản/);
assert.match(P.status('UA', 1922), /Liên Xô/);
assert.match(P.status('SS', 2011), /độc lập/);

const p = born('PK', 1900, 'Lyallpur');
assert.equal(p.city, 'Faisalabad');
assert.match(p.birthPlace, /^Lyallpur.*Ấn Độ thuộc Anh/);
assert.notEqual(born('BZ', 1966, 'Belmopan').city, 'Belmopan');
assert.match(born('BZ', 1967, 'công trường Belmopan').birthPlace, /công trường Belmopan/);
assert.doesNotMatch(born('BZ', 1970, 'Belmopan').birthPlace, /công trường/);
assert.match(born('ZA', 2020, 'Gqeberha').birthPlace, /Port Elizabeth/);
assert.match(born('ZA', 2021, 'Port Elizabeth').birthPlace, /Gqeberha/);

const local = resident('PK', 1976, 'Karachi');
const oldBirth = local.birthPlace;
E.H.moveToCity(local, 'Lyallpur');
assert.equal(local.city, 'Faisalabad');
assert.match(E.placeText(local), /^Lyallpur/);
local.age++;
const restored = E.migrate(JSON.parse(JSON.stringify(local)));
assert.equal(restored.birthPlace, oldBirth);
assert.match(E.placeText(restored), /^Faisalabad/);
const legacy = E.migrate(JSON.parse(JSON.stringify(p)));
legacy.birthPlace = 'Faisalabad, Pakistan';
assert.match(P.birthText(legacy), /^Lyallpur, Ấn Độ thuộc Anh$/);
assert.equal(legacy.birthPlace, 'Faisalabad, Pakistan');

const migrant = resident('GB', 1974, 'London');
E.H.emigrate(migrant, ['PK', 'Pakistan', G.W.BY.PK.pool], () => 0.55, log);
assert.match(E.placeText(migrant), /Pakistan$/);
assert.match(migrant.birthPlace, /London/);

assert.match(P.status('UA', 2024), /tấn công toàn diện/);
assert.notEqual(P.status('SY', 2024), P.status('SY', 2025));
assert.match(P.status('AF', 2025), /Taliban/);
const ukrainian = born('UA', 2025, 'Kharkiv');
assert(!ukrainian.era920);
const politics = E.HOOKS.year.find(fn => fn.toString().includes('m.polCC'));
const entries = [];
politics(ukrainian, rng, text => entries.push(text));
politics(ukrainian, rng, text => entries.push(text));
assert.equal(entries.length, 1);
assert.match(entries[0], /Bối cảnh năm 2025/);
assert(C.levelAt('UA', 2025, 'Kharkiv').war > C.levelAt('UA', 2025, 'Lviv').war);

assert.equal(C.levelAt('PS', 2023, 'Gaza').fam, 2);
assert.match(C.levelAt('PS', 2023, 'Gaza').labels.fam, /nguy cơ nạn đói/);
assert.equal(C.levelAt('PS', 2025, 'Gaza').fam, 3);
assert.equal(C.levelAt('PS', 2025, 'Khan Younis').fam, 2);
assert.equal(C.levelAt('PS', 2025, 'Hebron').fam, 1);
assert.equal(C.levelAt('SD', 2024, 'El Fasher').fam, 2);
assert.equal(C.levelAt('SD', 2025, 'El Fasher').fam, 3);
assert.equal(C.levelAt('SD', 2025, 'Kadugli').fam, 3);
assert.equal(C.levelAt('SD', 2025, 'Port Sudan').fam, 2);
assert.match(C.levelAt('SD', 2024, 'Nyala').labels.war, /Nam Darfur/);

const gaza = resident('PS', 2025, 'Gaza');
assert(!C.localEvacuationRoute('PS', 2025, 'Gaza', 'Hebron'));
assert(!T.returnReady(gaza, { country: 'PS', from: 'Hebron', at: 2024 }));
const shelter = event(gaza, 'shelter');
assert.equal(C.refuge(gaza), null);
assert(shelter.opts.some(option => /trú tạm trong khu vực/.test(option.l)));
assert(!shelter.opts.some(option => /Hebron|Nablus|Ramallah/.test(option.l)));

const student = resident('MM', 2025, 'Mandalay', 12);
student.school = 'lower';
student.schoolEnd = 14;
assert.match(event(student, 'school').text, /thiên tai/);
assert(C.EV.school.when(C.of(student), student));
assert(!C.EV.school.when(C.of(student), { age: 12, school: null }));
const yangon = resident('MM', 2025, 'Yangon', 12);
assert(C.incomeK(C.of(student)) < C.incomeK(C.of(yangon)));
const dest = C.refuge(student);
assert(dest && dest !== 'Mandalay');
const oldSchool = event(student, 'school');
const rebuilding = event(student, 'rebuild');
const move = rebuilding.opts.find(option => /Sơ tán/.test(option.l));
assert(move);
student.pending = [rebuilding];
E.resolve(student, move.k);
assert.equal(student.city, dest);
assert.equal(T.displaced(student).recovery969.school.kind, 'lower');
assert.equal(student.school, null);
assert(!E.DEC.ctx945_event.valid(student, oldSchool.data));

const worker = resident('MM', 2025, 'Mandalay');
worker.job = { id: 'phu_ho', rank: 0, yrs: 2 };
worker.income = worker.base;
const moveWorker = event(worker, 'rebuild');
worker.pending = [moveWorker];
E.resolve(worker, moveWorker.opts.find(option => /Sơ tán/.test(option.l)).k);
assert.notEqual(worker.city, 'Mandalay');
assert.equal(worker.job, null);
assert.equal(worker.income, 0);
assert(worker.flags.needJob && T.displaced(worker));

console.log(`PASS history-context979: ${countryYears} country-years; historical birth and relocation, saved names, recent crises, study, jobs and actual evacuation`);
