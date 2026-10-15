/* Một Đời — v2.7: người yêu / bạn đời có nghề nghiệp & thu nhập (quen lâu mới biết lương), ai trả tiền khi hẹn hò,
   bố mẹ khá giả chu cấp tiền sinh hoạt cho con. */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H;
  function pick(r, a) { return U.pick(r, a); }
  function mo(l, v) { return H.money(l, v); }

  // ===================================================================
  // 1. NGHỀ NGHIỆP & THU NHẬP CỦA NGƯỜI YÊU / BẠN ĐỜI
  // ===================================================================
  function partnerJob(l, p, r) {
    if (p.age < 22 && r() < 0.65) { p.job = 'sinh viên'; p.jobId = null; p.inc = 0; return p; }
    if (p.age >= 62) { p.job = 'đã nghỉ hưu'; p.jobId = null; p.inc = l.base / 12 * (0.2 + r() * 0.3); return p; }
    var cands = Object.keys(E.CAR).map(function (k) { return E.CAR[k]; }).filter(function (c) { return !c.hidden && !c.fame && c.sec !== 'crime' && !c.skillRank && !(c.vnOnly && !H.isVN(l)); });
    var c = U.wpick(r, cands, function (c) { var w = c.w || 1; if (c.sex) w *= p.sex === 'M' ? c.sex[0] : c.sex[1]; if (c.edu >= 5) w *= 1.3; if (c.rural && l.urban) w *= 0.3; return w; });
    var rk = Math.max(0, Math.min(c.t.length - 1, Math.floor((p.age - 22) / 6 + r() * 1.2)));
    p.jobId = c.id; p.job = c.t[rk];
    p.inc = Math.max(0, E.monthlyEst(l, c.id, rk) * Math.exp(U.normal(r) * 0.25));
    return p;
  }
  function incKnown(l, p) { return !!(p && (p.incKnown || p.status === 'married' || p.status === 'cohabit')); }
  H.partnerJob = partnerJob; H.partnerIncKnown = incKnown;

  // người mới quen: hiện cả nghề nghiệp
  var love = E.DEC.love, mk = love.make, ap = love.apply;
  love.make = function (life, r, arg) {
    var d = mk.call(this, life, r, arg), p = d.data.p;
    partnerJob(life, p, r);
    d.text = d.text.replace(/\.$/, '') + ', ' + (p.job === 'sinh viên' ? 'đang là sinh viên' : p.job === 'đã nghỉ hưu' ? 'đã nghỉ hưu' : 'đang làm ' + p.job) + '.';
    return d;
  };
  love.apply = function (life, d, k, r, log) {
    ap.call(this, life, d, k, r, log);
    var p = d.data.p, q = life.partner;
    if (q && q.name === p.name) { q.job = p.job; q.jobId = p.jobId; q.inc = p.inc; q.incKnown = false; }
  };

  function partnerYear(l, r, log, a) {
    var p = l.partner; if (!p || !p.alive) return;
    if (p.job == null) partnerJob(l, p, r);
    // quen đủ lâu mới biết người ấy kiếm bao nhiêu
    if (!p.incKnown && (a - p.since >= 2 || p.status !== 'dating')) {
      p.incKnown = true;
      if (p.inc > 0 && p.status === 'dating') log('Quen nhau lâu, bạn mới biết ' + p.name + ' kiếm khoảng ' + mo(l, p.inc) + '/tháng' + (p.inc > (l.income || 0) / 12 * 2 && l.income > 0 ? ' — gấp mấy lần bạn.' : '.'), 'neutral');
    }
    // sinh viên ra trường đi làm; đi làm lâu thì lên lương; đến tuổi thì nghỉ hưu
    if (p.job === 'sinh viên' && p.age >= 22) { partnerJob(l, p, r); if (p.job !== 'sinh viên') log(p.name + ' ra trường, bắt đầu đi làm ' + p.job + '.', 'neutral'); }
    else if (p.jobId && p.age >= 62 && p.job !== 'đã nghỉ hưu') { p.job = 'đã nghỉ hưu'; p.inc *= 0.5; p.jobId = null; }
    else if (p.jobId && p.inc > 0 && p.age < 55) {
      var c = E.CAR[p.jobId], rk = c ? c.t.indexOf(p.job) : -1;
      if (c && rk >= 0 && rk < c.t.length - 1 && r() < 0.08) { p.job = c.t[rk + 1]; p.inc = Math.max(p.inc * 1.15, E.monthlyEst(l, c.id, rk + 1)); if (p.incKnown && r() < 0.6) log(p.name + ' được thăng chức lên ' + p.job + '.', 'good'); }
      else p.inc *= 1.01;
    }
  }

  // ===================================================================
  // 2. AI TRẢ TIỀN BUỔI HẸN
  // nữ hẹn hò với nam: phần lớn bạn nam trả · nam: thường tự trả, đôi khi được người yêu "bao" · cùng giới: chia đôi
  // ===================================================================
  H.datePay = function (l, r, cost, why) {
    var p = l.partner, nm = p ? p.name : 'người ấy', richer = p && p.inc > 0 && l.income > 0 && p.inc * 12 > l.income * 1.5;
    if (!p) { H.cash(l, -cost * l.base, why); return ''; }
    if (l.sex === 'F' && p.sex === 'M') {
      if (r() < 0.8) return ' ' + nm + ' giành trả tiền.';
      if (r() < 0.6) { H.cash(l, -cost * l.base / 2, why); return ' Hai người chia đôi tiền.'; }
      H.cash(l, -cost * l.base, why); return ' Lần này bạn mời.';
    }
    if (l.sex === 'M' && p.sex === 'F') {
      if (r() < (richer ? 0.45 : 0.15)) return ' ' + nm + ' nhất quyết trả tiền: "Để em bao anh hôm nay."';
      if (r() < 0.15) { H.cash(l, -cost * l.base / 2, why); return ' Hai người chia đôi tiền.'; }
      H.cash(l, -cost * l.base, why); return '';
    }
    if (richer && r() < 0.5) return ' ' + nm + ' trả tiền.';
    H.cash(l, -cost * l.base / 2, why); return ' Hai người chia đôi tiền.';
  };

  // ===================================================================
  // 3. BỐ MẸ KHÁ GIẢ CHU CẤP TIỀN SINH HOẠT
  // ===================================================================
  function allowanceYear(l, r, log, a) {
    var f = l.fam; if (!f || a < 15 || a > 26) return;
    if (f.elite && l.flags.eliteFollow && !l.flags.eliteCut) return; // đã có khoản chu cấp riêng của gia đình siêu giàu
    if (!(f.mAlive || f.fAlive) || l.jailUntil != null && a < l.jailUntil) return;
    var pm = (f.mAlive ? f.mInc || 0 : 0) + (f.fAlive ? f.fInc || 0 : 0); // thu nhập bố mẹ mỗi tháng
    var share = f.q >= 5 ? 0.12 : f.q === 4 ? 0.06 : f.q === 3 ? 0.02 : 0;
    if (!share) return;
    var studying = !!l.school, working = !!l.job && l.indep;
    // v3.0: còn ở nhà với bố mẹ (chưa xa nhà) thì chỉ là tiền tiêu vặt — ăn ở đã có bố mẹ lo; đi học xa / ra ở riêng mới là tiền sinh hoạt
    var away = !!(l.cityStudent || (l.abroad && l.abroad.study) || l.movedTo || l.indep);
    var k = !away ? (studying ? 0.12 : 0.1) : studying ? 1 : working ? (a <= 23 ? 0.5 : 0.25) : 0.7;
    var amt = pm * 12 * share * k;
    if (amt < l.base * 0.03) return;
    var pw = f.mAlive && f.fAlive ? 'Bố mẹ' : f.mAlive ? 'Mẹ' : 'Bố';
    H.cash(l, amt, away ? 'Bố mẹ chu cấp' : 'Tiền tiêu vặt bố mẹ cho');
    if (!away && !l.flags.pocketNoted) { l.flags.pocketNoted = true; log(pw + ' cho tiền tiêu vặt hằng tháng, khoảng ' + mo(l, amt / 12) + '/tháng — đủ ăn sáng, mua sách vở, thỉnh thoảng đi chơi với bạn.', 'good'); }
    if (away && !l.flags.allowNoted) { l.flags.allowNoted = true; log(pw + ' gửi tiền sinh hoạt đều đặn mỗi tháng' + (l.cityStudent ? ' lên ' + l.cityStudent.city : l.abroad && l.abroad.study ? ' sang ' + l.abroad.name : '') + ', khoảng ' + mo(l, amt / 12) + '/tháng — ' + (studying ? '"con cứ lo học, tiền nong để bố mẹ".' : working ? '"mới đi làm lương còn thấp, bố mẹ đỡ thêm".' : '"trong lúc con chưa tìm được việc, bố mẹ lo cho".'), 'good'); }
  }

  E.HOOKS.year.push(function (l, r, log, a) { partnerYear(l, r, log, a); allowanceYear(l, r, log, a); });
  E.family = { partnerJob: partnerJob, partnerYear: partnerYear, allowanceYear: allowanceYear };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
