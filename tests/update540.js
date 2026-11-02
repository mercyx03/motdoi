'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..','public'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [,f]of html.matchAll(/<script src="(js\/[^"?]+)\?v=[^"]+"[^>]*><\/script>/g))if(!['js/app.js','js/music.js','js/card.js','js/account.js'].includes(f))vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
const E=G.E,A=E.EDUCATION54;let n=0;function ok(v,t){assert.ok(v,t);n++;}
function life(age=16){let l=E.createLife({mode:'vn',seed:540});l.age=age;l.country='VN';l.abroad=null;l.school=age<18?'upper':null;l.schoolEnd=18;l.edu=age<18?2:3;l.pending=[];l.job=null;l.retired=false;l.jailUntil=null;l.flags.military=null;l.st.kno=99;l.mind.stress=0;return l;}
function pick(l,id,k,r=()=>.5){let d=E.DEC[id].make(l,r);ok(d.opts.some(x=>x.k===k),'offered '+id+':'+k);E.DEC[id].apply(l,d,k,r,()=>{});return d;}
function add(l,region,school,major){pick(l,'study_wishes54','region_'+region);pick(l,'study_wishes54','school_'+school);pick(l,'study_wishes54','major_'+major);}
{
 let l=life(15),d=E.DEC.hs.make(l,()=>.5);ok(d.opts.some(x=>x.k==='special54'),'specialized option');E.DEC.hs.apply(l,d,'special54',()=>.5,()=>{});pick(l,'study_special54','math');if(l.pending[0]&&l.pending[0].id==='chuyen_on'){const on=l.pending.shift();E.DEC.chuyen_on.apply(l,on,'o0',()=>.5,()=>{});}ok(l.school==='upper'&&A.state(l).special.subject==='math','specialized admission');ok(l.edu===2&&l.schoolEnd===18,'no instant graduation');
 let before=l.st.kno;E.DEC.study_special54.apply(l,d,'math',()=>.5,()=>{});ok(l.st.kno===before,'stale decision ignored');
 l=life(15);l.st.kno=10;l.fam.q=1;d=E.DEC.hs.make(l);E.DEC.hs.apply(l,d,'special54',()=>.99,()=>{});pick(l,'study_special54','math',()=>.99);if(l.pending[0]&&l.pending[0].id==='chuyen_on'){const on=l.pending.shift();E.DEC.chuyen_on.apply(l,on,'o0',()=>.99,()=>{});}ok(!A.state(l).special&&l.school==='voc','failed specialist uses regular fallback');
 l=life(16);ok(!E.DEC.hs.make(l).opts.some(x=>x.k==='special54'),'no late entry');
}
{
 let l=life();E.DEC.doi_tuyen54.apply(l,E.DEC.doi_tuyen54.make(l,()=>.5),'yes',()=>.5,()=>{});pick(l,'study_team54','math');
 for(let i=0;i<5;i++){pick(l,'study_contest54','intense');pick(l,'study_contest54','check',()=>.9);}
 ok(A.state(l).records.math===5,'complete qualifying path to international medal');ok(!A.state(l).kind,'chain finishes');ok(!E.DEC.doi_tuyen54.valid(l),'no multiple subjects per year');ok(A.direct(l,'it')&&!A.direct(l,'med'),'subject aligned direct admission');
 l=life(14);l.school='lower';E.DEC.doi_tuyen54.apply(l,E.DEC.doi_tuyen54.make(l),'yes',()=>.5,()=>{});pick(l,'study_team54','math');pick(l,'study_contest54','steady');pick(l,'study_contest54','check');ok(A.state(l).records.math===1&&!A.state(l).kind,'younger pupils cannot reach national contest');
 l=life();A.state(l).records.lit=2;E.DEC.doi_tuyen54.apply(l,E.DEC.doi_tuyen54.make(l),'yes',()=>.5,()=>{});pick(l,'study_team54','lit');pick(l,'study_contest54','steady');pick(l,'study_contest54','check');ok(A.state(l).records.lit===3&&!A.state(l).kind,'literature no invented international olympiad');
 l=life();l.st.kno=10;E.DEC.doi_tuyen54.apply(l,E.DEC.doi_tuyen54.make(l),'yes',()=>.5,()=>{});pick(l,'study_team54','bio');pick(l,'study_contest54','steady');pick(l,'study_contest54','check');ok(!A.state(l).records.bio,'failure no phantom award');
 for(const mutate of [l=>l.school=null,l=>l.jailUntil=30,l=>l.abroad={code:'JP',perm:true},l=>l.flags.military=20,l=>l.alive=false]){l=life();mutate(l);ok(!A.pupil(l)&&!E.DEC.doi_tuyen54.valid(l),'context guards');}
 l=life();E.DEC.doi_tuyen54.apply(l,E.DEC.doi_tuyen54.make(l),'yes',()=>.5,()=>{});pick(l,'study_team54','math');const stale=E.DEC.study_contest54.make(l);l.age++;E.DEC.study_contest54.apply(l,stale,'steady',()=>.5,()=>{});ok(A.state(l).stage==='train','stale year rejected');
}
{
 let l=life(18);l.examScore=24;A.open(l,()=>.5);add(l,'Bắc','hmu','med');add(l,'Trung','due','eco');add(l,'Nam','agu','eco');ok(A.state(l).wishes.length===3,'ordered wishes');pick(l,'study_wishes54','submit');ok(A.state(l).admitted.school==='due','first eligible wish');ok(l.school==='uni'&&l.major==='eco'&&l.schoolEnd===22&&l.edu===3,'enrolment not degree');ok(l.uniName.includes('Đà Nẵng'),'named university stored');
 l=life(18);l.examScore=30;A.open(l,()=>.5);add(l,'Bắc','hmu','med');add(l,'Nam','agu','eco');pick(l,'study_wishes54','submit');ok(A.state(l).admitted.school==='hmu'&&l.schoolEnd===24,'highest priority and medical duration');
 ok(l.uniName==='Trường Đại học Y Hà Nội','selected medical university retained');ok(E.DEC.nganh_y.make(l).opts.every(x=>x.k==='dk'),'named medicine cannot switch to military school');pick(l,'nganh_y','dk');ok(l.uniName==='Trường Đại học Y Hà Nội'&&l.med.track==='dk','medical confirmation preserves university');
 l=life(18);l.examScore=10;A.open(l,()=>.5);add(l,'Bắc','hust','it');pick(l,'study_wishes54','submit');ok(!l.school&&l.pending.some(x=>x.id==='uniFail'),'all wishes fail returns retry path');
 l=life(18);l.examScore=10;A.state(l).records.math=3;A.open(l,()=>.5);add(l,'Bắc','hmu','med');add(l,'Bắc','hust','it');pick(l,'study_wishes54','submit');ok(A.state(l).admitted.school==='hust','award no blanket exemption');
 l=life(18);A.open(l,()=>.5);add(l,'Nam','ctu','eco');add(l,'Nam','ctu','eco');ok(A.state(l).wishes.length===1,'duplicate wish blocked');pick(l,'study_wishes54','remove_0');ok(A.state(l).wishes.length===0&&!E.DEC.study_wishes54.make(l).opts.some(x=>x.k==='submit'),'cannot submit empty wishes');
 for(const [r,s,m]of [['Bắc','hust','it'],['Bắc','neu','eco'],['Bắc','hmu','med'],['Nam','ctu','eco'],['Nam','agu','edu']])add(l,r,s,m);ok(A.state(l).wishes.length===5&&!E.DEC.study_wishes54.make(l).opts.some(x=>x.k.startsWith('region_')),'wish cap');
 const json=JSON.stringify(l),saved=E.migrate(JSON.parse(json));ok(A.state(saved).wishes.length===5,'save migration retains order');
 l=life(17);ok(!E.DEC.uni.make(l,()=>.5).opts.some(x=>x.k==='wishes54'),'underage no university list');
 l=life(18);l.country='JP';ok(E.DEC.uni.make(l,()=>.5).opts.some(x=>x.k==='wishes54'),'foreign life has local admissions');ok(A.localSchools(l).every(u=>u.country==='JP'),'foreign admissions only list host-country schools');
}
for(const u of A.schools){ok(u.majors.length>0&&u.majors.every(m=>E.MAJORS[m]),'valid majors '+u.id);ok(Number.isFinite(u.score)&&u.score<=30,'valid simulated cutoff '+u.id);}
console.log('V5.4: '+n+' education checks passed');
