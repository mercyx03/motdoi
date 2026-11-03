/* 8.10.23: làm đẹp (tóc/khuyên/trang sức), diễn viên quốc tế, hẹn hò người thu nhập cao, sự kiện thượng lưu, cha mẹ nổi tiếng. */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
const quiet = () => {}, logs = [], logf = t => logs.push(t);
function life(seed, o, mode) { const l = E.createLife({ mode: mode || 'vn', seed }); Object.assign(l, { age: 25, indep: true, school: null, pending: [], sched: [], money: l.base * 80, yr: { items: [] } }, o || {}); l.flags.military = 0; return l; }
function hooks(l) { E.HOOKS.year.forEach(h => h(l, () => .5, logf, l.age - 1)); }
function keys(l, id, arg) { return E.DEC[id].make(l, () => .5, arg || {}).data.keys; }
function enabled(l, id, key, arg) { const d = E.DEC[id].make(l, () => .5, arg || {}), i = d.data.keys.indexOf(key); return i >= 0 && d.opts.some(o => o.k === String(i)); }
function pick(l, id, key, arg, r) { const d = E.DEC[id].make(l, r || (() => .5), arg || {}); d.manual = true; l.pending = [d]; const i = d.data && d.data.keys ? d.data.keys.indexOf(key) : -1; ok(i >= 0, id + ' offers ' + key); E.resolve(l, String(i)); }
const BT = E.BEAUTY919, ST = E.STAR919, SO = E.SOCIAL919;
ok(BT && ST && SO, 'modules loaded');

