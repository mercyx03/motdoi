/* 8.10.19 Phần B: chức vụ gắn bộ/tỉnh, từ nhiệm/kỷ luật có quy trình, nhân sự theo thẩm quyền, ngân sách công tách tiền riêng. */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, S = E.STATE174, S9 = E.STATE917;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
const quiet = () => {};
function makeLife(jobId, rank, age, seed) {
  const l = E.createLife({ mode: 'vn', seed: seed || 9171 });
  Object.assign(l, { age: age || 45, indep: true, edu: 5, major: 'eco', school: null, abroad: null, retired: false, pending: [], sched: [], money: l.base * 50, record: 0 });
  l.st.kno = 88; l.st.soc = 80; l.st.hea = 85; l.flags.military = 0;
  E.startJob(l, jobId, () => 0.5, quiet, true);
  Object.assign(l.job, { rank, rankTracked: rank, rankSince: l.age, yrs: 8, sen: 8, rep: 78 });
  S.syncState(l); return l;
}
// Chức vụ gắn đúng bộ/tỉnh; bản lưu cũ ghi "chưa xác định".
{
  const m = makeLife('trung_uong', 5); const p = S9.syncPost(m);
  ok(p && p.kind === 'ministry' && /^Bộ /.test(p.agency), 'minister bound to a ministry (' + (p && p.agency) + ')');
  ok(/· Bộ /.test(E.jobTitle(m)), 'title shows ministry: ' + E.jobTitle(m));
  const legacy = makeLife('trung_uong', 5); legacy.job.rankSince = 30; legacy.job.since = 30; delete legacy.job.post917;
  const q = S9.syncPost(legacy); ok(q.inferred && q.agency === null, 'legacy save keeps ministry undetermined instead of inventing one');
  ok(/chưa xác định/.test(E.jobTitle(legacy)), 'legacy title says undetermined');
  const nh = makeLife('ngan_hang_nn', 2); S9.syncPost(nh); ok(/Ngân hàng Nhà nước/.test(nh.job.employer123.name), 'SBV employer fixed');
  const pv = makeLife('hanh_chinh_cong', 7); pv.job.rankSince = pv.age; delete pv.job.post917; const pp = S9.syncPost(pv);
  ok(pp.kind === 'province', 'provincial leader has province scope');
  const priv = E.createLife({ mode: 'vn', seed: 9179 }); Object.assign(priv, { age: 30, indep: true, school: null, pending: [] }); priv.job = { id: 'cn_van_phong', rank: 1, since: 28 };
  ok(S9.syncPost(priv) === null, 'private job gets no state post');
  ok(E.migrateExt && (() => { const x = makeLife('trung_uong', 3); x.job.post917 = 'bad'; E.migrateExt(x); return x.job.post917 === undefined; })(), 'broken post917 removed on migrate');
}
// Từ nhiệm cần xác nhận, ghi lịch sử, hạ một bậc; hủy thì giữ nguyên.
{
  const l = makeLife('trung_uong', 4); S9.syncPost(l); const lv0 = S.levelOf(l);
  let d = E.DEC.stepDown917.make(l, () => .5); l.pending = [d]; E.resolve(l, 'cancel'); ok(l.job.rank === 4, 'cancel keeps the post');
  d = E.DEC.stepDown917.make(l, () => .5); l.pending = [d]; E.resolve(l, 'confirm');
  ok(l.job.rank === 3 && S.levelOf(l) <= lv0, 'step down lowers one rank');
  ok(S.state(l).history.some(h => /từ nhiệm/.test(h.type)), 'step down recorded in history');
  ok(l.job.post917.hist.some(h => /từ nhiệm/.test(h.type)), 'post history records the step down');
  l.pending = [d]; const r = l.job.rank; E.resolve(l, 'confirm'); ok(l.job.rank === r, 'stale confirmation does nothing');
}
// Thẩm quyền nhân sự theo cấp; tối đa 3 việc/năm.
{
  const low = makeLife('cong_chuc', 1, 30); ok(S9.authority(low) === 'none', 'junior official has no personnel authority');
  const mid = makeLife('trung_uong', 3); const top = makeLife('trung_uong', 6, 55);
  ok(['propose', 'decide'].includes(S9.authority(mid)), 'mid-level can at least propose (' + S9.authority(mid) + ', lv ' + S.levelOf(mid) + ')');
  ok(S9.authority(top) === 'decide', 'top-level decides');
  const staff = S9.staff(top); ok(staff.length >= 3 && staff.every(p => p.name && p.trait && p.comp >= 0), 'staff have names, traits, competence');
  ok(S9.staff(top)[0].id === staff[0].id, 'staff stable across calls');
  ok(S9.actsLeft(top) === S9.BAL.staffActs, 'fresh year has all personnel actions');
}
// Ngân sách công tách tài sản riêng; dự án tối đa 2.
{
  const l = makeLife('trung_uong', 6, 55); const money0 = l.money; const p = S9.projState(l);
  ok(p.budget > 0 && p.budget === p.cap, 'public budget allocated');
  const d = E.DEC.project917.make(l, () => .5, {}); d.manual = true; l.pending = [d];
  const i = d.data.keys.findIndex(k => /^new/.test(k)); ok(i >= 0, 'project options offered');
  E.resolve(l, String(i)); ok(l.money === money0, 'starting a project does not touch personal money');
  ok(S9.projState(l).active.length === 1 && S9.projState(l).budget < p.cap, 'project consumes public budget');
  for (let y = 0; y < 8; y++) { l.age++; E.HOOKS.year.forEach(h => { try { h(l, () => .5, quiet, l.age - 1); } catch (e) { } }); }
  const st = S9.projState(l); ok(st.active.length <= S9.BAL.maxProjects, 'project cap respected');
  ok(st.done.length >= 1 || st.active.length >= 1, 'project progressed or finished');
}
// KPI tăng tự nhiên không vượt 70.
{
  const l = makeLife('trung_uong', 4); const s = S.state(l); s.kpi.expertise = 69; s.kpi.coordination = 70;
  for (let y = 0; y < 5; y++) { l.age++; E.HOOKS.year.forEach(h => { try { h(l, () => .5, quiet, l.age - 1); } catch (e) { } }); }
  ok(s.kpi.coordination <= 70 || s.kpi.coordination === 70, 'natural coordination gain capped at 70 (' + s.kpi.coordination + ')');
}
// Đời đầy đủ: không lỗi.
{
  let posts = 0;
  for (let s = 0; s < 40; s++) { const l = E.createLife({ mode: 'vn', seed: 9175000 + s * 13 }); E.runHeadless(l); if (l.job && l.job.post917) posts++; ok(!l.alive, 'life finished'); }
  ok(true, 'full lives with state917 run (' + posts + ' posts at death)');
}
console.log('PASS state917: ' + count + ' checks (ministry/province post, step down, personnel authority, public budget).');
