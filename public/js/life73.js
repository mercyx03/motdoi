/* Một Đời — v5.8.0:
   · xem tivi: phim / game / gameshow ca nhạc → chọn chương trình (gộp mọi mùa) → chọn người mình thích → từ đó mới có fanmeeting, photocard của đúng người ấy
   · trại lừa đảo Campuchia: việc làm riêng trong trại, mỗi năm có chuyện trong trại; trở về có hồn hơn
   · quan hệ chu cấp có kiểm soát: càng bị kiểm soát càng căng thẳng, kém vui
   · chi phí sinh hoạt theo mức sống gia đình; đám cưới chọn nơi tổ chức, nhẫn cưới, bố mẹ hỗ trợ theo điều kiện
   · chia tay có lý do cụ thể
   · mua điện thoại (iOS, Android, gaming), laptop, PC — dòng máy lên đời theo từng năm */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function fx(l, o) { H.fx(l, o); }
  function stress(l, d) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + d, 0, 100); }
  function ch(r, p) { return r() < p; }
  function yr(l) { return l.birthYear + l.age; }
  function vnd(l) { return isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  function V(l, tr) { return vnd(l) ? tr : tr / 90 * l.base; }
  function mo(l, v) { return H.money(l, v); }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function trapped(l) { return !!(l.alive && l.abroad && l.abroad.trapped); }
  function A(id, g, label, o) { var x = { id: id, g: g, l: label }; for (var k in o) x[k] = o[k]; E.ACT.push(x); }
  function vnHome(l) { return isVN(l) && !l.abroad; }
  function parentsAlive(l) { var f = l.fam || {}; return { m: !f.noMom && f.mAlive, b: !f.noDad && f.fAlive }; }

  // ===================================================================
  // 1. XEM TIVI → CHỌN THẦN TƯỢNG (Việt Nam)
  // ===================================================================
  var CD23 = ['Thu Phương', 'Mỹ Linh', 'Lệ Quyên', 'Trang Pháp', 'Diệp Lâm Anh', 'Ninh Dương Lan Ngọc', 'MLee', 'Hồng Nhung', 'Phương Vy', 'Uyên Linh', 'Lynk Lee', 'Nguyên Hà', 'Diệu Nhi', "H'Hen Niê", 'Đoan Trang', 'Thanh Ngọc', 'Tú Vi', 'Quỳnh Nga', 'Huyền Baby', 'Hà Kino', 'Hương Ly', 'Lưu Hương Giang', 'Khổng Tú Quỳnh', 'Giang Hồng Ngọc', 'Phạm Lịch', 'Thái Trinh', 'Yến Trang', 'Vân Hugo', 'Hoàng Oanh', 'Bảo Anh'];
  var CD24 = ['Minh Tuyết', 'Minh Hằng', 'Tóc Tiên', 'Bùi Lan Hương', 'Dương Hoàng Yến', 'Xuân Nghi', 'Thiều Bảo Trâm', 'Kiều Anh', 'Mie', 'MisThy', 'Phương Thanh', 'Phạm Quỳnh Anh', 'Thảo Trang', 'Ngọc Thanh Tâm', 'Tuimi', 'Ngọc Phước', 'Hoàng Yến Chibi', 'Gil Lê', 'Vũ Ngọc Anh', 'Châu Tuyết Vân', 'Maitinhvi', 'Hậu Hoàng', 'Ngọc Ánh', 'Thúy Hiền', 'Ái Phương', 'Đồng Ánh Quỳnh', 'Thu Ngọc', 'Hạnh Sino'];
  var RAP = [
    ['Rap Việt mùa 1 (2020)', 2020, ['Dế Choắt', 'GDucky', 'MCK', 'Ricky Star', 'tlinh', 'Thành Draw', 'Gonzo', 'Lăng LD', 'Wowy', 'Karik', 'Suboi', 'Binz']],
    ['Rap Việt mùa 2 (2021)', 2021, ['Seachains', 'Blacka', 'B-Wine', 'DLow', 'Hoàng Anh', "Lil' Wuyn", 'VSoul', 'Kellie', 'Rhymastic']],
    ['Rap Việt mùa 3 (2023)', 2023, ['Double2T', '24K.Right', 'Liu Grace', 'Công Hiếu', 'Pháp Kiều', 'Tez', 'Mikelodic', 'Rhyder', 'SMO', 'BigDaddy', 'B Ray', 'Thái VG', 'Andree Right Hand']],
    ['Rap Việt mùa 4 (2024)', 2024, ['Robber', 'Gill', 'MANBO', '7dnight', 'DANMY', 'CoolKid', 'Saabirose', 'Dangrangto', 'Queen B']]
  ];
  function showK(k) { return (E.SHOWS || []).filter(function (s) { return s.k === k; })[0]; }
  var FR = [
    { k: 'atsh', n: 'Anh trai "Say Hi"', s: ['atsh1', 'atsh2'] },
    { k: 'exsh', n: 'Em xinh "Say Hi"', s: ['exsh'] },
    { k: 'thsh', n: 'Tinh hà "Say Hi"', s: ['thsh'] },
    { k: 'atvncg', n: 'Anh trai vượt ngàn chông gai', s: ['atvncg24', 'atvncg26'] },
    { k: 'cd', n: 'Chị đẹp đạp gió rẽ sóng', own: [{ n: 'Chị đẹp đạp gió rẽ sóng 2023', from: 2023, b: 1985, pre: 'chị đẹp', m: CD23, cat: 'vn' }, { n: 'Chị đẹp đạp gió 2024', from: 2024, b: 1986, pre: 'chị đẹp', m: CD24, cat: 'vn' }] },
    { k: 'rap', n: 'Rap Việt', own: RAP.map(function (x) { return { n: x[0], from: x[1], b: 1998, pre: '', m: x[2], cat: 'rapvn' }; }) }
  ];
  function seasons(f) { return f.own ? f.own : f.s.map(showK).filter(Boolean).map(function (s) { return { n: s.n, from: s.from, b: s.b, pre: s.pre, m: s.m, cat: 'show', show: true }; }); }
  function open(l) { var y = yr(l); return FR.filter(function (f) { return seasons(f).some(function (s) { return y >= s.from; }); }); }
  function cast(f, l) { var seen = {}, out = []; seasons(f).filter(function (s) { return yr(l) >= s.from; }).forEach(function (s) { s.m.forEach(function (n) { if (!seen[n]) { seen[n] = 1; out.push({ n: n, s: s }); } else out.forEach(function (x) { if (x.n === n) x.s = s; }); }); }); return out; }
  E.TV_SHOWS = FR; E.tvCast = cast;
  function idolOf(m) { return m.s.pre ? E.memberName(m.s.pre, m.n) : m.n; }
  function setBias(l, r, log, f, m) {
    var was = l.idol, name = idolOf(m);
    l.bias = { n: m.n, show: m.s.n, pre: m.s.pre || '' }; l.idol = name; l.idolCat = m.s.cat; l.idolBorn = m.s.b; l.flags.idolAt = l.age; l.flags.tvBias = f.k;
    log(was && was !== name ? 'Xem ' + f.n + ' xong, bạn "chuyển nhà" sang thích ' + name + '.' : 'Xem ' + f.n + ' trên tivi, bạn "đổ" ' + name + ' ngay từ tiết mục đầu tiên. Từ nay ' + name + ' là thần tượng của bạn.', 'good');
    fx(l, { hap: 3 }); if (!was) H.mem(l, 'Năm ' + l.age + ' tuổi, lần đầu mê ' + name + ' qua chương trình ' + f.n + '.', 3);
  }
  var FILM = { kid: ['Xem phim hoạt hình Doraemon, cười lăn khi Nobita lại bị mẹ mắng.', 'Xem Thám tử lừng danh Conan, đoán hung thủ trước cả Conan.', 'Xem phim hoạt hình Tý Quậy cả buổi chiều.', 'Xem Shin cậu bé bút chì, học lỏm mấy câu nói của Shin.'], teen: ['Cày một bộ phim truyền hình giờ vàng, tối nào cũng chờ tập mới.', 'Xem một bộ phim Hàn Quốc, khóc sưng mắt ở tập cuối.', 'Xem phim chiếu rạp vừa lên mạng, bàn tán cả tuần với bạn.', 'Xem lại phim Tết của năm trước, vẫn cười như lần đầu.'] };
  SC('tv_xem', {
    title: 'Mở tivi', valid: function (l) { return vnHome(l) && free(l); },
    text: function (l) { return (l.age < 12 ? 'Học bài xong, bạn được mở tivi.' : 'Tối nay rảnh, bạn mở tivi, điện thoại.') + ' Bạn muốn xem gì?'; },
    opts: [
      { k: 'phim', l: 'Xem phim', ai: { w: 1 }, run: function (l, r, log) { log(U.pick(r, FILM[l.age < 12 ? 'kid' : 'teen']), 'good'); fx(l, { hap: 2 }); } },
      { k: 'game', l: 'Xem người ta chơi game, rồi chơi theo', ai: { w: 0.9 }, run: function (l, r, log) { if (l.talent === 'game') l.skill = Math.min(100, (l.skill || 20) + 2); log(U.pick(r, ['Xem streamer leo rank, rồi lôi điện thoại ra chơi theo đến khuya.', 'Xem giải đấu game trên mạng, hò hét như xem bóng đá.', 'Xem hướng dẫn chơi game, tập theo từng chiêu.']), 'good'); fx(l, { hap: 2 }); } },
      { k: 'show', l: 'Xem gameshow ca nhạc', h: function (l) { return open(l).map(function (f) { return f.n; }).join(', '); }, req: function (l) { return open(l).length > 0; }, ai: { w: 1.1 }, run: function (l, r) { l.pending.unshift(E.DEC.tv_show.make(l, r)); } },
      { k: 'tat', l: 'Tắt tivi, đi học bài / đi ngủ', ai: { w: 0.5 }, run: function (l, r, log) { fx(l, { kno: 1 }); log('Tắt tivi đi học bài, sáng mai còn đi học sớm.', 'neutral'); } }
    ]
  });
  SC('tv_show', {
    title: 'Xem chương trình nào?', valid: function (l) { return vnHome(l); },
    text: function (l) { return 'Đang có các chương trình âm nhạc' + (yr(l) > 2030 ? ' (chiếu lại và có mùa mới trên mạng)' : '') + '. Bạn chọn xem chương trình nào? Mỗi chương trình gộp tất cả các mùa.' + (l.idol ? ' Thần tượng hiện tại: ' + l.idol + '.' : ''); },
    opts: [0, 1, 2, 3, 4, 5].map(function (i) {
      return { k: 'f' + i, l: function (l) { var f = open(l)[i]; return f ? f.n : ''; }, h: function (l) { var f = open(l)[i]; if (!f) return ''; var ss = seasons(f).filter(function (s) { return yr(l) >= s.from; }); return ss.length + ' mùa · ' + cast(f, l).length + ' người tham gia'; }, req: function (l) { return !!open(l)[i]; }, ai: { w: 1 },
        run: function (l, r) { var f = open(l)[i]; l.pending.unshift(E.DEC.tv_bias.make(l, r, { k: f.k, p: 0 })); } };
    }).concat([{ k: 'thoi', l: 'Thôi, chuyển kênh khác', ai: { w: 0.2 }, run: function () { } }])
  });
  var PER = 10;
  function frK(k) { return FR.filter(function (f) { return f.k === k; })[0]; }
  SC('tv_bias', {
    title: function (l, d) { return frK(d.k).n; },
    prep: function (l, r, a) { var f = frK(a && a.k) || FR[0], p = (a && a.p) || 0; return { k: f.k, p: p }; },
    valid: function (l) { return vnHome(l); },
    text: function (l, d) { var f = frK(d.k), c = cast(f, l); return 'Xem ' + f.n + ', bạn thích ai nhất? (' + (d.p * PER + 1) + '–' + Math.min(c.length, d.p * PER + PER) + ' / ' + c.length + ' người, gộp các mùa)'; },
    opts: Array.apply(null, Array(PER)).map(function (_, i) {
      return { k: 'm' + i, l: function (l, d) { var m = cast(frK(d.k), l)[d.p * PER + i]; return m ? U.cap(idolOf(m)) : ''; }, h: function (l, d) { var m = cast(frK(d.k), l)[d.p * PER + i]; return m ? m.s.n : ''; }, req: function (l, d) { return !!cast(frK(d.k), l)[d.p * PER + i]; }, ai: { w: 1 },
        run: function (l, r, log, d) { var f = frK(d.k), m = cast(f, l)[d.p * PER + i]; if (m) setBias(l, r, log, f, m); } };
    }).concat([
      { k: 'more', l: 'Xem thêm những người khác ›', req: function (l, d) { return cast(frK(d.k), l).length > (d.p + 1) * PER; }, ai: { w: 0.3 }, run: function (l, r, log, d) { l.pending.unshift(E.DEC.tv_bias.make(l, r, { k: d.k, p: d.p + 1 })); } },
      { k: 'back', l: '‹ Xem lại từ đầu', req: function (l, d) { return d.p > 0; }, ai: { w: 0 }, run: function (l, r, log, d) { l.pending.unshift(E.DEC.tv_bias.make(l, r, { k: d.k, p: 0 })); } },
      { k: 'none', l: 'Chỉ xem cho vui, chưa thích ai', ai: { w: 0.5 }, run: function (l, r, log, d) { log('Xem ' + frK(d.k).n + ' cho vui, hát theo vài bài nhưng chưa "đu" ai cả.', 'neutral'); fx(l, { hap: 2 }); } }
    ])
  });
  E.TRIG.push({ id: 'tv_xem', when: function (l, a) { return vnHome(l) && free(l) && a >= 7 && a <= 17; }, p: 0.3, cd: 3, max: 4 });
  A('xem_tv', 'Giải trí', 'Mở tivi xem phim, gameshow', { min: 5, sc: 'tv_xem', avail: function (l) { return vnHome(l) ? true : 'Không áp dụng'; }, ai: { w: 0.2 } });

  // ===================================================================
  // 2. TRẠI LỪA ĐẢO CAMPUCHIA
  // ===================================================================
  function khYears(l) { return Math.max(0, l.age - (l.flags.khSince != null ? l.flags.khSince : l.age)); }
  E.khReturn = function (l, t) {
    var P = parentsAlive(l), y = khYears(l), r = H.rf(l), who;
    var dur = y >= 2 ? 'sau ' + y + ' năm' : 'sau những tháng ngày';
    if (P.m && P.b) who = U.pick(r, ['Mẹ chạy ùa ra, ôm chầm lấy bạn, khóc nấc không nói nên lời. Bố đứng phía sau, mắt đỏ hoe, chỉ lặng lẽ xoa đầu bạn như hồi bé.', 'Bố mẹ đã chờ ở cửa khẩu từ tờ mờ sáng. Vừa thấy bạn, mẹ khuỵu xuống, bố đỡ lấy cả hai mẹ con, ba người ôm nhau giữa dòng người.']);
    else if (P.m) who = 'Mẹ ôm chầm lấy bạn, sờ lên khuôn mặt gầy rộc mà khóc: "Mẹ tưởng không bao giờ gặp lại con nữa."';
    else if (P.b) who = 'Bố ôm bạn thật chặt, đôi vai người đàn ông cả đời không khóc run lên từng hồi.';
    else if (l.partner && l.partner.alive !== false) who = l.partner.name + ' đứng chờ ở cửa khẩu, nắm chặt tay bạn như sợ bạn lại biến mất.';
    else who = 'Không có người thân nào đón, nhưng cán bộ biên phòng đưa cho bạn bát cháo nóng và chiếc điện thoại để gọi về.';
    var feel = U.pick(r, ['Đêm đầu tiên ở nhà, bạn ngủ một giấc không sợ hãi. Bạn thấy mình như được sống lại.', 'Bữa cơm nhà đơn sơ mà bạn ăn trong nước mắt. Lần đầu tiên ' + dur + ' tăm tối, bạn biết mình đã thật sự thoát.', 'Nằm trên chiếc giường cũ, nghe tiếng xe ngoài ngõ, bạn tự hứa sẽ sống tiếp cho cả những người chưa về được.']);
    return t + ' Bạn đặt chân về ' + l.countryName + ' ' + dur + ' bị giam cầm, gầy rộc, tóc rối bù. ' + who + ' ' + feel;
  };
  var KH_LINES = ['Một năm nữa trôi qua sau hàng rào kẽm gai. Bạn đếm ngày bằng những vạch khắc trên chân giường.', 'Đêm nào cũng nghe tiếng la hét từ "phòng tối" cuối hành lang.', 'Bữa ăn chỉ có cơm trắng và rau luộc, ai không đủ chỉ tiêu bị cắt phần.', 'Một người cùng phòng bị bán sang công ty khác, đi không một lời từ biệt.', 'Bạn mơ thấy mình được về nhà, tỉnh dậy gối ướt đẫm.', 'Quản lý đổi kịch bản lừa mới: giả danh nhân viên ngân hàng, giả làm người yêu qua mạng, mời đầu tư tiền ảo.', 'Có người liều nhảy qua tường trốn thoát, cả trại bị siết chặt canh gác suốt mấy tháng.', 'Bảo vệ thay ca, bạn lén nhìn ra khe cửa sổ, thấy cánh đồng xa tít bên kia bức tường.'];
  function khEvt(id, title, text, opts) {
    SC(id, { title: title, tone: 'dark', valid: trapped, text: text, opts: opts });
  }
  function shock(l, log, t, d) { fx(l, { hea: -(d || 12), hap: -6 }); stress(l, 10); log(t, 'bad'); }
  khEvt('kh_chi_tieu', 'Chỉ tiêu tháng này', 'Quản lý giao chỉ tiêu: tháng này phải lừa được đủ số người, ai thiếu sẽ bị đánh và chích điện.', [
    { k: 'lam', l: 'Làm đủ chỉ tiêu để không bị đánh', ai: { w: 1.1 }, run: function (l, r, log) { fx(l, { karma: -5, hap: -5 }); stress(l, 5); log('Bạn làm đủ chỉ tiêu. Đêm về, những cái tên bị lừa cứ hiện lên trong đầu.', 'bad'); } },
    { k: 'qua_loa', l: 'Làm qua loa, cố tình để "con mồi" nghi ngờ', ai: { w: 0.9, karma: 1 }, run: function (l, r, log) { fx(l, { karma: 3 }); if (ch(r, 0.5)) shock(l, log, 'Quản lý phát hiện bạn cố tình làm hỏng việc. Bạn bị lôi ra chích điện trước mặt cả phòng.', 12); else log('Mấy người bạn "chăm" đều nghi ngờ và chặn liên lạc. Bạn bị mắng nhưng thoát trận đòn.', 'neutral'); } },
    { k: 'tu_choi', l: 'Từ chối thẳng, không lừa người khác', ai: { w: 0.4, karma: 1.5 }, run: function (l, r, log) { fx(l, { karma: 6 }); shock(l, log, 'Bạn bị đánh, bị chích điện đến ngất đi rồi nhốt vào phòng tối ba ngày. Sức khỏe sa sút hẳn.', 18); } }
  ]);
  khEvt('kh_nan_nhan', 'Một bà cụ sắp chuyển tiền', 'Người bạn đang phải "chăm" là một bà cụ ở quê, sắp chuyển toàn bộ tiền dưỡng già vì tin bạn là cán bộ ngân hàng.', [
    { k: 'canh_bao', l: 'Lén nhắn cảnh báo bà cụ', ai: { w: 1, karma: 1.5 }, run: function (l, r, log) { fx(l, { karma: 8 }); if (ch(r, 0.4)) shock(l, log, 'Tin nhắn bị phát hiện. Bạn bị nhốt vào phòng tối một tuần, chỉ được uống nước.', 15); else { fx(l, { hap: 3 }); log('Bà cụ không chuyển tiền. Bạn bị trừ phần ăn vì "để sổng khách", nhưng trong lòng nhẹ đi một chút.', 'neutral'); H.mem(l, 'Lần lén cứu một bà cụ khỏi bị lừa, giữa trại lừa đảo.', 4); } } },
    { k: 'cham', l: 'Kéo dài thời gian, viện cớ mạng lỗi', ai: { w: 0.9 }, run: function (l, r, log) { fx(l, { karma: 3 }); if (ch(r, 0.25)) shock(l, log, 'Quản lý nghi ngờ, bạn bị đánh mấy roi điện.', 6); else log('Bạn câu giờ mãi, bà cụ chưa kịp chuyển thì đã được con cháu phát hiện.', 'neutral'); } },
    { k: 'tiep', l: 'Làm theo kịch bản để được yên', ai: { w: 0.6 }, run: function (l, r, log) { fx(l, { karma: -8, hap: -8 }); stress(l, 6); log('Bà cụ chuyển hết tiền. Bạn được thưởng thêm bữa ăn, nhưng không nuốt nổi.', 'bad'); H.mem(l, 'Giọng bà cụ cảm ơn "cháu cán bộ" qua điện thoại — ám ảnh mãi.', 5); } }
  ]);
  khEvt('kh_om', 'Ốm trong trại', 'Bạn sốt cao mấy ngày, người lả đi nhưng vẫn bị bắt ngồi trước máy tính.', [
    { k: 'xin', l: 'Xin thuốc', ai: { w: 1.2 }, run: function (l, r, log) { if (ch(r, 0.5)) { fx(l, { hea: -3 }); log('Được cho mấy viên thuốc hạ sốt, bạn gượng dậy được sau vài ngày.', 'neutral'); } else { fx(l, { hea: -10 }); log('Quản lý bảo "giả bệnh", không cho thuốc. Bạn nằm co ro cả tuần.', 'bad'); } } },
    { k: 'gia_ngat', l: 'Giả vờ ngất để được đưa ra ngoài', ai: { w: 0.4, risk: 1.2 }, run: function (l, r, log) { var x = r(); if (x < 0.15 && E.khFree) { E.khFree(l, log, 'Bạn được đưa đến phòng khám bên ngoài, lựa lúc vắng người chạy thẳng đến đồn cảnh sát.'); } else if (x < 0.5) shock(l, log, 'Bị phát hiện giả vờ, bạn bị đánh đến bầm dập.', 12); else { fx(l, { hea: -5 }); log('Không ai đưa bạn đi đâu cả. Bạn chỉ được nghỉ nửa ngày.', 'neutral'); } } },
    { k: 'chiu', l: 'Cố gượng làm tiếp', ai: { w: 0.6 }, run: function (l, r, log) { fx(l, { hea: -8 }); stress(l, 4); log('Bạn cố gượng ngồi làm, mắt hoa lên, gục xuống bàn mấy lần.', 'bad'); } }
  ]);
  khEvt('kh_ban', 'Bị bán sang công ty khác', 'Bạn nghe tên mình trong danh sách bị "bán" sang một công ty khác, xa biên giới hơn.', [
    { k: 'nho_duong', l: 'Âm thầm ghi nhớ đường đi trên xe', ai: { smart: 1.3, w: 1 }, run: function (l, r, log) { l.flags.khMap = true; fx(l, { kno: 1, hap: -4 }); log('Suốt đường đi bạn nhìn qua khe cửa, ghi nhớ từng khúc quanh, từng tấm biển.', 'neutral'); } },
    { k: 'xin', l: 'Van xin được ở lại', ai: { w: 0.6 }, run: function (l, r, log) { fx(l, { hea: -6, hap: -5 }); log('Lời van xin chỉ đổi lại một trận đòn. Bạn vẫn bị đưa đi.', 'bad'); } },
    { k: 'im', l: 'Im lặng chấp nhận', ai: { w: 0.8 }, run: function (l, r, log) { fx(l, { hap: -5 }); log('Bạn bị đưa sang công ty mới, chỉ tiêu cao hơn, canh gác nghiêm hơn.', 'bad'); } }
  ]);
  khEvt('kh_dong_doi', 'Người mới vào phòng', 'Một cậu thanh niên mới bị lừa sang, đêm nào cũng khóc vì nhớ nhà.', [
    { k: 'an_ui', l: 'An ủi, chia phần ăn', ai: { w: 1.2, soc: 1 }, run: function (l, r, log) { l.flags.khAlly = true; fx(l, { soc: 3, hap: 2, karma: 3 }); log('Bạn chia nửa phần cơm, kể cho cậu ấy nghe cách sống sót. Hai người hứa sẽ cùng nhau về nhà.', 'good'); } },
    { k: 'ke_hoach', l: 'Cùng nhau bàn kế hoạch thoát ra', ai: { w: 0.8, risk: 1 }, run: function (l, r, log) { l.flags.khAlly = true; l.flags.khPlan = true; fx(l, { hap: 2 }); log('Hai người thì thầm bàn kế hoạch mỗi đêm, chia nhau theo dõi giờ đổi ca của bảo vệ.', 'neutral'); } },
    { k: 'ke', l: 'Mặc kệ, tự lo thân mình', ai: { w: 0.5 }, run: function (l, r, log) { fx(l, { hap: -1 }); log('Bạn quay mặt vào tường. Ở đây, thương người khác cũng là một gánh nặng.', 'neutral'); } }
  ]);
  khEvt('kh_co_hoi', 'Cơ hội trốn thoát', 'Đêm mưa to, trại mất điện, camera tắt. Có lẽ đây là cơ hội duy nhất trong năm.', [
    { k: 'tron', l: 'Trốn ngay đêm nay', ai: { risk: 1.3, w: 1 }, run: function (l, r, log) { var p = 0.3 + (l.flags.khMap ? 0.15 : 0) + (l.flags.khAlly ? 0.1 : 0) + (l.flags.khPlan ? 0.1 : 0); var x = r(); if (x < p && E.khFree) E.khFree(l, log, l.flags.khAlly ? 'Hai người dìu nhau trèo qua bức tường trong đêm mưa, chạy xuyên cánh đồng đến đồn cảnh sát.' : 'Bạn trèo qua bức tường trong đêm mưa, chạy xuyên cánh đồng đến đồn cảnh sát.'); else if (x < p + 0.05) { H.kill(l, 'bị đánh khi bỏ trốn khỏi trại lừa đảo ở Campuchia', log, true); l.flags.cambodia = 'Bỏ mạng khi cố trốn khỏi trại lừa đảo ở Campuchia.'; } else shock(l, log, 'Bị bắt lại ngay chân tường. Bạn bị đánh, chích điện rồi nhốt riêng nhiều ngày.', 20); } },
    { k: 'cho', l: 'Chờ dịp an toàn hơn', ai: { w: 0.8 }, run: function (l, r, log) { log('Bạn nằm im nghe tiếng mưa, tự nhủ sẽ còn cơ hội khác.', 'neutral'); fx(l, { hap: -2 }); } }
  ]);
  khEvt('kh_goi_nha', 'Ba phút gọi về nhà', 'Đủ chỉ tiêu, bạn được gọi về nhà ba phút, quản lý đứng ngay cạnh nghe.', [
    { k: 'ma', l: 'Nói lóng cho gia đình hiểu mình đang gặp nạn', ai: { smart: 1.3, w: 1 }, run: function (l, r, log) { if (ch(r, 0.35) && E.khFree) E.khFree(l, log, 'Gia đình hiểu câu nói lóng, báo ngay cho công an và đại sứ quán. Ít tuần sau, cảnh sát Campuchia ập vào trại.'); else { fx(l, { hap: 2 }); log('Mẹ ngập ngừng hỏi lại, bạn không dám nói thêm. Ít nhất cả nhà biết bạn còn sống.', 'neutral'); } } },
    { k: 'on', l: 'Nói dối là mình vẫn ổn để gia đình yên tâm', ai: { w: 0.7 }, run: function (l, r, log) { fx(l, { hap: -3 }); log('"Con vẫn ổn, công việc tốt lắm." Cúp máy, bạn quay mặt đi cho quản lý không thấy nước mắt.', 'bad'); } },
    { k: 'chuoc', l: 'Xin gia đình gom tiền chuộc', ai: { w: 0.8 }, run: function (l, r, log) { log('Bạn nói nhanh số tiền chuộc trước khi bị giật máy.', 'neutral'); if (E.DEC.kh_song) l.pending.unshift(E.DEC.kh_song.make(l, r)); } }
  ]);
  var KH_EV = ['kh_chi_tieu', 'kh_nan_nhan', 'kh_om', 'kh_ban', 'kh_dong_doi', 'kh_co_hoi', 'kh_goi_nha'];
  E.HOOKS.year.unshift(function (l, r, log, a) { // đặt đầu danh sách: độc lập với các hook khác
    if (!trapped(l)) return;
    if (l.flags.khSince == null) l.flags.khSince = a;
    var seen = l.flags.khLines || (l.flags.khLines = {}), left = KH_LINES.filter(function (t, i) { return !seen[i]; });
    if (left.length) { var t = U.pick(r, left); seen[KH_LINES.indexOf(t)] = 1; log(t, 'bad'); }
    if (l.pending.some(function (d) { return /^kh_/.test(d.id); })) return;
    var used = l.flags.khEvAt || (l.flags.khEvAt = {});
    var pool = KH_EV.filter(function (id) { return (used[id] == null || a - used[id] >= 2) && (id !== 'kh_co_hoi' || l.flags.khMap || l.flags.khAlly || a - l.flags.khSince >= 2); });
    if (!pool.length) return; var id = U.pick(r, pool); used[id] = a; l.pending.push(E.DEC[id].make(l, r));
  });
  // việc làm riêng trong trại
  function KA(id, label, text, run) {
    SC(id, { title: label, tone: 'dark', valid: trapped, text: text, opts: [{ k: 'lam', l: 'Làm', ai: { w: 1 }, run: function (l, r, log) { (l.flags.khAct || (l.flags.khAct = {}))[id] = l.age; run(l, r, log); } }, { k: 'thoi', l: 'Thôi', ai: { w: 0.1 }, run: function () { } }] });
    A(id, '🔒 Trong trại lừa đảo', label, { sc: id, trap: true, avail: function (l) { if (!trapped(l)) return 'Không áp dụng'; return (l.flags.khAct || {})[id] === l.age ? 'Đã làm việc này trong năm nay' : true; }, ai: { w: 0.2 } });
  }
  KA('kh_act_chi_tieu', 'Cắm mặt làm đủ chỉ tiêu cho qua ngày', 'Làm đủ chỉ tiêu thì không bị đánh, nhưng phải lừa thêm người khác.', function (l, r, log) { fx(l, { hap: -2, karma: -3 }); stress(l, 3); log('Bạn cắm mặt làm đủ chỉ tiêu. Được yên thân thêm một tháng.', 'neutral'); });
  KA('kh_act_cham', 'Lén làm chậm, để "con mồi" nghi ngờ', 'Cố tình để lộ sơ hở cho người bị lừa nhận ra — nếu bị phát hiện sẽ bị phạt nặng.', function (l, r, log) { fx(l, { karma: 3 }); if (ch(r, 0.35)) shock(l, log, 'Bị phát hiện, bạn bị chích điện giữa phòng.', 10); else log('Mấy người bạn "chăm" đều nhận ra trò lừa và chặn liên lạc. Bạn thở phào.', 'neutral'); });
  KA('kh_act_ban', 'Đùm bọc người cùng phòng', 'Chia nhau phần ăn, thay nhau canh cho người kia ngủ.', function (l, r, log) { l.flags.khAlly = true; fx(l, { soc: 3, hap: 1, karma: 2 }); log('Mấy người cùng phòng đùm bọc nhau, hứa ai về được trước sẽ báo tin cho gia đình người còn lại.', 'good'); });
  KA('kh_act_quan_sat', 'Âm thầm ghi nhớ giờ đổi ca, lối thoát', 'Ghi nhớ giờ đổi ca, chỗ tường thấp, hướng ra đường lớn.', function (l, r, log) { if (ch(r, 0.15)) { fx(l, { hea: -5 }); log('Bảo vệ nghi bạn lảng vảng gần cổng, bạn ăn mấy cú đá.', 'bad'); } else { l.flags.khMap = true; fx(l, { kno: 1 }); log('Bạn đã nhớ được giờ đổi ca và đoạn tường thấp nhất phía sau khu nhà.', 'neutral'); } });
  KA('kh_act_nho', 'Nghĩ về gia đình, tự nhủ phải sống để về', 'Mỗi đêm nhắm mắt nghĩ về nhà để giữ lấy hy vọng.', function (l, r, log) { fx(l, { hap: 2 }); stress(l, -4); log(U.pick(r, ['Bạn nhắm mắt nghĩ về bữa cơm ở nhà, tự nhủ: phải sống để về.', 'Bạn nhẩm lại số điện thoại của gia đình, sợ một ngày mình quên mất.', 'Bạn hát thầm bài hát ngày bé, nước mắt chảy nhưng lòng vững lại.']), 'neutral'); });
  KA('kh_act_cau_cuu', 'Tìm cách mượn điện thoại cầu cứu', 'Mượn lén điện thoại của người khác để nhắn cho gia đình, đại sứ quán.', function (l, r, log) { if (E.khPhone) E.khPhone(l, r, log); });
  KA('kh_act_tron', 'Liều mình trốn thoát', 'Trèo rào, vượt bảo vệ — có thể bị bắt lại, bị đánh, thậm chí mất mạng.', function (l, r, log) { if (E.khEscape) E.khEscape(l, r, log); });
  KA('kh_act_chuoc', 'Nhắn gia đình gom tiền chuộc', 'Xin gia đình gom tiền chuộc bạn ra.', function (l, r, log) { if (E.DEC.kh_song) l.pending.unshift(E.DEC.kh_song.make(l, r)); });

  // ===================================================================
  // 3. CHU CẤP CÓ KIỂM SOÁT: CĂNG THẲNG, KÉM VUI
  // ===================================================================
  E.HOOKS.year.unshift(function (l, r, log, a) {
    if (!E.sponsorActive || !E.sponsorActive(l) || !free(l)) return;
    var s = l.flags.sponsor, c = s.control || 35;
    stress(l, Math.round(4 + c / 10)); fx(l, { hap: -Math.round(1 + c / 20) });
    if (s.feltAt == null || a - s.feltAt >= ((s.feltN = s.feltN || 0) >= 3 ? 5 : 2)) { s.feltAt = a; s.feltN++; log(U.pick(r, c >= 60 ? ['Sống bằng tiền chu cấp của ' + s.name + ', bạn phải báo cáo từng cuộc gặp, từng tin nhắn. Bạn thấy mình như sống trong chiếc lồng mạ vàng.', 'Mỗi lần ra ngoài đều phải xin phép ' + s.name + '. Tiền thì đủ, nhưng bạn mất ngủ triền miên.'] : ['Khoản chu cấp của ' + s.name + ' giúp đỡ chật vật, nhưng bạn luôn thấy mình nợ người ấy điều gì đó.', 'Bạn bè hỏi chuyện tình cảm, bạn chỉ cười trừ. Những ràng buộc với ' + s.name + ' khiến bạn ngày càng ít nói về mình.']), 'bad'); }
  });
  var snA = E.DEC.sn_loi_moi; if (snA) { var snAp = snA.apply; snA.apply = function (l, d, k) { var r0 = snAp.apply(this, arguments); if (k === 'accept' && E.sponsorActive && E.sponsorActive(l)) stress(l, 4); return r0; }; }

  // ===================================================================
  // 4. CHI PHÍ SINH HOẠT THEO MỨC SỐNG
  // ===================================================================
  E.wealthLivingK = function (l, income) {
    var b = Math.max(1, l.base || 1), own = E.netWorth ? E.netWorth(l) : (l.money || 0), p = l.partner && l.partner.status !== 'dating' && l.partner.alive !== false ? l.partner : null;
    var R = (Math.max(0, income || 0) + (p && p.inc > 0 && isFinite(p.inc) ? p.inc * 12 : 0)) / b, W = own / b, k = 1;
    if (W >= 500 || R >= 15) k = 2.6; else if (W >= 100 || R >= 5) k = 1.8; else if (W >= 20 || R >= 2.2) k = 1.35; else if (R < 0.6 && W < 1) k = 0.8;
    if (l.spend === 'save' && k > 1) k = 1 + (k - 1) * 0.5;
    l.flags.livingK = k; return k;
  };
  E.livingLabel = function (l) { var k = l.flags.livingK || 1; return k >= 2.6 ? 'rất giàu' : k >= 1.8 ? 'giàu' : k >= 1.35 ? 'khá giả' : k < 1 ? 'eo hẹp' : 'bình thường'; };

  // ===================================================================
  // 5. ĐÁM CƯỚI: NƠI TỔ CHỨC, NHẪN CƯỚI, BỐ MẸ HỖ TRỢ
  // ===================================================================
  function support(l) { var f = l.fam || {}, P = parentsAlive(l); if (!P.m && !P.b) return 0; if (f.elite && l.flags.eliteFollow && !l.flags.eliteCut) return 1; return [0, 0, 0, 0.15, 0.35, 0.6][f.q || 0] || 0; }
  var VENUE = [
    { k: 'nho', vn: 'Đăng ký kết hôn, làm vài mâm cơm thân mật', w: 'Đăng ký kết hôn, ăn mừng nhỏ với người thân', c: 10, g: 0.5, t: 'làm vài mâm cơm thân mật' },
    { k: 'que', vn: 'Cỗ cưới tại nhà / ở quê, dựng rạp', w: 'Tiệc cưới tại nhà, sân vườn', c: 90, g: 0.9, t: 'dựng rạp làm cỗ ở nhà, cả xóm đến chung vui' },
    { k: 'nha_hang', vn: 'Tiệc cưới ở nhà hàng', w: 'Tiệc cưới ở nhà hàng, hội trường', c: 230, g: 0.8, t: 'đãi tiệc ở nhà hàng tiệc cưới' },
    { k: 'khach_san', vn: 'Tiệc cưới ở khách sạn 5 sao', w: 'Tiệc cưới ở khách sạn sang trọng', c: 900, g: 0.6, t: 'tổ chức ở sảnh tiệc khách sạn 5 sao' },
    { k: 'nuoc_ngoai', vn: 'Cưới ở nước ngoài (Bali, Phuket, Jeju…)', w: 'Cưới ở nước ngoài (destination wedding)', c: 650, g: 0.2, t: 'tổ chức lễ cưới ở nước ngoài, chỉ mời người thân và bạn bè thân thiết' },
    { k: 'sieu', vn: 'Siêu đám cưới, gia đình lo trọn gói', w: 'Đám cưới xa hoa, gia đình lo trọn gói', c: 4000, g: 0.5, t: 'tổ chức một siêu đám cưới, gia đình lo trọn gói từ hoa tươi đến ca sĩ', elite: true }
  ];
  function venueCost(l, v) { return V(l, v.c); }
  function affordable(l, v) { var c = venueCost(l, v), s = support(l); if (v.elite) return s >= 1; return v.k === 'nho' || Math.max(0, l.money) + c * (s + 0.15) + c * v.g * 0.6 >= c; }
  SC('cuoi_to_chuc', {
    title: 'Tổ chức đám cưới', prep: function (l) { return { pid: l.partner ? l.partner.name : '' }; },
    valid: function (l, d) { return !!(l.partner && l.partner.alive !== false && l.partner.status === 'dating' && (!d || !d.pid || d.pid === l.partner.name)); },
    text: function (l, d) { var s = support(l); return 'Hai gia đình bàn chuyện cưới hỏi cho bạn và ' + d.pid + '. ' + (s >= 1 ? 'Gia đình bạn muốn lo trọn gói một đám cưới thật lớn.' : s > 0 ? 'Bố mẹ sẵn sàng lo khoảng ' + Math.round(s * 100) + '% chi phí, nhà bên kia cũng góp thêm một phần.' : 'Bố mẹ không có điều kiện, chi phí chủ yếu do hai bạn tự lo, nhà bên kia góp thêm một ít.') + ' Tiền mừng cưới thường bù lại được một phần. Bạn muốn tổ chức ở đâu?'; },
    opts: VENUE.map(function (v) {
      return { k: v.k, l: function (l) { return vnd(l) ? v.vn : v.w; }, h: function (l) { return 'Khoảng ' + mo(l, venueCost(l, v)); }, req: function (l) { return affordable(l, v); }, ai: { w: v.k === 'que' || v.k === 'nha_hang' ? 1.2 : v.k === 'nho' ? 0.6 : 0.5 },
        run: function (l, r, log, d) { wedding(l, r, log, d, v); } };
    })
  });
  function wedding(l, r, log, d, v) {
    var p = l.partner; if (!p || p.name !== d.pid) return;
    var c = venueCost(l, v), s = v.elite ? 1 : support(l), pf = v.elite ? 0 : c * (0.1 + r() * 0.12), gift = c * v.g * (0.8 + r() * 0.4);
    H.cash(l, -c, 'Tổ chức đám cưới'); if (s > 0) H.cash(l, c * s, 'Bố mẹ lo đám cưới'); if (pf > 0 && v.k !== 'nho') H.cash(l, pf, 'Nhà bên kia góp đám cưới'); H.cash(l, gift, 'Tiền mừng cưới');
    p.status = 'married'; p.since = l.age; l.st.hap += 10; l.st.soc += 5;
    log((vnd(l) ? 'Tổ chức đám cưới với ' : 'Kết hôn với ') + p.name + ': ' + v.t + (s >= 1 ? ', bố mẹ lo trọn gói' : s > 0 ? ', bố mẹ lo ' + Math.round(s * 100) + '% chi phí' : '') + '.', 'big');
    H.mem(l, 'Ngày cưới ' + p.name + ' — bạn cười không ngớt.', 5);
    l.pending.unshift(E.DEC.cuoi_nhan.make(l, r));
  }
  var RING = [
    { k: 'tron', l: 'Nhẫn cưới vàng trơn 18K', c: 9 }, { k: 'kc', l: 'Nhẫn cưới đính kim cương nhỏ', c: 45 },
    { k: 'kc_lon', l: 'Nhẫn kim cương 1 carat', c: 280 }, { k: 'hieu', l: 'Nhẫn thương hiệu xa xỉ (Cartier, Tiffany…)', c: 400 },
    { k: 'gia_truyen', l: 'Dùng nhẫn gia truyền của gia đình', c: 0 }
  ];
  SC('cuoi_nhan', {
    title: 'Nhẫn cưới', valid: function (l) { return !!(l.partner && l.partner.status === 'married'); },
    text: function (l) { return 'Chọn cặp nhẫn cưới cho bạn và ' + l.partner.name + '.'; },
    opts: RING.map(function (x) { return { k: x.k, l: x.l, h: function (l) { return x.c ? 'Khoảng ' + mo(l, V(l, x.c)) : 'Không tốn tiền'; }, req: function (l) { return !x.c || l.money >= V(l, x.c); }, ai: { w: x.k === 'tron' ? 1.3 : x.k === 'kc' ? 1 : x.k === 'gia_truyen' ? 0.5 : 0.3 },
      run: function (l, r, log) { if (x.c) H.cash(l, -V(l, x.c), 'Nhẫn cưới'); l.flags.ring = x.l; log(x.k === 'gia_truyen' ? 'Hai bạn đeo cặp nhẫn gia truyền của gia đình, mẹ dặn phải giữ cho đời sau.' : 'Trao nhau ' + x.l.toLowerCase() + ' trong ngày cưới.', 'good'); } }; })
  });
  var mA = E.DEC.marry, mAp = mA.apply, mMk = mA.make;
  mA.make = function (l, r) { var d = mMk.apply(this, arguments); d.text = d.text.replace(/ Một đám cưới ở quê tốn khoảng [^.]*\./, ' Cưới to hay nhỏ, ở quê, nhà hàng, khách sạn hay ở nước ngoài — tùy điều kiện của hai gia đình.'); d.opts.forEach(function (o) { if (o.k === 'marry' && d.opts.some(function (x) { return x.k === 'small'; })) o.h = 'Chọn nơi tổ chức, nhẫn cưới'; }); return d; };
  mA.apply = function (l, d, k, r, log) { if (k === 'marry' && d.opts.some(function (o) { return o.k === 'small'; }) && l.partner) { l.pending.unshift(E.DEC.cuoi_to_chuc.make(l, r)); return; } return mAp.apply(this, arguments); };

  // ===================================================================
  // 6. CHIA TAY CÓ LÝ DO
  // ===================================================================
  E.breakupWhy = function (l, p, r) {
    var s = l.flags.sponsor, gap = Math.abs((p.age || l.age) - l.age);
    if (s && s.active && s.name === p.name) return U.pick(r, [
      { t: p.name + ' ngỏ lời muốn cưới, nhưng bạn không muốn gắn cả đời mình vào một mối quan hệ bị kiểm soát, nên chủ động nói lời chia tay.', m: 'Ngày từ chối lời cầu hôn của ' + p.name + ' để lấy lại tự do.' },
      { t: p.name + ' đòi bạn cắt đứt bạn bè, chỉ biết đến mình. Bạn quyết định trả lại khoản chu cấp và tự do cho chính mình.' },
      { t: 'Gia đình ' + p.name + ' phát hiện chuyện chu cấp và làm ầm lên, người ấy chọn rút lui.' },
      { t: p.name + ' có "người mới" trẻ hơn. Khoản chu cấp dừng lại cùng một tin nhắn chia tay ngắn ngủi.', m: 'Tin nhắn chia tay lạnh lùng của ' + p.name + '.' }
    ]);
    var L = [
      { t: 'Cãi nhau vì những chuyện nhỏ nhặt mãi thành mệt mỏi, hai người quyết định dừng lại.' },
      { t: 'Cảm giác ban đầu nhạt dần, cả hai thừa nhận đã không còn yêu như trước.' },
      { t: 'Bạn phát hiện ' + p.name + ' nhắn tin mập mờ với người khác.', m: 'Đêm phát hiện ' + p.name + ' không chung thủy.' },
      { t: 'Gia đình hai bên phản đối, không ai đủ can đảm đi tiếp.' },
      { t: p.name + ' muốn cưới ngay, còn bạn thì chưa sẵn sàng.' },
      { t: 'Bạn muốn ổn định, ' + p.name + ' lại chỉ muốn tự do, đi đây đi đó.' },
      { t: 'Ghen tuông, kiểm tra điện thoại liên tục khiến bạn thấy ngột ngạt.' },
      { t: 'Chuyện tiền bạc: ' + p.name + ' vay tiền mãi không trả, lời qua tiếng lại thành rạn nứt.' },
      { t: 'Quan điểm sống khác nhau: chuyện con cái, chỗ ở, công việc mãi không tìm được tiếng nói chung.' }
    ];
    if (l.age < 20) L.push({ t: 'Tình yêu tuổi học trò, lên lớp mới, mỗi người một hướng.' });
    if (gap >= 10) L.push({ t: 'Khoảng cách ' + gap + ' tuổi khiến hai người khó hiểu nhau trong nhiều chuyện.' });
    if (l.abroad || l.cityStudent || l.movedTo) L.push({ t: 'Yêu xa, những cuộc gọi thưa dần rồi tắt hẳn.', m: 'Cuộc gọi cuối cùng với ' + p.name + ' trước khi mối tình yêu xa khép lại.' });
    if (l.job && l.mind && l.mind.stress >= 60) L.push({ t: 'Bạn lao vào công việc, ít thời gian cho nhau, ' + p.name + ' thấy mình bị bỏ rơi.' });
    return U.pick(r, L);
  };

  // ===================================================================
  // 7. MUA ĐIỆN THOẠI, LAPTOP, PC — DÒNG MÁY THEO TỪNG NĂM
  // ===================================================================
  // Giá theo mặt bằng năm 2026 (triệu đ, máy chính hãng ở Việt Nam), mỗi năm tăng nhẹ ~2%; đời mới ra mỗi năm.
  function infl(l) { return Math.pow(1.02, Math.max(0, yr(l) - 2026)); }
  function lineup(l, kind) {
    var y = yr(l), N = y - 2008, A = y - 2024, F = y - 2025, S = y - 2000, Z = y - 2018;
    var L = {
      ios: [['iPhone ' + N + ' Pro Max', 37], ['iPhone ' + N + ' Pro', 32], F >= 1 ? ['iPhone Fold ' + F, 55] : null, ['iPhone Air ' + A, 28], ['iPhone ' + N, 23], ['iPhone ' + N + 'e', 17], ['iPhone ' + (N - 1) + ' Pro Max (đời trước)', 27], ['iPhone ' + (N - 2) + ' (đời cũ)', 13]],
      samsung: [['Galaxy S' + S + ' Ultra', 33], ['Galaxy S' + S, 22], ['Galaxy Z Fold' + Z, 45], ['Galaxy Z Flip' + Z, 26], ['Galaxy A' + (y - 1969), 10], ['Galaxy A' + (y - 1989), 7]],
      xiaomi: [['Xiaomi ' + (y - 2009) + ' Ultra', 30], ['Xiaomi ' + (y - 2009), 20], ['POCO F' + (y - 2018), 11], ['Redmi Note ' + (y - 2011) + ' Pro', 8], ['Redmi ' + (y - 2011), 4]],
      oppo: [['OPPO Find N' + (y - 2020), 45], ['OPPO Find X' + (y - 2016) + ' Pro', 26], ['OPPO Reno' + (y - 2011), 12], ['OPPO A' + (y - 2020), 5]],
      huawei: [['Huawei Mate X' + (y - 2018), 50], ['Huawei Mate ' + (y - 1945) + ' Pro', 30], ['Huawei Pura ' + (y - 1945) + ' Ultra', 33], ['Huawei nova ' + (y - 2011), 11]],
      vivo: [['vivo X' + (y - 1725) + ' Pro', 24], ['vivo V' + (y - 1990), 11], ['vivo Y' + (y - 1990 + 70), 5]],
      pixel: [['Google Pixel ' + (y - 2015) + ' Pro XL', 30], ['Google Pixel ' + (y - 2015), 22], ['Google Pixel ' + (y - 2015) + 'a', 13]],
      gaming: [['ASUS ROG Phone ' + (y - 2016), 28], ['RedMagic ' + (y - 2014) + ' Pro', 19], ['Lenovo Legion Tab Phone ' + (y - 2023), 16], ['POCO F' + (y - 2018) + ' Pro', 13]],
      lt_gaming: [['ASUS ROG Strix SCAR (' + y + ')', 95], ['MSI Raider (' + y + ')', 85], ['Lenovo Legion Pro 7 (' + y + ')', 65], ['ASUS TUF Gaming (' + y + ')', 28], ['Acer Nitro (' + y + ')', 22]],
      lt_vp: [['MacBook Pro ' + (y - 2023) + ' (chip M' + (y - 2020) + ' Pro)', 60], ['MacBook Air (chip M' + (y - 2020) + ')', 28], ['Dell XPS ' + (y - 2010), 45], ['Lenovo ThinkPad X1 Carbon Gen ' + (y - 2012), 40], ['ASUS Zenbook (' + y + ')', 22], ['HP Pavilion (' + y + ')', 16], ['Acer Aspire (' + y + ')', 12]],
      pc: [['PC gaming cao cấp (card RTX ' + (5 + Math.floor((y - 2025) / 2)) + '090)', 120], ['PC gaming tầm trung (card RTX ' + (5 + Math.floor((y - 2025) / 2)) + '070)', 45], ['PC gaming phổ thông (card RTX ' + (5 + Math.floor((y - 2025) / 2)) + '060)', 25], ['PC đồ họa, dựng phim (workstation)', 80], ['PC văn phòng', 11], ['iMac (chip M' + (y - 2020) + ')', 38]]
    };
    return (L[kind] || []).filter(Boolean).map(function (x) { return { n: x[0], c: x[1] * infl(l) }; });
  }
  E.techLineup = lineup;
  var KIND = { phone: [['ios', 'iPhone (iOS)'], ['samsung', 'Samsung'], ['xiaomi', 'Xiaomi'], ['oppo', 'OPPO'], ['huawei', 'Huawei'], ['vivo', 'vivo'], ['pixel', 'Google Pixel'], ['gaming', 'Điện thoại gaming']], laptop: [['lt_gaming', 'Laptop gaming'], ['lt_vp', 'Laptop văn phòng, học tập, MacBook']], pc: [['pc', 'Máy tính để bàn (PC)']] };
  function buyCost(l, x) { return V(l, x.c); }
  function canBuy(l, x) { return l.age < 18 && !l.indep ? true : l.money >= buyCost(l, x); }
  SC('cn_mua', {
    title: 'Mua đồ công nghệ', valid: function (l) { return free(l); },
    text: function (l) { var t = l.flags.tech || {}; return 'Năm ' + yr(l) + '. ' + (t.phone ? 'Điện thoại đang dùng: ' + t.phone.n + ' (mua năm ' + t.phone.y + '). ' : '') + (t.laptop ? 'Laptop: ' + t.laptop.n + '. ' : '') + (t.pc ? 'PC: ' + t.pc.n + '. ' : '') + 'Bạn muốn mua gì?'; },
    opts: [
      { k: 'phone_ios', l: 'Điện thoại iPhone (iOS)', ai: { w: 1 }, run: function (l, r) { l.pending.unshift(E.DEC.cn_mau.make(l, r, { kind: 'ios' })); } },
      { k: 'phone_and', l: 'Điện thoại Android', h: 'Samsung, Xiaomi, OPPO, Huawei, vivo, Google Pixel', ai: { w: 1 }, run: function (l, r) { l.pending.unshift(E.DEC.cn_hang.make(l, r)); } },
      { k: 'phone_game', l: 'Điện thoại gaming', h: 'ROG Phone, RedMagic, Legion…', ai: { w: 0.4 }, run: function (l, r) { l.pending.unshift(E.DEC.cn_mau.make(l, r, { kind: 'gaming' })); } },
      { k: 'lt_gaming', l: 'Laptop gaming', ai: { w: 0.4 }, run: function (l, r) { l.pending.unshift(E.DEC.cn_mau.make(l, r, { kind: 'lt_gaming' })); } },
      { k: 'lt_vp', l: 'Laptop văn phòng, học tập, MacBook', ai: { w: 0.6 }, run: function (l, r) { l.pending.unshift(E.DEC.cn_mau.make(l, r, { kind: 'lt_vp' })); } },
      { k: 'pc', l: 'Máy tính để bàn (PC)', h: 'Gaming, đồ họa, văn phòng, iMac', ai: { w: 0.4 }, run: function (l, r) { l.pending.unshift(E.DEC.cn_mau.make(l, r, { kind: 'pc' })); } },
      { k: 'thoi', l: 'Thôi, máy cũ vẫn dùng tốt', ai: { w: 0.5 }, run: function () { } }
    ]
  });
  SC('cn_hang', {
    title: 'Chọn hãng Android', valid: function (l) { return free(l); }, text: 'Bạn chọn hãng nào?',
    opts: KIND.phone.filter(function (x) { return x[0] !== 'ios' && x[0] !== 'gaming'; }).map(function (x) { return { k: x[0], l: x[1], h: function (l) { return lineup(l, x[0]).slice(0, 3).map(function (m) { return m.n; }).join(', ') + '…'; }, ai: { w: 1 }, run: function (l, r) { l.pending.unshift(E.DEC.cn_mau.make(l, r, { kind: x[0] })); } }; })
  });
  function slot(kind) { return /^lt_/.test(kind) ? 'laptop' : kind === 'pc' ? 'pc' : 'phone'; }
  SC('cn_mau', {
    title: function (l, d) { var all = KIND.phone.concat(KIND.laptop, KIND.pc); var x = all.filter(function (k) { return k[0] === d.kind; })[0]; return x ? x[1] + ' · đời ' + yr(l) : 'Chọn máy'; },
    prep: function (l, r, a) { return { kind: (a && a.kind) || 'ios', y: yr(l) }; },
    valid: function (l, d) { return free(l) && (!d || !d.y || d.y === yr(l)); },
    text: function (l, d) { return 'Các dòng máy đang bán năm ' + yr(l) + '. Giá chính hãng tham khảo.' + (l.age < 18 && !l.indep ? ' Bố mẹ sẽ cân nhắc ngân sách gia đình.' : ' Tiền của bạn: ' + mo(l, Math.max(0, l.money)) + '.'); },
    opts: Array.apply(null, Array(8)).map(function (_, i) {
      return { k: 'm' + i, l: function (l, d) { var m = lineup(l, d.kind)[i]; return m ? m.n : ''; }, h: function (l, d) { var m = lineup(l, d.kind)[i]; return m ? mo(l, buyCost(l, m)) : ''; }, req: function (l, d) { var m = lineup(l, d.kind)[i]; return !!m && canBuy(l, m); }, ai: { w: i >= 2 ? 1 : 0.5 },
        run: function (l, r, log, d) { var m = lineup(l, d.kind)[i]; if (m) buy(l, r, log, d.kind, m); } };
    }).concat([{ k: 'thoi', l: 'Thôi, để dành tiền', ai: { w: 0.3 }, run: function () { } }])
  });
  function buy(l, r, log, kind, m) {
    var c = buyCost(l, m), s = slot(kind), T = l.flags.tech || (l.flags.tech = {}), old = T[s];
    if (l.age < 18 && !l.indep) { var bill = E.childExpense ? E.childExpense(l, c, 'Mua ' + m.n, false) : { ok: false, note: 'Bố mẹ chưa đồng ý.' }; if (!bill.ok) { log('Xin bố mẹ mua ' + m.n + '. ' + bill.note, 'neutral'); fx(l, { hap: -2 }); return; } log('Bố mẹ mua cho bạn ' + m.n + '. ' + bill.note, 'good'); }
    else { if (l.money < c) return; H.cash(l, -c, 'Mua ' + m.n); log((old ? 'Lên đời từ ' + old.n + ' lên ' : 'Mua ') + m.n + '.', 'good'); }
    T[s] = { n: m.n, y: yr(l), c: c }; fx(l, { hap: c > l.base * 0.2 ? 5 : 3 });
    if (/gaming|ROG|RedMagic|Legion|RTX/.test(m.n) && l.talent === 'game') l.skill = Math.min(100, (l.skill || 20) + 3);
    if (s !== 'phone' && /văn phòng|MacBook|ThinkPad|XPS|Zenbook|đồ họa/.test(m.n)) fx(l, { kno: 1 });
  }
  A('mua_cong_nghe', 'Giải trí', 'Mua điện thoại, laptop, PC', { min: 10, sc: 'cn_mua', avail: function (l) { return free(l) ? true : 'Không áp dụng'; }, ai: { w: 0.15 } });
  if (E.SPEND_ACTS && E.SPEND_ACTS.indexOf('mua_cong_nghe') < 0) E.SPEND_ACTS.push('mua_cong_nghe');
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
