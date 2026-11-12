/* V5.4 — học chuyên, đội tuyển và nguyện vọng đại học. Ngưỡng xét hồ sơ là tham số trò chơi, tách khỏi dữ liệu trường. */
(function(G){
  'use strict';
  var E=G.E,H=E.H,U=G.U;
  var SUBJECTS={math:'Toán',physics:'Vật lý',chem:'Hóa học',bio:'Sinh học',it:'Tin học',lit:'Ngữ văn',english:'Tiếng Anh',history:'Lịch sử',geo:'Địa lý'};
  var OLYMPIC=['math','physics','chem','bio','it'];
  // Nhóm ngành dùng chung với hệ thống bằng cấp/nghề nghiệp của game.
  var SCHOOLS=[
    ['hust','Đại học Bách khoa Hà Nội','Bắc','Hà Nội',26,['it']],
    ['neu','Đại học Kinh tế Quốc dân','Bắc','Hà Nội',26,['eco']],
    ['ftu','Trường Đại học Ngoại thương','Bắc','Hà Nội',27,['eco']],
    ['hmu','Trường Đại học Y Hà Nội','Bắc','Hà Nội',28,['med']],
    ['hnue','Trường Đại học Sư phạm Hà Nội','Bắc','Hà Nội',25,['edu']],
    ['hlu','Trường Đại học Luật Hà Nội','Bắc','Hà Nội',25,['law']],
    ['uet','Trường Đại học Công nghệ – ĐHQGHN','Bắc','Hà Nội',27,['it']],
    ['hus','Trường Đại học Khoa học Tự nhiên – ĐHQGHN','Bắc','Hà Nội',24,['it']],
    ['haui','Đại học Công nghiệp Hà Nội','Bắc','Hà Nội',22,['it','eco']],
    ['tump','Trường Đại học Y Dược – Đại học Thái Nguyên','Bắc','Thái Nguyên',25,['med']],
    ['dut','Trường Đại học Bách khoa – Đại học Đà Nẵng','Trung','Đà Nẵng',24,['it']],
    ['due','Trường Đại học Kinh tế – Đại học Đà Nẵng','Trung','Đà Nẵng',23,['eco']],
    ['ued','Trường Đại học Sư phạm – Đại học Đà Nẵng','Trung','Đà Nẵng',23,['edu']],
    ['huey','Trường Đại học Y – Dược, Đại học Huế','Trung','Huế',26,['med']],
    ['huelaw','Trường Đại học Luật, Đại học Huế','Trung','Huế',21,['law']],
    ['vinh','Trường Đại học Vinh','Trung','Nghệ An',20,['it','eco','edu']],
    ['qnu','Trường Đại học Quy Nhơn','Trung','Quy Nhơn',19,['it','eco','edu']],
    ['hcmut','Trường Đại học Bách khoa – ĐHQG-HCM','Nam','TP. Hồ Chí Minh',26,['it']],
    ['hcmus','Trường Đại học Khoa học tự nhiên – ĐHQG-HCM','Nam','TP. Hồ Chí Minh',25,['it']],
    ['uit','Trường Đại học Công nghệ Thông tin – ĐHQG-HCM','Nam','TP. Hồ Chí Minh',26,['it']],
    ['ueh','Đại học Kinh tế TP. Hồ Chí Minh','Nam','TP. Hồ Chí Minh',25,['eco']],
    ['ump','Đại học Y Dược TP. Hồ Chí Minh','Nam','TP. Hồ Chí Minh',28,['med']],
    ['hcmue','Trường Đại học Sư phạm TP. Hồ Chí Minh','Nam','TP. Hồ Chí Minh',25,['edu']],
    ['hcmulaw','Trường Đại học Luật TP. Hồ Chí Minh','Nam','TP. Hồ Chí Minh',25,['law']],
    ['ctu','Đại học Cần Thơ','Nam','Cần Thơ',22,['it','eco','edu','law']],
    ['agu','Trường Đại học An Giang – ĐHQG-HCM','Nam','An Giang',19,['it','eco','edu']],
    ['dthu','Trường Đại học Đồng Tháp','Nam','Đồng Tháp',19,['edu','eco']]
  ].map(function(x){return{id:x[0],name:x[1],region:x[2],city:x[3],score:x[4],majors:x[5]};});
  var WORLD_SCHOOLS={
    GB:[['oxford','University of Oxford','Oxford',28,['it','eco','med','edu','law']],['cambridge','University of Cambridge','Cambridge',28,['it','eco','med','edu','law']],['imperial','Imperial College London','London',27,['it','med','eco']],['lse','London School of Economics (LSE)','London',27,['eco','law']],['ucl','University College London (UCL)','London',26,['it','eco','med','edu','law','art']],['edinburgh','University of Edinburgh','Edinburgh',26,['it','eco','med','edu','law','art']],['manchester','University of Manchester','Manchester',25,['it','eco','med','edu','law']]],
    US:[['harvard','Harvard University','Cambridge, Massachusetts',28,['it','eco','med','edu','law']],['mit','Massachusetts Institute of Technology (MIT)','Cambridge, Massachusetts',28,['it','eco']],['stanford','Stanford University','Stanford, California',28,['it','eco','med','law']],['ucla','University of California, Los Angeles (UCLA)','Los Angeles',26,['it','eco','med','edu','law','art']]],
    JP:[['utokyo','University of Tokyo','Tokyo',27,['it','eco','med','edu','law']],['kyoto','Kyoto University','Kyoto',26,['it','eco','med','edu','law']]],
    KR:[['snu','Seoul National University','Seoul',27,['it','eco','med','edu']],['yonsei','Yonsei University','Seoul',26,['it','eco','med','edu']]],
    TH:[['chula','Chulalongkorn University','Bangkok',25,['it','eco','med','edu','law']]],
    CN:[['pku','Peking University','Beijing',27,['it','eco','med','law']],['tsinghua','Tsinghua University','Beijing',27,['it','eco','law']]]
  };
  G.W.C.forEach(function(c){if(c.code==='VN')return;var rows=(WORLD_SCHOOLS[c.code]||[]).concat([['public','Đại học công lập tại '+c.name,c.cities[0],21,['it','eco','edu']]]);
    rows.forEach(function(x){SCHOOLS.push({id:c.code+'_'+x[0],name:x[1],country:c.code,region:'Trong nước',city:x[2],score:x[3],majors:x[4],world:true});});});
  function residence(l){return l.abroad&&l.abroad.code||l.country;}
  function interestMajor(l){var b=E.WORLD120&&E.WORLD120.p(l).firstObject846;return b&&({ong:'med',but:'edu',sach:'edu',tien:'eco',computer846:'it',gach:'it',train846:'it',gavel846:'law',brush846:'art',mic:'art',nhac:'art',camera846:'art',dance846:'art',mask846:'art',fashion846:'art'})[b.key]||null;}
  function localSchools(l){var interest=interestMajor(l);return SCHOOLS.filter(function(u){return (u.country||'VN')===residence(l);}).sort(function(a,b){return Number(b.majors.includes(interest))-Number(a.majors.includes(interest));});}
  function academicFree(l){return l.alive&&['vn','world'].includes(l.mode)&&E.FAMILY53.free(l);}
  function state(l){return l.flags.study54||(l.flags.study54={records:{},wishes:[]});}
  function free(l){return l.alive&&(l.abroad&&l.abroad.code||l.country)==='VN'&&!(l.jailUntil!=null&&l.age<l.jailUntil)&&!(l.flags.military&&l.age<l.flags.military)&&!(l.abroad&&l.abroad.trapped);}
  function pupil(l){return free(l)&&l.age>=9&&l.age<18&&['primary','lower','upper','priv'].indexOf(l.school)>=0;}
  function applicant(l){return academicFree(l)&&l.age>=18&&l.edu>=3&&!l.school&&!l.retired;}
  function school(id){return SCHOOLS.filter(function(x){return x.id===id;})[0];}
  var PROGRAMS={it:['Công nghệ thông tin','Kỹ thuật phần mềm','Kỹ thuật điện – điện tử','Kỹ thuật cơ khí'],eco:['Quản trị kinh doanh','Tài chính – Ngân hàng','Kế toán','Kinh tế quốc tế'],med:['Y khoa','Y học dự phòng','Điều dưỡng'],edu:['Sư phạm Toán','Sư phạm Ngữ văn','Sư phạm Tiếng Anh'],law:['Luật','Luật kinh tế','Luật quốc tế'],art:['Mỹ thuật','Thiết kế đồ họa','Nghệ thuật học']};
  // Course identities are separate from the game's admission thresholds.
  var COURSE_REFERENCES871 = {
    hcmus: {year:2025,source:'https://hcmus.edu.vn/chuong-trinh-dao-tao-trinh-do-dai-hoc-khoa-2025/',courses:[['major_it','it','Công nghệ thông tin'],['program_it_1','it','Kỹ thuật phần mềm'],['program_it_2','it','Khoa học máy tính'],['program_it_3','it','Hệ thống thông tin'],['program_it_4','it','Trí tuệ nhân tạo'],['program_it_5','it','Khoa học dữ liệu']]},
    hust: {year:2026,source:'https://hust.edu.vn/uploads/sys/tuyen-sinh/2026_05/danh-muc-chuong-trinh-dao-tao-2026.pdf',courses:[['major_it','it','CNTT: Khoa học Máy tính'],['program_it_1','it','CNTT: Kỹ thuật Máy tính'],['program_it_2','it','Kỹ thuật điện'],['program_it_3','it','Kỹ thuật Cơ khí'],['program_it_4','it','Kỹ thuật Điện tử - Viễn thông'],['program_it_5','it','Kỹ thuật điều khiển & Tự động hóa'],['program_it_6','it','Kỹ thuật Cơ điện tử']]},
    huey: {year:2026,source:'https://huemed-univ.edu.vn/uploads/Thongbao/TTTS2026N5_988.pdf',courses:[['major_med','med','Y khoa'],['program_med_1','med','Y học dự phòng'],['program_med_2','med','Điều dưỡng'],['program_med_3','med','Dược học'],['program_med_4','med','Y học cổ truyền'],['program_med_5','med','Răng - Hàm - Mặt']]},
    hus: {source:'https://tuyensinh.hus.vnu.edu.vn/dai-hoc',courses:[['major_it','it','Khoa học máy tính và thông tin']]},
    uit: {year:2025,source:'https://student.uit.edu.vn/cqui/ctdt-khoa-2025',courses:[['major_it','it','Công nghệ thông tin'],['program_it_1','it','Kỹ thuật phần mềm'],['program_it_2','it','Khoa học máy tính'],['program_it_3','it','Hệ thống thông tin'],['program_it_4','it','Trí tuệ nhân tạo'],['program_it_5','it','Kỹ thuật máy tính'],['program_it_6','it','An toàn thông tin'],['program_it_7','it','Khoa học dữ liệu']]},
    uet: {year:2025,source:'https://tuyensinh.uet.vnu.edu.vn/wp-content/images/Thong-tin-tuyen-sinh-DHCQ-nam-2025-QHI.pdf',courses:[['major_it','it','Công nghệ thông tin'],['program_it_2','it','Khoa học máy tính']]}
  };
  function programs(u){var ref=COURSE_REFERENCES871[u.id];if(ref)return ref.courses.map(function(c){return {key:c[0],major:c[1],name:c[2],source:ref.source,referenceYear:ref.year||null};});if(u.world)return u.majors.map(function(m){return {key:'major_'+m,major:m,name:u.id==='US_harvard'&&m==='law'?'Juris Doctor (J.D.)':/^US_(harvard|ucla)$/.test(u.id)&&m==='med'?'Doctor of Medicine (MD)':E.MAJORS[m]};});if(u.nk)return u.majors.map(function(m){return {key:'major_'+m,major:m,name:u.mn||E.MAJORS[m]};});return u.majors.reduce(function(a,m){return a.concat((m==='it'&&/^(uit|uet|hcmus|hus)$/.test(u.id)?['Công nghệ thông tin','Kỹ thuật phần mềm','Khoa học máy tính','Hệ thống thông tin']:PROGRAMS[m]||[E.MAJORS[m]]).map(function(n,i){return {key:i?'program_'+m+'_'+i:'major_'+m,major:m,name:n};}));},[]);}
  function option(k,l,h){return{k:k,l:l,h:h||''};}
  function push(l,id,r){l.pending.unshift(E.DEC[id].make(l,r));}
  function same(l,d,kind){var s=state(l);return d&&d.at===l.age&&d.serial===s.serial&&(!kind||s.kind===kind);}
  function start(l,kind){var s=state(l);s.serial=(s.serial||0)+1;s.kind=kind;return s;}
  function stamp(l){return{at:l.age,serial:state(l).serial};}
  function readyContest(l){return pupil(l)&&state(l).contestYear!==l.age;}
  function rank(l,subject){return state(l).records[subject]||0;}
  function high(l){return l.age>=15&&(l.school==='upper'||l.school==='priv');}
  function tier(l,subject){var n=rank(l,subject);return !high(l)?Math.min(n,1):Math.min(n,OLYMPIC.indexOf(subject)>=0?4:2);}
  var LEVELS=['Đội tuyển trường','Học sinh giỏi tỉnh / thành phố','Học sinh giỏi quốc gia','Tuyển chọn đội tuyển Olympic','Olympic quốc tế'];
  function contestValid(l,d){return pupil(l)&&same(l,d,'contest')&&state(l).contestYear===l.age;}
  E.DEC.study_team54={valid:function(l,d){return readyContest(l)&&(!d||same(l,d,'choose'));},make:function(l){return{id:'study_team54',title:'Chọn môn đội tuyển',text:'Chọn một môn để thử sức trong năm nay. Thành tích trước giúp bạn tiến lên vòng cao hơn.',data:stamp(l),opts:Object.keys(SUBJECTS).map(function(k){return option(k,SUBJECTS[k],LEVELS[tier(l,k)]);}).concat([option('no','Để năm sau')])};},auto:function(l,d,r){return U.pick(r,Object.keys(SUBJECTS));},apply:function(l,d,k,r,log){if(!this.valid(l,d.data)||!d.opts.some(function(o){return o.k===k;}))return;if(k==='no')return;var s=state(l);s.kind='contest';s.subject=k;s.stage='train';s.contestYear=l.age;s.level=tier(l,k);s.prep=0;push(l,'study_contest54',r);}};
  E.DEC.study_contest54={valid:contestValid,make:function(l){var s=state(l),train=s.stage==='train';return{id:'study_contest54',title:train?'Lịch ôn đội tuyển · '+SUBJECTS[s.subject]:LEVELS[s.level]+' · '+SUBJECTS[s.subject],text:train?'Bạn muốn chuẩn bị thế nào?':s.level===3?'Bạn làm bài tuyển chọn để giành suất vào đội tuyển quốc gia.':'Buổi thi bắt đầu. Bạn chọn cách làm bài.',data:Object.assign(stamp(l),{stage:s.stage,level:s.level}),opts:train?[option('steady','Ôn đều, giữ giấc ngủ'),option('intense','Luyện đề chuyên sâu','Tiến bộ nhanh hơn, dễ căng thẳng'),option('group','Học nhóm với bạn đội tuyển'),option('stop','Rút khỏi đội tuyển')]:[option('careful','Làm chắc phần nền tảng'),option('hard','Ưu tiên bài khó','Khó hơn, có thể tạo khác biệt'),option('check','Phân bổ thời gian, kiểm tra bài')]};},auto:function(l,d){return state(l).stage==='train'?'steady':'check';},apply:function(l,d,k,r,log){var s=state(l);if(!contestValid(l,d.data)||d.data.stage!==s.stage||d.data.level!==s.level||!d.opts.some(function(o){return o.k===k;}))return;
    if(s.stage==='train'){if(k==='stop'){s.kind=null;log('Bạn rút khỏi đội tuyển năm nay để giữ sức học chính khóa.','neutral');return;}s.prep=k==='intense'?9:k==='group'?7:6;H.fx(l,{kno:k==='intense'?3:2,hap:k==='intense'?-2:1});if(l.mind)l.mind.stress=U.clamp(l.mind.stress+(k==='intense'?8:-2),0,100);s.stage='exam';push(l,'study_contest54',r);return;}
    var thresholds=[57,70,84,104,110],power=l.st.kno+s.prep+(k==='check'?2:k==='hard'?(r()<.45?6:-6):1)+(r()-.5)*12-(l.mind&&l.mind.stress>80?5:0),pass=power>=thresholds[s.level];
    if(pass){var award=power>=thresholds[s.level]+10?'giải Nhất':power>=thresholds[s.level]+5?'giải Nhì':'giải Ba';if(s.level===3)award='suất vào đội tuyển Olympic';if(s.level===4)award=power>=117?'huy chương Vàng':power>=113?'huy chương Bạc':'huy chương Đồng';
      log(SUBJECTS[s.subject]+': đạt '+award+' · '+LEVELS[s.level]+'.','big');H.mem(l,SUBJECTS[s.subject]+' · '+award+' · '+LEVELS[s.level]+'.',4);s.records[s.subject]=Math.max(rank(l,s.subject),s.level+1);H.fx(l,{hap:5});
      if(s.level<4&&high(l)&&(s.level<2||OLYMPIC.indexOf(s.subject)>=0)){s.level++;s.stage='train';push(l,'study_contest54',r);return;}
    }else{log('Chưa đạt yêu cầu '+LEVELS[s.level]+' môn '+SUBJECTS[s.subject]+'. Bạn nhận lại bài để rút kinh nghiệm.','neutral');H.fx(l,{kno:1});}s.kind=null;
  }};
  E.SC('doi_tuyen54',{title:'Thử sức đội tuyển học sinh giỏi',valid:readyContest,text:'Thầy cô mở đợt tuyển đội học sinh giỏi. Bạn muốn chọn môn để ôn luyện?',opts:[{k:'yes',l:'Chọn môn tham gia',run:function(l,r){if(readyContest(l)){start(l,'choose');push(l,'study_team54',r);}}},{k:'no',l:'Tập trung học chính khóa',run:function(){}}]});
  E.ACT.push({id:'doi_tuyen54',g:'Học tập',l:'Đội tuyển học sinh giỏi',min:9,max:17,avail:function(l){return readyContest(l)?true:'Cần đang đi học ở Việt Nam; mỗi năm một môn';},ai:{w:.2}});
  E.EVENTS.push({c:function(l){return readyContest(l)&&l.age>=15&&l.st.kno>=70&&state(l).offerYear!==l.age;},p:.45,run:function(l,a,r){state(l).offerYear=l.age;if(!l.pending.some(function(d){return /^(doi_tuyen54|study_team54|study_contest54)$/.test(d.id);}))push(l,'doi_tuyen54',r);}});
  // Sự kiện cũ dẫn vào cùng một lộ trình, không tự cấp giải tỉnh ngay lập tức.
  var oldHsg=E.DEC.thi_hsg;oldHsg.valid=readyContest;oldHsg.apply=function(l,d,k,r){if(k==='yes'&&readyContest(l)){start(l,'choose');push(l,'study_team54',r);}};
  var hs=E.DEC.hs,hm=hs.make,ha=hs.apply;
  hs.make=function(l){var d=hm.apply(this,arguments);if(free(l)&&l.age===15)d.opts.unshift(option('special54','Ôn thi chuyên tại địa phương','Chọn môn chuyên · có phương án trường thường nếu chưa đỗ'));return d;};
  hs.apply=function(l,d,k,r,log){if(k==='special54'){if(!free(l)||l.age!==15||!d.opts.some(function(o){return o.k===k;}))return;start(l,'special');state(l).hsFallback=d;push(l,'study_special54',r);return;}return ha.apply(this,arguments);};
  E.DEC.study_special54={valid:function(l,d){return free(l)&&l.age===15&&same(l,d,'special')&&l.school!=='voc'&&!state(l).specialDone;},make:function(l){return{id:'study_special54',title:'Thi vào THPT chuyên',text:'Đăng ký môn chuyên tại địa phương. Kết quả phụ thuộc học lực, quá trình ôn tập và bài thi.',data:stamp(l),opts:Object.keys(SUBJECTS).map(function(k){return option(k,'Chuyên '+SUBJECTS[k]);}).concat([option('regular','Chọn trường THPT thường')])};},auto:function(){return 'math';},apply:function(l,d,k,r,log){if(!this.valid(l,d.data)||!d.opts.some(function(o){return o.k===k;}))return;var s=state(l);s.specialDone=true;if(k!=='regular'&&(E.specialExam853?E.specialExam853(l,k)>=7.8:l.st.kno+rank(l,k)*3+(r()-.5)*10>=78)){s.special={subject:k,name:'THPT chuyên tại '+(l.provLabel||(l.prov&&(l.prov.neu||l.prov.old))||l.city||'địa phương'),since:l.age};l.school='upper';l.schoolEnd=18;log('Đỗ lớp chuyên '+SUBJECTS[k]+' · '+s.special.name+'.','big');H.mem(l,'Ngày đỗ lớp chuyên '+SUBJECTS[k]+'.',4);}else{if(k!=='regular')log('Chưa đỗ lớp chuyên; xét tiếp nguyện vọng THPT thường.','neutral');ha.call(hs,l,s.hsFallback,'thpt',r,log);}delete s.hsFallback;s.kind=null;}};
  function wishes(l){return state(l).wishes;}
  function threshold(s,m){return Math.min(29.5,s.score+(m==='it'?.5:0));}
  function direct(l,m){if(residence(l)!=='VN')return false;var eligible={it:['math','physics','it','chem'],eco:['math','english'],med:['bio','chem'],edu:Object.keys(SUBJECTS),law:['lit','history','english'],art:['lit','history']};return (eligible[m]||[]).some(function(k){return rank(l,k)>=3;});}
  function choiceText(x){var u=school(x.school);return u.name+' · '+(x.program||E.MAJORS[x.major]);}
  function wishValid(l,d){return applicant(l)&&same(l,d,'wishes')&&(!d.country||d.country===residence(l))&&!state(l).submitted;}
  function openWishes(l,r){var s=start(l,'wishes');if(s.wishAge!==l.age){s.wishes=[];s.wishAge=l.age;s.submitted=false;}s.wishes=s.wishes.filter(function(w){return localSchools(l).some(function(u){return u.id===w.school;});});s.region=null;s.selected=null;push(l,'study_wishes54',r);}
  E.DEC.study_wishes54={valid:wishValid,make:function(l){var s=state(l),os=[];if(s.selected){var u=school(s.selected);os=(u&&localSchools(l).includes(u)?programs(u):[]).map(function(p){return option(p.key,p.name,'Điểm mục tiêu '+threshold(u,p.major)+'/30'+(direct(l,p.major)?' · đủ thành tích xét tuyển thẳng phù hợp':''));});os.push(option('back','Quay lại danh sách trường'));}
    else if(s.region){os=localSchools(l).filter(function(x){return x.region===s.region;}).map(function(x){return option('school_'+x.id,x.name,x.city+(interestMajor(l)&&x.majors.includes(interestMajor(l))?' · có ngành hợp hướng quan tâm':''));});os.push(option('back','Đổi khu vực'));}
    else{if(s.wishes.length<5)(residence(l)==='VN'?['Bắc','Trung','Nam']:['Trong nước']).forEach(function(x){os.push(option('region_'+x,'Thêm nguyện vọng · '+x));});s.wishes.forEach(function(x,i){os.push(option('remove_'+i,'Bỏ NV'+(i+1)+': '+choiceText(x),'Có thể thêm lại ở cuối danh sách'));});if(s.wishes.length)os.push(option('submit','Nộp danh sách '+s.wishes.length+' nguyện vọng'));os.push(option('cancel','Quay lại ngã rẽ sau phổ thông'));}
    return{id:'study_wishes54',title:'Nguyện vọng đại học · '+G.W.BY[residence(l)].name,text:(s.wishes.length?s.wishes.map(function(x,i){return 'NV'+(i+1)+': '+choiceText(x);}).join('; '):'Chưa có nguyện vọng')+'. Chọn tối đa 5 trường/ngành theo thứ tự yêu thích. Xét nguyện vọng đầu tiên đủ điểm; điểm mục tiêu cần đối chiếu theo ngành và kỳ tuyển sinh.',data:Object.assign(stamp(l),{country:residence(l),view:s.selected||s.region||'list'}),opts:os};},auto:function(l,d,r){var s=state(l);if(d.opts.some(function(o){return o.k==='submit';}))return 'submit';if(s.selected){var u=school(s.selected);return 'major_'+u.majors[0];}if(s.region){var candidates=localSchools(l).filter(function(x){return x.region===s.region;});var score=Number.isFinite(l.examScore)?l.examScore:(E.MOCK_EXAM853?E.MOCK_EXAM853.estimateUniExam853(l).expected30:20);return 'school_'+(candidates.filter(function(x){return threshold(x,x.majors[0])<=score;})[0]||candidates[candidates.length-1]).id;}return 'region_'+U.pick(r,residence(l)==='VN'?['Bắc','Trung','Nam']:['Trong nước']);},apply:function(l,d,k,r,log){var s=state(l);if(!wishValid(l,d.data)||d.data.view!==(s.selected||s.region||'list')||!d.opts.some(function(o){return o.k===k;}))return;
    if(k==='cancel'){s.kind=null;push(l,'uni',r);return;}if(k==='back'){if(s.selected)s.selected=null;else s.region=null;}
    else if(k.indexOf('region_')===0)s.region=k.slice(7);
    else if(k.indexOf('school_')===0)s.selected=k.slice(7);
    else if(k.indexOf('major_')===0||k.indexOf('program_')===0){var u=school(s.selected),p=u&&programs(u).filter(function(x){return x.key===k;})[0];if(s.wishes.length>=5||!p)return;if(!s.wishes.some(function(x){return x.school===u.id&&x.major===p.major&&(x.program||PROGRAMS[p.major][0])===p.name;}))s.wishes.push({school:u.id,major:p.major,program:p.name});s.selected=null;s.region=null;}
    else if(k.indexOf('remove_')===0)s.wishes.splice(+k.slice(7),1);
    else if(k==='submit'){if(!s.wishes.length||s.wishes.some(function(w){return !localSchools(l).some(function(u){return u.id===w.school&&u.majors.includes(w.major);});}))return;s.submitted=true;s.kind=null;if(!Number.isFinite(l.examScore)){l.examScore=E.rollExamScore(l,r);if(l.examScore>=27)l.flags.scholar=true;}var found=s.wishes.filter(function(x){return l.examScore>=threshold(school(x.school),x.major)||direct(l,x.major);})[0];
      log('Điểm xét tuyển: '+U.fmtNum(l.examScore,2)+'/30.','neutral');if(!found){log('Chưa đạt các nguyện vọng đã nộp. Bạn có thể ôn thi lại, học nghề hoặc đi làm.','neutral');push(l,'uniFail',r);return;}
      var admitted=school(found.school);s.admitted={school:found.school,major:found.major,program:found.program,age:l.age};l.uniName=admitted.name;l.uniCity=admitted.city;l.uniTier=admitted.score>=25?1.15:1;l.cityStudent={city:admitted.city,since:l.age};E.DEC.major.apply(l,E.DEC.major.make(l),found.major,r,log);if(found.program)l.majorName=found.program;log('Trúng tuyển NV'+(s.wishes.indexOf(found)+1)+': '+choiceText(found)+(direct(l,found.major)?' · xét thành tích học sinh giỏi.':'.'),'big');H.mem(l,'Nhập học '+choiceText(found)+'.',4);return;}
    push(l,'study_wishes54',r);
  }};
  var uni=E.DEC.uni,um=uni.make,ua=uni.apply,auto=uni.auto;
  uni.make=function(l){var d=um.apply(this,arguments);if(applicant(l)){d.opts=d.opts.filter(function(o){return o.k!=='uni_big'&&o.k!=='uni_local';});d.opts.unshift(option('wishes54','Đăng ký nguyện vọng đại học · '+G.W.BY[residence(l)].name,'Chọn trường, ngành và thứ tự ưu tiên'));}return d;};
  uni.auto=function(l,d,r){if(!d.opts.some(function(o){return o.k==='wishes54';}))return auto.apply(this,arguments);var legacy=Object.assign({},d,{opts:d.opts.filter(function(o){return o.k!=='wishes54';}).concat([option('uni_big',''),option('uni_local','')])}),k=auto.call(this,l,legacy,r);return k==='uni_big'||k==='uni_local'?'wishes54':k;};
  uni.apply=function(l,d,k,r){if(k==='wishes54'){if(applicant(l)&&d.opts.some(function(o){return o.k===k;}))openWishes(l,r);return;}return ua.apply(this,arguments);};
  // Leaving a school picker must never choose employment or abandon a course.
  var safeWishMake872=E.DEC.study_wishes54.make,safeWishApply872=E.DEC.study_wishes54.apply;
  E.DEC.study_wishes54.make=function(l){var d=safeWishMake872.apply(this,arguments);d.opts=d.opts.filter(function(o){return o.k!=='cancel';});d.opts.push(option('cancel','Đóng danh sách nguyện vọng','Giữ nguyên chương trình, bằng cấp và công việc hiện có'));return d;};
  E.DEC.study_wishes54.apply=function(l,d,k){if(k==='cancel'){if(!d.opts.some(function(o){return o.k==='cancel';}))return;state(l).kind=null;return;}return safeWishApply872.apply(this,arguments);};
  var safeUniMake872=uni.make,safeUniApply872=uni.apply;
  uni.make=function(l){var app=state(l).ukApplication872;if(residence(l)==='GB'&&app&&['submitted','offer'].includes(app.stage))return {id:'uni',title:'Hồ sơ đại học đang xét',text:'Bạn đã có hồ sơ đang chờ. Theo dõi kết quả và xác nhận nhập học ở bước riêng; không mở lại ngã rẽ sau phổ thông.',opts:[option('trackUK872','Theo dõi hồ sơ đại học tại Anh'),option('close872','Đóng')]};if(l.school==='uni'||l.school==='abroad')return {id:'uni',title:'Chương trình đại học đang học',text:'Bạn đang học '+(l.majorName||E.MAJORS[l.major]||'đại học')+'. Mở tiến độ để xem điều kiện còn thiếu; đóng cửa sổ sẽ giữ nguyên việc học.',opts:[option('progress872','Xem tiến độ và điều kiện tốt nghiệp'),option('close872','Đóng')]};if(l.school==='post'||l.school==='phd')return {id:'uni',title:'Chương trình đang học',text:'Bạn đang học sau đại học. Đóng cửa sổ để tiếp tục; bằng đã có và chương trình hiện tại được giữ nguyên.',opts:[option('close872','Đóng')]};if(l.edu>=5)return {id:'uni',title:'Hướng tiếp theo sau tốt nghiệp',text:'Bạn đã có bằng '+(l.majorName||E.MAJORS[l.major]||'đại học')+'. Bạn có thể tìm việc đúng chuyên môn hoặc chủ động đăng ký một chương trình khác. Đóng menu giữ nguyên bằng cấp.',opts:(l.major==='med'?[option('medical872','Xem lộ trình việc làm ngành Y')]:[option('work','Tìm việc theo bằng cấp hiện có')]).concat([option('wishes54','Đăng ký thêm một chương trình đại học'),option('close872','Đóng')])};var d=safeUniMake872.apply(this,arguments);d.opts.push(option('close872','Đóng'));return d;};
  uni.apply=function(l,d,k,r,log){if(k==='close872')return;var app=state(l).ukApplication872;if(residence(l)==='GB'&&app&&['submitted','offer'].includes(app.stage)){if(k==='trackUK872')push(l,'ukApplication872',r);return;}if(l.school==='uni'||l.school==='abroad'){if(k==='progress872')push(l,'studyReview136',r);return;}if(l.school==='post'||l.school==='phd')return;if(l.edu>=5){if(!d.opts.some(function(o){return o.k===k;}))return;if(k==='medical872'){push(l,'medicalCareer872',r);return;}if(k==='work'){push(l,'job',r);return;}if(k!=='wishes54')return;}return safeUniApply872.apply(this,arguments);};
  // Nguyện vọng Y khoa đã chọn rõ ngành, không đổi sang Quân y hoặc trường khác sau nhập học.
  var med=E.DEC.nganh_y,mm=med.make,ma=med.apply,mt=med.auto;
  function namedMed(l){var a=state(l).admitted;return a&&a.age<=l.age&&a.major==='med'&&l.school==='uni';}
  E.MED_TRACK.ydp={n:'Y học dự phòng',y:6,job:'bac_si',spec:'ydp',d:'6 năm · Y học dự phòng'};E.MED_SPEC.ydp=['Y học dự phòng',1,0];
  function namedMedTrack(l){var a=state(l).admitted,p=a&&a.program||'';return /Điều dưỡng/i.test(p)?'dd':/Y học dự phòng/i.test(p)?'ydp':/Dược học/i.test(p)?'duoc':/Y học cổ truyền/i.test(p)?'yhct':/Răng.*Hàm.*Mặt/i.test(p)?'rhm':'dk';}
  function namedMedYears(l,key){var a=state(l).admitted;return a&&a.degree872&&a.degree872.years|| (key==='dk'&&a&&a.school==='GB_manchester'?5:E.MED_TRACK[key].y);}
  med.make=function(l){var d=mm.apply(this,arguments);if(namedMed(l)){var key=namedMedTrack(l),t=E.MED_TRACK[key],years=namedMedYears(l,key);d.data=d.data||{};d.data.namedProgramme867={at:l.age,school:state(l).admitted.school,program:state(l).admitted.program||''};d.text='Xác nhận chương trình '+t.n+' tại '+l.uniName+' · '+years+' năm.';d.opts=[{k:key,l:t.n,h:years+' năm · giữ đúng trường và chương trình đã chọn'}];}return d;};
  med.auto=function(l){return namedMed(l)?namedMedTrack(l):mt.apply(this,arguments);};
  med.apply=function(l,d,k,r,log){if(!this.valid(l,d.data))return;var stamp=d.data&&d.data.namedProgramme867;if(stamp&&(stamp.done||stamp.at!==l.age||!namedMed(l)||stamp.school!==state(l).admitted.school||stamp.program!==(state(l).admitted.program||'')))return;if(!namedMed(l))return ma.apply(this,arguments);var key=namedMedTrack(l),t=E.MED_TRACK[key],years=namedMedYears(l,key),a=state(l).admitted;if(k!==key||!d.opts.some(function(o){return o.k===k;})||l.med&&l.med.admission867===a.school+':'+(a.program||''))return;l.med={track:key,spec:t.spec||null,admission867:a.school+':'+(a.program||'')};l.majorName=a.degree872?a.degree872.name:t.n;l.schoolEnd=Math.max(a.age+years,l.age+1);if(stamp)stamp.done=true;if(l.abroad&&l.abroad.study)l.abroad.until=l.schoolEnd;log('Xác nhận học '+t.n+' tại '+l.uniName+' · '+years+' năm.','good');};
  var migrateMed867=E.migrateExt;E.migrateExt=function(l){if(migrateMed867)migrateMed867.apply(this,arguments);if(!l||!l.flags||!namedMed(l))return;(l.pending||[]).forEach(function(d){if(d.id!=='nganh_y'||d.data&&d.data.namedProgramme867)return;var fresh=med.make(l,function(){return .5;});d.title=fresh.title;d.text=fresh.text;d.opts=fresh.opts;d.data=Object.assign({},d.data||{},fresh.data||{});});};
  E.EDUCATION54={state:state,schools:SCHOOLS,courseReferences:COURSE_REFERENCES871,programs:programs,localSchools:localSchools,subjects:SUBJECTS,pupil:pupil,applicant:applicant,tier:tier,direct:direct,threshold:threshold,open:openWishes};
})(G);
