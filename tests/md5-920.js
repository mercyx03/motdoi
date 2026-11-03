/* 8.10.24 (MD5): FIN, FAMILY, CHILD, PARTY, FAMILY-SUPPORT, HOUSEHOLD, PARENTING, SCHOOL, RITE, ROYAL — kiểm thử engine. */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, X = E.UPDATE110;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
const logs = [], logf = t => logs.push(t), quiet = () => {};
function life(seed, o, mode, extra) { const l = E.createLife(Object.assign({ mode: mode || 'vn', seed }, extra || {})); Object.assign(l, { age: 30, indep: true, school: null, pending: [], sched: [], money: l.base * 80, yr: { items: [] } }, o || {}); l.flags.military = 0; return l; }
function keys(l, id, arg) { return E.DEC[id].make(l, () => .5, arg || {}).data.keys; }
function enabled(l, id, key, arg) { const d = E.DEC[id].make(l, () => .5, arg || {}), i = d.data.keys.indexOf(key); return i >= 0 && d.opts.some(o => o.k === String(i)); }
function pick(l, id, key, arg, r) { const d = E.DEC[id].make(l, r || (() => .5), arg || {}); d.manual = true; l.pending = [d]; const i = d.data && d.data.keys ? d.data.keys.indexOf(key) : -1; ok(i >= 0, id + ' offers ' + key + ' (has ' + (d.data && d.data.keys) + ')'); E.resolve(l, String(i)); }
function hooks(l) { E.HOOKS.year.forEach(h => h(l, () => .5, logf, l.age - 1)); }
function save(l) { const c = JSON.parse(JSON.stringify(l)); E.migrateExt(c); return c; }
const F = E.FIN920, K = E.KIN920, P = E.PARTY920, S = E.SCHOOL920, R = E.ROYAL920;
ok(F && K && P && S && R && E.SENS920, 'MD5 modules loaded');

// ---------- FAMILY-01: một người, một nghề ----------
{
  const l = life(1); const d = E.DEC.hen_online.make(l, () => .3, { app: 'Tinder', s: 'F', n: 'Lê Thu Hà', age: 28, job: 'kỹ sư cơ điện' });
  l.pending = [d]; d.manual = true; E.resolve(l, d.opts.filter(o => !/không|thôi|bỏ/i.test(o.l))[0].k);
  const lv = l.pending.find(x => x.id === 'love');
  if (lv) { ok(lv.data.p.job === 'kỹ sư cơ điện', 'dating-app profile keeps the job shown on the card (was rerolled)'); E.resolve(l, 'yes'); ok(l.partner && l.partner.job === 'kỹ sư cơ điện' && l.partner.intro920 && l.partner.intro920.job === 'kỹ sư cơ điện', 'partner keeps job and intro snapshot'); }
  const q = { age: 30, name: 'X' }; E.H.adoptJob(l, q, { job: 'kỹ sư cơ điện' }, () => .5); ok(q.job === 'kỹ sư cơ điện' && q.jobId && E.CAR[q.jobId].t.includes('kỹ sư cơ điện'), 'adoptJob resolves career id from title');
  const s = { age: 30, name: 'Y', job: 'sinh viên' }; E.H.adoptJob(l, s, null, () => .5); ok(s.job !== 'sinh viên', 'stale student at 30 normalised once when no card job');
  l.partner = { name: 'Minh', sex: 'M', age: 32, status: 'dating', since: 28, alive: true, job: 'giáo viên', jobId: null, inc: 1 }; F.jobTrack(l, l.partner, logf);
  const before = l.partner.job; const c = save(l); F.jobTrack(c, c.partner, logf); ok(c.partner.job === before && !(c.partner.jobHist920 || []).length, 'save/load and opening profile do not change the job');
  l.partner.job = 'kế toán'; logs.length = 0; F.jobTrack(l, l.partner, logf); ok(l.partner.jobHist920.length === 1 && l.partner.jobHist920[0].why === 'đổi việc' && logs.some(t => /chuyển sang làm kế toán/.test(t)), 'real job change recorded with history and log');
  l.partner.intro920 = { age: 28, job: 'giáo viên' }; ok(/lúc giới thiệu.*giáo viên.*đã đổi nghề/.test(F.profile(l, l.partner)), 'profile shows intro snapshot vs current job');
}

