/* International investigation and intelligence careers. Hiring and work outcomes use game parameters. */
(function(G){
'use strict';
var E=G.E,H=E.H,U=G.U,X=E.UPDATE110;
var roles={
 fbi_agent962:{agency:'FBI',country:'US',since:1935,age:23,max:37,physical:65,
  ranks:['đặc vụ FBI','đặc vụ FBI cấp cao','giám sát tổ điều tra FBI'],pay:[23,32,43],
  work:'Đối chiếu lời khai trong một hồ sơ điều tra liên bang',focus:'soc'},
 fbi_analyst962:{agency:'FBI',country:'US',since:1935,age:18,
  ranks:['chuyên viên phân tích FBI','chuyên viên phân tích FBI cấp cao','trưởng nhóm phân tích FBI'],pay:[18,25,35],
  work:'Đánh giá dữ liệu cho nhóm điều tra liên bang',focus:'kno'},
 cia_analyst962:{agency:'CIA',country:'US',since:1947,age:18,
  ranks:['chuyên viên phân tích tình báo CIA','chuyên viên phân tích CIA cấp cao','trưởng nhóm phân tích CIA'],pay:[19,27,38],
  work:'Soạn đánh giá tình hình nước ngoài từ các nguồn đã kiểm chứng',focus:'kno'},
 cia_ops962:{agency:'CIA',country:'US',since:1947,age:18,
  ranks:['sĩ quan nghiệp vụ CIA','sĩ quan nghiệp vụ CIA cấp cao','quản lý nghiệp vụ CIA'],pay:[22,30,41],
  work:'Đánh giá độ tin cậy của nguồn tin cho hồ sơ tình báo nước ngoài',focus:'soc'},
 mi5_analyst962:{agency:'MI5',country:'GB',since:1916,age:18,
  ranks:['chuyên viên phân tích MI5','chuyên viên tình báo MI5 cấp cao','trưởng nhóm phân tích MI5'],pay:[18,26,36],
  work:'Đối chiếu thông tin trong hồ sơ an ninh nội địa',focus:'kno'}
};
Object.keys(roles).forEach(function(id){
 var p=roles[id];
 E.CAR[id]={id:id,t:p.ranks,vn:p.pay,yrs:[3,5],hidden:true,agency962:true,minAge:p.age,edu:5,sec:'formal',cat:'office',sigma:.09,promo:.33,loss:.008,w:0};
});
function location(l){return H.resCode(l);}
function calendar(l){return l.birthYear+l.age;}
function peek(l){return l.flags.agency962||{};}
function state(l){return l.flags.agency962||(l.flags.agency962={});}
function employed(l){return l.job&&roles[l.job.id];}
function professional(l){
 var history=l.jobsHist||[];
 return history.reduce(function(years,h,i){
   var c=E.CAR[E.resolveJob(h.id)];
   if(!c||c.sec!=='formal'||(c.edu||0)<4&&c.cat!=='state')return years;
   var end=Math.min(h.to==null?(history[i+1]?history[i+1].from:l.age):h.to,l.age);
   return years+Math.max(0,end-h.from);
 },0);
}
function clearance(l){
 var under=l.flags.underworld,world=l.flags.worldCrime;
 return !l.record&&!l.flags.crime911?.open&&!E.isCrime(l)&&!(under&&under.linked)&&!(world&&Object.values(world.groups).some(function(g){return g.joined;}))&&
   !(l.sched||[]).some(function(s){return s.id==='bi_bat';})&&!(l.pending||[]).some(function(s){return s.id==='bi_bat';});
}
function basic(l,id){
 var p=roles[id],adult=X.reason(l,18);
 if(adult!==true)return adult;
 if(location(l)!==p.country||calendar(l)<p.since)return 'Chưa tuyển vị trí này tại nơi ở và năm hiện tại';
 if(!E.isCitizenOf(l,p.country))return 'Cần quốc tịch '+(p.country==='US'?'Mỹ':'Anh');
 if(l.age<p.age||p.max&&l.age>p.max)return 'Độ tuổi ứng tuyển trong game: '+p.age+(p.max?'–'+p.max:' trở lên');
 if(l.edu<5||l.school)return 'Cần tốt nghiệp đại học và hoàn tất chương trình đang học';
 if(!clearance(l))return 'Hồ sơ chưa đáp ứng điều kiện thẩm tra trong game';
 if(p.physical&&l.st.hea<p.physical)return 'Cần thể lực '+p.physical+'/100';
 if(p.physical&&professional(l)<(l.edu>=6?1:2))return 'Cần '+(l.edu>=6?1:2)+' năm kinh nghiệm chuyên môn';
 return true;
}
function advance(l,id,r,log){
 var p=roles[id],s=state(l),q=s.application;
 if(basic(l,id)!==true||q&&q.id!==id||l.job&&l.job.id===id)return false;
 if(!q){
   if(s.retryAt>l.age)return false;
   s.application={id:id,stage:'screen',due:l.age+1};
   log('Bạn nộp hồ sơ '+p.agency+'. Sang năm sẽ có vòng đánh giá.','neutral');
   return true;
 }
 if(l.age<q.due)return false;
 if(q.stage==='offer')return E.startJob(l,id,r,log)===true;
 var screened=q.stage==='screen';
 var score=screened?(l.st.kno*.55+l.st[p.focus]*.25+Math.min(20,professional(l)*4)):(l.st.hea*.45+l.st.kno*.35+10);
 if(r()>=U.clamp(.15+score/125,.2,.93)){
   delete s.application;
   s.retryAt=l.age+2;
   log(p.agency+(screened?' chưa chọn hồ sơ qua vòng đánh giá.':' chưa thông qua vòng thẩm tra và đánh giá sức khỏe.')+' Có thể thử lại sau hai năm.','neutral');
   return true;
 }
 q.stage=screened?'vetting':'offer';
 q.due=l.age+1;
 log(screened?'Qua vòng đánh giá '+p.agency+'. Hồ sơ chuyển sang thẩm tra và đánh giá sức khỏe.':'Thẩm tra hoàn tất. Có thể nhận việc tại '+p.agency+' từ năm sau.','good');
 return true;
}
var start=E.startJob;
E.startJob=function(l,id,r,log,quiet){
 var key=E.resolveJob(id),p=roles[key];
 if(!p)return start.apply(this,arguments);
 var q=peek(l).application;
 if(!q||q.id!==key||q.stage!=='offer'||q.due>l.age||basic(l,key)!==true)return false;
 var before=l.job;
 start.call(this,l,key,r,log,quiet);
 if(!l.job||l.job===before||l.job.id!==key)return false;
 l.job.agencyWork=0;
 delete state(l).application;
 return true;
};
var career=E.careerYear;
E.careerYear=function(l,r,log,focus){
 var p=employed(l);
 if(p&&(location(l)!==p.country||!clearance(l))){
   l.lastJob=l.job;l.job=null;l.flags.needJob=true;
   log('Công việc tại '+p.agency+' kết thúc do nơi cư trú hoặc điều kiện thẩm tra thay đổi.','neutral');
   return 0;
 }
 return career.apply(this,arguments);
};
var canAdvance=E.canAdvance;
E.canAdvance=function(l,c,yearly){
 if(c&&roles[c.id]&&(!l.job||(l.job.agencyWork||0)<(l.job.rank+1)*2))return false;
 return !canAdvance||canAdvance.apply(this,arguments);
};
function duty(l,thorough,r,log){
 var p=employed(l);
 if(!p||location(l)!==p.country||!clearance(l)||l.job.agencyAt===l.age)return;
 l.job.agencyAt=l.age;
 var good=r()<U.clamp(.2+l.st[p.focus]/150+(thorough?.16:0),.15,.95);
 if(good)l.job.agencyWork=(l.job.agencyWork||0)+1;
 if(thorough&&l.mind)l.mind.stress=U.clamp(l.mind.stress+4,0,100);
 log(p.agency+(good?' ghi nhận hồ sơ bạn hoàn thành.':' yêu cầu kiểm tra thêm trước khi duyệt hồ sơ.'),good?'good':'neutral');
}
function available(l){
 var reason=X.reason(l,18);
 if(reason!==true)return reason;
 return Object.values(roles).some(function(p){return p.country===location(l)&&p.since<=calendar(l);})||peek(l).application||employed(l)?true:'Dành cho các vị trí theo nơi ở và năm hiện tại';
}
X.menu('agency962','Điều tra liên bang và tình báo',available,
 function(l){
   var q=peek(l).application,p=employed(l);
   if(p)return p.work+'. Hồ sơ đã hoàn thành: '+(l.job.agencyWork||0)+'.';
   return q?'Hồ sơ '+roles[q.id].ranks[0]+' · '+({screen:'đánh giá năng lực',vetting:'thẩm tra',offer:'nhận việc'})[q.stage]+'.':
     'Chọn vị trí theo quốc tịch, bằng cấp và kinh nghiệm. Quy trình tuyển trong game qua nhiều năm.';
 },function(l){
   var s=peek(l),q=s.application,p=employed(l),out=[];
   if(p){
     [true,false].forEach(function(thorough){
       out.push({k:thorough?'review':'standard',l:thorough?'Dành thêm thời gian kiểm chứng hồ sơ':'Xử lý hồ sơ theo lịch bình thường',
         why:l.job.agencyAt===l.age?'Đã xử lý hồ sơ năm nay':location(l)!==p.country?'Đã đổi nơi cư trú':true,
         run:function(l,r,log){duty(l,thorough,r,log);}});
     });
   }
   Object.keys(roles).filter(function(id){return q?q.id===id:roles[id].country===location(l)&&roles[id].since<=calendar(l);}).forEach(function(id){
     var why=basic(l,id);
     if(why===true){
       if(l.job&&l.job.id===id)why='Đang làm công việc này';
       else if(q&&q.due>l.age||!q&&s.retryAt>l.age)why='Chưa đến năm xử lý tiếp';
     }
     out.push({k:id,l:(q?{screen:'Dự vòng đánh giá · ',vetting:'Hoàn tất thẩm tra · ',offer:'Nhận việc · '}[q.stage]:'Nộp hồ sơ · ')+roles[id].ranks[0],why:why,
       run:function(l,r,log){advance(l,id,r,log);}});
   });
   if(q)out.push({k:'withdraw',l:'Rút hồ sơ đang xét',run:function(l,r,log){delete state(l).application;log('Bạn rút hồ sơ tuyển dụng.','neutral');}});
   return out;
 },18,'Công việc');
E.HOOKS.year.push(function(l,r,log){
 var q=peek(l).application;
 if(q&&(!clearance(l)||location(l)!==roles[q.id].country)){
   delete state(l).application;
   log('Hồ sơ tuyển dụng đã đóng vì nơi cư trú hoặc lý lịch thay đổi.','neutral');
 }
});
E.AGENCY962={basic:basic,advance:advance};
})(globalThis.G);
