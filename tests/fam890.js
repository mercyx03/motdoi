'use strict';
// 9.0: sổ nợ và ân oán gia đình (fam890.js) trên các cảnh anh chị em của life90.
const assert=require('node:assert/strict');
const {gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,H=E.H,F=E.FAM890,X=E.UPDATE110;
let n=0;const ok=(c,m)=>{assert.ok(c,m);n++;};
function life(o){const l=E.createLife({mode:'world',country:'US',seed:71,year:1990});
 Object.assign(l,{birthYear:1975,age:40,indep:true,school:null,alive:true,pending:[],money:l.base*30,income:l.base,record:0,loans:[]},o||{});
 l.sibList=[{n:'Mia',sex:'F',born:-3,alive:true,close:70,job:'thợ may',wed:false,kids:0,q:3},{n:'Tom',sex:'M',born:-5,alive:true,close:20,job:'thất nghiệp',wed:false,kids:0,q:2}];
 l.sibList.forEach(s=>X.uid(l,s));l.fam=Object.assign({},l.fam,{q:4,mAlive:true,fAlive:true,mAge:70,fAge:72});return l;}
function pay(l,i,key,roll){const d=E.DEC.fd_anh_em_no.make(l,()=>.5,{});d.data={i,why:'cờ bạc bóng đá',v:l.base*.6};
 const logs=[];E.DEC.fd_anh_em_no.def.opts.find(o=>o.k===key).run(l,()=>roll,t=>logs.push(t),d.data);
 // gọi apply để đi qua lớp bọc của fam890 (apply tự gọi run)
 return {d,logs};}
function applyTra(l,i,roll){const d=E.DEC.fd_anh_em_no.make(l,()=>.5,{});d.data={i,why:'x',v:l.base*.6};const logs=[];
 E.DEC.fd_anh_em_no.apply(l,d,'tra',()=>roll,t=>logs.push(t));return {d,logs};}
function year(l,roll){const logs=[];F.yearly(l,()=>roll,t=>logs.push(t),l.age);return logs;}
// trả nợ giúp → ghi nợ; người tu chí (quan hệ tăng) và người lỡ hẹn (quan hệ giảm) được phân biệt
{const l=life();const m0=l.money;applyTra(l,0,.1);const q=F.open(l);ok(q.length===1&&q[0].name==='Mia','có một khoản nợ ghi sổ');
 ok(Math.abs(m0-l.money-l.base*.6)<1e-6,'đã trả nợ giúp đúng số tiền');ok(q[0].reformed===true,'người tu chí được ghi nhận');ok(q[0].bal===q[0].amount,'chưa thu hồi gì');}
{const l=life();applyTra(l,1,.9);const q=F.open(l);ok(q.length===1&&q[0].reformed===false,'người lỡ lại nợ được ghi nhận là chưa tu chí');}
// chọn không trả giúp thì không có sổ nợ; không ghi trùng
{const l=life();const d=E.DEC.fd_anh_em_no.make(l,()=>.5,{});d.data={i:0,why:'x',v:l.base};E.DEC.fd_anh_em_no.apply(l,d,'mac_ke',()=>.5,()=>{});ok(F.open(l).length===0,'từ chối thì không có nợ');
 const l2=life();applyTra(l2,0,.1);l2.flags.fdNo=undefined;applyTra(l2,0,.1);ok(F.open(l2).length===1,'không ghi trùng cùng một người');}
// xác suất trả phụ thuộc hoàn cảnh, không theo giàu nghèo đơn thuần
{const l=life();applyTra(l,0,.1);applyTra(life(),0,.1);const d=F.open(l)[0],mia=l.sibList[0],tom=l.sibList[1];
 const base=F.chance(l,d,mia);ok(F.chance(l,{...d,reformed:false},mia)<base,'chưa tu chí khó trả hơn');ok(F.chance(l,{...d,misses:3},mia)<base,'lỡ hẹn nhiều lần khó trả hơn');
 ok(F.chance(l,d,tom)<base,'quan hệ xấu và thất nghiệp khó trả hơn');
 const rich={...mia,q:5},poor={...mia,q:1};ok(F.chance(l,d,rich)>F.chance(l,d,poor),'kinh tế khá hơn dễ trả hơn nhưng chỉ là một yếu tố');
 ok(F.chance(l,d,{...tom,close:90,q:1})>F.chance(l,d,{...tom,close:5,q:5}),'quan hệ tốt thắng giàu nhưng thờ ơ');}
// trả theo đợt qua nhiều năm đến hết nợ, tiền vào tay bạn đúng số
{const l=life();applyTra(l,0,.1);const d=F.open(l)[0],m0=l.money;let years=0;while(F.open(l).length&&years<12){l.age++;year(l,.0);years++;}
 ok(d.status==='closed'&&d.result==='paid','trả hết nợ theo đợt');ok(Math.abs(l.money-m0-d.amount)<1e-6,'thu về đúng số nợ');ok(years>=4,'phải mất nhiều năm, không trả một lần ('+years+')');
 ok(l.sibList[0].close>70,'trả nợ đều làm quan hệ tốt lên');}
// trễ hạn: mở cảnh xử lý, bốn lựa chọn đều hoạt động
function overdue(){const l=life();applyTra(l,1,.9);let y=0;while(!l.pending.some(p=>p.id==='fam890_settle')&&y<10){l.age++;year(l,.99);y++;}return l;}
{const l=overdue();const d=F.open(l)[0];ok(d.status==='settle'&&l.pending.some(p=>p.id==='fam890_settle'),'trễ lâu thì mở cảnh xử lý');ok(d.misses>=3||l.age-d.since>=6,'đủ điều kiện mở');
 const dec=l.pending.find(p=>p.id==='fam890_settle');ok(E.DEC.fam890_settle.valid(l,dec.data)===true,'cảnh hợp lệ');
 const keys=E.DEC.fam890_settle.def.opts.map(o=>o.k);ok(['forgive','extend','sue','offset'].every(k=>keys.includes(k)),'đủ bốn lựa chọn');}
{const l=overdue(),d=F.open(l)[0],id=d.id,c0=l.sibList[1].close;E.DEC.fam890_settle.def.opts.find(o=>o.k==='forgive').run(l,()=>.5,()=>{},{id});
 ok(d.status==='closed'&&d.result==='forgiven'&&l.sibList[1].close===c0+10,'bỏ qua nợ: đóng sổ, quan hệ tốt lên');}
{const l=overdue(),d=F.open(l)[0],m0=l.money;E.DEC.fam890_settle.def.opts.find(o=>o.k==='extend').run(l,()=>.5,()=>{},{id:d.id});ok(d.status==='open'&&d.ext===1&&d.misses===0&&l.money===m0,'gia hạn: mở lại, đếm lần gia hạn');
 for(let i=0;i<3;i++){d.status='settle';E.DEC.fam890_settle.def.opts.find(o=>o.k==='extend').run(l,()=>.5,()=>{},{id:d.id});}
 ok(d.ext===2&&E.DEC.fam890_settle.def.opts.find(o=>o.k==='extend').req(l,{id:d.id})===false,'chỉ gia hạn tối đa hai lần');}
{const l=overdue(),d=F.open(l)[0],m0=l.money,c0=l.sibList[1].close;E.DEC.fam890_settle.def.opts.find(o=>o.k==='sue').run(l,()=>.01,()=>{},{id:d.id});
 ok(d.status==='closed'&&d.result==='sued-won'&&l.money>m0-l.base*.1&&l.sibList[1].close<c0,'kiện thắng: thu một phần, mất quan hệ');
 const l2=overdue(),d2=F.open(l2)[0],m2=l2.money;E.DEC.fam890_settle.def.opts.find(o=>o.k==='sue').run(l2,()=>.99,()=>{},{id:d2.id});ok(d2.result==='sued-lost'&&Math.abs(m2-l2.money-l2.base*.1)<1e-6,'kiện thua: chỉ mất án phí');}
// người vay qua đời: xóa nợ, không đi vào di sản
{const l=life();applyTra(l,0,.1);l.sibList[0].alive=false;l.age++;const logs=year(l,.0);const d=l.flags.fam890.debts[0];ok(d.status==='closed'&&d.result==='deceased'&&/qua đời/.test(logs.join()),'người vay qua đời thì đóng sổ');}
// liên kết với kiện di sản: di chúc rõ ràng giảm nguy cơ; đòi chia trước và nợ cũ đi vào cảnh
{const l=life();l.flags.inherit=true;l.fam.mAlive=false;l.fam.fAlive=false;const v=E.DEC.fd_kien_di_san.valid;
 ok(v(l,{i:0})===true&&v(l,{i:1})===true,'không có di chúc: kiện được phép với cả hai anh chị em');
 l.flags.fdTranh='di_chuc';ok(v(l,{i:0})===false,'có di chúc rõ ràng, quan hệ tốt: không kiện');ok(v(l,{i:1})===true,'có di chúc nhưng quan hệ đã xấu: vẫn có thể kiện');}
{const l=life();applyTra(l,1,.9);l.flags.fdTranh='doi';l.fam.mAlive=false;l.fam.fAlive=false;l.flags.inherit=true;const d=E.DEC.fd_kien_di_san.make(l,()=>.5,{});d.data.i=1;
 const t=E.DEC.fd_kien_di_san.def.text(l,d.data);ok(/còn nợ bạn/.test(t)&&/đòi chia trước/.test(t),'cảnh kiện nhắc nợ cũ và việc từng đòi chia trước');}
// bù trừ nợ trong thỏa thuận di sản khi đã chọn "trừ vào di sản"
{const l=life();applyTra(l,1,.9);const q=F.open(l)[0];q.offset=true;l.fam.mAlive=false;l.fam.fAlive=false;l.flags.inherit=true;
 const d=E.DEC.fd_kien_di_san.make(l,()=>.5,{});d.data.i=1;d.data.v=l.base*2;const m0=l.money;E.DEC.fd_kien_di_san.apply(l,d,'nhuong',()=>.5,()=>{});
 const back=Math.min(q.amount,l.base*2*.3);ok(q.paid>0&&l.money-m0>-l.base*2*.3+back-1e-6,'nợ được bù trừ khi nhường phần di sản');}
// bản lưu, đổi nước, bản lưu cũ
{const l=life();applyTra(l,0,.1);const o=JSON.parse(JSON.stringify(l));ok(F.open(o).length===1&&F.open(o)[0].sib===F.open(l)[0].sib,'sổ nợ giữ qua bản lưu');
 const bal=F.open(l)[0].bal;E.abroadConvert(l,2);ok(Math.abs(F.open(l)[0].bal-bal*2)<1e-6,'quy đổi tiền khi đổi nước');
 const old=life();ok(F.open(old).length===0&&year(old,.5)!==undefined,'bản lưu cũ không có sổ vẫn chạy');}
// chạy nhiều đời: không lỗi, sổ nợ luôn nhất quán
{let withDebt=0,closed=0;for(let s=1;s<=20;s++){const l=E.createLife({mode:'world',country:s%2?'US':'VN',seed:7700+s,year:1985});E.runHeadless(l);ok(isFinite(l.money),'tiền hữu hạn');
  ((l.flags.fam890||{}).debts||[]).forEach(d=>{withDebt++;ok(d.bal>=-1e-6&&d.bal<=d.amount+1e-6&&['open','settle','closed'].includes(d.status),'sổ nợ nhất quán');if(d.status==='closed')closed++;});}
 ok(withDebt>=0,'mô phỏng 20 đời ('+withDebt+' khoản nợ, '+closed+' đã đóng)');}
console.log('PASS fam890: '+n+' checks');
