'use strict';
const assert=require('assert'),{gameContext}=require('./hardcore-isolation');const E=gameContext().E;let n=0;
function ok(x,t){n++;assert(x,t);}
const copy=x=>JSON.parse(JSON.stringify(x));
function life(mode='vn',difficulty='normal',talent='làm đẹp'){
 const l=E.createLife({mode,country:mode==='world'?'US':'VN',difficulty,seed:10922,year:2026});
 l.age=32;l.alive=true;l.indep=true;l.retired=false;l.school=null;l.abroad=null;l.jailUntil=null;l.flags.military=0;l.flags.needJob=false;l.pending=[];l.acts=0;l.flags.actAt={};l.talent=talent;l.skill=95;l.money=l.base*20;l.st.hea=85;l.flags.career109={projects:3,reputation:60};return l;
}
function choose(l,id,k,r=()=>0){const d=E.DEC[id].make(l,r);l.pending=[d];E.DEC[id].apply(l,d,k,r,function(t,k){l.log.push({a:l.age,t:t,k:k});});l.pending=l.pending.filter(x=>x!==d);return d;}
for(const mode of ['vn','world'])for(const difficulty of ['normal','hardcore'])for(const talent of E.TALENTS){
 let l=life(mode,difficulty,talent);ok(!!E.CAREER109.paths[talent],'path exists '+talent);
 l.skill=89;ok(/cấp 10/.test(E.CAREER109.reason(l,'projectAt')),'level locked');l.skill=95;
 const before=l.money,oldJob=JSON.stringify(l.job);choose(l,'expert109','portfolio');
 ok(l.flags.career109.projects===4,'project progresses '+talent);ok(l.money>before-l.base*.025&&Number.isFinite(l.money),'successful contract receipt after fee');ok(JSON.stringify(l.job)===oldJob,'project never switches job');
 const frozen=JSON.stringify(l);const d={data:{at:l.age,talent:l.talent,job:l.job&&E.resolveJob(l.job.id),base:l.base,done:false}};
 E.DEC.expert109.def.opts[0].run(l,()=>0,()=>{},d.data);ok(JSON.stringify(l)===frozen,'cannot repeat project same year');
 l=life(mode,difficulty,talent);l.money=0;ok(/vốn/.test(E.CAREER109.bizReason(l)),'capital reason');const broke=JSON.stringify(l);choose(l,'talentBiz109','open');ok(l.money===0&&!(l.ventures||[]).some(v=>v.k===E.CAREER109.paths[talent].bizKey),'no unfunded venture');
 l=life(mode,difficulty,talent);const cost=E.wealth.bizV(l,90*E.CAREER109.paths[talent].cap),cash=l.money;
 choose(l,'talentBiz109','open');const v=l.ventures.find(v=>v.k===E.CAREER109.paths[talent].bizKey);
 ok(!!v&&v.br===1&&v.cap===cost,'venture accounting');ok(Math.abs(l.money-(cash-cost))<1e-7,'charged capital once');ok(l.money>=l.base*.3,'reserve retained');
 const f=l.money;choose(l,'talentBiz109','open');ok(l.money===f&&l.ventures.filter(x=>x.k===v.k).length===1,'duplicate blocked');
 E.wealth.investYear(l,()=>.5,()=>{},l.age);ok(Number.isFinite(l.money)&&Number.isFinite(v.cap),'new venture annual accounting');
}
let l=life();E.startJob(l,'makeup',()=>.5,()=>{},true);l.job.rank=1;l.job.yrs=3;l.skill=95;l.flags.career109={projects:3,reputation:80};
ok(E.CAREER109.promotionReason(l)===true,'experienced makeup can apply');choose(l,'expert109','advance');ok(l.job.rank===2,'one rank at a time');
l.age++;l.flags.career109.projectAt=-1;l.job.yrs=3;choose(l,'expert109','advance');ok(l.job.rank===3&&/cao cấp/.test(E.jobTitle(l)),'makeup advanced role visible');
l=life();l.skill=95;l.money=0;const p=choose(l,'expert109','portfolio');ok(!p.opts.some(o=>o.k==='portfolio'),'unaffordable choice hidden');ok(l.money===0,'no involuntary spending');
l=life();let original=l.job&&l.job.id;const stale=E.DEC.expert109.make(l,()=>0);l.age++;const cash=l.money;E.DEC.expert109.apply(l,stale,'portfolio',()=>0,()=>{});ok(l.money===cash,'stale year cannot charge');
l=life();E.startJob(l,'ke_toan',()=>.5,()=>{},true);const resign=E.DEC.nghi_viec? 'nghi_viec':null;
E.CAREER109.loss(l,{id:'ke_toan'}); // not lost yet
ok(!l.flags.career109.unemployment,'still employed no shock');
l.job=null;E.CAREER109.loss(l,{id:'ke_toan'});ok(l.flags.career109.unemployment.at===32,'loss persisted');
choose(l,'recovery109','save');ok(l.spend==='save','explicit lower budget');const year=E.HOOKS.year[E.HOOKS.year.length-1];l.age++;year(l,()=>.5,()=>{});ok(l.flags.career109.unemployment.years===1&&l.spend==='save','next-year aftermath persists');year(l,()=>.5,()=>{});ok(l.flags.career109.unemployment.years===1,'no duplicate followup');
E.startJob(l,'ke_toan',()=>.5,()=>{},true);l.age++;year(l,()=>.5,()=>{});ok(l.flags.career109.unemployment.closed&&l.spend==='save','employment recovery never resets budget');
l=life();l.partner={name:'Người yêu',alive:true,age:30,status:'dating',family100:{uid:'partner:109',trust:50,tension:40,lastActivity:31}};
choose(l,'repair109','promise');ok(!!l.partner.family100.promise109,'promise persists');l.age++;l.partner.family100.lastActivity=l.age;year(l,()=>.5,()=>{});ok(l.partner.family100.trust===53&&l.partner.family100.tension===36,'keeping promise heals gradually');
l=life();l.partner={name:'Người cũ',alive:true,age:30,status:'dating',family100:{uid:'partner:old',trust:50,tension:40}};const d=E.DEC.repair109.make(l,()=>0);l.partner={name:'Người mới',alive:true,age:30,family100:{uid:'partner:new',trust:60,tension:40}};const snapshot=JSON.stringify(l.partner);E.DEC.repair109.apply(l,d,'listen',()=>0,()=>{});ok(JSON.stringify(l.partner)===snapshot,'stale relationship cannot target new person');
l=life();l.age=14;l.indep=false;const before=JSON.stringify(l);const acts=E.actions(l);ok(acts.find(x=>x.id==='expert109').ok!==true,'minor locked');ok(JSON.stringify(l)===before,'rendering actions never mutates life');
ok(E.DEC.dating108.def.opts.some(o=>o.k==='age18')&&E.DEC.dating108.def.opts.some(o=>o.k==='age30'),'18-25 and 30-40 dating options');
for(const k of ['contract108','network108_person','childGuide108_path','familyPlan108'])ok(!!E.DEC[k],k+' existing');
console.log('PASS: '+n+' career/talent, enterprise, action conditions and multi-year aftermath checks.');
