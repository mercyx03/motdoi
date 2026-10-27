'use strict';
const assert = require('assert'), path = require('path'), { launch, page, sleep } = require('./lib/cdp');
const url = process.env.MOTDOI_URL || 'http://localhost:8080/';
function seed(id) {
  const E = G.E, l = E.createLife({ mode: 'vn', seed: 157 });
  Object.assign(l, { age: 30, alive: true, school: null, indep: true, money: l.base * 1000, edu: 5, record: 0, job: null, pending: [], yr: { items: [] } });
  l.flags.military = 0;
  let arg;
  if (id === 'thoi_noi') { l.age = 1; l.indep = false; Object.assign(l.fam, { fAlive: true, noDad: false, fInc: 0, mAlive: true, mInc: 2.53 }); }
  if (id === 'practice138') arg = { skill: 'sing' };
  if (id === 'ranking158') arg = { scope: 'all' };
  if (id === 'mediaChannel160') { const c = { id: 'youtube', app: 'youtube', name: 'Kênh thử', topic: 'Học tập', followers: 20000, reputation: 60, engagement: 40, equipment: 1, staff: 2, studio: 0, staffPaidAt: l.age, totalRevenue: 0 }; E.SOCIAL131.state(l).channels.push(c); arg = { id: c.id }; }
  const d = E.DEC[id].make(l, () => .1, arg); d.manual = true; l.pending = [d];
  localStorage.setItem('mkn.current', JSON.stringify({ life: l, cohort: [], auto: false, speed: 1 }));
  return true;
}
(async () => {
  const chrome = await launch(); let count = 0; const errors = [];
  try {
    for (const width of [390, 1280]) {
      const p = await page(chrome, url, { width, height: 950 });
      await p.eval(async () => { await MotDoiBoot.load(); return true; });
      for (const [id, text] of [['thoi_noi', 'đồ mượn'], ['standing158', 'Quyền lực kinh tế'], ['ranking158', 'giá trị cổ phần'], ['practice138', 'Huấn luyện chuyên nghiệp'], ['mediaChannel160', 'Phạm vi ủy quyền']].filter(f=>!process.env.CONTEXT_ONLY||f[0]===process.env.CONTEXT_ONLY)) {
        await p.eval(seed, id); await p.reload();
        await p.eval(async () => { await MotDoiBoot.load(); const b = document.querySelector('#resumeBtn'); if (b) b.click(); return true; }); await sleep(500);
        const body = await p.eval(() => document.body.innerText);
        assert(body.toLowerCase().includes(text.toLowerCase()), id + ' missing ' + text);
        assert(!/undefined|NaN|\[object/.test(body), id + ' invalid text');
        assert(await p.eval(() => document.documentElement.scrollWidth <= innerWidth + 1), id + ' overflow');
        if (id === 'mediaChannel160') { assert(await p.eval(() => { const b = [...document.querySelectorAll('.opt')].find(b => b.innerText.includes('Bật: Tự động quản lý')); if (!b) return false; b.click(); return true; })); await sleep(300); }
        await p.screenshot(path.join(__dirname, '../.cache/context-' + id + '-' + width + '.png')); count++;
      }
      await p.load(url + 'updates.html');
      assert(await p.eval(() => document.documentElement.scrollWidth <= innerWidth + 1), 'updates overflow');
      assert(await p.eval(() => { const q = document.querySelector('#updateSearch'); q.value = 'tuoi tho'; q.dispatchEvent(new Event('input', { bubbles: true })); return true; })); await sleep(200);
      assert((await p.eval(() => document.querySelector('#updateTimeline').innerText)).includes('Tuổi thơ'), 'unaccented update search');
      await p.screenshot(path.join(__dirname, '../.cache/context-updates-' + width + '.png'));
      errors.push(...p.errors); p.close();
    }
  } finally { await chrome.close(); }
  assert.deepStrictEqual(errors, []); console.log('PASS browser-life-context: ' + count + ' flows, updates search, 390px/1280px, no overflow or JavaScript errors');
})().catch(e => { console.error(e); process.exit(1); });
