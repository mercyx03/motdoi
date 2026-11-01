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

  var migrate = E.migrateExt;
  E.migrateExt = function (l) { if (migrate) migrate(l); if (l && l.flags && l.flags.crime912 != null) { if (typeof l.flags.crime912 !== 'object') delete l.flags.crime912; else state(l); } };
  E.CRIME912 = { BAL: BAL, ROLES: ROLES, state: state, crew: crew, ensure: ensure, power: power, hires: hires, riskReport: riskReport, maxCrew: maxCrew, cutTotal: cutTotal };
})(globalThis.G);
