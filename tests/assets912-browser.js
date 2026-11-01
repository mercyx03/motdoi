/* Chrome thật (CDP): bộ chọn tài sản — mở bán từ bảng hành động, gõ tìm kiếm, chuyển trang, chọn căn rẻ nhất, xác nhận; 390 px và 1280 px. */
'use strict';
const assert = require('assert'), fs = require('fs'), path = require('path'), { spawn } = require('child_process'), { launch, page, sleep } = require('./lib/cdp');
const OUT = path.resolve('.cache/assets912-browser');
async function server() {
  if (process.env.TEST_URL) return { url: process.env.TEST_URL, stop() {} };
  const port = 8600 + Math.floor(Math.random() * 300), proc = spawn(process.execPath, [path.join(__dirname, '..', 'tools', 'serve.js')], { env: Object.assign({}, process.env, { PORT: String(port) }), stdio: 'ignore' });
  for (let i = 0; i < 100; i++) { try { if ((await fetch('http://127.0.0.1:' + port + '/')).ok) break; } catch (e) { } await sleep(100); }
  return { url: 'http://127.0.0.1:' + port + '/', stop() { proc.kill(); } };
}
async function clickText(p, text) {
  const pos = await p.eval(t => { const b = [...document.querySelectorAll('#modalRoot .opt')].find(x => x.textContent.includes(t)); if (!b) return null; b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, text);
  assert(pos, 'option visible: ' + text);
  await p.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...pos, button: 'left', clickCount: 1 });
  await p.send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...pos, button: 'left', clickCount: 1 });
  await sleep(200);
}
(async () => {
  let c, srv; const keep = setInterval(() => { }, 1000); fs.mkdirSync(OUT, { recursive: true });
  try {
    srv = await server(); c = await launch();
    for (const width of [390, 1280]) {
      const p = await page(c, srv.url, { width, height: 900 });
      await p.eval(async () => { await MotDoiBoot.load(); const E = G.E, l = E.createLife({ mode: 'vn', seed: 91299, year: 1960 });
        Object.assign(l, { age: 60, indep: true, alive: true, school: null, job: null, pending: [], sched: [], jailUntil: null, abroad: null, props: [], ventures: [], money: l.base * 100 }); l.flags.military = 0;
        for (let i = 0; i < 45; i++) l.props.push({ k: 'apt', n: 'Căn hộ số ' + (i + 1), city: i % 4 ? 'Hà Nội' : 'Đà Nẵng', v: i === 33 ? 2 : 400 + i, basis: 1, y: 0.04, since: 40, empty: 0 });
        G.SaveStore.write('mkn.current', { life: l, cohort: [], speed: 1, auto: false, at: Date.now() }); });
      await p.reload(); await p.eval(async () => { await MotDoiBoot.load(); document.querySelector('#resumeBtn').click(); }); await sleep(500);
      await p.eval(() => { const b = document.getElementById('pauseBtn'); if (b && /Tạm dừng/.test(b.textContent)) b.click(); document.querySelectorAll('#modalRoot .modal').forEach(m => { const x = [...m.querySelectorAll('button')].find(y => /Thu nhỏ/.test(y.textContent)); if (x) x.click(); }); });
      // Mở hành động bán qua đúng đường người chơi đi: bảng hành động.
      const opened = await p.eval(() => { const l = G.SaveStore.read('mkn.current').value.life, M = G.E.MENU147, acts = G.E.actions(l).filter(x => x.ok === true), b = M.build(acts, []);
        let group = null, sub = null; Object.keys(b.groups).forEach(g => { if (b.groups[g].some(x => x.id === 'quan_ly_dau_tu')) group = g; Object.keys(b.subs[g] || {}).forEach(s => { if (b.subs[g][s].some(x => x.id === 'quan_ly_dau_tu')) { group = g; sub = s; } }); });
        const g = document.querySelector('#actPanel [data-ag="' + group + '"]'); if (!g) return 'no group ' + group; if (!g.classList.contains('on')) g.click();
        if (sub) { const s = document.querySelector('#actPanel [data-asub="' + sub + '"]'); if (!s) return 'no sub ' + sub + ' in ' + [...document.querySelectorAll('#actPanel [data-asub]')].map(x => x.dataset.asub).join('|'); if (!s.classList.contains('on')) s.click(); }
        const a = document.querySelector('#actPanel [data-act="quan_ly_dau_tu"]'); if (!a) return 'no action'; a.click(); return document.querySelector('#modalRoot .modal') ? 'ok' : 'no modal'; });
      assert.strictEqual(opened, 'ok', 'sell picker opened from action panel');
      assert(await p.eval(() => /45 tài sản hợp lệ/.test(document.querySelector('#modalRoot').textContent) && document.querySelectorAll('#modalRoot .opt').length <= 55), 'summary and paged list');
      // Gõ tìm kiếm thật vào ô (debounce 300 ms).
      await p.eval(() => { const i = document.getElementById('assetSearch912'); i.focus(); });
      await p.send('Input.insertText', { text: 'Đà Nẵng' }); await sleep(700);
      const searched = await p.eval(() => ({ n: [...document.querySelectorAll('#modalRoot .opt')].filter(b => /Căn hộ số/.test(b.textContent)).length, q: G.SaveStore.read('mkn.current').value.life.pending[0].data.arg.q, focus: document.activeElement && document.activeElement.id }));
      assert(searched.n === 12 && searched.q === 'Đà Nẵng' && searched.focus === 'assetSearch912', 'search filtered to 12 Đà Nẵng flats, focus kept: ' + JSON.stringify(searched));
      await clickText(p, 'Xóa tìm kiếm');
      await clickText(p, 'Trang sau ›');
      assert(await p.eval(() => G.SaveStore.read('mkn.current').value.life.pending[0].data.arg.page === 1), 'moved to page 2');
      await clickText(p, 'Trang sau ›');
      await clickText(p, 'Căn hộ số 34 ·');
      assert(await p.eval(() => /Xác nhận bán tài sản/.test(document.querySelector('#modalRoot').textContent) && /Căn hộ số 34/.test(document.querySelector('#modalRoot').textContent)), 'confirmation shows chosen cheapest flat');
      await p.screenshot(path.join(OUT, 'confirm-' + width + '.png'));
      await clickText(p, 'Xác nhận bán');
      const after = await p.eval(() => { const l = G.SaveStore.read('mkn.current').value.life; return { n: l.props.length, gone: !l.props.some(x => x.n === 'Căn hộ số 34') }; });
      assert(after.n === 44 && after.gone, 'sold exactly the chosen flat');
      assert(await p.eval(() => document.documentElement.scrollWidth <= innerWidth + 1), 'no horizontal overflow');
      assert.deepStrictEqual(p.errors, [], 'no JS errors');
      p.close();
      console.log('PASS assets912 Chrome ' + width + ': action panel → search → paging → cheapest flat → confirm');
    }
  } finally { if (c) await c.close(); if (srv) srv.stop(); clearInterval(keep); }
})().catch(e => { console.error(e); process.exitCode = 1; });
