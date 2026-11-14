'use strict';
// 9.0: ngoại hình người yêu: xem trước khi quen, giữ nguyên khi chia tay rồi quay lại (looks890.js, life80.js, life134.js).
const assert=require('node:assert/strict');
const {gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,L=E.LOOKS134;
let n=0;const ok=(c,m)=>{assert.ok(c,m);n++;};
function life(seed){const l=E.createLife({mode:'world',country:'US',seed,year:2000});Object.assign(l,{age:25,partner:null,pending:[],alive:true,indep:true,school:null});return l;}
const yearHook=(l,a)=>E.EXES80.year(l,()=>.5,()=>{},a==null?l.age:a);
// xem trước: lời giới thiệu có ngoại hình, và người đó giữ đúng điểm khi bắt đầu hẹn hò
for(let s=1;s<=40;s++){const l=life(s),d=E.DEC.love.make(l,()=>.3,{}),p=d.data.p;
 ok(/Ngoại hình: \d+\/100 · /.test(d.text),'giới thiệu có ngoại hình');ok(p.looks134>=0&&p.looks134<=100,'điểm hợp lệ');
 const shown=Number(/Ngoại hình: (\d+)\/100/.exec(d.text)[1]);ok(shown===Math.round(p.looks134),'số hiện ra khớp điểm lưu');
 E.DEC.love.apply(l,d,'yes',()=>.3,()=>{});ok(l.partner&&l.partner.looks134===p.looks134,'người yêu giữ đúng điểm đã xem trước');
 ok(Math.round(L.partnerLooks(l,l.partner))===shown,'công thức life134 trả đúng số đã xem');}
// chọn "chỉ làm bạn": không có người yêu, không đổi gì khác
{const l=life(3),d=E.DEC.love.make(l,()=>.3,{});E.DEC.love.apply(l,d,'no',()=>.3,()=>{});ok(!l.partner,'chỉ làm bạn thì không có người yêu');}
// xem trước hiện cùng một số khi tạo lại cùng người (xác định)
{const a=life(7),b=life(7);const da=E.DEC.love.make(a,()=>.3,{}),db=E.DEC.love.make(b,()=>.3,{});ok(da.text===db.text,'cùng đời, cùng số ngẫu nhiên → cùng lời giới thiệu');}
// chia tay rồi quay lại: giữ đúng ngoại hình (lỗi được báo)
let reunions=0;
for(let s=1;s<=60;s++){const l=life(100+s);l.age=25;const d=E.DEC.love.make(l,()=>.3,{});E.DEC.love.apply(l,d,'yes',()=>.3,()=>{});
 l.partner.looks134=[20,35,50,65,80,95][s%6]; // phủ cả điểm cao và thấp
 const before=l.partner.looks134,name=l.partner.name;yearHook(l);
 l.age=28;l.partner=null;yearHook(l); // chia tay
 const ex=(l.flags.exList||[]).find(x=>x.name===name);ok(ex&&ex.looks134===before,'bản ghi người cũ giữ ngoại hình ('+before+')');
 l.age=32;const q=E.DEC.quay_lai_cu;ok(q.valid(l,{n:name}),'có thể quay lại');const dd=q.make(l,()=>.1,{});
 ok(/Ngoại hình hiện tại: /.test(q.def.text(l,{n:name,kids:[],word:'người yêu cũ'})),'cảnh gặp lại hiện ngoại hình');
 q.apply(l,{data:{n:name,word:'người yêu cũ',kids:[]},id:'quay_lai_cu'},'quay_lai',()=>.01,()=>{});
 if(l.partner&&l.partner.name===name){reunions++;ok(l.partner.looks134===before,'quay lại giữ đúng ngoại hình '+before+' (không tung lại)');ok(Math.abs(L.partnerLooks(l,l.partner)-before)<=0,'life134 không tính lại');}}
ok(reunions>=40,'đã kiểm '+reunions+' lần quay lại');
// bản lưu cũ: bản ghi người cũ chưa có ngoại hình thì tính đúng như lúc mới quen, và quay lại giữ số đó
{const l=life(9);const name='Cũ Test';l.flags.exList=[{name,sex:'F',d:1,married:false,since:20,until:24,inc:100,job:'x',uid:'u:1'}];
 const expected=L.partnerLooks(l,{name,since:20,age:20+1});l.age=30;
 const q=E.DEC.quay_lai_cu;q.apply(l,{data:{n:name,word:'người yêu cũ',kids:[]},id:'quay_lai_cu'},'quay_lai',()=>.01,()=>{});
 ok(l.partner&&l.partner.looks134===expected,'bản lưu cũ: tính đúng như lúc mới quen ('+expected+')');}
// bản lưu: ngoại hình qua JSON
{const l=life(11);const d=E.DEC.love.make(l,()=>.3,{});E.DEC.love.apply(l,d,'yes',()=>.3,()=>{});yearHook(l);const o=JSON.parse(JSON.stringify(l));ok(o.flags.lastP.looks134===l.partner.looks134&&o.partner.looks134===l.partner.looks134,'ngoại hình giữ qua bản lưu');}
// chạy nhiều đời: mọi người yêu có ngoại hình hợp lệ, quay lại không đổi
for(let s=1;s<=12;s++){const l=E.createLife({mode:'world',country:'US',seed:7400+s,year:1995});E.runHeadless(l);ok(isFinite(l.money),'tiền hữu hạn');
 if(l.partner&&l.partner.looks134!=null)ok(l.partner.looks134>=0&&l.partner.looks134<=100,'điểm trong 0–100');
 (l.flags.exList||[]).forEach(x=>{if(x.looks134!=null)ok(x.looks134>=0&&x.looks134<=100,'điểm người cũ hợp lệ');});}
console.log('PASS looks890: '+n+' checks');
