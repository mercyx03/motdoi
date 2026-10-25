'use strict';const assert=require('assert'),E=require('./hardcore-isolation').gameContext().E,L=E.LIFE138,P=E.PATH139;let n=0;function ok(v,m){assert(v,m);n++;}const log=()=>{};
function life(){let l=E.createLife({mode:'vn',seed:139});Object.assign(l,{age:18,school:null,indep:true,money:100000,edu:5,job:null,record:0,pending:[]});l.flags.dirty=0;delete l.flags.criminal;l.flags.military=0;return l;}
function keys(l){let d=E.DEC.audition139.make(l,()=>0);return d.data.keys.filter((k,i)=>d.opts.some(o=>o.k===String(i)));}
function pick(l,key,r=()=>0){let d=E.DEC.audition139.make(l,r),i=d.data.keys.indexOf(key);assert(i>=0&&d.opts.some(o=>o.k===String(i)),'enabled '+key);E.DEC.audition139.apply(l,d,String(i),r,log);}
// Round trip abroad for training must not lose wealth through a living-cost ratio.
['KR','JP','US'].forEach(code=>{let l=life();['sing','dance','acting'].forEach(k=>L.skill(l,k).level=90);L.state(l).languages={[code]:80};pick(l,code);pick(l,'accept');ok(l.abroad.code===code,code+' trainee abroad');let before=l.money;pick(l,'home');ok(!l.abroad&&l.cur==='vnd','returned home '+code);ok(Math.abs(l.money-(100000-124*.32))<200,'round trip keeps savings '+code+': '+Math.round(l.money)+' from '+Math.round(before));});
// An offer the player cannot accept yet can be declined and a new audition submitted later.
let l=life();['sing','dance','acting'].forEach(k=>L.skill(l,k).level=90);pick(l,'KR');ok(L.state(l).agency.status==='offer'&&!keys(l).includes('accept'),'offer blocked without language');pick(l,'decline');ok(L.state(l).agency.status==='declined','offer declined');ok(!keys(l).includes('KR'),'one audition per year');l.age++;ok(keys(l).includes('KR'),'can audition again next year');
// Old saves without a stored exchange rate still convert back with the inverse rate.
l=life();['sing','dance','acting'].forEach(k=>L.skill(l,k).level=90);L.state(l).languages={KR:80};pick(l,'KR');pick(l,'accept');delete L.state(l).entertainmentHome.fx;let save=E.migrate(JSON.parse(JSON.stringify(l)));pick(save,'home');ok(Math.abs(save.money-(100000-124*.32))<200,'legacy return conversion: '+Math.round(save.money));
// Leaving abroad by another route hides the stale return option.
l=life();['sing','dance','acting'].forEach(k=>L.skill(l,k).level=90);L.state(l).languages={KR:80};pick(l,'KR');pick(l,'accept');l.abroad=null;ok(!keys(l).includes('home'),'no stale return home');
console.log('Audition139: '+n+' checks passed.');
