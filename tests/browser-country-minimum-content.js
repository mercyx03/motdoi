'use strict';
const assert = require('assert'), fs = require('fs'), path = require('path'), { launch, page, sleep } = require('./lib/cdp');
const base = process.env.MOTDOI_URL || 'http://localhost:8084/';
(async () => {
  let chrome, checks = 0; const keepAlive = setInterval(() => {}, 1000);
  const timer = setTimeout(() => { if (chrome) chrome.proc.kill(); console.error('FAIL country UI timeout'); process.exit(1); }, 90000);
  const ok = (v, m) => { assert(v, m); checks++; };
  fs.mkdirSync(path.join(__dirname, '../.cache/country-minimum-review'), { recursive: true });
  try {
    chrome = await launch();
    for (const width of [390, 1280]) {
      const p = await page(chrome, base, { width, height: 1000 }); await p.eval(async () => MotDoiBoot.load());
      for (const cc of ['FI', 'GH', 'IE', 'NZ', 'JP', 'FR', 'US', 'VN']) {
        await p.eval(cc => {
          const E = G.E, l = E.createLife({ mode: 'world', country: cc, year: 2002, seed: 894 });
          Object.assign(l, { age: 24, alive: true, school: null, indep: true, money: l.base * 20, pending: [], job: { id: 'ke_toan', rank: 0, yrs: 2, since: 22, rep: 50 } }); l.flags.military = 0;
          l.pending = [E.DEC.countryStories173.make(l, () => .5)]; l.pending[0].manual = true;
          localStorage.setItem('mkn.current', JSON.stringify({ life: l, cohort: [], auto: false, speed: 1 }));
        }, cc);
        await p.reload(); await p.eval(async () => { await MotDoiBoot.load(); document.querySelector('#resumeBtn').click(); }); await sleep(120);
        ok(await p.eval(() => document.body.innerText.includes('Câu chuyện riêng ở nơi đang sống')), cc + ' menu visible');
        ok(await p.eval(() => { const E = G.E, s = JSON.parse(localStorage.getItem('mkn.current')), e = E.countryDepth173(s.life.country).lifeEvents.find(e => e.kind === 'work'); const b = [...document.querySelectorAll('.opt')].find(b => b.innerText.includes(e.title)); if (!b) return false; b.click(); return true; }), cc + ' real country story click'); await sleep(100);
        ok(await p.eval(() => document.body.innerText.includes('Mốc tham chiếu') || document.body.innerText.includes('Thông tin tham chiếu năm')), cc + ' dated facts visible');
        ok(await p.eval(() => { const b = [...document.querySelectorAll('.opt')].find(b => !b.innerText.includes('Để dịp khác')); if (!b) return false; b.click(); return true; }), cc + ' real choice'); await sleep(100);
        ok(await p.eval(cc => { const l = JSON.parse(localStorage.getItem('mkn.current')).life, e = G.E.countryDepth173(cc).lifeEvents.find(e => e.kind === 'work'), q = l.flags.culture173.cases[e.id]; return q.status === 'active' && q.progress === 0 && !!q.actor; }, cc), cc + ' plan and actor saved');
        await p.eval(() => { const s = JSON.parse(localStorage.getItem('mkn.current')), e = G.E.countryDepth173(s.life.country).lifeEvents.find(e => e.kind === 'work'); s.life.age++; s.life.pending = [G.E.DEC[e.eventId].make(s.life, () => 0)]; s.life.pending[0].manual = true; localStorage.setItem('mkn.current', JSON.stringify(s)); });
        await p.reload(); await p.eval(async () => { await MotDoiBoot.load(); document.querySelector('#resumeBtn').click(); }); await sleep(100);
        ok(await p.eval(() => document.body.innerText.includes('Đang theo dõi bước 1/2') && document.body.innerText.includes('Cùng xem lại bước đã chuẩn bị')), cc + ' saved follow-up next year');
        ok(await p.eval(() => document.documentElement.scrollWidth <= innerWidth + 1), cc + ' no overflow');
        if (cc === 'GH' || cc === 'JP') { await sleep(450); await p.screenshot(path.join(__dirname, '../.cache/country-minimum-review/' + cc + '-' + width + '.png')); }
      }
      await p.load(base + 'updates.html');
      ok(await p.eval(() => document.querySelector('.update-entry').innerText.includes('8 quốc gia') && document.querySelector('.update-entry').innerText.includes('Đã phát hành')), 'latest eight-country note released');
      await p.eval(() => { const q = document.querySelector('#updateSearch'); q.value = 'cau chuyen'; q.dispatchEvent(new Event('input')); });
      ok(await p.eval(() => document.querySelector('.update-entry').innerText.includes('8 quốc gia')), 'accentless search');
      ok(await p.eval(() => document.documentElement.scrollWidth <= innerWidth + 1), 'history no overflow');
      ok(p.errors.length === 0, 'no JS exceptions'); p.close();
    }
  } finally { if (chrome) await chrome.close(); clearTimeout(timer); clearInterval(keepAlive); }
  console.log('PASS browser country minimum content: ' + checks + ' checks; 8 countries, real choice and actor/save/follow-up, 390/1280px.');
})().catch(e => { console.error(e); process.exit(1); });
