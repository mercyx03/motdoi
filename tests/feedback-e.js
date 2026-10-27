/* Góp ý người chơi — Mốc E: thỏa thuận tài sản trước hôn nhân, chia tài sản ly hôn, di chúc chi tiết, đồng bộ sở hữu. */
'use strict';
const assert = require('assert');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, H = E.H, C = E.ELITE148, M = E.MARITAL150, WL = E.WILL150, ES = E.ESTATE84;
let checks = 0;
const ok = (c, m) => { assert(c, m); checks++; };
const near = (a, b, m, tol) => ok(Math.abs(a - b) <= (tol == null ? Math.max(1e-6, Math.abs(b) * 1e-9) : tol), m + ': ' + a + ' vs ' + b);
const clone = o => JSON.parse(JSON.stringify(o));
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
function keys(l, id, arg) { return E.DEC[id].make(l, () => 0, arg).data.keys; }
function enabled(l, id, arg) { const d = E.DEC[id].make(l, () => 0, arg); return d.opts.filter(o => o.k !== 'cancel').map(o => d.data.keys[+o.k]); }
// Bấm như người chơi: đưa quyết định vào hàng chờ rồi E.resolve
function choose(l, d, key, r) { d.manual = true; l.pending = [d]; const i = d.data && d.data.keys ? d.data.keys.indexOf(key) : -1; const k = i >= 0 ? String(i) : key; assert(d.opts.some(o => o.k === k), d.id + ': có lựa chọn ' + key + ' (' + d.opts.map(o => o.k) + ')'); if (r) l.flags.rngOverride150 = true; E.resolve(l, k); return l.pending[0]; }
function life(o = {}) {
  const l = E.createLife({ mode: o.mode || 'vn', seed: o.seed || 150, year: 1980 });
  Object.assign(l, { age: o.age || 30, edu: 5, indep: true, school: null, pending: [], job: null, jailUntil: null, abroad: null, ownHouse: false, houseVal: 0, mortgage: 0, loans: [], props: [], ventures: [], income: o.income == null ? l.base : o.income });
  l.flags.military = 0; l.money = l.base * (o.wealth == null ? 50 : o.wealth); l.kids = [];
  l.partner = { name: 'Mai', sex: l.sex === 'M' ? 'F' : 'M', age: l.age - 1, status: 'dating', since: l.age - 3, alive: true, affection108: 90, inc: (o.pInc == null ? l.base : o.pInc) / 12 };
  return l;
}
// Cưới qua đúng chuỗi: quyết định cưới → thỏa thuận trước khi về chung nhà → (tùy chọn) thỏa thuận chi tiết
function wed(l, regime) {
  let d = E.DEC.marry.make(l, () => 0.5); d.manual = true; l.pending = [d]; E.resolve(l, 'small');
  const ct = l.pending.find(x => x.id === 'contract108'); assert(ct, 'có bước thỏa thuận'); l.pending = [ct];
  if (!regime || regime === 'default') { E.resolve(l, 'default'); return; }
  E.resolve(l, 'custom150');
  const pn = l.pending.find(x => x.id === 'prenup150'); assert(pn, 'mở thỏa thuận chi tiết'); l.pending = [pn];
  const realRf = H.rf; H.rf = () => () => 0.01; try { E.resolve(l, String(pn.data.keys.indexOf(regime))); } finally { H.rf = realRf; }
}
function divorce(l, r = () => 0.99) { const d = E.DEC.divorce.make(l, r); E.DEC.divorce.apply(l, d, 'div', r, say(l)); }

