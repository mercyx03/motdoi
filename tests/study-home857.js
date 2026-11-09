'use strict';
const assert=require('node:assert/strict'),{E}=require('./hardcore-isolation').gameContext(),S=E.STUDY857;
let checks=0;const ok=(v,msg)=>{assert(v,msg);checks++;},copy=x=>JSON.parse(JSON.stringify(x)),noop=()=>{};
function pupil(country='GB',region='England',age=14){const l=E.createLife({mode:'world',country,seed:857,year:2026-age});Object.assign(l,{country,age,educationRegion:region,school:age<11?'primary':age<16?'lower':'upper',schoolEnd:18,money:100000,pending:[],sched:[]});l.st.kno=80;l.st.hea=80;return l;}
function prepare(l,id='family'){ok(S.request(l,id,'nhịp học'),'request');let s=S.home(l);s.documents=s.plan=s.consulted=s.credential=true;ok(S.submit(l),'submit');return s;}
function start(l,id='family'){const s=prepare(l,id);if(s.status==='pending'){l.age++;ok(S.review(l),'review next year');}ok(S.start(l),'start');return s;}
function choose(l,id,key,arg){const d=E.DEC[id].make(l,()=>.5,arg),index=d.data.keys.indexOf(key);ok(index>=0,id+' offers '+key);ok(d.opts.some(x=>x.k===String(index)),id+' enabled '+key);E.DEC[id].apply(l,d,String(index),()=>.5,noop);return d;}
ok(S.REGIONS.US.length===51,'50 states and DC');ok(S.REGIONS.CA.length===13,'13 Canada regions');ok(S.REGIONS.AU.length===8,'8 Australia regions');ok(S.REGIONS.GB.length===4,'4 UK nations');
for(const r of S.REGIONS.US){const l=pupil('US',r.id);const q=S.rule(l);ok(q.key==='US:'+r.id,'jurisdiction '+r.id);if(!S.RULES[q.key])ok(q.mode==='unknown'&&q.routes.length===0,'unknown fails closed '+r.id);}
for(const country of ['VN','DE','CA','AU']){const l=pupil(country,'unknown');ok(!S.request(l,'family'),'no route fabricated '+country);ok(S.report(l).includes(country==='VN'?'học chính quy':'Chưa có dữ liệu'),'honest fallback '+country);}
{
 const l=pupil('US','MA'),old=copy({school:l.school,end:l.schoolEnd});let s=prepare(l);ok(s.status==='pending','prior approval pending');ok(!S.start(l)&&l.school===old.school&&l.schoolEnd===old.end,'pending keeps school');ok(!S.review(l),'no instant review');l.age++;ok(S.review(l)&&S.start(l),'approval then start');ok(l.schoolEnd===null,'no automatic diploma clock');ok(E.gradFail(l,()=>.5,noop),'guard automatic graduation');ok(!E.DEC.hs.valid(l),'no old school graduation bypass');
}
{
 const l=pupil('US','TX');ok(S.request(l,'family'),'draft');ok(!S.submit(l)&&S.home(l).status==='needsInfo','missing docs');ok(!S.start(l),'cannot start incomplete');
 const s=S.home(l);s.status='draft';s.documents=s.plan=s.consulted=true;ok(S.submit(l)&&s.status==='approved','no invented Texas permit');ok(S.start(l),'Texas starts');
 const awards={degree:l.edu,score:26.5,result:{total:26.5,legacy:true}};l.examScore=awards.score;l.flags.exam127=copy(awards.result);s.subjects.math=70;l.indep=true;
 ok(S.study(l,'math','summer',noop),'accelerate math');ok(!s.subjects.lit,'other subjects unchanged');ok(S.study(l,'english','self',noop),'second block');ok(S.study(l,'science','tutor',noop),'third block');ok(!S.study(l,'math','self',noop),'annual limit');
 const transcript=copy(s.subjects);l.educationRegion='MA';ok(!S.active(l),'cross-state invalidates immediately');S.reconcile(l);ok(s.status==='reviewResidence','review jurisdiction');ok(!S.study(l,'math','self',noop),'old jurisdiction cannot continue');ok(S.back(l,'public'),'return to school');ok(JSON.stringify(s.subjects)===JSON.stringify(transcript),'reentry retains achievements');
 ok(l.edu===awards.degree&&l.examScore===awards.score&&JSON.stringify(l.flags.exam127)===JSON.stringify(awards.result),'degrees/final scores unchanged');
 const loaded=E.migrate(copy(l));ok(loaded.flags.study829.home.subjects.math===s.subjects.math&&loaded.examScore===26.5,'save migration preserves new and old');
}
{
 const l=pupil('US','TX',16),s=start(l);for(const k of ['math','lit','english','science','humanities'])s.subjects[k]=85;
 const a=S.milestones(l);ok(a.programComplete&&a.credentialEligible&&!a.credentialReceived&&!a.admissionEligible,'four milestones independent');ok(S.diploma(l),'family diploma');ok(!S.diploma(l),'no duplicate diploma');ok(!S.milestones(l).admissionEligible&&l.edu<3,'diploma does not forge university eligibility');
}
{
 const l=pupil('US','CA');const s=prepare(l,'publicIndependent');ok(s.status==='pending','school-managed intake');l.age++;S.review(l);S.start(l);ok(s.schoolManaged&&s.resources.device&&s.resources.textbooks,'California school resources are conditional');ok(!S.study(l,'math','self',noop),'school-managed uses school curriculum');
 const z=pupil('US','CA');const h=start(z);ok(!h.resources,'independent California no charter resources');
}
{
 const l=pupil('NZ','',10),s=start(l);ok(!S.claim(l,1,0),'no first partial-year overpayment');l.age++;ok(S.logObligation(l,'statutory declaration kỳ 1'),'declaration');const before=l.money;ok(S.claim(l,1,1),'eligible NZ period');ok(l.money>before&&s.aidClaims[(l.birthYear+l.age)+':1'].amount===338.5,'second-child amount / currency credit');ok(!S.claim(l,1,1),'no duplicate subsidy');ok(!S.claim(l,2,1),'no declaration no second payment');l.country='US';l.educationRegion='TX';ok(!S.claim(l,2,1),'no subsidy outside NZ');
}
for(const region of ['Scotland','Wales','Northern Ireland','unknown']){const l=pupil('GB',region);l.city='unknown';ok(!S.en(l),'England only '+region);ok(!S.chooseLanguage(l,'fr'),'no England language rules elsewhere');}
{
 const l=pupil('GB','England',7),s=S.eng(l,true);s.school={languages:['la'],type:'public'};ok(S.chooseLanguage(l,'la'),'KS2 Latin');E.HOOKS.year.forEach(f=>f(l,()=>.5,noop));const latin=s.languages.la.level;ok(latin>0,'language grows annually');l.age=11;s.school.languages=['fr','la'];E.HOOKS.year.forEach(f=>f(l,()=>.5,noop));ok(s.enrolled.includes('fr')&&!s.enrolled.includes('la'),'KS3 modern language');ok(s.languages.la.level===latin,'Latin retained');
 s.enrolled=[];s.school.languages=['fr'];ok(!S.chooseLanguage(l,'es'),'one-language school');ok(S.chooseLanguage(l,'fr'),'available language');s.school.full=['de'];s.school.languages.push('de');ok(!S.chooseLanguage(l,'de'),'full class');s.school.full=[];s.school.clashes={de:'fr'};ok(!S.chooseLanguage(l,'de'),'language timetable clash');
 const before=JSON.stringify(l);S.gcseForecast(l);ok(JSON.stringify(l)===before,'forecast pure');
}
{
 const l=pupil(),s=S.eng(l,true);ok(S.select(l,'history'),'select history');ok(!S.select(l,'drama'),'same option block clash');ok(S.select(l,'geography')&&S.select(l,'art'),'other blocks');s.school={max:3,min:2};ok(!S.select(l,'media'),'school max');ok(S.electiveReason(l,'no')!=='Đã chọn','unknown language certificate independent');
 const before=JSON.stringify(l);E.DEC.schoolEngland829.make(l,()=>{throw Error('RNG in read');});ok(JSON.stringify(l)===before,'England menu pure');
}
{
 const l=pupil(),s=S.eng(l,true);s.chosen=['fr'];s.school={examSubjects:['math','lit','english']};ok(!S.register(l),'centre must offer every exam');s.school.examSubjects.push('fr');ok(S.register(l),'private/regular centre registration');ok(!S.register(l),'no second fee');const money=l.money;const forecast=S.gcseForecast(l),result=S.gcseSit(l);ok(result.length===4&&result.every(x=>x.grade>=0&&x.grade<=9),'GCSE scale');
 for(const r of result){const f=forecast.find(x=>x.subject===r.subject);ok(r.grade>=f.low&&r.grade<=f.high,'forecast/real parity '+r.subject);ok(S.gcseCalculate(r.inputs,r.raw.roomDraw).grade===r.grade,'same formula '+r.subject);}
 l.st.kno=0;ok(JSON.stringify(S.gcseSit(l))===JSON.stringify(result),'locked result after ability changes');ok(l.money===money,'no second fee on sit');const migrated=E.migrate(copy(l));ok(JSON.stringify(S.gcseSit(migrated))===JSON.stringify(result),'save/reload locked result');s.chosen.push('es');ok(S.examReason(l)!==true,'changed subjects invalidates entry');s.school.examSubjects.push('es');ok(S.register(l),'amend entry for new subject');const amended=S.gcseSit(l);ok(JSON.stringify(amended[0])===JSON.stringify(result[0]),'changing subject combination cannot reroll completed subject');
}
{
 const l=pupil();l.flags.study829={gcse:7,final:25,electives:['Lịch sử','Tiếng Pháp']};const before=JSON.stringify(l);const s=S.eng(l);ok(s.chosen.includes('history')&&s.chosen.includes('fr'),'legacy electives projected');ok(JSON.stringify(l)===before,'legacy projection read-only');S.eng(l,true);ok(l.flags.study829.gcse===7&&l.flags.study829.final===25,'legacy grades immutable');
}
{
 const l=pupil('GB','England',15),s=start(l);choose(l,'homeschool857','learn:math:self');ok(s.subjects.math>0,'real menu action learns');ok(!E.DEC.sixth829.valid(l),'old GCSE auto result cannot bypass homeschool exam');
 choose(l,'homeschool857','school:public');ok(s.status==='school','real reentry menu');
}
{
 const l=pupil('GB','England',16),s=start(l);ok(S.register(l)&&S.gcseSit(l),'homeschool external exam route');ok(E.DEC.sixth829.valid(l),'completed GCSE opens Sixth Form');const d=E.DEC.sixth829.make(l,()=>.5);E.DEC.sixth829.apply(l,d,'ib',()=>.5,noop);ok(l.school==='upper'&&s.status==='school'&&l.flags.study829.track==='ib','actual IB transition exits home route');
}
{
 const l=pupil('GB','England',40);l.kids=[{name:'Con thử nghiệm',born:30,alive:true,sex:'F',close:70}];const k=l.kids[0];E.UPDATE110.uid(l,k);const t=S.child(l,k.uid110,true);ok(t&&t.age===10,'co-resident guardian proxy');choose(l,'homeschool857','motive0',{kid:k.uid110});choose(l,'homeschool857','route:family',{kid:k.uid110,motive:'nhịp học'});for(const key of ['documents','plan','consulted','submit','start'])choose(l,'homeschool857',key,{kid:k.uid110});ok(k.study829.home.status==='active','guardian workflow persists on child');const old=l.money;choose(l,'homeschool857','learn:math:tutor',{kid:k.uid110});ok(k.study829.home.subjects.math>0&&l.money<old,'child progress and family costs');
 const next=E.heirAtAge(l,k,1);ok(next&&next.flags.study829.home.subjects.math===k.study829.home.subjects.math,'handoff preserves transcript');const restart=E.createLife(E.childOpts(l,k));ok(!restart.flags.study829?.home,'restart at birth has no future transcript');
}
{
 const l=pupil(),s=S.eng(l,true);s.chosen=['art'];start(l);ok(!S.register(l),'external centre without coursework support rejects art');choose(l,'gcse857','centreFull');ok(S.register(l)&&S.gcseSit(l).some(x=>x.subject==='art'),'supported coursework centre accepts actual subject');
}
console.log('PASS study-home857: '+checks+' checks');