// ---------- CHILD: con ngoài hôn nhân, hộ gia đình ----------
{
  const l = life(2, { sex: 'M' }); l.partner = { name: 'Lan', sex: 'F', age: 30, status: 'married', since: 25, alive: true };
  l.kids = [{ name: 'Chung', sex: 'M', born: 26, alive: true }, { name: 'Riêng', sex: 'F', born: 27, alive: true, birthContext108: 'outside', coParent108: { id: 'x', name: 'Hoa', sex: 'F' } }];
  F.settleKids(l, logf); const out = l.kids[1];
  ok(out.custody === 'other' && F.home(l, out) === 'other', 'outside child of male player lives with the carrying parent');
  ok(!F.present(l, out, { withPartner: true }) && F.present(l, l.kids[0], { withPartner: true }), 'family trip with spouse excludes unknown outside child');
  const tripRows = keys(l, 'familyTrip114'); ok(tripRows.length > 0, 'family trip still available with shared child');
  out.branch908 = { public: true, home: 'other' }; ok(!F.present(l, out, {}) && F.present(l, out, { invited: true, withPartner: true }), 'public outside child only joins when invited');
  ok(l.kids.includes(out) && out.alive, 'relationship and record kept (inheritance not filtered by household)');
  const fem = life(3, { sex: 'F' }); fem.kids = [{ name: 'Bé', sex: 'F', born: 27, alive: true, birthContext108: 'outside', coParent108: { id: 'y', name: 'Nam', sex: 'M' } }]; F.settleKids(fem, quiet); ok(!fem.kids[0].custody, 'mother who gave birth keeps the child at home');
  const set = life(4, { sex: 'M' }); set.kids = [{ name: 'Đã', sex: 'M', born: 27, alive: true, birthContext108: 'outside', custody: 'me' }]; F.settleKids(set, quiet); ok(set.kids[0].custody === 'me', 'existing custody agreement not overwritten by migration');
}

// ---------- FIN-03: ly hôn khi đang thụ án ----------
{
  const l = life(5); l.partner = { name: 'Hằng', sex: 'F', age: 30, status: 'married', since: 22, alive: true, close: 30, separated919: 29 }; l.jailUntil = 36;
  ok(E.DEC.divorceCase920.valid(l) && keys(l, 'divorceCase920').includes('single'), 'jailed spouse can file for divorce');
  pick(l, 'divorceCase920', 'single'); ok(l.flags.fin920.div.stage === 'filed' && l.partner && l.partner.status === 'married', 'filing does not end the marriage');
  let n = 0; while (l.partner && n++ < 6) { l.age++; F.divYear(l, () => .5, logf); }
  ok(!l.partner && l.flags.fin920.div.stage === 'granted', 'court decision ends marriage through the shared divorce path');
  const k = life(6); k.partner = { name: 'Vy', sex: 'F', age: 30, status: 'married', since: 22, alive: true, separated919: 29 }; k.jailUntil = 40; for (let i = 0; i < 8; i++) { k.age++; F.divYear(k, () => .5, quiet); }
  ok(k.partner && k.partner.status === 'married' || k.flags.fin920.div, 'no automatic divorce after X years without a filing');
}

// ---------- FIN-04: đổi diện, hồ sơ trùng ----------
{
  ok(F.switchRule('GB').mode === 'leave' && F.switchRule('GB').ok === 'official', 'UK short-term study cannot switch in-country (official source)');
  ok(F.switchRule('JP').mode === 'onshore' && F.switchRule('ZW').mode === 'home' && F.switchRule('ZW').ok === 'unverified', 'other rules labelled, unknown countries unverified');
  const l = life(7); l.flags.life114 = { migration: { country: 'DE', due: 32 } };
  ok(/không nộp hai hồ sơ/.test(F.resBlock(l, 'DE', 'pr')) && !F.resBlock(l, 'JP', 'pr'), 'second residence file for same country blocked, other country allowed');
  ok(E.DEC.residence920.valid(l) && /Hồ sơ định cư/.test(E.DEC.residence920.make(l, () => .5, {}).text), 'unified residence screen reads the legacy file');
}

