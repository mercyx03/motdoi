'use strict';
// 9.0: mức tiếp cận internet theo nước làm giảm tần suất sự kiện phụ thuộc internet (access890.js, data-access890.js).
const assert=require('node:assert/strict');
const {gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,A=E.ACCESS890,D=G.ACCESS890_DATA;
let n=0;const ok=(c,m)=>{assert.ok(c,m);n++;};
function life(cc,o){const l=E.createLife({mode:cc==='VN'?'vn':'world',country:cc,seed:77,year:2026});Object.assign(l,{age:20,indep:true,school:null,alive:true,urban:true},o||{});l.fam.q=3;return l;}
// dữ liệu
ok(D&&D.net&&Object.keys(D.net).length>=185,'bảng có số liệu cho hơn 185 nước');ok(D.net.SS<10&&D.net.KR>90&&D.net.VN>50,'số liệu hợp lý theo nước');
ok(Object.values(D.net).every(v=>v>=0&&v<=100),'mọi giá trị trong 0–100%');ok(/worldbank/.test(D.source),'ghi nguồn');
ok(A.wrapped===A.IDS.length,'đã bọc toàn bộ trigger phụ thuộc internet ('+A.wrapped+')');
// hệ số: nước phổ cập không đổi, nước ít người dùng giảm mạnh, đơn điệu theo bối cảnh
{const us=life('US'),kr=life('KR'),ss=life('SS'),ug=life('UG'),vn=life('VN');
 ok(A.factor(us)===1&&A.factor(kr)===1,'nước phổ cập: không đổi');ok(A.factor(ss)<.35&&A.factor(ug)<.4,'nước dưới 10% dùng internet: giảm mạnh');
 ok(A.factor(vn)>.9,'Việt Nam (đã phổ cập khá cao): giảm rất ít hoặc không giảm');
 const young=life('UG',{age:16}),old=life('UG',{age:60});ok(A.factor(young)>A.factor(old),'người trẻ tiếp cận hơn người già');
 const urban=life('UG',{urban:true}),rural=life('UG',{urban:false});ok(A.factor(urban)>A.factor(rural),'thành thị tiếp cận hơn nông thôn');
 const rich=life('UG');rich.fam.q=5;const poor=life('UG');poor.fam.q=1;ok(A.factor(rich)>A.factor(poor),'nhà khá giả tiếp cận hơn nhà nghèo');
 ok(A.factor(poor)>0&&A.factor(poor)<1,'hệ số luôn nằm trong (0,1]');
 const none=life('US');none.country='ZZ';ok(A.factor(none)===1,'nước không có số liệu không bị giới hạn');}
// quyết định xác định (tải lại không đổi) và tỷ lệ giữ lại khớp hệ số
{const l=life('UG');const a=A.pass(l,'tiktok',20),b=A.pass(l,'tiktok',20);ok(a===b,'xác định theo đời, sự kiện và tuổi');
 let kept=0,N=2000;for(let i=0;i<N;i++){const x=life('UG');x.id='life'+i;if(A.pass(x,'tiktok',20))kept++;}
 const f=A.factor(life('UG'));ok(Math.abs(kept/N-f)<.05,'tỷ lệ giữ lại khớp hệ số ('+(kept/N).toFixed(3)+' vs '+f.toFixed(3)+')');
 let all=0;for(let i=0;i<500;i++){const x=life('US');x.id='life'+i;if(A.pass(x,'tiktok',20))all++;}ok(all===500,'nước phổ cập giữ nguyên 100%');}
// tương tác với trigger thật: sự kiện chỉ ít hơn, không bao giờ nhiều hơn so với không gating
{const t=E.TRIG.find(x=>x.id==='tiktok');ok(t&&t.access890,'trigger tiktok đã được bọc');
 let blocked=0,total=0;for(let i=0;i<400;i++){const l=life('SS',{age:14});l.id='s'+i;total++;if(!A.pass(l,'tiktok',14))blocked++;}
 ok(blocked/total>.4,'ở Nam Sudan phần lớn người trẻ không gặp sự kiện này ('+blocked+'/'+total+')');}
// sự kiện không phụ thuộc internet không bị ảnh hưởng
{const ids=E.TRIG.filter(x=>!A.IDS.includes(x.id));ok(ids.length>500&&ids.every(x=>!x.access890),'trigger khác không bị bọc');}
// chạy nhiều đời ở nước ít internet và nhiều internet: không lỗi, ít sự kiện internet hơn
{const count=(cc,seeds)=>{let c=0;for(let s=1;s<=seeds;s++){const l=E.createLife({mode:'world',country:cc,seed:9300+s,year:2026});E.runHeadless(l);ok(isFinite(l.money),'tiền hữu hạn '+cc);c+=l.log.filter(e=>/TikTok|mạng xã hội|livestream|giao hàng qua ứng dụng|freelance/i.test(e.t||'')).length;}return c;};
 const low=count('SS',70),high=count('KR',70);ok(high>=low,'nước phổ cập có không ít hơn sự kiện internet ('+high+' vs '+low+')');}
console.log('PASS access890: '+n+' checks');
