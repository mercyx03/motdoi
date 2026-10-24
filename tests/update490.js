'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..','public'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [,f]of html.matchAll(/<script src="(js\/[^"?]+)\?v=[^"]+"[^>]*><\/script>/g))if(!['js/app.js','js/music.js','js/card.js','js/account.js'].includes(f))vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});




const {E,W}=G,T=E.WORLD_CRIME;let n=0;function ok(x,t){assert.ok(x,t);n++;}function near(x,y,t){ok(Math.abs(x-y)<1e-7*Math.max(1,Math.abs(y)),t);}
function life(country='JP',id='trom'){const l=E.createLife({mode:'world',country,seed:49001});l.age=30;l.alive=true;l.indep=true;l.pending=[];l.school=null;l.abroad=null;l.jailUntil=null;l.flags={};l.money=l.base*10;if(id)E.startJob(l,id,()=>.5,()=>{},true);T.state(l);return l;}
function run(l,d,k){l.pending=[d];return E.resolve(l,k);}
function scene(l,c){const p=T.pool(l),i=p.indexOf(c);ok(i>=0,'available '+c.id);return E.DEC.wc_su_kien.make(l,()=>(i+.01)/p.length);}
ok(T.cases.length===64,'64 distinct stories');ok(Object.keys(T.jobs).length===7,'7 voluntary crime careers');ok(new Set(T.cases.map(c=>c.id)).size===64,'unique story ids');
for(const p of T.profiles){const code=p[1].split(',')[0]||'ZA',l=life(code,null),d=E.DEC.wc_to_chuc.make(l,()=>.5);ok(d.opts.some(o=>o.l.includes(p[3][0])),'country-specific organization '+code);run(l,d,'g0');ok(T.group(l).joined,'explicit join');ok(!l.job,'membership not automatic job');ok(l.flags.underworld.linked,'shared underworld mechanics');}
for(const co of W.C.filter(c=>c.code!=='VN'))for(const id of Object.keys(T.jobs)){
 const l=life(co.code,id);ok(l.job.id===id&&l.job.rank===0,'entry rank '+co.code+id);ok(T.pool(l).some(c=>c.job===id),'job-specific stories '+co.code+id);ok(T.pool(l).every(c=>!c.profile||c.profile===T.profile(l)[0]),'no foreign profile leak');ok(E.jobTitle(l).includes(T.jobs[id]),'localized job '+id);ok(!E.DEC.dd_vao_duong_day.valid(l,{}),'VN scene excluded abroad');
}
for(const c of T.cases){const p=T.profiles.find(p=>p[0]===c.profile),code=p&&p[1].split(',')[0]||'ZA',base=life(code,c.job||'trom');if(c.joined){T.group(base).joined=true;base.flags.underworld={linked:true,heat:10,hunted:false};}if(c.family)base.fam.mAlive=true;
 for(const k of ['legal','risk','leave','later']){const l=JSON.parse(JSON.stringify(base)),d=scene(l,c),before=l.money;ok(d.text.includes(c.text),'correct case text');run(l,d,k);ok(Number.isFinite(l.money)&&l.money>=0,'finite money');if(k==='risk')ok(l.yr.items.some(i=>i.t==='Vốn việc làm bất chính'),'explicit capital');else near(l.money,before,'free options do not charge');if(k==='leave')ok(!l.job&&!T.group(l).joined,'exit cuts job and membership');
 const after=JSON.stringify(l);E.DEC.wc_su_kien.apply(l,d,k,()=>.5,()=>{});ok(JSON.stringify(l)===after,'no replay '+c.id+k);
 if(k!=='leave'){ok(!T.pool(l).some(x=>x.id===c.id),'cooldown immediate');l.age+=4;ok(!T.pool(l).some(x=>x.id===c.id),'cooldown before 5 years');}
 }
}
for(const change of [l=>{l.age++;},l=>{l.abroad={code:'US'};},l=>{l.job.rank++;},l=>{l.job=null;},l=>{l.jailUntil=35;},l=>{l.flags.military=35;},l=>{l.abroad={code:'KH',trapped:true};},l=>{l.alive=false;}]){const l=life(),d=E.DEC.wc_su_kien.make(l,()=>.3);change(l);ok(!T.valid(l,d.data),'stale context invalid');const cash=l.money;E.DEC.wc_su_kien.apply(l,d,'risk',()=>0,()=>{});ok(l.money===cash,'stale no charge');}
{
 const l=life('JP',null);run(l,E.DEC.wc_to_chuc.make(l,()=>.5),'g0');ok(T.group(l).joined,'JP member');const d=E.DEC.wc_su_kien.make(l,()=>.3);l.abroad={code:'RU'};ok(!T.valid(l,d.data),'country changed invalid');ok(!T.group(l).joined,'RU not auto joined');ok(T.profile(l)[0]==='ru','new country profile');l.flags.underworld.hunted=true;E.quitCrime(l,()=>{});ok(l.flags.underworld.hunted,'leaving does not erase pursuit');
}
{
 const l=life('JP');l.money=0;const d=E.DEC.wc_su_kien.make(l,()=>.3);ok(!d.opts.some(o=>o.k==='risk'),'no money risk hidden');E.DEC.wc_su_kien.apply(l,d,'risk',()=>0,()=>{});ok(l.money===0,'no involuntary debt');
 const f=life('JP');f.fam.mAlive=f.fam.fAlive=false;f.partner=null;f.kids=[];f.sibList=[];ok(T.pool(f).every(c=>!c.family),'no imaginary family');
 const x=life('JP');for(let i=0;i<2;i++)run(x,E.DEC.wc_su_kien.make(x,()=>.2),'later');ok(!T.pool(x).length,'two per year');x.age++;ok(T.pool(x).length>0,'new year quota resets');const snap=JSON.stringify(x.flags.worldCrime);E.migrate(x);ok(JSON.stringify(x.flags.worldCrime)===snap,'save migration preserves story state');
}
{
 const l=life('JP',null);l.age=17;ok(!E.DEC.wc_menu.valid(l),'under 18 cannot join');ok(E.startJob(l,'ma_tuy',()=>.5,()=>{},true)===false&&!l.job,'direct crime entry age blocked');l.age=30;l.abroad={code:'KH',trapped:true};ok(!E.DEC.wc_menu.valid(l),'trapped victim excluded');
 const v=life('VN');ok(!T.pool(v).length,'VN keeps prior system');ok(!E.DEC.wc_menu.valid(v),'world menu not VN');
 const t=life('JP',null),d=E.DEC.ru_re.make(t,()=>.5);ok(d.text.includes('Nhật Bản')&&!d.text.includes('ghi lô đề'),'localized invitation');const logs=run(t,d,'report');ok(!logs.some(x=>x.t.includes('Cả đường dây bị triệt phá')),'report no magic conviction');ok(!t.job,'report not join');
}
{
 const l=life('VN',null);l.abroad={code:'JP',study:true,until:35};l.school='abroad';E.startJob(l,'trom',()=>.5,()=>{});ok(l.abroad&&l.abroad.code==='JP'&&!l.abroad.study,'leaving studies does not teleport out of foreign country');ok(T.profile(l)[0]==='jp'&&l.job.id==='trom','foreign context preserved after entry');
 const q=life('JP',null),d=E.DEC.ru_re.make(q,()=>.5);E.DEC.ru_re.apply(q,d,'report',()=>.5,()=>{});const once=q.karma;E.DEC.ru_re.apply(q,JSON.parse(JSON.stringify(d)),'report',()=>.5,()=>{});ok(q.karma===once,'report invitation no replay');
}
let events=0;for(let i=0;i<80;i++){const code=['JP','RU','IT','US','MX','CO','BR','GB','DE','CA','AU','KH','KR','ZA'][i%14],l=life(code,Object.keys(T.jobs)[i%7]);run(l,E.DEC.wc_to_chuc.make(l,()=>.5),'g0');for(let y=0;y<12&&l.alive;y++){E.beginYear(l);let guard=0;while(l.pending.length&&l.alive&&guard++<80){if(l.pending[0].id==='wc_su_kien')events++;E.resolve(l,E.autoKey(l));}ok(guard<80,'no decision loops');if(l.alive)E.finishYear(l);guard=0;while(l.pending.length&&l.alive&&guard++<80)E.resolve(l,E.autoKey(l));ok(Number.isFinite(l.money)&&Number.isFinite(E.netWorth(l)),'simulation finances finite');E.endYear(l);}}
ok(events>10,'events occur naturally');console.log('4.9.0: '+n+' checks passed, '+events+' stories in 80 criminal-career simulations, 194 countries / 7 jobs covered');
