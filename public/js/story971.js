/* Extends PACE145 and existing child/follower ledgers: fewer interruptions, persistent consequences. */
(function(G){
 'use strict';
 var E=G.E,H=E.H,U=G.U,X=E.UPDATE110,P=E.PACE145;
 function random(l,key){return E.LIFE138.random(l.id+':story971:'+key);}
 function state(l){var s=P.state(l);return s.story971||(s.story971={mode:'calm',seen:{},offered:[],history:[]});}
 function year(l){return l.birthYear+l.age;}
 function requested(d){return d.manual||d.data?.requested||d.data?.actionId850;}
 var ROUTINE=/^(world_cuisine173|world_festival173|world_school173|world_workplace173|world_integration173|world_doi_song|localLife907|localLife138|goalAsk920|nd_su_kien|family100_.+|law122|anniversary122|nghe_chuyen_moi|gia_dinh_hai_ben51|pv_nguoi_quen|pv_du_lich)$/;
 function ongoing(l,d){
  if(!/^country_.*173$/.test(d.id))return false;
  return Object.values(l.flags.culture173?.cases||{}).some(function(q){return q&&q.status==='active';});
 }
 function optional(l,d,src){
  if(!d||requested(d))return false;
  if(ongoing(l,d))return false;
  if(ROUTINE.test(d.id)||/^country_.*173$/.test(d.id))return true;
  // Low-stakes child vignettes share the same yearly prompt budget as other routine scenes.
  // Health, bullying, running away, and other consequential events remain outside this list.
  if(d.id==='moment141')return ['nightCry','tantrum','imaginary','firstClass','share','schoolFriend','talent','scienceFair','crush','peer','style','exam10','partTime','scholar','compare','privilege','exchange','moveOut','firstSalary','switch','travel','marriageView','kidsView','caregive','broke'].includes(d.data?.arg?.ev);
  return !!(src&&(src.ai||typeof src.when==='function'&&!src.rep)&&P.tier(d)==='daily');
 }
 function adultPrompt(l,d){
  if(d.id==='nd_su_kien')return d.data?.age>=18;
  if(/^family100_/.test(d.id)&&d.data?.type==='child'){var k=l.kids[d.data.index];return !!k&&l.age-k.born>=18;}
  return false;
 }
 function cuisineMuted(l){return !!l.flags.culture173?.kitchen?.noAuto971;}
 function canQueue(l,d,q,src){
  if(!optional(l,d,src))return true;
  if(d.id==='world_cuisine173'&&cuisineMuted(l)||adultPrompt(l,d))return false;
  var s=state(l);if(s.mode==='full')return true;
  var active=Math.floor(random(l,'quiet:'+Math.floor(l.age/3))()*3);
  if(((l.age%3)+3)%3!==active)return false;
  if(s.offered.some(function(x){return x.age===l.age;})||(q||[]).some(function(x){return x!==d&&!requested(x)&&(x.optional971||optional(l,x));}))return false;
  if((q||[]).filter(function(x){return !requested(x);}).length>=2)return false;
  var gap=/^(family100_|nd_su_kien)/.test(d.id)?6:d.id==='goalAsk920'?8:5;
  if(s.seen[d.id]!=null&&l.age-s.seen[d.id]<gap)return false;
  d.optional971=true;return true;
 }
 function offered(l,d,src){
  if(!optional(l,d,src))return;
  d.optional971=true;var s=state(l);s.seen[d.id]=l.age;s.offered.push({age:l.age,id:d.id});if(s.offered.length>32)s.offered.shift();
  var keys=Object.keys(s.seen);if(keys.length>64)delete s.seen[keys.sort(function(a,b){return s.seen[a]-s.seen[b];})[0]];
 }
 function trim(l){
  var kept=[],s=state(l),routine=false;
  (l.pending||[]).forEach(function(d){
   if(!optional(l,d)){kept.push(d);return;}
   if(d.id==='world_cuisine173'&&cuisineMuted(l)||adultPrompt(l,d))return;
   if(s.mode!=='full'&&routine)return;
   // Queued stories already admitted this year stay available across save/reload.
   if(!d.optional971&&!canQueue(l,d,kept))return;
   if(!d.optional971)offered(l,d);routine=true;kept.push(d);
  });l.pending=kept;
 }
 P.optional971=canQueue;P.offered971=offered;
 var begin=E.beginYear;E.beginYear=function(l){trim(l);var out=begin.apply(this,arguments);trim(l);return l.pending;};
 var finish=E.finishYear;E.finishYear=function(l){var out=finish.apply(this,arguments);trim(l);return out;};
 X.menu('storySettings971','Nhịp sống và lời nhắc',function(l){return l.alive?true:'Cuộc đời đã kết thúc';},function(l){return 'Nhịp hiện tại: '+(state(l).mode==='full'?'nhiều chuyện đời thường':'thưa, có những năm yên ả')+'. Các việc có hạn, biến cố và câu chuyện đang xử lý vẫn tiếp tục. Bạn có thể chủ động mở hoạt động khi muốn.';},function(l){return [
  {k:'calm',l:'Giữ nhịp thưa, ưu tiên những chuyện đáng quyết định',run:function(l,r,log){state(l).mode='calm';log('Bạn chọn nhịp sống thưa lời nhắc.','neutral');}},
  {k:'full',l:'Nhận thêm chuyện đời thường',run:function(l,r,log){state(l).mode='full';log('Bạn chọn nhận thêm những chuyện đời thường.','neutral');}},
  {k:'cuisine',l:cuisineMuted(l)?'Bật lại gợi ý ẩm thực':'Ẩn gợi ý nấu ăn và ẩm thực',run:function(l,r,log){var s=l.flags.culture173||(l.flags.culture173={}),q=s.kitchen||(s.kitchen={learned:{},cooked:{},lastAt:null});q.noAuto971=!q.noAuto971;log(q.noAuto971?'Đã ghi nhớ: bạn không muốn được nhắc việc nấu ăn.':'Bạn cho phép gợi ý nấu ăn trở lại.','neutral');}}
 ];},0,'Bản thân');
 function child(l,id){return (l.kids||[]).find(function(k){return k.alive!==false&&X.uid(l,k)===id;});}
 function relation(k){return k.persona141?.plan?.relationship971;}
 function onCrush(l,k,choice,log){
  var a=l.age-k.born;if(a<12||a>16||relation(k))return false;
  var p=E.CHILD141.init(l,k),r=random(l,'teen:'+X.uid(l,k)),sex=k.orient==='gay'?k.sex:k.orient==='bi'?(r()<.5?'M':'F'):k.sex==='F'?'M':'F';
  var peer={name:H.stranger(l,r,sex),sex:sex,birth:l.birthYear+k.born,alive:true};X.uid(l,peer);
  p.plan.relationship971={token:X.uid(l,k)+':relationship:'+year(l),peer:peer,phase:'crush',at:a,next:Math.max(14,a+1),policy:choice,history:[{age:a,choice:choice}],riskYears:[],support:0};
  log(choice==='safety'?'Bạn và con thống nhất cách giữ an toàn và tìm người hỗ trợ. Cuộc trò chuyện sẽ có ý nghĩa khi con gặp lựa chọn thật.':choice==='ban'?'Con chưa thôi thích người ấy, nhưng dè dặt hơn khi kể với gia đình.':'Cảm xúc của con được ghi nhớ; mối quan hệ còn tùy mong muốn của cả hai.','neutral');return true;
 }
 function teenRisk(l,k){
  var q=relation(k),p=E.CHILD141.init(l,k),a=l.age-k.born;if(!q||q.phase!=='dating'||a<14||a>18||q.peer.sex===k.sex)return 0;
  var communication=U.clamp((p.trust-p.fear)/100,0,1),base=.025+p.traits.impulse/2000+(100-p.traits.regulation)/3000;
  return U.clamp(base*({safety:.25,talk:.6,ignore:1,ban:1.1}[q.policy]||.8)*(1-communication*.25),.002,.12);
 }
 function familyChoice(l,k,key,log){
  var q=relation(k);if(!q||q.phase!=='pregnancy'||q.plan)return false;
  if(!['together','limited','community'].includes(key))return false;
  var immediate=key==='together'?l.base*.03:key==='limited'?l.base*.01:0;if(l.money<immediate)return false;
  if(immediate)H.cash(l,-immediate,'Khoản hỗ trợ tự nguyện khi con chuẩn bị làm cha mẹ');
  q.plan=key;q.support=key==='together'?l.base*.04:key==='limited'?l.base*.015:0;q.supportUntil=q.due+2;
  q.history.push({age:l.age-k.born,choice:key,paid:immediate});
  log(key==='community'?'Bạn giữ giới hạn tài chính, giúp con liên hệ người có thể hỗ trợ và cùng bên gia đình còn lại bàn trách nhiệm.':key==='together'?'Hai gia đình bắt đầu bàn việc chăm sóc, đi khám và thu xếp để con còn đường học tiếp.':'Bạn thống nhất khoản hỗ trợ vừa khả năng; con và người cùng làm cha mẹ vẫn phải chia sẻ trách nhiệm.','neutral');return true;
 }
 function openFamily(l,k,r){
  var q=relation(k);if(!q||q.phase!=='pregnancy'||q.plan||q.askedAt===l.age)return;
  if(l.pending.some(function(d){return d.id==='teenFamily971'&&d.data?.arg?.id===X.uid(l,k);}))return;
  q.askedAt=l.age;X.next(l,'teenFamily971',r,{id:X.uid(l,k),token:q.token},{manual:false});
 }
 function teenYear(l,log){
  if(!l.alive)return;
  (l.kids||[]).forEach(function(k){var q=relation(k),a=l.age-k.born;if(!q||k.alive===false||q.year===a)return;q.year=a;
   var r=random(l,q.token+':'+a);
   if(q.phase==='crush'&&a>=q.next){
    if(a>18||r()>.55+E.CHILD141.init(l,k).traits.extro/300){q.phase='closed';q.history.push({age:a,event:'không tiến tới hẹn hò'});return;}
    q.phase='dating';q.history.push({age:a,event:'hai người đồng ý tìm hiểu'});log(k.name+' bắt đầu tìm hiểu '+q.peer.name+', một người bạn cùng lứa. '+(q.policy==='ban'?'Con ít kể chuyện này với gia đình.':'Con vẫn giữ những điều đã trao đổi với bạn.'),'neutral');
   }
   if(q.phase==='dating'){
    if(a>18||a-q.at>=5||r()<.12){q.phase='closed';q.history.push({age:a,event:'mối tình đầu khép lại'});return;}
    var chance=teenRisk(l,k);q.riskYears.push({age:a,chance:chance});
    if(chance>0&&r()<chance){q.phase='pregnancy';q.due=a+1;q.reported=a;q.history.push({age:a,event:'thai kỳ ngoài dự định'});
     E.CHILD141.remember(l,k,'Năm '+k.name+' và '+q.peer.name+' đối diện việc có con ngoài dự định.',4,'neutral');
     log(k.sex==='F'?k.name+' cho biết mình đang mang thai ngoài dự định. Gia đình cần cùng con bàn chăm sóc, học tập và trách nhiệm của hai bên.':k.name+' báo tin '+q.peer.name+' đang mang thai ngoài dự định. Con phải cùng người ấy bàn trách nhiệm, chăm sóc và việc học.','big');openFamily(l,k,r);
    }
   }else if(q.phase==='pregnancy'&&a>=q.due){
    q.phase='parenting';q.birthAt=a;var baby={id:q.token+':baby',name:H.name(l,r,r()<.5?'M':'F').full,year:year(l),parents:[X.uid(l,k),q.peer.uid110]};
    q.baby=baby;k.kids=(k.kids||0)+1;l.grand=(l.grand||0)+1;
    var p=E.CHILD141.init(l,k);p.plan.education971={at:a,status:'adjusted',resumeAt:a+1};
    if(k.uniUntil&&k.uniUntil>a)k.uniUntil++;k.study=U.clamp((k.study||50)-3,0,100);
    log('Em bé của '+k.name+' và '+q.peer.name+' chào đời. '+(q.plan==='together'?'Người thân đã thống nhất chia việc chăm sóc.':'Hai người phải tiếp tục thu xếp chỗ dựa và lịch chăm bé.')+' Việc học của con cần một lịch mới.','big');
   }else if(q.phase==='pregnancy')openFamily(l,k,r);
   if(q.phase==='parenting'){
    var p=E.CHILD141.init(l,k),ed=p.plan.education971;
    if(ed?.status==='adjusted'&&a>=ed.resumeAt){ed.status='resumed';k.study=U.clamp((k.study||50)+2,0,100);log(k.name+' bắt đầu trở lại nhịp học theo lịch đã thu xếp; việc chăm con vẫn cần chia sẻ.','neutral');}
    if(q.support>0&&a<=q.supportUntil&&q.paidAge!==a){q.paidAge=a;var paid=Math.min(q.support,Math.max(0,l.money));if(paid>0)H.cash(l,-paid,'Hỗ trợ chăm cháu theo khoản đã tự nguyện thống nhất');q.history.push({age:a,paid:paid,expected:q.support});if(paid<q.support)log('Năm nay bạn không đủ khoản hỗ trợ đã hẹn cho '+k.name+'; gia đình cần thu xếp lại ngân sách chăm bé.','neutral');}
    if(a>q.supportUntil)q.phase='resolved';
   }
  });
 }
 X.menu('teenFamily971','Cùng con đối diện việc làm cha mẹ',function(l){return l.alive?true:'Cuộc đời đã kết thúc';},function(l,d){var k=child(l,d.arg.id),q=k&&relation(k);return q?k.name+' và '+q.peer.name+' đang đối diện thai kỳ ngoài dự định. Hai bên cần được lắng nghe, có người hỗ trợ và bàn việc học cùng trách nhiệm chăm sóc.':'Hoàn cảnh đã thay đổi.';},function(l,arg){var k=child(l,arg.id),q=k&&relation(k);if(!q||q.phase!=='pregnancy'||q.plan||arg.token!==q.token)return [];return [
  {k:'together',l:'Cùng hai gia đình thu xếp chăm sóc và giữ đường học',why:l.money>=l.base*.03?true:'Chưa đủ khoản hỗ trợ dự kiến',run:function(l,r,log){familyChoice(l,k,'together',log);}},
  {k:'limited',l:'Thống nhất khoản hỗ trợ trong khả năng của mình',why:l.money>=l.base*.01?true:'Chưa đủ khoản hỗ trợ dự kiến',run:function(l,r,log){familyChoice(l,k,'limited',log);}},
  {k:'community',l:'Giữ giới hạn tài chính, giúp con tìm người hỗ trợ',run:function(l,r,log){familyChoice(l,k,'community',log);}}
 ];},16);
 E.HOOKS.year.push(function(l,r,log){teenYear(l,log);});
 E.STORY971={state:state,canQueue:canQueue,offered:offered,optional:optional,trim:trim,cuisineMuted:cuisineMuted,onCrush:onCrush,teenRisk:teenRisk,familyChoice:familyChoice,teenYear:teenYear,relation:relation};
})(globalThis.G);
