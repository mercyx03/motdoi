/* Chủ động chu cấp (912): người chơi làm bên hỗ trợ cho một người trưởng thành, không chỉ chu cấp người yêu hiện tại.
   · Mở rộng hệ chu cấp sẵn có (life80 giveSup, life130 thỏa thuận): không thay thế. Khi hai bên tự nguyện tiến tới tình cảm,
     người được hỗ trợ trở thành người yêu (cùng danh tính); thỏa thuận giữ nguyên điều khoản và lịch chuyển tiền.
   · Ứng viên: vài người trưởng thành theo bộ lọc hẹn hò, hồ sơ (gia cảnh, khó khăn hiện tại, tính cách, ngoại hình, kiến thức,
     nghề/thu nhập, mong muốn, ranh giới) được tạo MỘT LẦN mỗi năm và lưu lại — mở hồ sơ không tạo lại.
   · Đề nghị gồm mức hỗ trợ, kỳ hạn, mục đích, tần suất gặp, độc quyền. Người ấy chấp nhận / thương lượng / từ chối theo mức khớp
     nhu cầu và ranh giới của chính họ; nghèo không đồng nghĩa dễ đồng ý (khó khăn chỉ là nhu cầu, không phải hệ số đồng ý).
   · Không mặc định chu cấp đổi lấy tình dục, kết hôn hay quyền kiểm soát: không có lựa chọn nào như vậy trong đề nghị.
   · Thanh toán mỗi năm đúng một lần (paidAt), kiểm tra tiền và tổng cam kết; thiếu tiền → trễ hạn, trễ hai lần → chấm dứt.
     Dừng khi hết hạn, khi một bên mất, khi một bên chấm dứt. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110;
  var V = 1;
  // Tham số gameplay (không phải số liệu thực tế).
  var BAL = { candidates: 4, maxActive: 3, minAge: 21, partnerAge: 18, reserve: 0.3, missLimit: 2, romanceTrust: 60, discover: { none: 0, monthly: 0.08, weekly: 0.18 } };
  var NEEDS = [
    ['study', 'Học phí đại học / khóa nghề còn thiếu', 'học tập', 0.9],
    ['rent', 'Tiền thuê nhà và sinh hoạt sau khi mất việc', 'sinh hoạt', 0.7],
    ['medical', 'Chi phí điều trị cho người thân', 'y tế', 1.4],
    ['debt', 'Khoản nợ gia đình đến hạn', 'trả nợ', 1.2],
    ['startup', 'Vốn mở một cửa hàng nhỏ', 'khởi nghiệp', 1.6],
    ['art', 'Chi phí theo đuổi nghệ thuật / thể thao', 'năng khiếu', 1.0]];
  var BACKGROUND = ['lớn lên ở nông thôn, gửi tiền về cho bố mẹ', 'gia đình từng khá giả nhưng làm ăn thất bại', 'gia đình bình thường ở thành phố', 'tự lập từ năm 18 tuổi', 'gia đình có điều kiện nhưng muốn tự lo', 'là con cả, đang nuôi em ăn học'];
  var TRAITS = ['tự trọng cao', 'thẳng thắn', 'kín đáo', 'lạc quan', 'cẩn trọng', 'tham vọng', 'ấm áp', 'độc lập'];
  var WISHES = ['tốt nghiệp đúng hạn', 'có công việc ổn định', 'đưa gia đình qua giai đoạn khó', 'mở được cửa hàng riêng', 'có thời gian tập trung luyện tập', 'thoát khỏi khoản nợ'];
  var BOUNDS = [
    ['private', 'Muốn giữ riêng tư, gặp ít', { meetMax: 'monthly' }],
    ['noRomance', 'Không muốn gắn hỗ trợ với chuyện tình cảm', { exclusive: false, romance: false }],
    ['purpose', 'Chỉ nhận hỗ trợ đúng mục đích đã nói', { purpose: true }],
    ['free', 'Không nhận điều kiện độc quyền', { exclusive: false }],
    ['open', 'Cởi mở, sẵn sàng gặp gỡ trò chuyện', {}],
    ['short', 'Chỉ nhận hỗ trợ ngắn hạn, muốn sớm tự lập', { yearsMax: 1 }]];
  var LEVELS = [['half', 'Một phần nhu cầu', 0.5], ['full', 'Đủ nhu cầu', 1], ['plus', 'Rộng rãi hơn nhu cầu', 1.5]];
  var MEET = { none: 'Không gặp, chỉ chuyển tiền', monthly: 'Gặp mỗi tháng một lần', weekly: 'Gặp hằng tuần' };

  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; }
  function rng(seed) { var x = hash(seed) || 1; return function () { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
  function state(l) {
    var s = l.flags.sponsor912;
    if (!s || typeof s !== 'object') s = l.flags.sponsor912 = { v: V, at: null, cands: [], deals: [], serial: 0 };
    if (!Array.isArray(s.cands)) s.cands = []; if (!Array.isArray(s.deals)) s.deals = [];
    s.v = V; return s;
  }
  function free(l) { return !!(l && l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military)); }
  function active(l) { return state(l).deals.filter(function (d) { return d.status === 'active' || d.status === 'late'; }); }
  function committed(l, except) { return active(l).filter(function (d) { return d !== except; }).reduce(function (n, d) { return n + d.monthly * 12; }, 0); }
  function reason(l) {
    if (!free(l)) return 'Cần được tự do đi lại';
    if (l.age < BAL.minAge) return 'Từ ' + BAL.minAge + ' tuổi';
    if (!l.indep) return 'Cần tự lập tài chính';
    if (active(l).length >= BAL.maxActive) return 'Đang hỗ trợ ' + BAL.maxActive + ' người — kết thúc bớt trước khi nhận thêm';
    if (l.money < l.base * 0.5) return 'Cần có khoản tiền dư cho ít nhất một năm hỗ trợ';
    return true;
  }
  function manageReason(l) { return state(l).deals.length ? true : 'Chưa có thỏa thuận hỗ trợ nào'; }

  // ---- Ứng viên: tạo một lần mỗi năm, theo bộ lọc hẹn hò; hồ sơ lưu lại ----
  function prefSex(l, r) { var f = l.flags.dating108 || {}; return f.sex === 'M' || f.sex === 'F' ? f.sex : f.sex === 'any' ? (r() < 0.5 ? 'M' : 'F') : H.partnerSex(l, r); }
  function ageRange(l) { var f = l.flags.dating108 || {}; var lo = Math.max(BAL.partnerAge, f.lo || BAL.partnerAge), hi = Math.max(lo, Math.min(f.hi || l.age + 5, 70)); return [lo, hi]; }
  function makeCand(l, i) {
    var s = state(l), r = rng(l.id + ':sponsor912:' + l.age + ':' + i), sex = prefSex(l, r), ar = ageRange(l), age = ar[0] + Math.floor(r() * (ar[1] - ar[0] + 1));
    var need = NEEDS[Math.floor(r() * NEEDS.length)], b = BOUNDS[Math.floor(r() * BOUNDS.length)];
    var p = { id: 'sp' + (++s.serial) + ':' + l.age, name: H.stranger(l, r, sex), sex: sex, age: age, city: l.movedTo || l.city || l.place || '', since: l.age,
      background: BACKGROUND[Math.floor(r() * BACKGROUND.length)], need: need[0], needText: need[1], purpose: need[2],
      monthlyNeed: Math.round(l.base / 12 * need[3] * (0.6 + r() * 0.8) * 100) / 100,
      traits: [TRAITS[Math.floor(r() * TRAITS.length)], TRAITS[Math.floor(r() * TRAITS.length)]].filter(function (x, j, a) { return a.indexOf(x) === j; }),
      looks: Math.round(35 + r() * 60), knowledge: Math.round(30 + r() * 65), wish: WISHES[Math.floor(r() * WISHES.length)], bound: b[0],
      // Độc lập / tự trọng làm giảm mức sẵn lòng nhận hỗ trợ, độc lập với hoàn cảnh giàu nghèo.
      pride: Math.round(r() * 100) / 100, openness: Math.round(r() * 100) / 100, trust: 30, history: [], agedAt: l.age };
    H.partnerJob(l, p, r);
    return p;
  }
  function candidates(l) {
    var s = state(l);
    if (s.at !== l.age) { s.at = l.age; s.cands = []; for (var i = 0; i < BAL.candidates; i++) s.cands.push(makeCand(l, i)); }
    return s.cands;
  }
  function cand(l, id) { return candidates(l).find(function (p) { return p.id === id; }) || state(l).deals.map(function (d) { return d.person; }).find(function (p) { return p.id === id; }); }
  function profile(l, p) {
    var B = BOUNDS.find(function (x) { return x[0] === p.bound; });
    return p.name + ' · ' + p.age + ' tuổi · ' + (p.sex === 'M' ? 'nam' : 'nữ') + ' · ' + (p.job || 'chưa có việc') + (p.inc ? ' · thu nhập khoảng ' + H.money(l, p.inc) + '/tháng' : '') + (p.city ? ' · sống ở ' + p.city : '') + '.\n' +
      'Gia cảnh: ' + p.background + '. Khó khăn hiện tại: ' + p.needText.toLowerCase() + ' — cần khoảng ' + H.money(l, p.monthlyNeed) + '/tháng.\n' +
      'Tính cách: ' + p.traits.join(', ') + '. Ngoại hình ' + p.looks + '/100 · kiến thức ' + p.knowledge + '/100. Mong muốn: ' + p.wish + '. Ranh giới: ' + (B ? B[1].toLowerCase() : 'chưa nói') + '.';
  }

  // ---- Mức đồng ý với một đề nghị ----
  function evaluate(l, p, o) {
    var B = (BOUNDS.find(function (x) { return x[0] === p.bound; }) || [0, 0, {}])[2], score = 0.55, notes = [], counter = {};
    var ratio = o.monthly / Math.max(1e-9, p.monthlyNeed);
    if (ratio < 0.6) { score -= 0.15; notes.push('mức hỗ trợ chưa đủ giải quyết khó khăn'); }
    if (ratio > 1.3) { score -= 0.1 * p.pride; notes.push('khoản quá rộng rãi khiến người ấy ngại'); }
    score -= 0.25 * p.pride;
    if (o.purpose === 'need') score += 0.12; else if (B.purpose) { score -= 0.3; notes.push('chỉ nhận hỗ trợ đúng mục đích đã nói'); counter.purpose = 'need'; }
    if (o.exclusive && B.exclusive === false) { score -= 0.35; notes.push('không nhận điều kiện độc quyền'); counter.exclusive = false; }
    else if (o.exclusive) score -= 0.15;
    if (B.meetMax === 'monthly' && o.meet === 'weekly') { score -= 0.3; notes.push('muốn gặp ít hơn'); counter.meet = 'monthly'; }
    if (B.yearsMax && o.years > B.yearsMax) { score -= 0.2; notes.push('chỉ muốn hỗ trợ ngắn hạn'); counter.years = B.yearsMax; }
    if ((l.karma || 0) < -20) { score -= 0.1; notes.push('nghe vài lời không hay về bạn'); }
    if (p.history.some(function (h) { return h.result === 'declined'; })) score -= 0.05;
    score = U.clamp(score, 0.05, 0.92);
    return { score: score, notes: notes, counter: Object.keys(counter).length ? counter : null };
  }
  function draftText(l, p, o) { return 'Mức ' + H.money(l, o.monthly) + '/tháng (' + H.money(l, o.monthly * 12) + '/năm) · ' + o.years + ' năm · mục đích: ' + (o.purpose === 'need' ? p.purpose : 'tự do sử dụng') + ' · ' + MEET[o.meet] + ' · ' + (o.exclusive ? 'có yêu cầu độc quyền' : 'không yêu cầu độc quyền'); }
  function affordable(l, o) { return l.money >= o.monthly * 12 + committed(l) + l.base * BAL.reserve; }
  function defaults(p) { return { level: 'full', monthly: p.monthlyNeed, years: 1, purpose: 'need', meet: 'none', exclusive: false }; }
  function normalize(p, a) { var o = Object.assign(defaults(p), a && a.offer || {}); var L = LEVELS.find(function (x) { return x[0] === o.level; }) || LEVELS[1]; o.monthly = Math.round(p.monthlyNeed * L[2] * 100) / 100; return o; }

  // ---- Menu ----
  X.menu('sponsor912', 'Chủ động hỗ trợ một người trưởng thành', reason,
    function (l) { return 'Những người dưới đây được gặp qua bạn bè và hoạt động xã hội, phù hợp độ tuổi và giới tính trong bộ lọc hẹn hò. Hỗ trợ là khoản tiền cá nhân, không đổi lấy tình cảm, quan hệ thân mật hay quyền kiểm soát; người ấy có thể từ chối hoặc thương lượng. Danh sách đổi mỗi năm. Đang hỗ trợ ' + active(l).length + '/' + BAL.maxActive + ' người, cam kết ' + H.money(l, committed(l)) + '/năm.'; },
    function (l) {
      var busy = active(l).map(function (d) { return d.person.id; });
      return candidates(l).map(function (p) { var done = p.history.some(function (h) { return h.at === l.age; });
        return { k: p.id, l: p.name + ' · ' + p.age + ' tuổi · ' + p.needText, h: busy.indexOf(p.id) >= 0 ? 'Đang được bạn hỗ trợ' : done ? 'Đã trao đổi năm nay' : 'Cần khoảng ' + H.money(l, p.monthlyNeed) + '/tháng',
          why: busy.indexOf(p.id) >= 0 ? 'Đang được bạn hỗ trợ' : done ? 'Đã trao đổi với người này năm nay' : true,
          run: function (l, r) { X.next(l, 'sponsorOffer912', r, { id: p.id }); } }; });
    }, 21, 'Tình cảm');
  X.menu('sponsorOffer912', 'Hồ sơ và đề nghị hỗ trợ', reason,
    function (l, d) { var a = d && d.arg || {}, p = cand(l, a.id); if (!p) return 'Người này không còn trong danh sách.'; var o = normalize(p, a); return profile(l, p) + '\n\nĐề nghị đang soạn: ' + draftText(l, p, o) + '.' + (affordable(l, o) ? '' : ' Chưa đủ tiền: cần ' + H.money(l, o.monthly * 12 + committed(l) + l.base * BAL.reserve) + ' gồm cam kết khác và quỹ dự phòng.'); },
    function (l, a) {
      var p = cand(l, a.id); if (!p) return [];
      var o = normalize(p, a), out = [];
      function set(ch) { return function (l, r) { X.next(l, 'sponsorOffer912', r, { id: p.id, offer: Object.assign({}, o, ch) }); }; }
      LEVELS.forEach(function (x) { out.push({ k: 'lv:' + x[0], l: (o.level === x[0] ? '✓ ' : '') + x[1] + ' · ' + H.money(l, Math.round(p.monthlyNeed * x[2] * 100) / 100) + '/tháng', run: set({ level: x[0] }) }); });
      [1, 2, 3].forEach(function (y) { out.push({ k: 'y:' + y, l: (o.years === y ? '✓ ' : '') + 'Kỳ hạn ' + y + ' năm', run: set({ years: y }) }); });
      out.push({ k: 'pu', l: 'Mục đích: ' + (o.purpose === 'need' ? p.purpose + ' (theo khó khăn của người ấy)' : 'tự do sử dụng') + ' (bấm để đổi)', run: set({ purpose: o.purpose === 'need' ? 'free' : 'need' }) });
      out.push({ k: 'me', l: 'Gặp gỡ: ' + MEET[o.meet] + ' (bấm để đổi)', run: set({ meet: o.meet === 'none' ? 'monthly' : o.meet === 'monthly' ? 'weekly' : 'none' }) });
      if (l.age >= BAL.partnerAge && p.age >= BAL.partnerAge) out.push({ k: 'ex', l: 'Độc quyền: ' + (o.exclusive ? 'có — đề nghị không có quan hệ tình cảm khác' : 'không') + ' (bấm để đổi)', run: set({ exclusive: !o.exclusive }) });
      out.push({ k: 'send', l: 'Gửi đề nghị', h: affordable(l, o) ? 'Người ấy có thể đồng ý, thương lượng hoặc từ chối' : 'Chưa đủ tiền cho năm đầu và các cam kết khác', why: affordable(l, o) ? true : 'Chưa đủ tiền cho năm đầu, cam kết khác và quỹ dự phòng',
        run: function (l, r, log) { send(l, r, log, p, o); } });
      return out;
    }, 21);
  function send(l, r, log, p, o) {
    if (reason(l) !== true || !affordable(l, o) || active(l).some(function (d) { return d.person.id === p.id; }) || p.history.some(function (h) { return h.at === l.age && h.result !== 'countered'; })) return;
    var ev = evaluate(l, p, o), x = r();
    if (x < ev.score) { p.history.push({ at: l.age, result: 'accepted' }); start(l, log, p, o); return; }
    if (ev.counter && x < ev.score + 0.3) { p.history.push({ at: l.age, result: 'countered' }); var c = Object.assign({}, o, ev.counter); X.next(l, 'sponsorCounter912', r, { id: p.id, offer: c, why: ev.notes.join('; ') }); return; }
    p.history.push({ at: l.age, result: 'declined' });
    log(p.name + ' cảm ơn nhưng từ chối' + (ev.notes.length ? ' — ' + ev.notes[0] : ' — muốn tự xoay xở') + '. Không có khoản tiền nào được chuyển.', 'neutral');
  }
  X.menu('sponsorCounter912', 'Người ấy đề nghị lại', reason,
    function (l, d) { var a = d && d.arg || {}, p = cand(l, a.id); return p ? p.name + ' muốn điều chỉnh vì ' + (a.why || 'hoàn cảnh riêng') + '. Đề nghị lại: ' + draftText(l, p, a.offer) + '.' : 'Người này không còn trong danh sách.'; },
    function (l, a) { var p = cand(l, a.id); if (!p) return [];
      return [{ k: 'ok', l: 'Đồng ý điều kiện mới', why: affordable(l, a.offer) ? true : 'Chưa đủ tiền', run: function (l, r, log) { if (reason(l) !== true || !affordable(l, a.offer) || active(l).some(function (d) { return d.person.id === p.id; })) return; p.history.push({ at: l.age, result: 'accepted' }); start(l, log, p, a.offer); } },
        { k: 'no', l: 'Không đồng ý, dừng trao đổi', run: function (l, r, log) { p.history.push({ at: l.age, result: 'declined' }); log('Bạn và ' + p.name + ' không đi đến thỏa thuận. Hai người vẫn giữ thái độ tôn trọng.', 'neutral'); } }]; }, 21);
  function start(l, log, p, o) {
    var s = state(l), d = { id: l.id + ':deal912:' + (++s.serial), person: p, monthly: o.monthly, years: o.years, since: l.age, until: l.age + o.years, purpose: o.purpose === 'need' ? p.purpose : 'tự do sử dụng', meet: o.meet, exclusive: !!o.exclusive, status: 'active', paidAt: null, missed: 0, paid: 0 };
    s.cands = s.cands.filter(function (x) { return x !== p; });
    s.deals.push(d); pay(l, d, log, true);
    log('Bạn và ' + p.name + ' thống nhất hỗ trợ ' + H.money(l, d.monthly) + '/tháng trong ' + d.years + ' năm cho ' + d.purpose + '. Mọi điều khoản có thể bàn lại; khoản hỗ trợ không kèm nghĩa vụ tình cảm.', 'good');
  }
  // Thanh toán một lần mỗi năm; người nhận ghi lại số đã nhận.
  function pay(l, d, log, first) {
    if (d.paidAt === l.age || (d.status !== 'active' && d.status !== 'late')) return false;
    var y = d.monthly * 12;
    if (l.money < y) { d.missed++; d.status = d.missed >= BAL.missLimit ? 'ended' : 'late'; d.person.trust = Math.max(0, d.person.trust - 15);
      if (d.status === 'ended') { d.endedAt = l.age; d.endWhy = 'thiếu tiền'; log('Bạn không thể tiếp tục hỗ trợ ' + d.person.name + ' vì thiếu tiền hai năm liền. Thỏa thuận chấm dứt.', 'bad'); }
      else log('Năm nay bạn chưa đủ tiền chuyển khoản hỗ trợ cho ' + d.person.name + '. Người ấy lo lắng; nếu năm sau vẫn thiếu, thỏa thuận sẽ chấm dứt.', 'neutral');
      d.paidAt = l.age; return false; }
    H.cash(l, -y, 'Hỗ trợ ' + d.person.name + ' (' + d.purpose + ')'); d.paidAt = l.age; d.paid += y; d.status = 'active'; d.missed = 0;
    d.person.received912 = (d.person.received912 || 0) + y; d.person.trust = Math.min(100, d.person.trust + (first ? 5 : 8));
    return true;
  }
  function end(l, d, why, log, msg) { d.status = 'ended'; d.endedAt = l.age; d.endWhy = why; if (msg) log(msg, 'neutral'); }
  X.menu('sponsorManage912', 'Các thỏa thuận hỗ trợ của bạn', manageReason,
    function (l) { var s = state(l); return s.deals.slice(-8).map(function (d) { return d.person.name + ': ' + H.money(l, d.monthly) + '/tháng · ' + d.purpose + ' · ' + ({ active: 'đang hỗ trợ', late: 'trễ một kỳ', ended: 'đã kết thúc (' + (d.endWhy || '') + ')' })[d.status] + (d.partner ? ' · nay là người yêu' : '') + ' · đã chuyển ' + H.money(l, d.paid) + (d.status === 'active' || d.status === 'late' ? ' · tới năm ' + (l.birthYear + d.until) : ''); }).join('\n') || 'Chưa có thỏa thuận.'; },
    function (l) {
      var out = [];
      active(l).forEach(function (d) {
        out.push({ k: 'up:' + d.id, l: 'Tăng mức hỗ trợ ' + d.person.name + ' thêm 30% từ năm sau', run: function (l, r, log) { if (active(l).indexOf(d) < 0) return; d.monthly = Math.round(d.monthly * 1.3 * 100) / 100; log('Bạn báo với ' + d.person.name + ' khoản hỗ trợ tăng lên ' + H.money(l, d.monthly) + '/tháng từ kỳ sau.', 'neutral'); } });
        out.push({ k: 'down:' + d.id, l: 'Giảm mức hỗ trợ ' + d.person.name + ' 30% từ năm sau', run: function (l, r, log) { if (active(l).indexOf(d) < 0) return; d.monthly = Math.round(d.monthly * 0.7 * 100) / 100; d.person.trust = Math.max(0, d.person.trust - 8); if (r() < 0.25 + d.person.pride * 0.2) end(l, d, 'người nhận dừng', log, d.person.name + ' cảm ơn và nói sẽ tự xoay xở; thỏa thuận dừng lại.'); else log(d.person.name + ' hiểu và đồng ý mức mới.', 'neutral'); } });
        out.push({ k: 'end:' + d.id, l: 'Kết thúc hỗ trợ ' + d.person.name, run: function (l, r, log) { if (active(l).indexOf(d) < 0) return; end(l, d, 'bạn dừng', log, 'Bạn nói rõ với ' + d.person.name + ' và dừng khoản hỗ trợ. Số tiền đã chuyển không đòi lại.'); } });
      });
      return out;
    }, 21, 'Tình cảm');

  // ---- Diễn biến mỗi năm ----
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !l.flags.sponsor912) return;
    var s = state(l);
    s.deals.forEach(function (d) {
      if (d.status !== 'active' && d.status !== 'late') return;
      if (d.yearAt === l.age) return; d.yearAt = l.age;
      var p = d.person; if (p.agedAt == null) p.agedAt = d.since; p.age = (p.age || 0) + Math.max(0, l.age - p.agedAt); p.agedAt = l.age;
      if (p.alive === false || r() < 0.002 * Math.max(1, p.age - 40)) { p.alive = false; end(l, d, 'người nhận qua đời', log, p.name + ' qua đời. Thỏa thuận hỗ trợ khép lại; bạn đến viếng và gửi lời chia buồn tới gia đình.'); return; }
      if (l.age >= d.until) { end(l, d, 'hết hạn', log, 'Thỏa thuận hỗ trợ ' + p.name + ' kết thúc đúng hạn. ' + (p.trust >= 60 ? p.name + ' gửi lời cảm ơn và kể về ' + p.wish + '.' : 'Hai người chúc nhau may mắn.')); return; }
      if (!free(l)) { d.missed++; if (d.missed >= BAL.missLimit) end(l, d, 'không thể chuyển tiền', log, 'Bạn không thể chuyển tiền cho ' + p.name + ' trong thời gian dài; thỏa thuận chấm dứt.'); return; }
      pay(l, d, log, false);
      if (d.status !== 'active') return;
      // Ranh giới bị dồn ép thì người nhận có thể rút lui.
      var B = (BOUNDS.find(function (x) { return x[0] === p.bound; }) || [0, 0, {}])[2];
      if ((B.meetMax === 'monthly' && d.meet === 'weekly') || (B.exclusive === false && d.exclusive)) { if (r() < 0.3) { end(l, d, 'người nhận dừng', log, p.name + ' thấy điều kiện đi quá ranh giới của mình và xin dừng thỏa thuận.'); return; } }
      // Người yêu / bạn đời hiện tại có thể biết chuyện gặp gỡ thường xuyên.
      var mate = l.partner && l.partner.alive !== false ? l.partner : null;
      if (mate && r() < BAL.discover[d.meet]) { mate.close = U.clamp((mate.close || 60) - (d.exclusive ? 18 : 10), 0, 100); log(mate.name + ' biết bạn thường xuyên gặp và hỗ trợ ' + p.name + '. ' + (d.exclusive ? 'Điều kiện độc quyền khiến chuyện trở nên nghiêm trọng.' : 'Bạn phải giải thích rõ đây là khoản hỗ trợ.') + ' Tình cảm hai người bị ảnh hưởng.', 'bad'); }
      if (d.meet !== 'none') p.trust = Math.min(100, p.trust + (d.meet === 'weekly' ? 6 : 3));
      // Có thể phát triển thành tình cảm nếu cả hai tự nguyện.
      if (!l.partner && d.meet !== 'none' && p.trust >= BAL.romanceTrust && p.openness >= 0.5 && p.bound !== 'noRomance' && l.age - d.since >= 1 && !d.romanceAsked && p.age >= BAL.partnerAge && l.age >= BAL.partnerAge) {
        d.romanceAsked = l.age; X.next(l, 'sponsorRomance912', r, { deal: d.id }, { manual: false });
      }
    });
  });
  E.SC('sponsorRomance912', {
    title: 'Tình cảm nảy sinh',
    prep: function (l, r, a) { return { at: l.age, done: false, deal: a && a.deal }; },
    valid: function (l, d) { var x = d && d.deal && state(l).deals.find(function (y) { return y.id === d.deal; }); return !!(x && x.status === 'active' && !x.partner && !l.partner && free(l) && (d.at == null || d.at === l.age && !d.done)); },
    text: function (l, d) { var x = state(l).deals.find(function (y) { return y.id === d.deal; }); return x ? 'Sau nhiều lần gặp gỡ, ' + x.person.name + ' nói thật rằng mình có cảm tình với bạn — không phải vì khoản hỗ trợ. Người ấy muốn tìm hiểu như hai người bình đẳng, nếu bạn cũng muốn.' : ''; },
    opts: [{ k: 'yes', l: 'Cùng tìm hiểu nghiêm túc', ai: { w: 0.6 }, run: function (l, r, log, d) {
      if (!E.DEC.sponsorRomance912.valid(l, d)) return; d.done = true; var x = state(l).deals.find(function (y) { return y.id === d.deal; }), p = x.person;
      l.partner = { name: p.name, sex: p.sex, age: p.age, status: 'dating', since: l.age, alive: true, job: p.job, jobId: p.jobId, inc: p.inc, sponsor912: p.id };
      l.flags.everDated = true; x.partner = true;
      // Thỏa thuận tiếp tục đúng điều khoản, kỳ hạn và lịch chuyển tiền đã có (không trả hai lần, không tự đổi thành ràng buộc mới).
      log('Bạn và ' + p.name + ' bắt đầu hẹn hò. Khoản hỗ trợ giữ nguyên điều khoản đã thống nhất và có thể bàn lại hoặc dừng bất cứ lúc nào.', 'good');
    } }, { k: 'no', l: 'Giữ quan hệ như hiện tại', ai: { w: 1 }, run: function (l, r, log, d) { if (d) d.done = true; var x = state(l).deals.find(function (y) { return y.id === d.deal; }); if (x) { x.person.trust = Math.max(0, x.person.trust - 5); log('Bạn nhẹ nhàng nói muốn giữ mối quan hệ hỗ trợ như hiện tại. ' + x.person.name + ' tôn trọng quyết định đó.', 'neutral'); } } }]
  });

  var migrate = E.migrateExt;
  E.migrateExt = function (l) { if (migrate) migrate(l); if (l && l.flags && l.flags.sponsor912 != null) { if (typeof l.flags.sponsor912 !== 'object') delete l.flags.sponsor912; else state(l); } };
  E.SPONSOR912 = { BAL: BAL, state: state, candidates: candidates, evaluate: evaluate, active: active, committed: committed, pay: pay, reason: reason, normalize: normalize };
})(globalThis.G);
