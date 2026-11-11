/* Một Đời — MD4 D15 (8.10.22): người theo dõi có sức ảnh hưởng thực, tăng giảm có nguyên nhân, quà và donate.
   Lỗi đã tái hiện (careers.js, nghề nổi tiếng): mỗi năm l.fame = f0 × exp(0,6·N(0,1) − 0,4·max(0, log10 f0 − 4,5) …) — với 10 triệu,
   hệ số trung vị ≈ 0,37, một năm ổn định có thể còn 2–4 triệu mà không có biến cố nào. Nay thay bằng sổ: đầu kỳ + người mới −
   người rời ± biến cố = cuối kỳ; người mới theo hoạt động, chất lượng, sức chứa thị trường (giảm dần khi gần bão hòa); người rời theo
   mức hoạt động/chất lượng; biến cố lớn chỉ đến từ sự kiện có tên (khủng hoảng, mất kênh…) và được ghi lại.
   Tách: người theo dõi tích lũy (l.fame, giữ nguyên trường cũ), tỷ lệ khán giả hoạt động, mức tương tác, người ủng hộ trả tiền.
   Donate/quà ảo/quà vật lý là kinh tế mô phỏng; sổ giao dịch theo kỳ, không trả hai lần khi tải lại/mở menu. Tham số là cân bằng
   trò chơi, không phải số liệu nền tảng thật. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, W = G.W;
  if (!X) return;
  var BAL = { newBase: 0.18, seed: 300, churnBase: 0.05, churnIdle: 0.06, churnLowQ: 0.06, churnAge: 0.02, maxChurn: 0.22, platformCut: 0.45, refund: 0.01, taxHold: 0.1, tipUsd: 60 };
  var BIG = /^(en|es_la|es|cn|zh|in|ar|pt|br)$/;
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; return h >>> 0; }
  function u(l, tag) { return hash(l.id + ':f919:' + tag) / 4294967296; }
  function mo(l, v) { return H.money(l, v); }
  function fmt(n) { return E.fmtFollowers ? E.fmtFollowers(Math.max(0, Math.round(n))) : String(Math.round(n)); }
  function st(l) { var s = l.flags.follow919; if (!s || typeof s !== 'object') s = l.flags.follow919 = { v: 1, active: 0.3, eng: 30, ledger: [], tx: {}, gifts: [], don: { on: true, cap: false }, used: {} }; ['ledger', 'gifts'].forEach(function (k) { if (!Array.isArray(s[k])) s[k] = []; }); if (!s.tx || typeof s.tx !== 'object') s.tx = {}; if (!s.used || typeof s.used !== 'object') s.used = {}; if (!s.don) s.don = { on: true, cap: false }; if (!(s.active >= 0)) s.active = 0.3; if (!(s.eng >= 0)) s.eng = 30; return s; }
  function res(l) { return H.resCode(l); }
  // Sức chứa thị trường: dân số ước tính nơi sống + vùng ngôn ngữ lớn. Không có trần cố định 50 triệu như trước.
  function capacity(l) { var b = W.BY[res(l)] || W.BY[l.country], pool = b ? String(b.pool).split(',')[0].split(':')[0] : 'en', pop = b ? b.births * 60000 : 3e7; return Math.min(3e8, Math.max(5e6, pop * 0.6 + (BIG.test(pool) ? 1.2e8 : 0))); }
  function quality(l, c) { return U.clamp(0.35 + ((l.skill || 40) - 50) / 150 + (l.talent && c && l.talent === c.talent ? 0.1 : 0), 0.1, 1); }
  function year(l) { return l.birthYear + l.age; }
  function entry(l) { var s = st(l), y = year(l), e = s.ledger.find(function (x) { return x.y === y; }); if (!e) { e = { y: y, age: l.age, start: Math.round(l.fame || 0), gain: 0, lost: 0, shock: 0, why: [] }; s.ledger.push(e); if (s.ledger.length > 40) s.ledger.shift(); } return e; }
  // Mô hình năm cho nghề nổi tiếng: dùng lại z (độ lệch chuẩn) và hệ số viral đã rút trong careers.js để không đổi số lần rút RNG.
  function careerGrowth(l, c, f0, z, viral, focus) {
    var s = st(l), K = capacity(l), q = quality(l, c), rest = s.used.rest === l.age, act = rest ? 0.4 : focus === 'work' ? 1.2 : focus === 'balance' ? 1 : focus === 'health' ? 0.85 : 0.75;
    if (s.used.collab === l.age - 1) act += 0.2; if (s.used.community === l.age - 1) act += 0.1;
    var room = Math.max(0, 1 - f0 / K), gain = f0 * BAL.newBase * Math.exp(0.35 * (z || 0)) * act * (0.6 + q * 0.8) * room + BAL.seed * act * q;
    var churn = f0 * Math.min(BAL.maxChurn, BAL.churnBase + (act < 0.8 ? BAL.churnIdle : 0) + (1 - q) * BAL.churnLowQ + (l.age > 45 ? BAL.churnAge : 0) - (s.used.community === l.age - 1 ? 0.02 : 0));
    var why = [];
    if (viral) { var v = Math.min(K * 0.2, f0 * viral / 4 + 2e4 * viral) * room; gain += v; why.push('nội dung lan truyền mạnh (+' + fmt(v) + ')'); }
    if (s.recover && s.recover.age === l.age - 1) { var back = s.recover.lost * s.recover.share; gain += back; why.push('một phần khán giả quay lại sau khi xử lý khủng hoảng (+' + fmt(back) + ')'); }
    var end = Math.max(50, Math.min(K, f0 + gain - churn));
    var e = entry(l); e.start = Math.round(f0); e.gain += Math.round(gain); e.lost += Math.round(churn); e.end = Math.round(end); e.why = e.why.concat(why); e.k = Math.round(K);
    s.active = U.clamp(s.active + (act >= 1 ? 0.03 : act < 0.8 ? -0.05 : 0) + (q - 0.5) * 0.04, 0.05, 0.6);
    s.eng = U.clamp(s.eng + (act >= 1 ? 1 : -2) + (s.used.community === l.age - 1 ? 3 : 0), 5, 95);
    return end;
  }
  // Biến cố có tên: H.fx({fame: <1}) (khủng hoảng truyền thông…) và các mục ghi trực tiếp được đối chiếu cuối năm.
  var fx0 = H.fx; H.fx = function (l, o, why) { var f0 = l && l.fame || 0; fx0.apply(this, arguments); if (l && l.flags && o && o.fame && o.fame < 1 && f0 > 0) { var e = entry(l), d = f0 - (l.fame || 0); e.shock -= Math.round(d); e.why.push('khủng hoảng truyền thông / phản ứng của khán giả (−' + fmt(d) + ')'); var q = st(l); q.lastShock = { age: l.age, lost: d }; if (q.recAt === l.age) { q.lastEnd = Math.round(l.fame || 0); e.end = q.lastEnd; } } };
  // Đối chiếu: mọi thay đổi khác trong năm (show, phim, mất kênh…) được ghi là biến động từ sự kiện nghề nghiệp, không âm/NaN.
  function reconcile(l) {
    if (!(l.fame >= 0) || !isFinite(l.fame)) l.fame = 0; var s = st(l); if (s.recAt === l.age) return; s.recAt = l.age;
    var prev = s.lastEnd, now = Math.round(l.fame); s.lastEnd = now; if (prev == null) return;
    var e = s.ledger.find(function (x) { return x.y === year(l); }), explained = e ? e.gain - e.lost + e.shock : 0, other = now - prev - explained, big = Math.abs(other) >= Math.max(500, prev * 0.01);
    if (!e && !big) return; e = entry(l); e.start = prev; e.other = now - prev - e.gain + e.lost - e.shock; e.end = now;
    if (big) e.why.push((other > 0 ? 'chương trình/dự án/sự kiện nghề nghiệp (+' : 'biến cố nghề nghiệp khác (−') + fmt(Math.abs(other)) + ')');
  }
  function fameJob(l) { var c = l.job && E.jobDef ? E.jobDef(l) : null; return c && c.fame ? c : null; }
  function liveJob(l) { var c = fameJob(l); return !!c && /^(streamer|kol_live|youtuber)$/.test(c.id); }
  function channels(l) { var s = l.flags.social131; return s && Array.isArray(s.channels) ? s.channels : []; }
  // Khán giả duy nhất ước tính: nhiều kênh có người theo dõi trùng nhau (tham số trùng lặp 35% phần ngoài kênh lớn nhất).
  function audience(l) { var cs = channels(l).map(function (c) { return c.followers || 0; }), sum = cs.reduce(function (a, b) { return a + b; }, 0), mx = cs.length ? Math.max.apply(null, cs) : 0, s = st(l); return { total: Math.round(l.fame || 0), accounts: sum, unique: Math.round(mx + (sum - mx) * 0.65), active: Math.round((l.fame || 0) * s.active), eng: s.eng }; }
  // Hiệu quả nghề: cùng số người theo dõi nhưng khán giả hoạt động/tương tác khác nhau cho thu nhập khác nhau (có trần).
  function incomeFactor(l) { var s = st(l); return U.clamp(0.75 + s.active * 0.6 + (s.eng - 30) / 200, 0.6, 1.35); }
  var cy0 = E.careerYear; E.careerYear = function (l, r, log) { var out = cy0.apply(this, arguments); if (out > 0 && l && l.flags && fameJob(l)) { var k = incomeFactor(l); st(l).incK = k; out *= k; } return out; };
  // Phân bổ khán giả theo nền tảng và thị trường (tham số trò chơi theo nghề và ngôn ngữ nơi sống); không tạo người theo dõi mới.
  var PLAT = { video: 'Video dài', short: 'Video ngắn', live: 'Livestream', music: 'Nghe nhạc / podcast' };
  function platforms(l) { var c = fameJob(l), id = c ? c.id : ''; return id === 'streamer' || id === 'kol_live' ? { video: 0.2, short: 0.25, live: 0.5, music: 0.05 } : /ca_si|rapper|nhac/.test(id) ? { video: 0.3, short: 0.3, live: 0.05, music: 0.35 } : { video: 0.45, short: 0.4, live: 0.1, music: 0.05 }; }
  function markets(l) { var b = W.BY[res(l)], pool = b ? String(b.pool).split(',')[0].split(':')[0] : 'en', intl = BIG.test(pool) ? 0.4 : 0.15, home = 1 - intl; var o = {}; o[res(l)] = home; o.intl = intl; return { home: res(l), share: o, lang: pool }; }
  // Hợp đồng tài trợ: thương hiệu, thị trường, kỳ hạn, số nội dung/năm, phí, phần đại diện, chi phí sản xuất, phạt khi không giao.
  var BRANDS = [['đồ gia dụng', 'all'], ['ứng dụng học ngoại ngữ', 'all'], ['thời trang', 'all'], ['thiết bị công nghệ', 'all'], ['đồ uống có cồn', 'adult'], ['nền tảng cá cược', 'never']];
  function dealOffers(l) {
    var s = st(l), a = audience(l), m = markets(l); if (s.dealAt === l.age || (l.fame || 0) < 2e4) return; s.dealAt = l.age; s.offers919 = [];
    var n = Math.min(3, Math.floor(Math.log10(Math.max(1, a.active)) - 2)); for (var i = 0; i < n; i++) { var b = BRANDS[Math.floor(u(l.id + ':brand:' + l.age + ':' + i) * 5)], local = u(l.id + ':mk:' + l.age + ':' + i) < 0.6, reach = a.active * (local ? m.share[m.home] : m.share.intl), fee = l.base * Math.min(6, Math.sqrt(reach / 5000) * 0.15) * (0.6 + s.eng / 100);
      s.offers919.push({ id: l.age + ':' + i, brand: b[0], gate: b[1], market: local ? m.home : 'quốc tế', term: 1 + (i % 2), posts: 2 + i, fee: fee, agency: 0.15, prod: 0.1, status: 'open' }); }
  }
  function dealYear(l, log) {
    var s = st(l); (s.deals919 || []).forEach(function (d) {
      if (d.status !== 'active' || d.lastYear === l.age) return; d.lastYear = l.age;
      var key = 'deal:' + d.id + ':' + l.age; if (s.tx[key]) return;
      if ((d.delivered || 0) >= d.posts) { var net = d.fee * (1 - d.agency - d.prod); s.tx[key] = { status: 'settled', gross: d.fee, cut: d.fee * (d.agency + d.prod), refunded: 0, tax: 0, net: net, y: year(l) }; H.cash(l, net, 'Hợp đồng tài trợ ' + d.brand + ' (sau phí đại diện, sản xuất)'); log && log('Hoàn thành ' + d.posts + ' nội dung cho ' + d.brand + '; nhận ' + mo(l, net) + '.', 'good'); }
      else { var pen = d.fee * 0.5; s.tx[key] = { status: 'refunded', gross: 0, cut: 0, refunded: pen, tax: 0, net: -pen, y: year(l) }; H.cash(l, -pen, 'Phạt vi phạm hợp đồng tài trợ ' + d.brand); s.eng = U.clamp(s.eng - 3, 5, 95); log && log('Không giao đủ nội dung cho ' + d.brand + ' (' + (d.delivered || 0) + '/' + d.posts + '); bị phạt ' + mo(l, pen) + ' theo hợp đồng.', 'bad'); }
      d.delivered = 0; d.yearsLeft--; if (d.yearsLeft <= 0) d.status = 'done';
    });
  }
  // Quà vật lý giá trị lớn cần chỗ cất giữ/bảo quản: chi phí hằng năm, có thể chuyển tặng.
  function storageYear(l, log) { var s = st(l), big = s.gifts.filter(function (g) { return g.status === 'kept' && g.value >= l.base * 0.05; }); if (big.length > 2 && s.storeAt !== l.age) { s.storeAt = l.age; var c = l.base * 0.01 * (big.length - 2); H.cash(l, -c, 'Cất giữ, bảo quản quà tặng giá trị'); log && log('Chi phí cất giữ ' + big.length + ' món quà giá trị: ' + mo(l, c) + '.', 'neutral'); } }
  // Donate và quà ảo: người xem hoạt động × tỷ lệ ủng hộ × khả năng chi trả; trừ phần nền tảng, hoàn tiền, tạm trừ thuế; một giao dịch/năm.
  function donation(l) {
    var s = st(l), a = audience(l), b = W.BY[res(l)], afford = U.clamp((b ? b.gdp : 10) / 40, 0.15, 1.5), trust = U.clamp(s.eng / 50, 0.2, 1.6);
    var payers = a.active * 0.004 * trust * (s.don.cap ? 0.5 : 1) * (platforms(l).live / 0.15) * 0.5, gross = (E.usdToLocal ? E.usdToLocal(l, BAL.tipUsd) : l.base * 0.015) * afford * payers / 1000 * 12;
    var cut = gross * BAL.platformCut, refunded = gross * BAL.refund, tax = (gross - cut - refunded) * BAL.taxHold, net = gross - cut - refunded - tax;
    return { gross: gross, cut: cut, refunded: refunded, tax: tax, net: net, payers: Math.round(payers) };
  }
  function donationYear(l, log) {
    var s = st(l); if (!(liveJob(l) || channels(l).some(function (c) { return (c.followers || 0) >= 1000; }))) return;
    if (l.age < 18) { s.don.on = false; return; }
    var id = 'don:' + year(l); if (!s.don.on || s.tx[id]) return; var d = donation(l); if (!(d.net > 0)) return;
    s.tx[id] = { status: 'settled', gross: d.gross, cut: d.cut, refunded: d.refunded, tax: d.tax, net: d.net, y: year(l) };
    H.cash(l, d.net, 'Donate, quà ảo, hội viên (thực nhận sau phí nền tảng, hoàn tiền, tạm trừ thuế)');
    if (d.net > l.base * 0.05) log && log('Người xem ủng hộ qua donate/quà ảo: tổng ' + mo(l, d.gross) + ', nền tảng giữ ' + mo(l, d.cut) + ', hoàn ' + mo(l, d.refunded) + ', tạm trừ thuế ' + mo(l, d.tax) + ' → thực nhận ' + mo(l, d.net) + '.', 'good');
    var keys = Object.keys(s.tx); if (keys.length > 30) delete s.tx[keys[0]];
  }
  var GIFTS = [['thư tay và tranh vẽ của fan', 0], ['gấu bông, đồ handmade', 0.002], ['bộ sưu tập album/ảnh có chữ ký nhóm fan', 0.004], ['túi xách hàng hiệu', 0.08], ['đồng hồ', 0.12]];
  function giftYear(l, log) {
    var s = st(l), f = l.fame || 0; if (f < 1e5 || s.giftAt === l.age || s.gifts.filter(function (g) { return g.status === 'kept'; }).length >= 12) return; s.giftAt = l.age;
    if (u(l, 'gift:' + l.age) > Math.min(0.5, Math.log10(f / 1e4) * 0.12)) return;
    var i = Math.min(GIFTS.length - 1, Math.floor(u(l, 'giftk:' + l.age) * (f >= 1e6 ? 5 : 3))), g = GIFTS[i];
    s.gifts.push({ id: 'g' + l.age + ':' + i, item: g[0], value: l.base * g[1], status: l.age < 18 ? 'guardian' : 'pending', at: l.age });
    log && log('Fan gửi tặng ' + g[0] + (l.age < 18 ? '; người giám hộ sẽ xem xét trước khi nhận.' : '. Bạn có thể giữ, chuyển tặng từ thiện hoặc từ chối.'), 'neutral');
  }

  X.menu('follow919', 'Khán giả, người theo dõi và ủng hộ', function (l) { var r = X.reason(l, 13); if (r !== true) return r; return (l.fame || 0) >= 100 || channels(l).length ? true : 'Chưa có khán giả theo dõi'; }, function (l) {
    var s = st(l), a = audience(l), last = s.ledger.slice(-3).reverse();
    return 'Người theo dõi tích lũy ' + fmt(a.total) + (a.accounts ? ' (tổng tài khoản các kênh ' + fmt(a.accounts) + ', ước tính ' + fmt(a.unique) + ' người khác nhau)' : '') + ' · khán giả hoạt động ~' + fmt(a.active) + ' (' + Math.round(s.active * 100) + '%) · tương tác ' + Math.round(s.eng) + '/100 · hệ số thu nhập nghề ' + (s.incK ? s.incK.toFixed(2).replace('.', ',') : '—') + '.' +
      '\n1 triệu người thờ ơ có thể mang lại ít hơn 100 nghìn người tích cực; người theo dõi không thay kỹ năng, giấy phép hay ngân sách.' +
      (last.length ? '\nSổ người theo dõi:\n' + last.map(function (e) { return '• Năm ' + e.y + ': đầu kỳ ' + fmt(e.start) + ' + mới ' + fmt(e.gain) + ' − rời ' + fmt(e.lost) + (e.shock ? ' − biến cố ' + fmt(-e.shock) : '') + (e.other ? (e.other > 0 ? ' + sự kiện ' : ' − sự kiện ') + fmt(Math.abs(e.other)) : '') + ' = cuối kỳ ' + fmt(e.end != null ? e.end : a.total) + (e.why.length ? ' (' + e.why.join('; ') + ')' : ''); }).join('\n') : '') +
      (Object.keys(s.tx).length ? '\nDoanh thu ủng hộ: ' + Object.keys(s.tx).slice(-3).map(function (k) { var t = s.tx[k]; return t.y + ': gộp ' + mo(l, t.gross) + ' − nền tảng ' + mo(l, t.cut) + ' − hoàn ' + mo(l, t.refunded) + ' − thuế tạm tính ' + mo(l, t.tax) + ' = ' + mo(l, t.net) + ' (' + t.status + ')'; }).join('; ') + '. Phân loại thuế của donate tùy quốc gia; tạm giữ quỹ dự phòng thuế ' + Math.round(BAL.taxHold * 100) + '%.' : '') +
      (s.gifts.length ? '\nQuà vật lý: ' + s.gifts.slice(-6).map(function (g) { return g.item + ' (' + { pending: 'chờ quyết định', kept: 'đang giữ', donated: 'đã chuyển tặng', declined: 'đã từ chối', guardian: 'người giám hộ quản lý' }[g.status] + ')'; }).join('; ') + '. Giá trị quà không cộng vào tiền mặt.' : '') +
      '\nNền tảng: ' + Object.keys(PLAT).map(function (k) { return PLAT[k] + ' ' + Math.round(platforms(l)[k] * 100) + '%'; }).join(', ') + ' · thị trường: ' + Math.round(markets(l).share[markets(l).home] * 100) + '% tại ' + (W.BY[res(l)] ? W.BY[res(l)].name : res(l)) + ', ' + Math.round(markets(l).share.intl * 100) + '% quốc tế (ngôn ngữ nội dung quyết định độ phủ).' +
      ((st(l).deals919 || []).filter(function (d) { return d.status === 'active'; }).length ? '\nHợp đồng tài trợ: ' + st(l).deals919.filter(function (d) { return d.status === 'active'; }).map(function (d) { return d.brand + ' (' + d.market + ', còn ' + d.yearsLeft + ' năm, đã giao ' + (d.delivered || 0) + '/' + d.posts + ' nội dung năm nay)'; }).join('; ') : '') +
      '\nDonate: ' + (l.age < 18 ? 'tắt (vị thành niên, theo người giám hộ)' : s.don.on ? 'bật' + (s.don.cap ? ', có giới hạn' : '') : 'tắt') + '.';
  }, function (l) {
    var s = st(l), out = [];
    [['community', 'Chăm sóc cộng đồng: trả lời bình luận, buổi giao lưu', 'Tương tác tăng, ít người rời năm tới', function (l, log) { s.eng = U.clamp(s.eng + 5, 0, 95); H.fx(l, { soc: 1 }); log('Bạn dành thời gian trò chuyện với khán giả; cộng đồng gắn bó hơn.', 'good'); }],
      ['collab', 'Hợp tác với người sáng tạo khác', 'Năm tới có thêm người mới; có thể bị từ chối', function (l, log) { if (u(l, 'collab:' + l.age) < 0.3) { s.used.collab = -9; log('Đề nghị hợp tác bị từ chối lịch sự vì không cùng hướng nội dung.', 'neutral'); return; } log('Một dự án hợp tác được lên lịch; khán giả hai bên biết đến nhau.', 'good'); }],
      ['rest', 'Nghỉ ngơi, giảm lịch đăng', 'Căng thẳng giảm; người theo dõi tăng chậm, một ít rời đi', function (l, log) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress - 10, 0, 100); log('Bạn tạm giảm lịch làm nội dung để nghỉ ngơi.', 'neutral'); }],
      ['bound', 'Đặt ranh giới với fan (giờ liên lạc, chuyện riêng tư)', 'Căng thẳng giảm; không mất người ủng hộ thật sự', function (l, log) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress - 5, 0, 100); log('Bạn công bố quy tắc giao lưu và quyền riêng tư; đa số khán giả tôn trọng.', 'neutral'); }]
    ].forEach(function (x) { out.push({ k: x[0], l: x[1], h: x[2], why: s.used[x[0]] === l.age ? 'Đã làm năm nay' : true, run: function (l, r, log) { if (s.used[x[0]] === l.age) return; s.used[x[0]] = l.age; x[3](l, log); } }); });
    if (s.lastShock && l.age - s.lastShock.age <= 1 && !(s.recover && s.recover.age >= s.lastShock.age)) out.push({ k: 'crisis', l: 'Phản hồi khủng hoảng: xin lỗi/giải thích minh bạch', h: 'Một phần khán giả có thể quay lại năm sau; không bảo đảm', run: function (l, r, log) { var sh = 0.15 + u(l, 'rec:' + l.age) * 0.3; s.recover = { age: l.age, lost: s.lastShock.lost, share: sh }; log('Bạn phản hồi khủng hoảng công khai. Kết quả phụ thuộc mức độ sự việc và niềm tin của khán giả.', 'neutral'); } });
    if (l.age >= 18 && (liveJob(l) || channels(l).length)) { out.push({ k: 'don', l: s.don.on ? 'Tắt nhận donate/quà ảo' : 'Bật nhận donate/quà ảo', run: function (l, r, log) { s.don.on = !s.don.on; log(s.don.on ? 'Bật nhận ủng hộ.' : 'Tắt nhận ủng hộ.', 'neutral'); } }); out.push({ k: 'cap', l: s.don.cap ? 'Bỏ giới hạn ủng hộ' : 'Giới hạn mức ủng hộ (nhắc người xem không chi quá sức)', run: function (l, r, log) { s.don.cap = !s.don.cap; log(s.don.cap ? 'Đặt giới hạn mức ủng hộ.' : 'Bỏ giới hạn.', 'neutral'); } }); }
    (s.offers919 || []).filter(function (o) { return o.status === 'open'; }).forEach(function (o) { out.push({ k: 'deal:' + o.id, l: 'Ký tài trợ ' + o.brand + ' · ' + o.market + ' · ' + o.term + ' năm · ' + o.posts + ' nội dung/năm', h: 'Phí ' + mo(l, o.fee) + '/năm, trừ 15% đại diện + 10% sản xuất; thiếu nội dung bị phạt 50%', why: o.gate === 'never' ? 'Thương hiệu không phù hợp/không hợp pháp ở nhiều nơi — từ chối' : o.gate === 'adult' && l.age < 21 ? 'Không nhận quảng cáo đồ uống có cồn khi chưa đủ tuổi' : (s.deals919 || []).filter(function (d) { return d.status === 'active'; }).length >= 2 ? 'Đang có 2 hợp đồng' : true, run: function (l, r, log) { o.status = 'signed'; s.deals919 = (s.deals919 || []).concat([{ id: o.id, brand: o.brand, market: o.market, posts: o.posts, fee: o.fee, agency: o.agency, prod: o.prod, yearsLeft: o.term, status: 'active', delivered: 0 }]); log('Ký hợp đồng tài trợ với ' + o.brand + '.', 'good'); } }); });
    (s.deals919 || []).filter(function (d) { return d.status === 'active' && (d.delivered || 0) < d.posts; }).forEach(function (d) { out.push({ k: 'deliver:' + d.id, l: 'Làm nội dung tài trợ cho ' + d.brand + ' (' + (d.delivered || 0) + '/' + d.posts + ')', h: 'Tốn thời gian, tăng căng thẳng', run: function (l, r, log) { d.delivered = (d.delivered || 0) + 1; if (l.mind) l.mind.stress = U.clamp(l.mind.stress + 2, 0, 100); log('Hoàn thành một nội dung cho ' + d.brand + '.', 'neutral'); } }); });
    s.gifts.filter(function (g) { return g.status === 'kept' && g.value >= l.base * 0.05; }).slice(0, 2).forEach(function (g) { out.push({ k: 'give2:' + g.id, l: 'Chuyển tặng từ thiện món quà đang cất giữ: ' + g.item, run: function (l, r, log) { g.status = 'donated'; log('Bạn chuyển ' + g.item + ' cho quỹ từ thiện, bớt chi phí cất giữ.', 'good'); } }); });
    s.gifts.filter(function (g) { return g.status === 'pending'; }).slice(0, 4).forEach(function (g) {
      out.push({ k: 'keep:' + g.id, l: 'Giữ: ' + g.item, run: function () { g.status = 'kept'; } });
      out.push({ k: 'give:' + g.id, l: 'Chuyển tặng từ thiện: ' + g.item, run: function (l, r, log) { g.status = 'donated'; H.fx(l, { karma: 1 }); log('Bạn chuyển ' + g.item + ' cho quỹ từ thiện.', 'good'); } });
      out.push({ k: 'decl:' + g.id, l: 'Từ chối nhận: ' + g.item, run: function () { g.status = 'declined'; } });
    });
    return out;
  }, 13, 'Nghề nghiệp');

  E.HOOKS.year.push(function (l, r, log) { if (!l.alive || !l.flags || !['vn', 'world'].includes(l.mode)) return; if ((l.fame || 0) > 0 || l.flags.follow919) { dealYear(l, log); donationYear(l, log); giftYear(l, log); storageYear(l, log); dealOffers(l); reconcile(l); } });
  var mig = E.migrateExt; E.migrateExt = function (l) { if (mig) mig(l); if (l && l.flags && l.flags.follow919 != null && typeof l.flags.follow919 !== 'object') delete l.flags.follow919; if (l && !(l.fame >= 0)) l.fame = 0; };
  E.FOLLOW919 = { platforms: platforms, markets: markets, dealOffers: dealOffers, dealYear: dealYear, storageYear: storageYear, BAL: BAL, careerGrowth: careerGrowth, capacity: capacity, quality: quality, audience: audience, incomeFactor: incomeFactor, donation: donation, donationYear: donationYear, giftYear: giftYear, reconcile: reconcile, state: st, entry: entry };
})(globalThis.G);
