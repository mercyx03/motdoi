/* 9.0: bế tắc 50/50 trong công ty gia đình leo thang theo năm thay vì treo vô hạn (mở rộng deadlock874 của business874, không thay cơ chế cũ).
   Sau 3 năm không giải quyết, phía còn lại chủ động đề xuất: nhượng 1% để họ nắm quá bán (nhận tiền, mất thế cân bằng), hoặc kiện ra tòa nhờ chọn chủ tịch độc lập (tốn án phí, thù lao do công ty trả, quan hệ xấu đi), hoặc giữ nguyên (điểm quản trị giảm và lần sau bị ép mạnh hơn).
   Sau ba lần giữ nguyên, lần đề nghị kế tiếp tòa tự chỉ định chủ tịch độc lập. Mọi trạng thái nằm trong governance908.deadlock874 nên giữ qua bản lưu, kể cả khi tải lại giữa tranh chấp. Mức giá và án phí là tham số trò chơi. */
(function(G){'use strict';var E=G.E,H=E.H,U=G.U,X=E.UPDATE110,B=E.BUSINESS123,D=E.BIZ874,R=E.BUSINESS133;if(!D||!D.deadlock||!X||!B)return;
var AFTER=3,EVERY=2;
function companies(l){return B.companies(l).filter(function(c){return !c.merged;});}
function byId(l,id){return companies(l).find(function(c){return X.uid(l,c)===id;});}
function money(l,v){return H.money(l,v);}
function rival(c){return (c.holders137||[]).slice().sort(function(a,b){return b.share-a.share;})[0]||null;}
function round(v){return Math.round(v*100)/100;}
function due(l,c){var k=D.deadlock(c);if(!k)return false;if(c.share>50+1e-9||(c.holders137||[]).some(function(h){return h.share>50+1e-9;})){k.stage='resolved';k.how=k.how||'ownership';return false;}var e=k.esc890||(k.esc890={n:0,last:k.at});return l.age-k.at>=AFTER&&l.age-e.last>=(e.n?EVERY:0);}
function court(l,c,k,log,forced){
 var cost=l.base*.6;H.cash(l,-cost,'Án phí và luật sư đòi chủ tịch độc lập');
 k.stage='resolved';k.how=forced?'court-forced':'court';c.chair908={id:'independent',name:'Chủ tịch độc lập do tòa chỉ định',since:l.age};c.chairCost137=(c.chairCost137||0)+l.base*1.2;
 var o=rival(c);if(o&&E.DYNASTY908&&E.DYNASTY908.relation)E.DYNASTY908.relation(l,'self',o.id,-4);
 log((forced?'Sau nhiều lần bế tắc, hai bên bị buộc ra tòa. ':'')+'Tòa chỉ định chủ tịch độc lập cho '+c.name+'. Bạn trả '+money(l,cost)+' án phí, thù lao chủ tịch do công ty chịu; quan hệ với phía còn lại xấu đi.','neutral');
}
function yearly(l,r,log){
 if(!l.alive)return;
 companies(l).forEach(function(c){var k=D.deadlock(c);if(!k||!due(l,c))return;
  var e=k.esc890;e.n++;e.last=l.age;
  if((e.holds||0)>=3){court(l,c,k,log,true);return;}
  X.next(l,'deadlock890',r,{cid:X.uid(l,c)},{manual:false});
  log('Phía còn lại đề nghị giải quyết dứt điểm bế tắc ở '+c.name+'.','neutral');
 });
}
E.HOOKS.year.push(yearly);
X.menu('deadlock890','Đề nghị giải quyết bế tắc công ty',function(l){return X.reason(l,18);},function(l,d){
 var c=byId(l,d.arg.cid),k=c&&D.deadlock(c),o=c&&rival(c),e=k&&k.esc890;
 return k&&o?c.name+' bế tắc 50/50 đã '+(l.age-k.at)+' năm. '+o.name+' đề nghị giải quyết: nhận '+money(l,c.value*.01*.85)+' cho 1% cổ phần để họ nắm quá bán, hoặc ra tòa nhờ chọn chủ tịch độc lập. Giữ nguyên làm giảm điểm quản trị'+(e&&e.holds>=2?' và nếu tiếp tục từ chối, tòa sẽ tự chỉ định chủ tịch độc lập.':'.'):'Không còn bế tắc.';
},function(l,a){
 var c=byId(l,a.cid),k=c&&D.deadlock(c),o=c&&rival(c);if(!k||!o)return [];
 return [
  {k:'cede',l:'Nhượng 1% cho '+o.name+' để họ nắm quá bán',h:'Nhận '+money(l,c.value*.01*.85)+'; bạn còn '+round(c.share-1)+'%',why:c.share>1?true:'Không đủ cổ phần',run:function(l,r,log){
   if(c.share<=1||!D.deadlock(c))return;var cash=c.value*.01*.85;H.cash(l,cash,'Nhượng 1% cổ phần để giải bế tắc');
   c.share=round(c.share-1);var h=(c.holders137||[]).find(function(x){return x.id===o.id;});if(h)h.share=round(h.share+1);
   k.stage='resolved';k.how='cede';c.chair908={id:o.id,name:o.name,since:l.age};
   if(E.DYNASTY908&&E.DYNASTY908.relation)E.DYNASTY908.relation(l,'self',o.id,2);
   log('Bạn nhượng 1% '+c.name+' cho '+o.name+', nhận '+money(l,cash)+'. '+o.name+' nắm quá bán và làm Chủ tịch; bạn còn '+c.share+'% và không còn thế cân bằng.','neutral');}},
  {k:'court',l:'Ra tòa nhờ chọn chủ tịch độc lập · '+money(l,l.base*.6),why:l.money>=l.base*.6?true:'Không đủ tiền án phí',run:function(l,r,log){if(!D.deadlock(c)||l.money<l.base*.6)return;court(l,c,k,log,false);}},
  {k:'hold',l:'Giữ nguyên, chưa đồng ý',h:'Điểm quản trị giảm; sau ba lần giữ nguyên tòa sẽ tự chỉ định',run:function(l,r,log){var e=k.esc890;e.holds=(e.holds||0)+1;c.governance=Math.max(0,(c.governance||0)-1);log('Bạn từ chối đề nghị của '+o.name+'; bế tắc tiếp tục, điểm quản trị của '+c.name+' giảm.','neutral');}}
 ];
},18);
E.BIZ890={yearly:yearly,court:court,due:due,AFTER:AFTER,EVERY:EVERY};
})(globalThis.G);
