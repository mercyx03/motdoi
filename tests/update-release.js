/* Release status of player update notes (GĐ3 onward). Pure local files: no network, no D1. */
'use strict';
const assert=require('assert'),fs=require('fs'),os=require('os'),path=require('path'),vm=require('vm');
const root=path.join(__dirname,'..');
const {release,pending,FILES}=require('../tools/release-update');
let checks=0;const ok=(c,m)=>{assert(c,m);checks++;};
const load=(dir,f)=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));
const list=d=>Array.isArray(d)?d:d.entries;
const STATUS_TEXT=/chưa phát hành|chưa phải ngày ra mắt|đang được chuẩn bị|đã phát hành/i;

// 1. Current data: every status field is consistent and the note text never carries the status.
const pub=load(root,FILES[1]),extra=load(root,FILES[0]);
for(const e of pub.entries){
 if(e.releaseStatus==null){ok(e.releasedAt===undefined,e.id+': legacy entry has no release fields');continue;}
 ok(['packaged','released'].includes(e.releaseStatus),e.id+': known status');
 ok(typeof e.version==='string'&&e.version.length>0,e.id+': status entries carry a version');
 if(e.releaseStatus==='packaged')ok(e.releasedAt===null,e.id+': packaged has no release date');
 else{const at=Date.parse(e.releasedAt);ok(Number.isFinite(at)&&at<=Date.now()+5*60e3&&at>=Date.parse(e.publishedAt),e.id+': real release date');ok(!!e.correctedAt,e.id+': release recorded as explicit correction');}
 ok(![e.title,e.summary].concat(e.details).some(s=>STATUS_TEXT.test(s)),e.id+': status shown by the page, not baked into the note');
 const x=extra.find(y=>y.id===e.id);
 if(x)for(const k of ['version','releaseStatus','releasedAt','publishedAt','title'])ok(JSON.stringify(x[k])===JSON.stringify(e[k]),e.id+': '+k+' matches docs/update-extra.json');
}
ok(new Set(pub.entries.map(e=>e.id)).size===pub.entries.length,'unique IDs');

