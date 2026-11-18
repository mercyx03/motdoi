'use strict';
const assert=require('node:assert/strict'),{gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,F=E.FOOTBALL,D=E.FOOTBALL_DATA,N=G.NAMES,T=E.SPAIN_COMMON970,log=()=>{};
let checks=0;function ok(v,m){assert(v,m);checks++;}
function life(country='ES',year=2026,name='Alejandro García López',sex='M'){
 const l=E.createLife({mode:'world',country,year:year-26,seed:970,name,gender:sex});
 Object.assign(l,{age:26,alive:true,school:null,schoolEnd:null,job:null,pending:[],sched:[],abroad:null,indep:true,money:l.base*100,edu:3});l.flags.military=0;return l;
}
function player(ability=100,rep=100,y=2026,country='SA'){
 const l=life(country,y),s=F.init(l,()=>.5);s.potential=100;s.form=s.fitness=ability;s.reputation=rep;s.internationalRep=0;D.skills.forEach(k=>s.skills[k]=ability);return l;
}
function baby(l,random=()=>.25){const n=l.kids.length;E.RELATIONS108.deliver(l,l.partner,random,log,{source:'partner'});assert(l.kids.length>n);return l.kids[n];}
function partner(l,name='Lucía Martínez Gómez'){l.partner={name,sex:l.sex==='M'?'F':'M',age:25,status:'married',since:24,alive:true,inc:0,relation108:'970-spouse'};}
function choose(l,key){const d=E.DEC.spainCommon970.make(l,()=>0),i=d.data.keys.indexOf(key);ok(i>=0,'name choice '+key);E.DEC.spainCommon970.apply(l,d,String(i),()=>0,log);}
// League dates and explicit player choice: no free transfer, wage or nationality change on an offer.
let l=player(),s=F.peek(l),before=l.money;
ok(D.markets.SA[1]==='Saudi Pro League'&&D.clubs.filter(c=>c.country==='SA').length===4,'Saudi catalogue');
ok(F.wage(l,F.club('SA-0'))===60000000,'world class ability/reputation reaches $60m');
ok(F.negotiate(l,'SA-0',()=>0,log),'negotiate Saudi');ok(!s.contract&&l.money===before,'offer neither signs nor pays');
let offer=s.offers[0];ok(offer.annualUSD===60000000&&offer.capUSD970===60000000,'offer stores salary cap');
const restored=JSON.parse(JSON.stringify(l));E.migrateExt(restored);ok(F.accept(restored,offer.id,()=>0,log),'saved offer accepted');
s=F.peek(restored);ok(s.contract.capUSD970===60000000&&s.club==='SA-0'&&restored.country==='SA','contract/residence valid');
restored.age++;ok(F.wageNow(restored,s.contract)===60000000,'annual raise cannot exceed Saudi cap');
const pay=F.income(restored,()=>.5,log);ok(pay>0&&F.income(restored,()=>.5,log)===0,'salary paid once');
ok(F.renew(restored,()=>0,log,1.2)&&s.contract.annualUSD<=60000000,'renewal counteroffer keeps salary ceiling');
// Skill or reputation separately unlock premium; an ordinary player gets an ordinary salary.
ok(F.wage(player(100,0),F.club('SA-1'))===60000000,'high skill alone');
ok(F.wage(player(70,100),F.club('SA-2'))===60000000,'global reputation alone with viable ability');
ok(F.wage(player(40,100),F.club('SA-3'))<15000000,'fame cannot rescue unplayable ability');
ok(F.wage(player(70,20),F.club('SA-0'))<15000000,'ordinary player no star premium');
ok(F.wage(player(100,100,2022),F.club('SA-0'))<=3000000,'historical salary no modern premium');
l=player(100,100,1975);ok(!F.available(l,F.club('SA-0'))&&F.wage(l,F.club('SA-0'))===0,'before founding');
ok(F.negotiate(l,'SA-0',()=>0,log)===false&&!F.trialOptions(l).some(c=>c.country==='SA'),'historic negotiation and academy guarded');
ok(!E.DEC.footballMarkets.make(l,()=>0).data.keys.includes('SA'),'historic market hidden');
l.birthYear++;ok(F.available(l,F.club('SA-0'))&&F.leagueName(l,F.club('SA-0'))==='Saudi Premier League','1976 league and historical name');
l=player(100,100,2026,'GB');l.country='GB';s=F.peek(l);F.negotiate(l,'SA-0',()=>0,log);const nationality=l.country;
ok(F.accept(l,s.offers[0].id,()=>0,log),'international Saudi transfer');ok(E.H.resCode(l)==='SA'&&l.country===nationality,'residence changes, citizenship retained');
// Existing non-Saudi contract arithmetic stays unchanged.
ok(F.wageNow(l,{annualUSD:100000,start:2025,raise:.05})===105000,'legacy wage growth preserved');
// Exact units including compound given names, internal y, multiword and hyphenated surnames.
for(const full of ['Juan Carlos García López','María Teresa Del Bosque Palacios','Javier Silva y Mendoza García-López','Javier García y García']){
 const p=N.spanishParse(full);ok(p&&p.full===full,'parse '+full);
}
const dad=N.spanishParse('Alejandro García López'),mom=N.spanishParse('Lucía Martínez Gómez');
let k=N.spanishChild(()=>0,'M',dad,mom,'father',' ','Javier');ok(k.full==='Javier García Martínez','one first surname from each parent');
k=N.spanishChild(()=>0,'M',dad,mom,'mother',' ','Javier');ok(k.full==='Javier Martínez García','maternal-first retains both first surnames');
ok(N.spanishChild(()=>0,'M',k,N.spanishParse('Ana López Blanco'),'father',' ','Lucas').full==='Lucas Martínez López','grandchild passes first registered surname');
ok(N.spanishChild(()=>0,'M',dad,N.spanishParse('Ana García Gómez'),'mother',' ','Javier').full==='Javier García García','reversing equal surnames does not invent López');
ok(N.spanishChild(()=>0,'M',dad,N.spanishParse('Ana García Gómez'),'father',' y ','Javier').full==='Javier García y García','connector explicit');
ok(N.spanishChild(()=>0,'M',null,mom,'father',' ','Javier').full==='Javier Martínez Gómez','one recognized parent supplies both surnames');
// Weighted name generation, not a population-frequency claim.
const seeded=E.LIFE138.random('spanish-distribution970');let compounds=0,common=0,rare=0,special=0;
for(let i=0;i<3000;i++){
 const p=N.worldName(seeded,'es',i%2?'M':'F').es970;compounds+=p.given.includes(' ')?1:0;
 if(N.P.es.La.includes(p.first))common++;else if(N.ES970.rare.includes(p.first))rare++;else special++;
 ok(!p.full.includes('Todos los Santos'),'no ceremonial phrase');
}
ok(compounds>750&&compounds<1050&&common>1950&&common<2250&&rare>450&&rare<750&&special>180&&special<420,'70/30 and 70/20/10 sampler');
// New households agree with real parent surname records; no surname is rerolled on load.
for(let seed=0;seed<60;seed++){
 const a=E.createLife({mode:'world',country:'ES',year:2000,seed});const p=T.parents(a);
 if(!T.eligible(a)||!a.es970)continue;
 ok(a.es970.first===(p.father?p.father.first:p.mother.first),'birth first surname');
 ok(a.es970.second===(p.father?p.mother?.first:p.mother?.second),'birth second surname');
 for(const sib of a.sibList||[])if(!sib.step138){const p=T.profile(sib);ok(p.first===a.es970.first&&p.second===a.es970.second,'siblings share pair');}
 const name=a.name;E.migrateExt(a);ok(a.name===name,'load does not reroll');
}
// Real birth wrapper, both player sexes, order lock and multigeneration handoff.
for(const sex of ['M','F']){
 l=life('ES',2026,sex==='M'?'Alejandro García López':'Lucía Martínez Gómez',sex);partner(l,sex==='M'?'Lucía Martínez Gómez':'Alejandro García López');
 choose(l,'mother');k=baby(l);ok(k.es970.first==='Martínez'&&k.es970.second==='García','birth uses actual mothers first surname');
 const babyOptions=T.kidOptions(l,k);ok(babyOptions.length===5&&babyOptions.every(o=>N.spanishParse(o.full).first==='Martínez'&&N.spanishParse(o.full).second==='García'),'baby naming keeps registered pair');
 E.UPDATE110.uid(l,k);const naming=E.DEC.kidName919.make(l,()=>0,{uid:k.uid110});E.DEC.kidName919.apply(l,naming,'n0',()=>0,log);ok(k.es970.full===k.name,'naming synchronizes surname metadata');
 ok(!E.DEC.spainCommon970.make(l,()=>0).data.keys.includes('father'),'same-parent order locked after first child');
 const o=E.childOpts(l,k),child=E.createLife(o);ok(child.sur==='Martínez'&&child.es970.second==='García'&&child.name===k.name,'new child life preserves registered surname pair');
 const saved=JSON.parse(JSON.stringify(l));E.migrateExt(saved);k=baby(saved,()=>.8);ok(k.es970.first==='Martínez'&&k.es970.second==='García','next birth after reload uses same order');
}
// Pre-2000 birth does not offer maternal-first registration.
l=life('ES',1999);partner(l);ok(!E.DEC.spainCommon970.make(l,()=>0).data.keys.includes('mother'),'dated surname choice');
// Name-change case is persisted, not instant, requires explicit completion, never changes existing children's names.
l=life();partner(l);k=baby(l);const kidName=k.name,original=l.name;
ok(T.request(l,'reverse')&&!T.decide(l,log)&&l.name===original,'request not immediate');
l=JSON.parse(JSON.stringify(l));l.age++;ok(T.decide(l,log)&&l.name==='Alejandro López García','later registered reversal');
ok(E.ID919.nameRec(l).legal===l.name&&E.ID919.nameRec(l).family.join(' ')==='López García'&&E.ID919.nameRec(l).docs.length>=2,'shared legal identity and document update');
ok(l.sur==='López'&&l.kids[0].name===kidName&&!T.decide(l,log),'first transmitted surname changes once; existing child stable');
const lateSibling=E.H.name(l,()=>0,'M',l.sur).es970;ok(lateSibling.first===l.fam.surnames970.first&&lateSibling.second===l.fam.surnames970.second,'a new sibling keeps birth-family order after player reversal');
ok(T.request(l,'join'),'connector request');l.age++;ok(T.decide(l,log)&&l.name==='Alejandro López y García','registered connector');
ok(T.request(l,'maternal'),'maternal case can be submitted');l.age++;const oldName=l.name;
ok(!T.decide(l,log)&&l.name===oldName&&T.state(l).history.at(-1).status==='evidence-required','honour alone not automatic paternal deletion');
l=life();l.fam.noDad=true;l.fam.mName='Lucía Martínez Gómez';delete l.fam.orphan;
ok(T.request(l,'maternal'),'single-filiation correction request');l.age++;ok(T.decide(l,log)&&l.name==='Alejandro Martínez Gómez','documented single maternal filiation');
l=life();l.age=17;ok(!T.request(l,'reverse'),'minor cannot submit adult case');
// Legacy custom names stay literal, including metadata-free saves.
l=life('ES',2026,'Nombre Personalizado');delete l.es970;const raw=l.name;E.migrateExt(l);ok(l.name===raw,'unparseable custom save name preserved');
// Births outside marriage still use the acknowledged father's first surname, never an invented absence.
l=life('ES',2026,'Lucía Martínez Gómez','F');partner(l,'Alejandro García López');l.partner.status='dating';k=baby(l);
ok(k.es970.first==='García'&&k.es970.second==='Martínez','acknowledged outside-marriage parent');
// A twin generated after the normal birth keeps the same surname units and a distinct given name.
let twinFound=false;
for(let i=0;i<600&&!twinFound;i++){
 const t=life();t.id='spanish-twins970:'+i;partner(t);const first=baby(t);E.GENETICS912.onBirths(t,log);
 if(t.kids.length>1){twinFound=true;ok(t.kids.every(k=>k.es970.first==='García'&&k.es970.second==='Martínez'),'twin surname units');ok(new Set(t.kids.map(k=>k.name)).size===t.kids.length,'distinct twin names');}
}
ok(twinFound,'twin path exercised');
l=life();partner(l,'María Teresa Del Bosque Palacios');l.name='Juan Carlos Silva y Mendoza García-López';l.es970=N.spanishParse(l.name);l.sur=l.es970.first;k=baby(l);
ok(k.es970.first==='Silva y Mendoza'&&k.es970.second==='Del Bosque','real birth preserves multiword surname units');
k.es970=N.spanishName('Francisco Javier','Fernández de la Vega','Silva y Mendoza');k.name=k.es970.full;
const longChild=E.createLife(E.childOpts(l,k));ok(longChild.name===k.name&&longChild.es970.full===k.name,'long compound legal name survives child handoff without truncation');
// A stale menu cannot change the shared registration order after a child has been born.
l=life();partner(l);const stale=E.DEC.spainCommon970.make(l,()=>0),index=stale.data.keys.indexOf('mother');baby(l);
E.DEC.spainCommon970.apply(l,stale,String(index),()=>0,log);ok(T.order(l).order==='father','stale order choice rejected after birth');
console.log('PASS saudi-spain970: '+checks+' checks');
