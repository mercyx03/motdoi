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
   if(d.id==='teenFamily971'){
    var k=child(l,d.data?.arg?.id);
    if(!k||!canPlan(l,k)||relation(k).token!==d.data.arg.token)return;
   }
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
 function child(l,id){return id&&(l.kids||[]).find(function(k){return k.alive!==false&&X.uid(l,k)===id;});}
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
 var CARE_PLANS={
  together:{first:.03,annual:.04,time:24,partner:9,label:'Cùng hai gia đình chia lịch chăm bé và hỗ trợ chi phí'},
  limited:{first:.01,annual:.015,time:7,partner:5,label:'Góp một khoản vừa khả năng, để hai con tự chia lịch'},
  community:{first:0,annual:0,time:13,partner:6,label:'Giúp con tìm người thân hoặc chỗ hỗ trợ chăm bé'},
  independent:{first:0,annual:0,time:0,partner:0,label:'Để hai con tự thu xếp việc chăm bé'}
 };
 function familyChoice(l,k,key,log){
  var q=relation(k);if(!q||q.phase!=='pregnancy'||q.plan)return false;
  var plan=Object.prototype.hasOwnProperty.call(CARE_PLANS,key)&&CARE_PLANS[key];
  if(!plan||l.age-k.born>=q.due)return false;
  var immediate=l.base*plan.first;if(immediate>0&&l.money<immediate)return false;
  if(immediate)H.cash(l,-immediate,'Khoản hỗ trợ tự nguyện khi con chuẩn bị làm cha mẹ');
  q.plan=key;q.support=l.base*plan.annual;q.supportUntil=q.due+2;
  q.history.push({age:l.age-k.born,choice:key,paid:immediate});
  log(plan.label+'. Lịch thực tế sẽ tùy vào thời gian và khả năng của từng người.','neutral');return true;
 }
 function canPlan(l,k){
  var q=relation(k);
  return !!q&&q.phase==='pregnancy'&&!q.plan&&l.age-k.born<q.due;
 }
 function openFamily(l,k,r,manual){
  var q=relation(k);if(!canPlan(l,k)||(!manual&&q.askedAt!=null))return;
  var id=X.uid(l,k);
  if(l.pending.some(function(d){return d.id==='teenFamily971'&&d.data?.arg?.id===id;}))return;
  if(X.next(l,'teenFamily971',r,{id:id,token:q.token},{manual:!!manual}))q.askedAt=l.age;
 }
 function learningTrack(l,k,a){
  if(k.uniUntil)return 'university';
  var courses=l.flags.expansion110?.courses170||[];
  if(courses.length&&courses.some(function(c){return c.status==='active'&&c.learner===X.uid(l,k);}))return 'course';
  if((a<=18||relation(k)?.care973?.schoolDelayed)&&!k.path18&&(k.edu||0)<3&&k.vice!=='bỏ học'&&!k.job)return 'school';
  return k.job?'work':'home';
 }
 function careYear(l,k,log){
  var q=relation(k),a=l.age-k.born;
  if(!q||!l.alive||k.alive===false||k.died!=null)return null;
  var newborn=q.phase==='pregnancy'&&a>=q.due;
  if(!newborn&&q.phase!=='parenting')return null;
  if(newborn){
   if(!q.plan){q.plan='independent';q.support=0;q.history.push({age:a,choice:'independent',defaulted:true});}
   q.phase='parenting';q.birthAt=a;
   var r=random(l,q.token+':birth');
   q.baby={id:q.token+':baby',name:H.name(l,r,r()<.5?'M':'F').full,year:year(l),parents:[X.uid(l,k),q.peer.uid110]};
   k.kids=(k.kids||0)+1;l.grand=(l.grand||0)+1;
   l.pending=l.pending.filter(function(d){return d.id!=='teenFamily971'||d.data?.arg?.token!==q.token;});
  }
  var care=q.care973||(q.care973={lastAge:newborn?null:q.year,pauseCount:0,history:[]});
  if(care.lastAge===a)return care;
  if(a>(q.birthAt??q.due)+2){
   q.phase='resolved';
   log('Lịch chăm bé của '+k.name+' đã qua giai đoạn đầu.'+(q.support>0?' Các khoản hỗ trợ đã hẹn kết thúc.':''),'neutral');
   return null;
  }
  care.lastAge=a;
  var plan=CARE_PLANS[q.plan]||CARE_PLANS.independent;
  var committed=a<=q.supportUntil?Math.max(0,q.support||0):0;
  var paid=Math.min(committed,Math.max(0,l.money));
  if(paid>0&&q.paidAge!==a){H.cash(l,-paid,'Hỗ trợ chăm cháu theo khoản đã thống nhất');q.paidAge=a;}
  var cannotHelp=l.jailUntil>l.age||l.abroad?.trapped||l.st.hea<35;
  var away=k.custody==='ex'||k.custody==='other'||k.abroadStudy&&k.uniUntil||l.abroad&&!l.abroad.perm;
  var availability=cannotHelp?0:away ? .35 : 1;
  var relief=committed?paid/committed:0;
  var yearsWithBaby=Math.max(0,a-(q.birthAt??q.due));
  var otherParent=q.peer.alive===false?0:Math.round(19+random(l,q.token+':co-parent')()*18+plan.partner+yearsWithBaby*3);
  var helpers=Math.round(plan.time*availability+relief*12+yearsWithBaby*3);
  var childShare=100-otherParent-helpers;
  var track=learningTrack(l,k,a),education=['school','university','course'].includes(track);
  var previous=care.schedule;
  var status=education?(childShare>=62&&care.pauseCount<2?'paused':childShare>=42?'flex':'regular'):
    track==='work'?(childShare>=55?'reduced':'working'):(childShare>=55?'careFirst':'available');
  if(status==='paused'){
   care.pauseCount++;
   if(track==='university')k.uniUntil++;
   if(track==='school')care.schoolDelayed=true;
  }
  if(education&&status!=='regular')k.study=U.clamp((k.study??50)-(status==='paused'?5:2),0,100);
  care.schedule={track:track,status:status,child:childShare,otherParent:otherParent,helpers:helpers,paid:paid,committed:committed};
  care.history.push(Object.assign({age:a},care.schedule));
  if(newborn){
   var fallback=q.history.some(function(row){return row.defaulted;});
   log('Em bé của '+k.name+' và '+q.peer.name+' chào đời. '+(fallback?'Hai con tự thu xếp việc chăm bé. ':'')+careText(l,k),'big');
  }else if(previous?.status!==status){
   log(k.name+' đã thu xếp lại lịch. '+careText(l,k),'neutral');
  }
  if(paid<committed&&!care.shortfall)log('Khoản hỗ trợ năm nay chưa đủ như đã hẹn. '+k.name+' phải tự thu xếp thêm thời gian chăm bé.','neutral');
  care.shortfall=paid<committed;
  return care;
 }
 function careText(l,k){
  var q=relation(k),schedule=q?.care973?.schedule;
  if(!schedule)return '';
  if(q.phase==='resolved'){
   var paused=q.care973.pauseCount;
   return 'Giai đoạn thu xếp chăm bé ban đầu đã kết thúc.'+(paused?' Con từng tạm nghỉ học '+paused+' năm để chăm bé.':'');
  }
  var labels={paused:'tạm nghỉ học trong năm này',flex:'học theo lịch linh hoạt',regular:'tiếp tục lịch học',reduced:'giảm thời gian làm việc',
    working:'giữ lịch làm việc',careFirst:'ưu tiên chăm bé, hoãn tìm việc',available:'đã có thêm thời gian để tìm việc hoặc học nghề'};
  return 'Lịch chăm bé: '+k.name+' đảm nhận khoảng '+schedule.child+'%, bên còn lại '+schedule.otherParent+'%, người hỗ trợ '+schedule.helpers+'%. '+
    k.name+' '+labels[schedule.status]+'.';
 }
 function learningPaused(l,k){
  var care=relation(k)?.care973;
  return care?.lastAge===l.age-k.born&&care.schedule?.status==='paused';
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
   }else if(q.phase==='pregnancy')openFamily(l,k,r);
  });
 }
 X.menu('teenFamily971','Cùng con đối diện việc làm cha mẹ',function(l){return l.alive?true:'Cuộc đời đã kết thúc';},function(l,d){
  var k=child(l,d.arg.id),q=k&&relation(k);
  return q?k.name+' và '+q.peer.name+' cần chia thời gian chăm bé và thu xếp việc học hoặc công việc. Có thể bàn lại trong hồ sơ của con trước khi bé chào đời.':'Hoàn cảnh đã thay đổi.';
 },function(l,arg){
  var k=child(l,arg.id);if(!k||!canPlan(l,k)||arg.token!==relation(k).token)return [];
  return Object.keys(CARE_PLANS).map(function(key){
   var plan=CARE_PLANS[key];
   return {k:key,l:plan.label,h:plan.annual?'Chuẩn bị '+H.money(l,l.base*plan.first)+' · dự kiến '+H.money(l,l.base*plan.annual)+'/năm trong 3 năm':'',
    why:!plan.first||l.money>=l.base*plan.first?true:'Chưa đủ khoản hỗ trợ dự kiến',run:function(l,r,log){familyChoice(l,k,key,log);}};
  });
 },16);
 E.DEC.teenFamily971.auto=function(l,d){
  var index=d.data?.keys?.indexOf('independent');
  return index>=0?String(index):'cancel';
 };
 var convert=E.abroadConvert;E.abroadConvert=function(l,factor){
  var out=convert.apply(this,arguments);
  (l.kids||[]).forEach(function(k){var q=relation(k);if(q&&q.support>0)q.support*=factor;});
  return out;
 };
 E.HOOKS.year.push(function(l,r,log){teenYear(l,log);});
 E.STORY971={state:state,canQueue:canQueue,offered:offered,optional:optional,trim:trim,cuisineMuted:cuisineMuted,onCrush:onCrush,teenRisk:teenRisk,familyChoice:familyChoice,teenYear:teenYear,relation:relation,canPlan:canPlan,openFamily:openFamily,careYear:careYear,careText:careText,learningPaused:learningPaused};
})(globalThis.G);
