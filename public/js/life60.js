/* v4.10.0 — Xưởng phim: hồ sơ diễn viên và dự án đều là mô phỏng hư cấu.
   Ngân sách hãng không đi qua ví người chơi; chỉ cát-xê / vốn cá nhân được ghi sổ. */
(function (G) {
  'use strict';
  var E=G.E,H=E.H,U=G.U;
  if(!E.CONCERT_CATS.kr.a.some(function(a){return a.n==='T-ara';}))E.CONCERT_CATS.kr.a.push({n:'T-ara',b:1989});
  if(E.IDOLS.world.indexOf('T-ara')<0)E.IDOLS.world.push('T-ara');E.IDOL_BORN['T-ara']=1989;
  if(E.TALENTS.indexOf('đạo diễn')<0)E.TALENTS.push('đạo diễn');
  E.CAR.dao_dien.talent='đạo diễn';
  E.TALENT_SCHOOLS['đạo diễn']={sug:'trợ lý đạo diễn → đạo diễn điện ảnh, truyền hình, phim ngắn và nội dung số',sch:[
    ['dd_hn','Trường Đại học Sân khấu – Điện ảnh Hà Nội','Hà Nội','art','Đạo diễn điện ảnh',.58,'uni',['dao_dien','bien_kich'],'thi năng khiếu tư duy hình ảnh, kể chuyện và phân tích phim (mô phỏng)'],
    ['dd_hcm','Trường Đại học Sân khấu – Điện ảnh TP. Hồ Chí Minh','TP. Hồ Chí Minh','art','Đạo diễn điện ảnh – truyền hình',.56,'uni',['dao_dien','bien_kich'],'thi phân tích phim, kể chuyện bằng hình ảnh (mô phỏng)'],
    ['dd_tv','Trường Đại học Sân khấu – Điện ảnh Hà Nội','Hà Nội','art','Đạo diễn truyền hình',.54,'uni',['dao_dien'],'thi năng khiếu và tư duy kể chuyện truyền hình (mô phỏng)']
  ]};
  var uni=E.DEC.uni,um=uni.make,ua=uni.apply;
  uni.make=function(l){var d=um.apply(this,arguments);if(l.talent==='đạo diễn'&&H.isVN(l))d.text+=' Bạn có năng khiếu đạo diễn: có thể chọn một trong các trường / ngành đạo diễn bên dưới. Đỗ mới bắt đầu khóa học 4 năm, tốt nghiệp rồi làm trợ lý trước. Cách thi và xác suất trong game được giản lược, không phải quy chế tuyển sinh thật.';return d;};
  uni.apply=function(l,d,k){if(/^nk_dd_/.test(k)&&(!free(l)||l.age<18||l.edu<3||l.talent!=='đạo diễn'||!H.isVN(l)||!d.opts.some(function(o){return o.k===k;})||l.school))return;return ua.apply(this,arguments);};
  function filmStudent(l){return !!(l.school==='uni'&&l.major==='art'&&l.flags.tSchool&&!l.flags.tSchool.out&&/^(dd_|skda_dd)/.test(l.flags.tSchool.id));}
  // Không đưa sinh viên đạo diễn đi thực tập kiến trúc chỉ vì cùng nhóm ngành art.
  var intern=E.DEC.thuc_tap.def,ip=intern.prep;intern.prep=function(l,r){return filmStudent(l)?{p:[U.pick(r,['một đoàn phim truyền hình','xưởng phim thực nghiệm','ê-kíp phim ngắn độc lập']),'dao_dien']}:ip.apply(this,arguments);};
  var thesis=E.DEC.bao_ve_tn.def,tt=thesis.title,tx=thesis.text;
  thesis.title=function(l){return filmStudent(l)?'Bảo vệ đồ án phim tốt nghiệp':tt(l);};
  thesis.text=function(l){return filmStudent(l)?'Năm cuối ngành '+l.flags.tSchool.mn+' tại '+l.flags.tSchool.n+': trình bày phim bài tập, ý đồ đạo diễn, hồ sơ sản xuất và trả lời hội đồng. Vẫn phải đạt yêu cầu mới tốt nghiệp; chưa được cấp bằng ngay khi nhập học.':tx(l);};
  var FORMATS={tv:{n:'Phim truyền hình',budget:1800,fee:100,reach:250000},cinema:{n:'Phim điện ảnh',budget:6000,fee:250,reach:600000},web:{n:'Phim web drama',budget:450,fee:40,reach:100000},short:{n:'Phim ngắn',budget:45,fee:6,reach:12000}};
  var GENRES={drama:'Chính kịch',romance:'Tình cảm',action:'Hành động',horror:'Kinh dị',comedy:'Hài',mystery:'Trinh thám',fantasy:'Kỳ ảo',family:'Gia đình',scifi:'Khoa học viễn tưởng',history:'Lịch sử'};
  var STAGES=['format','medium','source','genre','fund','cast1','cast2','script','board','prep','shoot1','shoot2','incident','edit','sound','release'];
  var TITLES=['Chọn định dạng phim','Người đóng hay hoạt hình?','Câu chuyện và quyền chuyển thể','Chọn thể loại phim','Ký hợp đồng sản xuất','Casting vai chính','Casting vai đối trọng','Phòng kịch bản','Mini game: sắp xếp storyboard','Tiền kỳ và lịch sản xuất','Ngày sản xuất thứ nhất','Mini game: bắt lỗi liên tục','Biến cố trong đoàn','Hậu kỳ: dựng phim','Âm thanh và bản nhạc','Phát hành và gặp khán giả'];
  var STRENGTHS=['biểu cảm tinh tế','đài từ rõ','phối hợp bạn diễn tốt','ứng biến nhanh','diễn bằng ánh mắt','kỷ luật trường quay'];
  var WEAKNESSES=['khó giữ nhịp cảnh dài','cần luyện giọng','dễ căng thẳng trước ống kính','chưa quen kỹ xảo','cần tập cảnh hành động','cần thêm thời gian nhập vai'];
  var INCIDENTS=[
    ['Mưa lớn trùng lịch ngoại cảnh.','Chuyển sang cảnh nội, giữ ngày nghỉ','Cố quay giữa mưa nguy hiểm'],
    ['Diễn viên mất giọng, lịch thu thoại bị chậm.','Dời cảnh thoại, cho diễn viên nghỉ','Ép quay đủ cảnh bất chấp sức khỏe'],
    ['Một cảnh bị rò rỉ lên mạng trước lịch quảng bá.','Khoanh vùng bản dựng, công bố thông tin phù hợp','Đổ lỗi công khai khi chưa xác minh'],
    ['Đạo cụ giao sai màu, không khớp cảnh đã quay.','Sửa đạo cụ và chụp ảnh đối chiếu','Bỏ qua vì nghĩ khán giả không để ý'],
    ['Đoàn tranh luận vì lịch làm việc quá dày.','Điều chỉnh lịch, giới hạn giờ làm','Tiếp tục ép đoàn tăng ca'],
    ['Khán giả thử nghiệm chưa hiểu động cơ nhân vật.','Dựng lại điểm nhìn và thêm cảnh nối đã có','Giữ nguyên mọi thứ mặc phản hồi']
  ];
  function year(l){return l.birthYear+l.age;}
  function location(l){return (l.abroad&&l.abroad.code)||l.country;}
  function free(l){return l.alive&&l.age>=18&&!(l.jailUntil!=null&&l.age<l.jailUntil)&&!(l.flags.military&&l.age<l.flags.military)&&!(l.abroad&&l.abroad.trapped);}
  function showBusy(l){var f=l.flags;return !!((f.tv&&!f.tv.done&&!f.tv.out&&!f.tv.no)||(f.variety&&!f.variety.done));}
  function project(l){return l.flags.film;}
  function busy(l){return !!(project(l)&&!project(l).done);}
  function director(l){return !!(l.job&&E.resolveJob(l.job.id)==='dao_dien'&&!l.school&&!l.retired&&l.edu>=5);}
  function jobKey(l){var j=l.job;return j?[j.id,j.since,j.rankSince,j.rank].join(':'):'';}
  function canStart(l){return free(l)&&director(l)&&l.st.hea>=35&&!showBusy(l)&&!busy(l)&&(!project(l)||project(l).year!==year(l));}
  function value(l,n){return n/90*l.base;}
  function context(l){return {year:year(l),country:location(l),cur:l.cur,job:jobKey(l)};}
  function same(l,d){return d&&d.year===year(l)&&d.country===location(l)&&d.cur===l.cur&&d.job===jobKey(l);}
  function valid(l,d){var p=project(l);return free(l)&&director(l)&&l.st.hea>=25&&!showBusy(l)&&!!p&&!p.done&&same(l,p)&&(!d||(d.token===p.token&&d.stage===p.stage));}
  function role(l){return project(l).medium==='animation'?'diễn viên lồng tiếng':'diễn viên';}
  function format(p){return FORMATS[p.format];}
  function candidate(l,r,i){var age=U.randint(r,18,62),vn=location(l)==='VN',co=G.W.BY[location(l)],province=vn?U.pick(r,G.VN.P63).name:co?U.pick(r,co.cities)+' · '+co.name:(l.abroad&&l.abroad.name)||l.countryName;
    return {id:project(l).token+':'+i,name:H.stranger(l,r,r()<.5?'M':'F'),born:year(l)-age,home:province,acting:U.randint(r,35,95),voice:U.randint(r,35,95),reliable:U.randint(r,45,95),genre:U.pick(r,Object.keys(GENRES)),strength:U.pick(r,STRENGTHS),weakness:U.pick(r,WEAKNESSES)};
  }
  function casting(l,r){var p=project(l);p.candidates=[];for(var i=0;i<6;i++){var a=candidate(l,r,i);if(p.candidates.some(function(x){return x.name===a.name;}))a.name+=' '+(i+1);p.candidates.push(a);}p.cast=[];}
  function actorText(l,a){var p=project(l);return a.name+' · '+(year(l)-a.born)+' tuổi · Quê: '+a.home+' · Diễn xuất '+a.acting+'/100 · Giọng '+a.voice+'/100 · Kỷ luật '+a.reliable+'/100 · Sở trường '+GENRES[a.genre]+'. Mạnh: '+a.strength+'. Yếu: '+a.weakness+'.'+(p.medium==='animation'?' Casting giọng, không đánh giá ngoại hình.':'');}
  function cancel(l,log,why){var p=project(l);if(!p||p.done)return;p.done=true;p.status='cancelled';p.reason=why||'tự dừng dự án';log('Dừng dự án '+p.name+': '+p.reason+'.'+(p.funding==='self'?' Vốn đã chi không tự hoàn lại.':' Hãng chịu ngân sách sản xuất; chưa phát hành nên bạn chưa nhận cát-xê hoàn tất.'),'neutral');l.pending=l.pending.filter(function(d){return d.id!=='film_step';});}
  function queue(l,r,log){if(!valid(l)){cancel(l,log,'lịch / nghề / nơi ở / sức khỏe không còn phù hợp');return;}l.pending.unshift(E.DEC.film_step.make(l,r));}
  function start(l,r,log){if(!canStart(l))return;var token=l.flags.filmSerial=(l.flags.filmSerial||0)+1;
    l.flags.film=Object.assign(context(l),{token:token,stage:0,done:false,status:'development',name:U.pick(r,['Mùa gió trở lại','Phía bên kia cửa','Chuyến xe cuối ngày','Một lời chưa nói','Ánh sáng cuối phố','Ngày mai bắt đầu'])+' #'+token,quality:40,trust:50,history:[],incident:U.randint(r,0,INCIDENTS.length-1)});
    queue(l,r,log);
  }
  function o(k,l,h){return{k:k,l:l,h:h||''};}
  function choices(l){var p=project(l),s=STAGES[p.stage],a=[];
    if(s==='format')Object.keys(FORMATS).forEach(function(k){if(k==='short'||(l.job.rank||0)>=1)a.push(o(k,FORMATS[k].n,k==='tv'?'Một mùa ngắn mô phỏng trong năm':k==='cinema'?'Phát hành rạp':k==='web'?'Phát hành theo tập trên mạng':'Dự án đầu tay / liên hoan phim'));});
    if(s==='medium')a=[o('live','Phim người đóng (live action)'),o('animation','Phim hoạt hình','Chọn họa sĩ / animator theo ê-kíp; casting diễn viên lồng tiếng')];
    if(s==='source')a=[o('original','Kịch bản gốc do ê-kíp sáng tác'),o('adapt','Chuyển thể tác phẩm được cấp phép','Phí quyền chuyển thể nằm trong ngân sách; người đóng = live action chuyển thể'),o('public','Chuyển thể tác phẩm thuộc phạm vi công cộng','Kiểm tra quyền với từng bản dịch / hình ảnh, không mặc định mọi bản chuyển thể đều miễn phí')];
    if(s==='genre')Object.keys(GENRES).forEach(function(k){a.push(o(k,GENRES[k]));});
    if(s==='fund'){var b=value(l,format(p).budget)*(p.medium==='animation'?1.2:1),fee=value(l,format(p).fee);a=[o('studio','Nhận dự án do hãng đầu tư','Hãng thanh toán '+H.money(l,b)+' cho cả ê-kíp, không cộng vào ví bạn. Cát-xê sau phát hành '+H.money(l,fee)+'; không hưởng toàn bộ doanh thu.')];if(l.money>=b)a.push(o('self','Tự đầu tư '+H.money(l,b),'Trừ một lần toàn bộ ngân sách, gồm diễn viên, bản quyền, hậu kỳ, quảng bá. Thu hồi từ doanh thu ròng mô phỏng; có thể lỗ.'));}
    if(s==='cast1'||s==='cast2')p.candidates.filter(function(x){return p.cast.indexOf(x.id)<0;}).forEach(function(x){a.push(o(x.id,x.name,actorText(l,x)));});
    if(s==='script')a=[o('workshop','Đọc bàn, sửa động cơ nhân vật','Tăng chất lượng, tăng sự phối hợp'),o('improv','Cho diễn viên ứng tác có kiểm soát','Hợp phim hài / tình cảm hơn'),o('rush','Giữ bản đầu, dành thời gian cho hình ảnh','Tiết kiệm thời gian nhưng kịch bản có thể yếu')];
    if(s==='board')a=p.board.options.map(function(x,i){return o('b'+i,x);});
    if(s==='prep')a=[o('safe','Khảo sát bối cảnh, tập trước, phương án an toàn','Hoạt hình: animatic, thử rig và lịch render; người đóng: tập diễn / điều phối trường quay'),o('visual','Ưu tiên thiết kế hình ảnh và kỹ xảo','Hợp hoạt hình / kỳ ảo / khoa học viễn tưởng'),o('rush','Rút ngắn tiền kỳ để bắt đầu sớm')];
    if(s==='shoot1')a=[o('coach','Hướng dẫn tâm lý, cho diễn viên tập thử'),o('technical','Chốt nhịp chuyển động / máy quay trước','Hợp hoạt hình hoặc phim hành động'),o('many','Lặp nhiều lần đến khi đạt','Có thể mệt ê-kíp, không phát sinh khoản thu ngoài hợp đồng')];
    if(s==='shoot2')a=p.continuity.options.map(function(x,i){return o('c'+i,x);});
    if(s==='incident'){var inc=INCIDENTS[p.incident];a=[o('care',p.medium==='animation'?'Điều chỉnh lịch thu / dựng, bảo vệ ê-kíp':inc[1]),o('risk',p.medium==='animation'?'Ép ê-kíp làm xuyên đêm để kịp hạn':inc[2]),o('rewrite','Đổi cách kể để dùng cảnh / bản thu đã đạt')];}
    if(s==='edit')a=[o('story','Dựng theo mạch cảm xúc và nguyên nhân – kết quả'),o('pace','Dựng nhanh, tăng tiết tấu','Hợp hành động / kinh dị'),o('test','Chiếu thử, sửa theo phản hồi có chọn lọc')];
    if(s==='sound')a=[o('mix','Thu bổ sung, hòa âm và dùng nhạc được cấp phép'),o('minimal','Thiết kế âm thanh tối giản','Hợp chính kịch / trinh thám'),o('library','Dùng thư viện nhạc có giấy phép phù hợp')];
    if(s==='release')a=[o('target','Phát hành đúng tệp khán giả','Có kiểm tra quyền, phân loại độ tuổi và nghiệm thu trước khi công chiếu'),o('festival',p.format==='tv'?'Ra mắt với nhà đài, giao lưu khán giả':p.format==='web'?'Công chiếu trực tuyến, giao lưu ê-kíp':'Gửi liên hoan phim rồi phát hành','Ưu tiên uy tín và đánh giá, doanh thu thường chậm / thấp hơn'),o('viral','Trailer và chiến dịch truyền thông rộng','Độ phủ cao hơn, không đảm bảo phim thành công')];
    a.push(o('quit','Dừng dự án',p.funding==='self'?'Vốn đã chi không tự hoàn lại':'Không nhận cát-xê hoàn tất'));return a;
  }
  function setupGames(p,r){var boards=[['Một người nhặt được vé tàu, quyết định lên đường, rồi gặp lại người bạn cũ.','Nhặt vé → Quyết định đi → Gặp bạn',['Gặp bạn → Nhặt vé → Quyết định đi','Quyết định đi → Gặp bạn → Nhặt vé']],['Nhân vật nghe chuông, mở cửa, rồi nhận thư.','Nghe chuông → Mở cửa → Nhận thư',['Nhận thư → Nghe chuông → Mở cửa','Mở cửa → Nhận thư → Nghe chuông']],['Nhân vật thấy khói, báo động, rồi mọi người sơ tán.','Thấy khói → Báo động → Sơ tán',['Sơ tán → Báo động → Thấy khói','Báo động → Sơ tán → Thấy khói']]],b=U.pick(r,boards),ci=U.randint(r,0,2),opts=b[2].slice();opts.splice(ci,0,b[1]);p.board={text:b[0],options:opts,correct:ci};
    var cont=U.pick(r,[['Cảnh trước: cốc ở tay trái, cửa đóng, áo xanh. Cảnh nối: cốc tay phải, cửa đóng, áo xanh.','Đổi cốc về tay trái',['Đổi màu áo','Mở cửa']],['Cảnh trước: đồng hồ 8 giờ, trời sáng, nhân vật đeo kính. Cảnh nối: đồng hồ 8 giờ, trời sáng, không có kính.','Khôi phục chiếc kính',['Đổi sang trời tối','Đổi đồng hồ thành 10 giờ']],['Cảnh trước: túi trên vai phải, điện thoại màu đỏ. Cảnh nối: túi vai phải, điện thoại màu đen.','Sửa màu điện thoại về đỏ',['Đổi vai đeo túi','Đổi màu nền']]]),cc=U.randint(r,0,2),co=cont[2].slice();co.splice(cc,0,cont[1]);p.continuity={text:cont[0],options:co,correct:cc};
  }
  function description(l){var p=project(l),s=STAGES[p.stage];return 'Dự án hư cấu: '+p.name+' · Năm '+p.year+' · Chặng '+(p.stage+1)+'/'+STAGES.length+'. '+(p.format?format(p).n+' · ':'')+(p.medium?(p.medium==='animation'?'Hoạt hình':'Người đóng')+' · ':'')+(p.source?(p.source==='adapt'?'Chuyển thể có phép':p.source==='public'?'Chuyển thể phạm vi công cộng':'Kịch bản gốc')+' · ':'')+(p.genre?GENRES[p.genre]+'. ':'')+
    (s==='format'?((l.job.rank||0)<1?'Bạn đang là trợ lý đạo diễn: được hướng dẫn làm phim ngắn đầu tay; phim dài mở khi lên bậc đạo diễn.':'Bạn đã có thể dẫn dắt dự án dài. Một dự án / năm.'):
    s==='fund'?'Các con số ngân sách / cát-xê là cân bằng game, không phải báo giá ngành phim. Chọn ai chịu vốn; không thu thêm lẻ tẻ về sau.':
    s==='cast1'||s==='cast2'?'Chọn '+role(l)+' cho '+(s==='cast1'?'vai chính':'vai đối trọng')+'. Vai nhân vật đều là người trưởng thành. Hồ sơ hư cấu, tuổi tính đúng năm hiện tại; cát-xê trong gói sản xuất, không trừ hai lần.':
    s==='board'?p.board.text+' Chọn thứ tự nguyên nhân → hành động → kết quả.':
    s==='shoot2'?p.continuity.text+' Tìm chi tiết cần sửa để nối cảnh khớp nhau.':
    s==='shoot1'?(p.medium==='animation'?'Thu thoại và diễn hoạt cảnh đầu.':'Buổi quay đầu tiên, diễn viên chưa bắt được nhịp cảm xúc.'):
    s==='incident'?(p.medium==='animation'?'Tiến độ thu thoại và render không đồng bộ, ê-kíp đề nghị sắp xếp lại lịch.':INCIDENTS[p.incident][0]):
    s==='release'?'Bản phim đã hoàn tất. Chọn cách đưa phim đến khán giả; chất lượng, diễn viên, thể loại, truyền thông và may mắn cùng ảnh hưởng kết quả.':
    s==='sound'?'Phải xác nhận quyền âm nhạc; mọi lựa chọn dưới đây đều dùng nhạc được phép.':
    s==='prep'?'Chốt lịch trong năm, phương án dự phòng và ê-kíp phù hợp với hình thức phim.':
    s==='script'?'Bản kịch bản cần thống nhất trước ngày sản xuất.':
    s==='edit'?'Dựng hình, kiểm tra nhịp kể và phản hồi buổi chiếu thử.':'Mỗi lựa chọn định hình tác phẩm.');}
  function release(l,r,log,k){var p=project(l),q=U.clamp(p.quality+(r()-.5)*16,0,100),response=U.clamp(q*.65+p.trust*.2+r()*25,0,100),f=format(p),factor=k==='festival'?.75:k==='viral'?1.15:1,reach=Math.round(f.reach*(.25+response/50)*factor),payout;
    p.score=Math.round(q);p.audience=reach;p.reception=response>=75?'được đón nhận nồng nhiệt':response>=50?'phản hồi khá, còn ý kiến trái chiều':'phản hồi yếu';p.status='released';p.done=true;
    // Doanh thu ròng của dự án không phải doanh thu bán vé gộp; hãng sở hữu vốn.
    p.netReceipts=p.budget*U.clamp((response-20)/45+(r()-.5)*.6,.1,2.6)*(k==='festival'?.75:1);
    payout=p.funding==='self'?p.netReceipts:p.fee;
    p.paid=true;p.payout=payout;if(payout>0)H.cash(l,payout,p.funding==='self'?'Thu hồi ròng phim '+p.name:'Cát-xê đạo diễn phim '+p.name);
    p.profit=p.funding==='self'?payout-p.budget:payout;
    var followers=Math.round(reach*(.015+response/2000));l.fame=(l.fame||0)+followers;if(l.job)l.job.rep=U.clamp((l.job.rep||50)+(q>=65?5:-3),0,100);
    log('Phát hành '+p.name+' ('+f.n+', '+GENRES[p.genre]+'): chất lượng '+p.score+'/100, '+p.reception+', khoảng '+reach.toLocaleString('vi-VN')+' lượt khán giả mô phỏng. '+(p.funding==='self'?'Vốn tự góp '+H.money(l,p.budget)+', thu hồi ròng '+H.money(l,payout)+', '+(p.profit>=0?'lãi ':'lỗ ')+H.money(l,Math.abs(p.profit))+'.':'Hãng thu doanh thu; bạn nhận cát-xê '+H.money(l,payout)+'.')+' Thêm '+followers.toLocaleString('vi-VN')+' người quan tâm. Không tự thăng chức sau một phim.',q>=65?'big':'neutral');
    H.mem(l,'Phát hành bộ phim '+p.name+' do mình đạo diễn, được khán giả đón xem.',4);
  }
  function play(l,d,k,r,log){if(!valid(l,d))return;var p=project(l),os=choices(l);if(!os.some(function(x){return x.k===k;}))return;if(k==='quit'){cancel(l,log);return;}var s=STAGES[p.stage],delta=0;
    if(s==='format')p.format=k;
    else if(s==='medium')p.medium=k;
    else if(s==='source')p.source=k;
    else if(s==='genre')p.genre=k;
    else if(s==='fund'){p.budget=value(l,format(p).budget)*(p.medium==='animation'?1.2:1);p.fee=value(l,format(p).fee);p.funding=k;p.status='production';if(k==='self')H.cash(l,-p.budget,'Vốn tự đầu tư phim '+p.name);log((k==='self'?'Bạn tự góp ':'Hãng chi trả ')+H.money(l,p.budget)+' ngân sách trọn gói; gồm bản quyền, tuyển vai, ê-kíp, hậu kỳ và quảng bá.','neutral');casting(l,r);setupGames(p,r);}
    else if(s==='cast1'||s==='cast2'){var a=p.candidates.filter(function(x){return x.id===k;})[0];p.cast.push(k);delta=((p.medium==='animation'?a.voice:a.acting)-50)/8+(a.genre===p.genre?3:0);p.trust+=(a.reliable-60)/10;log('Ký '+role(l)+' '+a.name+' ('+(year(l)-a.born)+' tuổi, quê '+a.home+') cho '+(s==='cast1'?'vai chính':'vai đối trọng')+'. Cát-xê nằm trong ngân sách.','good');}
    else if(s==='board'||s==='shoot2'){var game=s==='board'?p.board:p.continuity,correct=Number(k.slice(1))===game.correct;delta=correct?7:-3;p[s==='board'?'boardWon':'continuityWon']=correct;log((correct?'Chính xác! ':'Chưa đúng. ')+(s==='board'?'Thứ tự phù hợp: ':'Chi tiết cần sửa: ')+game.options[game.correct]+'.',correct?'good':'neutral');}
    else if(s==='script')delta=k==='workshop'?5:k==='improv'?(/comedy|romance/.test(p.genre)?6:2):-2;
    else if(s==='prep')delta=k==='safe'?5:k==='visual'?(p.medium==='animation'||/fantasy|scifi/.test(p.genre)?7:3):-3;
    else if(s==='shoot1'){delta=k==='coach'?5:k==='technical'?(p.medium==='animation'||p.genre==='action'?6:2):1;if(k==='many')p.trust-=6;}
    else if(s==='incident'){delta=k==='care'?4:k==='rewrite'?2:-6;p.trust+=k==='risk'?-12:5;}
    else if(s==='edit')delta=k==='test'?6:k==='pace'?(/action|horror/.test(p.genre)?6:1):5;
    else if(s==='sound')delta=k==='mix'?5:k==='minimal'?(/drama|mystery/.test(p.genre)?6:2):3;
    if(/^(script|prep|shoot1|incident|edit|sound)$/.test(s)){var chosen=os.filter(function(x){return x.k===k;})[0];log(p.name+' · '+TITLES[p.stage]+': '+chosen.l+'. '+(delta>=4?'Ê-kíp có thêm một phần phim đạt yêu cầu.':delta<0?'Lựa chọn làm chất lượng hoặc tinh thần ê-kíp giảm.':'Kết quả vừa phải, còn điểm cần cải thiện.'),delta<0?'neutral':'good');}
    p.quality=U.clamp(p.quality+delta,0,100);p.trust=U.clamp(p.trust,0,100);p.history.push({stage:s,choice:k,delta:delta});
    if(s==='release'){release(l,r,log,k);return;}p.stage++;queue(l,r,log);
  }
  E.DEC.film_step={make:function(l){var p=project(l);return{id:'film_step',title:TITLES[p.stage],text:description(l),opts:choices(l),data:{token:p.token,stage:p.stage},major:true};},valid:valid,auto:function(l,d,r){var os=d.opts.filter(function(x){return x.k!=='quit';});return U.pick(r,os.length?os:d.opts).k;},apply:function(l,d,k,r,log){play(l,d.data,k,r,log);}};
  E.SC('film_menu',{title:'Xưởng phim của bạn',prep:context,valid:function(l,d){return free(l)&&director(l)&&(!d||!d.year||same(l,d));},text:function(l){var p=project(l);return 'Đạo diễn bắt đầu từ trợ lý, không nhận phim dài ngay bậc đầu. Mỗi năm làm một dự án. Không nhận đồng thời lịch show. '+(p?'Dự án gần nhất: '+p.name+' · '+(p.done?(p.status==='released'?'đã phát hành · '+p.score+'/100':'đã dừng'):'đang làm · '+TITLES[p.stage])+'. ':'')+'Chọn dự án và diễn viên, giải storyboard / lỗi nối cảnh, sản xuất, hậu kỳ rồi phát hành.';},opts:[
    {k:'new',l:'Khởi tạo dự án phim trong năm',req:canStart,run:start},
    {k:'resume',l:'Tiếp tục dự án đang làm',req:function(l){return valid(l);},run:queue},
    {k:'stop',l:'Dừng dự án hiện tại',req:busy,run:function(l,r,log){cancel(l,log);}},
    {k:'no',l:'Đóng xưởng phim',run:function(){}}
  ]});
  var ma=E.DEC.film_menu.apply;E.DEC.film_menu.apply=function(l,d){if(!E.DEC.film_menu.valid(l,d.data))return;return ma.apply(this,arguments);};
  E.ACT.push({id:'film_menu',g:'Công việc',l:'Đạo diễn: dự án phim / tuyển diễn viên',min:18,sc:'film_menu',avail:function(l){return free(l)&&director(l)?true:'Cần tốt nghiệp đại học phù hợp, đang làm nghề đạo diễn / trợ lý đạo diễn và được tự do';},ai:{w:.3}});
  E.TRIG.push({id:'film_menu',when:canStart,p:.65,cd:1,rep:true});
  // Chặn lịch show chồng với dự án phim, cả ở nút và lúc áp lựa chọn.
  ['gameshow','vr_vai_tro','tv_moi'].forEach(function(id){var D=E.DEC[id];if(!D)return;var v=D.valid,a=D.apply;D.valid=function(l){return !busy(l)&&v.apply(this,arguments);};D.apply=function(l){if(busy(l))return;return a.apply(this,arguments);};});
  E.ACT.filter(function(a){return a.id==='gameshow_moi';}).forEach(function(a){var av=a.avail;a.avail=function(l){return busy(l)?'Đang có lịch sản xuất phim':av(l);};});
  ['jail','kill'].forEach(function(key){var fn=H[key];H[key]=function(l){var log=arguments[key==='jail'?3:2];if(busy(l)&&typeof log==='function')cancel(l,log,key==='jail'?'phải chấp hành án':'hành trình cuộc đời kết thúc');return fn.apply(this,arguments);};});
  function filmYear(l,r,log){if(busy(l)&&!valid(l))cancel(l,log,'dự án quá năm hoặc điều kiện sản xuất đã thay đổi');}
  E.HOOKS.year.push(filmYear);
  var profile=E.profile;E.profile=function(l){var P=profile.apply(this,arguments),p=project(l);if(p&&P.jobInfo)P.jobInfo.push('Phim '+p.name+': '+(p.done?(p.status==='released'?'đã phát hành, '+p.score+'/100':'đã dừng'):TITLES[p.stage]));return P;};
  E.FILM={formats:FORMATS,genres:GENRES,stages:STAGES,incidents:INCIDENTS,project:project,canStart:canStart,valid:valid,start:start,choices:choices,cancel:cancel,actorText:actorText,busy:busy,year:filmYear};
})(G);
