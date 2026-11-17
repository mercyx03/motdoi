/* 8.10.40: phí thuốc kê đơn NHS England không được tăng 3%/năm vô hạn (đời ở năm 3357 từng bị trừ ~1,57 tỷ tỷ USD),
   và bản lưu đã bị trừ sai được hoàn lại đúng một lần khi nạp. */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, W = G.W, HS = E.HEALTH919;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
function ukLife(seed, birthYear) {
  const l = E.createLife({ mode: 'world', seed }); l.country = 'US'; l.flags.citizen = []; l.cur = 'usd';
  Object.assign(l, { age: 28, birthYear, indep: true, school: null, pending: [], sched: [], income: l.base * 2, money: l.base * 50, yr: { items: [] } });
  l.abroad = { code: 'GB', name: W.BY.GB.name, until: 40, perm: false, labor919: true }; l.city = 'London';
  return l;
}
// projection is capped
ok(HS.byYear({ 2025: 12.5 }, 2025).v === 12.5, 'known year unchanged');
ok(Math.abs(HS.byYear({ 2025: 12.5 }, 2030).v - 12.5 * Math.pow(1.03, 5)) < 1e-9, 'short projection still grows 3%/yr');
ok(Math.abs(HS.byYear({ 2025: 12.5 }, 3357).v - 12.5 * Math.pow(1.03, HS.PROJ_MAX)) < 1e-9, 'far-future projection capped');
ok(HS.byYear({ 2025: 12.5 }, NaN).v === 12.5, 'bad year does not blow up');
// the bill from the bug report: private checkup ~2,421 USD in year 3357
{
  const l = ukLife(3357, 3329), m0 = l.money, logs = [];
  ok(HS.policy(l).nation === 'ENG' && HS.policy(l).rxFee > 0, 'England resident of working age pays prescription fee');
  const total = E.usdToLocal(l, 2421), own = E.medBill(l, total, 'Khám sức khỏe', t => logs.push(t), 0);
  ok(own < total * 1.01 && own > total, 'pays bill + small rx fee, not quintillions (own=' + own + ')');
  ok(Math.abs(l.money - (m0 - own)) < 1e-6, 'money reduced by exactly what was billed');
  ok(!/tỷ USD/.test(logs.join()), 'log has no absurd amount: ' + logs.join());
}
function addLegacyBill(l, excess, covered = false) {
  const total = E.usdToLocal(l, 2421), insurer = covered ? total : 0;
  const paid = total - insurer + excess;
  E.H.cash(l, -paid, 'Khám sức khỏe');
  const h = HS.yr(l);
  h.n++;
  const f = x => E.H.money(l, x);
  l.log.push({ a: l.age, y: l.birthYear + l.age, t: 'Viện phí ' + f(total) + ': NHS England (đã đóng phụ phí y tế IHS khi xin visa) chi trả ' + f(insurer) + ', bạn trả ' + f(paid) + '. Thời gian tiếp cận: có thể chờ.', k: 'neutral' });
}
// Only a legacy bill that matches the saved journal and ledger can be repaired.
{
  const l = ukLife(3358, 3329), good = l.money, bogus = E.usdToLocal(l, 12.5 * Math.pow(1.03, 3357 - 2025));
  addLegacyBill(l, bogus);
  E.migrateExt(l);
  const expect = good - E.usdToLocal(l, 2421) - G.E.HEALTH880.local('GB', G.E.HEALTH880.NHS.charge);
  ok(Math.abs(l.money - expect) < Math.max(1e3, Math.abs(expect) * 1e-6) && l.money > 0, 'refund restores balance (' + l.money + ' vs ' + expect + ')');
  ok(/Hoàn lại .*phí thuốc kê đơn/.test(l.log[l.log.length - 1].t), 'refund noted in diary');
  const after = l.money; E.migrateExt(l); ok(l.money === after, 'refund applied only once');
}
// Exemption is determined by the actual billed amount, even with unrelated large debt.
{
  const l = ukLife(3359, 3329);
  l.income = 0;
  ok(!HS.policy(l).rxFee, 'ordinary low income patient is exempt in the model');
  l.money = -1e18;
  addLegacyBill(l, 0);
  const m0 = l.money;
  E.migrateExt(l); ok(l.money === m0, 'no refund for unrelated debt or unpaid prescription');
  l.age = 17; l.school = 'upper'; l.income = l.base * 2;
  ok(!HS.policy(l).rxFee && !E.HEALTH880.rxPayer(l), 'student aged 17 is exempt under both paths');
}
for (const change of [l => { l.abroad = { code: 'FR', perm: true }; }, l => { l.cur = 'vnd'; }, l => { l.age++; }, l => { l.yr = null; }]) {
  const l = ukLife(3361, 3329);
  addLegacyBill(l, E.usdToLocal(l, 12.5 * Math.pow(1.03, 3357 - 2025)), true);
  change(l);
  const before = l.money;
  E.migrateExt(l);
  ok(l.money === before && !l.flags.rxFix919, 'do not guess after moving, changing units, another year, or missing ledger');
}
// normal-era saves are untouched
{
  const l = ukLife(3360, 1998), m0 = l.money; delete l.flags.rxFix919; l.money = -l.base * 5;
  l.log.push({ a: 28, y: 2026, t: 'Viện phí 100 USD: NHS England (cư trú thường xuyên) chi trả 100 USD, bạn trả 12 USD.', k: 'neutral' });
  E.migrateExt(l); ok(l.money === -l.base * 5, 'ordinary debt not "refunded"');
}
console.log('healthsys-rx-cap: ' + count + ' checks passed');
