'use strict';
// 9.0: bế tắc 50/50 công ty gia đình leo thang theo năm (business890.js) trên deadlock874.
const assert=require('node:assert/strict');
const {gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,B=E.BIZ874,Z=E.BIZ890,X=E.UPDATE110;
let n=0;const ok=(c,m)=>{assert.ok(c,m);n++;};
const logs=[];const log=t=>logs.push(t);
function fam(sibs){const l=E.createLife({mode:'vn',seed:9010,year:2000});Object.assign(l,{age:30,alive:true,indep:true,school:null,edu:5,pending:[],money:5e6,jailUntil:null},{});
 Object.assign(l.fam,{fJob:'nông dân',fAlive:true,mAlive:true,q:5,fAge:60,mAge:58});
 l.sibList=sibs.map((s,i)=>({name:s,sex:'M',born:l.age-33,alive:true,edu:6}));const ids=l.sibList.map(s=>X.uid(l,s));
 const c={name:'Cty 5050',value:90000,share:50,sector:'general',roles:{},created:20,holders137:[{id:ids[0],name:sibs[0],share:50}]};
 E.BUSINESS123.companies(l).push(c);E.BUSINESS133.ensure(c);c.governance908={nominations:{},history:[]};
 B.tie(l,{company:c},'chair',50,[],{id:'self',name:'Bạn'});return {l,c,ids};}
function tick(l,y){for(let i=0;i<y;i++){l.age++;Z.yearly(l,()=>.5,log);}}
const choose=(l,c,key,roll)=>{const d=E.DEC.deadlock890.make(l,()=>.5,{cid:X.uid(l,c)});const i=d.data.keys.indexOf(key);ok(i>=0,'cảnh có lựa chọn '+key);E.DEC.deadlock890.apply(l,d,String(i),()=>roll,log);return d;};
// chưa tới hạn thì chưa có đề nghị; tới 3 năm thì có đề nghị
{const {l,c}=fam(['Anh Bình']);tick(l,2);ok(!l.pending.some(p=>p.id==='deadlock890'),'dưới 3 năm chưa có đề nghị');tick(l,1);ok(l.pending.some(p=>p.id==='deadlock890'),'đủ 3 năm: phía kia chủ động đề nghị');
 ok(B.deadlock(c)&&c.governance908.deadlock874.esc890.n===1,'bế tắc vẫn mở, đếm một lần leo thang');}
// nhượng 1%: nhận tiền, đổi quyền, hết bế tắc
{const {l,c,ids}=fam(['Anh Bình']);tick(l,3);const m0=l.money;choose(l,c,'cede',.5);
 ok(Math.abs(l.money-m0-c.value*.01*.85)<1e-6&&c.share===49&&c.holders137[0].share===51,'nhượng 1%: tiền và cổ phần đúng');
 ok(!B.deadlock(c)&&c.chair908.id===ids[0]&&c.governance908.deadlock874.how==='cede','phía kia thành Chủ tịch, hết bế tắc');
 ok(c.share+c.holders137[0].share===100,'tổng cổ phần vẫn 100%');}
// ra tòa: tốn án phí, chủ tịch độc lập, thù lao do công ty chịu
{const {l,c}=fam(['Anh Bình']);tick(l,3);const m0=l.money,cc0=c.chairCost137||0;choose(l,c,'court',.5);
 ok(Math.abs(m0-l.money-l.base*.6)<1e-6&&c.chair908.id==='independent'&&c.chairCost137>cc0&&!B.deadlock(c),'ra tòa: án phí và chủ tịch độc lập');}
// giữ nguyên: giảm quản trị; lặp lại sau 2 năm; lần thứ ba tòa tự chỉ định
{const {l,c}=fam(['Anh Bình']);c.governance=5;tick(l,3);choose(l,c,'hold',.5);ok(c.governance===4,'giữ nguyên: giảm quản trị');
 l.pending=[];tick(l,1);ok(!l.pending.some(p=>p.id==='deadlock890'),'chưa lặp lại ngay năm sau');tick(l,1);ok(l.pending.some(p=>p.id==='deadlock890'),'lặp lại sau 2 năm');
 choose(l,c,'hold',.5);l.pending=[];tick(l,2);ok(l.pending.some(p=>p.id==='deadlock890'),'lần ba vẫn đề nghị');
 choose(l,c,'hold',.5);l.pending=[];ok(B.deadlock(c),'ba lần giữ nguyên chưa bị ép ngay');const m0=l.money;tick(l,2);ok(!B.deadlock(c)&&c.governance908.deadlock874.how==='court-forced'&&l.money<m0,'sau ba lần giữ nguyên tòa tự chỉ định, mất án phí');}
// tải lại giữa tranh chấp: trạng thái đi qua JSON và vẫn leo thang đúng
{const {l,c}=fam(['Anh Bình']);tick(l,3);choose(l,c,'hold',.5);const o=JSON.parse(JSON.stringify(l));const c2=E.BUSINESS123.companies(o).find(x=>x.name==='Cty 5050');
 ok(B.deadlock(c2)&&c2.governance908.deadlock874.esc890.holds===1,'trạng thái giữ qua bản lưu');o.pending=[];tick(o,2);ok(o.pending.some(p=>p.id==='deadlock890'),'tải lại vẫn leo thang đúng lịch');}
// nhiều anh chị em: phía đề nghị là người nắm nhiều cổ phần nhất; đề nghị không dùng cho công ty không bế tắc
{const {l,c,ids}=fam(['Anh Bình','Chị Mai']);c.holders137=[{id:ids[1],name:'Chị Mai',share:20},{id:ids[0],name:'Anh Bình',share:30}];c.share=50;tick(l,3);
 const d=E.DEC.deadlock890.make(l,()=>.5,{cid:X.uid(l,c)});ok(/Anh Bình/.test(d.text)&&!/Chị Mai/.test(d.text.split('đề nghị')[0]),'người nắm nhiều cổ phần nhất đứng ra đề nghị');
 choose(l,c,'cede',.5);ok(c.holders137.find(h=>h.id===ids[0]).share===31&&c.holders137.find(h=>h.id===ids[1]).share===20&&c.chair908.id===ids[0],'chỉ phía nắm nhiều nhất nhận 1%');}
{const l=E.createLife({mode:'vn',seed:3,year:2000});Object.assign(l,{age:30,alive:true,indep:true,pending:[]});const c={name:'Không bế tắc',value:1000,share:60,roles:{},holders137:[]};E.BUSINESS123.companies(l).push(c);E.BUSINESS133.ensure(c);tick(l,5);ok(!l.pending.some(p=>p.id==='deadlock890'),'không bế tắc thì không đề nghị');}
// bế tắc tự hết khi có người nắm quá bán (cơ chế cũ) thì không còn đề nghị
{const {l,c}=fam(['Anh Bình']);c.share=60;tick(l,1);B.year&&B.year(l,()=>.5,log);tick(l,3);ok(!l.pending.some(p=>p.id==='deadlock890')||!B.deadlock(c),'khi đã có quá bán không còn leo thang');}
// công ty đã sáp nhập hoặc bị xóa thì không lỗi
{const {l,c}=fam(['Anh Bình']);tick(l,3);c.merged=true;l.pending=[];tick(l,2);ok(true,'công ty đã sáp nhập không gây lỗi');}
// chạy nhiều đời: không lỗi
for(let s=1;s<=10;s++){const l=E.createLife({mode:'vn',seed:9100+s,year:1990});E.runHeadless(l);ok(isFinite(l.money),'tiền hữu hạn');}
// lỗi đã sửa: người chơi đang giữ ghế Chủ tịch thì được gỡ ghế khi tòa hoặc phía kia lên thay
{for(const key of ['court','cede']){const {l,c}=fam(['Anh Bình']);tick(l,3);const calls=[];const orig=B.dropRole;B.dropRole=(...a)=>{calls.push(a[2]);return orig(...a);};
 choose(l,c,key,.5);B.dropRole=orig;ok(calls.includes('chair'),key+': gỡ vai trò Chủ tịch của người chơi');}}
console.log('PASS business890: '+n+' checks');
