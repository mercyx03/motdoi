'use strict';
// 8.10.80: lớp số liệu y tế health880.js trên healthsys919 (NHS England phí kê đơn/PPC, đồng chi trả Nhật Bản từ 70 tuổi).
const assert=require('node:assert/strict');
const {gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,W=G.W,HS=E.HEALTH919,M=E.HEALTH880;
let n=0;const ok=(c,m)=>{assert.ok(c,m);n++;};const near=(a,b,m)=>ok(Math.abs(a-b)<Math.max(1e-6,Math.abs(b)*1e-9),m+' ('+a+' vs '+b+')');
const r=()=>.5;
function gb(year,o){const l=E.createLife({mode:'world',country:'GB',seed:11,year:1990});Object.assign(l,{birthYear:year-30,age:30,indep:true,school:null,city:'London',place:'London',income:l.base,money:l.base*20,pending:[],yr:{items:[]}},o||{});return l;}
function jp(age,yen,o){const l=E.createLife({mode:'world',country:'JP',seed:12,year:1950});Object.assign(l,{birthYear:2027-age,age:age,indep:true,school:null,income:0,money:l.base*20,pending:[],yr:{items:[]}},o||{});l.income=yen/(G.CUR.CUR.JP.rate*G.CUR.priceLevel(W.BY.JP.gdp));return l;}
ok(M&&M.NHS.charge===9.9&&M.NHS.ppc3===32.05&&M.NHS.ppc12===114.5,'giá NHSBSA');
const fee=M.local('GB',9.9);
// England: phí kê đơn cố định £9,90, không tăng theo dự báo của healthsys919
{const l=gb(2030),m0=l.money,logs=[];ok(M.rxPayer(l),'người lớn ở London phải trả phí kê đơn');
 const own=E.medBill(l,l.base*.01,'Khám',t=>logs.push(t));near(own,fee,'NHS chi trả toàn bộ, chỉ trả £9,90');near(m0-l.money,fee,'trừ đúng tiền');
 ok(/^Viện phí .*NHS England.*gồm phí kê đơn £9,90/.test(logs[0]),'nhật ký ghi phí kê đơn');
 ok(E.usdToLocal(l,HS.policy(l).rxFee)>fee,'healthsys919 năm 2030 tính theo dự báo cao hơn');}
{const l=gb(2024);ok(!M.rxPayer(l)&&M.override(l)===null,'năm trước 2025 giữ tính toán cũ');}
{const l=gb(2030,{city:'Edinburgh',place:'Edinburgh'});ok(!M.rxPayer(l),'Scotland miễn phí kê đơn');}
{const l=gb(2030,{age:17,school:'thpt'});ok(!M.rxPayer(l),'16–18 đang học toàn thời gian được miễn');}
{const l=gb(2030,{age:65});ok(!M.rxPayer(l),'từ 60 tuổi được miễn');}
{const l=gb(2030);l.abroad=null;l.flags.homeVisit907=false;ok(HS.status(l)!=='visitor','cư trú');}
// PPC 12 tháng: mua qua menu, các lần kê đơn sau không thu phí
{const l=gb(2030),d=E.DEC.ppc880.make(l,r,{}),i=d.opts.findIndex(o=>/12 tháng/.test(o.l));ok(i>=0&&/£114,50/.test(d.text),'menu PPC');
 const m0=l.money;E.DEC.ppc880.def.opts[Number(d.opts[i].k)].run(l,r,()=>{},d.data);near(m0-l.money,M.local('GB',114.5),'trả £114,50');
 ok(M.ppcValid(l)==='12','PPC có hiệu lực năm nay');const m1=l.money,logs=[];E.medBill(l,l.base*.01,'Khám',t=>logs.push(t));near(m1-l.money,0,'không trả phí kê đơn');ok(/PPC 12 tháng/.test(logs[0]),'nhật ký ghi PPC');
 l.age++;ok(M.ppcValid(l)===null,'hết hạn sang năm sau');}
// PPC 3 tháng: quy thành 1/4 số lần kê đơn năm trước
{const l=gb(2030),s=M.state(l);s.prevN=8;const d=E.DEC.ppc880.make(l,r,{}),i=d.opts.findIndex(o=>/3 tháng/.test(o.l));E.DEC.ppc880.def.opts[Number(d.opts[i].k)].run(l,r,()=>{},d.data);
 ok(s.ppc3.left===2,'8 lần năm trước → 2 lần');let m=l.money;E.medBill(l,l.base*.01,'Khám',()=>{});E.medBill(l,l.base*.01,'Khám',()=>{});near(m-l.money,0,'hai lần đầu miễn');
 m=l.money;E.medBill(l,l.base*.01,'Khám',()=>{});near(m-l.money,fee,'lần thứ ba trả phí');ok(M.state(l).rx.n===3,'đếm số lần kê đơn');}
// tự gia hạn hằng năm; dừng khi không còn phải trả phí
{const l=gb(2030);M.state(l).renew=true;l.age=31;const m0=l.money;E.HOOKS.year.forEach(h=>{try{h(l,r,()=>{});}catch(e){}});ok(M.ppcValid(l)==='12','tự gia hạn');ok(m0-l.money>=M.local('GB',114.5)-1e-6,'đã trả phí gia hạn');
 const l2=gb(2030,{city:'Edinburgh',place:'Edinburgh'});M.state(l2).renew=true;const logs=[];E.HOOKS.year.forEach(h=>{try{h(l2,r,t=>logs.push(t));}catch(e){}});ok(!M.state(l2).renew&&logs.some(t=>/dừng tự gia hạn PPC/.test(t)),'chuyển sang Scotland thì dừng gia hạn');}
// trang quyền lợi của healthsys919 ghi số liệu cập nhật
{const l=gb(2030),d=E.DEC.health919.make(l,r,{});ok(/Cập nhật theo NHSBSA/.test(d.text),'trang bảo hiểm có số liệu mới');}
// Nhật Bản từ 70 tuổi
ok(M.jpCopay(jp(50,3e6))===null,'dưới 70 giữ healthsys919');
near(M.jpCopay(jp(72,2e6)).rate,.2,'70–74 trả 20%');
near(M.jpCopay(jp(72,6e6)).rate,.3,'70–74 thu nhập cao trả 30%');
near(M.jpCopay(jp(80,1.5e6)).rate,.1,'75+ thu nhập thấp trả 10%');
near(M.jpCopay(jp(80,2.5e6)).rate,.2,'75+ hộ một người từ 200 vạn yên trả 20%');
{const l=jp(80,2.5e6);l.partner={name:'X',alive:true,status:'married'};near(M.jpCopay(l).rate,.1,'hộ hai người dưới 320 vạn yên trả 10%');}
near(M.jpCopay(jp(80,5e6)).rate,.3,'75+ thu nhập ngang người đang làm trả 30%');
{const l=jp(80,1.5e6,{birthYear:2020-80});near(M.jpCopay(l).rate,.1,'trước 10/2022 không có bậc 20%');}
{const l=jp(72,2e6),bill=l.base*.1,m0=l.money,logs=[];const own=E.medBill(l,bill,'Khám',t=>logs.push(t));
 const p=M.override(l),cap=HS.policy(l).cap;ok(p.share===.8,'tỷ lệ chi trả 80%');ok(own<=bill*.2+1e-9&&own>0,'tự trả không quá 20%');near(m0-l.money,own,'trừ đúng');ok(/tự trả 20%: 70–74 tuổi/.test(logs[0]),'nhật ký ghi lý do');
 near(E.bhytShare(l),.8,'bhytShare theo lớp mới');ok(/bạn trả ~/.test(E.medNote(l,bill)),'ghi chú viện phí');}
// trẻ em phụ thuộc: gia đình lo, không trừ tiền nhân vật
{const l=gb(2030,{age:10,indep:false});const m0=l.money;ok(E.medBill(l,l.base*.01,'Khám',()=>{})===0||!M.rxPayer(l),'trẻ em không bị trừ');ok(l.money===m0,'tiền không đổi');}
// bản lưu: trạng thái PPC đi qua JSON; bản lưu cũ không có health880 vẫn chạy
{const l=gb(2030);M.state(l).ppc12={age:30};const o=JSON.parse(JSON.stringify(l));ok(M.ppcValid(o)==='12','PPC giữ qua bản lưu');
 const old=gb(2030);delete old.flags.health880;if(E.migrateExt)E.migrateExt(old);ok(E.medBill(old,old.base*.01,'Khám',()=>{})>0,'bản lưu cũ vẫn tính viện phí');}
// chạy cả đời ở Anh và Nhật không lỗi
for(let s=1;s<=4;s++)for(const cc of ['GB','JP']){const l=E.createLife({mode:'world',country:cc,seed:5100+s,year:1990});E.runHeadless(l);ok(!l.alive||l.age>0,'chạy hết đời '+cc);ok(isFinite(l.money),'tiền hữu hạn '+cc);}
console.log('PASS health880: '+n+' checks');
