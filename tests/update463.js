'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..','public'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [,f]of html.matchAll(/<script src="(js\/[^"?]+)\?v=[^"]+"[^>]*><\/script>/g))if(!['js/app.js','js/music.js','js/card.js','js/account.js'].includes(f))vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
const E=G.E,U=G.U;let checks=0;function ok(x,t){assert.ok(x,t);checks++;}
function life(seed=463){const l=E.createLife({mode:'vn',seed,gender:seed%2?'M':'F'});l.age=28;l.birthYear=2032;l.indep=true;l.pending=[];l.school=null;l.flags={};l.abroad=null;l.money=1000;l.st.hea=100;l.st.soc=60;l.st.kno=70;E.startJob(l,'dien_vien',()=>.5,()=>{});l.fame=500000;return l;}
function open(l,k,manual=false){const d=E.DEC.gameshow.make(l,()=>U.rand(l));d.manual=manual;l.pending=[d];E.resolve(l,k);return l.pending[0];}
function finish(l,choice='team'){let guard=0;while(l.pending.some(d=>d.id==='vr_vong')&&guard++<40)E.resolve(l,choice);ok(guard<=30,'chuỗi dừng hữu hạn');}
for(const k of ['rm','hai'])for(let seed=1;seed<=30;seed++){
 const outcomes={};
 for(const role of ['guest','regular']){
  const l=life(seed),cash=l.money,fame=l.fame,menu=open(l,k,true);
  ok(menu.id==='vr_vai_tro'&&menu.opts.some(o=>o.k==='guest')&&menu.opts.some(o=>o.k==='regular'),'chọn vai trò sau khi chọn show');ok(!l.flags.variety&&l.money===cash&&l.fame===fame,'xem báo giá chưa quay, chưa có tiền hoặc người theo dõi');ok(menu.manual===true,'menu vai trò giữ lựa chọn thủ công');
  const expected=E.VARIETY.quote(menu.data.fee,role);ok(menu.opts.find(o=>o.k===role).h.includes(E.H.money(l,expected)),'giá hiển thị đúng hợp đồng');
  E.resolve(l,role);const v=l.flags.variety;ok(v.role===role&&v.total===(role==='guest'?2:6)&&v.fee===expected,'vai trò quyết định lịch và cát-xê');ok(l.pending[0].manual===true,'từng chặng giữ chế độ tự chọn');
  const teams=new Set();while(l.pending.some(d=>d.id==='vr_vong')){
   const d=l.pending[0],all=v.team.concat(v.opponents);ok(new Set(all).size===8&&v.team[0]===l.name,'chia đội không trùng người và giữ nhân vật');ok(v.guests.length===2&&v.guests.includes(l.name)===(role==='guest'),'khách mời có nhân vật, cố định ở dàn cast');ok(!/undefined|NaN/.test(d.title+d.text+JSON.stringify(d.opts)),'nội dung đầy đủ');teams.add(v.team.join('|'));E.resolve(l,'team');
  }
  ok(v.done&&v.paid&&v.completed===v.total&&v.history.length===(role==='guest'?4:12),'khách mời ít sự kiện hơn cố định');ok(l.money===cash+expected,'quyết toán đúng một lần');ok(l.fame>fame&&l.fame-fame===v.audienceGain&&l.flags.tvAudience.episodes===v.total,'mỗi tập tăng danh tiếng và lưu mức quan tâm');ok(l.flags.tvAudience.followers===v.audienceGain,'thống kê khán giả không cộng trùng');
  ok(new Set(v.tasks).size===v.total&&new Set(v.routes).size===v.total,'nhiệm vụ và địa điểm thay đổi mỗi tập');ok(l.log.filter(e=>/Phản hồi khán giả:/.test(e.t)).length===v.total,'mỗi tập có phản hồi khán giả');
  outcomes[role]={fee:v.fee,fame:v.audienceGain,count:v.history.length};
  const after={money:l.money,fame:l.fame,count:l.flags.tvAudience.episodes};E.DEC.vr_vai_tro.apply(l,menu,'regular',()=>.5,()=>{});ok(l.money===after.money&&l.fame===after.fame&&l.flags.tvAudience.episodes===after.count,'menu cũ không đổi hợp đồng hoặc nhận thêm lợi ích');
 }
 ok(outcomes.regular.fee>outcomes.guest.fee&&outcomes.regular.count>outcomes.guest.count&&outcomes.regular.fame>outcomes.guest.fame,'cùng đầu vào: cố định có nhiều sự kiện, tiền và nhận diện hơn khách mời');
}
for(const role of ['guest','regular'])for(const k of ['rm','hai']){
 const l=life();open(l,k);E.resolve(l,role);const v=l.flags.variety;const fame=l.fame;let guard=0;
 while(l.pending.length&&guard++<40){const d=l.pending.shift();E.DEC[d.id].apply(l,d,d.data.challenge51!=null?(E.LIFE51.challenges[d.data.challenge51].strategies?'pick0':'pick'+((E.LIFE51.challenges[d.data.challenge51].answer+1)%3)):'team',()=>.999,(t,k)=>l.log.push({t,k,a:l.age}));}
 ok(v.wins===0&&v.done&&v.audienceGain>0&&l.fame>fame,'thua mọi trò vẫn được khán giả biết đến');
}
for(const role of ['guest','regular']){
 const l=life();open(l,'hai');E.resolve(l,role);const steps=2;for(let i=0;i<steps;i++)E.resolve(l,'team');const v=l.flags.variety;const followers=l.fame;E.resolve(l,'quit');ok(v.completed===1&&v.earned===Math.round(v.fee/v.total)&&l.money===1000+v.earned,'rút lui trả đúng tập đã hoàn thành');ok(l.fame===followers&&l.flags.tvAudience.episodes===1,'rút lui không cộng khán giả cho tập chưa quay');
 const q=life();open(q,'rm');E.resolve(q,role);E.resolve(q,'quit');ok(q.money===1000&&q.fame===500000&&!q.flags.tvAudience,'chưa quay tập nào không nhận cát-xê hoặc fame');
}
{
 const l=life(),menu=open(l,'hai');const clone=E.migrate(JSON.parse(JSON.stringify(l)));E.resolve(l,'guest');E.resolve(clone,'guest');finish(l);finish(clone);ok(JSON.stringify(l.flags.variety)===JSON.stringify(clone.flags.variety)&&l.money===clone.money&&l.fame===clone.fame,'lưu giữa menu vai trò rồi tiếp tục tất định');
 const q=life();open(q,'rm');E.resolve(q,'regular');for(let i=0;i<8;i++)E.resolve(q,'team');const saved=E.migrate(JSON.parse(JSON.stringify(q)));finish(q);finish(saved);ok(JSON.stringify(q.flags.variety)===JSON.stringify(saved.flags.variety),'lưu giữa mùa cố định giữ đội, điểm, tiền và vai trò');
 const stale=life(),old=open(stale,'rm');open(stale,'hai');E.DEC.vr_vai_tro.apply(stale,old,'guest',()=>.5,()=>{});ok(stale.flags.varietyOffer.k==='hai'&&!stale.flags.variety,'menu cũ không xác nhận hoặc xóa lời mời mới');
 const cancel=life();open(cancel,'rm');E.resolve(cancel,'no');ok(!cancel.flags.variety&&!cancel.flags.varietyOffer&&cancel.money===1000,'từ chối vai trò không tạo hợp đồng');
 for(const state of ['year','jail','music','dead','health']){const a=life(),d=open(a,'rm');if(state==='year')a.age++;if(state==='jail')a.jailUntil=a.age+2;if(state==='music')a.flags.tv={k:'atsh',done:false};if(state==='dead')a.alive=false;if(state==='health')a.st.hea=20;ok(!E.DEC.vr_vai_tro.valid(a,d.data),'lời mời hết hiệu lực: '+state);E.DEC.vr_vai_tro.apply(a,d,'guest',()=>.5,()=>{});ok(!a.flags.variety&&a.money===1000,'không bắt đầu sai hoàn cảnh: '+state);}
}
{
 const l=life();open(l,'rm');E.resolve(l,'regular');const v=l.flags.variety;delete v.role;delete v.compact;v.stage=0;l.pending=[E.DEC.vr_vong.make(l,()=>.5)];v.total=3;v.fee=600;v.routes=v.routes.slice(0,3);v.tasks=v.tasks.slice(0,3);finish(l);ok(v.completed===3&&v.history.length===15&&v.earned===600,'save cũ ba chuyến giữ lịch và tiền cũ');
 const foreign=life();foreign.cur='usd';foreign.base=50000;const d=open(foreign,'hai');E.resolve(foreign,'guest');const fee=E.VARIETY.quote(d.data.fee,'guest');finish(foreign);ok(foreign.flags.variety.earned===fee&&Number.isFinite(foreign.money),'hợp đồng vẫn dùng đúng đơn vị tiền hiện tại');
}
{
 const l=life();l.edu=5;l.partner=null;const fame=l.fame;const d=E.DEC.hh_bmhh.make(l,()=>.5);l.pending=[d];E.resolve(l,'that');ok(l.fame>fame,'show hẹn hò cũng tăng nhận diện');
 const m=life();E.startJob(m,'ca_si',()=>.5,()=>{});m.sex='M';m.skill=80;m.fame=500000;const prior=m.fame;const d2=E.DEC.tv_moi.make(m,()=>.5);m.pending=[d2];E.resolve(m,'nhan');ok(m.flags.tv&&m.fame>prior,'show âm nhạc tiếp tục tăng danh tiếng');
}
{
 const l=life();open(l,'rm');const auto=E.DEC.vr_vong.auto;E.DEC.vr_vong.auto=function(l,d){return d.opts[0].k;};let checked=false;
 try{l.pending[0].opts=l.pending[0].opts.filter(o=>o.k==='regular');E.runHeadless(l,x=>{if(x.age===28){const v=x.flags.variety;ok(v.done&&v.completed===6,'AI giải quyết hết lịch cố định dài trước khi tính tài chính năm');ok(x.fin.items.some(i=>/Cát-xê/.test(i.t)&&i.v===v.fee),'cát-xê mùa dài nằm trong tài chính đúng năm');checked=true;}});}finally{E.DEC.vr_vong.auto=auto;}
 ok(checked,'đã kiểm tra chuỗi dài trong vòng chạy đời thật');
}
for(let seed=1;seed<=60;seed++){
 const l=life(463000+seed);open(l,seed%2?'rm':'hai');E.resolve(l,seed%3?'guest':'regular');const season=l.flags.variety;E.runHeadless(l);
 ok(!l.alive&&l.death&&Number.isFinite(l.money),'mô phỏng đời sau khi nhận lịch quay kết thúc hợp lệ');ok(season.done&&season.paid&&season.earned>=0&&season.earned<=season.fee,'lịch quay luôn được đóng và quyết toán trong giới hạn');ok(l.log.every(e=>!/undefined|NaN|\[object Object\]/.test(e.t))&&l.log.at(-1).k==='death','nhật ký sạch, không có sự kiện sau khi chết');
}
console.log('PASS: '+checks+' kiểm tra vai trò game show bản 4.6.3.');
