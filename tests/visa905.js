'use strict';
const assert=require('assert'),{gameContext}=require('./hardcore-isolation'),G=gameContext(),E=G.E,A=E.ABROAD_DEPTH900;
let checks=0;function ok(value,message){assert(value,message);checks++;}
function life(lv=7){const l=E.createLife({mode:'vn',seed:905,noOrphan:true});Object.assign(l,{age:32,alive:true,indep:true,edu:lv-1,school:null,retired:false,abroad:null,money:l.base*100,pending:[],sched:[]});l.flags.military=0;l.st.kno=95;l.lang={en:3,ja:3,ko:3,de:3,fr:3};l.langExp={};E.startJob(l,'giao_vien',()=>0,()=>{},true);return l;}
function key(d,k){return d.data.keys?String(d.data.keys.indexOf(k)):k;}
function has(d,k){return d.opts.some(o=>o.k===key(d,k));}
function choose(l,k,r=()=>0){const d=l.pending[0];ok(!!d,'pending decision');ok(has(d,k),d.id+' exposes '+k);E.resolve(l,key(d,k));return d;}
// Exercise the actual action and decision chain, not just construction of menus.
for(const lv of [5,6,7])for(const funding of ['self','scholar']){
 const l=life(lv),job=l.job.id,money=l.money;
 ok(E.act(l,'abroad107'),'open study action');choose(l,String(lv));choose(l,'US');choose(l,'0');choose(l,'it');choose(l,funding);
 ok(l.flags.studyVisa900&&l.flags.studyVisa900.lv===lv,'correct admission level');ok(l.pending[0].id==='studyVisa900','accepted offer opens visa menu');
 let d=l.pending[0];ok(has(d,'docs')&&has(d,'plan'),'missing preparation is reachable');ok(!has(d,'visa'),'cannot submit without preparation');
 choose(l,'docs');ok(A.file(l,'US').documents===1,'papers prepared');ok(l.pending[0].id==='studyVisa900','resume visa after papers');ok(!has(l.pending[0],'docs'),'no repeated preparation this year');
 ok(l.money<money,'preparation charges actual fee');const charged=l.money;choose(l,'plan');ok(l.money===charged,'plan has no extra fee');ok(A.file(l,'US').plan===1,'plan prepared');ok(has(l.pending[0],'visa'),'can now submit visa');
 ok(!l.abroad&&l.job.id===job&&!l.school,'preparation keeps employment and residence');
 // Force a successful simulated review while retaining the normal resolve/menu logic.
 l.rs=1;choose(l,'visa');ok(l.abroad&&l.abroad.code==='US'&&l.abroad.study,'visa grants entry');ok(l.school===(lv===5?'abroad':lv===6?'post':'phd'),'existing course pipeline entered');ok(!l.job,'employment ends only on entry');ok(!l.flags.studyVisa900,'offer consumed once');ok(Number.isFinite(l.money),'converted balance finite');
}
// Old saves with an outstanding doctoral letter get a visible recovery action.
let l=life();l.flags.studyVisa900={country:'JP',lv:7,school:0,field:'it',scholar:true,until:l.age+1,deposit:0};l=E.migrate(JSON.parse(JSON.stringify(l)));
ok(E.actions(l).some(a=>a.id==='studyVisa900'&&a.g==='Học tập'&&a.ok===true),'saved PhD offer has study action');ok(E.act(l,'studyVisa900'),'open old offer');choose(l,'docs');choose(l,'plan');ok(A.file(l,'JP').documents===1&&A.file(l,'JP').plan===1,'saved letter recovers without reapplying');
// Pending cards saved before this fix must be rebuilt, including action tokens.
for(const id of ['studyVisa900','du_hoc']){let old=life();old.flags.studyVisa900={country:'US',lv:7,school:0,field:'it',scholar:true,until:33,deposit:0};let card=E.DEC.studyVisa900.make(old,()=>0);card.id=id;card.manual=true;Object.assign(card.data,{keys:['visa','withdraw'],studyVisa900:id==='du_hoc',requested:true,actionId850:'studyVisa900',actionYear850:32,deferredTurn894:true});card.opts=card.opts.filter(o=>o.k==='3');old.pending=[card];const rs=old.rs,cash=old.money;old=E.migrate(JSON.parse(JSON.stringify(old)));ok(old.pending[0].id===id&&has(old.pending[0],'docs')&&has(old.pending[0],'plan'),'old pending '+id+' gains preparation');ok(old.pending[0].manual&&old.pending[0].data.deferredTurn894&&old.pending[0].data.actionId850==='studyVisa900','manual action metadata retained');ok(old.rs===rs&&old.money===cash,'menu repair does not consume RNG or money');const text=JSON.stringify(old.pending[0]);old=E.migrate(old);ok(JSON.stringify(old.pending[0])===text,'pending repair idempotent');}
// Legacy du_hoc prompts route to the same newly available operations.
let legacy=E.DEC.du_hoc.make(l,()=>0);ok(legacy.data.studyVisa900&&has(legacy,'visa'),'legacy prompt resumes prepared visa');
// General visa preparation links back to the existing admission.
l.pending=[E.DEC.visaFile900.make(l,()=>0,{code:'JP'})];choose(l,'study');ok(l.pending[0].id==='studyVisa900','general file returns to study visa');
// Existing guards still reject stale decisions, lack of funds and expired language.
let stale=l.pending[0],before=l.money;l.age++;E.DEC.studyVisa900.apply(l,stale,key(stale,'visa'),()=>0,()=>{});ok(!l.abroad&&l.money===before,'stale menu cannot submit');
l=life();l.flags.studyVisa900={country:'US',lv:7,school:0,field:'it',scholar:false,until:l.age+1,deposit:100};l.money=l.base*.1;let d=E.DEC.studyVisa900.make(l,()=>0);ok(!has(d,'docs')&&has(d,'plan')&&!has(d,'visa'),'insufficient money keeps fee guard');
l.money=l.base*2;A.file(l,'US').documents=1;A.file(l,'US').plan=1;l.langExp.en=true;d=E.DEC.studyVisa900.make(l,()=>0);ok(!has(d,'visa'),'expired language still blocks submission');
l.pending=[d];choose(l,'withdraw');ok(!l.flags.studyVisa900,'withdraw remains available');let refunded=l.money;E.DEC.studyVisa900.apply(l,d,key(d,'withdraw'),()=>0,()=>{});ok(l.money===refunded,'refund not replayed');
l=life();ok(!E.actions(l).some(a=>a.id==='studyVisa900'&&a.ok===true),'no recovery action without letter');
console.log('PASS visa905: '+checks+' checks; all degree/funding paths, prepare/resume/entry, old PhD saves, legacy prompt, back-link, financial/language/stale/refund guards');
