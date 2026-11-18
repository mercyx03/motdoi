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
  BZ:{Belmopan:{from:1967,ready:1970,label:'công trường Belmopan'}},
  IL:{'Tel Aviv':{from:1909}},
  PH:{'Quezon City':{from:1939}},
  AU:{Canberra:{from:1913,ready:1927,label:'khu xây dựng Canberra'}},
  ZA:{Soweto:{from:1904,ready:1963,label:'các khu dân cư phía tây nam Johannesburg'}}
 };
 var berlinSectors=['Đông Berlin','Tây Berlin'];
 function dividedBerlin(y){return y>=1945&&y<1990;}
 var locations={},known={},constructionAliases=new Map();
 Object.values(cities).forEach(function(rows){
  Object.keys(rows).forEach(function(name){var row=rows[name];if(row.label)constructionAliases.set(row.label,name);});
 });
 var canonical=P.canonicalCity;
 P.canonicalCity=function(name){return canonical(constructionAliases.get(name)||name);};
 G.W.C.forEach(function(c){locations[c.code]=new Set(c.cities);c.cities.forEach(function(n){known[n]=true;});});
 G.VN.P63.forEach(function(p){locations.VN.add(p.city);locations.VN.add(p.name);known[p.city]=known[p.name]=true;});
 function cityAtYear(code,y,name){
  var city=P.canonicalCity(name);
  return code==='DE'&&y>=1990&&berlinSectors.includes(city)?'Berlin':city;
 }
 function cityAllowed(code,y,name){
  name=P.canonicalCity(name);
  if(berlinSectors.includes(name))return code==='DE'&&dividedBerlin(y);
  if(known[name]&&locations[code]&&!locations[code].has(name))return false;
  var row=cities[code]?.[name];return !row||y>=row.from;
 }
 function cityList(code,y){
  var a=code==='VN'?G.VN.P63.map(function(p){return p.city;}):(G.W.BY[code]||{}).cities||[];
  if(code==='DE'&&dividedBerlin(y))a=a.flatMap(function(city){return city==='Berlin'?berlinSectors:[city];});
  return a.filter(function(n){return cityAllowed(code,y,n);});
 }
 function residentCity(l){
  var code=cc(l),city=cityAtYear(code,year(l),!l.abroad&&l.cityStudent?.city||l.city||l.place);
  return city&&cityAllowed(code,year(l),city)?city:null;
 }
 function cityLabel(code,y,city){
  var key=cityAtYear(code,y,city),row=cities[code]?.[key];
  if(row&&y<row.from)return 'khu vực sau này là '+key;
  return P.rename({country:code,birthYear:y,age:0},key);
 }
 function locationLabel(code,y,city){
  var label=cityLabel(code,y,city),region=P.regionAt(code,y,city);
  return region&&region.label!==label?label+' · '+region.label:label;
 }
 function moveReason(code,y,from,to){
  var origin=P.regionAt(code,y,from),dest=P.regionAt(code,y,to);
  if(!origin||!dest||origin.area===dest.area)return true;
  if(code==='MY'&&y<1963)return 'Chuyến đi qua hai vùng quản lý riêng, cần thủ tục qua biên giới';
  if(code!=='DE'||y<1952||y>=1989)return true;
  if(origin.area==='berlin'&&berlinSectors.includes(to))return true;
  if(origin.area==='berlin'||dest.area==='berlin')return 'Cần xác định khu vực ở Berlin trước khi đi qua ranh giới';
  if(y<1961&&berlinSectors.includes(from)&&berlinSectors.includes(to))return true;
  return 'Chuyến đi qua biên giới Đông–Tây Đức, cần giấy phép đặc biệt';
 }
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
 P.cityAllowed=cityAllowed;P.cities=cityList;P.cityAtYear=cityAtYear;P.residentCity=residentCity;P.cityLabel=cityLabel;
 P.locationLabel=locationLabel;P.moveReason=moveReason;P.regionName=regionName;P.regionChoice=regionChoice;
 var rename=P.rename,place=E.placeText,fam=E.famLogic;
 P.rename=function(l,s){return geoText(l,rename(l,s));};
 E.placeText=function(l){return geoText(l,place.apply(this,arguments));};
 E.famLogic=function(l,s){return geoText(l,fam.apply(this,arguments));};

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
 function formalSchoolReason(l,kind,person,destination){
  if((destination||cc(person?relativeLife(l,person):l))!=='AF'||(person?.sex||l.sex)!=='F')return true;
  var y=year(l);
  if(y>=2021&&['lower','upper','priv','voc'].includes(kind))return 'Từ tháng 9/2021, nữ sinh tại Afghanistan chưa được trở lại học chính quy sau lớp 6.';
  if(y>=2022&&['uni','abroad','post','phd','police'].includes(kind))return 'Từ tháng 12/2022, phụ nữ tại Afghanistan bị đình chỉ tiếp cận giáo dục đại học.';
  return true;
 }
 function pauseAfghanSchool(l,kind,log,afterYear){
  if(formalSchoolReason(l,kind)===true||kind==='voc'&&learning(l,l))return false;
  var s=l.flags.afghanStudy984||(l.flags.afghanStudy984={years:0}),a=l.age+(afterYear?1:0);
  if(!s.paused){
   var calendar=C.schoolAge(l)+(afterYear?1:0);
   s.paused={kind:kind,at:year(l),remaining:Math.max(1,(l.schoolEnd||(kind==='upper'||kind==='priv'?a+3:a+1))-a)};
   delete s.notified;
   if(kind==='lower')s.paused.calendarAge=Math.min(15,calendar);
   log(formalSchoolReason(l,kind)+' Việc học tạm dừng, phần đã hoàn thành được giữ trong hồ sơ.', 'neutral');
  }
  l.school=null;l.schoolEnd=null;
  return true;
 }
 function prepareAfghanSchool(l){
  if(l.school){
   pauseAfghanSchool(l,l.school,function(t,k){l.log.push({a:l.age,y:year(l),t:t,k:k});});
  }
  l.pending.forEach(function(d){
   if(!['hs','uni'].includes(d.id))return;
   var why=afghanPolicyForDecision(l,d.id);
   if(why!==true&&!d.opts.some(function(o){return o.k==='afghanStudy984';}))presentBlockedStudy(d,d.id,why);
  });
 }
 function afghanStudyKind(l){
  return l.flags.afghanStudy984?.paused?.kind||(l.edu>=3?'uni':'upper');
 }
 function afghanStudyAvailable(l){
  var paused=l.flags.afghanStudy984?.paused;
  return !!(paused||!l.school&&l.age>=12&&formalSchoolReason(l,afghanStudyKind(l))!==true);
 }
 function afghanStudyDue(l){
  var s=l.flags.afghanStudy984;
  return !!(s?.paused&&s.paused.at!=null&&!s.notified&&formalSchoolReason(l,s.paused.kind)!==true);
 }
 function studyInformally(l,key,log){
  if(l.school||formalSchoolReason(l,afghanStudyKind(l))===true)return;
  var s=l.flags.afghanStudy984||(l.flags.afghanStudy984={years:0}),y=year(l);
  if(s.lastStudy===y)return;
  if(key==='community'&&C.of(l).hard>=3||key==='remote'&&!remoteAfghanStudy(l))return;
  s.lastStudy=y;s.years=(s.years||0)+1;s.lastMethod=key;
  H.fx(l,key==='community'?{kno:4,soc:2}:key==='remote'?{kno:3,hap:1}:{kno:2});
  log('Bạn '+(key==='community'?'học cùng nhóm cộng đồng':key==='remote'?'tiếp tục học từ xa':'tự học qua tài liệu')+' và giữ được nhịp học. Kết quả năm này được lưu trong hồ sơ học bổ trợ.', 'good');
 }
 function remoteAfghanStudy(l){
  return year(l)>=2023&&l.urban&&(E.ERA920.net('AF',year(l))||0)>=5&&C.of(l).hard<3;
 }
 function resumeAfghanSchool(l,r,log){
  var s=l.flags.afghanStudy984, p=s?.paused, recovery=currentRecovery(l);
  if(!p||l.school||formalSchoolReason(l,p.kind)!==true||!C.canResumeSchool(l)||recovery&&!housing(l,recovery))return;
  if(['lower','upper','priv','voc'].includes(p.kind)){
   l.school=p.kind;
   if(p.calendarAge!=null){l.flags.schoolDelay982=Math.max(0,l.age-p.calendarAge);l.schoolEnd=null;}
   else l.schoolEnd=l.age+p.remaining;
   log('Gia đình thu xếp để bạn học tiếp bậc cũ tại nơi đang sống. Việc học bổ trợ đã giúp bạn duy trì kiến thức.', 'good');
  }else{
   if(academicReason(l)!==true||E.DEC.uni.valid&&!E.DEC.uni.valid(l,{}))return;
   if(!X.next(l,'uni',r))return;
   log('Bạn có thể nộp hồ sơ tại nơi đang sống. Trường sẽ xét điều kiện nhập học theo lộ trình hiện có.', 'neutral');
  }
  delete s.paused;
 }
 X.menu('afghanStudy984','Tiếp tục việc học bị gián đoạn',function(l){return afghanStudyAvailable(l)?X.reason(l,11):'Chưa có chương trình bị gián đoạn';},function(l){
  var why=formalSchoolReason(l,afghanStudyKind(l)),s=l.flags.afghanStudy984;
  return (why===true?'Ở nơi hiện tại bạn có thể hỏi về việc học tiếp.':why+' Bạn có thể duy trì việc học qua các lựa chọn phù hợp với điều kiện gia đình.')+(s?.years?' Đã học bổ trợ '+s.years+' năm.':'');
 },function(l){
  if(formalSchoolReason(l,afghanStudyKind(l))===true){
   return [{k:'resume',l:'Thu xếp học tiếp tại nơi đang sống',why:!l.school&&C.canResumeSchool(l)&&(!currentRecovery(l)||housing(l,currentRecovery(l)))?true:'Cần có chỗ ở ổn định và chương trình đang tiếp nhận',run:resumeAfghanSchool}];
  }
  var available=l.flags.afghanStudy984?.lastStudy!==year(l),out=[];
  function add(key,label){out.push({k:key,l:label,why:available?true:'Đã học bổ trợ trong năm này',run:function(l,r,log){studyInformally(l,key,log);}});}
  if(C.of(l).hard<3)add('community','Tham gia nhóm học cộng đồng');
  if(remoteAfghanStudy(l))add('remote','Theo bài học từ xa');
  add('materials','Tự học qua tài liệu đang có');
  return out;
 },11,'Học tập');
 E.ACT.find(function(a){return a.id==='afghanStudy984';}).showFor=afghanStudyAvailable;
 function academicReason(l,person,destination){
  if(learning(l,person||l))return 'Đang theo khóa học nghề';
  var policy=formalSchoolReason(l,'uni',person,destination);
  if(policy!==true)return policy;
  var v=relativeLife(l,person),y=year(l);if(destination&&G.W.BY[destination])v=Object.assign({},v,{country:destination,abroad:null});
  if(cc(v)==='CN'&&y>=1966&&y<=1976)return 'Tuyến tuyển sinh đại học thông thường đang gián đoạn';
  if(C.of(v).hard>=3)return 'Cơ sở đào tạo chưa thể duy trì tuyển sinh trong hoàn cảnh hiện tại';
  return true;
 }
 var entry=E.EDUCATION54.entryReason;
 E.EDUCATION54.entryReason=function(l,u){var code=u&&String(u.id).slice(0,2),why=academicReason(l,null,code);return why!==true?why:entry&&entry.apply(this,arguments);};
 function afghanPolicyForDecision(l,id){return formalSchoolReason(l,id==='hs'?'upper':'uni');}
 function allowedAfghanStudyChoice(id,key){
  return key==='afghanStudy984'||['cancel','close','close872','work','home'].includes(key)||(id==='uni'&&key==='abroad');
 }
 function presentBlockedStudy(out,id,why){
  out.text=why;
  out.opts=out.opts.filter(function(o){return allowedAfghanStudyChoice(id,o.k);});
  if(id!=='major')out.opts.unshift({k:'afghanStudy984',l:'Xem cách tiếp tục học phù hợp'});
 }
 ['hs','uni','post','major','phd','uniFail'].forEach(function(id){var d=E.DEC[id];if(!d)return;var make=d.make,apply=d.apply,auto=d.auto;
  d.make=function(l){
   var out=make.apply(this,arguments),why=afghanPolicyForDecision(l,id);
   if(why!==true)presentBlockedStudy(out,id,why);
   else if(['uni','post','major'].includes(id)&&academicReason(l)!==true&&out?.opts)out.opts=out.opts.filter(function(o){return id==='uni'?!/^uni_/.test(o.k):id==='post'?o.k!=='yes':false;});
   return out;
  };
  d.apply=function(l,d,key,r,log){
   var why=afghanPolicyForDecision(l,id);
   if(why!==true&&(key==='afghanStudy984'||!allowedAfghanStudyChoice(id,key))){
    if(id==='hs')pauseAfghanSchool(l,'upper',log);
    if(E.DEC.afghanStudy984.valid(l,{}))X.next(l,'afghanStudy984',r);
    return;
   }
   if(academicReason(l)!==true&&(id==='major'||id==='post'&&key==='yes'||id==='uni'&&/^uni_/.test(key))){log('Lộ trình học này chưa thể tiếp nhận hồ sơ tại nơi và năm đang sống.','neutral');return;}
   return apply.apply(this,arguments);
  };
  d.auto=function(l,decision,r){return decision.opts.some(function(o){return o.k==='afghanStudy984';})?'afghanStudy984':auto.apply(this,arguments);};
  if(id==='major'){var valid=d.valid;d.valid=function(l){return academicReason(l)===true&&(!valid||valid.apply(this,arguments));};}
 });
 Object.keys(E.DEC).filter(function(id){return /^(study_wishes54|postgraduate108(?:_|$)|phd106(?:_|$)|pg106_defense$)/.test(id);}).forEach(function(id){
  var d=E.DEC[id],valid=d.valid,apply=d.apply;
  d.valid=function(l){return formalSchoolReason(l,'uni')===true&&(!valid||valid.apply(this,arguments));};
  d.apply=function(l){if(formalSchoolReason(l,'uni')===true)return apply.apply(this,arguments);};
 });
 X.menu('vocational969','Đường học nghề theo nơi và năm',function(l){return X.reason(l,15);},function(l,d){var p=learner(l,d.arg&&d.arg.id);return p?p.name+' · '+p.age+' tuổi · năm '+year(l)+'. Chọn lộ trình phù hợp bậc học đã hoàn thành. Thời gian học, học phí và đánh giá được ghi trong hồ sơ khóa dài hạn.':'Người học không còn trong hồ sơ.';},function(l,a){var p=learner(l,a.id);if(!p)return[];return routes.filter(function(r){return !!route(l,r.id,p);}).map(function(r){return{k:r.id,l:r.name+' · '+r.years+' năm',h:H.money(l,l.base*r.rate*r.years),why:courseReason(l,p.id,r.id),run:function(l,rng,log){startCourse(l,p.id,r.id,rng,log);}};});},15,'Học tập');

 // Recovery is stored on the existing displaced case, not in a second event queue.
 var Hist=E.ERA920.HIST;
 function displaced(l){return l.flags.hist920&&Array.isArray(l.flags.hist920.open)?l.flags.hist920.open.find(function(o){return o.k==='displaced';}):null;}
 function recovery(l,o){
  if(o.recovery969)return o.recovery969;
  var rf=l.flags.ctx945&&l.flags.ctx945.refuge,school=l.school&&l.age>=6&&l.age<18&&['primary','lower','upper','priv'].includes(l.school)?{kind:l.school,remaining:Math.max(1,(l.schoolEnd||l.age+1)-l.age),edu:l.edu}:null;
  if(school&&(C.of(l).school!=null||l.flags.schoolDelay982)){
   if(school.kind==='primary'||school.kind==='lower')school.calendarAge=C.schoolAge(l);
   if(school.calendarAge!=null)school.remaining=Math.max(1,(school.kind==='primary'?12:15)-school.calendarAge);
   school.regional982=true;
  }
  var state=Hist.st(l),serial=state.recoverySerial969=(state.recoverySerial969||0)+1;
  var origin=o.origin984;
  var q=o.recovery969={id:l.id+':recovery:'+year(l)+':'+serial,from:origin?origin.city:rf&&!rf.back&&!rf.stay&&(rf.country||l.country)===cc(l)?rf.from:residentCity(l),country:origin?.country||cc(l),at:Number.isFinite(o.y0)?o.y0:year(l),history:[],school:school};
  if(school){l.school=null;l.schoolEnd=null;}
  else if(o.previousSchool981)q.school=o.previousSchool981;
  delete o.previousSchool981;
  delete o.origin984;
  return q;
 }
 function currentRecovery(l){
  var o=displaced(l);
  if(o)return recovery(l,o);
  var last=l.flags.hist920?.recoveryHistory969?.at(-1);
  return last&&(last.result==='stable978'||last.result==='ordinary978')?last:null;
 }
 function record(l,q,key){q.acted=year(l);q.history.push({year:year(l),choice:key,country:cc(l),city:residentCity(l)});}
 function recordDisplacement(l,country,from,to){
  var o=displaced(l);if(!o)return;
  var q=recovery(l,o), dest={country:cc(l),city:to||residentCity(l)};
  if(to&&q.destination984&&(q.destination984.city!==dest.city||q.destination984.country!==dest.country)){
   delete q.schoolDue;
   if(Array.isArray(q.notice975))q.notice975=q.notice975.filter(function(k){return !['housing','returnHome'].includes(k);});
  }
  q.destination984=dest;
  q.shelter984=!to;
  if(to)q.lastMove984=year(l);
  q.history.push({year:year(l),choice:to?'relocate':'shelter',country:dest.country,city:dest.city,from:from,fromCountry:country});
 }
 function housing(l,q){
  if(l.ownHouse)return true;
  if(!q.housing)return false;
  var step=q.history.filter(function(h){return h.choice==='relatives'||h.choice==='rent';}).at(-1);
  return cc(l)===(step?.country||q.country)&&(!step?.city||residentCity(l)===P.canonicalCity(step.city));
 }
 function family(l){return !!(l.fam&&(l.fam.mAlive&&!l.fam.noMom||l.fam.fAlive&&!l.fam.noDad)||(l.sibList||[]).some(function(s){return s.alive!==false;})||l.partner&&l.partner.alive!==false);}
 function recoveryReady(l,q){return X.reason(l,3)===true&&q.acted!==year(l);}
 function returnReady(l,q){
  var here=residentCity(l),y=year(l);
  return !l.abroad?.trapped&&!E.TRANSIT907?.visit(l)&&q.country===cc(l)&&!!q.from&&!!here&&y>Math.max(q.at,q.lastMove984||q.at)&&cityAllowed(q.country,y,q.from)&&C.safeReturn(q.country,y,here,P.canonicalCity(q.from));
 }
 function canPayRecovery(l){return l.age<18&&!l.indep||l.money>=l.base*.12;}
 function canMeetRecovery(l,q){return !!(q.contact&&!q.reunited&&family(l)&&year(l)>q.contact&&housing(l,q)&&C.of(l).hard<2);}
 function recoveryMilestones(l,q){
  var out={};
  if(housing(l,q))out.housing='Đã có chỗ ở ổn định hơn';
  if(q.schoolDone)out.school='Đã được tiếp tục việc học';
  if(q.reunited)out.reunion='Đã gặp lại người thân';
  if(canMeetRecovery(l,q))out.meet='Đã có thể thu xếp gặp người thân';
  if(q.history.some(function(h){return h.choice==='work';})&&l.job)out.work='Đã có công việc';
  if(returnReady(l,q)&&canPayRecovery(l))out.returnHome='Đã có thể thu xếp trở về quê';
  return out;
 }
 function archiveRecovery(l,q,result){
  var s=Hist.st(l), history=s.recoveryHistory969||(s.recoveryHistory969=[]);
  q.closed=year(l);q.result=result;
  if(!history.includes(q))history.push(q);
  if(history.length>20)history.splice(0,history.length-20);
 }
 function sameRecoveryCountry(l,o){var q=recovery(l,o);return (q.destination984?.country||q.country)===cc(l);}
 function replaceRecovery(l,o){
  var q=recovery(l,o),s=Hist.st(l);
  delete q.schoolDue;
  archiveRecovery(l,q,'relocated981');
  s.open=s.open.filter(function(x){return x!==o;});
  return !q.schoolDone?q.school:null;
 }
 function closeRecovery(l,q,result,log){
  archiveRecovery(l,q,result);
  var s=Hist.st(l);
  s.open=s.open.filter(function(x){return x.recovery969!==q;});
  var rf=l.flags.ctx945&&l.flags.ctx945.refuge;if(rf&&(rf.country||l.country)===q.country){if(result==='returned')rf.back=year(l);else rf.stay=year(l);}
  log(result==='returned'?'Gia đình trở về quê cũ. Những năm sống xa vẫn được giữ trong ký ức.':'Bạn chọn gắn bó với nơi ở hiện tại và khép lại giai đoạn sống tạm.','good');
 }
 function recoveryCosts(l,o,log){
  var q=recovery(l,o), y=year(l), years=y-q.at;
  if(q.costEnded978!=null)return false;
  if(years<=0||q.costYear978===y)return true;
  q.costYear978=y;
  o.n++;
  resumeSchool(l,q,log);
  var safe=C.of(l).hard<2, housed=housing(l,q);
  var stable=housed&&safe&&(l.age<18||l.job||l.school||l.retired||l.money>=l.base*.2)
    &&(!q.school||q.schoolDone||l.age>=18);
  if(stable||years>=8){
   q.costEnded978=y;
   archiveRecovery(l,q,stable?'stable978':'ordinary978');
   if(!Array.isArray(q.notice975))q.notice975=['opened'];
   log(stable?'Bạn đã có chỗ ở và nhịp sống ổn định. Chi phí phát sinh do sống tạm kết thúc; hồ sơ vẫn mở để cân nhắc về quê.':
    'Đã hết giai đoạn chi phí phát sinh sau sơ tán. Những việc còn dở vẫn có thể xem lại trong mục Đời sống.','neutral');
   return false;
  }
  l.st.soc-=1;
  var fee=l.base*(q.housing==='family'&&housed ? .015 : .03);
  if(l.age<18&&!l.indep&&E.childExpense)E.childExpense(l,fee,'chỗ ở sau sơ tán',false);
  else H.cash(l,-Math.min(Math.max(0,l.money),fee),'Chi phí ổn định nơi ở');
  return true;
 }
 X.menu('recovery969','Ổn định cuộc sống sau sơ tán',function(l){return currentRecovery(l)?X.reason(l,3):'Đã khép hồ sơ sơ tán';},function(l,d){
  var q=currentRecovery(l);if(!q)return 'Hoàn cảnh đã thay đổi.';
  var news=d?.arg?.news||[], costs=q.costEnded978!=null?'Giai đoạn chi phí sống tạm đã kết thúc. ':'';
  return (news.length?news.join('. ')+'.\n':'')+'Bạn đang ở '+E.placeText(l)+'. '+costs+(housing(l,q)?'Đã thu xếp chỗ ở. ':q.shelter984?'Gia đình đang trú tạm trong vùng. ':'Chỗ ở còn tạm bợ. ')+(q.school&&!q.schoolDone?'Chương trình học trước đây bị gián đoạn. ':'')+(q.schoolDue?'Đã nộp nguyện vọng tiếp tục học, chờ trả lời năm '+q.schoolDue+'. ':'')+'Gia đình có thể ổn định từng bước hoặc cân nhắc trở về khi quê cũ an toàn hơn.';
 },function(l){
  var q=currentRecovery(l);if(!q)return[];var ready=recoveryReady(l,q),out=[];
  function add(key,label,why,run,cost){out.push({k:key,l:label,h:cost?H.money(l,l.base*cost):'',why:!ready?'Đã thu xếp một việc trong năm':why,run:function(l,r,log){if(currentRecovery(l)!==q||!recoveryReady(l,q))return;run(l,r,log);}});}
  if(!housing(l,q)){
   if(family(l))add('relatives','Nhờ người thân giúp thu xếp chỗ ở',true,function(l,r,log){record(l,q,'relatives');q.housing='family';H.fx(l,{hap:2});log('Người thân giúp gia đình có chỗ ở tạm ổn. Bạn vẫn cần thời gian để thu xếp những việc còn lại.','good');});
   add('rent','Tìm chỗ thuê và sửa sang nơi ở',canPayRecovery(l)?true:'Chưa đủ tiền',function(l,r,log){if(!E.LIFE138.fund(l,.12,'chỗ ở sau sơ tán',r,log))return;record(l,q,'rent');q.housing='rented';H.fx(l,{hap:3});log('Bạn thu xếp được nơi ở. Khoản chi này không chuyển quyền sở hữu nhà đất cũ.','good');},.12);
  }
  if(q.school&&!q.schoolDone&&!q.schoolDue&&l.age<18)add('school','Xin tiếp tục chương trình học bị gián đoạn',housing(l,q)?true:'Cần thu xếp chỗ ở trước',function(l,r,log){record(l,q,'school');q.schoolDue=year(l)+1;q.schoolCity=residentCity(l);q.schoolCountry=cc(l);log('Nguyện vọng được tiếp nhận. Gia đình chờ kết quả vào năm sau, giữ lại kết quả học cũ.','neutral');});
  if(l.age>=18&&!l.job&&!l.school)add('work','Hỏi việc và xem cơ hội tại nơi đang sống',housing(l,q)&&E.DEC.job.valid(l,{requested:true})?true:'Cần ổn định chỗ ở và đủ điều kiện tìm việc',function(l,r,log){record(l,q,'work');if(X.next(l,'job',r))l.pending[0].data.requested=true;log('Bạn tìm người giới thiệu và xem các vị trí đang tuyển tại nơi ở mới.','neutral');});
  if(!q.contact&&family(l))add('family','Nhờ người quen hỏi tin và hẹn gặp người thân',true,function(l,r,log){record(l,q,'family');q.contact=year(l);H.fx(l,{hap:3,soc:1});log('Bạn nối lại tin tức với những người thân còn liên lạc được. Những người đã mất vẫn được tưởng nhớ.','good');});
  if(q.contact&&!q.reunited&&family(l)&&year(l)>q.contact)add('meet','Thu xếp buổi gặp lại người thân đang ở gần',canMeetRecovery(l,q)?true:'Cần chỗ gặp và đường đi an toàn',function(l,r,log){record(l,q,'meet');q.reunited=year(l);H.fx(l,{hap:4});(l.sibList||[]).filter(function(s){return s.alive!==false;}).forEach(function(s){s.close=Math.min(100,(s.close||50)+3);});log('Gia đình thu xếp buổi gặp với những người thân còn sống và đang ở gần. Người ở xa tiếp tục giữ liên lạc.','good');});
  if(returnReady(l,q))add('return','Cùng gia đình trở về '+P.cityLabel(q.country,year(l),q.from),canPayRecovery(l)?true:'Chưa đủ tiền cho chuyến trở về',function(l,r,log){if(!returnReady(l,q)||!E.LIFE138.fund(l,.12,'chuyến trở về sau sơ tán',r,log))return;if(H.moveToCity(l,q.from)===false)return;record(l,q,'return');if(l.job){l.job=null;l.income=0;l.flags.needJob=true;}if(q.school&&!q.schoolDone){q.schoolDue=year(l)+1;q.schoolCity=residentCity(l);q.schoolCountry=cc(l);}closeRecovery(l,q,'returned',log);},.12);
  add('settle','Chọn gắn bó lâu dài với nơi ở hiện tại',housing(l,q)&&year(l)>q.at&&(l.age<18||l.job||l.money>=l.base*.2)&&(!q.school||q.schoolDone||l.age>=18)?true:'Cần thu xếp cuộc sống và chương trình học còn dở',function(l,r,log){record(l,q,'settle');closeRecovery(l,q,'settled',log);});
  add('later','Xem lại khi có tiến triển',true,function(l,r,log){record(l,q,'later');log('Bạn có thể mở lại hồ sơ bất cứ khi nào. Sau này sẽ chỉ có lời nhắc khi tình hình tiến triển.','neutral');});return out;
 },3,'Đời sống');
 var recoveryMenu=E.DEC.recovery969,recoveryMake=recoveryMenu.make,recoveryValid=recoveryMenu.valid;
 recoveryMenu.make=function(l){var d=recoveryMake.apply(this,arguments),q=currentRecovery(l);if(q)d.data.recoveryId969=q.id;return d;};
 recoveryMenu.valid=function(l,d){var q=currentRecovery(l),data=d?.data||d;return recoveryValid.apply(this,arguments)&&!!q&&(!data?.recoveryId969||data.recoveryId969===q.id);};
 var recoveryApply=recoveryMenu.apply;
 recoveryMenu.apply=function(l,d){
  if(!this.valid(l,d.data))return;
  var q=currentRecovery(l);
  if(!Array.isArray(q.notice975))q.notice975=['opened'].concat(Object.keys(recoveryMilestones(l,q)));
  return recoveryApply.apply(this,arguments);
 };
 function resumeSchool(l,q,log){
  if(q.schoolDue&&year(l)>=q.schoolDue){
   if(l.school){q.schoolDone=true;delete q.schoolDue;}
   else if(cc(l)!==q.schoolCountry||residentCity(l)!==P.canonicalCity(q.schoolCity)){delete q.schoolDue;log('Nơi cư trú đã đổi; cần trao đổi lại về chương trình học tại nơi mới.','neutral');}
   else if(l.age>=18){delete q.schoolDue;log('Bạn đã đến tuổi trưởng thành; có thể tiếp tục bằng học bổ túc hoặc học nghề phù hợp.','neutral');}
   else if(C.canResumeSchool(l)&&formalSchoolReason(l,q.school.kind)===true){
    l.school=q.school.kind;
    if(q.school.calendarAge!=null){
     // Duyệt hồ sơ cuối năm. Buổi học đầu tiên diễn ra từ năm tiếp theo.
     l.flags.schoolDelay982=Math.max(0,l.age+1-q.school.calendarAge);
     l.schoolEnd=null;
    }else l.schoolEnd=l.age+q.school.remaining+(q.school.regional982?1:0);
    q.schoolDone=true;delete q.schoolDue;
    log('Bạn được tiếp tục chương trình cũ, giữ kết quả đã học và học đủ phần còn lại.','good');
   }
   else q.schoolDue=year(l)+1;
  }
 }
 function recoveryYear(l,r,log){
  if(!l.alive||!l.flags.hist920)return;
  var s=Hist.st(l);
  (s.recoveryHistory969||[]).forEach(function(q){resumeSchool(l,q,log);});
  var o=displaced(l);
  if(o&&!recoveryCosts(l,o,log))s.open=s.open.filter(function(x){return x!==o;});
  var q=currentRecovery(l);if(!q)return;
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
 E.ERA969={cities:cities,regions:regions,routes:routes,route:route,learners:learners,learner:learner,sameRecoveryCountry:sameRecoveryCountry,replaceRecovery:replaceRecovery,academicReason:academicReason,formalSchoolReason:formalSchoolReason,prepareAfghanSchool:prepareAfghanSchool,pauseAfghanSchool:pauseAfghanSchool,afghanStudyDue:afghanStudyDue,courseReason:courseReason,startCourse:startCourse,courseStill:courseStill,coursePaused:coursePaused,finishCourse:finishCourse,learning:learning,recovery:recovery,recordDisplacement:recordDisplacement,recoveryCosts:recoveryCosts,currentRecovery:currentRecovery,recoveryYear:recoveryYear,displaced:displaced,returnReady:returnReady};
})(globalThis.G);
