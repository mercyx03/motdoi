/* Named media duties extend the channel staff payroll; no second income engine. */
(function (G) {
  'use strict';
  var E=G.E,H=E.H,X=E.UPDATE110,S=E.SOCIAL131;
  var ROLES={manager:['Quản lý cá nhân',.22,'schedule'],assistant:['Trợ lý',.10,'schedule'],social:['Social Media Manager',.18,'post'],booking:['Booking Manager',.16,'network'],pr:['PR Manager',.18,'network'],editor:['Biên tập viên',.18,'post'],photo:['Nhiếp ảnh gia',.14,'post'],ads:['Quản lý quảng cáo',.20,'ads'],team:['Đội ngũ truyền thông chuyên nghiệp',.54,'all']};
  function find(l,id){return S.state(l).channels.find(function(c){return c.id===id;});}
  function why(l){var w=X.reason(l,18);return w!==true?w:!l.indep?'Cần tự lập':true;}
  function sync(c){if(!c.team161)return;c.staff=Math.min(3,c.team161.filter(function(p){return p.status==='active';}).reduce(function(n,p){return n+(p.units||(p.role==='team'?3:1));},0));}
  function adopt(l,c){if(c.team161)return;c.team161=[];if(c.staff)c.team161.push({id:'legacy:'+c.id,role:'editor',skill:60,salary:l.base*.18*c.staff,since:l.age,until:l.age+1,paidAt:c.staffPaidAt,status:'active',performance:null,legacy:true,units:c.staff});sync(c);}
  function history(c,p,age,action){var h=c.staffHistory161||(c.staffHistory161=[]);h.push({id:p.id,role:p.role,age:age,action:action});}
  function hire(l,c,role,years){
    if(why(l)!==true||!S.state(l).channels.includes(c)||!S.apps().some(function(a){return a.id===c.app&&a.enabled;})||!ROLES[role]||![1,2,3].includes(years))return false;
    var salary=l.base*ROLES[role][1];
    if(l.money<salary+l.base*.1||(c.team161||[]).some(function(p){return p.role===role&&p.status==='active';}))return false;
    adopt(l,c);if(c.team161.some(function(p){return p.role===role&&p.status==='active';}))return false;
    var serial=(c.staffSerial161||0)+1;c.staffSerial161=serial;
    var rng=E.LIFE138.random(l.id+':'+c.id+':staff:'+serial),p={id:c.id+':staff:'+serial,role:role,skill:Math.round(45+rng()*45),salary:salary,since:l.age,until:l.age+years,paidAt:l.age,status:'active',performance:null};
    H.cash(l,-salary,'Lương '+ROLES[role][0]+' · '+c.name);c.team161.push(p);history(c,p,l.age,'ký hợp đồng '+years+' năm');sync(c);return true;
  }
  function payroll(l,c,r,log){
    if(!c.team161)return false;
    c.team161.forEach(function(p){
      if(p.status!=='active'||p.paidAt===l.age)return;
      if(l.age>=p.until){p.status='expired';history(c,p,l.age,'hết hợp đồng');return;}
      var rng=E.LIFE138.random(l.id+':'+p.id+':'+l.age);
      if(rng()<.025){p.status='resigned';history(c,p,l.age,'xin nghỉ');log(ROLES[p.role][0]+' của '+c.name+' xin nghỉ; cần tìm người thay thế.','neutral');return;}
      if(l.money<p.salary||!S.apps().some(function(a){return a.id===c.app&&a.enabled;})){p.status='suspended';history(c,p,l.age,'dừng vì thiếu ngân sách hoặc nền tảng ngừng');return;}
      H.cash(l,-p.salary,'Lương '+ROLES[p.role][0]+' · '+c.name);p.paidAt=l.age;
    });sync(c);c.staffPaidAt=l.age;return true;
  }
  function can(c,task){return !c.team161||c.team161.some(function(p){return p.status==='active'&&(p.legacy||ROLES[p.role][2]===task||ROLES[p.role][2]==='all'||task==='live'&&ROLES[p.role][2]==='schedule');});}
  function quality(c){if(!c.team161)return c.staff*6;return Math.min(18,c.team161.filter(function(p){return p.status==='active';}).reduce(function(n,p){return n+(p.units||(p.role==='team'?3:1))*6*p.skill/60;},0));}
  function review(l,c){(c.team161||[]).forEach(function(p){if(p.status==='active'&&p.reviewAt!==l.age){p.reviewAt=l.age;p.performance=Math.round(Math.min(100,Math.max(0,p.skill*.6+(c.reputation||0)*.2+(c.engagement||0)*.2)));}});}
  X.menu('mediaStaff161','Hợp đồng đội ngũ truyền thông',why,function(l,d){var c=find(l,d.arg.id);if(!c)return 'Kênh không còn tồn tại.';return c.name+' · Lương thanh toán từng năm, hợp đồng 1–3 năm. Quyền đăng bài, livestream, quảng cáo và giao lưu vẫn cần được bật riêng. Hết hợp đồng cần chủ động gia hạn. Không tự ký quảng cáo.'+'\n'+(c.team161||[]).map(function(p){return ROLES[p.role][0]+' · năng lực '+p.skill+'/100 · '+H.money(l,p.salary)+'/năm · hết hạn khi bạn '+p.until+' tuổi · '+({active:'đang làm việc',ended:'đã kết thúc',expired:'hết hạn',resigned:'đã xin nghỉ',suspended:'tạm dừng'}[p.status]||'chưa xác định')+' · hiệu suất '+(p.performance==null?'chưa đánh giá':p.performance+'/100');}).join('\n');},function(l,a){var c=find(l,a.id);if(!c)return[];var out=[];if(!c.team161&&c.staff)return[{k:'adopt',l:'Chuyển đội ngũ hiện tại sang hợp đồng · giữ lương đã trả và cấp nhân sự',run:function(l,r,log){adopt(l,c);log('Đã ghi nhận hợp đồng cho đội ngũ hiện tại; giữ lương kỳ đã trả.','neutral');}}];Object.keys(ROLES).forEach(function(role){var p=(c.team161||[]).find(function(p){return p.role===role&&p.status==='active';});if(p){out.push({k:'stop:'+p.id,l:'Kết thúc hợp đồng '+ROLES[role][0],run:function(l,r,log){p.status='ended';history(c,p,l.age,'chủ động kết thúc');sync(c);log('Kết thúc hợp đồng; lương kỳ đã trả không hoàn lại.','neutral');}});return;}[1,2,3].forEach(function(y){out.push({k:role+':'+y,l:'Thuê '+ROLES[role][0]+' · '+y+' năm · '+H.money(l,l.base*ROLES[role][1])+'/năm',why:l.money>=l.base*(ROLES[role][1]+.1)?true:'Thiếu lương năm đầu và quỹ dự phòng',run:function(l,r,log){if(hire(l,c,role,y))log('Đã ký hợp đồng '+ROLES[role][0]+', trả lương năm đầu.','good');}});});});return out;},18);
  var convert=E.abroadConvert;E.abroadConvert=function(l,f){var out=convert.apply(this,arguments);S.state(l).channels.forEach(function(c){(c.team161||[]).forEach(function(p){p.salary*=f;});});return out;};
  E.MEDIA161={roles:ROLES,hire:hire,payroll:payroll,can:can,review:review,sync:sync,quality:quality};
})(globalThis.G);
