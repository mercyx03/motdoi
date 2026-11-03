'use strict';
const fs=require('fs'),cp=require('child_process'),assert=require('assert');
const data=JSON.parse(fs.readFileSync('public/data/updates.json','utf8')), old=JSON.parse(cp.execFileSync('git',['show','b15490d:public/data/updates.json'],{encoding:'utf8'}));
const id='scandal-contract-quiz-827',entry=data.entries.find(e=>e.id===id);assert.equal(entry.id,id);assert.equal(entry.releaseStatus,'released');assert.equal(Date.parse(entry.releasedAt),Date.parse('2026-11-03T13:55:34+07:00'));assert.equal(data.entries[0].id,'olympia-culture-828');assert.equal(data.entries[0].releaseStatus,'packaged');assert.deepStrictEqual(data.entries.slice(2),old.entries,'all previous notes unchanged');
assert.deepStrictEqual(JSON.parse(fs.readFileSync('docs/update-extra.json','utf8')).find(e=>e.id===id),entry);
for(const p of ['dist/data/updates.json'])assert.deepStrictEqual(JSON.parse(fs.readFileSync(p,'utf8')),data);
const html=fs.readFileSync('dist/updates.html','utf8');assert.deepStrictEqual(JSON.parse(html.match(/id="updateHistoryData">([^<]+)<\/script>/)[1]),data);
console.log('PASS update827: 8.10.27 released and 8.10.28 packaged, all '+old.entries.length+' prior entries unchanged, source and built JSON/HTML identical.');
