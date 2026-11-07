/* Bounded undergraduate extensions; never award a degree for an unfinished course. */
(function(G){'use strict';var E=G.E,H=E.H,X=E.UPDATE110,C=E.WORLD120;
function student(l){return l.school==='uni'||l.school==='abroad';}
function state(l){return l.flags.studyProgress136||(l.flags.studyProgress136={due:Number.isFinite(l.schoolEnd)?l.schoolEnd:l.age+1,reviewAt:-1});}
function conditions(l){
  var q=C.p(l),language=E.EDU111.exitRequirement(l);
  return [
    {key:'credits',met:!(q.debtCredits>0),text:q.debtCredits>0?'Còn nợ '+q.debtCredits+' tín chỉ':'Đã hoàn tất tín chỉ'},
    {key:'attendance',met:!(q.absences>=2),text:q.absences>=2?'Thiếu chuyên cần ('+q.absences+' đợt vắng)':'Đủ chuyên cần'},
    {key:'language',met:language.met,text:language.level
      ?'Ngoại ngữ đầu ra: cần '+language.label+' còn hạn. Hiện tại: '+((l.lang&&l.lang.en)?H.langCert(l,'en')+(E.certValid(l,'en')?' còn hạn':' đã hết hạn'):'chưa có chứng chỉ')
      :'Chương trình này không yêu cầu chứng chỉ ngoại ngữ đầu ra riêng'},
    {key:'academic',met:!(q.academicCase&&q.academicCase.status==='pending'),text:q.academicCase&&q.academicCase.status==='pending'?'Hồ sơ học thuật đang chờ xác minh':'Hồ sơ học thuật đủ điều kiện'},
    {key:'defense',met:!!l.flags.gradOK,text:l.flags.gradOK?'Đã bảo vệ đạt':l.flags.gradTry===l.age?'Bảo vệ chưa đạt trong năm nay':'Chưa hoàn tất bảo vệ tốt nghiệp'}
  ];
}
function checklist(l){return conditions(l).map(function(c){return (c.met?'Đạt · ':'Chưa đạt · ')+c.text;}).join('\n');}
function actionReason(l,id){
  var action=E.ACT.find(function(a){return a.id===id;});
  return action&&action.avail?action.avail(l):true;
}
function leave(l,log){var s=state(l),q=C.s(l);s.closed=true;s.closedAt=l.age;s.result='unfinished';s.name=l.uniName||l.majorName||'Đại học';s.debt=q.debtCredits||0;l.school=null;l.schoolEnd=null;l.flags.needJob=true;delete l.flags.gradOK;delete l.flags.gradTry;delete l.flags.gradTries;delete q.debtCredits;delete q.absences;delete q.creditNoticeAt;delete q.languageNoticeAt;l.pending=(l.pending||[]).filter(function(d){return !['studyReview136','courseFail121','bao_ve_tn'].includes(d.id);});if(l.abroad&&l.abroad.study){l.abroad.until=l.age+1;H.sched(l,'du_hoc_ve',1);}log('Kết thúc đợt học '+s.name+' khi chưa đủ điều kiện tốt nghiệp. Kết quả và lý do được lưu, không cấp bằng; bạn có thể tìm việc hoặc đăng ký học lại qua tuyển sinh.','neutral');}
var grad=E.gradFail;E.gradFail=function(l,r,log){if(!student(l))return grad&&grad.apply(this,arguments);var s=state(l);if(s.closed)delete l.flags.studyProgress136;s=state(l);var failed=grad&&grad.apply(this,arguments);if(!failed){s.completed=true;return false;}if(l.age+1>=s.due+4){leave(l,log);return true;}l.schoolEnd=l.age+2;if(l.abroad&&l.abroad.study)l.abroad.until=l.schoolEnd;if(s.reviewAt!==l.age){s.reviewAt=l.age;log('Xét tốt nghiệp chưa đạt: '+conditions(l).filter(function(c){return !c.met;}).map(function(c){return c.text;}).join('; ')+'. Còn tối đa '+Math.max(0,s.due+4-l.age-1)+' năm gia hạn trong mô phỏng. Mở mục Tiến độ đại học để xử lý.','neutral');if(!l.pending.some(function(d){return d.id==='studyReview136';}))l.pending.push(E.DEC.studyReview136.make(l,r));}return true;};
function why(l){var w=X.reason(l,16);return w!==true?w:student(l)?true:'Cần đang học đại học';}
X.menu('studyReview136','Tiến độ đại học và điều kiện tốt nghiệp',why,function(l){
  var s=state(l);
  return 'Chương trình: '+(l.uniName||l.majorName||'đại học')+'.\n'+checklist(l)+
    '\nHạn dự kiến: '+s.due+' tuổi; kỳ xét tiếp theo: '+l.schoolEnd+' tuổi; tối đa 4 năm gia hạn trong game. Hoàn tất các điều kiện để được xét bằng khi kết thúc năm học.';
},function(l){
  var language=E.EDU111.exitRequirement(l),q=C.p(l);
  var rows=[{k:'credits',l:'Xem tín chỉ, học lại hoặc bổ sung chuyên cần',why:actionReason(l,'student121'),run:function(l,r){X.next(l,'student121',r);}}];
  if(language.level&&!language.met){
    rows.push({k:'language',l:'Học bổ sung tiếng Anh đầu ra',why:actionReason(l,'hoc_them'),run:function(l,r){l.flags.langGoal='en';X.next(l,'hoc_them',r);}});
    if(l.lang&&l.lang.en&&!E.certValid(l,'en'))rows.push({k:'renew',l:'Thi lại chứng chỉ tiếng Anh đã hết hạn',run:function(l,r){X.next(l,'chung_chi_het_han',r,{k:'en',manual:true});}});
  }
  if(q.academicCase&&q.academicCase.status==='pending')rows.push({k:'academic',l:'Xử lý hồ sơ học thuật đang xác minh',why:actionReason(l,'academicReview125'),run:function(l,r){X.next(l,'academicReview125',r);}});
  rows.push({k:'defense',l:'Chuẩn bị và bảo vệ tốt nghiệp',
    why:l.flags.gradOK?'Đã bảo vệ đạt':l.flags.gradTry===l.age?'Đã bảo vệ năm nay':!E.DEC.bao_ve_tn.valid(l)?'Chưa đến kỳ bảo vệ':conditions(l).some(function(c){return c.key!=='defense'&&!c.met;})?'Cần hoàn tất tín chỉ, chuyên cần, ngoại ngữ và hồ sơ học thuật':true,
    run:function(l,r){l.pending=l.pending.filter(function(d){return d.id!=='bao_ve_tn';});X.next(l,'bao_ve_tn',r);}});
  rows.push({k:'continue',l:'Tiếp tục chương trình',run:function(l,r,log){log(checklist(l)+'\nHoàn tất điều kiện còn thiếu để xét tốt nghiệp khi kết thúc năm học.','neutral');}},
    {k:'leave',l:'Dừng đợt học này, không nhận bằng đại học',run:function(l,r){X.next(l,'studyLeave136',r);}});
  return rows;
},16,'Học tập');
X.menu('studyLeave136','Xác nhận dừng chương trình',why,'Bạn giữ các bằng cấp đã đạt, nhưng không nhận bằng cho chương trình chưa hoàn tất. Học phí đã chi không được hoàn lại.',function(l){return[{k:'confirm',l:'Đồng ý dừng đợt học và tìm hướng khác',run:function(l,r,log){leave(l,log);}}];},16);
['major','study_wishes54','study_direct111'].forEach(function(id){C.wrap(id,function(old,l,d,k,r,log){var was=student(l),out=old(l,d,k,r,log);if(!was&&student(l)){delete l.flags.studyProgress136;var q=C.s(l);delete q.debtCredits;delete q.absences;delete q.creditNoticeAt;delete q.languageNoticeAt;delete l.flags.gradTry;delete l.flags.gradTries;delete l.flags.gradOK;state(l);}return out;});});
var profile=E.profile;E.profile=function(l){var p=profile.apply(this,arguments);if(student(l)){var s=state(l);p.jobInfo.push('Đại học: dự kiến hoàn tất ở '+s.due+' tuổi; hạn gia hạn trong game '+(s.due+4)+' tuổi. Xem Tiến độ đại học để kiểm tra điều kiện.');}return p;};
E.STUDY136={state:state,leave:leave,conditions:conditions};
})(globalThis.G);
