/* Một Đời — tạo bản triển khai gọn trong dist/ (v6.6.0)
   · gộp các file js của trang chính thành một file duy nhất theo đúng thứ tự trong index.html (từ ~90 lượt tải còn 1)
   · không đổi nội dung mã (chỉ nối file), Cloudflare tự nén gzip / brotli khi gửi
   · không chép tài liệu nội bộ (*.md, *.csv) và các file js nguồn đã được gộp
   Chạy: node tools/build.js  →  tải thư mục dist/ lên Cloudflare */
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.join(__dirname, '..'), PUB = path.join(ROOT, 'public');
function build(outDir) {
  const OUT = outDir || path.join(ROOT, 'dist');
  const html = fs.readFileSync(path.join(PUB, 'index.html'), 'utf8');
  const tags = [...html.matchAll(/[ \t]*<script src="(js\/[^"?]+)(?:\?v=[^"]*)?"><\/script>\r?\n?/g)];
  if (!tags.length) throw Error('index.html không có thẻ script');
  const files = tags.map(m => m[1]);
  const parts = files.map(f => '/* ===== ' + f + ' ===== */\n' + fs.readFileSync(path.join(PUB, f), 'utf8').replace(/^﻿/, '') + '\n;\n');
  const bundle = parts.join('');
  const hash = crypto.createHash('sha256').update(bundle).digest('hex').slice(0, 10);
  const name = 'js/mot-doi.' + hash + '.js';
  fs.rmSync(OUT, { recursive: true, force: true });
  const skip = new Set(files.map(f => path.normalize(f)));
  (function copy(dir) {
    for (const e of fs.readdirSync(path.join(PUB, dir), { withFileTypes: true })) {
      const rel = path.join(dir, e.name);
      if (e.isDirectory()) { copy(rel); continue; }
      if (skip.has(path.normalize(rel)) || /\.(md|csv)$/i.test(e.name)) continue;
      fs.mkdirSync(path.join(OUT, dir), { recursive: true });
      fs.copyFileSync(path.join(PUB, rel), path.join(OUT, rel));
    }
  })('');
  fs.mkdirSync(path.join(OUT, 'js'), { recursive: true });
  fs.writeFileSync(path.join(OUT, name), bundle);
  let first = true;
  const outHtml = html.replace(/[ \t]*<script src="js\/[^"?]+(?:\?v=[^"]*)?"><\/script>\r?\n?/g, m => { if (!first) return ''; first = false; return m.replace(/js\/[^"]+/, name); });
  fs.writeFileSync(path.join(OUT, 'index.html'), outHtml);
  return { out: OUT, files: files.length, bundle: name, bytes: Buffer.byteLength(bundle) };
}
module.exports = build;
if (require.main === module) {
  const r = build(process.argv[2]);
  console.log('Đã gộp ' + r.files + ' file js thành ' + r.bundle + ' (' + (r.bytes / 1024 / 1024).toFixed(2) + ' MB) → ' + path.relative(ROOT, r.out) + '/');
}
