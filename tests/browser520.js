const {chromium}=require('playwright');const assert=require('assert');
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});try{for(const width of [1280,390]){
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:8085',{waitUntil:'networkidle'});await page.locator('#about').scrollIntoViewIfNeeded();
 assert.equal(await page.locator('#about .feat').count(),8);assert((await page.locator('#about').textContent()).includes('Gia đình qua từng thế hệ'));
 const layout=await page.locator('#about').evaluate(e=>({width:e.clientWidth,scroll:e.scrollWidth,cards:[...e.querySelectorAll('.feat')].map(c=>({x:c.offsetLeft,y:c.offsetTop}))}));assert(layout.scroll<=layout.width+1,'no card overflow');
 if(width===1280)assert.equal(new Set(layout.cards.map(c=>c.y)).size,2,'two full rows');
 assert.equal(await page.evaluate(()=>Object.keys(G.WEC.data.countries).length),194);
 const wages=await page.evaluate(()=>['JP','KR','TH'].map(country=>{const l=G.E.createLife({mode:'world',country,seed:520});return G.E.monthlyEst(l,'bao_ve',0);}));assert(wages.every(v=>Number.isFinite(v)&&v>0));
 await page.locator('#about').screenshot({path:'v520-about-'+width+'.png'});assert.deepEqual(errors,[]);console.log('V5.2 browser '+width+'px: 8 cards, world model loaded, no errors');await page.close();
 }}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
