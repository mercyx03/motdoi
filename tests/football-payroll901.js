'use strict';
const assert=require('assert'),{gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,F=E.FOOTBALL;
function pro(country){const l=E.createLife({mode:country==='VN'?'vn':'world',country,seed:901});Object.assign(l,{age:25,school:null,indep:true,job:null,pending:[],talent:'thể thao',talentSub:'bóng đá',skill:95,money:100000});l.flags.military=0;const s=F.init(l,()=>.8);s.potential=100;s.reputation=95;Object.keys(s.skills).forEach(k=>s.skills[k]=95);const c=E.FOOTBALL_DATA.clubs.find(c=>c.name.includes('Real Madrid'));const id=country==='VN'?'VN-0':c.id;assert(F.negotiate(l,id,()=>0,()=>{}));assert(F.accept(l,s.offers[0].id,()=>.5,()=>{}));s.contract.annualUSD=120000;s.contract.bonusUSD=0;s.contract.signingUSD=6000;s.injury=110;return {l,s};}
for(const country of ['VN','ES']){
 const {l,s}=pro(country);l.flags.health899={conditions:[{severity:3}],reducedUntil:l.age+2};E.CAREER_DEPTH900.sportState(l).injury=100;E.CAREER_DEPTH900.sportState(l).pressure=100;
 const pay=E.careerYear(l,()=>.5,()=>{}),expected=F.usd(l,126000*.85);
 assert(Math.abs(pay-expected)<1e-7,'contract survives health and sporting reductions');
 assert.equal(E.economy114Income(l,pay,'career'),pay,'no second general income reduction');
 assert(E.economy114Income(l,pay)<pay,'partner and ordinary income retain calibration');
 assert.equal(E.careerYear(l,()=>.5,()=>{}),0,'no double payment');
 const p=E.profile(l);assert(p.income.some(x=>x.v===-F.usd(l,s.earnings.taxAgentUSD)&&x.k.includes('đại diện')),'fees visible in personal income ledger');assert.equal(p.salary.gross,F.usd(l,120000)/12);assert.equal(p.salary.net,p.salary.gross*.85);
 const restored=E.migrate(JSON.parse(JSON.stringify(l)));assert.equal(E.careerYear(restored,()=>.5,()=>{}),0,'reload does not duplicate payment');
 l.age++;delete l.flags.health899;s.injury=0;
 E.beginYear(l,{});l.pending=[];E.finishYear(l);
 assert(Math.abs(l.fin.inc-F.usd(l,120000*.85))<1e-6,'actual finance receives full net contract salary');
 assert(Number.isFinite(l.money)&&l.fin.save===l.fin.inc+l.fin.partner+l.fin.interest-l.fin.spend,'personal cash ledger balances');
 assert.equal(s.earnings.signingUSD,0,'signing paid once');
 l.age=s.contract.end-l.birthYear;F.annual(l,()=>.5,()=>{});assert.equal(F.income(l,()=>.5,()=>{}),0,'expiry stops wages');
}
{
 const {l,s}=pro('VN');s.stage='free';s.contract=null;l.job=null;delete s.paid;
 assert.equal(F.income(l,()=>.5,()=>{}),0);assert.notEqual(s.paid,l.birthYear+l.age,'unpaid call must not consume payroll');
 s.paid=l.birthYear+l.age;delete s.earnings; // Legacy false paid marker from an unpaid check.
s.injury=0;assert(F.negotiate(l,'VN-1',()=>0,()=>{}));assert(F.accept(l,s.offers[0].id,()=>.5,()=>{}));assert(E.careerYear(l,()=>.5,()=>{})>0,'signing after unpaid call still receives wages');
 l.indep=false;const restored=E.migrate(JSON.parse(JSON.stringify(l)));assert(restored.indep,'old pro saves participate in personal finance');
}
console.log('PASS football payroll901: Real Madrid/Vietnam contract, actual annual finance, injury/health, one signing bonus, no duplicate/reload, expiry, late signing, old saves');