// ---------- E1. Thỏa thuận trước hôn nhân ----------
{
  const l = life();
  let d = E.DEC.marry.make(l, () => 0.5); d.manual = true; l.pending = [d]; E.resolve(l, 'small');
  const ct = l.pending.find(x => x.id === 'contract108');
  ok(ct.opts.map(o => o.k).join() === 'default,separate,limited,custom150,cancel', 'thỏa thuận cũ giữ nguyên, thêm thỏa thuận chi tiết tùy chọn');
  const vnText = E.DEC.prenup150.make(l, () => 0, { who: l.partner.relation108 }).text, w = life({ mode: 'world' }); w.partner.relation108 = 'r9';
  ok(/luật Việt Nam/.test(vnText) && !/luật Việt Nam/.test(E.DEC.prenup150.make(w, () => 0, { who: 'r9' }).text), 'giải thích theo quốc gia, không áp một luật cho mọi nơi');
  ok(keys(l, 'prenup150', { who: l.partner.relation108 }).join() === 'half,homeOnly,contribution,business,legal', 'các điều khoản: chia đôi, nhà ở, đóng góp, doanh nghiệp riêng, hoặc theo luật');
  const a = life(); wed(a, 'business');
  ok(a.partner.status === 'married' && M.regimeOf(a.partner) === 'business' && a.partner.marital150 && !a.partner.marital150.legacy, 'ký thỏa thuận và kết hôn; ghi nhận tài sản trước hôn nhân');
  near(a.partner.marital150.pre, 50 * a.base - 0, 'tài sản trước hôn nhân được ghi nhận', a.base * 2);
  // Người kia từ chối: hoãn cưới, không tự kết hôn
  const b = life(); let dd = E.DEC.marry.make(b, () => 0.5); dd.manual = true; b.pending = [dd]; E.resolve(b, 'small'); b.pending = [b.pending.find(x => x.id === 'contract108')]; E.resolve(b, 'custom150');
  const pn = b.pending.find(x => x.id === 'prenup150'), realRf = H.rf; H.rf = () => () => 0.99; b.pending = [pn];
  try { E.resolve(b, String(pn.data.keys.indexOf('contribution'))); } finally { H.rf = realRf; }
  ok(b.partner.status === 'dating' && /hoãn cưới/.test(b.log[b.log.length - 1].t), 'điều khoản bị từ chối: hoãn cưới, chưa kết hôn');
  const c = life(); wed(c); ok(M.regimeOf(c.partner) === 'legal', 'không ký: chế độ theo luật định');
  ok(M.regimeOf({ contract108: { share: 0 } }) === 'separate' && M.regimeOf({ contract108: { share: 0.1 } }) === 'limited', 'thỏa thuận cũ được hiểu đúng');
  const rich = life(); rich.ventures = [{ k: 'shop', n: 'Cửa hàng', cap: rich.base * 30 }];
  ok(M.prenupChance(rich, 'business') < M.prenupChance(life(), 'business'), 'người kia khó chấp nhận điều khoản bất lợi cho mình hơn');
}

