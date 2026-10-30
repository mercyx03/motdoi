'use strict';
const assert=require('assert'),{loadGame}=require('./lib/quick'),G=loadGame(),E=G.E,A=E.ABROAD_DEPTH900;let n=0;const ok=(x,m)=>{assert(x,m);n++;};
function life(){let l=E.createLife({mode:'vn',seed:906,noOrphan:true,gender:'M'});Object.assign(l,{age:32,indep:true,alive:true,school:null,abroad:null,pending:[],sched:[],money:l.base*100,retired:false});l.flags.military=0;l.lang={en:3,ja:3,ko:3,de:3,fr:3};l.langAt={en:32,ko:32};l.langExp={};return l;}
function choose(l,k){let d=l.pending[0];let key=k!=='cancel'&&d.data&&d.data.keys?String(d.data.keys.indexOf(k)):k;ok(d.opts.some(o=>o.k===key),d.id+' exposes '+k);l.rs=1;E.resolve(l,key);}
for(let country of ['US','GB','AU','CA','JP','KR','DE','FR'])for(let lv of [5,6,7]){
 let l=life();l.edu=lv-1;l.flags.studyVisa900={country,lv,school:0,field:'it',scholar:true,until:33};ok(A.prompt(l,()=>0),'automatic letter prompt');ok(l.pending[0].manual,'visible user choice');ok(!A.prompt(l,()=>0)&&l.pending.length===1,'no duplicate');choose(l,'cancel');ok(l.pending.length===0&&!A.prompt(l,()=>0),'postpone leaves finite queue, same-year no repeat');l.age++;ok(A.prompt(l,()=>0),'next-year reminder');choose(l,'docs');choose(l,'plan');choose(l,'visa');ok(l.abroad&&l.abroad.code===country,'entry '+country+' '+lv);ok(l.pending.length===0,'entry queue drained');
}
for(let employed of [false,true]){
 let l=life();l.abroad={code:'CA',name:'Canada',perm:false,until:34,residence900:{kind:'jobsearch',until:34,adaptation:80,homesick:20,history:[]}};if(employed)E.startJob(l,'lap_trinh',()=>0,()=>{},true);else l.job=null;
 ok(E.actions(l).some(a=>a.id==='residenceVisa906'&&a.ok===true),'direct renewal action');l.age=33;ok(A.remindResidence(l,()=>0),'advance residency reminder');ok(!A.remindResidence(l,()=>0),'once per year');let d=l.pending[0];ok(d.data.arg.code==='CA','direct prompt carries destination');let available=d.opts.some(o=>o.k===String(d.data.keys.indexOf('renew')));if(employed){choose(l,'renew');ok(A.residence(l).pending,'application pending');l.age=34;A.year(l,()=>0,()=>{});ok(A.residence(l).kind==='worker'&&A.residence(l).until===37,'approval extends worker residence');}else{ok(!available,'without contract does not grant work visa');choose(l,'cancel');l.age=35;A.year(l,()=>0,()=>{});ok(!A.valid(l),'expired stay suspended');ok(l.pending.length===1,'expired stay still exposes remedy');choose(l,'cancel');ok(!l.pending.length,'expiry reminder cancellable');}
}
for(let country of [null,'CA','JP','DE']){
 let l=life();if(country)l.abroad={code:country,name:G.W.BY[country].name,perm:true};let d=E.DEC.hoc_them.make(l,()=>0),labels=d.opts.map(o=>o.l).join(' ');for(let cert of ['IELTS','JLPT','TOPIK','HSK','Goethe','tiếng Pháp'])ok(labels.includes(cert),'visible '+cert+' in '+country);l.lang.de=0;d=E.DEC.hoc_them.make(l,()=>0);l.pending=[d];let o=d.opts.find(o=>o.l.includes('Goethe'));ok(!!o,'Goethe reachable');l.rs=1;E.resolve(l,o.k);ok(l.lang.de===1,'Goethe actually learnt');
}
for(let alive of [false,true])for(let age of [0,8,18,28])for(let score of [0,95]){
 let l=life();l.age=55;l.alive=alive;let k={name:'Con thử nghiệm',sex:'F',born:55-age,alive:true,looks134:score,study:score,st:{hea:87,hap:82,soc:73},close:85,edu:age>=18?3:0,inc:0};l.kids=[k];if(!alive)l.death={age:55,year:l.birthYear+55,cause:'tuổi già'};let before=JSON.stringify(k),b=E.heirAtAge(l,k,1);ok(b&&b.age===age,'selected present age');ok(b.name===k.name&&b.sex===k.sex,'identity preserved');ok(b.looks134===score&&b.st.kno===score,'recorded appearance/study exact including zero');ok(b.st.hea===87&&b.st.hap===82&&b.st.soc===73,'recorded bars exact');ok(b.edu===k.edu,'education preserved');let loaded=E.migrate(JSON.parse(JSON.stringify(b)));ok(loaded.looks134===score&&loaded.st.kno===score,'handoff survives load');
}
for(let code of ['CA','JP','KR','DE','FR','US','TH','CN']){
 let l=life();l.age=42;l.abroad={code,name:G.W.BY[code].name,perm:true};l.city=G.W.BY[code].cities[0];l.pending=[E.DEC.du_lich.make(l,()=>0)];choose(l,'near');let s=l.flags.trip50;ok(s.source===code&&s.local.country906===code,'domestic route belongs to residence');ok(!/Hà Giang|Hà Nội|Đà Lạt/.test(s.local.name),'no Vietnamese domestic trip abroad');ok(!E.DEC.que_doc.valid(l),'local Vietnamese hometown action blocked');let old=JSON.parse(JSON.stringify(l.pending[0]));l.abroad.code='US'===code?'JP':'US';let money=l.money;E.DEC.travel50_step.apply(l,old,'solo',()=>0,()=>{});ok(l.money===money,'old travel cannot charge after relocation');
 let c=life();c.abroad={code,name:G.W.BY[code].name,perm:true};let d=E.DEC.concert_di.make(c,()=>0,{cat:'vn',n:'Minh Vy'});ok(d.data.destination897==='VN'&&d.data.far,'Vietnam artist physical concert is cross-border');ok(d.text.includes('khứ hồi'),'travel clearly disclosed');
}

