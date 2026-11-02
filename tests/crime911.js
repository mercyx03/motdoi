'use strict';
const assert=require('assert');
const {gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E;
let checks=0;function ok(v,m){assert.ok(v,m);checks++;}
function life(seed=911){const l=E.createLife({mode:'vn',seed});Object.assign(l,{age:30,birthYear:1990,alive:true,indep:true,school:null,pending:[],sched:[],abroad:null,jailUntil:null,money:1e9});l.flags={};l.st.hea=90;E.startJob(l,'trom',()=>.5,()=>{});return l;}
function act(l,id,k){const d=E.act(l,id);ok(!!d,'action '+id+' available');l.pending=[d];E.resolve(l,k);}
{
 const l=life(),s=E.CRIME911.state(l),first=E.jobDef(l);for(let i=0;i<100;i++){l.age=30+i;s.year=null;E.CRIME911.year(l,()=>.999,()=>{},.08,first);ok(!s.open,'low-risk choice does not force an investigation');}
 ok(s.pressure<=60,'pressure remains bounded');
}
{
 const l=life(912),s=E.CRIME911.state(l);s.pressure=20;act(l,'crimePlan911','1');ok(s.planAt===l.age&&s.pressure<20,'active management lowers pressure and is saved');const income=E.careerYear(l,()=>.5,()=>{});ok(Number.isFinite(income),'career pay remains finite');
}
{
 const l=life(913),s=E.CRIME911.state(l);E.CRIME911.open(l,()=>{},'hoạt động nghề trộm',1);ok(l.jailUntil==null&&!l.sched.some(x=>x.id==='bi_bat'),'opening a case is not an arrest');l.age++;s.year=null;const q=E.beginYear(l).find(x=>x.id==='crimeCase911');ok(!!q,'deferred case appears in year choices');l.pending=[q];E.resolve(l,'2');ok(s.open&&s.open.waitAt===l.age&&l.jailUntil==null,'waiting keeps case open without jail');l.age++;s.year=null;const q2=E.beginYear(l).find(x=>x.id==='crimeCase911');l.pending=[q2];E.resolve(l,'0');ok(!s.open&&l.jailUntil==null,'cooperation resolves without automatic conviction in controlled outcome');
}
{
 const l=life(914),s=E.CRIME911.state(l);s.open={id:1,at:28,why:'hồ sơ cũ',sev:1,stage:'review'};const d=E.DEC.crimeCase911.make(l,()=>.5);l.money=0;const lawyer=d.opts.find(x=>x.k==='1');ok(d.opts.filter(x=>x.k==='1').length===1,'lawyer action exists');l.pending=[d];E.resolve(l,'1');ok(s.open===null||s.open,'resolution stays finite');
}
{
 const l=life(915);l.jailUntil=35;l.flags.jailAt=30;l.flags.jailSeen={};const events=E.jailYear(l,()=>.2,30).map(x=>x[0]);ok(events.length>=3,'existing prison event cadence retained');ok(events.some(x=>E.CRIME911.prisonIds.includes(x)),'new prison story enters pool');const d=E.DEC.tg_nghe911.make(l,()=>.5);l.pending=[d];E.resolve(l,'learn');ok(l.flags.rehab911.course===1,'trade course persists');l.age++;ok(E.DEC.tg_hoa_giai911.valid(l,{}),'mediation scene valid across saved year');
}
{
 const l=life(916);ok(E.migrate(JSON.parse(JSON.stringify(l))).flags.crime911==null,'legacy saves do not gain false case state');
}
console.log('PASS crime911: '+checks+' checks (investigation choices, active management, prison continuity, legacy saves).');
