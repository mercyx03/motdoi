'use strict';
const assert=require('assert'),fs=require('fs'),{game}=require('./hardcore-isolation');let checks=0;
const ok=(v,m)=>{assert(v,m);checks++;};
(async()=>{
 const worker=(await import('data:text/javascript;base64,'+Buffer.from(fs.readFileSync('public/_worker.js')).toString('base64'))).default;
 const db=require('../tools/reviews-local')(':memory:'),env={REVIEWS_DB:db},origin='https://example.test';
 async function call(path,body,token,extra={}){const r=await worker.fetch(new Request(origin+path,{method:body?'POST':'GET',headers:{Origin:origin,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...extra},...(body?{body:JSON.stringify(body)}:{})}),env);return{status:r.status,...await r.json()};}
 ok((await call('/api/comments')).total===0,'empty comments works');
 ok((await call('/api/account',{action:'register',username:'member_one',password:'test-only-long-password'})).code==='INVALID_DISPLAY_NAME','registration requires name');
 const account=await call('/api/account',{action:'register',username:'member_one',password:'test-only-long-password',displayName:'Người chơi',role:'admin'}),token=account.token;
 ok(account.role==='member'&&!!token,'client cannot register admin');
 ok((await call('/api/comments',{body:'Hello'})).status===401,'anonymous cannot post');
 await db.prepare("UPDATE game_accounts SET display_name='' WHERE username='member_one'").run();
 ok((await call('/api/comments',{body:'Hello'},token)).code==='DISPLAY_NAME_REQUIRED','legacy account must name itself');
 ok((await call('/api/account',{action:'profile',displayName:'Admin'},token)).status===400,'reserved badge name');
 ok((await call('/api/account',{action:'profile',displayName:'Tên công khai',role:'admin'},token)).role==='member','profile cannot grant admin');
 ok((await call('/api/comments',{body:'Hello'},token,{Origin:'https://evil.test'})).status===403,'cross origin blocked');
 ok((await call('/api/comments',{body:'x'.repeat(1501)},token)).status===400,'comment length');
 ok((await call('/api/comments',{body:'<img src=x onerror=alert(1)>',role:'admin'},token)).status===201,'comment submitted as data');
 let feed=await call('/api/comments'),root=feed.comments[0];
 ok(root.displayName==='Tên công khai'&&root.role==='member','server identity');
 ok(!/member_one|pass_hash|token_hash|account_id|password/.test(JSON.stringify(feed)),'public feed exposes no login identity or secrets');
 ok((await call('/api/comments',{body:'rapid'},token)).status===429,'durable cooldown');
 const age=()=>db.prepare('UPDATE game_update_comments SET created_at=created_at-16000').run();await age();
 ok((await call('/api/comments',{body:'reply',parentId:root.id},token)).status===201,'reply saved');
 let replies=await call('/api/comments?thread='+root.id);ok(replies.total===1&&replies.replies[0].parentId===root.id,'reply belongs to thread');await age();
 ok((await call('/api/comments',{body:'nested',parentId:replies.replies[0].id},token)).status===404,'nested parent rejected');
 ok((await call('/api/comments',{body:'orphan',parentId:999999},token)).status===404,'orphan rejected');
 await db.prepare("INSERT INTO game_account_roles SELECT id,'admin' FROM game_accounts WHERE username='member_one'").run();
 ok((await call('/api/comments')).comments[0].role==='admin','private DB role produces Admin badge');
 for(let i=0;i<25;i++)await db.prepare('INSERT INTO game_update_comments(account_id,parent_id,body,created_at) VALUES(1,?,?,?)').bind(root.id,'reply '+i,Date.now()).run();
 replies=await call('/api/comments?thread='+root.id);const rest=await call('/api/comments?thread='+root.id+'&offset=20');ok(replies.replies.length===20&&rest.replies.length===6&&new Set([...replies.replies,...rest.replies].map(x=>x.id)).size===26,'replies paginate without duplication');
 await call('/api/reviews');await db.prepare("INSERT INTO game_ratings(voter_hash,stars,updated_at,review_text) VALUES('legacy',5,1000,'private historical text')").run();
 // New worker instance exercises migration from old table as on first deployment.
 const migrated=(await import('data:text/javascript;base64,'+Buffer.from(fs.readFileSync('public/_worker.js')+'\n// migration test').toString('base64'))).default;
 const ratings=await (await migrated.fetch(new Request(origin+'/api/reviews'),env)).json();ok(ratings.total===1&&!JSON.stringify(ratings).includes('historical')&&!('review' in ratings.reviews[0]),'old rating counted, text excluded');
 ok((await db.prepare("SELECT review_text FROM game_reviews WHERE voter_hash='legacy'").first()).review_text==='private historical text','historical text preserved privately');
 ok((await call('/api/reviews',{voter:'a'.repeat(64),stars:5,review:'new text'})).code==='COMMENTS_MOVED','new review text rejected');
 ok((await call('/api/reviews',{voter:'a'.repeat(64),stars:5})).status===200,'new stars accepted');
 const E=game(),rows=JSON.parse(fs.readFileSync('docs/fandom-community.json'));ok(new Set(E.FAN_CLUBS.map(x=>x[0])).size===E.FAN_CLUBS.length,'unique fandom IDs');
 for(const row of rows){const f=E.FAN_CLUBS.find(x=>x[0]===row[0]);ok(f&&f[1]===row[1]&&f[3]===row[3],row[3]+' mapping');for(const alias of row[2]){const l=E.createLife({mode:'vn',seed:123});l.idol=alias;l.bias=null;for(let i=0;i<3;i++)E.achYear93(l,()=>.5,()=>{},20+i);ok(l.flags.biasYrs[f[0]]===3,alias+' progresses in three years');}}
 const l=E.createLife({mode:'vn',seed:321});l.age=25;l.school=null;E.startJob(l,'ke_toan',()=>.5,()=>{},true);const before=JSON.stringify(l.job),d=E.DEC.casting.make(l,()=>.5);ok(/rời công việc/.test(d.text)&&/hạng A/.test(d.text)&&/quần chúng/.test(d.text),'casting warns of job loss and uncertain future');l.pending=[d];E.resolve(l,'no');ok(JSON.stringify(l.job)===before,'declining casting keeps job');
 const stale=JSON.parse(JSON.stringify(d));stale.text='Old text';const seed=l.rng;E.refreshActingWarning(l,stale);ok(/rời công việc/.test(stale.text)&&l.rng===seed,'saved pending choice gets warning without random changes');
 for(const mode of ['vn','world'])for(const difficulty of ['normal','hardcore']){const x=E.createLife({mode,difficulty,country:'US',seed:234});x.age=25;x.school=null;E.startJob(x,'ke_toan',()=>.5,()=>{},true);const saved=JSON.stringify(x.job),choice=E.DEC.casting.make(x,()=>.5);E.DEC.casting.apply(x,choice,'web',()=>.999,()=>{});ok(JSON.stringify(x.job)===saved,'failed casting retains job '+mode+difficulty);E.DEC.casting.apply(x,choice,'web',()=>.01,()=>{});ok(x.job&&x.job.id==='dien_vien','successful casting changes career '+mode+difficulty);ok(!/rời công việc/.test(E.DEC.casting.make(x,()=>.5).text),'existing actor has no false loss warning');}
 const history=JSON.parse(fs.readFileSync('public/data/updates.json'));ok(history.entries.length>=50&&history.entries.every(x=>x.title&&!/^\d+\/\d+\/\d+$/.test(x.title)&&Number.isFinite(Date.parse(x.publishedAt))),'dated history with meaningful titles');ok(!/\bv?\d+\.\d+\.\d+\b/.test(JSON.stringify(history.entries)),'history omits versions');
 const notes=require('../tools/player-update-notes');
 ok(history.entries.every(e=>[e.title,e.summary,...e.details].every(s=>!notes.technical.test(s))),'public update titles, summaries and details omit engineering notes');
 ok(notes.playerLine('Thêm mục kiểm thử hồi quy và tests/update770.js.')===null,'hide pure test notes');
 const mixed=notes.playerLine('Hai hành động mới chỉ do người chơi chọn, không thêm vào lựa chọn tự động. Đối chiếu 12 cuộc đời Thường vẫn trùng khớp; thêm tests/update770.js cho gia cảnh.');
 ok(mixed.includes('người chơi')&&!mixed.includes('tests/'),'retain gameplay change while removing mixed test details');
 ok(notes.playerLine('Đột phá giữ nguyên linh lực dư.')==='Đột phá giữ nguyên linh lực dư.','retain ordinary gameplay notes');
 ok(!/innerHTML/.test(fs.readFileSync('public/js/updates.js','utf8')),'comments render as text');db.close();console.log('Community: '+checks+' checks passed');
})().catch(e=>{console.error(e);process.exit(1);});
