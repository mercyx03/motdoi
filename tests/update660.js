const assert=require('assert'),fs=require('fs'),path=require('path'),os=require('os'),vm=require('vm');let n=0;function ok(x,t){assert.ok(x,t);n++;}
const build=require('../tools/build.js'),PUB=path.join(__dirname,'../public'),out=fs.mkdtempSync(path.join(os.tmpdir(),'motdoi-dist-'));
try{
 const r=build(out),html=fs.readFileSync(path.join(PUB,'index.html'),'utf8'),src=[...html.matchAll(/<script src="(js\/[^"?]+)/g)].map(m=>m[1]);
 const dh=fs.readFileSync(path.join(out,'index.html'),'utf8'),tags=[...dh.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
 ok(src.length>=80&&r.files===src.length,'gộp đủ '+src.length+' file js');
 ok(tags.length===1&&/^js\/mot-doi\.[0-9a-f]{10}\.js$/.test(tags[0]),'trang chính chỉ còn một thẻ script, tên file theo nội dung (đổi nội dung là đổi tên, không lo bộ nhớ đệm cũ)');
 const bundle=fs.readFileSync(path.join(out,tags[0]),'utf8');let at=0;
 src.forEach(f=>{const c=fs.readFileSync(path.join(PUB,f),'utf8').replace(/^﻿/,''),i=bundle.indexOf(c,at);ok(i>=at,'giữ nguyên nội dung và thứ tự: '+f);at=i+c.length;});
 ok((()=>{try{new vm.Script(bundle);return true;}catch(e){return false;}})(),'file gộp hợp lệ cú pháp');
 ok(dh.replace(/<script[^>]*><\/script>\s*/g,'')===html.replace(/<script[^>]*><\/script>\s*/g,''),'phần còn lại của index.html giữ nguyên');
 const list=[];(function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else list.push(path.relative(out,p).replace(/\\/g,'/'));}})(out);
 ok(!list.some(f=>/\.(md|csv)$/i.test(f)),'không đưa tài liệu nội bộ lên web');
 ok(['_worker.js','_routes.json','_headers','reviews.html','js/reviews.js','css/style.css','data/market-prices.json','logo.svg'].every(f=>list.includes(f)),'đủ file cần cho web, API đánh giá và trang đánh giá');
 // Verify the deployed pages, not just source files: every local script must ship.
 for(const page of list.filter(f=>/\.html$/i.test(f))){
  const source=fs.readFileSync(path.join(out,page),'utf8');
  for(const m of source.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)){
   const src=m[1].split(/[?#]/)[0];if(!src||/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(src))continue;
   const target=src.startsWith('/')?src.slice(1):path.join(path.dirname(page),src);
   ok(fs.existsSync(path.join(out,target)),page+' ships '+src);
  }
 }
 ok(fs.readFileSync(path.join(out,'js/account.js'),'utf8')===fs.readFileSync(path.join(PUB,'js/account.js'),'utf8'),'Updates ships the same account/profile implementation as home');
 ok(!list.some(f=>/^js\/(engine|app|life\d+)\.js$/.test(f)),'không chép lại các file js nguồn đã gộp');
 // ctx: chạy phần mô phỏng của file gộp (bỏ phần giao diện cần trình duyệt)
 const ui=bundle.indexOf('/* ===== js/scene.js =====');const ctx={console,Math,Date,JSON,TextEncoder,TextDecoder};ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(bundle.slice(0,ui),ctx);
 const E=ctx.G.E,l=E.createLife({mode:'vn',seed:660});E.runHeadless(l);ok(!l.alive&&l.death&&E.ACHIEVEMENTS.length>=30,'file gộp chạy được trọn một đời');
 const tool=fs.readFileSync(path.join(__dirname,'../tools/backup-reviews.js'),'utf8');ok(/limit=100/.test(tool)&&/wrangler', 'd1', 'export'/.test(tool),'có công cụ sao lưu đánh giá (API công khai hoặc xuất D1)');
 const wr=fs.readFileSync(path.join(__dirname,'../wrangler.toml'),'utf8');ok(/directory = "\.\/dist"/.test(wr),'triển khai bằng Wrangler dùng bản build dist/');
}finally{fs.rmSync(out,{recursive:true,force:true});}
console.log('V6.6.0: '+n+' build checks passed');
