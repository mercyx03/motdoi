'use strict';
const assert=require('node:assert/strict'),{spawn}=require('node:child_process');
const {launch,page,sleep}=require('./lib/cdp');
const port=+process.env.PORT||8801,url='http://127.0.0.1:'+port+'/';
(async()=>{
 const server=spawn(process.execPath,['tools/serve.js'],{env:{...process.env,PORT:String(port),MOTDOI_ROOT:process.env.MOTDOI_ROOT||'dist'},stdio:'ignore',windowsHide:true});
 let browser;
 try{
  for(let i=0;i<80;i++){try{if((await fetch(url)).ok)break;}catch{}await sleep(100);}
  browser=await launch();
  for(const width of [390,1366]){
   const p=await page(browser,url,{width,height:950});
   try{
    await p.eval(()=>{localStorage.clear();});await p.reload();
    await p.eval(async()=>{await MotDoiBoot.load();});
    const vn=await p.eval(()=>{
     function choose(id,value){const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('change',{bubbles:true}));}
     const merged=G.VN.P34.find(p=>p.name==='TP. Hồ Chí Minh');if(!merged)throw Error('province fixture');
     choose('provSel',String(merged.id));choose('yearSel','1970');
     const ethnic=G.VN.ETH[1].name;choose('ethSel',ethnic);
     const selected=G.VN.P63.find(p=>String(p.id)===document.querySelector('#provSel').value);
     return {count:document.querySelector('#provSel').options.length,disabled:document.querySelector('[data-variant="34"]').disabled,
      member:merged.members.some(p=>p.id===selected.id),ethnic,profile:document.querySelector('#heroProfile').innerText,hint:document.querySelector('#provHint').innerText};
    });
    assert.equal(vn.count,64);assert(vn.disabled&&vn.member);assert(vn.profile.includes('Sài Gòn'));assert(vn.profile.includes(vn.ethnic));assert(!vn.hint.includes('1/7/2025'));
    const setup=await p.eval(()=>{
     function choose(id,value){const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('change',{bubbles:true}));}
     choose('yearSel','1900');const early=document.querySelector('#yearHint').innerText;
     document.querySelector('[data-mode="world"]').click();choose('countrySel','');const random=document.querySelector('#yearHint').innerText;
     choose('yearSel','1960');choose('countrySel','BD');const bd=document.querySelector('#yearHint').innerText;
     choose('countrySel','MM');const mm=document.querySelector('#countrySel').selectedOptions[0].textContent;
     choose('yearSel','1990');choose('countrySel','CD');
     return {early,random,bd,mm,profile:document.querySelector('#heroProfile').innerText,overflow:document.documentElement.scrollWidth>innerWidth+1};
    });
    assert(setup.early.includes('ước tính'));assert(!setup.random.includes('Việt Nam'));assert(setup.random.includes('được chọn khi chào đời'));
    assert(setup.bd.includes('Đông Pakistan'));assert(setup.mm.includes('Miến Điện'));assert(setup.profile.includes('Zaire'));assert(!setup.overflow);
    await p.load(url+'updates.html');
    const update=await p.eval(()=>{
     const data=JSON.parse(document.querySelector('#updateHistoryData').textContent).entries,search=document.querySelector('#updateSearch');
     document.querySelector('#moreUpdates')?.click();
     search.value='noi sinh va nam sinh';search.dispatchEvent(new Event('input',{bubbles:true}));
     return {version:data[0].version,status:data[0].releaseStatus,text:document.querySelector('#updateTimeline').innerText,overflow:document.documentElement.scrollWidth>innerWidth+1};
    });
    assert.equal(update.version,'9.6.8');assert.equal(update.status,'packaged');assert(update.text.includes('nơi sinh và năm sinh'));assert(!update.overflow);
    assert.deepEqual(p.errors,[]);console.log('PASS birth-era968-browser: region/year choices, historical names, preview, updates and layout '+width);
   }catch(error){console.error(p.errors);throw error;}finally{p.close();}
  }
 }finally{if(browser)await browser.close();server.kill();}
})().catch(error=>{console.error(error);process.exit(1);});
