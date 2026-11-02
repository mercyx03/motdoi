/* 8.10.20 Phần C tiếp: phiếu lương, ngân sách hộ, nghỉ ốm, đào tạo lại, nhà ở xã hội, giao thông, thuế TNDN, biến cố kinh tế,
   hộ chiếu/visa du lịch; kèm bảo vệ hồi quy cho hai lỗi 8.10.19 (RNG tương quan theo năm, migration chạy lại mỗi năm). */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, R = E.ERA917, C = E.ECON918, T = E.TRAVEL918, D = E.DRAMA917, CH = E.CHAIN144;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
const quiet = () => {}, near = (a, b, e) => Math.abs(a - b) < (e || 1e-6);
function life(seed, o) { const l = E.createLife({ mode: 'vn', seed }); Object.assign(l, { age: 30, indep: true, school: null, schoolEnd: null, pending: [], sched: [], money: l.base * 20 }, o || {}); l.flags.military = 0; return l; }
function hooks(l) { E.HOOKS.year.forEach(h => { try { h(l, () => .5, quiet, l.age - 1); } catch (e) { } }); }
function year(l) {
  E.beginYear(l, { auto: true });
  for (let k = 0; l.pending.length && l.alive && k < 60; k++) E.resolve(l, E.autoKey(l));
  if (!l.alive) return; E.finishYear(l);
  for (let k = 0; l.pending.length && l.alive && k < 60; k++) E.resolve(l, E.autoKey(l));
  E.endYear(l);
}
ok(C && T && R && D, 'modules loaded');
['payslip918', 'budget918', 'sick918', 'retrain918', 'housing918', 'housingOffer918', 'lez918', 'biztax918', 'passport918', 'd918_squeeze_1', 'd918_eldercare_1', 'd918_reskill_1'].forEach(id => ok(!!E.DEC[id], 'decision ' + id));