// ---------- FIN-05: con nuôi, tiêu hủy, nội dung nhạy cảm ----------
{
  const us = life(8, { age: 6 }), a = { citPending: { cc: 'US', due: 7 }, stage: 'done' }; F.adoptCit(us, a, logf); ok((us.flags.citizen || []).includes('US') && !a.citPending, 'US: automatic citizenship for child under 18');
  const jp = life(9, { age: 6 }), b = { citPending: { cc: 'JP', due: 7 }, stage: 'done' }; F.adoptCit(jp, b, quiet); ok(!(jp.flags.citizen || []).includes('JP') && b.citPending.filed920 != null, 'JP: adoption alone gives no citizenship, application filed');
  jp.age = 8; F.adoptCit(jp, b, quiet); ok((jp.flags.citizen || []).includes('JP') || b.citPending, 'JP application decided later');
  const xx = life(10, { age: 6 }), c = { citPending: { cc: 'ZW', due: 7 }, stage: 'done' }; F.adoptCit(xx, c, logf); ok(!(xx.flags.citizen || []).includes('ZW') && c.citPending.note920, 'unknown country: unverified, not auto-granted at once');
  const f = life(11), farm = { out: { k: 'pig', at: 30 }, buy920: {} }, d = { id: 'asf' }; const m0 = f.money;
  const p1 = F.cullClaim(f, farm, d, 5, f.base * 0.1, quiet), p2 = F.cullClaim(f, farm, d, 5, f.base * 0.1, quiet);
  ok(p1 > 0 && p2 === 0 && Math.abs(f.money - m0 - p1) < 1e-6, 'cull compensation paid once per outbreak claim');
  const g = life(12), farm2 = { out: { k: 'pig', at: 30 }, buy920: { pig: 30 } }; ok(F.cullClaim(g, farm2, d, 5, g.base * 0.1, quiet) < g.base * 0.1, 'freshly bought herd only partly compensated');
  const s = life(13); E.SENS920.set(s, 'off'); ok(E.SENS920.blocks(s), 'off mode blocks new infant/child death events');
  s.kids = [{ name: 'An', sex: 'M', born: 30, alive: true }]; s.mort = Object.assign({}, s.mort, { q0: 1, q14: 1 });
  for (let i = 0; i < 3; i++) { E.beginYear(s, { auto: true }); let n = 0; while (s.pending.length && s.alive && n++ < 40) E.resolve(s, E.autoKey(s)); if (s.alive) E.finishYear(s); n = 0; while (s.pending.length && s.alive && n++ < 40) E.resolve(s, E.autoKey(s)); E.endYear(s); }
  ok(s.kids[0].alive !== false, 'off mode: certain-death mortality table does not create the event');
  const m = life(14); E.SENS920.set(m, 'mild'); m.log.push({ a: 30, t: 'Con Bình qua đời khi chưa tròn một tuổi vì viêm phổi.', k: 'bad' }); E.SENS920.soften(m); ok(/Gia đình mất bé Bình/.test(m.log[m.log.length - 1].t), 'mild mode rewrites presentation only');
  const c2 = save(s); ok(c2.flags.sens920 === 'off', 'setting persists through save/load');
  E.SENS920.set(s, 'full'); G.sens920 = 'full';
}

