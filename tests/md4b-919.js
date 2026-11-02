/* MD4 phần hoàn thiện (8.10.23): D17 nhận nuôi quốc tế/chăm sóc tạm thời/thừa kế, D10, D09, D11, D12, D13/D16, D14, D15, D07. */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, W = G.W;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
const quiet = () => {}, logs = [], logf = t => logs.push(t);
function life(seed, o, mode) { const l = E.createLife({ mode: mode || 'vn', seed }); Object.assign(l, { age: 30, indep: true, school: null, pending: [], sched: [], money: l.base * 50, yr: { items: [] } }, o || {}); l.flags.military = 0; return l; }
function hooks(l) { E.HOOKS.year.forEach(h => h(l, () => .5, logf, l.age - 1)); }
function pick(l, id, key, arg, r) { const d = E.DEC[id].make(l, r || (() => .5), arg || {}); d.manual = true; l.pending = [d]; const i = d.data && d.data.keys ? d.data.keys.indexOf(key) : -1; ok(i >= 0, id + ' offers ' + key + ' (' + (d.data && d.data.keys || []).join(',') + ')'); E.resolve(l, String(i)); }
function why(l, id, key, arg) { const d = E.DEC[id].make(l, () => .5, arg || {}); const i = d.data.keys.indexOf(key); return i < 0 ? 'missing' : d.opts.some(o => o.k === String(i)); }
const M = E.MD4B, GL = E.GLOBAL919, I = E.ID919, O = E.ORIGIN919, B = E.BONDS919, HS = E.HEALTH919, F = E.FOLLOW919, P = E.PETS919;
ok(!!M, 'md4b module');

