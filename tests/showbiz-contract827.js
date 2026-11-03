'use strict';
const assert=require('assert'),{gameContext}=require('./hardcore-isolation');
const G=gameContext(), E=G.E, M=E.MEDIA156;let checks=0;
function ok(x,m){assert(x,m);checks++;}
function life(){const l=E.createLife({mode:'vn',seed:82709,year:1995});Object.assign(l,{age:30,indep:true,pending:[],fame:300000,money:10000,partner:null});l.flags.military=0;return l;}
function choose(l,id,key,arg){const d=E.DEC[id].make(l,E.H.rf(l),arg);const k=d.data.keys?String(d.data.keys.indexOf(key)):key;ok(d.opts.some(o=>o.k===k),'visible '+id+'/'+key);l.pending=[d];E.resolve(l,k);return d;}
function sign(l,pct=300,k='ok'){const d=E.DEC.quang_cao.make(l,E.H.rf(l));d.data.fee=100;d.data.mediaRate156=pct;d.data.brand='Nhãn hàng Hư Cấu';l.pending=[d];E.resolve(l,k);return d;}
function trigger(l,kind='conduct'){M.open(l,kind);choose(l,'media156','verify');choose(l,'media156','repair');return M.state(l).contracts.slice(-1)[0];}
function claim(l,x,k){return choose(l,'mediaClaim156',k,{id:x.id});}
function year(l){l.age++;E.HOOKS.year.forEach(fn=>fn(l,E.H.rf(l),()=>{}));}
{
 const l=life(), money=l.money, d=sign(l,500);ok(l.money===money+100,'actual fee');ok(M.state(l).contracts[0].rate===500,'500% recorded');l.pending=[d];E.resolve(l,'ok');ok(l.money===money+100,'duplicate acceptance no payment');
 const x=trigger(l);ok(x.claim.demand===500 && M.owed(l)===0,'demand 500% only actual contract; not yet debt');const net=E.netWorth(l);claim(l,x,'review');claim(l,x,'negotiate');ok(x.claim.offer===300,'40% negotiated discount');const offer=x.claim.offer;claim(l,x,'accept');ok(M.owed(l)===offer && E.netWorth(l)===net-offer,'recognized debt included net worth');const a=l.money;claim(l,x,'pay');ok(l.money===a-offer && M.owed(l)===0,'paid once');ok(x.claim.stage==='closed','closed dossier');
 const back=E.migrate(JSON.parse(JSON.stringify(l)));ok(JSON.stringify(back.flags.media156)===JSON.stringify(l.flags.media156),'closed financial record survives migration');
}
{
 const l=life();sign(l,300);const x=trigger(l,'private');claim(l,x,'review');claim(l,x,'dispute');ok(M.owed(l)===0,'contested demand not debt');ok(!E.DEC.mediaClaim156.make(l,E.H.rf(l),{id:x.id}).data.keys.includes('verdict'),'wait a year');year(l);ok(x.claim.withdrawn && M.owed(l)===0,'dating alone: demand rejected');
}
{
 const l=life();sign(l,300);const x=trigger(l);claim(l,x,'review');claim(l,x,'dispute');year(l);ok(M.owed(l)===300,'breach upheld');l.money=0;claim(l,x,'schedule');year(l);ok(M.owed(l)>300 && x.claim.late===1,'shortfall retained with fees');const bal=M.owed(l);E.HOOKS.year.forEach(fn=>fn(l,E.H.rf(l),()=>{}));ok(M.owed(l)===bal,'no double yearly charge');
 for(let i=0;i<15;i++){l.money=0;year(l);}ok(x.claim.fees<=60+1e-8,'late fee cap 20% principal');l.money=10000;claim(l,x,'pay');ok(M.owed(l)===0,'eventual payoff');
}
{
 const l=life();sign(l,300,'capped156');const x=M.state(l).contracts[0];ok(x.fee===75 && x.rate===100,'safe lower fee and liability');l.age+=3;trigger(l);ok(!x.claim,'expired contract never claimed');
}
{
 const l=life();sign(l,200);sign(l,500);const x=trigger(l), all=M.state(l).contracts;ok(all.every(c=>c.claim) && all[0].claim.demand===200 && x.claim.demand===500,'multiple brands separate demands');claim(l,x,'review');claim(l,x,'acceptFull');l.money=0;const before=M.owed(l), fee=x.fee;E.abroadConvert(l,2);ok(M.owed(l)===before*2 && x.fee===fee*2,'currency conversion for all financial fields');
}

{
 const l=life(),d=E.DEC.quang_cao.make(l,E.H.rf(l));delete d.data.mediaRate156;l.pending=[d];E.resolve(l,'ok');ok(!l.flags.media156 || !M.state(l).contracts.length,'legacy pending has no retroactive penalty');
}
{
 const l=life();sign(l,300);const x=trigger(l);for(let i=0;i<3;i++)year(l);ok(x.claim.stage==='payment' && M.owed(l)===300,'ignored demand goes through delayed dispute and decision');
}
console.log('PASS showbiz-contract827: '+checks+' checks');
