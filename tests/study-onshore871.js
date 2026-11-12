'use strict';
const assert=require('assert'),{gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,M=E.MD4B,A=E.ABROAD_DEPTH900;
let checks=0;function ok(v,m){assert(v,m);checks++;}
function pick(l,id,k,r=()=>0){const d=E.DEC[id].make(l,r,{});const i=d.data.keys.indexOf(k);assert(i>=0,k);E.DEC[id].apply(l,d,String(i),r,()=>{});}
function course(){const l=E.createLife({mode:'vn',seed:87101});Object.assign(l,{age:22,edu:3,school:null,job:null,indep:true,money:l.base*100,pending:[],sched:[]});l.flags.military=0;l.flags.travel918={passport:{cc:'VN',issued:20,until:30},visas:{},denied:{},trips:[]};const home=l.place;const save=M.goTemp(l,'DE',{code:'DE',name:'Đức',study:true,langCourse919:true,until:23});M.state(l).ly={code:'DE',at:22,save,cont:true};const rec=E.ID919.rec(l,'de');rec.lis=rec.spk=rec.rd=rec.wr=95;l.age=23;const admit=E.GLOBAL919.admit;E.GLOBAL919.admit=()=>({ok:true,track:'de'});try{M.lyYear(l,()=>0,()=>{});}finally{E.GLOBAL919.admit=admit;}return {l,home};}
{
 const {l,home}=course();ok(l.abroad.code==='DE'&&l.flags.studyVisa900.onshore920==='DE','onshore applicant remains physically in host country');ok(l.cur==='usd'&&M.state(l).ly.save,'home and conversion retained');ok(E.DEC.studyVisa900.valid(l),'visa action accessible in host country');
 const f=A.file(l,'DE');f.documents=f.plan=3;l.flags.studyVisa900.unpaid919=0;const before=l.money,base=l.base;
 pick(l,'studyVisa900','visa');ok(l.school==='abroad'&&l.abroad.code==='DE','onshore approval enters university');ok(Math.abs(l.money-(before-base*.02))<1e-5,'same-country admission does not convert funds twice');ok(l.flags.study107.home.place===home&&l.flags.study107.home.cur==='vnd','original home retained for graduation');ok(!M.state(l).ly.save&&!l.flags.studyVisa900,'temporary return state consumed');
}
{
 const {l}=course();A.file(l,'DE').documents=A.file(l,'DE').plan=3;l.flags.studyVisa900.unpaid919=0;
 pick(l,'studyVisa900','visa',()=>.999);ok(!l.abroad&&l.cur==='vnd','refusal returns to saved home');ok(l.flags.studyVisa900&&!l.flags.studyVisa900.onshore920,'refusal retains offer for ordinary application');
}
{
 let {l}=course();l=JSON.parse(JSON.stringify(l));E.migrateExt(l);ok(l.abroad.code==='DE'&&E.DEC.studyVisa900.valid(l),'reload retains location and access');const unpaid=l.flags.studyVisa900.unpaid919,factor=M.state(l).ly.save.factor;l.age=24;M.lyYear(l,()=>0,()=>{});ok(!l.abroad&&l.cur==='vnd','expiry returns home without renewing permission');ok(Math.abs(l.flags.studyVisa900.unpaid919-unpaid/factor)<1e-5,'unpaid tuition converts with outstanding offer');const money=l.money;M.lyYear(l,()=>0,()=>{});ok(l.money===money,'return conversion not replayed');
}
{
 const {l}=course();pick(l,'studyVisa900','withdraw');ok(!l.abroad&&!l.flags.studyVisa900&&l.cur==='vnd','withdrawal returns home and removes offer');
}
{
 const {l}=course();const factor=M.state(l).ly.save.factor,deposit=l.flags.studyVisa900.deposit||0,cash=l.money;l.age=25;l.flags.studyVisa900.until=24;A.year(l,()=>0,()=>{});ok(!l.abroad&&l.cur==='vnd'&&!M.state(l).ly.save,'visa expiry hook restores original home even after course permit expires');ok(Math.abs(l.money-(cash+deposit)/factor)<1e-5,'expiry refund uses returned currency');const paid=l.money;M.lyYear(l,()=>0,()=>{});ok(l.money===paid,'later course hook does not reconvert or refund');
}
console.log('PASS study-onshore871: '+checks+' checks');
