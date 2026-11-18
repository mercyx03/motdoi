'use strict';
const assert=require('node:assert/strict');
const {gameContext}=require('./hardcore-isolation');
const {E}=gameContext(),R=E.ERA969,B=E.BONDS919,H=E.H,X=E.UPDATE110;
const quiet=()=>{},roll=()=>.5,copy=x=>JSON.parse(JSON.stringify(x));
function life(seed,age=34){
  const l=E.createLife({mode:'world',country:'US',year:1930,seed});
  Object.assign(l,{age,alive:true,indep:age>=18,school:null,schoolEnd:null,
    job:null,money:0,pending:[],sched:[],acts:0});
  delete l.flags.military;
  l.fam.mAlive=true;l.fam.noMom=false;l.fam.mName='Anna';
  l.fam.fAlive=false;l.partner=null;l.bff=null;l.sibList=[];l.kids=[];
  return l;
}
function option(d,key){return d.opts.find(o=>X.menuKey(d,o.k)===key);}
function choose(l,d,key){
  const o=option(d,key);assert(o,key+' in '+d.id);
  l.pending=[d];E.resolve(l,o.k);
}
function show(l,id){return l.pending.find(d=>d.id===id);}
function advance(l){l.age++;l.pending=[];l.acts=0;}
function recovery(l){return E.ERA920.HIST.open(l,'displaced',2).recovery969;}

{
  let l=life(975),q=recovery(l);
  R.recoveryYear(l,roll,quiet);
  choose(l,show(l,'recovery969'),'later');
  l=E.migrate(copy(l));q=R.displaced(l).recovery969;
  for(let n=0;n<3;n++){
    advance(l);R.recoveryYear(l,roll,quiet);
    assert(!show(l,'recovery969'),'no reminder with the same recovery conditions');
  }
  const d=E.act(l,'recovery969');assert(d,'recovery can still be opened manually');
  choose(l,d,'relatives');assert(q.housing);
  advance(l);R.recoveryYear(l,roll,quiet);
  assert(show(l,'recovery969').text.includes('Đã có chỗ ở ổn định hơn'));
  choose(l,show(l,'recovery969'),'cancel');
  advance(l);R.recoveryYear(l,roll,quiet);assert(!show(l,'recovery969'));
}
{
  const l=life(976,10);l.school='primary';l.schoolEnd=11;
  const q=recovery(l);choose(l,E.DEC.recovery969.make(l,roll),'relatives');
  advance(l);choose(l,E.DEC.recovery969.make(l,roll),'school');
  advance(l);R.recoveryYear(l,roll,quiet);
  assert.equal(l.school,'primary');
  assert(show(l,'recovery969').text.includes('Đã được tiếp tục việc học'));
  R.recoveryYear(l,roll,quiet);assert.equal(l.pending.filter(d=>d.id==='recovery969').length,1);
  choose(l,show(l,'recovery969'),'cancel');
  advance(l);R.recoveryYear(l,roll,quiet);assert(!show(l,'recovery969'));
  assert(q.schoolDone);
}
{
  const l=life(977);H.moveToCity(l,'New York');
  const q=recovery(l);H.moveToCity(l,'Chicago');
  R.recoveryYear(l,roll,quiet);choose(l,show(l,'recovery969'),'later');
  advance(l);R.recoveryYear(l,roll,quiet);assert(R.returnReady(l,q));assert(!show(l,'recovery969'));
  l.money=l.base;R.recoveryYear(l,roll,quiet);
  assert(show(l,'recovery969').text.includes('Đã có thể thu xếp trở về quê'));
  assert(option(show(l,'recovery969'),'return'));
}
function bondFixture(l,how='support'){
  return B.state(l).open={kind:'jobless',who:'mother',name:l.fam.mName,how,at:l.age,stage:'first',temper:'chu đáo'};
}
{
  let l=life(978);bondFixture(l,'distant');
  choose(l,E.DEC.bonds919.make(l,roll),'other');
  let s=B.state(l);assert(s.mend975&&!s.open);
  advance(l);B.year(l,roll,quiet);assert(!show(l,'bonds919'));
  advance(l);B.year(l,roll,quiet);assert(show(l,'bonds919'));
  choose(l,show(l,'bonds919'),'cancel');
  l=E.migrate(copy(l));s=B.state(l);
  for(let n=0;n<3;n++){advance(l);B.year(l,roll,quiet);assert(!show(l,'bonds919'));}
  E.FAMILY100.info(l,'parent','m').trust=85;
  B.year(l,roll,quiet);assert(show(l,'bonds919'),'meaningful relationship improvement can reopen once');
  choose(l,show(l,'bonds919'),'cancel');
  advance(l);B.year(l,roll,quiet);assert(!show(l,'bonds919'));
  const d=E.act(l,'bondsMend975');assert(d,'manual contact is still available');
  choose(l,d,'let');
  assert(!s.mend975&&s.distance975.includes('mother'));
  for(let n=0;n<7;n++){advance(l);B.year(l,roll,quiet);assert(!show(l,'bonds919'));}
}
{
  const l=life(979),o=bondFixture(l,'distant');o.stage='mend';o.at=l.age-3;o.ask=l.age-1;
  E.migrateExt(l);B.year(l,roll,quiet);
  assert(!show(l,'bonds919')&&B.state(l).mend975.notice975,'legacy reminder records do not trigger a new popup');
}
function referral(l){
  l.edu=5;l.st.kno=70;
  const old=E.offers;
  E.offers=()=>['ke_toan'];
  l.major='eco';
  try{bondFixture(l);choose(l,E.DEC.bonds919.make(l,roll),'accept');}
  finally{E.offers=old;}
  const s=B.state(l),d=show(l,'familyReferral975');assert(s.referral975&&d&&!l.job);
  assert(E.autoKey(l)==='cancel','autoplay leaves the choice open without applying');
  return {s,d};
}
{
  let l=life(980);const {d}=referral(l);
  choose(l,d,'cancel');l=E.migrate(copy(l));advance(l);
  const reopen=E.act(l,'familyReferral975');assert(reopen);
  E.DEC.familyReferral975.apply(l,reopen,option(reopen,'apply').k,()=>0,quiet);
  const q=B.state(l).referral975;assert.equal(q.status,'hired');assert.equal(l.job.id,'ke_toan');
  const count=l.jobsHist.length;
  E.DEC.familyReferral975.apply(l,reopen,option(reopen,'apply').k,()=>0,quiet);assert.equal(l.jobsHist.length,count);
}
{
  const l=life(981),{s,d}=referral(l);
  E.DEC.familyReferral975.apply(l,d,option(d,'apply').k,()=>.999,quiet);
  assert.equal(s.referral975.status,'rejected');assert(!l.job);assert(E.DEC.job.valid(l,{requested:true}));
}
{
  const l=life(982),{s,d}=referral(l);l.edu=0;
  assert(!option(E.DEC.familyReferral975.make(l,roll),'apply'));
  E.DEC.familyReferral975.apply(l,d,option(d,'apply').k,()=>0,quiet);
  assert.equal(s.referral975.status,'open');assert(!l.job);
  l.edu=5;H.moveToCity(l,l.city==='New York'?'Chicago':'New York');
  assert(!option(E.DEC.familyReferral975.make(l,roll),'apply'),'a relocation cannot reuse the old vacancy');
  l.age+=2;B.year(l,roll,quiet);
  assert.equal(s.referral975.status,'expired');assert(!E.act(l,'familyReferral975'));
}
console.log('PASS 9.7.5: recovery milestones, quiet reconciliation, real referrals with acceptance, rejection and expiry.');
