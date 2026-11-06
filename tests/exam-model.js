'use strict';
const assert=require('assert'),fs=require('fs'),{E}=require('./hardcore-isolation').gameContext(),M=E.MOCK_EXAM853;
let checks=0;function ok(x,msg){assert(x,msg);checks++;}
function life(age=16){const l=E.createLife({mode:'vn',seed:854,year:2026});Object.assign(l,{age,edu:2,school:'upper',khoi:'A00',pending:[],sched:[]});l.st.kno=85;return l;}
function clone(l){return JSON.parse(JSON.stringify(l));}
for(const kind of ['hs','uni','special','nk'])for(const knowledge of [0,40,80,100])for(const stress of [0,100]){
 const l=life();l.st.kno=knowledge;l.mind.stress=stress;
 for(const room of [-1,0,1]){const d=M.calculate(M.inputs(l,kind),room);ok(d.scores.every(x=>x.score>=0&&x.score<=10),'subject bounds');ok(d.total>=0&&d.total<=d.scale,'total bounds');ok(d.scores.every(x=>Math.abs(x.ability+x.state+x.room-x.score)<.021),'persisted explanation reconciles score');}
 const i=M.inputs(l,kind),j=clone(i);j.knowledge=Math.min(100,j.knowledge+1);
 ok(M.calculate(j,0).total>=M.calculate(i,0).total,'knowledge monotonic');
 for(const k of ['format','time','hard','special','stable']){const a=clone(i);a.skills[k]=Math.min(1,a.skills[k]+.1);ok(M.calculate(a,0).total>=M.calculate(i,0).total,'skill monotonic '+k);}
}
{
 let l=life();l.examScore=24.75;l.flags.exam127={total:24.75,legacy:true};
 l.flags.mockExam853={hsBonus:4.5,hsFloorBonus:3,hsSpecialBonus:8,uniBonus:3.5,aptRecovery:2.5,nkBonus:2,hsLast:{total50:43},uniLast:{total30:25}};
 const before=JSON.stringify(l),expected=M.forecast(l,'uni').expected;M.report(l,'hs');M.report(l,'uni');ok(JSON.stringify(l)===before,'legacy report pure');
 const s=M.mockExamState853(l),migration=JSON.stringify(s.skillsV2);ok(s.skillsV2.hs.special===.8,'legacy +8 is bounded mastery, not +8/10');
 for(let y=0;y<4;y++){l.age++;M.mockExamState853(l);}ok(JSON.stringify(s.skillsV2)===migration,'migration once across years');
 ok(l.examScore===24.75&&l.flags.exam127.legacy,'old completed result retained');
 const loaded=E.migrate(clone(l));ok(loaded.examScore===24.75,'migrate retains completed score');
 ok(M.forecast(l,'uni').expected===expected,'legacy projection equals migrated skills');
}
{
 const l=life(),before=JSON.stringify(l),r=l.rs;for(let n=0;n<5;n++){M.report(l,'hs');M.report(l,'uni');E.DEC.mockUniExam853.make(l,()=>{throw Error('report used RNG');});}
 ok(JSON.stringify(l)===before&&l.rs===r,'report/menu cannot consume luck or mutate state');
 const a=E.rollExamScore(l,()=>{throw Error('official used external RNG');}),saved=clone(l);M.report(l,'uni');
 ok(E.rollExamScore(saved,()=>1)===a,'same save/seed replay');l.st.kno=0;ok(E.rollExamScore(l,()=>0)===a,'completed attempt cannot reroll');
 l.age++;ok(M.official(l,'uni').inputs.knowledge===0,'new year attempt uses current state');
}
{
 const l=life();l.examScore=23;const f=M.forecast(l,'uni');M.train(l,'uni','standard',()=>{});const first=l.flags.mockExam853.skillsV2.uni.format;
 M.train(l,'uni','standard',()=>{});const second=l.flags.mockExam853.skillsV2.uni.format-first;
 ok(first>second&&second>0,'diminishing progress');const before=JSON.stringify(l);for(let n=0;n<10;n++)M.train(l,'uni','intensive',()=>{});
 ok(JSON.stringify(l)===before,'two training blocks cannot be bypassed by repeated calls');ok(l.examScore===23,'mock does not edit real score');
 ok(l.flags.mockExam853.fatigue>0,'training has fatigue cost');
 l.st.kno++;ok(M.report(l,'uni').includes('đã thay đổi'),'old report flagged after state changes');
 for(let n=0;n<30;n++){l.age=16;delete l.flags.mockExam853.uniYearAt;M.train(l,'uni','standard',()=>{});}ok(l.flags.mockExam853.skillsV2.uni.format<=1,'skills bounded even malformed repeated years');
 l.st.kno=35;l.mind.stress=90;ok(M.forecast(l,'uni').high.total<28,'practice cannot guarantee competitive admission with weak knowledge');
 ok(f.expected>0,'initial forecast valid');
}
for(const block of Object.keys(E.EXAM127.blocks)){
 const l=life();l.khoi=block;l.skill=70;
 const f=M.forecast(l,'uni'),real=E.rollExamScore(l,()=>.5),d=l.flags.exam127;
 ok(d.scores.map(x=>x.subject).join(',')===E.EXAM127.blocks[block].join(','),'correct subjects '+block);
 ok(real>=f.low.total&&real<=f.high.total,'official inside forecast '+block);
 const result=M.calculate(d.inputs,d.roomDraw);ok(JSON.stringify(result)===JSON.stringify({...d,at:undefined}),'official exact formula parity');
 ok(d.total===d.scores.reduce((n,x)=>n+x.score,0),'no duplicate score '+block);
 const again=M.official(clone(l),'uni');ok(again.total===real,'arts/block replay '+block);
 if(/^[HVNS]/.test(block)){const nk=E.ARTS84.nkScore(l,{id:'demo'},()=>{throw Error('nk external random');});ok(nk>=0&&nk<=10,'separate aptitude /10');ok(l.flags.exam127.total===real,'aptitude not added to /30');}
}
{
 const l=life(14);l.school='lower';l.edu=1;M.train(l,'hs','intensive',()=>{});ok(l.flags.mockExam853.hsLast.special.scale===10,'special mock uses /10');
 const f=M.forecast(l,'hs'),real=E.hsExamScore853(l);ok(real>=f.low.total&&real<=f.high.total,'HS formula parity');
 const d=l.flags.hsExamDetail853;ok(real===d.scores[0].score*2+d.scores[1].score*2+d.scores[2].score,'HS coefficients exact');
 ok(E.specialExam853(l,'math')<=10,'special result bounded');
}
{
 const l=life();l.flags.study54={records:{},wishes:[{school:'hmu',major:'med'},{school:'mtvn',major:'art'}]};
 const f=M.estimateUniExam853(l);ok(f.wishesEval[0].status.includes('Tổ hợp'),'admission block requirement');ok(f.wishesEval[1].status.includes('Năng khiếu'),'aptitude requirement explicit');
 ok(E.EVENTS125.high.every(x=>! /Amsterdam|Khoa học Tự nhiên|Lê Hồng Phong|Nguyễn Khuyến/.test(x.name)),'no real HS cutoff claims');
 const old=M.estimateUniExam853(l).forecast.fingerprint;l.flags.study54.wishes.reverse();ok(M.estimateUniExam853(l).forecast.fingerprint!==old,'wish change invalidates fingerprint');
 ok(E.EDUCATION54.schools.every(x=>x.reference.type==='simulation'&&x.name.includes('mô phỏng')),'no unverified university cutoff names');
}
{const a=life(),b=life();a.id='different-a';b.id='different-b';ok(E.rollExamScore(a)===E.rollExamScore(b),'same explicit seed and conditions ignore wall-clock identity');}
{const l=life(14);l.school='lower';l.edu=1;l.flags.study54={records:{english:2},wishes:[]};M.train(l,'hs','intensive',()=>{});const s=l.flags.mockExam853.specificV2.hs;ok(s.english>0&&!s.math,'specialized training tied to chosen subject, no cross-subject injection');const input=M.inputs(l,'special',null,'english');ok(input.subjectSkills.english===s.english,'specific subject skills feed shared formula');}
// Independent deterministic held-out identities; internal calibration rates are not displayed to players.
const rows=[];let pooledDiff=0,totalN=0,maxRateError=0,maxMeanError=0;
for(const kind of ['hs','uni'])for(const kno of [35,60,80,95])for(const level of [0,.5,.9])for(const stress of [20,90]){
 const base=life();base.st.kno=kno;base.mind.stress=stress;M.mockExamState853(base);for(const p of Object.values(base.flags.mockExam853.skillsV2))for(const k of Object.keys(p))p[k]=level;
 const input=M.inputs(base,kind),cut=kind==='hs'?46:28.5,n=2000;let predicted=0,predMean=0,hits=0,sum=0;
 for(let j=0;j<1001;j++){const d=M.calculate(input,-1+2*j/1000);predMean+=d.total/1001;if(d.total>=cut)predicted+=1/1001;}
 for(let j=0;j<n;j++){const l={id:'held-out-'+kind+'-'+kno+'-'+level+'-'+stress+'-'+j,birthYear:2010,age:16,st:{kno},mind:{stress},flags:clone(base.flags),khoi:'A00',skill:20};const d=M.official(l,kind);sum+=d.total;if(d.total>=cut)hits++;}
 const actual=hits/n,error=Math.abs(actual-predicted),meanError=Math.abs(sum/n-predMean);maxRateError=Math.max(maxRateError,error);maxMeanError=Math.max(maxMeanError,meanError);pooledDiff+=(actual-predicted)*n;totalN+=n;
 rows.push({kind,knowledge:kno,mastery:level,stress,n,cut,predictedRate:+predicted.toFixed(4),observedRate:actual,rateError:+error.toFixed(4),predictedMean:+predMean.toFixed(3),observedMean:+(sum/n).toFixed(3)});
}
ok(maxRateError<.09,'held-out admission rate error <9 percentage points per group');ok(maxMeanError<.16,'held-out mean error <0.16 points');
fs.mkdirSync('.cache',{recursive:true});fs.writeFileSync('.cache/exam-calibration.json',JSON.stringify({n:totalN,groups:rows.length,maxRateError,maxMeanError,pooledBias:pooledDiff/totalN,rows},null,2));
console.log('PASS exam-model: '+checks+' checks; calibration n='+totalN+', groups='+rows.length+', max rate error='+(maxRateError*100).toFixed(2)+'pp, max mean error='+maxMeanError.toFixed(3)+', pooled bias='+(pooledDiff/totalN*100).toFixed(3)+'pp');
