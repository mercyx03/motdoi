const assert=require('assert'),fs=require('fs'),path=require('path');let n=0;function ok(x,t){assert.ok(x,t);n++;}
(async()=>{const code=fs.readFileSync(path.join(__dirname,'../public/_worker.js'),'utf8'),worker=(await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'))).default;
 const db=require('../tools/reviews-local.js')(':memory:'),env={REVIEWS_DB:db},origin='https://example.test';let ip=1;
 const post=d=>worker.fetch(new Request(origin+'/api/reviews',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,'CF-Connecting-IP':'198.51.100.'+ip++},body:JSON.stringify(d)}),env);
 const get=async q=>{const r=await worker.fetch(new Request(origin+'/api/reviews'+q),env);return {status:r.status,data:await r.json()};};
 // 150 đánh giá: sao 1..5 xoay vòng, một nửa có nội dung
 for(let i=0;i<150;i++){const r=await post({voter:i.toString(16).padStart(64,'0'),stars:i%5+1,review:i%2?'Review số '+i:''});ok(r.status===200,'saved '+i);}
 let r=await get('?offset=0');ok(r.data.total===150&&r.data.matched===150&&r.data.reviews.length===20,'mặc định 20 dòng, tổng 150');
 r=await get('?offset=0&stars=5');ok(r.data.matched===30&&r.data.reviews.length===20&&r.data.reviews.every(x=>x.stars===5)&&r.data.total===150,'lọc 5 sao: chỉ trả review 5 sao, vẫn giữ tổng và phân bố');
 r=await get('?offset=20&stars=5');ok(r.data.reviews.length===10&&r.data.reviews.every(x=>x.stars===5),'lọc 5 sao trang 2');
 r=await get('?offset=0&stars=1&text=1');ok(r.data.matched===15&&r.data.reviews.every(x=>x.stars===1&&x.review),'lọc 1 sao có nội dung');
 r=await get('?offset=0&limit=100');const r2=await get('?offset=100&limit=100');ok(r.data.reviews.length===100&&r2.data.reviews.length===50,'xem tất cả theo trang 100 dòng');
 const all=r.data.reviews.concat(r2.data.reviews);ok(new Set(all.map(x=>x.review+'|'+x.updatedAt+'|'+x.stars)).size>=all.length-1,'không trùng lặp giữa các trang');
 for(const q of ['?stars=6','?stars=0','?stars=a','?limit=0','?limit=101','?limit=x','?stars=1%20OR%201=1'])ok((await get(q)).status===400,'tham số sai bị chặn: '+q);
 const html=fs.readFileSync(path.join(__dirname,'../public/reviews.html'),'utf8'),js=fs.readFileSync(path.join(__dirname,'../public/js/reviews.js'),'utf8');
 ok(html.includes('id="reviewFilter"')&&html.includes('id="allReviews"')&&html.includes('id="textOnly"'),'trang có bộ lọc sao, nút xem tất cả, chỉ review có nội dung');
 ok(/&stars=/.test(js)&&/limit/.test(js)&&!/innerHTML/.test(js),'giao diện gọi API lọc, không chèn HTML thô');
 console.log('V6.5.1: '+n+' review filter checks passed');
})().catch(e=>{console.error(e);process.exit(1);});
