'use strict';
const assert=require('assert'),{gameContext}=require('./hardcore-isolation'),G=gameContext(),F=G.FANTASY,D=F.data;let checks=0;
function ok(x,m){checks++;assert(x,m);}function copy(l){return JSON.parse(JSON.stringify(l));}function adult(path){const l=F.create({seed:820001});l.age=30;l.pending=null;l.ap=1000;l.points=10000;l.level=60;l.hp=F.stats(l).hp;l.mp=F.stats(l).mp;Object.keys(l.paths).forEach(k=>l.paths[k]=100);if(path)ok(F.selectPath(l,path),'choose path '+path);return l;}
for(const path of ['kiem','phap','hac']){const l=adult(path);ok(!F.selectPath(l,path==='kiem'?'phap':'kiem'),'one path per life');for(const other of ['kiem','phap','hac'].filter(x=>x!==path)){let before=JSON.stringify(l);ok(!F.train(l,other,'basic')&&JSON.stringify(l)===before,'off-class practice rejected');ok(!F.learn(l,other+'_1')&&JSON.stringify(l)===before,'off-class learning rejected');}
for(const shared of ['ren','duoc'])ok(F.learn(l,shared+'_1'),'shared craft available '+shared);for(const s of D.skills.filter(x=>x.path===path)){ok(F.learn(l,s.id),'learn '+s.id);const first=F.skillBaseDamage(l,s);for(let level=2;level<=10;level++){const before=l.points;ok(F.learn(l,s.id)&&F.skillLevel(l,s.id)===level,'upgrade '+s.id+' to '+level);ok(l.points===before-(2+level-1),'upgrade spends stated points');ok(Math.abs(F.skillBaseDamage(l,s)/first-(1+(level-1)*.12))<1e-10,'damage follows 12 percentage points per rank');}let before=JSON.stringify(l);ok(!F.learn(l,s.id)&&JSON.stringify(l)===before,'skill cap enforced');}
ok(F.migrate(copy(l)),'leveled path save reloads');}
let child=adult();child.age=5;ok(!F.selectPath(child,'kiem'),'no infant combat commitment');child.age=6;ok(!F.selectPath(child,'hac'),'dark path gated until 16');ok(F.selectPath(child,'phap'),'ordinary path at six');
let noPoints=adult('kiem');F.learn(noPoints,'kiem_1');noPoints.points=0;let before=JSON.stringify(noPoints);ok(!F.learn(noPoints,'kiem_1')&&JSON.stringify(noPoints)===before,'no free upgrades');
let old=adult();delete old.combatPath;delete old.skillLevels;old.skills=['phap_1'];old.paths.phap=100;old.paths.kiem=10;old.paths.hac=0;const rng=old.rs;ok(F.migrate(old)&&old.combatPath===null&&old.skillLevels.phap_1===1&&old.rs===rng,'legacy skills retained and path left for player to choose without RNG');let bad=copy(old);bad.skillLevels.phap_1=11;ok(F.migrate(bad)===null,'invalid skill rank rejected');bad=copy(old);bad.skillLevels='broken';ok(F.migrate(bad)===null,'invalid skill-level map rejected safely');
let stuck=adult();stuck.seen.fear=stuck.age;stuck.pending={id:'fear',opts:[]};ok(F.migrate(stuck)&&!stuck.pending,'resolved old prompt removed on migration');
let a=adult('phap');F.learn(a,'phap_1');a.location='dong_co';ok(F.hunt(a),'combat starts');a.battle.hp=a.battle.maxHP=100000;a.battle.attack=1;a.battle.armor=0;let b=copy(a);b.skillLevels.phap_1=5;const firstHP=a.battle.hp;F.fight(a,'phap_1');F.fight(b,'phap_1');ok(firstHP-b.battle.hp>firstHP-a.battle.hp,'skill rank changes actual combat damage');b.combatPath='kiem';before=JSON.stringify(b);ok(!F.fight(b,'phap_1')&&JSON.stringify(b)===before,'legacy off-class spell unusable without consuming turn');
let news=adult('kiem');const p=news.politics,my=F.politics.mine(news),target=D.regions.find(r=>news.world.owners[r.index]!==my&&F.politics.reachable(news,r.id,my));if(target){const defender=news.world.owners[target.index];ok(F.politics.startWar(news,my,defender,target.id,'tranh nguồn nước',false),'external front starts');ok(news.news.some(x=>/chiến sự/.test(x.text)),'war creates persistent news');}ok(F.migrate(copy(news)).news.length===news.news.length,'news survives reload');
// Topic cooldown stops repeated-looking options despite different imported motif IDs.
let repeated=0;for(let seed=0;seed<50;seed++){let x=F.create({seed:83000+seed});for(let y=0;y<90&&x.alive;y++){if(x.pending){let topic=x.pending.topic;if(topic&&x.seen['topic:'+topic]!=null&&x.age-x.seen['topic:'+topic]<6)repeated++;let o=x.pending.opts.find(o=>!o.disabled);ok(F.choose(x,o.k),'choice resolves once');before=JSON.stringify(x);ok(!F.choose(x,o.k)&&JSON.stringify(x)===before,'same option cannot resolve twice');}ok(F.advance(x),'time advances after decision');}}ok(repeated===0,'no recurring imported topic within six years');
// Unlimited hunting, local services and academy are exercised through real state.
let farmer=adult('kiem');farmer.location='dong_co';farmer.ap=0;
ok(F.hunt(farmer)&&farmer.ap===0,'hunt starts with zero annual actions');
farmer.battle.hp=1;farmer.battle.attack=1;F.fight(farmer,'attack');
ok(!farmer.battle&&farmer.ap===0,'winning a hunt does not consume annual actions');
ok(F.hunt(farmer,true)&&farmer.ap===0,'boss hunting also works at zero actions');
farmer.battle=null;farmer.location='lang';farmer.gold=10000;farmer.hp=1;farmer.mp=0;farmer.fatigue=90;
ok(F.healAtNPC(farmer)&&farmer.fatigue===0&&farmer.ap===0&&farmer.hp===F.stats(farmer).hp,'paid recovery supports repeated farming');
ok(F.trade(farmer,'thuoc',1,'buy')&&farmer.ap===0,'local shop works at zero actions');
before=JSON.stringify(farmer);ok(!F.trade(farmer,'hac',1,'buy')&&JSON.stringify(farmer)===before,'village cannot sell items outside its stock');
let map=adult('kiem');map.location='thanh_do';map.ap=10;map.age=12;
ok(F.travelInfo(map,'ben_nuoc').ok&&F.travel(map,'ben_nuoc'),'river port reachable by escorted settlement road');
ok(F.services(map).healer&&F.trade(map,'mana',1,'buy')===false,'port has healer but still requires actual money');
map.gold=10000;ok(F.trade(map,'mana',1,'buy'),'river port sells mana medicine');
map.location='lang';map.age=30;map.ap=100;
for(const region of D.regions){const info=F.travelInfo(map,region.id),state=copy(map),result=F.travel(state,region.id);ok(Boolean(result)===info.ok,'map and engine agree for '+region.id);}
let smith=adult('kiem');smith.location='lang';smith.gold=10000;smith.ap=0;smith.bag.quang=1000;smith.bag.go=100;
const localGear=F.shopGear(smith).find(e=>e.region==='lang'&&e.path==='kiem');
ok(localGear&&F.buyGear(smith,localGear.id)&&smith.ap===0,'buy regional equipment without learning actions');
ok(!F.shopGear(smith).some(e=>e.region&&e.region!=='lang'),'foreign map gear absent from village stock');
for(let level=1;level<=10;level++)ok(F.smith(smith,'weapon')&&smith.gear.weapon===level,'smith upgrades to '+level);
before=JSON.stringify(smith);ok(!F.smith(smith,'weapon')&&JSON.stringify(smith)===before,'smith cap and failed mutation enforced');
for(const path of ['kiem','phap','hac','ren','duoc']){let student=adult(['ren','duoc'].includes(path)?'kiem':path);student.location='truong';student.gold=10000;student.fatigue=0;const c=D.courses.find(x=>x.id===path),ap=student.ap;
ok(F.enroll(student,path)&&student.ap===ap-1,'enrollment costs one learning action '+path);
for(let i=0;i<5;i++)ok(F.attend(student,path),'academy lesson '+path+':'+i);
ok(student.skills.includes(c.skill)&&student.academy.courses[path]===6,'graduation grants actual technique '+path);
for(const type of ['minds','passives'])for(let level=1;level<=10;level++){const body=student.body,spirit=student.spirit,ap=student.ap;ok(F.practicePassive(student,type+':'+path)&&student.ap===ap-1&&student.body+student.spirit>body+spirit,'passive raises base stat '+path+':'+level);}
before=JSON.stringify(student);ok(!F.practicePassive(student,'minds:'+path)&&JSON.stringify(student)===before,'mind cap at ten');
const reload=F.migrate(copy(student));ok(reload&&JSON.stringify(reload)===JSON.stringify(student),'academy save round trips without reapplying stats');
}
let blocked=adult('kiem');blocked.location='truong';blocked.gold=10000;before=JSON.stringify(blocked);ok(!F.enroll(blocked,'phap')&&JSON.stringify(blocked)===before,'academy cannot bypass chosen combat path');
let uncapped=adult('phap');uncapped.level=40;uncapped.xp=F.spiritNeeded(uncapped)+2000;ok(F.breakthrough(uncapped)&&uncapped.level===41&&uncapped.xp===2000&&F.migrate(copy(uncapped)),'explicit breakthrough grows past level forty and preserves overflow');
let artisan=adult('kiem');artisan.location='lang';artisan.gold=1000;artisan.skills.push('ren_1','duoc_1');artisan.skillLevels.ren_1=10;artisan.skillLevels.duoc_1=10;artisan.bag.quang=100;artisan.bag.go=100;artisan.bag.thao=100;
ok(F.craft(artisan,'weapon')&&artisan.gear.weapon===4,'level ten smith skill improves real crafting');const potions=artisan.bag.thuoc;ok(F.craft(artisan,'thuoc')&&artisan.bag.thuoc===potions+4,'level ten herbal skill crafts four potions');
ok(F.localNPCs(artisan).every(n=>['nông dân','thợ bánh','thợ mộc','người chăn cừu'].includes(n.role)),'village NPCs match local occupations');artisan.location='mo_dong';ok(F.localNPCs(artisan).every(n=>['thợ mỏ','thợ rèn','vệ binh'].includes(n.role)),'mine has miners, smiths and guards');ok(F.talk(artisan,'help')&&artisan.log.at(-1).t.includes('Mỏ Đồng Đỏ'),'NPC dialogue identifies current map');
const stories=F.events.filter(e=>e.local);ok(stories.length===76,'36 authored situations plus 40 regional variants');
for(const e of stories)for(let i=0;i<e.choices.length;i++){let life=adult('kiem');life.age=e.min;life.pending={id:e.id,opts:e.choices.map((c,k)=>({k:String(k),n:c.n}))};ok(F.choose(life,String(i))&&!life.pending,'new choice executes '+e.id+':'+i);}
for(let seed=0;seed<30;seed++){let life=F.create({seed:91000+seed}),seen=new Set();for(let year=0;year<12;year++){if(life.pending){ok(!seen.has(life.pending.id),'early stories never repeat before twelve');seen.add(life.pending.id);F.choose(life,'0');}F.advance(life);}}
function novice(){let x=F.create({seed:93001,origin:'dan'});x.age=16;x.pending=null;x.ap=100;x.gold=10000;x.location='lang';return x;}
let spirit=novice();ok(F.spiritRate(spirit).base===10&&F.spiritRate(spirit).total===10&&F.spiritNeeded(spirit)===100,'initial rate 10/s, first threshold 100');
F.absorb(spirit,5);F.absorb(spirit,5);F.absorb(spirit,1);ok(spirit.xp===110&&spirit.level===1,'seconds accumulate power without an automatic level or overflow clamp');
ok(F.breakthrough(spirit)&&spirit.xp===10&&spirit.level===2&&F.spiritNeeded(spirit)>100,'110 minus 100 leaves exactly ten for next stage');
before=JSON.stringify(spirit);ok(!F.breakthrough(spirit)&&JSON.stringify(spirit)===before,'insufficient breakthrough preserves all resources');
let scholarRate=novice();ok(F.study(scholarRate)&&F.spiritRate(scholarRate).total===11,'reading adds ten percent: ten becomes eleven per second');
ok(F.readSpiritBook(scholarRate,'tulinh')&&F.spiritRate(scholarRate).total===12,'book bonus adds to research on base, without compounding');before=JSON.stringify(scholarRate);ok(!F.readSpiritBook(scholarRate,'tulinh')&&JSON.stringify(scholarRate)===before,'each named book can only be learned once');
scholarRate.location='ben_nuoc';ok(F.readSpiritBook(scholarRate,'linhtuyen')&&F.spiritRate(scholarRate).total===14,'port book grants a persistent twenty percent');
scholarRate.level=5;scholarRate.xp=F.spiritNeeded(scholarRate)+17;ok(F.breakthrough(scholarRate)&&scholarRate.level===6&&scholarRate.xp===17&&F.spiritRate(scholarRate).base===15&&F.spiritRate(scholarRate).total===21,'major realm raises base rate while retaining book percentages and overflow');
let reserved=novice();reserved.xp=1000;reserved.pending={id:'test',opts:[]};before=JSON.stringify(reserved);ok(!F.breakthrough(reserved)&&JSON.stringify(reserved)===before,'pending decision prevents breakthrough without discarding stored power');reserved.pending=null;reserved.battle={id:'test'};before=JSON.stringify(reserved);ok(!F.breakthrough(reserved)&&JSON.stringify(reserved)===before,'battle cannot be bypassed by breakthrough');
let legacySpirit=novice();delete legacySpirit.cultivation;legacySpirit.level=7;legacySpirit.xp=43;const fraction=legacySpirit.xp/(40+legacySpirit.level*25);ok(F.migrate(legacySpirit)&&Math.abs(legacySpirit.xp/F.spiritNeeded(legacySpirit)-fraction)<1e-10,'legacy save preserves realm and progress fraction');
const roundTrip=JSON.stringify(scholarRate);ok(F.migrate(copy(scholarRate))&&JSON.stringify(F.migrate(copy(scholarRate)))===roundTrip,'new spiritual state reloads without duplicate bonuses or rescaling');
for(const seconds of [NaN,Infinity,-1,0,6]){before=JSON.stringify(spirit);ok(!F.absorb(spirit,seconds)&&JSON.stringify(spirit)===before,'invalid/oversized elapsed interval rejected');}
let badSpirit=copy(scholarRate);badSpirit.cultivation.books.push('tulinh');ok(F.migrate(badSpirit)===null,'duplicate book in save rejected');badSpirit=copy(scholarRate);badSpirit.cultivation.studyBonus=-10;ok(F.migrate(badSpirit)===null,'invalid absorption bonus rejected');
for(let seed=0;seed<30;seed++){let x=novice();x.rs=94000+seed;x.location='ben_nuoc';x.ap=1;ok(F.travelInfo(x,'dong_co').ok&&F.travel(x,'dong_co')&&x.ap===0,'starter farm reachable directly from port at first realm');ok(F.hunt(x)&&x.battle.level<=2,'starter encounter matches novice power');while(x.battle&&x.alive)F.fight(x,'attack');ok(x.alive&&!x.battle&&x.progress.hunt===1&&x.ap===0,'novice can actually farm starter monsters at zero actions');}
console.log('PASS: '+checks+' Fantasy progression, spiritual power, services, academy, map, save and story checks.');
