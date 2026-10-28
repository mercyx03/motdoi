/* Generate lightweight first-paint previews with the same engine and UI template. */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
module.exports=function(publicDir,files){
 const app=fs.readFileSync(path.join(publicDir,'js/app.js'),'utf8');
 const from=app.indexOf('  var TEASERS ='),to=app.indexOf('  // ---------- Sổ tay nghề nghiệp',from);
 if(from<0||to<0)throw Error('Preview template boundary changed');
 const ctx={console,Math,Date,JSON,TextEncoder,TextDecoder,Buffer};ctx.globalThis=ctx;vm.createContext(ctx);
 for(const file of files){if(file==='js/music.js')break;vm.runInContext(fs.readFileSync(path.join(publicDir,file),'utf8'),ctx,{filename:file});}
 vm.runInContext("var U=G.U,E=G.E,esc=U.esc,S={preview:null};var nodes={};function $(id){return nodes[id]||(nodes[id]={innerHTML:''});}function money(l,v,vnd){return E.fmtMoney(l,v,vnd);}function bornWith(){};\n"+app.slice(from,to),ctx);
 const profiles=[];
 for(const mode of ['vn','world'])for(const variant of mode==='vn'?['34','63']:['34'])for(const difficulty of ['normal'])for(let i=0;i<2;i++){
  const opts={mode,variant,difficulty,gender:'random',lifeMin:30,seed:crypto.randomBytes(4).readUInt32LE(0)};
  ctx.S.preview=opts;vm.runInContext('renderProfile()',ctx);
  profiles.push({opts,html:ctx.nodes['#heroProfile'].innerHTML});
 }
 profiles.jobCount=Object.keys(ctx.G.E.CAR).filter(k=>!['scam_kh','phu_giup'].includes(k)).length;
 return profiles;
};
