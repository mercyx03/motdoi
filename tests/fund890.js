'use strict';
// 9.0: xin / mượn bố mẹ tiền du học và giải thích thiếu gì (fund890.js, abroad-depth.js, life107.js).
const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, F = E.FUND890;
const FIELD = E.DEC.abroad107_field.def.opts.find(o => o.k !== 'cancel').k;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
function life(q, o) {
  const l = E.createLife({ mode: 'world', country: 'US', seed: 41, year: 2026 });
  Object.assign(l, { age: 18, edu: 3, school: null, job: null, money: l.base * .2, pending: [], alive: true, indep: true, loans: [], lang: { en: 3 } }, o || {});
  l.st.kno = 90;
  const inc = { 1: [600, 300], 2: [1800, 900], 3: [5000, 3000], 4: [11000, 6000], 5: [26000, 18000] }[q];
  Object.assign(l.fam, { q, mAlive: true, fAlive: true, noDad: false, mInc: inc[1], fInc: inc[0], sibs: 1 });
  return l;
}
const d0 = l => ({ at: l.age, lv: 5, country: 'GB', school: 0, field: FIELD, done: false });
const scene = l => E.DEC.abroad107_apply.make(l, () => .5, d0(l));
const opt = k => E.DEC.abroad107_apply.def.opts.find(o => o.k === k);
// thiếu tiền: cảnh nói rõ số tiền, hiện lựa chọn xin / mượn; tự túc ẩn cho tới khi đủ tiền
{
  const l = life(5), s = scene(l), keys = s.opts.map(o => o.k);
  ok(/Tiền của bạn hiện chưa đủ học phí tự túc/.test(s.text) && /thiếu /.test(s.text), 'cảnh nêu rõ thiếu bao nhiêu');
  ok(keys.includes('pgift') && keys.includes('ploan') && !keys.includes('self'), 'có xin/mượn bố mẹ, tự túc chưa hiện vì thiếu tiền');
  ok(F.tuitionShortfall(l, d0(l)) > 0, 'thiếu tiền được tính');
}
// đủ tiền: không hiện lựa chọn xin bố mẹ, có tự túc
{
  const l = life(5); l.money += F.tuitionShortfall(l, d0(l)) + l.base;
  const keys = scene(l).opts.map(o => o.k); ok(keys.includes('self') && !keys.includes('pgift'), 'đủ tiền thì không cần xin');
}
// khả năng của bố mẹ
{
  const caps = [1, 2, 3, 4, 5].map(q => F.capacity(life(q), 'gift')); ok(caps.every((c, i) => i === 0 || c > caps[i - 1]), 'khả năng tăng theo nhóm kinh tế');
  const a = life(4), b = life(4); b.fam.sibs = 4; ok(F.capacity(b, 'gift') < F.capacity(a, 'gift'), 'nhiều anh chị em thì mỗi người nhận ít hơn');
  ok(F.capacity(a, 'loan') > F.capacity(a, 'gift'), 'cho mượn nhiều hơn cho không');
  const orphan = life(5); orphan.fam.mAlive = false; orphan.fam.fAlive = false;
  ok(F.capacity(orphan, 'gift') === 0 && !scene(orphan).opts.some(o => o.k === 'pgift'), 'không còn bố mẹ: không có lựa chọn xin');
}
// xin tiền cho không (nhà giàu): nhận đủ rồi nộp hồ sơ tự túc luôn
{
  const l = life(5), logs = [], d = d0(l);
  opt('pgift').run(l, () => .01, t => logs.push(t), d);
  ok(l.loans.length === 0, 'quà không thành nợ'); ok(/hỗ trợ, không cần hoàn lại/.test(logs.join('|')), 'nhật ký nêu rõ không hoàn lại');
  ok(l.flags.studyVisa900 && l.flags.studyVisa900.country === 'GB', 'đủ tiền thì nộp hồ sơ và nhận thư nhận học ngay');
  ok(F.state(l).asks.length === 1 && F.state(l).asks[0].purpose === 'tuition', 'ghi lại lần xin');
}
// mượn: thành khoản vay người thân lãi 0
{
  const l = life(5), logs = []; opt('ploan').run(l, () => .01, t => logs.push(t), d0(l));
  const loan = l.loans.find(x => x.type === 'family'); ok(loan && loan.rate === 0 && loan.bal > 0, 'mượn tạo khoản vay người thân lãi 0%'); ok(/cho mượn/.test(logs.join('|')), 'nhật ký nêu rõ cho mượn');
}
// nhà ít khả năng: nhận một phần, vẫn thiếu, cảnh nộp hồ sơ mở lại để chọn tiếp
{
  const l = life(1), need0 = F.tuitionShortfall(l, d0(l)), logs = [];
  opt('pgift').run(l, () => .01, t => logs.push(t), d0(l));
  ok(!l.flags.studyVisa900, 'chưa đủ tiền thì chưa nộp được hồ sơ tự túc');
  ok(F.tuitionShortfall(l, d0(l)) > 0 && F.tuitionShortfall(l, d0(l)) < need0, 'nhận được một phần nhưng vẫn thiếu');
  ok(/Vẫn còn thiếu/.test(logs.join('|')), 'nhật ký nêu còn thiếu bao nhiêu'); ok(l.pending.some(p => p.id === 'abroad107_apply'), 'cảnh nộp hồ sơ mở lại để chọn tiếp');
}
// bị từ chối: kể cả nhà giàu vẫn có thể từ chối
{
  const l = life(5), m0 = l.money, logs = []; opt('pgift').run(l, () => .999, t => logs.push(t), d0(l));
  ok(l.money === m0 && /chưa đồng ý/.test(logs.join('|')), 'bị từ chối: không có tiền, có lời giải thích');
  const poor = life(1), logs2 = []; opt('pgift').run(poor, () => .999, t => logs2.push(t), d0(poor)); ok(/chưa đồng ý/.test(logs2.join('|')), 'nhà ít tiền cũng có thể từ chối');
}
// xác suất không phụ thuộc giàu nghèo
{
  const a = life(5), b = life(1); ok(F.chance(a, 'gift') === F.chance(b, 'gift'), 'xác suất đồng ý không đổi theo giàu nghèo');
  const smart = life(3); smart.st.kno = 90; const dull = life(3); dull.st.kno = 30; ok(F.chance(smart, 'gift') > F.chance(dull, 'gift'), 'học giỏi dễ được ủng hộ hơn');
  const x = life(3), c0 = F.chance(x, 'gift'); F.state(x).asks.push({ age: x.age }); ok(F.chance(x, 'gift') < c0, 'xin lại trong năm thì khó hơn'); ok(F.chance(x, 'loan') > F.chance(x, 'gift'), 'mượn dễ được đồng ý hơn');
}
// tối đa hai lần xin mỗi năm
{
  const l = life(5); F.state(l).asks.push({ age: l.age }, { age: l.age }); const logs = [];
  const r = F.ask(l, () => .01, t => logs.push(t), 1000, 'gift', 'x'); ok(r.given === 0 && r.why === 'limit', 'hết lượt xin trong năm');
  ok(!scene(l).opts.some(o => o.k === 'pgift'), 'cảnh ẩn lựa chọn khi hết lượt'); l.age++; ok(F.askedThisYear(l) === 0, 'sang năm có lượt mới');
}
// số tiền nhận không vượt khả năng
{ const l = life(1), cap = F.capacity(l, 'gift'), m0 = l.money; F.ask(l, () => .01, () => { }, cap * 50, 'gift', 'x'); ok(l.money - m0 <= cap + 1e-6, 'không nhận quá khả năng của bố mẹ'); }
// bước visa: liệt kê điều kiện và số tiền thiếu, có dòng xin/mượn bố mẹ
{
  const l = life(5, { money: 0 }); l.flags.studyVisa900 = { country: 'GB', lv: 5, school: 0, field: FIELD, scholar: false, until: l.age + 1, deposit: 0, unpaid919: l.base * 2 };
  const t = E.DEC.studyVisa900.def.text(l, {});
  ok(/Điều kiện xin visa:/.test(t) && /✗ Học phí còn lại: thiếu/.test(t) && /✗ Quỹ sinh hoạt: cần/.test(t), 'liệt kê thiếu học phí và quỹ kèm số tiền');
  ok(/✗ Giấy tờ 0\/3/.test(t) && /Ngoại ngữ cấp \d \(cần cấp 2\)/.test(t), 'liệt kê giấy tờ và ngoại ngữ');
  const s = E.DEC.studyVisa900.make(l, () => .5, {}), keys = s.data.keys; ok(keys.includes('pgift') && keys.includes('ploan'), 'menu visa có xin/mượn bố mẹ');
  const visaOpt = s.opts.find(o => o.k === String(keys.indexOf('visa'))); ok(!visaOpt, 'xin visa bị khóa khi còn thiếu');
  const logs = []; F.visaAsk(l, () => .01, x => logs.push(x), 'gift'); ok(l.money > 0 && l.pending.some(p => p.id === 'studyVisa900'), 'xin xong thì mở lại hồ sơ visa');
}
{
  const l = life(5, { money: 0 }); l.flags.studyVisa900 = { country: 'GB', lv: 5, school: 0, field: FIELD, scholar: false, until: l.age + 1, deposit: 0 }; l.money = l.base * 3;
  const t = E.DEC.studyVisa900.def.text(l, {}); ok(/✓ Quỹ sinh hoạt/.test(t) && !/xin hoặc mượn bố mẹ để đủ quỹ/.test(t), 'đủ quỹ thì không gợi ý xin bố mẹ');
}
// bản lưu
{ const l = life(5); F.ask(l, () => .01, () => { }, 1000, 'gift', 'x'); const o = JSON.parse(JSON.stringify(l)); ok(F.state(o).asks.length === 1, 'giữ qua bản lưu'); const old = life(5); delete old.flags.fund890; ok(F.askedThisYear(old) === 0, 'bản lưu cũ chạy bình thường'); }
// luồng gốc không đổi
{ const l = life(5); l.money = l.base * 40; const keys = scene(l).opts.map(o => o.k); ok(keys.includes('self') && keys.includes('scholar') && keys.includes('domestic') && keys.includes('cancel'), 'lựa chọn gốc còn nguyên'); }
// chạy nhiều đời
for (let s = 1; s <= 8; s++) { const l = E.createLife({ mode: 'world', country: s % 2 ? 'VN' : 'US', seed: 7800 + s, year: 2026 }); E.runHeadless(l); ok(isFinite(l.money), 'tiền hữu hạn'); }
console.log('PASS fund890: ' + n + ' checks');
