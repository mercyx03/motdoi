'use strict';

const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const { E, W } = gameContext();
const P = E.ERA920.POL, C = E.CTX945;

function born(country, city, year) {
  return E.createLife({ mode: 'world', country, city, year, urban: true, seed: 985 });
}
function adult(country, city, year) {
  const person = born(country, city, year - 20);
  return Object.assign(person, { age: 20, indep: true, ownHouse: false, money: person.base * 30, pending: [] });
}
const load = person => E.migrate(JSON.parse(JSON.stringify(person)));

for (const [country, city, year, kind, ruler, warKind, description] of [
  ['PH', 'Manila', 1935, 'commonwealth', 'Mỹ', null, /tự trị/],
  ['PH', 'Manila', 1941, 'commonwealth', 'Mỹ', 'war', /tháng 12/],
  ['PH', 'Manila', 1942, 'occupation', 'Nhật Bản', 'occ', /lưu vong/],
  ['PH', 'Manila', 1943, 'occupation', 'Nhật Bản', 'occ', /Đệ nhị Cộng hòa/],
  ['PH', 'Manila', 1944, 'occupation', 'Nhật Bản', 'occ', /Leyte/],
  ['PH', 'Manila', 1945, 'transition', 'Mỹ', 'war', /giành lại Manila/],
  ['PH', 'Manila', 1946, 'independent', null, 'ins', /4\/7\/1946/],
  ['TL', 'Dili', 1941, 'colony', 'Bồ Đào Nha', null, /thuộc địa Bồ Đào Nha/],
  ['TL', 'Dili', 1942, 'occupation', 'Nhật Bản', 'occ', /tháng 2/],
  ['TL', 'Dili', 1944, 'occupation', 'Nhật Bản', 'occ', /tuyên bố chủ quyền/],
  ['TL', 'Dili', 1945, 'transition', 'Bồ Đào Nha', 'occ', /đầu hàng năm 1945/],
  ['TL', 'Dili', 1946, 'colony', 'Bồ Đào Nha', null, /quản lý của Bồ Đào Nha/]
]) {
  const person = born(country, city, year), context = C.of(person);
  assert.equal(context.authority.kind, kind);
  assert.equal(context.colony, ruler);
  assert.equal(context.warKind, warKind);
  assert.match(P.note(person), description);
  E.beginYear(person, { auto: false });
  E.finishYear(person);
  assert(person.log.some(entry => description.test(entry.t)), country + '/' + city + '/' + year);
}
assert.equal(C.levelAt('TL', 1943, 'Dili').war, 3);
assert.equal(C.levelAt('TL', 1943, 'Baucau').war, 2);
assert.equal(C.safeReturn('TL', 1944, 'Baucau', 'Dili'), false);

for (const [city, area, label, ruler, war] of [
  ['Kuala Lumpur', 'malaya', 'Liên bang Malaya', null, 1],
  ['Kuching', 'sarawak', 'Sarawak', 'Anh', 0],
  ['Jesselton', 'sabah', 'Bắc Borneo', 'Anh', 0]
]) {
  const person = born('MY', city, 1958), context = C.of(person);
  assert.equal(context.region.area, area);
  assert.equal(context.region.label, label);
  assert.equal(context.colony, ruler);
  assert.equal(context.war, war);
  assert.equal(P.birthText(person), city + ', ' + label);
}
assert.equal(P.authorityAt('MY', 1940, 'Kuching').kind, 'protectorate');
assert.equal(P.authorityAt('MY', 1947, 'Kuching').kind, 'colony');
assert.equal(P.authorityAt('MY', 1963, 'Kuching').kind, 'federation');
assert.equal(P.regionAt('MY', 1963, 'Jesselton').label, 'Sabah');
assert.equal(P.cityLabel('MY', 1967, 'Kota Kinabalu'), 'Jesselton');
assert.equal(P.cityLabel('MY', 1968, 'Jesselton'), 'Kota Kinabalu');
assert.equal(P.cityLabel('MY', 1958, 'Shah Alam'), 'khu vực Batu Tiga');
assert.equal(P.regionAt('MY', 1973, 'Kuala Lumpur').label, 'Selangor');
assert.equal(P.regionAt('MY', 1974, 'Kuala Lumpur').label, 'Lãnh thổ Liên bang Kuala Lumpur');
assert.equal(C.localEvacuationRoute('MY', 1962, 'Kuching', 'Jesselton'), false);
assert.equal(C.localEvacuationRoute('MY', 1963, 'Kuching', 'Jesselton'), true);

