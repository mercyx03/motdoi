/* Trình duyệt thật (Chrome headless, cần http://localhost:8080 — node tools/serve.js): hẹn hò qua app như người chơi —
   mở app, lướt thêm hồ sơ, thu nhỏ / mở lại lựa chọn, nhắn tin — nhiều hạt giống, VN và quốc tế, 390px và 1280px.
   Mỗi bước có giới hạn thời gian: trang bị treo được tính là lỗi. */
'use strict';
const assert = require('assert'), { launch, page, sleep } = require('./lib/cdp');
const URL = process.env.MOTDOI_URL || 'http://localhost:8080/';
function within(ms, p, what) { let t; return Promise.race([p, new Promise((_, rej) => { t = setTimeout(() => rej(Error('Trang không phản hồi sau ' + ms + 'ms: ' + what)), ms); })]).finally(() => clearTimeout(t)); }
function seed(s, mode) {
  const E = G.E, l = E.createLife({ mode, seed: s });
  Object.assign(l, { age: 24, alive: true, school: null, indep: true, partner: null, pending: [], yr: { items: [] } }); l.flags.military = 0; l.money = l.base * 5;
  const d = E.DEC.tim_nguoi_yeu.make(l, () => 0.5); d.manual = true; l.pending = [d];
  localStorage.setItem('mkn.current', JSON.stringify({ life: l, cohort: [], auto: false, speed: 1 }));
  return true;
}
function click(prefix) { const b = Array.from(document.querySelectorAll('.opt')).find(x => x.querySelector('b') && x.querySelector('b').innerText.trim().startsWith(prefix)); if (!b) return Array.from(document.querySelectorAll('.opt b')).map(x => x.innerText).join(' | ') || 'không có lựa chọn'; b.click(); return true; }
function clickFirst() { const b = document.querySelector('.opt'); if (!b) return false; b.click(); return true; }
function key(k) { document.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true })); return true; }
(async () => {
  const chrome = await launch(), errors = []; let runs = 0;
  try {
    for (const width of [390, 1280]) {
      const p = await page(chrome, URL, { width, height: 900 });
      for (let i = 0; i < 6; i++) {
        const mode = i % 2 ? 'world' : 'vn', tag = width + 'px ' + mode + ' #' + i;
        await within(8000, p.eval(seed, 7900 + i, mode), tag + ' dựng đời'); await p.reload();
        await within(8000, p.eval(() => { const b = document.querySelector('#resumeBtn'); if (b) b.click(); return !!b; }), tag + ' chơi tiếp'); await sleep(400);
        let r = await within(8000, p.eval(click, 'Dùng ứng dụng hẹn hò'), tag + ' chọn app'); assert(r === true, tag + ': ' + r); await sleep(300);
        r = await within(8000, p.eval(clickFirst), tag + ' mở app'); assert(r, tag + ': không có app'); await sleep(300);
        let body = await within(8000, p.eval(() => document.body.innerText), tag + ' đọc hồ sơ');
        assert(/Năm hồ sơ hiện lên/.test(body), tag + ': hiện năm hồ sơ');
        for (let k = 0; k < 2; k++) { r = await within(8000, p.eval(click, 'Lướt thêm 5 hồ sơ'), tag + ' lướt thêm'); if (r !== true) break; await sleep(300); }
        // thu nhỏ rồi mở lại: danh sách hồ sơ giữ nguyên
        const before = await within(8000, p.eval(() => Array.from(document.querySelectorAll('.opt b')).map(x => x.innerText).join('|')), tag + ' trước thu nhỏ');
        await within(8000, p.eval(key, 'Escape'), tag + ' thu nhỏ'); await sleep(250); await within(8000, p.eval(key, 'Escape'), tag + ' mở lại'); await sleep(250);
        const after = await within(8000, p.eval(() => Array.from(document.querySelectorAll('.opt b')).map(x => x.innerText).join('|')), tag + ' sau mở lại');
        assert.strictEqual(after, before, tag + ': mở lại không đổi danh sách hồ sơ');
        r = await within(8000, p.eval(click, 'Nhắn tin với'), tag + ' nhắn tin'); assert(r === true, tag + ': ' + r); await sleep(400);
        body = await within(8000, p.eval(() => document.body.innerText), tag + ' sau nhắn tin');
        assert(!/undefined|NaN/.test(body.split('\n').filter(x => /hồ sơ|nhắn|hẹn|app/i.test(x)).join('\n')), tag + ': chữ hiển thị sạch');
        runs++;
      }
      errors.push(...p.errors.map(e => width + ': ' + e)); p.close();
    }
  } finally { await chrome.close(); }
  assert.deepStrictEqual(errors, [], errors.join('\n'));
  console.log('PASS browser-dating-app: ' + runs + ' lượt mở app, lướt, thu nhỏ / mở lại, nhắn tin (VN và quốc tế, 390px và 1280px); không treo, không lỗi JavaScript.');
})().catch(e => { console.error(e); process.exit(1); });
