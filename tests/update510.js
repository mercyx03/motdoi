'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..','public'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [,f]of html.matchAll(/<script src="(js\/[^?]+)\?v=[^"]+"><\/script>/g))if(!['js/app.js','js/music.js','js/card.js'].includes(f))vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
const E=G.E,F=E.LIFE51,L=E.LOCAL51;let n=0;function ok(x,t){assert.ok(x,t);n++;}
function life(seed=510,variant='63'){const l=E.createLife({mode:'vn',seed,variant});l.age=28;l.indep=true;l.money=5000;l.pending=[];l.school=null;l.st.hea=100;return l;}
function open(l,id,arg){const d=E.DEC[id].make(l,()=>.5,arg);l.pending=[d];return d;}
function choose(l,k){return E.resolve(l,k);}
for(const [v,t]of [[.9,'900k đ'],[.1,'100k đ'],[.2,'200k đ'],[1,'1 triệu đ'],[1000,'1 tỷ đ'],[-1000,'−1 tỷ đ'],[0,'0 đ']])ok(G.CUR.fmtVND(v)===t,'money '+v);
{
 const l=life();l.age=13;l.school='lower';const d=open(l,'thu_nac_danh');l.school=null;ok(!E.DEC.thu_nac_danh.valid(l,d.data),'dropout invalidates waiting letter');const h=l.st.hap;choose(l,'find');ok(l.st.hap===h&&!l.pending.length,'no stale classroom reward');
 l.pending=[d];E.migrate(l);ok(!l.pending.length,'old save removes stale classroom scene');
 const p=life();p.abroad={code:'US',name:'Hoa Kỳ',perm:true};ok(!/Mỹ Đình|Việt Nam/.test(E.DEC.xem_bong_da.make(p,()=>.5).text),'football abroad');p.abroad=null;p.movedTo='TP. Hồ Chí Minh';ok(/Thống Nhất/.test(E.DEC.xem_bong_da.make(p,()=>.5).text),'football current city');
 const q=life();q.recur={kham_dk:true};ok(!E.DEC.kham.valid(q,{}),'auto checkup suppresses unsolicited checkup');q.pending=[E.DEC.kham.make(q,()=>.5)];const yoga=E.act(q,'thien_yoga');ok(yoga&&q.pending[0]===yoga&&yoga.id==='thien_yoga'&&yoga.manual,'yoga precedes waiting checkup');choose(q,'thien');ok(!q.pending.some(d=>d.id==='kham'),'old checkup pruned after yoga');const manual=E.act(q,'kham');ok(manual&&E.DEC.kham.valid(q,manual.data),'manual health exam still allowed');q.recur.kham_dk=false;ok(E.DEC.kham.valid(q,{}),'random exam possible without auto');
 const m=life();E.SC('small51',{title:'Mua đồ',text:'Mua một món nhỏ.',opts:[{k:'buy',l:'Mua',run(l,r,log){E.H.cash(l,-.01,'Món nhỏ');log('Đã mua.','good');}}]});open(m,'small51');const out=choose(m,'buy');ok(out.some(x=>/10k/.test(x.t)),'small cash debit appears in log');
}
{
 const l=life();l.money=0;l.age=9;l.indep=false;l.fam.mAlive=true;l.fam.fAlive=false;l.fam.mInc=30;open(l,'hoc_boi51');choose(l,'course');ok(l.money===0&&l.yr.familyExpenses.length&&l.flags.swim&&E.hasSkill(l,'boi'),'family pays swim course, both skill flags synchronized');
 const p=life();p.money=0;p.age=8;p.indep=false;p.fam.mAlive=false;p.fam.fAlive=false;open(p,'hoc_boi51');choose(p,'course');ok(!p.flags.swim&&p.money===0,'cannot learn unpaid course');open(p,'hoc_boi51');choose(p,'safe');ok(!p.flags.swim,'one free session not instant mastery');open(p,'hoc_boi51');choose(p,'safe');ok(p.flags.swim&&E.hasSkill(p,'boi'),'free practice can teach');
 const jail=life();const d=open(jail,'hoc_boi51');jail.jailUntil=40;E.DEC.hoc_boi51.apply(jail,d,'safe',()=>.5,()=>{});ok(!jail.flags.swimPractice,'prison blocks stale swim');
 const risk=life();const rd=open(risk,'hoc_boi51');E.DEC.hoc_boi51.apply(risk,rd,'river',()=>0,()=>{});ok(!risk.alive&&/đuối nước/.test(risk.death.cause),'river risk has real outcome');
}
for(const variant of ['63','34'])for(let seed=0;seed<180;seed++){
 const l=life(seed,variant),p=L.profile(l);ok(p&&p.places.length>=2&&p.foods.length>=2,'local catalog '+variant);if(variant==='34')ok(p.places.length===G.VN.P34[l.prov.neuId].members.length*2,'merged destinations include members');
 open(l,'que_doc');choose(l,'ok');const mem=l.mem.length,kno=l.st.kno;open(l,'que_doc');choose(l,'ok');ok(l.mem.length===mem&&l.st.kno===kno,'remember once');
 l.fam.mAlive=true;l.fam.fAlive=false;open(l,'que_doc');choose(l,'parents');const d=l.pending[0];ok(d.id==='que_di51'&&d.opts.length>=4,'real outing choices');const before=l.money;choose(l,'switch');choose(l,'item0');ok(l.money<before&&l.flags.local51.trips.length===1,'food outing paid and recorded');const after=l.money;E.DEC.que_di51.apply(l,d,'item0',()=>.5,()=>{});ok(l.money===after,'no replay expense');
 l.fam.mAlive=false;open(l,'que_doc');ok(!l.pending[0].opts.some(o=>o.k==='parents'),'no deceased parents outings');
}
{
 const l=life();open(l,'que_doc');choose(l,'solo');const d=l.pending[0],before=l.money;l.abroad={code:'US',perm:true};E.DEC.que_di51.apply(l,d,'item0',()=>.5,()=>{});ok(l.money===before,'moving invalidates old local price');
 const p=life();p.partner={name:'An',sex:'F',age:26,alive:true,status:'married',close:60,parentsAlive:false};ok(!F.mother(p),'explicit orphan never invented mother');p.partner.parentsAlive=true;delete p.partner.inlaws51;ok(F.inlaws(p),'stable inlaw profile');const inv=JSON.stringify(F.inlaws(p));F.inlaws(p);ok(JSON.stringify(F.inlaws(p))===inv,'inlaw traits not rerolled');p.flags.family51={strict:true};p.partner.status='dating';p.fam.mAlive=true;const d2=open(p,'gia_dinh_hai_ben51');p.partner=null;const hap=p.st.hap;choose(p,'talk');ok(p.st.hap===hap,'breakup invalidates inlaw scene');
 const q=life();q.sex='M';q.partner={name:'Mai',sex:'F',age:26,alive:true,status:'dating',since:25,close:60};q.flags.family51={strict:false};q.partner.inlaws51={strict:true,mDeath:90,mAgeAtBirth:23};q.income=0;q.money=0;let f=open(q,'gia_dinh_hai_ben51');ok(f.data.caseId==='oppose'&&/thu nhập/.test(f.text),'strict family can question unstable income');q.partner.status='married';q.partner.inlaws51.strict=false;f=open(q,'gia_dinh_hai_ben51');ok(f.data.caseId==='warm'&&/giúp/.test(f.text),'supportive inlaws exist');q.partner.inlaws51.mDeath=40;ok(!E.DEC.gia_dinh_hai_ben51.valid(q,{}),'deceased inlaw no current scene');ok(!E.DEC.me_chong.valid(q,{}),'legacy inlaw scene replaced');
 const old=life();old.pending=[{id:'que_doc',title:'Dấu ấn quê hương',text:'cũ',data:{},opts:[{k:'ok',l:'Ghi nhớ'}]}];E.migrate(old);ok(old.pending[0].opts.length>1,'old hometown menu upgraded');
}
for(let seed=0;seed<120;seed++){
 const l=E.createLife({mode:'vn',seed}),a=JSON.stringify(l.astro51),tr=JSON.stringify(l.tr),rs=l.rs;ok(l.birthDay>=1&&l.birthDay<=new Date(Date.UTC(l.birthYear,l.birthMonth,0)).getUTCDate()&&l.birthHour<24,'valid birth time');E.migrateExt(l);ok(JSON.stringify(l.astro51)===a&&JSON.stringify(l.tr)===tr&&l.rs===rs,'no reapply horoscope on load');
 const old=life(seed);delete old.astro51;const traits=JSON.stringify(old.tr);F.birth(old);ok(JSON.stringify(old.tr)===traits,'old adult saves keep traits');
}
for(const cur of ['vnd','usd']){
 const l=life();l.cur=cur;l.abroad={code:'JP',name:'Nhật Bản',perm:true};delete l.abroad.base;E.H.setBase(l);ok(Number.isFinite(l.base)&&l.base>0&&l.base===l.abroad.base,'legacy foreign salary fallback '+cur);const base=l.base;E.H.setBase(l);ok(l.base===base,'fallback does not compound '+cur);ok(!E.DEC.city.valid(l),'foreign residence blocks hometown city relocation');l.loans=[{type:'home',name:'Vay mua nhà',bal:100,rate:.08,minShare:.06,late:0,since:25}];E.finishYear(l);ok(Number.isFinite(l.money)&&l.loans.every(x=>Number.isFinite(x.bal)),'legacy foreign loan stays finite '+cur);
}
for(const show of ['rm','hai'])for(const role of ['guest','regular'])for(let seed=0;seed<20;seed++){
 const l=life(seed);E.startJob(l,'dien_vien',()=>.5,()=>{});l.fame=500000;open(l,'gameshow');choose(l,show);choose(l,role);const v=l.flags.variety,labels=new Set(),before=l.money;let steps=0;while(l.pending[0]&&l.pending[0].id==='vr_vong'&&steps++<20){const d=l.pending[0];labels.add(d.opts[0].l);choose(l,d.opts[0].k);}ok(v.done&&v.completed===v.total&&steps===(role==='guest'?4:12),'short season ends');ok(labels.size>=3,'different game answers');ok(l.money===before+v.fee&&v.audienceGain>0,'fee reconciles and fame grows');
}
console.log('V5.1: '+n+' checks passed.');
