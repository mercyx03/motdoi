'use strict';
// Kiểm thử 9.11.0: nhịp năm trống toàn đời + 26 tình huống nhiều giai đoạn (life9110.js).
const assert = require('assert');
const { gameContext } = require('./hardcore-isolation.js');
let n = 0; const ok = (c, m) => { assert(c, m); n++; };
const ctx = gameContext(); const G = ctx.G || ctx; const E = G.E; const L9 = E.LIFE9110;
ok(L9 && L9.ids.length >= 27, 'đã đăng ký đủ tình huống: ' + (L9 && L9.ids.length));
const quiet = E.TRIG.filter(t => t.quiet); ok(quiet.length === L9.ids.length, 'mỗi tình huống có TRIG quiet');
const seq = (s) => () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
function life(seed, age) { const l = E.createLife({ mode: 'vn', variant: '34', seed, year: 2026 }); if (age != null) l.age = age; return l; }

// 1) Cấu trúc: mỗi tình huống >= 2 lựa chọn, có giai đoạn 2, mọi tag của giai đoạn 2 đều có >= 2 lựa chọn, nhãn không rỗng
L9.ids.forEach(id => {
  const D = E.DEC[id]; ok(D, id + ' có DEC');
  const l = life(7, 30); const dm = D.make(l, seq(1), {});
  ok(dm.opts.length >= 2, id + ' có ít nhất 2 lựa chọn'); dm.opts.forEach(o => ok(o.l && o.l.length > 3, id + ' nhãn lựa chọn'));
  ok(dm.text && dm.text.length > 30, id + ' có nội dung');
  const F = E.DEC[id + '_f']; ok(F, id + ' có giai đoạn hệ quả');
  const tags = {}; F.def.opts.forEach(o => { const t = o.k.split('_')[0]; tags[t] = (tags[t] || 0) + 1; });
  Object.keys(tags).forEach(t => ok(tags[t] >= 2, id + ' hệ quả ' + t + ' có >= 2 lựa chọn'));
  Object.keys(tags).forEach(t => { const f = F.make(life(3, 40), seq(2), { tag: t, a0: 35 }); ok(f.opts.length === tags[t], id + ' hệ quả ' + t + ' chỉ hiện lựa chọn đúng nhánh'); ok(/Chuyện ấy đã qua 5 năm/.test(f.text), id + ' nhắc đúng số năm đã qua'); });
});

// 2) Chạy mọi lựa chọn nhiều lần: không lỗi, nhật ký/tone cân bằng, hệ quả được hẹn đúng id, ghi nhớ vào flags.q9110
const tone = { good: 0, bad: 0, neutral: 0 }; let sched = 0;
L9.ids.forEach(id => E.DEC[id].def.opts.forEach(o => { [0.05, 0.5, 0.95].forEach((rv, i) => {
  const l = life(20 + i, 30); l.sched = []; const log = (t, k) => { tone[k || 'neutral'] = (tone[k || 'neutral'] || 0) + 1; ok(typeof t === 'string' && t.length > 5, 'nhật ký có chữ'); };
  o.run(l, () => rv, log, {}); ok(l.flags.q9110 && l.flags.q9110[id], id + ' ghi nhớ vào flags.q9110'); ok(l.flags.q9110[id].a === 30, id + ' ghi đúng tuổi');
  l.sched.forEach(s => { ok(s.id === id + '_f' && s.at > 30 && s.at <= 36 && s.arg && s.arg.tag, id + ' hẹn đúng giai đoạn sau'); sched++; });
}); }));
const tt = tone.good + tone.bad + tone.neutral;
ok(sched >= 150, 'có nhiều hệ quả hẹn sang năm sau: ' + sched);
ok(tone.good / tt >= 0.28 && tone.bad / tt >= 0.08 && tone.neutral / tt >= 0.2, 'cân bằng tích cực/tiêu cực/trung tính ' + JSON.stringify(tone));
const tone2 = { good: 0, bad: 0, neutral: 0 };
L9.ids.forEach(id => Object.keys(E.DEC[id + '_f'].def.opts.reduce((a, o) => (a[o.k] = o, a), {})).forEach(k => { const o = E.DEC[id + '_f'].def.opts.find(x => x.k === k); [0.05, 0.9].forEach(rv => { const l = life(40, 40); o.run(l, () => rv, (t, kk) => { tone2[kk || 'neutral']++; }, { tag: k.split('_')[0], a0: 35 }); }); }));
const t2 = tone2.good + tone2.bad + tone2.neutral; ok(tone2.good / t2 >= 0.28 && tone2.bad / t2 >= 0.06, 'hệ quả giai đoạn 2 cũng cân bằng ' + JSON.stringify(tone2));

