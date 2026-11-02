/* 8.10.17: du học (abroad107) → "Ở lại tìm việc" phải tìm được việc trong thời hạn cư trú tìm việc (abroad-depth),
   không bị chặn "Đang ở nước ngoài theo hợp đồng"; người lao động theo hợp đồng vẫn bị chặn như cũ. */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
function enrol(seed, lv) {
  const l = E.createLife({ mode: 'vn', seed });
  Object.assign(l, { age: lv === 5 ? 18 : 23, indep: true, edu: lv === 5 ? 3 : 5, school: null, schoolEnd: null, pending: [], sched: [], money: l.base * 400, job: null });
  l.flags.military = 0; l.st.kno = 95; l.lang = { en: 6 }; l.langExp = {};
  const d = E.DEC.abroad107.make(l, () => .3, {}); d.manual = true; l.pending = [d];
  for (let i = 0; l.pending.length && i < 12; i++) { const x = l.pending[0], o = x.opts.find(o => o.k !== 'cancel' && !/Hủy|Quay lại|Để sau/.test(o.l)); E.resolve(l, (o || x.opts[0]).k); }
  return l;
}
function untilFinish(l) {
  for (let y = 0; y < 12 && l.alive; y++) {
    E.beginYear(l, { auto: true });
    for (let k = 0; l.pending.length && l.alive && k < 40; k++) { if (l.pending[0].id === 'abroad107_finish') { E.resolve(l, 'stay'); return true; } E.resolve(l, E.autoKey(l)); }
    if (!l.alive) return false; E.finishYear(l);
    for (let k = 0; l.pending.length && l.alive && k < 40; k++) { if (l.pending[0].id === 'abroad107_finish') { E.resolve(l, 'stay'); return true; } E.resolve(l, E.autoKey(l)); }
    E.endYear(l);
  }
  return false;
}
let stayed = 0;
for (let s = 0; s < 40 && stayed < 8; s++) {
  for (const lv of [5, 6]) {
    const l = enrol(81000 + s * 3 + lv, lv); if (!l.flags.study107 || !untilFinish(l)) continue; stayed++;
    const tv = E.actions(l).find(a => a.id === 'tim_viec');
    ok(tv.ok === true, 'job search available after staying (' + tv.ok + ', residence ' + (l.abroad && l.abroad.residence900 && l.abroad.residence900.kind) + ')');
    const jd = E.DEC.job.make(l, () => .5); jd.manual = true; l.pending = [jd]; E.resolve(l, jd.opts[0].k);
    ok(!!l.job && E.careerYear(l, () => .5, () => {}) > 0, 'accepted job pays income while the job-search residence is valid');
  }
}
ok(stayed >= 5, 'enough study-abroad lives reached the stay decision (' + stayed + ')');
// Lao động theo hợp đồng (không phải cư trú tìm việc) vẫn không tự nhảy việc.
{
  const l = E.createLife({ mode: 'vn', seed: 81999 }); Object.assign(l, { age: 30, indep: true, school: null, pending: [] });
  l.abroad = { code: 'JP', name: 'Nhật Bản', perm: false, until: 33, pool: 'jp' }; l.abroad.residence900 = { kind: 'worker', until: 33, adaptation: 40, homesick: 30, history: [] };
  ok(E.actions(l).find(a => a.id === 'tim_viec').ok === 'Đang ở nước ngoài theo hợp đồng', 'contract worker still cannot job-hop');
}
console.log('PASS abroad917: ' + count + ' checks (stay after study abroad can search and take a job).');
