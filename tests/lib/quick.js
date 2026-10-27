/* Khung chạy kiểm thử nhanh (smoke / tương thích bản lưu).
   Mỗi ca chạy trong một tiến trình Node riêng với thời hạn cứng: vòng mô phỏng chạy đồng bộ nên setTimeout trong cùng
   tiến trình không cắt được — tiến trình con bị dừng khi quá hạn và ca đó được ghi là TIMEOUT, không treo cả bộ.
   Ca thất bại / quá hạn làm lệnh thoát với mã khác 0. Không thay thế tests/regression.js. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process');
const ROOT = path.join(__dirname, '..', '..'), PUB = path.join(ROOT, 'public');
const UI_ONLY = ['js/music.js', 'js/card.js', 'js/app.js', 'js/account.js']; // giống tests/regression.js

// createLife đặt life.id = Date.now() + Math.random(), và một số module (life126/130/138/141) lấy l.id làm hạt giống,
// nên cùng seed vẫn ra đời khác nhau giữa hai lần tạo. Để kết quả kiểm thử tái lập được, môi trường kiểm thử
// (không phải game) dùng đồng hồ cố định tăng 1 ms mỗi lần gọi và Math.random có seed. Truyền { realClock: true } để dùng giờ thật.
const FIXED_NOW = Date.UTC(2026, 9, 26, 3, 0, 0);
function testClock() {
  let now = FIXED_NOW, s = 20261026 >>> 0;
  const M = Object.create(Math);
  M.random = function () { s = (s + 0x6D2B79F5) >>> 0; let x = s; x = Math.imul(x ^ x >>> 15, x | 1); x ^= x + Math.imul(x ^ x >>> 7, x | 61); return ((x ^ x >>> 14) >>> 0) / 4294967296; };
  class D extends Date { constructor(...a) { if (a.length) super(...a); else super(now++); } static now() { return now++; } }
  // reset(): đưa đồng hồ về điểm xuất phát, để một cuộc đời tạo sau reset() luôn giống nhau dù trước đó đã chạy gì
  return { Math: M, Date: D, reset() { now = FIXED_NOW; s = 20261026 >>> 0; } };
}
function loadGame(opt) {
  const clock = opt && opt.realClock ? { Math, Date } : testClock();
  const ctx = { console, Math: clock.Math, Date: clock.Date, JSON, TextEncoder, TextDecoder, Buffer };
  ctx.globalThis = ctx; vm.createContext(ctx);
  const files = [...fs.readFileSync(path.join(PUB, 'index.html'), 'utf8').matchAll(/<script src="(js\/[^"?]+)/g)].map(m => m[1]).filter(f => !UI_ONLY.includes(f));
  for (const f of files) vm.runInContext(fs.readFileSync(path.join(PUB, f), 'utf8'), ctx, { filename: f });
  if (clock.reset) Object.defineProperty(ctx.G, 'testClock', { value: clock, enumerable: false });
  return ctx.G;
}
// Một năm giống app.js / E.runHeadless: beginYear → lựa chọn → finishYear → lựa chọn phát sinh trong năm → endYear.
function settle(E, l, cap) { let n = 0; while (l.pending.length && l.alive && n++ < (cap || 64)) E.resolve(l, E.autoKey(l)); }
function year(E, l) { E.beginYear(l, { auto: true }); settle(E, l); if (l.alive) E.finishYear(l); settle(E, l); E.endYear(l); }
function badText(s) { return typeof s !== 'string' || /undefined|NaN|\[object/.test(s); }
function clone(x) { return JSON.parse(JSON.stringify(x)); }

function checker() {
  const res = { pass: 0, fail: [], warn: [], info: [] };
  return {
    res,
    ok(cond, msg) { if (cond) res.pass++; else if (res.fail.length < 40) res.fail.push(msg); else res.fail.length === 40 && res.fail.push('… (còn lỗi khác, đã cắt bớt)'); return !!cond; },
    warn(msg) { if (res.warn.length < 40) res.warn.push(msg); },
    info(msg) { res.info.push(msg); }
  };
}

// cases: [{ name, timeoutMs?, run(t, G) }]
function run(title, cases, opt) {
  opt = opt || {};
  const i = process.argv.indexOf('--case');
  if (i > 0) { // tiến trình con: chạy đúng một ca
    const c = cases.find(x => x.name === process.argv[i + 1]), t = checker(), t0 = Date.now();
    try { c.run(t, loadGame()); } catch (e) { t.res.fail.push('Lỗi chạy: ' + String(e && e.stack || e).split('\n').slice(0, 4).join(' | ')); }
    t.res.ms = Date.now() - t0;
    process.stdout.write('\n@@RESULT ' + JSON.stringify(t.res) + '\n');
    return;
  }
  const only = process.argv.slice(2).filter(a => !a.startsWith('-'));
  const list = only.length ? cases.filter(c => only.includes(c.name)) : cases;
  console.log(title + ' — ' + list.length + ' ca, mỗi ca một tiến trình có thời hạn riêng\n');
  let failed = 0, timedOut = 0, passed = 0, warned = 0; const T0 = Date.now();
  for (const c of list) {
    const limit = c.timeoutMs || opt.timeoutMs || 60000;
    const r = cp.spawnSync(process.execPath, [process.argv[1], '--case', c.name], { encoding: 'utf8', timeout: limit, maxBuffer: 32 * 1024 * 1024 });
    const line = (r.stdout || '').split('\n').find(s => s.startsWith('@@RESULT '));
    if (r.error && r.error.code === 'ETIMEDOUT' || r.signal) { timedOut++; console.log('⏱ TIMEOUT  ' + c.name + ' (quá ' + limit / 1000 + ' giây, đã dừng tiến trình)'); continue; }
    if (!line) { failed++; console.log('✗ LỖI     ' + c.name + ' — không có kết quả. ' + String(r.stderr || '').split('\n').slice(0, 4).join(' | ')); continue; }
    const res = JSON.parse(line.slice(9));
    const status = res.fail.length ? '✗ FAIL   ' : '✓ PASS   ';
    if (res.fail.length) failed++; else passed++;
    console.log(status + c.name + ' (' + res.pass + ' kiểm tra, ' + (res.ms / 1000).toFixed(1) + ' giây)');
    res.info.forEach(s => console.log('     · ' + s));
    if (res.warn.length) { warned++; res.warn.forEach(s => console.log('     ⚠ ' + s)); }
    res.fail.forEach(s => console.log('     ✗ ' + s));
  }
  console.log('\nKẾT QUẢ: ' + passed + ' đạt, ' + failed + ' thất bại, ' + timedOut + ' quá hạn' + (warned ? ', ' + warned + ' ca có cảnh báo' : '') + ' · ' + ((Date.now() - T0) / 1000).toFixed(0) + ' giây');
  if (opt.footer) console.log(opt.footer);
  process.exitCode = failed || timedOut ? 1 : 0;
}

module.exports = { loadGame, testClock, settle, year, badText, clone, run, ROOT, PUB };
