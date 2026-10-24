'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..','public'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [,f]of html.matchAll(/<script src="(js\/[^"?]+)\?v=[^"]+"[^>]*><\/script>/g))if(!['js/app.js','js/music.js','js/card.js','js/account.js'].includes(f))vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});


const {E,CUR}=G,M=E.MARKET;let n=0;function ok(x,t){assert.ok(x,t);n++;}function near(x,y,t){ok(Math.abs(x-y)<1e-7*Math.max(1,Math.abs(y)),t+' '+x+' '+y);}
function life(country='VN'){let l=E.createLife({mode:country==='VN'?'vn':'world',country,seed:48001});l.age=30;l.alive=true;l.indep=true;l.jailUntil=null;l.abroad=null;l.flags={};l.pending=[];l.money=l.base*100;M.book(l);return l;}
function make(l,symbol,side='buy',quantity='1',unit='base'){return E.DEC.market_trade.make(l,()=>.5,{symbol,side,quantity,unit});}
function run(l,d,k='confirm'){l.pending=[d];E.resolve(l,k);}
for(const country of ['VN','US','JP','NG'])for(const symbol of M.symbols){
 const l=life(country),q=M.quote(l,symbol),qty=q.kind==='gold'?'2.5':'17',d=make(l,symbol,'buy',qty),before=l.money,nw=E.netWorth(l),amount=Number(qty);
 ok(M.valid(l,d.data),'quote valid');ok(M.evaluate(l,d.data).ok,'affordable');run(l,d);
 near(l.marketBook.positions[symbol].qty,amount,'units acquired');near(before-l.money,M.convert(l,q.ask*amount,q.currency),'correct cost');
 near(E.netWorth(l),nw-M.convert(l,(q.ask-q.bid)*amount,q.currency),'no duplicate assets, only spread');
 const cash=l.money,held=l.marketBook.positions[symbol].qty;E.DEC.market_trade.apply(l,d,'confirm',()=>.5,()=>{});near(l.money,cash,'duplicate no charge');near(l.marketBook.positions[symbol].qty,held,'duplicate no units');
 const fraction=q.kind==='gold'?'0.7':'5',sale=make(l,symbol,'sell',fraction),basis=l.marketBook.positions[symbol].basis;
 run(l,sale);near(l.marketBook.positions[symbol].qty,amount-Number(fraction),'partial sell units');near(l.money-cash,M.convert(l,q.bid*Number(fraction),q.currency),'correct sale proceeds');near(l.marketBook.positions[symbol].basis,basis*(amount-Number(fraction))/amount,'proportional basis');
 const all=make(l,symbol,'sell',String(M.max(l,symbol,'sell')));run(l,all);ok(!l.marketBook.positions[symbol],'full sale clears holding');
}
{
 const l=life(),q=M.quote(l,'SJC'),d=make(l,'SJC','buy','0,25','luong'),before=l.money;run(l,d);near(l.marketBook.positions.SJC.qty,2.5,'comma and luong conversion');near(before-l.money,q.ask*2.5/1e6,'correct chi/luong cost');
}
for(const symbol of ['SJC','FPT'])for(const bad of ['0','-1','NaN','Infinity','1e5','0x10','1,2,3','<script>','',null,'1000000001',symbol==='SJC'?'0.01':'1.5']){const l=life(),d=make(l,symbol);d.data.quantity=bad;const cash=l.money;ok(!M.evaluate(l,d.data).ok,'bad input '+bad);E.DEC.market_trade.apply(l,d,'confirm',()=>.5,()=>{});ok(l.money===cash&&!l.marketBook.positions[symbol],'invalid cannot transact');}
for(const change of [l=>{l.money=0;},l=>{l.age++;},l=>{l.cur='usd';},l=>{l.gdp++;},l=>{l.jailUntil=35;},l=>{l.flags.military=35;},l=>{l.abroad={code:'KH',trapped:true};},l=>{l.alive=false;},l=>{l.indep=false;}]){const l=life(),d=make(l,'FPT');change(l);const cash=l.money;ok(!M.evaluate(l,d.data).ok,'state changed invalid');E.DEC.market_trade.apply(l,d,'confirm',()=>.5,()=>{});ok(l.money===cash&&!l.marketBook.positions.FPT,'no stale charge');}
{
 const l=life();l.age=17;ok(!E.DEC.market_menu.valid(l),'no trading under 18');l.age=30;const d=make(l,'FPT','sell','1');ok(!M.evaluate(l,d.data).ok,'no short sale');
 l.money=1;const gold=make(l,'SJC','buy','1');ok(!M.evaluate(l,gold.data).ok,'not enough funds');
 const max=M.max(l,'FPT','buy'),buy=make(l,'FPT','buy',String(max));run(l,buy);ok(l.money>=0,'max cannot overdraw');
}
{
 const l=life(),d=make(l,'FPT'),data=JSON.parse(JSON.stringify(G.MARKET_SEED));data.quotes.FPT.bid+=100;data.quotes.FPT.ask+=100;ok(M.sync(l,data),'prices updated');ok(!M.valid(l,d.data),'quote changed invalidates confirmation');const q=make(l,'FPT');near(M.evaluate(l,q.data).price,data.quotes.FPT.ask,'requote updated price');
 const old=JSON.parse(JSON.stringify(data));old.quotes.FPT.asOf='2020-01-01';old.quotes.FPT.ask=1;const price=M.quote(l,'FPT').ask;M.sync(l,old);near(M.quote(l,'FPT').ask,price,'older cannot overwrite');
 for(const bad of [NaN,-1,Infinity,0]){data.quotes.FPT.ask=bad;M.sync(l,data);near(M.quote(l,'FPT').ask,price,'invalid price rejected');}
}
for(const country of ['VN','US']){
 const l=life(country);l.assets.gold=l.base*3;l.basis.gold=l.base*2;l.port={FPT:{v:l.base*2,basis:l.base},AAPL:{v:l.base*2,basis:l.base}};
 const money=l.money,nw=E.netWorth(l),d=E.DEC.market_convert.make(l,()=>.5);ok(E.DEC.market_convert.valid(l,d.data),'can convert old');run(l,d,'convert');near(l.money,money,'conversion no cash');near(E.netWorth(l),nw,'conversion preserves net worth');ok(Object.keys(l.marketBook.positions).length>=2,'converted to units');const after=JSON.stringify(l.marketBook);E.DEC.market_convert.apply(l,d,'convert',()=>.5,()=>{});ok(JSON.stringify(l.marketBook)===after,'conversion no replay');
}
{
 const l=life();run(l,make(l,'FPT','buy','100'));run(l,make(l,'SJC','buy','3'));const holding=JSON.stringify(l.marketBook.positions),value=M.value(l);E.finishYear(l);ok(JSON.stringify(l.marketBook.positions)===holding,'year cannot randomize holdings or invent dividends');ok(M.value(l)!==value,'market prices evolve once per game year');
 const clone=JSON.parse(JSON.stringify(l));E.migrate(clone);ok(JSON.stringify(clone.marketBook)===JSON.stringify(l.marketBook),'save migration preserves book');near(E.netWorth(clone),E.netWorth(l),'save net worth');
 const now=M.value(l);l.cur='usd';l.gdp=G.W.BY.US.gdp;near(M.value(l),now*1e6/l.marketBook.fx.usdVnd/CUR.priceLevel(l.gdp),'migration currency converts holdings by spot fx');
 const pf=E.profile(l);ok(pf.assets.some(a=>a[0].includes('100 cổ phiếu')),'profile exposes units');near(pf.net,E.netWorth(l),'profile total matches');
}
{
 const l=life();l.money=1e20;const huge=make(l,'SJC','buy','1000000000');ok(!M.evaluate(l,huge.data).ok,'reject unsafe integer money');const cap=make(l,'SJC','buy',String(M.max(l,'SJC','buy')));ok(M.evaluate(l,cap.data).ok,'maximum respects precision bounds');
 const zero=life();zero.assets.gold=100;zero.basis.gold=0;const d=E.DEC.market_convert.make(zero,()=>.5);run(zero,d,'convert');near(zero.marketBook.positions.NHAN.basis,0,'conversion preserves zero cost basis');
}
(async()=>{
 const l=life(),before=JSON.stringify(l.marketBook),good=async()=>Response.json(G.MARKET_SEED);
 await M.refresh(l,good,()=>false);ok(JSON.stringify(l.marketBook)===before,'closed view ignores late response');
 await assert.rejects(()=>M.refresh(l,async()=>new Response('<html>',{headers:{'Content-Type':'text/html'}})));n++;
 await assert.rejects(()=>M.refresh(l,async()=>Response.json({quotes:{fake:{bid:1,ask:1}}})));n++;
 const source=fs.readFileSync(path.join(root,'_worker.js'),'utf8'),worker=(await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))).default;
 const original=global.fetch,seed=JSON.parse(fs.readFileSync(path.join(root,'data/market-prices.json'),'utf8')),calls=[];
 const fixtures={vn:JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/market-vn.json'),'utf8')),us:JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/market-us.json'),'utf8')),gold:JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/market-gold.json'),'utf8')),fx:JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/market-fx.json'),'utf8'))};
 const env={ASSETS:{fetch:async req=>new URL(req.url).pathname==='/data/market-prices.json'?Response.json(seed):new Response('ASSET')}};
 global.fetch=async url=>{calls.push(url);if(url.includes('stock_prices')){const s=new URL(url).searchParams.get('q').slice(5);return Response.json(fixtures.vn[s]);}if(url.includes('finance.yahoo')){const s=new URL(url).pathname.split('/').pop();return Response.json(fixtures.us[s]);}if(url.includes('vang.today'))return Response.json(fixtures.gold);if(url.includes('er-api'))return Response.json(fixtures.fx);throw Error('unexpected url');};
 try{
  let r=await worker.fetch(new Request('https://motdoi.site/api/market?url=https://bad.invalid'),env);let data=await r.json();ok(r.status===200&&Object.keys(data.quotes).length===16&&!data.errors.length,'worker live parsers');ok(calls.length===15&&calls.every(x=>!x.includes('bad.invalid')),'15 fixed upstream calls, no open proxy');ok(r.headers.get('cache-control').includes('300'),'5 minute caching');
  ok((await worker.fetch(new Request('https://motdoi.site/'),env)).status===200,'asset passthrough');ok((await worker.fetch(new Request('https://motdoi.site/api/market',{method:'POST'}),env)).status===405,'read only endpoint');
  global.fetch=async()=>{throw Error('offline');};r=await worker.fetch(new Request('https://motdoi.site/api/market'),env);data=await r.json();ok(data.errors.length===15,'all failures visible');ok(data.quotes.FPT.asOf===seed.quotes.FPT.asOf,'outage does not forge fresh quote time');
  global.fetch=async()=>Response.json({bad:true});data=await(await worker.fetch(new Request('https://motdoi.site/api/market'),env)).json();ok(data.errors.length===15,'malformed sources fall back');
 }finally{global.fetch=original;}
 let scenes=0;for(let i=0;i<50;i++){const x=E.createLife({mode:i%2?'world':'vn',country:i%2?'US':undefined,seed:480000+i});E.runHeadless(x);ok(!x.alive&&Number.isFinite(E.netWorth(x)),'whole life finishes and finances finite');if(x.marketBook)scenes+=Object.keys(x.marketBook.positions).length;}
 console.log('4.8.0: '+n+' checks passed; 16 instruments, 50 full lives, '+scenes+' held positions');
})().catch(e=>{console.error(e);process.exitCode=1;});
