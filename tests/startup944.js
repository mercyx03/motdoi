'use strict';
// 9.4.5: khởi nghiệp theo vốn (startup944.js) + hiệu chỉnh kinh tế cơ sở kinh doanh (wealth.js) và lương ban điều hành theo quy mô công ty (life133.js).
const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, U = G.U, H = E.H, W = E.wealth, S = E.STARTUP944;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
const near = (a, b, e, m) => ok(Math.abs(a - b) <= (e || 1e-6), m + ' (' + a + ' vs ' + b + ')');
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
function life(seed, o) { o = o || {}; const l = E.createLife({ mode: 'vn', seed }); l.age = o.age || 30; l.indep = true; l.school = null; l.pending = []; l.sched = []; l.flags.military = null; l.job = o.job === undefined ? null : o.job; l.money = o.money == null ? l.base * 20 : o.money; l.loans = []; l.ventures = []; return l; }
const R = l => () => U.rand(l);
// mở cơ sở rồi cho chạy một năm; nếu cơ sở bị đóng ngẫu nhiên thì dựng lại ở trạng thái sau một năm để phép thử không phụ thuộc may rủi
function openRun(x, b, r) { S.open(x, b, r, () => { }, 'own', 0); x.age++; x.wealthPaidAge = null; W.investYear(x, r, () => { }, x.age); if (!x.ventures.length) { const c = S.cap(x, b); x.ventures.push({ k: b.k, n: b.n, cap: c, unit: c, br: 1, mu: b.mu, sd: b.sd, yrs: 1, bad: 0, good: 0, R: W.bizV(x, b.rev) * 12, q: 1, last: { rev: c, cost: c * 0.9, prof: c * 0.1 }, s944: { rep: 50, how: 'own', at: x.age - 1 } }); } return x.ventures[0]; }
// 1. Danh mục: đủ tầng vốn, số liệu hợp lệ, không làm dài menu đầu tư gốc
{
  ok(S && S.CAT.length >= 14, 'có ít nhất 14 mô hình khởi nghiệp (' + (S && S.CAT.length) + ')');
  ok(new Set(S.CAT.map(b => b.k)).size === S.CAT.length && S.CAT.every(b => /^s944_/.test(b.k)), 'mã mô hình duy nhất, có tiền tố');
  S.CAT.forEach(b => { ok(b.cap > 0 && b.rev > 0 && b.vc > 0 && b.vc < 1 && b.mg > 0 && b.vc + b.mg < 1 && b.sd > 0 && b.sd < 0.5 && b.hz > 0 && b.hz < 0.2 && b.ramp.length === 2 && b.ramp[0] < b.ramp[1] && b.ramp[1] <= 1 && isFinite(b.mu), 'số liệu hợp lệ: ' + b.k); ok(S.TIERS[b.tier], 'có tầng vốn: ' + b.k); });
  const caps = t => S.CAT.filter(b => b.tier === t).map(b => b.cap);
  ok(caps('micro').length >= 4 && Math.max(...caps('micro')) <= 100, 'tầng vốn nhỏ có ít nhất 4 mô hình, vốn tối đa 100 triệu');
  ok(caps('small').length >= 4 && Math.min(...caps('small')) > 100 && Math.max(...caps('small')) <= 600, 'tầng vốn vừa 100–600 triệu');
  ok(caps('mid').length >= 2 && Math.min(...caps('mid')) > 600, 'tầng vốn lớn trên 600 triệu');
  ['vien_chien', 'quan_ao_cho', 'quan_ao_shop', 'tra_sua', 'tap_hoa', 'shop_online', 'nhuong_quyen'].forEach(k => ok(S.byKey('s944_' + k), 'có mô hình ' + k));
  ok(/cá viên chiên/.test(S.byKey('s944_vien_chien').n) && /quần áo/.test(S.byKey('s944_quan_ao_shop').n), 'có cá viên chiên và quần áo');
  const dau = E.DEC.dau_tu_lon && E.DEC.dau_tu_lon.def.opts.filter(o => /^b_/.test(o.k)); ok(dau && dau.length === 8, 'menu đầu tư gốc vẫn 8 loại hình, không bị dài thêm (' + (dau && dau.length) + ')');
}
// 2. Phân tích kế hoạch: năm 1 lỗ nhẹ, ổn định có lãi, hoàn vốn hữu hạn; việc cần chủ làm cả ngày thì còn đi làm sẽ kém hơn
{
  const l = life(944);
  S.CAT.forEach(b => { const e = S.econ(l, b, false); ok(isFinite(e.y1) && isFinite(e.y2) && isFinite(e.steady) && e.steady > 0, 'lãi ổn định dương: ' + b.k); ok(e.y1 < e.steady && e.y2 < e.steady + 1e-9 && e.y2 >= e.y1, 'đường cong năm 1 → năm 2 → ổn định: ' + b.k); ok(e.payback == null || (e.payback > 0 && e.payback < 15), 'hoàn vốn hợp lý: ' + b.k); ok(e.breakEven > 0.3 && e.breakEven < 1.05, 'điểm hòa vốn từ 30% đến 105% lượng khách: ' + b.k + ' ' + e.breakEven.toFixed(2)); });
  const b = S.byKey('s944_vien_chien'), free = S.econ(l, b, false), busy = S.econ(l, b, true);
  ok(busy.steady < free.steady, 'chủ còn đi làm: việc cần đứng quầy cả ngày chỉ bán được một phần (' + busy.steady.toFixed(1) + ' < ' + free.steady.toFixed(1) + ')');
  ok(S.reserve(l, b) >= l.base * 0.08, 'quỹ dự phòng tối thiểu theo mức sống');
}
// 3. Chọn mô hình theo vốn: thiếu vốn thì khóa, đủ thì mở; vốn nhỏ chỉ mở được mô hình nhỏ
{
  const poor = life(945, { money: 30 }), rich = life(946, { money: 3000 });
  const rows = l => S.rowsStart(l).filter(r => r.k.indexOf('s944_') === 0);
  const rp = rows(poor), rr = rows(rich);
  ok(rp.some(r => r.why === true) && rp.some(r => r.why !== true), 'vốn nhỏ: một số mô hình mở được, một số còn khóa');
  ok(rp.filter(r => r.why === true).every(r => S.byKey(r.k).cap <= 40 || S.byKey(r.k).cap + S.reserve(poor, S.byKey(r.k)) <= poor.money + Math.max(S.byKey(r.k).cap * 0.6, 0)), 'vốn nhỏ không mở được mô hình vượt khả năng huy động');
  ok(rr.filter(r => r.why === true).length > rp.filter(r => r.why === true).length, 'nhiều vốn hơn thì mở được nhiều mô hình hơn');
  ok(rp.every(r => /Vốn (nhỏ|vừa|lớn)/.test(r.l) && /hoàn vốn|khó hoàn vốn/.test(r.h) && !/undefined|NaN/.test(r.l + r.h)), 'nhãn và gợi ý sạch, có phân tích hoàn vốn');
  ok(rr.length === S.CAT.length, 'đủ mô hình trong menu');
  const all = S.rowsStart(rich); ok(all.some(r => r.k === 'angel') && all.every(r => !/undefined|NaN/.test(r.l + (r.h || ''))), 'có lối góp vốn startup, văn bản sạch');
}
// 4. Huy động vốn: tiền tự có, vay người thân, vay ngân hàng; số tiền hạch toán đúng; thiếu tiền thì không mở
{
  const b = S.byKey('s944_quan_ao_shop');
  // tự có
  { const l = life(947, { money: 600 }), m0 = l.money, rows = S.fundRows(l, { k: b.k }); ok(rows.map(r => r.k).join() === 'own,family,bank,prep', 'bốn lựa chọn huy động vốn'); const own = rows.find(r => r.k === 'own'); ok(own.why === true, 'đủ tiền tự có');
    own.run(l, R(l), say(l)); const v = l.ventures[0]; ok(v && v.k === b.k && v.s944 && v.s944.how === 'own' && v.yrs === 0 && v.q >= 0.5 && v.q <= 1.45, 'khai trương bằng tiền tự có'); near(l.money, m0 - S.cap(l, b), 1e-6, 'trừ đúng vốn'); ok((l.loans || []).length === 0, 'không phát sinh nợ'); }
  // thiếu tiền → khóa
  { const l = life(948, { money: 100 }); const own = S.fundRows(l, { k: b.k }).find(r => r.k === 'own'); ok(own.why !== true && /Cần/.test(own.why), 'thiếu tiền tự có thì khóa: ' + own.why); }
  // vay người thân
  { const l = life(949, { money: 185 }); l.fam.mAlive = true; l.fam.q = 4; const rows = S.fundRows(l, { k: b.k }), fam = rows.find(r => r.k === 'family'); ok(fam.why === true, 'vay người thân bù được phần thiếu: ' + fam.why); const m0 = l.money; fam.run(l, R(l), say(l)); const v = l.ventures[0]; ok(v && v.s944.how === 'family' && l.loans.length === 1 && l.loans[0].type === 'family' && l.loans[0].rate === 0 && l.loans[0].bal > 0, 'có khoản vay người thân không lãi');
    near(l.money, m0 + l.loans[0].bal - S.cap(l, b), 1e-6, 'tiền: + khoản vay − vốn'); ok(v.s944.loan === l.loans[0].bal, 'ghi nhớ số tiền vay'); }
  // vay ngân hàng
  { const l = life(950, { money: 165 }); const bank = S.fundRows(l, { k: b.k }).find(r => r.k === 'bank'); ok(bank.why === true, 'đủ điều kiện vay ngân hàng: ' + bank.why); bank.run(l, R(l), say(l)); ok(l.loans.length === 1 && l.loans[0].type === 'bank' && l.loans[0].rate > 0, 'vay ngân hàng có lãi'); ok(l.ventures.length === 1, 'đã khai trương'); }
  // không vay được khi có nợ xấu
  { const l = life(951, { money: 165 }); l.credit = { bad: true, since: l.age - 1, last: l.age - 1 }; const bank = S.fundRows(l, { k: b.k }).find(r => r.k === 'bank'); ok(bank.why !== true && /điều kiện/.test(bank.why), 'nợ xấu gần đây thì không vay được'); }
  // chuẩn bị thêm: ghi nhớ, cải thiện tay nghề khi khai trương
  { const l = life(952, { money: 800 }); const prep = S.fundRows(l, { k: b.k }).find(r => r.k === 'prep'); const m0 = l.money; prep.run(l, R(l), say(l)); ok(l.money === m0 && l.flags.startup944.prep.k === b.k, 'chuẩn bị không tốn tiền, ghi nhớ kế hoạch');
    let a = 0, c = 0; for (let i = 0; i < 80; i++) { const x = life(9520 + i, { money: 800 }); x.flags.startup944 = { prep: { k: b.k, at: x.age } }; S.open(x, b, R(x), say(x), 'own', 0); a += x.ventures[0].q; const y = life(9520 + i, { money: 800 }); S.open(y, b, R(y), say(y), 'own', 0); c += y.ventures[0].q; }
    ok(a / 80 > c / 80, 'năm chuẩn bị làm chủ vững tay hơn (' + (a / 80).toFixed(3) + ' > ' + (c / 80).toFixed(3) + ')'); }
  // không mở trùng, không quá 3 cơ sở
  { const l = life(953, { money: 5000 }); S.open(l, b, R(l), say(l), 'own', 0); const dup = S.rowsStart(l).find(r => r.k === b.k); ok(dup.why !== true && /đã có/.test(dup.why), 'không mở trùng cùng loại'); ['s944_tap_hoa', 's944_giat_ui', 's944_nail'].forEach(k => S.open(l, S.byKey(k), R(l), say(l), 'own', 0)); ok(S.mine(l).length === 3, 'tối đa 3 cơ sở'); const r4 = S.rowsStart(l).find(r => r.k === 's944_tiem_banh'); ok(r4.why !== true, 'cơ sở thứ tư bị khóa'); }
  // kinh nghiệm làm việc giúp ích
  { let a = 0, c = 0; const food = S.byKey('s944_quan_com'); for (let i = 0; i < 100; i++) { const x = life(9600 + i, { money: 2000 }); x.lastJob = { id: 'dau_bep' }; a += S.qOf(x, food, R(x), false); const y = life(9600 + i, { money: 2000 }); c += S.qOf(y, food, R(y), false); } ok(a / 100 > c / 100 + 0.05, 'từng làm bếp thì mở quán ăn vững hơn (' + (a / 100).toFixed(3) + ' > ' + (c / 100).toFixed(3) + ')'); }
}
// 5. Kinh tế mô phỏng: năm 1 thường lỗ nhẹ, năm 2 khá hơn, sống sót 5 năm khoảng 55–85%, lãi trung bình không phi thực tế
{
  function sim(key, N, jobbed) {
    const b = S.byKey(key), out = { loss1: 0, n1: 0, roi1: 0, roi2: 0, n2: 0, surv5: 0, roiAll: 0, nAll: 0 };
    for (let i = 0; i < N; i++) {
      const l = life(20000 + i, { money: 1e9, job: jobbed ? { id: 'ke_toan', rank: 0, yrs: 3 } : null }); const r = R(l); S.open(l, b, r, () => { }, 'own', 0); const c = Math.max(S.cap(l, b), l.base); // vốn rất nhỏ: so lãi với mức thu nhập cơ sở, vì phần lớn là công của chủ
      for (let y = 1; y <= 5; y++) { l.age = 30 + y; l.wealthPaidAge = null; W.investYear(l, r, () => { }, l.age); const v = l.ventures[0]; if (!v) break; if (y === 1) { out.n1++; if (v.last.prof < 0) out.loss1++; out.roi1 += v.last.prof / c; } if (y === 2) { out.n2++; out.roi2 += v.last.prof / c; } out.roiAll += v.last.prof / c; out.nAll++; if (y === 5) out.surv5++; }
    }
    out.surv5 /= N; out.roi1 /= out.n1; out.roi2 /= out.n2; out.roiAll /= out.nAll; out.loss1 /= out.n1; return out;
  }
  ['s944_vien_chien', 's944_quan_ao_shop', 's944_tra_sua', 's944_nhuong_quyen', 's944_tap_hoa'].forEach(k => { const s = sim(k, 120, false);
    ok(s.loss1 >= 0.05 && s.loss1 <= 0.9, k + ': năm 1 thua lỗ ở ' + Math.round(s.loss1 * 100) + '% số cơ sở'); ok(s.roi1 < s.roi2 && s.roi1 < s.roiAll, k + ': năm 1 (' + s.roi1.toFixed(2) + ') kém năm 2 (' + s.roi2.toFixed(2) + ') và kém mức chung (' + s.roiAll.toFixed(2) + ')'); ok(s.surv5 >= 0.38 && s.surv5 <= 0.92, k + ': sống sót 5 năm ' + Math.round(s.surv5 * 100) + '%'); ok(s.roiAll > -0.05 && s.roiAll < 1.1, k + ': lãi trung bình ' + Math.round(s.roiAll * 100) + '%/năm trên vốn (đã gồm công của chủ)'); });
  const a = sim('s944_vien_chien', 120, false), b = sim('s944_vien_chien', 120, true); ok(b.roiAll < a.roiAll, 'chủ còn đi làm: lãi kém hơn chủ chuyên tâm (' + b.roiAll.toFixed(2) + ' < ' + a.roiAll.toFixed(2) + ')');
  // các loại hình gốc cũng không còn lỗ nặng năm đầu và không còn sống sót 94%+
  ['cafe', 'rest', 'spa', 'gym'].forEach(k => { const bb = W.BIZ.find(x => x.k === k); let l1 = 0, nn = 0, roi1 = 0, surv = 0; const N = 100; for (let i = 0; i < N; i++) { const l = life(30000 + i, { money: 1e9 }), r = R(l), c = W.bizV(l, bb.cap); l.ventures = [{ k, n: bb.n, cap: c, unit: c, br: 1, mu: bb.mu, sd: bb.sd, yrs: 0, bad: 0, good: 0, R: W.bizV(l, bb.rev) * 12, q: Math.exp(U.normal(r) * 0.22) }]; for (let y = 1; y <= 5; y++) { l.age = 30 + y; l.wealthPaidAge = null; W.investYear(l, r, () => { }, l.age); const v = l.ventures[0]; if (!v) break; if (y === 1) { nn++; roi1 += v.last.prof / c; if (v.last.prof < 0) l1++; } if (y === 5) surv++; } }
    ok(roi1 / nn > -0.2 && l1 / nn < 0.8, 'loại hình gốc ' + k + ': năm 1 lỗ trung bình ' + (roi1 / nn * 100).toFixed(0) + '% vốn, ' + Math.round(l1 / nn * 100) + '% cơ sở lỗ'); ok(surv / N >= 0.45 && surv / N <= 0.9, 'loại hình gốc ' + k + ': sống sót 5 năm ' + surv + '%'); });
}
// 6. Đánh giá cuối năm và sự kiện: mỗi lựa chọn có hậu quả thật, văn bản sạch
{
  const b = S.byKey('s944_quan_com'); let l, r, v; for (let sd = 960; sd < 1000; sd++) { l = life(sd, { money: 3000 }); r = R(l); S.open(l, b, r, say(l), 'own', 0); v = S.mine(l)[0]; l.age++; l.wealthPaidAge = null; W.investYear(l, r, () => { }, l.age); if (l.ventures.length) break; }
  const rows = S.reviewRows(l, { k: v.k }); ok(rows.map(x => x.k).join() === 'keep,promote,cut,pivot,sell', 'đánh giá có năm hướng: ' + rows.map(x => x.k)); ok(rows.every(x => !/undefined|NaN/.test(x.l + x.h)), 'nhãn sạch');
  const q0 = v.q, m0 = l.money; rows.find(x => x.k === 'promote').run(l, r, say(l)); ok(l.money < m0 && v.q > q0, 'quảng bá tốn tiền và tăng chất lượng');
  const m1 = l.money; rows.find(x => x.k === 'pivot').run(l, r, say(l)); ok(l.money < m1, 'đổi mặt hàng tốn tiền');
  const mm = l.money; rows.find(x => x.k === 'sell').run(l, r, say(l)); ok(!l.ventures.length && l.money > mm && l.money - mm <= v.cap * 0.5 + 1e-9 && l.money - mm >= v.cap * 0.2 - 1e-9, 'sang nhượng thu về 20–50% vốn');
  // chủ còn đi làm có thêm lựa chọn thuê người
  const j = life(961, { money: 3000, job: { id: 'ke_toan', rank: 0, yrs: 2 } }), bj = S.byKey('s944_vien_chien'), rj = R(j); S.open(j, bj, rj, say(j), 'own', 0); j.age++; j.wealthPaidAge = null; W.investYear(j, rj, () => { }, j.age); if (!j.ventures.length) { j.ventures.push({ k: bj.k, n: bj.n, cap: 22, unit: 22, br: 1, mu: bj.mu, sd: bj.sd, yrs: 1, bad: 0, good: 0, R: 252, q: 1, last: { rev: 100, cost: 90, prof: 10 }, s944: { rep: 50 } }); } const jr = S.reviewRows(j, { k: bj.k }); ok(jr.some(x => x.k === 'hire'), 'chủ còn đi làm được đề nghị thuê người đứng quầy');
  const vj = S.mine(j)[0]; jr.find(x => x.k === 'hire').run(j, rj, say(j)); ok(vj.hired944, 'thuê người: đánh dấu'); let a = 0, c = 0; for (let i = 0; i < 40; i++) { const x = life(9700 + i, { money: 1e9, job: { id: 'ke_toan', rank: 0, yrs: 2 } }), y = life(9700 + i, { money: 1e9, job: { id: 'ke_toan', rank: 0, yrs: 2 } }); S.open(x, bj, R(x), () => { }, 'own', 0); S.open(y, bj, R(y), () => { }, 'own', 0); S.mine(y)[0].hired944 = true; [x, y].forEach(z => { z.age++; z.wealthPaidAge = null; W.investYear(z, R(z), () => { }, z.age); }); if (!S.mine(x)[0] || !S.mine(y)[0]) continue; a += S.mine(x)[0].last.rev; c += S.mine(y)[0].last.rev; } ok(c > a, 'có người đứng quầy thì doanh thu cao hơn chủ đi làm bỏ ngỏ (' + c.toFixed(0) + ' > ' + a.toFixed(0) + ')');
  // sự kiện: mọi loại sự kiện cho từng họ ngành có lựa chọn hợp lệ, chạy được
  let tested = 0; Object.keys(S.EVENTS).forEach(id => { S.CAT.filter(bb => S.EVENTS[id].fam.indexOf(bb.fam) >= 0 && (!S.EVENTS[id].street || bb.street) && (!S.EVENTS[id].labor || bb.labor === 'full')).forEach(bb => { const x = life(970 + tested, { money: 5000 }), rx = R(x); const vv = openRun(x, bb, rx); const opts = S.EVENTS[id].o(vv, x); ok(opts.length >= 2 && opts.every(o => o.k && o.l && o.h && !/undefined|NaN/.test(o.l + o.h)), 'sự kiện ' + id + ' / ' + bb.k + ': có ít nhất 2 lựa chọn sạch');
    opts.forEach(o => { const y = life(980 + tested, { money: 5000 }), ry = R(y); const w = openRun(y, bb, ry); const o2 = S.EVENTS[id].o(w, y).find(z => z.k === o.k); const m = y.money; o2.run(y, ry, say(y)); ok(isFinite(y.money) && y.ventures.every(q => isFinite(q.q) && q.q > 0), 'chạy được: ' + id + '/' + o.k + ' (' + bb.k + ')'); }); tested++; }); });
  ok(tested >= 20, 'đã thử ' + tested + ' tổ hợp sự kiện × mô hình');
  // sự kiện chọn đúng loại: vỉa hè chỉ cho quầy ngoài đường
  const stall = S.byKey('s944_vien_chien'), shop = S.byKey('s944_quan_ao_shop'); let seenStall = false, seenShop = false; for (let i = 0; i < 300; i++) { const xs = life(5000 + i); xs.ventures = [{ k: stall.k, n: stall.n, yrs: 2, s944: {} }]; if (S.pickEvent(xs, xs.ventures[0], R(xs)) === 'sidewalk') seenStall = true; const xh = life(6000 + i); xh.ventures = [{ k: shop.k, n: shop.n, yrs: 2, s944: {} }]; if (S.pickEvent(xh, xh.ventures[0], R(xh)) === 'sidewalk') seenShop = true; } ok(seenStall && !seenShop, 'giải tỏa vỉa hè chỉ gặp ở quầy ngoài đường');
}
// 7. Vòng đời trong cả đời chơi: hook hằng năm đưa ra đánh giá và sự kiện, nợ vay mở cơ sở vẫn là nợ cá nhân khi đóng cửa
{
  const l = life(990, { money: 5000 }), b = S.byKey('s944_quan_com'), r = R(l); S.open(l, b, r, say(l), 'bank', 0); S.open(l, S.byKey('s944_tap_hoa'), r, say(l), 'own', 0);
  let reviews = 0, events = 0; const ids = new Set(); for (let y = 0; y < 14; y++) { l.age++; l.wealthPaidAge = null; W.investYear(l, r, () => { }, l.age); E.HOOKS.year.forEach(h => { try { h(l, r, say(l), l.age); } catch (e) { throw e; } }); (l.pending || []).forEach(d => { if (d.id === 'startupReview944') reviews++; if (d.id === 'startupEvent944') { events++; ids.add(d.data.arg.kind); } }); l.pending = []; }
  ok(reviews >= 1, 'năm 1–2 có cảnh đánh giá (' + reviews + ')'); ok(events >= 1, 'có sự kiện kinh doanh trong 14 năm (' + events + ')');
  // nợ vay còn lại sau khi đóng cửa
  const x = life(991, { money: 185 }); x.fam.mAlive = true; x.fam.q = 4; const bb = S.byKey('s944_quan_ao_shop'); S.fundRows(x, { k: bb.k }).find(q => q.k === 'family').run(x, R(x), say(x)); const bal = x.loans[0].bal; S.liquidate(x, S.mine(x)[0], .3, say(x), 'Sang nhượng'); ok(x.ventures.length === 0 && x.loans.length === 1 && x.loans[0].bal === bal, 'đóng cửa nhưng khoản vay vẫn là nợ cá nhân');
}
// 8. Góp vốn startup
{
  const l = life(995, { money: 2000 }); const rows = S.angelRows(l); ok(rows.length >= 4 && rows.every(x => !/undefined|NaN/.test(x.l + x.h)), 'có các mức góp vốn, văn bản sạch (' + rows.length + ')');
  const dd = rows.find(x => /d$/.test(x.k)), nd = rows.find(x => /n$/.test(x.k)); ok(dd && nd && /thẩm định kỹ/.test(dd.l), 'có tùy chọn thẩm định kỹ');
  const m0 = l.money; nd.run(l, R(l), say(l)); ok(l.money < m0 && l.flags.startup944.angel.length === 1, 'góp vốn trừ tiền và ghi nhớ khoản');
  // phân bố kết quả: thất bại nhiều nhất, kỳ vọng quanh 1x
  function dist(withDD) { let fail = 0, big = 0, sum = 0; const N = 2000; for (let i = 0; i < N; i++) { const x = life(7000 + i, { money: 0 }); x.flags.startup944 = { angel: [{ amt: 100, at: 30, exit: 33, dd: withDD, done: false }] }; x.age = 33; const m = x.money; S.angelYear(x, R(x), () => { }); const got = x.money - m; sum += got; if (got === 0) fail++; if (got >= 800) big++; } return { fail: fail / N, big: big / N, ev: sum / N / 100 }; }
  const a = dist(false), b = dist(true); ok(a.fail > 0.5 && a.fail < 0.75, 'không thẩm định: khoảng 62% mất trắng (' + a.fail.toFixed(2) + ')'); ok(b.fail < a.fail - 0.07, 'thẩm định kỹ giảm khả năng mất trắng (' + b.fail.toFixed(2) + ')'); ok(a.big > 0.01 && a.big < 0.06, 'vài phần trăm sinh lời gấp nhiều lần (' + a.big.toFixed(3) + ')'); ok(a.ev > 0.4 && a.ev < 1.6 && b.ev > a.ev, 'kỳ vọng lợi nhuận hợp lý, có thẩm định thì cao hơn (' + a.ev.toFixed(2) + ' / ' + b.ev.toFixed(2) + ')');
  // chưa đến hạn thì chưa có kết quả
  const y = life(996, { money: 0 }); y.flags.startup944 = { angel: [{ amt: 100, at: 30, exit: 36, dd: false, done: false }] }; y.age = 33; S.angelYear(y, R(y), () => { }); ok(!y.flags.startup944.angel[0].done && y.money === 0, 'chưa đến hạn: chưa có kết quả');
}
// 9. Lương ban điều hành theo quy mô công ty (life133)
{
  const l = life(997, { money: 1e5 }); const B = E.BUSINESS133;
  const small = { name: 'Nhỏ', value: 200, share: 100, sector: 'general' }, big = { name: 'Lớn', value: l.base * 40, share: 100, sector: 'general' }, mid = { name: 'Vừa', value: l.base * 12, share: 100, sector: 'general' };
  const ratio = c => B.pay(l, c, 'pro') / (l.base * 1.6 + c.value * 0.002);
  ok(ratio(small) < 0.3, 'công ty nhỏ trả lương ban điều hành thấp hơn nhiều (' + ratio(small).toFixed(2) + ')'); near(ratio(big), 1, 1e-9, 'công ty lớn trả theo mức đầy đủ'); near(ratio(mid), 1, 1e-9, 'công ty từ 12 lần mức sống trả đầy đủ');
  ok(B.pay(l, small, 'pro') > B.pay(l, small, 'internal') && B.pay(l, small, 'internal') > B.pay(l, small, 'relative') && B.pay(l, small, 'self') === 0, 'thứ tự lương: chuyên gia > nội bộ > người thân > tự làm');
  // mô phỏng: công ty nhỏ có giám đốc người thân không còn lỗ nặng mỗi năm
  let loss = 0, tot = 0, prof = 0; for (let i = 0; i < 40; i++) { const x = life(8000 + i, { money: 1e5 }), r = R(x); const c = { name: 'Cty', value: 200, share: 100, created: 30, governance: 0, sector: 'general', roles: { ceo: { kind: 'relative', skill: 0.6, name: 'a' } } }; E.BUSINESS123.companies(x).push(c); for (let y = 1; y <= 5; y++) { x.age = 30 + y; if (c.merged) break; E.companyYear133(x, r, () => { }); if (c.lastAt === x.age) { tot++; if (c.lastProfit < 0) loss++; prof += c.lastProfit / 200; } } }
  ok(loss / tot < 0.5 && prof / tot > -0.1, 'công ty nhỏ có giám đốc người thân: không lỗ nặng liên tục (' + Math.round(loss / tot * 100) + '% năm lỗ, ' + (prof / tot * 100).toFixed(1) + '% vốn)');
}
// 10. Bản lưu cũ và toàn bộ vòng đời: cơ sở cũ không có trường mới vẫn chạy; chạy tự động nhiều đời không lỗi
{
  const l = life(998, { money: 1e6 }), r = R(l); const old = W.BIZ.find(b => b.k === 'cafe'), c = W.bizV(l, old.cap); l.ventures = [{ k: 'cafe', n: old.n, cap: c, unit: c, br: 1, mu: old.mu, sd: old.sd, yrs: 0, bad: 0, good: 0, R: W.bizV(l, old.rev) * 12, q: 1 }];
  for (let y = 1; y <= 6; y++) { l.age = 30 + y; l.wealthPaidAge = null; W.investYear(l, r, () => { }, l.age); E.HOOKS.year.forEach(h => { try { h(l, r, say(l), l.age); } catch (e) { throw e; } }); l.pending = []; } ok(l.ventures.every(v => isFinite(v.cap) && isFinite(v.q)), 'cơ sở cũ không có trường mới vẫn hạch toán đúng');
  let opened = 0, crashes = 0; for (let i = 0; i < 60; i++) { const x = E.createLife({ mode: i % 2 ? 'world' : 'vn', seed: 40000 + i }); x.money = x.base * 30; try { E.runHeadless(x); opened += (x.flags.startup944 && x.flags.startup944.opened) || 0; } catch (e) { crashes++; console.log(e.stack.split('\n').slice(0, 3).join(' | ')); } }
  ok(crashes === 0, 'chạy tự động 60 đời có vốn lớn không lỗi'); console.log('   Số cơ sở khởi nghiệp mở trong 60 đời tự động có vốn: ' + opened);
}
console.log('PASS startup944: ' + n + ' checks');