// ---------- E2. Chia tài sản khi ly hôn ----------
{
  // Tài sản trước hôn nhân giữ nguyên; chỉ phần tạo ra trong hôn nhân được chia; tài sản giảm đúng phần người kia nhận
  const l = life({ wealth: 40 }); wed(l); const pre = l.partner.marital150.pre;
  l.money += l.base * 60; // tích lũy trong hôn nhân
  H.cash(l, l.base * 10, 'Thừa kế từ bà ngoại'); // thừa kế riêng
  const nw0 = E.netWorth(l), q = M.pools(l, l.partner), rt = M.ratio(l, l.partner);
  near(q.separate, pre + l.base * 10, 'tài sản riêng = có trước hôn nhân + được thừa kế riêng', 1e-6);
  divorce(l);
  const c = M.cases(l)[0];
  ok(c && c.regime === 'legal', 'có hồ sơ chia tài sản');
  near(c.paid, q.pool * rt, 'người kia nhận đúng tỷ lệ phần tài sản chung', 1e-6);
  near(nw0 - E.netWorth(l), c.paid, 'tài sản của bạn giảm đúng phần đã chia (không tạo tiền từ hư không)', 1e-6);
  ok(E.netWorth(l) >= q.separate - 1e-6, 'tài sản riêng còn nguyên');
  const st = l.pending.find(x => x.id === 'settlement107'); ok(st && /tài sản riêng/.test(st.text) && st.opts.some(o => o.k === 'court150'), 'bước thỏa thuận sau ly hôn hiện chi tiết và cho phép ra tòa');
  // Không phải lúc nào cũng 50/50
  const hi = life({ income: 0, pInc: 0 }); hi.income = 0; hi.partner.inc = 3 * hi.base / 12; wed(hi); const lo = life(); lo.partner.inc = 0; wed(lo);
  ok(M.ratio(hi, hi.partner) > 0.5 && M.ratio(lo, lo.partner) < 0.5, 'tỷ lệ xét công sức đóng góp, không mặc định 50/50');
  const cheat = life(); wed(cheat); const base = M.ratio(cheat, cheat.partner); cheat.flags.affair107 = { name: 'X', at: 30 };
  ok(M.ratio(cheat, cheat.partner) > base, 'lỗi ngoại tình làm phần của người kia tăng');
  // Tài sản không phải tiền: nhà, bất động sản, đồ sưu tầm, cổ phần — vẫn bảo toàn
  const r = life({ wealth: 0 }); wed(r); r.money = 0;
  r.ownHouse = true; r.houseVal = r.base * 30; r.mortgage = r.base * 10; r.props = [{ k: 'apt', n: 'Căn hộ', v: r.base * 20, basis: r.base * 20 }];
  C.addItem(r, { cat: 'watch', name: 'Đồng hồ', buy: r.base * 5 });
  const kid = { name: 'Bé', sex: 'M', born: r.age - 1, alive: true }; r.kids = [kid]; const kidItem = C.addItem(r, { cat: 'gift:phone', name: 'Điện thoại của bé', buy: 1, owner: E.UPDATE110.uid(r, kid) });
  const partnerId = E.UPDATE110.uid(r, r.partner), ring = C.addItem(r, { cat: 'ring', name: 'Nhẫn cưới', buy: r.base, owner: partnerId });
  const n0 = E.netWorth(r); divorce(r); const rc = M.cases(r)[0];
  near(n0 - E.netWorth(r), rc.paid, 'chia bằng nhà / bất động sản / đồ vật: bảo toàn giá trị', 1e-6);
  ok(rc.detail.length >= 2 && rc.paid > 0, 'chia qua nhiều loại tài sản: ' + rc.detail.map(x => x[0]).join(', '));
  ok(kidItem.owner === E.UPDATE110.uid(r, kid), 'tài sản của con không bị chia');
  ok(ring.owner === partnerId, 'tài sản đã là của người kia vẫn là của họ, không tính lại');
  ok(r.mortgage >= 0 && Number.isFinite(r.houseVal), 'nợ vay nhà vẫn hợp lệ sau khi chia');
  // Thỏa thuận doanh nghiệp riêng: không chia cổ phần / cơ sở kinh doanh
  const b = life({ wealth: 0 }); wed(b, 'business'); b.money = b.base * 10; b.ventures = [{ k: 'shop', n: 'Chuỗi cửa hàng', cap: b.base * 100 }];
  const pb = M.pools(b, b.partner); ok(pb.pool <= b.base * 10 + 1e-6, 'doanh nghiệp không nằm trong phần chia');
  divorce(b); ok(b.ventures[0].cap === b.base * 100, 'cơ sở kinh doanh giữ nguyên sau ly hôn');
  const sp = life(); sp.partner.contract108 = { share: 0, agreed: true }; wed(sp); sp.partner.contract108 = { share: 0, agreed: true }; sp.partner.marital150.regime = 'separate'; sp.money += sp.base * 50; const m0 = sp.money; divorce(sp);
  near(sp.money, m0, 'tài sản riêng hoàn toàn: không chuyển gì', 1e-6);
  // Bản lưu cũ: hôn nhân trước cập nhật giữ cách chia cũ
  const old = life(); old.partner.status = 'married'; old.partner.since = 20; E.HOOKS.year.forEach(fn => { if (/marital150/.test(String(fn))) fn(old, () => 0.5, () => { }); });
  ok(old.partner.marital150.legacy, 'hôn nhân trong bản lưu cũ được đánh dấu');
  const om = old.money; divorce(old); near(old.money, om * 0.6, 'bản lưu cũ: cách chia cũ không đổi', 1e-6); ok(!M.cases(old).length, 'không chia lần hai');
  // Ra tòa: nhiều giai đoạn, có giới hạn
  const t = life({ wealth: 0 }); wed(t); t.money = t.base * 100; t.kids = [{ name: 'Con', sex: 'F', born: t.age - 3, alive: true, custody: 'ex', coParent108: { id: t.partner.relation108, name: 'Mai', sex: 'F' } }];
  divorce(t); const tc = M.cases(t)[0], st2 = t.pending.find(x => x.id === 'settlement107');
  const before = t.money; t.pending = [st2]; st2.manual = true; E.resolve(t, 'court150');
  ok(tc.stage === 'court' && t.money < before, 'ra tòa: nộp án phí, chờ phán quyết');
  ok((t.flags.settled107 || []).includes(st2.data.key), 'không mở lại bước thỏa thuận lần nữa');
  M.courtYear(t, () => 0.5, say(t)); ok(tc.stage === 'court', 'chưa đến hạn thì chưa xử');
  t.age++; const paid0 = tc.paid, cash0 = t.money; M.courtYear(t, () => 0.5, say(t));
  ok(tc.stage === 'closed' && Math.abs((t.money - cash0) + (tc.paid - paid0)) < 1e-6, 'phán quyết điều chỉnh tiền giữa hai bên, không sinh tiền');
  ok(tc.paid >= 0 && tc.paid <= tc.pool, 'phần người kia nhận nằm trong tài sản chung');
}

