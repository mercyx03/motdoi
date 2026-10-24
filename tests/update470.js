'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..','public'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [,f]of html.matchAll(/<script src="(js\/[^"?]+)\?v=[^"]+"[^>]*><\/script>/g))if(!['js/app.js','js/music.js','js/card.js','js/account.js'].includes(f))vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});

const {E,W}=G,T=E.WORLD_STORIES;let n=0;function ok(x,t){assert.ok(x,t);n++;}
function life(code='US',age=30){const l=E.createLife({mode:'world',country:code,seed:47001});l.age=age;l.alive=true;l.pending=[];l.flags={};l.abroad=null;l.jailUntil=null;l.school=age<18?'upper':null;l.job={id:'van_phong',rank:0,yrs:1,rep:50};l.money=Math.max(l.base,1);l.urban=true;l.partner={name:'An',age:30,alive:true,close:50};l.kids=[{name:'B',born:age-7,alive:true,close:50}];l.fam.mAlive=true;return l;}
function scene(l,c){const p=T.pool(l),i=p.indexOf(c);ok(i>=0,'case available '+c.id);let calls=0,local=p.some(c=>c.code);return E.DEC.world_doi_song.make(l,()=>local&&calls++===0?.999:(i+.01)/p.length);}
function resolve(l,d,k){l.pending=[d];E.resolve(l,k);}
const codes=[...new Set(T.cases.filter(c=>c.code).map(c=>c.code))];
ok(codes.length>=50,'50 countries with authored stories');ok(T.cases.length>=130,'at least 130 stories');ok(new Set(T.cases.map(c=>c.id)).size===T.cases.length,'unique story IDs');
for(const c of T.cases){
 let l=life(c.code||'US',Math.max(c.min,Math.min(c.max,30)));if(c.kind==='rural')l.urban=false;if(c.kind==='outdoor')l.job.id='cong_nhan';
 ok(T.suitable(l,c),'valid context '+c.id);let d=scene(l,c);ok(d.data.caseId===c.id&&d.text.includes(c.text),'correct generated text '+c.id);
 for(const o of d.opts){const x=life(c.code||'US',l.age);if(c.kind==='rural')x.urban=false;if(c.kind==='outdoor')x.job.id='cong_nhan';const q=scene(x,c),before=x.money,at=x.age,country=x.country,edu=x.edu;
 resolve(x,q,o.k);ok(x.flags.worldStories.count===1,'one resolution '+c.id+o.k);ok(Number.isFinite(x.money),'finite funds');ok(x.country===country&&x.age===at&&x.edu===edu,'no fabricated moves/age/degree');
 if(o.k==='learn')ok(Math.abs(x.money-before+T.cost(x))<1e-8,'exact quoted payment');else ok(x.money===before,'free choice remains free');
 const snap=JSON.stringify(x);resolve(x,q,o.k);ok(JSON.stringify(x)===snap,'stale replay no mutation');
 ok(!T.pool(x).some(y=>y.id===c.id),'cooldown');x.age+=7;ok(!T.pool(x).some(y=>y.id===c.id),'not before eight years');
 }
}
for(const co of W.C.filter(c=>c.code!=='VN'))for(const age of [5,9,16,25,45,70]){const l=life(co.code,age),p=T.pool(l);ok(p.length>0,'coverage '+co.code+age);ok(p.every(c=>!c.code||c.code===co.code),'correct country only');const d=E.DEC.world_doi_song.make(l,()=>.4);ok(d.opts.some(o=>o.k==='no')&&d.opts.some(o=>o.k==='care'),'free and decline always');if(age<18)ok(!d.opts.some(o=>o.k==='learn'),'children never pay');}
for(const reason of ['jail','military','trapped','dead','move','year','currency']){const l=life(),d=E.DEC.world_doi_song.make(l,()=>.4);if(reason==='jail')l.jailUntil=l.age+2;if(reason==='military')l.flags.military=l.age+2;if(reason==='trapped')l.abroad={code:'KH',trapped:true};if(reason==='dead')l.alive=false;if(reason==='move')l.abroad={code:'JP'};if(reason==='year')l.age++;if(reason==='currency')l.cur='vnd';ok(!T.valid(l,d.data),'invalidate '+reason);const before=l.money;E.DEC.world_doi_song.apply(l,d,'learn',()=>.5,()=>{});ok(l.money===before,'stale cannot charge '+reason);}
{
 const l=life();l.money=0;let d=E.DEC.world_doi_song.make(l,()=>.5);ok(!d.opts.some(o=>o.k==='learn'),'no funds no paid option');l.money=l.base;d=E.DEC.world_doi_song.make(l,()=>.5);l.money=0;resolve(l,d,'learn');ok(l.money===0,'funds changed no overdraft');
}
{
 const l=life();for(let i=0;i<2;i++){const d=E.DEC.world_doi_song.make(l,()=>.4);resolve(l,d,'no');}ok(!T.pool(l).length,'max two per year including declines');l.age++;ok(T.pool(l).length>0,'quota resets');
 const v=life('VN');ok(!T.pool(v).length&&!v.flags.worldStories,'VN keeps its existing scenes and flags');v.abroad={code:'JP'};ok(T.pool(v).some(c=>c.code==='JP'),'VN migrant in Japan');delete v.abroad;ok(!T.pool(v).length,'return to VN');
}
{
 const l=life();l.job=null;l.school=null;l.partner=null;l.kids=[];l.fam.mAlive=l.fam.fAlive=false;l.sibList=[];
 ok(T.pool(l).every(c=>!['work','outdoor','school','partner','parent','family'].includes(c.kind)),'no imaginary job school partner children family');
 const s=JSON.stringify(l.flags.worldStories);E.migrate(l);ok(JSON.stringify(l.flags.worldStories)===s,'migration preserves counters');
 const menu=E.DEC.world_chu_de.make(l,()=>.5);ok(menu.opts.some(o=>o.k==='culture')&&!menu.opts.some(o=>o.k==='work'),'menu filters actual life');
}
for(const [kind,change] of [['work',l=>{l.job=null;}],['work',l=>{l.job.id='ke_toan';}],['school',l=>{l.school=null;}],['partner',l=>{l.partner.name='Someone else';}],['parent',l=>{l.kids[0].alive=false;}]]){
 const l=life('US',kind==='school'?16:30),c=T.pool(l).find(c=>c.kind===kind),d=scene(l,c);change(l);ok(!T.valid(l,d.data),'target changed '+kind);const before=l.money;E.DEC.world_doi_song.apply(l,d,'learn',()=>.5,()=>{});ok(l.money===before,'no charge changed target');
}
let scenes=0;for(let i=0;i<80;i++){const co=W.C.filter(c=>c.code!=='VN')[i*7%194],l=E.createLife({mode:'world',country:co.code,seed:470000+i});for(let year=0;year<100&&l.alive;year++){E.beginYear(l);let guard=0;while(l.pending.length&&guard++<100){const d=l.pending[0];if(d.id==='world_doi_song'){scenes++;ok(T.valid(l,d.data),'simulation scene valid');}E.resolve(l,E.autoKey(l,d));}ok(guard<100,'no decision loops');if(l.alive)E.finishYear(l);guard=0;while(l.pending.length&&l.alive&&guard++<100){const d=l.pending[0];if(d.id==='world_doi_song')scenes++;E.resolve(l,E.autoKey(l));}ok(Number.isFinite(l.money),'simulation finances finite');E.endYear(l);} }
ok(scenes>30,'events actually occur in full lives');console.log('4.7.0: '+n+' checks passed; '+T.cases.length+' scenes / '+codes.length+' countries; '+scenes+' world events in 80 lives');
