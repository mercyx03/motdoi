'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const root=path.join(__dirname,'..'),dist=path.join(root,'dist'),pub=path.join(root,'public');
const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const source=fs.readFileSync(path.join(pub,'index.html'),'utf8');
const files=[...source.matchAll(/<script src="(js\/[^"?]+)[^"]*" type="text\/plain" data-game>/g)].map(m=>m[1]);
const scripts=[...html.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map(m=>m[1]);
assert.equal(scripts.length,1,'one initial script');
const boot=fs.readFileSync(path.join(dist,scripts[0]),'utf8');assert(Buffer.byteLength(boot)<10000,'bootstrap below 10 KB');
const chunks=JSON.parse(/window\.MOTDOI_GAME_FILES=(\[[^\n]+\]);/.exec(boot)[1]);assert(chunks.length>1);
const contents=chunks.map(p=>fs.readFileSync(path.join(dist,p),'utf8'));
const expected=files.map(p=>'/* ===== '+p+' ===== */\n'+fs.readFileSync(path.join(pub,p),'utf8').replace(/^﻿/,'')+'\n;\n').join('');
assert.equal(contents.join(''),expected,'every game module preserved in dependency order');
for(let i=0;i<chunks.length;i++){
 const hash=crypto.createHash('sha256').update(contents[i]).digest('hex').slice(0,10);assert(chunks[i].includes('.'+hash+'.'));
 new vm.Script(contents[i],{filename:chunks[i]});
}
assert(!/fonts\.googleapis|fonts\.gstatic/.test(html),'no remote font waterfall');
assert(!/<link rel="stylesheet"/.test(html),'complete CSS inlined');
assert(html.includes('font-display: swap'));
assert(html.includes('max-width: 760px'),'mobile layout retained');
assert(html.includes('<noscript>'),'no-JavaScript guidance');
for(const match of html.matchAll(/(?:url\(|href=")(fonts\/[^)"']+)/g))assert(fs.existsSync(path.join(dist,match[1])));
assert(fs.readFileSync(path.join(dist,'_headers'),'utf8').includes('max-age=31536000, immutable'));
for(const name of ['sitemap.xml','robots.txt'])assert.equal(fs.readFileSync(path.join(dist,name),'utf8'),fs.readFileSync(path.join(pub,name),'utf8'));
console.log('PASS: homepage JS budget, dependency order, chunk hashes/syntax, local fonts, full CSS, mobile layout, SEO files and cache policy.');
