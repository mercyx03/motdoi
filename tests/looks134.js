'use strict';const assert=require('assert'),{gameContext}=require('./hardcore-isolation'),E=gameContext().E,L=E.LOOKS134;let n=0;function ok(v,m){assert(v,m);n++;}
function life(seed=134,patch){let l=E.createLife({mode:'vn',seed});Object.assign(l,{age:30,indep:true,school:null,money:100000,pending:[],kids:[],partner:null});E.FAMILY53.init(l);if(patch)patch(l);return l;}
function shown(d,key){const i=d.data.keys.indexOf(key);return i>=0&&d.opts.some(o=>o.k===String(i));}
function menu(l,id,key,arg){let d=E.DEC[id].make(l,()=>.5,arg),i=d.data.keys.indexOf(key);ok(shown(d,key),id+' offers '+key);l.pending=[d];d.manual=true;return E.resolve(l,String(i));}
// 3. Appearance score and labels
let l=life();ok(L.looks(l)>=15&&L.looks(l)<=95,'player looks in range');ok(L.looks(l)===L.looks(JSON.parse(JSON.stringify(l))),'stable across save');
ok(L.label(30)==='Kém hấp dẫn'&&L.label(50)==='Bình thường'&&L.label(70)==='Ưa nhìn'&&L.label(85,'M')==='Đẹp trai, hấp dẫn'&&L.label(85,'F')==='Xinh đẹp, hấp dẫn'&&L.label(95)==='Cực phẩm','labels by band');
ok(L.loveBonus(Object.assign(life(),{looks134:90}))>L.loveBonus(Object.assign(life(),{looks134:30})),'better looks, easier romance');
ok(L.followerFactor(Object.assign(life(),{looks134:90}))>1&&L.followerFactor(Object.assign(life(),{looks134:20}))<1,'looks scale follower growth');
// 4. Partner and children
l=life(1,l=>{l.partner={name:'Lan',sex:'F',age:29,alive:true,status:'married',since:25};l.kids=[{name:'Bé',sex:'F',born:28,alive:true,close:70}];});E.FAMILY53.init(l);
ok(L.partnerLooks(l,l.partner)>=15&&L.kidLooks(l,l.kids[0])>=15,'partner and child scores');
// 5. Looks care with yearly cap
l=life(2,l=>{l.looks134=50;});menu(l,'looks134','gym');ok(l.looks134===53,'exercise +3');l.pending=[];menu(l,'looks134','pt');ok(l.looks134===58,'PT +5');l.pending=[];menu(l,'looks134','spa');ok(l.looks134===60,'yearly cap +10');let d=E.DEC.looks134.make(l,()=>.5);ok(!shown(d,'gym'),'activity once per year');
l=life(3,l=>{l.money=0;});ok(!shown(E.DEC.looks134.make(l,()=>.5),'pt'),'needs money');
l=life(4,l=>{l.age=14;l.indep=false;});d=E.DEC.looks134.make(l,()=>.5);ok(!shown(d,'surgery')&&shown(d,'gym'),'no cosmetic surgery for minors');
l=life(5,l=>{l.partner={name:'Minh',sex:'M',age:31,alive:true,status:'married',since:25,looks134:40};l.kids=[{name:'Con',sex:'M',born:15,alive:true,close:70,looks134:40}];});E.FAMILY53.init(l);menu(l,'looks134','p_pt');ok(l.partner.looks134===45,'partner PT +5');l.pending=[];menu(l,'looks134','k_pt_'+l.kids[0].parentId);ok(l.kids[0].looks134===45,'child PT +5');
// 6. Health services
l=life(6);menu(l,'health134','dentist');ok(l.log.some(e=>/nha sĩ|khám răng/.test(e.t)),'dentist visit');ok(!shown(E.DEC.health134.make(l,()=>.5),'hospital'),'hospital only when ill');
l=life(7,l=>{l.ill={n:'viêm phổi',m:3,base:.4,cure:.4,mult:3,since:29,treated:'basic'};});let cure=l.ill.cure;menu(l,'health134','recheck');ok(l.ill.cure>cure,'follow-up raises cure');l.pending=[];cure=l.ill.cure;menu(l,'health134','hospital');ok(l.ill.cure>cure&&l.ill.mult<3,'hospital stay helps');
// 1. Family gatherings +5
l=life(8,l=>{l.partner={name:'Hoa',sex:'F',age:29,alive:true,status:'married',since:25,close:60};l.fam.mAlive=true;});let hap=l.st.hap,soc=l.st.soc;menu(l,'celebration129','tet');ok(Math.round(l.st.hap-hap)===5||l.st.hap===100,'Tết +5 happiness');ok(Math.round(l.st.soc-soc)===5||l.st.soc===100,'Tết +5 bond');ok(l.partner.close===65,'partner closeness +5');
// 2. Social fame helps the job/business, sometimes hurts
let gain=0,loss=0;for(let i=0;i<200;i++){l=life(900+i,l=>{l.job={id:'kd_shop',yrs:3};l.income=200;l.flags.social131={channels:[{followers:500000,reputation:60,engagement:50}],friends:[]};});const m=l.money;L.year(l,E.H.rf(l),()=>{},l.age);if(l.money>m)gain++;else if(l.money<m)loss++;}ok(gain>150&&loss>0,'fame mostly boosts business, scandals possible ('+gain+'/'+loss+')');
l=life(9,l=>{l.job={id:'kd_shop',yrs:3};l.income=200;l.flags.social131={channels:[{followers:500,reputation:60,engagement:50}],friends:[]};});let m=l.money;L.year(l,()=>.5,()=>{},l.age);ok(l.money===m,'small channels have no effect');
// 7. Up to 4 casual meetings a year and several children for a male player
function casualYear(seed,sex){const l=life(seed,l=>{l.sex=sex;}),net=E.RELATIONS108;l.flags.network108=[0,1,2].map(i=>({name:'Người '+i,sex:sex==='M'?'F':'M',age:25,alive:true,since:30,status:'ambiguous',residence108:'Hà Nội',country108:'VN'}));l.flags.network108.forEach(p=>net.person(l,p));let met=0;for(const p of l.flags.network108)for(let t=0;t<2;t++){const x=E.DEC.network108_person.make(l,()=>0,{at:l.age,who:p.relation108,done:false});l.pending=[x];x.manual=true;const before=(l.flags.meet108||{}).n||0;E.resolve(l,'baby');if(((l.flags.meet108||{}).n||0)>before)met++;}l.pending=[];return {l,met,babies:(l.flags.pregnancy108?1:0)+(l.flags.pregnancies108||[]).length};}
let most=0,delivered=true,femaleMax=0;for(let i=0;i<40;i++){const x=casualYear(1000+i,'M');ok(x.met===4,'four meetings per year ('+x.met+')');most=Math.max(most,x.babies);const k0=x.l.kids.length;x.l.age++;E.HOOKS.year.forEach(h=>{try{h(x.l,()=>.5,()=>{},x.l.age);}catch(e){}});if(x.l.kids.length-k0!==x.babies)delivered=false;const f=casualYear(2000+i,'F');femaleMax=Math.max(femaleMax,f.babies);}
ok(most>=2&&most<=3,'male player can have 2-3 children in one year ('+most+')');ok(delivered,'every pregnancy is delivered next year');ok(femaleMax===1,'female player carries one pregnancy at a time');
console.log('PASS looks134: '+n+' checks');
// Adopted children do not inherit the adoptive parent's appearance score.
let low=life(81234),high=JSON.parse(JSON.stringify(low));low.looks134=10;high.looks134=95;let child={name:'Con nuôi',born:20,adopted:true};let c1=JSON.parse(JSON.stringify(child)),c2=JSON.parse(JSON.stringify(child));ok(L.kidLooks(low,c1)===L.kidLooks(high,c2),'adopted child appearance independent of adoptive parent');
console.log('PASS adopted child appearance regression');
