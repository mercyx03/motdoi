const {chromium}=require('playwright'),assert=require('assert');
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});try{for(const width of [1280,390]){
 const page=await browser.newPage({viewport:{width,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:8085',{waitUntil:'networkidle'});
 await page.route('**/api/feedback',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true})}));
 await page.locator('#feedbackBtn').click();assert(!(await page.locator('.feedback-profile').textContent()).includes('gmail.com'));await page.locator('#feedbackTitle').fill('Kiểm thử giả lập');await page.locator('#feedbackMessage').fill('Kiểm tra giao diện, không gửi thư thật.');await page.locator('#feedbackSend').click();await page.locator('#feedbackStatus').filter({hasText:'Đã gửi góp ý'}).waitFor();await page.locator('#feedbackClose').click();
 for(const spend of ['normal','save','lavish']){
  await page.evaluate(spend=>{const E=G.E,l=E.createLife({mode:'vn',seed:541});l.age=28;l.school=null;l.indep=true;l.money=10000;l.spend=spend;l.partner={name:'Nguyễn An',sex:'F',age:27,status:'dating',alive:true,close:80};l.pending=[E.DEC.hen_ho.make(l,()=>.5)];l.pending[0].manual=true;localStorage.setItem('mkn.current',JSON.stringify({life:l,cohort:[],speed:1,auto:false}));},spend);
  await page.reload();await page.locator('#resumeBtn').click();await page.locator('.modal [data-k="doi"]').click();await page.locator('.modal [data-k="talk"]').click();assert.equal(await page.locator('.modal [data-k="talk"]').count(),0);await page.reload();
 }
 assert.deepEqual(errors,[]);await page.close();console.log('V5.4.1 browser '+width+' passed (feedback mocked)');
 }}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
