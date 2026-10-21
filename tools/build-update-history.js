'use strict';
const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..');
const {playerEntry}=require('./player-update-notes');
const commits=JSON.parse(fs.readFileSync(path.join(root,'docs/update-history-commits.json'),'utf8'));
const changelog=fs.readFileSync(path.join(root,'CHANGELOG.md'),'utf8');
const version=s=>s.split('.').reduce((n,x)=>n*1000+Number(x),0);
const sections=[...changelog.matchAll(/^## v(\d+\.\d+\.\d+)[^\n]*\n([\s\S]*?)(?=^## v|$(?![\s\S]))/gm)].map(m=>({v:version(m[1]),title:m[0].split('\n')[0].replace(/^## v[\d.]+\s*[—–-]?\s*/,''),body:m[2]}));
function clean(s){return s.replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/`|\*\*/g,'').replace(/\b[vV]?\d+\.\d+\.\d+\b/g,'').replace(/\bv\d+\.\d+\b/g,'').replace(/\(gộp\s*(?:[→+,.\s]*)\)/gi,'').replace(/\s+/g,' ').trim();}
const releases=commits.map(c=>({...c,versions:[...c.message.split('\n')[0].matchAll(/\bv?(\d+\.\d+\.\d+)\b/g)].map(m=>version(m[1]))})).filter(c=>c.versions.length&&Math.max(...c.versions)>=version('2.3.0'));
const entries=releases.map((c,i)=>{const upper=Math.max(...c.versions),lower=i+1<releases.length?Math.max(...releases[i+1].versions):version('2.3.0')-1,parts=sections.filter(s=>s.v<=upper&&s.v>lower),fallback=clean(c.message.split('\n')[0].replace(/^Một Đời\s*/,'').replace(/^Release\s*/,'').replace(/^[:—–-]+\s*/,''));
 const sectionTitle=clean(parts[0]?.title||''); const title=clean(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(sectionTitle)?fallback:(sectionTitle||fallback)).replace(/^[:—–-]+\s*/,'');
 const details=parts.flatMap(s=>s.body.split(/\r?\n/).filter(x=>/^- /.test(x)).map(x=>clean(x.slice(2)))).filter(x=>x&&!/^(Kiểm thử|Kiểm tra|Chi tiết:|Đối chiếu nguyên|Thêm kiểm thử|Nguồn |Tài liệu nội bộ)/i.test(x));
 const tags=[/Fantasy/.test(title)?'Fantasy':'Tính năng'];if(/sửa|khắc phục|rà soát|chặn/i.test(title+' '+details.join(' ')))tags.push('Sửa lỗi');if(/tài khoản|đánh giá|review|thành tựu/i.test(title))tags.push('Cộng đồng');
 return{id:'git-'+c.sha.slice(0,12),publishedAt:c.publishedAt,title:title.length>110?title.slice(0,107)+'…':title,summary:details[0]||fallback,details:details.length?details:[fallback],tags:[...new Set(tags)]};});
entries.unshift(
 {id:'spiritual-cultivation',publishedAt:'2026-10-21T10:42:07Z',title:'Linh lực theo giây và bãi farm khởi đầu',summary:'Mở Đồng Cỏ Gió ngay cảnh giới đầu; đột phá giữ nguyên linh lực dư.',tags:['Fantasy','Sửa lỗi'],details:['Chọn đường đi thẳng tới map đủ điều kiện, mở bãi farm đầu và cân lại linh thú cho nhân vật mới.','Hấp thụ linh lực theo giây thực, cảnh giới tăng tốc độ gốc; đọc sách và học công pháp cộng % hấp thụ.','Đột phá trừ đúng linh lực cần thiết, giữ toàn bộ phần dư cho tầng sau.','Giữ cảnh giới của bản lưu cũ; tạm dừng hoặc ẩn trang không cộng linh lực thời gian ẩn.']},
 {id:'fantasy-expansion',publishedAt:'2026-10-21T10:12:45Z',title:'Gọn giao diện Fantasy, học viện và NPC theo vùng',summary:'Săn linh thú không tốn lượt; thêm học viện, tâm pháp, thợ rèn và trang bị địa phương.',tags:['Fantasy','Tính năng'],details:['Gom sáu nhóm điều hướng, nhân vật và gia thế chung một nút, đưa nhật ký lên trên ở điện thoại.','Năm khóa học viện, tuyệt kỹ khi tốt nghiệp, tâm pháp và nội tại tăng chỉ số gốc; kỹ năng lên cấp 10.','NPC, cửa hàng, thuốc, thợ rèn và 80 trang bị chia theo map; chế tác/cường hóa tới +10.','Thêm 36 tình huống riêng, 40 biến thể địa phương, nhiều chuyện sơ sinh; sửa Bến Linh Tuyền và lỗi nhật ký tràn ngang.']}
);
entries.unshift({id:'community-update',publishedAt:new Date().toISOString(),title:'Góc cập nhật, cộng đồng và hành trình theo đuổi đam mê',summary:'Xem lịch sử phát triển, góp ý bằng tài khoản và biết rõ rủi ro trước khi chuyển nghề diễn viên.',tags:['Tính năng','Cộng đồng','Sửa lỗi'],details:['Thêm cảnh báo rời công việc và lương hiện tại nếu trúng vai khi chuyển sang diễn xuất; tài năng và may mắn có thể đưa bạn lên hạng A, nhưng cũng có thể dừng ở vai phụ hoặc quần chúng.','Bổ sung, sửa tên các thành tựu fandom theo danh sách người chơi cung cấp; giữ tiến độ thành tựu đã có.','Đánh giá chỉ còn số sao; giữ dữ liệu cũ và đưa nơi góp ý sang trang cập nhật.']});
entries.sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
const publicEntries=entries.map(playerEntry).filter(Boolean);
fs.writeFileSync(path.join(root,'public/data/updates.json'),JSON.stringify({generatedAt:new Date().toISOString(),entries:publicEntries},null,2)+'\n');
console.log('Built '+entries.length+' dated update entries from '+releases.length+' release commits; version labels omitted.');
