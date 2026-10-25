'use strict';const assert=require('assert'),E=require('./hardcore-isolation').gameContext().E,D=E.DEBT140;let n=0;function ok(v,m){assert(v,m);n++;}
let logs=[];const log=(m)=>logs.push(m);
function life(){let l=E.createLife({mode:'vn',seed:140});Object.assign(l,{age:35,school:null,indep:true,money:0,edu:5,job:null,record:0,pending:[]});l.flags.dirty=0;delete l.flags.criminal;l.flags.military=0;l.loans=[{type:'bank',name:'vay ngân hàng',bal:l.base*2,rate:.09,minShare:.12,late:2,lateTot:2,since:30}];return l;}
function family(l){l.partner={name:'Lan',sex:'F',age:34,status:'married',alive:true,close:70,job:'giáo viên'};l.kids=[{name:'Bé Na',sex:'F',born:25,alive:true,close:70},{name:'Bé Tí',sex:'M',born:33,alive:true,close:70}];l.fam.fAlive=true;l.fam.mAlive=true;return l;}
function pick(l,key,r=()=>.5){let d=E.DEC.collectors140.make(l,r),i=d.data.keys.indexOf(key);assert(i>=0&&d.opts.some(o=>o.k===String(i)),'enabled '+key);E.DEC.collectors140.apply(l,d,String(i),r,log);}
function keys(l){let d=E.DEC.collectors140.make(l,()=>0);return d.data.keys.filter((k,i)=>d.opts.some(o=>o.k===String(i)));}
// Sale is conditional: not before two overdue years, not for secured home loans, more likely for large old debt.
let l=life();l.loans[0].late=1;l.loans[0].lateTot=1;D.year(l,()=>0,log);ok(!D.active(l)&&l.loans.length===1,'not sold before two overdue years');
l=life();l.loans[0].type='home';D.year(l,()=>0,log);ok(!D.active(l),'secured home loan is not sold');
l=life();let small={bal:l.base*.1,late:2},big={bal:l.base*4,late:4};ok(D.saleChance(l,big)>D.saleChance(l,small),'larger older debt sells more often');
l=life();D.year(l,()=>.99,log);ok(!D.active(l)&&l.loans.length===1,'sale may not happen');
// Sold debt leaves the bank books, is owed to the buyer and harasses the whole family.
l=family(life());logs=[];D.year(l,()=>0,log);ok(D.active(l)&&!l.loans.length,'debt moved to buyer');ok(D.owed(l)>l.base*2,'buyer adds collection fee');ok(logs.some(x=>/chỗ làm của Lan/.test(x)),'spouse workplace harassed');ok(logs.some(x=>/cổng trường của Bé Na/.test(x)),'school-age child threatened');ok(logs.some(x=>/bố, mẹ/.test(x)),'relatives harassed');ok(l.pending.some(d=>d.id==='collectors140'),'choice queued');ok(l.kids[0].fear140>0&&l.partner.close<70,'relationships affected');ok(E.netWorth(l)<0,'net worth counts sold debt');
let hap=l.st.hap;l.age++;D.year(l,()=>.9,log);ok(l.st.hap<hap,'life does not get better');ok(D.year(l,()=>0,log)===undefined&&l.pending.filter(d=>d.id==='collectors140').length===1,'no duplicate yearly choice');
// Dark side reuses the crime careers and crime money pays the collectors.
let dark=family(life());D.year(dark,()=>0,log);ok(keys(dark).includes('doi_no')&&keys(dark).includes('flee'),'both ways offered');pick(dark,'doi_no');ok(E.CAR[E.resolveJob(dark.job.id)].sec==='crime','crime career started');dark.money=D.owed(dark)*3;dark.age++;D.year(dark,()=>.9,log);ok(!D.active(dark),'crime money clears the debt');
// Fleeing moves the family and hides them; bad luck can still find and beat the player.
let flee=family(life());flee.money=flee.base;flee.job={id:'cong_nhan',rank:0,yrs:1,since:30};D.year(flee,()=>0,log);let prov=flee.prov.old;pick(flee,'flee');ok(flee.prov.old!==prov&&!flee.job,'moved to another city and left the job');ok(D.state(flee).hiding,'living in hiding');flee.age++;logs=[];D.year(flee,()=>.99,log);ok(D.state(flee).hiding&&!logs.some(x=>/cổng trường/.test(x)),'hiding pauses harassment');let hea=flee.st.hea;flee.age++;D.year(flee,()=>0,log);ok(!D.state(flee).hiding&&flee.st.hea<hea,'found and beaten with bad luck');
// Saves keep the sold debt; legacy saves without the state still load.
let save=E.migrate(JSON.parse(JSON.stringify(flee)));ok(Math.abs(D.owed(save)-D.owed(flee))<1e-6,'save keeps sold debt');let old=life();delete old.flags.world120;let loaded=E.migrate(JSON.parse(JSON.stringify(old)));ok(!D.active(loaded)&&loaded.loans.length===1,'old save without debt state');
let rich=family(life());D.year(rich,()=>0,log);rich.money=D.owed(rich)*2;pick(rich,'payoff');ok(!D.active(rich),'pay off ends harassment');
console.log('Debt140: '+n+' checks passed.');
