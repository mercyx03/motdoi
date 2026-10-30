'use strict';
const fs = require('fs'), cp = require('child_process'), assert = require('assert');
const base = p => JSON.parse(cp.execFileSync('git', ['show', '7294c42:' + p], { encoding: 'utf8' }));
const extra = JSON.parse(fs.readFileSync('docs/update-extra.json')), data = JSON.parse(fs.readFileSync('public/data/updates.json'));
for (const [old, now] of [[base('docs/update-extra.json'), extra], [base('public/data/updates.json').entries, data.entries]]) {
  for (const e of old) assert.deepStrictEqual(now.find(n => n.id === e.id), e, 'preserve historic entry ' + e.id);
}
assert(Date.parse(data.entries[0].publishedAt)===Math.max(...data.entries.map(e=>Date.parse(e.publishedAt))),'latest note remains first');
const ids=['enterprise-family-office-885','enterprise-operations-884','enterprise-reports-883','life-enterprise-foundation-882','life-contracts-881','life-context-bcd-preview','life-context-a-family'];const fresh=ids.map(id=>data.entries.find(e=>e.id===id));assert(fresh.every(Boolean),'all original notes retained');
assert.deepStrictEqual(fresh.map(e => e.id), ['enterprise-family-office-885', 'enterprise-operations-884', 'enterprise-reports-883', 'life-enterprise-foundation-882', 'life-contracts-881', 'life-context-bcd-preview', 'life-context-a-family']);
for (const e of fresh) { assert(e.id === 'enterprise-family-office-885' ? e.releaseStatus === 'released' && new Date(e.releasedAt).toLocaleDateString('en-CA', {timeZone:'Asia/Ho_Chi_Minh'}) === '2026-10-28' : (e.releaseStatus === 'packaged' && e.releasedAt === null || e.releaseStatus === 'released' && Date.parse(e.releasedAt)>=Date.parse(e.publishedAt))); assert(/Z$|[+-]\d\d:\d\d$/.test(e.publishedAt)); assert.deepStrictEqual(extra.find(x => x.id === e.id), e); }
const built = JSON.parse(fs.readFileSync('dist/data/updates.json'));
assert.deepStrictEqual(built, data);
const html = fs.readFileSync('dist/updates.html', 'utf8'), m = html.match(/id="updateHistoryData">([^<]+)<\/script>/);
assert(m); assert.deepStrictEqual(JSON.parse(m[1]), data);
console.log('PASS life-context-updates: seven notes synchronized/embedded with confirmed 8.8.5 release, all old entries unchanged');
