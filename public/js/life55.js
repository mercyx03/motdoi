/* v4.6.1 — hồ sơ đúng tuổi, điều kiện hẹn hò và tình huống theo nghề. */
(function(G){
  'use strict';
  var E=G.E,H=E.H,U=G.U;
  function free(l){return l.alive&&!(l.jailUntil!=null&&l.age<l.jailUntil)&&!(l.flags.military&&l.age<l.flags.military)&&!(l.abroad&&l.abroad.trapped);}
  function normalize(l,p,r){
    if(!p)return;
    var c=p.jobId&&E.CAR[p.jobId];
    if(!c&&p.job)c=Object.keys(E.CAR).map(function(id){return E.CAR[id];}).filter(function(j){return j.t.indexOf(p.job)>=0;})[0];
    if(p.age<18){p.job=p.age<15?'học sinh THCS':'học sinh THPT';p.jobId=null;p.inc=0;}
    else if(/^học sinh/.test(p.job||'')||(p.job==='sinh viên'&&p.age>=22)||(c&&((c.minAge||0)>p.age||(c.cat==='med'&&p.age<24)||((c.edu||0)>=5&&p.age<22))))H.partnerJob(l,p,r);
  }
  E.normalizePartnerAge=normalize;
  var love=E.DEC.love,mk=love.make,ap=love.apply;
  love.make=function(l,r,arg){var d=mk.call(this,l,r,arg),p=d.data.p,old=p.job;normalize(l,p,r);if(old!==p.job){var phrase=old==='sinh viên'?'đang là sinh viên':old==='đã nghỉ hưu'?'đã nghỉ hưu':'đang làm '+old;d.text=d.text.replace(phrase,/^học sinh/.test(p.job)?'đang là '+p.job:p.job==='sinh viên'?'đang là sinh viên':'đang làm '+p.job);}return d;};
  love.apply=function(l,d,k,r,log){normalize(l,d.data.p,r);return ap.call(this,l,d,k,r,log);};
  function repairLove(l,d,r){if(!d||!d.data||!d.data.p)return;var p=d.data.p,old=p.job;normalize(l,p,r);if(old!==p.job&&typeof d.text==='string'){var phrase=old==='sinh viên'?'đang là sinh viên':old==='đã nghỉ hưu'?'đã nghỉ hưu':'đang làm '+old;d.text=d.text.replace(phrase,/^học sinh/.test(p.job)?'đang là '+p.job:p.job==='sinh viên'?'đang là sinh viên':'đang làm '+p.job);}}
  var migration=E.migrateExt;
  E.migrateExt=function(l){if(migration)migration(l);var r=function(){return U.rand(l);};normalize(l,l.partner,r);(l.pending||[]).forEach(function(d){if(d.id==='love')repairLove(l,d,r);});};
  E.HOOKS.year.push(function(l,r){normalize(l,l.partner,r);});
  E.SC('tc_dieu_kien',{title:'Chu cấp và chương trình hẹn hò',text:function(l){return 'Quan hệ chu cấp: từ 18 tuổi, bạn có thể ngẫu nhiên nhận lời đề nghị của người lớn tuổi, có thu nhập cao. Chỉ sau khi bạn đồng ý và quan hệ còn tiếp tục, mục “Quan hệ chu cấp / đặt lại ranh giới” mới mở. Bạn được thương lượng hoặc chấm dứt, không bắt buộc nhận lời.\n\nNgười ấy là ai: vào Tình cảm → Đăng ký show hẹn hò trên truyền hình → Người ấy là ai. Điều kiện trong game: 20–42 tuổi, độc thân, sinh sống tại Việt Nam, không bị giam hay đang nghĩa vụ; hồ sơ có học vấn cao, độ nổi tiếng hoặc khả năng giao tiếp phù hợp. Một lần đăng ký mỗi năm. Đăng ký không bảo đảm được ghép đôi. Định dạng hiện tại dành cho hẹn hò nam–nữ; Bạn muốn hẹn hò có lựa chọn theo xu hướng của nhân vật.\n\nHiện tại: '+l.age+' tuổi; '+(l.partner?'đang có người yêu / bạn đời':'độc thân')+'; '+(E.sponsorActive&&E.sponsorActive(l)?'có quan hệ chu cấp đang tiếp tục':'chưa có quan hệ chu cấp đang tiếp tục')+'.';},opts:[{k:'ok',l:'Đã hiểu',run:function(){}}]});
  E.ACT.push({id:'tc_dieu_kien',g:'Tình cảm',l:'Cách mở chu cấp / Người ấy là ai',min:16,sc:'tc_dieu_kien',ai:{w:0}});
  Object.keys(E.DEC).filter(function(id){return /^hh_/.test(id);}).forEach(function(id){var d=E.DEC[id],before=d.valid,make=d.make;d.make=function(l){var scene=make.apply(this,arguments);scene.data.showAt=l.age;return scene;};d.valid=function(l,data){return free(l)&&!l.partner&&l.age>=20&&l.age<=42&&(!data||data.showAt==null||data.showAt===l.age)&&(id!=='hh_moi'||l.flags.datingShowAt!==l.age)&&(!before||before(l,data));};});
  var invitation=E.DEC.hh_moi,apply=invitation.apply;
  invitation.apply=function(l,d,k,r,log){if(k!=='khong'&&d.opts.some(function(o){return o.k===k;}))l.flags.datingShowAt=l.age;return apply.call(this,l,d,k,r,log);};
  E.ACT.forEach(function(a){if(a.id==='show_hen_ho'){var avail=a.avail;a.avail=function(l){return l.flags.datingShowAt===l.age?'Đã đăng ký chương trình trong năm nay':avail(l);};}});
  var rows=[
    ['office','Đối chiếu dữ liệu','Hai bản báo cáo có số liệu chưa khớp.','Kiểm tra nguồn dữ liệu và ghi lại cách đối chiếu','Học thêm công cụ kiểm tra dữ liệu'],
    ['office','Bàn giao dự án','Một dự án cần chuyển sang giai đoạn mới.','Lập danh sách đầu việc và xác nhận người phụ trách','Bổ sung kỹ năng quản lý dự án'],
    ['worker','Chất lượng vật tư','Một lô vật tư có dấu hiệu khác tiêu chuẩn.','Kiểm tra tiêu chuẩn trước khi sử dụng','Học thêm cách kiểm tra chất lượng'],
    ['worker','Quy trình thiết bị','Thiết bị quen thuộc có quy trình vận hành mới.','Đọc hướng dẫn và kiểm tra an toàn','Tham gia buổi thực hành có hướng dẫn'],
    ['sale','Cam kết với khách','Khách muốn làm rõ một điều khoản trước khi quyết định.','Giải thích đúng phạm vi, xác nhận bằng văn bản','Bồi dưỡng kỹ năng tư vấn'],
    ['sale','Báo giá thay đổi','Giá đầu vào thay đổi khi bạn chuẩn bị tư vấn.','Cập nhật giá và trao đổi minh bạch','Học cách dự toán và quản lý báo giá'],
    ['edu','Người học cần hỗ trợ','Phản hồi cho thấy một phần nội dung còn khó tiếp cận.','Điều chỉnh cách giải thích và hỏi lại người học','Bồi dưỡng phương pháp giảng dạy'],
    ['edu','Kế hoạch học tập','Bạn cần sắp xếp nội dung trong thời gian hữu hạn.','Ưu tiên kiến thức cốt lõi, giữ thời gian ôn tập','Tham khảo học liệu có bản quyền'],
    ['uniform','Bàn giao nhiệm vụ','Thông tin của một nhiệm vụ cần được xác nhận đầy đủ.','Đối chiếu hồ sơ và báo cáo theo đúng quy trình','Ôn tập kỹ năng chuyên môn'],
    ['uniform','Phối hợp lực lượng','Nhiệm vụ chung yêu cầu phối hợp nhiều bộ phận.','Làm rõ vai trò, liên lạc và phương án an toàn','Tham gia buổi diễn tập phù hợp nhiệm vụ'],
    ['state','Hồ sơ cần bổ sung','Một hồ sơ thiếu giấy tờ khiến người dân phải chờ.','Hướng dẫn rõ phần còn thiếu, tránh yêu cầu lặp lại','Bồi dưỡng nghiệp vụ xử lý hồ sơ'],
    ['state','Cải thiện quy trình','Một quy trình có bước trùng lặp gây chậm trễ.','Đề xuất cải tiến đúng thẩm quyền','Học công cụ hỗ trợ xử lý công việc'],
    ['service','Lịch phục vụ thay đổi','Lịch phục vụ có thay đổi cần được xác nhận.','Kiểm tra khả năng đáp ứng trước khi hứa','Bồi dưỡng nghiệp vụ tổ chức công việc'],
    ['service','Thông tin bàn giao','Một yêu cầu quan trọng có thể bị bỏ sót khi bàn giao.','Ghi nhận và xác nhận lại thông tin','Tham gia khóa giao tiếp trong dịch vụ'],
    ['beauty','Vệ sinh dụng cụ','Dụng cụ cần được kiểm tra trước lượt phục vụ tiếp theo.','Tuân thủ vệ sinh và thay dụng cụ không đạt','Bồi dưỡng kỹ năng vệ sinh chuyên ngành'],
    ['beauty','Kỳ vọng của khách','Khách đưa mẫu nhưng kết quả phụ thuộc điều kiện thực tế.','Trao đổi giới hạn và chỉ làm khi khách đồng ý','Học kỹ thuật phù hợp chuyên môn'],
    ['farm','Chi phí đầu vào','Giá vật tư sản xuất có biến động.','Tính lại chi phí và chọn phương án vừa sức','Học cách lập kế hoạch sản xuất'],
    ['farm','Bảo quản sản phẩm','Sản phẩm cần được bảo quản để giảm hao hụt.','Kiểm tra điều kiện bảo quản và đầu ra','Bồi dưỡng kỹ thuật bảo quản'],
    ['biz','Đối tác cung ứng','Một đối tác mới đề nghị điều kiện hấp dẫn nhưng chưa rõ năng lực.','Xác minh năng lực, thử hợp đồng nhỏ trước','Học kỹ năng đánh giá đối tác'],
    ['biz','Chi phí vận hành','Bạn muốn biết khâu nào đang tiêu tốn nguồn lực.','Đối chiếu sổ sách trước khi quyết định','Bồi dưỡng kỹ năng quản trị chi phí'],
    ['free','Phạm vi công việc','Yêu cầu mới vượt phần việc đã thỏa thuận.','Thương lượng lại phạm vi và thời hạn','Học cách lập hợp đồng dịch vụ'],
    ['free','Quyền sử dụng tài liệu','Một tài liệu có điều kiện sử dụng chưa rõ.','Xác minh quyền sử dụng hoặc chọn tài liệu thay thế','Mua khóa học về bản quyền nghề nghiệp'],
    ['law','Đối chiếu chứng cứ','Các tài liệu của một vụ việc có chi tiết chưa khớp.','Đối chiếu hồ sơ, xác minh thông tin trước khi kết luận','Bồi dưỡng kỹ năng nghiên cứu hồ sơ'],
    ['law','Thời hạn thủ tục','Một thủ tục có thời hạn cần theo dõi chặt chẽ.','Kiểm tra mốc thời gian và thông báo rõ trách nhiệm','Bồi dưỡng nghiệp vụ quản lý hồ sơ'],
    ['media','Kiểm chứng thông tin','Một nguồn tin cung cấp chi tiết chưa được xác nhận.','Đối chiếu nguồn độc lập trước khi sử dụng','Bồi dưỡng kỹ năng kiểm chứng'],
    ['media','Đính chính nội dung','Một nội dung cũ cần cập nhật cho chính xác.','Kiểm tra, đính chính và ghi rõ thay đổi','Học cách quản lý nguồn tư liệu'],
    ['poor','Sắp xếp công việc','Thời tiết thay đổi ảnh hưởng việc làm và sinh hoạt.','Điều chỉnh kế hoạch, ưu tiên an toàn','Học thêm kỹ năng phù hợp công việc'],
    ['poor','Giữ uy tín nghề','Một công việc cần xác nhận rõ yêu cầu để tránh hiểu lầm.','Trao đổi rõ công sức và điều kiện thực hiện','Bồi dưỡng kỹ năng giao tiếp với khách']
  ];
  var cases=rows.map(function(x,i){return{id:'case'+i,cat:x[0],title:x[1],text:x[2],care:x[3],learn:x[4]};});
  function state(l){if(!l.flags.careerStories)l.flags.careerStories={seen:{},count:0};return l.flags.careerStories;}
  function pool(l){if(!free(l)||!l.job)return[];var c=E.jobDef(l),s=state(l);if(!c||l.job.id==='an_xin'||c.sec==='crime'||(s.at===l.age&&s.count>=2))return[];return cases.filter(function(x){var at=s.seen[l.job.id+':'+x.id];return x.cat===c.cat&&(at==null||l.age-at>=4);});}
  function token(l){if(!l.job.storyToken){l.flags.careerStorySerial=(l.flags.careerStorySerial||0)+1;l.job.storyToken=l.flags.careerStorySerial;}return l.job.storyToken;}
  function valid(l,d){if(!d||!d.caseId)return pool(l).length>0;return !!(l.job&&d.at===l.age&&d.job===l.job.id&&d.token===token(l)&&d.rank===(l.job.rank||0)&&pool(l).some(function(c){return c.id===d.caseId;}));}
  function cost(l){return l.cur==='vnd'?.8:l.base*.8/90;}
  function outcome(l,r,log,d,k){if(!valid(l,d))return;var s=state(l),c=cases.filter(function(x){return x.id===d.caseId;})[0];if(k==='learn'&&l.money<cost(l))return;if(s.at!==l.age){s.at=l.age;s.count=0;}s.count++;s.seen[l.job.id+':'+c.id]=l.age;
    var rep=k==='care'?3:k==='learn'?4:k==='rush'?-4:0;l.job.rep=U.clamp((l.job.rep==null?50:l.job.rep)+rep,0,100);
    if(k==='learn'){H.cash(l,-cost(l),'Bồi dưỡng kỹ năng nghề');H.fx(l,{kno:1});log(c.title+': bạn tự chi '+H.mb(l,cost(l))+' từ tiền riêng để bồi dưỡng kỹ năng; chưa đồng nghĩa được thăng chức.','neutral');}
    else if(k==='care'){H.fx(l,{kno:.5});log(c.title+' · '+d.role+': bạn xử lý cẩn thận, giữ uy tín trong nghề.','good');}
    else if(k==='rush'){if(l.mind)l.mind.stress=U.clamp(l.mind.stress+3,0,100);log(c.title+' · '+d.role+': làm vội khiến chất lượng giảm, bạn cần khắc phục.','bad');}
    else log(c.title+': bạn tạm hoãn để thu xếp công việc, chưa có kết quả mới.','neutral');
  }
  E.SC('nghe_chuyen_moi',{title:function(l,d){return d.title||'Tình huống trong nghề';},valid:valid,prep:function(l,r){var p=pool(l);if(!p.length)return{};var c=U.pick(r,p),j=E.jobDef(l);return{caseId:c.id,at:l.age,job:l.job.id,rank:l.job.rank||0,token:token(l),title:c.title,role:j.t[l.job.rank||0]};},text:function(l,d){var c=cases.filter(function(x){return x.id===d.caseId;})[0];return c?d.role+': '+c.text+' Mỗi năm tối đa hai tình huống; cùng chuyện chỉ trở lại sau ít nhất bốn năm.':'';},opts:[
    {k:'care',l:function(l,d){var c=cases.filter(function(x){return x.id===d.caseId;})[0];return c?c.care:'Xử lý cẩn thận';},run:function(l,r,log,d){outcome(l,r,log,d,'care');}},
    {k:'learn',l:function(l,d){var c=cases.filter(function(x){return x.id===d.caseId;})[0];return(c?c.learn:'Bồi dưỡng kỹ năng')+' · tự chi '+H.mb(l,cost(l));},req:function(l){return l.money>=cost(l);},run:function(l,r,log,d){outcome(l,r,log,d,'learn');}},
    {k:'rush',l:'Làm qua loa để xong sớm',run:function(l,r,log,d){outcome(l,r,log,d,'rush');}},
    {k:'later',l:'Tạm hoãn để sắp xếp lại',run:function(l,r,log,d){outcome(l,r,log,d,'later');}}
  ]});
  E.ACT.push({id:'nghe_chuyen_moi',g:'Công việc',l:'Tình huống chuyên môn trong nghề',min:18,sc:'nghe_chuyen_moi',avail:function(l){return pool(l).length?true:'Chưa có tình huống mới phù hợp công việc';},ai:{w:.2}});
  E.TRIG.push({id:'nghe_chuyen_moi',when:function(l){return pool(l).length>0;},p:.45,cd:2,rep:true});
  E.CAREER_STORIES={cases:cases,pool:pool,valid:valid};
})(G);