// Làm đẹp: một hồ sơ tóc dùng chung
{
  const l = life(1); E.ID919.pheno(l).hair = 0.95; l.flags.id919.pheno.red = false; const h = BT.hair(l);
  ok(!keys(l, 'identity919').includes('dye'), 'old identity dye button removed'); ok(keys(l, 'hair915').includes('beauty') && !keys(l, 'hair915').includes('dye'), 'hair donation menu links to beauty, no separate dye');
  ok(!enabled(l, 'beauty919', 'c:bạch kim', { tab: 'color' }), 'platinum needs bleaching first'); ok(enabled(l, 'beauty919', 'c:nâu hạt dẻ', { tab: 'color' }), 'brown needs no bleach');
  pick(l, 'beauty919', 'b2', { tab: 'bleach' }); ok(h.lift === 2 && h.bleached && h.dmg >= 36, 'bleach two levels, damage tracked');
  ok(!enabled(l, 'beauty919', 'b2', { tab: 'bleach' }), 'no more than 2 levels in one year');
  pick(l, 'beauty919', 'c:đỏ tươi', { tab: 'color' }); ok(h.color === 'đỏ tươi' && h.dyed, 'vivid colour after lift 2'); ok(!enabled(l, 'beauty919', 'c:hồng pastel', { tab: 'color' }), 'pastel still needs level 4');
  ok(/đỏ tươi/.test(E.ID919.describe(E.ID919.pheno(l), { hair: h.color })) , 'identity description reads shared hair record');
  const don = E.DEC.hair915.make(l, () => .5, {}).text; ok(/đã nhuộm/.test(don) && /đã tẩy/.test(don), 'hair donation sees the same dyed/bleached state');
  l.age++; hooks(l); pick(l, 'beauty919', 'b2', { tab: 'bleach' }); ok(h.lift === 4, 'next year can reach level 4'); ok(!enabled(l, 'beauty919', 'b1', { tab: 'bleach' }), 'max level reached');
  pick(l, 'beauty919', 'care'); ok(h.dmg < 72, 'treatment reduces damage');
  const kid = { name: 'K', sex: 'F', born: l.age, alive: true }; l.kids = [kid]; E.ID919.kidPheno(l, kid); ok(!/hồng|đỏ tươi|bạch kim/.test(E.ID919.hairLabel(kid.pheno919)), 'dye not inherited');
  pick(l, 'beauty919', 's:perm', { tab: 'style' }); ok(h.style === 'perm', 'styling recorded');
  // khuyên & trang sức
  ok(!enabled(l, 'beauty919', 'j:studs', { tab: 'jewel' }), 'earrings need pierced ears'); pick(l, 'beauty919', 'p:lobe', { tab: 'pierce' }); ok(!enabled(l, 'beauty919', 'j:studs', { tab: 'jewel' }), 'piercing must heal first');
  l.age++; ok(enabled(l, 'beauty919', 'j:studs', { tab: 'jewel' }), 'after healing earrings can be bought'); pick(l, 'beauty919', 'j:studs', { tab: 'jewel' }); const j = BT.state(l).jewel[0]; ok(j && j.wear, 'jewellery owned and worn');
  const m0 = l.money; pick(l, 'beauty919', 'sell:' + j.id, { tab: 'jewel' }); ok(l.money > m0 && l.money - m0 < j.paid, 'resale below purchase price'); ok(!enabled(l, 'beauty919', 'sell:' + j.id, { tab: 'jewel' }), 'cannot sell twice');
  const c = life(2, { age: 12, indep: false }); ok(!enabled(c, 'beauty919', 'p:nose', { tab: 'pierce' }) && enabled(c, 'beauty919', 'p:lobe', { tab: 'pierce' }), 'under 16: earlobe only');
  ok(!enabled(c, 'beauty919', 'b1', { tab: 'bleach' }), 'no bleaching for young children');
  const nat = life(3); E.ID919.pheno(nat).hair = 0.25; nat.flags.id919.pheno.red = false; ok(BT.lift(nat) >= 3, 'naturally light hair counts as lifted base');
}
// Đi qua lựa chọn thật, kể cả khi menu đã được lưu giữa chừng.
{
  const l = life(81), h = BT.hair(l); h.len = 24;
  pick(l, 'beauty919', 'style');
  const menu = JSON.parse(JSON.stringify(l.pending[0]));
  ok(menu.data.arg.tab === 'style' && !l.log.some(e => /bước tiếp theo: Làm đẹp/.test(e.t)), 'browsing salon is silent');
  l.pending = [menu];
  const cash = l.money;
  E.resolve(l, String(menu.data.keys.indexOf('s:wave')));
  ok(h.style === 'wave' && l.money < cash, 'saved wave selection charges');
  const afterWave = l.money;
  pick(l, 'beauty919', 's:straight', {tab:'style'});
  ok(h.style === 'straight' && l.money < afterWave, 'straightening charges separately');
  pick(l, 'beauty919', 'ext40', {tab:'style'});
  ok(h.extraCm === 40 && h.len === 24 && !enabled(l,'hair915','p2'), 'extensions do not count toward donation');
  pick(l, 'beauty919', 'removeExt', {tab:'style'});
  ok(!h.extraCm && h.len === 24, 'removing extensions preserves real hair');
  l.money = 0;
  ok(!enabled(l, 'beauty919', 's:straight', {tab:'style'}), 'insufficient funds block straightening');
  l.age = 10; l.indep = false;
  ok(!enabled(l,'beauty919','bleach') && /14 tuổi/.test(E.DEC.beauty919.make(l,()=>.5,{}).text), 'no empty bleach menu at ten');
  l.age = 5; l.fam.mAlive = l.fam.fAlive = false;
  for (const [kind, carer] of [['chua','sư cô'],['mai_am','cô bảo mẫu'],['ong_ba','ông bà']]) {
    l.fam.orphan = {kind, carer, one:carer};
    const d = E.DEC.k_ga_con.make(l,()=>.5,{});
    ok(d.text.toLowerCase().includes(carer), 'correct chick giver ' + kind);
    l.pending = [d];
    ok(E.resolve(l,'cham').some(e=>e.t.includes(carer)), 'correct chick outcome ' + kind);
  }
}
// Diễn viên: giải trong nước theo nơi sống, liên hoan phim, lời mời đạo diễn, nổi tiếng quốc tế
{
  const vn = life(10); ok(ST.domestic(vn).includes('Giải Cánh Diều'), 'Vietnam domestic awards'); const kr = life(11); kr.abroad = { code: 'KR', name: 'Hàn Quốc', perm: true }; ok(ST.domestic(kr).includes('Baeksang Arts Awards'), 'Korea domestic awards when living there');
  ok(ST.directors('US', 5).every(d => d.fictional && d.rep >= 75), 'famous directors are fictional with reputation');
  ok(JSON.stringify(ST.directors('FR', 3)) === JSON.stringify(ST.directors('FR', 3)), 'director roster stable');
  const a = life(12, { age: 30 }); E.startJob(a, 'dien_vien', () => .5, quiet, true); a.actSk = 75; a.fame = 2e6; const S = E.ACTOR154.S(a); S.credits = [1, 2, 3].map(i => ({ title: 'Phim ' + i, role: 'chính', hit: true, year: a.birthYear + 25 + i }));
  let offered = 0; for (let y = 30; y < 40; y++) { a.age = y; ST.offersYear(a); offered += ST.state(a).offers.filter(o => o.until >= y && o.status === 'open').length ? 1 : 0; } ok(offered >= 2, 'A-list actor gets direct offers (' + offered + '/10 years)');
  let o; for (let y = 40; y < 80 && !o; y++) { a.age = y; ST.offersYear(a); o = ST.state(a).offers.find(o => o.status === 'open' && !o.intl); } a.pending = []; ST.accept(a, o, () => .5, logf); const P = E.ACTOR154.S(a).project; ok(P && P.stage === 'offer' && P.role === 'chính' && P.direct919 && (P.scale === 'cinema' || P.scale === 'block'), 'offer skips casting and goes to contract stage'); ok(a.pending.some(d => d.id === 'film154' && d.data.arg.stage === 'offer'), 'film decision queued at offer stage');
  ok(ST.state(a).offers.every(x => x.intl !== true), 'no international offers without international fame');
  const n = { token: 'f:1', title: 'Phim lớn', role: 'chính', q: 0.95, year: a.birthYear + a.age - 1 }; S.noms = [n]; let sel = 0; for (let i = 0; i < 40; i++) { const b = life(1300 + i, { age: 30 }); E.ACTOR154.S(b).noms = [Object.assign({}, n, { token: 'f:' + i, year: b.birthYear + 29 })]; ST.festYear(b, quiet); if (ST.state(b).fests.length) sel++; } ok(sel > 5 && sel < 40, 'festival selection depends on quality, not guaranteed (' + sel + '/40)');
  const b = life(14, { age: 30 }); E.ACTOR154.S(b).noms = [Object.assign({}, n, { year: b.birthYear + 29 })]; ST.festYear(b, quiet); const n1 = ST.state(b).fests.length; ST.festYear(b, quiet); ok(ST.state(b).fests.length === n1, 'each film considered once');
  const c = life(15, { age: 30 }); E.startJob(c, 'dien_vien', () => .5, quiet, true); ST.state(c).intl = 80; let intl = 0; for (let y = 30; y < 45; y++) { c.age = y; ST.offersYear(c); if (ST.state(c).offers.some(o => o.intl)) intl++; } ok(intl >= 1, 'international directors invite internationally known actors');
  const f = E.FOLLOW919.markets(c); ok(f.share.intl > 0.15, 'international fame widens international audience share');
}
// Hẹn hò: bộ lọc thu nhập cao có thể ra người phù hợp
{
  let found = 0, tries = 0; for (let i = 0; i < 300; i++) { const l = life(2000 + i, { age: 30, urban: true }); l.money = l.base * 30; l.flags.life114 = { dateIncome: 'high' }; let s = i * 7 + 1; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; const d = E.DEC.love.make(l, r, {}); tries++; if (!d.data.noMatch114 && d.data.p && (d.data.p.inc || 0) * 12 >= l.base * 3) found++; }
  ok(found > 30, 'high-income filter finds matches (' + found + '/' + tries + ')');
  ok(found < tries, 'not guaranteed');
  const l = life(2400, { age: 30, urban: true }); l.flags.life114 = { dateIncome: 'high' }; let d; for (let i = 0; i < 50; i++) { d = E.DEC.love.make(l, () => .05 + i / 100, {}); if (!d.data.noMatch114) break; } ok(d && !d.data.noMatch114 && d.opts.some(o => o.k === 'yes'), 'matched candidate can be accepted');
  l.pending = [d]; E.resolve(l, 'yes'); ok(l.partner && l.partner.name === d.data.p.name && (l.partner.inc || 0) * 12 >= l.base * 3, 'partner keeps the income seen when meeting');
}
// Sự kiện thượng lưu
{
  const l = life(30, { age: 35 }); const C = E.ELITE148; let s = 3; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const p = C.meet(l, r, { kind: 'business', where: 'test', tier: 2 }); const t0 = p.trust; ok(keys(l, 'eliteEvents919', { id: p.uid110 }).includes('gala') && keys(l, 'eliteEvents919', { id: p.uid110 }).includes('charity'), 'gala and charity offered');
  pick(l, 'eliteEvents919', 'charity', { id: p.uid110 }, () => .1); ok(p.trust >= t0, 'shared event builds trust when accepted'); ok(!enabled(l, 'eliteEvents919', 'gala', { id: p.uid110 }), 'once per contact per year');
  const art = C.meet(l, r, { kind: 'artist', where: 'test', tier: 1 }); ok(!enabled(l, 'eliteEvents919', 'forum', { id: art.uid110 }), 'business forum only with business people');
  const q1 = C.meet(l, r, { kind: 'business', where: 't', tier: 1 }), q2 = C.meet(l, r, { kind: 'investor', where: 't', tier: 1 }); pick(l, 'eliteEvents919', 'gala', { id: q1.uid110 }); pick(l, 'eliteEvents919', 'forum', { id: q2.uid110 }); const q3 = C.meet(l, r, { kind: 'business', where: 't', tier: 1 }); ok(!enabled(l, 'eliteEvents919', 'gala', { id: q3.uid110 }), 'max three events per year');
}
// Cha mẹ nổi tiếng
{
  const l = E.createLife({ mode: 'vn', seed: 40, celebParent: true }); const c = l.flags.celebParent919; ok(c && /nổi tiếng/.test(l.fam[c.side + 'Job']), 'parent is a famous singer/actor');
  let n = 0; for (let i = 0; i < 3000; i++) if (E.createLife({ mode: 'vn', seed: 40000 + i }).flags.celebParent919) n++; ok(n > 3 && n < 60, 'famous parent is rare (' + n + '/3000)');
  const kinds = new Set(); l.age = 12; for (let i = 0; i < 30; i++) { const d = E.DEC.celebKid919.make(l, () => (i % 6) / 6 + 0.01, {}); kinds.add(d.data.k); } ok(kinds.has('tease') && kinds.has('perk') && kinds.has('paparazzi'), 'negative and positive situations: ' + [...kinds]);
  const s = E.createLife({ mode: 'vn', seed: 41, celebParent: true }); s.age = 13; const d = E.DEC.celebKid919.make(s, () => 0.4, {}); d.data.k = 'stalker'; s.pending = [d]; E.resolve(s, 'a'); ok(SO.state(s).stalk && SO.state(s).stalk.told, 'stalking reported'); s.age++; hooks(s); ok(SO.state(s).stalk.done && /xử lý/.test(logs[logs.length - 1] + logs.join('|')), 'resolved the next year');
  const w = life(42, { age: 20 }); w.flags.celebParent919 = { side: 'm', kind: 'ca sĩ', name: 'X', fame: 1e6 }; w.fame = 0; E.startJob(w, 'ca_si', () => .5, logf, true); ok(w.fame >= 3e4, 'initial public curiosity when entering showbiz');
}
// toàn đời
{ for (const mode of ['vn', 'world']) for (let i = 0; i < 15; i++) { const l = E.createLife({ mode, seed: 924000 + i * 53, celebParent: i % 3 === 0 }); E.runHeadless(l); ok(isFinite(l.money), 'full life ' + mode + i); } }
console.log('social919 OK — ' + count + ' checks');
