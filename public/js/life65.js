/* Quê hương 63 / 34: kỷ niệm và những buổi đi chơi có người đồng hành. */
(function(G){
  'use strict';
  var E=G.E,H=E.H,U=G.U,T=E.HOMETOWN,F=E.LIFE51;
  function profile(l){var p=T.own(l);if(!p)return null;var members=l.variant==='34'&&l.prov?G.VN.P34[l.prov.neuId]:null;
    var names=members?members.members.map(function(x){return x.name;}):[p.name],places=[],foods=[];
    names.forEach(function(n){var x=T.profile(n);if(!x)return;x.places.forEach(function(s){places.push({name:s,province:n});});x.foods.forEach(function(s){foods.push({name:s,province:n});});});
    return{name:members?members.name:p.name,places:places,foods:foods,key:l.variant+':'+(members?members.id:p.name)};}
  function state(l){return l.flags.local51||(l.flags.local51={memories:{},trips:[]});}
  function parent(l){return !!(l.fam.mAlive||l.fam.fAlive&&!l.fam.noDad);}
  function allowed(l,party){if(!F.free(l)||l.age<6||!profile(l))return false;if(party==='parents')return parent(l);if(party==='friend')return l.age>=12&&l.bff&&l.bff.alive!==false;if(party==='partner')return l.age>=16&&l.partner&&l.partner.alive!==false&&l.partner.age>=16;return party==='solo'&&l.age>=16;}
  function count(l,p){return p==='parents'?(l.fam.mAlive?1:0)+(l.fam.fAlive&&!l.fam.noDad?1:0)+1:p==='solo'?1:2;}
  function who(l,p){return p==='parents'?'cùng '+(l.fam.mAlive&&l.fam.fAlive&&!l.fam.noDad?'bố mẹ':l.fam.mAlive?'mẹ':'bố'):p==='friend'?'cùng '+l.bff.name:p==='partner'?'cùng '+l.partner.name:'một mình';}
  function company(l,p){return p==='parents'?[l.fam.mAlive,l.fam.fAlive,l.fam.noDad].join(':'):p==='friend'?l.bff&&l.bff.name:p==='partner'?l.partner&&(l.partner.heritageId||l.partner.name):'solo';}
  function valid(l,d){var a=state(l).plan;return !!(a&&d&&a.token===d.token&&a.type===d.type&&a.party===d.party&&a.at===l.age&&a.location===F.snapshot(l)&&a.factor===E.lifestyleFactor(l)&&allowed(l,a.party)&&a.company===company(l,a.party)&&(!a.pid||a.pid===(l.partner.heritageId||l.partner.name))&&(!a.friend||a.friend===l.bff.name)&&state(l).trips.filter(function(t){return t.age===l.age;}).length<3);}
  // v5.6.1: giá món ăn theo mức quán bình dân / phần quà thông thường ngoài đời (triệu đồng mỗi người)
  var DISH=[[/cua Năm Căn/,.4],[/cá kho làng Vũ Đại/,.3],[/cá ngừ đại dương/,.25],[/bê chao|thịt dê/,.2],[/lợn bản|vịt quay|gỏi gà|chả mực|cá sông Đà|gỏi cá|gỏi lá/,.15],[/chè Tân Cương|hạt điều/,.15],[/bánh tráng cuốn thịt heo|gà xào măng|thắng cố|pa pỉnh tộp|thịt chua|lạp xưởng|tung lò mò|ba khía/,.11],[/canh thụt|hạt dẻ|chả cá thác lác/,.08],[/^(phở|bún|mì|mỳ|hủ tiếu|bánh canh|cao lầu|cơm tấm|cơm hến|miến|cháo|canh cá|phở chua|phở khô)/,.05],[/nem|chả tôm|cơm cháy|cam|bưởi|vải|nhãn lồng|nho|vú sữa|khóm|chuối|hồng treo|khoai|gạo|cốm/,.06],[/^bánh (căn|khọt|bèo|hỏi|cuốn|xèo)/,.045],[/^bánh|^kẹo|xôi|cơm lam|sữa|cà phê|muối tôm|don|ngọn su su/,.035]];
  function dish(name){for(var i=0;i<DISH.length;i++)if(DISH[i][0].test(name))return DISH[i][1];return .07;}
  E.dishPrice=dish;
  // địa danh: biển, hồ, phố cổ, chợ… gần như miễn phí (chỉ ăn uống, gửi xe); khu du lịch / cáp treo đắt hơn
  function place(name){if(/Bà Nà|Vinpearl|Sun World|Fansipan|cáp treo|khu du lịch|công viên|VinWonders/i.test(name))return .6;if(/biển|bãi|hồ|phố|chợ|đồi|đèo|làng|sông|núi|thác|cầu|bến|đảo|vịnh|rừng|ruộng|đồng|suối|ghềnh|mũi|phá|đầm/i.test(name))return .08;return .15;}
  E.placePrice=place;
  function cost(l,d,item){return E.activityPrice(l,(T.transport(l,item.province).v/2+(d.type==='food'?dish(item.name):place(item.name)))*count(l,d.party));}
  function begin(l,r,party){if(!allowed(l,party))return;var s=state(l);if(s.trips.filter(function(t){return t.age===l.age;}).length>=3)return;
    s.serial=(s.serial||0)+1;s.plan={token:s.serial,at:l.age,location:F.snapshot(l),factor:E.lifestyleFactor(l),party:party,company:company(l,party),type:'place',pid:party==='partner'?(l.partner.heritageId||l.partner.name):null,friend:party==='friend'?l.bff.name:null};l.pending.unshift(E.DEC.que_di51.make(l,r));}
  E.SC('que_doc',{title:function(l){var p=profile(l);return 'Khám phá quê hương · '+(p?p.name:'');},valid:function(l){return l.age>=6&&F.free(l)&&!!profile(l);},text:function(l){var p=profile(l);return p?'Quê mình có '+p.places.map(function(x){return x.name;}).join(', ')+'. Đặc sản: '+p.foods.map(function(x){return x.name;}).join(', ')+'. Bạn muốn ăn đặc sản hay rủ ai đó đi chơi?':'';},opts:[
    {k:'ok',l:function(l){return state(l).memories[profile(l).key]?'Xem kỷ niệm quê hương đã lưu':'Ghi nhớ nét đẹp quê hương';},run:function(l,r,log){var s=state(l),p=profile(l);if(!s.memories[p.key]){s.memories[p.key]=l.age;H.fx(l,{kno:1});H.mem(l,'Quê mình ở '+p.name+': '+p.places.map(function(x){return x.name;}).join(', ')+'; '+p.foods.map(function(x){return x.name;}).join(', ')+'.',3);log('Đã lưu '+p.name+' vào kỷ niệm quê hương · kiến thức +1.','good');}else log('Bạn nhớ lại '+p.name+', những món ăn và địa danh thân thuộc.','neutral');}}
  ].concat(['solo','parents','friend','partner'].map(function(p){return{k:p,l:{solo:'Tự đi khám phá',parents:'Dắt bố mẹ đi chơi',friend:'Rủ bạn thân đi chơi',partner:'Mời người yêu / bạn đời đi chơi'}[p],req:function(l){return allowed(l,p)&&state(l).trips.filter(function(t){return t.age===l.age;}).length<3;},run:function(l,r){begin(l,r,p);}};})).concat([{k:'no',l:'Để dịp khác',run:function(){}}])});
  E.DEC.que_di51={valid:valid,make:function(l){var d=Object.assign({},state(l).plan),p=profile(l),list=d.type==='food'?p.foods:p.places;
    return{id:'que_di51',title:(d.type==='food'?'Ăn đặc sản':'Đi chơi')+' · '+p.name,text:'Chọn điểm đến '+who(l,d.party)+'. Giá đã gồm đi lại và trải nghiệm cho '+count(l,d.party)+' người.',data:d,opts:list.map(function(x,i){return{k:'item'+i,l:x.name+(l.variant==='34'?' · '+x.province:''),h:H.money(l,cost(l,d,x))};}).concat([{k:'switch',l:d.type==='food'?'Chọn địa danh tham quan':'Chọn món ăn địa phương',h:''},{k:'no',l:'Hủy kế hoạch',h:''}])};},auto:function(){return 'no';},apply:function(l,dec,k,r,log){if(!valid(l,dec.data))return;var s=state(l),d=s.plan,p=profile(l);if(k==='no'){delete s.plan;return;}if(k==='switch'){d.type=d.type==='food'?'place':'food';l.pending.unshift(this.make(l,r));return;}
    if(!/^item\d+$/.test(k))return;var item=(d.type==='food'?p.foods:p.places)[+k.slice(4)];if(!item)return;var total=cost(l,d,item),bill=E.childExpense(l,total,'Đi chơi quê hương: '+item.name,false);log(bill.note,'neutral');if(!bill.ok)return;
    var text=(d.type==='food'?'Thưởng thức ':'Tham quan ')+item.name+' '+who(l,d.party)+'.';H.fx(l,{hap:3,soc:d.party==='solo'?0:2});if(d.party==='partner')l.partner.close=U.clamp((l.partner.close||50)+2,0,100);if(d.party==='friend')l.bff.close=U.clamp((l.bff.close||50)+2,0,100);
    H.mem(l,text,3);s.trips.push({age:l.age,party:d.party,name:item.name,province:item.province,cost:total,payer:bill.note});s.trips=s.trips.slice(-30);log(text,'good');delete s.plan;
  }};
  var doc=E.ACT.filter(function(a){return a.id==='que_doc';})[0];doc.avail=function(l){return profile(l)&&F.free(l)?true:'Chưa thể đi chơi quê hương lúc này';};
  // Giữ thông tin cần chọn, bỏ lời giải thích kỹ thuật trong lời kể.
  E.DEC.que_hen_ho.def.text='Bạn muốn dẫn người ấy khám phá quê mình hay cùng người ấy về quê chơi?';
  E.DEC.que_chuyen_di.def.text=function(l,d){var p=T.profile(d.province);return p?'Cùng '+d.n+' khám phá '+p.name+': chọn điểm tham quan hoặc ăn đặc sản.':'';};
  E.DEC.que_thanh_toan.def.text=function(l,d){return 'Chuyến đi cùng '+d.n+' cần '+H.money(l,T.quote(l,d))+'. Hai người chia chi phí thế nào?';};
  var wc=E.DEC.wc_su_kien;if(wc){var txt=wc.def.text;wc.def.text=function(l,d){return txt(l,d).replace(/ Tổ chức và tình huống đều hư cấu\.[\s\S]*$/,'');};}
  E.WORLD_CRIME.profiles.forEach(function(p){p[3]=p[3].map(function(s){return s.replace(/ hư cấu/g,'');});});
  E.WORLD_CRIME.cases.forEach(function(c){c.text=c.text.replace(/ hư cấu/g,'');});
  E.DEC.wc_to_chuc.def.text=function(l){return 'Một người quen ở '+G.W.BY[l.abroad&&l.abroad.code||l.country].name+' muốn giới thiệu bạn với một nhóm địa phương. Bạn có nhận lời không?';};
  E.DEC.wc_nghe.def.text='Bạn muốn tham gia hoạt động nào? Bạn sẽ bắt đầu từ vai trò nhỏ nhất.';
  E.DEC.wc_menu.def.text=function(l){return 'Những mối liên hệ ở '+G.W.BY[l.abroad&&l.abroad.code||l.country].name+'. Bạn muốn gặp người quen, xem việc hay rút lui?';};
  var migrate=E.migrateExt;E.migrateExt=function(l){if(migrate)migrate(l);l.pending=(l.pending||[]).map(function(d){if(d.id==='que_doc'&&profile(l)&&F.free(l)){var fresh=E.DEC.que_doc.make(l);fresh.manual=d.manual;return fresh;}
    var D=E.DEC[d.id];if(/^(wc_|que_hen_ho$|que_chuyen_di$|que_thanh_toan$|gameshow$|vr_vai_tro$)/.test(d.id)&&D&&D.def&&D.valid(l,d.data||{})){
      var def=D.def,a=d.data||{};d.text=typeof def.text==='function'?def.text(l,a):def.text;
      d.opts.forEach(function(o){var source=def.opts.filter(function(x){return x.k===o.k;})[0];if(!source)return;o.l=typeof source.l==='function'?source.l(l,a):source.l;o.h=typeof source.h==='function'?source.h(l,a):source.h||'';});
    }return d;});};
  E.LOCAL51={profile:profile,valid:valid,cost:cost,begin:begin};
})(G);
