'use strict';
const assert = require('assert'), { game } = require('./hardcore-isolation');
const E = game(), clone = x => JSON.parse(JSON.stringify(x)); let checks = 0;
function ok(x, why) { checks++; assert(x, why); }
function fresh(age, kind = 'wealthy') {
  const l = E.createLife({ mode: 'vn', difficulty: 'hardcore', seed: 77010, noOrphan: true });
  l.age = age; l.indep = age >= 18; l.school = age < 18 ? 'upper' : null;
  Object.assign(l.fam, { q: kind === 'wealthy' ? 5 : kind === 'comfortable' ? 3 : 1, elite: null, mInc: 0, fInc: 0 });
  l.money = age >= 18 ? l.base * (kind === 'wealthy' ? 20 : kind === 'comfortable' ? 1 : 0) : 0;
  return l;
}
const explanatory = /Cách gia đình phản ứng|để lại ảnh hưởng lâu dài|Quỹ dự phòng vừa|Những khoản nhỏ dồn|quỹ gia đình [+-]|cảm xúc [+-]|đây không phải khoản nợ/;
for (const row of E.HARDCORE_CATALOG) for (const kind of ['struggling','comfortable','wealthy']) {
  const l = fresh(Math.floor((row.min + Math.min(80, row.max)) / 2), kind);
  if (row.need === 'job') E.startJob(l, 'ke_toan', () => .5, () => {}, true);
  const d = E.DEC[row.id].make(l, () => .5);
  ok(!explanatory.test(JSON.stringify(d)), row.id + ': natural narrative / hints for ' + kind);
  for (const option of d.opts) {
    const x = clone(l), cash = x.money; x.pending = [clone(d)]; E.resolve(x, option.k);
    ok(Object.values(x.st).every(Number.isFinite) && isFinite(x.money), row.id + ': finite outcome');
    ok(!explanatory.test(x.log.slice(l.log.length).map(e => e.t).join(' ')), row.id + ': no explanatory outcome boilerplate');
    if (x.age < 18) ok(x.money === cash, 'no child spending');
  }
}
for (const age of [0,3,8,13,16]) {
  const l = fresh(age); const h = E.hardcoreState(l); h.resources = 0; h.gap = 90;
  for (let i = 0; i < 12; i++) {
    const id = age < 3 ? 'hc_story_bua_an' : age < 6 ? 'hc_story_do_choi_cu' : age < 11 ? 'hc_story_sach_cu' : age < 15 ? 'hc_story_tai_lieu' : 'hc_story_hoc_phi';
    const d = E.DEC[id].make(l, () => .5);
    ok(!/không dễ mua|phương án rẻ nhất|vay|thiếu tài liệu|sách.*trang thiếu|quỹ dự phòng cạn/.test(d.text + d.opts.map(o => o.l).join(' ')), 'rich childhood never gets material-scarcity version');
    l.pending = [d]; E.resolve(l, 'c1');
  }
  ok(h.resources === 100 && h.gap === 0, 'abstract reserves cannot bankrupt rich family');
  ok(h.trauma > 18, 'wealth does not remove the consequences of emotional neglect');
}
const toyRich = fresh(3), toyPoor = fresh(3, 'struggling');
ok(/không dễ mua/.test(E.DEC.hc_story_do_choi_cu.make(toyPoor, () => .5).text), 'poor family keeps genuine scarcity scene');
ok(/mua ngay/.test(E.DEC.hc_story_do_choi_cu.make(toyRich, () => .5).text), 'rich toy scene is about attachment, not affordability');
toyPoor.fam.mAlive = true; toyPoor.fam.mInc = toyPoor.base;
ok(E.hardcoreContext(toyPoor) === 'wealthy', 'actual family income overrides low legacy class');
toyPoor.fam.mAlive = false;
ok(E.hardcoreContext(toyPoor) === 'struggling', 'dead parent income is not available');
const independent = fresh(25, 'struggling'); independent.fam.q = 5;
ok(E.hardcoreContext(independent) === 'struggling', 'independent adult is evaluated by own funds');
const old = fresh(3), oldRng = old.rs;
old.pending = [{ id:'hc_story_do_choi_cu', title:'Món đồ chơi được vá nhiều lần', text:'Cách gia đình phản ứng sẽ để lại ảnh hưởng lâu dài.', opts:[], data:{amount:123} }];
delete E.hardcoreState(old).contextStories;
E.migrate(old);
ok(!explanatory.test(old.pending[0].text) && /đồ mới/.test(old.pending[0].title), 'already-open rich scene repaired on load');
ok(old.pending[0].data.amount === 123 && old.rs === oldRng, 'repair preserves pending fee and RNG');