// ---------- E3. Di chúc chi tiết ----------
function parent(o = {}) {
  const l = E.createLife({ mode: 'vn', seed: o.seed || 1500, year: 1960 });
  Object.assign(l, { age: 70, indep: true, money: 800, loans: o.loans || [], mortgage: 0, ownHouse: true, houseVal: 3000, houseName: 'nhà ống ba tầng', props: [{ k: 'apt', n: 'căn hộ cho thuê', v: 2000, basis: 1500, y: 0.05, since: 50, empty: 0 }], ventures: [] });
  E.migrateExt(l); l.assets.land = 0;
  l.partner = o.noSpouse ? null : { name: 'Trần Thị Hoa', sex: l.sex === 'M' ? 'F' : 'M', age: 68, since: 25, status: 'married', alive: true };
  l.kids = [{ name: 'An', sex: 'M', born: 28, alive: true, close: 70, edu: 5 }, { name: 'Bình', sex: 'F', born: 32, alive: true, close: 70, edu: 3 }].concat(o.minor ? [{ name: 'Út', sex: 'M', born: 60, alive: true, close: 70, edu: 1 }] : []);
  return l;
}
function die(l) { l.alive = false; l.death = { age: l.age, cause: 'tuổi già', year: l.birthYear + l.age }; return l; }
function sumAlloc(A) { return A.list.reduce((s, p) => s + p.items.reduce((t, x) => t + x.v, 0) + p.cash, 0); }
{
  // Giao tài sản cụ thể
  const l = parent({ noSpouse: true }); l.money = 6000;
  ok(keys(l, 'will150').join() === 'ratio,specific,exclude,executor,clear', 'menu di chúc chi tiết');
  const prop = WL.assets(l).find(a => a.key.startsWith('prop:'));
  E.DEC.will150_to.apply(l, Object.assign(E.DEC.will150_to.make(l, () => 0, { asset: prop.key }), {}), String(keys(l, 'will150_to', { asset: prop.key }).indexOf('k1')), () => 0, say(l));
  ok(WL.W(l).specific[prop.key] === 'k1', 'giao căn hộ cho Bình');
  die(l); const A = ES.allocate(l), est = E.WILL70.estate(l);
  const p = A.list.find(x => x.kid === 1); ok(p.items.some(x => x.t === 'prop' && x.n === 'căn hộ cho thuê'), 'căn hộ về đúng người được giao');
  ok(A.list.filter(x => x.items.some(y => y.t === 'prop')).length === 1, 'mỗi tài sản chỉ được giao một lần');
  near(sumAlloc(A), est.net, 'tổng phân chia bằng di sản ròng (không chia vượt)');
}
{
  // Nợ lớn: món giao cụ thể không được vượt di sản
  const l = parent({ noSpouse: true, loans: [{ type: 'bank', bal: 5200 }] }); l.money = 0;
  const prop = WL.assets(l).find(a => a.key.startsWith('prop:')); WL.W(l).specific[prop.key] = 'k0';
  die(l); const A = ES.allocate(l), est = E.WILL70.estate(l);
  ok(sumAlloc(A) <= est.net + 1e-6, 'nợ lớn: không giao vượt quá di sản ròng (' + sumAlloc(A) + ' / ' + est.net + ')');
}
{
  // Truất quyền thừa kế con đã trưởng thành; không áp dụng với con chưa thành niên
  const l = parent({ noSpouse: true, minor: true });
  ok(!enabled(l, 'will150_exclude').includes('k2') && enabled(l, 'will150_exclude').includes('k0'), 'chỉ con đã trưởng thành mới có thể bị loại');
  WL.W(l).exclude.push('k0', 'k2');
  die(l); const est = E.WILL70.estate(l);
  const an = est.list.concat(est.law).filter(x => x.kid === 0).reduce((s, x) => s + x.amount, 0), ut = est.list.concat(est.law).filter(x => x.kid === 2).reduce((s, x) => s + x.amount, 0);
  ok(an === 0, 'An không nhận thừa kế');
  ok(ut > 0 && est.notes.some(n => /không có hiệu lực/.test(n)), 'con chưa thành niên vẫn được hưởng');
  near(est.list.concat(est.law).reduce((s, x) => s + x.amount, 0), est.net, 'phần của người bị loại chuyển cho người khác, không mất');
}
{
  // Vợ/chồng: phần tài sản chung của họ không phải di sản; Việt Nam bảo đảm 2/3 suất
  const l = life({ wealth: 10, age: 40 }); wed(l); l.money += l.base * 100; l.kids = [{ name: 'An', sex: 'M', born: 15, alive: true }];
  l.flags.will70 = { revision: 1, age: 40, plan: 'custom', shares: { k0: 100 }, kidNames: { k0: 'An' }, note: '' };
  const own = WL.spouseOwn(l); ok(own > 0, 'có phần tài sản chung của vợ/chồng');
  die(l); const est = E.WILL70.estate(l), sp = est.list.concat(est.law).filter(x => x.spouse).reduce((s, x) => s + x.amount, 0);
  ok(sp >= own - 1e-6, 'vợ/chồng nhận lại phần của mình trong tài sản chung');
  ok(est.notes.some(n => /2\/3 suất/.test(n)), 'di chúc để hết cho con: vợ/chồng vẫn được tối thiểu theo luật');
  near(est.list.concat(est.law).reduce((s, x) => s + x.amount, 0), est.net, 'tổng không vượt di sản');
}
{
  // Người thi hành: văn phòng luật thu phí, không phải chủ sở hữu
  const l = parent({ noSpouse: true }); WL.W(l).executor = { key: 'lawyer', name: 'Văn phòng luật độc lập', kind: 'lawyer' };
  die(l); const est = E.WILL70.estate(l), fee = est.list.find(x => x.fee150);
  near(fee.amount, est.net * 0.01, 'phí thi hành 1%', 1e-6);
  ok(E.finale(l).some(s => s.h === 'Thi hành di chúc' && s.list.some(x => /không phải chủ sở hữu/.test(x))), 'khúc cuối đời ghi rõ người thi hành chỉ quản lý');
}
{
  // Tranh chấp: di chúc chênh lệch dễ bị kiện; có người thi hành độc lập thì ít hơn
  const a = parent({ noSpouse: true }); a.flags.will70 = { revision: 1, age: 70, plan: 'custom', shares: { k0: 90, k1: 10 }, kidNames: { k0: 'An', k1: 'Bình' }, note: '' }; die(a);
  const b = parent({ noSpouse: true }); b.flags.will70 = clone(a.flags.will70); WL.W(b).executor = { key: 'lawyer', name: 'Luật', kind: 'lawyer' }; die(b);
  const da = WL.dispute(a), db = WL.dispute(b);
  ok(da && db && db.chance < da.chance, 'người thi hành độc lập làm giảm nguy cơ tranh chấp');
  ok(JSON.stringify(WL.dispute(a)) === JSON.stringify(da), 'kết quả tranh chấp ổn định, không đổi mỗi lần xem');
  const eq = parent({ noSpouse: true }); eq.flags.will70 = { revision: 1, age: 70, plan: 'equal', note: '' }; die(eq); ok(!WL.dispute(eq), 'chia đều thì không phát sinh tranh chấp');
  // Tìm một trường hợp có tranh chấp được hòa giải và kiểm tra sang đời con
  let hit = null; for (let s = 1; s < 200 && !hit; s++) { const x = parent({ noSpouse: true, seed: 5000 + s }); x.flags.will70 = clone(a.flags.will70); die(x); const d = WL.dispute(x); if (d && d.happened && d.adjusted) hit = x; }
  ok(hit, 'có trường hợp tranh chấp được hòa giải');
  const d = WL.dispute(hit), claimant = hit.kids[d.claimant], o = E.childOpts(hit, claimant), child = E.createLife(o);
  ok(child.flags.heirWill150 && child.flags.heirWill150.dispute.amount > 0, 'người khởi kiện được bù trong đời tiếp theo');
  child.age = child.flags.heirWill150.dispute.age - 1; const c0 = child.money; WL.heirYear(child, () => 0.5, say(child)); ok(child.money === c0, 'chưa đến lúc thì chưa có kết quả');
  child.age++; WL.heirYear(child, () => 0.5, say(child)); ok(child.money > c0, 'vụ tranh chấp khép lại sau một thời gian');
  const c1 = child.money; WL.heirYear(child, () => 0.5, say(child)); ok(child.money === c1, 'không nhận hai lần');
}
{
  // Đồ sưu tầm được thừa kế đúng một lần; quà đã tặng không còn trong di sản
  const l = parent({ noSpouse: true }); l.flags.elite148 = undefined;
  const watch = C.addItem(l, { cat: 'watch', name: 'Đồng hồ cổ', buy: 500 }), gift = C.addItem(l, { cat: 'gift:car', name: 'Ô tô tặng An', buy: 900, owner: E.UPDATE110.uid(l, l.kids[0]) });
  WL.W(l).specific['item:' + watch.uid110] = 'k1';
  die(l); const items = ES.items(l);
  ok(items.some(x => x.t === 'item148' && x.n === 'Đồng hồ cổ') && !items.some(x => x.n === 'Ô tô tặng An'), 'di sản gồm đồ của bạn, không gồm quà đã tặng');
  const A = ES.allocate(l); ok(A.list.find(p => p.kid === 1).items.some(x => x.t === 'item148'), 'đồng hồ về đúng người được giao');
  const o = E.childOpts(l, l.kids[1]), child = E.createLife(o); child.age = Math.max(18, o.parent.heir.at); child.indep = true;
  E.HOOKS.year.forEach(fn => { if (/heirOf/.test(String(fn))) fn(child, H.rf(child), say(child), child.age); });
  WL.heirYear(child, () => 0.5, say(child)); WL.heirYear(child, () => 0.5, say(child));
  ok(C.mine(child).filter(x => x.name === 'Đồng hồ cổ').length === 1, 'người con nhận đồng hồ đúng một lần');
}
{
  // Quyền điều hành khác quyền sở hữu
  const l = parent({ noSpouse: true }); E.BUSINESS123.companies(l).push({ name: 'Công ty Bình An', value: 4000, share: 100, sector: 'tech', governance: 0, created: 30, roles: {} });
  const k = keys(l, 'will150_manage'); ok(k.some(x => x.endsWith('>k1')), 'có thể giao quyền điều hành cho từng người con');
  const key = k.find(x => x.endsWith('>k1')); E.DEC.will150_manage.apply(l, E.DEC.will150_manage.make(l, () => 0), String(k.indexOf(key)), () => 0, say(l));
  die(l); const o = E.childOpts(l, l.kids[0]);
  ok(o.parent.will150 && o.parent.will150.manage[0].manager === 'Bình' && !o.parent.will150.manage[0].self, 'An biết Bình điều hành, cổ phần vẫn chia theo tỷ lệ');
  ok(E.finale(l).some(s => s.h === 'Thi hành di chúc' && s.list.some(x => /Bình được giao điều hành/.test(x))), 'khúc cuối đời ghi quyền điều hành');
  for (const [i, who] of [[0, 'sibling'], [1, 'self']]) {
    const oo = E.childOpts(l, l.kids[i]), c = E.createLife(oo); c.age = Math.max(18, oo.parent.heir.at); c.indep = true;
    E.HOOKS.year.forEach(fn => { if (/heirOf/.test(String(fn))) fn(c, H.rf(c), say(c), c.age); });
    WL.heirYear(c, () => 0.5, say(c));
    const co = E.BUSINESS123.companies(c).find(x => x.name === 'Công ty Bình An');
    ok(co && co.share > 0 && co.share < 100, (who === 'self' ? 'Bình' : 'An') + ' nhận một phần cổ phần, không phải toàn bộ');
    if (who === 'sibling') ok(co.roles.ceo && co.roles.ceo.kind === 'relative' && co.roles.ceo.name === 'Bình', 'đời của An: Bình điều hành công ty dù An cũng là cổ đông');
    else ok(co.roles.ceo && co.roles.ceo.kind === 'self', 'đời của Bình: Bình tự điều hành');
  }
}

