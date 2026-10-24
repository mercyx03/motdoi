/* Career opportunities and persistent, player-led follow-ups. */
(function(G){'use strict';var E=G.E,H=E.H,U=G.U;
var PATHS={
 'thể thao':{project:'Chương trình huấn luyện thể thao chuyên sâu',biz:'trung tâm huấn luyện thể thao',jobs:['vdv','pt_gym','hlv'],cap:1.5},
 'âm nhạc':{project:'Chỉ đạo âm nhạc và đào tạo nghệ sĩ',biz:'phòng thu và lớp âm nhạc',jobs:['ca_si','rapper','nhac_si'],cap:1.4},
 'hội họa':{project:'Triển lãm và dự án mỹ thuật đặt hàng',biz:'xưởng mỹ thuật và thiết kế',jobs:['hoa_si','tk_do_hoa','nhiep_anh','tho_xam'],cap:1.1},
 'toán học':{project:'Tư vấn phân tích dữ liệu và mô hình định lượng',biz:'dịch vụ phân tích dữ liệu',jobs:['data','dev','giao_vien','giang_vien'],cap:1},
 'ngoại ngữ':{project:'Biên phiên dịch chuyên ngành và đào tạo ngôn ngữ',biz:'dịch vụ biên dịch và lớp ngôn ngữ',jobs:['phien_dich','huong_dan','giao_vien','giang_vien'],cap:.9},
 'ăn nói':{project:'Dẫn chương trình lớn và huấn luyện thuyết trình',biz:'đơn vị truyền thông và tổ chức sự kiện',jobs:['mc_tv','mc_su_kien','su_kien','sale'],cap:1.2},
 'khéo tay':{project:'Thiết kế sản phẩm thủ công theo đơn đặt hàng',biz:'xưởng thủ công và sản phẩm đặt riêng',jobs:['tho_may','dau_bep','ky_su','tho_moc'],cap:1},
 game:{project:'Phân tích chiến thuật, huấn luyện và bình luận esports',biz:'đơn vị huấn luyện và sản xuất nội dung esports',jobs:['tuyen_thu_es','coach_es','streamer'],cap:1.3},
 'cờ':{project:'Huấn luyện cờ chuyên sâu và biên soạn giáo trình',biz:'câu lạc bộ và lớp huấn luyện cờ',jobs:['ky_thu'],cap:.8},
 'diễn xuất':{project:'Đảm nhận vai diễn khó và hướng dẫn diễn xuất',biz:'xưởng casting và đào tạo diễn xuất',jobs:['dien_vien','dao_dien'],cap:1.5},
 'làm đẹp':{project:'Chỉ đạo hình ảnh, makeup và đào tạo chuyên viên',biz:'studio trang điểm và tư vấn phong cách',jobs:['makeup','stylist','tk_thoi_trang','tho_toc','nail','barber','spa'],cap:1.2},
 'đạo diễn':{project:'Chỉ đạo dự án điện ảnh và phát triển đội ngũ sáng tạo',biz:'xưởng sản xuất phim và nội dung hình ảnh',jobs:['dao_dien','bien_kich'],cap:1.8},
 'kinh doanh':{project:'Tư vấn vận hành và phát triển thị trường',biz:'dịch vụ tư vấn vận hành doanh nghiệp',jobs:['kd_tu_do','kd_tap_hoa','kd_quan','giam_doc'],cap:1.4}
};
function real(l){return !!l&&l.alive&&['vn','world'].includes(l.mode);}
function blocked(l){return !real(l)?'Cuộc đời đã kết thúc':l.age<18?'Cần đủ 18 tuổi':!l.indep?'Cần tự lập trước khi nhận dự án':!E.FAMILY53.free(l)?'Cần được tự do đi lại':l.abroad&&l.abroad.study?'Đang du học, chưa thể điều hành dự án này':null;}
function state(l){return l.flags.career109||(l.flags.career109={projects:0,reputation:0});}
function peek(l){return l.flags.career109||{projects:0,reputation:0};}
function path(l){return PATHS[l.talent];}
function level(l){return E.talentLevel(l).lv;}
function job(l){return l.job&&E.resolveJob(l.job.id);}
function stamp(l){return{at:l.age,talent:l.talent,job:job(l),base:l.base,done:false};}
function fresh(l,d){return !blocked(l)&&d&&!d.done&&d.at===l.age&&d.talent===l.talent&&d.job===job(l)&&d.base===l.base;}
function reason(l,key){var b=blocked(l);if(b)return b;if(!path(l))return 'Cần có năng khiếu để chọn hướng chuyên môn';if(level(l)<10)return 'Cần năng khiếu cấp 10 · hiện cấp '+level(l);var s=peek(l);if(s[key]===l.age)return 'Đã thực hiện việc này trong năm '+(l.birthYear+l.age);return true;}
function add(id,label,why){E.ACT.push({id:id,g:'Phát triển sự nghiệp',l:label,min:18,ai:function(){return 0;},avail:why});}
function queue(l,id,r,arg){var d=E.DEC[id].make(l,r,arg);d.manual=true;l.pending.push(d);}
function compatible(l){var c=E.jobDef(l);return path(l)&&((c&&c.talent===l.talent)||path(l).jobs.includes(job(l)));}
// Skill and career rank are different: no automatic ownership from a skill level.
var beauty=E.CAR.makeup;if(beauty){beauty.t=['trợ lý makeup','makeup artist','makeup artist nổi tiếng','chuyên gia trang điểm cao cấp','giám đốc trang điểm dự án'];beauty.vn=[6,15,50,65,85];beauty.yrs=[2,6,4,5];}
var stylist=E.CAR.stylist;if(stylist){stylist.t=['trợ lý stylist','stylist','stylist cho người nổi tiếng','chuyên gia định hình phong cách','giám đốc phong cách dự án'];stylist.vn=[7,18,60,75,95];stylist.yrs=[2,6,4,5];}
E.SC('expert109',{title:'Cấp 10: bước tiếp theo trong nghề',prep:stamp,valid:function(l,d){return reason(l,'projectAt')===true&&(!d||d.at==null||fresh(l,d));},text:function(l){var p=path(l),s=peek(l);return 'Năng khiếu '+E.talentText(l)+' đã đạt cấp 10. '+p.project+'. Bạn đã hoàn thành '+s.projects+' dự án chuyên môn, uy tín '+s.reputation+'/100. Tay nghề cao mở cơ hội, nhưng khách hàng còn xem hồ sơ, kinh nghiệm và độ phù hợp. Không tự nghỉ việc hay thay đổi nghề đang làm. Chi phí chuẩn bị '+H.money(l,l.base*.025)+'. Xét vai trò mới: '+(promotionReason(l)===true?'Đủ điều kiện nộp hồ sơ':promotionReason(l))+'.';},opts:[
 {k:'portfolio',l:'Xây hồ sơ chuyên gia và gửi đề xuất',h:function(l){return 'Chi phí '+H.money(l,l.base*.025)+' · một lần/năm · có thể không được chọn';},req:function(l){return l.money>=l.base*.025;},run:function(l,r,log,d){
  if(!fresh(l,d)||reason(l,'projectAt')!==true||l.money<l.base*.025)return;
  d.done=true;var s=state(l);s.projectAt=l.age;H.cash(l,-l.base*.025,'Hồ sơ dự án chuyên gia');
  var chance=Math.min(.78,.3+(s.reputation||0)*.003+(compatible(l)?.15:0)+Math.min(10,l.workYrs||0)*.01);
  if(r()<chance){s.projects++;s.reputation=Math.min(100,s.reputation+8);var gross=l.base*(.07+r()*.12)*(l.difficulty==='hardcore'?.18:1);H.cash(l,gross,'Thực nhận dự án chuyên gia sau chi phí thực hiện');H.fx(l,{hap:2,hea:-1});log(path(l).project+': hồ sơ được chọn, bạn hoàn thành hợp đồng và nhận '+H.money(l,gross)+' sau chi phí. Có thêm uy tín nhưng chưa có hợp đồng năm sau.','good');}
  else{s.reputation=Math.min(100,s.reputation+1);log('Đề xuất chưa được chọn. Bạn vẫn mất chi phí chuẩn bị; phản hồi giúp hoàn thiện hồ sơ cho năm sau.','neutral');}
 }},
 {k:'advance',l:'Đề xuất vai trò chuyên gia trong nghề hiện tại',h:function(l){var why=promotionReason(l);return why===true?'Đủ điều kiện gửi hồ sơ; kết quả vẫn phụ thuộc xét tuyển':why;},req:function(l){return promotionReason(l)===true;},run:function(l,r,log,d){
  if(!fresh(l,d)||promotionReason(l)!==true)return;d.done=true;state(l).projectAt=l.age;
  if(r()<.35+peek(l).reputation*.003){var c=E.jobDef(l);l.job.rank++;l.job.yrs=0;l.job.rankSince=l.age;l.job.rankTracked=l.job.rank;delete l.job.t;log('Hồ sơ kinh nghiệm được chấp thuận: '+E.jobTitle(l)+'. Cấp bậc được xét từ dự án và thời gian làm nghề, không chỉ từ cấp năng khiếu.','good');}
  else log('Đơn vị chưa chấp thuận vai trò mới. Bạn giữ công việc và hồ sơ, có thể đề xuất lại năm sau.','neutral');
 }},
 {k:'later',l:'Tiếp tục tích lũy kinh nghiệm',run:function(){}}
]});
function promotionReason(l){var b=reason(l,'projectAt');if(b!==true)return b;if(!compatible(l))return 'Cần đang làm nghề phù hợp năng khiếu';var c=E.jobDef(l);if(c.fame||c.ladder)return 'Nghề này xét danh tiếng, chức danh hoặc quân hàm riêng; hãy xây hồ sơ dự án';if(l.job.rank>=c.t.length-1)return 'Đã ở bậc cuối của nghề; có thể làm dự án chuyên gia hoặc mở cơ sở riêng';if((l.job.yrs||0)<2)return 'Cần ít nhất 2 năm ở vị trí hiện tại';if(peek(l).projects<2)return 'Cần hoàn thành ít nhất 2 dự án chuyên gia';return true;}
add('expert109','Cơ hội sau cấp 10 · chuyên gia và dự án lớn',function(l){return reason(l,'projectAt');});
// New ventures use the existing investment accounting, operating costs and failure rules.
Object.keys(PATHS).forEach(function(t,i){var p=PATHS[t],b={k:'talent109_'+i,n:p.biz,cap:90*p.cap,rev:90*p.cap*.12,vc:.35,mg:.12,sd:.22,cost:'nhân sự, địa điểm, thiết bị, tiếp thị và giấy phép phù hợp',talent109:t};b.mu=b.mg*b.rev*12/b.cap;E.wealth.BIZ.push(b);p.bizKey=b.k;});
function bizReason(l){var b=blocked(l);if(b)return b;if(!path(l))return 'Cần có năng khiếu để chọn cơ sở phù hợp';if(level(l)<5)return 'Cần năng khiếu cấp 5 · hiện cấp '+level(l);if((l.ventures||[]).some(function(v){return v.k===path(l).bizKey;}))return 'Đã có cơ sở này; quản lý hoặc mở chi nhánh trong mục đầu tư';var cap=E.wealth.bizV(l,90*path(l).cap),reserve=l.base*.3;if(l.money<cap+reserve)return 'Cần '+H.money(l,cap)+' vốn và '+H.money(l,reserve)+' dự phòng';if(peek(l).businessAt===l.age)return 'Đã mở cơ sở theo năng khiếu năm nay';return true;}
E.SC('talentBiz109',{title:'Chọn lĩnh vực kinh doanh theo năng khiếu',prep:stamp,valid:function(l,d){return !blocked(l)&&!!path(l)&&(!d||d.at==null||fresh(l,d));},text:function(l){var p=path(l);return 'Năng khiếu '+E.talentText(l)+' phù hợp với '+p.biz+'. '+(bizReason(l)===true?'Đã đủ điều kiện về tay nghề, vốn và dự phòng':bizReason(l))+'. Đây là dịch vụ chuyên môn, không bao gồm can thiệp y khoa hoặc hoạt động đòi hỏi chứng chỉ chưa có. Mở cơ sở không tự biến bạn thành chủ chuỗi; doanh thu, chi phí, lỗ và chi nhánh dùng hệ thống kinh doanh hiện có.';},opts:[
 {k:'open',l:function(l){return 'Mở '+path(l).biz;},h:function(l){return 'Vốn '+H.money(l,E.wealth.bizV(l,90*path(l).cap))+' · giữ dự phòng '+H.money(l,l.base*.3);},req:function(l){return bizReason(l)===true;},run:function(l,r,log,d){
  if(!fresh(l,d)||bizReason(l)!==true)return;var p=path(l),b=E.wealth.BIZ.find(function(b){return b.k===p.bizKey;}),cap=E.wealth.bizV(l,b.cap);
  d.done=true;state(l).businessAt=l.age;H.cash(l,-cap,'Mở '+b.n);
  (l.ventures||(l.ventures=[])).push({k:b.k,n:b.n,cap:cap,unit:cap,br:1,mu:b.mu,sd:b.sd,yrs:0,bad:0,good:0,R:E.wealth.bizV(l,b.rev)*12,q:Math.min(1.3,.8+level(l)*.025+Math.min(.15,peek(l).reputation*.0015))});
  log('Bạn mở '+b.n+' bằng vốn tự có, giữ quỹ dự phòng. Năng khiếu giúp chất lượng dịch vụ nhưng không bảo đảm đủ khách hoặc có lãi. Công việc hiện tại không tự bị bỏ.','big');
 }},
 {k:'plan',l:'Lập kế hoạch, chưa chi tiền',run:function(l,r,log,d){if(!fresh(l,d))return;d.done=true;log('Bạn tính chi phí, khách hàng và quỹ dự phòng cho '+path(l).biz+'. Chưa ký hợp đồng hay chi tiền.','neutral');}},
 {k:'back',l:'Chọn mô hình đầu tư khác',run:function(l,r,log,d){if(!fresh(l,d))return;d.done=true;queue(l,'dau_tu_lon',r);}},
 {k:'cancel',l:'Để dịp khác',run:function(){}}
]});
add('talentBiz109','Khởi nghiệp đúng lĩnh vực năng khiếu',bizReason);
E.ACT.filter(function(a){return a.id==='khoi_nghiep';}).forEach(function(a){a.sc='startup109';a.avail=function(l){return blocked(l)||true;};});
E.SC('startup109',{title:'Bạn muốn khởi nghiệp theo hướng nào?',valid:function(l){return !blocked(l);},text:'Chọn chuyên môn của mình hoặc xem những mô hình đầu tư khác. Mọi khoản đầu tư đều cần vốn; không tự chọn ngẫu nhiên ngành kinh doanh thay bạn.',opts:[
 {k:'talent',l:'Lĩnh vực phù hợp năng khiếu của tôi',req:function(l){return !!path(l);},run:function(l,r){queue(l,'talentBiz109',r);}},
 {k:'other',l:'Xem cửa hàng, dịch vụ và bất động sản',run:function(l,r){queue(l,'dau_tu_lon',r);}},
 {k:'cancel',l:'Chưa khởi nghiệp',run:function(){}}
]});
// Employment shocks persist; a budget change is an explicit player decision.
function loss(l,previous){if(previous&&!l.job&&!l.retired&&real(l)&&l.age>=18){var s=state(l);if(!s.unemployment||s.unemployment.closed){s.unemployment={at:l.age,lastYear:l.age,years:0,job:previous.id,closed:false};}}}
['beginYear','finishYear'].forEach(function(k){var old=E[k];E[k]=function(l){var before=l.job&&{id:l.job.id},result=old.apply(this,arguments);loss(l,before);return result;};});
function recoveryReason(l){var b=blocked(l);if(b)return b;var u=peek(l).unemployment;if(!u||u.closed)return 'Chưa có biến cố mất việc cần theo dõi';if(peek(l).recoveryAt===l.age)return 'Đã điều chỉnh kế hoạch trong năm nay';return true;}
E.SC('recovery109',{title:'Sau mất việc: kế hoạch cho chặng tiếp theo',prep:function(l){return {at:l.age,lossAt:peek(l).unemployment.at,done:false};},valid:function(l,d){return recoveryReason(l)===true&&(!d||d.at==null||!d.done&&d.at===l.age&&d.lossAt===peek(l).unemployment.at);},text:function(l){var u=peek(l).unemployment;return 'Biến cố bắt đầu ở tuổi '+u.at+'. '+(l.job?'Bạn đã có công việc mới; vẫn cần xem lại dự phòng.':'Bạn chưa có công việc mới, đã theo dõi '+u.years+' năm.')+' Mức chi tiêu hiện tại: '+({save:'tiết kiệm',normal:'bình thường',lavish:'thoải mái'}[l.spend]||'bình thường')+'. Thay đổi dưới đây tiếp tục áp dụng các năm sau cho tới khi bạn tự đổi lại; không hoàn tiền các khoản đã chi.';},opts:[
 {k:'save',l:'Chuyển sang chi tiêu tiết kiệm',run:function(l,r,log,d){if(!E.DEC.recovery109.valid(l,d))return;d.done=true;state(l).recoveryAt=l.age;l.spend='save';log('Bạn giảm mức chi tiêu cho những năm tới. Tiền thuê nhà, khoản vay và nghĩa vụ nuôi con vẫn phải thực hiện; không có tiền hỗ trợ tự động.','neutral');}},
 {k:'job',l:'Rà lại hồ sơ, tìm việc mới',req:function(l){return !l.job;},run:function(l,r,log,d){if(!E.DEC.recovery109.valid(l,d)||l.job)return;d.done=true;state(l).recoveryAt=l.age;queue(l,'job',r);log('Bạn bắt đầu tìm việc lại; gửi hồ sơ chưa đồng nghĩa được tuyển.','neutral');}},
 {k:'close',l:'Giữ mức chi hiện tại và tiếp tục theo dõi',run:function(l,r,log,d){if(!E.DEC.recovery109.valid(l,d))return;d.done=true;state(l).recoveryAt=l.age;if(l.job)state(l).unemployment.closed=true;log('Bạn giữ kế hoạch chi tiêu hiện tại sau khi cân nhắc quỹ dự phòng.','neutral');}}
]});
add('recovery109','Theo dõi việc làm và ngân sách sau mất việc',recoveryReason);
// Persistent relationship follow-ups refer to the same person, not a replacement partner.
function people(l){var out=[];if(l.partner&&l.partner.alive!==false&&l.partner.family100)out.push({obj:l.partner,s:l.partner.family100,name:l.partner.name});(l.kids||[]).filter(function(k){return k.alive!==false&&k.family100;}).forEach(function(k){out.push({obj:k,s:k.family100,name:k.name});});var parents=l.flags.family100&&l.flags.family100.parents;['m','f'].forEach(function(k){var p=parents&&parents[k];if(p&&p.family100&&l.fam[k+'Alive']&&!(k==='f'&&l.fam.noDad))out.push({obj:p,s:p.family100,name:(k==='m'?'mẹ ':'bố ')+l.fam[k+'Name']});});return out;}
function conflicts(l){return people(l).filter(function(p){return p.s.tension>=25&&p.s.followAt109!==l.age;});}
E.SC('repair109',{title:'Bất đồng chưa khép lại',prep:function(l,r,arg){var p=conflicts(l).find(function(p){return arg&&p.s.uid===arg.uid;})||conflicts(l)[0];return p?{at:l.age,uid:p.s.uid,name:p.name,done:false}:{};},valid:function(l,d){return !blocked(l)&&(d&&d.uid?d.at===l.age&&!d.done&&conflicts(l).some(function(p){return p.s.uid===d.uid;}):conflicts(l).length>0);},text:function(l,d){var p=conflicts(l).find(function(p){return p.s.uid===d.uid;});return d.name+' vẫn có điều khó nói sau những bất đồng trước. Tin cậy '+p.s.trust+'/100, căng thẳng '+p.s.tension+'/100. Một lần xin lỗi không xóa hết tổn thương; cách bạn giữ lời trong những năm tới mới quyết định khoảng cách.';},opts:[
 {k:'listen',l:'Nhận phần mình, hỏi người ấy muốn được lắng nghe thế nào',run:function(l,r,log,d){repair(l,d,r,log,false);}},
 {k:'promise',l:'Thống nhất một việc nhỏ và dành thời gian thực hiện',run:function(l,r,log,d){repair(l,d,r,log,true);}},
 {k:'wait',l:'Tôn trọng khoảng riêng, giữ lời hỏi thăm',run:function(l,r,log,d){if(!E.DEC.repair109.valid(l,d))return;d.done=true;var p=conflicts(l).find(function(p){return p.s.uid===d.uid;});p.s.followAt109=l.age;log('Bạn cho '+d.name+' thêm thời gian. Bất đồng chưa được coi là giải quyết xong.','neutral');}}
]});
function repair(l,d,r,log,promise){if(!E.DEC.repair109.valid(l,d))return;var p=conflicts(l).find(function(p){return p.s.uid===d.uid;});d.done=true;p.s.followAt109=l.age;if(promise){p.s.promise109={at:l.age,uid:p.s.uid};log('Bạn và '+d.name+' bàn một việc nhỏ có thể làm được. Năm sau cần thực hiện, không chỉ nói lời xin lỗi.','neutral');}else if(r()<.3+p.s.trust*.004){p.s.trust=Math.min(100,p.s.trust+2);p.s.tension=Math.max(0,p.s.tension-3);log(d.name+' đồng ý nói thêm một chút. Khoảng cách giảm dần, chưa thể trở lại như trước ngay.','good');}else log(d.name+' chưa muốn nói tiếp. Bạn tôn trọng điều đó và không ép tha thứ.','neutral');}
add('repair109','Tiếp nối cuộc trò chuyện sau bất đồng',function(l){return blocked(l)|| (conflicts(l).length?true:'Cần người thân còn sống có bất đồng chưa khép lại và chưa trao đổi năm nay');});
E.HOOKS.year.push(function(l,r,log){
 if(!real(l))return;var u=peek(l).unemployment;
 if(u&&!u.closed&&u.lastYear!==l.age){u.lastYear=l.age;if(!l.job){u.years++;if(u.years<=3)log('Một năm nữa chưa tìm được việc ổn định. Bạn vẫn đang chi tiêu '+(l.spend==='save'?'tiết kiệm':'theo mức đã chọn')+'; có thể mở kế hoạch sau mất việc để điều chỉnh.','neutral');}else{u.closed=true;log('Bạn đã trở lại làm việc. Mức chi tiêu đã chọn vẫn giữ nguyên; hãy tự cân nhắc khi nào tăng trở lại.','good');}}
 people(l).forEach(function(p){var promise=p.s.promise109;if(!promise||promise.at>=l.age)return;delete p.s.promise109;if(p.s.lastActivity>=promise.at+1){p.s.trust=Math.min(100,p.s.trust+3);p.s.tension=Math.max(0,p.s.tension-4);log('Bạn đã dành thời gian cho '+p.name+' sau lời hẹn trước. Sự tin cậy được xây lại từng chút.','good');}else{p.s.tension=Math.min(100,p.s.tension+2);log('Lời hẹn với '+p.name+' chưa được thực hiện. Người ấy còn dè dặt, vấn đề vẫn cần tiếp nối.','neutral');}});
});
E.CAREER109_YEAR=E.HOOKS.year[E.HOOKS.year.length-1];
var resolve=E.resolve;E.resolve=function(l){var before=l.job&&{id:l.job.id},out=resolve.apply(this,arguments);loss(l,before);return out;};
// Conditions are evaluated on snapshots so showing a menu never changes a save.
var actions=E.actions;E.actions=function(l){l=JSON.parse(JSON.stringify(l));return actions(l).map(function(x){x.catalogHidden=x.ok!==true&&/^(Từ \d+ tuổi|Không áp dụng|Không còn phù hợp)/.test(x.ok);var a=E.ACT.find(function(a){return a.id===x.id;}),D=a&&E.DEC[a.sc||a.id];
 if(x.ok===true&&D&&D.valid){try{if(!D.valid(JSON.parse(JSON.stringify(l)),{requested:true}))x.ok=explain(l,x.id);}catch{x.ok='Cần hoàn thành lựa chọn hoặc tình huống liên quan trước';}}
 if(x.ok!==true&&/^(Không áp dụng|Chưa phù hợp|Chưa thể làm)/.test(x.ok))x.ok=explain(l,x.id);return x;});};
function explain(l,id){if(!l.alive)return 'Cuộc đời đã kết thúc';if(l.age<18&&/108|109/.test(id))return 'Cần đủ 18 tuổi';
 var reasons={dating108:'Cần đủ 18 tuổi và được tự do đi lại',childGuide108:'Cần có con còn sống từ 10 tuổi',network108:'Cần đủ 18 tuổi và được tự do đi lại',familyPlan108:'Cần có người cùng làm cha mẹ phù hợp; kiểm tra tuổi, khoảng cách sinh và thai kỳ',music105_training:'Cần đang làm ca sĩ, rapper hoặc nhạc sĩ; kiểm tra lượt và thời gian năm nay'};
 var named={hen_ho:l.partner?'Cần lịch hẹn phù hợp, cả hai còn sống và được tự do':'Cần có người yêu / bạn đời còn sống',tang_luong:!l.job?'Cần có công việc hiện tại':E.isStableService(l)?'Nghề công vụ xét lương theo ngạch/bậc hoặc quân hàm':E.jobDef(l).fame?'Nghề danh tiếng tăng thu nhập qua sản phẩm và hợp đồng':'Cần là nhân viên hưởng lương; chủ cơ sở không tự xin tăng lương',mo_rong:'Cần đang làm chủ cơ sở hoặc có cơ sở kinh doanh và đủ vốn mở rộng',quan_ly_dau_tu:'Chưa có bất động sản cho thuê hoặc cơ sở kinh doanh để quản lý',ve_vn_song:'Cần đang sinh sống ở nước ngoài để bàn việc về Việt Nam',quay_lai_nn:'Cần có nơi định cư cũ đã lưu để quay lại',viec_remote:'Cần công việc hỗ trợ làm từ xa và nơi cư trú phù hợp',sv_lam_them:'Cần đang đi học và chưa có việc làm thêm',dc_cong_dong:'Cần đã định cư và có cộng đồng đồng hương phù hợp',bond108:'Cần có người yêu / bạn đời trưởng thành và còn sống',luxury108:'Cần từ 40 tuổi và có tiền mặt ít nhất 5 lần thu nhập cơ bản năm',mentor107:'Cần đang làm nghề showbiz, chưa nghỉ hưu, bậc nghề từ 1 và chưa hướng dẫn năm nay',affair107:'Cần đã kết hôn, người bạn đời còn sống và đủ điều kiện gặp gỡ',chu_cap_dung:'Cần đang có mối quan hệ chu cấp để kết thúc',nghe_kh:'Cần nghề hiện tại có ca hoặc đơn hàng đặc biệt phù hợp',home_skin_games:'Cần đã chọn trò chơi để mua vật phẩm phù hợp',show105_ig:'Cần đang làm nghề showbiz ngoài ca sĩ/rapper/nhạc sĩ',work105_study:'Cần đang có công việc; người làm âm nhạc dùng mục Học hát riêng',work105_extra:'Cần có công việc phù hợp và lịch ngoài giờ; âm nhạc dùng mục Tìm show',abroad107:l.school?'Cần hoàn thành chương trình đang học':l.edu<3?'Cần tốt nghiệp THPT hoặc bằng tương đương':l.edu>=7?'Đã có bằng tiến sĩ, không còn bậc học tiếp trong nhánh này':l.abroad?'Cần kết thúc đợt ở nước ngoài hiện tại':'Cần đủ 18 tuổi, chưa nghỉ hưu và đủ điều kiện học tiếp'};
 if(named[id])return named[id];
 if(/^service107_|^hv_|^bo_nhiem_chien_luoc/.test(id))return ['quan_doi','cong_an'].includes(job(l))?'Cần đủ quân hàm, thâm niên, thành tích và học viện theo chức vụ':'Cần đang công tác trong quân đội hoặc công an';
 if(/^tg_act_/.test(id))return 'Chỉ thực hiện khi đang trong trại giam, đúng lịch và đủ điều kiện sức khỏe';
 if(/^kh_act_/.test(id))return 'Chỉ thực hiện trong bối cảnh đang bị giữ ở trại lừa đảo';
 if(reasons[id])return reasons[id];if(/brand105/.test(id))return 'Cần đang làm nghề showbiz và đủ điều kiện nhận hợp đồng';if(/music105/.test(id))return 'Cần đang làm ca sĩ, rapper hoặc nhạc sĩ; chưa dùng hết thời gian âm nhạc';
 return 'Chưa đủ điều kiện của hoạt động này: kiểm tra nghề, học vấn và tình huống đang chờ';}
E.CAREER109={paths:PATHS,reason:reason,bizReason:bizReason,promotionReason:promotionReason,loss:loss,conflicts:conflicts};
})(globalThis.G);
