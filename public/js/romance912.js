/* Tình cảm 912: lượt tìm người yêu, tách "gặp" khỏi "đồng ý", làm mới danh sách mập mờ.
   · Trước: "Tìm người yêu" chỉ dùng được 1 lần/năm (khóa chung của hành động), bị khóa hẳn từ 56 tuổi (life43 max 55, engine bỏ
     mọi quyết định "love" sau 55 tuổi), và bấm "Tìm hiểu nhau" là thành người yêu ngay — người kia không có quyền từ chối.
   · Nay: tối đa SEARCH_MAX lượt tìm mỗi năm, một bộ đếm cho mọi đường (Tìm người yêu, bộ lọc hẹn hò, làm quen trong danh sách
     mập mờ); chỉ trừ khi thật sự đi tìm, mở bộ lọc không trừ. Người gặp qua lượt tìm có quyết định riêng dựa trên mức hợp nhau,
     ngoại hình, tài chính, tính cách thể hiện qua giao tiếp, lịch sử tình cảm; chuỗi từ chối liên tiếp được giảm dần, không bảo đảm 100%.
   · Danh sách mập mờ: thêm "Kết thúc và làm mới danh sách" (xác nhận, 1 lần/năm), kết thúc từng người không cần lượt gặp;
     người đã kết thúc được lưu lại danh tính, có thể gặp lại sau; con, thai kỳ, chu cấp, gia đình bí mật không bị xóa. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, R = E.RELATIONS108;
  var V = 1;
  // Hằng số cân bằng (xác suất là tham số gameplay, không phải số liệu thực tế).
  var BAL = { searchMax: 10, maxAge: 85, base: 0.5, gapFree: 6, gapStep: 0.025, looks: 1 / 250, social: 1 / 300, mood: 1 / 600, exStep: 0.02, exCap: 0.12,
    streakStep: 0.08, streakCap: 0.24, min: 0.15, max: 0.88, resetGap: 1, reconnect: 0.15, endedKeep: 30 };

  function state(l) {
    var s = l.flags.romance912;
    if (!s || typeof s !== 'object') s = l.flags.romance912 = { v: V, at: l.age, used: 0, streak: 0, hist: [] };
    if (s.at !== l.age) { s.at = l.age; s.used = 0; }
    if (!Array.isArray(s.hist)) s.hist = [];
    if (!Number.isFinite(s.used)) s.used = 0;
    if (!Number.isFinite(s.streak)) s.streak = 0;
    s.v = V; return s;
  }
  function peekUsed(l) { var s = l.flags && l.flags.romance912; return s && s.at === l.age && Number.isFinite(s.used) ? s.used : 0; }
  function left(l) { return Math.max(0, BAL.searchMax - peekUsed(l)); }
  function quotaText(l) { return 'Lượt tìm năm nay: đã dùng ' + peekUsed(l) + '/' + BAL.searchMax + ', còn ' + left(l) + '.'; }
  function quotaReason(l) { return left(l) > 0 ? true : 'Đã dùng ' + BAL.searchMax + '/' + BAL.searchMax + ' lượt tìm năm nay — sang năm được tìm tiếp'; }
  function spend(l) { var s = state(l); s.used++; return s.used; }

  // ---- Mức đồng ý của người được gặp qua lượt tìm ----
  function factors(l, p) {
    var out = [], gap = Math.abs((p.age || l.age) - l.age), s = state(l);
    out.push(['base', BAL.base]);
    if (gap > BAL.gapFree) out.push(['gap', -(gap - BAL.gapFree) * BAL.gapStep]);
    if (E.LOOKS134) out.push(['looks', (E.LOOKS134.looks(l) - 50) * BAL.looks]);
    var inc = l.base > 0 ? (l.income || 0) / l.base : 1; out.push(['money', U.clamp((inc - 1) * 0.05, -0.05, 0.1)]);
    out.push(['social', ((l.st && l.st.soc) - 50) * BAL.social]);
    out.push(['mood', ((l.st && l.st.hap) - 50) * BAL.mood]);
    if (l.exes) out.push(['exes', -Math.min(BAL.exCap, l.exes * BAL.exStep)]);
    if ((l.karma || 0) < -20) out.push(['karma', -0.08]);
    if (l.addict && (l.addict.alcohol || l.addict.drug || l.addict.gamble)) out.push(['addict', -0.1]);
    if (s.streak) out.push(['streak', Math.min(BAL.streakCap, s.streak * BAL.streakStep)]);
    return out;
  }
  function acceptance(l, p) { return U.clamp(factors(l, p).reduce(function (n, f) { return n + (Number.isFinite(f[1]) ? f[1] : 0); }, 0), BAL.min, BAL.max); }
  var WHY = { gap: 'khoảng cách tuổi khiến người ấy còn đắn đo', looks: 'chưa thấy rung động ngay từ đầu', money: 'lo lắng về sự ổn định trước mắt', social: 'hai người chưa bắt nhịp được khi trò chuyện', mood: 'cảm thấy bạn đang có nhiều tâm sự chưa sẵn sàng', exes: 'nghe kể về những mối tình cũ nên muốn thận trọng', karma: 'nghe vài lời không hay về bạn', addict: 'e ngại thói quen của bạn' };
  function reason(l, p) { var neg = factors(l, p).filter(function (f) { return f[1] < 0 && WHY[f[0]]; }).sort(function (a, b) { return a[1] - b[1]; })[0]; return neg ? WHY[neg[0]] : 'muốn làm bạn thêm một thời gian'; }

  // ---- Đánh dấu chuỗi quyết định sinh ra từ một lượt tìm (app hẹn hò → hồ sơ → gặp mặt → "Một người đặc biệt") ----
  var resolve0 = E.resolve, inSearch = 0;
  // "Một người đặc biệt" tạo ra trong lúc xử lý lượt tìm được gắn cờ ngay khi dựng, trước bước dọn hàng đợi của engine.
  var loveMake = E.DEC.love.make;
  E.DEC.love.make = function () { var d = loveMake.apply(this, arguments); if (inSearch > 0 && d && d.data) d.data.search912 = true; return d; };
  E.resolve = function (l, key) {
    var d = l.pending && l.pending[0];
    if (!d) return resolve0.apply(this, arguments);
    var search = d.id === 'tim_nguoi_yeu', tagged = search || !!(d.data && d.data.search912), before = l.pending.slice(1);
    if (search && l.alive) {
      // Mọi lựa chọn của "Tìm một nửa" đều là một lượt đi tìm (khóa không hợp lệ thì engine tự chọn một cách tìm).
      {
        if (left(l) <= 0) { l.pending.shift(); var e = { a: l.age, y: l.birthYear + l.age, t: 'Đã dùng hết ' + BAL.searchMax + ' lượt tìm người yêu năm nay; lần này chưa thực hiện và không tốn tiền.', k: 'neutral' }; l.log.push(e); if (d.data && d.data.actionYear850 === l.age && l.flags.actAt) delete l.flags.actAt[d.data.actionId850]; return [e]; }
        spend(l);
      }
    }
    var out;
    if (tagged) inSearch++;
    try { out = resolve0.apply(this, arguments); } finally { if (tagged) inSearch--; }
    if (tagged) l.pending.forEach(function (x) { if (before.indexOf(x) < 0 && x !== d) { x.data = x.data || {}; x.data.search912 = true; } });
    return out;
  };
  // Người được gặp qua lượt tìm có quyền từ chối; các nguồn khác (chuyện đời, sự kiện) giữ nguyên.
  var loveApply = E.DEC.love.apply;
  E.DEC.love.apply = function (l, d, k, r, log) {
    if (k !== 'yes' || !d || !d.data || !d.data.search912 || l.partner || d.data.noMatch114) return loveApply.apply(this, arguments);
    var p = d.data.p, s = state(l), chance = acceptance(l, p), ok = r() < chance;
    s.hist.push({ n: p.name, age: p.age, at: l.age, ok: ok, pct: Math.round(chance * 100) }); if (s.hist.length > 30) s.hist.splice(0, s.hist.length - 30);
    if (!ok) {
      s.streak++;
      log(p.name + ' quý bạn nhưng chưa muốn hẹn hò — ' + reason(l, p) + '. Hai người vẫn giữ liên lạc như bạn bè.', 'neutral');
      return;
    }
    s.streak = 0;
    return loveApply.apply(this, arguments);
  };
  // Bản lưu cũ / quyết định "love" đang chờ trước bản này: không có cờ search912 → hành xử như cũ.

  // ---- Lượt tìm: điều kiện trong handler + hiển thị ----
  var TN = E.DEC.tim_nguoi_yeu;
  if (TN) {
    TN.reusableAction906 = true; // giới hạn theo năm do bộ đếm lượt tìm quyết định, không khóa sau lần đầu
    var tnValid = TN.def.valid;
    TN.def.valid = function (l, d) { return (!tnValid || tnValid(l, d)) && left(l) > 0; };
    var tnText = TN.def.text;
    TN.def.text = function (l, d) { return (typeof tnText === 'function' ? tnText(l, d) : tnText) + ' ' + quotaText(l) + ' Gặp được ai đó chưa chắc người ấy đồng ý hẹn hò.'; };
  }
  // Bộ lọc hẹn hò (dating108) mở được nhiều lần trong năm; chỉ lượt tìm mới bị trừ.
  if (E.DEC.dating108) {
    E.DEC.dating108.reusableAction906 = true;
    var dText = E.DEC.dating108.def.text;
    E.DEC.dating108.def.text = function (l, d) { return (typeof dText === 'function' ? dText(l, d) : dText) + ' ' + quotaText(l) + ' Đổi tiêu chí không tốn lượt.' + (narrow(l) ? ' ' + narrow(l) : ''); };
    var search = E.DEC.dating108.def.opts.find(function (o) { return o.k === 'search'; });
    if (search) { var sReq = search.req; search.req = function (l, d) { return (!sReq || sReq(l, d)) && left(l) > 0; }; search.h = function (l) { return left(l) > 0 ? 'Dùng 1 lượt · ' + quotaText(l) : quotaReason(l); }; }
  }
  // Bộ lọc quá hẹp: nói rõ, gợi ý nới; không tự bỏ bộ lọc.
  function narrow(l) {
    var f = l.flags.dating108 || {}, s = l.flags.life114 || {}, tips = [];
    if (f.hi != null && f.lo != null && f.hi - f.lo < 8) tips.push('mở rộng độ tuổi');
    if (f.country && f.country !== 'local') tips.push('tìm cả người sống gần mình');
    if (s.dateJob && s.dateJob !== 'any') tips.push('bỏ giới hạn nghề');
    if (s.dateIncome === 'high') tips.push('chấp nhận thu nhập ổn định');
    return tips.length >= 2 ? 'Tiêu chí khá hẹp, có thể ít người phù hợp — thử ' + tips.join(', ') + '.' : '';
  }
  // Mở khóa tuổi vô lý: tìm người yêu tới 85 tuổi (lời thoại cho người cao tuổi đã có sẵn).
  E.ACT.forEach(function (a) {
    if (a.id === 'tim_nguoi_yeu' || a.id === 'dating108') {
      if (a.id === 'tim_nguoi_yeu') a.max = BAL.maxAge;
      var av = a.avail; a.avail = function (l) { var x = av ? av(l) : true; if (x !== true) return x; return a.id === 'tim_nguoi_yeu' ? quotaReason(l) : true; };
    }
  });
  E.LOVE_SEARCH_MAX = BAL.maxAge;

  // ---- Danh sách mập mờ (network108) ----
  function network(l) { return l.flags.network108 || (l.flags.network108 = []); }
  function nstate(l) { var s = l.flags.network912; if (!s || typeof s !== 'object') s = l.flags.network912 = { v: V, ended: [], resetAt: null }; if (!Array.isArray(s.ended)) s.ended = []; return s; }
  function archive(l, p, how) {
    var s = nstate(l); p.status = 'ended'; p.endedAt108 = l.age; p.endHow912 = how;
    s.ended = s.ended.filter(function (q) { return q.relation108 !== p.relation108; }); s.ended.push(p);
    if (s.ended.length > BAL.endedKeep) s.ended.splice(0, s.ended.length - BAL.endedKeep);
  }
  function resettable(l) { return network(l).filter(function (p) { return !p.secret108; }); }
  function resetReason(l) {
    if (!l.alive) return 'Cuộc đời đã kết thúc';
    if (!resettable(l).length) return network(l).length ? 'Chỉ còn gia đình bí mật — cần kết thúc riêng từng người' : 'Danh sách đang trống';
    var s = nstate(l); if (s.resetAt != null && l.age - s.resetAt < BAL.resetGap) return 'Đã làm mới danh sách năm nay — sang năm mới làm lại được';
    return true;
  }
  var NW = E.DEC.network108;
  if (NW) {
    var nwText = NW.def.text;
    NW.def.text = function (l, d) { var s = nstate(l); return (typeof nwText === 'function' ? nwText(l, d) : nwText) + ' Đang có ' + network(l).length + '/5 người. ' + quotaText(l) + (s.ended.length ? ' Đã kết thúc ' + s.ended.length + ' mối quan hệ (danh tính vẫn được ghi nhớ).' : ''); };
    var newOpt = NW.def.opts.find(function (o) { return o.k === 'new'; });
    if (newOpt) {
      var newReq = newOpt.req, newRun = newOpt.run;
      newOpt.req = function (l, d) { return (!newReq || newReq(l, d)) && left(l) > 0; };
      newOpt.h = function (l) { return network(l).length >= 5 ? 'Danh sách đã đủ 5 người — kết thúc bớt hoặc làm mới danh sách' : left(l) > 0 ? 'Dùng 1 lượt tìm · ' + quotaText(l) : quotaReason(l); };
      newOpt.run = function (l, r, log, d) {
        if (network(l).length >= 5 || left(l) <= 0) return;
        spend(l);
        // Người cũ có thể quay lại hợp lý sau ít nhất 2 năm; giữ nguyên danh tính, tuổi theo năm thực.
        var s = nstate(l), old = s.ended.filter(function (p) { var pref=l.flags.dating108?.sex;var match=pref==='M'||pref==='F'?p.sex===pref:pref==='any'||l.orient==='bi'||p.sex===(l.orient==='gay'?l.sex:l.sex==='M'?'F':'M');return match && p.alive !== false && l.age - (p.endedAt108 || 0) >= 2 && !p.secret108; });
        if (old.length && r() < BAL.reconnect) {
          var p = old[Math.floor(r() * old.length)]; s.ended = s.ended.filter(function (q) { return q !== p; });
          if (Number.isFinite(p.age) && Number.isFinite(p.endedAt108)) p.age += l.age - p.endedAt108;
          p.status = 'ambiguous'; p.since = l.age; delete p.endHow912; network(l).push(p);
          log('Bạn tình cờ gặp lại ' + p.name + ' sau ' + (l.age - p.endedAt108) + ' năm. Hai người quyết định nói chuyện lại từ đầu.', 'neutral');
          X.next(l, 'network108', r); return;
        }
        return newRun.apply(this, arguments);
      };
    }
    NW.def.opts.splice(NW.def.opts.length - 1, 0, { k: 'reset912', l: 'Kết thúc và làm mới danh sách', h: function (l) { var x = resetReason(l); return x === true ? 'Xem lại trước khi xác nhận · tối đa 1 lần/năm' : x; }, req: function (l) { return resetReason(l) === true; },
      run: function (l, r) { if (resetReason(l) !== true) return; X.next(l, 'network912_reset', r); } });
  }
  E.SC('network912_reset', {
    title: 'Kết thúc và làm mới danh sách',
    prep: function (l) { return { at: l.age, done: false, ids: resettable(l).map(function (p) { return p.relation108; }) }; },
    valid: function (l, d) { return resetReason(l) === true && (!d || d.at == null || d.at === l.age && !d.done); },
    text: function (l, d) {
      var list = resettable(l), keep = network(l).filter(function (p) { return p.secret108; });
      var kids = (l.kids || []).filter(function (k) { return k.coParent108 && list.some(function (p) { return p.relation108 === k.coParent108.id; }); }).length;
      var preg = list.filter(function (p) { var s = l.flags.pregnancy108; return s && s.parent && s.parent.relation108 === p.relation108 || (l.flags.pregnancies108 || []).some(function (q) { return q.parent && q.parent.relation108 === p.relation108; }); }).length;
      return 'Sẽ kết thúc ' + list.length + ' mối quan hệ: ' + list.map(function (p) { return p.name; }).join(', ') + '.' +
        (keep.length ? ' Giữ nguyên ' + keep.length + ' gia đình bí mật (cần kết thúc riêng).' : '') +
        (kids || preg ? ' Con chung (' + kids + '), thai kỳ đang có (' + preg + '), nghĩa vụ nuôi con và các khoản chu cấp vẫn giữ nguyên.' : ' Con chung, thai kỳ, nghĩa vụ và khoản hỗ trợ (nếu có) không bị xóa.') +
        ' Danh tính và lịch sử được ghi nhớ; người cũ có thể gặp lại sau. Làm mới tối đa 1 lần/năm; tìm người mới vẫn dùng lượt tìm (' + quotaText(l) + ')';
    },
    opts: [{ k: 'confirm', l: 'Xác nhận kết thúc và làm mới', run: function (l, r, log, d) {
      if (!E.DEC.network912_reset.valid(l, d)) return;
      d.done = true;
      var list = resettable(l), aff = l.flags.affair107 && l.flags.affair107.person108;
      list.forEach(function (p) { archive(l, p, 'reset'); });
      l.flags.network108 = network(l).filter(function (p) { return list.indexOf(p) < 0; });
      if (aff && list.indexOf(aff) >= 0 && R && R.endAffair) { R.endAffair(l); aff.status = 'ended'; }
      nstate(l).resetAt = l.age;
      log('Bạn nói rõ với ' + list.length + ' người rằng mình muốn dừng lại. Danh sách mập mờ được làm mới; những gì đã xảy ra vẫn là một phần cuộc đời bạn.', 'neutral');
    } }, { k: 'cancel', l: 'Chưa, giữ nguyên danh sách', run: function (l, r, log, d) { if (d) d.done = true; } }]
  });
  // Kết thúc từng người là thao tác quản lý: không cần còn lượt gặp trong năm.
  var NP = E.DEC.network108_person;
  if (NP) {
    var npApply = NP.apply;
    NP.apply = function (l, d, k, r, log) {
      if (k !== 'end') return npApply.apply(this, arguments);
      var x = d && d.data, p = x && network(l).find(function (q) { return q.relation108 === x.who && q.alive !== false; });
      if (!p || !l.alive || x.done || x.at !== l.age) return;
      x.done = true; archive(l, p, 'end');
      l.flags.network108 = network(l).filter(function (q) { return q !== p; });
      var aff = l.flags.affair107 && l.flags.affair107.person108; if (aff === p && R && R.endAffair) R.endAffair(l);
      log('Bạn nói rõ quyết định dừng lại với ' + p.name + ', không để người ấy phải tiếp tục đoán.', 'neutral');
    };
  }

  // Bản lưu cũ: bổ sung trạng thái khi thiếu, không đổi danh sách hay lịch sử.
  var migrate = E.migrateExt;
  E.migrateExt = function (l) {
    if (migrate) migrate(l);
    if (!l || !l.flags) return;
    if (l.flags.romance912 != null && typeof l.flags.romance912 !== 'object') delete l.flags.romance912;
    if (l.flags.network912 != null && typeof l.flags.network912 !== 'object') delete l.flags.network912;
    if (l.flags.romance912) state(l);
  };

  E.ROMANCE912 = { BAL: BAL, state: state, left: left, used: peekUsed, acceptance: acceptance, factors: factors, quotaText: quotaText, resetReason: resetReason, nstate: nstate, narrow: narrow };
})(globalThis.G);
