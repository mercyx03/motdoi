/* §11 (8.10.17): suy thận mạn (eGFR G1–G5, lọc máu, ghép) và bệnh gan mạn (viêm → xơ hóa → xơ gan còn/mất bù, kháng virus, cai rượu, tầm soát ung thư gan). */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, H = E.H, O = E.ORGAN917;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
const reload = l => { const x = E.migrate(JSON.parse(JSON.stringify(l))); E.migrateExt(x); return x; };
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
const HOOK = E.HOOKS.year.find(f => /organ917/.test(f.toString()) && /kidneyYear|syncIll/.test(f.toString()));
ok(!!HOOK, 'organ hook registered');
function person(o = {}) {
  const l = E.createLife({ mode: o.mode || 'vn', country: o.country, seed: o.seed || 9170, year: 2026 - (o.age || 50) });
  Object.assign(l, { age: o.age || 50, alive: true, indep: true, school: null, pending: [], sched: [], money: l.base * (o.money == null ? 40 : o.money), jailUntil: null });
  l.flags.military = 0; l.id = 'organ-' + (o.seed || 9170); return l;
}
function year(l) { l.age++; if (l.partner) l.partner.age++; HOOK(l, () => .5, say(l)); }
function pend(l, id) { return l.pending.find(x => x.id === id); }
function choose(l, id, key) { const d = pend(l, id); assert(d, 'pending ' + id); assert(E.DEC[id].valid(l, d.data), id + ' valid'); E.DEC[id].apply(l, d, key, () => .5, say(l)); l.pending = l.pending.filter(x => x !== d); }
function menu(l, key) { const d = E.DEC.organ917.make(l, () => .5), i = d.data.keys.indexOf(key); assert(i >= 0, 'organ917 has ' + key + ' in ' + d.data.keys.join(',')); E.DEC.organ917.apply(l, d, String(i), () => .5, say(l)); }

