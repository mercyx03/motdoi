'use strict';
const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const { E } = gameContext();
const { H, UPDATE110: X, ERA969: R } = E;
const hist = E.ERA920.HIST, quiet = () => {}, roll = () => 0.5;

function life() {
  const l = E.createLife({ mode: 'world', country: 'US', year: 1980, seed: 978 });
  Object.assign(l, { age: 34, alive: true, indep: true, school: null, schoolEnd: null, edu: 3, job: null,
    abroad: null, pending: [], sched: [], money: l.base * 4, acts: 0, retired: false });
  delete l.flags.military;
  delete l.flags.retryUni;
  l.flags.needJob = true;
  return l;
}
function reload(l) { return E.migrate(JSON.parse(JSON.stringify(l))); }
function step(l) { l.age++; l.pending = []; l.acts = 0; }
function job(l) { return E.beginYear(l, { auto: false }).find(d => d.id === 'job'); }
function option(d, key) { return d.opts.find(o => X.menuKey(d, o.k) === key); }
function choose(l, d, key) {
  assert(d, 'expected decision for ' + key);
  const o = option(d, key); assert(o, key + ' in ' + d.id);
  l.pending = [d]; E.resolve(l, o.k);
}
function near(actual, expected) { assert(Math.abs(actual - expected) < 1e-6, actual + ' vs ' + expected); }

{
  let l = life();
  choose(l, job(l), 'pause978');
  l = reload(l);
  for (let n = 0; n < 5; n++) { step(l); assert(!job(l), 'paused board is quiet in year ' + l.age); }
  assert(l.flags.needJob, 'pausing reminders preserves unemployment');
  assert(E.act(l, 'tim_viec'), 'manual job search remains available');
  l.pending = [];
  l.edu = 5;
  l.school = 'uni';
  assert(!job(l), 'a new degree is not consumed while an ongoing school blocks the board');
  l.pending = [];
  l.school = null;
  const degree = job(l); assert(degree?.data.newQualification978 && degree.text.includes('bằng cấp mới'));
  l = reload(l);
  assert.equal(l.flags.jobReminder978.edu, 5);
  step(l); assert(!job(l), 'a qualification surfaces exactly once while paused');
  const referral = E.BONDS919.state(l);
  l.major = 'eco';
  referral.referral975 = { id: 'test-referral', job: 'ke_toan', from: 'mẹ', until: l.age + 1,
    location: [H.resCode(l), l.city || l.place].join(':'), status: 'open' };
  const introduced = E.act(l, 'familyReferral975');
  assert(introduced && option(introduced, 'apply'), 'concrete referrals still work during a pause');
  l.pending = [];
  E.startJob(l, 'cong_nhan', H.rf(l), quiet, true);
  assert(!l.flags.jobReminder978, 'starting any real job clears the previous search preference');
}
{
  const l = life();
  choose(l, job(l), 'none');
  for (let n = 0; n < 2; n++) { step(l); assert(!job(l)); }
  step(l); assert(job(l), 'continuing the search returns after two quiet years');
}
{
  let l = life();
  H.moveToCity(l, 'New York');
  const q = hist.open(l, 'displaced', 2).recovery969;
  H.moveToCity(l, 'Chicago');
  l.flags.ctx945 = { noted: {}, refuge: { from: 'New York', to: 'Chicago', y: q.at } };
  q.housing = 'rented';
  l.job = { id: 'ke_toan', rank: 0, yrs: 3 };
  step(l);
  const money = l.money, soc = l.st.soc;
  hist.processOpen(l, quiet);
  assert(!R.displaced(l), 'stable housing and work end recurring costs');
  assert.equal(R.currentRecovery(l).result, 'stable978');
  l = reload(l);
  for (let i = 0; i < 9; i++) {
    step(l); hist.processOpen(l, quiet); R.recoveryYear(l, roll, quiet);
    E.CTX945.refugeReturn(l, E.CTX945.of(l), quiet);
  }
  assert.equal(l.city, 'Chicago', 'historical fallback cannot return a player automatically');
  near(l.money, money); near(l.st.soc, soc);
  const menu = E.act(l, 'recovery969');
  assert(menu?.text.includes('chi phí sống tạm đã kết thúc'));
  choose(l, menu, 'return');
  assert.equal(l.city, 'New York');
  assert.equal(hist.st(l).recoveryHistory969.length, 1);
  assert.equal(hist.st(l).recoveryHistory969[0].result, 'returned');
  assert(!R.currentRecovery(l));
}
{
  const l = life(), money = l.money, soc = l.st.soc;
  hist.open(l, 'displaced', 2);
  for (let i = 0; i < 12; i++) {
    step(l); hist.processOpen(l, quiet); R.recoveryYear(l, roll, quiet);
  }
  assert(!R.displaced(l));
  assert.equal(R.currentRecovery(l).result, 'ordinary978');
  near(money - l.money, l.base * 0.03 * 7);
  near(soc - l.st.soc, 7);
  const menu = E.act(l, 'recovery969');
  assert(menu && option(menu, 'rent'), 'time-limited costs do not remove unfinished housing options');
}
console.log('PASS 9.7.8: job reminders, qualifications, manual search, real referrals, recovery costs and player-chosen return.');
