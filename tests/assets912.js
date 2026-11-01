/* Bộ chọn tài sản dùng chung: bán / tặng con / di chúc — nhóm USD liên tục, lọc, phân trang, ID ổn định, không nhân đôi tài sản. */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, A = E.ASSET912, WL = E.WILL150, ES = E.ESTATE84;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
const reload = l => E.migrate(JSON.parse(JSON.stringify(l)));
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
function owner(o = {}) {
  const l = E.createLife(Object.assign({ mode: 'vn', seed: o.seed || 9120, year: 1960 }, o.world ? { mode: 'world', country: o.world } : {}));
  Object.assign(l, { age: 60, indep: true, alive: true, school: null, job: null, pending: [], sched: [], jailUntil: null, abroad: null, ownHouse: false, houseVal: 0, mortgage: 0, loans: [], props: [], ventures: [], kids: [], partner: null });
  l.flags.military = 0; l.money = l.base * 200; E.migrateExt(l);
  return l;
}
function addProps(l, n, value) { for (let i = 0; i < n; i++) l.props.push({ k: 'apt', n: 'Căn hộ ' + (i + 1), city: i % 3 ? 'Hà Nội' : 'Đà Nẵng', v: typeof value === 'function' ? value(i) : value, basis: 1, y: 0.04, since: 40, empty: 0 }); }
function open(l, id, arg) { const d = E.DEC[id].make(l, () => 0, arg); d.manual = true; d.data.requested = true; d.data.actionYear850 = l.age; return d; }
function keys(d) { return d.data.keys; }
function press(l, d, key) { const i = keys(d).indexOf(key); assert(i >= 0, d.id + ' has ' + key + ' in ' + keys(d).join(',')); l.pending = [d]; E.resolve(l, String(i)); return l.pending[0]; }
function assetKeys(d) { return keys(d).filter(k => /^a:/.test(k)); }

