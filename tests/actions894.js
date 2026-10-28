'use strict';
const assert=require('assert'),{game}=require('./hardcore-isolation'),E=game();
function life(age=12){const l=E.createLife({mode:'vn',seed:89401});l.age=age;l.pending=[];l.acts=0;l.money=l.base*100;l.indep=true;l.flags.actAt={};return l;}
function pick(l,k){const d=l.pending[0];assert(d.opts.some(o=>o.k===k),`${d.id}: missing ${k}`);return E.resolve(l,k);}
let l=life();l.bff=null;l.friends=[{name:'An',alive:true,close:70,loc:'HOME'},{name:'An',alive:true,close:75,loc:'HOME'}];
assert.equal(E.actions(l).filter(a=>a.l==='Hẹn gặp bạn thân').length,1);
assert(E.act(l,'hen_ban_than'));assert.equal(l.acts,0,'opening is free');assert.equal(l.pending[0].opts.length,3,'both namesakes and cancel');
pick(l,'1');assert.equal(l.acts,0,'selecting a friend is browsing');pick(l,'0');assert.equal(l.acts,1);assert.equal(l.friends[0].close,70);assert.equal(l.friends[1].close,83);
assert(E.act(l,'hen_ban_than'));pick(l,'cancel');assert.equal(l.acts,1,'cancel never refunds a previous real action');
// Reload within a submenu keeps the deferred transaction, without a refund.
assert(E.act(l,'hen_ban_than'));pick(l,'0');l=E.migrate(JSON.parse(JSON.stringify(l)));assert.equal(l.acts,1);pick(l,'0');assert.equal(l.acts,2);
// Mandatory events have no action token.
l=life(20);l.lang={en:2};l.langAt={en:18};l.langExp={en:false};l.pending=[E.DEC.chung_chi_het_han.make(l,()=>.5,{k:'en'})];pick(l,'retest');assert.equal(l.acts,0);assert.equal(l.langAt.en,20);assert(E.certValid(l,'en'));
l.age=21;assert(!E.DEC.chung_chi_het_han.valid(l,{k:'en'}),'not expired after one year');assert(E.certValid(l,'en'));l.age=22;assert(E.DEC.chung_chi_het_han.valid(l,{k:'en'}));assert(!E.certValid(l,'en'));l.lang.ja=2;l.langExp.ja=false;assert(E.certValid(l,'ja'),'non-expiring certificate');
// Obsolete expiry card after a new exam is pruned, without charging cash.
l.age=21;l.pending=[E.DEC.chung_chi_het_han.make(l,()=>.5,{k:'en'})];const money=l.money;E.resolve(l,'retest');assert.equal(l.money,money);assert(!l.pending.length);
// Old Hardcore save migrates without losing assets, and drops retired cards.
l=life(20);l.difficulty='hardcore';l.pending=[{id:'hc_story_test',data:{}},{id:'hc_chain_test',data:{}}];l.sched=[{id:'hc_role_test',at:21}];const cash=l.money;l=E.migrate(l);assert.equal(l.difficulty,'normal');assert.equal(l.money,cash);assert(!l.pending.length);assert(!l.sched.some(d=>/^hc_/.test(d.id)));assert.equal(E.createLife({mode:'vn',seed:2,difficulty:'hardcore'}).difficulty,'normal');
// Legacy prepaid open action gets refunded exactly once.
l=life();l.acts=2;l.flags.actAt.hen_ban_than=l.age;l.friends=[{name:'Bình',alive:true,close:60,loc:'HOME'}];const d=E.DEC.friends894.make(l,()=>.5);d.manual=true;d.data.actionId850='hen_ban_than';d.data.actionYear850=l.age;l.pending=[d];l=E.migrate(l);assert.equal(l.acts,1);l=E.migrate(l);assert.equal(l.acts,1);
// At the cap, an already-open leaf cannot spend or apply effects.
l=life();l.friends=[{name:'Bình',alive:true,close:60,loc:'HOME'}];E.act(l,'hen_ban_than');pick(l,'0');l.acts=7;pick(l,'0');assert.equal(l.acts,7);assert.equal(l.friends[0].close,60);assert.equal(l.pending[0].id,'friend894');pick(l,'cancel');assert.equal(l.acts,7);
// Distant saved emergency card supports remote help, never teleportation.
l=life(20);l.abroad={code:'JP',name:'Nhật Bản',study:true,since:18};l.bff=null;l.friends=[{name:'Lý',alive:true,close:60,loc:'HOME',d:0}];l.pending=[E.DEC.ban_than_kho.make(l,()=>.5)];l.pending[0].data.n='Lý';delete l.pending[0].data.uid894;l.pending[0].opts=E.DEC.ban_than_kho.make(l,()=>.5,{n:'Lý'}).opts;
const support=E.DEC.ban_than_kho.def.opts.find(o=>o.k==='o_ben');assert(/video/.test(support.l(l,l.pending[0].data)));pick(l,'o_ben');assert(l.log.some(e=>/gọi video cho Lý/.test(e.t)));assert.equal(l.acts,0);
l.pending=[E.DEC.homeVisit894.make(l,()=>.5,{reason:'thăm mẹ'})];const a=JSON.stringify(l.abroad),before=l.money;pick(l,'book');assert(l.money<before);assert.equal(l.pending[0].id,'homeVisitReturn894');pick(l,'return');assert.equal(JSON.stringify(l.abroad),a);assert(l.flags.homeVisit894.returned);
// Reopening a filter is an interactive setting change, not an action.
l=life(20);E.act(l,'dateFilters114');pick(l,'1');assert.equal(l.flags.life114.dateJob,'med');assert.equal(l.acts,0);assert(l.pending[0].opts.some(o=>o.l==='✓ Y tế'));pick(l,'cancel');assert.equal(l.acts,0);
console.log('PASS actions894: deferred turns, cancel/reload/cap, mandatory events, friend identity/distance, two-year certificates, Hardcore migration, temporary home visit and interactive filters');
