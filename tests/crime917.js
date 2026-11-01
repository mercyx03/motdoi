/* §12 (8.10.17): thủ lĩnh nhóm NPC, đổi lãnh đạo hai giai đoạn, tan rã nhóm, hỗ trợ pháp lý trong trại theo từng bản án; lưu/tải. */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, H = E.H, CR = E.CRIME912, C9 = E.CRIME911;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
const reload = l => { const x = E.migrate(JSON.parse(JSON.stringify(l))); E.migrateExt(x); return x; };
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
function crook(o = {}) {
  const l = E.createLife({ mode: 'vn', seed: o.seed || 9179, year: 1980 });
  Object.assign(l, { age: o.age || 30, indep: true, alive: true, school: null, pending: [], sched: [], jailUntil: null, abroad: null, money: l.base * (o.money == null ? 30 : o.money) });
  l.flags.military = 0; l.st.hea = 80; E.startJob(l, o.job || 'doi_no', H.rf(l), () => {}); E.migrateExt(l); CR.state(l);
  if (o.rank != null) l.job.rank = o.rank;
  return l;
}
function seeded(n) { let x = (n * 2654435761) >>> 0 || 1; return () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
const LEADHOOK = E.HOOKS.year.find(f => /crimeLeader912/.test(f.toString()) && /crisisChance/.test(f.toString()));
ok(!!LEADHOOK, 'leadership hook registered once');
ok(E.HOOKS.year.filter(f => /crimeLeader912/.test(f.toString()) && /crisisChance/.test(f.toString())).length === 1, 'hook not duplicated');
function apply(l, id, key, r) { const d = l.pending.find(x => x.id === id); assert(d, 'pending ' + id + ' in ' + l.pending.map(x => x.id).join(',')); assert(d.opts.some(o => o.k === key), id + ' has ' + key + ' in ' + d.opts.map(o => o.k).join(',')); assert(E.DEC[id].valid(l, d.data), id + ' valid'); E.DEC[id].apply(l, d, key, r || (() => 0), say(l)); l.pending = l.pending.filter(x => x !== d); return d; }
function forceCrisis(l, r) { const s = C9.state(l); s.pressure = 90; s.disputes = 4; s.cohesion = 50; const g = CR.group(l); g.yearAt = null; LEADHOOK(l, r || (() => 0), say(l)); }

// 1. Người theo nhóm có một người cầm đầu ổn định (không reroll khi tải lại); người đứng đầu thì không.
{
  const l = crook(); LEADHOOK(l, () => .99, say(l)); const b = CR.group(l).boss;
  ok(b && b.name && b.trait && b.trust >= 35, 'subordinate has an NPC boss with traits');
  const l2 = reload(l); ok(CR.group(l2).boss.id === b.id && CR.group(l2).boss.name === b.name, 'boss identity survives reload');
  CR.group(l).yearAt = null; LEADHOOK(l, () => .99, say(l)); ok(CR.group(l).boss.id === b.id, 'boss not regenerated each year');
  const top = crook({ seed: 9180 }); top.job.rank = E.jobDef(top).t.length - 1; LEADHOOK(top, () => .99, say(top)); ok(!CR.group(top).boss && CR.isLeader(top), 'leader has no boss above');
}
// 2. Xác suất khủng hoảng phụ thuộc hoàn cảnh và có trần; nhóm yên ổn vẫn có thể không có biến cố.
{
  const calm = crook({ seed: 9181 }), hot = crook({ seed: 9181 });
  Object.assign(C9.state(calm), { pressure: 5, disputes: 0, cohesion: 80 }); Object.assign(C9.state(hot), { pressure: 90, disputes: 5, cohesion: 30 });
  ok(CR.crisisChance(hot) > CR.crisisChance(calm) * 2, 'pressure and disputes raise crisis chance');
  ok(CR.crisisChance(hot) <= CR.LEAD.crisisMax && CR.crisisChance(calm) > 0, 'chance is bounded, never certain');
  let quiet = 0; for (let s = 0; s < 200; s++) { const l = crook({ seed: 92000 + s }); Object.assign(C9.state(l), { pressure: 10, disputes: 0, cohesion: 70 }); for (let y = 0; y < 5; y++) { CR.group(l).yearAt = null; l.age++; LEADHOOK(l, seeded(s * 7 + y), say(l)); l.pending = []; if (CR.group(l).crisis) CR.group(l).crisis = null; } if (!CR.group(l).history.some(h => /tạm giữ|rút lui|mất uy tín/.test(h.t))) quiet++; }
  ok(quiet > 100 && quiet < 200, 'many calm crews pass five years without a leadership crisis, but not all (' + quiet + '/200)');
}
// 3. Đổi lãnh đạo hai giai đoạn: ủng hộ người kế nhiệm → năm sau điều kiện đóng góp → thu nhập giảm đúng một lần.
{
  const l = crook({ seed: 9182 }); LEADHOOK(l, () => .99, say(l)); forceCrisis(l, () => 0);
  const c = CR.group(l).crisis; ok(c && c.stage === 1 && c.kind !== 'challenge', 'crisis opened for a subordinate');
  const before = E.careerYear(l, () => .5, () => {});
  apply(l, 'crimeLeader912', 'back'); ok(CR.group(l).boss.id === c.cand.id && CR.group(l).crisis.stage === 2, 'successor installed, follow-up scheduled');
  ok(!E.DEC.crimeLeader912.valid(l, { cid: c.id, stage: 1 }), 'old stage-1 decision cannot be replayed');
  CR.group(l).yearAt = null; LEADHOOK(l, () => .99, say(l)); ok(!l.pending.some(x => x.id === 'crimeLeader912'), 'no follow-up in the same year');
  l.age++; CR.group(l).yearAt = null; LEADHOOK(l, () => .99, say(l)); ok(l.pending.some(x => x.id === 'crimeLeader912'), 'follow-up arrives in a later year');
  const d = l.pending.find(x => x.id === 'crimeLeader912'); ok(d.data.stage === 2, 'follow-up is stage 2');
  l.age++; CR.group(l).yearAt = null; LEADHOOK(l, () => .99, say(l));
  ok(l.pending.filter(x => x.id === 'crimeLeader912').length === 1, 'no duplicate pending decision');
  apply(l, 'crimeLeader912', 'accept'); ok(!CR.group(l).crisis && CR.group(l).boss.demand === CR.LEAD.demand, 'crisis closed with a lasting contribution');
  const after = E.careerYear(l, () => .5, () => {}); ok(after > 0 && Math.abs(after / before - (1 - CR.LEAD.demand)) < 0.05, 'contribution reduces career income once (' + (after / before).toFixed(3) + ')');
  ok(CR.group(reload(l)).boss.demand === CR.LEAD.demand && CR.group(reload(l)).history.length >= 2, 'history and terms survive reload');
}
// 4. Tranh vị trí: thành công lên đầu nhóm, thất bại thì mâu thuẫn tăng; không bảo đảm.
{
  let win = 0, lose = 0;
  for (let s = 0; s < 60; s++) {
    const l = crook({ seed: 93000 + s, rank: 1 }); LEADHOOK(l, () => .99, say(l)); forceCrisis(l, () => 0); const d0 = C9.state(l).disputes;
    apply(l, 'crimeLeader912', 'claim', seeded(s));
    if (CR.isLeader(l)) { win++; ok(!CR.group(l).boss, 'winner has no boss'); } else { lose++; ok(C9.state(l).disputes === d0 + 2 && CR.group(l).boss.trust === 15, 'failed claim leaves lasting tension'); }
  }
  ok(win > 0 && lose > 0, 'claiming leadership can succeed or fail (' + win + '/' + lose + ')');
  const rookie = crook({ seed: 93100, rank: 0 }); LEADHOOK(rookie, () => .99, say(rookie)); forceCrisis(rookie, () => 0);
  ok(!rookie.pending.find(x => x.id === 'crimeLeader912').opts.some(o => o.k === 'claim'), 'newcomer cannot claim leadership');
}
// 5. Người đứng đầu bị thách thức: giữ vị trí hoặc mất một bậc; người thách thức là đàn em thật.
{
  const l = crook({ seed: 9183 }); l.job.rank = E.jobDef(l).t.length - 1;
  C9.state(l).crew.push({ id: 'x1', name: 'Người Thách', trust: 30, status: 'active', since: l.age, role912: 'logistics', skill912: 90, trait912: 'liều lĩnh', cut912: 6, hist912: [] });
  forceCrisis(l, () => 0); const c = CR.group(l).crisis;
  ok(c.kind === 'challenge' && c.cand.id === 'x1', 'challenger drawn from real crew');
  apply(l, 'crimeLeader912', 'stand', () => .999);
  ok(!CR.isLeader(l) && CR.group(l).boss.id === 'x1' && C9.state(l).crew.find(p => p.id === 'x1').status === 'separated', 'losing the challenge demotes one rank and the challenger leads');
  ok(l.job.rank === E.jobDef(l).t.length - 2, 'demotion is exactly one rank');
}
// 6. Tan rã: chỉ khi gắn kết thấp và mâu thuẫn nhiều; giữ lại người tin, có thời gian chờ trước lần sau.
{
  const l = crook({ seed: 9184 });
  [['a', 80], ['b', 55], ['c', 20], ['d', 10]].forEach(([id, t]) => C9.state(l).crew.push({ id, name: id, trust: t, status: 'active', since: l.age, role912: 'guard', skill912: 50, trait912: 'cẩn thận', cut912: 8, hist912: [] }));
  Object.assign(C9.state(l), { cohesion: 15, disputes: 4, pressure: 10 }); CR.group(l).yearAt = null; LEADHOOK(l, () => .99, say(l));
  ok(l.pending.some(x => x.id === 'crimeSplit912'), 'split decision raised under real breakdown');
  apply(l, 'crimeSplit912', 'regroup'); const left = CR.crew(l).map(p => p.id).sort().join(',');
  ok(left === 'a,b' && C9.state(l).disputes === 0, 'only trusting members stay');
  Object.assign(C9.state(l), { cohesion: 10, disputes: 5 }); l.age++; CR.group(l).yearAt = null; LEADHOOK(l, () => .99, say(l));
  ok(!l.pending.some(x => x.id === 'crimeSplit912'), 'cooldown prevents an immediate second split');
  const ok2 = crook({ seed: 9185 }); Object.assign(C9.state(ok2), { cohesion: 60, disputes: 4 }); CR.group(ok2).yearAt = null; LEADHOOK(ok2, () => .99, say(ok2));
  ok(!ok2.pending.some(x => x.id === 'crimeSplit912'), 'cohesive crew does not dissolve');
  const out = crook({ seed: 9186 }); Object.assign(C9.state(out), { cohesion: 10, disputes: 5 }); CR.group(out).yearAt = null; LEADHOOK(out, () => .99, say(out));
  apply(out, 'crimeSplit912', 'legit'); ok(!E.isCrime(out) && CR.crew(out).length === 0, 'leaving through dissolution ends the crime job');
}
// 7. Trong trại: không có biến động lãnh đạo; người cầm đầu mất dần lòng tin.
{
  const l = crook({ seed: 9187 }); LEADHOOK(l, () => .99, say(l)); const t0 = CR.group(l).boss.trust;
  H.jail(l, 4, 'thử', say(l)); CR.group(l).yearAt = null; l.age++; LEADHOOK(l, () => 0, say(l));
  ok(!l.pending.some(x => /crime(Leader|Split)912/.test(x.id)) && CR.group(l).boss.trust < t0, 'no leadership events while imprisoned');
}
// 8. Hỗ trợ pháp lý: một đề nghị mỗi bản án, kết quả sau ít nhất một năm, tối đa giảm một năm, không mãn hạn ngay.
{
  const l = crook({ seed: 9188, money: 0.5 }); H.jail(l, 6, 'vụ thử', say(l)); const until = l.jailUntil;
  ok(CR.legalAsk(l) && E.DEC.tg_phap_ly912.valid(l, {}), 'request available while serving');
  let pool = E.jailYear(l, () => 0, l.age); ok(pool.some(x => x[0] === 'tg_phap_ly912'), 'request offered through the prison event pool');
  const d = E.DEC.tg_phap_ly912.make(l, () => 0); ok(d.opts.some(o => o.k === 'aid') && !d.opts.some(o => o.k === 'lawyer'), 'poor inmate gets free aid, cannot afford lawyer');
  E.DEC.tg_phap_ly912.apply(l, d, 'aid', () => 0, say(l));
  ok(!CR.legalAsk(l) && !CR.legalDue(l), 'one request per sentence; no result in the same year');
  const l2 = reload(l); ok(CR.legal(l2)[CR.currentSentence(l2).id].status === 'review', 'pending review survives reload');
  l.age++; ok(CR.legalDue(l) && E.jailYear(l, () => .99, l.age).some(x => x[0] === 'tg_phap_ly912_kq'), 'result arrives next year through the pool');
  const k = E.DEC.tg_phap_ly912_kq.make(l, () => 0); E.DEC.tg_phap_ly912_kq.apply(l, k, 'read', () => 0, say(l));
  ok(l.jailUntil === until - 1 && CR.currentSentence(l).until === l.jailUntil, 'success reduces exactly one year and updates the ledger');
  ok(!CR.legalDue(l) && !E.DEC.tg_phap_ly912_kq.valid(l, {}), 'result cannot be applied twice');
  const s = crook({ seed: 9189, money: 0.5 }); H.jail(s, 2, 'án ngắn', say(s)); s.age++;
  ok(!CR.legalAsk(s), 'no request with less than two years left');
  // Thống kê: tỉ lệ được giảm án có giới hạn, phụ thuộc hình thức và điểm thi đua.
  const rate = (kind, pts) => { let n = 0; for (let i = 0; i < 300; i++) { const x = crook({ seed: 94000 + i, money: kind === 'lawyer' ? 30 : 0.5 }); H.jail(x, 6, 'thống kê', () => {}); x.flags.jailPts = pts; const dd = E.DEC.tg_phap_ly912.make(x, () => 0); E.DEC.tg_phap_ly912.apply(x, dd, kind, () => 0, () => {}); x.age++; const kk = E.DEC.tg_phap_ly912_kq.make(x, () => 0); const u = x.jailUntil; E.DEC.tg_phap_ly912_kq.apply(x, kk, 'read', seeded(i + 1), () => {}); if (x.jailUntil < u) n++; ok(x.jailUntil > x.age, 'never released on the spot'); } return n / 300; };
  const self0 = rate('self', 0), aid0 = rate('aid', 0), aid5 = rate('aid', 5), law0 = rate('lawyer', 0);
  ok(self0 < aid0 && aid0 < aid5 && aid0 <= law0 + 0.05 && aid5 <= 0.62, 'reduction rate depends on form and conduct, bounded (self ' + self0.toFixed(2) + ', aid ' + aid0.toFixed(2) + ', aid+pts ' + aid5.toFixed(2) + ', lawyer ' + law0.toFixed(2) + ')');
  const rich = crook({ seed: 9190, money: 30 }); H.jail(rich, 5, 'thuê luật sư', () => {}); const m0 = rich.money; const dl = E.DEC.tg_phap_ly912.make(rich, () => 0); E.DEC.tg_phap_ly912.apply(rich, dl, 'lawyer', () => 0, () => {});
  ok(Math.abs(m0 - rich.money - rich.base * CR.LEGAL.lawyerCost) < 1e-6, 'lawyer fee charged once');
  E.DEC.tg_phap_ly912.apply(rich, dl, 'lawyer', () => 0, () => {}); ok(Math.abs(m0 - rich.money - rich.base * CR.LEGAL.lawyerCost) < 1e-6, 'double click does not charge twice');
}
// 9. Bản lưu cũ không có group/legal vẫn chạy; migrate hai lần không đổi dữ liệu.
{
  const l = crook({ seed: 9191 }); delete l.flags.crime912.group; delete l.flags.crime912.legal;
  const a = reload(l), b = reload(a); ok(JSON.stringify(a.flags.crime912) === JSON.stringify(b.flags.crime912), 'migration idempotent');
  CR.group(a).yearAt = null; LEADHOOK(a, () => .99, say(a)); ok(!!CR.group(a).boss, 'old save gains a boss lazily on the next year');
}
// 10. Đời tự chơi: không lỗi, không treo quyết định.
{
  for (let s = 0; s < 25; s++) {
    const l = crook({ seed: 95000 + s, age: 24 });
    E.runHeadless(l);
    ok(l.log.every(e => typeof e.t === 'string' && !/undefined|NaN/.test(e.t)), 'clean log in auto-play ' + s);
  }
}
console.log('PASS crime917: ' + count + ' checks (leadership, dissolution, legal aid, saves).');
