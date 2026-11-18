'use strict';

const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const { E } = gameContext();
const C = E.CTX945, P = E.ERA920.POL, R = E.ERA969;
const rng = () => .75, quiet = () => {};

function life(country, city, year, age = 12) {
  const person = E.createLife({ mode: 'world', country, city, urban: true, year: year - age, seed: 986 });
  return Object.assign(person, { age, alive: true, pending: [], sched: [], job: null, indep: age >= 18, ownHouse: false,
    money: person.base * 4, school: age < 18 ? 'lower' : null, schoolEnd: null, edu: 1 });
}
function choose(person, decision, key) {
  const choice = decision.opts.find(option => decision.data.keys?.[+option.k] === key || option.k === key);
  assert(choice, key);
  person.pending = [decision];
  E.resolve(person, choice.k);
}
function activate(person) {
  E.beginYear(person, { auto: false });
  const decision = person.pending.find(d => d.id === 'ctx945_event' && d.data.arg.kind === 'rebuild');
  assert(decision, person.city);
  return decision;
}
const load = person => E.migrate(JSON.parse(JSON.stringify(person)));

for (const [country, year, city, local, nextYear, text] of [
  ['WS', 2009, 'Lalomanu', 3, 1, /bờ nam và đông Upolu/],
  ['WS', 2009, 'Poutasi', 3, 1, /29\/9\/2009/],
  ['WS', 2009, 'Salelologa', 0, 0, null],
  ['TO', 2009, 'Niuatoputapu', 3, 1, /Niuatoputapu/],
  ['TO', 2022, 'Mango', 3, 1, /Hunga Tonga/],
  ['TO', 2022, 'Kanokupolu', 3, 1, /Tongatapu/],
  ['TO', 2022, 'Neiafu', 1, 0, /Vavaʻu/],
  ['TO', 2022, 'Niuatoputapu', 0, 0, null],
  ['VU', 2024, 'Port Vila', 3, 1, /17\/12\/2024/],
  ['VU', 2024, 'Etas', 3, 1, /Efate/],
  ['VU', 2024, 'Pango', 1, 1, /chỗ trú tạm/],
  ['VU', 2024, 'Luganville', 0, 0, null]
]) {
  const person = life(country, city, year), context = C.of(person);
  assert.equal(P.residentCity(person), city);
  assert.equal(context.dis, local);
  assert.equal(C.levelAt(country, year + 1, city).dis, nextYear);
  if (text) assert.match(context.labels.dis, text);
}

const samoa = life('WS', 'Poutasi', 2009);
assert.equal(C.refuge(samoa), 'Apia');
const samoanEvent = activate(samoa);
choose(samoa, samoanEvent, 'aid');
const temporary = R.currentRecovery(samoa);
assert.equal(temporary.school.kind, 'lower');
assert.equal(temporary.destination984.city, 'Poutasi');
assert.equal(temporary.shelter984, true);
assert.equal(samoa.school, null);
assert.equal(C.disasterAgenda(samoa), null);
assert(!E.DEC.ctx945_event.valid(samoa, samoanEvent.data));
assert.equal(C.refuge(life('TO', 'Niuatoputapu', 2009)), null);

