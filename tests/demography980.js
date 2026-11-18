'use strict';

const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, X = E.ERA920;
const world = G.W.C, eligible = world.filter(country => country.births > 0);
const log = () => {};
const clone = life => E.migrate(JSON.parse(JSON.stringify(life)));
const same = (actual, expected) => assert.equal(JSON.stringify(actual), JSON.stringify(expected));

function create(country, year) {
  return E.createLife({ mode: 'world', country, year, urban: true, seed: 980 });
}

function move(life, code) {
  const place = G.W.BY[code];
  E.H.emigrate(life, [code, place.name, place.pool], () => 0.7, log);
}

// Every selectable country has a complete, positive, integer birth series.
let scores = 0;
for (let year = 1950; year <= 2025; year++) {
  const data = X.birthDistribution(year);
  assert.equal(data.year, year);
  assert.equal(data.projected, year >= 2024);
  assert.equal(data.counts.VA, 0);
  let total = 0;
  for (const country of eligible) {
    const number = data.counts[country.code];
    assert(Number.isInteger(number) && number > 0, country.code + '/' + year);
    total += number;
    scores++;
  }
  assert.equal(data.total, total);
}
assert.equal(scores, 194 * 76);
assert.equal(X.birthDistribution(1900), X.birthDistribution(1950));
assert.equal(X.birthDistribution(1949), X.birthDistribution(1950));
assert.equal(X.birthDistribution(2026), X.birthDistribution(2025));
assert.equal(X.birthDistribution(1950).counts.JP, 2461534);
assert.equal(X.birthDistribution(2025).counts.JP, 748163);
assert.equal(X.birthDistribution(2025).counts.VN, 1328422);
assert.equal(X.birthDistribution(1950).counts.TG, 67170);
assert.equal(X.at('VN', 2024).demographicYear, 2024);
assert.equal(X.at('VN', 2025).demographicYear, 2025);
assert.equal(X.at('VN', 2025).year, 2023, 'GDP, urban and telecom retain the previous source cutoff');
assert.equal(X.at('VN', 2025).tfr, 1.8783);
assert.equal(X.at('VN', 2025).u5, 19.2808);
assert.equal(create('JP', 2025).tfr, X.at('JP', 2025).tfr);
assert.equal(create('JP', 2025).e0nat, X.at('JP', 2025).e0);
assert.equal(create('VA', 2025).country, 'VA', 'explicit legacy country selection still works');

// Exercise the real weighted draw at a percentile which selected Japan in 1950.
const sample = X.birthDistribution(1950);
const japanIndex = world.findIndex(country => country.code === 'JP');
const beforeJapan = world.slice(0, japanIndex).reduce((n, country) => n + sample.counts[country.code], 0);
const percentile = (beforeJapan + sample.counts.JP * 0.5) / sample.total;
const wpick = G.U.wpick;
let countryDraws = 0;
G.U.wpick = (rng, rows, weight) => {
  if (rows !== world) return wpick(rng, rows, weight);
  countryDraws++;
  return wpick(() => percentile, rows, weight);
};
try {
  assert.equal(create('', 1900).country, 'JP');
  assert.equal(create('', 1950).country, 'JP');
  assert.notEqual(create('', 2025).country, 'JP');
  assert.equal(create('MX', 1900).country, 'MX');
  assert.equal(countryDraws, 3);
} finally {
  G.U.wpick = wpick;
}

// Direct migration changes residence-dependent decisions and risk on the same year.
let life = create('GB', 1935);
life.age = 25;
life.flags.familyBias980 = 0;
const origin = { country: life.country, place: life.birthPlace, e0: life.e0, tfr: life.tfr, u5: life.u5 };
X.refresh(life);
const homeMort = life.mort, homeParent = X.parentMort(life, 'F');
assert.equal(X.tfrNow(life), X.at('GB', 1960).tfr);
assert.equal(X.familyTarget(life), 3);
life.kids = [{}, {}];
assert.equal(E.DEC.kid.auto(life, { data: { adopt: false } }, () => .5), 'yes');

move(life, 'JP');
assert.equal(life.era920.resCC, 'JP');
assert.notEqual(life.mort, homeMort);
same(X.parentMort(life, 'F'), homeParent);
assert.equal(X.tfrNow(life), X.at('JP', 1960).tfr);
assert.equal(X.familyTarget(life), 2);
assert.equal(E.DEC.kid.auto(life, { data: { adopt: false } }, () => .5), 'no');
assert.equal(E.devGdp(life), G.W.BY.JP.gdp * X.at('JP', 1960).gdpRel);
assert.deepEqual({ country: life.country, place: life.birthPlace, e0: life.e0, tfr: life.tfr, u5: life.u5 }, origin);

life = clone(life);
const chosen = life.flags.familyPlan108 = { want: 4, spacing: 3, chosenWant874: true };
assert.equal(E.DEC.kid.auto(life, { data: { adopt: false } }, () => .5), 'yes');
assert.equal(chosen.want, 4);
move(life, 'NG');
assert.equal(X.tfrNow(life), X.at('NG', 1960).tfr);
assert.equal(E.DEC.kid.auto(life, { data: { adopt: false } }, () => .5), 'yes');
life.flags.familyPlan108.want = 0;
assert.equal(E.DEC.kid.auto(life, { data: { adopt: false } }, () => .01), 'no');
assert.equal(life.flags.familyBias980, 0);
life.abroad = null;
X.refresh(life);
assert.equal(life.era920.resCC, 'GB');
same(life.mort, homeMort);

// Existing saves from before the expanded series retain their birth snapshot.
const modern = create('GB', 2026);
modern.age = 22;
const modernMort = modern.mort;
modern.flags.wantKids = 3;
modern.abroad = { code: 'JP', name: 'Nhật Bản', perm: false, study: true };
const saved = clone(modern);
same(saved.mort, modernMort, 'loading does not apply a year of local health context before the next turn');
X.refresh(saved);
assert(!saved.era920 && saved.flags.resMort980.resCC === 'JP');
assert.notEqual(saved.mort, modernMort);
assert.equal(X.tfrNow(saved), X.demography('JP', 2025).tfr);
assert.equal(E.devGdp(saved), G.W.BY.JP.gdp * X.at('JP', 2025).gdpRel);
X.familyTarget(saved, () => { throw Error('legacy preference must not be rerolled'); });
saved.abroad = null;
X.refresh(saved);
same(saved.mort, modernMort);
assert.equal(X.familyTarget(saved), 3);

console.log('PASS demography980: ' + scores + ' birth records, real random draw, two end years, migration, return, old saves and family preference.');
