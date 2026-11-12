'use strict';
const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const E = gameContext().E;
let royalCount = 0, directCount = 0, checks = 0;
function ok(value, message) { assert(value, message); checks++; }
for (let seed = 710000; seed < 711000; seed++) {
  const l = E.createLife({mode: 'world', country: 'GB', seed});
  if (!l.flags.royal) continue;
  royalCount++;
  if (l.flags.royal.tier === 'direct') directCount++;
  ok(l.fam.q === 5 && l.flags.birthQ === 5, 'royal starting finances consistent');
  ok(l.log[0].t.includes(E.royalBirthLabel(l)), 'birth narrative identifies the royal branch');
  ok(!E.QUINT.slice(1).some(q => l.log[0].t.includes(q)), 'stale random wealth absent from birth narrative');
  ok(!l.fam.orphan, 'royal birth not overwritten by orphan generation');
}
ok(royalCount === 23 && directCount === 3, 'existing deterministic royal draws preserved');
for (const [mode, country] of [['vn','VN'],['world','VN'],['world','US']]) {
  for (let seed=710000;seed<710030;seed++) ok(!E.createLife({mode,country,seed}).flags.royal, 'no royal birth in '+mode+'/'+country);
}
const l=E.createLife({mode:'world',country:'GB',seed:710032});
l.log[0].t=l.log[0].t.replace('trong '+E.royalBirthLabel(l), 'trong một gia đình khó khăn');
l.age=30;l.money=17;l.fam.q=2;
const old={money:l.money,q:l.fam.q,royal:JSON.stringify(l.flags.royal)};
E.migrateExt(l);
ok(l.log[0].t.includes(E.royalBirthLabel(l)), 'old saved birth narrative repaired');
ok(l.money===old.money&&l.fam.q===old.q&&JSON.stringify(l.flags.royal)===old.royal,'repair preserves current finances and royal status');
const first=l.log[0].t;
E.migrateExt(l);
ok(l.log[0].t===first, 'repair is idempotent');
console.log('PASS royal birth: '+checks+' checks; '+royalCount+'/1000 royal, '+directCount+' direct');
