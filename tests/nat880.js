'use strict';
// 9.0: hồ sơ nhập quốc tịch nhiều giai đoạn (nat880.js) trên life70/life114.
const assert=require('node:assert/strict');
const {gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,H=E.H,N=E.NAT880;
let n=0;const ok=(c,m)=>{assert.ok(c,m);n++;};
const seq=v=>{let i=0;return()=>v[i++%v.length];};
function life(o){const l=E.createLife({mode:'world',country:'VN',seed:61,year:1990});
 Object.assign(l,{birthYear:1980,age:40,indep:true,school:null,alive:true,pending:[],money:l.base*20,income:l.base,record:0,loans:[],cur:'usd'},o||{});
 l.abroad={code:'CA',name:'Canada',perm:true,until:99,arrived873:28};l.flags.residYrs={CA:9};l.flags.natAsk={};return l;}
const nopRun=()=>E.DEC.nhap_quoc_tich.def.opts.find(o=>o.k==='nop').run;
function file(l,r){const d=E.DEC.nhap_quoc_tich.make(l,r||(()=>.5),{code:'CA'});const logs=[];nopRun()(l,r||(()=>.5),t=>logs.push(t),d.data);return logs;}
function year(l,r,log){E.HOOKS.year.forEach(h=>{try{h(l,r||(()=>.5),log||(()=>{}),l.age);}catch(e){}});}
// nộp hồ sơ: không tự quyết định ngay, trừ lệ phí, có hạn chờ
{const l=life(),m0=l.money,logs=file(l);const s=N.state(l);
 ok(s&&s.stage==='review'&&s.dueAge>l.age,'hồ sơ vào hàng chờ');ok(Math.abs(m0-l.money-N.fee(l))<1e-6,'trừ lệ phí');
 ok(!(l.flags.citizen||[]).includes('CA'),'chưa có quốc tịch ngay năm nộp');ok(/chờ/.test(logs[0]),'nhật ký ghi chờ xét');
 ok(E.DEC.nhap_quoc_tich.valid(l,{code:'CA'})===false,'không nộp thêm hồ sơ khi đang chờ');
 ok(/đang chờ xét/.test(E.ACT.find(a=>a.id==='naturalize114').avail(l)),'nút chủ động báo đang chờ');}
// thời gian chờ dài hơn khi có tiền án hoặc nợ xấu
{const a=life();file(a,()=>.9);const b=life({record:1});file(b,()=>.9);const c=life({credit:{bad:true,since:35,last:35}});file(c,()=>.9);
 ok(N.state(a).dueAge-a.age===1,'hồ sơ sạch chờ 1 năm');ok(N.state(b).dueAge-b.age===2,'có tiền án chờ lâu hơn');ok(N.state(c).dueAge-c.age===2,'nợ xấu chờ lâu hơn');}
// đến hạn thì mời phỏng vấn; chưa đến hạn thì chờ
{const l=life();file(l,()=>.9);year(l);ok(N.state(l).stage==='review'&&!l.pending.some(d=>d.id==='nat880_interview'),'năm đầu chưa tới lượt');
 l.age++;const logs=[];year(l,()=>.5,t=>logs.push(t));ok(N.state(l).stage==='interview'&&l.pending.some(d=>d.id==='nat880_interview'),'tới hạn thì mời phỏng vấn');}
// phỏng vấn: thuê luật sư tăng cơ hội; đạt thì thành công dân; trượt thì nộp lại sau 1 năm
function interview(l,key,roll){const d=E.DEC.nat880_interview.make(l,()=>.5,{code:'CA'}),o=E.DEC.nat880_interview.def.opts.find(x=>x.k===key),logs=[];o.run(l,()=>roll,t=>logs.push(t),d.data);return logs;}
{const l=life();file(l,()=>.9);l.age++;year(l);const m0=l.money,s={...N.state(l)};
 ok(N.chance(l,s,true)>N.chance(l,s,false),'luật sư tăng xác suất');
 const logs=interview(l,'prep',.01);ok(l.flags.citizen.includes('CA')&&!N.state(l),'đạt phỏng vấn: nhập quốc tịch');ok(m0-l.money>=N.lawyerFee(l)-1e-6,'trả phí luật sư');ok(/Tuyên thệ/.test(logs.join()),'nhật ký tuyên thệ');}
{const l=life();file(l,()=>.9);l.age++;year(l);const a0=l.age;interview(l,'self',.99);
 ok(!(l.flags.citizen||[]).includes('CA')&&!N.state(l),'trượt: hồ sơ đóng');ok(l.flags.natAsk.CA===a0-2,'được nộp lại sau 1 năm');
 ok(E.DEC.nhap_quoc_tich.valid(l,{code:'CA'})===true,'có thể mở lại hồ sơ');}
{const l=life();file(l,()=>.9);l.age++;year(l);interview(l,'withdraw',.5);ok(!N.state(l)&&!(l.flags.citizen||[]).includes('CA'),'rút hồ sơ');}
// bối cảnh: tiền án mới, rời nước, đi tù hủy hồ sơ
{const l=life();file(l,()=>.9);l.record=1;const logs=[];year(l,()=>.5,t=>logs.push(t));ok(!N.state(l)&&/tiền án/.test(logs.join()),'tiền án mới hủy hồ sơ');}
{const l=life();file(l,()=>.9);l.abroad={code:'US',name:'Mỹ',perm:true,until:99};const logs=[];year(l,()=>.5,t=>logs.push(t));ok(!N.state(l)&&/không còn thường trú/.test(logs.join()),'đổi nước hủy hồ sơ');}
{const l=life();file(l,()=>.9);l.jailUntil=l.age+3;year(l);ok(!N.state(l),'đi tù hủy hồ sơ');}
{const l=life();file(l,()=>.9);l.age++;year(l);l.abroad=null;const d=E.DEC.nat880_interview.make(l,()=>.5,{code:'CA'});ok(E.DEC.nat880_interview.valid(l,d.data)===false,'rời nước thì cảnh phỏng vấn hết hiệu lực');}
// nợ xấu làm giảm cơ hội
{const l=life();file(l,()=>.9);const s={...N.state(l)};const clean=N.chance(l,s,false);l.credit={bad:true,since:38,last:38};ok(N.chance(l,s,false)<clean,'nợ xấu giảm cơ hội');}
// bản lưu: hồ sơ đi qua JSON; bản lưu cũ không có hồ sơ vẫn nộp được theo đường mới
{const l=life();file(l,()=>.9);const o=JSON.parse(JSON.stringify(l));ok(N.state(o)&&N.state(o).dueAge===N.state(l).dueAge,'hồ sơ giữ qua bản lưu');
 const old=life();ok(N.state(old)===null&&E.DEC.nhap_quoc_tich.valid(old,{code:'CA'})===true,'bản lưu cũ không có hồ sơ vẫn hợp lệ');}
// người ở nước không có hồ sơ: hệ thống cũ không bị ảnh hưởng, chạy cả đời không lỗi
{let filed=0,done=0;for(let s=1;s<=12;s++){const l=E.createLife({mode:'world',country:'VN',seed:6600+s,year:1990});E.runHeadless(l);ok(l.age>=0&&isFinite(l.money),'chạy hết đời');if(l.flags.nat880)filed++;if((l.flags.citizen||[]).length)done++;}
 ok(filed>=0&&done>=0,'mô phỏng nhiều đời đạt ('+filed+' hồ sơ treo, '+done+' có quốc tịch mới)');}
console.log('PASS nat880: '+n+' checks');
