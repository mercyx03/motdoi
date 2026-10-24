'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..','public'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [,f]of html.matchAll(/<script src="(js\/[^"?]+)\?v=[^"]+"[^>]*><\/script>/g))if(!['js/app.js','js/music.js','js/card.js','js/account.js'].includes(f))vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
const E=G.E;let checks=0;function ok(x,t){assert.ok(x,t);checks++;}
function life(seed=461){const l=E.createLife({mode:'vn',seed,gender:'M'});l.age=30;l.flags={};l.pending=[];l.school=null;l.partner=null;l.money=100;l.abroad=null;return l;}
for(let age=12;age<18;age++){const l=life(),p={age,job:'sinh viên',inc:20};E.normalizePartnerAge(l,p,()=>.4);ok(/^học sinh/.test(p.job)&&p.inc===0,'học sinh chưa 18 tuổi');}
for(let seed=1;seed<=150;seed++){const l=life(seed);l.age=17;const d=E.DEC.love.make(l,()=>G.U.rand(l));if(d.data.p.age<18)ok(!/đang là sinh viên|đang làm bác sĩ/.test(d.text),'hồ sơ sau mọi lớp đổi tuổi');l.st.kno=99;l.focus='rest';l.mind.stress=99;E.HOOKS.gradUpper.forEach(f=>f(l,()=>G.U.rand(l),()=>{}));ok(l.examScore>=20&&l.examScore<=30,'kiến thức 99 có điểm tương xứng');}
for(const score of [17,18,22,23,26,30])for(const choice of ['uni_big','uni_local']){const l=life();l.age=18;l.examScore=score;l.st.kno=99;const d=E.DEC.uni.make(l,()=>.5);E.DEC.uni.apply(l,d,choice,()=>.999,()=>{});ok(l.pending.some(d=>d.id==='major')===(score>=(choice==='uni_big'?23:18)),'xét tuyển theo điểm không bốc thăm lần hai');}
for(const c of E.CAREER_STORIES.cases)for(const key of ['care','learn','rush','later']){
 const l=life();const job=Object.values(E.CAR).find(j=>j.cat===c.cat&&j.id!=='an_xin'&&j.sec!=='crime');assert.ok(job);l.job={id:job.id,rank:0,yrs:2,rep:50};const pool=E.CAREER_STORIES.pool(l),idx=pool.findIndex(x=>x.id===c.id),d=E.DEC.nghe_chuyen_moi.make(l,()=>(idx+.1)/pool.length);const cash=l.money;
 ok(d.data.caseId===c.id&&!/undefined|NaN/.test(d.text+JSON.stringify(d.opts)),'nội dung theo nghề');l.pending=[d];E.resolve(l,key);ok(l.money>=0&&(key==='learn'?l.money<cash:l.money===cash),'chi phí rõ ràng');ok(!E.CAREER_STORIES.valid(l,d.data),'không giải quyết lặp');
 const l2=life();l2.job={id:job.id,rank:0,yrs:2};const stale=E.DEC.nghe_chuyen_moi.make(l2,()=>.3);l2.job={id:job.id,rank:0,yrs:0};ok(!E.CAREER_STORIES.valid(l2,stale.data),'đổi việc cùng mã không dùng cảnh cũ');
 l2.jailUntil=32;ok(!E.CAREER_STORIES.pool(l2).length,'trong tù không làm công việc ngoài');
}
{const l=life(),job=Object.values(E.CAR).find(j=>j.cat==='office');l.job={id:job.id,rank:0};for(let i=0;i<2;i++){const d=E.DEC.nghe_chuyen_moi.make(l,()=>.3);l.pending=[d];E.resolve(l,'care');}ok(!E.CAREER_STORIES.pool(l).length,'tối đa hai tình huống năm');l.age++;ok(!E.CAREER_STORIES.pool(l).length,'không lặp năm sau');}
{const l=life();ok(E.DEC.tc_dieu_kien.make(l,()=>.5).text.includes('20–42'),'hướng dẫn điều kiện');const d=E.DEC.hh_moi.make(l,()=>.5);E.DEC.hh_moi.apply(l,d,'nali',()=>.5,()=>{});ok(l.flags.datingShowAt===30&&!E.DEC.hh_moi.valid(l,{}),'đăng ký một lần mỗi năm');l.partner={alive:true};ok(!E.DEC.hh_nali_m.valid(l,{v:1}),'có người yêu không tiếp tục show độc thân');}
console.log('PASS: '+checks+' kiểm tra bản 4.6.1.');
