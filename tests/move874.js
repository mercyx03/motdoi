'use strict';
// 8.10.78: giữ nhà đang vay thế chấp khi chuyển nước, theo dõi trả nợ, phát mại, bán và dọn về ở lại.
const assert=require('node:assert/strict');
const {gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,H=E.H,M=E.MOVE874;
let n=0;const ok=(c,m)=>{assert.ok(c,m);n++;};
const logs=[];const log=(t,k)=>logs.push([t,k]);
function mk(o){const l=E.createLife({mode:'world',seed:21,country:'VN',year:2000});Object.assign(l,{age:40,alive:true,money:5e6,ownHouse:true,houseVal:2e6,houseName:'Nhà riêng',mortgage:0,loans:[],props:[]},o||{});return l;}
// 1. nhà không nợ: giữ như cũ
let l=mk();ok(H.keepHome874(l,'VN')===true,'nhà hết nợ được giữ');ok(!l.ownHouse&&l.props.length===1&&!l.props[0].lien874,'thành tài sản không thế chấp');
// 2. nhà còn vay kiểu loans[type=home]
l=mk({loans:[{type:'home',name:'vay mua nhà',bal:8e5,rate:0.07,minShare:0.08,late:0,since:35,pay:1e5}]});
ok(H.keepHome874(l,'VN')==='lien','nhà còn nợ vẫn được giữ');
ok(l.props.length===1&&l.props[0].lien874&&l.props[0].residential112,'tài sản có dấu thế chấp');
ok(l.loans[0].type==='bank'&&l.loans[0].lien874===l.props[0].lien874.id,'khoản vay đổi thành vay ngân hàng và gắn với nhà');
ok(!l.ownHouse&&l.houseVal===0,'không còn nhà đang ở');
// 3. nhà nợ gần bằng giá trị thì không giữ
let l2=mk({loans:[{type:'home',name:'vay mua nhà',bal:19e5,rate:0.07,minShare:0.08,late:0}]});
ok(H.keepHome874(l2,'VN')===false&&l2.ownHouse,'vốn chủ quá mỏng thì không giữ, nhà bán theo luồng cũ');
// 4. vay dạng số cũ l.mortgage
let l3=mk({mortgage:6e5});ok(H.keepHome874(l3,'VN')==='lien'&&l3.mortgage===0&&l3.loans.length===1&&l3.loans[0].bal===6e5,'khoản mortgage cũ chuyển thành khoản vay');
// 5. trả nợ hằng năm giữ nguyên khoản vay, theo dõi trễ hạn
l.loans[0].late=2;l.loans[0].lateTot=3;M.yearly(l,()=>0.5,log);
ok(l.props[0].lien874.late===2&&l.props[0].lien874.lateTot===3,'ghi nhận trễ hạn');
// 6. trễ hạn kéo dài mà khoản vay biến mất (ngân hàng thu hồi) -> phát mại
let f=mk({loans:[{type:'home',name:'vay mua nhà',bal:8e5,rate:0.07,minShare:0.08,late:0,pay:1e5}]});H.keepHome874(f,'VN');f.props[0].lien874.late=3;f.loans=[];logs.length=0;M.yearly(f,()=>0.5,log);
ok(f.props.length===0&&logs.some(x=>/phát mại/.test(x[0])),'trễ hạn kéo dài bị phát mại');
// 7. khoản vay đã trả xong thì xóa dấu thế chấp
let g=mk({loans:[{type:'home',name:'vay mua nhà',bal:8e5,rate:0.07,minShare:0.08,late:0}]});H.keepHome874(g,'VN');g.loans=[];M.yearly(g,()=>0.5,log);
ok(g.props.length===1&&!g.props[0].lien874,'trả hết thì nhà sạch nợ');
// 8. bán nhà khi còn nợ -> tất toán bằng tiền mặt
let s=mk({loans:[{type:'home',name:'vay mua nhà',bal:8e5,rate:0.07,minShare:0.08,late:0}]});H.keepHome874(s,'VN');s.props=[];const m0=s.money;logs.length=0;M.yearly(s,()=>0.5,log);
ok(s.loans[0].bal===0&&s.money===m0-8e5&&logs.some(x=>/tất toán/.test(x[0])),'bán nhà thì tất toán khoản vay');
let s2=mk({money:1e5,loans:[{type:'home',name:'vay mua nhà',bal:8e5,rate:0.07,minShare:0.08,late:0}]});H.keepHome874(s2,'VN');s2.props=[];M.yearly(s2,()=>0.5,log);
ok(s2.loans[0].bal===7e5&&!s2.loans[0].lien874,'không đủ tiền thì trả một phần, phần còn lại vẫn là nợ thường');
// 9. dọn về ở lại: khoản vay trở lại thành vay mua nhà
let r=mk({loans:[{type:'home',name:'vay mua nhà',bal:8e5,rate:0.07,minShare:0.08,late:0}]});H.keepHome874(r,'VN');
ok(H.reoccupy874(r,'VN',log)&&r.ownHouse&&r.loans[0].type==='home'&&!r.loans[0].lien874&&r.props.length===0,'dọn về ở lại, vay trở lại thành vay mua nhà');
ok(M.homeDebt(r)===8e5,'nợ nhà tính lại đúng');
// 10. bản lưu cũ không có lien874 vẫn chạy
let o=mk();o.props=[{k:'residence112',n:'Nhà cũ',v:1e6,residential112:true,kept874:{at:30,from:'VN'},country:'VN'}];M.yearly(o,()=>0.5,log);ok(o.props.length===1,'bản lưu cũ không đổi');
// 11. chuyển nước: khoản vay (kể cả pay) được quy đổi tiền
const src=require('fs').readFileSync(require('path').join(__dirname,'..','public/js/life42.js'),'utf8');ok(/fields\(x, \['bal', 'pay'\]\)/.test(src),'quy đổi cả pay của khoản vay');
console.log('move874: '+n+' kiểm tra đạt');
