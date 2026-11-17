'use strict';
const assert=require('node:assert/strict'),{loadGame}=require('./lib/quick');
const E=loadGame().E,C=E.CHAIN144,S=E.SCHOOL920,L=E.LIFE138,X=E.UPDATE110;
const draw=()=>0,log=()=>{};
function life(cc,age=10,birth=1970){
 const l=E.createLife({mode:'world',country:cc,year:birth,seed:965,noOrphan:true});
 Object.assign(l,{age,birthYear:birth,alive:true,school:'primary',abroad:null,pending:[],sched:[],acts:0,money:l.base*100,urban:true});
 delete l.flags.military;
 return l;
}
function trip(l){
 const e={id:'trip-fixture',kind:'trip',stage:'accepted',age:l.age,cc:l.country,year:l.birthYear+l.age,school:S.key(l),dest:'địa phương'};
 l.flags.school920={prof:{},inst:{[e.id]:e},mem:[]};
 S.attend(l,e,draw,log);
 assert.equal(e.stage,'completed');
 return C.active(l,'childPath965');
}
function open(l,c,id){
 l.age=c.next;
 c.open={at:l.age,token:c.id+'#'+c.stage+'@'+l.age};
 const d=E.DEC[id].make(l,draw,{cid:c.id,token:c.open.token});
 l.pending=[d];return d;
}
let l=life('JP'),c=trip(l);
assert(c&&c.data.peer&&c.data.mentor);
let d=open(l,c,'childMemory965');
assert(d.opts.some(o=>o.k==='peer'));
E.resolve(l,'peer');
const f=l.friends.find(f=>f.uid110===c.data.friend);
assert(f&&f.school965===c.data.peer.id);
l=E.migrate(JSON.parse(JSON.stringify(l)));c=C.active(l,'childPath965');
l.abroad={code:'VN',perm:true};
d=open(l,c,'childOpportunity965');
assert(d.opts.some(o=>o.k==='friend'&&/viết thư|gọi điện/.test(o.l)));
E.resolve(l,'friend');
assert.equal(C.active(l,'childPath965'),null);
assert(E.friendsOf(l).every(p=>p.uid110!==f.uid110),'distance remains');
assert(l.friends.some(p=>p.uid110===f.uid110&&p.close>f.close));

l=life('VN');
E.childActivity965(l,'musicLocal963','buổi diễn');
c=C.active(l,'childPath965');
open(l,c,'childMemory965');E.resolve(l,'skill');
assert.equal(L.skill(l,'sing').level,5);
open(l,c,'childOpportunity965');E.resolve(l,'skill');
assert.equal(L.skill(l,'sing').level,10);
assert(!C.active(l,'childPath965'));

l=life('GB');c=trip(l);
open(l,c,'childMemory965');E.resolve(l,'mentor');
assert(c.next>=16);
l.school=null;
d=open(l,c,'childOpportunity965');
assert(d.opts.some(o=>o.k==='job'));
E.resolve(l,'job');
assert.equal(l.pending[0].id,'job');
assert.equal(c.stage,2);
l=E.migrate(JSON.parse(JSON.stringify(l)));c=C.active(l,'childPath965');
d=open(l,c,'childMentorReply966');
assert(d.opts.some(o=>o.k==='retry'));
E.resolve(l,'retry');
assert.equal(l.pending[0].id,'job');
assert(!C.active(l,'childPath965'));

l=life('JP',12);
let other=life('VN',12);
assert.notEqual(E.LOCAL965.local(l).play,E.LOCAL965.local(other).play);
assert.notEqual(E.LOCAL965.contact(l),'gọi video');
assert.equal(E.LOCAL965.contact(life('US',22,2000)),'gọi video');
const menu=E.DEC.localLife965.make(l,draw);
assert(menu.text.includes('1982')&&menu.text.includes('Nhật Bản'));
assert(menu.opts.some(o=>X.menuKey(menu,o.k)==='play'));
l.acts=7;
assert.equal(E.act(l,'localLife965'),null);

// Unlike a fresh menu, an old serialized card may have no matching option keys.
const stale=E.DEC.localLife965.make(l,draw);
stale.data.keys=['removed-row'];
assert.equal(E.DEC.localLife965.auto(l,stale,draw),'cancel');