// ---------- E4. Đồng bộ sở hữu ----------
{
  const l = life({ wealth: 100 }); C.S(l);
  const x = C.addItem(l, { cat: 'watch', name: 'Đồng hồ', buy: l.base });
  ok(!C.transfer(l, Object.assign({}, x, { owner: 'someone' }), 'b', 'B'), 'không chuyển được món không phải của mình');
  ok(C.transfer(l, x, 'a', 'A') && !C.transfer(l, x, 'b', 'B') && x.owner === 'a', 'đã tặng thì không tặng lại người khác được');
  ok(E.WILL70.check(l, { at: l.age, plan: 'custom', note: '', shares: { k0: 120 } }) !== '', 'di chúc không chia quá 100%');
  // Quyền lợi gia tộc trừ một lần mỗi năm dù vòng năm chạy lại
  const h = life({ wealth: 100, age: 50 }); h.partner.status = 'married'; h.kids = [{ name: 'A', sex: 'M', born: 20, alive: true }, { name: 'B', sex: 'F', born: 22, alive: true }];
  const rel = C.relatives(h).find(y => y.name === 'A'); C.benefits(h, rel.id).push({ k: 'home', cost: h.base * 0.3, since: h.age });
  const hook = E.HOOKS.year.find(fn => /elite148/.test(String(fn)) && /familyYear/.test(String(fn))), m0 = h.money;
  hook(h, () => 0.9, () => { }); hook(h, () => 0.9, () => { });
  near(m0 - h.money, h.base * 0.3, 'không trừ hai lần trong một năm', 1e-6);
  // Ly hôn không đụng tài sản con, bố mẹ; tài sản được tặng giữ chủ
  const d = life({ wealth: 20 }); wed(d); d.money += d.base * 30; const kid = { name: 'Nhỏ', sex: 'F', born: d.age - 2, alive: true }; d.kids = [kid];
  const kItem = C.addItem(d, { cat: 'gift:laptop', name: 'Laptop', buy: d.base, owner: E.UPDATE110.uid(d, kid) }), pItem = C.addItem(d, { cat: 'gift:watch', name: 'Đồng hồ của bố', buy: d.base, owner: 'parent:f' });
  divorce(d);
  ok(kItem.owner === kid.uid110 && pItem.owner === 'parent:f', 'ly hôn không chia tài sản của con và của bố mẹ');
  ok(M.cases(d).length === 1, 'mỗi cuộc ly hôn xử lý một lần'); const again = M.divorceSplit(d, { name: 'Mai', since: d.partner ? 0 : M.cases(d)[0].key.split('|')[1] * 1, marital150: { pre: 0 } }, { money: d.money, loans: [] }, () => 0.5, () => { }); ok(again === null, 'không xử lý chia tài sản lần hai');
  // Tải lại bản lưu
  const back = E.migrate(clone(d)); ok(back.flags.marital150.cases.length === 1 && back.flags.elite148.items.some(y => y.owner === kid.uid110), 'tải lại: hồ sơ chia tài sản và chủ sở hữu giữ nguyên');
}
console.log('PASS feedback-e: ' + checks + ' kiểm tra.');
