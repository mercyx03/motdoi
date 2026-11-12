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
  while(l.age<c.due||c.stage==='filed'||c.stage==='nocontact'){l.age++;E.FIN920.divYear(l,()=>0,log);}
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
  pick(l,'ukApplication872','result');
  pick(l,'ukApplication872','enroll');
  assert.equal(l.school,'uni');
  assert.equal(l.schoolEnd,21);
  assert.equal(l.majorName,program.name);
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
console.log('PASS routes873: medical and legal admissions, football eligibility, prison divorce, fixed-term savings, dated home education, residence for naturalization, named courses, healthcare and official labour references');
