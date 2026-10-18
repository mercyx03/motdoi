'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert');
const root = path.join(__dirname, '..', 'public'), html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const [, f] of html.matchAll(/<script src="(js\/[^?]+)\?v=[^"]+"><\/script>/g)) if (!['js/app.js', 'js/music.js', 'js/card.js'].includes(f)) vm.runInThisContext(fs.readFileSync(path.join(root, f), 'utf8'), { filename: f });
const E = G.E; let n = 0; const ok = (x, t) => { assert.ok(x, t); n++; }, r = () => .5;
function life(id = 'barista', age = 30) { const l = E.createLife({mode:'vn', seed:45801, gender:'M'}); l.age=age;l.school=null;l.pending=[];l.indep=true;l.retired=false;l.pensioned=false;l.si=null;l.ill=null;l.st.hea=100;l.talent=null;l.money=500;l.abroad=null;l.flags={};l.workYrs=0;l.job={id,rank:0,yrs:0,k:1,sen:1,since:age};l.yr={items:[]};return l; }
function year(l) {l.yr={items:[]};return E.careerYear(l,r,()=>{},'balance');}
const all=Object.values(E.CAR), covered=all.filter(c=>E.pensionCovered(life(c.id),c));
ok(covered.length > all.length*.6, 'đa số nghề có chế độ: '+covered.length+'/'+all.length);
for(const id of ['barista','bartender','dau_bep','tho_may','tho_sua_xe','phuc_vu','shipper','hlv_tt','coach_es','tuyen_thu_es','ky_thu','ngan_hang','cong_nhan']) {
  const l=life(id);ok(E.pensionCovered(l),'có chế độ hưu trí: '+id);year(l);ok(l.si&&l.si.yrs===1&&l.si.sum>0&&l.yr.si>0,'thực sự đóng bảo hiểm: '+id);
  const si=l.si.yrs, sum=l.si.sum;year(l);ok(l.si.yrs===si&&l.si.sum===sum,'một năm không tính hai lần: '+id);
}
for(const id of ['ve_so','xe_om','tx_cn','ban_rong','ve_chai','nong','fl_dev','fl_thiet_ke','streamer','dau_tu_es']) {
  const l=life(id);ok(!E.pensionCovered(l),'ngoại lệ không tự có hưu: '+id);year(l);ok(!l.si||!l.si.yrs,'không cộng năm đóng cho ngoại lệ: '+id);
}
{
  const l=life('bartender');l.job.rank=2;ok(E.pensionCovered(l)&&E.pensionPolicy(l).voluntary,'lên chủ quán: tự đóng BHXH tự nguyện để có lương hưu');
  const bank=life('ngan_hang');bank.job.rank=3;ok(E.pensionCovered(bank),'giám đốc chi nhánh vẫn có chế độ');
}
{
  const l=life('barista',62);l.si={yrs:14,sum:14*120,last:61};l.workYrs=14;year(l);
  ok(l.si.yrs===15&&l.retired&&l.pensioned&&l.pensionInc>0,'năm đóng thứ 15 tại năm nghỉ hưu được tính');
  ok(Math.abs(l.pensionInc-l.si.sum/15*l.pensionRate)<1e-8,'mức hưởng dùng bình quân cả năm đóng cuối');
  const pension=l.pensionInc;E.careerYear(l,r,()=>{},'balance');ok(l.pensionInc===pension&&l.si.yrs===15,'lương hưu cố định, không phát sinh năm đóng khi nghỉ');
}
{
  const l=life('ve_so',72);l.workYrs=45;year(l);ok(!l.pensioned,'45 năm làm tự do không giả thành 45 năm đóng');
  const f=life('fl_dev',62);f.si={yrs:20,sum:20*180,last:55};year(f);ok(f.pensioned&&f.pensionInc>0,'chuyển freelancer vẫn giữ quyền từ quá khứ');
  const u=life('barista',62);u.job=null;u.si={yrs:20,sum:20*120,last:58};year(u);ok(u.pensioned&&u.retired,'đang không có việc vẫn nhận hưu khi đủ điều kiện');
}
function sport(id='vdv',sub='bơi lội'){const l=life(id,24);l.talent=id==='vdv'?'thể thao':id==='tuyen_thu_es'?'game':'cờ';l.talentSub=sub;l.game='Valorant';l.skill=65;l.medals=[];l.job.rank=1;return l;}
for(const sub of Object.keys(E.SPORTS)) {
  const l=sport('vdv',sub), before=E.athletePay(l,1);l.medals.push({ev:'Olympic ('+sub+')',m:'vàng',y:l.birthYear+l.age,career:'vdv',sport:sub});
  const after=E.athletePay(l,1);ok(after>before,'lương tăng theo huy chương: '+sub);
  const once=E.sportPerformance(l).points;l.medals.push({...l.medals[0]});ok(E.sportPerformance(l).points===once,'huy chương trùng không tăng điểm: '+sub);
  const factor=l.job.sportContract;for(let i=0;i<5;i++)E.athletePay(l,1);ok(l.job.sportContract===factor,'mở hồ sơ không nhân dồn hệ số: '+sub);
}
{
  const l=sport();const cash=l.money;E.recordSportResult(l,'national','record','record');const p=E.sportPerformance(l).points;
  E.recordSportResult(l,'national','record','record');ok(E.sportPerformance(l).points===p&&l.money===cash,'kỷ lục một lần, không phát thưởng tiền lần hai');
  E.athletePay(l,1);E.sportSalary(l,120,()=>{});E.recordSportResult(l,'world','win','world');E.athletePay(l,1);
  const pay=E.sportSalary(l,110,()=>{});ok(pay>120,'thành tích mới tăng lương ngay cả khi dao động nền giảm');
  l.talentSub='golf';ok(E.sportPerformance(l).points===0,'không mang điểm môn khác sang golf');
  E.athletePay(l,1);ok(l.job.sportContract===1,'hợp đồng mới theo đúng môn');
}
{
  const e=sport('tuyen_thu_es','FPS');e.medals.push({ev:'Giải quốc tế',m:'vàng',y:e.birthYear+e.age,career:'tuyen_thu_es',sport:'Valorant'});ok(E.athletePay(e,1)>1,'esports có lương thành tích');e.game='Free Fire';ok(E.sportPerformance(e).points===0,'không chuyển thành tích Valorant sang Free Fire');
  const c=sport('ky_thu','cờ vua');E.recordSportResult(c,'world','win','world-chess');ok(E.athletePay(c,0)>1,'kỳ thủ có lương thành tích');
  for(let i=0;i<100;i++)E.recordSportResult(c,'olympic','vàng','cap'+i);ok(E.athletePay(c,0)<=3.5,'hệ số thành tích được giới hạn');
}
{
  const l=sport();E.recordSportResult(l,'world','win','test');year(l);ok(l.yr.gross>0&&l.yr.si>0&&E.profile(l).jobInfo.some(s=>/hệ số hợp đồng/.test(s)),'hồ sơ, lương gross và bảo hiểm hiển thị đồng nhất');
}
{
  const l=sport(), first=E.monthlyEst(l,'vdv',1);E.recordSportResult(l,'world','win','estimate');const next=E.monthlyEst(l,'vdv',1);
  ok(next>first&&!l.job.sportContract,'ước tính lương theo thành tích, chỉ xem không sửa hợp đồng');
}
{
  const l=sport(), d=E.DEC.tt_tran_lon.make(l,r);E.DEC.tt_tran_lon.apply(l,d,'safe',()=>.1,()=>{});
  ok(E.sportPerformance(l).points>0,'thắng với lối chơi an toàn cũng được ghi nhận thành tích');
}
console.log('PASS: '+n+' kiểm tra lương hưu / lương thể thao bản 4.5.8 ('+covered.length+'/'+all.length+' nghề có chế độ tại bậc đầu).');
