'use strict';
// 8.10.77: hồ sơ quốc gia đã đối chiếu văn bản chính thức và tuổi kết hôn theo nơi sống/thời kỳ.
const assert=require('node:assert/strict');
const {gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,D=E.COUNTRY_DEPTH_DATA,V=E.COUNTRY_VERIFIED874,M=E.MARRY_AGE874;
let n=0;const ok=(c,m)=>{assert.ok(c,m);n++;};
ok(V&&V.applied===V.rows.length,'mọi dòng đối chiếu đều tìm thấy');
for(const x of V.rows){const row=D.profiles[x[0]][x[1]].find(r=>r.id===x[2]);
 ok(row.source===x[3]&&D.sources[x[3]],x.join(' ')+' có nguồn');
 ok(E.VERIFY874.level(row)==='specific','dòng '+x[2]+' '+x[0]+' là nguồn riêng');
 ok(E.VERIFY874.tag(row).includes('Đã đối chiếu'),'nhãn đối chiếu '+x[0]);
 ok(row.sourceGeneral874!==undefined,'giữ nguồn cũ để truy vết');}
const row=(c,f,id)=>D.profiles[c][f].find(r=>r.id===id);
ok(/16/.test(row('ID','marriage','wed1912').note)&&/2019/.test(row('ID','marriage','wed1912').note),'Indonesia có mốc trước 2019');
ok(/Đặc biệt/.test(row('SG','marriage','wed1912').note),'Singapore có giấy phép đặc biệt dưới 18');
ok(/18/.test(row('TH','marriage','wed1912').note)&&/17/.test(row('TH','marriage','wed1912').note),'Thái Lan 17→18');
// tuổi kết hôn vào gameplay
function life(cc,year,age,sex){const l=E.createLife({mode:'vn',seed:7,year:year-age});Object.assign(l,{age,sex});l.country=cc;l.abroad={code:cc,perm:true};return l;}
const t=(cc,y,s)=>M.age(life(cc,y,25,s),s);
ok(t('CN',2010,'M')===22&&t('CN',2010,'F')===20,'Trung Quốc 22/20');
ok(t('CN',1970,'M')===20,'Trung Quốc trước 1981');
ok(t('ID',2010,'F')===16&&t('ID',2021,'F')===19,'Indonesia đổi 2019');
ok(t('KR',2000,'F')===16&&t('KR',2010,'F')===18,'Hàn Quốc đổi 2008');
ok(t('JP',2015,'F')===16&&t('JP',2024,'F')===18,'Nhật đổi 2022');
ok(t('TH',2020,'F')===17&&t('TH',2026,'F')===18,'Thái Lan đổi 2025');
ok(M.age(life('FR',2020,25,'F'),'F')===null,'nước chưa đối chiếu giữ mặc định');
// legalToMarry dùng luật nơi sống
const l=life('CN',2010,21,'M');l.partner={name:'A',age:21,sex:'F',alive:true,status:'dating'};
ok(E.legalToMarry(l)===false,'nam 21 ở Trung Quốc chưa được kết hôn');
l.age=22;ok(E.legalToMarry(l)===true,'nam 22 đủ tuổi');
const v=life('VN',2010,19,'M');v.abroad=null;v.country='VN';v.partner={name:'B',age:19,sex:'F',alive:true};
ok(E.legalToMarry(v)===false,'Việt Nam vẫn nam 20');
console.log('PASS country-verified874: '+n+' checks');
