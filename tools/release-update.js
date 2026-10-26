'use strict';
/* Record the real release of a packaged update note (GĐ3 and every later phase).
   node tools/release-update.js                       -> list entries still marked packaged
   node tools/release-update.js <id> --released-at 2026-10-28T20:15:00+07:00
   node tools/release-update.js <id> --released-at <time> --correct   -> fix an already recorded time
   There is no default date: the owner supplies the time of the actual Production upload. */
const fs=require('fs'),path=require('path');
const FILES=['docs/update-extra.json','public/data/updates.json'];
const ZONED=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;
// Allow a small clock difference between the owner's machine and this one, never a planned future date.
const SKEW_MS=5*60*1000;

function read(root,file){
 const text=fs.readFileSync(path.join(root,file),'utf8');
 return {file,text,eol:text.includes('\r\n')?'\r\n':'\n',data:JSON.parse(text)};
}
function entries(doc){return Array.isArray(doc.data)?doc.data:doc.data.entries;}
function write(root,doc){fs.writeFileSync(path.join(root,doc.file),(JSON.stringify(doc.data,null,2)+'\n').replace(/\n/g,doc.eol));}

function pending(root){
 const doc=read(root,FILES[1]);
 return entries(doc).filter(e=>e.releaseStatus==='packaged').map(e=>({id:e.id,version:e.version,preparedAt:e.publishedAt,title:e.title}));
}

function release(root,id,releasedAt,opts){
 opts=opts||{};
 const now=opts.now==null?Date.now():opts.now;
 if(!id)throw Error('Thiếu ID mục nhật ký.');
 if(typeof releasedAt!=='string'||!ZONED.test(releasedAt))throw Error('Cần thời điểm phát hành thực tế dạng ISO có múi giờ, ví dụ 2026-10-28T20:15:00+07:00.');
 const at=Date.parse(releasedAt);
 if(!Number.isFinite(at))throw Error('Thời điểm phát hành không hợp lệ: '+releasedAt);
 if(at>now+SKEW_MS)throw Error('Không ghi thời điểm phát hành trong tương lai: '+releasedAt);
 const docs=FILES.map(f=>read(root,f));
 const found=docs.map(d=>entries(d).find(e=>e.id===id));
 found.forEach((e,i)=>{if(!e)throw Error('Không tìm thấy '+id+' trong '+FILES[i]);});
 for(const e of found){
  if(at<Date.parse(e.publishedAt))throw Error('Ngày phát hành sớm hơn thời điểm chuẩn bị nhật ký ('+e.publishedAt+').');
  if(e.releaseStatus==='released'&&!opts.correct)throw Error(id+' đã ghi phát hành lúc '+e.releasedAt+'; dùng --correct nếu cần sửa.');
  if(e.releaseStatus!=='packaged'&&e.releaseStatus!=='released')throw Error(id+' không phải mục có trạng thái đóng gói.');
 }
 const iso=new Date(at).toISOString(),stamp=new Date(now).toISOString();
 // correctedAt is the existing opt-in that lets tools/build-update-history.js accept a revised entry.
 found.forEach(e=>{e.releaseStatus='released';e.releasedAt=iso;e.correctedAt=stamp;});
 docs.forEach(d=>write(root,d));
 return {id,releasedAt:iso,correctedAt:stamp};
}

module.exports={pending,release,FILES};

if(require.main===module){
 const root=path.join(__dirname,'..'),args=process.argv.slice(2);
 const flag=n=>{const i=args.indexOf(n);return i<0?undefined:args[i+1];};
 const id=args.find((a,i)=>!a.startsWith('--')&&args[i-1]!=='--released-at');
 try{
  if(!id){
   const list=pending(root);
   console.log(list.length?'Mục chưa phát hành:\n'+list.map(e=>' - '+e.id+' ('+(e.version||'?')+') chuẩn bị '+e.preparedAt+' — '+e.title).join('\n'):'Không có mục nhật ký nào đang chờ phát hành.');
  }else{
   const r=release(root,id,flag('--released-at'),{correct:args.includes('--correct')});
   console.log('Đã ghi phát hành '+r.id+' lúc '+r.releasedAt+'. Chạy npm run package:cloudflare để đóng gói lại trước khi upload.');
  }
 }catch(e){console.error(e.message);process.exit(1);}
}
