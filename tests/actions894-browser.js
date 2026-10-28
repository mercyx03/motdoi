'use strict';
const assert=require('assert'),path=require('path'),fs=require('fs'),{launch,page,sleep}=require('./lib/cdp');
(async()=>{const keep=setInterval(()=>{},1000);let chrome;try{chrome=await launch();for(const width of [390,1280]){
 const p=await page(chrome,process.env.TEST_URL||'http://127.0.0.1:8087/',{width,height:900});
 await p.eval(()=>document.querySelector('#setup').scrollIntoView());
 for(let i=0;i<120;i++){if(await p.eval(()=>!!(window.G&&G.E&&G.SaveStore)))break;await sleep(100);}
 assert(await p.eval(()=>!!(G.E&&G.SaveStore)),'game loaded');
 assert(await p.eval(()=>!document.querySelector('#difficultyChips')),'Hardcore removed');
 await p.eval(()=>{const E=G.E,l=E.createLife({mode:'vn',seed:89421});l.age=19;l.indep=true;l.money=l.base*100;l.school=null;l.pending=[];l.acts=0;l._yearRun=true;l.flags.actAt={};E.act(l,'dateFilters114');localStorage.setItem('mkn.current',JSON.stringify({life:l,cohort:[],auto:false,speed:1}));});
 await p.reload();await p.eval(()=>document.querySelector('#resumeBtn').click());
 for(let i=0;i<120;i++){if(await p.eval(()=>!!document.querySelector('.opt[data-k="1"]')))break;await sleep(100);}
 await p.eval(()=>document.querySelector('.opt[data-k="1"]').click());
 assert(await p.eval(()=>[...document.querySelectorAll('.opt b')].some(b=>b.textContent==='✓ Y tế')),'filter click visibly updates');
 await p.eval(()=>document.querySelector('.opt[data-k="2"]').click());
 assert(await p.eval(()=>[...document.querySelectorAll('.opt b')].some(b=>b.textContent==='✓ Giáo dục')),'second click remains interactive');
 await p.eval(()=>document.querySelector('.opt[data-k="cancel"]').click());
 const state=await p.eval(()=>JSON.parse(localStorage.getItem('mkn.current')).life);assert.equal(state.acts,0);assert.equal(state.flags.life114.dateJob,'edu');
 await p.eval(()=>{document.querySelector('#pauseBtn').click();const b=[...document.querySelectorAll('[data-ag]')].find(b=>b.textContent.includes('Học tập'));if(b&&!b.classList.contains('on'))b.click();document.querySelector('#actPanel').scrollIntoView();});
 const layout=await p.eval(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,groups:[...document.querySelectorAll('[data-ag]')].map(b=>b.textContent),border:document.querySelector('.action-level-label')&&getComputedStyle(document.querySelector('.action-level-label')).borderTopWidth}));assert(!layout.overflow,'no horizontal overflow');assert.equal(layout.border,'2px','visible group divider');
 fs.mkdirSync('.cache/actions894',{recursive:true});await p.screenshot(path.resolve('.cache/actions894/actions-'+width+'.png'));assert.deepEqual(p.errors,[]);p.close();console.log('PASS Chrome '+width+': filter clicks, persistence, zero browsing cost, no overflow/runtime errors');
 }}finally{if(chrome)await chrome.close();clearInterval(keep);}})().catch(e=>{console.error(e);process.exitCode=1;});
