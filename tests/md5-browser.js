/* Trình duyệt thật (Chrome headless qua tests/lib/cdp, cần server: MOTDOI_URL hoặc http://localhost:8080/).
   Đi qua TOÀN BỘ menu mới của MD4 (…919) và MD5 (…920) như người chơi, trên 390px và 1280px:
   · dựng đời ở trạng thái đủ điều kiện (mỗi menu thử lần lượt các trạng thái mẫu), mở thành hộp lựa chọn, đọc lựa chọn và lý do khóa,
     bấm lựa chọn đầu tiên dùng được, tải lại trang (lưu/tải) và kiểm không lỗi JavaScript, không tràn ngang;
   · menu không có trạng thái mẫu nào hợp lệ được ghi là "chỉ kiểm lý do khóa" (in ra danh sách, không tính là đã thử tương tác);
   · luồng riêng: tiệc khi có nhân sự sự kiện (không bị chuyển hướng, đủ loại tiệc), bấm nhanh hai lần, hộp Tùy chọn nội dung
     (Tab giữ focus trong hộp, Esc đóng và trả focus về nút), con ngoài hôn nhân không lộ trong du lịch gia đình.
   node tests/md5-browser.js  — in bảng coverage từng menu. */
'use strict';
const assert = require('assert'), path = require('path'), fs = require('fs'), { launch, page, sleep } = require('./lib/cdp');
const URL = process.env.MOTDOI_URL || 'http://localhost:8080/', out = path.join(__dirname, '../.cache');
const MENUS = ('games919 arts919 beauty919 bonds919 childcare919 palliative919 bucket919 infant919 function919 follow919 labor919 spouse919 pool919 famTravel919 programs919 health919 identity919 tempCare919 illCare919 sibCare919 langYear919 studyAbroad919 ausbildung919 recog919 pr919 farm919 adopt919 petHome919 pets919 eliteEvents919 directorOffers919 stardom919 ' +
  'divorceCase920 residence920 kin920 home920 household920 parenting920 royalCircle920 royalRole920 royalDuty920 school920 rite920 party148').split(' ');
