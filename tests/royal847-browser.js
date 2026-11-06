'use strict';
const assert = require('node:assert/strict'), fs = require('fs'), http = require('http'), path = require('path'), { launch, page, sleep } = require('./lib/cdp');

(async () => {
  let c, srv;
  const keep = setInterval(() => {}, 1000);
  try {
    if (!process.env.TEST_URL) {
      const mime = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' };
      srv = http.createServer((req, res) => {
        let u = new URL(req.url, 'http://127.0.0.1').pathname;
        if (u === '/') u = '/index.html';
        const fp = path.join('public', u);
        if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.statusCode = 404; return res.end('404'); }
        res.setHeader('Content-Type', mime[path.extname(fp)] || 'application/octet-stream');
        res.end(fs.readFileSync(fp));
      });
      await new Promise(r => srv.listen(0, '127.0.0.1', r));
      process.env.TEST_URL = 'http://127.0.0.1:' + srv.address().port + '/';
    }
    c = await launch();
    fs.mkdirSync('.cache/royal847-browser', { recursive: true });
    for (const width of [390, 1280]) {
      const base = process.env.TEST_URL || 'http://127.0.0.1:8089/';
      const p = await page(c, base, { width, height: 950 });

      // 1. Kiểm tra giao diện Chương trình đào tạo người kế vị Thụy Điển (SE) & nghi thức sinh con Hoàng gia
      await p.eval(async () => {
        await MotDoiBoot.load();
        localStorage.clear();
        const E = G.E, R = E.ROYAL920, A = E.ROYAL837, B = E.ROYAL847;
        const l = E.createLife({ mode: 'world', country: 'SE', seed: 8471, year: 2006, gender: 'F' });
        Object.assign(l, { age: 20, birthYear: 2006, alive: true, indep: true, school: null, job: null, pending: [], sched: [], jailUntil: null, abroad: null, acts: 0, _yearRun: true, religion: 'Tin Lành Lutheran' });
        l.flags.royal = { c: 'SE', tier: 'direct' };
        l.flags.royal920 = { houses: {}, met: {}, ledger: [], v: 1 };
        const h = {
          cc: 'SE',
          name: A.CULTURE.SE.house,
          seat: 'root',
          founder837: 'root',
          members: [
            { id: 'root', name: 'Quốc vương Thụy Điển', sex: 'M', by: 1955, role: 'sovereign', alive: true, titles: [{ key: 'sovereign' }], religion837: 'Tin Lành Lutheran', country837: 'SE' },
            { id: 'player', player: true, name: l.name, sex: 'F', by: 2006, role: 'child', parent: 'root', alive: true, titles: [{ key: 'prince' }], religion837: 'Tin Lành Lutheran', country837: 'SE' }
          ]
        };
        R.st(l).houses.SE = h;
        A.prepare(l, h, false);
        B.syncTitles(l, h, h.members[0], null, () => {});
        const d = E.DEC.royalSwedenTrack847.make(l, () => 0.3);
        l.pending = [d];
        G.SaveStore.write('mkn.settings', { minorOnly: false });
        G.SaveStore.write('mkn.current', { life: l, cohort: [], auto: false, speed: 1 });
      });

      await p.reload();
      await p.eval(() => document.querySelector('#resumeBtn').click());
      for (let i = 0; i < 100; i++) {
        if (await p.eval(() => !!document.querySelector('#modalRoot .opt'))) break;
        await sleep(100);
      }
      await sleep(500);
      const seAudit = await p.eval(() => ({
        text: document.querySelector('#modalRoot').textContent,
        overflow: document.documentElement.scrollWidth > innerWidth + 1
      }));
      assert(!seAudit.overflow, 'SE modal no horizontal overflow at ' + width);
      assert(seAudit.text.includes('Hiến pháp Thụy Điển') && seAudit.text.includes('Riksdag') && seAudit.text.includes('Lục quân'), 'SE heir track modal rendered');
      await p.screenshot(path.resolve('.cache/royal847-browser/se-track-' + width + '.png'));
      await p.eval(() => document.querySelector('#modalRoot .opt[data-k="0"]').click());
      await sleep(250);

      // 2. Kiểm tra trang Nhật ký cập nhật (updates.html) hiển thị mục 8.10.47 (packaged)
      await p.load(new URL('updates.html', base).href);
      await sleep(300);
      const notesAudit = await p.eval(() => ({
        first: document.querySelector('#updateTimeline article')?.textContent || '',
        overflow: document.documentElement.scrollWidth > innerWidth + 1
      }));
      assert(!notesAudit.overflow, 'updates.html no horizontal overflow at ' + width);
      assert(notesAudit.first.includes('8.10.51') && notesAudit.first.includes('Đã phát hành') && notesAudit.first.includes('Vương quốc Anh') && notesAudit.first.includes('Monaco') && !/\b\w*\?\w*\b/.test(notesAudit.first), '8.10.51 update note is first, marked released, and has clean Vietnamese UTF-8');
      await p.screenshot(path.resolve('.cache/royal847-browser/updates-' + width + '.png'));
      assert.deepEqual(p.errors, []);
      p.close();
      console.log('PASS royal847 browser ' + width + 'px');
    }
  } finally {
    if (c) await c.close();
    if (srv) srv.close();
    clearInterval(keep);
  }
})().catch(e => {
  console.error(e);
  process.exitCode = 1;
});
