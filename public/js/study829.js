/* Học đường England, trao đổi tín chỉ và tài trợ học tập. Các khoản tiền là tham số mô phỏng. */
(function(G){
  'use strict';
  var E=G.E,H=E.H,X=E.UPDATE110;
  function country(l){return H.resCode(l);}
  function region(l){var place=String(l.city||'')+' '+String(l.province||'');
    if(/Glasgow|Edinburgh|Aberdeen|Scotland/i.test(place))return 'Scotland';
    if(/Cardiff|Swansea|Wales/i.test(place))return 'Wales';
    if(/Belfast|Northern Ireland/i.test(place))return 'Northern Ireland';
    return 'England';
  }
  function england(l){return country(l)==='GB' && region(l)==='England' && l.birthYear+l.age>=1988;}
  function state(l){return l.flags.study829||(l.flags.study829={});}
  function degree(l){return ['uni','abroad','post','phd'].includes(l.school);}
  function eligible(l){return l.alive && !(l.jailUntil>l.age);}
  function stage(l){var y=l.age-4;
    var ks=y<=2?1:y<=6?2:y<=9?3:y<=11?4:5;
    return 'Year '+y+' · Key Stage '+ks+' · '+(ks<=2?'Tiếng Anh, Toán, Khoa học, nghệ thuật, máy tính, thiết kế, địa lý, lịch sử, âm nhạc và thể chất.'+(ks===2?' Thêm ngoại ngữ.':''):ks===3?'Khoa học, nhân văn, công nghệ, ngoại ngữ và giáo dục công dân.':ks===4?'GCSE: tiếng Anh, toán, khoa học kép hoặc riêng Lý–Hóa–Sinh và môn tự chọn.':'Sixth Form: A-Level hoặc IB.')+(y>=2?' Theo tuổi, tương ứng khoảng lớp '+(y-1)+' ở Việt Nam.':'');
  }
  E.england829=england;
  E.SC('sixth829',{valid:function(l){return eligible(l)&&england(l)&&l.age===16&&l.school==='lower';},title:'Kết quả GCSE và lựa chọn sau Year 11',prep:function(l,r){return {grade:Math.max(1,Math.min(9,Math.round((l.st.kno||50)/15+r()*2)))};},text:function(l,d){return 'Đã hoàn thành GCSE. Kết quả mô phỏng: '+d.grade+'/9. '+(state(l).subjects||'Các môn học của bạn')+'. Tiếp tục giáo dục hoặc đào tạo đến 18 tuổi. Chọn lộ trình hai năm.';},opts:[
    ['science','A-Level: Hóa, Sinh, Toán — hướng y sinh'],['human','A-Level: Văn học Anh, Lịch sử, Chính trị — hướng luật'],['ib','IB Diploma: sáu nhóm môn và phần cốt lõi'],['voc','Học nghề và thực hành tại cơ sở đào tạo']
  ].map(function(option){return {k:option[0],l:option[1],run:function(l,r,log,d){state(l).gcse=d.grade;state(l).sixth=option[1];state(l).track=option[0];l.school=option[0]==='voc'?'voc':'upper';l.schoolEnd=18;log('Sau GCSE, bạn chọn '+option[1]+'.','good');}};})});
  X.menu('schoolEngland829','Hồ sơ học tập England',function(l){return eligible(l)&&england(l)&&l.age>=5&&l.age<18&&l.school?true:'Dành cho học sinh tại England';},function(l){return stage(l)+' '+(state(l).subjects||'')+' '+(state(l).sixth||'');},function(l){
    if(l.age>=16 && ['science','human'].includes(state(l).track) && !state(l).fourth)return ['Vật lý','Tâm lý học','Kinh tế','Ngoại ngữ'].map(function(subject){return {k:subject,l:'Học môn A-Level thứ tư: '+subject,run:function(l,r,log){state(l).fourth=subject;state(l).sixth+=' và '+subject;log('Đăng ký môn thứ tư: '+subject+'.','good');}};});
    if(l.age<14||l.age>=16)return [];
    var record=state(l),chosen=record.electives||[];if(chosen.length>=4)return [];
    var individual=['Lịch sử','Địa lý','Tôn giáo học','Kịch','Âm nhạc','Hội họa','Nhiếp ảnh','Kinh doanh','Kinh tế','Khoa học máy tính','Truyền thông','Tiếng Pháp','Tiếng Đức','Tiếng Tây Ban Nha'].filter(x=>!chosen.includes(x)).map(function(subject){return {k:subject,l:'Thêm môn GCSE: '+subject,run:function(l,r,log){record.electives=chosen.concat(subject);record.subjects=record.electives.join(', ');log('Môn tự chọn GCSE: '+record.subjects+'.','neutral');X.next(l,'schoolEngland829',r);}};});
    if(chosen.length)return individual;
    return individual.concat(['Lịch sử, Địa lý, tiếng Pháp','Kịch, Âm nhạc, Nhiếp ảnh','Kinh doanh, Kinh tế, Khoa học máy tính'].map(function(subjects){return {k:subjects,l:'Chọn '+subjects,run:function(l,r,log){state(l).electives=subjects.split(', ');state(l).subjects=subjects;log('Hồ sơ GCSE ghi nhận '+subjects+'.','good');}};}));
  },5,'Học tập');
  E.HOOKS.gradUpper.push(function(l,r,log){var s=l.flags.study829;if(!england(l)||!s?.track||s.final)return;
    var points=Math.round(Math.max(8,Math.min(30,(s.gcse||5)+l.st.kno/5+r()*4)));
    s.final=points;l.examScore=points;log(s.track==='ib'?'Kết quả IB mô phỏng: '+Math.round(points*1.5)+'/45. Điểm quy đổi xét tuyển '+points+'/30.':'Thi cuối Sixth Form: điểm xét tuyển mô phỏng '+points+'/30.','neutral');
  });
  var uni=E.DEC.uni,make=uni.make,apply=uni.apply;
  uni.make=function(l,r){var d=make.apply(this,arguments);if(england(l)&&l.age>=18&&l.birthYear+l.age>=2015)d.opts.push({k:'degree829',l:'Ứng tuyển Degree Apprenticeship',h:'Học và làm hưởng lương trong 4 năm, doanh nghiệp tài trợ học phí.'});return d;};
  uni.apply=function(l,d,k,r,log){if(k!=='degree829')return apply.apply(this,arguments);
    if(!england(l)||l.age<18)return;
    if(r()>0.35+(l.st.kno||0)/200){log('Doanh nghiệp chưa nhận hồ sơ. Bạn có thể chọn hướng học khác.','neutral');var next=make(l,r);l.pending.unshift(next);return;}
    l.school='uni';l.major='it';l.schoolEnd=l.age+4;state(l).apprentice={end:l.schoolEnd};log('Trúng tuyển học nghề bậc đại học. Bạn làm việc có lương và dành thời gian mỗi tuần học tại trường.','good');
  };
  function finishExchange(l,s,x,log){if(x.status!=='đang trao đổi')return;x.status=degree(l)||l.edu>=5?'đã công nhận tín chỉ':'bảo lưu kết quả';s.transcript=s.transcript||[];s.transcript.push(Object.assign({},x));H.fx(l,{kno:2,soc:x.home==='Gia đình bản xứ'?3:1});H.mem(l,'Kỳ trao đổi tại '+x.to+' trong '+x.term+'; '+x.home+'.',3);log('Kết thúc trao đổi: '+x.status+' ('+x.credit+' tín chỉ mô phỏng).','good');}
  function menuReason(l){return eligible(l)&&degree(l)?true:'Cần đang theo học đại học hoặc sau đại học';}
  X.menu('exchange829','Trao đổi sinh viên quốc tế',menuReason,function(l){var x=state(l).exchange;return x?'Đợt trao đổi '+x.to+' · '+x.term+' · '+x.home+' · '+x.status:'Chọn trường đối tác, thời lượng và chỗ ở. Trường gốc giữ hồ sơ và xét công nhận tín chỉ sau chuyến đi.';},function(l,arg){
    var s=state(l);if(s.exchange?.status==='đang trao đổi'){
      var trip=s.exchange,rows=[];
      if(!trip.activity)rows.push({k:'meet',l:trip.home==='Gia đình bản xứ'?'Cùng gia đình bản xứ chuẩn bị bữa tối':'Tham gia nhóm sinh viên ở ký túc xá',run:function(l,r,log){trip.activity=true;H.fx(l,{soc:2});log('Bạn làm quen với nếp sống tại '+G.W.BY[trip.to].name+'.','good');}});
      if(trip.term!=='1 năm')rows.push({k:'return',l:'Kết thúc chương trình và nộp bảng điểm cho trường gốc',run:function(l,r,log){finishExchange(l,s,trip,log);}});return rows;
    }
    if(s.exchange?.at===l.age)return [];
    if(!arg.to){
      var preferred=['GB','US','AU','VN','JP','FR'], countries=preferred.concat(Object.keys(G.W.BY).filter(c=>!preferred.includes(c)).sort()).filter(c=>c!==country(l));
      var offset=Number(arg.offset)||0;
      var destinations=countries.slice(offset,offset+20).map(c=>({k:c,l:'Trường đối tác tại '+G.W.BY[c].name,run:(l,r)=>X.next(l,'exchange829',r,{to:c})}));
      if(offset+20<countries.length)destinations.push({k:'more',l:'Xem các điểm đến tiếp theo',run:(l,r)=>X.next(l,'exchange829',r,{offset:offset+20})});
      if(offset>0)destinations.push({k:'back',l:'Trang điểm đến trước',run:(l,r)=>X.next(l,'exchange829',r,{offset:offset-20})});
      return destinations;
    }
    if(!arg.term)return ['1 tuần','1 học kỳ','1 năm'].map((t,i)=>({k:String(i),l:t,run:(l,r)=>X.next(l,'exchange829',r,{to:arg.to,term:t,index:i})}));
    return ['Gia đình bản xứ','Ký túc xá'].map(function(home,i){var ratio=(G.W.BY[arg.to].gdp||1)/(G.W.BY[country(l)]?.gdp||1);var fee=l.base*[.025,.16,.3][arg.index]*(1+i*.15)*Math.min(2,Math.max(.5,Math.sqrt(ratio)));
      return {k:String(i),l:home+' · '+H.money(l,fee),why:l.money>=fee?true:'Chưa đủ ngân sách',run:function(l,r,log){if(l.money<fee||s.exchange?.at===l.age)return;H.cash(l,-fee,'Chi phí trao đổi sinh viên');s.exchange={at:l.age,to:arg.to,term:arg.term,home:home,status:'đang trao đổi',credit:[1,15,30][arg.index]};log('Bạn tham gia trao đổi tại '+arg.to+', ở '+home.toLowerCase()+'.','good');}};});
  },16,'Học tập');
  function aidOptions(l){var c=country(l),cit=E.isCitizenOf(l,c),resident=l.abroad?.perm && l.abroad.code===c;
    if(c==='VN')return [];
    if(c==='US')return (cit||resident?[['Federal Student Aid — vay liên bang','fixed',.045]]:[]).concat([['Khoản vay tư nhân','private',.075]]);
    if(c==='GB'&&!state(l).apprentice&&region(l)==='England'&&(cit||resident))return [['Tuition Fee Loan','income',0],['Maintenance Loan theo hoàn cảnh gia đình','income',0]];
    if(c==='AU'&&cit){var a=l.school==='voc'?[['VET Student Loans','income',0]]:[['HECS-HELP','income',0]];if(state(l).exchange?.at===l.age)a.push(['OS-HELP cho kỳ trao đổi','income',0]);if(l.fam.q<=2)a.push([l.age<25?'Youth Allowance':'Austudy','grant',0]);return a;}return [];
  }
  X.menu('aid829','Tài trợ và vay học tập',function(l){return eligible(l)&&(degree(l)||l.school==='voc')&&aidOptions(l).length?true:'Chưa đủ điều kiện trong mô phỏng';},function(l){return 'Khoản vay phải hoàn trả. Trợ cấp sinh hoạt xét hoàn cảnh gia đình. Số tiền, lãi và ngưỡng thu nhập là tham số trong game.';},function(l){var s=state(l);return aidOptions(l).map(function(a){var amount=l.base*(a[0].startsWith('Maintenance')?(l.fam.q<=2?.38:.18):.3);return {k:a[0],l:a[0]+' · '+H.money(l,amount),why:s.funding?.[a[0]]===l.age?'Đã nhận năm nay':true,run:function(l,r,log){s.funding=s.funding||{};if(s.funding[a[0]]===l.age)return;s.funding[a[0]]=l.age;if(['Tuition Fee Loan','HECS-HELP','VET Student Loans'].includes(a[0])){s.feesPaid=(s.feesPaid||0)+amount;log('Khoản học phí được chuyển thẳng cho trường.','neutral');}else H.cash(l,amount,a[0]);if(a[1]!=='grant'){s.debts=s.debts||[];s.debts.push({name:a[0],bal:amount,rate:a[2],plan:a[1]});}log('Nhận '+H.money(l,amount)+' từ '+a[0]+'.','good');}};});},16,'Tài chính');
  E.HOOKS.year.push(function(l,r,log){if(!l.alive)return;var s=l.flags.study829;
    if(england(l)&&l.age>=5&&l.age<=17&&l.school){log(stage(l),'neutral');if(l.age===10 && !state(l).sats){state(l).sats=l.st.kno>=60?'đạt chuẩn mô phỏng':'cần hỗ trợ thêm';log('Đánh giá SATs cuối Year 6: '+state(l).sats+'. Bạn tiếp tục lên Year 7.','neutral');}}
    if(!s||s.at===l.age)return;s.at=l.age;
    if(s.exchange && s.exchange.at<l.age && s.exchange.status==='đang trao đổi'){var x=s.exchange;finishExchange(l,s,x,log);}
    if(s.apprentice){if((l.school==='uni'||l.edu>=5&&l.age===s.apprentice.end-1)&&l.age<s.apprentice.end){H.cash(l,l.base*.65,'Lương học nghề bậc đại học');l.workYrs=(l.workYrs||0)+1;}else delete s.apprentice;}
    (s.debts||[]).forEach(function(d){if(d.bal<=0)return;d.bal*=1+d.rate;if(degree(l)||l.school==='voc')return;var income=l.income||0;if(d.plan==='fixed' && income<=0)return;var due=d.plan==='income'?Math.max(0,income-l.base)*.09:d.bal*.15;var pay=Math.min(d.bal,Math.max(0,l.money),due);if(pay){H.cash(l,-pay,'Trả '+d.name);d.bal-=pay;if(d.plan==='fixed' && ['cong_chuc','giao_vien'].includes(l.job?.id)){d.service=(d.service||0)+1;if(d.service>=10){d.bal=0;log('Hồ sơ phục vụ công đủ thời gian trong mô phỏng, phần dư khoản vay liên bang được miễn.','good');}}}});
  });
  var profile=E.profile;
  E.profile=function(l){var p=profile.apply(this,arguments),s=l.flags.study829;if(!s)return p;
    if(p.assets)(s.debts||[]).filter(d=>d.bal>0).forEach(d=>p.assets.push([d.name,-d.bal]));
    return p;
  };
  var net=E.netWorth;E.netWorth=function(l){return net.apply(this,arguments)-(l.flags.study829?.debts||[]).reduce((n,d)=>n+d.bal,0);};
  var convert=E.abroadConvert;E.abroadConvert=function(l,f){var result=convert.apply(this,arguments);(l.flags.study829?.debts||[]).forEach(d=>d.bal*=f);return result;};
  var majorApply=E.DEC.major.apply;
  E.DEC.major.apply=function(l,d,k,r,log){majorApply.apply(this,arguments);if(l.school!=='uni'||country(l)!=='GB')return;
    var ss=state(l);if(l.major!=='med')l.schoolEnd=l.age+(region(l)==='Scotland'?4:3);
    if((ss.track==='science'&&['it','med'].includes(l.major))||(ss.track==='human'&&l.major==='law')){H.fx(l,{kno:2});log('Các môn Sixth Form đã chọn giúp bạn bắt nhịp với ngành học.','good');}
  };
  if(E.DEC.phd){var phdApply=E.DEC.phd.apply;E.DEC.phd.apply=function(l,d,k,r,log){phdApply.apply(this,arguments);if(k==='yes'&&country(l)==='GB'&&l.school==='phd'&&!l.flags.pg106)l.schoolEnd=l.age+3+Math.floor(r()*3);};}
  E.studyRegion829=region;
})(globalThis.G);
