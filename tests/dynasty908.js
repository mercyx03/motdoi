'use strict';
const assert=require('assert'),{loadGame}=require('./lib/quick'),G=loadGame(),E=G.E,D=E.DYNASTY908;let n=0;
function ok(v,m){assert(v,m);n++;}function near(a,b,m){ok(Math.abs(a-b)<1e-7*Math.max(1,Math.abs(b)),m+' '+a+' / '+b);}
function life(){const l=E.createLife({mode:'vn',seed:9082026,gender:'M',noOrphan:true});Object.assign(l,{age:48,alive:true,indep:true,school:null,pending:[],sched:[],abroad:null,job:null,money:l.base*1000,retired:false,jailUntil:null});l.flags.military=0;l.kids=[{name:'Con An',sex:'F',born:24,alive:true,adopted:false,close:85,study:95,edu:5,savings158:l.base*3},{name:'Con Bình',sex:'M',born:26,alive:true,close:65,study:70,edu:3,savings158:l.base*2,adopted:true},{name:'Con Chi',sex:'F',born:28,alive:true,close:40,study:60,edu:3,birthContext108:'outside',coParent108:{id:'old',name:'Người cũ',sex:'F'},custody:'other'}];l.partner={name:'Bạn đời hiện tại',sex:'F',age:46,alive:true,status:'married',since:23,relation108:'current',affection108:70};l.fam.fJob='công nhân';l.fam.mJob='giáo viên';E.LIFE138.sync(l);D.people(l).filter(p=>p.id!=='self').forEach(p=>{if(E.LIFE138.sync(l).people[p.id])E.LIFE138.sync(l).people[p.id].willing=true;});return l;}
function open(l,id,arg){l.pending=[E.DEC[id].make(l,()=>.1,arg||{})];return l.pending[0];}
function choose(l,key){const d=l.pending[0],k=key==='cancel'?key:String(d.data.keys.indexOf(key));ok(d.opts.some(o=>o.k===k),d.id+' exposes '+key);E.resolve(l,k);}
function person(l,i){return D.people(l).find(p=>p.person===l.kids[i]);}
function company(l,share=60){const c={name:'Công ty thử nghiệm',value:l.base*100,share,sector:'tech',governance:1,roles:{},holders137:[]};E.BUSINESS123.companies(l).push(c);E.TREASURY165.ensure(l,c,true);return c;}
for(const c of G.W.C){let l=life();l.mode='world';l.country=c.code;l.cur='usd';l.gdp=c.gdp;l.city=c.cities[0];l.abroad=null;let p=person(l,0),q=D.profile(l,p);ok(q.management>=0&&q.management<=100&&q.reputation<=100&&q.ambition<=100,'bounded profile '+c.code);for(const id of ['dynasty908','heirProfile908','heirSupport908','childBranch908','allowance908','governance908','familyGathering908','inheritanceReview908']){const d=E.DEC[id].make(l,()=>.2,{id:p.id});ok(!/undefined|NaN|\[object Object\]/.test(d.text+d.opts.map(o=>o.l).join(' ')),'clean '+id+' '+c.code);}near(D.usd(l,1000)*G.CUR.priceLevel(c.gdp),1000,'nominal USD '+c.code);let saved=E.migrate(JSON.parse(JSON.stringify(l)));ok(D.profile(saved,person(saved,0)).management===q.management,'save profile '+c.code);}
{
 let l=life(),p=person(l,0),q=D.profile(l,p);open(l,'heirSupport908',{id:p.id});choose(l,'self');ok(q.endorsements.self&&q.endorsements.self.at===l.age,'endorsement saved');let old=JSON.stringify(q.endorsements);open(l,'heirSupport908',{id:p.id});ok(!l.pending[0].opts.some(o=>o.k===String(l.pending[0].data.keys.indexOf('self'))),'repeat supporter disabled');ok(JSON.stringify(q.endorsements)===old,'opening no reroll');
}
for(const truth of [false,true]){
 let l=life(),contact={id:'oldContact',born:36,parent:{name:'Người cũ',sex:'F',relation108:'oldContact',residence108:'Đà Nẵng'}},c=D.createClaim(l,contact,()=>.1);c.truth=truth;c.consent=true;const money=l.money,count=l.kids.length;ok(l.age-c.person.born===12,'12-year-old notice');ok(D.verify(l,c,()=>0,()=>{}),'first stage');ok(l.kids.length===count,'unconfirmed not a legal child');ok(!D.verify(l,c,()=>0,()=>{}),'same-year no repeated proof');l=E.migrate(JSON.parse(JSON.stringify(l)));c=D.state(l).claims[0];l.age++;D.verify(l,c,()=>0,()=>{});ok(c.closed&&c.confirmed===truth,'fixed truth result after reload');ok(l.kids.length===count+(truth?1:0),'confirmed only enters kids');near(l.money,money-l.base*.03,'verification charged twice');if(truth){const p=person(l,l.kids.length-1);ok(!D.branch(l,p.person).acknowledged&&!D.branch(l,p.person).public,'confirmation not public acknowledgement');open(l,'childBranch908',{id:p.id});choose(l,'ack');open(l,'childBranch908',{id:p.id});choose(l,'introduce');ok(D.branch(l,p.person).public,'public reveal');ok(l.pending[0].id==='familyReaction908','spouse can react');choose(l,'honest');ok(D.state(l).reaction.due===l.age+1,'trust not repaired instantly');}}
{
 let l=life(),c=D.createClaim(l,{id:'declined',born:36,parent:{name:'Người nuôi dưỡng',sex:'F'}},()=>.1);c.consent=false;const m=l.money;D.verify(l,c,()=>0,()=>{});ok(!c.closed&&c.evidence===0&&l.money===m,'no forced consent or charge');l.money=0;l.age++;c.consent=true;D.verify(l,c,()=>0,()=>{});ok(!c.closed&&c.evidence===0,'no overdraft for verification');
}
for(const tier of ['basic','elite','heir']){
 let l=life(),p=person(l,0),q=D.profile(l,p),annual=D.annual(l,tier);l.money=annual*10+l.base*10;let m=l.money;open(l,'allowance908',{id:p.id});choose(l,tier);near(l.money,m-annual,'annual payment '+tier);let balance=p.person.support114.balance;near(balance,annual*(tier==='basic'?1:.7),'separate fund '+tier);ok(!D.fundAllowance(l,p,()=>{}),'no double charge');l=E.migrate(JSON.parse(JSON.stringify(l)));p=person(l,0);l.age++;l.money=0;D.fundAllowance(l,p,()=>{});ok(l.money===0&&!D.profile(l,p).allowance.active,'stop on shortage '+tier);}
{
 let l=life(),p=person(l,0);l.money=l.base;open(l,'allowance908',{id:p.id});ok(!l.pending[0].opts.some(o=>o.k===String(l.pending[0].data.keys.indexOf('elite'))),'ordinary family high plan blocked');near(D.usd(l,50000),1270,'USD to million VND');
}
for(const share of [0,10,49,51,100]){
 let l=life(),c=company(l,share);const p=person(l,0),q=D.profile(l,p);q.management=100;q.reputation=100;q.ambition=90;let e=D.entities(l).find(e=>e.company===c);if(!e){ok(share===0,'no phantom ownership');continue;}const before=c.share,m=l.money;ok(D.nominate(l,e,p,'ceo','steady'),'nomination');ok(!D.vote(l,e,'ceo',()=>{}),'wait before vote');l.age++;let result=D.vote(l,e,'ceo',()=>{});ok(result&&result.ballots.length,'real votes');ok(c.share===before&&l.money===m,'vote no money or share creation');ok(!D.vote(l,e,'ceo',()=>{}),'election no repeat');if(result.won)ok(c.roles.ceo.personId===p.id,'selected person appointed');}
{
 let l=life(),c=company(l,20),p=person(l,2);D.profile(l,p).management=0;D.profile(l,p).reputation=0;D.nominate(l,D.entities(l)[0],p,'ceo','market');l.age++;let r=D.vote(l,D.entities(l)[0],'ceo',()=>{});ok(!r.won&&!c.roles.ceo,'shares alone do not make incompetent child CEO');
}
{
 let l=life(),c=company(l),p=person(l,0),q=D.profile(l,p),cash=E.TREASURY165.ensure(l,c).cash,m=l.money;open(l,'heirProject908',{id:p.id});choose(l,D.entities(l)[0].id+':market');ok(q.project.status==='active','project opened');ok(E.TREASURY165.ensure(l,c).cash<cash&&l.money===m,'company budget not player money');q.project.rolls=[0,0];l.age++;D.projectYear(l,p,()=>{});ok(q.project.progress===1&&q.project.status==='active','one year not complete');D.projectYear(l,p,()=>{});ok(q.project.progress===1,'project yearly guard');l.age++;D.projectYear(l,p,()=>{});ok(q.project.status==='completed'&&q.project.score===2,'two-year completion');near(E.TREASURY165.ensure(l,c).cash,cash-q.project.cost+q.project.returned,'treasury conservation');ok(!c.roles.ceo,'success not automatic appointment');}
{
 let l=life(),a=person(l,0),b=person(l,1),sum=a.person.savings158+b.person.savings158,m=l.money;ok(D.joint(l,a,b,()=>0,()=>{}),'joint business');near(a.person.savings158+b.person.savings158,sum-l.base*.4,'both contribute own capital');ok(l.money===m,'parent not charged');ok(!D.joint(l,a,b,()=>0,()=>{}),'active venture cannot duplicate');l.age+=3;E.RELATIVE163.year(l);ok(a.person.venture163.status==='completed'&&b.person.venture163.status==='completed','joint result each owner');}
{
 let l=life(),types=new Set(D.eventChoices(l).map(e=>e.type));for(const t of ['dinner','bond','birthday','university','romance','venture','scholarship'])ok(types.has(t),'event eligibility '+t);D.branch(l,l.kids[2]).public=true;ok(D.eventChoices(l).some(e=>e.type==='outsider'),'outside branch response');ok(D.familyEvent(l,()=>0,()=>{},true),'actual family event');choose(l,'mediate');ok(D.relation(l,person(l,0).id,person(l,1).id)>50,'lasting pair relation');ok(!D.familyEvent(l,()=>0,()=>{},true),'one event per year');}