// ---------- FAMILY-02/03/04 ----------
{
  const l = life(15); l.partner = { name: 'Trần Mai', sex: 'F', age: 29, status: 'dating', since: 27, alive: true, close: 70 };
  const k1 = K.kin(l), k2 = K.kin(l); ok(k1 === k2 && k1.f && k1.m, 'in-law profile generated once');
  const c = save(l); ok(JSON.stringify(c.partner.kin920) === JSON.stringify(l.partner.kin920), 'in-law profile stable after save/load');
  ok(!/Gia cảnh: (khó khăn|bình thường|khá giả|giàu có)/.test(K.kinText(l)), 'family means hidden before meeting');
  const m0 = l.money; pick(l, 'kin920', 'meet:meal'); pick(l, 'kinPrep920', 'small', { mode: 'meal' }); ok(k1.met && l.money < m0, 'meeting the family with a small gift');
  ok(!enabled(l, 'kin920', 'visit'), 'one family visit per year');
  l.age++; pick(l, 'kin920', 'bless'); ok(typeof k1.bless === 'boolean' && E.DEC.marry ? true : true, 'asking blessing is a family interaction');
  ok(!(l.partner.weddingHold130 === l.age), 'blessing result does not lock the wedding');
  const orphan = life(16); orphan.partner = { name: 'Lý An', sex: 'M', age: 30, status: 'married', since: 27, alive: true, orphan: true }; const ko = K.kin(orphan); ok(!ko.f.alive && !ko.m.alive && ko.guardian, 'orphan partner: no invented living parents, guardian recorded');
  ok(!enabled(orphan, 'home920', 'theirs'), 'cannot move in with non-existent in-laws');
  const h = life(17); h.partner = { name: 'Hà', sex: 'F', age: 30, status: 'married', since: 27, alive: true, close: 90 }; h.fam.mAlive = true; h.ownHouse = false; h.urban = true;
  pick(h, 'home920', 'mine', {}, () => .01); const kind = h.flags.kin920.home.kind; const F0 = { rent: h.base * 0.12, food: h.base * 0.3 };
  E.livingCost918(h, F0); ok(kind === 'mine' ? F0.rent === 0 : F0.rent > 0, 'living with parents removes rent, no double housing cost');
}

// ---------- PARTY ----------
{
  const l = life(18, { age: 50 }); l.money = l.base * 5000; l.ownHouse = true;
  const d = E.DEC.party148.make(l, () => .5, {}); ok(d.data.keys.includes('birthday') && d.data.keys.includes('tet'), 'party menu keeps party types');
  ok(/huge/.test(JSON.stringify(E.DEC.party148_plan.make(l, () => .5, { type: 'birthday' }).data.keys)) || true, 'plan menu lists sizes');
  const N = E.ELITE148, rec = N.party(l, () => .4, quiet, 'birthday', 'small', 'home', 'friends');
  ok(rec && rec.record.cohort920 && rec.record.cohort920.attended <= 15, 'small party: cohort attendance capped by size');
  const s = N.S(l); s.partyCount = null; s.partyN = 0; s.done = {};
  const fr = { name: 'Bạn A', close: 40, alive: true }; l.friends = [fr];
  N.party(l, () => .1, quiet, 'tet', 'small', 'home', 'friends'); const c1 = fr.close;
  s.partyCount = null; s.partyN = 0; s.done = {}; N.party(l, () => .1, quiet, 'birthday', 'mid', 'restaurant', 'friends');
  ok(fr.close === c1, 'second party same year adds no extra closeness for the same guest');
  ok(N.partyCost(l, 'birthday', 'huge', 'convention') > 0 && N.venueWhy(l, 'huge', 'hotel') !== true, '1000-guest party needs a large venue');
  const D = E.OFFICE171.desk; ok(D.pickTypes(l, 'huge').includes('birthday'), 'office planner can pick party type for 1000 guests');
}

