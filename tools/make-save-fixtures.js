/* Dựng bản lưu "mkn.current" bằng chính mã engine của các commit cũ trong lịch sử Git.
   Mỗi commit được đọc bằng `git show <commit>:public/...` (không checkout, không đụng thư mục làm việc),
   nạp đúng danh sách script của index.html phiên bản đó vào một vm riêng, cho máy tự chơi tới một mốc tuổi,
   rồi ghi lại đúng cấu trúc mà app.js lưu vào localStorage: { life, cohort, speed, auto, at }.
   Lưu ý: đây là bản lưu do engine cũ tạo ra (AI tự chọn), KHÔNG phải bản lưu thật của người chơi.
   Chạy: node tools/make-save-fixtures.js [commit ...]   → tests/fixtures/saves/<version>-<commit>.json.gz */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), zlib = require('zlib'), cp = require('child_process');
const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'tests', 'fixtures', 'saves');
// Các mốc phát hành có trong lịch sử Git (cũ → mới). b9fa9e8 (v2.3.0) chưa có cấu trúc chế độ chơi như hiện nay nên chỉ thử, không bắt buộc.
const DEFAULT_COMMITS = ['b9fa9e8', '62c5101', '878a6c4', '2123a49', 'a5c7aef', '0758b70', 'e6621df', 'e70b69c', '60dff47', '3fea0d5'];
const UI_ONLY = /js\/(music|card|app|account|scene|scene2d|memorial-history|boot|support|reviews|updates)\.js$/;
// Hai kiểu thời điểm app gọi persist(): giữa năm khi đang có lựa chọn chờ, và sau khi kết thúc năm.
const SCENARIOS = [
  { id: 'vn-child-between', opts: { mode: 'vn', variant: '34', seed: 424201 }, age: 9, point: 'between' },
  { id: 'vn-adult-pending', opts: { mode: 'vn', variant: '63', seed: 424202 }, age: 34, point: 'pending' },
  { id: 'vn-family-between', opts: { mode: 'vn', variant: '34', seed: 424203 }, age: 47, point: 'between' },
  { id: 'world-adult-pending', opts: { mode: 'world', seed: 424204 }, age: 29, point: 'pending' },
  { id: 'world-old-between', opts: { mode: 'world', seed: 424205 }, age: 68, point: 'between' },
  { id: 'vn-hardcore-pending', opts: { mode: 'vn', variant: '34', seed: 424206, difficulty: 'hardcore' }, age: 26, point: 'pending' }
];

function git(args) { return cp.execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); }
function load(commit) {
  const html = git(['show', commit + ':public/index.html']);
  const files = [...html.matchAll(/<script src="(js\/[^"?]+)/g)].map(m => m[1]).filter(f => !UI_ONLY.test(f));
  // đồng hồ kiểm thử cố định (tests/lib/quick.js) để dựng lại fixture cho đúng cùng dữ liệu
  const clock = require('../tests/lib/quick').testClock();
  const ctx = { console: { log() {}, warn() {}, error() {}, info() {} }, Math: clock.Math, Date: clock.Date, JSON, TextEncoder, TextDecoder, Buffer };
  ctx.globalThis = ctx; vm.createContext(ctx);
  for (const f of files) vm.runInContext(git(['show', commit + ':public/' + f]), ctx, { filename: commit + ':' + f });
  return ctx.G;
}
function settle(E, l, cap) { let n = 0; while (l.pending.length && l.alive && n++ < cap) E.resolve(l, E.autoKey(l)); }
// Giống vòng năm của app.js: beginYear → lựa chọn → finishYear → lựa chọn phát sinh trong năm → endYear.
function playTo(G, sc) {
  const E = G.E, l = E.createLife(Object.assign({ year: 2026 }, sc.opts));
  let guard = 0;
  while (l.alive && guard++ < 130) {
    if (sc.point === 'pending' && l.age >= sc.age) {
      E.beginYear(l, { auto: false });
      if (l.pending.length) return l;
      E.finishYear(l);
      if (l.pending.length) return l;
      E.endYear(l); continue;
    }
    E.beginYear(l, { auto: true }); settle(E, l, 64);
    if (l.alive) E.finishYear(l); settle(E, l, 64);
    E.endYear(l);
    if (sc.point === 'between' && l.age >= sc.age) return l;
  }
  return l;
}
function build(commit) {
  const G = load(commit), full = git(['rev-parse', commit]).trim(), date = git(['log', '-1', '--format=%ad', '--date=short', commit]).trim();
  const saves = [], skipped = [];
  for (const sc of SCENARIOS) {
    try {
      // Nhân vật có thể mất trước mốc tuổi: thử lần lượt vài seed kế tiếp (cố định, tái tạo được).
      let l = null, opts = null;
      for (let k = 0; k < 6 && !(l && l.alive); k++) { opts = Object.assign({}, sc.opts, { seed: sc.opts.seed + k * 7 }); l = playTo(G, Object.assign({}, sc, { opts })); }
      if (!l.alive) { skipped.push({ id: sc.id, why: 'nhân vật qua đời trước mốc tuổi ' + sc.age + ' ở cả 6 seed' }); continue; }
      // cohort giữ rỗng: đó chỉ là danh sách hiển thị "người sinh cùng giây", không đi qua migrate; giữ fixture gọn.
      saves.push({ scenario: sc.id, point: sc.point, opts, save: JSON.parse(JSON.stringify({ life: l, cohort: [], speed: 1, auto: false, at: Date.parse(date + 'T12:00:00Z') })) });
    } catch (e) { skipped.push({ id: sc.id, why: String(e && e.message || e).slice(0, 200) }); }
  }
  return { format: 'motdoi-save-fixtures/1', storageKey: 'mkn.current', commit: full, short: commit, version: G.VERSION, date,
    note: 'Bản lưu do engine của commit này tự chơi tạo ra (máy chọn), không phải bản lưu thật của người chơi.', saves, skipped };
}
if (require.main === module) {
  const commits = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_COMMITS;
  fs.mkdirSync(OUT, { recursive: true });
  for (const c of commits) {
    try {
      const pack = build(c), name = pack.version + '-' + c + '.json.gz', raw = JSON.stringify(pack);
      if (!pack.saves.length) { console.log('✗ ' + c + ' (v' + pack.version + '): không tạo được bản lưu — ' + pack.skipped.map(s => s.id + ': ' + s.why).join('; ')); continue; }
      fs.writeFileSync(path.join(OUT, name), zlib.gzipSync(raw, { level: 9 }));
      console.log('✓ ' + name + ': ' + pack.saves.length + ' bản lưu, ' + (raw.length / 1024).toFixed(0) + ' KB (gốc)' + (pack.skipped.length ? ' · bỏ qua ' + pack.skipped.map(s => s.id + ' (' + s.why + ')').join(', ') : ''));
    } catch (e) { console.log('✗ ' + c + ': không nạp được mã phiên bản này — ' + String(e && e.message || e).split('\n')[0].slice(0, 200)); }
  }
}
module.exports = { build, SCENARIOS, DEFAULT_COMMITS };
