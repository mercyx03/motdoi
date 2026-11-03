'use strict';
const assert = require('node:assert/strict');
const E = require('./hardcore-isolation').gameContext().E;
const l = E.createLife({ mode: 'vn', seed: 831 });
l.sex = 'M';
delete l.flags.hair915;
for (let age = 0; age <= 9; age++) {
  l.age = age;
  E.HEALTH915.hairYear(l);
  assert(E.BEAUTY919.hair(l).len <= (age ? 12 : 2));
  assert.equal(E.DEC.weather125.valid(l), false);
}
l.flags.hair915.len = 120;
assert(E.BEAUTY919.hair(l).len <= 12);
const style = E.DEC.beauty919;
const menu = style.make(l, () => .5, { tab: 'style' });
style.apply(l, menu, String(menu.data.keys.indexOf('routine')), () => .5, () => {});
const before = l.flags.hair915.len;
l.age++;
E.HEALTH915.hairYear(l);
assert.equal(l.flags.hair915.len, before + 13);
l.age = 13;
for (const [sex, title, wrong] of [['F', 'Mẹ kế', 'Bố kế'], ['M', 'Bố dượng', 'Mẹ dượng']]) {
  l.fam.fAlive = sex === 'F';
  l.fam.noDad = false;
  l.fam.mAlive = !l.fam.fAlive;
  delete E.FAMILY129.state(l).stepParent;
  const d = E.DEC.di_buoc_nua.make(l, () => .5);
  const lines = [];
  E.DEC.di_buoc_nua.apply(l, d, 'ung_ho', () => .5, t => lines.push(E.H.famFix(l, t)));
  const person = E.FAMILY129.state(l).stepParent;
  assert.equal(person.sex, sex);
  const tail = ' ' + person.name + ' trở thành một thành viên trong gia đình.';
  assert(lines.includes(title + tail));
  l.log.push({ a: 13, t: wrong + tail });
  E.migrate(l);
  assert.equal(l.log.at(-1).t, title + tail);
}
console.log('PASS newborn weather, childhood hair, remarriage and legacy journal');