for(const alive of [true,false]){
 let l=life(),p=person(l,0),q=D.profile(l,p);q.management=91;q.reputation=84;q.ambition=73;l.alive=alive;if(!alive)l.death={age:l.age,year:l.birthYear+l.age,cause:'tuổi già'};let child=E.heirAtAge(l,p.person);ok(child.dynasty908.management===91&&child.dynasty908.reputation===84&&child.dynasty908.ambition===73,'heir profile continuity '+alive);ok(child.flags.origin908.parentDead===!alive,'review context '+alive);}
{
 let l=life(),p=person(l,0),c=company(l);D.profile(l,p).project={cost:l.base,returned:l.base*.5,status:'completed'};let m=D.profile(l,p).project.cost;E.abroadConvert(l,2);near(D.profile(l,p).project.cost,m*2,'project money conversion');E.abroadConvert(l,.5);near(D.profile(l,p).project.cost,m,'roundtrip conversion');}

{
 let l=life(),a=person(l,0),b=person(l,1),c=company(l);open(l,'alliance908',{id:a.id});l.rs=1;choose(l,b.id);if(D.state(l).coalitions.length){const coal=D.state(l).coalitions[0];c.holders137.push({id:b.id,name:b.name,share:10});l.age++;D.year(l,()=>.9,()=>{});ok(!coal.active,'rights changes can end coalition');}
}
{
 let l=life(),p=person(l,0),q=D.profile(l,p);q.endorsements.self={at:l.age,ok:true};q.social={gala:l.age};q.project={cost:l.base,returned:l.base*.8,status:'completed',at:l.age-2,due:l.age};const out=E.heirAtAge(l,p.person);ok(out.dynasty908.endorsements.self.at===out.age,'handoff shifts endorsement clock');ok(out.dynasty908.social.gala===out.age,'handoff shifts social clock');near(out.dynasty908.project.cost,l.base*(out.base/l.base),'handoff money unit');
}
{
 let l=life(),p=person(l,0),c=company(l,70);c.roles.ceo={kind:'relative',personId:p.id,name:p.name,skill:.9,since:l.age,elected908:true};c.holders137=[{id:p.id,name:p.name,share:10}];let out=E.heirAtAge(l,p.person),received=E.BUSINESS123.companies(out).find(x=>x.name===c.name);ok(received&&received.roles.ceo.kind==='self','elected child remains same CEO after perspective switch');
}
{
 let l=life(),p=person(l,2);D.branch(l,p.person).at=l.age-1;l.partner.relation108='spouse';D.year(l,()=>0,()=>{});let reaction=l.pending.find(d=>d.id==='familyReaction908');ok(reaction&&!reaction.manual,'automatic reveal does not stop autoplay');
}
{
 let l=life(),p=person(l,2);open(l,'childBranch908',{id:p.id});const d=l.pending[0],m=l.money;l.kids[2].alive=false;E.resolve(l,String(d.data.keys.indexOf('meet')));ok(l.money===m,'dead target never charged by stale menu');
}
{
 let l=life();D.rememberContact(l,{name:'Người cũ',sex:'F',age:30,alive:true,relation108:'former'});ok(D.state(l).contacts.length===1,'outside encounter remembered');l.age+=13;D.year(l,()=>.1,()=>{});ok(D.state(l).claims.length===1,'12-year-old contact discovered later');let saved=E.migrate(JSON.parse(JSON.stringify(l)));saved.age++;D.year(saved,()=>.1,()=>{});ok(D.state(saved).claims.length===1,'old contact never creates duplicate claim');
}

