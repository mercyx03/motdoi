/* Chrome thật (CDP): mở "Đàn em, địa bàn và rủi ro" từ bảng hành động, xem bảng rủi ro, nhận đàn em, giao việc, mở rộng địa bàn; 390 px và 1280 px. */
'use strict';
const assert = require('assert'), fs = require('fs'), path = require('path'), { spawn } = require('child_process'), { launch, page, sleep } = require('./lib/cdp');
const OUT = path.resolve('.cache/crime913-browser');
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
async function openAction(p, id) {
  return p.eval(id => { const l = G.SaveStore.read('mkn.current').value.life, M = G.E.MENU147, acts = G.E.actions(l).filter(x => x.ok === true), b = M.build(acts, []);
    let group = null, sub = null; Object.keys(b.groups).forEach(g => { if (b.groups[g].some(x => x.id === id)) group = g; Object.keys(b.subs[g] || {}).forEach(s => { if (b.subs[g][s].some(x => x.id === id)) { group = g; sub = s; } }); });
    if (!group) return 'not available: ' + JSON.stringify(G.E.actions(l).find(x => x.id === id));
    const g = document.querySelector('#actPanel [data-ag="' + group + '"]'); if (!g) return 'no group'; if (!g.classList.contains('on')) g.click();
    if (sub) { const s = document.querySelector('#actPanel [data-asub="' + sub + '"]'); if (!s) return 'no sub'; if (!s.classList.contains('on')) s.click(); }
    const a = document.querySelector('#actPanel [data-act="' + id + '"]'); if (!a) return 'no action'; a.click(); return document.querySelector('#modalRoot .modal') ? 'ok' : 'no modal'; }, id);
}
(async () => {
  let c, srv; const keep = setInterval(() => { }, 1000); fs.mkdirSync(OUT, { recursive: true });
  try {
    srv = await server(); c = await launch();
    for (const width of [390, 1280]) {
      const p = await page(c, srv.url, { width, height: 900 });
      await p.eval(async () => { await MotDoiBoot.load(); const E = G.E, l = E.createLife({ mode: 'vn', seed: 91301, year: 1990 });
        Object.assign(l, { age: 32, indep: true, alive: true, school: null, pending: [], sched: [], jailUntil: null, abroad: null, partner: null, money: l.base * 60 }); l.flags.military = 0; E.startJob(l, 'doi_no', E.H.rf(l), () => {});
        G.SaveStore.write('mkn.current', { life: l, cohort: [], speed: 1, auto: false, at: Date.now() }); });
      await p.reload(); await p.eval(async () => { await MotDoiBoot.load(); document.querySelector('#resumeBtn').click(); }); await sleep(500);
      await p.eval(() => { const b = document.getElementById('pauseBtn'); if (b && /Tạm dừng/.test(b.textContent)) b.click(); document.querySelectorAll('#modalRoot .modal').forEach(m => { const x = [...m.querySelectorAll('button')].find(y => /Thu nhỏ/.test(y.textContent)); if (x) x.click(); }); });
      assert.strictEqual(await openAction(p, 'crew912'), 'ok', 'crew menu opened');
      assert(await p.eval(() => /khả năng bị mở hồ sơ \d+%/.test(document.querySelector('#modalRoot').textContent)), 'risk report visible');
      await clickText(p, 'Nhận ');
      const hired = await p.eval(() => G.E.CRIME911.state(G.SaveStore.read('mkn.current').value.life).crew.filter(x => x.role912).length);
      assert(hired === 1, 'one crew member hired');
      await clickText(p, 'Quản lý ');
      await clickText(p, 'Giao việc bảo vệ');
      assert(await p.eval(() => G.E.CRIME911.state(G.SaveStore.read('mkn.current').value.life).crew.some(x => x.role912 === 'guard')), 'role assigned');
      await p.screenshot(path.join(OUT, 'crew-' + width + '.png'));
      assert(await p.eval(() => document.documentElement.scrollWidth <= innerWidth + 1), 'no horizontal overflow');
      assert.deepStrictEqual(p.errors, [], 'no JS errors');
      p.close();
      console.log('PASS crime913 Chrome ' + width + ': risk report, hire, assign role');
    }
  } finally { if (c) await c.close(); if (srv) srv.stop(); clearInterval(keep); }
})().catch(e => { console.error(e); process.exitCode = 1; });
