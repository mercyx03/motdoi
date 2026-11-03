'use strict';
const assert = require('node:assert/strict');
const { launch, page } = require('./lib/cdp');
(async () => {
  const browser = await launch();
  try {
    for (const width of [390, 1280]) {
      const p = await page(browser, process.env.MOTDOI_URL || 'http://localhost:8082/', { width });
      await p.eval(async () => {
        localStorage.clear();
        await MotDoiBoot.load();
        document.querySelector('[data-mode="world"]').click();
      });
      const options = await p.eval(() => Array.from(document.querySelector('#countrySel').options, o => o.value));
      assert.equal(options[0], '');
      assert.deepEqual(options.slice(1).sort(), await p.eval(() => G.W.C.filter(c => c.births > 0).map(c => c.code).sort()));
      await p.eval(() => {
        const s = document.querySelector('#countrySel');
        s.value = 'KR';
        s.dispatchEvent(new Event('change'));
        document.querySelector('#reroll').click();
      });
      await p.reload();
      await p.eval(async () => { await MotDoiBoot.load(); });
      assert.equal(await p.eval(() => document.querySelector('#countrySel').value), 'KR');
      assert.match(await p.eval(() => document.querySelector('#heroProfile .prow').textContent), /Hàn Quốc/);
      await p.eval(() => document.querySelector('#jobsBtn').click());
      const audit = await p.eval(() => {
        const box = document.querySelector('#modalRoot');
        const rows = Array.from(box.querySelectorAll('.joblist > li:not(.sub)'));
        const missing = Object.values(G.E.CAR).filter(c => c.id !== 'vdv' && !rows.some(row => row.querySelector('.jt').textContent === c.t.map(G.U.cap).join(' → ') && row.querySelector('.jp b')?.textContent));
        return { count: rows.length, expected: Object.keys(G.E.CAR).length, missing: missing.map(c => c.id), overflow: document.documentElement.scrollWidth > innerWidth + 1 };
      });
      assert.deepEqual(audit, { count: audit.expected, expected: audit.expected, missing: [], overflow: false });
      await p.eval(id => {
        document.querySelector('#jobsClose').click();
        document.querySelector(id).click();
      }, width === 390 ? '#bornBtn' : '#liveThis');
      assert.equal(await p.eval(() => G.SaveStore.read('mkn.current').value.life.country), 'KR');
      assert.deepEqual(p.errors, []);
      p.close();
      console.log('PASS country selection and salary guide at width', width, audit.count, 'entries');
    }
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
