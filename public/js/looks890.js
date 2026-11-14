/* 9.0: xem trước ngoại hình trước khi quyết định tìm hiểu hoặc quay lại, và giữ đúng ngoại hình đã có.
   - Cảnh "Một người đặc biệt" (E.DEC.love) hiện điểm ngoại hình của người mới gặp ngay trong lời giới thiệu; nếu bạn chọn tìm hiểu, người đó giữ đúng điểm đã hiện.
   - Cảnh "Gặp lại người cũ" hiện ngoại hình hiện tại của người cũ; quay lại thì giữ nguyên (life80 lưu ngoại hình khi chia tay, trước đây tung lại từ đầu nên người cao điểm thành thấp điểm).
   Điểm dùng đúng công thức của life134 (partnerLooks), không thêm nguồn ngẫu nhiên mới; cùng một người cho cùng một số trước và sau khi quen. */
(function(G){'use strict';var E=G.E,L=E.LOOKS134;if(!L||!E.DEC.love)return;
function preview(l,p){
 if(p.looks134==null)p.looks134=L.partnerLooks(l,{name:p.name,since:l.age,age:p.age});
 return p.looks134;
}
var make=E.DEC.love.make;
E.DEC.love.make=function(l){
 var d=make.apply(this,arguments),p=d&&d.data&&d.data.p;
 if(!p||!p.name)return d;
 var v=preview(l,p);
 if(typeof d.text==='string'&&d.text.indexOf('Ngoại hình:')<0)d.text+=' Ngoại hình: '+L.text(v,p.sex).replace(/^ngoại hình /,'')+'.';
 return d;
};
var apply=E.DEC.love.apply;
E.DEC.love.apply=function(l,d,k){
 var before=l.partner,out=apply.apply(this,arguments),p=d&&d.data&&d.data.p;
 if(k==='yes'&&p&&p.looks134!=null&&l.partner&&l.partner!==before&&l.partner.name===p.name)l.partner.looks134=p.looks134;
 return out;
};
// Người cũ: hiện ngoại hình khi họ nhắn tin; bản ghi cũ chưa lưu thì tính đúng như lúc mới quen.
var QL=E.DEC.quay_lai_cu;
function exLooks(l,x){
 if(x.looks134==null)x.looks134=L.partnerLooks(l,{name:x.name,since:x.since,age:x.since!=null?x.since+(x.d||0):null});
 return x.looks134;
}
if(QL&&QL.def){var text0=QL.def.text;QL.def.text=function(l,d){
 var t=typeof text0==='function'?text0.apply(this,arguments):text0||'',x=((l.flags.exList)||[]).filter(function(e){return e.name===d.n;})[0];
 if(x&&t.indexOf('Ngoại hình:')<0)t+=' Ngoại hình hiện tại: '+L.text(exLooks(l,x),x.sex).replace(/^ngoại hình /,'')+'.';
 return t;};}
E.LOOKS890={preview:preview,exLooks:exLooks};
})(globalThis.G);
