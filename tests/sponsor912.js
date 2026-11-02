/* Chủ động chu cấp: hồ sơ cố định trong năm, đề nghị nhiều điều khoản, đồng ý/thương lượng/từ chối, trả đúng một lần mỗi năm, kết thúc rõ ràng. */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, SP = E.SPONSOR912, HOOK = E.HOOKS.year.find(f => /sponsorRomance912/.test(f.toString()));
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
const reload = l => E.migrate(JSON.parse(JSON.stringify(l)));
function donor(o = {}) {
  const l = E.createLife({ mode: 'vn', seed: o.seed || 9127, year: 1980 });
  Object.assign(l, { age: o.age || 35, indep: true, alive: true, pending: [], sched: [], jailUntil: null, abroad: null, partner: o.partner || null, karma: 0 });
  l.flags.military = 0; l.money = l.base * (o.wealth == null ? 30 : o.wealth); E.migrateExt(l); return l;
}
function open(l, id, arg) { const d = E.DEC[id].make(l, () => 0, arg); d.manual = true; d.data.requested = true; d.data.actionYear850 = l.age; l.pending = [d]; return d; }
function press(l, key) { const d = l.pending[0], i = d.data.keys.indexOf(key); assert(i >= 0, d.id + ' has ' + key + ' in ' + d.data.keys.join(',')); E.resolve(l, String(i)); return l.pending[0]; }
function offer(l, id, o) { open(l, 'sponsorOffer912', { id, offer: o || {} }); return press(l, 'send'); }