l=life('US',27,2000);l.edu=5;l.school=null;l.st.kno=40;
assert(E.AGENCY962.advance(l,'cia_analyst962',draw,log));
assert(E.DEC.agency962.make(l,draw).text.includes('2028'));
l.age++;
assert(E.AGENCY962.advance(l,'cia_analyst962',()=>.99,log));
const rejected=E.DEC.agency962.make(l,draw).text;
assert(rejected.includes('kiến thức')&&rejected.includes('2030'));
function agencyOption(l,key){
  const menu=E.DEC.agency962.make(l,draw);
  const option=menu.opts.find(o=>X.menuKey(menu,o.k)===key);
  assert(option,'expected '+key);
  E.DEC.agency962.apply(l,menu,option.k,draw,log);
}
agencyOption(l,'prep:cia_analyst962');
assert.equal(l.flags.agency962.prep966.count,1);
l.age++;
agencyOption(l,'prep:cia_analyst962');
assert.equal(l.flags.agency962.prep966.count,2);
l.age++;
assert(E.AGENCY962.advance(l,'cia_analyst962',draw,log));
l.age++;
assert(E.AGENCY962.advance(l,'cia_analyst962',()=>.48,log),'second application may use preparation');
assert.equal(l.flags.agency962.application.stage,'vetting');
l.age+=4;
assert(!E.AGENCY962.advance(l,'cia_analyst962',draw,log),'past due application cannot be accepted');
l=life('JP');c=trip(l);
C.yearly(l,draw,log,l.age);
const scheduled=l.sched.find(item=>item.id==='childMemory965');
assert(scheduled&&scheduled.arg.cid===c.id);
l.age++;E.beginYear(l,{auto:true});
const due=l.pending.find(item=>item.id===scheduled.id);
assert(due&&E.DEC[due.id].valid(l,due.data));
// Keep the mentor's advice across a save, a work change and a later reply.
l=life('GB');c=trip(l);
open(l,c,'childMemory965');E.resolve(l,'mentor');
l.school=null;
open(l,c,'childOpportunity965');E.resolve(l,'job');
E.startJob(l,'ke_toan',draw,log,true);
open(l,c,'childMentorReply966');E.resolve(l,'difficulty');
assert.equal(c.stage,3);
l=E.migrate(JSON.parse(JSON.stringify(l)));c=C.active(l,'childPath965');
E.startJob(l,'van_phong',draw,log,true);
d=open(l,c,'childMentorProgress967');
assert(d.text.includes('đổi hướng'));
const knowledgeBefore=l.st.kno;
E.resolve(l,'practice');
assert.equal(l.st.kno,Math.min(100,knowledgeBefore+2));
assert(!C.active(l,'childPath965'));
E.DEC.childMentorProgress967.apply(l,d,'practice',draw,log);
assert.equal(l.st.kno,Math.min(100,knowledgeBefore+2),'old reply cannot grant progress twice');

l=life('JP');c=trip(l);open(l,c,'childMemory965');E.resolve(l,'mentor');
l.school=null;open(l,c,'childOpportunity965');E.resolve(l,'job');
L.state(l).people[c.data.mentor.id].alive=false;
d=open(l,c,'childMentorReply966');
assert(!d.opts.some(o=>['update','difficulty','retry'].includes(o.k)));
E.resolve(l,'later');
assert(!C.active(l,'childPath965'),'lost mentor always has a closing choice');

// A case needing revision persists until the following year, credits once and stays bound to the job.
l=life('US',27,2000);l.edu=5;l.school=null;l.st.kno=80;l.st.hea=90;
assert(E.AGENCY962.advance(l,'cia_analyst962',draw,log));
for(let n=0;n<3;n++){l.age++;assert(E.AGENCY962.advance(l,'cia_analyst962',draw,log));}
function agencyRoll(l,key,roll){
 const menu=E.DEC.agency962.make(l,draw),option=menu.opts.find(o=>X.menuKey(menu,o.k)===key);
 assert(option,key);E.DEC.agency962.apply(l,menu,option.k,roll,log);return menu;
}
agencyRoll(l,'standard',()=>.99);
assert(l.job.agencyRevision967);
assert.equal(l.job.agencyWork,0);
assert(!E.DEC.agency962.make(l,draw).opts.some(o=>X.menuKey(E.DEC.agency962.make(l,draw),o.k)==='revise'));
l=E.migrate(JSON.parse(JSON.stringify(l)));l.age++;
const revision=agencyRoll(l,'revise',draw);
assert.equal(l.job.agencyWork,1);
assert(!l.job.agencyRevision967);
E.DEC.agency962.apply(l,revision,String(revision.data.keys.indexOf('revise')),draw,log);
assert.equal(l.job.agencyWork,1);
l.age++;agencyRoll(l,'standard',()=>.99);l.age++;
agencyRoll(l,'close-work',draw);
assert(!l.job.agencyRevision967&&l.job.agencyWork===1);

l=life('US',27,2000);l.edu=5;l.school=null;
assert(E.AGENCY962.advance(l,'cia_analyst962',draw,log));
agencyRoll(l,'prep:cia_analyst962',draw);
agencyRoll(l,'withdraw',draw);
assert(!l.flags.agency962.prep966,'withdrawing clears preparation from abandoned attempt');

console.log('PASS childhood continuity, dated local activities, stale/automatic menus and agency next steps');
