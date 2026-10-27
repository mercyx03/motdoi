/* Nhật ký đợt nâng cấp showbiz: mỗi mốc một mục, chưa phát hành, giữ nguyên toàn bộ nhật ký trước đợt (đã phát hành 8.6.0). */
const assert=require('assert'),fs=require('fs'),cp=require('child_process');
const now=JSON.parse(fs.readFileSync('public/data/updates.json')),old=JSON.parse(cp.execFileSync('git',['show','acc6aa5:public/data/updates.json'],{encoding:'utf8'}));
for(const e of old.entries)assert.deepStrictEqual(now.entries.find(x=>x.id===e.id),e,'entry kept: '+e.id);
const sb=now.entries.filter(x=>/^showbiz-/.test(x.id));assert(sb.length>=1,'at least one showbiz note');
assert.equal(new Set(now.entries.map(x=>x.id)).size,now.entries.length,'no duplicate ids');
const extra=JSON.parse(fs.readFileSync('docs/update-extra.json'));const {playerEntry}=require('../tools/player-update-notes');
for(const e of sb){assert(/^8\.7\.0-[1-6]$/.test(e.version),'version '+e.id);assert(e.releaseStatus==='packaged'?e.releasedAt===null:e.releaseStatus==='released'&&Date.parse(e.releasedAt)>=Date.parse(e.publishedAt),'status '+e.id);
 assert.deepStrictEqual(extra.find(x=>x.id===e.id),e,'extra in sync '+e.id);assert.equal(playerEntry(e).details.length,e.details.length,'player-facing text only '+e.id);}
assert(now.entries.indexOf(sb[0])<Math.min(...old.entries.map(e=>now.entries.findIndex(x=>x.id===e.id))),'newest showbiz note above all earlier notes');
if(fs.existsSync('dist/index.html')){const html=fs.readFileSync('dist/updates.html','utf8');assert.deepStrictEqual(JSON.parse(fs.readFileSync('dist/data/updates.json')),now);const m=html.match(/id="updateHistoryData">([^<]+)<\/script>/);assert(m);assert.deepStrictEqual(JSON.parse(m[1]),now);}
console.log('PASS update-showbiz: '+sb.length+' showbiz notes ('+sb.map(e=>e.version+' '+e.releaseStatus).join(', ')+'), '+old.entries.length+' earlier entries unchanged.');
