'use strict';
const assert=require('node:assert/strict'),{spawn}=require('node:child_process');
const {launch,page,sleep}=require('./lib/cdp'),expected=require('../public/data/updates.json').entries[0];
const port=+process.env.PORT||8804,url='http://127.0.0.1:'+port+'/';
function seed(kind){
 const E=G.E,l=E.createLife({mode:'world',country:kind==='saudi'?'GB':'ES',year:2000,seed:970,name:kind==='saudi'?'Alex Smith':'Alejandro García López',gender:'M'});
 Object.assign(l,{age:26,alive:true,pending:[],sched:[],job:null,school:null,schoolEnd:null,indep:true,money:l.base*100,edu:3,abroad:null,_yearRun:true,acts:0});l.flags.military=0;let d;
 if(kind==='saudi'){
  const F=E.FOOTBALL,s=F.init(l,()=>.5);s.potential=100;s.reputation=100;s.form=s.fitness=100;E.FOOTBALL_DATA.skills.forEach(k=>s.skills[k]=100);
  F.negotiate(l,'SA-0',()=>0,()=>{});d=E.DEC.footballSign897.make(l,()=>0,{offer:s.offers[0].id});
 }else{
  l.partner={name:'Lucía Martínez Gómez',sex:'F',age:25,status:'married',since:24,alive:true,relation108:'970-spouse',inc:0};
  if(kind==='baby'){
   E.SPAIN_COMMON970.order(l).order='mother';const k=E.RELATIONS108.deliver(l,l.partner,()=>.25,()=>{},{source:'partner'});E.UPDATE110.uid(l,k);d=E.DEC.kidName919.make(l,()=>0,{uid:k.uid110});
  }else d=E.DEC.spainCommon970.make(l,()=>0);
 }
 d.manual=true;l.pending=[d];localStorage.setItem('mkn.current',JSON.stringify({life:l,cohort:[],auto:false,speed:1}));
}
(async()=>{
 const server=spawn(process.execPath,['tools/serve.js'],{env:{...process.env,PORT:String(port),MOTDOI_ROOT:process.env.MOTDOI_ROOT||'dist'},stdio:'ignore',windowsHide:true});let browser;
 try{
  for(let i=0;i<100;i++){try{if((await fetch(url)).ok)break;}catch{}await sleep(100);}
  browser=await launch();
  for(const width of [390,1366]){
   const p=await page(browser,url,{width,height:950});
   try{
    await p.eval(async()=>{await MotDoiBoot.load();});
    for(const kind of ['saudi','order','baby']){
     await p.eval(seed,kind);await p.reload();await p.eval(async()=>{await MotDoiBoot.load();document.querySelector('#resumeBtn').click();});await sleep(150);
     const text=kind==='saudi'?'Đồng ý các điều kiện':kind==='order'?'Đăng ký họ mẹ trước':null;
     if(kind==='saudi')assert((await p.eval(()=>document.body.innerText)).includes('60,000,000 USD/năm'));
     assert(await p.eval(text=>{const b=[...document.querySelectorAll('.opt')].find(b=>text?b.innerText.includes(text):b.innerText.includes('Martínez García'));if(!b)return false;b.click();return true;},text),kind+' option');await sleep(200);
     await p.eval(()=>{const b=[...document.querySelectorAll('#modalRoot button')].find(b=>b.textContent.trim()==='Chắc chắn, tiếp tục');if(b)b.click();});await sleep(200);
     const state=await p.eval(()=>JSON.parse(localStorage.getItem('mkn.current')).life);
     if(kind==='saudi'){assert(state.abroad,JSON.stringify({pending:state.pending,job:state.job,football:state.flags.football,log:state.log.slice(-3)}));assert.equal(state.abroad.code,'SA');assert.equal(state.country,'GB');assert.equal(state.flags.football.contract.annualUSD,60000000);}
     if(kind==='order')assert.equal(Object.values(state.flags.spainCommon970.orders)[0].order,'mother');
     if(kind==='baby'){assert.equal(state.kids[0].es970.first,'Martínez');assert.equal(state.kids[0].es970.second,'García');assert.equal(state.kids[0].es970.full,state.kids[0].name);}
     await p.reload();await p.eval(async()=>{await MotDoiBoot.load();document.querySelector('#resumeBtn').click();});await sleep(100);
     assert(await p.eval(()=>document.documentElement.scrollWidth<=innerWidth+1));
     if(kind==='saudi')await p.screenshot('.cache/saudi970-'+width+'.png');
    }
    await p.load(url+'updates.html');
    const history=await p.eval(()=>{
     const data=JSON.parse(document.querySelector('#updateHistoryData').textContent).entries;
     document.querySelector('#moreUpdates').click();[...document.querySelectorAll('#updateFilters button')].find(b=>b.textContent==='Sửa lỗi').click();
     const search=document.querySelector('#updateSearch');search.value='saudi';search.dispatchEvent(new Event('input',{bubbles:true}));
     return {first:data[0],visible:document.querySelector('#updateTimeline').innerText,overflow:document.documentElement.scrollWidth>innerWidth+1};
    });assert.equal(history.first.id,expected.id);assert.equal(history.first.releaseStatus,expected.releaseStatus);assert(history.visible.includes('Saudi'));assert(!history.overflow);
    assert.deepEqual(p.errors,[]);console.log('PASS saudi-spain970-browser: contract, surname order, baby name, save reload and history '+width);
   }catch(error){console.error(p.errors);throw error;}finally{p.close();}
  }
 }finally{if(browser)await browser.close();server.kill();}
})().catch(error=>{console.error(error);process.exit(1);});