const STATES = ['family', 'teen', 'abroad', 'jail', 'royal', 'jp20', 'actor', 'farm', 'baby', 'senior', 'child8', 'intlspouse', 'elite', 'director', 'studyabroad'];
// chạy trong trang: dựng đời theo trạng thái mẫu, thử mở menu; trả về {ok, why}
function seed(state, id, put) {
  const E = G.E, X = E.UPDATE110, mode = /royal|jp20|abroad/.test(state) ? 'world' : 'vn', country = state === 'royal' ? 'GB' : state === 'jp20' ? 'JP' : undefined;
  const l = E.createLife(Object.assign({ mode, seed: 920 }, country ? { country } : {}));
  Object.assign(l, { age: 38, alive: true, school: null, indep: true, ownHouse: true, pending: [], yr: { items: [] } }); l.flags.military = 0; l.money = l.base * 3000;
  l.partner = { name: 'Hà', sex: 'F', age: 36, status: 'married', since: 28, alive: true, close: 70, job: 'giáo viên', inc: 5 };
  l.kids = [{ name: 'Minh', sex: 'M', born: 23, alive: true, study: 55, close: 70 }, { name: 'Lan', sex: 'F', born: 30, alive: true, close: 60 }, { name: 'Bé Na', sex: 'F', born: 36, alive: true }];
  if (state === 'teen') { Object.assign(l, { age: 16, indep: false, school: 'upper', schoolEnd: 18, partner: null, kids: [], ownHouse: false }); l.money = l.base * 20; E.SCHOOL920.plan(l, () => { }); }
  if (state === 'child8') { Object.assign(l, { age: 8, indep: false, school: 'primary', partner: null, kids: [] }); }
  if (state === 'abroad') { l.abroad = { code: 'JP', name: 'Nhật Bản', perm: false, until: l.age + 3, labor919: { at: l.age - 2 } }; l.job = { id: 'xkld', rank: 0, yrs: 2 }; }
  if (state === 'jail') { l.jailUntil = l.age + 4; l.partner.separated919 = l.age - 1; l.partner.close = 25; }
  if (state === 'royal') { l.flags.royal = { tier: 'direct', c: 'GB', house: 'Hoàng gia Anh', role920: 'working' }; l.fame = 2e6; }
  if (state === 'jp20') { Object.assign(l, { age: 20, partner: null, kids: [] }); }
  if (state === 'actor') { l.job = { id: 'dien_vien', rank: 3, yrs: 8 }; l.fame = 5e6; }
  if (state === 'farm') { l.urban = false; l.flags.md4b = { v: 1, farm: { herd: { cattle: 2, pig: 10, poultry: 1 }, hist: [], vac: {} } }; }
  if (state === 'baby') { l.kids.push({ name: 'Sơ sinh', sex: 'M', born: 38, alive: true }); }
  if (state === 'senior') { l.age = 72; l.fam.mAlive = false; l.fam.fAlive = false; }
  if (state === 'intlspouse') { l.partner.homeCountry = 'KR'; l.partner.name = 'Kim Ji-woo'; }
  if (state === 'elite' && E.ELITE148) { const q = E.ELITE148.meet(l, () => 0.3, { kind: 'business', tier: 3, where: 'tiệc' }); q.trust = 60; }
  if (state === 'director' && E.STAR919) { l.job = { id: 'dien_vien', rank: 3, yrs: 8 }; l.fame = 3e6; const d0 = E.STAR919.directors(l)[0]; E.STAR919.state(l).offers.push({ id: 'oT', dir: d0, cc: 'VN', scale: 'cinema', until: l.age + 1, status: 'open' }); }
  if (state === 'studyabroad') { Object.assign(l, { age: 21, partner: null, kids: [], school: 'uni', schoolEnd: 24, uniName: 'Đại học Tokyo' }); l.abroad = { code: 'JP', name: 'Nhật Bản', study: true, perm: false, until: 24 }; l.flags.study107 = { school: 'Đại học Tokyo', country: 'JP', finished: false }; }
  if (id === 'party148' && E.OFFICE171) { const F = E.OFFICE171; try { F.workers(l).butler = { pid: 'x', salary: 1, contract171: true, until: l.age + 3 }; } catch (e) { } }
  const D = E.DEC[id]; if (!D) return { ok: false, why: 'không có menu' };
  const act = E.actions ? E.actions(l).find(a => a.id === id) : null;
  let d; try { d = D.make(l, () => 0.3, {}); } catch (e) { return { ok: false, why: 'lỗi dựng: ' + e.message }; }
  const valid = D.valid ? D.valid(l, d.data) : true;
  if (!valid) return { ok: false, why: act && act.ok !== true ? String(act.ok) : 'không hợp lệ ở trạng thái này' };
  if (put) { d.manual = true; l.pending = [d]; localStorage.setItem('mkn.current', JSON.stringify({ life: l, cohort: [], auto: false, speed: 1 })); }
  return { ok: true, opts: d.opts.length };
}
async function resume(p) { await p.eval(() => { const b = document.querySelector('#resumeBtn'); if (b) b.click(); return !!b; }); await sleep(600); }
function dialog() {
  const m = document.querySelector('.modal, [role=dialog]'); if (!m) return { open: false };
  const opts = Array.from(m.querySelectorAll('.opt')); return { open: true, title: (m.querySelector('h2,h3') || {}).innerText || '', n: opts.length, enabled: opts.filter(b => !b.disabled && !b.classList.contains('off')).length, labelled: !!m.getAttribute('aria-labelledby') };
}
function clickFirst() {
  const m = document.querySelector('.modal, [role=dialog]'); if (!m) return 'no dialog';
  const b = Array.from(m.querySelectorAll('.opt')).find(x => !x.disabled && !x.classList.contains('off') && !/^(←|Hủy|Để sau|Đóng)/.test(x.innerText.trim()));
  if (!b) return 'no enabled option'; b.click(); return true;
}
(async () => {
  const chrome = await launch(), errors = [], cov = {}; let n = 0;
  try {
    for (const width of [390, 1280]) {
      const p = await page(chrome, URL, { width, height: 950 });
      for (const id of MENUS) {
        let used = null, why = [];
        for (const s of STATES) { const r = await p.eval(seed, s, id, false); if (r.ok) { used = s; break; } why.push(s + ': ' + r.why); }
        if (!used) { cov[id] = cov[id] || { tested: false, why: why.slice(0, 3) }; continue; }
        await p.eval(seed, used, id, true); await p.reload(); await resume(p);
        const d = await p.eval(dialog); assert(d.open && d.n > 0, id + ' ' + width + 'px: không mở được hộp lựa chọn');
        assert(d.labelled, id + ': hộp thoại thiếu nhãn (aria-labelledby)');
        const c = await p.eval(clickFirst); await sleep(400);
        await p.eval(() => { const y = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Chắc chắn, tiếp tục'); if (y) y.click(); return true; }); await sleep(200);
        const over = await p.eval(() => document.documentElement.scrollWidth - window.innerWidth); assert(over <= 1, id + ' ' + width + 'px: tràn ngang ' + over);
        await p.reload(); await resume(p); // lưu/tải sau thao tác
        cov[id] = { tested: true, state: used, opts: d.n, enabled: d.enabled, clicked: c === true ? 'đã bấm' : c, widths: ((cov[id] || {}).widths || []).concat(width) }; n++;
      }
      // tiệc: có nhân sự sự kiện vẫn mở menu tiệc đủ loại; bấm nhanh hai lần không tạo hai tiệc
      await p.eval(seed, 'family', 'party148', true); await p.reload(); await resume(p);
      const types = await p.eval(() => Array.from(document.querySelectorAll('.modal .opt b')).map(b => b.innerText).join('|'));
      assert(/sinh nhật/i.test(types) && /Tết|gia đình/i.test(types), 'party menu lost its types: ' + types);
      // Tùy chọn nội dung: bàn phím, focus trap, Esc, trả focus
      if (width === 1280) {
        await p.eval(() => { localStorage.removeItem('mkn.current'); return true; }); await p.eval(seed, 'family', 'kin920', true); await p.reload(); await resume(p);
        await p.eval(() => { const m = document.querySelector('#modalRoot'); if (m) m.innerHTML = ''; const b = document.querySelector('#contentBtn920'); b.focus(); b.click(); return true; }); await sleep(300);
        const inside = [];
        for (let i = 0; i < 7; i++) { await p.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }); await p.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }); inside.push(await p.eval(() => !!document.activeElement.closest('.modal'))); }
        assert(inside.every(Boolean), 'focus escaped the dialog: ' + inside);
        await p.eval(() => { document.querySelector('[data-sens="mild"]').click(); return true; });
        await p.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }); await sleep(300);
        const back = await p.eval(() => ({ closed: !document.querySelector('[data-sens]'), focus: document.activeElement && document.activeElement.id, saved: JSON.parse(localStorage.getItem('mkn.settings') || '{}').sens920 }));
        assert(back.closed && back.focus === 'contentBtn920' && back.saved === 'mild', 'Esc/return focus/persist failed: ' + JSON.stringify(back));
        const contrast = await p.eval(() => { function lum(c) { const m = c.match(/\d+(\.\d+)?/g).map(Number).slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]; } const el = document.querySelector('.muted') || document.body, fg = getComputedStyle(el).color; let bgEl = el, bg = 'rgba(0, 0, 0, 0)'; while (bgEl && /rgba\(0, 0, 0, 0\)|transparent/.test(bg)) { bg = getComputedStyle(bgEl).backgroundColor; bgEl = bgEl.parentElement; } if (/rgba\(0, 0, 0, 0\)/.test(bg)) bg = 'rgb(255,255,255)'; const a = lum(fg), b = lum(bg); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); });
        cov._contrastMuted = Math.round(contrast * 100) / 100;
        await p.eval(() => { localStorage.setItem('mkn.settings', JSON.stringify(Object.assign(JSON.parse(localStorage.getItem('mkn.settings') || '{}'), { sens920: 'full' }))); return true; });
      }
      await p.screenshot(path.join(out, 'md5-browser-' + width + '.png'));
      errors.push(...p.errors.map(e => width + ': ' + e)); p.close();
    }
  } finally { await chrome.close(); }
  const tested = Object.keys(cov).filter(k => k[0] !== '_' && cov[k].tested), locked = Object.keys(cov).filter(k => k[0] !== '_' && !cov[k].tested);
  fs.writeFileSync(path.join(out, 'md5-browser-coverage.json'), JSON.stringify(cov, null, 1));
  console.log('Coverage: ' + tested.length + '/' + MENUS.length + ' menu mở và bấm được trên 390+1280px; chỉ kiểm lý do khóa: ' + (locked.join(', ') || 'không'));
  locked.forEach(k => console.log('  · ' + k + ': ' + cov[k].why.join(' | ')));
  console.log('Độ tương phản chữ phụ (.muted) trên nền: ' + cov._contrastMuted + ':1');
  assert.deepStrictEqual(errors, [], errors.join('\n'));
  console.log('PASS md5-browser: ' + n + ' lượt menu, tiệc, hộp Tùy chọn nội dung (Tab/Esc/focus), không lỗi JavaScript.');
})().catch(e => { console.error(e); process.exit(1); });
