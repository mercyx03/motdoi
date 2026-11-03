const assert=require('assert'),G=require('./hardcore-isolation').gameContext(),E=G.E;
function life(country,age,school){const l=E.createLife({mode:'world',country,year:2000,seed:829});Object.assign(l,{age,school,pending:[],money:l.base*10,indep:age>=18});return l;}
function choose(l,id,key,arg){const d=E.DEC[id].make(l,E.H.rf(l),arg);const k=d.data.keys?String(d.data.keys.indexOf(key)):key;assert(d.opts.some(o=>o.k===k),id+': '+key);l.pending=[d];E.resolve(l,k);}
const pupil=life('GB',16,'lower');choose(pupil,'sixth829','science');assert.equal(pupil.schoolEnd,18);choose(pupil,'schoolEngland829','Vật lý');assert.equal(pupil.flags.study829.fourth,'Vật lý');
const student=life('US',19,'uni');const before=student.money;choose(student,'exchange829','0',{to:'JP',term:'1 học kỳ',index:1});assert(student.money<before);choose(student,'exchange829','meet');choose(student,'exchange829','return');assert.equal(student.flags.study829.transcript[0].credit,15);assert.equal(student.school,'uni');
choose(student,'aid829','Federal Student Aid — vay liên bang');assert(student.flags.study829.debts[0].bal>0);assert.deepEqual(E.migrate(JSON.parse(JSON.stringify(student))).flags.study829,student.flags.study829);
const gb=life('GB',19,'uni');const cash=gb.money;choose(gb,'aid829','Tuition Fee Loan');assert.equal(gb.money,cash);assert(gb.flags.study829.feesPaid>0);
console.log('PASS study829: Sixth Form, subjects, exchange, credits, financing and save migration');
const apprentice=life('GB',18,null);
const offer=E.DEC.uni.make(apprentice,()=>0);assert(offer.opts.some(o=>o.k==='degree829'));
E.DEC.uni.apply(apprentice,offer,'degree829',()=>0,()=>{});assert.equal(apprentice.school,'uni');assert.equal(apprentice.schoolEnd,22);
const au=life('AU',19,'uni');au.fam.q=1;choose(au,'aid829','Youth Allowance');assert(!au.flags.study829.debts);choose(au,'aid829','HECS-HELP');assert(au.flags.study829.debts[0].bal>0);
const visitor=life('JP',20,'abroad');visitor.abroad={code:'US',study:true};const options=E.DEC.aid829.make(visitor,E.H.rf(visitor)).data.keys;assert(options.includes('Khoản vay tư nhân')&&!options.includes('Federal Student Aid — vay liên bang'));
console.log('PASS apprentice admission, Australian grants vs debt and temporary visitor eligibility');
