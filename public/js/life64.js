/* V5.1: điều kiện sinh hoạt, học bơi, giờ sinh và gia đình hai bên. */
(function(G){
  'use strict';
  var E=G.E,H=E.H,U=G.U;
  function hash(s){var h=2166136261;for(var i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0;}
  function free(l){return l.alive&&!(l.jailUntil!=null&&l.age<l.jailUntil)&&!(l.flags.military&&l.age<l.flags.military)&&!(l.abroad&&l.abroad.trapped);}
  function snapshot(l){return[l.age,l.cur,l.abroad&&l.abroad.code||l.country,l.movedTo||'',l.cityStudent&&l.cityStudent.city||'',l.prov&&l.prov.old||''].join('|');}
  function guarded(id){var D=E.DEC[id],ap=D.apply;D.apply=function(l,d){if(!D.valid(l,d.data))return;return ap.apply(this,arguments);};}
  // Các cảnh có thể chờ qua lúc nghỉ học phải kiểm tra lại khi mở và khi chọn.
  ['thu_nac_danh','he_nay'].forEach(function(id){var D=E.DEC[id];if(!D)return;var valid=D.valid;D.valid=function(l,d){return !!l.school&&valid.call(this,l,d);};guarded(id);});
  var kham=E.DEC.kham,kv=kham.valid;
  kham.valid=function(l,d){return (!(l.recur&&l.recur.kham_dk)||!!(d&&d.requested))&&kv.call(this,l,d);};
  E.TRIG.forEach(function(t){if(t.id==='kham'){var when=t.when;t.when=function(l,a){return !(l.recur&&l.recur.kham_dk)&&when(l,a);};}});
  var city=E.DEC.city,cityApply=city.apply;
  city.valid=function(l){return free(l)&&l.age>=18&&l.age<=35&&!l.urban&&!l.school&&!l.abroad&&!l.flags.cityAsked;};
  city.apply=function(l){if(!city.valid(l))return;return cityApply.apply(this,arguments);};
  // Sân đấu theo nơi đang sống, không theo quốc tịch lúc sinh.
  E.DEC.xem_bong_da.def.text=function(l){var code=l.abroad&&l.abroad.code||l.country,city=l.cityStudent&&l.cityStudent.city||l.movedTo||l.prov&&l.prov.old||'';
    if(code!=='VN')return 'Câu lạc bộ địa phương ở '+(G.W.BY[code]&&G.W.BY[code].name||code)+' có trận đấu sân nhà cuối tuần này.';
    var stadium=/Hà Nội/.test(city)?'sân Hàng Đẫy':/Hồ Chí Minh/.test(city)?'sân Thống Nhất':'sân bóng địa phương ở '+(city||'nơi bạn sống');
    return 'Cuối tuần có trận bóng ở '+stadium+'. Bạn muốn ra sân hay xem ở nhà?';};
  E.DEC.xem_bong_da.def.opts.forEach(function(o){if(o.k==='stadium')o.run=function(l,r,log){var bill=E.childExpense(l,l.base*.005,'Vé bóng đá',false);log(bill.note,'neutral');if(!bill.ok)return;log(r()<.55?'Đội nhà thắng, khán đài vỡ òa tiếng reo hò!':'Đội nhà thua sát nút, bạn vẫn giơ khăn cổ vũ đến hết trận.','good');H.fx(l,{hap:6,soc:3});};if(o.k==='cafe')o.run=function(l,r,log){var bill=E.childExpense(l,l.base*.001,'Đồ uống xem bóng đá',false);log(bill.note,'neutral');if(bill.ok){log('Xem bóng ở quán cà phê, hò hét cùng cả quán.','good');H.fx(l,{hap:3,soc:2});}};});
  ['xem_bong_da','phuot','leo_nui'].forEach(function(id){var D=E.DEC[id],make=D.make,valid=D.valid;D.make=function(l){var d=make.apply(this,arguments);d.data.outing51=snapshot(l);return d;};D.valid=function(l,d){return free(l)&&(!d||!d.outing51||d.outing51===snapshot(l))&&valid.call(this,l,d);};});
  var phuot=E.DEC.phuot.def,pp=phuot.prep;phuot.prep=function(l,r){return (l.abroad&&l.abroad.code||l.country)!=='VN'?{p:'khu cắm trại gần nơi bạn sống'}:pp(l,r);};

  var hike=E.DEC.leo_nui.def,hp=hike.prep;hike.prep=function(l,r){return (l.abroad&&l.abroad.code||l.country)!=='VN'?{p:'một cung đường đi bộ gần nơi bạn sống'}:hp(l,r);};

  function swimValid(l,d){return free(l)&&l.age>=6&&(!d||!d.location||d.location===snapshot(l));}
  function swimCost(l){return E.activityPrice(l,1.2);}
  function learned(l,log){l.flags.swim=true;(l.skills||(l.skills={})).boi=l.age;H.fx(l,{hea:2,hap:2});log('Bạn đã biết bơi cơ bản, vẫn tránh vùng nước nguy hiểm.','good');H.mem(l,'Lần đầu tự bơi được một đoạn ngắn.',3);}
  function practice(l,log){l.flags.swimPractice=(l.flags.swimPractice||0)+1;if(l.flags.swimPractice>=2)learned(l,log);else{H.fx(l,{hea:1});log('Bạn tập nổi và làm quen với nước, chưa đủ vững để bơi xa.','good');}}
  E.SC('hoc_boi51',{title:'Học bơi',valid:swimValid,prep:function(l){return{location:snapshot(l)};},text:function(l){return l.flags.swim?'Bạn muốn luyện bơi thêm hay ôn kỹ năng an toàn?':'Bạn muốn học bơi theo cách nào?';},opts:[
    {k:'course',l:'Đăng ký khóa học có huấn luyện viên',h:function(l){return 'Học phí '+H.money(l,swimCost(l))+(l.age<18?' · xin gia đình chi trả':'');},run:function(l,r,log){var b=E.childExpense(l,swimCost(l),'Khóa học bơi',false);log(b.note,'neutral');if(b.ok)learned(l,log);}},
    {k:'safe',l:'Tập ở khu nước nông có cứu hộ',h:'Miễn phí · luyện từng bước cùng người hướng dẫn',run:function(l,r,log){practice(l,log);}},
    {k:'pond',l:'Tự tập ở ao cùng người quen',h:'Miễn phí · có nguy cơ đuối nước',run:function(l,r,log){wild(l,r,log,.025,'ao');}},
    {k:'river',l:'Tự tập ở sông cùng người quen',h:'Miễn phí · dòng chảy nguy hiểm hơn ao',run:function(l,r,log){wild(l,r,log,.06,'sông');}},
    {k:'lake',l:'Tự tập ở hồ cùng người quen',h:'Miễn phí · có nguy cơ đuối nước',run:function(l,r,log){wild(l,r,log,.04,'hồ');}},
    {k:'no',l:'Để dịp khác',run:function(){}}
  ]});
  function wild(l,r,log,risk,where){if(l.flags.swim||E.hasSkill(l,'boi'))risk*=.25;
    if(r()<risk){if(r()<.12){H.kill(l,'đuối nước khi tự tập bơi ở '+where,log);return;}H.fx(l,{hea:-10,hap:-5});log('Bạn bị hụt chân ở '+where+', người đi cùng gọi cứu hộ kịp thời. Buổi tập phải dừng lại.','bad');return;}
    log('Người quen đi cùng trông chừng khi bạn tập ở '+where+'.','neutral');practice(l,log);}
  guarded('hoc_boi51');
  E.ACT.push({id:'hoc_boi51',g:'Sức khỏe & tâm hồn',l:'Học bơi / luyện kỹ năng an toàn',min:6,avail:function(l){return free(l)?true:'Chưa thể đi học bơi lúc này';},ai:{w:.1}});
  [['k_hoc_boi','hoc'],['he_nay','swim'],['tam_song','learn']].forEach(function(x){var D=E.DEC[x[0]];if(D&&D.def)D.def.opts.forEach(function(o){if(o.k===x[1])o.run=function(l,r){if(swimValid(l))l.pending.unshift(E.DEC.hoc_boi51.make(l,r));};});});

  var SIGNS=['Ma Kết','Bảo Bình','Song Ngư','Bạch Dương','Kim Ngưu','Song Tử','Cự Giải','Sư Tử','Xử Nữ','Thiên Bình','Bọ Cạp','Nhân Mã'],CUT=[20,19,21,20,21,21,23,23,23,23,22,22];
  var HOURS=['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
  function birth(l){if(l.astro51)return l.astro51;var h=hash([l.name,l.birthPlace,l.birthYear,l.birthMonth].join('|')),m=l.birthMonth||1,days=new Date(Date.UTC(l.birthYear,m,0)).getUTCDate();
    l.birthDay=l.birthDay||1+h%days;l.birthHour=l.birthHour==null?(h>>>8)%24:l.birthHour;
    var sign=(m-1+(l.birthDay>=CUT[m-1]?1:0))%12,trait=['amb','soc','moral','risk'][sign%4];
    var a=l.astro51={sign:SIGNS[sign],hour:HOURS[Math.floor((l.birthHour+1)%24/2)],trait:trait,theme:['kiên trì','cởi mở','quan tâm người khác','ưa khám phá'][sign%4]};
    if(l.age===0&&l.tr){l.tr[trait]=U.clamp(l.tr[trait]+4,5,98);l.tr[HOURS.indexOf(a.hour)%2?'soc':'amb']=U.clamp(l.tr[HOURS.indexOf(a.hour)%2?'soc':'amb']+2,5,98);}
    return a;}
  var migrate=E.migrateExt;E.migrateExt=function(l){if(migrate)migrate(l);birth(l);family(l);l.pending=(l.pending||[]).filter(function(d){return d.id!=='me_chong'&&!H.schoolOff(l,(d.title||'')+' '+(d.text||''))&&!(d.id==='kham'&&l.recur&&l.recur.kham_dk&&!(d.data&&d.data.requested));});};
  E.astroText=function(l){var a=birth(l);return a.sign+' · giờ '+a.hour+' ('+l.birthHour+'h) · '+a.theme;};
  E.SC('van_hoi51',{title:'Một dịp đáng thử',valid:function(l){return free(l)&&l.age>=16;},text:function(l){return 'Bạn đang thiên về '+birth(l).theme+'. Một người quen rủ bạn thử một việc mới.';},opts:[
    {k:'learn',l:'Học một kỹ năng mới cùng họ',run:function(l,r,log){H.fx(l,{kno:2,hap:1});log(U.pick(r,['Buổi học mở ra một sở thích mới, bạn muốn dành thời gian luyện thêm.','Học xong buổi đầu, bạn hẹn họ tuần sau học tiếp.','Buổi học vụng về nhưng vui, bạn ghi lại vài mẹo để tự tập ở nhà.']),'good');}},
    {k:'meet',l:'Đến gặp gỡ, mở rộng quan hệ',run:function(l,r,log){H.fx(l,{soc:3,hap:1});if(l.job)l.job.rep=U.clamp((l.job.rep||50)+2,0,100);log('Bạn quen thêm vài người và có một cuộc trò chuyện hữu ích.','good');}},
    {k:'rest',l:'Giữ lịch riêng, nghỉ ngơi',run:function(l,r,log){H.fx(l,{hea:1,hap:2});log(U.pick(H.rf(l),['Bạn dành ngày rảnh cho bản thân.','Bạn để ngày rảnh cho riêng mình, ngủ nướng rồi đọc sách.','Bạn nghỉ ngơi, đi dạo một vòng cho thư thái.']),'good');}}
  ]});
  E.TRIG.push({id:'van_hoi51',when:function(l){return free(l)&&l.age>=16;},p:function(l){return .06+(birth(l).trait==='soc'?.04:0);},cd:5,max:3});

  function couple(l){return free(l)&&l.age>=18&&l.partner&&l.partner.alive!==false&&l.partner.age>=18;}
  function pid(l){return l.partner&&(l.partner.heritageId||l.partner.name+':'+l.partner.since);}
  function family(l){var f=l.flags.family51||(l.flags.family51={strict:E.birthContext?/quy tắc|ít tự quyết|hay lo xa|kỳ vọng|áp lực lựa chọn/.test(E.birthContext(l).text):hash(l.name+':family')%100<35});return f;}
  function inlaws(l){var p=l.partner;if(!p)return null;if(!p.inlaws51){var h=hash(pid(l)+':inlaws');p.inlaws51={strict:h%100<35,mDeath:68+(h>>>10)%26,mAgeAtBirth:22+(h>>>6)%13,orphan:p.orphan===true||p.parentsAlive===false||p.mAlive===false};}return p.inlaws51;}
  function mother(l){var p=l.partner,f=inlaws(l);return f&&!f.orphan&&p.mAlive!==false&&p.age+f.mAgeAtBirth<f.mDeath;}
  // Cảnh cũ không lưu gia đình phía người ấy; thay bằng cảnh có hồ sơ và tuổi.
  E.DEC.me_chong.valid=function(){return false;};
  E.TRIG.forEach(function(t){if(t.id==='me_chong')t.when=function(){return false;};});
  function familyValid(l,d){return !!(couple(l)&&(!d||!d.pid||d.pid===pid(l))&&(!d||d.at==null||d.at===l.age));}
  E.SC('gia_dinh_hai_ben51',{title:'Chuyện gia đình hai bên',valid:function(l,d){var own=l.partner&&l.partner.status==='dating'&&family(l).strict&&(l.fam.mAlive||l.fam.fAlive&&!l.fam.noDad);return familyValid(l,d)&&(d&&d.caseId?(d.caseId==='own'?own:mother(l)):own||mother(l));},prep:function(l,r){var p=l.partner,f=inlaws(l),own=p.status==='dating'&&(l.fam.mAlive||l.fam.fAlive&&!l.fam.noDad)&&family(l).strict;
    var earned=l.job&&E.monthlyEst?E.monthlyEst(l,l.job.id,l.job.rank)*12:l.retired&&l.pensionInc?l.pensionInc:l.income||0;
    var low=l.sex==='M'&&p.sex==='F'&&earned<l.base*.5&&E.netWorth(l)<l.base*5,job=E.jobDef(l),bias=f.strict&&l.sex==='M'&&p.sex==='F'&&job&&/^(poor|service|free|worker)$/.test(job.cat);
    return{pid:pid(l),at:l.age,caseId:own?'own':p.status==='dating'&&f.strict?'oppose':f.strict?'boundary':'warm',reason:low?'income':bias?'job':'fit',name:p.name};},
    text:function(l,d){return d.caseId==='own'?(l.fam.mAlive&&l.fam.fAlive&&!l.fam.noDad?'Bố mẹ':l.fam.mAlive?'Mẹ':'Bố')+' lo hai người chưa hợp nhau, muốn bạn hoãn chuyện cưới xin.':d.caseId==='oppose'?'Gia đình '+d.name+(d.reason==='income'?' lo thu nhập của bạn chưa ổn định, phản đối chuyện cưới.':d.reason==='job'?' có định kiến với công việc bạn đang làm, phản đối chuyện cưới.':' chưa đồng ý chuyện cưới, muốn tìm hiểu hai người thêm.'):d.caseId==='boundary'?(l.sex==='F'&&l.partner.sex==='M'&&l.partner.status==='married'?'Mẹ chồng':'Mẹ của '+d.name)+' muốn bạn làm theo nếp sinh hoạt nhà bà, khiến bạn thấy ngột ngạt.':'Mẹ của '+d.name+' hỏi bạn thích ăn gì và chủ động giúp hai người một việc trong nhà.';},opts:[
      {k:'talk',l:'Ngồi lại nói chuyện, lắng nghe nhau',run:function(l,r,log,d){H.fx(l,{soc:2,hap:1});l.partner.close=U.clamp((l.partner.close||50)+2,0,100);log(d.caseId==='warm'?U.pick(H.rf(l),['Bạn cảm ơn và cùng chuẩn bị một bữa cơm.','Bạn cảm ơn, xắn tay vào bếp phụ một tay, bữa cơm hôm ấy ấm cúng hẳn.','Bạn nhận lời, cả nhà quây quần bên mâm cơm, chuyện trò rôm rả.']):'Hai người giải thích dự định của mình. Gia đình '+(r()<.6?'dần bớt căng thẳng.':'vẫn cần thêm thời gian để chấp nhận.'),'neutral');family(l).lastTalk=l.age;}},
      {k:'boundary',l:'Cùng người ấy đặt ranh giới rõ ràng',run:function(l,r,log){l.partner.close=U.clamp((l.partner.close||50)+3,0,100);if(l.mind)l.mind.stress=Math.max(0,l.mind.stress-3);family(l).boundaries=pid(l);log(U.pick(H.rf(l),['Hai người thống nhất tự quyết việc riêng, vẫn giữ liên lạc với gia đình.','Hai người ngồi lại, thống nhất chuyện nhà mình thì mình quyết, vẫn thăm hỏi gia đình đều đặn.','Hai bạn nhẹ nhàng đặt ranh giới với gia đình mà vẫn giữ hòa khí.']),'good');}},
      {k:'wait',l:'Tạm nhường một bước, hẹn nói sau',run:function(l,r,log){H.fx(l,{hap:-1});log(U.pick(r,['Bạn tránh tranh luận lúc này, hẹn một dịp bình tĩnh hơn.','Bạn im lặng cho qua, để mọi người nguôi giận rồi nói chuyện sau.','Bạn xin phép nói chuyện vào hôm khác, khi ai cũng bình tĩnh hơn.','Bạn nhường một bước, giữ hòa khí trước đã.']),'neutral');}}
    ]});guarded('gia_dinh_hai_ben51');
  E.TRIG.push({id:'gia_dinh_hai_ben51',when:function(l){return couple(l)&&(l.partner.status!=='dating'||l.partner.since!=null&&l.age-l.partner.since>=1)&&((l.partner.status==='dating'&&family(l).strict&&(l.fam.mAlive||l.fam.fAlive&&!l.fam.noDad))||mother(l));},p:function(l){return family(l).boundaries===pid(l)?.08:.22;},cd:3,max:12,rep:true});
  var V=E.DEC.vr_vong,vm=V.make,va=V.apply,vu=V.auto;
  var challenges=[
    {title:'Mật mã chiếc hộp',text:'Mật mã là tổng số chấm trên hai thẻ: 7 và 8. Bạn nhập số nào?',labels:['14','15','16'],answer:1},
    {title:'Nhớ thứ tự vật phẩm',text:'Ê-kíp vừa cho xem: nón, quạt, giỏ. Vật đứng giữa là gì?',labels:['Chiếc giỏ','Chiếc nón','Chiếc quạt'],answer:2},
    {title:'Ghép bản đồ',text:'Từ vạch xuất phát, đi hai ô về đông rồi một ô về bắc. Bạn chọn mảnh đường nào?',labels:['Hai ô phải, một ô lên','Hai ô trái, một ô lên','Một ô phải, hai ô xuống'],answer:0},
    {title:'Chuyền bóng tiếp sức',text:'Đội bạn bị chậm ở khúc cua. Bạn muốn đổi cách phối hợp thế nào?',labels:['Chuyền ngắn, giữ nhịp đều','Ra hiệu trước mỗi lượt chuyền','Chạy bứt lên để bù thời gian'],strategies:['team','mind','hard']},
    {title:'Truy tìm vật phẩm',text:'Manh mối nhắc đến một chỗ có mái che và tiếng nước. Đội bạn tìm ở đâu trước?',labels:['Quanh giếng có mái','Giữa sân nắng','Ở cổng làng'],answer:0},
    {title:'Giữ thăng bằng',text:'Hai đồng đội đang bước lệch nhịp trên cầu thử thách. Bạn xử lý ra sao?',labels:['Đếm nhịp để cả đội bước cùng','Dừng lại quan sát cách đặt chân','Nhận đoạn khó nhất về mình'],strategies:['team','mind','hard']},
    {title:'Đoán từ bằng hành động',text:'Đồng đội làm động tác mở ô, chỉ lên trời rồi giả vờ ướt áo. Bạn đoán gì?',labels:['Trời mưa','Đi câu cá','Tưới cây'],answer:0},
    {title:'Vòng cuối xé bảng tên',text:'Đối thủ đang giữ lối tắt. Bạn bàn với đội kế hoạch nào?',labels:['Chia hai hướng hỗ trợ nhau','Dụ đối thủ rời lối tắt','Chạy đua thẳng tới đích'],strategies:['team','mind','hard']}
  ];
  // v5.6.1: thử thách có đáp án được sinh đề mới mỗi lần, không lặp nguyên câu đố trong cùng mùa quay
  function mix(r,a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
  function quiz(r,text,right,wrong){var labels=mix(r,[right].concat(mix(r,wrong).slice(0,2)));return{text:text,labels:labels,answer:labels.indexOf(right)};}
  var ITEMS=['chiếc nón','chiếc quạt','chiếc giỏ','đèn lồng','cái trống','chiếc khăn','ấm trà','chiếc ô','bình hoa','con diều'];
  var CLUES=[['có mái che và tiếng nước','Quanh giếng có mái'],['có tiếng chuông vào giờ chiều','Trong sân đình'],['có bóng mát và tiếng lá xào xạc','Dưới gốc đa đầu làng'],['có thuyền neo và mùi sông nước','Ở bến đò'],['thơm mùi bánh mới ra lò','Trước lò bánh đầu ngõ'],['ồn ào tiếng mặc cả từ sáng sớm','Giữa chợ phiên']];
  var ACTS=[['mở ô, chỉ lên trời rồi giả vờ ướt áo','Trời mưa'],['quăng cần ra xa rồi giật mạnh','Đi câu cá'],['khom lưng cắm mạ, lau mồ hôi','Cấy lúa'],['đạp hai chân, tay giữ tay lái','Đạp xe'],['chụm tay thổi rồi xoa xoa hai vai','Trời lạnh'],['vẫy tay chào rồi kéo vali','Đi du lịch'],['múa tay theo nhịp, miệng hát không thành tiếng','Hát karaoke']];
  var GEN={
    'Mật mã chiếc hộp':function(r){var a=3+Math.floor(r()*7),b=3+Math.floor(r()*7),s=a+b;return quiz(r,'Mật mã là tổng số chấm trên hai thẻ: '+a+' và '+b+'. Bạn nhập số nào?',String(s),[String(s-1),String(s+1),String(s+2)]);},
    'Nhớ thứ tự vật phẩm':function(r){var x=mix(r,ITEMS).slice(0,3);return quiz(r,'Ê-kíp vừa cho xem: '+x.join(', ')+'. Vật đứng giữa là gì?',U.cap(x[1]),[U.cap(x[0]),U.cap(x[2])]);},
    'Ghép bản đồ':function(r){var n=1+Math.floor(r()*3),m=1+Math.floor(r()*2),e=r()<.5,up=r()<.5;var lab=function(n,e,m,up){return n+' ô '+(e?'phải':'trái')+', '+m+' ô '+(up?'lên':'xuống');};
      return quiz(r,'Từ vạch xuất phát, đi '+n+' ô về '+(e?'đông':'tây')+' rồi '+m+' ô về '+(up?'bắc':'nam')+'. Bạn chọn mảnh đường nào?',lab(n,e,m,up),[lab(n,!e,m,up),lab(n,e,m,!up),lab(m,e,n,up)].filter(function(x){return x!==lab(n,e,m,up);}));},
    'Truy tìm vật phẩm':function(r){var c=U.pick(r,CLUES);return quiz(r,'Manh mối nhắc đến một chỗ '+c[0]+'. Đội bạn tìm ở đâu trước?',c[1],CLUES.filter(function(x){return x!==c;}).map(function(x){return x[1];}));},
    'Đoán từ bằng hành động':function(r){var c=U.pick(r,ACTS);return quiz(r,'Đồng đội '+c[0]+'. Bạn đoán gì?',c[1],ACTS.filter(function(x){return x!==c;}).map(function(x){return x[1];}));}
  };
  function challengeOf(v){var c=challenges[v.challenge51.index];return v.challenge51.q?Object.assign({},c,v.challenge51.q):c;}
  V.make=function(l,r){var d=vm.apply(this,arguments),v=l.flags.variety;if(!v.compact)return d;var key=v.ep+':'+v.stage;
    if(!v.challenge51||v.challenge51.key!==key){var seen=v.usedChallenges51||(v.usedChallenges51=[]),pool=challenges.map(function(c,i){return i;}).filter(function(i){return seen.indexOf(i)<0;});if(!pool.length){seen.length=0;pool=challenges.map(function(c,i){return i;});}var index=U.pick(r,pool);seen.push(index);v.challenge51={key:key,index:index,token:v.token};var gen=GEN[challenges[index].title];if(gen)v.challenge51.q=gen(r);}
    var c=challengeOf(v);v.challengeName51=c.title;d.data.challenge51=v.challenge51.index;d.title=E.VARIETY.titles[v.k]+' · Tập '+(v.ep+1)+'/'+v.total+' · '+c.title;
    d.text=v.location+' · Khách mời: '+v.guests.join(', ')+'. Đội bạn: '+v.team.join(', ')+'. '+c.text;
    d.opts=c.labels.map(function(label,i){return{k:'pick'+i,l:label,h:''};}).filter(function(o,i){return !c.strategies||c.strategies[i]!=='hard'||!v.injured&&l.st.hea>=55;});d.opts.push({k:'quit',l:'Xin dừng quay để giữ sức',h:''});return d;};
  V.apply=function(l,d,k,r,log){var v=l.flags.variety;if(!v||!v.compact)return va.apply(this,arguments);if(!E.VARIETY.valid(l,d.data)||!v.challenge51||d.data.challenge51!==v.challenge51.index||!d.opts.some(function(o){return o.k===k;}))return;
    if(k==='quit')return va.call(this,l,d,k,r,log);var i=+k.slice(4),c=challengeOf(v);if(!c||!c.labels[i])return;
    var first=true,rr=c.strategies?r:function(){if(first){first=false;return i===c.answer?0:.999999;}return r();};
    if(!c.strategies)log((c.title?c.title+': ':'')+(i===c.answer?'trả lời đúng — '+c.labels[c.answer]+'.':'chưa đúng, đáp án là '+c.labels[c.answer]+'.'),i===c.answer?'good':'neutral');
    return va.call(this,l,d,c.strategies?c.strategies[i]:'team',rr,log);
  };
  V.auto=function(l,d,r){if(l.flags.variety&&l.flags.variety.compact)return U.pick(r,d.opts.filter(function(o){return o.k!=='quit';})).k;return vu.apply(this,arguments);};
  E.DEC.vr_vai_tro.def.text='Bạn muốn làm khách mời 2 tập hay thành viên cố định 6 tập? Mỗi tập có hai thử thách chính.';
  E.DEC.vr_vai_tro.def.opts.forEach(function(o){if(o.k==='guest'||o.k==='regular')o.h=function(l,d){return(o.k==='guest'?'4':'12')+' lượt chọn · cát-xê '+H.money(l,E.VARIETY.quote(d.fee,o.k));};});
  E.DEC.gameshow.def.text='Chọn show để xem lịch khách mời hoặc thành viên cố định.';
  var major=E.isMajor;E.isMajor=function(d){if(d&&d.id==='vr_vong'&&d.data&&d.data.challenge51!=null)return false;return major.apply(this,arguments);};
  E.LIFE51={birth:birth,free:free,snapshot:snapshot,swimCost:swimCost,family:family,inlaws:inlaws,mother:mother,challenges:challenges};
})(G);
