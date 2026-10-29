'use strict';
const assert=require('assert'),fs=require('fs'),{gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,logs=[],log=t=>logs.push(t);
function life(code='VN',age=10,seed=904){const l=E.createLife({mode:code==='VN'?'vn':'world',country:code,seed,noOrphan:true});Object.assign(l,{age,alive:true,pending:[]});return l;}
function abandoned(age=10){const l=life('VN',age);l.fam.orphan={kind:'chua',unknown:true,carer:'sư cô',one:'sư cô'};Object.assign(l.fam,{mAlive:false,fAlive:false,noDad:true,mInc:0,fInc:0});return l;}
function choose(l,id,key,r=()=>.5){const d=E.DEC[id].make(l,r);assert(E.DEC[id].valid(l,d.data),id+' valid');const k=d.data.keys?String(d.data.keys.indexOf(key)):key;assert(d.opts.some(o=>o.k===k),id+' option '+key);E.DEC[id].apply(l,d,k,r,log);return d;}
// Adoption updates the actual guardians, finances and biography, including ages 10–15.
let l=abandoned(12);choose(l,'mc_nhan_nuoi','theo');assert.equal(l.fam.orphan.adopted,12);assert(l.fam.mAlive&&l.fam.fAlive);assert.equal(E.LIFE138.state(l).care,'bố mẹ');assert.equal(E.LIFE138.state(l).people.mother.name,l.fam.mName);
const adoptiveName=l.fam.mName;E.ORIGINS.found(l,()=>0,log);assert.equal(l.fam.orphan.birthFamily.who,'m');choose(l,'originsFamily','stay');assert.equal(l.fam.mName,adoptiveName);
choose(l,'originsFamily','visit');let d=E.DEC.originsFamily.make(l,()=>.5);assert(!d.opts.some(o=>o.k===String(d.data.keys.indexOf('move'))),'one visit cannot move');
l.age++;choose(l,'originsFamily','visit');choose(l,'originsFamily','move');assert.equal(l.fam.mName,adoptiveName,'request does not move immediately');
l=E.migrate(JSON.parse(JSON.stringify(l)));assert.equal(l.fam.orphan.birthFamily.visits,2);l.age++;const hook=E.HOOKS.year[E.HOOKS.year.length-2];
// Find the origins hook without depending on later modules' registration order.
const originHook=E.HOOKS.year.find(fn=>fn.toString().includes('previousHome=household'));
assert(originHook);originHook(l,()=>.9,log,l.age);assert(l.fam.orphan.livingWithBirth);assert.equal(l.fam.orphan.previousHome.mName,adoptiveName);assert(!l.fam.fAlive&&l.fam.mAlive,'mother-only reunion');
for(const [roll,who] of [[0,'m'],[.4,'f'],[.8,'both']]){let a=abandoned();const b=E.ORIGINS.birthFamily(a,()=>roll);assert.equal(b.who,who);const snapshot=JSON.stringify(b);assert.equal(JSON.stringify(E.ORIGINS.birthFamily(a,()=>0)),snapshot,'stable person');}
let dead=life();dead.fam.orphan={kind:'mai_am',unknown:false};assert(!E.DEC.originsContact.valid(dead),'known deceased parents never return');
// Independent birth RNG creates named twins in the normal sibling collection, never on load.
let twinLife;for(let seed=1;seed<500;seed++){let a=life('VN',0,seed);if(a.flags.twinOrigins){twinLife=a;break;}}assert(twinLife);let twin=twinLife.sibList.find(t=>t.twinOrigins);assert(twin.n!==twinLife.name&&twin.born===0);twinLife.age=8;choose(twinLife,'twinOrigins','own');const saved=E.migrate(JSON.parse(JSON.stringify(twinLife)));assert.equal(saved.sibList.filter(t=>t.twinOrigins).length,1);assert.equal(saved.sibList.find(t=>t.twinOrigins).twinChoice,'own');
// All countries have local school choices, and actual enrollment uses the old major path.
for(const c of G.W.C){let a=life(c.code,18);a.edu=3;a.school=null;a.indep=true;a.money=100000;a.examScore=30;assert(E.EDUCATION54.localSchools(a).every(u=>(u.country||'VN')===c.code));
  if(!['JP','KR','TH','CN'].includes(c.code))continue;
  const uni=E.DEC.uni.make(a,()=>.5);assert(uni.opts.some(o=>o.k==='wishes54'));E.DEC.uni.apply(a,uni,'wishes54',()=>.5,log);let w=a.pending.shift();assert(E.DEC.study_wishes54.valid(a,w.data),'world residence guard allows local admission');
  E.DEC.study_wishes54.apply(a,w,'region_Trong nước',()=>.5,log);w=a.pending.shift();const school=w.opts.find(o=>o.k.startsWith('school_'));assert(school);E.DEC.study_wishes54.apply(a,w,school.k,()=>.5,log);w=a.pending.shift();E.DEC.study_wishes54.apply(a,w,'major_it',()=>.5,log);w=a.pending.shift();E.DEC.study_wishes54.apply(a,w,'submit',()=>0,log);assert.equal(a.school,'uni',c.code+' admitted');assert(!/Hà Nội|Hồ Chí Minh/.test(a.uniName));assert(a.major==='it');
}
// Clubs remember selection, require practice across years, persist results and reject relocation.
l=life('JP',15);l.school='upper';assert.equal(E.SCHOOL_CLUBS.state(l).club,'home');choose(l,'schoolClubChoice','sport');choose(l,'schoolClubActivity','practice');let activity=E.DEC.schoolClubActivity.make(l,()=>.5);assert(!activity.opts.some(o=>o.k===String(activity.data.keys.indexOf('event'))));l.age++;choose(l,'schoolClubActivity','practice');choose(l,'schoolClubActivity','event',()=>.9);assert.equal(E.SCHOOL_CLUBS.state(l).results.filter(x=>x.event==='interschool').length,1);const loaded=E.migrate(JSON.parse(JSON.stringify(l)));assert.equal(E.SCHOOL_CLUBS.state(loaded).practice,2);l.abroad={code:'KR',perm:true};assert.equal(E.SCHOOL_CLUBS.state(l).club,'home');assert.equal(l.flags.schoolClubs.history.length,1);
assert(!E.DEC.schoolClubActivity.valid(Object.assign(l,{school:null})));assert(!/W\.C\.filter/.test(fs.readFileSync('public/js/app.js','utf8').split('var country =')[1].split("$$('.tab')")[0]),'country selector stays random');
// Unmatched searches can continue; queued decisions and old school menus stay bounded.
l=abandoned(23);choose(l,'mc_tim_bo_me','tim',()=>.9);assert(l.fam.orphan.searchOpen&&l.fam.orphan.found==null);l.age++;originHook(l,()=>.1,log,l.age);assert(l.pending.some(d=>d.id==='originsContact'));
l=life('JP',16);l.school='upper';d=E.DEC.schoolClubChoice.make(l,()=>.5);l.abroad={code:'KR',perm:true};assert(!E.DEC.schoolClubChoice.valid(l,d.data));
l=life('JP',16);l.school='upper';choose(l,'world_school173','sport');assert(l.pending.some(d=>d.id==='schoolClubChoice'),'existing bukatsu story opens persistent club choice');
console.log('PASS origins-clubs904: adoption, reunion phases, delayed search, single parents, stable identities, twin persistence, 195 local school pools, 4 admissions, club practice/competition/save/relocation, stale menu and country story integration');
