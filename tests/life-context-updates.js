'use strict';
const fs = require('fs'), cp = require('child_process'), assert = require('assert');
const base = p => JSON.parse(cp.execFileSync('git', ['show', '7294c42:' + p], { encoding: 'utf8' }));
const extra = JSON.parse(fs.readFileSync('docs/update-extra.json')), data = JSON.parse(fs.readFileSync('public/data/updates.json'));
for (const [old, now] of [[base('docs/update-extra.json'), extra], [base('public/data/updates.json').entries, data.entries]]) {
  for (const e of old) assert.deepStrictEqual(now.find(n => n.id === e.id), e, 'preserve historic entry ' + e.id);
}
const fresh = data.entries.slice(0, 4);
assert.deepStrictEqual(fresh.map(e => e.id), ['life-enterprise-foundation-882', 'life-contracts-881', 'life-context-bcd-preview', 'life-context-a-family']);
for (const e of fresh) { assert(e.releaseStatus === 'packaged' && e.releasedAt === null); assert(/Z$|[+-]\d\d:\d\d$/.test(e.publishedAt)); assert.deepStrictEqual(extra.find(x => x.id === e.id), e); }
const built = JSON.parse(fs.readFileSync('dist/data/updates.json'));
assert.deepStrictEqual(built, data);
const html = fs.readFileSync('dist/updates.html', 'utf8'), m = html.match(/id="updateHistoryData">([^<]+)<\/script>/);
assert(m); assert.deepStrictEqual(JSON.parse(m[1]), data);
console.log('PASS life-context-updates: four packaged notes synchronized/embedded, all old entries unchanged');