// 3) Điều kiện theo hoàn cảnh, không dựa vào giàu nghèo/nghề/tôn giáo/ngoại hình
const T = id => E.TRIG.find(t => t.id === id);
const old = life(5, 30); old.fam = { mAlive: false, fAlive: false, noDad: true }; ok(!T('q91_parents').when(old, 40), 'không còn cha mẹ thì không có chuyện chăm cha mẹ');
old.fam = { mAlive: true, fAlive: false }; ok(T('q91_parents').when(old, 40), 'còn mẹ thì có thể có chuyện chăm mẹ');
const nohobby = life(5, 40); ok(!T('q91_hobbyback').when(nohobby, 40), 'không có sở thích tuổi thơ thì không có thú vui cũ quay lại');
nohobby.flags.q9110 = { q91_hobby: { a: 8, tag: 'art' } }; ok(T('q91_hobbyback').when(nohobby, 40) && /vẽ/.test(E.DEC.q91_hobbyback.make(nohobby, seq(1), {}).text), 'sở thích tuổi thơ được nhắc lại khi trưởng thành');
const ret = life(5, 58); ret.retired = true; ok(!T('q91_retireplan').when(ret, 58), 'đã nghỉ hưu thì không còn chuyện chuẩn bị nghỉ hưu');
const nojob = life(5, 30); nojob.job = null; ok(!T('q91_learn').when(nojob, 30) && !T('q91_colleague').when(nojob, 30), 'không có việc làm thì không có chuyện học thêm/đồng nghiệp');
const kidless = life(5, 70); kidless.kids = []; ok(!T('q91_visitor').when(kidless, 70), 'không có con thì không có chuyện con cháu về thăm');
const jail = life(5, 40); jail.jailUntil = 45; ok(!T('q91_neighbor').when(jail, 40), 'đang ở tù thì không có chuyện hàng xóm');
// không có từ khóa kiểu rập khuôn trong nội dung
const all = []; L9.ids.forEach(id => { const d = E.DEC[id].def; all.push(typeof d.text === 'function' ? d.text(life(5, 40), {}) : d.text); d.opts.forEach(o => all.push(String(typeof o.l === 'function' ? o.l(life(5, 40)) : o.l))); });
ok(!/người nghèo|người giàu|dân tộc|đạo [A-Z]|xấu xí|người béo/i.test(all.join(' ')), 'nội dung không gán tính cách theo giàu nghèo/tôn giáo/ngoại hình');

// 4) Giai đoạn 2 vào hàng đợi cùng id, không mất khi bản lưu cũ chưa có q9110
const a = life(11, 10); delete a.flags.q9110; a.sched = [];
E.DEC.q91_bully.def.opts[0].run(a, () => 0.1, () => {}, {}); ok(a.flags.q9110.q91_bully.tag === 'ally', 'bản lưu cũ tự tạo flags.q9110');
ok(a.sched.length === 1 && a.sched[0].id === 'q91_bully_f', 'hệ quả được hẹn');
const b = life(11, 10); b.flags.q9110 = null; E.DEC.q91_pocket.def.opts[0].run(b, () => 0.5, () => {}, {}); ok(b.flags.q9110.q91_pocket, 'q9110 null được khôi phục');
const c = life(11, 10); c.flags.q9110 = 'x'; E.DEC.q91_pocket.def.opts[0].run(c, () => 0.5, () => {}, {}); ok(typeof c.flags.q9110 === 'object' && c.flags.q9110.q91_pocket, 'q9110 sai kiểu được khôi phục');
const dead = life(11, 40); dead.alive = false; ok(!E.DEC.q91_neighbor.valid(dead, {}), 'nhân vật đã mất thì hệ quả không còn hiệu lực');

// 5) Mô phỏng cả đời: năm không có lựa chọn, không lặp, hệ quả luôn sau gốc
const band = a0 => a0 < 15 ? 0 : a0 < 55 ? 1 : 2; const yrs = [0, 0, 0], zero = [0, 0, 0]; const seen = {}; let q91 = 0, follow = 0, errs = 0;
for (let s = 0; s < 36; s++) {
  const l = E.createLife(s % 2 ? { mode: 'vn', variant: '63', seed: 3000 + s, year: 2026 } : { mode: 'world', country: ['US', 'JP', 'IN', 'NG', 'DE', 'BR'][s % 6], seed: 3000 + s, year: 2026 }); let g = 0; const hist = {};
  while (l.alive && g++ < 110) {
    const age = l.age; try {
      E.beginYear(l, { auto: true }); const b0 = band(age); yrs[b0]++; if (!l.pending.length) zero[b0]++;
      l.pending.forEach(d => { if (/^q91_/.test(d.id)) { q91++; (hist[d.id] = hist[d.id] || []).push(age); if (/_f$/.test(d.id)) { follow++; const base = d.id.replace(/_f$/, ''); ok(hist[base] && hist[base].some(x => x < age), 'hệ quả ' + d.id + ' phải sau tình huống gốc'); } } });
      let x = 0; while (l.pending.length && l.alive && x++ < 64) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); x = 0; while (l.pending.length && l.alive && x++ < 64) E.resolve(l, E.autoKey(l)); E.endYear(l);
    } catch (e) { errs++; console.error(e.stack); break; }
  }
  Object.keys(hist).forEach(id => { if (/_f$/.test(id)) return; ok(hist[id].length <= 2, id + ' không lặp quá 2 lần/đời'); if (hist[id].length === 2) ok(hist[id][1] - hist[id][0] >= 8, id + ' cách nhau >= 8 năm'); });
}
ok(errs === 0, 'mô phỏng không lỗi'); ok(q91 >= 150 && follow >= 60, 'tình huống mới thật sự xuất hiện: ' + q91 + ' / hệ quả ' + follow);
const pct = i => zero[i] / yrs[i]; console.log('năm không lựa chọn: 0-14 ' + Math.round(100 * pct(0)) + '%, 15-54 ' + Math.round(100 * pct(1)) + '%, 55+ ' + Math.round(100 * pct(2)) + '%');
ok(pct(0) <= 0.45, 'tuổi 0-14 không quá 45% năm trống lựa chọn'); ok(pct(1) <= 0.25, 'tuổi 15-54 không quá 25% năm trống lựa chọn'); ok(pct(2) <= 0.22, 'tuổi 55+ không quá 22% năm trống lựa chọn');
console.log('life9110: ' + n + ' checks OK');
