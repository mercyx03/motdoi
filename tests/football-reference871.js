'use strict';
const assert=require('assert'),{gameContext}=require('./hardcore-isolation'),G=gameContext(),E=G.E,F=E.FOOTBALL,D=E.FOOTBALL_DATA;
let checks=0;function ok(v,m){assert(v,m);checks++;}
const covered={JP:[2,3],KR:[2,3],GB:[2,3],DE:[2,3],ES:[2,3],FR:[2,3],IT:[2,3],US:[2,3],BR:[2,3],AR:[2,3],TH:[2,3],MX:[2,3],ZA:[2,3],EG:[2,3],NZ:[2,3]};
for(const [cc,tiers] of Object.entries(covered))for(const tier of tiers){const cs=D.clubs.filter(c=>c.country===cc&&c.tier===tier);ok(cs.length===4,cc+' pool retained');ok(cs.every((c,i)=>c.id===cc+'-'+((tier-1)*4+i)),cc+' save identifiers retained');ok(cs.every(c=>c.source&&c.referenceSeason&&!c.name.includes('mô phỏng')),cc+' provenance');ok(new Set(cs.map(c=>c.name)).size===4,cc+' distinct clubs');}
ok(D.clubs.length===192,'existing club count');ok(D.clubs.every(c=>c.name&&!c.name.includes('mô phỏng')&&c.source),'all club slots have named references');ok(new Set(D.clubs.map(c=>c.name)).size===192,'no duplicated club identity');
for(const cc of ['US','MX','NZ']){
 const l=E.createLife({mode:'world',country:cc,seed:87108});Object.assign(l,{age:25,school:null,indep:true,talent:'thể thao',talentSub:'bóng đá',skill:100});l.flags.military=0;const s=F.init(l,()=>.5);s.stage='pro';s.club=cc+'-4';s.potential=100;Object.keys(s.skills).forEach(k=>s.skills[k]=100);const z=F.season(l,()=>.5,()=>{});ok(z.place===1,cc+' winner fixture');ok(!z.movement&&z.movementHeld,cc+' no invented automatic promotion');ok(!s.divisions,cc+' league membership unchanged');
}
console.log('PASS football-reference871: '+checks+' checks');
