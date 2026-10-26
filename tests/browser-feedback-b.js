/* Trình duyệt thật (Chrome headless, cần máy chủ thử nghiệm http://localhost:8080 — node tools/serve.js):
   menu Gia đình & Tiền bạc chia nhóm con, nút quay lại, chi tiêu định kỳ, hồ sơ con chi tiết; 390px và 1280px, không lỗi JavaScript. */
'use strict';
const assert = require('assert'), path = require('path'), { launch, page, sleep } = require('./lib/cdp');
const URL = process.env.MOTDOI_URL || 'http://localhost:8080/', out = path.join(__dirname, '../.cache');
function seed() {
  const E = G.E, l = E.createLife({ mode: 'vn', seed: 147 });
  Object.assign(l, { age: 40, alive: true, school: null, indep: true, pending: [], yr: { items: [] } });
  l.money = l.base * 300; l.flags.military = 0;
  l.partner = { name: 'Hà', sex: 'F', age: 39, status: 'married', alive: true, relation108: 'rel-ha' };
  l.kids = [{ name: 'Minh', sex: 'M', born: 28, alive: true, edu: 3, study: 75, close: 70, coParent108: { id: 'rel-ha', name: 'Hà', sex: 'F' } }, { name: 'Lan', sex: 'F', born: 31, alive: true, edu: 2, study: 60, close: 64, coParent108: { id: 'rel-ha', name: 'Hà', sex: 'F' } }];
  localStorage.setItem('mkn.actg', 'null'); localStorage.setItem('mkn.actsub', 'null');
  localStorage.setItem('mkn.current', JSON.stringify({ life: l, cohort: [], auto: false, speed: 1 }));
  return true;
}
const click = sel => { const b = document.querySelector(sel); if (!b) return false; b.click(); return true; };
const texts = sel => Array.from(document.querySelectorAll(sel)).map(b => b.innerText);
(async () => {
  const chrome = await launch(), errors = [];
  try {
    for (const width of [390, 1280]) {
      const p = await page(chrome, URL, { width, height: 950 });
      await p.eval(seed); await p.reload();
      assert(await p.eval(click, '#resumeBtn'), 'có nút chơi tiếp'); await sleep(600);
      await p.eval(() => { if (G.S) G.S.paused = true; return true; });
      assert(await p.eval(click, '#actPanel [data-ag="❤ Gia đình & tình cảm"]'), 'có nhóm Gia đình & tình cảm'); await sleep(200);
      const subs = await p.eval(texts, '#actPanel .actsubs [data-asub]');
      assert(subs.some(t => t.startsWith('1. Tình yêu & hôn nhân')) && subs.some(t => t.startsWith('3. Quản lý con cái')), 'nhóm con gia đình: ' + subs);
      assert.strictEqual(await p.eval(() => document.querySelectorAll('#actPanel .actlist').length), 0, 'chưa chọn nhóm con thì chưa hiện danh sách dài');
      assert(await p.eval(click, '#actPanel [data-asub="3. Quản lý con cái"]')); await sleep(200);
      assert((await p.eval(texts, '#actPanel .actlist [data-act]')).length > 0, 'nhóm Quản lý con cái có hành động');
      await p.screenshot(path.join(out, 'feedback-b-family-' + width + '.png'));
      assert(await p.eval(click, '#actPanel [data-asub=""]'), 'có nút quay lại menu cha'); await sleep(200);
      assert((await p.eval(texts, '#actPanel [data-asub="2. Sinh con & nuôi con"]')).length === 1, 'quay lại danh sách nhóm con');
      assert(await p.eval(click, '#actPanel [data-ag="💰 Tiền bạc & tài sản"]')); await sleep(200);
      const msubs = await p.eval(texts, '#actPanel .actsubs [data-asub]');
      assert(msubs[0].startsWith('6. Chi tiêu & sinh hoạt') && msubs.some(t => t.startsWith('8. Đầu tư')), 'nhóm con tiền bạc: ' + msubs);
      assert(await p.eval(click, '#actPanel [data-asub="6. Chi tiêu & sinh hoạt"]')); await sleep(200);
      assert((await p.eval(texts, '#actPanel .recur [data-recur]')).length > 0, 'chi tiêu định kỳ nằm trong Chi tiêu & sinh hoạt');
      await p.screenshot(path.join(out, 'feedback-b-money-' + width + '.png'));
      const overflow = await p.eval(() => document.documentElement.scrollWidth - window.innerWidth);
      assert(overflow <= 1, 'không tràn ngang: ' + overflow);
      assert(await p.eval(click, '#famPanel [data-family-child]'), 'mở hồ sơ con'); await sleep(300);
      const body = await p.eval(() => document.body.innerText);
      ['Dị ứng', 'Hạnh kiểm', 'Lớp', 'Tiền tiết kiệm', 'Thân thiết · Anh chị em Lan'].forEach(t => assert(body.includes(t), 'hồ sơ có ' + t));
      await p.screenshot(path.join(out, 'feedback-b-profile-' + width + '.png'));
      errors.push(...p.errors.map(e => width + ': ' + e)); p.close();
    }
  } finally { await chrome.close(); }
  assert.deepStrictEqual(errors, [], errors.join('\n'));
  console.log('PASS browser-feedback-b: menu nhóm con, quay lại, chi tiêu định kỳ, hồ sơ con; 390px và 1280px, không lỗi JavaScript.');
})().catch(e => { console.error(e); process.exit(1); });
