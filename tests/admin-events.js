'use strict';
const assert=require('assert'),fs=require('fs');
(async()=>{
 const worker=(await import('data:text/javascript;base64,'+fs.readFileSync('dist/_worker.js').toString('base64'))).default;
 const db=require('../tools/reviews-local')(':memory:'),env={REVIEWS_DB:db},origin='https://test.local';
 async function call(body,token){const r=await worker.fetch(new Request(origin+'/api/account',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)}),env);return {status:r.status,cache:r.headers.get('Cache-Control'),...await r.json()};}
 const anon=await call({action:'admin_events'});assert.equal(anon.status,401);
 const user=await call({action:'register',username:'mercy0310',password:'test-only-password-392',displayName:'Mercy'});
 assert(user.token);
 assert.equal((await call({action:'admin_events',role:'admin'},user.token)).status,403);
 await db.prepare("INSERT INTO game_account_roles(account_id,role) SELECT id,'admin' FROM game_accounts WHERE username=?").bind('mercy0310').run();
 const result=await call({action:'admin_events'},user.token);assert.equal(result.status,200);assert.equal(result.cache,'no-store');
 for(const type of ['Lựa chọn','Biến cố','Lời kể','Hằng năm'])assert(result.entries.some(e=>e.type===type));
 assert(new Set(result.entries.map(e=>e.id)).size===result.entries.length);
 assert(result.entries.some(e=>e.id==='love'));
 assert(result.entries.every(e=>typeof e.data.text==='string'&&!JSON.stringify(e.data).includes('function (')),'no function source displayed');
 assert(result.entries.some(e=>e.data.choices&&e.data.choices.length),'real choices rendered');
 console.log('Prose previews: '+result.entries.filter(e=>e.data.choices&&e.data.choices.length).length);
 await db.prepare('DELETE FROM game_account_roles').run();
 assert.equal((await call({action:'admin_events'},user.token)).status,403);
 console.log('PASS admin catalogue: anonymous/member rejected, client role ignored, server admin accepted, revoked admin rejected; '+result.entries.length+' entries.');
 db.close();
})().catch(e=>{console.error(e);process.exit(1)});
