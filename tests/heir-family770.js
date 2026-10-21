'use strict';
const assert = require('assert');
const { game } = require('./hardcore-isolation');
const E = game();
let checks = 0;
function eq(a, b, why) { assert.deepStrictEqual(JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b)), why); checks++; }
for (const difficulty of ['normal', 'hardcore']) {
  const p = E.createLife({ mode: 'vn', seed: 77001, difficulty, year: 1985 });
  p.age = 45; p.abroad = { perm: true, code: 'JP', name: 'Nhật Bản' }; p.urban = true;
  p.ownHouse = true; p.houseName = 'căn hộ gia đình';
  p.kids = [
    { name: 'Nguyễn Minh An', sex: 'M', born: 35, alive: true },
    { name: 'Nguyễn Ngọc Bình', sex: 'F', born: 38, alive: true },
    { name: 'Nguyễn Minh Châu', sex: 'M', born: 40, alive: true },
    { name: 'Nguyễn Ngọc Dung', sex: 'F', born: 43, alive: true }
  ];
  const target = p.kids[2], opts = E.childOpts(p, target), child = E.createLife(opts);
  eq(child.country, 'JP', 'Settled family stays in Japan');
  eq(child.name, target.name, 'Vietnamese child name preserved');
  eq(child.sibList.map(s => s.n), p.kids.slice(0, 2).map(k => k.name), 'Older siblings retain exact Vietnamese names');
  eq(child.flags.futureSibs.map(s => s.n), [p.kids[3].name], 'Younger sibling retained until actual birth');
  eq(child.fam.home, 'căn hộ gia đình', 'Old child profile without home uses known parental house');
  eq(!!child.ownHouse, false, 'Family housing does not duplicate the estate as child property');
  const now = E.heirAtAge(p, target, 3);
  assert(now, 'Can continue the child at the current age'); checks++;
  eq(now.sibList.map(s => s.n).sort(), p.kids.filter(k => k !== target).map(k => k.name).sort(), 'Current-age continuation keeps all three siblings');
  const continuity = E.HOOKS.year.find(f => /futureSibs/.test(String(f)));
  child.age = 3; continuity(child, () => 0.99, () => {}, 3);
  eq(child.sibList.map(s => s.n).sort(), p.kids.filter(k => k !== target).map(k => k.name).sort(), 'All three siblings keep identity after younger birth');
  const cloned = E.childOpts(p, JSON.parse(JSON.stringify(target)));
  eq(cloned.parent.sibList.length, 3, 'A copied child profile never becomes its own sibling');
  target.home = 'nhà thuê';
  eq(E.createLife(E.childOpts(p, target)).fam.home, 'nhà thuê', 'Known birth snapshot wins over a house bought later');
  target.home = 'nhà riêng'; p.ownHouse = false;
  eq(E.createLife(E.childOpts(p, target)).fam.home, 'nhà riêng', 'Selling later does not erase birth housing');
  p.kids = [target];
  const only = E.createLife(E.childOpts(p, target));
  eq(only.sibList, [], 'Only child has no generated siblings');
  eq(only.flags.knownSibs, true, 'Empty known roster suppresses random new siblings');
  const saved = JSON.parse(JSON.stringify(child)); E.migrateExt(saved);
  eq(saved.sibList.map(s => s.n).sort(), child.sibList.map(s => s.n).sort(), 'Saving and migration preserve names');
  eq(saved.fam.home, child.fam.home, 'Saving preserves household housing');
}
console.log('PASS: ' + checks + ' heir family checks (Japan, Vietnamese names, birth order, old saves, housing, both difficulties).');
