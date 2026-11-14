'use strict';
// 8.10.80: lãi tiết kiệm và lãi vay theo nước sống (bank880.js), nối với sổ tiết kiệm life112 và H.addLoan của engine.
const assert=require('node:assert/strict');
const {gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,H=E.H,B=E.BANK880;
let n=0;const ok=(c,m)=>{assert.ok(c,m);n++;};
const r=()=>.5;
function life(cc,year,o){const l=E.createLife({mode:'world',country:cc,seed:31,year:1990});Object.assign(l,{birthYear:year-30,age:30,indep:true,school:null,income:l.base,money:l.base*20,pending:[]},o||{});return l;}
ok(B&&B.DATA.GB&&B.DATA.US&&B.DATA.CA&&B.DATA.AU,'có số liệu bốn nước');
for(const cc of Object.keys(B.DATA)){const d=B.DATA[cc];ok(/^https:\/\//.test(d.source)&&d.asOf&&d.published,cc+' có nguồn và ngày');
 Object.values(d.deposit).concat(Object.values(d.loans)).forEach(v=>ok(v>0&&v<.3,cc+' lãi suất trong khoảng hợp lý'));}
// mốc năm và nước chưa có số liệu
ok(B.offers(life('US',2027)).length===1&&B.offers(life('US',2025)).length===0,'Mỹ chỉ có biểu từ năm số liệu');
ok(B.offers(life('SG',2027)).length===0&&B.offers(life('DE',2027)).length===0,'Singapore, Đức chưa có số liệu');
// menu ngân hàng: Mỹ có CD theo FDIC, Anh giữ NS&I và thêm lãi bình quân BoE
{const d=E.DEC.bank112.make(life('US',2027),r,{});ok(/FDIC National Rates/.test(d.text)&&d.opts.some(o=>/FDIC/.test(o.l)&&/1\.76%/.test(o.h)),'menu Mỹ hiện CD 1,76%');}
{const d=E.DEC.bank112.make(life('GB',2027),r,{});ok(d.opts.some(o=>/NS&I/.test(o.l))&&d.opts.some(o=>/Bank of England/.test(o.l)&&/4\.42%/.test(o.h)),'menu Anh có NS&I và tiền gửi BoE');}
{const d=E.DEC.bank112.make(life('SG',2027),r,{});ok(/Chưa có biểu lãi suất/.test(d.text),'Singapore báo chưa có biểu');}
{const l=E.createLife({mode:'vn',seed:5,year:1990});Object.assign(l,{age:30,indep:true,money:l.base*20,pending:[]});const d=E.DEC.bank112.make(l,r,{});ok(d.opts.some(o=>/Vietcombank/.test(o.l))&&!d.opts.some(o=>/FDIC|RBA/.test(o.l)),'Việt Nam giữ biểu Vietcombank');}
// mở sổ ở Úc: lãi 5,00%/năm 1 năm và 4,20% 3 năm, ghi nguồn RBA; đáo hạn trả đúng lãi đơn
{const l=life('AU',2027),d=E.DEC.bankTerm112.make(l,r,{bank:'avg880-AU'}),i=d.opts.findIndex(o=>/· 3 năm/.test(o.l));ok(i>=0,'có kỳ 3 năm');
 const m0=l.money;E.DEC.bankTerm112.def.opts[Number(d.opts[i].k)].run(l,r,()=>{},d.data);const b=l.flags.expansion110.bankBooks[0];
 ok(b&&b.rate===.042&&b.term===3&&/rba\.gov\.au/.test(b.reference866.source)&&b.reference866.currency==='AUD','sổ 3 năm lãi 4,20% nguồn RBA');
 ok(Math.abs(m0-l.money-b.principal)<1e-6,'trừ đúng tiền gốc');
 const saved=JSON.parse(JSON.stringify(b));l.age=33;const logs=[];E.HOOKS.year.forEach(h=>{try{h(l,r,(t)=>logs.push(t));}catch(e){}});
 ok(logs.some(t=>/đáo hạn/.test(t)),'sổ đáo hạn sau 3 năm');ok(saved.rate===.042,'điều khoản lưu trong bản lưu');}
// vay mới theo lãi nơi sống; vay trước mốc và loại không có số liệu giữ mức cũ
{const l=life('AU',2027);H.addLoan(l,'home',l.base*3);const L=l.loans.at(-1);ok(L.rate===.062&&L.ref880.cc==='AU'&&L.ref880.year===2027,'vay mua nhà Úc 6,2% (RBA F6)');}
{const l=life('US',2027);H.addLoan(l,'card',l.base*.2);H.addLoan(l,'home',l.base*3);H.addLoan(l,'family',l.base*.2);
 ok(l.loans[0].rate===.2119&&l.loans[1].rate===.08&&!l.loans[1].ref880&&l.loans[2].rate===0,'thẻ Mỹ 21,19%; vay nhà Mỹ và vay người thân giữ mức cũ');}
{const l=life('GB',2024);H.addLoan(l,'bank',l.base);ok(l.loans.at(-1).rate===.09&&!l.loans.at(-1).ref880,'năm trước số liệu giữ 9%');}
{const l=life('CA',2027);H.addLoan(l,'home',l.base*3);const L=l.loans.at(-1);ok(L.rate===.0619,'Canada vay nhà 6,19% niêm yết');
 l.country='US';H.addLoan(l,'bank',l.base*.5);ok(L.rate===.0619&&l.loans.at(-1).rate===.119,'chuyển nước: khoản cũ giữ lãi lúc ký, khoản mới theo nơi mới');}
// trần nợ tiêu dùng của engine vẫn áp dụng
{const l=life('US',2027);H.addLoan(l,'bank',l.base*100);ok(l.loans.at(-1).bal<=l.base*5+1e-6,'vẫn giới hạn 5 lần thu nhập cơ sở');}
// bản lưu cũ: khoản vay không có ref880 vẫn chạy qua năm
{const l=life('GB',2027);l.loans=[{type:'bank',name:'vay ngân hàng',bal:l.base,rate:.09,minShare:.12,late:0,since:20}];const o=JSON.parse(JSON.stringify(l));if(E.migrateExt)E.migrateExt(o);ok(o.loans[0].rate===.09,'bản lưu cũ giữ lãi');}
// chạy cả đời ở Mỹ và Úc: không lỗi, mọi khoản vay ghi nguồn đều đúng biểu
{let tagged=0;const add=H.addLoan;H.addLoan=function(l,type){const k=(l.loans||[]).length,o=add.apply(this,arguments),L=l.loans&&l.loans.length>k?l.loans.at(-1):null;if(L&&L.ref880){tagged++;ok(B.DATA[L.ref880.cc].loans[L.type]===L.rate&&L.ref880.year>=2026,'lãi khớp biểu');}return o;};
 try{for(let s=1;s<=10;s++)for(const cc of ['US','AU','GB','CA']){const l=E.createLife({mode:'world',country:cc,seed:4400+s,year:2000});E.runHeadless(l);ok(l.age>0,'chạy hết đời '+cc);}}finally{H.addLoan=add;}
 ok(tagged>=1,'trong game có khoản vay nhận lãi theo nước ('+tagged+')');}
console.log('PASS bank880: '+n+' checks');
