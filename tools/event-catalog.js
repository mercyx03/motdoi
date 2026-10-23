'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
module.exports=function(pub,files){
 const c={console,Math,Date,JSON,Buffer,TextEncoder,TextDecoder};c.globalThis=c;vm.createContext(c);
 for(const f of files){if(f==='js/scene.js')break;vm.runInContext(fs.readFileSync(path.join(pub,f),'utf8'),c,{filename:f});}
 const E=c.G.E,rows=[];
 function serial(v,seen=new Set()){if(typeof v==='function')return {code:String(v)};if(v==null||typeof v!=='object')return v;if(seen.has(v))return '[tham chiếu vòng]';seen.add(v);const out=Array.isArray(v)?[]:{};for(const k of Object.keys(v))out[k]=serial(v[k],new Set(seen));return out;}
 for(const [id,d]of Object.entries(E.DEC))rows.push({id,type:'Lựa chọn',title:typeof d.def?.title==='string'?d.def.title:id,data:serial({definition:d.def||d,triggers:E.TRIG.filter(t=>t.id===id),actions:E.ACT.filter(a=>a.id===id)})});
 E.EVENTS.forEach((e,i)=>rows.push({id:'event-'+i,type:'Biến cố',title:'Biến cố ngẫu nhiên '+(i+1),data:serial(e)}));
 E.LINES.forEach((e,i)=>rows.push({id:'line-'+i,type:'Lời kể',title:'Lời kể '+(i+1),data:serial(e)}));
 E.HOOKS.year.forEach((e,i)=>rows.push({id:'year-'+i,type:'Hằng năm',title:'Diễn biến hằng năm '+(i+1),data:serial(e)}));
 return rows;
};
