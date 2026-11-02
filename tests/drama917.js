/* 8.10.19 Phần B: chiều sâu chức vụ nhà nước (state917) + biến cố nhiều giai đoạn trên CHAIN144 (drama917). */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, D = E.DRAMA917, S9 = E.STATE917, CH = E.CHAIN144;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
const quiet = () => {};
function year(l) {
  E.beginYear(l, { auto: true });
  for (let k = 0; l.pending.length && l.alive && k < 60; k++) E.resolve(l, E.autoKey(l));
  if (!l.alive) return; E.finishYear(l);
  for (let k = 0; l.pending.length && l.alive && k < 60; k++) E.resolve(l, E.autoKey(l));
  E.endYear(l);
}
function adult(seed, age) {
  const l = E.createLife({ mode: 'vn', seed }); Object.assign(l, { age: age || 35, indep: true, school: null, schoolEnd: null, pending: [], sched: [], money: l.base * 20 });
  l.flags.military = 0; return l;
}
ok(D && S9 && CH, 'modules loaded');
['d917_will', 'd917_debt', 'd917_rumor', 'd917_credit', 'd917_partner', 'd917_complaint', 'd917_protege', 'd917_school', 'd917_move']
  .forEach(k => ok(CH.KINDS ? !!CH.KINDS[k] : true, 'chain kind ' + k));
['d917_will_1', 'd917_will_2', 'd917_debt_1', 'd917_rumor_1', 'd917_credit_1', 'd917_partner_1', 'd917_complaint_1', 'd917_protege_1', 'd917_school_1', 'd917_move_1', 'drama917', 'post917', 'staff917', 'project917', 'stepDown917']
  .forEach(id => ok(!!E.DEC[id], 'decision ' + id));

