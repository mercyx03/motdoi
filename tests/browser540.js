const {chromium}=require('playwright'),assert=require('assert');
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});try{for(const width of [1280,390]){
 const page=await browser.newPage({viewport:{width,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:8085',{waitUntil:'networkidle'});
 async function seed(age){await page.evaluate(age=>{const E=G.E,l=E.createLife({mode:'vn',seed:540});l.age=age;l.indep=age>=18;l.country='VN';l.abroad=null;l.school=age===15?'lower':null;l.edu=age===15?2:3;l.schoolEnd=null;l.st.kno=99;l.examScore=30;l.pending=[age===15?E.DEC.hs.make(l,()=>.5):E.DEC.uni.make(l,()=>.5)];l.pending[0].manual=true;localStorage.setItem('mkn.current',JSON.stringify({life:l,cohort:[],speed:1,auto:false}));},age);await page.reload();await page.locator('#resumeBtn').click();}
 async function choose(k){await page.locator('.modal [data-k="'+k+'"]').click();}
 await seed(18);await choose('wishes54');await choose('region_Nam');await choose('school_ctu');await choose('major_eco');assert((await page.locator('.modal').textContent()).includes('NV1: Đại học Cần Thơ'));assert(await page.locator('.modal').evaluate(e=>e.scrollWidth<=e.clientWidth+1));await page.locator('.modal').screenshot({path:'v540-wishes-'+width+'.png'});await choose('submit');
 let saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('mkn.current')).life);assert.equal(saved.school,'uni');assert.equal(saved.major,'eco');assert.equal(saved.uniName,'Đại học Cần Thơ');
 await page.reload();await page.locator('#resumeBtn').click();assert((await page.locator('#life').textContent()).includes('Đại học Cần Thơ'));
 await page.goto('http://localhost:8085');await seed(15);await choose('special54');await choose('math');saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('mkn.current')).life);assert.equal(saved.school,'upper');assert.equal(saved.flags.study54.special.subject,'math');
 assert.deepEqual(errors,[]);await page.close();console.log('V5.4 browser '+width+' passed');
 }}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
