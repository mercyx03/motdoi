/* Showbiz — Mốc 4: sự nghiệp diễn viên.
   · Mở rộng casting sẵn có (life32): thêm "thử vai một dự án cụ thể" — đọc kịch bản, thử vai, đàm phán cát-xê, chuẩn bị vai,
     quan hệ với đạo diễn và bạn diễn (NPC có danh tính lâu dài), sự cố trường quay, phát hành năm sau, mùa giải thưởng.
   · Hồ sơ phim (filmography) ghi cả vai diễn từ casting nhanh cũ; nấc nghề diễn viên (quần chúng → vai phụ → vai chính →
     hạng A → ngôi sao) theo đúng bậc nghề sẵn có, dựa trên vai đã đóng, giải thưởng, danh tiếng.
   · Phim thành công / đoạt giải → lời mời quảng bá trên Running Man, 2 Ngày 1 Đêm (life48) hoặc chương trình Hàn Quốc;
     ngôi sao được mời làm giám khảo Gương Mặt Thân Quen. Có đường chuyển sang đạo diễn (xưởng phim life60) hoặc làm nhà sản xuất.
   Dự án, đạo diễn, bạn diễn, doanh thu và giải thưởng là mô phỏng hư cấu. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, SH = E.SHOW151, C = E.ELITE148;
  var seeded = SH.seeded, hash = SH.hash, V = SH.V;
  function yr(l) { return l.birthYear + l.age; }
  function vn(l) { return H.isVN(l) && !(l.abroad && l.abroad.perm); }
  function pick(r, a) { return a[Math.floor(r() * a.length)]; }
  function ri(r, a, b) { return a + Math.floor(r() * (b - a + 1)); }
  function mo(l, v) { return H.money(l, v); }
  function S(l) { var s = l.flags.actor154 || (l.flags.actor154 = {}); if (!Array.isArray(s.credits)) s.credits = []; if (!Array.isArray(s.awards)) s.awards = []; if (!Array.isArray(s.noms)) s.noms = []; return s; }
  function isActor(l) { return !!(l.job && l.job.id === 'dien_vien'); }
  function act(l) { if (l.actSk == null) l.actSk = l.talent === 'diễn xuất' ? Math.max(30, l.skill || 30) : 22; return l.actSk; }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.flags.military && l.age < l.flags.military) && !(l.abroad && l.abroad.trapped); }

  // ===================================================================
  // Hồ sơ phim và nấc nghề
  // ===================================================================
  var TIER = ['diễn viên quần chúng', 'diễn viên vai phụ', 'diễn viên vai chính', 'diễn viên hạng A', 'ngôi sao điện ảnh'];
  function tier(l) {
    var c = S(l).credits, leads = c.filter(function (x) { return x.role === 'chính'; }).length, sups = c.filter(function (x) { return x.role === 'phụ'; }).length, hits = c.filter(function (x) { return x.hit; }).length, aw = S(l).awards.length, f = l.fame || 0;
    if (leads >= 3 && (hits >= 1 || aw >= 1) && f >= 1e6) return 4;
    if (leads >= 2 && f >= 1e5) return 3;
    if (leads >= 1) return 2;
    if (sups >= 1) return 1;
    return 0;
  }
  function syncTier(l, log) { if (!isActor(l)) return; var t = tier(l), s = S(l); if (t > (l.job.rank || 0)) { l.job.rank = t; if (log && s.tierLogged !== t) { s.tierLogged = t; log('Sự nghiệp diễn xuất bước sang nấc mới: ' + TIER[t] + '.', 'good'); } } }
  function credit(l, o) { var s = S(l); o.year = yr(l); o.age = l.age; s.credits.push(o); if (s.credits.length > 60) s.credits.splice(0, s.credits.length - 60); return o; }
  // Casting nhanh sẵn có: ghi vai đã nhận vào hồ sơ phim (không đổi tiền, danh tiếng của luồng cũ)
  var CA = E.DEC.casting, caApply = CA.apply;
  var TYPE = { 'phim web drama': 'web', 'phim truyền hình dài tập': 'tv', 'phim điện ảnh chiếu rạp': 'cinema' };
  CA.apply = function (l, d, k, r, log) {
    var n0 = (l.log || []).length, m0 = l.money, out = caApply.apply(this, arguments);
    (l.log || []).slice(n0).forEach(function (e) { var m = /Nhận vai (chính|phụ) trong một (phim web drama|phim truyền hình dài tập|phim điện ảnh chiếu rạp)/.exec(e.t || ''); if (m) credit(l, { title: 'Dự án ' + m[2], type: TYPE[m[2]], role: m[1], fee: Math.max(0, l.money - m0), quick: true, hit: /bom tấn|trăm tỷ|top thịnh hành|phủ sóng/.test(e.t), result: /thất bại/.test(e.t) ? 'thất bại phòng vé' : /bom tấn/.test(e.t) ? 'bom tấn' : 'phát hành' }); });
    syncTier(l, log); return out;
  };

  // ===================================================================
  // Dự án phim chuyên sâu
  // ===================================================================
  var GENRES = { drama: 'chính kịch', romance: 'tình cảm', action: 'hành động', horror: 'kinh dị', comedy: 'hài', mystery: 'trinh thám', period: 'cổ trang' };
  var SCALES = { indie: { n: 'phim độc lập kinh phí thấp', budget: 3, fee: [10, 40], reach: 0.6 }, web: { n: 'phim web drama', budget: 8, fee: [20, 120], reach: 0.8 }, tv: { n: 'phim truyền hình dài tập', budget: 25, fee: [60, 600], reach: 1 }, cinema: { n: 'phim điện ảnh chiếu rạp', budget: 60, fee: [100, 2500], reach: 1.3, cinema: true }, block: { n: 'phim bom tấn kinh phí lớn', budget: 150, fee: [400, 5000], reach: 1.6, cinema: true, need: 60 } };
  var WORD1 = ['Mùa', 'Bóng', 'Lời hứa', 'Thành phố', 'Chuyến tàu', 'Ngôi nhà', 'Bí mật', 'Giấc mơ', 'Tiếng gọi', 'Vết nứt'], WORD2 = ['cuối cùng', 'không tên', 'phương Nam', 'trong sương', 'dưới mưa', 'của mẹ', 'năm ấy', 'đỏ', 'lặng im', 'thứ bảy'];
  var PREP = { study: 'Phân tích kịch bản, viết tiểu sử nhân vật', coach: 'Tập với giáo viên diễn xuất riêng', instinct: 'Giữ cảm xúc tự nhiên, ứng biến tại chỗ' };
  var TRAIN = { action: ['Tập võ thuật, cảnh hành động 2 tháng', 'hea', -4], period: ['Học thoại cổ, cưỡi ngựa, lễ nghi', 'kno', 2], drama: ['Giảm cân, sống thử hoàn cảnh nhân vật', 'hea', -3], romance: ['Tập hóa học cảnh với bạn diễn', 'soc', 2], horror: ['Tập diễn với kỹ xảo, màn hình xanh', 'kno', 1], comedy: ['Luyện nhịp thoại, ứng biến hài', 'soc', 2], mystery: ['Nghiên cứu hồ sơ nghề nghiệp của nhân vật', 'kno', 2] };
  var INCIDENTS = [['Bão làm hỏng phim trường ngoài trời.', 'Cùng đoàn dọn dẹp, quay bù vào cuối tuần', 'Đề nghị đổi kịch bản cho nhẹ việc'], ['Bạn diễn đến muộn liên tục.', 'Nói chuyện riêng, đề nghị cùng giữ lịch', 'Phàn nàn công khai với báo chí'], ['Một cảnh nguy hiểm cần đóng thế.', 'Để diễn viên đóng thế chuyên nghiệp làm', 'Tự đóng để có cảnh quay chân thực'], ['Kịch bản bị sửa phút chót.', 'Học thoại mới thâu đêm', 'Đề nghị giữ bản cũ']];
  function P(l) { return S(l).project; }
  function newProject(l, r, kind) {
    var t = tier(l), rr = seeded(l.id + ':p' + yr(l) + ':' + (S(l).serial = (S(l).serial || 0) + 1)), scales = Object.keys(SCALES).filter(function (k) { return !SCALES[k].need || act(l) >= SCALES[k].need || (l.fame || 0) > 5e5; });
    var sc = kind || (t <= 1 ? pick(rr, ['indie', 'web', 'tv']) : pick(rr, scales)), g = pick(rr, Object.keys(GENRES));
    var dir = C && C.meet ? C.meet(l, rr, { kind: 'artist', where: 'buổi casting phim', tier: Math.max(1, C.tier(l)) }) : { name: H.stranger(l, rr, 'M'), uid110: null }; dir.job = 'Đạo diễn'; dir.dirSkill154 = Math.round(40 + rr() * 55); dir.strict154 = rr() < 0.5;
    var co = C && C.meet ? C.meet(l, rr, { kind: 'artist', where: 'đoàn phim', tier: Math.max(1, C.tier(l)) }) : { name: H.stranger(l, rr, 'F'), uid110: null }; co.job = 'Diễn viên';
    return { id: S(l).serial, title: pick(rr, WORD1) + ' ' + pick(rr, WORD2), scale: sc, genre: g, budget: V(l, SCALES[sc].budget * 1000 * (0.7 + rr() * 0.6)), script: Math.round(35 + rr() * 60), dir: dir.uid110 || null, dirName: dir.name, dirSkill: dir.dirSkill154, strict: dir.strict154, co: co.uid110 || null, coName: co.name, stage: 'read', year: yr(l), token: 'film154:' + l.id + ':' + S(l).serial, perf: 0, chem: 0.5, manual: true };
  }
  function contactOf(l, id) { return id && C && C.find ? C.find(l, id) : null; }
  function canSeek(l) { if (!free(l)) return 'Hiện không thể nhận dự án'; if (l.age < 14) return 'Từ 14 tuổi'; if (P(l) && P(l).stage !== 'done' && P(l).stage !== 'post') return 'Đang tham gia một dự án phim'; if (!isActor(l) && l.talent !== 'diễn xuất' && act(l) < 30) return 'Cần năng khiếu hoặc học diễn xuất trước'; return true; }
  function queue(l, r) { var p = P(l); X.next(l, 'film154', r, { token: p.token, stage: p.stage }, { manual: p.manual }); }
  X.menu('film154', function (l) { var p = P(l); return p ? 'Dự án "' + p.title + '" · ' + { read: 'Đọc kịch bản, thử vai', offer: 'Lời mời vai diễn', contract: 'Hợp đồng', prep: 'Chuẩn bị vai', set: 'Trường quay', incident: 'Sự cố', wrap: 'Đóng máy' }[p.stage] : 'Dự án phim'; },
    function (l) { return P(l) ? true : 'Không có dự án'; },
    function (l, d) {
      var p = P(l); if (!p || d && d.arg && d.arg.token !== p.token) return 'Dự án đã kết thúc.';
      var base = U.cap(SCALES[p.scale].n) + ' thể loại ' + GENRES[p.genre] + ', ngân sách ' + mo(l, p.budget) + ' (của hãng phim). Đạo diễn ' + p.dirName + ' (' + (p.strict ? 'khó tính, đòi hỏi cao' : 'cởi mở, thích thử nghiệm') + '), bạn diễn chính ' + p.coName + '. Kịch bản được đánh giá ' + (p.script >= 75 ? 'rất tốt' : p.script >= 55 ? 'khá' : 'còn nhiều chỗ yếu') + '.';
      var extra = { read: 'Buổi thử vai diễn ra tuần sau. Bạn chuẩn bị thế nào? (Khả năng diễn xuất hiện tại ' + Math.round(act(l)) + '/100.)', offer: 'Đạo diễn đề nghị bạn vai ' + p.role + '.' + (p.wanted && p.wanted !== p.role ? ' (Bạn mong vai ' + p.wanted + '.)' : ''), contract: 'Hãng đề nghị cát-xê ' + mo(l, p.fee) + ' cho ' + Math.max(1, p.months) + ' tháng quay.', prep: 'Vai diễn đòi hỏi chuẩn bị riêng cho phim ' + GENRES[p.genre] + '.', set: 'Những ngày trên trường quay. Mức ăn ý với bạn diễn: ' + Math.round(p.chem * 100) + '/100.', incident: p.incident ? p.incident[0] : '', wrap: 'Phim đóng máy, chờ hậu kỳ và phát hành.' }[p.stage];
      return base + '\n' + extra;
    },
    function (l, arg) {
      var p = P(l); if (!p || arg.token !== p.token || arg.stage !== p.stage) return [];
      var go = function (fn) { return function (l, r, log) { fn(l, r, log); if (P(l) && P(l).stage !== 'post' && P(l).stage !== 'done') queue(l, r); }; };
      if (p.stage === 'read') return Object.keys(PREP).map(function (k) { return { k: k, l: PREP[k], h: k === 'coach' ? mo(l, V(l, 5)) : '', run: go(function (l, r, log) { audition(l, r, log, p, k); }) }; });
      if (p.stage === 'offer') return [{ k: 'accept', l: 'Nhận vai ' + p.role, run: go(function (l, r) { p.stage = 'contract'; }) }, { k: 'decline', l: 'Từ chối, chờ cơ hội khác', run: go(function (l, r, log) { p.stage = 'done'; log('Bạn từ chối vai ' + p.role + ' trong "' + p.title + '".', 'neutral'); }) }];
      if (p.stage === 'contract') return [{ k: 'sign', l: 'Ký hợp đồng với mức cát-xê này', run: go(function (l, r, log) { sign(l, r, log, p, 1); }) }, { k: 'raise', l: 'Đề nghị tăng 30% cát-xê', why: p.raised ? 'Đã đàm phán một lần' : true, run: go(function (l, r, log) { p.raised = true; var rr = seeded(p.token + ':neg'), ok = rr() < U.clamp(0.25 + (l.fame || 0) / 4e6 + (p.role === 'chính' ? 0.1 : 0), 0.1, 0.8); if (ok) sign(l, r, log, p, 1.3); else if (rr() < 0.5) { p.stage = 'done'; log('Hãng không đồng ý mức cát-xê mới và chọn diễn viên khác cho vai này.', 'bad'); } else { log('Hãng giữ nguyên mức cát-xê; bạn vẫn có thể ký.', 'neutral'); } }) }];
      if (p.stage === 'prep') { var tr = TRAIN[p.genre]; return [{ k: 'train', l: tr[0], run: go(function (l, r, log) { p.perf += 0.08; var o = {}; o[tr[1]] = tr[2]; H.fx(l, o); l.actSk = Math.min(100, act(l) + 2); p.stage = 'set'; log('Bạn dành nhiều tuần chuẩn bị cho vai diễn trong "' + p.title + '".', 'neutral'); }) }, { k: 'light', l: 'Chuẩn bị vừa phải, giữ sức khỏe', run: go(function (l, r) { p.stage = 'set'; }) }]; }
      if (p.stage === 'set') return [{ k: 'listen', l: 'Đến sớm, nghe đạo diễn chỉnh từng cảnh', run: go(function (l, r, log) { onSet(l, r, log, p, 'listen'); }) }, { k: 'idea', l: 'Đề xuất cách diễn của riêng mình', run: go(function (l, r, log) { onSet(l, r, log, p, 'idea'); }) }, { k: 'bond', l: 'Dành thời gian tập thoại cùng ' + p.coName, run: go(function (l, r, log) { onSet(l, r, log, p, 'bond'); }) }];
      if (p.stage === 'incident') return [{ k: 'good', l: p.incident[1], run: go(function (l, r, log) { incident(l, r, log, p, true); }) }, { k: 'bad', l: p.incident[2], run: go(function (l, r, log) { incident(l, r, log, p, false); }) }];
      return [];
    }, 99);
  E.DEC.film154.auto = function (l, d, r) { var p = P(l), keys = d.data && d.data.keys || [], k = p ? { read: act(l) > 60 ? 'study' : 'coach', offer: 'accept', contract: 'sign', prep: 'train', set: pick(r, ['listen', 'bond']), incident: 'good' }[p.stage] : null, i = keys.indexOf(k); return i >= 0 ? String(i) : d.opts[0] && d.opts[0].k; };
  function audition(l, r, log, p, how) {
    if (how === 'coach') H.cash(l, -V(l, 5), 'Thuê giáo viên diễn xuất');
    var rr = seeded(p.token + ':aud'), score = act(l) / 100 * 0.6 + (how === 'study' ? 0.1 : how === 'coach' ? 0.14 : rr() < 0.5 ? 0.18 : -0.02) + Math.min(0.15, Math.log10(1 + (l.fame || 0)) / 40) + (rr() - 0.5) * 0.15;
    var t = tier(l); p.audition = score; p.wanted = t >= 1 ? 'chính' : 'phụ';
    p.role = score >= 0.62 && t >= 1 || score >= 0.75 ? 'chính' : score >= 0.42 ? 'phụ' : score >= 0.25 ? 'quần chúng' : null;
    if (!p.role) { p.stage = 'done'; log('Buổi thử vai "' + p.title + '" chưa thành: đạo diễn ' + p.dirName + ' nói bạn cần thêm thời gian rèn luyện.', 'neutral'); l.actSk = Math.min(100, act(l) + 1); return; }
    var range = SCALES[p.scale].fee, k = p.role === 'chính' ? 1 : p.role === 'phụ' ? 0.3 : 0.04;
    p.fee = V(l, (range[0] + (range[1] - range[0]) * U.clamp(score, 0, 1)) * k * (1 + Math.log10(1 + (l.fame || 0) / 1e5))); p.months = ri(rr, 1, p.scale === 'tv' ? 6 : 4);
    p.perf = score; p.stage = 'offer';
  }
  function sign(l, r, log, p, mult) {
    p.fee *= mult; p.stage = 'prep'; p.signedAt = yr(l);
    var key = p.token + ':fee'; S(l).paid = S(l).paid || {}; if (!S(l).paid[key]) { S(l).paid[key] = 1; H.cash(l, p.fee, 'Cát-xê phim "' + p.title + '"'); }
    if (!isActor(l)) { E.startJob(l, 'dien_vien', r, log, true); log('Lần đầu ký hợp đồng đóng phim — chính thức vào nghề diễn viên.', 'big'); }
    log('Ký hợp đồng vai ' + p.role + ' trong "' + p.title + '" (' + SCALES[p.scale].n + '), cát-xê ' + mo(l, p.fee) + '.', 'good');
  }
  function onSet(l, r, log, p, how) {
    var rr = seeded(p.token + ':set'), d = contactOf(l, p.dir), c = contactOf(l, p.co);
    if (how === 'listen') { p.perf += p.strict ? 0.07 : 0.04; if (d) C.seen(l, d, 'trường quay "' + p.title + '"', p.strict ? 6 : 3); }
    else if (how === 'idea') { var ok = rr() < (p.strict ? 0.35 : 0.7); p.perf += ok ? 0.1 : -0.03; if (d) C.seen(l, d, 'trường quay "' + p.title + '"', ok ? 4 : -4); log(ok ? 'Đạo diễn ' + p.dirName + ' thích ý tưởng của bạn và quay lại cảnh theo cách mới.' : 'Đạo diễn ' + p.dirName + ' gạt đi đề xuất, không khí trên phim trường hơi căng.', ok ? 'good' : 'neutral'); }
    else { p.chem = Math.min(1, p.chem + 0.25); if (c) C.seen(l, c, 'đoàn phim "' + p.title + '"', 6); }
    p.incident = INCIDENTS[hash(p.token) % INCIDENTS.length]; p.stage = 'incident';
  }
  function incident(l, r, log, p, good) {
    var rr = seeded(p.token + ':inc'), c = contactOf(l, p.co);
    if (good) { p.perf += 0.03; C && C.rep && C.rep(l, 1); } else if (/Tự đóng/.test(p.incident[2])) { if (rr() < 0.3) { H.fx(l, { hea: -10 }); log('Bạn bị thương khi tự đóng cảnh nguy hiểm, phải nghỉ quay hai tuần.', 'bad'); } else p.perf += 0.06; } else { p.perf -= 0.04; if (c) C.seen(l, c, 'đoàn phim', -5); C && C.rep && C.rep(l, -2); }
    p.stage = 'post'; p.releaseAt = l.age + 1;
    l.actSk = Math.min(100, act(l) + (p.role === 'chính' ? 4 : 2));
    log('"' + p.title + '" đóng máy. Phim sẽ ra mắt khán giả vào năm sau.', 'neutral');
  }
  // Phát hành (năm sau) — doanh thu / lượt xem mô phỏng, đánh giá, thưởng doanh thu cho vai chính
  function release(l, r, log, p) {
    var rr = seeded(p.token + ':rel'), sc = SCALES[p.scale], q = U.clamp(p.perf * 0.4 + p.dirSkill / 100 * 0.25 + p.script / 100 * 0.2 + p.chem * 0.15 + (rr() - 0.5) * 0.2, 0, 1.2);
    var review = Math.round(U.clamp(3 + q * 6.5 + (rr() - 0.5), 1, 10) * 10) / 10, f0 = l.fame || 0, reach = sc.reach * (p.role === 'chính' ? 1 : p.role === 'phụ' ? 0.4 : 0.08);
    var hit = q >= 0.72, flop = q < 0.42, txt;
    if (sc.cinema) { var rev = Math.exp(2 + q * 3.2 + (rr() - 0.5) * 0.6) * (p.scale === 'block' ? 1.6 : 1); txt = 'doanh thu phòng vé ' + (vn(l) ? U.fmtNum(Math.round(rev)) + ' tỷ đồng' : mo(l, V(l, rev * 1000))); p.revenue = rev; if (p.role === 'chính' && rev >= 100) { var bonus = V(l, rev * 2); var key = p.token + ':bonus'; if (!S(l).paid[key]) { S(l).paid[key] = 1; H.cash(l, bonus, 'Thưởng doanh thu phim "' + p.title + '"'); txt += ', bạn nhận thưởng doanh thu ' + mo(l, bonus); } } hit = hit || rev >= 100; flop = flop || rev < 15; }
    else { var views = Math.round(Math.exp(13 + q * 3 + (rr() - 0.5)) * sc.reach); txt = U.fmtNum(views) + ' lượt xem'; p.views = views; }
    l.fame = f0 + Math.round((hit ? 3e5 : flop ? 5000 : 6e4) * reach * (1 + f0 / 3e6));
    var cr = credit(l, { title: p.title, type: p.scale, genre: p.genre, role: p.role, fee: p.fee, review: review, hit: hit, flop: flop, result: txt, director: p.dirName, costar: p.coName, quality: Math.round(q * 100) / 100, token: p.token });
    log('"' + p.title + '" ra mắt: ' + txt + ', điểm đánh giá ' + review + '/10' + (hit ? '. Phim thành công vang dội, vai diễn của bạn được nhắc đến khắp nơi!' : flop ? '. Phim không như kỳ vọng.' : '.'), hit ? 'big' : flop ? 'bad' : 'good');
    if (hit) H.mem(l, 'Buổi ra mắt "' + p.title + '" — khán giả đứng dậy vỗ tay.', 4);
    p.stage = 'done'; p.result = cr;
    promote(l, r, log, cr);
    syncTier(l, log);
    if (q >= 0.55 && p.role !== 'quần chúng') S(l).noms.push({ token: p.token, title: p.title, role: p.role, q: q, year: yr(l), scale: p.scale });
  }
  // Mời quảng bá phim trên gameshow sẵn có / chương trình Hàn Quốc
  function promote(l, r, log, cr) {
    if (!cr.hit || cr.role !== 'chính') return;
    var s = SH.S(l);
    if (SH.krStar && SH.krStar(l) && !vn(l)) { s.invites.rmkr = { until: yr(l) + 2, why: 'quảng bá phim ' + cr.title }; log('Ê-kíp Running Man (Hàn Quốc) mời bạn làm khách mời để quảng bá "' + cr.title + '".', 'good'); return; }
    if (vn(l) && E.DEC.gameshow && !(l.flags.variety && !l.flags.variety.done)) { H.sched(l, 'gameshow', 1); log('Nhà sản xuất Running Man Việt Nam và 2 Ngày 1 Đêm ngỏ ý mời bạn tham gia để quảng bá "' + cr.title + '" (lời mời đến vào năm sau).', 'good'); }
  }
  // Mùa giải thưởng: đề cử theo chất lượng vai diễn; người thắng chọn trong 5 đề cử
  var AWARDS_VN = ['Giải Cánh Diều', 'Liên hoan phim Việt Nam (Bông Sen)', 'Giải Mai Vàng'], AWARDS_W = ['Giải thưởng điện ảnh quốc gia', 'Giải thưởng của Hội phê bình'];
  function awards(l, r, log) {
    var s = S(l), list = s.noms.filter(function (n) { return n.year === yr(l) - 1 && !n.done; }); if (!list.length) return;
    list.forEach(function (n) {
      n.done = true; var rr = seeded(n.token + ':aw'), name = pick(rr, vn(l) ? AWARDS_VN : AWARDS_W) + ' — ' + (n.role === 'chính' ? 'Nam/Nữ diễn viên chính xuất sắc' : 'Nam/Nữ diễn viên phụ xuất sắc');
      if (rr() > U.clamp((n.q - 0.5) * 1.6, 0, 0.85)) return;
      var rivals = [0, 1, 2, 3].map(function () { return 0.55 + rr() * 0.4; }), win = n.q + (rr() - 0.5) * 0.1 > Math.max.apply(null, rivals);
      s.awards.push({ name: name, title: n.title, year: yr(l), won: win });
      if (!win) { log('Bạn được đề cử ' + name + ' với vai diễn trong "' + n.title + '".', 'good'); l.fame = (l.fame || 0) + 2e4; return; }
      l.fame = (l.fame || 0) * 1.3 + 2e5; H.fx(l, { hap: 10 }); H.mem(l, 'Cầm trên tay ' + name + ' cho "' + n.title + '".', 5);
      log('Bạn đoạt ' + name + ' với vai diễn trong "' + n.title + '"!', 'big');
      promote(l, r, log, { hit: true, role: 'chính', title: n.title });
    });
    s.awards = s.awards.filter(function (a) { return a.won; }).concat(s.awards.filter(function (a) { return !a.won; }).slice(-20));
    syncTier(l, log);
  }
  // Thêm vào lời mời casting sẵn có: thử vai một dự án cụ thể
  CA.def.opts.splice(CA.def.opts.findIndex(function (o) { return o.k === 'train'; }), 0, { k: 'project154', l: 'Thử vai một dự án cụ thể (xem kịch bản, đạo diễn, bạn diễn)', h: 'Thử vai, đàm phán cát-xê, quay phim, phát hành năm sau', req: function (l) { return canSeek(l) === true; }, ai: function (l) { return isActor(l) ? 0.8 : 0.2; }, run: function (l, r, log) { startProject(l, r, log); } });
  function startProject(l, r, log, kind) { if (canSeek(l) !== true) return null; var p = newProject(l, r, kind); S(l).project = p; queue(l, r); return p; }

  // ===================================================================
  // Menu sự nghiệp diễn xuất: hồ sơ phim, tìm dự án, quần chúng, nhà sản xuất, chuyển đạo diễn
  // ===================================================================
  X.menu('actor154', 'Sự nghiệp diễn xuất', function (l) { return free(l) && l.age >= 14 ? (isActor(l) || l.talent === 'diễn xuất' || act(l) >= 30 ? true : 'Dành cho người theo nghề diễn') : 'Từ 14 tuổi'; },
    function (l) {
      var s = S(l), c = s.credits.slice(-6), aw = s.awards.filter(function (a) { return a.won; });
      return 'Nấc nghề: ' + TIER[tier(l)] + ' · khả năng diễn xuất ' + Math.round(act(l)) + '/100 · ' + U.fmtNum(l.fame || 0) + ' người biết đến.' +
        (c.length ? '\nPhim đã đóng: ' + c.map(function (x) { return '"' + x.title + '" (' + x.year + ', vai ' + x.role + (x.review ? ', ' + x.review + '/10' : '') + (x.hit ? ', thành công' : '') + ')'; }).join('; ') : '\nChưa có vai diễn nào.') +
        (aw.length ? '\nGiải thưởng: ' + aw.map(function (a) { return a.name + ' (' + a.year + ')'; }).join('; ') : '') + (P(l) && P(l).stage === 'post' ? '\nĐang chờ phát hành: "' + P(l).title + '".' : '') + (s.produce && !s.produce.done ? '\nĐang đầu tư sản xuất: "' + s.produce.title + '".' : '');
    },
    function (l) {
      var rows = [{ k: 'seek', l: 'Tìm dự án phim mới, đi thử vai', why: canSeek(l), run: function (l, r, log) { startProject(l, r, log); } }];
      rows.push({ k: 'extra', l: 'Đi đóng vai quần chúng lấy kinh nghiệm', h: 'Thù lao nhỏ, học hỏi nghề', why: S(l).extraAt === l.age ? 'Đã đi năm nay' : tier(l) >= 2 ? 'Bạn đã đóng vai chính' : true, run: function (l, r, log) { var s = S(l); s.extraAt = l.age; H.cash(l, V(l, 2), 'Thù lao vai quần chúng'); l.actSk = Math.min(100, act(l) + 2); if (!isActor(l)) E.startJob(l, 'dien_vien', r, log, true); credit(l, { title: 'Vai quần chúng (nhiều phim)', type: 'extra', role: 'quần chúng', fee: V(l, 2) }); log('Bạn đóng vai quần chúng ở vài đoàn phim, học được cách đứng máy và nhịp làm việc trường quay.', 'neutral'); } });
      if (E.DEC.hoc_dien) rows.push({ k: 'learn', l: 'Học diễn xuất', run: function (l, r) { X.next(l, 'hoc_dien', r); } });
      rows.push({ k: 'produce', l: 'Làm nhà sản xuất: góp vốn cho một bộ phim', h: mo(l, l.base * 3), why: tier(l) < 3 ? 'Cần là diễn viên hạng A trở lên để có uy tín gọi vốn' : S(l).produce && !S(l).produce.done ? 'Đang sản xuất một phim' : l.money < l.base * 3.5 ? 'Chưa đủ tiền góp vốn' : true, run: function (l, r, log) { var rr = seeded(l.id + ':prod' + yr(l)); S(l).produce = { title: pick(rr, WORD1) + ' ' + pick(rr, WORD2), amt: l.base * 3, at: l.age, done: false, q: U.clamp(act(l) / 140 + rr() * 0.5, 0, 1.1) }; H.cash(l, -l.base * 3, 'Góp vốn sản xuất phim'); log('Bạn góp vốn ' + mo(l, l.base * 3) + ' làm nhà sản xuất phim "' + S(l).produce.title + '". Kết quả sẽ biết khi phim ra rạp năm sau.', 'neutral'); } });
      rows.push({ k: 'direct', l: 'Chuyển hướng sang làm đạo diễn', why: tier(l) < 3 ? 'Cần là diễn viên hạng A trở lên' : (l.edu || 0) < 5 ? 'Cần bằng đại học (có thể học đạo diễn trước)' : l.age < 28 ? 'Từ 28 tuổi' : true, run: function (l, r, log) { E.startJob(l, 'dao_dien', r, log, true); log('Bạn chuyển sang làm đạo diễn; có thể tự sản xuất phim trong mục xưởng phim.', 'big'); } });
      return rows;
    }, 14, 'Công việc');
  // Vòng năm: phát hành phim, giải thưởng, kết quả đầu tư sản xuất
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !l.flags.actor154) return; var s = S(l), p = s.project;
    if (p && p.stage === 'post' && l.age >= p.releaseAt) release(l, r, log, p);
    if (p && p.stage !== 'post' && p.stage !== 'done' && !(l.pending || []).some(function (d) { return d.id === 'film154'; }) && p.year < yr(l)) { p.stage = 'done'; log('Dự án "' + p.title + '" bị bỏ dở.', 'neutral'); }
    awards(l, r, log);
    var pr = s.produce; if (pr && !pr.done && l.age > pr.at) { pr.done = true; var rr = seeded(l.id + ':prodres' + pr.at), mult = pr.q >= 0.8 ? 1.8 + rr() : pr.q >= 0.55 ? 0.8 + rr() * 0.6 : rr() * 0.5; pr.back = pr.amt * mult; H.cash(l, pr.back, 'Doanh thu chia lại phim "' + pr.title + '"'); log('Phim "' + pr.title + '" do bạn sản xuất ra rạp; phần chia lại cho nhà sản xuất là ' + mo(l, pr.back) + ' trên vốn ' + mo(l, pr.amt) + '.', mult >= 1 ? 'good' : 'bad'); }
  });
  if (E.profile) { var profile = E.profile; E.profile = function (l) { var p = profile.apply(this, arguments), s = l.flags && l.flags.actor154; if (s && p && p.jobInfo) { s.credits.slice(-3).forEach(function (c) { p.jobInfo.push('Phim "' + c.title + '" (' + c.year + ') — vai ' + c.role + (c.review ? ', ' + c.review + '/10' : '')); }); s.awards.filter(function (a) { return a.won; }).forEach(function (a) { p.jobInfo.push(a.name + ' (' + a.year + ')'); }); } return p; }; }
  var convert = E.abroadConvert; E.abroadConvert = function (l, f) { var out = convert.apply(this, arguments), s = l.flags && l.flags.actor154; if (s) { s.credits.forEach(function (c) { c.fee *= f; }); if (s.project) { ['fee', 'budget'].forEach(function (k) { if (typeof s.project[k] === 'number') s.project[k] *= f; }); } if (s.produce) { s.produce.amt *= f; if (s.produce.back) s.produce.back *= f; } } return out; };

  // ===================================================================
  // Gương Mặt Thân Quen (VN, từ 2013): nghệ sĩ hóa thân thần tượng; ngôi sao làm giám khảo
  // ===================================================================
  SH.HANDLERS.impression = {
    start: function (l, r, a, sh) { a.week = 0; a.total = 0; a.weeks = sh.weeks; a.idols = []; this.draw(l, a); },
    draw: function (l, a) { var rr = seeded(a.token + ':w' + a.week), pool = (E.CONCERT_CATS && E.CONCERT_CATS.vn ? E.CONCERT_CATS.vn.a : []).map(function (x) { return x.n; }).filter(function (n) { return n !== l.name && a.idols.indexOf(n) < 0; }); a.idol = pool.length ? pick(rr, pool) : 'một ca sĩ nổi tiếng'; },
    title: function (l, a) { return a.role === 'judge' ? 'Ghế giám khảo · tuần ' + (a.week + 1) + '/' + a.weeks : 'Tuần ' + (a.week + 1) + '/' + a.weeks; },
    text: function (l, a, sh) { if (a.role === 'judge') return SH.recap(a) + 'Bạn ngồi ghế giám khảo. Tuần này các nghệ sĩ hóa thân những ca sĩ nổi tiếng; lời nhận xét của bạn ảnh hưởng tới hình ảnh của chính bạn.'; return SH.recap(a) + 'Bạn bốc thăm được hóa thân thành ' + a.idol + '. Tổng điểm sau ' + a.week + ' tuần: ' + a.total + '.'; },
    rows: function (l, a, sh) {
      var self = this;
      if (a.role === 'judge') return [['fair', 'Chấm công tâm, nhận xét chuyên môn'], ['kind', 'Động viên, nhẹ nhàng'], ['harsh', 'Nhận xét gay gắt cho "nóng" sóng']].map(function (x) { return { k: x[0], l: x[1], run: function (l, r, log) { self.judge(l, r, log, a, sh, x[0]); } }; });
      return [['voice', 'Luyện giọng theo ' + a.idol + ' cả tuần'], ['look', 'Đầu tư hóa trang, trang phục giống hệt'], ['dance', 'Tập vũ đạo và thần thái sân khấu']].map(function (x) { return { k: x[0], l: x[1], run: function (l, r, log) { self.perform(l, r, log, a, sh, x[0]); } }; });
    },
    perform: function (l, r, log, a, sh, how) {
      var rr = seeded(a.token + ':p' + a.week), sing = E.LIFE138 ? E.LIFE138.skill(l, 'sing').level / 100 : 0.4, base = Math.max(sing, act(l) / 100) * 0.6 + (how === 'voice' ? sing * 0.25 : how === 'look' ? 0.15 : 0.12) + (rr() - 0.5) * 0.2;
      var scores = [0, 1, 2].map(function () { return Math.max(5, Math.min(10, Math.round((5 + base * 6 + (rr() - 0.5) * 2) * 2) / 2)); }), sum = scores.reduce(function (x, y) { return x + y; }, 0);
      a.total += sum; a.idols.push(a.idol); SH.note(a, 'Tuần ' + (a.week + 1) + ' hóa thân ' + a.idol + ': giám khảo chấm ' + scores.join(' · ') + ' = ' + sum + ' điểm.'); a.week++;
      if (a.week >= a.weeks) { var avg = a.total / a.weeks, place = avg >= 26 ? 1 : avg >= 23 ? 2 : avg >= 20 ? 3 : 5; return SH.finish(l, log, { result: place === 1 ? 'quán quân sau ' + a.weeks + ' tuần hóa thân' : 'xếp hạng ' + place + ' chung cuộc', prize: place === 1 ? V(l, 200) : 0, fame: place === 1 ? 3e5 : 1e5, good: true, hap: place === 1 ? 10 : 4, rank: place }); }
      this.draw(l, a);
    },
    judge: function (l, r, log, a, sh, how) { var rr = seeded(a.token + ':j' + a.week); a.total += how === 'fair' ? 2 : how === 'kind' ? 1 : rr() < 0.5 ? 3 : -2; SH.note(a, { fair: 'Khán giả khen bạn chấm điểm có chuyên môn.', kind: 'Các nghệ sĩ cảm ơn sự động viên của bạn.', harsh: a.total < 0 ? 'Lời nhận xét gay gắt bị cho là thiếu tôn trọng.' : 'Lời nhận xét thẳng thắn được bàn tán khắp mạng xã hội.' }[how]); a.week++; if (a.week >= a.weeks) return SH.finish(l, log, { result: 'hoàn thành ' + a.weeks + ' tuần ngồi ghế giám khảo' + (a.total < 0 ? ', gây tranh cãi' : ''), fame: a.total >= 0 ? 1.5e5 : 5e4, good: a.total >= 0, hap: 3 }); },
    auto: function (l, a, r) { return a.role === 'judge' ? 'fair' : pick(r, ['voice', 'look', 'dance']); }
  };
  SH.define('gmtq', { name: 'Gương Mặt Thân Quen', country: 'VN', genre: 'music', from: 2013, handler: 'impression', weeks: 5, fee: 150, desc: 'Nghệ sĩ bốc thăm hóa thân thành những ca sĩ nổi tiếng mỗi tuần; ba giám khảo chấm điểm, cộng dồn tìm quán quân.',
    roles: { celeb: { n: 'nghệ sĩ thi hóa thân', gap: 3, why: function (l) { var j = l.job ? l.job.id : ''; return (l.fame || 0) >= 5e4 && /^(ca_si|rapper|nhac_si|dien_vien|dv_hai|mc_tv)$/.test(j) ? true : 'Dành cho ca sĩ, diễn viên, nghệ sĩ hài có tên tuổi'; } },
      judge: { n: 'giám khảo', gap: 1, fee: 300, why: function (l) { var j = l.job ? l.job.id : ''; return (l.fame || 0) >= 1e6 && l.age >= 30 && /^(dien_vien|dv_hai|ca_si|dao_dien)$/.test(j) ? true : 'Dành cho nghệ sĩ rất nổi tiếng, từ 30 tuổi'; } } } });

  E.ACTOR154 = { S: S, tier: tier, TIER: TIER, credit: credit, startProject: startProject, release: release, awards: awards, syncTier: syncTier, SCALES: SCALES, promote: promote };
})(globalThis.G);
