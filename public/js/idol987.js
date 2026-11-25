/* Một Đời — 9.8.7: thêm đường debut qua chương trình sống còn, vị trí trong nhóm, quảng cáo / đại diện nhãn hàng và album solo.
   Mở rộng hệ thần tượng sẵn có (life155 IDOL155, life139 công ty, life151 khung chương trình truyền hình), không thay thế.
   · Chương trình sống còn: ngoài audition công ty, người 15–25 tuổi có thể gửi hồ sơ dự thi với tư cách thí sinh cá nhân
     (hoặc cùng công ty đang đào tạo). Vòng sơ tuyển xét kỹ năng thật; dưới 18 tuổi cần người giám hộ đồng ý. Người sống ở nước khác
     sang nơi ghi hình vài tháng rồi về, không đổi nơi cư trú. Lọt đội hình debut → nhóm dự án (life155 lo phần thi và debut).
   · Vị trí trong nhóm: main/lead/sub vocal, main/lead dancer, main/lead rapper, center, visual, leader. Mỗi năm có thể đề nghị
     đổi vị trí; công ty so kỹ năng của bạn với thành viên đang giữ vị trí đó. Vị trí quyết định độ chú ý riêng (độ nổi tiếng cá nhân).
   · Quảng cáo, đại diện nhãn hàng, chụp ảnh tạp chí, hợp tác sản phẩm: lời mời đến theo độ nổi tiếng cá nhân và hình ảnh.
     Hợp đồng đại diện có thời hạn, độc quyền theo ngành hàng, chi trả mỗi năm một lần; tiền án mới thì nhãn hàng chấm dứt hợp đồng.
   · Album solo: tích lũy đủ độ nổi tiếng và giọng hát/rap mới được phát hành; thần tượng cần công ty duyệt. Sản xuất trong năm,
     phát hành năm sau; kết quả theo kỹ năng, độ nổi tiếng, concept, ngân sách và may rủi.
   Các nhãn hàng, công ty quản lý nhóm dự án và con số doanh thu là mô phỏng; chương trình lấy cảm hứng từ format thật. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, SH = E.SHOW151, L = E.LIFE138, I = E.IDOL155;
  if (!E || !X || !SH || !L || !I) return;
  var seeded = SH.seeded, hash = SH.hash, V = SH.V, POS = I.POS;
  function yr(l) { return l.birthYear + l.age; }
  function lv(l, k) { return L.skill(l, k).level || 0; }
  function looks(l) { return E.LOOKS134 && E.LOOKS134.looks ? E.LOOKS134.looks(l) : 50; }
  function idol(l) { return l.flags.idol155 || null; }
  function st(l) { var s = l.flags.idol987 || (l.flags.idol987 = {}); s.deals = s.deals || []; s.albums = s.albums || []; s.history = s.history || []; return s; }
  function peek(l) { return l.flags.idol987 || {}; }
  function agency(l) { return L.state(l).agency; }
  function group(l) { var s = idol(l), g = s && s.group; return g && !g.disbanded && s.stage === 'debut' ? g : null; }
  function mo(l, v) { return H.money(l, v); }
  function freeNow(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }

  // ===================================================================
  // 1. Chương trình sống còn: đăng ký từ bất kỳ đâu, thí sinh cá nhân hoặc cùng công ty
  // ===================================================================
  var ROUNDS = function (cuts) { return [{ n: 'Đánh giá đầu vào', type: 'grade', d: 'Mỗi thí sinh biểu diễn một mình để được xếp hạng A–F.' }, { n: 'Nhiệm vụ nhóm', type: 'mission', cut: cuts[0], d: 'Chia đội cùng bài hát, phân vị trí; khán giả bình chọn sau mỗi tiết mục.' }, { n: 'Nhiệm vụ vị trí', type: 'mission', cut: cuts[1], d: 'Thi theo vị trí sở trường; vòng loại thứ hai.' }, { n: 'Nhiệm vụ concept', type: 'mission', song: true, cut: cuts[2], d: 'Chọn bài hát mới theo concept; mỗi bài đòi hỏi thế mạnh khác nhau, áp lực bình chọn tăng.' }, { n: 'Chung kết', type: 'mission', d: 'Đêm chung kết công bố đội hình debut.' }]; };
  function role() { return { trainee: { n: 'thí sinh dự thi', once: true, why: function () { return 'Gửi hồ sơ trong mục Chương trình sống còn tuyển thần tượng'; } } }; }
  [['sixteen', 'SIXTEEN', 'KR', 2015, 2015, 16, 'F', 9, [12, 10, 9], 'Thực tập sinh nữ thi đấu để giành suất trong nhóm mới của một công ty lớn.'],
   ['produce101cn', 'Sáng Tạo 101 (Produce 101 China)', 'CN', 2018, 2018, 101, 'F', 11, [60, 35, 20], 'Phiên bản Trung Quốc, 101 thực tập sinh nữ, đội hình debut 11 người.'],
   ['produce101jp', 'Produce 101 Japan', 'JP', 2019, 2023, 101, null, 11, [60, 35, 20], 'Phiên bản Nhật Bản, khán giả bình chọn đội hình debut 11 người.'],
   ['niziproject', 'Nizi Project', 'JP', 2020, 2020, 26, 'F', 9, [20, 14, 11], 'Thí sinh nữ tuyển chọn ở Nhật và Mỹ, huấn luyện tại Hàn Quốc, đội hình debut 9 người.'],
   ['youthwithyou', 'Thanh Xuân Có Bạn (Youth With You)', 'CN', 2020, 2021, 109, null, 9, [60, 33, 20], 'Thực tập sinh thi đấu, khán giả bình chọn đội hình debut 9 người.'],
   ['globalidol987', 'Dự án tuyển chọn thần tượng toàn cầu', 'KR', 2025, null, 80, null, 7, [48, 24, 14], 'Chương trình sống còn mùa mới nhận thí sinh nhiều quốc gia, đội hình debut 7 người.']
  ].forEach(function (x) { if (SH.SHOWS[x[0]]) return; SH.define(x[0], { name: x[1], country: x[2], genre: 'idol', from: x[3], to: x[4], handler: 'survival', field: x[5], sex: x[6] || undefined, debut: x[7], rounds: ROUNDS(x[8]), desc: x[9], roles: role() }); });
  function survivalShows() { return Object.keys(SH.SHOWS).filter(function (id) { return SH.SHOWS[id].handler === 'survival'; }); }
  function onAir(l, sh) { var y = yr(l); return y >= sh.from && (!sh.to || y <= sh.to); }
  function ticket(l, id) { var t = peek(l).ticket; return t && t.id === id && t.year === yr(l) ? t : null; }
  // Có vé sơ tuyển thì chương trình coi như phát sóng nơi bạn (bạn sang nơi ghi hình) và vai thí sinh mở.
  var airing0 = SH.airing; SH.airing = function (l, sh) { if (sh && sh.handler === 'survival' && ticket(l, sh.id) && onAir(l, sh)) return true; return airing0.apply(this, arguments); };
  survivalShows().forEach(function (id) { var R = SH.SHOWS[id].roles.trainee; if (!R) return; var why0 = R.why; R.why = function (l) { var sh = SH.SHOWS[id]; if (ticket(l, id)) return sh.sex && l.sex !== sh.sex ? (sh.sex === 'F' ? 'Chương trình dành cho nữ' : 'Chương trình dành cho nam') : true; return why0 ? why0.apply(this, arguments) : true; }; });
  function applyWhy(l, sh) {
    if (!freeNow(l)) return 'Hiện không thể tham gia';
    if (!onAir(l, sh)) return sh.to && yr(l) > sh.to ? 'Chương trình đã kết thúc' : 'Chương trình chưa ra đời';
    if (sh.sex && l.sex !== sh.sex) return sh.sex === 'F' ? 'Chương trình dành cho nữ' : 'Chương trình dành cho nam';
    if (l.age < 15 || l.age > 25) return 'Dành cho 15–25 tuổi';
    if (group(l)) return 'Đang hoạt động trong một nhóm nhạc';
    if (SH.S(l).active) return 'Đang tham gia một chương trình khác';
    if (SH.S(l).history.some(function (h) { return h.id === sh.id; })) return 'Mỗi người chỉ tham gia một lần';
    var p = peek(l); if (p.applyAt === l.age) return 'Đã gửi hồ sơ một chương trình năm nay';
    return true;
  }
  function prelim(l, sh) {
    var rr = seeded(l.id + ':pre987:' + sh.id + ':' + yr(l)), pot = I.potential(l), a = agency(l), withCo = !!(a && /trainee|junior155/.test(a.status));
    var p = U.clamp(0.08 + Math.max(0, pot - 25) / 70 + (withCo ? 0.15 : 0) - (sh.field <= 30 ? 0.1 : 0), 0.04, 0.9);
    var guardian = true;
    if (l.age < 18) { var fam = l.fam || {}; guardian = !!(fam.mAlive || fam.fAlive) && rr() < U.clamp(0.4 + ((l.st && l.st.kno) || 50) / 250, 0.25, 0.8); }
    return { pass: rr() < p, guardian: guardian, withCo: withCo, pot: Math.round(pot) };
  }
  function apply(l, r, log, id) {
    var sh = SH.SHOWS[id], s = st(l); if (applyWhy(l, sh) !== true) return;
    s.applyAt = l.age; var res = prelim(l, sh);
    if (!res.guardian) { s.note = 'Bố mẹ / người giám hộ chưa đồng ý cho bạn tham gia ' + sh.name + ' khi còn đi học. Có thể thử lại khi đủ 18 tuổi.'; log('Gia đình chưa đồng ý cho bạn dự thi ' + sh.name + '.', 'neutral'); return; }
    if (!res.pass) { s.note = 'Hồ sơ ' + sh.name + ' chưa qua vòng sơ tuyển: ban tuyển chọn đánh giá năng lực biểu diễn (tiềm năng ' + res.pot + '/100) chưa đủ nổi bật. Luyện hát, nhảy rồi thử chương trình khác hoặc mùa sau.'; s.history.push({ age: l.age, show: sh.name, result: 'trượt sơ tuyển' }); log('Không qua vòng sơ tuyển ' + sh.name + '.', 'neutral'); H.fx(l, { hap: -2 }); return; }
    s.ticket = { id: id, year: yr(l), solo: !res.withCo };
    var here = (l.abroad && l.abroad.code) || l.country, away = here !== sh.country;
    log('Qua vòng sơ tuyển ' + sh.name + (res.withCo ? ' cùng công ty quản lý' : ' với tư cách thí sinh cá nhân') + '.' + (away ? ' Bạn sang nơi ghi hình vài tháng; ê-kíp lo visa ngắn hạn và chỗ ở, nơi cư trú của bạn không đổi.' : ''), 'good');
    var a = SH.begin(l, r, log, id, 'trainee', { manual: true });
    if (!a) { delete s.ticket; log('Chưa thể bắt đầu ghi hình ' + sh.name + ' lúc này.', 'neutral'); }
  }
  X.menu('survival987', 'Chương trình sống còn tuyển thần tượng', function (l) { return freeNow(l) && l.age >= 15 ? true : l.age < 15 ? 'Từ 15 tuổi' : 'Hiện không thể tham gia'; },
    function (l) { var s = peek(l); return 'Ngoài audition công ty giải trí, có thể gửi hồ sơ dự thi chương trình sống còn để giành suất debut trong nhóm dự án. Thí sinh cá nhân không cần thuộc công ty; dưới 18 tuổi cần gia đình đồng ý. Vòng sơ tuyển xét giọng hát, vũ đạo, biểu cảm; trong chương trình khán giả bình chọn. Mỗi năm gửi hồ sơ một chương trình.' + (s.note ? '\n' + s.note : ''); },
    function (l) { return survivalShows().filter(function (id) { var sh = SH.SHOWS[id]; return onAir(l, sh) || sh.to && yr(l) - sh.to <= 2; }).map(function (id) { var sh = SH.SHOWS[id]; return { k: id, l: sh.name + ' · ' + (G.W && G.W.BY && G.W.BY[sh.country] ? G.W.BY[sh.country].name : sh.country) + (sh.sex ? ' · ' + (sh.sex === 'F' ? 'nữ' : 'nam') : ''), h: sh.desc, why: applyWhy(l, sh), run: function (l, r, log) { apply(l, r, log, id); } }; }); }, 15, 'Sự nghiệp giải trí');
  E.DEC.survival987.auto = function (l, d) { return 'cancel'; };
  // Thí sinh cá nhân lọt đội hình: có công ty quản lý nhóm dự án; hết hợp đồng nhóm thì tự do ký công ty mới hoặc hoạt động solo.
  function ensureProjectAgency(l) {
    var s = idol(l), g = s && s.group, t = peek(l).ticket; if (!g || !g.project || g.disbanded || agency(l) && /debut/.test(agency(l).status)) return;
    if (g.agency987) return; var sh = t && SH.SHOWS[t.id], name = (sh ? sh.name.split(' (')[0] : 'Nhóm dự án') + ' · công ty quản lý nhóm dự án';
    g.agency987 = name; if (!s.company) s.company = { name: name, rep: 70, split: 0.3 };
    if (!agency(l)) L.state(l).agency = { name: name, code: sh ? sh.country : 'KR', status: 'debut', years: 0, started: l.age, project987: true };
  }

  // ===================================================================
  // 2. Vị trí trong nhóm và độ nổi tiếng cá nhân
  // ===================================================================
  var SPOT = { vocal: 1.3, dance: 1.25, rap: 1.2, center: 1.5, visual: 1.25, leader: 1.15, leadVocal: 1, leadDance: 1, leadRap: 0.95, subVocal: 0.8 };
  var EXTRA = { leader: 'trưởng nhóm', visual: 'visual', center: 'center', face: 'gương mặt đại diện quảng cáo' };
  function memberSkill(l, g, name, k) { return Math.round(35 + (hash(l.id + ':' + g.name + ':' + name + ':' + k) % 55)); }
  function holder(l, g, k) { var best = null; (g.members || []).forEach(function (n) { var v = memberSkill(l, g, n, k); if (!best || v > best.v) best = { n: n, v: v }; }); return best; }
  function popularity(l) { var s = peek(l), fame = l.fame || 0, fs = U.clamp((Math.log10(fame + 1) - 4) * 22, 0, 100); return Math.round(Math.max(s.pop || 0, fs)); }
  function posLabel(l) { var g = group(l); if (!g) return ''; var ex = (g.extra987 || []).map(function (k) { return EXTRA[k]; }).filter(Boolean); return (POS[g.position] || 'thành viên') + (ex.length ? ' · ' + ex.join(', ') : ''); }
  function requestPos(l, r, log, k) {
    var g = group(l), s = st(l); if (!g) return; s.posAt = l.age;
    var mine = I.posFit(l, k) || 0, h = holder(l, g, k), main = /^(vocal|dance|rap|center)$/.test(k), need = h ? h.v + (main ? 4 : -6) : (main ? 58 : 40), rr = seeded(l.id + ':pos987:' + l.age + k);
    if (k === g.position) return;
    if (mine + (rr() - 0.5) * 12 >= need) { var old = g.position; g.position = k; (g.posHist987 || (g.posHist987 = [])).push({ age: l.age, from: old, to: k }); log('Công ty đồng ý đổi vị trí của bạn trong ' + g.name + ' sang ' + POS[k] + (h ? '; ' + h.n + ' chuyển sang vị trí khác' : '') + '.', 'good'); H.fx(l, { hap: 4 }); }
    else { log('Công ty giữ nguyên đội hình: ' + (h ? h.n + ' đang làm ' + POS[k] + ' tốt hơn ở thời điểm này' : 'bạn cần luyện thêm cho vị trí này') + '. Có thể đề nghị lại vào năm sau.', 'neutral'); H.fx(l, { hap: -2 }); }
  }
  function toggleExtra(l, log, k) {
    var g = group(l); if (!g) return; var ex = g.extra987 || (g.extra987 = []), i = ex.indexOf(k);
    if (i >= 0) { ex.splice(i, 1); log('Bạn thôi đảm nhận vai trò ' + EXTRA[k] + ' của nhóm.', 'neutral'); return; }
    var ok = k === 'leader' ? ((l.st && l.st.soc) || 50) >= 55 : k === 'visual' ? looks(l) >= 60 : k === 'center' ? popularity(l) >= 45 : true;
    if (ok) { ex.push(k); log('Bạn được giao thêm vai trò ' + EXTRA[k] + ' của ' + g.name + '.', 'good'); } else log('Công ty chưa giao vai trò ' + EXTRA[k] + ' cho bạn lúc này.', 'neutral');
  }
  X.menu('position987', 'Vị trí trong nhóm nhạc', function (l) { return group(l) ? true : 'Cần đang hoạt động trong một nhóm nhạc'; },
    function (l) { var g = group(l); if (!g) return 'Không còn trong nhóm.'; return g.name + ' · vị trí hiện tại: ' + posLabel(l) + '. Độ nổi tiếng cá nhân ' + popularity(l) + '/100. Hát ' + lv(l, 'sing') + ' · nhảy ' + lv(l, 'dance') + ' · rap ' + lv(l, 'rap') + ' · biểu cảm ' + lv(l, 'acting') + '.\nVị trí chính (main vocal, main dancer, main rapper, center) được nhiều đất diễn hơn nhưng công ty chỉ giao khi bạn làm tốt hơn thành viên đang giữ. Mỗi năm đề nghị đổi vị trí một lần.'; },
    function (l) { var g = group(l), s = peek(l); if (!g) return []; var out = Object.keys(POS).filter(function (k) { return k !== 'visual' && k !== 'leader'; }).map(function (k) { var f = Math.round(I.posFit(l, k) || 0); return { k: 'p_' + k, l: (g.position === k ? '✓ ' : 'Đề nghị đảm nhận ') + POS[k] + ' · phù hợp ' + f + '/100', why: g.position === k ? 'Đang giữ vị trí này' : s.posAt === l.age ? 'Đã đề nghị đổi vị trí năm nay' : true, run: function (l, r, log) { requestPos(l, r, log, k); } }; });
      Object.keys(EXTRA).forEach(function (k) { var on = (g.extra987 || []).indexOf(k) >= 0; out.push({ k: 'x_' + k, l: (on ? 'Thôi vai trò ' : 'Nhận thêm vai trò ') + EXTRA[k], run: function (l, r, log) { toggleExtra(l, log, k); } }); });
      return out; }, 13, 'Sự nghiệp giải trí');
  function spot(l) { var g = group(l); if (!g) return 0; var v = SPOT[g.position] || 1; (g.extra987 || []).forEach(function (k) { v += k === 'center' ? 0.2 : k === 'visual' || k === 'face' ? 0.1 : 0.05; }); return v; }
  function updatePop(l, rr) {
    var s = st(l), g = group(l), old = s.pop || 0;
    if (g) { var fanScore = U.clamp((Math.log10((g.fandom || 0) + 1) - 3) * 22, 0, 100), skill = (I.posFit(l, g.position) || 40); s.pop = Math.round(U.clamp(old * 0.6 + (fanScore * 0.75 + skill * 0.25) * 0.4 * spot(l) + (rr() - 0.5) * 6, 0, 100)); }
    else s.pop = Math.round(Math.max(0, old * 0.85));
    s.popAt = l.age;
  }

  // ===================================================================
  // 3. Quảng cáo, đại diện nhãn hàng
  // ===================================================================
  var CATS = { beauty: 'mỹ phẩm', fashion: 'thời trang', drink: 'đồ uống', phone: 'điện thoại', car: 'ô tô', food: 'ẩm thực', game: 'trò chơi điện tử', bank: 'ngân hàng – ví điện tử', sport: 'đồ thể thao' };
  var BRANDS = { beauty: ['Lumière Cosmetics', 'Hana Skin'], fashion: ['Mode Atelier', 'Urban Nine'], drink: ['Fresh Wave', 'Mây Trà'], phone: ['Nova Mobile', 'Pixelon'], car: ['Velo Motors'], food: ['Bếp Sao', 'Crispy Joy'], game: ['Starfall Online'], bank: ['Sao Việt Pay', 'Bluebank'], sport: ['Stride Sports'] };
  var KINDS = { cf: ['Quay quảng cáo truyền hình (TVC)', 1, 0], ambassador: ['Đại diện thương hiệu', 1.6, 2], pictorial: ['Chụp ảnh tạp chí / lookbook', 0.25, 0], collab: ['Hợp tác dòng sản phẩm', 0.8, 0] };
  function adsEligible(l) { return l.age >= 15 && (group(l) || popularity(l) >= 30 || (l.fame || 0) >= 2e5); }
  function share(l) { var a = agency(l); return a && /debut|trainee/.test(a.status) ? 0.5 : 0.85; }
  function activeDeals(l) { return peek(l).deals ? peek(l).deals.filter(function (d) { return !d.ended && d.until > l.age; }) : []; }
  function makeOffers(l) {
    var s = st(l), rr = seeded(l.id + ':ads987:' + l.age), pop = popularity(l), g = group(l), ex = g && g.extra987 || [], n = pop >= 80 ? 3 : pop >= 55 ? 2 : pop >= 30 ? 1 : rr() < pop / 40 ? 1 : 0;
    if (ex.indexOf('visual') >= 0 || ex.indexOf('face') >= 0 || ex.indexOf('center') >= 0 || looks(l) >= 70) n += rr() < 0.5 ? 1 : 0;
    var taken = activeDeals(l).map(function (d) { return d.cat; }), cats = Object.keys(CATS).filter(function (c) { return taken.indexOf(c) < 0 && !(c === 'car' && l.age < 18) && !(c === 'bank' && l.age < 18); }), out = [];
    for (var i = 0; i < n && cats.length; i++) {
      var ci = Math.floor(rr() * cats.length), cat = cats.splice(ci, 1)[0], kinds = pop >= 50 ? ['ambassador', 'cf', 'collab', 'pictorial'] : ['cf', 'pictorial', 'collab'], kind = kinds[Math.floor(rr() * kinds.length)], B = BRANDS[cat];
      var fee = V(l, 80 * Math.pow(1.045, pop) * KINDS[kind][1] * (0.8 + rr() * 0.4));
      out.push({ id: l.age + ':' + i, cat: cat, brand: B[Math.floor(rr() * B.length)], kind: kind, fee: fee, years: KINDS[kind][2] });
    }
    var m990 = l.flags.idol990 && l.flags.idol990.img; if (m990 && m990.scandal >= 50) out.length = Math.min(out.length, 1);
    s.offers = { at: l.age, list: out };
    return out;
  }
  function acceptOffer(l, r, log, o, haggle) {
    var s = st(l), cur = s.offers; if (!cur || cur.at !== l.age) return; var i = cur.list.indexOf(o); if (i < 0) return;
    if (activeDeals(l).some(function (d) { return d.cat === o.cat; })) { log('Bạn đang là đại diện độc quyền một nhãn hàng ' + CATS[o.cat] + '; không thể nhận thêm nhãn hàng cùng ngành.', 'neutral'); return; }
    cur.list.splice(i, 1);
    var fee = o.fee;
    if (haggle) { if (seeded(l.id + ':haggle987:' + o.id)() < U.clamp(0.35 + popularity(l) / 200, 0.35, 0.8)) { fee *= 1.2; log(o.brand + ' đồng ý tăng 20% cát-xê.', 'good'); } else { log(o.brand + ' không chấp nhận mức cát-xê đề xuất và chuyển sang mời người khác.', 'neutral'); return; } }
    var mine = fee * share(l), label = KINDS[o.kind][0];
    if (o.years) { s.deals.push({ brand: o.brand, cat: o.cat, kind: o.kind, fee: fee, from: l.age, until: l.age + o.years, paidAt: l.age, record0: l.record || 0 }); }
    H.cash(l, mine, (o.years ? 'Cát-xê đại diện ' : 'Cát-xê quảng cáo ') + o.brand);
    l.fame = (l.fame || 0) + Math.round(2e4 + popularity(l) * 2000);
    s.history.push({ age: l.age, kind: o.kind, brand: o.brand });
    log(label + ' cho ' + o.brand + ' (' + CATS[o.cat] + ')' + (o.years ? ', hợp đồng ' + o.years + ' năm, độc quyền ngành hàng' : '') + '. Phần của bạn ' + mo(l, mine) + (share(l) < 0.8 ? ' sau khi chia với công ty quản lý' : ' sau phí quản lý') + '.', 'good');
    if (!s.firstAd) { s.firstAd = l.age; H.mem(l, 'Lần đầu thấy mặt mình trên biển quảng cáo của ' + o.brand + '.', 4); }
  }
  X.menu('ads987', 'Quảng cáo và đại diện nhãn hàng', function (l) { return adsEligible(l) ? true : 'Cần đủ độ nổi tiếng để nhãn hàng tìm đến'; },
    function (l) { var s = peek(l), cur = s.offers && s.offers.at === l.age ? s.offers.list : [], deals = activeDeals(l); return 'Độ nổi tiếng cá nhân ' + popularity(l) + '/100' + (group(l) ? ' · ' + posLabel(l) : '') + '. Lời mời đến theo độ nổi tiếng và hình ảnh; hợp đồng đại diện độc quyền theo ngành hàng, chi trả mỗi năm, nhãn hàng chấm dứt nếu bạn vướng tiền án.' + (deals.length ? '\nĐang đại diện: ' + deals.map(function (d) { return d.brand + ' (' + CATS[d.cat] + ', đến năm ' + (l.birthYear + d.until) + ')'; }).join('; ') + '.' : '') + (cur.length ? '' : '\nNăm nay chưa có lời mời mới.'); },
    function (l) { var s = peek(l), cur = s.offers && s.offers.at === l.age ? s.offers.list : [], out = []; cur.forEach(function (o) { var t = KINDS[o.kind][0] + ' · ' + o.brand + ' (' + CATS[o.cat] + ') · ' + mo(l, o.fee) + (o.years ? '/năm × ' + o.years + ' năm' : ''); out.push({ k: 'a' + o.id, l: 'Nhận: ' + t, run: function (l, r, log) { acceptOffer(l, r, log, o, false); } }); out.push({ k: 'h' + o.id, l: 'Đề nghị tăng cát-xê: ' + o.brand, h: 'Có thể bị từ chối', run: function (l, r, log) { acceptOffer(l, r, log, o, true); } }); }); if (cur.length) out.push({ k: 'none', l: 'Từ chối các lời mời còn lại', run: function (l, r, log) { var s = st(l); if (s.offers) s.offers.list = []; log('Bạn từ chối các lời mời quảng cáo còn lại năm nay để giữ hình ảnh.', 'neutral'); } }); return out; }, 15, 'Sự nghiệp giải trí');
  E.DEC.ads987.auto = function (l, d) { var keys = d.data && d.data.keys || [], i = keys.findIndex(function (k) { return /^a/.test(k); }); return i >= 0 && d.opts.some(function (o) { return o.k === String(i); }) ? String(i) : 'cancel'; };
  function dealsYear(l, log) {
    var s = st(l); s.deals.forEach(function (d) {
      if (d.ended) return;
      var m990 = l.flags.idol990 && l.flags.idol990.img; if (m990 && m990.scandal >= 70) { d.ended = l.age; log(d.brand + ' chấm dứt hợp đồng đại diện vì tai tiếng quanh hình ảnh của bạn.', 'bad'); return; }
      if ((l.record || 0) > d.record0) { d.ended = l.age; log(d.brand + ' chấm dứt hợp đồng đại diện vì hình ảnh của bạn bị ảnh hưởng bởi vụ việc pháp lý.', 'bad'); return; }
      if (l.age >= d.until) { d.ended = l.age; log('Hết hợp đồng đại diện ' + d.brand + '.', 'neutral'); return; }
      if (d.paidAt === l.age) return; d.paidAt = l.age; var mine = d.fee * share(l); H.cash(l, mine, 'Cát-xê đại diện ' + d.brand + ' năm tiếp theo');
    });
  }

  // ===================================================================
  // 4. Album solo
  // ===================================================================
  var TYPES = { single: ['Đĩa đơn (single)', 0.3, 0.6], mini: ['Mini album', 1, 1], full: ['Album phòng thu (full album)', 2.2, 1.5] };
  var CONCEPTS = { ballad: ['ballad giàu cảm xúc', 'sing'], dance: ['dance sôi động', 'dance'], hiphop: ['hip-hop', 'rap'], rnb: ['R&B nhẹ nhàng', 'sing'] };
  var BUDGET = { low: ['tiết kiệm', 150, 0], mid: ['tiêu chuẩn', 600, 0.06], high: ['đầu tư lớn (MV, vũ đạo, quảng bá)', 2000, 0.12] };
  function voice(l) { return Math.max(lv(l, 'sing'), lv(l, 'rap')); }
  function singer(l) { return !!(group(l) || l.job && E.resolveJob && /^(ca_si)$/.test(E.resolveJob(l.job.id))); }
  function soloWhy(l) {
    var s = peek(l); if (!freeNow(l)) return 'Hiện không thể hoạt động';
    if (l.age < 16) return 'Từ 16 tuổi';
    if (s.solo && s.solo.release > l.age) return 'Đang sản xuất album, phát hành năm ' + (l.birthYear + s.solo.release);
    if (s.lastSolo != null && l.age - s.lastSolo < 1) return 'Vừa phát hành, cần thời gian chuẩn bị';
    if (voice(l) < 40) return 'Cần giọng hát hoặc rap từ 40/100';
    var pop = popularity(l); if (pop < 55 && (l.fame || 0) < 1.5e6) return 'Cần tích lũy thêm độ nổi tiếng (hiện ' + pop + '/100, cần 55)';
    if (!singer(l) && pop < 70) return 'Cần đang hoạt động ca hát hoặc rất nổi tiếng';
    return true;
  }
  function plan(l, r, log, type, concept, budget) {
    var s = st(l), g = group(l), a = agency(l), B = BUDGET[budget], T = TYPES[type], costAll = V(l, B[1] * T[1]), byCo = !!(g && a && /debut/.test(a.status));
    if (byCo && popularity(l) < 70 && seeded(l.id + ':soloOK987:' + l.age)() > 0.35 + popularity(l) / 200) { s.lastAsk = l.age; s.lastSolo = l.age; log((a.name || 'Công ty') + ' chưa duyệt album solo năm nay vì lịch quảng bá của nhóm; độ nổi tiếng cá nhân cao hơn sẽ dễ được duyệt.', 'neutral'); return; }
    if (!byCo) { if (l.money < costAll) { log('Chưa đủ tiền sản xuất (' + mo(l, costAll) + ').', 'neutral'); return; } H.cash(l, -costAll, 'Sản xuất ' + T[0].toLowerCase() + ' solo'); }
    s.solo = { type: type, concept: concept, budget: budget, at: l.age, release: l.age + 1, byCo: byCo, cost: costAll };
    log('Bắt đầu sản xuất ' + T[0].toLowerCase() + ' solo concept ' + CONCEPTS[concept][0] + ', ngân sách ' + B[0] + (byCo ? ' (công ty đầu tư, trừ dần vào doanh thu)' : '') + '. Dự kiến phát hành năm ' + (l.birthYear + l.age + 1) + '.', 'good');
  }
  function release(l, log) {
    var s = st(l), x = s.solo; if (!x || x.release > l.age || x.done) return; x.done = true;
    var rr = seeded(l.id + ':solo987:' + x.at), g = group(l), T = TYPES[x.type], C = CONCEPTS[x.concept], B = BUDGET[x.budget], pop = popularity(l);
    var fit = lv(l, C[1]) / 100, q = U.clamp(fit * 0.45 + pop / 100 * 0.35 + B[2] + (rr() - 0.5) * 0.3, 0, 1.2);
    var base = g ? (g.fandom || 0) : (l.fame || 0) / 20, copies = Math.round(base * 0.12 * (pop / 60) * T[2] * (0.5 + q));
    var gross = V(l, copies * 0.3 + q * 400 * T[2]), artist = (x.byCo ? Math.max(0, gross * 0.3 - x.cost * 0.3) : gross * 0.7);
    var chart = q >= 0.85 ? 'hạng 1' : q >= 0.65 ? 'top 10' : q >= 0.45 ? 'top 50' : 'ngoài top 100', wins = q >= 0.85 ? 1 + Math.floor(rr() * 4) : q >= 0.7 ? Math.floor(rr() * 2) : 0;
    if (artist > 0) H.cash(l, artist, 'Doanh thu ' + T[0].toLowerCase() + ' solo');
    var fame0 = l.fame || 0, fans0 = g ? (g.fandom || 0) : fame0;
    l.fame = fame0 + Math.round(copies * 3 + q * 2e5); s.pop = Math.round(U.clamp((s.pop || pop) + (q - 0.45) * 20, 0, 100));
    // 9.9.0: người hâm mộ thay đổi theo chất lượng sản phẩm; trước đây chỉ độ nổi tiếng tăng còn fandom của nhóm đứng yên
    var fanGain = Math.round((q >= 0.45 ? copies * 0.35 + q * 6000 * T[2] : -fans0 * (0.45 - q) * 0.06));
    if (g) g.fandom = Math.max(0, (g.fandom || 0) + fanGain);
    s.lastRelease = { age: l.age, q: q, kind: 'solo', fans: fanGain };
    var title = (x.type === 'full' ? 'Album solo' : x.type === 'mini' ? 'Mini album solo' : 'Đĩa đơn solo') + ' thứ ' + (s.albums.length + 1);
    s.albums.push({ age: l.age, title: title, type: x.type, concept: x.concept, copies: copies, chart: chart, wins: wins }); s.lastSolo = l.age; delete s.solo;
    log(title + ' (' + C[0] + ') phát hành: bảng xếp hạng ' + chart + ', khoảng ' + U.fmtNum(copies) + ' bản/lượt mua quy đổi' + (wins ? ', giành ' + wins + ' cúp chương trình âm nhạc' : '') + '. Người hâm mộ ' + (fanGain >= 0 ? 'tăng ' : 'giảm ') + U.fmtNum(Math.abs(fanGain)) + (g ? ' (fandom ' + U.fmtNum(g.fandom) + ')' : ' (tổng ' + U.fmtNum(Math.round(l.fame)) + ')') + '. Phần của bạn ' + mo(l, Math.max(0, artist)) + '.', q >= 0.65 ? 'big' : 'neutral');
    if (s.albums.length === 1) H.mem(l, 'Ngày phát hành sản phẩm solo đầu tay.', 5);
  }
  X.menu('solo987', 'Phát hành album solo', function (l) { return l.age >= 16 && (singer(l) || popularity(l) >= 30) ? true : 'Dành cho ca sĩ / thần tượng đã có tên tuổi'; },
    function (l, d) { var s = peek(l), arg = d && d.arg || {}; return 'Độ nổi tiếng cá nhân ' + popularity(l) + '/100 · hát ' + lv(l, 'sing') + ' · rap ' + lv(l, 'rap') + ' · nhảy ' + lv(l, 'dance') + '. Cần độ nổi tiếng từ 55 và giọng hát/rap từ 40; thành viên nhóm cần công ty duyệt. Sản xuất trong năm, phát hành năm sau.' + (s.albums && s.albums.length ? '\nĐã phát hành: ' + s.albums.map(function (a) { return a.title + ' (' + a.chart + ')'; }).join('; ') + '.' : '') + (arg.type ? '\nĐã chọn: ' + TYPES[arg.type][0] + (arg.concept ? ' · ' + CONCEPTS[arg.concept][0] : '') : ''); },
    function (l, arg) {
      var why = soloWhy(l);
      if (!arg.type) return Object.keys(TYPES).map(function (k) { return { k: 't' + k, l: TYPES[k][0], why: why, run: function (l, r) { X.next(l, 'solo987', r, { type: k }); } }; });
      if (!arg.concept) return Object.keys(CONCEPTS).map(function (k) { var f = lv(l, CONCEPTS[k][1]); return { k: 'c' + k, l: 'Concept ' + CONCEPTS[k][0] + (f >= 60 ? ' — rất hợp' : f < 35 ? ' — còn yếu' : ''), why: why, run: function (l, r) { X.next(l, 'solo987', r, { type: arg.type, concept: k }); } }; });
      return Object.keys(BUDGET).map(function (k) { var c = V(l, BUDGET[k][1] * TYPES[arg.type][1]); return { k: 'b' + k, l: 'Ngân sách ' + BUDGET[k][0] + ' · ' + mo(l, c), why: why, run: function (l, r, log) { plan(l, r, log, arg.type, arg.concept, k); } }; });
    }, 16, 'Sự nghiệp giải trí');
  E.DEC.solo987.auto = function () { return 'cancel'; };

  // ===================================================================
  // Vòng năm: độ nổi tiếng, lời mời quảng cáo, hợp đồng, phát hành solo, công ty dự án
  // ===================================================================
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive) return; var s = l.flags.idol987;
    ensureProjectAgency(l);
    if (!s && !group(l) && popularity(l) < 30) return;
    s = st(l); if (s.yearAt === l.age) return; s.yearAt = l.age;
    var rr = seeded(l.id + ':idolYear987:' + l.age);
    var g0 = idol(l) && idol(l).group; if (g0 && g0.disbanded && !g0.after987) { g0.after987 = l.age; if (!agency(l) || agency(l).project987) { var A = agency(l); if (A && A.project987) A.status = 'left'; if (idol(l).stage !== 'debut') idol(l).stage = 'left'; log('Sau khi nhóm ' + g0.name + ' kết thúc, bạn trở thành nghệ sĩ tự do: có thể ký công ty mới qua mục Audition, nhận quảng cáo hoặc phát hành sản phẩm solo khi đủ độ nổi tiếng.', 'neutral'); } }
    updatePop(l, rr); dealsYear(l, log); release(l, log);
    if (freeNow(l) && adsEligible(l) && makeOffers(l).length) { log('Có ' + s.offers.list.length + ' lời mời quảng cáo / hợp tác nhãn hàng mới. Xem trong mục Quảng cáo và đại diện nhãn hàng.', 'good'); if (E.DEC.ads987.valid(l)) l.pending.push((function () { var d = E.DEC.ads987.make(l, r, {}); d.manual = false; return d; })()); }
  });
  if (E.profile) { var profile = E.profile; E.profile = function (l) { var p = profile.apply(this, arguments), s = l.flags && l.flags.idol987; if (p && p.jobInfo && s) { if (group(l) && (group(l).extra987 || []).length) p.jobInfo.push('Vai trò trong nhóm: ' + posLabel(l)); var d = activeDeals(l); if (d.length) p.jobInfo.push('Đại diện nhãn hàng: ' + d.map(function (x) { return x.brand; }).join(', ')); if (s.albums && s.albums.length) p.jobInfo.push('Sản phẩm solo: ' + s.albums.length + ' (gần nhất ' + s.albums[s.albums.length - 1].chart + ')'); if (s.solo) p.jobInfo.push('Đang sản xuất sản phẩm solo, phát hành năm ' + (l.birthYear + s.solo.release)); } return p; }; }
  var convert = E.abroadConvert; if (convert) E.abroadConvert = function (l, f) { var out = convert.apply(this, arguments), s = l.flags && l.flags.idol987; if (s) { (s.deals || []).forEach(function (d) { d.fee *= f; }); if (s.offers) s.offers.list.forEach(function (o) { o.fee *= f; }); if (s.solo && s.solo.cost) s.solo.cost *= f; } return out; };
  if (E.addAchievements) E.addAchievements([
    ['sb_survival987', '🎤', 'Từ sân khấu sống còn', 'Debut qua một chương trình sống còn', function (l) { var s = l.flags.idol155; return !!(s && s.group && s.group.project); }],
    ['sb_ads987', '📸', 'Gương mặt quảng cáo', 'Trở thành đại diện thương hiệu', function (l) { var s = l.flags.idol987; return !!(s && (s.deals || []).length); }],
    ['sb_solo987', '💿', 'Bước ra ánh đèn riêng', 'Phát hành sản phẩm solo', function (l) { var s = l.flags.idol987; return !!(s && (s.albums || []).length); }]
  ]);
  E.IDOL987 = { state: st, popularity: popularity, applyWhy: applyWhy, apply: apply, prelim: prelim, requestPos: requestPos, toggleExtra: toggleExtra, makeOffers: makeOffers, acceptOffer: acceptOffer, dealsYear: dealsYear, soloWhy: soloWhy, plan: plan, release: release, updatePop: updatePop, survivalShows: survivalShows, ticket: ticket };
})(globalThis.G);
