/* Một Đời — tình huống đời sống, chuỗi sự kiện, hành động chủ động & logic AI.
   Mỗi tình huống: SC(id, {title, text, prep, opts:[{k, l, h, req, ai, run}], valid}).
   ai: trọng số cho AI theo tính cách — {risk: thích mạo hiểm, bad: việc xấu, cost: tốn tiền, soc, smart, amb}. */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, W = G.W, VN = G.VN;
  var SC = E.SC, isVN = H.isVN;
  function T(id, when, p, cd) { E.TRIG.push({ id: id, when: when, p: p, cd: cd || 0 }); }
  function A(id, g, label, o) { var x = { id: id, g: g, l: label }; for (var k in o) x[k] = o[k]; E.ACT.push(x); }
  function EV(c, p, run) { E.EVENTS.push({ c: c, p: p, run: run }); }
  function L(fn) { E.LINES.push(fn); }
  function fx(l, o, why) { H.fx(l, o, why); }
  function cashB(l, x, why) { H.cash(l, x * l.base, why); }
  function mb(l, x) { return H.mb(l, x); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function fine(l, trieu) { return isVN(l) ? trieu : trieu / 90 * l.base * 0.6; } // tiền phạt (triệu đồng ở VN)
  function hasJob(l, ids) { return !!(l.job && ids.indexOf(E.resolveJob(l.job.id)) >= 0); }
  function jobCat(l) { var c = E.jobDef(l); return c ? c.cat : ''; }
  function adult(l) { return l.age >= 18; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped); }
  function bigCityName(l) { return E.uniPlaces(l).big; }
  function sexW(l, m, f) { return l.sex === 'M' ? m : f; }
  function pw(l) { return l.partner ? H.partnerWord(l, l.partner) : 'người yêu'; }
  function bff(l) { return l.bff && l.bff.alive ? l.bff : null; }
  function vehicle(l) { return !!l.veh && l.veh !== 'xe đạp'; }
  function yr(l) { return l.birthYear + l.age; }
  // v2.4: cách gọi bố mẹ theo người còn sống ('bố mẹ' / 'mẹ' / 'bố' / '')
  function parentsWord(l) { var f = l.fam; return f.mAlive && f.fAlive ? 'bố mẹ' : f.mAlive ? 'mẹ' : f.fAlive ? 'bố' : ''; }
  // người thân có thể giúp đỡ khi gặp chuyện: bố mẹ còn sống → con cái đã lớn → anh chị em → họ hàng
  function helperWord(l) {
    var p = parentsWord(l);
    if (p && l.age < 60) return p;
    if (l.kids.some(function (k) { return k.alive && l.age - k.born >= 22; })) return 'các con';
    if (l.fam.sibs > 0) return 'anh chị em';
    return p || 'họ hàng';
  }
  H.parentsWord = parentsWord; H.helperWord = helperWord;

  // =====================================================================
  // TUỔI THƠ & TUỔI HỌC TRÒ
  // =====================================================================
  EV(function (l, a) { return a >= 6 && a <= 10 && !l.bff; }, 0.35, function (l, a, r, log) {
    var s = r() < 0.6 ? l.sex : (l.sex === 'M' ? 'F' : 'M');
    l.bff = { name: H.stranger(l, r, s), sex: s, since: a, alive: true, close: 70, token: pick(r, ['chiếc ảnh chụp chung năm lớp 5', 'viên bi ve ngày bé', 'cuốn lưu bút cấp ba', 'chiếc vòng tay đôi', 'tấm thiệp sinh nhật tự vẽ']) };
    log('Ngồi cạnh ' + l.bff.name + ' trong lớp — từ đó hai đứa thành đôi bạn thân.', 'good');
    H.mem(l, 'Ngày quen ' + l.bff.name + ', người bạn thân nhất đời.', 4); fx(l, { soc: 6, hap: 3 });
  });
  EV(function (l, a) { return a >= 12 && a <= 28 && !l.idol; }, 0.12, function (l, a, r, log) {
    l.idol = H.pickIdol(r, l);
    log('Mê mẩn ' + l.idol + ' — dán đầy poster trong phòng, thuộc lòng mọi bài hát.', 'good'); fx(l, { hap: 3 });
  });
  EV(function (l, a) { return a >= 2 && a <= 17 && l.fam.vice && !l.fam.noDad && l.fam.fAlive; }, 0.14, function (l, a, r, log) {
    var v = l.fam.vice;
    var t = v === 'gamble' ? pick(r, ['Chủ nợ kéo đến nhà đòi tiền vì bố thua bạc, mẹ ngồi khóc ngoài hiên.', 'Bố mang chiếc xe máy duy nhất trong nhà đi cắm để gỡ bạc.']) :
      v === 'alcohol' ? pick(r, ['Bố say khướt về nhà, đập phá đồ đạc.', 'Bố lại say, mẹ con bạn phải sang nhà hàng xóm ngủ nhờ.']) :
        v === 'gang' ? pick(r, ['Bố đi "làm việc" cả đêm, về nhà người đầy vết thương.', 'Công an đến nhà tìm bố.']) : pick(r, ['Bố lên cơn thèm thuốc, lục tung nhà tìm tiền.', 'Bố bị đưa đi cai nghiện bắt buộc.']);
    log(t, 'bad'); fx(l, { hap: -6, hea: -1 }); H.mem(l, t, 3);
    if (v === 'gang' && r() < 0.15) { log('Bố bị bắt và lĩnh án tù.', 'bad'); H.mem(l, 'Ngày bố bị bắt, bạn đứng nép sau cánh cửa.', 5); fx(l, { hap: -8 }); }
  });
  EV(function (l, a) { return a >= 4 && a <= 15 && l.fam.q <= 1 && l.gdp < 8; }, 0.12, function (l, a, r, log) {
    log(pick(r, ['Mùa giáp hạt, cả nhà ăn cháo loãng độn khoai.', 'Có những bữa cơm chỉ có rau luộc chấm muối.', 'Quần áo toàn đồ cũ người ta cho, giày rách phải buộc dây.']), 'bad');
    fx(l, { hea: -3, hap: -2 }); l.imm = Math.max(5, (l.imm || 50) - 2);
  });
  EV(function (l, a) { return a >= 5 && a <= 12 && (l.fam.mAlive || l.fam.fAlive); }, 0.06, function (l, a, r, log) {
    var t = pick(r, [l.fam.fAlive ? 'Bố dạy bạn đi xe đạp, chạy theo sau giữ yên xe.' : 'Mẹ tập cho bạn đi xe đạp, chạy theo sau giữ yên xe.', l.fam.mAlive ? 'Mẹ thức khuya khâu lại chiếc áo đồng phục bị rách.' : 'Bố vụng về khâu lại chiếc áo đồng phục bị rách.', 'Cả nhà đi chơi công viên, bạn được ăn kem lần đầu.', 'Ông kể chuyện thời chiến dưới gốc cây đầu ngõ.', 'Bà dúi cho bạn mấy đồng tiền lẻ gói trong chiếc khăn tay.']);
    log(t, 'good'); fx(l, { hap: 3 }); H.mem(l, t, 3);
  });
  EV(function (l, a) { return a >= 6 && a <= 20 && !l.flags.grandLost; }, 0.05, function (l, a, r, log) {
    l.flags.grandLost = true; var w = pick(r, ['Ông nội', 'Bà nội', 'Ông ngoại', 'Bà ngoại']);
    log(w + ' qua đời. Lần đầu bạn hiểu thế nào là mất mát.', 'bad'); fx(l, { hap: -6 }); H.mem(l, w + ' ra đi — mùi khói hương ngày ấy bạn nhớ mãi.', 4);
  });

  SC('net_coi', {
    title: 'Quán net cỏ đầu làng', text: function (l) { return 'Tụi bạn rủ ra quán net chơi ' + (l.game || pick2(l, ['Liên Minh', 'Free Fire', 'Đột Kích', 'Liên Quân'])) + '. Trong túi có ít tiền mẹ đưa đóng học thêm.'; },
    opts: [
      { k: 'keyboard', l: 'Đi chơi, nhét tiền dưới bàn phím cho tiện', ai: { risk: 1, w: 1 }, run: function (l, r, log) {
        l.flags.netPlayer = true; skillGame(l, 3);
        if (ch(r, 0.45)) { log('Mắc tiểu chạy đi vệ sinh, quay lại thì tiền dưới bàn phím đã không cánh mà bay.', 'bad'); fx(l, { hap: -6 }); H.mem(l, 'Lần mất tiền học thêm ở quán net, về nhà không dám nói với mẹ.', 2); }
        else { log('Chơi net đến tối mịt, vui quên trời đất.', 'good'); fx(l, { hap: 4, kno: -1 }); }
        if (ch(r, 0.3)) H.sched(l, 'net_acc', 1);
      } },
      { k: 'pocket', l: 'Đi chơi, giữ tiền chặt trong túi', ai: { w: 1 }, run: function (l, r, log) {
        l.flags.netPlayer = true; skillGame(l, 3);
        if (ch(r, 0.25)) { log('Mải chơi quá giờ, về nhà bị bố cho một trận đòn.', 'bad'); fx(l, { hap: -3 }); } else { log('Chơi vài trận rồi về, may mà không ai biết.', 'neutral'); fx(l, { hap: 3 }); }
      } },
      { k: 'skip', l: 'Trốn học thêm để đi net', ai: { risk: 1, bad: 0.6 }, run: function (l, r, log) {
        l.flags.netPlayer = true; skillGame(l, 5);
        if (ch(r, 0.4)) { log('Bị thầy gọi điện về nhà báo trốn học. Mẹ khóc, bố im lặng.', 'bad'); fx(l, { hap: -5, kno: -2 }); } else { log('Trốn học đi net trót lọt.', 'neutral'); fx(l, { hap: 2, kno: -2 }); }
      } },
      { k: 'study', l: 'Thôi, ở nhà học bài', ai: { w: 0.8, smart: 1 }, run: function (l, r, log) { log('Ở nhà học bài, nghe tiếng tụi bạn í ới ngoài ngõ.', 'neutral'); fx(l, { kno: 2 }); } }
    ]
  });
  T('net_coi', function (l, a) { return a >= 9 && a <= 17 && (!l.urban || l.fam.q <= 3) && isVN(l) && free(l); }, function (l) { return l.talent === 'game' ? 0.25 : 0.1; });
  function pick2(l, arr) { return arr[(l.rs >>> 3) % arr.length]; }
  function skillGame(l, x) { if (l.talent === 'game') l.skill = Math.min(100, (l.skill || 20) + x); }

  SC('net_acc', {
    title: 'Gõ mật khẩu chậm', text: 'Đang đăng nhập tài khoản game ở quán net, bạn để ý đứa ngồi máy bên cạnh cứ nhìn chằm chằm vào bàn phím.',
    opts: [
      { k: 'ignore', l: 'Kệ, gõ tiếp', ai: { risk: 1 }, run: function (l, r, log) { if (ch(r, 0.6)) { log('Hôm sau tài khoản game bị đổi mật khẩu — bao năm cày cuốc mất sạch.', 'bad'); fx(l, { hap: -8 }); H.mem(l, 'Ngày mất tài khoản game cày cuốc bao năm.', 2); } else log('Không có chuyện gì xảy ra.', 'neutral'); } },
      { k: 'cover', l: 'Che bàn phím, về nhà đổi mật khẩu ngay', ai: { smart: 1 }, run: function (l, r, log) { log('Cẩn thận che bàn phím và đổi mật khẩu — tài khoản an toàn.', 'good'); fx(l, { kno: 1 }); } }
    ]
  });

  SC('bat_nat', {
    title: 'Bị bắt nạt ở trường', text: 'Mấy đứa lớp trên chặn đường, giật cặp và đòi "tiền bảo kê" mỗi tuần.',
    opts: [
      { k: 'tell', l: 'Kể với thầy cô và bố mẹ', ai: { smart: 0.5 }, run: function (l, r, log) { if (ch(r, 0.7)) { log('Nhà trường vào cuộc, đám bắt nạt bị kỷ luật.', 'good'); fx(l, { hap: 4 }); } else { log('Bị trả đũa vì "mách lẻo", những ngày đến trường thật đáng sợ.', 'bad'); fx(l, { hap: -8, soc: -4 }); } } },
      { k: 'fight', l: 'Đánh trả', ai: { risk: 1.2 }, run: function (l, r, log) { if (ch(r, 0.45)) { log('Đánh trả quyết liệt, từ đó không ai dám động vào.', 'good'); fx(l, { hap: 3, soc: 2 }); } else { log('Đánh nhau, cả hai bên bị đình chỉ học một tuần, bạn sưng mặt về nhà.', 'bad'); fx(l, { hea: -5, hap: -4, kno: -2 }); } } },
      { k: 'friend', l: function (l) { return 'Nhờ ' + (l.bff ? l.bff.name : 'bạn thân') + ' đi cùng'; }, req: function (l) { return !!bff(l); }, ai: { soc: 1 }, run: function (l, r, log) { log('Có ' + l.bff.name + ' kè kè bên cạnh, đám bắt nạt chán rồi bỏ đi.', 'good'); l.bff.close += 8; fx(l, { hap: 3 }); H.mem(l, l.bff.name + ' đứng chắn trước mặt bạn trước đám bắt nạt.', 4); } },
      { k: 'endure', l: 'Im lặng chịu đựng', ai: { w: 0.6 }, run: function (l, r, log) { log('Lặng lẽ đưa tiền ăn sáng cho chúng, cả học kỳ sống trong sợ hãi.', 'bad'); fx(l, { hap: -8, soc: -5 }); H.mem(l, 'Những buổi sáng nhịn đói vì bị bắt nạt lấy tiền.', 3); } }
    ]
  });
  T('bat_nat', function (l, a) { return a >= 8 && a <= 15 && l.school && free(l); }, 0.05);

  SC('quay_cop', {
    title: 'Mang "phao" vào phòng thi?', text: 'Mai thi học kỳ môn bạn sợ nhất. Đứa bạn chuyền cho xấp phao thu nhỏ.',
    opts: [
      { k: 'cheat', l: 'Mang phao vào', ai: { bad: 1, risk: 0.6 }, run: function (l, r, log) { fx(l, { karma: -3 }); if (ch(r, 0.25)) { log('Bị giám thị bắt quả tang, đình chỉ thi môn đó.', 'bad'); fx(l, { hap: -10, kno: -2 }); H.mem(l, 'Ngày bị bắt quay cóp, mặt đỏ bừng giữa phòng thi.', 3); } else { log('Quay cóp trót lọt, điểm cao nhưng chẳng học được gì.', 'neutral'); fx(l, { hap: 2 }); } } },
      { k: 'honest', l: 'Tự làm bằng sức mình', ai: { smart: 0.5 }, run: function (l, r, log) { log('Tự làm bài. Điểm không cao lắm nhưng thấy lòng nhẹ tênh.', 'good'); fx(l, { kno: 2, karma: 2 }); } }
    ]
  });
  T('quay_cop', function (l, a) { return a >= 12 && a <= 17 && l.school && free(l); }, 0.06);

  SC('vape', {
    title: 'Lời rủ rê', text: function (l) { return 'Nhóm bạn mới quen rủ thử ' + (l.age >= 16 ? 'bóng cười và thuốc lá điện tử' : 'thuốc lá điện tử') + ' — "thơm lắm, không sao đâu".'; },
    opts: [
      { k: 'try', l: 'Thử một lần cho biết', ai: { risk: 1.2, soc: 0.5 }, run: function (l, r, log) { log('Thử cho biết, rồi những lần sau đến lúc nào không hay.', 'bad'); fx(l, { hea: -4, karma: -1 }); if (ch(r, 0.35)) { l.flags.vape = true; l.flags.smoke = true; log('Nghiện thuốc lá điện tử.', 'bad'); } if (ch(r, 0.05)) { log('Hít bóng cười quá nhiều, ngất xỉu phải đi cấp cứu.', 'bad'); fx(l, { hea: -12 }); } } },
      { k: 'no', l: 'Từ chối', ai: { w: 1.4 }, run: function (l, r, log) { log('Từ chối thẳng thừng. Bị trêu là "con ngoan trò giỏi", kệ.', 'good'); fx(l, { soc: -1, karma: 1 }); } }
    ]
  });
  T('vape', function (l, a) { return a >= 14 && a <= 20 && free(l); }, 0.05);

  SC('dua_xe', {
    title: 'Đi "bão" đêm', text: 'Hội bạn rủ đêm nay ra đại lộ đi "bão", nẹt pô, bốc đầu xe.',
    opts: [
      { k: 'go', l: 'Đi cho máu', ai: { risk: 1.5, bad: 0.5 }, run: function (l, r, log) {
        var x = r();
        if (x < 0.015) { H.kill(l, 'tai nạn khi đua xe trái phép', log, true); return; }
        if (x < 0.13) { log('Tông vào dải phân cách, gãy chân, xe nát bét.', 'bad'); fx(l, { hea: -20, hap: -8 }); H.mem(l, 'Đêm đua xe kết thúc trong phòng cấp cứu.', 4); }
        else if (x < 0.38) { log('Bị cảnh sát cơ động chặn bắt, xe bị tạm giữ, bố mẹ lên đồn bảo lãnh.', 'bad'); cashB(l, -0.03, 'Nộp phạt đua xe'); fx(l, { hap: -6, karma: -3 }); }
        else { log('Một đêm phóng như bay, tim đập thình thịch. May mà không sao.', 'neutral'); fx(l, { hap: 4, karma: -1 }); }
      } },
      { k: 'no', l: 'Thôi, ở nhà', ai: { w: 1.5 }, run: function (l, r, log) { log('Từ chối, sáng ra đọc báo thấy có vụ tai nạn đua xe.', 'neutral'); } }
    ]
  });
  T('dua_xe', function (l, a) { return a >= 15 && a <= 20 && l.sex === 'M' && isVN(l) && free(l); }, 0.04);

  SC('to_tinh', {
    title: 'Rung động tuổi học trò', prep: function (l, r) { return { n: H.stranger(l, r, H.partnerSex(l, r)) }; },
    text: function (l, d) { return 'Bạn thầm thích ' + d.n + ' ngồi bàn trên đã lâu. Lá thư viết xong rồi, vẫn nằm trong cặp.'; },
    opts: [
      { k: 'yes', l: 'Đưa thư tỏ tình', ai: { risk: 0.8, soc: 0.6 }, run: function (l, r, log, d) { if (ch(r, 0.5)) { log(d.n + ' gật đầu. Mối tình đầu trong trẻo.', 'good'); fx(l, { hap: 8 }); l.flags.firstLove = d.n; H.mem(l, 'Nụ cười của ' + d.n + ' khi nhận lá thư tỏ tình.', 5); } else { log(d.n + ' từ chối khéo. Bạn trùm chăn khóc cả đêm.', 'bad'); fx(l, { hap: -6 }); H.mem(l, 'Lá thư tỏ tình bị từ chối năm ' + l.age + ' tuổi.', 3); } } },
      { k: 'no', l: 'Giữ kín trong lòng', ai: { w: 1 }, run: function (l, r, log, d) { log('Giữ kín tình cảm với ' + d.n + ' — một mối tình câm.', 'neutral'); H.mem(l, 'Mối tình câm với ' + d.n + ' năm ' + l.age + ' tuổi.', 3); } }
    ]
  });
  T('to_tinh', function (l, a) { return a >= 13 && a <= 18 && !l.partner && !l.flags.firstLove && free(l); }, 0.12);

  SC('bo_say', {
    title: 'Đêm giông bão trong nhà', text: 'Bố say khướt về nhà, chửi mắng rồi giơ tay định đánh mẹ.',
    valid: function (l) { return l.fam.fAlive && l.fam.mAlive; },
    opts: [
      { k: 'protect', l: 'Lao vào che cho mẹ', ai: { risk: 0.6, w: 1.2 }, run: function (l, r, log) { log('Lao vào che cho mẹ, lãnh trọn mấy cú đánh.', 'bad'); fx(l, { hea: -8, hap: -6, karma: 3 }); H.mem(l, 'Đêm bạn đứng chắn trước mẹ, người run lên mà không lùi bước.', 6); } },
      { k: 'call', l: 'Chạy sang gọi hàng xóm / gọi 111', ai: { smart: 0.8 }, run: function (l, r, log) { log('Hàng xóm sang can ngăn. Từ hôm đó bố bớt rượu chè hơn.', 'neutral'); fx(l, { hap: -3 }); if (ch(r, 0.25)) { l.fam.vice = null; log('Bố quyết tâm bỏ rượu sau đêm ấy.', 'good'); H.mem(l, 'Ngày bố hứa bỏ rượu.', 4); } } },
      { k: 'hide', l: 'Trốn vào góc nhà bịt tai', ai: { w: 0.7 }, run: function (l, r, log) { log('Trốn trong góc nhà, bịt chặt tai mà vẫn nghe tiếng mẹ khóc.', 'bad'); fx(l, { hap: -9 }); H.mem(l, 'Góc nhà tối nơi bạn trốn những đêm bố say.', 5); } }
    ]
  });
  T('bo_say', function (l, a) { return a >= 10 && a <= 20 && (l.fam.vice === 'alcohol' || l.fam.vice === 'gang') && l.fam.fAlive && l.fam.mAlive && !l.indep; }, 0.2);

  SC('chu_no', {
    title: 'Chủ nợ đến nhà', text: 'Bố thua bạc. Một nhóm người xăm trổ đến tận nhà, đòi xiết nợ, dọa đập phá.',
    opts: [
      { k: 'work', l: 'Bỏ học đi làm, phụ trả nợ cho bố', req: function (l) { return l.age >= 14; }, ai: { w: 0.6 }, run: function (l, r, log) { l.school = null; l.flags.needJob = true; l.flags.famDebt = true; log('Gấp sách vở, đi làm phụ trả nợ cho bố.', 'bad'); fx(l, { hap: -8, karma: 4 }); H.mem(l, 'Năm ' + l.age + ' tuổi, bạn bỏ học để trả nợ cờ bạc cho bố.', 6); } },
      { k: 'beg', l: 'Cùng mẹ năn nỉ khất nợ', ai: { w: 1 }, run: function (l, r, log) { log('Mẹ quỳ xuống năn nỉ. Họ cho khất, nhưng mang chiếc tivi đi.', 'bad'); fx(l, { hap: -7 }); l.flags.famDebt = true; H.mem(l, 'Hình ảnh mẹ quỳ xuống trước chủ nợ.', 6); } },
      { k: 'police', l: 'Lén báo công an', ai: { smart: 1 }, run: function (l, r, log) { if (ch(r, 0.6)) { log('Công an đến giải tán nhóm đòi nợ. Bố bị gọi lên làm việc vì đánh bạc.', 'neutral'); fx(l, { hap: -2, karma: 2 }); } else { log('Báo công an xong, nhóm đòi nợ quay lại tạt sơn vào nhà.', 'bad'); fx(l, { hap: -8 }); } } }
    ]
  });
  T('chu_no', function (l, a) { return a >= 10 && a <= 22 && l.fam.vice === 'gamble' && !l.indep; }, 0.15);

  SC('nghi_hoc_ngheo', {
    title: 'Nhà hết gạo', text: 'Nhà túng quẫn. Bố mẹ ngập ngừng hỏi: hay con nghỉ học ở nhà phụ giúp gia đình?',
    valid: function (l) { return !!l.school; },
    opts: [
      { k: 'both', l: 'Xin đi học tiếp, vừa học vừa làm', ai: { amb: 1 }, run: function (l, r, log) { if (ch(r, 0.7)) { log('Sáng đi học, chiều đi làm thuê. Mệt nhoài nhưng vẫn được đến trường.', 'good'); fx(l, { hea: -4, kno: 1 }); H.mem(l, 'Những buổi chiều vừa tan học đã chạy đi làm thuê.', 4); } else { log('Cố gắng không nổi, học lực sa sút rồi cũng phải nghỉ.', 'bad'); l.school = null; fx(l, { hap: -8 }); } } },
      { k: 'scholar', l: 'Xin học bổng của trường', req: function (l) { return l.st.kno >= 62; }, ai: { smart: 1.5 }, run: function (l, r, log) { if (ch(r, 0.65)) { log('Được nhận học bổng vượt khó, tiếp tục đến trường.', 'good'); fx(l, { hap: 8 }); H.mem(l, 'Ngày nhận học bổng vượt khó, mẹ ôm bạn khóc.', 5); } else { log('Không xin được học bổng, đành nghỉ học.', 'bad'); l.school = null; fx(l, { hap: -8 }); } } },
      { k: 'quit', l: 'Nghỉ học, ở nhà phụ bố mẹ', ai: { w: 0.8 }, run: function (l, r, log) { l.school = null; log('Nghỉ học. Chiếc cặp sách treo trên tường phủ bụi dần.', 'bad'); fx(l, { hap: -10, karma: 3 }); H.mem(l, 'Ngày nghỉ học vì nhà nghèo.', 6); if (l.age >= 15) l.flags.needJob = true; } }
    ]
  });
  T('nghi_hoc_ngheo', function (l, a) { return a >= 11 && a <= 16 && l.school && l.fam.q <= 2 && free(l); }, function (l) { return l.fam.q === 1 ? 0.12 : 0.05; });

  // ---- Phát hiện tài năng & lên chuyên nghiệp ----
  SC('phat_hien', {
    title: 'Năng khiếu được để ý', prep: function (l, r) {
      var t = l.talent, s = l.talentSub;
      var map = {
        'thể thao': 'Thầy thể dục chọn bạn vào đội năng khiếu ' + (s || 'thể thao') + ' của tỉnh.',
        game: 'Bạn leo hạng Thách Đấu ' + (l.game || 'game') + '. Một đội tuyển học viện nhắn tin mời thử việc.',
        'cờ': 'Câu lạc bộ ' + (s || 'cờ') + ' của tỉnh mời bạn vào tập luyện sau khi thắng giải học sinh.',
        'âm nhạc': 'Bạn được mời đi thi một chương trình tìm kiếm giọng hát trên truyền hình.',
        'diễn xuất': 'Một đoàn làm phim về quay ở gần nhà, đạo diễn để ý bạn và mời thử vai.',
        'làm đẹp': 'Clip trang điểm bạn quay cho vui được chia sẻ hàng nghìn lần.'
      };
      return { t: t, msg: map[t] || 'Thầy cô khuyên bạn theo đuổi năng khiếu của mình.' };
    },
    text: function (l, d) { return d.msg + ' Bố mẹ lo ảnh hưởng chuyện học hành.'; },
    valid: function (l) { return /thể thao|game|cờ|âm nhạc|diễn xuất|làm đẹp/.test(l.talent || ''); },
    opts: [
      { k: 'yes', l: 'Theo đuổi đam mê', ai: { amb: 1, risk: 0.5, w: 1.3 }, run: function (l, r, log, d) { l.flags.track = l.talent; l.skill = Math.min(100, (l.skill || 20) + 12); log('Quyết định theo đuổi ' + E.talentText(l) + ' một cách nghiêm túc.', 'big'); fx(l, { hap: 6, kno: -1 }); H.mem(l, 'Ngày bạn quyết định theo đuổi đam mê ' + E.talentText(l) + '.', 5); } },
      { k: 'no', l: 'Tập trung học hành', ai: { smart: 1 }, run: function (l, r, log) { l.flags.trackAsked = true; log('Gác lại năng khiếu, tập trung học hành theo ý bố mẹ.', 'neutral'); fx(l, { kno: 2, hap: -2 }); } }
    ]
  });
  T('phat_hien', function (l, a) { return a >= 9 && a <= 17 && /thể thao|game|cờ|âm nhạc|diễn xuất|làm đẹp/.test(l.talent || '') && !l.flags.track && !l.flags.trackAsked && free(l); }, 0.12);

  SC('len_chuyen', {
    title: 'Lên chuyên nghiệp?', prep: function (l) {
      var t = l.flags.track, id = { 'thể thao': 'vdv', game: U.rand(l) < 0.6 ? 'tuyen_thu_es' : 'streamer', 'cờ': 'ky_thu', 'âm nhạc': 'ca_si', 'diễn xuất': 'dien_vien', 'làm đẹp': U.rand(l) < 0.5 ? 'makeup' : 'youtuber' }[t] || 'youtuber';
      return { id: id };
    },
    text: function (l, d) { return 'Sau nhiều năm khổ luyện, bạn có cơ hội làm ' + E.jobLabel(d.id) + ' chuyên nghiệp. Con đường này đầy vinh quang — và cũng đầy bấp bênh.'; },
    valid: function (l) { return !!l.flags.track && (!l.job || !E.jobDef(l).skillRank); },
    opts: [
      { k: 'go', l: function (l, d) { return 'Trở thành ' + E.jobLabel(d.id); }, h: 'Thu nhập phụ thuộc thành tích', ai: { amb: 1, risk: 0.6, w: 1.4 }, run: function (l, r, log, d) { l.school = null; E.startJob(l, d.id, r, log); } },
      { k: 'no', l: 'Chọn con đường an toàn hơn', ai: { w: 0.8 }, run: function (l, r, log) { l.flags.track = null; log('Gác lại giấc mơ, chọn con đường an toàn.', 'neutral'); H.mem(l, 'Giấc mơ dang dở năm ' + l.age + ' tuổi.', 3); } }
    ]
  });
  T('len_chuyen', function (l, a) { return a >= 16 && a <= 24 && l.flags.track && !(l.job && (E.jobDef(l).skillRank != null || E.jobDef(l).fame)) && l.school !== 'police' && free(l); }, 0.45);

  // ---- Thần tượng & concert ----
  var VENUE = { 'Taylor Swift': ['Singapore', 2.2], 'BTS': ['Seoul', 1.8], 'BLACKPINK': ['Hà Nội', 1], 'BIGBANG': ['Seoul', 1.8], 'G-Dragon': ['Hà Nội', 1], 'Coldplay': ['Bangkok', 1.6], 'Ed Sheeran': ['Bangkok', 1.5], 'Bruno Mars': ['Jakarta', 1.6], 'The Weeknd': ['Bangkok', 1.6] };
  SC('concert', {
    title: 'Đêm nhạc của thần tượng', prep: function (l, r) {
      // v2.4: thần tượng đã giải nghệ (hoặc đời lưu cũ chưa có năm sinh) thì chọn một nghệ sĩ đang hoạt động
      if (l.idol && !l.idolBorn) l.idolBorn = IDOL_BORN_OF(l.idol, l);
      if (!l.idol || H.idolAge(l) > 58) l.idol = H.pickIdol(r, l);
      var idol = l.idol;
      var vn = E.IDOLS.vn.indexOf(idol) >= 0 || E.IDOLS.nextVN.indexOf(idol) >= 0;
      var v = VENUE[idol] || (vn ? [pick(r, ['Hà Nội', 'TP. Hồ Chí Minh']), 1] : [pick(r, ['Bangkok', 'Singapore', 'Seoul', 'Tokyo']), 1.7]);
      if (!isVN(l) && !vn) v = [W.BY[l.country] ? W.BY[l.country].cities[0] : v[0], 1.2];
      var price = (vn ? 0.025 : 0.05) * v[1];
      return { idol: idol, city: v[0], price: price, far: v[1] > 1.3 && isVN(l) };
    },
    text: function (l, d) { return d.idol + ' tổ chức concert ở ' + d.city + '. Vé chính hãng khoảng ' + mb(l, d.price) + (d.far ? ', chưa kể vé máy bay, khách sạn' : '') + ' — và hết sạch sau 5 phút mở bán.'; },
    opts: [
      { k: 'official', l: 'Canh mở bán vé chính hãng', h: function (l, d) { return mb(l, d.price * (d.far ? 3 : 1)); }, ai: { w: 1.2, cost: 0.1 }, run: function (l, r, log, d) {
        if (ch(r, 0.6)) { cashB(l, -d.price * (d.far ? 3 : 1), 'Vé concert ' + d.idol); log('Săn được vé! Đêm concert ' + d.idol + ' ở ' + d.city + ' — bạn hát theo đến khản cổ.', 'good'); fx(l, { hap: 12, soc: 3 }); H.mem(l, 'Đêm concert ' + d.idol + ' ở ' + d.city + ', biển lightstick rực sáng.', 5); }
        else { log('Canh mỏi mắt vẫn không săn được vé ' + d.idol + '.', 'bad'); fx(l, { hap: -4 }); }
      } },
      { k: 'black', l: 'Mua vé "pass lại" trên mạng', h: 'Rẻ hơn… hoặc là lừa đảo', ai: { risk: 1 }, run: function (l, r, log, d) {
        if (ch(r, 0.4)) { cashB(l, -d.price * 1.5, 'Bị lừa mua vé concert giả'); log('Chuyển khoản mua vé xong, người bán chặn liên lạc. Mất trắng ' + mb(l, d.price * 1.5) + '.', 'bad'); fx(l, { hap: -10 }); H.mem(l, 'Lần bị lừa vé concert ' + d.idol + '.', 2); }
        else { cashB(l, -d.price * 1.8 * (d.far ? 2 : 1), 'Vé concert ' + d.idol); log('Mua lại vé giá cao nhưng vẫn kịp đi xem ' + d.idol + '. Đáng từng đồng!', 'good'); fx(l, { hap: 10 }); H.mem(l, 'Đêm concert ' + d.idol + ', nước mắt rơi khi bài hát quen thuộc vang lên.', 5); }
      } },
      { k: 'skip', l: 'Xem livestream ở nhà', ai: { w: 1 }, run: function (l, r, log, d) { log('Ngồi xem livestream concert ' + d.idol + ', hát theo một mình trong phòng.', 'neutral'); fx(l, { hap: 1 }); } }
    ]
  });
  T('concert', function (l, a) { return a >= 14 && a <= 45 && l.idol && !(H.idolAge(l) > 58) && free(l); }, 0.12, 3);
  function IDOL_BORN_OF(name, l) { return E.IDOL_BORN[name] || (l.birthYear + l.age - 24); }
  // thần tượng già đi: đến tuổi thì làm tour chia tay rồi giải nghệ
  EV(function (l, a) { return l.idol && H.idolAge(l) >= 55 && a >= 14; }, 0.35, function (l, a, r, log) {
    var n = l.idol; l.idol = null; l.idolBorn = null;
    log(n + ' tổ chức đêm diễn chia tay sân khấu sau mấy chục năm ca hát. Bạn xem lại những bài hát cũ, thấy cả thanh xuân của mình trong đó.', 'neutral');
    fx(l, { hap: -1 }); H.mem(l, 'Ngày ' + n + ' giải nghệ — một phần thanh xuân khép lại.', 3);
  });

  // =====================================================================
  // LÊN PHỐ, DU HỌC, VIỆC NHẸ LƯƠNG CAO
  // =====================================================================
  SC('ben_xe', {
    title: 'Bến xe nơi phố lạ', prep: function (l) { var c = l.cityStudent ? l.cityStudent.city : (l.movedTo || bigCityName(l)); return { c: c, ben: /Hà Nội/.test(c) ? 'bến xe Mỹ Đình' : /Hồ Chí Minh/.test(c) ? 'bến xe Miền Đông' : 'bến xe' }; },
    text: function (l, d) { return 'Xuống ' + d.ben + ' lúc 4 giờ sáng. Cò mồi, xe ôm vây kín: "Đi đâu em ơi, anh chở, rẻ thôi!"'; },
    opts: [
      { k: 'xeom', l: 'Leo lên xe ôm ngay cổng', ai: { w: 0.8, risk: 0.5 }, run: function (l, r, log, d) { var x = r(); if (x < 0.5) { cashB(l, -0.015, 'Bị xe ôm chặt chém'); log('Quãng đường 5 cây số bị "chém" giá gấp năm lần. Bài học nhập môn ở ' + d.c + '.', 'bad'); fx(l, { hap: -3 }); } else if (x < 0.6) { cashB(l, -0.06, 'Bị cướp điện thoại'); log('Xe ôm chở vào đường vắng, cùng đồng bọn giật mất điện thoại và ví tiền.', 'bad'); fx(l, { hap: -10 }); H.mem(l, 'Ngày đầu đặt chân lên ' + d.c + ' đã bị cướp sạch.', 4); } else log('May gặp chú xe ôm tốt bụng, còn chỉ chỗ ăn sáng rẻ.', 'good'); } },
      { k: 'app', l: 'Mở ứng dụng gọi xe công nghệ', ai: { smart: 1 }, run: function (l, r, log, d) { if (ch(r, 0.12)) { cashB(l, -0.04, 'Bị giật điện thoại'); log('Đứng bấm điện thoại gọi xe thì bị kẻ đi xe máy giật mất máy.', 'bad'); fx(l, { hap: -6 }); } else log('Gọi xe qua ứng dụng, đến nơi an toàn, đúng giá.', 'good'); } },
      { k: 'bus', l: 'Hỏi đường đi xe buýt', ai: { w: 0.7 }, run: function (l, r, log, d) { if (ch(r, 0.2)) { cashB(l, -0.02, 'Mất ba lô trên xe buýt'); log('Ngủ gật trên xe buýt, tỉnh dậy thì ba lô đã bị rạch.', 'bad'); fx(l, { hap: -5 }); } else { log('Lóng ngóng đổi ba chuyến buýt rồi cũng đến nơi. Tự hào ghê.', 'good'); fx(l, { kno: 1 }); } } },
      { k: 'kin', l: 'Gọi người quen ra đón', req: function (l) { return l.st.soc >= 45; }, ai: { soc: 1 }, run: function (l, r, log) { log('Anh họ chạy xe ra đón, còn cho ở nhờ mấy hôm đầu.', 'good'); fx(l, { soc: 2 }); } }
    ]
  });
  SC('tro', {
    title: 'Tìm phòng trọ', prep: function (l) { return { c: l.cityStudent ? l.cityStudent.city : (l.movedTo || 'thành phố') }; },
    text: function (l, d) { return 'Lướt hội nhóm "Phòng trọ giá rẻ ' + d.c + '", một chủ nhà đăng phòng đẹp giá mềm, giục chuyển cọc trước kẻo hết.'; },
    opts: [
      { k: 'pay', l: 'Chuyển cọc luôn kẻo mất phòng', ai: { risk: 1 }, run: function (l, r, log) { if (ch(r, 0.45)) { cashB(l, -0.04, 'Mất tiền cọc phòng trọ ảo'); log('Chuyển cọc xong thì "chủ nhà" khóa Facebook. Phòng trọ không có thật.', 'bad'); fx(l, { hap: -8 }); H.mem(l, 'Mất tiền cọc phòng trọ ảo — cú lừa đầu tiên ở thành phố.', 3); } else log('May mắn, phòng có thật và chủ nhà tử tế.', 'good'); } },
      { k: 'see', l: 'Đến tận nơi xem rồi mới cọc', ai: { smart: 1.2 }, run: function (l, r, log) { log('Đi xem tận nơi, thuê được căn phòng nhỏ đúng như mô tả.', 'good'); fx(l, { kno: 1 }); } },
      { k: 'share', l: 'Ở ghép với bạn cùng quê', ai: { soc: 1 }, run: function (l, r, log) { log('Ở ghép với mấy đứa cùng quê, chật chội nhưng vui và rẻ.', 'good'); fx(l, { soc: 4 }); } }
    ]
  });
  T('tro', function (l, a) { return l.cityStudent && a - l.cityStudent.since <= 1 && free(l); }, 0.5);

  SC('da_cap', {
    title: 'Lời mời "kinh doanh hệ thống"', prep: function (l, r) { return { who: l.bff && l.bff.alive && r() < 0.3 ? l.bff.name : 'Một người bạn cũ' }; },
    text: function (l, d) { return d.who + ' rủ đi "hội thảo khởi nghiệp", hứa thu nhập trăm triệu mỗi tháng, chỉ cần mua gói sản phẩm ban đầu ' + mb(l, 0.2) + ' và rủ thêm người.'; },
    opts: [
      { k: 'join', l: 'Tham gia, tin vào giấc mơ làm giàu', ai: { risk: 1, amb: 0.8, smart: -1 }, run: function (l, r, log) {
        cashB(l, -0.2, 'Mua gói sản phẩm đa cấp');
        var x = r();
        if (x < 0.8) { cashB(l, -0.15, 'Lỗ đa cấp'); log('Ôm một đống hàng không bán được, rủ người thân mua giúp đến mức ai cũng tránh mặt.', 'bad'); fx(l, { hap: -10, soc: -10, karma: -3 }); H.mem(l, 'Những tháng ngày sa vào đa cấp, mất tiền, mất bạn.', 4); }
        else if (x < 0.95) log('Hòa vốn rồi rút ra, coi như học phí.', 'neutral');
        else { cashB(l, 1, 'Hoa hồng đa cấp'); log('Lên được "kim cương" nhờ kéo người — kiếm bộn tiền trên lưng người khác.', 'neutral'); fx(l, { karma: -10 }); }
      } },
      { k: 'no', l: 'Từ chối', ai: { smart: 1, w: 1.3 }, run: function (l, r, log) { log('Từ chối khéo lời mời đa cấp.', 'good'); } },
      { k: 'report', l: 'Tố cáo lên cơ quan chức năng', ai: { w: 0.4 }, run: function (l, r, log) { log('Gửi đơn tố cáo đường dây đa cấp. Ít lâu sau đường dây bị triệt phá.', 'good'); fx(l, { karma: 6 }); } }
    ]
  });
  T('da_cap', function (l, a) { return a >= 18 && a <= 40 && (l.cityStudent || !l.job || l.money < l.base * 0.3) && free(l); }, 0.04);

  SC('viec_online', {
    title: 'Việc làm thêm online', text: 'Một tài khoản lạ nhắn: "Tuyển cộng tác viên like video, 300 nghìn mỗi ngày. Nạp trước để kích hoạt nhiệm vụ."',
    opts: [
      { k: 'pay', l: 'Thử nạp tiền làm nhiệm vụ', ai: { risk: 1, smart: -1.2 }, run: function (l, r, log) { var lost = 0.03 + r() * 0.12; cashB(l, -lost, 'Bị lừa "việc nhẹ online"'); log('Nạp lần đầu được trả thưởng, nạp lần hai số lớn hơn thì bị chặn. Mất ' + mb(l, lost) + '.', 'bad'); fx(l, { hap: -8 }); } },
      { k: 'no', l: 'Chặn tài khoản, báo cáo lừa đảo', ai: { smart: 1, w: 1.5 }, run: function (l, r, log) { log('Nhận ra trò lừa "làm nhiệm vụ", chặn và cảnh báo bạn bè.', 'good'); fx(l, { karma: 1 }); } },
      { k: 'real', l: 'Đi làm thêm thật: phục vụ quán cà phê', ai: { w: 0.8 }, run: function (l, r, log) { cashB(l, 0.04, 'Làm thêm'); log('Đi làm phục vụ quán cà phê buổi tối, có thêm tiền trang trải.', 'good'); fx(l, { hea: -1, soc: 2 }); } }
    ]
  });
  T('viec_online', function (l, a) { return a >= 16 && a <= 45 && free(l); }, 0.04, 5);

  SC('viec_nhe', {
    title: 'Việc nhẹ lương cao', prep: function (l, r) { return { w: pick(r, ['trực page bán hàng', 'chăm sóc khách hàng casino', 'nhập liệu', 'phiên dịch']), pay: pick(r, [25, 30, 35, 40]) }; },
    text: function (l, d) { return 'Trên mạng có tin tuyển "' + d.w + ' ở Campuchia, lương ' + d.pay + ' triệu/tháng, không cần bằng cấp, bao vé đi lại, bao ăn ở". Người tuyển dụng nhắn tin rất nhiệt tình.'; },
    opts: [
      { k: 'go', l: 'Đi ngay — cơ hội đổi đời', ai: { risk: 1.3, smart: -1.5, w: 0.7 }, run: function (l, r, log) { H.chain(l, 'kh_den'); } },
      { k: 'check', l: 'Tìm hiểu kỹ trước đã', ai: { smart: 1.2, w: 1.2 }, run: function (l, r, log) {
        if (ch(r, 0.35 + l.st.kno / 150)) { log('Tra cứu trên báo, phát hiện đây là chiêu dụ dỗ người sang làm trong các trại lừa đảo. Bạn cảnh báo bạn bè cùng xóm.', 'good'); fx(l, { karma: 4 }); H.mem(l, 'Lần thoát khỏi lời mời "việc nhẹ lương cao" nhờ cẩn thận.', 3); }
        else { log('Không tìm ra điều gì bất thường. Người tuyển dụng giục bạn quyết nhanh.', 'neutral'); H.chain(l, 'viec_nhe2'); }
      } },
      { k: 'no', l: 'Không tin, bỏ qua', ai: { w: 1.4 }, run: function (l, r, log) { log('Bỏ qua lời mời "việc nhẹ lương cao".', 'neutral'); } }
    ]
  });
  SC('viec_nhe2', {
    title: 'Quyết định cuối cùng', text: 'Người tuyển dụng gửi ảnh văn phòng đẹp, ảnh "nhân viên" cầm cọc tiền. Họ bảo xe đón ở biên giới sáng mai.',
    opts: [
      { k: 'go', l: 'Đi', ai: { risk: 1, w: 0.6 }, run: function (l, r, log) { H.chain(l, 'kh_den'); } },
      { k: 'no', l: 'Linh cảm không ổn — ở lại', ai: { w: 1.2 }, run: function (l, r, log) { log('Linh cảm không ổn, bạn ở lại. Mấy tháng sau báo đưa tin giải cứu hàng trăm người từ Campuchia.', 'good'); H.mem(l, 'Linh cảm đã cứu bạn khỏi chuyến đi Campuchia.', 4); } }
    ]
  });
  T('viec_nhe', function (l, a) { return a >= 17 && a <= 35 && (isVN(l) || /th|la|mm|id|ph|cn|my/.test(l.pool)) && !l.abroad && (l.edu <= 3 || !l.job || l.money < 0) && !l.flags.cambodia && free(l); }, function (l) { return l.money < 0 || !l.job ? 0.05 : 0.025; });

  SC('kh_den', {
    title: 'Bên kia biên giới', tone: 'dark',
    prep: function (l) {
      l.abroad = { code: 'KH', name: 'Campuchia', perm: false, until: l.age + 20, trapped: true };
      l.prevJob = l.job; l.job = { id: 'scam_kh', rank: 0, yrs: 0 }; l.school = null;
      return {};
    },
    text: function (l) { return 'Xe chạy suốt đêm. Đến nơi, hộ chiếu bị thu, điện thoại bị lấy. Khu nhà có rào kẽm gai, bảo vệ mang súng. Bạn bị ép lừa đảo ' + (isVN(l) ? 'người Việt' : 'đồng hương') + ' qua mạng, không đạt chỉ tiêu sẽ bị đánh, bị chích điện.'; },
    opts: [
      { k: 'comply', l: 'Cúi đầu làm theo để sống sót', ai: { w: 1.2 }, run: function (l, r, log) { log('Ngày ngày ngồi trước máy tính lừa người khác, đêm về nằm khóc. Bạn tự nhủ phải sống để về.', 'bad'); fx(l, { hap: -15, karma: -6 }); H.mem(l, 'Căn phòng chật kín máy tính trong trại lừa đảo ở Campuchia.', 7); H.sched(l, 'kh_song', 1); } },
      { k: 'escape', l: 'Tìm cách trốn thoát', ai: { risk: 1.5 }, run: function (l, r, log) { khEscape(l, r, log); } },
      { k: 'phone', l: 'Lén giấu một điện thoại, nhắn gia đình & đại sứ quán', ai: { smart: 1.5 }, run: function (l, r, log) { khPhone(l, r, log); } }
    ]
  });
  SC('kh_song', {
    title: 'Trong trại lừa đảo', tone: 'dark',
    valid: function (l) { return !!(l.abroad && l.abroad.trapped); },
    text: function (l) { return 'Đã ' + Math.max(1, l.age - (l.flags.khSince || l.age)) + ' năm bị giam. Có người bị bán sang công ty khác, có người không bao giờ trở lại phòng.'; },
    opts: [
      { k: 'ransom', l: 'Nhắn gia đình gom tiền chuộc', h: function (l) { return 'Khoảng ' + mb(l, 1.5); }, ai: { w: 1 }, run: function (l, r, log) { cashB(l, -1.5, 'Tiền chuộc khỏi trại lừa đảo'); if (ch(r, 0.7)) khFree(l, log, 'Gia đình bán đất, vay mượn khắp nơi để chuộc bạn về.'); else { log('Gia đình chuyển tiền chuộc nhưng bọn chúng lật lọng, bán bạn sang công ty khác.', 'bad'); fx(l, { hap: -15 }); H.sched(l, 'kh_song', 1); } } },
      { k: 'escape', l: 'Liều mình trốn thoát', ai: { risk: 1.5 }, run: function (l, r, log) { khEscape(l, r, log); } },
      { k: 'phone', l: 'Tìm cách liên lạc với cơ quan chức năng', ai: { smart: 1.5 }, run: function (l, r, log) { khPhone(l, r, log); } },
      { k: 'comply', l: 'Tiếp tục chịu đựng', ai: { w: 0.6 }, run: function (l, r, log) { if (ch(r, 0.05)) { H.kill(l, 'kiệt sức và bị hành hạ trong trại lừa đảo ở Campuchia', log, true); l.flags.cambodia = 'Bỏ mạng nơi đất khách trong một trại lừa đảo ở Campuchia.'; return; } log('Thêm một năm sống như tù nhân. Sức khỏe sa sút từng ngày.', 'bad'); fx(l, { hea: -10, hap: -10, karma: -4 }); H.sched(l, 'kh_song', 1); } }
    ]
  });
  function khFree(l, log, t) {
    log(t + ' Bạn đặt chân về ' + l.countryName + ', gầy rộc, ôm chầm lấy người thân ở cửa khẩu.', 'big');
    H.mem(l, 'Giây phút bước qua cửa khẩu trở về sau địa ngục ở Campuchia.', 9);
    l.abroad = null; l.job = l.prevJob && E.resolveJob(l.prevJob.id) !== 'scam_kh' ? l.prevJob : null; l.prevJob = null;
    if (!l.job) l.flags.needJob = true;
    l.flags.cambodia = 'Từng bị lừa bán sang trại lừa đảo ở Campuchia và may mắn trở về.';
    fx(l, { hap: 10, hea: -5 }); H.sched(l, 'tram_cam', 1);
  }
  function khEscape(l, r, log) {
    var x = r();
    if (x < 0.1) { H.kill(l, 'bị đánh khi bỏ trốn khỏi trại lừa đảo ở Campuchia', log, true); l.flags.cambodia = 'Bỏ mạng khi cố trốn khỏi trại lừa đảo ở Campuchia.'; return; }
    if (x < 0.35) { khFree(l, log, 'Nhân lúc bảo vệ đổi ca, bạn trèo rào, chạy bộ suốt đêm đến đồn cảnh sát địa phương.'); return; }
    log('Bị bắt lại khi đang trèo rào. Bị đánh thừa sống thiếu chết rồi bị bán sang một công ty khác.', 'bad');
    fx(l, { hea: -22, hap: -15 }); H.mem(l, 'Trận đòn sau lần trốn thoát bất thành.', 6); l.flags.khSince = l.flags.khSince || l.age;
    H.sched(l, 'kh_song', 1);
  }
  function khPhone(l, r, log) {
    if (ch(r, 0.25 + l.st.kno / 200)) { khFree(l, log, 'Tin nhắn cầu cứu đến được đại sứ quán. Cảnh sát Campuchia phối hợp đột kích, giải cứu bạn cùng nhiều người khác.'); return; }
    log('Chiếc điện thoại giấu trong gối bị phát hiện. Bạn bị nhốt vào "phòng tối" một tuần.', 'bad');
    fx(l, { hea: -15, hap: -12 }); l.flags.khSince = l.flags.khSince || l.age; H.sched(l, 'kh_song', 1);
  }

  var STUDY = [['US', 'Hoa Kỳ', 'en', 3.5], ['AU', 'Úc', 'en', 3], ['JP', 'Nhật Bản', 'jp', 2], ['KR', 'Hàn Quốc', 'kr', 1.8], ['GB', 'Vương quốc Anh', 'en', 3.5], ['CA', 'Canada', 'en', 3], ['DE', 'Đức', 'de', 1.2], ['SG', 'Singapore', 'sg', 3], ['FR', 'Pháp', 'fr', 1.5]];
  SC('du_hoc', {
    title: 'Du học', prep: function (l, r) { var c = pick(r, STUDY); return { c: c, cost: c[3] }; },
    text: function (l, d) { return 'Cơ hội du học ' + d.c[1] + '. Học phí và sinh hoạt khoảng ' + mb(l, d.cost) + ' mỗi năm. Bạn sẽ đi bằng con đường nào?'; },
    opts: [
      { k: 'scholar', l: 'Săn học bổng toàn phần', h: 'Cần học lực rất tốt', ai: { smart: 1.5 }, run: function (l, r, log, d) { if (ch(r, U.clamp((l.st.kno - 55) / 40, 0.05, 0.85))) { log('Giành học bổng toàn phần du học ' + d.c[1] + '!', 'big'); H.mem(l, 'Email báo đỗ học bổng toàn phần ' + d.c[1] + ' lúc nửa đêm.', 6); goAbroad(l, d.c, log); } else { log('Trượt học bổng du học.', 'bad'); fx(l, { hap: -6 }); l.pending.unshift(E.DEC.uniFail.make(l, r)); } } },
      { k: 'parents', l: 'Bố mẹ chi trả toàn bộ', req: function (l) { return l.fam.q >= 4; }, ai: { w: 1.5 }, run: function (l, r, log, d) { log('Bố mẹ dốc hầu bao cho bạn du học ' + d.c[1] + '.', 'big'); H.mem(l, 'Bố mẹ tiễn bạn ở sân bay ngày đi du học.', 5); goAbroad(l, d.c, log); } },
      { k: 'agency', l: 'Qua công ty tư vấn du học', h: function (l) { return 'Phí dịch vụ ~' + mb(l, 0.6) + ', vay thêm'; }, ai: { risk: 0.6 }, run: function (l, r, log, d) {
        if (ch(r, 0.18)) { cashB(l, -0.6, 'Mất tiền cho công ty du học ma'); log('Công ty tư vấn du học ôm tiền bỏ trốn, hồ sơ visa bị làm giả. Giấc mơ du học tan vỡ.', 'bad'); fx(l, { hap: -12 }); H.mem(l, 'Giấc mơ du học tan vỡ vì công ty lừa đảo.', 4); l.pending.unshift(E.DEC.uniFail.make(l, r)); return; }
        cashB(l, -0.6, 'Phí công ty du học'); H.addLoan(l, 'family', l.base * d.cost); cashB(l, -d.cost, 'Học phí du học năm đầu');
        log('Qua công ty du học, gia đình vay mượn thêm để bạn sang ' + d.c[1] + '. Vừa học vừa làm thêm để trả nợ.', 'big'); goAbroad(l, d.c, log);
      } },
      { k: 'no', l: 'Thôi, học trong nước', ai: { w: 0.5 }, run: function (l, r, log) { l.pending.unshift(E.DEC.uni.make(l, r)); } }
    ]
  });
  function goAbroad(l, c, log) {
    l.abroad = { code: c[0], name: c[1], study: true, until: l.age + 4, pool: c[2] };
    l.flags.studiedAbroad = c[1]; l.uniTier = 1.35; l.uniCity = c[1];
    l.pending.unshift(E.DEC.major.make(l, H.rf(l)));
    l.pending.forEach(function (d) { if (d.id === 'major') d.title = 'Chọn ngành học ở ' + c[1]; });
    var fixSchool = function () { l.school = 'abroad'; };
    l.flags.abroadSchool = true; fixSchool();
  }
  SC('du_hoc_ve', {
    title: 'Về nước hay ở lại?', valid: function (l) { return !!(l.abroad && l.abroad.study); },
    text: function (l) { return 'Bạn đã tốt nghiệp ở ' + l.abroad.name + '. Một công ty bản địa ngỏ ý giữ bạn lại. Ở quê nhà, bố mẹ ngày một già.'; },
    opts: [
      { k: 'home', l: 'Về nước cống hiến', ai: { soc: 1 }, run: function (l, r, log) { var n = l.abroad.name; l.abroad = null; l.flags.needJob = true; log('Về nước với tấm bằng ' + n + ' — được các công ty săn đón.', 'big'); H.mem(l, 'Ngày trở về quê hương sau những năm du học ' + n + '.', 4); } },
      { k: 'stay', l: 'Ở lại làm việc, định cư', ai: { amb: 1 }, run: function (l, r, log) { var c = STUDY.filter(function (x) { return x[1] === l.abroad.name; })[0] || ['US', 'Hoa Kỳ', 'en']; l.abroad = null; H.emigrate(l, [c[0], c[1], c[2]], r, log); l.flags.needJob = true; l.job = null; } }
    ]
  });

  // =====================================================================
  // GIAO THÔNG & XE CỘ
  // =====================================================================
  SC('den_vang', {
    title: 'Đèn vàng còn 3 giây', text: function (l) { return 'Bạn đang vội ' + pick2(l, ['đi làm muộn', 'đón con', 'đi gặp đối tác', 'chạy về nhà vì mẹ ốm']) + '. Đèn vàng nhấp nháy, còn 3 giây nữa chuyển đỏ.'; },
    opts: [
      { k: 'stop', l: 'Dừng lại chờ đèn', ai: { w: 1.4 }, run: function (l, r, log) { log('Dừng lại chờ đèn đỏ. Muộn vài phút, nhưng an toàn.', 'neutral'); } },
      { k: 'go', l: 'Rồ ga vượt qua', ai: { risk: 1.4 }, run: function (l, r, log) {
        var x = r();
        if (x < 0.008) { H.kill(l, 'tai nạn giao thông khi vượt đèn đỏ', log, true); return; }
        if (x < 0.13) { log('Va chạm với xe từ hướng khác lao tới. Gãy tay, xe hỏng nặng.', 'bad'); fx(l, { hea: -15, hap: -6 }); cashB(l, -0.08, 'Viện phí & sửa xe sau tai nạn'); H.mem(l, 'Cú va chạm ở ngã tư khi cố vượt đèn vàng.', 4); }
        else if (x < 0.45) { log('Vừa qua vạch thì đèn đỏ, CSGT ra hiệu dừng xe.', 'bad'); H.chain(l, 'csgt', { why: 'vượt đèn đỏ', f: l.veh === 'ô tô' ? 20 : 5 }); }
        else log('Vượt qua trót lọt. Tim vẫn còn đập thình thịch.', 'neutral');
      } }
    ]
  });
  T('den_vang', function (l, a) { return a >= 16 && a <= 75 && vehicle(l) && free(l); }, 0.07, 3);

  SC('csgt', {
    title: 'CSGT ra hiệu dừng xe', prep: function (l, r, arg) {
      if (arg && arg.why) return arg;
      var opts = [];
      if (!l.lic.A1 && l.veh === 'xe máy') opts.push({ why: 'chạy xe máy không có bằng lái', f: 3 });
      if (!l.lic.B && l.veh === 'ô tô') opts.push({ why: 'lái ô tô không có bằng lái', f: 15 });
      if (l.addict && l.addict.alcohol) opts.push({ why: 'có nồng độ cồn khi lái xe', f: l.veh === 'ô tô' ? 35 : 7 });
      opts.push({ why: 'không đội mũ bảo hiểm', f: 0.6 }, { why: 'đi sai làn', f: 1 });
      return pick(r, opts);
    },
    text: function (l, d) { return 'Tổ CSGT ra hiệu dừng xe vì lỗi ' + d.why + '. Mức phạt khoảng ' + H.money(l, fine(l, d.f)) + '.'; },
    opts: [
      { k: 'stop', l: 'Dừng xe, chấp hành', ai: { w: 1.5 }, run: function (l, r, log, d) { H.cash(l, -fine(l, d.f), 'Nộp phạt giao thông: ' + d.why); log('Dừng xe chấp hành, nộp phạt ' + H.money(l, fine(l, d.f)) + ' vì ' + d.why + '.' + (/bằng lái|nồng độ/.test(d.why) ? ' Xe bị tạm giữ.' : ''), 'bad'); fx(l, { hap: -4 }); if (/bằng lái/.test(d.why)) H.sched(l, 'bang_lai', 1); } },
      { k: 'flee', l: 'Rồ ga bỏ chạy', ai: { risk: 1.5, bad: 0.6 }, run: function (l, r, log, d) {
        var x = r();
        if (x < 0.03) { log('Bỏ chạy, mất lái tông vào cột điện.', 'bad'); fx(l, { hea: -22 }); if (ch(r, 0.15)) { H.kill(l, 'tai nạn khi bỏ chạy CSGT', log, true); } return; }
        if (x < 0.4) { H.cash(l, -fine(l, d.f) * 2.5, 'Phạt gấp vì chống người thi hành công vụ'); log('Bị đuổi kịp, khống chế ngay giữa đường. Phạt nặng gấp mấy lần vì chống đối.', 'bad'); fx(l, { hea: -4, hap: -8, karma: -4 }); return; }
        if (x < 0.75) { H.cash(l, -fine(l, d.f) * 1.5, 'Phạt nguội gửi về nhà'); log('Chạy thoát, nhưng camera đã chụp biển số. Mấy tuần sau giấy phạt nguội gửi về tận nhà.', 'bad'); fx(l, { hap: -5, karma: -2 }); return; }
        log('Luồn lách vào hẻm, thoát được. Tim đập như trống trận.', 'neutral'); fx(l, { karma: -3 });
      } },
      { k: 'bribe', l: 'Xin "bỏ qua" bằng phong bì', ai: { bad: 1 }, run: function (l, r, log, d) {
        var x = r(); fx(l, { karma: -4 });
        if (x < 0.4) { H.cash(l, -fine(l, d.f) * 0.4, 'Phong bì "bỏ qua"'); log('Dúi phong bì, được cho đi. Lòng vẫn thấy gợn gợn.', 'neutral'); }
        else if (x < 0.85) { H.cash(l, -fine(l, d.f), 'Nộp phạt giao thông'); log('Bị từ chối thẳng thừng, vẫn phải lập biên bản nộp phạt.', 'bad'); fx(l, { hap: -4 }); }
        else { H.cash(l, -fine(l, d.f) * 3, 'Phạt nặng vì đưa hối lộ'); log('Bị lập thêm biên bản vì hành vi đưa hối lộ.', 'bad'); fx(l, { hap: -10 }); }
      } }
    ]
  });
  T('csgt', function (l, a) { return a >= 16 && vehicle(l) && free(l); }, function (l) { return (!l.lic.A1 && l.veh === 'xe máy') || (!l.lic.B && l.veh === 'ô tô') ? 0.12 : 0.04; }, 2);

  SC('an_va', {
    title: 'Ăn vạ giữa đường', text: 'Đang đi chậm thì một người đàn ông bất ngờ ngã lăn ra trước đầu xe, ôm chân la lối, đòi bồi thường "tiền thuốc men" ngay.',
    opts: [
      { k: 'pay', l: 'Đưa tiền cho xong chuyện', ai: { w: 1 }, run: function (l, r, log) { cashB(l, -0.04, 'Bị ăn vạ'); log('Đưa tiền cho xong. Vừa quay đi đã thấy hắn đứng dậy bước đi bình thường.', 'bad'); fx(l, { hap: -5 }); } },
      { k: 'police', l: 'Gọi công an, trích xuất camera', ai: { smart: 1.2 }, run: function (l, r, log) { if (ch(r, 0.7)) { log('Camera hành trình cho thấy rõ người đó tự ngã. Kẻ ăn vạ bị đưa về đồn.', 'good'); fx(l, { hap: 3 }); } else { log('Mất nguyên buổi chiều ở đồn làm việc, cuối cùng hai bên tự thỏa thuận.', 'neutral'); cashB(l, -0.02, 'Thỏa thuận vụ va chạm'); } } },
      { k: 'argue', l: 'Cãi lý tới cùng', ai: { risk: 1 }, run: function (l, r, log) { if (ch(r, 0.3)) { log('Đồng bọn của kẻ ăn vạ xúm vào, bạn bị đánh và mất luôn ví.', 'bad'); fx(l, { hea: -6 }); cashB(l, -0.04, 'Bị cướp ví'); } else log('Cãi một hồi, người xem đông, kẻ ăn vạ đành bỏ đi.', 'neutral'); } }
    ]
  });
  T('an_va', function (l, a) { return a >= 18 && vehicle(l) && isVN(l) && free(l); }, 0.03);

  SC('tong_nguoi', {
    title: 'Tai nạn bất ngờ', text: 'Trời mưa, đường trơn. Bạn phanh không kịp, va vào một người đi xe đạp. Người đó ngã, chảy máu đầu.',
    opts: [
      { k: 'help', l: 'Dừng lại, đưa người ta đi viện, bồi thường', ai: { w: 1.5, bad: -0.8 }, run: function (l, r, log) { var c = 0.08 + r() * 0.25; cashB(l, -c, 'Bồi thường tai nạn'); log('Đưa nạn nhân đi viện, trả viện phí và bồi thường ' + mb(l, c) + '. Gia đình họ cảm ơn sự tử tế của bạn.', 'neutral'); fx(l, { karma: 6, hap: -3 }); H.mem(l, 'Đêm ngồi ngoài phòng cấp cứu chờ tin người bị bạn va phải.', 4); } },
      { k: 'flee', l: 'Bỏ chạy', ai: { bad: 1.5, risk: 1 }, run: function (l, r, log) { fx(l, { karma: -18, hap: -6 }); H.mem(l, 'Cú bỏ chạy đêm mưa — ám ảnh suốt nhiều năm.', 5); if (ch(r, 0.5)) { log('Bỏ chạy, nhưng camera an ninh ghi lại biển số. Công an tìm đến tận nhà.', 'bad'); H.sched(l, 'bi_bat', 0, { why: 'gây tai nạn rồi bỏ trốn', sev: 1 }); } else log('Bỏ chạy thoát. Không ai biết. Chỉ có bạn biết.', 'bad'); } }
    ]
  });
  T('tong_nguoi', function (l, a) { return a >= 18 && vehicle(l) && free(l); }, 0.012);

  SC('cuop_xe_om', {
    title: 'Cuốc xe đêm khuya', text: 'Chở khách vào một con hẻm vắng lúc nửa đêm. Khách bất ngờ rút dao kề cổ, đòi xe và tiền.',
    valid: function (l) { return l.job && E.jobDef(l) && E.jobDef(l).tag === 'driver' || hasJob(l, ['xe_om']); },
    opts: [
      { k: 'give', l: 'Đưa hết, giữ mạng', ai: { w: 1.5 }, run: function (l, r, log) { cashB(l, -0.08, 'Bị cướp xe & tiền'); log('Giao xe và tiền cho cướp. Mất trắng phương tiện kiếm sống.', 'bad'); fx(l, { hap: -12 }); H.mem(l, 'Đêm bị cướp xe, đi bộ về nhà lúc 2 giờ sáng.', 4); } },
      { k: 'fight', l: 'Chống trả', ai: { risk: 1.6 }, run: function (l, r, log) { var x = r(); if (x < 0.04) { H.kill(l, 'bị cướp đâm khi đang chạy xe kiếm sống', log, true); return; } if (x < 0.5) { log('Giằng co, bị đâm vào tay, cướp vẫn lấy được xe.', 'bad'); fx(l, { hea: -15 }); cashB(l, -0.1, 'Mất xe & viện phí'); } else { log('Quật ngã được tên cướp, người dân xúm lại bắt giữ.', 'good'); fx(l, { hap: 5, karma: 3 }); } } },
      { k: 'trick', l: 'Giả vờ hợp tác rồi tri hô', ai: { smart: 1.4 }, run: function (l, r, log) { if (ch(r, 0.3 + l.st.kno / 250)) { log('Giả vờ đưa ví rồi tri hô thật lớn, đèn nhà dân bật sáng, tên cướp bỏ chạy.', 'good'); fx(l, { hap: 4 }); } else { log('Bị phát hiện, ăn một cú đấm và mất xe.', 'bad'); fx(l, { hea: -8 }); cashB(l, -0.08, 'Bị cướp xe'); } } }
    ]
  });
  T('cuop_xe_om', function (l, a) { return l.job && ((E.jobDef(l) && E.jobDef(l).tag === 'driver') || hasJob(l, ['xe_om'])) && free(l); }, 0.04);

  SC('khach_quit', {
    title: 'Khách quỵt tiền', text: function (l) { return hasJob(l, ['shipper']) ? 'Giao đơn hàng 2 triệu đến nơi, khách tắt máy không nghe — bị "bom hàng" lần thứ ba trong tuần.' : 'Chở khách say xỉn về đến nhà, khách xuống xe rồi chửi bới, không trả tiền.'; },
    opts: [
      { k: 'let', l: 'Thôi bỏ qua, coi như xui', ai: { w: 1.4 }, run: function (l, r, log) { cashB(l, -0.005, 'Bị khách quỵt'); log('Đành chịu mất một cuốc. Kiếm đồng tiền sao mà khó.', 'bad'); fx(l, { hap: -3 }); } },
      { k: 'argue', l: 'Đòi cho bằng được', ai: { risk: 1 }, run: function (l, r, log) { if (ch(r, 0.5)) { log('Đứng đòi mãi, cuối cùng người nhà khách ra trả tiền và xin lỗi.', 'neutral'); } else { log('Cãi nhau to, bị khách đấm vào mặt.', 'bad'); fx(l, { hea: -4, hap: -4 }); } } },
      { k: 'report', l: 'Báo lên ứng dụng / hội nhóm tài xế', ai: { smart: 1 }, run: function (l, r, log) { log('Đăng lên hội nhóm tài xế cảnh báo, anh em chia sẻ rầm rộ.', 'neutral'); fx(l, { soc: 2 }); } }
    ]
  });
  T('khach_quit', function (l, a) { return l.job && ((E.jobDef(l) && E.jobDef(l).tag === 'driver') || hasJob(l, ['xe_om'])) && free(l); }, 0.07);

  SC('bang_lai', {
    title: 'Thi bằng lái', prep: function (l) { return { t: !l.lic.A1 ? 'A1' : 'B', name: !l.lic.A1 ? 'bằng lái xe máy (A1)' : 'bằng lái ô tô (B)', cost: !l.lic.A1 ? 0.01 : 0.18 }; },
    text: function (l, d) { return 'Bạn đăng ký thi ' + d.name + '. Học phí khoảng ' + mb(l, d.cost) + '.'; },
    valid: function (l) { return !(l.lic.A1 && l.lic.B); },
    opts: [
      { k: 'self', l: 'Tự ôn luyện và đi thi', ai: { w: 1.4, smart: 0.5 }, run: function (l, r, log, d) { cashB(l, -d.cost, 'Học & thi ' + d.name); if (ch(r, U.clamp(0.45 + l.st.kno / 150, 0.4, 0.95))) { l.lic[d.t] = true; log('Thi đỗ ' + d.name + '.', 'good'); fx(l, { hap: 4 }); } else { log('Trượt phần thi sa hình. Hẹn lần sau.', 'bad'); fx(l, { hap: -3 }); } } },
      { k: 'buy', l: 'Mua bằng "bao đậu"', ai: { bad: 1.2 }, run: function (l, r, log, d) { fx(l, { karma: -5 }); cashB(l, -d.cost * 2.5, 'Tiền "bao đậu" bằng lái'); if (ch(r, 0.3)) { log('Đưa tiền cho "cò" thi bằng, hóa ra là lừa đảo. Mất tiền, vẫn không có bằng.', 'bad'); fx(l, { hap: -6 }); } else { l.lic[d.t] = true; log('Có bằng ' + d.t + ' nhờ "bao đậu" — nhưng tay lái vẫn non.', 'neutral'); l.flags.weakDriver = true; } } }
    ]
  });

  SC('mua_xe', {
    title: 'Mua xe', prep: function (l) {
      var vn = isVN(l);
      return { moto: vn ? 0.3 : 0.12, ev: 0.2, car: vn ? 7 : 3.5 };
    },
    text: function (l, d) { return 'Bạn tính mua xe. Xe máy khoảng ' + mb(l, d.moto) + ', xe máy điện ' + mb(l, d.ev) + ', ô tô khoảng ' + mb(l, d.car) + '. Hiện bạn có ' + H.money(l, l.money) + '.'; },
    opts: [
      { k: 'moto', l: 'Mua xe máy (trả thẳng)', req: function (l, d) { return l.money >= d.moto * l.base && l.veh !== 'xe máy' && l.veh !== 'ô tô'; }, ai: { w: 2 }, run: function (l, r, log, d) { buyVeh(l, 'xe máy', d.moto, false, log); } },
      { k: 'moto_tg', l: 'Mua xe máy trả góp', req: function (l) { return l.veh !== 'xe máy' && l.veh !== 'ô tô'; }, h: 'Trả góp qua công ty tài chính, lãi cao', ai: { w: 1 }, run: function (l, r, log, d) { buyVeh(l, 'xe máy', d.moto, 'fin', log); } },
      { k: 'ev', l: 'Mua xe máy điện', req: function (l, d) { return l.money >= d.ev * l.base && !vehicle(l); }, ai: { w: 0.8 }, run: function (l, r, log, d) { buyVeh(l, 'xe máy', d.ev, false, log, 'xe máy điện'); } },
      { k: 'car', l: 'Mua ô tô (trả thẳng)', req: function (l, d) { return l.money >= d.car * l.base && l.veh !== 'ô tô'; }, ai: { w: 1.2 }, run: function (l, r, log, d) { buyVeh(l, 'ô tô', d.car, false, log); } },
      { k: 'car_loan', l: 'Mua ô tô, vay ngân hàng 70%', req: function (l, d) { return l.money >= d.car * 0.3 * l.base && l.veh !== 'ô tô'; }, ai: { w: 0.7, amb: 1 }, run: function (l, r, log, d) { if (!H.canBankLoan(l)) { log('Ngân hàng từ chối cho vay mua xe vì bạn đang có nợ xấu.', 'bad'); fx(l, { hap: -4 }); return; } buyVeh(l, 'ô tô', d.car, 'car', log); } },
      { k: 'no', l: 'Thôi, chưa mua', ai: { w: 0.5 }, run: function () { } }
    ]
  });
  function buyVeh(l, v, price, loan, log, label) {
    cashB(l, -price, 'Mua ' + (label || v));
    if (loan) H.addLoan(l, loan, price * l.base * (loan === 'car' ? 0.7 : 0.9));
    l.veh = v; l.vehVal = price * l.base;
    log('Mua ' + (label || v) + (loan ? ' (trả góp)' : '') + '.', 'good'); fx(l, { hap: v === 'ô tô' ? 8 : 4 });
    if (v === 'ô tô') H.mem(l, 'Lần đầu lái chiếc ô tô của chính mình về quê, cả xóm ra xem.', 4);
    if ((v === 'xe máy' && !l.lic.A1) || (v === 'ô tô' && !l.lic.B)) log('Bạn chưa có bằng lái ' + (v === 'ô tô' ? 'ô tô' : 'xe máy') + ' — ra đường có nguy cơ bị phạt.', 'neutral');
  }
  EV(function (l, a) { return a >= 15 && a <= 19 && !l.veh && l.fam.q >= 2 && (isVN(l) || l.gdp < 20); }, 0.3, function (l, a, r, log) {
    l.veh = isVN(l) && a < 18 ? 'xe đạp' : 'xe máy'; l.vehVal = l.base * (l.veh === 'xe máy' ? 0.25 : 0.03);
    log(l.veh === 'xe máy' ? 'Bố mẹ mua cho chiếc xe máy cũ để đi học, đi làm.' : 'Được bố mẹ mua cho chiếc xe đạp điện để đi học.', 'good'); fx(l, { hap: 4 });
  });

  // =====================================================================
  // TIỀN BẠC, NỢ NẦN & CÁM DỖ
  // =====================================================================
  var ITEMS = [['chiếc iPhone đời mới nhất', 0.3], ['chiếc xe tay ga SH', 1], ['chiếc túi hàng hiệu', 0.4], ['bộ máy tính chơi game xịn', 0.35], ['chiếc tivi to cho bố mẹ', 0.15], ['đồng hồ hàng hiệu', 0.6]];
  SC('mua_sam', {
    title: 'Cơn thèm mua sắm', prep: function (l, r) {
      // v2.4: bố mẹ đã mất thì không còn "mua tivi cho bố mẹ"
      var pw0 = parentsWord(l), items = ITEMS.filter(function (x) { return !/bố mẹ/.test(x[0]) || pw0; }).map(function (x) { return [x[0].replace('bố mẹ', pw0 || 'bố mẹ'), x[1]]; });
      var it = pick(r, items); return { n: it[0], p: it[1] };
    },
    text: function (l, d) { return 'Bạn rất muốn mua ' + d.n + ' (~' + mb(l, d.p) + '). Bạn bè ai cũng có. Trong tài khoản hiện có ' + H.money(l, l.money) + '.'; },
    opts: [
      { k: 'cash', l: 'Trả bằng tiền tiết kiệm', req: function (l, d) { return l.money >= d.p * l.base; }, ai: { w: 1, amb: 0.5 }, run: function (l, r, log, d) { cashB(l, -d.p, 'Mua ' + d.n); log('Mua ' + d.n + ' bằng tiền dành dụm. Vui được vài tuần.', 'neutral'); fx(l, { hap: 4 }); } },
      { k: 'card', l: 'Quẹt thẻ tín dụng', req: function (l) { return H.canBankLoan(l) && l.indep; }, h: 'Lãi ~30%/năm nếu trả chậm', ai: { risk: 0.8 }, run: function (l, r, log, d) { cashB(l, -d.p, 'Mua ' + d.n); H.addLoan(l, 'card', d.p * l.base); log('Quẹt thẻ mua ' + d.n + '. Sao kê tháng sau tính sau.', 'neutral'); fx(l, { hap: 4 }); } },
      { k: 'paylater', l: 'Mua bằng ví trả sau', h: 'Không cần chứng minh thu nhập', ai: { risk: 1 }, run: function (l, r, log, d) { cashB(l, -d.p, 'Mua ' + d.n); H.addLoan(l, 'paylater', d.p * l.base); log('Bấm "mua trước trả sau" chỉ trong vài giây.', 'neutral'); fx(l, { hap: 4 }); } },
      { k: 'appden', l: 'Vay app "giải ngân 5 phút"', h: 'Lãi cắt cổ, đòi nợ khủng bố', ai: { risk: 1.5, smart: -1.2 }, run: function (l, r, log, d) { cashB(l, -d.p, 'Mua ' + d.n); H.addLoan(l, 'appden', d.p * l.base); log('Vay qua ứng dụng, chỉ cần chụp CCCD và cho truy cập danh bạ.', 'bad'); fx(l, { hap: 3 }); H.mem(l, 'Cái chạm tay đồng ý cho app vay truy cập danh bạ.', 3); } },
      { k: 'save', l: 'Để dành, khi nào đủ tiền mới mua', ai: { w: 1.3, smart: 0.6 }, run: function (l, r, log) { log('Kìm lòng, quyết định để dành.', 'good'); fx(l, { karma: 1 }); } }
    ]
  });
  T('mua_sam', function (l, a) { return a >= 18 && a <= 60 && l.indep && free(l); }, 0.06, 3);

  SC('khung_bo', {
    title: 'Cuộc gọi đòi nợ', tone: 'dark', valid: function (l) { return H.hasLoan(l, 'appden') || H.hasLoan(l, 'nong'); },
    text: function (l) {
      var who = [l.job ? 'cho sếp' : '', parentsWord(l) ? 'cho ' + parentsWord(l) + ' bạn' : '', l.kids.some(function (k) { return k.alive; }) ? 'cho con cái bạn' : ''].filter(Boolean);
      return 'Đầu dây là giọng đe dọa: không trả nợ thì sẽ gửi "ảnh ghép" cho toàn bộ danh bạ' + (who.length ? ', gọi điện ' + who.join(', ') : '') + '. ' + (l.job ? 'Đồng nghiệp' : 'Hàng xóm') + ' đã bắt đầu nhận tin nhắn bôi nhọ.';
    },
    opts: [
      { k: 'roll', l: 'Vay app khác để đắp vào', ai: { risk: 1.2, smart: -1, w: 0.5 }, run: function (l, r, log) { var d = H.debtTotal(l) * 0.5; H.addLoan(l, 'appden', d); payOff(l, ['appden', 'nong'], d); log('Vay chỗ này đắp chỗ kia, nợ lãi mẹ đẻ lãi con.', 'bad'); fx(l, { hap: -8 }); l.flags.thugDebt = true; } },
      { k: 'police', l: 'Trình báo công an', ai: { smart: 1.3 }, run: function (l, r, log) { if (ch(r, 0.6)) { log('Công an vào cuộc triệt phá đường dây cho vay. Bạn chỉ phải trả phần gốc.', 'good'); clearLoans(l, ['appden', 'nong'], 0.4); l.flags.thugDebt = false; fx(l, { hap: 6 }); } else { log('Trình báo xong, chúng càng khủng bố gắt hơn, tạt sơn trước cửa nhà.', 'bad'); fx(l, { hap: -10 }); } } },
      { k: 'family', l: 'Thú thật với gia đình, nhờ giúp', ai: { soc: 1, w: 1.2 }, run: function (l, r, log) {
        var d = H.debtTotal(l), hw = helperWord(l); clearLoans(l, ['appden', 'nong'], 0); H.addLoan(l, 'family', Math.min(d, l.base * 3)); l.flags.thugDebt = false;
        log(hw === 'bố mẹ' || hw === 'mẹ' || hw === 'bố' ? 'Kể hết với ' + hw + '. ' + U.cap(hw) + ' bán đi chiếc xe, trả nợ thay bạn.' : 'Kể hết với ' + hw + '. Mọi người góp tiền trả nợ thay bạn, coi như cho vay không lấy lãi.', 'neutral');
        fx(l, { hap: -4, karma: 2 }); H.mem(l, 'Ngày thú nhận nợ app đen với ' + hw + '.', 6);
      } },
      { k: 'ignore', l: 'Mặc kệ, chặn số', ai: { risk: 1 }, run: function (l, r, log) { fx(l, { hap: -12 }); log('Chặn số này lại có số khác gọi. Ảnh ghép của bạn lan khắp nhóm Zalo công ty.', 'bad'); if (l.job && ch(r, 0.35)) { log('Công ty cho bạn nghỉ việc vì "ảnh hưởng hình ảnh".', 'bad'); l.job = null; l.flags.needJob = true; } H.sched(l, 'tram_cam', 0); } }
    ]
  });
  T('khung_bo', function (l, a) { return l.flags.thugDebt && free(l); }, 0.7);
  function payOff(l, types, amt) { (l.loans || []).forEach(function (x) { if (types.indexOf(x.type) >= 0 && amt > 0) { var p = Math.min(x.bal, amt); x.bal -= p; amt -= p; } }); }
  function clearLoans(l, types, keep) { (l.loans || []).forEach(function (x) { if (types.indexOf(x.type) >= 0) x.bal *= keep; }); l.loans = l.loans.filter(function (x) { return x.bal > 0.5; }); }

  var CUP = { 2026: 'World Cup 2026', 2028: 'Euro 2028', 2030: 'World Cup 2030', 2032: 'Euro 2032', 2034: 'World Cup 2034', 2036: 'Euro 2036', 2038: 'World Cup 2038' };
  SC('ca_do', {
    title: 'Mùa bóng đá', prep: function (l) { return { cup: CUP[yr(l)] || 'Ngoại hạng Anh' }; },
    text: function (l, d) { return 'Mùa ' + d.cup + ', quán cà phê đầu ngõ thành "sòng" cá độ. Đám bạn rủ "chơi vài kèo cho vui".'; },
    opts: [
      { k: 'small', l: 'Đặt vài kèo nhỏ cho vui', ai: { risk: 1, bad: 0.4 }, run: function (l, r, log) { var w = r() < 0.45 ? 0.04 : -0.06; cashB(l, w, w > 0 ? 'Thắng cá độ' : 'Thua cá độ'); log(w > 0 ? 'Thắng vài kèo, hả hê khao cả bàn.' : 'Thua sạch tiền tiêu vặt cả tháng.', w > 0 ? 'neutral' : 'bad'); fx(l, { karma: -2 }); if (ch(r, 0.1)) addictGamble(l, log); } },
      { k: 'big', l: 'Đặt kèo lớn, "tất tay" đổi đời', ai: { risk: 1.8, bad: 0.8 }, run: function (l, r, log) { fx(l, { karma: -4 }); if (ch(r, 0.25)) { cashB(l, 0.8, 'Thắng cá độ lớn'); log('Trúng kèo lớn! Ôm về một cục tiền — và lòng tham bắt đầu lớn dần.', 'neutral'); addictGamble(l, log, 0.5); } else { cashB(l, -0.6, 'Thua cá độ'); log('Thua trắng. Phải vay nóng để trả nợ nhà cái.', 'bad'); H.addLoan(l, 'nong', l.base * 0.3); fx(l, { hap: -12 }); if (ch(r, 0.35)) addictGamble(l, log); } } },
      { k: 'no', l: 'Chỉ xem bóng, không cá độ', ai: { w: 1.5 }, run: function (l, r, log) { log('Ngồi xem bóng, hò hét cùng cả xóm. Không cá độ đồng nào.', 'good'); fx(l, { hap: 2 }); } }
    ]
  });
  T('ca_do', function (l, a) { return a >= 16 && a <= 65 && free(l) && !(l.addict && l.addict.gamble); }, function (l) { return (CUP[yr(l)] ? 0.2 : 0.03) * (l.sex === 'M' ? 1 : 0.3); });
  function addictGamble(l, log, p) { if (!l.addict.gamble && (p == null || U.rand(l) < p)) { l.addict.gamble = true; log('Bắt đầu nghiện cờ bạc.', 'bad'); H.mem(l, 'Lần đầu thấy mình không dừng được trước bàn cược.', 4); } }
  SC('nghien_bac', {
    title: 'Cơn nghiện cờ bạc', tone: 'dark', valid: function (l) { return l.addict && l.addict.gamble; },
    text: 'Đêm nào cũng mơ thấy mình thắng lớn. "Gỡ lại một ván thôi rồi bỏ."',
    opts: [
      { k: 'play', l: 'Chơi tiếp để gỡ', ai: { risk: 1.5, w: 1.2 }, run: function (l, r, log) { cashB(l, -0.4, 'Thua bạc'); if (l.money < 0) H.addLoan(l, 'nong', l.base * 0.4); log('Càng gỡ càng thua. Nợ nóng chồng chất.', 'bad'); fx(l, { hap: -10, karma: -3 }); if (l.partner && l.partner.status !== 'dating' && ch(r, 0.15)) { H.endPartner(l, log, 'div'); } } },
      { k: 'pawn', l: 'Cắm sổ đỏ để gỡ một lần cuối', req: function (l) { return l.ownHouse; }, ai: { risk: 2 }, run: function (l, r, log) { if (ch(r, 0.2)) { log('Gỡ được một ít, chuộc lại sổ đỏ. Lần này may.', 'neutral'); } else { log('Mất trắng. Căn nhà bị siết nợ, cả nhà phải ra ở trọ.', 'bad'); l.ownHouse = false; l.houseVal = 0; clearLoans(l, ['home'], 0); fx(l, { hap: -25 }); H.mem(l, 'Ngày giao chìa khóa nhà cho chủ nợ.', 8); } } },
      { k: 'quit', l: 'Nhờ gia đình giám sát, quyết cai', ai: { w: 0.8, smart: 1 }, run: function (l, r, log) { if (ch(r, 0.45)) { l.addict.gamble = false; log('Đốt hết sổ sách lô đề, xóa ứng dụng cá cược. Cai được cờ bạc.', 'good'); fx(l, { hap: 8, karma: 5 }); H.mem(l, 'Ngày bỏ được cờ bạc.', 5); } else log('Cai được vài tháng rồi lại tái nghiện.', 'bad'); } }
    ]
  });
  T('nghien_bac', function (l, a) { return l.addict && l.addict.gamble && free(l); }, 0.4);

  SC('ve_so', {
    title: 'Mua vé số', text: 'Cô bán vé số đi ngang qua: "Mua giùm cô vài tờ đi con, hôm nay ngày đẹp!"',
    opts: [
      { k: 'one', l: 'Mua 1 tờ cho vui', ai: { w: 1.5 }, run: function (l, r, log) { lotto(l, r, log, 1); } },
      { k: 'many', l: 'Mua cả xấp 10 tờ', ai: { risk: 1 }, run: function (l, r, log) { lotto(l, r, log, 10); } },
      { k: 'vietlott', l: function (l) { return isVN(l) ? 'Mua vé Vietlott Power 6/55' : 'Mua vé xổ số jackpot'; }, ai: { risk: 0.8 }, run: function (l, r, log) { lotto(l, r, log, 0); } }
    ]
  });
  function lotto(l, r, log, n) {
    if (n === 0) { cashB(l, -0.002, 'Vé số jackpot'); if (r() < 1 / 30000) { cashB(l, 150, 'Trúng jackpot'); log('TRÚNG JACKPOT! Cả đời không dám mơ đến con số này.', 'big'); fx(l, { hap: 30 }); H.mem(l, 'Giây phút dò vé và nhận ra mình trúng jackpot.', 9); return; } if (r() < 0.03) { cashB(l, 0.01, 'Trúng giải phụ'); log('Trúng giải nhỏ, đủ mua thêm vài vé.', 'neutral'); } else log('Không trúng. Thôi, coi như góp quỹ phúc lợi.', 'neutral'); return; }
    cashB(l, -0.0001 * n * 9, 'Mua vé số');
    var x = r();
    if (x < 0.000025 * n) { cashB(l, 20, 'Trúng giải đặc biệt xổ số'); log('Trúng giải đặc biệt xổ số kiến thiết!', 'big'); fx(l, { hap: 25 }); H.mem(l, 'Tờ vé số trúng giải đặc biệt, tay run không cầm nổi.', 8); }
    else if (x < 0.01 * n) { cashB(l, 0.01, 'Trúng giải nhỏ vé số'); log('Trúng giải khuyến khích, vui cả ngày.', 'good'); fx(l, { hap: 2 }); }
    else log('Dò vé — trượt hết. Cô bán vé số cũng có thêm bữa cơm.', 'neutral');
  }

  SC('dau_tu', {
    title: 'Đầu tư', text: function (l) { return 'Bạn có ' + H.money(l, l.money) + ' tiền nhàn rỗi. Người ta bàn tán khắp nơi chuyện làm giàu nhanh.'; },
    opts: [
      { k: 'saving', l: 'Gửi tiết kiệm ngân hàng', ai: { w: 1.4 }, run: function (l, r, log) { cashB(l, 0.02, 'Lãi tiết kiệm'); log('Gửi tiết kiệm. Chậm mà chắc.', 'neutral'); } },
      { k: 'gold', l: 'Mua vàng tích trữ', ai: { w: 1 }, run: function (l, r, log) { var g = U.normal(r) * 0.1 + 0.05; cashB(l, l.money * g / l.base, g >= 0 ? 'Lãi từ vàng' : 'Lỗ vàng'); log(g >= 0 ? 'Giá vàng lên, lãi kha khá.' : 'Giá vàng giảm, lỗ nhẹ.', 'neutral'); } },
      { k: 'stock', l: 'Chơi chứng khoán', ai: { risk: 1, smart: 0.6 }, run: function (l, r, log) { var g = U.normal(r) * 0.35 + 0.04 + (l.st.kno - 60) / 400; cashB(l, Math.max(-0.7, g) * Math.max(0, l.money) / l.base, g >= 0 ? 'Lãi chứng khoán' : 'Lỗ chứng khoán'); log(g > 0.3 ? 'Bắt đúng sóng, tài khoản xanh rực!' : g >= 0 ? 'Chứng khoán lãi nhẹ.' : 'Thị trường sập, tài khoản đỏ lòm.', g >= 0 ? 'good' : 'bad'); fx(l, { hap: g > 0 ? 3 : -5 }); } },
      { k: 'crypto', l: 'Đổ tiền vào tiền mã hóa', ai: { risk: 1.6 }, run: function (l, r, log) { var x = r(), m = Math.max(0, l.money); if (x < 0.15) { cashB(l, -m * 0.9 / l.base, 'Mất trắng tiền mã hóa'); log('Sàn tiền ảo sập, mất gần như toàn bộ.', 'bad'); fx(l, { hap: -15 }); H.mem(l, 'Ngày nhìn tài khoản tiền ảo về gần con số 0.', 5); } else if (x < 0.55) { cashB(l, -m * 0.4 / l.base, 'Lỗ tiền mã hóa'); log('Đu đỉnh, cắt lỗ đau đớn.', 'bad'); fx(l, { hap: -6 }); } else if (x < 0.92) { cashB(l, m * 0.5 / l.base, 'Lãi tiền mã hóa'); log('Tiền ảo tăng giá, lãi đậm.', 'good'); fx(l, { hap: 5 }); } else { cashB(l, m * 4 / l.base, 'Lãi lớn tiền mã hóa'); log('Gấp mấy lần vốn nhờ tiền mã hóa!', 'big'); fx(l, { hap: 12 }); } } },
      { k: 'land', l: 'Đầu tư đất nền theo "sốt"', ai: { risk: 1.2 }, run: function (l, r, log) { var m = Math.max(0, l.money), g = r() < 0.5 ? 0.6 : -0.45; cashB(l, m * g / l.base, g > 0 ? 'Lãi đất nền' : 'Lỗ đất nền'); log(g > 0 ? 'Lướt sóng đất nền trúng đậm.' : 'Đất mua đúng đỉnh sốt, giờ rao bán không ai mua.', g > 0 ? 'good' : 'bad'); } }
    ]
  });

  SC('vay_tien', {
    title: 'Vay tiền', prep: function (l) { return { amt: 1 }; },
    text: function (l) { return 'Bạn cần một khoản tiền gấp. ' + (l.credit && l.credit.bad ? 'Hồ sơ của bạn đang có nợ xấu trên CIC.' : 'Hồ sơ tín dụng của bạn sạch.'); },
    opts: [
      { k: 'bank', l: 'Vay ngân hàng (lãi ~9%/năm)', req: function (l) { return l.indep; }, ai: { w: 1.4, smart: 1 }, run: function (l, r, log) { if (!H.canBankLoan(l) || (l.income || 0) <= 0) { log('Ngân hàng từ chối: ' + (H.canBankLoan(l) ? 'không chứng minh được thu nhập.' : 'bạn đang có nợ xấu.'), 'bad'); fx(l, { hap: -3 }); return; } H.addLoan(l, 'bank', l.base); log('Vay ngân hàng ' + mb(l, 1) + '.', 'neutral'); } },
      { k: 'fin', l: 'Vay công ty tài chính tiêu dùng (lãi ~45%)', req: function (l) { return H.loanAgeOk(l, 'fin'); }, ai: { w: 0.8 }, run: function (l, r, log) { H.addLoan(l, 'fin', l.base * 0.7); log('Vay tiêu dùng ' + mb(l, 0.7) + ', lãi suất cao.', 'neutral'); } },
      { k: 'family', l: 'Vay người thân', req: function (l) { return l.fam.mAlive || l.fam.fAlive || l.fam.sibs > 0; }, ai: { soc: 1 }, run: function (l, r, log) { H.addLoan(l, 'family', l.base * 0.5); log('Ngại ngùng hỏi vay người thân ' + mb(l, 0.5) + '.', 'neutral'); fx(l, { soc: -2 }); } },
      { k: 'app', l: 'Vay app nhanh (không cần chứng minh)', req: function (l) { return H.loanAgeOk(l, 'appden'); }, ai: { risk: 1.3, smart: -1 }, run: function (l, r, log) { H.addLoan(l, 'appden', l.base * 0.5); log('Vay app ' + mb(l, 0.5) + ' trong 5 phút. Thực nhận chỉ 70% vì "phí dịch vụ".', 'bad'); cashB(l, -0.15, 'Phí dịch vụ app vay'); } },
      { k: 'nong', l: 'Vay nóng giang hồ', ai: { risk: 1.6, bad: 0.4 }, run: function (l, r, log) { H.addLoan(l, 'nong', l.base * 0.8); log('Vay nóng ' + mb(l, 0.8) + ', lãi ngày.', 'bad'); } }
    ]
  });
  SC('tra_no', {
    title: 'Trả nợ', text: function (l) { return 'Tổng nợ hiện tại: ' + H.money(l, H.debtTotal(l)) + '. Tiền mặt: ' + H.money(l, l.money) + '.'; },
    valid: function (l) { return H.debtTotal(l) > 0.5; },
    opts: [
      { k: 'expensive', l: 'Trả các khoản lãi cao trước', req: function (l) { return l.money > 0; }, ai: { w: 2, smart: 1 }, run: function (l, r, log) { var m = l.money; l.loans.sort(function (a, b) { return b.rate - a.rate; }); l.loans.forEach(function (x) { var p = Math.min(x.bal, m); x.bal -= p; m -= p; }); var paid = l.money - m; H.cash(l, -paid, 'Trả nợ'); l.loans = l.loans.filter(function (x) { return x.bal > 0.5; }); if (!H.hasLoan(l, 'appden') && !H.hasLoan(l, 'nong')) l.flags.thugDebt = false; log('Trả nợ ' + H.money(l, paid) + '.', 'good'); fx(l, { hap: 4 }); } },
      { k: 'later', l: 'Để sau', ai: { w: 0.3 }, run: function () { } }
    ]
  });
  SC('chi_tieu', {
    title: 'Cách chi tiêu', text: function (l) { return 'Hiện tại bạn đang chi tiêu ' + { save: 'tằn tiện', normal: 'bình thường', lavish: 'thoải mái' }[l.spend] + '. Bạn muốn sống thế nào?'; },
    opts: [
      { k: 'save', l: 'Tằn tiện, tiết kiệm tối đa', h: 'Để dành nhiều, kém vui một chút', run: function (l, r, log) { l.spend = 'save'; log('Quyết định sống tằn tiện, ky cóp từng đồng.', 'neutral'); } },
      { k: 'normal', l: 'Chi tiêu bình thường', run: function (l, r, log) { l.spend = 'normal'; log('Chi tiêu vừa phải.', 'neutral'); } },
      { k: 'lavish', l: 'Sống thoải mái, "tiền đẻ ra để tiêu"', h: 'Vui hơn, khó tích lũy', run: function (l, r, log) { l.spend = 'lavish'; log('Quyết định sống cho hiện tại, chi tiêu thoải mái.', 'neutral'); } }
    ]
  });
  SC('gui_bo_me', {
    title: function (l) { return 'Phụng dưỡng ' + (parentsWord(l) || 'bố mẹ'); }, valid: function (l) { return !!parentsWord(l); },
    text: function (l) { return l.sendParents ? 'Bạn đang gửi tiền về cho ' + parentsWord(l) + ' hằng tháng.' : 'Hiện bạn chưa gửi tiền về cho ' + parentsWord(l) + '.'; },
    opts: [
      { k: 'on', l: function (l) { return 'Gửi tiền hằng tháng cho ' + parentsWord(l); }, run: function (l, r, log) { l.sendParents = true; log('Hằng tháng gửi tiền về biếu ' + parentsWord(l) + '.', 'good'); fx(l, { karma: 2 }); } },
      { k: 'gift', l: 'Biếu một khoản lớn ngay', h: function (l) { return mb(l, 0.3); }, req: function (l) { return l.money > 0.3 * l.base; }, run: function (l, r, log) { var m = l.fam.mAlive; cashB(l, -0.3, 'Biếu ' + parentsWord(l)); log('Biếu ' + parentsWord(l) + ' một khoản. ' + (m ? 'Mẹ' : 'Bố') + ' cất kỹ dưới đáy tủ, chẳng dám tiêu.', 'good'); fx(l, { hap: 4, karma: 4 }); H.mem(l, 'Bàn tay ' + (m ? 'mẹ' : 'bố') + ' run run nhận phong bì bạn biếu.', 3); } },
      { k: 'off', l: 'Tạm thời chưa gửi', run: function (l, r, log) { l.sendParents = false; log('Tạm dừng gửi tiền về cho ' + parentsWord(l) + '.', 'neutral'); } }
    ]
  });

  // =====================================================================
  // TÌNH CẢM, GIA ĐÌNH & BẠN BÈ
  // =====================================================================
  SC('tim_nguoi_yeu', {
    title: 'Tìm một nửa', text: 'Bạn bè lần lượt có đôi. Bạn quyết định chủ động tìm một nửa của mình.',
    valid: function (l) { return !l.partner; },
    opts: [
      { k: 'app', l: 'Dùng ứng dụng hẹn hò', ai: { risk: 0.6 }, run: function (l, r, log) { var x = r(); if (x < 0.12) { cashB(l, -0.1, 'Bị lừa tình qua mạng'); log('Quen một "người tình" qua mạng, hứa gửi quà từ nước ngoài, bắt chuyển phí hải quan. Mất tiền, mất niềm tin.', 'bad'); fx(l, { hap: -8 }); } else if (x < 0.6) l.pending.unshift(E.DEC.love.make(l, r, { where: 'qua ứng dụng hẹn hò' })); else log('Quẹt mỏi tay mà chẳng ai hợp.', 'neutral'); } },
      { k: 'match', l: 'Nhờ người quen mai mối', ai: { soc: 0.8 }, run: function (l, r, log) { if (ch(r, 0.65)) l.pending.unshift(E.DEC.love.make(l, r, { where: 'qua người quen mai mối' })); else log('Đi xem mắt vài lần, chưa thấy ai hợp ý.', 'neutral'); } },
      { k: 'work', l: 'Để ý một người ở chỗ làm / trường học', ai: { w: 1 }, run: function (l, r, log) { if (ch(r, 0.55)) l.pending.unshift(E.DEC.love.make(l, r, { where: l.school ? 'ở trường' : 'ở chỗ làm' })); else log('Người ấy đã có người yêu.', 'neutral'); } },
      { k: 'club', l: 'Đi bar, câu lạc bộ, sự kiện', ai: { soc: 1.2, cost: 0.05 }, run: function (l, r, log) { cashB(l, -0.03, 'Đi chơi'); if (ch(r, 0.4)) l.pending.unshift(E.DEC.love.make(l, r, { where: 'trong một buổi tiệc' })); else log('Một đêm vui, nhưng không thêm số điện thoại nào.', 'neutral'); } }
    ]
  });
  SC('hen_ho', {
    title: 'Hâm nóng tình cảm', text: function (l) { return 'Dạo này bạn và ' + l.partner.name + ' ít thời gian cho nhau.'; },
    valid: function (l) { return !!l.partner; },
    opts: [
      { k: 'dinner', l: 'Một bữa tối lãng mạn', h: function (l) { return mb(l, 0.02); }, run: function (l, r, log) { cashB(l, -0.02, 'Hẹn hò'); log('Bữa tối nến cùng ' + l.partner.name + '.', 'good'); fx(l, { hap: 4, soc: 2 }); } },
      { k: 'trip', l: 'Một chuyến du lịch chỉ hai người', h: function (l) { return mb(l, 0.1); }, run: function (l, r, log) { cashB(l, -0.1, 'Du lịch cùng ' + pw(l)); log('Chuyến đi chỉ có hai người, như hồi mới yêu.', 'good'); fx(l, { hap: 8, soc: 3 }); H.mem(l, 'Chuyến đi biển cùng ' + l.partner.name + ', hai người ngồi đếm sao.', 4); } },
      { k: 'talk', l: 'Dành một buổi tối nói chuyện thật lòng', run: function (l, r, log) { log('Ngồi nói với nhau những điều bấy lâu giấu kín.', 'good'); fx(l, { hap: 3, soc: 3 }); } }
    ]
  });
  SC('ngoai_tinh', {
    title: 'Cám dỗ', prep: function (l, r) { return { n: H.stranger(l, r, H.partnerSex(l, r)) }; },
    text: function (l, d) { return d.n + ', một đồng nghiệp mới, liên tục nhắn tin tán tỉnh dù biết bạn đã có gia đình.'; },
    valid: function (l) { return l.partner && l.partner.status !== 'dating'; },
    opts: [
      { k: 'no', l: 'Dứt khoát từ chối', ai: { w: 2 }, run: function (l, r, log) { log('Dứt khoát từ chối, chặn tin nhắn.', 'good'); fx(l, { karma: 3 }); } },
      { k: 'flirt', l: 'Nhắn qua nhắn lại cho vui', ai: { risk: 1, bad: 0.6 }, run: function (l, r, log, d) { fx(l, { karma: -3 }); if (ch(r, 0.35)) { log(l.partner.name + ' đọc được tin nhắn. Nhà cửa ầm ĩ.', 'bad'); fx(l, { hap: -10 }); if (ch(r, 0.3)) H.endPartner(l, log, 'div'); } else log('Những tin nhắn mập mờ, rồi tự thấy chán.', 'neutral'); } },
      { k: 'affair', l: 'Lao vào cuộc tình vụng trộm', ai: { bad: 1.5, risk: 1 }, run: function (l, r, log, d) { fx(l, { karma: -12, hap: 4 }); H.mem(l, 'Cuộc tình vụng trộm với ' + d.n + '.', 4); if (ch(r, 0.5)) { log('Bị phát hiện ngoại tình. Gia đình tan vỡ.', 'bad'); H.endPartner(l, log, 'div'); fx(l, { hap: -10 }); } else log('Giấu được, nhưng mỗi đêm về nhà đều thấy mình có lỗi.', 'bad'); } }
    ]
  });
  T('ngoai_tinh', function (l, a) { return a >= 26 && a <= 60 && l.partner && l.partner.status !== 'dating' && free(l); }, 0.03);

  SC('me_chong', {
    title: 'Chuyện mẹ chồng nàng dâu', text: 'Mẹ chồng chê bạn nấu ăn không vừa miệng, tiêu tiền hoang, chuyện nhỏ thành to.',
    valid: function (l) { return l.partner && l.partner.status === 'married' && l.sex === 'F'; },
    opts: [
      { k: 'patient', l: 'Nhẫn nhịn, khéo léo chiều lòng', ai: { w: 1.3 }, run: function (l, r, log) { log('Nhẫn nhịn và khéo léo, dần dần mẹ chồng cũng thương.', 'good'); fx(l, { hap: -2, karma: 2 }); } },
      { k: 'argue', l: 'Nói thẳng quan điểm', ai: { risk: 1 }, run: function (l, r, log) { if (ch(r, 0.5)) { log('Nói chuyện thẳng thắn, hai mẹ con hiểu nhau hơn.', 'good'); fx(l, { hap: 3 }); } else { log('Cãi nhau to, chồng kẹt ở giữa.', 'bad'); fx(l, { hap: -8 }); } } },
      { k: 'move', l: 'Thuyết phục chồng ra ở riêng', ai: { w: 1 }, run: function (l, r, log) { cashB(l, -0.1, 'Chuyển ra ở riêng'); log('Ra ở riêng. Xa thơm gần thối.', 'neutral'); fx(l, { hap: 4 }); } }
    ]
  });
  T('me_chong', function (l, a) { return isVN(l) && a >= 20 && a <= 45 && l.sex === 'F' && l.partner && l.partner.status === 'married' && free(l); }, 0.05);

  SC('con_om', {
    title: 'Con ốm giữa đêm', prep: function (l) { var k = l.kids.filter(function (k) { return k.alive && l.age - k.born <= 6; })[0]; return { n: k ? k.name : 'con', vac: k ? k.vac : true }; },
    text: function (l, d) { return 'Nửa đêm, ' + d.n + ' sốt cao 40 độ, co giật' + (d.vac === false ? ' — bé chưa được tiêm phòng đầy đủ' : '') + '.'; },
    valid: function (l) { return l.kids.some(function (k) { return k.alive && l.age - k.born <= 6; }); },
    opts: [
      { k: 'hosp', l: 'Ôm con chạy thẳng vào viện nhi', h: function (l) { return mb(l, 0.05); }, ai: { w: 2 }, run: function (l, r, log, d) { cashB(l, -0.05, 'Viện phí cho con'); log('Chạy vào viện nhi lúc 2 giờ sáng. Bác sĩ nói may đến kịp.', 'neutral'); fx(l, { hap: -2 }); H.mem(l, 'Đêm ôm ' + d.n + ' chạy vào viện, mưa ướt hết lưng áo.', 5); } },
      { k: 'home', l: 'Hạ sốt ở nhà, theo dõi thêm', ai: { w: 0.6 }, run: function (l, r, log, d) { var risk = d.vac === false ? 0.06 : 0.015; if (ch(r, risk)) { var k = l.kids.filter(function (k) { return k.alive && l.age - k.born <= 6; })[0]; if (k) { k.alive = false; k.died = l.age; } log(d.n + ' không qua khỏi. Bạn ân hận suốt đời vì đã không đưa con đi viện sớm.', 'bad'); fx(l, { hap: -30 }); H.mem(l, 'Nỗi ân hận lớn nhất đời: đêm ấy đã không đưa ' + d.n + ' đi viện.', 9); } else { log('Chườm mát, cho uống hạ sốt, sáng ra con đỡ dần.', 'neutral'); } } }
    ]
  });
  T('con_om', function (l, a) { return l.kids.some(function (k) { return k.alive && a - k.born <= 6; }) && free(l); }, 0.08);

  SC('con_hoc', {
    title: 'Chuyện học của con', prep: function (l) { var k = l.kids.filter(function (k) { return k.alive && l.age - k.born >= 6 && l.age - k.born <= 17; })[0]; return { n: k ? k.name : 'con' }; },
    text: function (l, d) { return 'Mọi người bàn tán chuyện cho con học trường quốc tế, học thêm tiếng Anh. ' + d.n + ' đang học lớp ' + Math.max(1, l.age - (l.kids.filter(function (k) { return k.name === d.n; })[0] || { born: l.age - 6 }).born - 5) + '.'; },
    valid: function (l) { return l.kids.some(function (k) { return k.alive && l.age - k.born >= 6 && l.age - k.born <= 17; }); },
    opts: [
      { k: 'intl', l: 'Cho con học trường quốc tế', h: function (l) { return mb(l, 0.6) + '/năm'; }, req: function (l) { return l.money > l.base; }, ai: { amb: 1, cost: 1 }, run: function (l, r, log, d) { cashB(l, -0.6, 'Học phí trường quốc tế'); log('Cho ' + d.n + ' học trường quốc tế. Tốn kém nhưng đáng.', 'neutral'); fx(l, { hap: 2 }); } },
      { k: 'extra', l: 'Cho con đi học thêm', h: function (l) { return mb(l, 0.05) + '/năm'; }, ai: { w: 1.4 }, run: function (l, r, log, d) { cashB(l, -0.05, 'Học thêm cho con'); log(d.n + ' đi học thêm ba buổi mỗi tuần.', 'neutral'); } },
      { k: 'free', l: 'Để con học tự nhiên, chơi nhiều hơn', ai: { w: 1 }, run: function (l, r, log, d) { log('Để ' + d.n + ' có tuổi thơ trọn vẹn với những buổi chiều thả diều.', 'good'); fx(l, { hap: 2 }); } }
    ]
  });
  T('con_hoc', function (l, a) { return l.kids.some(function (k) { return k.alive && a - k.born >= 6 && a - k.born <= 17; }) && l.indep && free(l); }, 0.05);

  SC('con_hu', {
    title: 'Con bỏ bê học hành', prep: function (l) { var k = l.kids.filter(function (k) { return k.alive && l.age - k.born >= 12 && l.age - k.born <= 19; })[0]; return { n: k ? k.name : 'con' }; },
    text: function (l, d) { return 'Cô giáo gọi điện: ' + d.n + ' trốn học đi chơi game, điểm sa sút, còn cãi lại thầy cô.'; },
    valid: function (l) { return l.kids.some(function (k) { return k.alive && l.age - k.born >= 12 && l.age - k.born <= 19; }); },
    opts: [
      { k: 'strict', l: 'Tịch thu điện thoại, cấm túc', ai: { w: 1 }, run: function (l, r, log, d) { if (ch(r, 0.4)) log(d.n + ' dần chăm học trở lại.', 'good'); else { log(d.n + ' càng chống đối, bỏ nhà đi mấy ngày.', 'bad'); fx(l, { hap: -8 }); } } },
      { k: 'talk', l: 'Ngồi xuống nói chuyện với con', ai: { soc: 1, w: 1.3 }, run: function (l, r, log, d) { if (ch(r, 0.65)) { log('Lần đầu lắng nghe con thật sự. ' + d.n + ' ôm bạn khóc.', 'good'); fx(l, { hap: 5 }); H.mem(l, 'Buổi tối ngồi nghe ' + d.n + ' tâm sự.', 4); } else log('Nói mãi con vẫn chưa nghe, nhưng ít ra hai bố con / mẹ con đã chịu nói chuyện.', 'neutral'); } },
      { k: 'ignore', l: 'Mặc kệ, lớn rồi tự biết', ai: { w: 0.5 }, run: function (l, r, log, d) { log('Mặc kệ con. Khoảng cách ngày một lớn.', 'bad'); fx(l, { soc: -4 }); } }
    ]
  });
  T('con_hu', function (l, a) { return l.kids.some(function (k) { return k.alive && a - k.born >= 12 && a - k.born <= 19; }) && free(l); }, 0.05);

  // v2.4: cột 4 = ai cần ('f' bố · 'm' mẹ · '' bố/mẹ còn sống); "bố mẹ" được đổi theo người còn sống
  var PNEED = [['Mái nhà của bố mẹ bị dột nặng sau mưa bão', 0.3, 'sửa nhà cho bố mẹ', ''], ['Bố bị thoát vị đĩa đệm, cần mổ gấp', 0.6, 'chữa bệnh cho bố', 'f'], ['Mẹ muốn có cái tivi mới để xem phim', 0.08, 'mua tivi cho mẹ', 'm'],
    ['Bố mẹ cần máy lọc nước, quạt điều hòa cho mùa hè', 0.05, 'đồ dùng cho bố mẹ', ''], ['Ngôi nhà cũ ở quê xuống cấp, cần xây lại', 1.5, 'xây lại nhà cho bố mẹ', ''], ['Mẹ cần mổ mắt đục thủy tinh thể', 0.15, 'mổ mắt cho mẹ', 'm'], ['Bố mẹ muốn đi du lịch một chuyến cho biết đây biết đó', 0.12, 'cho bố mẹ đi du lịch', '']];
  SC('bo_me_can', {
    title: function (l) { return U.cap(parentsWord(l) || 'bố mẹ') + ' cần đến bạn'; },
    prep: function (l, r) {
      var f = l.fam, pw0 = parentsWord(l) || 'bố mẹ';
      var n = pick(r, PNEED.filter(function (x) { return x[3] === 'f' ? f.fAlive : x[3] === 'm' ? f.mAlive : true; }));
      function fix(s) { return s.replace(/Bố mẹ/g, U.cap(pw0)).replace(/bố mẹ/g, pw0); }
      return { t: fix(n[0]), c: n[1], w: fix(n[2]) };
    },
    text: function (l, d) { return d.t + '. Chi phí khoảng ' + mb(l, d.c) + '. Hiện bạn có ' + H.money(l, l.money) + '.'; },
    valid: function (l) { return l.fam.mAlive || l.fam.fAlive; },
    opts: [
      { k: 'all', l: 'Lo toàn bộ', ai: { w: 1.4, cost: 0.3 }, run: function (l, r, log, d) { cashB(l, -d.c, 'Lo ' + d.w); log('Lo trọn chuyện ' + d.w + '. Bố mẹ khoe với cả xóm.', 'good'); fx(l, { hap: 5, karma: 6 }); H.mem(l, 'Ngày lo được chuyện ' + d.w + ', thấy mình thật sự trưởng thành.', 4); } },
      { k: 'share', l: 'Chia với anh chị em', req: function (l) { return l.fam.sibs > 0; }, ai: { w: 1.2 }, run: function (l, r, log, d) { cashB(l, -d.c / (l.fam.sibs + 1), 'Góp tiền ' + d.w); log('Anh chị em mỗi người góp một phần lo cho bố mẹ.', 'good'); fx(l, { hap: 3, karma: 3, soc: 2 }); } },
      { k: 'loan', l: 'Vay mượn để lo cho bố mẹ', ai: { w: 0.6 }, run: function (l, r, log, d) { H.addLoan(l, H.canBankLoan(l) && l.income > 0 ? 'bank' : 'fin', d.c * l.base); cashB(l, -d.c, 'Lo ' + d.w); log('Vay tiền lo chuyện ' + d.w + '.', 'neutral'); fx(l, { karma: 4 }); } },
      { k: 'cant', l: 'Lực bất tòng tâm', ai: { w: 0.4 }, run: function (l, r, log, d) { log('Không lo nổi chuyện ' + d.w + '. Đêm nằm trằn trọc mãi.', 'bad'); fx(l, { hap: -6 }); } }
    ]
  });
  T('bo_me_can', function (l, a) { return l.indep && a >= 22 && ((l.fam.mAlive && l.fam.mAge + a >= 52) || (l.fam.fAlive && l.fam.fAge + a >= 52)) && free(l); }, 0.07, 3);

  SC('ban_muon_tien', {
    title: 'Bạn thân hỏi vay tiền', prep: function (l, r) { return { why: pick(r, ['lo viện phí cho mẹ', 'mở quán ăn', 'trả nợ gấp', 'cưới vợ', 'đặt cọc mua nhà']), x: pick(r, [0.1, 0.2, 0.4]) }; },
    text: function (l, d) { return l.bff.name + ' ngập ngừng hỏi vay ' + mb(l, d.x) + ' để ' + d.why + '. "Tao hứa sẽ trả sớm."'; },
    valid: function (l) { return !!bff(l); },
    opts: [
      { k: 'lend', l: 'Cho vay', req: function (l, d) { return l.money >= d.x * l.base; }, ai: { soc: 1, w: 1.2 }, run: function (l, r, log, d) { cashB(l, -d.x, 'Cho ' + l.bff.name + ' vay'); l.bff.close += 6; if (ch(r, 0.65)) { l.bff.owe = d.x; H.sched(l, 'ban_tra_no', U.randint(r, 1, 3)); log('Cho ' + l.bff.name + ' vay tiền. Bạn bè lúc khó mới là bạn.', 'good'); } else { l.bff.owe = -d.x; log('Cho ' + l.bff.name + ' vay. Rồi những cuộc gọi thưa dần.', 'neutral'); } fx(l, { karma: 3 }); } },
      { k: 'part', l: 'Cho mượn một nửa', req: function (l, d) { return l.money >= d.x * l.base * 0.5; }, ai: { w: 1 }, run: function (l, r, log, d) { cashB(l, -d.x / 2, 'Cho bạn mượn tiền'); log('Chỉ đủ sức cho mượn một nửa. ' + l.bff.name + ' vẫn cảm ơn.', 'neutral'); } },
      { k: 'no', l: 'Từ chối', ai: { w: 0.7 }, run: function (l, r, log) { l.bff.close -= 12; log('Từ chối. Từ đó hai người ít liên lạc hẳn.', 'bad'); fx(l, { soc: -4 }); } }
    ]
  });
  T('ban_muon_tien', function (l, a) { return a >= 20 && a <= 65 && bff(l) && l.indep && free(l); }, 0.04);
  SC('ban_tra_no', {
    title: 'Món nợ ân tình', text: function (l) { return l.bff.name + ' đến tận nhà trả tiền, kèm một túi quà quê.'; },
    valid: function (l) { return !!bff(l) && l.bff.owe > 0; },
    opts: [{ k: 'ok', l: 'Nhận lại tiền', run: function (l, r, log) { cashB(l, l.bff.owe, l.bff.name + ' trả nợ'); l.bff.owe = 0; l.bff.close += 5; log(l.bff.name + ' trả đủ tiền như đã hứa.', 'good'); fx(l, { hap: 4 }); } }]
  });
  SC('ban_cuoi', {
    title: 'Đám cưới bạn thân', text: function (l) { return l.bff.name + ' sắp cưới, mời bạn làm ' + (l.bff.sex === 'M' ? 'phù rể' : 'phù dâu') + '.'; },
    valid: function (l) { return !!bff(l) && !l.bff.wed; },
    opts: [
      { k: 'go', l: 'Đến dự, mừng một phong bì dày', h: function (l) { return mb(l, 0.04); }, ai: { w: 2 }, run: function (l, r, log) { l.bff.wed = true; cashB(l, -0.04, 'Mừng cưới ' + l.bff.name); log('Đứng cạnh ' + l.bff.name + ' trong ngày cưới, hai đứa ôm nhau khóc như con nít.', 'good'); fx(l, { hap: 6, soc: 4 }); H.mem(l, 'Đám cưới ' + l.bff.name + ', bạn đọc bài phát biểu run cả giọng.', 4); } },
      { k: 'busy', l: 'Bận việc, chỉ gửi quà', ai: { w: 0.5 }, run: function (l, r, log) { l.bff.wed = true; l.bff.close -= 8; cashB(l, -0.02, 'Quà cưới'); log('Bận việc không về được đám cưới ' + l.bff.name + '. Áy náy mãi.', 'neutral'); } }
    ]
  });
  T('ban_cuoi', function (l, a) { return a >= 22 && a <= 36 && bff(l) && !l.bff.wed && free(l); }, 0.1);
  SC('ban_nam_vien', {
    title: 'Tin dữ', prep: function (l, r) { return { why: pick(r, l.age < 45 ? ['tai nạn giao thông', 'tai nạn lao động'] : ['tai biến', 'ung thư giai đoạn cuối', 'nhồi máu cơ tim']) }; },
    text: function (l, d) { return 'Nhận cuộc gọi lúc nửa đêm: ' + l.bff.name + ' bị ' + d.why + ', đang nằm viện cấp cứu.'; },
    valid: function (l) { return !!bff(l); },
    opts: [
      { k: 'visit', l: 'Bỏ hết mọi việc, lao vào viện', ai: { w: 2, soc: 1 }, run: function (l, r, log, d) { l.bff.close += 10; H.mem(l, 'Ngồi bên giường bệnh nắm tay ' + l.bff.name + ' suốt đêm.', 6); bffFate(l, r, log, d); } },
      { k: 'money', l: 'Gửi tiền giúp viện phí', h: function (l) { return mb(l, 0.1); }, ai: { w: 1 }, run: function (l, r, log, d) { cashB(l, -0.1, 'Giúp viện phí ' + l.bff.name); fx(l, { karma: 4 }); bffFate(l, r, log, d); } },
      { k: 'later', l: 'Hẹn mai vào thăm', ai: { w: 0.4 }, run: function (l, r, log, d) { bffFate(l, r, log, d, true); } }
    ]
  });
  function bffFate(l, r, log, d, late) {
    if (ch(r, d.why.indexOf('giai đoạn cuối') >= 0 ? 0.7 : 0.3)) {
      l.bff.alive = false; l.bff.died = l.age;
      log(l.bff.name + ' không qua khỏi.' + (late ? ' Bạn đã không kịp gặp mặt lần cuối.' : ''), 'bad');
      fx(l, { hap: late ? -22 : -16, soc: -6 });
      H.mem(l, late ? 'Nỗi day dứt vì không kịp gặp ' + l.bff.name + ' lần cuối.' : 'Ngày tiễn ' + l.bff.name + ' — người bạn thân nhất. Bạn đặt lên mộ ' + (l.bff.token || 'tấm ảnh chụp chung') + '.', 8);
    } else { log(l.bff.name + ' qua cơn nguy kịch. Hai người bạn lại cười với nhau như ngày xưa.', 'good'); fx(l, { hap: 5 }); }
  }
  T('ban_nam_vien', function (l, a) { return a >= 25 && bff(l) && free(l); }, function (l) { return 0.006 + l.age * 0.0003; });
  SC('ban_sa_nga', {
    title: 'Bạn thân sa ngã', text: function (l) { return l.bff.name + ' dính vào ma túy, nợ nần, nhờ bạn giấu giúp gia đình.'; },
    valid: function (l) { return !!bff(l); },
    opts: [
      { k: 'rehab', l: 'Thuyết phục bạn đi cai nghiện', ai: { w: 1.5 }, run: function (l, r, log) { if (ch(r, 0.5)) { log('Đưa ' + l.bff.name + ' vào trại cai. Một năm sau bạn ấy trở về khỏe mạnh.', 'good'); fx(l, { karma: 8, hap: 4 }); H.mem(l, 'Ngày đón ' + l.bff.name + ' ra khỏi trại cai nghiện.', 5); } else { log(l.bff.name + ' bỏ trốn khỏi trại cai, biệt tăm.', 'bad'); l.bff.close -= 20; fx(l, { hap: -6 }); } } },
      { k: 'distance', l: 'Giữ khoảng cách', ai: { w: 1 }, run: function (l, r, log) { log('Lặng lẽ giữ khoảng cách với ' + l.bff.name + '.', 'neutral'); l.bff.close -= 15; } },
      { k: 'join', l: 'Thử cùng một lần', ai: { bad: 1.6, risk: 1.4 }, run: function (l, r, log) { fx(l, { karma: -10, hea: -6 }); if (ch(r, 0.4)) { l.addict.drugs = true; log('Một lần thử thành nghiện ma túy.', 'bad'); H.mem(l, 'Lần đầu thử ma túy — cánh cửa địa ngục mở ra.', 6); } else log('Thử một lần rồi sợ hãi bỏ chạy.', 'bad'); } }
    ]
  });
  T('ban_sa_nga', function (l, a) { return a >= 16 && a <= 45 && bff(l) && free(l); }, 0.012);

  // =====================================================================
  // CÔNG VIỆC, DANH TIẾNG
  // =====================================================================
  SC('sep_ep', {
    title: 'Áp lực công sở', text: 'Sếp liên tục giao việc ngoài giờ, cuối tuần cũng gọi, không trả lương làm thêm.',
    valid: function (l) { return !!l.job; },
    opts: [
      { k: 'endure', l: 'Cắn răng chịu đựng', ai: { w: 1.2, amb: 0.5 }, run: function (l, r, log) { log('Cắn răng làm. Sếp ghi nhận, nhưng sức khỏe đi xuống.', 'neutral'); fx(l, { hea: -5, hap: -4 }); if (l.job && ch(r, 0.3)) { l.job.yrs += 1; } } },
      { k: 'quit', l: 'Nộp đơn nghỉ việc', ai: { risk: 1 }, run: function (l, r, log) { log('Nộp đơn nghỉ việc, ra về giữa tràng pháo tay của đồng nghiệp.', 'neutral'); l.job = null; l.flags.needJob = true; fx(l, { hap: 4 }); } },
      { k: 'report', l: 'Khiếu nại lên công đoàn / phòng nhân sự', ai: { smart: 1 }, run: function (l, r, log) { if (ch(r, 0.5)) { log('Khiếu nại thành công, công ty phải trả lương làm thêm.', 'good'); cashB(l, 0.05, 'Truy lĩnh lương làm thêm'); } else { log('Bị "đì" ra mặt sau khi khiếu nại.', 'bad'); fx(l, { hap: -6 }); } } }
    ]
  });
  T('sep_ep', function (l, a) { var c = E.jobDef(l); return c && /office|sale|med|media/.test(c.cat) && free(l); }, 0.05);

  SC('tang_luong', {
    title: 'Xin tăng lương', text: function (l) { return 'Bạn đã làm ' + E.jobTitle(l) + ' được ' + l.job.yrs + ' năm ở vị trí này.'; },
    valid: function (l) { return !!l.job && !E.jobDef(l).fame && E.jobDef(l).sec !== 'crime'; },
    opts: [
      { k: 'ask', l: 'Mạnh dạn đề xuất tăng lương', ai: { amb: 1 }, run: function (l, r, log) { var c = E.jobDef(l); var need = (c.yrs && c.yrs[l.job.rank]) || 3; var p = 0.15 + (l.st.kno - 50) / 200 + Math.min(4, l.job.yrs) * 0.04; if (!c.ladder && l.job.yrs >= need - 1 && ch(r, p) && l.job.rank < c.t.length - 1) { l.job.rank++; l.job.yrs = 0; log('Sếp đồng ý — được nâng lên ' + E.jobTitle(l) + '.', 'good'); fx(l, { hap: 6 }); } else if (ch(r, 0.5)) { cashB(l, 0.05, 'Thưởng thêm'); log('Không lên chức, nhưng được tăng chút lương.', 'neutral'); } else if (ch(r, 0.15)) { log('Sếp phật ý, ít lâu sau bạn bị cho nghỉ việc.', 'bad'); l.job = null; l.flags.needJob = true; } else { log('Bị từ chối khéo: "Cố gắng thêm nhé em."', 'bad'); fx(l, { hap: -3 }); } } },
      { k: 'no', l: 'Thôi, chờ thêm', ai: { w: 1 }, run: function () { } }
    ]
  });
  SC('nghi_viec', {
    title: 'Nghỉ việc?', text: function (l) { return 'Bạn đang làm ' + E.jobTitle(l) + '. Nghỉ việc nghĩa là mất thu nhập cho đến khi tìm được việc mới.'; },
    valid: function (l) { return !!l.job; },
    opts: [
      { k: 'yes', l: 'Nghỉ việc', run: function (l, r, log) { var crime = E.isCrime(l); log(crime ? 'Rửa tay gác kiếm, rời bỏ con đường phạm pháp.' : 'Nghỉ việc ' + E.jobTitle(l) + '.', crime ? 'good' : 'neutral'); if (crime) { fx(l, { karma: 10 }); H.mem(l, 'Ngày quyết định rời bỏ thế giới ngầm.', 6); } l.job = null; l.flags.needJob = true; } },
      { k: 'no', l: 'Thôi, làm tiếp', run: function () { } }
    ]
  });

  SC('phong_bi', {
    title: 'Chiếc phong bì', prep: function (l) { var c = E.jobDef(l).id; return { t: c === 'bac_si' || c === 'dieu_duong' ? 'Người nhà bệnh nhân dúi vào túi áo blouse một phong bì dày, nhờ "quan tâm" hơn.' : c === 'cong_an' ? 'Người vi phạm dúi phong bì, xin "bỏ qua" lần này.' : c === 'giao_vien' ? 'Phụ huynh biếu phong bì, nhờ "nâng điểm" cho con.' : 'Một doanh nghiệp gửi phong bì "cảm ơn", nhờ duyệt nhanh hồ sơ.' }; },
    text: function (l, d) { return d.t; },
    valid: function (l) { return !!l.job; },
    opts: [
      { k: 'no', l: 'Từ chối, trả lại', ai: { w: 1.5 }, run: function (l, r, log) { log('Lịch sự trả lại phong bì.', 'good'); fx(l, { karma: 4 }); } },
      { k: 'yes', l: 'Nhận', ai: { bad: 1.2 }, run: function (l, r, log) { cashB(l, 0.08, 'Phong bì'); fx(l, { karma: -6 }); if (ch(r, 0.1)) { log('Bị camera ghi lại cảnh nhận phong bì, bị kỷ luật cảnh cáo.', 'bad'); if (l.job.rank > 0) l.job.rank--; fx(l, { hap: -10 }); } else log('Nhận phong bì. Tối về cứ trằn trọc.', 'neutral'); } }
    ]
  });
  T('phong_bi', function (l, a) { return hasJob(l, ['bac_si', 'dieu_duong', 'cong_an', 'giao_vien', 'cong_chuc']) && free(l); }, 0.06);
  SC('tham_nhung', {
    title: 'Món lợi lớn', text: 'Một chủ doanh nghiệp đề nghị "chia phần" rất lớn nếu bạn ký duyệt một dự án sai quy định.',
    valid: function (l) { return hasJob(l, ['cong_chuc', 'cong_an', 'quan_doi', 'ngan_hang']); },
    opts: [
      { k: 'no', l: 'Kiên quyết từ chối', ai: { w: 1.5 }, run: function (l, r, log) { log('Kiên quyết từ chối, báo cáo cấp trên.', 'good'); fx(l, { karma: 8 }); } },
      { k: 'yes', l: 'Ký duyệt, nhận phần', ai: { bad: 1.6, risk: 1 }, run: function (l, r, log) { cashB(l, 4, 'Tiền "chia phần"'); fx(l, { karma: -20 }); log('Ký duyệt. Căn biệt thự mới mua đứng tên người nhà.', 'bad'); if (ch(r, 0.3)) H.sched(l, 'bi_bat', U.randint(r, 1, 4), { why: 'nhận hối lộ', sev: 2 }); } }
    ]
  });
  T('tham_nhung', function (l, a) { return l.job && l.job.rank >= 3 && hasJob(l, ['cong_chuc', 'cong_an', 'quan_doi', 'ngan_hang']) && free(l); }, 0.04);

  SC('scandal', {
    title: 'Bão dư luận', prep: function (l, r) { return { t: pick(r, ['Bạn lỡ phát ngôn kém hiểu biết về lịch sử trên livestream', 'Bị khui chuyện quỵt tiền từ thiện', 'Bị tung clip đời tư', 'Phát ngôn coi thường người hâm mộ bị cắt ghép lan truyền']) }; },
    text: function (l, d) { return d.t + '. Cộng đồng mạng dậy sóng, nhãn hàng bắt đầu rút hợp đồng.'; },
    valid: function (l) { return (l.fame || 0) >= 5e4; },
    opts: [
      { k: 'sorry', l: 'Xin lỗi chân thành', ai: { w: 1.4, smart: 1 }, run: function (l, r, log) { if (ch(r, 0.6)) { fx(l, { fame: 0.75, hap: -6 }); log('Đăng tâm thư xin lỗi chân thành. Phần lớn khán giả bỏ qua.', 'neutral'); } else { fx(l, { fame: 0.45, hap: -10 }); log('Xin lỗi nhưng không ai tin. Danh tiếng lao dốc.', 'bad'); } } },
      { k: 'deny', l: 'Cãi lại, đổ lỗi cho anti-fan', ai: { risk: 1.3, bad: 0.6 }, run: function (l, r, log) { if (ch(r, 0.3)) { fx(l, { fame: 0.1, hap: -20, karma: -6 }); log('Phản ứng gay gắt khiến cả cộng đồng tẩy chay. Sự nghiệp coi như chấm hết.', 'bad'); H.mem(l, 'Cơn bão tẩy chay khiến sự nghiệp sụp đổ.', 7); if (ch(r, 0.5)) { l.job = null; l.flags.needJob = true; } } else { fx(l, { fame: 0.3, hap: -12 }); log('Bị tẩy chay dữ dội, mất hàng loạt hợp đồng quảng cáo.', 'bad'); } } },
      { k: 'silent', l: 'Im lặng chờ bão qua', ai: { w: 1 }, run: function (l, r, log) { fx(l, { fame: 0.55, hap: -8 }); log('Im lặng biến mất một thời gian, chờ dư luận nguôi ngoai.', 'neutral'); } }
    ]
  });
  T('scandal', function (l, a) { return (l.fame || 0) >= 5e4 && l.job && E.jobDef(l).fame && free(l); }, function (l) { return 0.04 + Math.max(0, (l.tr.risk - 50) / 1000) + (l.karma < 0 ? 0.03 : 0); });

  SC('phim', {
    title: 'Lời mời đóng phim', prep: function (l, r) { return { t: pick(r, ['phim điện ảnh chiếu Tết', 'phim truyền hình giờ vàng', 'phim nghệ thuật dự liên hoan quốc tế']) }; },
    text: function (l, d) { return 'Đạo diễn mời bạn ' + (hasJob(l, ['ca_si', 'rapper', 'dv_hai', 'nguoi_mau']) ? 'lấn sân diễn xuất trong ' : 'đóng vai chính trong ') + d.t + '.'; },
    valid: function (l) { return hasJob(l, ['dien_vien', 'ca_si', 'rapper', 'dv_hai', 'nguoi_mau']); },
    opts: [
      { k: 'yes', l: 'Nhận vai, dồn hết tâm huyết', ai: { amb: 1, w: 1.5 }, run: function (l, r, log, d) { var x = r() + (l.skill - 50) / 200; if (x > 0.7) { cashB(l, 1.5, 'Cát-xê & thưởng doanh thu phim'); fx(l, { fame: 3, hap: 10 }); log('Phim thắng lớn, doanh thu hàng trăm tỷ! Tên bạn phủ khắp mạng xã hội.', 'big'); H.mem(l, 'Buổi công chiếu ' + d.t + ' — khán giả đứng dậy vỗ tay.', 6); } else if (x > 0.35) { cashB(l, 0.4, 'Cát-xê phim'); fx(l, { fame: 1.3, hap: 3 }); log('Phim có doanh thu khá, vai diễn được khen.', 'good'); } else { cashB(l, 0.2, 'Cát-xê phim'); fx(l, { fame: 0.7, hap: -8 }); log('Phim "flop" thảm hại, bị chê không thương tiếc.', 'bad'); } } },
      { k: 'no', l: 'Từ chối, kịch bản không hợp', ai: { w: 0.6 }, run: function (l, r, log) { log('Từ chối vai diễn.', 'neutral'); } }
    ]
  });
  T('phim', function (l, a) { return hasJob(l, ['dien_vien', 'ca_si', 'rapper', 'dv_hai', 'nguoi_mau']) && free(l); }, 0.2);
  SC('album', {
    title: 'Dự án âm nhạc mới', text: 'Bạn ấp ủ ra một album và tổ chức đêm nhạc riêng, cần đầu tư khá nhiều tiền.',
    valid: function (l) { return hasJob(l, ['ca_si', 'rapper']); },
    opts: [
      { k: 'go', l: 'Dốc vốn làm album & show riêng', h: function (l) { return mb(l, 0.8); }, ai: { amb: 1, risk: 0.6 }, run: function (l, r, log) { cashB(l, -0.8, 'Đầu tư album'); var x = r() + (l.skill - 50) / 200 + Math.log10(Math.max(10, l.fame)) / 20; if (x > 0.85) { cashB(l, 3, 'Doanh thu album & show'); fx(l, { fame: 2.5, hap: 12 }); log('Album gây bão, đêm nhạc cháy vé!', 'big'); H.mem(l, 'Đêm nhạc riêng đầu tiên, cả khán phòng hát theo bài hát của bạn.', 7); } else if (x > 0.5) { cashB(l, 1, 'Doanh thu album'); fx(l, { fame: 1.3, hap: 4 }); log('Album được đón nhận ổn.', 'good'); } else { fx(l, { fame: 0.85, hap: -8 }); log('Album chìm nghỉm giữa thị trường.', 'bad'); } } },
      { k: 'single', l: 'Ra single nhỏ cho chắc', ai: { w: 1.2 }, run: function (l, r, log) { cashB(l, -0.1, 'Làm single'); fx(l, { fame: 1.1 }); log('Ra một single mới, khán giả thích.', 'good'); } }
    ]
  });
  T('album', function (l, a) { return hasJob(l, ['ca_si', 'rapper']) && free(l); }, 0.2);

  SC('ban_do', {
    title: 'Lời gạ bán độ', text: 'Một kẻ lạ mặt đề nghị khoản tiền lớn nếu bạn "chơi kém" trong trận đấu quan trọng sắp tới.',
    valid: function (l) { return hasJob(l, ['vdv', 'tuyen_thu_es']); },
    opts: [
      { k: 'no', l: 'Từ chối, báo ban tổ chức', ai: { w: 1.6 }, run: function (l, r, log) { log('Từ chối và báo cáo vụ việc. Được liên đoàn khen ngợi.', 'good'); fx(l, { karma: 8, fame: 1.2 }); } },
      { k: 'yes', l: 'Nhận tiền, bán độ', ai: { bad: 1.6, risk: 1 }, run: function (l, r, log) { cashB(l, 2, 'Tiền bán độ'); fx(l, { karma: -20 }); if (ch(r, 0.4)) { log('Vụ bán độ bị phanh phui. Bị cấm thi đấu vĩnh viễn và khởi tố.', 'bad'); H.mem(l, 'Ngày bị cấm thi đấu vĩnh viễn vì bán độ.', 7); l.job = null; l.flags.needJob = true; l.flags.track = null; H.sched(l, 'bi_bat', 0, { why: 'tổ chức đánh bạc (bán độ)', sev: 1 }); } else log('Bán độ trót lọt. Nhưng mỗi lần ra sân, bạn không dám nhìn vào mắt đồng đội.', 'bad'); } }
    ]
  });
  T('ban_do', function (l, a) { return hasJob(l, ['vdv', 'tuyen_thu_es']) && l.job.rank >= 1 && free(l); }, 0.04);
  SC('chan_thuong', {
    title: 'Chấn thương', text: 'Bạn dính chấn thương ngay trước giải đấu lớn nhất năm.',
    valid: function (l) { return hasJob(l, ['vdv', 'tuyen_thu_es']); },
    opts: [
      { k: 'rest', l: 'Nghỉ ngơi điều trị dứt điểm', ai: { w: 1.4, smart: 1 }, run: function (l, r, log) { l.skill = Math.max(0, l.skill - 3); log('Lỡ giải đấu, tập trung điều trị.', 'neutral'); fx(l, { hap: -4 }); } },
      { k: 'play', l: 'Tiêm giảm đau, ra sân', ai: { risk: 1.3, amb: 1 }, run: function (l, r, log) { if (ch(r, 0.45)) { l.skill = Math.max(0, l.skill - 18); log('Chấn thương nặng thêm, phải nghỉ dài hạn.', 'bad'); fx(l, { hea: -12, hap: -10 }); } else { log('Thi đấu kiên cường trong đau đớn — khán giả đứng dậy vỗ tay.', 'good'); fx(l, { fame: 1.3, hap: 6 }); H.mem(l, 'Trận đấu với vết thương rỉ máu, cả khán đài hô vang tên bạn.', 5); } } },
      { k: 'dope', l: 'Dùng chất cấm để hồi phục nhanh', req: function (l) { return hasJob(l, ['vdv']); }, ai: { bad: 1.4 }, run: function (l, r, log) { fx(l, { karma: -10 }); if (ch(r, 0.35)) { log('Dương tính với doping. Bị tước huy chương và cấm thi đấu 4 năm.', 'bad'); l.medals = l.medals.slice(0, Math.max(0, l.medals.length - 1)); l.job = null; l.flags.needJob = true; fx(l, { hap: -15 }); } else log('Hồi phục nhanh đáng ngờ. Không ai phát hiện.', 'neutral'); } }
    ]
  });
  T('chan_thuong', function (l, a) { return hasJob(l, ['vdv', 'tuyen_thu_es']) && free(l); }, 0.06);
  SC('creator_nghi', {
    title: 'Kênh mãi không lên', text: function (l) { return 'Đã ' + l.job.yrs + ' năm làm nội dung, kênh vẫn chỉ ' + E.fmtFollowers(l.fame) + ' người theo dõi. Tiền nhà tháng này còn chưa đủ.'; },
    valid: function (l) { return l.job && E.jobDef(l).fame; },
    opts: [
      { k: 'keep', l: 'Kiên trì theo đuổi', ai: { amb: 1.2, risk: 0.6 }, run: function (l, r, log) { l.skill += 5; log('Quyết tâm đi tiếp. Ăn mì gói, quay video đến 3 giờ sáng.', 'neutral'); fx(l, { hap: -3 }); } },
      { k: 'quit', l: 'Gác lại, đi làm công việc ổn định', ai: { w: 1.3 }, run: function (l, r, log) { log('Gác lại giấc mơ nổi tiếng, đi tìm việc ổn định.', 'neutral'); l.job = null; l.flags.needJob = true; H.mem(l, 'Ngày tắt camera, gác lại giấc mơ làm người nổi tiếng.', 4); } }
    ]
  });

  // =====================================================================
  // PHẠM PHÁP, TÙ TỘI, LƯƠNG THIỆN
  // =====================================================================
  var CRIMES = [['doi_no', 'đi đòi nợ thuê'], ['trom', 'đi trộm xe, trộm đồ'], ['ma_tuy', 'bán "hàng trắng"'], ['buon_lau', 'buôn lậu qua biên giới'], ['lua_dao', 'lừa đảo qua mạng'], ['nha_cai', 'ghi lô đề, làm nhà cái'], ['cho_vay', 'cho vay nặng lãi']];
  SC('ru_re', {
    title: 'Lời rủ rê kiếm tiền nhanh', prep: function (l, r) { var c = pick(r, CRIMES.filter(function (x) { return x[0] !== 'cho_vay' || l.money > l.base; })); return { id: c[0], t: c[1] }; },
    text: function (l, d) { return 'Một người quen cũ rủ bạn ' + d.t + ': "Một tháng bằng người ta làm cả năm."'; },
    opts: [
      { k: 'join', l: 'Nhận lời', h: 'Phạm pháp', ai: { bad: 1.6, risk: 1 }, run: function (l, r, log, d) { if (l.job) l.lastJob = l.job; E.startJob(l, d.id, r, log); } },
      { k: 'no', l: 'Từ chối', ai: { w: 1.6 }, run: function (l, r, log) { log('Từ chối thẳng. Nghèo cũng không làm chuyện thất đức.', 'good'); fx(l, { karma: 3 }); } },
      { k: 'report', l: 'Báo công an', ai: { w: 0.4 }, run: function (l, r, log) { log('Báo công an. Cả đường dây bị triệt phá.', 'good'); fx(l, { karma: 8 }); if (ch(r, 0.15)) { log('Bị đàn em của chúng chặn đường đánh trả thù.', 'bad'); fx(l, { hea: -10 }); } } }
    ]
  });
  T('ru_re', function (l, a) { return a >= 16 && a <= 45 && !E.isCrime(l) && (!l.job || l.money < 0 || l.fam.vice === 'gang') && free(l); }, function (l) { return 0.03 + (l.fam.vice === 'gang' ? 0.05 : 0) + (l.record ? 0.06 : 0); });

  SC('kiem_tien_ban', {
    title: 'Kiếm tiền bất chính', text: 'Bạn tính đến những con đường kiếm tiền ngoài vòng pháp luật. Một khi đã bước vào, rất khó quay đầu.',
    opts: CRIMES.map(function (c) { return { k: c[0], l: U.cap(c[1]), h: 'Phạm pháp · nguy cơ tù tội', req: function (l) { return !hasJob(l, [c[0]]) && (c[0] !== 'cho_vay' || l.money > l.base); }, ai: { bad: 1 }, run: function (l, r, log) { if (l.job) l.lastJob = l.job; E.startJob(l, c[0], r, log); } }; })
      .concat([{ k: 'no', l: 'Thôi, sống lương thiện', ai: { w: 2 }, run: function (l, r, log) { log('Gạt bỏ ý nghĩ làm ăn phi pháp.', 'good'); fx(l, { karma: 2 }); } }])
  });

  SC('bi_bat', {
    title: 'Bị bắt', tone: 'dark', prep: function (l, r, arg) { return arg || { why: 'vi phạm pháp luật', sev: 1 }; },
    valid: function (l) { return !(l.jailUntil != null && l.age < l.jailUntil); },
    text: function (l, d) { return 'Cảnh sát ập đến. Bạn bị bắt vì ' + d.why + '.' + (l.partner ? ' ' + l.partner.name + ' ngồi sụp xuống bậc cửa.' : ''); },
    opts: [
      { k: 'confess', l: 'Thành khẩn khai báo', ai: { w: 1.4 }, run: function (l, r, log, d) { H.jail(l, Math.max(1, Math.round(d.sev * (1 + r()))), d.why, log); fx(l, { karma: 4 }); } },
      { k: 'lawyer', l: 'Thuê luật sư giỏi', h: function (l) { return mb(l, 1); }, ai: { cost: 1, smart: 1 }, run: function (l, r, log, d) { cashB(l, -1, 'Thuê luật sư'); if (ch(r, 0.3)) { log('Luật sư cãi xuất sắc — bạn được hưởng án treo.', 'good'); l.record++; fx(l, { hap: 5 }); if (l.job && E.isCrime(l)) { l.job = null; l.flags.needJob = true; } } else H.jail(l, Math.max(1, Math.round(d.sev * (1.2 + r()))), d.why, log); } },
      { k: 'deny', l: 'Chối tội đến cùng', ai: { risk: 1.2, bad: 0.5 }, run: function (l, r, log, d) { if (ch(r, 0.15)) { log('Không đủ chứng cứ, bạn được thả.', 'neutral'); fx(l, { karma: -3 }); } else H.jail(l, Math.max(2, Math.round(d.sev * (2 + r() * 2))), d.why, log); } },
      { k: 'bribe', l: 'Tìm đường "chạy án"', h: function (l) { return mb(l, 2); }, ai: { bad: 1.5, cost: 2 }, run: function (l, r, log, d) { cashB(l, -2, 'Tiền chạy án'); fx(l, { karma: -8 }); if (ch(r, 0.3)) { log('Chạy án thành công. Hồ sơ "chìm xuồng".', 'neutral'); } else { log('Bị lừa tiền chạy án, lại thêm tội đưa hối lộ.', 'bad'); H.jail(l, Math.max(2, Math.round(d.sev * 2.5)), d.why + ' và đưa hối lộ', log); } } }
    ]
  });
  SC('trai_giam', {
    title: 'Sau song sắt', valid: function (l) { return l.jailUntil != null && l.age < l.jailUntil; },
    text: function (l) { return 'Còn ' + (l.jailUntil - l.age) + ' năm nữa mới mãn hạn. Ngày thăm nuôi, ' + (l.fam.mAlive ? 'mẹ' : 'người nhà') + ' lại lặn lội đến.'; },
    opts: [
      { k: 'reform', l: 'Cải tạo tốt, chờ ngày giảm án', ai: { w: 1.5 }, run: function (l, r, log) { fx(l, { karma: 6, hap: 2 }); if (ch(r, 0.4) && l.jailUntil - l.age > 1) { l.jailUntil--; log('Được giảm án một năm nhờ cải tạo tốt.', 'good'); } else log('Cặm cụi lao động cải tạo, viết thư về nhà mỗi tháng.', 'neutral'); H.mem(l, 'Những lá thư viết từ trại giam gửi về cho ' + (l.fam.mAlive ? 'mẹ' : 'gia đình') + '.', 4); } },
      { k: 'learn', l: 'Học nghề trong trại', ai: { smart: 1 }, run: function (l, r, log) { l.edu = Math.max(l.edu, 4); log('Học nghề mộc, nghề may trong trại — sau này ra có cái nghề.', 'good'); fx(l, { kno: 3 }); } },
      { k: 'fight', l: 'Gây gổ để không bị bắt nạt', ai: { risk: 1.2 }, run: function (l, r, log) { fx(l, { hea: -6, karma: -3 }); if (ch(r, 0.3)) { l.jailUntil++; log('Đánh nhau trong trại, bị tăng thêm án.', 'bad'); } else log('Đánh nhau một trận, từ đó không ai dám động vào.', 'neutral'); } }
    ]
  });
  SC('ra_tu', {
    title: 'Làm lại cuộc đời?', text: 'Ra tù với tiền án trong hồ sơ. Nhiều nơi lắc đầu khi thấy lý lịch của bạn. Đám bạn cũ đã đứng chờ ở đầu ngõ.',
    opts: [
      { k: 'honest', l: 'Làm lại cuộc đời, sống lương thiện', ai: { w: 1.4 }, run: function (l, r, log) { log('Quyết tâm làm lại cuộc đời.', 'good'); fx(l, { karma: 8, hap: 4 }); H.mem(l, 'Ngày quyết định làm lại cuộc đời sau khi ra tù.', 5); l.flags.needJob = true; } },
      { k: 'old', l: 'Quay lại con đường cũ', ai: { bad: 1.4 }, run: function (l, r, log) { var id = l.lastJob && E.CAR[E.resolveJob(l.lastJob.id)] && E.CAR[E.resolveJob(l.lastJob.id)].sec === 'crime' ? E.resolveJob(l.lastJob.id) : 'trom'; E.startJob(l, id, r, log); } }
    ]
  });

  SC('nhat_vi', {
    title: 'Chiếc ví đánh rơi', prep: function (l) { return { x: 0.06 }; },
    text: function (l, d) { return 'Bạn nhặt được một chiếc ví dày cộp trên đường: ' + mb(l, d.x) + ' tiền mặt cùng giấy tờ tùy thân.'; },
    opts: [
      { k: 'return', l: 'Tìm cách trả lại', ai: { w: 1.4 }, run: function (l, r, log) { fx(l, { karma: 8, hap: 4 }); if (ch(r, 0.35)) { cashB(l, 0.02, 'Quà cảm ơn'); log('Trả lại ví. Chủ ví rối rít cảm ơn, mời bạn bữa cơm.', 'good'); } else log('Mang ví lên đồn công an trả lại chủ.', 'good'); H.mem(l, 'Ánh mắt mừng rỡ của người nhận lại chiếc ví đánh rơi.', 3); } },
      { k: 'keep', l: 'Giữ lấy tiền', ai: { bad: 1.2 }, run: function (l, r, log, d) { cashB(l, d.x, 'Tiền nhặt được'); fx(l, { karma: -8 }); log('Rút tiền rồi vứt chiếc ví vào thùng rác.', 'bad'); } }
    ]
  });
  T('nhat_vi', function (l, a) { return a >= 12 && free(l); }, 0.02, 8);

  SC('cuu_nguoi', {
    title: 'Khoảnh khắc sinh tử', prep: function (l, r) { return { t: pick(r, ['Một đứa trẻ đuối nước giữa dòng sông', 'Một ngôi nhà bốc cháy, có tiếng người kêu cứu bên trong', 'Một người bị tai nạn nằm bất động giữa đường']) }; },
    text: function (l, d) { return d.t + '. Xung quanh mọi người chỉ đứng nhìn, giơ điện thoại quay phim.'; },
    opts: [
      { k: 'save', l: 'Lao vào cứu', ai: { risk: 0.8, w: 1.2 }, run: function (l, r, log, d) { var x = r(); if (x < 0.02) { H.kill(l, /đuối/.test(d.t) ? 'đuối nước khi cứu người' : 'hy sinh khi cứu người', log, true); l.flags.hero = true; return; } if (x < 0.12) { log('Cứu được người nhưng bạn bị thương nặng.', 'neutral'); fx(l, { hea: -15, karma: 15 }); } else { log('Cứu được một mạng người! Báo chí đưa tin, bạn được tặng bằng khen.', 'big'); fx(l, { karma: 18, hap: 10, soc: 5 }); } l.flags.hero = true; H.mem(l, 'Ngày bạn lao vào cứu người — ' + d.t.toLowerCase() + '.', 8); } },
      { k: 'call', l: 'Gọi cấp cứu, hô hoán mọi người', ai: { w: 1.4 }, run: function (l, r, log) { log('Gọi cấp cứu và hô hoán. Người bị nạn được cứu kịp.', 'good'); fx(l, { karma: 5 }); } },
      { k: 'leave', l: 'Lặng lẽ bỏ đi', ai: { bad: 1 }, run: function (l, r, log) { log('Lặng lẽ bỏ đi. Hôm sau đọc báo, người ấy đã không qua khỏi.', 'bad'); fx(l, { karma: -8, hap: -6 }); H.mem(l, 'Lần bạn quay lưng bỏ đi trước một người cần giúp.', 5); } }
    ]
  });
  T('cuu_nguoi', function (l, a) { return a >= 15 && a <= 70 && free(l); }, 0.012);

  SC('tu_thien', {
    title: 'Làm việc thiện', text: 'Bạn muốn làm điều gì đó tốt đẹp cho đời.',
    opts: [
      { k: 'donate', l: 'Quyên góp cho vùng lũ / trẻ em nghèo', h: function (l) { return mb(l, 0.1); }, req: function (l) { return l.money > 0.1 * l.base; }, ai: { w: 1, cost: 0.2 }, run: function (l, r, log) { cashB(l, -0.1, 'Quyên góp từ thiện'); log('Quyên góp cho trẻ em vùng cao có áo ấm qua mùa đông.', 'good'); fx(l, { karma: 8, hap: 5 }); H.mem(l, 'Bức ảnh lũ trẻ vùng cao mặc áo ấm bạn gửi tặng.', 4); } },
      { k: 'volunteer', l: 'Đi tình nguyện', ai: { soc: 1 }, run: function (l, r, log) { log('Dành kỳ nghỉ đi tình nguyện xây trường ở vùng sâu.', 'good'); fx(l, { karma: 7, hap: 5, soc: 4, hea: -1 }); H.mem(l, 'Mùa hè tình nguyện, nắng cháy da mà lòng vui lạ.', 4); } },
      { k: 'blood', l: 'Hiến máu nhân đạo', req: function (l) { return l.age >= 18 && l.age <= 60 && l.st.hea >= 50; }, ai: { w: 1 }, run: function (l, r, log) { log('Hiến máu cứu người. Nhận một hộp sữa và một tấm giấy chứng nhận.', 'good'); fx(l, { karma: 5, hap: 3 }); } }
    ]
  });

  // =====================================================================
  // SỨC KHỎE, TÂM LÝ, THIÊN TAI, CHIẾN TRANH, NGHÈO ĐÓI
  // =====================================================================
  SC('kham', {
    title: 'Khám sức khỏe tổng quát', text: function (l) { return 'Bệnh viện đang có gói khám tổng quát khoảng ' + mb(l, 0.03) + '.'; },
    opts: [{ k: 'go', l: 'Đi khám', ai: { w: 1 }, run: function (l, r, log) { cashB(l, -0.03, 'Khám sức khỏe'); l.flags.checkupUntil = l.age + 2; if (l.ill && !l.ill.treated) { log('Đi khám phát hiện sớm ' + l.ill.n + ', điều trị kịp thời.', 'good'); l.ill.mult = 1 + (l.ill.m - 1) * 0.3; l.ill.cure = Math.min(0.95, l.ill.base * 2); } else log('Khám tổng quát: các chỉ số ổn. Bác sĩ dặn ăn uống điều độ.', 'good'); fx(l, { hea: 3 }); } },
      { k: 'no', l: 'Thôi, khỏe mà', run: function () { } }]
  });
  SC('tram_cam', {
    title: 'Những ngày u tối', tone: 'dark', text: 'Những đêm mất ngủ triền miên. Mọi thứ trở nên vô nghĩa, bạn không muốn gặp ai.',
    opts: [
      { k: 'doctor', l: 'Tìm đến bác sĩ tâm lý', h: function (l) { return mb(l, 0.05); }, ai: { smart: 1.2 }, run: function (l, r, log) { cashB(l, -0.05, 'Điều trị tâm lý'); log('Tìm đến bác sĩ tâm lý. Từng chút một, bạn tìm lại được ánh sáng.', 'good'); fx(l, { hap: 14 }); H.mem(l, 'Ngày bạn đủ can đảm tìm sự giúp đỡ cho chính mình.', 5); } },
      { k: 'talk', l: function (l) { return 'Tâm sự với ' + (bff(l) ? l.bff.name : l.partner ? l.partner.name : 'người thân'); }, ai: { soc: 1.2 }, run: function (l, r, log) { if (ch(r, 0.4 + l.st.soc / 200)) { log('Có người lắng nghe — gánh nặng vơi đi một nửa.', 'good'); fx(l, { hap: 10, soc: 3 }); } else { log('Nói ra mà người ta không hiểu. Bạn lại thu mình.', 'bad'); fx(l, { hap: -3 }); } } },
      { k: 'alone', l: 'Tự chịu đựng một mình', ai: { w: 0.8 }, run: function (l, r, log) { log('Gồng mình chịu đựng một mình. Cơ thể cũng mệt mỏi theo.', 'bad'); fx(l, { hap: -5, hea: -5 }); } }
    ]
  });
  T('tram_cam', function (l, a) { return a >= 14 && l.st.hap < 28 && free(l); }, 0.3);

  var STORM = { MNPB: [0.09, 'lũ quét và sạt lở đất'], DBSH: [0.1, 'bão lớn'], BTB: [0.18, 'bão kèm lũ lớn'], NTB: [0.14, 'bão và lũ dâng'], TN: [0.04, 'mưa lũ'], DNB: [0.02, 'triều cường, ngập lụt'], DBSCL: [0.05, 'lũ và triều cường'] };
  SC('bao_lu', {
    title: 'Bão về', prep: function (l, r) { var s = STORM[l.region] || [0.05, 'bão']; return { t: s[1], n: U.randint(r, 3, 12) }; },
    text: function (l, d) { return 'Mùa mưa bão. Cơn bão số ' + d.n + ' đổ bộ, gió giật cấp 12, kèm ' + d.t + '. Loa phường liên tục kêu gọi sơ tán.'; },
    opts: [
      { k: 'fix', l: 'Chằng chống nhà cửa, tích trữ đồ ăn', h: function (l) { return mb(l, 0.02); }, ai: { w: 1.3, smart: 0.6 }, run: function (l, r, log, d) { cashB(l, -0.02, 'Chằng chống nhà cửa'); if (ch(r, 0.7)) log('Nhà cửa chằng chống kỹ, chỉ hư hại nhẹ sau bão.', 'neutral'); else { cashB(l, -0.1, 'Sửa nhà sau bão'); log('Bão quá mạnh, tốc mái dù đã chằng chống.', 'bad'); fx(l, { hap: -4 }); } } },
      { k: 'evac', l: 'Sơ tán đến nơi an toàn', ai: { w: 1.2 }, run: function (l, r, log, d) { if (ch(r, 0.5)) { cashB(l, -0.15, 'Thiệt hại sau bão'); log('Sơ tán an toàn. Trở về, nhà chỉ còn trơ khung, lúa ngoài đồng mất trắng.', 'bad'); fx(l, { hap: -8 }); H.mem(l, 'Trở về sau bão, nhìn ngôi nhà chỉ còn trơ khung.', 4); } else log('Sơ tán một đêm, bão đi qua, nhà còn nguyên.', 'neutral'); } },
      { k: 'stay', l: 'Ở lại giữ nhà, giữ tài sản', ai: { risk: 1.3 }, run: function (l, r, log, d) { var x = r(); if (x < 0.008) { H.kill(l, /lũ|sạt/.test(d.t) ? 'lũ cuốn trôi trong mùa bão' : 'sập nhà trong bão', log, true); return; } if (x < 0.06) { log('Mái nhà sập, bạn bị thương khi cố giữ đồ đạc.', 'bad'); fx(l, { hea: -15 }); } else log('Thức trắng đêm canh nhà giữa bão. Mệt rã rời nhưng giữ được tài sản.', 'neutral'); } }
    ]
  });
  T('bao_lu', function (l, a) { return isVN(l) && !l.movedTo && !l.abroad && a >= 12 && free(l); }, function (l) { return (STORM[l.region] || [0.05])[0] * (l.urban ? 0.6 : 1); }, 3);
  // thiên tai kể chuyện (giữ từ bản 1.0)
  EV(function (l, a) { return isVN(l) && (l.region === 'BTB' || l.region === 'NTB') && a < 12; }, 0.07, function (l, a, r, log) { log(pick(r, ['Mùa lũ năm nay nước ngập vào tận nhà.', 'Bão lớn đổ bộ, tốc mái nhà.', 'Lũ quét qua làng, cả xóm phải đi sơ tán.']), 'bad'); fx(l, { hap: -4 }); });
  EV(function (l, a) { return isVN(l) && (l.region === 'DBSH' || l.region === 'MNPB') && a < 12; }, 0.03, function (l, a, r, log) { log(l.region === 'MNPB' ? 'Mưa lớn kéo dài gây sạt lở đất gần nhà.' : 'Một cơn bão mạnh quét qua quê nhà.', 'bad'); fx(l, { hap: -3 }); });
  EV(function (l, a) { return isVN(l) && l.region === 'DBSCL' && hasJob(l, ['nong']); }, 0.06, function (l, a, r, log) { log('Hạn mặn làm mất trắng một vụ lúa.', 'bad'); cashB(l, -0.25, 'Mất mùa do hạn mặn'); fx(l, { hap: -5 }); });
  EV(function (l, a) { return !isVN(l) && a >= 3 && !CONFLICT[l.country]; }, function (l) { return l.gdp < 10 ? 0.02 : 0.008; }, function (l, a, r, log) { log(pick(r, ['Thiên tai gây thiệt hại nặng cho khu vực bạn sống.', 'Một trận lũ lớn tàn phá vùng bạn ở.', 'Hạn hán kéo dài, giá lương thực tăng vọt.']), 'bad'); fx(l, { hap: -4 }); if (l.indep) cashB(l, -0.1, 'Thiệt hại thiên tai'); });
  EV(function (l, a) { return a >= 3 && a <= 30 && (isVN(l) || /th|kh|la|mm|id|ph|my|in|bd|br|es_la/.test(l.pool)); }, 0.008, function (l, a, r, log) { log('Bị sốt xuất huyết, may mắn qua khỏi.', 'bad'); fx(l, { hea: -7 }); });
  EV(function (l, a) { return a >= 16 && a <= 70 && vehicle(l); }, function (l) { return (isVN(l) ? 0.014 : 0.009) * (l.flags.weakDriver ? 1.5 : 1); }, function (l, a, r, log) { log(pick(r, ['Bị tai nạn giao thông, phải khâu nhiều mũi.', 'Bị ngã xe máy, gãy chân, nghỉ ngơi hai tháng.', 'Va chạm giao thông, may chỉ bị thương nhẹ.']), 'bad'); fx(l, { hea: -8 }); });
  EV(function (l, a) { return a >= 20 && a <= 60 && isVN(l) && vehicle(l); }, 0.012, function (l, a, r, log) { log('Bị mất trộm xe máy.', 'bad'); cashB(l, -0.2, 'Mất trộm xe'); fx(l, { hap: -3 }); });
  EV(function (l, a) { return a >= 18 && a <= 40 && isVN(l) && l.indep; }, 0.02, function (l, a, r, log) { var x = U.clamp(0.1 + r() * 0.4, 0.1, 0.5); cashB(l, -x, 'Bị lừa đảo qua mạng'); log('Nhận cuộc gọi giả danh công an, bị lừa chuyển khoản mất ' + mb(l, x) + '.', 'bad'); fx(l, { hap: -6 }); });
  EV(function (l, a) { return a >= 25 && a <= 70 && l.indep && l.money > l.base * 0.3; }, 0.05, function (l, a, r, log) {
    var dest = isVN(l) ? (l.money > l.base * 2 ? pick(r, ['Thái Lan', 'Hàn Quốc', 'Nhật Bản', 'Singapore']) : pick(r, ['Đà Lạt', 'Phú Quốc', 'Sa Pa', 'Hội An', 'Hạ Long', 'Nha Trang', 'Côn Đảo'])) : 'nước ngoài';
    log('Đi du lịch ' + dest + (l.partner ? ' cùng ' + pw(l) : '') + '.', 'good'); cashB(l, -0.05, 'Du lịch'); fx(l, { hap: 4 });
  });
  EV(function (l, a) { return a >= 25 && a <= 60; }, 0.03, function (l, a, r, log) { log('Giúp đỡ một người bạn cũ đang gặp khó khăn.', 'good'); fx(l, { soc: 4, hap: 2, karma: 2 }); });
  EV(function (l, a) { return a >= 40 && (!l.bff || !l.bff.alive); }, 0.015, function (l, a, r, log) { log('Một người bạn cũ qua đời đột ngột.', 'bad'); fx(l, { hap: -5 }); });

  var CONFLICT = { UA: 0.3, SD: 0.3, MM: 0.2, PS: 0.35, SY: 0.12, YE: 0.15, SS: 0.12, CD: 0.1, SO: 0.12, AF: 0.06, ML: 0.08, BF: 0.1, NE: 0.06, NG: 0.04, ET: 0.06, HT: 0.15, CF: 0.08, LY: 0.05, IL: 0.08, LB: 0.08, RU: 0.06, IQ: 0.03, MZ: 0.03, CM: 0.03, CO: 0.02, MX: 0.03 };
  SC('chien_tranh', {
    title: 'Chiến tranh', tone: 'dark', prep: function (l, r) { return { c: CONFLICT[l.country] || 0.05, gang: /HT|MX|CO/.test(l.country) }; },
    text: function (l, d) { return d.gang ? 'Các băng đảng vũ trang giao tranh ngay trong khu phố bạn sống. Tiếng súng vang lên mỗi đêm.' : 'Chiến sự lan đến gần ' + l.city + '. Tiếng còi báo động, tiếng nổ dội về từng đêm. Hàng xóm lần lượt bỏ đi.'; },
    valid: function (l) { return !!CONFLICT[l.country] && !(l.abroad && l.abroad.perm); },
    opts: [
      { k: 'flee', l: 'Bỏ hết, chạy sang nước khác tị nạn', ai: { w: 1.2 }, run: function (l, r, log, d) { if (ch(r, 0.03)) { H.kill(l, 'thiệt mạng trên đường chạy nạn', log, true); return; } var dest = U.pick(r, [['DE', 'Đức', 'de'], ['PL', 'Ba Lan', 'pl'], ['TR', 'Thổ Nhĩ Kỳ', 'tr'], ['FR', 'Pháp', 'fr'], ['US', 'Hoa Kỳ', 'en']]); cashB(l, -0.5, 'Mất tài sản khi chạy nạn'); log('Chạy nạn với một chiếc ba lô. Sống trong trại tị nạn nhiều tháng trước khi được tái định cư.', 'big'); fx(l, { hap: -15 }); H.mem(l, 'Ngoái nhìn quê hương lần cuối từ chiếc xe chở người tị nạn.', 8); H.emigrate(l, dest, r, log); } },
      { k: 'stay', l: 'Trú ẩn, bám trụ quê nhà', ai: { w: 1 }, run: function (l, r, log, d) { var x = r(); if (x < d.c * 0.12) { H.kill(l, d.gang ? 'trúng đạn lạc trong giao tranh băng đảng' : 'thiệt mạng trong một trận pháo kích', log, true); return; } if (x < d.c * 0.5) { log('Một quả đạn rơi trúng khu nhà. Bạn bị thương, nhà cửa đổ nát.', 'bad'); fx(l, { hea: -20, hap: -15 }); cashB(l, -0.5, 'Nhà cửa bị phá hủy'); H.mem(l, 'Đêm tiếng nổ làm sập căn nhà của gia đình.', 7); } else { log('Những đêm trú dưới hầm, nghe tiếng nổ mà không dám thở mạnh.', 'bad'); fx(l, { hap: -10 }); } } },
      { k: 'fight', l: d_fightLabel, req: function (l) { return l.sex === 'M' && l.age >= 18 && l.age <= 60; }, ai: { risk: 1.2 }, run: function (l, r, log, d) { var x = r(); if (x < 0.08) { H.kill(l, d.gang ? 'bị bắn khi chống lại băng đảng' : 'hy sinh nơi chiến trường', log, true); l.flags.hero = true; return; } if (x < 0.3) { log('Bị thương nặng ngoài mặt trận.', 'bad'); fx(l, { hea: -25, karma: 6 }); } else { log('Trở về từ chiến trường, mang theo những ký ức không thể nói thành lời.', 'big'); fx(l, { hap: -12, karma: 8 }); } H.mem(l, 'Những ngày ngoài mặt trận, đồng đội ngã xuống bên cạnh.', 8); } }
    ]
  });
  function d_fightLabel(l, d) { return d.gang ? 'Cùng hàng xóm lập đội tự vệ' : 'Cầm súng bảo vệ quê hương'; }
  T('chien_tranh', function (l, a) { return a >= 6 && !!CONFLICT[l.country] && !(l.abroad && l.abroad.perm) && free(l); }, function (l) { return CONFLICT[l.country] || 0; });

  SC('bi_cuop', {
    title: 'Bị chặn đường', text: 'Đêm về muộn, một nhóm thanh niên chặn đường, rút dao đòi tiền và điện thoại.',
    opts: [
      { k: 'give', l: 'Đưa hết', ai: { w: 1.5 }, run: function (l, r, log) { cashB(l, -0.04, 'Bị cướp'); log('Đưa hết tiền và điện thoại, run rẩy đi bộ về nhà.', 'bad'); fx(l, { hap: -6 }); } },
      { k: 'run', l: 'Bỏ chạy', ai: { risk: 0.8 }, run: function (l, r, log) { if (ch(r, 0.65)) log('Chạy thục mạng, thoát được.', 'neutral'); else { log('Bị đuổi kịp, ăn một trận đòn.', 'bad'); fx(l, { hea: -10 }); cashB(l, -0.04, 'Bị cướp'); } } },
      { k: 'fight', l: 'Chống trả', ai: { risk: 1.5 }, run: function (l, r, log) { var x = r(); if (x < 0.03) { H.kill(l, 'bị cướp đâm trọng thương', log, true); return; } if (x < 0.5) { log('Chống trả, bị đâm vào bụng, phải mổ cấp cứu.', 'bad'); fx(l, { hea: -25 }); } else { log('Đánh trả quyết liệt, bọn cướp bỏ chạy.', 'good'); fx(l, { hap: 4 }); } } }
    ]
  });
  T('bi_cuop', function (l, a) { return a >= 14 && free(l) && (/es_la|afs|car|br/.test(l.pool) || (l.urban && l.fam.q <= 2)); }, function (l) { return /es_la|afs|car|br/.test(l.pool) ? 0.05 : 0.012; });

  SC('doi_kem', {
    title: 'Túng quẫn', tone: 'dark', prep: function (l) { l.flags.doiKem = l.age; return {}; },
    text: function (l) { return 'Trong nhà không còn một hạt gạo, túi không còn đồng nào.' + (l.ownHouse ? ' Ngôi nhà cũ dột nát mà không có tiền sửa.' : ' Tiền nhà đã quá hạn hai tháng.') + (l.age >= 65 ? ' Tuổi già, sức yếu, chẳng ai thuê làm.' : ''); },
    opts: [
      { k: 'help', l: 'Xin trợ cấp, nhờ hàng xóm, nhà chùa', ai: { soc: 1, w: 1.2 }, run: function (l, r, log) { cashB(l, 0.05, 'Trợ cấp, hàng xóm giúp đỡ'); log('Bà con lối xóm mỗi người góp một ít gạo. Nghèo mà tình nghĩa.', 'neutral'); fx(l, { hap: -2, soc: 3 }); H.mem(l, 'Bao gạo hàng xóm mang sang ngày nhà hết sạch gạo.', 4); } },
      { k: 'sell', l: 'Bán dần đồ đạc trong nhà', ai: { w: 1 }, run: function (l, r, log) { cashB(l, 0.08, 'Bán đồ đạc'); if (l.veh) { H.cash(l, l.vehVal || 0, 'Bán xe'); var cd = (l.loans || []).filter(function (x) { return x.type === 'car'; }).reduce(function (s, x) { return s + x.bal; }, 0); H.cash(l, -cd, 'Tất toán nợ mua xe'); clearLoans(l, ['car'], 0); l.veh = null; l.vehVal = 0; } log('Bán dần đồ đạc, cả chiếc xe máy, để có cái ăn.', 'bad'); fx(l, { hap: -6 }); } },
      { k: 'borrow', l: 'Vay nóng', ai: { risk: 1, w: 0.4 }, run: function (l, r, log) { H.addLoan(l, 'nong', l.base * 0.3); log('Vay nóng để qua cơn túng quẫn.', 'bad'); } },
      { k: 'beg', l: 'Ra đường xin ăn', req: function (l) { return !l.job && l.age >= 16; }, ai: { w: 0.5 }, run: function (l, r, log) { E.startJob(l, 'an_xin', r, log, true); log('Ngồi ở cổng chợ, chìa chiếc nón ra xin từng đồng lẻ.', 'bad'); fx(l, { hap: -12, soc: -6 }); H.mem(l, 'Lần đầu ngồi xin ăn ở cổng chợ, cúi gằm mặt xuống.', 6); } }
    ]
  });
  T('doi_kem', function (l, a) { return a >= 16 && l.indep && l.money < -l.base * 1.2 && !l.job && (l.flags.doiKem == null || a - l.flags.doiKem >= 3) && free(l); }, 0.4);

  // =====================================================================
  // TUỔI GIÀ
  // =====================================================================
  SC('di_chuc', {
    title: 'Lập di chúc', text: 'Tuổi đã cao. Con cháu ngập ngừng hỏi chuyện tài sản sau này.',
    valid: function (l) { return !l.flags.will; },
    opts: [
      { k: 'equal', l: 'Chia đều cho các con', ai: { w: 1.5 }, run: function (l, r, log) { l.flags.will = 'equal'; log('Lập di chúc chia đều tài sản cho các con.', 'neutral'); } },
      { k: 'care', l: 'Để lại cho người con chăm sóc mình', ai: { w: 1 }, run: function (l, r, log) { l.flags.will = 'care'; log('Để lại nhà cho người con ở cùng chăm sóc mình.', 'neutral'); } },
      { k: 'charity', l: 'Hiến một phần cho từ thiện', ai: { w: 0.5 }, run: function (l, r, log) { l.flags.will = 'charity'; fx(l, { karma: 8 }); log('Hiến một phần tài sản xây trường cho trẻ em nghèo.', 'good'); } },
      { k: 'none', l: 'Chưa nghĩ đến chuyện đó', ai: { w: 0.6 }, run: function (l, r, log) { l.flags.will = 'none'; } }
    ]
  });
  T('di_chuc', function (l, a) { return a >= 65 && l.kids.some(function (k) { return k.alive; }) && !l.flags.will && free(l); }, 0.25);
  SC('ve_que', {
    title: 'Lá rụng về cội', text: function (l) { return 'Đã bao năm xa quê. Nhiều đêm bạn mơ thấy con đường làng và mùi khói bếp chiều.'; },
    valid: function (l) { return !!(l.movedTo || (l.abroad && l.abroad.perm)) && !l.flags.home; },
    opts: [
      { k: 'go', l: 'Về quê sống những năm cuối đời', ai: { w: 1.2 }, run: function (l, r, log) { l.flags.home = true; log('Trở về quê, dựng lại căn nhà nhỏ bên vườn cũ.', 'big'); fx(l, { hap: 10 }); H.mem(l, 'Ngày trở về quê, hàng cau trước ngõ vẫn còn đó.', 6); } },
      { k: 'stay', l: 'Ở lại gần con cháu', ai: { w: 1 }, run: function (l, r, log) { l.flags.home = true; log('Ở lại thành phố gần con cháu. Thỉnh thoảng lại nhắc chuyện quê.', 'neutral'); } }
    ]
  });
  T('ve_que', function (l, a) { return a >= 60 && (l.movedTo || (l.abroad && l.abroad.perm)) && !l.flags.home && free(l); }, 0.15);

  // =====================================================================
  // TUỔI THƠ (1–14 tuổi): năm nào cũng có điều để chọn
  // =====================================================================
  function CT(id, when, cd, cw) { E.TRIG.push({ id: id, when: function (l, a) { return free(l) && when(l, a); }, p: 0.1, cd: cd || 3, child: true, cw: cw || 1 }); }
  function giveTalent(l, t, p, r) { if (!l.talent && r() < p) { l.talent = t; if (t === 'game') l.game = l.game || 'Liên Quân Mobile'; } if (l.talent === t) l.skill = Math.min(100, (l.skill || 20) + 4); }

  SC('thoi_noi', {
    title: function (l) { return isVN(l) ? 'Lễ thôi nôi' : 'Sinh nhật đầu tiên'; },
    text: function (l) { return (isVN(l) ? 'Bà bày một mâm đồ vật trước mặt bạn để "bốc thôi nôi" đoán nghề tương lai.' : 'Cả nhà bày đồ chơi trước mặt bạn trong sinh nhật đầu tiên.') + ' Cả nhà nín thở chờ xem bé chọn gì…'; },
    opts: [
      { k: 'but', l: '✏️ Cây bút', h: 'Học giỏi, chữ đẹp', run: function (l, r, log) { giveTalent(l, 'toán học', 0.4, r); fx(l, { kno: 3 }); log('Bốc trúng cây bút — ông nội cười: "Sau này làm thầy giáo!"', 'good'); H.mem(l, 'Ngày thôi nôi bạn bốc trúng cây bút, cả nhà vỗ tay.', 2); } },
      { k: 'tien', l: '💰 Tờ tiền', h: 'Buôn bán giỏi', run: function (l, r, log) { giveTalent(l, 'kinh doanh', 0.4, r); log('Nắm chặt tờ tiền không buông — "Thằng/con này sau giàu to!"', 'good'); H.mem(l, 'Ngày thôi nôi bạn nắm chặt tờ tiền, cả họ cười vang.', 2); } },
      { k: 'bong', l: '⚽ Quả bóng', h: 'Thể thao', run: function (l, r, log) { giveTalent(l, 'thể thao', 0.4, r); if (!l.talentSub && l.talent === 'thể thao') l.talentSub = 'bóng đá'; fx(l, { hea: 2 }); log('Ôm quả bóng lăn khắp chiếu.', 'good'); } },
      { k: 'mic', l: '🎤 Cái micro', h: 'Ca hát', run: function (l, r, log) { giveTalent(l, 'âm nhạc', 0.4, r); log('Cầm micro bi bô như đang hát.', 'good'); } },
      { k: 'may', l: '🎮 Máy chơi game đồ chơi', h: 'Game thủ', run: function (l, r, log) { giveTalent(l, 'game', 0.4, r); log('Bấm lia lịa vào chiếc máy chơi game đồ chơi.', 'good'); } },
      { k: 'ong', l: '🩺 Ống nghe', h: 'Bác sĩ', run: function (l, r, log) { l.flags.dreamMed = true; fx(l, { kno: 2 }); log('Bốc ống nghe — "Sau làm bác sĩ chữa bệnh cho bà nhé!"', 'good'); } },
      { k: 'son', l: '💄 Thỏi son / lược', h: 'Làm đẹp', run: function (l, r, log) { giveTalent(l, 'làm đẹp', 0.4, r); log('Cầm thỏi son nghịch ngợm, trét đầy mặt.', 'good'); } }
    ]
  });
  CT('thoi_noi', function (l, a) { return a === 1; }, 99, 50);

  SC('mau_giao', {
    title: 'Ngày đầu đi mẫu giáo', text: 'Mẹ vừa quay lưng đi, cô giáo dắt tay bạn vào lớp đầy những đứa trẻ lạ.',
    opts: [
      { k: 'cry', l: 'Khóc ầm lên đòi mẹ', run: function (l, r, log) { log('Khóc suốt buổi sáng, đến trưa mới chịu ăn cơm.', 'neutral'); H.mem(l, 'Buổi sáng đầu tiên ở mẫu giáo, khóc đến khản cổ.', 2); } },
      { k: 'play', l: 'Rụt rè lại gần một bạn đang xếp hình', run: function (l, r, log) { log('Làm quen được người bạn đầu tiên ở lớp mẫu giáo.', 'good'); fx(l, { soc: 4, hap: 2 }); } },
      { k: 'run', l: 'Lẻn ra cổng tìm mẹ', run: function (l, r, log) { log('Lẻn ra cổng, bị bác bảo vệ bế vào. Cả trường biết mặt.', 'neutral'); fx(l, { hap: 1 }); } }
    ]
  });
  CT('mau_giao', function (l, a) { return a === 3; }, 99, 6);

  SC('do_choi', {
    title: 'Món đồ chơi ở chợ', prep: function (l, r) { return { t: l.sex === 'M' ? pick(r, ['siêu nhân', 'ô tô điều khiển', 'súng nước']) : pick(r, ['búp bê', 'bộ đồ hàng', 'gấu bông']) }; },
    text: function (l, d) { return 'Đi chợ với mẹ, bạn thấy một con ' + d.t + ' bày ở sạp. Mắt bạn sáng rực.'; },
    opts: [
      { k: 'tantrum', l: 'Nằm lăn ra đất ăn vạ', run: function (l, r, log, d) { if (l.fam.q >= 3 && ch(r, 0.6)) { log('Ăn vạ thành công, ôm ' + d.t + ' về nhà. Mẹ thở dài.', 'neutral'); fx(l, { hap: 4, karma: -1 }); } else { log('Bị mẹ xách tai về, không có ' + d.t + ' mà còn ăn roi.', 'bad'); fx(l, { hap: -3 }); } } },
      { k: 'ask', l: 'Ngoan ngoãn xin mẹ', run: function (l, r, log, d) { if (ch(r, l.fam.q >= 3 ? 0.7 : 0.3)) { log('Mẹ mua cho con ' + d.t + '. Bạn ôm ngủ suốt mấy tháng.', 'good'); fx(l, { hap: 5 }); H.mem(l, 'Con ' + d.t + ' mẹ mua cho ở chợ.', 2); } else { log('Mẹ bảo "để Tết mẹ mua". Bạn gật đầu, mắt rơm rớm.', 'neutral'); fx(l, { hap: -1 }); } } },
      { k: 'quiet', l: l => l.fam.q <= 2 ? 'Thôi, nhà mình nghèo, không đòi' : 'Thôi, không đòi', run: function (l, r, log) { log('Không đòi gì, chỉ ngoái nhìn món đồ chơi mãi.', 'neutral'); fx(l, { karma: 2 }); if (l.fam.q <= 2) H.mem(l, 'Món đồ chơi ở chợ năm ấy bạn không dám đòi.', 3); } }
    ]
  });
  CT('do_choi', function (l, a) { return a >= 3 && a <= 6; }, 3);

  SC('hoc_chu_som', {
    title: 'Học trước khi vào lớp 1?', text: 'Bố mẹ bàn nhau cho bạn đi học "tiền tiểu học" để vào lớp Một khỏi bỡ ngỡ.',
    opts: [
      { k: 'learn', l: 'Đi học chữ trước', run: function (l, r, log) { log('Đi học chữ trước, vào lớp Một đã đọc vanh vách.', 'good'); fx(l, { kno: 4, hap: -2 }); } },
      { k: 'play', l: 'Chơi trọn mùa hè cuối cùng', run: function (l, r, log) { log('Một mùa hè rong chơi thả diều, bắt chuồn chuồn.', 'good'); fx(l, { hap: 4 }); H.mem(l, 'Mùa hè cuối cùng trước khi đi học, cánh diều trên đồng.', 2); } }
    ]
  });
  CT('hoc_chu_som', function (l, a) { return a === 5; }, 99, 3);

  SC('chon_truong', {
    title: 'Chọn trường tiểu học', text: 'Bố mẹ cân nhắc cho bạn học trường nào.',
    opts: [
      { k: 'public', l: 'Trường công gần nhà', run: function (l, r, log) { log('Học trường công gần nhà, đi bộ năm phút là tới.', 'neutral'); fx(l, { soc: 2 }); } },
      { k: 'private', l: 'Trường tư thục song ngữ', run: function (l, r, log) { log('Vào trường song ngữ, học thêm tiếng Anh từ lớp Một.', 'good'); fx(l, { kno: 3 }); l.uniTier = (l.uniTier || 1) + 0.03; } },
      { k: 'intl', l: 'Trường quốc tế', req: function (l) { return l.fam.q >= 5; }, run: function (l, r, log) { log('Vào trường quốc tế, bạn bè toàn con nhà khá giả.', 'good'); fx(l, { kno: 5 }); l.uniTier = (l.uniTier || 1) + 0.06; } }
    ]
  });
  CT('chon_truong', function (l, a) { return a === 6 && l.urban && l.fam.q >= 3; }, 99, 4);

  SC('he_nay', {
    title: 'Hè này làm gì?', text: 'Năm học kết thúc. Ba tháng hè dài trước mặt.',
    opts: [
      { k: 'swim', l: 'Đi học bơi', h: 'Biết bơi để an toàn khi ra sông, ra biển', run: function (l, r, log) { if (ch(r, 0.85)) { l.flags.swim = true; log('Học bơi xong, lần đầu tự nổi được trên mặt nước.', 'good'); fx(l, { hea: 3 }); H.mem(l, 'Mùa hè học bơi, uống no nước rồi cũng bơi được.', 2); } else log('Đi học bơi mà sợ nước quá, bỏ dở giữa chừng.', 'neutral'); } },
      { k: 'art', l: 'Học vẽ / học đàn', run: function (l, r, log) { giveTalent(l, r() < 0.5 ? 'hội họa' : 'âm nhạc', 0.3, r); log('Cả hè ôm giá vẽ, cây đàn.', 'good'); fx(l, { kno: 1, hap: 2 }); } },
      { k: 'grand', l: 'Về quê chơi với ông bà', run: function (l, r, log) { log('Cả hè ở quê với ông bà: tắm ao, câu cá, nướng khoai.', 'good'); fx(l, { hap: 5, soc: 2 }); H.mem(l, 'Mùa hè ở quê ông bà, khói rơm chiều và tiếng ếch nhái.', 4); } },
      { k: 'help', l: 'Phụ bố mẹ kiếm thêm', req: function (l) { return l.fam.q <= 2; }, run: function (l, r, log) { log('Cả hè phụ bố mẹ bán hàng, chăn bò.', 'neutral'); fx(l, { karma: 2, hea: -1 }); } },
      { k: 'tv', l: 'Ở nhà xem tivi, chơi game', run: function (l, r, log) { skillGame(l, 4); log('Một mùa hè dán mắt vào màn hình.', 'neutral'); fx(l, { hap: 2, hea: -2 }); } }
    ]
  });
  CT('he_nay', function (l, a) { return a >= 6 && a <= 12; }, 2, 2);

  SC('vo_binh', {
    title: 'Lỡ tay', prep: function (l, r) { return { t: pick(r, ['bình hoa của mẹ', 'chiếc điện thoại của bố', 'bát hương trên bàn thờ', 'cửa kính nhà hàng xóm']) }; },
    text: function (l, d) { return 'Chơi đùa trong nhà, bạn lỡ tay làm vỡ ' + d.t + '. Chưa ai nhìn thấy.'; },
    opts: [
      { k: 'admit', l: 'Nhận lỗi', run: function (l, r, log, d) { log('Rụt rè nhận lỗi làm vỡ ' + d.t + '. Bố mẹ mắng một chút rồi xoa đầu.', 'good'); fx(l, { karma: 3 }); } },
      { k: 'blame', l: 'Đổ cho em / con mèo', run: function (l, r, log) { fx(l, { karma: -3 }); if (ch(r, 0.4)) { log('Bị phát hiện đổ lỗi, ăn đòn gấp đôi.', 'bad'); fx(l, { hap: -3 }); } else log('Con mèo bị mắng oan. Bạn thấy áy náy.', 'neutral'); } },
      { k: 'hide', l: 'Giấu mảnh vỡ đi', run: function (l, r, log) { fx(l, { karma: -1 }); log(ch(r, 0.5) ? 'Giấu mảnh vỡ dưới gầm giường, mấy hôm sau mới bị lộ.' : 'Giấu trót lọt. Nhưng tối nào cũng sợ.', 'neutral'); } }
    ]
  });
  CT('vo_binh', function (l, a) { return a >= 5 && a <= 11; }, 4);

  SC('tien_an_sang', {
    title: 'Tiền ăn sáng', text: 'Mẹ dúi cho ít tiền ăn sáng trước giờ đến trường.',
    opts: [
      { k: 'eat', l: 'Ăn sáng đầy đủ', run: function (l, r, log) { log('Ngày nào cũng ăn bát xôi, ổ bánh mì trước cổng trường.', 'neutral'); fx(l, { hea: 2 }); } },
      { k: 'save', l: 'Nhịn ăn, để dành mua truyện / thẻ bài', run: function (l, r, log) { log('Nhịn ăn sáng cả tháng để mua bộ truyện tranh.', 'neutral'); fx(l, { hap: 3, hea: -2 }); } },
      { k: 'gift', l: 'Dồn tiền mua quà sinh nhật mẹ', run: function (l, r, log) { log('Dồn tiền ăn sáng mua tặng mẹ chiếc kẹp tóc. Mẹ cất giữ mãi.', 'good'); fx(l, { karma: 4, hap: 3 }); H.mem(l, 'Chiếc kẹp tóc mua bằng tiền ăn sáng tặng mẹ.', 4); } },
      { k: 'game', l: 'Nạp game', run: function (l, r, log) { skillGame(l, 3); log('Tiền ăn sáng biến thành quân huy, kim cương trong game.', 'neutral'); fx(l, { hea: -2, hap: 2 }); } }
    ]
  });
  CT('tien_an_sang', function (l, a) { return a >= 7 && a <= 13 && l.school; }, 3);

  SC('thu_cung', {
    title: 'Một người bạn bốn chân', prep: function (l, r) { var k = pick(r, ['chó', 'mèo']); return { k: k, n: pick(r, k === 'chó' ? ['Mực', 'Vàng', 'Bông', 'Lu', 'Milo'] : ['Mướp', 'Mimi', 'Bơ', 'Miu', 'Đốm']) }; },
    text: function (l, d) { return 'Nhà hàng xóm cho bạn một con ' + d.k + ' con, lông xù, mắt tròn xoe.'; },
    opts: [
      { k: 'yes', l: function (l, d) { return 'Nhận nuôi, đặt tên là ' + d.n; }, run: function (l, r, log, d) { H.addPet(l, r, d.k, d.k === 'chó' ? 'chó ta' : 'mèo ta', d.n); log('Nhận nuôi ' + d.k + ' ' + d.n + '. Từ đó ngày nào cũng có đứa chạy ra cổng đón.', 'good'); fx(l, { hap: 6, soc: 2 }); H.mem(l, d.n + ' — con ' + d.k + ' đầu tiên, chạy ra cổng đón bạn mỗi chiều.', 4); } },
      { k: 'no', l: 'Thôi, nhà chật', run: function (l, r, log) { log('Không nuôi. Thỉnh thoảng lại sang nhà hàng xóm nựng.', 'neutral'); } }
    ]
  });
  CT('thu_cung', function (l, a) { return a >= 5 && a <= 13 && !H.pets(l).length; }, 99);

  // =====================================================================
  // THÚ CƯNG — nhận nuôi theo loài & giống, chăm sóc, ốm đau, trộm chó, đi lạc, đẻ con…
  // =====================================================================
  function petOf(l, ks) { var p = H.pets(l).filter(function (x) { return !ks || ks.indexOf(x.k) >= 0; }); return p.length ? p[0] : null; }
  function findPet(l, d) { return (l.pets || []).filter(function (x) { return x.alive && x.n === d.n && x.k === d.k; })[0] || null; }
  var PET_OPT = [['cho', 'chó'], ['meo', 'mèo'], ['ca', 'cá cảnh'], ['chim', 'chim'], ['nho', null]];
  function adopt(l, r, log, d, k) {
    var br = d.br[k], P = E.PETS[k], price = (P.br[br] || 0) * l.base, n = H.petName(l, r);
    if (!l.indep) {
      if (price > l.base * 0.03 && l.fam.q <= 3 && r() < 0.6) { log('Bố mẹ bảo ' + br + ' đắt quá, nhà không kham nổi — cuối cùng xin được một con ' + (k === 'chó' ? 'chó ta' : k === 'mèo' ? 'mèo ta' : br) + ' của hàng xóm.', 'neutral'); br = k === 'chó' ? 'chó ta' : k === 'mèo' ? 'mèo ta' : br; }
      else if (price > 0) log('Bố mẹ chiều theo, mua cho bạn ' + br + '.', 'neutral');
    } else if (price > 0) H.cash(l, -price, 'Mua ' + br);
    var p = H.addPet(l, r, k, br, n);
    var first = (l.pets || []).length === 1;
    log('Đón ' + H.petLabel(p) + ' về nhà, đặt tên là ' + n + '.' + (k === 'chó' ? ' Ngày nào cũng có đứa vẫy đuôi chờ ở cổng.' : k === 'mèo' ? ' Nó chọn ngay góc sofa làm "lãnh địa".' : ''), 'good');
    fx(l, { hap: k === 'chó' || k === 'mèo' ? 6 : 3, soc: 1 });
    if (first || k === 'chó' || k === 'mèo') H.mem(l, 'Ngày đón ' + n + ' — ' + H.petLabel(p) + ' — về nhà.', 3);
  }
  SC('nuoi_pet', {
    title: 'Nuôi thú cưng',
    prep: function (l, r) {
      var br = {};
      Object.keys(E.PETS).forEach(function (k) { br[k] = pick(r, Object.keys(E.PETS[k].br)); });
      var small = pick(r, ['hamster', 'thỏ', 'rùa']);
      return { br: br, small: small };
    },
    text: function (l) { return (l.indep ? 'Nhà hơi trống trải. Bạn tính nuôi một con vật cho vui cửa vui nhà.' : 'Bạn năn nỉ bố mẹ cho nuôi một con vật.') + (H.pets(l).length ? ' Trong nhà đã có ' + H.pets(l).map(function (p) { return p.n; }).join(', ') + '.' : '') + ' Mỗi loài một tính, một chi phí và một tuổi thọ khác nhau.'; },
    opts: PET_OPT.map(function (o) {
      return {
        k: o[0],
        l: function (l, d) { var k = o[1] || d.small, br = d.br[k], pr = (E.PETS[k].br[br] || 0) * l.base; return 'Nuôi ' + (/^(chó|mèo|cá|chim|thỏ|rùa|hamster|vẹt)/.test(br) ? br : k + ' ' + br) + (pr > 0 ? ' — ' + E.fmtMoney(l, pr) : ' — xin được, không mất tiền'); },
        h: function (l, d) { var k = o[1] || d.small, P = E.PETS[k], m = P.cost * l.base / 12; return 'Sống ~' + P.life[0] + '–' + P.life[1] + ' năm · nuôi tốn ~' + (l.cur === 'vnd' && m < 1 ? Math.max(10, Math.round(m * 100) * 10) + ' nghìn đ' : E.fmtMoney(l, m)) + '/tháng'; },
        ai: { w: o[1] === 'chó' || o[1] === 'mèo' ? 1 : 0.4 },
        run: function (l, r, log, d) { adopt(l, r, log, d, o[1] || d.small); }
      };
    }).concat([{ k: 'no', l: 'Thôi, chưa đủ thời gian chăm sóc', ai: { w: 0.5 }, run: function (l, r, log) { log('Gác lại ý định nuôi thú cưng.', 'neutral'); } }])
  });

  SC('choi_pet', {
    title: 'Dành thời gian cho thú cưng', valid: function (l) { return H.pets(l).length > 0; },
    prep: function (l) { var p = H.pets(l)[0]; return { n: p.n, k: p.k, lb: H.petLabel(p) }; },
    text: function (l, d) { return d.n + ' (' + d.lb + ') ' + (d.k === 'chó' ? 'ngậm dây xích chạy lại, đuôi ngoáy tít.' : d.k === 'mèo' ? 'cọ đầu vào chân bạn kêu meo meo.' : 'đang chờ bạn để ý đến nó.'); },
    opts: [
      { k: 'walk', l: function (l, d) { return d.k === 'chó' ? 'Dắt ' + d.n + ' đi dạo công viên' : 'Chơi đùa với ' + d.n + ' cả buổi'; }, run: function (l, r, log, d) { log((d.k === 'chó' ? 'Dắt ' + d.n + ' đi dạo, làm quen thêm mấy người hàng xóm cũng nuôi chó.' : 'Cả buổi chiều chơi với ' + d.n + ', quên hết mệt mỏi.'), 'good'); fx(l, { hea: d.k === 'chó' ? 3 : 1, hap: 3, soc: d.k === 'chó' ? 2 : 0 }); } },
      { k: 'care', l: function (l, d) { return 'Tắm rửa, cắt móng, đưa ' + d.n + ' đi tiêm phòng'; }, run: function (l, r, log, d) { var p = findPet(l, d); if (p) p.life += r() < 0.5 ? 1 : 0; log('Đưa ' + d.n + ' đi tiêm phòng, tắm rửa sạch sẽ. Bác sĩ thú y khen nuôi khéo.', 'good'); if (l.indep) H.cash(l, -l.base * 0.005, 'Tiêm phòng cho ' + d.n); fx(l, { hap: 2 }); } },
      { k: 'photo', l: function (l, d) { return 'Chụp ảnh ' + d.n + ' đăng mạng xã hội'; }, run: function (l, r, log, d) {
        if (ch(r, 0.04)) { log('Clip ' + d.n + ' làm trò bất ngờ viral hàng triệu lượt xem! Nhãn hàng thức ăn thú cưng nhắn tin mời quảng cáo.', 'big'); l.fame = (l.fame || 0) + 8000; if (adult(l)) cashB(l, 0.05, 'Quảng cáo cùng ' + d.n); fx(l, { hap: 6 }); H.mem(l, 'Clip ' + d.n + ' viral, cả nhà xem đi xem lại.', 3); }
        else { log('Đăng ảnh ' + d.n + ', được bạn bè thả tim rần rần.', 'neutral'); fx(l, { hap: 2, soc: 1 }); }
      } },
      { k: 'train', l: function (l, d) { return 'Dạy ' + d.n + ' vài trò mới'; }, req: function (l, d) { return d.k === 'chó' || d.k === 'chim' || d.k === 'mèo'; }, run: function (l, r, log, d) { if (ch(r, d.k === 'mèo' ? 0.3 : 0.65)) { log(d.n + ' học được cách ' + (d.k === 'chim' ? 'nói "chào"' : 'bắt tay và ngồi đợi lệnh') + '. Cả nhà cười nghiêng ngả.', 'good'); fx(l, { hap: 4, kno: 1 }); } else { log(d.n + ' nhìn bạn với ánh mắt khinh bỉ rồi bỏ đi ngủ.', 'neutral'); fx(l, { hap: 1 }); } } }
    ]
  });

  SC('pet_om', {
    title: 'Thú cưng bị ốm', valid: function (l, d) { return !!(d && d.n ? findPet(l, d) : H.pets(l).length); },
    prep: function (l, r) { var p = petOf(l); return p ? { n: p.n, k: p.k, lb: H.petLabel(p), sick: pick(r, p.k === 'chó' ? ['bị Care (sài sốt)', 'bị Parvo, nôn ra máu', 'ăn phải bả'] : p.k === 'mèo' ? ['bỏ ăn, sốt li bì', 'bị giảm bạch cầu', 'bị viêm đường tiết niệu'] : ['ủ rũ, bỏ ăn', 'có dấu hiệu bị bệnh']) } : null; },
    text: function (l, d) { return d.n + ' (' + d.lb + ') ' + d.sick + '.'; },
    opts: [
      { k: 'vet', l: 'Đưa đi bác sĩ thú y', h: function (l) { return l.indep ? 'Khoảng ' + mb(l, 0.03) : 'Xin bố mẹ đưa đi'; }, ai: { w: 1.4 }, run: function (l, r, log, d) { var p = findPet(l, d); if (l.indep) cashB(l, -0.03, 'Viện phí thú y cho ' + d.n); if (p && ch(r, 0.88)) { log('Nằm viện thú y mấy hôm, ' + d.n + ' khỏe lại, lại chạy nhảy như cũ.', 'good'); fx(l, { hap: 3 }); } else if (p) { p.alive = false; p.died = l.age; log('Dù đã cố hết sức, ' + d.n + ' vẫn không qua khỏi.', 'bad'); fx(l, { hap: -8 }); H.mem(l, 'Đêm ' + d.n + ' mất ở phòng khám thú y, bạn ôm nó trong tay.', 4); } } },
      { k: 'home', l: 'Tự mua thuốc về chữa', ai: { w: 0.6 }, run: function (l, r, log, d) { var p = findPet(l, d); if (p && ch(r, 0.55)) { log('Mua thuốc về tự chữa, may mà ' + d.n + ' qua khỏi.', 'neutral'); } else if (p) { p.alive = false; p.died = l.age; log(d.n + ' yếu dần rồi mất. Bạn tự trách mình mãi.', 'bad'); fx(l, { hap: -9 }); H.mem(l, 'Giá mà hôm ấy đưa ' + d.n + ' đi khám sớm hơn.', 4); } } },
      { k: 'leave', l: 'Để vài hôm xem sao', ai: { w: 0.2 }, run: function (l, r, log, d) { var p = findPet(l, d); if (p && ch(r, 0.35)) log(d.n + ' tự khỏe lại.', 'neutral'); else if (p) { p.alive = false; p.died = l.age; log(d.n + ' không qua khỏi.', 'bad'); fx(l, { hap: -7, karma: -2 }); } } }
    ]
  });
  T('pet_om', function (l, a) { return free(l) && H.pets(l).some(function (p) { return a - p.since >= 1; }); }, 0.08, 3);

  SC('pet_trom', {
    title: 'Trộm chó', tone: 'dark', valid: function (l, d) { return !!(d && d.n ? findPet(l, d) : petOf(l, ['chó'])); },
    prep: function (l) { var p = petOf(l, ['chó']); return p ? { n: p.n, k: p.k } : null; },
    text: function (l, d) { return 'Nửa đêm nghe tiếng xe máy rồ ga đầu ngõ. Sáng ra, ' + d.n + ' biến mất — chỉ còn sợi dây xích bị cắt đứt.'; },
    opts: [
      { k: 'post', l: 'Đăng tin khắp các hội nhóm, đi tìm ở các lò mổ', ai: { w: 1 }, run: function (l, r, log, d) { var p = findPet(l, d); if (p && ch(r, 0.3)) { log('Có người nhắn tin thấy ' + d.n + ' ở một quán thịt chó. Bạn lao đến, chuộc được nó về.', 'good'); if (l.indep) cashB(l, -0.01, 'Chuộc ' + d.n); fx(l, { hap: 4 }); H.mem(l, 'Ngày tìm lại được ' + d.n + ' — nó run rẩy rúc vào lòng bạn.', 4); } else if (p) { p.alive = false; p.lost = true; p.died = l.age; log('Tìm khắp nơi vẫn không thấy ' + d.n + '.', 'bad'); fx(l, { hap: -9 }); H.mem(l, 'Sợi dây xích của ' + d.n + ' vẫn treo ở cổng mấy năm liền.', 4); } } },
      { k: 'police', l: 'Trình báo công an', ai: { w: 0.5, moral: 0.5 }, run: function (l, r, log, d) { var p = findPet(l, d); if (p && ch(r, 0.15)) { log('Công an bắt được nhóm trộm chó, ' + d.n + ' được trả về.', 'good'); fx(l, { hap: 5 }); } else if (p) { p.alive = false; p.lost = true; p.died = l.age; log('Đã trình báo nhưng không tìm được ' + d.n + '.', 'bad'); fx(l, { hap: -8 }); } } },
      { k: 'let', l: 'Đành chấp nhận', ai: { w: 0.3 }, run: function (l, r, log, d) { var p = findPet(l, d); if (p) { p.alive = false; p.lost = true; p.died = l.age; } log('Mất ' + d.n + '. Mấy hôm liền không ai trong nhà nói câu nào.', 'bad'); fx(l, { hap: -7 }); } }
    ]
  });
  T('pet_trom', function (l, a) { return isVN(l) && free(l) && !!petOf(l, ['chó']); }, function (l) { return l.urban ? 0.015 : 0.035; }, 6);

  SC('pet_lac', {
    title: 'Thú cưng đi lạc', valid: function (l, d) { return !!(d && d.n ? findPet(l, d) : petOf(l, ['chó', 'mèo'])); },
    prep: function (l) { var p = petOf(l, ['mèo', 'chó']); return p ? { n: p.n, k: p.k } : null; },
    text: function (l, d) { return 'Cổng quên đóng. ' + d.n + ' ra ngoài từ chiều đến giờ vẫn chưa thấy về.'; },
    opts: [
      { k: 'search', l: 'Đi tìm khắp xóm, in tờ rơi dán cột điện', ai: { w: 1 }, run: function (l, r, log, d) { var p = findPet(l, d); if (p && ch(r, 0.7)) { log('Tìm thấy ' + d.n + ' trốn dưới gầm xe nhà bên, người lấm lem.', 'good'); fx(l, { hap: 3 }); } else if (p) { p.alive = false; p.lost = true; p.died = l.age; log(d.n + ' không bao giờ trở về nữa.', 'bad'); fx(l, { hap: -7 }); H.mem(l, 'Chiều nào cũng ngóng ra cổng chờ ' + d.n + '.', 3); } } },
      { k: 'wait', l: 'Chờ, chắc nó tự về', ai: { w: 0.5 }, run: function (l, r, log, d) { var p = findPet(l, d); if (p && ch(r, d.k === 'mèo' ? 0.6 : 0.45)) log('Ba hôm sau ' + d.n + ' tự về, gầy nhom nhưng vẫn vẫy đuôi.', 'neutral'); else if (p) { p.alive = false; p.lost = true; p.died = l.age; log(d.n + ' đi mãi không về.', 'bad'); fx(l, { hap: -6 }); } } }
    ]
  });
  T('pet_lac', function (l, a) { return free(l) && !!petOf(l, ['chó', 'mèo']); }, 0.03, 6);

  SC('pet_de', {
    title: 'Một đàn con', valid: function (l, d) { return !!(d && d.n ? findPet(l, d) : petOf(l, ['chó', 'mèo'])); },
    prep: function (l, r) { var p = petOf(l, ['chó', 'mèo']); return p ? { n: p.n, k: p.k, c: U.randint(r, 3, 6) } : null; },
    text: function (l, d) { return d.n + ' vừa sinh ' + d.c + ' ' + (d.k === 'chó' ? 'chú cún' : 'chú mèo') + ' con. Cả nhà xúm lại xem.'; },
    opts: [
      { k: 'keep', l: 'Giữ lại một bé, còn lại cho người quen', req: function (l) { return H.pets(l).length < 4; }, ai: { w: 0.7 }, run: function (l, r, log, d) { var p = H.addPet(l, r, d.k, d.k === 'chó' ? 'chó ta' : 'mèo ta'); log('Giữ lại một bé, đặt tên là ' + p.n + '. Mấy bé còn lại cho hàng xóm.', 'good'); fx(l, { hap: 4, soc: 2 }); } },
      { k: 'give', l: 'Cho hết những người thương động vật', ai: { w: 0.6, moral: 0.5 }, run: function (l, r, log) { log('Tìm được nhà mới tử tế cho cả đàn.', 'good'); fx(l, { karma: 3, soc: 2 }); } },
      { k: 'sell', l: 'Bán đi kiếm chút tiền', req: function (l) { return l.indep; }, ai: { w: 0.4 }, run: function (l, r, log, d) { cashB(l, 0.02 * d.c / 4, 'Bán ' + (d.k === 'chó' ? 'chó' : 'mèo') + ' con'); log('Bán đàn con được một khoản nho nhỏ.', 'neutral'); } },
      { k: 'neuter', l: function (l, d) { return 'Cho đàn con đi, đưa ' + d.n + ' đi triệt sản'; }, ai: { w: 0.3, smart: 0.5 }, run: function (l, r, log, d) { var p = findPet(l, d); if (p) p.neut = true; log('Cho đàn con đi rồi đưa ' + d.n + ' đi triệt sản, tránh sinh nở liên tục.', 'neutral'); fx(l, { karma: 1 }); } }
    ]
  });
  T('pet_de', function (l, a) { return free(l) && H.pets(l).some(function (p) { return (p.k === 'chó' || p.k === 'mèo') && !p.neut && a - p.since >= 2 && a - p.since <= 8; }); }, 0.05, 5);

  SC('pet_can', {
    title: 'Chó nhà bạn cắn người', valid: function (l, d) { return !!(d && d.n ? findPet(l, d) : petOf(l, ['chó'])); },
    prep: function (l) { var p = petOf(l, ['chó']); return p ? { n: p.n, k: p.k } : null; },
    text: function (l, d) { return d.n + ' sổng xích, cắn vào chân đứa trẻ nhà hàng xóm. Bố mẹ đứa bé đang đứng trước cổng.'; },
    opts: [
      { k: 'pay', l: 'Xin lỗi, đưa bé đi tiêm phòng dại, đền tiền', h: function (l) { return l.indep ? mb(l, 0.02) : 'Bố mẹ lo'; }, ai: { w: 1.2, moral: 1 }, run: function (l, r, log) { if (l.indep) cashB(l, -0.02, 'Đền viện phí cho hàng xóm'); log('Đưa bé đi tiêm phòng dại, đền tiền và xin lỗi. Hai nhà vẫn giữ được tình làng nghĩa xóm.', 'neutral'); fx(l, { karma: 2 }); } },
      { k: 'argue', l: 'Cãi lại: "Tại nó trêu chó nhà tôi"', ai: { w: 0.3, bad: 1 }, run: function (l, r, log) { log('Cãi nhau to, hai nhà từ đó không nhìn mặt nhau.', 'bad'); fx(l, { soc: -5, karma: -4 }); } },
      { k: 'leash', l: 'Đền tiền, từ nay xích chó và đeo rọ mõm', ai: { w: 0.6 }, run: function (l, r, log) { if (l.indep) cashB(l, -0.02, 'Đền viện phí cho hàng xóm'); log('Đền tiền, mua rọ mõm, từ nay dắt chó ra đường cẩn thận hơn.', 'neutral'); fx(l, { karma: 1 }); } }
    ]
  });
  T('pet_can', function (l, a) { return free(l) && !!petOf(l, ['chó']); }, 0.025, 8);

  SC('van_nghe', {
    title: 'Văn nghệ ở trường', prep: function (l) { return { e: isVN(l) ? pick2(l, ['ngày 20/11', 'đêm Trung thu', 'lễ tổng kết']) : 'cuối năm' }; },
    text: function (l, d) { return 'Trường tổ chức văn nghệ ' + d.e + '. Cô chủ nhiệm hỏi ai xung phong.'; },
    opts: [
      { k: 'perform', l: 'Xung phong lên sân khấu', run: function (l, r, log) { giveTalent(l, r() < 0.5 ? 'âm nhạc' : 'diễn xuất', 0.25, r); if (ch(r, 0.7)) { log('Lên sân khấu hát, cả trường vỗ tay rần rần.', 'good'); fx(l, { soc: 4, hap: 4 }); H.mem(l, 'Lần đầu đứng trên sân khấu trường, tay run cầm micro.', 3); } else { log('Lên sân khấu quên lời, đứng đơ mất mười giây.', 'neutral'); fx(l, { hap: -2 }); } } },
      { k: 'crew', l: 'Làm hậu cần, trang trí', run: function (l, r, log) { log('Ở hậu trường cắt dán, trang trí sân khấu.', 'neutral'); fx(l, { soc: 2 }); } },
      { k: 'watch', l: 'Ngồi dưới xem', run: function (l, r, log) { log('Ngồi dưới cổ vũ các bạn.', 'neutral'); } }
    ]
  });
  CT('van_nghe', function (l, a) { return a >= 7 && a <= 14 && l.school; }, 3);

  SC('xin_dien_thoai', {
    title: 'Chiếc điện thoại đầu tiên', text: 'Cả lớp gần như ai cũng có điện thoại riêng, chỉ mình bạn chưa có.',
    opts: [
      { k: 'beg', l: 'Năn nỉ bố mẹ mua', run: function (l, r, log) { if (l.fam.q >= 3 || ch(r, 0.3)) { log('Được bố mẹ mua cho chiếc điện thoại đầu tiên.', 'good'); fx(l, { hap: 5, soc: 2 }); l.flags.phone = true; skillGame(l, 3); } else { log('Bố mẹ bảo "nhà chưa có điều kiện". Bạn giận dỗi cả tuần.', 'bad'); fx(l, { hap: -4 }); } } },
      { k: 'share', l: 'Dùng ké điện thoại của mẹ', run: function (l, r, log) { log('Tối nào cũng mượn điện thoại mẹ nhắn tin cho bạn.', 'neutral'); } },
      { k: 'save', l: 'Tự để dành tiền mua', run: function (l, r, log) { log('Để dành tiền lì xì, tiền ăn sáng suốt một năm để tự mua điện thoại cũ.', 'good'); fx(l, { karma: 2, kno: 1 }); H.mem(l, 'Chiếc điện thoại cũ tự để dành tiền mua.', 3); l.flags.phone = true; } }
    ]
  });
  CT('xin_dien_thoai', function (l, a) { return a >= 10 && a <= 14 && !l.flags.phone; }, 99);

  SC('giup_nha', {
    title: 'Nhà không ai nấu cơm', text: function (l) { return (l.fam.mAlive ? 'Mẹ ốm nằm liệt giường' : 'Bà ốm') + ', bố đi làm đến tối mới về. ' + (l.fam.sibs ? 'Đám anh chị em còn đi học thêm.' : ''); },
    opts: [
      { k: 'cook', l: 'Tự nấu cơm, dọn nhà, chăm mẹ', run: function (l, r, log) { log('Lần đầu tự nấu nồi cơm — hơi khê, nhưng mẹ khen ngon.', 'good'); fx(l, { karma: 4, soc: 2 }); H.mem(l, 'Nồi cơm khê đầu tiên nấu cho mẹ lúc ốm.', 4); } },
      { k: 'out', l: 'Chạy sang nhà bạn chơi', run: function (l, r, log) { log('Chạy sang nhà bạn chơi đến tối. Về nhà thấy bố đang nấu cháo cho mẹ.', 'neutral'); fx(l, { karma: -2 }); } },
      { k: 'grand', l: 'Chạy đi gọi bà sang giúp', run: function (l, r, log) { log('Chạy đi gọi bà ngoại sang nấu cháo cho mẹ.', 'neutral'); fx(l, { karma: 1 }); } }
    ]
  });
  CT('giup_nha', function (l, a) { return a >= 8 && a <= 14; }, 4);

  SC('cho_chep_bai', {
    title: 'Bạn cùng bàn', text: 'Giờ kiểm tra 15 phút, đứa bạn cùng bàn nháy mắt, khều tay xin chép bài.',
    opts: [
      { k: 'yes', l: 'Cho chép', run: function (l, r, log) { if (ch(r, 0.25)) { log('Cả hai bị cô bắt quả tang, bị trừ điểm.', 'bad'); fx(l, { hap: -3 }); } else { log('Cho bạn chép. Từ đó hai đứa thân hơn hẳn.', 'neutral'); fx(l, { soc: 3, karma: -1 }); } } },
      { k: 'no', l: 'Che bài lại', run: function (l, r, log) { log('Che bài lại. Bạn ấy giận mất mấy hôm.', 'neutral'); fx(l, { soc: -2, karma: 1 }); } }
    ]
  });
  CT('cho_chep_bai', function (l, a) { return a >= 10 && a <= 14 && l.school; }, 4);

  SC('thi_hsg', {
    title: 'Đội tuyển học sinh giỏi', text: 'Cô giáo chọn bạn vào đội tuyển học sinh giỏi. Phải ôn luyện cả buổi tối và cuối tuần.',
    opts: [
      { k: 'yes', l: 'Nhận lời, ôn luyện hết sức', run: function (l, r, log) { fx(l, { kno: 4, hap: -2 }); if (ch(r, 0.35 + (l.st.kno - 60) / 100)) { log('Đạt giải học sinh giỏi cấp ' + (l.st.kno > 72 ? 'tỉnh' : 'huyện') + '! Tên bạn được đọc dưới cờ.', 'big'); fx(l, { hap: 8 }); H.mem(l, 'Buổi chào cờ tên bạn được xướng lên nhận giải học sinh giỏi.', 4); } else log('Ôn luyện vất vả nhưng không đạt giải.', 'neutral'); } },
      { k: 'no', l: 'Từ chối, muốn có thời gian chơi', run: function (l, r, log) { log('Từ chối đội tuyển. Cô giáo hơi tiếc.', 'neutral'); fx(l, { hap: 2 }); } }
    ]
  });
  CT('thi_hsg', function (l, a) { return a >= 9 && a <= 14 && l.school && l.st.kno >= 55; }, 3, 1.5);

  SC('trung_thu', {
    title: 'Đêm Trung thu', text: function (l) { return 'Trăng rằm tháng Tám. Lũ trẻ trong xóm í ới gọi nhau đi rước đèn.' + (l.fam.q <= 2 ? ' Nhà bạn năm nay không mua đèn.' : ''); },
    opts: [
      { k: 'parade', l: l => l.fam.q <= 2 ? 'Tự làm đèn ông sao bằng giấy bóng kính' : 'Cầm đèn ông sao đi rước', run: function (l, r, log) { log('Rước đèn ông sao khắp xóm, hát "Tết Trung thu rước đèn đi chơi".', 'good'); fx(l, { hap: 5, soc: 3 }); H.mem(l, 'Đêm Trung thu rước đèn ông sao' + (l.fam.q <= 2 ? ' tự làm bằng giấy bóng kính' : '') + '.', 3); } },
      { k: 'home', l: 'Ở nhà phá cỗ với gia đình', run: function (l, r, log) { log('Phá cỗ với bánh nướng, bánh dẻo, bưởi xếp hình chó bông.', 'good'); fx(l, { hap: 3 }); } }
    ]
  });
  CT('trung_thu', function (l, a) { return isVN(l) && a >= 4 && a <= 10; }, 4);

  SC('li_xi', {
    title: 'Tiền lì xì', text: 'Tết năm nay bạn được lì xì kha khá. Mẹ bảo: "Đưa mẹ giữ cho."',
    opts: [
      { k: 'mom', l: 'Đưa mẹ giữ', run: function (l, r, log) { log('Đưa hết tiền lì xì cho mẹ "giữ hộ" — và không bao giờ thấy lại.', 'neutral'); fx(l, { karma: 1 }); } },
      { k: 'toy', l: 'Tự mua đồ chơi', run: function (l, r, log) { log('Mua ngay khẩu súng nước, bộ lego mơ ước.', 'good'); fx(l, { hap: 4 }); } },
      { k: 'piggy', l: 'Bỏ vào heo đất', run: function (l, r, log) { l.flags.piggy = (l.flags.piggy || 0) + 1; log('Nhét tiền lì xì vào con heo đất.', 'good'); fx(l, { kno: 1 }); } }
    ]
  });
  CT('li_xi', function (l, a) { return isVN(l) && a >= 5 && a <= 14; }, 3);
  EV(function (l, a) { return a === 18 && l.flags.piggy; }, 1, function (l, a, r, log) {
    var x = 0.02 * l.flags.piggy; l.flags.piggy = 0;
    H.cash(l, x * l.base, 'Đập heo đất'); log('Đập con heo đất nuôi từ bé, đếm được ' + mb(l, x) + '.', 'good'); H.mem(l, 'Ngày đập con heo đất nuôi từ thuở bé.', 2);
  });

  SC('bi_lac', {
    title: 'Lạc mẹ giữa chợ phiên', text: 'Chợ phiên đông nghịt người. Bạn mải nhìn hàng kẹo bông, quay lại thì không thấy mẹ đâu.',
    opts: [
      { k: 'stay', l: 'Đứng yên tại chỗ chờ mẹ', run: function (l, r, log) { log('Đứng yên khóc thút thít, mười phút sau mẹ hớt hải chạy tới.', 'neutral'); H.mem(l, 'Lần lạc mẹ ở chợ phiên, vòng tay mẹ siết chặt.', 3); } },
      { k: 'ask', l: 'Nhờ chú công an / cô bán hàng', run: function (l, r, log) { log('Nhờ cô bán hàng gọi loa tìm mẹ. Cô còn cho cây kẹo bông.', 'good'); fx(l, { kno: 1, soc: 1 }); } },
      { k: 'search', l: 'Tự đi tìm', run: function (l, r, log) { if (ch(r, 0.2)) { log('Đi lạc xa hơn, đến tối mới được người dân đưa về.', 'bad'); fx(l, { hap: -4 }); H.mem(l, 'Buổi chiều đi lạc, trời tối dần mà không thấy nhà.', 4); } else log('Lang thang một lúc rồi cũng tìm thấy mẹ.', 'neutral'); } }
    ]
  });
  CT('bi_lac', function (l, a) { return a >= 3 && a <= 7; }, 99, 0.5);

  // các tình huống học trò có sẵn cũng tham gia nhịp tuổi thơ
  E.TRIG.forEach(function (t) { if (['net_coi', 'bat_nat', 'quay_cop', 'to_tinh', 'phat_hien', 'nghi_hoc_ngheo', 'bo_say', 'chu_no', 'concert'].indexOf(t.id) >= 0) t.child = true; });

  // =====================================================================
  // HÀNH ĐỘNG CHỦ ĐỘNG (bảng "Việc bạn muốn làm")
  // =====================================================================
  var G1 = 'Tình cảm', G2 = 'Học tập', G3 = 'Công việc', G4 = 'Tiền bạc', G5 = 'Giải trí', G6 = 'Sức khỏe & tâm hồn', G7 = 'Gia đình & bạn bè', G8 = 'Đường tối';
  A('tim_nguoi_yeu', G1, 'Tìm người yêu', { min: 16, avail: function (l) { return l.partner ? 'Bạn đang có người yêu' : true; }, ai: { w: 0.6, soc: 1 } });
  A('hen_ho', G1, 'Hẹn hò lãng mạn', { min: 16, avail: function (l) { return l.partner ? true : 'Chưa có người yêu'; }, ai: { w: 0.4 } });
  A('cau_hon', G1, 'Cầu hôn / về chung nhà', { min: 18, sc: 'marry', avail: function (l) { return l.partner && l.partner.status === 'dating' ? true : 'Cần đang hẹn hò'; }, ai: { w: 0.5 } });
  A('sinh_con', G1, 'Sinh con / nhận con nuôi', { min: 18, max: 55, sc: 'kid', avail: function (l) { return l.partner && l.partner.status !== 'dating' ? true : 'Cần đã kết hôn / chung sống'; }, ai: { w: 0.3 } });
  A('ly_hon', G1, 'Ly hôn / chia tay', { min: 18, sc: 'divorce', avail: function (l) { return l.partner && l.partner.status !== 'dating' ? true : 'Chưa kết hôn'; } });
  A('bang_lai', G2, 'Thi bằng lái xe', { min: 18, avail: function (l) { return l.lic.A1 && l.lic.B ? 'Đã có đủ bằng' : true; }, ai: { w: 0.5, smart: 0.5 } });
  A('hoc_them', G2, 'Học chứng chỉ (ngoại ngữ, tin học…)', { min: 15, sc: 'hoc_them', avail: function (l) { return l.money > -l.base ? true : 'Không đủ tiền'; }, ai: { w: 0.06, smart: 1, amb: 1 } });
  A('tim_viec', G3, 'Tìm việc / nhảy việc', { min: 15, sc: 'job', avail: function (l) { return l.school ? 'Đang đi học' : l.abroad && !l.abroad.perm ? 'Đang ở nước ngoài theo hợp đồng' : true; }, arg: null });
  A('tang_luong', G3, 'Xin tăng lương', { min: 16, avail: function (l) { return l.job && !E.jobDef(l).fame && E.jobDef(l).sec !== 'crime' ? true : 'Không áp dụng'; }, ai: { w: 0.2, amb: 1 } });
  A('nghi_viec', G3, 'Nghỉ việc', { min: 15, avail: function (l) { return l.job ? true : 'Chưa có việc'; } });
  A('khoi_nghiep', G3, 'Khởi nghiệp / kinh doanh', { min: 20, sc: 'biz', avail: function (l) { return l.money > l.base * 0.8 ? true : 'Cần ít nhất ' + mb(l, 0.8) + ' vốn'; }, ai: { w: 0.15, risk: 1, amb: 1 } });
  A('mua_xe', G4, 'Mua xe', { min: 16, ai: { w: 0.4 }, avail: function (l) { return l.veh === 'ô tô' ? 'Đã có ô tô' : true; } });
  A('mua_nha', G4, 'Mua nhà', { min: 22, sc: 'house', avail: function (l) { return l.ownHouse ? 'Đã có nhà' : !l.indep ? 'Chưa tự lập' : true; } });
  A('vay_tien', G4, 'Vay tiền', { min: 18, ai: function (l) { return l.age >= 65 ? 0 : H.aiW(l, { w: 0.08, risk: 1 }); } });
  A('tra_no', G4, 'Trả nợ', { min: 18, avail: function (l) { return H.debtTotal(l) > 0.5 ? (l.money > 0 ? true : 'Không có tiền mặt') : 'Không có nợ'; }, ai: { w: 1.5 } });
  A('dau_tu', G4, 'Đầu tư', { min: 18, avail: function (l) { return l.money > l.base * 0.3 ? true : 'Cần có tiền nhàn rỗi'; }, ai: { w: 0.3, risk: 0.8 } });
  A('ve_so', G4, 'Mua vé số', { min: 18, ai: { w: 0.15 } });
  A('chi_tieu', G4, 'Đổi cách chi tiêu', { min: 18, avail: function (l) { return l.indep ? true : 'Chưa tự lập'; } });
  A('gui_bo_me', G4, 'Phụng dưỡng bố mẹ', { min: 18, avail: function (l) { return (l.fam.mAlive || l.fam.fAlive) && l.indep ? true : 'Không áp dụng'; } });
  A('concert', G5, 'Đi concert thần tượng', { min: 12, max: 55, ai: { w: 0.2, fun: 1 } });
  A('du_lich', G5, 'Đi du lịch', { min: 16, sc: 'du_lich', avail: function (l) { return l.money > l.base * 0.05 ? true : 'Không đủ tiền'; }, ai: { w: 0.3 } });
  A('di_net', G5, 'Ra quán net chơi game', { min: 8, max: 30, sc: 'net_coi', avail: function (l) { return isVN(l) ? true : 'Không áp dụng'; } });
  A('di_nhau', G5, 'Đi nhậu với bạn bè', { min: 18, sc: 'di_nhau', ai: { w: 0.15, soc: 1 } });
  A('kham', G6, 'Khám sức khỏe', { min: 16, ai: { w: 0.3 } });
  A('tap_gym', G6, 'Tập thể dục đều đặn', { min: 12, sc: 'tap_gym', avail: function (l) { return l.flags.exercise ? 'Đang tập đều rồi' : true; }, ai: { w: 0.3 } });
  A('bo_thuoc', G6, 'Cai thuốc lá / rượu', { min: 14, sc: 'cai_nghien', avail: function (l) { return l.flags.smoke || (l.addict && (l.addict.alcohol || l.addict.drugs || l.addict.gamble)) ? true : 'Không có thói quen xấu'; }, ai: { w: 0.8 } });
  A('tu_thien', G6, 'Làm việc thiện', { min: 14, ai: { w: 0.15 } });
  A('di_chua', G6, 'Đi chùa / nhà thờ, tĩnh tâm', { min: 8, sc: 'di_chua' });
  A('tham_bo_me', G7, 'Về thăm bố mẹ', { min: 18, sc: 'tham_bo_me', avail: function (l) { return (l.fam.mAlive || l.fam.fAlive) ? true : 'Bố mẹ đã khuất'; } });
  A('gap_ban', G7, 'Hẹn gặp bạn thân', { min: 10, sc: 'gap_ban', avail: function (l) { return bff(l) ? true : 'Không có bạn thân'; } });
  var G9 = 'Thú cưng';
  A('nuoi_pet', G9, 'Nuôi thú cưng', { min: 6, avail: function (l) { return H.pets(l).length >= 3 ? 'Nhà đã có 3 thú cưng' : l.jailUntil != null && l.age < l.jailUntil ? 'Không áp dụng' : true; }, ai: { w: 0.1 } });
  A('choi_pet', G9, 'Chơi với thú cưng', { min: 6, avail: function (l) { return H.pets(l).length ? true : 'Chưa có thú cưng'; }, ai: { w: 0.25 } });
  A('kiem_tien_ban', G8, 'Kiếm tiền bất chính', { min: 16, ai: { w: 0.04, bad: 2 } });
  A('ca_do_act', G8, 'Cá độ / đánh bạc', { min: 16, sc: 'ca_do', ai: { w: 0.04, risk: 1.5, bad: 1 } });

  // v2.4: chứng chỉ ngoại ngữ theo nơi định đến: IELTS (chung), JLPT N5→N1 (Nhật), TOPIK 1→6 (Hàn), HSK 1→6 (Trung/Đài), Goethe A1→C1 (Đức)
  SC('hoc_them', {
    title: 'Học thêm chứng chỉ',
    prep: function (l, r) { var c = H.langCtx(l) || pick(r, ['ja', 'ko', 'zh']); return { ctx: c }; },
    text: function (l, d) {
      var have = Object.keys(H.LANG).filter(function (k) { return (l.lang || {})[k] > 0; }).map(function (k) { return H.langCert(l, k); });
      var why = l.abroad && !l.abroad.perm ? 'Đang ở ' + l.abroad.name + ', biết tiếng bản xứ thì lương và cơ hội khác hẳn. ' : H.langCtx(l) ? 'Bạn đang tính chuyện sang ' + H.LANG[H.langCtx(l)].land + '. ' : '';
      return why + 'Học thêm một chứng chỉ giúp hồ sơ đẹp hơn, nhưng tốn khoảng ' + mb(l, 0.04) + ' và nhiều buổi tối.' + (have.length ? ' Hiện bạn có: ' + have.join(', ') + '.' : '');
    },
    opts: [
      { k: 'lang', l: function (l, d) { return H.langLabel(l, d.ctx); }, req: function (l, d) { return H.langNext(l, d.ctx) != null; }, ai: { w: 1.3, smart: 1 }, run: function (l, r, log, d) { H.studyLang(l, d.ctx, r, log); } },
      { k: 'ielts', l: function (l) { return H.langLabel(l, 'en'); }, req: function (l, d) { return d.ctx !== 'en' && H.langNext(l, 'en') != null; }, run: function (l, r, log) { H.studyLang(l, 'en', r, log); } },
      { k: 'it', l: 'Học tin học / kỹ năng số', run: function (l, r, log) { cashB(l, -0.03, 'Học tin học'); l.uniTier = (l.uniTier || 1) + 0.03; log('Thành thạo thêm kỹ năng số.', 'good'); fx(l, { kno: 3 }); } },
      { k: 'degree', l: 'Học liên thông / văn bằng 2 buổi tối', req: function (l) { return l.edu >= 3 && l.edu < 6 && l.age >= 20; }, ai: { w: 0.15, amb: 1 }, run: function (l, r, log) { cashB(l, -0.15, 'Học văn bằng 2'); H.sched(l, 'xong_van_bang', 3); log('Đăng ký học văn bằng 2 buổi tối — 3 năm vừa học vừa làm.', 'neutral'); fx(l, { hea: -2 }); } }
    ]
  });
  SC('xong_van_bang', {
    title: 'Nhận bằng', text: 'Sau 3 năm vừa học vừa làm, bạn hoàn thành chương trình.',
    opts: [{ k: 'ok', l: 'Nhận bằng', run: function (l, r, log) { l.edu = Math.min(6, Math.max(l.edu, l.edu >= 5 ? 6 : 5)); if (!l.major) l.major = pick(r, ['eco', 'it', 'law']); log('Nhận bằng ' + E.EDU[l.edu] + ' sau những năm tháng vừa học vừa làm.', 'big'); fx(l, { hap: 8 }); H.mem(l, 'Ngày nhận tấm bằng học buổi tối, tay ôm hoa mà mắt cay cay.', 4); if (l.job) l.flags.upgradeJob = true; } }]
  });
  SC('du_lich', {
    title: 'Đi du lịch', prep: function (l, r) {
      var far = ['Thái Lan', 'Hàn Quốc', 'Nhật Bản', 'Singapore', 'châu Âu', 'Đài Loan', 'Úc', 'Hoa Kỳ'];
      if (l.abroad && l.abroad.perm) far = far.filter(function (x) { return x !== l.abroad.name; });
      // ưu tiên nơi chưa từng đến, nhưng thỉnh thoảng vẫn muốn quay lại chốn cũ
      var fresh = far.filter(function (x) { return !H.visited(l, x); });
      return { near: isVN(l) ? pick(r, ['Đà Lạt', 'Phú Quốc', 'Sa Pa', 'Hội An', 'Hạ Long', 'Nha Trang', 'Hà Giang', 'Côn Đảo']) : 'một thành phố biển', far: pick(r, fresh.length && r() < 0.75 ? fresh : far) };
    },
    text: 'Bạn muốn xách ba lô lên và đi.',
    opts: [
      { k: 'near', l: function (l, d) { return 'Đi ' + d.near; }, h: function (l) { return mb(l, 0.05); }, run: function (l, r, log, d) { cashB(l, -0.05, 'Du lịch'); log('Chuyến đi ' + d.near + (l.partner ? ' cùng ' + pw(l) : '') + '.', 'good'); fx(l, { hap: 6 }); if (ch(r, 0.3)) H.mem(l, 'Hoàng hôn ở ' + d.near + '.', 3); } },
      { k: 'far', l: function (l, d) { return (H.visited(l, d.far) ? 'Quay lại ' : 'Đi ') + d.far; }, h: function (l) { return mb(l, 0.25); }, req: function (l) { return l.money > l.base * 0.25; }, run: function (l, r, log, d) {
        cashB(l, -0.25, 'Du lịch nước ngoài'); var again = H.visited(l, d.far); H.visit(l, d.far);
        if (again) { log(pick(r, ['Quay lại ' + d.far + ', lần này đi như một du khách thật sự.', 'Trở lại ' + d.far + ' sau nhiều năm, thấy cảnh cũ mà lòng bồi hồi.', 'Lại một chuyến ' + d.far + (l.partner ? ' cùng ' + pw(l) : '') + ', ghé thăm những chỗ quen.']), 'good'); fx(l, { hap: 8, kno: 1 }); if (ch(r, 0.3)) H.mem(l, 'Chuyến trở lại ' + d.far + '.', 3); }
        else { log('Lần đầu đặt chân đến ' + d.far + '.', 'good'); fx(l, { hap: 10, kno: 2 }); H.mem(l, 'Chuyến đi ' + d.far + ' — thế giới hóa ra rộng lớn đến thế.', 4); }
      } }
    ]
  });
  SC('di_nhau', {
    title: 'Cuộc nhậu', text: 'Đám bạn hú đi nhậu: "Không say không về!"',
    opts: [
      { k: 'drink', l: 'Nhậu tới bến, tự lái xe về', ai: { risk: 1.4, soc: 0.6 }, run: function (l, r, log) { cashB(l, -0.01, 'Đi nhậu'); fx(l, { hea: -3, hap: 3, soc: 3 }); if (ch(r, 0.12)) { l.addict.alcohol = true; log('Những cuộc nhậu ngày một dày, bạn bắt đầu nghiện rượu.', 'bad'); } if (vehicle(l) && ch(r, 0.25)) { l.addict.alcoholTmp = true; H.chain(l, 'csgt', { why: 'có nồng độ cồn khi lái xe', f: l.veh === 'ô tô' ? 35 : 7 }); } else if (vehicle(l) && ch(r, 0.04)) { if (ch(r, 0.15)) { H.kill(l, 'tai nạn giao thông do say rượu', log, true); return; } log('Say rượu lái xe, đâm vào gốc cây.', 'bad'); fx(l, { hea: -18 }); } else log('Một cuộc nhậu vui, sáng ra đau đầu như búa bổ.', 'neutral'); } },
      { k: 'grab', l: 'Nhậu xong gọi xe về', ai: { w: 1.2 }, run: function (l, r, log) { cashB(l, -0.015, 'Đi nhậu'); fx(l, { hea: -2, hap: 3, soc: 3 }); log('Nhậu vui, gọi xe về an toàn. "Đã uống rượu bia, không lái xe."', 'good'); } },
      { k: 'no', l: 'Từ chối, về nhà sớm', ai: { w: 0.8 }, run: function (l, r, log) { log('Về nhà sớm ăn cơm cùng gia đình.', 'good'); fx(l, { soc: -1 }); } }
    ]
  });
  T('di_nhau', function (l, a) { return a >= 18 && a <= 65 && l.sex === 'M' && isVN(l) && free(l); }, 0.06);
  SC('tap_gym', { title: 'Rèn luyện sức khỏe', text: 'Bạn muốn khỏe hơn.', opts: [
    { k: 'gym', l: 'Đăng ký phòng tập', h: function (l) { return mb(l, 0.03) + '/năm'; }, run: function (l, r, log) { cashB(l, -0.03, 'Phòng tập'); if (ch(r, 0.6)) { l.flags.exercise = true; log('Tập đều đặn — người khỏe ra trông thấy.', 'good'); fx(l, { hea: 6, hap: 3 }); } else { log('Đóng tiền phòng tập rồi… đi được ba buổi.', 'neutral'); } } },
    { k: 'run', l: 'Chạy bộ / đạp xe mỗi sáng', run: function (l, r, log) { l.flags.exercise = true; log('Sáng nào cũng chạy bộ quanh hồ.', 'good'); fx(l, { hea: 5 }); } }
  ] });
  SC('cai_nghien', { title: 'Từ bỏ thói quen xấu', text: 'Bạn muốn bỏ những thứ đang hủy hoại mình.', opts: [
    { k: 'smoke', l: 'Bỏ thuốc lá', req: function (l) { return l.flags.smoke; }, run: function (l, r, log) { if (ch(r, 0.45)) { l.flags.smoke = false; l.flags.noSmoke = true; log('Bỏ được thuốc lá!', 'good'); fx(l, { hea: 5 }); } else log('Bỏ được ba tuần rồi lại hút.', 'bad'); } },
    { k: 'alcohol', l: 'Bỏ rượu', req: function (l) { return l.addict && l.addict.alcohol; }, run: function (l, r, log) { if (ch(r, 0.4)) { l.addict.alcohol = false; log('Bỏ được rượu. Gia đình mừng rơi nước mắt.', 'good'); fx(l, { hea: 5, hap: 5 }); H.mem(l, 'Ngày đổ chai rượu cuối cùng xuống cống.', 4); } else log('Cai rượu thất bại.', 'bad'); } },
    { k: 'drugs', l: 'Vào trại cai nghiện ma túy', req: function (l) { return l.addict && l.addict.drugs; }, run: function (l, r, log) { cashB(l, -0.1, 'Cai nghiện'); if (ch(r, 0.35)) { l.addict.drugs = false; log('Cai nghiện thành công sau một năm trong trại.', 'good'); fx(l, { hea: 8, hap: 8, karma: 6 }); H.mem(l, 'Ngày bước ra khỏi trại cai nghiện, sạch sẽ.', 7); } else log('Tái nghiện sau khi ra trại.', 'bad'); } },
    { k: 'gamble', l: 'Cai cờ bạc', req: function (l) { return l.addict && l.addict.gamble; }, run: function (l, r, log) { if (ch(r, 0.4)) { l.addict.gamble = false; log('Bỏ được cờ bạc.', 'good'); fx(l, { hap: 6 }); } else log('Lại sa vào cờ bạc.', 'bad'); } }
  ] });
  SC('di_chua', { title: 'Tĩnh tâm', text: function (l) { return /Phật/.test(l.religion) ? 'Bạn lên chùa thắp hương, nghe sư thầy giảng.' : /Kitô|Công giáo|Tin Lành|Chính Thống/.test(l.religion) ? 'Bạn đến nhà thờ dự lễ.' : /Hồi/.test(l.religion) ? 'Bạn đến thánh đường cầu nguyện.' : 'Bạn ngồi lặng trước bàn thờ tổ tiên.'; }, opts: [
    { k: 'ok', l: 'Cầu bình an cho gia đình', run: function (l, r, log) { log('Lòng thấy nhẹ nhõm, bình yên hơn.', 'good'); fx(l, { hap: 4, karma: 1 }); } }
  ] });
  // v2.4: chỉ nhắc đến người còn sống (trước đây bố đã mất vẫn "khoe cây cảnh")
  SC('tham_bo_me', { title: 'Về thăm nhà', valid: function (l) { return !!parentsWord(l); },
    text: function (l) { var a = l.age, f = l.fam, pw0 = parentsWord(l); return U.cap(pw0) + ' giờ đã ' + (f.mAlive && f.fAlive ? (f.mAge + a) + ' và ' + (f.fAge + a) : f.mAlive ? (f.mAge + a) : (f.fAge + a)) + ' tuổi' + (pw0 === 'bố mẹ' ? '' : ', ở một mình từ ngày ' + (f.mAlive ? 'bố' : 'mẹ') + ' mất') + '. Lâu rồi bạn chưa về.'; },
    opts: [
      { k: 'go', l: function (l) { return 'Về ăn cơm với ' + parentsWord(l); }, run: function (l, r, log) {
        var f = l.fam, pw0 = parentsWord(l); cashB(l, -0.01, 'Về quê thăm ' + pw0);
        var pool = ['Cả nhà ngồi xem tivi như hồi bạn còn nhỏ.'];
        if (f.mAlive) pool.push('Mẹ nấu đúng món bạn thích từ bé.', 'Thấy tóc mẹ bạc thêm nhiều, bạn chợt lặng người.');
        if (f.fAlive) pool.push('Bố khoe mấy cây cảnh mới trồng.', 'Bố rót chén trà, hỏi han chuyện công việc của bạn.');
        if (pw0 !== 'bố mẹ') pool.push('Thắp nén hương lên bàn thờ ' + (f.mAlive ? 'bố' : 'mẹ') + ', căn nhà vắng hơn xưa nhiều.', U.cap(pw0) + ' cứ giữ tay bạn mãi, dặn năng về hơn.');
        var t = pick(r, pool); log('Về thăm ' + pw0 + '. ' + t, 'good'); fx(l, { hap: 6, soc: 3, karma: 2 }); H.mem(l, t, 3);
      } }
    ] });
  SC('gap_ban', { title: 'Gặp bạn cũ', text: function (l) { return 'Hẹn ' + l.bff.name + ' ra quán cũ ngồi.'; }, opts: [
    { k: 'go', l: 'Đi ngay', run: function (l, r, log) { l.bff.close += 6; var t = pick(r, ['Hai đứa ngồi kể chuyện ngày xưa đến khuya.', 'Cười ngặt nghẽo khi nhắc lại những trò nghịch dại hồi bé.', 'Kể cho nhau nghe những chuyện chưa từng kể với ai.']); log('Gặp ' + l.bff.name + '. ' + t, 'good'); fx(l, { hap: 6, soc: 5 }); if (ch(r, 0.3)) H.mem(l, 'Buổi tối ngồi với ' + l.bff.name + ' ở quán cũ. ' + t, 3); } }
  ] });

  // =====================================================================
  // MỘT DÒNG MỖI NĂM — để năm nào cũng có câu chuyện
  // =====================================================================
  L(function (l, a, r) {
    if (a === 0) return '';
    if (a === 2) return pick(r, ['Bập bẹ nói, suốt ngày lẽo đẽo theo mẹ.', 'Thích nhất là được bố công kênh trên vai.']);
    if (a === 4) return pick(r, ['Mê nghe bà kể chuyện cổ tích trước khi ngủ.', 'Lần đầu tự xúc cơm ăn, vương vãi khắp nhà.']);
    if (a === 5) return pick(r, ['Chuẩn bị vào lớp Một, háo hức xếp sách vở mới.', 'Theo bố ra đồng thả diều mỗi chiều.']);
    return '';
  });
  L(function (l, a, r) {
    if (!l.school || a < 6 || a > 17) return '';
    var g = a - 5;
    var arr = { 1: 'Năm lớp 1: tập đánh vần từng chữ, nắn nót từng nét.', 2: 'Năm lớp 2: thuộc bảng cửu chương sau bao lần bị cô gọi lên bảng.', 3: 'Năm lớp 3: được làm tổ trưởng, oai lắm.', 4: 'Năm lớp 4: mê truyện tranh, giấu dưới gầm bàn đọc lén.', 5: 'Năm lớp 5: chia tay bạn bè tiểu học, ghi lưu bút đầy cả cuốn sổ.',
      6: 'Năm lớp 6: bỡ ngỡ ngôi trường mới, bạn bè mới.', 7: 'Năm lớp 7: bắt đầu biết để ý đến vẻ ngoài của mình.', 8: 'Năm lớp 8: học thêm triền miên, sáng chiều tối.', 9: 'Năm lớp 9: ôn thi vào lớp 10 đến khuya.',
      10: 'Năm lớp 10: những ngày đầu cấp ba, mọi thứ thật mới mẻ.', 11: 'Năm lớp 11: những buổi chiều cúp tiết trốn ra quán trà đá.', 12: 'Năm lớp 12: ôn thi, viết lưu bút, khóc trong lễ tri ân.' }[g];
    if (!isVN(l)) return 'Một năm đi học bình thường.';
    return arr || '';
  });
  L(function (l, a, r) {
    if (l.school === 'uni' || l.school === 'abroad') return pick(r, ['Một năm đại học: giảng đường, thư viện, những đêm thức trắng chạy deadline.', 'Đi làm thêm buổi tối để đỡ tiền ăn học.', 'Ký túc xá chật chội nhưng đầy ắp tiếng cười.']);
    if (l.school === 'police') return 'Một năm rèn luyện nghiêm khắc trong trường công an / quân đội.';
    if (l.school === 'voc') return 'Một năm học nghề, tay chân lấm lem dầu mỡ nhưng thấy mình có ích.';
    return '';
  });
  L(function (l, a, r) {
    if (!l.job) return '';
    var c = E.jobDef(l);
    var t = E.jobTitle(l);
    var lines = {
      poor: ['Một năm nữa mưu sinh với nghề ' + t + ', nắng mưa chẳng quản.', 'Ngày làm, tối về đếm từng đồng.'],
      farm: ['Một mùa vụ nữa trôi qua, ruộng đồng nắng gió.', 'Năm nay được mùa, giá lúa lại rẻ.'],
      worker: ['Ca sáng, ca đêm nối nhau ở xưởng.', 'Một năm tăng ca đều đặn, lưng bắt đầu đau mỏi.'],
      office: ['Một năm họp hành, deadline, cà phê sáng với đồng nghiệp.', 'Kẹt xe mỗi sáng, chạy KPI mỗi tháng.'],
      sale: ['Một năm chạy doanh số, có tháng thưởng đậm, có tháng trắng tay.'],
      med: ['Những ca trực đêm ở bệnh viện, thấy đủ sinh ly tử biệt.'],
      uniform: ['Một năm làm nhiệm vụ, kỷ luật và vất vả.'],
      edu: ['Thêm một khóa học trò ra trường, có đứa về thăm thầy cô.'],
      creator: ['Quay, dựng, đăng video — vòng lặp không hồi kết.'],
      show: ['Chạy show, tập luyện, xuất hiện trước ống kính.'],
      crime: ['Một năm làm ăn mờ ám, ngủ không yên giấc.'],
      biz: ['Một năm buôn bán, lúc lời lúc lỗ.']
    }[c.cat] || ['Một năm làm việc bình thường.'];
    return pick(r, lines);
  });
  L(function (l, a, r) {
    if (l.retired) return pick(r, ['Sáng tưới cây, chiều đánh cờ với hàng xóm.', 'Một năm thong thả tuổi già, cà phê sáng với mấy ông bạn cũ.', 'Ngồi hiên nhà nhìn lũ trẻ trong xóm chơi đùa.', 'Tập dưỡng sinh mỗi sáng ở công viên.']);
    if (a >= 18 && !l.job && !l.school) return pick(r, ['Một năm chật vật tìm việc.', 'Thất nghiệp, ngày nào cũng lướt tin tuyển dụng.', 'Sống nhờ vào những việc lặt vặt.']);
    return '';
  });
  L(function (l, a, r) {
    if (a < 6) return pick(r, ['Một năm thơ ấu bình yên bên bố mẹ.', 'Lớn thêm một tuổi, nghịch ngợm hơn một chút.', 'Suốt ngày chạy nhảy quanh xóm với lũ trẻ con.']);
    if (a < 18) return pick(r, ['Một năm tuổi học trò trôi qua lặng lẽ.', 'Phụ giúp việc nhà, chiều chiều đá bóng, nhảy dây với bạn.', 'Lớn thêm một chút, bắt đầu có những suy nghĩ của riêng mình.']);
    return pick(r, ['Một năm bình lặng trôi qua.', 'Ngày tháng cứ thế trôi, không có gì đặc biệt.', 'Một năm nữa, cơm áo gạo tiền.']);
  });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
