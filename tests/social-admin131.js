'use strict';const assert=require('assert'),fs=require('fs');
(async()=>{const worker=(await import('data:text/javascript;base64,'+fs.readFileSync('public/_worker.js').toString('base64'))).default,db=require('../tools/reviews-local')(':memory:'),env={REVIEWS_DB:db},origin='https://test.local';
async function call(body,token){const r=await worker.fetch(new Request(origin+'/api/account',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)}),env);return {status:r.status,...await r.json()};}
async function list(){let r=await worker.fetch(new Request(origin+'/api/social-apps'),env);return r.json();}
assert.equal((await list()).apps.length,4);assert.equal((await call({action:'admin_social_apps'})).status,401);
let user=await call({action:'register',username:'socialadmin',password:'test-only-password-392',displayName:'Social Tester'});assert(user.token);assert.equal((await call({action:'admin_social_apps',role:'admin'},user.token)).status,403);
await db.prepare("INSERT INTO game_account_roles(account_id,role) SELECT id,'admin' FROM game_accounts WHERE username=?").bind('socialadmin').run();
assert.equal((await call({action:'admin_social_apps',app:{id:'newapp',name:'Ứng dụng mới',enabled:true}},user.token)).status,200);assert((await list()).apps.some(a=>a.id==='newapp'&&a.enabled));
assert.equal((await call({action:'admin_social_apps',app:{id:'youtube',name:'YouTube',enabled:false}},user.token)).status,200);assert(!(await list()).apps.find(a=>a.id==='youtube').enabled);
assert.equal((await call({action:'admin_social_apps',app:{id:'bad',name:'<script>',enabled:true}},user.token)).status,400);
await db.prepare('DELETE FROM game_account_roles').run();assert.equal((await call({action:'admin_social_apps',app:{id:'newapp',name:'Unauthorized',enabled:true}},user.token)).status,403);
assert.equal((await list()).apps.find(a=>a.id==='newapp').name,'Ứng dụng mới');db.close();console.log('PASS social admin API: defaults, add/update, persisted public listing, input validation and server-side authorization');
})().catch(e=>{console.error(e);process.exit(1)});
