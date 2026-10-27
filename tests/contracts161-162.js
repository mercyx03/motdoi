'use strict';
const assert=require('assert'),E=require('./hardcore-isolation').gameContext().E;
let checks=0;const ok=(x,m)=>{assert(x,m);checks++;};
const noop=()=>{};
function life(age=30){const l=E.createLife({mode:'vn',seed:1612});Object.assign(l,{age,indep:age>=18,money:100000,school:age<18?'THPT':null,pending:[],jailUntil:null});l.flags.military=0;l.st.hea=80;return l;}
function pick(l,id,key,arg={},r=()=>.5){const d=E.DEC[id].make(l,r,arg),i=d.data.keys.indexOf(key);assert(d.opts.some(o=>o.k===String(i)),id+'/'+key);E.DEC[id].apply(l,d,String(i),r,noop);return d;}
function channel(l){pick(l,'social131','create:youtube');return E.SOCIAL131.state(l).channels[0];}
let l=life(),c=channel(l),cash=l.money;
ok(E.MEDIA161.hire(l,c,'social',3),'hire specialist');
ok(l.money===cash-l.base*.18&&c.staff===1,'pay once, existing staff quality updated');
cash=l.money;ok(!E.MEDIA161.hire(l,c,'social',3)&&l.money===cash,'duplicate role rejected');
E.MEDIA161.payroll(l,c,()=>.5,noop);ok(l.money===cash,'same year payroll not repeated');
ok(E.MEDIA161.can(c,'post')&&!E.MEDIA161.can(c,'ads'),'specific duties control delegation');
const contract=JSON.stringify(c.team161);E.DEC.mediaStaff161.make(l,()=>.5,{id:c.id});ok(JSON.stringify(c.team161)===contract&&l.money===cash,'view cannot reroll staff or pay');
l=E.migrate(JSON.parse(JSON.stringify(l)));c=E.SOCIAL131.state(l).channels[0];E.MEDIA161.payroll(l,c,()=>.5,noop);ok(l.money===cash,'reload cannot charge twice');
l.age++;E.MEDIA161.payroll(l,c,()=>.5,noop);cash=l.money;E.MEDIA161.payroll(l,c,()=>.5,noop);ok(l.money===cash,'renewed year idempotent');
l.age+=3;E.MEDIA161.payroll(l,c,()=>.5,noop);ok(c.staff===0&&c.team161[0].status==='expired'&&l.money===cash,'contract expires without automatic expense');
l=life();c=channel(l);c.staff=2;c.staffPaidAt=l.age;cash=l.money;E.MEDIA161.hire(l,c,'pr',2);ok(c.team161[0].legacy&&c.team161[0].salary===l.base*.36,'old staff migrated with existing salary');E.MEDIA161.payroll(l,c,()=>.5,noop);ok(l.money===cash-l.base*.18,'no duplicate legacy wage');
l.age++;l.money=0;E.MEDIA161.payroll(l,c,()=>.5,noop);ok(c.staff===0&&l.money===0,'insufficient funds suspend staff without debt');
l=life(15);c=channel(l);ok(!E.MEDIA161.hire(l,c,'team',3),'minor cannot sign staff contract');
function trainee(age=15){let l=life(age);l.fam.mAlive=true;E.LIFE138.state(l).agency={name:'Aurora Entertainment (hư cấu)',code:'KR',status:age<18?'junior155':'trainee',years:1,started:age-1};l.flags.idol155={stage:age<18?'junior':'trainee',company:{name:'Aurora Entertainment (hư cấu)'},peers:[{uid110:'old-peer',name:'Bạn cũ',skill:60,bond:20}],evals:[{age:age-1,score:50}],debt:100,months:3};return l;}
l=trainee();let a=E.LIFE138.state(l).agency;let before=JSON.stringify(l.flags.idol155.peers);pick(l,'traineeContract162','pause');ok(a.status==='paused162'&&!E.IDOL155.trainee(l),'pause blocks monthly training');let skills=JSON.stringify(E.LIFE138.state(l).skills);E.CONTRACT162.year(l,()=>.5,noop);ok(JSON.stringify(E.LIFE138.state(l).skills)===skills,'paused annual lifecycle does not train');pick(l,'traineeContract162','resume');ok(a.status==='junior155','resume minor locally');pick(l,'traineeContract162','transfer',{},()=>0);ok(a.name.includes('Starlight')&&a.years===1&&JSON.stringify(l.flags.idol155.peers)===before,'transfer keeps training years and NPC identity');
let d=E.DEC.traineeContract162.make(l,()=>0);ok(!d.opts.some(o=>o.k===String(d.data.keys.indexOf('transfer'))),'transfer once per year');
pick(l,'traineeContract162','leave');ok(a.status==='left'&&l.flags.idol155.stage==='left'&&l.flags.idol155.debt===100,'leave retains debt and history');ok(E.IDOL155.scoutable(l),'former junior can be discovered again');
pick(l,'traineeContract162','retry');ok(l.pending.some(d=>d.id==='scout155'),'minor reaudition uses existing guardian flow');
l.flags.idol155.offer={name:'Next',parents:'yes'};E.IDOL155.sign(l,()=>.5,noop);ok(JSON.stringify(l.flags.idol155.peers)===before&&l.flags.idol155.months===3&&l.flags.idol155.debt===100,'resigning keeps existing peers, experience and training debt');
l=trainee();a=E.CONTRACT162.ensure(l);a.contractUntil162=l.age+1;pick(l,'traineeContract162','renew',{},()=>0);ok(a.contractUntil162===l.age+3,'renew extends fixed term');l.age+=3;E.CONTRACT162.year(l,()=>.5,noop);ok(a.status==='left','expiry ends training');let snapshot=JSON.stringify(l);E.CONTRACT162.year(l,()=>.5,noop);ok(JSON.stringify(l)===snapshot,'expiry not replayed');
l=trainee();l.fam.mAlive=false;l.fam.fAlive=false;d=E.DEC.traineeContract162.make(l,()=>0);ok(!d.opts.some(o=>o.k===String(d.data.keys.indexOf('transfer'))),'minor transfer needs guardian');
l=trainee();l.st.hea=20;E.CONTRACT162.year(l,()=>.5,noop);ok(E.LIFE138.state(l).agency.status==='paused162','poor health pauses training before annual lessons');
l=E.migrate(JSON.parse(JSON.stringify(l)));ok(E.LIFE138.state(l).agency.status==='paused162'&&l.flags.idol155.peers[0].uid110==='old-peer','save preserves pause and NPC');
l=life();c=channel(l);c.staff=3;c.staffPaidAt=l.age;pick(l,'mediaStaff161','adopt',{id:c.id});ok(c.staff===3&&E.MEDIA161.can(c,'live')&&E.MEDIA161.can(c,'ads'),'legacy staff keeps capacity and delegated duties');
const fee=c.team161[0].salary;cash=l.money;E.abroadConvert(l,2);ok(c.team161[0].salary===fee*2,'contract wage converts with currency');
pick(l,'investChannel131','stopStaff',{id:c.id});l.age++;cash=l.money;E.MEDIA161.payroll(l,c,()=>.5,noop);ok(c.staff===0&&l.money===cash,'old stop-staff action also stops specialist payroll');
l=life();c=channel(l);Object.keys(E.MEDIA161.roles).forEach(role=>ok(E.MEDIA161.hire(l,c,role,2),'hire '+role));ok(c.staff===3&&E.MEDIA161.quality(c)<=18,'all nine roles cannot inflate staff quality indefinitely');
l=life();l.money=-l.base;l.fam.mAlive=true;cash=l.money;pick(l,'celebration129','tet:simple');ok(l.money===cash,'family in debt can celebrate without new expense');d=E.DEC.celebration129.make(l,()=>.5);ok(!d.opts.some(o=>d.data.keys[+o.k]==='tet'||d.data.keys[+o.k]==='tet:venue'),'one celebration per occasion across budgets');
pick(l,'familyTrip114','parentsĐi dạo và nghỉ tại nhà',{},()=>.1);ok(l.money===cash,'free family time keeps cash unchanged');
l=life();l.fam.mAlive=true;cash=l.money;pick(l,'celebration129','birthday:venue');ok(Math.abs(cash-l.money-l.base*.16)<1e-8,'venue cost uses local base');
l=trainee(20);a=E.LIFE138.state(l).agency;a.code='JP';const original=JSON.stringify(a);E.CONTRACT162.year(l,()=>0,noop);ok(JSON.stringify(a)===original,'K-pop lifecycle leaves other countries contracts intact');
l=trainee();a=E.CONTRACT162.ensure(l);let name=a.name;pick(l,'traineeContract162','transfer',{},()=>.999);ok(a.name===name&&a.status==='junior155','failed transfer preserves current contract');a.contractUntil162=l.age+1;pick(l,'traineeContract162','renew',{},()=>.999);ok(a.contractUntil162===l.age+1,'failed renewal does not extend term');
l=trainee();a=E.CONTRACT162.ensure(l);a.years=2;['sing','dance','acting','rap','instrument','language'].forEach(k=>E.LIFE138.skill(l,k).level=0);l.st.soc=0;l.st.kno=0;l.talent='';E.CONTRACT162.year(l,()=>0,noop);ok(a.status==='left'&&l.flags.idol155.peers[0].uid110==='old-peer','low evaluation can end contract without removing identity');
l=trainee();a=E.CONTRACT162.ensure(l);['sing','dance','acting','rap','instrument','language'].forEach(k=>E.LIFE138.skill(l,k).level=80);E.CONTRACT162.year(l,()=>0,noop);ok(E.LIFE138.state(l).contract162.approach&&a.name.includes('Aurora'),'approach is an offer, not automatic transfer');
l=trainee(20);pick(l,'audition139','leave');ok(E.LIFE138.state(l).agency.status==='left'&&E.LIFE138.state(l).contract162.history.length===1,'existing adult leave path shares contract history');
l=life();c=channel(l);E.MEDIA161.hire(l,c,'ads',3);const worker=c.team161[0];l.age++;for(let i=0;i<200;i++){if(E.LIFE138.random('resign'+i+':'+worker.id+':'+l.age)()<.025){l.id='resign'+i;break;}}cash=l.money;E.MEDIA161.payroll(l,c,()=>.5,noop);ok(worker.status==='resigned'&&c.staff===0&&l.money===cash,'resignation stops duties and future payroll');ok(E.MEDIA161.hire(l,c,'ads',1)&&c.team161[1].id!==worker.id,'replacement gets distinct contract identity');
console.log('Media / trainee contracts and family budgets: '+checks+' checks passed');
