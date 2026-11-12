'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'), http=require('node:http'), path=require('node:path');
const {launch,page,sleep}=require('./lib/cdp');
const root=path.resolve(__dirname,'../dist');

async function exercise(browser,width){
  const hits=[];
  const server=http.createServer((req,res)=>{
    const url=new URL(req.url,'http://localhost');
    let name=url.pathname==='/'?'index.html':url.pathname.slice(1);
    if(!/^[a-zA-Z0-9_./-]+$/.test(name)||name.includes('..')){res.writeHead(404).end();return;}
    if(/^assets\/game-0\./.test(name)){
      hits.push(url.search);
      if(!url.searchParams.has('motdoi_retry')){
        res.writeHead(200,{'Content-Type':'text/html','X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=31536000, immutable'}).end(fs.readFileSync(path.join(root,'index.html')));return;
      }
    }
    const file=path.join(root,name);
    if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
    res.writeHead(200,{'Content-Type':name.endsWith('.js')?'application/javascript':name.endsWith('.html')?'text/html':'application/octet-stream'}).end(fs.readFileSync(file));
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  let p;
  try{
    const url='http://127.0.0.1:'+server.address().port+'/';p=await page(browser,url,{width,height:900});
    await p.eval(()=>document.querySelector('#bornBtn').click());
    for(let i=0;i<80&&!await p.eval(()=>window.MotDoiBoot?.isReady());i++)await sleep(100);
    assert(await p.eval(()=>window.MotDoiBoot.isReady()&&!!window.G.App),'game loads after HTML fallback');
    assert(await p.eval(()=>!!localStorage.getItem('mkn.current')),'original Chao doi click created a saved life');
    assert(hits.includes('')&&hits.filter(q=>q.startsWith('?motdoi_retry=')).length===1,'one fresh request for failed chunk');
    assert.equal(await p.eval(()=>Array.from(document.scripts).filter(s=>/\/assets\/game-/.test(s.src)).length),4);
    assert.deepEqual(p.errors,[]);
    await p.load(url+'updates.html');
    assert(await p.eval(()=>{const a=document.querySelectorAll('#updateTimeline article');return a[0].textContent.includes('8.10.41')&&a[1].textContent.includes('8.10.40')&&a[1].textContent.includes('Đã phát hành')&&document.documentElement.scrollWidth<=innerWidth+1;}));
    console.log('PASS stale CDN HTML recovery, game initialization and update layout at '+width+' px');
  }finally{if(p)p.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
}
(async()=>{const browser=await launch();try{for(const width of [390,1280])await exercise(browser,width);}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