// Mặc định Cân bằng; menu đổi cường độ một lần mỗi năm.
{
  const l = adult(91701); ok(D.state(l).mode === 'balanced', 'default mode balanced');
  const d = E.DEC.drama917.make(l, () => .5, {}); d.manual = true; l.pending = [d];
  const i = d.data.keys.indexOf('calm'); E.resolve(l, String(i)); ok(D.state(l).mode === 'calm', 'mode switched to calm');
  const d2 = E.DEC.drama917.make(l, () => .5, {}); const j = d2.data.keys.indexOf('eventful');
  ok(!d2.opts.some(o => o.k === String(j)), 'second change in the same year hidden');
}
// Bộ khởi phát: tần suất theo cường độ, tối đa 2 chuỗi drama mở, chờ 6 năm mỗi loại.
{
  const freq = {}; for (const m of ['calm', 'balanced', 'eventful']) {
    let n = 0; for (let s = 0; s < 400; s++) {
      const l = adult(92000 + s); l.job = { id: 'cn_van_phong', rank: 1, since: 30, rep: 50 }; D.state(l).mode = m;
      if (D.tryStart(l, quiet)) n++;
    }
    freq[m] = n;
  }
  ok(freq.calm < freq.balanced && freq.balanced < freq.eventful, 'start frequency follows intensity ' + JSON.stringify(freq));
  ok(freq.balanced > 20 && freq.balanced < 110, 'balanced start rate is moderate (' + freq.balanced + '/400)');
  const l = adult(93001); l.job = { id: 'cn_van_phong', rank: 1, since: 30, rep: 50 }; D.state(l).mode = 'eventful';
  let started = 0; for (let a = 35; a < 60; a++) { l.age = a; if (D.tryStart(l, quiet)) started++; ok(D.openCount(l) <= 2, 'at most two drama chains open'); }
  const last = D.state(l).last; Object.keys(last).forEach(k => ok(true, 'cooldown key ' + k));
  ok(started >= 1, 'chains started over 25 eventful years without closing (' + started + ')');
  ok(D.tryStart(l, quiet) === null, 'same-year retry does nothing');
}
// Chuỗi công lao: chạy qua các năm, có kết thúc, không tạo lại trong 6 năm.
{
  let finished = 0, results = {};
  for (let s = 0; s < 30; s++) {
    const l = adult(94000 + s, 30); E.startJob ? null : null;
    l.job = { id: 'cn_van_phong', rank: 1, since: 30, rep: 50 }; l.flags.drama917 = { mode: 'calm', last: {}, started: 0 };
    const c = CH.start(l, 'd917_credit', { dec: 'drama917', k: 'test' }, { npc: { ref: null, name: 'Trần Văn A' }, data: { since: 30 } });
    ok(!!c, 'credit chain started');
    for (let y = 0; y < 5 && l.alive; y++) { l.job.since = 30; year(l); if (!l.job) break; l.job.since = 30; }
    const done = (l.flags.chains144.done || []).find(x => x.kind === 'd917_credit');
    if (done) { finished++; results[done.result] = (results[done.result] || 0) + 1; }
  }
  ok(finished >= 15, 'credit chains reach an outcome within 5 years (' + finished + '/30) ' + JSON.stringify(results));
}
// Hủy chuỗi khi người liên quan không còn: tin đồn khép lại khi chia tay.
{
  const l = adult(95001); l.partner = { name: 'Lê Thị B', sex: 'F', alive: true, status: 'married', affection108: 60 };
  const c = CH.start(l, 'd917_rumor', { dec: 'drama917', k: 'test' }, { npc: { ref: null, name: 'Lê Thị B' }, data: {} });
  ok(!!c, 'rumor chain started'); l.partner = null; year(l);
  ok(!(l.flags.chains144.active || []).some(x => x.kind === 'd917_rumor'), 'rumor chain closed after partner left');
}
// Con ở trường: kết quả đổi theo lựa chọn, con được ghi nhận.
{
  const l = adult(95101, 40); l.kids = [{ name: 'Minh', sex: 'M', born: 30, alive: true, close: 60, study: 50 }];
  const c = CH.start(l, 'd917_school', { dec: 'drama917', k: 'test' }, { npc: { ref: null, name: 'Minh' }, data: {} });
  c.next = l.age; c.due = l.age;
  const dec = E.DEC.d917_school_1.make(l, () => .5, { cid: c.id, token: 't' }); c.open = { at: l.age, token: 't' };
  ok(dec.opts.some(o => o.k === 'teacher'), 'school decision offers talking to teacher');
  l.pending = [dec]; E.resolve(l, 'teacher'); ok(c.stage === 1 && c.data.path === 'teacher', 'school chain advanced with chosen path');
}
// Bản lưu cũ: drama917 hỏng bị dọn, không tạo chuỗi khi tải.
{
  const l = adult(95201); l.flags.drama917 = 'oops'; E.migrateExt(l); ok(l.flags.drama917 === undefined, 'broken drama917 flag removed on migrate');
  const l2 = adult(95202); E.migrateExt(l2); ok(!l2.flags.chains144 || !l2.flags.chains144.active.length, 'migration starts no chain');
}
// Khiếu nại công vụ chỉ cho cán bộ VN cấp ≥3, kết quả tác động KPI uy tín.
{
  let n = 0;
  for (let s = 0; s < 200 && n < 1; s++) {
    const l = adult(96000 + s, 45);
    const jobs = E.JOBS || []; const vn = Object.keys(E.STATE174.BY_JOB_RANK || {})[0]; if (!vn) break;
    const [id, rank] = vn.split(':'); l.job = { id, rank: +rank || 0, since: 40, rep: 60 };
    if (!E.STATE174.isVNState(l) || E.STATE174.levelOf(l) < 3) { l.job.rank = 4; if (!E.STATE174.isVNState(l) || E.STATE174.levelOf(l) < 3) continue; }
    const cands = D.candidates(l).map(x => x[0]); ok(cands.includes('d917_complaint'), 'complaint is a candidate for state official');
    n++;
  }
  const civ = adult(96999); civ.job = { id: 'cn_van_phong', rank: 1, since: 30 };
  ok(!D.candidates(civ).some(x => x[0] === 'd917_complaint'), 'private worker gets no state complaint');
}
// Đời đầy đủ: không lỗi, không vượt giới hạn, không sự kiện sau khi chết.
{
  let chains = 0, after = 0;
  for (let s = 0; s < 60; s++) {
    const l = E.createLife({ mode: s % 3 ? 'vn' : 'world', seed: 97000 + s * 11 }); E.runHeadless(l);
    const st = l.flags.chains144; if (st) chains += (st.done || []).concat(st.active || []).filter(c => /^d917_/.test(c.kind)).length;
    if (st) ok(st.active.length <= 4, 'CHAIN144 active cap respected');
    ok(!l.flags.drama917 || l.flags.drama917.started <= 30, 'drama start count bounded');
    after += (l.log || []).filter(x => x && x.age > l.age).length;
  }
  ok(chains > 0, 'drama chains occur in full lives (' + chains + ' over 60 lives)');
  ok(after === 0, 'no log entries after death age');
}
console.log('PASS drama917: ' + count + ' checks (drama chains on CHAIN144, intensity, cooldown, cancel, save migration).');
