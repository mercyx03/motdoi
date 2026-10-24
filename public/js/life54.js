/* v4.6.0 — đồng hành cùng từng người con; lựa chọn có tuổi, danh tính và thời hạn. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U;
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.flags.military && l.age < l.flags.military) && !(l.abroad && l.abroad.trapped); }
  function age(l, k) { return l.age - k.born; }
  function init(l, k) {
    if (!k.parentId) { var id; do { id=l.id+':child:'+(l.flags.parentSerial=(l.flags.parentSerial||0)+1); } while((l.kids||[]).some(function(c){return c.parentId===id;})); k.parentId=id; }
    if (!k.upbringing) k.upbringing = { stress: 25, independence: U.clamp(10+age(l,k)*2,10,70), social: 40, seen: {}, count: 0 };
    k.upbringing.seen=k.upbringing.seen||{};
    if (!isFinite(k.upbringing.count)) k.upbringing.count=0;
    if (!isFinite(k.upbringing.stress)) k.upbringing.stress=25;
    if (!isFinite(k.upbringing.independence)) k.upbringing.independence=U.clamp(10+age(l,k)*2,10,70);
    if (!isFinite(k.upbringing.social)) k.upbringing.social=40;
    k.close=U.clamp(isFinite(k.close)&&k.close!=null?k.close:70,0,100); k.study=U.clamp(isFinite(k.study)&&k.study!=null?k.study:50,0,100);
    return k;
  }
  function children(l) { return (l.kids || []).filter(function (k) { return k.alive && age(l, k) >= 0; }).map(function (k) { return init(l, k); }); }
  function home(l, k) { return k.custody !== 'ex' && k.custody !== 'other' && !l.abroad && !(k.jail && age(l, k) < k.jail); }
  function school(l, k) { return age(l, k) >= 6 && age(l, k) <= 17 && k.vice !== 'bỏ học'; }
  function budget(l, n) { return l.cur === 'vnd' ? n : n / 90 * l.base; }
  var CASES = [
    ['sleep',0,2,'Nhịp ngủ của bé','Bé thường thức giấc, việc chăm sóc khiến bạn thiếu ngủ.', 'Sắp xếp lại thời gian nghỉ và chăm bé', 'Thuê hỗ trợ chăm bé một buổi',2,'baby'],
    ['explore',0,2,'Bé khám phá thế giới','Bé thích chạm vào mọi thứ trong tầm tay.', 'Cùng bé chơi và sắp xếp không gian an toàn', 'Mua đồ chơi phù hợp lứa tuổi',.4,'baby'],
    ['routine',0,2,'Thời gian dành cho con','Bạn đang cân nhắc cách dành thời gian đều đặn cho bé.', 'Dành một khoảng thời gian mỗi ngày bên bé', 'Đăng ký buổi hoạt động cha mẹ và bé',.5,'baby'],
    ['preschool',3,5,'Làm quen môi trường mới','Con lo lắng khi tham gia một nhóm sinh hoạt dành cho trẻ nhỏ.', 'Cho con làm quen từng bước, không ép ngay', 'Đăng ký vài buổi trải nghiệm có hướng dẫn',.8,'social'],
    ['tantrum',3,5,'Con chưa biết diễn đạt cảm xúc','Con khóc và giận vì một việc không như ý.', 'Giúp con bình tĩnh rồi gọi tên cảm xúc', 'Mua sách tranh để cùng học về cảm xúc',.2,'social'],
    ['sharing',3,10,'Học cách chia sẻ','Con chưa muốn nhường lượt chơi cho bạn cùng nhóm.', 'Cùng con tập chờ lượt, nói rõ nhu cầu', 'Tham gia hoạt động nhóm nhỏ',.3,'social'],
    ['school',6,7,'Nhịp học đầu cấp','Con cần làm quen thời gian biểu và những bài học đầu tiên.', 'Cùng con lập thời gian biểu có cả giờ nghỉ', 'Mua bộ dụng cụ học tập vừa đủ',.5,'study'],
    ['homework',6,10,'Bài học khó hơn','Con nản khi gặp một dạng bài mới.', 'Gợi ý từng bước, để con tự làm phần còn lại', 'Đăng ký vài buổi hỗ trợ đúng phần còn yếu',.8,'study'],
    ['hobby',6,17,'Sở thích riêng của con','Con muốn thử một hoạt động ngoài việc học.', 'Tìm cách trải nghiệm ít tốn kém trước', 'Đăng ký khóa trải nghiệm ngắn theo ý con',1.2,'independence'],
    ['bully',8,14,'Một chuyện không vui ở lớp','Con kể bị bạn trêu chọc và không muốn nói thêm.', 'Lắng nghe, hỏi rõ rồi trao đổi với giáo viên', 'Thu xếp buổi hỗ trợ tâm lý học đường',.8,'study'],
    ['screens',8,17,'Thỏa thuận thời gian dùng màn hình','Giờ chơi game bắt đầu lấn vào giờ nghỉ và các việc khác.', 'Cùng con thống nhất giờ chơi và giờ nghỉ', 'Thử một hoạt động ngoài màn hình con chọn',.5,'independence'],
    ['pressure',10,17,'Áp lực thành tích','Con sợ làm bạn thất vọng khi điểm số chưa như mong muốn.', 'Nhìn vào tiến bộ, giảm so sánh với người khác', 'Tìm buổi hỗ trợ học tập phù hợp, có giờ nghỉ',1,'study'],
    ['privacy',11,17,'Khoảng riêng của con','Con muốn được tôn trọng nhật ký và những cuộc trò chuyện riêng.', 'Thống nhất ranh giới và cách tìm hỗ trợ khi cần', 'Mua sách kỹ năng để cùng trao đổi',.2,'independence'],
    ['friends',11,17,'Bạn bè của con','Con muốn tự chọn bạn và tham gia một nhóm hoạt động mới.', 'Hỏi về nhóm bạn, cùng thống nhất cách giữ an toàn', 'Hỗ trợ phí tham gia hoạt động con đã chọn',.6,'social'],
    ['money',12,17,'Tập quản lý tiền','Con muốn tự quản một khoản tiêu vặt nhỏ.', 'Cùng lập sổ chi tiêu và mục tiêu tiết kiệm', 'Cho con một khoản nhỏ, thống nhất giới hạn',.3,'independence'],
    ['future',15,17,'Định hướng sau phổ thông','Con đang phân vân giữa học tiếp, học nghề và các hướng khác.', 'Tìm hiểu sở thích, năng lực và nhiều lựa chọn', 'Tham gia buổi hướng nghiệp theo nguyện vọng con',.7,'study'],
    ['adult',18,24,'Con tập tự lập','Con muốn tự quyết nhiều việc nhưng vẫn cần người lắng nghe.', 'Lắng nghe kế hoạch, để con chịu trách nhiệm từng bước', 'Hỗ trợ một khóa kỹ năng con chủ động đề xuất',1.5,'independence'],
    ['boundaries',25,45,'Giữ kết nối khi con trưởng thành','Con đã lớn; cách quan tâm cũng cần thay đổi.', 'Hỏi con cần hỗ trợ gì, tôn trọng quyết định của con', 'Hẹn một bữa ăn, chỉ khi con đồng ý',.5,'social'],
    ['remote',0,45,'Đồng hành khi ở xa','Bạn không trực tiếp chăm con hằng ngày trong hoàn cảnh hiện tại.', 'Liên lạc và hỏi thăm người trực tiếp chăm bé', 'Gửi khoản hỗ trợ, trao đổi rõ mục đích sử dụng',1,'remote']
  ].map(function (x) { return { id:x[0], min:x[1], max:x[2], title:x[3], text:x[4], gentle:x[5], paid:x[6], cost:x[7], skill:x[8] }; });
  function allowed(l, k, c) {
    var a = age(l,k); if (a<c.min || a>c.max) return false;
    if (c.id==='remote') return !home(l,k);
    return home(l,k) && (c.skill!=='study' || a>=18 || school(l,k));
  }
  function slots(l,k) { var p=k.upbringing;return p.at!==l.age || p.count<2; }
  function pool(l,k) { return CASES.filter(function(c){return allowed(l,k,c) && (k.upbringing.seen[c.id]==null || l.age-k.upbringing.seen[c.id]>=3);}); }
  function eligible(l) { return free(l)?children(l).filter(function(k){return slots(l,k)&&pool(l,k).length;}):[]; }
  function target(l,d) { return children(l).filter(function(k){return d&&k.parentId===d.pid;})[0]; }
  function valid(l,d) {
    if(!free(l))return false;if(!d||!d.pid)return eligible(l).length>0;
    var k=target(l,d),c=CASES.filter(function(x){return x.id===d.caseId;})[0];
    return !!(k&&c&&d.at===l.age&&slots(l,k)&&allowed(l,k,c)&&pool(l,k).indexOf(c)>=0&&(!d.auto||l.flags.parentAutoAt!==l.age));
  }
  function finish(l,k,c,d) {var p=k.upbringing;if(p.at!==l.age){p.at=l.age;p.count=0;}p.count++;p.seen[c.id]=l.age;p.last=l.age;if(d.auto)l.flags.parentAutoAt=l.age;}
  function change(k,values) { Object.keys(values).forEach(function(key){if(key==='close'||key==='study')k[key]=U.clamp(k[key]+values[key],0,100);else k.upbringing[key]=U.clamp(k.upbringing[key]+values[key],0,100);}); }
  E.SC('nd_su_kien',{
    title:function(l,d){return d.title||'Đồng hành cùng con';},
    prep:function(l,r,arg){
      var ks=eligible(l),k=arg&&arg.pid?ks.filter(function(x){return x.parentId===arg.pid;})[0]:null;
      if(!k&&!(arg&&arg.pid)){ks.sort(function(a,b){return (a.upbringing.last==null?-1e6:a.upbringing.last)-(b.upbringing.last==null?-1e6:b.upbringing.last);});k=ks[0];}
      if(!k)return{};var c=U.pick(r,pool(l,k));return{pid:k.parentId,caseId:c.id,n:k.name,age:age(l,k),at:l.age,auto:!(arg&&arg.pid),title:c.title+' · '+k.name};
    },valid:valid,
    text:function(l,d){var c=CASES.filter(function(x){return x.id===d.caseId;})[0];if(!c)return'Chưa có tình huống phù hợp.';return d.n+' · '+d.age+' tuổi. '+(c.id==='remote'?(d.age<3?'Bạn trao đổi với người đang trực tiếp chăm bé về sinh hoạt và nhu cầu của bé.':'Bạn và con có thể liên lạc từ xa, theo hoàn cảnh và lịch phù hợp.') :c.text);},
    opts:[
      {k:'listen',l:function(l,d){var c=CASES.filter(function(x){return x.id===d.caseId;})[0];return c?c.id==='remote'&&d.age>=3?'Liên lạc hỏi thăm, lắng nghe con':c.gentle:'Lắng nghe';},ai:{w:1.4},run:function(l,r,log,d){act(l,r,log,d,'listen');}},
      {k:'paid',l:function(l,d){var c=CASES.filter(function(x){return x.id===d.caseId;})[0];return c?c.paid:'Hỗ trợ';},h:function(l,d){var c=CASES.filter(function(x){return x.id===d.caseId;})[0];return c?'Bạn chi '+H.money(l,budget(l,c.cost))+' từ tiền riêng':'';},req:function(l,d){var c=CASES.filter(function(x){return x.id===d.caseId;})[0];return valid(l,d)&&c&&l.money>=budget(l,c.cost);},ai:{w:.6},run:function(l,r,log,d){act(l,r,log,d,'paid');}},
      {k:'strict',l:function(l,d){return d.age>=18?'Áp đặt lựa chọn của mình lên con':d.age<3?'Bỏ qua tín hiệu khó chịu, giữ lịch cứng nhắc':'Áp đặt quy tắc, không nghe giải thích';},req:function(l,d){return d.caseId!=='remote';},ai:{w:.25},run:function(l,r,log,d){act(l,r,log,d,'strict');}},
      {k:'later',l:'Hẹn một thời điểm phù hợp để trao đổi lại',ai:{w:.4},run:function(l,r,log,d){act(l,r,log,d,'later');}}
    ]
  });
  function act(l,r,log,d,choice){
    if(!d||!d.pid||!valid(l,d))return;var k=target(l,d),c=CASES.filter(function(x){return x.id===d.caseId;})[0];
    var prefix=c.title+' · '+k.name+' ('+age(l,k)+' tuổi): ';
    if(choice==='paid'){var cost=budget(l,c.cost);if(l.money<cost)return;H.cash(l,-cost,'Đồng hành cùng '+k.name+': '+c.title);change(k,{close:3,stress:-3});if(c.skill!=='baby'&&c.skill!=='remote')change(k,c.skill==='study'&&school(l,k)?{study:2}:{independence:2});log(prefix+c.paid+'. Khoản chi do bạn trả; kết quả còn cần thời gian và sự tham gia của con.','good');}
    else if(choice==='listen'){change(k,{close:4,stress:-4});if(c.skill==='study'&&school(l,k))change(k,{study:2});if(c.skill==='independence'&&age(l,k)>=6)change(k,{independence:3});if(c.skill==='social')change(k,{social:3});log(prefix+(c.id==='remote'&&age(l,k)>=3?'Liên lạc hỏi thăm, lắng nghe con':c.gentle)+'. '+(age(l,k)>=18?'Bạn hỗ trợ, không quyết định thay con.':'Con được quan tâm; thay đổi cần được duy trì qua thời gian.'),'good');}
    else if(choice==='strict'){change(k,{close:-4,stress:6});log(prefix+'áp đặt ý mình khiến con căng thẳng và ít chia sẻ hơn. Không có gì bảo đảm cách này làm kết quả học tập tốt lên.','neutral');}
    else {change(k,{close:-1});log(prefix+'bạn hẹn sẽ trao đổi lại khi có thể tập trung hơn. Chưa có thay đổi lớn.','neutral');}
    finish(l,k,c,d);
  }
  E.SC('nuoi_day_con',{title:'Nuôi dạy và đồng hành cùng con',valid:function(l){return free(l)&&children(l).length>0;},prep:function(l){return{cs:children(l).slice(0,8).map(function(k){return{pid:k.parentId,n:k.name,age:age(l,k)};})};},text:'Chọn người con bạn muốn dành thời gian. Mỗi con tối đa hai tình huống trong một năm; hoạt động phụ thuộc độ tuổi và quyền chăm sóc.',
    opts:Array.from({length:8},function(_,i){return{k:'k'+i,l:function(l,d){var c=d.cs[i],k=target(l,c);return c?c.n+' · '+c.age+' tuổi'+(k&&!home(l,k)?' · liên lạc từ xa':''):'';},h:function(l,d){var k=target(l,d.cs[i]);return k?'Gắn kết '+Math.round(k.close)+'/100 · áp lực '+Math.round(k.upbringing.stress)+'/100':'';},req:function(l,d){var k=target(l,d.cs[i]);return !!(k&&slots(l,k)&&pool(l,k).length);},run:function(l,r,log,d){var k=target(l,d.cs[i]);if(k&&free(l)&&slots(l,k)&&pool(l,k).length)l.pending.unshift(E.DEC.nd_su_kien.make(l,r,{pid:k.parentId}));}};}).concat([{k:'no',l:'Để dịp khác',run:function(){}}])});
  var familyGroup=E.ACT.filter(function(a){return a.id==='sinh_con';})[0];
  E.ACT.push({id:'nuoi_day_con',g:familyGroup?familyGroup.g:'Gia đình & bạn bè',l:'Nuôi dạy / đồng hành cùng con',min:16,avail:function(l){return eligible(l).length?true:'Chưa có con hoặc chưa có tình huống phù hợp';},ai:{w:.15}});
  E.TRIG.push({id:'nd_su_kien',when:function(l){return eligible(l).length>0&&l.flags.parentAutoAt!==l.age;},p:.55,cd:1,rep:true});
  E.PARENTING={children:children,eligible:eligible,valid:valid,home:home,cases:CASES,pool:pool};
  E.parentingYear=function(l,r,log,a){if(!l.alive)return;children(l).forEach(function(k){var p=k.upbringing;if(p.yearAt===a)return;p.yearAt=a;if(school(l,k))k.study=U.clamp(k.study+(p.stress>=70?-1:p.stress<=35&&p.independence>=45?.5:0),0,100);});};
  E.HOOKS.year.push(E.parentingYear);
  // Không dùng học lực kém để suy diễn rằng con cờ bạc, vay tín dụng đen.
  function gambling(l){return(l.kids||[]).filter(function(k){return k.alive&&age(l,k)>=18&&age(l,k)<=45&&(/cờ bạc|cá độ/.test(k.vice||'')||k.gamblingDebt>0);});}
  E.DEC.con_pha_gia.valid=function(l,d){return gambling(l).some(function(k){return !d||!d.n||k.name===d.n;});};
  E.DEC.con_pha_gia.def.prep=function(l,r){var k=U.pick(r,gambling(l));return k?{n:k.name,debt:k.gamblingDebt||Math.round(80+r()*400)}:{};};
  E.TRIG.filter(function(t){return t.id==='con_pha_gia';}).forEach(function(t){t.when=function(l){return free(l)&&gambling(l).length>0;};});
  // Học khá không đồng nghĩa đã là bác sĩ, tiến sĩ hoặc có công ty ở tuổi 18.
  function achievers(l){return(l.kids||[]).filter(function(k){return k.alive&&age(l,k)>=18&&age(l,k)<=45&&(k.study==null?50:k.study)>=65;});}
  E.DEC.con_thanh_tai.valid=function(l,d){return achievers(l).some(function(k){return !d||!d.n||k.name===d.n;});};
  E.DEC.con_thanh_tai.def.prep=function(l,r){var k=U.pick(r,achievers(l));if(!k)return{};var text=k.job?'nỗ lực trong công việc '+E.kidTitle(k):k.edu>=5&&age(l,k)>=22?'hoàn thành bậc học và đang xây dựng hướng đi riêng':k.uniUntil?'ngày càng chủ động trong việc học':'đã tiến bộ và tự tin hơn khi lên kế hoạch tương lai';return{n:k.name,t:text};};
  ['con_hoc','con_hu'].forEach(function(id){var D=E.DEC[id];function pupils(l){return children(l).filter(function(k){return school(l,k)&&home(l,k)&&age(l,k)>=(id==='con_hu'?12:6);});}D.valid=function(l,d){return free(l)&&pupils(l).some(function(k){return !d||!d.n||d.n===k.name;});};D.def.prep=function(l){var k=pupils(l)[0];return k?{n:k.name}:{};};});
  E.DEC.con_hoc.def.opts.forEach(function(o){if(o.k==='extra')o.req=function(l){return l.money>=l.base*.05;};if(o.k==='intl')o.req=function(l){return l.money>=l.base*.6;};});
  var oldSchoolApply=E.DEC.con_hoc.apply;
  E.DEC.con_hoc.apply=function(l,d,k,r,log){if((k==='extra'&&l.money<l.base*.05)||(k==='intl'&&l.money<l.base*.6))k='free';return oldSchoolApply.call(this,l,d,k,r,log);};
  // Bảo vệ các chuỗi cũ khi một người con đã mất trong lúc chờ quyết định.
  ['con_18','con_hoc','con_hu','con_lac_loi','con_von','con_thanh_tai','con_pha_gia','con_sau_ly_hon'].forEach(function(id){var D=E.DEC[id];if(!D)return;var v=D.valid,ap=D.apply;D.valid=function(l,d){if(v&&!v(l,d))return false;if(!d||!d.n)return true;var matches=(l.kids||[]).filter(function(k){return k.name===d.n;});return matches.length===1&&matches[0].alive;};D.apply=function(l,d){if(!D.valid(l,d.data))return;return ap.apply(this,arguments);};});
})(globalThis.G);
