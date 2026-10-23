/* Build dependency-ordered game chunks and a lightweight homepage. */
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const ROOT=path.join(__dirname,'..'),PUB=path.join(ROOT,'public');
const digest=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,10);
function build(outDir){
 const OUT=path.resolve(outDir||path.join(ROOT,'dist'));
 if(OUT===ROOT||OUT===PUB||!OUT.startsWith(ROOT+path.sep))throw Error('Build output must be a subdirectory of the project, outside public.');
 const html=fs.readFileSync(path.join(PUB,'index.html'),'utf8');
 const pattern=/[ \t]*<script src="(js\/[^"?]+)(?:\?v=[^"]*)?" type="text\/plain" data-game><\/script>\r?\n?/g;
 const files=[...html.matchAll(pattern)].map(m=>m[1]);if(!files.length)throw Error('No deferred game scripts');
 const chunks=[];let parts=[],size=0;
 function flush(){if(!parts.length)return;const content=parts.join('');chunks.push({name:'assets/game-'+chunks.length+'.'+digest(content)+'.js',content});parts=[];size=0;}
 for(const file of files){
  const part='/* ===== '+file+' ===== */\n'+fs.readFileSync(path.join(PUB,file),'utf8').replace(/^﻿/,'')+'\n;\n';
  if(size&&size+Buffer.byteLength(part)>140*1024)flush();
  parts.push(part);size+=Buffer.byteLength(part);
 }
 flush();
 fs.rmSync(OUT,{recursive:true,force:true});
 const skip=new Set(files.map(f=>path.normalize(f)));skip.add(path.normalize('js/boot.js'));
 // Other pages still use shared scripts directly.
 (function keep(dir){for(const e of fs.readdirSync(path.join(PUB,dir),{withFileTypes:true})){
  const rel=path.join(dir,e.name);if(e.isDirectory()){keep(rel);continue;}
  if(!/\.html$/i.test(e.name)||rel==='index.html')continue;
  for(const m of fs.readFileSync(path.join(PUB,rel),'utf8').matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)){
   const src=m[1].split(/[?#]/)[0];if(!src||/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(src))continue;
   skip.delete(path.normalize(src.startsWith('/')?src.slice(1):path.join(path.dirname(rel),src)));
  }
 }})('');
 (function copy(dir){for(const e of fs.readdirSync(path.join(PUB,dir),{withFileTypes:true})){
  const rel=path.join(dir,e.name);if(e.isDirectory()){copy(rel);continue;}
  if(skip.has(path.normalize(rel))||/\.(md|csv)$/i.test(e.name))continue;
  fs.mkdirSync(path.join(OUT,dir),{recursive:true});fs.copyFileSync(path.join(PUB,rel),path.join(OUT,rel));
 }})('');
 fs.mkdirSync(path.join(OUT,'assets'),{recursive:true});
 for(const c of chunks)fs.writeFileSync(path.join(OUT,c.name),c.content);
 const loader='window.MOTDOI_GAME_FILES='+JSON.stringify(chunks.map(c=>c.name))+';\n'+fs.readFileSync(path.join(PUB,'js/boot.js'),'utf8');
 const bootName='assets/boot.'+digest(loader)+'.js';fs.writeFileSync(path.join(OUT,bootName),loader);
 // Ship complete styles in the HTML: no unstyled first paint and no CSS network waterfall.
 const css=fs.readFileSync(path.join(PUB,'css/fonts.css'),'utf8').replaceAll('../fonts/','fonts/')+'\n'+fs.readFileSync(path.join(PUB,'css/style.css'),'utf8');
 let outHtml=html.replace(pattern,'').replace(/<link rel="stylesheet" href="css\/(?:style|fonts)\.css[^"]*">\r?\n?/g,'');
 outHtml=outHtml.replace('</head>','<style>\n'+css.replace(/<\/style/gi,'<\\/style')+'\n</style>\n</head>');
 const fontFiles=fs.readdirSync(path.join(PUB,'fonts')).filter(f=>/^be-vietnam-400-(?:latin|vietnamese)\./.test(f));
 outHtml=outHtml.replace('</head>',fontFiles.map(f=>'<link rel="preload" href="fonts/'+f+'" as="font" type="font/woff2" crossorigin>').join('\n')+'\n</head>');
 outHtml=outHtml.replace(/<script defer src="js\/boot.js[^"]*"><\/script>/,'<script defer src="'+bootName+'"></script>');
 fs.writeFileSync(path.join(OUT,'index.html'),outHtml);
 for(const font of fs.readdirSync(path.join(PUB,'fonts')).filter(f=>/\.[a-f0-9]{10}\.woff2$/.test(f)))fs.appendFileSync(path.join(OUT,'_headers'),'\n/fonts/'+font+'\n  Cache-Control: public, max-age=31536000, immutable\n');
 const bytes=chunks.reduce((n,c)=>n+Buffer.byteLength(c.content),0);
 return {out:OUT,files:files.length,bundle:chunks.length+' deferred chunks',bytes,initialJsBytes:Buffer.byteLength(loader),chunks:chunks.map(c=>({name:c.name,bytes:Buffer.byteLength(c.content)}))};
}
module.exports=build;
if(require.main===module){const r=build(process.argv[2]);console.log(JSON.stringify(r,null,2));}
