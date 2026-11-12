/* Bệnh mắc phải / ung thư / phát triển trẻ: giai đoạn, chỉ định, tác dụng phụ, chế phẩm máu, buồng truyền, theo dõi tái phát, lao, mất ngủ, lupus, tóc, phát triển trẻ. */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, HL = E.HEALTH915, GN = E.GENETICS912;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
const reload = l => E.migrate(JSON.parse(JSON.stringify(l)));
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
function person(seed, o = {}) { const l = E.createLife({ mode: 'vn', seed, year: 1960 }); Object.assign(l, { age: o.age || 45, indep: true, alive: true, pending: [], sched: [], jailUntil: null, money: l.base * 200 }); l.flags.military = 0; if (o.sex) l.sex = o.sex; return l; }
function sick(l, n) { l.ill = { n: n || 'ung thư phổi', m: 6, base: 0.18, cure: 0.18, mult: 6, f: n || 'ung thư phổi', since: l.age }; return HL.ensurePlan(l); }
function plan(l, key) { const d = l.pending[0]; assert(d && d.id === 'cancerPlan915', 'plan menu open'); const i = d.data.keys.indexOf(key); return i >= 0 && d.opts.some(o => o.k === String(i)) ? (E.resolve(l, String(i)), true) : false; }
function startTreat(l, k) { const d = E.DEC.treat.make(l, () => .5); l.pending = [d]; E.resolve(l, k || 'best'); }

