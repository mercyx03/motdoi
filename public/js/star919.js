/* Một Đời — Diễn viên vươn ra quốc tế (8.10.23). Mở rộng sự nghiệp diễn xuất của life154 (ACTOR154: dự án, đề cử, giải thưởng).
   · Giải thưởng trong nước theo nơi đang sống (tên các giải có thật, kết quả trong game là hư cấu) và vòng liên hoan phim quốc tế
     (Cannes, Berlin, Venice, Busan, Toronto, Sundance, Asian Film Awards, Oscar). Được chọn/đoạt giải dựa trên chất lượng phim,
     vai diễn và độ nổi tiếng quốc tế; Oscar cho diễn xuất rất hiếm.
   · Đạo diễn nổi tiếng (nhân vật HƯ CẤU, không phải người thật) mời đóng thẳng, không qua casting, khi bạn đã có vai chính/giải
     thưởng/danh tiếng; đạo diễn quốc tế mời khi đã có độ nổi tiếng quốc tế. Dự án đi qua đúng luồng hợp đồng, quay, phát hành của life154.
   · Phim quốc tế cần thị thực/giấy phép biểu diễn (miễn thị thực du lịch không cho làm việc có thù lao).
   · Nổi tiếng quốc tế (0–100) tăng nhờ liên hoan phim, giải thưởng, dự án nước ngoài; giảm dần khi không có tác phẩm mới. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, W = G.W, N = G.NAMES, A = E.ACTOR154;
  if (!X || !A) return;
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; return h >>> 0; }
  function rnd(seed) { var x = hash(seed) || 1; return function () { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; return x / 4294967296; }; }
  function u(seed) { return hash(seed) / 4294967296; }
  function mo(l, v) { return H.money(l, v); }
  function res(l) { return H.resCode(l); }
  function yr(l) { return l.birthYear + l.age; }
  function cname(c) { return W.BY[c] ? W.BY[c].name : c; }
  function st(l) { var s = l.flags.star919; if (!s || typeof s !== 'object') s = l.flags.star919 = { intl: 0, fests: [], offers: [], markets: {} }; ['fests', 'offers'].forEach(function (k) { if (!Array.isArray(s[k])) s[k] = []; }); if (!s.markets) s.markets = {}; return s; }
  function isActor(l) { return !!(l.job && l.job.id === 'dien_vien'); }
  function act(l) { return l.actSk == null ? 22 : l.actSk; }
  var DOM = { VN: ['Giải Cánh Diều', 'Liên hoan phim Việt Nam (Bông Sen)', 'Giải Mai Vàng', 'Giải Ngôi Sao Xanh'], KR: ['Baeksang Arts Awards', 'Blue Dragon Film Awards', 'Grand Bell Awards'], JP: ['Japan Academy Film Prize', 'Blue Ribbon Awards'], CN: ['Giải Kim Kê (Golden Rooster)', 'Giải Bách Hoa (Hundred Flowers)'], TW: ['Giải Kim Mã (Golden Horse)'], HK: ['Hong Kong Film Awards'], TH: ['Suphannahong National Film Awards'], IN: ['Filmfare Awards', 'National Film Awards'], US: ['Golden Globe Awards', 'Screen Actors Guild Awards'], GB: ['BAFTA Film Awards'], FR: ['César'], DE: ['Deutscher Filmpreis'], ES: ['Premios Goya'], IT: ['David di Donatello'], AU: ['AACTA Awards'], CA: ['Canadian Screen Awards'] };
  function domestic(l) { return DOM[res(l)] || ['Giải thưởng điện ảnh quốc gia', 'Giải thưởng của Hội phê bình']; }
  var FEST = [['Liên hoan phim Cannes', 'Giải Nam/Nữ diễn viên xuất sắc', 0.92], ['Liên hoan phim Berlin', 'Gấu Bạc cho diễn xuất', 0.9], ['Liên hoan phim Venice', 'Cúp Volpi', 0.9], ['Liên hoan phim Busan', 'Giải diễn xuất', 0.82], ['Liên hoan phim Toronto', 'Giải khán giả', 0.82], ['Sundance', 'Giải đặc biệt cho diễn xuất', 0.8], ['Asian Film Awards', 'Nam/Nữ diễn viên chính xuất sắc', 0.84]];
  // Đạo diễn nổi tiếng hư cấu: tên sinh ổn định theo nước, uy tín và phong cách riêng.
  var POOLS = { US: 'en', GB: 'en', FR: 'fr', KR: 'kr', JP: 'jp', CN: 'cn', ES: 'es', IT: 'it', DE: 'de', IN: 'in', VN: 'vn' };
  var STYLE = ['tâm lý chậm rãi', 'hành động quy mô lớn', 'chính kịch xã hội', 'hài đen', 'nghệ thuật, thích ứng biến', 'cổ trang công phu'];
  function directors(cc, n) { var r = rnd('dir919:' + cc), out = []; for (var i = 0; i < n; i++) { var pool = POOLS[cc] || String((W.BY[cc] || {}).pool || 'en').split(',')[0].split(':')[0], nm = pool === 'vn' && G.VN ? G.VN.vnName(r, 'kinh', r() < 0.7 ? 'M' : 'F').full : N.worldName(r, pool, r() < 0.7 ? 'M' : 'F').full; out.push({ id: cc + ':' + i, name: nm, cc: cc, rep: Math.round(75 + r() * 23), style: STYLE[Math.floor(r() * STYLE.length)], fictional: true }); } return out; }
  var INTL = ['US', 'KR', 'FR', 'JP', 'GB', 'CN', 'ES', 'IT'];
  function eligible(l) { var s = A.S(l), won = s.awards.filter(function (a) { return a.won; }).length, t = A.tier(l); return { t: t, won: won, dom: t >= 3 || won >= 1 || (l.fame || 0) >= 5e5 && act(l) >= 60, intl: st(l).intl >= 25 }; }
  function offersYear(l) {
    var s = st(l); s.offers = s.offers.filter(function (o) { return o.until >= l.age && o.status === 'open'; }); if (!isActor(l) || s.offerAt === l.age) return; s.offerAt = l.age;
    var e = eligible(l), x = u(l.id + ':dof:' + l.age), px = e.t >= 4 ? 0.5 : e.t >= 3 ? 0.35 : e.won ? 0.25 : e.dom ? 0.15 : 0;
    if (e.dom && x < px) { var ds = directors(res(l), 6), d = ds[Math.floor(u(l.id + ':dd:' + l.age) * ds.length)]; s.offers.push({ id: 'o' + l.age + 'd', dir: d, cc: res(l), scale: d.rep >= 90 ? 'block' : 'cinema', until: l.age + 1, status: 'open' }); }
    if (e.intl && u(l.id + ':dof2:' + l.age) < Math.min(0.45, s.intl / 150)) { var cc = INTL.filter(function (c) { return c !== res(l) && W.BY[c]; })[Math.floor(u(l.id + ':dc:' + l.age) * 7)], d2 = directors(cc, 5)[Math.floor(u(l.id + ':dd2:' + l.age) * 5)]; s.offers.push({ id: 'o' + l.age + 'i', dir: d2, cc: cc, intl: true, scale: 'cinema', until: l.age + 1, status: 'open' }); }
  }
  function acceptWhy(l, o) { var P = A.S(l).project; if (P && P.stage !== 'done' && P.stage !== 'post') return 'Đang có dự án phim'; if (o.intl && E.TRAVEL918 && E.TRAVEL918.passport && l.country === 'VN' && !E.TRAVEL918.passport(l)) return 'Cần hộ chiếu còn hạn'; return true; }
  function accept(l, o, r, log) {
    if (acceptWhy(l, o) !== true) return; o.status = 'accepted';
    if (o.intl) { var need = E.GLOBAL919 ? E.GLOBAL919.entry(l.country, o.cc).kind : 'visa'; if (need !== 'right') { H.cash(l, -l.base * 0.03, 'Thị thực/giấy phép biểu diễn ' + cname(o.cc)); if (r() > 0.88) { o.status = 'visa-denied'; log('Giấy phép làm việc cho nghệ sĩ tại ' + cname(o.cc) + ' chưa được cấp kịp; đoàn phim chọn diễn viên khác.', 'neutral'); return; } } }
    var p = A.startProject(l, r, log, o.scale); if (!p) { o.status = 'open'; return; }
    l.pending = l.pending.filter(function (d) { return !(d.id === 'film154' && d.data && d.data.arg && d.data.arg.token === p.token); });
    var f = l.fame || 0, range = A.SCALES[p.scale].fee, sc = U.clamp(act(l) / 100 * 0.7 + 0.2, 0, 1);
    p.dirName = o.dir.name + (o.intl ? ' (' + cname(o.cc) + ')' : ''); p.dirSkill = o.dir.rep; p.script = Math.round(70 + u(p.token + ':scr') * 25); p.role = 'chính'; p.wanted = 'chính'; p.direct919 = o.dir.id; p.intl919 = o.intl ? o.cc : null;
    p.fee = H.money ? (range[0] + (range[1] - range[0]) * sc) * (1 + Math.log10(1 + f / 1e5)) * (o.intl ? 1.8 : 1.2) : 0; p.fee = E.SHOW151 && E.SHOW151.V ? E.SHOW151.V(l, p.fee) : p.fee; p.months = 3; p.perf = sc; p.stage = 'offer'; p.manual = true;
    st(l).pend = (st(l).pend || []).concat([{ token: p.token, title: p.title, intl: p.intl919, at: l.age }]);
    X.next(l, 'film154', r, { token: p.token, stage: 'offer' }, { manual: true });
    log('Đạo diễn ' + p.dirName + ' (' + o.dir.style + ') mời bạn vai chính trong "' + p.title + '" mà không cần thử vai.', 'big');
  }
  X.menu('directorOffers919', 'Lời mời đóng phim từ đạo diễn nổi tiếng', function (l) { var r = X.reason(l, 16); if (r !== true) return r; return st(l).offers.some(function (o) { return o.status === 'open' && o.until >= l.age; }) ? true : 'Chưa có lời mời trực tiếp'; }, function (l) {
    return 'Các đạo diễn trong mục này là nhân vật hư cấu. Lời mời trực tiếp không qua casting nhưng vẫn phải đàm phán hợp đồng, có thể bị hủy nếu bạn đang bận dự án khác hoặc chưa có giấy phép làm việc ở nước ngoài.\n' + st(l).offers.filter(function (o) { return o.status === 'open'; }).map(function (o) { return '• ' + o.dir.name + ' — ' + (o.intl ? 'đạo diễn ' + cname(o.cc) : 'đạo diễn trong nước') + ', uy tín ' + o.dir.rep + '/100, phong cách ' + o.dir.style; }).join('\n');
  }, function (l) { var out = []; st(l).offers.filter(function (o) { return o.status === 'open'; }).forEach(function (o) { out.push({ k: 'acc:' + o.id, l: 'Nhận lời ' + o.dir.name + (o.intl ? ' (phim ' + cname(o.cc) + ')' : ''), why: acceptWhy(l, o), run: function (l, r, log) { accept(l, o, r, log); } }); out.push({ k: 'dec:' + o.id, l: 'Từ chối lịch sự ' + o.dir.name, run: function (l, r, log) { o.status = 'declined'; log('Bạn từ chối lời mời của ' + o.dir.name + '; hai bên hẹn dịp khác.', 'neutral'); } }); }); return out; }, 16, 'Nghề nghiệp');
  // Liên hoan phim quốc tế: xét các đề cử năm trước của life154 (chất lượng q), mỗi phim một lần.
  function festYear(l, log) {
    var s = st(l), A0 = A.S(l); (A0.noms || []).forEach(function (n) {
      if (n.fest919 || n.year !== yr(l) - 1) return; n.fest919 = true; var q = n.q || 0; if (q < 0.72) return;
      var chance = U.clamp((q - 0.72) * 2.2 + s.intl / 300, 0, 0.7); if (u(l.id + ':fs:' + n.token) > chance) return;
      var f = FEST[Math.floor(u(l.id + ':fn:' + n.token) * FEST.length)], win = q >= f[2] && u(l.id + ':fw:' + n.token) < 0.18 * (n.role === 'chính' ? 1 : 0.5);
      s.fests.push({ fest: f[0], prize: win ? f[1] : null, title: n.title, year: yr(l) }); s.intl = Math.min(100, s.intl + (win ? 20 : 8)); l.fame = (l.fame || 0) + (win ? 4e5 : 6e4);
      A0.awards.push({ name: f[0] + (win ? ' — ' + f[1] : ' — tuyển chọn chính thức'), title: n.title, year: yr(l), won: !!win });
      log(win ? 'Bạn đoạt ' + f[1] + ' tại ' + f[0] + ' với vai diễn trong "' + n.title + '"! Báo chí quốc tế bắt đầu chú ý.' : '"' + n.title + '" được chọn chiếu tại ' + f[0] + '; bạn bước trên thảm đỏ quốc tế.', win ? 'big' : 'good');
      if (win) H.mem(l, f[1] + ' tại ' + f[0] + '.', 7);
      if (q >= 0.93 && s.intl >= 60 && n.role === 'chính' && u(l.id + ':osc:' + n.token) < 0.05) { A0.awards.push({ name: 'Đề cử Oscar (Giải thưởng Viện Hàn lâm)', title: n.title, year: yr(l), won: false }); s.intl = Math.min(100, s.intl + 15); log('Bạn nhận đề cử Oscar cho vai diễn trong "' + n.title + '" — điều rất hiếm với diễn viên quốc tế.', 'big'); H.mem(l, 'Đề cử Oscar.', 8); }
    });
  }
  function intlYear(l, log) {
    var s = st(l); (s.pend || []).forEach(function (q) { if (q.done) return; var c = A.S(l).credits.find(function (c) { return c.title === q.title; }); if (!c || c.year > yr(l) - 1) return; q.done = true; if (q.intl) { s.intl = Math.min(100, s.intl + 12); s.markets[q.intl] = (s.markets[q.intl] || 0) + 1; log('Phim quốc tế "' + q.title + '" giúp bạn được khán giả ' + cname(q.intl) + ' biết đến.', 'good'); } else s.intl = Math.min(100, s.intl + 3); });
    if (s.decayAt !== l.age) { s.decayAt = l.age; var recent = (A.S(l).credits || []).some(function (c) { return c.year >= yr(l) - 2; }); if (!recent) s.intl = Math.max(0, s.intl - 3); }
  }
  // Danh tiếng quốc tế mở rộng phần khán giả quốc tế trong sổ người theo dõi (followers919).
  if (E.FOLLOW919 && E.FOLLOW919.markets) { var mk0 = E.FOLLOW919.markets; E.FOLLOW919.markets = function (l) { var m = mk0.apply(this, arguments), add = Math.min(0.3, (l.flags.star919 ? l.flags.star919.intl : 0) / 300); if (add > 0) { m.share.intl = Math.min(0.8, m.share.intl + add); m.share[m.home] = 1 - m.share.intl; } return m; }; }
  X.menu('stardom919', 'Danh tiếng trong và ngoài nước', function (l) { var r = X.reason(l, 14); if (r !== true) return r; return isActor(l) || A.S(l).credits.length ? true : 'Dành cho người theo nghề diễn'; }, function (l) {
    var s = st(l), aw = A.S(l).awards.filter(function (a) { return a.won; });
    return 'Độ nổi tiếng quốc tế: ' + Math.round(s.intl) + '/100' + (Object.keys(s.markets).length ? ' · được biết đến ở ' + Object.keys(s.markets).map(cname).join(', ') : '') + '. Giải thưởng trong nước ở nơi bạn sống: ' + domestic(l).join(', ') + '.' +
      (aw.length ? '\nĐã đoạt: ' + aw.slice(-6).map(function (a) { return a.name + ' ("' + a.title + '", ' + a.year + ')'; }).join('; ') : '') + (s.fests.length ? '\nLiên hoan phim: ' + s.fests.slice(-5).map(function (f) { return f.fest + (f.prize ? ' — ' + f.prize : ' — tuyển chọn') + ' (' + f.year + ')'; }).join('; ') : '') +
      '\nĐạo diễn quốc tế mời khi độ nổi tiếng quốc tế từ 25. Kết quả giải thưởng trong trò chơi là hư cấu.';
  }, function (l) { var s = st(l), out = [];
    out.push({ k: 'press', l: 'Quảng bá phim ở thị trường nước ngoài (phỏng vấn, fan meeting)', h: mo(l, l.base * 0.05), why: s.pressAt === l.age ? 'Đã quảng bá năm nay' : !A.S(l).credits.length ? 'Cần có phim đã phát hành' : l.money < l.base * 0.05 ? 'Chưa đủ tiền' : true, run: function (l, r, log) { s.pressAt = l.age; H.cash(l, -l.base * 0.05, 'Quảng bá phim ở nước ngoài'); var g = r() < 0.6 ? 4 : 1; s.intl = Math.min(100, s.intl + g); log(g > 1 ? 'Chuyến quảng bá được báo chí nước ngoài đưa tin.' : 'Chuyến quảng bá ít người biết; cần thêm tác phẩm nổi bật.', 'neutral'); } });
    out.push({ k: 'lang', l: 'Học thoại tiếng Anh cho vai quốc tế', h: 'Qua mục Danh tính → học ngoại ngữ', run: function (l, r) { X.next(l, 'identity919', r, { learn: 'en' }); } });
    return out; }, 14, 'Nghề nghiệp');
  E.HOOKS.year.push(function (l, r, log) { if (!l.alive || !l.flags || !(isActor(l) || l.flags.star919 || l.flags.actor154)) return; festYear(l, log); intlYear(l, log); offersYear(l); });
  var mig = E.migrateExt; E.migrateExt = function (l) { if (mig) mig(l); if (l && l.flags && l.flags.star919 != null && typeof l.flags.star919 !== 'object') delete l.flags.star919; };
  E.STAR919 = { domestic: domestic, DOM: DOM, FEST: FEST, directors: directors, eligible: eligible, offersYear: offersYear, accept: accept, festYear: festYear, intlYear: intlYear, state: st };
})(globalThis.G);