const tonga = life('TO', 'Atatā', 2022);
const tongaEvent = activate(tonga);
assert(tongaEvent.opts.some(option => /Nuku'alofa/.test(option.l)));
choose(tonga, tongaEvent, 'move');
assert.equal(P.residentCity(tonga), "Nuku'alofa");
assert.equal(R.currentRecovery(tonga).from, 'Atatā');
for (const year of [2022, 2023, 2024, 2025, 2026]) assert(!C.safeReturn('TO', year, "Nuku'alofa", 'Atatā'));
assert.equal(C.levelAt('TO', 2023, "Nuku'alofa").school, 1);

const portVila = life('VU', 'Port Vila', 2024);
portVila.ownHouse = true;
const earthquake = activate(portVila);
assert(earthquake.opts.some(option => /Pango/.test(option.l)));
assert(!earthquake.opts.some(option => /Luganville/.test(option.l)));
choose(portVila, earthquake, 'move');
assert.equal(P.residentCity(portVila), 'Pango');
assert.equal(portVila.birthCity, 'Port Vila');
const restored = load(portVila), q = R.currentRecovery(restored);
assert.equal(q.disaster986.year, 2024);
assert.equal(q.school.kind, 'lower');
assert.equal(restored.school, null);
assert.equal(restored.ownHouse, true);
assert(!R.returnReady(restored, q));
let menu = E.act(restored, 'recovery969');
assert(menu.opts.some(option => /Tìm chỗ thuê/.test(option.l)), 'sở hữu nhà cũ chưa đồng nghĩa đã có chỗ ở');
assert(!menu.opts.some(option => /Xin tiếp tục chương trình/.test(option.l)));
choose(restored, menu, 'rent');
restored.age++;
restored.pending = [];
R.recoveryYear(restored, rng, quiet);
menu = restored.pending.find(d => d.id === 'recovery969');
assert.match(menu.text, /lớp học tạm/);
assert(menu.opts.some(option => /trở về Port Vila/.test(option.l)));
choose(restored, menu, 'school');
assert.equal(q.schoolDue, 2026);
restored.age++;
R.recoveryYear(restored, rng, quiet);
assert.equal(restored.school, 'lower');
assert.equal(q.schoolDone, true);

const outside = life('VU', 'Luganville', 2024);
assert(!C.disasterAgenda(outside));
E.beginYear(outside);
assert(!outside.pending.some(d => d.id === 'ctx945_event' && d.data.arg.kind === 'rebuild'));

for (const year of [2024, 2025]) {
  const person = life('HT', 'Port-au-Prince', year);
  person.fam.q = 1;
  assert.match(C.at('HT', year).labels.fam, /khủng hoảng lương thực nghiêm trọng/i);
  assert.equal(C.of(person).fam, 2);
  E.ERA920.HIST.open(person, 'displaced', 2);
  R.recordDisplacement(person, 'HT', 'Port-au-Prince', null);
  assert.equal(C.of(person).fam, 3);
  const wealthy = life('HT', 'Port-au-Prince', year);
  wealthy.fam.q = 5;
  assert.equal(C.of(wealthy).fam, 1);
  const other = life('HT', 'Cap-Haïtien', year);
  other.fam.q = 3;
  assert.equal(C.levelAt('HT', year, 'Gonaïves').fam, 2);
  assert.equal(C.of(other).fam, 1);
  other.fam.q = 1;
  assert.equal(C.of(other).fam, 2);
  assert(C.foodK(C.of(person)) > C.foodK(C.of(wealthy)));
  assert.equal(C.levelAt('HT', year, 'Port-au-Prince').fam, 2, 'household factors do not change cached area data');

  const hunger = E.DEC.ctx945_event.make(person, rng, { kind: 'hunger', cc: 'HT', city: 'Port-au-Prince', y: year });
  assert.match(hunger.text, /khủng hoảng lương thực nghiêm trọng/i);
  assert.doesNotMatch(hunger.text, /nạn đói/i);
  assert(!hunger.opts.some(o => /rau rừng|Dành tiền/.test(o.l)));
  assert(hunger.opts.some(o => /điểm hỗ trợ/.test(o.l)));
  person.pending = [hunger];
  hunger.data.keys[0] = 'wild';
  hunger.opts[0].l = 'Đào củ, hái rau rừng';
  const old = load(person);
  assert(old.pending[0].opts.some(o => /điểm hỗ trợ/.test(o.l)));
  assert(!old.pending[0].opts.some(o => /rau rừng/.test(o.l)));
  choose(old, old.pending[0], 'ration');
  assert(old.log.some(entry => /giảm khẩu phần/.test(entry.t)));
}
assert.equal(C.levelAt('HT', 2023, 'Cap-Haïtien').fam, 1);
console.log('PASS pacific-disasters-haiti986: geography and dates, local shelter, actual relocation, return, school recovery and Haiti household food access');