// ---------- C4 phiếu lương ----------
{
  ok(near(E.siCap918({ birthYear: 2000, age: 25 }), 46.8) && near(E.siCap918({ birthYear: 2000, age: 26 }), 48.7) && near(E.siCap918({ birthYear: 2000, age: 27 }), 50.6), 'insurance basis cap = 20 x reference wage by year');
  let checked = 0;
  for (let s = 0; s < 40 && checked < 6; s++) {
    const l = life(918100 + s, { age: 28 }); E.startJob(l, 'cong_chuc', () => .5, quiet, true); year(l);
    const p = C.slip(l); if (!p || !p.taxed) continue; checked++;
    ok(near(p.parts.bhxh + p.parts.bhyt + p.parts.bhtn, p.si, 1e-6), 'fund parts add up to insurance');
    ok(near(p.parts.bhxh / p.si, 8 / 10.5, 1e-9) && near(p.parts.bhtn / p.si, 1 / 10.5, 1e-9), 'fund shares 8 / 1.5 / 1');
    ok(near(p.net, p.gross - p.si - p.tax - p.adj, 1e-6), 'net = gross - insurance - tax - game adjustment'); ok(near(p.net, l.income, 1e-6), 'payslip net equals cash income credited this year');
    const row = l.flags.tax909.history.slice(-1)[0]; ok(near(row.tax, p.tax) && near(row.gross, p.gross), 'payslip reads tax909 row, no second calculation');
    ok(p.si <= E.siCap918(Object.assign({}, l, { age: row.age })) * 12 * 0.105 + 1e-6, 'insurance respects basis cap');
    ok(E.DEC.payslip918.make(l, () => .5, {}).text.includes('BHTN 1%'), 'payslip screen lists each fund');
  }
  ok(checked >= 3, 'payslips checked (' + checked + ')');
  // Thu nhập cao bị life115 nén sau thuế: phiếu lương phải ghi dòng điều chỉnh để thực nhận khớp tiền vào sổ.
  const hi = life(918190, { age: 40, edu: 5, major: 'eco', urban: true }); E.startJob(hi, 'trung_uong', () => .5, quiet, true); Object.assign(hi.job, { rank: 6, rankTracked: 6, rankSince: 40, yrs: 12, sen: 12, rep: 78 }); E.STATE174.syncState(hi); hi.si = { yrs: 16, sum: 300, last: 39, m: 20 };
  E.beginYear(hi, { auto: true }); while (hi.pending.length) E.resolve(hi, E.autoKey(hi)); E.finishYear(hi);
  const ps = C.slip(hi); ok(ps.adj > 0 && near(ps.net, hi.income, 1e-6), 'high earner: payslip net equals cash income after the sustainable-income adjustment');
  hi.yr = { items: [] }; hi.age++; const ps2 = C.slip(hi); ok(ps2.adj > 0 && near(ps2.net, hi.income, 1e-6), 'last year payslip still reconciles when viewed in the next year');
}
// ---------- C3 ngân sách hộ, áp lực giá ----------
{
  let shocks = 0; const p = [];
  for (let y = 2027; y < 2227; y++) { const m = R.macro('VN', y); if (m.shock) shocks++; }
  ok(shocks >= 6 && shocks <= 30, 'inflation-shock years are occasional (' + shocks + '/200)');
  const a = life(918201), b = life(918202);
  for (let k = 0; k < 60; k++) { a.age = b.age = 20 + k; const x = C.pressure(a), y = C.pressure(b); ok(near(x, y), 'same country-year pressure for every life'); ok(x >= -0.02 - 1e-12 && x <= 0.05 + 1e-12, 'pressure bounded'); p.push(x); }
  const l = life(918203); l.birthYear = 2026 - l.age; l.loans = [{ type: 'bank', name: 'vay', bal: 50, rate: .09, minShare: .12, late: 0, since: 29 }]; const money0 = l.money;
  const F = { food: 100, rent: 20, travel: 10, kids: 0, health: 0, items: [] }; E.livingCost918(l, F);
  ok(near(F.food, 100 * (1 + C.pressure(l)), 1e-9) && F.rent === 20 && F.travel === 10, 'essentials scaled by this year pressure only'); const B = { food: 100, rent: 20 }; E.budget114(l, B); ok(B.food === 100 || l.flags.budget114, 'life114 budget hook contract unchanged');
  ok(l.money === money0 && l.loans[0].bal === 50, 'cash and nominal debt untouched by price index');
  const s = C.state(l); s.budget.auto = true; l.money = 0; l.fin = { food: 30, rent: 5, travel: 2, kids: 0, health: 0 }; l.spend = 'normal'; hooks(l);
  ok(s.budget.cutAt === l.age && E.lifestyleFactor(l) <= 0.82 + 1e-9, 'auto cut applies when emergency fund is short');
  l.age++; l.money = l.base * 100; hooks(l); l.age++; hooks(l); ok(s.budget.cutAt == null && E.lifestyleFactor(l) === 1, 'cut lifted once fund recovers');
  const d = E.DEC.budget918.make(l, () => .5, {}); ok(/Quỹ khẩn cấp/.test(d.text) && /không bị quy đổi/.test(d.text), 'budget screen explains fund and nominal ledger');
}
// ---------- C5 nghỉ ốm ----------
{
  let n = 0;
  for (let s = 0; s < 30 && n < 4; s++) {
    const l = life(918300 + s, { age: 35 }); E.startJob(l, 'cong_chuc', () => .5, quiet, true); l.si = { yrs: 16, sum: 100, last: 34, m: 10 }; l.yr = { gross: 240, si: 25, items: [] };
    l.ill = 'cúm nặng'; l.pending = []; hooks(l); const d = l.pending.find(x => x.id === 'sick918'); if (!d) continue; n++;
    ok(d.data.ent === 40, 'entitlement 40 days for 15–30 contribution years');
    const paid = Math.min(d.data.days, 40), loss = 240 / 12 / 24 * (paid * 0.25 + (d.data.days - paid));
    ok(near(d.data.loss, loss, 1e-9), 'sick-leave loss = 25% of covered days + unpaid days (independent formula)');
    const m0 = l.money; l.pending = [d]; E.resolve(l, 'rest'); ok(near(m0 - l.money, loss, 1e-9), 'resting deducts exactly the loss');
    const m1 = l.money; E.DEC.sick918.apply(l, d, 'rest', () => .5, quiet); ok(l.money === m1, 'same sick decision cannot be applied twice');
    l.pending = []; hooks(l); ok(!l.pending.some(x => x.id === 'sick918'), 'one sick decision per year');
  }
  ok(n >= 3, 'sick leave decisions appeared (' + n + ')');
  let un = null; for (const id of Object.keys(E.CAR)) { const t = life(918399, { age: 35 }); E.startJob(t, id, () => .5, quiet, true); if (t.job && E.H.isEmployee(t) && !E.insured(t)) { un = t; break; } } ok(!!un, 'found an uninsured wage job'); un.si = null; un.yr = { gross: 120, items: [] }; un.ill = 'sốt'; un.pending = []; hooks(un);
  const du = un.pending.find(x => x.id === 'sick918'); if (du) ok(!du.data.ins && near(du.data.loss, 120 / 12 / 24 * du.data.days, 1e-9) && !du.opts.some(o => o.k === 'half'), 'uninsured: unpaid days, no half-day option');
}
// ---------- C5 đào tạo lại ----------
{
  const l = life(918400, { age: 40, job: null, edu: 2 }); l.si = { yrs: 3, last: 38, m: 8 };
  const d = E.DEC.retrain918.make(l, () => .5, {}); d.manual = true; l.pending = [d]; const i = d.data.keys.indexOf('cook'); ok(i >= 0, 'course listed');
  const m0 = l.money; E.resolve(l, String(i)); const s = C.state(l);
  ok(s.retrain && s.retrain.k === 'cook' && near(m0 - l.money, l.base * 0.05 * 0.4, 1e-9), 'BHTN contributor pays 40% (simulated support share)');
  const d2 = E.DEC.retrain918.make(l, () => .5, {}); ok(!d2.opts.some(o => o.k === String(d2.data.keys.indexOf('driver'))), 'second course blocked while one is running');
  hooks(l); ok(!s.retrain.done, 'not finished in the same year'); l.age++; hooks(l); ok(s.retrain.done && s.skills.some(x => x.k === 'cook'), 'finished next year');
  const off = E.offers(l, () => .5); ok(!E.jobEligible(l, E.CAR.dau_bep) || off.includes('dau_bep'), 'job search offers the retrained trade when eligible');
}
// ---------- C6 nhà ở xã hội ----------
{
  const l = life(918500, { age: 32, urban: true }); l.ownHouse = false; l.partner = null; l.yr = { gross: 25 * 12, items: [] }; l.income = 25 * 12;
  ok(/vượt 20 triệu/.test(String(C.housingWhy(l))), 'single income above 20 million is ineligible');
  l.yr = { gross: 15 * 12, items: [] }; l.income = 15 * 12; ok(C.housingWhy(l) === true, 'single income 15 million eligible');
  let d = E.DEC.housing918.make(l, () => .5, {}); d.manual = true; l.pending = [d]; E.resolve(l, String(d.data.keys.indexOf('apply')));
  const h = C.state(l).housing; ok(h && h.status === 'waiting' && h.due - l.age >= 1 && h.due - l.age <= 5, 'application waits 1–5 years');
  d = E.DEC.housing918.make(l, () => .5, {}); ok(!d.opts.some(o => o.k === String(d.data.keys.indexOf('apply'))), 'cannot apply twice');
  l.age = h.due; l.pending = []; hooks(l); const offer = l.pending.find(x => x.id === 'housingOffer918'); ok(!!offer, 'offer arrives when due');
  l.money = offer.data.price; const loans0 = (l.loans || []).length; l.pending = [offer]; E.resolve(l, 'buy');
  ok(l.ownHouse && C.state(l).housing.status === 'owner' && C.state(l).housing.noSaleUntil === l.age + 5, 'bought with 5-year resale lock recorded');
  const loan = l.loans.find(x => x.social918); ok(loan && loan.rate === 0.054 && near(loan.bal, offer.data.price * 0.8, 1e-9) && l.loans.length === loans0 + 1, 'NHCSXH loan 80% at 5.4%');
  ok(near(l.money, offer.data.price * 0.8, 1e-9), 'down payment 20% paid from cash, loan credited once');
  const m = l.money; E.DEC.housingOffer918.apply(l, offer, 'buy', () => .5, quiet); ok(l.money === m && l.loans.length === loans0 + 1, 'offer cannot be accepted twice');
  const t = life(918501, { age: 32, urban: true }); t.ownHouse = false; t.yr = { gross: 120, items: [] }; t.income = 120; C.state(t).housing = { status: 'waiting', applied: 30, due: 32 }; t.pending = []; hooks(t);
  const o2 = t.pending.find(x => x.id === 'housingOffer918'); t.pending = [o2]; E.resolve(t, 'rent'); const F = { food: 10, rent: 4, items: [] }; E.livingCost918(t, F); ok(near(F.rent, 2 * (E.WELFARE918 ? E.WELFARE918.sectors(t).housing : 1), 1e-9), 'social rent halves market rent (then housing index)');
  const r2 = life(918502, { age: 32, urban: true }); r2.ownHouse = false; r2.yr = { gross: 30 * 12, items: [] }; r2.income = 360; C.state(r2).housing = { status: 'waiting', applied: 30, due: 32 }; r2.pending = []; hooks(r2);
  const o3 = r2.pending.find(x => x.id === 'housingOffer918'); ok(o3 && !o3.data.ok && !o3.opts.some(o => o.k === 'buy'), 're-checked at offer: no longer eligible');
}
// ---------- C7 giao thông ----------
{
  const l = life(918600, { age: 40, urban: true }); l.prov = { neu: 'Hà Nội', old: 'Hà Nội', kind: 'Thành phố' }; l.veh = 'xe máy'; l.vehK = 'wave'; l.vehName = 'Honda Wave'; l.birthYear = 1990;
  ok(C.lezPhase(2025) === 0 && C.lezPhase(2026) === 1 && C.lezPhase(2028) === 2 && C.lezPhase(2031) === 3, 'LEZ phases follow Hanoi plan');
  const base = E.vehicleAnnual(l).total; const d = E.DEC.lez918.make(l, () => .5, { at: l.age, ph: 3 }); l.pending = [d]; E.resolve(l, 'bus');
  ok(near(E.vehicleAnnual(l).total - base, l.base * 0.08, 1e-9) && near(E.travelCost(l), E.vehicleAnnual(l).total, 1e-9), 'bus mode adds commuting cost to engine travel cost');
  const e = life(918601, { age: 40, urban: true }); e.prov = l.prov; e.veh = 'xe máy'; e.vehK = 'wave'; e.birthYear = 1990; const d2 = E.DEC.lez918.make(e, () => .5, { at: e.age, ph: 3 }); e.pending = [d2]; E.resolve(e, 'ev');
  ok(E.vehicleAnnual(e).ev && !E.vehicleAnnual(e).lez918, 'electric bike: no LEZ extra');
  let affected = 0; for (let s = 0; s < 400; s++) { const x = life(919000 + s, { age: 40, urban: true }); x.prov = l.prov; x.veh = 'xe máy'; x.vehK = 'wave'; x.birthYear = 1991; x.pending = []; hooks(x); if (x.pending.some(p => p.id === 'lez918')) affected++; }
  ok(affected > 120 && affected < 400, 'about 70% of petrol-bike Hanoi residents affected by 2031 phase (' + affected + '/400)');
  const old = life(918602, { age: 65, urban: true }); old.veh = null; old.rentVeh = null; R.state(old).scen = 'expanded'; const f = R.state(old).eff.sim_free_bus;
  old.birthYear = f - 65; R.state(old).scen = 'reform'; const before = E.vehicleAnnual(old).fuel; R.state(old).scen = 'expanded'; const after = E.vehicleAnnual(old).fuel; old.birthYear = f - 66; ok(!E.vehicleAnnual(old).freeBus918, 'no free bus the year before'); old.birthYear = f - 65;
  ok(near(after, before * 0.2, 1e-9) && E.vehicleAnnual(old).freeBus918, 'expanded scenario free bus for 60+ from its effective year');
}
// ---------- C7 thuế TNDN ----------
{
  ok(C.cit(2.9, 100).rate === 0.15 && C.cit(3, 100).rate === 0.17 && C.cit(50, 100).rate === 0.17 && C.cit(50.1, 100).rate === 0.2, 'CIT rate bands 15/17/20');
  const q = C.cit(10, 100, 10); ok(near(q.extraDeduct, 5) && near(q.saved, 5 * 0.17) && near(q.tax, 95 * 0.17), '150% commute expense: extra 50% reduces taxable income only');
  const cap = C.cit(10, 100, 1000); ok(near(cap.extraDeduct, 10), 'extra deduction capped at 10% of profit');
  ok(C.cit(10, -50, 10).tax === 0 && C.cit(10, -50, 10).saved === 0, 'no refund on a loss');
}
// ---------- C11 biến cố kinh tế ----------
{
  let y = 2030; while (!R.macro('VN', y).shock) y++;
  const l = life(918700, { age: 35 }); l.birthYear = y - 35; l.partner = { name: 'An', alive: true, status: 'married', inc: 10 };
  const c = D.candidates(l).map(x => x[0]); ok(c.includes('d918_squeeze'), 'shock year offers the household squeeze chain');
  const ch = CH.start(l, 'd918_squeeze', { dec: 'drama917', k: 't' }, { npc: { ref: null, name: '' }, data: { y } }); c && ok(!!ch, 'squeeze chain started');
  const dd = E.DEC.d918_squeeze_1.make(l, () => .5, { cid: ch.id, token: 't' }); ch.open = { at: l.age, token: 't' }; l.pending = [dd]; E.resolve(l, 'cut');
  ok(C.state(l).budget.cutAt === l.age + 1 && E.lifestyleFactor(l) <= 0.82 + 1e-9, 'cutting spending lowers lifestyle factor for two years');
  const g = life(918701, { age: 50 }); g.fam.mAlive = true; g.fam.mAge = 30; ok(!D.candidates(g).some(x => x[0] === 'd918_eldercare'), 'eldercare is not a second independent trigger');
  const cd = E.DEC.care.make(g, () => .5); g.pending = [cd]; E.resolve(g, 'yes'); const ec = CH.active(g, 'd918_eldercare'); ok(ec && ec.data.path === 'yes' && ec.data.who === 'mẹ', 'engine care decision continues as a multi-year eldercare chain');
  g.fam.mAlive = false; CH.yearly(g, () => .5, quiet, g.age); ok(!CH.active(g, 'd918_eldercare'), 'chain closes when the parent dies');
  let total = 0; for (let s = 0; s < 40; s++) { const x = E.createLife({ mode: 'vn', seed: 918800 + s * 13 }); E.runHeadless(x); const st = x.flags.chains144; if (st) total += (st.done || []).concat(st.active || []).filter(k => /^d918_/.test(k.kind)).length; ok(!st || st.active.filter(k => /^d91[78]_/.test(k.kind)).length <= 2, 'shared cap of 2 drama chains'); }
  ok(total > 0, 'economy chains occur in full lives (' + total + ')');
}
// ---------- C9 hộ chiếu và visa du lịch ----------
{
  const l = life(918900, { age: 25 }); l.job = { id: 'cong_chuc', rank: 1, since: 22 };
  ok(T.why(l, 'TH') !== true && /hộ chiếu/.test(T.why(l, 'TH')), 'no passport → cannot travel abroad');
  let d = E.DEC.passport918.make(l, () => .5, {}); d.manual = true; l.pending = [d]; E.resolve(l, String(d.data.keys.indexOf('pp')));
  ok(T.state(l).pending && !T.passport(l), 'passport pending, not issued yet');
  l.age++; hooks(l); const p = T.passport(l); ok(p && p.until - p.issued === 10, 'adult passport 10 years');
  ok(T.entry(l, 'TH').kind === 'free' && T.entry(l, 'US').kind === 'visa' && T.why(l, 'TH') === true, 'ASEAN visa-free, US needs visa');
  const m0 = l.money, r1 = T.decide(l, 'US', quiet), m1 = l.money, r2 = T.decide(l, 'US', quiet);
  if (r1 === true) ok(r2 === true && m1 === m0, 'approved visa reused within the year, no second fee');
  else ok(typeof r2 === 'string' && l.money === m1 && m0 - m1 > 0, 'denied once per year: fee charged once, no reroll');
  const seen = new Set(); for (let k = 0; k < 5; k++) seen.add(T.roll(l, 'GB')); ok(seen.size === 1, 'visa roll fixed for the year');
  const fam = life(918901, { age: 35 }); fam.kids = [{ name: 'Bi', sex: 'M', born: 30, alive: true }]; fam.flags.travel918 = { passport: { cc: 'VN', issued: 34, until: 44 }, visas: {}, denied: {}, trips: [] };
  R.kidRec(fam, fam.kids[0]); let fd = E.DEC.passport918.make(fam, () => .5, {}); const fi = fd.data.keys.indexOf('fam:TH');
  ok(fi >= 0 && !fd.opts.some(o => o.k === String(fi)), 'family trip blocked while child has no passport');
  R.kidRec(fam, fam.kids[0]).passports.push({ cc: 'VN', issued: 4, until: 9 }); fd = E.DEC.passport918.make(fam, () => .5, {}); fd.manual = true; fam.pending = [fd];
  ok(fd.opts.some(o => o.k === String(fd.data.keys.indexOf('fam:TH'))), 'family trip allowed with child passport'); E.resolve(fam, String(fd.data.keys.indexOf('fam:TH')));
  ok(T.state(fam).trips.slice(-1)[0].kids === 1, 'trip recorded with child');
  const old = life(918902, { age: 40 }); old.flags.abroadDepth900 = { files: {}, history: [{ age: 30, text: 'Du lịch' }], used: {} }; delete old.flags.travel918v; delete old.flags.travel918; E.migrateExt(old);
  ok(T.passport(old) && T.passport(old).inferred, 'old save with travel history keeps a passport');
  const n0 = life(918903, { age: 40 }); delete n0.flags.travel918v; E.migrateExt(n0); ok(!T.passport(n0), 'old save without travel gets no free passport');
  E.migrateExt(old); ok(T.passport(old).until === old.age + 5, 'passport migration runs once');
}
// ---------- bảo vệ hồi quy 8.10.19 ----------
{
  // (1) RNG theo năm không tương quan: Nhiều biến động 25 năm hầu như luôn có chuyện.
  let none = 0;
  for (let s = 0; s < 60; s++) { const l = life(918950 + s, { age: 35 }); l.job = { id: 'van_phong', rank: 1, since: 30 }; D.state(l).mode = 'eventful'; let n = 0; for (let a = 35; a < 60; a++) { l.age = a; if (D.tryStart(l, quiet)) n++; } if (!n) none++; }
  ok(none <= 2, 'eventful lives without any chain over 25 years: ' + none + '/60');
  // (2) migrateExt chạy lại mỗi năm không biến con mới sinh thành "con bản lưu cũ".
  const l = life(918990, { sex: 'F', age: 30 }); E.startJob(l, 'cong_chuc', () => .5, quiet, true); l.si = { yrs: 5, last: 29, m: 10 };
  for (let k = 0; k < 3; k++) E.migrateExt(l);
  l.kids = [{ name: 'Mới', sex: 'F', born: 30, alive: true }]; E.migrateExt(l); hooks(l); E.migrateExt(l);
  ok(l.kids[0].mat917 && !l.kids[0].mat917.legacy && l.kids[0].mat917.lump > 0, 'newborn after repeated migrations still gets the lump sum');
}
// ---------- lưu/tải ----------
{
  const l = life(918999, { age: 33, urban: true }); l.yr = { gross: 120, items: [] }; l.income = 120; C.state(l).housing = { status: 'waiting', applied: 31, due: 34 }; C.state(l).budget.auto = true; T.state(l).passport = { cc: 'VN', issued: 30, until: 40 };
  const copy = JSON.parse(JSON.stringify(l)); E.migrateExt(copy);
  ok(JSON.stringify(copy.flags.econ918) === JSON.stringify(l.flags.econ918) && JSON.stringify(copy.flags.travel918) === JSON.stringify(l.flags.travel918), 'save/load keeps econ918 and travel918 state');
}
// ---------- đời đầy đủ ----------
{
  for (let s = 0; s < 40; s++) { const l = E.createLife({ mode: s % 3 ? 'vn' : 'world', seed: 919500 + s * 7 }); E.runHeadless(l); ok(Number.isFinite(l.money) && (l.loans || []).every(x => Number.isFinite(x.bal)), 'finite money and loans'); ok(!l.alive, 'life ended'); }
}
console.log('PASS econ918: ' + count + ' checks (payslip, budget, sick leave, retraining, social housing, transport, CIT, economy chains, passport/visa, 8.10.19 guards).');
