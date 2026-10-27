/* Trình duyệt thật (Chrome headless, cần http://localhost:8080 — node tools/serve.js): chơi các chương trình truyền hình bằng cách bấm nút
   như người chơi, trên 390px và 1280px; không lỗi JavaScript, không tràn ngang.  node tests/browser-showbiz.js [nhóm…] */
'use strict';
const assert = require('assert'), path = require('path'), { launch, page, sleep } = require('./lib/cdp');
const URL = process.env.MOTDOI_URL || 'http://localhost:8080/', out = path.join(__dirname, '../.cache');
// Mỗi kịch bản: dựng đời, mở menu, bấm lần lượt (khớp đầu nhãn; '*' = phương án đầu tiên), số lần bấm tiếp '*', chữ phải thấy.
const FLOWS = {
  quiz: [
    { name: 'nnc', setup: 'adult', open: 'show151', clicks: ['Nhanh Như Chớp — thí sinh'], answers: 6, expect: 'Chuỗi đúng hiện tại' },
    { name: 'altp', setup: 'adult', open: 'show151', clicks: ['Ai Là Triệu Phú — người chơi', '50:50'], answers: 3, expect: 'Câu hỏi số' },
    { name: 'olympia', setup: 'student', open: 'show151', clicks: ['Đường Lên Đỉnh Olympia — thí sinh'], answers: 8, expect: 'Điểm: bạn' },
    { name: 'stt', setup: 'adult', open: 'show151', clicks: ['Siêu Trí Tuệ Việt Nam — thí sinh', 'Đã ghi nhớ xong'], answers: 2, expect: 'Giám khảo chấm' }
  ]
};
function seed(kind, id) {
  const E = G.E, l = E.createLife({ mode: 'vn', seed: 151, year: kind === 'student' ? 2008 : 1995 });
  Object.assign(l, { age: kind === 'student' ? 17 : 30, alive: true, school: kind === 'student' ? 'THPT chuyên' : null, indep: kind !== 'student', pending: [], yr: { items: [] }, job: null, partner: null });
  l.flags.military = 0; l.money = l.base * 10; l.st.kno = 90; l.edu = kind === 'student' ? 3 : 5;
  const d = E.DEC[id].make(l, () => 0); d.manual = true; l.pending = [d];
  localStorage.setItem('mkn.current', JSON.stringify({ life: l, cohort: [], auto: false, speed: 1 }));
  return true;
}
function clickOpt(label) {
  const all = Array.from(document.querySelectorAll('.opt')).filter(x => x.querySelector('b'));
  const b = label === '*' ? all.find(x => /^[A-D]\. /.test(x.querySelector('b').innerText.trim())) || all[0] : all.find(x => x.querySelector('b').innerText.trim().startsWith(label));
  if (!b) return all.map(x => x.querySelector('b').innerText).join(' | ') || 'không có lựa chọn';
  b.click(); return true;
}
(async () => {
  const want = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(FLOWS);
  const chrome = await launch(), errors = []; let n = 0;
  try {
    for (const width of [390, 1280]) {
      const p = await page(chrome, URL, { width, height: 950 });
      for (const m of want) for (const f of FLOWS[m] || []) {
        await p.eval(seed, f.setup, f.open); await p.reload();
        await p.eval(() => { const b = document.querySelector('#resumeBtn'); if (b) b.click(); return !!b; }); await sleep(500);
        const confirm = () => p.eval(() => { const y = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Chắc chắn, tiếp tục'); if (y) y.click(); return true; });
        for (const c of f.clicks) { const r = await p.eval(clickOpt, c); assert(r === true, f.name + ' ' + width + 'px: không thấy "' + c + '". Đang có: ' + r); await sleep(300); await confirm(); await sleep(200); }
        let body = await p.eval(() => document.body.innerText);
        assert(body.includes(f.expect), f.name + ' ' + width + 'px: thiếu "' + f.expect + '"');
        await p.screenshot(path.join(out, 'showbiz-' + f.name + '-' + width + '.png'));
        for (let i = 0; i < (f.answers || 0); i++) { const r = await p.eval(clickOpt, '*'); if (r !== true) break; await sleep(250); await confirm(); }
        body = await p.eval(() => document.body.innerText);
        assert(!/undefined|NaN|\[object/.test(body), f.name + ': chữ hiển thị sạch');
        const over = await p.eval(() => document.documentElement.scrollWidth - window.innerWidth); assert(over <= 1, f.name + ': tràn ngang ' + over);
        n++;
      }
      errors.push(...p.errors.map(e => width + ': ' + e)); p.close();
    }
  } finally { await chrome.close(); }
  assert.deepStrictEqual(errors, [], errors.join('\n'));
  console.log('PASS browser-showbiz: ' + n + ' lượt chơi (' + want.join(', ') + ') trên 390px và 1280px, không lỗi JavaScript.');
})().catch(e => { console.error(e); process.exit(1); });
