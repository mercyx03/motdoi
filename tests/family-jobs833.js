'use strict';
const assert = require('node:assert/strict');
const {loadGame} = require('./lib/quick');
const G = loadGame(), E = G.E;
const focus = new Set(['thợ sửa xe','chạy xe ôm','tài xế công nghệ','thợ xây','phụ hồ']);
const counts = { m: {}, f: {} }, totals = { m: 0, f: 0 };
for (let seed = 1; seed <= 6000; seed++) {
  const l = E.createLife({ mode: 'vn', seed });
  for (const side of ['m','f']) {
    if (!l.fam[side+'Alive'] || (side==='f' && l.fam.noDad)) continue;
    const name = l.fam[side+'Job'];
    counts[side][name] = (counts[side][name] || 0) + 1;
    totals[side]++;
    assert(Number.isFinite(l.fam[side+'Inc']));
  }
}
for (const side of ['m','f']) {
  const n = [...focus].reduce((sum,k)=>sum+(counts[side][k]||0),0);
  console.log(side, n, '/', totals[side], (100*n/totals[side]).toFixed(2)+'%', 'distinct',Object.keys(counts[side]).length, [...focus].map(k=>counts[side][k]||0));
}
const share = side => [...focus].reduce((sum,job)=>sum+(counts[side][job]||0),0) / totals[side];
assert(share('m') < share('f') * 0.65, 'targeted jobs are less frequent for mothers');
for (const job of focus) assert(counts.m[job] > 0 && counts.f[job] > 0, job + ' remains possible for both parents');
for (const job of ['thợ điện','trồng rau','sơ chế thủy sản','thu ngân','dược sĩ','lễ tân']) {
  assert(counts.m[job] && counts.f[job], job + ' appears for both parents');
  assert(E.PARENT_PAY[job] > 0);
}
const rng = { rs: 833 };
for (const [sex, example] of [['M','Minh Triết'], ['F','Trúc Giang']]) {
  let seen = false;
  for (let i = 0; i < 4000; i++) {
    const name = G.VN.vnName(() => G.U.rand(rng), 'kinh', sex, 'Hà').full;
    assert(!name.startsWith('Hà Hà ') && !name.endsWith(' Hà'));
    if (name === 'Hà ' + example) seen = true;
  }
  assert(seen, 'new given name is selectable: ' + example);
}
