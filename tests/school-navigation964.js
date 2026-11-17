'use strict';
const assert=require('node:assert/strict'),{loadGame}=require('./lib/quick');
const E=loadGame().E,S=E.SCHOOL920,X=E.UPDATE110;
function fixture(){
 const l=E.createLife({mode:'world',country:'JP',seed:964,year:1970,noOrphan:true});
 Object.assign(l,{age:12,birthYear:1970,acts:7,school:'lower',schoolEnd:15,pending:[],sched:[],alive:true});
 const e={id:'fixture-trip',kind:'trip',cc:'JP',school:S.key(l),year:1982,age:12,stage:'completed',dest:'vùng biển/núi gần nhất'};
 l.flags.school920={prof:{},mem:[{id:e.id,t:'Chuyến ngoại khóa'}],inst:{[e.id]:e}};
 return {l,e};
}
function detail(l,e){
 const d=E.DEC.school920.make(l,()=>.5,{id:e.id});
 Object.assign(d.data,{actionId850:'school920',actionYear850:l.age,deferredTurn894:true});
 d.manual=true;
 return d;
}
let {l,e}=fixture(),d=detail(l,e),cash=l.money;
const marker=E.DEC.musicLocal963.make(l,()=>.5);
l.pending=[d,detail(l,e),marker];
const back=d.opts.find(x=>X.menuKey(d,x.k)==='back');
assert(back);
E.resolve(l,back.k);
assert.equal(l.pending.length,2);
assert.equal(l.pending[0].data.arg.id,undefined);
assert(l.pending[0].text.includes('đã tham dự'));
assert(!l.pending[0].data.keys.includes(e.id),'completed trip cannot be reopened from the list');
assert.equal(l.pending[0].data.actionId850,'school920');
E.resolve(l,'cancel');
assert.equal(l.pending.length,1);
assert.equal(l.pending[0],marker);
assert.equal(l.money,cash);
assert.equal(l.acts,7);
assert.equal(l.flags.school920.mem.filter(m=>m.id===e.id).length,1);

({l,e}=fixture());
l.pending=[detail(l,e),detail(l,e)];
l=E.migrate(JSON.parse(JSON.stringify(l)));
assert.equal(l.pending.length,1,'old duplicate panels removed on reload');
l.acts=0;
assert.equal(E.autoKey(l),'cancel','auto exits a completed detail even with turns remaining');
E.resolve(l,'cancel');
assert.equal(l.pending.length,0);

({l,e}=fixture());e.stage='announced';l.acts=0;
l.pending=[detail(l,e)];
const join=l.pending[0].opts.find(x=>X.menuKey(l.pending[0],x.k)==='join');
E.resolve(l,join.k);
assert.equal(e.stage,'accepted');
assert.equal(l.pending[0].data.arg.id,e.id);
assert.equal(l.pending.length,1);
assert.deepEqual(l.flags.school920.mem.map(m=>m.id),[e.id]);
// Complete a trip in childhood, then load a save several years later with the old detail still queued.
({l,e}=fixture());l.age=8;l.acts=0;l.money=l.base*20;e.age=8;e.year=1978;e.stage='announced';e.school=S.key(l);l.flags.school920.mem=[];
l.pending=[detail(l,e)];
let choice=l.pending[0].opts.find(x=>X.menuKey(l.pending[0],x.k)==='join');
E.resolve(l,choice.k);
assert.equal(e.stage,'accepted');
S.attend(l,e,()=>.5,()=>{});
const oldDetail=detail(l,e);
l.age=12;l.pending=[oldDetail,detail(l,e)];
const nextTrip={...e,id:'new-trip',age:12,year:1982,school:S.key(l),stage:'announced'};
l.flags.school920.inst[nextTrip.id]=nextTrip;
assert.equal(E.DEC.school920.valid(l,oldDetail.data),false,'childhood trip is stale even with a current trip available');
l=E.migrate(JSON.parse(JSON.stringify(l)));
assert.equal(l.pending.length,0,'no stale detail can reopen at age 12');
assert.equal(l.flags.school920.inst[e.id].stage,'completed');
assert.equal(l.flags.school920.mem.filter(m=>m.id===e.id).length,1);
assert(E.act(l,'school920').data.keys.includes(nextTrip.id),'current trip remains playable');
console.log('PASS school event navigation, completed history, caps, duplicate saves and active registration');
