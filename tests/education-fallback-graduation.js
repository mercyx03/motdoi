'use strict';
const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E;
let checks = 0;
function ok(value, label) { assert(value, label); checks++; }
function life(mode = 'vn', difficulty = 'normal') {
  const l = E.createLife({mode, country: mode === 'vn' ? 'VN' : 'US', difficulty, seed: 10722, year: 2000});
  Object.assign(l, {age: 21, edu: 3, school: null, schoolEnd: null, pending: [], sched: [], abroad: null, jailUntil: null, indep: true});
  l.money = l.base * 100;
  l.st.kno = 90; l.st.hea = 100;
  delete l.flags.military;
  return l;
}
function pick(l, id, key, arg, r = () => .5) {
  const d = E.DEC[id].make(l, r, arg);
  const k = d.data && d.data.keys ? String(d.data.keys.indexOf(key)) : key;
  ok(d.opts.some(o => o.k === k), id + ' offers ' + key);
  E.DEC[id].apply(l, d, k, r, () => {});
  return d;
}
function student(mode, difficulty) {
  const l = life(mode, difficulty);
  l.school = 'uni'; l.schoolEnd = 22; l.major = 'eco';
  l.uniName = E.EDUCATION54.schools.find(u => u.language111.exit === 1).name;
  l.flags.world120 = {debtCredits: 0, absences: 0};
  l.lang = {en: 2}; l.langAt = {en: 21}; l.langExp = {};
  return l;
}
for (const mode of ['vn', 'world']) for (const difficulty of ['normal', 'hardcore']) {
  const l = life(mode, difficulty);
  l.age = 18;
  // A real rejection must retain the domestic route without giving a degree or admission.
  pick(l, 'abroad107', '5');
  pick(l, 'abroad107_country', 'FR', l.pending.pop().data);
  pick(l, 'abroad107_school', '0', l.pending.pop().data);
  pick(l, 'abroad107_field', 'eco', l.pending.pop().data);
  const application = l.pending.pop();
  E.DEC.abroad107_apply.apply(l, application, 'scholar', () => .999, () => {});
  ok(l.pending.some(d => d.id === 'domestic107'), 'rejection offers domestic choice');
  ok(!l.school && !l.abroad && l.edu === 3, 'fallback does not automatically admit');

  l.flags.studyVisa900 = {lv: 5, country: 'FR', until: 19, deposit: 50, unpaid919: 100};
  const cash = l.money;
  l.pending.push(E.DEC.studyVisa900.make(l, () => .5));
  const saved = JSON.parse(JSON.stringify(l));
  const visaCard = saved.pending.find(d => d.id === 'studyVisa900');
  visaCard.data.keys = visaCard.data.keys.filter(k => k !== 'domestic');
  E.migrateExt(saved);
  ok(visaCard.data.keys.includes('domestic'), 'legacy visa card gains domestic option');
  const oldOffer = saved.flags.studyVisa900;
  pick(saved, 'studyVisa900', 'domestic');
  ok(saved.money === cash + 50 && !saved.flags.studyVisa900, 'refund exactly the paid deposit');
  ok(!saved.pending.some(d => /^(du_hoc|abroad107|studyVisa900)/.test(d.id)), 'stale foreign application removed');
  ok(saved.pending.some(d => d.id === 'study_wishes54'), 'domestic wishes opened');
  E.DOMESTIC107.open(saved, () => .5, () => {});
  ok(saved.money === cash + 50, 'retry cannot duplicate refund');
  ok(saved.edu === 3 && !saved.school, 'domestic application still needs admission');
  saved.school = 'uni';
  ok(!E.DOMESTIC107.ready(saved), 'enrolled student cannot reopen fallback');
  saved.school = null; saved.edu = 5;
  ok(!E.DOMESTIC107.ready(saved), 'postgraduate route unaffected');
  ok(oldOffer.unpaid919 === 100, 'unpaid fees are not refunded');

  const s = student(mode, difficulty);
  s.langExp.en = true;
  const menu = E.DEC.studyReview136.make(s, () => .5);
  ok(menu.text.includes('đã hết hạn') && menu.text.includes('Đã hoàn tất tín chỉ'), 'specific expired certificate diagnosis');
  ok(E.gradFail(s, () => 0, () => {}, s.age), 'expired language still prevents graduation');
  pick(s, 'studyReview136', 'renew');
  const renewal = s.pending.find(d => d.id === 'chung_chi_het_han');
  ok(renewal && renewal.data.k === 'en', 'renewal targets the required language');
  E.DEC.chung_chi_het_han.apply(s, renewal, 'retest', () => .5, () => {});
  ok(E.EDU111.exitRequirement(s).met, 'renewed certificate meets actual graduation rule');
  s.age++; s.pending = [];
  pick(s, 'studyReview136', 'defense');
  const defense = s.pending.find(d => d.id === 'bao_ve_tn');
  E.DEC.bao_ve_tn.apply(s, defense, 'doc_suc', () => 0, () => {});
  ok(s.flags.gradOK, 'direct defense can pass through existing decision');
  ok(!E.gradFail(s, () => .999, () => {}, s.age), 'passed defense is retained for graduation');
}
const l = student();
l.flags.world120.debtCredits = 3;
ok(E.gradFail(l, () => 0, () => {}, l.age), 'credit debt still blocks');
ok(E.DEC.studyReview136.make(l, () => .5).text.includes('Còn nợ 3'), 'credit shortfall shown');
l.flags.world120.debtCredits = 0; l.flags.world120.absences = 2;
ok(E.gradFail(l, () => 0, () => {}, l.age), 'attendance still blocks');
l.flags.world120.absences = 0; l.flags.world120.academicCase = {status: 'pending'};
ok(E.gradFail(l, () => 0, () => {}, l.age), 'academic review still blocks');
ok(E.DEC.studyReview136.make(l, () => .5).text.includes('đang chờ xác minh'), 'academic hold shown');

const graduate = student();
graduate.flags.gradOK = true;
E.finishYear(graduate);
ok(graduate.edu >= 5 && !graduate.school, 'real year-end awards degree after all conditions');

const legacy = life();
legacy.flags.study54 = {submitted: true, wishAge: legacy.age};
ok(!E.DOMESTIC107.ready(legacy), 'same-year domestic submission cannot reroll');
legacy.age++;
ok(E.DOMESTIC107.ready(legacy), 'next-year applicant can reapply');
console.log('PASS education fallback and graduation: ' + checks + ' checks');

