'use strict';const assert=require('assert'),{gameContext}=require('./hardcore-isolation'),E=gameContext().E;
function life(age=21){const l=E.createLife({mode:'vn',seed:136});Object.assign(l,{age,alive:true,indep:true,school:'uni',schoolEnd:age+1,major:'it',uniName:null,money:100000,pending:[]});l.edu=3;l.flags.world120={debtCredits:3,absences:2};return l;}
let l=life(),logs=[];const log=t=>logs.push(t);for(let i=0;i<5;i++){assert(E.gradFail(l,()=>0,log,l.age));if(i<4){assert(l.school==='uni');const n=l.pending.length;E.gradFail(l,()=>0,log,l.age);assert.equal(l.pending.length,n);}l.age++;}assert.equal(l.school,null);assert.equal(l.edu,3);assert(l.flags.studyProgress136.closed);assert(logs.some(t=>t.includes('không cấp bằng')));
l=life();let d=E.DEC.student121.make(l,()=>0),index=d.data.keys.indexOf('retake');E.DEC.student121.apply(l,d,String(index),()=>0,()=>{});assert.equal(l.flags.world120.debtCredits,0);assert.equal(l.flags.world120.absences,0);l.flags.gradOK=true;assert.equal(E.gradFail(l,()=>0,log,l.age),false);
l=life(60);let saved=JSON.parse(JSON.stringify(l));E.migrate(saved);assert.equal(saved.edu,3);for(let i=0;i<5;i++){E.gradFail(saved,()=>0,log,saved.age);saved.age++;}assert.equal(saved.school,null);
l=life(60);l.flags.world120={};l.flags.gradOK=true;assert.equal(E.gradFail(l,()=>0,log,l.age),false,'late enrollment can graduate');
l=life();d=E.DEC.studyLeave136.make(l,()=>0);l.age++;E.DEC.studyLeave136.apply(l,d,'0',()=>0,log);assert.equal(l.school,'uni','stale withdrawal rejected');
l=life();l.school='post';l.flags.pg106={lv:6,started:20,end:22,done:false};E.gradFail(l,()=>0,log,l.age);assert(!l.flags.studyProgress136,'postgraduate untouched');
console.log('PASS university136: bounded unresolved debt, no false diploma, retake attendance, old saves, late-age enrollment, stale withdrawal and postgraduate isolation');
// Persistent academic review cannot keep extending school forever either.
l=life();l.flags.world120={academicCase:{status:'pending',at:20,evidence:0}};for(let i=0;i<5;i++){E.gradFail(l,()=>0,log,l.age);l.age++;}assert.equal(l.school,null);assert.equal(l.edu,3);
// Existing degree stays intact if an unfinished second undergraduate course closes.
l=life();l.edu=5;E.STUDY136.leave(l,()=>{});assert.equal(l.edu,5);
console.log('PASS university136: unresolved academic hold bounded; existing degree preserved');
