/* Nhật ký GĐ4: mục mới nằm đầu, trạng thái bản đóng gói, giữ nguyên toàn bộ mục cũ (kể cả GĐ3). */
const assert=require('assert'),fs=require('fs'),cp=require('child_process');
const kept=(n,o,m)=>{if(o.releaseStatus==='packaged'&&n&&n.releaseStatus==='released'){assert(Date.parse(n.releasedAt)>=Date.parse(n.publishedAt),'released after prepared: '+o.id);const s=x=>{const y=Object.assign({},x);delete y.releaseStatus;delete y.releasedAt;delete y.correctedAt;return y;};assert.deepStrictEqual(s(n),s(o),m);}else assert.deepStrictEqual(n,o,m);}; // ghi phát hành chỉ được đổi releaseStatus/releasedAt/correctedAt của mục đang chờ
const now=JSON.parse(fs.readFileSync('public/data/updates.json')),old=JSON.parse(cp.execFileSync('git',['show','21bca64:public/data/updates.json'],{encoding:'utf8'}));
assert(now.entries.length>=old.entries.length+1);assert(now.entries.some(x=>x.id==='gd4-multiyear-consequences'));
for(const e of old.entries)kept(now.entries.find(x=>x.id===e.id),e);
const e=now.entries.find(x=>x.id==='gd4-multiyear-consequences');assert.equal(e.version,'8.5.0-gd4');assert.equal(e.title,'Một Đời — Lựa chọn hôm nay, thay đổi cả tương lai!');
assert(e.releaseStatus==='packaged'?e.releasedAt===null:e.releaseStatus==='released'&&Date.parse(e.releasedAt)>=Date.parse(e.publishedAt));
assert(Date.parse(e.publishedAt)<=Date.now()&&/Z$|[+-]\d\d:\d\d$/.test(e.publishedAt));
assert.equal(require('../tools/player-update-notes').playerEntry(e).details.length,e.details.length);
const extra=JSON.parse(fs.readFileSync('docs/update-extra.json'));assert.deepStrictEqual(extra.find(x=>x.id===e.id),e);
if(fs.existsSync('dist/index.html')){const html=fs.readFileSync('dist/updates.html','utf8');assert(html.includes('gd4-multiyear-consequences'));assert.deepStrictEqual(JSON.parse(fs.readFileSync('dist/data/updates.json')),now);const m=html.match(/id="updateHistoryData">([^<]+)<\/script>/);assert(m);assert.deepStrictEqual(JSON.parse(m[1]),now);}
console.log('PASS: GD4 entry kept, version, packaged/released status, all '+old.entries.length+' earlier entries unchanged, JSON/HTML in dist when present.');
