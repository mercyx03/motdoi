/* Contextual holidays on the existing SC, LIFE138 and CHAIN144 mechanisms. */
(function(G){'use strict';
var E=G.E,H=E.H,U=G.U,C=E.CHAIN144,X=E.UPDATE110;
function context(l){return {country:H.resCode(l),urban:!!l.urban,place:l.abroad?(l.city||l.abroad.name):(l.place||l.city||'nơi đang sống'),rich:l.fam.q>=4};}
function free(l){return l.alive&&l.age>=6&&l.age<=15&&E.FAMILY53.free(l);}
function carer(l){var care=E.LIFE138.state(l).care,f=l.fam;if(['bố mẹ','bố','mẹ'].includes(care)){var m=f.mAlive&&!f.noMom,b=f.fAlive&&!f.noDad;return m&&b?'bố mẹ':m?'mẹ':b?'bố':E.orphanCarer&&E.orphanCarer(l)||'người chăm sóc';}return care||'người chăm sóc';}
function here(l){return E.LIFE138.place(l)+':'+!!l.urban;}
function friend(l){return E.friendsOf(l).filter(function(f){return Math.abs(f.d||0)<=2;})[0]||null;}
function who(l,c){var n=c&&c.npc&&E.NPC.find(l,c.npc.ref);return n&&n.alive&&n.obj||null;}
function near(l,f){return f&&(f.loc||'HOME')===E.locOf(l);}
function adjust(l,c,n){var f=who(l,c);if(f)E.NPC.adjustTrust(l,c.npc.ref,n);}
function mark(l,d){if(d.done898||l.flags.holidayAt898===l.age)return false;d.done898=true;l.flags.holidayAt898=l.age;return true;}
function learn(l,key,paid,r,log){
 var v=E.LIFE138.skill(l,key),before=v.at,d=E.DEC.practice138.make(l,r,{skill:key}),k=d.data.keys.indexOf(paid==='tutor'?'tutor2':paid?'club2':'self2');
 if(k<0)return false;E.DEC.practice138.apply(l,d,String(k),r,log);
 if(v.at===l.age&&before!==l.age)return true;
 log('Chưa bắt đầu thêm buổi luyện: kiểm tra ngân sách, số môn và quỹ giờ đang dùng. Không cộng thêm kỹ năng.','neutral');return false;
}
function startActivity(l,d,kind,r,log){
 if(!free(l)||d.done898||l.flags.holidayAt898===l.age)return;
 if(C.active(l,'holiday898')){log('Hoạt động hè trước vẫn đang chờ bước tiếp. Chưa đăng ký thêm khóa, chưa thu tiền.','neutral');return;}
 if(!learn(l,kind==='swim'?'sport':'draw',kind==='private'?'tutor':kind!=='community',r,log)){X.next(l,d.id898||'he_nay',r,null,{manual:false});return;}
 mark(l,d);H.fx(l,{hap:2});
 if(kind==='swim'){l.flags.swimLessons898=(l.flags.swimLessons898||0)+1;log(l.flags.swim?'Luyện bơi trong lớp có người hướng dẫn; biết bơi vẫn cần tuân thủ an toàn.':'Mới làm quen nước trong lớp có người hướng dẫn; chưa được tính là biết bơi và không tự ra sông, ao.','neutral');}
 else log(kind!=='community'?'Bạn giữ bức vẽ đầu tiên để năm sau sửa tiếp, chưa tự trở thành họa sĩ.':'Bạn cùng người chăm sóc làm sổ tranh từ vật liệu sẵn có, không cần học phí.','good');
 var f=friend(l),c=C.start(l,'holiday898',{dec:'he_nay',k:kind},{npc:f?{ref:X.uid(l,f),name:f.name}:null,data:{activity:kind,place:here(l),sessions:1}});
 if(c)log('Đã ghi dự định tiếp tục sở thích'+(f?' và lời hẹn rủ '+f.name+' cùng góp ý':'')+'. Năm sau có thể tiếp tục, giảm lịch hoặc đổi hướng.','neutral');
}
function outing(l,r,log,d){
 if(!free(l)||!mark(l,d))return;var x=context(l),t=x.urban?'Cùng '+carer(l)+' dạo công viên, đọc sách và chơi vận động ở '+x.place+'.':'Cùng '+carer(l)+' đi dạo đường làng, chăm luống cây và ngắm đồng từ lối đi an toàn.';
 log(t,'good');H.fx(l,{hap:3,hea:1,soc:1});H.mem(l,t,3);
}
function home(l,r,log,d){if(!free(l)||!mark(l,d))return;log('Ở '+context(l).place+', bạn cùng '+carer(l)+' nấu món đơn giản, đọc sách và nghỉ ngơi.','good');H.fx(l,{hap:2});}
function holiday(id){
 E.SC(id,{title:'Một kỳ nghỉ phù hợp với gia đình',prep:function(l){return {id898:id,place898:here(l),at898:l.age};},valid:function(l,d){return free(l)&&(!d||!d.done898)&&(!d||d.at898==null||d.at898===l.age)&&(!d||!d.place898||d.place898===here(l));},
 text:function(l){var x=context(l);return 'Bạn đang sống ở '+x.place+(x.urban?' trong khu vực thành thị.':' trong khu vực nông thôn.')+' '+U.cap(carer(l))+' cùng bạn thu xếp kỳ nghỉ. '+(x.rich?'Gia đình có thể cân nhắc lớp sở thích, nhưng vẫn cần kiểm tra lịch và ngân sách thực tế.':'Có cả hoạt động miễn phí và lớp có học phí để chọn theo ngân sách.');},opts:[
 {k:id==='k6_ve_que'?'tam_ao':'grand',l:function(l){return context(l).urban?'Cùng người chăm sóc đi công viên, đọc sách':'Cùng người chăm sóc khám phá quanh làng';},run:outing},
 {k:'swim',l:'Tập bơi có hướng dẫn, tiếp tục từng năm',h:function(l){return 'Dùng quỹ giờ Thể thao hiện có · học phí dự kiến '+H.money(l,l.base*.004)+'; thanh toán theo ngân sách người chăm sóc.';},run:function(l,r,log,d){startActivity(l,d,'swim',r,log);}},
 {k:'art',l:'Bắt đầu dự án vẽ qua các kỳ nghỉ',h:function(l){return 'Dùng quỹ giờ Vẽ hiện có · học phí dự kiến '+H.money(l,l.base*.004);},run:function(l,r,log,d){startActivity(l,d,'art',r,log);}},
 {k:'private',l:'Học vẽ riêng nếu gia đình thu xếp được',req:function(l){return context(l).rich;},h:function(l){return 'Hai giờ/tuần · dự kiến '+H.money(l,l.base*.048)+'; vẫn cần người chăm sóc đồng ý, đủ ngân sách và quỹ giờ.';},run:function(l,r,log,d){startActivity(l,d,'private',r,log);}},
 {k:'community',l:'Làm sổ tranh tại nhà, rủ bạn góp ý',h:'Miễn học phí; vẫn dùng quỹ giờ luyện tập và giới hạn môn hiện có.',run:function(l,r,log,d){startActivity(l,d,'community',r,log);}},
 {k:'help',l:function(l){return context(l).urban?'Phụ việc nhà vừa sức rồi nghỉ cùng gia đình':'Phụ chăm cây, dọn nhà cùng người lớn';},run:function(l,r,log,d){if(!mark(l,d))return;log('Bạn phụ việc vừa sức có người lớn hướng dẫn, rồi nghỉ cùng gia đình.','neutral');H.fx(l,{hap:1,karma:1});}},
 {k:id==='k6_ve_que'?'nho_nha':'tv',l:'Nghỉ ở nhà, cùng người chăm sóc chọn lịch nhẹ nhàng',run:home}
 ]});
 var current=E.DEC[id],apply=current.apply;
 current.apply=function(l,d,k,r,log){if(!current.valid(l,d.data)){log('Hoàn cảnh hoặc kỳ nghỉ đã đổi; chưa thực hiện. Hãy xem lại kế hoạch tại nơi đang sống.','neutral');return;}return apply.apply(this,arguments);};
}
holiday('k6_ve_que');holiday('he_nay');
// Bad weather never sends a child onto the roof, regardless of family wealth.
var storm=E.DEC.k6_bao;if(storm){storm.def.text=function(l){return 'Có cảnh báo thời tiết xấu tại '+context(l).place+'. '+U.cap(carer(l))+' kiểm tra chỗ ở và thu xếp nơi an toàn.';};storm.def.opts.forEach(function(o){o.l=o.k==='phu'?'Cất đồ nhẹ trong nhà theo hướng dẫn':'Ở nơi an toàn cùng người chăm sóc';o.run=function(l,r,log){log('Bạn ở nơi trú an toàn, phụ cất đồ nhẹ theo hướng dẫn. Người lớn xử lý điện, cửa và việc sửa chữa; trẻ không leo mái hay ra ngoài giữa thời tiết xấu.','neutral');H.fx(l,{hap:1});};});}
C.KINDS.holiday898={max:3,cancel:function(l){if(l.age>15)return {result:'grown',text:'Hoạt động hè tuổi nhỏ khép lại; kỹ năng và kỷ niệm đã có vẫn được giữ.'};},stages:[
 {dec:'holidayContinue898',after:[1,2],p:1,when:function(l){return free(l);}},
 {dec:'holidayFriend898',after:[1,2],p:1,when:function(l){return free(l);}}
]};
function valid(l,d,stage){var c=d&&C.chain(l,d.cid);return !!(free(l)&&c&&c.kind==='holiday898'&&c.stage===stage&&c.open&&c.open.token===d.token&&!d.done);}
function claim(l,d,stage){if(!valid(l,d,stage))return null;var c=C.chain(l,d.cid);d.done=true;c.open=null;c.last=l.age;return c;}
function prep(l,r,a){return {cid:a&&a.cid,token:a&&a.token,done:false};}
function activity(c){if(!c)return 'hoạt động hè';return c.data.activity==='swim'?'buổi học bơi':c.data.activity!=='community'?'dự án vẽ':'cuốn sổ tranh';}
E.SC('holidayContinue898',{title:'Mùa hè sau lời hẹn',prep:prep,valid:function(l,d){return valid(l,d,0);},text:function(l,d){var c=C.chain(l,d.cid),f=who(l,c);if(!c)return 'Hoạt động hè này đã khép lại.';return 'Năm trước bạn bắt đầu '+activity(c)+'. '+(c.data.place!==here(l)?'Bạn đã chuyển nơi ở; cần tiếp tục tại nơi mới. ':'')+(f?f.name+(near(l,f)?' vẫn nhớ dự định chung. ':' đang ở xa, có thể góp ý qua thư hoặc cuộc gọi. '):'Bạn xem lại điều từng muốn làm. ')+'Chưa tự đóng học phí hoặc cộng kỹ năng.';},opts:[
 {k:'continue',l:'Tiếp tục đều đặn với lịch vừa sức',run:function(l,r,log,d){if(!valid(l,d,0))return;var c=C.chain(l,d.cid),swim=c.data.activity==='swim';if(!learn(l,swim?'sport':'draw',c.data.activity==='private'?'tutor':c.data.activity!=='community',r,log)){X.next(l,'holidayContinue898',r,{cid:d.cid,token:d.token},{manual:false});return;}c=claim(l,d,0);c.data.sessions++;if(swim){l.flags.swimLessons898=(l.flags.swimLessons898||0)+1;if(l.flags.swimLessons898>=2){l.flags.swim=true;log('Sau hai kỳ tập có hướng dẫn, bạn hoàn thành kỹ năng bơi cơ bản; vẫn không bơi một mình ở ao, sông.','good');}}else log('Bạn hoàn thiện sản phẩm cũ, nhận ra tiến bộ nhờ luyện đều.','good');adjust(l,c,3);C.close(l,c,'continued',log,'Bạn giữ nhịp sở thích và lời hẹn; kỹ năng tiếp tục được dùng khi lớn lên.','good');}},
 {k:'light',l:'Giảm lịch, trao đổi trước rồi giữ sản phẩm làm kỷ niệm',run:function(l,r,log,d){var c=claim(l,d,0);if(!c)return;adjust(l,c,1);H.mem(l,'Tự chọn nhịp nghỉ hè vừa sức, giữ lại '+activity(c)+'.',3);C.close(l,c,'balanced',log,'Bạn không nhận thêm lịch học. Chưa cộng kỹ năng hoặc trừ học phí.','neutral');}},
 {k:'drop',l:'Bỏ dở mà không báo cho người đã hẹn',run:function(l,r,log,d){var c=claim(l,d,0);if(!c)return;var f=who(l,c);if(!f)return C.close(l,c,'changed_interest',log,'Bạn cất dự án lại, chưa nhận thêm lịch học.','neutral');adjust(l,c,-6);log(f.name+' chờ phản hồi nhưng không nhận được. Tình bạn có khoảng cách cần nói chuyện.','neutral');C.advance(l,c);}}
]});
E.SC('holidayFriend898',{title:'Một lời hẹn còn bỏ ngỏ',prep:prep,valid:function(l,d){return valid(l,d,1);},text:function(l,d){var c=C.chain(l,d.cid),f=who(l,c);return f?f.name+' vẫn nhớ lần bạn bỏ dở '+activity(c)+' mà không báo. '+(near(l,f)?'Có thể nói chuyện ở nơi đang sống.':'Hai bạn ở xa; chỉ trao đổi qua thư hoặc cuộc gọi, không gặp trực tiếp.'):'Người bạn cũ không còn trong danh sách liên lạc còn sống; bạn có thể khép lại kỷ niệm.';},opts:[
 {k:'talk',l:'Nhận lỗi vì im lặng, hỏi bạn có muốn nối lại liên lạc',run:function(l,r,log,d){var c=claim(l,d,1);if(!c)return;var f=who(l,c);if(f){adjust(l,c,4);log(f.name+' nhận lời giải thích. Niềm tin hồi phục một phần, không tự trở lại thân thiết như trước.','neutral');}C.close(l,c,'explained');}},
 {k:'part',l:'Tôn trọng khoảng cách, giữ kỷ niệm và đi tiếp',run:function(l,r,log,d){var c=claim(l,d,1);if(!c)return;C.close(l,c,'apart',log,'Bạn khép lại lời hẹn cũ. Người bạn vẫn giữ danh tính và lịch sử riêng.','neutral');}}
]});
var migrate=E.migrateExt;E.migrateExt=function(l){if(migrate)migrate(l);l.pending=(l.pending||[]).map(function(d){if(!['k6_ve_que','he_nay'].includes(d.id)||d.data&&d.data.id898)return d;var next=E.DEC[d.id].make(l,H.rf(l));next.manual=d.manual;Object.assign(next.data,d.data||{});return next;});};
E.CHILDHOOD898={context:context,learn:learn,here:here};

// 8.10.59: tuổi thơ theo nơi đang sống; không suy văn hóa từ ngôn ngữ giao diện.
function childContext(l){var country=H.resCode(l),royal=!!(l.flags.royal&&!l.flags.royal.quit);return {country:country,vn:country==='VN',royal:royal,urban:!!l.urban,adapt:country!=='VN'||royal};}
function playFriend(l){return E.friendsOf(l).find(function(f){return f.alive!==false&&Math.abs(f.d||0)<=2&&near(l,f);})||null;}
function invited(l){var f=playFriend(l);return f?f.name:'một bạn cùng tuổi';}
var localKids={
 k_ban_hang:{text:function(l){return childContext(l).royal?'Người chăm sóc đã thu xếp buổi chơi tại nhà với bạn cùng tuổi. Bạn muốn bày quầy hàng đồ chơi trong khu vực được phép, có người lớn ở gần.':'Bạn cùng người chăm sóc bày quầy hàng giả trong góc chơi, dùng đồ chơi hoặc hộp giấy sẵn có. Đây là trò đóng vai, không buôn bán thật.';},opts:{ban:['Cùng người chăm sóc hẹn bạn đến chơi',function(l){return 'Bạn và '+invited(l)+' thay phiên làm người bán, người mua, dùng thẻ giấy tự làm hoặc đồng xu đồ chơi. '+(childContext(l).royal?'Buổi chơi diễn ra theo lịch đã thu xếp, có người chăm sóc ở gần.':'Người lớn đã trao đổi với gia đình bạn trước buổi chơi.')+' Không dùng tiền thật; vui nhất là cùng nghĩ ra câu chuyện.';}],ba:['Mời người chăm sóc / người nhà đóng vai khách','Người chăm sóc hoặc người nhà đóng vai khách, cùng bạn đếm thẻ giấy và cất đồ sau buổi chơi. Không mua bán bằng tiền thật.']}},
 k_mat_dien:{title:'Một buổi mất điện',text:'Khu vực đang ở bị mất điện. Người lớn kiểm tra tình hình, chuẩn bị đèn pin và giữ trẻ ở chỗ an toàn.',opts:{ma:['Nghe người thân kể chuyện dưới ánh đèn pin','Bạn nghe người thân kể chuyện trong lúc chờ có điện. Cả nhà ở cùng nhau.'],ngo:['Chơi đoán đồ vật ở nơi người lớn đã kiểm tra','Bạn cùng người lớn chơi đoán đồ vật ở chỗ an toàn; không tự chạy ra đường trong bóng tối.'],quat:['Phụ lấy đèn pin và nước uống','Bạn phụ lấy đèn pin, nước uống rồi ngồi cùng người chăm sóc, không chạm vào thiết bị điện.']}},
 k_nuoi_tam:{text:'Thầy cô giao quan sát một sinh vật nhỏ phù hợp với điều kiện gia đình, hoặc một chậu cây. Người chăm sóc giúp bạn chọn cách theo dõi.',opts:{cham:[null,'Bạn chăm sóc đều đặn, ghi lại thay đổi và được thầy cô khen bài quan sát cẩn thận.'],quen:[null,'Bạn bỏ quên vài lần chăm sóc, phải nhờ người lớn giúp và bắt đầu lại sổ theo dõi.']}},
 k_ve_que_ngoai:{title:'Kỳ nghỉ cùng người thân',text:'Gia đình thu xếp kỳ nghỉ với người thân. Hoạt động được chọn theo nơi đến và người có thể chăm sóc bạn.',opts:{bat_ca:['Cùng người thân khám phá quanh nơi nghỉ','Bạn cùng người thân đi dạo, quan sát cây cối và chơi vận động ở nơi được phép. Mỗi ngày có thêm một chuyện để kể.'],nho_nha:[null,'Bạn nhớ nhà và nói với người chăm sóc. Gia đình điều chỉnh lịch nghỉ để bạn thấy yên tâm hơn.']}},
 k_ngu_trua:{title:'Giờ nghỉ và giờ chơi',text:'Đến giờ nghỉ yên tĩnh, bạn vẫn muốn chơi tiếp. Người chăm sóc đang ở gần.',opts:{tron:['Xin đổi sang một hoạt động nhẹ',function(l){return childContext(l).royal?'Bạn trao đổi với người chăm sóc rồi cùng chọn trò xếp hình ở khu vực được phép, không tự rời nhà.':'Bạn xin chơi xếp hình hoặc đọc sách thay vì ngủ; người chăm sóc cùng bạn thống nhất giờ nghỉ.';}],ngu:['Nghỉ một lát rồi chơi sau','Bạn nghỉ một lát, thức dậy thấy khỏe hơn và cùng người chăm sóc chọn trò chơi tiếp.']}},
 k_truyen_tranh:{text:'Bạn bè đang chuyền tay những cuốn truyện tranh phù hợp tuổi, và bạn cũng muốn đọc.',opts:{thue:['Mượn truyện ở thư viện hoặc đổi với bạn','Bạn mượn truyện ở thư viện hoặc trao đổi với bạn, dành thời gian đọc sau giờ học mà không bỏ bữa.']}},
 k_mua_da:{text:'Có mưa đá tại nơi đang sống. Người chăm sóc đưa bạn vào trong nhà, tránh xa cửa kính.',opts:{nhat:['Chờ hết mưa, cùng người lớn xem những viên đá','Sau khi mưa tạnh và người lớn kiểm tra an toàn, bạn cùng xem những viên đá còn sót lại; không ra ngoài giữa cơn mưa.']}},
 k_om_chao:{opts:{chao:['Nghỉ ngơi, được người chăm sóc chuẩn bị đồ ăn nhẹ',function(l){return U.cap(carer(l))+' chuẩn bị đồ ăn nhẹ phù hợp, nước uống và ở bên theo dõi bạn. Bạn nghỉ theo hướng dẫn chăm sóc.';}]}},
 k_bau_lop_truong:{title:'Đại diện nhóm học',text:'Thầy cô mời các bạn chọn đại diện cho một hoạt động của lớp hoặc nhóm học.',opts:{nhan:['Nhận lời thử vai trò đại diện','Bạn thử làm đại diện, lắng nghe các bạn và nhờ thầy cô hướng dẫn khi chưa biết cách thu xếp.']}},
 k_tham_quan:{text:'Lớp hoặc nhóm học thu xếp chuyến tham quan phù hợp tuổi. Gia đình cùng xem lịch và điều kiện tham gia.',opts:{di:['Đi cùng lớp và người phụ trách','Bạn cùng lớp và người phụ trách tham quan, ghi lại những điều thú vị rồi kể với gia đình.'],o_nha:['Chọn hoạt động khác cùng người chăm sóc','Gia đình chọn hoạt động khác phù hợp lịch và điều kiện hiện tại, bạn có thể xem tài liệu chuyến đi sau.']}},
 k_cho_duoi:{text:'Trong một buổi đi bộ cùng người lớn, một con chó bất ngờ chạy về phía bạn.',opts:{chay:['Lùi về phía người lớn đi cùng','Bạn lùi về gần người lớn; họ giúp tạo khoảng cách với con chó. Bạn vẫn còn hơi hoảng.'],dung:['Bình tĩnh làm theo hướng dẫn của người lớn','Bạn giữ bình tĩnh bên người lớn và tránh chọc con chó. Chủ của nó đến đưa nó đi.']}},
 k_trong_em:{title:'Chơi cùng em nhỏ',text:'Người chăm sóc nhờ bạn chơi cùng em trong lúc họ làm việc ở gần. Bạn không phải tự chịu trách nhiệm chăm em cả buổi.',opts:{trong:['Chơi cùng em, nhờ người lớn khi cần','Bạn chơi cùng em và gọi người chăm sóc khi em cần ăn hoặc buồn ngủ. Hai anh chị em có thêm kỷ niệm.'],choi:['Mải chơi riêng, quên để ý đến em','Bạn mải chơi riêng, người chăm sóc nhắc quay lại và cùng bạn thu xếp trò cho cả hai.']}},
 k_ga_con:{title:'Chăm sóc con vật nhỏ',text:function(l){return U.cap(carer(l))+' cùng bạn tìm hiểu cách chăm sóc con vật nhỏ ở nơi có điều kiện phù hợp.';},opts:{cham:[null,function(l){return 'Bạn phụ '+carer(l)+' cho con vật ăn và giữ chỗ ở sạch theo hướng dẫn. Bạn học cách chăm sóc đều đặn, không tự mang con vật ra chợ bán.';}],nhot:['Xin người lớn giúp chuẩn bị chỗ ở phù hợp','Bạn hỏi người lớn thay vì nhốt con vật vào hộp mang đi chơi. Cả nhà cùng kiểm tra chỗ ở phù hợp.']}}
};
Object.keys(localKids).forEach(function(id){var dec=E.DEC[id];if(!dec)return;var spec=localKids[id],def=dec.def,make=dec.make,apply=dec.apply;
 ['title','text'].forEach(function(key){if(!spec[key])return;var old=def[key];def[key]=function(l,d){var val=childContext(l).adapt?spec[key]:old;return typeof val==='function'?val(l,d):val;};});
 def.opts.forEach(function(o){var row=spec.opts[o.k];if(!row)return;if(row[0]){var label=o.l;o.l=function(l,d){return childContext(l).adapt?row[0]:typeof label==='function'?label(l,d):label;};}var run=o.run;o.run=function(l,r,log,d){return run(l,r,function(t,kind){if(childContext(l).adapt)t=typeof row[1]==='function'?row[1](l):row[1];log(t,kind);},d);};});
 if(id==='k_ban_hang'){def.valid=function(l){return l.alive&&l.age>=4&&l.age<=8&&E.FAMILY53.free(l);};var originalPrep=def.prep;def.prep=function(l,r,a){var d=originalPrep?originalPrep(l,r,a):Object.assign({},a||{});d.playContext859=H.resCode(l);return d;};
 dec.apply=function(l,d,k,r,log){if(d.data.playDone859||!dec.valid(l,d.data))return;if(!d.opts.some(function(o){return o.k===k;}))return;if(d.data.playContext859&&d.data.playContext859!==H.resCode(l)){log('Nơi sống đã đổi; cần thu xếp lại buổi chơi cùng người chăm sóc. Chưa thực hiện.','neutral');return;}var f=k==='ban'?playFriend(l):null;apply.apply(this,arguments);d.data.playDone859=true;l.flags.childPlay859={at:l.age,country:H.resCode(l),royal:childContext(l).royal,friendRef:f?X.uid(l,f):null,kind:k};if(f){E.LIFE138.sync(l);E.NPC.adjustTrust(l,X.uid(l,f),2);}};}
 dec.make=function(l,r,arg){var d=make(l,r,arg);d.data.localized859=true;return d;};
});
// Sự kiện đặc thù Việt Nam chỉ theo nơi đang sống, không theo quốc tịch gốc.
var vnKids=['k_tro_dan_gian','k_an_co','k_co_do','k_ong_ba_ke','k_bong_da_dem','k_mon_qua_co','k_rung_rang','k_ke_hoach_nho'];
vnKids.forEach(function(id){var d=E.DEC[id];if(!d)return;var valid=d.valid;d.valid=function(l,a){return H.resCode(l)==='VN'&&valid(l,a);};E.TRIG.filter(function(t){return t.id===id;}).forEach(function(t){var when=t.when;t.when=function(l,a){return H.resCode(l)==='VN'&&when(l,a);};});});
var migrateLocal=E.migrateExt;E.migrateExt=function(l){if(migrateLocal)migrateLocal(l);l.pending=(l.pending||[]).map(function(d){if(!localKids[d.id])return d;var next=E.DEC[d.id].make(l,H.rf(l),Object.assign({},d.data||{}));next.manual=d.manual;return next;});};
E.CHILDHOOD898.childContext=childContext;

})(globalThis.G);
