'use strict';
// 9.0: kiểm tra nhất quán mô hình bóng đá qua nhiều đời cầu thủ (tổng số liệu, hợp đồng, quốc tịch đội tuyển, mùa giải, hữu hạn).
const assert=require('node:assert/strict');
const {gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,F=E.FOOTBALL;
let n=0;const ok=(c,m)=>{assert.ok(c,m);n++;};
function mk(cc,seed){const l=E.createLife({mode:cc==='VN'?'vn':'world',country:cc,seed});Object.assign(l,{age:12,birthYear:2014,money:100000,pending:[],sched:[],job:null,abroad:null,retired:false});l.flags.military=0;l.st.hea=90;F.init(l,()=>.85);return l;}
let lives=0;
for(const cc of ['GB','BR','VN','DE','US','ES','FR','JP','KR','TH','IT']){for(let s=1;s<=4;s++){
 const l=mk(cc,12000+s);E.runHeadless(l);const p=F.peek(l);if(!p)continue;lives++;const tag=cc+s;
 const ss=p.seasons||[],t=p.totals||{};
 if(ss.length&&t.apps!==undefined){const sum=ss.reduce((a,z)=>a+(z.matches||[]).filter(m=>!m.international&&m.minutes>0).length,0);ok(t.apps===sum,tag+' tổng số trận khớp từng mùa ('+t.apps+' vs '+sum+')');}
 const years=ss.map(z=>z.year);ok(new Set(years).size===years.length,tag+' không có mùa trùng năm');
 ss.forEach(z=>ok(isFinite(z.wage||0),tag+' lương mùa hữu hạn'));
 (p.contracts||[]).forEach(c=>{ok(!(c.end!=null&&c.start!=null&&c.end<c.start),tag+' hợp đồng kết thúc sau khi bắt đầu');ok(!(c.wage<0)&&isFinite(c.wage||0),tag+' lương hợp đồng hợp lệ');});
 const nat=p.national||{},ap=nat.appearances873||[];
 if(ap.length)ok(nat.caps===ap.length,tag+' số lần khoác áo đội tuyển khớp lịch sử trận');
 ok(E.GLOBAL919.citizenships(l).includes(nat.country)||!!nat.changed873,tag+' đội tuyển thuộc quốc tịch đang có');
 ok(ap.every(m=>!(m.senior&&m.age<15)),tag+' không có trận ĐTQG khi dưới 15 tuổi');
 ok(isFinite(l.money),tag+' tiền hữu hạn');
}}
ok(lives>=40,'đã kiểm '+lives+' đời cầu thủ');
console.log('PASS football890: '+n+' checks');
