/* Long courses and successor placements attach to existing family/NPC and company records. */
(function(G){'use strict';var E=G.E,H=E.H,X=E.UPDATE110,C=E.WORLD120,T=E.TREASURY165,B=E.BUSINESS123,R=E.BUSINESS133;
var fields={management:'Quản trị',finance:'Tài chính',investment:'Đầu tư',startup:'Khởi nghiệp',leadership:'Lãnh đạo',communication:'Giao tiếp',language:'Ngoại ngữ',acting:'Diễn xuất',music:'Âm nhạc',image:'Hình ảnh cá nhân',career:'Nghề nghiệp',wealth:'Quản lý tài sản',etiquette:'Nghi thức xã giao',heir_program:'Đào tạo người thừa kế toàn diện (10 năm)'};
var HEIR_FIELDS=['image','etiquette','communication','management','career','wealth','leadership'];
function usdAmount(l,usd){return l.cur==='usd'?usd:usd*25000;}
var programs={management:'Quản trị',business:'Kinh doanh',finance:'Tài chính',hr:'Nhân sự',technology:'Công nghệ',branch:'Chi nhánh',succession:'Đào tạo kế nhiệm'};
function learners(l){return [{id:'self',name:l.name,person:l,age:l.age}].concat(E.BUSINESS137.relatives(l).filter(function(p){return p.age>=6;}));}
function learner(l,id){return learners(l).find(function(x){return x.id===id;});}
function education(l,p){return p.education170||(p.education170={courses:[],skills:{},history:[]});}
function courses(l){return X.state(l).courses170||(X.state(l).courses170=[]);}

function enrollHeir(l,id,tierId,r){
  var target=learner(l,id);
  if(!target||target.id==='self'||target.age<8||l.age<18)return null;
  var e=education(l,target.person),list=courses(l);
  if(e.enrolledAt===l.age||list.some(function(k){return k.learner===id&&k.status==='active';}))return null;
  var usd=tierId==='heir5m'?5000000:1000000;
  var fee=usdAmount(l,usd);
  if(l.money<fee)return null;
  e.enrolledAt=l.age;
  if(r()>.9+(target.person.close||50)/500){
    e.history.push({age:l.age,field:'heir_program',status:'declined'});
    return null;
  }
  var mentor={
    name:H.stranger(l,r,r()<.5?'M':'F')+' (Viện cố vấn gia tộc)',
    skill:tierId==='heir5m'?.95:.85,
    specialty:'heir_program',
    birth:l.birthYear+l.age-50
  };
  X.uid(l,mentor);
  var k={
    id:l.id+':heir:'+X.uid(l,mentor),
    learner:id,
    name:target.name,
    field:'heir_program',
    tier:tierId,
    years:10,
    at:l.age,
    due:l.age+10,
    fee:fee,
    mentor:mentor,
    fit:.85+r()*.15,
    progress:0,
    status:'active',
    roll:r()
  };
  H.cash(l,-fee,'Đào tạo người thừa kế 10 năm ('+(tierId==='heir5m'?'5 triệu USD':'1 triệu USD')+')');
  list.push(k);
  e.courses.push(k.id);
  return k;
}

function enroll(l,id,field,years,r){var target=learner(l,id);if(!target||!fields[field]||![.5,1,2,3].includes(years)||l.age<18)return null;var e=education(l,target.person),list=courses(l);if(e.enrolledAt===l.age||list.some(function(k){return k.learner===id&&k.status==='active';}))return null;if(target.age<16&&!['language','acting','music','communication','etiquette'].includes(field))return null;var fee=l.base*(field==='management'||field==='wealth'?.8:.4)*years;if(l.money<fee+l.base*.5)return null;e.enrolledAt=l.age;if(id!=='self'&&r()>.5+(target.person.close||50)/250){e.history.push({age:l.age,field:field,status:'declined'});return null;}var mentor={name:H.stranger(l,r,r()<.5?'M':'F'),skill:.55+r()*.4,specialty:field,birth:l.birthYear+l.age-35-Math.floor(r()*20)};X.uid(l,mentor);var k={id:l.id+':course:'+X.uid(l,mentor),learner:id,name:target.name,field:field,years:years,at:l.age,due:l.age+Math.ceil(years),fee:fee,mentor:mentor,fit:.5+r()*.5,progress:0,status:'active',roll:r()};H.cash(l,-fee,'Học dài hạn: '+fields[field]);list.push(k);e.courses.push(k.id);return k;}
function gain(l,target,field,amount){var p=target.person,e=education(l,p),before=e.skills[field]||0;e.skills[field]=Math.min(100,before+amount);var actual=e.skills[field]-before;if(!actual)return;if(target.id==='self'){H.fx(l,{kno:['finance','investment','management','wealth','startup','career'].includes(field)?Math.min(2,actual):0,soc:['communication','etiquette','image','leadership'].includes(field)?Math.min(2,actual):0});if(['music','acting','language'].includes(field)){var s=E.LIFE138.skill(l,field==='music'?'sing':field);s.level=Math.min(100,s.level+actual);}}else{p.study=Math.min(100,(p.study||50)+Math.min(2,actual));if(['management','finance','leadership','career'].includes(field))B.companies(l).forEach(function(c){Object.keys(c.roles||{}).forEach(function(rid){var x=c.roles[rid];if(x.kind==='relative'&&E.NPC.same(l,x.personId,target.id))x.skill=Math.min(.95,x.skill+actual/500);});});}}
function courseYear(l,r,log){if(!l.alive)return;(l.kids||[]).forEach(function(p){if(!p.internship170)return;var c=B.companies(l).find(function(c){return X.uid(l,c)===p.internship170.cid&&!c.merged;});if(!c){delete p.internship170;return;}});courses(l).forEach(function(k){if(k.status!=='active'||k.lastAt===l.age||l.age<=k.at)return;var p=learner(l,k.learner);k.lastAt=l.age;if(!p||p.person.alive===false){k.status='ended';return;}k.progress=Math.min(k.years,l.age-k.at);
    if(k.field==='heir_program'){
      var currentField=HEIR_FIELDS[(k.progress-1)%HEIR_FIELDS.length];
      var yrGain=k.tier==='heir5m'?4:3;
      gain(l,p,currentField,yrGain);
      p.person.study=Math.min(100,(p.person.study||50)+2);
      if(k.progress<k.years){
        log(p.name+' hoàn thành năm '+k.progress+'/10 chương trình đào tạo người thừa kế toàn diện với '+k.mentor.name+' (rèn luyện '+fields[currentField]+').','neutral');
      }
    }
    if(l.age<k.due)return;
var success=k.roll<.4+k.mentor.skill*.35+k.fit*.2,amount=success?Math.max(1,Math.round(k.years*k.mentor.skill*k.fit*4)):0;gain(l,p,k.field,amount);k.gain=amount;k.status=success?'completed':'not-passed';
    k.finished=l.age;
    if(k.field==='heir_program'&&success){
      p.person.heirProgram170={completed:true,at:l.age,years:10,tier:k.tier};
      p.person.heirPosture=true;
      p.person.study=Math.max(p.person.study||50,92);
      HEIR_FIELDS.forEach(function(f){gain(l,p,f,k.tier==='heir5m'?15:10);});
      log(p.name+' đã hoàn thành xuất sắc 10 năm đào tạo người thừa kế toàn diện! Con toát lên phong thái đĩnh đạc của một người thừa kế, có uy tín xã hội cao, tinh thần trách nhiệm và năng suất làm việc vượt trội.','good');
      H.mem(l,'Ngày con '+p.name+' hoàn thành 10 năm đào tạo người thừa kế toàn diện của gia tộc.',5);
    }
education(l,p.person).history.push({id:k.id,age:l.age,field:k.field,status:k.status,gain:amount});log(p.name+' kết thúc khóa '+fields[k.field]+' với '+k.mentor.name+(success?'; kết quả đã được ghi vào hồ sơ.':'; chưa đạt đánh giá, không được cộng kỹ năng.'),'neutral');});}
function internships(c){return c.internships170||(c.internships170=[]);}
function apply(l,c,id,program,years,r){var p=E.BUSINESS137.relatives(l).find(function(p){return p.id===id&&(l.kids||[]).includes(p.person);});if(!p||p.age<18||p.age>35||c.share<=50||c.merged||!programs[program]||![2,3].includes(years))return null;var e=education(l,p.person);if(e.internAppliedAt===l.age||p.person.job||p.person.uniUntil||p.person.jail||E.CAREER147.roleOf(l,p.person)||B.companies(l).some(function(x){return internships(x).some(function(k){return k.person===id&&k.status==='active';});}))return null;var fee=l.base*.1;if(T.ensure(l,c).cash<fee+l.base*.5)return null;e.internAppliedAt=l.age;if(r()>.75+(p.person.close||50)/400){e.history.push({age:l.age,program:program,status:'declined'});return null;}if(!T.spend(l,c,fee,'Thiết lập chương trình thực tập'))return null;var k={id:X.uid(l,c)+':intern:'+id+':'+l.age,person:id,name:p.name,program:program,years:years,at:l.age,due:l.age+years,progress:0,status:'active',stipend:l.base*.25,score:0,history:[],rolls:Array.from({length:years},function(){return r();})};internships(c).push(k);p.person.internship170={cid:X.uid(l,c),id:k.id,company:c.name,program:program,years:years,at:l.age};return k;}
function reason(l,c,id){var p=E.BUSINESS137.relatives(l).find(function(p){return p.id===id&&(l.kids||[]).includes(p.person);});if(!p)return 'Không tìm thấy người con này.';if(p.age<18||p.age>35)return p.name+' cần từ 18 đến 35 tuổi để vào chương trình.';if(c.share<=50)return 'Bạn cần kiểm soát trên 50% công ty.';var e=education(l,p.person);if(e.internAppliedAt===l.age){var last=e.history[e.history.length-1];return last&&last.status==='declined'&&last.age===l.age?p.name+' đã từ chối lời mời thực tập năm nay; hãy thử lại năm sau.':'Đã xử lý hồ sơ thực tập của '+p.name+' trong năm nay.';}if(p.person.job)return p.name+' đang có công việc riêng.';if(p.person.uniUntil)return p.name+' đang học đại học.';if(p.person.jail)return p.name+' đang thụ án.';if(E.CAREER147.roleOf(l,p.person))return p.name+' đang giữ vị trí trong một công ty khác.';if(B.companies(l).some(function(x){return internships(x).some(function(k){return k.person===id&&k.status==='active';});}))return p.name+' đang thực tập tại một công ty.';if(T.ensure(l,c).cash<l.base*.6)return 'Quỹ công ty chưa đủ phí thiết lập và dự phòng.';return 'Chưa tiếp nhận được.';}
function describe(l,k){var s=k&&k.internship170;if(!s)return '';var c=B.companies(l).find(function(c){return X.uid(l,c)===s.cid&&!c.merged;}),it=c&&internships(c).find(function(x){return x.id===s.id;});return 'thực tập tại '+(c?c.name:s.company||'doanh nghiệp gia đình')+(it?' ('+(programs[it.program]||'')+' · năm '+Math.min(it.years,it.progress+1)+'/'+it.years+')':'');}
function internYear(l,c,r,log){internships(c).forEach(function(k){if(k.status!=='active'||k.lastAt===l.age||l.age<=k.at)return;k.lastAt=l.age;var p=E.BUSINESS137.relatives(l).find(function(p){return E.NPC.same(l,p.id,k.person);});if(!p||p.person.alive===false||c.merged){k.status='ended';return;}if(p.person.job||p.person.uniUntil||p.person.jail||E.CAREER147.roleOf(l,p.person)){k.status='left-for-job';delete p.person.internship170;return;}if(!T.spend(l,c,k.stipend,'Trợ cấp thực tập '+p.name)){k.status='funding-ended';delete p.person.internship170;return;}E.RELATIVE163.post(l,p.person,k.stipend,'Trợ cấp thực tập tại '+c.name,k.id+':'+l.age);var step=k.progress,skill=education(l,p.person).skills.management||0,passed=k.rolls[step]<.4+(p.person.study||50)/250+skill/500-step*.04;k.progress++;k.score+=passed?1:0;k.history.push({age:l.age,stage:k.progress,passed:passed,stipend:k.stipend});if(passed)gain(l,p,k.program==='technology'?'career':k.program==='hr'?'leadership':k.program==='business'?'communication':'management',2);if(k.progress<k.years)log(p.name+' hoàn thành năm thực tập '+k.progress+'/'+k.years+' tại '+c.name+(passed?', được đánh giá tốt.':', cần cố gắng hơn.')+' Trợ cấp '+H.money(l,k.stipend)+'.','neutral');if(k.progress>=k.years){k.status=k.score>=Math.ceil(k.years*.6)?'completed':'not-passed';k.finished=l.age;delete p.person.internship170;p.person.succession170={cid:X.uid(l,c),completed:k.status==='completed',at:l.age,score:k.score,years:k.years,experience:k.progress};log(p.name+' kết thúc '+k.years+' năm thực tập tại '+c.name+'. '+(k.status==='completed'?'Có thể xem xét bổ nhiệm, chưa tự nhận chức vụ.':'Cần thêm kinh nghiệm trước khi giao trách nhiệm.'),'neutral');}});}
X.menu('education170','Cố vấn riêng và khóa dài hạn',C.adult,'Chọn người học; người thân có thể từ chối. Học phí trả từ tiền cá nhân, không tự trích tiền công ty. Khóa 6 tháng được tổng kết tại bước sang năm của mô phỏng; không cộng kỹ năng lúc ký.',function(l){return learners(l).slice(0,45).map(function(p){return{k:p.id,l:p.name+' · '+p.age+' tuổi',run:function(l,r){C.queue(l,'educationField170',r,{id:p.id});}};});},18,'Học tập');
X.menu('educationField170','Chọn chuyên môn cố vấn',C.adult,function(l,d){var p=learner(l,d.arg.id);return p?p.name+' · '+courses(l).filter(function(k){return k.learner===p.id;}).slice(-5).map(function(k){return fields[k.field]+': '+({active:'Đang học',completed:'Hoàn thành','not-passed':'Chưa đạt',ended:'Đã dừng'})[k.status]+' '+k.progress+'/'+k.years+' năm · cố vấn '+k.mentor.name+' · năng lực '+Math.round(k.mentor.skill*100)+'/100 · phù hợp '+Math.round(k.fit*100)+'/100 · học phí '+H.money(l,k.fee);}).join('; '):'Người học không còn.';},function(l,a){
  var target=learner(l,a.id);
  var out=[];
  if(target&&target.id!=='self'&&target.age>=8){
    out.push({
      k:'heir_program',
      l:'👑 Đào tạo người thừa kế toàn diện (10 năm · từ 8 tuổi)',
      h:'Kèm cặp 7 chuyên môn cốt lõi: hình ảnh, nghi thức, giao tiếp, quản trị, kinh doanh, tài sản, lãnh đạo',
      run:function(l,r){C.queue(l,'educationHeirTerm170',r,{id:a.id});}
    });
  }
  Object.keys(fields).forEach(function(k){
    if(k==='heir_program')return;
    out.push({k:k,l:fields[k],run:function(l,r){C.queue(l,'educationTerm170',r,{id:a.id,field:k});}});
  });
  return out;
},18);
X.menu('educationTerm170','Thời hạn và học phí',C.adult,'Nội dung nghi thức gồm giao tiếp trang trọng, bàn ăn, chào hỏi, đối tác quốc tế, phát biểu và hình ảnh cá nhân. Học không tự tăng tài sản hay tầng lớp; kết quả phụ thuộc chuyên môn và mức phù hợp.',function(l,a){return [.5,1,2,3].map(function(years){var fee=l.base*(a.field==='management'||a.field==='wealth'?.8:.4)*years;return{k:String(years),l:(years===.5?'6 tháng':years+' năm')+' · '+H.money(l,fee),why:l.money>=fee+l.base*.5?true:'Thiếu học phí và dự phòng',run:function(l,r,log){log(enroll(l,a.id,a.field,years,r)?'Đã ký hợp đồng cố vấn; kết quả được đánh giá sau thời gian học.':'Chưa đăng ký: người học chưa sẵn sàng, đã học chương trình khác hoặc chưa đủ điều kiện.','neutral');}};});},18);

X.menu('educationHeirTerm170','Gói đào tạo người thừa kế 10 năm',C.adult,
  function(l,d){
    var target=learner(l,d.arg&&d.arg.id);
    return 'Người học: '+(target?target.name+' ('+target.age+' tuổi)':'')+'\n'+
           'Viện cố vấn gia tộc kèm cặp dài hạn 10 năm xuyên suốt 7 lĩnh vực: hình ảnh cá nhân, nghi thức xã giao, giao tiếp, quản trị, kinh doanh, quản lý tài sản và lãnh đạo.\n'+
           'Sau 10 năm hoàn thành, con cái sẽ toát lên phong thái người thừa kế, tạo dựng uy tín, sống có trách nhiệm và nâng cao năng suất điều hành.';
  },
  function(l,a){
    return [
      {
        k:'heir1m',
        l:'Gói Tinh hoa · 1 triệu USD ('+H.money(l,usdAmount(l,1000000))+')',
        h:'Cố vấn cao cấp đào tạo trọn gói 10 năm cả 7 chuyên môn cốt lõi',
        why:l.money>=usdAmount(l,1000000)?true:'Thiếu tiền học phí (Cần '+H.money(l,usdAmount(l,1000000))+')',
        run:function(l,r,log){
          var enrolled=enrollHeir(l,a.id,'heir1m',r);
          log(enrolled?'Đã ký hợp đồng cố vấn đào tạo người thừa kế 10 năm (Gói Tinh hoa). Cố vấn sẽ chủ động rèn luyện từng năm.':'Chưa đăng ký được: người học chưa sẵn sàng hoặc đã có chương trình đang học.','neutral');
        }
      },
      {
        k:'heir5m',
        l:'Gói Gia tộc Thượng lưu · 5 triệu USD ('+H.money(l,usdAmount(l,5000000))+')',
        h:'Viện cố vấn gia tộc quốc tế hàng đầu kèm cặp, phong thái và uy tín thừa kế tối đa',
        why:l.money>=usdAmount(l,5000000)?true:'Thiếu tiền học phí (Cần '+H.money(l,usdAmount(l,5000000))+')',
        run:function(l,r,log){
          var enrolled=enrollHeir(l,a.id,'heir5m',r);
          log(enrolled?'Đã ký hợp đồng cố vấn gia tộc 10 năm (Gói Gia tộc Thượng lưu). Cố vấn sẽ chủ động rèn luyện toàn diện cả 7 chuyên môn.':'Chưa đăng ký được: người học chưa sẵn sàng hoặc đã có chương trình đang học.','good');
        }
      }
    ];
  },18
);

X.menu('companyIntern170','Thực tập kế nghiệp',C.adult,function(l,d){var c=T.find(l,d.arg||{});return 'Con trưởng thành có thể chọn chương trình 2–3 năm nếu chưa có công việc không tương thích. Trợ cấp do công ty trả vào tài khoản riêng; hoàn thành không tự trở thành CEO. '+(c?internships(c).slice(-10).map(function(k){return k.name+': '+programs[k.program]+' · '+k.progress+'/'+k.years+' năm · '+({active:'Đang thực tập',completed:'Đạt đánh giá','not-passed':'Cần thêm kinh nghiệm',ended:'Đã kết thúc','left-for-job':'Đã chuyển công việc','funding-ended':'Thiếu ngân sách'})[k.status]+' · '+k.score+' đợt đạt yêu cầu';}).join('; '):'');},function(l,a){var c=T.find(l,a);if(!c)return [];return E.BUSINESS137.relatives(l).filter(function(p){return (l.kids||[]).includes(p.person)&&p.age>=18&&p.age<=35;}).slice(0,40).map(function(p){return{k:p.id,l:p.name+' · '+p.age+' tuổi',run:function(l,r){C.queue(l,'companyInternProgram170',r,{cid:a.cid,id:p.id});}};});},18);
X.menu('companyInternProgram170','Chọn lộ trình thực tập',C.adult,'Năm đầu học quy trình, năm hai làm dự án và quản lý nhóm, năm ba đánh giá kế nghiệp. Kết quả và tiền trợ cấp được ghi từng năm.',function(l,a){var c=T.find(l,a);if(!c)return [];var out=[];Object.keys(programs).forEach(function(k){[2,3].forEach(function(y){out.push({k:k+y,l:programs[k]+' · '+y+' năm · trợ cấp '+H.money(l,l.base*.25)+'/năm',run:function(l,r,log){var who=E.BUSINESS137.relatives(l).find(function(p){return p.id===a.id;}),made=apply(l,c,a.id,k,y,r);log(made?(who?who.name:'Con')+' bắt đầu thực tập '+y+' năm tại '+c.name+' ('+programs[k]+'). Mỗi năm có đánh giá và trợ cấp; chưa giao chức vụ lãnh đạo.':reason(l,c,a.id),made?'good':'neutral');}});});});return out;},18);
var rows=R.dealRows;R.dealRows=function(l,i){var out=rows.apply(this,arguments),c=B.companies(l)[i];if(c&&!c.merged)out.push({k:'intern170',l:'Chương trình thực tập kế nghiệp 2–3 năm',run:function(l,r){C.queue(l,'companyIntern170',r,{cid:X.uid(l,c)});}});return out;};
var oldTitle=E.kidTitle;E.kidTitle=function(k){return k&&k.internship170?'Thực tập sinh doanh nghiệp':oldTitle.apply(this,arguments);};
var facts=E.STANDING158.relativeFacts;E.STANDING158.relativeFacts=function(l,p,child){var out=facts.apply(this,arguments),e=p.education170;if(e){out.push(['Đào tạo dài hạn',e.history.filter(function(k){return k.status==='completed';}).map(function(k){return (fields[k.field]||k.program)+' · hoàn thành';}).join('; ')||'Chưa hoàn thành khóa']);out.push(['Kỹ năng chuyên môn',Object.keys(e.skills).map(function(k){return fields[k]+': '+e.skills[k]+'/100';}).join('; ')||'Chưa ghi nhận']);}if(p.heirProgram170)out.push(['Đào tạo thừa kế','Hoàn thành 10 năm toàn diện · Phong thái người thừa kế, uy tín và trách nhiệm cao']);
if(p.succession170)out.push(['Thực tập kế nghiệp',p.succession170.years+' năm · '+(p.succession170.completed?'đạt đánh giá':'cần thêm kinh nghiệm')]);if(p.internship170)out.push(['Đang thực tập',describe(l,p)]);return out;};
var heir=E.heirAtAge;E.heirAtAge=function(parent,k){var life=heir.apply(this,arguments);if(life&&k.education170){life.education170=JSON.parse(JSON.stringify(k.education170));var delta=life.age-parent.age;life.education170.history.forEach(function(h){h.age+=delta;});var originals=(parent.flags.expansion110&&parent.flags.expansion110.courses170||[]).filter(function(c){return E.NPC.same(parent,c.learner,X.uid(parent,k));});X.state(life).courses170=originals.map(function(c){var copy=JSON.parse(JSON.stringify(c));copy.learner='self';['at','due','lastAt','finished'].forEach(function(key){if(copy[key]!=null)copy[key]+=delta;});copy.fee*=life.base/parent.base;return copy;});}return life;};
function convert(l,f){courses(l).forEach(function(k){k.fee*=f;});}
E.HOOKS.year.push(courseYear);function merge(l,cs,target){target.internships170=cs.flatMap(function(c){return c.internships170||[];});target.internships170.forEach(function(k){var p=E.BUSINESS137.relatives(l).find(function(p){return E.NPC.same(l,p.id,k.person);});if(p&&p.person.internship170)p.person.internship170.cid=X.uid(l,target);});}
function scale(c,f){(c.internships170||[]).forEach(function(k){k.stipend*=f;k.history.forEach(function(h){h.stipend*=f;});});}
function shift(c,d){(c.internships170||[]).forEach(function(k){['at','due','lastAt','finished'].forEach(function(f){if(k[f]!=null)k[f]+=d;});k.history.forEach(function(h){h.age+=d;});});}
E.EDUCATION170={merge:merge,convert:convert,scale:scale,shift:shift,learners:learners,education:education,courses:courses,enroll:enroll,enrollHeir:enrollHeir,usdAmount:usdAmount,gain:gain,courseYear:courseYear,internships:internships,apply:apply,reason:reason,describe:describe,internYear:internYear,fields:fields,programs:programs};
})(globalThis.G);
