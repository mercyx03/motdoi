'use strict';
const assert = require('assert'), path = require('path'), fs = require('fs');
const { launch, page, sleep } = require('./lib/cdp');
const url = process.env.MOTDOI_URL || 'http://localhost:8080/';
function seed(id) {
  const E = G.E, l = E.createLife({ mode: 'vn', seed: 175 });
  Object.assign(l, { age: 18, alive: true, school: null, indep: true, money: l.base * 100, edu: 3, record: 0, job: null, pending: [], yr: { items: [] } });
  l.flags.military = 0; E.FOOTBALL.init(l, () => .8);
  if (id === 'footballResults') { l.flags.football.stage = 'youth'; l.flags.football.club = 'VN-0'; E.FOOTBALL.annual(l, () => .5, () => {}); }
  const d = E.DEC[id].make(l, () => .5, { country: 'VN' }); d.manual = true; l.pending = [d];
  localStorage.setItem('mkn.current', JSON.stringify({ life: l, cohort: [], auto: false, speed: 1 }));
}
(async () => {
  fs.mkdirSync(path.join(__dirname, '../.cache/football-review'), { recursive: true });
  const chrome = await launch(), errors = []; let checks = 0;
  try {
    for (const width of [390, 1280]) {
      const p = await page(chrome, url, { width, height: 950 });
      await p.eval(async () => { await MotDoiBoot.load(); return true; });
      for (const id of ['footballCareer', 'footballClubs', 'footballTraining', 'footballResults']) {
        await p.eval(seed, id); await p.reload();
        await p.eval(async () => { await MotDoiBoot.load(); const b = document.querySelector('#resumeBtn'); if (b) b.click(); return true; }); await sleep(250);
        assert(await p.eval(() => document.documentElement.scrollWidth <= innerWidth + 1), id + ' horizontal overflow'); checks++;
        assert(await p.eval(() => document.body.innerText.includes('bóng đá') || document.body.innerText.includes('Mùa giải')), id + ' visible'); checks++;
        assert(await p.eval(() => { const e = document.querySelector('.football-summary'); return !!e && getComputedStyle(e).whiteSpace === 'pre-line'; }), id + ' readable line breaks'); checks++;
        if (id === 'footballTraining') {
          assert(await p.eval(() => { const b = [...document.querySelectorAll('.opt')].find(b => b.innerText.includes('Vị trí: Thủ môn')); if (!b) return false; b.click(); return true; })); await sleep(250);
          assert(await p.eval(() => JSON.parse(localStorage.getItem('mkn.current')).life.flags.football.position === 'GK'), 'position persisted from real UI click'); checks++;
        }
        await p.screenshot(path.join(__dirname, '../.cache/football-review/' + id + '-' + width + '.png'));
      }
      await p.load(url.replace(/\/$/, '') + '/updates.html');
      assert(await p.eval(() => document.documentElement.scrollWidth <= innerWidth + 1), 'updates overflow'); checks++;
      assert(await p.eval(() => { const text = document.body.innerText; return text.includes('Sự nghiệp bóng đá chuyên nghiệp') && text.includes('Đã phát hành'); }), 'latest released football update visible'); checks++;
      await p.eval(() => { const e = document.querySelector('#updateSearch'); e.value = 'bong da'; e.dispatchEvent(new Event('input')); });
      assert(await p.eval(() => document.body.innerText.includes('Sự nghiệp bóng đá chuyên nghiệp')), 'accentless search'); checks++;
      await p.screenshot(path.join(__dirname, '../.cache/football-review/updates-' + width + '.png'));
      errors.push(...p.errors); p.close();
    }
  } finally { await chrome.close(); }
  assert.deepStrictEqual(errors, []); console.log('PASS browser-football: ' + checks + ' checks, real menu click/save, 390/1280px, updates released label/search, no JS errors');
})().catch(e => { console.error(e); process.exit(1); });
