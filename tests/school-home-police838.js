'use strict';
const assert = require('node:assert/strict');
const {gameContext} = require('./hardcore-isolation');
const E = gameContext().E, log = () => {}, win = () => .99;
function pupil(){
  const l = E.createLife({mode:'vn',seed:838});
  Object.assign(l,{age:15,school:'lower',edu:2,pending:[],jailUntil:null});
  l.st.kno=100;E.EDUCATION54.state(l).records={math:5,lit:5,english:5};l.flags.military=0;l.fam.mAlive=true;
  return l;
}
function choose(l,id,key,r=win){
  const d=l.pending.find(d=>d.id===id)||E.DEC[id].make(l,r);
  const k=d.data.keys?String(d.data.keys.indexOf(key)):key;
  assert(d.opts.some(o=>o.k===k),id+' offers '+key);
  l.pending=l.pending.filter(x=>x!==d);
  E.DEC[id].apply(l,d,k,r,log);
}
for(const [key,type,min,max] of [['0','chuyên',82,97],['2','công lập',35,50],['3','chuyên',82,97],['4','chuyên',82,97],['5','tư thục',60,75],['6','tư thục',60,75]]){
  const l=pupil(),origin=l.prov.old;
  const hs=E.DEC.hs.make(l,win);E.DEC.hs.apply(l,hs,'thpt',win,log);
  assert(l.pending.some(x=>x.id==='highSchool125'));
  choose(l,'highSchool125',key);
  const school=E.WORLD120.p(l).highSchool,profile=E.SCHOOL920.profile(l);
  assert.equal(profile.type,type);assert(profile.res*100>=min-1e-6&&profile.res*100<=max+1e-6);
  if(type==='chuyên'){
    assert(l.pending.some(x=>x.id==='highSubject125'));choose(l,'highSubject125','math');
    assert.equal(E.EDUCATION54.state(l).special.subject,'math');
    assert.equal(E.SCHOOL920.profile(l).res,profile.res);
    if(key==='3'&&origin!=='Hà Nội'){
      assert.equal(school.boarding,true);assert.equal(l.cityStudent.city,'Hà Nội');
      l.school=null;E.HOOKS.gradUpper.forEach(f=>f(l,win,log));assert.equal(l.prov.old,origin);assert.equal(l.cityStudent,null);
    }
  } else assert(!l.pending.some(x=>x.id==='highSubject125'));
}
{
  const l=pupil();l.school='upper';l.schoolEnd=18;E.WORLD120.s(l).highSchool={name:'THPT chuyên Hà Nội – Amsterdam'};
  l.flags.school920={prof:{[E.SCHOOL920.key(l)]:{type:'công lập',res:.45}}};
  assert(E.SCHOOL920.profile(l).res>=.82);
}
{
  const l=pupil();Object.assign(l,{age:19,school:'uni',uniCity:l.prov.old});
  E.familyHousing121(l,win);choose(l,'localHousing121','family');assert(E.livesWithParents(l));assert(!l.indep);
  l.money=l.base;E.startJob(l,'cong_nhan',win,log);choose(l,'localHousing121','own');assert(l.indep&&!E.livesWithParents(l));
  E.familyHousing121(l,win);assert(!l.pending.some(x=>x.id==='localHousing121'));
  l.movedTo='Xa nhà';assert(!E.DEC.localHousing121.valid(l));
}
{
  const l=pupil();l.fam.q=3;l.veh=null;
  const gift=E.EVENTS.find(e=>String(e.run).includes('parentVehicleGift'));
  assert(!gift.c(l,9));assert(gift.c(l,10));gift.run(l,10,win,log);assert.equal(l.veh,'xe đạp');
  l.veh=null;assert(!gift.c(l,15));
}
{
  const l=pupil();Object.assign(l,{age:60,school:null,edu:6});
  E.startJob(l,'cong_an',win,log,true);Object.assign(l.job,{rank:11,rankTracked:11,rankSince:56});
  l.flags.topAcad=48;l.flags.strategicPost='cong_an';l.flags.service107={post:{name:'Giám đốc công an tỉnh',rank:7,track:'cong_an'}};
  choose(l,'bo_nhiem_chien_luoc','yes');assert(E.jobTitle(l).includes('Phó cục trưởng'));
  l.age++;choose(l,'service107_post','6',()=>0);assert(E.jobTitle(l).includes('Cục trưởng'));assert.equal(l.job.rank,11);
  l.job.rank=l.job.rankTracked=2;l.job.rankSince=l.age;
  assert(!E.canAdvance(l,E.CAR.cong_an,false));
}
console.log('PASS school enrollment, resources, specialist subjects, boarding, housing, bicycle and police career');
