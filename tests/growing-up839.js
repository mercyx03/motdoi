'use strict';
const assert=require('node:assert/strict');
const E=require('./hardcore-isolation').gameContext().E, log=()=>{};
function life(country,age){
  const l=E.createLife({mode:country==='VN'?'vn':'world',country,seed:839});
  Object.assign(l,{age,birthYear:2000,pending:[],school:null,job:null,abroad:null,jailUntil:null,alive:true,indep:age>=18,money:l.base*2});
  Object.assign(l.fam,{mAlive:true,noMom:false,mInc:l.base*.2,fAlive:true,noDad:false,fInc:l.base*.2});
  return l;
}
function pick(l,id,key,r=()=>0){
  const d=E.DEC[id].make(l,r),k=d.data?.keys?String(d.data.keys.indexOf(key)):key;
  assert(d.opts.some(x=>x.k===k),id+' offers '+key);E.DEC[id].apply(l,d,k,r,log);
}
function offered(l,id,key){const d=E.DEC[id].make(l,()=>0),i=String(d.data.keys.indexOf(key));return d.opts.some(x=>x.k===i);}
{
  const l=life('VN',3);assert(E.infantAuto(l));assert(!E.actions(l).some(a=>a.ok===true));
  l.age=4;assert(!E.infantAuto(l));assert(E.actions(l).some(a=>a.ok===true));
}
{
  const l=life('US',13);l.school='lower';assert(!offered(l,'teenWork839','shift'));const cash=l.money;
  pick(l,'teenWork839','art');assert(l.money>cash);assert.equal(l.school,'lower');assert(!E.DEC.teenWork839.valid(l));
  l.age=14;assert(offered(l,'teenWork839','shift'));pick(l,'teenWork839','hidden');assert(l.flags.teenWorkLast.detected);
  const uk=life('GB',13);pick(uk,'teenWork839','permit');assert(offered(uk,'teenWork839','shift'));
}
{
  const l=life('VN',12);assert(!E.DEC.care917.valid(l));l.age=13;assert(E.DEC.care917.valid(l));
  const funds=l.money;l.fam.mInc=l.fam.fInc=l.base*5;
  pick(l,'passport918','pp');assert.equal(l.money,funds);assert(l.flags.travel918.pending);
  l.flags.travel918.passport={cc:'VN',until:20};pick(l,'passport918','accompany:TH');assert(l.flags.travel918.trips[0].guardian);
  assert(!offered(l,'passport918','accompany:TH'));
}
{
  const l=life('US',18);l.city=l.birthCity;E.familyHousing121(l,()=>0);assert(l.pending.some(d=>d.id==='localHousing121'));
  pick(l,'localHousing121','share');assert(E.atFamilyHome121(l));l.money=0;assert(!offered(l,'localHousing121','own'));
  l.money=l.base;pick(l,'localHousing121','own');assert(l.indep&&!E.atFamilyHome121(l));
}
{
  const l=life('US',19);l.school='uni';l.schoolEnd=23;l.st.kno=72;l.fam.mInc=l.fam.fInc=l.money=0;
  pick(l,'aid829','Federal Student Aid — vay liên bang');const b=l.flags.study829.budget839;
  assert.equal(b.scholarship,.25);assert.equal(b.share,0);assert.equal(b.loan,b.fee+b.living);
  assert.equal(l.flags.study829.debts.length,1);assert.equal(l.money,b.living);
  E.finishStudyBudget839(l,log);assert.equal(l.schoolEnd,23);
  l.age++;E.finishStudyBudget839(l,log);assert.equal(l.schoolEnd,24);E.finishStudyBudget839(l,log);assert.equal(l.schoolEnd,24);
  l.age++;l.st.kno=100;l.fam.mInc=l.base*5;pick(l,'aid829','self');assert.equal(l.flags.study829.budget839.loan,0);
}
{
  const l=life('GB',29);l.sex='F';l.partner={name:'Alex',age:30,alive:true,sex:'M',status:'married'};
  const prob=E.RELATIONS108.chance;assert(Math.abs(prob(l,l.partner)-(1-.77**6))<1e-8);
  const ages=[29,34,39,44,47].map(a=>{l.age=a;return prob(l,l.partner);});assert(ages.every((v,i)=>i===0||v<ages[i-1]));
  l.age=35;pick(l,'kid','ivf');assert.equal(l.flags.pregnancy108.source,'ivf');assert(!E.RELATIONS108.fertile(l,l.partner));
  l.age=37;delete l.flags.pregnancy108;pick(l,'kid','surrogate');assert.equal(l.flags.surrogate839.country,'GB');
  const vn=life('VN',35);vn.sex='F';vn.partner={...l.partner};vn.sibList=[{n:'Chị',sex:'F',born:-2,alive:true,kids:1}];
  assert(!E.DEC.kid.make(vn,()=>0).opts.some(o=>o.k==='surrogate'));
  vn.flags.medical839=E.RELATIONS108.person(vn,vn.partner);pick(vn,'kid','surrogate');assert(vn.sibList[0].carried839);
}
console.log('PASS growing-up839: age boundaries, youth work, care, guardian travel, housing, college funding, natural conception, IVF and surrogacy');
