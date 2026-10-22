/* V5.4 — học chuyên, đội tuyển và nguyện vọng đại học. Điểm tuyển sinh là mô phỏng. */
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
  function state(l){return l.flags.study54||(l.flags.study54={records:{},wishes:[]});}
  function free(l){return l.alive&&(l.abroad&&l.abroad.code||l.country)==='VN'&&!(l.jailUntil!=null&&l.age<l.jailUntil)&&!(l.flags.military&&l.age<l.flags.military)&&!(l.abroad&&l.abroad.trapped);}
  function pupil(l){return free(l)&&l.age>=9&&l.age<18&&['primary','lower','upper','priv'].indexOf(l.school)>=0;}
  function applicant(l){return free(l)&&l.age>=18&&l.edu>=3&&!l.school&&!l.retired;}
  function school(id){return SCHOOLS.filter(function(x){return x.id===id;})[0];}
  var PROGRAMS={it:['Công nghệ thông tin','Kỹ thuật phần mềm','Kỹ thuật điện – điện tử','Kỹ thuật cơ khí'],eco:['Quản trị kinh doanh','Tài chính – Ngân hàng','Kế toán','Kinh tế quốc tế'],med:['Y khoa','Y học dự phòng','Điều dưỡng'],edu:['Sư phạm Toán','Sư phạm Ngữ văn','Sư phạm Tiếng Anh'],law:['Luật','Luật kinh tế','Luật quốc tế'],art:['Mỹ thuật','Thiết kế đồ họa','Nghệ thuật học']};
  function programs(u){if(u.nk)return u.majors.map(function(m){return {key:'major_'+m,major:m,name:u.mn||E.MAJORS[m]};});return u.majors.reduce(function(a,m){return a.concat((m==='it'&&/^(uit|uet|hcmus|hus)$/.test(u.id)?['Công nghệ thông tin','Kỹ thuật phần mềm','Khoa học máy tính','Hệ thống thông tin']:PROGRAMS[m]||[E.MAJORS[m]]).map(function(n,i){return {key:i?'program_'+m+'_'+i:'major_'+m,major:m,name:n};}));},[]);}
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
  hs.make=function(l){var d=hm.apply(this,arguments);if(free(l)&&l.age===15)d.opts.unshift(option('special54','Thi vào trường THPT chuyên','Chọn môn chuyên · có phương án trường thường nếu chưa đỗ'));return d;};
  hs.apply=function(l,d,k,r,log){if(k==='special54'){if(!free(l)||l.age!==15||!d.opts.some(function(o){return o.k===k;}))return;start(l,'special');state(l).hsFallback=d;push(l,'study_special54',r);return;}return ha.apply(this,arguments);};
  E.DEC.study_special54={valid:function(l,d){return free(l)&&l.age===15&&same(l,d,'special')&&l.school!=='voc'&&!state(l).specialDone;},make:function(l){return{id:'study_special54',title:'Thi vào THPT chuyên',text:'Đăng ký môn chuyên tại địa phương. Kết quả phụ thuộc học lực, quá trình ôn tập và bài thi.',data:stamp(l),opts:Object.keys(SUBJECTS).map(function(k){return option(k,'Chuyên '+SUBJECTS[k]);}).concat([option('regular','Chọn trường THPT thường')])};},auto:function(){return 'math';},apply:function(l,d,k,r,log){if(!this.valid(l,d.data)||!d.opts.some(function(o){return o.k===k;}))return;var s=state(l);s.specialDone=true;if(k!=='regular'&&l.st.kno+rank(l,k)*3+(r()-.5)*10>=78){s.special={subject:k,name:'THPT chuyên tại '+(l.provLabel||(l.prov&&(l.prov.neu||l.prov.old))||l.city||'địa phương'),since:l.age};l.school='upper';l.schoolEnd=18;log('Đỗ lớp chuyên '+SUBJECTS[k]+' · '+s.special.name+'.','big');H.mem(l,'Ngày đỗ lớp chuyên '+SUBJECTS[k]+'.',4);}else{if(k!=='regular')log('Chưa đỗ lớp chuyên; xét tiếp nguyện vọng THPT thường.','neutral');ha.call(hs,l,s.hsFallback,'thpt',r,log);}delete s.hsFallback;s.kind=null;}};
  function wishes(l){return state(l).wishes;}
  function threshold(s,m){return Math.min(29.5,s.score+(m==='it'?.5:0));}
  function direct(l,m){var eligible={it:['math','physics','it','chem'],eco:['math','english'],med:['bio','chem'],edu:Object.keys(SUBJECTS),law:['lit','history','english'],art:['lit','history']};return (eligible[m]||[]).some(function(k){return rank(l,k)>=3;});}
  function choiceText(x){var u=school(x.school);return u.name+' · '+(x.program||E.MAJORS[x.major]);}
  function wishValid(l,d){return applicant(l)&&same(l,d,'wishes')&&!state(l).submitted;}
  function openWishes(l,r){var s=start(l,'wishes');if(s.wishAge!==l.age){s.wishes=[];s.wishAge=l.age;s.submitted=false;}s.region=null;s.selected=null;push(l,'study_wishes54',r);}
  E.DEC.study_wishes54={valid:wishValid,make:function(l){var s=state(l),os=[];if(s.selected){var u=school(s.selected);os=programs(u).map(function(p){return option(p.key,p.name,'Mốc mô phỏng '+threshold(u,p.major)+'/30'+(direct(l,p.major)?' · đủ thành tích xét tuyển thẳng phù hợp':''));});os.push(option('back','Quay lại danh sách trường'));}
    else if(s.region){os=SCHOOLS.filter(function(x){return x.region===s.region;}).map(function(x){return option('school_'+x.id,x.name,x.city);});os.push(option('back','Đổi khu vực'));}
    else{if(s.wishes.length<5)['Bắc','Trung','Nam'].forEach(function(x){os.push(option('region_'+x,'Thêm nguyện vọng · miền '+x));});s.wishes.forEach(function(x,i){os.push(option('remove_'+i,'Bỏ NV'+(i+1)+': '+choiceText(x),'Có thể thêm lại ở cuối danh sách'));});if(s.wishes.length)os.push(option('submit','Nộp danh sách '+s.wishes.length+' nguyện vọng'));os.push(option('cancel','Quay lại ngã rẽ sau phổ thông'));}
    return{id:'study_wishes54',title:'Nguyện vọng đại học Việt Nam',text:(s.wishes.length?s.wishes.map(function(x,i){return 'NV'+(i+1)+': '+choiceText(x);}).join('; '):'Chưa có nguyện vọng')+'. Chọn tối đa 5 trường/ngành theo thứ tự yêu thích. Xét nguyện vọng đầu tiên đủ điểm; điểm trong game là mô phỏng.',data:Object.assign(stamp(l),{view:s.selected||s.region||'list'}),opts:os};},auto:function(l,d,r){var s=state(l);if(d.opts.some(function(o){return o.k==='submit';}))return 'submit';if(s.selected){var u=school(s.selected);return 'major_'+u.majors[0];}if(s.region){var candidates=SCHOOLS.filter(function(x){return x.region===s.region;});var score=Number.isFinite(l.examScore)?l.examScore:E.rollExamScore(l,r);return 'school_'+(candidates.filter(function(x){return threshold(x,x.majors[0])<=score;})[0]||candidates[candidates.length-1]).id;}return 'region_'+U.pick(r,['Bắc','Trung','Nam']);},apply:function(l,d,k,r,log){var s=state(l);if(!wishValid(l,d.data)||d.data.view!==(s.selected||s.region||'list')||!d.opts.some(function(o){return o.k===k;}))return;
    if(k==='cancel'){s.kind=null;push(l,'uni',r);return;}if(k==='back'){if(s.selected)s.selected=null;else s.region=null;}
    else if(k.indexOf('region_')===0)s.region=k.slice(7);
    else if(k.indexOf('school_')===0)s.selected=k.slice(7);
    else if(k.indexOf('major_')===0||k.indexOf('program_')===0){var u=school(s.selected),p=u&&programs(u).filter(function(x){return x.key===k;})[0];if(s.wishes.length>=5||!p)return;if(!s.wishes.some(function(x){return x.school===u.id&&x.major===p.major&&(x.program||PROGRAMS[p.major][0])===p.name;}))s.wishes.push({school:u.id,major:p.major,program:p.name});s.selected=null;s.region=null;}
    else if(k.indexOf('remove_')===0)s.wishes.splice(+k.slice(7),1);
    else if(k==='submit'){if(!s.wishes.length)return;s.submitted=true;s.kind=null;if(!Number.isFinite(l.examScore))l.examScore=E.rollExamScore(l,r);var found=s.wishes.filter(function(x){return l.examScore>=threshold(school(x.school),x.major)||direct(l,x.major);})[0];
      log('Điểm xét tuyển: '+U.fmtNum(l.examScore,2)+'/30.','neutral');if(!found){log('Chưa đạt các nguyện vọng đã nộp. Bạn có thể ôn thi lại, học nghề hoặc đi làm.','neutral');push(l,'uniFail',r);return;}
      var admitted=school(found.school);s.admitted={school:found.school,major:found.major,program:found.program,age:l.age};l.uniName=admitted.name;l.uniCity=admitted.city;l.uniTier=admitted.score>=25?1.15:1;l.cityStudent={city:admitted.city,since:l.age};E.DEC.major.apply(l,E.DEC.major.make(l),found.major,r,log);if(found.program)l.majorName=found.program;log('Trúng tuyển NV'+(s.wishes.indexOf(found)+1)+': '+choiceText(found)+(direct(l,found.major)?' · xét thành tích học sinh giỏi.':'.'),'big');H.mem(l,'Nhập học '+choiceText(found)+'.',4);return;}
    push(l,'study_wishes54',r);
  }};
  var uni=E.DEC.uni,um=uni.make,ua=uni.apply,auto=uni.auto;
  uni.make=function(l){var d=um.apply(this,arguments);if(applicant(l)){d.opts=d.opts.filter(function(o){return o.k!=='uni_big'&&o.k!=='uni_local';});d.opts.unshift(option('wishes54','Đăng ký nguyện vọng đại học Việt Nam','Chọn trường, ngành và thứ tự ưu tiên'));}return d;};
  uni.auto=function(l,d,r){if(!d.opts.some(function(o){return o.k==='wishes54';}))return auto.apply(this,arguments);var legacy=Object.assign({},d,{opts:d.opts.filter(function(o){return o.k!=='wishes54';}).concat([option('uni_big',''),option('uni_local','')])}),k=auto.call(this,l,legacy,r);return k==='uni_big'||k==='uni_local'?'wishes54':k;};
  uni.apply=function(l,d,k,r){if(k==='wishes54'){if(applicant(l)&&d.opts.some(function(o){return o.k===k;}))openWishes(l,r);return;}return ua.apply(this,arguments);};
  // Nguyện vọng Y khoa đã chọn rõ ngành, không đổi sang Quân y hoặc trường khác sau nhập học.
  var med=E.DEC.nganh_y,mm=med.make,ma=med.apply,mt=med.auto;
  function namedMed(l){var a=state(l).admitted;return a&&a.age===l.age&&a.major==='med'&&l.school==='uni';}
  med.make=function(l){var d=mm.apply(this,arguments);if(namedMed(l)){d.text='Xác nhận chương trình Y khoa tại '+l.uniName+'.';d.opts=d.opts.filter(function(o){return o.k==='dk';});}return d;};
  med.auto=function(l){return namedMed(l)?'dk':mt.apply(this,arguments);};
  med.apply=function(l,d,k,r,log){if(!namedMed(l))return ma.apply(this,arguments);if(k!=='dk'||!d.opts.some(function(o){return o.k===k;}))return;l.med={track:'dk',spec:null};l.majorName=E.MED_TRACK.dk.n;l.schoolEnd=l.age+6;log('Xác nhận học Y khoa tại '+l.uniName+' · 6 năm.','good');};
  E.EDUCATION54={state:state,schools:SCHOOLS,programs:programs,subjects:SUBJECTS,pupil:pupil,applicant:applicant,tier:tier,direct:direct,threshold:threshold,open:openWishes};
})(G);
