'use strict';
// v8.4.0 — thừa kế tài sản hiện vật: nhà, nhà cho thuê, đất, cơ sở kinh doanh được sang tên cho con / vợ chồng kèm tiền mặt
const assert = require('assert'), { gameContext } = require('./hardcore-isolation'), G = gameContext(), E = G.E, H = E.H, ES = E.ESTATE84;
let checks = 0;
function ok(x, m) { checks++; assert(x, m); }
function near(a, b, m) { ok(Math.abs(a - b) < Math.max(1e-6, Math.abs(b) * 1e-9), m + ' (' + a + ' ≈ ' + b + ')'); }
function bad(t) { return typeof t !== 'string' || /undefined|NaN|null|\[object/.test(t); }
// một người đã mất, có nhà, nhà cho thuê, cửa hàng, đất, tiền mặt
function parent(seed, o) {
  o = o || {};
  const l = E.createLife({ mode: 'vn', seed, year: 1960 });
  l.age = 70; l.indep = true; l.money = o.money != null ? o.money : 800; l.loans = o.loans || []; l.mortgage = 0;
  l.ownHouse = true; l.houseVal = 3000; l.houseName = 'nhà ống ba tầng'; l.houseK = 'ong'; l.houseTier = 3;
  l.props = [{ k: 'apt', n: 'căn hộ cho thuê', v: 2000, basis: 1500, y: 0.05, since: 50, empty: 0 }];
  l.ventures = [{ k: 'store', n: 'cửa hàng tiện lợi', cap: 1500, unit: 700, br: 2, mu: 0.1, sd: 0.14, yrs: 12, bad: 0, good: 3, R: 5000, q: 1.1 }];
  E.migrateExt(l); l.assets.land = 1200; l.basis.land = 600;
  l.partner = o.noSpouse ? null : { name: 'Trần Thị Hoa', sex: l.sex === 'M' ? 'F' : 'M', age: 68, since: 25, status: 'married', alive: true };
  l.kids = [
    { name: 'Lê Văn An', sex: 'M', born: 28, alive: true, close: 70, study: 50, edu: 5, inc: 20, job: 'ke_toan' },
    { name: 'Lê Thị Bình', sex: 'F', born: 32, alive: true, close: 70, study: 50, edu: 3, inc: 10 }
  ].concat(o.minor ? [{ name: 'Lê Văn Út', sex: 'M', born: 60, alive: true, close: 70, study: 50, edu: 1, inc: 0 }] : []);
  l.alive = false; l.death = { age: 70, cause: 'tuổi già', year: 2030 };
  return l;
}
// 1. Giá trị không đổi: tổng tài sản + tiền mỗi người nhận đúng bằng phần di sản theo luật / di chúc
for (const o of [{}, { noSpouse: true }, { minor: true }]) {
  const l = parent(840900, o), A = ES.allocate(l), est = E.WILL70.estate(l);
  const total = A.list.reduce((s, p) => s + p.items.reduce((t, x) => t + x.v, 0) + p.cash, 0);
  near(total, est.net, 'tổng phần chia bằng di sản ròng');
  A.list.forEach(p => near(p.items.reduce((t, x) => t + x.v, 0) + p.cash, p.amount, p.name + ' nhận đúng suất của mình'));
  ok(A.items.length >= 3, 'phần lớn tài sản được sang tên, không bán hết');
  const home = A.items.find(x => x.t === 'home');
  if (!o.noSpouse) ok(home && home.to === 'p', 'nhà đang ở để lại cho vợ / chồng còn sống');
  const shop = A.items.find(x => x.t === 'venture');
  if (shop) ok(/^k\d+$/.test(shop.to) && l.kids[+shop.to.slice(1)].born <= l.death.age - 18, 'cơ sở kinh doanh giao cho người con đã trưởng thành');
  A.list.forEach(p => ok(p.cash > -Math.max(...p.items.map(x => x.v), 0) * 0.31, 'bù chênh lệch không quá 30% giá trị tài sản nhận'));
}
// 2. Khúc cuối đời có mục "Phân chia tài sản" ghi rõ ai nhận gì
{
  const l = parent(840901), st = E.finale(l), s = st.find(x => x.h === 'Phân chia tài sản');
  ok(s && s.list.length >= 2, 'khúc cuối có mục phân chia tài sản');
  ok(s.list.some(t => /nhà ống ba tầng/.test(t)) && s.list.some(t => /cửa hàng tiện lợi/.test(t)), 'ghi rõ tên nhà và cửa hàng được chia');
  ok(s.list.every(t => !bad(t)), 'nội dung phân chia sạch');
}
// 3. Nợ lớn hơn: phải bán bớt tài sản, không ai nhận tài sản vượt quá di sản ròng
{
  const l = parent(840902, { money: 0, loans: [{ type: 'bank', name: 'vay ngân hàng', bal: 7000, rate: 0.09, minShare: 0.1, late: 0 }] }), A = ES.allocate(l), est = E.WILL70.estate(l);
  ok(A.sold.length > 0, 'nợ lớn thì phải bán bớt tài sản');
  ok(A.items.reduce((s, x) => s + x.v, 0) <= est.net + 1e-6, 'tài sản sang tên không vượt quá di sản ròng');
}
// 4. Sống tiếp đời con: người con nhận đúng căn nhà / cửa hàng / đất, không còn chỉ nhận tiền
{
  const l = parent(840903, { noSpouse: true }), A = ES.allocate(l);
  for (let i = 0; i < l.kids.length; i++) {
    const k = l.kids[i], mine = A.list.find(p => p.kid === i);
    const o = E.childOpts(l, k), h = o.parent.heir;
    ok(h.items && h.items.length === mine.items.length, k.name + ': hồ sơ đời con mang theo đúng tài sản được chia');
    near(h.amt, Math.max(0, mine.cash), k.name + ': tiền mặt chỉ còn phần chênh');
    // từ lúc chào đời: đến năm bố / mẹ mất mới nhận
    const c = E.createLife(o);
    ok(!c.ownHouse && !(c.ventures || []).length, 'mới sinh chưa có tài sản của bố mẹ');
    c.age = h.at; c.indep = true; const money0 = c.money, props0 = (c.props || []).length;
    E.HOOKS.year.forEach(fn => { if (/heirOf/.test(String(fn))) fn(c, H.rf(c), (t, kk) => c.log.push({ a: c.age, t, k: kk }), c.age); });
    const got = mine.items;
    if (got.some(x => x.t === 'home')) ok(c.ownHouse && c.houseName === 'nhà ống ba tầng', 'nhận căn nhà của bố mẹ');
    if (got.some(x => x.t === 'venture')) ok(c.ventures.some(v => v.n === 'cửa hàng tiện lợi' && v.br === 2), 'tiếp quản cửa hàng với đủ chi nhánh');
    if (got.some(x => x.t === 'prop')) ok(c.props.length > props0, 'nhận căn hộ cho thuê');
    if (got.some(x => x.t === 'land')) ok(c.assets.land >= 1200 - 1e-6, 'nhận lô đất');
    near(c.money - money0, Math.max(0, mine.cash) - Math.max(0, -mine.cash), 'tiền mặt nhận đúng phần chênh');
    ok(c.log.every(e => !bad(e.t)), 'nhật ký nhận thừa kế sạch');
    // gọi lại không nhận hai lần
    const nw = E.netWorth(c); E.HOOKS.year.forEach(fn => { if (/heirOf/.test(String(fn))) fn(c, H.rf(c), () => {}, c.age); }); near(E.netWorth(c), nw, 'không nhận thừa kế hai lần');
  }
}
// 5. Con chưa đủ 18 tuổi: người giám hộ giữ hộ tài sản đến năm 18 tuổi
{
  const l = parent(840904, { minor: true, noSpouse: true }), i = 2, k = l.kids[i], o = E.childOpts(l, k), h = o.parent.heir;
  if (h.items && h.items.length) {
    const c = E.createLife(o); c.age = h.at; const n0 = (c.props || []).length + (c.ventures || []).length;
    const run = () => E.HOOKS.year.forEach(fn => { if (/heirItemsTrust|heirOf/.test(String(fn))) fn(c, H.rf(c), (t, kk) => c.log.push({ a: c.age, t, k: kk }), c.age); });
    run(); ok(c.flags.heirItemsTrust && (c.props || []).length + (c.ventures || []).length === n0, 'chưa đủ 18: tài sản được giữ hộ');
    c.age = 18; c.indep = true; run(); ok(!c.flags.heirItemsTrust, 'tròn 18 tuổi thì được bàn giao');
  } else ok(true, 'con nhỏ chỉ nhận tiền mặt khi tài sản đã chia cho người khác');
}
// 5b. Người con đã có nhà nhỏ: dọn về nhà lớn được thừa kế, cho thuê căn cũ; đã có nhà lớn hơn thì cho thuê nhà thừa kế
for (const [ownV, moveIn] of [[600, true], [9000, false]]) {
  const l = parent(840905, { noSpouse: true }), A = ES.allocate(l), i = A.list.find(p => p.items.some(x => x.t === 'home')).kid;
  const o = E.childOpts(l, l.kids[i]), c = E.createLife(o); c.age = o.parent.heir.at; c.indep = true;
  c.ownHouse = true; c.houseVal = ownV; c.houseName = 'căn hộ tập thể'; c.props = [];
  E.HOOKS.year.forEach(fn => { if (/heirOf/.test(String(fn))) fn(c, H.rf(c), (t, kk) => c.log.push({ a: c.age, t, k: kk }), c.age); });
  if (moveIn) ok(c.houseName === 'nhà ống ba tầng' && c.props.some(p => /căn hộ tập thể/.test(p.n) && p.v === 600), 'nhà thừa kế lớn hơn: dọn về ở, cho thuê căn cũ');
  else ok(c.houseName === 'căn hộ tập thể' && c.props.some(p => /nhà ống ba tầng/.test(p.n)), 'nhà đang ở lớn hơn: giữ nguyên, cho thuê nhà thừa kế');
}
// 6. Chạy trọn nhiều cuộc đời: khúc cuối không lỗi, giá trị chia luôn khớp
{
  let shown = 0;
  for (let i = 0; i < 60; i++) {
    const l = E.createLife({ mode: i % 3 ? 'vn' : 'world', seed: 846000 + i, year: 2026 }); let g = 0;
    while (l.alive && g++ < 130) { E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l); }
    const st = E.finale(l); ok(Array.isArray(st) && st.every(s => !bad(s.h) && (!s.list || s.list.every(t => !bad(t)))), 'khúc cuối hợp lệ #' + i);
    if (st.some(s => s.h === 'Phân chia tài sản')) shown++;
    const A = ES.allocate(l); A.list.forEach(p => ok(Number.isFinite(p.cash), 'tiền chia hữu hạn'));
  }
  console.log('   Có mục "Phân chia tài sản": ' + shown + '/60 cuộc đời');
}
console.log('PASS: ' + checks + ' kiểm tra · thừa kế nhà, đất, cơ sở kinh doanh kèm tiền mặt.');
