/* Trình duyệt thật (Chrome headless, cần http://localhost:8080 — node tools/serve.js): đi hết các chuỗi menu mới của đợt góp ý
   bằng cách bấm nút như người chơi, trên điện thoại 390px và máy tính 1280px; không lỗi JavaScript, không tràn ngang.
   node tests/browser-feedback-menus.js [c|d|e ...]  — mặc định chạy mọi mốc đã có. */
'use strict';
const assert = require('assert'), path = require('path'), { launch, page, sleep } = require('./lib/cdp');
const URL = process.env.MOTDOI_URL || 'http://localhost:8080/', out = path.join(__dirname, '../.cache');
// Mỗi kịch bản: cách dựng đời, menu mở đầu, chuỗi nút cần bấm (khớp đầu nhãn), chữ phải thấy sau cùng.
const FLOWS = {
  c: [
    { name: 'party', setup: 'rich', id: 'party148', clicks: ['Tiệc sinh nhật', 'Thân mật (khoảng 15 khách) ở nhà hàng', 'Gia đình và bạn bè'], expect: 'Tiệc sinh nhật ở nhà hàng' },
    { name: 'collect', setup: 'rich', id: 'collect148', clicks: ['Mua đồng hồ', 'Đồng hồ cơ Thụy Sĩ cổ điển'], expect: 'Bạn mua Đồng hồ cơ Thụy Sĩ cổ điển' },
    { name: 'elite', setup: 'rich', id: 'elite148', clicks: ['Giải golf giao hữu'], expect: 'Giải golf giao hữu ở câu lạc bộ hạng sang' },
    { name: 'head', setup: 'clan', id: 'familyHead148', clicks: ['Triệu tập họp gia đình'], expect: 'Họp gia đình' },
    { name: 'deal', setup: 'partner', id: 'deal148', clicks: ['Bàn hợp tác với Trần Quốc Bảo', 'Góp vốn dự án'], expect: 'Trần Quốc Bảo' }
  ],
  d: [
    { name: 'social', setup: 'rich', id: 'social149', clicks: ['Dự sự kiện câu lạc bộ doanh nhân'], expect: 'Bạn làm quen' },
    { name: 'gift', setup: 'rich', id: 'gifts149', clicks: ['Minh (con', 'Ô tô cỡ nhỏ'], expect: 'Bạn tặng Minh ô tô cỡ nhỏ' },
    { name: 'match', setup: 'match', id: 'matchmaking149', clicks: ['Giới thiệu Minh với Thu'], expect: 'Thu' },
    { name: 'propose', setup: 'dating', id: 'proposal149', clicks: ['Cầu hôn không cần nhẫn', 'Ở nhà, bữa tối tự nấu'], expect: 'nhận lời' }
  ]
};
function seed(kind, id) {
  const E = G.E, l = E.createLife({ mode: 'vn', seed: 148, year: 1975 });
  Object.assign(l, { age: 45, alive: true, school: null, indep: true, ownHouse: true, pending: [], yr: { items: [] }, job: null });
  l.flags.military = 0; l.money = l.base * 3000;
  l.partner = { name: 'Hà', sex: 'F', age: 43, status: 'married', alive: true, close: 70 };
  l.kids = [{ name: 'Minh', sex: 'M', born: 23, alive: true, edu: 5, close: 70 }, { name: 'Lan', sex: 'F', born: 25, alive: true, edu: 5, close: 60 }];
  if (kind === 'clan') E.BUSINESS123.companies(l).push({ name: 'Công ty Ánh Dương', value: 10000, share: 80, sector: 'tech', governance: 0, created: 30, roles: {} });
  if (kind === 'partner') { const p = E.ELITE148.meet(l, () => 0.3, { kind: 'business', tier: 3, where: 'tiệc gặp gỡ đối tác' }); p.name = 'Trần Quốc Bảo'; p.trust = 80; }
  if (kind === 'match') { l.kids[0].born = 18; const f = E.ELITE148.meet(l, () => 0.3, { kind: 'business', age: 58 }); f.trust = 90; f.kids149 = [{ name: 'Thu', sex: 'F', birth: l.birthYear + l.age - 27, job: 'bác sĩ', alive: true, married: false }]; E.UPDATE110.uid(l, f.kids149[0]); }
  if (kind === 'dating') { l.age = 30; l.kids = []; l.partner = { name: 'Mai', sex: 'F', age: 29, status: 'dating', since: 27, alive: true, affection108: 90, propPref149: 'simple' }; }
  const d = E.DEC[id].make(l, () => 0); d.manual = true; l.pending = [d];
  localStorage.setItem('mkn.current', JSON.stringify({ life: l, cohort: [], auto: false, speed: 1 }));
  return true;
}
function clickOpt(label) {
  const b = Array.from(document.querySelectorAll('[role=dialog] .opt, .modal .opt, .opt')).find(x => x.querySelector('b') && x.querySelector('b').innerText.trim().startsWith(label));
  if (!b) return Array.from(document.querySelectorAll('.opt b')).map(x => x.innerText).join(' | ') || 'không có lựa chọn nào';
  b.click(); return true;
}
(async () => {
  const want = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(FLOWS);
  const chrome = await launch(), errors = []; let n = 0;
  try {
    for (const width of [390, 1280]) {
      const p = await page(chrome, URL, { width, height: 950 });
      for (const m of want) for (const f of FLOWS[m] || []) {
        await p.eval(seed, f.setup, f.id); await p.reload();
        await p.eval(() => { const b = document.querySelector('#resumeBtn'); if (b) b.click(); return !!b; }); await sleep(500);
        for (const c of f.clicks) { const r = await p.eval(clickOpt, c); assert(r === true, f.name + ' ' + width + 'px: không thấy nút "' + c + '". Đang có: ' + r); await sleep(350);
          await p.eval(() => { const y = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Chắc chắn, tiếp tục'); if (y) y.click(); return true; }); await sleep(250); } // xác nhận chi tiêu lớn như người chơi
        await sleep(300);
        const body = await p.eval(() => document.body.innerText);
        assert(body.includes(f.expect), f.name + ' ' + width + 'px: thiếu "' + f.expect + '"');
        const over = await p.eval(() => document.documentElement.scrollWidth - window.innerWidth);
        assert(over <= 1, f.name + ': tràn ngang ' + over);
        await p.screenshot(path.join(out, 'menus-' + f.name + '-' + width + '.png')); n++;
      }
      errors.push(...p.errors.map(e => width + ': ' + e)); p.close();
    }
  } finally { await chrome.close(); }
  assert.deepStrictEqual(errors, [], errors.join('\n'));
  console.log('PASS browser-feedback-menus: ' + n + ' chuỗi menu (' + want.join(', ') + ') trên 390px và 1280px, không lỗi JavaScript.');
})().catch(e => { console.error(e); process.exit(1); });
