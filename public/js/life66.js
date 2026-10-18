/* V5.3 — stable family identities, schooling and extracurricular development. */
(function(G){
  'use strict';
  var E=G.E,H=E.H,U=G.U;
  var TALENTS={music:'Âm nhạc',art:'Hội họa',sport:'Thể thao',science:'Khoa học',language:'Ngoại ngữ',acting:'Diễn xuất'};
  var SCHOOLS={public:{name:'Trường công',rate:0},private:{name:'Trường tư',rate:.18},international:{name:'Trường quốc tế',rate:.75}};
  var COURSES={home:{name:'Tự trải nghiệm cùng gia đình',rate:0},club:{name:'Câu lạc bộ',rate:.025},coach:{name:'Lớp có giáo viên hướng dẫn',rate:.08}};
  function hash(s){var h=2166136261;for(var i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0;}
  function age(l,k){return l.age-k.born;}
  function init(l){E.PARENTING.children(l);(l.kids||[]).forEach(function(k){if(!k.parentId){do{l.flags.parentSerial=(l.flags.parentSerial||0)+1;k.parentId=l.id+':child:'+l.flags.parentSerial;}while(l.kids.some(function(x){return x!==k&&x.parentId===k.parentId;}));}
    if(!k.family53){var keys=Object.keys(TALENTS),v=hash(k.parentId);k.family53={innate:v%10<3?null:keys[v%keys.length],interest:keys[hash(k.parentId+'interest')%keys.length],skills:{},school:'public',course:'home'};}
    var s=k.family53;if(!SCHOOLS[s.school])s.school='public';if(!COURSES[s.course])s.course='home';if(!s.skills||typeof s.skills!=='object')s.skills={};
  });return l.kids||[];}
  function find(l,id){return init(l).filter(function(k){return k.parentId===id;})[0];}
  function free(l){return l.alive&&!(l.jailUntil!=null&&l.age<l.jailUntil)&&!(l.abroad&&l.abroad.trapped)&&!(l.flags.military&&l.age<l.flags.military);}
  function care(l,k){return k&&k.alive&&age(l,k)>=0&&k.custody!=='ex'&&!(k.jail&&age(l,k)<k.jail)&&!k.abroadStudy&&!(l.abroad&&!l.abroad.perm);}
  function schoolOK(l,k){return care(l,k)&&age(l,k)>=3&&age(l,k)<18&&k.vice!=='bỏ học'&&!k.job&&!k.uniUntil;}
  function stage(l,k){var a=age(l,k);return a<3?'Chưa đến tuổi đi học':a<6?'Mầm non':a<11?'Tiểu học':a<15?'Trung học cơ sở':a<18?'Trung học phổ thông':k.uniUntil?'Đang học đại học':k.edu>=5?'Đã học đại học':k.edu===4?'Học nghề':'Đã trưởng thành';}
  function context(l){return l.cur+':'+(l.abroad&&l.abroad.perm?l.abroad.code:l.country);}
  function quote(l,kind,key){var p=(kind==='school'?SCHOOLS:COURSES)[key];return p?l.base*p.rate:null;}
  function log(l,fn,t){if(fn)fn(t,'good');else(l.log||(l.log=[])).push({a:l.age,y:l.birthYear+l.age,t:t,k:'good'});}
  function paid(l,k,kind,amount,fn){if(!isFinite(amount)||amount<0)return {ok:false,message:'Khoản học phí không hợp lệ.'};var s=k.family53,key=kind+'Payment',p=s[key],old=p&&p.age===l.age&&p.context===context(l)?p.amount:0,delta=Math.max(0,amount-old);
    if(l.money+1e-9<delta)return {ok:false,message:'Chưa đủ tiền. Bạn có thể chọn phương án miễn phí.'};
    if(delta){H.cash(l,-delta,(kind==='school'?'Học phí':'Lớp năng khiếu')+' của '+k.name);log(l,fn,'Bạn trả '+H.money(l,delta)+' '+(kind==='school'?'học phí':'phí hoạt động')+' cho '+k.name+'.');}
    s[key]={age:l.age,amount:Math.max(old,amount),context:context(l)};return {ok:true};
  }
  function valid(l,id,at){var k=find(l,id);return free(l)&&care(l,k)&&(at==null||at===l.age)?k:null;}
  function name(l,id,value,at,fn){var k=valid(l,id,at);if(!k||age(l,k)>=18)return {ok:false,message:'Không thể đổi tên trong hoàn cảnh hiện tại.'};
    value=String(value||'').normalize('NFC').trim().replace(/\s+/g,' ');
    if(!value||value.length>60||!/^\p{L}[\p{L}\p{M} .’'\-]*$/u.test(value))return {ok:false,message:'Tên cần dài 1–60 ký tự, dùng chữ và khoảng trắng.'};
    if(age(l,k)<=2){if(l.kids.some(function(x){return x!==k&&String(x.name||'').normalize('NFC').toLocaleLowerCase()===value.toLocaleLowerCase();}))return {ok:false,message:'Tên này trùng với một người con khác.'};
      var old=k.name;if(old===value)return {ok:true,message:'Tên được giữ nguyên.'};k.name=value;
      function update(o){if(!o||typeof o!=='object')return;Object.keys(o).forEach(function(key){if((key==='n'||key==='name')&&o[key]===old)o[key]=value;else if(typeof o[key]==='object')update(o[key]);});}
      (l.pending||[]).forEach(function(d){update(d.data);});(l.sched||[]).forEach(function(d){update(d.arg);});
      log(l,fn,'Đặt tên cho bé: '+old+' → '+value+'.');H.mem(l,'Bạn chọn tên '+value+' cho con.',3);
    }else{if(k.family53.nickname===value)return {ok:true,message:'Tên gọi được giữ nguyên.'};k.family53.nickname=value;log(l,fn,'Tên gọi ở nhà của '+k.name+' là '+value+'.');}
    return {ok:true,message:'Đã lưu tên của con.'};
  }
  function school(l,id,key,at,fn){var k=valid(l,id,at);if(!k||!schoolOK(l,k)||!SCHOOLS[key])return {ok:false,message:'Con chưa thể chọn trường ở thời điểm này.'};
    var p=paid(l,k,'school',quote(l,'school',key),fn);if(!p.ok)return p;var s=k.family53;if(s.school!==key)log(l,fn,'Chọn '+SCHOOLS[key].name.toLowerCase()+' cho '+k.name+' ở bậc '+stage(l,k).toLowerCase()+'.');s.school=key;s.context=context(l);return {ok:true,message:'Đã lưu trường. Học phí bổ sung được đóng mỗi năm; đổi sang gói rẻ hơn không hoàn phần đã đóng.'};}
  function train(l,id,talent,course,at,fn){var k=valid(l,id,at);if(!k||age(l,k)<4||age(l,k)>=18||!TALENTS[talent]||!COURSES[course])return {ok:false,message:'Hoạt động dành cho con từ 4 đến 17 tuổi.'};
    var p=paid(l,k,'course',quote(l,'course',course),fn);if(!p.ok)return p;var s=k.family53;if(s.activity!==talent||s.course!==course)log(l,fn,'Đồng hành cùng '+k.name+' khám phá '+TALENTS[talent].toLowerCase()+' · '+COURSES[course].name.toLowerCase()+'.');s.activity=talent;s.course=course;s.context=context(l);return {ok:true,message:'Đã lưu hoạt động. Kỹ năng tiến bộ sau mỗi năm; năng khiếu bẩm sinh không bị thay đổi.'};}
  E.HOOKS.year.push(function(l,r,fn){if(!l.alive)return;init(l).forEach(function(k){var s=k.family53;if(!care(l,k)||s.year===l.age)return;s.year=l.age;
    if(s.context&&s.context!==context(l)){s.school='public';s.course='home';log(l,fn,'Đã thay đổi nơi sống; chọn lại trường hoặc lớp cho '+k.name+' nếu cần.');}s.context=context(l);
    if(schoolOK(l,k)){if(!paid(l,k,'school',quote(l,'school',s.school),fn).ok){s.school='public';log(l,fn,'Ngân sách chưa đủ học phí của '+k.name+'; gia đình chuyển sang chương trình công để con tiếp tục học.');}if(s.school!=='public')k.study=U.clamp((k.study==null?50:k.study)+1,0,100);}
    if(age(l,k)>=4&&age(l,k)<18&&s.activity){if(!paid(l,k,'course',quote(l,'course',s.course),fn).ok){s.course='home';log(l,fn,'Chưa đủ tiền lớp của '+k.name+'; tiếp tục luyện tập miễn phí cùng gia đình.');}
      var t=s.activity;s.skills[t]=U.clamp((s.skills[t]||0)+2+(t===s.innate?1:0)+(s.course==='coach'?1:0),0,100);if(t==='science'||t==='language')k.study=U.clamp((k.study==null?50:k.study)+.5,0,100);
      if(s.skills[t]>=25&&!s['milestone_'+t]){s['milestone_'+t]=true;log(l,fn,k.name+' tự tin thể hiện '+TALENTS[t].toLowerCase()+' sau thời gian luyện tập.');H.mem(l,'Lần đầu '+k.name+' tự tin thể hiện '+TALENTS[t].toLowerCase()+'.',3);}
    }
  });});
  var oldMig=E.migrateExt;E.migrateExt=function(l){if(oldMig)oldMig(l);init(l);};
  E.FAMILY53={init:init,find:find,age:age,free:free,care:care,schoolOK:schoolOK,stage:stage,quote:quote,name:name,school:school,train:train,talents:TALENTS,schools:SCHOOLS,courses:COURSES};
})(G);
