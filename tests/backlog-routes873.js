'use strict';
const assert=require('node:assert/strict');
const {gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E;
const log=()=>{};
function life(country,age=25){
  const l=E.createLife({mode:'world',country,seed:87391,year:2026-age});
  Object.assign(l,{age,alive:true,indep:true,school:null,edu:5,pending:[],sched:[],money:1000000,jailUntil:null});
  l.flags.military=0;
  return l;
}
function pick(l,id,key,arg){
  const rule=E.DEC[id],d=rule.make(l,()=>0,arg);
  const n=String(d.data.keys.indexOf(key));
  assert(d.opts.some(o=>o.k===n),id+' missing '+key);
  rule.apply(l,d,n,()=>0,log);
}
{
  const l=life('US'),S=E.EDUCATION54,P=S.professional873;
  S.state(l).graduated872=[{institution:'US_mit',school:'Massachusetts Institute of Technology',country:'US',started:18,finished:22,level:5,inPerson:true}];
  const testCost=l.money;
  pick(l,'professionalTests873','mcat');
  assert.equal(l.money,testCost-355);
  assert.equal(P.tests(l)[0].sections.length,4);
  const key='US_ucla:med',cfg=P.profiles[key];
  pick(l,'professional873','documents',{key});
  assert.match(P.reason(l,key,false),/PREview/);
  pick(l,'professionalTests873','preview');
  assert.equal(P.reason(l,key,false),null);
  assert.match(S.entryReason(l,S.schools.find(u=>u.id===cfg.school),{major:'med'}),/thư nhận học/);
  pick(l,'professional873','apply',{key});
  const q=P.state(l,key);
  assert.equal(q.pending.stage,'primary');
  assert.equal(l.school,null);
  assert.equal(l.money,testCost-355-105-180);
  l.age++;
  pick(l,'professional873','result',{key});
  assert.equal(q.pending.stage,'secondary');
  pick(l,'professional873','secondary',{key});
  assert.equal(l.money,testCost-355-105-180-125);
  pick(l,'professional873','result',{key});
  assert.equal(q.pending.stage,'interview');
  pick(l,'professional873','interview',{key});
  pick(l,'professional873','result',{key});
  assert(P.offer(l,key));
  assert.equal(l.school,null);
}
{
  const l=life('US');
  pick(l,'hls872','gre873');
  const test=E.EDUCATION54.hls872.state(l).tests[0];
  assert.equal(test.score,test.verbal+test.quantitative);
  assert(test.writing>=0&&test.writing<=6);
}
{
  let l=life('VN',27);
  E.FOOTBALL.init(l,()=>.5);
  const A=E.FOOTBALL_ASSOCIATION873;
  l.abroad={code:'FR',perm:true,since:21};
  assert.match(A.reason(l,'FR'),/quốc tịch/);
  l.flags.citizen=['FR'];
  assert.equal(A.reason(l,'FR'),null);
  assert(A.request(l,'FR'));
  assert(!A.review(l,log));
  l=E.migrate(JSON.parse(JSON.stringify(l)));
  l.age++;
  assert(A.review(l,log));
  assert.equal(E.FOOTBALL.peek(l).national.country,'FR');
  assert.equal(E.FOOTBALL.peek(l).national.caps,0);
}
{
  const l=life('VN',27),n=E.FOOTBALL.init(l,()=>.5).national;
  l.abroad={code:'FR',perm:true,since:21};
  l.flags.citizen=['FR'];
  n.caps=1;
  assert.match(E.FOOTBALL_ASSOCIATION873.reason(l,'FR'),/Bản lưu cũ/);
  n.appearances873=[{year:2024,age:25,official:true,senior:true,final:true,citizenships:['VN','FR']}];
  assert.match(E.FOOTBALL_ASSOCIATION873.reason(l,'FR'),/chưa đáp ứng/i);
}
{
  const l=life('GB');
  l.city='London';
  l.jailUntil=l.age+5;
  l.partner={name:'Alex',sex:'F',age:l.age,alive:true,status:'married',since:21};
  const before=l.money;
  E.FIN920.openCase(l,'me',true,true,log);
  const c=l.flags.fin920?.div || Object.values(l.flags).find(v=>v&&v.div?.id)?.div;
  assert.equal(c.route873,'england-wales');
  assert.equal(c.feeGBP873,628);
  assert.equal(l.money,before-628/G.CUR.CUR.GB.rate/G.CUR.priceLevel(G.W.BY.GB.gdp));
  for(let step=0;step<8&&c.stage!=='final-ready';step++){
    if(c.stage==='nocontact'){
      if((c.service874?.attempts||[]).length<2)pick(l,'divorceCase920','search874');
      else pick(l,'divorceCase920','dispense874');
    }
    l.age++;E.FIN920.divYear(l,()=>0,log);
  }
  assert(l.partner);
  assert.equal(c.stage,'final-ready');
  pick(l,'divorceCase920','final873');
  assert(l.partner);
  l.age++;
  E.FIN920.divYear(l,()=>0,log);
  assert.equal(c.stage,'granted');
  assert(!l.partner);
}
{
  const l=life('GB');
  l.base=2000;
  const cash=l.money;
  assert.equal(l.cur,'usd');
  pick(l,'bankTerm112','500:2:true',{bank:'nsi-growth'});
  const data=E.UPDATE110.peek(l),book=data.bankBooks[0];
  assert.equal(book.issue873,81);
  assert.equal(book.nominal873,500);
  assert.equal(book.principal,500/(G.CUR.CUR.GB.rate*G.CUR.priceLevel(G.W.BY.GB.gdp)));
  assert.equal(l.money,cash-book.principal);
  const locked=E.DEC.bank112.make(l,()=>0);
  assert(!locked.opts.some(o=>o.k===String(locked.data.keys.indexOf(book.id))));
  E.DEC.bank112.apply(l,locked,String(locked.data.keys.indexOf(book.id)),()=>0,log);
  assert.equal(l.money,cash-book.principal);
  assert.equal(data.bankBooks.length,1);
  l.age=book.due;
  pick(l,'bank112',book.id);
  assert(Math.abs(l.money-(cash-book.principal+book.principal*Math.pow(1.0507,2)))<0.01);
  assert.equal(data.bankBooks.length,0);
  pick(l,'bankTerm112','500:2:true',{bank:'nsi-growth'});
  const moved=data.bankBooks[0],principal=moved.principal;
  E.abroadConvert(l,2);
  assert.equal(moved.principal,principal*2);
  assert.equal(moved.nominal873,500);
}
{
  const l=life('US',14);
  Object.assign(l,{educationRegion:'PA',school:'lower',schoolEnd:18});
  const S=E.STUDY857;
  assert(S.request(l,'family','nhịp học'));
  const h=S.home(l);
  h.documents=h.plan=h.consulted=h.credential=true;
  assert(S.submit(l));
  assert(S.start(l));
  const id='portfolio và đánh giá cuối năm';
  pick(l,'homeschool857','report:'+id);
  assert.equal(l.pending[0].data.arg.filing873.period,2026);
  pick(l,'homeschool857','date:2026-12-31',l.pending[0].data.arg);
  assert.equal(h.filings873['2026:'+id].timing,'on-time');
  assert.equal(h.filings873['2026:'+id].deadline,'2027-06-30');
  const loaded=E.migrate(JSON.parse(JSON.stringify(l)));
  assert.equal(S.home(loaded).filings873['2026:'+id].date,'2026-12-31');
  assert(!S.logObligation(loaded,id,2026));
}
{
  const l=life('VN',25), hook=E.HOOKS.year.find(h=>h.toString().includes('trackResidence873'));
  l.abroad={code:'CA',arrived873:21,until:24,study:true};
  for(const age of [21,22]){
    l.age=age;
    hook(l,()=>0,log,age);
  }
  l.abroad.perm=true;
  for(const age of [23,24]){
    l.age=age;
    hook(l,()=>0,log,age);
  }
  l.age=25;
  assert(E.naturalization873(l,'CA',25).ok);
  assert(l.pending.some(d=>d.id==='nhap_quoc_tich'));
  delete l.flags.natAsk.CA;
  assert.equal(E.LIFE114.natWhy(l),true);
  l.abroad.natYears873[24]='gap';
  assert(!E.naturalization873(l,'CA',25).ok);
  assert.notEqual(E.LIFE114.natWhy(l),true);
  const d=E.DEC.nhap_quoc_tich.make(l,()=>0,{code:'CA'}), cash=l.money;
  E.DEC.nhap_quoc_tich.apply(l,d,'nop',()=>0,log);
  assert.equal(l.money,cash);
  assert(!E.isCitizenOf(l,'CA'));
}
{
  const l=life('GB',18),S=E.EDUCATION54;
  l.edu=3;
  l.examScore=30;
  S.open(l,()=>0);
  const u=S.schools.find(u=>u.id==='GB_ucl'),program=S.programs(u).find(p=>p.key==='major_it');
  assert.equal(program.name,'Computer Science BSc (G400)');
  const st=S.state(l);
  st.wishes=[{school:u.id,major:program.major,program:program.name}];
  const d=E.DEC.study_wishes54.make(l,()=>0);
  E.DEC.study_wishes54.apply(l,d,'submit',()=>0,log);
  const blocked=E.DEC.ukApplication872.make(l,()=>0);
  assert(!blocked.opts.some(o=>o.k===String(blocked.data.keys.indexOf('result'))));
  pick(l,'ukApplication872','tara874');
  pick(l,'undergraduateTests874','TARA');
  const tara=st.undergraduateTests874[0];
  assert.equal(tara.cycle,2027);
  assert(tara.writing&&tara.critical>=1&&tara.critical<=9&&tara.problem>=1&&tara.problem<=9);
  pick(l,'ukApplication872','result');
  pick(l,'ukApplication872','enroll');
  assert.equal(l.school,'uni');
  assert.equal(l.schoolEnd,21);
  assert.equal(l.majorName,program.name);
}
{
  const l=life('GB',20),st=E.EDUCATION54.state(l);
  st.ukApplication872={stage:'submitted',at:18,until:19,wishes:[]};
  pick(l,'undergraduateTests874','TARA');
  assert.equal(st.undergraduateTests874[0].cycle,l.birthYear+l.age+1);
}
{
  const D=E.COUNTRY_DEPTH_DATA;
  const entry=D.profiles.GB.labor.find(p=>p.name==='Working Time Regulations');
  assert.match(entry.note,/17 tuần/);
  assert.equal(D.sources[entry.source],'https://www.gov.uk/maximum-weekly-working-hours');
}
{
  const l=life('GB'),decision=E.DEC.qg_kham_benh;
  l.city='London';
  l.educationRegion='England';
  l.ill={n:'bệnh đang theo dõi',cure:0.4};
  let d=decision.make(l,()=>0);
  assert.match(d.text,/18 tuần/);
  assert.match(d.text,/nhs.uk/);
  l.educationRegion='Scotland';
  l.city='Edinburgh';
  d=decision.make(l,()=>0);
  assert.match(d.text,/NHS Scotland/);
  assert(!d.text.includes('18 tuần'));
}
{
  const l=life('US',18), S=E.EDUCATION54, u=S.schools.find(u=>u.id==='US_mit');
  l.edu=3;
  const w={school:u.id,major:'it',program:S.programs(u)[0].name};
  assert.match(S.entryReason(l,u,w),/SAT hoặc ACT/);
  pick(l,'undergraduateTests874','SAT');
  pick(l,'undergraduateTests874','ACT');
  const [sat,act]=S.state(l).undergraduateTests874;
  assert.equal(sat.score,sat.math+sat.readingWriting);
  assert.equal(act.score,Math.round((act.english+act.math+act.reading)/3));
  const loaded=E.migrate(JSON.parse(JSON.stringify(l)));
  assert.equal(S.entryReason(loaded,u,w),null);
  assert.deepEqual(JSON.parse(JSON.stringify(S.state(loaded).undergraduateTests874)),JSON.parse(JSON.stringify(S.state(l).undergraduateTests874)));
}
{
  let l=life('CA',14);
  Object.assign(l,{educationRegion:'QC',school:'lower',schoolEnd:18});
  const S=E.STUDY857, route=S.rule(l).routes[0].id;
  assert(S.request(l,route,'gia đình chuyển lịch'));
  const h=S.home(l);
  h.documents=h.plan=h.consulted=h.credential=true;
  pick(l,'homeschool857','qcWithdrawal874');
  pick(l,'homeschool857','qcDate:2026-12-15',l.pending[0].data.arg);
  assert.equal(h.qcWithdrawal874.last,'2026-12-15');
  assert(S.submit(l)&&S.start(l));
  const notice='thông báo hằng năm', plan='learning project';
  assert.equal(S.reportingDeadline873(l,notice,2026).due,'2026-12-25');
  assert.equal(S.reportingDeadline873(l,plan,2026).due,'2027-01-14');
  pick(l,'homeschool857','report:'+notice);
  pick(l,'homeschool857','date:2026-12-25',l.pending[0].data.arg);
  assert.equal(h.filings873['2026:'+notice].timing,'on-time');
  l=E.migrate(JSON.parse(JSON.stringify(l)));
  l.age++;
  pick(l,'homeschool857','overdue:'+plan);
  pick(l,'homeschool857','date:2027-01-14',l.pending[0].data.arg);
  assert.equal(S.home(l).filings873['2026:'+plan].timing,'on-time');
  assert(!S.logObligation(l,plan,2026,'2027-01-15'));
}
{
  const A=E.FOOTBALL_ASSOCIATION873, parent=life('FR',30);
  parent.sex='F';
  parent.abroad={code:'VN',perm:true,arrived873:20};
  const child={name:'An',sex:'M',born:30,alive:true,birthContext108:'partner'};
  parent.kids=[child];
  A.recordBirth(parent,child,{sex:'M'});
  const heir=E.createLife(E.childOpts(parent,child));
  heir.age=25;heir.alive=true;heir.school=null;heir.indep=true;
  E.FOOTBALL.init(heir,()=>.5);
  assert.equal(heir.country,'VN');
  assert.equal(A.birthLink(heir,'FR'),'nơi sinh của cha hoặc mẹ ruột');
  assert.match(A.reason(heir,'FR'),/quốc tịch/);
  heir.flags.citizen=['FR'];
  assert.equal(A.reason(heir,'FR'),null);
  const adopted={name:'Bình',adopted:true,birthContext108:'adopt'};
  A.recordBirth(parent,adopted,{sex:'M'});
  assert.equal(adopted.footballBirth874,undefined);
  heir.sex='F';
  const grandchild={birthContext108:'partner'};
  A.recordBirth(heir,grandchild,{sex:'M'});
  assert(grandchild.footballBirth874.ancestors.some(a=>a.country==='FR'&&a.degree===2));
}
{
  const l=life('GB');
  l.educationRegion='England';
  l.jailUntil=l.age+9;
  l.partner={name:'Alex',sex:'F',age:25,alive:true,status:'married'};
  E.FIN920.openCase(l,'me',false,false,log);
  const c=Object.values(l.flags).find(v=>v&&v.div?.id).div;
  c.stage='nocontact';
  c.notice=true;
  l.age++;
  E.FIN920.divYear(l,()=>0,log);
  assert.equal(c.stage,'nocontact');
  const d=E.DEC.divorceCase920.make(l,()=>0);
  assert(!d.opts.some(o=>o.k===String(d.data.keys.indexOf('dispense874'))));
  pick(l,'divorceCase920','search874');
  l.age++;
  pick(l,'divorceCase920','search874');
  pick(l,'divorceCase920','dispense874');
  assert.equal(c.stage,'service-review');
  E.FIN920.divYear(l,()=>0,log);
  assert.equal(c.stage,'service-review');
  l.age++;
  E.FIN920.divYear(l,()=>0,log);
  assert.equal(c.service874.granted,l.age);
  assert.equal(c.stage,'filed');
  assert(l.partner);
}
{
  const l=life('GB');
  l.partner={name:'Alex',sex:l.sex==='F'?'M':'F',age:25,alive:true,status:'married',since:20};
  E.RELATIONS108.plan(l).want=0;
  E.RELATIONS108.plan(l).chosenWant874=true;
  assert.equal(E.DEC.kid.auto(l,{data:{adopt:true}},()=>0),'no');
  E.RELATIONS108.plan(l).want=1;
  l.flags.wantKids=0;
  assert.equal(E.DEC.kid.auto(l,{data:{adopt:false}},()=>0),'yes');
  l.kids.push({name:'An',born:l.age-4});
  assert.equal(E.DEC.kid.auto(l,{data:{adopt:false}},()=>0),'no');
}
{
  const l=life('GB'), cap=E.difficulty(l).cap;
  l.partner={name:'Alex',sex:l.sex==='F'?'M':'F',age:25,alive:true,status:'married',since:20};
  l.sched=Array.from({length:cap},(_,i)=>{
    const id='fixtureKidQueue874_'+i;
    E.DEC[id]={make:()=>({id,title:'Việc đã hẹn',text:'Đến lịch hẹn',opts:[]})};
    return {id,at:l.age};
  });
  E.beginYear(l,{auto:true});
  assert.equal(l.pending.length,cap);
  assert.equal(l.flags.kidAskAt,undefined);
  for(const d of l.pending)delete E.DEC[d.id];
}

// 8.10.76: ly hôn khi thụ án ở Scotland và Bắc Ireland
for(const [city,route] of [['Glasgow','scotland'],['Belfast','ni']]){
  const l=life('GB');l.city=city;l.place=city;l.jailUntil=l.age+8;
  assert.equal(E.FIN920.route873(l),route,city+' route');
  l.partner={name:'Sam',sex:'F',age:l.age,alive:true,status:'married',since:l.age-1};
  const st=()=>Object.values(l.flags).find(v=>v&&v.div&&v.div.id)?.div;
  E.FIN920.divYear(l,()=>.9,log);
  E.FIN920.openCase(l,'me',true,true,log);
  assert(!st(),route+': blocked before separation/marriage period');
  if(route==='ni')assert.match(E.FIN920.routeBlock874(l,route,true),/hai năm đầu|2 năm đầu/);
  l.age+=route==='ni'?2:1;E.FIN920.divYear(l,()=>.9,log);
  assert.equal(E.FIN920.routeBlock874(l,route,true),null,route+' mutual allowed after required separation');
  assert.match(E.FIN920.routeBlock874(l,route,false)||'',/không có đồng ý/);
  E.FIN920.openCase(l,'me',true,true,log);const c=st();assert(c&&c.route873===route);
  for(let i=0;i<4&&l.partner&&l.partner.status==='married';i++){l.age++;E.FIN920.divYear(l,()=>.9,log);}
  assert(!l.partner||l.partner.status!=='married',route+' divorce granted');
  if(route==='scotland')assert.equal(c.procedure874,'simplified');
}

// 8.10.76: bốn liên đoàn trong Vương quốc Anh
{
  const l=life('VN',27),A=E.FOOTBALL_ASSOCIATION873;E.FOOTBALL.init(l,()=>.5);
  l.flags.citizen=['GB'];
  assert.match(A.reason(l,'GB'),/liên đoàn trong Vương quốc Anh|5 năm học/);
  l.flags.ukEdu874={Scotland:5};
  assert.equal(A.reason(l,'GB'),null);
  assert(A.request(l,'GB'));l.age++;assert(A.review(l,log));
  assert.match(A.ukTeam874(l),/Scotland/);
  l.flags.footballBirth874={country:'VN',ancestors:[{country:'GB',degree:2,region:'Wales'}]};
  const d=E.DEC.footballAssociation873.make(l,()=>.5);
  assert(d.data.keys.includes('uk:Wales'),'grandparent born in Wales offers FAW');
  E.DEC.footballAssociation873.apply(l,d,String(d.data.keys.indexOf('uk:Wales')),()=>.5,log);
  assert.match(A.ukTeam874(l),/Wales/);
}

// 8.10.76: Johns Hopkins MD và Yale J.D.
{
  const l=life('US'),S=E.EDUCATION54,P=S.professional873;
  assert(S.schools.some(u=>u.id==='US_jhu')&&S.schools.some(u=>u.id==='US_yale'));
  assert.equal(P.profiles['US_jhu:med'].fee,100);assert.equal(P.profiles['US_yale:law'].fee,85);
  assert.match(P.profiles['US_yale:law'].source,/bulletin\.yale\.edu/);
  S.state(l).graduated872=[];l.edu=3;
  assert(P.reason(l,'US_jhu:med',false),'needs a bachelor degree first');
}
console.log('PASS routes873: medical and legal admissions, football eligibility, prison divorce, fixed-term savings, dated home education, residence for naturalization, named courses, entrance tests, Québec withdrawal, family birthplace and official references');
