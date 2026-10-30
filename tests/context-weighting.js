'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path'),zlib=require('zlib');
const {loadGame,year,ROOT}=require('./lib/quick');
const G=loadGame(),E=G.E,C=E.CONTEXT143,withoutContext=require('./hardcore-isolation').gameContext({skip:['js/life143.js']}).E,rows=require('../docs/gd3-triggers.json');
let checks=0;function ok(v,m){assert.ok(v,m);checks++;}function eq(a,b,m){assert.deepStrictEqual(a,b,m);checks++;}
function life(){return {alive:true,age:25,base:100,money:100,lastIncome:100,flags:{},st:{kno:50,hea:70,soc:50},mind:{stress:40},tr:{amb:50},kids:[],loans:[],fam:{},job:{yrs:3},skill:50};}
function t(id){return E.TRIG.find(x=>x.id===id);}function f(id,l){return C.factor(t(id),l);}
eq(rows.length,50,'exactly 50 existing triggers');eq(E.TRIG.filter(t=>t.contextTags).length,50);
rows.forEach(x=>{ok(E.DEC[x.id]&&t(x.id),'existing '+x.id);eq(typeof t(x.id).p==='function'?String(t(x.id).p):t(x.id).p,x.before,'base p preserved '+x.id);eq(String(t(x.id).when),String(withoutContext.TRIG.find(t=>t.id===x.id).when),'current gate unchanged by context weighting '+x.id);});
{const l=E.createLife({mode:'vn',seed:906,noOrphan:true});l.age=20;l.birthYear=1991;ok(!t('viec_online').when(l,20),'online work unavailable before 2012');l.birthYear=1992;ok(t('viec_online').when(l,20),'online work available from 2012');}
const plain={p:.17},a=life();eq(C.probability(plain,a,.17),.17);eq(C.probability(plain,a,-1),-1,'legacy path unchanged');
for(const v of [-100,0,.2,.5,1,2,99,NaN,Infinity,null]){const k=C.factor({contextWeight:v},a);ok(Number.isFinite(k)&&k>=0&&k<=2,'bounded '+v);}
eq(C.factor({contextWeight:0},a),0);eq(C.factor({contextWeight:()=>99},a),2);eq(C.probability({contextWeight:2},a,0),0);eq(C.probability({contextWeight:2},a,99),1);eq(C.probability({contextWeight:2},a,-1),0);eq(C.probability({contextWeight:2},a,NaN),0);
const poor=life(),secure=life();Object.assign(poor,{job:null,money:-200,loans:[{bal:300}],kids:[{alive:true,born:23}]});poor.flags.career109={unemployment:{years:2,closed:false}};secure.money=2000;secure.lastIncome=300;
ok(f('doi_kem',poor)>f('doi_kem',secure),'pressure');ok(f('viec_online',poor)>f('viec_online',secure),'opportunity also grows with need');
const skilled=life(),novice=life();skilled.skill=90;skilled.st.kno=90;skilled.job.yrs=12;novice.skill=15;novice.st.kno=25;novice.job.yrs=0;ok(f('dev_offer_nuoc_ngoai',skilled)>f('dev_offer_nuoc_ngoai',novice));ok(f('vp_sa_thai_ai',skilled)<f('vp_sa_thai_ai',novice));
const tired=life(),rested=life();tired.mind.stress=95;tired.st.hea=35;tired.focus='work';rested.mind.stress=10;rested.st.hea=95;rested.focus='rest';ok(f('fl_burnout_lam_dem',tired)>f('fl_burnout_lam_dem',rested));
const strained=life(),close=life();for(const l of [strained,close])l.partner={uid110:'p:110:1',alive:true,name:'An',traits130:['ghen tuông'],family100:{trust:90,tension:5}};strained.partner.family100={trust:10,tension:80};
ok(f('marriageJealous130',strained)>f('marriageJealous130',close));ok(f('marriageGift130',strained)>0,'reconciliation/gifts never impossible');
const before=JSON.stringify(strained);f('marriageJealous130',strained);eq(JSON.stringify(strained),before,'read only NPC');
const traitBase=t('marriageJealous130').p(close);close.partner.traits130=['hài hước'];ok(t('marriageJealous130').p(close)<traitBase,'existing NPC personality probability preserved');
const isolated=life(),supported=life();supported.friends=[{uid110:'f:110:1',name:'B',alive:true,close:95}];supported.flags.life138={people:{'f:110:1':{trust:95}}};ok(f('ban_than_hen',supported)>f('ban_than_hen',isolated));ok(f('tram_cam',supported)<f('tram_cam',isolated));supported.friends[0].alive=false;eq(f('ban_than_hen',supported),f('ban_than_hen',isolated));
for(const l of [{alive:true},{alive:true,flags:{},partner:null,kids:[null],friends:[null]},life()]){const b=JSON.stringify(l);rows.forEach(x=>ok(Number.isFinite(f(x.id,l)),'missing data '+x.id));eq(JSON.stringify(l),b,'no initialization');}
for(const field of ['sex','eth','religion']){const b=life(),c=life();b[field]='one';c[field]='two';rows.forEach(x=>eq(f(x.id,b),f(x.id,c),'no sensitive weighting '+field));}
const childLife=life();childLife.kids=[{uid110:'kid:110:1',alive:true,born:10,close:50,family100:{trust:0,tension:10},persona141:{trust:90}}];
const trusted=f('con_hu',childLife);childLife.kids[0].family100.trust=100;eq(f('con_hu',childLife),trusted,'child legacy trust cannot override persona141');childLife.kids[0].persona141.trust=10;ok(f('con_hu',childLife)>trusted,'authoritative child trust');
// Sweep context ranges, including saturation and repeated tags.
for(let i=0;i<=100;i+=10){const l=life();l.st.kno=i;l.st.hea=i;l.mind.stress=i;l.money=(i-50)*100;for(const x of rows){const k=f(x.id,l);ok(k>=.5&&k<=2,x.id);const p=C.probability(t(x.id),l,.3);ok(p>=0&&p<=1,x.id);}}
eq(C.factor({contextTags:['fatigue','fatigue']},tired),C.factor({contextTags:['fatigue']},tired));
// Engine integration: a sentinel scene with no side effects. Gates, cooldowns and limits remain authoritative.
function probe(gate,weight,options,valid){const l=E.createLife({mode:'vn',seed:773});l.age=25;l.school=null;l.pending=[];l.job={id:'van_phong',rank:0,yrs:3};l.flags={};l.ill={n:'test'};l.partner=null;l.retired=true;l.ownHouse=true;Object.assign(l,options||{});const old=E.TRIG.slice();E.TRIG.splice(0,E.TRIG.length,{id:'gd3_probe',p:1,when:()=>gate,contextWeight:weight,max:1});E.DEC.gd3_probe={make:()=>({id:'gd3_probe',title:'Probe',text:'Probe',opts:[]}),valid:()=>valid!==false};try{E.beginYear(l);return l;}finally{E.TRIG.splice(0,E.TRIG.length,...old);delete E.DEC.gd3_probe;}}
ok(!probe(false,2).pending.some(d=>d.id==='gd3_probe'),'when false');ok(!probe(true,0).pending.some(d=>d.id==='gd3_probe'),'zero');ok(probe(true,2).pending.some(d=>d.id==='gd3_probe'),'weighted trigger enters engine');ok(!probe(true,2,{alive:false}).pending.some(d=>d.id==='gd3_probe'),'dead');ok(!probe(true,2,{jailUntil:30}).pending.some(d=>d.id==='gd3_probe'),'jailed');
ok(!probe(true,2,{},false).pending.some(d=>d.id==='gd3_probe'),'DEC.valid still blocks');
ok(!probe(true,2,{flags:{cd:{gd3_probe:24}}}).pending.some(d=>d.id==='gd3_probe'),'cooldown');
ok(!probe(true,2,{flags:{scN:{gd3_probe:1}}}).pending.some(d=>d.id==='gd3_probe'),'max appearances');
// Empirical Bernoulli trials: compare identical random stream for two contexts (not promised yearly frequency).
let low=0,high=0;let seed=12345;for(let i=0;i<30000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const r=seed/4294967296;if(r<C.probability(t('fl_burnout_lam_dem'),rested,.12))low++;if(r<C.probability(t('fl_burnout_lam_dem'),tired,.12))high++;}ok(high>low*1.3,'contrasting distribution');
// Every historical fixture can be inspected without writing context state into the save.
let fixtures=0;for(const name of fs.readdirSync(path.join(ROOT,'tests/fixtures/saves')).filter(n=>n.endsWith('.json.gz'))){const pack=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(ROOT,'tests/fixtures/saves',name))));const items=pack.saves||pack.fixtures; if(!items)throw Error('Unknown fixture format '+Object.keys(pack));for(const item of items){const l=item.life||(item.save&&item.save.life)||item.data; if(!l)throw Error('Unknown life '+Object.keys(item));const b=JSON.stringify(l);rows.forEach(x=>ok(Number.isFinite(f(x.id,l))));eq(JSON.stringify(l),b);fixtures++;}}
eq(fixtures,60);
console.log(JSON.stringify({checks,fixtures,bernoulli:{low,high},examples:{pressure:f('doi_kem',poor),secure:f('doi_kem',secure),tired:f('fl_burnout_lam_dem',tired),rested:f('fl_burnout_lam_dem',rested)}},null,2));
