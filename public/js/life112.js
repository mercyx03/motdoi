/* Bank terms, residential properties, lifetime gifts and living succession. */
(function(G){'use strict';var E=G.E,H=E.H,U=G.U,X=E.UPDATE110,S=X.state,P=X.peek,menu=X.menu,next=X.next;
function adult(l){return X.reason(l,18)===true?(l.indep?true:'Cần tự lập để giao dịch tài sản'):X.reason(l,18);}
function homes(l){return (l.props||[]).filter(function(h){return h.residential112;});}
function books(l){return P(l).bankBooks||[];}
function children(l){return (l.kids||[]).filter(function(k){return k.alive!==false&&l.age-k.born>=18;});}
function pickChild(l,id){return children(l).find(function(k){return X.uid(l,k)===id;});}
function reserve(l){return l.base*.3;}function clearEstate(l){delete l.flags.estate65;if(l.flags.will70)delete l.flags.will70.settlement;}
var banks=[{"k":"public","n":"Vietcombank — tiết kiệm tại quầy","online":false,"rates":{"1":0.054,"2":0.055,"3":0.048}},{"k":"joint","n":"Vietcombank — tiền gửi có kỳ hạn tại quầy","online":false,"rates":{"1":0.054,"2":0.055,"3":0.048}},{"k":"digital","n":"Vietcombank — tiền gửi trực tuyến","online":true,"rates":{"1":0.054,"2":0.055}}];
var bankSource866="https://www.vietcombank.com.vn/vi-VN/KHCN/Cong-cu-Tien-ich/KHCN---Lai-suat",bankAsOf866="2026-11-10T10:01:01+07:00";

var britishBond873={
  k:'nsi-growth',n:'NS&I — Guaranteed Growth Bonds',online:true,currency:'GBP',asOf:'2026-10-06',
  source:'https://www.nsandi.com/about-us/press-releases/2026/higher-interest-rates-for-nsi-fixed-term-british-savings-bonds-from-today',
  rates:{1:.0499,2:.0507,3:.0510,5:.0517},issues:{1:93,2:81,3:83,5:75},min:500,max:1000000
};
function bankOffers866(l){
  var code=H.resCode(l);
  if(code==='VN'&&l.cur==='vnd')return banks;
  if(code==='GB'&&l.cur==='usd'&&(l.birthYear+l.age>2026||l.birthYear+l.age===2026&&(!l.educationDate863||!l.educationDate863.startsWith('2026-')||l.educationDate863>=britishBond873.asOf)))return [britishBond873];
  return [];
}
function interest112(book,elapsed,early){
  if(book.compound873)return book.principal*(Math.pow(1+book.rate,book.term)-1);
  var rate=early?(book.earlyRate866==null?.002:book.earlyRate866):book.rate;
  return book.principal*rate*Math.min(elapsed,book.term);
}
function insurance873(l){
  return ({
    US:'FDIC: hạn mức chuẩn 250.000 USD cho mỗi người gửi, mỗi ngân hàng được bảo hiểm, theo từng loại quyền sở hữu. https://www.fdic.gov/resources/deposit-insurance/understanding-deposit-insurance',
    GB:'FSCS: hạn mức chuẩn £120.000 từ 01/12/2025 mỗi người gửi tại mỗi tổ chức tham gia. NS&I được HM Treasury bảo đảm riêng. https://www.bankofengland.co.uk/explainers/what-is-the-financial-services-compensation-scheme',
    CA:'CDIC: tối đa 100.000 CAD cho mỗi loại tiền gửi đủ điều kiện tại mỗi tổ chức thành viên. https://www.canada.ca/en/financial-consumer-agency/services/banking/deposit-insurance.html',
    AU:'Financial Claims Scheme: tối đa 250.000 AUD mỗi người giữ tài khoản tại mỗi ADI tham gia, với tiền gửi bằng AUD. https://www.apra.gov.au/types-accounts-covered-under-financial-claims-scheme'
  })[H.resCode(l)]||'';
}
menu('bank112','Ngân hàng và sổ tiết kiệm',adult,function(l){
  var offers=bankOffers866(l),ref=offers[0];
  return books(l).length+' sổ đang mở. '+(ref?'Biểu tham chiếu '+(ref.asOf||'10/11/2026')+'. Nguồn: '+(ref.source||bankSource866):'Chưa có biểu lãi suất đối chiếu để mở sổ mới tại đây.')+'\n'+insurance873(l);
},function(l){
  return bankOffers866(l).map(function(b){
    return {k:b.k,l:b.n,h:'12 tháng · '+(b.rates[1]*100).toFixed(b.issues?2:1)+'%/năm · '+(b.currency||'VND'),run:function(l,r){next(l,'bankTerm112',r,{bank:b.k});}};
  }).concat(books(l).map(function(b){
    return {k:b.id,l:(b.locked873&&l.age<b.due?'Đang giữ đến đáo hạn: ':'Rút sổ ')+b.bank+' · '+H.money(l,b.principal),
      h:'Đáo hạn tuổi '+b.due+' · '+(b.rate*100).toFixed(2)+'%/năm',why:b.locked873&&l.age<b.due?'Chưa đáo hạn':true,
      run:function(l,r,log){
        var list=S(l).bankBooks||[],i=list.findIndex(function(x){return x.id===b.id;}),early=l.age<b.due;
        if(i<0||early&&b.locked873)return;
        var interest=interest112(b,Math.max(0,l.age-b.at),early);
        H.cash(l,b.principal+interest,early?'Rút tiết kiệm trước hạn':'Tất toán sổ tiết kiệm');
        list.splice(i,1);clearEstate(l);
        log('Tất toán '+b.bank+': gốc '+H.money(l,b.principal)+', lãi '+H.money(l,interest)+'.','neutral');
      }};
  }));
},18,'Tiền bạc');
menu('bankTerm112','Chọn kỳ hạn và gói tiết kiệm',adult,function(l,d){
  return d.arg.bank==='nsi-growth'?'Từ £500 mỗi khoản, tối đa £1 triệu mỗi đợt phát hành. Lãi gộp hằng năm trước thuế, trả khi đáo hạn. Khoản gửi cần được giữ đến hết kỳ hạn.':'Chọn số tiền và kỳ hạn. Lãi suất được cố định khi mở sổ. Rút sớm hưởng lãi không kỳ hạn tham chiếu.';
},function(l,arg){
  var bank=bankOffers866(l).find(function(b){return b.k===arg.bank;});
  if(!bank)return [];
  var out=[];
  (bank.issues?[500,5000,25000]:[.25,1,3]).forEach(function(amount){
    Object.keys(bank.rates).map(Number).forEach(function(term){
      var rate=bank.rates[term], issue=bank.issues&&bank.issues[term];
      var cost=issue?amount/(G.CUR.CUR.GB.rate*G.CUR.priceLevel(G.W.BY.GB.gdp)):l.base*amount;
      var contract={bank:bank.n+(issue?' · Issue '+issue:''),principal:cost,at:l.age,due:l.age+term,term:term,rate:rate,online:bank.online,
        earlyRate866:issue?null:.001,locked873:!!issue,compound873:!!issue,issue873:issue||null,nominal873:issue?amount:null,
        reference866:{source:bank.source||bankSource866,asOf:bank.asOf||bankAsOf866,currency:bank.currency||'VND',tenorMonths:term*12}};
      function affordable(){
        var existing=issue?books(l).filter(b=>b.issue873===issue).reduce((n,b)=>n+(b.nominal873??b.principal),0):0;
        return l.money>=cost+reserve(l)&&books(l).length<20&&(!issue||amount>=bank.min&&existing+amount<=bank.max);
      }
      if(!affordable())return;
      out.push({k:amount+':'+term+':'+bank.online,l:(issue?U.fmtNum(amount)+' GBP':H.money(l,cost))+' · '+term+' năm · '+(bank.online?'trực tuyến':'tại quầy'),
        h:(rate*100).toFixed(2)+'%/năm · lãi cả kỳ '+H.money(l,interest112(contract,term,false)),run:function(l,r,log){
          if(!affordable())return;
          H.cash(l,-cost,'Gửi tiết kiệm '+bank.n);
          var data=S(l);
          (data.bankBooks||(data.bankBooks=[])).push(Object.assign({},contract,{id:l.id+':bank:'+(data.bankSerial=(data.bankSerial||0)+1)}));
          clearEstate(l);
          log('Mở sổ tại '+contract.bank+' với lãi suất '+(rate*100).toFixed(2)+'%/năm trong '+term+' năm.','good');
        }});
    });
  });
  return out;
},18);
// Principal belongs to the owner but is excluded from spendable money.
var net=E.netWorth,total=E.assetTotal;function principal(l){return books(l).reduce(function(a,b){return a+b.principal;},0);}
E.netWorth=function(l){return net(l)+principal(l);};E.assetTotal=function(l){return total(l)+principal(l);};
var convert=E.abroadConvert;E.abroadConvert=function(l,f){var out=convert.apply(this,arguments);books(l).forEach(function(b){b.principal*=f;});return out;};
// Residential properties share existing ownership/estate records but never earn rent.
var invest=E.wealth.investYear;E.wealth.investYear=function(l){var saved=l.props,extra=homes(l);if(!extra.length)return invest.apply(this,arguments);l.props=(l.props||[]).filter(function(h){return !h.residential112;});try{return invest.apply(this,arguments);}finally{l.props=(l.props||[]).concat(extra);}};
function housingReason(l){var a=adult(l);return a!==true?a:l.abroad?'Chỉ mua/chuyển nhà nội địa trong mục này':l.school==='police'?'Học viên phải ở nội trú, chưa thể dọn nhà riêng':true;}
function debt(l){return (l.mortgage||0)+(l.loans||[]).filter(function(x){return x.type==='home';}).reduce(function(a,x){return a+(x.bal||0);},0);}
var cities=['Hà Nội','TP. Hồ Chí Minh','Đà Nẵng','Cần Thơ','Khánh Hòa','Huế'];
menu('homes112','Nhà ở nhiều nơi và chuyển nhà',housingReason,'Nhà ở riêng không cho thuê, không có doanh thu. Mua bằng tiền sẵn có, giữ quỹ dự phòng; đổi chỗ ở không tự chuyển nghề hoặc trường học. Nhà đang thế chấp cần xử lý nợ trước khi đổi nơi ở hoặc tặng.',function(l){var cs=H.isVN(l)?cities:((G.W.BY[l.country]||{}).cities||[l.city||l.place]);var out=cs.map(function(city,i){var price=H.housePrice(l)*(i<2?1.3:.85);return{k:'buy:'+city,l:'Mua thêm nhà ở '+city,h:'Giá '+H.money(l,price)+' · phí thủ tục 2%',why:l.money>=price*1.02+reserve(l)&&homes(l).length<12?true:'Thiếu vốn hoặc đã có 12 nhà dự phòng',run:function(l,r,log){if(l.money<price*1.02+reserve(l)||homes(l).length>=12)return;H.cash(l,-price*1.02,'Mua nhà ở riêng tại '+city);var h={k:'residence112',n:'Nhà ở '+city,v:price,basis:price,city:city,country:l.country,y:0,residential112:true,since:l.age};X.uid(l,h);(l.props||(l.props=[])).push(h);clearEstate(l);log('Mua nhà tại '+city+' để ở, không đưa vào cho thuê. Chưa tự dọn tới.','big');}};});homes(l).forEach(function(h){var id=X.uid(l,h);out.push({k:'move:'+id,l:'Dọn đến '+h.n,h:debt(l)>0?'Cần tất toán khoản vay nhà trước':'Đổi nhà đang ở; giữ căn cũ thành nhà dự phòng',why:debt(l)>0?'Nhà đang có khoản vay':true,run:function(l,r,log){if(debt(l)>0||!homes(l).includes(h))return;if(l.ownHouse&&l.houseVal>0){var old={k:l.houseK||'residence112',n:l.houseName||'Nhà ở cũ',v:l.houseVal,basis:l.houseVal,city:l.movedTo||l.city||l.place,country:l.country,y:0,residential112:true,since:l.age};X.uid(l,old);l.props.push(old);}l.props=l.props.filter(function(x){return x!==h;});l.ownHouse=true;l.houseVal=h.v;l.houseName=h.n;l.houseK=h.k;l.houseTier=1;l.city=h.city;l.place=h.city;l.movedTo=h.city;S(l).currentHomeCity=h.city;clearEstate(l);log('Bạn dọn đến '+h.city+'. Căn nhà trước được giữ để ở, không tự sinh tiền thuê. Công việc chưa thay đổi.','big');}});});return out;},18,'Tiền bạc');
function assets(l){var primary=l.ownHouse&&l.houseVal>0&&debt(l)<=0?[{kind:'primary',id:l.id+':primary:'+l.houseName+':'+l.houseVal,name:l.houseName||'Nhà đang ở',value:l.houseVal,obj:{n:l.houseName||'Nhà đang ở',v:l.houseVal,basis:l.houseVal,city:l.movedTo||l.city||l.place,country:l.country,k:l.houseK||'residence112',residential112:true,y:0}}]:[];return primary.concat((l.ventures||[]).map(function(v){return {kind:'venture',id:X.uid(l,v),name:v.n,value:v.cap,obj:v};}).concat((l.props||[]).map(function(h){return {kind:'home',id:X.uid(l,h),name:h.n,value:h.v,obj:h};})));}
menu('gift112','Tặng tài sản và chuyển nhà cho con',function(l){return adult(l)!==true?adult(l):!children(l).length?'Cần có con còn sống từ 18 tuổi':true;},'Chọn người con trưởng thành rồi tài sản. Cần sự đồng ý nhận và quỹ làm thủ tục 1%. Tài sản đã tặng rời khỏi sở hữu của bạn, không tiếp tục tạo lợi nhuận hoặc chia thừa kế lần nữa. Điều kiện thuế và sang tên cần đối chiếu theo nơi có tài sản.',function(l){return children(l).map(function(k){return{k:X.uid(l,k),l:k.name+' · '+(l.age-k.born)+' tuổi',run:function(l,r){next(l,'giftAsset112',r,{kid:X.uid(l,k)});}};});},18,'Tình cảm & gia đình');
menu('giftAsset112','Chọn tài sản tặng cho con',adult,function(l,d){var k=pickChild(l,d.arg.kid);return k?'Người nhận: '+k.name+'. Chuyển nhượng trọn cơ sở gồm các chi nhánh; nhà được sang tên, con tự chọn có dọn tới hay không.':'Người nhận không còn đủ điều kiện.';},function(l,arg){var k=pickChild(l,arg.kid);if(!k)return [];return assets(l).map(function(a){return{k:a.id,l:a.name,h:'Giá trị '+H.money(l,a.value)+' · phí '+H.money(l,a.value*.01),why:l.money>=a.value*.01+reserve(l)?true:'Thiếu phí và quỹ dự phòng',run:function(l,r,log){var actual=assets(l).find(function(x){return x.id===a.id;}),kid=pickChild(l,arg.kid);if(!actual||!kid||l.money<actual.value*.01+reserve(l))return;if(r()>U.clamp(.5+(kid.close||50)/200,.5,.95)){log(kid.name+' chưa sẵn sàng nhận và quản lý tài sản. Chưa sang tên hay thu phí.','neutral');return;}H.cash(l,-actual.value*.01,'Phí tặng tài sản');var payload=JSON.parse(JSON.stringify(actual.obj));if(actual.kind==='primary'){l.ownHouse=false;l.houseVal=0;l.houseName=null;l.houseK=null;l.houseTier=0;}else if(actual.kind==='venture')l.ventures=l.ventures.filter(function(v){return X.uid(l,v)!==actual.id;});else l.props=l.props.filter(function(h){return X.uid(l,h)!==actual.id;});var record={id:actual.id,kind:actual.kind==='primary'?'home':actual.kind,data:payload,at:l.age-kid.born,cur:l.cur,base:l.base};(kid.gifts112||(kid.gifts112=[])).push(record);clearEstate(l);log('Bạn sang tên '+actual.name+' cho '+kid.name+'. Tài sản đã rời sở hữu của bạn, không còn nằm trong di sản.','big');}};});},18);
menu('childHome112','Hỗ trợ con chuyển nơi ở',function(l){return adult(l)!==true?adult(l):children(l).some(function(k){return (k.gifts112||[]).some(function(g){return g.kind==='home';});})?true:'Cần con trưởng thành đã được tặng một căn nhà';},'Chỉ chuyển vào nhà đã thuộc sở hữu của con. Không tự chuyển nhà của cha mẹ thành tài sản của con; con có thể từ chối nếu chưa phù hợp công việc.',function(l){var out=[];children(l).forEach(function(k){(k.gifts112||[]).filter(function(g){return g.kind==='home';}).forEach(function(g){out.push({k:X.uid(l,k)+':'+g.id,l:k.name+' → '+g.data.n,run:function(l,r,log){if(k.alive===false||l.age-k.born<18)return;if(r()<.75){k.residence112=g.data.city||l.city;k.homeGift112=g.id;log(k.name+' đồng ý dọn đến '+g.data.n+'. Công việc của con vẫn cần tự thu xếp.','good');}else log(k.name+' muốn giữ chỗ ở hiện tại; nhà vẫn thuộc sở hữu của con.','neutral');}});});});return out;},18,'Tình cảm & gia đình');
// Gifts follow the same child and appear at their actual transfer age.
var opts=E.childOpts;E.childOpts=function(l,k){var o=opts.apply(this,arguments);o.parent.gifts112=JSON.parse(JSON.stringify(k.gifts112||[]));if(l.alive&&o.parent.heir)o.parent.heir.living112=true;return o;};
function receive(l,log){var a=P(l).incomingGifts||[];a.forEach(function(g){if(g.received||l.age<g.at)return;g.received=true;var f=g.cur===l.cur?1:l.base/g.base,asset=JSON.parse(JSON.stringify(g.data));['cap','unit','R','v','basis'].forEach(function(k){if(typeof asset[k]==='number')asset[k]*=f;});if(g.kind==='venture')(l.ventures||(l.ventures=[])).push(asset);else (l.props||(l.props=[])).push(asset);log('Nhận tài sản đã được tặng từ gia đình: '+(asset.n||'cơ sở kinh doanh')+'. Không tính thêm một lần thừa kế.','big');});}
var create=E.createLife;E.createLife=function(o){var l=create.apply(this,arguments);if(o&&o.parent){S(l).incomingGifts=JSON.parse(JSON.stringify(o.parent.gifts112||[]));if(o.parent.heir&&o.parent.heir.living112)delete l.flags.heirOf;}return l;};
var heir=E.heirAtAge;E.heirAtAge=function(l,k){var b=heir.apply(this,arguments);if(!b)return b;if(l.alive){var side=l.sex==='F'?'m':'f';b.fam[side+'Alive']=true;b.fam[side+'Name']=l.name;delete b.flags.heirOf;delete b.flags.heirTrust;b.log=b.log.filter(function(x){return !(x.a===b.age&&/năm .* ra đi/.test(x.t));});X.log(b,'Bạn tiếp tục ở tuổi hiện tại, khi '+(l.sex==='F'?'mẹ':'bố')+' '+l.name+' vẫn còn sống. Tài sản của người ấy chưa trở thành thừa kế.','big');S(b).livingParent={name:l.name,age:l.age,sex:l.sex,at:b.age};}receive(b,function(t,k){X.log(b,t,k);});return b;};
menu('succession112','Chuyển sang sống tiếp đời con',function(l){return X.reason(l,18)!==true?X.reason(l,18):(l.kids||[]).some(function(k){return k.alive!==false&&l.age-k.born>=0;})?true:'Cần có con còn sống';},'Chuyển góc nhìn sang người con ở tuổi hiện tại. Nhân vật hiện tại vẫn còn sống; chỉ tài sản đã tặng thuộc về con, không chia di sản trước hạn. Bản lưu đời cha/mẹ được giữ riêng trên thiết bị để có thể quay lại.',function(l){return (l.kids||[]).filter(function(k){return k.alive!==false&&l.age-k.born>=0;}).map(function(k){return{k:X.uid(l,k),l:'Tiếp tục đời '+k.name+' · '+(l.age-k.born)+' tuổi',run:function(l){S(l).switchChild=X.uid(l,k);}};});},18,'Tình cảm & gia đình');
E.HOOKS.year.push(function(l,r,log){if(!l.alive)return;var s=S(l);if(s.bankYear!==l.age){s.bankYear=l.age;var due=books(l).filter(function(b){return l.age>=b.due;});due.forEach(function(b){var interest=interest112(b,b.term,false);H.cash(l,b.principal+interest,'Tiết kiệm đáo hạn');log('Sổ '+b.bank+' đáo hạn: nhận gốc '+H.money(l,b.principal)+' và lãi '+H.money(l,interest)+'. Không tự tái tục.','good');});s.bankBooks=books(l).filter(function(b){return l.age<b.due;});}receive(l,log);});
var profile=E.profile;E.profile=function(l){var p=profile(l);books(l).forEach(function(b){p.assets.push([b.bank+' · đáo hạn tuổi '+b.due,H.money(l,b.principal)]);});p.net=E.netWorth(l);return p;};
E.ASSETS112={homes:homes,books:books,principal:principal,children:children,receive:receive,assets:assets};
})(globalThis.G);