// 1. Giai đoạn: gán một lần, ổn định; khám định kỳ giúp phát hiện sớm hơn.
{
  const l = person(915001); const p = sick(l); const st = p.stage; ok(HL.ensurePlan(l).stage === st && reload(l).ill.plan915.stage === st, 'stage stable and saved');
  let early0 = 0, early1 = 0; for (let s = 0; s < 400; s++) { const a = person(915100 + s), b = person(915100 + s); b.flags.checkupUntil = b.age + 2; if (/^I{1,2}$/.test(HL.stageOf(a, { n: 'ung thư vú', since: a.age }))) early0++; if (/^I{1,2}$/.test(HL.stageOf(b, { n: 'ung thư vú', since: b.age }))) early1++; }
  ok(early1 > early0, 'regular check-ups shift diagnosis earlier (' + early0 + ' → ' + early1 + ')');
  const d = E.DEC.treat.make(l, () => .5); ok(/giai đoạn/.test(d.text), 'diagnosis text names the stage');
}
// 2. Chỉ định theo giai đoạn/loại; tác dụng phụ không đồng loạt; rụng tóc tùy phác đồ.
{
  const l = person(915200); const p = sick(l, 'ung thư gan'); p.stage = 'IV'; startTreat(l);
  ok(!plan(l, 'm:surgery'), 'no surgery indication at stage IV'); ok(!plan(l, 'm:radio'), 'no radiotherapy for liver cancer in this model');
  let hairLoss = 0, noHairLoss = 0, A = 0, B = 0, aLoss = 0, bLoss = 0;
  for (let s = 0; s < 300; s++) { const m = person(915300 + s); const q = sick(m, 'ung thư phổi'); q.stage = 'III'; startTreat(m); plan(m, 'm:chemo'); const lost = q.side.includes('rụng tóc'); lost ? hairLoss++ : noHairLoss++; if (q.regimen === 'A') { A++; if (lost) aLoss++; } else { B++; if (lost) bLoss++; } }
  ok(hairLoss > 0 && noHairLoss > 0, 'not everyone loses hair (' + hairLoss + '/' + (hairLoss + noHairLoss) + ')');
  ok(aLoss / A > bLoss / B + 0.3, 'hair loss depends on regimen');
}
// 3. Chế phẩm máu chỉ khi có chỉ định; ghi nhận và tạm hoãn hiến máu 12 tháng theo chính sách game.
{
  let offered = 0, notOffered = 0;
  for (let s = 0; s < 200; s++) { const l = person(915500 + s); const p = sick(l, 'ung thư vú'); p.stage = 'II'; startTreat(l); plan(l, 'm:chemo'); const d = l.pending[0], hasTx = d && d.data.keys.some(k => /^tx:/.test(k)), indicated = p.side.some(x => x === 'thiếu máu' || x === 'giảm tiểu cầu');
    ok(hasTx === indicated, 'transfusion offered exactly when indicated'); if (indicated) { offered++; plan(l, d.data.keys.find(k => /^tx:/.test(k))); ok(l.flags.transfused915.length === 1, 'transfusion recorded'); l.ill = null; ok(/12 tháng/.test(HL.deferral(l)), 'donation deferred after transfusion'); } else notOffered++; }
  ok(offered > 0 && notOffered > 0, 'transfusion is not routine');
  const x = person(915700); x.flags.transfused915 = [{ at: x.age - 2, kind: 'hồng cầu' }]; ok(HL.deferral(x) === null, 'deferral lifts after 12 months (game policy)');
}
// 4. Buồng truyền: chỉ khi có hóa trị, có chi phí, không tăng khả năng khỏi, có thể biến chứng.
{
  const l = person(915800); const p = sick(l, 'ung thư đại trực tràng'); p.stage = 'III'; startTreat(l);
  ok(!l.pending[0].data.keys.includes('port'), 'no port before chemotherapy'); plan(l, 'm:chemo');
  const cure = l.ill.cure, m = l.money; ok(plan(l, 'port'), 'port offered with chemo'); ok(l.ill.cure === cure && l.money < m && p.port, 'port costs money, no cure buff');
  let comp = 0; for (let s = 0; s < 300; s++) { const k = person(915900 + s); const q = sick(k); q.port = { at: k.age, complications: 0 }; q.setting = 'best'; q.mods.chemo = k.age; k.age++; HL.cancerYear(k, () => .5, say(k)); if (q.port.complications) comp++; }
  ok(comp > 0 && comp < 40, 'port complications possible, not common (' + comp + '/300)');
}
// 5. Nguy cơ tử vong theo giai đoạn: điều trị giảm nguy cơ; người trẻ giai đoạn IV không mặc định khỏi; người già giai đoạn I không mặc định tử vong.
{
  const p = { stage: 'IV', setting: 'best', mods: { chemo: 1 } }, q = { stage: 'IV', setting: 'none', mods: {} }, l = person(916000, { age: 40 }), o = person(916001, { age: 80 });
  ok(HL.hazard(l, p) < HL.hazard(l, q), 'treatment lowers hazard'); ok(HL.hazard(l, q) >= 0.4, 'young untreated stage IV is serious');
  ok(HL.hazard(o, { stage: 'I', setting: 'best', mods: { surgery: 1 } }) < 0.05, 'old stage I treated not doomed');
}
// 6. Thuyên giảm → theo dõi 5 năm → có thể tái phát; hết 5 năm thì thôi theo dõi.
{
  let relapse = 0;
  for (let s = 0; s < 300; s++) { const l = person(916100 + s); const p = sick(l, 'ung thư vú'); p.stage = 'III'; p.setting = 'best'; p.mods.surgery = l.age; HL.cancerYear(l, () => .5, say(l)); l.ill = null; l.age++; HL.cancerYear(l, () => .5, say(l));
    ok(l.flags.cancer915.follow && /tái khám/.test(l.log.slice(-1)[0].t), 'follow-up starts after remission');
    for (let y = 0; y < 6; y++) { l.age++; HL.cancerYear(l, () => .5, say(l)); if (l.ill) { relapse++; ok(/tái phát/.test(l.ill.n) && l.ill.plan915.relapse, 'relapse creates a new plan'); break; } }
    if (!l.ill) ok(!l.flags.cancer915.follow, 'follow-up ends after 5 years'); }
  ok(relapse > 10 && relapse < 150, 'stage III relapse risk plausible (' + relapse + '/300)');
  ok(/theo dõi sau ung thư/.test(HL.deferral(Object.assign(person(916099), { flags: Object.assign(person(916099).flags, { cancer915: { follow: { n: 'x', stage: 'I', since: 1 } } }) }))), 'donation deferred during cancer follow-up (game policy)');
}
// 7. Lao: tuân thủ 6 tháng.
{
  const l = person(916500); l.ill = { n: 'lao phổi', m: 3.5, base: 0.85, cure: 0.85, mult: 3.5, f: 'lao phổi', since: l.age, treated: 'best' };
  E.HOOKS.year.find(f => /tbYear/.test(f.toString()))(l, () => .5, say(l)); const d = l.pending.find(x => x.id === 'tb915'); ok(d, 'TB adherence decision');
  l.pending = [d]; const c = l.ill.cure; E.resolve(l, 'stop'); ok(l.ill.cure < c * 0.6, 'stopping early lowers cure chance');
}
// 8. Mất ngủ và lupus.
{
  let cbtOk = 0; for (let s = 0; s < 100; s++) { const l = person(916600 + s); l.flags.sleep915 = { since: l.age, plan: 'cbt' }; l.age++; HL.chronicYear(l, () => .5, say(l)); if (!l.flags.sleep915) cbtOk++; } ok(cbtOk > 25 && cbtOk < 70, 'CBT-I helps many but not all (' + cbtOk + ')');
  ok(HL.LUPUS.F / HL.LUPUS.M > 5, 'lupus incidence parameter higher in women');
  let kidney = 0, flares = 0; for (let s = 0; s < 300; s++) { const l = person(917000 + s, { sex: 'F', age: 30 }); l.mind = { stress: 10 }; l.flags.lupus915 = { since: l.age, known: true, care: 'none' }; const h0 = l.st.hea; for (let y = 0; y < 5; y++) { l.age++; HL.chronicYear(l, () => .5, say(l)); } if (l.flags.lupus915.kidney) kidney++; if (l.log.some(e => /bùng phát/.test(e.t))) flares++; }
  ok(flares > 100 && kidney > 0 && kidney < flares, 'lupus flares over time; kidney involvement as a complication (' + flares + '/' + kidney + ')');
}
// 9. Tóc: mọc theo năm, hiến trừ đúng chiều dài, chương trình khác điều kiện, hóa trị gây rụng thì về 0.
{
  const l = person(918000, { age: 25 }); const h = HL.hair(l); h.len = 10; h.growing = true; h.at = l.age; l.age += 2; HL.hairYear(l); ok(h.len === 36, 'hair grows ~13 cm/year');
  h.bleached = true; h.dyed = true; const d = E.DEC.hair915.make(l, () => 0, {}); const k1 = d.data.keys.indexOf('p1'), k2 = d.data.keys.indexOf('p2');
  ok(!d.opts.some(o => o.k === String(k1)) && d.opts.some(o => o.k === String(k2)), 'bleached hair: program 1 refuses, program 2 accepts');
  d.manual = true; d.data.requested = true; d.data.actionYear850 = l.age; l.pending = [d]; E.resolve(l, String(k2)); ok(h.len === 5 && h.donated === 1, 'donation cuts the real length');
}
// 10. Phát triển trẻ: tỷ lệ, dấu hiệu → đánh giá → hỗ trợ; tự kỷ không "khỏi"; trẻ cũ không bị gán; lưu/tải.
{
  let boys = 0, girls = 0, autB = 0, autG = 0;
  for (let s = 0; s < 6000; s++) { const l = person(919000 + s, { age: 30 }); const k = { name: 'Bé', sex: s % 2 ? 'M' : 'F', born: l.age, alive: true, genes912: { sex: 'M' } }; l.kids = [k]; E.UPDATE110.uid(l, k); const d = HL.devOf(l, k); if (k.sex === 'M') { boys++; if (d.c.autism) autB++; } else { girls++; if (d.c.autism) autG++; } }
  ok(autB / boys > 0.035 && autB / boys < 0.065 && autG / girls < 0.025, 'autism rates near gameplay targets (M ' + (autB / boys * 100).toFixed(1) + '%, F ' + (autG / girls * 100).toFixed(1) + '%)');
  const old = person(919900); const ko = { name: 'Cũ', sex: 'M', born: old.age - 5, alive: true, legacy912: true, genes912: {} }; old.kids = [ko]; ok(HL.devOf(old, ko) === null, 'legacy kids get no new developmental profile');
  const l = person(920000, { age: 30 }); const k = { name: 'Minh', sex: 'M', born: l.age - 2, alive: true, genes912: { sex: 'M' }, study: 50 }; l.kids = [k]; E.UPDATE110.uid(l, k);
  k.dev915 = { v: 1, c: { autism: { at: l.age, signs: false, known: false, sup: {}, skill: 40, resp: 1 } } };
  HL.devYear(l, () => .5, say(l)); const q = l.pending.find(x => x.id === 'devConcern915'); ok(q && /chưa đủ để kết luận/.test(q.text) && /không phải lỗi của cách nuôi dạy/.test(q.text), 'signs prompt evaluation; no parent blame');
  k.dev915.c.autism.known = 'confirmed'; k.dev915.c.autism.sup = { speech: true, ot: true };
  const s0 = k.dev915.c.autism.skill; for (let y = 0; y < 5; y++) { l.age++; HL.devYear(l, () => .5, say(l)); }
  ok(k.dev915.c.autism.skill > s0 + 10 && !k.dev915.c.autism.resolved, 'support improves skills over years; autism is not "cured"');
  const r = reload(l); ok(JSON.stringify(r.kids[0].dev915) === JSON.stringify(k.dev915), 'development profile survives reload');
  const facts = E.STANDING158.relativeFacts(l, k, true); ok(facts.some(f => f[0] === 'Phát triển & tâm lý'), 'profile shows known development info');
}
console.log('Bệnh mắc phải & phát triển trẻ: ' + count + ' checks passed.');
