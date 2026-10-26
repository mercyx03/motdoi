/* Một Đời — v6.3.0:
   · quay lại với người yêu cũ / vợ cũ / chồng cũ (có con chung thì dễ gặp lại hơn)
   · người giàu có thể chủ động chu cấp cho người yêu, hoặc tìm một mối quan hệ mình là người chu cấp
   · tiến độ thăng chức: số năm còn thiếu, cơ hội mỗi năm và lý do; khi được thăng chức nhật ký ghi rõ vì sao */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function fx(l, o) { H.fx(l, o); }
  function stress(l, d) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + d, 0, 100); }
  function vnd(l) { return isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  function V(l, tr) { return vnd(l) ? tr : tr / 90 * l.base; }
  function mo(l, v) { return H.money(l, v); }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function A(id, g, label, o) { var x = { id: id, g: g, l: label }; for (var k in o) x[k] = o[k]; E.ACT.push(x); }
  function T(id, when, p, cd, max) { E.TRIG.push({ id: id, when: function (l, a) { return free(l) && when(l, a); }, p: p, cd: cd || 4, max: max || 3 }); }

  // ===================================================================
  // 1. NGƯỜI CŨ: ghi nhớ và có thể quay lại
  // ===================================================================
  function exes(l) { return l.flags.exList || (l.flags.exList = []); }
  function exWord(l, x) { return x.married ? (x.sex === l.sex ? 'người bạn đời cũ' : x.sex === 'M' ? 'chồng cũ' : 'vợ cũ') : 'người yêu cũ'; }
  function sharedKids(l, x) { return (l.kids || []).filter(function (k) { return k.alive !== false && (k.otherParent === x.name || (x.since != null && k.born >= x.since && k.born <= (x.until != null ? x.until : l.age) && !k.adopted)); }); }
  E.HOOKS.year.unshift(function (l, r, log, a) {
    if (!l.alive) return;
    var p = l.partner, prev = l.flags.lastP;
    if (prev && (!p || p.name !== prev.name)) {
      var widowed = p && p.name === prev.name && p.alive === false;
      if (!widowed && !prev.dead && !(E.isDeadPartner && E.isDeadPartner(l, prev))) { /* v7.2: người đã mất không thành "người cũ" */ var L = exes(l); if (!L.some(function (x) { return x.name === prev.name && (!x.uid || !prev.uid || x.uid === prev.uid); })) L.push({ name: prev.name, sex: prev.sex, d: prev.d, married: prev.married, since: prev.since, until: a, inc: prev.inc, job: prev.job, uid: prev.uid }); if (L.length > 6) L.shift(); }
    }
    l.flags.lastP = p && p.alive !== false ? { name: p.name, sex: p.sex, d: (p.age || a) - a, married: p.status === 'married', since: p.since, inc: p.inc, job: p.job, uid: p.uid110 } : null;
    if (p && p.alive === false && prev) prev.dead = true;
  });
  function candidates(l) { if (l.partner || l.age < 18) return []; return exes(l).filter(function (x) { return !x.closed && !x.dead && !(E.isDeadPartner && E.isDeadPartner(l, x)) && l.age - (x.until || l.age) >= 1 && l.age + (x.d || 0) <= 85; }); }
  SC('quay_lai_cu', {
    title: function (l, d) { return 'Gặp lại ' + d.word; },
    prep: function (l, r) { var C = candidates(l); C.sort(function (a, b) { return sharedKids(l, b).length - sharedKids(l, a).length; }); var x = C.length ? (sharedKids(l, C[0]).length && r() < 0.7 ? C[0] : U.pick(r, C)) : null; return x ? { n: x.name, word: exWord(l, x), kids: sharedKids(l, x).map(function (k) { return k.name; }) } : {}; },
    valid: function (l, d) { return candidates(l).some(function (x) { return !d || !d.n || x.name === d.n; }); },
    text: function (l, d) { var x = exes(l).filter(function (e) { return e.name === d.n; })[0], y = x ? l.age - x.until : 0; return (d.kids.length ? 'Mỗi lần đưa đón con (' + d.kids.join(', ') + '), bạn lại gặp ' + d.n + ' — ' + d.word + '. ' : 'Sau ' + y + ' năm, ' + d.n + ' — ' + d.word + ' — bất ngờ nhắn tin hỏi thăm. ') + 'Hai người nói chuyện lâu hơn mọi lần, những chuyện cũ tưởng đã quên lại hiện về.'; },
    opts: [
      { k: 'quay_lai', l: 'Cho nhau thêm một cơ hội', ai: { w: 0.8 }, run: function (l, r, log, d) {
        var x = exes(l).filter(function (e) { return e.name === d.n; })[0]; if (!x || l.partner) return;
        var p = 0.45 + (d.kids.length ? 0.2 : 0) - (l.age - x.until > 10 ? 0.15 : 0);
        if (r() < p) { var np = { name: x.name, sex: x.sex, age: l.age + (x.d || 0), status: 'dating', since: l.age, alive: true, inc: x.inc, job: x.job, reunited: true }; if (H.partnerJob && !np.job) H.partnerJob(l, np, r); l.partner = np; x.closed = true; fx(l, { hap: 8 }); log('Bạn và ' + x.name + ' quyết định quay lại với nhau. ' + (d.kids.length ? 'Các con vui nhất nhà khi thấy bố mẹ lại đi chung.' : 'Lần này cả hai đều trưởng thành hơn.') + (x.married ? ' Hai người tính chuyện tái hôn khi mọi thứ ổn định.' : ''), 'big'); H.mem(l, 'Ngày quay lại với ' + x.name + '.', 4); }
        else { x.closed = true; fx(l, { hap: -3 }); log('Gặp lại vài lần, bạn và ' + x.name + ' nhận ra mọi thứ đã khác. Hai người chúc nhau bình yên.', 'neutral'); }
      } },
      { k: 'ban', l: function (l, d) { return d.kids.length ? 'Chỉ làm bạn, cùng nhau chăm con' : 'Chỉ làm bạn, hỏi thăm nhau'; }, ai: { w: 1 }, run: function (l, r, log, d) { (l.kids || []).forEach(function (k) { if (d.kids.indexOf(k.name) >= 0) k.close = U.clamp((k.close || 50) + 4, 0, 100); }); fx(l, { hap: 2 }); log(d.kids.length ? 'Bạn và ' + d.n + ' giữ quan hệ bạn bè, cùng đi họp phụ huynh, cùng tổ chức sinh nhật cho con.' : 'Bạn và ' + d.n + ' thỉnh thoảng hỏi thăm nhau như những người bạn cũ.', 'neutral'); } },
      { k: 'khep', l: 'Khép lại quá khứ', ai: { w: 0.7 }, run: function (l, r, log, d) { var x = exes(l).filter(function (e) { return e.name === d.n; })[0]; if (x) x.closed = true; log('Bạn cảm ơn ' + d.n + ' vì những ngày đã qua, rồi khép lại câu chuyện cũ.', 'neutral'); } }
    ]
  });
  T('quay_lai_cu', function (l) { return candidates(l).length > 0; }, 0.08, 4, 3);
  A('lien_lac_nguoi_cu', 'Tình cảm', 'Liên lạc lại với người cũ', { min: 18, sc: 'quay_lai_cu', avail: function (l) { return l.partner ? 'Đang có người yêu / bạn đời' : candidates(l).length ? true : 'Chưa có người cũ để liên lạc'; }, ai: { w: 0.02 } });

  // ===================================================================
  // 2. NGƯỜI GIÀU CHỦ ĐỘNG CHU CẤP
  // ===================================================================
  function rich(l) { return l.indep && l.age >= 25 && (l.money >= l.base * 40 || (l.income || 0) >= l.base * 4); }
  function giving(l) { var g = l.flags.giveSup; return g && l.partner && l.partner.name === g.name && l.partner.alive !== false ? g : null; }
  var LEVEL = [['it', 'Gửi một khoản nhỏ mỗi tháng', 10], ['vua', 'Lo tiền nhà, tiền sinh hoạt', 30], ['nhieu', 'Bao trọn chi tiêu, quà cáp', 80]];
  function startGive(l, log, k) { var x = LEVEL.filter(function (y) { return y[0] === k; })[0]; l.flags.giveSup = { name: l.partner.name, monthly: V(l, x[2]), since: l.age }; l.partner.close = U.clamp((l.partner.close || 60) + 6, 0, 100); log('Bạn bắt đầu chu cấp cho ' + l.partner.name + ' khoảng ' + mo(l, V(l, x[2])) + '/tháng.', 'neutral'); }
  SC('chu_cap_nguoi_yeu', {
    title: 'Chu cấp cho người yêu', valid: function (l) { return rich(l) && !!l.partner && l.partner.alive !== false && !giving(l); },
    text: function (l) { var p = l.partner; return p.name + ' thu nhập ' + (p.inc ? 'khoảng ' + mo(l, p.inc) + '/tháng' : 'không nhiều') + ', còn bạn dư dả. Bạn muốn chủ động lo cho người ấy?'; },
    opts: LEVEL.map(function (x) { return { k: x[0], l: x[1], h: function (l) { return 'Khoảng ' + mo(l, V(l, x[2])) + '/tháng'; }, ai: { w: x[0] === 'vua' ? 1 : 0.6 }, run: function (l, r, log) { startGive(l, log, x[0]); } }; })
      .concat([{ k: 'khong', l: 'Không, mỗi người tự lo tài chính', ai: { w: 1 }, run: function (l, r, log) { log('Hai người vẫn tự lo tài chính riêng, thỉnh thoảng bạn mời đi ăn, tặng quà.', 'neutral'); } }])
  });
  SC('tim_nguoi_cham_lo', {
    title: 'Một mối quan hệ do bạn chu cấp', valid: function (l) { return rich(l) && !l.partner && l.age >= 30; },
    prep: function (l, r) { var s = H.partnerSex(l, r); return { n: H.stranger(l, r, s), s: s, age: Math.max(20, l.age - U.randint(r, 6, 18)) }; },
    text: function (l, d) { return 'Qua một buổi tiệc, bạn quen ' + d.n + ' (' + d.age + ' tuổi), đang chật vật với tiền thuê nhà. Bạn bè nói người như bạn chỉ cần "lo cho người ta" là có người bên cạnh.'; },
    opts: [
      { k: 'cham_lo', l: 'Tìm hiểu và chủ động lo chi tiêu cho người ấy', h: function (l) { return 'Khoảng ' + mo(l, V(l, 30)) + '/tháng'; }, ai: { w: 0.5 }, run: function (l, r, log, d) { l.partner = { name: d.n, sex: d.s, age: d.age, status: 'dating', since: l.age, alive: true, sponsored: true }; if (H.partnerJob) H.partnerJob(l, l.partner, r); l.flags.everDated = true; startGive(l, log, 'vua'); fx(l, { hap: 4 }); } },
      { k: 'ban', l: 'Chỉ làm bạn, giúp người ấy tìm việc', ai: { w: 1, karma: 1 }, run: function (l, r, log, d) { fx(l, { karma: 3 }); log('Bạn giới thiệu cho ' + d.n + ' một công việc ổn định, không ràng buộc gì.', 'good'); } },
      { k: 'khong', l: 'Không, muốn tình cảm thật lòng', ai: { w: 1 }, run: function (l, r, log) { log('Bạn muốn một mối quan hệ không dính đến tiền bạc.', 'neutral'); } }
    ]
  });
  T('chu_cap_nguoi_yeu', function (l) { return rich(l) && !!l.partner && l.partner.status === 'dating' && !giving(l) && (l.partner.inc || 0) * 12 < (l.income || 0) / 3; }, 0.12, 5, 2);
  T('tim_nguoi_cham_lo', function (l) { return rich(l) && !l.partner && l.age >= 30 && l.age <= 65; }, 0.04, 6, 2);
  A('chu_cap', 'Tình cảm', 'Chu cấp cho người yêu / bạn đời', { min: 25, sc: 'chu_cap_nguoi_yeu', avail: function (l) { return !rich(l) ? 'Cần dư dả tài chính' : !l.partner ? 'Chưa có người yêu / bạn đời' : giving(l) ? 'Đang chu cấp ' + mo(l, giving(l).monthly) + '/tháng' : true; }, ai: { w: 0.02 } });
  SC('chu_cap_dung', {
    title: 'Khoản chu cấp', valid: function (l) { return !!giving(l); },
    text: function (l) { var g = giving(l); return 'Bạn đang chu cấp cho ' + g.name + ' khoảng ' + mo(l, g.monthly) + '/tháng.'; },
    opts: [{ k: 'giu', l: 'Tiếp tục như cũ', ai: { w: 1 }, run: function () { } }, { k: 'dung', l: 'Dừng chu cấp, mỗi người tự lo', ai: { w: 0.3 }, run: function (l, r, log) { var g = giving(l); l.flags.giveSup = null; log('Bạn nói chuyện thẳng thắn với ' + g.name + ' và dừng khoản chu cấp.', 'neutral'); if (r() < 0.3 && l.partner) { var n = l.partner.name; l.partner = null; l.exes = (l.exes || 0) + 1; log(n + ' không chấp nhận, hai người chia tay.', 'bad'); } } }]
  });
  A('chu_cap_dung', 'Tình cảm', 'Xem / dừng khoản chu cấp', { min: 25, sc: 'chu_cap_dung', avail: function (l) { return giving(l) ? true : 'Không áp dụng'; }, ai: { w: 0.01 } });
  E.HOOKS.year.unshift(function (l, r, log, a) {
    var g = giving(l); if (!g) { if (l.flags.giveSup && !(l.partner && l.partner.name === l.flags.giveSup.name)) l.flags.giveSup = null; return; }
    if (g.paidAt === a || !free(l)) return; g.paidAt = a;
    var y = g.monthly * 12;
    if (!rich(l) || l.money < y) { l.flags.giveSup = null; log('Tài chính không còn dư dả như trước, bạn nói thật với ' + g.name + ' và dừng khoản chu cấp.', 'neutral'); if (r() < 0.4 && l.partner) { var nn = l.partner.name; l.partner = null; l.exes = (l.exes || 0) + 1; log(nn + ' không chấp nhận, hai người chia tay.', 'bad'); } return; }
    H.cash(l, -y, 'Chu cấp cho ' + g.name); g.base0 = g.base0 || g.monthly;
    var x = r();
    if (x < 0.1 && g.monthly < g.base0 * 2) { g.monthly = Math.min(g.base0 * 2, g.monthly * 1.4); stress(l, 4); log(g.name + ' bắt đầu đòi hỏi nhiều hơn: túi hiệu, chuyến du lịch, căn hộ riêng. Khoản chu cấp tăng lên ' + mo(l, g.monthly) + '/tháng.', 'neutral'); }
    else if (x < 0.15 && l.partner) { var n = l.partner.name; l.partner = null; l.flags.giveSup = null; l.exes = (l.exes || 0) + 1; fx(l, { hap: -8 }); log('Bạn phát hiện ' + n + ' vừa nhận tiền của bạn vừa qua lại với người khác. Hai người chia tay.', 'bad'); H.mem(l, 'Ngày nhận ra ' + n + ' chỉ yêu tiền của mình.', 3); }
    else if (a - g.since === 1) log('Một năm lo cho ' + g.name + ' (' + mo(l, y) + '). Người ấy chăm sóc bạn chu đáo, nhưng đôi lúc bạn tự hỏi đâu là tình cảm thật.', 'neutral');
  });

  // ===================================================================
  // 3. TIẾN ĐỘ THĂNG CHỨC
  // ===================================================================
  E.promoProgress = function (l) {
    if (!l.job || l.retired) return null;
    var c = E.jobDef(l); if (!c || c.fame || c.skillRank != null || !c.t || c.t.length < 2) return null;
    if (E.isFreelanceJob && E.isFreelanceJob(l)) return null;
    var rk = l.job.rank || 0; if (rk >= c.t.length - 1) return { top: true, title: c.t[rk] };
    var need = (c.yrs && c.yrs[rk]) || 3, done = Math.min(need, l.job.yrs || 0), focus = l.focus;
    var pp = c.ladder ? (rk >= 7 ? 0.04 + (l.st.kno - 70) / 300 : 0.85 - (l.karma < -20 ? 0.4 : 0)) : (c.promo || 0.2) + (l.st.kno - 50) / 250 + (focus === 'work' ? 0.12 : focus === 'balance' ? 0.06 : 0) + (((l.tr && l.tr.amb) || 50) - 50) / 300 + (l.talent === 'ăn nói' ? 0.04 : 0) - rk * 0.06;
    var why = [];
    why.push(done >= need ? 'đã đủ ' + need + ' năm ở vị trí hiện tại' : 'cần thêm ' + (need - done) + ' năm ở vị trí hiện tại (' + done + '/' + need + ')');
    if (!c.ladder) {
      why.push((l.st.kno >= 70 ? 'kiến thức tốt (+)' : l.st.kno < 45 ? 'kiến thức còn yếu (−)' : 'kiến thức trung bình'));
      why.push(focus === 'work' ? 'đang tập trung công việc (+)' : focus === 'balance' ? 'đang cân bằng (+ ít)' : 'chưa tập trung công việc — chọn trọng tâm "Công việc" để tăng cơ hội');
      if (rk >= 2) why.push('chức càng cao càng khó lên (−)');
    } else if (l.karma < -20) why.push('kỷ luật, tác phong chưa tốt (−)');
    return { next: c.t[rk + 1], need: need, done: done, pct: Math.round(done / need * 100), chance: done >= need ? U.clamp(pp, 0.02, 0.95) : 0, why: why, ladder: !!c.ladder };
  };
  E.HOOKS.year.unshift(function (l, r, log, a) { // đầu danh sách: độc lập với các hook khác
    if (!l.job) { l.flags.rankSeen = null; return; }
    var S = l.flags.rankSeen, id = E.resolveJob(l.job.id), rk = l.job.rank || 0;
    if (S && S.id === id && rk > S.rk && !l.job.fam) { var c = E.jobDef(l); if (c && !c.fame && c.skillRank == null) { var why = []; why.push('đủ ' + (S.need || 3) + ' năm kinh nghiệm ở vị trí cũ'); if (l.st.kno >= 70) why.push('kiến thức vững'); if (l.focus === 'work') why.push('tập trung cho công việc'); if ((l.job.rep || 50) >= 65) why.push('uy tín tốt trong nghề'); log('Lý do được thăng chức: ' + why.join(', ') + '.', 'neutral'); } }
    var cc = E.jobDef(l); l.flags.rankSeen = { id: id, rk: rk, need: cc && cc.yrs ? cc.yrs[rk] || 3 : 3 };
  });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
