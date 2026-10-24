const fs=require('fs'),vm=require('vm'),assert=require('assert');
for(const [,f]of fs.readFileSync('public/index.html','utf8').matchAll(/<script src="(js\/[^"?]+)\?v=[^"]+"[^>]*><\/script>/g))if(!['js/app.js','js/music.js','js/card.js','js/account.js'].includes(f))vm.runInThisContext(fs.readFileSync('public/'+f,'utf8'));
const E=G.E,X=E.ESPORTS,F=X.finance,D=X.data;let n=0;function ok(x,t){assert.ok(x,t);n++;}
function life(age=20){const l=E.createLife({mode:'vn',seed:560});l.age=age;l.alive=true;l.school=null;l.indep=true;l.retired=false;l.money=100;l.skill=80;l.st.kno=80;l.st.soc=70;l.pending=[];l.sched=[];l.partner=null;l.kids=[];l.job=null;return l;}
function choose(l,id,k,arg,r=()=>.5){const d=E.DEC[id].make(l,r,arg);E.DEC[id].apply(l,d,k,r,()=>{});return d;}
function professional(g='lol',region='LCP'){const l=life();l.game=D.games[g].name;E.startJob(l,'tuyen_thu_es',()=>.5,()=>{});const s=X.init(l,()=>.5);s.league=region;s.stage='pro';s.team=g==='tft'?null:D.leagues.find(x=>x.id===region).teams.find(x=>!x.guest).id;E.esportsContract(l,s,()=>.5);return l;}
const expected={LCK:10,LPL:14,LEC:12,LCS:8,CBLOL:8,LCP:8,'VCT-Americas':12,'VCT-EMEA':12,'VCT-Pacific':12,'VCT-CN':12,AOG:10,RPL:9,GCS:7,ACS:8,'TFT-AMER':9,'TFT-EMEA':9,'TFT-APAC':10,'TFT-CN':12,'VCT-Americas-Challengers':4,'VCT-EMEA-Challengers':4,'VCT-Pacific-Challengers':4,'VCT-CN-Challengers':2};
for(const x of D.leagues){ok(x.teams.length===expected[x.id],'league size '+x.id);ok(new Set(x.teams.map(t=>t.id)).size===x.teams.length,'team IDs unique');for(const t of x.teams){ok(t.players.length>=(x.individual?1:5),'roster complete '+t.name);ok(t.players.length===new Set(t.players).size,'no duplicate player '+t.name);}}
ok(D.leagues.filter(x=>x.game==='lol').flatMap(x=>x.teams).filter(x=>x.guest).length===2,'LEC Versus guests distinct');
for(const [c,g,r]of [['VN','lol','LCP'],['KR','lol','LCK'],['CN','lol','LPL'],['US','lol','LCS'],['CA','lol','LCS'],['BR','lol','CBLOL'],['FR','lol','LEC'],['VN','val','VCT-Pacific'],['CN','val','VCT-CN'],['BR','val','VCT-Americas'],['TH','aov','RPL'],['TW','aov','GCS'],['ID','aov','ACS'],['VN','tft','TFT-APAC']]){const l=life();l.flags.esBirthCountry=c;ok(X.region(l,g)===r,'birth routing '+c+g);l.abroad={code:'US',perm:true};ok(X.region(l,g)===r,'emigration preserves birth routing');}
{
 const l=life();ok(E.HOME_GAMES.other.includes('Nghịch Thủy Hàn')&&E.HOME_GAMES.other.includes(D.games.tft.name),'two casual games');
 for(const [g,prices]of [['Nghịch Thủy Hàn',[1]],[D.games.tft.name,[2.5,2.5,7]]]){
  ok(E.GAME_SHOP[g].map(x=>x[1]).join()===prices.join(),'specified prices');l.flags.homeGames=[g];
  for(let i=0;i<prices.length;i++){let before=l.money,d=choose(l,'nap_game','buy'+i,{g});ok(d.opts.some(x=>x.k==='buy'+i),'shop tier visible');ok(Math.abs(before-l.money-prices[i])<1e-8,'charged exactly once');}
 }
 l.game='Nghịch Thủy Hàn';E.startJob(l,'tuyen_thu_es',()=>.5,()=>{});ok(!l.job,'no pro NTH');
 l.flags.homeGames=[];ok(!E.DEC.es_try.make(l,()=>.5).opts.some(x=>x.k==='tft'),'must play chosen game before trial');
}
{
 const l=life(),r=()=>.5;l.pending=[E.DEC.es_watch.make(l,r)];E.resolve(l,'lol');ok(l.pending[0].id==='es_watch_league','watch game');E.resolve(l,'LCK');const t=D.leagues.find(x=>x.id==='LCK').teams.find(t=>t.name==='T1');E.resolve(l,t.id);ok(l.pending[0].opts.some(x=>x.l==='Faker'),'choose actual team player');E.resolve(l,'2');ok(!l.pending[0].opts.some(x=>x.k==='arena'),'no foreign arena without trip');const before=l.money;E.resolve(l,'online');ok(l.flags.esSupport.player==='Faker'&&l.money===before,'free online supports selected player');
 const d=E.DEC.es_watch_confirm.make(l,r,{league:'LCK',team:t.id,at:l.age});l.age++;ok(!E.DEC.es_watch_confirm.valid(l,d.data),'old watch invalid');
 l.jailUntil=30;ok(!E.DEC.es_watch.valid(l),'no watching while jailed');
}
{
 let l=professional();const s=l.flags.esports;ok(s.retire>=26&&s.retire<=29,'career retirement under 30');s.reflex=80;s.experience=10;s.peak=21;l.age=25;X.annual(l,()=>.5,()=>{},'work');ok(s.reflex<80&&s.experience>10,'reflex declines while experience grows');let a=s.reflex;X.annual(l,()=>.5,()=>{},'work');ok(s.reflex===a,'aging once each year');
 const old={at:25,token:'old'};ok(!E.DEC.es_match.valid(l,old),'invalid stale season');
 l=life();l.game=D.games.lol.name;l.skill=100;E.startJob(l,'tuyen_thu_es',()=>.5,()=>{});ok(l.job.rank===0&&l.flags.esports.stage==='academy','high skill does not skip academy');
 choose(l,'es_season','play',null,()=>.1);ok(l.pending[0].id==='es_recruit','scouting after strong tryout');const d=l.pending.shift();E.DEC.es_recruit.apply(l,d,d.opts[0].k,()=>.5,()=>{});ok(l.flags.esports.stage==='pro'&&F.house(l),'team recruits with housing');ok(l.flags.esports.season.done,'no entire season retroactively after recruitment');
 l.pending=[];const before=l.money;E.DEC.es_recruit.apply(l,d,d.opts[0].k,()=>.5,()=>{});ok(l.money===before,'replaying recruitment cannot add money');
}
{
 const l=professional(),s=l.flags.esports;s.season={results:{},pointsRank:999};
 for(const id of ['fst','msi','ewc','worlds'])ok(!X.qualified(s,id),'no automatic international '+id);
 s.season.results.split1={place:2};ok(!X.qualified(s,'fst'),'LCP only first to FST');s.league='LCK';ok(X.qualified(s,'fst'),'LCK second qualifies FST');s.league='CBLOL';s.season.results.split2={place:2};ok(!X.qualified(s,'msi'),'CBLOL single MSI seed');
 s.league='LCP';ok(X.qualified(s,'msi'),'LCP second MSI seed');s.season.results.split3={place:5};s.season.results.msi={place:1};ok(X.qualified(s,'worlds'),'MSI champ retains invite with home playoffs');s.season.results.split3.place=7;ok(!X.qualified(s,'worlds'),'MSI invite still needs home playoffs');
 const v=professional('val','VCT-Pacific').flags.esports;v.season={results:{stage2:{place:3}},pointsRank:3};ok(!X.qualified(v,'champions'),'third stage2 no auto slot');v.season.pointsRank=2;ok(X.qualified(v,'champions'),'Champions points route');
}
{
 const l=professional(),s=l.flags.esports;let f={food:l.base*.45,rent:l.base*.12};E.esportsLiving(l,f,l.base,1,()=>{});ok(f.food===0&&f.rent===0&&f.gamingHouse,'personal basics covered');
 l.partner={alive:true,status:'married'};f={food:l.base*.8,rent:l.base*.12};E.esportsLiving(l,f,l.base,1,()=>{});ok(f.food>0&&f.rent>0,'family home not free through player contract');
 l.job=null;ok(!F.house(l),'housing stops when job ends');
 const t=professional('tft','TFT-APAC');ok(!F.house(t)&&F.gross(t)===0,'independent TFT no invented employer or salary');t.flags.esports.sponsor='RRQ';delete t.flags.esports.contract;E.esportsContract(t,t.flags.esports,()=>.5);ok(F.house(t)&&F.gross(t)>0,'sponsored TFT contract');
 const k=professional('lol','LEC');ok(F.gross(k)>=F.usd(k,60000/.92),'LEC contract meets full-season minimum baseline');
 const w=professional();w.cur='USD';w.gdp=60;ok(Math.abs(F.usd(w,1000)*G.CUR.priceLevel(w.gdp)-1000)<1e-7,'nominal USD converts once, not PPP wage scaling');
}
{
 const l=professional(),s=l.flags.esports;s.season={results:{}};const ev={id:'worlds',name:'Worlds',intl:true};const b=l.money;E.esportsAward(l,ev,1,()=>.5,()=>{});ok(Math.abs(l.money-b-F.usd(l,120000))<1e-7,'actual team prize and simulated 12% personal contract');E.esportsAward(l,ev,1,()=>.5,()=>{});ok(Math.abs(l.money-b-F.usd(l,120000))<1e-7,'no duplicate prize');
 ok(F.prize(l,{id:'split1'},1,()=>.5).total===26400,'LCP split actual award');s.league='LCK';ok(F.prize(l,{id:'split1'},1,()=>.5).total===0,'no discontinued LCK split purse');
 const t=professional('tft','TFT-APAC');ok(F.prize(t,{id:'crown'},2,()=>.5).total===50000,'do not apply real player penalty to fictional runner-up');ok(F.tables.crown.reduce((a,b)=>a+b,0)===470000,'TFT total pool reconciles');
}
for(const x of D.leagues.filter(x=>!x.challengers)){
 const l=professional(x.game,x.id),s=l.flags.esports;s.reflex=80;s.experience=50;s.form=70;l.pending=[E.DEC.es_season.make(l,()=>.5)];let steps=0;
 while(l.pending.length&&steps++<20){const d=l.pending[0];ok(d.opts.length>0,'event has choices '+x.id);E.resolve(l,d.opts.find(o=>o.k!=='close').k);}
 ok(steps<=10&&s.season.done,'compact full season '+x.id);ok(Number.isFinite(l.money)&&s.history.length<=8,'finite money, bounded events '+x.id);ok(Object.keys(s.season.results).length===s.history.length,'single result per event');
 const copy=E.migrate(JSON.parse(JSON.stringify(l)));ok(copy.flags.esports.season.done,'save migration preserves completed season');
 l.age=s.retire;E.careerYear(l,()=>.5,()=>{},'balance');ok(!X.managed(l)&&l.alive,'retirement transitions, not death '+x.id);
}
{
 const l=life();l.talent='âm nhạc';l.game='Valorant';l.skill=99;l.flags.homeGames=['Valorant'];ok(X.practiceSkill(l,'Valorant')===20,'music skill is not gaming skill');for(let i=0;i<30;i++)E.esportsPractice(l,'Valorant',false);ok(X.practiceSkill(l,'Valorant')===32,'practice gains capped per game per year');l.age++;E.esportsPractice(l,'Valorant',false);ok(X.practiceSkill(l,'Valorant')===34,'new year practice budget');
 const old=professional();delete old.flags.esports;delete old.job.esCareerKey;old.job.yrs=5;old.job.rank=2;E.migrateExt(old);ok(old.flags.esports.stage==='pro'&&old.job.rank===2&&old.flags.esports.experience===30,'existing professional save stays professional');
 const fixed=professional();ok(!E.DEC.es_hop_dong_doi.valid(fixed),'old low-pay contract cannot contradict league contract');
 const t=professional('tft','TFT-APAC');ok(!E.pensionPolicy(t).covered,'independent TFT no automatic employment pension');
 const stress=professional(),calm=JSON.parse(JSON.stringify(stress));stress.mind.stress=100;calm.mind.stress=0;X.annual(stress,()=>.5,()=>{},'work');X.annual(calm,()=>.5,()=>{},'work');ok(stress.flags.esports.form<calm.flags.esports.form,'stress affects form');
}
console.log('V5.6.0: '+n+' esports checks passed');
