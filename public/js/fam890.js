/* 9.0: sổ nợ và ân oán gia đình, mở rộng các cảnh anh chị em của life90 (fd_anh_em_no, fd_tranh_gianh, fd_kien_di_san) thay vì tạo hệ mới.
   Trước đây mỗi cảnh chỉ đặt một cờ rồi xong. Nay:
   - Trả nợ giúp anh chị em tạo khoản nợ gia đình được theo dõi nhiều năm: người vay trả theo đợt, trả chậm, bỏ trống, hoặc qua đời; trễ lâu thì mở cảnh xử lý (bỏ qua, gia hạn, kiện, trừ vào việc khác).
   - Lập di chúc rõ ràng khi cha mẹ còn sống làm giảm nguy cơ kiện di sản (trừ khi quan hệ đã rất xấu); đòi chia trước hoặc để mặc thì giữ nguyên nguy cơ.
   - Khoản nợ còn lại được bù trừ trong thỏa thuận di sản với chính người đó.
   Xác suất trả nợ phụ thuộc quan hệ, hoàn cảnh kinh tế của người vay, việc làm và việc họ đã tu chí hay chưa, không theo mặc định giàu/nghèo.
   Số liệu là tham số trò chơi, không phải thống kê. Nợ chưa thu hồi biến mất khi bạn qua đời (không đi vào di sản). Bản lưu cũ không có sổ này vẫn chạy. */
