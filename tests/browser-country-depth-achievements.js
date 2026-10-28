'use strict';
const assert = require('assert'), fs = require('fs'), path = require('path');
const { launch, page, sleep } = require('./lib/cdp');
const url = process.env.MOTDOI_URL || 'http://localhost:8084/';
(async () => {
  // Node WebSocket alone may not keep the event loop alive while Chrome is loading.
  const keepAlive = setInterval(() => {}, 1000);
  const deadline = setTimeout(() => { console.error('FAIL browser country depth: timed out after 90 seconds'); process.exit(1); }, 90000);
  const chrome = await launch(); let checks = 0;
  console.log('Browser launched for country depth review.');
  const ok = (x, m) => { assert(x, m); checks++; };
  fs.mkdirSync(path.join(__dirname, '../.cache/country-depth-review'), { recursive: true });
  try {
    for (const width of [390, 1280]) {
      console.log('Review viewport ' + width);
      const p = await page(chrome, url, { width, height: 950 });
      console.log('Page loaded; loading game.');
      await p.eval(async () => { await MotDoiBoot.load(); document.querySelector('#legacyBtn').click(); });
      ok(await p.eval(() => document.querySelectorAll('.ach').length === G.E.ACHIEVEMENTS.length), 'all achievements rendered');
      ok(await p.eval(() => document.body.innerText.includes('Ba mùa Shōgatsu') && document.body.innerText.includes('Trăm bàn để nhớ')), 'culture and football titles visible');
      ok(await p.eval(() => document.documentElement.scrollWidth <= innerWidth + 1), 'achievement modal no overflow');
      await p.screenshot(path.join(__dirname, '../.cache/country-depth-review/achievements-' + width + '.png'));
      await p.eval(() => {
        document.querySelector('#legX').click();
        const E = G.E, l = E.createLife({ mode: 'world', country: 'FI', year: 2006, seed: 195 });
        Object.assign(l, { age: 20, alive: true, school: null, indep: true, money: l.base * 100, pending: [] });
        l.pending = [E.DEC.world_cuisine173.make(l, () => .1)]; l.pending[0].manual = true;
        localStorage.setItem('mkn.current', JSON.stringify({ life: l, cohort: [], auto: false, speed: 1 }));
      });
      await p.reload(); await p.eval(async () => { await MotDoiBoot.load(); document.querySelector('#resumeBtn').click(); }); await sleep(200);
      ok(await p.eval(() => { const b = [...document.querySelectorAll('.opt')].find(b => b.innerText.includes('Học cách làm Ruisleipä')); if (!b) return false; b.click(); return true; }), 'real learn click');
      ok(await p.eval(() => Object.keys(JSON.parse(localStorage.getItem('mkn.current')).life.flags.culture173.kitchen.learned).length === 1), 'recipe persists');
      await p.eval(() => { const s = JSON.parse(localStorage.getItem('mkn.current')); s.life.age++; s.life.pending = [G.E.DEC.world_cuisine173.make(s.life, () => .1)]; s.life.pending[0].manual = true; localStorage.setItem('mkn.current', JSON.stringify(s)); });
      await p.reload(); await p.eval(async () => { await MotDoiBoot.load(); document.querySelector('#resumeBtn').click(); }); await sleep(200);
      ok(await p.eval(() => [...document.querySelectorAll('.opt')].some(b => b.innerText.includes('Thực hành Ruisleipä'))), 'next year recipe usable after reload');
      ok(await p.eval(() => document.documentElement.scrollWidth <= innerWidth + 1), 'cuisine no overflow');
      await p.screenshot(path.join(__dirname, '../.cache/country-depth-review/cuisine-' + width + '.png'));
      await p.load(url + 'updates.html');
      ok(await p.eval(() => { const a = document.querySelector('.update-entry'); return a.innerText.includes('Thành tựu quốc gia') && a.innerText.includes('Đã phát hành') && a.innerText.includes('109') && a.innerText.includes('40'); }), 'latest note released');
      await p.eval(() => { const q = document.querySelector('#updateSearch'); q.value = 'can bep dia phuong'; q.dispatchEvent(new Event('input')); });
      ok(await p.eval(() => document.querySelector('.update-entry').innerText.includes('Thành tựu quốc gia')), 'accentless search');
      await p.eval(() => { const q = document.querySelector('#updateSearch'); q.value = ''; q.dispatchEvent(new Event('input')); document.querySelector('#moreUpdates').click(); });
      ok(await p.eval(() => document.querySelectorAll('.update-entry').length > 8), 'load more');
      await p.eval(() => [...document.querySelectorAll('#updateFilters button')].find(b => b.innerText === 'Sửa lỗi').click());
      ok(await p.eval(() => document.querySelector('.update-entry').innerText.includes('Thành tựu quốc gia')), 'filter includes latest');
      ok(await p.eval(() => document.documentElement.scrollWidth <= innerWidth + 1), 'updates no overflow');
      await p.screenshot(path.join(__dirname, '../.cache/country-depth-review/updates-' + width + '.png'));
      ok(p.errors.length === 0, 'no JS errors'); p.close();
    }
  } finally { await chrome.close(); clearInterval(keepAlive); clearTimeout(deadline); }
  console.log('PASS browser country depth + achievements: ' + checks + ' checks at 390/1280px; real learn click, saved recipe, released note/search/filter/load more.');
})().catch(e => { console.error(e); process.exit(1); });
