/* MD4 (8.10.22) D01–D17: kiểm thử logic mới và tương tác với các hệ hiện có. */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, W = G.W;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
const quiet = () => {}, logs = [], logf = (t) => logs.push(t);
function life(seed, o, mode) { const l = E.createLife({ mode: mode || 'vn', seed }); Object.assign(l, { age: 30, indep: true, school: null, pending: [], sched: [], money: l.base * 50, yr: { items: [] } }, o || {}); l.flags.military = 0; return l; }
function hooks(l) { E.HOOKS.year.forEach(h => { try { h(l, () => .5, logf, l.age - 1); } catch (e) { throw e; } }); }
function rows(l, id, arg) { const d = E.DEC[id].make(l, () => .5, arg || {}); return d; }
function pick(l, id, key, arg) { const d = E.DEC[id].make(l, () => .5, arg || {}); d.manual = true; l.pending = [d]; const i = d.data && d.data.keys ? d.data.keys.indexOf(key) : -1; ok(i >= 0, id + ' offers ' + key + ' (have ' + (d.data && d.data.keys || []).join(',') + ')'); E.resolve(l, String(i)); }
function has(l, id, key, arg) { const d = E.DEC[id].make(l, () => .5, arg || {}); return d.data && d.data.keys && d.data.keys.indexOf(key) >= 0; }
['ID919', 'GLOBAL919', 'FOLLOW919', 'CARE919', 'PETS919', 'ARTS919', 'HEALTH919', 'ORIGIN919'].forEach(k => ok(!!E[k], 'module ' + k));
const { ID919: I, GLOBAL919: GL, FOLLOW919: F, CARE919: C, PETS919: P, ARTS919: A, HEALTH919: HS, ORIGIN919: O } = E;