// 2. Release tool on a scratch copy: refuses guesses, records only an explicit past time with a zone.
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'motdoi-release-'));
try{
 for(const f of FILES){fs.mkdirSync(path.dirname(path.join(tmp,f)),{recursive:true});fs.copyFileSync(path.join(root,f),path.join(tmp,f));}
 const before=FILES.map(f=>fs.readFileSync(path.join(tmp,f),'utf8'));
 const target=pending(tmp)[0];
 if(target){
  const prepared=Date.parse(target.preparedAt),now=prepared+86400e3;
  const bad=[[undefined,'missing'],['2026-10-28','no time'],['2026-10-28T20:00:00','no zone'],[new Date(now+3600e3).toISOString(),'future'],[new Date(prepared-60e3).toISOString(),'before preparation'],['2026-13-40T99:00:00Z','invalid']];
  for(const [at,why] of bad){assert.throws(()=>release(tmp,target.id,at,{now}),undefined,why);checks++;}
  assert.throws(()=>release(tmp,'no-such-entry',new Date(now).toISOString(),{now}));checks++;
  FILES.forEach((f,i)=>ok(fs.readFileSync(path.join(tmp,f),'utf8')===before[i],f+': refused calls write nothing'));
  const at=new Date(now-3600e3).toISOString().replace('Z','+00:00');
  const r=release(tmp,target.id,at,{now});
  ok(r.releasedAt===new Date(now-3600e3).toISOString(),'normalised release time');
  FILES.forEach((f,i)=>{
   const d=load(tmp,f),old=list(JSON.parse(before[i]));
   const e=list(d).find(x=>x.id===target.id);
   ok(e.releaseStatus==='released'&&e.releasedAt===r.releasedAt&&e.correctedAt===new Date(now).toISOString(),f+': released fields');
   const rest=list(d).filter(x=>x.id!==target.id),oldRest=old.filter(x=>x.id!==target.id);
   assert.deepStrictEqual(rest,oldRest);checks++;
   ok(fs.readFileSync(path.join(tmp,f),'utf8').includes('\r\n')===before[i].includes('\r\n'),f+': line endings kept');
  });
  ok(!pending(tmp).some(e=>e.id===target.id),'no longer pending');
  assert.throws(()=>release(tmp,target.id,at,{now}),/--correct/);checks++;
  const fixed=new Date(now-1800e3).toISOString();
  ok(release(tmp,target.id,fixed,{now,correct:true}).releasedAt===fixed,'explicit correction allowed');

  // 3. The history generator keeps a released entry (correctedAt) instead of the older packaged copy.
  const playerEntry=require('../tools/player-update-notes').playerEntry;
  const e=list(load(tmp,FILES[0])).find(x=>x.id===target.id);
  ok(playerEntry(e).releaseStatus==='released'&&playerEntry(e).releasedAt===fixed,'player notes keep release fields');
 }

 // 4. Page rendering: packaged and released entries show different labels and dates.
 const code=fs.readFileSync(path.join(root,'public/js/updates.js'),'utf8');
 function render(entries){
  const els={};
  const mk=tag=>({tag,children:[],textContent:'',hidden:false,className:'',append(...c){this.children.push(...c);},replaceChildren(...c){this.children=c;},setAttribute(){},addEventListener(){},
   get innerText(){return [this.textContent].concat(this.children.map(c=>c.innerText)).join(' ');}});
  const document={getElementById:id=>els[id]||(els[id]=mk('div')),createElement:mk,addEventListener(){},querySelector:()=>null,querySelectorAll:()=>[]};
  els.updateHistoryData={textContent:JSON.stringify({entries})};
  const win={document,localStorage:{getItem:()=>null},addEventListener(){},location:{hash:''},fetch:()=>new Promise(()=>{})};
  const ctx=Object.assign({window:win,AbortController,setTimeout,clearTimeout,console,Date,JSON,Intl,URLSearchParams},win);
  vm.createContext(ctx);vm.runInContext(code,ctx);
  return {timeline:els.updateTimeline.innerText,latest:els.latestUpdate.textContent};
 }
 const base={title:'T',summary:'S',details:['D'],tags:['Tính năng']};
 const prepared='2026-10-26T09:49:57.975Z',rel='2026-10-28T13:15:00.000Z';
 const packaged=render([Object.assign({id:'a',version:'9.0.0',releaseStatus:'packaged',releasedAt:null,publishedAt:prepared},base),Object.assign({id:'b',publishedAt:'2026-10-20T01:00:00.000Z'},base)]);
 ok(/Bản chuẩn bị · chưa phát hành/.test(packaged.timeline)&&/9\.0\.0/.test(packaged.timeline),'packaged label and version');
 ok(packaged.latest===new Date('2026-10-20T01:00:00Z').toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',dateStyle:'medium',timeStyle:'short'}),'latest date ignores unreleased entries');
 const released=render([Object.assign({id:'a',version:'9.0.0',releaseStatus:'released',releasedAt:rel,publishedAt:prepared},base)]);
 const relText=new Date(rel).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',dateStyle:'medium',timeStyle:'short'});
 ok(/Đã phát hành/.test(released.timeline)&&!/chưa phát hành/.test(released.timeline),'released label replaces packaged label');
 ok(released.timeline.includes(relText)&&released.latest===relText,'released entry shows the real release time');
 const legacy=render([Object.assign({id:'c',publishedAt:prepared},base)]);
 ok(!/phát hành/.test(legacy.timeline),'legacy entries unchanged');
}finally{fs.rmSync(tmp,{recursive:true,force:true});}

console.log('PASS update-release: '+checks+' checks (status consistency, release tool guards, history merge, page labels).');
