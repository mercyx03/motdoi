/* 8.10.74: đổi nơi sống không làm mất tài sản. Nhà riêng được giữ lại thành tài sản tại nơi cũ (dùng chung danh mục nhà ở riêng
   residential112, không phát sinh tiền thuê); khi quay lại đúng nước đó và chưa có nhà đang ở thì dọn về ở.
   8.10.78: nhà còn nợ thế chấp cũng được giữ nếu vốn chủ sở hữu còn dương. Khoản vay chuyển thành khoản vay ngân hàng thường (gắn dấu lien874),
   tiếp tục được trả và quy đổi tiền như mọi khoản vay; trễ hạn kéo dài thì ngân hàng phát mại căn nhà; bán nhà thì tất toán khoản vay;
   dọn về ở lại thì khoản vay trở lại là vay mua nhà. */
(function(G){'use strict';var E=G.E,H=E.H,W=G.W;
function homeLoans(l){return (l.loans||[]).filter(function(x){return x.type==='home'&&x.bal>0.5;});}
function homeDebt(l){return (l.mortgage||0)+homeLoans(l).reduce(function(n,x){return n+(x.bal||0);},0);}
function where(l){return l.abroad&&l.abroad.code||l.country;}
function lien(l,p){return p&&p.lien874?(l.loans||[]).filter(function(x){return x.lien874===p.lien874.id;}):[];}
H.keepHome874=function(l,at){if(!l||!l.ownHouse||!(l.houseVal>0))return false;var debt=homeDebt(l);if(debt>0&&l.houseVal-debt<l.houseVal*0.1)return false;
 var code=at||where(l),b=W.BY[code],city=l.movedTo||l.city||l.place||(b&&b.cities[0])||'',name=(l.houseName||'Nhà riêng')+' ở '+city+(b?', '+b.name:''),id=null;
 if(debt>0){id='L'+l.age+'-'+((l.props||[]).length)+'-'+Math.round(l.houseVal);l.loans=l.loans||[];
  if(l.mortgage>0.5)l.loans.push({type:'home',name:'vay mua nhà',bal:l.mortgage,rate:0.07,minShare:0.08,late:0,lateTot:0,since:l.age});
  l.loans.forEach(function(x){if(x.type==='home'&&x.bal>0.5){x.type='bank';x.wasHome874=true;x.lien874=id;x.name='vay thế chấp '+name;}});}
 (l.props||(l.props=[])).push({k:l.houseK||'residence112',n:name,v:l.houseVal,basis:l.houseVal,city:city,country:code,residential112:true,y:0,kept874:{at:l.age,from:code},lien874:id?{id:id,late:0,lateTot:0,bal:debt}:null});
 if(!id)delete l.props[l.props.length-1].lien874;
 l.ownHouse=false;l.houseVal=0;l.mortgage=0;return id?'lien':true;};
H.reoccupy874=function(l,code,log){if(!l||l.ownHouse)return false;var i=(l.props||[]).findIndex(function(p){return p&&p.kept874&&p.country===code;});if(i<0)return false;var p=l.props.splice(i,1)[0];l.ownHouse=true;l.houseVal=p.v;if(p.basis!=null)l.houseBasis874=p.basis;
 lien(l,p).forEach(function(x){x.type=x.wasHome874===false?'bank':'home';delete x.lien874;delete x.wasHome874;});
 if(typeof log==='function')log('Bạn dọn về ở lại '+p.n+'; căn nhà vẫn thuộc sở hữu của bạn suốt thời gian đi xa.','good');return true;};
// mỗi năm: theo dõi khoản thế chấp của nhà đã giữ lại
function yearly(l,r,log){if(!l||!l.alive)return;
 (l.props||[]).slice().forEach(function(p){var s=p&&p.lien874;if(!s)return;var ls=lien(l,p),open=ls.filter(function(x){return x.bal>0.5;});
  if(open.length){s.late=Math.max.apply(null,open.map(function(x){return x.late||0;}));s.lateTot=Math.max.apply(null,open.map(function(x){return x.lateTot||0;}));s.bal=open.reduce(function(n,x){return n+x.bal;},0);return;}
  var i=l.props.indexOf(p);
  if(s.late>=3||s.lateTot>=5){if(i>=0)l.props.splice(i,1);log('Không trả nổi khoản thế chấp, ngân hàng phát mại '+p.n+'. Tiền bán nhà trừ nợ gốc, lãi và phí; phần còn lại không đáng kể.','bad');H.fx(l,{hap:-10});if(H.mem)H.mem(l,'Ngày ngân hàng niêm phong căn nhà bạn không thể về ở.',5);}
  else delete p.lien874;
  l.loans=(l.loans||[]).filter(function(x){return x.lien874!==s.id;});});
 // nhà đã bán khi còn khoản thế chấp: tất toán bằng tiền sẵn có
 (l.loans||[]).forEach(function(x){if(!x.lien874||x.bal<=0.5)return;if((l.props||[]).some(function(p){return p&&p.lien874&&p.lien874.id===x.lien874;}))return;
  var pay=Math.min(x.bal,Math.max(0,l.money));if(pay>0){H.cash(l,-pay,'Tất toán khoản thế chấp sau khi bán nhà');x.bal-=pay;}
  if(x.bal<=0.5){x.bal=0;log('Bán căn nhà đã giữ lại và tất toán khoản thế chấp.','good');}else log('Căn nhà đã bán nhưng còn nợ thế chấp '+H.money(l,x.bal)+'; khoản này vẫn phải trả dần.','neutral');delete x.lien874;});}
E.HOOKS.year.push(yearly);
E.MOVE874={homeDebt:homeDebt,keep:H.keepHome874,reoccupy:H.reoccupy874,lien:lien,yearly:yearly};
})(globalThis.G);
