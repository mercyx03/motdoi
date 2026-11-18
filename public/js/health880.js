/* 8.10.80: lớp số liệu y tế theo nguồn chính thức, đặt trên healthsys919 (không sửa file đó).
   - NHS England: phí kê đơn £9,90 mỗi lần (không còn tăng 3%/năm theo dự báo), miễn cho người 16–18 tuổi đang học toàn thời gian;
     phiếu trả trước PPC 3 tháng £32,05 hoặc 12 tháng £114,50 (có thể tự gia hạn hằng năm).
   - Nhật Bản từ 70 tuổi: 70–74 trả 20%, từ 75 trả 10% hoặc 20% (từ 10/2022, theo thu nhập hộ), người có thu nhập ngang người đang làm trả 30%.
   Năm trước mốc số liệu, nơi khác và người dưới 70 ở Nhật giữ nguyên tính toán của healthsys919.
   Game tính theo năm nên PPC 3 tháng được quy thành số lần kê đơn: khoảng một phần tư số lần kê đơn năm trước (ít nhất 1). */
(function(G){'use strict';var E=G.E,H=E.H,X=E.UPDATE110,W=G.W,HS=E.HEALTH919;if(!HS||!X||!E.medBill)return;
var NHS={from:2025,charge:9.9,ppc3:32.05,ppc12:114.5,asOf:'2026-11-14',
 source:'https://www.nhsbsa.nhs.uk/help-nhs-prescription-costs/nhs-prescription-prepayment-certificate-ppc'};
// Ngưỡng 75+ trả 20%: thu nhập lương hưu + thu nhập khác từ 200万円 (hộ một người) hoặc 320万円 (hộ nhiều người), từ 01/10/2022.
// Ngưỡng "thu nhập ngang người đang làm" (現役並み): khoảng 383万円/520万円 theo cách MHLW thường dùng, chưa đọc được nguyên văn.
var JP={from75x2:2022,mid:{single:2000000,couple:3200000},high:{single:3830000,couple:5200000},highVerified:false,
 source:'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/iryouhoken/newpage_21060.html'};
function res(l){return H.resCode(l);}
function wy(l){return (l.birthYear||2000)+(l.age||0);}
function mo(l,v){return H.money(l,v);}
function usd(l,v){return E.usdToLocal?E.usdToLocal(l,v):v/4000*l.base;}
function local(cc,v){var c=G.CUR.CUR[cc],b=W.BY[cc];return v/((c&&c.rate||1)*G.CUR.priceLevel(b?b.gdp:80));}
function toLocalCur(cc,v){var c=G.CUR.CUR[cc],b=W.BY[cc];return v*(c&&c.rate||1)*G.CUR.priceLevel(b?b.gdp:80);}
function st(l){var s=l.flags.health880;if(!s||typeof s!=='object')s=l.flags.health880={v:1};return s;}
function inScope(l){return l&&l.flags&&['vn','world'].includes(l.mode)&&!(H.isVN(l)&&res(l)==='VN')&&HS.status(l)!=='visitor';}
function married(l){var p=l.partner;return !!(p&&p.alive!==false&&p.status!=='dating'&&!p.separated908);}
// NHS England: người lẽ ra phải trả phí kê đơn (theo healthsys919) trừ học sinh 16–18 học toàn thời gian.
function rxPayer(l){if(!inScope(l)||res(l)!=='GB'||wy(l)<NHS.from)return false;var p=HS.policy(l);return p.nation==='ENG'&&p.rxFee>0&&!(l.age<19&&l.school);}
function ppcValid(l){var s=st(l);return s.ppc12&&s.ppc12.age===l.age?'12':s.ppc3&&s.ppc3.age===l.age&&s.ppc3.left>0?'3':null;}
function jpCopay(l){
 if(!inScope(l)||res(l)!=='JP'||l.age<70)return null;
 var y=wy(l),inc=toLocalCur('JP',l.income||0),hh=married(l)?'couple':'single';
 if(inc>=JP.high[hh])return {rate:.3,why:'thu nhập ngang người đang làm (ước tính)'};
 if(l.age<75)return {rate:.2,why:'70–74 tuổi'};
 if(y>=JP.from75x2&&inc>=JP.mid[hh])return {rate:.2,why:'75+ có thu nhập từ '+(hh==='single'?'200':'320')+' vạn yên/năm'};
 return {rate:.1,why:'75+'};
}
// Chính sách sau khi áp lớp số liệu; null khi lớp này không thay đổi gì.
function override(l){
 if(rxPayer(l)){var p=HS.policy(l),k=ppcValid(l);return Object.assign({},p,{rxLocal:k?0:local('GB',NHS.charge),ppc:k,rxSrc:NHS.source});}
 var j=jpCopay(l);if(j){var q=HS.policy(l);return Object.assign({},q,{share:1-j.rate,copayWhy:j.why,jpSrc:JP.source});}
 return null;
}
function split(l,total,p){
 var y=HS.yr(l),ded=usd(l,p.ded||0),cap=p.cap==null?null:usd(l,p.cap);
 var toDed=Math.min(total,Math.max(0,ded-y.ded)),rest=total-toDed,own=toDed+rest*(1-p.share);
 if(cap!=null)own=Math.min(own,Math.max(0,cap-y.oop));
 return {p:p,own:own,ins:total-own,toDed:toDed};
}
function countRx(l){var s=st(l);if(!s.rx||s.rx.age!==l.age){if(s.rx)s.prevN=s.rx.n;s.rx={age:l.age,n:0};}s.rx.n++;}
var own0=E.medOwnCost;
E.medOwnCost=function(l,total,cover){
 var p=total>0&&override(l);
 if(!p)return own0.apply(this,arguments);
 if(!l.indep&&l.age<18)return 0;
 var base=total*(cover==null?1:cover);
 return split(l,base,p).own+(total-base)+(p.rxLocal||0);
};
var bill0=E.medBill;
E.medBill=function(l,total,why,log,cover){
 var p=total>0&&override(l);if(!p)return bill0.apply(this,arguments);
 var c=cover==null?1:cover,base=total*c,x=split(l,base,p),y=HS.yr(l),rx=0,rxText='';
 if(p.rxLocal!=null){countRx(l);var s=st(l);if(p.ppc==='3')s.ppc3.left--;rx=p.rxLocal;rxText=p.ppc?' (phí kê đơn đã trả trước bằng PPC '+p.ppc+' tháng)':' (gồm phí kê đơn £9,90)';}
 var own=x.own+(total-base)+rx;
 if(!l.indep&&l.age<18){if(log)log('Gia đình lo viện phí '+mo(l,total)+' ('+p.name+' chi trả '+mo(l,x.ins)+').','neutral');y.ded+=x.toDed;y.oop+=x.own;return 0;}
 H.cash(l,-own,why);y.ded+=x.toDed;y.oop+=x.own;y.n++;
 if(log)log('Viện phí '+mo(l,total)+': '+p.name+' chi trả '+mo(l,x.ins)+(x.toDed>0?', khấu trừ '+mo(l,x.toDed):'')+', bạn trả '+mo(l,own)+rxText+(p.copayWhy?' (tự trả '+Math.round((1-p.share)*100)+'%: '+p.copayWhy+')':'')+'. Thời gian tiếp cận: '+p.wait+'.','neutral');
 return own;
};
var share0=E.bhytShare;E.bhytShare=function(l){var p=override(l);return p?p.share:share0.apply(this,arguments);};
var note0=E.medNote;E.medNote=function(l,total,cover){var p=override(l);if(!p)return note0.apply(this,arguments);var c=cover==null?1:cover,x=split(l,total*c,p);return ' · '+p.name+' trả ~'+mo(l,x.ins)+', bạn trả ~'+mo(l,x.own+total*(1-c)+(p.rxLocal||0));};
// Trang quyền lợi của healthsys919 ghi thêm số liệu đã cập nhật.
var dec=E.DEC.health919;if(dec&&dec.def){var text0=dec.def.text;dec.def.text=function(l){var t=typeof text0==='function'?text0.apply(this,arguments):text0||'',p=override(l);
 if(p&&p.rxLocal!=null)t+='\nCập nhật theo NHSBSA: phí kê đơn £9,90 mỗi lần; PPC 3 tháng £32,05, 12 tháng £114,50'+(p.ppc?' (bạn đang có PPC '+p.ppc+' tháng)':'')+'. Nguồn: '+NHS.source;
 if(p&&p.copayWhy)t+='\nCập nhật theo MHLW: tự trả '+Math.round((1-p.share)*100)+'% ('+p.copayWhy+'). Nguồn: '+JP.source;
 return t;};}
function ppcWhy(l){var r=X.reason(l,16);if(r!==true)return r;return rxPayer(l)?true:'Chỉ dành cho người phải trả phí kê đơn ở Anh (England)';}
X.menu('ppc880','Phiếu trả trước thuốc kê đơn (PPC)',ppcWhy,function(l){var s=st(l),k=ppcValid(l);
 return 'Mỗi lần kê đơn ở England trả £9,90. PPC 3 tháng £32,05 (đáng mua từ 4 lần kê trong 3 tháng), 12 tháng £114,50 (từ 12 lần một năm). Trong trò chơi, PPC 3 tháng dùng cho khoảng một phần tư số lần kê đơn năm trước (ít nhất 1 lần).\nNăm ngoái: '+(s.prevN||0)+' lần kê đơn. Hiện tại: '+(k?'đang có PPC '+k+' tháng':'chưa có PPC')+(s.renew?'; tự gia hạn PPC 12 tháng hằng năm':'')+'.\nNguồn: '+NHS.source;
},function(l){var s=st(l),k=ppcValid(l),p12=local('GB',NHS.ppc12),p3=local('GB',NHS.ppc3);
 return [
  {k:'p12',l:'Mua PPC 12 tháng · '+mo(l,p12),h:'Miễn phí kê đơn cả năm nay',why:k==='12'?'Đang có PPC 12 tháng':l.money>=p12?true:'Không đủ tiền',run:function(l,r,log){if(ppcValid(l)==='12'||l.money<p12)return;H.cash(l,-p12,'PPC 12 tháng (NHS)');st(l).ppc12={age:l.age};log('Mua phiếu trả trước thuốc kê đơn 12 tháng (£114,50). Các lần kê đơn năm nay không phải trả thêm.','neutral');}},
  {k:'p3',l:'Mua PPC 3 tháng · '+mo(l,p3),h:'Hợp cho một đợt điều trị ngắn',why:k?'Đang có PPC':l.money>=p3?true:'Không đủ tiền',run:function(l,r,log){if(ppcValid(l)||l.money<p3)return;H.cash(l,-p3,'PPC 3 tháng (NHS)');var n=Math.max(1,Math.ceil((st(l).prevN||0)/4));st(l).ppc3={age:l.age,left:n};log('Mua phiếu trả trước thuốc kê đơn 3 tháng (£32,05), dùng cho khoảng '+n+' lần kê đơn tới trong năm.','neutral');}},
  {k:'renew',l:(s.renew?'Tắt':'Bật')+' tự gia hạn PPC 12 tháng',h:'Trả £114,50 đầu mỗi năm khi vẫn phải trả phí kê đơn',run:function(l,r,log){var s=st(l);s.renew=!s.renew;log(s.renew?'Bật tự gia hạn PPC 12 tháng.':'Tắt tự gia hạn PPC.','neutral');}}
 ];},16,'Sức khỏe');
E.HOOKS.year.push(function(l,r,log){
 if(!l.alive||!l.flags||!l.indep)return;var s=l.flags.health880;if(!s||!s.renew||ppcValid(l)==='12')return;
 if(!rxPayer(l)){s.renew=false;log('Không còn phải trả phí kê đơn ở England: dừng tự gia hạn PPC.','neutral');return;}
 var p12=local('GB',NHS.ppc12);if(l.money<p12)return;H.cash(l,-p12,'PPC 12 tháng (NHS)');s.ppc12={age:l.age};
});
E.HEALTH880={NHS:NHS,JP:JP,override:override,rxPayer:rxPayer,ppcValid:ppcValid,jpCopay:jpCopay,split:split,state:st,local:local,verifiedAt:'2026-11-14'};
})(globalThis.G);
