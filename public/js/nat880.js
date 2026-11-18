/* 9.0: hồ sơ nhập quốc tịch là một quy trình nhiều năm thay vì một lần tung xúc xắc (mở rộng life70 và life114, không thay điều kiện cư trú đã có).
   Nộp hồ sơ → chờ xét (1–3 năm, dài hơn nếu có tiền án hoặc hồ sơ nặng) → phỏng vấn/thi (có thể thuê luật sư luyện thi) → tuyên thệ hoặc bị từ chối và nộp lại sau.
   Hồ sơ đang chờ bị hủy nếu bạn rời nước đó, mất tư cách thường trú, bị tù hoặc phát sinh tiền án; nợ xấu và quan hệ làm việc ảnh hưởng kết quả.
   Thời gian chờ là tham số trò chơi, không phải thời gian xử lý chính thức của từng nước. Bản lưu cũ không có hồ sơ đang chờ giữ nguyên hành vi cũ. */
(function(G){'use strict';var E=G.E,H=E.H,U=G.U,SC=E.SC,W=G.W;
var base=E.DEC&&E.DEC.nhap_quoc_tich;if(!base||!base.def||!SC)return;
function where(l){return l.abroad&&l.abroad.perm&&!l.abroad.visit907?l.abroad.code:null;}
function st(l){return l.flags.nat880||null;}
function fee(l){return l.base*.06;}
function lawyerFee(l){return l.base*.05;}
function overdue(l){return (l.loans||[]).some(function(x){return x.late>0&&x.bal>.5;});}
function void880(l,log,why){var s=st(l);if(!s)return;delete l.flags.nat880;(l.flags.natAsk=l.flags.natAsk||{})[s.code]=l.age-1;log('Hồ sơ nhập quốc tịch '+s.name+' bị hủy: '+why+' Lệ phí đã nộp không được hoàn.','bad');H.fx(l,{hap:-4});}
function chance(l,s,prep){
 var p=.7+(l.st.kno-50)/250+(l.job?.08:-.1)+(l.lang&&E.langOf&&l.lang[E.langOf(s.code)]||(l.flags.localLang||{})[s.code]>=1?.1:0);
 p+=Math.min(.1,Math.max(0,(s.yrs-s.need)*.02))+(prep?.12:0)-(overdue(l)||l.credit&&l.credit.bad?.08:0)-(l.record>s.record0?.2:0);
 return U.clamp(p,.3,.97);
}
// Thay cách nộp hồ sơ: không còn quyết định ngay trong năm nộp.
var nop=base.def.opts.find(function(o){return o.k==='nop';});
if(nop){nop.run=function(l,r,log,d){
 if(st(l))return;
 H.cash(l,-fee(l),'Hồ sơ nhập quốc tịch');
 var wait=1+(l.record>0?1:0)+(overdue(l)||l.credit&&l.credit.bad?1:0)+(r()<.25?1:0);
 l.flags.nat880={code:d.code,name:d.name,renounce:!!d.renounce,need:d.need,yrs:d.yrs,filedAge:l.age,dueAge:l.age+wait,stage:'review',record0:l.record||0};
 log('Nộp hồ sơ nhập quốc tịch '+d.name+'. Hồ sơ được xếp hàng chờ xét, dự kiến '+wait+' năm; trong thời gian này cần giữ thường trú, không phát sinh tiền án và tránh nợ xấu.','neutral');
};}
var valid0=base.def.valid;base.def.valid=function(l,d){if(st(l))return false;return valid0?valid0.apply(this,arguments):true;};
var act=E.ACT.find(function(a){return a.id==='naturalize114';});
if(act){var avail=act.avail;act.avail=function(l){return st(l)?'Hồ sơ nhập quốc tịch đang chờ xét':avail.apply(this,arguments);};}
SC('nat880_interview',{
 title:function(l,d){return 'Phỏng vấn nhập quốc tịch '+d.name;},
 prep:function(l,r,a){var s=st(l)||{};return {code:s.code,name:s.name};},
 valid:function(l,d){var s=st(l);return !!s&&s.stage==='interview'&&where(l)===s.code&&!!d&&d.code===s.code;},
 text:function(l,d){var s=st(l);return 'Hồ sơ nhập quốc tịch '+d.name+' đã được xét tới vòng phỏng vấn và kiểm tra ngôn ngữ, hiểu biết xã hội. Bạn đã chờ '+(l.age-(s?s.filedAge:l.age))+' năm. Có thể tự đi thi, thuê luật sư và lớp ôn ('+H.money(l,lawyerFee(l))+') hoặc rút hồ sơ.';},
 opts:[
  {k:'prep',l:function(l){return 'Thuê luật sư, ôn thi · '+H.money(l,lawyerFee(l));},req:function(l){return l.money>=lawyerFee(l);},ai:{w:.9,smart:.8},run:function(l,r,log,d){finish(l,r,log,true);}},
  {k:'self',l:'Tự đi phỏng vấn và làm bài thi',ai:{w:1.2},run:function(l,r,log){finish(l,r,log,false);}},
  {k:'withdraw',l:'Rút hồ sơ, chưa muốn nhập quốc tịch lúc này',ai:{w:.2},run:function(l,r,log){void880(l,log,'bạn chủ động rút hồ sơ.');}}
 ]
});
function finish(l,r,log,prep){
 var s=st(l);if(!s||s.stage!=='interview')return;
 if(where(l)!==s.code){void880(l,log,'bạn không còn thường trú ở nước này.');return;}
 if(prep){if(l.money<lawyerFee(l))prep=false;else H.cash(l,-lawyerFee(l),'Luật sư và lớp ôn thi quốc tịch');}
 delete l.flags.nat880;
 if(r()<chance(l,Object.assign({},s),prep)){
  (l.flags.citizen=l.flags.citizen||[]).push(s.code);if(s.renounce)l.flags.renounced=l.country;
  log('Tuyên thệ nhập quốc tịch '+s.name+' sau '+s.yrs+' năm cư trú và '+(l.age-s.filedAge)+' năm chờ xét'+(s.renounce?', thôi quốc tịch gốc.':', vẫn giữ quốc tịch gốc.'),'big');
  H.fx(l,{hap:6});H.mem(l,'Ngày tuyên thệ nhập quốc tịch '+s.name+'.',5);
 }else{
  (l.flags.natAsk=l.flags.natAsk||{})[s.code]=l.age-2;
  log('Hồ sơ nhập quốc tịch '+s.name+' chưa đạt ở vòng phỏng vấn. Bạn có thể nộp lại sau một năm.','neutral');H.fx(l,{hap:-3});
 }
}
E.HOOKS.year.push(function(l,r,log,a){
 var s=st(l);if(!s||!l.alive)return;
 if(l.flags.homeVisit907)return; // đang về thăm quê: nơi cư trú tạm thời bị thay, chưa xét hủy hồ sơ
 if(l.jailUntil!=null&&l.age<l.jailUntil){void880(l,log,'bạn đang thụ án.');return;}
 if(where(l)!==s.code){void880(l,log,'bạn không còn thường trú ở '+s.name+'.');return;}
 if((l.record||0)>s.record0){void880(l,log,'hồ sơ phát sinh tiền án mới trong lúc chờ xét.');return;}
 if(s.stage==='review'&&l.age>=s.dueAge){s.stage='interview';l.pending.push(E.DEC.nat880_interview.make(l,r,{code:s.code}));log('Hồ sơ nhập quốc tịch '+s.name+' đã tới lượt xét. Bạn được mời phỏng vấn.','neutral');}
 else if(s.stage==='interview'&&l.age>s.dueAge+1){void880(l,log,'bạn không tới lịch phỏng vấn.');}
});
var profile=E.profile;E.profile=function(l){var p=profile.apply(this,arguments),s=st(l);if(s&&p&&p.jobInfo)p.jobInfo.push('Hồ sơ nhập quốc tịch '+s.name+': '+(s.stage==='review'?'chờ xét, dự kiến năm '+(l.birthYear+s.dueAge):'chờ phỏng vấn'));return p;};
E.NAT880={state:st,chance:chance,fee:fee,lawyerFee:lawyerFee,void:void880};
})(globalThis.G);
