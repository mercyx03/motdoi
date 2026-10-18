// Compare business balance with consistent seeds; amounts reported in million VND.
const fs=require('fs'),vm=require('vm');Math.random=()=>.5;
const baseline=process.argv.includes('--before-business-balance');
for(const [,f]of fs.readFileSync('public/index.html','utf8').matchAll(/<script src="(js\/[^?]+)\?v=[^"]+"><\/script>/g)){
 if(['js/app.js','js/music.js','js/card.js'].includes(f))continue;
 let source=fs.readFileSync('public/'+f,'utf8');
 if(baseline&&f==='js/wealth.js'){
  source=source.replace('      dem *= v.market;','').replace("      if (ch(r, .08)) { dem *= .65; log('Khách giảm vì đối thủ mới hoặc nhu cầu chững lại: ' + v.n + '.', 'neutral'); }",'');
  source=source.replace('var overhead = R * Math.min(.12, Math.max(0, v.br - 1) * .02);','var overhead = 0;').replace('var renewal = v.cap * .025;','var renewal = 0;').replace('var manager = a >= 65 || l.job ? rev * .03 : 0;','var manager = 0;');
  source=source.replace("      H.cash(l, -p.v * .012, 'Bảo trì và quản lý ' + p.n);",'');
 }
 vm.runInThisContext(source,{filename:f});
}
const rows=[];
for(let i=0;i<100;i++){
 const l=G.E.createLife({mode:'vn',seed:880100+i});G.E.runHeadless(l);
 const value=G.E.netWorth(l),gdp=(G.W.BY[l.abroad&&l.abroad.code]||{}).gdp||l.gdp;
 rows.push({seed:880100+i,q:l.fam.q,vnd:l.cur==='vnd'?value:G.CUR.toVND(gdp,value),job:l.peakTitle||'',cur:l.cur});
}
function stats(a){const v=a.map(x=>x.vnd/1000).sort((a,b)=>a-b);return{n:v.length,medianB:v[Math.floor(v.length*.5)],p90B:v[Math.floor(v.length*.9)],maxB:v.at(-1),above500B:v.filter(x=>x>500).length};}
const result={note:'Business-cost comparison only; both runs include the currency-conversion fix. Different decisions may follow changed cash balances.',all:stats(rows),poor:stats(rows.filter(x=>x.q<=2)),rich:stats(rows.filter(x=>x.q>=4)),rows};
fs.writeFileSync('audit-wealth-511'+(baseline?'-before-business':'-after')+'.json',JSON.stringify(result,null,2));console.log(JSON.stringify({baseline,all:result.all,poor:result.poor,rich:result.rich}));
