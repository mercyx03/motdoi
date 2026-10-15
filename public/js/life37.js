/* Một Đời — v3.7: LGBT+ (góp ý của người chơi)
   · tạo nhân vật: Bột tôm (đồng tính nam – bottom), Tóp mỡ (đồng tính nam – top), Bé Liên (đồng tính nữ), Bi (song tính)
   · tuổi thơ như mọi bạn khác; khoảng 12–13 tuổi nhận ra mình rung động với ai
   · tình huống: thầm thương bạn cùng lớp, nói với bạn thân, bố mẹ giục cưới, đi VietPride, ra mắt người yêu cùng giới với gia đình,
     về chung một nhà, hàng xóm / chủ nhà dò hỏi, hội bạn trêu "ai là tóp mỡ, ai là bột tôm", bị hiểu lầm "song tính là chưa quyết định"…
   Nhân vật và tình huống đều hư cấu, viết với tinh thần tôn trọng. */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function fx(l, o) { H.fx(l, o); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function lg(l) { return l.orient !== 'straight' && l.realized; }
  function gayM(l) { return l.orient === 'gay' && l.sex === 'M'; }
  function same(l) { return !!(l.partner && l.partner.sex === l.sex); }
  function T(id, when, p, cd, max) { E.TRIG.push({ id: id, when: function (l, a) { return free(l) && when(l, a); }, p: p, cd: cd || 4, max: max || 1 }); }
  function pa(l) { return l.fam.mAlive && l.fam.fAlive ? 'bố mẹ' : l.fam.mAlive ? 'mẹ' : l.fam.fAlive ? 'bố' : 'họ hàng'; }

  // ---------- nhận ra mình (khoảng 12–13 tuổi) ----------
  E.realizeText = function (l, r) {
    var cls = l.school ? 'cùng lớp' : 'trong xóm';
    if (l.orient === 'bi') return pick(r, ['Năm ' + l.age + ' tuổi, bạn nhận ra mình có thể rung động với cả bạn nam lẫn bạn nữ — thích ai là thích con người ấy.', 'Bạn bối rối khi thấy mình vừa để ý một bạn nam ' + cls + ', vừa thấy tim đập nhanh khi cô bạn ngồi cạnh cười. Hóa ra mình thích được cả hai.']);
    if (l.sex === 'F') return pick(r, ['Năm ' + l.age + ' tuổi, bạn nhận ra mình rung động với cô bạn ' + cls + ' chứ không phải mấy bạn nam như đám bạn gái hay bàn tán.', 'Cả lớp gán ghép bạn với một bạn nam, nhưng người khiến bạn đỏ mặt lại là cô bạn thân.']);
    if (l.role === 'top') return pick(r, ['Năm ' + l.age + ' tuổi, bạn nhận ra mình để ý một bạn nam ' + cls + ' — lúc nào cũng muốn đứng ra che chắn, lo lắng cho cậu ấy.', 'Đám con trai bàn tán về con gái, còn bạn chỉ để ý cậu bạn hiền lành bàn bên — muốn làm "chỗ dựa" cho cậu ấy.']);
    return pick(r, ['Năm ' + l.age + ' tuổi, bạn nhận ra mình hay để ý một bạn nam ' + cls + ' — tim đập nhanh mỗi lần cậu ấy hỏi han, thích được cậu ấy quan tâm.', 'Đám con trai bàn tán về con gái, còn bạn chỉ để ý anh lớp trên đá bóng giỏi, thích được anh ấy chở đi học.']);
  };

  // ---------- người yêu đồng tính nam: tóp mỡ – bột tôm thường bổ sung cho nhau ----------
  var lm0 = E.DEC.love.make, la0 = E.DEC.love.apply;
  E.DEC.love.make = function (l, r) {
    var d = lm0.apply(this, arguments), p = d.data.p;
    if (p.sex === 'M' && l.sex === 'M' && l.orient !== 'straight') p.role = l.role === 'top' ? (r() < 0.8 ? 'bot' : 'top') : l.role === 'bot' ? (r() < 0.8 ? 'top' : 'bot') : (r() < 0.5 ? 'top' : 'bot');
    return d;
  };
  E.DEC.love.apply = function (l, d, k) { var x = la0.apply(this, arguments); if (k === 'yes' && l.partner && d.data.p.role) l.partner.role = d.data.p.role; return x; };

  // ---------- tình huống ----------
  SC('lg_crush', {
    title: 'Thầm thương', prep: function (l, r) { var s = l.orient === 'bi' ? (r() < 0.5 ? 'M' : 'F') : l.sex; return { s: s, n: H.stranger(l, r, s) }; },
    text: function (l, d) { return 'Bạn thầm thương ' + d.n + ' — ' + (d.s === l.sex ? 'một bạn cùng giới' : 'một bạn khác giới') + ' ' + (l.school ? 'học cùng trường' : 'ở gần nhà') + '. Ngày nào cũng tìm cớ đi chung đường, nhưng không biết ' + d.n + ' có giống mình không.'; },
    valid: function (l) { return !l.partner; },
    opts: [
      { k: 'noi', l: 'Lấy hết can đảm nói ra', ai: { risk: 0.8, soc: 0.6 }, run: function (l, r, log, d) { if (d.s !== l.sex ? ch(r, 0.45) : ch(r, 0.3)) { log(d.n + ' đỏ mặt rồi gật đầu: "Tớ cũng thế." Mối tình đầu vụng về mà ngọt ngào.', 'good'); fx(l, { hap: 8 }); if (!l.flags.firstLove) l.flags.firstLove = d.n; H.mem(l, 'Lời tỏ tình run rẩy với ' + d.n + '.', 5); } else if (d.s === l.sex && ch(r, 0.5)) { log(d.n + ' bất ngờ nhưng nhẹ nhàng: "Mình chỉ coi bạn là bạn thôi, nhưng mình sẽ giữ bí mật." Bạn buồn mà nhẹ lòng.', 'neutral'); fx(l, { hap: -2 }); } else { log(d.n + ' từ chối, rồi chuyện lan ra cả lớp. Mấy tuần đó bạn chẳng muốn đến trường.', 'bad'); fx(l, { hap: -8 }); if (l.mind) l.mind.stress += 10; } } },
      { k: 'giu', l: 'Giữ kín trong lòng', ai: { w: 1.2 }, run: function (l, r, log, d) { log('Giữ kín tình cảm với ' + d.n + '. Có những bí mật tuổi học trò chỉ mình mình biết.', 'neutral'); H.mem(l, 'Mối tình thầm lặng với ' + d.n + '.', 3); } }
    ]
  });
  T('lg_crush', function (l, a) { return lg(l) && a >= 13 && a <= 18 && !l.partner; }, 0.35, 4, 1);

  SC('lg_ban_than', {
    title: 'Nói với bạn thân', valid: function (l) { return !!(l.bff && l.bff.alive); },
    text: function (l) { return 'Bạn muốn nói với ' + l.bff.name + ' — người bạn thân nhất — rằng mình là ' + E.orientLabel(l).toLowerCase() + '.'; },
    opts: [
      { k: 'noi', l: 'Nói thật', ai: { soc: 1, w: 1 }, run: function (l, r, log) { if (ch(r, 0.78)) { log(l.bff.name + ' ôm bạn: "Mày là mày, tao quý mày vì mày là mày." Từ đó hai đứa càng thân.', 'good'); fx(l, { hap: 6 }); l.bff.close = Math.min(100, (l.bff.close || 60) + 15); H.mem(l, 'Ngày nói thật với ' + l.bff.name + ' và nhận lại một cái ôm.', 4); } else { log(l.bff.name + ' im lặng mấy ngày, rồi xa dần. Bạn buồn nhưng không hối hận vì đã sống thật.', 'bad'); l.bff.close = Math.max(0, (l.bff.close || 60) - 30); fx(l, { hap: -5 }); } } },
      { k: 'chua', l: 'Chưa sẵn sàng', ai: { w: 0.8 }, run: function (l, r, log) { log('Định nói rồi lại thôi.', 'neutral'); } }
    ]
  });
  T('lg_ban_than', function (l, a) { return lg(l) && a >= 14 && a <= 30 && !!(l.bff && l.bff.alive); }, 0.15, 5, 1);

  SC('lg_pride', {
    title: 'Ngày hội tự hào',
    text: function (l) { return isVN(l) && !(l.abroad && l.abroad.perm) ? 'Cuối tuần này có ngày hội VietPride: đạp xe diễu hành, hội thảo, âm nhạc, ai cũng mang cờ cầu vồng. Hội bạn rủ bạn đi cùng.' : 'Thành phố tổ chức lễ diễu hành Pride, cả con phố rợp cờ cầu vồng. Bạn bè rủ bạn đi cùng.'; },
    opts: [
      { k: 'di', l: 'Đi cùng hội bạn', ai: { soc: 1, w: 1.2 }, run: function (l, r, log) { log('Hòa vào dòng người diễu hành, lần đầu thấy mình không hề lạc lõng. Quen thêm nhiều bạn mới.', 'good'); fx(l, { hap: 8, soc: 5 }); if (l.mind) l.mind.stress = Math.max(0, l.mind.stress - 8); H.mem(l, 'Ngày hội cầu vồng, cả một biển người mỉm cười với nhau.', 4); } },
      { k: 'xem', l: 'Chỉ xem livestream ở nhà', ai: { w: 0.8 }, run: function (l, r, log) { log('Xem livestream, thấy ấm lòng. Hẹn năm sau sẽ đi.', 'neutral'); fx(l, { hap: 2 }); } }
    ]
  });
  T('lg_pride', function (l, a) { return lg(l) && a >= 17 && a <= 45 && l.urban && !(l.abroad && !l.abroad.perm); }, 0.15, 5, 2);

  SC('lg_giuc_cuoi', {
    title: 'Bao giờ lấy vợ / lấy chồng?',
    valid: function (l) { return !l.out && (l.fam.mAlive || l.fam.fAlive); },
    text: function (l) { return 'Tết năm nay, ' + pa(l) + ' và họ hàng lại hỏi: "' + l.age + ' tuổi rồi, bao giờ ' + (l.sex === 'M' ? 'lấy vợ' : 'lấy chồng') + '?" ' + U.cap(pa(l)) + ' còn đã nhờ người mai mối một ' + (l.sex === 'M' ? 'cô gái' : 'chàng trai') + ' ở quê.'; },
    opts: [
      { k: 'noi_that', l: 'Nhân dịp này, nói thật với gia đình', ai: { soc: 0.8, w: 0.9 }, run: function (l, r, log) { l.pending.unshift(E.DEC.out.make(l, r)); } },
      { k: 'gat', l: 'Lấy cớ "đang tập trung sự nghiệp"', ai: { w: 1.1 }, run: function (l, r, log) { log('Lại một cái Tết trốn tránh bằng câu "con đang lo sự nghiệp".', 'neutral'); fx(l, { hap: -2 }); if (l.mind) l.mind.stress += 4; } },
      { k: 'di_xem_mat', l: 'Chiều lòng ' + 'gia đình, đi xem mặt cho xong', ai: { w: 0.5 }, run: function (l, r, log) { log('Đi xem mặt cho bố mẹ vui. Cả buổi hai người nói chuyện lịch sự rồi chẳng ai liên lạc lại. Bạn thấy mệt vì phải đóng vai.', 'neutral'); fx(l, { hap: -4 }); if (l.mind) l.mind.stress += 6; } }
    ]
  });
  T('lg_giuc_cuoi', function (l, a) { return lg(l) && isVN(l) && a >= 25 && a <= 40 && !l.out && !(l.partner && l.partner.sex !== l.sex && l.partner.status !== 'dating'); }, 0.18, 3, 3);

  SC('lg_ra_mat', {
    title: 'Ra mắt gia đình', valid: function (l) { return same(l) && (l.fam.mAlive || l.fam.fAlive); },
    text: function (l) { return 'Bạn và ' + l.partner.name + ' đã bên nhau ' + Math.max(1, l.age - l.partner.since) + ' năm. ' + U.cap(pa(l)) + (l.out ? ' đã biết bạn là ' + E.orientLabel(l).toLowerCase() + ', nhưng chưa từng gặp người ấy.' : ' vẫn chưa biết chuyện.') + ' Có nên đưa người ấy về ra mắt?'; },
    opts: [
      { k: 've', l: 'Đưa người ấy về ra mắt', ai: { soc: 1, w: 1.1 }, run: function (l, r, log) { if (!l.out) { l.out = true; } var acc = l.flags.famTension ? 0.35 : 0.65; if (ch(r, acc)) { l.flags.famTension = false; log(U.cap(pa(l)) + ' ngồi nói chuyện với ' + l.partner.name + ' cả buổi, cuối bữa gắp cho người ấy miếng thịt ngon nhất: "Hai đứa thương nhau thì sống cho tử tế."', 'good'); fx(l, { hap: 10 }); H.mem(l, 'Bữa cơm đầu tiên ' + l.partner.name + ' ngồi cùng mâm với gia đình.', 6); } else { l.flags.famTension = true; log('Bữa cơm im lặng. ' + U.cap(pa(l)) + ' chưa thể chấp nhận, nhưng cũng không đuổi người ấy về.', 'bad'); fx(l, { hap: -6 }); } } },
      { k: 'chua', l: 'Chưa phải lúc', ai: { w: 0.8 }, run: function (l, r, log) { log('Hẹn với người ấy: "Đợi thêm một thời gian nữa nhé."', 'neutral'); } }
    ]
  });
  T('lg_ra_mat', function (l, a) { return same(l) && a - l.partner.since >= 1 && !l.flags.lgRaMat; }, 0.3, 3, 1);
  // ra mắt xong thì không hỏi lại
  var rmA = E.DEC.lg_ra_mat.apply; E.DEC.lg_ra_mat.apply = function (l, d, k) { if (k === 've') l.flags.lgRaMat = true; return rmA.apply(this, arguments); };

  SC('lg_hang_xom', {
    title: 'Hàng xóm dò hỏi', valid: function (l) { return same(l) && l.partner.status !== 'dating'; },
    text: function (l) { return 'Từ ngày bạn và ' + l.partner.name + ' về ở chung, bà chủ nhà / hàng xóm cứ dò hỏi: "Hai ' + (l.sex === 'M' ? 'cậu' : 'cô') + ' là anh em họ à? Sao đi đâu cũng có nhau?"'; },
    opts: [
      { k: 'that', l: 'Cười, nói thật: "Bọn cháu là người yêu ạ"', ai: { soc: 1, w: 1 }, run: function (l, r, log) { if (ch(r, 0.7)) { log('Bà chủ nhà ngớ người, rồi cười xòa: "Thời buổi này thương nhau là được. Có gì ngon thì sang bà cho!" Từ đó hay mang chè sang.', 'good'); fx(l, { hap: 4, soc: 2 }); } else { log('Hàng xóm xì xào mấy tuần, rồi cũng quen.', 'neutral'); fx(l, { hap: -1 }); } } },
      { k: 'lang', l: 'Lảng sang chuyện khác', ai: { w: 0.8 }, run: function (l, r, log) { log('"Dạ, bạn cùng phòng thôi ạ." Về nhà người ấy hơi buồn.', 'neutral'); fx(l, { hap: -2 }); } }
    ]
  });
  T('lg_hang_xom', function (l, a) { return same(l) && l.partner.status !== 'dating'; }, 0.08, 5, 1);

  SC('lg_hoi_ban_treu', {
    title: 'Hội bạn trêu', valid: function (l) { return same(l) && l.sex === 'M'; },
    text: function (l) { return 'Trong bữa nhậu, hội bạn thân trêu bạn và ' + l.partner.name + ': "Thế rốt cuộc trong nhà ai là tóp mỡ, ai là bột tôm?" Cả bàn cười ồ.'; },
    opts: [
      { k: 'cuoi', l: 'Cười, đáp lại cho vui', ai: { w: 1.2 }, run: function (l, r, log) { var me = l.role === 'top', pr = l.partner.role; log(me && pr === 'bot' ? '"Tóp mỡ thì đi làm nuôi nhà, bột tôm thì quản lý tài chính!" — ' + l.partner.name + ' gật đầu xác nhận, cả bàn vỗ tay.' : !me && pr === 'top' ? '"Hỏi ' + l.partner.name + ' ấy, người ta lo hết từ bữa sáng đến cái bóng đèn!" Cả bàn cười nghiêng ngả.' : '"Nhà này hai bột tôm / hai tóp mỡ, nên việc gì cũng chia đôi!" Cả bàn cười không ngớt.', 'good'); fx(l, { hap: 4, soc: 3 }); } },
      { k: 'nghiem', l: 'Nhắc khéo: chuyện riêng tư thì để riêng', ai: { w: 0.7 }, run: function (l, r, log) { log('Nhắc khéo một câu, hội bạn xin lỗi rồi chuyển chủ đề. Ai cũng hiểu ranh giới.', 'neutral'); } }
    ]
  });
  T('lg_hoi_ban_treu', function (l, a) { return same(l) && l.sex === 'M' && a >= 20; }, 0.12, 6, 1);

  SC('lg_bi_hieu_lam', {
    title: 'Bị hiểu lầm', valid: function (l) { return l.orient === 'bi'; },
    text: function (l) { return 'Một người quen nói thẳng: "Song tính á? Chắc là chưa quyết định được thôi, rồi cũng sẽ chọn một bên."'; },
    opts: [
      { k: 'giai_thich', l: 'Bình tĩnh giải thích: thích ai là thích con người ấy', ai: { smart: 1, w: 1.1 }, run: function (l, r, log) { log('Giải thích nhẹ nhàng. Người kia nghĩ một lúc: "Ừ, nghe cũng có lý." Bạn thấy nhẹ nhõm.', 'good'); fx(l, { hap: 2, soc: 1 }); } },
      { k: 'ke', l: 'Kệ, không cần ai hiểu', ai: { w: 0.8 }, run: function (l, r, log) { log('Mỉm cười cho qua. Mình hiểu mình là đủ.', 'neutral'); } }
    ]
  });
  T('lg_bi_hieu_lam', function (l, a) { return lg(l) && l.orient === 'bi' && a >= 16 && a <= 50; }, 0.12, 6, 1);

  SC('lg_cong_so', {
    title: 'Câu đùa ở chỗ làm', valid: function (l) { return !!l.job && H.isEmployee(l); },
    text: function (l) { return 'Một đồng nghiệp hay pha trò về người đồng tính trong giờ nghỉ trưa, cả phòng cười. Không ai biết bạn là ' + E.orientLabel(l).toLowerCase() + '.'; },
    opts: [
      { k: 'nhac', l: 'Nhẹ nhàng nhắc: "Câu đùa này hơi quá rồi đó"', ai: { w: 1.1 }, run: function (l, r, log) { if (ch(r, 0.65)) { log('Đồng nghiệp ngượng, xin lỗi. Mấy người khác nhắn riêng cảm ơn bạn.', 'good'); fx(l, { hap: 3 }); } else log('Đồng nghiệp bĩu môi "đùa thôi mà". Không khí hơi gượng.', 'neutral'); } },
      { k: 'bao', l: 'Góp ý với phòng nhân sự về quy tắc ứng xử', ai: { smart: 0.8 }, run: function (l, r, log) { log('Phòng nhân sự nhắc nhở chung cả công ty về tôn trọng sự khác biệt.', 'good'); } },
      { k: 'im', l: 'Cười trừ cho qua', ai: { w: 0.7 }, run: function (l, r, log) { log('Cười trừ, nhưng tối về thấy nặng lòng.', 'neutral'); fx(l, { hap: -2 }); } }
    ]
  });
  T('lg_cong_so', function (l, a) { return lg(l) && !!l.job && H.isEmployee(l) && a >= 20 && a <= 55; }, 0.04, 6, 1);

  SC('lg_be_lien', {
    title: 'Hội chị em', valid: function (l) { return l.sex === 'F'; },
    text: function (l) { return 'Bạn được rủ vào một nhóm bạn nữ đồng tính trong thành phố — cuối tuần cà phê, đi phượt, có cả buổi chia sẻ chuyện công khai với gia đình. Mọi người gọi đùa nhau là "hội bé Liên".'; },
    opts: [
      { k: 'vao', l: 'Tham gia', ai: { soc: 1, w: 1.1 }, run: function (l, r, log) { log('Có thêm những người chị em hiểu mình. Cuối tuần nào cũng rộn ràng.', 'good'); fx(l, { hap: 5, soc: 4 }); if (!l.partner && ch(r, 0.35)) l.pending.unshift(E.DEC.love.make(l, r, { where: 'trong hội bạn nữ cùng cộng đồng' })); } },
      { k: 'thoi', l: 'Thôi, mình thích một mình hơn', ai: { w: 0.6 }, run: function (l, r, log) { log('Từ chối khéo, giữ thế giới riêng của mình.', 'neutral'); } }
    ]
  });
  T('lg_be_lien', function (l, a) { return lg(l) && l.sex === 'F' && l.orient === 'gay' && a >= 18 && a <= 40 && l.urban; }, 0.12, 6, 1);

  SC('lg_nuoi_con', {
    title: 'Làm cha mẹ', valid: function (l) { return same(l) && l.partner.status !== 'dating' && !l.kids.some(function (k) { return k.alive; }); },
    text: function (l) { return 'Bạn và ' + l.partner.name + ' ' + Math.max(1, l.age - l.partner.since) + ' năm sống chung, căn nhà nhỏ bắt đầu thấy vắng. Hai người bàn chuyện nhận nuôi một đứa trẻ' + (isVN(l) ? ' (ở Việt Nam, một người đứng tên nhận con nuôi)' : '') + '.'; },
    opts: [
      { k: 'nuoi', l: 'Tìm hiểu thủ tục nhận con nuôi', ai: { w: 0.8 }, run: function (l, r, log) { var k = E.DEC.kid; var d = k.make(l, r); l.pending.unshift(d); } },
      { k: 'chua', l: 'Hai người là đủ', ai: { w: 1 }, run: function (l, r, log) { log('Quyết định cứ hai người bên nhau, nuôi thêm một chú mèo cho vui nhà.', 'neutral'); } }
    ]
  });
  T('lg_nuoi_con', function (l, a) { return same(l) && l.partner.status !== 'dating' && a >= 28 && a <= 45 && !l.kids.some(function (k) { return k.alive; }); }, 0.12, 4, 1);

  E.MAJOR && (E.MAJOR.lg_ra_mat = 1);

  // mức thân thiết với con, anh chị em luôn trong khoảng 0–100 (một số lựa chọn cộng thêm mà chưa chặn trên)
  E.HOOKS.year.push(function (l) { (l.kids || []).concat(l.sibList || []).forEach(function (k) { if (k.close != null) k.close = U.clamp(isFinite(k.close) ? k.close : 50, 0, 100); }); });
  // chống lặp: những ngày u tối được lên lịch từ nhiều nguồn (căng thẳng, nợ, biến cố) — giãn cách ít nhất 3 năm, tối đa 4 lần một đời
  if (E.DEC.tram_cam) { var tv = E.DEC.tram_cam.def.valid, ta = E.DEC.tram_cam.apply; E.DEC.tram_cam.def.valid = function (l, d) { return (l.flags.tcAt == null || l.age - l.flags.tcAt >= 3) && (l.flags.tcN || 0) < 4 && (!tv || tv(l, d)); }; E.DEC.tram_cam.apply = function (l) { l.flags.tcAt = l.age; l.flags.tcN = (l.flags.tcN || 0) + 1; return ta.apply(this, arguments); }; }
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
