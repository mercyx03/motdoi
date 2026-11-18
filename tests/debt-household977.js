'use strict';
const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const { E } = gameContext();
const { H, UPDATE110: X, CHAIN144: C } = E;
const quiet = () => {}, roll = () => 0.5;

function life() {
  const l = E.createLife({ mode: 'vn', year: 1990, seed: 977 });
  Object.assign(l, { age: 34, alive: true, indep: true, school: null, schoolEnd: null, job: null,
    abroad: null, pending: [], sched: [], kids: [], loans: [], money: l.base * 8 });
  l.fam.mAlive = true; l.fam.noMom = false;
  delete l.flags.military;
  return l;
}
function reload(l) { return E.migrate(JSON.parse(JSON.stringify(l))); }
function option(d, key) { return d.opts.find(o => X.menuKey(d, o.k) === key); }
function choose(l, d, key) {
  const o = option(d, key); assert(o, key + ' in ' + d.id);
  l.pending = [d]; E.resolve(l, o.k);
}
function borrow(l) {
  choose(l, E.DEC.vd_vay_chua_benh.make(l, H.rf(l)), 'ho_hang');
  assert(C.active(l, 'debt'));
  return l.loans.at(-1);
}
function appointment(l, c) {
  for (; l.age < c.due; l.age++) {
    C.yearly(l, H.rf(l), quiet, l.age);
    const index = l.sched.findIndex(s => s.arg?.cid === c.id);
    if (index >= 0) {
      const [s] = l.sched.splice(index, 1);
      l.age = s.at;
      return E.DEC[s.id].make(l, H.rf(l), s.arg);
    }
  }
  assert.fail('Missing appointment');
}
function near(actual, expected) { assert(Math.abs(actual - expected) < 1e-6, actual + ' vs ' + expected); }

{
  let l = life();
  H.addLoan(l, 'family', l.base * 0.25);
  const old = l.loans[0].bal, medical = borrow(l), principal = medical.bal;
  let c = C.active(l, 'debt');
  assert.equal(c.data.loanId977, medical.uid110);
  const d = appointment(l, c);
  l = reload(l); c = C.active(l, 'debt');
  l.loans.reverse();
  l.money = principal / 5;
  choose(l, d, 'pay');
  const remaining = principal * 0.8;
  near(l.loans.find(q => q.uid110 === c.data.loanId977).bal, remaining);
  near(l.loans.find(q => q.uid110 !== c.data.loanId977).bal, old);
  near(l.money, 0);
  assert(l.log.some(e => e.t.includes(H.money(l, principal / 5)) && e.t.includes('Còn nợ')));
  l = reload(l);
  l.money = principal;
  choose(l, d, 'pay');
  near(l.money, principal);
  near(l.loans.find(q => q.uid110 === c.data.loanId977).bal, remaining);
  l.loans = l.loans.filter(q => q.uid110 !== c.data.loanId977);
  C.yearly(l, roll, quiet, l.age);
  assert(!C.active(l, 'debt'));
  near(l.loans[0].bal, old);
}
{
  let l = life();
  const medical = borrow(l);
  delete medical.uid110;
  delete C.active(l, 'debt').data.loanId977;
  l = reload(l);
  assert.equal(C.active(l, 'debt').data.loanId977, l.loans[0].uid110);
  assert(l.loans[0].uid110);
}
{
  let l = life();
  H.addLoan(l, 'family', l.base * 0.25);
  const medical = borrow(l), c = C.active(l, 'debt'), d = appointment(l, c);
  delete medical.uid110;
  delete c.data.loanId977;
  const amounts = l.loans.map(q => q.bal), cash = l.money;
  l = reload(l);
  assert(!E.DEC[d.id].valid(l, d.data), 'a legacy choice does not guess between two loans');
  E.DEC[d.id].apply(l, d, 'pay', roll, quiet);
  assert.deepEqual(Array.from(l.loans, q => q.bal), Array.from(amounts));
  near(l.money, cash);
  l.loans.pop();
  C.yearly(l, roll, quiet, l.age);
  assert.equal(C.state(l).done.at(-1).result, 'unmatched');
  near(l.loans[0].bal, amounts[0]);
}

function partner(name, job, jobId, inc, since = 28) {
  return { name, age: 33, status: 'married', alive: true, sex: 'F', job, jobId, inc, since, close: 95, want920: 'family' };
}
function household(l) { return E.DEC.household920.make(l, roll); }
function agreeOn(l, kind) {
  const key = 'arr:' + kind;
  for (let attempt = 0; attempt < 10 && l.flags.kin920?.arr?.kind !== kind; attempt++) {
    const d = household(l);
    if (option(d, key)) choose(l, d, key);
    if (l.flags.kin920?.arr?.kind !== kind) l.age++;
  }
  assert.equal(l.flags.kin920.arr.kind, kind);
}
{
  let l = life();
  l.partner = partner('Mai', 'kế toán', 'ke_toan', 10);
  agreeOn(l, 'pause');
  const own = l.flags.kin920.arr.person976, paused = l.age;
  l = reload(l);
  assert.equal(l.flags.kin920.arr.person976, own);
  l.age += 2; l.partner.want920 = 'career';
  agreeOn(l, 'both');
  assert.equal(l.partner.jobId, 'ke_toan');
  near(l.partner.inc, 10 * Math.max(0.7, 1 - (l.age - paused) * 0.04));
}
{
  let l = life();
  l.partner = partner('Mai', 'kế toán', 'ke_toan', 10);
  agreeOn(l, 'pause');
  const former = l.flags.kin920.arr.person976;
  l.age += 2;
  const stale = household(l), previousReturn = option(stale, 'arr:both');
  assert(previousReturn);
  H.endPartner(l, quiet, 'div');
  l.partner = partner('Mai', 'giáo viên', 'giao_vien', 9, l.age);
  assert(!E.DEC.household920.valid(l, stale.data));
  E.DEC.household920.apply(l, stale, previousReturn.k, roll, quiet);
  assert.equal(l.partner.job, 'giáo viên');
  l = reload(l);
  assert(!option(household(l), 'arr:both'));
  assert.equal(l.partner.inc, 9);
  agreeOn(l, 'part');
  assert.equal(l.partner.inc, 4.5);
  assert.notEqual(l.flags.kin920.arr.person976, former);
  assert.equal(l.flags.kin920.arr.saved.jobId, 'giao_vien');
}
{
  const l = life();
  l.partner = partner('Mai', 'kế toán', 'ke_toan', 10);
  agreeOn(l, 'pause');
  const legacy = JSON.parse(JSON.stringify(l));
  delete legacy.flags.kin920.arr.person976;
  const original = reload(legacy);
  original.age++;
  assert(option(household(original), 'arr:both'));
  const replacement = JSON.parse(JSON.stringify(legacy));
  replacement.partner = partner('An', 'giáo viên', 'giao_vien', 9, l.age);
  const fresh = reload(replacement);
  assert(!fresh.flags.kin920.arr);
  assert.equal(fresh.partner.inc, 9);
}
console.log('PASS 9.7.7: exact loan, partial and duplicate repayments, ambiguous legacy loans, partner changes and legacy work arrangements.');
