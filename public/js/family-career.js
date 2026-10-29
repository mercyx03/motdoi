/* Employment in the family's existing career ladder is independent of marriage. */
(function(G){'use strict';var E=G.E,H=E.H,X=E.UPDATE110;
function eligible(l){return l.fam&&['tp','nh'].includes(l.fam.elite);}
function jobid(l){return E.jobs.eliteJob(l);}
function employed(l){return eligible(l)&&l.job&&E.resolveJob(l.job.id)===jobid(l);}
function state(l){return l.flags.familyCareer899||(l.flags.familyCareer899={country:l.country,status:'available',history:[]});}
function remember(l){if(!employed(l))return;var s=state(l);s.job=JSON.parse(JSON.stringify(l.job));s.job.fam=true;s.country=H.resCode(l);s.status='employed';s.salaryRatio=Math.max(0,(l.job.last||E.monthlyEst(l,l.job.id,l.job.rank)*12)/l.base);}
function why(l){return !eligible(l)?'Không có cơ nghiệp gia đình thuộc nhánh này':X.reason(l,21)!==true?X.reason(l,21):l.retired?'Đã nghỉ hưu':l.school?'Cần thu xếp việc học trước khi nhận việc':!state(l).job&&l.edu<5?'Cần trình độ đại học trong mô phỏng cho vị trí tuyển mới':H.resCode(l)!==(state(l).country||l.country)?'Cần trở lại quốc gia của hợp đồng; không tự làm việc từ xa':E.BUSINESS133.seated(l)?'Cần rời ghế chủ tịch tập đoàn riêng trước':E.isStableService(l)?'Cần bàn giao công vụ trước':employed(l)?'Đang có công việc gia đình':true;}
function resume(l,r,log){
 if(why(l)!==true)return false;var s=state(l),previous=l.job,old=(l.jobsHist||[]).slice(-1)[0],snapshot=s.job,salaryRatio=s.salaryRatio;
 E.startJob(l,jobid(l),r,log,true);if(!employed(l)){log('Chưa nhận việc: còn nghĩa vụ hoặc hạn chế công việc cần thu xếp.','neutral');return false;}
 if(old&&previous&&old.to==null)old.to=l.age;
 if(snapshot&&snapshot.id===l.job.id){['rank','yrs','sen','k','p','rankTracked','rankSince'].forEach(function(k){if(snapshot[k]!=null)l.job[k]=snapshot[k];});if(salaryRatio>0){l.job.floor=salaryRatio*l.base;l.job.floorRk=l.job.rank;l.job.last=salaryRatio*l.base;l.job.lastRk=l.job.rank;}}
 l.job.fam=true;l.flags.eliteJobDone=true;l.flags.needJob=false;l.flags.upgradeJob=false;
 s.history.push({at:l.age,event:'returned',rank:l.job.rank});if(s.history.length>12)s.history.shift();remember(l);
 log('Đã ký lại công việc gia đình: '+E.jobTitle(l)+'. Giữ bậc nghề và hồ sơ lương đã biết, không trả lương cho các năm nghỉ. Lương theo cơ chế nghề hiện có; cổ tức và vai trò tự điều hành công ty riêng được tính riêng.','good');return true;
}
X.menu('familyCareer899','Công việc gia đình — hợp đồng và trở lại',function(l){return eligible(l)?X.reason(l,18):'Không có cơ nghiệp gia đình trong nhánh này';},function(l){var s=state(l);return 'Hợp đồng: '+(employed(l)?'đang làm việc':s.job?'có hồ sơ vị trí trước đây':'chưa có hồ sơ vị trí cũ')+'. '+(why(l)===true?'Có thể xem xét ký hợp đồng để trở lại.':why(l))+'. Từ chối mai mối không tự hủy công việc. Du học là quãng nghỉ làm, cần xác nhận nhận việc sau khi về; không buộc chấp nhận hôn nhân để quay lại.';},function(l){return [{k:'review',l:'Xem và xác nhận công việc sẽ nhận',why:why(l),run:function(l,r){X.next(l,'familyCareerSign899',r);}}];},18,'Công việc');
E.SC('familyCareerSign899',{title:'Xác nhận trở lại cơ nghiệp gia đình',prep:function(l){return {at:l.age,done:false};},valid:function(l,d){return why(l)===true&&(!d||!d.done&&d.at===l.age);},text:function(l){var s=state(l),j=s.job;return 'Dự kiến '+E.CAR[jobid(l)].t[j?j.rank:0]+'. '+(j?'Khôi phục hồ sơ bậc nghề trước khi nghỉ, không tự thăng chức.':'Không đủ dữ liệu lương cũ: bắt đầu theo bậc tuyển dụng hiện tại, không tự bịa mức lương trước đây.')+(l.job?' Ký nghĩa là rời công việc '+E.jobTitle(l)+' đang làm.':'')+' Vai trò này có lương theo thang nghề gia đình, khác với tự điều hành tài sản riêng không nhận lương.';},opts:[{k:'sign',l:'Đồng ý nhận việc theo điều kiện trên',run:function(l,r,log,d){if(!E.DEC.familyCareerSign899.valid(l,d))return;d.done=true;resume(l,r,log);}},{k:'cancel',l:'Chưa nhận việc, giữ tình trạng hiện tại',run:function(){}}]});
var start=E.startJob;E.startJob=function(l){remember(l);var out=start.apply(this,arguments);remember(l);return out;};
var resolve=E.resolve;E.resolve=function(l){remember(l);var was=employed(l),out=resolve.apply(this,arguments);if(was&&!employed(l)){var s=state(l);s.status=l.school?'study-break':'left';s.history.push({at:l.age,event:s.status});if(s.history.length>12)s.history.shift();}remember(l);return out;};
E.HOOKS.year.push(function(l){remember(l);});
var migrate=E.migrateExt;E.migrateExt=function(l){if(migrate)migrate(l);if(!eligible(l))return;var s=state(l);if(!Array.isArray(s.history))s.history=[];remember(l);if(!s.job){var hist=(l.jobsHist||[]).filter(function(j){return E.resolveJob(j.id)===jobid(l);}).pop();if(hist){s.status='legacy-return';s.historyRecovered=true;}}};
E.FAMILYCAREER899={state:state,remember:remember,resume:resume,why:why,employed:employed};
})(globalThis.G);
