'use strict';
const assert=require('node:assert/strict');
const {gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,S=E.STORY971,F=E.FOOTBALL,M=E.FOLLOW919,X=E.UPDATE110;
const stable=()=>.5,quiet=()=>{},copy=o=>JSON.parse(JSON.stringify(o));

function life(seed, birth=2000){
  const l=E.createLife({mode:'world',country:'ES',year:birth,seed});
  Object.assign(l,{age:36,alive:true,indep:true,school:null,pending:[],sched:[],money:l.base*10});
  l.flags.military=0;
  l.st.hea=85;
  return l;
}
function choose(l,d,key){
  d.manual=true;
  l.pending=[d];
  const choice=d.opts.find(o=>X.menuKey(d,o.k)===key);
  assert(choice,key+' should be available in '+d.id);
  E.resolve(l,choice.k);
}
function family(seed,plan,track){
  const l=life(seed),k={name:'Lucía',sex:'F',alive:true,born:20,close:68,study:78,edu:0,kids:0};
  l.kids=[k];
  assert(S.onCrush(l,k,'talk',quiet));
  const q=S.relation(k);
  Object.assign(q,{phase:'pregnancy',due:17,reported:16});
  if(track==='university'){k.born=18;k.edu=3;k.path18=true;k.uniUntil=19;q.due=19;}
  if(track==='work'){k.born=18;k.edu=3;k.path18=true;k.job='ke_toan';k.jyrs=1;q.due=19;}
  if(plan)choose(l,E.DEC.teenFamily971.make(l,stable,{id:X.uid(l,k),token:q.token}),plan);
  return {l,k,q};
}
function advance(l){l.age++;E.ext.kidsYear(l,stable,quiet,l.age);}

// A funded schedule can preserve the year. Declining a plan only defers schooling when workload demands it.
{
  const supported=family(1,'together','university');
  const defaulted=family(1,null,'university');
  const cash=defaulted.l.money;
  defaulted.q.peer.alive=false;
  advance(supported.l);advance(defaulted.l);
  assert.equal(supported.k.edu,5,'a shared schedule preserves graduation');
  assert.equal(defaulted.k.edu,3,'high care load does not award the degree');
  assert.equal(defaulted.k.uniUntil,20,'the original graduation date moves one year');
  assert.equal(defaulted.q.care973.schedule.status,'paused');
  assert(supported.q.care973.schedule.child<defaulted.q.care973.schedule.child);
  assert.equal(defaulted.q.plan,'independent');
  assert.equal(defaulted.l.money,cash);
  assert.equal(defaulted.l.grand,1);
  assert.equal(defaulted.k.kids,1);
  const restored=copy(defaulted.l);E.migrateExt(restored);
  S.careYear(restored,restored.kids[0],quiet);
  assert.equal(restored.grand,1,'reload does not create a second baby');
  assert.equal(restored.kids[0].uniUntil,20,'reload does not extend the same school year twice');
  for(let t=0;t<3;t++)advance(restored);
  assert.equal(S.relation(restored.kids[0]).phase,'resolved','defaulted plan closes naturally');
  assert.equal(restored.kids[0].edu,5,'returns to the original degree rather than staying blocked');
}
{
  const {l,k,q}=family(2,'limited','work');
  q.peer.alive=false;
  l.money=0;
  const progress=k.jyrs;
  advance(l);
  assert.equal(q.care973.schedule.status,'reduced');
  assert.equal(k.jyrs,progress+.5,'reduced work slows accumulation of experience');
  assert.equal(q.care973.schedule.paid,0);
  assert.equal(q.care973.shortfall,true);
  assert(!k.uniUntil,'work scenario does not invent enrollment');
}
{
  const {l,k,q}=family(3,null,'school');
  q.peer.alive=false;
  const log=()=>{};
  l.flags.pace145={v:1,h:[]};
  S.teenYear(l,log);
  assert(l.pending.some(d=>d.id==='teenFamily971'));
  assert.equal(X.menuKey(l.pending[0],E.autoKey(l)),'independent','autoplay does not pledge support on the player’s behalf');
  l.pending=[];
  S.teenYear(l,log);
  assert(!l.pending.length);
  choose(l,E.DEC.child141.make(l,stable,{id:X.uid(l,k)}),'carePlan');
  assert(l.pending.some(d=>d.id==='teenFamily971'),'profile can reopen options before birth');
  advance(l);
  assert(!l.pending.some(d=>d.id==='teenFamily971'),'stale prompt is removed at birth');
  advance(l);
  assert(!k.path18,'a school pause delays the decision after secondary school');
  advance(l);
  assert(l.sched.some(d=>d.id==='con_18'),'the school decision returns when the schedule allows it');
}
{
  const {l,k,q}=family(4,null,'work');
  k.job=null;
  q.peer.alive=false;
  const course={learner:X.uid(l,k),status:'active',at:l.age-1,due:l.age+1,years:2,progress:1};
  E.EDUCATION170.courses(l).push(course);
  advance(l);
  E.EDUCATION170.courseYear(l,stable,quiet);
  assert.equal(q.care973.schedule.track,'course');
  assert.equal(course.progress,1);
  assert.equal(course.due,l.age+1,'the paused course keeps its remaining time');
}
{
  const {l,k,q}=family(5,'together','school');
  const cash=l.money;
  advance(l);
  const paid=q.care973.schedule.paid;
  assert(paid>0&&Math.abs(l.money-(cash-paid))<1e-7);
  assert.equal(q.care973.schedule.child+q.care973.schedule.otherParent+q.care973.schedule.helpers,100);
  S.careYear(l,k,quiet);
  assert(Math.abs(l.money-(cash-paid))<1e-7,'installment is paid once');
  assert(E.DEC.child141.make(l,stable,{id:X.uid(l,k)}).text.includes('Lịch chăm bé'));
}

function player(seed=80,birth=2000){
  const l=life(seed,birth);
  l.age=25;
  const f=F.init(l,stable);f.stage='pro';f.reputation=30;f.internationalRep=5;
  f.club=E.FOOTBALL_DATA.clubs.find(c=>c.country==='ES'&&c.tier===1).id;
  return {l,f};
}
function season(l,f,matches,tier=1){
  return {year:l.birthYear+l.age,club:f.club,stage:'pro',tier,matches};
}
function channel(l,app='youtube'){
  choose(l,E.DEC.social131.make(l,stable,{}),'create:'+app);
  return E.SOCIAL131.state(l).channels.find(c=>c.app===app);
}
const baseMatch={minutes:90,goals:0,assists:0,clean:0,rating:6};
const final={...baseMatch,goals:2,assists:1,rating:9,stage973:'final',featured973:true};
{
  const baseline=player(),scorer=player(),keeper=player(),bench=player(),lower=player();
  const common=season(baseline.l,baseline.f,[baseMatch]);
  const goal=season(scorer.l,scorer.f,[final]);
  const clean=season(keeper.l,keeper.f,[{...baseMatch,clean:1}]);
  const sub=season(bench.l,bench.f,[{...final,minutes:0}]);
  const low=season(lower.l,lower.f,[final],2);
  const commonGain=M.sport971(baseline.l,common), goalGain=M.sport971(scorer.l,goal);
  assert(goalGain>M.sport971(keeper.l,clean)&&clean.public973.gain>commonGain);
  assert(goalGain>M.sport971(lower.l,low),'actual division affects exposure');
  assert.equal(M.sport971(bench.l,sub),0);
  assert.equal(goal.public973.big,1);
  assert(goal.public973.points>F.seasonImpact973(season(scorer.l,scorer.f,[{...final,stage973:null,featured973:false}])).points);
  const saved=copy(scorer.l),savedSeason=copy(goal);E.migrateExt(saved);
  assert.equal(M.sport971(saved,savedSeason),0,'same season cannot add fame twice after reload');
  assert.equal(saved.fame,goalGain);
  const old=season(saved,F.peek(saved),[final]);old.public971=true;
  assert.equal(M.sport971(saved,old),0,'old seasons already credited retain their original fame');
}
{
  const {l,f}=player(), y=channel(l);
  const z=season(l,f,[final]);
  M.sport971(l,z);
  const fame=l.fame;
  M.channelsYear971(l);
  assert(y.followers>0&&M.channelAudience973(y).football===y.followers,'match exposure reaches an existing channel without posting');
  assert.equal(l.fame,fame,'passive follows never feed back into fame');
  const before=y.followers;M.channelsYear971(l);
  assert.equal(y.followers,before);
  const i=channel(l,'instagram');
  assert(M.channelAudience973(i).football>0,'already famous at account creation');
  E.SOCIAL131.publish(l,i,stable,quiet,E.SOCIAL131.formats(i)[0]);
  const sources=M.channelAudience973(i);
  assert(sources.content>0&&sources.football>0);
  assert.equal(M.publicReach971(l),fame,'new video fans do not count again as outside fame');
  assert.equal(Object.values(sources).reduce((a,b)=>a+b,0),i.followers);
  const panel=E.DEC.channel131.make(l,stable,{id:i.id}).text;
  assert(panel.includes('Từ bóng đá')&&panel.includes('Từ video đã đăng'));
  const restored=copy(l);E.migrateExt(restored);M.channelsYear971(restored);
  assert.equal(E.SOCIAL131.state(restored).channels.find(c=>c.app===i.app).followers,i.followers);
  i.followers=Math.floor(i.followers/2);
  assert.equal(Object.values(M.channelAudience973(i)).reduce((a,b)=>a+b,0),i.followers,'channel attrition does not inflate source sums');
  assert.equal(M.publicReach971(l),fame,'attrition does not send video fans back through outside recommendations');
}
{
  const {l,f}=player(81,1960);
  const c={app:'youtube',followers:120,engagement:20};
  E.SOCIAL131.state(l).channels.push(c);
  M.sport971(l,season(l,f,[final]));
  assert(l.fame>0);
  M.channelsYear971(l);
  assert.equal(c.followers,120,'no online followers before that platform exists');
  assert.equal(M.channelAudience973(c).unknown,120,'legacy followers are not invented as sports or video');
}
console.log('PASS 9.7.3: care schedules, school and course delay, work, legacy/reload, sports performance and follower sources.');
