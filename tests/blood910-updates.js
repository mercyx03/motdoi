'use strict';
/* Nhật ký 8.10.10 (blood-genetics-followup-910): mục vẫn còn, đã phát hành, đủ 9 dòng, đồng bộ docs/update-extra.json;
   nội dung mọi mục có trước bản 8.10.10 không bị sửa. 8.10.20: bỏ giả định "mục 910 là mục mới nhất / tổng số mục = mốc cũ + 1"
   vì các bản sau thêm mục mới; công cụ release-update được phép sửa siêu dữ liệu phát hành (releasedAt, correctedAt, publishedAt). */
const fs = require('fs'), cp = require('child_process'), assert = require('assert'), base = '619fcd8489a8005f4cc05c05a2be809636799943';
const a = JSON.parse(fs.readFileSync('public/data/updates.json')), old = JSON.parse(cp.execFileSync('git', ['show', base + ':public/data/updates.json'], { encoding: 'utf8' })), extra = JSON.parse(fs.readFileSync('docs/update-extra.json'));
const META = ['releasedAt', 'correctedAt', 'publishedAt', 'releaseStatus'];
const content = e => { const c = Object.assign({}, e); META.forEach(k => delete c[k]); return c; };
const note = a.entries.find(x => x.id === 'blood-genetics-followup-910');
assert(note, 'blood-genetics-followup-910 còn trong nhật ký');
assert.equal(note.releaseStatus, 'released');
assert.equal(note.details.length, 9);
assert.deepStrictEqual(extra.find(x => x.id === note.id), note, 'docs/update-extra.json đồng bộ');
assert(a.entries.length >= old.entries.length + 1, 'không mất mục nào');
assert(new Set(a.entries.map(x => x.id)).size === a.entries.length, 'không trùng id');
for (const e of old.entries) { const n = a.entries.find(x => x.id === e.id); assert(n, 'còn mục ' + e.id); assert.deepStrictEqual(content(n), content(e), 'nội dung mục ' + e.id + ' không đổi'); if (e.releaseStatus === 'released') assert.equal(n.releaseStatus, 'released', 'mục đã phát hành không bị lùi trạng thái: ' + e.id); }
assert(Date.parse(note.releasedAt) >= Date.parse(note.publishedAt) && Date.parse(note.releasedAt) <= Date.now());
if (process.argv.includes('--dist')) { const data = JSON.parse(fs.readFileSync('dist/data/updates.json')), html = fs.readFileSync('dist/updates.html', 'utf8'), embedded = JSON.parse(/id="updateHistoryData">([^<]+)<\/script>/.exec(html)[1]); assert.deepStrictEqual(data, a); assert.deepStrictEqual(embedded, a); }
console.log('PASS blood910 notes: ' + a.entries.length + ' entries, ' + old.entries.length + ' prior entries keep their content, 9 details, released; ' + (process.argv.includes('--dist') ? 'dist/HTML identical' : 'source synchronized'));
