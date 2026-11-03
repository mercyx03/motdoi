/* Children as independent people: evolving temperament, reactions to parents, stage events, school results, adult autonomy and lasting memories (game rules). */
(function(G){'use strict';var E=G.E,H=E.H,U=G.U,X=E.UPDATE110;
// Each trait is a spectrum 0..100 with a description for each end; traits shift probabilities, never fix an outcome.
var TRAITS={impulse:['biết kiềm chế','bốc đồng'],extro:['hướng nội','hướng ngoại'],indep:['dễ hợp tác với bố mẹ','độc lập, có chính kiến'],diligent:['hay trì hoãn','chăm chỉ'],sensitive:['bền bỉ trước áp lực','nhạy cảm'],ambition:['thích sự ổn định','nhiều hoài bão'],curious:['thích điều quen thuộc','tò mò, ham khám phá'],empathy:['còn vô tư với cảm xúc người khác','giàu đồng cảm'],regulation:['dễ bùng nổ cảm xúc','biết điều tiết cảm xúc'],selfReliance:['còn dựa dẫm','tự lập']};
var KEYS=Object.keys(TRAITS),INTERESTS=['vẽ','âm nhạc','thể thao','khoa học','đọc sách','lập trình','nấu ăn','thiên nhiên','kể chuyện','máy móc','thời trang','cờ và trò chơi chiến thuật'];
var DREAMS={vẽ:'họa sĩ hoặc nhà thiết kế','âm nhạc':'nhạc sĩ, ca sĩ','thể thao':'vận động viên, huấn luyện viên','khoa học':'nhà khoa học, bác sĩ','đọc sách':'nhà văn, nhà báo','lập trình':'kỹ sư phần mềm','nấu ăn':'đầu bếp, mở quán riêng','thiên nhiên':'kỹ sư nông nghiệp, bác sĩ thú y','kể chuyện':'giáo viên, đạo diễn','máy móc':'kỹ sư cơ khí','thời trang':'nhà thiết kế thời trang','cờ và trò chơi chiến thuật':'kỳ thủ, nhà phân tích'};
var CHILD_DREAMS=['làm siêu nhân','lái tàu vũ trụ','làm cô giáo như ở lớp','mở tiệm kem','làm bác sĩ chữa cho thú cưng','làm cảnh sát'];
var STAGES=[[0,2,'sơ sinh – chập chững'],[3,5,'mầm non'],[6,11,'tiểu học'],[12,15,'trung học cơ sở'],[16,18,'cuối phổ thông'],[19,24,'thanh niên'],[25,200,'trưởng thành']];
function hash(x){var n=2166136261;x=String(x);for(var i=0;i<x.length;i++)n=Math.imul(n^x.charCodeAt(i),16777619);return n>>>0;}
function rng(seed){var x=hash(seed)||1;return function(){x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};}
function gauss(r){return (r()+r()+r()-1.5)*2;}
function age(l,k){return l.age-k.born;}
function stage(a){for(var i=0;i<STAGES.length;i++)if(a>=STAGES[i][0]&&a<=STAGES[i][1])return STAGES[i][2];return STAGES[6][2];}
function live(k){return k&&k.alive!==false&&!k.died;}
function near(k){return k.custody!=='ex'&&k.custody!=='other';}
function cl(v){return U.clamp(Math.round(v),0,100);}
function find(l,id){return (l.kids||[]).find(function(k){return live(k)&&X.uid(l,k)===id;});}
function init(l,k){if(k.persona141)return k.persona141;var r=rng(l.id+':141:'+k.name+':'+k.born),t={},order=(l.kids||[]).filter(function(x){return x.born<k.born;}).length;
 KEYS.forEach(function(key){t[key]=cl(50+gauss(r)*18);});
 var old=k.future126&&k.future126.trait||'';if(/nhút nhát|hướng nội/.test(old))t.extro=cl(t.extro-15);if(/hướng ngoại/.test(old))t.extro=cl(t.extro+15);if(/mạnh mẽ/.test(old))t.sensitive=cl(t.sensitive-15);if(/bốc đồng/.test(old))t.impulse=cl(t.impulse+20);
 if(order===0&&(l.kids||[]).length>1)t.selfReliance=cl(t.selfReliance+6);
 var a=INTERESTS[Math.floor(r()*INTERESTS.length)],b=INTERESTS[Math.floor(r()*INTERESTS.length)],close=typeof k.close==='number'?k.close:60;
 k.persona141={traits:t,interests:a===b?[a]:[a,b],talent:{domain:INTERESTS[Math.floor(r()*INTERESTS.length)],level:cl(35+r()*55),shown:false},dream:null,trust:cl(close),attach:cl(close+5),fear:cl(12+(k.fear140||0)),memories:[],milestones:[],seen:{},acted:{},school:null,plan:{},born:k.born};
 return k.persona141;}
function trait(p,key){return p.traits[key];}
function rel(k,p,dt,da,df){p.trust=cl(p.trust+(dt||0));p.attach=cl(p.attach+(da||0));p.fear=cl(p.fear+(df||0));if(typeof k.close==='number')k.close=U.clamp(k.close+((dt||0)+(da||0))/3-(df||0)/6,0,100);}
function remember(l,k,text,w,tone,journal){var p=init(l,k);p.memories.push({age:age(l,k),text:text,w:w,tone:tone,healed:false,resurfaced:false});if(p.memories.length>30)p.memories.splice(0,p.memories.length-30);if(journal!==false&&w>=4)H.mem(l,text,Math.min(5,w));}
function milestone(l,k,text){var p=init(l,k);p.milestones.push({age:age(l,k),text:text});if(p.milestones.length>40)p.milestones.shift();}
// Household pressure and opportunity tiers; each tier has its own rare events, no tier is treated as better parents.
function tier(l,F){var b=l.base||1,inc=F&&Number.isFinite(F.inc)?F.inc:(l.lastIncome||0),w=(l.money||0)+(l.houseVal||0)*.3;return w>b*20||inc>b*4?'rich':w<b*1.5&&inc<b*1.1?'low':'comfortable';}
function autonomy(a){return a<6?.1:a<12?.25:a<16?.45:a<19?.6:.92;}
// A child's reaction to a parental request. fit: -1 (against the child's wish) .. 1 (what the child wants). harsh: controlling method.
var REACT={agree:'đồng ý',reluctant:'miễn cưỡng làm theo',refuse:'từ chối',argue:'cãi lại',defy:'âm thầm làm ngược lại',negotiate:'xin thương lượng'};
function react(l,k,r,fit,harsh){var p=init(l,k),t=p.traits,a=age(l,k),au=autonomy(a);fit=fit||0;
 var w={agree:Math.max(.05,1+fit*1.4+p.trust/100-au-t.indep/200),reluctant:Math.max(.05,.6+p.fear/70+(100-t.indep)/200-au*.5),negotiate:a<4?0:Math.max(.05,.3+t.regulation/120+p.trust/160+(a>=10?.4:0)),argue:a<3?0:Math.max(.02,.2+t.impulse/120+t.indep/160-t.regulation/220+(harsh?.4:0)+(a>=12&&a<=18?.25:0)),refuse:Math.max(.02,.15+t.indep/100*au*2-fit*.6),defy:a<6?0:Math.max(.01,.05+t.impulse/170+(harsh?.3:0)+(a>=12?.15:0)-t.empathy/300)};
 var out=U.wpick(r,Object.keys(w),function(x){return w[x]+1e-9;});
 if(out==='agree')rel(k,p,2,1,0);else if(out==='reluctant')rel(k,p,-1,-1,harsh?3:1);else if(out==='negotiate')rel(k,p,2,1,-1);else if(out==='argue')rel(k,p,-2,-2,harsh?2:0);else if(out==='defy')rel(k,p,-3,-1,0);
 if(harsh)rel(k,p,-3,-1,6);return out;}
// School result from ability, diligence, interest, mood, money, environment, support and current events; obedience is not a factor.
function schoolScore(l,k,r,F){var p=init(l,k),t=p.traits,tr=tier(l,F),mood=100-p.fear-(l.st&&l.st.hap<35?10:0);
 var s=(k.study!=null?k.study:50)*.45+t.diligent*.2+t.curious*.08+mood*.1+p.attach*.07+(tr==='low'?-4:tr==='rich'?4:0)+(l.urban?2:0)+(k.tutor?3:0)-(k.fear140||0)*.08-(k.vice?8:0)-(p.ill?6:0)+gauss(r)*7;return U.clamp(s,0,100);}
function band(s){return s>=78?'rất tốt':s>=63?'khá':s>=48?'trung bình':'đang chật vật';}
function schoolYear(l,k,r,log,F){var a=age(l,k),p=init(l,k);if(a<6||a>17){return;}var s=schoolScore(l,k,r,F),b=band(s),prev=p.school&&p.school.band;k.study=U.clamp((k.study!=null?k.study:50)+(s-(k.study!=null?k.study:50))*.15,0,100);p.school={band:b,age:a,score:Math.round(s)};
 if(prev&&prev!==b){var up=['đang chật vật','trung bình','khá','rất tốt'].indexOf(b)>['đang chật vật','trung bình','khá','rất tốt'].indexOf(prev);log('Kết quả học tập năm nay của '+k.name+' '+(up?'tiến bộ':'đi xuống')+', ở mức '+b+(up?'.':(p.fear>45?'; con có vẻ căng thẳng ở nhà.':t(p)))+'','neutral');}}
function t(p){return p.traits.diligent<40?'; con hay để bài đến phút chót.':p.attach<40?'; con ít chia sẻ chuyện ở trường.':'.';}
// Stage events. Each id fires at most once per child; weights depend on traits, age and household tier.
var EV=[
 {id:'firstWord',min:1,max:2,w:function(){return 2;},run:function(l,k,p,r,log){var w=U.pick(r,['"mẹ"','"bố"','"bà"','"măm"']);milestone(l,k,'Nói tiếng đầu tiên: '+w);log(k.name+' bập bẹ tiếng đầu tiên: '+w+'. Cả nhà nhắc mãi.','good');rel(k,p,0,3,0);remember(l,k,'Ngày '+k.name+' nói tiếng đầu tiên '+w+'.',3,'good');}},
 {id:'firstSteps',min:1,max:2,w:function(){return 2;},run:function(l,k,p,r,log){milestone(l,k,'Những bước đi đầu tiên');log(k.name+' chập chững những bước đầu tiên, ngã rồi lại tự đứng dậy.','good');}},
 {id:'nightCry',min:0,max:2,w:function(l,k,p){return .6+p.traits.sensitive/100;},run:function(l,k,p,r,log){log(k.name+' quấy khóc nhiều đêm vì mọc răng; cả nhà thay nhau bế ru.','neutral');rel(k,p,0,2,0);H.fx(l,{hea:-2});}},
 {id:'tantrum',min:3,max:5,w:function(l,k,p){return .3+p.traits.impulse/80-p.traits.regulation/200;},ask:'Con ăn vạ giữa siêu thị vì đòi đồ chơi'},
 {id:'imaginary',min:3,max:5,w:function(l,k,p){return .2+p.traits.curious/100;},run:function(l,k,p,r,log){log(k.name+' có một "người bạn tưởng tượng" và kể chuyện về bạn ấy mỗi tối.','neutral');p.dream=U.pick(r,CHILD_DREAMS);}},
 {id:'firstClass',min:3,max:5,w:function(){return 1;},run:function(l,k,p,r,log){var ok=r()<.4+(100-p.traits.sensitive)/200+p.traits.extro/300;log(ok?k.name+' vào lớp mẫu giáo, khóc một chút rồi chạy đi chơi với bạn.':k.name+' khóc suốt tuần đầu đi lớp, cần bố mẹ đón sớm vài hôm.','neutral');if(!ok)rel(k,p,0,2,1);milestone(l,k,'Ngày đầu đi lớp');}},
 {id:'share',min:3,max:6,w:function(l,k,p){return .3+p.traits.empathy/100;},run:function(l,k,p,r,log){if(r()<.3+p.traits.empathy/140){log(k.name+' tự chia bánh cho bạn bị quên mang đồ ăn. Cô giáo kể lại với gia đình.','good');p.traits.empathy=cl(p.traits.empathy+3);}else log(k.name+' giành đồ chơi với bạn rồi được cô hướng dẫn cách thay phiên.','neutral');}},
 {id:'schoolFriend',min:6,max:11,w:function(l,k,p){return .4+p.traits.extro/100;},run:function(l,k,p,r,log){log(k.name+' có một người bạn thân ở lớp; hai đứa rủ nhau học nhóm và đi chơi cuối tuần.','good');H.fx(l,{hap:1});}},
 {id:'bullied',min:7,max:15,w:function(l,k,p){return .15+p.traits.sensitive/250+(p.traits.extro<35?.1:0);},ask:'Con bị bạn cùng lớp bắt nạt'},
 {id:'broke',min:6,max:11,w:function(l,k,p){return .3+p.traits.impulse/150;},ask:'Con làm vỡ đồ rồi giấu đi'},
 {id:'talent',min:6,max:14,w:function(){return .8;},run:function(l,k,p,r,log){p.talent.shown=true;var lv=p.talent.level;log('Thầy cô nhận thấy '+k.name+' '+(lv>=75?'có năng khiếu nổi bật':lv>=55?'có khả năng khá':'thích thú')+' với '+p.talent.domain+'.','good');if(p.interests.indexOf(p.talent.domain)<0&&r()<.5)p.interests.push(p.talent.domain);}},
 {id:'scienceFair',min:8,max:15,w:function(l,k,p){return .1+p.traits.curious/150+p.traits.diligent/250;},run:function(l,k,p,r,log){var win=r()<.2+p.traits.diligent/300+p.talent.level/400;log(win?k.name+' đoạt giải ở cuộc thi sáng tạo cấp trường với mô hình tự làm.':k.name+' dự thi sáng tạo, chưa có giải nhưng hào hứng làm tiếp.','good');if(win)remember(l,k,'Ngày '+k.name+' cầm giấy khen cuộc thi sáng tạo về nhà.',3,'good');}},
 {id:'crush',min:12,max:16,w:function(l,k,p){return .4+p.traits.extro/200;},ask:'Con có tình cảm với một bạn cùng lớp'},
 {id:'peer',min:13,max:17,w:function(l,k,p){return .15+p.traits.impulse/200+(p.attach<40?.1:0);},run:function(l,k,p,r,log){var resist=r()<.35+p.traits.regulation/200+p.attach/300;log(resist?k.name+' từ chối lời rủ hút thuốc của nhóm bạn, về nhà kể lại với bạn.':k.name+' thử hút thuốc theo nhóm bạn; nhà trường mời phụ huynh lên trao đổi.',resist?'good':'bad');if(resist)rel(k,p,3,1,0);else{rel(k,p,-1,0,1);remember(l,k,'Lần '+k.name+' bị mời phụ huynh vì hút thuốc theo bạn.',3,'bad',false);}}},
 {id:'style',min:12,max:17,w:function(l,k,p){return .2+p.traits.indep/120;},run:function(l,k,p,r,log){log(k.name+' đổi kiểu tóc, cách ăn mặc theo gu riêng và muốn được tôn trọng phòng riêng.','neutral');p.traits.indep=cl(p.traits.indep+3);}},
 {id:'exam10',min:14,max:15,w:function(l,k,p){return .6+p.traits.sensitive/150;},run:function(l,k,p,r,log){var calm=r()<.4+(100-p.traits.sensitive)/200+p.attach/300-p.fear/300;log(calm?k.name+' ôn thi vào lớp 10 đều đặn, giữ được giấc ngủ.':k.name+' mất ngủ trước kỳ thi vào lớp 10, cần được trấn an.','neutral');if(!calm)rel(k,p,0,0,2);}},
 {id:'partTime',min:16,max:18,w:function(l,k,p,tr){return (tr==='low'?.6:.2)+p.traits.selfReliance/200;},run:function(l,k,p,r,log,tr){log(k.name+' tự đi làm thêm buổi tối'+(tr==='low'?' để đỡ đần chi phí gia đình; con lo học bị ảnh hưởng.':' để có tiền tiêu riêng và học cách quản lý.'),'neutral');p.traits.selfReliance=cl(p.traits.selfReliance+4);if(tr==='low'){k.study=U.clamp((k.study||50)-2,0,100);rel(k,p,0,2,0);}}},
 {id:'scholar',min:12,max:18,w:function(l,k,p,tr){return tr==='low'?.15+p.traits.diligent/250:0;},run:function(l,k,p,r,log){var ok=r()<.25+p.traits.diligent/250+(k.study||50)/300;log(ok?k.name+' nhận học bổng vượt khó của trường, gia đình nhẹ gánh học phí.':k.name+' nộp hồ sơ học bổng nhưng chưa được chọn; thầy chủ nhiệm hướng dẫn thử lại năm sau.',ok?'good':'neutral');if(ok){remember(l,k,'Ngày '+k.name+' nhận học bổng vượt khó.',4,'good');H.cash(l,(l.base||1)*.05,'Học bổng của con');}}},
 {id:'compare',min:10,max:17,w:function(l,k,p,tr){return tr==='comfortable'?.25+p.traits.sensitive/250:0;},run:function(l,k,p,r,log){log(k.name+' buồn vì bị so sánh với "con nhà người ta" trong họ hàng.','neutral');rel(k,p,-1,0,2);}},
 {id:'privilege',min:14,max:22,w:function(l,k,p,tr){return tr==='rich'?.3:0;},run:function(l,k,p,r,log){var own=r()<.35+p.traits.indep/200+p.traits.ambition/300;log(own?k.name+' nói muốn tự chứng minh năng lực thay vì đi theo con đường gia đình đã sắp sẵn.':k.name+' chịu áp lực phải giỏi để xứng với kỳ vọng của gia đình và bạn bè cùng giới.','neutral');if(!own)rel(k,p,0,0,3);p.traits.indep=cl(p.traits.indep+(own?4:0));}},
 {id:'exchange',min:15,max:20,w:function(l,k,p,tr){return tr==='rich'?.15+p.traits.curious/250:tr==='comfortable'?.05:0;},run:function(l,k,p,r,log){log(k.name+' tham gia chương trình trao đổi học sinh ngắn hạn, về nhà kể say sưa về những điều mới.','good');p.traits.curious=cl(p.traits.curious+4);milestone(l,k,'Chuyến trao đổi học sinh');}},
 {id:'moveOut',min:19,max:26,w:function(l,k,p){return .3+p.traits.indep/150+p.traits.selfReliance/200;},run:function(l,k,p,r,log){var far=r()<.25+p.traits.curious/250+p.traits.ambition/300;p.plan.home=far?'thành phố khác':'thuê nhà riêng gần đó';log(k.name+' tự quyết định dọn ra '+p.plan.home+'. Bạn chỉ có thể góp ý và giúp chuyển đồ.','neutral');milestone(l,k,'Dọn ra ở riêng ('+p.plan.home+')');}},
 {id:'firstSalary',min:19,max:26,w:function(l,k){return k.job?1:0;},run:function(l,k,p,r,log){log(k.name+' nhận tháng lương đầu tiên'+(p.attach>55?' và mời cả nhà một bữa.':', gửi tin nhắn báo tin.'),'good');milestone(l,k,'Tháng lương đầu tiên');if(p.attach>55)remember(l,k,'Bữa cơm '+k.name+' mời bằng tháng lương đầu tiên.',4,'good');}},
 {id:'switch',min:21,max:30,w:function(l,k,p){return k.job?.15+p.traits.curious/250+p.traits.ambition/300:0;},run:function(l,k,p,r,log){log(k.name+' cân nhắc đổi hướng nghề nghiệp sang lĩnh vực liên quan đến '+p.interests[0]+'. Con tự quyết; bạn được hỏi ý kiến.','neutral');p.dream='làm việc gắn với '+p.interests[0];}},
 {id:'travel',min:19,max:28,w:function(l,k,p){return .1+p.traits.curious/200;},run:function(l,k,p,r,log){log(k.name+' một mình đi du lịch bụi, gửi về nhiều tấm ảnh.','good');}},
 {id:'marriageView',min:25,max:34,w:function(l,k){return k.married?0:.6;},run:function(l,k,p,r,log){var v=r()<.25+p.traits.indep/300?'chưa muốn kết hôn lúc này':r()<.15?'không muốn kết hôn':'muốn kết hôn khi gặp người phù hợp';p.plan.marriage=v;log(k.name+' nói rõ: con '+v+'. Đây là quyết định của con.','neutral');}},
 {id:'kidsView',min:25,max:38,w:function(l,k){return k.married?.6:.2;},run:function(l,k,p,r,log){var v=r()<.2+p.traits.ambition/400?'chưa muốn có con':r()<.12?'không muốn có con':'muốn có con';p.plan.children=v;log(k.name+' chia sẻ: '+v+'. Bạn tôn trọng lựa chọn của con.','neutral');}},
 {id:'caregive',min:28,max:70,w:function(l,k,p){return l.age>=65?.3+p.traits.empathy/200:0;},run:function(l,k,p,r,log){var come=r()<.25+p.attach/150+p.traits.empathy/300-p.fear/300;log(come?k.name+' thu xếp thời gian về chăm khi bạn ốm, đưa đi khám.':k.name+' bận nhưng gửi tiền và gọi điện hỏi thăm thường xuyên hơn.','neutral');if(come)H.fx(l,{hap:3});}},
 // rare events; each has a path to recovery
 {id:'prize',min:10,max:18,rare:.02,w:function(l,k,p){return p.talent.level>=70&&p.traits.diligent>=55?1:0;},run:function(l,k,p,r,log){log(k.name+' đoạt giải cấp quốc gia về '+p.talent.domain+'. Cả nhà vỡ òa.','big');milestone(l,k,'Giải quốc gia về '+p.talent.domain);remember(l,k,'Ngày '+k.name+' đoạt giải quốc gia.',5,'good');k.study=U.clamp((k.study||50)+3,0,100);}},
 {id:'ill',min:3,max:25,rare:.012,w:function(){return 1;},ask:'Con mắc bệnh cần điều trị dài ngày'},
 {id:'runaway',min:12,max:17,rare:.015,w:function(l,k,p){return p.fear>45||p.traits.impulse>65?1:.2;},ask:'Con bỏ nhà đi sau một trận cãi vã'}];
var ASK={
 tantrum:[['calm','Bình tĩnh bế con ra chỗ vắng, chờ con dịu lại',function(l,k,p,r,log){rel(k,p,1,2,0);p.traits.regulation=cl(p.traits.regulation+2);log(k.name+' dần nín, hai bố mẹ con nói chuyện về cảm giác muốn mà chưa được.','good');}],['buy','Mua cho xong chuyện',function(l,k,p,r,log){p.traits.impulse=cl(p.traits.impulse+2);H.cash(l,-(l.base||1)*.003,'Đồ chơi cho con');log(k.name+' nín ngay, nhưng lần sau có vẻ lại thử cách này.','neutral');}],['scold','Quát mắng trước mọi người',function(l,k,p,r,log){rel(k,p,-2,-1,5);log(k.name+' sợ hãi im bặt. Bạn thấy nhói lòng sau đó.','bad');remember(l,k,'Lần bị quát giữa siêu thị.',2,'bad',false);}]],
 bullied:[['school','Gặp giáo viên chủ nhiệm, phối hợp với nhà trường',function(l,k,p,r,log){var ok=r()<.6+p.trust/300;log(ok?'Nhà trường can thiệp, việc bắt nạt chấm dứt; '+k.name+' dần vui trở lại.':'Nhà trường đã nhắc nhở nhưng sự việc chưa dứt hẳn; bạn tiếp tục theo dõi và đề nghị đổi chỗ ngồi.',ok?'good':'neutral');rel(k,p,4,3,-3);remember(l,k,'Lần bố mẹ đứng ra bảo vệ '+k.name+' khi bị bắt nạt.',4,'good');}],['listen','Ngồi nghe con kể, dạy con cách tìm người giúp',function(l,k,p,r,log){rel(k,p,3,3,-2);p.traits.sensitive=cl(p.traits.sensitive-2);log(k.name+' kể hết mọi chuyện. Con học cách báo thầy cô và đi cùng nhóm bạn.','good');}],['tough','Bảo con tự mạnh mẽ lên',function(l,k,p,r,log){rel(k,p,-3,-2,2);log(k.name+' im lặng, không kể thêm chuyện ở trường nữa.','bad');remember(l,k,'Lần bị bắt nạt mà thấy phải tự chịu một mình.',4,'bad',false);}]],
 broke:[['honest','Hỏi nhẹ nhàng, khen con khi nói thật',function(l,k,p,r,log){var tell=r()<.4+p.trust/150-p.fear/200;log(tell?k.name+' thú nhận và xin lỗi. Hai bố mẹ con cùng dọn mảnh vỡ.':k.name+' vẫn chối vì sợ bị phạt; bạn để con suy nghĩ thêm.','neutral');if(tell)rel(k,p,3,1,-2);}],['punish','Phạt thật nặng để con nhớ',function(l,k,p,r,log){rel(k,p,-3,-1,6);log(k.name+' khóc nhận lỗi. Lần sau, con giấu kỹ hơn.','bad');}]],
 crush:[['talk','Lắng nghe, chia sẻ kinh nghiệm của mình',function(l,k,p,r,log){var x=react(l,k,r,.3,false);log(k.name+' '+REACT[x]+' khi bạn trò chuyện về tình cảm tuổi học trò.','neutral');rel(k,p,2,1,0);}],['ban','Cấm tuyệt đối, kiểm tra tin nhắn',function(l,k,p,r,log){var x=react(l,k,r,-.8,true);log(k.name+' '+REACT[x]+'. Con bắt đầu cài mật khẩu điện thoại.','bad');remember(l,k,'Lần bị bố mẹ đọc tin nhắn riêng.',3,'bad',false);}]],
 ill:[['treat','Đưa con đi điều trị đầy đủ',function(l,k,p,r,log){var cost=(l.base||1)*.4;if(l.money>=cost){H.cash(l,-cost,'Điều trị cho con');log(k.name+' được điều trị, hồi phục dần sau vài tháng. Cả nhà luân phiên chăm.','good');}else{log('Gia đình vay mượn người thân và nhận hỗ trợ từ quỹ bệnh nhi; '+k.name+' được điều trị và hồi phục dần.','neutral');H.fx(l,{hap:-4});}p.ill=null;rel(k,p,2,4,0);remember(l,k,'Những tháng '+k.name+' nằm viện, bố mẹ thay nhau thức trông.',4,'good');}],['wait','Theo dõi thêm ở nhà',function(l,k,p,r,log){if(r()<.5){p.ill=null;log(k.name+' tự khỏi dần nhưng mệt mỏi kéo dài; bác sĩ khuyên tái khám.','neutral');}else{log('Bệnh của '+k.name+' nặng hơn, phải nhập viện gấp. May mà kịp thời.','bad');p.ill=null;H.fx(l,{hap:-6});}}]],
 runaway:[['search','Đi tìm con, khi gặp thì lắng nghe trước',function(l,k,p,r,log){rel(k,p,4,4,-4);log('Sau hai ngày tìm kiếm, bạn gặp '+k.name+' ở nhà một người bạn. Hai bên nói chuyện lần đầu tiên thật lâu.','good');remember(l,k,'Đêm bố mẹ tìm được '+k.name+' và nói chuyện thật lòng.',5,'good');}],['police','Báo công an, đưa con về và kỷ luật',function(l,k,p,r,log){rel(k,p,-2,0,4);log(k.name+' được đưa về an toàn nhưng đóng cửa phòng, không nói chuyện nhiều tuần.','neutral');remember(l,k,'Lần bỏ nhà đi và bị đưa về.',4,'bad',false);}]]};
function pickEvent(l,k,p,r,tr){var a=age(l,k),pool=EV.filter(function(e){return !p.seen[e.id]&&a>=e.min&&a<=e.max;});var rare=pool.filter(function(e){return e.rare&&e.w(l,k,p,tr)>0&&r()<e.rare*e.w(l,k,p,tr);});if(rare.length)return rare[0];if(r()>=.45)return null;var common=pool.filter(function(e){return !e.rare&&e.w(l,k,p,tr)>0;});if(!common.length)return null;return U.wpick(r,common,function(e){return e.w(l,k,p,tr)+1e-9;});}
function evolve(l,k,p,r){var a=age(l,k),rate=a<6?1.6:a<18?1.2:.6;KEYS.forEach(function(key){p.traits[key]=cl(p.traits[key]+gauss(r)*rate);});
 if(p.fear>55){p.traits.sensitive=cl(p.traits.sensitive+1);p.traits.regulation=cl(p.traits.regulation-1);}if(p.attach>70)p.traits.regulation=cl(p.traits.regulation+.6);if(a>=16)p.traits.indep=cl(p.traits.indep+(a<=20?1.2:.3));
 if(p.fear>0&&!k.fear140)p.fear=cl(p.fear-1);if(k.fear140){p.fear=Math.max(p.fear,cl(k.fear140));k.fear140=Math.max(0,k.fear140-5);}
 if(!p.dream&&a>=3)p.dream=a<7?U.pick(r,CHILD_DREAMS):DREAMS[p.interests[0]];else if(p.dream&&a>=12&&CHILD_DREAMS.indexOf(p.dream)>=0)p.dream=DREAMS[p.talent.shown?p.talent.domain:p.interests[0]];}
function resurface(l,k,p,r,log){var a=age(l,k);if(a<16||r()>=.06)return;var m=p.memories.filter(function(x){return !x.resurfaced&&a-x.age>=5&&x.w>=3;}).sort(function(x,y){return y.w-x.w;})[0];if(!m)return;m.resurfaced=true;if(m.tone==='bad'&&!m.healed){rel(k,p,-2,-3,0);log('Trong một lần trò chuyện, '+k.name+' nhắc lại chuyện cũ: "'+m.text+'" Giọng con vẫn còn chút tổn thương.','bad');}else{rel(k,p,1,3,0);log(k.name+' bất ngờ nhắc lại kỷ niệm: "'+m.text+'" Bạn nhận ra con vẫn nhớ.','good');}}
// Exam failure: the child picks the next step from personality and real family means.
var FAIL={retake:'ôn thi lại năm sau',vocational:'học nghề hoặc cao đẳng',work:'đi làm ngay để tự lập',private:'học đại học tư thục',gap:'nghỉ một năm để tìm hiểu bản thân',business:'thử buôn bán nhỏ'};
function failChoice(l,k,r,F){var p=init(l,k),t=p.traits,tr=tier(l,F),b=l.base||1,w={retake:.4+t.diligent/100+t.ambition/150,vocational:.35+(100-t.ambition)/120+t.selfReliance/250,work:.25+t.selfReliance/110+(tr==='low'?.4:0),private:l.money>=b&&tr!=='low'?.25+t.ambition/150:0,gap:.15+t.curious/130,business:.08+t.ambition/180+t.impulse/250+t.indep/250};return U.wpick(r,Object.keys(w),function(x){return w[x]+1e-9;});}
function afterFail(l,k,r,log,F){var p=init(l,k),c=failChoice(l,k,r,F),a=age(l,k);p.examFail={age:a,choice:c};k.uniUntil=null;k.tuition=0;
 if(c==='retake'){k.edu=Math.max(k.edu||0,3);p.retakeAt=a+1;}else if(c==='vocational')k.edu=Math.max(k.edu||0,4);else if(c==='private'){k.edu=Math.max(k.edu||0,3);k.uniUntil=a+4;k.tuition=(l.base||1)*.25;}else{k.edu=Math.max(k.edu||0,3);if(c==='gap')p.gapUntil=a+1;}
 log(k.name+' trượt đại học. Sau vài ngày suy nghĩ, con tự quyết định '+FAIL[c]+'.','neutral');milestone(l,k,'Trượt đại học, chọn '+FAIL[c]);remember(l,k,'Mùa thi '+k.name+' trượt đại học.',3,p.attach>55?'good':'bad',false);return c;}
function retake(l,k,p,r,log){var a=age(l,k);if(p.retakeAt!==a)return;p.retakeAt=null;var pass=r()<U.clamp(.1+(k.study||50)/140+p.traits.diligent/400,.05,.9);if(pass){k.uniUntil=a+4;k.tuition=(l.base||1)*.15;k.edu=Math.max(k.edu||0,3);if(k.job){k.job=null;k.inc=0;}log(k.name+' thi lại và đỗ đại học sau một năm ôn luyện.','good');milestone(l,k,'Đỗ đại học sau khi thi lại');remember(l,k,'Ngày '+k.name+' đỗ đại học lần thi thứ hai.',4,'good');}else{log(k.name+' thi lại vẫn chưa đỗ, chuyển sang học nghề và đi làm.','neutral');k.edu=Math.max(k.edu||0,4);}}
/* A child can grow into one of these paths. Ages below are the child's ages.
   Steps are separated by years. A parent's response can change the next outcome. */
var PATHS = {
 heir: ['Người thừa kế xuất sắc','Muốn được chọn vì năng lực quản lý của chính mình.','ambition',16],
 scholar: ['Thiên tài học thuật','Muốn được công nhận bằng công sức học tập.','curious',12],
 diplomat: ['Người giỏi ngoại giao','Muốn có tiếng nói và kết nối những người trong gia đình.','extro',14],
 spender: ['Người thích ăn chơi','Muốn được bạn bè công nhận và tận hưởng cuộc sống.','impulse',18],
 rebel: ['Người nổi loạn chống gia đình','Muốn tự quyết chuyện học, tình cảm và nơi ở.','indep',16],
 entitled: ['Người kiêu ngạo, ỷ thế','Muốn được ưu tiên nhờ vị thế của gia đình.','ambition',16],
 overlooked: ['Người con cảm thấy bị bỏ quên','Muốn được lắng nghe và dành thời gian riêng.','sensitive',10],
 manipulator: ['Người có xu hướng thao túng','Muốn được ưu ái và có quyền quyết định.','ambition',14],
 secret: ['Người tiêu tiền bí mật','Muốn hòa nhập với bạn bè nhưng ngại nói về tiền.','impulse',18],
 thrill: ['Người thích cảm giác mạnh','Muốn thử giới hạn của mình và tự chọn cách sống.','curious',18],
 kind: ['Người nhân hậu','Muốn giúp đỡ người khác và gắn kết gia đình.','empathy',10],
 perfect: ['Người cầu toàn','Muốn làm thật tốt và được bố mẹ công nhận.','diligent',12]
};
function familyCompany(l) {
 return E.BUSINESS123 && E.BUSINESS123.companies(l).some(function(c){return !c.merged && c.share > 0;});
}
function siblings(l,k) { return l.kids.filter(function(s){return s!==k && live(s) && age(l,s)>=10;}); }
function pathSpend(l,k,amount,source) {
 E.RELATIVE163.account(l,k);
 var paid=Math.min(amount,Math.max(0,k.savings158));
 if(paid>0) E.RELATIVE163.post(l,k,-paid,source,'path834:'+age(l,k));
 return paid;
}
function pathSibling(l,k,s,delta) {
 if(!s)return;
 var a=X.uid(l,k), b=X.uid(l,s);
 E.DYNASTY908.relation(l,a,b,delta);
 // Both children's detail pages keep a directional closeness score.
 [ [k,b],[s,a] ].forEach(function(pair){
   E.CHILD147.once(l,pair[0]);
   var record=pair[0].profile147;
   if(record) record.sib[pair[1]]=cl((record.sib[pair[1]]==null?55:record.sib[pair[1]])+delta);
 });
}
function pathStep(l,k,p,s,r) {
 var n=s.step, a=age(l,k), responded=s.response==='listen', pressure=s.response==='press';
 var sib=siblings(l,k)[0], cost=l.base*.06;
 var constructive=r()<U.clamp(.28+p.trust/220+(responded ? .25 : 0)-(pressure ? .18 : 0),.12,.90);
 function bond(v){rel(k,p,v,v,v<0?2:-1);}
 function study(v){k.study=cl((k.study==null?50:k.study)+v);}
 function prestige(v){E.ELITE148.rep(l,v);}
 function debt(amount,reason){
   var paid=pathSpend(l,k,amount,reason);
   k.debt158+=amount-paid;
   return paid<amount?' Phần còn thiếu được ghi vào nợ riêng của con.':' Con chi từ tiền tiết kiệm riêng.';
 }
 function successor(){return E.DYNASTY908.profile(l,{id:X.uid(l,k),person:k,age:a});}
 switch(s.kind){
 case 'heir':
   if(!familyCompany(l)) {bond(1);return 'chuyển sang học cách quản lý tài sản cá nhân vì gia đình hiện không còn cổ phần doanh nghiệp.';}
   var q=successor();
   if(n===0){q.management=cl(q.management+5);return 'tự học quản trị tài sản, mang bản báo cáo công ty đã chú thích đến hỏi gia đình.';}
   if(n===1){q.management=cl(q.management+3);return 'xin dự thính cuộc họp và hỏi cố vấn về dòng tiền; con chưa được giao quyền biểu quyết.';}
   if(constructive){q.reputation=cl(q.reputation+6);return 'công khai đính chính sai sót trong bản trình bày và đề nghị được xét kế nghiệp qua kết quả công việc.';}
   q.reputation=cl(q.reputation-5);pathSibling(l,k,sib,-5);return 'vận động riêng để được chọn kế nhiệm. Việc bị phát hiện làm giảm uy tín của con.';
 case 'scholar':
   if(n===0){study(7);return 'nhận ra số liệu sai trong bản trình bày ở nhà và giải thích cách kiểm tra lại.';}
   if(n===1){study(4);return 'từ chối một buổi gặp mặt để hoàn thành đề tài nghiên cứu.';}
   if((k.study||0)>=72 && (a<18||k.uniUntil>a)){E.RELATIVE163.post(l,k,l.base*.08,'Học bổng thành tích','scholar834');return 'nhận học bổng theo thành tích; khoản học bổng đã vào sổ tiền riêng.';}
   bond(constructive?2:-2);return constructive?'tìm được nhóm học thuật đánh giá con qua bài nghiên cứu.':'xin gia đình ngừng so sánh kết quả của con với người khác.';
 case 'diplomat':
   if(n===0){bond(2);return 'nhớ tên, sở thích từng vị khách và giúp người mới hòa vào buổi gặp gia đình.';}
   if(n===1 && sib){pathSibling(l,k,sib,6);return 'lắng nghe hai phía và giúp anh chị em làm hòa sau một bất đồng.';}
   if(n===1){bond(2);return 'giúp người thân giải thích một hiểu lầm trong buổi gặp mặt.';}
   if(constructive){var contact=E.ELITE148.meet(l,r,{kind:'business',where:'buổi giao lưu của gia đình'});if(contact){k.network163=k.network163||[];if(!k.network163.includes(contact.name))k.network163.push(contact.name);}return 'làm quen với một người có ảnh hưởng trong buổi giao lưu và giữ liên lạc.';}
   bond(-4);return 'dùng lời hòa giải để giành lợi thế riêng. Người nhà bắt đầu dè dặt với con.';
 case 'spender':
   if(n===0)return (k.savings158>l.base*2?'thuê xe sang để đi tiệc và mua đồ hiệu.':'chi nhiều cho tiệc và đồ hiệu.')+debt(cost,'Chi tiêu tiệc và đồ hiệu');
   if(n===1){bond(-4);return 'lỡ hẹn với gia đình vì đi chơi và gọi về nhờ giải quyết hóa đơn. Gia đình chưa nhận trả thay.';}
   if(constructive){bond(2);return 'thừa nhận chuyện chi tiêu và lập giới hạn cho những lần đi chơi sau.';}
   var allowance=k.dynasty908&&k.dynasty908.allowance;
   var cut=allowance&&allowance.active&&allowance.tier!=='basic';
   if(cut){allowance.active=false;allowance.stopped=l.age;}
   return 'dùng danh tiếng gia đình để mua chịu một buổi tiệc.'+debt(cost*2,'Hóa đơn tiệc mua chịu')+(cut?' Gói trợ cấp thêm đã dừng.':'');
 case 'rebel':
   if(n===0){var pushed=p.plan.majorByParent;delete p.plan.majorByParent;bond(-1);return pushed?'công khai từ chối ngành học mà gia đình đã chọn.':'nói rõ muốn tự chọn ngành học và người mình sẽ kết hôn.';}
   if(n===1){bond(-3);return 'đăng bài chỉ trích các quy tắc trong nhà và đưa người mình quý đến gặp gia đình.';}
   if(a>=18&&!constructive){p.plan.home='thuê nhà riêng';return 'chọn ra ở riêng và tự thu xếp sinh hoạt để được sống theo quyết định của mình.';}
   bond(4);return 'thống nhất ranh giới riêng với bố mẹ sau một cuộc nói chuyện thẳng thắn.';
 case 'entitled':
   if(n===0){bond(-4);return 'viện họ của gia đình để đòi ưu tiên và nói lời xúc phạm nhân viên phục vụ. Một số người tránh tiếp xúc với con.';}
   if(n===1){pathSibling(l,k,sib,-8);prestige(-3);return sib?'xô xát với anh chị em khi ép nhường quyền lợi. Người nhà can thiệp để bảo đảm an toàn.':'gây gổ với người ngoài sau khi bị từ chối ưu tiên. Sự việc ảnh hưởng uy tín gia đình.';}
   if(a>=18&&!constructive&&r()<.18){
     s.legal={opened:a,status:'investigating',pregnancy:k.sex==='M'&&r()<.25};prestige(-8);bond(-6);
     return 'bị một phụ nữ trưởng thành tố cáo cưỡng ép quan hệ tình dục. Cơ quan chức năng tiếp nhận vụ việc; người bị hại được hỗ trợ riêng.'+(s.legal.pregnancy?' Người phụ nữ cho biết mình mang thai; con từ chối nhận trách nhiệm. Quan hệ cha con chưa được xác minh.':'');
   }
   if(constructive){bond(2);return 'xin lỗi người bị xúc phạm và bắt đầu sửa cách ứng xử.';}
   prestige(-3);return 'tiếp tục chế giễu người khác và bị loại khỏi một buổi gặp cộng đồng.';
 case 'overlooked':
   if(n===0){bond(-2);return 'tự giải quyết rắc rối ở trường rồi tâm sự với bạn trước khi nói với bố mẹ.';}
   if(n===1){bond(-2);return 'thừa nhận cảm thấy cô đơn dù vẫn tự chăm lo được cho mình. Con thường tìm bạn tâm sự trước khi tìm đến bố mẹ.';}
   bond(constructive?6:-5);return constructive?'hẹn một buổi riêng với bố mẹ và kể điều đã giữ kín lâu nay.':'cố tình bỏ một cuộc hẹn để xem người nhà có nhận ra sự vắng mặt của mình.';
 case 'manipulator':
   if(n===0){bond(-2);return 'kể hai phiên bản khác nhau của cùng một chuyện để được người nhà ưu ái.';}
   if(n===1){pathSibling(l,k,sib,-6);return sib?'đổ lỗi cho anh chị em để giành phần lợi. Quan hệ giữa hai người xấu đi.':'bóp méo một lời hứa của gia đình để được ưu tiên.';}
   if(constructive){pathSibling(l,k,sib,3);bond(3);return 'đồng ý đối chiếu lời kể và sửa lại thông tin sai.';}
   bond(-5);return 'tiếp tục gây sức ép riêng. Gia đình yêu cầu có người chứng kiến khi bàn quyền lợi.';
 case 'secret':
   if(n===0)return 'giấu hóa đơn mua sắm hoặc khoản chuyển cho bạn bè.'+debt(cost,'Chi tiêu cá nhân chưa kể với gia đình');
   if(n===1){bond(-3);return 'né tránh khi người nhà hỏi về một hóa đơn vừa được gửi tới.';}
   if(constructive){bond(3);return 'chủ động cho người nhà xem sổ chi và lên kế hoạch trả nợ bằng tiền riêng.';}
   return 'tiếp tục mua chịu để giữ vẻ ngoài dư dả.'+debt(cost*2,'Khoản mua chịu riêng');
 case 'thrill':
   if(n===0){p.traits.impulse=cl(p.traits.impulse+2);return 'đăng ký chuyến leo núi khó vì muốn thử giới hạn của bản thân.';}
   if(n===1){bond(-2);if(r()<.35)return 'bốc đồng đặt cược vào kết quả một cuộc đua.'+debt(cost*.5,'Khoản thua cược cá nhân');return 'bỏ qua lời khuyên và tham gia một cuộc đua tự phát.';}
   if(constructive){p.traits.regulation=cl(p.traits.regulation+5);return 'chuyển sang thử sức ở đường đua có giám sát và đồ bảo hộ.';}
   prestige(-3);return 'gặp tai nạn trong cuộc đua và phải chi tiền khắc phục hậu quả.'+debt(cost,'Chi phí sau tai nạn');
 case 'kind':
   if(n===0){pathSibling(l,k,sib,4);bond(2);return sib?'dành thời gian giúp anh chị em vượt qua một tuần khó khăn.':'để ý thấy một người đang gặp khó khăn và ở lại giúp họ.';}
   if(n===1 && sib && r()<.5 && k.savings158>0){
     var shared=pathSpend(l,k,cost*.4,'Chia sẻ tiền riêng với anh chị em');
     E.RELATIVE163.post(l,sib,shared,'Được '+k.name+' giúp đỡ','gift834:'+X.uid(l,k)+':'+a);
     pathSibling(l,k,sib,4);return 'chia sẻ '+H.money(l,shared)+' tiền riêng với '+sib.name+'.';
   }
   if(n===1){var gift=pathSpend(l,k,cost*.4,'Đóng góp thiện nguyện');return gift?'trích '+H.money(l,gift)+' từ tiền riêng để giúp người gặp khó khăn.':'dành một ngày làm tình nguyện vì chưa có tiền riêng để quyên góp.';}
   if(constructive){p.traits.regulation=cl(p.traits.regulation+3);return 'học cách hỏi rõ nhu cầu và đặt giới hạn khi giúp đỡ.';}
   p.fear=cl(p.fear+4);return 'nhận quá nhiều lời nhờ vả và kiệt sức vì không biết từ chối.';
 case 'perfect':
   if(n===0){study(4);return 'lập lịch ôn tập và kiểm tra từng phần việc nhiều lần trước khi nộp.';}
   if(n===1){p.fear=cl(p.fear+6);return 'tự trách mình vì một sai sót nhỏ dù kết quả chung vẫn tốt.';}
   if(constructive){rel(k,p,3,2,-5);return 'kể thật về một thất bại và bắt đầu đặt mục tiêu vừa sức.';}
   rel(k,p,-3,-1,3);return 'giấu một kết quả không như ý vì sợ làm bố mẹ thất vọng.';
 }
}
function developPath(l,k,p,r,log) {
 var a=age(l,k), s=p.path834;
 if(a<10||(!s && !near(k))||(k.jail && (!Number.isFinite(k.jail)||a<k.jail)))return;
 if(!s){
   if(a>28||r()>=.07)return;
   var pool=Object.keys(PATHS).filter(function(id){return a>=PATHS[id][3] && (id!=='heir'||familyCompany(l)) && (id!=='scholar'||a<18||k.uniUntil>a);});
   if(!pool.length)return;
   var kind=U.wpick(r,pool,function(id){var weight=.4+p.traits[PATHS[id][2]]/70;return id==='overlooked'&&p.attach<40?weight*2:weight;});
   s=p.path834={kind:kind,step:0,next:a};
 }
 if(s.legal && s.legal.status==='investigating' && a>=s.legal.opened+2){
   s.legal.status='reviewed';
   var msg='Cơ quan chức năng hoàn tất bước xác minh ban đầu, chuyển hồ sơ để xem xét trách nhiệm. Chưa có phán quyết.'+(s.legal.pregnancy?' Việc xác định cha con và hỗ trợ cho em bé được xem xét riêng.':'');
   remember(l,k,msg,4,'bad');log(k.name+': '+msg,'bad');return;
 }
 if(s.legal && s.legal.status==='reviewed' && a>=s.legal.opened+4){
   var proven=r()<.65;
   s.legal.status=proven?'liable':'closed';s.legal.closedAt=a;
   var decision=proven?'Vụ việc đã được xét xử. Con phải chịu trách nhiệm theo phán quyết trong mô phỏng.':'Vụ việc khép lại vì hồ sơ chưa đủ chứng cứ để kết luận.';
   if(proven)E.ELITE148.rep(l,-4);
   if(s.legal.pregnancy){
     s.legal.parentage=r()<.75?'confirmed':'unconfirmed';
     decision+=s.legal.parentage==='confirmed'?' Kết quả xác minh cha con riêng biệt xác nhận trách nhiệm cấp dưỡng.':' Chưa xác nhận được quan hệ cha con.';
   }
   remember(l,k,decision,4,'neutral');log(k.name+': '+decision,'neutral');return;
 }
 if(s.legal && s.legal.parentage==='confirmed' && a-s.legal.opened<=18 && s.legal.paidAge!==a){
   s.legal.paidAge=a;
   var due=l.base*.035, paid=pathSpend(l,k,due,'Cấp dưỡng sau khi xác minh cha con');
   if(paid<due)k.debt158+=due-paid;
 }
 if(s.step>=3||a<s.next)return;
 var text=pathStep(l,k,p,s,r);
 s.lastText=text;s.step++;s.next=a+2+Math.floor(r()*3);s.response=null;
 remember(l,k,text,3,'neutral',false);log(k.name+' '+text,'neutral');
}

function pathDescription(p){
 var s=p&&p.path834, parts=[];
 if(s&&s.lastText)parts.push('Con '+s.lastText);
 if(s&&s.legal)parts.push('Hồ sơ vụ việc: '+({investigating:'đang xác minh',reviewed:'đang xem xét',liable:'đã có phán quyết',closed:'đã khép lại'}[s.legal.status]||'đang theo dõi')+'.');
 return parts.join(' ');
}
function pathResponse(l,k,p,choice,log){
 var s=p.path834;
 if(!s||s.response||s.step>=3)return;
 s.response=choice;
 var listening=choice==='listen';
 rel(k,p,listening?2:-2,listening?2:-1,listening?-1:2);
 var text=listening?'được gia đình nghe kể trước khi cùng đặt giới hạn cụ thể.':'bị yêu cầu làm theo cách gia đình mong muốn.';
 remember(l,k,text,2,listening?'good':'bad',false);log(k.name+' '+text,'neutral');
}

function year(l,r,log,a,F){if(!l.alive)return;(l.kids||[]).forEach(function(k){if(!live(k)||k.born>l.age)return;var p=init(l,k);if(p.year===l.age)return;p.year=l.age;var ka=age(l,k),tr=tier(l,F);evolve(l,k,p,r);schoolYear(l,k,r,log,F);retake(l,k,p,r,log);if(p.gapUntil===ka){p.gapUntil=null;var back=r()<.4+p.traits.ambition/200;if(back)p.retakeAt=ka+1;log(k.name+' kết thúc năm nghỉ, quyết định '+(back?'ôn thi lại đại học.':'đi làm theo sở thích về '+p.interests[0]+'.'),'neutral');}
 if(!k.jail&&near(k)){var e=pickEvent(l,k,p,r,tr);if(e){p.seen[e.id]=l.age;if(e.ask){if(e.id==='ill')p.ill=true;X.next(l,'moment141',r,{id:X.uid(l,k),ev:e.id},{manual:false});}else e.run(l,k,p,r,log,tr);}}
 developPath(l,k,p,rng(l.id+':path834:'+X.uid(l,k)+':'+ka),log);
 resurface(l,k,p,r,log);});}
X.menu('moment141','Chuyện của con',function(l){return l&&l.alive?true:'Cuộc đời đã kết thúc';},function(l,d){var a=d.arg||{},k=find(l,a.id),e=EV.find(function(x){return x.id===a.ev;});return k&&e?k.name+' ('+age(l,k)+' tuổi): '+e.ask+'. Cách bạn phản ứng ảnh hưởng tới sự tin tưởng, gắn bó và nỗi sợ của con.':'Hoàn cảnh đã thay đổi.';},function(l,a){var k=find(l,a.id);if(!k||!ASK[a.ev])return[];return ASK[a.ev].map(function(o){return{k:o[0],l:o[1],run:function(l,r,log){var kid=find(l,a.id);if(kid)o[2](l,kid,init(l,kid),r,log);}};});},0);
// Age-appropriate parenting requests. Adults only receive advice and support.
function requests(l,k){var a=age(l,k),b=l.base||1,p=init(l,k),fav=p.interests[0];
 var all=[{k:'play',min:0,max:5,l:'Chơi, đọc truyện cùng con',run:function(l,k,p,r,log){rel(k,p,1,3,0);log('Bạn dành buổi tối đọc truyện cùng '+k.name+'.','good');}},
 {k:'checkup',min:0,max:5,l:'Khám sức khỏe định kỳ cho con · '+H.money(l,b*.02),cost:b*.02,run:function(l,k,p,r,log){log(k.name+' được khám định kỳ, phát triển bình thường.','neutral');}},
 {k:'rules',min:3,max:11,l:'Đặt giới hạn giờ ngủ và thời gian dùng thiết bị',fit:-.3,run:function(l,k,p,r,log){var x=react(l,k,r,-.3,false);log(k.name+' '+REACT[x]+' với giới hạn mới.','neutral');if(x==='agree'||x==='negotiate')p.traits.regulation=cl(p.traits.regulation+2);}},
 {k:'homework',min:6,max:15,l:'Cùng con làm bài, khen sự cố gắng thay vì điểm số',run:function(l,k,p,r,log){rel(k,p,2,2,-1);p.traits.diligent=cl(p.traits.diligent+2);log('Bạn ngồi cùng '+k.name+' làm bài; con kiên trì hơn khi gặp bài khó.','good');}},
 {k:'extra',min:6,max:17,l:'Cho con học năng khiếu về '+fav+' · '+H.money(l,b*.06),cost:b*.06,run:function(l,k,p,r,log){var x=react(l,k,r,.7,false);if(x==='refuse'||x==='defy'){log(k.name+' '+REACT[x]+'; con muốn có thời gian rảnh. Bạn chưa đóng học phí.','neutral');return false;}p.talent.level=cl(p.talent.level+(p.talent.domain===fav?5:2));log(k.name+' '+REACT[x]+' và bắt đầu lớp '+fav+'.','good');}},
 {k:'push',min:6,max:17,l:'Bắt con học thêm nhiều môn để lấy thành tích · '+H.money(l,b*.08),cost:b*.08,run:function(l,k,p,r,log){var x=react(l,k,r,-.6,true);if(x==='refuse'||x==='defy'){log(k.name+' '+REACT[x]+'. Lịch học thêm bị bỏ dở, chưa đóng tiền.','bad');return false;}k.study=U.clamp((k.study||50)+2,0,100);log(k.name+' '+REACT[x]+'. Điểm có thể nhích lên, nhưng con mệt và ít cười hơn.','neutral');}},
 {k:'chores',min:5,max:17,l:'Giao việc nhà vừa sức',fit:-.1,run:function(l,k,p,r,log){var x=react(l,k,r,-.1,false);if(x!=='refuse'&&x!=='defy')p.traits.selfReliance=cl(p.traits.selfReliance+2);log(k.name+' '+REACT[x]+' khi được giao việc nhà.','neutral');}},
 {k:'curfew',min:12,max:18,l:'Đặt giờ về nhà buổi tối',run:function(l,k,p,r,log){var x=react(l,k,r,-.4,false);log(k.name+' '+REACT[x]+' với giờ giới nghiêm.',x==='defy'?'bad':'neutral');}},
 {k:'phone',min:10,max:18,l:'Kiểm tra điện thoại của con',run:function(l,k,p,r,log){var x=react(l,k,r,-.9,true);log(k.name+' '+REACT[x]+'. Con cảm thấy bị xâm phạm riêng tư.','bad');remember(l,k,'Lần bố mẹ kiểm tra điện thoại của '+k.name+'.',3,'bad',false);}},
 {k:'listen',min:6,max:200,l:'Lắng nghe con, không phán xét',run:function(l,k,p,r,log){rel(k,p,3,2,-2);log(k.name+' mở lòng kể về '+(age(l,k)<18?'bạn bè và những lo lắng ở trường':'công việc và những dự định riêng')+'.','good');}},
 {k:'major',min:15,max:18,l:'Gợi ý con chọn khối thi, ngành học theo ý gia đình',run:function(l,k,p,r,log){var x=react(l,k,r,-.4,false);if(x==='agree'||x==='reluctant')p.plan.majorByParent=true;log(k.name+' '+REACT[x]+' với gợi ý ngành học của bạn.','neutral');}},
 {k:'adviseCareer',min:19,max:200,l:'Góp ý về nghề nghiệp của con',run:function(l,k,p,r,log){var x=react(l,k,r,0,false);log(x==='agree'?k.name+' cảm ơn góp ý và sẽ cân nhắc.':k.name+' lắng nghe nhưng tự quyết theo hướng riêng ('+REACT[x]+').','neutral');}},
 {k:'adviseHome',min:19,max:200,l:'Góp ý chuyện nơi ở, hôn nhân và con cái của con',run:function(l,k,p,r,log){var x=react(l,k,r,-.2,false);log(k.name+' '+REACT[x]+'. Quyết định cuối cùng vẫn là của con.','neutral');}},
 {k:'support',min:19,max:200,l:'Hỗ trợ con một khoản tài chính · '+H.money(l,b*.2),cost:b*.2,run:function(l,k,p,r,log){var take=r()<.5+(100-p.traits.selfReliance)/200;if(!take){log(k.name+' cảm ơn nhưng muốn tự lo; bạn giữ lại khoản tiền.','neutral');rel(k,p,2,1,0);return false;}rel(k,p,1,2,0);log(k.name+' nhận khoản hỗ trợ của bố mẹ.','good');}},
 {k:'repair',min:6,max:200,l:'Xin lỗi và nói chuyện về chuyện cũ',show:function(l,k,p){return p.trust<50||p.memories.some(function(m){return m.tone==='bad'&&!m.healed;});},run:function(l,k,p,r,log){var m=p.memories.filter(function(x){return x.tone==='bad'&&!x.healed;}).pop(),ok=r()<.45+p.attach/200+p.traits.empathy/300;if(ok&&m)m.healed=true;rel(k,p,ok?6:2,ok?4:1,-3);log(ok?'Bạn xin lỗi '+k.name+(m?' về chuyện "'+m.text+'"':'')+'. Con im lặng một lúc rồi ôm bạn.':'Bạn mở lời xin lỗi; '+k.name+' cần thêm thời gian, nhưng cánh cửa đã hé mở.','good');}}];
 if(p.path834 && p.path834.step<3 && !p.path834.response){
   all.unshift({k:'pathListen',min:10,max:200,l:'Dành thời gian nói chuyện riêng với con',run:function(l,k,p,r,log){pathResponse(l,k,p,'listen',log);}},
     {k:'pathPress',min:10,max:200,l:'Yêu cầu con làm theo kỳ vọng của gia đình',run:function(l,k,p,r,log){pathResponse(l,k,p,'press',log);}});
 }
 return all.filter(function(o){return a>=o.min&&a<=o.max&&(!o.show||o.show(l,k,p));});}
X.menu('children141','Tính cách và chuyện của các con',function(l){return !l||!l.alive?'Cuộc đời đã kết thúc':l.age<16?'Cần đủ 16 tuổi':!(l.kids||[]).some(live)?'Chưa có con':true;},'Mỗi người con có tính cách riêng, thay đổi dần theo thời gian. Tính cách chỉ làm thay đổi khả năng xảy ra, không định sẵn kết quả.',function(l){return (l.kids||[]).filter(live).slice(0,40).map(function(k){var id=X.uid(l,k);return{k:id,l:k.name+' · '+age(l,k)+' tuổi · '+stage(age(l,k)),run:function(l,r){X.next(l,'child141',r,{id:id});}};});},16,'Tình cảm & gia đình');
X.menu('child141','Hồ sơ và cách đồng hành',function(l){return l&&l.alive?true:'Cuộc đời đã kết thúc';},function(l,d){var k=find(l,(d.arg||{}).id);return k?profile(l,k):'Hoàn cảnh của con đã thay đổi.';},function(l,a){var k=find(l,a.id);if(!k)return[];var p=init(l,k);return requests(l,k).map(function(o){return{k:o.k,l:o.l,why:p.acted[o.k]===l.age?'Đã làm năm nay':!near(k)?'Con đang sống với người giám hộ khác':o.cost&&l.money<o.cost?'Chưa đủ tiền ('+H.money(l,o.cost)+')':true,run:function(l,r,log){var kid=find(l,a.id);if(!kid)return;var q=init(l,kid);if(q.acted[o.k]===l.age||o.cost&&l.money<o.cost)return;q.acted[o.k]=l.age;var res=o.run(l,kid,q,r,log);if(o.cost&&res!==false)H.cash(l,-o.cost,o.k==='support'?'Hỗ trợ con':'Chi phí cho con');}};});},16);
function words(v,hi,mid,lo){return v>=70?hi:v>=40?mid:lo;}
function profile(l,k){var p=init(l,k),a=age(l,k),t=p.traits,stand=KEYS.filter(function(x){return t[x]>=72||t[x]<=28;}).sort(function(x,y){return Math.abs(t[y]-50)-Math.abs(t[x]-50);}).slice(0,4).map(function(x){return TRAITS[x][t[x]>=50?1:0];});
 var status=a<3?'ở nhà với gia đình':a<6?'học mẫu giáo':a<18?(p.school?'học lực '+p.school.band:'đang đi học'):k.uniUntil?'đang học đại học':k.internship170&&E.EDUCATION170?'đang '+E.EDUCATION170.describe(l,k):k.job&&E.kidTitle?'làm '+E.kidTitle(k):p.examFail&&p.examFail.age>=a-1?'đang '+FAIL[p.examFail.choice]:'đang tìm hướng đi';
 return (p.path834?pathDescription(p)+' ':'')+k.name+' · '+a+' tuổi · giai đoạn '+stage(a)+'. Nét nổi bật: '+(stand.length?stand.join(', '):'cân bằng, chưa có nét nào quá rõ')+'. Sở thích: '+p.interests.join(', ')+(p.talent.shown?'; năng khiếu '+p.talent.domain+' '+words(p.talent.level,'nổi bật','khá','đang hình thành'):'')+'. Ước mơ: '+(p.dream||'chưa rõ')+'. Tin tưởng bố mẹ: '+words(p.trust,'nhiều','vừa phải','còn dè dặt')+'; gắn bó: '+words(p.attach,'rất gắn bó','bình thường','xa cách')+'; áp lực, e sợ: '+words(p.fear,'nặng nề','có phần','thoải mái')+'. Hiện tại: '+status+'.'+(p.plan.home?' Nơi ở: '+p.plan.home+'.':'')+(p.plan.marriage?' Hôn nhân: '+p.plan.marriage+'.':'')+(p.milestones.length?' Cột mốc: '+p.milestones.slice(-4).map(function(m){return m.text+' ('+m.age+' tuổi)';}).join('; ')+'.':'');}
// The university exam: keep the original pass roll and replace only the fixed "always vocational" outcome after a fail.
var D18=E.DEC.con_18;if(D18){var apply18=D18.apply;D18.apply=function(l,d,key,r,log){var n=d&&d.data&&d.data.n,k=(l.kids||[]).find(function(x){return live(x)&&x.name===n;}),failed=false,wrapped=function(m,tone){if(k&&typeof m==='string'&&m.indexOf(' thi trượt đại học, quyết định đi học nghề.')>=0){failed=true;return;}return log.apply(this,arguments);};var out=apply18.call(this,l,d,key,r,wrapped);if(failed&&k)afterFail(l,k,r,log);else if(k&&k.uniUntil)milestone(l,k,'Đỗ đại học');return out;};}
var migrate=E.migrateExt;E.migrateExt=function(l){if(migrate)migrate(l);(l.kids||[]).forEach(function(k){var p=k.persona141;if(!p)return;p.traits=p.traits||{};KEYS.forEach(function(x){if(!Number.isFinite(p.traits[x]))p.traits[x]=50;});['memories','milestones','interests'].forEach(function(x){if(!Array.isArray(p[x]))p[x]=[];});if(!p.interests.length)p.interests=['đọc sách'];['seen','acted','plan'].forEach(function(x){if(!p[x]||typeof p[x]!=='object')p[x]={};});if(!p.talent)p.talent={domain:p.interests[0],level:50,shown:false};['trust','attach','fear'].forEach(function(x){if(!Number.isFinite(p[x]))p[x]=x==='fear'?15:50;});});};
E.HOOKS.year.push(year);E.CHILD141={paths:PATHS,pathDescription:pathDescription,init:init,react:react,schoolScore:schoolScore,band:band,failChoice:failChoice,afterFail:afterFail,tier:tier,year:year,profile:profile,requests:requests,events:EV,remember:remember,rel:rel,TRAITS:TRAITS};
})(globalThis.G);