// ---------- D11: về thăm đúng quê nhà ----------
{
  const l = life(11, {}, 'world'); l.country = 'IN'; l.flags.citizen = []; l.abroad = { code: 'FR', name: W.BY.FR.name, until: 40, perm: false, study: true }; l.cur = 'usd';
  ok(GL.homes(l)[0] === 'IN', 'Indian character home = IN');
  ok(E.TRANSIT907.dest(l) === 'IN', 'home visit destination IN, not VN');
  const acts = E.actions(l), hv = acts.find(a => a.id === 'homeVisit907'); ok(hv && /Ấn Độ/.test(hv.l) && !/Việt Nam/.test(hv.l), 'action label names India: ' + (hv && hv.l));
  const d = rows(l, 'homeVisit907'); ok(/Ấn Độ/.test(d.text), 'menu text names India');
  l.flags.citizen = ['GB']; l.flags.id919 = Object.assign(l.flags.id919 || {}, { familyRes: ['AE'] }); ok(GL.homes(l).join() === 'IN,GB,AE', 'several homes: origin, citizenship, family residence');
  ok(has(l, 'homeVisit907', 'to:GB'), 'can choose another valid home');
  const m0 = l.money; ok(E.TRANSIT907.arrive(l, quiet) && E.H.resCode(l) === 'IN' && !l.abroad, 'arrives home in India'); ok(l.yr.items.filter(x => /Vé máy bay khứ hồi về Ấn Độ/.test(x.t)).length === 1, 'fare paid once, labelled India');
  ok(E.TRANSIT907.restore(l, quiet) && l.abroad.code === 'FR', 'returns to France with study residence intact');
  const v = life(12); v.abroad = { code: 'JP', name: 'Nhật Bản', until: 40, perm: false }; ok(E.TRANSIT907.dest(v) === 'VN', 'Vietnamese save still flies to Vietnam');
}
// ---------- D11: chương trình du học ----------
{
  ok(Object.keys(GL.P).length >= 22, '22+ study destinations');
  ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'BE', 'CH', 'ES', 'PL', 'CZ', 'AT', 'SE', 'FI', 'NL', 'SG', 'CN', 'TW', 'HK', 'MY'].forEach(c => ok(GL.P[c], 'program ' + c));
  ok(GL.program('DE', 5).tuitionUsd < 1000 && /Baden/.test(GL.P.DE.note), 'Germany: semester fee only, BW exception documented');
  ok(GL.program('CZ', 5, 'cs').tuitionUsd === 0 && GL.program('CZ', 5, 'en').tuitionUsd > 0, 'Czech-taught free, English-taught paid');
  ok(GL.bloc('CH').schengen && !GL.bloc('CH').eu && GL.bloc('IE').eu && !GL.bloc('IE').schengen && GL.bloc('NO').eea && !GL.bloc('NO').eu, 'EU / EEA / Schengen kept separate');
  const l = life(13, { age: 22, edu: 3 }); l.st.kno = 90; l.lang = {}; let a = GL.admit(l, { country: 'DE', lv: 5 }); ok(!a.ok && /tiếng Đức/.test(a.why), 'German-taught program refuses without German');
  l.lang = { en: 3 }; l.langAt = { en: 22 }; E.GLOBAL919.state(l).track.DE = 'en'; a = GL.admit(l, { country: 'DE', lv: 6 }); ok(a.track === 'en', 'English track uses English level');
  let admittedNoSchol = 0; for (let i = 0; i < 200; i++) { const q = life(1300 + i, { age: 22, edu: 4 }); q.lang = { en: 4 }; q.langAt = { en: 22 }; q.st.kno = 70; if (GL.admit(q, { country: 'US', lv: 6 }).ok && GL.scholarship(q, { country: 'US', lv: 6 }).pct === 0) admittedNoSchol++; }
  ok(admittedNoSchol > 0, 'admission and scholarship are separate outcomes (' + admittedNoSchol + ' admitted without scholarship)');
  ok(!GL.P.DE.schol.length && GL.P.DE.living, 'Germany: living scholarships, not tuition %');
}
// ---------- D16.1: pool gặp gỡ theo nơi đang sống ----------
{
  const l = life(20, { age: 21 }); l.abroad = { code: 'DE', name: W.BY.DE.name, until: 25, perm: false, study: true }; l.flags.study107 = { finished: false };
  ok(GL.ctx(l) === 'campus', 'student abroad = campus context');
  const groups = { local: 0, intl: 0, compat: 0 }; let s = 7; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 600; i++) { const n = E.H.stranger(l, r, i % 2 ? 'F' : 'M'); const m = GL.state(l).met[n]; if (m) groups[m.grp]++; }
  ok(groups.local > 150 && groups.intl > 60 && groups.compat > 60, 'campus meets locals, internationals and compatriots ' + JSON.stringify(groups));
  GL.state(l).pref = 'local'; ok(GL.weights(l).local > 0.65 && GL.weights(l).compat > 0, 'filter prefers locals but never excludes compatriots');
  const name = Object.keys(GL.state(l).met).find(n => GL.state(l).met[n].cc === 'DE'); l.partner = { name, sex: 'F', age: 21, status: 'dating', alive: true }; GL.stamp(l);
  ok(l.partner.homeCountry === 'DE', 'partner keeps the origin met with'); l.partner.homeCountry = 'DE'; const before = JSON.stringify(l.partner); GL.stamp(l); ok(JSON.stringify(l.partner) === before, 'origin not rewritten');
  const h = life(21); const n0 = E.H.stranger(h, () => .3, 'F'); ok(!Object.keys(GL.state(h).met).length, 'at home: legacy name generator untouched (' + n0 + ')');
}
// ---------- D16.2: giấy tờ đi lại từng người ----------
{
  ok(GL.entry('SG', 'VN').kind === 'free' && GL.entry('SG', 'US').kind === 'eta' && GL.entry('VN', 'US').kind === 'visa', 'free / e-authorization / visa examples');
  ok(GL.entry('FR', 'DE').kind === 'right' && GL.entry('DE', 'CH').kind === 'right', 'EU/EEA/CH free movement');
  const l = life(30, { age: 35 }); E.TRAVEL918.state(l).passport = { at: 30, until: 45 }; l.partner = { name: 'Tan Wei', sex: 'M', age: 36, status: 'married', alive: true, homeCountry: 'SG', pp919: { cc: 'SG', until: 44 } };
  const k = { name: 'Mai', sex: 'F', born: 30, alive: true }; l.kids = [k]; const c = E.ERA917.kidRec(l, k); c.cits = ['VN', 'SG']; c.passports = [{ cc: 'SG', issued: 1, until: 6 }];
  const need = GL.familyNeeds(l, 'US'); ok(need.length === 3, 'three members'); ok(need[0].kind === 'visa' && need[1].kind === 'eta' && need[2].kind === 'eta', 'each member by own passport: VN visa, SG ETA, kid SG ETA');
  c.passports = []; ok(GL.familyNeeds(l, 'US')[2].kind === 'nopass', 'child without passport flagged, family not blocked by one person');
  ok(GL.citRule('SG').descent === 'register' && GL.citRule('CN').dual === 0, 'citizenship rules per country');
  const s = life(31, { age: 21 }); s.flags.citizen = ['SG']; ok(GL.dualDue(s) === 'SG', 'SG dual citizen at 21 must choose'); s.pending = [E.DEC.dualChoice919.make(s, () => .5)]; E.resolve(s, 'keep'); ok(s.flags.citizen.join() === 'SG' && s.flags.renounced === 'VN', 'chose SG, gave up VN');
}
// ---------- D12 / D16.3: đoàn tụ, nơi sống sau cưới ----------
{
  const l = life(40, { age: 32 }); l.abroad = { code: 'CA', name: 'Canada', until: 35, perm: false, study: true }; l.partner = { name: 'Emily', sex: 'F', age: 31, status: 'married', since: 30, alive: true, homeCountry: 'GB', relation108: 'r1' };
  ok(/Canada/.test(GL.canSponsor(l, 'me')) || GL.canSponsor(l, 'me') !== true, 'temporary resident cannot sponsor in Canada: ' + GL.canSponsor(l, 'me'));
  const p = life(41, { age: 32 }); p.partner = { name: 'Kim Ji-woo', sex: 'F', age: 31, status: 'married', since: 28, alive: true, homeCountry: 'KR', relation108: 'r2' };
  ok(GL.canSponsor(p, 'me') === true, 'citizen at home can sponsor');
  let approved = 0, rfe = 0, refused = 0;
  for (let i = 0; i < 120; i++) { const q = life(4100 + i, { age: 32 }); q.partner = { name: 'X' + i, sex: 'F', age: 30, status: 'married', since: 29, alive: true, homeCountry: 'KR', relation108: 'r' + i }; q.flags.global919 = { met: {}, pref: 'any', track: {}, famVisa: {}, cits: {}, res: { plan: 'stay' } };
    const st = GL.state(q); st.res.file = { dir: 'in', dest: 'VN', at: 32, due: 33, stage: 'submitted', tries: 1 };
    for (let y = 0; y < 3; y++) { q.age++; hooks(q); if (st.res.file.stage === 'rfe' && !st.res.file.rfeDone) { rfe++; st.res.file.rfeDone = true; st.res.file.stage = 'submitted'; } }
    if (st.res.file.stage === 'approved') { approved++; ok(q.partner.permit919 && !(q.partner.citizen919), 'approval grants residence right, not citizenship'); } else refused++; }
  ok(approved > 40 && refused > 0 && rfe > 0, 'file outcomes vary: approved ' + approved + ', refused ' + refused + ', extra documents ' + rfe);
  ok(GL.laborWhy(life(42, { age: 25 }), 'JP') !== true, 'labor route needs passport/language'); const w = life(43, { age: 25 }); E.TRAVEL918.state(w).passport = { at: 24, until: 34 }; I.rec(w, 'ja').lis = I.rec(w, 'ja').spk = I.rec(w, 'ja').rd = I.rec(w, 'ja').wr = 60; ok(GL.laborWhy(w, 'JP') === true, 'eligible with passport and Japanese');
}
// ---------- D09: ngoại hình, ngôn ngữ ----------
{
  const l = life(50, {}, 'world'); const p0 = JSON.stringify(I.pheno(l)); E.H.emigrate(l, ['DE', W.BY.DE.name, 'de'], () => .5, quiet); ok(JSON.stringify(I.pheno(l)) === p0, 'natural phenotype unchanged by emigration');
  const dark = { hair: 0.95, eye: 0.95, skin: 0.6, red: false, green: false }, light = { hair: 0.3, eye: 0.25, skin: 0.1, red: false, green: true };
  let lightKids = 0, blueEyes = 0; for (let i = 0; i < 400; i++) { const c = I.child('k' + i, dark, light); if (c.hair < 0.5) lightKids++; if (I.eyeLabel(c) === 'xanh dương') blueEyes++; } ok(lightKids > 0 && lightKids < 400, 'mixed parents: varied children (' + lightKids + '/400 lighter hair)');
  ok(I.child('x', dark, dark).red === false, 'red hair needs a carrier parent');
  const s = I.state(l); s.dye = { hair: 'bạch kim' }; const kid = { name: 'K', born: l.age, alive: true }; l.kids = [kid]; I.kidPheno(l, kid); ok(I.hairLabel(kid.pheno919) !== 'bạch kim' && !kid.pheno919.dye, 'dyed hair not inherited');
  ['intelligence', 'moral', 'beauty', 'kno'].forEach(k => ok(!(k in I.pheno(l)), 'phenotype carries no ' + k));
  const b = life(51, { age: 0, indep: false }); b.abroad = { code: 'FR', name: W.BY.FR.name, perm: true }; for (let a = 1; a <= 10; a++) { b.age = a; I.langYear(b); } ok(I.skill(b, 'fr') > 50, 'child abroad learns local language by exposure (' + Math.round(I.skill(b, 'fr')) + ')');
  const ad = life(52, { age: 30 }); const fr = I.rec(ad, 'fr'); fr.lis = fr.spk = fr.rd = fr.wr = 70; fr.last = 30; fr.peak919 = 70; for (let a = 31; a <= 50; a++) { ad.age = a; I.langYear(ad); } const left = I.skill(ad, 'fr'); ok(left < 70 && left >= 35, 'unused language erodes but keeps a floor (' + Math.round(left) + ')');
  const st = life(53, { age: 25 }); I.startStudy(st, 'es', 'tutor', quiet); st.age++; I.langYear(st); ok(I.skill(st, 'es') > 0 && I.skill(st, 'es') < 20, 'one year of tutoring is progress, not fluency (' + Math.round(I.skill(st, 'es')) + ')');
  st.lang = { en: 1 }; st.langAt = { en: 10 }; ok(!E.certValid(st, 'en'), 'certificate expired'); const en = I.rec(st, 'en'); en.lis = en.spk = en.rd = en.wr = 66; ok(I.skill(st, 'en') === 66, 'skill independent of expired certificate');
  ok(/ký hiệu|ASL|BSL/.test(I.lname(I.signOf('VN'))) && I.signOf('GB') !== I.signOf('US'), 'sign languages per country');
}
// ---------- D13: họ tên ----------
{
  ok(I.validName('<script>alert(1)</script>') !== true, 'HTML in name rejected'); ok(I.validName("Nguyễn Thị Ngọc Ánh Dương") === true && I.validName("O'Brien-Smith") === true && I.validName('María José García López') === true && I.validName('Björk') === true, 'unicode, apostrophe, hyphen, multi-part names');
  const vn = life(60); vn.partner = { name: 'Trần Văn B', sex: 'M', age: 30, status: 'married', alive: true, relation108: 'r9' }; ok(I.marryOptions(vn).map(x => x.k).join() === 'keep', 'Vietnam: keep surname only');
  const de = life(61); de.abroad = { code: 'DE', name: 'Đức', perm: true }; de.partner = { name: 'Anna Müller', sex: 'F', age: 30, status: 'married', alive: true, homeCountry: 'DE', relation108: 'r10' }; const ks = I.marryOptions(de).map(x => x.k); ok(ks.includes('keep') && ks.includes('take') && ks.includes('double'), 'Germany: keep, take or double');
  const jp = life(62); jp.abroad = { code: 'JP', name: 'Nhật Bản', perm: true }; jp.partner = { name: 'Sato Yui', sex: 'F', age: 30, status: 'married', alive: true, homeCountry: 'JP', relation108: 'r11' }; ok(I.marryOptions(jp).map(x => x.k).join() === 'keep,take', 'Japan international marriage: keep or take');
  const name0 = de.name; I.nameRec(de); hooks(de); const dec = de.pending.find(d => d.id === 'surname919'); ok(!!dec, 'surname decision queued at marriage'); de.pending = [dec]; E.resolve(de, 'o2');
  const n = I.nameRec(de); ok(n.hist.length >= 1 && n.birth === name0, 'birth name kept in history'); hooks(de); hooks(de); ok(!de.pending.some(d => d.id === 'surname919'), 'asked once per marriage');
  ok(!/Müller-Müller|--/.test(de.name), 'no duplicated surname: ' + de.name);
}
// ---------- D15: người theo dõi ----------
{
  const c = { id: 'youtuber', fame: true, talent: null };
  const l = life(70, { age: 30, skill: 60 }); l.fame = 1e7; let min = 1e9;
  for (let y = 0; y < 1; y++) { l.age++; l.fame = F.careerGrowth(l, c, l.fame, 0, false, 'balance'); min = Math.min(min, l.fame); }
  ok(min > 8.5e6, 'stable 10M creator does not crash in a normal year (' + Math.round(min) + ')');
  let worst = 1; for (let s = 0; s < 300; s++) { const q = life(7000 + s, { age: 30, skill: 50 }); q.fame = 1e7; const z = ((s * 7919) % 1000) / 1000 * 6 - 3; const e = F.careerGrowth(q, c, q.fame, z, false, 'balance'); worst = Math.min(worst, e / 1e7); }
  ok(worst > 0.75, 'no unexplained 70–80% drop even at z=-3 (worst ratio ' + worst.toFixed(2) + ')');
  [0, 100, 1e5, 1e6, 1e7, 1e8].forEach(f0 => { const q = life(7100, { age: 25, skill: 55 }); q.fame = f0; for (let y = 0; y < 20; y++) { q.age++; q.fame = F.careerGrowth(q, c, q.fame, Math.sin(y * 3.1), y === 7, 'work'); ok(isFinite(q.fame) && q.fame >= 0 && q.fame <= F.capacity(q) + 1, 'finite, non-negative, capped from ' + f0); } });
  const idle = life(72, { age: 30, skill: 55 }); idle.fame = 1e6; const e1 = F.careerGrowth(idle, c, 1e6, 0, false, 'health'), act = life(73, { age: 30, skill: 55 }); const e2 = F.careerGrowth(act, c, 1e6, 0, false, 'work'); ok(e1 < e2, 'activity matters');
  const sh = life(74, { age: 30 }); sh.fame = 1e7; E.H.fx(sh, { fame: 0.6 }); const ent = F.entry(sh); ok(ent.shock < 0 && /khủng hoảng/.test(ent.why.join()), 'named shock logged');
  const led = life(75, { age: 30 }); led.fame = 5e5; F.reconcile(led); led.age++; led.fame = F.careerGrowth(led, c, led.fame, 0.5, false, 'work'); E.H.fx(led, { fame: 0.9 }); led.fame += 20000; F.reconcile(led); const L0 = F.entry(led); ok(L0.start + L0.gain - L0.lost + L0.shock + (L0.other || 0) === L0.end, 'ledger: start + new − left ± shock ± other = end');
  const a1 = life(76, { age: 30 }); a1.fame = 1e6; F.state(a1).active = 0.05; F.state(a1).eng = 10; const a2 = life(77, { age: 30 }); a2.fame = 1e6; F.state(a2).active = 0.5; F.state(a2).eng = 70; ok(F.incomeFactor(a2) > F.incomeFactor(a1), 'same followers, engaged audience earns more');
  ok(F.donation(a2).net > F.donation(a1).net, 'donations depend on active audience');
  const d = life(78, { age: 30 }); d.fame = 2e6; E.startJob(d, 'streamer', () => .5, quiet, true); F.state(d).active = 0.4; const m0 = d.money; F.donationYear(d, quiet); const m1 = d.money; F.donationYear(d, quiet); ok(m1 > m0 && d.money === m1, 'donation settled once per year');
  const t = Object.values(F.state(d).tx)[0]; ok(Math.abs(t.gross - t.cut - t.refunded - t.tax - t.net) < 1e-6, 'gross − platform − refunds − tax = net');
  const minor = life(79, { age: 15 }); minor.fame = 2e6; E.startJob(minor, 'streamer', () => .5, quiet, true); F.donationYear(minor, quiet); ok(!F.state(minor).don.on, 'minor: donations off');
  const t0 = Date.now(); const big = life(80, { age: 30 }); big.fame = 9e7; for (let i = 0; i < 2000; i++) F.audience(big); ok(Date.now() - t0 < 500, 'audience summary fast for 90M followers');
}
// ---------- D02 / D03 / D04 / D05 ----------
{
  const l = life(90, { age: 20 }); C.addCond(l, 'self', 'hearing', 3, 0); const f = C.fn(l); ok(f.hearing <= 10 && f.cognition === 100 && f.comm === 100, 'profound hearing loss does not lower cognition or language ability');
  C.addCond(l, 'self', 'cp', 2, 0); ok(f.mobility <= 40 && (f.conds.find(c => c.id === 'cp').cog ? f.cognition === 70 : f.cognition === 100), 'cerebral palsy affects mobility; cognition only when flagged');
  f.conds.forEach(c => c.stage = 'diagnosed'); C.buyDev(l, 'self', 'wheel', quiet); l.age++; hooks(l); ok(f.eff.mobility > f.mobility && f.eff.mobility < 100, 'wheelchair supports, does not cure');
  ok(C.devOptions(f).indexOf('ewheel') >= 0 || f.conds.find(c => c.id === 'cp').lvl < 2, 'electric wheelchair for severe mobility needs');
  const e = life(91, { age: 30 }); e.fam.mAlive = true; e.fam.mAge = 70; e.fam.fAlive = false; e.kids = [{ name: 'c', born: 29, alive: true }]; ok(/tuổi đã cao|Ông bà/.test(String(C.grandOk(e))), 'grandparent near 100 cannot provide full-time care');
  const old = []; for (let s = 0; s < 400; s++) { const q = life(9100 + s, { age: 60 }); for (let a = 60; a <= 90; a++) { q.age = a; C.cogYear(q, quiet); } old.push(C.state(q).cog.stage); }
  const none = old.filter(x => x === 'none').length; ok(none > 150 && none < 400, 'many reach 90 without cognitive disease (' + none + '/400)');
  const w = life(92, { age: 30 }); E.startJob(w, 'ke_toan', () => .5, quiet, true); w.kids = [{ name: 'Bé', sex: 'F', born: 29, alive: true }]; w.partner = null;
  C.state(w).cc = { kind: 'none', at: 30 }; const r0 = E.careerYear(w, () => .5, quiet); C.state(w).cc = { kind: 'nanny', at: 30 }; w.flags.care919.cc.kind = 'nanny'; const r1 = E.careerYear(w, () => .5, quiet);
  ok(r0 < r1, 'no childcare plan → reduced income, not a free full salary');
  w.fam.mAlive = true; w.fam.mAge = 25; w.abroad = { code: 'JP', name: 'Nhật Bản', perm: true }; ok(C.grandOk(w) !== true, 'grandparents abroad cannot do daily care');
  const p = life(93, { age: 50 }); ok(!C.serious(p), 'not serious without illness'); p.ill = { n: 'ung thư phổi', mult: 5, plan915: { stage: 4 } }; ok(C.serious(p) && /tháng|năm/.test(C.prognosis(p)), 'palliative opens, prognosis is a range');
  const mult = p.ill.mult; pick(p, 'palliative919', 'set:home'); ok(p.ill.mult === mult, 'palliative care does not change mortality');
  const k = life(94, { age: 10, indep: false }); k.ill = { n: 'u não', mult: 4, plan915: { stage: 3 } }; ok(C.serious(k), 'paediatric palliative care available');
  const bkt = life(95, { age: 40 }); const it = C.addItem(bkt, 'travel', 'US', 'Đến Mỹ'); C.attempt(bkt, it, logf); ok(it.status === 'open' && /thị thực/.test(logs[logs.length - 1]), 'bucket travel needs a visa first');
  GL.state(bkt).famVisa.US = { me: { ok: true, until: 45, kind: 'visa' } }; it.lastTry = null; C.attempt(bkt, it, quiet); ok(it.status === 'done', 'done once visa granted'); const m = bkt.money; C.attempt(bkt, it, quiet); ok(bkt.money === m, 'completion not repeated');
  // trẻ sơ sinh: máy theo dõi không tham gia nguy cơ
  const b = life(96, { age: 30 }); const kid = { name: 'An', sex: 'M', born: 30, alive: true }, twin = { name: 'Bình', sex: 'M', born: 30, alive: true }; b.kids = [kid, twin];
  const r1b = C.suidRisk(b, kid); C.state(b).monitor = { at: 30, on: true }; ok(C.suidRisk(b, kid) === r1b, 'baby monitor does not change SIDS risk'); C.state(b).safeSleep = true; ok(C.suidRisk(b, kid) < r1b, 'safe sleep lowers (not removes) risk');
  C.infant(b, twin); ok(kid.infant919 !== twin.infant919 && kid.uid110 !== twin.uid110, 'separate infant records per twin');
  const roll = kid.infant919.roll; delete kid.infant919; C.infant(b, kid); ok(kid.infant919.roll === roll, 'reload does not reroll');
  let deaths = 0, N = 20000; for (let i = 0; i < N; i++) { const q = { name: 'q' + i, sex: 'M', born: 30, alive: true, uid110: 'u' + i }; const lq = { id: 'L' + (i % 50), flags: {}, kids: [q], age: 30 }; lq.flags.care919 = {}; if (C.infant(lq, q).roll < C.suidRisk(lq, q)) deaths++; }
  ok(deaths / N < 0.0015, 'sudden infant death stays rare (' + deaths + '/' + N + ')');
}
// ---------- D06 / D07 ----------
{
  const l = life(100, { age: 30 }); const dog = E.H.addPet(l, () => .4, 'chó', 'chó ta', 'Lu'); const cat = E.H.addPet(l, () => .4, 'mèo', 'mèo ta', 'Miu'); P.pets(l);
  const id = dog.id919; P.pets(l); ok(dog.id919 === id && cat.id919 && id !== cat.id919, 'stable unique pet IDs');
  ok(P.DZ['mèo'].every(d => !/parvo|Care/.test(d.n)) && P.DZ['chó'].some(d => d.id === 'parvo'), 'diseases registered per species');
  ok(!P.DZ['chó'].find(d => d.id === 'demodex').zoo, 'Demodex not zoonotic'); ok(P.DZ['mèo'].find(d => d.id === 'toxo').zoo && /mang thai/.test(P.DZ['mèo'].find(d => d.id === 'toxo').zoo), 'toxoplasma: exposure-based guidance');
  dog.sex = 'F'; dog.age0 = 3; pick(l, 'pets919', 'neut:' + dog.id919); ok(dog.neut, 'spayed'); ok(P.breedWhy(l, dog, null) !== true, 'no breeding after neutering'); ok(!has(l, 'pets919', 'neut:' + dog.id919), 'cannot neuter twice');
  const f = E.H.addPet(l, () => .4, 'mèo', 'mèo ta', 'Mun'); P.ensure(l, f); f.sex = 'F'; f.age0 = 3; cat.sex = 'M'; cat.age0 = 3;
  P.breed(l, f, cat, quiet); ok(f.rec919.preg, 'pregnant'); ok(P.breedWhy(l, f, cat) !== true, 'one pregnancy at a time'); const n0 = l.pets.length; l.age++; P.birthYear(l, () => .5, quiet); const born = l.pets.length - n0; l.age++; P.birthYear(l, () => .5, quiet); ok(l.pets.length - n0 === born, 'one litter per pregnancy');
  if (born) { const kit = l.pets[l.pets.length - 1]; ok(kit.rec919.parents.indexOf(f.id919) >= 0, 'kitten knows its mother'); kit.sex = 'M'; ok(/cha\/mẹ/.test(P.related(l, f, kit)), 'parent–child pairing detected'); }
  let ill = 0; for (let y = 0; y < 50; y++) { const q = life(10100 + y, { age: 30 }); const p = E.H.addPet(q, () => .4, 'chó', 'chó ta'); P.ensure(q, p); for (let a = 31; a < 41; a++) { q.age = a; if (P.rollIll(q, p)) ill++; } } ok(ill > 10 && ill < 300, 'pet illness frequency bounded (' + ill + ' in 500 pet-years)');
  const v = life(101, { age: 30 }); const h = E.H.addPet(v, () => .4, 'chó', 'chó ta', 'Ki'); P.ensure(v, h); v.flags.pets919.yearAt = -1; h.rec919.ill = { id: 'rabies', at: 30, stage: 'symptoms' }; P.treat(v, h.id919, 'vet', quiet); ok(!h.alive, 'symptomatic rabies is not cured by a cheap visit');
  const hr = life(102, { age: 30 }); pick(hr, 'pets919', 'horse'); const horse = hr.pets.find(p => p.k === 'ngựa'); ok(horse && E.PETS['ngựa'].cost > E.PETS['chó'].cost, 'horse added with higher keep costs');
  const s = P.state(hr); s.ride = 40; const m0 = hr.money; pick(hr, 'pets919', 'show:' + horse.id919); ok(s.showAt === hr.age, 'competition recorded once for the year'); ok(hr.money <= m0 + hr.base * 0.03, 'prize never exceeds entry economics by much');
  const owner = life(103, { age: 70 }); const pet = E.H.addPet(owner, () => .4, 'mèo', 'mèo ta', 'Bông'); owner.partner = { name: 'Lan', sex: 'F', age: 68, status: 'married', alive: true }; E.H.kill(owner, 'tuổi già', quiet); ok(pet.guardian919 === 'Lan', 'pet has a guardian after owner dies');
}
// ---------- D01 / D08 ----------
{
  const l = life(110, { age: 8, indep: false }); l.bff = { name: 'Minh', alive: true, since: 5 };
  ok(A.rpsRound(l, 0, 0) && [-1, 0, 1].includes(A.rpsRound(l, 0, 0).out), 'rps round');
  const map = []; for (let me = 0; me < 3; me++) for (let i = 0; i < 30; i++) { const r = A.rpsRound(l, me, i); map.push([me, r.them, r.out]); }
  ok(map.every(([m, t, o]) => (m === t ? o === 0 : ((m === 0 && t === 1) || (m === 1 && t === 2) || (m === 2 && t === 0)) ? o === 1 : o === -1)), 'rock>scissors>paper>rock, ties replay');
  ok(!A.known(l, A.GAMES.find(g => g.id === 'mugung')) && A.known(l, A.GAMES.find(g => g.id === 'oanquan')), 'Korean stop-go game not assumed in Vietnam; ô ăn quan known');
  const hap0 = l.st.hap; for (let i = 0; i < 8; i++) A.play(l, 'hide', 'Minh', 'play', quiet); ok(A.playsLeft(l) === 0, 'plays capped at 6/year'); ok(l.st.hap - hap0 <= 6 + 1e-9, 'stats only from first plays');
  ok(A.gsk(l, 'hide') > 0 && A.gsk(l, 'hide') < 40, 'skill grows gradually');
  ok(A.GAMES.length >= 16 && A.GAMES.every(g => g.rule && g.equip && g.adapt && g.age), 'each game has rules, equipment, ages, adaptation');
  const a = life(111, { age: 12, indep: false }); const st = A.state(a); st.arts.piano = { sk: 0, on: true, mode: 'private', hrs: 'intense', inst: 'own' }; for (let y = 0; y < 3; y++) { a.age++; A.artYear(a, quiet); }
  ok(st.arts.piano.sk > 10 && st.arts.piano.sk <= 42, 'piano progress takes years (' + Math.round(st.arts.piano.sk) + ')');
  const s2 = A.state(life(112, { age: 20 })); ok(Object.keys(A.ART).length >= 12, '12 disciplines');
  const t = life(113, { age: 30 }); A.state(t).arts.violin = { sk: 80, on: false }; const q = A.tourQuote(t, 'violin', 'JP'); ok(q.gross - q.crew - q.travel - q.agent - q.tax < q.gross, 'tour net below gross');
}
// ---------- D14 ----------
{
  const jp = life(120, { age: 40 }); jp.abroad = { code: 'JP', name: 'Nhật Bản', perm: true }; jp.cur = 'usd'; const m0 = jp.money; const own = E.medBill(jp, 1000, 'Viện phí', quiet); ok(Math.abs(own - 300) < 1e-6 && Math.abs(m0 - jp.money - 300) < 1e-6, 'Japan: 30% copay at 40');
  jp.age = 72; ok(Math.abs(HS.policy(jp).share - 0.8) < 1e-9, 'Japan: 20% at 70–74');
  const us = life(121, { age: 40, income: 999999, job: null }); us.abroad = { code: 'US', name: 'Hoa Kỳ', perm: true }; us.cur = 'usd'; ok(HS.policy(us).share === 0, 'US: uninsured pays everything');
  const vis = life(122, { age: 40 }); vis.abroad = { code: 'GB', name: 'Anh', until: 41, perm: false, visit907: true }; ok(HS.status(vis) === 'visitor' && HS.policy(vis).share === 0, 'visitor not covered like a resident');
  const ch = life(123, { age: 40 }); ch.abroad = { code: 'CH', name: 'Thụy Sĩ', perm: true }; ch.cur = 'usd'; const a1 = E.medBill(ch, 200, 'A', quiet), a2 = E.medBill(ch, 200, 'B', quiet); ok(a1 > a2, 'Swiss deductible used up once in the year');
  const vn = life(124, { age: 40 }); const sh = E.bhytShare(vn); ok(sh === 0 || sh === 0.8 || sh === 1 || sh === 0.95, 'Vietnam keeps life77 BHYT rule');
  const se = life(125, { age: 40 }); se.abroad = { code: 'SE', name: 'Thụy Điển', perm: true }; se.cur = 'usd'; let tot = 0; for (let i = 0; i < 10; i++) tot += E.medBill(se, 5000, 'X' + i, quiet); ok(tot <= E.usdToLocal(se, 150) + 1e-6, 'Nordic annual patient ceiling');
}
// ---------- D17 ----------
{
  const l = E.createLife({ mode: 'vn', seed: 170, orphan: true }); ok(l.fam.orphan && O.rec(l).reason, 'origin record with reason ' + O.rec(l).reason);
  l.fam.orphan.kind = 'mai_am'; l.fam.orphan.adopted = null; l.age = 6; l.pending = [];
  const d = E.DEC.mc_nhan_nuoi.make(l, () => .5); l.pending = [d]; E.resolve(l, 'theo'); ok(l.fam.orphan.adopted == null && l.fam.orphan.adopt919, 'meeting a family does not adopt immediately');
  const a = l.fam.orphan.adopt919; a.fam.fit = 0.8; a.d.q = 3;
  for (let y = 0; y < 5 && a.stage !== 'done'; y++) { l.age++; if (a.stage === 'meet') { a.visits++; } O.adoptYear(l, () => .5, quiet); }
  ok(a.stage === 'done' && l.fam.orphan.adopted != null, 'adoption completed after assessment, visits and decision');
  ok(O.rec(l).legal.some(x => x.kind === 'adoptive'), 'legal parents recorded');
  const g0 = JSON.stringify(E.LIFE138.state(l).genes); l.fam.orphan.placementRequested = l.age; hooks(l); ok(l.fam.orphan.placementRequested == null, 'birth relatives cannot move an adopted minor automatically'); ok(JSON.stringify(E.LIFE138.state(l).genes) === g0, 'genes untouched');
  const r = E.createLife({ mode: 'vn', seed: 171, orphan: true }); r.fam.orphan.kind = 'mai_am'; r.age = 10; r.pending = []; const d2 = E.DEC.mc_nhan_nuoi.make(r, () => .5); r.pending = [d2]; E.resolve(r, 'theo'); const a2 = r.fam.orphan.adopt919; a2.fam.fit = 0.5; a2.d.q = 3; a2.opinion = 'no';
  for (let y = 0; y < 4; y++) { r.age++; O.adoptYear(r, () => .5, quiet); } ok(a2.stage === 'failed' && r.fam.orphan.adopted == null, 'a 10+ child who says no is not adopted');
  const u = E.createLife({ mode: 'vn', seed: 172, orphan: true }); const o = u.fam.orphan; o.unknown = true; o.cause = null; delete o.rec919; u.age = 25; const rec = O.rec(u); rec.reason = 'lost';
  if (E.DEC.originsContact) { E.ORIGINS.birthFamily(u, () => .3); const dc = E.DEC.originsContact.make(u, () => .5); u.pending = [dc]; E.resolve(u, 'verify'); ok(o.found == null && rec.claims.length === 1, 'claim is verified before acceptance'); u.age++; O.claimYear(u, () => .5, quiet); ok(rec.claims[0].stage === 'match' ? o.found != null : o.found == null, 'verification outcome applied once'); }
  const dz = E.createLife({ mode: 'vn', seed: 173, orphan: true }); dz.fam.orphan.unknown = false; dz.fam.orphan.cause = 'mất'; delete dz.fam.orphan.rec919; ok(O.rec(dz).reason === 'deceased' && !(E.DEC.originsContact && E.DEC.originsContact.valid(dz)), 'verified deceased parents never "come back"');
}
// ---------- D10 / D09 / D13 con ----------
{
  const B = E.BONDS919; ok(!!B, 'bonds module');
  const l = life(130, { age: 35, job: null }); l.fam.mAlive = true; l.fam.mName = 'Lan'; ok(B.hardship(l) === 'jobless', 'unemployment detected');
  const outs = new Set(); for (let i = 0; i < 200; i++) { const q = life(13000 + i, { age: 35, job: null }); q.fam.mAlive = true; q.fam.mName = 'Lan'; outs.add(B.respond(q, B.circle(q)[0], 'jobless')); } ok(outs.has('support') && outs.has('distant'), 'responses vary, not fixed by hardship: ' + [...outs]);
  let opened = 0; for (let i = 0; i < 60; i++) { const q = life(13100 + i, { age: 35, job: null }); q.fam.mAlive = true; q.fam.mName = 'Lan'; B.start(q, () => .5, quiet); if (B.state(q).open) { opened++; B.start(q, () => .5, quiet); } } ok(opened > 5 && opened < 60, 'hardship chains occasional (' + opened + '/60)');
  const m = life(131, { age: 20 }); m.abroad = { code: 'DE', name: 'Đức', perm: true }; ok(B.minority(m), 'minority context abroad'); ok(!B.minority(life(132, { age: 20 })) || E.LIFE138.state(life(132)).ancestry.length > 1, 'majority at home');
  const k = life(133, { age: 30 }); k.partner = { name: 'Juan García', sex: 'M', age: 31, status: 'married', alive: true, homeCountry: 'ES' }; k.abroad = { code: 'ES', name: 'Tây Ban Nha', perm: true }; const kid = { name: 'Bé', sex: 'F', born: 30, alive: true }; k.kids = [kid]; E.UPDATE110.uid(k, kid);
  const opts = B.kidOptions(k, kid); ok(opts.length >= 2 && opts.some(o => /García/.test(o.full)), 'Spanish double surname options: ' + opts.map(o => o.full).join(' | '));
  const uid = kid.uid110; k.pending = [E.DEC.kidName919.make(k, () => .5, { uid })]; E.resolve(k, 'n0'); ok(kid.uid110 === uid && kid.named919 === 30 && kid.nameHist919[0].name === 'Bé', 'renamed child keeps ID and history');
}
// ---------- toàn đời: không lỗi, không NaN ----------
{
  let n = 0; for (const mode of ['vn', 'world']) for (let i = 0; i < 25; i++) { const l = E.createLife({ mode, seed: 919000 + i * 37 }); E.runHeadless(l); ok(isFinite(l.money) && isFinite(l.fame || 0) && (l.fame || 0) >= 0, 'finite money/fame ' + mode + i); n++; }
  ok(n === 50, '50 full lives');
}
console.log('md4-919 OK — ' + count + ' checks');
