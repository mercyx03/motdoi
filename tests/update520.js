'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..','public'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [,f]of html.matchAll(/<script src="(js\/[^"?]+)\?v=[^"]+"[^>]*><\/script>/g))if(!['js/app.js','js/music.js','js/card.js','js/account.js'].includes(f))vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
const E=G.E,W=G.W,C=G.CUR,M=G.WEC;let n=0;const outcomes=[];
function ok(v,t){assert.ok(v,t);n++;}function near(a,b,t){ok(Math.abs(a-b)<Math.max(1,Math.abs(b))*1e-9,t);}
function life(code,urban=true){const l=E.createLife({mode:code==='VN'?'vn':'world',country:code,seed:52001,urban});l.age=30;l.school=null;l.indep=true;l.retired=false;l.pensioned=false;l.pending=[];l.edu=1;l.uniTier=1;l.money=l.base*10;return l;}
function nominal(l,x){return l.cur==='vnd'?x*1e6/C.VND:x*C.priceLevel((W.BY[l.abroad&&l.abroad.code]||W.BY[l.country]).gdp);}
ok(Object.keys(M.data.countries).length===194,'194 profiles');ok(!M.data.countries.VN,'VN excluded');
const reference=life('VN');near(E.monthlyEst(reference,'bao_ve',0),8*Math.pow(reference.base/90,.45),'VN pay matches table (v7.4: bảo vệ 8 triệu)');
for(const c of W.C.filter(x=>x.code!=='VN')){
 const l=life(c.code),d=M.data.countries[c.code];ok(d&&d.usd>0&&d.gdpPPP>0&&d.consumptionPLI>0,'complete profile '+c.code);ok(['ilo','estimate'].includes(d.source)||d.source.startsWith('proxy:'),'transparent source '+c.code);
 ok(Number.isFinite(l.base)&&l.base>0,'living base '+c.code);
 for(const id of ['bao_ve','phuc_vu','giup_viec','phu_ho','nong','van_phong']){
  const wage=E.monthlyEst(l,id,0);ok(Number.isFinite(wage)&&wage>0,'salary '+c.code+' '+id);
  const j=E.CAR&&E.CAR[id];if(j&&j.t.length>1)ok(E.monthlyEst(l,id,j.t.length-1)>=wage,'career progression '+c.code+' '+id);
 }
 const rural=life(c.code,false);ok(E.monthlyEst(rural,'bao_ve',0)<E.monthlyEst(l,'bao_ve',0),'rural labour market '+c.code);ok(rural.base<l.base,'rural living cost '+c.code);
 const annual=d.usd*12/C.priceLevel(c.gdp);ok(l.base>=annual*.45*1.1-1e-6&&l.base<=annual*.9*1.1+1e-6,'household budget not GDP windfall '+c.code);
}
for(const code of ['JP','KR','US']){const l=life(code);l.edu=5;const pilot=nominal(l,E.monthlyEst(l,'phi_cong',3));ok(pilot<M.data.countries[code].usd*12,'professional premium is not a linear GDP multiplier');}
const vn=nominal(reference,E.monthlyEst(reference,'bao_ve',0)),samples={};
for(const code of ['JP','KR','TH','US']){const l=life(code);samples[code]=nominal(l,E.monthlyEst(l,'bao_ve',0));ok(samples[code]>vn,'higher nominal wage '+code);}
ok(samples.JP>vn*4&&samples.KR>vn*4&&samples.TH<vn*3,'wage differences follow data, no arbitrary Thai multiplier');
{
 const l=life('JP');l.job={id:'bao_ve',rank:0,yrs:2,last:1e10,lastRk:0,floor:1e10,floorRk:0};l.workYrs=2;const cash=l.money;E.careerYear(l,()=>.5,()=>{},'balance');ok(l.job.last<1e8,'old salary floor reanchors');near(l.money,cash,'reanchor does not confiscate savings');
 const base=l.base;l.base=1;E.migrate(l);near(l.base,base,'old save refreshes cost base');
}
{
 const l=life('US');l.money=10000;const worth=E.netWorth(l);E.H.emigrate(l,['TH',W.BY.TH.name,'th'],()=>.5,()=>{});near(nominal(l,E.netWorth(l)),worth*C.priceLevel(W.BY.US.gdp),'new labour market preserves asset value');near(M.scale(l),M.scale(life('TH')),'destination wages match born residents');
}
for(const c of W.C.filter(x=>x.code!=='VN')){
 const l=E.createLife({mode:'world',country:c.code,seed:520000+c.code.charCodeAt(0)*100+c.code.charCodeAt(1)});
 E.runHeadless(l,x=>{ok(Number.isFinite(x.money)&&Number.isFinite(x.base)&&Number.isFinite(E.netWorth(x)),'finite finances '+c.code);if(x.fin)ok(Number.isFinite(x.fin.inc)&&Number.isFinite(x.fin.spend||0),'finite year '+c.code);});
 ok(!l.alive,'full life '+c.code);outcomes.push({code:c.code,age:l.age,netUSD:nominal(l,E.netWorth(l))});
}
const cards=[...html.matchAll(/<div class="feat">/g)];ok(cards.length===8,'eight introduction cards');ok(html.includes('Một đời khắp thế giới')&&html.includes('Gia đình qua từng thế hệ'),'new cards');
// GĐ6: ghi vào .cache (bị Git bỏ qua) — audit-world-520.json ở gốc là file riêng của chủ dự án, không được ghi đè.
fs.mkdirSync(path.join(__dirname,'..','.cache'),{recursive:true});fs.writeFileSync(path.join(__dirname,'..','.cache','audit-world-520.json'),JSON.stringify({samplesUSD:samples,referenceUSD:vn,outcomes},null,2));
console.log('V5.2: '+n+' checks passed; 194 countries, 194 complete lives; sample guard pay USD/month '+JSON.stringify(samples));
