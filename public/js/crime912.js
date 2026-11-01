/* Đường tối 912 — đàn em là NPC, địa bàn, đánh giá rủi ro, tổng hợp án, uy tín khi quay lại nghề.
   Cơ chế hư cấu bằng chỉ số trừu tượng; không mô tả cách thực hiện hay né tránh điều tra ngoài đời.
   · Mở rộng CRIME911 (crime-depth.js: hồ sơ điều tra, sức ép, nhóm) và "thế giới ngầm" (life47: đánh úp, truy sát), không thay thế.
   · Đàn em: vai trò (bảo vệ, cảnh giới, kế toán, thương lượng, hậu cần), kỹ năng, tính cách, lòng tin, phần chia, lịch sử; có thể rời
     nhóm hoặc trở thành người cung cấp thông tin khi bị đối xử tệ. Vai trò giảm rủi ro thật nhưng có trần — không có miễn trừ 100%.
   · Địa bàn: mức ảnh hưởng 0–100, thu và chi mỗi năm, xung đột với nhóm khác khi mở rộng.
   · Trước khi quyết định có bảng rủi ro ước tính năm nay (điều tra, đánh úp, tử vong nếu bị đánh úp, thu nhập, chi cho nhóm).
   · H.jail: án mới khi đang thi hành án được tổng hợp (giữ ngày mãn hạn muộn hơn), không ghi đè làm ngắn án cũ; sổ án lưu từng vụ.
   · Quay lại cùng nghề sau khi ra tù: giữ một phần uy tín (cấp cũ − 1). */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, C9 = E.CRIME911;
  if (!C9) return;
  var V = 1;
  // Tham số gameplay.
  var BAL = { ambushDeath: 0.6, guardCut: 0.5, guardPer: 1 / 150, lookPer: 1 / 200, lookCap: 0.35, cutDefault: 8, cutMin: 3, cutMax: 25, loyaltyLeave: 20, informant: 0.35,
    terrIncome: 0.006, terrUpkeep: 0.002, terrHeat: 0.12, expandCost: 0.3, crewBase: 2 };
  var ROLES = { guard: 'Bảo vệ', lookout: 'Cảnh giới', accountant: 'Kế toán', negotiator: 'Thương lượng', logistics: 'Hậu cần' };
  var ROLE_HINT = { guard: 'giảm nguy cơ tử vong khi bị đánh úp', lookout: 'giảm khả năng bị chú ý và mở hồ sơ', accountant: 'giữ lại nhiều thu nhập hơn, giảm dấu vết tài chính', negotiator: 'giảm thù địch với nhóm khác', logistics: 'tăng thu nhập hoạt động' };
  var TRAITS = ['trung thành', 'nóng nảy', 'cẩn thận', 'tham lam', 'ít nói', 'liều lĩnh', 'khéo léo', 'thực dụng'];

  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; }
  function rng(seed) { var x = hash(seed) || 1; return function () { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
  function cs(l) { return C9.state(l); }
  function state(l) {
    var s = l.flags.crime912;
    if (!s || typeof s !== 'object') s = l.flags.crime912 = { v: V, territory: { influence: 0, since: null, at: null }, hires: [], hiresAt: null, sentences: [], serial: 0 };
    if (!s.territory) s.territory = { influence: 0 };
    if (!Array.isArray(s.hires)) s.hires = []; if (!Array.isArray(s.sentences)) s.sentences = [];
    s.v = V; return s;
  }
  function free(l) { return X.free(l, 18); }
  function active(l) { return E.isCrime(l) || (l.flags.underworld || {}).linked; }
  // Đàn em của CRIME911 được bổ sung thuộc tính một lần (không reroll); mối liên hệ cũ không vai trò vẫn giữ nguyên.
  function crew(l) { return cs(l).crew.filter(function (p) { return p.status === 'active'; }); }
  function ensure(l, p) {
    if (p.role912 === undefined) { var r = rng(l.id + ':crew912:' + p.id); p.role912 = null; p.skill912 = Math.round(25 + r() * 55); p.trait912 = TRAITS[Math.floor(r() * TRAITS.length)]; p.cut912 = BAL.cutDefault; p.hist912 = []; }
    return p;
  }
  function role(l, k) { return crew(l).map(function (p) { return ensure(l, p); }).filter(function (p) { return p.role912 === k; }); }
  function power(l, k) { return role(l, k).reduce(function (n, p) { return n + p.skill912 * (0.5 + p.trust / 200); }, 0); }
  function maxCrew(l) { return BAL.crewBase + Math.min(4, l.job && E.isCrime(l) ? (l.job.rank || 0) * 2 : 0); }
  function cutTotal(l) { return crew(l).reduce(function (n, p) { return n + (ensure(l, p).cut912 || 0); }, 0); }
  function hist(p, t, l) { p.hist912 = (p.hist912 || []).concat([l.age + ': ' + t]).slice(-8); }

  // ---- Rủi ro có trần, đọc qua hàm công khai ----
  var risk0 = E.underworldRisk, death0 = E.underworldDeathRisk, rate0 = C9.rate;
  E.underworldRisk = function (l) { var x = risk0.apply(this, arguments); if (!x || !l.flags.crime912) return x; var t = state(l).territory; return U.clamp(x * (1 - Math.min(0.3, power(l, 'negotiator') / 300)) + (t.influence || 0) / 1500, 0, 0.6); };
  // Cân bằng 912: mỗi lần bị đánh úp trước đây 27–42% tử vong (25–45% người theo nghề chết trong 30 năm mô phỏng); giảm còn 60% mức cũ.
  E.underworldDeathRisk = function (l, fight) { var x = death0.apply(this, arguments) * BAL.ambushDeath; if (!l.flags.crime912) return U.clamp(x, 0.05, 0.8); return U.clamp(x * (1 - Math.min(BAL.guardCut, power(l, 'guard') * BAL.guardPer)), 0.05, 0.8); };
  C9.rate = function (l, pa) { var x = rate0.apply(this, arguments); if (!l.flags.crime912) return x; return x * (1 - Math.min(BAL.lookCap, power(l, 'lookout') * BAL.lookPer)); };

  function riskReport(l) {
    var c = E.isCrime(l) ? E.jobDef(l) : null, inv = c ? C9.rate(l, (c.crime && c.crime[0]) || 0.05) : C9.rate(l, 0.02), amb = E.underworldRisk(l), d = E.underworldDeathRisk(l, false), t = state(l).territory, s = cs(l);
    return 'Đánh giá năm nay (ước tính của game): khả năng bị mở hồ sơ ' + Math.round(inv * 100) + '% · bị nhóm khác đánh úp ' + Math.round(amb * 100) + '%, nếu bị đánh úp nguy cơ không qua khỏi khoảng ' + Math.round(d * 100) + '% · sức ép ' + s.pressure + '/100' + (s.open ? ' · có hồ sơ đang mở' : '') +
      ' · địa bàn ảnh hưởng ' + Math.round(t.influence || 0) + '/100 · đàn em ' + crew(l).length + '/' + maxCrew(l) + ', chia ' + cutTotal(l) + '% thu nhập. Bảo vệ, cảnh giới và thương lượng giảm rủi ro có giới hạn; không có cách nào miễn hoàn toàn.';
  }

  // ---- Ứng viên đàn em: 3 người mỗi năm, lưu lại ----
  function hires(l) {
    var s = state(l);
    if (s.hiresAt !== l.age) { s.hiresAt = l.age; s.hires = []; var r = rng(l.id + ':hire912:' + l.age); var keys = Object.keys(ROLES);
      for (var i = 0; i < 3; i++) s.hires.push({ id: l.id + ':h912:' + (++s.serial), name: H.stranger(l, r), role: keys[Math.floor(r() * keys.length)], skill: Math.round(25 + r() * 60), trait: TRAITS[Math.floor(r() * TRAITS.length)], ask: BAL.cutMin + Math.floor(r() * 10) }); }
    return s.hires;
  }
  function crewReason(l) { if (!free(l)) return 'Cần được tự do đi lại'; return active(l) ? true : 'Cần đang hoạt động trong giới'; }
  X.menu('crew912', 'Đàn em, địa bàn và rủi ro', crewReason,
    function (l) { return riskReport(l) + '\nĐàn em: ' + (crew(l).map(function (p) { ensure(l, p); return p.name + ' (' + (p.role912 ? ROLES[p.role912] : 'chưa giao việc') + ', kỹ năng ' + p.skill912 + ', tin ' + p.trust + ', chia ' + p.cut912 + '%, ' + p.trait912 + ')'; }).join('; ') || 'chưa có') + '.'; },
    function (l) {
      var out = [], s = state(l), t = s.territory;
      crew(l).forEach(function (p) { ensure(l, p); out.push({ k: 'p:' + p.id, l: 'Quản lý ' + p.name + ' · ' + (p.role912 ? ROLES[p.role912] : 'chưa giao việc'), run: function (l, r) { X.next(l, 'crewPerson912', r, { id: p.id }); } }); });
      hires(l).forEach(function (h) { out.push({ k: 'h:' + h.id, l: 'Nhận ' + h.name + ' · ' + ROLES[h.role] + ' · kỹ năng ' + h.skill, h: h.trait + ' · đòi chia ' + h.ask + '% · ' + ROLE_HINT[h.role], why: crew(l).length >= maxCrew(l) ? 'Nhóm đã đủ người theo cấp hiện tại' : true,
        run: function (l, r, log) { var x = state(l).hires.find(function (y) { return y.id === h.id; }); if (!x || crew(l).length >= maxCrew(l)) return; state(l).hires = state(l).hires.filter(function (y) { return y !== x; });
          var p = { id: x.id, name: x.name, trust: 40, status: 'active', since: l.age, role912: x.role, skill912: x.skill, trait912: x.trait, cut912: x.ask, hist912: [] }; cs(l).crew.push(p); hist(p, 'vào nhóm', l); log(x.name + ' vào nhóm, phụ trách ' + ROLES[x.role].toLowerCase() + ', chia ' + x.ask + '% thu nhập.', 'neutral'); } }); });
      out.push({ k: 't:expand', l: 'Mở rộng địa bàn', h: 'Chi ' + H.money(l, l.base * BAL.expandCost) + ' · ảnh hưởng +15 · thù địch với nhóm khác tăng', why: t.at === l.age ? 'Đã quyết định về địa bàn năm nay' : l.money < l.base * BAL.expandCost ? 'Thiếu tiền' : true,
        run: function (l, r, log) { var t = state(l).territory; if (t.at === l.age || l.money < l.base * BAL.expandCost) return; t.at = l.age; H.cash(l, -l.base * BAL.expandCost, 'Mở rộng địa bàn'); t.influence = Math.min(100, (t.influence || 0) + 15); if (t.since == null) t.since = l.age; var uw = l.flags.underworld || (l.flags.underworld = { linked: false, heat: 0, hunted: false }); uw.heat = U.clamp((uw.heat || 0) + 10, 0, 100); C9.pressure(l, 4); log('Nhóm mở rộng ảnh hưởng sang khu vực mới. Thu nhập tiềm năng tăng, va chạm với nhóm khác cũng tăng.', 'neutral'); } });
      out.push({ k: 't:hold', l: 'Giữ địa bàn, giảm va chạm', why: t.at === l.age ? 'Đã quyết định về địa bàn năm nay' : true, run: function (l, r, log) { var t = state(l).territory; if (t.at === l.age) return; t.at = l.age; var uw = l.flags.underworld; if (uw) uw.heat = U.clamp((uw.heat || 0) - 8, 0, 100); C9.pressure(l, -3); log('Nhóm giữ nguyên phạm vi, tránh va chạm năm nay.', 'neutral'); } });
      if ((t.influence || 0) > 0) out.push({ k: 't:cede', l: 'Nhường bớt địa bàn', h: 'ảnh hưởng −20 · thù địch và sức ép giảm', why: t.at === l.age ? 'Đã quyết định về địa bàn năm nay' : true, run: function (l, r, log) { var t = state(l).territory; if (t.at === l.age) return; t.at = l.age; t.influence = Math.max(0, t.influence - 20); var uw = l.flags.underworld; if (uw) uw.heat = U.clamp((uw.heat || 0) - 15, 0, 100); C9.pressure(l, -6); log('Nhóm rút khỏi một phần địa bàn, mâu thuẫn hạ nhiệt.', 'neutral'); } });
      out.push({ k: 'plan', l: 'Kế hoạch hoạt động năm nay (tạm dừng, giữ nguyên, rời nhóm)', run: function (l, r) { X.next(l, 'crimePlan911', r, {}); } });
      return out;
    }, 18, 'Đường tối');
  X.menu('crewPerson912', 'Giao việc và quan hệ với đàn em', crewReason,
    function (l, d) { var p = crew(l).find(function (x) { return x.id === (d && d.arg && d.arg.id); }); if (!p) return 'Người này không còn trong nhóm.'; ensure(l, p); return p.name + ' · ' + (p.role912 ? ROLES[p.role912] + ' (' + ROLE_HINT[p.role912] + ')' : 'chưa giao việc') + ' · kỹ năng ' + p.skill912 + ' · lòng tin ' + p.trust + '/100 · ' + p.trait912 + ' · chia ' + p.cut912 + '% · trong nhóm từ năm ' + (l.birthYear + p.since) + '.\nLịch sử: ' + ((p.hist912 || []).join('; ') || 'chưa có') + '.'; },
    function (l, a) {
      var p = crew(l).find(function (x) { return x.id === a.id; }); if (!p) return []; ensure(l, p);
      var out = Object.keys(ROLES).filter(function (k) { return k !== p.role912; }).map(function (k) { return { k: 'r:' + k, l: 'Giao việc ' + ROLES[k].toLowerCase(), h: ROLE_HINT[k], run: function (l, r, log) { var q = crew(l).find(function (x) { return x.id === a.id; }); if (!q) return; q.role912 = k; hist(q, 'nhận việc ' + ROLES[k].toLowerCase(), l); log(q.name + ' nhận phần việc ' + ROLES[k].toLowerCase() + '.', 'neutral'); } }; });
      out.push({ k: 'up', l: 'Tăng phần chia lên ' + Math.min(BAL.cutMax, p.cut912 + 3) + '%', why: p.cut912 >= BAL.cutMax ? 'Đã ở mức cao nhất' : true, run: function (l, r, log) { var q = crew(l).find(function (x) { return x.id === a.id; }); if (!q || q.cut912 >= BAL.cutMax) return; q.cut912 += 3; q.trust = Math.min(100, q.trust + 8); hist(q, 'được tăng phần chia', l); log(q.name + ' được tăng phần chia, lòng tin tăng.', 'neutral'); } });
      out.push({ k: 'down', l: 'Giảm phần chia xuống ' + Math.max(BAL.cutMin, p.cut912 - 3) + '%', why: p.cut912 <= BAL.cutMin ? 'Đã ở mức thấp nhất' : true, run: function (l, r, log) { var q = crew(l).find(function (x) { return x.id === a.id; }); if (!q || q.cut912 <= BAL.cutMin) return; q.cut912 -= 3; q.trust = Math.max(0, q.trust - 12); hist(q, 'bị giảm phần chia', l); log(q.name + ' bị giảm phần chia và tỏ ra không vui.', 'neutral'); } });
      if (cs(l).disputes > 0) out.push({ k: 'mediate', l: 'Đứng ra hòa giải mâu thuẫn trong nhóm', run: function (l, r, log) { var s = cs(l); s.disputes = Math.max(0, s.disputes - 1); s.cohesion = Math.min(100, s.cohesion + 5); crew(l).forEach(function (q) { q.trust = Math.min(100, q.trust + 2); }); log('Bạn đứng ra nói chuyện, mâu thuẫn trong nhóm lắng xuống.', 'neutral'); } });
      out.push({ k: 'dismiss', l: 'Cho ' + p.name + ' rời nhóm êm thấm', run: function (l, r, log) { var q = crew(l).find(function (x) { return x.id === a.id; }); if (!q) return; q.status = 'separated'; hist(q, 'rời nhóm theo thỏa thuận', l); if (q.trust < 30 && r() < 0.25) { C9.pressure(l, 10); log(q.name + ' rời đi trong bất mãn; bạn lo người này sẽ kể chuyện với người ngoài.', 'bad'); } else log(q.name + ' rời nhóm êm thấm.', 'neutral'); } });
      return out;
    }, 18);

  // ---- Thu nhập: phần chia cho đàn em, địa bàn, kế toán/hậu cần ----
  var career0 = E.careerYear;
  E.careerYear = function (l) {
    var crimeJob = E.isCrime(l), out = career0.apply(this, arguments);
    if (!crimeJob || !l.flags.crime912 || !(out > 0)) return out;
    var bonus = 1 + Math.min(0.25, power(l, 'logistics') / 600) + Math.min(0.1, power(l, 'accountant') / 1500);
    var share = Math.min(0.6, cutTotal(l) / 100);
    return out * bonus * (1 - share);
  };
  // ---- Mỗi năm: địa bàn, lòng tin, người cung cấp thông tin ----
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !l.flags.crime912) return;
    var s = state(l), t = s.territory; if (s.yearAt === l.age) return; s.yearAt = l.age;
    var jailed = l.jailUntil != null && l.age < l.jailUntil;
    if ((t.influence || 0) > 0) {
      if (jailed || !active(l)) { t.influence = Math.max(0, t.influence - 25); if (t.influence === 0) log('Không còn ai giữ địa bàn; ảnh hưởng của nhóm tan dần.', 'neutral'); }
      else { var net = l.base * (BAL.terrIncome - BAL.terrUpkeep) * t.influence; if (net) H.cash(l, net, 'Thu chi địa bàn'); var uw = l.flags.underworld || (l.flags.underworld = { linked: false, heat: 0, hunted: false }); uw.heat = U.clamp((uw.heat || 0) + t.influence * BAL.terrHeat / 10, 0, 100); }
    }
    cs(l).crew.forEach(function (p) { if (p.status === 'injured' && p.injAt912 < l.age) { p.status = 'active'; hist(p, 'trở lại sau khi bình phục', l); } });
    crew(l).forEach(function (p) {
      ensure(l, p); if (p.y912 === l.age) return; p.y912 = l.age;
      if (jailed) { p.trust = Math.max(0, p.trust - 6); if (p.trust < BAL.loyaltyLeave) { p.status = 'left'; hist(p, 'rời nhóm khi bạn ở trong trại', l); } return; }
      var want = 6 + (p.trait912 === 'tham lam' ? 6 : 0) + Math.round(p.skill912 / 20);
      p.trust = U.clamp(p.trust + (p.cut912 >= want ? 3 : -4) + (cs(l).cohesion >= 60 ? 1 : 0), 0, 100);
      if (p.trust < BAL.loyaltyLeave) {
        p.status = 'left'; cs(l).disputes++;
        if (r() < BAL.informant * (p.trait912 === 'trung thành' ? 0.3 : 1)) { hist(p, 'rời nhóm và cung cấp thông tin', l); C9.pressure(l, 15); C9.open(l, log, 'thông tin từ một người từng trong nhóm', 2); log(p.name + ' bỏ đi trong bất mãn và có dấu hiệu đã nói chuyện với cơ quan chức năng.', 'bad'); }
        else { hist(p, 'rời nhóm vì không hài lòng', l); log(p.name + ' rời nhóm vì không hài lòng với phần chia.', 'neutral'); }
      }
    });
  });

  // ---- Thăng cấp trong giới: dựa vào nhóm, địa bàn, gắn kết — không dựa vào điểm học thuật (công thức nghề chung khiến nhiều người kẹt cấp 0 cả chục năm) ----
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !E.isCrime(l) || (l.jailUntil != null && l.age < l.jailUntil)) return;
    var c = E.jobDef(l), j = l.job; if (!c || !c.t || j.promo912 === l.age) return; j.promo912 = l.age;
    var rk = j.rank || 0; if (rk >= c.t.length - 1) return;
    var need = (c.yrs && c.yrs[rk]) || 4; if ((j.yrs || 0) < need) return;
    var s = l.flags.crime912 ? state(l) : null, n = crew(l).length, cs0 = cs(l);
    var p = U.clamp(0.15 + n * 0.05 + (s ? (s.territory.influence || 0) / 400 : 0) + (cs0.cohesion - 50) / 500 - cs0.disputes * 0.03, 0.05, 0.6);
    if (r() < p) { j.rank = rk + 1; j.yrs = 0; log('Uy tín trong giới tăng, bạn trở thành ' + c.t[j.rank] + '. Quyền quyết định và quy mô lớn hơn kéo theo trách nhiệm và rủi ro lớn hơn.', 'neutral'); }
  });

  // ---- Ứng phó đánh úp: đàn em bảo vệ yểm trợ rút lui ----
  var AMB = E.DEC.uw_can_len;
  if (AMB) AMB.def.opts.push({ k: 'cover912', l: 'Để đàn em bảo vệ yểm trợ rút lui', req: function (l) { return role(l, 'guard').length > 0; }, h: function (l) { return 'Nguy cơ không qua khỏi khoảng ' + Math.round(E.underworldDeathRisk(l, false) * 60) + '% · người bảo vệ có thể bị thương'; }, ai: { w: 1.6 },
    run: function (l, r, log) {
      var g = role(l, 'guard').sort(function (a, b) { return b.skill912 - a.skill912; })[0], p = E.underworldDeathRisk(l, false) * 0.6, uw = l.flags.underworld || (l.flags.underworld = { linked: false, heat: 0, hunted: false });
      if (r() < p) { H.kill(l, 'không chạy thoát trong một vụ đánh úp của băng nhóm', log); return; }
      uw.hunted = true; uw.attackedAt = l.age; uw.heat = U.clamp((uw.heat || 0) + 10, 0, 100); H.fx(l, { hea: -8, hap: -10 });
      if (g) { g.trust = Math.min(100, g.trust + 10); hist(g, 'yểm trợ bạn rút lui', l); if (r() < 0.25) { g.status = 'injured'; g.injAt912 = l.age; hist(g, 'bị thương nặng, phải nghỉ', l); } }
      log((g ? g.name + ' chặn phía sau cho bạn rút lui. ' : '') + 'Bạn thoát được nhưng nhóm đối thủ vẫn chưa buông tha.', 'bad');
      if (!(l.sched || []).some(function (x) { return x.id === 'uw_truy_sat'; })) H.sched(l, 'uw_truy_sat', 1);
    } });

  // ---- Án: tổng hợp khi đang thi hành, sổ án ----
  var jail0 = H.jail;
  H.jail = function (l, years, why, log) {
    var before = l.jailUntil, serving = before != null && l.age < before;
    var out = jail0.apply(this, arguments);
    if (serving && l.jailUntil < before) l.jailUntil = before; // không để án mới làm ngắn án đang thi hành
    var s = state(l); s.sentences.push({ id: ++s.serial, at: l.age, years: years, why: String(why || ''), until: l.jailUntil, concurrent: !!serving });
    if (s.sentences.length > 20) s.sentences.splice(0, s.sentences.length - 20);
    if (serving && typeof log === 'function') log('Án mới được tổng hợp với án đang thi hành; ngày mãn hạn là năm ' + (l.birthYear + l.jailUntil) + '.', 'neutral');
    s.territory.influence = Math.max(0, (s.territory.influence || 0) - 30);
    return out;
  };
  // ---- Quay lại cùng nghề sau khi ra tù: giữ một phần uy tín ----
  var start0 = E.startJob;
  E.startJob = function (l, id) {
    var last = l.lastJob, out = start0.apply(this, arguments);
    if (l.job && l.job.id === id && E.isCrime(l) && last && last.id === id && (last.rank || 0) > 0 && !(l.jailUntil != null && l.age < l.jailUntil)) { l.job.rank = Math.max(l.job.rank || 0, (last.rank || 0) - 1); }
    return out;
  };

  // ---- Bảng rủi ro trong kế hoạch có sẵn ----
  var P = E.DEC.crimePlan911;
  if (P && P.def) { var t0 = P.def.text; P.def.text = function (l, d) { return (typeof t0 === 'function' ? t0(l, d) : t0) + '\n' + riskReport(l); }; }

  // ---- §12 (8.10.17): thủ lĩnh nhóm là NPC, đổi lãnh đạo qua hai giai đoạn, tan rã nhóm ----
  // Tham số gameplay. Khủng hoảng chỉ là xác suất theo sức ép, mâu thuẫn, gắn kết; không ai bị buộc có biến cố.
  var LEAD = { crisisBase: 0.035, crisisPressure: 1 / 2500, crisisDispute: 0.025, crisisMax: 0.22, claimBase: 0.25, holdBase: 0.45, demand: 0.05, demandLow: 0.02, splitCohesion: 25, splitDisputes: 3, splitCooldown: 4 };
  function jailedNow(l) { return l.jailUntil != null && l.age < l.jailUntil; }
  function topRank(l) { var c = E.jobDef(l); return c && c.t ? c.t.length - 1 : 0; }
  function isLeader(l) { return !!(l.job && E.isCrime(l) && (l.job.rank || 0) >= topRank(l)); }
  function group(l) {
    var s = state(l), g = s.group;
    if (!g || typeof g !== 'object') g = s.group = { serial: 0, boss: null, history: [], crisis: null, dissolvedAt: null, splitAt: null };
    if (!Array.isArray(g.history)) g.history = [];
    return g;
  }
  function gnote(l, t) { var g = group(l); g.history.push({ age: l.age, year: l.birthYear + l.age, t: t }); if (g.history.length > 20) g.history.shift(); }
  function npc(l, tag) { var g = group(l), r = rng(l.id + ':' + tag + ':' + (++g.serial)); return { id: l.id + ':' + tag + ':' + g.serial, name: H.stranger(l, r, r() < 0.8 ? 'M' : 'F'), trait: TRAITS[Math.floor(r() * TRAITS.length)], trust: 35 + Math.floor(r() * 20), since: l.age, demand: 0 }; }
  function ensureBoss(l) { var g = group(l); if (!g.boss && E.isCrime(l) && !isLeader(l)) { g.boss = npc(l, 'boss912'); gnote(l, g.boss.name + ' là người cầm đầu nhóm bạn đang theo.'); } return g.boss; }
  function challenger(l) { var c = crew(l).map(function (p) { return ensure(l, p); }).sort(function (a, b) { return (b.skill912 - b.trust) - (a.skill912 - a.trust); })[0]; return c ? { id: c.id, name: c.name, trait: c.trait912, trust: c.trust, since: l.age, demand: 0, fromCrew: true } : npc(l, 'rival912'); }
  function crisisChance(l) { var s = cs(l); return U.clamp(LEAD.crisisBase + (s.pressure || 0) * LEAD.crisisPressure + (s.disputes || 0) * LEAD.crisisDispute + (s.cohesion < 40 ? 0.03 : 0), 0, LEAD.crisisMax); }
  function leaderWhy(l, d) { var g = group(l), c = g.crisis; return !!(c && d && c.id === d.cid && c.stage === d.stage && free(l) && E.isCrime(l) && !jailedNow(l)); }
  function closeCrisis(l, text) { var g = group(l); if (g.crisis) { g.crisis.closedAt = l.age; gnote(l, text); } g.crisis = null; }
  function leaveCrew(l, keep) { cs(l).crew.forEach(function (p) { if (p.status === 'active' && !(keep && keep(p))) { p.status = 'separated'; hist(p, 'tách ra khi nhóm thay đổi', l); } }); }

  E.SC('crimeLeader912', {
    title: function (l, d) { return d && d.stage === 2 ? 'Nhóm sau thay đổi người dẫn dắt' : d && d.kind === 'challenge' ? 'Có người muốn thay bạn dẫn dắt nhóm' : 'Người cầm đầu nhóm không còn giữ được vị trí'; },
    prep: function (l) { var c = group(l).crisis || {}; return { cid: c.id, stage: c.stage, kind: c.kind, cand: c.cand && c.cand.name, boss: c.oldBoss }; },
    valid: leaderWhy,
    text: function (l, d) {
      var g = group(l), c = g.crisis || {};
      if (d.stage === 2) return isLeader(l) ? 'Bạn đang dẫn dắt nhóm sau biến động năm trước. Những người còn ở lại chờ xem bạn chia việc và giữ địa bàn thế nào.' : (g.boss ? g.boss.name + ' (' + g.boss.trait + ')' : 'Người dẫn dắt mới') + ' muốn mọi người đóng góp nhiều hơn cho quỹ chung của nhóm. Lòng tin giữa hai bên: ' + (g.boss ? g.boss.trust : 0) + '/100.';
      if (d.kind === 'challenge') return d.cand + ' tỏ ý muốn nắm quyền dẫn dắt nhóm. Mâu thuẫn ' + cs(l).disputes + ', gắn kết ' + cs(l).cohesion + '/100. Kết quả phụ thuộc vào người còn tin bạn, không bảo đảm.';
      return (d.kind === 'arrested' ? (d.boss || 'Người cầm đầu') + ' bị tạm giữ trong một vụ khác.' : d.kind === 'retire' ? (d.boss || 'Người cầm đầu') + ' muốn rút lui vì tuổi tác và sức khỏe.' : 'Nội bộ chia rẽ, nhiều người không còn nghe ' + (d.boss || 'người cầm đầu') + '.') + ' ' + d.cand + ' đang được nhiều người nhắc tới để thay thế. Lựa chọn của bạn ảnh hưởng tới phần chia, rủi ro và vị trí trong nhóm những năm sau.';
    },
    opts: [
      { k: 'back', l: function (l, d) { return 'Ủng hộ ' + d.cand + ' giữ vai trò dẫn dắt'; }, req: function (l, d) { return d.stage === 1 && d.kind !== 'challenge'; }, ai: { w: 1.2 },
        run: function (l, r, log, d) { if (!leaderWhy(l, d)) return; var g = group(l); g.boss = g.crisis.cand; g.boss.trust = Math.min(100, g.boss.trust + 15); cs(l).cohesion = Math.min(100, cs(l).cohesion + 5); g.crisis.stage = 2; g.crisis.at = l.age; g.crisis.choice = 'back'; gnote(l, 'Bạn ủng hộ ' + g.boss.name + ' dẫn dắt nhóm.'); log('Bạn đứng về phía ' + g.boss.name + '. Người này nhớ sự ủng hộ, nhưng cũng sẽ đòi hỏi ở năm sau.', 'neutral'); } },
      { k: 'claim', l: 'Tự đứng ra dẫn dắt nhóm', h: function (l) { return 'Cần có người tin bạn; thất bại làm mâu thuẫn tăng và bị chú ý nhiều hơn'; }, req: function (l, d) { return d.stage === 1 && d.kind !== 'challenge' && !!l.job && (l.job.rank || 0) >= 1; }, ai: { amb: 1, w: 0.6 },
        run: function (l, r, log, d) {
          if (!leaderWhy(l, d)) return; var g = group(l), s = cs(l), uw = l.flags.underworld || (l.flags.underworld = { linked: false, heat: 0, hunted: false });
          var p = U.clamp(LEAD.claimBase + crew(l).reduce(function (n, q) { return n + q.trust; }, 0) / 600 + s.cohesion / 400 + (l.job.rank || 0) * 0.04 - s.disputes * 0.04, 0.1, 0.75);
          g.crisis.stage = 2; g.crisis.at = l.age; g.crisis.choice = 'claim';
          if (r() < p) { l.job.rank = topRank(l); l.job.yrs = 0; g.boss = null; C9.pressure(l, 8); crew(l).forEach(function (q) { q.trust = Math.min(100, q.trust + 5); }); gnote(l, 'Bạn trở thành người dẫn dắt nhóm.'); log('Phần lớn mọi người chấp nhận bạn dẫn dắt. Quyền lớn hơn đi cùng việc bị chú ý nhiều hơn.', 'neutral'); }
          else { s.disputes += 2; s.cohesion = Math.max(0, s.cohesion - 10); uw.heat = U.clamp((uw.heat || 0) + 10, 0, 100); g.boss = g.crisis.cand; g.boss.trust = 15; gnote(l, 'Bạn tranh vị trí dẫn dắt nhưng không thành; ' + g.boss.name + ' lên thay.'); log('Không đủ người đứng về phía bạn. ' + g.boss.name + ' nắm nhóm và dè chừng bạn.', 'bad'); }
        } },
      { k: 'aside', l: 'Đứng ngoài, giảm hoạt động một thời gian', req: function (l, d) { return d.stage === 1 && d.kind !== 'challenge'; }, ai: { w: 1 },
        run: function (l, r, log, d) { if (!leaderWhy(l, d)) return; var g = group(l); g.boss = g.crisis.cand; g.boss.trust = 30; C9.pressure(l, -6); g.crisis.stage = 2; g.crisis.at = l.age; g.crisis.choice = 'aside'; gnote(l, 'Bạn đứng ngoài cuộc thay đổi người dẫn dắt.'); log('Bạn giữ khoảng cách. ' + g.boss.name + ' lên thay; vị trí của bạn không đổi nhưng ít được tin cậy hơn.', 'neutral'); } },
      { k: 'share', l: function (l, d) { return 'Chia lại việc, tăng phần cho ' + d.cand; }, req: function (l, d) { return d.stage === 1 && d.kind === 'challenge'; }, ai: { w: 1.2 },
        run: function (l, r, log, d) { if (!leaderWhy(l, d)) return; var g = group(l), q = crew(l).find(function (x) { return x.id === g.crisis.cand.id; }); if (q) { q.cut912 = Math.min(BAL.cutMax, q.cut912 + 3); q.trust = Math.min(100, q.trust + 12); hist(q, 'được chia thêm việc và phần', l); } cs(l).cohesion = Math.min(100, cs(l).cohesion + 6); g.crisis.stage = 2; g.crisis.at = l.age; g.crisis.choice = 'share'; gnote(l, 'Bạn chia lại vai trò để giữ nhóm.'); log('Bạn nhường bớt quyền và phần chia. Căng thẳng giảm, thu nhập của bạn giảm theo.', 'neutral'); } },
      { k: 'stand', l: 'Giữ vị trí dẫn dắt', h: 'Người bảo vệ và gắn kết nhóm giúp giữ vị trí, không bảo đảm', req: function (l, d) { return d.stage === 1 && d.kind === 'challenge'; }, ai: { amb: 1, w: 0.8 },
        run: function (l, r, log, d) {
          if (!leaderWhy(l, d)) return; var g = group(l), s = cs(l), p = U.clamp(LEAD.holdBase + power(l, 'guard') / 250 + s.cohesion / 300 - s.disputes * 0.05, 0.2, 0.85);
          g.crisis.stage = 2; g.crisis.at = l.age; g.crisis.choice = 'stand';
          if (r() < p) { s.disputes += 1; gnote(l, 'Bạn giữ được vị trí dẫn dắt.'); log('Bạn giữ được vị trí, nhưng mâu thuẫn chưa hết.', 'neutral'); }
          else { l.job.rank = Math.max(0, topRank(l) - 1); var c = g.crisis.cand; g.boss = c; c.trust = 20; var q = crew(l).find(function (x) { return x.id === c.id; }); if (q) { q.status = 'separated'; hist(q, 'tách ra để dẫn dắt nhóm', l); } gnote(l, c.name + ' thay bạn dẫn dắt nhóm.'); log(c.name + ' kéo được nhiều người về phía mình. Bạn mất vị trí đứng đầu.', 'bad'); }
        } },
      { k: 'step', l: function (l, d) { return 'Nhường vị trí cho ' + d.cand; }, req: function (l, d) { return d.stage === 1 && d.kind === 'challenge'; },
        run: function (l, r, log, d) { if (!leaderWhy(l, d)) return; var g = group(l), c = g.crisis.cand; l.job.rank = Math.max(0, topRank(l) - 1); g.boss = c; c.trust = 50; var q = crew(l).find(function (x) { return x.id === c.id; }); if (q) { q.status = 'separated'; hist(q, 'nhận vị trí dẫn dắt', l); } C9.pressure(l, -8); g.crisis.stage = 2; g.crisis.at = l.age; g.crisis.choice = 'step'; gnote(l, 'Bạn nhường vị trí dẫn dắt cho ' + c.name + '.'); log('Bạn lùi lại. Ít bị chú ý hơn, ít quyền quyết định hơn.', 'neutral'); } },
      { k: 'accept', l: 'Chấp nhận đóng góp ' + Math.round(LEAD.demand * 100) + '% thu nhập cho quỹ nhóm', req: function (l, d) { return d.stage === 2 && !isLeader(l); }, ai: { w: 1.1 },
        run: function (l, r, log, d) { if (!leaderWhy(l, d)) return; var g = group(l); if (g.boss) { g.boss.demand = LEAD.demand; g.boss.trust = Math.min(100, g.boss.trust + 10); } closeCrisis(l, 'Bạn chấp nhận điều kiện của người dẫn dắt mới.'); log('Quan hệ với người dẫn dắt mới ổn định hơn; một phần thu nhập đi vào quỹ chung.', 'neutral'); } },
      { k: 'negotiate', l: 'Thương lượng mức đóng góp thấp hơn', req: function (l, d) { return d.stage === 2 && !isLeader(l); },
        run: function (l, r, log, d) { if (!leaderWhy(l, d)) return; var g = group(l), b = g.boss, p = U.clamp(0.3 + power(l, 'negotiator') / 300 + (b ? b.trust : 0) / 250, 0.15, 0.8); if (b && r() < p) { b.demand = LEAD.demandLow; closeCrisis(l, 'Thương lượng được mức đóng góp thấp.'); log('Hai bên thống nhất mức đóng góp thấp hơn.', 'neutral'); } else { if (b) { b.demand = LEAD.demand; b.trust = Math.max(0, b.trust - 10); } cs(l).disputes++; closeCrisis(l, 'Thương lượng không thành, quan hệ căng hơn.'); log('Thương lượng không thành. Bạn vẫn phải đóng góp, quan hệ căng hơn trước.', 'bad'); } } },
      { k: 'consolidate', l: 'Củng cố nhóm, phân rõ việc', req: function (l, d) { return d.stage === 2 && isLeader(l); }, ai: { w: 1 },
        run: function (l, r, log, d) { if (!leaderWhy(l, d)) return; cs(l).cohesion = Math.min(100, cs(l).cohesion + 8); C9.pressure(l, 3); closeCrisis(l, 'Bạn củng cố nhóm sau thay đổi.'); log('Nhóm hoạt động nền nếp hơn dưới sự dẫn dắt của bạn.', 'neutral'); } },
      { k: 'calm', l: 'Giảm quy mô để bớt bị chú ý', req: function (l, d) { return d.stage === 2 && isLeader(l); },
        run: function (l, r, log, d) { if (!leaderWhy(l, d)) return; C9.pressure(l, -8); state(l).territory.influence = Math.max(0, (state(l).territory.influence || 0) - 10); closeCrisis(l, 'Bạn thu nhỏ hoạt động sau thay đổi.'); log('Bạn thu nhỏ hoạt động; thu nhập và sức ép cùng giảm.', 'neutral'); } },
      { k: 'leave', l: 'Rời nhóm, tìm đường hợp pháp', ai: { moral: 1, w: 0.4 },
        run: function (l, r, log, d) { if (!leaderWhy(l, d)) return; closeCrisis(l, 'Bạn rời nhóm khi nhóm thay đổi người dẫn dắt.'); leaveCrew(l); E.quitCrime(l, log, 'Rời nhóm khi nhóm thay đổi người dẫn dắt.'); log('Bạn rời đi. Hồ sơ cũ và quan hệ cũ vẫn còn đó.', 'neutral'); } }
    ]
  });

  function splitWhy(l, d) { var g = group(l); return !!(d && g.splitPending === d.at && free(l) && E.isCrime(l) && !jailedNow(l)); }
  E.SC('crimeSplit912', {
    title: 'Nhóm đang tan rã',
    prep: function (l) { return { at: group(l).splitPending }; },
    valid: splitWhy,
    text: function (l) { var s = cs(l); return 'Mâu thuẫn ' + s.disputes + ' vụ, gắn kết chỉ còn ' + s.cohesion + '/100. Nhiều người không còn làm theo một hướng. ' + crew(l).length + ' người còn liên lạc với bạn; mỗi người có lý do và mức tin khác nhau.'; },
    opts: [
      { k: 'regroup', l: 'Giữ lại những người còn tin mình, làm nhỏ lại', ai: { w: 1 },
        run: function (l, r, log, d) { if (!splitWhy(l, d)) return; var g = group(l), s = cs(l), before = crew(l).length; leaveCrew(l, function (p) { return p.trust >= 50; }); s.cohesion = 45; s.disputes = 0; g.splitPending = null; g.splitAt = l.age; gnote(l, 'Nhóm tách ra; bạn giữ ' + crew(l).length + '/' + before + ' người.'); log('Bạn làm lại với ' + crew(l).length + ' người còn tin nhau. Ít người hơn, ít va chạm hơn.', 'neutral'); } },
      { k: 'join', l: 'Theo một nhóm khác', h: 'Mất một bậc uy tín, đổi người cầm đầu', ai: { amb: 1, w: 0.5 },
        run: function (l, r, log, d) { if (!splitWhy(l, d)) return; var g = group(l), s = cs(l), uw = l.flags.underworld || (l.flags.underworld = { linked: false, heat: 0, hunted: false }); leaveCrew(l, function (p) { return p.trust >= 70; }); l.job.rank = Math.max(0, (l.job.rank || 0) - 1); g.boss = npc(l, 'boss912'); s.cohesion = 40; s.disputes = 0; uw.heat = U.clamp((uw.heat || 0) + 10, 0, 100); g.splitPending = null; g.splitAt = l.age; g.dissolvedAt = l.age; gnote(l, 'Nhóm cũ tan rã; bạn theo nhóm của ' + g.boss.name + '.'); log('Nhóm cũ tan rã. Bạn bắt đầu lại dưới quyền ' + g.boss.name + ' và phải xây lại lòng tin.', 'neutral'); } },
      { k: 'lie_low', l: 'Tạm lặn một năm, chưa quyết', ai: { w: 0.8 },
        run: function (l, r, log, d) { if (!splitWhy(l, d)) return; var g = group(l); C9.pressure(l, -12); g.splitPending = null; g.splitAt = l.age - LEAD.splitCooldown + 1; gnote(l, 'Bạn tạm lặn khi nhóm rối ren.'); log('Bạn tạm tránh mặt. Nếu nhóm vẫn rối, chuyện này sẽ quay lại năm sau.', 'neutral'); } },
      { k: 'legit', l: 'Rời hẳn giới, tìm đường hợp pháp', ai: { moral: 1, w: 0.6 },
        run: function (l, r, log, d) { if (!splitWhy(l, d)) return; var g = group(l); g.splitPending = null; g.splitAt = l.age; g.dissolvedAt = l.age; leaveCrew(l); gnote(l, 'Nhóm tan rã; bạn rời giới.'); E.quitCrime(l, log, 'Rời giới khi nhóm tan rã.'); log('Nhóm tan rã và bạn rời đi. Hồ sơ cũ không tự biến mất.', 'neutral'); } }
    ]
  });

  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !l.flags.crime912) return;
    var g = group(l); if (g.yearAt === l.age) return;
    if (jailedNow(l)) { g.yearAt = l.age; if (g.boss) g.boss.trust = Math.max(0, g.boss.trust - 5); return; }
    if (!E.isCrime(l)) return; g.yearAt = l.age;
    if (!free(l)) return;
    ensureBoss(l);
    var queued = (l.pending || []).some(function (x) { return x.id === 'crimeLeader912' || x.id === 'crimeSplit912'; });
    if (queued) return;
    if (g.crisis && g.crisis.stage === 2 && g.crisis.at < l.age) { X.next(l, 'crimeLeader912', r, {}, { manual: false }); return; }
    if (g.crisis && g.crisis.stage === 1 && g.crisis.at < l.age) { closeCrisis(l, 'Biến động lãnh đạo tự lắng xuống khi bạn không lên tiếng.'); if (g.crisis === null && !isLeader(l) && g.boss) g.boss.trust = Math.max(0, g.boss.trust - 5); }
    var s = cs(l);
    if (!g.crisis && s.cohesion < LEAD.splitCohesion && s.disputes >= LEAD.splitDisputes && (g.splitAt == null || l.age - g.splitAt >= LEAD.splitCooldown)) { g.splitPending = l.age; X.next(l, 'crimeSplit912', r, {}, { manual: false }); return; }
    if (g.crisis || r() >= crisisChance(l)) return;
    var lead = isLeader(l), kind = lead ? 'challenge' : (s.pressure >= 40 && r() < 0.5 ? 'arrested' : r() < 0.4 ? 'retire' : 'rivalry');
    var cand = lead ? challenger(l) : npc(l, 'heir912');
    g.crisis = { id: l.id + ':crisis912:' + (++g.serial), kind: kind, stage: 1, at: l.age, cand: cand, oldBoss: g.boss ? g.boss.name : null };
    if (!lead && g.boss) gnote(l, g.boss.name + (kind === 'arrested' ? ' bị tạm giữ.' : kind === 'retire' ? ' muốn rút lui.' : ' mất uy tín trong nhóm.'));
    X.next(l, 'crimeLeader912', r, {}, { manual: false });
  });
  // Khoản đóng góp cho người dẫn dắt mới: trừ một lần trong thu nhập nghề của năm, không cộng dồn qua wrapper khác.
  var career1 = E.careerYear;
  E.careerYear = function (l) { var out = career1.apply(this, arguments), g = l.flags.crime912 && l.flags.crime912.group; if (!(out > 0) || !g || !g.boss || !g.boss.demand || !E.isCrime(l) || isLeader(l)) return out; return out * (1 - g.boss.demand); };

  // ---- §12 (8.10.17): hỗ trợ pháp lý trong trại, gắn với sổ án của từng vụ ----
  // Mô phỏng hư cấu: một đề nghị cho mỗi bản án, có kết quả sau ít nhất một năm, tối đa giảm một năm hoặc thêm điểm xét đặc xá; không bao giờ mãn hạn ngay.
  var LEGAL = { aid: 0.3, lawyer: 0.4, self: 0.15, perPoint: 0.04, cleanBonus: 0.1, longPenalty: 0.1, lawyerCost: 0.6, aidMoney: 2, pointsOnPartial: 2 };
  function currentSentence(l) { var s = state(l); for (var i = s.sentences.length - 1; i >= 0; i--) if (s.sentences[i].until === l.jailUntil) return s.sentences[i]; return s.sentences[s.sentences.length - 1] || null; }
  function legal(l) { var s = state(l); if (!s.legal || typeof s.legal !== 'object') s.legal = {}; return s.legal; }
  function legalCase(l) { var sen = currentSentence(l); return sen ? legal(l)[sen.id] || null : null; }
  function legalAsk(l) { var sen = currentSentence(l); return !!(jailedNow(l) && sen && !legal(l)[sen.id] && l.jailUntil - l.age >= 2); }
  function legalDue(l) { var c = legalCase(l); return !!(jailedNow(l) && c && c.status === 'review' && c.at < l.age); }
  function fileLegal(l, kind, log) {
    var sen = currentSentence(l); if (!sen || !legalAsk(l)) return;
    if (kind === 'lawyer') { var cost = l.base * LEGAL.lawyerCost; if (l.money < cost) return; H.cash(l, -cost, 'Phí luật sư trong thời gian thi hành án'); }
    legal(l)[sen.id] = { status: 'review', at: l.age, kind: kind, sentence: sen.id };
    log(kind === 'skip' ? 'Bạn chưa đề nghị hỗ trợ pháp lý lúc này.' : 'Hồ sơ đề nghị đã được chuyển đi. Kết quả xem xét cần ít nhất một năm và không bảo đảm có thay đổi.', 'neutral');
    if (kind === 'skip') legal(l)[sen.id].status = 'declined';
  }
  E.SC('tg_phap_ly912', {
    title: 'Hỗ trợ pháp lý trong thời gian thi hành án',
    valid: function (l) { return legalAsk(l); },
    text: function (l) { var sen = currentSentence(l); return 'Bản án ' + (sen ? sen.years + ' năm (' + sen.why + ')' : '') + ', còn ' + (l.jailUntil - l.age) + ' năm. Bạn có thể đề nghị rà soát việc tổng hợp án, điều kiện giảm án và hồ sơ xét đặc xá. Trợ giúp pháp lý của nhà nước dành cho người thuộc diện; thuê luật sư tốn tiền. Mỗi bản án chỉ đề nghị một lần.'; },
    opts: [
      { k: 'aid', l: 'Đề nghị trợ giúp pháp lý miễn phí', req: function (l) { return l.money < l.base * LEGAL.aidMoney; }, ai: { w: 1.3 }, run: function (l, r, log) { fileLegal(l, 'aid', log); } },
      { k: 'lawyer', l: function (l) { return 'Thuê luật sư rà soát hồ sơ · ' + H.money(l, l.base * LEGAL.lawyerCost); }, req: function (l) { return l.money >= l.base * LEGAL.lawyerCost; }, ai: { w: 1 }, run: function (l, r, log) { fileLegal(l, 'lawyer', log); } },
      { k: 'self', l: 'Tự tìm hiểu quy định và viết đơn', ai: { w: 0.7 }, run: function (l, r, log) { fileLegal(l, 'self', log); } },
      { k: 'skip', l: 'Chưa đề nghị lúc này', ai: { w: 0.4 }, run: function (l, r, log) { fileLegal(l, 'skip', log); } }
    ]
  });
  E.SC('tg_phap_ly912_kq', {
    title: 'Kết quả rà soát hồ sơ pháp lý',
    valid: function (l) { return legalDue(l); },
    text: function (l) { var c = legalCase(l); return 'Hồ sơ nộp ' + (l.age - (c ? c.at : l.age)) + ' năm trước theo hình thức ' + (c && c.kind === 'lawyer' ? 'thuê luật sư' : c && c.kind === 'aid' ? 'trợ giúp pháp lý' : 'tự viết đơn') + ' đã có phản hồi.'; },
    opts: [{ k: 'read', l: 'Nhận và đọc kết quả', run: function (l, r, log) {
      var c = legalCase(l), sen = currentSentence(l); if (!c || !legalDue(l)) return;
      var p = U.clamp((LEGAL[c.kind] || LEGAL.self) + (l.flags.jailPts || 0) * LEGAL.perPoint + ((l.record || 0) <= 1 ? LEGAL.cleanBonus : 0) - (sen && sen.years >= 10 ? LEGAL.longPenalty : 0), 0.05, 0.6), x = r();
      c.at = l.age;
      if (x < p && l.jailUntil - l.age > 1) { l.jailUntil--; c.status = 'reduced'; if (sen) sen.until = l.jailUntil; log('Hồ sơ được chấp nhận một phần: thời hạn chấp hành giảm một năm, mãn hạn năm ' + (l.birthYear + l.jailUntil) + '.', 'good'); }
      else if (x < p * 2) { c.status = 'eligible'; l.flags.jailPts = (l.flags.jailPts || 0) + LEGAL.pointsOnPartial; log('Không có thay đổi ngay, nhưng hồ sơ được ghi nhận đủ điều kiện xem xét ở đợt đặc xá/giảm án tới.', 'neutral'); }
      else { c.status = 'rejected'; log('Không đủ căn cứ thay đổi bản án. Bản rà soát vẫn giúp bạn hiểu rõ các mốc của mình.', 'neutral'); }
    } }]
  });
  var jailYear0 = E.jailYear;
  E.jailYear = function (l, r) {
    var base = jailYear0.apply(this, arguments) || [];
    if (!l.flags.crime912) return base;
    var id = legalDue(l) ? 'tg_phap_ly912_kq' : legalAsk(l) && r() < 0.35 ? 'tg_phap_ly912' : null;
    if (id && !base.some(function (x) { return x[0] === id; })) { if (base.length >= 3) base.pop(); base.unshift([id]); }
    return base;
  };

  var migrate = E.migrateExt;
  E.migrateExt = function (l) { if (migrate) migrate(l); if (l && l.flags && l.flags.crime912 != null) { if (typeof l.flags.crime912 !== 'object') delete l.flags.crime912; else state(l); } };
  E.CRIME912 = { BAL: BAL, ROLES: ROLES, state: state, crew: crew, ensure: ensure, power: power, hires: hires, riskReport: riskReport, maxCrew: maxCrew, cutTotal: cutTotal,
    LEAD: LEAD, LEGAL: LEGAL, group: group, isLeader: isLeader, ensureBoss: ensureBoss, crisisChance: crisisChance, currentSentence: currentSentence, legal: legal, legalAsk: legalAsk, legalDue: legalDue };
})(globalThis.G);
