/* Góp ý người chơi — Mốc D: kết giao người có địa vị, người nổi tiếng (kể cả hẹn hò tự nguyện giữa người trưởng thành),
   mặt tối giới giải trí, giới thiệu đối tượng cho con, quà tặng người thân, chuỗi cầu hôn.
   · Dùng chung mạng lưới NPC của life148 (mã định danh cố định) và sổ tài sản có chủ sở hữu.
   · Mọi nhân vật là hư cấu. Không có lựa chọn "chấp nhận" trao đổi lợi ích không phù hợp; nổi tiếng vẫn đạt được bằng con đường bình thường.
   · Cầu hôn được nhận lời chỉ là đính hôn; đám cưới vẫn do hai người quyết định ở bước sau, nhẫn không bắt buộc. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, C = E.ELITE148;
  function S(l) { var s = l.flags.social149 || (l.flags.social149 = {}); if (!s.done || typeof s.done !== 'object') s.done = {}; return s; }
  function once(l, key) { return S(l).done[key] === l.age; }
  function mark(l, key) { S(l).done[key] = l.age; }
  function yr(l) { return l.birthYear + l.age; }
  function mo(l, v) { return H.money(l, v); }
  function free(l) {
    var w = X.reason(l, 18); if (w !== true) return w;
    if (l.jailUntil != null && l.age < l.jailUntil) return 'Đang trong trại giam';
    if (l.abroad && l.abroad.trapped) return 'Đang bị giữ trong trại lừa đảo';
    return true;
  }
  function liquid(l) { return Math.max(0, l.money); }
  function reserve(l) { return l.base * 0.3; }
  function hash(s) { var n = 2166136261; for (var i = 0; i < s.length; i++) n = Math.imul(n ^ s.charCodeAt(i), 16777619); return n >>> 0; }
  function seeded(s) { var a = hash(s); return function () { a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function pAge(l, p) { return yr(l) - p.birth; }

  // ===================================================================
  // D1 / D2. Kết giao người có địa vị và người nổi tiếng
  // ===================================================================
  function eligible(p) { return p && p.alive !== false && !p.burned && !p.abuser149; }
  X.menu('social149', 'Kết giao, mở rộng quan hệ', function (l) { return free(l); },
    function (l) { return 'Tầng lớp: ' + C.tierName(l) + ' · uy tín ' + Math.round(C.S(l).rep) + '/100. Người quen nhớ những lần gặp; ai cũng có quyền từ chối lời mời. Mọi nhân vật trong game là hư cấu.'; },
    function (l) {
      var t = C.tier(l), rows = [{ k: 'event', l: t >= 2 ? 'Dự sự kiện câu lạc bộ doanh nhân, hội từ thiện' : 'Tham gia hội nhóm nghề nghiệp, sự kiện cộng đồng', h: mo(l, l.base * (0.02 + t * 0.05)), why: once(l, 'event') ? 'Đã đi sự kiện năm nay' : liquid(l) < l.base * (0.02 + t * 0.05) ? 'Chưa đủ tiền' : true, run: function (l, r, log) { event(l, r, log); } }];
      C.contacts(l, eligible).sort(function (a, b) { return b.trust - a.trust; }).slice(0, 20).forEach(function (p) {
        rows.push({ k: 'p:' + p.uid110, l: C.label(l, p) + ' · tin cậy ' + Math.round(p.trust) + (p.celeb ? ' · người nổi tiếng' : ''), run: function (l, r) { X.next(l, 'social149_person', r, { id: p.uid110 }); } });
      });
      return rows;
    }, 18, 'Gia đình & bạn bè');
  function event(l, r, log) {
    if (once(l, 'event')) return null; mark(l, 'event');
    var t = C.tier(l), cost = l.base * (0.02 + t * 0.05); H.cash(l, -cost, 'Tham dự sự kiện giao lưu');
    var kind = U.pick(r, t >= 2 ? ['business', 'investor', 'pro', 'artist'] : ['pro', 'business', 'athlete']);
    var p = C.meet(l, r, { kind: kind, tier: U.clamp(t + (r() < 0.25 ? 1 : 0) - (r() < 0.25 ? 1 : 0), 0, 4), where: t >= 2 ? 'sự kiện câu lạc bộ doanh nhân' : 'một sự kiện cộng đồng' });
    H.fx(l, { soc: 1 });
    log('Bạn làm quen ' + C.label(l, p) + '. Hai người trao đổi số điện thoại, hẹn dịp gặp lại.', 'good');
    return p;
  }
  function partnerSexOK(l, p) { var a = H.partnerSex(l, function () { return 0.01; }), b = H.partnerSex(l, function () { return 0.99; }); return p.sex === a || p.sex === b; }
  function dateWhy(l, p) {
    if (!p.celeb) return 'Chỉ áp dụng với người nổi tiếng trong mạng lưới quen biết';
    if (l.partner && l.partner.alive !== false && l.partner.status !== 'ended') return 'Bạn đang có người yêu / bạn đời';
    if (pAge(l, p) < 18 || l.age < 18) return 'Chỉ dành cho người trưởng thành';
    if (Math.abs(pAge(l, p) - l.age) > 15) return 'Chênh lệch tuổi quá lớn';
    if (!partnerSexOK(l, p)) return 'Không phù hợp xu hướng tình cảm của bạn';
    if (p.trust < 55) return 'Cần thân thiết hơn (tin cậy từ 55)';
    if (p.dateAsk149 === l.age) return 'Đã ngỏ lời năm nay';
    return true;
  }
  X.menu('social149_person', 'Gặp gỡ người quen', function (l) { return free(l); },
    function (l, d) { var p = C.find(l, d && d.arg && d.arg.id); if (!p) return 'Không còn liên lạc.'; return C.label(l, p) + ' · ' + pAge(l, p) + ' tuổi · tin cậy ' + Math.round(p.trust) + '/100. Gặp lần đầu ở ' + p.met[0].where + ' (' + p.met[0].a + ' tuổi); đã gặp ' + p.met.length + ' lần.' + (p.friend149 ? ' Đã là bạn thân.' : '') + (p.inlaw149 ? ' Là thông gia của bạn.' : ''); },
    function (l, arg) {
      var p = C.find(l, arg.id); if (!eligible(p)) return [];
      var rows = [
        { k: 'meal', l: 'Mời cà phê, ăn tối', why: p.mealAt149 === l.age ? 'Đã gặp riêng năm nay' : true, run: function (l, r, log) { meal(l, r, log, p); } },
        { k: 'advice', l: 'Xin lời khuyên về sự nghiệp / kinh doanh', why: p.trust < 60 ? 'Cần tin cậy từ 60' : p.adviceAt149 != null && l.age - p.adviceAt149 < 2 ? 'Vừa xin lời khuyên gần đây' : true, run: function (l, r, log) { advice(l, r, log, p); } },
        { k: 'friend', l: 'Kết thân, coi nhau như bạn bè', why: p.friend149 ? 'Đã là bạn thân' : p.trust < 75 ? 'Cần tin cậy từ 75' : true, run: function (l, r, log) { befriend(l, r, log, p); } }
      ];
      if (p.celeb) {
        rows.push({ k: 'collab', l: 'Mời hợp tác quảng bá', h: mo(l, l.base * (0.5 + p.tier * 0.5)), why: !((l.ventures || []).length || E.BUSINESS123 && (E.BUSINESS123.companies(l) || []).length) ? 'Cần có cơ sở kinh doanh hoặc công ty' : p.collabAt149 === l.age ? 'Đã hợp tác năm nay' : liquid(l) < l.base * (0.5 + p.tier * 0.5) ? 'Chưa đủ tiền thù lao' : true, run: function (l, r, log) { collab(l, r, log, p); } });
        rows.push({ k: 'date', l: 'Ngỏ ý hẹn hò (hai người trưởng thành, tự nguyện)', why: dateWhy(l, p), run: function (l, r, log) { askDate(l, r, log, p); } });
      }
      return rows;
    });
  function meal(l, r, log, p) {
    if (p.mealAt149 === l.age) return false; p.mealAt149 = l.age;
    var gap = Math.max(0, p.tier - C.tier(l)), ok = r() < U.clamp(0.45 + p.trust / 200 + p.warmth / 300 - gap * 0.12, 0.1, 0.95);
    if (!ok) { log(p.name + ' bận lịch, hẹn dịp khác.', 'neutral'); return false; }
    var cost = l.base * 0.01 * (1 + C.tier(l)); if (liquid(l) >= cost) H.cash(l, -cost, 'Mời ' + p.name + ' ăn tối');
    C.seen(l, p, 'bữa tối riêng', Math.round(3 + p.warmth / 25)); H.fx(l, { hap: 1, soc: 1 });
    log('Bạn và ' + p.name + ' trò chuyện cả buổi tối, ' + (p.warmth >= 60 ? 'không khí rất cởi mở.' : 'người ấy khá kiệm lời nhưng lắng nghe chăm chú.'), 'good');
    return true;
  }
  function advice(l, r, log, p) {
    p.adviceAt149 = l.age; C.seen(l, p, 'buổi xin lời khuyên', 1);
    if (p.honesty < 30 && r() < 0.5) { log(p.name + ' khuyên bạn dồn tiền vào một dự án của người quen họ. Nghe có vẻ vội vàng; bạn quyết định không làm theo.', 'neutral'); return 'doubtful'; }
    if (l.job) { l.flags.mentor149 = { name: p.name, at: l.age }; if (l.st) l.st.kno = Math.min(100, (l.st.kno || 0) + 2); }
    C.rep(l, 1);
    log(p.name + ' chia sẻ kinh nghiệm ' + (p.kind === 'business' || p.kind === 'investor' ? 'quản trị và quản lý dòng tiền' : 'phát triển nghề nghiệp') + '. Bạn ghi lại vài điều đáng thử.', 'good');
    return 'good';
  }
  function befriend(l, r, log, p) {
    if (p.friend149) return false;
    if (r() > U.clamp(0.4 + p.warmth / 150, 0.2, 0.95)) { C.seen(l, p, 'lời mời kết thân', 0); log(p.name + ' quý bạn nhưng vẫn giữ khoảng cách trong công việc.', 'neutral'); return false; }
    p.friend149 = true; l.friends = l.friends || [];
    if (l.friends.length < 12) l.friends.push({ name: p.name, sex: p.sex, close: 70, from: 'giới ' + ({ business: 'doanh nhân', investor: 'đầu tư', artist: 'nghệ sĩ', pro: 'chuyên gia', athlete: 'thể thao' }[p.kind] || 'quen biết'), alive: true, contact149: p.uid110, since: l.age });
    C.seen(l, p, 'trở thành bạn thân', 5);
    log('Bạn và ' + p.name + ' trở thành bạn thân, thỉnh thoảng gọi điện hỏi thăm gia đình nhau.', 'good');
    return true;
  }
  function collab(l, r, log, p) {
    var fee = l.base * (0.5 + p.tier * 0.5); if (p.collabAt149 === l.age || liquid(l) < fee) return false;
    p.collabAt149 = l.age;
    if (r() > U.clamp(0.3 + p.trust / 150, 0.1, 0.9)) { log(p.name + ' từ chối lời mời quảng bá vì không hợp hình ảnh cá nhân.', 'neutral'); return false; }
    H.cash(l, -fee, 'Thù lao quảng bá của ' + p.name);
    var good = r() < 0.75;
    if (good) { C.rep(l, 2); l.fame = (l.fame || 0) + Math.round(500 + p.tier * 2000); (l.ventures || []).forEach(function (v) { v.good = (v.good || 0) + 1; }); }
    else C.rep(l, -1);
    C.seen(l, p, 'hợp tác quảng bá', good ? 3 : -2);
    log(good ? 'Chiến dịch quảng bá cùng ' + p.name + ' được đón nhận, thương hiệu của bạn được nhiều người biết đến.' : 'Chiến dịch cùng ' + p.name + ' không như kỳ vọng; khán giả cho rằng nội dung gượng ép.', good ? 'good' : 'neutral');
    return good;
  }
  // Hẹn hò với người nổi tiếng dùng đúng quy trình bắt đầu hẹn hò của game.
  function askDate(l, r, log, p) {
    if (dateWhy(l, p) !== true) return false;
    p.dateAsk149 = l.age;
    var looks = E.LOOKS134 && E.LOOKS134.looks ? E.LOOKS134.looks(l) : 50;
    var ch = U.clamp(0.15 + (p.trust - 55) / 120 + p.warmth / 400 + (looks - 50) / 300 + ((l.fame || 0) > 1e5 ? 0.05 : 0), 0.05, 0.75);
    if (r() >= ch) { C.seen(l, p, 'lời ngỏ hẹn hò', -2); log(p.name + ' từ chối nhẹ nhàng, muốn giữ tình bạn. Bạn tôn trọng quyết định đó.', 'neutral'); return false; }
    var d = E.DEC.love.make(l, r, { where: 'qua mối quen biết' });
    d.data.p.name = p.name; d.data.p.sex = p.sex; d.data.p.age = pAge(l, p); d.data.p.job = p.job;
    E.DEC.love.apply(l, d, 'yes', r, log);
    if (!l.partner || l.partner.name !== p.name) return false;
    l.partner.contact149 = p.uid110; l.partner.job = p.job; l.partner.celeb149 = true;
    p.partner149 = true; C.seen(l, p, 'bắt đầu hẹn hò', 5);
    l.fame = (l.fame || 0) + Math.round(1000 + p.tier * 5000);
    log('Chuyện bạn hẹn hò ' + p.name + ' nhanh chóng lên mạng. Danh tiếng tăng, nhưng đời tư cũng bị chú ý nhiều hơn.', 'neutral');
    return true;
  }

  // ===================================================================
  // D3. Mặt tối giới giải trí: lạm quyền, gạ gẫm trao đổi lợi ích, ép buộc
  // ===================================================================
  function showbiz(l) { var c = l.job && E.CAR[l.job]; return !!(c && c.fame) || !!(l.flags.agency139 || l.flags.trainee139); }
  var DARK = [
    { k: 'favor', t: 'Một nhà sản xuất có quyền lực ngỏ ý trao vai chính, kèm gợi ý “gặp riêng để hiểu nhau hơn” — một lời trao đổi lợi ích không phù hợp.' },
    { k: 'contract', t: 'Công ty quản lý ép bạn ký phụ lục hợp đồng chia thu nhập bất lợi, dọa “đóng băng” nếu không ký ngay.' },
    { k: 'overwork', t: 'Quản lý bắt bạn chạy lịch liên tục, cấm nghỉ ốm và đe dọa phạt hợp đồng nếu lên tiếng.' }
  ];
  E.SC('dark149', {
    title: 'Áp lực phía sau ánh đèn',
    prep: function (l, r) { var x = U.pick(r, DARK), p = C.meet(l, r, { kind: x.k === 'favor' ? 'artist' : 'business', tier: Math.max(2, C.tier(l) + 1), where: 'công việc trong giới giải trí', age: 50 }); p.abuser149 = true; p.trust = 10; return { at: l.age, kind: x.k, pid: p.uid110 }; },
    valid: function (l, d) { return showbiz(l) && free(l) === true && (!d || d.at == null || d.at === l.age && !d.done); },
    text: function (l, d) { var x = DARK.find(function (y) { return y.k === (d && d.kind); }) || DARK[0], p = C.find(l, d && d.pid); return x.t + (p ? ' Người liên quan: ' + C.label(l, p) + '.' : '') + ' Từ chối không làm bạn mất cơ hội nổi tiếng bằng thực lực; nhưng có thể có cái giá ngắn hạn.'; },
    opts: [
      { k: 'refuse', l: 'Từ chối dứt khoát', h: 'có thể mất cơ hội này', ai: { w: 2 }, run: function (l, r, log, d) { darkStart(l, r, log, d, 'refuse'); } },
      { k: 'help', l: 'Tìm sự hỗ trợ: luật sư, hiệp hội nghề nghiệp, người tin cậy', h: 'tốn chi phí, cần thời gian', ai: { w: 2 }, run: function (l, r, log, d) { darkStart(l, r, log, d, 'help'); } },
      { k: 'expose', l: 'Lên tiếng công khai', h: 'được ủng hộ hoặc bị phản bác', ai: { w: 0.5 }, run: function (l, r, log, d) { darkStart(l, r, log, d, 'expose'); } },
      { k: 'leave', l: 'Rời công ty / đổi hướng đi', h: 'bắt đầu lại ở nơi lành mạnh hơn', ai: { w: 1 }, run: function (l, r, log, d) { darkStart(l, r, log, d, 'leave'); } }
    ]
  });
  E.TRIG.push({ id: 'dark149', when: function (l) { var s = l.flags.social149; return l.alive && l.age >= 18 && showbiz(l) && !(s && s.darkCase && !s.darkCase.closed) && !(s && s.darkAt != null && l.age - s.darkAt < 6); }, p: 0.08 });
  function darkStart(l, r, log, d, choice) {
    var s = S(l); if (d && d.done) return; if (d) d.done = true;
    s.darkAt = l.age;
    var p = C.find(l, d && d.pid), name = p ? p.name : 'người đó';
    var c = { kind: d && d.kind, pid: d && d.pid, choice: choice, at: l.age, closed: false, notes: [] };
    if (choice === 'refuse') {
      c.closed = true; c.result = 'từ chối';
      if (r() < 0.35) { s.slowUntil = l.age + 2; log('Bạn từ chối. Vai diễn / hợp đồng về tay người khác, vài dự án sau đó im lặng không phản hồi. Bạn vẫn giữ được mình và tiếp tục làm nghề bằng thực lực.', 'neutral'); }
      else log('Bạn từ chối thẳng thắn. ' + name + ' không làm khó thêm; bạn tập trung vào những dự án đàng hoàng.', 'good');
      H.fx(l, { hap: -1 });
    } else if (choice === 'help') {
      var cost = l.base * 0.15; if (liquid(l) >= cost) H.cash(l, -cost, 'Tư vấn pháp lý');
      c.until = l.age + 1 + (r() < 0.5 ? 1 : 0); c.evidence = true;
      log('Bạn ghi lại sự việc, tìm luật sư và báo với hiệp hội nghề nghiệp. Vụ việc được tiếp nhận, cần thời gian xác minh.', 'neutral');
    } else if (choice === 'expose') {
      c.until = l.age + 1; c.evidence = r() < 0.5;
      l.fame = (l.fame || 0) + 2000;
      log('Bạn kể lại sự việc trên mạng xã hội. Dư luận chia làm hai luồng; nhiều người chờ xem bằng chứng.', 'neutral');
    } else {
      c.closed = true; c.result = 'đổi hướng';
      l.flags.leftAgency149 = l.age; if (l.flags.agency139) l.flags.agency139.left149 = l.age;
      H.fx(l, { hap: 2 });
      log('Bạn chấm dứt hợp tác, chuyển sang một công ty nhỏ minh bạch hơn. Thu nhập trước mắt giảm, nhưng bạn được làm việc an tâm.', 'good');
    }
    s.darkCase = c;
  }
  function darkYear(l, r, log) {
    var s = l.flags.social149, c = s && s.darkCase; if (!c || c.closed || c.until == null || l.age < c.until) return;
    var p = C.find(l, c.pid), name = p ? p.name : 'người đó';
    if (c.choice === 'help') {
      if (r() < 0.7) { c.result = 'được bảo vệ'; C.rep(l, 2); if (p) p.alive !== false && (p.sanctioned149 = true); log('Hiệp hội nghề nghiệp kết luận có sai phạm; ' + name + ' bị đình chỉ công việc. Bạn được bảo vệ và tiếp tục nhận dự án mới.', 'good'); }
      else { c.result = 'chưa đủ căn cứ'; log('Vụ việc khép lại vì chưa đủ căn cứ, nhưng hồ sơ của bạn được lưu lại để bảo vệ người đến sau.', 'neutral'); }
    } else if (c.choice === 'expose') {
      if (c.evidence || r() < 0.4) { c.result = 'dư luận ủng hộ'; C.rep(l, 3); l.fame = (l.fame || 0) + 5000; if (p) p.sanctioned149 = true; log('Nhiều người khác lên tiếng xác nhận câu chuyện của bạn. ' + name + ' bị điều tra; bạn được công chúng ủng hộ.', 'good'); }
      else { c.result = 'bị phản bác'; C.rep(l, -3); H.fx(l, { hap: -4 }); log(name + ' phủ nhận và dọa kiện. Bạn chịu nhiều chỉ trích, nhưng vẫn có những người lặng lẽ cảm ơn vì đã lên tiếng.', 'bad'); }
    }
    c.closed = true;
  }

  // ===================================================================
  // D4. Giới thiệu con trưởng thành với con / người quen có thật trong mạng lưới
  // ===================================================================
  function kidsOf(l, p) {
    if (p.kids149) return p.kids149;
    var r = seeded(p.uid110 + ':kids'), n = Math.floor(r() * 3.2), out = [];
    for (var i = 0; i < n; i++) { var sex = r() < 0.5 ? 'M' : 'F', k = { name: H.stranger(l, r, sex), sex: sex, birth: p.birth + 22 + Math.floor(r() * 14), job: U.pick(r, ['kỹ sư', 'bác sĩ', 'giáo viên', 'nhân viên ngân hàng', 'kiến trúc sư', 'quản lý kinh doanh', 'nhà thiết kế']), alive: true, married: false, parent149: p.uid110 }; X.uid(l, k); out.push(k); }
    p.kids149 = out; return out;
  }
  function wantSex(k, r) { return k.orient === 'gay' ? k.sex : k.orient === 'bi' ? null : k.sex === 'M' ? 'F' : 'M'; }
  function candidates(l, k) {
    var a = l.age - k.born, out = [], want = wantSex(k);
    C.contacts(l, eligible).forEach(function (p) {
      kidsOf(l, p).forEach(function (c) { var ca = yr(l) - c.birth; if (c.alive !== false && !c.married && !c.matched149 && ca >= 18 && Math.abs(ca - a) <= 8 && (!want || c.sex === want)) out.push({ c: c, p: p }); });
    });
    return out.slice(0, 10);
  }
  X.menu('matchmaking149', 'Giới thiệu đối tượng cho con', function (l) { var w = free(l); if (w !== true) return w; return (l.kids || []).some(function (k) { return k.alive !== false && l.age - k.born >= 18 && !k.married; }) ? true : 'Cần có con trưởng thành chưa lập gia đình'; },
    function (l) { return 'Người được giới thiệu là con của những người bạn thật sự quen biết. Gia đình bên kia có thể từ chối; con bạn cũng có quyền nói không. Giới thiệu không đồng nghĩa kết hôn.'; },
    function (l) {
      var rows = [];
      (l.kids || []).filter(function (k) { return k.alive !== false && l.age - k.born >= 18 && !k.married; }).forEach(function (k) {
        var s = E.FAMILY126 ? E.FAMILY126.init(l, k) : {};
        candidates(l, k).forEach(function (x) {
          rows.push({ k: X.uid(l, k) + '>' + x.c.uid110, l: 'Giới thiệu ' + k.name + ' với ' + x.c.name + ' (' + (yr(l) - x.c.birth) + ' tuổi, ' + x.c.job + ', con của ' + x.p.name + ')',
            why: s.match ? k.name + ' đang tìm hiểu một người khác' : s.matchAt === l.age ? 'Đã giới thiệu cho ' + k.name + ' năm nay' : x.p.trust < 40 ? 'Chưa đủ thân với ' + x.p.name + ' (tin cậy từ 40)' : true,
            run: function (l, r, log) { introduce(l, r, log, k, x.c, x.p); } });
        });
      });
      return rows;
    }, 18, 'Tình cảm & gia đình');
  function introduce(l, r, log, k, c, p) {
    var s = E.FAMILY126 ? E.FAMILY126.init(l, k) : {}; if (s.match || s.matchAt === l.age) return null;
    s.matchAt = l.age;
    var comp = seeded(X.uid(l, k) + '|' + c.uid110)();
    if (r() >= U.clamp(0.3 + (p.trust - 40) / 150 + comp * 0.3, 0.1, 0.9)) {
      C.seen(l, p, 'lời đề nghị làm quen cho hai con', 0);
      log('Gia đình ' + p.name + ' cảm ơn nhưng cho biết ' + c.name + ' ' + U.pick(r, ['đang tập trung cho công việc', 'chưa muốn tìm hiểu ai', 'muốn tự tìm người phù hợp']) + '.', 'neutral');
      return false;
    }
    C.seen(l, p, 'bàn chuyện giới thiệu hai con', 2);
    X.next(l, 'childMatch126', r, { id: k.parentId, person: { name: c.name, sex: c.sex, age: yr(l) - c.birth, home: l.city || l.countryName || 'cùng thành phố', education: 'Đã hoàn thành học vấn phù hợp công việc', job: c.job, family: 'con của ' + p.name + ' (' + p.job.toLowerCase() + ')', values: U.pick(r, ['ưu tiên sự nghiệp', 'mong muốn gần gia đình', 'ưa cuộc sống giản dị']), compatibility: comp, uid149: c.uid110, contact149: p.uid110 } });
    return true;
  }
  function findKid(l, id) { var hit = null; C.people(l).forEach(function (p) { (p.kids149 || []).forEach(function (c) { if (c.uid110 === id) hit = c; }); }); return hit; }
  // Đồng bộ kết quả: con cưới đúng người được giới thiệu → hai nhà thành thông gia; dừng tìm hiểu → người kia được tự do.
  function syncMatches(l) {
    if (!l.flags.elite148) return;
    var held = {};
    (l.kids || []).forEach(function (k) {
      var s = k.future126 || null, sp = k.spouse126, m = s && s.match && s.match.person;
      if (k.married && sp && sp.uid149) { var c = findKid(l, sp.uid149), q = C.find(l, sp.contact149); held[sp.uid149] = 1; if (c && !c.married) { c.married = true; c.matched149 = X.uid(l, k); if (q) { q.inlaw149 = X.uid(l, k); C.seen(l, q, 'đám cưới của hai con', 8); } } }
      else if (m && m.uid149) { held[m.uid149] = 1; var mc = findKid(l, m.uid149); if (mc) mc.matched149 = X.uid(l, k); }
      var pr = s && s.proposal129 && s.proposal129.person; if (pr && pr.uid149) held[pr.uid149] = 1;
    });
    C.people(l).forEach(function (p) { (p.kids149 || []).forEach(function (c) { if (c.matched149 && !c.married && !held[c.uid110]) delete c.matched149; }); });
  }
  ['childMatch126', 'childWedding129'].forEach(function (id) { var D = E.DEC[id]; if (!D) return; var ap = D.apply; D.apply = function (l) { var out = ap.apply(this, arguments); if (l && l.alive) syncMatches(l); return out; }; });
  if (E.childMarriage126) { var cm = E.childMarriage126; E.childMarriage126 = function (l) { var out = cm.apply(this, arguments); syncMatches(l); return out; }; }

  // ===================================================================
  // D5. Quà tặng người thân (đồ vật thuộc về người nhận, ghi trong sổ tài sản chung)
  // ===================================================================
  var GIFT = {
    ring: { n: 'Nhẫn', tiers: [['Nhẫn vàng trơn', 0.05], ['Nhẫn kim cương nhỏ', 0.5], ['Nhẫn kim cương cao cấp', 3]] },
    jewelry: { n: 'Trang sức', tiers: [['Dây chuyền bạc', 0.03], ['Bộ trang sức vàng', 0.3], ['Bộ trang sức đá quý', 2]] },
    watch: { n: 'Đồng hồ', tiers: [['Đồng hồ thời trang', 0.02], ['Đồng hồ cơ Thụy Sĩ', 0.3], ['Đồng hồ xa xỉ', 3]] },
    phone: { n: 'Điện thoại', tiers: [['Điện thoại phổ thông', 0.01], ['Điện thoại tầm trung', 0.03], ['Điện thoại cao cấp', 0.08]] },
    laptop: { n: 'Máy tính xách tay', tiers: [['Laptop học tập', 0.02], ['Laptop văn phòng mạnh', 0.06], ['Laptop cao cấp', 0.15]] },
    motorbike: { n: 'Xe máy', min: 18, tiers: [['Xe số phổ thông', 0.1], ['Xe tay ga', 0.4], ['Mô tô phân khối lớn', 1.5]] },
    car: { n: 'Ô tô', min: 18, tiers: [['Ô tô cỡ nhỏ', 2], ['Ô tô hạng sang', 6], ['Ô tô sang trọng cao cấp', 20]] },
    supercar: { n: 'Siêu xe', min: 21, tier: 3, tiers: [['Siêu xe thể thao', 30], ['Siêu xe phiên bản giới hạn', 80]] }
  };
  function recipients(l) {
    var out = [];
    function add(p, kind, age) { if (p && p.alive !== false) out.push({ id: X.uid(l, p), p: p, name: p.name, kind: kind, age: age }); }
    if (l.partner && l.partner.status !== 'ended') add(l.partner, l.partner.status === 'married' ? 'vợ/chồng' : 'người yêu', l.partner.age);
    (l.kids || []).forEach(function (k) { if (l.age - k.born >= 6) add(k, 'con', l.age - k.born); });
    (l.sibList || []).forEach(function (s) { add(s, 'anh/chị/em', l.age - s.born); });
    if (l.fam) [['m', 'mẹ'], ['f', 'bố']].forEach(function (x) { if (x[0] === 'm' ? l.fam.mAlive && !l.fam.noMom : l.fam.fAlive && !l.fam.noDad) { var o = l.fam['parent149' + x[0]] || (l.fam['parent149' + x[0]] = { name: x[1], uid110: 'parent:' + x[0] }); out.push({ id: 'parent:' + x[0], p: o, name: x[1], kind: 'bố mẹ', age: (x[0] === 'm' ? l.fam.mAge : l.fam.fAge) + l.age }); } });
    return out;
  }
  function recipient(l, id) { return recipients(l).find(function (x) { return x.id === id; }) || null; }
  function giftsTo(l, id) { return C.items(l).filter(function (x) { return x.owner === id; }); }
  X.menu('gifts149', 'Tặng quà người thân', function (l) { var w = free(l); if (w !== true) return w; return recipients(l).length ? true : 'Chưa có người thân để tặng quà'; },
    function (l) { return 'Chọn người nhận rồi chọn món quà. Món quà thuộc về người nhận sau khi trao; người nhận có thể từ chối món quá đắt. Mỗi người một món quà lớn mỗi năm.'; },
    function (l) { return recipients(l).map(function (x) { var g = giftsTo(l, x.id); return { k: x.id, l: x.name + ' (' + x.kind + ', ' + x.age + ' tuổi)' + (g.length ? ' · đã tặng ' + g.length + ' món' : ''), why: once(l, 'gift:' + x.id) ? 'Đã tặng quà lớn năm nay' : true, run: function (l, r) { X.next(l, 'gifts149_pick', r, { to: x.id }); } }; }); }, 18, 'Tình cảm & gia đình');
  X.menu('gifts149_pick', 'Chọn món quà', function (l) { return free(l); },
    function (l, d) { var x = recipient(l, d && d.arg && d.arg.to); return x ? 'Quà cho ' + x.name + '. Tiền mặt hiện có ' + mo(l, liquid(l)) + '.' : 'Không tìm thấy người nhận.'; },
    function (l, arg) {
      var x = recipient(l, arg.to); if (!x) return [];
      var rows = [];
      Object.keys(GIFT).forEach(function (c) {
        var g = GIFT[c];
        g.tiers.forEach(function (t, i) {
          var price = t[1] * l.base, why = g.min && x.age < g.min ? 'Người nhận cần từ ' + g.min + ' tuổi' : g.tier && C.tier(l) < g.tier ? 'Cần thuộc tầng ' + C.TIERS[g.tier].n : liquid(l) < price + reserve(l) ? 'Chưa đủ tiền mặt' : true;
          if (why !== true && /tuổi|tầng/.test(why) && i > 0) return;
          rows.push({ k: c + ':' + i, l: t[0], h: mo(l, price), why: why, run: function (l, r, log) { give(l, r, log, x.id, c, i); } });
        });
      });
      return rows;
    });
  function give(l, r, log, to, cat, i) {
    var x = recipient(l, to), g = GIFT[cat], t = g && g.tiers[i]; if (!x || !t || once(l, 'gift:' + to)) return null;
    var price = t[1] * l.base; if (liquid(l) < price + reserve(l)) return null;
    mark(l, 'gift:' + to);
    var close = x.p.close == null ? (x.kind === 'bố mẹ' ? 70 : 55) : x.p.close, rel = price / Math.max(l.base * 0.05, E.netWorth(l) * 0.02);
    // Món quá đắt so với khả năng của bạn hoặc độ thân thiết dễ bị từ chối (bố mẹ lo bạn tiêu hoang, người yêu mới quen ngại)
    var refuse = rel > 1 ? U.clamp((rel - 1) * 0.15 + (x.kind === 'bố mẹ' ? 0.15 : 0) + (x.kind === 'người yêu' && l.age - (x.p.since == null ? l.age : x.p.since) < 1 ? 0.2 : 0) - (close - 60) / 200, 0, 0.8) : 0;
    if (r() < refuse) { log(x.name + ' không nhận ' + t[0].toLowerCase() + ': "Đắt quá, giữ tiền mà lo việc khác." Bạn chưa phải trả tiền.', 'neutral'); return false; }
    H.cash(l, -price, 'Quà tặng ' + x.name + ': ' + t[0]);
    var item = C.addItem(l, { cat: 'gift:' + cat, name: t[0], buy: price, value: price * (cat === 'phone' || cat === 'laptop' ? 0.6 : cat === 'car' || cat === 'motorbike' || cat === 'supercar' ? 0.85 : 0.95), owner: to, ownerName: x.name, from: 'quà của bạn' });
    var gain = Math.round(U.clamp(2 + Math.log(1 + price / (l.base * 0.05)) * 2, 2, 12));
    if (x.p.close != null || x.kind !== 'bố mẹ') x.p.close = U.clamp(close + gain, 0, 100);
    if (x.kind === 'bố mẹ' && E.NPC) E.NPC.adjustTrust(l, to, Math.ceil(gain / 2));
    if (x.kind === 'người yêu' || x.kind === 'vợ/chồng') x.p.affection108 = U.clamp((x.p.affection108 == null ? 60 : x.p.affection108) + gain, 0, 100);
    if ((cat === 'car' || cat === 'supercar' || cat === 'motorbike') && x.kind === 'con') x.p.veh149 = t[0];
    log('Bạn tặng ' + x.name + ' ' + t[0].toLowerCase() + ' (' + mo(l, price) + '). ' + U.cap(x.name) + ' rất vui; món quà từ nay thuộc về ' + x.name + '.', 'good');
    return item;
  }

  // ===================================================================
  // D6. Chuỗi cầu hôn: chuẩn bị → cầu hôn (nhẫn tùy chọn, chọn nơi) → nhận lời / từ chối → bàn chuyện cưới
  // ===================================================================
  var VENUE = {
    home: { n: 'Ở nhà, bữa tối tự nấu', cost: 0.005, pub: 0 },
    garden: { n: 'Khu vườn trang trí riêng', cost: 0.05, pub: 0 },
    restaurant: { n: 'Nhà hàng lãng mạn', cost: 0.03, pub: 1 },
    hotel: { n: 'Phòng tiệc khách sạn trên cao', cost: 0.15, pub: 1, tier: 1 },
    concert: { n: 'Trên sân khấu một buổi hòa nhạc', cost: 0.3, pub: 2, tier: 1 },
    yacht: { n: 'Trên du thuyền lúc hoàng hôn', cost: 0.6, pub: 0, tier: 3, cat: 'yacht' }
  };
  function pref(l, p) { if (!p.propPref149) { var x = seeded((p.relation108 || p.name) + ':pref')(); p.propPref149 = x < 0.35 ? 'private' : x < 0.65 ? 'simple' : 'grand'; } return p.propPref149; }
  function bond(l, p) { return p.affection108 == null ? Math.min(85, 35 + Math.max(0, l.age - (p.since == null ? l.age : p.since)) * 10) : p.affection108; }
  function engaged(l) { return !!(l.partner && l.partner.engaged149 && l.partner.status === 'dating'); }
  function ringsOwned(l) { return C.mine(l).filter(function (x) { return x.cat === 'ring' || x.cat === 'gift:ring'; }); }
  function proposeWhy(l) {
    var w = free(l); if (w !== true) return w;
    var p = l.partner; if (!p || p.alive === false || p.status !== 'dating') return 'Cần đang hẹn hò';
    if (p.age < 18) return 'Người ấy cần đủ 18 tuổi';
    return true;
  }
  X.menu('proposal149', 'Cầu hôn', proposeWhy,
    function (l) { var p = l.partner; if (!p) return ''; return engaged(l) ? 'Bạn và ' + p.name + ' đã đính hôn từ năm ' + p.engaged149.at + ' tuổi. Đám cưới do hai người cùng quyết định.' : 'Tình cảm với ' + p.name + ': ' + Math.round(bond(l, p)) + '/100, bên nhau ' + Math.max(0, l.age - p.since) + ' năm. Nhẫn không bắt buộc; điều quan trọng là thời điểm và cách bày tỏ hợp với người ấy. Người ấy có thể từ chối.'; },
    function (l) {
      var p = l.partner; if (!p) return [];
      var rows = [];
      if (engaged(l)) rows.push({ k: 'wedding', l: 'Bàn chuyện cưới', run: function (l, r) { X.next(l, 'marry', r); } });
      else {
        var wait = p.proposeAt149 != null && l.age - p.proposeAt149 < 1 ? 'Vừa cầu hôn gần đây, nên chờ thêm' : true;
        rows.push({ k: 'none', l: 'Cầu hôn không cần nhẫn', why: wait, run: function (l, r) { X.next(l, 'proposal149_venue', r, { ring: null }); } });
        ringsOwned(l).forEach(function (x) { rows.push({ k: 'own:' + x.uid110, l: 'Dùng ' + x.name.toLowerCase() + ' đang có', why: wait, run: function (l, r) { X.next(l, 'proposal149_venue', r, { ring: x.uid110 }); } }); });
        GIFT.ring.tiers.forEach(function (t, i) { var price = t[1] * l.base; rows.push({ k: 'buy:' + i, l: 'Mua ' + t[0].toLowerCase() + ' rồi cầu hôn', h: mo(l, price), why: wait !== true ? wait : liquid(l) < price + reserve(l) ? 'Chưa đủ tiền mặt' : true, run: function (l, r, log) { H.cash(l, -price, 'Mua ' + t[0].toLowerCase()); var x = C.addItem(l, { cat: 'ring', name: t[0], buy: price, value: price * 0.7 }); log('Bạn chọn ' + t[0].toLowerCase() + ' (' + mo(l, price) + ').', 'neutral'); X.next(l, 'proposal149_venue', r, { ring: x.uid110 }); } }); });
        rows.push({ k: 'skip', l: 'Không cầu hôn, bàn thẳng chuyện về chung nhà', run: function (l, r) { X.next(l, 'marry', r); } });
      }
      return rows;
    });
  X.menu('proposal149_venue', 'Chọn nơi cầu hôn', proposeWhy,
    function (l) { return 'Mỗi người có cách cảm nhận riêng: có người thích riêng tư, có người thích bất ngờ trước đông người, có người chỉ cần sự chân thành.'; },
    function (l, arg) {
      if (engaged(l)) return [];
      return Object.keys(VENUE).map(function (k) { var v = VENUE[k], c = l.base * v.cost * (v.cat && C.mine(l).some(function (x) { return x.cat === v.cat; }) ? 0.2 : 1); return { k: k, l: v.n, h: mo(l, c), why: v.tier && C.tier(l) < v.tier && !(v.cat && C.mine(l).some(function (x) { return x.cat === v.cat; })) ? 'Cần thuộc tầng ' + C.TIERS[v.tier].n : liquid(l) < c ? 'Chưa đủ tiền' : true, run: function (l, r, log) { propose(l, r, log, arg.ring, k); } }; });
    });
  function acceptChance(l, ringItem, venue) {
    var p = l.partner, v = VENUE[venue], pr = pref(l, p), b = bond(l, p), years = l.age - (p.since == null ? l.age : p.since);
    var c = 0.1 + (b - 50) / 60 + Math.min(2, years) * 0.08;
    if (pr === 'private' && v.pub === 2) c -= 0.3; else if (pr === 'private' && v.pub === 1) c -= 0.05;
    if (pr === 'grand' && v.pub >= 1) c += 0.08;
    if (!ringItem && pr === 'grand') c -= 0.08;
    if (ringItem && pr === 'simple' && ringItem.buy > l.base * 2) c -= 0.03;
    if (years < 1) c -= 0.2;
    if (l.flags.affair107 && l.flags.affair107.known) c -= 0.4;
    return U.clamp(c, 0.03, 0.95);
  }
  function propose(l, r, log, ringId, venue) {
    var p = l.partner; if (proposeWhy(l) !== true || engaged(l) || !VENUE[venue]) return null;
    if (p.proposeAt149 != null && l.age - p.proposeAt149 < 1) return null;
    var v = VENUE[venue], ring = ringId ? C.mine(l).find(function (x) { return x.uid110 === ringId; }) : null;
    var cost = l.base * v.cost * (v.cat && C.mine(l).some(function (x) { return x.cat === v.cat; }) ? 0.2 : 1);
    if (liquid(l) < cost) return null;
    H.cash(l, -cost, 'Chuẩn bị cầu hôn: ' + v.n.toLowerCase());
    p.proposeAt149 = l.age;
    var ch = acceptChance(l, ring, venue), yes = r() < ch;
    if (yes) {
      p.engaged149 = { at: l.age, venue: venue, ring: ring ? ring.uid110 : null };
      p.affection108 = Math.max(bond(l, p) + 8, 75);
      if (ring) C.transfer(l, ring, X.uid(l, p), p.name);
      H.fx(l, { hap: 8 }); H.mem(l, 'Ngày ' + p.name + ' gật đầu nhận lời cầu hôn ' + v.n.toLowerCase() + '.', 5);
      log(p.name + ' nhận lời cầu hôn' + (ring ? ' và đeo ' + ring.name.toLowerCase() : '') + '. Hai bạn đính hôn; ngày cưới sẽ do hai người cùng bàn.', 'big');
    } else {
      p.affection108 = U.clamp(bond(l, p) - (v.pub === 2 ? 10 : 5), 0, 100);
      H.fx(l, { hap: v.pub === 2 ? -8 : -4 });
      if (v.pub === 2) C.rep(l, -1);
      var why = l.age - (p.since == null ? l.age : p.since) < 1 ? 'thấy hai người quen nhau còn quá ngắn' : pref(l, p) === 'private' && v.pub ? 'bối rối vì bị cầu hôn trước đông người' : bond(l, p) < 70 ? 'chưa sẵn sàng gắn bó cả đời' : 'muốn ổn định công việc trước đã';
      log(p.name + ' chưa nhận lời: ' + why + '. ' + (ring ? 'Chiếc nhẫn vẫn là của bạn. ' : '') + 'Có thể thử lại khi cả hai sẵn sàng hơn.', 'bad');
    }
    return { yes: yes, chance: ch };
  }
  // Chế độ Tự động chọn như một người bình thường: đã đính hôn thì bàn chuyện cưới; chưa thì cầu hôn giản dị hoặc bàn thẳng chuyện về chung nhà.
  function autoPick(prefs) { return function (l, d, r) { var keys = d.data && d.data.keys || []; for (var i = 0; i < prefs.length; i++) { var j = keys.indexOf(typeof prefs[i] === 'function' ? prefs[i](r) : prefs[i]); if (j >= 0 && d.opts.some(function (o) { return o.k === String(j); })) return String(j); } return 'cancel'; }; }
  E.DEC.proposal149.auto = autoPick(['wedding', function (r) { return r() < 0.5 ? 'none' : 'skip'; }, 'skip', 'none']);
  E.DEC.proposal149_venue.auto = autoPick([function (r) { return r() < 0.5 ? 'home' : 'restaurant'; }, 'home', 'restaurant', 'garden']);
  // Nút "Cầu hôn / về chung nhà" sẵn có mở chuỗi cầu hôn; các luồng cưới cũ vẫn giữ nguyên.
  E.ACT.forEach(function (a) { if (a.id === 'cau_hon') a.sc = 'proposal149'; });
  // Đính hôn kết thúc khi chia tay hoặc đã cưới
  var ma = E.DEC.marry.apply;
  function settleEngagement(p, l) { if (p && p.engaged149 && (p.status !== 'dating' || l.partner !== p)) { p.engagedDone149 = p.engaged149; delete p.engaged149; } }
  E.DEC.marry.apply = function (l, d, k) { var p = l.partner, out = ma.apply(this, arguments); settleEngagement(p, l); return out; };
  if (E.DEC.contract108) { var ca = E.DEC.contract108.apply; E.DEC.contract108.apply = function (l) { var p = l.partner, out = ca.apply(this, arguments); settleEngagement(p, l); return out; }; }

  // ===================================================================
  // Vòng năm: tin đồn đời tư khi hẹn hò người nổi tiếng, vụ việc giới giải trí
  // ===================================================================
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive) return;
    if (l.partner && l.partner.celeb149 && l.partner.status === 'dating' && r() < 0.15) { l.fame = (l.fame || 0) + 800; H.fx(l, { hap: -1 }); log('Ảnh hai bạn đi ăn tối bị chụp lén và lan khắp mạng. Nhiều người chúc mừng, cũng có những bình luận khó nghe.', 'neutral'); }
    if (l.flags.social149) darkYear(l, r, log);
    syncMatches(l);
    settleEngagement(l.partner, l);
  });
  // Hồ sơ con: tài sản riêng đọc từ sổ tài sản chung
  if (E.CHILD147) {
    var facts = E.CHILD147.facts;
    E.CHILD147.facts = function (l, k) {
      var out = facts.apply(this, arguments), own = l.flags.elite148 ? C.items(l).filter(function (x) { return x.owner === k.uid110; }) : [];
      if (own.length) out.forEach(function (f) { if (f[0] === 'Tài sản riêng') f[1] = own.map(function (x) { return x.name + ' (' + mo(l, x.value) + ')'; }).join(', '); });
      return out;
    };
  }

  E.SOCIAL149 = { S: S, event: event, meal: meal, advice: advice, befriend: befriend, collab: collab, askDate: askDate, dateWhy: dateWhy, darkStart: darkStart, darkYear: darkYear, showbiz: showbiz,
    kidsOf: kidsOf, candidates: candidates, introduce: introduce, recipients: recipients, give: give, giftsTo: giftsTo, GIFT: GIFT,
    propose: propose, acceptChance: acceptChance, pref: pref, engaged: engaged, VENUE: VENUE };
})(globalThis.G);
