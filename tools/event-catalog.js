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

 // Contextual previews for player-led expansion menus, including their actual follow-up data.
 if(E.UPDATE110){
  const l=E.createLife({mode:'vn',seed:111023,year:2026});Object.assign(l,{age:45,indep:true,school:null,edu:7,money:l.base*100,lang:{en:4},langExp:{},pending:[],talent:'thể thao',skill:65});
  l.flags.expansion110={research:{papers:10,rep:90,teaching:8,completed:11,title:'GS',project:{name:'Đề tài ứng dụng',duration:3,progress:3,quality:80,at:40}}};
  l.kids=[{name:'Nguyễn Minh An',sex:'M',born:23,alive:true,edu:5,close:90,job:'ke_toan'}];
  E.UPDATE110.uid(l,l.kids[0]);l.props=[{n:'Nhà ở Hà Nội',city:'Hà Nội',v:l.base*4,basis:l.base*4,y:0,residential112:true}];
  l.kids[0].gifts112=[{id:'preview-home',kind:'home',at:20,cur:l.cur,base:l.base,data:{n:'Nhà của con',city:'Đà Nẵng',v:l.base*2,residential112:true,y:0}}];
  l.flags.expansion110.bankBooks=[{id:'preview-bank',bank:'Ngân hàng An Tín',principal:l.base,at:44,due:47,term:3,rate:.047}];
  function sample(id,arg){try{const x=clone(l),D=E.DEC[id],d=D.make(x,()=>.3,arg||{});if(!D.valid||D.valid(x,d.data))capture(x,d);}catch{}}
  ['bank112','homes112','gift112','childHome112','succession112','routine113','train113','sterile113','staff113'].forEach(id=>sample(id));
  if(E.LIFE114){
   ['support114','familyTrip114','ielts114','dateFilters114','budget114'].forEach(id=>sample(id));sample('supportChild114',{kid:l.kids[0].uid110});
   l.partner={name:'Nguyễn Thanh Mai',age:40,alive:true,status:'dating',since:43};sample('breakup114');
   l.loans=[{type:'bank',name:'Vay ngân hàng',bal:l.base,rate:.08}];sample('repay114');l.loans=[];
   sample('migrate114');l.flags.life114={approved:{country:'CA',until:47}};sample('move114');
   E.startJob(l,'cong_an',()=>.5,()=>{},true);l.job.rank=10;l.flags.service107={post:{name:'Bộ trưởng Bộ Công an',at:40,track:'cong_an',rank:10}};l.flags.life114.publicRep=45;l.flags.dangVien=true;sample('leadership115');l.job=null;
  }
  sample('bankTerm112',{bank:'public'});sample('giftAsset112',{kid:l.kids[0].uid110});
  E.startJob(l,'nghien_cuu',()=>.5,()=>{},true);['research113','titles113','scienceLeader113'].forEach(id=>sample(id));
  l.partner={name:'Nguyễn Thanh Mai',alive:true,age:42,status:'married',sex:'F'};
  const person=E.LIFE113.relatives(l).find(p=>p.kind==='partner'),c=E.LIFE113.startCase(l,()=>.3,()=>{},'affair',person);
  sample('cases113');sample('case113',{id:c.id});
  E.startJob(l,'quan_doi',()=>.5,()=>{},true);l.edu=5;sample('officer111');
  l.job=null;l.age=18;l.edu=3;l.school=null;l.flags.study54={records:{math:3},wishes:[]};sample('direct111');
  l.age=17;l.school='upper';sample('contests111');
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
