/* Real-world continuity, public careers and adult relationships. */
(function(G){'use strict';
var E=G.E,H=E.H,U=G.U,SC=E.SC;
function real(l){return l&&['vn','world'].indexOf(l.mode)>=0;}
function free(l){return real(l)&&l.alive&&!(l.jailUntil!=null&&l.age<l.jailUntil)&&!(l.flags.military&&l.age<l.flags.military)&&!(l.abroad&&l.abroad.trapped);}
function jid(l){return l.job&&E.resolveJob(l.job.id);}
function trigger(id,when,p,cd,max){E.TRIG.push({id:id,when:function(l){return free(l)&&when(l);},p:p,cd:cd,max:max});}

// A person can occupy several relationship roles, but only die once.
E.syncKnownDeaths=function(l,a){
 if(!real(l))return;
 var people=[l.bff].concat(l.friends||[]).filter(Boolean),deaths=l.flags.deadPartners||[];
 people.forEach(function(f){var d=deaths.filter(function(x){return x.n===f.name;})[0];if(d){f.alive=false;f.died=d.a;f.lover=false;}});
 var p=l.partner,linked=p&&people.filter(function(f){return f.name===p.name&&f.alive===false;})[0];if(linked&&E.partnerGone)E.partnerGone(l,linked.died==null?a:linked.died);
};
var migrate=E.migrateExt;
E.migrateExt=function(l){if(migrate)migrate(l);if(real(l)){E.syncKnownDeaths(l,l.age);repairScholarship(l);}};

// A research scholarship moves residence and currency, without selling a home.
E.startResearchStudy=function(l,c,r,log){
 var host=G.W.BY[c[0]],old=G.W.BY[l.abroad?l.abroad.code:l.country],home={abroad:l.abroad?JSON.parse(JSON.stringify(l.abroad)):null,place:l.place,city:l.city,urban:l.urban,cur:l.cur};
 E.startJob(l,'nghien_cuu',r,log,true);
 var factor=l.cur==='vnd'?1e6/G.CUR.VND/G.CUR.priceLevel(host.gdp):G.CUR.priceLevel(old?old.gdp:l.gdp)/G.CUR.priceLevel(host.gdp);
 E.abroadConvert(l,factor);l.cur='usd';
 l.abroad={code:c[0],name:c[1],pool:c[2],study:true,research:true,until:l.age+4,base:host.gdp*1000*.4};
 l.place=host.cities[0];l.city=l.place;l.urban=true;H.setBase(l);
 l.income=l.base*.7;l.fin=null;
 l.flags.researchStudy={country:c[0],name:c[1],at:l.age,home:home,finished:false};
 l.flags.studiedAbroad=c[1];l.uniCity=c[1];l.job.t='Nghiên cứu sinh tiến sĩ tại '+c[1];
 ['last','floor','market52'].forEach(function(k){delete l.job[k];});
 H.sched(l,'nc_bao_ve',4,{lv:7,abroad:true,country:c[0],started:l.age});
 log('Sang '+l.place+', '+c[1]+' học tiến sĩ. Công việc cũ đã kết thúc; trong thời gian này bạn nhận sinh hoạt phí từ học bổng.','big');
};
function repairScholarship(l){
 if(!l.flags.ncPath||l.flags.ncPath.no||l.flags.researchStudy||l.abroad||jid(l)!=='nghien_cuu')return;
 var awards=(l.log||[]).filter(function(e){return /^Bạn giành được học bổng tiến sĩ toàn phần ở /.test(e.t||'');}),award=awards[awards.length-1];if(!award)return;
 if((l.log||[]).some(function(e){return e.a>=award.a&&/^(Về nước|Về Việt Nam|Di cư sang|Bạn trở về)/.test(e.t||'');}))return;
 var m=/toàn phần ở (.+?)\./.exec(award.t),dest=[['JP','Nhật Bản','jp'],['DE','Đức','de'],['KR','Hàn Quốc','kr'],['AU','Úc','en'],['FR','Pháp','fr'],['US','Mỹ','en']].filter(function(c){return m&&c[1]===m[1];})[0];if(!dest)return;
 var count=l.sched.length,at=award.a;E.startResearchStudy(l,dest,function(){return .5;},function(){});l.sched.length=count;
 var s=l.flags.researchStudy;s.at=at;l.abroad.until=at+4;
 l.sched.forEach(function(x){if(x.id==='nc_bao_ve'&&x.arg&&x.arg.abroad)x.arg=Object.assign({},x.arg,{country:dest[0],started:at});});
 if(l.edu>=7){s.finished=true;delete l.job.t;if(!l.pending.some(function(d){return d.id==='nc_sau_du_hoc';}))l.pending.push(E.DEC.nc_sau_du_hoc.make(l,function(){return .5;}));}
 else if(!l.sched.some(function(x){return x.id==='nc_bao_ve';})&&!l.pending.some(function(d){return d.id==='nc_bao_ve';}))H.sched(l,'nc_bao_ve',Math.max(0,at+4-l.age),{lv:7,abroad:true,country:dest[0],started:at});
 l.pending.forEach(function(d){if(d.id==='nc_bao_ve'&&d.data&&d.data.abroad){d.data.country=dest[0];d.data.started=at;}});
}
var career=E.careerYear;
E.careerYear=function(l,r,log,focus){var s=l.flags.researchStudy;
 if(s&&!s.finished&&jid(l)==='nghien_cuu'&&l.abroad&&l.abroad.code===s.country){l.workYrs++;log('Nhận sinh hoạt phí học bổng tại '+s.name+'.','neutral');return l.base*.7;}
 return career.apply(this,arguments);
};
var defense=E.DEC.nc_bao_ve.def,defValid=defense.valid;
defense.valid=function(l,d){var s=l.flags.researchStudy;return defValid(l,d)&&(!(d&&d.country)||(s&&!s.finished&&d.started===s.at&&l.abroad&&l.abroad.code===d.country));};
defense.opts.forEach(function(o){var run=o.run;o.run=function(l,r,log,d){
 var before=l.edu,s=l.flags.researchStudy,scheduled=l.sched.length;run(l,r,log,d);
 if(!s||!d||!d.country)return;
 for(var i=scheduled;i<l.sched.length;i++)if(l.sched[i].id==='nc_bao_ve')l.sched[i].arg=Object.assign({},l.sched[i].arg,{country:s.country,started:s.at});
 if(l.edu>=7&&before<7){s.finished=true;delete l.job.t;l.pending.push(E.DEC.nc_sau_du_hoc.make(l,r));}
};});
SC('nc_sau_du_hoc',{title:'Sau tấm bằng tiến sĩ',valid:function(l){return !!(l.flags.researchStudy&&l.flags.researchStudy.finished&&l.abroad);},text:function(l){return 'Bạn đã bảo vệ xong ở '+l.flags.researchStudy.name+'. Ở lại làm nghiên cứu hay trở về nơi mình từng sống?';},opts:[
 {k:'stay',l:'Ở lại tìm việc nghiên cứu',run:function(l,r,log){l.abroad.study=false;l.abroad.research=false;l.abroad.perm=true;l.abroad.since=l.age;delete l.abroad.until;delete l.flags.researchStudy;l.flags.needJob=false;log('Bạn ở lại '+l.abroad.name+', tiếp tục công việc nghiên cứu sau tiến sĩ.','good');}},
 {k:'home',l:'Trở về sau khi học xong',run:function(l,r,log){var s=l.flags.researchStudy,h=s.home,old=G.W.BY[l.abroad.code],dest=h.abroad?G.W.BY[h.abroad.code]:G.W.BY[l.country],factor=h.cur==='vnd'?G.CUR.priceLevel(old.gdp)*G.CUR.VND/1e6:G.CUR.priceLevel(old.gdp)/G.CUR.priceLevel(dest.gdp);E.abroadConvert(l,factor);l.cur=h.cur;l.abroad=h.abroad;l.place=h.place;l.city=h.city;l.urban=h.urban;H.setBase(l);l.job=null;l.income=0;l.fin=null;l.flags.needJob=true;delete l.flags.researchStudy;log('Bạn trở về sau những năm học xa nhà, giữ học vị tiến sĩ và bắt đầu tìm công việc mới.','big');}}
]});

// Existing rank indices keep their meaning in saved games.
['quan_doi','cong_an'].forEach(function(id){var c=E.CAR[id];c.t=c.t.concat(['Trung tướng','Thượng tướng','Đại tướng']);c.vn=c.vn.concat([42,50,60]);c.yrs=c.yrs.concat([4,4,4]);});
E.CAR.chinh_tri.t[1]='phó trưởng ban cấp tỉnh';E.CAR.chinh_tri.t[2]='bí thư đảng ủy xã';
E.CAR.chinh_tri.t=E.CAR.chinh_tri.t.concat(['bí thư Trung ương Đảng','ủy viên Bộ Chính trị','Tổng Bí thư']);
E.CAR.chinh_tri.vn=E.CAR.chinh_tri.vn.concat([60,68,75]);E.CAR.chinh_tri.yrs=E.CAR.chinh_tri.yrs.concat([5,5,5]);E.CAR.chinh_tri.vnOnly=true;
E.CAR.hanh_chinh_cong={id:'hanh_chinh_cong',t:['chuyên viên UBND xã','phó chánh văn phòng UBND xã','chánh văn phòng UBND xã','phó chủ tịch UBND xã','chủ tịch UBND xã','phó giám đốc sở','giám đốc sở','phó chủ tịch UBND tỉnh','chủ tịch UBND tỉnh','thứ trưởng','bộ trưởng'],vn:[9,12,15,18,22,26,30,36,42,50,62],yrs:[3,3,4,4,4,4,4,5,5,5],cat:'state',sec:'formal',edu:5,vnOnly:true,minAge:22,sigma:.05,loss:.002,promo:.12,w:.45};
function uniform(l){return jid(l)==='quan_doi'||jid(l)==='cong_an';}
var advance=E.canAdvance;
E.canAdvance=function(l,c,end){
 if(!advance.apply(this,arguments))return false;
 if(c.ladder&&l.job.rank>=8)return l.flags.strategicPost===c.id&&l.flags.topAcad>0&&l.age>=50+(l.job.rank-8)*4&&l.st.hea>=55&&(l.karma||0)>=0;
 if((c.id==='chinh_tri'&&l.job.rank>=6)||(c.id==='hanh_chinh_cong'&&l.job.rank>=8))return l.age>=50&&(l.karma||0)>=0&&!(l.flags.dirty>0);
 return true;
};
SC('bo_nhiem_chien_luoc',{title:'Đề xuất bổ nhiệm cấp chiến lược',valid:function(l){return free(l)&&uniform(l)&&l.job.rank>=8&&l.flags.topAcad>0&&l.age>=50&&l.flags.strategicPost!==jid(l);},text:function(l){return 'Sau thời gian công tác và học nâng cao, bạn được đề xuất vào '+(jid(l)==='cong_an'?'ban lãnh đạo cấp bộ':'bộ phận chỉ huy cấp chiến lược')+'. Có chức vụ phù hợp mới được xét những cấp hàm tiếp theo.';},opts:[
 {k:'yes',l:'Nhận nhiệm vụ',run:function(l,r,log){l.flags.strategicPost=jid(l);log('Bạn nhận nhiệm vụ ở cấp chiến lược. Quân hàm vẫn được xét riêng theo thâm niên và thành tích.','good');}},
 {k:'no',l:'Xin tiếp tục công việc đang làm',run:function(l,r,log){log('Bạn xin tiếp tục công tác tại đơn vị hiện tại.','neutral');}}
]});
trigger('bo_nhiem_chien_luoc',function(l){return E.DEC.bo_nhiem_chien_luoc.valid(l);},.2,4,2);
E.ACT.push({id:'de_xuat_chien_luoc',g:'Công việc',l:'Xem đề xuất bổ nhiệm cấp chiến lược',min:50,sc:'bo_nhiem_chien_luoc',avail:function(l){return E.DEC.bo_nhiem_chien_luoc.valid(l)||'Cần hàm tướng, đã học nâng cao và đang công tác';}});

// Rumours are allegations, not proof or automatic criminal convictions.
function publicCareer(l){var c=l.job&&E.jobDef(l);return free(l)&&l.age>=18&&!l.retired&&c&&(c.fame&&(l.fame||0)>=5e4||/^(chinh_tri|chinh_khach|hanh_chinh_cong)$/.test(c.id)&&l.job.rank>=2);}
var cases=[
 ['Một đoạn phát biểu bị cắt','Một đoạn phát biểu của bạn bị cắt mất phần trước, lan khắp mạng. Bình luận đòi bạn giải thích trước khi bản đầy đủ được đăng.'],
 ['Người nhà và hợp đồng mới','Tên người thân của bạn xuất hiện trong một hợp đồng bị đặt nghi vấn ưu ái. Chưa có kết luận, nhưng mọi người đang đòi công khai quan hệ lợi ích.'],
 ['Quà tặng bị soi','Ảnh bạn nhận món quà đắt tiền được chia sẻ lại. Bên tặng nói là xã giao, còn dư luận muốn biết có đi kèm điều kiện nào không.'],
 ['Lời quảng bá gây tranh cãi','Một hoạt động bạn từng đứng tên ủng hộ bị phản ánh thiếu minh bạch. Người chịu thiệt muốn bạn lên tiếng và giúp làm rõ.'],
 ['Tin nhắn riêng bị phát tán','Ảnh chụp tin nhắn được gán cho bạn đang lan truyền, chưa rõ thật giả. Người thân cũng bị kéo vào bình luận.'],
 ['Lời nói cũ bị nhắc lại','Một lời nói thiếu cân nhắc của bạn nhiều năm trước bị nhắc lại. Có người muốn nghe lời xin lỗi, có người chỉ muốn đẩy chuyện đi xa hơn.']
];
SC('public_scandal101',{title:function(l,d){return cases[d.topic][0];},prep:function(l,r){return {job:jid(l),at:l.age,topic:U.randint(r,0,cases.length-1)};},valid:function(l,d){return publicCareer(l)&&(!d||d.at==null||d.job===jid(l)&&d.at===l.age);},text:function(l,d){return cases[d.topic][1];},opts:[
 {k:'clarify',l:'Công khai thông tin, đề nghị kiểm tra độc lập',h:'Giải thích bằng chứng, không công khai đời tư người khác',run:function(l,r,log){var good=r()<.7;l.fame=Math.max(0,(l.fame||0)*(good?.98:.88));H.fx(l,{hap:good?-2:-5,karma:2});if(l.job)l.job.rep=U.clamp((l.job.rep||50)+(good?4:-3),0,100);log(good?'Thông tin đầy đủ giúp làm rõ vụ việc. Vẫn có người không tin, nhưng bạn giữ được phần lớn uy tín.':'Việc kiểm tra cần thêm thời gian. Bạn tạm giảm xuất hiện, trả lời những gì đã xác minh.','neutral');}},
 {k:'own',l:'Nhận phần trách nhiệm của mình, xin lỗi và khắc phục',run:function(l,r,log){l.fame=Math.max(0,(l.fame||0)*.9);H.fx(l,{karma:3,hap:-3});log('Bạn nhận trách nhiệm trong phần việc của mình, công bố cách khắc phục. Lời xin lỗi không khiến mọi người quên ngay, nhưng câu chuyện dần dịu lại.','neutral');}},
 {k:'hide',l:'Nhờ người dập chuyện, tránh trả lời',h:'Có thể phản tác dụng, ảnh hưởng uy tín và công việc',run:function(l,r,log){var bad=r()<.6;l.fame=Math.max(0,(l.fame||0)*(bad?.65:.95));H.fx(l,{karma:-5,hap:bad?-8:-2});if(bad&&l.job){l.job.rep=Math.max(0,(l.job.rep||50)-15);l.flags.dirty=(l.flags.dirty||0)+1;}log(bad?'Cách gây sức ép bị lộ, khiến chuyện cũ càng bị soi kỹ. Uy tín của bạn giảm mạnh.':'Câu chuyện tạm lắng, nhưng bạn vẫn phải giải trình phần việc chưa rõ.','bad');}}
]});
trigger('public_scandal101',publicCareer,.12,3,5);
E.PUBLIC_SCANDAL_CASES101=cases;

// Adult-only, non-graphic relationships with the same named person throughout.
function single(l){return free(l)&&l.age>=18&&!l.partner;}
function peer(l,r){var sex=H.partnerSex(l,r);return {n:H.stranger(l,r,sex),sex:sex,age:Math.max(18,l.age+U.randint(r,-3,3)),at:l.age};}
function datePeer(l,d,log){if(!single(l)||d.age<18)return;l.partner={name:d.n,sex:d.sex,age:d.age,status:'dating',since:l.age,alive:true};l.flags.everDated=true;H.fx(l,{hap:6});log('Bạn và '+d.n+' đồng ý tìm hiểu nghiêm túc, không còn để nhau phải đoán.','good');}
SC('map_mo101',{title:'Mình là gì của nhau?',prep:function(l,r){var d=peer(l,r);if(l.flags.mapMo)d.n=l.flags.mapMo;return d;},valid:function(l,d){return single(l)&&(!d||d.at==null||d.at===l.age&&d.age>=18);},text:function(l,d){return 'Bạn và '+d.n+' nhắn mỗi tối, có lúc gần như người yêu, nhưng chưa ai nói rõ. Một lời hẹn lại bị bỏ lửng.';},opts:[
 {k:'ask',l:'Hỏi thẳng hai người đang mong điều gì',run:function(l,r,log,d){if(r()<.5)datePeer(l,d,log);else{delete l.flags.mapMo;H.fx(l,{hap:-3});log(d.n+' nói chưa muốn yêu nghiêm túc. Bạn biết câu trả lời để quyết định bước tiếp.','neutral');}}},
 {k:'wait',l:'Tìm hiểu thêm, nhưng nói rõ giới hạn của mình',run:function(l,r,log,d){l.flags.mapMo=d.n;l.flags.ambiguous101=d;H.sched(l,'map_mo_tiep101',1,{n:d.n,sex:d.sex,age:d.age+1});log('Bạn nói rõ mình không muốn chờ vô thời hạn. Hai người thử cho nhau thêm thời gian.','neutral');}},
 {k:'stop',l:'Dừng lại để không tự làm mình mệt',run:function(l,r,log,d){delete l.flags.mapMo;delete l.flags.ambiguous101;log('Bạn ngừng chờ tin nhắn của '+d.n+', dành thời gian lại cho cuộc sống của mình.','neutral');}}
]});
SC('map_mo_tiep101',{title:'Tin nhắn sau một khoảng im lặng',valid:function(l,d){return single(l)&&d&&d.age>=18&&l.flags.mapMo===d.n;},text:function(l,d){return d.n+' lại nhắn hỏi thăm sau những ngày thưa liên lạc. Bạn không muốn quay lại đúng vòng lặp cũ.';},opts:[
 {k:'talk',l:'Gặp và nói rõ, chỉ tiếp tục nếu cả hai cùng muốn',run:function(l,r,log,d){if(r()<.5)datePeer(l,d,log);else log('Hai người muốn những điều khác nhau, nên dừng lại ở đây.','neutral');delete l.flags.mapMo;delete l.flags.ambiguous101;}},
 {k:'close',l:'Khép lại chuyện này',run:function(l,r,log){delete l.flags.mapMo;delete l.flags.ambiguous101;log('Bạn trả lời tử tế rồi khép lại cuộc trò chuyện.','neutral');}}
]});
SC('casual101',{title:'Một đêm, rồi sao nữa?',prep:peer,valid:function(l,d){return single(l)&&(!d||d.at==null||d.at===l.age&&d.age>=18);},text:function(l,d){return 'Sau một buổi gặp, bạn và '+d.n+' thấy hợp nhau. Cả hai đều đã trưởng thành và tỉnh táo. Người ấy hỏi bạn có muốn ở lại, với điều kiện nói rõ đây chỉ là một cuộc gặp không ràng buộc.';},opts:[
 {k:'yes',l:'Đồng ý, nói rõ mong muốn và dùng biện pháp bảo vệ',run:function(l,r,log,d){l.flags.casual101={n:d.n,sex:d.sex,age:d.age+1,at:l.age};H.sched(l,'casual_after101',1,l.flags.casual101);log('Hai người tự nguyện ở bên nhau một đêm, tôn trọng giới hạn đã nói trước. Sáng hôm sau mỗi người trở lại cuộc sống của mình.','neutral');}},
 {k:'date',l:'Mình muốn tìm hiểu nghiêm túc hơn trước',run:function(l,r,log,d){if(r()<.4)datePeer(l,d,log);else log(d.n+' không tìm một mối quan hệ lâu dài. Hai người chào nhau, không cố thuyết phục.','neutral');}},
 {k:'no',l:'Từ chối và về nhà',run:function(l,r,log){log('Bạn nói mình không muốn. Người ấy tôn trọng câu trả lời, hai người chào nhau ra về.','neutral');}}
]});
SC('casual_after101',{title:'Mong đợi khác nhau',valid:function(l,d){return single(l)&&d&&d.age>=18&&l.flags.casual101&&l.flags.casual101.at===d.at;},text:function(l,d){return d.n+' nhắn lại. Chuyện vốn được nói là không ràng buộc, nhưng có người đã thấy lưu luyến.';},opts:[
 {k:'talk',l:'Nói thật cảm xúc, hỏi xem có nên tìm hiểu tiếp',run:function(l,r,log,d){if(r()<.4)datePeer(l,d,log);else{H.fx(l,{hap:-2});log('Người ấy không muốn đi xa hơn. Bạn tôn trọng câu trả lời, không níu bằng chuyện đã xảy ra.','neutral');}delete l.flags.casual101;}},
 {k:'end',l:'Giữ đúng thỏa thuận, chào nhau tử tế',run:function(l,r,log){delete l.flags.casual101;log('Bạn nói rõ mình không muốn tiếp tục, không hứa điều mình không định làm.','neutral');}}
]});
trigger('map_mo101',single,.06,4,3);trigger('casual101',single,.035,5,2);
})(typeof window!=='undefined'?(window.G=window.G||{}):(globalThis.G=globalThis.G||{}));
