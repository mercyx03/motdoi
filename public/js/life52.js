/* v4.5.8 — chế độ hưu trí theo nghề, hợp đồng thi đấu theo thành tích (mô phỏng). */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U;
  E.pensionPolicy = function (l, c) {
    c = c || E.jobDef(l); if (!c || !l.job) return { covered: false, reason: 'Chưa có công việc' };
    if (c.sec === 'crime' || c.cat === 'crime') return { covered: false, reason: 'Nghề phi pháp không có chế độ hưu trí' };
    if (c.cat === 'free' || c.cat === 'creator' || c.fame) return { covered: false, reason: 'Hoạt động tự do: không tự động đóng bảo hiểm hưu trí' };
    if (/^(an_xin|ve_so|ve_chai|ban_rong|xe_om|tx_cn|phu_giup|nong|ngu_dan|xkld|dau_tu_es|pt_gym)$/.test(c.id) || c.sec === 'farm') return { covered: false, reason: 'Nghề tự doanh hoặc thu nhập không theo hợp đồng lao động' };
    var title = c.t[Math.min(l.job.rank || 0, c.t.length - 1)] || '';
    if (c.owner || c.cat === 'biz' || c.sec !== 'formal' && (l.job.fam || /^(chủ|cai thầu|giám đốc công ty|nhà đầu tư)/.test(title))) return { covered: false, reason: 'Chủ cơ sở / kinh doanh riêng: không tự động đóng bảo hiểm hưu trí' };
    return { covered: true, reason: 'Công việc theo hợp đồng, tự động tích lũy năm đóng bảo hiểm để nhận lương hưu' };
  };
  E.pensionCovered = function (l, c) { return E.pensionPolicy(l, c).covered; };
  E.finalizePension = function (l, log, recalc) {
    if (l.pensioned && !recalc) return false;
    var si = l.si, years = si && si.yrs || 0;
    if (years < 15 || !si || !(si.sum > 0)) return false;
    var rate = l.sex === 'M' ? years < 20 ? .4 + (years - 15) * .01 : .45 + (years - 20) * .02 : .45 + (years - 15) * .02;
    l.pensionRate = U.clamp(rate, .4, .75); l.pensionInc = si.sum / years * l.pensionRate;
    l.pensioned = true;
    if (log) log('Đủ ' + years + ' năm đóng bảo hiểm, bắt đầu hưởng lương hưu ' + H.money(l, l.pensionInc / 12) + '/tháng theo mức lương đóng bình quân.', 'good');
    return true;
  };
  function pensionAge(l) { return H.inVN(l) ? l.sex === 'M' ? 62 : 60 : 65; }
  var cy = E.careerYear;
  E.careerYear = function (l, r, log) {
    var had = !!l.pensioned, siAtStart = l.si && l.si.yrs || 0;
    if (!had && l.age >= pensionAge(l) && siAtStart >= 15) {
      E.finalizePension(l, log); had = !!l.pensioned;
      if (l.pensioned && !l.job) { l.retired = true; l.flags.fullRetire = true; }
    }
    var income = cy.apply(this, arguments);
    // Tính cả năm đóng cuối cùng, không dùng toàn bộ số năm lao động thay số năm đóng.
    if (!had && l.alive && (l.retired || l.age >= pensionAge(l))) E.finalizePension(l, log, true);
    return income;
  };
  var offer = E.offerHint;
  E.offerHint = function (l, id) {
    var hint = offer.apply(this, arguments), c = E.CAR[E.resolveJob(id)]; if (!c) return hint;
    var fake = Object.assign({}, l, { job: { id: id, rank: E.startRank(l, c) } });
    if (c && !E.pensionCovered(fake, c)) hint += ' · không tự động tích lũy lương hưu';
    return hint;
  };
  function athlete(l) { return l.job && /^(vdv|tuyen_thu_es|ky_thu)$/.test(E.resolveJob(l.job.id)); }
  function discipline(l) { return E.resolveJob(l.job.id) === 'vdv' ? l.talentSub || 'thể thao' : E.resolveJob(l.job.id) === 'tuyen_thu_es' ? l.game || 'esports' : l.talentSub || 'cờ'; }
  E.recordSportResult = function (l, tier, result, key) {
    if (!athlete(l)) return;
    var records = l.flags.sportResults || (l.flags.sportResults = []), career = E.resolveJob(l.job.id), sport = discipline(l), year = l.birthYear + l.age;
    if (records.some(function (x) { return x.key === key && x.y === year && x.career === career && x.sport === sport; })) return;
    records.push({ career: career, sport: sport, tier: tier, result: result, key: key, y: year });
  };
  var safeMatch = E.DEC.tt_tran_lon.def.opts.filter(function (o) { return o.k === 'safe'; })[0];
  safeMatch.run = function (l, r, log) { var won = r() < .35; log(won ? 'Thắng nhẹ nhàng nhờ đồng đội tỏa sáng.' : 'Thua trận, bị huấn luyện viên phê bình thiếu quyết tâm.', 'neutral'); if (won) E.recordSportResult(l, 'national', 'win', 'big-match'); };
  E.sportPerformance = function (l) {
    if (!athlete(l)) return { points: 0, multiplier: 1, rank: 0 };
    var career = E.resolveJob(l.job.id), sport = discipline(l), year = l.birthYear + l.age, points = 0, seen = {};
    function add(key, tier, result, y) {
      if (seen[key] || y > year) return; seen[key] = true;
      var weight = { national: 5, regional: 12, world: 28, olympic: 45 }[tier] || 5;
      var placing = { vàng: 1, bạc: .6, đồng: .35, win: 1, record: .8 }[result] || 0;
      points += weight * placing * (year - y <= 3 ? 1 : .3);
    }
    (l.medals || []).forEach(function (m) {
      if (m.career && m.career !== career || m.sport && m.sport !== sport) return;
      if (!m.career && !m.sport && !(career === 'vdv' && (String(m.ev).includes('(' + sport + ')') || sport === 'bóng đá' && /ASEAN Cup/.test(m.ev)))) return;
      var tier = /Olympic|Thế vận hội/i.test(m.ev) ? 'olympic' : /thế giới|World|chung kết thế giới|Chung kết thế giới/i.test(m.ev) ? 'world' : /SEA Games|ASIAD|ASEAN|châu Á/i.test(m.ev) ? 'regional' : 'national';
      add('medal:' + m.ev + ':' + m.y + ':' + m.m, tier, m.m, m.y);
    });
    (l.flags.sportResults || []).forEach(function (x) { if (x.career === career && x.sport === sport) add('result:' + x.key + ':' + x.y, x.tier, x.result, x.y); });
    return { points: points, multiplier: 1 + Math.min(2.5, points * .025), rank: points >= 65 ? 3 : points >= 25 ? 2 : points >= 5 ? 1 : 0 };
  };
  var sportPay = E.sportPay;
  E.sportPromote = function (l, log) {
    if (!athlete(l)) return;
    var perf = E.sportPerformance(l), c = E.jobDef(l), rank = Math.min(perf.rank, c.t.length - 1);
    if (rank > l.job.rank) { l.job.rank = rank; log('Thành tích thi đấu giúp lên bậc: ' + E.jobTitle(l) + '.', 'good'); }
  };
  E.athletePay = function (l, rank) {
    var perf = E.sportPerformance(l), j = l.job, key = E.resolveJob(j.id) + ':' + discipline(l);
    if (j.sportKey !== key) { j.sportKey = key; j.sportContract = 1; j.sportPrevSalary = null; j.sportPaidFactor = 1; }
    j.sportContract = Math.max(j.sportContract || 1, perf.multiplier);
    return (E.resolveJob(j.id) === 'vdv' ? sportPay(l, rank) : 1) * j.sportContract;
  };
  var monthly = E.monthlyEst;
  E.monthlyEst = function (l, id, rank) {
    var base = monthly.apply(this, arguments), resolved = E.resolveJob(id);
    if (!/^(vdv|tuyen_thu_es|ky_thu)$/.test(resolved)) return base;
    var job = l.job && E.resolveJob(l.job.id) === resolved ? Object.assign({}, l.job) : { id: resolved, rank: rank || 0 };
    var fake = Object.assign({}, l, { job: job });
    return base * E.athletePay(fake, rank || 0);
  };
  E.sportSalary = function (l, income, log) {
    var j = l.job, factor = j.sportContract || 1, old = j.sportPaidFactor || 1;
    if (factor > old + .001) {
      if (j.sportPrevSalary > 0) income = Math.max(income, j.sportPrevSalary * factor / old);
      log('Thành tích thi đấu giúp thương lượng hợp đồng mới: hệ số lương thành tích ×' + factor.toFixed(2) + ' (trước ×' + old.toFixed(2) + '). Tiền thưởng giải được tính riêng.', 'good');
    }
    j.sportPaidFactor = factor; j.sportPrevSalary = income;
    return income;
  };
  var profile = E.profile;
  E.profile = function (l) {
    var p = profile(l);
    if (l.job) { var policy = E.pensionPolicy(l); p.jobInfo.push(policy.reason); if (policy.covered && !p.si) p.si = { yrs: 0, pension: null }; }
    if (athlete(l)) { var v = E.sportPerformance(l); p.jobInfo.push('Điểm thành tích: ' + v.points.toFixed(1) + ' · hệ số hợp đồng thành tích ×' + (l.job.sportContract || v.multiplier).toFixed(2)); }
    return p;
  };
})(globalThis.G);
