'use strict';
const assert=require('node:assert/strict'),{gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,T=E.ERA969,P=E.ERA920.POL,Hist=E.ERA920.HIST,B=E.EDUCATION170,log=()=>{},rng=()=>0;
function life(country,y,age=25,extra={}){
 const l=E.createLife({mode:country==='VN'?'vn':'world',country,year:y-age,seed:969,noOrphan:true,...extra});
 Object.assign(l,{age,birthYear:y-age,alive:true,school:null,schoolEnd:null,job:null,edu:3,pending:[],abroad:null,indep:true,money:l.base*100});
 l.flags.military=0;delete l.flags.royal;delete l.fam.orphan;delete l.flags.orphanCarer;E.LIFE138.state(l).care='bố mẹ';return l;
}
function choice(l,id,key,arg={}){
 const d=E.DEC[id].make(l,rng,arg),o=d.opts.find(o=>E.UPDATE110.menuKey(d,o.k)===key);
 assert(o,'missing '+id+' '+key);d.manual=true;l.pending=[d];E.resolve(l,o.k);return d;
}
let cityChecks=0;
for(const c of G.W.C.filter(c=>c.births>0))for(const y of [1900,1940,1960,1980,2000,2026]){
 const names=P.cities(c.code,y);assert(names.length,c.code+' '+y);
 for(const name of names){assert(P.cityAllowed(c.code,y,name));cityChecks++;}
}
for(const [cc,rows] of Object.entries(T.cities))for(const [city,row] of Object.entries(rows)){
 assert(!P.cityAllowed(cc,row.from-1,city));assert(P.cityAllowed(cc,row.from,city));
 const old=E.createLife({mode:'world',country:cc,city,year:row.from-1,seed:969,urban:true});
 assert.notEqual(old.city,city,'future city omitted at birth');
 const born=E.createLife({mode:'world',country:cc,city,year:row.from,seed:969,urban:true});assert.equal(born.city,city);
 if(row.label)assert(born.birthPlace.includes(row.label));
 const moving=life(cc,row.from-1),before=JSON.stringify({city:moving.city,place:moving.place,money:moving.money});
 assert.equal(E.H.moveToCity(moving,city),false);assert.equal(JSON.stringify({city:moving.city,place:moving.place,money:moving.money}),before);
}
let l=life('GB',1950);E.H.emigrate(l,['MM','Myanmar',G.W.BY.MM.pool],()=>.99,log);assert.notEqual(l.city,'Naypyidaw');
const beforeCross=l.city;assert.equal(E.H.moveToCity(l,'Paris'),false);assert.equal(l.city,beforeCross,'domestic move cannot teleport to another country');
const nghe=G.VN.P63.find(p=>p.name==='Nghệ An');
l=E.createLife({mode:'vn',variant:'63',prov:String(nghe.id),year:1980,seed:969,urban:true});
assert(l.birthPlace.includes('Nghệ Tĩnh'));assert.equal(l.prov.old,'Nghệ An');l.age=12;
assert(!E.placeText(l).includes('Nghệ Tĩnh'));assert(l.birthPlace.includes('Nghệ Tĩnh'));
assert.equal(P.regionName('Bình Dương',1980),'Sông Bé');assert.equal(P.regionName('Bình Dương',1997),null);
assert(P.regionChoice('Hà Tĩnh',1980).includes('Nghệ Tĩnh'));

// Displacement keeps schooling and choices on the same persisted case, across years.
l=life('US',1940,10);l.indep=false;l.city=l.place='New York';l.school='primary';l.schoolEnd=11;l.edu=1;
Object.assign(l.fam,{mAlive:true,fAlive:true,noMom:false,noDad:false,q:5,mInc:l.base*10,fInc:l.base*10});
let o=Hist.open(l,'displaced',2),q=o.recovery969;
assert(q.school&&l.school===null);E.H.moveToCity(l,'Chicago');
choice(l,'recovery969','relatives');assert(q.housing);assert.equal(q.acted,1940);
assert(!E.DEC.recovery969.make(l,rng).opts.some(o=>E.UPDATE110.menuKey(E.DEC.recovery969.make(l,rng),o.k)==='school'));
l=E.migrate(JSON.parse(JSON.stringify(l)));o=T.displaced(l);q=o.recovery969;l.age++;
choice(l,'recovery969','school');assert.equal(q.schoolDue,1942);assert.equal(l.school,null);
l.age++;T.recoveryYear(l,rng,log);assert.equal(l.school,'primary');assert.equal(l.schoolEnd,l.age+1);assert.equal(l.edu,1,'reentry does not grant a diploma');
const end=l.schoolEnd;T.recoveryYear(l,rng,log);assert.equal(l.schoolEnd,end);
choice(l,'recovery969','family');assert.equal(q.contact,1942);l.age++;
choice(l,'recovery969','meet');assert(q.reunited);
l.age++;const close=choice(l,'recovery969','settle');assert(!T.displaced(l));
assert(Hist.st(l).recoveryHistory969.at(-1).history.some(h=>h.choice==='school'));
const happiness=l.st.hap;E.DEC.recovery969.apply(l,close,'0',rng,log);assert.equal(l.st.hap,happiness);

// Returning does not lose the outstanding re-enrolment request.
l=life('US',1940,10);l.indep=false;l.city=l.place='New York';l.school='primary';l.schoolEnd=11;l.edu=1;
Object.assign(l.fam,{mAlive:true,fAlive:true,noMom:false,noDad:false,q:5,mInc:l.base*10,fInc:l.base*10});
o=Hist.open(l,'displaced',2);E.H.moveToCity(l,'Chicago');choice(l,'recovery969','relatives');l.age++;
assert(T.returnReady(l,o.recovery969));const back=E.DEC.recovery969.make(l,rng),backKey=back.opts.find(x=>E.UPDATE110.menuKey(back,x.k)==='return').k;E.DEC.recovery969.apply(l,back,backKey,rng,log);assert(!T.displaced(l));assert.equal(l.city,'New York');
l.age++;T.recoveryYear(l,rng,log);assert.equal(l.school,'primary');

// Vocational qualifications require the dated route, entry education, fee and full duration.
for(const [cc,id,first] of [['JP','kosen',1962],['DE','dual',1969],['FR','bacpro',2009],['IN','iti',1950]]){
 const early=life(cc,first-1,18);assert(!T.route(early,id,T.learner(early,'self')));
 l=life(cc,Math.max(first,1970),18);l.edu=2;assert.equal(T.courseReason(l,'self',id),true);
 const cash=l.money;assert(T.startCourse(l,'self',id,rng,log));const course=B.courses(l).at(-1);
 assert(l.money<cash);assert.equal(l.edu,2);assert.equal(l.school,'voc');assert(!T.startCourse(l,'self',id,rng,log));
 const saved=E.migrate(JSON.parse(JSON.stringify(l)));
 for(let n=0;n<course.years;n++){saved.age++;B.courseYear(saved,rng,log);}
 const done=B.courses(saved).at(-1);assert.equal(done.status,'completed');assert.equal(saved.edu,4);assert.equal(saved.school,null);
 const count=B.education(saved,saved).qualifications969.length;B.courseYear(saved,rng,log);assert.equal(B.education(saved,saved).qualifications969.length,count);
}
l=life('JP',1970,18);l.edu=1;assert.notEqual(T.courseReason(l,'self','kosen'),true);l.edu=2;assert(T.startCourse(l,'self','kosen',rng,log));
l.abroad={code:'US',perm:true};l.age++;B.courseYear(l,rng,log);assert.equal(B.courses(l).at(-1).status,'ended');assert.equal(l.edu,2);assert.equal(l.school,null);
l=life('JP',1994,18);l.edu=2;l.city=l.place='Kobe';assert(T.startCourse(l,'self','kosen',rng,log));
let paused=B.courses(l).at(-1),due=paused.due;l.age++;B.courseYear(l,rng,log);
assert.equal(paused.paused969,1);assert.equal(paused.due,due+1);assert.equal(paused.progress,0);
B.courseYear(l,rng,log);assert.equal(paused.due,due+1,'one extension for one interrupted year');
for(let n=0;n<5;n++){l.age++;B.courseYear(l,rng,log);}assert.equal(paused.status,'completed');assert.equal(l.edu,4);
l=life('US',1920,18);l.edu=1;assert(T.startCourse(l,'self','apprentice',rng,log));
for(let n=0;n<2;n++){l.age++;B.courseYear(l,rng,log);}assert.equal(l.edu,1,'informal apprenticeship does not manufacture an academic diploma');

// Teen tuition uses the family's existing payment mechanism; a refusal charges nothing.
l=life('JP',1970,15);l.edu=2;l.indep=false;l.money=0;
Object.assign(l.fam,{mAlive:true,fAlive:true,noMom:false,noDad:false,q:5,mInc:l.base*10,fInc:l.base*10});
assert.equal(T.courseReason(l,'self','kosen'),true);assert(T.startCourse(l,'self','kosen',rng,log));assert.equal(l.money,0);

// The existing family course ledger also serves children; no work begins during full-time study.
l=life('DE',1980,45);l.kids=[{name:'Con kiểm thử',sex:'F',born:28,alive:true,edu:2,study:75,close:100,job:null}];
const kid=l.kids[0];E.ext.initKid(kid);const id=E.UPDATE110.uid(l,kid);assert.equal(T.courseReason(l,id,'dual'),true);
assert(T.startCourse(l,id,'dual',rng,log));assert(T.learning(l,kid));
const inherited=E.heirAtAge(l,kid);assert.equal(inherited.school,'voc');assert.equal(inherited.edu,2);
for(let n=0;n<3;n++){inherited.age++;B.courseYear(inherited,rng,log);}assert.equal(inherited.edu,4,'active course continues when playing as the child');
l.age++;E.ext.kidsYear(l,rng,log,l.age);assert(!kid.job);
for(let n=0;n<3;n++){if(n)l.age++;B.courseYear(l,rng,log);}
assert.equal(kid.edu,4);assert(!T.learning(l,kid));

// Preferred careers and ordinary NPC recruitment both respect the current country/year.
l=life('US',1935,45);l.kids=[{name:'Con đi làm',sex:'M',born:20,alive:true,edu:5,major:'it',study:80,close:80,job:null}];
E.childCareer126=()=> 'dev';E.ext.kidsYear(l,rng,log,l.age);
assert(l.kids[0].job&&l.kids[0].job!=='dev');assert(!E.ERA902.jobBlocked(E.ERA902.relativeLife(l,l.kids[0]),l.kids[0].job,E.CAR[l.kids[0].job]));
l=life('US',2020,45);l.kids=[{name:'Con tốt nghiệp',sex:'M',born:20,alive:true,edu:5,study:80,close:80,job:null}];
E.childCareer126=()=> 'bac_si';E.ext.kidsYear(l,rng,log,l.age);assert.notEqual(l.kids[0].job,'bac_si','a generic university degree is not a medical qualification');
l=life('CN',1970,18);assert.notEqual(T.academicReason(l),true);assert(!E.DEC.uni.make(l,rng).opts.some(o=>/^uni_/.test(o.k)));
assert(!E.DEC.major.valid(l,{}));assert.equal(T.academicReason(l,null,'US'),true);
console.log('PASS era969: '+cityChecks+' dated city choices; administrative names, recovery/reunion/reentry, vocational entry/duration/save/fees, family careers and academic context');
