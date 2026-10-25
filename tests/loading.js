'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const root=path.join(__dirname,'..'),dist=path.join(root,'dist');
const read=p=>fs.readFileSync(path.join(dist,p),'utf8'),html=read('index.html');
const previews=JSON.parse(/<script type="application\/json" id="startingProfiles">([\s\S]*?)<\/script>/.exec(html)[1]);
assert.equal(previews.length,12,'profiles for every mode/variant/difficulty');
assert(previews.every(p=>p.opts.seed&&p.html.includes('Hồ sơ xuất phát')&&p.html.includes('id="liveThis"')&&p.html.includes('id="reroll"')),'complete seeded starting profiles are present before engine load');
const scripts=[...html.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map(m=>m[1]);
assert.equal(scripts.length,2,'game bootstrap and independent support button');
assert(scripts.some(p=>/support/.test(p)),'support available before game engine');
assert(html.includes('id="statJobs">160+'),'career total visible before engine');
assert(html.includes('font-family:Lora')||html.includes('font-family:"Lora"'),'Lora font embedded');
assert(!html.includes("--display:'Be Vietnam Pro'"),'display serif preserved');
const boot=read(scripts.find(p=>/boot/.test(p)));assert(Buffer.byteLength(boot)<5000,'bootstrap below 5 KB');
const chunks=JSON.parse(/window\.MOTDOI_GAME_FILES=(\[[^\]]+\])/.exec(boot)[1]);assert.equal(chunks.length,4);
const paths=[];(function walk(dir){for(const e of fs.readdirSync(path.join(dist,dir),{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else paths.push(p.replace(/\\/g,'/'));}})('');
assert.equal(paths.length,28,'compact deployment includes support assets');
assert(!paths.some(f=>/\.map$|^js\/|^css\/|\.(md|csv|ts)$|package\.json|(^|\/)\.env/.test(f)),'no raw modules, maps or project files');
for(const p of paths.filter(p=>p.endsWith('.js'))){
 const text=read(p);assert(!/sourceMappingURL|\/\* ===== js\//.test(text),'no maps or source markers');
 new vm.Script(p==='_worker.js'?text.replace(/export\s+default/,'const workerDefault='):text,{filename:p});
 if(p.startsWith('assets/'))assert(p.includes('.'+crypto.createHash('sha256').update(text).digest('hex').slice(0,10)+'.'));
}
for(const p of paths.filter(p=>p.endsWith('.html'))){
 const page=read(p);assert(!/fonts\.googleapis|fonts\.gstatic/.test(page));assert(!/<link[^>]+rel="stylesheet"/.test(page));assert(page.includes('font-display:swap'));
 assert.equal((page.match(/rel="canonical"/g)||[]).length,1);
 for(const m of page.matchAll(/(?:src|href)="((?:assets|fonts)\/[^"?]+)/g))assert(paths.includes(m[1]),'shipped page resource '+m[1]);
}
for(const f of ['sitemap.xml','robots.txt'])assert.equal(read(f),fs.readFileSync(path.join(root,'public',f),'utf8'));
assert(read('_headers').includes('max-age=31536000, immutable'));
// Compare complete minified-engine lives with the readable source using the same clock and random stream.
let seed=78123;const math=Object.create(Math);math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const tick=Date.UTC(2026,9,21);class Clock extends Date{constructor(...a){super(...(a.length?a:[tick]));}static now(){return tick;}}
const ctx={console,Math:math,Date:Clock,JSON,Buffer,TextEncoder,TextDecoder};ctx.globalThis=ctx;vm.createContext(ctx);
for(const p of chunks.slice(0,3))vm.runInContext(read(p),ctx,{filename:p});
const source=require('./hardcore-isolation').gameContext();
for(const opts of [
 {mode:'vn',variant:'34',seed:78100,year:2026},
 {mode:'vn',variant:'63',seed:78101,year:2026},
 ...['JP','US','DE','IN'].map((country,i)=>({mode:'world',country,seed:78200+i,year:2026})),
 {mode:'vn',variant:'34',difficulty:'hardcore',seed:78105,year:2026},
 {mode:'world',country:'JP',difficulty:'hardcore',seed:78106,year:2026}
]){
 const a=source.E.createLife(opts),b=ctx.G.E.createLife(opts);source.E.runHeadless(a);ctx.G.E.runHeadless(b);
 if(JSON.stringify(a)!==JSON.stringify(b)){
 fs.writeFileSync('.cache/build-life-actual.json',JSON.stringify(b));fs.writeFileSync('.cache/build-life-source.json',JSON.stringify(a));
 const diffs=[];function walk(a,b,p){if(diffs.length>=8)return;if(a===b)return;if(!a||!b||typeof a!=='object'||typeof b!=='object'){diffs.push({p,a,b});return;}for(const k of new Set([...Object.keys(a),...Object.keys(b)]))walk(a[k],b[k],p+'.'+k);}
 walk(a,b,'life');throw Error(JSON.stringify({opts,diffs}));
}
}
console.log('PASS: 28 deployment files, minified JS/CSS, no source maps/raw modules, resource hashes, font/SEO/cache checks and 8 identical full-life simulations.');

const updatePage=read('updates.html'),embeddedHistory=JSON.parse(/<script type="application\/json" id="updateHistoryData">([\s\S]*?)<\/script>/.exec(updatePage)[1]);
assert.deepStrictEqual(embeddedHistory,JSON.parse(read('data/updates.json')),'updates shipped directly with page match release data');
assert(embeddedHistory.entries.some(e=>e.id==='family-payment126'),'family/investment release notes remain on deployed page');
console.log('PASS: newest family/investment release notes embedded in updates page.');

for(const id of ['family-inheritance129','family-relationships130']) assert(embeddedHistory.entries.some(e=>e.id===id),'latest family release visible: '+id);
console.log('PASS: family129 and family130 release notes embedded in deployment.');

assert(embeddedHistory.entries.some(e=>e.id==='social131-mobile-qr'),'social and QR release visible');

assert(embeddedHistory.entries.some(e=>e.id==='creator132'),'creator careers release shipped');

assert(embeddedHistory.entries.some(e=>e.id==='audit135'),'audit fixes release shipped');
