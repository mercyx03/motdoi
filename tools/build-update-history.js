'use strict';
const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..');
const {playerEntry}=require('./player-update-notes');
const commits=JSON.parse(fs.readFileSync(path.join(root,'docs/update-history-commits.json'),'utf8'));
const changelog=fs.readFileSync(path.join(root,'CHANGELOG.md'),'utf8');
const version=s=>s.split('.').reduce((n,x)=>n*1000+Number(x),0);
const newestFirst=(a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt);
const sections=[...changelog.matchAll(/^## v(\d+\.\d+\.\d+)[^\n]*\n([\s\S]*?)(?=^## v|$(?![\s\S]))/gm)].map(m=>({v:version(m[1]),title:m[0].split('\n')[0].replace(/^## v[\d.]+\s*[—–-]?\s*/,''),body:m[2]}));
function clean(s){return s.replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/`|\*\*/g,'').replace(/\b[vV]?\d+\.\d+\.\d+\b/g,'').replace(/\bv\d+\.\d+\b/g,'').replace(/\(gộp\s*(?:[→+,.\s]*)\)/gi,'').replace(/\s+/g,' ').trim();}
const releases=commits.map(c=>({...c,versions:[...c.message.split('\n')[0].matchAll(/\bv?(\d+\.\d+\.\d+)\b/g)].map(m=>version(m[1]))})).filter(c=>c.versions.length&&Math.max(...c.versions)>=version('2.3.0'));
const entries=releases.map((c,i)=>{const upper=Math.max(...c.versions),lower=i+1<releases.length?Math.max(...releases[i+1].versions):version('2.3.0')-1,parts=sections.filter(s=>s.v<=upper&&s.v>lower),fallback=clean(c.message.split('\n')[0].replace(/^Một Đời\s*/,'').replace(/^Release\s*/,'').replace(/^[:—–-]+\s*/,''));
 const sectionTitle=clean(parts[0]?.title||''); const title=clean(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(sectionTitle)?fallback:(sectionTitle||fallback)).replace(/^[:—–-]+\s*/,'');
 const details=parts.flatMap(s=>s.body.split(/\r?\n/).filter(x=>/^- /.test(x)).map(x=>clean(x.slice(2)))).filter(x=>x&&!/^(Kiểm thử|Kiểm tra|Chi tiết:|Đối chiếu nguyên|Thêm kiểm thử|Nguồn |Tài liệu nội bộ)/i.test(x));
 const tags=['Tính năng'];if(/sửa|khắc phục|rà soát|chặn/i.test(title+' '+details.join(' ')))tags.push('Sửa lỗi');if(/tài khoản|đánh giá|review|thành tựu/i.test(title))tags.push('Cộng đồng');
 return{id:'git-'+c.sha.slice(0,12),publishedAt:c.publishedAt,title:title.length>110?title.slice(0,107)+'…':title,summary:details[0]||fallback,details:details.length?details:[fallback],tags:[...new Set(tags)]};});

entries.unshift({id:'community-update',publishedAt:new Date().toISOString(),title:'Góc cập nhật, cộng đồng và hành trình theo đuổi đam mê',summary:'Xem lịch sử phát triển, góp ý bằng tài khoản và biết rõ rủi ro trước khi chuyển nghề diễn viên.',tags:['Tính năng','Cộng đồng','Sửa lỗi'],details:['Thêm cảnh báo rời công việc và lương hiện tại nếu trúng vai khi chuyển sang diễn xuất; tài năng và may mắn có thể đưa bạn lên hạng A, nhưng cũng có thể dừng ở vai phụ hoặc quần chúng.','Bổ sung, sửa tên các thành tựu fandom theo danh sách người chơi cung cấp; giữ tiến độ thành tựu đã có.','Đánh giá chỉ còn số sao; giữ dữ liệu cũ và đưa nơi góp ý sang trang cập nhật.']});
entries.sort(newestFirst);
const extraPath=path.join(root,'docs/update-extra.json');
if(fs.existsSync(extraPath))entries.unshift(...JSON.parse(fs.readFileSync(extraPath,'utf8')));
// Rebuilding the page does not change the date an existing update was published.
const previousPath=path.join(root,'public/data/updates.json');
if(fs.existsSync(previousPath)){
 const previous=new Map(JSON.parse(fs.readFileSync(previousPath,'utf8')).entries.map(e=>[e.id,e.publishedAt]));
 entries.forEach(e=>{if(previous.has(e.id)&&!e.correctedAt)e.publishedAt=previous.get(e.id);});
}
entries.sort(newestFirst);
let publicEntries=entries.map(playerEntry).filter(Boolean);
// Preserve published editorial history, including entries not represented in the commit import.
// Explicit correctedAt is the existing opt-in for revising a prior entry.
if(fs.existsSync(previousPath)){
 const old=JSON.parse(fs.readFileSync(previousPath,'utf8')).entries;
 const merged=new Map(publicEntries.map(e=>[e.id,e]));
 old.forEach(e=>{const next=merged.get(e.id);if(!next||!next.correctedAt)merged.set(e.id,e);});
 publicEntries=[...merged.values()].sort(newestFirst);
}
for(const entry of publicEntries){const at=Date.parse(entry.publishedAt);if(!Number.isFinite(at)||at>Date.now())throw Error('Invalid or future update time: '+entry.id);}
fs.writeFileSync(path.join(root,'public/data/updates.json'),JSON.stringify({generatedAt:new Date().toISOString(),entries:publicEntries},null,2)+'\n');
console.log('Built '+publicEntries.length+' dated update entries; prior history and explicit version/status preserved.');
