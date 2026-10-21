'use strict';
const assert=require('assert'),{gameContext}=require('./hardcore-isolation');const G=gameContext(),E=G.E;let checks=0;
function ok(v,m){assert(v,m);checks++;}
function life(mode='vn',difficulty='normal'){const l=E.createLife({mode,country:mode==='world'?'US':'VN',difficulty,seed:10122});l.age=26;l.school=null;l.schoolEnd=null;l.edu=6;l.indep=true;l.pending=[];l.sched=[];l.money=l.base*5;l.st.hea=95;l.st.kno=95;return l;}
function log(l){return(t,k)=>l.log.push({a:l.age,t,k});}
for(const mode of ['vn','world'])for(const difficulty of ['normal','hardcore'])for(const dest of [['FR','Pháp','fr'],['JP','Nhật Bản','jp'],['DE','Đức','de'],['KR','Hàn Quốc','kr'],['AU','Úc','en'],['US','Mỹ','en']]){
 const l=life(mode,difficulty),original=JSON.parse(JSON.stringify(l)),note=log(l);E.startResearchStudy(l,dest,()=>.5,note);
 ok(l.abroad.code===dest[0]&&l.abroad.study&&!l.abroad.perm,'temporary study residence');ok(G.WEC.context(l).code===dest[0]&&l.cur==='usd','host earnings context');
 ok(E.jobTitle(l).includes(dest[1])&&E.careerYear(l,()=>.5,note,'study')===l.base*.7,'scholarship stipend replaces old salary');
 l.age+=4;const d=E.DEC.nc_bao_ve.make(l,()=>.5,l.sched[0].arg);ok(E.DEC.nc_bao_ve.valid(l,d.data),'defense has matching destination');
 E.DEC.nc_bao_ve.apply(l,d,'ky',()=>.1,note);ok(l.edu===7&&l.flags.researchStudy.finished&&l.abroad.code===dest[0],'degree and location retained');
 E.DEC.nc_sau_du_hoc.apply(l,E.DEC.nc_sau_du_hoc.make(l,()=>.5),'home',()=>.5,note);
 ok(l.cur===original.cur&&l.abroad===null&&l.place===original.place&&l.edu===7&&!l.job,'return restores location and retains degree');
 ok(Math.abs(l.money-original.money)<.001,'currency round trip preserves savings');
}
{
 const l=life(),note=log(l);let calls=0;E.DEC.nc_moi.def.opts.find(x=>x.k==='hoc_bong').run(l,()=>calls++===0?0:.75,note);
 ok(l.abroad.code==='FR'&&l.log.some(e=>e.t.includes('toàn phần ở Pháp')),'actual scholarship choice names the same country it moves to');
 l.age=30;const d=E.DEC.nc_bao_ve.make(l,()=>.5,l.sched[0].arg);E.DEC.nc_bao_ve.apply(l,d,'ky',()=>.99,note);
 const retry=l.sched[l.sched.length-1];ok(retry.arg.country==='FR'&&retry.arg.started===26,'failed defense keeps destination on retry');
 l.age=31;ok(E.DEC.nc_bao_ve.valid(l,retry.arg),'retry remains valid');E.DEC.nc_bao_ve.apply(l,E.DEC.nc_bao_ve.make(l,()=>.5,retry.arg),'vua',()=>.1,note);
 E.DEC.nc_sau_du_hoc.apply(l,E.DEC.nc_sau_du_hoc.make(l,()=>.5),'stay',()=>.5,note);ok(l.abroad.perm&&!l.abroad.study&&l.edu===7,'staying changes residence only after graduation');
}
{
 const l=life();E.startJob(l,'nghien_cuu',()=>.5,log(l),true);l.flags.ncPath={at:22};l.log.push({a:22,t:'Bạn giành được học bổng tiến sĩ toàn phần ở Pháp. Bốn năm học xa nhà bắt đầu.'});l.edu=7;
 const fixed=E.migrate(JSON.parse(JSON.stringify(l)));ok(fixed.abroad.code==='FR'&&fixed.edu===7,'legacy scholarship repair preserves PhD');const balance=fixed.money;E.migrate(fixed);ok(fixed.money===balance,'legacy conversion runs only once');
 const other=life();other.edu=7;E.migrate(other);ok(!other.abroad,'ordinary doctorate does not trigger relocation');
}
for(const first of ['partner','bff']){
 const l=life(),name='Người thân thử';l.partner={name,sex:'M',age:35,status:'married',since:20,alive:true,fromFriend:true};l.bff={name,sex:'M',since:10,alive:true,close:90};l.friends=[{name,sex:'M',lover:false,alive:true}];
 if(first==='partner')E.partnerGone(l,l.age);else{l.bff.alive=false;l.bff.died=l.age;E.syncKnownDeaths(l,l.age);}
 ok(!l.partner&&l.bff.alive===false&&l.friends[0].alive===false,'death synchronizes all relationship roles '+first);const n=l.widowed;E.syncKnownDeaths(l,l.age+1);ok(l.widowed===n,'widow count once '+first);
}
{
 const l=life(),name='Bạn đời thử';l.age=35;l.partner={name,sex:'M',age:35,status:'married',since:20,alive:true,fromFriend:true};l.bff={name,sex:'M',since:10,alive:true,close:90};l.mortM=l.mortF={A:0,B:0,M:0};l.mort={A:0,B:0,M:100};E.finishYear(l);
 ok(!l.partner&&l.bff.alive===false,'core best-friend mortality immediately removes spouse');ok(l.log.filter(e=>e.t.includes(name)&&/qua đời/.test(e.t)).length===1,'one death notice in actual yearly engine');
}
for(const id of ['quan_doi','cong_an']){
 const l=life();l.age=58;E.startJob(l,id,()=>.5,log(l),true);l.flags.topAcad=50;l.flags.midAcad={at:40};l.job.rank=l.job.rankTracked=9;l.job.rankSince=50;l.job.yrs=8;
 ok(E.CAR[id].t[11]==='Đại tướng'&&E.CAR[id].vn.length===12&&E.CAR[id].yrs.length===11,'complete rank/pay/tenure ladder');
 ok(!E.canAdvance(l,E.CAR[id],true),'high rank requires strategic appointment');l.flags.strategicPost=id;ok(E.canAdvance(l,E.CAR[id],true),'eligible senior officer can advance');l.flags.topAcad=-1;ok(!E.canAdvance(l,E.CAR[id],true),'declined academy is not qualification');
}
ok(E.CAR.hanh_chinh_cong.t.includes('bộ trưởng')&&E.CAR.chinh_tri.t.includes('Tổng Bí thư'),'detailed civil and political titles');
{
 const l=life();l.age=58;E.startJob(l,'cong_an',()=>.5,log(l),true);l.job.rank=l.job.rankTracked=9;l.job.rankSince=50;l.job.yrs=8;l.flags.midAcad={at:40};l.flags.topAcad=50;
 E.DEC.ca_chuyen_an.def.opts.find(o=>o.k==='brave').run(l,()=>.2,log(l),{danger:.01});ok(l.job.rank===9,'case reward cannot bypass strategic appointment');
}
for(const job of ['ca_si','chinh_tri','hanh_chinh_cong'])for(let topic=0;topic<6;topic++)for(const key of ['clarify','own','hide']){
 const l=life();E.startJob(l,job,()=>.5,log(l),true);l.fame=1e5;l.job.rank=l.job.rankTracked=2;const d=E.DEC.public_scandal101.make(l,()=>.5);d.data.topic=topic;ok(E.DEC.public_scandal101.valid(l,d.data),'scandal valid for public career');E.DEC.public_scandal101.apply(l,d,key,()=>.4,log(l));ok(l.record===0,'rumour does not invent conviction');l.age++;ok(!E.DEC.public_scandal101.valid(l,d.data),'old scandal choice rejected');
}
for(const id of ['map_mo101','casual101']){
 const child=life();child.age=17;ok(!E.DEC[id].valid(child),'adult gate '+id);
 const l=life(),d=E.DEC[id].make(l,()=>.5);ok(d.data.age>=18,'adult peer');l.partner={name:'Đang yêu',alive:true};ok(!E.DEC[id].valid(l,d.data),'single gate');
}
{
 const l=life(),d=E.DEC.map_mo101.make(l,()=>.5);E.DEC.map_mo101.apply(l,d,'ask',()=>.1,log(l));ok(l.partner.name===d.data.n,'relationship keeps actual named peer');
 const casual=life(),c=E.DEC.casual101.make(casual,()=>.5);E.DEC.casual101.apply(casual,c,'no',()=>.5,log(casual));ok(!casual.partner&&!casual.flags.casual101,'refusal has no forced relationship');
}
console.log('Continuity: '+checks+' checks passed');
