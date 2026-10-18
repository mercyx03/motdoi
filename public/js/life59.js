/* v4.9.0 — nghề phi pháp và mạng tội phạm theo nơi đang sống.
   Không tái hiện tổ chức thật; xác suất / thu nhập / mức án là cân bằng game. */
(function(G){
'use strict';var E=G.E,H=E.H,U=G.U,W=G.W;
var JOBS={doi_no:'cưỡng đoạt tài sản / đòi nợ bằng đe dọa',cho_vay:'tín dụng đen kèm cưỡng ép',lua_dao:'lừa đảo chiếm đoạt tài sản qua mạng',trom:'trộm cắp tài sản',ma_tuy:'mua bán trái phép chất gây nghiện',buon_lau:'buôn lậu hàng hóa',nha_cai:'tổ chức cá cược trái phép'};
var PROFILES=[
 ['jp','JP','Nhật Bản',['nhóm Yakuza','băng nhóm tội phạm'],['Lời mời từ một nhóm Yakuza','Một mối liên hệ rủ bạn gắn với nhóm Yakuza. Gia nhập không phải chuyện tự động và không thay thế điều kiện vào nghề.'],['Mối quan hệ trong nhóm','Một thành viên đòi bạn chứng minh sự trung thành, trong khi tranh chấp nội bộ ngày càng căng.']],
 ['it','IT','Ý',['nhóm kiểu Mafia','mạng tội phạm xuyên biên giới'],['Quan hệ kiểu gia tộc','Nhóm kiểu Mafia muốn biến quan hệ cá nhân thành nghĩa vụ lâu dài. Bạn không phải người thân của họ.'],['Chỗ trống quyền lực','Một người điều hành bị điều tra. Nhiều bên đòi phần ảnh hưởng, không ai có vị trí được bảo đảm.']],
 ['ru','RU','Nga',['mạng tội phạm kiểu Mafia','băng nhóm địa phương'],['Tranh chấp giữa các đầu mối','Hai người trong mạng tội phạm tại Nga bất đồng về khoản tiền bị thiếu.'],['Lời hứa chống lưng','Một đầu mối hứa sẽ bảo vệ bạn nếu tiếp tục dính líu. Lời hứa đó không làm bạn miễn bị bắt hoặc phản bội.']],
 ['us','US','Mỹ',['nhóm kiểu Mafia','băng nhóm địa phương'],['Một đầu mối mới','Một người trong mạng tội phạm ở Mỹ đòi mở rộng quan hệ, nhưng bạn chưa biết trách nhiệm đi kèm.'],['Đồng phạm bị triệu tập','Một người liên quan bị cơ quan điều tra triệu tập. Bạn chưa biết họ sẽ khai những gì.']],
 ['mx','MX','Mexico',['nhóm kiểu cartel','mạng tội phạm địa phương'],['Áp lực từ nhóm kiểu cartel','Nhóm kiểu cartel yêu cầu các thành viên chịu thêm rủi ro, trong khi phần thu nhập không minh bạch.'],['Mâu thuẫn về người đứng đầu','Hai người tự nhận quyền điều hành cùng gây sức ép với bạn; việc đứng về bên nào cũng có hậu quả.']],
 ['co','CO','Colombia',['nhóm kiểu cartel','mạng tội phạm'],['Quan hệ cũ quay lại','Một người từng liên quan đến nhóm kiểu cartel muốn kéo bạn sâu hơn vào việc bất chính.'],['Khoản tiền đang tranh chấp','Một khoản chia phần bị nhiều bên đòi nhận, làm mối liên hệ trong nhóm rạn nứt.']],
 ['br','BR','Brazil',['băng nhóm tội phạm','mạng tội phạm'],['Người mới và người cũ','Nhóm có người mới gia nhập, người cũ lo bị mất ảnh hưởng.'],['Người quen muốn rời nhóm','Một thành viên nói muốn rút lui, nhưng người điều hành chưa chịu chấp nhận.']],
 ['uk','GB,IE','Anh / Ireland',['mạng tội phạm có tổ chức','băng nhóm địa phương'],['Đầu mối bị bắt giữ','Một đầu mối trong mạng tội phạm ở nơi bạn sống bị bắt giữ; chưa có kết quả điều tra cuối cùng.'],['Xung đột lợi ích','Những người có liên quan tranh cãi về khoản tiền và trách nhiệm pháp lý.']],
 ['eu','FR,DE,ES,PT,NL,BE,CH,AT,SE,NO,FI,DK,PL,GR,CZ,RO,BG,HU,HR,SK,SI,EE,LV,LT','châu Âu',['mạng tội phạm xuyên biên giới','nhóm kiểu Mafia'],['Liên hệ xuyên biên giới','Mạng ở nước bạn đang sống có quan hệ bên ngoài. Điều này không tự cho bạn quyền hoạt động hay miễn trách nhiệm tại nước khác.'],['Một vụ điều tra phối hợp','Nhóm nghe tin một số đầu mối đang bị nhiều cơ quan điều tra theo dõi. Không ai biết kết quả cuối cùng.']],
 ['ca','CA','Canada',['mạng tội phạm có tổ chức','băng nhóm địa phương'],['Lời hứa chia lợi nhuận','Một đầu mối hứa chia thêm tiền nhưng không chịu làm rõ trách nhiệm.'],['Người liên quan đổi lời','Một người quen trong nhóm phủ nhận thỏa thuận cũ, khiến tranh chấp tăng lên.']],
 ['pac','AU,NZ','Úc / New Zealand',['mạng tội phạm có tổ chức','băng nhóm địa phương'],['Tranh chấp trong mạng lưới','Một tranh chấp về phần tiền làm những người liên quan quay sang gây sức ép với nhau.'],['Một cơ hội làm lại','Bạn nghe về một cơ hội tìm việc hợp pháp, nhưng nhóm muốn bạn tiếp tục liên quan.']],
 ['sea','TH,KH,LA,MM,MY,SG,ID,PH,BN,TL','Đông Nam Á',['mạng tội phạm xuyên biên giới','băng nhóm địa phương'],['Lời mời hợp tác đáng ngờ','Một người trong mạng muốn bạn tham gia việc mới mà không nói rõ hậu quả. Người đang bị ép trong trại lừa đảo không được coi là tự nguyện gia nhập.'],['Người liên quan muốn cầu cứu','Một người trong mối liên hệ nói họ bị đe dọa và muốn tìm hỗ trợ an toàn.']],
 ['asia','CN,KR,MN,IN,PK,BD,LK,NP,BT','châu Á',['mạng tội phạm có tổ chức','băng nhóm địa phương'],['Mâu thuẫn giữa các mối liên hệ','Một khoản tiền và lời hứa không khớp khiến những người liên quan tranh cãi.'],['Danh tiếng giả tạo','Người điều hành muốn bạn tin rằng họ không thể bị điều tra. Bạn không có bằng chứng cho lời khẳng định đó.']],
 ['other','','quốc gia đang sống',['mạng tội phạm có tổ chức','băng nhóm địa phương'],['Một liên hệ có tổ chức','Một người rủ bạn gắn với mạng tội phạm ở nơi đang sống. Bạn có quyền từ chối.'],['Quan hệ cũ trở thành gánh nặng','Những nghĩa vụ không rõ ràng bắt đầu khiến bạn mất thời gian và lo ngại về trách nhiệm.']]
];
var CASES=[],BY={};PROFILES.forEach(function(p){p[1].split(',').filter(Boolean).forEach(function(code){BY[code]=p;});[p[4],p[5]].forEach(function(c,i){CASES.push({id:'network_'+p[0]+'_'+i,profile:p[0],joined:true,title:c[0],text:c[1]});});});
var ROWS=`
doi_no|Đòi một khoản không rõ ràng|Người bị đe dọa nói rằng khoản nợ bị ghi sai. Bạn không có căn cứ để coi lời đe dọa là hợp pháp.
doi_no|Người bị hại tìm hỗ trợ|Một người bị nhóm gây sức ép đã tìm hỗ trợ pháp lý. Những việc đã làm vẫn có thể bị xem xét.
doi_no|Mâu thuẫn về tiền chia|Người liên quan đòi phần tiền vượt thỏa thuận cũ, làm phát sinh tranh chấp.
doi_no|Hậu quả của đe dọa|Bạn nhận ra việc đe dọa gây tổn hại thật, còn người giao việc cố đẩy trách nhiệm sang bạn.
cho_vay|Khoản thu bị tranh cãi|Người vay phản đối các khoản thu và hành vi cưỡng ép. Không thể coi mọi khoản cho vay hợp pháp là tín dụng đen.
cho_vay|Một lời tố cáo|Một người bị đe dọa gửi thông tin cho cơ quan chức năng, bạn phải đối mặt khả năng bị điều tra.
cho_vay|Người cùng nhóm giấu tiền|Số tiền được chia không khớp lời hứa; người giữ tiền không giải thích rõ.
cho_vay|Muốn chấm dứt cưỡng ép|Bạn cân nhắc ngừng những hành vi đe dọa, nhưng các mối liên hệ cũ vẫn gây sức ép.
lua_dao|Người bị hại lên tiếng|Người bị lừa chia sẻ câu chuyện và đề nghị cơ quan chức năng tiếp nhận thông tin.
lua_dao|Đồng phạm bị bắt|Một người có liên quan bị bắt; bạn chưa biết phạm vi điều tra tới đâu.
lua_dao|Khoản chia bị giữ lại|Người hứa trả tiền liên tục trì hoãn, trong khi trách nhiệm của bạn không biến mất.
lua_dao|Nhận ra tổn hại|Bạn nghe hoàn cảnh của một người bị chiếm đoạt tiền. Đây không còn là những con số vô danh.
trom|Tài sản bị nhận diện|Một món tài sản liên quan tới vụ trộm được người sở hữu nhận diện. Bạn có nguy cơ phải chịu trách nhiệm.
trom|Người quen muốn rút|Một người từng liên quan nói không muốn tiếp tục, khiến bạn phải nhìn lại lựa chọn của mình.
trom|Tranh chấp khoản tiền|Một người đòi phần tiền mà bạn không chấp nhận; cả hai đều có những việc không muốn nhắc lại.
trom|Dấu vết từ vụ cũ|Bạn được biết một vụ trộm trước đây vẫn đang được xem xét, không tự biến mất vì thời gian trôi qua.
ma_tuy|Người liên quan gặp nạn|Một người trong các mối liên hệ của bạn gặp vấn đề sức khỏe nghiêm trọng. Hoạt động trái phép gây hậu quả ngoài tiền bạc.
ma_tuy|Lời hứa thu nhập cao|Một người muốn bạn nhận thêm trách nhiệm để đổi lấy tiền, nhưng không thể bảo đảm an toàn.
ma_tuy|Mối liên hệ bị điều tra|Một người liên quan bị cơ quan chức năng điều tra. Chức vụ cao không tạo miễn trừ.
ma_tuy|Khoản tiền thiếu hụt|Khoản chia phần không như lời hứa, người có liên quan quay sang đổ trách nhiệm cho nhau.
buon_lau|Hàng bị thu giữ|Một phần tài sản liên quan bị lực lượng chức năng thu giữ. Bạn chưa biết kết luận xử lý.
buon_lau|Đối tác biến mất|Một người từng hứa chia lợi nhuận ngừng liên lạc, khiến bạn có nguy cơ mất khoản đã góp.
buon_lau|Người liên quan bị triệu tập|Một đầu mối bị triệu tập làm việc; không có chức vụ nào bảo đảm được miễn trách nhiệm.
buon_lau|Một cơ hội rút lui|Một người quen nói muốn dừng việc trái phép và tìm công việc hợp pháp.
nha_cai|Tranh chấp tiền cược|Một người tham gia cá cược trái phép đòi tiền, tranh chấp lan sang các mối liên hệ khác.
nha_cai|Người chơi lâm vào cảnh nợ|Bạn biết việc tổ chức cá cược trái phép đang gây tổn hại cho người tham gia.
nha_cai|Người cùng nhóm sai hẹn|Một người giữ khoản tiền không chịu làm rõ phần chia, khiến áp lực tăng lên.
nha_cai|Hoạt động bị xem xét|Bạn nghe rằng hoạt động cá cược không phép có thể bị cơ quan chức năng điều tra. Casino hoặc cá cược có phép không tự động bị coi là nghề này.
`.trim().split('\n');ROWS.forEach(function(line,i){var x=line.split('|');CASES.push({id:'job_'+i,job:x[0],title:x[1],text:x[2]});});
[
 ['Cơ hội rời việc bất chính','Có người giới thiệu cách tìm việc hợp pháp. Chưa có lời hứa chắc chắn được tuyển.'],
 ['Sức ép từ người liên quan','Một người trong mối liên hệ đòi bạn chịu thêm trách nhiệm về việc trước đây.'],
 ['Tin đồn trong băng nhóm','Trong nhóm rộ lên tin có người khai báo với cảnh sát. Ai cũng nghi ngờ nhau.'],
 ['Giữ lại một đường lui','Bạn cân nhắc dừng việc trái phép trước khi gây thêm tổn hại.'],
 ['Khoản vốn có thể mất','Một người quen rủ bạn góp tiền vào vụ làm ăn mới nhưng chưa nói rõ cách chia lợi nhuận.'],
 ['Gia đình cần câu trả lời','Một người thân còn sống muốn biết vì sao bạn luôn lo lắng, nhưng bạn chưa biết nên nói thế nào.',true],
 ['Đối diện chuyện cũ','Một chuyện trước đây có thể bị xem xét trở lại; rời nghề không tự xóa trách nhiệm.'],
 ['Người quen muốn làm lại','Một người liên quan nói họ cần hỗ trợ để tìm cuộc sống hợp pháp, không muốn nghe thêm lời hứa kiếm tiền nhanh.']
].forEach(function(x,i){CASES.push({id:'common_'+i,title:x[0],text:x[1],family:x[2]});});
function current(l){return l.abroad&&l.abroad.code||l.country;}
function foreign(l){return current(l)!=='VN'&&!!W.BY[current(l)];}
function free(l){return l.alive&&l.age>=18&&!(l.jailUntil!=null&&l.age<l.jailUntil)&&!(l.flags.military&&l.age<l.flags.military)&&!(l.abroad&&l.abroad.trapped);}
function job(l){return l.job&&JOBS[E.resolveJob(l.job.id)]?E.resolveJob(l.job.id):null;}
function profile(l){return BY[current(l)]||PROFILES[PROFILES.length-1];}
function state(l){
 var s=l.flags.worldCrime||(l.flags.worldCrime={groups:{},seen:{},serial:0,count:0}),code=current(l);
 if(s.current!==code){var old=s.groups[s.current];if(old)old.joined=false;s.current=code;s.serial++;var u=l.flags.underworld;if(u&&u.worldOrigin&&u.worldOrigin!==code)u.linked=false;}
 if(!s.groups[code])s.groups[code]={joined:false,choice:0,trust:30};return s;
}
function group(l){var s=state(l);return s.groups[current(l)];}
function label(l){var p=profile(l),g=group(l);return p[3][g.choice||0];}
function hasFamily(l){return !!(l.fam&&(l.fam.mAlive||l.fam.fAlive))||!!(l.partner&&l.partner.alive!==false)||(l.kids||[]).some(function(k){return k.alive===true;})||(l.sibList||[]).some(function(k){return k.alive===true;});}
function under(l){return l.flags.underworld||(l.flags.underworld={linked:false,heat:0,hunted:false});}
function heat(l,n){var u=under(l);u.heat=U.clamp((u.heat||0)+n,0,100);}
function jobKey(l){return[l.job&&l.job.id,l.job&&l.job.rank,l.job&&l.job.since,l.job&&l.job.rankSince,l.flags.worldCareerSerial||0].join('|');}
function context(l){var s=state(l);return{code:current(l),at:l.age,job:jobKey(l),token:++s.serial};}
function validContext(l,d){return foreign(l)&&free(l)&&d&&d.code===current(l)&&d.at===l.age&&d.job===jobKey(l)&&d.token===state(l).serial;}
function leave(l,log){group(l).joined=false;under(l).linked=false;if(job(l))E.quitCrime(l,log,'Chấm dứt công việc trái phép, bắt đầu tìm việc hợp pháp.');heat(l,-8);if(under(l).hunted)log('Đã rời việc bất chính nhưng mối đe dọa cũ vẫn cần được giải quyết.','neutral');}
function pool(l){if(!foreign(l)||!free(l))return[];var s=state(l),g=group(l);if(!job(l)&&!g.joined||s.at===l.age&&s.count>=2)return[];var p=profile(l);return CASES.filter(function(c){var seen=s.seen[c.id];return(!c.job||c.job===job(l))&&(!c.profile||c.profile===p[0])&&(!c.joined||g.joined)&&(!c.family||hasFamily(l))&&(seen==null||l.age-seen>=5);});}
function eventValid(l,d){return d&&d.caseId?validContext(l,d)&&pool(l).some(function(c){return c.id===d.caseId;}):pool(l).length>0;}
function caseFor(d){return CASES.filter(function(c){return c.id===d.caseId;})[0];}
function mark(l,d){var s=state(l);if(s.at!==l.age){s.at=l.age;s.count=0;}s.count++;s.seen[d.caseId]=l.age;s.serial++;}
function capital(l){return Math.max(0,l.base)*.08;}
function arrest(l){if(!(l.sched||[]).some(function(s){return s.id==='bi_bat';})&&!(l.jailUntil!=null&&l.age<l.jailUntil))H.sched(l,'bi_bat',0,{why:'tham gia hoạt động trái phép trong mạng tội phạm',sev:2});}
function outcome(l,r,log,d,k){if(!eventValid(l,d))return;var c=caseFor(d);if(k==='risk'&&l.money<capital(l))return;mark(l,d);
 var where=W.BY[current(l)].name+' · '+c.title+': ';
 if(k==='risk'){var amt=capital(l);H.cash(l,-amt,'Vốn việc làm bất chính');heat(l,12);H.fx(l,{karma:-3});if(r()<.45){var payout=amt*1.8;H.cash(l,payout,'Thu hồi vốn và khoản chia bất chính');log(where+'bạn tiếp tục dính líu, tự góp '+H.money(l,amt)+', nhận lại '+H.money(l,payout)+' gồm vốn. Rủi ro pháp lý và trả thù vẫn còn.','bad');}else{log(where+'việc đổ bể, mất '+H.money(l,amt)+' đã góp; các mối liên hệ quay sang trách móc.','bad');if(r()<.18+(under(l).heat||0)/1000)arrest(l);} }
 else if(k==='leave'){leave(l,log);log(where+'bạn quyết định rời việc bất chính, tìm đường làm lại.','good');}
 else if(k==='legal'){heat(l,-4);H.fx(l,{karma:2});log(where+'bạn dừng phần việc và nhờ luật sư tư vấn.','neutral');}
 else{heat(l,2);if(l.mind)l.mind.stress=U.clamp(l.mind.stress+2,0,100);log(where+'bạn chưa quyết định, sức ép từ những việc đã liên quan vẫn còn.','neutral');}
}
E.SC('wc_su_kien',{title:function(l,d){var c=caseFor(d);return c?c.title:'Chuyện trong thế giới ngầm';},valid:eventValid,prep:function(l,r){var p=pool(l);if(!p.length)return{};var c=U.pick(r,p),d=context(l);d.caseId=c.id;return d;},text:function(l,d){var c=caseFor(d);return c?W.BY[current(l)].name+' · '+(group(l).joined?label(l):'các mối liên hệ bất chính')+'. '+c.text:'';},opts:[
 {k:'legal',l:'Tạm dừng, nhờ luật sư tư vấn',ai:{w:1.2},run:function(l,r,log,d){outcome(l,r,log,d,'legal');}},
 {k:'risk',l:function(l){return'Tiếp tục dính líu · tự góp '+H.money(l,capital(l));},req:function(l){return l.money>=capital(l);},ai:{bad:1,risk:1},run:function(l,r,log,d){outcome(l,r,log,d,'risk');}},
 {k:'leave',l:'Rời nhóm, tìm việc khác',ai:{w:.8},run:function(l,r,log,d){outcome(l,r,log,d,'leave');}},
 {k:'later',l:'Chờ thêm tin tức',run:function(l,r,log,d){outcome(l,r,log,d,'later');}}
]});
E.SC('wc_to_chuc',{title:'Chọn mối liên hệ trong thế giới ngầm',valid:function(l,d){return foreign(l)&&free(l)&&(!d||!d.code||validContext(l,d));},prep:context,text:function(l){return W.BY[current(l)].name+' · Có người muốn kéo bạn vào nhóm. Bạn nhận lời hay từ chối?' ;},opts:[0,1].map(function(i){return{k:'g'+i,l:function(l){return'Nhận lời liên hệ với '+profile(l)[3][i];},run:function(l,r,log,d){if(!validContext(l,d))return;var g=group(l);g.joined=true;g.choice=i;var u=under(l);u.linked=true;u.worldOrigin=current(l);heat(l,8);state(l).serial++;log('Nhận lời liên hệ với '+label(l)+' tại '+W.BY[current(l)].name+'.','bad');}};}).concat([{k:'no',l:'Từ chối, không gia nhập',run:function(){}}])});
E.SC('wc_nghe',{title:'Nghề phi pháp tại nơi đang sống',valid:function(l,d){return foreign(l)&&free(l)&&(!d||!d.code||validContext(l,d));},prep:context,text:function(l){return W.BY[current(l)].name+' · Chọn hoạt động trái phép, không phải nghề hợp pháp cùng lĩnh vực. Những khoản vay, casino hay dịch vụ hợp pháp không thuộc các lựa chọn này. Mỗi nghề có sự kiện riêng; bắt đầu từ bậc thấp, không tự gia nhập tổ chức.';},opts:Object.keys(JOBS).map(function(id){return{k:id,l:JOBS[id],req:function(l){return job(l)!==id&&(id!=='cho_vay'||l.money>l.base);},run:function(l,r,log,d){if(!validContext(l,d))return;E.startJob(l,id,r,log);}};}).concat([{k:'no',l:'Không tham gia',run:function(){}}])});
E.SC('wc_menu',{title:'Thế giới ngầm tại nơi đang sống',prep:context,valid:function(l,d){return foreign(l)&&free(l)&&(!d||!d.code||validContext(l,d));},text:function(l){return W.BY[current(l)].name+' · '+(group(l).joined?'Đang liên hệ với '+label(l):'Chưa gia nhập tổ chức địa phương')+'. '+(under(l).hunted?'Mối đe dọa truy sát cũ vẫn còn. ':'')+'Bạn muốn làm gì tiếp?' ;},opts:[
 {k:'group',l:'Xem lời mời từ tổ chức địa phương',req:function(l){return !group(l).joined;},run:function(l,r){l.pending.unshift(E.DEC.wc_to_chuc.make(l,r));}},
 {k:'job',l:'Xem các nghề phi pháp tại nơi đang sống',run:function(l,r){l.pending.unshift(E.DEC.wc_nghe.make(l,r));}},
 {k:'event',l:'Giải quyết chuyện trong nghề / tổ chức',req:function(l){return pool(l).length>0;},run:function(l,r){l.pending.unshift(E.DEC.wc_su_kien.make(l,r));}},
 {k:'leave',l:'Chấm dứt quan hệ và công việc bất chính',req:function(l){return group(l).joined||!!job(l);},run:function(l,r,log){leave(l,log);}},
 {k:'no',l:'Đóng lại',run:function(){}}
]});
['wc_menu','wc_nghe','wc_to_chuc','wc_su_kien'].forEach(function(id){var D=E.DEC[id],ap=D.apply;D.apply=function(l,d){if(!D.valid(l,d.data))return;return ap.apply(this,arguments);};});
// Tái dùng lối vào cũ; các nút và bản lưu Việt Nam vẫn tiếp tục cơ chế cũ.
['kiem_tien_ban','uw_quan_he'].forEach(function(id){var old=E.DEC[id],mk=old.make,ap=old.apply,v=old.valid;old.make=function(l,r,a){return foreign(l)?E.DEC[id==='kiem_tien_ban'?'wc_nghe':'wc_menu'].make(l,r,a):mk.call(this,l,r,a);};old.apply=function(l,d){return foreign(l)?E.DEC[id==='kiem_tien_ban'?'wc_nghe':'wc_menu'].apply.apply(this,arguments):ap.apply(this,arguments);};old.valid=function(l,d){return foreign(l)?free(l):v(l,d);};});
var invitation=E.DEC.ru_re,im=invitation.make,iv=invitation.valid,ia=invitation.apply;
invitation.make=function(l,r,a){var d=im.call(this,l,r,a);if(foreign(l)){d.data.wc=context(l);d.text='Tại '+W.BY[current(l)].name+', một người quen rủ bạn tham gia '+JOBS[d.data.id]+'. Đây là lời mời hoạt động trái phép, không phải tuyển dụng hợp pháp. Nhận lời không tự gia nhập '+profile(l)[3][0]+'.';d.opts.forEach(function(o){if(o.k==='report')o.l='Cung cấp thông tin cho cảnh sát';});}return d;};
invitation.valid=function(l,d){return foreign(l)?free(l)&&!job(l)&&(!d||!d.wc||validContext(l,d.wc)):iv(l,d);};
invitation.apply=function(l,d,k,r,log){if(!foreign(l))return ia.apply(this,arguments);if(!invitation.valid(l,d.data)||d.data.worldUsed)return;d.data.worldUsed=true;state(l).serial++;if(k==='join'){if(l.job)l.lastJob=l.job;E.startJob(l,d.data.id,r,log);}else if(k==='report'){H.fx(l,{karma:3});log('Cung cấp thông tin cho cảnh sát tại '+W.BY[current(l)].name+'. Thông tin cần được xác minh; chưa có kết quả điều tra hoặc kết luận về tổ chức.','good');}else log('Từ chối lời mời tham gia hoạt động trái phép.','good');};
var mem=H.mem;H.mem=function(l,t){if(foreign(l)&&job(l)&&/^Ngày bạn bước chân vào con đường /.test(t)){var args=Array.prototype.slice.call(arguments);args[1]='Ngày bước chân vào hoạt động '+JOBS[job(l)]+'.';return mem.apply(this,args);}return mem.apply(this,arguments);};
// Các cảnh đường dây cũ mang bối cảnh Việt Nam được thay bằng bộ mới ở nước ngoài.
Object.keys(E.DEC).filter(function(id){return /^dd_/.test(id)||/^uw_(phan_boi|chia_phan|tong_tien|dieu_tra|mat_von|gia_dinh|dan_em_gap_nan|duong_lui)$/.test(id);}).forEach(function(id){var d=E.DEC[id],v=d.valid;d.valid=function(l,data){return !foreign(l)&&v(l,data);};E.TRIG.filter(function(t){return t.id===id;}).forEach(function(t){var before=t.when;t.when=function(l,a){return !foreign(l)&&before(l,a);};});});
var title=E.jobTitle;E.jobTitle=function(l){var base=title(l);if(!foreign(l)||!job(l))return base;return JOBS[job(l)]+' · bậc '+((l.job.rank||0)+1)+(group(l).joined?' · '+label(l):' · '+W.BY[current(l)].name);};
var start=E.startJob;E.startJob=function(l,id,r,log,quiet){var resolved=E.resolveJob(id);if(foreign(l)&&JOBS[resolved]&&!free(l))return false;var before=l.job;if(foreign(l)&&JOBS[resolved]&&l.abroad&&l.abroad.study){l.abroad=Object.assign({},l.abroad,{study:false,studyEnded:true});}var result=start(l,id,r,function(t,k){if(foreign(l)&&job(l)&&/^Bắt đầu công việc mới:/.test(t))t='Bắt đầu công việc mới: '+E.jobTitle(l)+'.';if(log)log(t,k);},quiet);if(foreign(l)&&JOBS[resolved]&&l.job!==before){l.flags.worldCareerSerial=(l.flags.worldCareerSerial||0)+1;state(l).serial++;}return result;};
var quit=E.quitCrime;E.quitCrime=function(l){if(l.flags.worldCrime){Object.keys(l.flags.worldCrime.groups).forEach(function(code){l.flags.worldCrime.groups[code].joined=false;});l.flags.worldCrime.serial++;}return quit.apply(this,arguments);};
var rankText=E.rankUpText;E.rankUpText=function(l,c){if(foreign(l)&&job(l))return{t:'Bạn được giao vị trí cao hơn trong hoạt động '+JOBS[job(l)]+'. Thu nhập theo bậc mới nhưng nguy cơ điều tra, phản bội vẫn còn.',m:'Một bước lún sâu hơn vào công việc trái phép.'};return rankText?rankText.apply(this,arguments):null;};
E.ACT.push({id:'wc_menu',g:'Đường tối',l:'Tổ chức / nghề phi pháp nơi đang sống',min:18,sc:'wc_menu',avail:function(l){return foreign(l)&&free(l)?true:'Mục này dành cho nhân vật đủ 18 tuổi đang ở nước ngoài và được tự do';},ai:{w:.08}});
E.TRIG.push({id:'wc_su_kien',when:function(l){return pool(l).length>0;},p:.6,cd:1,rep:true});
E.WORLD_CRIME={jobs:JOBS,cases:CASES,profiles:PROFILES,current:current,profile:profile,group:group,pool:pool,context:context,valid:eventValid,state:state,free:free};
})(G);
