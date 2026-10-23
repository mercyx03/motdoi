/* Compact production build. Source remains readable in public/, never shipped. */
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),esbuild=require('esbuild');
const ROOT=path.join(__dirname,'..'),PUB=path.join(ROOT,'public');
const digest=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,10);
const minifyJS=source=>esbuild.transformSync(source,{loader:'js',minify:true,treeShaking:false,ignoreAnnotations:true,legalComments:'none',sourcemap:false,charset:'utf8',target:'es2020'}).code;
function build(outDir){
 const OUT=path.resolve(outDir||path.join(ROOT,'dist'));
 if(OUT===ROOT||OUT===PUB||!OUT.startsWith(ROOT+path.sep)||OUT.startsWith(PUB+path.sep))throw Error('Output must be a project subdirectory outside public.');
 const read=p=>fs.readFileSync(path.join(PUB,p),'utf8');
 const html=read('index.html'),pattern=/[ \t]*<script src="(js\/[^"?]+)(?:\?v=[^"]*)?" type="text\/plain" data-game><\/script>\r?\n?/g;
 const files=[...html.matchAll(pattern)].map(m=>m[1]);if(!files.length)throw Error('No deferred game modules');
 const uiAt=files.indexOf('js/scene.js');if(uiAt<0)throw Error('Missing UI boundary');
 const engineFiles=files.slice(0,uiAt),uiFiles=files.slice(uiAt);
 const parts=engineFiles.map(f=>read(f).replace(/^﻿/,'')+'\n;\n'),total=parts.reduce((n,s)=>n+Buffer.byteLength(s),0);
 const rawChunks=[];let body='',consumed=0;
 for(let i=0;i<parts.length;i++){
  body+=parts[i];consumed+=Buffer.byteLength(parts[i]);
  if(rawChunks.length<2&&consumed>=total*(rawChunks.length+1)/3){rawChunks.push(body);body='';}
 }
 if(body)rawChunks.push(body);
 const engineChunkCount=rawChunks.length;
 rawChunks.push(uiFiles.map(f=>read(f).replace(/^﻿/,'')+'\n;\n').join(''));
 const chunks=rawChunks.map((s,i)=>{const content=minifyJS(s);return{name:'assets/game-'+i+'.'+digest(content)+'.js',content};});
 fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(path.join(OUT,'assets'),{recursive:true});
 function put(p,data){fs.mkdirSync(path.dirname(path.join(OUT,p)),{recursive:true});fs.writeFileSync(path.join(OUT,p),data);}
 // Explicit deployment allowlist. Never copy source modules, docs, tools or source maps.
 for(const file of ['_headers','_routes.json','logo.webp','favicon.png','robots.txt','sitemap.xml','data/updates.json','data/market-prices.json'])put(file,fs.readFileSync(path.join(PUB,file)));
 const catalogue=require('./event-catalog')(PUB,files);
 put('_worker.js',minifyJS(read('_worker.js').replace('/* admin-catalog */ []',JSON.stringify(catalogue))));
 for(const c of chunks)put(c.name,c.content);
 const loader=minifyJS('window.MOTDOI_GAME_FILES='+JSON.stringify(chunks.map(c=>c.name))+';\n'+read('js/boot.js'));
 const bootName='assets/boot.'+digest(loader)+'.js';put(bootName,loader);
 const fontCss=read('css/fonts.css').replaceAll('../fonts/','fonts/');
 const fonts=[...new Set([...fontCss.matchAll(/url\(['"]?(fonts\/[^)'"]+)/g)].map(m=>m[1]))];
 for(const font of fonts)put(font,fs.readFileSync(path.join(PUB,font)));
 put('fonts-LICENSE.txt',['Be Vietnam Pro',read('fonts/be-vietnam-OFL.txt'),'Playfair Display',read('fonts/playfair-OFL.txt'),'Lora',read('fonts/lora-OFL.txt')].join('\n\n'));
 function inlineStyles(page){
  const cssFiles=[...page.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="(css\/[^"?]+)[^"]*"[^>]*>/g)].map(m=>m[1]);
  const css=fontCss+'\n'+cssFiles.filter(f=>f!=='css/fonts.css').map(read).join('\n');
  const compact=esbuild.transformSync(css,{loader:'css',minify:true,legalComments:'none',sourcemap:false,target:'es2020'}).code;
  page=page.replace(/<link\b[^>]*(?:fonts\.googleapis\.com|fonts\.gstatic\.com)[^>]*>\r?\n?/g,'');
  page=page.replace(/<link\b[^>]*rel="stylesheet"[^>]*href="css\/[^"]+"[^>]*>\r?\n?/g,'');
  return page.replace('</head>','<style>'+compact.replace(/<\/style/gi,'<\\/style')+'</style></head>');
 }
 const profiles=require('./start-profile')(PUB,files);
 const placeholder='<div class="profile" id="heroProfile"><h3>Hồ sơ xuất phát</h3><p role="status">Đang chuẩn bị hồ sơ…</p></div>';
 if(!html.includes(placeholder))throw Error('Missing starting profile placeholder');
 let home=inlineStyles(html.replace(/(id="statJobs">)[^<]+/,'$1'+(Math.floor(profiles.jobCount/10)*10)+'+').replace(pattern,'').replace(placeholder,'<div class="profile" id="heroProfile">'+profiles[0].html+'</div>'));
 const profileData=JSON.stringify(profiles).replace(/</g,'\\u003c');
 home=home.replace('</body>','<script type="application/json" id="startingProfiles">'+profileData+'</script></body>');
 const primary=fonts.find(f=>/be-vietnam-400-full\./.test(f));
 home=home.replace('</head>','<link rel="preload" href="'+primary+'" as="font" type="font/woff2" crossorigin></head>');
 home=home.replace(/<script defer src="js\/boot.js[^"]*"><\/script>/,'<script defer src="'+bootName+'"></script>');
 put('index.html',home.replace(/<!--[\s\S]*?-->/g,''));
 for(const page of ['updates.html','reviews.html']){
  let text=read(page);
  const scripts=[...text.matchAll(/<script\b[^>]*src="(js\/[^"?]+)[^"]*"[^>]*><\/script>/g)].map(m=>m[1]);
  const code=minifyJS(scripts.map(f=>read(f)+'\n;\n').join(''));
  const name='assets/'+page.replace('.html','')+'.'+digest(code)+'.js';put(name,code);
  text=inlineStyles(text).replace(/<script\b[^>]*src="js\/[^"]+"[^>]*><\/script>/g,'');
  text=text.replace('</body>','<script defer src="'+name+'"></script></body>');
  put(page,text.replace(/<!--[\s\S]*?-->/g,''));
 }
 for(const font of fonts)fs.appendFileSync(path.join(OUT,'_headers'),'\n/'+font+'\n  Cache-Control: public, max-age=31536000, immutable\n');
 const deployed=[];(function walk(dir){for(const e of fs.readdirSync(path.join(OUT,dir),{withFileTypes:true})){const rel=path.join(dir,e.name);if(e.isDirectory())walk(rel);else deployed.push(rel.replace(/\\/g,'/'));}})('');
 return{out:OUT,files:files.length,bundle:chunks.length+' minified deferred bundles',bytes:chunks.reduce((n,c)=>n+Buffer.byteLength(c.content),0),initialJsBytes:Buffer.byteLength(loader),engineChunkCount,chunks:chunks.map(c=>({name:c.name,bytes:Buffer.byteLength(c.content)})),deployedFiles:deployed.length};
}
module.exports=build;
if(require.main===module)console.log(JSON.stringify(build(process.argv[2]),null,2));
