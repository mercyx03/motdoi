'use strict';
const assert = require('node:assert/strict');
const {loadGame} = require('./lib/quick');
const E=loadGame().E, C=E.CHILD141;
const quiet=()=>{};
function family(code) {
  const l=E.createLife({mode:code==='VN'?'vn':'world',country:code,seed:834});
  Object.assign(l,{age:50,alive:true,kids:[],pending:[],money:l.base*40});
  for(const born of [30,32]) l.kids.push({name:'An',sex:'M',born,alive:true,close:60,study:75,edu:3});
  return l;
}
function step(l){C.year(l,()=>.55,quiet,l.age,{});}
function reload(l){return E.migrate(JSON.parse(JSON.stringify(l)));}
function seedPath(l,kind,n=0){
  const k=l.kids[0], p=C.init(l,k);
  p.path834={kind,step:n,next:l.age-k.born};
  return p.path834;
}
for (const cc of ['VN','JP']) {
  for (const kind of Object.keys(C.paths)) {
    let l=family(cc);seedPath(l,kind);let k=l.kids[0];
    step(l);
    assert.equal(k.persona141.path834.step,1,cc+kind);
    const id=E.UPDATE110.uid(l,k), d=E.DEC.child141.make(l,()=>.5,{id});
    const button=d.data.keys.indexOf('pathListen');
    assert(button>=0);E.DEC.child141.apply(l,d,String(button),()=>.5,quiet);
    assert.equal(k.persona141.path834.response,'listen');
    assert.notEqual(l.kids[1].persona141.path834?.response,'listen');
    l=reload(l);k=l.kids[0];
    assert.equal(k.persona141.path834.response,'listen');
    for(let i=0;i<9;i++){l.age++;step(l);}
    assert.equal(k.persona141.path834.step,3);
    assert(E.CHILD147.facts(l,k).some(x=>x[1].includes(C.paths[kind][0])));
    const mem=k.persona141.memories.length;step(l);assert.equal(k.persona141.memories.length,mem);
  }
}
// A debt cannot be charged to the parent or posted twice after reloading.
{
 const l=family('VN'),k=l.kids[0],cash=l.money;
 seedPath(l,'secret');step(l);const debt=k.debt158;assert(debt>0);assert.equal(l.money,cash);
 step(l);assert.equal(k.debt158,debt);
}
// Severe cases require adults, progress separately from financial support and survive migration.
{
 let l=family('JP'), k=l.kids[0], s=seedPath(l,'entitled',3);
 s.legal={status:'investigating',opened:20,pregnancy:true};
 l.age+=2;step(l);assert.equal(s.legal.status,'reviewed');
 l=reload(l);l.age+=2;step(l);s=l.kids[0].persona141.path834;
 assert(['liable','closed'].includes(s.legal.status));assert(['confirmed','unconfirmed'].includes(s.legal.parentage));
}
for(const code of ['VN','JP']){
 const l=family(code);l.kids[0].born=l.age-9;step(l);assert(!l.kids[0].persona141.path834);
 let occurrences=0;
 for(let i=0;i<120;i++){l.id='child-path-'+i;l.kids[0].born=l.age-17;delete l.kids[0].persona141;step(l);
 const s=l.kids[0].persona141.path834;
 if(s){occurrences++;assert.notEqual(s.kind,'heir');assert(!s.legal);}
 }
 assert(occurrences>0&&occurrences<100);
}
console.log('PASS all 12 paths in VN and JP, child identity, responses, debt, save/reload and legal follow-up');

{
 const l=family('VN'),k=l.kids[0];
 E.BUSINESS123.companies(l).push({name:'Công ty thử',share:60,value:100,roles:{}});
 const q=E.DYNASTY908.profile(l,{id:E.UPDATE110.uid(l,k),person:k,age:20});
 const initial=q.management;
 seedPath(l,'heir');step(l);assert.equal(q.management,initial+5);
 assert.equal(E.BUSINESS123.companies(l)[0].share,60);
}
{
 const l=family('VN'), k=l.kids[0];let cases=0;
 for(let i=0;i<300;i++){
   l.id='legal-case-'+i;l.age=50;k.born=i<150?33:30;
   delete k.persona141;const path=seedPath(l,'entitled',2);step(l);
   if(i<150)assert(!path.legal);
   else if(path.legal){cases++;assert.equal(path.legal.status,'investigating');}
 }
 assert(cases>0 && cases<150);
}