{
 let l=life();l.abroad={code:'TW',name:'Đài Loan',perm:false,until:33};l.lang.zh=3;l.langAt.zh=l.age;E.startJob(l,'lap_trinh',()=>0,()=>{},true);ok(G.W.C.length===195&&G.W.BY.TW.name==='Đài Loan','legacy labor destination does not change random birth pool');ok(E.act(l,'residenceVisa906'),'TW renewal action');choose(l,'renew');ok(A.residence(l).pending,'TW application no exception');l.age++;A.year(l,()=>0,()=>{});ok(A.residence(l).kind==='worker','TW residency approved');l.pending=[E.DEC.abroadMove146.make(l,()=>0)];choose(l,'home');ok(!l.abroad&&Number.isFinite(l.money),'TW return home no exception or invalid money');
}
{
 let l=life();l.lang.en=5;l.langAt.en=l.age-3;let d=E.DEC.hoc_them.make(l,()=>0);ok(d.opts.some(o=>o.l.includes('Thi lại IELTS')),'max-level expired certificate can still be renewed');l.pending=[d];choose(l,'renew906_en');ok(l.pending[0].id==='chung_chi_het_han','retake routes to existing exam');
}

{
 let l=life();l.abroad={code:'CA',name:'Canada',perm:true};l.pending=[E.DEC.du_lich.make(l,()=>0)];choose(l,'near');let s=l.flags.trip50;delete s.local.country906;let migrated=E.migrate(JSON.parse(JSON.stringify(l)));ok(migrated.flags.trip50.local.country906==='CA'&&E.TRAVEL50.valid(migrated,migrated.pending[0].data),'valid old domestic trip preserved');
 s.local.name='Hà Giang';s.paid=true;s.quote={total:10};let money=l.money;l=E.migrate(JSON.parse(JSON.stringify(l)));ok(l.flags.trip50.done&&l.flags.trip50.refunded906&&l.money===money+10,'wrong legacy domestic trip refunded and unblocked');money=l.money;l=E.migrate(JSON.parse(JSON.stringify(l)));ok(l.money===money,'migration refund only once');
}

for(let c of G.W.C)for(let id of ['concert','concert_di']){
 let l=life();l.abroad={code:c.code,name:c.name,perm:true};l.idolCat='vn';l.idol='Minh Vy';let d=E.DEC[id].make(l,()=>0,{cat:'vn',name:'Minh Vy'});ok(!/undefined|NaN/.test(d.text),'clean concert description '+id+' '+c.code);ok(d.data.destination897==='VN'&&d.data.residence897===c.code,'random and manual concerts share residence '+c.code);ok(d.data.far===(c.code!=='VN'),'physical travel flag '+c.code);let old=JSON.parse(JSON.stringify(d));l.abroad.code=c.code==='CA'?'JP':'CA';let money=l.money;E.DEC[id].apply(l,old,'self',()=>0,()=>{});ok(l.money===money,'stale concert cannot charge '+id+' '+c.code);
}

for(let k of ['en','ko','zh'])for(let flagged of [false,true]){
 let l=life();l.lang[k]=G.E.H.LANG[k].lv.length;l.langAt[k]=l.age-3;l.langExp[k]=flagged;l.pending=[E.DEC.hoc_them.make(l,()=>0)];choose(l,'renew906_'+k);ok(E.DEC.chung_chi_het_han.valid(l,l.pending[0].data),'expired flag still permits manual retake');let money=l.money;choose(l,'retest');ok(E.certValid(l,k)&&l.money<money,'retake actually renews and charges fee '+k+' '+flagged);ok(l.pending.length===0,'retake queue drains');
}
console.log('PASS continuity906: '+n+' checks; automatic admission/residency prompts, eight destinations/three degrees, cancel/expiry/renewal, all certificates and Goethe, living/deceased parent handoff including zero stats, residence/travel guards');


