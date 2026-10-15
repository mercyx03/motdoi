/* Một Đời — v3.8 (góp ý của người chơi):
   · concert các chương trình "Say Hi" / Anh tài theo từng mùa: chọn chương trình → hiện toàn bộ nghệ sĩ → chọn bias để ủng hộ
   · fanmeeting: mua vé, có thể được thần tượng gọi tên, chụp ảnh, hỏi han, tặng quà; nhiều chuyện làm fan (sinh nhật idol, cày vote, photocard, đón sân bay…)
   · đã học võ / học bơi / sơ cứu thì về sau có lúc dùng đến (cứu người bị bắt nạt, cứu người đuối nước…); có năng khiếu thì có dịp thể hiện
   · tương tác theo trend: mua trà sữa cho người yêu, vợ / chồng, anh chị em (chọn món), rủ bạn đi ăn Dookki, gà rán, mì cay, Haidilao, Cửu Vân Long…
   · bị giam trong trại lừa đảo thì không chi tiêu, mua sắm, đi chơi được · người cao tuổi không còn bị "đi học chứng chỉ" */
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
  function pay(l, tr, why) { var x = Math.min(V(l, tr), Math.max(0, l.money) + l.base * 0.3); if (x > 0) H.cash(l, -x, why); return x; }
  function yr(l) { return l.birthYear + l.age; }
  function T(id, when, p, cd, max) { E.TRIG.push({ id: id, when: function (l, a) { return free(l) && when(l, a); }, p: p, cd: cd || 4, max: max || 1 }); }
  function shuffle(r, a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  // ===================================================================
  // 0. SỬA LOGIC: tuổi già không "đi học chứng chỉ"; trại lừa đảo khóa mọi chi tiêu
  // ===================================================================
  var MAXAGE = { hoc_them: 60, thi_lai_cc: 60, bang_lai: 70, cay_thue_them: 35, chuyen_noi_o: 80 };
  E.ACT.forEach(function (a) { if (MAXAGE[a.id] != null && (a.max == null || a.max > MAXAGE[a.id])) a.max = MAXAGE[a.id]; });

  // ===================================================================
  // 1. CONCERT THEO CHƯƠNG TRÌNH, CHỌN BIAS
  // ===================================================================
  var SHOWS = E.SHOWS || [];
  function showsOpen(l) { var y = yr(l); return SHOWS.filter(function (s) { return y >= s.from && y - s.b <= 50; }); }
  function showByK(k) { return SHOWS.filter(function (s) { return s.k === k; })[0]; }
  SC('show_chon', {
    title: 'Concert chương trình nào?', text: function (l) { return 'Các chương trình truyền hình thực tế âm nhạc tổ chức concert liên tục. Bạn muốn đi concert của chương trình nào?' + (l.bias ? ' Bias hiện tại của bạn: ' + l.bias.n + ' (' + l.bias.show + ').' : ''); },
    opts: [0, 1, 2, 3, 4, 5].map(function (i) {
      return { k: 's' + i, l: function (l) { var s = showsOpen(l)[i]; return s ? s.n : ''; }, h: function (l) { var s = showsOpen(l)[i]; return s ? s.m.length + ' nghệ sĩ · ' + s.m.slice(0, 4).join(', ') + '…' : ''; }, req: function (l) { return !!showsOpen(l)[i]; }, ai: { w: 1 },
        run: function (l, r, log) { var s = showsOpen(l)[i]; l.pending.unshift(E.DEC.bias_chon.make(l, r, { k: s.k, p: 0 })); } };
    }).concat([{ k: 'no', l: 'Thôi, để dịp khác', ai: { w: 0.2 }, run: function () { } }])
  });
  var PER = 10;
  SC('bias_chon', {
    title: function (l, d) { return 'Bias của bạn ở ' + d.s.n; },
    prep: function (l, r, arg) { var s = showByK(arg && arg.k) || SHOWS[0], p = (arg && arg.p) || 0; return { s: s, p: p, m: s.m.slice(p * PER, p * PER + PER) }; },
    text: function (l, d) { return 'Đội hình ' + d.s.n + ' có ' + d.s.m.length + ' ' + d.s.pre + '. Bạn "đu" ai nhất, muốn cầm banner, lightstick cổ vũ ai? (' + (d.p * PER + 1) + '–' + Math.min(d.s.m.length, d.p * PER + PER) + ' / ' + d.s.m.length + ')'; },
    opts: Array.apply(null, Array(PER)).map(function (_, i) {
      return { k: 'b' + i, l: function (l, d) { return d.m[i] ? U.cap(d.s.pre) + ' ' + d.m[i] : ''; }, req: function (l, d) { return !!d.m[i]; }, ai: { w: 1 },
        run: function (l, r, log, d) { pickBias(l, r, log, d.s, d.m[i]); } };
    }).concat([
      { k: 'more', l: 'Xem thêm các nghệ sĩ khác ›', req: function (l, d) { return d.s.m.length > (d.p + 1) * PER; }, ai: { w: 0.3 }, run: function (l, r, log, d) { l.pending.unshift(E.DEC.bias_chon.make(l, r, { k: d.s.k, p: d.p + 1 })); } },
      { k: 'back', l: '‹ Xem lại từ đầu', req: function (l, d) { return d.p > 0; }, ai: { w: 0 }, run: function (l, r, log, d) { l.pending.unshift(E.DEC.bias_chon.make(l, r, { k: d.s.k, p: 0 })); } },
      { k: 'all', l: 'Thương hết cả đội hình (all-kill)', ai: { w: 0.4 }, run: function (l, r, log, d) { l.bias = { n: 'cả đội hình', show: d.s.n, all: true }; log('Không chọn được — thương hết cả ' + d.s.m.length + ' ' + d.s.pre + ' của ' + d.s.n + '.', 'neutral'); l.pending.unshift(E.DEC.concert_di.make(l, r, { cat: 'show', name: d.s.n })); } }
    ])
  });
  function pickBias(l, r, log, s, name) {
    var was = l.bias && l.bias.n;
    l.bias = { n: name, show: s.n, pre: s.pre }; l.idol = s.pre + ' ' + name; l.idolCat = 'show'; l.idolBorn = s.b;
    log(was && was !== name ? 'Chuyển bias sang ' + s.pre + ' ' + name + ' — "đu" thêm một người nữa thôi mà.' : 'Chọn ' + s.pre + ' ' + name + ' làm bias, cày view, bình chọn nhiệt tình.', 'good'); fx(l, { hap: 2 });
    l.pending.unshift(E.DEC.concert_di.make(l, r, { cat: 'show', name: s.n }));
  }
  if (E.DEC.concert_chon) E.DEC.concert_chon.def.opts.forEach(function (o) { if (o.k === 'show') o.run = function (l, r) { l.pending.unshift(E.DEC.show_chon.make(l, r)); }; });
  // vào concert: cổ vũ bias, đôi khi được "fan service"
  var cda = E.DEC.concert_di.apply;
  E.DEC.concert_di.apply = function (l, d, k, r, log) {
    var went = false, lg = function (t, kk) { if (/Săn được vé|kịp đi xem|đưa bạn đi xem|rủ bạn đi xem|Đi xem /.test(t)) went = true; log(t, kk); };
    var x = cda.call(this, l, d, k, r, lg);
    if (went && l.bias && !l.bias.all && d.data.cat === 'show' && l.bias.show === d.data.name) {
      if (ch(r, 0.12)) { log(U.cap(l.bias.pre || 'anh trai') + ' ' + l.bias.n + ' nhìn thấy tấm banner bạn giơ, chỉ thẳng xuống và bắn tim! Bạn hét đến lạc giọng.', 'big'); fx(l, { hap: 8 }); H.mem(l, 'Khoảnh khắc ' + l.bias.n + ' bắn tim về phía mình giữa biển lightstick.', 7); }
      else { log('Cả đêm giơ cao banner tên ' + l.bias.n + ', hát theo từng bài của bias.', 'good'); fx(l, { hap: 2 }); }
    }
    return x;
  };

  // ===================================================================
  // 2. FANMEETING & CHUYỆN LÀM FAN
  // ===================================================================
  function idolName(l) { return l.idol || 'thần tượng'; }
  function vnIdol(l) { return /^(vn|show|rapvn)$/.test(l.idolCat || 'vn'); }
  SC('fanmeeting', {
    title: 'Fanmeeting của thần tượng', valid: function (l) { return !!l.idol; },
    prep: function (l, r) { var vn = vnIdol(l) || !vnd(l); return { city: vnd(l) ? pick(r, ['TP. Hồ Chí Minh', 'Hà Nội']) : (l.place || l.city || 'thành phố'), vip: vn ? 3.5 : 6, thuong: vn ? 1.2 : 2.5 }; },
    text: function (l, d) { return U.cap(idolName(l)) + ' tổ chức fanmeeting ở ' + d.city + ': hát, chơi trò chơi với fan, bốc thăm gọi tên fan lên sân khấu. Vé thường khoảng ' + mo(l, V(l, d.thuong)) + ', vé VIP (hi-touch, chụp ảnh nhóm, quà) khoảng ' + mo(l, V(l, d.vip)) + '.' + (l.age < 16 ? ' Bạn còn nhỏ, phải xin bố mẹ.' : ''); },
    opts: [
      { k: 'vip', l: 'Săn vé VIP', h: function (l, d) { return '~' + mo(l, V(l, d.vip)) + ' · cơ hội được gọi tên cao hơn'; }, ai: { w: 0.8, risk: 0.4 }, run: function (l, r, log, d) { fm(l, r, log, d, 'vip'); } },
      { k: 'thuong', l: 'Mua vé thường', h: function (l, d) { return '~' + mo(l, V(l, d.thuong)); }, ai: { w: 1.1 }, run: function (l, r, log, d) { fm(l, r, log, d, 'thuong'); } },
      { k: 'khong', l: 'Xem livestream, để dành tiền', ai: { w: 0.7 }, run: function (l, r, log) { log('Xem livestream fanmeeting, chụp màn hình lúc ' + idolName(l) + ' cười.', 'neutral'); fx(l, { hap: 1 }); } }
    ]
  });
  function fm(l, r, log, d, t) {
    if (ch(r, t === 'vip' ? 0.35 : 0.2)) { log('Canh mở bán vé fanmeeting ' + idolName(l) + ' — vé hết sạch sau 2 phút. Bạn ôm điện thoại thẫn thờ.', 'bad'); fx(l, { hap: -4 }); return; }
    pay(l, t === 'vip' ? d.vip : d.thuong, 'Vé fanmeeting ' + idolName(l));
    var lucky = ch(r, t === 'vip' ? 0.22 : 0.07);
    if (!lucky) { log('Đi fanmeeting ' + idolName(l) + ' ở ' + d.city + (t === 'vip' ? ', được hi-touch và chụp ảnh nhóm' : '') + '. Về nhà vẫn còn cười một mình.', 'good'); fx(l, { hap: t === 'vip' ? 8 : 6 }); return; }
    var fs = pick(r, [
      U.cap(idolName(l)) + ' bốc thăm trúng số ghế của bạn, gọi tên bạn lên sân khấu, hỏi: "Em đi một mình hay đi với bạn?", rồi ôm bạn chụp một tấm ảnh polaroid ký tên tặng.',
      'Bạn được gọi tên lên chơi trò chơi cùng ' + idolName(l) + '. Thua cuộc, ' + idolName(l) + ' cười xòa rồi vẫn tặng bạn món quà tự tay chuẩn bị.',
      'Đến lượt hi-touch, ' + idolName(l) + ' nhớ ra bạn: "Em là người hay cầm banner màu vàng đúng không?" Bạn đứng hình mất mấy giây.',
      U.cap(idolName(l)) + ' đọc to lá thư bạn viết trên sân khấu, cảm ơn bạn đã ủng hộ từ những ngày đầu, rồi ký tên lên áo bạn.'
    ]);
    log(fs, 'big'); fx(l, { hap: 14, soc: 2 }); l.flags.fanService = (l.flags.fanService || 0) + 1;
    H.mem(l, 'Ngày được ' + idolName(l) + ' gọi tên ở fanmeeting — tấm ảnh ấy giữ mãi trong ví.', 8);
  }
  T('fanmeeting', function (l, a) { return !!l.idol && a >= 13 && a <= 45 && !(l.abroad && !l.abroad.perm); }, 0.03, 4, 1);
  A('fanmeeting', 'Giải trí', 'Đi fanmeeting thần tượng', { min: 12, max: 45, sc: 'fanmeeting', avail: function (l) { return l.idol ? true : 'Chưa có thần tượng — thử đi xem concert trước'; } });

  var FAN = [
    ['fan_sinh_nhat', 'Sinh nhật thần tượng', function (l) { return 'Sắp đến sinh nhật ' + idolName(l) + '. Fandom góp tiền thuê màn hình LED ở trung tâm thành phố, làm từ thiện dưới tên thần tượng.'; }, [
      ['gop', 'Góp tiền vào fan project', { w: 1.1 }, function (l, r, log) { pay(l, 0.3, 'Góp fan project'); log('Màn hình LED chạy dòng chữ chúc mừng sinh nhật ' + idolName(l) + ', fandom còn quyên góp xây cầu cho trẻ em vùng cao. ' + U.cap(idolName(l)) + ' đăng ảnh cảm ơn fan.', 'good'); fx(l, { hap: 4, karma: 2 }); }],
      ['tim', 'Chỉ đăng bài chúc mừng, thả tim', { w: 0.8 }, function (l, r, log) { log('Đăng bài chúc mừng sinh nhật ' + idolName(l) + ' kèm loạt ảnh tự chỉnh.', 'neutral'); fx(l, { hap: 1 }); }]]],
    ['fan_vote', 'Cày vote đêm chung kết', function (l) { return 'Bảng bình chọn đang sát nút. Fandom kêu gọi cày vote cho ' + idolName(l) + ' đến 2 giờ sáng.'; }, [
      ['cay', 'Thức cày vote cùng fandom', { w: 1 }, function (l, r, log) { fx(l, { hea: -1 }); if (ch(r, 0.5)) { log('Thức trắng cày vote — ' + idolName(l) + ' giành giải! Cả nhóm chat hét lên lúc 3 giờ sáng.', 'good'); fx(l, { hap: 6 }); } else log('Cày vote cả đêm nhưng ' + idolName(l) + ' về nhì. Sáng ra đi học / đi làm mắt thâm quầng.', 'neutral'); }],
      ['ngu', 'Vote vài lượt rồi đi ngủ', { w: 0.8 }, function (l, r, log) { log('Vote vài lượt rồi đi ngủ — sức khỏe quan trọng hơn.', 'neutral'); }]]],
    ['fan_photocard', 'Photocard bias', function (l) { return 'Album mới của ' + idolName(l) + ' có photocard ngẫu nhiên. Bạn muốn có tấm của ' + (l.bias && !l.bias.all ? l.bias.n : 'bias') + '.'; }, [
      ['mua_nhieu', 'Mua cả chục album cho trúng', { risk: 0.8, w: 0.6 }, function (l, r, log) { pay(l, 3, 'Mua album'); log(ch(r, 0.4) ? 'Bóc đến album thứ 9 thì trúng tấm photocard bias — giữ như báu vật.' : 'Mua 10 album mà toàn trúng thành viên khác. Đành đem đi trao đổi trên hội nhóm.', 'neutral'); fx(l, { hap: 2 }); }],
      ['doi', 'Mua 1 album, lên hội nhóm trao đổi', { w: 1.2 }, function (l, r, log) { pay(l, 0.35, 'Mua album'); log('Mua một album rồi lên hội nhóm đổi photocard — quen thêm mấy bạn cùng fandom.', 'good'); fx(l, { soc: 2 }); }]]],
    ['fan_san_bay', 'Đón thần tượng ở sân bay', function (l) { return U.cap(idolName(l)) + ' sắp về đến sân bay. Fandom rủ nhau ra đón, cầm hoa, cầm banner.'; }, [
      ['van_minh', 'Ra đón, đứng đúng khu vực, không chen lấn', { w: 1.2 }, function (l, r, log) { log('Đứng sau hàng rào, vẫy tay. ' + U.cap(idolName(l)) + ' cúi chào fan rồi lên xe. Văn minh mà vẫn vui.', 'good'); fx(l, { hap: 4 }); }],
      ['chen', 'Chen lên phía trước cho bằng được', { risk: 0.8, w: 0.4 }, function (l, r, log) { log('Chen lấn xô đẩy, bị bảo vệ sân bay nhắc nhở, ảnh chen lấn còn lên báo. Fandom đăng đàn xin lỗi.', 'bad'); fx(l, { hap: -3, karma: -2 }); }]]],
    ['fan_war', 'Cãi nhau trên mạng', function (l) { return 'Trên mạng có người chê bai ' + idolName(l) + ' rất khó nghe, fandom kêu gọi "đi cãi".'; }, [
      ['ke', 'Kệ, report rồi lướt qua', { w: 1.2 }, function (l, r, log) { log('Report bình luận ác ý rồi lướt qua. Tâm trạng vẫn tốt.', 'neutral'); }],
      ['cai', 'Lao vào cãi tay đôi', { risk: 0.6, w: 0.6 }, function (l, r, log) { log('Cãi nhau đến nửa đêm, bị chụp màn hình bêu riếu. Mệt cả người.', 'bad'); fx(l, { hap: -3 }); if (l.mind) l.mind.stress += 5; }]]]
  ];
  FAN.forEach(function (f) {
    SC(f[0], { title: f[1], valid: function (l) { return !!l.idol; }, text: f[2], opts: f[3].map(function (o) { return { k: o[0], l: o[1], ai: o[2], run: o[3] }; }) });
    T(f[0], function (l, a) { return !!l.idol && a >= 13 && a <= 30; }, 0.02, 4, 1);
  });

  // ===================================================================
  // 3. KỸ NĂNG ĐÃ HỌC → CÓ LÚC DÙNG ĐẾN · NĂNG KHIẾU → CÓ DỊP THỂ HIỆN
  // ===================================================================
  function setSkill(l, k) { (l.skills = l.skills || {})[k] = l.age; }
  function has(l, k) { return !!(l.skills && l.skills[k] != null); }
  E.hasSkill = has;
  function wrapOpt(id, key, k) { var D = E.DEC[id]; if (!D) return; D.def.opts.forEach(function (o) { if (o.k === key) { var r0 = o.run; o.run = function (l) { setSkill(l, k); return r0.apply(this, arguments); }; } }); }
  wrapOpt('k_hoc_boi', 'hoc', 'boi'); wrapOpt('k_ngoai_khoa', 'vo', 'vo');
  // nghề y, cứu hộ, công an, quân đội thì biết sơ cứu; vận động viên thì biết bơi; năng khiếu thể thao thì phần lớn biết bơi
  E.HOOKS.year.push(function (l, r, log, a) {
    if (!l.job) return; var j = E.resolveJob(l.job.id);
    if (/^(bac_si|dieu_duong|nha_si|cong_an|quan_doi|pt_gym|hlv_tt)$/.test(j) && !has(l, 'so_cuu')) setSkill(l, 'so_cuu');
    if (/^(cong_an|quan_doi)$/.test(j) && !has(l, 'vo')) setSkill(l, 'vo');
    if (/^(ngu_dan|thuyen_vien)$/.test(j) && !has(l, 'boi')) setSkill(l, 'boi');
  });
  SC('hoc_ky_nang', {
    title: 'Học một kỹ năng', text: function (l) { return 'Bạn muốn học thêm một kỹ năng có ích cho bản thân — biết đâu có ngày dùng đến.'; },
    opts: [
      { k: 'boi', l: 'Học bơi', h: function (l) { return '~' + mo(l, V(l, 1.5)) + ' · biết bơi là biết giữ mạng'; }, req: function (l) { return !has(l, 'boi'); }, ai: { w: 1 }, run: function (l, r, log) { pay(l, 1.5, 'Học bơi'); setSkill(l, 'boi'); fx(l, { hea: 2 }); log('Học bơi một khóa: từ chỗ sợ nước đến bơi được 50 mét.', 'good'); } },
      { k: 'vo', l: 'Học võ (Vovinam, karate, taekwondo…)', h: function (l) { return '~' + mo(l, V(l, 3)) + ' / năm'; }, req: function (l) { return !has(l, 'vo'); }, ai: { w: 1 }, run: function (l, r, log) { pay(l, 3, 'Học võ'); setSkill(l, 'vo'); fx(l, { hea: 3, hap: 2 }); log('Theo lớp võ cả năm, lên đai, người rắn chắc hẳn ra.', 'good'); } },
      { k: 'so_cuu', l: 'Học sơ cứu, hồi sức tim phổi (CPR)', h: function (l) { return '~' + mo(l, V(l, 0.8)); }, req: function (l) { return !has(l, 'so_cuu'); }, ai: { w: 0.8, smart: 0.6 }, run: function (l, r, log) { pay(l, 0.8, 'Học sơ cứu'); setSkill(l, 'so_cuu'); fx(l, { kno: 1 }); log('Học sơ cứu: ép tim, hà hơi thổi ngạt, xử lý hóc dị vật.', 'good'); } },
      { k: 'no', l: 'Thôi, để khi khác', ai: { w: 0.5 }, run: function () { } }
    ]
  });
  A('hoc_ky_nang', 'Sức khỏe & tâm hồn', 'Học bơi / học võ / học sơ cứu', { min: 8, max: 60, sc: 'hoc_ky_nang', avail: function (l) { return has(l, 'boi') && has(l, 'vo') && has(l, 'so_cuu') ? 'Đã biết cả ba' : true; } });

  SC('kn_bat_nat', {
    title: 'Chuyện bất bình', text: function (l) { return 'Trên đường về, bạn thấy một nhóm thanh niên đang vây đánh, giật đồ của một ' + (l.age < 20 ? 'bạn học sinh nhỏ con' : 'cậu sinh viên') + '. Người qua đường đứng nhìn, không ai dám can.' + (has(l, 'vo') ? ' Những năm học võ chợt hiện về trong đầu.' : ''); },
    opts: [
      { k: 'vo', l: function (l) { return has(l, 'vo') ? 'Dùng võ đã học, xông vào can' : 'Xông vào can'; }, ai: { w: 1, risk: 0.5 }, run: function (l, r, log) {
        if (ch(r, has(l, 'vo') ? 0.85 : 0.35)) { log((has(l, 'vo') ? 'Vài đường khóa tay gọn gàng, đám kia bỏ chạy.' : 'Liều mạng lao vào, may mà đám kia hoảng bỏ chạy.') + ' Cậu bé rối rít cảm ơn; công an phường đến ghi nhận, sau đó còn gửi giấy khen "hành động dũng cảm".', 'big'); fx(l, { karma: 6, hap: 6 }); H.mem(l, 'Ngày đứng ra bảo vệ người bị bắt nạt giữa phố.', 6); }
        else { log('Lao vào can nhưng bị đánh trả, rách môi, bầm tím. Người bị hại thì thoát được. Đau mà không hối hận.', 'bad'); fx(l, { hea: -6, karma: 4 }); } } },
      { k: 'goi', l: 'Gọi 113, quay video làm bằng chứng', ai: { w: 1.1, smart: 1 }, run: function (l, r, log) { log('Gọi 113 và quay lại toàn bộ. Công an đến nhanh, nhờ đoạn video mà bắt được cả nhóm.', 'good'); fx(l, { karma: 4 }); } },
      { k: 'di', l: 'Lặng lẽ đi qua', ai: { w: 0.4 }, run: function (l, r, log) { log('Lặng lẽ đi qua. Tối về cứ nghĩ mãi về đôi mắt hoảng sợ ấy.', 'neutral'); fx(l, { hap: -3 }); } }
    ]
  });
  T('kn_bat_nat', function (l, a) { return a >= 14 && a <= 55; }, function (l) { return has(l, 'vo') ? 0.025 : 0.004; }, 8, 1);

  SC('kn_duoi_nuoc', {
    title: 'Có người đuối nước', text: function (l) { return 'Đi biển cùng ' + (l.partner ? l.partner.name : 'bạn bè') + ', bạn nghe tiếng kêu cứu: một đứa trẻ bị sóng cuốn ra xa, chới với.' + (has(l, 'boi') ? '' : ' Bạn không biết bơi.'); },
    opts: [
      { k: 'cuu', l: function (l) { return has(l, 'boi') ? 'Lao xuống bơi ra cứu' : 'Liều lao xuống cứu dù không biết bơi'; }, ai: { w: 1, risk: 0.5 }, run: function (l, r, log) {
        if (has(l, 'boi')) { if (ch(r, 0.88)) { log('Bơi ra kéo được đứa bé vào bờ, sơ cứu cho bé tỉnh lại. Bố mẹ bé ôm chầm lấy bạn mà khóc.', 'big'); fx(l, { karma: 8, hap: 8 }); H.mem(l, 'Ngày kéo đứa bé từ dưới sóng lên — may mà hồi nhỏ được học bơi.', 8); } else { log('Bơi ra kéo được đứa bé nhưng bị sóng đánh uống nhiều nước, kiệt sức. Đội cứu hộ kịp lao ra đưa cả hai vào.', 'neutral'); fx(l, { hea: -4, karma: 6 }); } }
        else if (ch(r, 0.4)) { log('Không biết bơi mà vẫn lao xuống, may đội cứu hộ đến kịp kéo cả hai vào. Ai cũng mắng mà cũng phục.', 'neutral'); fx(l, { hea: -5, karma: 4 }); }
        else { log('Lao xuống rồi chính mình bị đuối, phải nhờ cứu hộ cứu lên, nằm viện mấy ngày. Đứa bé được người khác cứu.', 'bad'); fx(l, { hea: -12 }); } } },
      { k: 'phao', l: 'Ném phao, hô hoán gọi cứu hộ', ai: { w: 1.1, smart: 1 }, run: function (l, r, log) { log('Vớ lấy phao ném ra, hô hoán gọi cứu hộ. Đứa bé bám được phao, được đưa vào an toàn.', 'good'); fx(l, { karma: 4 }); } }
    ]
  });
  T('kn_duoi_nuoc', function (l, a) { return a >= 14 && a <= 65; }, function (l) { return has(l, 'boi') ? 0.025 : 0.003; }, 8, 1);

  SC('kn_so_cuu', {
    title: 'Ngưng tim giữa đường', text: function (l) { return 'Một người đàn ông trung niên đột ngột ngã gục ở quán cà phê, ngừng thở. Mọi người cuống cuồng, chưa ai biết làm gì.' + (has(l, 'so_cuu') ? ' Bạn từng học sơ cứu.' : ''); },
    opts: [
      { k: 'cpr', l: function (l) { return has(l, 'so_cuu') ? 'Ép tim, hô hấp nhân tạo như đã học' : 'Thử ép tim theo video từng xem'; }, ai: { w: 1 }, run: function (l, r, log) { if (ch(r, has(l, 'so_cuu') ? 0.6 : 0.2)) { log('Ép tim liên tục đến khi xe cấp cứu tới. Bác sĩ bảo: "Nhờ mấy phút đầu mà ông ấy sống." Gia đình ông tìm đến cảm ơn.', 'big'); fx(l, { karma: 8, hap: 6 }); H.mem(l, 'Những phút ép tim cứu sống một người xa lạ.', 7); } else { log('Cố hết sức ép tim nhưng ông ấy không qua khỏi. Bạn ngồi thẫn thờ rất lâu.', 'bad'); fx(l, { hap: -6, karma: 3 }); } } },
      { k: 'goi', l: 'Gọi 115, giữ mọi người tránh ra', ai: { w: 1 }, run: function (l, r, log) { log('Gọi 115 và giữ đám đông giãn ra. Xe cấp cứu đến sau mười phút.', 'neutral'); fx(l, { karma: 2 }); } }
    ]
  });
  T('kn_so_cuu', function (l, a) { return a >= 18 && a <= 70; }, function (l) { return has(l, 'so_cuu') ? 0.025 : 0.003; }, 8, 1);

  // năng khiếu → có dịp thể hiện
  var TAL = {
    'âm nhạc': ['Hát mừng đám cưới', 'Đứa bạn thân cưới, cả họ nhà gái biết bạn hát hay nên mời lên hát mừng.', 'Lên hát một bài, cả rạp cưới im phăng phắc rồi vỗ tay rầm rầm. Cô dâu khóc, có người còn xin số để mời hát đám cưới nhà mình.'],
    'hội họa': ['Bức tranh tặng bà', 'Bà sắp mừng thọ, cả nhà muốn có một món quà ý nghĩa.', 'Bạn vẽ chân dung bà bằng sơn dầu. Bà ngắm mãi, treo ngay giữa nhà, ai đến chơi cũng khoe.'],
    'diễn xuất': ['Tiết mục cuối năm', 'Trường / công ty tổ chức tiệc cuối năm, cần một vai chính cho tiểu phẩm hài.', 'Bạn đóng vai chính, diễn tròn vai đến mức khán giả cười chảy nước mắt — clip được chia sẻ khắp nơi.'],
    'thể thao': ['Giải bóng đá phong trào', 'Giải bóng đá phong trào của khu phố / công ty đang thiếu người.', 'Bạn ghi bàn quyết định trận chung kết, được cả đội công kênh.'],
    'ngoại ngữ': ['Du khách lạc đường', 'Một cặp du khách nước ngoài đứng giữa phố, loay hoay vì lạc đường, không ai hiểu họ nói gì.', 'Bạn bắt chuyện, chỉ đường, giới thiệu luôn quán phở ngon gần đó. Họ cảm ơn rối rít, còn kết bạn mạng xã hội.'],
    'toán học': ['Kèm bài cho em', 'Đứa em họ sắp thi vào lớp 10 mà toán yếu, cả nhà nhờ bạn kèm.', 'Kèm em mấy tháng, em đỗ trường điểm cao. Cô chú biếu quà cảm ơn.'],
    'ăn nói': ['MC bất đắc dĩ', 'MC đám cưới đứa bạn thân đến muộn, bạn được đẩy lên cầm micro.', 'Dẫn duyên đến mức ai cũng tưởng MC chuyên nghiệp, mấy người xin số để thuê dẫn đám cưới.'],
    'khéo tay': ['Đồ hỏng của hàng xóm', 'Quạt, nồi cơm, xe đạp của hàng xóm hỏng, ai cũng bảo "nhờ đứa khéo tay xem giúp".', 'Bạn sửa ngon lành cả ba món. Hàng xóm mang biếu đĩa xôi, từ đó gặp gì cũng gọi bạn.'],
    'kinh doanh': ['Gian hàng hội chợ', 'Hội chợ cuối tuần, nhà có một gian hàng nhỏ bán đồ ăn vặt.', 'Bạn bày lại hàng, làm biển giá bắt mắt, livestream rao bán — bán hết sạch trước giờ đóng cửa.'],
    'làm đẹp': ['Trang điểm cho cô dâu', 'Cô bạn thân cưới, thợ trang điểm báo bận phút chót.', 'Bạn trang điểm cho cô dâu, ảnh cưới lung linh. Mấy người bạn khác đặt luôn lịch nhờ bạn trang điểm.'],
    'game': ['Giải game ở quán net', 'Quán net đầu ngõ tổ chức giải đấu, giải nhất 5 triệu.', 'Bạn gánh team vô địch, chia nhau tiền thưởng, được cả xóm game gọi là "thần đồng".'],
    'cờ': ['Ván cờ ở công viên', 'Mấy ông cụ ở công viên thách thanh niên chơi cờ.', 'Bạn thắng liền ba ván, các cụ tâm phục khẩu phục, ngày nào cũng rủ bạn ra đánh cờ.']
  };
  SC('kn_the_hien', {
    title: function (l) { var t = TAL[l.talent]; return t ? t[0] : 'Dịp thể hiện'; }, valid: function (l) { return !!TAL[l.talent]; },
    text: function (l) { return TAL[l.talent][1] + ' Mọi người đều biết bạn có năng khiếu ' + E.talentText(l) + '.'; },
    opts: [
      { k: 'lam', l: 'Thể hiện hết mình', ai: { w: 1.2 }, run: function (l, r, log) { var ok = ch(r, 0.55 + (l.skill || 30) / 250); if (ok) { log(TAL[l.talent][2], 'good'); fx(l, { hap: 6, soc: 4 }); if (l.talent === 'game') H.cash(l, V(l, 2.5), 'Thưởng giải game'); H.mem(l, TAL[l.talent][0] + ' — lần năng khiếu của mình làm mọi người vui.', 4); } else { log('Hơi run nên chưa được như ý, nhưng ai cũng khen bạn có tâm.', 'neutral'); fx(l, { hap: 1 }); } l.skill = Math.min(100, (l.skill || 30) + 2); } },
      { k: 'thoi', l: 'Khiêm tốn từ chối', ai: { w: 0.5 }, run: function (l, r, log) { log('Từ chối khéo, nhường dịp cho người khác.', 'neutral'); } }
    ]
  });
  T('kn_the_hien', function (l, a) { return !!TAL[l.talent] && a >= 14 && a <= 50; }, 0.02, 8, 1);

  // ===================================================================
  // 4. TRÀ SỮA, ĐỒ UỐNG, RỦ NHAU ĐI ĂN — THEO TREND
  // ===================================================================
  // [tên, giá (nghìn đồng), chuỗi quán hay bán]
  var DRINKS = [['trà sữa trân châu đường đen', 45, 'TocoToco'], ['trà sữa Đài Loan', 40, 'Gong Cha'], ['matcha latte', 55, 'Katinat'], ['trà đào cam sả', 45, 'Highlands'], ['cà phê muối', 35, 'quán cà phê muối'],
    ['bạc xỉu', 30, 'quán cà phê vỉa hè'], ['hồng trà macchiato', 50, 'Phúc Long'], ['sữa tươi trân châu đường đen', 45, 'Tiger Sugar'], ['trà sữa nướng', 40, 'TocoToco'], ['trà vải', 40, 'The Coffee House'],
    ['sinh tố bơ', 40, 'quán sinh tố'], ['trà chanh giã tay', 25, 'quán trà chanh'], ['kem ốc quế', 10, 'Mixue'], ['trà sữa khoai môn', 40, 'Ding Tea'], ['oolong sữa', 50, 'Phê La'],
    ['cacao đá', 30, 'quán quen'], ['yakult đào', 40, 'quán trà trái cây'], ['trà xanh kem phô mai', 55, 'Gong Cha'], ['nước ép dưa hấu', 35, 'quán nước ép'], ['Phindi hạnh nhân', 45, 'Highlands']];
  function target(l, r) {
    var c = [];
    if (l.partner) c.push({ k: 'p', n: l.partner.name, w: E.H.partnerWord ? E.H.partnerWord(l, l.partner) : 'người yêu' });
    (l.sibList || []).filter(function (s) { return s.alive; }).forEach(function (s) { c.push({ k: 's', n: s.n.split(' ').pop(), w: s.born < 0 ? (s.sex === 'M' ? 'anh' : 'chị') : 'em', s: s }); });
    if (l.bff && l.bff.alive) c.push({ k: 'b', n: l.bff.name, w: 'bạn thân' });
    if (!c.length) return null;
    return c.filter(function (x) { return x.k === 'p'; })[0] && ch(r, 0.6) ? c[0] : pick(r, c);
  }
  SC('mua_nuoc', {
    title: 'Mua nước "lấy lòng"',
    valid: function (l) { return !!(l.partner || (l.sibList || []).some(function (s) { return s.alive; }) || (l.bff && l.bff.alive)); },
    prep: function (l, r) { return { t: target(l, r) || { k: 'b', n: 'đứa bạn', w: 'bạn' }, d: shuffle(r, DRINKS).slice(0, 5), like: Math.floor(r() * 5), mood: pick(r, ['đang dỗi vì bạn quên trả lời tin nhắn', 'vừa thi xong / chạy deadline mệt rã rời', 'nhắn "nóng quá đi"', 'đang buồn chuyện gì đó', 'vừa giúp bạn một việc lớn']) }; },
    text: function (l, d) { return (d.t.k === 'p' ? U.cap(d.t.w) + ' ' + d.t.n : U.cap(d.t.w) + ' ' + d.t.n) + ' ' + d.mood + '. Một ly nước mát lúc này là "lấy lòng" chuẩn bài. Mua gì đây?'; },
    opts: [0, 1, 2, 3, 4].map(function (i) {
      return { k: 'd' + i, l: function (l, d) { var x = d.d[i]; return U.cap(x[0]) + (vnd(l) ? ' (' + x[2] + ')' : ''); }, h: function (l, d) { return '~' + mo(l, V(l, d.d[i][1] * 2 / 1000)) + ' cho 2 ly'; }, ai: { w: 1 },
        run: function (l, r, log, d) { buy(l, r, log, d, d.d[i], i === d.like); } };
    }).concat([
      { k: 'hoi', l: 'Hỏi "uống gì?" trước cho chắc', ai: { w: 0.8 }, run: function (l, r, log, d) { if (ch(r, 0.5)) { log('Hỏi "uống gì?", nhận về câu trả lời kinh điển: "Gì cũng được." Mua đại ' + d.d[0][0] + ' thì bị chê "biết em không thích mà".', 'neutral'); H.cash(l, -V(l, d.d[0][1] * 2 / 1000), 'Mua nước'); } else buy(l, r, log, d, d.d[d.like], true); } },
      { k: 'khong', l: 'Thôi, nhắn tin hỏi han là được', ai: { w: 0.4 }, run: function (l, r, log, d) { log('Chỉ nhắn tin hỏi han ' + d.t.n + '.', 'neutral'); } }
    ])
  });
  function buy(l, r, log, d, x, liked) {
    H.cash(l, -V(l, x[1] * 2 / 1000), 'Mua ' + x[0]);
    var who = d.t.w + ' ' + d.t.n;
    if (liked || ch(r, 0.6)) { log('Mua ly ' + x[0] + ' cho ' + who + '. ' + pick(r, ['Người ấy cười tít mắt: "Sao biết đúng món tủ vậy?"', 'Uống một ngụm là hết dỗi, còn chụp ảnh đăng story khoe.', '"Thương ghê!" — chỉ một ly nước mà cả buổi chiều vui vẻ.']), 'good'); fx(l, { hap: 3, soc: 1 }); if (d.t.s) d.t.s.close = Math.min(100, (d.t.s.close || 50) + 4); if (d.t.k === 'b' && l.bff) l.bff.close = Math.min(100, (l.bff.close || 60) + 3); }
    else log('Mua ' + x[0] + ' cho ' + who + ', nhận lại câu: "' + pick(r, ['Em dặn ít đường rồi mà!', 'Anh không uống được trân châu đâu…', 'Lần sau nhớ size L nhé.', 'Ủa sao không mua cho cả nhà luôn?']) + '" Cười trừ, rút kinh nghiệm.', 'neutral');
  }
  T('mua_nuoc', function (l, a) { return a >= 14 && a <= 55 && !!(l.partner || (l.bff && l.bff.alive)); }, 0.015, 5, 1);
  A('mua_nuoc', 'Tình cảm', 'Mua trà sữa / đồ uống cho người thân', { min: 12, max: 70, sc: 'mua_nuoc', avail: function (l) { return l.partner || (l.sibList || []).some(function (s) { return s.alive; }) || (l.bff && l.bff.alive) ? true : 'Chưa có ai để mua cho'; } });

  // [mã, tên (VN), tên chung (nước ngoài), giá mỗi người (triệu đồng), lời kể]
  var EATS = [['dookki', 'buffet tokbokki Dookki', 'buffet tokbokki Hàn Quốc', 0.15, 'Cả hội tự nấu tokbokki, cãi nhau chuyện cho bao nhiêu phô mai.'],
    ['ga_ran', 'gà rán KFC / Jollibee', 'quán gà rán', 0.1, 'Gọi combo gà rán, mì Ý Jollibee, ăn đến dính hết tay.'],
    ['mi_cay', 'mì cay 7 cấp độ', 'quán mì cay', 0.08, 'Thách nhau ăn mì cấp 7 — đứa nào bỏ cuộc phải trả tiền.'],
    ['lau', 'lẩu Haidilao', 'lẩu Haidilao', 0.45, 'Ngồi lẩu Haidilao cả tối, nhân viên còn hát mừng sinh nhật hộ.'],
    ['buffet', 'buffet hải sản Cửu Vân Long', 'buffet hải sản', 0.4, 'Ăn buffet hải sản no căng, chụp ảnh từng đĩa cua ghẹ.'],
    ['nuong', 'buffet nướng Gogi / King BBQ', 'quán thịt nướng Hàn Quốc', 0.3, 'Nướng thịt xèo xèo, nói chuyện trên trời dưới biển.'],
    ['tra_sua', 'trà sữa rồi về xem Netflix', 'trà sữa rồi về xem Netflix', 0.08, 'Mua trà sữa về nhà, cả hội chen nhau xem Netflix đến khuya.'],
    ['oc', 'quán ốc vỉa hè', 'quán ăn vặt đường phố', 0.12, 'Ngồi quán ốc vỉa hè, gọi đủ món ốc hương, sò điệp nướng mỡ hành.']];
  SC('ru_ban_an', {
    title: 'Rủ hội bạn đi ăn', prep: function (l, r) { return { e: shuffle(r, EATS).slice(0, 5), n: 3 + Math.floor(r() * 3) }; },
    text: function (l, d) { return 'Nhóm chat sôi lên: "Cuối tuần đi đâu ăn đi!" Có ' + d.n + ' đứa hưởng ứng. Bạn chốt đi đâu?'; },
    opts: [0, 1, 2, 3, 4].map(function (i) {
      return { k: 'e' + i, l: function (l, d) { var x = d.e[i]; return 'Đi ' + (vnd(l) ? x[1] : x[2]); }, h: function (l, d) { return '~' + mo(l, V(l, d.e[i][3])) + ' / người · chia đều'; }, ai: { w: 1 },
        run: function (l, r, log, d) { var x = d.e[i]; pay(l, x[3], 'Đi ăn cùng bạn bè'); var bao = ch(r, 0.15); log(x[4] + (bao ? ' Cuối bữa bạn giành trả tiền cả bàn — "lần sau tụi mày bao lại".' : ''), 'good'); if (bao) pay(l, x[3] * d.n, 'Bao cả hội'); fx(l, { hap: 4, soc: 4 }); if (l.bff && l.bff.alive) l.bff.close = Math.min(100, (l.bff.close || 60) + 2); } };
    }).concat([{ k: 'khong', l: 'Thôi, cuối tháng rồi, cháy túi', ai: { w: 0.5 }, run: function (l, r, log) { log('Từ chối vì cuối tháng cháy túi, ngồi nhà xem cả hội đăng ảnh.', 'neutral'); fx(l, { hap: -1 }); } }])
  });
  // chống quá tải lựa chọn: vài chuyện đời thường cũ hay lặp — tối đa 2 lần một đời
  E.TRIG.forEach(function (t) { if (/^(mua_sam|sib_vay|nhat_vi|ban_muon_tien|viec_online|csgt|den_vang)$/.test(t.id) && !t.rep) t.max = Math.min(t.max || 3, 2); });
  E.TRIG.forEach(function (t) { if (/^(mua_sam|nhat_vi)$/.test(t.id) && !t.rep) t.max = 1; });
  T('ru_ban_an', function (l, a) { return a >= 15 && a <= 45 && l.urban; }, 0.02, 5, 1);
  A('ru_ban_an', 'Gia đình & bạn bè', 'Rủ bạn bè đi ăn uống', { min: 14, max: 70, sc: 'ru_ban_an' });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
