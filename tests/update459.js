'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..','public'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [,f]of html.matchAll(/<script src="(js\/[^?]+)\?v=[^"]+"><\/script>/g))if(!['js/app.js','js/music.js','js/card.js'].includes(f))vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
const E=G.E;let n=0;const ok=(x,t)=>{assert.ok(x,t);n++;};
function life(){const l=E.createLife({mode:'vn',seed:45901,gender:'F'});l.age=12;l.indep=false;l.school='lower';l.money=0;l.base=500/3;l.fam.q=5;l.fam.mAlive=l.fam.fAlive=true;l.fam.noDad=false;l.fam.mInc=l.fam.fInc=100;l.pending=[];l.yr={items:[]};return l;}
function run(l,id,k,random=()=>.5){l.pending=[E.DEC[id].make(l,random)];return E.resolve(l,k).map(e=>e.t).join(' ');}
{
 const l=life(),t=run(l,'sinh_nhat','party');
 ok(/Bố mẹ thanh toán 5 triệu/.test(t),'ghi đúng bố mẹ trả 5 triệu');
 ok(/không trừ tiền tiết kiệm/.test(t)&&l.money===0,'trẻ không bị trừ tiền hay nợ');
 ok(l.yr.familyExpenses.length===1&&Math.abs(l.yr.familyExpenses[0].amount-5)<1e-8&&l.yr.items.length===0,'tách chi gia đình khỏi chi cá nhân');
 ok(!/bạn tự chi/.test(t),'không ghi nhầm tự trả');
}
for(const who of ['mother','father','none']){
 const l=life();l.fam.mAlive=who==='mother';l.fam.fAlive=who==='father';const t=run(l,'sinh_nhat','party');
 if(who==='none')ok(!/thanh toán/.test(t)&&l.money===0&&!l.yr.familyExpenses,'không tự tạo người thân trả hộ');
 else ok(t.includes(who==='mother'?'Mẹ thanh toán':'Bố thanh toán')&&!t.includes('Bố mẹ thanh toán'),'đúng người còn sống: '+who);
}
{
 const l=life();l.fam.mInc=l.fam.fInc=0;const h=l.st.hap,t=run(l,'sinh_nhat','party');
 ok(/chưa đủ ngân sách/.test(t)&&l.money===0&&!l.yr.familyExpenses.length&&l.st.hap===h,'gia đình không tiền không tổ chức miễn phí');
}
{
 const l=life();l.indep=true;l.money=10;const t=run(l,'sinh_nhat','party');
 ok(Math.abs(l.money-5)<1e-8&&/bạn tự chi 5 triệu.*tiền riêng/.test(t),'đã tự lập thì trừ tiền riêng và ghi rõ');
 const p=life();p.fam.mAlive=p.fam.fAlive=false;p.money=10;const tx=run(p,'sinh_nhat','party');ok(Math.abs(p.money-5)<1e-8&&/tiền tiết kiệm của mình/.test(tx),'không bố mẹ thì chỉ chi khi đủ tiền riêng');
}
for(const [id,k]of [['dien_thoai_be','game'],['da_bong_vo_kinh','admit']]){
 const l=life(),t=run(l,id,k,()=>.1);ok(l.money===0&&/Bố mẹ thanh toán/.test(t)&&l.yr.familyExpenses.length===1,'tiền cha mẹ không trừ ví trẻ: '+id);
}
{
 const l=life();E.SC('audit_cost_number',{title:'Chi phí',text:'Một buổi học',opts:[{k:'yes',l:'Đồng ý',run:(l,r,log)=>{E.H.cash(l,-2,'Học thêm');log('Đăng ký khóa học 3 buổi.','good');}}]});l.money=3;
 const t=run(l,'audit_cost_number','yes');ok(l.money===3&&/bố mẹ chi 2 triệu/.test(t)&&!/tiền riêng/.test(t),'v6.9.1: trẻ dưới 15 tuổi còn bố mẹ thì bố mẹ chi, vẫn ghi rõ khoản chi và người trả');
}
console.log('PASS: '+n+' kiểm tra nguồn tiền chi tuổi thơ bản 4.5.9.');
