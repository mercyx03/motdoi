/* Chrome thật (CDP): hồ sơ có nền đặc ở khung dưới, nút đóng không bị che, bấm nhóm hành động phản hồi nhanh trên bản lưu lớn,
   bấm nhanh nhiều lần không lỗi; chọn khối THPT bằng chuột, tải lại vẫn giữ, mục Học tập có xem/đổi khối. Điện thoại 390 px và máy tính 1280 px. */
'use strict';
const assert = require('assert'), fs = require('fs'), path = require('path'), { spawn } = require('child_process'), { launch, page, sleep } = require('./lib/cdp');
const OUT = path.resolve('.cache/ui912-browser');
async function server() {
  if (process.env.TEST_URL) return { url: process.env.TEST_URL, stop() {} };
  const port = 8600 + Math.floor(Math.random() * 300), proc = spawn(process.execPath, [path.join(__dirname, '..', 'tools', 'serve.js')], { env: Object.assign({}, process.env, { PORT: String(port) }), stdio: 'ignore' });
  for (let i = 0; i < 100; i++) { try { if ((await fetch('http://127.0.0.1:' + port + '/')).ok) break; } catch (e) { } await sleep(100); }
  return { url: 'http://127.0.0.1:' + port + '/', stop() { proc.kill(); } };
}
async function realClick(p, selector) {
  const pos = await p.eval(sel => { const b = document.querySelector(sel); if (!b || b.disabled) return null; b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, selector);
  assert(pos, 'clickable ' + selector);
  await p.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...pos, button: 'left', clickCount: 1 });
  await p.send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...pos, button: 'left', clickCount: 1 });
  await sleep(150);
}
async function resume(p) { await p.reload(); await p.eval(async () => { await MotDoiBoot.load(); document.querySelector('#resumeBtn').click(); }); await sleep(400); await p.eval(() => { const b = document.getElementById('pauseBtn'); if (b && /Tạm dừng/.test(b.textContent)) b.click(); document.querySelectorAll('#modalRoot .modal').forEach(m => { const c = [...m.querySelectorAll('button')].find(x => /Thu nhỏ/.test(x.textContent)); if (c) c.click(); }); }); await sleep(150); }
(async () => {
  let c, srv; const keep = setInterval(() => { }, 1000); fs.mkdirSync(OUT, { recursive: true });
  try {
    srv = await server(); c = await launch();
    for (const width of [390, 1280]) {
      const p = await page(c, srv.url, { width, height: 900 });
      // Bản lưu lớn: 45 năm tự chơi.
      await p.eval(async () => { await MotDoiBoot.load(); const E = G.E, l = E.createLife({ mode: 'vn', seed: 777001, year: 1975 });
        for (let y = 0; y < 45 && l.alive; y++) { E.beginYear(l, { auto: true }); let g = 0; while (l.pending.length && g++ < 64) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); g = 0; while (l.pending.length && g++ < 64) E.resolve(l, E.autoKey(l)); E.endYear(l); }
        l.pending = []; G.SaveStore.write('mkn.current', { life: l, cohort: E.makeCohort(l), speed: 1, auto: false, at: Date.now() }); });
      await resume(p);
      // Nhóm hành động: xử lý đồng bộ dưới 150 ms (trước sửa: 280–740 ms vì sao chép bản lưu cho từng hành động).
      const groupMs = await p.eval(() => { const out = []; for (const b of [...document.querySelectorAll('#actPanel [data-ag]')].slice(0, 6)) { const sel = '[data-ag="' + b.dataset.ag + '"]', t = performance.now(); document.querySelector('#actPanel ' + sel).click(); out.push(performance.now() - t); } return out; });
      groupMs.sort((a, b) => a - b);
      assert(groupMs.length >= 3 && groupMs[groupMs.length - 1] < 150, 'group clicks fast: ' + groupMs.map(x => x.toFixed(0)).join(','));
      // Hồ sơ: nền đặc, cuộn tới khung dưới, nút đóng không bị che.
      await realClick(p, width < 768 ? '#mnav [data-to="prof"]' : '#profBtn');
      const prof = await p.eval(() => { const m = document.querySelector('#modalRoot .modal.profile'); if (!m) return null; m.scrollTop = m.scrollHeight; const bg = getComputedStyle(m).backgroundColor, b = m.querySelector('[data-x="close"]'), r = b.getBoundingClientRect(), hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
        return { bg, alpha: /\/\s*0?\.\d+\)|rgba\([^)]*,\s*0?\.\d+\)/.test(bg), covered: !(hit === b || b.contains(hit)), sections: m.querySelectorAll('.prof-sec').length, empty: [...m.querySelectorAll('.prof-sec')].filter(s => !s.innerText.replace(/\s/g, '')).length, pill: getComputedStyle(document.getElementById('decPill')).visibility }; });
      assert(prof && !prof.alpha, 'profile modal opaque: ' + (prof && prof.bg));
      assert(!prof.covered, 'close button at bottom of profile is clickable');
      assert(prof.sections >= 6 && prof.empty === 0, 'profile sections rendered');
      await p.screenshot(path.join(OUT, 'profile-bottom-' + width + '.png'));
      await realClick(p, '#modalRoot [data-x="close"]');
      assert(await p.eval(() => !document.querySelector('#modalRoot .modal.profile')), 'profile closes');
      // Bấm nhanh: mở/đóng hồ sơ và đổi nhóm liên tục, không lỗi, không còn hộp thoại treo.
      await p.eval(async () => { const open = () => (document.querySelector('#mnav [data-to="prof"]') && innerWidth < 768 ? document.querySelector('#mnav [data-to="prof"]') : document.getElementById('profBtn')).click();
        for (let i = 0; i < 10; i++) { open(); const x = document.querySelector('#modalRoot [data-x="close"]'); if (x) x.click(); const gs = document.querySelectorAll('#actPanel [data-ag]'); if (gs.length) gs[i % gs.length].click(); } });
      await sleep(200);
      assert(await p.eval(() => !document.querySelector('#modalRoot .modal.profile')), 'no stale profile after rapid clicks');
      // Khối THPT: học sinh 16 tuổi, chọn bằng chuột, tải lại vẫn giữ.
      await p.eval(() => { const E = G.E, l = E.createLife({ mode: 'vn', seed: 912300, year: 2010, noOrphan: true }); Object.assign(l, { age: 16, school: 'upper', schoolEnd: 18, edu: 2, khoi: null, pending: [], sched: [], abroad: null, jailUntil: null });
        const d = E.DEC.chon_khoi.make(l, () => .5); l.pending = [d]; G.SaveStore.write('mkn.current', { life: l, cohort: [], speed: 1, auto: false, at: Date.now() }); });
      await p.reload(); await p.eval(async () => { await MotDoiBoot.load(); document.querySelector('#resumeBtn').click(); }); await sleep(500);
      const shown = await p.eval(() => { const m = document.querySelector('#modalRoot .modal'); return m && m.textContent; });
      assert(shown && /Chọn khối thi/.test(shown) && /thi Ngữ văn, Lịch sử, Địa lý/.test(shown), 'khoi decision shows subjects');
      await realClick(p, '#modalRoot [data-k="C00"]');
      const saved = await p.eval(() => { const l = G.SaveStore.read('mkn.current').value.life; return { k: l.khoi, src: l.flags.khoi912 && l.flags.khoi912.src }; });
      assert.deepStrictEqual(saved, { k: 'C00', src: 'manual' }, 'manual khoi saved');
      await resume(p);
      const row = await p.eval(() => { const l = G.SaveStore.read('mkn.current').value.life; return { k: l.khoi, row: G.E.actions(l).find(r => r.id === 'khoi912') }; });
      assert(row.k === 'C00' && row.row.ok === true && /C00/.test(row.row.l), 'reload keeps block; Study menu shows change entry');
      await p.screenshot(path.join(OUT, 'khoi-' + width + '.png'));
      assert(await p.eval(() => document.documentElement.scrollWidth <= innerWidth + 1), 'no horizontal overflow');
      assert.deepStrictEqual(p.errors, [], 'no JS errors');
      p.close();
      console.log('PASS ui912 Chrome ' + width + ': groups ' + groupMs.map(x => x.toFixed(0)).join('/') + ' ms, opaque profile bottom, close not covered, rapid clicks, manual khoi + reload');
    }
  } finally { if (c) await c.close(); if (srv) srv.stop(); clearInterval(keep); }
})().catch(e => { console.error(e); process.exitCode = 1; });
