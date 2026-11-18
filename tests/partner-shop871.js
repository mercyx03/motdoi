'use strict';
const assert=require('assert'),{gameContext}=require('./hardcore-isolation'),G=gameContext(),E=G.E;
let checks=0;function ok(v,m){assert(v,m);checks++;}
function life(){const l=E.createLife({mode:'vn',seed:87102});Object.assign(l,{age:30,alive:true,indep:true,school:null,money:l.base*100,pending:[],sched:[]});l.flags.military=0;l.partner={name:'Lan',sex:'F',age:29,alive:true,status:'married',inc:3,savings158:0};return l;}
function open(l,k){const d=E.DEC.shopAsk920.make(l,()=>.5);E.DEC.shopAsk920.apply(l,d,k,()=>.5,()=>{});return d;}
{
 let l=life(),money=l.money,d=open(l,'stake'),p=l.partner,q=p.shop920,c=E.BUSINESS123.companies(l).find(c=>c.uid110===q.company871);
 ok(c&&c.share===50&&c.holders137[0].share===50,'single corporate cap table');ok(c.value===l.base*1.5&&c.treasury165.cash===c.value,'capital funded once');ok(l.money===money-l.base*1.5,'capital debited once');
 E.DEC.shopAsk920.apply(l,d,'stake',()=>.5,()=>{});ok(l.money===money-l.base*1.5&&E.BUSINESS123.companies(l).length===1,'stale card cannot duplicate business');
 const inc=p.inc;l.age++;E.companyYear133(l,E.LIFE138.random('shop871'),()=>{});const after=l.money;E.KIN920.shopYear(l,()=>.5,()=>{});E.KIN920.shopYear(l,()=>.5,()=>{});ok(l.money===after&&p.inc===inc,'no parallel dividends or wage fabrication');ok(c.treasury165.years.length===1,'corporate annual report created');
 l=JSON.parse(JSON.stringify(l));E.migrateExt(l);E.KIN920.shopYear(l,()=>.5,()=>{});ok(E.BUSINESS123.companies(l).length===1,'save load does not duplicate company');
}
{
 const l=life();open(l,'loan');const p=l.partner,q=p.shop920,c=E.BUSINESS123.companies(l)[0];ok(c.share===0&&c.holders137[0].share===100,'loan confers no shares');p.savings158=100;const before=l.money,owed=q.owed;E.KIN920.shopYear(l,()=>.5,()=>{});const paid=owed-q.owed;ok(paid>0&&p.savings158===100-paid&&l.money===before+paid,'loan repayment debits real partner funds');E.KIN920.shopYear(l,()=>.5,()=>{});ok(l.money===before+paid,'loan repayment once per year');
 const old=q.owed;E.abroadConvert(l,2);ok(q.owed===old*2,'loan balance follows currency');
}
{
 const l=life();l.partner.shop920={cap:100,kind:'stake',val:110,at:20};const before=l.money;E.KIN920.shopYear(l,()=>.5,()=>{});ok(l.money===before&&E.BUSINESS123.companies(l)[0].value===110,'legacy shop migrates without charging capital');E.KIN920.shopYear(l,()=>.5,()=>{});ok(E.BUSINESS123.companies(l).length===1,'legacy migration idempotent');
}
{
 const l=life();open(l,'loan');const p=l.partner,q=p.shop920;p.savings158=100;q.closed=l.age;p.debt158=20;p.owe=10;const owed=q.owed;const facts=E.RELATIVE163.facts(l,p,false);ok(facts.find(x=>x[0]==='Nợ cá nhân')[1]===E.H.money(l,30+owed),'personal finance includes shop loan without merging other debt');E.KIN920.shopYear(l,()=>.5,()=>{});ok(q.owed<owed&&p.debt158===20&&p.owe===10,'closing shop does not cancel personal loan or repay unrelated debts');
}
{
 const l=life();l.partner.shop920={cap:100,kind:'loan',val:0,at:20,closed:22,owed:70};l.partner.savings158=100;E.KIN920.shopYear(l,()=>.5,()=>{});ok(!E.BUSINESS123.companies(l).length&&l.partner.shop920.owed===55,'legacy closed shop repays debt without reopening company');
}
console.log('PASS partner-shop871: '+checks+' checks');
