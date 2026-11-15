'use strict';
// 9.4.4: khả năng con đỗ đại học (expansion.js: E.uniChance) tính cả học thêm, trường tư/quốc tế, lớp hướng dẫn; con học lực 100 không còn trượt gần một phần tư số lần.
const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, U = G.U;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
function parent(seed) { const l = E.createLife({ mode: 'vn', seed }); l.age = 45; l.indep = true; l.school = null; l.pending = []; l.money = l.base * 20; return l; }
function addKid(l, o) { const k = Object.assign({ name: 'Minh An', sex: 'M', born: 27, alive: true, edu: 3, study: 50, close: 60, job: null, rank: 0, jyrs: 0 }, o || {}); l.kids = [k]; return k; }
const kid = (study, extra) => Object.assign({ study }, extra || {});
// 1. Đơn điệu và có tác động của từng yếu tố
{
  const l = parent(940);
  const c = o => E.uniChance(l, o);
  ok(c(kid(30)) < c(kid(50)) && c(kid(50)) < c(kid(70)) && c(kid(70)) < c(kid(100)), 'học lực cao thì khả năng đỗ cao hơn');
  ok(c(kid(60, { tutor: true })) > c(kid(60)), 'học thêm làm tăng khả năng đỗ');
  ok(c(kid(60, { family53: { school: 'international' } })) > c(kid(60, { family53: { school: 'private' } })) && c(kid(60, { family53: { school: 'private' } })) > c(kid(60)), 'trường quốc tế và tư thục làm tăng khả năng đỗ');
  ok(c(kid(60, { vice: 'cờ bạc' })) < c(kid(60)), 'thói hư làm giảm khả năng đỗ');
  ok(c(kid(100)) >= 0.9, 'học lực 100 có khả năng đỗ từ 90% (' + c(kid(100)).toFixed(2) + ')');
  ok(c(kid(100, { tutor: true, family53: { school: 'international', course: 'coach' }, boost: 1.1 })) >= 0.95, 'học lực 100 có học thêm và trường quốc tế gần như chắc đỗ');
  ok(c(kid(20)) >= 0.04 && c(kid(100, { tutor: true, family53: { school: 'international' } })) <= 0.96, 'khả năng luôn nằm trong 4–96%');
  ok(Math.abs(c(kid(50)) - 0.4) < 0.1, 'học lực trung bình vẫn ở mức khoảng 40%');
}
// 2. Mô phỏng cảnh con 18 tuổi
function run(study, extra, N) {
  let pass = 0, fail = 0, explained = 0;
  for (let i = 0; i < N; i++) {
    const l = parent(9400 + i); const k = addKid(l, Object.assign({ study }, extra)); l.age = k.born + 18;
    const d = E.DEC.con_18.make(l, () => U.rand(l), { n: k.name }); l.pending = [d]; const out = E.resolve(l, 'uni'); const t = out.map(e => e.t).join(' | ');
    if (k.uniUntil) pass++; else { fail++; if (/ốm và căng thẳng/.test(t)) explained++; }
  }
  return { pass, fail, explained, rate: pass / N };
}
{
  const a = run(100, { tutor: true, family53: { school: 'international', course: 'coach' }, boost: 1.1 }, 300), b = run(100, {}, 300), c = run(30, {}, 300);
  ok(a.rate >= 0.92, 'học lực 100, học thêm, trường quốc tế: đỗ ít nhất 92% (' + a.pass + '/300)');
  ok(b.rate >= 0.85 && b.rate > c.rate + 0.5, 'học lực 100 không học thêm vẫn đỗ phần lớn, hơn hẳn học lực 30 (' + b.pass + ' so với ' + c.pass + ')');
  ok(c.rate < 0.35, 'học lực thấp đỗ ít (' + c.pass + '/300)');
  ok(a.fail === 0 || a.explained === a.fail, 'con học giỏi mà trượt thì có lời giải thích (' + a.explained + '/' + a.fail + ')');
}
// 3. Gợi ý trên nút nêu khả năng đỗ, văn bản sạch
{
  const l = parent(941); const k = addKid(l, { study: 100, tutor: true }); l.age = k.born + 18; const d = E.DEC.con_18.make(l, () => 0.5, { n: k.name });
  const uni = d.opts.find(o => o.k === 'uni'); ok(uni && /khả năng đỗ: (rất cao|cao)/.test(uni.h) && !/undefined|NaN/.test(uni.h), 'nút "Ủng hộ con học đại học" nêu khả năng đỗ: ' + (uni && uni.h));
  const w = parent(942); const k2 = addKid(w, { study: 25 }); w.age = k2.born + 18; const d2 = E.DEC.con_18.make(w, () => 0.5, { n: k2.name }); ok(/khả năng đỗ: (thấp|rất thấp)/.test(d2.opts.find(o => o.k === 'uni').h), 'học lực thấp: nêu khả năng thấp');
}
// 4. Con trượt vẫn đi tiếp con đường sau trượt (life141) và bản lưu cũ không có family53 vẫn chạy
{
  const l = parent(943); const k = addKid(l, { study: 10 }); l.age = k.born + 18; ok(!k.family53, 'con không có family53 (bản lưu cũ)');
  let failed = 0; for (let i = 0; i < 60; i++) { const x = parent(9500 + i); const kk = addKid(x, { study: 10 }); x.age = kk.born + 18; x.pending = [E.DEC.con_18.make(x, () => U.rand(x), { n: kk.name })]; E.resolve(x, 'uni'); if (!kk.uniUntil) { failed++; ok(kk.edu >= 3, 'con trượt vẫn có học vấn hợp lệ'); } }
  ok(failed > 30, 'học lực thấp thường trượt (' + failed + '/60)');
}
// 5. Học thêm và trường quốc tế giữ được học lực của con qua các năm đi học (không bị kéo về mức trung bình như trường công)
{
  function study17(intl, seed) {
    const l = E.createLife({ mode: 'vn', seed }); let g = 0;
    while (l.alive && g++ < 80 && l.age < 26) { E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l); }
    if (!l.alive) return null; const kid = { name: 'Be', sex: 'M', born: l.age, alive: true, edu: 0, study: 60, close: 60 }; l.kids = [kid];
    if (intl) { kid.family53 = { innate: null, interest: 'science', skills: {}, school: 'international', course: 'coach' }; kid.tutor = true; }
    let y = 0; while (l.alive && y++ < 17) { E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l); }
    const kk = (l.kids || []).find(x => x.name === 'Be'); return kk ? kk.study : null;
  }
  const a = [], b = []; for (let i = 0; i < 14; i++) { const x = study17(false, 7800 + i), y = study17(true, 7800 + i); if (x != null) a.push(x); if (y != null) b.push(y); }
  const m = v => v.reduce((p, q) => p + q, 0) / v.length;
  ok(a.length >= 8 && b.length >= 8 && m(b) > m(a) + 3, 'trường quốc tế, học thêm giúp học lực lúc 17 tuổi cao hơn rõ (' + m(b).toFixed(1) + ' so với ' + m(a).toFixed(1) + ')');
}
console.log('PASS child-uni944: ' + n + ' checks');
