'use strict';
// 9.0: trợ cấp thất nghiệp dựa trên đóng góp ở Anh và Canada (welfare890.js) mở rộng BHTN của life3.
const assert=require('node:assert/strict');
const {gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,W=E.WELFARE890;
let n=0;const ok=(c,m)=>{assert.ok(c,m);n++;};
function life(cc,o){const l=E.createLife({mode:'world',country:cc,seed:88,year:1990});Object.assign(l,{birthYear:1990,age:36,indep:true,school:null,alive:true,pending:[],money:l.base*5,retired:false,job:null},o||{});l.si={yrs:6,sum:1,last:35,m:l.base/12*1.2};return l;}
const logs=[];const log=t=>logs.push(t);
const si=l=>({yrs:l.si.yrs,last:l.si.last,m:l.si.m});
// Anh/Canada: mất việc sau khi có đóng góp → nhận trợ cấp, đúng số tiền và thời hạn
for(const cc of ['GB','CA']){const l=life(cc),m0=l.money,b=W.settle(l,true,si(l),log);
 ok(b>0&&Math.abs(l.money-m0-b)<1e-6,cc+' nhận trợ cấp');ok(Math.abs(b-l.si.m*W.SHARE*6)<1e-6,cc+' 6 năm đóng → 6 tháng, 50% lương');
 ok(W.state(l).history.length===1&&W.state(l).history[0].cc===cc,cc+' ghi lịch sử');
 ok(W.settle(l,true,si(l),log)===0,cc+' không nhận hai lần trong cùng một năm');}
// thời hạn 3–12 tháng theo số năm đóng
{const a=life('GB');a.si.yrs=1;const b=life('GB');b.si.yrs=30;ok(Math.abs(W.settle(a,true,si(a),log)-a.si.m*W.SHARE*3)<1e-6,'ít năm đóng: tối thiểu 3 tháng');ok(Math.abs(W.settle(b,true,si(b),log)-b.si.m*W.SHARE*12)<1e-6,'nhiều năm đóng: tối đa 12 tháng');}
// điều kiện: chưa đóng bảo hiểm, không có việc trước đó, vẫn còn việc, nghỉ hưu, đóng quá lâu rồi
{const l=life('GB');l.si.yrs=0;ok(W.settle(l,true,si(l),log)===0,'chưa đóng bảo hiểm thì không có trợ cấp');}
{const l=life('GB');ok(W.settle(l,false,si(l),log)===0,'không có việc có đóng bảo hiểm trước đó');}
{const l=life('GB',{job:{id:'x'}});ok(W.settle(l,true,si(l),log)===0,'vẫn còn việc thì không nhận');}
{const l=life('GB',{retired:true});ok(W.settle(l,true,si(l),log)===0,'đã nghỉ hưu thì không nhận');}
{const l=life('GB');l.si.last=30;ok(W.settle(l,true,si(l),log)===0,'đóng góp quá lâu rồi thì không nhận');}
// năm trước mốc, nước khác, người ở nhờ không thường trú
{const l=life('GB',{birthYear:1960});ok(W.settle(l,true,si(l),log)===0,'năm trước 2026 giữ hành vi cũ');}
for(const cc of ['US','DE','AU']){const l=life(cc);ok(W.settle(l,true,si(l),log)===0,cc+' chưa có nguồn nên không áp');}
{const l=life('VN');ok(W.settle(l,true,si(l),log)===0,'Việt Nam giữ BHTN cũ, không trả hai lần');}
{const l=life('VN');l.abroad={code:'GB',name:'Anh',perm:false,until:40};ok(W.settle(l,true,si(l),log)===0,'người ở tạm bằng visa không có quyền');
 l.abroad.perm=true;ok(W.settle(l,true,si(l),log)>0,'thường trú ở Anh đã đóng bảo hiểm thì có quyền');}
// quy đổi tiền và bản lưu
{const l=life('GB');W.settle(l,true,si(l),log);const t=W.state(l).history[0].total;E.abroadConvert(l,2);ok(Math.abs(W.state(l).history[0].total-2*t)<1e-6,'quy đổi tiền khi đổi nước');
 const o=JSON.parse(JSON.stringify(l));ok(W.state(o).history.length===1,'giữ qua bản lưu');}
// chạy cả đời ở Anh/Canada: không lỗi, mọi khoản chi hợp lệ
{let paid=0;for(const cc of ['GB','CA']){for(let s=1;s<=10;s++){const l=E.createLife({mode:'world',country:cc,seed:8800+s,year:1990});E.runHeadless(l);ok(isFinite(l.money),'tiền hữu hạn');
 ((l.flags.welfare890||{}).history||[]).forEach(h=>{paid++;ok(h.total>0&&isFinite(h.total)&&h.months>=3&&h.months<=12&&h.year>=2026,'khoản trợ cấp hợp lệ');});}}
 ok(paid>=0,'mô phỏng 20 đời ('+paid+' khoản trợ cấp)');}
console.log('PASS welfare890: '+n+' checks');
