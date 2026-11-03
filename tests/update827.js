'use strict';
const fs=require('fs'),cp=require('child_process'),assert=require('assert');
const data=JSON.parse(fs.readFileSync('public/data/updates.json','utf8')), old=JSON.parse(cp.execFileSync('git',['show','b15490d:public/data/updates.json'],{encoding:'utf8'}));
const id='scandal-contract-quiz-827',entry=data.entries[0];assert.equal(entry.id,id);assert.equal(entry.releaseStatus,'packaged');assert.equal(entry.releasedAt,null);assert.deepStrictEqual(data.entries.slice(1),old.entries,'all previous notes unchanged');
assert.deepStrictEqual(JSON.parse(fs.readFileSync('docs/update-extra.json','utf8'))[0],entry);
for(const p of ['dist/data/updates.json'])assert.deepStrictEqual(JSON.parse(fs.readFileSync(p,'utf8')),data);
const html=fs.readFileSync('dist/updates.html','utf8');assert.deepStrictEqual(JSON.parse(html.match(/id="updateHistoryData">([^<]+)<\/script>/)[1]),data);
console.log('PASS update827: first packaged entry, all '+old.entries.length+' prior entries unchanged, source and built JSON/HTML identical.');
