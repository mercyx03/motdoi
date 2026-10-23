'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const build=require('../tools/build'),root=path.join(__dirname,'..'),cache=path.join(root,'.cache');fs.mkdirSync(cache,{recursive:true});
const out=fs.mkdtempSync(path.join(cache,'build660-'));let n=0;function ok(v,t){assert(v,t);n++;}
try{
 const r=build(out),html=fs.readFileSync(path.join(out,'index.html'),'utf8');
 const bootPath=[...html.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map(m=>m[1]);ok(bootPath.length===1,'one initial bootstrap');
 const boot=fs.readFileSync(path.join(out,bootPath[0]),'utf8'),chunks=JSON.parse(/window\.MOTDOI_GAME_FILES=(\[[^\]]+\])/.exec(boot)[1]);
 ok(chunks.length===4&&r.files>=100,'all source modules compiled into four deferred bundles');
 const list=[];(function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else list.push(path.relative(out,p).replace(/\\/g,'/'));}})(out);
 ok(list.length===24,'24 deployment files');
 ok(!list.some(f=>/\.(md|csv|map|ts)$/i.test(f)||/^js\/|^css\//.test(f)),'no raw source, maps or documentation');
 ok(['_worker.js','_routes.json','_headers','reviews.html','data/market-prices.json','logo.webp'].every(f=>list.includes(f)),'web/API assets present');
 for(const page of list.filter(f=>/\.html$/i.test(f))){
  const text=fs.readFileSync(path.join(out,page),'utf8');
  for(const m of text.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi))ok(fs.existsSync(path.join(out,m[1])),page+' script shipped');
  ok(/rel="canonical"/.test(text),page+' canonical retained');
 }
 const ctx={console,Math,Date,JSON,TextEncoder,TextDecoder};ctx.globalThis=ctx;vm.createContext(ctx);
 for(const file of chunks.slice(0,r.engineChunkCount))vm.runInContext(fs.readFileSync(path.join(out,file),'utf8'),ctx);
 const E=ctx.G.E,l=E.createLife({mode:'vn',seed:660});E.runHeadless(l);ok(!l.alive&&l.death&&E.ACHIEVEMENTS.length>=30,'production engine completes a whole life');
 const tool=fs.readFileSync(path.join(root,'tools/backup-reviews.js'),'utf8');ok(/limit=100/.test(tool)&&/wrangler', 'd1', 'export'/.test(tool),'reviews backup retained');
 ok(/directory = "\.\/dist"/.test(fs.readFileSync(path.join(root,'wrangler.toml'),'utf8')),'Wrangler deploys dist');
}finally{if(!out.startsWith(cache+path.sep))throw Error('Invalid test output path');fs.rmSync(out,{recursive:true,force:true});}
console.log(n+' compact build checks passed.');
