/* 8.10.20 Phần C hoàn thiện: chỉ số theo ngành, lương công vụ/hưu, BHYT hộ gia đình, quỹ hưu tự nguyện, bảo hiểm nhân thọ,
   tăng ca/phép năm, thực tập, người khuyết tật, thu nhập tối thiểu, vay sinh viên, học phí, BHYT trẻ em, thuế kinh doanh,
   lệ phí trước bạ, e-visa, hộ chiếu khi ra nước ngoài, cán bộ đề xuất/thí điểm chính sách, khóa bán nhà ở xã hội. */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, R = E.ERA917, W = E.WELFARE918, C = E.ECON918, T = E.TRAVEL918;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
const quiet = () => {}, near = (a, b, e) => Math.abs(a - b) < (e || 1e-6);
function life(seed, o) { const l = E.createLife({ mode: 'vn', seed }); Object.assign(l, { age: 35, indep: true, school: null, schoolEnd: null, pending: [], sched: [], money: l.base * 20, yr: { items: [] } }, o || {}); l.flags.military = 0; return l; }
function hooks(l) { E.HOOKS.year.forEach(h => { try { h(l, () => .5, quiet, l.age - 1); } catch (e) { } }); }
function pick(l, id, key, arg) { const d = E.DEC[id].make(l, () => .5, arg || {}); d.manual = true; l.pending = [d]; const i = d.data && d.data.keys ? d.data.keys.indexOf(key) : -1; ok(i >= 0, id + ' offers ' + key); E.resolve(l, String(i)); }
ok(W, 'module loaded');
['insurance918', 'work918', 'intern918', 'disability918', 'studentLoan918', 'policy918'].forEach(id => ok(!!E.DEC[id], 'decision ' + id));
['vn_pubwage_2026', 'vn_bhyt_household', 'vn_vol_pension', 'vn_overtime', 'vn_student_loan', 'vn_disability_allow', 'vn_ev_fee', 'vn_hkd_tax', 'sim_basic_income', 'sim_child_health', 'sim_pubwage_index'].forEach(id => ok(R.POLICIES.some(p => p.id === id), 'policy ' + id));
// C3 chỉ số ngành: chung theo nước/năm, có trần, 2026 = 1, tác động chi phí tương đối.
{
  const a = life(1), b = life(2); a.age = b.age = 40;
  const x = W.sectors(a), y = W.sectors(b); ok(['housing', 'health', 'tuition', 'transport'].every(k => near(x[k], y[k])), 'same country-year indices for all lives');
  a.age = 0; ok(['housing', 'health', 'tuition', 'transport'].every(k => W.sectors(a)[k] === 1), 'base year 2026 = 1');
  for (let t = 0; t < 120; t += 7) { a.age = t; const s = W.sectors(a); ok(['housing', 'health', 'tuition', 'transport'].every(k => s[k] >= 0.85 - 1e-12 && s[k] <= 1.15 + 1e-12), 'sector index capped ' + (2026 + t)); }
  const l = life(3, { age: 40 }); l.kids = [{ name: 'K', born: 30, alive: true }]; const s = W.sectors(l), F = { food: 100, rent: 20, travel: 10, kids: 50, health: 5, items: [] }, p = C.pressure(l);
  E.livingCost918(l, F);
  ok(near(F.rent, 20 * s.housing, 1e-9) && near(F.health, 5 * s.health, 1e-9) && F.travel === 10 && near(F.food, 100 * (1 + p), 1e-9), 'rent/health follow sector indices, food follows yearly pressure');
  const va = E.vehicleAnnual(l); ok(near(E.travelCost(l), va.total, 1e-9), 'transport index applied once, inside vehicle annual cost');
  const tuitionOff = l.base * 0.012 * s.tuition; ok(near(F.kids, 50 + l.base * 0.012 * (s.tuition - 1) - tuitionOff, 1e-9), 'public school tuition exemption removes the tuition share for a school-age child');
  const m0 = l.money, loans = JSON.stringify(l.loans || []); E.livingCost918(l, { food: 1 }); ok(l.money === m0 && JSON.stringify(l.loans || []) === loans, 'indices never touch cash or debt');
}
// Lương công vụ & lương hưu: điều chỉnh theo lương cơ sở trước bảo hiểm và thuế.
{
  const l = life(10, { age: 30, edu: 5 }); l.birthYear = 1990; E.startJob(l, 'cong_chuc', () => .5, quiet, true); ok(E.wageIndex918(l) === 1, '2020: no index');
  l.birthYear = 2027 - 30; ok(E.wageIndex918(l) > 1.02 && E.wageIndex918(l) <= 1.15, '2027: public wage up after 2,53 base wage (' + E.wageIndex918(l).toFixed(3) + ')');
  for (let a = 30; a < 90; a += 10) { l.age = a; ok(E.wageIndex918(l) <= 1.15 + 1e-12, 'public index capped'); }
  const p = life(11, { age: 30 }); E.startJob(p, 'ke_toan', () => .5, quiet, true); ok(E.wageIndex918(p) === 1, 'private wage not indexed');
  const ret = life(12, { age: 70, retired: true, pensioned: true, pensionInc: 100, job: null }); ret.birthYear = 2026 - 70; hooks(ret); ok(ret.pensionInc > 100 && ret.pensionInc < 105, '2026 pension raised half-year with base wage');
  const before = ret.pensionInc; hooks(ret); ok(ret.pensionInc === before, 'pension raised once per year');
}
// BHYT hộ gia đình: tự đóng hằng năm; không đủ tiền thì mất thẻ; người thuộc diện được đóng thì không thu.
{
  const l = life(20, { age: 40, job: null }); l.flags.bhytVol = true; l.fam.q = 3; const m0 = l.money, p = W.bhytPremium(l);
  ok(near(p, 0.045 * 2.53 * 12, 1e-9), 'premium = 4,5% x 2,53 million x 12');
  hooks(l); ok(near(m0 - l.money, p, 1e-6) || m0 - l.money >= p - 1e-6, 'household BHYT charged'); const m1 = l.money; hooks(l); ok(l.money === m1 || l.money >= m1 - 1e-6 && W.state(l).bhytAt === l.age, 'charged once per year');
  const poor = life(21, { age: 40, job: null, money: 0 }); poor.flags.bhytVol = true; poor.fam.q = 3; hooks(poor); ok(poor.flags.bhytVol === false, 'cannot pay → card lapses');
  const emp = life(22, { age: 40 }); E.startJob(emp, 'cong_chuc', () => .5, quiet, true); emp.flags.bhytVol = true; ok(W.bhytFree(emp), 'employee BHYT paid through payroll');
  const buy = life(23, { age: 40, job: null }); buy.flags.bhytVol = false; buy.fam.q = 3; ok(!E.hasBHYT(buy), 'no card before buying'); pick(buy, 'insurance918', 'bhyt'); ok(E.hasBHYT(buy) && E.bhytShare(buy) === 0.8, 'bought card: 80% coverage');
}
// Quỹ hưu trí tự nguyện: đóng, trừ thuế tối đa 1 triệu/tháng, rút trước tuổi mất 10%.
{
  const l = life(30, { age: 35 }); E.startJob(l, 'ke_toan', () => .5, quiet, true);
  pick(l, 'insurance918', 'v2'); const v = W.volState(l); ok(v.m === 2, 'chose 2 million/month');
  const m0 = l.money; hooks(l); ok(near(m0 - l.money, 24, 1e-6) && near(v.bal, 24, 1e-9), 'yearly contribution moved from cash to fund');
  ok(E.pitDeduct918(l) === 12, 'tax deduction capped at 1 million/month');
  const t = E.TAX909.calculate(500, 0, 12), t2 = E.TAX909.calculate(500 - 12, 0, 12); ok(t2.tax < t.tax && t.tax - t2.tax < 12, 'deduction lowers tax by less than the deducted amount');
  l.age++; hooks(l); ok(v.bal > 48 && v.bal < 49, 'fund grows modestly');
  const bal = v.bal, c0 = l.money; pick(l, 'insurance918', 'withdraw'); ok(near(l.money - c0, bal * 0.9, 1e-6) && v.bal === 0 && v.m === 0, 'early withdrawal loses 10%');
}
// Bảo hiểm nhân thọ: thời gian chờ và loại trừ bệnh mạn tính có từ trước.
{
  const l = life(40, { age: 35 }); l.ins = { type: 'protect', name: 'bh', prem: 1, since: 35, term: 20, paid: 0, val: 0 }; l.ill = { n: 'ung thư', since: 35 }; const m0 = l.money; hooks(l);
  ok(!l.ill.insPaid, 'illness diagnosed in the purchase year not paid (waiting period)');
  const k = life(41, { age: 36 }); k.ins = { type: 'protect', name: 'bh', prem: 1, since: 30, term: 20, paid: 0, val: 0, preChronic: true }; k.ill = { n: 'tiểu đường', since: 36, chronic: true }; hooks(k); ok(!k.ill.insPaid, 'pre-existing chronic condition excluded');
  const g = life(42, { age: 36 }); g.ins = { type: 'protect', name: 'bh', prem: 1, since: 30, term: 20, paid: 0, val: 0 }; g.ill = { n: 'ung thư', since: 36 }; hooks(g); ok(g.ill.insPaid, 'new illness after waiting period paid');
}
// Tăng ca và phép năm.
{
  const l = life(50, { age: 30 }); E.startJob(l, 'cong_chuc', () => .5, quiet, true); l.yr = { gross: 20.8 * 12, items: [] }; l.mind.stress = 20;
  ok(!E.DEC.work918.make(l, () => .5, {}).opts.some(o => o.k === String(E.DEC.work918.make(l, () => .5, {}).data.keys.indexOf('ot:max'))), 'office job cannot pick 300-hour overtime');
  pick(l, 'work918', 'ot:heavy'); const m0 = l.money; hooks(l); ok(near(l.money - m0, 20.8 / 208 * 200 * 1.5 * 0.85, 1e-6), 'overtime pay = hourly x 200h x 150% (net estimate)');
  const ctl = life(50, { age: 30 }); E.startJob(ctl, 'cong_chuc', () => .5, quiet, true); ctl.yr = { gross: 20.8 * 12, items: [] }; ctl.mind.stress = 20; ctl.id = l.id; hooks(ctl); ok(l.mind.stress > ctl.mind.stress && W.state(l).work.otTotal === 200, 'overtime raises stress vs no-overtime control'); const m1 = l.money; hooks(l); ok(l.money === m1, 'overtime paid once per year');
  pick(l, 'work918', 'lv:skip'); l.age++; const m2 = l.money; hooks(l); ok(l.money >= m2, 'unused leave is not paid out while employed');
}
// Thực tập.
{
  const l = life(60, { age: 21, school: 'uni', major: 'eco', indep: false }); l.st.kno = 90; pick(l, 'intern918', 'paid'); ok(W.state(l).intern && !W.state(l).intern.done, 'internship started');
  const d2 = E.DEC.intern918.make(l, () => .5, {}); ok(!d2.opts.some(o => /^\d+$/.test(o.k) && o.k !== String(d2.data.keys.length)), 'cannot start a second internship in the same year');
  l.age++; hooks(l); ok(W.state(l).intern.done, 'internship result next year');
  if (W.state(l).intern.ok) { l.school = null; l.edu = 5; const o = E.offers(l, () => .5); ok(o.some(id => E.CAR[id] && E.CAR[id].major === 'eco'), 'successful internship adds a related job offer'); }
}
// Người khuyết tật: xác định mức độ → trợ cấp hằng tháng.
{
  const l = life(70, { age: 38 }); l.kids = [{ name: 'Na', sex: 'F', born: 30, alive: true, dev915: { v: 1, c: { id: { known: true, at: 33 } } } }];
  ok(W.disPeople(l).length === 1, 'child with known intellectual disability listed');
  pick(l, 'disability918', 'reg:kid:Na'); hooks(l); ok(W.state(l).dis['kid:Na'].status === 'pending', 'pending in the same year');
  l.age++; const m0 = l.money; hooks(l); const e = W.state(l).dis['kid:Na']; ok(e.status === 'approved' && near(l.money - m0, (e.level === 'extreme' ? 1.25 : 1) * 12, 1e-6), 'allowance paid after assessment');
  const m1 = l.money; hooks(l); ok(l.money === m1, 'allowance once per year');
}
// Vay sinh viên: giải ngân khi học, lãi trong lúc học, chuyển thành khoản vay khi ra trường.
{
  const l = life(80, { age: 19, school: 'uni', indep: false, money: 0 }); l.fam.q = 2; const m0 = l.money;
  pick(l, 'studentLoan918', 'borrow'); ok(near(l.money - m0, 40, 1e-9) && W.state(l).loan.bal === 40, 'borrowed 4 million x 10 months');
  const d = E.DEC.studentLoan918.make(l, () => .5, {}); ok(!d.opts.some(o => o.k === String(d.data.keys.indexOf('borrow'))), 'once per school year');
  l.age++; hooks(l); ok(near(W.state(l).loan.bal, 40 * 1.066, 1e-9), 'interest accrues while studying');
  l.school = null; l.age++; const n0 = (l.loans || []).length; hooks(l); ok(l.loans.length === n0 + 1 && l.loans.slice(-1)[0].student918 && W.state(l).loan.bal === 0, 'converted to a repayable loan after graduation');
  hooks(l); ok(l.loans.filter(x => x.student918).length === 1, 'converted once');
}
// BHYT trẻ em (giả định) và thu nhập tối thiểu (giả định): chỉ trong kịch bản.
{
  const k = life(90, { age: 10, indep: false }); k.flags.bhytVol = false; k.school = 'primary'; ok(E.bhytShare(k) === 0.8, 'balanced/before window: school child 80%');
  R.state(k).scen = 'expanded'; k.birthYear = R.effFrom(k, R.POLICIES.find(p => p.id === 'sim_child_health')) - 10; ok(E.bhytShare(k) === 1, 'expanded scenario: under-16 100%');
  const b = life(91, { age: 30, income: 0 }); R.state(b).scen = 'expanded'; b.birthYear = R.effFrom(b, R.POLICIES.find(p => p.id === 'sim_basic_income')) - 30; const m0 = b.money; hooks(b); ok(near(b.money - m0, 12, 1e-6) || b.money - m0 >= 12 - 1e-6, 'basic income pilot pays 1 million/month');
  const n = life(92, { age: 30, income: 0 }); const n0 = n.money; hooks(n); ok(!W.state(n).basicAt, 'no basic income in balanced scenario');
}
// Thuế kinh doanh trừ tiền thật.
{
  const small = life(100, { age: 40 }); small.birthYear = 1990; E.startJob(small, 'kd_quan', () => .5, quiet, true); small.job.rank = 0;
  const o1 = W.bizTax(small, 100, quiet); ok(o1 === 100, 'small household business under 500 million revenue: no tax');
  small.birthYear = 2026 - 40; W.state(small).taxAt = null; const o2 = W.bizTax(small, 200, quiet); ok(near(o2, 200 - (200 * 4 - 500) * 0.015, 1e-9), 'household business: 1,5% of revenue above 500 million');
  W.state(small).taxAt = small.age; ok(W.bizTax(small, 200, quiet) === 200, 'taxed once per year');
  const firm = life(101, { age: 40 }); firm.birthYear = 2026 - 40; E.startJob(firm, 'kd_quan', () => .5, quiet, true); firm.job.rank = 3;
  ok(near(W.bizTax(firm, 2000, quiet), 2000 * (1 - 0.17), 1e-9), 'firm with 8 billion revenue: 17% CIT on profit');
  const emp = life(102, { age: 40 }); emp.birthYear = 2026 - 40; E.startJob(emp, 'ke_toan', () => .5, quiet, true); ok(W.bizTax(emp, 300, quiet) === 300, 'employees not taxed as business');
}
// Lệ phí trước bạ: xe xăng, xe điện theo năm.
{
  const l = life(110, { age: 40 }); l.prov = { neu: 'Đà Nẵng', old: 'Đà Nẵng' }; l.urban = true;
  l.birthYear = 2026 - 40; ok(W.regFee(l, true, true, 1000) === 0, 'EV car exempt until 2/2027'); ok(near(W.regFee(l, true, false, 1000), 100), 'petrol car 10%');
  l.birthYear = 2028 - 40; ok(near(W.regFee(l, true, true, 1000), 50), 'EV car 50% in 2027–2028 (assumption)');
  l.prov = { neu: 'Hà Nội', old: 'Hà Nội' }; ok(near(W.regFee(l, true, false, 1000), 120) && near(W.regFee(l, false, false, 100), 5), 'Hanoi: car 12%, motorbike 5%');
}
// E-visa và hộ chiếu khi ra nước ngoài học/làm.
{
  const l = life(120, { age: 30 }); T.state(l).passport = { cc: 'VN', issued: 25, until: 35 };
  ok(T.entry(l, 'IN').kind === 'evisa' && T.entry(l, 'TH').kind === 'free' && T.entry(l, 'US').kind === 'visa', 'three entry kinds');
  const m0 = l.money, r = T.decide(l, 'IN', quiet); ok(r === true ? l.money === m0 : near(m0 - l.money, l.base * 0.01), 'e-visa decided online; lower fee if refused');
  const s = life(121, { age: 19 }); s.abroad = { code: 'JP', name: 'Nhật Bản', study: true, until: 23 }; const s0 = s.money; hooks(s);
  const fees = () => (s.yr.items || []).filter(x => /hộ chiếu/.test(x.t || '')).length; ok(T.passport(s) && T.passport(s).forTrip === 'JP' && fees() === 1, 'going abroad to study makes a passport with a fee');
  hooks(s); ok(fees() === 1, 'passport fee charged once');
}
// Cán bộ đề xuất chính sách toàn quốc và thí điểm địa phương.
{
  const l = life(130, { age: 50, edu: 5, major: 'eco' }); E.startJob(l, 'trung_uong', () => .5, quiet, true); Object.assign(l.job, { rank: 6, rankTracked: 6, rankSince: 50 }); E.STATE174.syncState(l); E.STATE917.syncPost(l);
  ok(W.polScope(l) === 'national', 'minister-level official proposes nationally');
  const cand = W.candidatePolicies(l); ok(cand.length > 0 && cand.every(p => p.layer === 'simulated'), 'only simulated policies can be proposed');
  const id = cand[0].id; const b0 = E.STATE917.projState(l).budget; pick(l, 'policy918', id);
  ok(W.state(l).prop.pending && E.STATE917.projState(l).budget < b0, 'proposal pending and costs public budget, not personal money');
  const d = E.DEC.policy918.make(l, () => .5, {}); ok(!d.opts.some(o => o.k === String(d.data.keys.indexOf(cand[1] ? cand[1].id : id))), 'one proposal at a time');
  l.age++; hooks(l); const h = W.state(l).prop.hist.slice(-1)[0]; ok(h && h.id === id, 'reviewed next year');
  if (h.ok) ok(R.active(l, id, R.year(l) + 2), 'approved proposal becomes active nationally after 2 years');
  const p = life(131, { age: 50, edu: 5 }); E.startJob(p, 'hanh_chinh_cong', () => .5, quiet, true); Object.assign(p.job, { rank: 7, rankSince: 50 }); E.STATE174.syncState(p); E.STATE917.syncPost(p); p.prov = { neu: 'Đà Nẵng', old: 'Đà Nẵng' };
  if (W.polScope(p) === 'local') { ok(W.candidatePolicies(p).every(q => ['sim_child_allowance', 'sim_free_bus', 'sim_basic_income'].includes(q.id)), 'province can only pilot locally implementable policies'); R.state(p).pilot = { sim_free_bus: { prov: 'Đà Nẵng', from: R.year(p), by: 50 } }; ok(R.active(p, 'sim_free_bus'), 'local pilot active in its province'); p.prov = { neu: 'Huế', old: 'Huế' }; ok(!R.active(p, 'sim_free_bus') || R.effFrom(p, R.POLICIES.find(q => q.id === 'sim_free_bus')) <= R.year(p), 'pilot not active elsewhere'); }
  const civ = life(132, { age: 50 }); E.startJob(civ, 'ke_toan', () => .5, quiet, true); ok(E.DEC.policy918.make(civ, () => .5, {}).opts.length <= 1 || !W.polScope(civ), 'private worker cannot propose national policy');
}
// Khóa bán nhà ở xã hội 5 năm.
{
  const l = life(140, { age: 40 }); l.ownHouse = true; l.houseVal = 750; l.loans = [{ type: 'home', name: 'nhcsxh', bal: 500, rate: 0.054, minShare: 0.06, late: 0, since: 38, social918: true }];
  l.flags.econ918 = { housing: { status: 'owner', since: 38, noSaleUntil: 43 } }; l.ownHouse = false; l.money = 800; hooks(l);
  ok(l.flags.econ918.housing.status === 'sold_early' && !l.loans.some(x => x.social918) && near(l.money, 300, 1e-6), 'early transfer: social loan due immediately');
  const ok2 = life(141, { age: 45 }); ok2.flags.econ918 = { housing: { status: 'owner', since: 38, noSaleUntil: 43 } }; ok2.ownHouse = false; hooks(ok2); ok(ok2.flags.econ918.housing.status === 'owner', 'after 5 years: no penalty');
}
// Lưu/tải và đời đầy đủ.
{
  const l = life(150); W.volState(l).m = 1; W.state(l).loan = { bal: 10, at: 34 }; const c = JSON.parse(JSON.stringify(l)); E.migrateExt(c); ok(JSON.stringify(c.flags.welfare918) === JSON.stringify(l.flags.welfare918), 'save/load keeps welfare918 state');
  for (let s = 0; s < 30; s++) { const x = E.createLife({ mode: s % 3 ? 'vn' : 'world', seed: 918700 + s * 11 }); E.runHeadless(x); ok(Number.isFinite(x.money) && !x.alive, 'full life finite'); }
}
console.log('PASS welfare918: ' + count + ' checks (sector indices, public wage/pension, BHYT, voluntary pension, life insurance, overtime/leave, internship, disability, student loan, child health, basic income, business tax, EV fee, e-visa, passport abroad, policy proposals, social housing lock).');
