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
 {k:'continue',l:'Tiếp tục đều đặn với lịch vừa sức',run:function(l,r,log,d){if(!valid(l,d,0))return;var c=C.chain(l,d.cid),swim=c.data.activity==='swim';if(!learn(l,swim?'sport':'draw',c.data.activity==='private'?'tutor':c.data.activity!=='community',r,log)){X.next(l,'holidayContinue898',r,{cid:d.cid,token:d.token},{manual:false});return;}c=claim(l,d,0);c.data.sessions++;if(swim){l.flags.swimLessons898=(l.flags.swimLessons898||0)+1;if(l.flags.swimLessons898>=2){l.flags.swim=true;log('Sau hai kỳ tập có hướng dẫn, bạn hoàn thành kỹ năng bơi cơ bản trong mô phỏng; vẫn không bơi một mình ở ao, sông.','good');}}else log('Bạn hoàn thiện sản phẩm cũ, nhận ra tiến bộ nhờ luyện đều.','good');adjust(l,c,3);C.close(l,c,'continued',log,'Bạn giữ nhịp sở thích và lời hẹn; kỹ năng tiếp tục được dùng khi lớn lên.','good');}},
 {k:'light',l:'Giảm lịch, trao đổi trước rồi giữ sản phẩm làm kỷ niệm',run:function(l,r,log,d){var c=claim(l,d,0);if(!c)return;adjust(l,c,1);H.mem(l,'Tự chọn nhịp nghỉ hè vừa sức, giữ lại '+activity(c)+'.',3);C.close(l,c,'balanced',log,'Bạn không nhận thêm lịch học. Chưa cộng kỹ năng hoặc trừ học phí.','neutral');}},
 {k:'drop',l:'Bỏ dở mà không báo cho người đã hẹn',run:function(l,r,log,d){var c=claim(l,d,0);if(!c)return;var f=who(l,c);if(!f)return C.close(l,c,'changed_interest',log,'Bạn cất dự án lại, chưa nhận thêm lịch học.','neutral');adjust(l,c,-6);log(f.name+' chờ phản hồi nhưng không nhận được. Tình bạn có khoảng cách cần nói chuyện.','neutral');C.advance(l,c);}}
]});
E.SC('holidayFriend898',{title:'Một lời hẹn còn bỏ ngỏ',prep:prep,valid:function(l,d){return valid(l,d,1);},text:function(l,d){var c=C.chain(l,d.cid),f=who(l,c);return f?f.name+' vẫn nhớ lần bạn bỏ dở '+activity(c)+' mà không báo. '+(near(l,f)?'Có thể nói chuyện ở nơi đang sống.':'Hai bạn ở xa; chỉ trao đổi qua thư hoặc cuộc gọi, không gặp trực tiếp.'):'Người bạn cũ không còn trong danh sách liên lạc còn sống; bạn có thể khép lại kỷ niệm.';},opts:[
 {k:'talk',l:'Nhận lỗi vì im lặng, hỏi bạn có muốn nối lại liên lạc',run:function(l,r,log,d){var c=claim(l,d,1);if(!c)return;var f=who(l,c);if(f){adjust(l,c,4);log(f.name+' nhận lời giải thích. Niềm tin hồi phục một phần, không tự trở lại thân thiết như trước.','neutral');}C.close(l,c,'explained');}},
 {k:'part',l:'Tôn trọng khoảng cách, giữ kỷ niệm và đi tiếp',run:function(l,r,log,d){var c=claim(l,d,1);if(!c)return;C.close(l,c,'apart',log,'Bạn khép lại lời hẹn cũ. Người bạn vẫn giữ danh tính và lịch sử riêng.','neutral');}}
]});
var migrate=E.migrateExt;E.migrateExt=function(l){if(migrate)migrate(l);l.pending=(l.pending||[]).map(function(d){if(!['k6_ve_que','he_nay'].includes(d.id)||d.data&&d.data.id898)return d;var next=E.DEC[d.id].make(l,H.rf(l));next.manual=d.manual;Object.assign(next.data,d.data||{});return next;});};
E.CHILDHOOD898={context:context,learn:learn,here:here};
})(globalThis.G);
