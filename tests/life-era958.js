'use strict';
const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const { E } = gameContext();
function life(country, year, age) {
  const l = E.createLife({ country, mode: country === 'VN' ? 'vn' : 'world', seed: 958, year: year - age });
  return Object.assign(l, { age, pending: [], sched: [], job: null, school: null, alive: true });
}

for (const year of [1935, 1987, 2000]) {
  const l = life('GB', year, 16);
  Object.assign(l, { city: 'London', school: 'lower', edu: 1 });
  E.beginYear(l);
  assert(l.pending.some(d => d.id === 'hs'));
  assert(!l.pending.some(d => d.id === 'sixth829'));
  assert(!E.DEC.sixth829.valid(l, {}));
}
const london = life('GB', 2020, 16);
Object.assign(london, { city: 'London', school: 'lower' });
london.flags.study829 = { gcse: 6 };
E.beginYear(london);
assert(london.pending.some(d => d.id === 'sixth829' || d.id === 'gcse857'));
const student = life('FR', 2020, 16);
Object.assign(student, { city: 'London', school: 'lower', abroad: { code: 'GB', study: true } });
assert(E.modernSixth829(student));

const vintage = life('VN', 1935, 15), current = life('VN', 2025, 15);
for (const l of [vintage, current]) l.edu = 2;
assert(!E.DEC.highSchool125.make(vintage, () => .5).text.includes('Amsterdam'));
assert(E.DEC.highSchool125.make(current, () => .5).text.includes('Amsterdam'));
assert(E.DEC.highSchool125.make(vintage, () => .5).opts.some(o => o.l.includes('công lập')));

const job = life('US', 1935, 18);
Object.assign(job, { edu: 7, urban: true, major: 'it' });
assert(!E.jobEligible(job, E.CAR.dev));
for (const roll of [0, .2, .5, .8, .9999]) {
  const offer = E.DEC.job.make(job, () => roll);
  assert(offer.data.offers.every(id => !E.ERA902.jobBlocked(job, id, E.CAR[id])));
  assert(offer.opts.some(o => o.k === 'none'));
}
const emig = E.DEC.emig, early = life('IN', 1965, 25), later = life('IN', 1980, 25);
early.pool = later.pool = 'in';
assert(!emig.destinations(early).some(c => c[0] === 'AE'));
assert(emig.destinations(later).some(c => c[0] === 'AE'));
assert(!emig.valid(early, { c: ['AE', 'UAE', 'ar'] }));
const stale = { id: 'emig', data: { c: ['AE', 'UAE', 'ar'] }, opts: [{ k: 'go' }] };
early.pending = [stale];
const balance = early.money;
E.resolve(early, 'go');
assert(!early.abroad && early.money === balance && early.pending.length === 0);
const shut = life('KP', 1985, 25);
assert(!E.CTX945.emigAllowed(shut) && !emig.valid(shut, {}));
const xkld = E.DEC.xkld;
const routes = y => xkld.routes(life('VN', y, 25)).map(c => c[0]);
assert.deepEqual(Array.from(routes(1992)), []);
assert.deepEqual(Array.from(routes(1997)), ['JP']);
assert(!routes(2003).includes('KR'));
assert(routes(2004).includes('KR'));
assert(!routes(2012).includes('DE'));
assert(routes(2013).includes('DE'));
assert(!xkld.valid(life('VN', 1997, 25), { c: ['KR'] }));
const exam = E.DEC.world_exam173, school = E.DEC.world_school173, work = E.DEC.world_workplace173;
for (const [year, expected] of [[1949,false],[1951,false],[1952,true],[1965,true],[1966,false],[1976,false],[1977,true]]) {
  const l = life('CN', year, 17);
  l.school = 'upper';
  assert.equal(exam.valid(l, {}), expected);
  if (expected) assert(exam.make(l, () => .5).text.includes('Gaokao'));
}
for (const [year, expected] of [[1940,false],[1984,false],[1985,true]]) {
  const l = life('FR', year, 15);
  l.school = 'lower';
  assert.equal(school.make(l, () => .5).text.includes('Định hướng vào lycée'), expected);
}
for (const [year, expected] of [[1940,false],[2010,true]]) {
  const l = life('FR', year, 25);
  l.job = { id: 'ke_toan' };
  assert.equal(work.make(l, () => .5).text.includes('email'), expected);
}
console.log('PASS dated school transitions, historic first-job list, migration and stale decision');
