/* 8.10.74: đổi nơi sống không làm mất tài sản. Nhà riêng không còn nợ vay được giữ lại thành tài sản tại nơi cũ
   (dùng chung danh mục nhà ở riêng residential112, không phát sinh tiền thuê); khi quay lại đúng nước đó và chưa có nhà đang ở thì dọn về ở. */
(function(G){'use strict';var E=G.E,H=E.H,W=G.W;
function homeDebt(l){return (l.mortgage||0)+(l.loans||[]).filter(function(x){return x.type==='home';}).reduce(function(n,x){return n+(x.bal||0);},0);}
function where(l){return l.abroad&&l.abroad.code||l.country;}
H.keepHome874=function(l,at){if(!l||!l.ownHouse||!(l.houseVal>0)||homeDebt(l)>0)return false;var code=at||where(l),b=W.BY[code],city=l.movedTo||l.city||l.place||(b&&b.cities[0])||'';
 (l.props||(l.props=[])).push({k:l.houseK||'residence112',n:(l.houseName||'Nhà riêng')+' ở '+city+(b?', '+b.name:''),v:l.houseVal,basis:l.houseVal,city:city,country:code,residential112:true,y:0,kept874:{at:l.age,from:code}});
 l.ownHouse=false;l.houseVal=0;l.mortgage=0;return true;};
H.reoccupy874=function(l,code,log){if(!l||l.ownHouse)return false;var i=(l.props||[]).findIndex(function(p){return p&&p.kept874&&p.country===code;});if(i<0)return false;var p=l.props.splice(i,1)[0];l.ownHouse=true;l.houseVal=p.v;if(p.basis!=null)l.houseBasis874=p.basis;if(typeof log==='function')log('Bạn dọn về ở lại '+p.n+'; căn nhà vẫn thuộc sở hữu của bạn suốt thời gian đi xa.','good');return true;};
E.MOVE874={homeDebt:homeDebt,keep:H.keepHome874,reoccupy:H.reoccupy874};
})(globalThis.G);