{
 let l=life();l.kids=[];l.partner.inc=l.base/12;l.partner.separated908=true;E.beginYear(l,{auto:true});l.pending=[];E.finishYear(l);ok(l.fin.partner===0,'separated spouse income stays outside shared household');
}
{
 let l=life(),contact={id:'actual',born:24,parent:{name:'Người trực tiếp nuôi con',sex:'F',age:25,relation108:'actual'}},c=D.createClaim(l,contact,()=>.1);c.truth=true;c.consent=true;D.verify(l,c,()=>0,()=>{});l.age++;D.verify(l,c,()=>0,()=>{});let k=l.kids.at(-1),o=E.childOpts(l,k);ok(o.parent.mate.name==='Người trực tiếp nuôi con','confirmed child keeps actual co-parent in birth options');ok(o.parent.biography138.parents.mother.name==='Người trực tiếp nuôi con','biography never substitutes current spouse for actual co-parent');
}
{
 let l=life(),rv=E.FAMILY100.info(l,'parent','m');rv.trust=22;ok(D.relation(l,'self','parent:m')===22,'parent campaign uses existing trust source');D.relation(l,'self','parent:m',3);ok(E.FAMILY100.info(l,'parent','m').trust===25,'campaign writes shared parent relation');
 const c=D.createClaim(l,{id:'notice',born:36,parent:{name:'Người cũ',sex:'F'}},()=>.1);ok(D.eventChoices(l).some(e=>e.type==='inquiry'),'siblings can ask about unconfirmed relation');
}
{
 let l=life(),a=person(l,0),b=person(l,1),s=D.state(l);s.event={id:'romance-test',at:l.age,a:a.id,b:b.id,type:'romance',outsider:'Người ngoài gia đình',outsiderSex:'F',choice:0,done:false};open(l,'familyEvent908',{event:s.event.id});choose(l,'listen');ok(a.person.romance908&&E.LIFE138.state(l).people[a.person.romance908.id].name==='Người ngoài gia đình','third party choice persists as stable NPC');let saved=E.migrate(JSON.parse(JSON.stringify(l)));ok(saved.kids[0].romance908.id===a.person.romance908.id,'third party identity survives save');
}
console.log('PASS dynasty908: '+n+' checks');