// 1. Ranh giới nhóm: khoảng nửa mở, liên tục, không chồng lấn; 5,8 triệu USD thuộc nhóm 1–5.
{
  const M = 1e6, B = A.BUCKETS;
  for (let i = 1; i < B.length; i++) ok(B[i].min === B[i - 1].max, 'buckets contiguous at ' + B[i].n);
  ok(A.bucketOf(5.8 * M).k === 'b1' && A.bucketOf(6 * M).k === 'b2' && A.bucketOf(5.999999 * M).k === 'b1', '5.8M and 6M boundaries');
  ok(A.bucketOf(0).k === 'b0' && A.bucketOf(999999).k === 'b0' && A.bucketOf(1 * M).k === 'b1', 'below 1M / exactly 1M');
  ok(A.bucketOf(1000.5 * M).k === 'b8' && A.bucketOf(1001 * M).k === 'b9' && A.bucketOf(5e12).k === 'b9', 'top buckets');
}
// 2. Số lượng tài sản 0/1/30/31/500/2000: mọi tài sản đều chọn được, mỗi trang ≤ 20 dòng tài sản, menu ≤ 54 dòng.
for (const n of [0, 1, 30, 31, 500, 2000]) {
  const l = owner({ seed: 9121 + n }); addProps(l, n, i => 100 + i); // giá tăng dần để có thứ tự xác định
  if (!n) { ok(E.actions(l).find(r => r.id === 'quan_ly_dau_tu').ok !== true, '0 assets: sell action explains why'); continue; }
  let d = open(l, 'sell912', {}), seen = new Set(), pages = 0;
  ok(d.data.keys.length <= 54, n + ' assets: menu within 54 rows');
  for (;;) { pages++; assetKeys(d).forEach(k => seen.add(k)); ok(assetKeys(d).length <= A.PAGE, 'page has ≤ 20 assets'); if (keys(d).indexOf('pg:next') < 0) break; d = press(l, d, 'pg:next'); }
  ok(seen.size === n && pages === Math.ceil(n / A.PAGE), n + ' assets: all reachable via ' + pages + ' pages');
  if (n === 2000) { const t = Date.now(); for (let i = 0; i < 5; i++) open(l, 'sell912', { page: 50 }); ok((Date.now() - t) / 5 < 400, '2000 assets: building one page stays fast'); }
}
// 3. Căn rẻ nhất vẫn chọn được và bán đúng căn đó (trước đây chỉ bán được món đầu tiên).
{
  const l = owner({ seed: 91230 }); addProps(l, 45, i => i === 37 ? 3 : 500 + i); const cheapest = l.props[37]; const uid = E.UPDATE110.uid(l, cheapest);
  let d = open(l, 'sell912', { sort: 'va' }); ok(assetKeys(d)[0] === 'a:prop:' + uid, 'ascending sort puts cheapest first');
  d = open(l, 'sell912', {}); while (keys(d).indexOf('a:prop:' + uid) < 0) d = press(l, d, 'pg:next');
  const money = l.money; let c = press(l, d, 'a:prop:' + uid); ok(c.id === 'sell912_ok' && /Căn hộ 38/.test(c.text), 'confirm screen names the chosen flat');
  E.resolve(l, 'confirm'); ok(!l.props.includes(cheapest) && l.props.length === 44 && Math.abs(l.money - money - 3) < 1e-9, 'sold exactly the cheapest flat after paging');
  ok(E.FAMILY129.trades(l, 'quan_ly_dau_tu') === 1, 'sale counted in yearly trade quota');
}
// 4. Tên trùng: chọn theo ID, không theo tên.
{
  const l = owner({ seed: 91240 }); addProps(l, 3, 200); l.props.forEach(p => { p.n = 'Căn hộ giống nhau'; }); const target = l.props[2], uid = E.UPDATE110.uid(l, target);
  const d = open(l, 'sell912', {}); press(l, d, 'a:prop:' + uid); E.resolve(l, 'confirm');
  ok(!l.props.includes(target) && l.props.length === 2, 'duplicate names: the selected one is sold');
}
// 5. Lọc: tìm theo địa điểm (không dấu), loại, trạng thái, nhóm; tìm không thấy có thông báo rõ.
{
  const l = owner({ seed: 91250 }); addProps(l, 9, 100); l.props[1].empty = 2; l.ventures.push({ k: 'shop', n: 'Cửa hàng tiện lợi', br: 1, cap: 300 });
  let d = open(l, 'sell912', { q: 'da nang' }); ok(assetKeys(d).length === 3, 'search by place without accents');
  d = open(l, 'sell912', { q: 'không có gì' }); ok(assetKeys(d).length === 0 && /Không có tài sản nào khớp/.test(d.text), 'empty search explained');
  d = open(l, 'sell912', { kind: 'business' }); ok(assetKeys(d).length === 1 && /venture/.test(assetKeys(d)[0]), 'filter by type');
  d = open(l, 'sell912', { status: 'vacant' }); ok(assetKeys(d).length === 1, 'filter by status');
  const n = E.DEC.sell912.make(l, () => 0, { kind: 'rental' }); ok(n.data.keys.includes('f:kind') && n.data.keys.includes('f:status') && n.data.keys.includes('f:sort'), 'filter rows present');
}
// 6. Tiền tệ: VND và USD, tỷ giá chốt khi mở và giữ qua chuyển trang.
{
  const l = owner({ seed: 91260 }); addProps(l, 1, 25400 * 5.8); // 5,8 triệu USD tính theo triệu đồng
  const V = A.view(l, A.sellable(l), {}); ok(V.shown[0].bucket === 'b1' && Math.abs(V.shown[0].usd - 5.8e6) < 1, 'VND asset converts to 5.8M USD → bucket 1–5');
  const u = owner({ seed: 91261, world: 'US' }); addProps(u, 1, 7e6 / G.CUR.priceLevel(u.gdp)); const VU = A.view(u, A.sellable(u), {}); ok(VU.shown[0].bucket === 'b2', 'USD asset bucketed by nominal USD');
  const j = owner({ seed: 91262, world: 'JP' }); addProps(j, 1, 1000); ok(Number.isFinite(A.view(j, A.sellable(j), {}).shown[0].usd), 'other currency converts');
  const d = open(l, 'sell912', { fx: 1e-9 }); ok(Math.abs(d.data.arg.fx - 1e-9) < 1e-15, 'snapshot fx kept as passed');
  const d2 = press(l, open(l, 'sell912', { fx: 1e-9 }), 'f:sort'); ok(d2.data.arg.fx === 1e-9 && d2.data.arg.sort === 'va', 'snapshot fx travels with filter steps');
  const d3 = press(l, d2, 'f:sort'); ok(d3.data.arg.fx === 1e-9, 'snapshot fx kept on next step');
}
// 7. Lưu giữa chừng: tải lại vẫn ở đúng trang, đúng bộ lọc, xác nhận vẫn hợp lệ.
{
  const l = owner({ seed: 91270 }); addProps(l, 45, i => 100 + i);
  let d = open(l, 'sell912', {}); d = press(l, d, 'pg:next'); const r = reload(l);
  ok(r.pending[0].id === 'sell912' && r.pending[0].data.arg.page === 1, 'reload keeps page');
  const k = assetKeys(r.pending[0])[0]; const c = press(r, r.pending[0], k); const r2 = reload(r);
  ok(r2.pending[0].id === 'sell912_ok', 'reload keeps confirmation'); const before = r2.props.length; E.resolve(r2, 'confirm'); ok(r2.props.length === before - 1, 'confirm after reload sells once');
  E.resolve(r2, 'confirm'); ok(r2.props.length === before - 1, 'second confirm does not sell again');
}
// 8. Bán tài sản đã chỉ định trong di chúc: điều khoản hết hiệu lực, có nhật ký.
{
  const l = owner({ seed: 91280 }); addProps(l, 2, 400); l.kids = [{ name: 'An', sex: 'M', born: 25, alive: true, close: 70, edu: 5 }];
  const key = 'prop:' + E.UPDATE110.uid(l, l.props[0]); WL.W(l).specific[key] = 'k0';
  press(l, open(l, 'sell912', {}), 'a:' + key); ok(/di chúc cho An/.test(l.pending[0].text), 'confirm warns about will clause'); E.resolve(l, 'confirm');
  ok(!WL.W(l).specific[key] && l.log.some(e => /hết hiệu lực vì tài sản đã bán/.test(e.t)), 'will clause lapses on sale');
}
// 9. Di chúc: chọn được tài sản thứ 31+ và căn rẻ nhất; người nhận theo khóa ổn định; người nhận mất → chia theo tỷ lệ; thi hành một lần.
{
  const l = owner({ seed: 91290 }); addProps(l, 40, i => i === 39 ? 2 : 300 + i);
  l.kids = [{ name: 'An', sex: 'M', born: 25, alive: true, close: 70, edu: 5 }, { name: 'An', sex: 'F', born: 28, alive: true, close: 70, edu: 5 }];
  let d = open(l, 'will150_asset', { sort: 'va' }); const k = assetKeys(d)[0]; ok(/Căn hộ 40/.test(d.opts[keys(d).indexOf(k)] ? d.opts.find(o => o.k === String(keys(d).indexOf(k))).l : ''), 'cheapest (40th) asset reachable in will');
  const to = press(l, d, k); ok(to.id === 'will150_to', 'opens recipient step');
  const i = to.data.keys.indexOf('k1'); l.pending = [to]; E.resolve(l, String(i));
  ok(WL.W(l).specific[k.slice(2)] === 'k1', 'recipient stored by stable key even with duplicate names');
  ok(l.props.length === 40, 'writing a will transfers nothing while alive');
  const dead = JSON.parse(JSON.stringify(l)); dead.kids[1].alive = false; dead.alive = false; dead.death = { age: dead.age, cause: 'tuổi già', year: dead.birthYear + dead.age };
  const Ad = ES.allocate(E.migrate(dead)); ok(!Ad.list.some(p => p.kid === 1), 'dead recipient gets nothing'); ok(!Ad.list.some(p => p.items.some(x => x.n === 'Căn hộ 40' && x.specific150)), 'clause for dead recipient not applied; asset returns to normal split');
  l.alive = false; l.death = { age: l.age, cause: 'tuổi già', year: l.birthYear + l.age };
  const Al = ES.allocate(l), p1 = Al.list.find(p => p.kid === 1); ok(p1 && p1.items.some(x => x.n === 'Căn hộ 40'), 'executed: flat goes to the named child');
  ok(Al.list.filter(p => p.items.some(x => x.n === 'Căn hộ 40')).length === 1, 'asset allocated once');
}
// 10. Tặng con: chọn được tài sản ngoài 54 dòng; không nhân đôi; hủy không trừ tiền.
{
  const l = owner({ seed: 91300 }); addProps(l, 70, i => 50 + i); l.kids = [{ name: 'Bình', sex: 'F', born: 25, alive: true, close: 100, edu: 5 }];
  const kid = E.UPDATE110.uid(l, l.kids[0]); let d = open(l, 'giftAsset112', { kid, sort: 'va' });
  ok(assetKeys(d).length === 20 && d.data.keys.length <= 54, 'gift list paged');
  const last = l.props[69], key = 'a:prop:' + E.UPDATE110.uid(l, last); d = open(l, 'giftAsset112', { kid, sort: 'vd' }); ok(assetKeys(d)[0] === key, '70th asset reachable');
  const money = l.money; press(l, d, key);
  ok(!l.props.includes(last) && l.kids[0].gifts112.length === 1 && l.money < money, 'gift transferred once with fee');
  const d2 = open(l, 'giftAsset112', { kid }); ok(!keys(d2).includes(key), 'gifted asset no longer listed');
  const m2 = l.money; l.pending = [d2]; E.resolve(l, 'cancel'); ok(l.money === m2, 'cancel costs nothing');
}
// 11. Hiển thị không đổi bản lưu (trừ gán ID ổn định lần đầu, idempotent).
{
  const l = owner({ seed: 91310 }); addProps(l, 25, 100); open(l, 'sell912', {}); const s = JSON.stringify(l); open(l, 'sell912', { page: 1, q: 'Hà' }); E.actions(l);
  ok(JSON.stringify(l) === s, 'browsing assets does not change the save');
}
// 12. Tìm kiếm từ giao diện: requery giữ token lượt hành động và quay về trang 1.
{
  const l = owner({ seed: 91320 }); addProps(l, 30, 100); const d = E.act(l, 'quan_ly_dau_tu'); ok(d && d.id === 'sell912', 'action opens new picker');
  const n = A.requery(l, 'Đà'); ok(n && n.data.arg.q === 'Đà' && n.data.actionId850 === 'quan_ly_dau_tu' && n.data.arg.page === 0 && l.pending[0] === n, 'requery keeps turn token');
}
console.log('Bộ chọn tài sản: ' + count + ' checks passed.');
