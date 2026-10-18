'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..','public'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [,f]of html.matchAll(/<script src="(js\/[^?]+)\?v=[^"]+"><\/script>/g))if(!['js/app.js','js/music.js','js/card.js'].includes(f))vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
const E=G.E,P=E.PARENTING;let n=0;const ok=(x,t)=>{assert.ok(x,t);n++;};
function life(childAge=8){const l=E.createLife({mode:'vn',seed:46001,gender:'F'});l.age=Math.max(40,childAge+22);l.indep=true;l.school=null;l.pending=[];l.money=100;l.abroad=null;l.flags={};l.kids=[{name:'An',sex:'M',born:l.age-childAge,alive:true,close:65,study:60,edu:0}];return l;}
function scene(l,k,id,auto=false){P.children(l);const pool=P.pool(l,k),idx=pool.findIndex(c=>c.id===id);assert.ok(idx>=0,'có tình huống '+id);const d=E.DEC.nd_su_kien.make(l,()=>(idx+.1)/pool.length,auto?undefined:{pid:k.parentId});assert.equal(d.data.caseId,id);return d;}
function run(l,d,key){l.pending=[d];return E.resolve(l,key);}
for(const c of P.cases){
 for(const choice of ['listen','paid','strict','later']){
  const l=life(c.id==='remote'?6:c.min),k=l.kids[0];if(c.id==='remote')k.custody='ex';const d=scene(l,k,c.id);
  ok(d.data.age>=c.min&&d.data.age<=c.max&&!/undefined|NaN/.test(d.title+d.text+JSON.stringify(d.opts)),'nội dung đúng tuổi, dữ liệu sạch: '+c.id);
  if(choice==='strict'&&c.id==='remote')continue;
  const cash=l.money,close=k.close;run(l,d,choice);
  ok(k.upbringing.count===1&&k.upbringing.seen[c.id]===l.age,'ghi nhận đúng con / tình huống: '+c.id+choice);
  ok(l.money>=0&&(choice==='paid'?l.money<cash:l.money===cash),'chỉ phương án trả tiền mới trừ tiền: '+c.id+choice);
  ok([k.close,k.study,k.upbringing.stress,k.upbringing.independence,k.upbringing.social].every(x=>Number.isFinite(x)&&x>=0&&x<=100),'chỉ số trong giới hạn');
  const after=l.money,snapshot=JSON.stringify(k);run(l,d,choice);ok(l.money===after&&JSON.stringify(k)===snapshot,'lựa chọn cũ không lặp lợi ích hoặc thu phí lại');
 }
}
{
 const l=life(8),k=l.kids[0];run(l,scene(l,k,'homework'),'listen');run(l,scene(l,k,'sharing'),'listen');ok(!P.eligible(l).length,'mỗi con tối đa hai tình huống một năm');
 l.age++;const ids=P.pool(l,k).map(c=>c.id);ok(!ids.includes('homework')&&!ids.includes('sharing'),'không lặp cùng chuyện năm kế tiếp');
}
{
 const l=life(),k=l.kids[0],d=scene(l,k,'homework');k.alive=false;l.kids.push({name:'Bình',sex:'F',born:l.age-8,alive:true,close:60,study:50});P.children(l);const before=JSON.stringify(l.kids);run(l,d,'paid');ok(JSON.stringify(l.kids)===before&&l.money===100,'con mất không tính phí hoặc áp dụng sang con khác');
}
{
 const l=life(),k=l.kids[0];l.kids.push({name:'Bình',sex:'F',born:l.age-9,alive:true,close:60,study:50});const d=E.DEC.nuoi_day_con.make(l,()=>.3);k.alive=false;const other=l.kids[1].close;run(l,d,'k0');ok(l.kids[1].close===other&&!l.pending.some(x=>x.id==='nd_su_kien'),'menu cũ không đổi người con theo vị trí mảng');
}
for(const state of ['jail','military','trapped','dead']){
 const l=life(),d=scene(l,l.kids[0],'homework'),before=l.kids[0].close;if(state==='jail')l.jailUntil=l.age+2;if(state==='military')l.flags.military=l.age+2;if(state==='trapped')l.abroad={trapped:true};if(state==='dead')l.alive=false;
 ok(!P.eligible(l).length&&!E.DEC.nd_su_kien.valid(l,d.data),'không trực tiếp chăm con sai trạng thái: '+state);run(l,d,'paid');ok(l.money===100&&l.kids[0].close===before,'cảnh cũ không gây tác động: '+state);
}
{
 const l=life(),k=l.kids[0],d=scene(l,k,'homework');k.custody='ex';ok(!E.DEC.nd_su_kien.valid(l,d.data),'đổi quyền nuôi thì cảnh ở nhà hết hiệu lực');ok(P.pool(l,k).every(c=>c.id==='remote'),'con ở với người cũ chỉ có hỗ trợ từ xa');
 const a=life();a.abroad={perm:true};P.children(a);ok(P.pool(a,a.kids[0]).every(c=>c.id==='remote'),'cha mẹ đang ở nước ngoài không đón con trực tiếp');
}
{
 const l=life(17),k=l.kids[0],d=scene(l,k,'future');l.age++;ok(!E.DEC.nd_su_kien.valid(l,d.data),'qua năm / trưởng thành không dùng lại lời khuyên tuổi 17');
 const p=life(30),k2=p.kids[0],adult=scene(p,k2,'boundaries');ok(!P.pool(p,k2).some(c=>/homework|privacy|tantrum/.test(c.id)),'con 30 tuổi không bị quản như học sinh');const logs=run(p,adult,'listen');ok(logs.some(x=>/không quyết định thay con/.test(x.t)),'tôn trọng quyền tự quyết của con trưởng thành');
}
{
 const l=life(),k=l.kids[0];l.money=0;const d=scene(l,k,'hobby');ok(!d.opts.some(o=>o.k==='paid'),'không hiện mua khóa khi thiếu tiền');run(l,d,'paid');ok(l.money===0,'không tạo tiền âm');
 const l2=life(),d2=scene(l2,l2.kids[0],'homework',true);run(l2,d2,'listen');ok(l2.flags.parentAutoAt===l2.age,'tự động chỉ một chuyện cho cả nhà trong năm');
}
{
 const l=life(20);l.kids[0].study=15;ok(!E.DEC.con_pha_gia.valid(l,{}),'học kém không suy diễn thành cờ bạc');l.kids[0].vice='game';ok(!E.DEC.con_pha_gia.valid(l,{}),'chơi game không tự thành nợ cờ bạc');l.kids[0].vice='cờ bạc';ok(E.DEC.con_pha_gia.valid(l,{}),'có cờ bạc thật mới có sự kiện nợ cờ bạc');
 l.kids[0].study=80;l.kids[0].edu=0;l.age=l.kids[0].born+18;const d=E.DEC.con_thanh_tai.make(l,()=>.3);ok(!/tiến sĩ|bác sĩ|khởi nghiệp thành công/.test(d.text),'không tự tạo bằng cấp / nghề từ điểm học');
}
{
 const l=life();P.children(l);const id=l.kids[0].parentId;l.flags.parentSerial=0;l.kids.push({name:'An',born:l.kids[0].born,alive:true});P.children(l);ok(l.kids[1].parentId!==id,'hai con trùng tên vẫn có danh tính riêng');
 const saved=JSON.parse(JSON.stringify(l));ok(P.children(saved)[0].parentId===id,'save/load giữ đúng người con');
}
{
 const l=life(14),k=l.kids[0];k.study=99;let d=E.DEC.con_hoc.make(l,()=>.1);run(l,d,'intl');ok(k.study===100,'học quốc tế không vượt 100 điểm');
 k.study=99;d=E.DEC.con_hu.make(l,()=>.1);run(l,d,'talk');ok(k.study===100,'nói chuyện với con không vượt 100 điểm');
 l.money=0;k.study=50;k.tutor=false;d=E.DEC.con_hoc.make(l,()=>.1);E.DEC.con_hoc.apply(l,d,'extra',()=>.1,()=>{});ok(l.money===0&&k.study===50&&!k.tutor,'không học thêm miễn phí hoặc tạo nợ khi thiếu tiền');
 l.age+=4;ok(!E.DEC.con_hu.valid(l,{n:k.name}),'con đã 18 tuổi không nhận cuộc gọi giáo viên phổ thông');
}
console.log('PASS: '+n+' kiểm tra nuôi dạy con bản 4.6.0 ('+P.cases.length+' tình huống).');
