'use strict';
const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const { E } = gameContext();
const { H, KIN920: K, UPDATE110: X } = E;
const roll = () => 0.5;
const quiet = () => {};

function life(kind = 'lang') {
  const l = E.createLife({ mode: 'world', country: 'US', year: 1990, seed: 976 });
  Object.assign(l, { age: 35, alive: true, indep: true, school: null, job: null, pending: [], sched: [], kids: [], acts: 0, money: l.base * 4 });
  delete l.flags.caring;
  delete l.flags.military;
  l.partner = { name: 'Alex', age: 34, sex: 'F', status: 'married', since: 29, alive: true, edu: 3,
    job: 'tạm nghỉ việc chăm sóc gia đình', jobId: null, inc: 0, close: 70, want920: 'career',
    goal920: { k: kind, at: l.age, prog: 0 } };
  return l;
}
function shower(l) { return E.DEC.goalAsk920.make(l, roll, { k: l.partner.goal920.k }); }
function option(d, key) { return d.opts.find(o => X.menuKey(d, o.k) === key); }
function choose(l, d, key) {
  const o = option(d, key);
  assert(o, key + ' in ' + d.id);
  l.pending = [d];
  E.resolve(l, o.k);
}
function menu(l) { return E.DEC.partnerPlan976.make(l, roll); }
function years(l, n = 1) {
  for (let i = 0; i < n; i++) {
    l.age++; l.partner.age++; l.pending = []; l.acts = 0;
    K.goalYear(l, roll, quiet);
  }
}
function reload(l) { return E.migrate(JSON.parse(JSON.stringify(l))); }
function near(actual, expected) { assert(Math.abs(actual - expected) < 1e-6, actual + ' vs ' + expected); }

{
  const full = life(), cheap = life(), waiting = life(), initial = full.money;
  const prompt = shower(waiting);
  assert(prompt.text.includes('tiếng Tây Ban Nha'));
  assert.equal(E.DEC.goalAsk920.auto(waiting, prompt, roll), 'later');
  choose(full, shower(full), 'yes');
  choose(cheap, shower(cheap), 'cheap');
  choose(waiting, prompt, 'later');
  near(initial - full.money, full.base * 0.04);
  near(initial - cheap.money, cheap.base * 0.04 * 0.3);
  assert(!option(menu(full), 'apply'));
  years(full); years(cheap); years(waiting);
  assert(full.partner.goal920.prog > cheap.partner.goal920.prog && cheap.partner.goal920.prog > 0);
  near(initial - full.money, full.base * 0.04);
  years(full); years(cheap); years(waiting);
  assert.equal(full.partner.goal920.end, 'done');
  assert(!cheap.partner.goal920.end);
  years(cheap);
  assert.equal(cheap.partner.goal920.end, 'done');
  assert(cheap.money > full.money);
  assert.equal(waiting.partner.goal920.prog, 0);
  near(waiting.money, initial);
  assert.equal(waiting.pending.length, 0);
  const actualAction = E.act(waiting, 'partnerPlan976');
  assert(actualAction, 'can resume through the family action');
  choose(waiting, actualAction, 'cheap');
  years(waiting);
  assert.equal(waiting.partner.goal920.prog, 35);
}
{
  let l = life();
  l.money = l.base * 0.04;
  choose(l, shower(l), 'yes');
  years(l); l = reload(l);
  const g = l.partner.goal920, progress = g.prog;
  K.goalYear(l, roll, quiet);
  assert.equal(g.prog, progress, 'reload cannot advance the same term again');
  years(l);
  assert.equal(g.ok, 'no');
  assert.equal(g.prog, progress);
  assert.equal(l.money, 0);
  years(l, 2);
  assert.equal(g.prog, progress);
  l.money = l.base * 0.04 * 0.3;
  choose(l, menu(l), 'cheap');
  years(l);
  assert(g.prog > progress && !g.end);
  assert.equal(l.money, 0);
}
{
  let l = life(), g = l.partner.goal920;
  g.ok = 'fund';
  l.money = 0;
  l = reload(l);
  years(l);
  assert(l.partner.goal920.prog > 0, 'old paid courses keep their first term');
  assert.equal(l.money, 0);
  const withoutReply = life(), unchosen = withoutReply.partner.goal920;
  unchosen.prog = 23;
  years(withoutReply, 4);
  assert.equal(unchosen.prog, 23, 'old unanswered drafts retain progress but do not continue');
}
{
  const l = life();
  l.money = 0;
  const a = shower(l);
  assert(!option(a, 'yes') && !option(a, 'cheap'));
  choose(l, a, 'no');
  assert.equal(l.partner.goal920.ok, 'no');
  assert.equal(l.money, 0);
  const stale = shower(l);
  l.partner = Object.assign({}, life().partner);
  E.DEC.goalAsk920.apply(l, stale, 'yes', roll, quiet);
  assert(!l.partner.goal920.ok, 'a stale decision cannot enroll a new partner');
}
{
  let l = life();
  choose(l, shower(l), 'yes');
  years(l, 2);
  l = reload(l);
  assert.equal(l.partner.training976.languages.es.level, 60);
  delete l.partner.goal920; // completed training survives the next goal
  const d = menu(l), id = option(d, 'apply').k;
  const playerJob = l.job;
  E.DEC.partnerPlan976.apply(l, d, id, () => 0.99, quiet);
  assert.equal(l.partner.inc, 0);
  assert(!option(menu(l), 'apply'), 'no multiple interviews in one year');
  years(l);
  l.partner.res919 = 'FR';
  assert(!option(menu(l), 'apply'), 'no applying where the partner does not live');
  delete l.partner.res919;
  l.lang = { en: 5 };
  const normalPay = E.monthlyEst({ ...l, age: l.partner.age, birthYear: l.birthYear + l.age - l.partner.age, edu: 3, lang: null }, 'le_tan', 0);
  const retry = menu(l), k = option(retry, 'apply').k;
  E.DEC.partnerPlan976.apply(l, retry, k, () => 0, quiet);
  assert.equal(l.partner.jobId, 'le_tan');
  assert(l.partner.inc > 0);
  near(l.partner.inc, normalPay);
  assert.equal(l.job, playerJob);
  assert.equal(l.partner.jobHist920.at(-1).to, E.CAR.le_tan.t[0]);
  E.beginYear(l, { auto: true }); l.pending = []; E.finishYear(l);
  assert(l.fin.partner > 0, 'the new salary contributes through the normal household ledger');
}
{
  const l = life('study'), p = l.partner;
  l.flags.kin920 = { arr: { kind: 'pause', at: 30, saved: { job: 'kế toán', jobId: 'ke_toan', inc: 10, at: 30, country: 'US' } } };
  choose(l, shower(l), 'yes');
  years(l, 2);
  assert.equal(p.training976.study, l.age);
  assert(!option(menu(l), 'apply'), 'work preparation alone is not a language credential');
  l.flags.kin920.arr.saved.country = 'FR';
  assert(!option(menu(l), 'return'), 'an old job abroad is not restored in the current country');
  l.flags.kin920.arr.saved.country = 'US';
  for (let i = 0; i < 5 && !p.inc; i++) {
    choose(l, menu(l), 'return');
    if (!p.inc) years(l);
  }
  assert.equal(p.jobId, 'ke_toan');
  assert(p.inc > 0 && p.inc <= 10);
  assert.equal(l.flags.kin920.arr.kind, 'both');
}
console.log('PASS 9.7.6: paid and low-cost terms, deferred and paused plans, old saves, interviews, household income and return to work.');
