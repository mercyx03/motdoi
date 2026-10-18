/* Chạy nguyên các mục hồi quy được chỉ định, không giảm số mẫu / bỏ assertion.
   Ví dụ: node tests/regression-shard.js 0-5 hoặc 5b,6-8 */
'use strict';
const fs=require('fs'),path=require('path'),Module=require('module');
const file=path.join(__dirname,'regression.js'),source=fs.readFileSync(file,'utf8');
const sections=[...source.matchAll(/^section\('([0-9]+[a-z]?)\./gm)];
const spec=(process.argv[2]||'0-45').split(',');
function selected(id){return spec.some(s=>{if(!s.includes('-'))return s===id;const[a,b]=s.split('-').map(Number);return /^\d+$/.test(id)&&Number(id)>=a&&Number(id)<=b;});}
const header=source.slice(0,sections[0].index);
const helpers=source.slice(source.indexOf('function clone(l)'),source.indexOf("section('9."));
const sim=source.slice(source.indexOf('function sim('),source.indexOf('const vnLives'));
const footer=source.slice(source.indexOf('function isVNx('));
let body=sections.map((m,i)=>selected(m[1])?source.slice(m.index,i+1<sections.length?sections[i+1].index:source.indexOf('function isVNx(')):'').join('\n');
// Các hàm dùng chung nằm cuối mục 8; giữ chúng khi chạy độc lập các mục khác.
if(!selected('8'))body=helpers+'\n'+body;
if(!selected('5'))body=sim+'\n'+body;
if(!body.trim())throw Error('Không chọn được mục kiểm tra');
process.env.MOTDOI_TEST_NATIVE='1';
const mod=new Module(file,module);mod.filename=file;mod.paths=module.paths;
mod._compile(header+'\ntry {\n'+body+'\n} catch (error) { fail++; fails.push(error.stack); }\n'+footer,file);
