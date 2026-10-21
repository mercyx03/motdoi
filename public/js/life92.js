/* Một Đời — v7.3.0: "sống tiếp đời con" giữ đúng gia đình của đời trước
   · nghề của bố / mẹ (chính là nhân vật đời trước) diễn ra đúng như con đường sự nghiệp đã sống: đang làm gì lúc con chào đời,
     đổi việc, thăng chức, nghỉ hưu năm nào — không còn bị thay bằng nghề ngẫu nhiên, không còn "mất việc" ngẫu nhiên
   · nghề của người bạn đời (bố / mẹ còn lại) lấy đúng nghề lúc con chào đời
   · anh chị em ruột giữ nguyên họ tên, giới tính, thứ tự; em sinh sau thì chào đời đúng năm, người đã mất ở đời trước
     thì cũng ra đi đúng tuổi */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H;
  // 1. đời trước: ghi lại con đường sự nghiệp theo từng tuổi
  function title(l) { try { return l.job ? E.jobTitle(l) : l.retired ? 'đã nghỉ hưu' : l.school ? 'đang đi học' : l.indep ? 'thất nghiệp' : ''; } catch (e) { return ''; } }
  E.HOOKS.year.unshift(function (l, r, log, a) {
    if (!l.alive) return;
    var C = l.flags.career92 || (l.flags.career92 = []), t = title(l), inc = (l.income || 0) / 12, last = C[C.length - 1];
    if (t && (!last || last.t !== t || Math.abs(last.inc - inc) > Math.max(0.5, last.inc * 0.3))) { C.push({ a: a, t: t, inc: Math.round(inc * 100) / 100, ret: !!l.retired, pen: l.retired ? Math.round((l.pensionInc || 0) / 12 * 100) / 100 : 0 }); if (C.length > 80) C.splice(1, 1); }
    (l.kids || []).forEach(function (k) { if (k.mateJob == null && (k.born === a || k.born === a - 1)) { var p = l.partner; k.mateJob = p && p.alive !== false && k.mate && p.name === k.mate.name ? (p.job || '') : ''; k.mateInc2 = p && p.inc != null ? p.inc : null; } });
  });
  function careerAt(C, age) { var e = null; for (var i = 0; i < (C || []).length; i++) if (C[i].a <= age) e = C[i]; else break; return e; }
  // 2. truyền sang đời con
  var childOpts = E.childOpts;
  E.childOpts = function (l, k) {
    var o = childOpts.apply(this, arguments), P = o.parent || (o.parent = {});
    var C = (l.flags.career92 || []).map(function (x) { return { a: x.a - k.born, t: x.t, inc: x.inc, ret: x.ret, pen: x.pen }; });
    var at0 = careerAt(C, 0);
    P.career = C; P.base = l.base; P.cur = l.cur;
    if (P.me && at0 && at0.t && at0.t !== 'đang đi học') { P.me.job = at0.t; if (at0.inc > 0) P.me.inc = at0.inc; }
    if (P.mate && k.mateJob) { P.mate.job = k.mateJob; if (k.mateInc2 != null) P.mate.inc = k.mateInc2; }
    P.sibList = (l.kids || []).filter(function (x) { return x !== k && !(x.name === k.name && x.born === k.born && x.sex === k.sex); }).map(function (x) {
      return { n: x.name, sex: x.sex, born: x.born - k.born, died: x.alive === false && x.died != null ? x.died - k.born : null, close: x.close };
    }).filter(function (s) { return s.died == null || s.died > 0; });
    return o;
  };
  var createLife = E.createLife;
  E.createLife = function (opts) {
    var l = createLife.apply(this, arguments), PA = opts && opts.parent; if (!PA || !PA.me) return l;
    var f = l.fam, side = PA.me.sex === 'F' ? 'm' : 'f', k = side === 'm' ? 'mJob' : 'fJob', ik = side === 'm' ? 'mInc' : 'fInc';
    var sc = PA.base && l.base ? l.base / PA.base : 1;
    if (PA.career && PA.career.length) {
      f[side + 'Career'] = PA.career.map(function (x) { return { a: x.a, t: x.t, inc: x.inc * sc, ret: x.ret, pen: (x.pen || 0) * sc }; });
      var e = careerAt(f[side + 'Career'], 0);
      if (e && e.t) { f[k] = e.t === 'đang đi học' ? 'sinh viên' : e.t; f[ik] = e.ret ? (e.pen || 0) : e.inc; f[side + 'Ret'] = !!e.ret; if (side === 'm') f.mInc0 = f.mInc; else f.fInc0 = f.fInc; }
    }
    // An empty roster is authoritative too: an only child must not get random siblings.
    if (Array.isArray(PA.sibList)) {
      var older = [], later = [];
      PA.sibList.forEach(function (s) { var o = { n: s.n, sex: s.sex, born: s.born, alive: true, close: U.clamp(s.close != null ? s.close : 65, 30, 95), job: 'đang đi học', wed: false, kids: 0, q: f.q, diesAt: s.died }; (s.born <= 0 ? older : later).push(o); });
      l.sibList = older; f.sibs = older.length; l.flags.knownSibs = true; l.flags.futureSibs = later;
    }
    return l;
  };
  // 3. đời con: bố / mẹ đi đúng con đường sự nghiệp đã sống; anh chị em đúng như đời trước
  E.HOOKS.year.unshift(function (l, r, log, a) {
    if (!l.alive) return;
    var f = l.fam;
    ['m', 'f'].forEach(function (s) {
      var C = f[s + 'Career'], alive = s === 'm' ? f.mAlive : f.fAlive && !f.noDad; if (!C || !alive || a < 1) return;
      var e = careerAt(C, a), k = s + 'Job', P = s === 'm' ? 'Mẹ' : 'Bố'; if (!e || !e.t) return;
      var t = e.t === 'đang đi học' ? 'sinh viên' : e.t;
      if (f[k] !== t) {
        log(e.ret ? P + ' nghỉ hưu' + (e.pen > 0 ? ', nhận lương hưu ' + H.money(l, e.pen) + '/tháng.' : '.') : t === 'thất nghiệp' ? P + ' tạm thời chưa có việc làm.' : P + ' giờ là ' + t + '.', 'neutral');
        f[k] = t; f[s + 'Ret'] = !!e.ret; f[s + 'Lost'] = t === 'thất nghiệp' ? a : null;
      }
      f[s + 'Inc'] = e.ret ? (e.pen || 0) : (e.inc || 0);
    });
    if (l.flags.knownSibs) {
      var fut = l.flags.futureSibs || [];
      for (var i = fut.length - 1; i >= 0; i--) if (fut[i].born <= a) { var s = fut.splice(i, 1)[0]; (l.sibList || (l.sibList = [])).push(s); if (s.born === a) log('Nhà có thêm em bé — bạn có ' + (s.sex === 'M' ? 'em trai' : 'em gái') + ' tên ' + s.n + '.', 'good'); }
      (l.sibList || []).forEach(function (s) {
        if (s.alive && s.diesAt != null && a >= s.diesAt) { s.alive = false; var w = H.sibCall ? H.sibCall(l, s) : s.n, sa = a - s.born; log(U.cap(w) + ' qua đời ở tuổi ' + sa + (function (c) { return /thanh thản/.test(c) ? ', ' + c : ' vì ' + c; })(H.deathCause(sa, r)) + '.', 'bad'); H.fx(l, { hap: -8 }); }
      });
    }
  });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
