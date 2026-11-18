'use strict';
const assert=require('assert'),{gameContext}=require('./hardcore-isolation'),G=gameContext(),E=G.E,F=E.FOOTBALL;
const l=E.createLife({mode:'vn',seed:87106});Object.assign(l,{birthYear:2000,age:25,school:null});l.flags.military=0;const s=F.init(l,()=>.5);s.injury=100;
const z={year:2025,matches:[],competitions:[]};F.national(l,z,()=>.5,()=>{});
assert.equal(Object.keys(s.nationWorld871).length,Object.keys(E.FOOTBALL_DATA.markets).length);
assert(s.nationWorld871.VN.years[2025].competitions.some(x=>x.name==='Vòng loại FIFA World Cup'));
assert.equal(s.national.caps,0);assert.equal(s.trophies.length,0);
const snapshot=JSON.stringify(s.nationWorld871);F.nationWorld(l,z);assert.equal(JSON.stringify(s.nationWorld871),snapshot);
const restored=JSON.parse(JSON.stringify(l));F.nationWorld(restored,z);assert.equal(JSON.stringify(F.peek(restored).nationWorld871),snapshot);
s.stage='retired';l.age=26;s.national.qualified['FIFA World Cup:2026']=true;F.nationWorld(l);
assert(s.nationWorld871.VN.years[2026].competitions.some(x=>x.name==='FIFA World Cup'));
assert.equal(s.national.caps,0);assert.equal(s.trophies.length,0);assert(!s.nationWorld871.VN.years[2026].playerParticipated);
for(let y=2027;y<=2090;y++){l.age=y-2000;F.nationWorld(l);}
assert.equal(Object.keys(s.nationWorld871.VN.years).length,50);
console.log('PASS football-world871: 11 checks');
