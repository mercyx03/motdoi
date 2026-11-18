/* Dated locations, recovery choices and vocational routes extend POL/HIST/EDUCATION170. */
(function(G){
 'use strict';
 var E=G.E;if(!E||!E.ERA920||!E.ERA920.POL||!E.ERA920.HIST||!E.EDUCATION170)return;
 var H=E.H,U=G.U,X=E.UPDATE110,P=E.ERA920.POL,C=E.CTX945,B=E.EDUCATION170;
 function year(l){return l.birthYear+l.age;}
 function cc(l){return H.resCode(l);}
 var cities={
  BR:{'Brasília':{from:1956,ready:1960,label:'công trường Brasília'}},
  PK:{Islamabad:{from:1960}},
  MM:{Naypyidaw:{from:2002,ready:2005,label:'khu xây dựng gần Pyinmana'}},
  NG:{Abuja:{from:1976}},
  IL:{'Tel Aviv':{from:1909}}
 };
 var locations={},known={};
 G.W.C.forEach(function(c){locations[c.code]=new Set(c.cities);c.cities.forEach(function(n){known[n]=true;});});
 G.VN.P63.forEach(function(p){locations.VN.add(p.city);locations.VN.add(p.name);known[p.city]=known[p.name]=true;});
 function cityAllowed(code,y,name){name=P.canonicalCity(name);if(known[name]&&locations[code]&&!locations[code].has(name))return false;var a=cities[code],r=a&&a[name];return !r||y>=r.from;}
 function cityList(code,y){var a=code==='VN'?G.VN.P63.map(function(p){return p.city;}):(G.W.BY[code]||{}).cities||[];return a.filter(function(n){return cityAllowed(code,y,n);});}
 // Province keys remain stable spatial anchors; only the dated administrative label changes.
 var regions=[
  {from:1976,to:1990,name:'Nghệ Tĩnh',members:['Nghệ An','Hà Tĩnh']},
  {from:1976,to:1988,name:'Bình Trị Thiên',members:['Quảng Bình','Quảng Trị','Thừa Thiên Huế']},
  {from:1976,to:1996,name:'Sông Bé',members:['Bình Dương','Bình Phước']}
 ];
 function regionName(name,y){var r=regions.find(function(r){return y>=r.from&&y<=r.to&&r.members.includes(name);});return r?r.name:null;}
 function regionChoice(name,y){var n=regionName(name,y);return n?n+' · khu vực '+name:P.rename({birthYear:y,age:0},name);}
 function geoText(l,s){
  if(typeof s!=='string')return s;
  var a=cities[cc(l)],y=year(l);if(!a)return s;
  Object.keys(a).forEach(function(n){var r=a[n];if(r.label&&y>=r.from&&y<r.ready&&!s.includes(r.label))s=s.split(n).join(r.label);});return s;
 }
 P.cityAllowed=cityAllowed;P.cities=cityList;P.regionName=regionName;P.regionChoice=regionChoice;
 var rename=P.rename,place=E.placeText,fam=E.famLogic;
 P.rename=function(l,s){return geoText(l,rename(l,s));};
 E.placeText=function(l){return geoText(l,place.apply(this,arguments));};
 E.famLogic=function(l,s){return geoText(l,fam.apply(this,arguments));};
 var move=H.moveToCity;
 H.moveToCity=function(l,dest){var canonical=P.canonicalCity(dest);if(!cityAllowed(cc(l),year(l),canonical))return false;return move.call(this,l,canonical);};

 var relativeLife=E.ERA902.relativeLife;
 var routes=[
  {id:'apprentice',name:'Học nghề cùng thợ tại địa phương',from:1900,years:2,min:16,edu:1,rate:.06,level:0},
  {id:'kosen',name:'Kōsen — chương trình kỹ thuật 5 năm',country:'JP',from:1962,years:5,min:15,edu:2,rate:.12,level:4},
  {id:'dual',name:'Đào tạo nghề kép tại doanh nghiệp và trường nghề',country:'DE',from:1969,years:3,min:16,edu:2,rate:.1,level:4},
  {id:'bacpro',name:'Lycée nghề — baccalauréat professionnel',country:'FR',from:2009,years:3,min:15,edu:2,rate:.1,level:4},
  {id:'iti',name:'Đào tạo nghề ITI/CTS',country:'IN',from:1950,years:2,min:16,edu:2,rate:.08,level:4}
 ];
 function learners(l){return B.learners(l).filter(function(p){return p.person.alive!==false;});}
 function learner(l,id){return learners(l).find(function(p){return p.id===(id||'self');});}
 function route(l,id,p){var v=relativeLife(l,p&&p.person),r=routes.find(function(r){return r.id===id;});return r&&year(l)>=r.from&&(!r.country||r.country===cc(v))?r:null;}
 function learning(l,p){return ((l.flags.expansion110||{}).courses170||[]).some(function(k){return k.status==='active'&&k.route969&&k.learner===(p===l?'self':X.uid(l,p));});}
 function courseReason(l,id,key){
  var p=learner(l,id),r=p&&route(l,key,p);if(!p||!r)return 'Chưa có lộ trình này tại nơi và năm đang sống';
  if(X.reason(l,15)!==true)return X.reason(l,15);
  if(p.age<r.min||(p.person.edu||0)<r.edu)return 'Cần đủ tuổi và hoàn thành bậc học trước';
  if(p.person.jail||p.person.retired||p.person.uniUntil||p.person.internship170||p.person.abroadStudy)return 'Cần thu xếp lịch học và nơi cư trú';
  if(p.person.job&&!(p.id!=='self'&&p.age<18)&&!/^đang (đi học|học nghề)$/.test(p.person.job)||p.person.role147||p.person.school)return 'Cần hoàn tất hoặc rời chương trình, công việc hiện tại';
  if(B.courses(l).some(function(k){return k.learner===p.id&&k.status==='active';}))return 'Đang theo một khóa học';
  if(B.education(l,p.person).enrolledAt===l.age)return 'Đã đăng ký trong năm';
  var v=relativeLife(l,p.person),context=C.of(v);
  if(context.hard>=(r.id==='apprentice'?3:2))return 'Hoàn cảnh hiện tại chưa cho phép duy trì khóa học';
  if(!(p.id==='self'&&l.age<18&&!l.indep)&&l.money<l.base*r.rate*r.years+l.base*.1)return 'Cần học phí và tiền dự phòng';
  return true;
 }
 function startCourse(l,id,key,rng,log){
  if(courseReason(l,id,key)!==true)return false;
  var p=learner(l,id),r=route(l,key,p),k=B.enroll(l,p.id,'career',r.years,rng,r.id,log);
  if(!k)return false;
  if(p.id==='self'){l.school='voc';l.schoolEnd=l.age+r.years;}
  if(p.id!=='self'){if(p.age<18)p.person.job=null;p.person.inc=0;}
  p.person.vocational969=k.id;
  log(p.name+' bắt đầu '+r.name+'. Kết quả được xét sau '+r.years+' năm, không tự nhận bằng khi đăng ký.','good');return true;
 }
 function courseStill(l,k){var p=learner(l,k.learner);return !!(p&&cc(relativeLife(l,p.person))===k.route969.country);}
 function coursePaused(l,k){var p=learner(l,k.learner);return !!(p&&C.of(relativeLife(l,p.person)).hard>=(k.route969.id==='apprentice'?3:2));}
 function finishCourse(l,k){
  var p=learner(l,k.learner);if(!p||k.route969.recorded)return;
  k.route969.recorded=true;delete p.person.vocational969;if(p.person.job==='đang học nghề')p.person.job='đang đi học';
  if(p.id==='self'&&l.school==='voc'){l.school=null;l.schoolEnd=null;}
  if(k.status==='completed'){
   p.person.edu=Math.max(p.person.edu||0,k.route969.level);
   var e=B.education(l,p.person);(e.qualifications969||(e.qualifications969=[])).push({id:k.id,route:k.route969.id,name:k.route969.name,country:k.route969.country,year:year(l),level:k.route969.level});
   if(p.id==='self')l.flags.needJob=true;
  }
 }
 function academicReason(l,person,destination){
  if(learning(l,person||l))return 'Đang theo khóa học nghề';
  var v=relativeLife(l,person),y=year(l);if(destination&&G.W.BY[destination])v=Object.assign({},v,{country:destination,abroad:null});
  if(cc(v)==='CN'&&y>=1966&&y<=1976)return 'Tuyến tuyển sinh đại học thông thường đang gián đoạn';
  if(C.of(v).hard>=3)return 'Cơ sở đào tạo chưa thể duy trì tuyển sinh trong hoàn cảnh hiện tại';
  return true;
 }
 var entry=E.EDUCATION54.entryReason;
 E.EDUCATION54.entryReason=function(l,u){var code=u&&String(u.id).slice(0,2),why=academicReason(l,null,code);return why!==true?why:entry&&entry.apply(this,arguments);};
 ['uni','post','major'].forEach(function(id){var d=E.DEC[id];if(!d)return;var make=d.make,apply=d.apply;
  d.make=function(l){var out=make.apply(this,arguments);if(academicReason(l)!==true&&out&&out.opts)out.opts=out.opts.filter(function(o){return id==='uni'?!/^uni_/.test(o.k):id==='post'?o.k!=='yes':false;});return out;};
  d.apply=function(l,d,key,r,log){if(academicReason(l)!==true&&(id==='major'||id==='post'&&key==='yes'||id==='uni'&&/^uni_/.test(key))){log('Lộ trình học này chưa thể tiếp nhận hồ sơ tại nơi và năm đang sống.','neutral');return;}return apply.apply(this,arguments);};
  if(id==='major'){var valid=d.valid;d.valid=function(l){return academicReason(l)===true&&(!valid||valid.apply(this,arguments));};}
 });
 X.menu('vocational969','Đường học nghề theo nơi và năm',function(l){return X.reason(l,15);},function(l,d){var p=learner(l,d.arg&&d.arg.id);return p?p.name+' · '+p.age+' tuổi · năm '+year(l)+'. Chọn lộ trình phù hợp bậc học đã hoàn thành. Thời gian học, học phí và đánh giá được ghi trong hồ sơ khóa dài hạn.':'Người học không còn trong hồ sơ.';},function(l,a){var p=learner(l,a.id);if(!p)return[];return routes.filter(function(r){return !!route(l,r.id,p);}).map(function(r){return{k:r.id,l:r.name+' · '+r.years+' năm',h:H.money(l,l.base*r.rate*r.years),why:courseReason(l,p.id,r.id),run:function(l,rng,log){startCourse(l,p.id,r.id,rng,log);}};});},15,'Học tập');

 // Recovery is stored on the existing displaced case, not in a second event queue.
 var Hist=E.ERA920.HIST;
 function displaced(l){return l.flags.hist920&&Array.isArray(l.flags.hist920.open)?l.flags.hist920.open.find(function(o){return o.k==='displaced';}):null;}
 function recovery(l,o){
  if(o.recovery969)return o.recovery969;
  var rf=l.flags.ctx945&&l.flags.ctx945.refuge,school=l.school&&l.age>=6&&l.age<18&&['primary','lower','upper','priv'].includes(l.school)?{kind:l.school,remaining:Math.max(1,(l.schoolEnd||l.age+1)-l.age),edu:l.edu}:null;
  var state=Hist.st(l),serial=state.recoverySerial969=(state.recoverySerial969||0)+1;
  var q=o.recovery969={id:l.id+':recovery:'+year(l)+':'+serial,from:rf&&!rf.back&&!rf.stay?rf.from:l.city||l.place,country:cc(l),at:year(l),history:[],school:school};
  if(school){l.school=null;l.schoolEnd=null;}
  return q;
 }
 function record(l,q,key){q.acted=year(l);q.history.push({year:year(l),choice:key,country:cc(l),city:l.city||l.place});}
 function housing(q){return !!q.housing;}
 function family(l){return !!(l.fam&&(l.fam.mAlive&&!l.fam.noMom||l.fam.fAlive&&!l.fam.noDad)||(l.sibList||[]).some(function(s){return s.alive!==false;})||l.partner&&l.partner.alive!==false);}
 function recoveryReady(l,q){return X.reason(l,3)===true&&q.acted!==year(l);}
 function returnReady(l,q){return q.country===cc(l)&&q.from!==(l.city||l.place)&&year(l)>q.at&&cityAllowed(q.country,year(l),q.from)&&C.hardness(C.levelAt(q.country,year(l),q.from))<=3;}
 function canPayRecovery(l){return l.age<18&&!l.indep||l.money>=l.base*.12;}
 function canMeetRecovery(l,q){return !!(q.contact&&!q.reunited&&family(l)&&year(l)>q.contact&&housing(q)&&C.of(l).hard<2);}
 function recoveryMilestones(l,q){
  var out={};
  if(q.housing)out.housing='Đã có chỗ ở ổn định hơn';
  if(q.schoolDone)out.school='Đã được tiếp tục việc học';
  if(q.reunited)out.reunion='Đã gặp lại người thân';
  if(canMeetRecovery(l,q))out.meet='Đã có thể thu xếp gặp người thân';
  if(q.history.some(function(h){return h.choice==='work';})&&l.job)out.work='Đã có công việc';
  if(returnReady(l,q)&&canPayRecovery(l))out.returnHome='Đã có thể thu xếp trở về quê';
  return out;
 }
 function closeRecovery(l,o,q,result,log){
  q.closed=year(l);q.result=result;
  var s=Hist.st(l);(s.recoveryHistory969||(s.recoveryHistory969=[])).push(JSON.parse(JSON.stringify(q)));s.recoveryHistory969=s.recoveryHistory969.slice(-20);
  s.open=s.open.filter(function(x){return x!==o;});
  var rf=l.flags.ctx945&&l.flags.ctx945.refuge;if(rf){if(result==='returned')rf.back=year(l);else rf.stay=year(l);}
  log(result==='returned'?'Gia đình trở về quê cũ. Những năm sống xa vẫn được giữ trong ký ức.':'Bạn chọn gắn bó với nơi ở hiện tại và khép lại giai đoạn sống tạm.','good');
 }
 X.menu('recovery969','Ổn định cuộc sống sau sơ tán',function(l){return displaced(l)?X.reason(l,3):'Đã khép giai đoạn sống tạm';},function(l,d){
  var o=displaced(l);if(!o)return 'Hoàn cảnh đã thay đổi.';
  var q=recovery(l,o),news=d?.arg?.news||[];
  return (news.length?news.join('. ')+'.\n':'')+'Bạn đang ở '+E.placeText(l)+'. '+(q.housing?'Đã thu xếp chỗ ở. ':'Chỗ ở còn tạm bợ. ')+(q.school&&!q.schoolDone?'Chương trình học trước đây bị gián đoạn. ':'')+(q.schoolDue?'Đã nộp nguyện vọng tiếp tục học, chờ trả lời năm '+q.schoolDue+'. ':'')+'Gia đình có thể ổn định từng bước hoặc cân nhắc trở về khi quê cũ an toàn hơn.';
 },function(l){
  var o=displaced(l);if(!o)return[];var q=recovery(l,o),ready=recoveryReady(l,q),out=[];
  function add(key,label,why,run,cost){out.push({k:key,l:label,h:cost?H.money(l,l.base*cost):'',why:!ready?'Đã thu xếp một việc trong năm':why,run:function(l,r,log){var now=displaced(l);if(now!==o||!recoveryReady(l,q))return;run(l,r,log);}});}
  if(!q.housing){
   if(family(l))add('relatives','Nhờ người thân giúp thu xếp chỗ ở',true,function(l,r,log){record(l,q,'relatives');q.housing='family';H.fx(l,{hap:2});log('Người thân giúp gia đình có chỗ ở tạm ổn. Bạn vẫn cần thời gian để thu xếp những việc còn lại.','good');});
   add('rent','Tìm chỗ thuê và sửa sang nơi ở',canPayRecovery(l)?true:'Chưa đủ tiền',function(l,r,log){if(!E.LIFE138.fund(l,.12,'chỗ ở sau sơ tán',r,log))return;record(l,q,'rent');q.housing='rented';H.fx(l,{hap:3});log('Bạn thu xếp được nơi ở. Khoản chi này không chuyển quyền sở hữu nhà đất cũ.','good');},.12);
  }
  if(q.school&&!q.schoolDone&&!q.schoolDue&&l.age<18)add('school','Xin tiếp tục chương trình học bị gián đoạn',housing(q)?true:'Cần thu xếp chỗ ở trước',function(l,r,log){record(l,q,'school');q.schoolDue=year(l)+1;q.schoolCity=l.city||l.place;q.schoolCountry=cc(l);log('Nguyện vọng được tiếp nhận. Gia đình chờ kết quả vào năm sau, giữ lại kết quả học cũ.','neutral');});
  if(l.age>=18&&!l.job&&!l.school)add('work','Hỏi việc và xem cơ hội tại nơi đang sống',housing(q)&&E.DEC.job.valid(l,{requested:true})?true:'Cần ổn định chỗ ở và đủ điều kiện tìm việc',function(l,r,log){record(l,q,'work');if(X.next(l,'job',r))l.pending[0].data.requested=true;log('Bạn tìm người giới thiệu và xem các vị trí đang tuyển tại nơi ở mới.','neutral');});
  if(!q.contact&&family(l))add('family','Nhờ người quen hỏi tin và hẹn gặp người thân',true,function(l,r,log){record(l,q,'family');q.contact=year(l);H.fx(l,{hap:3,soc:1});log('Bạn nối lại tin tức với những người thân còn liên lạc được. Những người đã mất vẫn được tưởng nhớ.','good');});
  if(q.contact&&!q.reunited&&family(l)&&year(l)>q.contact)add('meet','Thu xếp buổi gặp lại người thân đang ở gần',canMeetRecovery(l,q)?true:'Cần chỗ gặp và đường đi an toàn',function(l,r,log){record(l,q,'meet');q.reunited=year(l);H.fx(l,{hap:4});(l.sibList||[]).filter(function(s){return s.alive!==false;}).forEach(function(s){s.close=Math.min(100,(s.close||50)+3);});log('Gia đình thu xếp buổi gặp với những người thân còn sống và đang ở gần. Người ở xa tiếp tục giữ liên lạc.','good');});
  if(returnReady(l,q))add('return','Cùng gia đình trở về '+P.rename(l,q.from),canPayRecovery(l)?true:'Chưa đủ tiền cho chuyến trở về',function(l,r,log){if(!returnReady(l,q)||!E.LIFE138.fund(l,.12,'chuyến trở về sau sơ tán',r,log))return;record(l,q,'return');H.moveToCity(l,q.from);if(l.job){l.job=null;l.income=0;l.flags.needJob=true;}if(q.school&&!q.schoolDone){q.schoolDue=year(l)+1;q.schoolCity=l.city||l.place;q.schoolCountry=cc(l);}closeRecovery(l,o,q,'returned',log);},.12);
  add('settle','Chọn gắn bó lâu dài với nơi ở hiện tại',housing(q)&&year(l)>q.at&&(l.age<18||l.job||l.money>=l.base*.2)&&(!q.school||q.schoolDone||l.age>=18)?true:'Cần thu xếp cuộc sống và chương trình học còn dở',function(l,r,log){record(l,q,'settle');closeRecovery(l,o,q,'settled',log);});
  add('later','Xem lại khi có tiến triển',true,function(l,r,log){record(l,q,'later');log('Bạn có thể mở lại hồ sơ bất cứ khi nào. Sau này sẽ chỉ có lời nhắc khi tình hình tiến triển.','neutral');});return out;
 },3,'Đời sống');
 var recoveryMenu=E.DEC.recovery969,recoveryMake=recoveryMenu.make,recoveryValid=recoveryMenu.valid;
 recoveryMenu.make=function(l){var d=recoveryMake.apply(this,arguments),o=displaced(l);if(o)d.data.recoveryId969=recovery(l,o).id;return d;};
 recoveryMenu.valid=function(l,d){var o=displaced(l),data=d&&d.data||d;return recoveryValid.apply(this,arguments)&&!!o&&(!data||!data.recoveryId969||data.recoveryId969===recovery(l,o).id);};
 var recoveryApply=recoveryMenu.apply;
 recoveryMenu.apply=function(l,d){
  if(!this.valid(l,d.data))return;
  var q=recovery(l,displaced(l));
  if(!Array.isArray(q.notice975))q.notice975=['opened'].concat(Object.keys(recoveryMilestones(l,q)));
  return recoveryApply.apply(this,arguments);
 };
 function resumeSchool(l,q,log){
  if(q.schoolDue&&year(l)>=q.schoolDue){
   if(l.school){q.schoolDone=true;delete q.schoolDue;}
   else if(cc(l)!==q.schoolCountry||(l.city||l.place)!==q.schoolCity){delete q.schoolDue;log('Nơi cư trú đã đổi; cần trao đổi lại về chương trình học tại nơi mới.','neutral');}
   else if(l.age>=18){delete q.schoolDue;log('Bạn đã đến tuổi trưởng thành; có thể tiếp tục bằng học bổ túc hoặc học nghề phù hợp.','neutral');}
   else if(C.of(l).hard<2){l.school=q.school.kind;l.schoolEnd=l.age+q.school.remaining;q.schoolDone=true;delete q.schoolDue;log('Bạn được tiếp tục chương trình cũ, giữ kết quả đã học và học đủ phần còn lại.','good');}
   else q.schoolDue=year(l)+1;
  }
 }
 function recoveryYear(l,r,log){
  if(!l.alive||!l.flags.hist920)return;
  (Hist.st(l).recoveryHistory969||[]).forEach(function(q){resumeSchool(l,q,log);});
  var o=displaced(l);if(!o)return;
  var q=recovery(l,o);
  if(!Array.isArray(q.notice975)){
   // Older saves have already seen the steps they acted on.
   q.notice975=q.history.length?['opened'].concat(Object.keys(recoveryMilestones(l,q))):[];
  }
  resumeSchool(l,q,log);
  if(!recoveryReady(l,q)||q.noticeAt975===year(l))return;
  var milestones=recoveryMilestones(l,q),keys=Object.keys(milestones).filter(function(key){return !q.notice975.includes(key);});
  var first=!q.notice975.includes('opened');
  if(!first&&!keys.length)return;
  var news=keys.map(function(key){return milestones[key];});
  if(E.WORLD120.queue(l,'recovery969',r,{news:news},{manual:false})){
   q.noticeAt975=year(l);
   if(first)q.notice975.push('opened');
   q.notice975.push.apply(q.notice975,keys);
  }
 }
 E.HOOKS.year.push(recoveryYear);
 var inherit=E.heirAtAge;
 E.heirAtAge=function(parent,k){var l=inherit.apply(this,arguments);if(!l)return l;var course=((l.flags.expansion110||{}).courses170||[]).find(function(c){return c.learner==='self'&&c.route969&&c.status==='active';});if(course){l.vocational969=course.id;l.school='voc';l.schoolEnd=course.due;if(!k.job)l.job=null;}return l;};
 E.ERA969={cities:cities,regions:regions,routes:routes,route:route,learners:learners,learner:learner,academicReason:academicReason,courseReason:courseReason,startCourse:startCourse,courseStill:courseStill,coursePaused:coursePaused,finishCourse:finishCourse,learning:learning,recovery:recovery,recoveryYear:recoveryYear,displaced:displaced,returnReady:returnReady};
})(globalThis.G);
