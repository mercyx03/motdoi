'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..','public'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [,f]of html.matchAll(/<script src="(js\/[^"?]+)\?v=[^"]+"[^>]*><\/script>/g))if(!['js/app.js','js/music.js','js/card.js','js/account.js'].includes(f))vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
const E=G.E;let n=0;function ok(x,t){assert.ok(x,t);n++;}
function life(seed=462){let l=E.createLife({mode:'vn',seed,gender:'M'});l.age=30;l.indep=true;l.school=null;l.pending=[];l.partner=null;l.flags={};l.money=100;l.abroad=null;l.fam.elite=false;return l;}
function run(l,d,k){l.pending=[d];return E.resolve(l,k);}
for(const inc of [0,NaN,-2,2,136]){const l=life();l.partner={name:'An',sex:'F',age:30,status:'married',alive:true,job:'nội trợ',inc,since:25};E.finishYear(l);ok(Math.abs(l.fin.partner-(inc>0&&Number.isFinite(inc)?E.economy114Income(l,inc*12*.55):0))<1e-8,'không tạo đóng góp từ thu nhập ảo');}
{
 const l=life();l.age=18;l.examScore=14;l.edu=3;const logs=run(l,E.DEC.uniFail.make(l),'retry');ok(l.examScore===14&&!logs.some(e=>/lần thi sau đạt/.test(e.t)),'chưa thi lại không hiện trước kết quả');ok(l.flags.retryUni===19&&l.flags.retryExamPending,'đúng lịch năm sau');
 l.pending=[];E.beginYear(l,{});ok(l.examScore===14,'mở lại năm cũ không thi trước hạn');l.pending=[];l.age=19;E.beginYear(l,{});ok(l.examScore>14&&!l.flags.retryExamPending,'chỉ có điểm khi đủ năm');const count=l.log.filter(e=>/Thi lại tốt nghiệp/.test(e.t)).length;l.pending=[];E.beginYear(l,{});ok(l.log.filter(e=>/Thi lại tốt nghiệp/.test(e.t)).length===count,'không phát lại kết quả');
}
{
 const l=life(),c=Object.values(E.CAR).find(c=>c.cat==='office'&&c.t.length>2),p={name:'An',sex:'F',alive:true,age:25,status:'married',since:20,inc:10,jobId:c.id,job:c.t[0],rankSince:30};l.partner=p;
 E.family.partnerYear(l,()=>0,()=>{},30);ok(p.job===c.t[0],'không thăng chức ngay khi mới vào nghề');const at=30+Math.max(1,c.yrs[0]||3);E.family.partnerYear(l,()=>0,()=>{},at);ok(p.job===c.t[1]&&p.rankSince===at,'đủ thâm niên mới thăng chức');E.family.partnerYear(l,()=>0,()=>{},at+1);ok(p.job===c.t[1],'không thăng liên tiếp mỗi năm');
}
for(let seed=1;seed<=120;seed++){
 const l=life(seed);l.age=20;const r=()=>G.U.rand(l),d=E.DEC.hh_bmhh.make(l,r),c=d.data,car=c.jobId&&E.CAR[c.jobId];ok(!car||(((car.edu||0)<5||c.age>=22)&&(car.cat!=='med'||c.age>=24)),'khách mời tuổi 20 không nghề cần bằng đại học/y khoa');
 E.DEC.hh_bmhh.apply(l,d,'that',()=>0,()=>{});const love=l.pending.find(x=>x.id==='love');if(love){ok(love.data.p.job===c.job&&love.data.p.jobId===c.jobId&&love.data.p.inc===c.inc,'giữ đúng nghề và thu nhập người được ghép đôi');}
}
for(const sex of ['M','F']){
 const l=life();l.sex=sex;l.edu=5;l.orient='straight';const d=E.DEC.hh_moi.make(l,()=>.5);run(l,d,'nali');let rounds=0;while(l.pending.some(d=>/^hh_nali/.test(d.id))&&rounds++<6){const d=l.pending[0];ok(d.opts.every(o=>o.l&&!/undefined|NaN/.test(o.l)),'vòng show có lựa chọn hợp lệ');E.resolve(l,d.opts[0].k);}ok(rounds>=(sex==='F'?3:1)&&rounds<=4,'show diễn ra nhiều vòng và kết thúc');
}
{
 const l=life();l.flags.dtd={win:0,picks:[{n:'An',s:'F',age:25,job:'nhân viên',inc:5},{n:'Bình',s:'F',age:25}],focus:0,bond:.1};const d=E.DEC.hh_dtd.make(l,()=>.5,{v:3});ok(/ở lại đảo/.test(d.text),'thua thì ở lại đảo');const logs=run(l,d,'a');ok(logs.some(e=>/sinh hoạt trên đảo/.test(e.t))&&!logs.some(e=>/Ở khu nghỉ dưỡng/.test(e.t)),'lời kể theo kết quả thực tế');
 const l2=life();l2.flags.nali={lead:'An',leadAge:25,leadJob:'giáo viên',score:0,left:5};const stale=E.DEC.hh_nali_m.make(l2,()=>.5,{v:1});l2.age++;ok(!E.DEC.hh_nali_m.valid(l2,stale.data),'không kéo vòng show cũ sang năm sau');
}
{
 const l=life();l.partner={name:'An',sex:'F',age:16,alive:true,status:'dating',since:30,job:'sinh viên',inc:10};const d=E.DEC.love.make(l,()=>.5);d.data.p.age=16;d.data.p.job='sinh viên';d.data.p.inc=10;d.text='Một người đặc biệt, đang là sinh viên.';l.pending=[d];const restored=E.migrate(JSON.parse(JSON.stringify(l)));ok(restored.partner.inc===0&&/học sinh/.test(restored.partner.job),'sửa hồ sơ trong bản lưu cũ');ok(/học sinh/.test(restored.pending[0].text)&&restored.pending[0].data.p.inc===0,'sửa cả cảnh đang chờ trong bản lưu');const snapshot=JSON.stringify(restored);E.migrate(restored);ok(JSON.stringify(restored)===snapshot,'migrate lặp không đổi tiền hoặc RNG');
}
{
 const l=life();l.age=44;Object.assign(l.fam,{fAlive:true,fAge:31,fJob:'làm ruộng',fRet:true,fInc:0,q:3,elite:null});let text='';E.parentYear(l,()=>.5,t=>text+=t,'f');ok(l.fam.fInc===.5&&/500k/.test(text),'nuôi dạy con không ghi đè hàm cập nhật thu nhập bố mẹ');ok(E.parentYear!==E.parentingYear,'hai cơ chế có hàm riêng');
 const d=E.DEC.concert_luu_tru.make(l,()=>.5);ok(!/undefined/.test(d.text),'concert thiếu dữ liệu không hiện undefined');const logs=run(l,d,'xem');ok(logs.every(e=>!/undefined/.test(e.t)),'nhật ký concert sạch khi thiếu tham số');
 const s=life();const offer=E.DEC.sn_loi_moi.make(s,()=>.5);E.DEC.sn_loi_moi.apply(s,offer,'accept',()=>.5,()=>{});s.pending=[];let texts=[];for(const id of ['sn_kiem_soat','sn_ban_be']){E.DEC[id].apply(s,E.DEC[id].make(s,()=>.5),'boundary',()=>.1,t=>texts.push(t));}ok(texts.length===2&&texts[0]!==texts[1],'nhật ký chu cấp nêu đúng bối cảnh để tránh câu lặp');
}
console.log('PASS: '+n+' kiểm tra rà soát bản 4.6.2.');
