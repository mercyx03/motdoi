'use strict';
const assert=require('assert'),fs=require('fs'),vm=require('vm'),path=require('path');let checks=0;
const ok=(v,t)=>{assert(v,t);checks++;},copy=x=>JSON.parse(JSON.stringify(x));
function load(prose){const c={console,Math,Date,JSON,Buffer,TextEncoder,TextDecoder};c.globalThis=c;vm.createContext(c);for(const m of fs.readFileSync('public/index.html','utf8').matchAll(/<script src="(js\/[^"?]+)/g)){if(/\/(app|music|card|scene2d|scene|account)\.js$/.test(m[1])||!prose&&/fantasy-narrative/.test(m[1]))continue;vm.runInContext(fs.readFileSync(path.join('public',m[1]),'utf8'),c);}return c.G;}
const G=load(true),B=load(false),F=G.FANTASY,old=B.FANTASY;
function clean(l){const x=copy(l);delete x.log;delete x.storytelling;if(x.pending){delete x.pending.narrative;delete x.pending.text;}return x;}
function fresh(age=3){const l=F.create({seed:100});l.age=age;l.pending=null;l.battle=null;l.ap=10;return l;}
ok(Object.keys(F.narrativeCatalog).length===62,'62 authored local and core scenes');
for(const [id,row]of Object.entries(F.narrativeCatalog)){
 const event=F.events.find(x=>x.id===id);ok(!!event,id+' has a real event');ok(row.text.length>150&&row.results.length===event.choices.length,id+' has setting and every outcome');
 for(let i=0;i<event.choices.length;i++){
  const l=fresh(Math.max(3,event.min)),before=copy(l),pending={id,title:event.title,text:event.text,opts:event.choices.map((c,j)=>({k:String(j),n:c.n}))};l.pending=F.describeEvent(l,pending);before.pending={id,title:event.title,text:event.text,opts:copy(pending.opts)};
  const mechanics=copy(before);ok(old.choose(mechanics,String(i)),id+' baseline option');ok(F.choose(l,String(i)),id+' narrative option');
  ok(JSON.stringify(clean(l))===JSON.stringify(clean(mechanics)),id+' preserves costs, rewards and random state');ok(l.log.some(e=>e.t===row.results[i]),id+' records result, not button label');ok(row.results[i].length>90,id+' result has concrete detail');
 }
}
for(const r of F.data.regions){const l=fresh(25);l.location=r.id;for(const i of [0,1]){const e=F.events.find(x=>x.id==='region_story_'+r.id+'_'+i),p=F.describeEvent(l,{id:e.id,text:e.text,opts:e.choices.map((c,k)=>({k:String(k),n:c.n}))});ok(p.text.includes(r.n)&&p.text.length>300,'regional setting '+r.id);ok(p.narrative.results.length===3,'regional outcomes '+r.id);}}
{
 const l=fresh(3),a=[];for(let i=0;i<3;i++){ok(F.study(l),'child study succeeds');a.push(l.log[l.log.length-1].t);}ok(new Set(a).size===3&&a.every(x=>x.length>180),'consecutive study descriptions differ');l.ap=0;const snapshot=JSON.stringify(l);ok(!F.study(l)&&JSON.stringify(l)===snapshot,'failed study does not mutate narrative counters');const restored=F.migrate(copy(l));ok(JSON.stringify(restored)===JSON.stringify(l),'narration counter saves without changing progress');
 const dead=fresh(3);dead.family.mother.alive=false;dead.family.father.alive=false;ok(!/mẹ|bố/.test(F.studyScene(dead)),'does not invent living parents');
}
for(const age of [0,1,2])for(const soft of [false,true]){const l=fresh(age),b=copy(l),t=F.babyStory(l,soft);old.babyStory(b,soft);ok(l.rs===b.rs,'baby prose preserves existing random consumption');ok(t.length>150,'baby scene has detail');}
{
 const l=fresh(9);l.location='son_thanh';for(const kind of ['greet','help','threaten']){const original=copy(l),before=l.log.length;ok(F.talk(l,kind),'NPC conversation succeeds');ok(old.talk(original,kind),'baseline NPC succeeds');ok(JSON.stringify(clean(l))===JSON.stringify(clean(original)),'NPC costs and effects unchanged');ok(l.log.slice(before).some(e=>e.t.includes('Sơn Thành Bạch Phong')&&e.t.length>300),'NPC has local scene and actual work');}
 const npc={role:'thợ rèn'},a=F.describeNPC(l,npc,'greet'),b=F.describeNPC(l,npc,'greet');ok(a!==b&&/kim loại|dụng cụ|đinh/.test(a)&&/kim loại|dụng cụ|đinh/.test(b),'smith rotates authored work details');
}
for(const seed of [11,22,33]){const a=F.create({seed}),b=old.create({seed});for(let year=0;year<30&&a.alive;year++){ok(JSON.stringify(clean(a))===JSON.stringify(clean(b)),'Fantasy mechanics match without prose at seed '+seed+' age '+a.age);if(a.pending){const key=a.pending.opts.find(o=>!o.disabled).k;F.choose(a,key);old.choose(b,key);}F.advance(a);old.advance(b);}}
ok(JSON.stringify(G.E.CAR)===JSON.stringify(B.E.CAR)&&G.E.TRIG.length===B.E.TRIG.length,'Vietnam and World registries unchanged');
console.log('PASS: '+checks+' Fantasy narration, choice outcomes, deterministic mechanics and isolation checks.');
