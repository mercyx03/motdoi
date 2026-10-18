/* V5.0 — chi tiêu dịch vụ và sổ nuôi xe. Giá tài sản / thuế / phạt không nhân theo lối sống. */
(function(G){
  'use strict';
  var E=G.E,H=E.H,U=G.U,scope=null;
  function unit(l,n){return l.cur==='vnd'?n:n/90*l.base;}
  function factor(l){if(l.spend==='save')return .82;if(l.spend!=='lavish')return 1;
    var own=Math.max(0,E.netWorth?E.netWorth(l):l.money||0,Number(l.income)||0),f=l.fam||{},family=(!l.indep?((f.mAlive?f.mInc||0:0)+(f.fAlive&&!f.noDad?f.fInc||0:0))*12:0),ratio=Math.max(own,family)/Math.max(1,l.base);
    return ratio>=1000?5:ratio>=100?4:ratio>=20?3:ratio>=5?2:1.5;
  }
  function price(l,n){return Math.round(unit(l,n)*factor(l)*1e6)/1e6;}
  function active(l){return scope&&scope.l===l?scope:null;}
  function scoped(l,fn,previewOnly){var before=scope,c={l:l,factor:factor(l),own:0,family:0,preview:!!previewOnly};scope=c;try{fn();}finally{scope=before;}return c;}
  var cash=H.cash;H.cash=function(l,v,why){var c=active(l);if(c&&v<0){if(!/phạt|bồi thường|viện phí|thuốc|bảo hiểm|vay|trả nợ/i.test(why||''))v*=c.factor;c.own-=v;}return cash(l,v,why);};
  var child=E.childExpense;E.childExpense=function(l,amount,why,forced){var c=active(l);if(!c)return child.apply(this,arguments);var before=scope;scope=null;var result;try{result=child(l,amount*c.factor,why,forced);}finally{scope=before;}if(result.ok){if(l.age<18&&!l.indep&&(l.fam.mAlive||(l.fam.fAlive&&!l.fam.noDad)))c.family+=amount*c.factor;else c.own+=amount*c.factor;}return result;};
  function preview(l,d,k,apply,offset){var c=JSON.parse(JSON.stringify(l,function(key,v){return key==='log'&&Array.isArray(v)?v.slice(-20):v;}));c.pending=[];if(offset)c.rs=(c.rs+offset)|0;return scoped(c,function(){apply(c,JSON.parse(JSON.stringify(d)),k,function(){return U.rand(c);},function(){});},true);}
  var ids=['hen_ho','hen_ho_moi','sinh_nhat','concert','concert_di','fanmeeting','karaoke','di_nhau','phuot','leo_nui','tap_gym','xem_bong_da','di_an','tra_sua'];
  // Các dịch vụ giải trí hiện có, trừ game/skin có bảng giá cố định và vé số/đầu tư.
  E.ACT.forEach(function(a){if(a.g==='Giải trí'&&!/game|skin|du_lich|xem_phim/.test(a.id)&&ids.indexOf(a.sc||a.id)<0)ids.push(a.sc||a.id);});
  ids.forEach(function(id){var D=E.DEC[id];if(!D)return;var make=D.make,apply=D.apply;
    D.make=function(l){if(active(l)&&active(l).preview)return make.apply(this,arguments);var d=make.apply(this,arguments),f=factor(l);if(f===1)return d;d.data._service50={factor:f,cur:l.cur,age:l.age};d.text+=' Chi tiêu '+(l.spend==='lavish'?'thoải mái: dịch vụ / chỗ ngồi / trải nghiệm cao cấp':'tiết kiệm')+' ×'+f+' giá thường.';
      d.opts.forEach(function(o){var q=[0,7919,15838].map(function(n){return preview(l,d,o.k,apply,n);}),lo=Math.min.apply(null,q.map(function(x){return x.own;})),hi=Math.max.apply(null,q.map(function(x){return x.own;})),family=Math.max.apply(null,q.map(function(x){return x.family;}));if(hi>0||family>0)o.h='Bạn dự kiến trả '+H.money(l,lo)+(hi>lo+1e-6?' – '+H.money(l,hi):'')+(family>0?' · gia đình trả '+H.money(l,family):'')+' (đã áp dụng mức dịch vụ).';});return d;};
    D.apply=function(l,d,k,r,log){if(D.valid&&!D.valid(l,d.data))return;var qd=d.data&&d.data._service50;if(qd&&(qd.factor!==factor(l)||qd.cur!==l.cur||qd.age!==l.age)){log('Mức dịch vụ hoặc thời điểm đã đổi, hãy mở lại hoạt động để xem giá mới; chưa thu tiền.','neutral');return;}var q=preview(l,d,k,apply,0);if(q.own>Math.max(0,l.money)+1e-8){log('Chưa đủ tiền cho mức dịch vụ đã chọn; hoạt động chưa diễn ra. Có thể đổi về chi tiêu bình thường / tiết kiệm.','neutral');return;}return scoped(l,function(){apply(l,d,k,r,log);});};
  });
  // Cho phép chọn nếp chi tiêu từ nhỏ; không mặc định con nhà giàu phải tiêu sang.
  E.ACT.filter(function(a){return a.id==='chi_tieu';}).forEach(function(a){a.min=6;a.avail=function(){return true;};});
  E.DEC.chi_tieu.def.text=function(l){return 'Hiện chi tiêu '+({save:'tằn tiện',normal:'bình thường',lavish:'thoải mái'}[l.spend]||'bình thường')+'. Bình thường giữ giá gói thường kể cả khi giàu. Thoải mái chọn dịch vụ tốt hơn ×1,5–5 theo tài chính của bạn, hoặc thu nhập gia đình khi chưa tự lập. Sinh hoạt hằng năm và các hoạt động dịch vụ áp dụng mức này; giá tài sản, skin game, học phí, thuế và tiền phạt giữ nguyên.';};
  E.DEC.chi_tieu.def.opts.forEach(function(o){if(o.k==='lavish')o.h='Dịch vụ cao cấp tăng theo tài chính; không tự chuyển chỉ vì giàu';if(o.k==='normal')o.h='Giá gói thường, không tăng theo tài sản';});
  function inactive(l){return !l.alive||(l.jailUntil!=null&&l.age<l.jailUntil)||(l.flags.military&&l.age<l.flags.military)||(l.abroad&&l.abroad.trapped);}
  function annual(l){var own=!!l.veh,R=l.rentVeh,car=l.veh==='ô tô',bike=l.veh==='xe máy',cycle=l.veh==='xe đạp',off=inactive(l),ev=/^(vf3|vf5|vf7|vf8|evo|feliz|theon|yadea)$/.test(l.vehK||'')||/điện/i.test(l.vehName||''),tier=l.vehTier||0;
    var v={fuel:0,maintenance:0,insurance:0,parking:0,road:0,rent:0,total:0,ev:ev,vehicle:l.vehName||l.veh||'Không có xe riêng',year:l.birthYear+l.age,cur:l.cur};
    var age=Math.max(0,l.age-(l.vehBoughtAt==null?l.age:l.vehBoughtAt)),wear=1+Math.min(.6,age*.03);
    if(own){if(!off){var fw=car?(l.age<18?0:ev?.13:tier>=4?.95:tier===3?.6:tier===2?.5:.36):bike?(l.age<16?0:ev?.025:l.vehK==='z900'?.25:l.vehSeg==='ga'?.09:.07):0;v.fuel=unit(l,fw*52)*(l.age>=70?.5:1)*(R?.25:1);}
      var extra=car||bike?Math.max(0,l.vehUp||({suv:.02,lux:.12,sport:.4,super:1.2}[l.vehK]||0))*l.base:0;
      v.maintenance=unit(l,car?(ev?4:6):bike?(ev?.5:.8):cycle?.3:0)*wear+extra;
      v.insurance=car?unit(l,.5)+Math.max(0,l.vehVal||0)*.01:bike?unit(l,.1):0;
      v.parking=unit(l,car?(l.urban?14:2):bike?(l.urban?1.2:.2):0)*(off?.25:1);v.road=car?unit(l,1.56):0;
    }else if(!R&&!off)v.fuel=unit(l,l.urban?5.2:2.6); // phương tiện công cộng, không gọi là xăng xe riêng
    if(R&&!off){v.rent=Math.max(0,R.fee||0)*12;v.fuel+=Math.max(0,R.fuel||0)*12;v.vehicle+=(own?' + ':'')+'xe thuê '+R.n;}
    ['fuel','maintenance','insurance','parking','road','rent'].forEach(function(k){v.total+=v[k];});return v;
  }
  E.vehicleAnnual=annual;E.travelCost=function(l){return annual(l).total;};E.fuelWeek=function(l){return annual(l).fuel/52;};
  function remaining(l){var p=l.partner;if(!p||p.alive===false||!(p.inc>0)||!isFinite(p.inc)||p.age<18)return 0;var a=p.leisureSpending,h=p.heritageSpending,spent=(a&&a.at===l.age&&a.cur===l.cur?a.spent:0)+(h&&h.at===l.age&&h.cur===l.cur?h.spent:0);return Math.max(0,p.inc*12*.1-spent);}
  function share(k){return k==='split'?.5:k==='partner'?0:1;}
  function canPay(l,total,k){if(!(total>=0&&isFinite(total))||['self','split','partner'].indexOf(k)<0)return false;var self=total*share(k),other=total-self;return Math.max(0,l.money)+1e-8>=self&&(!other||(l.partner&&l.partner.alive!==false&&remaining(l)+1e-8>=other));}
  function pay(l,total,k,why){if(!canPay(l,total,k))return false;var self=total*share(k),other=total-self;if(self)H.cash(l,-self,why);if(other){var p=l.partner,a=p.leisureSpending;if(!a||a.at!==l.age||a.cur!==l.cur)a=p.leisureSpending={at:l.age,cur:l.cur,spent:0};a.spent+=other;var yr=l.yr||(l.yr={items:[]});(yr.partnerExpenses||(yr.partnerExpenses=[])).push({t:why,v:other,payer:p.name});}return{self:self,partner:other};}
  E.HOOKS.year.push(function(l,r,log){var y=l.birthYear+l.age;if(l.flags.vehicleYear===y)return;l.flags.vehicleYear=y;
    if(l.veh&&l.vehBoughtAt==null)l.vehBoughtAt=l.age;
    if(l.veh&&(!l.fin||!l.fin.vehicle)){var v=annual(l),result;if(l.age>=18){H.cash(l,-v.total,'Chi phí xe khi chưa tự lập');result={ok:true,note:'Bạn chịu '+H.money(l,v.total)+' chi phí xe từ tiền riêng, kể cả khi còn đang học / mới tự lập.'};}else result=E.childExpense(l,v.total,'Xăng / sạc và bảo dưỡng xe của bạn',true);if(result.ok){l.flags.familyVehicleBill={year:y,total:v.total,note:result.note};log('Chi phí xe năm '+y+': '+H.money(l,v.total)+'. '+result.note,'money');}}
    else if(l.indep&&l.fin&&l.fin.vehicle&&l.fin.vehicle.total>0){var b=l.fin.vehicle;log('Nuôi xe / đi lại năm '+y+': xăng, sạc / vé công cộng '+H.money(l,b.fuel)+'; bảo dưỡng '+H.money(l,b.maintenance)+'; bảo hiểm '+H.money(l,b.insurance)+'; gửi xe '+H.money(l,b.parking)+'; phí đường bộ '+H.money(l,b.road)+(b.rent?'; thuê xe '+H.money(l,b.rent):'')+'. Tổng '+H.money(l,b.total)+' đã nằm trong chi phí đi lại, không trừ lần nữa.','money');}
  });
  E.lifestyleFactor=factor;E.activityPrice=price;E.LIFESTYLE={factor:factor,unit:unit,price:price,scoped:scoped,ids:ids,annual:annual};
  E.LEISURE_BILL={remaining:remaining,share:share,can:canPay,pay:pay};
  H.datePay=function(l,r,cost,why){var c=active(l),total=cost*l.base*(c?c.factor:1),p=l.partner;if(!p){H.cash(l,-cost*l.base,why);return'';}var ways=['self','split','partner'].filter(function(k){return canPay(l,total,k);});if(!ways.length){H.cash(l,-cost*l.base,why);return' Bạn chưa đủ ngân sách cho buổi hẹn.';}
    var richer=p.inc>0&&l.income>0&&p.inc*12>l.income*1.5,k=l.sex==='F'&&p.sex==='M'?(r()<.8?'partner':r()<.6?'split':'self'):l.sex==='M'&&p.sex==='F'?(r()<(richer?.45:.15)?'partner':r()<.15?'split':'self'):(richer&&r()<.5?'partner':'split');
    if(ways.indexOf(k)<0)k=ways.indexOf('split')>=0?'split':ways[0];var old=scope,bill;scope=null;try{bill=pay(l,total,k,why);}finally{scope=old;}if(c)c.own+=bill.self;return' Bạn trả '+H.money(l,bill.self)+', '+p.name+' trả '+H.money(l,bill.partner)+' từ ngân sách riêng.';};
})(G);
