'use strict';const assert=require('assert'),G=require('./hardcore-isolation').gameContext(),E=G.E,F=E.FOOTBALL;
for (const [country, league, first] of [['DE','2. Bundesliga','Hertha BSC'],['ES','LALIGA HYPERMOTION','RC Deportivo']]) {
  const teams = E.FOOTBALL_DATA.clubs.filter(c => c.country === country && c.tier === 2);
  assert.equal(teams.length, 4);
  assert.equal(teams[0].id, country+'-4');
  assert.equal(teams[0].name, first);
  assert(teams.every(c => c.league === league && c.referenceSeason === '2025/26' && c.source));
}
for (const [country, league] of [['DE','3. Liga'],['ES','Primera Federación']]) {
  const teams = E.FOOTBALL_DATA.clubs.filter(c => c.country === country && c.tier === 3);
  assert.deepEqual(teams.map(c => c.id), [8,9,10,11].map(i => country+'-'+i));
  assert(teams.every(c => c.league === league && c.referenceSeason === '2025/26' && c.source && !c.cup));
}
function life(age=18,skill=90){const l=E.createLife({mode:'vn',seed:897});Object.assign(l,{age,school:null,indep:true,job:null,pending:[],money:l.base*1000,talent:'thể thao',talentSub:'bóng đá',skill});l.flags.military=0;F.init(l,()=>.5);return l;}
{
  let promoted=life(20,95);
  assert(F.negotiate(promoted,'VN-4',()=>0,()=>{}));
  assert(F.accept(promoted,F.peek(promoted).offers[0].id,()=>.5,()=>{}));
  const first=F.season(promoted,()=>.5,()=>{});
  assert.equal(first.tier,2);
  assert.equal(first.movement.to,1);
  assert.equal(F.season(promoted,()=>.5,()=>{}),first);
  promoted=E.migrate(JSON.parse(JSON.stringify(promoted)));
  assert.equal(F.peek(promoted).divisions[first.movement.counterpart],2);
  promoted.age++;
  const next=F.season(promoted,()=>.5,()=>{});
  assert.equal(next.tier,1);
  assert.equal(next.club,'VN-4');
  assert.equal(next.table.length,first.table.length);
  assert(!next.table.some(row=>row.id===first.movement.counterpart));
}
function choose(l,key){const d=l.pending[0];const i=d.data&&d.data.keys?d.data.keys.indexOf(key):null;const k=i==null?key:String(i);assert(d.opts.some(o=>o.k===k),d.id+' exposes '+key);E.resolve(l,k);}
let high=life(),low=life(18,10),c=F.club('VN-3');assert(F.rating(high)>F.rating(low)+25);assert(F.negotiationChance(high,c)>F.negotiationChance(low,c));let before=F.rating(high);high.skill+=5;F.syncTalent(high);assert(F.rating(high)>before);let once=JSON.stringify(F.peek(high).skills);F.syncTalent(high);assert.equal(JSON.stringify(F.peek(high).skills),once);
let unrelated=life();unrelated.flags.football=null;unrelated.talent='game';unrelated.talentSub='FPS';unrelated.skill=100;F.init(unrelated,()=>.5);assert(F.rating(unrelated)<50,'unrelated game skill is not football experience');
let l=life();assert(F.negotiate(l,'VN-3',()=>0,()=>{}));assert(F.negotiate(l,'VN-4',()=>0,()=>{}));assert(F.negotiate(l,'VN-5',()=>0,()=>{}));assert(!F.negotiate(l,'VN-6',()=>0,()=>{}));assert.equal(F.peek(l).offers.filter(x=>x.kind==='pro').length,3);assert(!F.negotiate(l,'VN-3',()=>0,()=>{}));
l=life(16);E.act(l,'footballCareer');choose(l,'trials');choose(l,'VN');choose(l,'VN-3');assert(l.pending[0].opts.some(o=>o.l.includes('Đàm phán')),'young player can choose professional route, not only academy');l.rs=1;choose(l,'negotiate');assert.equal(l.pending[0].id,'footballOutcome897');assert(l.pending[0].text.includes('VN')||l.pending[0].text.includes('CLB')||l.pending[0].text.includes('hợp đồng'));assert.equal(l.acts,1,'completed negotiation costs once, previews free');
l=life();F.negotiate(l,'VN-3',()=>0,()=>{});E.act(l,'footballCareer');choose(l,'offers');choose(l,F.peek(l).offers[0].id);assert.equal(l.pending[0].id,'footballSign897');choose(l,'sign');assert(F.employed(l));assert.equal(l.job.id,'vdv');assert(!l.flags.needJob&&!l.flags.upgradeJob);assert.equal(l.pending[0].id,'footballOutcome897');choose(l,'cancel');l.flags.needJob=true;l.flags.upgradeJob=true;E.beginYear(l,{});assert(!l.pending.some(d=>d.id==='job'),'active pro contract prevents automated job search');l.pending=[];const paid=E.careerYear(l,()=>.8,()=>{});assert(paid>0);assert.equal(E.careerYear(l,()=>.8,()=>{}),0);
// Restore a contract's missing occupation on load, without duplicate contract or payroll.
l.job=null;l.flags.needJob=true;l=E.migrate(JSON.parse(JSON.stringify(l)));assert(F.employed(l)&&l.job.id==='vdv');assert(!l.flags.needJob&&!l.flags.upgradeJob);assert.equal(E.careerYear(l,()=>.8,()=>{}),0);
l=life();E.startJob(l,'ke_toan',()=>.5,()=>{},true);F.negotiate(l,'VN-3',()=>0,()=>{});let offer=F.peek(l).offers[0];assert(!F.accept(l,offer.id,()=>0,()=>{}),'API cannot silently resign another career');E.act(l,'footballCareer');choose(l,'offers');choose(l,offer.id);assert(l.pending[0].text.includes('bàn giao'));choose(l,'sign');assert(F.employed(l),'explicit confirmation switches to real football job');
l=life();F.negotiate(l,'JP-6',()=>0,()=>{});offer=F.peek(l).offers[0];l.flags.world120=l.flags.world120||{};l.flags.world120.exitOrder={until:l.age+2,reason:'test'};assert(!F.accept(l,offer.id,()=>0,()=>{}));assert(!F.peek(l).contract&&!l.job,'blocked travel cannot partially sign');
console.log('PASS football897: relevant talent bridge, comparative odds, 3 clubs, visible outcomes, turn accounting, explicit signing/job switch, payroll, job-search suppression, migration and travel guard');
