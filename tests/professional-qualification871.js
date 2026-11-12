'use strict';
const assert=require('assert'),{gameContext}=require('./hardcore-isolation'),G=gameContext(),E=G.E;
let checks=0;function ok(v,m){assert(v,m);checks++;}
function life(major){const l=E.createLife({mode:'vn',seed:87103});Object.assign(l,{age:28,edu:5,major,majorName:major,school:null,job:null,indep:true,money:l.base*30,pending:[],sched:[]});l.flags.military=0;const r=E.ID919.rec(l,'de');r.lis=r.spk=r.rd=r.wr=90;return l;}
function submit(l){const d=E.DEC.recog919.make(l,()=>.5,{});const i=d.data.keys.indexOf('sub:DE:nurse');E.DEC.recog919.apply(l,d,String(i),()=>.5,()=>{});}
for(const major of ['it','law','med','bac_si']){const l=life(major),money=l.money;submit(l);ok(!E.MD4B.recogState(l)['DE:nurse']&&l.money===money,major+' does not qualify as nursing degree');}
const l=life('dieu_duong');submit(l);ok(E.MD4B.recogState(l)['DE:nurse'].stage==='submitted','nursing qualification can be assessed');
const old=life('it');E.MD4B.recogState(old)['DE:nurse']={stage:'adapt',at:25,adaptAt:26};E.HOOKS.year.forEach(h=>h(old,()=>0,()=>{},27));ok(E.MD4B.recogState(old)['DE:nurse'].stage==='partial','legacy unsupported qualification cannot complete');
console.log('PASS professional-qualification871: '+checks+' checks');
