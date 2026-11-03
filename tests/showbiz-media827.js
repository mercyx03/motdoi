'use strict';
const assert = require('assert');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, Q = E.QUIZ151, M = E.MEDIA156;
let n = 0;
function ok(c, m) { assert(c, m); n++; }
function life() { const l = E.createLife({mode:'vn', seed:15627, year:1995}); Object.assign(l,{age:30,alive:true,indep:true,pending:[],fame:200000,partner:null}); l.flags.military=0; return l; }
function choose(l, key) { const d=E.DEC.media156.make(l,E.H.rf(l)); const i=d.data.keys.indexOf(key); ok(i>=0 && d.opts.some(o=>o.k===String(i)), 'visible '+key); l.pending=[d]; E.resolve(l,String(i)); return d; }
// Independent answer checks for new parameterized families and uniqueness across sessions.
for (const kind of ['remainders','paths','wordcode','trick','workrate','inclusion','wordorder','meeting']) {
  const recent=[];
  for(let i=0;i<300;i++) { const q=Q.generate(kind+i,{diff:3,kinds:[kind],recent}); ok(Q.verify(q),kind+' valid');
    if(kind==='remainders') { const v=q.text.match(/\d+/g).map(Number), x=Number(q.options[q.answer]); ok(x>v[0] && x<v[1] && x%v[2]===v[3] && x%v[4]===v[5],'mod constraints'); }
    if(kind==='trick') { const v=q.text.match(/\d+/g).map(Number); ok(Number(q.options[q.answer])===(v[0]-1)*v[1],'bell intervals'); }
    if(kind==='wordcode') { const shift=Number(q.text.match(/tiến (\d+)/)[1]), w=q.text.match(/Chuỗi ([A-Z]+)/)[1]; ok(q.options[q.answer]===w.split('').map(c=>String.fromCharCode(65+(c.charCodeAt(0)-65+shift)%26)).join(''),'cipher independent'); }
    recent.push(q.sig); if(!['paths','meeting'].includes(kind)) ok(recent.filter(x=>x===q.sig).length===1,'no repeat '+kind);
  }
}
for(let i=0;i<300;i++) { const q=Q.generate('hard'+i,{diff:3}); ok(['remainders','paths','wordcode','inclusion','wordorder','meeting'].includes(q.kind),'hard pool'); }
const l=life(); ok(!l.flags.media156,'old saves have no new state');
M.open(l,'private'); l.partner={name:'An',uid110:'partner-A',age:28,close:65};
// Snapshot links persist and do not attach consequences to a later partner.
delete l.flags.media156.active; const c=M.open(l,'private'); ok(c.partnerId==='partner-A','stable partner link');
choose(l,'verify'); const back=E.migrate(JSON.parse(JSON.stringify(l))); ok(JSON.stringify(back.flags.media156)===JSON.stringify(l.flags.media156),'save during case');
choose(l,'clarify'); ok(M.state(l).active.stage==='follow','not solved immediately');
ok(!E.DEC.media156.make(l,E.H.rf(l)).data.keys.includes('follow'),'cannot fast forward');
l.age++; choose(l,'follow'); ok(!M.state(l).active && M.state(l).history.length===1,'resolution next year');
M.open(l,'ship'); choose(l,'rush'); l.partner={name:'Binh',uid110:'partner-B',age:30,close:77}; choose(l,'attack'); ok(l.partner.close===77,'new partner unaffected');
l.age++; choose(l,'follow'); ok(M.state(l).active,'harmful response needs longer recovery');
const stale=E.DEC.media156.make(l,E.H.rf(l)); const trust=M.state(l).trust; l.pending=[stale]; E.resolve(l,'cancel'); ok(M.state(l).trust===trust,'cancel no reward');
const generic=E.DEC.scandal.make(l,E.H.rf(l)); ok(generic.opts.some(o=>o.k==='case156'),'existing scandal links to dossier');
const child=life(); child.age=15; ok(M.eligible(child)!==true,'adult publicity menu');

const ad=E.DEC.quang_cao.make(l,E.H.rf(l)), cash=l.money; l.pending=[ad]; E.resolve(l,'ok'); ok(l.money===cash,'brand pauses severe unresolved dossier');
const beforeTrust=M.state(l).trust; l.age+=3; E.HOOKS.year.forEach(fn=>fn(l,E.H.rf(l),()=>{})); const afterTrust=M.state(l).trust; ok(afterTrust<beforeTrust,'ignored case loses trust'); E.HOOKS.year.forEach(fn=>fn(l,E.H.rf(l),()=>{})); ok(M.state(l).trust===afterTrust,'year consequences not duplicated');
const misconduct=life(), old=E.DEC.scandal.make(misconduct,E.H.rf(misconduct)); old.data.t='Bị khui chuyện quỵt tiền từ thiện'; misconduct.pending=[old]; E.resolve(misconduct,'case156'); ok(M.state(misconduct).active.kind==='conduct','verified conduct not dismissed as edited rumor');
console.log('PASS showbiz-media827: '+n+' checks');
