'use strict';
const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const { E } = gameContext();
const first = 'k955_doi_the_thao', next = 'k955_the_thao_mua_sau';
const record = l => l.flags.schoolSport955;

function pupil(country, year, city, age = 12) {
  const l = E.createLife({ mode: 'world', country, year: year - age, seed: 957 });
  return Object.assign(l, { age, school: 'lower', city, urban: true, pending: [], sched: [] });
}
function choose(l, id, choice, rng) {
  const decision = E.DEC[id];
  assert(decision.valid(l));
  const d = decision.make(l, rng);
  assert(d.opts.some(o => o.k === choice));
  if (rng) decision.apply(l, d, choice, rng, () => {});
  else { l.pending = [d]; E.resolve(l, choice); }
}

const l = pupil('VN', 2000, 'Hà Nội');
l.talentSub = 'bóng đá';
const skill = l.skill;
choose(l, first, 'thu', () => 0);
assert.equal(record(l).role, 'reserve');
assert.equal(record(l).nextAge, 13);
assert(l.skill > skill);
assert.equal(E.DEC[next].valid(l), false);

const saved = E.migrate(JSON.parse(JSON.stringify(l)));
saved.age++;
const teammate = record(saved).teammate.name;
const trust = record(saved).teammate.trust;
E.beginYear(saved, { auto: false });
saved.pending = [];
E.finishYear(saved);
const follow = saved.pending.find(d => d.id === next);
assert(follow?.text.includes(teammate));
saved.pending = [];
choose(saved, next, 'compete', () => 0);
assert.equal(record(saved).role, 'starter');
assert(record(saved).teammate.trust > trust);
assert.equal(record(saved).seasons, 2);
saved.age++;
choose(saved, next, 'steady', () => 0);
assert.equal(record(saved).role, 'reserve');
saved.age++;
choose(saved, next, 'leave');
assert(record(saved).closed);
saved.age++;
assert(!E.DEC[next].valid(saved));

const transition = pupil('VN', 2000, 'Hà Nội', 14);
choose(transition, first, 'thu', () => 0);
transition.age++;
E.beginYear(transition, { auto: false });
const hs = transition.pending.find(d => d.id === 'hs');
assert(hs && !transition.school);
transition.pending = [hs];
E.resolve(transition, 'voc');
assert.equal(transition.school, 'voc');
E.finishYear(transition);
assert(transition.pending.some(d => d.id === next));
transition.pending = [];
transition.age = 17;
choose(transition, next, 'pause');
assert(record(transition).closed);
assert(!E.DEC[next].valid(transition));

const retry = pupil('JP', 1990, 'Tokyo');
choose(retry, first, 'thu', () => .999);
assert.equal(record(retry).role, 'retry');
retry.age++;
choose(retry, next, 'pause');
assert.equal(record(retry).role, 'rest');
retry.age++;
retry.abroad = { code: 'NZ', study: true };
retry.city = 'Auckland';
choose(retry, next, 'compete', () => 0);
assert.equal(record(retry).sport, 'rugby');
assert.equal(record(retry).role, 'reserve');
assert.equal(record(retry).seasons, 1);

const disruption = pupil('JP', 2010, 'Sendai');
choose(disruption, first, 'thu', () => 0);
disruption.age++;
const paused = E.DEC[next].make(disruption, () => 0);
assert(!paused.opts.some(o => o.k === 'compete' || o.k === 'steady'));
assert(paused.opts.some(o => o.k === 'pause'));

const early = pupil('NZ', 1910, 'Auckland');
early.school = 'primary';
assert.equal(E.KID955.teamOf(early), 'athletics');
assert.equal(E.KID955.teamOf(pupil('NZ', 2000, 'Auckland')), 'rugby');
const canadian = pupil('CA', 2000, 'Montréal');
assert.equal(E.KID955.teamOf(canadian), 'hockey');
canadian.urban = false;
assert.equal(E.KID955.teamOf(canadian), 'athletics');
assert.equal(E.KID955.teamOf(pupil('IS', 2000, 'Reykjavík')), 'athletics');
console.log('PASS school sport: reserve, starter, retry, pause, leaving, reload, moving school, disruption and country/year rules');
