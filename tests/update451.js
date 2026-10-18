'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert');
const root = path.join(__dirname, '..', 'public');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const [, file] of html.matchAll(/<script src="(js\/[^?]+)\?v=[^"]+"><\/script>/g)) {
  if (!['js/app.js', 'js/music.js', 'js/card.js'].includes(file)) vm.runInThisContext(fs.readFileSync(path.join(root, file), 'utf8'), { filename: file });
}
const { E, U } = globalThis.G;
let checks = 0;
function ok(x, text) { assert.ok(x, text); checks++; }
function life(age = 30, year = 2060) { const l = E.createLife({ mode: 'vn', seed: 7791, gender: 'M' }); l.age = age; l.birthYear = year - age; l.indep = true; l.money = 2000; l.pending = []; l.school = null; return l; }
function rng(seed) { const h = { rs: seed }; return () => U.rand(h); }
function apply(l, id, key, random) { const log = []; const d = E.DEC[id].make(l, rng(1)); E.DEC[id].apply(l, d, key, random || rng(2), (t, k) => log.push({ t, k })); return log; }
ok(globalThis.G.VERSION === JSON.parse(fs.readFileSync(path.join(root, '..', 'package.json'), 'utf8')).version, 'phiên bản mới tránh cache tài nguyên cũ');
ok(!html.includes('?v=4.5.0'), 'mọi tài nguyên đã đổi cache key');
for (const [year, archive] of [[2026, false], [2040, false], [2060, true], [2100, true]]) {
  for (const [id, count] of [['atvncg24', 33], ['atvncg26', 34]]) {
    const l = life(25, year), cast = E.SHOWS.find(s => s.k === id);
    ok(cast.m.length === count && new Set(cast.m).size === count, id + ': đủ thành viên, không trùng');
    l.pending = [E.DEC.concert_chon.make(l, rng(1))]; E.resolve(l, 'show');
    const choice = l.pending[0].opts.find(o => o.l === cast.n);
    ok(!!choice, year + ': hiện mùa ' + id + ' trong màn chọn thực tế');
    E.resolve(l, choice.k);
    let members = [], guard = 0;
    while (guard++ < 10) {
      const d = l.pending[0]; ok(d.id === 'bias_chon', 'đúng màn chọn thành viên');
      members.push(...d.data.m);
      if (!d.opts.some(o => o.k === 'more')) break;
      E.resolve(l, 'more');
    }
    ok(members.length === count && cast.m.every(n => members.includes(n)), 'phân trang cho chọn được toàn bộ thành viên');
    E.resolve(l, 'b0');
    ok(l.pending[0].id === (archive ? 'concert_luu_tru' : 'concert_di'), 'năm xa chuyển sang bản ghi, không giả concert sống');
  }
}
{
  const l = life(20, 2023);
  ok(!E.artistsOf('show', l).some(a => a.show.k === 'atvncg24' || a.show.k === 'atvncg26'), 'không xuất hiện chương trình trước năm ra mắt');
}
for (const fight of [true, false]) for (const survive of [true, false]) {
  const l = life(); apply(l, 'uw_quan_he', 'link');
  const d = E.DEC.uw_can_len.make(l, rng(1)); ok(d.opts.length === 2, 'đánh úp có đúng 2 lựa chọn');
  const entries = apply(l, 'uw_can_len', fight ? 'fight' : 'flee', () => survive ? 0.999 : 0);
  if (survive) {
    ok(l.alive && l.flags.underworld.hunted && l.st.hea < 100, 'sống sót nhưng bị thương, bị truy sát');
    ok(l.sched.some(s => s.id === 'uw_truy_sat' && s.at > l.age), 'có sự kiện truy sát nối tiếp');
    apply(l, 'uw_quan_he', 'leave'); ok(l.flags.underworld.hunted && !l.flags.underworld.linked, 'bỏ nghề không xóa truy sát');
    apply(l, 'uw_truy_sat', 'help', () => 0); ok(!l.flags.underworld.hunted, 'giải quyết thành công mới hết truy sát');
  } else ok(!l.alive && l.death && entries.at(-1).k === 'death' && !l.pending.length, 'thất bại tử vong, dọn hết lựa chọn');
}
{
  const l = life(); ok(E.underworldRisk(l) === 0, 'người bình thường không bị đánh úp bởi cơ chế này');
  apply(l, 'uw_quan_he', 'link'); const low = E.underworldRisk(l); l.flags.underworld.hunted = true; l.flags.underworld.heat = 100;
  ok(E.underworldRisk(l) > low && E.underworldRisk(l) <= 0.6, 'truy sát, thù địch làm tăng nguy cơ có giới hạn');
  l.flags.underworld.linked = true; l.flags.underworld.hunted = false;
  apply(l, 'uw_quan_he', 'deal'); const cash = l.money;
  ok(!E.DEC.uw_quan_he.make(l, rng(1)).opts.some(o => o.k === 'deal'), 'không lặp thương vụ vô hạn trong một năm');
  apply(l, 'uw_quan_he', 'deal'); ok(l.money === cash, 'lựa chọn cũ không cho rút tiền lần hai');
  l.jailUntil = l.age + 1;
  ok(E.underworldRisk(l) === 0 && !E.DEC.uw_can_len.valid(l, {}) && !E.DEC.uw_truy_sat.valid(l, {}), 'trong tù không bị đánh úp ngoài đường / lánh nạn');
  E.beginYear(l, {}); ok(l.pending.every(d => /^(tg_|trai_giam)/.test(d.id)), 'trong tù chỉ có chuyện trong trại');
  const young = life(17); ok(E.actions(young).every(a => a.id !== 'uw_quan_he' || a.ok !== true), 'dưới 18 không chủ động liên kết xã hội đen');
}
// Mọi lựa chọn của chuỗi mới phải chạy được, không sinh NaN hay nhật ký rỗng.
for (const id of Object.keys(E.DEC).filter(id => /^uw_/.test(id))) {
  const base = life(); apply(base, 'uw_quan_he', 'link'); base.flags.underworld.hunted = true;
  base.fam.mAlive = true;
  const d = E.DEC[id].make(base, rng(1));
  for (const o of d.opts) {
    const l = JSON.parse(JSON.stringify(base)); const logs = [];
    E.DEC[id].apply(l, d, o.k, rng(7), (t, k) => logs.push({ t, k }));
    ok(Number.isFinite(l.money) && Object.values(l.st).every(Number.isFinite), id + '/' + o.k + ': số liệu hợp lệ');
    ok(logs.every(e => typeof e.t === 'string' && !/undefined|NaN|\[object/.test(e.t)), id + '/' + o.k + ': nhật ký hợp lệ');
  }
}
for (let i = 0; i < 60; i++) {
  const l = E.createLife({ mode: i % 2 ? 'vn' : 'world', seed: 79100 + i });
  E.runHeadless(l);
  ok(!l.alive && l.death && Number.isFinite(l.money), 'mô phỏng cả đời hợp lệ #' + i);
  ok(l.log.at(-1).k === 'death' && !l.pending.length, 'không sự kiện sau tử vong #' + i);
}
console.log('PASS: ' + checks + ' kiểm tra bản 4.5.1.');
