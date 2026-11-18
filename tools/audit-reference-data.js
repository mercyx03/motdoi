'use strict';
// Inventory only: a keyword match is neither proof of error nor proof of factual accuracy.
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..'),rows=[];
let scanned=0;function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory()){walk(p);continue;}if(!/\.(?:js|json|html)$/i.test(p)||p.endsWith(path.join('data','updates.json')))continue;scanned++;const lines=fs.readFileSync(p,'utf8').split(/\r?\n/);let matches=[];lines.forEach((s,i)=>{if(/mô phỏng|hư cấu|chưa (?:đối chiếu|xác minh)|tham số/.test(s))matches.push(i+1);});if(matches.length)rows.push({file:path.relative(root,p).replaceAll('\\','/'),lines:matches,status:'needs-manual-review'});}}
walk(path.join(root,'public'));
const report={scope:'public .js/.json/.html; excludes historical update entries',scanned,files:rows.length,matchedLines:rows.reduce((n,r)=>n+r.lines.length,0),meaning:'Keyword inventory only; costs, future outcomes, political scenarios and actual simulator training require different treatment. Not a claim that all data are verified.',rows};
if(process.argv[2])fs.writeFileSync(path.resolve(root,process.argv[2]),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({scanned,files:report.files,matchedLines:report.matchedLines}));