// 1. Người khỏe không bị tạo hồ sơ; bệnh từ bảng ILLS được nối vào hồ sơ nhiều năm, nguy cơ không cộng chồng.
{
  const h = person({ seed: 1 }); HOOK(h, () => .5, say(h)); ok(!h.flags.organ917, 'healthy life gets no organ state');
  ok(!E.DEC.organ917.valid(h), 'menu unavailable without a diagnosis');
  const l = person({ seed: 2 }); l.ill = { n: 'suy thận mạn', m: 3, base: .1, cure: .1, mult: 3, f: 'suy thận', since: l.age, chronic: true };
  HOOK(l, () => .5, say(l)); const k = l.flags.organ917.kidney;
  ok(k && /^G3/.test(k.stage) && k.egfr >= 30 && k.egfr <= 55, 'diagnosis starts in G3 with eGFR 30–55 (' + k.egfr + ')');
  ok(l.ill.mult === 1 && l.ill.organ917 === 'kidney', 'engine multiplier replaced by stage hazard');
  const n = l.log.length; HOOK(l, () => .5, say(l)); ok(l.log.length === n, 'hook runs once per year');
  const r = reload(l); ok(JSON.stringify(r.flags.organ917) === JSON.stringify(l.flags.organ917), 'state survives reload');
  ok(JSON.stringify(reload(r).flags.organ917) === JSON.stringify(r.flags.organ917), 'migration idempotent');
}
// 2. Tiến triển thận: kiểm soát tích cực chậm hơn không kiểm soát (công thức độc lập: giảm trung bình theo năm).
{
  const avg = care => { let s = 0; for (let i = 0; i < 200; i++) { const l = person({ seed: 100 + i }); l.illHist = ['tiểu đường type 2']; O.newKidney(l, 55, null, null); const k = l.flags.organ917.kidney; k.care = care; const e0 = k.egfr; for (let y = 0; y < 5; y++) { l.age++; O.kidneyYear(l, () => .5, () => {}); } s += (e0 - k.egfr) / 5; } return s / 200; };
  const none = avg('none'), basic = avg('basic'), full = avg('full'), D = O.ORG.decline;
  ok(Math.abs(none - (D.base + D.dm[0])) < 0.5, 'uncontrolled diabetic decline ≈ ' + (D.base + D.dm[0]) + ' (' + none.toFixed(2) + ')');
  ok(Math.abs(basic - (D.base + D.dm[1])) < 0.5, 'controlled decline ≈ ' + (D.base + D.dm[1]) + ' (' + basic.toFixed(2) + ')');
  ok(full < basic && Math.abs(full - (D.base + D.dm[1]) * (1 - O.ORG.fullCut)) < 0.5, 'intensive care slows decline further (' + full.toFixed(2) + ')');
}
// 3. G4 → chuẩn bị (một lần); G5 → quyết định thay thế thận (một lần); lọc máu trừ tiền một lần mỗi năm, có tính bảo hiểm.
{
  const l = person({ seed: 3 }); O.newKidney(l, 31, null, null); const k = l.flags.organ917.kidney; k.care = 'none';
  let prep = 0, fail = 0;
  for (let y = 0; y < 12 && !k.dialysis && l.alive; y++) { year(l); prep += l.pending.filter(x => x.id === 'kidneyPrep917').length; if (pend(l, 'kidneyPrep917')) choose(l, 'kidneyPrep917', 'learn'); if (pend(l, 'kidneyFail917')) { fail++; choose(l, 'kidneyFail917', 'hd'); } }
  ok(prep === 1, 'preparation offered exactly once');
  ok(fail === 1 && k.dialysis && k.dialysis.type === 'hd', 'kidney failure decision once, dialysis started');
  ok(O.share(l) === 0, 'uninsured adult without job has no coverage');
  l.flags.bhytVol = true; ok(O.share(l) === 0.8, 'voluntary health insurance covers 80%');
  const m0 = l.money; l.age++; O.kidneyYear(l, () => .5, () => {}); const paid = m0 - l.money; O.kidneyYear(l, () => .5, () => {});
  ok(Math.abs(m0 - l.money - paid) < 1e-6, 'dialysis charged once per year');
  ok(!l.alive || Math.abs(paid - l.base * O.ORG.cost.dialysis * (1 - O.share(l))) < 1e-6 && O.share(l) > 0, 'family pays only the uninsured share (' + (paid / l.base).toFixed(3) + ', alive ' + l.alive + ')');
  ok(!E.DEC.kidneyFail917.valid(l, { at: k.failAt }), 'old failure decision invalid after dialysis');
}
// 4. Lọc máu giảm tử vong so với bảo tồn (Monte Carlo, cùng tuổi).
{
  const deaths = mode => { let d = 0; for (let i = 0; i < 300; i++) { const l = person({ seed: 400 + i, age: 60 }); O.newKidney(l, 10, null, null); const k = l.flags.organ917.kidney; k.failAt = l.age; if (mode === 'hd') k.dialysis = { type: 'hd', since: l.age, missed: 0 }; else k.conservative = l.age; for (let y = 0; y < 5 && l.alive; y++) { l.age++; O.kidneyYear(l, () => .5, () => {}); } if (!l.alive) d++; } return d / 300; };
  const hd = deaths('hd'), cons = deaths('cons');
  ok(hd < cons && cons > 0.6 && hd > 0.2, '5-year death: dialysis ' + hd.toFixed(2) + ' vs conservative ' + cons.toFixed(2));
}
// 5. Ghép thận từ người thân: cần nhóm máu tương thích, người đó có quyền từ chối, không hỏi lại; thành công thì hết lọc máu.
{
  ok(O.aboFits('O', 'A') && O.aboFits('A', 'AB') && !O.aboFits('A', 'B') && !O.aboFits('AB', 'O'), 'ABO rule');
  let yes = 0, no = 0;
  for (let i = 0; i < 80; i++) {
    const l = person({ seed: 500 + i }); O.newKidney(l, 10, null, null); const k = l.flags.organ917.kidney; k.dialysis = { type: 'hd', since: l.age, missed: 0 };
    l.partner = { name: 'Bạn đời', sex: l.sex === 'M' ? 'F' : 'M', age: 48, alive: true, status: 'married', affection108: 70, blood910: { abo: 'O' } };
    const d = E.DEC.organ917.make(l, () => .5), key = d.data.keys.find(x => /^donor:/.test(x)); assert(key, 'partner donor row');
    menu(l, key);
    if (k.transplant) { yes++; ok(!k.dialysis && k.stage === 'G2' && l.partner.donated917, 'transplant ends dialysis, donor recorded'); }
    else { no++; const d2 = E.DEC.organ917.make(l, () => .5), row = d2.data.keys.indexOf(key); ok(row < 0 ? !!l.partner.donated917 : !d2.opts.some(o => o.k === String(row)), 'declined donor cannot be asked again; a donor who already gave is not listed'); }
  }
  ok(yes > 10 && no > 10, 'relatives can agree or decline (' + yes + '/' + no + ')');
  const l = person({ seed: 600 }); O.newKidney(l, 10, null, null); l.flags.organ917.kidney.dialysis = { type: 'hd', since: l.age, missed: 0 };
  l.partner = { name: 'Bạn đời', sex: 'F', age: 48, alive: true, status: 'married', affection108: 70, blood910: { abo: 'B' } };
  const sAbo = E.BLOOD909.state(l); sAbo.abo = 'A';
  const d = E.DEC.organ917.make(l, () => .5), key = d.data.keys.find(x => /^donor:/.test(x));
  ok(key && !d.opts.some(o => o.k === String(d.data.keys.indexOf(key))), 'incompatible relative listed but not selectable');
}
// 6. Danh sách chờ: có thể nhận đề nghị từ người hiến đã mất; thận ghép có thể suy sau nhiều năm.
{
  let offers = 0;
  for (let i = 0; i < 60; i++) { const l = person({ seed: 700 + i }); O.newKidney(l, 10, null, null); const k = l.flags.organ917.kidney; k.dialysis = { type: 'pd', since: l.age, missed: 0 }; k.wait = { since: l.age }; for (let y = 0; y < 10 && l.alive && !k.transplant; y++) { l.age++; O.kidneyYear(l, () => .5, () => {}); if (pend(l, 'kidneyOffer917')) { offers++; choose(l, 'kidneyOffer917', 'accept'); } } }
  ok(offers > 5 && offers < 60, 'deceased-donor offers arrive for some patients (' + offers + '/60)');
  let failed = 0; for (let i = 0; i < 200; i++) { const l = person({ seed: 800 + i }); O.newKidney(l, 60, null, null); const k = l.flags.organ917.kidney; k.transplant = { at: l.age, donor: 'x', missed: 0 }; for (let y = 0; y < 10; y++) { l.age++; O.kidneyYear(l, () => .5, () => {}); if (!l.alive) break; } if (k.transplant.failed) failed++; }
  ok(failed > 5 && failed < 100, 'some grafts fail over ten years (' + failed + '/200)');
}
// 7. Gan: kháng virus làm chậm viêm gan B; uống rượu tiếp làm nhanh, cai rượu chậm lại; viêm gan C chữa một lần.
{
  const prog = (cause, set) => { let adv = 0; for (let i = 0; i < 300; i++) { const l = person({ seed: 900 + i }); O.newLiver(l, cause, 'hepatitis', null); const v = l.flags.organ917.liver; set(l, v); for (let y = 0; y < 10 && l.alive; y++) { l.age++; O.liverYear(l, () => .5, () => {}); } if (['compensated', 'decompensated'].includes(v.stage)) adv++; } return adv / 300; };
  const hbv0 = prog('hbv', () => {}), hbvAv = prog('hbv', (l, v) => { v.antiviral = true; });
  ok(hbvAv < hbv0 * 0.5, 'HBV antiviral slows progression to cirrhosis (' + hbv0.toFixed(2) + ' → ' + hbvAv.toFixed(2) + ')');
  const drink = prog('alcohol', l => { l.addict = { alcohol: 1 }; }), sober = prog('alcohol', l => { l.addict = {}; });
  ok(sober < drink, 'stopping alcohol slows liver disease (' + drink.toFixed(2) + ' vs ' + sober.toFixed(2) + ')');
  const l = person({ seed: 1000 }); O.newLiver(l, 'hcv', 'fibrosis', null); menu(l, 'l:daa'); const v = l.flags.organ917.liver;
  ok(v.cured === true || /chưa bị loại bỏ/.test(l.log.map(e => e.t).join(' ')), 'DAA course applied');
  if (v.cured) ok(!E.DEC.organ917.make(l, () => .5).data.keys.includes('l:daa'), 'no second DAA course after cure');
}
// 8. Tầm soát ung thư gan giúp phát hiện sớm hơn, không ngăn bệnh.
{
  const early = scr => { let n = 0, e = 0; for (let i = 0; i < 3000 && n < 120; i++) { const l = person({ seed: 2000 + i }); O.newLiver(l, 'hbv', 'compensated', null); const v = l.flags.organ917.liver; for (let y = 0; y < 8 && l.alive && !l.ill; y++) { l.age++; if (scr) v.screenAt = l.age; O.liverYear(l, () => .5, () => {}); } if (l.ill && l.ill.n === 'ung thư gan') { n++; if (['I', 'II'].includes(l.ill.plan915.stage)) e++; } } return { n, rate: n ? e / n : 0 }; };
  const a = early(true), b = early(false);
  ok(a.n > 20 && b.n > 20, 'liver cancer occurs on chronic liver disease (' + a.n + ', ' + b.n + ')');
  ok(a.rate > 0.9 && b.rate < 0.1, 'screening finds earlier stages (' + a.rate.toFixed(2) + ' vs ' + b.rate.toFixed(2) + ')');
}
// 9. Xơ gan mất bù: quyết định điều trị; bệnh do rượu chỉ vào danh sách ghép khi đã ngừng rượu ≥ 1 năm.
{
  const l = person({ seed: 3000 }); l.addict = { alcohol: 1 }; O.newLiver(l, 'alcohol', 'compensated', null); const v = l.flags.organ917.liver;
  for (let y = 0; y < 30 && v.stage !== 'decompensated' && l.alive; y++) { l.age++; O.liverYear(l, () => .5, () => {}); }
  if (l.alive && v.stage === 'decompensated') {
    ok(!!pend(l, 'liverDecomp917'), 'decompensation raises a decision');
    choose(l, 'liverDecomp917', 'list'); ok(!v.wait, 'still drinking: not listed');
    const d = E.DEC.organ917.make(l, () => .5); ok(d.data.keys.includes('l:list') && !d.opts.some(o => o.k === String(d.data.keys.indexOf('l:list'))), 'transplant listing blocked until sober');
    l.addict = {}; l.age++; O.liverYear(l, () => .5, () => {}); l.age++; O.liverYear(l, () => .5, () => {});
    if (l.alive) { menu(l, 'l:list'); ok(!!v.wait, 'listed after one sober year'); }
  } else ok(true, 'path ended earlier by mortality');
}
// 10. Không tiêu RNG của game; cùng tuổi chạy lại không đổi; tuổi thọ tổng thể không lệch lớn.
{
  const a = person({ seed: 4000 }), b = person({ seed: 4000 }); O.newKidney(a, 40, null, null); O.newKidney(b, 40, null, null);
  for (let y = 0; y < 6; y++) { a.age++; b.age++; O.kidneyYear(a, () => .1, () => {}); O.kidneyYear(b, () => .9, () => {}); }
  ok(a.flags.organ917.kidney.egfr === b.flags.organ917.kidney.egfr && a.alive === b.alive, 'outcomes depend on the life seed, not the game RNG');
  let errs = 0, lifeSum = 0, n = 0, organs = 0;
  for (let s = 0; s < 300; s++) {
    const l = E.createLife({ mode: 'vn', seed: 917000 + s * 7 }); E.runHeadless(l);
    if (l.log.some(e => typeof e.t !== 'string' || /undefined|NaN/.test(e.t))) errs++;
    if (!l.alive) { lifeSum += l.death.age; n++; }
    if (l.flags.organ917 && (l.flags.organ917.kidney || l.flags.organ917.liver)) organs++;
  }
  ok(errs === 0, 'auto-play logs clean');
  ok(n === 300 && lifeSum / n > 66 && lifeSum / n < 80, 'auto-play life expectancy remains plausible (' + (lifeSum / Math.max(1, n)).toFixed(1) + ')');
  ok(organs > 3, 'organ chains occur in ordinary lives (' + organs + '/300)');
}
console.log('PASS organ917: ' + count + ' checks (kidney stages, dialysis, transplant, liver stages, antivirals, alcohol, screening, saves).');
