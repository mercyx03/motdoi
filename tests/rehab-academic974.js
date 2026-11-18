'use strict';
const assert=require('node:assert/strict');
const {gameContext}=require('./hardcore-isolation');
const {E}=gameContext(),C=E.CHAIN144,A=E.EVENTS125,X=E.UPDATE110;
const r=()=>0, quiet=()=>{}, clone=x=>JSON.parse(JSON.stringify(x));
function adult(seed=974, country='VN'){
  const l=E.createLife({mode:country==='VN'?'vn':'world',country,seed,year:1990});
  Object.assign(l,{age:32,alive:true,indep:true,school:null,job:null,pending:[],sched:[],money:0,edu:3});
  delete l.flags.military;
  return l;
}
function rehabScene(l){
  const c=C.start(l,'health',{dec:'ld_tai_nan_lao_dong',k:'nhan'});
  c.stage=1;c.data.rehab899={sessions:1,at:l.age-1};
  c.open={at:l.age,token:'rehab-before:'+l.age};
  l.flags.dauLung=true;
  const d=E.DEC.rehabProgress899.make(l,r,{cid:c.id,token:c.open.token});
  l.pending=[d];return {c,d};
}
function has(d,key){return d.opts.some(o=>X.menuKey(d,o.k)===key);}
function choose(l,d,key){const o=d.opts.find(o=>X.menuKey(d,o.k)===key);assert(o,'Option '+key);l.pending=[d];E.resolve(l,o.k);}
function academic(l,kind,action){
  choose(l,E.DEC.academicCase125.make(l,r,{kind}),action);
  return E.WORLD120.p(l).academicCase;
}
function step(l,n=1){l.age+=n;A.academicYear(l,quiet);}
function study(l,kind='uni'){l.school=kind;l.schoolEnd=l.age+1;l.major='it';return l;}