(function(G){'use strict';var E=G.E,H=E.H,U=G.U,SC=E.SC;
var X=E.UPDATE110;if(!E.DEC.fd_anh_em_no||!E.DEC.fd_kien_di_san||!E.DEC.fd_tranh_gianh||!SC)return;
function st(l){var s=l.flags.fam890;if(!s||typeof s!=='object')s=l.flags.fam890={debts:[],serial:0};if(!Array.isArray(s.debts))s.debts=[];return s;}
function peek(l){return l.flags.fam890&&Array.isArray(l.flags.fam890.debts)?l.flags.fam890:{debts:[]};}
function sibOf(l,d){return (l.sibList||[]).find(function(s){return X.uid(l,s)===d.sib;})||null;}
function call(l,s){return H.sibCall?H.sibCall(l,s):'anh chị';}
function money(l,v){return H.money(l,v);}
function open(l){return peek(l).debts.filter(function(d){return d.status==='open'||d.status==='settle';});}
// Khả năng trả của người vay trong năm: quan hệ, kinh tế nhà họ, việc đã tu chí, số lần lỡ hẹn; không suy từ giàu/nghèo đơn thuần.
function chance(l,d,s){
 var p=.3+(s.close||50)/220+((s.q||3)>=4?.1:(s.q||3)<=2?-.1:0)+(/thất nghiệp|không có việc/.test(s.job||'')?-.15:s.job?.05:0)+(d.reformed?.2:-.15)-d.misses*.07;
 return U.clamp(p,.05,.9);
}
function register(l,dec,s,v){
 var q=st(l);if(q.debts.some(function(d){return d.sib===X.uid(l,s)&&d.status==='open';}))return;
 var reformed=(s.close||0)>(dec.data.close0==null?0:dec.data.close0);
 q.debts.push({id:l.id+':fam890:'+(++q.serial),sib:X.uid(l,s),name:s.n,amount:v,bal:v,since:l.age,misses:0,paid:0,reformed:reformed,status:'open',ext:0});
}
// 1. Trả nợ giúp → sổ nợ
var ne=E.DEC.fd_anh_em_no;var neApply=ne.apply;
ne.apply=function(l,dec,k){var s0=dec&&dec.data&&dec.data.i>=0?l.sibList[dec.data.i]:null;if(s0&&dec.data)dec.data.close0=s0.close;
 var was=l.flags.fdNo;var out=neApply.apply(this,arguments);
 if(k==='tra'&&l.flags.fdNo==='tra'&&was!=='tra'&&s0&&dec.data)register(l,dec,s0,dec.data.v);
 return out;};
SC('fam890_settle',{
 title:'Khoản nợ anh chị em chưa trả',
 prep:function(l,r,a){return {id:a&&a.id};},
 valid:function(l,d){var q=open(l).find(function(x){return x.id===(d&&d.id);});return !!q&&q.status==='settle'&&!!sibOf(l,q);},
 text:function(l,d){var q=open(l).find(function(x){return x.id===d.id;}),s=q&&sibOf(l,q);return s?U.cap(call(l,s))+' vẫn còn nợ bạn '+money(l,q.bal)+' sau '+(l.age-q.since)+' năm (đã trả '+money(l,q.paid)+', lỡ hẹn '+q.misses+' lần). Chuyện này cứ lơ lửng giữa hai người.':'';},
 opts:[
  {k:'forgive',l:'Bỏ qua khoản nợ, giữ tình anh chị em',ai:{w:1,moral:1},run:function(l,r,log,d){var q=open(l).find(function(x){return x.id===d.id;}),s=q&&sibOf(l,q);if(!q||!s)return;q.status='closed';q.result='forgiven';s.close=Math.min(100,(s.close||50)+10);H.fx(l,{karma:3,hap:1});log('Bạn xóa khoản nợ '+money(l,q.bal)+' cho '+call(l,s)+'. Không ai nhắc lại, nhưng cả hai đều biết số tiền ấy đã đi đâu.','neutral');}},
  {k:'extend',l:'Gia hạn và bàn lại lịch trả',req:function(l,d){var q=open(l).find(function(x){return x.id===d.id;});return !!q&&q.ext<2;},ai:{w:.9},run:function(l,r,log,d){var q=open(l).find(function(x){return x.id===d.id;}),s=q&&sibOf(l,q);if(!q||!s||q.ext>=2)return;q.status='open';q.ext++;q.misses=0;q.since=l.age;log('Bạn và '+call(l,s)+' ngồi lại, ghi rõ lịch trả mới cho phần nợ còn '+money(l,q.bal)+'.','neutral');}},
  {k:'sue',l:function(l){return 'Kiện đòi nợ · '+money(l,l.base*.1);},req:function(l){return l.money>=l.base*.1;},ai:{w:.4,risk:1},run:function(l,r,log,d){var q=open(l).find(function(x){return x.id===d.id;}),s=q&&sibOf(l,q);if(!q||!s)return;
   H.cash(l,-l.base*.1,'Án phí đòi nợ anh chị em');var win=U.clamp(.35+(q.reformed?-.05:.1)+(q.paid>0?.05:0)+(q.ext?0:.05),.2,.7);
   q.status='closed';s.close=Math.max(0,(s.close||50)-30);
   if(r()<win){var back=q.bal*(.5+r()*.4);H.cash(l,back,'Thu hồi nợ anh chị em qua tòa');q.result='sued-won';log('Tòa buộc '+call(l,s)+' trả '+money(l,back)+'. Bạn thắng, nhưng bữa cơm đoàn viên năm sau thiếu một chỗ ngồi.','neutral');}
   else{q.result='sued-lost';log('Vụ kiện đòi nợ '+call(l,s)+' không đi đến đâu: thiếu giấy tờ chứng minh và người vay không còn tài sản. Bạn mất án phí và tình thân.','bad');H.fx(l,{hap:-4});}}},
  {k:'offset',l:'Ghi nhớ, trừ vào phần chia khi có việc chung (di sản)',ai:{w:.7},run:function(l,r,log,d){var q=open(l).find(function(x){return x.id===d.id;}),s=q&&sibOf(l,q);if(!q||!s)return;q.status='open';q.offset=true;q.misses=0;q.since=l.age;log('Bạn nói thẳng: khoản nợ '+money(l,q.bal)+' sẽ được trừ khi anh chị em chia tài sản của bố mẹ. '+U.cap(call(l,s))+' im lặng một lúc rồi gật đầu.','neutral');}}
 ]
});
// Hằng năm: người vay trả theo đợt hoặc trễ; qua đời thì xóa nợ.
function yearly(l,r,log,a){
 if(!l.alive)return;var q=peek(l);if(!q.debts.length)return;
 q.debts.forEach(function(d){
  if(d.status!=='open'||d.at===l.age)return;d.at=l.age;
  var s=sibOf(l,d);
  if(!s||s.alive===false){d.status='closed';d.result='deceased';log('Người vay '+(d.name||'trong nhà')+' đã qua đời; khoản nợ '+money(l,d.bal)+' không còn ai để đòi.','neutral');return;}
  if(d.bal<=.5){d.status='closed';d.result='paid';return;}
  if(l.age-d.since<1)return;
  if(r()<chance(l,d,s)){var pay=Math.min(d.bal,d.amount*.25);d.bal-=pay;d.paid+=pay;s.close=Math.min(100,(s.close||50)+2);H.cash(l,pay,'Anh chị em trả nợ');
   log(U.cap(call(l,s))+' trả bạn '+money(l,pay)+'. Còn nợ '+money(l,d.bal)+'.','good');if(d.bal<=.5){d.status='closed';d.result='paid';log(U.cap(call(l,s))+' đã trả hết nợ.','good');}}
  else{d.misses++;s.close=Math.max(0,(s.close||50)-3);if(d.misses===1)log(U.cap(call(l,s))+' lỡ hẹn trả nợ năm nay, hẹn lại sang năm.','neutral');
   if(d.misses>=3||l.age-d.since>=6){d.status='settle';l.pending.push(E.DEC.fam890_settle.make(l,r,{id:d.id}));}}
 });
}
E.HOOKS.year.push(yearly);
// 2. Di chúc rõ ràng khi cha mẹ còn sống giảm nguy cơ kiện di sản (trừ khi quan hệ đã rất xấu)
var ks=E.DEC.fd_kien_di_san,valid0=ks.def.valid;
ks.def.valid=function(l,d){
 if(!valid0.apply(this,arguments))return false;
 if(l.flags.fdTranh==='di_chuc'&&d&&d.i!=null&&d.i>=0){var s=l.sibList[d.i];if(s&&(s.close||0)>=35)return false;}
 return true;
};
var ksText=ks.def.text;ks.def.text=function(l,d){var t=typeof ksText==='function'?ksText.apply(this,arguments):ksText,s=l.sibList&&l.sibList[d.i],q=s&&peek(l).debts.find(function(x){return x.sib===X.uid(l,s)&&(x.status==='open'||x.status==='settle')&&x.bal>.5;});
 return t+(q?' Trong hồ sơ, người này còn nợ bạn '+money(l,q.bal)+' từ trước.':'')+(l.flags.fdTranh==='doi'?' Chuyện bạn từng đòi chia trước khi cha mẹ còn sống bị đem ra làm lý lẽ.':'');};
var ksApply=ks.apply;ks.apply=function(l,dec,k){var out=ksApply.apply(this,arguments),s=dec&&dec.data&&dec.data.i>=0?l.sibList[dec.data.i]:null;
 if(s){var q=peek(l).debts.find(function(x){return x.sib===X.uid(l,s)&&(x.status==='open'||x.status==='settle')&&x.bal>.5;});
  if(q&&q.offset&&k==='nhuong'){var back=Math.min(q.bal,dec.data.v*.3);H.cash(l,back,'Bù trừ nợ anh chị em vào thỏa thuận di sản');q.bal-=back;q.paid+=back;if(q.bal<=.5){q.status='closed';q.result='offset';}
   X.log(l,'Khoản nợ cũ được trừ vào thỏa thuận di sản: bạn thu lại '+money(l,back)+'.','neutral');}}
 return out;};
// 3. Quy đổi tiền khi đổi nước
var convert=E.abroadConvert;E.abroadConvert=function(l,f){var out=convert.apply(this,arguments),q=l.flags.fam890;if(q&&q.debts)q.debts.forEach(function(d){d.amount*=f;d.bal*=f;d.paid*=f;});return out;};
E.FAM890={yearly:yearly,state:st,open:open,chance:chance,register:register,sibOf:sibOf};
})(globalThis.G);
