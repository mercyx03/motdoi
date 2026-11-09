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
  function england(l){return country(l)==='GB';}
  function state(l){return l.flags.study829||(l.flags.study829={});}
  function degree(l){return ['uni','abroad','post','phd'].includes(l.school);}
  function eligible(l){return l.alive && !(l.jailUntil>l.age);}
  function stage(l){var y=l.age-4;
    var ks=y<=2?1:y<=6?2:y<=9?3:y<=11?4:5;
    return 'Year '+y+' · Key Stage '+ks+' · '+(ks<=2?'Tiếng Anh, Toán, Khoa học, nghệ thuật, máy tính, thiết kế, địa lý, lịch sử, âm nhạc và thể chất.'+(ks===2?' Thêm ngoại ngữ.':''):ks===3?'Khoa học, nhân văn, công nghệ, ngoại ngữ và giáo dục công dân.':ks===4?'GCSE: tiếng Anh, toán, khoa học kép hoặc riêng Lý–Hóa–Sinh và môn tự chọn.':'Sixth Form: A-Level hoặc IB.');
  }
  E.england829=england;
  var SIXTH_OPTS829=[
    ['science','A-Level: Hóa, Sinh, Toán — hướng y sinh','science','alevel',null,'med'],
    ['human','A-Level: Văn học Anh, Lịch sử, Chính trị — hướng luật','human','alevel',null,'law'],
    ['ib','IB Diploma: sáu nhóm môn và phần cốt lõi (TOK, EE 4.000 từ, CAS)','ib','ib',null,null],
    ['voc','Học nghề và thực hành tại cơ sở đào tạo (Further Education / BTEC)','voc','voc',null,null],
    ['al_med','[Nhóm 1 · Ưu tiên tuyệt đối A-Level] Y khoa, Nha khoa & Thú y (Hóa + Sinh + Toán/Lý đạt A/A*)','science','alevel','alevel_mandatory','med'],
    ['al_eng','[Nhóm 1 · Ưu tiên tuyệt đối A-Level] Kỹ thuật chuyên sâu Imperial/Cambridge (Toán + Further Maths + Lý)','science','alevel','alevel_mandatory','eng'],
    ['al_it','[Nhóm 1 · Ưu tiên tuyệt đối A-Level] Khoa học Máy tính (Toán + Further Maths + Khoa học Máy tính)','science','alevel','alevel_mandatory','it'],
    ['ib_law','[Nhóm 2 · Chuộng IB Diploma] Ngành Luật LLB (6 nhóm môn + Tiểu luận EE 4.000 từ & Lý thuyết nhận thức TOK)','ib','ib','ib_preferred','law'],
    ['ib_ppe','[Nhóm 2 · Chuộng IB Diploma] Chính trị, Triết học & Kinh tế PPE — Oxford/LSE (Toán + Xã hội + TOK & EE)','ib','ib','ib_preferred','ppe'],
    ['ib_ir','[Nhóm 2 · Chuộng IB Diploma] Quan hệ Quốc tế & Phát triển (Ngoại ngữ + Lịch sử/Địa lý toàn cầu + TOK & EE)','ib','ib','ib_preferred','ir'],
    ['ib_psy','[Nhóm 2 · Chuộng IB Diploma] Tâm lý học (Toán + Sinh học + Nhân văn/Tâm lý học)','ib','ib','ib_preferred','psy'],
    ['bal_biz_alevel','[Nhóm 3 · Cân bằng — A-Level] Kinh tế, Tài chính & Kinh doanh (Toán + Kinh tế + Kế toán/Kinh doanh)','science','alevel','balanced','biz'],
    ['bal_biz_ib','[Nhóm 3 · Cân bằng — IB Diploma] Kinh tế, Tài chính & Kinh doanh (Bắt buộc Toán cấp độ cao Maths HL + Kinh tế HL)','ib','ib','balanced','biz'],
    ['bal_arch_alevel','[Nhóm 3 · Cân bằng — A-Level] Kiến trúc & Thiết kế (Toán + Lý + Nghệ thuật, dành thời gian làm Portfolio)','science','alevel','balanced','art'],
    ['bal_arch_ib','[Nhóm 3 · Cân bằng — IB Diploma] Kiến trúc & Thiết kế (Visual Arts HL + Toán/Lý + CAS & EE 4.000 từ)','ib','ib','balanced','art']
  ];
  E.SC('sixth829',{valid:function(l){return eligible(l)&&england(l)&&l.age===16&&l.school==='lower';},title:'Kết quả GCSE và lựa chọn sau Year 11 (Sixth Form: A-Level / IB Diploma)',prep:function(l,r){return {grade:Math.max(1,Math.min(9,Math.round((l.st.kno||50)/15+r()*2)))};},text:function(l,d){return 'Đã hoàn thành kỳ thi GCSE cuối Year 11 tại Vương quốc Anh. Kết quả mô phỏng: '+d.grade+'/9. '+(state(l).subjects||'Các môn học của bạn')+'. Tiếp tục giáo dục hoặc đào tạo bậc Sixth Form (Year 12–13) đến 18 tuổi theo định hướng nhóm ngành đại học Anh.';},opts:SIXTH_OPTS829.map(function(option){return {k:option[0],l:option[1],run:function(l,r,log,d){var s=state(l);s.gcse=d.grade;s.sixth=option[1];s.track=option[2];if(option[4]){s.ukTrack850={mode:option[3],targetGroup:option[4],targetMajor:option[5],targetName:option[1],reqSubjects:option[1],furtherMaths:option[0]==='al_eng'||option[0]==='al_it',tokEeCompleted:option[3]==='ib',mathsHL:option[0]==='bal_biz_ib',portfolioReady:option[0]==='bal_arch_alevel'||option[0]==='bal_arch_ib'};}l.school=option[2]==='voc'?'voc':'upper';l.schoolEnd=18;log('Sau GCSE, bạn chọn '+option[1]+'.','good');}};})});
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
  uni.make=function(l,r){var d=make.apply(this,arguments);if(country(l)==='US'&&!l.abroad){
      d.opts.push({k:'private839',l:'Nộp hồ sơ đại học tư chọn lọc',h:'Học phí mô phỏng cao; trường xét hồ sơ học tập.'},{k:'community839',l:'Học cao đẳng cộng đồng hai năm',h:'Học phí thấp hơn, có thể đi làm hoặc học tiếp sau đó.'});
    }if(england(l)&&l.age>=18&&l.birthYear+l.age>=2015)d.opts.push({k:'degree829',l:'Ứng tuyển Degree Apprenticeship',h:'Học và làm hưởng lương trong 4 năm, doanh nghiệp tài trợ học phí.'});return d;};
  uni.apply=function(l,d,k,r,log){if(country(l)==='US'&&!l.abroad&&['private839','community839','uni_big','uni_local','voc'].includes(k)){
      var custom=k==='private839'||k==='community839';
      if(custom&&!d.opts.some(o=>o.k===k))return;
      if(k==='private839'&&(l.st.kno<65||r()>.2+l.st.kno/150)){log('Trường tư chưa nhận hồ sơ. Bạn vẫn có thể chọn trường công, cao đẳng hoặc đi làm.','neutral');l.pending.unshift(make(l,r));return;}
      state(l).institution=k==='private839'?'private':k==='community839'?'community':k==='voc'?'voc':'public';
      if(k==='community839'){l.school='voc';l.schoolEnd=l.age+2;log('Bạn bắt đầu chương trình cao đẳng cộng đồng hai năm.','good');return;}
      if(k==='private839'){l.pending.unshift(E.DEC.major.make(l,r));log('Được trường tư nhận, bạn chọn ngành học.','good');return;}
      return apply.apply(this,arguments);
    }
    if(k!=='degree829')return apply.apply(this,arguments);
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
  function educationBudget(l){
    var s=state(l),type=s.institution||(l.school==='voc'?'voc':'public');
    var tuition=l.base*({private:.95,public:.48,community:.22,voc:.15}[type]||.48);
    var living=l.base*(E.atFamilyHome121(l)?.07:.25);
    var scholarship=Math.min(1,Math.max(0,Math.floor((l.st.kno-55)/10)/4));
    var fee=tuition*(1-scholarship),total=fee+living;
    var income=(l.fam.fAlive&&!l.fam.noDad?l.fam.fInc||0:0)+(l.fam.mAlive&&!l.fam.noMom?l.fam.mInc||0:0);
    var spent=(l.yr?.familyExpenses||[]).reduce((sum,x)=>sum+x.amount,0);
    var share=Math.min(1,Math.max(0,Math.floor((income*1.2-spent)/total*4)/4));
    if(l.flags.eliteCut)share=0;var capacity=share;if(s.familyShare844!=null)share=Math.min(share,s.familyShare844);
    var support=share*total,personal=Math.min(Math.max(0,l.money),total-support);
    return {capacity,type,tuition,living,scholarship,share,support,personal,fee,gap:Math.max(0,total-support-personal)};
  }
  X.menu('studyPlan844','Bàn ngân sách học tập với gia đình',function(l){return eligible(l)&&usBudget(l)?true:'Cần đang học tại Hoa Kỳ trong mô phỏng';},function(l){var b=educationBudget(l);return 'Học bổng trừ học phí trước; cộng sinh hoạt rồi mới tính hỗ trợ, tiền riêng và phần vay. Khả năng gia đình tối đa khoảng '+Math.round(b.capacity*100)+'% số còn lại năm nay. Trưởng thành hoặc ra riêng không tự cắt hỗ trợ. Mức chọn là đề nghị, luôn bị giới hạn bởi ngân sách thực tế.';},function(l){return [0,.25,.5,.75,1].map(function(share){return{k:String(share),l:'Đề nghị gia đình hỗ trợ '+Math.round(share*100)+'% phần còn lại',why:state(l).budget839?.at===l.age?'Đã quyết toán năm nay':true,run:function(l,r,log){if(state(l).budget839?.at===l.age)return;state(l).familyShare844=share;log('Gia đình ghi nhận đề nghị '+Math.round(share*100)+'%. Khi thanh toán sẽ kiểm lại thu nhập và khoản đã chi; không vay thay cho phần đã đủ.','neutral');}};});},16,'Học tập');
  function budgetText(l){
    var b=educationBudget(l);return 'Học phí '+H.money(l,b.tuition)+' · học bổng '+Math.round(b.scholarship*100)+'% học phí · sinh hoạt '+H.money(l,b.living)+'. Gia đình có thể góp '+Math.round(b.share*100)+'% số còn lại. Tiền riêng '+H.money(l,b.personal)+', còn thiếu '+H.money(l,b.gap)+'. Lãi suất là tham số mô phỏng, cố định cho khoản vay đã ký.';
  }
  function usBudget(l){return country(l)==='US'&&!l.abroad&&(degree(l)||l.school==='voc');}
  function settle(l,a,log){
    var s=state(l);if(s.budget839?.at===l.age)return;
    var b=educationBudget(l);if(!a&&b.gap>.000001||a&&b.gap<=.000001)return;
    if(b.support){var paid=E.childExpense(l,b.support,'Hỗ trợ học tập và sinh hoạt',false,true);if(!paid.ok)return;}
    if(a){s.debts=s.debts||[];s.debts.push({name:a[0],bal:b.gap,rate:a[2],plan:a[1]});}
    // Tuition goes to the school. The living allowance stays available for ordinary expenses.
    H.cash(l,b.living-b.personal,'Học phí sau hỗ trợ và ngân sách sinh hoạt');
    s.budget839=Object.assign({at:l.age,loan:a?b.gap:0},b);
    log('Đã thanh toán học phí và dành '+H.money(l,b.living)+' cho sinh hoạt.'+(a?' Khoản vay chỉ bù phần thiếu '+H.money(l,b.gap)+'.':''),'good');
  }
  function aidOptions(l){var c=country(l),cit=E.isCitizenOf(l,c),resident=l.abroad?.perm && l.abroad.code===c;
    if(c==='VN')return [];
    if(c==='US')return (cit||resident?[['Federal Student Aid — vay liên bang','fixed',.045]]:[]).concat([['Khoản vay tư nhân','private',.075]]);
    if(c==='GB'&&!state(l).apprentice&&(cit||resident))return [['Tuition Fee Loan','income',0],['Maintenance Loan theo hoàn cảnh gia đình','income',0]];
    if(c==='AU'&&cit){var a=l.school==='voc'?[['VET Student Loans','income',0]]:[['HECS-HELP','income',0]];if(state(l).exchange?.at===l.age)a.push(['OS-HELP cho kỳ trao đổi','income',0]);if(l.fam.q<=2)a.push([l.age<25?'Youth Allowance':'Austudy','grant',0]);return a;}return [];
  }
  X.menu('aid829','Tài trợ và vay học tập',function(l){return eligible(l)&&(degree(l)||l.school==='voc')&&aidOptions(l).length?true:'Chưa đủ điều kiện trong mô phỏng';},function(l){if(usBudget(l))return budgetText(l);return 'Khoản vay phải hoàn trả. Trợ cấp sinh hoạt xét hoàn cảnh gia đình. Số tiền, lãi và ngưỡng thu nhập là tham số trong game.';},function(l){var s=state(l);
    if(usBudget(l)){
      var b=educationBudget(l),closed=s.budget839?.at===l.age;
      var rows=[{k:'familyPlan844',l:'Bàn lại phần hỗ trợ với gia đình',why:closed?'Đã quyết toán năm nay':true,run:(l,r)=>X.next(l,'studyPlan844',r)}].concat(aidOptions(l).map(a=>({k:a[0],l:a[0]+' · '+H.money(l,b.gap),why:closed?'Đã quyết toán năm nay':b.gap<=.000001?'Đã đủ ngân sách':true,run:(l,r,log)=>settle(l,a,log)})));
      rows.unshift({k:'self',l:'Dùng hỗ trợ và tiền riêng',why:closed?'Đã quyết toán năm nay':b.gap>.000001?'Chưa đủ ngân sách':true,run:(l,r,log)=>settle(l,null,log)});
      rows.push({k:'defer',l:'Tạm dừng học, giữ hồ sơ để chọn lại sau',why:closed?'Đã quyết toán năm nay':true,run:function(l,r,log){s.deferred={age:l.age,school:l.school};l.school=null;l.schoolEnd=null;l.cityStudent=null;l.flags.needJob=true;l.flags.uniNext=l.age+1;log('Bạn hoãn chương trình để thu xếp chi phí.','neutral');}});
      return rows;
    }
    return aidOptions(l).map(function(a){var amount=l.base*(a[0].startsWith('Maintenance')?(l.fam.q<=2?.38:.18):.3);return {k:a[0],l:a[0]+' · '+H.money(l,amount),why:s.funding?.[a[0]]===l.age?'Đã nhận năm nay':true,run:function(l,r,log){s.funding=s.funding||{};if(s.funding[a[0]]===l.age)return;s.funding[a[0]]=l.age;if(['Tuition Fee Loan','HECS-HELP','VET Student Loans'].includes(a[0])){s.feesPaid=(s.feesPaid||0)+amount;log('Khoản học phí được chuyển thẳng cho trường.','neutral');}else H.cash(l,amount,a[0]);if(a[1]!=='grant'){s.debts=s.debts||[];s.debts.push({name:a[0],bal:amount,rate:a[2],plan:a[1]});}log('Nhận '+H.money(l,amount)+' từ '+a[0]+'.','good');}};});},16,'Tài chính');
  E.HOOKS.year.push(function(l,r,log){if(!l.alive)return;
    var s=l.flags.study829;
    if(england(l)&&(!E.STUDY857||E.STUDY857.en(l))&&!(E.STUDY857&&E.STUDY857.active(l))&&l.age>=5&&l.age<=17&&l.school){log(stage(l),'neutral');if(l.age===10 && !state(l).sats){state(l).sats=l.st.kno>=60?'đạt chuẩn mô phỏng':'cần hỗ trợ thêm';log('Đánh giá SATs cuối Year 6: '+state(l).sats+'. Bạn tiếp tục lên Year 7.','neutral');}}
    if(!s||s.at===l.age)return;s.at=l.age;
    if(s.exchange && s.exchange.at<l.age && s.exchange.status==='đang trao đổi'){var x=s.exchange;finishExchange(l,s,x,log);}
    if(s.apprentice){if((l.school==='uni'||l.edu>=5&&l.age===s.apprentice.end-1)&&l.age<s.apprentice.end){H.cash(l,l.base*.65,'Lương học nghề bậc đại học');l.workYrs=(l.workYrs||0)+1;}else delete s.apprentice;}
    (s.debts||[]).forEach(function(d){if(d.bal<=0)return;d.bal*=1+d.rate;if(degree(l)||l.school==='voc')return;var income=l.income||0;if(d.plan==='fixed' && income<=0)return;var due=d.plan==='income'?Math.max(0,income-l.base)*.09:d.bal*.15;var pay=Math.min(d.bal,Math.max(0,l.money),due);if(pay){H.cash(l,-pay,'Trả '+d.name);d.bal-=pay;if(d.plan==='fixed' && ['cong_chuc','giao_vien'].includes(l.job?.id)){d.service=(d.service||0)+1;if(d.service>=10){d.bal=0;log('Hồ sơ phục vụ công đủ thời gian trong mô phỏng, phần dư khoản vay liên bang được miễn.','good');}}}});
  });
  E.finishStudyBudget839=function(l,log){
    if(!usBudget(l)||state(l).budget839?.at===l.age)return;
    if(educationBudget(l).gap<=.000001){settle(l,null,log);return;}
    if(state(l).unpaidAt===l.age)return;
    state(l).unpaidAt=l.age;if(l.schoolEnd!=null)l.schoolEnd++;
    log('Chưa đủ kinh phí và chưa chọn vay. Năm học được bảo lưu, thời điểm tốt nghiệp lùi một năm.','neutral');
  };
  var begin=E.beginYear;
  E.beginYear=function(l){
    begin.apply(this,arguments);
    if(l.alive&&usBudget(l)&&state(l).budget839?.at!==l.age&&state(l).budgetAsked!==l.age){
      state(l).budgetAsked=l.age;E.WORLD120.queue(l,'aid829',H.rf(l));
    }
    return l.pending;
  };
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
  E.studyRegion829=region;E.educationBudget844=educationBudget;
})(globalThis.G);