const malaya = adult('MY', 'Kuala Lumpur', 1958);
const before = E.act(malaya, 'chuyen_noi_o');
assert(before.opts.some(option => /Johor Bahru.*Liên bang Malaya/.test(option.l)));
assert(!before.opts.some(option => /Kuching|Jesselton/.test(option.l)));
assert.equal(E.H.moveToCity(malaya, 'Kuching'), false);
malaya.pending = [];
malaya.age += 5;
const after = E.act(malaya, 'chuyen_noi_o');
const route = after.opts.find(option => /Chuyển đến Kuching · Sarawak/.test(option.l));
assert(route);
const moved = load(malaya);
E.resolve(moved, route.k);
assert.equal(P.residentCity(moved), 'Kuching');
assert.equal(C.of(moved).region.area, 'sarawak');
assert.match(E.placeText(moved), /^Kuching, Sarawak$/);
assert.match(P.birthText(moved), /^Kuala Lumpur, Malaya$/);

assert.equal(P.authorityAt('DE', 1947, 'Dresden').ruler, 'Liên Xô');
assert.equal(P.authorityAt('DE', 1947, 'Munich').ruler, 'Mỹ');
assert.equal(P.authorityAt('DE', 1947, 'Hamburg').ruler, 'Anh');
assert.match(P.status('DE', 1947, 'Tây Berlin'), /Mỹ, Anh và Pháp/);
assert(P.cities('DE', 1944).includes('Berlin'));
assert(!P.cities('DE', 1945).includes('Berlin'));
assert(P.cities('DE', 1945).includes('Đông Berlin'));
assert(P.cities('DE', 1989).includes('Tây Berlin'));
assert(P.cities('DE', 1990).includes('Berlin'));
assert(!P.cityAllowed('US', 1965, 'Tây Berlin'));
assert.equal(P.moveReason('DE', 1951, 'Dresden', 'Munich'), true);
assert.notEqual(P.moveReason('DE', 1952, 'Dresden', 'Munich'), true);
assert.equal(P.moveReason('DE', 1960, 'Đông Berlin', 'Tây Berlin'), true);
assert.notEqual(P.moveReason('DE', 1961, 'Đông Berlin', 'Tây Berlin'), true);
assert.equal(P.moveReason('DE', 1989, 'Dresden', 'Munich'), true);

const east = adult('DE', 'Dresden', 1965), west = adult('DE', 'Munich', 1965);
assert.equal(C.emigAllowed(east), false);
assert.equal(C.emigAllowed(west), true);
assert.equal(C.of(east).purge, 1);
assert.equal(C.of(west).purge, 0);
assert.equal(C.levelAt('DE', 1965, 'Berlin').purge, 0);
assert.match(P.note(east), /Dân chủ Đức/);
assert.match(P.note(west), /Liên bang Đức/);
assert(!E.act(east, 'chuyen_noi_o').opts.some(option => /Munich|Tây Berlin/.test(option.l)));
assert.equal(C.safeReturn('DE', 1988, 'Munich', 'Dresden'), false);
assert.equal(C.safeReturn('DE', 1989, 'Munich', 'Dresden'), true);
assert.equal(E.H.moveToCity(east, 'Munich'), false);
assert.equal(E.H.moveToCity(east, 'Leipzig'), true);
const owner = adult('DE', 'Dresden', 1965);
owner.props = [{ residential112: true, city: 'Munich', country: 'DE', n: 'Nhà ở Munich', v: 100, k: 'residence112' }];
assert(!E.act(owner, 'homes112').opts.some(option => /Munich/.test(option.l)));
owner.pending = [];
owner.age += 25;
const exchange = E.act(owner, 'homes112').opts.find(option => /Dọn đến nhà ở Munich · Bayern/.test(option.l));
assert(exchange);
E.resolve(owner, exchange.k);
assert.equal(P.residentCity(owner), 'Munich');
assert.equal(owner.houseVal, 100);

const berlin = born('DE', 'Đông Berlin', 1965);
assert.equal(C.of(berlin).restrict, 3);
berlin.age = 25;
const united = load(berlin);
assert.equal(P.residentCity(united), 'Berlin');
assert.equal(united.birthCity, 'Đông Berlin');
assert.match(P.birthText(united), /^Đông Berlin,/);
assert.equal(E.placeText(united), 'Berlin, Đức');
const legacy = load({ ...born('DE', 'Berlin', 1965), birthCity: undefined, birthPlace: 'Berlin, Đức' });
assert.match(P.birthText(legacy), /^Berlin, bốn khu vực quân quản$/);
assert.equal(P.residentCity(legacy), 'Berlin');
assert.equal(E.H.moveToCity(legacy, 'Tây Berlin'), true);
assert.equal(P.regionAt('DE', 1965, P.residentCity(legacy)).area, 'west');

const immigrant = adult('GB', 'London', 1965);
E.H.emigrate(immigrant, ['DE', W.BY.DE.name, W.BY.DE.pool], () => 0, () => {});
assert.equal(C.of(immigrant).region.area, 'west');
assert.match(E.placeText(immigrant), /Tây Berlin/);
assert.match(P.birthText(immigrant), /London/);
console.log('PASS authority-regions985: wartime transitions, dated birth and residence, actual moves, restrictions, and legacy saves');
