'use strict';
// 9.8.8: bối cảnh theo nước và năm (birth987.js + data-birth987-*.js), sửa nội dung sai thời (tiêm chủng, bản tin giả) và lỗi “khủng bố” bị đổi chữ.
const assert=require('assert'),G=require('./hardcore-isolation').gameContext(),E=G.E,D=G.BIRTH987,B=E.BIRTH987;const {year}=require('./lib/quick');let n=0;function ok(v,m){assert(v,m);n++;}
const codes=G.W.C.map(c=>c.code);
// Dữ liệu: mọi nước, mọi năm 1900–2025 đều có giai đoạn; mô tả đầy đủ; sự kiện hợp lệ, không trùng.
codes.forEach(c=>{const r=D.ERA[c];ok(Array.isArray(r)&&r.length,'có giai đoạn: '+c);for(let y=1900;y<=2025;y++)ok(r.some(x=>y>=x[0]&&y<=x[1]),c+' phủ năm '+y);r.forEach(x=>{ok(x[0]<=x[1]&&x[0]>=1900&&x[1]<=2025,c+' khoảng năm hợp lệ '+x[0]);ok(x[2]&&x[3]&&x[3].length>=25,c+' mô tả đời sống '+x[0]);});
 const seen=new Set();(D.EV[c]||[]).forEach(e=>{ok(Number.isInteger(e[0])&&e[0]>=1900&&e[0]<=2025,c+' năm sự kiện '+e[0]);ok([1,2].includes(e[2]),c+' mức sự kiện');ok(['','joy','grief'].includes(e[3]||''),c+' sắc thái');const k=e[0]+e[1];ok(!seen.has(k),c+' không trùng '+k);seen.add(k);});});
ok(Object.values(D.EV).reduce((a,x)=>a+x.length,0)>=1000,'hơn 1000 sự kiện thật');
// Chào đời: dòng bối cảnh có ở mọi nước, nhắc đúng sự kiện năm sinh; không dùng rút ngẫu nhiên (cùng đời ra cùng chữ).
const sample=[['VN',1979,/chiến tranh biên giới phía Bắc/],['JP',1964,/Olympic Tokyo/],['US',1969,/Mặt Trăng/],['DE',1989,/Bức tường Berlin/],['ZA',1994,/bầu cử đa sắc tộc/],['AR',1986,/Maradona/]];
sample.forEach(([c,y,rx])=>{const l=E.createLife(c==='VN'?{mode:'vn',variant:'63',year:y,seed:7}:{mode:'world',country:c,year:y,seed:7});year(E,l);const t=l.log.filter(e=>e.a===0).map(e=>e.t).join('\n');ok(rx.test(t),c+' '+y+' nhắc sự kiện năm sinh');ok(l.flags.birth987&&l.flags.birth987.y===y,'lưu bối cảnh năm sinh '+c);ok((l.mem||[]).some(m=>/Năm bạn chào đời/.test(m.t)),'ký ức năm sinh '+c);
 const l2=E.createLife(c==='VN'?{mode:'vn',variant:'63',year:y,seed:7}:{mode:'world',country:c,year:y,seed:7});year(E,l2);ok(JSON.stringify(l2.log.filter(e=>/Năm \d+,|Cũng trong năm/.test(e.t)))===JSON.stringify(l.log.filter(e=>/Năm \d+,|Cũng trong năm/.test(e.t))),'tất định '+c);});
let blank=0;codes.forEach((c,i)=>{const l={birthYear:1960+(i%60),age:0,country:c,mode:'world',flags:{},alive:true};if(!B.birthText(l))blank++;});ok(blank===0,'mọi nước có dòng bối cảnh năm sinh');
// Mỗi năm: sự kiện thật của nước đang sống, một lần mỗi năm; trẻ dưới 5 tuổi chỉ nhận mốc lớn; ký ức khi đủ lớn.
{const l=E.createLife({mode:'vn',variant:'63',year:1990,seed:3});const logs=[];const log=(t,k)=>logs.push(t);B.onBirth(l,log);for(let a=1;a<=8;a++){l.age=a;B.year(l,()=>.5,log);B.year(l,()=>.5,log);}
 ok(logs.filter(t=>/gia nhập ASEAN/.test(t)).length===1,'sự kiện 1995 chỉ ghi một lần');ok(logs.some(t=>/Internet/.test(t)),'năm 1997 ghi Internet');ok((l.mem||[]).every(m=>!/Internet/.test(m.t)),'sự kiện mức 1 không thành ký ức');
 const b=E.createLife({mode:'vn',variant:'63',year:2000,seed:3});const lb=[];B.onBirth(b,t=>lb.push(t));b.age=8;B.year(b,()=>.5,t=>lb.push(t));ok((b.mem||[]).some(m=>/AFF Cup/.test(m.t)),'mốc lớn lúc 8 tuổi thành ký ức');}
// Chuyển nước: báo giai đoạn của nơi ở mới; mốc thế giới không lặp khi nước đã có sự kiện cùng chủ đề.
{const l=E.createLife({mode:'vn',variant:'63',year:1990,seed:5});const logs=[];B.onBirth(l,t=>logs.push(t));l.age=25;l.abroad={code:'JP',name:'Nhật Bản',perm:true};B.year(l,()=>.5,t=>logs.push(t));ok(logs.some(t=>/Nơi bạn đang sống, Nhật Bản/.test(t)),'báo bối cảnh nước mới');
 ok(B.worldAt(2001,'US').length===0&&B.worldAt(2001,'VN').length===1,'mốc 11/9 không lặp ở Mỹ');ok(B.worldAt(2020,'VN').length===0,'đại dịch không lặp khi đã có sự kiện trong nước');}
// Sửa sai thời: tiêm chủng mở rộng chỉ từ thập niên 1970 (Việt Nam 1985); không còn bản tin dịch, quốc tang giả.
function ageZero(o){const l=E.createLife(Object.assign({seed:21},o));year(E,l);return l.log.filter(e=>e.a===0).map(e=>e.t).join('\n');}
ok(!/tiêm chủng mở rộng/.test(ageZero({mode:'world',country:'JP',year:1960})),'không có tiêm chủng mở rộng năm 1960');ok(!/tiêm chủng mở rộng/.test(ageZero({mode:'vn',variant:'63',year:1979})),'Việt Nam 1979 chưa có tiêm chủng mở rộng toàn quốc');
let fake=0;for(let y=1950;y<=2020;y+=3){const t=ageZero({mode:'world',country:'FR',year:y});if(/quốc tang|dịch bệnh xuất hiện|dịch bệnh tiếp diễn/.test(t))fake++;}ok(fake===0,'không còn bản tin giả');
// Chữ “khủng bố”, “tuyên bố” không bị đổi khi nhà chỉ có mẹ.
{const l=E.createLife({mode:'world',country:'US',year:2001,seed:4});l.fam.fAlive=false;l.age=5;const t=E.DEC.love?null:null;const fixed=E.H.famFix?E.H.famFix(l,'Khủng bố 11/9; tổng thống tuyên bố; bố đi làm.'):null;if(fixed){ok(/Khủng bố/.test(fixed)&&/tuyên bố/.test(fixed),'giữ từ ghép có chữ bố');ok(/mẹ đi làm/.test(fixed),'vẫn đổi bố thành mẹ khi đúng nghĩa');}}
console.log('birth988: '+n+' kiểm tra đạt');
