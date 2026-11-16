/* Một Đời — 9.5.5: hợp đồng nhiều năm cho vận động viên chuyên nghiệp không phải bóng đá (bóng rổ, quần vợt, điền kinh, game thủ…).
   Bóng đá đã có hợp đồng riêng (football.js); ca sĩ, diễn viên có hợp đồng công ty giải trí riêng (life139, life155, life162).
   Ở đây dùng lại thu nhập theo thành tích có sẵn (E.sportSalary, E.sportPerformance): hợp đồng chỉ đặt MỨC SÀN theo năm (bằng 85% thu nhập lúc ký,
   tăng theo năm), nên năm tệ không tụt dưới sàn còn năm tốt vẫn hưởng thành tích. Năm cuối có quyết định gia hạn, đòi tăng, ra thị trường hoặc giải nghệ.
   Dùng E.CHAIN144 không cần; dùng E.SC, E.HOOKS.year, E.careerYear. Mã băm theo l.rs nên cùng hạt giống diễn ra như nhau. */
(function (G) {
  'use strict';
  var E = G.E, H = E && E.H, U = G.U, X = E && E.UPDATE110;
  if (!E || !H || !E.careerYear || !E.SC || !X) return;
  var PRO = /^(vdv|ky_thu|tuyen_thu_es)$/;
  function wy(l) { return l.birthYear + l.age; }
  function hs(l, tag) { var h = 2166136261, s = String(l.rs) + ':955:' + tag; for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 15; h = Math.imul(h, 2246822507); h ^= h >>> 13; return (h >>> 0) / 4294967296; }
  function st(l) { return l.flags.pro955 || (l.flags.pro955 = {}); }
  function eligible(l) {
    if (!l.alive || !l.job || !PRO.test(E.resolveJob(l.job.id))) return false;
    if (l.talentSub === 'bóng đá') return false; // bóng đá có hệ thống hợp đồng riêng
    if (E.ESPORTS && E.ESPORTS.managed && E.ESPORTS.managed(l)) return false;
    return true;
  }
  function key(l) { return E.resolveJob(l.job.id) + ':' + (l.job.since != null ? l.job.since : '') + ':' + (l.talentSub || ''); }
  function years(l, tag) {
    var perf = E.sportPerformance ? E.sportPerformance(l) : { rank: 0 }, star = perf.rank >= 2, u = hs(l, tag + ':' + wy(l));
    if (l.age < 22) return star ? 4 : 3;
    if (l.age <= 29) return star ? 4 + Math.floor(u * 3) : 2 + Math.floor(u * 3); // 4–6 hoặc 2–4
    if (l.age <= 33) return 2 + Math.floor(u * (star ? 3 : 2));
    return 1 + Math.floor(u * 2);
  }
  function raiseOf(l) { var perf = E.sportPerformance ? E.sportPerformance(l) : { rank: 0 }; return l.age < 24 ? .07 : perf.rank >= 2 ? .05 : l.age > 32 ? .02 : .03; }
  function floorNow(c, y) { return c.floor * Math.pow(1 + c.raise, Math.max(0, Math.min(8, y - c.start))); }
  function sign(l, wage, tag, mult) {
    var s = st(l), y = wy(l), n = years(l, tag);
    s.c = { job: key(l), start: y, end: y + n, floor: wage * 0.85 * (mult || 1), raise: raiseOf(l), n: (s.n || 0) + 1 };
    s.n = s.c.n; s.queued = null; s.gap = null; return s.c;
  }
  var career = E.careerYear;
  E.careerYear = function (l, r, log) {
    var out = career.apply(this, arguments); log = log || function () { };
    if (!(out > 0) || !eligible(l)) return out;
    var s = st(l), y = wy(l), c = s.c;
    if (c && c.job !== key(l)) { s.c = c = null; }
    if (!c && s.gap && s.gap >= y) return out; // năm chờ thị trường: không có sàn
    if (!c) { c = sign(l, out, 'new'); log('Ký hợp đồng thi đấu ' + (c.end - c.start) + ' năm với mức sàn ' + H.money(l, c.floor) + '/năm, tăng ' + Math.round(c.raise * 100) + '% mỗi năm; năm tốt vẫn hưởng thêm theo thành tích.', 'neutral'); return out; }
    if (y >= c.end) { s.c = null; return out; }
    var fl = floorNow(c, y);
    if (out < fl) { if (l.job) l.job.sportPrevSalary = fl; return fl; }
    return out;
  };
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.flags || !l.flags.pro955 || !eligible(l)) return;
    var s = st(l), c = s.c, y = wy(l);
    if (c && c.end - y <= 1 && s.queued !== c.end && !(l.pending || []).some(function (d) { return d.id === 'pro955_expiry'; })) { s.queued = c.end; X.next(l, 'pro955_expiry', r, null, { manual: false }); }
  });
  E.SC('pro955_expiry', {
    title: 'Hợp đồng thi đấu sắp hết hạn',
    valid: function (l) { var c = l.flags && l.flags.pro955 && l.flags.pro955.c; return !!(eligible(l) && c && c.end - wy(l) <= 1); },
    text: function (l) {
      var c = l.flags.pro955.c, perf = E.sportPerformance ? E.sportPerformance(l) : { points: 0, rank: 0 };
      return 'Hợp đồng thi đấu của bạn kết thúc ' + (c.end - wy(l) <= 0 ? 'cuối mùa này' : 'sau một mùa nữa') + '. Mức sàn hiện tại ' + H.money(l, floorNow(c, wy(l))) + '/năm. ' + (perf.rank >= 2 ? 'Thành tích gần đây khiến nhiều nơi để mắt tới.' : perf.rank === 1 ? 'Thành tích ở mức khá, đủ để thương lượng.' : 'Thành tích chưa nổi bật nên khó đòi hỏi nhiều.') + (l.age >= 33 ? ' Tuổi ' + l.age + ' khiến cơ hội hẹp dần.' : '');
    },
    opts: [
      { k: 'renew', l: 'Gia hạn với bên hiện tại', ai: { w: 1.6 }, run: function (l, r, log) { renew(l, r, log, 1); } },
      { k: 'raise', l: 'Đòi tăng mức sàn mạnh khi gia hạn', ai: { w: .4, amb: 1 }, req: function (l) { return (E.sportPerformance ? E.sportPerformance(l).rank : 0) >= 1; }, run: function (l, r, log) { renew(l, r, log, 1.25); } },
      { k: 'market', l: 'Chạy hết hợp đồng, ra thị trường', ai: { w: .5, risk: 1 }, run: function (l, r, log) { var s = st(l); s.gap = s.c.end; log('Bạn không gia hạn, chờ hết hợp đồng để thương lượng với nơi khác.', 'neutral'); } },
      { k: 'retire', l: 'Giải nghệ thi đấu khi hết hạn', ai: { w: .1 }, req: function (l) { return l.age >= 33; }, run: function (l, r, log) { var s = st(l); s.c = null; l.lastJob = l.job; l.job = null; l.flags.needJob = true; log('Bạn giải nghệ thi đấu, hồ sơ thành tích vẫn được giữ.', 'big'); H.mem(l, 'Ngày giải nghệ thi đấu.', 5); } }
    ]
  });
  function renew(l, r, log, mult) {
    var s = st(l), c = s.c, perf = E.sportPerformance ? E.sportPerformance(l) : { rank: 0 };
    var chance = U.clamp(.55 + perf.rank * .1 - (mult > 1 ? .22 : 0) - (l.age > 33 ? .15 : 0), .1, .92);
    var wage = (l.job && l.job.sportPrevSalary) || floorNow(c, wy(l)) / .85;
    if (r() > chance) { log('Bên hiện tại chưa đồng ý ' + (mult > 1 ? 'mức bạn đòi và để hợp đồng chạy hết kỳ.' : 'gia hạn, hợp đồng sẽ chạy hết kỳ.'), 'neutral'); s.gap = c.end; return; }
    var n = c.n, nc = sign(l, wage, 'renew' + n, mult); s.c = nc;
    log('Gia hạn thêm ' + (nc.end - nc.start) + ' năm, mức sàn ' + H.money(l, nc.floor) + '/năm' + (mult > 1 ? ' (đòi tăng thành công)' : '') + '.', 'good');
  }
  E.PRO955 = { state: st, eligible: eligible, floorNow: floorNow, years: years, sign: sign };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
