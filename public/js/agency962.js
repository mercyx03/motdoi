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
function prepKey(id){return roles[id].focus==='kno'?'ôn phân tích và viết báo cáo':'luyện trình bày và xử lý tình huống';}
function prepWhy(l,id){
 var s=peek(l),q=s.application,last=s.lastOutcome965;
 if(basic(l,id)!==true||employed(l)||q&&q.id!==id)return false;
 return !!(q&&q.stage==='screen'&&l.age<=q.due||!q&&last?.id===id&&last.retry&&l.age<last.retry)&&s.prep966?.at!==l.age&&!(s.prep966?.id===id&&s.prep966.count>=2);
}
function prepare(l,id,log){
 if(!prepWhy(l,id))return false;
 var s=state(l),old=s.prep966;
 s.prep966={id:id,at:l.age,count:Math.min(2,(old?.id===id?old.count:0)+1)};
 if(l.mind)l.mind.stress=U.clamp((l.mind.stress||0)+2,0,100);
 log('Bạn '+prepKey(id)+' cho vòng đánh giá của '+roles[id].agency+'.','good');
 return true;
}
function advance(l,id,r,log){
 var p=roles[id],s=state(l),q=s.application;
 if(basic(l,id)!==true||q&&q.id!==id||l.job&&l.job.id===id)return false;
 if(!q){
   if(s.retryAt>l.age)return false;
   delete s.lastOutcome965;
   s.application={id:id,stage:'screen',due:l.age+1};
   log('Bạn nộp hồ sơ '+p.agency+'. Sang năm sẽ có vòng đánh giá.','neutral');
   return true;
 }
 if(l.age<q.due||l.age>q.due+2)return false;
 if(q.stage==='offer')return E.startJob(l,id,r,log)===true;
 var screened=q.stage==='screen';
 var prep=s.prep966&&s.prep966.id===id?s.prep966.count:0;
 if(screened)delete s.prep966;
 var score=screened?(l.st.kno*.55+l.st[p.focus]*.25+Math.min(20,professional(l)*4)+prep*7):(l.st.hea*.45+l.st.kno*.35+10);
 if(r()>=U.clamp(.15+score/125,.2,.93)){
   delete s.application;
   s.retryAt=l.age+2;
   var reason=screened?
     (l.st.kno<65?'Bài đánh giá kiến thức chưa đạt mức cạnh tranh.':l.st[p.focus]<65?'Bài đánh giá kỹ năng chuyên môn chưa đạt mức cạnh tranh.':'Hồ sơ đã qua điều kiện cơ bản nhưng chưa được chọn trong đợt cạnh tranh.') :
     (l.st.hea<65?'Vòng đánh giá sức khỏe cần kết quả tốt hơn.':'Hồ sơ chưa được thông qua ở vòng thẩm tra.');
   s.lastOutcome965={id:id,reason:reason,at:l.age,retry:s.retryAt};
   log(p.agency+': '+reason+' Có thể nộp lại từ năm '+(l.birthYear+s.retryAt)+'.','neutral');
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
 if(!q||q.id!==key||q.stage!=='offer'||q.due>l.age||l.age>q.due+2||basic(l,key)!==true)return false;
 var before=l.job;
 start.call(this,l,key,r,log,quiet);
 if(!l.job||l.job===before||l.job.id!==key)return false;
 l.job.agencyWork=0;
 delete state(l).prep966;
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
function workReady(l) {
 var p=employed(l);
 return !!(p&&X.reason(l,18)===true&&location(l)===p.country&&clearance(l));
}
function revise(l,r,log){
 var q=l.job&&l.job.agencyRevision967;
 if(!workReady(l)||!q||l.age<q.due||l.job.agencyAt===l.age)return;
 l.job.agencyAt=l.age;
 var chance=U.clamp(.3+l.st[employed(l).focus]/160,.3,.95);
 if(r()<chance){
   l.job.agencyWork=(l.job.agencyWork||0)+1;
   delete l.job.agencyRevision967;
   log('Hồ sơ bổ sung đã được duyệt sau khi đối chiếu lại các điểm còn thiếu.','good');
 }else{
   q.due=l.age+1;
   log('Người hướng dẫn yêu cầu làm rõ thêm một điểm. Hồ sơ được giữ để tiếp tục năm sau.','neutral');
 }
}
function duty(l,thorough,r,log){
 var p=employed(l);
 if(!workReady(l)||l.job.agencyRevision967||l.job.agencyAt===l.age)return;
 l.job.agencyAt=l.age;
 var good=r()<U.clamp(.2+l.st[p.focus]/150+(thorough?.16:0),.15,.95);
 if(good)l.job.agencyWork=(l.job.agencyWork||0)+1;
 else l.job.agencyRevision967={due:l.age+1};
 if(thorough&&l.mind)l.mind.stress=U.clamp(l.mind.stress+4,0,100);
 log(p.agency+(good?' ghi nhận hồ sơ bạn hoàn thành.':' yêu cầu bổ sung hồ sơ. Bạn có thể đối chiếu lại với người hướng dẫn từ năm sau.'),good?'good':'neutral');
}
function available(l){
 var reason=X.reason(l,18);
 if(reason!==true)return reason;
 return Object.values(roles).some(function(p){return p.country===location(l)&&p.since<=calendar(l);})||peek(l).application||employed(l)?true:'Dành cho các vị trí theo nơi ở và năm hiện tại';
}
X.menu('agency962','Điều tra liên bang và tình báo',available,
 function(l){
   var q=peek(l).application,p=employed(l);
   if(p){var c=E.jobDef(l),rank=l.job.rank||0,revision=l.job.agencyRevision967;return p.work+'. Hồ sơ đã hoàn thành: '+(l.job.agencyWork||0)+'. '+(revision?'Có hồ sơ cần bổ sung từ năm '+(l.birthYear+revision.due)+'. ':'')+(rank<c.t.length-1?'Bậc tiếp theo: '+c.t[rank+1]+' · cần '+(rank+1)*2+' hồ sơ và '+c.yrs[rank]+' năm ở bậc hiện tại ('+(l.job.yrs||0)+' năm).':'Đang ở bậc cao nhất của đường nghề này.');}
   if(q)return 'Hồ sơ '+roles[q.id].ranks[0]+' · '+({screen:'đánh giá năng lực',vetting:'thẩm tra',offer:'nhận việc'})[q.stage]+' từ năm '+(l.birthYear+q.due)+' đến hết '+(l.birthYear+q.due+2)+'.'+(basic(l,q.id)===true?'':' '+basic(l,q.id)+'.');
   var last=peek(l).lastOutcome965;
   return (last?roles[last.id].agency+': '+last.reason+(last.retry?' Có thể nộp lại từ năm '+(l.birthYear+last.retry)+'.':'')+'\n':'')+
      'Chọn vị trí theo quốc tịch, bằng cấp và kinh nghiệm.\n'+Object.keys(roles).filter(function(id){return roles[id].country===location(l)&&roles[id].since<=calendar(l);}).map(function(id){var why=basic(l,id);return roles[id].ranks[0]+' · '+(why===true?'đủ điều kiện nộp hồ sơ':why);}).join('\n');
 },function(l){
   var s=peek(l),q=s.application,p=employed(l),out=[];
   if(p){
     if(l.job.agencyRevision967){
       out.push({k:'revise',l:'Bổ sung hồ sơ cùng người hướng dẫn',
         why:workReady(l)&&l.age>=l.job.agencyRevision967.due&&l.job.agencyAt!==l.age?true:'Chờ sang năm hoặc kiểm tra điều kiện làm việc',
         run:function(l,r,log){revise(l,r,log);}});
       out.push({k:'close-work',l:'Khép hồ sơ đang bổ sung, chuyển sang công việc tiếp theo',
         why:workReady(l)&&l.job.agencyAt!==l.age?true:'Đã xử lý công việc năm nay',
         run:function(l,r,log){
           if(!workReady(l)||!l.job.agencyRevision967||l.job.agencyAt===l.age)return;
           l.job.agencyAt=l.age;delete l.job.agencyRevision967;
           log('Bạn bàn giao phần việc còn dở và khép hồ sơ này.','neutral');
         }});
     }
     [true,false].forEach(function(thorough){
       out.push({k:thorough?'review':'standard',l:thorough?'Dành thêm thời gian kiểm chứng hồ sơ':'Xử lý hồ sơ theo lịch bình thường',
         why:l.job.agencyRevision967?'Cần xử lý hồ sơ còn dở':l.job.agencyAt===l.age?'Đã xử lý hồ sơ năm nay':location(l)!==p.country?'Đã đổi nơi cư trú':true,
         run:function(l,r,log){duty(l,thorough,r,log);}});
     });
   }
   Object.keys(roles).filter(function(id){return q?q.id===id:roles[id].country===location(l)&&roles[id].since<=calendar(l);}).forEach(function(id){
     var why=basic(l,id);
     if(why===true){
       if(l.job&&l.job.id===id)why='Đang làm công việc này';
       else if(q&&(q.due>l.age||l.age>q.due+2)||!q&&s.retryAt>l.age)why='Chưa đến năm xử lý tiếp';
     }
     out.push({k:id,l:(q?{screen:'Dự vòng đánh giá · ',vetting:'Hoàn tất thẩm tra · ',offer:'Nhận việc · '}[q.stage]:'Nộp hồ sơ · ')+roles[id].ranks[0],why:why,
       run:function(l,r,log){advance(l,id,r,log);}});
     if(prepWhy(l,id))out.push({k:'prep:'+id,l:U.cap(prepKey(id))+' · '+roles[id].agency,
       h:'Tăng mức chuẩn bị cho vòng đánh giá. Tối đa hai buổi được tính.',run:function(l,r,log){prepare(l,id,log);}});
   });
   if(q)out.push({k:'withdraw',l:'Rút hồ sơ đang xét',run:function(l,r,log){delete state(l).application;delete state(l).prep966;log('Bạn rút hồ sơ tuyển dụng.','neutral');}});
   return out;
 },18,'Công việc');
E.HOOKS.year.push(function(l,r,log){
 var q=peek(l).application;
 if(q&&(!clearance(l)||location(l)!==roles[q.id].country||l.age>q.due+2)){
   var reason=location(l)!==roles[q.id].country?'Nơi cư trú thay đổi.':!clearance(l)?'Điều kiện thẩm tra đã thay đổi.':'Đã qua hạn của vòng tuyển.';
   state(l).lastOutcome965={id:q.id,reason:reason,at:l.age};
   delete state(l).application;
   delete state(l).prep966;
   log('Hồ sơ tuyển dụng đã đóng. '+reason,'neutral');
 }
});
E.AGENCY962={basic:basic,advance:advance};
})(globalThis.G);
