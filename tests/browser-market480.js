const {chromium}=require('playwright'),assert=require('assert'),fs=require('fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
  for(const width of [1280,390]){
   const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const seed=JSON.parse(fs.readFileSync('public/data/market-prices.json','utf8'));
   await page.route('**/api/market',r=>r.fulfill({json:seed}));
   await page.goto('http://localhost:8085/');
   await page.evaluate(()=>{
    const l=G.E.createLife({mode:'vn',seed:48009});l.age=30;l.money=500;l.indep=true;l.alive=true;l.school=null;l.job=null;l.flags={};l.pending=[G.E.DEC.market_menu.make(l,()=>.5)];l.pending[0].manual=true;
    localStorage.setItem('mkn.current',JSON.stringify({life:l,cohort:[],speed:1,auto:false}));
   });
   await page.reload();await page.locator('#resumeBtn').click();
   await page.locator('#marketStatus').filter({hasText:'Đã kiểm tra'}).waitFor();
   await page.locator('[data-k="gold"]').click();await page.locator('[data-k="NHAN"]').click();
   await page.locator('#marketUnit').selectOption('luong');await page.locator('#marketQty').fill('0,25');
   assert((await page.locator('#marketTotal').textContent()).includes('2,5 chỉ'));
   assert(await page.locator('[data-k="confirm"]').isEnabled());
   assert(!(await page.locator('[data-k="confirm"]').textContent()).includes('khoảng'),'no stale default quantity cost hint');
   await page.locator('#marketQty').fill('-1');assert(await page.locator('[data-k="confirm"]').isDisabled());
   await page.locator('#marketQty').fill('0,25');
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);assert(!overflow,'no horizontal overflow '+width);
   await page.screenshot({path:'market480-'+width+'.png',fullPage:true});
   await page.locator('[data-k="confirm"]').click();
   const qty=await page.evaluate(()=>JSON.parse(localStorage.getItem('mkn.current')).life.marketBook.positions.NHAN.qty);assert.equal(qty,2.5);
   await page.evaluate(()=>{
    const saved=JSON.parse(localStorage.getItem('mkn.current')),l=saved.life;G.E.MARKET.simulateYear(l,null,()=>{});
    l.pending=[G.E.DEC.market_trade.make(l,()=>.5,{symbol:'NHAN',side:'sell',quantity:'0.5'})];l.pending[0].manual=true;localStorage.setItem('mkn.current',JSON.stringify(saved));
   });
   await page.reload();await page.locator('#resumeBtn').click();
   const total=await page.locator('#marketTotal').textContent();assert(total.includes('giá mua bình quân')&&total.includes('Chênh lệch')&&total.includes('dự kiến'),'sale has numeric purchase-price comparison');
   assert((await page.locator('.modal').textContent()).includes('Giá mô phỏng năm'),'simulation price clearly labelled');
   await page.locator('#marketRefresh').click();await page.locator('#marketStatus').filter({hasText:'không đặt lại'}).waitFor();assert.equal(await page.locator('#marketTotal').textContent(),total,'real refresh cannot change simulated sale quote');
   await page.screenshot({path:'market481-sale-'+width+'.png',fullPage:true});
   assert.deepEqual(errors,[]);console.log('Browser market OK at '+width+'px: units, comma input, preview, validation, cash transaction, responsive layout');
   await context.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
