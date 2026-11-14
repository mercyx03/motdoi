/* 9.0: trợ cấp thất nghiệp dựa trên đóng góp cho người thường trú ở Anh và Canada, mở rộng trợ cấp BHTN của life3 (trước đây chỉ Việt Nam).
   Người làm công đóng bảo hiểm (life3; Anh có National Insurance từ tax879) mà mất việc nay nhận trợ cấp theo đóng góp, thay vì bị trừ bảo hiểm mà không có quyền lợi.
   Căn cứ: gov.uk "public funds" (quyền lợi dựa trên National Insurance không phải quỹ công; người có NRPF vẫn xin được nếu đã đóng đủ) và canada.ca EI regular benefits (đã làm việc có đóng bảo hiểm, thất nghiệp ít nhất 7 ngày liên tục trong 52 tuần, đủ giờ theo tỷ lệ thất nghiệp vùng, sẵn sàng đi làm).
   Mức tiền và thời hạn là tham số trò chơi (50% lương đã đóng bảo hiểm, 3–12 tháng theo số năm đóng), chưa đối chiếu mức chính thức; chưa mô phỏng số giờ theo vùng. Chỉ từ năm 2026 và chỉ người thường trú đã đóng bảo hiểm; nước khác và bản lưu cũ không đổi. */
(function(G){'use strict';var E=G.E,H=E.H;if(!E.careerYear||!E.insured)return;
var RULES={
 GB:{name:'Jobseeker\'s Allowance kiểu mới (dựa trên đóng National Insurance)',source:'https://www.gov.uk/government/publications/public-funds--2/public-funds'},
 CA:{name:'Bảo hiểm việc làm EI (regular benefits)',source:'https://www.canada.ca/en/services/benefits/ei/ei-regular-benefit/eligibility.html'}
};
var FROM=2026,SHARE=.5;
function code(l){return H.resCode(l);}
function year(l){return l.birthYear+l.age;}
function state(l){return l.flags.welfare890||(l.flags.welfare890={history:[]});}
function eligible(l,hadJob,contribYrs,last){
 var R=RULES[code(l)];
 if(!R||year(l)<FROM||!hadJob||l.job||l.retired||!l.alive)return null;
 if(!l.abroad||!l.abroad.perm)if(code(l)!==l.country)return null;
 if(!(contribYrs>=1)||last==null||l.age-last>1)return null;
 return R;
}
function settle(l,hadJob,si,log){
 if(!si)return 0;
 var R=eligible(l,hadJob,si.yrs,l.si&&l.si.last!=null?l.si.last:si.last);
 if(!R)return 0;
 var s=state(l);if(s.at===l.age)return 0;
 var months=Math.min(12,Math.max(3,si.yrs)),perM=((l.si&&l.si.m)||si.m||0)*SHARE,ben=perM*months;
 if(!(ben>0)||!isFinite(ben))return 0;
 s.at=l.age;H.cash(l,ben,'Trợ cấp thất nghiệp: '+R.name);
 s.history.push({age:l.age,year:year(l),cc:code(l),months:months,perMonth:perM,total:ben});s.history=s.history.slice(-20);
 log('Mất việc sau khi đã đóng bảo hiểm: nhận '+R.name+' khoảng '+H.money(l,perM)+'/tháng trong '+months+' tháng (mức tham số trò chơi, dựa trên đóng góp chứ không dựa trên quỹ công).','neutral');
 return ben;
}
var career=E.careerYear;
E.careerYear=function(l,r,log){
 var hadJob=!!l.job&&!!E.insured(l),si=l.si?{yrs:l.si.yrs,last:l.si.last,m:l.si.m}:null,out=career.apply(this,arguments);
 settle(l,hadJob,si,log);
 return out;
};
var convert=E.abroadConvert;E.abroadConvert=function(l,f){var out=convert.apply(this,arguments),s=l.flags.welfare890;if(s)s.history.forEach(function(h){h.perMonth*=f;h.total*=f;});return out;};
E.WELFARE890={settle:settle,RULES:RULES,eligible:eligible,state:state,SHARE:SHARE,FROM:FROM};
})(globalThis.G);