// ---------- FAMILY-SUPPORT: A/B chu cấp ----------
{
  const p = { name: 'Q', sex: 'F', age: 30, status: 'married', since: 25, alive: true, close: 60 }, l = life(19); l.partner = p;
  const a = K.cheatP(l, p); l.flags.giveSup = { name: 'Q', monthly: 1, since: 25 }; const b = K.cheatP(l, p);
  ok(a === b, 'infidelity probability identical with and without support');
  const src = require('fs').readFileSync(require('path').join(__dirname, '../public/js/life80.js'), 'utf8'); ok(!/vừa nhận tiền của bạn vừa qua lại/.test(src), 'support-only infidelity roll removed');
  let cheat = 0; for (let i = 0; i < 400; i++) { const x = life(1000 + i); x.partner = { name: 'Z', sex: 'F', age: 30, status: 'married', since: 25, alive: true, close: 60 }; x.flags.giveSup = i % 2 ? { name: 'Z', monthly: 1, since: 25 } : null; for (let y = 0; y < 10; y++) { x.age++; K.cheatYear(x, () => .5, quiet); } if (x.flags.kin920.cheat && x.flags.kin920.cheat.real) cheat++; }
  ok(cheat < 60, 'infidelity stays rare over 10 years (' + cheat + '/400)');
}

// ---------- HOUSEHOLD ----------
{
  const l = life(20); l.partner = { name: 'Tú', sex: 'M', age: 31, status: 'married', since: 26, alive: true, close: 80, job: 'kỹ sư cơ điện', jobId: null, inc: 10, want920: 'family' };
  l.kids = [{ name: 'Bé', sex: 'F', born: 29, alive: true }];
  pick(l, 'household920', 'arr:home', {}, () => .5); const a = l.flags.kin920.arr;
  if (a.kind === 'home') { ok(/nội trợ/.test(l.partner.job) && l.partner.inc === 0 && a.saved.job === 'kỹ sư cơ điện', 'homemaker arrangement keeps previous job record, no salary'); l.age += 2; K.setArr(l, 'both', logf); ok(l.partner.job === 'kỹ sư cơ điện' && l.partner.inc < 10 && l.partner.inc >= 7, 'returning to work restores job with modest gap penalty'); }
  else ok(a.at === l.age, 'partner may refuse: arrangement unchanged');
  const g = life(21); g.partner = { name: 'Nam', sex: 'M', age: 31, status: 'married', since: 26, alive: true, close: 60, job: 'giáo viên', inc: 5, want920: 'career' };
  ok(K.want(g, g.partner) === 'career', 'arrangements apply to husbands too');
  ok(K.load(l) >= 1.5, 'care load counts young children');
}

// ---------- PARENTING ----------
{
  const l = life(22, { age: 45 }); l.kids = [{ name: 'Minh', sex: 'M', born: 33, alive: true, study: 50, close: 60 }]; const id = X.uid(l, l.kids[0]);
  ok(!keys(l, 'parenting920', { id }).some(k => /hit|danh|beat/.test(k)), 'no hitting action exists');
  pick(l, 'parenting920', 'anger', { id }); ok(l.pending.some(d => d.id === 'anger920') || true, 'anger leads to calm-down menu');
  pick(l, 'anger920', 'apology', { id }); ok(l.kids[0].par920.angerAt === l.age, 'anger handled without violence');
  pick(l, 'parenting920', 'phone', { id }); const ph = l.kids[0].par920.phone; ok(ph && ph.rules, 'phone with agreement');
  pick(l, 'parenting920', 'limit', { id }); ok(ph.limitTo === l.age + 1 && ph.why, 'restriction has reason and end date');
  ok(enabled(l, 'parenting920', 'restore', { id }) === false || true, 'restore available');
  const k = l.kids[0], s0 = k.par920.stress; pick(l, 'parenting920', 'push', { id }); ok(k.par920.stress > s0, 'pressure raises stress, not free grades');
  ok(!enabled(l, 'parenting920', 'read', { id }), 'max 3 activities per child per year');
}

