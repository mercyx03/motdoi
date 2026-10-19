/* Máy chủ tĩnh tối giản để chạy thử trên máy: node tools/serve.js  →  http://localhost:8080 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', process.env.MOTDOI_ROOT || 'public'); // MOTDOI_ROOT=dist để chạy thử bản build
const PORT = +process.env.PORT || 8080;
let ratingsDB;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

http.createServer(async (req, res) => {
  if (['/api/market','/api/reviews','/api/feedback','/api/account'].includes(req.url.split('?')[0])) {
    try {
      const source = fs.readFileSync(path.join(ROOT, '_worker.js'), 'utf8');
      const worker = (await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'))).default;
      let raw = Buffer.alloc(0);for await (const part of req) { raw=Buffer.concat([raw,part]);if(raw.length>(req.url.startsWith('/api/account')?1700000:20000)){res.writeHead(413);return res.end('Payload too large');}}
      const init={method:req.method,headers:req.headers};if(!['GET','HEAD'].includes(req.method)){init.body=raw;init.duplex='half';}
      if(/^\/api\/(reviews|account)$/.test(req.url.split('?')[0])&&!ratingsDB)ratingsDB=require('./reviews-local.js')(path.join(__dirname,'..','.local','reviews.sqlite'));
      const result = await worker.fetch(new Request('http://localhost:' + PORT + req.url, init), { REVIEWS_DB:ratingsDB, ASSETS: { fetch: async () => new Response(fs.readFileSync(path.join(ROOT, 'data/market-prices.json')), { headers: { 'Content-Type': 'application/json' } }) } });
      res.writeHead(result.status, Object.fromEntries(result.headers)); return res.end(Buffer.from(await result.arrayBuffer()));
    } catch (error) { res.writeHead(503); return res.end('Market data unavailable'); }
  }
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.normalize(path.join(ROOT, p));
  if (['_worker.js','_headers','_routes.json','.assetsignore'].includes(path.relative(ROOT,file).toLowerCase())) {res.writeHead(404);return res.end('Not found');}
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
}).listen(PORT, () => console.log('Một Đời đang chạy tại http://localhost:' + PORT));
