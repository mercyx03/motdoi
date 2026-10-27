'use strict';
// Paired fixed-seed comparison against an archived accepted checkout. No real saves, no fixture overwrite.
const fs=require('fs'),path=require('path'),assert=require('assert');
const beforePath=process.argv[2];if(!beforePath)throw Error('Usage: node tools/gd3-compare.js <accepted checkout>');
const prior=require(path.resolve(beforePath,'tests/lib/quick.js')),current=require('../tests/lib/quick');
const A=prior.loadGame(),B=current.loadGame();const ids=new Set(require('../docs/gd3-triggers.json').map(x=>x.id));
assert.strictEqual(A.E.TRIG.length,B.E.TRIG.length);for(const id of ids){const a=A.E.TRIG.filter(t=>t.id===id),b=B.E.TRIG.filter(t=>t.id===id);assert.strictEqual(a.length,1);assert.strictEqual(b.length,1);for(const k of ['p','when','cd','max','rep','child','cw'])assert.strictEqual(String(a[0][k]),String(b[0][k]),id+' '+k);}
function run(G,i,count){G.testClock.reset();const l=G.E.createLife({mode:i%3?'vn':'world',seed:880000+i*13,difficulty:i%10===9?'hardcore':'normal'});let n=0,events={};const start=process.hrtime.bigint();while(l.alive&&n++<130){G.E.beginYear(l,{auto:true});l.pending.forEach(d=>{if(ids.has(d.id))events[d.id]=(events[d.id]||0)+1;});current.settle(G.E,l);if(l.alive)G.E.finishYear(l);current.settle(G.E,l);G.E.endYear(l);}return {raw:count?null:JSON.stringify(l),years:n,ms:Number(process.hrtime.bigint()-start)/1e6,age:l.death?l.death.age:l.age,wealth:l.money/l.base,bytes:Buffer.byteLength(JSON.stringify(l)),events};}
// No metadata means byte-for-byte legacy outcomes, including random stream and save contents.
const tags=B.E.TRIG.map(t=>t.contextTags);B.E.TRIG.forEach(t=>delete t.contextTags);
for(let i=0;i<12;i++)assert.strictEqual(run(A,i,false).raw,run(B,i,false).raw,'legacy '+i);
B.E.TRIG.forEach((t,i)=>{if(tags[i])t.contextTags=tags[i];});
if(process.argv.includes('--legacy-only')){console.log('PASS: 12 full lives byte-identical to e9fd613 with metadata removed');process.exit(0);}
for(let i=0;i<15;i++){run(A,i,true);run(B,i,true);}
let rounds=[];const quant=(a,p)=>a.slice().sort((x,y)=>x-y)[Math.floor((a.length-1)*p)];
for(let round=0;round<3;round++){let all=[[],[]];for(let i=0;i<60;i++){const pair=[A,B];const order=(i+round)%2?[1,0]:[0,1];for(const k of order)all[k].push(run(pair[k],round*60+i,true));}const summary=all.map(a=>{const events={};a.forEach(x=>Object.entries(x.events).forEach(([id,n])=>events[id]=(events[id]||0)+n));return {lives:a.length,years:a.reduce((s,x)=>s+x.years,0),msPerYear:a.reduce((s,x)=>s+x.ms,0)/a.reduce((s,x)=>s+x.years,0),medianBytes:quant(a.map(x=>x.bytes),.5),wealthBase:{median:quant(a.map(x=>x.wealth),.5),p10:quant(a.map(x=>x.wealth),.1),p90:quant(a.map(x=>x.wealth),.9),negative:a.filter(x=>x.wealth<0).length},events};});rounds.push({before:summary[0],after:summary[1],timeChangePct:(summary[1].msPerYear/summary[0].msPerYear-1)*100});console.error('round',round+1,'complete');}
console.log(JSON.stringify({reference:'e9fd613',legacyLivesByteIdentical:12,rounds},null,2));
