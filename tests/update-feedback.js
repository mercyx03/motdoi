/* Nhật ký đợt nâng cấp theo góp ý người chơi: mỗi mốc một mục, chưa phát hành, giữ nguyên toàn bộ 95 mục trước đợt. */
const assert=require('assert'),fs=require('fs'),cp=require('child_process');
const now=JSON.parse(fs.readFileSync('public/data/updates.json')),old=JSON.parse(cp.execFileSync('git',['show','1f8248d:public/data/updates.json'],{encoding:'utf8'}));
for(const e of old.entries)assert.deepStrictEqual(now.entries.find(x=>x.id===e.id),e,'entry kept: '+e.id);
const fb=now.entries.filter(x=>/^feedback-/.test(x.id));assert(fb.length>=1,'at least one milestone note');
assert.equal(new Set(now.entries.map(x=>x.id)).size,now.entries.length,'no duplicate ids');
const extra=JSON.parse(fs.readFileSync('docs/update-extra.json'));const {playerEntry}=require('../tools/player-update-notes');
for(const e of fb){assert(/^8\.6\.0-[a-e]$/.test(e.version),'version '+e.id);assert(e.releaseStatus==='packaged'?e.releasedAt===null:e.releaseStatus==='released'&&Date.parse(e.releasedAt)>=Date.parse(e.publishedAt),'status '+e.id);
 assert.deepStrictEqual(extra.find(x=>x.id===e.id),e,'extra in sync '+e.id);assert.equal(playerEntry(e).details.length,e.details.length,'player-facing text only '+e.id);}
assert.equal(now.entries[0].id,fb[0].id,'newest milestone note on top');
if(fs.existsSync('dist/index.html')){const html=fs.readFileSync('dist/updates.html','utf8');assert.deepStrictEqual(JSON.parse(fs.readFileSync('dist/data/updates.json')),now);const m=html.match(/id="updateHistoryData">([^<]+)<\/script>/);assert(m);assert.deepStrictEqual(JSON.parse(m[1]),now);}
console.log('PASS update-feedback: '+fb.length+' milestone notes ('+fb.map(e=>e.version).join(', ')+'), '+old.entries.length+' earlier entries unchanged.');
