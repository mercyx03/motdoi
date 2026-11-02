/* Di truyền / sàng lọc / đa thai: phép lai mẫu, ổn định seed, không reroll, chưa chẩn đoán, đồng thuận, giới hạn xét nghiệm, đa thai, bản lưu cũ. */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, GN = E.GENETICS912;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
const reload = l => E.migrate(JSON.parse(JSON.stringify(l)));
function seeded(n) { let x = (n * 2654435761) >>> 0 || 1; return () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
const N0 = { hbb: 'NN', hba: 'NN', tyr: 'NN', pah: 'NN', atp7b: 'NN', smn1: 'NN', cftr: 'NN' };
const mk = (sex, o) => Object.assign({ sex, g6pd: sex === 'M' ? 'X' : 'XX', f8: sex === 'M' ? 'X' : 'XX' }, N0, o || {});

// 1. Phép lai mẫu đã kiểm chứng.
{
  const r = seeded(1); let cc = 0, nc = 0; const n = 8000;
  for (let i = 0; i < n; i++) { const k = GN.inherit(mk('F', { cftr: 'Nc' }), mk('M', { cftr: 'Nc' }), i % 2 ? 'M' : 'F', r); if (k.cftr === 'cc') cc++; if (k.cftr === 'Nc') nc++; }
  ok(Math.abs(cc / n - 0.25) < 0.02 && Math.abs(nc / n - 0.5) < 0.02, 'AR carrier × carrier → 1/4 affected, 1/2 carriers (' + cc + ',' + nc + ')');
  let c2 = 0; for (let i = 0; i < 4000; i++) if (GN.inherit(mk('F', { smn1: 'Nc' }), mk('M'), 'M', r).smn1 === 'cc') c2++; ok(c2 === 0, 'carrier × non-carrier → no affected child');
  let sonsX = 0, dauC = 0, dauX = 0, sons = 0, daus = 0;
  for (let i = 0; i < 8000; i++) { const s = i % 2 ? 'M' : 'F', k = GN.inherit(mk('F', { f8: 'Xx' }), mk('M'), s, r); if (s === 'M') { sons++; if (k.f8 === 'x') sonsX++; } else { daus++; if (k.f8 === 'Xx') dauC++; if (k.f8 === 'xx') dauX++; } }
  ok(Math.abs(sonsX / sons - 0.5) < 0.03 && Math.abs(dauC / daus - 0.5) < 0.03 && dauX === 0, 'X-linked carrier mother → half sons affected, half daughters carriers');
  let fs = 0, fd = 0; for (let i = 0; i < 2000; i++) { const s = i % 2 ? 'M' : 'F', k = GN.inherit(mk('F'), mk('M', { g6pd: 'x' }), s, r); if (s === 'M' && k.g6pd === 'x') fs++; if (s === 'F' && k.g6pd === 'Xx') fd++; }
  ok(fs === 0 && fd === 1000, 'affected father → no affected sons, all daughters carriers');
  ok(GN.conds(mk('F', { g6pd: 'Xx' })).length === 0 && GN.carriers(mk('F', { g6pd: 'Xx' })).includes('g6pd'), 'carrier status is not disease');
}
// 2. Seed ổn định, không reroll; nguy cơ Down theo tuổi mẹ.
{
  ok(JSON.stringify(GN.fresh('abc', 'sea', 'F')) === JSON.stringify(GN.fresh('abc', 'sea', 'F')), 'same seed same genotype');
  const l = E.createLife({ mode: 'vn', seed: 912901, year: 1990 }); const g = JSON.stringify(GN.self(l)); const r = reload(l);
  ok(JSON.stringify(GN.self(r)) === g, 'player genotype survives reload');
  ok(GN.conds(GN.self(l)).length === 0, 'new player character is not assigned a disease (carrier at most)');
  ok(GN.t21Risk(25) < GN.t21Risk(35) && GN.t21Risk(35) < GN.t21Risk(40) && Math.abs(GN.t21Risk(45) - 1 / 25) < 1e-9 && Math.abs(GN.t21Risk(35) - 1 / 350) < 1e-9, 'Down risk follows maternal age table');
}
// 3. Sinh trong game: con nhận gen từ cha mẹ sinh học, tải lại không sinh thêm, đa thai một lần mỗi lần sinh.
function parent(seed) {
  const l = E.createLife({ mode: 'vn', seed, year: 1990 }); Object.assign(l, { age: 30, sex: 'F', indep: true, alive: true, kids: [], pending: [], sched: [] });
  l.partner = { name: 'Trần Văn Bố', sex: 'M', age: 31, status: 'married', since: 26, alive: true, relation108: 'r1' }; return l;
}
function birth(l, name) { l.kids.push({ name: name || 'Trần Bé', sex: 'M', born: l.age, alive: true, adopted: false }); GN.onBirths(l, (t) => l.log.push({ a: l.age, t })); }
{
  const l = parent(912902); GN.state(l).self = mk('F', { hbb: 'Nc' }); GN.state(l).parents.r1 = mk('M', { hbb: 'Nc' });
  birth(l); const k = l.kids[0]; ok(k.genes912 && ['NN', 'Nc', 'cc'].includes(k.genes912.hbb), 'child genotype from both parents');
  const n = l.kids.length, r = reload(l); GN.onBirths(r, () => {}); ok(r.kids.length === n && JSON.stringify(r.kids[0].genes912) === JSON.stringify(k.genes912), 'reload does not add babies or reroll genes');
  if (k.genes912.hbb === 'cc') ok(k.cond912.thal_b && k.cond912.thal_b.known === false, 'affected child starts undiagnosed until onset/test');
}
// 4. Tỷ lệ đa thai: cùng trứng chung kiểu gen và giới; tổng sinh đôi Đông Nam Á ~0,7–0,9%; ba thai rất hiếm.
{
  let twins = 0, mz = 0, trip = 0, births = 0;
  for (let s = 0; s < 30000; s++) {
    const l = parent(920000 + s); birth(l, 'Bé ' + s); births++;
    const b = GN.state(l).births[Object.keys(GN.state(l).births)[0]];
    if (b.n === 2) { twins++; if (b.mz) { mz++; ok(l.kids[0].sex === l.kids[1].sex && JSON.stringify(Object.assign({}, l.kids[0].genes912, { sex: 0 })) === JSON.stringify(Object.assign({}, l.kids[1].genes912, { sex: 0 })), 'MZ twins share genotype and sex'); } }
    if (b.n === 3) trip++;
    if (b.n > 1) ok(l.kids.every(k => k.multi912) && new Set(l.kids.map(k => k.name)).size === l.kids.length, 'multiples have distinct names and a shared birth group');
  }
  ok(twins / births > 0.005 && twins / births < 0.012, 'SEA twin rate plausible (' + (twins / births * 1000).toFixed(1) + '‰)');
  ok(mz / births > 0.002 && mz / births < 0.006, 'MZ rate ~3.7‰ (' + (mz / births * 1000).toFixed(1) + '‰)');
  ok(trip <= 15, 'triplets very rare (' + trip + ')');
  console.log('  Đa thai (ĐNA, ' + births + ' lần sinh): sinh đôi ' + (twins / births * 1000).toFixed(2) + '‰, cùng trứng ' + (mz / births * 1000).toFixed(2) + '‰, ba thai ' + trip);
}
// 5. Sàng lọc: đồng thuận riêng; người kia từ chối thì không có kết quả; WES bỏ sót SMA nhiều hơn bảng gen mục tiêu; âm tính có giới hạn.
{
  let wes = 0, panel = 0; const n = 2000;
  for (let i = 0; i < n; i++) { const g = mk('F', { smn1: 'Nc' }); if (GN.runTest({ illHist: [] }, 'self', g, 'wes', 'w' + i).smn1 === 'carrier') wes++; if (GN.runTest({ illHist: [] }, 'self', g, 'panel', 'p' + i).smn1 === 'carrier') panel++; }
  ok(wes / n < 0.2 && panel / n > 0.9, 'exome misses SMN1 carriers far more than targeted panel (' + wes + ' vs ' + panel + ')');
  let declined = 0, both = 0;
  for (let s = 0; s < 60; s++) {
    const l = parent(930000 + s); l.money = l.base * 10; l.partner.close = 20;
    const d = E.DEC.screen912.make(l, () => 0, {}); d.manual = true; d.data.requested = true; d.data.actionYear850 = l.age; l.pending = [d];
    E.resolve(l, String(d.data.keys.indexOf('both:panel')));
    const t = GN.state(l).tests[0]; ok(t && t.status === 'pending' && t.self, 'sample taken, result pending');
    if (!t.consent.partner) { declined++; ok(!t.partner, 'no partner result without consent'); } else both++;
    l.age++; E.HOOKS.year.find(f => /đã có kết quả/i.test(f.toString()) || /Đã có kết quả/.test(f.toString()))(l, () => .5, () => {});
    ok(t.status === 'ready', 'results arrive next year');
    const res = E.DEC.screenResult912.make(l, () => 0, { id: t.id }); ok(/phạm vi/.test(res.text) && (t.partner || /giữ kín/.test(res.text)), 'result text explains limits / privacy');
  }
  ok(declined > 0 && both > 0, 'partners can agree or decline (' + both + '/' + declined + ')');
  const t = { self: { cftr: 'carrier' }, partner: { cftr: 'carrier' } }; ok(/1\/4/.test(GN.coupleRisk(t)) && /quyết định thuộc về hai người/.test(GN.coupleRisk(t)), 'couple counseling: 1/4 risk, no forced choice');
  ok(/không loại trừ mọi bệnh/.test(GN.coupleRisk({ self: { cftr: 'neg' }, partner: { cftr: 'neg' } })), 'negative does not guarantee lifelong health');
}
// 6. Diễn biến: chẩn đoán khi khởi phát hoặc sàng lọc; chăm sóc giảm nguy cơ; thiếu tiền không trừ âm; con mất không lỗi.
{
  let treatedDead = 0, untreatedDead = 0;
  for (let s = 0; s < 300; s++) {
    for (const care of ['full', 'none']) {
      const l = parent(940000 + s); l.money = care === 'full' ? l.base * 100 : 0; l.kids.push({ name: 'Con', sex: 'M', born: l.age, alive: true, genes912: mk('M', { hbb: 'cc' }) }); X(l);
      const k = l.kids[0]; k.cond912 = { thal_b: { id: 'thal_b', onset: l.age, known: 'confirmed', dx: l.age, care, since: l.age } };
      const R = seeded(s + (care === 'full' ? 1 : 7));
      for (let y = 0; y < 5 && k.alive !== false; y++) { l.age++; GN.progress(l, k, k.cond912.thal_b, R, () => {}, 'Con'); }
      ok(l.money >= 0, 'care never drives money negative'); if (k.alive === false) care === 'full' ? treatedDead++ : untreatedDead++;
    }
  }
  console.log('  Tan máu β thể nặng, 5 năm, 300 trẻ: tử vong có chăm sóc đầy đủ ' + treatedDead + ', không chăm sóc ' + untreatedDead);
  ok(untreatedDead > treatedDead * 3, 'care lowers severe-complication risk (' + treatedDead + ' vs ' + untreatedDead + ')');
  ok(treatedDead > 0 || untreatedDead > 0, 'outcomes are not deterministic');
}
function X(l) { E.UPDATE110.uid(l, l.kids[0]); }
// 7. Bản lưu cũ: con đã có không bị gán bệnh mới, không bị coi là ca sinh mới; chuyển đời mang theo kiểu gen.
{
  const l = parent(950000); l.kids = [{ name: 'Con Cũ', sex: 'F', born: l.age, alive: true }, { name: 'Con Lớn', sex: 'M', born: l.age - 5, alive: true }]; delete l.flags.genetics912;
  const r = reload(l); ok(r.kids.length === 2 && r.kids.every(k => k.legacy912 && GN.conds(k.genes912).length === 0), 'legacy kids are carriers at most, no new disease, no multiples');
  GN.onBirths(r, () => {}); ok(r.kids.length === 2, 'no twin roll for legacy kids on load');
  const p = parent(950001); GN.state(p).self = mk('F', { pah: 'Nc' }); GN.state(p).parents.r1 = mk('M', { pah: 'Nc' }); p.kids = [{ name: 'Con PKU', sex: 'M', born: p.age, alive: true, genes912: mk('M', { pah: 'cc' }), cond912: { pku: { id: 'pku', onset: p.age, known: 'confirmed', care: 'full', since: p.age } } }];
  const o = E.childOpts(p, p.kids[0]); ok(o.parent.genes912 && o.parent.genes912.pah === 'cc' && o.parent.cond912.pku, 'child life inherits genotype and condition');
}
console.log('Di truyền & đa thai: ' + count + ' checks passed.');
