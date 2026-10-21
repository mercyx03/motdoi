/* v7.6.0 — Hardcore: kinh tế khắc nghiệt và biến cố có lựa chọn, RNG theo seed. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, ids = [];
  function hard(l) { return l.difficulty === 'hardcore'; }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.flags.military && l.age < l.flags.military) && !(l.abroad && l.abroad.trapped); }
  function adult(l) { return hard(l) && free(l) && l.indep && l.age >= 18; }
  function cost(l, r) { return l.base * (0.08 + r() * 0.17); }
  function pay(l, amount, why, log) { H.cash(l, -amount, why); log(why + ': ' + H.money(l, amount) + '.', 'bad'); }
  function mark(l) { l.flags.hardcoreShocks = (l.flags.hardcoreShocks || 0) + 1; }
  function register(id, def) {
    ids.push(id);
    def.opts.forEach(function (o) { var run = o.run; o.run = function (l, r, log, d) { mark(l); run(l, r, log, d); }; });
    E.SC(id, def);
  }
  register('hc_sua_gap', {
    title: 'Hỏng đúng lúc cạn tiền', valid: adult,
    prep: function (l, r) { return { amount: cost(l, r), item: U.pick(r, ['đường điện trong chỗ ở', 'đường ống nước sinh hoạt', 'thiết bị thiết yếu dùng hằng ngày']) }; },
    text: function (l, d) { return U.cap(d.item) + ' hỏng bất ngờ. Sửa dứt điểm tốn ' + H.money(l, d.amount) + ', trong khi các khoản sinh hoạt vẫn đến hạn.'; },
    opts: [
      { k: 'sua', l: 'Sửa dứt điểm', h: function (l, d) { return H.money(l, d.amount); }, ai: { w: 1, smart: 1 }, run: function (l, r, log, d) { pay(l, d.amount, 'Sửa chữa khẩn cấp', log); H.fx(l, { hap: -2 }); } },
      { k: 'tam', l: 'Khắc phục tạm, tự xoay xở', h: 'Trả 35% chi phí; mất sức và bất tiện', ai: { w: 1.3 }, run: function (l, r, log, d) { pay(l, d.amount * 0.35, 'Khắc phục tạm đồ hỏng', log); H.fx(l, { hea: -3, hap: -5 }); } }
    ]
  });
  register('hc_nha_can_tien', {
    title: 'Gia đình cần tiền gấp', valid: function (l) { return adult(l) && (l.fam.mAlive || (l.fam.fAlive && !l.fam.noDad) || l.kids.some(function (k) { return k.alive !== false; })); },
    prep: function (l, r) { return { amount: cost(l, r) * 1.3 }; },
    text: function (l, d) { return 'Gia đình có việc gấp, cần bạn góp ' + H.money(l, d.amount) + '. Quỹ dự phòng vốn đã mỏng, giúp lần này sẽ phải cắt bớt chi tiêu của mình.'; },
    opts: [
      { k: 'giup', l: 'Góp đủ phần mình', h: function (l, d) { return H.money(l, d.amount); }, ai: { w: 1, moral: 1 }, run: function (l, r, log, d) { pay(l, d.amount, 'Góp tiền giải quyết việc gia đình', log); H.fx(l, { karma: 2, hap: -2 }); } },
      { k: 'it', l: 'Chỉ giúp một phần, cùng tìm cách khác', h: 'Góp 25%; gia đình phải tiếp tục xoay xở', ai: { w: 1.2 }, run: function (l, r, log, d) { pay(l, d.amount * 0.25, 'Góp một phần cho gia đình', log); H.fx(l, { hap: -4 }); } }
    ]
  });
  register('hc_hut_thu', {
    title: 'Thu nhập hụt một khoản', valid: function (l) { return adult(l) && !!l.job && !l.retired && !E.isStableService(l); },
    prep: function (l, r) { return { amount: Math.max(l.base * 0.03, (l.income > 0 ? l.income : l.base * 0.4) * (0.1 + r() * 0.15)) }; },
    text: function (l, d) { return 'Công việc phát sinh khoản hụt thu ' + H.money(l, d.amount) + ': đơn hàng bị hủy hoặc khoản đã hẹn không thanh toán đủ. Bạn phải tìm cách bù lại.'; },
    opts: [
      { k: 'chiu', l: 'Chấp nhận hụt thu, giữ sức', h: function (l, d) { return 'Mất ' + H.money(l, d.amount); }, ai: { w: 1 }, run: function (l, r, log, d) { pay(l, d.amount, 'Khoản thu bị hụt', log); H.fx(l, { hap: -3 }); } },
      { k: 'bu', l: 'Nhận thêm việc để bù một phần', h: 'Vẫn mất 40% khoản hụt; giảm sức khỏe', ai: { w: 1, amb: 1 }, run: function (l, r, log, d) { pay(l, d.amount * 0.4, 'Hụt thu sau khi làm thêm bù đắp', log); H.fx(l, { hea: -5, hap: -3 }); } }
    ]
  });
  register('hc_lua_coc', {
    title: 'Lời mời kiếm tiền cần đặt cọc', valid: function (l) { return adult(l) && !l.retired; },
    prep: function (l, r) { return { amount: cost(l, r), scam: r() < 0.8 }; },
    text: function (l, d) { return 'Một người lạ mời làm việc với khoản tiền khá, nhưng đòi đặt cọc ' + H.money(l, d.amount) + ' trước. Họ liên tục giục bạn chuyển ngay để giữ suất.'; },
    opts: [
      { k: 'bo', l: 'Từ chối yêu cầu đặt cọc', ai: { w: 2, smart: 1 }, run: function (l, r, log) { log('Bạn từ chối chuyển tiền. Bỏ qua một lời hứa hấp dẫn, giữ được khoản dự phòng.', 'neutral'); } },
      { k: 'thu', l: 'Đánh cược chuyển tiền cọc', h: 'Có thể mất toàn bộ tiền cọc', ai: { w: 0.3, risk: 1 }, run: function (l, r, log, d) { if (d.scam) { pay(l, d.amount, 'Mất cọc vì lời mời việc giả', log); H.fx(l, { hap: -8 }); } else { var gain = d.amount * 0.2; H.cash(l, gain, 'Lãi ròng công việc ngắn hạn'); log('Công việc có thật, nhận lại cọc và lãi ròng ' + H.money(l, gain) + '.', 'good'); } } }
    ]
  });
  register('hc_hoc_gap', {
    title: 'Bài làm gặp trục trặc', valid: function (l) { return hard(l) && free(l) && l.age >= 6 && l.age <= 25 && !!l.school && l.school !== 'police'; },
    text: function () { return 'Gần ngày nộp, phần bài đã làm bị hỏng hoặc thất lạc. Thời gian còn rất ít, bạn phải chọn cách xoay xở.'; },
    opts: [
      { k: 'lam', l: 'Thức khuya làm lại', h: 'Giảm sức khỏe; vẫn giữ được tiến độ học', ai: { w: 1, amb: 1 }, run: function (l, r, log) { H.fx(l, { hea: -4, hap: -4, kno: 1 }); log('Bạn làm lại bài trong mấy đêm, nộp kịp nhưng mệt rã rời.', 'bad'); } },
      { k: 'xin', l: 'Xin gia hạn, chấp nhận bị trừ điểm', h: 'Giữ sức; giảm kiến thức và tâm trạng', ai: { w: 1 }, run: function (l, r, log) { H.fx(l, { kno: -3, hap: -3 }); log('Bạn xin thêm thời gian. Bài bị trừ điểm, nhưng bạn không phải cố đến kiệt sức.', 'neutral'); } }
    ]
  });
  register('hc_ap_luc', {
    title: 'Nhiều việc dồn cùng lúc', valid: adult,
    text: function () { return 'Chuyện cơm áo, giấy tờ và những việc chưa giải quyết dồn vào cùng một đợt. Bạn cảm thấy không có chỗ để thở.'; },
    opts: [
      { k: 'nghi', l: 'Dành thời gian nghỉ, giải quyết từng việc', h: 'Trả một khoản nhỏ để nhờ hỗ trợ', ai: { w: 1, smart: 1 }, run: function (l, r, log) { pay(l, l.base * 0.025, 'Nhờ hỗ trợ giải quyết việc tồn đọng', log); if (l.mind) l.mind.stress = Math.max(0, l.mind.stress - 6); H.fx(l, { hap: -2 }); } },
      { k: 'gong', l: 'Tự gồng gánh tất cả', h: 'Không mất tiền; giảm sức khỏe, tăng căng thẳng', ai: { w: 1 }, run: function (l, r, log) { H.fx(l, { hea: -4, hap: -5 }); if (l.mind) l.mind.stress = Math.min(100, l.mind.stress + 8); log('Bạn tự xoay xở hết, tiết kiệm được tiền nhưng mất ngủ nhiều đêm.', 'bad'); } }
    ]
  });
  E.HARDCORE_EVENTS = ids;
  E.hardcoreEvent = function (l, r, a) {
    if (!hard(l) || !free(l) || a < 6) return null;
    if (r() >= (a < 18 ? 0.35 : 0.6)) return null;
    var at = l.flags.hardcoreAt || {}, eligible = ids.filter(function (id) { return (at[id] == null || a - at[id] >= 5) && E.DEC[id].def.valid(l); });
    return eligible.length ? U.pick(r, eligible) : null;
  };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