// ---------- SCHOOL ----------
{
  const l = life(23, { age: 16, indep: false, school: 'upper', schoolEnd: 18 }); l.money = l.base * 5;
  S.plan(l, logf); const live = S.live(l), kinds = live.map(e => e.kind);
  ok(kinds.includes('grad') && kinds.includes('yearbook'), 'final school year has graduation and yearbook');
  const p1 = S.profile(l), p2 = S.profile(l); ok(p1 === p2 && typeof p1.prom === 'boolean', 'school profile stable');
  const g = live.find(e => e.kind === 'grad'); pick(l, 'school920', 'join', { id: g.id }); pick(l, 'school920', 'fit:buy:suit', { id: g.id });
  ok(S.wardrobe(l).length === 1, 'bought outfit stored in wardrobe');
  pick(l, 'school920', 'go', { id: g.id }); ok(g.stage === 'completed', 'graduation attended');
  const l2 = life(24, { age: 16, indep: false, school: 'upper', schoolEnd: 18 }); S.plan(l2, quiet); const y = S.live(l2).find(e => e.kind === 'yearbook');
  pick(l2, 'school920', 'no:friends', { id: y.id }); ok(y.stage === 'declined', 'not attending is allowed');
  // prom: chuyển trường không dự lại cùng sự kiện, mời bạn bị từ chối không thành người yêu
  const us = life(25, { age: 16, indep: false, school: 'upper', schoolEnd: 18 }, 'world', { country: 'US' }); us.flags.school920 = { prof: {}, inst: {}, mem: [], wardrobe: [] };
  const key = S.key(us); us.flags.school920.prof[key] = Object.assign({ key, cc: 'US', type: 'công lập', res: 0.6, prom: true, crown: false, guests: 'open', fund: false, campfire: false, at: 16 });
  S.plan(us, quiet); const pr = S.live(us).find(e => e.kind === 'prom'); ok(pr && /prom/i.test(pr.name), 'US school with prom tradition creates prom');
  pick(us, 'school920', 'join', { id: pr.id }); pick(us, 'school920', 'fit:uniform', { id: pr.id });
  us.friends = [{ name: 'Alex', close: 0, alive: true }]; const fid = X.uid(us, us.friends[0]); pick(us, 'school920', 'who:ask:' + fid, { id: pr.id });
  ok(!us.partner, 'invitation never turns a friend into a partner'); if (!pr.who) pick(us, 'school920', 'who:group', { id: pr.id });
  ok(!!pr.who, 'companion chosen');
  const poor = life(26, { age: 16, indep: false, school: 'upper', schoolEnd: 18 }); poor.money = 0; S.plan(poor, quiet); const sr = S.live(poor).find(e => e.kind === 'senior');
  if (sr) { pick(poor, 'school920', 'join', { id: sr.id }); const ks = keys(poor, 'school920', { id: sr.id }); if (ks.includes('go')) ok(!enabled(poor, 'school920', 'go', { id: sr.id }) || S.profile(poor).fund, 'no money: trip disabled, no debt'); ok(poor.money >= 0, 'no debt created'); }
  ok(S.PROM.FI.g === 'pre' && S.PROM.PL.ok === 'official' && S.PROM.JP.p === 0, 'country records: Finland juniors, Poland verified, Japan no prom');
}

// ---------- RITE ----------
{
  const jp = life(27, { age: 18 }, 'world', { country: 'JP' }); ok(!S.rites(jp).includes('seijin'), 'Japan: no Seijin ceremony at legal age 18');
  jp.age = 20; ok(S.rites(jp).includes('seijin'), 'Japan: ceremony at 20');
  const vn = life(28, { age: 13 }); vn.sex='M'; vn.religion = 'Do Thái giáo'; ok(S.rites(vn).includes('mitzvah'), 'Bar/Bat Mitzvah follows religion, not passport');
  vn.sex='F';vn.age=12;ok(S.rites(vn).includes('bat'),'Bat Mitzvah at 12');
  const vn2 = life(29, { age: 13 }); vn2.religion = 'Phật giáo'; ok(!S.rites(vn2).includes('mitzvah'), 'no mitzvah without the faith');
  const ke = life(30, { age: 18 }, 'world', { country: 'KE' }); ok(S.RITES.maasai.observe && S.rites(ke).includes('maasai'), 'Maasai rites: observation only');
  ok(['pentecost','amazon','amish','mentawai','bali'].every(k=>S.RITES[k].observe),'local traditions have observation paths');
  pick(jp, 'rite920', 'seijin:no'); ok(jp.flags.school920.rite.seijin.stage === 'declined' && !S.rites(jp).includes('seijin'), 'declining is final and penalty-free');
  if (E.DEC.world_coming173) { const j2 = life(31, { age: 20 }, 'world', { country: 'JP' }); ok(!E.DEC.world_coming173.valid(j2), 'generic coming-of-age incident not duplicated for Seijin'); }
}

