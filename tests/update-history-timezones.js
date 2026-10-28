'use strict';
const fs = require('fs'), path = require('path'), assert = require('assert'), cp = require('child_process');
const project = path.join(__dirname, '..'), cache = path.resolve(project, '.cache');
fs.mkdirSync(cache, { recursive: true });
const root = fs.mkdtempSync(path.join(cache, 'history-timezones-'));
try {
  for (const file of ['tools/build-update-history.js', 'tools/player-update-notes.js', 'docs/update-history-commits.json', 'docs/update-copy.tsv', 'docs/update-extra.json', 'public/data/updates.json', 'CHANGELOG.md']) {
    const target = path.join(root, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.copyFileSync(path.join(project, file), target);
  }
  const actual = JSON.parse(fs.readFileSync(path.join(project, 'public/data/updates.json'))).entries;
  cp.execFileSync(process.execPath, [path.join(root, 'tools/build-update-history.js')]);
  let rebuilt = JSON.parse(fs.readFileSync(path.join(root, 'public/data/updates.json'))).entries;
  for (const e of actual) assert.deepStrictEqual(rebuilt.find(x => x.id === e.id), e, 'Preserve entry ' + e.id);
  for (let i = 1; i < rebuilt.length; i++) assert(Date.parse(rebuilt[i - 1].publishedAt) >= Date.parse(rebuilt[i].publishedAt), 'Real chronological order, not local clock string');
  const future = new Date(Date.now() - 60000), earlier = new Date(future.getTime() - 3600000);
  const a = { id: 'tz-later', publishedAt: future.toISOString(), title: 'Buổi gặp mới', summary: 'Một buổi gặp mới.', tags: ['Tính năng'], details: ['Một buổi gặp mới.'] };
  const b = { id: 'tz-earlier', publishedAt: new Date(earlier.getTime() + 7 * 3600000).toISOString().replace('Z', '+07:00'), title: 'Buổi gặp trước', summary: 'Một buổi gặp trước.', tags: ['Tính năng'], details: ['Một buổi gặp trước.'] };
  fs.writeFileSync(path.join(root, 'docs/update-extra.json'), JSON.stringify([b, a]));
  fs.writeFileSync(path.join(root, 'public/data/updates.json'), JSON.stringify({ entries: [b, a] }));
  cp.execFileSync(process.execPath, [path.join(root, 'tools/build-update-history.js')]);
  rebuilt = JSON.parse(fs.readFileSync(path.join(root, 'public/data/updates.json'))).entries;
  assert(rebuilt.findIndex(x => x.id === a.id) < rebuilt.findIndex(x => x.id === b.id), 'UTC later entry wins over larger local time');
  assert.deepStrictEqual(rebuilt.find(x => x.id === a.id), a); assert.deepStrictEqual(rebuilt.find(x => x.id === b.id), b);
  console.log('PASS update history timezones: actual history survives; mixed Z/+07:00 sorted by instant; entries unchanged.');
} finally {
  const resolved = path.resolve(root); if (!resolved.startsWith(cache + path.sep)) throw Error('Unsafe cleanup path');
  fs.rmSync(resolved, { recursive: true, force: true });
}
