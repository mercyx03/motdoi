const fs=require('fs'),vm=require('vm'),assert=require('assert');const html=fs.readFileSync('public/index.html','utf8');for(const [,f]of html.matchAll(/<script src="(js\/[^"?]+)\?v=[^"]+"[^>]*><\/script>/g))if(!['js/app.js','js/music.js','js/card.js','js/account.js'].includes(f))vm.runInThisContext(fs.readFileSync('public/'+f,'utf8'));
const E=G.E;let n=0;function ok(x,t){assert.ok(x,t);n++;}function life(id,rank=0){const l=E.createLife({mode:'vn',seed:553});l.age=35;l.school=null;l.retired=false;l.indep=true;l.pending=[];l.job={id,rank,yrs:0};return l;}
const economy=E.EVENTS.find(x=>x.run.toString().includes('công ty cắt giảm nhân sự'));ok(economy,'economic event found');
for(const id of Object.keys(E.CAR)){
 const l=life(id);if(!E.isStableService(l))continue;
 for(let rank=0;rank<E.CAR[id].t.length;rank++){
  const x=life(id,rank),c=E.CAR[id],haz=c.haz;c.haz=null;
  try{ok(!economy.c(x,35),'no business layoffs '+id+':'+rank);economy.run(x,35,()=>.001,()=>{});ok(x.job&&x.job.id===id,'stale event safe '+id+':'+rank);E.careerYear(x,()=>.001,()=>{},'balance');ok(x.job&&x.job.id===id,'no random annual firing '+id+':'+rank);}finally{c.haz=haz;}
 }
}
for(const id of ['van_phong','ke_toan','dnnn']){const l=life(id);ok(!E.isStableService(l),'not all formal/state-owned companies protected '+id);ok(economy.c(l,35),'business economy event retained '+id);economy.run(l,35,()=>.5,()=>{});ok(!l.job&&l.flags.needJob,'business layoff still works '+id);}
{
 let l=life('cong_chuc');ok(!E.DEC.tang_luong.valid(l),'civil service no salary negotiation event');ok(E.actions(l).find(x=>x.id==='tang_luong').ok!==true,'civil service no salary negotiation action');
 l=life('can_bo_xa',1);E.TRAPS.dat_dai.run(l,()=>.9,()=>{});ok(!l.job&&l.flags.needJob,'misconduct dismissal retained');
 l=life('cong_chuc',1);let d=E.DEC.nn_tinh_gian.make(l,()=>.5);E.DEC.nn_tinh_gian.apply(l,d,'o_lai',()=>.5,()=>{});ok(l.job&&l.job.rank===1,'transfer retains job and rank');
 E.DEC.nn_tinh_gian.apply(l,d,'nghi',()=>.5,()=>{});ok(!l.job,'voluntary departure retained');
 const t=E.TRIG.find(x=>x.id==='nn_tinh_gian');ok(t.p===.012&&t.cd===10&&t.max===1,'restructure rare and once');
 l=life('cong_chuc');l.age=90;E.careerYear(l,()=>.5,()=>{},'balance');ok(l.retired&&!l.job,'normal retirement retained');
}
for(const job of ['công chức','cán bộ xã','viên chức địa phương','công an','quân đội','thẩm phán']){
 const l=life('van_phong');l.age=1;l.fam.mAge=30;l.fam.mAlive=true;l.fam.mJob=job;l.fam.mInc=10;l.fam.mInc0=10;l.fam.mRet=false;l.fam.mLost=null;l.fam.elite=null;E.parentYear(l,()=>.055,()=>{},'m');ok(!l.fam.mLost&&l.fam.mInc>0,'stable parent no layoffs '+job);
}
{const l=life('van_phong');l.age=1;l.fam.mAge=30;l.fam.mAlive=true;l.fam.mJob='nhân viên văn phòng';l.fam.mInc=10;l.fam.mRet=false;l.fam.mLost=null;l.fam.elite=null;E.parentYear(l,()=>.055,()=>{},'m');ok(l.fam.mLost>0&&l.fam.mInc===0,'private-sector parent loss remains');}
console.log('V5.5.3: '+n+' employment checks passed');
