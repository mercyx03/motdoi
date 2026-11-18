'use strict';
// 9.4.4: chuyển ngang giữa các nghề gần nhau (jobs.js, scene chuyen_huong) khi chán nản, kiệt sức hoặc làm rất lâu một chỗ.
const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, U = G.U;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
function worker(id, o) {
  o = o || {}; const l = E.createLife({ mode: 'vn', seed: o.seed || 944 }); l.age = o.age || 35; l.indep = true; l.school = null; l.edu = o.edu == null ? 3 : o.edu; l.pending = []; l.flags.military = null; l.money = l.base * 5;
  E.startJob(l, id, () => 0.5, () => { }, true); l.job.yrs = o.yrs == null ? 9 : o.yrs; l.job.rank = o.rank || 0; l.st.hap = o.hap == null ? 70 : o.hap; return l;
}
const T = E.TRIG.find(t => t.id === 'chuyen_huong');
const prep = l => E.DEC.chuyen_huong.make(l, () => 0.5);
// 1. Nghề đã có hướng riêng vẫn dùng hướng riêng, không bị thay bằng chuyển ngang
{
  const l = worker('dau_bep', { rank: 2, yrs: 5 }); const d = prep(l);
  ok(d && ['chu_quan_an', 'chu_nha_hang'].includes(d.data.to), 'đầu bếp lâu năm vẫn được gợi ý mở quán');
}
// 2. Chuyển ngang chỉ khi chán hoặc làm rất lâu; nghề danh tiếng, nhà nước, pháp lý, y tế, phi pháp không dính
{
  const fresh = worker('phuc_vu', { yrs: 4, hap: 80, seed: 947 }); ok(!E.DEC.chuyen_huong.valid(fresh, {}) || !prep(fresh).data.lateral, 'mới làm, đang vui: không có lời mời chuyển ngang');
  let offered = 0, lateral = 0, bad = [];
  Object.keys(E.CAR).filter(id => !E.CAR[id].hidden).forEach(id => {
    const l = worker(id, { yrs: 9, hap: 40, edu: 7, age: 34, seed: 948 }); if (!l.job || E.resolveJob(l.job.id) !== id) return;
    if (!E.DEC.chuyen_huong.valid(l, {})) return; offered++; const d = prep(l); if (!d.data.lateral) return; lateral++;
    const c = E.CAR[id], t = E.CAR[d.data.to];
    if (c.fame || c.crime || c.hidden || c.owner || t.fame || t.crime || t.hidden || t.owner || !['worker', 'poor', 'farm', 'service', 'beauty', 'office', 'sale', 'biz', 'free'].includes(c.cat) || c.cat === 'biz' && t.cat !== 'biz' && !['office', 'sale', 'free'].includes(t.cat)) bad.push(id + '→' + d.data.to);
    ok(!E.CAR[d.data.to].crime && E.jobEligible(l, E.CAR[d.data.to]), 'đích hợp lệ: ' + id + '→' + d.data.to);
  });
  ok(lateral > 20 && offered >= lateral, 'nhiều nghề có thể được mời chuyển ngang (' + lateral + '/' + offered + ')');
  ok(bad.length === 0, 'không chuyển ngang từ/đến nghề cần chứng chỉ, ngạch nhà nước, danh tiếng hoặc phi pháp: ' + bad.join(','));
  const st = worker('cong_an', { yrs: 9, hap: 40, edu: 7, rank: 3 }); ok(!E.DEC.chuyen_huong.valid(st, {}) || !prep(st).data.lateral, 'công an không bị chuyển ngang sang nghề thường');
}
// 3. Cùng một năm cho cùng một kết quả (không đổi đích giữa các lần gọi)
{
  const l = worker('cong_nhan', { yrs: 9, hap: 40, seed: 951 }); const a = prep(l), b = prep(l); ok(a && b && a.data.lateral && a.data.to === b.data.to, 'đích chuyển ngang ổn định trong năm');
  ok(a.data.cost === 0 && /mệt mỏi/.test(a.data.t) && !/undefined|NaN/.test(a.data.t) && a.data.to !== E.resolveJob(l.job.id), 'lời mời chuyển ngang có lý do và không tốn vốn');
}
// 4. Hậu quả: đổi nghề thật, thâm niên tính lại, ghi nhớ
{
  let moved = 0, lowered = 0, total = 0;
  for (let i = 0; i < 60; i++) {
    const l = worker('cong_nhan', { yrs: 9, hap: 40, rank: 2, seed: 960 + i }); l.id = 'lat' + i; const d = prep(l); if (!d || !d.data.lateral) continue; total++;
    const from = E.resolveJob(l.job.id), r0 = l.job.rank; l.pending = [d]; E.resolve(l, 'go');
    if (E.resolveJob(l.job.id) !== from) { moved++; if (l.job.rank <= r0) lowered++; ok(l.job.yrs === 0, 'thâm niên tính lại ở nghề mới'); ok(l.log.some(e => /Rời vị trí .*chuyển sang làm/.test(e.t)), 'nhật ký ghi chuyện đổi nghề'); }
  }
  ok(total > 20 && moved === total, 'chọn đi thì đổi nghề (' + moved + '/' + total + ')');
  ok(lowered === moved, 'sang nghề mới không giữ nguyên bậc cũ (' + lowered + '/' + moved + ')');
}
// 5. Tần suất trong cả đời: đủ nhiều người rẽ hướng nhưng không phải ai cũng đổi nghề
{
  let n1 = 0, N = 200;
  for (let i = 0; i < N; i++) {
    const l = E.createLife({ mode: 'vn', seed: 50200 + i }); let g = 0;
    while (l.alive && g++ < 130 && l.age < 60) { E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l); }
    if (l.log.some(e => /^Rời vị trí .*chuyển sang làm/.test(e.t))) n1++;
  }
  ok(n1 >= 4 && n1 < N * 0.5, 'một phần nhỏ nhưng đáng kể số đời đổi hướng nghề (' + n1 + '/' + N + ')');
}
// 6. Đời sinh 2026 đi qua cảnh này không lỗi, không văn bản hỏng
{
  const l = worker('cong_nhan', { yrs: 9, hap: 40 }); const d = prep(l); ok(d && !/undefined|NaN|null/.test(d.title + d.text + d.opts.map(o => o.l + o.h).join('')), 'cảnh hiển thị sạch');
}
console.log('PASS career-lateral944: ' + n + ' checks');
