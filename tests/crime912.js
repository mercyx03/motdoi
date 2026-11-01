/* Đường tối 912: tổng hợp án, một vụ không phạt hai lần, đàn em có vai trò, rủi ro có trần, địa bàn, thăng cấp, uy tín khi quay lại, lưu/tải. */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, H = E.H, CR = E.CRIME912, C9 = E.CRIME911;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
const reload = l => E.migrate(JSON.parse(JSON.stringify(l)));
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
function crook(o = {}) {
  const l = E.createLife({ mode: 'vn', seed: o.seed || 9129, year: 1980 });
  Object.assign(l, { age: o.age || 28, indep: true, alive: true, school: null, pending: [], sched: [], jailUntil: null, abroad: null, money: l.base * 30 });
  l.flags.military = 0; l.st.hea = 80; E.startJob(l, o.job || 'doi_no', H.rf(l), () => {}); E.migrateExt(l); return l;
}
function open(l, id, arg) { const d = E.DEC[id].make(l, () => 0, arg); d.manual = true; d.data.requested = true; d.data.actionYear850 = l.age; l.pending = [d]; return d; }
function press(l, key) { const d = l.pending[0], i = d.data.keys.indexOf(key); assert(i >= 0, d.id + ' has ' + key + ' in ' + d.data.keys.join(',')); E.resolve(l, String(i)); return l.pending[0]; }
function seeded(n) { let x = (n * 2654435761) >>> 0 || 1; return () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
const hook = re => E.HOOKS.year.find(f => re.test(f.toString()));
const YEAR = hook(/terrIncome/), PROMO = hook(/promo912/);

// 1. Án mới khi đang thi hành: tổng hợp, không làm ngắn án cũ; sổ án ghi từng vụ.
{
  const l = crook(); H.jail(l, 5, 'vụ thứ nhất', say(l)); const until = l.jailUntil;
  H.jail(l, 1, 'vụ thứ hai', say(l));
  ok(l.jailUntil === until, 'shorter new sentence does not shorten the running one');
  ok(l.log.some(e => /tổng hợp với án đang thi hành/.test(e.t)), 'concurrency logged');
  const s = CR.state(l).sentences; ok(s.length === 2 && !s[0].concurrent && s[1].concurrent, 'sentence ledger keeps both cases');
  H.jail(l, 9, 'vụ thứ ba', say(l)); ok(l.jailUntil > until, 'longer new case extends to its own end');
}
// 2. Một hồ sơ chỉ dẫn tới một lần xử lý: khép hồ sơ → tối đa một quyết định "Bị bắt"; đang ở tù thì quyết định đó vô hiệu.
{
  let prosecuted = 0;
  for (let s = 0; s < 60; s++) {
    const l = crook({ seed: 913000 + s }); const c = C9.open(l, null, 'thử', 2); c.at = l.age - 1;
    C9.settle(l, c.id, 'cooperate', () => 0.01, say(l));
    const due = (l.sched || []).filter(x => x.id === 'bi_bat'); ok(due.length <= 1, 'at most one arrest per case');
    if (due.length) { prosecuted++; ok(C9.open(l, null, 'vụ khác', 2) === null, 'no new case opened while arrest pending');
      const d = E.DEC.bi_bat.make(l, () => .5, due[0].arg); l.pending = [d]; E.resolve(l, 'confess'); const n = CR.state(l).sentences.length;
      const d2 = E.DEC.bi_bat.make(l, () => .5, due[0].arg); ok(!E.DEC.bi_bat.valid(l, d2.data), 'second arrest invalid while serving'); ok(CR.state(l).sentences.length === n, 'no extra sentence'); }
  }
  ok(prosecuted > 0, 'prosecution path exercised');
}
// 3. Đàn em: nhận qua menu, giao việc, phần chia làm giảm thu nhập, vai trò giảm rủi ro có trần.
{
  const l = crook({ seed: 913100 });
  open(l, 'crew912', {}); const h = CR.hires(l)[0]; press(l, 'h:' + h.id);
  const p = CR.crew(l).find(x => x.id === h.id); ok(p && p.role912 === h.role && p.cut912 === h.ask, 'hired with role and share');
  open(l, 'crewPerson912', { id: p.id }); press(l, 'r:guard'); ok(p.role912 === 'guard', 'role assigned');
  const d0 = E.underworldDeathRisk(l, false); p.skill912 = 80; p.trust = 100; const d1 = E.underworldDeathRisk(l, false);
  ok(d1 < d0 && d1 >= 0.05, 'guard lowers ambush death risk, never zero');
  for (let i = 0; i < 6; i++) C9.state(l).crew.push({ id: 'g' + i, name: 'G' + i, trust: 100, status: 'active', since: l.age, role912: 'guard', skill912: 99, trait912: 'trung thành', cut912: 3, hist912: [] });
  ok(E.underworldDeathRisk(l, false) >= d0 * (1 - CR.BAL.guardCut) - 1e-9 && E.underworldDeathRisk(l, false) >= 0.05, 'many guards still capped at 50% reduction (no immunity)');
  const a = crook({ seed: 913101 }), b = crook({ seed: 913101 }); CR.state(a); CR.state(b);
  C9.state(b).crew.push({ id: 'look', name: 'L', trust: 100, status: 'active', since: b.age, role912: 'lookout', skill912: 90, trait912: 'cẩn thận', cut912: 3, hist912: [] });
  ok(C9.rate(b, 0.08) < C9.rate(a, 0.08) && C9.rate(b, 0.08) >= C9.rate(a, 0.08) * (1 - CR.BAL.lookCap) - 1e-9, 'lookout lowers investigation rate within cap');
  const m0 = E.careerYear(a, () => .5, () => {}); const m1 = E.careerYear(b, () => .5, () => {}); ok(m1 < m0 * 1.01, 'crew share is paid out of income');
  const share = CR.cutTotal(l); ok(share > 0, 'crew takes a share');
}
// 4. Lòng tin: trả thấp thì rời nhóm, có thể thành người cung cấp thông tin (mở hồ sơ một lần).
{
  let informed = 0, left = 0;
  for (let s = 0; s < 80; s++) {
    const l = crook({ seed: 913200 + s }); CR.state(l);
    C9.state(l).crew.push({ id: 'x', name: 'X', trust: 22, status: 'active', since: l.age, role912: 'lookout', skill912: 70, trait912: 'tham lam', cut912: 3, hist912: [] });
    l.age++; YEAR(l, seeded(s + 1), say(l));
    const p = C9.state(l).crew.find(x => x.id === 'x'); if (p.status === 'left') left++; if (/cung cấp thông tin/.test(p.hist912.join())) { informed++; ok(C9.state(l).open, 'informant opens a case'); }
  }
  ok(left === 80 && informed > 5 && informed < 60, 'underpaid crew leave; some inform (' + informed + '/80)');
}
// 5. Địa bàn: một quyết định mỗi năm, có thu chi, tan dần khi ở tù; bị kết án làm mất ảnh hưởng.
{
  const l = crook({ seed: 913300 }); open(l, 'crew912', {}); press(l, 't:expand');
  const t = CR.state(l).territory; ok(t.influence === 15, 'expand +15');
  open(l, 'crew912', {}); ok(!l.pending[0].opts.some(o => o.k === String(l.pending[0].data.keys.indexOf('t:expand'))), 'one territory decision per year (handler)');
  l.age++; const m = l.money; YEAR(l, () => .5, say(l)); ok(l.money !== m, 'territory income/upkeep applied');
  H.jail(l, 3, 'thử', say(l)); ok(t.influence === 0, 'conviction loses influence');
}
// 6. Bảng rủi ro hiện trước khi quyết định.
{
  const l = crook({ seed: 913400 }); const d = open(l, 'crimePlan911', {});
  ok(/khả năng bị mở hồ sơ \d+%/.test(d.text) && /không có cách nào miễn hoàn toàn/.test(d.text), 'risk report in plan menu');
}
// 7. Thăng cấp theo nhóm/địa bàn, không khi ở tù; quay lại nghề sau tù giữ một phần uy tín.
{
  let up = 0;
  for (let s = 0; s < 40; s++) { const l = crook({ seed: 913500 + s }); l.job.yrs = 10; C9.state(l).cohesion = 70; const rr = seeded(s + 7); for (let y = 0; y < 3; y++) { l.age++; PROMO(l, rr, say(l)); } if ((l.job.rank || 0) >= 1) up++; }
  ok(up > 10, 'promotion reachable without academic knowledge (' + up + '/40)');
  const j = crook({ seed: 913600 }); j.job.yrs = 10; H.jail(j, 3, 'thử', say(j)); j.age++; PROMO(j, () => 0, say(j)); ok(!j.job, 'no job / no promotion while in prison');
  const k = crook({ seed: 913700 }); k.job.rank = 2; H.jail(k, 2, 'thử', say(k)); k.age += 3; E.startJob(k, 'doi_no', H.rf(k), () => {}); ok(k.job.rank === 1, 'rejoining same trade restores rank − 1');
}
// 8. Đánh úp: lựa chọn yểm trợ chỉ có khi có bảo vệ.
{
  const l = crook({ seed: 913800 }); const d = E.DEC.uw_can_len.make(l, () => .5); ok(!d.opts.some(o => o.k === 'cover912'), 'no cover without guard');
  C9.state(l).crew.push({ id: 'g', name: 'G', trust: 80, status: 'active', since: l.age, role912: 'guard', skill912: 70, trait912: 'trung thành', cut912: 8, hist912: [] });
  const d2 = E.DEC.uw_can_len.make(l, () => .5); ok(d2.opts.some(o => o.k === 'cover912'), 'cover option with guard');
}
// 9. Lưu/tải lúc đang điều tra, trong tù, sau ra tù; mất khi còn án không lỗi.
{
  const l = crook({ seed: 913900 }); C9.open(l, null, 'thử', 2); const r1 = reload(l); ok(C9.state(r1).open && C9.state(r1).open.why === 'thử', 'reload during investigation keeps case');
  H.jail(l, 2, 'thử', say(l)); const r2 = reload(l); ok(r2.jailUntil === l.jailUntil && CR.state(r2).sentences.length === 1, 'reload in prison keeps sentence');
  r2.age = r2.jailUntil; ok(E.actions(r2).find(a => a.id === 'crew912').ok !== 'Đang ở trong trại giam', 'released: actions no longer blocked by prison');
  const r3 = reload(r2); r3.age++; YEAR(r3, () => .5, say(r3)); ok(!(r3.jailUntil != null && r3.age < r3.jailUntil), 'not re-jailed without a new case');
  H.kill(r3, 'thử', say(r3)); YEAR(r3, () => .5, say(r3)); ok(!r3.alive, 'death with record handled');
  const old = crook({ seed: 913901 }); delete old.flags.crime912; const r4 = reload(old); ok(!r4.flags.crime912 && E.actions(r4).some(a => a.id === 'crew912'), 'old save opens');
}
console.log('Đường tối 912: ' + count + ' checks passed.');
