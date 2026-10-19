/* v4.6.4 — quê hương theo 63 tỉnh/thành trước sáp nhập, du lịch cùng người yêu/bạn đời.
   Địa danh và đặc sản là gợi ý văn hóa; ngân sách chuyến đi là cân bằng game.
   Nguồn đối chiếu và quy ước: docs/heritage-sources.md. */
(function(G){
  'use strict';
  var E=G.E,H=E.H,U=G.U,VN=G.VN;
  var ROWS=[
    ['Hà Nội','hồ Hoàn Kiếm','Văn Miếu – Quốc Tử Giám','phở Hà Nội','bún chả'],
    ['Hà Giang','cao nguyên đá Đồng Văn','cột cờ Lũng Cú','cháo ấu tẩu','bánh tam giác mạch'],
    ['Cao Bằng','thác Bản Giốc','khu di tích Pác Bó','bánh cuốn Cao Bằng','hạt dẻ Trùng Khánh'],
    ['Bắc Kạn','hồ Ba Bể','động Hua Mạ','miến dong Na Rì','gạo nếp Khẩu Nua Lếch'],
    ['Tuyên Quang','khu di tích Tân Trào','hồ Na Hang','cam sành Hàm Yên','bánh gai Chiêm Hóa'],
    ['Lào Cai','Sa Pa','chợ Bắc Hà','thắng cố','cơm lam'],
    ['Điện Biên','di tích chiến trường Điện Biên Phủ','hồ Pá Khoang','xôi nếp nương','pa pỉnh tộp'],
    ['Lai Châu','bản Sì Thâu Chải','cao nguyên Sìn Hồ','xôi tím','lợn bản nướng'],
    ['Sơn La','cao nguyên Mộc Châu','di tích Nhà tù Sơn La','bê chao Mộc Châu','sữa Mộc Châu'],
    ['Yên Bái','ruộng bậc thang Mù Cang Chải','hồ Thác Bà','xôi Tú Lệ','cốm Tú Lệ'],
    ['Hòa Bình','thung lũng Mai Châu','hồ Hòa Bình','cơm lam','cá sông Đà'],
    ['Thái Nguyên','hồ Núi Cốc','ATK Định Hóa','chè Tân Cương','bánh chưng Bờ Đậu'],
    ['Lạng Sơn','động Tam Thanh','Mẫu Sơn','vịt quay Lạng Sơn','phở chua'],
    ['Quảng Ninh','vịnh Hạ Long','Yên Tử','chả mực Hạ Long','bún bề bề'],
    ['Bắc Giang','Tây Yên Tử','chùa Vĩnh Nghiêm','vải thiều Lục Ngạn','mỳ Chũ'],
    ['Phú Thọ','khu di tích Đền Hùng','Vườn quốc gia Xuân Sơn','thịt chua Thanh Sơn','bánh tai'],
    ['Vĩnh Phúc','Tam Đảo','hồ Đại Lải','ngọn su su Tam Đảo','bánh trùng Vĩnh Tường'],
    ['Bắc Ninh','chùa Dâu','đền Đô','bánh phu thê Đình Bảng','bánh tẻ làng Chờ'],
    ['Hải Dương','Côn Sơn – Kiếp Bạc','đảo cò Chi Lăng Nam','bánh đậu xanh','bánh gai Ninh Giang'],
    ['Hải Phòng','đảo Cát Bà','Đồ Sơn','bánh đa cua','bánh mì cay'],
    ['Hưng Yên','Phố Hiến','đền Chử Đồng Tử','nhãn lồng Hưng Yên','bún thang lươn Phố Hiến'],
    ['Thái Bình','chùa Keo','Cồn Đen','canh cá Quỳnh Côi','bánh cáy làng Nguyễn'],
    ['Hà Nam','khu du lịch Tam Chúc','nhà Bá Kiến ở làng Đại Hoàng','chuối ngự Đại Hoàng','cá kho làng Vũ Đại'],
    ['Nam Định','đền Trần','Vườn quốc gia Xuân Thủy','phở bò Nam Định','bánh nhãn Hải Hậu'],
    ['Ninh Bình','quần thể Tràng An','Tam Cốc – Bích Động','cơm cháy Ninh Bình','thịt dê núi'],
    ['Thanh Hóa','biển Sầm Sơn','Pù Luông','nem chua Thanh Hóa','chả tôm'],
    ['Nghệ An','khu di tích Kim Liên','Vườn quốc gia Pù Mát','cháo lươn','bánh mướt'],
    ['Hà Tĩnh','Ngã ba Đồng Lộc','chùa Hương Tích','kẹo cu đơ','bưởi Phúc Trạch'],
    ['Quảng Bình','Phong Nha – Kẻ Bàng','biển Nhật Lệ','cháo canh','bánh lọc Quảng Bình'],
    ['Quảng Trị','đôi bờ Hiền Lương – Bến Hải','Thành cổ Quảng Trị','bún hến Mai Xá','cháo vạt giường'],
    ['Thừa Thiên Huế','Đại Nội Huế','chùa Thiên Mụ','bún bò Huế','cơm hến'],
    ['Đà Nẵng','biển Mỹ Khê','Ngũ Hành Sơn','mì Quảng','bánh tráng cuốn thịt heo'],
    ['Quảng Nam','phố cổ Hội An','thánh địa Mỹ Sơn','cao lầu Hội An','mì Quảng'],
    ['Quảng Ngãi','đảo Lý Sơn','khu chứng tích Sơn Mỹ','don','kẹo gương'],
    ['Bình Định','tháp Đôi Quy Nhơn','Kỳ Co','bánh ít lá gai','bánh hỏi lòng heo'],
    ['Phú Yên','Gành Đá Đĩa','Mũi Điện','bánh canh hẹ','cá ngừ đại dương'],
    ['Khánh Hòa','Tháp Bà Ponagar','vịnh Nha Trang','bún cá sứa','nem nướng Ninh Hòa'],
    ['Ninh Thuận','tháp Po Klong Garai','vịnh Vĩnh Hy','nho Phan Rang','bánh căn'],
    ['Bình Thuận','Mũi Né','Bàu Trắng','bánh canh chả cá','bánh quai vạc'],
    ['Kon Tum','Nhà thờ gỗ Kon Tum','Măng Đen','gỏi lá Kon Tum','cơm lam'],
    ['Gia Lai','Biển Hồ','núi lửa Chư Đăng Ya','phở khô Gia Lai','bún mắm cua'],
    ['Đắk Lắk','Buôn Đôn','thác Dray Nur','cà phê Buôn Ma Thuột','cơm lam'],
    ['Đắk Nông','hồ Tà Đùng','thác Đray Sáp','canh thụt','gà xào măng chua'],
    ['Lâm Đồng','hồ Xuân Hương','Vườn quốc gia Bidoup – Núi Bà','bánh căn Đà Lạt','hồng treo gió'],
    ['Bình Phước','Vườn quốc gia Bù Gia Mập','Sóc Bom Bo','hạt điều Bình Phước','cơm lam'],
    ['Tây Ninh','núi Bà Đen','Tòa Thánh Tây Ninh','bánh tráng phơi sương Trảng Bàng','muối tôm'],
    ['Bình Dương','vườn cây Lái Thiêu','chùa Bà Thiên Hậu','gỏi gà măng cụt','bánh bèo bì'],
    ['Đồng Nai','Vườn quốc gia Cát Tiên','khu du lịch Bửu Long','gỏi cá Biên Hòa','bưởi Tân Triều'],
    ['Bà Rịa – Vũng Tàu','Côn Đảo','biển Vũng Tàu','bánh khọt','bánh canh Long Hương'],
    ['TP. Hồ Chí Minh','chợ Bến Thành','địa đạo Củ Chi','cơm tấm','bánh mì Sài Gòn'],
    ['Long An','làng nổi Tân Lập','khu bảo tồn đất ngập nước Láng Sen','gạo Nàng Thơm Chợ Đào','lạp xưởng Cần Đước'],
    ['Tiền Giang','cù lao Thới Sơn','biển Tân Thành','hủ tiếu Mỹ Tho','vú sữa Lò Rèn'],
    ['Bến Tre','Cồn Phụng','cù lao Minh','kẹo dừa','bánh tráng Mỹ Lồng'],
    ['Trà Vinh','Ao Bà Om','chùa Âng','bún nước lèo','bánh tét Trà Cuôn'],
    ['Vĩnh Long','cù lao An Bình','Văn Thánh Miếu Vĩnh Long','bưởi Năm Roi Bình Minh','khoai lang Bình Tân'],
    ['Đồng Tháp','Vườn quốc gia Tràm Chim','làng hoa Sa Đéc','nem Lai Vung','hủ tiếu Sa Đéc'],
    ['An Giang','rừng tràm Trà Sư','núi Sam','bún cá Châu Đốc','tung lò mò'],
    ['Kiên Giang','đảo Phú Quốc','Vườn quốc gia U Minh Thượng','bún kèn Hà Tiên','gỏi cá trích'],
    ['Cần Thơ','chợ nổi Cái Răng','bến Ninh Kiều','bánh cống','bánh tét lá cẩm'],
    ['Hậu Giang','Ngã Bảy','khu bảo tồn Lung Ngọc Hoàng','chả cá thác lác','khóm Cầu Đúc'],
    ['Sóc Trăng','chùa Dơi','chùa Chén Kiểu','bánh pía','bún nước lèo'],
    ['Bạc Liêu','khu lưu niệm nghệ thuật đờn ca tài tử và nhạc sĩ Cao Văn Lầu','cánh đồng điện gió Bạc Liêu','bánh tằm Ngan Dừa','bún bò cay'],
    ['Cà Mau','Mũi Cà Mau','Vườn quốc gia U Minh Hạ','cua Năm Căn','ba khía Rạch Gốc']
  ];
  var DATA=Object.create(null);ROWS.forEach(function(x){DATA[x[0]]={name:x[0],places:[x[1],x[2]],foods:[x[3],x[4]],region:VN.byName[x[0]].region};});
  function profile(name){return DATA[name==='Huế'?'Thừa Thiên Huế':name]||null;}
  function own(l){return l.country==='VN'&&l.prov?profile(l.prov.old):null;}
  function hash(s){var h=2166136261;for(var i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h|0;}
  function ensure(l,p,country){
    if(!p)return null;l.flags=l.flags||{};
    if(!p.heritageId)p.heritageId=String(l.id||l.seed||'life')+':partner:'+(l.flags.heritageSerial=(l.flags.heritageSerial||0)+1);
    if(!p.homeCountry)p.homeCountry=country||p.country||l.country;
    if(p.homeCountry==='VN'&&!profile(p.home63)){var holder={rs:hash(p.heritageId+':'+p.name)},r=function(){return U.rand(holder);};p.home63=U.wpick(r,VN.P63,function(x){return x.pop;}).name;}
    return p.homeCountry==='VN'?profile(p.home63):null;
  }
  // v5.8.0: chơi 34 tỉnh/thành thì gọi quê theo tên sau sáp nhập; chơi 63 tỉnh/thành thì giữ tên cũ — không ghi chú thêm
  function pname(l,n){if(l.variant!=='34')return n;var p=VN.byName&&VN.byName[n];return p&&p.newName||n;}
  function current(l){
    var code=l.abroad&&l.abroad.code||l.country;if(code!=='VN')return{code:code,province:null};
    var city=l.cityStudent&&l.cityStudent.city||l.movedTo;
    if(!city)return{code:'VN',province:own(l)&&own(l).name};
    var found=VN.P63.filter(function(p){return p.name===city||p.city===city;})[0];return{code:'VN',province:found?found.name:null};
  }
  function locationKey(l){var c=current(l);return[c.code,c.province,l.cur,l.movedTo||'',l.cityStudent&&l.cityStudent.city||''].join('|');}
  function free(l){return l.alive&&l.age>=18&&!(l.jailUntil!=null&&l.age<l.jailUntil)&&!(l.flags.military&&l.age<l.flags.military)&&!(l.abroad&&l.abroad.trapped);}
  function couple(l){var p=l.partner;return free(l)&&p&&p.alive!==false&&p.age>=18?ensure(l,p)||true:false;}
  function target(l,side){return side==='mine'?own(l):side==='theirs'?ensure(l,l.partner):null;}
  function ledger(l){return l.flags.heritageTravel||(l.flags.heritageTravel={seen:{},visits:[]});}
  function slot(l,side){var s=ledger(l);return(s.at!==l.age||s.count<2)&&s.seen[l.partner.heritageId+':'+side]!==l.age;}
  function eligible(l,side){return !!(couple(l)&&target(l,side)&&slot(l,side));}
  function baseValid(l,d){return !!(d&&eligible(l,d.side)&&l.partner.heritageId===d.pid&&l.age===d.at&&target(l,d.side).name===d.province&&locationKey(l)===d.location);}
  function context(l,side){if(!eligible(l,side))return{};return{side:side,pid:l.partner.heritageId,n:l.partner.name,province:target(l,side).name,at:l.age,location:locationKey(l)};}
  function unit(l,v){return l.cur==='vnd'?v:v*1e6/(G.CUR.VND*G.CUR.priceLevel(l.gdp||14.3));}
  function transport(l,name){
    var c=current(l),p=profile(name),from=profile(c.province);
    if(c.code!=='VN')return{v:/^(CN|LA|KH|TH|SG|MY|JP|KR|TW|PH|ID)$/.test(c.code)?18:40,text:'vé khứ hồi về Việt Nam cho hai người'};
    if(c.province===name)return{v:.06,text:'đi lại tại địa phương cho hai người'}; // v5.6.1: đi lại trong tỉnh chỉ vài chục nghìn
    if(from&&from.region===p.region)return{v:1.2,text:'đi lại khứ hồi liên tỉnh cho hai người'};
    return{v:4,text:'đi lại khứ hồi đường dài cho hai người'};
  }
  var PLANS=[{id:'place0',i:0,extra:.7},{id:'place1',i:1,extra:.7},{id:'food',extra:.5},{id:'both',extra:1.6}];
  function plan(id){return PLANS.filter(function(p){return p.id===id;})[0];}
  function quote(l,d){if(!d||!profile(d.province))return 0;var t=transport(l,d.province),p=plan(d.plan);return p?Math.round(unit(l,t.v+p.extra)*10000)/10000:0;}
  function partnerRemaining(l){var p=l.partner,b=p.heritageSpending,a=p.leisureSpending;return Math.max(0,(isFinite(p.inc)&&p.inc>0?p.inc*12*.1:0)-(b&&b.at===l.age&&b.cur===l.cur?b.spent:0)-(a&&a.at===l.age&&a.cur===l.cur?a.spent:0));}
  function invoiceValid(l,d){var q=l.flags.heritageQuote;return baseValid(l,d)&&!!plan(d.plan)&&!!q&&q.token===d.token&&q.pid===d.pid&&q.plan===d.plan&&q.province===d.province&&q.side===d.side;}
  function portion(d,k){return k==='self'?1:k==='split'?.5:0;}
  function canPay(l,d,k){if(!invoiceValid(l,d))return false;var c=quote(l,d),share=portion(d,k);return l.money+1e-8>=c*share&&partnerRemaining(l)+1e-8>=c*(1-share);}
  function meal(l,p){
    var allergy=[l.allergy,l.partner&&l.partner.allergy].filter(function(a){return a&&!/phấn hoa|penicillin|bụi nhà/.test(a);});
    if(allergy.length)return 'món địa phương đã kiểm tra thành phần và tránh '+allergy.join(', ');
    if(l.flags.vegetarian||l.partner&&l.partner.vegetarian)return 'món chay địa phương phù hợp chế độ ăn của hai người';
    if(/Hồi giáo|Hindu|Ấn Độ giáo/.test((l.religion||'')+' '+(l.partner&&l.partner.religion||'')))return 'món địa phương phù hợp kiêng kỵ tôn giáo, trao đổi nguyên liệu trước khi gọi';
    return p.foods.join(' và ');
  }
  function pay(l,d,k,log){
    if(!canPay(l,d,k))return;var cost=quote(l,d),self=cost*portion(d,k),other=cost-self,p=l.partner,info=profile(d.province),tour=plan(d.plan),s=ledger(l);
    if(self>0)H.cash(l,-self,'Khám phá '+info.name+' cùng '+p.name);
    if(other>0){if(!p.heritageSpending||p.heritageSpending.at!==l.age||p.heritageSpending.cur!==l.cur)p.heritageSpending={at:l.age,cur:l.cur,spent:0};p.heritageSpending.spent+=other;}
    if(s.at!==l.age){s.at=l.age;s.count=0;}s.count++;s.seen[p.heritageId+':'+d.side]=l.age;
    var places=tour.id==='both'?info.places.join(' và '):tour.id==='food'?'khu ẩm thực địa phương':info.places[tour.i];
    var story=(d.side==='mine'?'Bạn dẫn '+p.name+' khám phá quê mình':'Theo lời mời của '+p.name+', hai người khám phá quê người ấy')+' ở '+pname(l,info.name)+': ghé '+places+'.';
    if(tour.id==='food'||tour.id==='both')story+=' Hai người chọn '+meal(l,info)+', cùng tìm hiểu câu chuyện món ăn.';
    else story+=' Hai người nghe kể về địa danh và chụp vài tấm ảnh làm kỷ niệm.';
    story+=' Tổng ngân sách '+H.money(l,cost)+': '+(self>0?'bạn tự trả '+H.money(l,self)+' từ tiền riêng':'bạn không phải trả tiền')+(other>0?'; '+p.name+' trả '+H.money(l,other)+' từ thu nhập riêng':'; bạn mời toàn bộ')+'. Chuyến đi kết thúc, hai người trở lại nơi đang sống.';
    log(story,'good');H.fx(l,{hap:4,soc:2,kno:1});p.close=U.clamp((p.close==null?60:p.close)+3,0,100);
    var first=!s.visits.some(function(v){return v.province===info.name;});s.visits.push({province:info.name,side:d.side,pid:p.heritageId,age:l.age,places:places,plan:d.plan,self:self,partner:other,cur:l.cur});
    if(first)H.mem(l,'Cùng '+p.name+' khám phá '+info.name+': '+places+'.',3);
    delete l.flags.heritageQuote;
  }
  E.SC('que_doc',{title:function(l,d){return 'Dấu ấn quê hương · '+(d.province||'Việt Nam');},prep:function(l,r,a){var p=profile(a&&a.province)||own(l);return{province:p?p.name:''};},valid:function(l,d){return l.alive&&!!profile(d&&d.province||own(l)&&own(l).name);},text:function(l,d){var p=profile(d.province);return p?pname(l,p.name)+'.\nĐịa danh: '+p.places.join('; ')+'.\nẨm thực và sản vật: '+p.foods.join('; ')+'.\nĐây là gợi ý tìm hiểu văn hóa địa phương; một món ăn có thể được yêu thích ở nhiều tỉnh.':'';},opts:[{k:'ok',l:'Ghi nhớ nét đẹp quê hương',run:function(){}}]});
  E.SC('que_hen_ho',{title:'Cùng nhau khám phá quê hương',valid:function(l){return eligible(l,'mine')||eligible(l,'theirs');},text:'Bạn muốn dẫn người ấy khám phá quê mình hay cùng người ấy về quê chơi? Mỗi hướng một chuyến/năm, tối đa hai chuyến trong năm.',opts:['mine','theirs'].map(function(side){return{k:side,l:function(l){var p=target(l,side);return(side==='mine'?'Mời người ấy về quê mình':'Cùng người ấy về quê')+' · '+(p?p.name:'chưa có quê ở Việt Nam');},req:function(l){return eligible(l,side);},run:function(l,r,log){l.pending.unshift(E.DEC.que_chuyen_di.make(l,r,{side:side}));}};}).concat([{k:'no',l:'Để dịp khác',run:function(){}}])});
  E.SC('que_loi_moi',{title:'Người ấy muốn dẫn bạn về quê chơi',valid:function(l,d){return baseValid(l,d&&d.pid?d:context(l,'theirs'));},prep:function(l){return context(l,'theirs');},text:function(l,d){var p=profile(d.province);return p?d.n+' ngỏ lời: “Mình cùng về '+p.name+' nhé? Ở đó có '+p.places.join(', ')+', rồi mình tìm hiểu '+p.foods.join(', ')+'. Bạn có muốn đi không?”'+(own(l)&&own(l).name===p.name?' Hai người cùng quê, có thể chọn một buổi khám phá địa phương.':''):'';},opts:[{k:'go',l:'Cùng lên lịch, xem địa điểm và ngân sách',run:function(l,r,log,d){l.pending.unshift(E.DEC.que_chuyen_di.make(l,r,{side:d.side}));}},{k:'later',l:'Hẹn dịp thuận tiện, chưa nhận lời',run:function(l,r,log,d){log('Hẹn '+d.n+' một dịp thuận tiện để cùng khám phá '+d.province+', chưa đặt chuyến hoặc chi tiền.','neutral');}}]});
  E.SC('que_chuyen_di',{title:function(l,d){return 'Lịch chơi · '+(d.province||'quê hương');},prep:function(l,r,a){var side=a&&a.side;if(side)return eligible(l,side)?context(l,side):{unavailable:true};return context(l,eligible(l,'theirs')?'theirs':'mine');},valid:function(l,d){if(d&&d.unavailable)return false;return d&&d.pid?baseValid(l,d):eligible(l,'theirs')||eligible(l,'mine');},text:function(l,d){var p=profile(d.province);if(!p)return'Chưa có điểm đến phù hợp.';var t=transport(l,p.name);return(d.side==='mine'?'Bạn sẽ giới thiệu quê mình với '+d.n:d.n+' sẽ dẫn bạn khám phá quê người ấy')+' ở '+p.name+'. Địa danh: '+p.places.join('; ')+'. Đặc sản: '+p.foods.join('; ')+'.\nNgân sách gồm '+t.text+' và chi phí trải nghiệm cho hai người. Đây là ngân sách mô phỏng; bước sau cho chọn ai thanh toán. Chuyến đi không thay đổi nơi ở hoặc quê quán.';},opts:PLANS.map(function(p){return{k:p.id,l:function(l,d){var x=profile(d.province);return!x?'Chọn trải nghiệm':p.id==='both'?'Tham quan và tìm hiểu ẩm thực':p.id==='food'?'Khám phá ẩm thực địa phương':'Tham quan '+x.places[p.i];},h:function(l,d){var a=Object.assign({},d,{plan:p.id});return'Dự kiến cho hai người: '+H.money(l,quote(l,a));},run:function(l,r,log,d){if(!baseValid(l,d))return;var a=Object.assign({},d,{plan:p.id,token:l.flags.heritageQuoteSerial=(l.flags.heritageQuoteSerial||0)+1});l.flags.heritageQuote=a;l.pending.unshift(E.DEC.que_thanh_toan.make(l,r,a));}};}).concat([{k:'no',l:'Chưa sắp xếp được chuyến đi',run:function(){}}])});
  E.SC('que_thanh_toan',{title:'Thống nhất chi phí chuyến đi',prep:function(l,r,a){return a||l.flags.heritageQuote||{};},valid:function(l,d){return invoiceValid(l,d||l.flags.heritageQuote);},text:function(l,d){if(!invoiceValid(l,d))return'Kế hoạch này không còn phù hợp.';return'Chuyến khám phá '+d.province+' cùng '+d.n+' cần '+H.money(l,quote(l,d))+' cho cả hai người. Chỉ chi khi bạn xác nhận. Phần người ấy trả phải nằm trong ngân sách riêng còn lại từ thu nhập, không tự tạo thêm tiền.';},opts:['self','split','partner'].map(function(k){return{k:k,l:function(l,d){var cost=invoiceValid(l,d)?quote(l,d):0;return k==='self'?'Mình mời · tự trả '+H.money(l,cost):k==='split'?'Chia đôi · mình trả '+H.money(l,cost/2):'Người ấy mời · mình không trả tiền';},req:function(l,d){return canPay(l,d,k);},ai:{w:k==='split'?1.2:.7},run:function(l,r,log,d){pay(l,d,k,log);}};}).concat([{k:'no',l:'Hoãn lại, chưa chi tiền',run:function(l,r,log,d){if(invoiceValid(l,d))delete l.flags.heritageQuote;}}])});
  ['que_chuyen_di','que_loi_moi','que_thanh_toan'].forEach(function(id){var D=E.DEC[id],ap=D.apply;D.apply=function(l,d){if(!D.valid(l,d.data))return;return ap.apply(this,arguments);};});
  E.ACT.push({id:'que_doc',g:'Gia đình & bạn bè',l:'Địa danh / đặc sản quê mình',min:6,sc:'que_doc',avail:function(l){return own(l)?true:'Chưa có nơi sinh thuộc 63 tỉnh/thành Việt Nam';},ai:{w:0}});
  E.ACT.push({id:'que_hen_ho',g:'Tình cảm',l:'Mời nhau về quê chơi / ăn đặc sản',min:18,sc:'que_hen_ho',avail:function(l){return eligible(l,'mine')||eligible(l,'theirs')?true:'Cần người yêu / bạn đời đủ 18 tuổi, còn sống và lịch đi quê phù hợp';},ai:{w:.15}});
  E.TRIG.push({id:'que_loi_moi',when:function(l){return eligible(l,'theirs');},p:.22,cd:3,rep:true});
  var love=E.DEC.love,mk=love.make,ap=love.apply;
  love.make=function(l,r,a){var d=mk.call(this,l,r,a),p=d.data.p,home=ensure(l,p,current(l).code);if(home)d.text+=' Quê của người ấy ở '+pname(l,home.name)+'.';return d;};
  love.apply=function(l,d){var result=ap.apply(this,arguments),p=d.data.p;if(l.partner&&l.partner.name===p.name){['home63','homeCountry','heritageId'].forEach(function(k){if(p[k]!=null)l.partner[k]=p[k];});ensure(l,l.partner);}return result;};
  var sponsor=E.DEC.sn_loi_moi;if(sponsor){var sm=sponsor.make,sa=sponsor.apply;
    sponsor.make=function(l,r,a){var d=sm.call(this,l,r,a);ensure(l,d.data.p,l.partner&&l.partner.homeCountry||current(l).code);return d;};
    sponsor.apply=function(l,d){var result=sa.apply(this,arguments);if(l.partner&&l.partner.name===d.data.p.name){['home63','homeCountry','heritageId'].forEach(function(k){if(d.data.p[k]!=null)l.partner[k]=d.data.p[k];});}return result;};
  }
  var migrate=E.migrateExt;E.migrateExt=function(l){if(migrate)migrate(l);ensure(l,l.partner);(l.pending||[]).forEach(function(d){if(d.id==='love'&&d.data&&d.data.p)ensure(l,d.data.p);});};
  E.HOMETOWN={data:DATA,profile:profile,own:own,partner:ensure,eligible:eligible,context:context,quote:quote,transport:transport,meal:meal,remaining:partnerRemaining};
})(G);
