'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
module.exports=function(pub,files){
 const c={console,Math,Date,JSON,Buffer,TextEncoder,TextDecoder};c.globalThis=c;vm.createContext(c);
 for(const f of files){if(f==='js/scene.js')break;vm.runInContext(fs.readFileSync(path.join(pub,f),'utf8'),c,{filename:f});}
 const E=c.G.E,rows=[],examples=new Map(),contexts=[];
 const clone=x=>JSON.parse(JSON.stringify(x));
 const clean=s=>String(s||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
 function readable(s){return s&&s.length>8&&!/undefined|NaN|\[object|function\s*\(/.test(s);}
 function context(l){return l.age+' tuổi · '+(l.difficulty==='hardcore'?'Hardcore':'Thường')+' · '+(l.abroad?.name||l.countryName)+' · '+(l.job?E.jobTitle(l):l.school?'Đang đi học':'Chưa có công việc');}
 function capture(l,d){
  if(!d||examples.has(d.id)||!readable(clean(d.text)))return;
  const choices=[];
  for(const o of d.opts||[]){
   const x=clone(l),logs=[],before=x.money,stats={...x.st};
   try{x.pending=[clone(d)];const at=x.log.length;E.resolve(x,o.k);logs.push(...x.log.slice(at).map(e=>clean(e.t)));
    const deltas=[];for(const [k,n]of Object.entries({hea:'Sức khỏe',hap:'Hạnh phúc',kno:'Kiến thức',soc:'Quan hệ'})){const delta=Math.round(((x.st[k]||0)-(stats[k]||0))*10)/10;if(delta)deltas.push(n+' '+(delta>0?'+':'')+delta);}
    if(Math.abs(x.money-before)>.01)deltas.push('Tiền '+E.fmtMoney(x,x.money-before));
    const follow=x.pending?.[0];if(follow&&follow.id!==d.id)logs.push('Tiếp theo: '+clean(follow.title)+' — '+clean(follow.text));
    choices.push({label:clean(o.l),hint:clean(o.h),result:logs.filter(readable).slice(0,4),changes:deltas});
   }catch{choices.push({label:clean(o.l),hint:clean(o.h),result:[],changes:[]});}
  }
  examples.set(d.id,{title:clean(d.title)||d.id,text:clean(d.text),context:context(l),choices});
 }
 for(let i=0;i<36;i++){
  const l=E.createLife({mode:i%3?'vn':'world',country:['US','JP','DE','IN'][i%4],variant:i%2?'34':'63',difficulty:i%2?'hardcore':'normal',seed:91000+i,year:2026});
  let guard=0;
  while(l.alive&&guard++<115){
   E.beginYear(l,{auto:true});
   let n=0;while(l.pending.length&&l.alive&&n++<64){capture(l,l.pending[0]);E.resolve(l,E.autoKey(l));}
   if(l.alive)E.finishYear(l);
   n=0;while(l.pending.length&&l.alive&&n++<64){capture(l,l.pending[0]);E.resolve(l,E.autoKey(l));}
   if(l.age%8===0&&contexts.length<240)contexts.push(clone(l));
   E.endYear(l);
  }
 }
 // Additional valid contexts cover manual actions that autoplay never selects.
 for(const [id,d]of Object.entries(E.DEC)){
  if(examples.has(id))continue;
  for(const original of contexts){
   try{const l=clone(original);if(d.valid&&!d.valid(l,{}))continue;const made=d.make(l,E.H.rf?E.H.rf(l):()=>.5,{});capture(l,made);if(examples.has(id))break;}catch{}
  }
 }
 function passages(value){
  const out=[],seen=new Set();
  function scan(v){if(typeof v==='string'){const t=clean(v);if(readable(t)&&/[À-ỹ]/.test(t))out.push(t);}
   else if(typeof v==='function'){for(const m of String(v).matchAll(/(['"])((?:\\.|(?!\1)[^\\\r\n])*)\1/g)){const t=clean(m[2].replace(/\\['"]/g,x=>x[1]));if(readable(t)&&/[À-ỹ]/.test(t)&&!/[{};]/.test(t))out.push(t);}}
   else if(v&&typeof v==='object'&&!seen.has(v)){seen.add(v);Object.values(v).forEach(scan);}}
  scan(value);return [...new Set(out)].slice(0,18);
 }
 for(const [id,d]of Object.entries(E.DEC)){
  const sample=examples.get(id),texts=passages(d.def||d);
  rows.push({id,type:'Lựa chọn',title:sample?.title||(typeof d.def?.title==='string'?d.def.title:texts[0]?.slice(0,85))||'Tình huống theo hoàn cảnh',data:sample?{...sample,note:'Một kết quả mô phỏng; tên người, lựa chọn mở và hậu quả thay đổi theo nhân vật, hoàn cảnh và vận may.'}:{text:texts.join('\n\n')||'Tình huống tiếp nối cần dữ liệu từ lựa chọn trước.',choices:[],context:'Chưa có ví dụ đầy đủ phù hợp.',note:'Trích lời kể gốc. Chưa thể minh họa toàn bộ tình huống này; không phải kết quả của một lượt chơi.'}});
 }
 function add(list,type,prefix){list.forEach((e,i)=>{const texts=passages(e);rows.push({id:prefix+i,type,title:texts[0]?.slice(0,85)||type+' theo hoàn cảnh',data:{text:texts.join('\n\n')||'Diễn biến được tính theo trạng thái nhân vật và các mối quan hệ.',context:'Các lời kể có thể xuất hiện trong nhiều hoàn cảnh khác nhau.',choices:[],note:'Các đoạn dưới đây là lời kể gốc có thể xuất hiện, không nhất thiết diễn ra đồng thời hoặc theo thứ tự này.'}});});}
 add(E.EVENTS,'Biến cố','event-');add(E.LINES,'Lời kể','line-');add(E.HOOKS.year,'Hằng năm','year-');
 return rows;
};
