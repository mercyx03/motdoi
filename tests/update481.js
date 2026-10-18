'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..','public'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [,f]of html.matchAll(/<script src="(js\/[^?]+)\?v=[^"]+"><\/script>/g))if(!['js/app.js','js/music.js','js/card.js'].includes(f))vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});



const {E}=G,M=E.MARKET;let n=0;function ok(x,t){assert.ok(x,t);n++;}function near(x,y,t){ok(Math.abs(x-y)<1e-7*Math.max(1,Math.abs(y)),t);}
function life(seed=48101){const l=E.createLife({mode:'vn',seed});l.age=30;l.indep=true;l.money=10000;l.pending=[];l.flags={};l.jailUntil=null;l.abroad=null;M.book(l);return l;}
function trade(l,symbol,side,quantity){const d=E.DEC.market_trade.make(l,()=>.5,{symbol,side,quantity:String(quantity)});l.pending=[d];E.resolve(l,'confirm');return d;}
let up=0,down=0,goldUp=0,goldDown=0,etf=[],stock=[];
for(let i=1;i<=600;i++){
 const l=life(i);l.marketBook.marketRs=i;const rs=l.rs,quotes=JSON.stringify(l.marketBook.quotes);M.simulateYear(l,null,()=>{});
 ok(l.rs===rs,'market RNG separate');ok(JSON.stringify(l.marketBook.quotes)!==quotes,'annual changes');
 for(const s of M.symbols){const q=M.quote(l,s);ok(q.bid>0&&q.ask>=q.bid&&Number.isFinite(q.bid),'valid spread and positive price');ok(q.simYear===l.birthYear+l.age,'simulation year explicit');}
 const q=M.quote(l,'FPT'),g=M.quote(l,'SJC');if(q.change>0)up++;else if(q.change<0)down++;if(g.change>0)goldUp++;else if(g.change<0)goldDown++;
 near(g.change,M.quote(l,'NHAN').change,'golds share trend');etf.push(M.quote(l,'SPY').change);stock.push(M.quote(l,'NVDA').change);
 const after=JSON.stringify(l.marketBook);M.simulateYear(l,null,()=>{});ok(JSON.stringify(l.marketBook)===after,'one change per age');
 const a=JSON.parse(JSON.stringify(l)),b=JSON.parse(JSON.stringify(l));E.migrate(b);a.age++;b.age++;M.simulateYear(a,null,()=>{});M.simulateYear(b,null,()=>{});ok(JSON.stringify(a.marketBook)===JSON.stringify(b.marketBook),'save/resume deterministic next price');
}
ok(up>150&&down>150&&goldUp>150&&goldDown>150,'both directions occur');function sd(a){const mean=a.reduce((x,y)=>x+y)/a.length;return Math.sqrt(a.reduce((x,y)=>x+(y-mean)**2,0)/a.length);}ok(sd(etf)<sd(stock),'ETF lower volatility than high volatility stock');
{
 const l=life();trade(l,'FPT','buy',10);trade(l,'SJC','buy',2);const positions=JSON.stringify(l.marketBook.positions),old=E.DEC.market_trade.make(l,()=>.5,{symbol:'FPT',side:'sell',quantity:'1'});M.simulateYear(l,null,()=>{});ok(JSON.stringify(l.marketBook.positions)===positions,'quantity and basis unchanged');ok(!M.valid(l,old.data),'annual price invalidates old invoice');
 const snap=JSON.stringify(l.marketBook),data=JSON.parse(JSON.stringify(G.MARKET_SEED));data.quotes.FPT.bid*=2;data.quotes.FPT.ask*=2;data.fx.usdVnd*=1.1;M.sync(l,data);ok(JSON.stringify(l.marketBook)===snap,'real quote refresh cannot reset simulated price or FX');
 ok(M.stamp(M.quote(l,'FPT')).includes('Giá mô phỏng năm'),'source and sim separate');
}
{
 const l=life(),q=M.quote(l,'FPT'),price=q.ask;trade(l,'FPT','buy',10);q.bid=q.ask=price*1.1;l.marketBook.revision++;
 const d=E.DEC.market_trade.make(l,()=>.5,{symbol:'FPT',side:'sell',quantity:'4'}),e=M.evaluate(l,d.data);near(e.average,price,'original buy price');near(e.percent,10,'ten percent rise');near(e.difference,price*.1,'rise per share');near(e.profit,price*.1*4,'profit for partial sale');
 const text=M.summary(l,d.data);ok(text.includes('giá mua bình quân')&&text.includes('tăng')&&text.includes('Lãi'),'preview has comparison');const cash=l.money;l.pending=[d];const logs=E.resolve(l,'confirm');near(l.money-cash,e.cash,'exact proceeds');ok(logs.some(x=>x.t.includes('So với giá mua bình quân')),'journal records comparison');near(l.marketBook.positions.FPT.qty,6,'six remain');
 q.bid=q.ask=price*1.2;l.marketBook.revision++;trade(l,'FPT','buy',10);const average=(price*6+price*1.2*10)/16;const sale=E.DEC.market_trade.make(l,()=>.5,{symbol:'FPT',side:'sell',quantity:'5'});q.bid=price*.9;const loss=M.evaluate(l,sale.data);near(loss.average,average,'weighted average across purchases');ok(loss.percent<0&&loss.profit<0&&M.summary(l,sale.data).includes('Lỗ'),'loss displayed');
 l.marketBook.positions.FPT.basis=0;const zero=M.evaluate(l,sale.data);ok(zero.percent===null&&!M.summary(l,sale.data).includes('Infinity'),'zero basis no infinite percentage');
}
{
 const l=life();trade(l,'NHAN','buy',2);const d=E.DEC.market_trade.make(l,()=>.5,{symbol:'NHAN',side:'sell',quantity:'.5'});d.data.quantity='0.5';const e=M.evaluate(l,d.data);ok(e.profit<0&&e.percent<0,'gold spread immediate loss');ok(M.comparison(l,d.data).includes('chênh lệch mua–bán'),'explains spread');near(e.profit,(M.quote(l,'NHAN').bid-M.quote(l,'NHAN').ask)*.5,'gold exact partial loss');
}
console.log('4.8.1: '+n+' checks passed; random prices up/down, deterministic saves, purchase-price comparison');