// 1. Ứng viên: đúng số lượng, trưởng thành, theo bộ lọc giới tính/tuổi; mở lại không tạo lại; năm sau đổi danh sách.
{
  const l = donor(); l.flags.dating108 = { lo: 25, hi: 30, sex: 'F', country: 'local' };
  const a = SP.candidates(l); ok(a.length === SP.BAL.candidates, 'four candidates');
  ok(a.every(p => p.age >= 25 && p.age <= 30 && p.sex === 'F'), 'candidates follow dating filter');
  ok(a.every(p => p.needText && p.background && p.traits.length && p.wish && p.bound && p.job !== undefined), 'profiles have situation, traits, wishes, boundaries, job');
  const snap = JSON.stringify(a); open(l, 'sponsor912', {}); open(l, 'sponsorOffer912', { id: a[0].id });
  ok(JSON.stringify(SP.candidates(l)) === snap, 'opening profiles does not regenerate hardships');
  const r = reload(l); ok(JSON.stringify(SP.candidates(r)) === snap, 'reload keeps the same profiles');
  l.age++; ok(SP.candidates(l)[0].id !== a[0].id, 'new list next year');
  const teen = donor({ age: 19 }); ok(E.actions(teen).find(x => x.id === 'sponsor912').ok !== true, 'under 21 cannot sponsor');
}
// 2. Đồng ý không phụ thuộc giàu/nghèo của người nhận; điều khoản vượt ranh giới bị thương lượng/từ chối.
{
  const l = donor({ seed: 912701 }), p = SP.candidates(l)[0];
  const base = { level: 'full', years: 1, purpose: 'need', meet: 'none', exclusive: false };
  const o = SP.normalize(p, { offer: base });
  const rich = Object.assign({}, p, { background: 'gia đình có điều kiện nhưng muốn tự lo' }), poor = Object.assign({}, p, { background: 'lớn lên ở nông thôn, gửi tiền về cho bố mẹ' });
  ok(SP.evaluate(l, rich, o).score === SP.evaluate(l, poor, o).score, 'background (rich/poor) is not an acceptance factor');
  const proud = Object.assign({}, p, { pride: 1 }), humble = Object.assign({}, p, { pride: 0 }); ok(SP.evaluate(l, proud, o).score < SP.evaluate(l, humble, o).score, 'pride/independence lowers willingness');
  const priv = Object.assign({}, p, { bound: 'private' }), ev = SP.evaluate(l, priv, Object.assign({}, o, { meet: 'weekly' }));
  ok(ev.counter && ev.counter.meet === 'monthly', 'weekly meetings beyond boundary → counter-offer monthly');
  const fr = Object.assign({}, p, { bound: 'free' }); ok(SP.evaluate(l, fr, Object.assign({}, o, { exclusive: true })).counter.exclusive === false, 'exclusivity refused by boundary');
  ok(SP.evaluate(l, humble, o).score < 1, 'never certain');
}
// 3. Đề nghị bằng menu: đổi điều khoản không tốn tiền; gửi → chấp nhận/thương lượng/từ chối; chấp nhận trả năm đầu đúng một lần.
{
  let accepted = 0, countered = 0, declined = 0;
  for (let s = 0; s < 60; s++) {
    const l = donor({ seed: 912800 + s }), p = SP.candidates(l)[0], m0 = l.money;
    open(l, 'sponsorOffer912', { id: p.id }); press(l, 'me'); ok(l.money === m0, 'changing draft costs nothing');
    press(l, 'send');
    const st = SP.state(l);
    if (st.deals.length) { accepted++; const d = st.deals[0]; ok(Math.abs(m0 - l.money - d.monthly * 12) < 1e-6 && d.paidAt === l.age, 'first year paid once');
      E.HOOKS.year.forEach(() => 0); SP.pay(l, d, () => {}, false); ok(Math.abs(m0 - l.money - d.monthly * 12) < 1e-6, 'second pay same year refused'); }
    else if (l.pending[0] && l.pending[0].id === 'sponsorCounter912') countered++;
    else declined++;
  }
  ok(accepted > 5 && declined > 3 && accepted + countered + declined === 60, 'mix of outcomes (' + accepted + '/' + countered + '/' + declined + ')');
}
// 4. Thương lượng: đồng ý điều kiện mới thì lập thỏa thuận theo điều kiện đó.
{
  let done = false;
  for (let s = 0; s < 200 && !done; s++) {
    const l = donor({ seed: 913000 + s }), p = SP.candidates(l).find(x => x.bound === 'private'); if (!p) continue;
    offer(l, p.id, { meet: 'weekly' });
    if (l.pending[0] && l.pending[0].id === 'sponsorCounter912') { press(l, 'ok'); const d = SP.state(l).deals[0]; ok(d && d.meet === 'monthly', 'counter terms applied'); done = true; }
  }
  ok(done, 'a counter-offer was reached and accepted');
}
// 5. Thiếu tiền: không gửi được; đang hỗ trợ mà hết tiền → trễ hạn rồi chấm dứt; hết hạn; người nhận mất; kết thúc chủ động.
{
  const poor = donor({ seed: 913301, wealth: 0.6 }), p = SP.candidates(poor)[0];
  open(poor, 'sponsorOffer912', { id: p.id, offer: { level: 'plus', years: 3 } }); ok(poor.pending[0].opts.find(o => o.k === String(poor.pending[0].data.keys.indexOf('send'))) === undefined, 'send hidden when unaffordable');
  let l, d;
  for (let s = 0; s < 80 && !d; s++) { l = donor({ seed: 913400 + s }); const q = SP.candidates(l)[0]; offer(l, q.id, { years: 3 }); d = SP.state(l).deals[0]; }
  ok(d, 'deal created');
  l.money = 0; l.age++; HOOK(l, () => .9, () => {});
  ok(d.status === 'late' && d.missed === 1, 'missed payment marks late');
  l.age++; HOOK(l, () => .9, () => {}); ok(d.status === 'ended' && d.endWhy === 'thiếu tiền', 'two misses end the deal');
  let m, e;
  for (let s = 0; s < 80 && !e; s++) { m = donor({ seed: 913600 + s }); offer(m, SP.candidates(m)[0].id, { years: 1 }); e = SP.state(m).deals[0]; }
  m.age++; HOOK(m, () => .9, () => {}); ok(e.status === 'ended' && e.endWhy === 'hết hạn', 'ends at term');
  let n, f;
  for (let s = 0; s < 80 && !f; s++) { n = donor({ seed: 913800 + s }); offer(n, SP.candidates(n)[0].id, { years: 3 }); f = SP.state(n).deals[0]; }
  f.person.alive = false; n.age++; const money = n.money; HOOK(n, () => .9, () => {}); ok(f.status === 'ended' && n.money === money, 'recipient death ends deal, no payment');
  let k, g;
  for (let s = 0; s < 80 && !g; s++) { k = donor({ seed: 914000 + s }); offer(k, SP.candidates(k)[0].id, { years: 3 }); g = SP.state(k).deals[0]; }
  open(k, 'sponsorManage912', {}); press(k, 'end:' + g.id); ok(g.status === 'ended' && g.endWhy === 'bạn dừng', 'player can end');
  k.age++; const mk = k.money; HOOK(k, () => .9, () => {}); ok(k.money === mk, 'no payment after end');
}
// 6. Tình cảm tự nguyện: cùng danh tính trở thành người yêu, không trả hai lần; người có ranh giới "không gắn tình cảm" không bao giờ được hỏi.
{
  let found = false;
  for (let s = 0; s < 400 && !found; s++) {
    const l = donor({ seed: 914200 + s }); const p = SP.candidates(l).find(x => x.openness >= 0.5 && x.bound !== 'noRomance' && x.bound !== 'private'); if (!p) continue;
    offer(l, p.id, { meet: 'weekly', years: 3 }); const d = SP.state(l).deals[0]; if (!d) continue;
    d.person.trust = 70; l.age++; const hook = HOOK; hook(l, () => .9, () => {});
    const q = l.pending.find(x => x.id === 'sponsorRomance912'); if (!q) continue;
    l.pending = [q]; const before = l.money; E.resolve(l, 'yes');
    ok(l.partner && l.partner.name === p.name && l.partner.sponsor912 === p.id && d.status === 'active' && d.partner, 'same person becomes partner, deal kept');
    ok(l.money === before, 'no extra payment on becoming partners');
    found = true;
  }
  ok(found, 'romance path reachable');
  const l = donor({ seed: 915000 }); const p = SP.candidates(l)[0]; p.bound = 'noRomance'; p.openness = 1;
  SP.state(l).deals.push({ id: 'x', person: p, monthly: 1, years: 3, since: l.age - 2, until: l.age + 3, purpose: 'học tập', meet: 'weekly', exclusive: false, status: 'active', paidAt: null, missed: 0, paid: 0 }); p.trust = 99;
  HOOK(l, () => .9, () => {}); ok(!l.pending.some(x => x.id === 'sponsorRomance912'), 'noRomance boundary respected');
}
// 7. Người yêu hiện tại có thể biết chuyện gặp gỡ thường xuyên; giới hạn 3 thỏa thuận cùng lúc; bản lưu cũ không có trạng thái vẫn mở được.
{
  const mate = { name: 'Bạn Đời', sex: 'F', age: 35, status: 'married', since: 28, alive: true, close: 80 };
  let hits = 0;
  for (let s = 0; s < 60; s++) { const l = donor({ seed: 915100 + s, partner: Object.assign({}, mate) }); const p = SP.candidates(l)[0];
    SP.state(l).deals.push({ id: 'y' + s, person: p, monthly: 0.1, years: 3, since: l.age, until: l.age + 3, purpose: 'học tập', meet: 'weekly', exclusive: true, status: 'active', paidAt: null, missed: 0, paid: 0 }); p.bound = 'open';
    l.age++; HOOK(l, U(s), () => {}); if (l.partner.close < 80) hits++; }
  ok(hits > 3 && hits < 40, 'partner discovers some weekly arrangements (' + hits + '/60)');
  const l = donor({ seed: 915300 }); for (let i = 0; i < 3; i++) SP.state(l).deals.push({ id: 'z' + i, person: { id: 'q' + i, name: 'Q' + i }, monthly: 0.1, status: 'active' });
  ok(SP.reason(l) !== true && !E.act(l, 'sponsor912'), 'max three active arrangements (handler)');
  const o = donor({ seed: 915301 }); delete o.flags.sponsor912; const r = reload(o); ok(!r.flags.sponsor912 && E.actions(r).find(x => x.id === 'sponsor912'), 'old save opens without new state');
}
function U(s) { let x = (s + 1) * 2654435761 >>> 0; return () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
console.log('Chủ động chu cấp: ' + count + ' checks passed.');
