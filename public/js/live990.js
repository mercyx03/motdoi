/* Một Đời — 9.9.0 (phần sân khấu và công chúng): concert, fan meeting, sự kiện nhãn hàng, chiến lược quảng bá, gặp người hâm mộ ngoài đời,
   chuỗi hẹn hò bị phát hiện và cách phản ứng trước truyền thông. Dùng lại hình ảnh công chúng và dữ liệu nước/thời kỳ của idol990.js.
   Nơi tổ chức (nhà hát, nhà thi đấu, dome, sân vận động) chỉ có khi đã được xây ở nước đó; lần đầu ở dome/sân vận động/nước ngoài là thành tựu.
   Concert chuẩn bị trong năm, diễn ra năm sau: sức khỏe, tai tiếng, hợp đồng thay đổi trong thời gian đó vẫn ảnh hưởng buổi diễn. */
(function (G) {
  'use strict';
  var E = G.E, H = E && E.H, U = G.U, X = E && E.UPDATE110, SH = E && E.SHOW151, L = E && E.LIFE138, D = E && E.IDOL990D, K = E && E.IDOL990, P = E && E.IDOL987;
  if (!E || !X || !SH || !L || !D || !K || !P) return;
  var seeded = SH.seeded, V = SH.V, st = K.S, peek = K.peek, grp = K.grp, yr = K.yr, pop = K.pop, img = K.img, fxImg = K.fxImg, fameMul = K.fameMul, fans = K.fans;
  function mo(l, v) { return H.money(l, v); }
  function lv(l, k) { return L.skill(l, k).level || 0; }
  function agency(l) { return L.state(l).agency; }
  function why(l) { return K.performer(l) && K.free(l) && pop(l) >= 25 ? true : !K.free(l) ? 'Hiện không thể hoạt động' : 'Cần có tên tuổi trước (độ nổi tiếng cá nhân từ 25/100)'; }
  function byCo(l) { var g = grp(l), a = agency(l); return !!(g && a && /debut/.test(a.status)); }
  function split(l) { var g = grp(l), sc = l.flags.idol155 && l.flags.idol155.company; return g ? (sc ? sc.split : 0.25) / Math.max(1, (g.members || []).length + 1) : 0.7; }
  var festivals = [
    { id: 'coachella', name: 'Coachella', place: 'Mỹ', from: 1999, skips: [2000, 2020, 2021], pop: 60 },
    { id: 'lolla', name: 'Lollapalooza Chicago', place: 'Mỹ', from: 2005, skips: [2020], pop: 55 },
    { id: 'fuji', name: 'Fuji Rock', place: 'Nhật Bản', from: 1997, skips: [2020], pop: 45 },
    { id: 'sonic', name: 'Summer Sonic', place: 'Nhật Bản', from: 2000, skips: [2020, 2021], pop: 50 }
  ];
  var sets = { sing: 'Hát live với ban nhạc', rap: 'Rap trên nền beat tối giản', dance: 'Diễn tiết mục vũ đạo' };
  function topic(l, kind, positive, headline, log) {
    var s = st(l);
    s.topics = s.topics || [];
    s.topics.unshift({ year: yr(l), kind: kind, positive: positive, headline: headline });
    s.topics.length = Math.min(20, s.topics.length);
    log('Dư luận · ' + kind + ' · ' + headline, positive ? 'good' : 'bad');
  }
  X.menu('topics9119', 'Dư luận về nghệ sĩ', function (l) {
    return K.performer(l) || (peek(l).topics || []).length ? true : 'Dành cho nghệ sĩ';
  }, function (l) {
    var topics = peek(l).topics || [];
    return topics.length ? topics.map(function (t) {
      return t.year + ' · ' + t.kind + (t.positive ? ' · Tích cực · ' : ' · Tiêu cực · ') + t.headline;
    }).join('\n') : 'Chưa có chủ đề nào về bạn.';
  }, function () { return []; }, 16, 'Sự nghiệp giải trí');
  function festivalOpen(l, f) { return yr(l) >= f.from && !f.skips.includes(yr(l)); }
  function festivalRows(l, a) {
    var season = festivals.filter(function (f) { return festivalOpen(l, f); });
    if (peek(l).festivalAt === l.age) return [];
    if (!a.id) return season.map(function (f) {
      return { k: f.id, l: f.name + ' · ' + f.place + ' · cần độ nổi tiếng ' + f.pop,
        why: pop(l) >= f.pop || 'Chưa đủ độ nổi tiếng', run: function (l, r) { X.next(l, 'festival9119', r, { id: f.id }); } };
    });
    var festival = season.find(function (f) { return f.id === a.id && pop(l) >= f.pop; });
    if (!festival) return [];
    return Object.keys(sets).map(function (skill) {
      return { k: skill, l: sets[skill] + ' · kỹ năng ' + lv(l, skill), run: function (l, r, log) {
        var s = st(l), rr = seeded(l.id + ':festival:' + yr(l) + ':' + festival.id);
        var score = lv(l, skill) * .65 + l.st.hea * .2 + img(l).pro * .15 + (rr() - .5) * 18;
        s.festivalAt = l.age;
        if (!s.first[festival.id]) {
          s.first[festival.id] = yr(l);
          H.mem(l, 'Lần đầu bước lên sân khấu ' + festival.name + '.', 5);
        }
        var good = score >= 60;
        fameMul(l, good ? .09 : -.03);
        if (good && !l.fame) l.fame = 1000;
        fxImg(l, good ? { pro: 4, trust: 2 } : { pro: -3, scandal: 5 }, festival.name);
        topic(l, 'Tài năng', good, festival.name + (good ? ' · Tiết mục chinh phục khán giả, danh tiếng tăng.' : ' · Tiết mục hụt nhịp trở thành chủ đề bị chê.'), log);
      } };
    });
  }
  X.menu('festival9119', 'Biểu diễn tại lễ hội âm nhạc', why, function (l, d) {
    if (peek(l).festivalAt === l.age) return 'Bạn đã diễn ở một lễ hội trong năm nay.';
    if (d.arg.id) return 'Chọn tiết mục. Kỹ năng tương ứng, sức khỏe và tác phong sẽ ảnh hưởng buổi diễn.';
    return festivals.some(function (f) { return festivalOpen(l, f); }) ?
      'Chọn một sân khấu cho năm nay. Mỗi lễ hội mời nghệ sĩ theo độ nổi tiếng.' : 'Năm nay chưa có sân khấu nào trong danh mục.';
  }, festivalRows, 16, 'Sự nghiệp giải trí');
  E.DEC.festival9119.auto = function () { return 'cancel'; };
  // ================================================================== Concert
  var CONCEPT = { band: ['live cùng ban nhạc', 'sing'], dance: ['vũ đạo và hiệu ứng sân khấu lớn', 'dance'], story: ['kể một câu chuyện xuyên suốt', 'acting'], acoustic: ['mộc mạc, gần gũi với khán giả', 'sing'], rap: ['năng lượng hip-hop', 'rap'] };
  var SETL = { hits: 'Toàn bài nổi tiếng', fresh: 'Giới thiệu sản phẩm mới', fan: 'Chọn theo bình chọn của người hâm mộ', exp: 'Thử nghiệm bản phối mới' };
  var OUT = { simple: ['Trang phục giản dị, gọn nhẹ', 3000, 0.45], custom: ['Thiết kế riêng cho từng phần', 25000, 0.7], collab: ['Hợp tác nhà mốt', 80000, 0.88] };
  var GUEST = { none: ['Không khách mời', 0, 0.5], mates: ['Đồng nghiệp cùng công ty', 8000, 0.6], star: ['Nghệ sĩ nổi tiếng', 90000, 0.78], secret: ['Khách mời bí mật', 40000, 0.7] };
  var BUD = { low: ['tiết kiệm', 25000, 0.45, 25], mid: ['tiêu chuẩn', 90000, 0.65, 55], high: ['đầu tư lớn', 320000, 0.86, 120] };
  function kindName(k) { return k === 'group' ? 'concert của nhóm' : k === 'online' ? 'concert trực tuyến' : 'concert solo'; }
  function venueList(l, scope) {
    var s = st(l), y = yr(l), c = K.code(l), v = D.venues(c, y);
    if (scope === 'intl') { var max = s.intl >= 3 ? 4 : s.intl >= 1 ? 3 : 2; v = v.filter(function (x) { return ['hall', 'arena', 'dome', 'stadium'].indexOf(x.k) < max; }); }
    return v;
  }
  function fanBase(l, kind, g) { var f = g ? (g.fandom || 0) : fans(l); if (kind === 'solo' && g) f = f * Math.min(1, 0.25 + pop(l) / 130); return f; }
  function est(l, a) {
    var s = st(l), g = grp(l), vn = venueList(l, a.scope).filter(function (v) { return v.k === a.venue; })[0]; if (!vn) return null;
    var B = BUD[a.budget || 'mid'], m = img(l), f = fanBase(l, a.kind, g), reach = a.scope === 'intl' ? Math.min(0.5, 0.08 + 0.07 * s.intl) : 1;
    var price = V(l, B[3] * (a.kind === 'online' ? 0.2 : 1)), cap = a.kind === 'online' ? Math.max(5000, Math.round(f * 0.12)) : vn.cap;
    var demand = f * 0.22 * (0.5 + pop(l) / 100 * 0.7) * reach * (m.trust / 60) * (1 - m.scandal / 200) * (a.budget === 'low' ? 1.1 : a.budget === 'high' ? 0.85 : 1) * (a.guest === 'star' ? 1.12 : 1);
    if (a.kind === 'online') demand = f * 0.1 * (0.5 + pop(l) / 100) * (a.scope === 'intl' ? 1.5 : 1);
    var shows = a.kind === 'online' ? 1 : Math.max(1, Math.min(vn.k === 'hall' ? 2 : 5, Math.ceil(demand / cap))), sold = Math.round(Math.min(cap * shows, demand));
    var rent = a.kind === 'online' ? 0 : V(l, cap * 0.6 * shows), prod = V(l, B[1] * Math.sqrt(cap / 10000) * (a.kind === 'online' ? 0.4 : 1) * shows), outfit = V(l, OUT[a.outfit || 'simple'][1] * shows), guest = V(l, GUEST[a.guest || 'none'][1] * shows), travel = a.scope === 'intl' ? V(l, 30000 + cap * 2) : 0;
    var cost = rent + prod + outfit + guest + travel, rev = sold * price;
    return { vn: vn, cap: cap, shows: shows, sold: sold, price: price, rent: rent, prod: prod, outfit: outfit, guest: guest, travel: travel, cost: cost, rev: rev, fill: sold / (cap * shows) };
  }
  function cityOf(l, a) { var c = K.ind(l).cities, rr = seeded(l.id + ':city990:' + l.age + a.scope); return a.scope === 'intl' ? c[Math.floor(rr() * c.length)] : null; }
  function planConcert(l, r, log, a) {
    var s = st(l), e = est(l, a); if (!e) return; if (s.cons.some(function (c) { return !c.done && !c.cancelled; })) { log('Bạn đang có một concert chưa diễn ra.', 'neutral'); return; }
    var dep = byCo(l) ? 0 : e.cost * 0.3; if (dep > l.money) { log('Chưa đủ tiền đặt cọc (' + mo(l, dep) + ').', 'neutral'); return; }
    if (dep) H.cash(l, -dep, 'Đặt cọc concert');
    var c = { id: l.age + ':' + s.cons.length, at: l.age, year: yr(l) + 1, kind: a.kind, scope: a.scope, venue: a.venue, concept: a.concept, setlist: a.setlist, outfit: a.outfit, guest: a.guest, budget: a.budget, deposit: dep, byCo: byCo(l), city: cityOf(l, a), done: false };
    s.cons.push(c);
    log('Bạn bắt đầu chuẩn bị ' + kindName(a.kind) + (c.city ? ' tại ' + c.city : '') + ' ở ' + e.vn.n + ' (' + U.fmtNum(e.cap) + ' chỗ), dự kiến năm ' + c.year + '. Chi phí ước tính ' + mo(l, e.cost) + (dep ? ', đã đặt cọc ' + mo(l, dep) : ', công ty đầu tư') + '.', 'good');
  }
  function setFit(l, a, rr) {
    var s = st(l), g = grp(l), rel = l.flags.idol987 && l.flags.idol987.lastRelease, ga = g && g.albums && g.albums[g.albums.length - 1], albums = (g ? g.albums.length : 0) + ((l.flags.idol987 || {}).albums || []).length;
    if (a.setlist === 'hits') return U.clamp(0.3 + Math.min(0.6, s.hits.length * 0.2 + albums * 0.06), 0.2, 1);
    if (a.setlist === 'fresh') return U.clamp(0.25 + ((rel && l.age - rel.age <= 2 ? rel.q : ga && l.age - ga.age <= 2 ? ga.q : 0.2) * 0.7), 0.2, 1);
    if (a.setlist === 'fan') return U.clamp(0.4 + (img(l).trust - 50) / 150 + (img(l).warm - 50) / 300, 0.25, 0.95);
    return rr() < 0.3 ? 0.25 : 0.55 + rr() * 0.4;
  }
  function holdConcert(l, c, rr, log) {
    var s = st(l), a = c, e = est(l, a), m = img(l), g = grp(l);
    if (!e) { c.cancelled = true; log('Địa điểm concert không còn khả dụng; buổi diễn bị hủy và bạn được hoàn một phần cọc.', 'bad'); H.cash(l, c.deposit * 0.5, 'Hoàn một phần cọc concert'); return; }
    if (l.st.hea < 30 || m.scandal >= 80) { if (!c.postponed) { c.postponed = l.age; c.year++; log('Concert phải hoãn sang năm sau vì ' + (l.st.hea < 30 ? 'sức khỏe của bạn chưa đảm bảo' : 'tai tiếng quanh hình ảnh khiến nhà tài trợ và khán giả dè dặt') + '.', 'bad'); fxImg(l, { pro: -2 }); return; }
      c.cancelled = true; log('Concert bị hủy sau khi đã hoãn một lần. Phần cọc bị mất.', 'bad'); fxImg(l, { trust: -4, pro: -4 }); return; }
    var fit = lv(l, CONCEPT[c.concept][1]) / 100, Q = U.clamp(0.28 * fit + 0.2 * setFit(l, c, rr) + 0.14 * OUT[c.outfit][2] + 0.1 * (c.guest === 'secret' ? (rr() < 0.3 ? 0.3 : 0.9) : GUEST[c.guest][2]) + 0.16 * BUD[c.budget][2] + 0.12 * rr() - (l.st.hea < 50 ? 0.06 : 0) - (c.postponed ? 0.03 : 0), 0, 1);
    c.done = true; c.q = Q; var sold = e.sold, cost = e.cost, rev = e.rev, net = rev - cost, co = !!(l.flags.idol155 && l.flags.idol155.company);
    if (c.byCo) { if (net > 0) H.cash(l, net * split(l), 'Doanh thu concert (phần của bạn)'); }
    else H.cash(l, rev * (co ? 0.85 : 1) - (cost - (c.deposit || 0)), 'Kết toán concert');
    var vk = c.venue, F = s.first, notes = [];
    if (!F.concert) { F.concert = yr(l); notes.push('concert đầu tiên'); H.mem(l, 'Đêm diễn đầu tiên của riêng mình.', 7); }
    if (vk === 'arena' && !F.arena && e.fill >= 0.6) { F.arena = yr(l); notes.push('lần đầu lấp đầy nhà thi đấu'); }
    if (vk === 'dome' && e.fill >= 0.6 && !F.dome) { F.dome = yr(l); notes.push('lần đầu tổ chức concert ở dome'); H.mem(l, 'Đứng giữa dome kín chỗ với biển đèn lấp lánh.', 8); }
    if (vk === 'stadium' && e.fill >= 0.6 && !F.stadium) { F.stadium = yr(l); notes.push('lần đầu tổ chức concert ở sân vận động'); H.mem(l, 'Hát giữa sân vận động hàng chục nghìn người.', 8); }
    if (c.scope === 'intl') { s.intl++; if (!F.overseas) { F.overseas = yr(l); notes.push('lần đầu diễn ở nước ngoài'); } }
    if (e.fill >= 0.97 && !F.sold) { F.sold = yr(l); notes.push('cháy vé lần đầu'); }
    var mood = Q >= 0.75 ? 'được khen ngợi hết lời' : Q >= 0.55 ? 'diễn ra tốt đẹp' : Q >= 0.4 ? 'ổn nhưng có chỗ chưa trọn vẹn' : 'gặp nhiều sự cố và bị chê';
    fxImg(l, { warm: Math.round((Q - 0.5) * 10), pro: Math.round((Q - 0.5) * 8), trust: Math.round((Q - 0.45) * 8) }, 'Concert ' + yr(l));
    fameMul(l, Math.max(-0.02, (sold / Math.max(1e4, fans(l))) * 0.06 * (Q - 0.3))); if (g && Q >= 0.45) g.fandom = Math.round((g.fandom || 0) + sold * 0.03 * Q);
    H.fx(l, { hap: Math.round(2 + Q * 8) });
    log(kindName(c.kind)[0].toUpperCase() + kindName(c.kind).slice(1) + (c.city ? ' tại ' + c.city : '') + ' ở ' + e.vn.n + ' ' + mood + ': ' + e.shows + ' đêm, bán ' + U.fmtNum(sold) + ' vé (' + Math.round(e.fill * 100) + '% sức chứa). ' + (net >= 0 ? 'Lợi nhuận ' : 'Thua lỗ ') + mo(l, Math.abs(net)) + (notes.length ? '. Thành tựu: ' + notes.join(', ') + '.' : '.'), notes.length || Q >= 0.75 ? 'big' : 'neutral');
  }
  function concertYear(l, rr, log) { var s = st(l); (s.cons || []).forEach(function (c) { if (!c.done && !c.cancelled && c.year <= yr(l) && c.heldAt !== l.age) { c.heldAt = l.age; holdConcert(l, c, seeded(l.id + ':con990:' + c.id), log); } }); }
  X.menu('concert990', 'Tổ chức concert', why, function (l, d) {
    var a = d && d.arg || {}, s = peek(l), t = 'Độ nổi tiếng cá nhân ' + pop(l) + '/100 · người hâm mộ ' + U.fmtNum(Math.round(fans(l))) + ' · hình ảnh: thiện cảm ' + img(l).warm + ', niềm tin ' + img(l).trust + ', tai tiếng ' + img(l).scandal + '. Thời kỳ ' + D.era(yr(l)).n + ': ' + D.era(yr(l)).live + '. Concert chuẩn bị trong năm và diễn ra năm sau.';
    var open = (s.cons || []).filter(function (c) { return !c.done && !c.cancelled; })[0]; if (open) t += '\nĐang chuẩn bị ' + kindName(open.kind) + ' năm ' + open.year + '.';
    var f = s.first || {}; var ach = []; if (f.concert) ach.push('concert đầu tiên'); if (f.arena) ach.push('nhà thi đấu'); if (f.dome) ach.push('dome'); if (f.stadium) ach.push('sân vận động'); if (f.overseas) ach.push('nước ngoài'); if (f.sold) ach.push('cháy vé'); if (ach.length) t += '\nThành tựu: ' + ach.join(', ') + '.';
    if (a.venue) { var e = est(l, Object.assign({ budget: 'mid', outfit: 'simple', guest: 'none' }, a)); if (e) t += '\nƯớc tính (mức tiêu chuẩn): ' + e.shows + ' đêm, ~' + U.fmtNum(e.sold) + ' vé, chi phí ' + mo(l, e.cost) + ', doanh thu ' + mo(l, e.rev) + '.'; }
    return t;
  }, function (l, a) {
    var s = st(l), g = grp(l), busy = s.cons.some(function (c) { return !c.done && !c.cancelled; }) ? 'Đang chuẩn bị một concert' : true, next = function (patch) { return function (l, r) { X.next(l, 'concert990', r, Object.assign({}, a, patch)); }; };
    if (!a.kind) { var out = [{ k: 'ksolo', l: 'Concert solo', why: busy, run: next({ kind: 'solo' }) }]; if (g) out.unshift({ k: 'kgroup', l: 'Concert của nhóm ' + g.name, why: busy, run: next({ kind: 'group' }) }); if (D.era(yr(l)).id !== 'radio' && D.era(yr(l)).id !== 'tv' && D.era(yr(l)).id !== 'cd') out.push({ k: 'konline', l: 'Concert trực tuyến', h: 'Rẻ hơn, khán giả khắp nơi', why: busy, run: next({ kind: 'online' }) }); return out; }
    if (!a.scope) return [{ k: 'sdom', l: 'Trong nước', run: next({ scope: 'dom' }) }, { k: 'sintl', l: 'Quốc tế (' + K.ind(l).cities.slice(0, 3).join(', ') + '…)', h: 'Lượng fan ở nước ngoài còn ít; dome và sân vận động cần đã từng diễn ở nước ngoài', run: next({ scope: 'intl' }) }];
    if (!a.venue) { if (a.kind === 'online') return [{ k: 'vo', l: 'Phòng thu và sân khấu ảo', run: next({ venue: 'hall' }) }]; return venueList(l, a.scope).map(function (v) { var e = est(l, Object.assign({ budget: 'mid', outfit: 'simple', guest: 'none' }, a, { venue: v.k })); return { k: 'v' + v.k, l: v.n + ' · ' + U.fmtNum(v.cap) + ' chỗ', h: e ? 'Dự kiến bán ~' + U.fmtNum(e.sold) + ' vé' : '', run: next({ venue: v.k }) }; }); }
    if (!a.concept) return Object.keys(CONCEPT).map(function (k) { var f = lv(l, CONCEPT[k][1]); return { k: 'c' + k, l: 'Concept ' + CONCEPT[k][0] + (f >= 60 ? ' — rất hợp' : f < 35 ? ' — còn yếu' : ''), run: next({ concept: k }) }; });
    if (!a.setlist) return Object.keys(SETL).map(function (k) { return { k: 's' + k, l: SETL[k], run: next({ setlist: k }) }; });
    if (!a.outfit) return Object.keys(OUT).map(function (k) { return { k: 'o' + k, l: OUT[k][0] + ' · ' + mo(l, V(l, OUT[k][1])) + '/đêm', run: next({ outfit: k }) }; });
    if (!a.guest) return Object.keys(GUEST).map(function (k) { return { k: 'g' + k, l: GUEST[k][0] + (GUEST[k][1] ? ' · ' + mo(l, V(l, GUEST[k][1])) + '/đêm' : ''), run: next({ guest: k }) }; });
    return Object.keys(BUD).map(function (k) { var e = est(l, Object.assign({}, a, { budget: k })); return { k: 'b' + k, l: 'Đầu tư sản xuất ' + BUD[k][0] + ' · tổng ' + (e ? mo(l, e.cost) : ''), h: e ? 'Giá vé ' + mo(l, e.price) + ', ~' + U.fmtNum(e.sold) + ' vé' : '', run: function (l, r, log) { planConcert(l, r, log, Object.assign({}, a, { budget: k })); } }; });
  }, 16, 'Sự nghiệp giải trí');
  E.DEC.concert990.auto = function () { return 'cancel'; };
  // ================================================================== Fan meeting
  var FMT = { small: ['Giao lưu nhỏ với fan', 400, 300, 0.08], sign: ['Sự kiện ký tặng (fan sign)', 150, 100, 0.12], big: ['Fan meeting lớn', 4000, 3000, 0.05], online: ['Fan meeting trực tuyến', 100, 20000, 0.03] };
  function fmOk(l, k) { return k !== 'online' || D.era(yr(l)).id !== 'radio' && D.era(yr(l)).id !== 'tv' && D.era(yr(l)).id !== 'cd'; }
  function holdFanmeet(l, r, log, a) {
    var s = st(l), F = FMT[a.fmt], rr = seeded(l.id + ':fm990:' + l.age), g = grp(l), cost = V(l, F[1] * (a.sec === 'strict' ? 1.3 : 1) * (a.theme === 'show' ? 1.4 : 1)); if (!byCo(l) && cost > l.money) { log('Chưa đủ tiền tổ chức (' + mo(l, cost) + ').', 'neutral'); return; }
    s.fm = s.fm || {}; s.fm.at = l.age; var n = Math.min(F[2], Math.round(fans(l) * 0.02) + 40), warm = 3 + (a.fmt === 'sign' || a.fmt === 'small' ? 3 : 1) + (a.theme === 'open' ? 2 : 0), notes = [], m = img(l);
    if (!byCo(l)) H.cash(l, -cost, 'Tổ chức ' + F[0].toLowerCase()); H.cash(l, V(l, n * (a.fmt === 'online' ? 4 : 12)) * (byCo(l) ? split(l) : 0.8), 'Doanh thu ' + F[0].toLowerCase());
    if (a.fmt !== 'online' && a.sec !== 'strict' && rr() < 0.12 + n / 20000) { notes.push('một người hâm mộ bị chen lấn ngã vì an ninh lỏng lẻo'); fxImg(l, { pro: -3, scandal: 6 }); }
    if (a.theme === 'open' && rr() < 0.3) { notes.push('có câu hỏi thẳng về đời tư và bạn trả lời khéo'); fxImg(l, { warm: 2 }); if (l.partner && st(l).date990) st(l).date990.risk = Math.min(100, (st(l).date990.risk || 0) + 6); }
    if (rr() < 0.25) { notes.push('một khoảnh khắc xúc động khiến cả khán phòng lặng đi'); warm += 2; }
    fxImg(l, { warm: warm, trust: 3, pro: a.sec === 'strict' ? 1 : 0 }, F[0]); fameMul(l, F[3] * 0.1); if (g) g.fandom = Math.round((g.fandom || 0) * (1 + F[3] * 0.1));
    H.fx(l, { hap: 4 }); if (!s.first.fanmeet) { s.first.fanmeet = yr(l); H.mem(l, 'Lần đầu gặp người hâm mộ mặt đối mặt.', 5); }
    log(F[0] + ' với ' + U.fmtNum(n) + ' người hâm mộ' + (a.fmt === 'online' ? ' xem trực tuyến' : '') + ' đã diễn ra' + (notes.length ? ': ' + notes.join('; ') : ' suôn sẻ') + '.', 'good');
  }
  X.menu('fanmeet990', 'Fan meeting và giao lưu với người hâm mộ', function (l) { return why(l) === true && fans(l) >= 2000 ? true : why(l) === true ? 'Cần ít nhất 2.000 người hâm mộ' : why(l); },
    function (l) { var s = peek(l); return 'Người hâm mộ ' + U.fmtNum(Math.round(fans(l))) + ' · thiện cảm ' + img(l).warm + ' · niềm tin ' + img(l).trust + '. Mỗi năm tổ chức một lần; sự kiện gần gũi tạo gắn kết sâu hơn nhưng ít người tham dự.' + (s.fm && s.fm.at === l.age ? '\nNăm nay đã tổ chức.' : ''); },
    function (l, a) {
      var s = peek(l), done = s.fm && s.fm.at === l.age ? 'Năm nay đã tổ chức' : true, nx = function (p) { return function (l, r) { X.next(l, 'fanmeet990', r, Object.assign({}, a, p)); }; };
      if (!a.fmt) return Object.keys(FMT).filter(function (k) { return fmOk(l, k); }).map(function (k) { return { k: 'f' + k, l: FMT[k][0] + ' · ~' + FMT[k][1 + 1] + ' người', why: done, run: nx({ fmt: k }) }; });
      if (!a.theme) return [{ k: 'ttalk', l: 'Trò chuyện, trả lời câu hỏi', run: nx({ theme: 'talk' }) }, { k: 'topen', l: 'Hỏi đáp thẳng thắn, kể chuyện đời thường', h: 'Gần gũi hơn nhưng dễ vướng câu hỏi đời tư', run: nx({ theme: 'open' }) }, { k: 'tshow', l: 'Kèm tiết mục biểu diễn', h: 'Tốn kém hơn', run: nx({ theme: 'show' }) }];
      return [{ k: 'snorm', l: 'An ninh tiêu chuẩn', run: function (l, r, log) { holdFanmeet(l, r, log, Object.assign({}, a, { sec: 'std' })); } }, { k: 'sstrict', l: 'An ninh chặt chẽ', h: 'Tốn thêm, ít sự cố', run: function (l, r, log) { holdFanmeet(l, r, log, Object.assign({}, a, { sec: 'strict' })); } }];
    }, 16, 'Sự nghiệp giải trí');
  E.DEC.fanmeet990.auto = function () { return 'cancel'; };
  // ================================================================== Sự kiện nhãn hàng
  var BEV = { launch: ['Sự kiện ra mắt sản phẩm', 1], week: ['Tuần lễ thời trang', 1.6], popup: ['Khai trương cửa hàng pop-up', 0.7], party: ['Tiệc tri ân khách hàng của nhãn hàng', 0.9] };
  function deals(l) { var s = l.flags.idol987; return s && s.deals ? s.deals.filter(function (d) { return !d.ended && d.until > l.age; }) : []; }
  function holdBrand(l, r, log, a) {
    var s = st(l), rr = seeded(l.id + ':brand990:' + l.age + a.ev), E0 = BEV[a.ev], ds = deals(l), d = ds[0] || null, fee = V(l, 4000 * Math.pow(1.045, pop(l)) * E0[1] * (a.full ? 1 : 0.5));
    s.first.brand = s.first.brand || yr(l);
    s.brandAt = l.age; var risk = 0; if (a.wear === 'own' && d && rr() < 0.55) risk = 1;
    if (a.wear === 'own' && d) { d.rel990 = (d.rel990 || 0) - 1; }
    H.cash(l, fee * (byCo(l) ? 0.5 : 0.85), 'Cát-xê sự kiện ' + E0[0].toLowerCase());
    fxImg(l, { pro: a.full ? 3 : 1, warm: a.full ? 1 : 0 }, E0[0]); if (d && a.wear === 'brand') d.rel990 = (d.rel990 || 0) + 1; fameMul(l, 0.004 * E0[1] * (a.full ? 1 : 0.5));
    var styleScore = img(l).pro * .4 + lv(l, 'acting') * .2 + rr() * 40 + (a.wear === 'brand' ? 8 : 0);
    var praised = styleScore >= 50;
    topic(l, 'Nhan sắc và phong cách', praised, E0[0] + (praised ? ' · Tạo hình của bạn được khán giả khen.' : ' · Tạo hình của bạn bị bàn tán vì không hợp sự kiện.'), log);
    fameMul(l, praised ? .01 : -.01);
    if (risk) { fxImg(l, { pro: -4, scandal: 5 }); if (d && d.rel990 <= -2) { d.ended = l.age; log(d.brand + ' chấm dứt hợp đồng sau nhiều lần bạn không dùng sản phẩm của họ ở sự kiện.', 'bad'); } else log('Bạn mặc đồ của hãng khác ở sự kiện của ' + d.brand + ' và bị báo chí chú ý; nhãn hàng nhắc nhở.', 'bad'); }
    else log('Bạn tham dự ' + E0[0].toLowerCase() + (a.full ? ' đến cuối buổi, chụp ảnh và giao lưu' : ' trong thời gian ngắn') + '. Cát-xê ' + mo(l, fee * (byCo(l) ? 0.5 : 0.85)) + (d && a.wear === 'brand' ? '; ' + d.brand + ' hài lòng.' : '.'), 'good');
  }
  X.menu('brand990', 'Sự kiện của nhãn hàng', function (l) { return why(l) === true && pop(l) >= 30 ? true : why(l) === true ? 'Cần độ nổi tiếng cá nhân từ 30/100' : why(l); },
    function (l) { var ds = deals(l); return 'Nhãn hàng mời nghệ sĩ có sức hút tới sự kiện. ' + (ds.length ? 'Bạn đang đại diện ' + ds.map(function (d) { return d.brand; }).join(', ') + '; nên mặc trang phục của nhãn hàng khi dự sự kiện của họ.' : 'Bạn chưa có hợp đồng đại diện; tham dự giúp nhãn hàng biết đến bạn.') + (peek(l).brandAt === l.age ? '\nNăm nay đã tham dự.' : ''); },
    function (l, a) {
      var done = peek(l).brandAt === l.age ? 'Năm nay đã tham dự' : true, nx = function (p) { return function (l, r) { X.next(l, 'brand990', r, Object.assign({}, a, p)); }; };
      if (!a.ev) return Object.keys(BEV).map(function (k) { return { k: 'e' + k, l: BEV[k][0], why: done, run: nx({ ev: k }) }; });
      if (a.full == null) return [{ k: 'ffull', l: 'Tham dự trọn buổi, giao lưu khách mời', run: nx({ full: true }) }, { k: 'fshort', l: 'Chỉ xuất hiện ngắn', run: nx({ full: false }) }];
      return [{ k: 'wb', l: 'Mặc trang phục nhãn hàng cung cấp', run: function (l, r, log) { holdBrand(l, r, log, Object.assign({}, a, { wear: 'brand' })); } }, { k: 'wo', l: 'Tự chọn trang phục', h: deals(l).length ? 'Có thể vướng điều khoản đại diện' : '', run: function (l, r, log) { holdBrand(l, r, log, Object.assign({}, a, { wear: 'own' })); } }];
    }, 16, 'Sự nghiệp giải trí');
  E.DEC.brand990.auto = function () { return 'cancel'; };
  // ================================================================== Chiến lược quảng bá
  X.menu('promo990', 'Chiến lược quảng bá sản phẩm', function (l) { return why(l); }, function (l) { var e = D.era(yr(l)), p = peek(l).promo; return 'Thời kỳ ' + e.n + ': sản phẩm lan truyền chủ yếu qua ' + e.reach + '. Chọn cách quảng bá cho đợt phát hành sắp tới; hiệu quả phụ thuộc thời kỳ và chất lượng sản phẩm.' + (p ? '\nĐang chọn: ' + K.PROMO[p.kind][0] + ' (năm ' + (l.birthYear + p.age) + ').' : ''); },
    function (l) { return Object.keys(K.PROMO).map(function (k) { return { k: 'p' + k, l: K.PROMO[k][0], h: K.eraFit(l, K.PROMO[k][1]) >= 1.1 ? 'Rất hợp thời kỳ này' : K.eraFit(l, K.PROMO[k][1]) < 0.8 ? 'Ít hiệu quả thời kỳ này' : '', run: function (l, r, log) { var s = st(l); s.promo = { age: l.age, kind: k }; if (k !== 'low') H.cash(l, -V(l, 4000), 'Chi phí quảng bá'); log('Bạn chọn cách quảng bá: ' + K.PROMO[k][0].toLowerCase() + '.', 'neutral'); } }; }); }, 16, 'Sự nghiệp giải trí');
  E.DEC.promo990.auto = function () { return 'cancel'; };
  // ================================================================== Gặp người hâm mộ ngoài đời
  function chat(l, risk) { var d = st(l).date990; if (d && d.stage !== 'open') d.risk = Math.min(100, (d.risk || 0) + risk); }
  var ENC = {
    sign: { v: 1, text: 'Một người hâm mộ nhận ra bạn ngoài phố và xin chữ ký.', o: [{ l: 'Ký tên và chụp ảnh cùng', fx: { warm: 4, trust: 1 }, fame: 0.003, hap: 2 }, { l: 'Ký nhanh rồi đi tiếp (đang gấp)', fx: { warm: 1 } }, { l: 'Từ chối lịch sự', fx: { warm: -2 } }, { l: 'Phớt lờ', fx: { warm: -5, trust: -1 }, clip: 0.15 }] },
    caught: { v: 0, text: 'Bạn bị bắt gặp ngoài phố trong bộ dạng đời thường và có người giơ điện thoại chụp.', o: [{ l: 'Cười và vẫy tay', fx: { warm: 2 } }, { l: 'Đội mũ che mặt đi nhanh', fx: { warm: -1 } }, { l: 'Nhờ họ xóa ảnh một cách lịch sự', fx: { pro: 1 }, ok: 0.55, bad: { scandal: 3, warm: -1 } }, { l: 'Làm ngơ', fx: {} }] },
    withp: { v: -1, text: 'Bạn đi cùng người yêu và có người nhận ra, chụp ảnh từ xa.', need: function (l) { return !!l.partner && l.partner.status !== 'married'; }, o: [{ l: 'Tách ra đi riêng ngay', fx: { warm: -1 }, date: -12 }, { l: 'Mặc kệ, tiếp tục như bình thường', fx: {}, date: 14 }, { l: 'Nhờ công ty xử lý hình ảnh trước khi bị đăng', fx: { pro: 1 }, cost: 1500, date: -20 }] },
    kid: { v: 1, text: 'Một em nhỏ chạy tới ôm bạn và nói bé thuộc hết bài hát của bạn.', o: [{ l: 'Ngồi xuống trò chuyện, hát một đoạn', fx: { warm: 5, trust: 2 }, hap: 3, fame: 0.002 }, { l: 'Chụp ảnh cùng bé rồi chào', fx: { warm: 2 } }, { l: 'Nhờ người nhà bé đưa bé về, vì đang bận', fx: { warm: -1 } }] },
    film: { v: -1, text: 'Có người quay clip bạn đang mệt mỏi và cau có ngoài đường.', o: [{ l: 'Nói chuyện bình tĩnh và nhờ họ không đăng', fx: { pro: 1, warm: 1 }, ok: 0.5, bad: { scandal: 4 } }, { l: 'Phớt lờ và rời đi', fx: {}, clip: 0.2 }, { l: 'Gắt lên vì bị quay lén', fx: { warm: -3 }, clip: 0.55 }, { l: 'Nhờ công ty xử lý nếu clip lan truyền', fx: { pro: 1 }, cost: 800 }] },
    stalk: { v: -1, text: 'Một người hâm mộ liên tục bám theo bạn tới tận nơi ở.', o: [{ l: 'Bình tĩnh nói rõ giới hạn riêng tư', fx: { pro: 1 }, ok: 0.5, bad: { warm: -2 }, hap: -1 }, { l: 'Báo công ty và nhờ bảo vệ', fx: { pro: 1 }, cost: 2500, hap: 1 }, { l: 'Báo cảnh sát', fx: {}, hap: 1 }, { l: 'Lờ đi và đổi lịch trình', fx: {}, hap: -3 }] },
    help: { v: 1, text: 'Bạn chứng kiến một vụ va chạm giao thông nhỏ trên phố, có người bị ngã.', o: [{ l: 'Dừng lại giúp đỡ và gọi cấp cứu', fx: { warm: 5, pro: 2, trust: 2 }, hap: 2, news: 0.4 }, { l: 'Gọi cấp cứu rồi rời đi để tránh đông người', fx: { warm: 1 } }, { l: 'Đi tiếp vì đang gấp', fx: { warm: -1 } }] },
    misid: { v: 0, text: 'Có người nhận nhầm bạn với một người nổi tiếng khác.', o: [{ l: 'Cười, đính chính vui vẻ', fx: { warm: 2 } }, { l: 'Chơi theo và chụp chung', fx: { warm: 1 }, clip: 0.1 }, { l: 'Lờ đi', fx: {} }] },
    rude: { v: -1, text: 'Một người qua đường buông lời châm chọc về công việc của bạn.', o: [{ l: 'Mỉm cười và bỏ qua', fx: { warm: 1, pro: 1 } }, { l: 'Đáp lại bình tĩnh nhưng rõ ràng', fx: { pro: 1 }, ok: 0.6, bad: { scandal: 3 } }, { l: 'Đáp trả gay gắt', fx: { warm: -3 }, clip: 0.6 }] },
    gift: { v: 1, text: 'Một người hâm mộ đưa bạn món quà tự tay làm.', o: [{ l: 'Nhận và cảm ơn chân thành', fx: { warm: 3, trust: 1 }, hap: 2 }, { l: 'Nhận, nhưng đưa lại cho quản lý kiểm tra', fx: { pro: 1 } }, { l: 'Từ chối lịch sự vì quy định của công ty', fx: { warm: -1, pro: 1 } }] },
    elder: { v: 1, text: 'Một cụ già ở quán ăn bảo cháu của cụ rất thích bạn và xin chụp ảnh gửi cháu.', o: [{ l: 'Chụp ảnh và gửi lời chào cho cháu', fx: { warm: 4 }, hap: 2 }, { l: 'Chụp nhanh rồi đi', fx: { warm: 1 } }] }
  };
  function applyEnc(l, r, log, e, o, id) {
    var rr = seeded(l.id + ':enc990:' + id + ':' + l.age), fx = Object.assign({}, o.fx || {}), why = 'Gặp người hâm mộ: ' + o.l.toLowerCase(), extra = '';
    if (o.ok != null) { var q = o.ok + (l.st && l.st.soc ? (l.st.soc - 50) / 300 : 0); if (rr() >= q) { Object.keys(o.bad || {}).forEach(function (k) { fx[k] = (fx[k] || 0) + o.bad[k]; }); extra = ' Nhưng chuyện không êm như mong đợi.'; } else extra = ' Mọi chuyện được giải quyết êm đẹp.'; }
    if (o.clip && rr() < o.clip * (pop(l) / 60)) { fx.scandal = (fx.scandal || 0) + 7; fx.warm = (fx.warm || 0) - 3; extra += ' Đoạn clip bị đăng lên mạng và lan nhanh.'; }
    if (o.news && rr() < o.news * pop(l) / 60) { fx.warm = (fx.warm || 0) + 3; extra += ' Báo chí đưa tin tốt về hành động này.'; }
    if (o.cost) H.cash(l, -V(l, o.cost), 'Chi phí xử lý hình ảnh'); if (o.date) chat(l, o.date); if (o.hap) H.fx(l, { hap: o.hap }); if (o.fame) fameMul(l, o.fame);
    var reaction = (fx.warm || 0) + (fx.pro || 0) - (fx.scandal || 0);
    if (Math.abs(reaction) >= 2) topic(l, 'Thái độ', reaction > 0, (reaction > 0 ? 'Khán giả đánh giá cao' : 'Khán giả tranh luận về') + ' cách bạn xử sự: ' + o.l.toLowerCase() + '.', log);
    fxImg(l, fx, why); st(l).encLast = st(l).encLast || {}; st(l).encLast[id] = l.age; log(e.text + ' Bạn chọn: ' + o.l.toLowerCase() + '.' + extra, (fx.warm || 0) + (fx.pro || 0) - (fx.scandal || 0) >= 2 ? 'good' : (fx.scandal || 0) >= 3 ? 'bad' : 'neutral');
  }
  E.SC('encounter990', {
    title: function (l, d) { return 'Ngoài phố'; }, text: function (l, d) { return ENC[d.id].text + ' Cách bạn phản ứng sẽ để lại ấn tượng với người xung quanh.'; },
    prep: function (l, r, arg) { return { id: arg.id }; },
    opts: [0, 1, 2, 3].map(function (i) { return { k: String(i), req: function (l, d) { return !!ENC[d.id].o[i]; }, l: function (l, d) { var o = ENC[d.id].o[i]; return o ? o.l : ''; }, ai: function (l, d) { var o = ENC[d.id].o[i]; return o ? 1 + ((o.fx.warm || 0) + (o.fx.pro || 0)) / 4 - (o.clip || 0) * 2 : 0; }, run: function (l, r, log, d) { var e = ENC[d.id]; applyEnc(l, r, log, e, e.o[i], d.id); } }; })
  });
  function encounterYear(l, rr, log) {
    var s = st(l); if (s.encYear === l.age || pop(l) < 18 && (l.fame || 0) < 3e4 || !K.free(l) || l.age < 14) return; s.encYear = l.age;
    if (rr() > Math.min(0.55, 0.2 + pop(l) / 220)) return; var cool = s.encLast || {}, ids = Object.keys(ENC).filter(function (k) { return (!ENC[k].need || ENC[k].need(l)) && !(cool[k] != null && l.age - cool[k] < 4); }); if (!ids.length) return;
    var id = U.wpick(rr, ids, function (k) { return 1; }); // đều nhau: tích cực, trung tính và tiêu cực có tần suất tương đương
    var d = E.DEC.encounter990.make(l, rr, { id: id }); d.manual = false; l.pending.push(d);
  }
  // ================================================================== Hẹn hò bị phát hiện
  var EPOCH = { radio: 0.3, tv: 0.5, cd: 0.8, web: 1.3, short: 1.7, ai: 1.9, immersive: 2 };
  function partnerOk(l) { var p = l.partner; return !!(p && p.alive !== false && /dating|cohabit|engaged/.test(p.status || 'dating')); }
  function severity(l) { var base = K.ind(l).dating, idolish = !!grp(l) || K.ind(l).idolGroup; return Math.max(0, base - (idolish ? 0 : 1)); }
  function dateYear(l, rr, log) {
    var s = st(l), d = s.date990; if (!partnerOk(l) || pop(l) < 25 && !grp(l)) { if (d && !partnerOk(l) && d.stage !== 'done') { d.stage = 'done'; d.endAge = l.age; } return; }
    if (!d || d.key !== l.partner.name + ':' + l.partner.since) { d = s.date990 = { key: l.partner.name + ':' + l.partner.since, name: l.partner.name, stage: 'secret', since: l.age, risk: 0, hist: [] }; }
    if (d.stage === 'open' || d.stage === 'done') return; if (d.stage === 'aftermath') { d.after = (d.after || 0) - 1; if (d.after <= 0) { d.stage = 'open'; } else fxImg(l, { trust: 1 }); return; }
    var pe = 0.07 * (0.4 + pop(l) / 60) * (l.partner.celeb912 ? 1.5 : 1) * (EPOCH[D.era(yr(l)).id] || 1) * (1 + d.risk / 40) * (d.careful ? 0.5 : 1); pe = Math.min(0.5, pe);
    if (d.stage === 'secret') { if (rr() < pe * 1.4) { d.stage = 'rumor'; d.risk = Math.min(100, d.risk + 15); d.hist.push(yr(l) + ': tin đồn'); log('Người hâm mộ tinh ý bắt đầu bàn tán về việc bạn đang hẹn hò. Bạn có thể xử lý trong mục Hẹn hò và truyền thông.', 'neutral'); } }
    else if (d.stage === 'rumor') { if (rr() < 0.45 + d.risk / 150) { d.stage = 'exposed'; d.ev = rr() < 0.3 + d.risk / 150 + (l.partner.celeb912 ? 0.15 : 0); d.hist.push(yr(l) + ': bị đăng báo'); var dd = E.DEC.dateExpose990.make(l, rr, {}); dd.manual = false; l.pending.push(dd); log('Một bài báo đăng ảnh và thông tin bạn hẹn hò ' + l.partner.name + '. Truyền thông và người hâm mộ chờ phản hồi từ bạn.', 'bad'); } else if (rr() < 0.35) { d.stage = 'secret'; d.risk = Math.max(0, d.risk - 8); log('Tin đồn về chuyện hẹn hò của bạn lắng xuống.', 'neutral'); } }
  }
  function sevText(l) { var sv = severity(l); return sv >= 3 ? 'rất khắt khe' : sv === 2 ? 'khá khắt khe' : sv === 1 ? 'tương đối thoáng' : 'thoáng'; }
  function react(l, r, log, k) {
    var s = st(l), d = s.date990, rr = seeded(l.id + ':dexp990:' + l.age), sv = severity(l), g = grp(l), m = img(l), pa = l.partner;
    if (!d || !pa) return; var tol = U.clamp(0.8 - sv * 0.18 + (m.trust - 50) / 200 + (l.age >= 22 ? 0.05 : -0.05), 0.1, 0.95), base = (0.03 + sv * 0.04) * (g ? 1.2 : 1) * (1 - tol * 0.6), loss = 0, st1 = { scandal: 0, trust: 0, warm: 0 }, txt = '', end = 'aftermath', fine = 0;
    if (k === 'sincere') { loss = base * 0.7; st1 = { warm: 3, trust: -1, scandal: 4 }; txt = 'Bạn xác nhận mối quan hệ một cách chân thành, không né tránh. Phần lớn người hâm mộ ghi nhận sự thẳng thắn' + (sv >= 2 ? ', dù vẫn có người thất vọng' : '') + '.'; d.after = 2; if (sv >= 2 && g) fine = V(l, sv * 15000); }
    else if (k === 'apology') { loss = base * 0.9; st1 = { warm: 0, trust: 2, scandal: 2 }; txt = 'Bạn xin lỗi người hâm mộ vì gây lo lắng và hứa tập trung vào công việc. Một số người chấp nhận, một số cho rằng bạn không có gì phải xin lỗi.'; d.after = 2; d.careful = true; }
    else if (k === 'deny') { if (d.ev) { loss = base * 2.2; st1 = { warm: -6, trust: -12, scandal: 25 }; txt = 'Bạn phủ nhận nhưng bằng chứng quá rõ ràng. Việc nói dối khiến mọi chuyện tệ hơn nhiều so với bản thân chuyện hẹn hò.'; d.after = 4; if (sv >= 2) fine = V(l, sv * 20000); } else { loss = base * 0.3; st1 = { scandal: -2 }; txt = 'Bạn và công ty phủ nhận; không có bằng chứng chắc chắn nên câu chuyện dần lắng, nhưng người hâm mộ tinh ý vẫn dõi theo.'; d.after = 1; d.stage = 'secret'; d.risk = Math.min(100, d.risk + 10); end = 'secret'; } }
    else if (k === 'silence') { loss = base * 0.9; st1 = { scandal: 6, trust: -2 }; txt = 'Bạn không nói gì. Suy đoán lan rộng và truyền thông tự kể câu chuyện theo cách của họ.'; d.after = 3; }
    else if (k === 'breakup') { loss = base * 0.5; st1 = { scandal: 2, trust: 0 }; txt = 'Bạn chia tay để bảo vệ sự nghiệp. Fan nhẹ nhõm nhưng bạn mang nhiều day dứt.'; d.after = 1; H.fx(l, { hap: -12 }); l.partner = null; l.exes = (l.exes || 0) + 1; d.stage = 'done'; end = 'done'; }
    else { loss = base * 0.4; st1 = { warm: 2, trust: 1, scandal: 2 }; txt = 'Công ty đưa ra thông báo chính thức: hai bên đang tìm hiểu nhau, đề nghị tôn trọng đời tư. Cách xử lý chuyên nghiệp giúp dư luận dịu xuống.'; d.after = 2; }
    if (fine) H.cash(l, -fine, 'Phạt vi phạm điều khoản đời tư');
    fameMul(l, -loss); fxImg(l, st1, 'Chuyện hẹn hò bị đăng báo'); ((l.flags.idol987 && l.flags.idol987.deals) || []).forEach(function (dl) { if (!dl.ended && rr() < sv * 0.12 * (k === 'deny' && d.ev ? 2 : 1)) { dl.ended = l.age; txt += ' ' + dl.brand + ' chấm dứt hợp đồng.'; } });
    if (k !== 'breakup' && pa && (k === 'deny' && d.ev || k === 'silence') && rr() < 0.25) { txt += ' ' + pa.name + ' bị tổn thương vì cách xử lý và hai người cãi nhau.'; pa.pressure990 = (pa.pressure990 || 0) + 1; if (pa.pressure990 >= 2) { l.partner = null; l.exes = (l.exes || 0) + 1; end = 'done'; txt += ' Cuối cùng ' + pa.name + ' rời đi.'; } }
    d.stage = end === 'secret' ? 'secret' : end; d.hist.push(yr(l) + ': ' + k); d.res = k; s.first.dateExposed = s.first.dateExposed || yr(l);
    log(txt + (fine ? ' Khoản phạt ' + mo(l, fine) + '.' : '') + (loss > 0.02 ? ' Người hâm mộ giảm khoảng ' + Math.round(loss * 100) + '%.' : ''), loss > 0.06 ? 'bad' : 'neutral');
  }
  var DROWS = [['sincere', 'Xác nhận chân thành trên kênh cá nhân', 'Trung thực; dư luận tùy văn hóa'], ['company', 'Để công ty ra thông báo chính thức', 'Chuyên nghiệp, ít tự chủ'], ['apology', 'Xác nhận kèm lời xin lỗi người hâm mộ', 'Dễ được tha thứ ở nơi khắt khe'], ['deny', 'Phủ nhận', 'Rủi ro nếu có bằng chứng'], ['silence', 'Im lặng, không bình luận', 'Tin đồn tự lan'], ['breakup', 'Chia tay để dập tắt', 'Mất mối quan hệ']];
  E.SC('dateExpose990', {
    title: function () { return 'Chuyện hẹn hò bị đăng báo'; },
    text: function (l) { var d = peek(l).date990; return 'Truyền thông đăng tin bạn hẹn hò ' + (l.partner ? l.partner.name : (d && d.name) || '') + '. Công chúng ở nơi bạn hoạt động ' + sevText(l) + ' với chuyện này' + (grp(l) ? '; thành viên nhóm nhạc thường chịu kỳ vọng cao hơn' : '') + '. Bằng chứng ' + (d && d.ev ? 'có vẻ rõ ràng (ảnh, tin nhắn)' : 'chưa chắc chắn') + '.'; },
    prep: function () { return {}; },
    opts: DROWS.map(function (x, i) { return { k: String(i), req: function (l) { return !!l.partner || x[0] !== 'breakup' && false; }, l: x[1], h: x[2], ai: function (l) { return [3, 2.2, 1.4, 0.6, 0.6, 0.4][i]; }, run: function (l, r, log) { react(l, r, log, x[0]); } }; })
  });
  X.menu('date990', 'Hẹn hò và truyền thông', function (l) { return K.performer(l) && partnerOk(l) ? true : !partnerOk(l) ? 'Cần đang có mối quan hệ' : 'Dành cho người hoạt động trước công chúng'; },
    function (l) { var d = peek(l).date990; return 'Văn hóa nơi bạn làm việc ' + sevText(l) + ' với chuyện hẹn hò của nghệ sĩ. Thời kỳ ' + D.era(yr(l)).n + ': mức độ dễ bị chụp ảnh và lan truyền ' + ((EPOCH[D.era(yr(l)).id] || 1) >= 1.3 ? 'cao' : 'thấp hơn') + '. Giai đoạn hiện tại: ' + ({ secret: 'chưa ai biết', rumor: 'đã có tin đồn', exposed: 'đã bị đăng báo', aftermath: 'đang qua giai đoạn hậu quả', open: 'đã công khai', done: 'đã kết thúc' }[d && d.stage || 'secret']) + (d ? ' · mức rủi ro ' + d.risk + '/100' : '') + '.'; },
    function (l) {
      var s = st(l), d = s.date990; if (!d || d.stage === 'open' || d.stage === 'done') return [];
      var out = [{ k: 'careful', l: 'Cẩn trọng hơn: gặp ở nơi riêng tư, hạn chế đi chung nơi công cộng', h: 'Giảm một nửa khả năng bị phát hiện', why: d.careful ? 'Đang cẩn trọng' : true, run: function (l, r, log) { d.careful = true; d.risk = Math.max(0, d.risk - 10); log('Bạn và người yêu thống nhất cách gặp riêng tư hơn.', 'neutral'); H.fx(l, { hap: -1 }); } }];
      out.push({ k: 'open', l: 'Chủ động công khai khi chưa bị phát hiện', h: 'Tự kể chuyện của mình; phản ứng tùy văn hóa', run: function (l, r, log) { var rr = seeded(l.id + ':open990:' + l.age), sv = severity(l), loss = (0.015 + sv * 0.02) * (grp(l) ? 1.2 : 1) * (1 - (img(l).trust - 30) / 120); fameMul(l, -Math.max(0, loss)); fxImg(l, { warm: 3, trust: 2 }, 'Công khai chuyện hẹn hò'); d.stage = 'aftermath'; d.after = 2; log('Bạn tự công khai mối quan hệ với ' + l.partner.name + '. ' + (sv >= 2 ? 'Một phần người hâm mộ thất vọng nhưng đánh giá cao sự chủ động.' : 'Phần lớn phản hồi là chúc mừng.'), 'good'); } });
      return out;
    }, 16, 'Sự nghiệp giải trí');
  E.DEC.date990.auto = function () { return 'cancel'; };
  // ================================================================== Vòng năm
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive) return; var s0 = l.flags.idol990; if (!s0 && !(K.performer(l) && pop(l) >= 25)) return; var s = st(l); if (s.liveYear === l.age) return; s.liveYear = l.age; var rr = seeded(l.id + ':live990:' + l.age);
    concertYear(l, rr, log); dateYear(l, rr, log); encounterYear(l, rr, log);
  });
  if (E.addAchievements) E.addAchievements([
    ['sb_concert990', '🎪', 'Đêm diễn của riêng mình', 'Tổ chức concert đầu tiên', function (l) { var s = l.flags.idol990; return !!(s && s.first && s.first.concert); }],
    ['sb_dome990', '🏟️', 'Dưới mái vòm', 'Tổ chức concert ở dome', function (l) { var s = l.flags.idol990; return !!(s && s.first && s.first.dome); }],
    ['sb_stadium990', '🌟', 'Giữa sân vận động', 'Tổ chức concert ở sân vận động', function (l) { var s = l.flags.idol990; return !!(s && s.first && s.first.stadium); }],
    ['sb_overseas990', '✈️', 'Diễn ở xứ người', 'Tổ chức concert ở nước ngoài', function (l) { var s = l.flags.idol990; return !!(s && s.first && s.first.overseas); }]
  ]);
  if (E.addAchievements) {
    var events = festivals.concat([{ id: 'fanmeet', name: 'fan meeting' }, { id: 'brand', name: 'sự kiện nhãn hàng' }]);
    E.addAchievements(events.map(function (e) {
      return ['sb_first_' + e.id, '🎤', 'Lần đầu tại ' + e.name, 'Tham dự ' + e.name + ' lần đầu', function (l) {
        var s = peek(l);
        return !!(s.first && s.first[e.id] || e.id === 'brand' && s.brandAt != null);
      }];
    }));
  }
  E.IDOL990L = { est: est, planConcert: planConcert, holdConcert: holdConcert, concertYear: concertYear, holdFanmeet: holdFanmeet, holdBrand: holdBrand, dateYear: dateYear, react: react, severity: severity, encounterYear: encounterYear, ENC: ENC, applyEnc: applyEnc, venueList: venueList, CONCEPT: CONCEPT, BUD: BUD };
})(globalThis.G);