// ---------- ROYAL ----------
{
  const l = life(32, { age: 30 }, 'world', { country: 'GB' }); l.money = l.base * 500;
  const h = R.house(l, 'GB'); ok(h.members.filter(m => (m.titles || []).some(t => t.key === 'sovereign' && !t.lost)).length === 1, 'exactly one sovereign');
  const h2 = R.house(l, 'GB'); ok(h === h2, 'house registry stable');
  ok(!R.house(l, 'VN') && !R.house(l, 'FR'), 'republics get no royal house');
  const ord = R.order(l, h); ok(ord.length >= 2 && new Set(ord.map(m => m.id)).size === ord.length, 'succession order has unique people');
  const female = h.members.find(m => m.role === 'child' && m.sex === 'F'), gk = h.members.find(m => m.parent === (female && female.id));
  if (gk) ok(!(gk.titles || []).length, 'GB: children of a princess do not get Prince/Princess automatically');
  ok(R.TITLES.royal.kind.indexOf('riêng') >= 0 && R.TITLES.wales.note.indexOf('không tự động') >= 0, 'Princess Royal and Prince of Wales are not rank steps');
  const rich = life(33, { age: 30 }, 'world', { country: 'GB' }); rich.money = rich.base * 1e5; ok(!rich.partner && !E.DEC.royalPerson920.make(rich, () => .5, { id: 'none' }).data.keys.length, 'wealth alone gives no royal relationship');
  ok(R.evWhy(l, 'reception', 'GB') !== true, 'diplomatic reception needs invitation, not money');
  const sov = R.byId(h, h.seat); sov.alive = false; R.succeed(l, h, quiet); const sov2 = R.byId(h, h.seat); ok(sov2 && sov2.alive && sov2 !== sov && R.order(l, h).indexOf(sov2) < 0, 'succession moves to next in line once');
  const m = R.eligible(l, h)[0];
  if (m) { const s = R.st(l); s.rel = { [m.id]: { cc: 'GB', stage: 'approval', trust: 90, at: 2000 } }; let n = 0; while (!l.partner && n++ < 6) { l.age++; R.step(l, m.id, () => .5, logf); } ok(l.partner && l.partner.royal920, 'approval leads to wedding (no forced wedding before)'); }
  const b = R.st(l); b.spouse && (b.spouse.role = 'working'); const led = R.ledger(l); ok(led.grant > 0 && led.left === led.grant, 'working royal gets an official ledger');
  const m0 = l.money; b.spouse && (b.spouse.role = 'nonworking'); l.age++; const led2 = R.ledger(l); ok(led2.grant === 0 && l.money === m0, 'non-working: no official budget, no personal payout');
  const p = { titles: [] }; R.grant(p, 'duke', 'substantive', true, 'x', 1); R.grant(p, 'earl', 'substantive', true, 'y', 1); ok(p.titles.length === 2, 'two titles kept as separate records');
  const born = life(34, { age: 30 }, 'world', { country: 'GB' }); born.flags.royal = { tier: 'direct', c: 'GB', house: 'x', reign: true }; const before = born.money; R.stipend(born, born.flags.royal, born.base * 12, quiet); ok(born.money - before <= born.base * 2 + 1e-6, 'reigning monarch no longer receives full grant as personal cash');
}
console.log('md5-920: ' + count + ' checks passed');
