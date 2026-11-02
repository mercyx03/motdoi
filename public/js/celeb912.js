/* Mở rộng quan hệ với người nổi tiếng (912) — xây trên mạng lưới NPC giới thượng lưu (life148, E.ELITE148), không tạo danh bạ song song.
   · Người nổi tiếng là các contact có cờ celeb của life148 (giữ uid110, năm sinh, nghề, tính cách ẩn, lịch sử gặp). Mỗi năm có thể
     gặp thêm vài người mới, ưu tiên người trưởng thành trẻ (18–35) nhưng vẫn giữ cơ hội với người lớn tuổi; NPC đang có không bị trẻ hóa.
   · Chuỗi thật: lời mời làm quen → phản hồi → đi chơi riêng → phát triển tin cậy → ngỏ ý hẹn hò; tặng quà chỉ tăng tin cậy có giới hạn,
     không nhảy cóc giai đoạn. Đề nghị một đêm chỉ cho hai người từ 18 tuổi, tự nguyện, có thể bị từ chối.
   · Mỗi năm nhiều tương tác (tối đa 10, mỗi người 6) để có thể từ quen biết thành người yêu trong một năm nếu hợp nhau.
   · Người đã kết hôn không tự bỏ vợ/chồng: từ chối hẹn hò; một đêm hiếm khi đồng ý và có nguy cơ bị lộ.
   · Khi thành người yêu, l.partner giữ liên kết contact148 = uid110 để đi tiếp qua hẹn hò → kết hôn của hệ có sẵn.
   · Tình trạng hôn nhân/độ nổi tiếng cập nhật mỗi năm đúng một lần; không hiển thị thông tin sức khỏe/bí mật. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, C = E.ELITE148;
  if (!C) return;
  var V = 1;
  // Tham số gameplay.
  var BAL = { yearMax: 10, personMax: 6, newPerYear: 3, youngShare: 0.6, trustDate: 60, giftCap: 70, giftStep: 6, scandal: 0.25 };
  var STAGE = { stranger: 'Chưa quen', acquaintance: 'Quen biết', friend: 'Bạn bè', close: 'Thân thiết', dating: 'Người yêu', ended: 'Đã dừng liên lạc' };
  var MARITAL = { single: 'Độc thân', dating: 'Đang hẹn hò', married: 'Đã kết hôn' };
  var FAME = ['', 'Được biết đến trong giới', 'Nổi tiếng trong nước', 'Ngôi sao hạng A', 'Ngôi sao khu vực', 'Ngôi sao quốc tế'];

  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; }
  function rng(seed) { var x = hash(seed) || 1; return function () { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
  function yr(l) { return l.birthYear + l.age; }
  function age(l, p) { return yr(l) - p.birth; }
  function state(l) {
    var s = l.flags.celeb912;
    if (!s || typeof s !== 'object') s = l.flags.celeb912 = { v: V, at: null, used: 0, scoutAt: null, demand: 'all', band: 'young' };
    if (s.at !== l.age) { s.at = l.age; s.used = 0; }
    s.v = V; return s;
  }
  function left(l) { var s = l.flags.celeb912; return BAL.yearMax - (s && s.at === l.age ? s.used : 0); }
  function reason(l) { var x = X.reason(l, 18); if (x !== true) return x; if (!l.indep) return 'Cần tự lập'; if (l.jailUntil != null && l.age < l.jailUntil) return 'Đang trong trại giam'; return true; }
  // Thuộc tính bổ sung cho contact: tạo một lần theo uid (không reroll khi mở hồ sơ hay tải lại).
  function ensure(l, p) {
    if (!p.rel912) {
      var r = rng(l.id + ':celeb912:' + p.uid110), a = age(l, p);
      p.fame912 = p.fame912 || 1 + Math.floor(r() * 5);
      var x = r(); p.marital912 = p.marital912 || (a < 30 ? (x < 0.7 ? 'single' : x < 0.95 ? 'dating' : 'married') : (x < 0.45 ? 'single' : x < 0.65 ? 'dating' : 'married'));
      var o = r(); p.orient912 = p.orient912 || (o < 0.88 ? 'straight' : o < 0.95 ? 'bi' : 'gay');
      p.city912 = p.city912 || U.pick(r, ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Seoul', 'Bangkok', 'Los Angeles']);
      p.openness912 = Math.round(r() * 100) / 100;
      p.rel912 = { stage: 'stranger', trust: 0, gifts: 0, hist: [], at: null, n: 0, y: l.age };
    }
    if (p.rel912.at !== l.age) { p.rel912.at = l.age; p.rel912.n = 0; }
    return p.rel912;
  }
  function likes(l, p) { var o = p.orient912 || 'straight'; return o === 'bi' || (o === 'gay' ? p.sex === l.sex : p.sex !== l.sex); }
  function wanted(l, p) { var f = l.flags.dating108 || {}; if (f.sex === 'M' || f.sex === 'F') return p.sex === f.sex; if (f.sex === 'any' || l.orient === 'bi') return true; return l.orient === 'gay' ? p.sex === l.sex : p.sex !== l.sex; }
  function celebs(l) { return C.contacts(l, function (p) { return p.celeb && p.alive !== false && age(l, p) >= 18; }); }
  // Mỗi năm gặp thêm vài người mới qua sự kiện; 60% từ 18–35 tuổi, còn lại 36–65; giới tính theo bộ lọc hẹn hò.
  function scout(l) {
    var s = state(l); if (s.scoutAt === l.age) return; s.scoutAt = l.age;
    var r = rng(l.id + ':celebScout912:' + l.age), f = l.flags.dating108 || {};
    for (var i = 0; i < BAL.newPerYear; i++) {
      var young = r() < BAL.youngShare, a = young ? 18 + Math.floor(r() * 18) : 36 + Math.floor(r() * 30);
      var p = C.meet(l, r, { kind: r() < 0.75 ? 'artist' : 'athlete', celeb: true, age: Math.max(22, a), where: U.pick(r, ['một buổi ra mắt phim', 'hậu trường một chương trình', 'một sự kiện từ thiện', 'một buổi tiệc của người quen']), tier: Math.max(2, C.tier(l)) });
      if (a < 22) p.birth = yr(l) - a; // meet() đặt tối thiểu 22 tuổi; người trẻ trưởng thành được ghi đúng tuổi
      if (f.sex === 'M' || f.sex === 'F') { if (p.sex !== f.sex) { p.sex = f.sex; p.name = H.stranger(l, r, f.sex); } }
      p.met[p.met.length - 1].a = l.age; ensure(l, p);
    }
  }
  function attraction(l, p) {
    var rel = ensure(l, p), lf = Math.log10(Math.max(1, l.fame || 0)) / 2, gap = Math.max(0, p.fame912 - 1 - lf - C.tier(l) * 0.5);
    var looks = E.LOOKS134 ? (E.LOOKS134.looks(l) - 50) / 250 : 0, ag = Math.abs(age(l, p) - l.age);
    return U.clamp(0.45 + looks + ((l.st && l.st.soc) - 50) / 300 + (p.warmth - 50) / 250 - gap * 0.08 - Math.max(0, ag - 8) * 0.02 + rel.trust / 400 - ((l.karma || 0) < -20 ? 0.1 : 0), 0.05, 0.9);
  }
  function spend(l, p) { state(l).used++; ensure(l, p).n++; }
  function canAct(l, p) { var rel = ensure(l, p); return left(l) > 0 && rel.n < BAL.personMax && rel.stage !== 'ended'; }
  function log1(p, t) { var rel = p.rel912; rel.hist.push(t); if (rel.hist.length > 12) rel.hist.splice(0, rel.hist.length - 12); }
  function profile(l, p) {
    var rel = ensure(l, p);
    return C.label(l, p) + ' · ' + age(l, p) + ' tuổi · ' + FAME[p.fame912] + ' · sống ở ' + p.city912 + '.\n' +
      'Tính cách: ' + (p.warmth >= 60 ? 'ấm áp' : p.warmth < 35 ? 'giữ khoảng cách' : 'điềm đạm') + ', ' + (p.ambition >= 60 ? 'tham vọng' : 'thong thả') + (rel.stage !== 'stranger' ? ', ' + (p.honesty >= 60 ? 'thẳng thắn' : 'khó đoán') : '') + '. Tình trạng: ' + MARITAL[p.marital912] + '.\n' +
      'Quan hệ với bạn: ' + STAGE[rel.stage] + ' · tin cậy ' + rel.trust + '/100' + (rel.hist.length ? ' · gần đây: ' + rel.hist.slice(-2).join('; ') : '') + '.\n' +
      'Tương tác năm nay: còn ' + left(l) + '/' + BAL.yearMax + ' lượt chung, ' + (BAL.personMax - rel.n) + '/' + BAL.personMax + ' với người này. Thông tin sức khỏe và đời tư không được tiết lộ khi chưa có sự đồng ý.';
  }

  X.menu('celeb912', 'Mở rộng quan hệ với người nổi tiếng', reason,
    function (l) { var s = state(l); return 'Người nổi tiếng bạn đã gặp hoặc có thể làm quen qua sự kiện. Nhu cầu: ' + ({ all: 'kết bạn và tình cảm', friend: 'kết bạn, hợp tác', love: 'tìm người yêu' })[s.demand] + ' · độ tuổi: ' + ({ young: '18–35', mid: '36–50', old: 'trên 50', any: 'mọi độ tuổi' })[s.band] + '. Mỗi bước cần người kia đồng ý. Còn ' + left(l) + '/' + BAL.yearMax + ' lượt tương tác năm nay.'; },
    function (l) {
      scout(l); var s = state(l);
      var band = { young: [18, 35], mid: [36, 50], old: [51, 120], any: [18, 120] }[s.band];
      var list = celebs(l).filter(function (p) { var a = age(l, p); ensure(l, p); return a >= band[0] && a <= band[1] && (s.demand !== 'love' || wanted(l, p)); })
        .sort(function (a, b) { return b.rel912.trust - a.rel912.trust || a.fame912 - b.fame912; }).slice(0, 20);
      var out = list.map(function (p) { return { k: p.uid110, l: p.name + ' · ' + age(l, p) + ' tuổi · ' + p.job, h: STAGE[p.rel912.stage] + ' · ' + FAME[p.fame912] + ' · ' + MARITAL[p.marital912], run: function (l, r) { X.next(l, 'celebPerson912', r, { id: p.uid110 }); } }; });
      if (!list.length) out.push({ k: 'none', l: 'Chưa có ai phù hợp bộ lọc — thử đổi độ tuổi hoặc nhu cầu', why: 'Không có người phù hợp', run: function () {} });
      out.push({ k: 'demand', l: 'Nhu cầu: ' + ({ all: 'tất cả', friend: 'kết bạn', love: 'tìm người yêu' })[s.demand] + ' (bấm để đổi)', run: function (l, r) { var x = state(l); x.demand = { all: 'friend', friend: 'love', love: 'all' }[x.demand]; X.next(l, 'celeb912', r); } });
      out.push({ k: 'band', l: 'Độ tuổi: ' + ({ young: '18–35', mid: '36–50', old: 'trên 50', any: 'mọi độ tuổi' })[s.band] + ' (bấm để đổi)', run: function (l, r) { var x = state(l); x.band = { young: 'mid', mid: 'old', old: 'any', any: 'young' }[x.band]; X.next(l, 'celeb912', r); } });
      return out;
    }, 18, 'Tình cảm');

  X.menu('celebPerson912', 'Hồ sơ người nổi tiếng', reason,
    function (l, d) { var p = C.find(l, d && d.arg && d.arg.id); return p ? profile(l, p) : 'Người này không còn trong danh bạ.'; },
    function (l, a) {
      var p = C.find(l, a.id); if (!p || p.alive === false) return [];
      var rel = ensure(l, p), adult = l.age >= 18 && age(l, p) >= 18, can = canAct(l, p), why = can ? true : left(l) <= 0 ? 'Đã hết lượt tương tác năm nay' : 'Đã gặp người này đủ ' + BAL.personMax + ' lần năm nay', out = [];
      function act(k, label, h, ok, fn) { out.push({ k: k, l: label, h: h, why: ok === true ? why : ok, run: function (l, r, log) { var q = C.find(l, a.id); if (!q || reason(l) !== true || !canAct(l, q)) return; spend(l, q); fn(l, r, log, q, q.rel912); X.next(l, 'celebPerson912', r, { id: a.id }); } }); }
      if (rel.stage === 'stranger') act('invite', 'Gửi lời mời làm quen', 'Qua người quen chung hoặc sự kiện', true, function (l, r, log, q, x) {
        if (r() < attraction(l, q) + 0.15) { x.stage = 'acquaintance'; x.trust = Math.max(x.trust, 15); C.seen(l, q, 'lời mời làm quen', 3); log1(q, 'nhận lời làm quen'); log(q.name + ' nhận lời làm quen và nhắn lại vài câu thân thiện.', 'good'); }
        else { log1(q, 'chưa phản hồi'); log(q.name + ' bận lịch trình, chưa phản hồi lời mời của bạn.', 'neutral'); } });
      if (rel.stage === 'acquaintance' || rel.stage === 'friend' || rel.stage === 'close') act('outing', 'Mời đi chơi riêng', 'Chi phí ' + H.money(l, l.base * 0.01) + ' · cần người ấy nhận lời', l.money >= l.base * 0.01 ? true : 'Thiếu tiền', function (l, r, log, q, x) {
        if (l.money < l.base * 0.01) return;
        if (r() < attraction(l, q) + 0.1) { H.cash(l, -l.base * 0.01, 'Đi chơi cùng ' + q.name); x.trust = Math.min(100, x.trust + 15); if (x.stage === 'acquaintance') x.stage = 'friend'; else if (x.stage === 'friend' && x.trust >= 45) x.stage = 'close'; C.seen(l, q, 'buổi đi chơi riêng', 4); log1(q, 'đi chơi riêng'); log('Bạn và ' + q.name + ' có một buổi đi chơi riêng, trò chuyện lâu hơn dự định.', 'good'); }
        else { x.trust = Math.max(0, x.trust - 2); log1(q, 'từ chối đi chơi'); log(q.name + ' khéo léo từ chối vì lịch quay kín.', 'neutral'); } });
      if (rel.stage !== 'stranger') act('talk', 'Trò chuyện, chia sẻ để hiểu nhau hơn', 'Tăng tin cậy dần', true, function (l, r, log, q, x) { var g = 4 + Math.round(q.warmth / 20); x.trust = Math.min(100, x.trust + g); if (x.stage === 'friend' && x.trust >= 45) x.stage = 'close'; log1(q, 'trò chuyện'); log('Bạn và ' + q.name + ' nói chuyện về công việc và những điều ít ai biết. Tin cậy tăng thêm.', 'neutral'); });
      if (rel.stage !== 'stranger') act('gift', 'Tặng quà', 'Chi phí ' + H.money(l, l.base * 0.05) + ' · chỉ tăng tin cậy có giới hạn', l.money >= l.base * 0.05 ? true : 'Thiếu tiền', function (l, r, log, q, x) {
        if (l.money < l.base * 0.05) return; H.cash(l, -l.base * 0.05, 'Quà tặng ' + q.name); x.gifts++;
        if (x.trust < BAL.giftCap) { x.trust = Math.min(BAL.giftCap, x.trust + Math.max(1, BAL.giftStep - x.gifts)); log(q.name + ' cảm ơn món quà của bạn.', 'neutral'); } else log(q.name + ' cảm ơn nhưng nói bạn không cần tặng quà đắt như vậy.', 'neutral'); log1(q, 'nhận quà'); });
      if (adult && (rel.stage === 'friend' || rel.stage === 'close') && !l.partner) act('date', 'Ngỏ ý hẹn hò nghiêm túc', rel.trust >= BAL.trustDate ? 'Người ấy có thể đồng ý hoặc từ chối' : 'Cần tin cậy từ ' + BAL.trustDate, rel.trust >= BAL.trustDate ? true : 'Cần tin cậy từ ' + BAL.trustDate + '/100', function (l, r, log, q, x) {
        if (l.partner || x.trust < BAL.trustDate) return;
        if (q.marital912 === 'married') { log1(q, 'từ chối vì đã có gia đình'); log(q.name + ' trân trọng tình cảm của bạn nhưng đã có gia đình và không muốn phá vỡ điều đó.', 'neutral'); return; }
        if (!likes(l, q)) { log1(q, 'chỉ muốn làm bạn'); log(q.name + ' quý bạn như một người bạn thân, không có rung động tình cảm.', 'neutral'); return; }
        var p = attraction(l, q) + (x.trust - BAL.trustDate) / 200 - (q.marital912 === 'dating' ? 0.25 : 0);
        if (r() < p) {
          x.stage = 'dating'; if (q.marital912 === 'dating') log(q.name + ' kết thúc mối quan hệ trước đó một cách rõ ràng trước khi đến với bạn.', 'neutral'); q.marital912 = 'dating';
          l.partner = { name: q.name, sex: q.sex, age: age(l, q), status: 'dating', since: l.age, alive: true, job: q.job, contact148: q.uid110, celeb912: true, inc: l.base / 12 * (1 + q.fame912) };
          l.flags.everDated = true; log1(q, 'bắt đầu hẹn hò'); log('Bạn và ' + q.name + ' bắt đầu hẹn hò. Truyền thông có thể sớm để ý.', 'big'); H.mem(l, 'Ngày ' + q.name + ' nhận lời hẹn hò.', 4);
        } else { x.trust = Math.max(0, x.trust - 5); log1(q, 'chưa sẵn sàng hẹn hò'); log(q.name + ' nói cần thêm thời gian; hai người vẫn là bạn.', 'neutral'); } });
      if (adult && rel.stage !== 'stranger' && rel.stage !== 'dating') act('night', 'Đề nghị một đêm bên nhau (hai bên tự nguyện)', 'Người ấy có thể từ chối; nếu bạn hoặc người ấy đã có gia đình, đây là phản bội và có thể bị lộ', true, function (l, r, log, q, x) {
        var p = (q.openness912 || 0) * 0.6 + attraction(l, q) * 0.3 - (q.marital912 === 'married' ? 0.35 : 0) - (x.trust < 25 ? 0.15 : 0);
        if (!likes(l, q) || r() >= p) { x.trust = Math.max(0, x.trust - 6); log1(q, 'từ chối lời đề nghị'); log(q.name + ' từ chối thẳng thắn. Bạn tôn trọng quyết định đó.', 'neutral'); return; }
        x.trust = Math.min(100, x.trust + 3); log1(q, 'một đêm tự nguyện'); log('Bạn và ' + q.name + ' có một đêm bên nhau, cả hai đều tự nguyện và không hứa hẹn gì thêm.', 'neutral');
        var cheat = l.partner && l.partner.alive !== false;
        if (cheat) { H.fx(l, { karma: -5, hap: -2 }); l.partner.close = U.clamp((l.partner.close || 60) - 4, 0, 100); }
        if ((cheat || q.marital912 === 'married') && r() < BAL.scandal * (q.fame912 / 3)) { log('Ảnh hai người bị chụp lén và lan trên mạng. ' + (cheat ? l.partner.name + ' biết chuyện, tình cảm rạn nứt nặng.' : 'Gia đình của ' + q.name + ' lên tiếng.'), 'bad'); if (cheat) l.partner.close = U.clamp(l.partner.close - 25, 0, 100); x.trust = Math.max(0, x.trust - 15); }
      });
      if (rel.stage !== 'stranger' && rel.stage !== 'dating') out.push({ k: 'stop', l: 'Dừng liên lạc', run: function (l, r, log) { var q = C.find(l, a.id); if (!q) return; q.rel912.stage = 'ended'; log1(q, 'dừng liên lạc'); log('Bạn chủ động giữ khoảng cách với ' + q.name + '.', 'neutral'); } });
      if (rel.stage === 'ended') out.push({ k: 'again', l: 'Nối lại liên lạc', why: why, run: function (l, r, log) { var q = C.find(l, a.id); if (!q || !canAct(l, q)) return; spend(l, q); q.rel912.stage = 'acquaintance'; log('Bạn nhắn tin hỏi thăm ' + q.name + ' sau thời gian dài.', 'neutral'); } });
      return out;
    }, 18);

  // Mỗi năm đúng một lần: tình trạng hôn nhân của người nổi tiếng thay đổi tự nhiên; người đang yêu bạn đi theo quan hệ thật.
  E.HOOKS.year.push(function (l) {
    if (!l.alive || !l.flags.celeb912) return;
    var mate = l.partner && l.partner.contact148;
    celebs(l).forEach(function (p) {
      var rel = p.rel912; if (!rel || rel.y === l.age) return; rel.y = l.age;
      if (rel.stage === 'dating' && mate !== p.uid110) { rel.stage = 'friend'; p.marital912 = 'single'; rel.trust = Math.max(0, rel.trust - 20); log1(p, 'đã chia tay'); }
      if (mate === p.uid110) { p.marital912 = l.partner.status === 'married' ? 'married' : 'dating'; return; }
      var r = rng(l.id + ':celebYear912:' + p.uid110 + ':' + l.age), x = r();
      if (p.marital912 === 'single' && x < 0.12) p.marital912 = 'dating';
      else if (p.marital912 === 'dating') p.marital912 = x < 0.1 ? 'married' : x < 0.25 ? 'single' : 'dating';
      else if (p.marital912 === 'married' && x < 0.03) p.marital912 = 'single';
      if (rel.stage !== 'stranger' && rel.stage !== 'ended' && rel.trust > 10) rel.trust -= 2; // ít liên lạc thì nhạt dần
    });
  });
  var migrate = E.migrateExt;
  E.migrateExt = function (l) { if (migrate) migrate(l); if (l && l.flags && l.flags.celeb912 != null && typeof l.flags.celeb912 !== 'object') delete l.flags.celeb912; };
  E.CELEB912 = { BAL: BAL, state: state, ensure: ensure, celebs: celebs, scout: scout, attraction: attraction, left: left, age: age };
})(globalThis.G);
