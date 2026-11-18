'use strict';
const assert=require('node:assert/strict'),{spawn}=require('node:child_process');
const {launch,page,sleep}=require('./lib/cdp'),expected=require('../public/data/updates.json').entries[0];
const port=+process.env.PORT||8802,url='http://127.0.0.1:'+port+'/';
function seed(kind){
 const E=G.E,l=E.createLife({mode:'world',country:kind==='recovery'?'US':'JP',year:kind==='recovery'?1930:1952,seed:969});
 Object.assign(l,{age:kind==='recovery'?10:18,alive:true,pending:[],sched:[],job:null,school:null,schoolEnd:null,indep:kind!=='recovery',money:l.base*100,edu:2,abroad:null,_yearRun:true,acts:0});
 delete l.fam.orphan;delete l.flags.orphanCarer;delete l.flags.royal;E.LIFE138.state(l).care='bố mẹ';
 let d;
 if(kind==='recovery'){
  l.city=l.place='New York';l.school='primary';l.schoolEnd=11;l.edu=1;
  Object.assign(l.fam,{mAlive:true,fAlive:true,noMom:false,noDad:false,q:5,mInc:l.base*10,fInc:l.base*10});
  E.ERA920.HIST.open(l,'displaced',2);E.H.moveToCity(l,'Chicago');d=E.DEC.recovery969.make(l,()=>0);
 }else d=E.DEC.vocational969.make(l,()=>0,{id:'self'});
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
    const geography=await p.eval(()=>{
     const year=document.querySelector('#yearSel');year.value='1980';year.dispatchEvent(new Event('change',{bubbles:true}));
     const province=G.VN.P63.find(p=>p.name==='Nghệ An'),select=document.querySelector('#provSel');select.value=String(province.id);select.dispatchEvent(new Event('change',{bubbles:true}));
     return {option:select.selectedOptions[0].textContent,profile:document.querySelector('#heroProfile').innerText};
    });assert(geography.option.includes('Nghệ Tĩnh')&&geography.profile.includes('Nghệ Tĩnh'));
    for(const kind of ['recovery','vocational']){
     await p.eval(seed,kind);await p.reload();await p.eval(async()=>{await MotDoiBoot.load();document.querySelector('#resumeBtn').click();});await sleep(150);
     const text=kind==='recovery'?'Nhờ người thân giúp thu xếp':'Kōsen';
     assert(await p.eval(text=>{const b=[...document.querySelectorAll('.opt')].find(b=>b.innerText.includes(text));if(!b)return false;b.click();return true;},text),kind+' option');
     await sleep(200);
     await p.eval(()=>{const confirm=[...document.querySelectorAll('#modalRoot button')].find(b=>b.textContent.trim()==='Chắc chắn, tiếp tục');if(confirm)confirm.click();});await sleep(200);
     const state=await p.eval(()=>JSON.parse(localStorage.getItem('mkn.current')).life);
     if(kind==='recovery')assert.equal(state.flags.hist920.open.find(o=>o.k==='displaced').recovery969.housing,'family');
     else{assert.equal(state.school,'voc');assert.equal(state.edu,2);assert.equal(state.flags.expansion110.courses170.at(-1).route969.id,'kosen');}
     await p.reload();await p.eval(async()=>{await MotDoiBoot.load();document.querySelector('#resumeBtn').click();});await sleep(100);
     assert(await p.eval(()=>document.documentElement.scrollWidth<=innerWidth+1));
    }
    await p.load(url+'updates.html');
    const history=await p.eval(()=>{
     const data=JSON.parse(document.querySelector('#updateHistoryData').textContent).entries;
     document.querySelector('#moreUpdates').click();
     const filters=[...document.querySelectorAll('#updateFilters button')];filters.find(b=>b.textContent==='Sửa lỗi').click();
     const search=document.querySelector('#updateSearch');search.value='so tan';search.dispatchEvent(new Event('input',{bubbles:true}));
     return {first:data[0],visible:document.querySelector('#updateTimeline').innerText,overflow:document.documentElement.scrollWidth>innerWidth+1};
    });assert.equal(history.first.version,'9.6.9');assert.equal(history.first.releaseStatus,expected.releaseStatus);
    assert(history.visible.includes('cuộc sống sau sơ tán'));assert(history.visible.includes(expected.releaseStatus==='released'?'Đã phát hành':'Bản chuẩn bị'));assert(!history.overflow);
    assert.deepEqual(p.errors,[]);console.log('PASS era969-browser: dated region, recovery, Kosen admission/save reload and update history '+width);
   }catch(error){console.error(p.errors);throw error;}finally{p.close();}
  }
 }finally{if(browser)await browser.close();server.kill();}
})().catch(error=>{console.error(error);process.exit(1);});
