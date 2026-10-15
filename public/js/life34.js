/* Một Đời — v3.4:
   · hẹn hò qua mạng (Tinder, Bumble, Facebook Hẹn hò…): gặp người tử tế, người "đào mỏ", lừa đầu tư, ảnh ảo, "Việt kiều gửi quà"; đủ tinh ý thì thoát
   · nhiều hoạt động hẹn hò: xem phim, tô tượng, thủy cung, nhà sách, bảo tàng, workshop, bowling…
   · rủ người lạ chơi game cùng (nam giả nữ, "đồng đội" là học sinh lớp 5…) · nghề cày thuê rank Liên Quân, Liên Minh, Tốc Chiến
   · thêm nhiều chuyện tuổi thơ; game nhớ những chuyện đã gặp ở các đời trước để chơi lại ít trùng */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function A(id, g, label, o) { var x = { id: id, g: g, l: label }; for (var k in o) x[k] = o[k]; E.ACT.push(x); }
  function fx(l, o) { H.fx(l, o); }
  function mo(l, v) { return H.money(l, v); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function vnd(l) { return isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  function V(l, tr) { return vnd(l) ? tr : tr / 90 * l.base; }
  function pay(l, tr, why) { var x = Math.min(V(l, tr), Math.max(0, l.money) + l.base * 0.5); H.cash(l, -x, why); return x; }
  function rng(r, a, b) { return a + (b - a) * r(); }

  // ===================================================================
  // 1. HẸN HÒ QUA MẠNG: NGƯỜI TỬ TẾ VÀ NHỮNG CÚ LỪA
  // ===================================================================
  // độ tinh ý: hiểu biết, từng trải, từng bị lừa thì cảnh giác hơn
  function savvy(l) { return U.clamp(0.15 + l.st.kno / 220 + l.st.soc / 400 + Math.min(20, l.age - 18) / 100 + (l.flags.scamOnline ? 0.25 : 0) + (l.exes || 0) * 0.03, 0.1, 0.92); }
  E.datingSavvy = savvy;
  function who(sex) { return sex === 'M' ? 'anh ấy' : 'cô ấy'; }
  var TYPES = [['tot', 46], ['dao_mo', 24], ['dau_tu', 10], ['catfish', 12], ['qua_tang', 8]];
  SC('hen_online', {
    title: function (l, d) { return 'Quen qua ' + d.app; },
    prep: function (l, r, arg) {
      var a = arg || {}, s = a.s || H.partnerSex(l, r), t = a.t;
      if (!t) { var tot = 0, ws = TYPES.map(function (x) { var w = x[1] * (x[0] === 'qua_tang' && l.age >= 40 ? 2.5 : 1) * (x[0] === 'dao_mo' && (l.money > l.base * 10 || (l.vehTier || 0) >= 2) ? 2 : 1); tot += w; return w; }), y = r() * tot; for (var i = 0; i < TYPES.length; i++) { y -= ws[i]; if (y < 0) { t = TYPES[i][0]; break; } } t = t || 'tot'; }
      return { app: a.app || 'Tinder', s: s, n: a.n || H.stranger(l, r, s), age: Math.max(18, l.age + U.randint(r, -4, 4)), t: t };
    },
    valid: function (l) { return l.age >= 18 && !l.partner; },
    text: function (l, d) {
      var w = who(d.s);
      var T = {
        tot: 'Bạn match với ' + d.n + ' (' + d.age + ' tuổi) trên ' + d.app + '. Nhắn tin mấy hôm thấy hợp: ' + w + ' kể chuyện công việc, hỏi han bạn ăn uống, rủ cuối tuần đi cà phê.',
        dao_mo: 'Bạn match với ' + d.n + ' (' + d.age + ' tuổi) trên ' + d.app + ', ảnh lung linh, nhắn tin ngọt ngào. Nhưng ' + w + ' hay hỏi bạn làm nghề gì, lương bao nhiêu, đi xe gì, và gợi ý buổi hẹn đầu ở nhà hàng hải sản sang trọng.',
        dau_tu: 'Bạn match với ' + d.n + ' (' + d.age + ' tuổi) trên ' + d.app + '. Nói chuyện rất hợp, ' + w + ' khoe đang đầu tư vàng / tiền ảo trên một sàn "của anh họ", ngày nào cũng gửi ảnh lãi, rủ bạn "nạp thử vài triệu cho vui".',
        catfish: 'Bạn match với ' + d.n + ' trên ' + d.app + ': ảnh đẹp như người mẫu, nhắn tin vui tính, nhưng lần nào rủ gọi video cũng bảo "camera hỏng", "đang ở chỗ ồn".',
        qua_tang: 'Một người tự giới thiệu là ' + (d.s === 'M' ? 'kỹ sư dầu khí người nước ngoài' : 'nữ bác sĩ Việt kiều') + ' nhắn tin làm quen qua ' + d.app + ', nói tiếng Việt hơi lơ lớ, hứa sẽ gửi quà về tặng bạn.'
      }[d.t];
      return T;
    },
    opts: [
      { k: 'gap', l: 'Hẹn gặp ở một quán cà phê bình thường', ai: { w: 1.2 }, run: function (l, r, log, d) { meet(l, r, log, d); } },
      { k: 'chieu', l: function (l, d) { return d.t === 'dau_tu' ? 'Nạp thử vài triệu vào "sàn" như lời gợi ý' : d.t === 'qua_tang' ? 'Đồng ý nhận quà' : 'Chiều theo, đi nhà hàng sang như lời gợi ý'; }, ai: { risk: 0.8, smart: -0.8, w: 0.6 }, run: function (l, r, log, d) { follow(l, r, log, d); } },
      { k: 'kiem_tra', l: 'Gọi video, tìm ảnh trên mạng, hỏi kỹ trước đã', ai: { smart: 1.2, w: 1 }, run: function (l, r, log, d) { check(l, r, log, d); } },
      { k: 'thoi', l: 'Thôi, thấy không ổn, hủy kết nối', ai: { w: 0.4 }, run: function (l, r, log, d) { log('Hủy kết nối với ' + d.n + '.', 'neutral'); } }
    ]
  });
  function scammed(l, log, amt, t) { var x = pay(l, amt, 'Bị lừa qua mạng'); l.flags.scamOnline = true; fx(l, { hap: -8 }); if (l.mind) l.mind.stress += 8; log(t + ' Mất ' + mo(l, x) + '.', 'bad'); H.mem(l, 'Lần bị lừa qua ứng dụng hẹn hò — bài học đắt giá.', 3); }
  function love(l, r, d, where) { var dec = E.DEC.love.make(l, r, { where: where }); dec.data.p.name = d.n; dec.data.p.sex = d.s; dec.data.p.age = d.age; dec.text = 'Bạn và ' + d.n + ' (' + (d.s === 'M' ? 'nam' : 'nữ') + ', ' + d.age + ' tuổi) quen nhau ' + where + '. Gặp ngoài đời còn dễ thương hơn trên mạng.'; l.pending.unshift(dec); }
  function meet(l, r, log, d) {
    var w = who(d.s);
    if (d.t === 'tot') { pay(l, 0.15, 'Cà phê hẹn hò'); love(l, r, d, 'qua ' + d.app); return; }
    if (d.t === 'dao_mo') {
      if (ch(r, savvy(l) + 0.15)) { pay(l, 0.15, 'Cà phê hẹn hò'); log('Hẹn ở quán cà phê bình thường, ' + d.n + ' tỏ ra hụt hẫng, cả buổi chỉ hỏi bạn có nhà riêng chưa, xe gì. Hôm sau ' + w + ' "hủy kết nối". Thoát một người đào mỏ.', 'good'); fx(l, { kno: 1 }); }
      else { scammed(l, log, rng(r, 3, 8), 'Đến quán, ' + d.n + ' gọi thêm cả bạn đi cùng, gọi món đắt nhất rồi "đi vệ sinh" để bạn tự thanh toán. Từ đó ' + w + ' chặn liên lạc.'); }
      return;
    }
    if (d.t === 'catfish') { pay(l, 0.15, 'Cà phê hẹn hò'); var t = pick(r, [d.n + ' ngoài đời khác ảnh đến mức bạn nhìn ba lần mới nhận ra. Hai người cười trừ, nói chuyện vẫn vui.', 'Đến nơi mới biết "' + d.n + '" là ' + (d.s === 'F' ? 'một anh chàng râu ria dùng ảnh gái xinh' : 'một bạn khác hẳn ảnh') + ' — "Xin lỗi, tại tui sợ không ai match."', 'Người đến hẹn là… em họ của chủ tài khoản, được nhờ "đi xem mặt hộ".']); log(t, 'neutral'); fx(l, { hap: -1 }); return; }
    // lừa đầu tư, "quà tặng" thường không bao giờ chịu gặp
    log(d.n + ' viện đủ lý do để không gặp mặt, chỉ muốn nói chuyện qua tin nhắn. Bạn bắt đầu thấy lạ và cắt liên lạc.', 'good'); fx(l, { kno: 1 });
  }
  function follow(l, r, log, d) {
    var w = who(d.s);
    if (d.t === 'tot') { pay(l, 1.5, 'Hẹn hò nhà hàng'); love(l, r, d, 'qua ' + d.app); return; }
    if (d.t === 'dao_mo') {
      pay(l, rng(r, 2, 5), 'Hẹn hò nhà hàng sang');
      if (ch(r, savvy(l))) { log('Buổi hẹn nhà hàng sang trọng, rồi ' + d.n + ' xin bạn mua chiếc điện thoại mới "vì máy em hỏng". Bạn chợt nhận ra mình đang bị "đào mỏ", lịch sự từ chối và chia tay.', 'neutral'); }
      else scammed(l, log, rng(r, 30, 80), 'Hết nhà hàng sang đến điện thoại mới, rồi "mẹ ' + (d.s === 'M' ? 'anh' : 'em') + ' nằm viện cần tiền gấp". Bạn chuyển khoản liền mấy lần, rồi ' + w + ' chặn số, xóa tài khoản.');
      return;
    }
    if (d.t === 'dau_tu') {
      if (ch(r, savvy(l) * 0.8)) { pay(l, 3, 'Nạp thử sàn đầu tư'); log('Nạp thử 3 triệu, rút được tiền lãi nhỏ. Khi ' + w + ' giục nạp thêm 100 triệu "để lên VIP", bạn nghi ngờ, tìm trên mạng thì thấy đúng chiêu lừa "sát heo". Mất 3 triệu, may mà dừng kịp.', 'neutral'); l.flags.scamOnline = true; }
      else scammed(l, log, Math.max(20, Math.max(0, l.money) * rng(r, 0.3, 0.7) / (vnd(l) ? 1 : l.base / 90)), 'Nạp thử thấy lãi thật, rút được tiền, bạn nạp dần cả trăm triệu. Đến khi muốn rút, sàn báo "phải đóng thuế 20%". Đóng xong thì sàn biến mất, ' + d.n + ' cũng biến mất. Đây là chiêu lừa "sát heo".');
      return;
    }
    if (d.t === 'qua_tang') {
      if (ch(r, savvy(l))) { log('Vừa đồng ý nhận quà thì có người tự xưng "nhân viên hải quan" gọi bắt đóng phí thông quan. Bạn nhận ra chiêu lừa quen thuộc, chặn hết số.', 'good'); l.flags.scamOnline = true; }
      else scammed(l, log, rng(r, 15, 60), 'Đóng "phí hải quan", rồi "phí chống rửa tiền", rồi "phí vận chuyển"… kiện quà toàn trang sức, đô la chẳng bao giờ đến.');
      return;
    }
    if (d.t === 'catfish') { pay(l, 0.5, 'Nạp thẻ điện thoại cho "người yêu mạng"'); log(d.n + ' xin bạn nạp thẻ điện thoại "vì hết tiền", rồi biến mất. Hóa ra là tài khoản ảo.', 'bad'); }
  }
  function check(l, r, log, d) {
    var w = who(d.s);
    if (d.t === 'tot') { log('Gọi video với ' + d.n + ': y như trong ảnh, nói chuyện tự nhiên. Yên tâm hẹn gặp.', 'good'); love(l, r, d, 'qua ' + d.app); return; }
    if (ch(r, savvy(l) + 0.3)) {
      var t = { dao_mo: 'Hỏi kỹ thì ' + d.n + ' từng "hẹn hò" với mấy người bạn của bạn, ai cũng bị nhờ mua quà đắt tiền. Bạn tránh xa.', dau_tu: 'Tra tên "sàn" trên mạng: đầy bài cảnh báo lừa đảo. Bạn chặn và báo cáo tài khoản.', catfish: 'Tìm ảnh trên mạng: đó là ảnh của một hot girl nước ngoài. Bạn cười rồi chặn.', qua_tang: 'Tra thử: kịch bản "gửi quà, đóng phí hải quan" giống hệt những vụ báo đài đã cảnh báo. Bạn báo cáo tài khoản.' }[d.t];
      log(t, 'good'); fx(l, { kno: 2 }); l.flags.scamOnline = true;
    } else { log(d.n + ' khéo léo vượt qua mọi câu hỏi. Bạn vẫn chưa rõ ' + w + ' là người thế nào…', 'neutral'); l.pending.unshift(E.DEC.hen_online.make(l, r, d)); }
  }
  // ứng dụng hẹn hò (bản v3.0) giờ dẫn vào chuỗi tình huống này
  if (E.DEC.app_hen_ho) E.DEC.app_hen_ho.def.opts.forEach(function (o) {
    if (o.k === 'no') return;
    var run0 = o.run;
    o.run = function (l, r, log) {
      if (o.k === 'trung_nien' || o.k === 'blued' || o.k === 'her' || ch(r, 0.25)) return run0.apply(this, arguments); // giữ các kết cục cũ (qua đêm, bị lừa…) cho đa dạng
      if (ch(r, 0.22)) { log('Quẹt mỏi tay, nhắn được vài người rồi im bặt.', 'neutral'); return; }
      l.pending.unshift(E.DEC.hen_online.make(l, r, { app: o.l }));
    };
  });

  // ===================================================================
  // 2. HOẠT ĐỘNG HẸN HÒ
  // ===================================================================
  var DATES = [
    ['phim', 'Đi xem phim ở rạp', 0.4, 'Xem phim xong hai người tranh luận về cái kết suốt đường về.', { hap: 4 }],
    ['to_tuong', 'Đi tô tượng thạch cao', 0.3, 'Ngồi tô tượng cả buổi chiều, tượng của hai đứa đều xấu nhưng chụp ảnh thì đẹp.', { hap: 5 }],
    ['thuy_cung', 'Đi thủy cung', 0.8, 'Đứng hàng giờ trước bể cá mập, ' + 'tay trong tay trong ánh sáng xanh của đường hầm thủy cung.', { hap: 6 }],
    ['nha_sach', 'Dạo nhà sách, ngồi cà phê sách', 0.3, 'Mỗi người chọn một cuốn tặng nhau, ngồi đọc ở góc quán cà phê sách đến tối.', { hap: 4, kno: 1 }],
    ['bao_tang', 'Đi bảo tàng, triển lãm', 0.15, 'Đi bảo tàng, đứng trước những hiện vật cũ nghe nhau kể chuyện lịch sử.', { hap: 3, kno: 2 }],
    ['workshop', 'Workshop làm nến thơm, làm gốm', 0.6, 'Tự tay nặn chiếc cốc gốm méo mó tặng nhau — món quà đáng giá nhất năm.', { hap: 6 }],
    ['bowling', 'Chơi bowling, game center', 0.5, 'Thua nhau mấy ván bowling, người thua phải bao trà sữa.', { hap: 5, soc: 1 }],
    ['patin', 'Trượt patin, đạp xe quanh hồ', 0.15, 'Ngã lên ngã xuống ở sân patin, cười đến đau bụng.', { hap: 5, hea: 1 }],
    ['lau', 'Đi ăn lẩu, nướng', 0.6, 'Ăn lẩu nướng bốc khói, nói chuyện trên trời dưới biển.', { hap: 4 }],
    ['cho_dem', 'Dạo chợ đêm, phố đi bộ, ăn vặt', 0.25, 'Dạo phố đi bộ, ăn hết hàng này sang hàng khác.', { hap: 4 }],
    ['picnic', 'Picnic ở công viên, ngắm hoàng hôn', 0.15, 'Trải bạt picnic, ngồi ngắm hoàng hôn đến khi đèn đường bật sáng.', { hap: 5 }],
    ['nau_an', 'Nấu ăn cùng nhau ở nhà', 0.2, 'Cùng nhau vào bếp, món ăn hơi mặn nhưng ai cũng khen ngon.', { hap: 4, soc: 1 }],
    ['karaoke', 'Đi hát karaoke hai người', 0.3, 'Hát song ca những bài tình ca cũ, giọng ai cũng lệch tông.', { hap: 4 }],
    ['cong_vien', 'Đi công viên giải trí, chơi tàu lượn', 0.7, 'Hét khản cổ trên tàu lượn siêu tốc, xuống tàu vẫn nắm chặt tay nhau.', { hap: 6 }]
  ];
  if (E.DEC.hen_ho) {
    var HH = E.DEC.hen_ho.def, old = HH.opts;
    var p0 = HH.prep;
    HH.prep = function (l, r, arg) { var d = p0 ? p0.apply(this, arguments) || {} : {}; var ks = DATES.map(function (x) { return x[0]; }); for (var i = ks.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = ks[i]; ks[i] = ks[j]; ks[j] = t; } d.acts = ks.slice(0, 5); return d; };
    HH.text = function (l) { return 'Dạo này bạn và ' + l.partner.name + ' ít thời gian cho nhau. Cuối tuần này hai người đi đâu?'; };
    HH.opts = DATES.map(function (x) {
      return { k: x[0], l: x[1], h: function (l) { return x[2] ? '~' + mo(l, V(l, x[2])) : 'Không tốn tiền'; }, req: function (l, d) { return !d.acts || d.acts.indexOf(x[0]) >= 0; }, ai: { w: 1 },
        run: function (l, r, log) { var pw = l.partner ? l.partner.name : 'người ấy'; var t = (H.datePay ? H.datePay(l, r, V(l, x[2]) / l.base, 'Hẹn hò: ' + x[1].toLowerCase()) : (H.cash(l, -V(l, x[2]), 'Hẹn hò'), '')); log(x[3].replace(/^/, '') + ' (cùng ' + pw + ')' + (t || ''), 'good'); fx(l, x[4]); if (ch(r, 0.15)) H.mem(l, x[3], 2); } };
    }).concat(old.filter(function (o) { return /^(dinner|trip|talk)$/.test(o.k); }));
  }

  // ===================================================================
  // 3. RỦ NGƯỜI LẠ CHƠI GAME CÙNG
  // ===================================================================
  SC('ghep_game', {
    title: 'Rủ người lạ chơi game cùng', valid: function (l) { return l.age >= 13 && l.age <= 40; },
    prep: function (l, r) { return { g: E.ageGame ? E.ageGame(l, r) : (l.game || 'Liên Quân Mobile'), t: pick(r, ['gia_nu', 'hoc_sinh', 'toxic', 'carry', 'crush']), n: pick(r, ['"Bé Mèo 2k5"', '"Tiểu Thư Lười"', '"Sát Thủ Bóng Đêm"', '"Gấu Nhỏ"', '"Kẹo Ngọt"']) }; },
    text: function (l, d) { return 'Đăng bài tìm đồng đội chơi ' + d.g + ' trên hội nhóm, có người tên ' + d.n + ' nhắn rủ leo rank cùng, giọng trong mic nghe rất dễ thương.'; },
    opts: [
      { k: 'choi', l: 'Ghép đội leo rank cùng', ai: { w: 1.2 }, run: function (l, r, log, d) {
        var t = {
          gia_nu: 'Leo rank cùng ' + d.n + ' cả tháng, thân đến mức hẹn gặp ngoài đời. Đến nơi thì gặp… một anh trai cao mét tám, dùng phần mềm đổi giọng: "Xin lỗi bro, giả gái thì được nhường đường dễ hơn." Cả hai cười đau bụng, thành anh em chí cốt.',
          hoc_sinh: d.n + ' chơi rất hay, nói chuyện như người lớn — đến khi mic vọng ra tiếng mẹ gọi "Con ơi tắt máy đi ngủ mai còn đi học lớp 5!". Bạn đành trả em về với bài tập về nhà.',
          toxic: d.n + ' chửi cả đội từ phút thứ ba. Thua xong lại rủ chơi tiếp, rồi dần dần thành bạn thân nhất trên mạng.',
          carry: d.n + ' gánh team từ Vàng lên Kim Cương trong một tuần. Bạn nghi ngờ đây là thợ cày thuê đang "chạy đơn" bằng nick phụ.',
          crush: 'Leo rank cùng ' + d.n + ' mấy tháng, hóa ra là người học cùng trường / làm cùng tòa nhà với bạn. Gặp ngoài đời, hai người ngượng chín mặt.'
        }[d.t];
        log(t, 'good'); fx(l, { hap: 4, soc: 3 });
        if (d.t === 'crush' && !l.partner && l.age >= 16 && ch(r, 0.4)) l.pending.unshift(E.DEC.love.make(l, r, { where: 'khi cùng leo rank ' + d.g }));
        if (d.t === 'carry' && ch(r, 0.4)) l.flags.biet_cay_thue = true;
      } },
      { k: 'thoi', l: 'Thôi, chơi một mình cho chắc', ai: { w: 0.5 }, run: function (l, r, log) { log('Từ chối, chơi một mình leo rank chậm rì.', 'neutral'); } }
    ]
  });
  E.TRIG.push({ id: 'ghep_game', when: function (l, a) { return a >= 13 && a <= 35 && free(l); }, p: function (l) { return l.talent === 'game' || l.game ? 0.12 : l.sex === 'M' ? 0.04 : 0.02; }, cd: 4, max: 2 });

  // ===================================================================
  // 4. NGHỀ CÀY THUÊ RANK
  // ===================================================================
  // Liên Quân Mobile: giá thị trường tham khảo (nghìn đồng / sao). Liên Minh Huyền Thoại, Tốc Chiến: ước lượng tham khảo.
  var BOOST = {
    'Liên Quân Mobile': { unit: 'sao', tiers: [['Đồng → Vàng', 3, 0], ['Bạch Kim → Tinh Anh', 6.5, 35], ['Cao Thủ dưới 25 sao', 10, 55], ['Cao Thủ 25–50 sao', 13, 70], ['Cao Thủ trên 50 sao', 15, 80], ['Chiến Thần', 25, 90]], perDay: 22 },
    'Liên Minh Huyền Thoại': { unit: 'bậc', tiers: [['Sắt → Bạc', 35, 0], ['Vàng', 60, 35], ['Bạch Kim', 90, 55], ['Lục Bảo', 130, 70], ['Kim Cương', 250, 82], ['Cao Thủ trở lên', 400, 92]], perDay: 1.6 },
    'Liên Minh: Tốc Chiến': { unit: 'sao', tiers: [['Đồng → Vàng', 4, 0], ['Bạch Kim', 7, 35], ['Lục Bảo', 10, 55], ['Kim Cương', 15, 70], ['Cao Thủ', 25, 82], ['Đại Cao Thủ, Thách Đấu', 40, 92]], perDay: 18 }
  };
  E.BOOST = BOOST;
  function boostGame(l) { var g = l.boostGame; if (!g || !BOOST[g]) { g = /Liên Minh Huyền/.test(l.game || '') ? 'Liên Minh Huyền Thoại' : /Tốc Chiến/.test(l.game || '') ? 'Liên Minh: Tốc Chiến' : 'Liên Quân Mobile'; l.boostGame = g; } return g; }
  // thu nhập một tháng: nhận được đơn ở mức rank cao nhất mình kéo nổi, cộng thêm đơn nhỏ
  function boostMonth(l) {
    var B = BOOST[boostGame(l)], s = l.skill || 30, top = B.tiers[0];
    B.tiers.forEach(function (t) { if (s >= t[2]) top = t; });
    var per = B.perDay * (0.6 + s / 200) * (top[2] >= 80 ? 0.6 : 1); // rank càng cao càng khó leo, mỗi ngày leo được ít hơn
    var shop = l.job && l.job.rank >= 2 ? 1.8 : l.job && l.job.rank >= 1 ? 1.2 : 1; // có tiếng, có thợ phụ thì nhận nhiều đơn
    return { tier: top[0], price: top[1], unit: B.unit, perDay: per, month: top[1] * per * 26 / 1000 * shop };
  }
  E.boostMonth = boostMonth;
  E.CAR.cay_thue = { id: 'cay_thue', t: ['thợ cày thuê rank (nhận đơn lẻ)', 'thợ cày thuê có tiếng, khách quen đều', 'chủ shop cày thuê, có thợ phụ'], vn: [5, 9, 16], yrs: [2, 3], cat: 'esport', sec: 'inf', edu: 0, talent: 'game', sigma: 0.3, w: 1.2 };
  var cy0 = E.careerYear;
  E.careerYear = function (l, r, log) {
    var inc = cy0.apply(this, arguments);
    if (l.job && E.resolveJob(l.job.id) === 'cay_thue' && inc > 0) {
      var m = boostMonth(l); inc = V(l, m.month) * 12 * Math.exp(U.normal(r) * 0.2);
      l.skill = Math.min(100, (l.skill || 30) + 1.5);
      if (!l.job.boostNoted || r() < 0.15) { l.job.boostNoted = true; log('Cày thuê ' + boostGame(l) + ': nhận đơn ' + m.tier + ' giá ~' + U.fmtNum(m.price) + ' nghìn đồng/' + m.unit + ', mỗi ngày leo được khoảng ' + U.fmtNum(Math.round(m.perDay * 10) / 10) + ' ' + m.unit + ' — tháng kiếm khoảng ' + mo(l, V(l, m.month)) + '.', 'money'); }
    }
    return inc;
  };
  SC('cay_thue_su_co', {
    title: 'Chuyện nghề cày thuê', valid: function (l) { return !!l.job && E.resolveJob(l.job.id) === 'cay_thue'; },
    prep: function (l, r) { return { t: pick(r, ['khoa', 'quyt', 'bao_mat', 'don_lon']) }; },
    text: function (l, d) { return { khoa: 'Một tài khoản khách gửi cày bị nhà phát hành khóa 7 ngày vì đăng nhập bất thường. Khách đòi bồi thường.', quyt: 'Kéo xong 40 sao cho khách, khách chặn liên lạc, chưa trả tiền.', bao_mat: 'Một khách quen gửi tài khoản kèm mật khẩu ngân hàng "nhờ nạp giúp", và hỏi bạn có muốn "mượn tạm" vài skin bán không.', don_lon: 'Một streamer có tiếng thuê bạn kéo nick lên rank cao nhất trước giải đấu, trả gấp đôi giá.' }[d.t] + ' (Cày thuê vi phạm điều khoản của nhà phát hành game, luôn có rủi ro bị khóa tài khoản.)'; },
    opts: [
      { k: 'dung', l: function (l, d) { return { khoa: 'Hoàn tiền, xin lỗi khách', quyt: 'Rút kinh nghiệm: từ nay thu tiền trước 50%', bao_mat: 'Trả lại thông tin, nhắc khách đổi mật khẩu ngay', don_lon: 'Nhận đơn, làm cẩn thận' }[d.t]; }, ai: { w: 1.3 },
        run: function (l, r, log, d) { if (d.t === 'khoa') { pay(l, 0.5, 'Bồi thường khách'); if (l.job) l.job.rep = (l.job.rep || 50) + 3; log('Hoàn tiền cho khách, giữ được uy tín.', 'neutral'); } else if (d.t === 'quyt') { pay(l, 0.4, 'Bị khách quỵt'); log('Mất công mấy đêm, từ nay đòi cọc trước.', 'bad'); } else if (d.t === 'bao_mat') { H.fx(l, { karma: 4 }); log('Nhắc khách đổi mật khẩu. Khách cảm động, giới thiệu thêm cả nhóm bạn.', 'good'); } else { H.cash(l, V(l, 4), 'Đơn cày thuê lớn'); l.fame = (l.fame || 0) + 2000; log('Kéo nick lên rank cao nhất đúng hẹn, streamer khen trên sóng — đơn hàng đến dồn dập.', 'good'); } } },
      { k: 'sai', l: function (l, d) { return { khoa: 'Chối, bảo tại khách tự đăng nhập', quyt: 'Lấy lại nick, đổi mật khẩu để "giữ làm tin"', bao_mat: 'Lấy vài skin bán kiếm thêm', don_lon: 'Dùng phần mềm gian lận cho nhanh' }[d.t]; }, ai: { bad: 1.2, risk: 0.8, w: 0.5 },
        run: function (l, r, log, d) { H.fx(l, { karma: -5 }); if (d.t === 'don_lon' || d.t === 'bao_mat') { if (ch(r, 0.5)) { log('Bị phát hiện, khách tố lên các hội nhóm, mất sạch khách. Có người còn trình báo công an.', 'bad'); l.job = null; l.flags.needJob = true; } else H.cash(l, V(l, 3), 'Tiền gian lận'); } else { log('Khách lên mạng "bóc phốt", đơn hàng giảm hẳn.', 'bad'); if (l.job) l.job.rep = (l.job.rep || 50) - 10; } } }
    ]
  });
  if (E.JOBS2) E.JOBS2.cay_thue_su_co = ['cay_thue']; // được kiểm tra cùng các sự kiện nghề
  E.TRIG.push({ id: 'cay_thue_su_co', when: function (l) { return !!l.job && E.resolveJob(l.job.id) === 'cay_thue' && free(l); }, p: 0.4, cd: 2, max: 4 });
  // học sinh, sinh viên giỏi game nhận cày thuê kiếm thêm
  A('cay_thue_them', 'Công việc', 'Nhận cày thuê rank kiếm thêm', { min: 14, max: 35, sc: 'cay_them', avail: function (l) { return (l.talent === 'game' || (l.skill || 0) >= 40) && (l.game || l.talent === 'game') ? true : 'Cần chơi game giỏi'; }, ai: function (l) { return l.talent === 'game' ? 0.3 : 0; } });
  SC('cay_them', {
    title: 'Cày thuê kiếm thêm', text: function (l) { var m = boostMonth(l); return 'Hội nhóm game có nhiều người thuê cày ' + boostGame(l) + '. Với trình của bạn nhận được đơn ' + m.tier + ', giá ~' + U.fmtNum(m.price) + ' nghìn đồng/' + m.unit + '. Cày thuê vi phạm điều khoản của nhà phát hành, có thể bị khóa tài khoản, và dễ thức khuya.'; },
    opts: [
      { k: 'he', l: 'Nhận đơn cày trong kỳ nghỉ', h: function (l) { return '~' + mo(l, V(l, boostMonth(l).month * 0.4)) + ' cho một tháng làm nửa ngày'; }, ai: { w: 1 }, run: function (l, r, log) { var x = V(l, boostMonth(l).month * 0.4); if (ch(r, 0.15)) { pay(l, 0.3, 'Bồi thường khách bị khóa nick'); log('Tài khoản khách bị khóa vì đăng nhập bất thường, phải hoàn tiền.', 'bad'); return; } H.cash(l, x, 'Cày thuê kiếm thêm'); l.skill = Math.min(100, (l.skill || 30) + 2); log('Cày thuê trong kỳ nghỉ, kiếm được ' + mo(l, x) + (l.school ? '. Thức khuya nhiều nên đầu năm học hơi đuối.' : '.'), 'good'); if (l.school) fx(l, { kno: -2 }); } },
      { k: 'nghe', l: 'Làm luôn nghề cày thuê', req: function (l) { return l.age >= 18 && !l.school && !(l.job && E.resolveJob(l.job.id) === 'cay_thue'); }, ai: { w: 0.4 }, run: function (l, r, log) { E.startJob(l, 'cay_thue', r, log); } },
      { k: 'khong', l: 'Thôi, chơi game cho vui thôi', ai: { w: 0.8 }, run: function (l, r, log) { log('Chơi game để giải trí, không biến nó thành việc.', 'neutral'); } }
    ]
  });

  // ===================================================================
  // 5. NHIỀU CHUYỆN TUỔI THƠ HƠN
  // ===================================================================
  function KID(id, a0, a1, title, text, opts, when, cw) {
    SC(id, { title: title, text: text, opts: opts.map(function (o) { return { k: o[0], l: o[1], ai: o[2] || { w: 1 }, run: function (l, r, log) { var t = typeof o[3] === 'function' ? o[3](l, r) : o[3]; log(t, o[5] || 'neutral'); if (o[4]) fx(l, o[4]); } }; }) });
    E.TRIG.push({ id: id, when: function (l, a) { return a >= a0 && a <= a1 && free(l) && (!when || when(l, a)); }, p: 0.08, cd: 99, child: true, cw: cw || 1, max: 1 });
  }
  function m(l) { return l.fam.mAlive ? 'mẹ' : l.fam.fAlive && !l.fam.noDad ? 'bố' : 'bà'; }
  function b(l) { return l.fam.fAlive && !l.fam.noDad ? 'bố' : l.fam.mAlive ? 'mẹ' : 'ông'; }
  var school = function (l) { return !!l.school; };
  KID('k_mat_dien', 5, 13, 'Cả xóm mất điện', 'Tối mùa hè, cả xóm mất điện. Trong nhà nóng như lò, ngoài ngõ lũ trẻ í ới gọi nhau.', [
    ['ma', 'Ngồi nghe anh chị kể chuyện ma', { w: 1 }, 'Nghe chuyện ma dưới ánh nến, đêm đó không dám đi vệ sinh một mình.', { hap: 2 }, 'good'],
    ['ngo', 'Chạy ra ngõ chơi trốn tìm', { soc: 1 }, 'Chơi trốn tìm trong bóng tối, vui đến mức mong ngày nào cũng mất điện.', { hap: 4, soc: 2 }, 'good'],
    ['quat', 'Ngồi quạt nan cho ông bà', { w: 0.8 }, function (l) { return 'Ngồi quạt cho ' + (l.fam.sibs ? 'cả nhà' : m(l)) + ', được khen ngoan, được thưởng cốc chè đỗ đen.'; }, { karma: 2 }, 'good']]);
  KID('k_sau_rang', 5, 10, 'Chiếc răng sâu', 'Ăn kẹo nhiều quá, một chiếc răng sâu đau nhức cả đêm.', [
    ['nha_si', 'Đi nha sĩ', { w: 1.2 }, 'Ngồi trên ghế nha sĩ khóc như mưa, nhổ xong được thưởng que kem.', { hea: 2 }, 'neutral'],
    ['tron', 'Trốn, nói dối là hết đau', { w: 0.6 }, 'Giấu được ba ngày thì má sưng vù, bị lôi đi nha sĩ kèm một trận mắng.', { hea: -2, hap: -2 }, 'bad']]);
  KID('k_nuoi_tam', 7, 12, 'Hộp tằm trên bàn học', 'Cô giáo dặn cả lớp quan sát một con vật nhỏ. Bạn xin được mấy con tằm / mấy con cá bảy màu.', [
    ['cham', 'Chăm chỉ cho ăn, ghi nhật ký quan sát', { smart: 1 }, 'Ngày nào cũng ghi chép, bài thuyết trình được cô cho điểm 10.', { kno: 3, hap: 3 }, 'good'],
    ['quen', 'Mấy hôm đầu thì nhớ, sau thì quên', { w: 0.7 }, 'Quên cho ăn, mấy con tằm chết khô. Bạn buồn mất mấy ngày.', { hap: -2 }, 'neutral']], school);
  KID('k_mat_do_ban', 6, 11, 'Làm mất bút của bạn', 'Bạn mượn cây bút máy mới của bạn cùng bàn rồi làm rơi mất.', [
    ['nhan', 'Nhận lỗi, xin tiền tiết kiệm đền', { w: 1.2 }, 'Nhận lỗi và lấy tiền heo đất đền bạn. Hai đứa vẫn chơi thân.', { karma: 3 }, 'good'],
    ['giau', 'Giấu nhẹm, giả vờ không biết', { bad: 1 }, 'Giả vờ không biết. Mấy tuần sau bạn biết chuyện, giận cả học kỳ.', { karma: -3, soc: -3 }, 'bad']], school);
  KID('k_tiem_phong', 3, 6, 'Đi tiêm phòng', 'Đến lịch tiêm phòng, nhìn thấy kim tiêm là bạn muốn bỏ chạy.', [
    ['dung_cam', 'Nhắm mắt, nắm tay mẹ thật chặt', { w: 1 }, function (l) { return 'Nắm chặt tay ' + m(l) + ', tiêm xong mới khóc — được thưởng hộp sữa.'; }, { hea: 1 }, 'good'],
    ['khoc', 'Khóc ầm cả phòng tiêm', { w: 1 }, 'Khóc ầm lên, cô y tá phải dỗ mãi. Ra về được cho kẹo.', null, 'neutral']]);
  KID('k_ve_que_ngoai', 6, 12, 'Mùa hè về quê', 'Hè này được gửi về quê chơi với ông bà cả tháng.', [
    ['bat_ca', 'Theo anh em họ đi bắt cá, trèo cây', { soc: 1 }, 'Một tháng đen nhẻm vì nắng, biết bắt cá, bắt cào cào, leo cây ổi nhà hàng xóm.', { hap: 6, hea: 2 }, 'good'],
    ['nho_nha', 'Nhớ nhà, đòi về sớm', { w: 0.5 }, 'Nhớ nhà quá, khóc đòi về sớm. Lớn lên lại tiếc mùa hè ấy.', { hap: -1 }, 'neutral']], function (l) { return l.urban; });
  KID('k_ban_hang', 4, 8, 'Chơi bán hàng', 'Bạn bày một "cửa hàng" bằng lá cây, sỏi đá và đồ chơi cũ trước cửa.', [
    ['ban', 'Gọi các bạn trong xóm đến mua', { soc: 1 }, 'Cả buổi chiều mua bán bằng tiền lá cây, bạn "giàu" nhất xóm.', { hap: 4, soc: 2 }, 'good'],
    ['ba', 'Mời ông bà, bố mẹ đến mua', { w: 1 }, 'Cả nhà đóng vai khách, trả tiền bằng kẹo thật.', { hap: 4 }, 'good']]);
  KID('k_xe_dap', 6, 9, 'Tập đi xe đạp', function (l) { return b(l).charAt(0).toUpperCase() + b(l).slice(1) + ' tháo bánh phụ chiếc xe đạp, bảo bạn tập đi hai bánh.'; }, [
    ['tap', 'Tập đến khi đi được', { amb: 1 }, function (l) { return 'Ngã trầy cả hai đầu gối, đến khi quay lại thì ' + b(l) + ' đã buông tay từ lúc nào. Bạn tự đi được rồi!'; }, { hap: 5, hea: 1 }, 'good'],
    ['so', 'Sợ ngã, chưa dám', { w: 0.6 }, 'Sợ ngã, đòi lắp lại bánh phụ thêm một năm.', null, 'neutral']]);
  KID('k_ngu_trua', 5, 9, 'Trốn ngủ trưa', 'Trưa hè nắng chang chang, cả nhà ngủ say, bạn rón rén định trốn ra ngoài chơi.', [
    ['tron', 'Trốn ra bắt ve sầu', { risk: 1 }, function (l, r) { return r() < 0.5 ? 'Bắt được cả lọ ve sầu, về nhà lặng lẽ như chưa có gì.' : 'Vừa mở cổng thì bị ' + m(l) + ' gọi giật lại, phải nằm úp mặt vào tường.'; }, { hap: 2 }, 'neutral'],
    ['ngu', 'Nằm im rồi ngủ quên lúc nào không biết', { w: 1 }, 'Định trốn mà ngủ quên, tỉnh dậy đã chiều.', null, 'neutral']]);
  KID('k_tro_dan_gian', 5, 10, 'Trò chơi dân gian', 'Lũ trẻ trong xóm rủ nhau chơi sau giờ học.', [
    ['rong_ran', 'Rồng rắn lên mây', { soc: 1 }, 'Chơi rồng rắn lên mây đến khi trời tối mịt mới chịu về.', { hap: 4, soc: 2 }, 'good'],
    ['o_an_quan', 'Ô ăn quan, nhảy dây', { w: 1 }, 'Thắng liền ba ván ô ăn quan, oai cả xóm.', { hap: 3, kno: 1 }, 'good'],
    ['tron_tim', 'Trốn tìm', { w: 1 }, 'Trốn kỹ đến mức cả bọn bỏ về hết, bạn ngủ quên trong đống rơm.', { hap: 2 }, 'neutral']], function (l) { return isVN(l); });
  KID('k_truyen_tranh', 8, 13, 'Truyện tranh', 'Cả lớp đang mê bộ truyện tranh Doraemon / Thám tử lừng danh Conan.', [
    ['thue', 'Góp tiền ăn sáng thuê truyện', { w: 1 }, 'Nhịn ăn sáng để thuê truyện, đọc đến mức thuộc lòng từng tập.', { hap: 4, kno: 1 }, 'good'],
    ['len', 'Đọc lén trong giờ học', { risk: 1 }, function (l, r) { return r() < 0.5 ? 'Bị cô giáo tịch thu cả chồng truyện, cuối năm mới trả.' : 'Đọc lén trót lọt cả học kỳ.'; }, { hap: 2 }, 'neutral']], school);
  KID('k_tranh_tivi', 5, 12, 'Giành điều khiển tivi', 'Đúng giờ phim hoạt hình thì anh / chị đòi xem bóng đá.', [
    ['nhuong', 'Nhường', { w: 1 }, 'Nhường anh chị, được trả công bằng gói bim bim.', { karma: 1 }, 'good'],
    ['gianh', 'Giành bằng được', { risk: 1 }, 'Giành nhau đến mức cả hai cùng bị tắt tivi đi ngủ sớm.', { hap: -1 }, 'neutral']], function (l) { return (l.sibList || []).some(function (s) { return s.alive && s.born < 0; }); });
  KID('k_mua_da', 5, 12, 'Trận mưa đá', 'Lần đầu thấy mưa đá, những viên đá trắng rơi lộp bộp trên mái tôn.', [
    ['nhat', 'Chạy ra nhặt đá bỏ vào cốc', { risk: 0.6 }, 'Chạy ra nhặt mưa đá, bị một viên rơi trúng đầu, vẫn cười toe.', { hap: 3 }, 'good'],
    ['nhin', 'Đứng trong nhà nhìn ra', { w: 1 }, 'Đứng nép bên cửa sổ, tròn mắt nhìn trời rơi đá.', { hap: 1 }, 'neutral']]);
  KID('k_bai_van_me', 8, 11, 'Bài văn tả mẹ', 'Bài văn "Tả mẹ của em" của bạn được cô chọn đọc trước lớp.', [
    ['doc', 'Đứng lên đọc', { w: 1 }, 'Đọc đến câu cuối thì cả lớp im phăng phắc, cô giáo rơm rớm nước mắt.', { kno: 2, hap: 4 }, 'good'],
    ['nguong', 'Ngượng, xin cô đọc giúp', { w: 0.7 }, 'Cô đọc giúp, bạn cúi gằm mặt, tai đỏ ửng.', { kno: 1 }, 'neutral']], function (l) { return school(l) && l.fam.mAlive && isVN(l); });
  KID('k_an_co', 5, 12, 'Ăn cỗ đám cưới', 'Hàng xóm làm đám cưới, cả nhà được mời ăn cỗ.', [
    ['an', 'Ngồi mâm trẻ con, ăn hết phần gà', { w: 1 }, 'Ngồi mâm trẻ con tranh nhau từng miếng giò, về còn được gói kẹo cưới.', { hap: 4 }, 'good'],
    ['hat', 'Lên sân khấu hát tặng cô dâu chú rể', { soc: 1.2 }, 'Lên hát một bài, cả rạp vỗ tay, được lì xì phong bao đỏ.', { hap: 5, soc: 3 }, 'good']], function (l) { return isVN(l); });
  KID('k_co_do', 9, 14, 'Sao đỏ ghi tên', 'Sáng nay quên đeo khăn quàng đỏ, đội sao đỏ đứng ngay cổng trường.', [
    ['nhan', 'Thật thà nhận bị ghi tên', { w: 1 }, 'Bị ghi tên, lớp bị trừ điểm thi đua. Từ đó bạn treo khăn quàng ngay đầu giường.', { karma: 1 }, 'neutral'],
    ['muon', 'Chạy đi mượn khăn của em lớp dưới', { risk: 0.8 }, 'Mượn được khăn của em lớp dưới, thoát nạn trong gang tấc.', { hap: 1 }, 'neutral']], function (l) { return isVN(l) && school(l) && l.flags.doi && l.age <= 14; });
  KID('k_cho_duoi', 6, 12, 'Bị chó đuổi', 'Đi học về qua ngõ, con chó nhà hàng xóm sổng xích lao ra.', [
    ['chay', 'Chạy thục mạng', { w: 1 }, 'Chạy một mạch về nhà, rơi mất một chiếc dép.', { hap: -1 }, 'neutral'],
    ['dung', 'Đứng im như bố dặn', { smart: 1 }, 'Đứng im, con chó sủa mấy tiếng rồi bỏ đi. Bạn tự hào cả tuần.', { kno: 1 }, 'good']]);
  KID('k_bau_lop_truong', 8, 14, 'Bầu lớp trưởng', 'Đầu năm học, cô cho cả lớp bầu lớp trưởng. Có bạn đề cử tên bạn.', [
    ['nhan', 'Nhận lời ứng cử', { amb: 1 }, function (l, r) { return r() < 0.5 ? 'Trúng cử lớp trưởng với đa số phiếu, oai lắm!' : 'Thua sít sao, được làm lớp phó học tập.'; }, { soc: 3 }, 'good'],
    ['tu_choi', 'Từ chối, ngại lắm', { w: 0.7 }, 'Từ chối vì ngại đứng trước lớp.', null, 'neutral']], school);
  KID('k_sach_cu', 6, 14, 'Sách cũ đầu năm học', 'Đầu năm học, nhà không đủ tiền mua sách mới.', [
    ['cu', 'Dùng sách cũ của anh chị, bọc lại thật đẹp', { w: 1 }, 'Bọc sách cũ bằng giấy báo, dán nhãn nắn nót, trông chẳng kém sách mới.', { karma: 1 }, 'neutral'],
    ['xin', 'Đăng ký mượn sách ở thư viện trường', { smart: 1 }, 'Mượn sách thư viện, từ đó mê luôn góc đọc sách của trường.', { kno: 2 }, 'good']], function (l) { return school(l) && l.fam.q <= 2; });
  KID('k_ban_chuyen_truong', 8, 14, 'Bạn thân chuyển trường', 'Bạn thân nhất báo sắp theo bố mẹ chuyển vào Nam / ra Bắc.', [
    ['thu', 'Hứa viết thư, nhắn tin mỗi tuần', { soc: 1 }, 'Hai đứa nhắn tin đều đặn, mấy năm sau vẫn giữ liên lạc.', { soc: 2 }, 'good'],
    ['khoc', 'Khóc cả buổi chia tay', { w: 1 }, 'Ôm nhau khóc ở cổng trường. Từ đó lớp học bỗng rộng thênh thang.', { hap: -4 }, 'neutral']], function (l) { return !!(l.bff && l.bff.alive) && school(l); });
  KID('k_trong_em', 8, 14, 'Trông em giúp mẹ', function (l) { return m(l).charAt(0).toUpperCase() + m(l).slice(1) + ' bận việc, nhờ bạn trông em cả buổi chiều.'; }, [
    ['trong', 'Trông em cẩn thận', { w: 1.2 }, 'Dỗ em ngủ, cho em ăn, chơi cùng em cả buổi. Được khen như người lớn.', { karma: 2, soc: 1 }, 'good'],
    ['choi', 'Để em tự chơi, mình xem điện thoại', { w: 0.6 }, 'Mải xem điện thoại, em ngã u đầu. Bị mắng một trận nhớ đời.', { hap: -3 }, 'bad']], function (l) { return (l.sibList || []).some(function (s) { return s.alive && s.born > 0 && l.age - s.born <= 5 && l.age - s.born >= 1; }); });
  KID('k_thich_mon', 12, 14, 'Thầy cô tâm huyết', 'Năm nay có thầy / cô dạy môn mới rất truyền cảm hứng.', [
    ['hoc', 'Chăm học môn đó hơn hẳn', { smart: 1 }, 'Từ ghét môn học thành mê, cuối năm được điểm cao nhất lớp môn đó.', { kno: 4, hap: 2 }, 'good'],
    ['thuong', 'Học bình thường', { w: 0.8 }, 'Học bình thường, nhưng nhớ mãi những câu chuyện thầy cô kể.', { kno: 1 }, 'neutral']], school);
  KID('k_ong_ba_ke', 5, 10, 'Ông bà kể chuyện ngày xưa', 'Tối nào ông bà cũng kể chuyện ngày xưa: chiến tranh, đói kém, những ngày đi sơ tán.', [
    ['nghe', 'Ngồi nghe say sưa', { w: 1.2 }, 'Nghe ông bà kể chuyện đến khuya, thương ông bà hơn.', { kno: 2, soc: 2 }, 'good'],
    ['ngu', 'Nghe được một lúc thì ngủ', { w: 0.8 }, 'Lần nào cũng ngủ ở đoạn hay nhất.', null, 'neutral']], function (l) { return isVN(l); });
  KID('k_om_chao', 4, 10, 'Ốm được nằm nhà', 'Bị sốt phải nghỉ học, được nằm nhà.', [
    ['chao', 'Được nấu cháo hành, đắp chăn', { w: 1 }, function (l) { return m(l).charAt(0).toUpperCase() + m(l).slice(1) + ' nấu bát cháo hành nóng hổi, ngồi bên cạnh cả buổi. Vị cháo ấy bạn nhớ mãi.'; }, { hea: 1, hap: 2 }, 'good']]);
  KID('k_nhom_hoc', 11, 14, 'Nhóm học tập', 'Mấy bạn rủ lập nhóm học cuối tuần ở nhà một bạn.', [
    ['hoc', 'Học thật', { smart: 1 }, 'Cả nhóm học chăm, kỳ thi cùng nhau lên điểm.', { kno: 3, soc: 2 }, 'good'],
    ['choi', '"Học nhóm" nhưng chủ yếu là chơi', { soc: 1 }, '"Học nhóm" mà cả buổi chơi game và ăn vặt.', { hap: 3, soc: 2 }, 'neutral']], school);
  KID('k_ngoai_khoa', 7, 12, 'Lớp ngoại khóa', 'Trường mở các lớp ngoại khóa: đàn, vẽ, võ, cờ vua.', [
    ['dan', 'Học đàn organ', { w: 1 }, 'Học đàn, cuối năm biểu diễn một bài trong lễ tổng kết.', { kno: 2, hap: 3 }, 'good'],
    ['vo', 'Học võ', { w: 1 }, 'Học võ, khỏe hẳn ra, không còn sợ bị bắt nạt.', { hea: 3 }, 'good'],
    ['co', 'Học cờ vua', { smart: 1 }, 'Học cờ vua, thắng được cả bố.', { kno: 3 }, 'good']], function (l) { return school(l) && l.fam.q >= 3; });
  KID('k_cam_trai', 12, 14, 'Cắm trại của trường', 'Trường tổ chức cắm trại ba ngày hai đêm.', [
    ['di', 'Đi cắm trại', { soc: 1 }, 'Dựng lều, đốt lửa trại, hát đến khuya. Đêm cuối cả lớp ôm nhau khóc vì sắp lên cấp ba.', { hap: 6, soc: 4 }, 'good'],
    ['o_nha', 'Ở nhà vì sợ muỗi', { w: 0.5 }, 'Ở nhà, xem ảnh các bạn đăng mà tiếc hùi hụi.', { hap: -2 }, 'neutral']], school);
  KID('k_bong_da_dem', 6, 14, 'Xem bóng đá đêm khuya', 'Đội tuyển đá trận chung kết lúc nửa đêm.', [
    ['thuc', function (l) { return 'Thức xem cùng ' + b(l); }, { w: 1 }, function (l, r) { return r() < 0.5 ? 'Đội tuyển thắng! Cả xóm đổ ra đường đi bão, bạn ngồi sau xe ' + b(l) + ' cầm cờ đỏ sao vàng.' : 'Đội tuyển thua, ' + b(l) + ' thở dài, bạn ngủ gục trên ghế.'; }, { hap: 4 }, 'good'],
    ['ngu', 'Đi ngủ sớm', { w: 0.6 }, 'Ngủ sớm, sáng ra nghe cả xóm kể lại.', null, 'neutral']], function (l) { return isVN(l) && (l.fam.fAlive || l.fam.mAlive); });
  KID('k_mon_qua_co', 7, 11, 'Ngày Nhà giáo Việt Nam', 'Ngày 20/11, cả lớp chuẩn bị quà tặng cô giáo chủ nhiệm.', [
    ['thiep', 'Tự làm thiệp tặng cô', { w: 1.2 }, 'Tự vẽ tấm thiệp tặng cô, cô giữ trên bàn làm việc cả năm.', { hap: 3, karma: 1 }, 'good'],
    ['hoa', 'Xin tiền mua hoa', { w: 1 }, 'Mua bó hoa tặng cô, đứng lắp bắp mãi mới nói được câu chúc.', { hap: 2 }, 'good']], function (l) { return isVN(l) && school(l); });

  KID('k_rung_rang', 5, 7, 'Chiếc răng sữa đầu tiên', 'Chiếc răng cửa lung lay mấy hôm, sáng nay ăn cơm thì rơi ra.', [
    ['nem', 'Ném lên mái nhà như bà dặn', { w: 1.2 }, 'Ném răng lên mái nhà, ước răng mới mọc nhanh và đều như răng chuột.', { hap: 3 }, 'good'],
    ['giu', 'Cất vào hộp làm kỷ niệm', { w: 0.8 }, 'Cất chiếc răng vào hộp diêm, cười móm mém khoe cả xóm.', { hap: 2 }, 'neutral']], function (l) { return isVN(l); });
  KID('k_hoc_boi', 6, 11, 'Học bơi mùa hè', 'Mùa hè này được cho đi học bơi.', [
    ['hoc', 'Chăm chỉ tập', { w: 1.2 }, 'Uống no nước mấy buổi đầu, đến cuối khóa đã bơi được 25 mét. Biết bơi — kỹ năng giữ mạng cả đời.', { hea: 3, hap: 3 }, 'good'],
    ['so', 'Sợ nước, khóc không chịu xuống', { w: 0.5 }, 'Sợ nước, cả khóa chỉ dám đứng ở chỗ nông.', null, 'neutral']], function (l) { return l.urban || l.fam.q >= 3; });
  KID('k_tham_quan', 7, 12, 'Chuyến tham quan của lớp', 'Lớp tổ chức đi tham quan vườn thú / bảo tàng / khu di tích.', [
    ['di', 'Đi cùng cả lớp', { soc: 1 }, 'Lần đầu thấy con voi thật, về kể cả tuần không hết chuyện. Say xe cả lượt đi.', { hap: 5, kno: 2, soc: 2 }, 'good'],
    ['o_nha', 'Ở nhà vì nhà không có tiền đóng', { w: 0.4 }, 'Không được đi, ngồi nghe các bạn kể mà chạnh lòng.', { hap: -3 }, 'neutral']], school);
  KID('k_ke_hoach_nho', 7, 12, 'Kế hoạch nhỏ', 'Liên đội phát động phong trào "Kế hoạch nhỏ" thu gom giấy vụn.', [
    ['gom', 'Đi gom giấy báo cũ khắp xóm', { amb: 1 }, 'Gom được cả bao tải giấy vụn, lớp bạn đứng nhất trường.', { karma: 2, soc: 2 }, 'good'],
    ['vo', 'Lấy luôn sách vở cũ của anh chị nộp', { risk: 0.6 }, 'Lấy nhầm cả quyển vở anh chị đang dùng, bị mắng một trận.', null, 'neutral']], function (l) { return isVN(l) && school(l); });
  KID('k_nhat_ky', 10, 14, 'Cuốn nhật ký có khóa', 'Bạn bắt đầu viết nhật ký vào một cuốn sổ có ổ khóa nhỏ.', [
    ['viet', 'Viết đều mỗi tối', { w: 1 }, 'Viết nhật ký mỗi tối, mấy chục năm sau đọc lại vẫn còn bật cười.', { hap: 2, kno: 1 }, 'good'],
    ['bi_doc', 'Giấu dưới gối', { w: 0.8 }, function (l) { return 'Một hôm thấy ổ khóa bị cạy — hóa ra ' + ((l.sibList || []).some(function (s) { return s.alive; }) ? 'anh chị em' : m(l)) + ' đọc trộm. Giận cả tuần.'; }, { hap: -2 }, 'neutral']]);
  KID('k_ga_con', 5, 10, 'Đàn gà con', 'Ông bà mua cho đàn gà con lông vàng.', [
    ['cham', 'Ngày nào cũng cho gà ăn', { w: 1 }, 'Chăm đàn gà lớn phổng phao, Tết đến được ông bà cho một con mang ra chợ bán lấy tiền mua truyện.', { karma: 1, hap: 3 }, 'good'],
    ['nhot', 'Nhốt gà vào hộp mang đi chơi', { risk: 0.8 }, 'Mang gà con đi khoe cả xóm, về thì mất một con. Khóc cả chiều.', { hap: -2 }, 'neutral']], function (l) { return !l.urban; });

  // giảm tần suất những chuyện tuổi thơ quen thuộc nhất để mỗi đời mỗi khác
  E.TRIG.forEach(function (t) { if (/^(sinh_nhat|li_xi|thu_cung|choi_le_hoi|trung_thu|vo_binh|he_nay|do_choi)$/.test(t.id) && t.child) t.cw = typeof t.cw === 'function' ? (function (f) { return function (l, a) { return f(l, a) * 0.5; }; })(t.cw) : (t.cw || 1) * 0.5; });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
