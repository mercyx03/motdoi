'use strict';
// 8.10.77: nguyên nhân qua đời theo số liệu từng nước (WHO GHE qua World Bank WDI) và điện lưới tại nhà.
const assert=require('node:assert/strict');
const {gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,H=E.H,L=E.LIFECOURSE874,D=E.WDI874;
let n=0;const ok=(c,m)=>{assert.ok(c,m);n++;};
let s=1;const rng=()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};
function dist(code,age,sex,N,ctx){const m={};for(let i=0;i<N;i++){const c=L.cause(Object.assign({code,sex},ctx||{}),age,rng);m[c]=(m[c]||0)+1;}return m;}
const share=(m,re)=>Object.entries(m).filter(([k])=>re.test(k)).reduce((a,[,v])=>a+v,0)/Object.values(m).reduce((a,b)=>a+b,0);
ok(D.health.VN&&D.health.NG&&D.health.JP&&D.elec.VN,'có số liệu VN, NG, JP');
ok(Object.keys(D.health).length>=200,'trên 200 nước có số liệu y tế');
// sốt rét chỉ xuất hiện nơi có sốt rét
ok(share(dist('NG',3,'F',4000),/sốt rét/)>0.05,'trẻ nhỏ Nigeria có tử vong do sốt rét');
ok(share(dist('JP',3,'F',4000),/sốt rét/)===0,'Nhật không có sốt rét');
// chấn thương ở người trẻ: tai nạn giao thông nặng hơn ở VN so với Anh; bạo lực ở Mỹ Latinh
ok(share(dist('VN',25,'M',6000),/giao thông/)>share(dist('GB',25,'M',6000),/giao thông/)*1.5,'giao thông VN > Anh');
ok(share(dist('HN',25,'M',6000),/bạo lực/)>share(dist('JP',25,'M',6000),/bạo lực/)*5,'bạo lực Honduras > Nhật');
// bệnh truyền nhiễm chiếm phần lớn hơn ở nước thu nhập thấp
ok(share(dist('NE',40,'F',6000),/lao|HIV|tiêu chảy|sốt rét|viêm phổi|thai sản/)>share(dist('DE',40,'F',6000),/lao|HIV|tiêu chảy|sốt rét|viêm phổi|thai sản/)*3,'Niger nhiều bệnh truyền nhiễm hơn Đức');
ok(share(dist('SZ',35,'F',6000),/HIV/)>share(dist('VN',35,'F',6000),/HIV/)*5,'HIV Eswatini > VN');
ok(share(dist('DE',35,'M',4000),/thai sản/)===0,'nam không tử vong thai sản');
ok(share(dist('VN',75,'F',4000),/đột quỵ|nhồi máu|suy tim|ung thư|phổi tắc|Alzheimer|thận|tiểu đường|tuổi già/)>0.75,'người già chủ yếu bệnh không lây');
ok(share(dist('VN',10,'M',4000,{swim:true}),/đuối/)<share(dist('VN',10,'M',4000),/đuối/),'biết bơi giảm đuối nước');
ok(share(dist('US',30,'M',4000,{drugs:true}),/quá liều/)>0,'nghiện ma túy có nguy cơ quá liều');
// người thân và tương thích lời gọi cũ
ok(typeof H.deathCause(70,rng)==='string','lời gọi cũ vẫn chạy');
const l=E.createLife({mode:'world',seed:11,country:'NG',year:1990});
ok(typeof H.deathCause(2,rng,null,l,'F')==='string','người thân dùng nước gốc');
ok(H.deathCause(50,()=>0.1,'alcohol',l,'M')==='xơ gan do rượu','rượu vẫn dẫn đến xơ gan');
// nhân vật chính: bệnh đang mắc được giữ
const lv=E.createLife({mode:'vn',seed:5,year:1990});lv.ill={f:'ung thư tụy'};ok(L.forLife(lv,50,()=>0.1,()=>'x')==='ung thư tụy','bệnh đang mắc');
lv.ill=null;ok(L.forLife(lv,50,rng,()=>'x')!=='x','VN dùng số liệu nước');
const fr=E.createLife({mode:'vn',seed:5,year:1990});fr.country='ZZ';ok(L.forLife(fr,50,rng,()=>'x')==='x','nước chưa có số liệu dùng bảng cũ');
// điện
ok(L.national('VN',2023)>=99&&L.national('VN',1996)===78,'VN 1996 = 78%');
ok(L.national('VN',1985)<78&&L.national('VN',1985)>=1,'trước 1990 suy ngược có chặn');
ok(L.national('FR',1970)===100,'nước đạt 100% suốt kỳ');
ok(L.access('NG',2010,false,1)<L.access('NG',2010,true,5),'nông thôn nghèo thấp hơn thành thị giàu');
let none=0,trials=300;for(let i=0;i<trials;i++){const x=E.createLife({mode:'world',seed:100+i,country:'MW',year:2000});x.urban=false;x.fam.q=2;if(!L.setup(x,rng).home)none++;}
ok(none/trials>0.8,'nông thôn Malawi 2000 đa số chưa có điện: '+none);
let lit=0;for(let i=0;i<trials;i++){const x=E.createLife({mode:'world',seed:500+i,country:'JP',year:2000});if(L.setup(x,rng).home)lit++;}
ok(lit===trials,'Nhật luôn có điện');
// kéo điện theo năm và có ký ức
const k=E.createLife({mode:'world',seed:77,country:'KH',year:2000});k.urban=false;k.fam.q=3;k.elec874={home:false,since:null,lamp:0};k.age=8;k.school='tiểu học';const logs=[];
let years=0;while(!k.elec874.home&&years<30){L.yearly(k,rng,(t)=>logs.push(t));k.age++;years++;}
ok(k.elec874.home,'cuối cùng nhà được kéo điện sau '+years+' năm');
ok(logs.some(t=>/kéo điện/.test(t)),'có dòng nhật ký kéo điện');
ok(k.elec874.lamp===0||logs.some(t=>/đèn dầu/.test(t)),'học dưới đèn dầu khi chưa có điện');
// bản lưu cũ không có elec874 vẫn chạy
const old=E.createLife({mode:'vn',seed:9,year:1960});delete old.elec874;old.age=40;L.yearly(old,rng,()=>{});ok(old.elec874&&typeof old.elec874.home==='boolean','bản lưu cũ được bổ sung trạng thái điện');
// cả đời chạy được
const causes={};let elecLog=0;for(let i=0;i<40;i++){const z=E.createLife({mode:i%2?'vn':'world',seed:900+i});E.runHeadless(z);ok(!z.alive&&z.death&&typeof z.death.cause==='string'&&!/undefined|null/.test(z.death.cause),'cả đời hợp lệ #'+i);ok(z.elec874&&typeof z.elec874.home==='boolean','có trạng thái điện #'+i);causes[z.death.cause]=1;if(z.log.some(e=>/kéo điện/.test(e.t)))elecLog++;ok(z.log.every(e=>!/undefined|NaN/.test(e.t)),'nhật ký hợp lệ #'+i);}
ok(Object.keys(causes).length>=8,'nguyên nhân đa dạng: '+Object.keys(causes).length);
console.log('PASS lifecourse874: '+n+' checks');
