/* Trainee contract lifecycle on the existing agency and idol identities. */
(function(G){
  'use strict';
  var E=G.E,X=E.UPDATE110,L=E.LIFE138,I=E.IDOL155;
  function agency(l){return L.state(l).agency;}
  function active(a){return a&&['trainee','junior155','paused162'].includes(a.status);}
  function state(l){var s=L.state(l);return s.contract162||(s.contract162={history:[]});}
  function record(l,action){var a=agency(l),s=state(l);s.history.push({age:l.age,company:a&&a.name,action:action,years:a&&a.years||0});}
  function ensure(l){var a=agency(l);if(!active(a)||a.code!=='KR')return a;if(a.contractUntil162==null)a.contractUntil162=Math.max(l.age+1,(a.started==null?l.age:a.started)+5,l.age<18?19:0);return a;}
  function leave(l,reason){var a=agency(l);if(!active(a))return false;record(l,reason||'chủ động kết thúc');a.status='left';a.leftAt162=l.age;var s=l.flags.idol155;if(s&&!s.group)s.stage='left';return true;}
  function guardian(l){return l.age>=18||!!(l.fam&&(l.fam.mAlive||l.fam.fAlive&&!l.fam.noDad));}
  function why(l){var w=X.reason(l,13),a=agency(l);return w!==true?w:a&&a.code!=='KR'?'Mục này dành cho hợp đồng K-pop; dùng Audition cho các quốc gia khác':true;}
  function year(l,r,log){
    if(!l.alive)return;var a=ensure(l);if(!active(a)||a.code!=='KR'||a.contractAt162===l.age)return;a.contractAt162=l.age;
    if(l.age>=a.contractUntil162){leave(l,'hết hạn hợp đồng');log('Hợp đồng đào tạo tại '+a.name+' hết hạn. Kỹ năng và lịch sử được giữ; bạn có thể audition lại.','neutral');return;}
    if(a.status==='paused162')return;
    if(l.st.hea<25||l.age<18&&!guardian(l)){a.resumeStatus162=a.status;a.status='paused162';record(l,'tạm nghỉ vì sức khỏe hoặc cần người giám hộ');log('Tạm dừng thực tập để thu xếp sức khỏe và người giám hộ.','neutral');return;}
    if((a.years||0)>=2&&I.potential(l)<25&&r()<.15){leave(l,'không đạt đánh giá sau hai năm');log(a.name+' kết thúc chương trình sau đánh giá kỹ năng. Bạn vẫn giữ hồ sơ và có thể luyện tập rồi audition lại.','neutral');return;}
    if(I.potential(l)>=45&&r()<.12&&state(l).approachedAt!==l.age){var s=state(l);s.approachedAt=l.age;s.approach={name:a.name==='Starlight Music (hư cấu)'?'Blue Moon Ent. (hư cấu)':'Starlight Music (hư cấu)',until:l.age+1};log('Một công ty khác muốn trao đổi chuyển chương trình. Xem mục hợp đồng thực tập sinh để quyết định.','neutral');}
  }
  X.menu('traineeContract162','Hợp đồng và chuyển công ty thực tập sinh',why,function(l){var a=ensure(l);return (a?a.name+' · '+({trainee:'thực tập toàn thời gian',junior155:'đào tạo bán thời gian',paused162:'tạm nghỉ',left:'đã kết thúc',offer:'đề nghị đào tạo',debut:'đã debut'}[a.status]||a.status)+' · hợp đồng đến tuổi '+(a.contractUntil162||'chưa xác định'):'Chưa có hợp đồng thực tập sinh.')+'\nTạm nghỉ không gia hạn tự động. Chuyển công ty cần hai bên đồng ý; người chưa thành niên phải có người giám hộ và tiếp tục việc học trong nước.\n'+state(l).history.map(function(h){return h.age+' tuổi · '+h.company+': '+h.action;}).join('\n');},function(l){var a=ensure(l),s=state(l),out=[];
    if(active(a)){
      out.push({k:'leave',l:'Kết thúc hợp đồng, giữ hồ sơ và kỹ năng',run:function(l,r,log){if(leave(l))log('Đã kết thúc hợp đồng thực tập sinh.','neutral');}});
      if(a.status!=='paused162')out.push({k:'pause',l:'Tạm nghỉ vì học tập hoặc sức khỏe',run:function(l,r,log){a.resumeStatus162=a.status;a.status='paused162';record(l,'xin tạm nghỉ');log('Tạm nghỉ đào tạo; không phát sinh đào tạo và kỹ năng trong thời gian nghỉ.','neutral');}});
      else out.push({k:'resume',l:'Xin tiếp tục chương trình',why:l.st.hea<45?'Cần phục hồi sức khỏe từ 45/100':!guardian(l)?'Cần người giám hộ':l.age<18&&!l.school?'Cần thu xếp việc học phổ thông':true,run:function(l,r,log){a.status=a.resumeStatus162||'junior155';if(l.age>=18&&a.status==='junior155'){a.status='offer';a.docs=true;var idol=l.flags.idol155;if(idol)idol.stage='trainee';}record(l,'tiếp tục sau tạm nghỉ');log('Đã tiếp tục chương trình; nếu chuyển sang toàn thời gian cần hoàn tất hồ sơ di chuyển.','neutral');}});
      out.push({k:'renew',l:'Đề nghị gia hạn thêm 2 năm',why:a.contractUntil162-l.age>1?'Chỉ gia hạn trong năm cuối':a.renewAt162===l.age?'Đã đề nghị năm nay':!guardian(l)?'Cần người giám hộ':true,run:function(l,r,log){a.renewAt162=l.age;if(r()<Math.min(.9,.25+I.potential(l)/150)){a.contractUntil162+=2;record(l,'gia hạn hai năm');log('Công ty đồng ý gia hạn thêm hai năm.','good');}else{record(l,'đề nghị gia hạn chưa được chấp nhận');log('Công ty chưa đồng ý gia hạn; hợp đồng hiện tại giữ nguyên.','neutral');}}});
      out.push({k:'transfer',l:'Xin chuyển sang '+(s.approach&&s.approach.until>=l.age?s.approach.name:a.name==='Starlight Music (hư cấu)'?'Blue Moon Ent. (hư cấu)':'Starlight Music (hư cấu)'),why:s.transferAt===l.age?'Đã đề nghị năm nay':!guardian(l)?'Cần người giám hộ':l.age<18&&!l.school?'Cần thu xếp việc học phổ thông':true,run:function(l,r,log){s.transferAt=l.age;var target=s.approach&&s.approach.until>=l.age?s.approach.name:a.name==='Starlight Music (hư cấu)'?'Blue Moon Ent. (hư cấu)':'Starlight Music (hư cấu)';if(r()>=Math.min(.85,.25+I.potential(l)/180)){record(l,'chưa được chấp thuận chuyển công ty');log('Hai công ty chưa thống nhất; hợp đồng hiện tại tiếp tục.','neutral');return;}record(l,'chuyển sang '+target);a.name=target;a.contractUntil162=l.age+3;var idol=l.flags.idol155;if(idol&&idol.company)idol.company.name=target;delete s.approach;log('Đã thỏa thuận chuyển công ty. Giữ số năm đào tạo, kỹ năng và những người đã quen; nơi cư trú không đổi.','good');}});
    }else if(l.age<18){out.push({k:'retry',l:'Nộp audition lại với người giám hộ',why:!guardian(l)?'Cần người giám hộ':!l.school?'Cần tiếp tục học phổ thông':s.retryAt===l.age?'Đã nộp năm nay':a&&a.status==='debut'?'Đã debut':true,run:function(l,r){s.retryAt=l.age;X.next(l,'scout155',r);}});}else out.push({k:'audition',l:'Audition, hồ sơ đi đào tạo hoặc trở về nơi cư trú cũ',run:function(l,r){X.next(l,'audition139',r);}});
    if(active(a)&&l.age>=18&&L.state(l).entertainmentHome)out.push({k:'home',l:'Xem phương án trở về nơi cư trú trước đào tạo',run:function(l,r){X.next(l,'audition139',r);}});return out;
  },13,'Sự nghiệp giải trí');
  E.HOOKS.year.unshift(year);
  E.CONTRACT162={ensure:ensure,leave:leave,year:year,record:record};
})(globalThis.G);
