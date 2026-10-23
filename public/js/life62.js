/* V5.0 — chuyến đi có đặt gói, chọn địa danh / ẩm thực / hoạt động và chuyện dọc đường. */
(function(G){
  'use strict';
  var E=G.E,H=E.H,U=G.U,DATA=G.TRAVEL50_DATA,B=E.LEISURE_BILL;
  var REGIONS={asia:'Châu Á',europe:'Châu Âu',americas:'Châu Mỹ',africa:'Châu Phi',oceania:'Châu Đại Dương'};
  var INCIDENTS=[['Mưa đến đúng buổi tham quan.','Đổi sang bảo tàng / hoạt động trong nhà','Giữ lịch ngoài trời nếu thời tiết cho phép'],['Chuyến tàu / xe nội địa đổi giờ.','Nhờ đơn vị tổ chức đổi lịch trong gói','Bỏ một điểm, dành thời gian nghỉ'],['Một điểm đến đông hơn dự kiến.','Đi vào khung giờ khác và tôn trọng hàng chờ','Khám phá khu phố gần đó thay thế'],['Cách gọi món khác với điều bạn hình dung.','Hỏi nguyên liệu và đổi món phù hợp','Chọn món quen, vẫn thử món mới ở bữa sau'],['Bạn mệt sau những ngày đi liên tục.','Dành nửa ngày nghỉ, chọn tuyến nhẹ','Rút gọn hành trình, ưu tiên điểm yêu thích'],['Bạn được giới thiệu một làng nghề ít xuất hiện trên ảnh quảng cáo.','Tham quan cùng hướng dẫn viên và hỏi về nghề','Giữ lịch chính, tìm hiểu qua bảo tàng']];
  function current(l){return l.abroad&&l.abroad.code||l.country;}
  function pid(l){if(!l.partner)return'';if(E.HOMETOWN)E.HOMETOWN.partner(l,l.partner);return l.partner.heritageId||[l.partner.name,l.partner.since,l.partner.age].join(':');}
  function couple(l){return !!(l.partner&&l.partner.alive!==false&&l.age>=18&&l.partner.age>=18);}
  function free(l){var f=l.flags;return l.alive&&l.age>=16&&!(l.jailUntil!=null&&l.age<l.jailUntil)&&!(f.military&&l.age<f.military)&&!(l.abroad&&l.abroad.trapped)&&!(E.FILM&&E.FILM.busy(l))&&!(f.variety&&!f.variety.done)&&!(f.tv&&!f.tv.done&&!f.tv.out&&!f.tv.no);}
  function ledger(l){var s=l.flags.travel50||(l.flags.travel50={serial:0,at:l.age,count:0,seen:{},history:[]});if(s.at!==l.age){s.at=l.age;s.count=0;}return s;}
  function state(l){return l.flags.trip50;}
  function fresh(l){return free(l)&&ledger(l).count<3;}
  function valid(l,d){var s=state(l);if(!free(l))return false;if(!d||d.token==null)return fresh(l);return !!s&&!s.done&&d.token===s.token&&d.stage===s.stage&&s.age===l.age&&s.source===current(l)&&s.cur===l.cur&&(s.paid||s.factor===E.lifestyleFactor(l))&&(!s.withPartner||couple(l)&&s.pid===pid(l));}
  function option(k,n,h){return{k:k,l:n,h:h||''};}
  function dest(l){var s=state(l);return s.local||DATA.filter(function(p){return p.code===s.code;})[0];}
  function unit(l,n){return E.LIFESTYLE.unit(l,n);}
  function quote(l,s){s=s||state(l);var p=s.local||DATA.filter(function(p){return p.code===s.code;})[0];if(!p)return null;
    // Vé và giấy tờ giữ nguyên; phần lưu trú / ăn / trải nghiệm tăng theo mức dịch vụ.
    var flight=p.region==='domestic'?p.base*.3:p.region==='asia'?p.base*.42:p.base*.5,visa=p.region==='domestic'?0:p.base*.06,land=p.base-flight-visa;
    var per=flight+visa+land*s.factor;if(p.region==='asia')per=Math.min(50,per);var ratio=land>0?(per-flight-visa)/land:1,people=s.withPartner?2:1;
    return{flight:unit(l,flight)*people,visa:unit(l,visa)*people,stay:unit(l,land*.5*ratio)*people,food:unit(l,land*.25*ratio)*people,activities:unit(l,land*.25*ratio)*people,per:unit(l,per),vndPer:per,people:people,total:unit(l,per)*people,days:p.days};
  }
  function snapshot(l){var s=state(l);return{token:s.token,stage:s.stage};}
  function queue(l){if(valid(l,snapshot(l)))l.pending.unshift(E.DEC.travel50_step.make(l));}
  function init(l,r){if(!fresh(l))return null;var s=state(l);if(s&&!s.done&&s.age===l.age&&s.source===current(l)&&s.cur===l.cur&&(s.paid||s.factor===E.lifestyleFactor(l))&&(!s.withPartner||couple(l)&&s.pid===pid(l)))return s;
    if(s&&!s.done){s.done=true;s.interrupted=true;}var book=ledger(l);s=l.flags.trip50={token:++book.serial,age:l.age,source:current(l),cur:l.cur,factor:E.lifestyleFactor(l),stage:'root',page:0,done:false,paid:false,incident:U.randint(r,0,INCIDENTS.length-1),choices:[]};return s;
  }
  function list(l){var s=state(l);return DATA.filter(function(p){return p.region===s.region&&p.code!==s.source;});}
  function options(l){var s=state(l),a=[],p=dest(l),q=quote(l,s);
    if(s.stage==='root'){a.push(option('near','Du lịch trong nước','Chuyến ngắn khoảng 3 ngày, tự chọn mức chi tiêu'));if(l.age>=18)Object.keys(REGIONS).forEach(function(k){a.push(option(k,REGIONS[k],k==='asia'?'Gói khoảng 8–50 triệu đ/người từ Việt Nam; giá hiển thị đã theo nếp chi tiêu':'Gói đường dài đắt hơn châu Á; xem từng điểm đến để biết giá'));});}
    if(s.stage==='country'){var all=list(l);all.slice(s.page*10,s.page*10+10).forEach(function(p){var cost=quote(l,Object.assign({},s,{code:p.code,withPartner:false}));a.push(option(p.code,p.name,p.days+' ngày · '+H.money(l,cost.per)+'/người · '+p.places.join(' / ')));});if((s.page+1)*10<all.length)a.push(option('next','Xem điểm đến tiếp theo ›'));if(s.page>0)a.push(option('prev','‹ Trang trước'));a.push(option('back','Chọn châu lục khác'));}
    if(s.stage==='party'){a.push(option('solo','Đi một mình',H.money(l,q.per)+'/người'));if(couple(l))a.push(option('couple','Rủ '+l.partner.name+' cùng đi','Hai người · '+H.money(l,q.per*2)));}
    if(s.stage==='book'){['self','split','partner'].forEach(function(k){if(k!=='self'&&!s.withPartner)return;if(B.can(l,q.total,k))a.push(option(k,k==='self'?'Bạn thanh toán và đặt gói':k==='split'?'Hai người chia đôi':'Người ấy đồng ý mời cả chuyến','Bạn trả '+H.money(l,q.total*B.share(k))+(s.withPartner?' · '+l.partner.name+' trả '+H.money(l,q.total*(1-B.share(k))):'')));});}
    if(s.stage==='place')p.places.forEach(function(n,i){a.push(option('p'+i,'Khám phá '+n));});
    if(s.stage==='food'){a=[option('local','Thử đặc sản địa phương',food(l,p,s.withPartner)),option('veg','Chọn món chay địa phương, hỏi nguyên liệu'),option('familiar','Chọn món quen để hợp khẩu vị')];}
    if(s.stage==='activity')p.activities.forEach(function(n,i){a.push(option('a'+i,n));});
    if(s.stage==='incident'){var x=INCIDENTS[s.incident];a=[option('adapt',x[1]),option('rest',x[2])];}
    a.push(option('cancel',s.paid?'Kết thúc hành trình sớm':'Để dịp khác',s.paid?'Dịch vụ đã sử dụng / đặt không tự hoàn tiền':'Chưa đặt gói thì chưa thu tiền'));return a;
  }
  function food(l,p,withPartner){if(withPartner&&E.HOMETOWN)return E.HOMETOWN.meal(l,p);if(l.allergy&&!/bụi|phấn hoa|penicillin/.test(l.allergy))return'món địa phương đã kiểm tra thành phần, tránh '+l.allergy;if(l.flags.vegetarian||/Hồi giáo|Hindu|Ấn Độ giáo/.test(l.religion||''))return'món địa phương phù hợp ăn chay / kiêng kỵ, xác nhận nguyên liệu trước khi gọi';return p.foods.join(' và ');}
  function text(l){var s=state(l),p=dest(l),q=quote(l,s);if(s.stage==='root')return 'Bạn muốn đi đâu? Mỗi năm có thể sắp xếp tối đa 3 chuyến.';
    if(s.stage==='country')return 'Điểm đến '+REGIONS[s.region]+' · trang '+(s.page+1)+'. Giá gói tính cho một người.';
    return p.name+' · '+p.days+' ngày · '+(s.withPartner?'cùng '+l.partner.name:'một người')+'. '+
      (s.stage==='party'?'Bạn muốn đi một mình hay rủ người yêu / bạn đời?':s.stage==='book'?'Tổng '+H.money(l,q.total)+' cho '+q.people+' người. Gồm vé khứ hồi / di chuyển '+H.money(l,q.flight)+', giấy tờ '+H.money(l,q.visa)+', lưu trú '+H.money(l,q.stay)+', ăn uống '+H.money(l,q.food)+', vé tham quan / hoạt động '+H.money(l,q.activities)+'. Thu một lần sau khi xác nhận, không tự đổi nơi định cư / tiền tệ.':s.stage==='place'?'Bạn muốn dành thời gian khám phá địa danh nào?':s.stage==='food'?'Bữa ăn trong gói: chọn theo khẩu vị và kiêng kỵ; không ép ăn món không phù hợp.':s.stage==='activity'?'Chọn trải nghiệm trong lịch trình, ưu tiên tuyến vừa sức; đã gồm trong ngân sách.':INCIDENTS[s.incident][0]+' Đơn vị tổ chức hỗ trợ trong ngân sách đã đặt, không tự thu thêm.');}
  function finish(l,log,early){var s=state(l);if(!s||s.done)return;s.done=true;s.early=!!early;if(!s.paid)return;var p=dest(l);H.visit(l,p.name);H.fx(l,{hap:early?1:6,kno:early?0:2,soc:s.withPartner?2:0});if(s.withPartner&&l.partner&&pid(l)===s.pid)l.partner.close=U.clamp((l.partner.close||60)+(early?0:3),0,100);
    var story=(early?'Kết thúc sớm chuyến ':'Hoàn thành chuyến ')+p.name+(s.withPartner?' cùng '+l.partner.name:'')+': '+s.choices.join('; ')+'. '+(s.payer?'Bạn trả '+H.money(l,s.payer.self)+(s.payer.partner?', người ấy trả '+H.money(l,s.payer.partner):''):'')+'.';log(story,'good');H.mem(l,story,3);var book=ledger(l);book.history.push({age:l.age,code:p.code,name:p.name,total:s.quote.total,cur:s.cur,withPartner:s.withPartner,early:!!early,choices:s.choices.slice()});if(book.history.length>30)book.history.shift();}
  function apply(l,d,k,r,log){if(!d.data||d.data.token==null||!valid(l,d.data))return;var s=state(l);if(!options(l).some(function(o){return o.k===k;}))return;
    if(k==='cancel'){finish(l,log,true);return;}if(s.stage==='root'){if(k==='near'){var home=DATA.filter(function(p){return p.code===current(l);})[0],co=G.W.BY[current(l)],name=current(l)==='VN'&&E.nearTrip?E.nearTrip(l,r):home?U.pick(r,home.places):co?U.pick(r,co.cities):'khu vực gần nơi đang sống';s.local={code:'domestic',name:name,region:'domestic',base:3,days:3,places:[name,'không gian văn hóa địa phương tại '+name],foods:['món đặc sản địa phương'],activities:['thăm làng nghề phù hợp lịch trình','dạo cảnh đẹp, chụp ảnh kỷ niệm']};s.code='domestic';s.stage='party';}else{s.region=k;s.page=0;s.stage='country';}}
    else if(s.stage==='country'){if(k==='next')s.page++;else if(k==='prev')s.page--;else if(k==='back')s.stage='root';else{s.code=k;s.stage='party';}}
    else if(s.stage==='party'){s.withPartner=k==='couple';s.pid=s.withPartner?pid(l):'';s.stage='book';}
    else if(s.stage==='book'){var q=quote(l,s),bill=B.pay(l,q.total,k,'Gói du lịch '+dest(l).name);if(!bill)return;s.paid=true;s.payer=bill;s.quote=q;s.stage='place';ledger(l).count++;log('Đặt gói '+dest(l).name+' cho '+q.people+' người, tổng '+H.money(l,q.total)+'. Bạn thanh toán '+H.money(l,bill.self)+(bill.partner?', '+l.partner.name+' thanh toán '+H.money(l,bill.partner)+' từ ngân sách riêng':'')+'. Đã gồm lưu trú, ăn, vé, hoạt động và giấy tờ.','neutral');}
    else if(s.stage==='place'){s.choices.push('tham quan '+dest(l).places[+k.slice(1)]);s.stage='food';}
    else if(s.stage==='food'){s.choices.push(k==='local'?'thưởng thức '+food(l,dest(l),s.withPartner):k==='veg'?'chọn món chay địa phương đã kiểm tra nguyên liệu':'chọn món quen hợp khẩu vị');s.stage='activity';}
    else if(s.stage==='activity'){s.choices.push(dest(l).activities[+k.slice(1)]);s.stage='incident';}
    else if(s.stage==='incident'){s.choices.push(INCIDENTS[s.incident][k==='adapt'?1:2]);finish(l,log,false);return;}queue(l);
  }
  E.DEC.travel50_step={make:function(l){return{id:'travel50_step',title:state(l).stage==='root'?'Lên kế hoạch du lịch':state(l).stage==='country'?'Chọn quốc gia / điểm đến':dest(l).name+' · '+({party:'Bạn đồng hành',book:'Xác nhận gói',place:'Danh lam thắng cảnh',food:'Ẩm thực',activity:'Trải nghiệm',incident:'Chuyện dọc đường'}[state(l).stage]),text:text(l),opts:options(l),data:snapshot(l)};},valid:valid,auto:function(l,d,r){var a=d.opts.filter(function(o){return o.k!=='next'&&o.k!=='prev'&&o.k!=='back'&&o.k!=='cancel';});return a.length?U.pick(r,a).k:'cancel';},apply:apply};
  E.DEC.du_lich={make:function(l,r){if(!init(l,r))return{id:'du_lich',title:'Chưa thể khởi hành',text:'Cần đủ tuổi, lịch trống và còn lượt hành trình trong năm.',opts:[option('cancel','Để dịp khác')],data:{}};return E.DEC.travel50_step.make(l);},valid:valid,auto:E.DEC.travel50_step.auto,apply:apply};
  E.ACT.filter(function(a){return a.id==='du_lich';}).forEach(function(a){a.avail=function(l){return fresh(l)?true:'Cần đủ 16 tuổi (nước ngoài từ 18), được tự do, lịch quay trống; tối đa 3 hành trình/năm';};});
  // Ngẫu nhiên chỉ mời chọn lịch trình, không tự trừ tiền / tự gán người đã mất đi cùng.
  E.EVENTS.forEach(function(ev){if(ev.travelCompat){ev.travel50=true;ev.run=function(l,a,r,log){if(fresh(l)&&!l.pending.some(function(d){return d.id==='travel50_step';})){log(U.pick(r,['Bạn muốn dành ít ngày khám phá một vùng đất khác. Chọn gói trước rồi mới thanh toán.','Lâu rồi chưa đi đâu xa, bạn bắt đầu tìm hiểu một chuyến du lịch.','Đồng nghiệp khoe ảnh chuyến đi, bạn cũng muốn xách ba lô lên đường một chuyến.','Kỳ nghỉ sắp tới, bạn mở bản đồ tính chuyện đi chơi xa.','Bạn bè rủ lên kế hoạch cho một chuyến đi, xem gói trước rồi mới quyết.','Mệt mỏi sau một năm làm việc, bạn muốn đổi gió vài ngày.']),'neutral');l.pending.push(E.DEC.du_lich.make(l,r));}};}});
  E.TRAVEL50={data:DATA,regions:REGIONS,incidents:INCIDENTS,current:current,valid:valid,free:free,quote:quote,options:options,ledger:ledger,state:state,init:init};
})(G);