{
  const l=adult(),{c,d}=rehabScene(l);
  assert(!has(d,'continue')&&has(d,'defer')&&!has(d,'lighter'));
  assert.equal(E.autoKey(l),'defer','autoplay can postpone');
  choose(l,d,'defer');
  assert.equal(l.money,0);assert(!l.pending.length);assert(!c.open);
  C.yearly(l,r,quiet,l.age);
  l.age++; C.yearly(l,r,quiet,l.age);
  assert(!l.sched.length,'a continued shortage does not requeue the popup');
  const saved=clone(l);E.migrateExt(saved);
  saved.money=saved.base;
  C.yearly(saved,r,quiet,saved.age);
  const c2=C.active(saved,'health'), hold=saved.sched.find(x=>x.id==='rehabProgress899');
  assert(hold&&c2.data.rehab899.sessions===1);
  saved.age=hold.at;saved.sched=[];
  const resumed=E.DEC.rehabProgress899.make(saved,r,hold.arg), cash=saved.money;
  choose(saved,resumed,'continue');
  assert.equal(c2.data.rehab899.sessions,2);
  assert(saved.money<cash&&!c2.data.rehab899.waitFunds);
  const after=saved.money;
  E.DEC.rehabProgress899.apply(saved,resumed,'continue',r,quiet);
  assert(saved.money===after&&c2.data.rehab899.sessions===2);
}
{
  const l=adult(975);l.money=l.base;
  const {c,d}=rehabScene(l);assert(has(d,'continue'));l.money=0;
  choose(l,d,'continue');
  assert.equal(l.money,0);assert(!l.pending.length);assert.equal(c.data.rehab899.sessions,1);
  l.age=c.due;C.yearly(l,r,quiet,l.age);
  assert(!C.active(l,'health')&&l.flags.dauLung);
  assert.equal(C.summary(l).done.at(-1).result,'rehab_wait_expired');
}
{
  const l=adult(976);l.job={id:'cong_nhan'};
  const {c,d}=rehabScene(l);choose(l,d,'lighter');
  assert.equal(E.HEALTH899.factor(l),.9);
  assert.equal(l.flags.health899.reducedUntil,l.age+1);assert.equal(c.next,l.age+2);
  assert.equal(c.data.rehab899.sessions,1);assert(!l.pending.length);
}
for(const country of ['VN','US','GB','JP']){
  const l=adult(977,country);l.money=l.base*10;
  const cost=l.base*.06,before=l.money,own=E.medOwnCost(l,cost,.5);
  assert(Math.abs(E.medBill(l,cost,'fixture',quiet,.5)-own)<1e-8,country+' quote matches debit');
  assert(Math.abs(l.money-(before-own))<1e-8);
}
{
  const l=study(adult(980));const end=l.schoolEnd;
  const q=academic(l,'stolen','archive');
  assert.equal(q.due,l.age+2);assert(A.academicBlocks(l));
  assert(!E.DEC.bao_ve_tn.valid(l));
  const logs=[];
  l.age++;A.academicYear(l,t=>logs.push(t));A.academicYear(l,t=>logs.push(t));
  assert.equal(q.result,'verified');assert.equal(logs.length,1);assert.equal(l.schoolEnd,end);
  assert(E.DEC.bao_ve_tn.valid(l));
}
{
  const l=study(adult(981)),q=academic(l,'accused','ignore');
  const school=E.WORLD120.s(l);school.debtCredits=3;
  const logs=[];
  l.age++;A.academicYear(l,t=>logs.push(t));A.academicYear(l,t=>logs.push(t));
  assert.equal(logs.length,1);
  choose(l,E.DEC.academicReview125.make(l,r),'evidence');
  assert.equal(q.evidence,1);assert(!has(E.DEC.academicReview125.make(l,r),'evidence'));
  l.age++;
  E.gradFail(l,r,t=>logs.push(t),l.age);
  assert.equal(q.status,'replacement');assert.equal(q.result,'expired');assert.equal(q.readyAt,l.age+1);
  assert(A.academicBlocks(l)&&!E.DEC.bao_ve_tn.valid(l));assert.equal(school.debtCredits,3);
  assert(!l.pending.some(d=>d.id==='studyReview136'),'no second reminder from the graduation checklist');
  l.age++;A.academicYear(l,t=>logs.push(t));
  assert.equal(q.status,'resolved');assert.equal(school.debtCredits,3);assert.equal(l.edu,3);
  assert.equal(logs.filter(t=>t.includes('cần thêm chứng cứ')).length,1);
  assert.equal(logs.filter(t=>t.includes('hết hạn')).length,1);
  assert.equal(logs.filter(t=>t.includes('đã sẵn sàng')).length,1);
}
{
  const l=study(adult(982),'post');l.flags.pg106={lv:6,started:l.age-1,end:l.age+1,done:false};
  const q=academic(l,'accused','ignore');choose(l,E.DEC.academicReview125.make(l,r),'withdraw');
  assert.equal(q.status,'replacement');
  assert(!E.DEC.pg106_defense.valid(l,{started:l.flags.pg106.started,lv:6}));
  const saved=clone(l);E.migrateExt(saved);step(saved);
  assert(!A.academicBlocks(saved)&&saved.flags.pg106.done===false);
  assert.equal(E.WORLD120.p(saved).academicCase.result,'withdrawn');
}
{
  const l=study(adult(983));const q=academic(l,'accused','ignore');l.age++;
  choose(l,E.DEC.academicReview125.make(l,r),'evidence');l.age++;
  choose(l,E.DEC.academicReview125.make(l,r),'evidence');A.academicYear(l,quiet);
  assert.equal(q.result,'verified','evidence submitted on the last year is accepted before closing');
}
{
  const l=study(adult(984));const q=E.WORLD120.s(l).academicCase={at:l.age-9,status:'pending',evidence:0};
  l.edu=4;A.academicYear(l,quiet);assert.equal(q.status,'replacement');
  step(l);assert.equal(q.status,'resolved');assert.equal(l.edu,4,'legacy overdue case closes without granting or removing a degree');
}
{
  const l=adult(985);l.edu=5;l.job={id:'nghien_cuu'};
  E.H.sched(l,'nc_bao_ve',2,{lv:6});
  const q=academic(l,'stolen','archive');assert(q.researchDefense&&!l.sched.length);
  step(l);assert.equal(q.result,'verified');
  assert(q.researchDefense&&!l.sched.length,'holds the appointment until the language requirement is met');
  l.lang={en:3};l.langAt={en:l.age};step(l);
  assert(l.sched.some(d=>d.id==='nc_bao_ve'&&d.arg.lv===6),'research defence returns after review');
}
console.log('PASS 9.7.4: same-year rehab loop, wait/reload/expiry, price, and academic deadlines, credits and defence.');