// D17: chăm sóc tạm thời
{
  const l = E.createLife({ mode: 'vn', seed: 1701, tempCare: true }); const t = l.flags.tempCare919; ok(t && t.rights && !l.fam.orphan, 'temporary care keeps parental rights, not an orphan');
  ok(E.orphanCarer(l) === 'gia đình nuôi dưỡng tạm thời', 'carer shown as temporary foster family');
  ok(!E.DEC.mc_nhan_nuoi.valid(l), 'not eligible for adoption');
  let reunified = false; for (let a = 1; a <= 17 && !reunified; a++) { l.age = a; M.tcYear(l, quiet); reunified = t.out === 'reunified'; } ok(reunified || t.out === 'adult' || t.out === 'orphaned', 'temporary care ends by reunification or adulthood (' + t.out + ')');
  let n = 0; for (let i = 0; i < 3000; i++) if (E.createLife({ mode: 'vn', seed: 170000 + i }).flags.tempCare919) n++; ok(n < 40, 'random temporary-care start is rare (' + n + '/3000)');
}
// D17: nhận nuôi quốc tế có chuyển nước, quốc tịch ghi nhận sau
{
  let done = null; for (let s = 0; s < 200 && !done; s++) { const l = E.createLife({ mode: 'vn', seed: 17100 + s, orphan: true }); const o = l.fam.orphan; o.kind = 'mai_am'; o.adopted = null; l.age = 5; l.pending = [E.DEC.mc_nhan_nuoi.make(l, () => .5)]; E.resolve(l, 'theo'); const a = o.adopt919; if (!a || a.cc === 'VN') continue; a.fam.fit = 0.8; a.d.q = 3; for (let y = 0; y < 6 && a.stage !== 'done'; y++) { l.age++; if (a.stage === 'meet') a.visits++; O.adoptYear(l, () => .5, quiet); } done = { l, a }; }
  ok(done, 'an international placement is offered sometimes'); const { l, a } = done; ok(a.stage === 'done' && a.hague != null, 'international adoption passes central-authority step');
  ok(E.H.resCode(l) === a.cc && l.abroad && l.abroad.perm, 'child moves with the adoptive family'); ok(!l.flags.needJob, 'child is not sent job hunting');
  // 8.10.24 (MD5 FIN-05): quốc tịch theo luật từng nước — tự có (Mỹ/Đức/Pháp) hoặc phải nộp hồ sơ/nhập tịch (nước khác, chưa xác minh)
  const rule = E.FIN920.ADOPT[a.cc], auto = rule && rule.how === 'auto';
  if (!auto) ok(!(l.flags.citizen || []).includes(a.cc), 'citizenship not instant where the law requires an application');
  for (let y = 0; y < 3 && !(l.flags.citizen || []).includes(a.cc); y++) { l.age++; O.adoptYear(l, () => .5, quiet); }
  ok((l.flags.citizen || []).includes(a.cc) && l.country === 'VN', 'citizenship recorded per country rule (' + a.cc + ': ' + (rule ? rule.how : 'chưa xác minh') + '); origin kept');
}
// D17: thừa kế — con nuôi và con đẻ ngang nhau theo luật trong hệ di chúc hiện có
{
  const l = life(1720, { age: 60 }); l.partner = null; l.kids = [{ name: 'An', sex: 'M', born: 25, alive: true }, { name: 'Bình', sex: 'F', born: 30, alive: true, adopted: true }]; l.money = l.base * 40;
  const est = E.WILL70.estate(l), shares = est.law.filter(x => x.kid != null).map(x => x.amount); ok(shares.length === 2 && Math.abs(shares[0] - shares[1]) < 1e-6, 'adopted and birth child inherit equal statutory shares');
}
// D10: ở tù, bệnh dài hạn, anh chị em
{
  const l = life(1001, { age: 40 }); l.partner = { name: 'Lan', sex: 'F', age: 38, status: 'married', since: 30, alive: true, affection108: 70 }; l.jailUntil = 45; l.fam.mAlive = true; l.fam.mName = 'Mẹ';
  M.prisonYear(l, logf); ok(M.state(l).prison && M.state(l).prison.visits.length === 1, 'visits recorded each prison year'); M.prisonYear(l, logf); ok(M.state(l).prison.visits.length === 1, 'once per year');
  ok(l.pending.some(d => d.id === 'prisonPartner919'), 'partner conversation queued for long sentence');
  l.pending = [E.DEC.prisonPartner919.make(l, () => .5)]; E.resolve(l, 'wait'); ok(M.state(l).prison.partner === 'done', 'partner decided');
  l.age = 45; l.jailUntil = 45; M.prisonYear(l, logf); ok(M.state(l).prison.out === 45 && /Ra tù/.test(logs[logs.length - 1]), 'release reintegration logged');
  const s = life(1002, { age: 50 }); s.flags.fdNuoi = 'nhan'; s.fam.mAlive = true; s.fam.mAge = 30; s.sibList = [{ n: 'Hùng', sex: 'M', born: -3, alive: true, close: 60 }];
  for (let a = 50; a < 54; a++) { s.age = a; M.sibYear(s, () => .5, quiet); } ok(M.state(s).fd.burden >= 40 && s.pending.some(d => d.id === 'sibCare919'), 'caregiving burden grows and sibling discussion opens');
  s.pending = []; pick(s, 'sibCare919', 'mediate', {}, () => .1); ok(M.state(s).fd.burden < 50, 'mediation reduces burden');
  s.fam.mAlive = false; s.fam.fAlive = false; s.age++; M.sibYear(s, () => .5, quiet); ok(M.state(s).fd.closed, 'chain closes when parents are gone');
}
// D09: phản ánh mở hồ sơ, xử lý năm sau, cơ quan theo nước
{
  const l = life(901, { age: 25 }); l.abroad = { code: 'DE', name: 'Đức', perm: true }; ok(/Antidiskriminierungsstelle/.test(B.agency(l)), 'German agency named');
  const d = E.DEC.bias919.make(l, () => .5); l.pending = [d]; E.resolve(l, 'report'); ok(B.state(l).biasCase && !B.state(l).biasCase.done, 'formal report opens a case');
  l.age++; B.biasYear(l, logf); ok(!B.state(l).biasCase && B.state(l).biasHist.length === 1 && /Kết quả xử lý/.test(logs[logs.length - 1]), 'case resolved next year');
}
// D11: khóa tiếng 1 năm, bảo lưu/chuyển/dừng học, học nghề, lương tiến sĩ
{
  const l = life(1101, { age: 22, job: null }); E.TRAVEL918.state(l).passport = { cc: 'VN', issued: 20, until: 30 }; const m0 = l.money, cur0 = l.cur;
  pick(l, 'langYear919', 'go:DE', {}, () => .1); const q = M.state(l).ly; ok(q && E.H.resCode(l) === 'DE' && l.abroad.langCourse919, 'language course abroad starts with its own visa');
  const de0 = I.skill(l, 'de'); pick(l, 'langYear919', 'cont'); l.age++; M.lyYear(l, () => .05, logf); ok(q.done && E.H.resCode(l) === 'VN' && l.cur === cur0, 'returns home with currency restored');
  ok(I.skill(l, 'de') > de0, 'language improved'); ok(!l.flags.studyVisa900 || l.flags.studyVisa900.country === 'DE' && !l.abroad, 'university needs a separate visa, not automatic');
  const s = life(1102, { age: 22 }); s.abroad = { code: 'FR', name: 'Pháp', study: true, until: 26 }; s.school = 'abroad'; s.schoolEnd = 26; s.flags.study107 = { country: 'FR', school: 'Université Paris-Saclay', lv: 5, finished: false };
  pick(s, 'studyAbroad919', 'defer'); ok(s.schoolEnd === 27 && s.abroad.until === 27, 'deferral extends study and residence once'); ok(why(s, 'studyAbroad919', 'defer') === false, 'only one deferral');
  pick(s, 'studyAbroad919', 'drop'); ok(!s.school && s.flags.study107.finished === 'dropped' && s.abroad.until === s.age && !s.abroad.study, 'dropping out ends study permit');
  const a = life(1103, { age: 20, job: null }); E.TRAVEL918.state(a).passport = { cc: 'VN', issued: 19, until: 29 }; ok(M.ausWhy(a) !== true, 'Ausbildung needs German'); const r = I.rec(a, 'de'); r.lis = r.spk = r.rd = r.wr = 60; ok(M.ausWhy(a) === true, 'eligible with B1 German');
  pick(a, 'ausbildung919', 'pflege', {}, () => .01); ok(a.abroad && a.abroad.code === 'DE' && /Học nghề kép/.test(a.job.t), 'vocational contract in Germany'); a.age += 3; hooks(a); ok(M.state(a).aus.done && M.recognized(a, 'DE'), 'completion: hired, German nursing qualification counts');
  const p = life(1104, { age: 28 }); p.school = 'phd'; p.abroad = { code: 'DE', name: 'Đức', study: true }; p.flags.phd919 = { funded: true }; const m1 = p.money; hooks(p); ok(p.money > m1, 'funded PhD pays a contract salary'); const p2 = life(1105, { age: 28 }); p2.school = 'phd'; p2.abroad = { code: 'DE', name: 'Đức', study: true }; p2.flags.phd919 = { funded: false }; const m2 = p2.money; M.state(p2); E.HOOKS.year.slice(-1)[0](p2, () => .5, quiet); ok(p2.money === m2, 'self-funded PhD gets no salary');
}
// D12: công nhận bằng, thường trú
{
  const l = life(1201, { age: 28, edu: 5, major: 'med' }); const r = I.rec(l, 'de'); r.lis = r.spk = r.rd = r.wr = 70; E.TRAVEL918.state(l).passport = { cc: 'VN', issued: 27, until: 37 };
  ok(/công nhận bằng/.test(GL.laborWhy(l, 'DE')), 'German nursing route requires recognition'); pick(l, 'recog919', 'sub:DE:nurse'); l.age++; hooks(l);
  const st = M.recogState(l)['DE:nurse']; ok(st.stage === 'done' || st.stage === 'partial', 'assessment result: full or partial');
  if (st.stage === 'partial') { pick(l, 'recog919', 'adapt:DE:nurse'); for (let i = 0; i < 4 && st.stage !== 'done'; i++) { l.age++; hooks(l); if (st.stage === 'partial') pick(l, 'recog919', 'adapt:DE:nurse'); } }
  ok(st.stage === 'done' && GL.laborWhy(l, 'DE') === true, 'recognized → route open');
  const w = life(1202, { age: 30 }); w.abroad = { code: 'PL', name: 'Ba Lan', until: 40, perm: false, labor919: {} }; w.job = { id: 'xkld', rank: 0, yrs: 0, t: 'sản xuất' }; const pl = I.rec(w, 'pl'); pl.lis = pl.spk = pl.rd = pl.wr = 60;
  ok(M.prWhy(w) !== true, 'PR needs years'); for (let a = 30; a < 36; a++) { w.age = a; hooks(w); } ok(M.prWhy(w) === true, 'eligible after 5 years in Poland');
  pick(w, 'pr919', 'apply'); w.age++; hooks(w); ok(M.state(w).pr.done, 'PR decided once'); ok(!w.abroad.perm || w.abroad.perm === true && !(w.flags.citizen || []).includes('PL'), 'PR is not citizenship');
  const us = life(1203, { age: 30 }); us.abroad = { code: 'US', name: 'Mỹ', until: 40 }; us.job = { id: 'xkld', rank: 0, yrs: 0 }; ok(/bảo lãnh/.test(M.prWhy(us)), 'US: no years-only route');
  const au = life(1204, { age: 30 }); au.abroad = { code: 'AU', name: 'Úc', until: 40 }; au.city = 'Darwin'; ok(M.prYears(au) === 3, 'regional pathway shorter in Australia');
}
// D13 / D16
{
  ok(I.validName('Nguyễn Văn 3', 'VN') !== true && I.validName('Nguyễn Văn An', 'VN') === true, 'VN: no digits');
  ok(I.validName('Dr. Hans Müller', 'DE') !== true, 'DE: titles are not names');
  ok(I.validName('김 민준서준호진', 'KR') !== true && I.validName('김 민준서준호', 'KR') === true && I.validName('김 민준', 'KR') === true, 'KR: Hangul given name length');
  const l = life(1301, { age: 30 }); E.TRAVEL918.state(l).passport = { cc: 'VN', issued: 28, until: 38 }; I.nameRec(l); I.setLegal(l, 'Nguyễn Minh Khang', 'test');
  ok(!E.TRAVEL918.passport(l), 'legal name change invalidates passport until reissued'); pick(l, 'identity919', 'docs'); ok(E.TRAVEL918.passport(l) && E.TRAVEL918.passport(l).until === 40, 'documents updated → new passport');
  const k = life(1302, { age: 30 }); k.partner = { name: 'Trần Văn Bình', sex: 'M', age: 31, status: 'married', alive: true, homeCountry: 'VN' }; const kid = { name: 'Bé', sex: 'F', born: 30, alive: true }; k.kids = [kid]; hooks(k); ok(k.pending.some(d => d.id === 'kidName919'), 'naming offered for every birth');
  const de = life(1303, { age: 30 }); de.abroad = { code: 'DE', name: 'Đức', perm: true }; de.partner = { name: 'Anna Schmidt-Weber', sex: 'F', age: 30, status: 'married', alive: true, homeCountry: 'DE' }; const k2 = { name: 'K', sex: 'M', born: 30, alive: true }; de.kids = [k2]; E.UPDATE110.uid(de, k2);
  const opts = B.kidOptions(de, k2).map(o => o.full); ok(opts.every(n => (n.match(/-/g) || []).length <= 1) && opts.some(n => /Schmidt/.test(n)) && !opts.some(n => /Schmidt-Weber/.test(n)), 'German double surname: one part from each parent, max two: ' + opts.join(' | '));
  const f = life(1304, { age: 35 }); E.TRAVEL918.state(f).passport = { cc: 'VN', issued: 30, until: 40 }; f.partner = { name: 'Tan Wei', sex: 'M', age: 36, status: 'married', alive: true, homeCountry: 'SG', pp919: { cc: 'SG', until: 35 } };
  ok(GL.familyNeeds(f, 'US')[1].kind === 'nopass', 'expired partner passport is not valid'); pick(f, 'famTravel919', 'ppPartner', { dest: 'US' }); ok(GL.familyNeeds(f, 'US')[1].kind === 'eta', 'renewed partner passport');
}
// D14
{
  const qc = life(1401, { age: 30 }); qc.abroad = { code: 'CA', name: 'Canada', perm: true }; qc.city = 'Montreal'; qc.cur = 'usd'; ok(HS.policy(qc).province === 'QC' && HS.policy(qc).share < 1, 'Québec newcomer waiting period');
  qc.age = 32; ok(HS.policy(qc).share === 1, 'covered after the wait');
  const on = life(1402, { age: 30 }); on.abroad = { code: 'CA', name: 'Canada', perm: true }; on.city = 'Toronto'; ok(HS.policy(on).province === 'ON' && HS.policy(on).share === 1, 'Ontario no wait');
  const eng = life(1403, { age: 30 }); eng.abroad = { code: 'GB', name: 'Anh', perm: true }; eng.city = 'London'; eng.cur = 'usd'; eng.income = eng.base * 2; const sct = life(1404, { age: 30 }); sct.abroad = { code: 'GB', name: 'Anh', perm: true }; sct.city = 'Edinburgh'; sct.cur = 'usd'; sct.income = sct.base * 2;
  ok(E.medBill(eng, 100, 'GP', quiet) > 0 && E.medBill(sct, 100, 'GP', quiet) === 0, 'England prescription charge, Scotland free');
  const us = life(1405, { age: 70, workYrs: 30 }); us.abroad = { code: 'US', name: 'Mỹ', perm: true }; us.birthYear = 2025 - 70; const d25 = HS.policy(us).ded; us.birthYear = 2030 - 70; ok(HS.policy(us).ded > d25 && HS.policy(us).proj, 'amounts change by year; future marked projection');
  const jp = life(1406, { age: 80 }); jp.abroad = { code: 'JP', name: 'Nhật', perm: true }; jp.income = jp.base * 3; jp.birthYear = 2020 - 80; const s20 = HS.policy(jp).share; jp.birthYear = 2024 - 80; ok(s20 === 0.9 && HS.policy(jp).share === 0.8, 'Japan 75+ higher-income copay from 2022');
}
// D15
{
  const l = life(1501, { age: 28 }); l.fame = 3e6; E.startJob(l, 'youtuber', () => .5, quiet, true); F.state(l).active = 0.4; F.state(l).eng = 60;
  const pl = F.platforms(l); ok(Math.abs(Object.values(pl).reduce((a, b) => a + b, 0) - 1) < 1e-9, 'platform shares sum to 1'); const mk = F.markets(l); ok(mk.share[mk.home] + mk.share.intl === 1, 'home vs international market');
  F.dealOffers(l); const offers = F.state(l).offers919 || []; ok(offers.length >= 1, 'sponsorship offers for engaged audience');
  const o = offers.find(x => x.gate === 'all'); if (o) { pick(l, 'follow919', 'deal:' + o.id); const d = F.state(l).deals919[0]; for (let i = 0; i < d.posts; i++) pick(l, 'follow919', 'deliver:' + d.id); const m0 = l.money; l.age++; F.dealYear(l, quiet); ok(l.money > m0, 'delivered contract paid net of agency and production'); const m1 = l.money; F.dealYear(l, quiet); ok(l.money === m1, 'no double payment');
    if (d.status === 'active') { l.age++; F.dealYear(l, quiet); ok(l.money < m1, 'undelivered year penalised'); } }
  const g = life(1502, { age: 30 }); F.state(g).gifts = [1, 2, 3, 4].map(i => ({ id: 'g' + i, item: 'đồng hồ', value: g.base * 0.12, status: 'kept' })); const m2 = g.money; F.storageYear(g, quiet); ok(g.money < m2, 'storage cost for many valuable gifts');
}
// D07
{
  const l = life(701, { age: 35, urban: false }); ok(E.DEC.farm919.valid(l, null) !== false, 'rural farming available'); pick(l, 'farm919', 'buy:pig'); pick(l, 'farm919', 'buy:pig'); const f = M.farm(l); ok(f.herd.pig === 10, 'herd recorded');
  let outbreak = null; for (let a = 36; a < 70 && !outbreak; a++) { l.age = a; M.farmYear(l, () => .5, quiet); if (f.out && !f.out.done) outbreak = f.out; if (!f.herd.pig) pick(l, 'farm919', 'buy:pig'); }
  ok(outbreak && M.LD.pig.some(d => d.id === outbreak.id), 'pig disease from the pig registry only');
  l.pending = [E.DEC.farmOut919.make(l, () => .5)]; E.resolve(l, 'report'); ok(f.out.done && f.hist.length, 'reported outbreak handled once');
  ok(!M.LD.cattle.some(d => d.id === 'asf') && M.LD.cattle.some(d => /tụ huyết trùng/.test(d.n)), 'hemorrhagic septicemia in cattle; ASF only in pigs');
  const g = life(702, { age: 30 }); g.sex = 'F'; g.flags.pregnancy108 = { due: 31 }; const rg = P.riskGroup(g); ok(rg.preg && rg.who === 'self', 'pregnancy risk group');
  const cat = E.H.addPet(g, () => .4, 'mèo', 'mèo ta', 'Miu'); P.ensure(g, cat); const d = E.DEC.pets919.make(g, () => .5, {}); ok(d.data.keys.includes('riskRule'), 'household rule offered'); pick(g, 'pets919', 'riskRule'); P.zoo(g, cat, P.DZ['mèo'].find(x => x.id === 'toxo'), logf); ok(/người khác dọn khay/.test(logs[logs.length - 1]), 'rule reduces toxoplasma exposure');
  const im = life(703, { age: 40 }); im.ill = { n: 'HIV', chronic: true }; ok(P.riskGroup(im).immuno, 'immunocompromised recognized');
}
// toàn đời
{ for (const mode of ['vn', 'world']) for (let i = 0; i < 20; i++) { const l = E.createLife({ mode, seed: 923000 + i * 41 }); E.runHeadless(l); ok(isFinite(l.money) && l.flags, 'full life ' + mode + i); } }
console.log('md4b-919 OK — ' + count + ' checks');
