'use strict';
const assert=require('node:assert/strict');
const {gameContext}=require('./hardcore-isolation');
const E=gameContext().E,A=E.AGENCY962,T=E.WORLD_CRIME;
const log=()=>{},r=()=>0;
function life(country,year=2025){
 const l=E.createLife({mode:'world',country,year,seed:962});
 Object.assign(l,{birthYear:year-29,age:29,money:1e7,indep:true,alive:true,edu:5,school:null,abroad:null,pending:[],jailUntil:null,job:null,record:0});
 l.st.hea=90;l.st.kno=90;l.st.soc=80;
 return l;
}
function scene(l,id,key){
 const d=E.DEC[id].make(l,r);
 if(!d.opts.some(o=>o.k===key))return false;
 E.DEC[id].apply(l,d,key,r,log);
 return true;
}
let l=life('JP');
assert(scene(l,'wc_to_chuc','g0'));
assert(!scene(l,'wc_to_chuc','g0')&&!T.group(l).joined);
for(let i=0;i<4;i++){
 l.age++;
 assert(scene(l,'wc_menu','train'));
 assert(!scene(l,'wc_menu','train'));
}
assert(T.martial(l)>=60&&scene(l,'wc_to_chuc','g0')&&T.group(l).joined);
assert(!scene(l,'wc_nghe','wc_enforcer'));
E.startJob(l,'trom',r,log,true);
for(let i=0;i<2;i++){
 l.age++;
 for(const hook of E.HOOKS.year)if(String(hook).includes('g.lastYear'))hook(l);
}
assert(scene(l,'wc_nghe','wc_enforcer')&&l.job.id==='wc_enforcer');
l.abroad={code:'IT',perm:true};
assert.equal(E.careerYear(l,()=>.99,log,'work'),0);
assert(!T.group(l).joined&&!l.job);

l=life('IT');
assert(scene(l,'wc_to_chuc','g0'));l.age++;
assert(!scene(l,'wc_to_chuc','g0'));
T.group(l).years=2;
assert(scene(l,'wc_to_chuc','g0'));
assert.equal(E.startJob(l,'wc_hitman',r,log,true),false);
l.age+=3;
Object.assign(T.group(l),{trust:70});
l.flags.worldCrimeMartial=80;
assert(scene(l,'wc_nghe','wc_hitman'));
assert(T.pool(l).some(c=>c.id==='wc_hitman'));
assert.equal(E.jobDef(l).crimeSeverity,4);

l=life('US');
assert.equal(A.basic(l,'cia_analyst962'),true);
assert.notEqual(A.basic(l,'fbi_agent962'),true);
l.jobsHist=[{id:'luat_su',from:25,to:29}];
assert.equal(A.basic(l,'fbi_agent962'),true);
assert.equal(E.startJob(l,'fbi_agent962',r,log,true),false);
assert(A.advance(l,'fbi_agent962',r,log));
assert(!A.advance(l,'fbi_agent962',r,log));
for(let i=0;i<3;i++){
 l.age++;
 if(i===1){l=JSON.parse(JSON.stringify(l));E.migrate(l);}
 assert(A.advance(l,'fbi_agent962',r,log));
}
assert.equal(l.job.id,'fbi_agent962');
const menu=E.DEC.agency962.make(l,r);
E.DEC.agency962.apply(l,menu,String(menu.data.keys.indexOf('review')),r,log);
assert.equal(l.job.agencyWork,1);
assert(!E.canAdvance(l,E.jobDef(l),true));
l.record=1;
assert.equal(E.careerYear(l,r,log,'work'),0);
assert(!l.job);
assert.notEqual(A.basic(l,'cia_ops962'),true);
assert.notEqual(A.basic(life('US',1946),'cia_analyst962'),true);
assert.equal(A.basic(life('GB'),'mi5_analyst962'),true);
l=life('JP');l.abroad={code:'US',perm:true};
assert.notEqual(A.basic(l,'cia_ops962'),true);
l.flags.citizen=['US'];
assert.equal(A.basic(l,'cia_ops962'),true);

l=life('US');
l.fam.mAlive=true;l.fam.noMom=false;l.fam.mName='Trần Hoa';
const d=E.DEC.family100_parent_time.make(l,r,{type:'parent',index:'m',at:l.age,base:l.base,place:l.country,uid:E.FAMILY100.info(l,'parent','m').uid,name:'mẹ Trần Hoa',fee:0});
assert(!JSON.stringify([d.title,d.text,d.opts]).includes('Trần Hoa'));
d.title='Nói chuyện với mẹ Trần Hoa';d.text='Mẹ Trần Hoa nhờ bạn một việc.';l.pending=[d];E.migrate(l);
assert.equal(d.text,'Mẹ nhờ bạn một việc.');
assert(E.DEC.family100_parent_time.valid(l,d.data));
console.log('PASS 9.6.2 staged organization and agency recruitment, use of skills, consequences, and family dialogue');
