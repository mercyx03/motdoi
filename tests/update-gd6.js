/* Nhật ký GĐ6: mục mới nằm đầu, trạng thái bản đóng gói, giữ nguyên toàn bộ mục cũ (kể cả GĐ3, GĐ4, GĐ5). */
const assert=require('assert'),fs=require('fs'),cp=require('child_process');
const now=JSON.parse(fs.readFileSync('public/data/updates.json')),old=JSON.parse(cp.execFileSync('git',['show','681e10f:public/data/updates.json'],{encoding:'utf8'}));
assert.equal(now.entries.length,old.entries.length+1);assert.equal(now.entries[0].id,'gd6-integration-release');
for(const e of old.entries)assert.deepStrictEqual(now.entries.find(x=>x.id===e.id),e);
const e=now.entries[0];assert.equal(e.version,'8.5.0-gd6');assert.equal(e.title,'Một Đời — Chơi mượt và ổn định hơn');
assert(e.releaseStatus==='packaged'?e.releasedAt===null:e.releaseStatus==='released'&&Date.parse(e.releasedAt)>=Date.parse(e.publishedAt));
assert(Date.parse(e.publishedAt)<=Date.now()&&/Z$|[+-]\d\d:\d\d$/.test(e.publishedAt));
assert.equal(require('../tools/player-update-notes').playerEntry(e).details.length,e.details.length);
const extra=JSON.parse(fs.readFileSync('docs/update-extra.json'));assert.deepStrictEqual(extra.find(x=>x.id===e.id),e);
if(fs.existsSync('dist/index.html')){const html=fs.readFileSync('dist/updates.html','utf8');assert(html.includes('gd6-integration-release'));assert.deepStrictEqual(JSON.parse(fs.readFileSync('dist/data/updates.json')),now);const m=html.match(/id="updateHistoryData">([^<]+)<\/script>/);assert(m);assert.deepStrictEqual(JSON.parse(m[1]),now);}
console.log('PASS: GD6 entry newest, version, packaged/released status, all '+old.entries.length+' earlier entries unchanged, JSON/HTML in dist when present.');
