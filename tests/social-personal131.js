'use strict';
const assert=require('assert'),fs=require('fs'),vm=require('vm'),{gameContext}=require('./hardcore-isolation');
const source=fs.readFileSync('public/js/life131.js','utf8');
function user(storage){const c={G:gameContext(),localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>{storage[k]=v;}},Date,console};c.globalThis=c;vm.runInNewContext(source,c);return c.G.E.SOCIAL131;}
const aStore={},bStore={},a=user(aStore),b=user(bStore);
const apps=a.apps();apps.push({id:'myapp',name:'Ứng dụng của tôi',enabled:true});assert(a.saveApps(apps));
assert(a.apps().some(x=>x.id==='myapp'));assert(!b.apps().some(x=>x.id==='myapp'),'personal changes isolated');
assert(user(aStore).apps().some(x=>x.id==='myapp'),'reload retains apps');
apps[0].name='Tên mới';apps[0].enabled=false;assert(a.saveApps(apps));assert.equal(user(aStore).apps()[0].name,'Tên mới');assert.equal(user(aStore).apps()[0].enabled,false);
assert(!a.saveApps([{id:'bad',name:'<script>',enabled:true}]));assert.equal(a.apps().length,5);
const account=fs.readFileSync('public/js/account.js','utf8');assert(!account.includes('admin_social_apps'));assert(!account.includes('adminSocialApps'));assert(account.includes('socialApps: get('));assert(account.includes('G.E.SOCIAL131.saveApps(d.socialApps.apps,d.socialApps.at)'));
console.log('PASS personal social apps: guest access, add/rename/disable persistence, validation, isolation and sync integration');
const mergeCode=account.slice(account.indexOf('  function mergeAch'),account.indexOf('  function packed'));
const sandbox={Date,JSON,window:{G:{E:{SOCIAL131:a}}},G:{E:{SOCIAL131:a}},set:()=>true,K:{},get:()=>null};vm.createContext(sandbox);vm.runInContext(mergeCode,sandbox);
const old={apps:[{id:'oldapp',name:'Older',enabled:true}],at:10},fresh={apps:[{id:'newapp',name:'Newer',enabled:true}],at:20};
assert.equal(sandbox.merge({socialApps:old},{socialApps:fresh}).socialApps.at,20);
assert.equal(sandbox.merge({socialApps:fresh},{socialApps:old}).socialApps.at,20);
assert.equal(sandbox.merge({socialApps:fresh},{}).socialApps.at,20);
sandbox.applyLocal({socialApps:fresh});assert(a.apps().some(x=>x.id==='newapp'));assert.equal(JSON.parse(aStore['mkn.socialApps131']).at,20);
console.log('PASS social sync: newest settings win on either device; cloud settings applied with original timestamp');
// Cloud sync on updates/reviews pages must work without loading the game engine.
const store={};const noEngine={Date,JSON,window:{},localStorage:{setItem:(k,v)=>store[k]=v},get:(k,d)=>store[k]?JSON.parse(store[k]):d,set:(k,v)=>{store[k]=JSON.stringify(v);return true;},K:{ach:'ach',tree:'tree',mem:'mem',recent:'recent'}};vm.createContext(noEngine);vm.runInContext(account.slice(account.indexOf('  function localSocialApps'),account.indexOf('  function openSocialApps'))+mergeCode,noEngine);noEngine.applyLocal({socialApps:fresh});assert.equal(JSON.parse(store['mkn.socialApps131']).at,20);assert(noEngine.localSocialApps().apps().some(x=>x.id==='newapp'));noEngine.applyLocal({socialApps:{apps:[{id:'bad',name:'<script>',enabled:true}],at:30}});assert.equal(JSON.parse(store['mkn.socialApps131']).at,20);
console.log('PASS social sync without engine: cloud config applied on standalone pages, timestamp retained, invalid data rejected');
