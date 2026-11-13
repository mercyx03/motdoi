'use strict';
// 8.10.79: thuế thu nhập tiền lương theo nước sống (Anh, Úc, Singapore, Canada).
const assert=require('node:assert/strict');
const {gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,T=E.TAX879;
let n=0;const ok=(c,m)=>{assert.ok(c,m);n++;};const near=(a,b,m)=>ok(Math.abs(a-b)<0.01,m+' ('+a+' vs '+b+')');
ok(T&&T.RULES.GB&&T.RULES.AU&&T.RULES.SG&&T.RULES.CA,'có biểu bốn nước');
// Anh: giá trị tính tay từ biểu gov.uk
near(T.compute('GB',2026,30000).tax,3486,'Anh 30.000 bảng');
near(T.compute('GB',2026,60000).tax,11432,'Anh 60.000 bảng');
near(T.compute('GB',2026,110000).tax,33432,'Anh 110.000 bảng (miễn thuế bị giảm)');
near(T.compute('GB',2026,12000).tax,0,'Anh dưới mức miễn thuế');
// Úc: 16% đến 2025–26, 15% từ 2026–27
near((T.compute('AU',2025,45000).tax-T.compute('AU',2025,45000).levy),4288,'Úc 45.000 khớp bảng ATO (4.288)');
near((T.compute('AU',2026,45000).tax-T.compute('AU',2026,45000).levy),4020,'Úc 2026–27 (4.020)');
near((T.compute('AU',2025,190000).tax-T.compute('AU',2025,190000).levy),51638,'Úc 190.000 khớp bảng ATO (51.638)');
// Singapore: khớp ví dụ IRAS
near(T.compute('SG',2026,40000).tax,550,'Singapore 40.000');
near(T.compute('SG',2026,200000).tax,21150,'Singapore 200.000 (IRAS)');
near(T.compute('SG',2026,234100).tax,27629,'Singapore 234.100 (ví dụ IRAS)');
// Canada: ví dụ của Bộ Tài chính (60.000 thu nhập, tín dụng cơ bản)
ok(Math.abs(T.compute('CA',2026,60000).tax-6193)<1,'Canada 60.000 khớp ví dụ chính thức 6.193 (làm tròn)');
// mốc năm: trước mốc không có thuế
near(T.compute('AU',2025,75000).levy,1500,'Medicare 2% (ví dụ ATO 75.000 → 1.500)');
near(T.compute('AU',2025,29000).levy,98.9,'Medicare giảm thu nhập thấp (ví dụ ATO 29.000 → 98,9)');
ok(T.compute('AU',2025,28011).levy===0&&T.compute('GB',2025,60000).levy===0,'Medicare miễn dưới ngưỡng, nước khác không có');
ok(T.compute('AU',2020,60000)===null&&T.compute('CA',2025,60000)===null&&T.compute('GB',2010,60000)===null,'năm trước mốc giữ hành vi cũ');
ok(T.compute('DE',2026,60000)===null&&T.compute('VN',2026,60000)===null,'nước chưa có biểu không bị áp');
// đơn điệu: thu nhập cao hơn không bao giờ nộp ít hơn
for(const cc of ['GB','AU','SG','CA']){let last=-1;for(let g=0;g<=500000;g+=2500){const t=T.compute(cc,2026,g).tax;ok(t>=last-1e-9,cc+' đơn điệu ở '+g);last=t;}}
// thuế không vượt thu nhập và thuế suất bình quân dưới thuế suất biên cao nhất
for(const cc of ['GB','AU','SG','CA']){const q=T.compute(cc,2026,1e6);ok(q.tax<q.gross*0.5,cc+' thuế bình quân hợp lý');}
// quy đổi tiền địa phương hai chiều
{const l=E.createLife({mode:'world',country:'GB',seed:7,year:1990});l.gdp=G.W.BY.GB.gdp;ok(Math.abs(T.fromLocal(l,T.toLocal(l,12345))-12345)<1e-6,'đổi tiền hai chiều');}
// trong game: người làm công ở Anh có hồ sơ thuế; Việt Nam và Đức thì không
function run(cc,seed){const l=E.createLife({mode:'world',country:cc,seed:seed,year:1990});E.runHeadless(l);return l;}
let gb=0,vn=0,de=0,rows=0;for(let s=1;s<=6;s++){const a=run('GB',900+s),b=run('VN',900+s),c=run('DE',900+s);if(a.flags.tax879&&a.flags.tax879.history.length){gb++;rows+=a.flags.tax879.history.length;a.flags.tax879.history.forEach(h=>{ok(h.tax>=0&&h.tax<h.gross,'thuế nằm trong khoảng hợp lệ');ok(h.year>=2023,'chỉ từ năm có biểu');});}if(b.flags.tax879&&b.flags.tax879.history.length)vn++;if(c.flags.tax879&&c.flags.tax879.history.length)de++;}
ok(gb>=1&&rows>=1,'có người làm công ở Anh bị khấu trừ thuế trong game ('+gb+' đời, '+rows+' kỳ)');ok(vn===0&&de===0,'Việt Nam và Đức không dùng module này');
console.log('PASS tax879: '+n+' checks');