function act(l, id, choice) { const d = E.act(l, id); ok(!!d, id + ' available'); E.resolve(l, choice); return d; }
for (const mode of ['normal','hardcore']) {
  const child = fresh(9); child.difficulty = mode; child.talent = 'thể thao'; child.talentSub = 'bơi lội'; child.st.hea = 90; child.skill = 28;
  const money = child.money; act(child, 'vd_training', 'technique');
  ok(child.skill > 30 && E.talentLevel(child).lv === 4, 'sport practice raises actual talent level');
  ok(child.money === money && E.act(child, 'vd_training') === null, 'child free practice, once/year');
  const restored = E.migrate(clone(child));
  ok(restored.skill === child.skill && E.act(restored, 'vd_training') === null, 'save/load retains sport progress and annual limit');
  const before = child.skill; E.DEC.vd_training.apply(child, { data:{at:child.age,discipline:child.talentSub} }, 'technique', () => .5, () => {});
  ok(child.skill === before, 'cannot replay same-year training');
  child.age++; child.acts = 0; child.injured = true;
  const d = E.act(child, 'vd_training'); ok(d.opts.every(o => !/technique|fitness|coach/.test(o.k)), 'injured athlete only has light recovery / exit'); E.resolve(child, 'recovery');
  ok(child.skill === before && child.injured, 'recovery does not grant competition skill or erase injury');
  child.age++; child.acts = 0; child.injured = false; child.skill = 99.8; act(child, 'vd_training', 'technique'); ok(child.skill <= 100, 'skill capped');
}
function player(game = 'Liên Minh Huyền Thoại') {
  const l = fresh(21); l.st.hea = 90; l.talent = 'game'; l.game = game; l.skill = 50;
  E.startJob(l, 'tuyen_thu_es', () => .5, () => {}, true); E.ESPORTS.init(l, () => .5); return l;
}
for (const game of ['Liên Minh Huyền Thoại','Valorant','Liên Quân Mobile','Đấu Trường Chân Lý']) {
  // Use exact game names from the shipped catalog, not assumed aliases.
  const name = E.ESPORTS.data.games[{'Liên Minh Huyền Thoại':'lol','Valorant':'val','Liên Quân Mobile':'aov','Đấu Trường Chân Lý':'tft'}[game]].name;
  for (const method of ['reflex','tactics','recovery']) {
    const l = player(name), s = l.flags.esports, old = clone(s); l.mind.stress = 50;
    act(l, 'es_training', method);
    ok(s.form > old.form && s.experience > old.experience, 'professional training updates match stats');
    ok(method === 'recovery' ? s.reflex === old.reflex && l.mind.stress < 50 : s.reflex > old.reflex, 'training focus has distinct effect');
    ok(l.skill === s.reflex && E.ESPORTS.practiceSkill(l,name) === s.reflex, 'reflex and per-game practice remain synchronized');
    const restored = E.migrate(clone(l));
    ok(restored.flags.esports.reflex === s.reflex && restored.flags.esports.form === s.form && E.act(restored,'es_training') === null, 'save/load retains professional stats and annual limit');
    const stats = JSON.stringify(s); E.DEC.es_training.apply(l, { data:{at:l.age,game:s.game,career:s.careerKey} }, method, () => .5, () => {});
    ok(JSON.stringify(s) === stats && E.act(l,'es_training') === null, 'training cannot be farmed');
    const baseline = clone(l); delete baseline.flags.esports.manualTraining;
    E.ESPORTS.annual(l, () => .5, () => {}, 'work'); E.ESPORTS.annual(baseline, () => .5, () => {}, 'work');
    ok(l.flags.esports.form > baseline.flags.esports.form, 'annual calculation preserves current-year form training');
    const form = l.flags.esports.form; E.ESPORTS.annual(l, () => .5, () => {}, 'work'); ok(l.flags.esports.form === form, 'annual bonus applied once');
    l.age++; l.acts = 0; ok(!!E.act(l,'es_training'), 'practice reopens next year');
  }
}
const stale = player(), d = E.act(stale, 'es_training'), value = stale.skill; stale.job = null; E.resolve(stale,'reflex'); ok(stale.skill === value, 'old training menu cannot boost someone who left esports');
const retired = player(); retired.age = retired.flags.esports.retire; ok(E.act(retired,'es_training') === null, 'retired competitor cannot use professional training');
const annualFirst = player(); E.ESPORTS.annual(annualFirst, () => .5, () => {}, 'work');
const preTraining = annualFirst.flags.esports.form; act(annualFirst, 'es_training', 'recovery');
const postTraining = annualFirst.flags.esports.form; E.ESPORTS.annual(annualFirst, () => .5, () => {}, 'work');
ok(postTraining > preTraining && annualFirst.flags.esports.form === postTraining, 'training after annual calculation also persists without doubling');
const noBonus = clone(annualFirst); delete noBonus.flags.esports.manualTraining;
annualFirst.age++; noBonus.age++; E.ESPORTS.annual(annualFirst, () => .5, () => {}, 'work'); E.ESPORTS.annual(noBonus, () => .5, () => {}, 'work');
ok(annualFirst.flags.esports.form === noBonus.flags.esports.form, 'last-year form bonus does not carry forward');
for (const id of ['vd_training','es_training']) { const l = player(); l.talent = 'thể thao'; l.jailUntil = l.age + 2; ok(E.act(l,id) === null, 'training blocked in jail'); }
ok(E.ACT.filter(a => /^(vd_training|es_training)$/.test(a.id)).every(a => !a.ai), 'optional training never changes automatic lives');
console.log('PASS: ' + checks + ' contextual Hardcore and sports / esports practice checks.');
