/* Một Đời — v7.2.0: tính cách bố mẹ và drama gia đình
   · bố và mẹ mỗi người một tính cách (16 kiểu): nghiêm khắc, chiều con, bao bọc, gia trưởng, hay so sánh "con nhà người ta",
     kỳ vọng cao, cởi mở, nóng tính, tằn tiện, sĩ diện, tin bói toán, cuồng công việc, hài hước, hay lo, thiên vị, ấm áp.
     Tính cách ảnh hưởng tuổi thơ (chỉ số, lời kể) và sinh ra tình huống riêng: so sánh với con nhà người ta, ép chọn ngành,
     cấm cưới vì "không hợp tuổi", đám cưới phải to cho bằng họ hàng, thiên vị trong chia tài sản
   · drama gia đình ở mọi hoàn cảnh, không chỉ nhà giàu:
     - nhà giàu: anh chị em tranh giành tài sản khi bố mẹ còn sống, kiện tụng chia di sản, tranh ghế chủ tịch tập đoàn của gia đình
     - nhà bình thường / khó khăn: tranh mảnh đất hương hỏa, đùn đẩy việc nuôi bố mẹ già, anh chị em nợ nần làm khổ cả nhà,
       họ hàng mượn sổ đỏ đi thế chấp, bố mẹ cãi nhau đòi ly thân, con riêng xuất hiện ở đám tang, di chúc thiên vị */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function fx(l, o) { H.fx(l, o); }
  function mo(l, v) { return H.money(l, v); }
  function stress(l, x) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + x, 0, 100); }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function T(id, when, p, cd, max) { E.TRIG.push({ id: id, when: function (l, a) { return free(l) && when(l, a); }, p: p, cd: cd || 4, max: max || 1 }); }
  function EV(c, p, cd, run) { E.EVENTS.push({ c: c, p: p, cd: cd, run: run }); }
  function sibs(l) { return H.sibs ? H.sibs(l) : []; }
  function call(l, s) { return H.sibCall ? H.sibCall(l, s) : 'anh chị'; }
  function adultSibs(l) { return sibs(l).filter(function (s) { return E.sibAge(l, s) >= 20; }); }
  function mom(l) { return !!l.fam.mAlive; }
  function dad(l) { return !!l.fam.fAlive && !l.fam.noDad; }
  function both(l) { return mom(l) && dad(l); }
  function anyParent(l) { return mom(l) || dad(l); }
  function pAge(l) { var f = l.fam, a = []; if (mom(l)) a.push(f.mAge + l.age); if (dad(l)) a.push(f.fAge + l.age); return a.length ? Math.max.apply(null, a) : 0; }
  function estate(l) { var q = l.fam.q || 3; return H.housePrice(l) * [0, 0.35, 0.6, 1, 1.8, 4][q] * (l.fam.elite ? 6 : 1); }

  // ===================================================================
  // 1. TÍNH CÁCH BỐ MẸ
  // ===================================================================
  var TR = {
    nghiem: { n: 'nghiêm khắc', d: 'đặt nhiều quy tắc, giờ nào việc nấy', w: 3, st: { kno: 2, hap: -2 } },
    chieu: { n: 'chiều con', d: 'con muốn gì cũng chiều', w: 2, st: { hap: 3, kno: -1 } },
    bao_boc: { n: 'bao bọc', d: 'lo cho con từng li từng tí, ít cho con tự làm', w: 2, st: { soc: -2 } },
    gia_truong: { n: 'gia trưởng', d: 'chuyện lớn nhỏ trong nhà đều một mình quyết', w: 2, st: { hap: -3 }, m: 0.4 },
    so_sanh: { n: 'hay so sánh', d: 'hay nhắc "con nhà người ta"', w: 2, st: { hap: -2, kno: 1 } },
    ky_vong: { n: 'kỳ vọng cao', d: 'muốn con học giỏi, đỗ trường top', w: 3, st: { kno: 3, hap: -2 } },
    coi_mo: { n: 'cởi mở', d: 'lắng nghe, để con tự chọn đường', w: 2.5, st: { hap: 3, soc: 2 } },
    nong_tinh: { n: 'nóng tính', d: 'dễ nổi nóng, nói nặng lời', w: 2, st: { hap: -4 } },
    tan_tien: { n: 'tằn tiện', d: 'tiêu đồng nào chắc đồng ấy', w: 2.5, st: {} },
    si_dien: { n: 'sĩ diện', d: 'coi trọng mặt mũi với họ hàng, làng xóm', w: 2, st: {} },
    tam_linh: { n: 'tin bói toán', d: 'việc gì cũng xem ngày, xem tuổi', w: 1.5, st: {} },
    cuong_viec: { n: 'cuồng công việc', d: 'đi sớm về khuya, ít ở nhà', w: 2, st: { hap: -2, soc: -1 } },
    hai_huoc: { n: 'hài hước', d: 'bữa cơm lúc nào cũng có tiếng cười', w: 2, st: { hap: 4 } },
    hay_lo: { n: 'hay lo', d: 'lo xa đủ chuyện, gọi điện hỏi thăm liên tục', w: 2, st: { soc: -1 } },
    thien_vi: { n: 'thiên vị', d: 'thương một đứa con hơn những đứa khác', w: 1.2, st: {} },
    am_ap: { n: 'ấm áp', d: 'hay ôm con, nói lời yêu thương', w: 2.5, st: { hap: 4, soc: 1 } }
  };
  E.PARENT_TRAITS = TR;
  function wk(h) { var tot = 0, k; for (k in TR) tot += TR[k].w; var x = U.rand(h) * tot; for (k in TR) { x -= TR[k].w; if (x <= 0) return k; } return 'am_ap'; }
  function tr(l, who) { var f = l.fam || {}; return who === 'm' ? f.mTrait : f.fTrait; }
  function has(l, k) { return (mom(l) && l.fam.mTrait === k) || (dad(l) && l.fam.fTrait === k); }
  function whoHas(l, k) { return mom(l) && l.fam.mTrait === k ? 'mẹ' : dad(l) && l.fam.fTrait === k ? 'bố' : null; }
  E.parentTraitText = function (l, who) { var k = tr(l, who), t = k && TR[k]; return t ? t.n + ' — ' + t.d : ''; };
  function assign(l) {
    var f = l.fam; if (f.mTrait && f.fTrait) return;
    var h = { rs: (l.rs ^ 0x6a7e3c1) | 0 };
    f.mTrait = f.mTrait || wk(h); f.fTrait = f.fTrait || wk(h);
    for (var i = 0; i < 3 && f.fTrait === f.mTrait; i++) f.fTrait = wk(h);
    if (f.elite && U.rand(h) < 0.5) f.fTrait = U.rand(h) < 0.5 ? 'gia_truong' : 'ky_vong';
    if (f.vice && dad(l) && U.rand(h) < 0.5) f.fTrait = 'nong_tinh';
    if (f.thienVi == null) f.thienVi = U.rand(h) < 0.5; // người thiên vị: thương bạn hơn (true) hay thương anh chị em hơn
  }
  var createLife = E.createLife;
  E.createLife = function (opts) {
    var l = createLife.apply(this, arguments); assign(l);
    [['m', mom(l)], ['f', dad(l)]].forEach(function (x) { if (!x[1]) return; var st = TR[tr(l, x[0])].st; for (var k in st) if (l.st[k] != null) l.st[k] = U.clamp(l.st[k] + st[k], 5, 100); });
    return l;
  };
  // bối cảnh xuất phát nhắc tính cách bố mẹ
  var bc = E.birthContext;
  if (bc) E.birthContext = function (l) {
    var x = bc.apply(this, arguments); if (!x || !l.fam || l.fam.orphan && l.fam.orphan.adopted == null) return x;
    assign(l);
    var s = both(l) ? (l.fam.mTrait === l.fam.fTrait ? 'bố mẹ đều ' + TR[l.fam.mTrait].n : 'bố ' + TR[l.fam.fTrait].n + ', mẹ ' + TR[l.fam.mTrait].n) : mom(l) ? 'mẹ ' + TR[l.fam.mTrait].n : dad(l) ? 'bố ' + TR[l.fam.fTrait].n : '';
    if (s && x.text && x.text.indexOf(s) < 0) {
      // thay câu nuôi dạy chung chung bằng tính cách thật của bố mẹ (tránh mâu thuẫn kiểu "ít so sánh" với bố mẹ "hay so sánh")
      var GEN = /(bố mẹ|mẹ|bố) (coi trọng thành tích|ưu tiên sức khỏe|đặt nhiều quy tắc|khuyến khích tự lập|thường bận công việc|coi trọng nề nếp|quan tâm nhưng hay lo xa|sẵn sàng lắng nghe)[^;.]*/;
      x.text = GEN.test(x.text) ? x.text.replace(GEN, s) : x.text.replace(/\.\s*$/, '') + '; ' + s;
      if (!/\.$/.test(x.text)) x.text += '.';
    }
    return x;
  };
  // tuổi thơ theo tính cách
  var KID = {
    nghiem: ['{P} đặt giờ giới nghiêm 9 giờ tối, trễ một phút là bị phạt quét nhà.', '{P} kiểm tra vở bài tập mỗi tối, chữ xấu là phải viết lại cả trang.'],
    chieu: ['Bạn ăn vạ ở siêu thị, {p} lại mua cho món đồ chơi thứ ba trong tháng.', '{P} lén cho bạn tiền tiêu vặt, dặn đừng nói với ai.'],
    bao_boc: ['Lớn tướng rồi, {p} vẫn không cho bạn ra ngõ chơi một mình.', '{P} không cho bạn đi cắm trại với lớp vì sợ có chuyện.'],
    gia_truong: ['Bữa cơm, {p} nói gì cả nhà phải nghe, không ai dám cãi.', '{P} tự quyết bạn phải học thêm môn gì, không hỏi ý bạn.'],
    so_sanh: ['"Con nhà bác Hùng được học sinh giỏi cấp tỉnh kìa", {p} nhắc lần thứ mười trong tuần.', 'Bạn được 8 điểm, {p} hỏi: "Thế bạn kia được mấy?"'],
    ky_vong: ['{P} dán lịch học kín cả tuần lên tường, kể cả Chủ nhật.', '{P} đăng ký cho bạn ba lớp học thêm cùng lúc.'],
    coi_mo: ['{P} ngồi nghe bạn kể chuyện trường lớp cả buổi tối, không phán xét câu nào.', 'Bạn muốn học vẽ thay vì học thêm toán, {p} gật đầu: "Con thích thì cứ thử."'],
    nong_tinh: ['Làm vỡ cái bát, {p} quát to đến mức hàng xóm phải sang hỏi.', '{P} nổi nóng vì bạn về muộn, ném cả cặp sách ra sân.'],
    tan_tien: ['Áo đồng phục {p} mua rộng hai cỡ, "để mặc được mấy năm".', '{P} tắt điện liên tục: "Tiền điện tháng này lại tăng rồi đấy!"'],
    si_dien: ['Họ hàng đến chơi, {p} bắt bạn đọc thuộc bài thơ cho cả nhà nghe.', '{P} khoe với cả xóm bạn được giấy khen, dù chỉ là giấy khen chuyên cần.'],
    tam_linh: ['{P} đi xem bói về, bảo năm nay bạn "phạm sao", cấm đi chơi xa.', 'Trước kỳ thi, {p} dẫn bạn lên chùa xin lộc, đeo cho bạn cái bùa.'],
    cuong_viec: ['Sinh nhật bạn, {p} lại đi công tác, gọi video chúc mừng lúc đã khuya.', 'Cả tuần bạn chỉ gặp {p} vào bữa sáng Chủ nhật.'],
    hai_huoc: ['{P} giả giọng nhân vật hoạt hình, cả nhà cười đau bụng.', 'Bạn bị điểm kém, {p} pha trò một câu khiến bạn bớt sợ hẳn.'],
    hay_lo: ['Đi học về muộn mười phút, {p} đã gọi bảy cuộc điện thoại.', '{P} nhét vào cặp bạn đủ thứ: áo mưa, thuốc, cả lọ dầu gió.'],
    thien_vi: ['Miếng đùi gà ngon nhất bao giờ {p} cũng gắp cho {fav}.', 'Quần áo mới bao giờ cũng đến tay {fav} trước.'],
    am_ap: ['Tối nào {p} cũng xoa đầu bạn trước khi đi ngủ.', '{P} ôm bạn thật chặt khi bạn khóc vì bị bạn bè trêu.']
  };
  var KIDFX = { nghiem: { kno: 1 }, chieu: { hap: 1 }, bao_boc: { soc: -1 }, gia_truong: { hap: -1 }, so_sanh: { hap: -2 }, ky_vong: { kno: 1, hap: -1 }, coi_mo: { hap: 1, soc: 1 }, nong_tinh: { hap: -2 }, hai_huoc: { hap: 2 }, am_ap: { hap: 2 }, thien_vi: { hap: -1 } };
  EV(function (l, a) { return a >= 4 && a <= 16 && anyParent(l) && !(l.fam.orphan && l.fam.orphan.adopted == null); }, 0.22, 3, function (l, a, r, log) {
    assign(l);
    var w = both(l) ? pick(r, ['m', 'f']) : mom(l) ? 'm' : 'f', k = tr(l, w), lines = KID[k]; if (!lines) return;
    if (k === 'thien_vi' && !sibs(l).length) return;
    if (!l.school) lines = lines.filter(function (x) { return !/trường|học|điểm|vở|thi|lớp|phụ huynh/.test(x); }); if (!lines.length) return;
    var me = l.fam.thienVi, fav = me ? 'bạn' : (sibs(l)[0] ? call(l, sibs(l)[0]) : 'đứa em');
    var p = w === 'm' ? 'mẹ' : 'bố', t = pick(r, lines).replace(/\{P\}/g, U.cap(p)).replace(/\{p\}/g, p).replace(/\{fav\}/g, fav);
    if (k === 'thien_vi' && me) t += ' Anh chị em nhìn bạn, không nói gì.';
    log(t, 'neutral');
    if (KIDFX[k]) fx(l, KIDFX[k]);
    if (k === 'nong_tinh' || k === 'so_sanh') stress(l, 3);
  });

  // con nhà người ta
  SC('ps_con_nha_nguoi_ta', {
    title: '"Con nhà người ta"', prep: function (l, r) { return { w: whoHas(l, 'so_sanh') || 'bố mẹ', x: pick(r, ['đỗ trường chuyên', 'được học bổng du học', 'vừa mua nhà ở thành phố', 'làm ngân hàng lương mấy chục triệu']) }; },
    valid: function (l) { return !!whoHas(l, 'so_sanh'); },
    text: function (l, d) { return 'Bữa cơm, ' + d.w + ' lại nhắc chuyện con bà hàng xóm ' + d.x + '. "Sao con không được như nó?"'; },
    opts: [
      { k: 'co_gang', l: 'Im lặng, tự nhủ sẽ cố gắng hơn', ai: { w: 1.2, amb: 1 }, run: function (l, r, log, d) { fx(l, { kno: 2, hap: -2 }); stress(l, 5); log('Bạn im lặng ăn hết bát cơm, tối đó ngồi học đến khuya. Câu nói ấy cứ lởn vởn trong đầu.', 'neutral'); } },
      { k: 'cai', l: 'Cãi lại: "Con là con, không phải nó"', ai: { w: 0.6, risk: 1 }, run: function (l, r, log, d) { if (ch(r, 0.4)) { log('Bạn nói thẳng. ' + U.cap(d.w) + ' sững người, rồi lần đầu tiên xin lỗi bạn.', 'good'); fx(l, { hap: 3 }); l.fam.cmpStop = true; } else { log('Bạn cãi lại, ' + d.w + ' giận dỗi cả tuần, cả nhà căng như dây đàn.', 'bad'); fx(l, { hap: -4 }); stress(l, 6); } } },
      { k: 'ke', l: 'Tâm sự thật lòng là mình đang áp lực', ai: { w: 0.8, soc: 1 }, run: function (l, r, log, d) { log('Bạn kể mình mệt mỏi thế nào mỗi lần bị so sánh. ' + U.cap(d.w) + ' im lặng hồi lâu: "Bố mẹ chỉ muốn con hơn bố mẹ thôi."', 'neutral'); fx(l, { hap: 1 }); stress(l, -4); } }
    ]
  });
  T('ps_con_nha_nguoi_ta', function (l, a) { return a >= 10 && a <= 25 && !!whoHas(l, 'so_sanh') && !l.fam.cmpStop; }, 0.2, 3, 2);
  // gia trưởng / kỳ vọng cao: ép chọn ngành
  SC('ps_ep_nganh', {
    title: 'Ai chọn ngành cho bạn?', prep: function (l, r) { return { w: whoHas(l, 'gia_truong') || whoHas(l, 'ky_vong') || 'bố mẹ', n: pick(r, isVN(l) ? ['Y đa khoa', 'Công an', 'Sư phạm', 'Ngân hàng', 'Luật'] : ['Y khoa', 'Luật', 'Kỹ thuật', 'Tài chính']) }; },
    valid: function (l) { return !!(whoHas(l, 'gia_truong') || whoHas(l, 'ky_vong')) && !!l.school; },
    text: function (l, d) { return 'Chuẩn bị làm hồ sơ thi đại học, ' + d.w + ' tuyên bố: "Con phải học ' + d.n + '. Bố mẹ đã tính hết rồi."'; },
    opts: [
      { k: 'nghe', l: 'Nghe lời, học ngành ' + 'bố mẹ chọn', ai: { w: 1 }, run: function (l, r, log, d) { l.flags.forcedMajor = d.n; log('Bạn nghe lời, ghi nguyện vọng ' + d.n + '. Giấc mơ riêng cất vào ngăn kéo.', 'neutral'); fx(l, { hap: -3 }); H.mem(l, 'Năm mười tám tuổi, bạn ghi nguyện vọng ' + d.n + ' theo ý ' + d.w + '.', 3); } },
      { k: 'theo_y', l: 'Kiên quyết theo đam mê của mình', ai: { w: 0.8, amb: 1, risk: 0.5 }, run: function (l, r, log, d) { if (ch(r, 0.5)) { log('Bạn thuyết phục được ' + d.w + ' sau nhiều đêm nói chuyện. "Con tự chịu trách nhiệm nhé."', 'good'); fx(l, { hap: 4 }); } else { log('Bạn tự nộp hồ sơ ngành mình thích. ' + U.cap(d.w) + ' không nói chuyện với bạn suốt mấy tháng.', 'bad'); fx(l, { hap: -2 }); stress(l, 8); l.fam.coldWar = l.age; } } },
      { k: 'thoa_hiep', l: 'Thỏa hiệp: học song song hai ngành', ai: { w: 0.5, smart: 1 }, run: function (l, r, log, d) { log('Bạn đề nghị học ngành mình thích, học thêm văn bằng hai theo ý ' + d.w + '. Cả nhà chấp nhận.', 'neutral'); fx(l, { kno: 2, hap: -1 }); stress(l, 4); } }
    ]
  });
  T('ps_ep_nganh', function (l, a) { return a === 17 && !!l.school && !!(whoHas(l, 'gia_truong') || whoHas(l, 'ky_vong')); }, 0.6, 1, 1);
  // tin bói toán: cấm cưới vì không hợp tuổi
  SC('ps_khong_hop_tuoi', {
    title: '"Hai đứa không hợp tuổi"', prep: function (l) { return { w: whoHas(l, 'tam_linh') || 'bố mẹ', n: l.partner ? l.partner.name : '' }; },
    valid: function (l) { return isVN(l) && !!whoHas(l, 'tam_linh') && !!l.partner && l.partner.status === 'dating'; },
    text: function (l, d) { return U.cap(d.w) + ' đi xem bói về, mặt nặng như chì: "Thầy bảo tuổi con với ' + d.n + ' là tứ hành xung, cưới về thì lục đục, khắc con cái."'; },
    opts: [
      { k: 'giai_han', l: 'Chiều bố mẹ, đi cúng giải hạn rồi cưới', ai: { w: 1 }, run: function (l, r, log, d) { var v = l.base * 0.04; H.cash(l, -v, 'Lễ giải hạn trước khi cưới'); log('Hai đứa theo ' + d.w + ' đi làm lễ "giải hạn" mất ' + mo(l, v) + '. ' + U.cap(d.w) + ' yên tâm, gật đầu cho cưới.', 'neutral'); l.flags.okTuoi = true; } },
      { k: 'mac_ke', l: 'Không tin, vẫn quyết cưới', ai: { w: 0.8, risk: 1 }, run: function (l, r, log, d) { log('Bạn nói thẳng: "Con không tin chuyện tuổi tác." ' + U.cap(d.w) + ' giận, nhưng rồi cũng đành chiều con.', 'neutral'); fx(l, { hap: -1 }); l.flags.okTuoi = true; } },
      { k: 'chia_tay', l: 'Áp lực quá, đành chia tay', ai: { w: 0.25 }, run: function (l, r, log, d) { if (l.partner) { log('Không chịu nổi áp lực từ gia đình, bạn và ' + d.n + ' chia tay. ' + d.n + ' khóc: "Chỉ vì một lá số thôi sao?"', 'bad'); l.partner = null; fx(l, { hap: -10 }); stress(l, 10); H.mem(l, 'Mối tình tan vỡ chỉ vì "không hợp tuổi".', 5); } } }
    ]
  });
  T('ps_khong_hop_tuoi', function (l, a) { return isVN(l) && !!whoHas(l, 'tam_linh') && !!l.partner && l.partner.status === 'dating' && !l.flags.okTuoi && a >= 20; }, 0.25, 3, 1);
  // sĩ diện: đám cưới phải to bằng họ hàng
  SC('ps_cuoi_to', {
    title: 'Đám cưới "cho bằng người ta"', prep: function (l) { return { w: whoHas(l, 'si_dien') || 'bố mẹ', v: l.base * (l.fam.q >= 4 ? 0.8 : 0.35) }; },
    valid: function (l) { return isVN(l) && !!whoHas(l, 'si_dien') && !!l.partner && l.partner.status === 'dating' && (!E.legalToMarry || E.legalToMarry(l)); },
    text: function (l, d) { return 'Nghe tin bạn sắp cưới, ' + d.w + ' muốn làm 60 mâm cỗ, thuê ban nhạc, xe hoa: "Con nhà bác Tư cưới 50 mâm, nhà mình không thể kém." Ước tính tốn thêm ' + mo(l, d.v) + '.'; },
    opts: [
      { k: 'chieu', l: 'Chiều bố mẹ, làm thật to', ai: { w: 0.8 }, run: function (l, r, log, d) { H.cash(l, -d.v * 0.5, 'Góp tiền đám cưới to theo ý bố mẹ'); l.flags.bigWedding = true; log('Bạn góp ' + mo(l, d.v * 0.5) + ' để làm đám cưới thật to. ' + U.cap(d.w) + ' nở mày nở mặt với họ hàng, còn bạn lo khoản nợ sau cưới.', 'neutral'); fx(l, { hap: 1 }); } },
      { k: 'gon', l: 'Thuyết phục làm gọn, dành tiền mua nhà', ai: { w: 1, smart: 1 }, run: function (l, r, log, d) { if (ch(r, 0.55)) { log('Bạn tính cho ' + d.w + ' xem số tiền ấy đủ trả trước một phần căn hộ. ' + U.cap(d.w) + ' gật gù đồng ý làm gọn.', 'good'); fx(l, { hap: 2 }); } else { log(U.cap(d.w) + ' phật ý: "Mất mặt với họ hàng!" Không khí trong nhà nặng nề suốt mấy tháng trước cưới.', 'bad'); stress(l, 8); } } }
    ]
  });
  T('ps_cuoi_to', function (l, a) { return isVN(l) && !!whoHas(l, 'si_dien') && !!l.partner && l.partner.status === 'dating' && a >= 22 && !l.flags.bigWedding && (!E.legalToMarry || E.legalToMarry(l)); }, 0.2, 3, 1);
  // ấm áp / cởi mở: khoảnh khắc đẹp khi trưởng thành
  EV(function (l, a) { return a >= 18 && a <= 50 && (has(l, 'am_ap') || has(l, 'coi_mo') || has(l, 'hai_huoc')); }, 0.04, 6, function (l, a, r, log) {
    var p = has(l, 'am_ap') ? whoHas(l, 'am_ap') : has(l, 'coi_mo') ? whoHas(l, 'coi_mo') : whoHas(l, 'hai_huoc');
    log(pick(r, [U.cap(p) + ' nhắn tin lúc nửa đêm: "Con ăn uống đầy đủ nhé. Mệt thì cứ về nhà."', 'Mỗi lần bạn về, ' + p + ' lại nấu đúng món bạn thích từ hồi bé.', U.cap(p) + ' bảo: "Con chọn gì bố mẹ cũng ủng hộ, miễn con vui."']), 'good'); fx(l, { hap: 2 }); stress(l, -3);
  });
  // hay lo / bao bọc khi con đã lớn
  EV(function (l, a) { return a >= 18 && a <= 40 && (has(l, 'hay_lo') || has(l, 'bao_boc')); }, 0.05, 5, function (l, a, r, log) {
    var p = whoHas(l, 'hay_lo') || whoHas(l, 'bao_boc');
    log(pick(r, ['Ba mươi tuổi đầu, ' + p + ' vẫn gọi điện mỗi tối hỏi bạn đã ăn cơm chưa.', U.cap(p) + ' gửi lên thành phố cả thùng đồ ăn, kèm tờ giấy dặn dò kín hai mặt.', 'Bạn đi công tác xa, ' + p + ' mất ngủ cả tuần cho đến khi bạn về.']), 'neutral');
  });

  // ===================================================================
  // 2. DRAMA GIA ĐÌNH
  // ===================================================================
  // 2a. nhà giàu: tranh giành tài sản khi bố mẹ còn sống
  SC('fd_tranh_gianh', {
    title: 'Anh chị em tranh giành tài sản',
    prep: function (l, r) { var s = pick(r, adultSibs(l)); return s ? { i: l.sibList.indexOf(s), v: estate(l), what: l.fam.elite ? 'cổ phần tập đoàn' : pick(r, ['căn biệt thự và mấy lô đất', 'chuỗi cửa hàng của gia đình', 'khu đất mặt tiền', 'xưởng sản xuất của gia đình']) } : { i: -1 }; },
    valid: function (l, d) { return l.fam.q >= 4 && anyParent(l) && adultSibs(l).length > 0 && !l.flags.fdTranh && (!d || d.i == null || d.i >= 0); },
    text: function (l, d) { var s = l.sibList[d.i]; return (both(l) ? 'Bố mẹ' : mom(l) ? 'Mẹ' : 'Bố') + ' đã ' + pAge(l) + ' tuổi, sức khỏe yếu dần. ' + U.cap(call(l, s)) + ' bắt đầu thúc ' + (both(l) ? 'bố mẹ' : mom(l) ? 'mẹ' : 'bố') + ' sang tên ' + d.what + ' (khoảng ' + mo(l, d.v) + ') cho mình, nói xấu bạn sau lưng. Bữa cơm gia đình thành chiến trường.'; },
    opts: [
      { k: 'giu', l: 'Đứng về phía bố mẹ: tài sản là của bố mẹ', ai: { w: 1.2, moral: 1 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; l.flags.fdTranh = 'giu'; s.close = Math.max(0, s.close - 15); fx(l, { karma: 3 }); log('Bạn nói thẳng: "Bố mẹ còn sống, tài sản là của bố mẹ." ' + U.cap(call(l, s)) + ' đập bàn bỏ về. Bố mẹ nhìn bạn, mắt đỏ hoe.', 'neutral'); H.mem(l, 'Ngày bênh bố mẹ trước mặt ' + call(l, s) + '.', 3); } },
      { k: 'doi', l: 'Cũng đòi phần của mình cho công bằng', ai: { w: 0.7, risk: 1, bad: 0.5 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; l.flags.fdTranh = 'doi'; s.close = Math.max(0, s.close - 25); if (ch(r, 0.5)) { var v = d.v / (sibs(l).length + 1) * 0.6; H.cash(l, v, 'Bố mẹ chia trước một phần tài sản'); log('Bố mẹ buồn bã chia trước cho mỗi người một phần. Bạn nhận ' + mo(l, v) + ', nhưng từ đó anh chị em nhìn nhau như người dưng.', 'bad'); } else log('Bạn lên tiếng đòi phần. Bố mẹ giận cả hai: "Bố mẹ chưa chết mà các con đã chia nhau!"', 'bad'); fx(l, { hap: -6 }); stress(l, 10); } },
      { k: 'hoa_giai', l: 'Mời luật sư, đề nghị bố mẹ lập di chúc rõ ràng', h: function (l) { return 'Phí luật sư khoảng ' + mo(l, l.base * 0.05); }, ai: { w: 0.9, smart: 1 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; l.flags.fdTranh = 'di_chuc'; H.cash(l, -l.base * 0.05, 'Phí luật sư tư vấn di chúc'); l.flags.parentWill = true; s.close = Math.max(0, s.close - 5); log('Luật sư giúp bố mẹ lập di chúc công chứng, chia rành mạch. ' + U.cap(call(l, s)) + ' cằn nhằn nhưng không còn cớ để tranh.', 'good'); } },
      { k: 'ngoai', l: 'Đứng ngoài, không dính vào', ai: { w: 0.8 }, run: function (l, r, log, d) { l.flags.fdTranh = 'ngoai'; log('Bạn đứng ngoài cuộc. Tiếng cãi vã vẫn vọng qua điện thoại mỗi lần bạn gọi về.', 'neutral'); stress(l, 4); } }
    ]
  });
  T('fd_tranh_gianh', function (l, a) { return a >= 28 && a <= 65 && l.fam.q >= 4 && anyParent(l) && pAge(l) >= 62 && adultSibs(l).length > 0 && !l.flags.fdTranh; }, 0.06, 3, 1);
  // 2b. nhà giàu: kiện tụng chia di sản sau khi bố mẹ mất
  SC('fd_kien_di_san', {
    title: 'Ra tòa vì di sản',
    prep: function (l, r) { var s = pick(r, adultSibs(l)); return s ? { i: l.sibList.indexOf(s), v: estate(l) * 0.5 } : { i: -1 }; },
    valid: function (l, d) { return !anyParent(l) && l.fam.q >= 4 && adultSibs(l).length > 0 && !l.flags.fdKien && (!d || d.i == null || d.i >= 0); },
    text: function (l, d) { var s = l.sibList[d.i]; return 'Chưa hết tang, ' + call(l, s) + ' gửi đơn ra tòa, cho rằng việc chia di sản không công bằng và đòi thêm khoảng ' + mo(l, d.v) + '.'; },
    opts: [
      { k: 'kien', l: 'Thuê luật sư theo kiện đến cùng', h: function (l) { return 'Án phí, luật sư khoảng ' + mo(l, l.base * 0.3); }, ai: { w: 0.7, risk: 1 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; l.flags.fdKien = true; H.cash(l, -l.base * 0.3, 'Án phí, phí luật sư kiện di sản'); s.close = 5; if (ch(r, 0.55)) { log('Ba năm ra tòa, bạn thắng kiện, giữ nguyên phần của mình. Nhưng ' + call(l, s) + ' tuyên bố từ mặt, đám giỗ bố mẹ hai nhà làm riêng.', 'neutral'); } else { H.cash(l, -d.v * 0.4, 'Thua kiện, chia lại di sản'); log('Tòa xử chia lại di sản. Bạn mất thêm ' + mo(l, d.v * 0.4) + ', mất cả người thân.', 'bad'); fx(l, { hap: -8 }); } stress(l, 15); H.mem(l, 'Những năm anh chị em gặp nhau ở tòa án.', 5); } },
      { k: 'nhuong', l: 'Nhường một phần để giữ hòa khí', ai: { w: 1, moral: 1 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; l.flags.fdKien = true; H.cash(l, -d.v * 0.3, 'Nhường bớt di sản cho anh chị em'); s.close = Math.min(100, s.close + 10); fx(l, { karma: 5, hap: -2 }); log('Bạn chủ động nhường ' + mo(l, d.v * 0.3) + ', mời ' + call(l, s) + ' rút đơn. "Bố mẹ trên trời nhìn xuống chắc cũng không muốn thấy thế này."', 'neutral'); } },
      { k: 'hoa_giai', l: 'Nhờ họ hàng đứng ra hòa giải', ai: { w: 0.8 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; l.flags.fdKien = true; if (ch(r, 0.5)) { s.close = Math.min(100, s.close + 5); log('Bác cả họp cả họ, phân xử. ' + U.cap(call(l, s)) + ' rút đơn, hai bên bắt tay dù còn gượng.', 'good'); } else { H.cash(l, -d.v * 0.2, 'Chia lại một phần di sản'); log('Hòa giải bất thành, cuối cùng vẫn phải chia lại một phần ' + mo(l, d.v * 0.2) + '.', 'bad'); } } }
    ]
  });
  T('fd_kien_di_san', function (l, a) { return !!l.flags.inherit && !anyParent(l) && l.fam.q >= 4 && adultSibs(l).length > 0 && !l.flags.fdKien; }, 0.06, 2, 1);
  // 2c. tập đoàn gia đình: tranh ghế chủ tịch
  SC('fd_ghe_chu_tich', {
    title: 'Ghế chủ tịch tập đoàn gia đình',
    prep: function (l, r) { var s = pick(r, adultSibs(l)); return s ? { i: l.sibList.indexOf(s) } : { i: -1 }; },
    valid: function (l, d) { return !!l.fam.elite && l.fam.elite !== 'ct' && dad(l) && adultSibs(l).length > 0 && !l.flags.fdGhe && (!d || d.i == null || d.i >= 0); },
    text: function (l, d) { var s = l.sibList[d.i]; return 'Bố chuẩn bị rút khỏi ghế chủ tịch. ' + U.cap(call(l, s)) + ' âm thầm gom phiếu các cổ đông, tung tin bạn "không đủ năng lực". Đại hội cổ đông sắp tới sẽ quyết định ai nắm quyền.'; },
    opts: [
      { k: 'dau', l: 'Vận động cổ đông, giành ghế chủ tịch', ai: { w: 1, amb: 1.5, risk: 1 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; l.flags.fdGhe = true; s.close = Math.max(0, s.close - 30); if (ch(r, U.clamp(0.35 + (l.st.soc - 50) / 150 + (l.tr.amb - 50) / 200, 0.15, 0.75))) { l.flags.chairman = true; l.fame = (l.fame || 0) + 5e4; H.cash(l, l.base * 3, 'Thưởng nhiệm kỳ chủ tịch'); log('Đại hội cổ đông bầu bạn làm chủ tịch tập đoàn. Báo chí gọi đây là "cuộc chiến vương quyền" của giới tài phiệt. ' + U.cap(call(l, s)) + ' rời hội đồng quản trị.', 'big'); H.mem(l, 'Ngày ngồi vào ghế chủ tịch sau cuộc chiến với chính ' + call(l, s) + '.', 6); } else { log('Bạn thua phiếu. ' + U.cap(call(l, s)) + ' lên làm chủ tịch, bạn bị đẩy khỏi ban điều hành.', 'bad'); fx(l, { hap: -8 }); } stress(l, 12); } },
      { k: 'nhuong', l: 'Nhường ghế, giữ cổ phần và tình anh em', ai: { w: 0.9, moral: 1 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; l.flags.fdGhe = true; s.close = Math.min(100, s.close + 8); H.cash(l, l.base * 0.8, 'Cổ tức tập đoàn gia đình'); log('Bạn nhường ghế cho ' + call(l, s) + ', giữ cổ phần và nhận cổ tức đều đặn. Gia đình yên ổn, dù có người bảo bạn "nhu nhược".', 'neutral'); } },
      { k: 'ban', l: 'Bán hết cổ phần, ra ngoài tự lập', ai: { w: 0.5, amb: 0.5 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; l.flags.fdGhe = true; H.cash(l, l.base * 15, 'Bán cổ phần tập đoàn gia đình'); log('Bạn bán toàn bộ cổ phần cho ' + call(l, s) + ', cầm ' + mo(l, l.base * 15) + ' ra ngoài tự lập. Nhẹ nhõm như trút được gánh nặng.', 'good'); fx(l, { hap: 4 }); } }
    ]
  });
  T('fd_ghe_chu_tich', function (l, a) { return a >= 32 && a <= 55 && !!l.fam.elite && l.fam.elite !== 'ct' && dad(l) && adultSibs(l).length > 0 && !l.flags.fdGhe; }, 0.2, 3, 1);
  // 2d. nhà bình thường / khó khăn: mảnh đất hương hỏa
  SC('fd_dat_huong_hoa', {
    title: 'Mảnh đất hương hỏa',
    prep: function (l, r) { var s = pick(r, adultSibs(l)); return s ? { i: l.sibList.indexOf(s), v: H.housePrice(l) * 0.4 } : { i: -1 }; },
    valid: function (l, d) { return l.fam.q <= 3 && adultSibs(l).length > 0 && !l.flags.fdDat && (!d || d.i == null || d.i >= 0); },
    text: function (l, d) { var s = l.sibList[d.i]; return 'Mảnh đất có nhà thờ tổ (khoảng ' + mo(l, d.v) + ') chưa sang tên ai. ' + U.cap(call(l, s)) + ' muốn bán đi chia tiền, còn ' + (anyParent(l) ? (mom(l) ? 'mẹ' : 'bố') : 'các bác trong họ') + ' nhất quyết giữ làm nơi thờ cúng.'; },
    opts: [
      { k: 'giu', l: 'Giữ đất hương hỏa, nhận trông nom nhà thờ', ai: { w: 1.1, moral: 0.6 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; l.flags.fdDat = 'giu'; s.close = Math.max(0, s.close - 8); fx(l, { karma: 3 }); log('Bạn nhận trông nom nhà thờ tổ, Tết nhất giỗ chạp đều về thắp hương. ' + U.cap(call(l, s)) + ' cho rằng bạn "giữ đất để sau này chiếm".', 'neutral'); } },
      { k: 'ban', l: 'Đồng ý bán, chia đều cho anh chị em', ai: { w: 0.8 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; l.flags.fdDat = 'ban'; var v = d.v / (sibs(l).length + 1); H.cash(l, v, 'Phần chia từ bán đất hương hỏa'); s.close = Math.min(100, s.close + 4); log('Đất bán được, mỗi người nhận khoảng ' + mo(l, v) + '. Các cụ trong họ buồn lắm: "Bán đất tổ tiên là mất gốc."', 'neutral'); fx(l, { hap: -1 }); } },
      { k: 'mua', l: 'Gom tiền mua lại phần của anh chị em', h: function (l, d) { return 'Khoảng ' + mo(l, d.v * 0.7); }, req: function (l, d) { return l.money >= d.v * 0.7; }, ai: { w: 0.6 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; l.flags.fdDat = 'mua'; H.cash(l, -d.v * 0.7, 'Mua lại phần đất hương hỏa'); s.close = Math.min(100, s.close + 6); log('Bạn bỏ tiền mua lại phần của anh chị em, đứng tên mảnh đất, giữ nguyên nhà thờ tổ.', 'good'); } }
    ]
  });
  T('fd_dat_huong_hoa', function (l, a) { return a >= 30 && a <= 70 && l.fam.q <= 3 && isVN(l) && adultSibs(l).length > 0 && !l.flags.fdDat; }, 0.025, 4, 1);
  // 2e. đùn đẩy nuôi bố mẹ già
  SC('fd_nuoi_bo_me', {
    title: 'Ai nuôi bố mẹ?',
    prep: function (l, r) { var s = pick(r, adultSibs(l)); return s ? { i: l.sibList.indexOf(s), w: both(l) ? 'bố mẹ' : mom(l) ? 'mẹ' : 'bố' } : { i: -1 }; },
    valid: function (l, d) { return anyParent(l) && pAge(l) >= 75 && adultSibs(l).length > 0 && l.indep && !l.flags.fdNuoi && (!d || d.i == null || d.i >= 0); },
    text: function (l, d) { var s = l.sibList[d.i]; return U.cap(d.w) + ' đã ' + pAge(l) + ' tuổi, cần người ở cạnh. Họp gia đình, ' + call(l, s) + ' bảo nhà chật, công việc bận, "đứa nào gần thì đứa ấy lo". Ai cũng nhìn bạn.'; },
    opts: [
      { k: 'nhan', l: 'Đón ' + 'bố mẹ về ở cùng mình', ai: { w: 1.2, moral: 1 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; l.flags.fdNuoi = 'nhan'; l.flags.caring = true; s.close = Math.max(0, s.close - 5); fx(l, { karma: 6, hap: -2 }); stress(l, 6); log('Bạn đón ' + d.w + ' về ở cùng. Chật chội, vất vả, nhưng tối nào cũng có người hỏi "con ăn cơm chưa".', 'neutral'); H.mem(l, 'Những năm chăm ' + d.w + ' già yếu trong căn nhà nhỏ.', 4); } },
      { k: 'chia', l: 'Đề nghị luân phiên: mỗi nhà vài tháng', ai: { w: 1 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; l.flags.fdNuoi = 'chia'; if (ch(r, 0.6)) { log('Anh chị em thống nhất luân phiên, mỗi nhà ba tháng. ' + U.cap(d.w) + ' cười: "Thành ra bố mẹ đi du lịch khắp nơi."', 'good'); } else { s.close = Math.max(0, s.close - 12); log('Luân phiên được một vòng thì ' + call(l, s) + ' viện cớ bận. Cuối cùng gánh nặng vẫn dồn về bạn.', 'bad'); stress(l, 8); } } },
      { k: 'vien', l: 'Góp tiền thuê người chăm / viện dưỡng lão', h: function (l) { return 'Khoảng ' + mo(l, l.base * 0.25) + '/năm'; }, req: function (l) { return l.money >= l.base * 0.25; }, ai: { w: 0.7 }, run: function (l, r, log, d) { l.flags.fdNuoi = 'vien'; H.cash(l, -l.base * 0.25, 'Thuê người chăm bố mẹ'); log('Bạn góp tiền thuê người chăm ' + d.w + '. Họ hàng xì xào "có tiền mà không có hiếu", ' + d.w + ' lại bảo: "Con đừng để ý."', 'neutral'); } }
    ]
  });
  T('fd_nuoi_bo_me', function (l, a) { return anyParent(l) && pAge(l) >= 75 && adultSibs(l).length > 0 && l.indep && !l.flags.fdNuoi; }, 0.07, 3, 1);
  // 2f. anh chị em nợ nần, chủ nợ đến tận nhà
  SC('fd_anh_em_no', {
    title: 'Nợ nần trong nhà',
    prep: function (l, r) { var s = pick(r, adultSibs(l)); return s ? { i: l.sibList.indexOf(s), why: pick(r, ['cờ bạc bóng đá', 'chơi tiền ảo', 'làm ăn thua lỗ', 'vay app tín dụng đen']), v: l.base * pick(r, [0.3, 0.6, 1.2]) } : { i: -1 }; },
    valid: function (l, d) { return adultSibs(l).length > 0 && l.indep && !l.flags.fdNo && (!d || d.i == null || d.i >= 0); },
    text: function (l, d) { var s = l.sibList[d.i]; return U.cap(call(l, s)) + ' nợ ' + mo(l, d.v) + ' vì ' + d.why + '. Chủ nợ ' + (anyParent(l) ? 'đến tận nhà bố mẹ đòi, ' + (mom(l) ? 'mẹ' : 'bố') + ' khóc gọi điện cho bạn.' : 'gọi điện khủng bố cả họ hàng.'); },
    opts: [
      { k: 'tra', l: 'Trả nợ giúp một lần, ra điều kiện', h: function (l, d) { return mo(l, d.v); }, req: function (l, d) { return l.money >= d.v; }, ai: { w: 1, soc: 0.6 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; l.flags.fdNo = 'tra'; H.cash(l, -d.v, 'Trả nợ giúp ' + call(l, s)); if (ch(r, 0.55)) { s.close = Math.min(100, s.close + 10); log('Bạn trả nợ giúp, bắt ' + call(l, s) + ' viết cam kết. Lần này ' + call(l, s) + ' tu chí làm ăn thật.', 'good'); } else { s.close = Math.max(0, s.close - 10); log('Bạn trả nợ giúp. Một năm sau, ' + call(l, s) + ' lại nợ, lần này nhiều hơn.', 'bad'); fx(l, { hap: -5 }); } } },
      { k: 'ban_nha', l: 'Để bố mẹ tự lo', req: function (l) { return anyParent(l); }, ai: { w: 0.5 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; l.flags.fdNo = 'bo_me'; log((mom(l) ? 'Mẹ' : 'Bố') + ' bán mảnh vườn, rút cả sổ tiết kiệm dưỡng già để trả nợ cho ' + call(l, s) + '. Bạn thương mà giận.', 'bad'); fx(l, { hap: -4 }); if (l.fam.mInc) l.fam.mInc *= 0.9; } },
      { k: 'mac_ke', l: 'Kiên quyết không dính vào', ai: { w: 0.7 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; l.flags.fdNo = 'ke'; s.close = Math.max(0, s.close - 20); log('Bạn từ chối: "Tự làm thì tự chịu." ' + U.cap(call(l, s)) + ' bỏ trốn vào Nam, cả năm không liên lạc.', 'neutral'); stress(l, 6); } }
    ]
  });
  T('fd_anh_em_no', function (l, a) { return a >= 25 && a <= 65 && adultSibs(l).length > 0 && l.indep && !l.flags.fdNo; }, 0.012, 4, 1);
  // 2g. họ hàng mượn sổ đỏ đi thế chấp
  SC('fd_so_do', {
    title: 'Mượn sổ đỏ',
    prep: function (l, r) { return { who: pick(r, ['Ông chú họ', 'Bà cô bên nội', 'Anh rể', 'Người dì bên ngoại']), v: H.housePrice(l) * 0.3 }; },
    valid: function (l) { return l.ownHouse && l.indep && !l.flags.fdSoDo; },
    text: function (l, d) { return d.who + ' đến nhà, ngồi cả buổi tối: muốn mượn sổ đỏ nhà bạn thế chấp ngân hàng vay ' + mo(l, d.v) + ' làm ăn. "Người trong nhà cả, chú hứa một năm trả."'; },
    opts: [
      { k: 'cho', l: 'Cho mượn, vì nể tình họ hàng', ai: { w: 0.5, soc: 1 }, run: function (l, r, log, d) { l.flags.fdSoDo = 'cho'; if (ch(r, 0.5)) { log(d.who + ' làm ăn được, đúng hẹn trả sổ, mang sang biếu cả thùng quà.', 'good'); fx(l, { soc: 2 }); } else { H.cash(l, -d.v * 0.6, 'Trả nợ ngân hàng thay họ hàng để giữ nhà'); log(d.who + ' thua lỗ, ngân hàng gửi giấy đòi siết nhà. Bạn phải bỏ ra ' + mo(l, d.v * 0.6) + ' trả nợ thay để giữ lại căn nhà.', 'bad'); fx(l, { hap: -10 }); stress(l, 15); H.mem(l, 'Năm suýt mất nhà vì cho họ hàng mượn sổ đỏ.', 5); } } },
      { k: 'khong', l: 'Từ chối khéo', ai: { w: 1.2, smart: 1 }, run: function (l, r, log, d) { l.flags.fdSoDo = 'khong'; log('Bạn từ chối khéo. ' + d.who + ' ra về, từ đó gặp nhau ở đám giỗ chỉ gật đầu chào.', 'neutral'); } }
    ]
  });
  T('fd_so_do', function (l, a) { return a >= 30 && a <= 70 && isVN(l) && l.ownHouse && l.indep && !l.flags.fdSoDo; }, 0.01, 4, 1);
  // 2h. bố mẹ cãi nhau, đòi ly thân
  SC('fd_bo_me_cai', {
    title: 'Bố mẹ cãi nhau',
    prep: function (l, r) { return { why: pick(r, ['tiền bạc', 'bố nghi mẹ', 'mẹ phát hiện bố có người khác bên ngoài', 'chuyện bên nội bên ngoại', 'bố nhậu say về muộn']) }; },
    valid: function (l) { return both(l) && l.age >= 7 && l.age <= 17 && !l.fam.sepAt; },
    text: function (l, d) { return 'Đêm nào bố mẹ cũng cãi nhau vì ' + d.why + '. Có hôm mẹ xếp quần áo vào va li, nói sẽ về ngoại ở hẳn.'; },
    opts: [
      { k: 'giu', l: 'Ôm chặt mẹ, xin bố mẹ đừng bỏ nhau', ai: { w: 1.2 }, run: function (l, r, log) { if (ch(r, 0.6)) { log('Bố mẹ nhìn bạn khóc, im lặng hồi lâu. Hôm sau, mẹ cất va li lên nóc tủ.', 'neutral'); fx(l, { hap: -2 }); } else { l.fam.sepAt = l.age; log('Mẹ vẫn đi. Bố mẹ ly thân, bạn ở với ' + pick(r, ['bố', 'mẹ']) + ', cuối tuần mới gặp người kia.', 'bad'); fx(l, { hap: -8 }); stress(l, 12); H.mem(l, 'Năm ' + l.age + ' tuổi, bố mẹ ly thân.', 5); } } },
      { k: 'im', l: 'Trùm chăn kín đầu, cố không nghe', ai: { w: 0.9 }, run: function (l, r, log) { log('Bạn trùm chăn kín đầu, đeo tai nghe bật nhạc thật to. Sáng ra, cả nhà ăn sáng trong im lặng.', 'neutral'); fx(l, { hap: -3 }); stress(l, 6); } },
      { k: 'noi', l: 'Nói chuyện riêng với từng người', ai: { w: 0.6, soc: 1, smart: 1 }, run: function (l, r, log) { log('Bạn lần lượt nói chuyện với bố, rồi với mẹ. Hai người bất ngờ vì đứa con đã lớn từ lúc nào. Không khí trong nhà dịu đi.', 'good'); fx(l, { soc: 2 }); } }
    ]
  });
  T('fd_bo_me_cai', function (l, a) { return both(l) && a >= 7 && a <= 17 && !l.fam.sepAt && (has(l, 'nong_tinh') || has(l, 'gia_truong') || has(l, 'cuong_viec') || !!l.fam.vice || l.fam.q <= 2); }, 0.045, 4, 1);
  // ly thân thì nhà ít hơi ấm (lời kể đều đặn)
  EV(function (l, a) { return l.fam.sepAt != null && a > l.fam.sepAt && a <= 17 && both(l); }, 0.2, 3, function (l, a, r, log) {
    log(pick(r, ['Cuối tuần, bạn xách ba lô sang nhà ' + pick(r, ['bố', 'mẹ']) + ', hai ngôi nhà, hai cái bàn chải đánh răng.', 'Họp phụ huynh, bố mẹ ngồi cách nhau hai dãy ghế.', 'Sinh nhật bạn, bố mẹ thay nhau tổ chức hai lần, bạn cười mà thấy lạc lõng.']), 'neutral'); fx(l, { hap: -1 });
  });
  // 2i. con riêng xuất hiện ở đám tang
  var conRieng = function (l, r, log, a) {
    if (!l.alive || l.flags.fdConRieng != null || dad(l) || l.fam.noDad) return;
    if (!l.flags.fdDadSeen) { l.flags.fdDadSeen = a; if (!l.indep || l.age < 20 || l.flags.parentLostAt == null || a - l.flags.parentLostAt > 1) { l.flags.fdConRieng = false; return; } if (ch(r, 0.025 + (l.fam.vice ? 0.05 : 0) + (l.fam.q >= 4 ? 0.03 : 0))) l.flags.fdConRieng = 'pending'; else l.flags.fdConRieng = false; }
  };
  E.HOOKS.year.unshift(function (l, r, log, a) { if (l.fam && l.fam.fAlive === false && !l.fam.noDad && !(l.fam.orphan && l.fam.orphan.adopted == null)) conRieng(l, r, log, a); });
  SC('fd_con_rieng', {
    title: 'Người lạ ở đám tang bố', prep: function (l, r) { var sx = r() < 0.5 ? 'M' : 'F'; return { n: H.stranger(l, r, sx), sex: sx, v: estate(l) * 0.15 }; },
    valid: function (l) { return l.flags.fdConRieng === 'pending'; },
    text: function (l, d) { return 'Đám tang bố, một ' + (d.sex === 'M' ? 'người đàn ông' : 'người phụ nữ') + ' lạ mặt chừng ' + Math.max(18, l.age - 6) + ' tuổi đến thắp hương rồi quỳ rất lâu. Hóa ra là ' + d.n + ', con riêng của bố với một người khác, mang theo giấy xét nghiệm ADN và muốn được nhận một phần di sản (khoảng ' + mo(l, d.v) + ').'; },
    opts: [
      { k: 'nhan', l: 'Nhận làm anh chị em, chia phần theo luật', ai: { w: 0.9, moral: 1 }, run: function (l, r, log, d) { l.flags.fdConRieng = 'nhan'; H.cash(l, -Math.min(Math.max(0, l.money), d.v * 0.4), 'Chia phần di sản cho con riêng của bố'); fx(l, { karma: 6, hap: -3 }); log('Bạn chấp nhận ' + d.n + ' là người trong nhà, chia phần theo luật. ' + (l.fam.mAlive ? 'Mẹ khóc suốt mấy ngày, rồi cũng mời ' + d.n + ' ở lại ăn cơm.' : 'Từ đó đám giỗ bố có thêm một người.'), 'neutral'); H.mem(l, 'Ngày biết mình còn một người anh chị em cùng cha khác mẹ.', 5); } },
      { k: 'kien', l: 'Không nhận, để tòa phân xử', ai: { w: 0.6, risk: 1 }, run: function (l, r, log, d) { l.flags.fdConRieng = 'kien'; H.cash(l, -l.base * 0.1, 'Phí luật sư vụ con riêng'); if (ch(r, 0.5)) { log('Tòa công nhận ' + d.n + ' là con của bố, được hưởng một phần di sản theo luật. Bạn mất cả tiền lẫn bình yên.', 'bad'); H.cash(l, -Math.min(Math.max(0, l.money), d.v * 0.5), 'Chia di sản theo phán quyết của tòa'); } else log(d.n + ' rút đơn, không quay lại nữa. Bạn thở phào, nhưng câu chuyện về bố cứ day dứt mãi.', 'neutral'); stress(l, 10); } },
      { k: 'giu_kin', l: 'Thương lượng riêng, giữ kín với ' + 'cả nhà', ai: { w: 0.5 }, run: function (l, r, log, d) { l.flags.fdConRieng = 'kin'; H.cash(l, -Math.min(Math.max(0, l.money), d.v * 0.3), 'Thỏa thuận riêng với con riêng của bố'); log('Bạn gặp riêng ' + d.n + ', đưa một khoản để giữ kín chuyện. Bí mật ấy bạn mang theo suốt nhiều năm.', 'neutral'); stress(l, 8); } }
    ]
  });
  T('fd_con_rieng', function (l) { return l.flags.fdConRieng === 'pending'; }, 0.9, 1, 1);
  // 2j. di chúc thiên vị
  SC('fd_di_chuc', {
    title: 'Bản di chúc',
    prep: function (l, r) { var s = pick(r, adultSibs(l)); return s ? { i: l.sibList.indexOf(s), me: l.fam.thienVi, v: estate(l) * 0.4 } : { i: -1 }; },
    valid: function (l, d) { return has(l, 'thien_vi') && anyParent(l) && pAge(l) >= 68 && adultSibs(l).length > 0 && !l.flags.fdDiChuc && (!d || d.i == null || d.i >= 0); },
    text: function (l, d) { var s = l.sibList[d.i]; return 'Bạn tình cờ biết ' + (whoHas(l, 'thien_vi') || 'bố mẹ') + ' đã lập di chúc để gần hết nhà đất (khoảng ' + mo(l, d.v) + ') cho ' + (d.me ? 'bạn' : call(l, s)) + '. ' + (d.me ? U.cap(call(l, s)) + ' chưa biết gì.' : 'Còn bạn, chỉ được vài món kỷ niệm.'); },
    opts: [
      { k: 'noi', l: function (l, d) { return d && d.me ? 'Xin bố mẹ chia lại cho công bằng' : 'Nói chuyện thẳng với bố mẹ'; }, ai: { w: 1, moral: 0.6 }, run: function (l, r, log, d) { var s = l.sibList[d.i], w = whoHas(l, 'thien_vi') || 'bố mẹ'; l.flags.fdDiChuc = 'noi'; if (ch(r, 0.55)) { log('Sau nhiều lần nói chuyện, ' + w + ' sửa lại di chúc chia đều. "Bố mẹ già rồi, lẩm cẩm, các con đừng giận."', 'good'); s.close = Math.min(100, s.close + 6); } else { log(U.cap(w) + ' gạt đi: "Của bố mẹ, bố mẹ muốn cho ai thì cho."', 'neutral'); if (!d.me) { fx(l, { hap: -4 }); stress(l, 6); } } } },
      { k: 'im', l: 'Im lặng, coi như không biết', ai: { w: 0.9 }, run: function (l, r, log, d) { l.flags.fdDiChuc = d.me ? 'im_loi' : 'im_thiet'; l.flags.willBias = d.me ? 1 : -1; log(d.me ? 'Bạn im lặng. Sự im lặng ấy nặng hơn bạn tưởng.' : 'Bạn im lặng, nuốt nỗi tủi thân vào lòng. "Thương ai hơn thì bố mẹ biết."', 'neutral'); stress(l, 4); } }
    ]
  });
  T('fd_di_chuc', function (l, a) { return has(l, 'thien_vi') && anyParent(l) && pAge(l) >= 68 && adultSibs(l).length > 0 && !l.flags.fdDiChuc; }, 0.12, 3, 1);
  // di chúc thiên vị ảnh hưởng phần chia tài sản sau này
  var cts = E.DEC.chia_tai_san;
  if (cts) { var ap = cts.apply; cts.apply = function (l, d, k, r, log) { var m0 = l.money, out = ap.apply(this, arguments); var b = l.flags.willBias; if (b && l.money > m0) { var gain = l.money - m0, adj = gain * (b > 0 ? 0.8 : -0.6); H.cash(l, adj, b > 0 ? 'Phần hơn theo di chúc của bố mẹ' : 'Di chúc thiên vị, phần của bạn ít hơn'); log(b > 0 ? 'Theo di chúc, bạn được phần hơn anh chị em. Có người không nhìn mặt bạn trong ngày giỗ đầu.' : 'Di chúc để phần lớn cho anh chị em, phần của bạn ít hơn hẳn.', b > 0 ? 'neutral' : 'bad'); } return out; }; }
  [['ps_ep_nganh', 1], ['fd_tranh_gianh', 1], ['fd_kien_di_san', 1], ['fd_ghe_chu_tich', 1], ['fd_con_rieng', 1], ['fd_nuoi_bo_me', 1]].forEach(function (x) { E.MAJOR[x[0]] = x[1]; });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
