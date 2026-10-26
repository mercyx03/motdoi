/* v4.5.9 — ai thanh toán chi phí tuổi thơ phải rõ trong nhật ký. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H;
  function payer(l) { var f = l.fam || {}, m = f.mAlive, d = f.fAlive && !f.noDad; if (m || d) return m && d ? 'Bố mẹ' : m ? 'Mẹ' : 'Bố'; var c = E.orphanCarer && E.orphanCarer(l); return c ? c.charAt(0).toUpperCase() + c.slice(1) : null; } // v7.1: trẻ mồ côi — người nuôi dưỡng trả
  E.childExpense = function (l, amount, reason, forced) {
    if (!(amount > 0) || !isFinite(amount)) return { ok: false, note: 'Khoản chi không hợp lệ.' };
    var who = payer(l), dependent = l.age < 18 && !l.indep;
    if (dependent && who) {
      var f = l.fam, yr = l.yr || (l.yr = { items: [] }), entries = yr.familyExpenses || (yr.familyExpenses = []);
      var income = (f.mAlive ? f.mInc || 0 : 0) + (f.fAlive && !f.noDad ? f.fInc || 0 : 0);
      var spent = entries.reduce(function (sum, x) { return sum + x.amount; }, 0), budget = income > 0 ? income * 12 * .1 : l.base * .02;
      if (!forced && amount + spent > budget) return { ok: false, note: who + ' chưa đủ ngân sách cho khoản này, chọn cách ít tốn kém hơn.' };
      entries.push({ t: reason, amount: amount, payer: who });
      return { ok: true, note: who + ' thanh toán ' + H.money(l, amount) + (reason ? ' cho ' + String(reason).toLowerCase() : '') + ' từ tiền gia đình; không trừ tiền tiết kiệm của bạn.' }; // GĐ2.5: nói rõ khoản chi
    }
    if (l.money < amount) return { ok: false, note: 'Bạn chưa đủ tiền tiết kiệm cho khoản này, cần chọn phương án ít tốn kém hơn.' };
    H.cash(l, -amount, reason);
    return { ok: true, note: 'Bạn thanh toán bằng tiền tiết kiệm của mình.' };
  };
  var birthday = E.DEC.sinh_nhat.def, party = birthday.opts.filter(function (o) { return o.k === 'party'; })[0];
  party.h = function (l) { return (l.age < 18 && !l.indep && payer(l) ? payer(l) + ' dự kiến trả ' : 'Bạn tự trả ') + H.money(l, l.base * (l.fam.q >= 4 ? .03 : .005)); };
  party.run = function (l, r, log) {
    var rich = l.fam.q >= 4, pay = E.childExpense(l, l.base * (rich ? .03 : .005), 'Tiệc sinh nhật');
    if (!pay.ok) { log(pay.note + ' Chưa tổ chức tiệc.', 'neutral'); return; }
    H.fx(l, { hap: 5, soc: 3 });
    log((rich ? 'Tiệc sinh nhật ở nhà hàng, có cả ảo thuật gia. Cả lớp trầm trồ. ' : 'Mấy đứa bạn đến nhà, cùng thổi nến, ăn bánh kem. ') + pay.note, 'good');
    if (r() < .25) H.mem(l, 'Bữa tiệc sinh nhật ' + l.age + ' tuổi.', 2);
  };
  // Hai tình huống nói rõ tiền của bố mẹ nhưng trước đây vẫn trừ ví của con.
  var phone = E.DEC.dien_thoai_be.def.opts.filter(function (o) { return o.k === 'game'; })[0];
  phone.run = function (l, r, log) { if (r() < .25) { var pay = E.childExpense(l, l.base * .01, 'Lỡ nạp game trên điện thoại', true); log(pay.ok ? 'Bấm nhầm nạp tiền trong game trên điện thoại. ' + pay.note + ' Bị nhắc nhở và hạn chế dùng điện thoại.' : pay.note, 'bad'); H.fx(l, { hap: -4 }); } else { log('Chơi game cả buổi chiều, giấu điện thoại về chỗ cũ trót lọt.', 'neutral'); H.fx(l, { hap: 2 }); } };
  var glass = E.DEC.da_bong_vo_kinh.def.opts.filter(function (o) { return o.k === 'admit'; })[0];
  glass.run = function (l, r, log) { var pay = E.childExpense(l, l.base * .005, 'Đền cửa kính', true); H.fx(l, { karma: 4 }); log(pay.ok ? 'Sang nhận lỗi về cửa kính bị vỡ. ' + pay.note + ' Bác hàng xóm khen bạn thật thà.' : 'Sang nhận lỗi về cửa kính bị vỡ. ' + pay.note + ' Xin hẹn việc bồi thường.', 'good'); };
})(globalThis.G);
