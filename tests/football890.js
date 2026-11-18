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
// Cầu thủ đủ mạnh để thực sự được triệu tập: lịch sử trận, quốc tịch đội tuyển và luật đổi liên đoàn nhất quán qua nhiều mùa
{
 const D=E.FOOTBALL_DATA,A=E.FOOTBALL_ASSOCIATION873,pairs=[['GB','IE'],['BR','PT'],['FR','MA'],['DE','TR'],['ES','AR'],['US','MX'],['VN','FR'],['JP','BR']];
 const rng=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 let capped=0,caps=0;
 for(const [cc,alt] of pairs)for(let sd=1;sd<=3;sd++){
  const l=E.createLife({mode:cc==='VN'?'vn':'world',country:cc,seed:31000+sd*11});
  Object.assign(l,{age:25,birthYear:2001,money:100000,pending:[],sched:[],job:null,abroad:null,retired:false,indep:true});l.flags.military=0;l.st.hea=90;
  const s=F.init(l,()=>.8);D.skills.forEach(k=>s.skills[k]=90);s.potential=96;s.reputation=80;s.form=90;s.fitness=95;(l.flags.citizen=l.flags.citizen||[]).push(alt);
  const r=rng(500+sd),tag=cc+sd;
  for(let y=0;y<10;y++){l.age++;s.fitness=95;s.injury=0;
   const season={year:2027+y,club:s.club,matches:Array.from({length:10},(_,i)=>({id:'club:'+i,minutes:90,international:false})),competitions:[]};
   F.national(l,season,r,()=>{});const n=s.national,ap=n.appearances873||[];
   if(ap.length)ok(n.caps===ap.length,tag+' caps khớp lịch sử trận');
   ok(ap.every((m,i)=>!i||ap[i-1].year<=m.year),tag+' lịch sử trận theo thứ tự năm');
   ok(ap.every(m=>m.citizenships&&m.citizenships.length),tag+' mỗi trận ghi quốc tịch lúc đó');
   ok(E.GLOBAL919.citizenships(l).includes(n.country)||!!n.changed873,tag+' đội tuyển thuộc quốc tịch đang có');
   if(!n.changed873&&!n.request873&&A.reason(l,alt)===null)ok(A.request(l,alt),tag+' reason=null thì request được chấp nhận');
  }
  if(s.national.caps>0){capped++;caps+=s.national.caps;}
 }
 ok(capped>=20&&caps>=100,'đã kiểm '+capped+' cầu thủ có caps ('+caps+' lần khoác áo)');
}
console.log('PASS football890: '+n+' checks');
