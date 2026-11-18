'use strict';

const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const { E } = gameContext();
const roll = () => .5;
const quiet = () => {};

function couple(country, year, age, partnerAge = age, same = true) {
  const person = E.createLife({ mode: country === 'VN' ? 'vn' : 'world', country, year: year - age, seed: 983, gender: 'F' });
  Object.assign(person, { age, school: null, pending: [], sched: [], money: person.base * 10 });
  person.partner = { name: 'Mai', sex: same ? 'F' : 'M', age: partnerAge, status: 'dating', alive: true, since: age - 2, affection108: 85 };
  Object.assign(person.fam, { mAlive: true, noMom: false });
  return person;
}

const offer = p => E.DEC.marry.make(p, roll);
const keys = d => Array.from(d.opts, option => option.k);
const load = p => E.migrate(JSON.parse(JSON.stringify(p)));
function choose(p, d, key) {
  assert(keys(d).includes(key), key);
  p.pending = [d];
  E.resolve(p, key);
}
const wedding = p => p.pending.find(d => d.id === 'marry');

const early = couple('TH', 1990, 29);
delete early.era920; // Legacy life without demographic-era data.
assert.equal(E.H.sameSexLegal(early), false);
assert.deepEqual(keys(offer(early)), ['marry', 'wait', 'split']);
assert.match(offer(early).text, /17 tuổi/);

let longTerm = couple('TH', 2024, 28);
const oldMenu = offer(longTerm);
assert(!keys(oldMenu).includes('small'));
assert(oldMenu.opts.some(o => o.k === 'marry' && /chung sống/.test(o.l)));
assert(!E.DEC.cuoi_to_chuc.valid(longTerm, {}));
choose(longTerm, oldMenu, 'marry');
assert.equal(longTerm.pending[0].id, 'contract108');
E.resolve(longTerm, 'default');
assert.equal(longTerm.partner.status, 'cohabit');
longTerm = load(longTerm);
longTerm.age++;
longTerm.partner.age++;
longTerm.pending = [];
E.beginYear(longTerm);
let review = wedding(longTerm);
assert(review);
assert.match(review.text, /23\/1\/2025/);
assert(review.opts.some(o => o.k === 'small' && /văn phòng huyện/.test(o.l)));
choose(longTerm, review, 'wait');
longTerm.age++;
longTerm.partner.age++;
longTerm.pending = [];
E.beginYear(longTerm);
assert(!wedding(longTerm), 'no annual reminder after the first offer');
review = E.act(longTerm, 'thaiMarriage983');
assert(review);
E.resolve(longTerm, 'small');
assert.equal(longTerm.partner.status, 'married');
assert.equal(longTerm.partner.cohabitedSince983, 28);

let young = couple('TH', 2024, 17, 18, false);
assert(E.DEC.marry.valid(young, {}));
assert(keys(offer(young)).includes('thai_consent'));
assert(!keys(offer(young)).includes('small'));
choose(young, offer(young), 'thai_consent');
assert.equal(young.partner.status, 'dating');
young = load(young);
assert(young.partner.thaiConsent983);
assert(keys(wedding(young)).includes('small'));
E.resolve(young, 'small');
assert.equal(young.partner.status, 'married');

for (const [age, pAge] of [[17, 20], [20, 17]]) {
  const underage = couple('TH', 2025, age, pAge, false);
  assert(!E.DEC.marry.valid(underage, {}));
  assert.deepEqual(keys(offer(underage)), ['wait']);
}
const waiting = couple('TH', 2025, 19, 21);
waiting.partner.familyObjection130 = { side: 'parents', resolved: false };
choose(waiting, offer(waiting), 'thai_consent');
assert(!waiting.partner.thaiConsent983);
assert(!keys(offer(waiting)).includes('thai_consent'));
assert(!E.DEC.cuoi_to_chuc.valid(waiting, {}));
choose(waiting, offer(waiting), 'cohabit');
assert.equal(waiting.partner.status, 'cohabit');
waiting.age++;
waiting.partner.age++;
assert(keys(offer(waiting)).includes('small'));
assert(!keys(offer(waiting)).includes('thai_consent'));

const partnerNeedsConsent = couple('TH', 2025, 22, 19);
assert(keys(offer(partnerNeedsConsent)).includes('thai_consent'));
const expecting = couple('TH', 2025, 19, 21, false);
const pregnancy = E.DEC.co_bau_som.make(expecting, roll);
assert(pregnancy.opts.some(o => o.k === 'cuoi' && /thu xếp điều kiện/.test(o.l)));
choose(expecting, pregnancy, 'cuoi');
assert.equal(expecting.partner.status, 'dating');
assert.equal(expecting.kids.length, 1);
assert.equal(expecting.flags.marryWhenLegal, expecting.partner.name);

const royal = couple('TH', 2024, 25);
royal.flags.royal = {c:'TH'};
const palace = E.DEC.r_hon_nhan.make(royal, roll);
E.DEC.r_hon_nhan.apply(royal, palace, 'love', () => .05, quiet);
assert.equal(royal.partner.status, 'dating');

const thaiWedding = couple('TH', 2025, 25);
choose(thaiWedding, offer(thaiWedding), 'marry');
assert.equal(thaiWedding.pending[0].id, 'contract108');
E.resolve(thaiWedding, 'default');
const venue = thaiWedding.pending[0];
assert.equal(venue.id, 'cuoi_to_chuc');
assert(E.DEC.cuoi_to_chuc.valid(thaiWedding, venue.data));
thaiWedding.abroad = { code:'JP', name:'Nhật Bản', perm:true };
assert(!E.DEC.cuoi_to_chuc.valid(thaiWedding, venue.data));

const traveler = couple('VN', 2024, 30);
choose(traveler, offer(traveler), 'nuoc_ngoai');
let picker = traveler.pending[0];
assert(picker.data.cs.includes('NL'));
assert(!picker.data.cs.includes('TH'));
// Restore a picker from the old static list. An illegal destination cannot charge or change status.
picker.data = { p:0, cs:['TH','NL'] };
picker.opts = [{k:'n0',l:'Thái Lan'},{k:'n1',l:'Hà Lan'}];
const restored = load(traveler);
const savedMoney = restored.money;
E.resolve(restored, 'n0');
assert.equal(restored.partner.status, 'dating');
assert.equal(restored.money, savedMoney);
assert(!restored.abroad);
assert.equal(E.moveAbroadMarried(restored, roll, quiet, 'TH'), false);
restored.age++;
restored.partner.age++;
restored.pending = [];
choose(restored, offer(restored), 'nuoc_ngoai');
picker = restored.pending[0];
choose(restored, picker, 'n' + picker.data.cs.indexOf('TH'));
assert.equal(restored.partner.status, 'married');
assert.equal(restored.abroad.code, 'TH');

const resident = couple('JP', 2025, 21, 18);
resident.abroad = { code:'TH', name:'Thái Lan', perm:true };
assert(E.H.sameSexLegal(resident));
assert(keys(offer(resident)).includes('thai_consent'));
const proposal = offer(resident);
resident.partner = { name:'Someone else', age:25, sex:'F', status:'dating' };
assert(!E.DEC.marry.valid(resident, proposal.data), 'pending choice belongs to the original partner');

const priorSpouse = couple('TH', 2025, 18, 19, false);
priorSpouse.partner.status = 'married';
priorSpouse.partner.since = 17;
E.finishYear(priorSpouse);
assert.equal(priorSpouse.partner.status, 'married');
console.log('PASS thailand-marriage983: historical recognition, ages, consent, cohabitation, old saves and destination validation');
