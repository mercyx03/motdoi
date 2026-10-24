const assert=require('assert'),fs=require('fs'),path=require('path');let n=0;function ok(x,t){assert.ok(x,t);n++;}
(async()=>{const code=fs.readFileSync(path.join(__dirname,'../public/_worker.js'),'utf8'),worker=(await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'))).default;
 const db=require('../tools/reviews-local.js')(':memory:'),env={REVIEWS_DB:db},origin='https://example.test';let ip=1;
 const post=d=>worker.fetch(new Request(origin+'/api/reviews',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,'CF-Connecting-IP':'198.51.100.'+ip++},body:JSON.stringify(d)}),env);
 const get=async q=>{const r=await worker.fetch(new Request(origin+'/api/reviews'+q),env);return {status:r.status,data:await r.json()};};
 // 150 đánh giá: sao 1..5 xoay vòng, một nửa có nội dung
 await get('');
 for(let i=0;i<150;i++){if(i%5<3){await db.prepare("INSERT INTO game_reviews(voter_hash,stars,created_at,updated_at,review_text) VALUES (?,?,?,?, '')").bind('legacy-low-'+i,i%5+1,1000+i,1000+i).run();}else{const r=await post({voter:i.toString(16).padStart(64,'0'),stars:i%5+1,review:''});ok(r.status===200,'saved '+i);}}
 let r=await get('?offset=0');ok(r.data.total===150&&r.data.matched===150&&r.data.reviews.length===20,'mặc định 20 dòng, tổng 150');
 r=await get('?offset=0&stars=5');ok(r.data.matched===30&&r.data.reviews.length===20&&r.data.reviews.every(x=>x.stars===5)&&r.data.total===150,'lọc 5 sao: chỉ trả review 5 sao, vẫn giữ tổng và phân bố');
 r=await get('?offset=20&stars=5');ok(r.data.reviews.length===10&&r.data.reviews.every(x=>x.stars===5),'lọc 5 sao trang 2');
 r=await get('?offset=0&stars=1&text=1');ok(r.data.matched===30&&r.data.reviews.every(x=>x.stars===1&&!('review' in x)),'legacy text filter ignored; stars remain visible');
 r=await get('?offset=0&limit=100');const r2=await get('?offset=100&limit=100');ok(r.data.reviews.length===100&&r2.data.reviews.length===50,'xem tất cả theo trang 100 dòng');
 const all=r.data.reviews.concat(r2.data.reviews),expected=(await db.prepare('SELECT stars, updated_at AS updatedAt FROM game_reviews ORDER BY updated_at DESC,id DESC').all()).results;ok(JSON.stringify(all)===JSON.stringify(expected),'pagination exactly matches SQL order without missing or repeated rows');
 for(const q of ['?stars=6','?stars=0','?stars=a','?limit=0','?limit=101','?limit=x','?stars=1%20OR%201=1'])ok((await get(q)).status===400,'tham số sai bị chặn: '+q);
 const html=fs.readFileSync(path.join(__dirname,'../public/reviews.html'),'utf8'),js=fs.readFileSync(path.join(__dirname,'../public/js/reviews.js'),'utf8');
 ok(html.includes('id="reviewFilter"')&&html.includes('id="allReviews"')&&!html.includes('id="textOnly"'),'trang có bộ lọc sao, nút xem tất cả, chỉ review có nội dung');
 ok(/&stars=/.test(js)&&/limit/.test(js)&&!/innerHTML/.test(js),'giao diện gọi API lọc, không chèn HTML thô');
  { const db2=require('../tools/reviews-local.js')(':memory:');await db2.prepare("CREATE TABLE game_ratings (voter_hash TEXT PRIMARY KEY, stars INTEGER NOT NULL, updated_at INTEGER NOT NULL, review_text TEXT NOT NULL DEFAULT '')").run();for(let i=0;i<35;i++)await db2.prepare('INSERT INTO game_ratings VALUES (?,?,?,?)').bind('h'+i,5,1000+i,i%2?'cũ '+i:'').run();
  const env2={REVIEWS_DB:db2};let v=await (await worker.fetch(new Request(origin+'/api/reviews?limit=100'),env2)).json();ok(v.total===35&&v.reviews.length===35&&v.reviews.every(x=>!('review' in x)),'v6.7: 35 đánh giá cũ được chép sang, không mất');
  for(let i=0;i<3;i++){const r=await worker.fetch(new Request(origin+'/api/reviews',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,'CF-Connecting-IP':'203.0.113.'+i},body:JSON.stringify({voter:('f'+i).padStart(64,'0'),stars:4})}),env2);ok(r.status===200,'v6.7: lượt mới '+i);}
  v=await (await worker.fetch(new Request(origin+'/api/reviews'),env2)).json();ok(v.total===38,'v6.7: đánh giá mới làm tăng tổng số lượt ('+v.total+')'); }
 console.log('V6.5.1: '+n+' review filter checks passed');
})().catch(e=>{console.error(e);process.exit(1);});
