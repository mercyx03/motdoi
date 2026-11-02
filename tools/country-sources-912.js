'use strict';
// Builds and checks the per-country source table used by data-country-world912.js.
// Usage: node tools/country-sources-912.js [--check] [--retry] [--only=edu|work|culture|wed]
//   without --check: prints the mapping (no network);
//   with --check: fetches every URL and requires HTTP 200 plus the country name in <title>.
// The check proves the official page exists and is the right country; it does not prove
// that each sentence in the game matches the page. Results: docs/country-sources-912.json.
const fs = require('fs'), path = require('path'), { execFile } = require('child_process');
const root = path.join(__dirname, '..');
const G = require('../tests/hardcore-isolation').gameContext();
const data = G.E.COUNTRY_WORLD912;
if (!data) throw Error('COUNTRY_WORLD912 not loaded');

// curl is used because several official sites reset Node's TLS client but serve normal browsers/curl.
function get(url) {
  return new Promise(resolve => {
    execFile('curl', ['-s', '-L', '-m', '40', '--max-redirs', '6', '-w', '\n@@STATUS@@%{http_code}', url], { maxBuffer: 8 * 1024 * 1024, encoding: 'utf8' }, (err, out) => {
      const m = /\n@@STATUS@@(\d+)$/.exec(out || '');
      const body = m ? out.slice(0, m.index) : (out || '');
      resolve({ status: m ? +m[1] : 0, title: ((body.match(/<title[^>]*>([^<]*)/i) || [])[1] || (err ? String(err.message) : '')).trim() });
    });
  });
}
function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, ''); }

(async () => {
  const rows = [];
  for (const cc of Object.keys(data.SRC)) rows.push(...Object.entries(data.urls(cc)).map(([kind, u]) => ({ cc, kind, url: u.url, expect: u.expect })));
  if (process.argv.includes('--table')) {
    // Bảng 195 nước × 6 miền: số mục, cách biên soạn, trạng thái kiểm chứng nguồn, mã sự kiện gameplay gọi tới.
    const file0 = path.join(root, 'docs/country-sources-912.json'), rep = fs.existsSync(file0) ? JSON.parse(fs.readFileSync(file0, 'utf8')).rows : [];
    const st = (cc, kind) => { const x = rep.find(r => r.countryCode === cc && r.kind === kind); return !x ? '—' : x.ok ? 'đạt' : 'chưa kiểm'; };
    const P = G.E.COUNTRY_DEPTH_DATA.profiles, lines = ['# Độ phủ quốc gia §13 — 195 nước × 6 miền (sinh bởi `node tools/country-sources-912.js --table`)', '',
      'Cột số: giáo dục / lễ / cưới hỏi / món ăn / lao động / câu chuyện nhiều năm. "Biên soạn": `verified` = 8 hồ sơ viết tay đợt 8.9.4 (nguồn quốc gia riêng); `compiled-912` = hồ sơ đợt 8.10.17, URL đã kiểm tồn tại và đúng nước nhưng **chưa đối chiếu từng câu**. Nguồn: GD = UNESCO GEM, LĐ = ILO (hoặc cổng chính phủ), VH = UNESCO quốc gia, HN = Ngân hàng Thế giới (dữ liệu giới). Năm tham chiếu 2026 cho mọi nước.', '',
      '| Mã | Nước | Số mục | Biên soạn | GD | LĐ | VH | HN | Sự kiện gameplay |', '|---|---|---|---|---|---|---|---|---|'];
    G.W.C.forEach(c => { const p = P[c.code]; if (!p) { lines.push('| ' + c.code + ' | ' + c.name + ' | 0 | thiếu | — | — | — | — | — |'); return; }
      const n = [p.education.length, p.festivals.length, p.marriage.length, p.cuisine.dishes.length, p.labor.length, p.lifeEvents.length].join('/');
      const hand = p.metadata.authoring !== 'compiled-912';
      lines.push('| ' + c.code + ' | ' + c.name + ' | ' + n + ' | ' + (hand ? 'verified' : 'compiled-912') + ' | ' + (hand ? 'riêng' : st(c.code, 'edu')) + ' | ' + (hand ? 'riêng' : st(c.code, 'work')) + ' | ' + (hand ? 'riêng' : st(c.code, 'culture')) + ' | ' + (hand ? 'riêng' : st(c.code, 'wed')) + ' | ' + p.lifeEvents.map(e => e.eventId).join(', ') + ' |'); });
    fs.writeFileSync(path.join(root, 'docs/COUNTRY-COVERAGE-917.md'), lines.join('\r\n') + '\r\n');
    console.log('wrote docs/COUNTRY-COVERAGE-917.md'); return;
  }
  if (!process.argv.includes('--check')) { rows.forEach(r => console.log(r.cc, r.kind, r.url)); return; }
  // --retry: keep rows that already passed for the same URL, recheck only the rest, one at a time with a pause
  // (www.unesco.org resets connections after bursts of requests).
  const file = path.join(root, 'docs/country-sources-912.json');
  const retry = process.argv.includes('--retry') && fs.existsSync(file);
  const prev = retry ? JSON.parse(fs.readFileSync(file, 'utf8')).rows.filter(x => x.ok) : [];
  const out = rows.filter(r => prev.some(p => p.countryCode === r.cc && p.kind === r.kind && p.url === r.url)).map(r => prev.find(p => p.countryCode === r.cc && p.kind === r.kind && p.url === r.url));
  const only = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7);
  const kept = retry ? JSON.parse(fs.readFileSync(file, 'utf8')).rows.filter(x => !x.ok && only && x.kind !== only) : [];
  const todo = rows.filter(r => !out.some(p => p.countryCode === r.cc && p.kind === r.kind) && (!only || r.kind === only));
  out.push(...kept);
  const pause = retry ? 2500 : 0;
  let i = 0;
  async function worker() {
    while (i < todo.length) {
      const r = todo[i++], res = await get(r.url);
      const titleOk = r.expect.some(n => norm(res.title).includes(norm(n)));
      out.push({ countryCode: r.cc, kind: r.kind, url: r.url, status: res.status, title: res.title, checkedAt: new Date().toISOString(), ok: res.status === 200 && titleOk });
      if (pause) await new Promise(ok => setTimeout(ok, pause));
    }
  }
  await Promise.all(Array.from({ length: retry ? 1 : 6 }, worker));
  out.sort((a, b) => (a.countryCode + a.kind).localeCompare(b.countryCode + b.kind));
  const failed = out.filter(r => !r.ok);
  const report = { checkedAt: new Date().toISOString(), method: 'HTTP GET, status 200 and expected country name in <title>', total: out.length, ok: out.length - failed.length, failed: failed.length, rows: out };
  fs.writeFileSync(path.join(root, 'docs/country-sources-912.json'), JSON.stringify(report, null, 2).replace(/\n/g, '\r\n') + '\r\n');
  console.log('checked', out.length, 'ok', out.length - failed.length, 'failed', failed.length);
  failed.forEach(f => console.log('FAIL', f.countryCode, f.kind, f.status, f.title, f.url));
  process.exitCode = failed.length ? 1 : 0;
})();
