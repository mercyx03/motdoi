'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..','public'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [,f]of html.matchAll(/<script src="(js\/[^?]+)\?v=[^"]+"><\/script>/g))if(!['js/app.js','js/music.js','js/card.js'].includes(f))vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
const E=G.E;let checks=0, losses=0;
function ok(v,m){assert.ok(v,m);checks++;}
function near(a,b,m){ok(Math.abs(a-b)<Math.max(1,Math.abs(b))*1e-9,m);}
function life(){const l=E.createLife({mode:'vn',seed:511});l.age=40;l.indep=true;l.pending=[];l.money=10000;l.job=null;l.ownHouse=false;l.vehK=null;l.mkt={stock:'bình thường',land:'bình thường'};return l;}
{
 const l=life();l.partner={inc:50};l.si={sum:4000,m:30,yrs:20};l.pensionInc=300;l.lastIncome=600;l.job={id:'fl_it',last:900,floor:950,sportPrevSalary:700};l.props=[{v:4000,basis:3500}];l.ventures=[{cap:1800,unit:900,R:4000,br:2,q:1,last:{rev:5000,cost:4000,prof:1000}}];l.loans=[{bal:500}];l.marketBook={quotes:{},positions:{FPT:{qty:0,basis:2000000}}};
 const before=JSON.parse(JSON.stringify(l)),net=E.netWorth(l);E.abroadConvert(l,80);
 near(l.partner.inc,4000,'partner converts');near(l.fam.mInc,before.fam.mInc*80,'parent income converts');near(l.fam.fInc0,before.fam.fInc0*80,'parent original income converts');near(l.si.sum,320000,'pension basis converts');near(l.job.last,72000,'salary floor converts');near(l.props[0].v,320000,'rental property converts');near(l.ventures[0].R,320000,'business revenue converts');near(E.netWorth(l),net*80,'net worth scales once');ok(l.marketBook.positions.FPT.basis===2000000,'explicit market currency unchanged');
 E.abroadConvert(l,1/80);for(const k of ['money','lastIncome','pensionInc'])near(l[k],before[k],k+' round trip');near(l.si.sum,before.si.sum,'insurance round trip');near(E.netWorth(l),net,'net worth round trip');ok(l.si.yrs===20&&l.ventures[0].br===2,'counts unchanged');
}
{
 const l=life();l.partner={inc:50};l.si={sum:4000,m:30,yrs:20};l.pensionInc=300;
 const before=l.money,country=G.W.BY.US,f=1e6/G.CUR.VND/G.CUR.priceLevel(country.gdp);
 E.H.emigrate(l,['US',country.name,'en'],()=>.5,()=>{});
 near(l.money,before*f,'emigration uses shared conversion');near(l.pensionInc,300*f,'emigration pension');near(l.si.sum,4000*f,'emigration insurance');near(l.partner.inc,50*f,'emigration partner');
}
{
 const l=life();l.props=[];l.ventures=[{k:'spa',n:'spa',cap:1800,unit:1800,br:1,R:3840,q:1,yrs:3,bad:0,good:0}];
 E.wealth.investYear(l,()=>.5,()=>{},l.age);const m=l.money,yrs=l.ventures[0].yrs;E.wealth.investYear(l,()=>.5,()=>{},l.age);near(l.money,m,'no double profit');ok(l.ventures[0].yrs===yrs,'no double business aging');
 ok(l.ventures[0].last.cost>=l.ventures[0].last.rev*.25+3840*.55+45,'renewal reserve charged');
 l.age++;E.wealth.investYear(l,()=>.5,()=>{},l.age);ok(l.ventures[0].yrs===yrs+1,'next year pays normally');
}
{
 const l=life();l.props=[{n:'căn hộ',v:3000,basis:3000,y:.06,empty:0}];l.ventures=[];E.wealth.investYear(l,()=>.5,()=>{},l.age);
 ok(l.yr.items.some(x=>x.t==='Bảo trì và quản lý căn hộ'&&x.v<0),'rental maintenance recorded');
}
{
 const l=life(),before=E.netWorth(l);E.H.emigrate(l,['US',G.W.BY.US.name,'en'],()=>.5,()=>{});
 near(G.CUR.toVND(G.W.BY.US.gdp,E.netWorth(l)),before,'VND to US preserves actual value');
 E.H.emigrate(l,['TH',G.W.BY.TH.name,'th'],()=>.5,()=>{});
 near(G.CUR.toVND(G.W.BY.TH.gdp,E.netWorth(l)),before,'changing foreign price levels preserves value');
}
for(let seed=0;seed<80;seed++){
 const l=life();l.age=30;l.rs=seed+51100;l.ventures=[{k:'spa',n:'spa',cap:1800,unit:1800,br:1,R:3840,q:1,yrs:3,bad:0,good:0}];let state=seed+51100;const r=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return(state+.5)/4294967296;};
 // Several independent business outcomes must include losses, not only guaranteed income.
 for(let year=0;year<15&&l.ventures.length;year++){l.age++;E.wealth.investYear(l,r,()=>{},l.age);ok(Number.isFinite(l.money),'finite business cash');if(l.ventures[0]&&l.ventures[0].last.prof<0)losses++;}
}
ok(losses>0,'businesses can lose money');
console.log('V5.1.1: '+checks+' checks passed.');


