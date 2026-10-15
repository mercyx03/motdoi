/* Một Đời — v2.9: vé số theo tỉ lệ trúng thật.
   Xổ số kiến thiết 10.000 đ/tờ: giải đặc biệt 2 tỷ (1/1.000.000). Vietlott Mega 6/45: Jackpot từ 12 tỷ (1/8.145.060).
   Vietlott Power 6/55: Jackpot 1 từ 30 tỷ (1/28.989.675), Jackpot 2 từ 3 tỷ (1/4.831.613).
   Trúng lớn: nộp thuế thu nhập cá nhân 10% phần vượt 10 triệu, chọn đeo mặt nạ nhận giải hay công khai —
   rồi người lạ "nhận vơ", họ hàng hỏi vay, cám dỗ tiêu xài, kẻ lừa đảo tìm đến. */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function T(id, when, p, cd) { E.TRIG.push({ id: id, when: when, p: p, cd: cd || 0 }); }
  function fx(l, o) { H.fx(l, o); }
  function mo(l, v) { return H.money(l, v); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped); }
  function vnd(l) { return isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  // số tiền (triệu đồng) → tiền đang dùng; ở nước khác quy đổi tương đối theo thu nhập
  function V(l, trieu) { return vnd(l) ? trieu : trieu / 100 * l.base * 0.6; }
  function pay(l, trieu, why) { H.cash(l, -V(l, trieu), why); }
  // [tên giải, xác suất mỗi vé, tiền thưởng (triệu đồng) — hàm để jackpot mỗi kỳ một khác]
  var GAMES = {
    xskt: { n: 'xổ số kiến thiết', price: 0.01, tiers: [['giải Đặc biệt', 1 / 1e6, function () { return 2000; }], ['giải Nhất', 1 / 1e5, function () { return 30; }], ['giải Nhì', 1 / 5e4, function () { return 15; }], ['giải Năm', 1 / 1e4, function () { return 1; }], ['giải Tám', 1 / 100, function () { return 0.1; }]] },
    mega: { n: 'Vietlott Mega 6/45', price: 0.01, tiers: [['Jackpot', 1 / 8145060, function (r) { return Math.round(12000 + r() * r() * 70000); }], ['giải Nhất (trùng 5 số)', 1 / 34808, function () { return 10; }], ['giải Nhì (trùng 4 số)', 1 / 733, function () { return 0.3; }], ['giải Ba (trùng 3 số)', 1 / 45, function () { return 0.03; }]] },
    power: { n: 'Vietlott Power 6/55', price: 0.01, tiers: [['Jackpot 1', 1 / 28989675, function (r) { return Math.round(30000 + r() * r() * 270000); }], ['Jackpot 2', 1 / 4831613, function (r) { return Math.round(3000 + r() * 4000); }], ['giải Nhất (trùng 5 số)', 1 / 96633, function () { return 40; }], ['giải Nhì (trùng 4 số)', 1 / 1643, function () { return 0.5; }], ['giải Ba (trùng 3 số)', 1 / 78, function () { return 0.05; }]] },
    // v3.6: sống ở nước ngoài thì chơi xổ số quốc gia nơi đó (kiểu 6 số / 45), giải thưởng quy theo mức thu nhập nước đó
    loto: { n: 'xổ số quốc gia', price: 0.01, tiers: [['Jackpot', 1 / 8145060, function (r) { return Math.round(5000 + r() * r() * 45000); }], ['giải Nhất (trùng 5 số)', 1 / 34808, function () { return 10; }], ['giải Nhì (trùng 4 số)', 1 / 733, function () { return 0.3; }], ['giải Ba (trùng 3 số)', 1 / 45, function () { return 0.03; }]] }
  };
  E.LOTTO = GAMES;
  function odds(p) { return '1/' + U.fmtNum(Math.round(1 / p)); }
  function poisson(r, lam) { if (lam < 30) return U.poisson(r, lam); return Math.max(0, Math.round(lam + Math.sqrt(lam) * U.normal(r))); }
  // dò vé: trả về tổng tiền thưởng (triệu) và giải cao nhất
  function draw(l, r, g, n) {
    var G0 = GAMES[g], win = 0, best = null;
    G0.tiers.forEach(function (t, i) {
      var k = n <= 20 ? (function () { var c = 0; for (var j = 0; j < n; j++) if (r() < t[1]) c++; return c; })() : poisson(r, n * t[1]);
      if (k > 0) { win += (/Jackpot|Đặc biệt/.test(t[0]) ? 1 : k) * t[2](r); if (!best) best = { i: i, n: t[0] }; } // các giải xét từ cao xuống thấp; jackpot chỉ có một (trúng nhiều vé thì vẫn là một phần thưởng)
    });
    return { win: win, best: best };
  }
  function play(l, r, log, g, n, label) {
    var G0 = GAMES[g]; pay(l, G0.price * n, 'Mua ' + G0.n);
    var d = draw(l, r, g, n);
    if (!d.best) { log(label + ' — ' + pick(r, ['trượt hết. Thôi coi như góp quỹ phúc lợi.', 'không trúng số nào.', 'dò đi dò lại vẫn trượt.']), 'neutral'); return; }
    var big = d.win >= 1000; // từ 1 tỷ trở lên là "đổi đời"
    if (!big) { H.cash(l, V(l, d.win), 'Trúng ' + G0.n); log(label + ' — trúng ' + d.best.n + ', được ' + mo(l, V(l, d.win)) + '.', d.win >= 10 ? 'good' : 'neutral'); if (d.win >= 10) fx(l, { hap: 4 }); return; }
    var gross = d.win, tax = Math.max(0, gross - 10) * 0.1, net = gross - tax;
    l.flags.lottoWin = { amt: V(l, net), gross: V(l, gross), g: G0.n, prize: d.best.n, y: l.age, pub: null };
    log('TRÚNG ' + d.best.n.toUpperCase() + ' ' + G0.n + ': ' + mo(l, V(l, gross)) + '! Sau khi nộp thuế thu nhập cá nhân ' + mo(l, V(l, tax)) + ', thực nhận ' + mo(l, V(l, net)) + '.', 'big');
    fx(l, { hap: 25 }); H.mem(l, 'Giây phút dò vé và nhận ra mình trúng ' + d.best.n + ' ' + G0.n + ', tay run không cầm nổi tờ vé.', 9);
    l.pending.unshift(E.DEC.ts_nhan_giai.make(l, r));
  }
  SC('ve_so', {
    title: 'Mua vé số', text: function (l) { if (!vnd(l)) return 'Xổ số quốc gia ở ' + (l.abroad && l.abroad.perm ? l.abroad.name : l.countryName || 'nước bạn đang sống') + ' đang có giải Jackpot rất lớn. Mỗi vé khoảng ' + mo(l, V(l, 0.01)) + ', chọn 6 số.'; return (isVN(l) ? 'Cô bán vé số đi ngang qua: "Mua giùm cô vài tờ đi con, hôm nay ngày đẹp!" Trên điện thoại, Vietlott đang quảng cáo Jackpot hàng chục tỷ.' : 'Xổ số quốc gia đang có giải Jackpot rất lớn.') + ' Vé 10.000 đ/tờ.'; },
    opts: [
      { k: 'loto1', l: 'Mua 1 vé xổ số quốc gia', h: 'Jackpot rất lớn · xác suất ' + odds(1 / 8145060), req: function (l) { return !vnd(l); }, ai: { w: 1.5 }, run: function (l, r, log) { play(l, r, log, 'loto', 1, 'Dò vé xổ số'); } },
      { k: 'loto10', l: 'Mua 10 vé xổ số quốc gia', h: '10 vé = ' + odds(10 / 8145060) + ' trúng Jackpot', req: function (l) { return !vnd(l); }, ai: { risk: 0.8 }, run: function (l, r, log) { play(l, r, log, 'loto', 10, 'Dò 10 vé xổ số'); } },
      { k: 'loto_year', l: 'Mua đều đặn mỗi kỳ trong cả năm (104 vé)', h: 'Cả năm vẫn chỉ ' + odds(104 / 8145060) + ' trúng Jackpot', req: function (l) { return !vnd(l) && l.indep; }, ai: { risk: 1, w: 0.3 }, run: function (l, r, log) { play(l, r, log, 'loto', 104, 'Cả năm mua vé số đều đặn'); } },
      { k: 'xskt1', req: function (l) { return vnd(l); }, l: 'Mua 1 tờ xổ số kiến thiết', h: 'Giải Đặc biệt 2 tỷ · xác suất ' + odds(1e-6), ai: { w: 1.5 }, run: function (l, r, log) { play(l, r, log, 'xskt', 1, 'Dò tờ vé số'); } },
      { k: 'xskt10', req: function (l) { return vnd(l); }, l: 'Mua cả xấp 10 tờ xổ số kiến thiết', h: 'Đặc biệt 2 tỷ · 10 tờ = ' + odds(1e-5), ai: { risk: 0.8 }, run: function (l, r, log) { play(l, r, log, 'xskt', 10, 'Dò cả xấp vé số'); } },
      { k: 'mega', req: function (l) { return vnd(l); }, l: 'Mua 5 vé Vietlott Mega 6/45', h: 'Jackpot từ 12 tỷ · mỗi vé ' + odds(1 / 8145060), ai: { w: 0.8 }, run: function (l, r, log) { play(l, r, log, 'mega', 5, 'Dò 5 vé Mega 6/45'); } },
      { k: 'power', req: function (l) { return vnd(l); }, l: 'Mua 5 vé Vietlott Power 6/55', h: 'Jackpot 1 từ 30 tỷ · mỗi vé ' + odds(1 / 28989675), ai: { w: 0.8, risk: 0.5 }, run: function (l, r, log) { play(l, r, log, 'power', 5, 'Dò 5 vé Power 6/55'); } },
      { k: 'year', l: 'Mua Power 6/55 đều đặn mỗi kỳ trong cả năm (156 vé)', h: 'Tốn ~1,56 triệu đ · cả năm vẫn chỉ ' + odds(156 / 28989675) + ' trúng Jackpot', req: function (l) { return vnd(l) && l.indep; }, ai: { risk: 1, w: 0.3 }, run: function (l, r, log) { play(l, r, log, 'power', 156, 'Cả năm mua đều Power 6/55'); } },
      { k: 'no', l: 'Thôi, không mua', ai: { w: 0.5 }, run: function (l, r, log) { log('Không mua vé số. Tiền nào của nấy.', 'neutral'); } }
    ]
  });
  E.ACT.forEach(function (a) { if (a.id === 've_so') a.l = function (l) { return vnd(l) ? 'Mua vé số, Vietlott' : 'Mua vé số'; }; });

  // ---------- nhận giải ----------
  SC('ts_nhan_giai', {
    title: 'Nhận giải thưởng', text: function (l) { var w = l.flags.lottoWin; return 'Bạn cầm tấm vé trúng ' + w.prize + ' ' + w.g + ' trị giá ' + mo(l, w.gross) + '. Nhận giải thế nào?'; },
    valid: function (l) { return !!(l.flags.lottoWin && l.flags.lottoWin.pub == null); },
    opts: [
      { k: 'mask', l: 'Đeo mặt nạ, đội mũ, giữ kín danh tính', h: 'Chỉ người nhà biết — an toàn hơn', ai: { w: 1.5, smart: 1 }, run: function (l, r, log) { var w = l.flags.lottoWin; w.pub = false; H.cash(l, w.amt, 'Trúng ' + w.prize); log('Đeo mặt nạ kín mặt lên nhận tấm séc. Ảnh đăng báo chỉ thấy một người đội mũ, đeo khẩu trang. Tiền chuyển vào tài khoản.', 'big'); } },
      { k: 'public', l: 'Lên nhận giải lộ mặt, chụp ảnh với tấm séc', h: 'Nổi tiếng — và nhiều người tìm đến', ai: { risk: 1.2, w: 0.4 }, run: function (l, r, log) { var w = l.flags.lottoWin; w.pub = true; H.cash(l, w.amt, 'Trúng ' + w.prize); l.fame = (l.fame || 0) + 5e4; log('Lên nhận giải không che mặt, cười rạng rỡ bên tấm séc khổng lồ. Ảnh lan khắp mạng xã hội, cả tỉnh biết mặt bạn.', 'big'); H.mem(l, 'Tấm ảnh cầm tấm séc khổng lồ lan khắp mạng.', 6); } }
    ]
  });
  E.MAJOR.ts_nhan_giai = 1;
  function rich(l) { var w = l.flags.lottoWin; return !!(w && w.pub != null && l.age - w.y <= 8); }
  function known(l) { var w = l.flags.lottoWin; return rich(l) && (w.pub || w.leak); }

  // người lạ "nhận vơ" — chỉ khi đã công khai hoặc bị lộ
  var STRANGERS = [
    'Một người đàn ông lạ hoắc ôm chầm lấy bạn: "Nhớ anh không? Hồi xưa anh bế mày suốt!"',
    'Một ông chú khoe vết sẹo trên tay: "Ngày xưa chú đỡ cho bố mày một nhát dao đấy, nhớ không?"',
    'Một bà cô ở đâu đến rưng rưng: "Hồi bé cô thay tã cho mày suốt, giờ cô khó khăn quá…"',
    'Một người tự xưng bạn cùng lớp mẫu giáo: "Mày quên tao rồi à? Hồi đó tao nhường mày cái xích đu!"',
    'Một nhóm người lạ xưng là họ hàng bên ngoại xa, mang theo cả gia phả viết tay.',
    'Ông hàng xóm cũ: "Ngày xưa bố mày còn nợ tao một bữa rượu, giờ tính lãi cũng vài chục triệu."'
  ];
  SC('ts_nguoi_la', {
    title: 'Người lạ tìm đến', prep: function (l, r) { return { t: pick(r, STRANGERS) }; }, valid: function (l) { return known(l); },
    text: function (l, d) { return d.t; },
    opts: [
      { k: 'give', l: 'Cho ít tiền cho xong chuyện', ai: { w: 1, soc: 0.5 }, run: function (l, r, log) { H.cash(l, -l.base * 0.2, 'Cho người lạ'); log('Đưa ít tiền cho đi. Tuần sau người đó dẫn thêm hai "người quen cũ" nữa đến.', 'neutral'); l.flags.lottoWin.beg = (l.flags.lottoWin.beg || 0) + 1; } },
      { k: 'ask', l: 'Hỏi kỹ lại chuyện xưa', ai: { smart: 1, w: 0.8 }, run: function (l, r, log) { log(pick(r, ['Hỏi vài câu thì người đó ấp úng, nói nhầm cả tên bố mẹ bạn rồi lủi mất.', 'Hóa ra nhận nhầm người — người đó tìm một người trúng số khác ở huyện bên.', 'Kể vanh vách ngày xưa… nhưng toàn chuyện của nhà khác.']), 'neutral'); fx(l, { hap: 2 }); } },
      { k: 'no', l: 'Lịch sự từ chối, đóng cửa', ai: { w: 1 }, run: function (l, r, log) { log('Từ chối khéo. Người đó đứng chửi trước cổng một lúc rồi bỏ đi.', 'neutral'); fx(l, { hap: -1 }); } }
    ]
  });
  T('ts_nguoi_la', function (l) { return known(l) && free(l); }, function (l) { return l.flags.lottoWin.pub ? 0.7 : 0.35; }, 1);
  // họ hàng, bạn bè hỏi vay / xin
  SC('ts_ho_hang', {
    title: 'Họ hàng, bạn bè hỏi vay', prep: function (l, r) { return { who: pick(r, ['Ông chú họ', 'Bà dì bên ngoại', 'Người bạn thân thời cấp ba', 'Anh họ', 'Đồng nghiệp cũ']), why: pick(r, ['làm ăn thua lỗ', 'mua nhà cho con', 'chữa bệnh', 'trả nợ', 'mở quán']), x: pick(r, [0.5, 1, 3]) }; },
    valid: function (l) { return rich(l); },
    text: function (l, d) { return d.who + ' tìm đến hỏi vay ' + H.mb(l, d.x) + ' để ' + d.why + '. "Có tiền rồi thì giúp anh em một chút."'; },
    opts: [
      { k: 'give', l: 'Cho luôn, không cần trả', ai: { soc: 1, w: 0.7 }, run: function (l, r, log, d) { H.cash(l, -l.base * d.x, 'Cho họ hàng'); fx(l, { karma: 4, soc: 3 }); log('Cho ' + d.who.toLowerCase() + ' ' + H.mb(l, d.x) + '. Cả họ khen bạn sống tình nghĩa.', 'good'); } },
      { k: 'lend', l: 'Cho vay, có giấy tờ đàng hoàng', ai: { w: 1, smart: 0.8 }, run: function (l, r, log, d) { H.cash(l, -l.base * d.x, 'Cho họ hàng vay'); if (ch(r, 0.5)) { H.sched(l, 'ts_tra_no', U.randint(r, 1, 3), { x: d.x, who: d.who }); log('Cho vay, hai bên ký giấy.', 'neutral'); } else { log('Cho vay, ký giấy — nhưng từ đó ' + d.who.toLowerCase() + ' tránh mặt bạn.', 'bad'); fx(l, { hap: -3 }); } } },
      { k: 'no', l: 'Từ chối', ai: { w: 0.7 }, run: function (l, r, log, d) { fx(l, { soc: -4 }); log('Từ chối. ' + d.who + ' đi rêu rao "giàu rồi quên họ hàng".', 'neutral'); } }
    ]
  });
  T('ts_ho_hang', function (l) { return rich(l) && free(l); }, function (l) { return known(l) ? 0.6 : 0.3; }, 1);
  SC('ts_tra_no', { title: 'Trả nợ', valid: function (l, d) { return !!(d && d.x); }, prep: function (l, r, a) { return a || { x: 0.5, who: 'Người quen' }; }, text: function (l, d) { return d.who + ' mang tiền đến trả.'; },
    opts: [{ k: 'ok', l: 'Nhận lại', run: function (l, r, log, d) { H.cash(l, l.base * d.x, 'Được trả nợ'); log(d.who + ' trả lại ' + H.mb(l, d.x) + ' như đã hứa.', 'good'); } }] });
  // tiêu tiền: xa xỉ, đầu tư, giúp gia đình
  SC('ts_tieu_tien', {
    title: 'Tiền nhiều, tiêu thế nào?', valid: function (l) { return rich(l) && l.money > l.base * 5; },
    text: function (l) { return 'Tài khoản đang có ' + mo(l, l.money) + '. Ai cũng có ý kiến bạn nên làm gì với số tiền này.'; },
    opts: [
      { k: 'save', l: 'Gửi tiết kiệm, mua vàng, giữ chặt', ai: { w: 1.2, smart: 1 }, run: function (l, r, log) { var x = l.money * 0.6; l.money -= x; l.assets.save = (l.assets.save || 0) + x * 0.7; l.assets.gold = (l.assets.gold || 0) + x * 0.3; l.basis.save = (l.basis.save || 0) + x * 0.7; l.basis.gold = (l.basis.gold || 0) + x * 0.3; log('Gửi tiết kiệm, mua vàng ' + mo(l, x) + '. Vẫn đi làm như chưa có chuyện gì.', 'good'); } },
      { k: 'family', l: 'Lo cho bố mẹ, anh chị em', req: function (l) { return l.fam.mAlive || l.fam.fAlive || (l.sibList || []).some(function (s) { return s.alive; }); }, ai: { w: 1, soc: 1 }, run: function (l, r, log) { var x = l.money * 0.25; H.cash(l, -x, 'Lo cho gia đình'); fx(l, { karma: 6, hap: 5 }); log('Xây lại nhà cho bố mẹ, chia cho anh chị em mỗi người một phần.', 'good'); H.mem(l, 'Ngày đưa bố mẹ về ngôi nhà mới xây.', 6); } },
      { k: 'lux', l: 'Sống sang: siêu xe, đồng hồ, du lịch hạng thương gia', ai: { risk: 1, w: 0.7 }, run: function (l, r, log) { var x = l.money * 0.5; H.cash(l, -x, 'Tiêu xài xa xỉ'); fx(l, { hap: 10 }); log('Mua đồng hồ, túi hiệu, bay hạng thương gia đi châu Âu. Tiêu hết ' + mo(l, x) + ' trong một năm.', 'neutral'); if (ch(r, 0.3)) log('Bạn bè mới xuất hiện ngày càng nhiều — không ai rủ bạn đi ăn khi bạn không trả tiền.', 'neutral'); } },
      { k: 'charity', l: 'Làm từ thiện, xây trường cho vùng khó', ai: { w: 0.5, soc: 1 }, run: function (l, r, log) { var x = l.money * 0.15; H.cash(l, -x, 'Từ thiện'); fx(l, { karma: 15, hap: 6 }); log('Xây một điểm trường ở vùng núi mang tên bố mẹ.', 'big'); H.mem(l, 'Ngày khánh thành điểm trường, lũ trẻ vùng cao chạy ra đón.', 7); } },
      { k: 'invest', l: 'Đổ hết vào dự án "lợi nhuận 30%/tháng" một người quen giới thiệu', ai: { risk: 1.5, smart: -1, w: 0.3 }, run: function (l, r, log) { var x = l.money * 0.7; H.cash(l, -x, 'Đầu tư dự án'); if (ch(r, 0.85)) { log('Dự án là lừa đảo đa cấp. Chủ dự án bỏ trốn, bạn mất ' + mo(l, x) + '.', 'bad'); fx(l, { hap: -20 }); H.mem(l, 'Ngày biết số tiền trúng số đã bay theo dự án ma.', 6); } else { H.cash(l, x * 1.5, 'Lãi dự án'); log('May mắn rút ra kịp với lãi. Nhưng suýt nữa thì…', 'neutral'); } } }
    ]
  });
  T('ts_tieu_tien', function (l) { return rich(l) && l.money > l.base * 5 && free(l); }, 0.5, 1);
  // lộ thông tin dù đã đeo mặt nạ
  E.HOOKS.year.push(function (l, r, log, a) {
    var w = l.flags.lottoWin; if (!w || w.pub !== false || w.leak || a - w.y > 6) return;
    if (ch(r, 0.15 + (l.partner ? 0.05 : 0))) { w.leak = true; log('Dù đã đeo mặt nạ nhận giải, chuyện bạn trúng số vẫn bị lộ — ' + pick(r, ['người nhà lỡ miệng ở đám cưới.', 'ngân hàng có người nói ra ngoài.', 'bạn mua xe mới, cả xóm đoán ra.']), 'neutral'); }
  });
  E.lottery = { GAMES: GAMES, draw: draw, play: play };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
