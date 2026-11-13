/* 8.10.76: liệt kê mệnh đề hồ sơ quốc gia theo mức xác minh (nguồn riêng / nguồn tổng hợp quốc tế), xuất docs/COUNTRY-VERIFY-874.md. */
'use strict';
const fs=require('fs'),path=require('path'),{gameContext}=require('../tests/hardcore-isolation');
const G=gameContext(),E=G.E,D=E.COUNTRY_DEPTH_DATA,V=E.VERIFY874;
const rows=[],per={};
for(const [cc,p] of Object.entries(D.profiles))for(const [field,arr] of Object.entries(p)){if(!Array.isArray(arr))continue;for(const r of arr){if(!r||typeof r!=='object')continue;const lv=V.level(r);rows.push({cc,field,id:r.id,name:r.name,level:lv});const q=per[cc]||(per[cc]={specific:0,general:0,none:0,fields:{}});q[lv]++;if(lv!=='specific')q.fields[field]=(q.fields[field]||0)+1;}}
const tot={specific:0,general:0,none:0};rows.forEach(r=>tot[r.level]++);
const name=cc=>(G.W.BY[cc]||{}).name||cc;
let md='# Đối chiếu hồ sơ quốc gia — mức xác minh từng mệnh đề (8.10.76)\n\nTạo bởi `node tools/audit-country-verify874.js`. Nguồn tổng hợp quốc tế (ILO, UNESCO, education-profiles.org, World Bank) chỉ xác nhận bối cảnh chung; mệnh đề dẫn tới các nguồn này cần thay bằng văn bản riêng của quốc gia (luật ngày lễ, luật hôn nhân, bộ luật lao động, cơ quan giáo dục) trước khi coi là đã đối chiếu. Trong game, các mục này được ghi “Nguồn tổng hợp quốc tế, chưa đối chiếu riêng mục này”.\n\n';
md+=`Tổng: ${rows.length} mệnh đề ở ${Object.keys(per).length} hồ sơ · nguồn riêng ${tot.specific} · nguồn tổng hợp ${tot.general} · chưa có nguồn ${tot.none}.\n\n| Mã | Quốc gia | Nguồn riêng | Nguồn tổng hợp | Trường cần đối chiếu |\n|---|---|---|---|---|\n`;
Object.keys(per).sort((a,b)=>per[b].general-per[a].general||a.localeCompare(b)).forEach(cc=>{const q=per[cc];md+=`| ${cc} | ${name(cc)} | ${q.specific} | ${q.general} | ${Object.entries(q.fields).map(([f,n])=>f+' '+n).join(', ')||'—'} |\n`;});
fs.writeFileSync(path.join(__dirname,'..','docs','COUNTRY-VERIFY-874.md'),md);
console.log(`PASS audit-country-verify874: ${rows.length} rows; specific ${tot.specific}; general ${tot.general}; none ${tot.none}; ${Object.keys(per).length} profiles`);
