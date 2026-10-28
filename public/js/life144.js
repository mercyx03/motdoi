/* GĐ4: hậu quả liên hoàn nhiều năm trên các sự kiện đã có.
   Không phải engine thứ hai: mỗi chuỗi là một bản ghi nhỏ trong l.flags.chains144, các giai đoạn đi qua
   cơ chế sẵn có — E.SC (lựa chọn), l.sched (hẹn năm sau), E.HOOKS.year (xét điều kiện mỗi năm) và E.NPC (danh tính).
   · Một chuỗi mỗi loại (tối đa 1–3 lần một đời), tối đa 4 chuỗi cùng lúc; lịch sử đã đóng giữ 12 bản ghi, mỗi chuỗi giữ 6 bước gần nhất.
   · Mỗi năm tối đa một lựa chọn từ chuỗi để không lấn át cuộc đời và không dồn popup ở chế độ tự động.
   · Mỗi giai đoạn có token riêng: lựa chọn chỉ có tác dụng một lần, kể cả khi lưu / tải lại giữa chừng.
   · Xác suất giai đoạn dùng số ngẫu nhiên băm theo nhân vật (không rút RNG chung) và hệ số hoàn cảnh GĐ3. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, SC = E.SC, X = E.UPDATE110;
  var MAX_ACTIVE = 4, MAX_DONE = 12, MAX_HIST = 6, KINDS = {};

  function hash(s) { var n = 2166136261; for (var i = 0; i < s.length; i++) n = Math.imul(n ^ s.charCodeAt(i), 16777619); return n >>> 0; }
  function roll(l, c, y) { return hash([l.rs, l.id, c.id, c.stage, y].join(':')) / 4294967296; }
  function isVN(l) { return H.isVN(l); }
  function vnd(l) { return isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  function V(l, tr) { return vnd(l) ? tr : tr / 90 * l.base; }
  function mo(l, v) { return H.money(l, v); }
  function fx(l, o) { H.fx(l, o); }
  function stress(l, d) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + d, 0, 100); }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function ago(l, c) { var n = l.age - c.origin.age; return n <= 0 ? 'năm nay' : n + ' năm trước'; }
  function ctx(l, tag) { return tag && E.CONTEXT143 ? E.CONTEXT143.factor({ contextTags: [tag] }, l) : 1; }
  function jobCat(l) { var c = l.job && E.jobDef ? E.jobDef(l) : null; return c ? c.cat : ''; }

  // ---------- trạng thái ----------
  function valid(s) { return s && typeof s === 'object' && Array.isArray(s.active) && Array.isArray(s.done); }
  function state(l) { if (!valid(l.flags.chains144)) l.flags.chains144 = { v: 1, seq: 0, active: [], done: [], stageAt: -1 }; return l.flags.chains144; }
  function chain(l, id) { var s = l.flags && l.flags.chains144; return valid(s) && id ? s.active.find(function (c) { return c.id === id; }) || null : null; }
  function active(l, kind) { var s = l.flags && l.flags.chains144; return valid(s) ? s.active.find(function (c) { return c.kind === kind; }) || null : null; }
  function note(c, k) { c.hist.push({ a: c.last, s: c.stage, k: k }); if (c.hist.length > MAX_HIST) c.hist.splice(0, c.hist.length - MAX_HIST); }
  function setWindow(c, after, at) { c.next = at + after[0]; c.due = at + after[1]; c.tries = 0; }

  function start(l, kind, origin, extra) {
    var K = KINDS[kind];
    if (!K || !l.alive || !l.flags) return null;
    var s = state(l);
    var n = s.count && s.count[kind] || 0;
    if (s.active.some(function (c) { return c.kind === kind; }) || s.active.length >= MAX_ACTIVE || n >= (K.max || 2)) return null;
    (s.count || (s.count = {}))[kind] = n + 1;
    var c = { id: kind + ':' + (++s.seq), kind: kind, since: l.age, stage: 0, last: l.age, origin: { dec: origin.dec, k: origin.k, age: l.age }, npc: extra && extra.npc || null, data: extra && extra.data || {}, open: null, hist: [] };
    setWindow(c, K.stages[0].after, l.age);
    s.active.push(c);
    return c;
  }
  function close(l, c, result, log, text, kind) {
    var s = state(l), i = s.active.indexOf(c);
    if (i < 0) return;
    s.active.splice(i, 1);
    c.last = l.age; note(c, 'end:' + result);
    s.done.push({ id: c.id, kind: c.kind, since: c.since, end: l.age, result: result, origin: c.origin, hist: c.hist.slice(-3) });
    if (s.done.length > MAX_DONE) s.done.splice(0, s.done.length - MAX_DONE);
    if (text && log) log(text, kind || 'neutral');
  }
  function advance(l, c, after) {
    var K = KINDS[c.kind];
    c.stage++; c.last = l.age; c.open = null;
    if (c.stage >= K.stages.length) return close(l, c, 'complete');
    setWindow(c, after || K.stages[c.stage].after, l.age);
  }
  function jump(l, c, stage) { c.stage = stage - 1; advance(l, c); }

  // ---------- giai đoạn có lựa chọn ----------
  function stageDec(kind, idx, st) {
    var id = st.dec;
    // GĐ6: điều kiện hủy chuỗi (bạn đời không còn, bố/mẹ đã mất, nợ đã xong…) cũng chặn lựa chọn đã hẹn, kể cả khi hook năm chưa kịp khép chuỗi.
    function ok(l, d) { var c = d && chain(l, d.cid), K = KINDS[kind]; return !!(l.alive && c && c.kind === kind && c.stage === idx && c.open && c.open.token === d.token && !d.done && !(K.cancel && K.cancel(l, c)) && (!st.valid || st.valid(l, c))); }
    SC(id, {
      title: function (l, d) { var c = d && chain(l, d.cid); return c ? (typeof st.title === 'function' ? st.title(l, c) : st.title) : 'Chuyện cũ'; },
      tone: st.tone || '',
      prep: function (l, r, arg) { var c = arg && chain(l, arg.cid); var d = { cid: arg && arg.cid, token: arg && arg.token, done: false }; if (c && st.prep) Object.assign(d, st.prep(l, c)); return d; },
      valid: ok,
      text: function (l, d) { var c = d && chain(l, d.cid); return c ? st.text(l, c, d) : ''; },
      opts: st.opts.map(function (o) {
        return {
          k: o.k, l: o.l, h: o.h, ai: o.ai,
          req: function (l, d) { var c = d && chain(l, d.cid); return !!c && (!o.req || o.req(l, c, d)); },
          run: function (l, r, log, d) {
            if (!ok(l, d)) return;
            var c = chain(l, d.cid);
            d.done = true; c.open = null; c.last = l.age; note(c, o.k);
            o.run(l, r, log, c, d);
          }
        };
      })
    });
  }
  // Giai đoạn mở lại một lựa chọn sẵn có (ví dụ học bổ túc): ghi nhận kết quả khi lựa chọn ấy mang đúng token của chuỗi.
  function onExisting(decId, fn) {
    var D = E.DEC[decId]; if (!D || !D.def) return;
    D.def.opts.forEach(function (o) {
      var run = o.run;
      o.run = function (l, r, log, d) {
        var c = d && d.cid ? chain(l, d.cid) : null, mine = !!(c && c.open && c.open.token === d.token && !d.chainDone);
        var res = run.apply(this, arguments);
        if (mine) { d.chainDone = true; c.open = null; c.last = l.age; note(c, o.k); fn(l, c, o.k, log); }
        return res;
      };
    });
  }
  // Ghi nhận lựa chọn gốc: chạy nguyên phương án cũ rồi mới xét có mở chuỗi hay không (không đổi kết quả gốc).
  function onOrigin(decId, fn) {
    var D = E.DEC[decId]; if (!D || !D.def) return;
    D.def.opts.forEach(function (o) {
      var run = o.run;
      o.run = function (l, r, log, d) {
        var before = { money: l.money, school: l.school, job: l.job, loans: (l.loans || []).length, dauLung: !!l.flags.dauLung };
        var res = run.apply(this, arguments);
        if (l.alive) fn(l, o.k, d || {}, before);
        return res;
      };
    });
  }

  // ---------- mỗi năm: xét điều kiện, hẹn giai đoạn tiếp theo ----------
  function yearly(l, r, log, a) {
    var s = l.flags && l.flags.chains144;
    if (!l.alive || !valid(s) || !s.active.length) return;
    var y = a + 1;
    s.active.slice().forEach(function (c) {
      if (!l.alive || s.active.indexOf(c) < 0) return;
      var K = KINDS[c.kind];
      if (!K) return; // loại chuỗi của phiên bản mới hơn: giữ nguyên, không xử lý
      var why = K.cancel && K.cancel(l, c);
      if (why) return close(l, c, why.result || 'cancelled', log, why.text, why.kind);
      if (c.open) {
        if (c.open.at >= y) return;
        // Lựa chọn đã hẹn không xuất hiện được (đang ở tù, đi nghĩa vụ, hoàn cảnh đổi): không làm lại hậu quả, chỉ hẹn lại.
        c.open = null; c.missed = (c.missed || 0) + 1;
        if (c.missed >= 2) return close(l, c, 'lapsed');
      }
      var st = K.stages[c.stage];
      if (st.skip && st.skip(l, c)) return jump(l, c, st.skip(l, c));
      if (y < c.next) return;
      if (y > c.due) return st.lapse ? st.lapse(l, c, log) : close(l, c, 'lapsed');
      if (!st.when(l, c)) return;
      var p = U.clamp((typeof st.p === 'function' ? st.p(l, c) : st.p) * ctx(l, st.tag), 0, 1);
      if (y === c.due) p = Math.min(1, p * 2); // năm cuối của khoảng thời gian: dễ xảy ra hơn, không bắt buộc
      if (roll(l, c, y) >= p) return;
      var dec = typeof st.dec === 'function' ? st.dec(l, c) : st.dec;
      if (!dec) { if (st.narrate) { c.last = a; note(c, 'narrate'); st.narrate(l, c, log); } return; }
      if (!E.DEC[dec] || s.stageAt === y || (l.sched || []).some(function (x) { return x.at === y && x.arg && x.arg.cid; })) return;
      c.open = { at: y, token: c.id + '#' + c.stage + '@' + y };
      s.stageAt = y;
      H.sched(l, dec, 1, { cid: c.id, token: c.open.token });
    });
  }
  E.HOOKS.year.push(yearly);

  // Bản lưu: chỉ làm sạch cấu trúc; bản cũ chưa có chuỗi thì không tạo gì.
  var migrate = E.migrateExt;
  E.migrateExt = function (l) {
    if (migrate) migrate(l);
    var s = l.flags && l.flags.chains144;
    if (s == null) return;
    if (!valid(s)) { delete l.flags.chains144; return; }
    s.active = s.active.filter(function (c) { return c && typeof c.id === 'string' && typeof c.kind === 'string' && Number.isFinite(c.stage) && c.origin; });
    s.active.forEach(function (c) { if (!Array.isArray(c.hist)) c.hist = []; if (!c.data || typeof c.data !== 'object') c.data = {}; });
    if (s.done.length > MAX_DONE) s.done.splice(0, s.done.length - MAX_DONE);
    if (!Number.isFinite(s.seq)) s.seq = s.active.length + s.done.length;
    if (!s.count || typeof s.count !== 'object') s.count = {};
  };

  function define(kind, K) {
    KINDS[kind] = K;
    K.stages.forEach(function (st, i) { if (st.opts) stageDec(kind, i, st); });
  }

  // ---------- người liên quan ----------
  function npcAlive(l, c) { var who = c.npc && c.npc.ref && E.NPC ? E.NPC.find(l, c.npc.ref) : null; return !!(who && who.alive); }
  function friendObj(l, c) { var who = c.npc && E.NPC ? E.NPC.find(l, c.npc.ref) : null; return who && who.alive && who.obj ? who.obj : null; }
  function partnerSame(l, c) { var p = l.partner; return !!(p && p.alive !== false && p.status !== 'dating' && c.npc && X && E.NPC.same(l, X.uid(l, p), c.npc.ref)); }
  function trust(l, ref, d) { return E.NPC ? E.NPC.adjustTrust(l, ref, d) : null; }
  function tension(l, type, side, d) { if (!E.FAMILY100) return; var s = E.FAMILY100.info(l, type, side); s.tension = U.clamp(s.tension + d, 0, 100); }
  function relTrust(l, ref) { var q = E.NPC ? E.NPC.relation(l, ref) : null; return q && Number.isFinite(q.trust) ? q.trust : 60; }
  function loanOf(l, c) { return (l.loans || []).find(function (L) { return L.type === c.data.loan && L.since === c.data.since && L.bal > 0.5 && !L.closed; }) || null; }
  // Khoản vay biến mất: trả xong hay bị xử lý vỡ nợ (engine xóa khoản trễ hạn quá lâu). Ghi nhớ số kỳ trễ mỗi năm để phân biệt.
  function debtState(l, c) {
    var L = loanOf(l, c);
    if (L) { c.data.late = L.late || 0; return 'open'; }
    if (!c.data.end) c.data.end = !c.data.cleared && (c.data.late || 0) >= (/^(nong|appden)$/.test(c.data.loan) ? 2 : 3) ? 'defaulted' : 'repaid';
    return c.data.end;
  }
  function settle(l, c, share, why) { var L = loanOf(l, c); if (!L) return 0; var x = payDown(l, L, L.bal * share, why); if (L.bal <= 0.5) c.data.cleared = true; return x; }
  function payDown(l, L, amt, why) { var x = Math.max(0, Math.min(L.bal, amt, Math.max(0, l.money))); if (x <= 0) return 0; L.bal -= x; H.cash(l, -x, why); return x; }
  function hardship(l) { return (!l.job && !l.retired && l.age >= 20 && l.age < 62) || !!l.ill || l.money < 0 || (l.loans || []).reduce(function (n, L) { return n + Math.max(0, L.bal || 0); }, 0) > l.base * 2; }

  // ===================================================================
  // 1. GIÁO DỤC — nghỉ học vì nhà nghèo → rào cản bằng cấp → học bổ túc → tấm bằng muộn
  // ===================================================================
  define('edu', {
    max: 1,
    cancel: function (l, c) { if (c.stage < 2 && l.edu >= 3 && !l.flags.gdtx) return { result: 'qualified' }; },
    stages: [
      { dec: 'ch144_edu_barrier', after: [2, 7], p: 0.45, tag: 'pressure',
        skip: function (l, c) { return l.flags.gdtx ? 2 : 0; },
        when: function (l) { return free(l) && l.age >= 18 && l.age <= 26 && !l.school && l.edu < 3; },
        lapse: function (l, c) { advance(l, c); },
        title: 'Hồ sơ thiếu bằng cấp',
        text: function (l, c) { return 'Năm ' + c.origin.age + ' tuổi bạn nghỉ học vì nhà túng quẫn. Giờ đi xin việc, nhiều nơi đòi bằng tốt nghiệp THPT; bạn mới học hết ' + E.EDU[l.edu] + '.'; },
        opts: [
          { k: 'work', l: 'Nhận việc lao động phổ thông trước, lo cái ăn đã', ai: { w: 1 }, run: function (l, r, log, c) { if (!l.job) l.flags.needJob = true; fx(l, { hap: -2 }); log('Bạn chấp nhận những việc không cần bằng cấp, tự nhủ chuyện học tính sau.', 'neutral'); c.data.path = 'work'; advance(l, c); } },
          { k: 'ask', l: 'Hỏi thăm lớp bổ túc buổi tối gần nhà', ai: { w: 0.8, amb: 1 }, run: function (l, r, log, c) { log('Bạn ghé trung tâm giáo dục thường xuyên hỏi lịch học, cầm tờ thông báo tuyển sinh về nhà.', 'neutral'); c.data.path = 'ask'; advance(l, c, [1, 4]); } },
          { k: 'self', l: 'Tự học thêm kỹ năng qua mạng, sách cũ', ai: { w: 0.7, smart: 1 }, run: function (l, r, log, c) { fx(l, { kno: 4 }); stress(l, 3); log('Tối nào bạn cũng tự học thêm. Không có bằng, nhưng tay nghề và hiểu biết tăng dần.', 'neutral'); c.data.path = 'self'; advance(l, c); } }
        ] },
      { dec: 'bo_tuc', after: [1, 6], tag: 'studyOpportunity',
        p: function (l, c) { return c.data.path === 'ask' ? 0.6 : 0.3; },
        when: function (l) { return free(l) && l.age <= 40 && !l.school && !l.flags.gdtx && l.edu < 3 && (!!l.job || l.indep) && !(l.flags.hsFail && l.edu === 2 && l.age < 21); },
        skip: function (l) { return l.flags.gdtx ? 2 : 0; },
        lapse: function (l, c) { close(l, c, 'no_return'); } },
      { after: [1, 7], p: 1,
        when: function (l) { return !l.flags.gdtx; },
        lapse: function (l, c) { close(l, c, 'unfinished'); },
        narrate: function (l, c, log) {
          if (l.edu >= 3) { H.mem(l, 'Tấm bằng tốt nghiệp đến muộn — ' + (l.age - c.origin.age) + ' năm sau ngày nghỉ học vì nhà nghèo.', 5); fx(l, { hap: 4 }); close(l, c, 'returned', log, 'Cầm tấm bằng tốt nghiệp phổ thông, bạn nhớ lại năm ' + c.origin.age + ' tuổi phải bỏ dở việc học. Cánh cửa xin việc rộng hơn trước.', 'good'); }
          else if (l.edu > c.data.edu0) close(l, c, 'progress', log, 'Có thêm tấm bằng bổ túc, bạn tiến thêm một bước so với năm ' + c.origin.age + ' tuổi phải nghỉ học.', 'good');
          else close(l, c, 'unfinished', log, 'Lớp bổ túc dang dở. Ước mong có tấm bằng từ năm ' + c.origin.age + ' tuổi lại tạm cất đi.', 'neutral');
        } }
    ]
  });
  onExisting('bo_tuc', function (l, c, k, log) {
    if (k === 'no') return close(l, c, 'declined');
    advance(l, c);
  });
  onOrigin('nghi_hoc_ngheo', function (l, k, d, before) { if (before.school && !l.school) start(l, 'edu', { dec: 'nghi_hoc_ngheo', k: k }, { data: { edu0: l.edu } }); });

  // ===================================================================
  // 2. NGHỀ NGHIỆP — nhường suất ở lại khi cắt giảm → tìm việc → người đồng nghiệp cũ giới thiệu việc
  // ===================================================================
  define('career', {
    stages: [
      { dec: 'ch144_job_search', after: [1, 2], p: 0.8, tag: 'pressure',
        skip: function (l) { return l.job ? 1 : 0; },
        when: function (l) { return free(l) && !l.job && !l.retired && l.age < 62; },
        lapse: function (l, c) { advance(l, c); },
        title: 'Sau ngày nghỉ việc',
        text: function (l, c) { return 'Từ ngày bạn nhường suất ở lại cho ' + c.npc.name + ' (' + ago(l, c) + '), khoản trợ cấp vơi dần mà chưa tìm được chỗ làm phù hợp.'; },
        opts: [
          { k: 'retrain', l: 'Học một khóa nghề ngắn hạn', h: function (l) { return '~' + mo(l, V(l, 6)); }, req: function (l) { return l.money > V(l, 6); }, ai: { w: 1, smart: 0.6 }, run: function (l, r, log, c) { H.cash(l, -V(l, 6), 'Học phí khóa nghề ngắn hạn'); fx(l, { kno: 5 }); c.data.retrained = true; log('Bạn đăng ký một khóa học nghề ngắn hạn, mỗi tối lại cắp sách đến lớp.', 'neutral'); advance(l, c); } },
          { k: 'lower', l: 'Nhận tạm một việc thấp hơn', ai: { w: 1.1 }, run: function (l, r, log, c) { l.flags.needJob = true; fx(l, { hap: -3 }); log('Bạn hạ yêu cầu, sẵn sàng nhận việc thấp hơn trước để có thu nhập.', 'neutral'); advance(l, c); } },
          { k: 'rest', l: 'Nghỉ ngơi một thời gian rồi tính tiếp', req: function (l) { return l.money > l.base * 0.5; }, ai: { w: 0.6 }, run: function (l, r, log, c) { stress(l, -8); fx(l, { hap: 2 }); log('Lần đầu sau nhiều năm bạn có thời gian cho bản thân. Áp lực tiền bạc vẫn còn đó.', 'neutral'); advance(l, c); } }
        ] },
      { dec: 'ch144_job_referral', after: [1, 6], tag: 'careerOpportunity',
        p: function (l, c) { return (!l.job ? 0.35 : 0.15) * (c.data.retrained ? 1.3 : 1); },
        when: function (l) { return free(l) && !l.retired && l.age < 62; },
        lapse: function (l, c) { close(l, c, 'faded'); },
        title: function (l, c) { return c.npc.name + ' gọi điện'; },
        text: function (l, c) { return 'Năm ' + c.origin.age + ' tuổi, bạn tình nguyện nghỉ để ' + c.npc.name + ' giữ việc nuôi con. Giờ ' + c.npc.name + ' đã ổn định ở một công ty khác' + (l.job ? ' và muốn mời bạn một bữa cơm cảm ơn.' : ', nghe tin bạn chưa có việc liền nói: "Bên em đang tuyển, anh chị gửi hồ sơ nhé."'); },
        opts: [
          { k: 'accept', l: 'Gửi hồ sơ qua lời giới thiệu', req: function (l) { return !l.job && !!l.lastJob && !!E.CAR[E.resolveJob(l.lastJob.id)]; }, ai: { w: 1.5 }, run: function (l, r, log, c) {
            var id = E.resolveJob(l.lastJob.id), C = E.CAR[id];
            if (E.jobEligible && !E.jobEligible(l, C)) { log(c.npc.name + ' giới thiệu tận tình, nhưng vị trí ấy yêu cầu điều kiện bạn chưa đáp ứng. Bạn vẫn cảm động vì được nhớ đến.', 'neutral'); fx(l, { hap: 2 }); return close(l, c, 'tried'); }
            E.startJob(l, id, r, log, true); log('Nhờ lời giới thiệu của ' + c.npc.name + ', bạn trở lại nghề cũ: ' + (C.t[l.job.rank] || C.t[0]).toLowerCase() + '. "Hồi đó anh chị đã nhường cho em."', 'good'); H.mem(l, c.npc.name + ' giới thiệu việc, trả lại ân tình năm nào.', 4); fx(l, { hap: 6 }); close(l, c, 'repaid'); } },
          { k: 'thanks', l: 'Nhận lời, ăn bữa cơm hàn huyên', req: function (l) { return !!l.job; }, ai: { w: 1, soc: 0.5 }, run: function (l, r, log, c) { fx(l, { hap: 4, soc: 3 }); log('Hai người ôn lại chuyện cũ. ' + c.npc.name + ' nói nhờ năm ấy mà con được học hết phổ thông.', 'good'); H.mem(l, 'Bữa cơm cảm ơn của ' + c.npc.name + '.', 3); close(l, c, 'thanked'); } },
          { k: 'decline', l: 'Cảm ơn, nhưng muốn tự tìm đường', ai: { w: 0.5, amb: 0.6 }, run: function (l, r, log, c) { fx(l, { hap: 1 }); log('Bạn cảm ơn lời mời và tự đi tiếp con đường của mình. Hai người vẫn giữ liên lạc.', 'neutral'); close(l, c, 'declined'); } }
        ] }
    ]
  });
  onOrigin('cs_cat_giam', function (l, k, d) { if (k === 'nhuong' && d.n && !l.job) start(l, 'career', { dec: 'cs_cat_giam', k: k }, { npc: { ref: null, name: d.n } }); });

  // ===================================================================
  // 3. KINH DOANH — vay nóng xoay vốn → chủ nợ đến tận nơi → trả xong mở rộng / gồng / đóng cửa
  // ===================================================================
  function owner(l) { return !!l.job && jobCat(l) === 'biz'; }
  define('biz', {
    cancel: function (l, c) { if (debtState(l, c) === 'repaid' && c.stage === 0) return { result: 'repaid', text: 'Khoản vay nóng để trả lương năm ' + c.origin.age + ' tuổi đã được trả dứt điểm, cửa hàng thở phào.', kind: 'good' }; },
    stages: [
      { dec: 'ch144_biz_debt', after: [1, 2], p: 0.85, tag: 'pressure',
        skip: function (l, c) { return debtState(l, c) === 'defaulted' ? 1 : 0; },
        when: function (l, c) { return free(l) && !!loanOf(l, c); },
        title: 'Chủ nợ đến tận cửa hàng',
        text: function (l, c) { var L = loanOf(l, c); return 'Khoản vay nóng năm ' + c.origin.age + ' tuổi để trả lương nhân viên giờ còn ' + mo(l, L ? L.bal : 0) + '. Người của chủ nợ bắt đầu ghé cửa hàng hỏi thăm.'; },
        opts: [
          { k: 'sell', l: 'Bán bớt hàng tồn, thiết bị để trả dứt điểm', ai: { w: 1.2 }, run: function (l, r, log, c) { if (owner(l)) H.cash(l, l.base * 0.3, 'Bán bớt hàng tồn, thiết bị'); settle(l, c, 1, 'Trả khoản vay nóng'); stress(l, -4); log(c.data.cleared ? 'Bạn bán bớt hàng và thiết bị, trả dứt khoản vay nóng. Cửa hàng nhỏ lại nhưng ngủ yên giấc.' : 'Bán được ít hàng, trả bớt một phần nợ. Phần còn lại vẫn treo đó.', 'neutral'); advance(l, c); } },
          { k: 'negotiate', l: 'Thương lượng trả dần theo tháng', ai: { w: 1 }, run: function (l, r, log, c) { var L = loanOf(l, c); settle(l, c, 0.4, 'Trả bớt khoản vay nóng'); if (L) L.late = 0; stress(l, 4); log('Bạn xin trả dần, đưa trước một phần. Chủ nợ tạm chấp nhận, nhưng lãi vẫn chạy mỗi tháng.', 'neutral'); advance(l, c); } },
          { k: 'roll', l: 'Vay chỗ khác đắp vào, chờ ngân hàng giải ngân', ai: { w: 0.5, risk: 1 }, run: function (l, r, log, c) { var L = loanOf(l, c); if (L) L.bal *= 1.15; c.data.rolled = true; stress(l, 10); log('Bạn xoay chỗ này đắp chỗ kia. Tiền lãi chồng lên khoản nợ cũ, chưa có thêm đồng vốn nào.', 'bad'); advance(l, c); } }
        ] },
      { dec: 'ch144_biz_crossroad', after: [1, 3], p: 0.6, tag: 'careerOpportunity',
        when: function (l) { return free(l) && owner(l); },
        lapse: function (l, c) { close(l, c, owner(l) ? 'steady' : 'left'); },
        prep: function (l, c) { return { clear: debtState(l, c) === 'repaid', broke: debtState(l, c) === 'defaulted' }; },
        title: function (l, c) { return debtState(l, c) === 'repaid' ? 'Cơ hội mở rộng' : 'Gồng tiếp hay dừng lại?'; },
        text: function (l, c, d) { return d.broke ? 'Sau lần chủ nợ kéo đến đập phá vì khoản vay nóng năm ' + c.origin.age + ' tuổi, khách quen ngại ghé, nhân viên xin nghỉ dần.' : d.clear ? 'Từ ngày vay nóng trả lương năm ' + c.origin.age + ' tuổi, bạn đã trả xong nợ. Khách quen tăng dần, một mặt bằng bên cạnh đang cho thuê.' : 'Đã ' + (l.age - c.origin.age) + ' năm từ khoản vay nóng trả lương. Nợ vẫn còn ' + mo(l, (loanOf(l, c) || {}).bal || 0) + ', doanh thu chỉ đủ trả lãi.'; },
        opts: [
          { k: 'expand', l: 'Thuê thêm mặt bằng, mở rộng', h: function (l) { return 'Vốn khoảng ' + mo(l, l.base); }, req: function (l, c, d) { return d.clear && l.money >= l.base; }, ai: { amb: 1, risk: 0.6 }, run: function (l, r, log, c) { H.cash(l, -l.base, 'Vốn mở rộng cửa hàng'); var C = E.jobDef(l); if (r() < 0.6 && C && l.job.rank < C.t.length - 1) { l.job.rank++; l.job.rankSince = l.age; l.job.rankTracked = l.job.rank; log('Mở rộng thành công: thêm mặt bằng, thêm khách, bạn thành ' + C.t[l.job.rank] + '.', 'good'); close(l, c, 'expanded'); } else { stress(l, 6); log('Mở rộng xong thì kinh tế chững lại; mặt bằng mới chưa có lãi.', 'neutral'); close(l, c, 'overreached'); } } },
          { k: 'steady', l: 'Giữ quy mô, tích lũy quỹ dự phòng', req: function (l, c, d) { return d.clear; }, ai: { w: 1 }, run: function (l, r, log, c) { stress(l, -5); log('Bạn giữ cửa hàng như cũ, mỗi tháng để riêng một khoản phòng khi hụt vốn.', 'good'); close(l, c, 'steady'); } },
          { k: 'push', l: 'Gồng thêm một năm', req: function (l, c, d) { return !d.clear; }, ai: { w: 0.8, risk: 0.8 }, run: function (l, r, log, c) { stress(l, 8); if (r() < (c.data.rolled ? 0.35 : 0.5)) { H.cash(l, l.base * 0.4, 'Doanh thu hồi phục'); log('Một hợp đồng lớn kéo cửa hàng qua cơn bĩ cực.', 'good'); close(l, c, 'survived'); } else { H.cash(l, -Math.min(l.base * 0.4, Math.max(0, l.money)), 'Bù lỗ kinh doanh'); log('Gồng thêm một năm, tiền bù lỗ cứ thế đội lên.', 'bad'); close(l, c, 'struggling'); } } },
          { k: 'close', l: 'Đóng cửa, đi làm thuê trả nợ', req: function (l, c, d) { return !d.clear; }, ai: { w: 0.7 }, run: function (l, r, log, c) { l.lastJob = l.job; l.job = null; l.flags.needJob = true; fx(l, { hap: -8 }); stress(l, -6); log('Bạn đóng cửa hàng. Nợ chưa hết, nhưng không phải nuôi thêm những tháng lỗ.', 'bad'); H.mem(l, 'Ngày kéo cửa cuốn lần cuối.', 4); close(l, c, 'closed'); } }
        ] }
    ]
  });
  onOrigin('kd_vay_nong_xoay_von', function (l, k, d, before) {
    var L = (l.loans || [])[before.loans];
    if (k === 'vay_nong' && L && L.type === 'nong') start(l, 'biz', { dec: 'kd_vay_nong_xoay_von', k: k }, { data: { loan: 'nong', since: L.since } });
  });

  // ===================================================================
  // 4. TÀI CHÍNH — vay chữa bệnh cho bố mẹ → đến hạn trả → uy tín với họ hàng / nợ đeo bám
  // ===================================================================
  define('debt', {
    cancel: function (l, c) {
      var st = debtState(l, c);
      if (st === 'repaid') return { result: 'repaid', text: 'Bạn đã trả hết khoản vay lo viện phí năm ' + c.origin.age + ' tuổi. ' + (c.data.loan === 'family' ? 'Họ hàng nhắc đến bạn như người giữ chữ tín.' : 'Không còn ai gọi điện đòi nợ lúc nửa đêm.'), kind: 'good' };
      if (st === 'defaulted') return { result: 'defaulted' }; // hậu quả vỡ nợ đã do hệ thống vay xử lý và kể lại
    },
    stages: [
      { dec: 'ch144_debt_due', after: [1, 3], p: 0.6, tag: 'pressure',
        when: function (l) { return free(l); },
        title: function (l, c) { return c.data.loan === 'family' ? 'Họ hàng hỏi chuyện tiền' : 'Lãi vay nóng đến hạn'; },
        text: function (l, c) { var L = loanOf(l, c); return 'Khoản vay lo viện phí cho ' + (c.data.who || 'người thân') + ' năm ' + c.origin.age + ' tuổi còn ' + mo(l, L ? L.bal : 0) + '. ' + (c.data.loan === 'family' ? 'Một người cô gọi điện: nhà cô sắp cưới vợ cho con, hỏi bạn xoay được chưa.' : 'Người cho vay nhắn tin liên tục, đòi trả gốc.'); },
        opts: [
          { k: 'pay', l: 'Gom tiền trả một nửa', req: function (l) { return l.money > 0; }, ai: { w: 1.2 }, run: function (l, r, log, c) { settle(l, c, 0.5, 'Trả bớt nợ viện phí'); fx(l, { soc: 2 }); log('Bạn dồn tiền tiết kiệm trả một nửa, hẹn rõ ngày trả phần còn lại.', 'good'); advance(l, c); } },
          { k: 'extend', l: 'Gặp trực tiếp xin thêm thời gian', ai: { w: 1, soc: 0.5 }, run: function (l, r, log, c) { stress(l, 4); if (c.data.loan === 'nong') { var L = loanOf(l, c); if (L) L.bal *= 1.1; } log(c.data.loan === 'family' ? 'Bạn đến tận nhà xin khất thêm. Cô thở dài nhưng đồng ý.' : 'Người cho vay đồng ý gia hạn, kèm thêm một khoản phí.', 'neutral'); advance(l, c); } },
          { k: 'avoid', l: 'Tránh mặt, chờ có tiền rồi tính', ai: { w: 0.5, bad: 0.6 }, run: function (l, r, log, c) { c.data.avoid = true; fx(l, { soc: -5, karma: -2 }); stress(l, 6); log('Bạn bắt đầu ngại nghe điện thoại, né những buổi giỗ chạp họ hàng.', 'bad'); advance(l, c); } }
        ] },
      { dec: 'ch144_debt_end', after: [2, 4], p: 0.5, tag: 'pressure',
        when: function (l) { return free(l); },
        lapse: function (l, c) { close(l, c, 'lingering'); },
        title: 'Món nợ cũ',
        text: function (l, c) { var L = loanOf(l, c); return 'Đã ' + (l.age - c.origin.age) + ' năm từ khoản vay lo viện phí, vẫn còn ' + mo(l, L ? L.bal : 0) + '.' + (c.data.avoid ? ' Họ hàng bắt đầu nói ra nói vào chuyện bạn tránh mặt.' : ''); },
        opts: [
          { k: 'sellveh', l: 'Bán xe để trả dứt điểm', req: function (l) { return !!l.veh && (l.vehVal || 0) > 0; }, ai: { w: 1 }, run: function (l, r, log, c) { var v = l.vehVal || 0; l.veh = null; l.vehName = null; l.vehK = null; l.vehVal = 0; H.cash(l, v, 'Bán xe trả nợ'); settle(l, c, 1, 'Trả dứt nợ viện phí'); log(c.data.cleared ? 'Bạn bán xe, trả nốt món nợ cũ. Đi làm bằng xe buýt nhưng nhẹ lòng.' : 'Bạn bán xe trả được phần lớn món nợ cũ; phần còn lại hẹn trả dần.', c.data.cleared ? 'good' : 'neutral'); close(l, c, c.data.cleared ? 'repaid' : 'partly'); } },
          { k: 'plan', l: 'Cam kết trả góp hằng tháng', ai: { w: 1.1 }, run: function (l, r, log, c) { var L = loanOf(l, c); if (L) L.minShare = Math.max(L.minShare || 0, 0.35); fx(l, { soc: 2 }); log('Bạn lập kế hoạch trả góp rõ ràng, mỗi tháng trích lương trả đúng hẹn.', 'neutral'); close(l, c, 'plan'); } },
          { k: 'ignore', l: 'Mặc kệ, ai đòi thì tính', ai: { w: 0.4, bad: 0.8 }, run: function (l, r, log, c) { fx(l, { soc: -8, hap: -3 }); if (c.data.loan === 'nong' && E.DEC.chu_no) H.sched(l, 'chu_no', 1); log('Bạn mặc kệ món nợ. Quan hệ họ hàng nguội dần' + (c.data.loan === 'nong' ? ', người đòi nợ bắt đầu tìm đến nhà.' : '.'), 'bad'); close(l, c, 'strained'); } }
        ] }
    ]
  });
  onOrigin('vd_vay_chua_benh', function (l, k, d, before) {
    var L = (l.loans || [])[before.loans];
    if ((k === 'ho_hang' || k === 'nong') && L && (L.type === 'family' || L.type === 'nong')) {
      var f = l.fam || {}, m = !f.noMom && f.mAlive, b = !f.noDad && f.fAlive;
      start(l, 'debt', { dec: 'vd_vay_chua_benh', k: k }, { data: { loan: L.type, since: L.since, who: m && b ? 'bố mẹ' : m ? 'mẹ' : 'bố' } });
    }
  });

  // ===================================================================
  // 5. GIA ĐÌNH — phản đối bố/mẹ đi bước nữa → xa cách → cơ hội hòa giải (hoặc không kịp)
  // ===================================================================
  function parentRef(l, c) { var f = l.fam || {}; return f[c.data.side + 'Alive'] && !(c.data.side === 'f' && f.noDad) ? 'parent:' + c.data.side : null; }
  define('family', {
    cancel: function (l, c) {
      if (!parentRef(l, c)) return { result: 'lost', text: 'Lời xin lỗi về chuyện năm ' + c.origin.age + ' tuổi chưa kịp nói ra. ' + U.cap(c.data.side === 'm' ? 'mẹ' : 'bố') + ' đã đi xa, có những điều không còn ai để nghe.', kind: 'bad' };
    },
    stages: [
      { dec: 'ch144_fam_distance', after: [1, 3], p: 0.55, tag: 'parentCare',
        when: function (l) { return free(l); },
        title: 'Khoảng cách với bố mẹ',
        text: function (l, c) { var p = c.data.side === 'm' ? 'mẹ' : 'bố'; return 'Từ năm ' + c.origin.age + ' tuổi, khi bạn phản đối chuyện ' + p + ' đi bước nữa, ' + p + ' ít gọi điện hẳn. Những lần về nhà, hai người chỉ nói chuyện thời tiết.'; },
        opts: [
          { k: 'visit', l: 'Về thăm trước, hỏi han bố mẹ', ai: { w: 1.2, soc: 0.5 }, run: function (l, r, log, c) { trust(l, parentRef(l, c), 6); tension(l, 'parent', c.data.side, -6); fx(l, { hap: 2 }); c.data.warm = (c.data.warm || 0) + 1; log('Bạn về nhà một chuyến. Bữa cơm còn ngượng ngùng, nhưng ' + (c.data.side === 'm' ? 'mẹ' : 'bố') + ' gắp thức ăn cho bạn.', 'good'); advance(l, c); } },
          { k: 'mediate', l: 'Nhờ anh chị em nói giúp', req: function (l) { return (l.sibList || []).some(function (s) { return s && s.alive !== false; }); }, ai: { w: 0.8 }, run: function (l, r, log, c) { trust(l, parentRef(l, c), 3); tension(l, 'parent', c.data.side, -3); log('Anh chị em làm cầu nối, kể cho bố mẹ nghe cuộc sống của bạn.', 'neutral'); advance(l, c); } },
          { k: 'distance', l: 'Giữ khoảng cách, tự lo cuộc sống', ai: { w: 0.7 }, run: function (l, r, log, c) { trust(l, parentRef(l, c), -4); tension(l, 'parent', c.data.side, 4); c.data.cold = true; log('Bạn chọn giữ khoảng cách. Những dịp lễ Tết, bạn chỉ gửi quà về.', 'neutral'); advance(l, c, [2, 6]); } }
        ] },
      { dec: 'ch144_fam_reconcile', after: [1, 5], tag: 'parentCare',
        p: function (l, c) { var kid = (l.kids || []).some(function (k) { return k.alive !== false && k.born >= c.since; }); return (c.data.warm ? 0.45 : 0.25) + (kid ? 0.2 : 0); },
        when: function (l) { return free(l); },
        lapse: function (l, c) { close(l, c, c.data.cold ? 'estranged' : 'thawing'); },
        prep: function (l, c) { var kid = (l.kids || []).filter(function (k) { return k.alive !== false && k.born >= c.since; })[0]; return { kid: kid ? kid.name : '' }; },
        title: 'Một cơ hội hòa giải',
        text: function (l, c, d) { var who = c.data.side === 'm' ? 'Mẹ' : 'Bố'; return (d.kid ? who + ' nghe tin bé ' + d.kid + ' ra đời, gọi điện hỏi có được lên thăm cháu không.' : who + ' gọi điện, nói dạo này hay nhớ bạn.') + ' Đã ' + (l.age - c.origin.age) + ' năm từ ngày bạn phản đối chuyện ' + who.toLowerCase() + ' đi bước nữa.'; },
        opts: [
          { k: 'reconcile', l: 'Mời về chơi, nói lời làm lành', ai: { w: 1.3, soc: 0.6 }, run: function (l, r, log, c) { trust(l, parentRef(l, c), 10); tension(l, 'parent', c.data.side, -12); fx(l, { hap: 6 }); H.mem(l, 'Ngày làm lành với ' + (c.data.side === 'm' ? 'mẹ' : 'bố') + ' sau ' + (l.age - c.origin.age) + ' năm xa cách.', 5); log('Hai bên ngồi lại, không ai nhắc chuyện cũ. Ngôi nhà lại có tiếng cười.', 'good'); close(l, c, 'reconciled'); } },
          { k: 'slow', l: 'Đồng ý gặp, nhưng chậm rãi từng bước', ai: { w: 1 }, run: function (l, r, log, c) { trust(l, parentRef(l, c), 4); tension(l, 'parent', c.data.side, -4); log('Bạn đồng ý gặp. Khoảng cách chưa hết, nhưng cuộc gọi về nhà đã đều hơn.', 'neutral'); close(l, c, 'thawing'); } },
          { k: 'refuse', l: 'Chưa sẵn sàng, từ chối', ai: { w: 0.5 }, run: function (l, r, log, c) { trust(l, parentRef(l, c), -6); tension(l, 'parent', c.data.side, 5); fx(l, { hap: -3 }); log('Bạn từ chối. Đầu dây bên kia im lặng rất lâu.', 'bad'); close(l, c, 'estranged'); } }
        ] }
    ]
  });
  onOrigin('di_buoc_nua', function (l, k) { var f = l.fam || {}; if (k === 'phan_doi' && f.fAlive !== f.mAlive) start(l, 'family', { dec: 'di_buoc_nua', k: k }, { data: { side: f.fAlive ? 'f' : 'm' } }); });

  // ===================================================================
  // 6. HÔN NHÂN — "Hôn nhân rạn nứt", chọn hàn gắn → khủng hoảng lòng tin kéo dài → hàn gắn thật sự hoặc chia tay
  // ===================================================================
  define('marriage', {
    cancel: function (l, c) { if (!partnerSame(l, c)) return { result: 'ended' }; },
    stages: [
      { dec: 'ch144_love_after', after: [1, 2], p: 0.6, tag: 'partnerConflict',
        when: function (l) { return free(l); },
        title: 'Sau trận cãi vã',
        text: function (l, c) { return 'Từ lần hôn nhân rạn nứt ' + ago(l, c) + (c.data.money ? ', phần nhiều vì chuyện tiền bạc' : '') + ', hai người quyết định ở lại với nhau. Nhưng ' + l.partner.name + ' ít chia sẻ hơn, bữa cơm tối thường chỉ có tiếng tivi.'; },
        opts: [
          { k: 'counsel', l: 'Rủ nhau đi tư vấn hôn nhân', h: function (l) { return '~' + mo(l, V(l, 4)); }, req: function (l) { return l.money > V(l, 4); }, ai: { w: 1, smart: 0.5 }, run: function (l, r, log, c) { H.cash(l, -V(l, 4), 'Tư vấn hôn nhân'); trust(l, c.npc.ref, 8); tension(l, 'partner', 0, -8); log('Hai người ngồi trước chuyên gia tư vấn, lần đầu nghe đối phương nói hết những điều chất chứa.', 'good'); advance(l, c); } },
          { k: 'talk', l: 'Chủ động mở lời xin lỗi, trò chuyện', ai: { w: 1.2, soc: 0.5 }, run: function (l, r, log, c) { trust(l, c.npc.ref, 4); tension(l, 'partner', 0, -4); log('Bạn mở lời trước. ' + l.partner.name + ' im lặng một lúc rồi kể những điều mình đã buồn.', 'neutral'); advance(l, c); } },
          { k: 'avoid', l: 'Im lặng cho qua, ai lo việc nấy', ai: { w: 0.6 }, run: function (l, r, log, c) { trust(l, c.npc.ref, -6); tension(l, 'partner', 0, 6); log('Không ai nhắc lại chuyện cũ, nhưng khoảng cách giữa hai người lớn dần.', 'bad'); advance(l, c); } }
        ] },
      { dec: 'ch144_love_cross', after: [1, 3], p: 0.55, tag: 'partnerConflict',
        when: function (l) { return free(l); },
        lapse: function (l, c) { close(l, c, relTrust(l, c.npc.ref) >= 60 ? 'repaired' : 'fragile'); },
        prep: function (l, c) { return { ok: relTrust(l, c.npc.ref) >= 60 }; },
        title: function (l, c) { return relTrust(l, c.npc.ref) >= 60 ? 'Qua cơn sóng gió' : 'Niềm tin chưa trở lại'; },
        text: function (l, c, d) { return d.ok ? 'Đã ' + (l.age - c.origin.age) + ' năm từ lần cãi vã lớn. ' + l.partner.name + ' đề nghị kỷ niệm ngày hai người làm lành.' : 'Đã ' + (l.age - c.origin.age) + ' năm từ lần cãi vã lớn, ' + l.partner.name + ' vẫn chưa tin bạn như trước. Một tối, người ấy hỏi: "Mình còn muốn cố gắng không?"'; },
        opts: [
          { k: 'celebrate', l: 'Đi chơi xa cùng nhau', req: function (l, c, d) { return d.ok; }, ai: { w: 1.2 }, run: function (l, r, log, c) { trust(l, c.npc.ref, 4); fx(l, { hap: 6 }); H.mem(l, 'Chuyến đi đánh dấu hai người vượt qua lần rạn nứt.', 4); log('Hai người đi chơi xa, nhắc lại lần cãi vã như một kỷ niệm đã qua.', 'good'); close(l, c, 'repaired'); } },
          { k: 'retry', l: 'Cùng cố gắng thêm một lần', req: function (l, c, d) { return !d.ok; }, ai: { w: 1.1 }, run: function (l, r, log, c) { trust(l, c.npc.ref, 6); tension(l, 'partner', 0, -6); var t = relTrust(l, c.npc.ref); log(t >= 60 ? 'Lần này cả hai thật sự lắng nghe nhau. Mọi chuyện dần ấm lại.' : 'Hai người cố gắng, nhưng vết rạn vẫn còn đó.', t >= 60 ? 'good' : 'neutral'); close(l, c, t >= 60 ? 'repaired' : 'fragile'); } },
          { k: 'separate', l: 'Nói thẳng chuyện chia tay', req: function (l, c, d) { return !d.ok; }, ai: { w: 0.4 }, run: function (l, r, log, c) { tension(l, 'partner', 0, 10); log('Bạn nói ra điều cả hai đều nghĩ đến. Năm sau hai người sẽ quyết định có ly hôn hay không.', 'bad'); H.sched(l, 'divorce', 1); close(l, c, 'separating'); } },
          { k: 'coexist', l: 'Sống chung vì con, vì gia đình', req: function (l, c, d) { return !d.ok; }, ai: { w: 0.7 }, run: function (l, r, log, c) { fx(l, { hap: -4 }); log('Hai người chọn sống chung, lịch sự với nhau như những người bạn cùng nhà.', 'neutral'); close(l, c, 'distant'); } }
        ] }
    ]
  });
  (function () {
    var D = E.DEC.divorce, apply = D && D.apply;
    if (!apply) return;
    D.apply = function (l, d, k) {
      var p = l.partner, money = l.money < 0, res = apply.apply(this, arguments);
      if (k === 'fix' && l.alive && p && l.partner === p && p.alive !== false) start(l, 'marriage', { dec: 'divorce', k: k }, { npc: { ref: X.uid(l, p), name: p.name }, data: { money: money } });
      return res;
    };
  })();

  // ===================================================================
  // 7. BẠN BÈ — ở bên bạn lúc khó → nhiều năm sau người ấy giúp lại; làm ngơ → xa cách → xin lỗi
  // ===================================================================
  define('friend', {
    max: 2,
    cancel: function (l, c) { if (!npcAlive(l, c)) return { result: 'gone' }; },
    stages: [
      { dec: function (l, c) { return c.data.helped ? 'ch144_friend_return' : 'ch144_friend_drift'; },
        after: [1, 3], tag: 'socialBond',
        p: function (l, c) { return c.data.helped ? 0.25 : 0.4; },
        when: function (l, c) { return free(l) && (c.data.helped ? hardship(l) : true); },
        lapse: function (l, c, log) { var f = friendObj(l, c); if (c.data.helped && f) { f.close = U.clamp((f.close || 50) + 4, 0, 100); close(l, c, 'bond', log, c.npc.name + ' vẫn nhớ đêm bạn chạy đến năm ' + c.origin.age + ' tuổi; mỗi dịp Tết lại nhắn tin hỏi thăm.', 'good'); } else close(l, c, 'drifted'); } }
    ]
  });
  SC('ch144_friend_return', {
    title: function (l, d) { var c = d && chain(l, d.cid); return c ? c.npc.name + ' tìm đến' : 'Bạn cũ tìm đến'; },
    prep: function (l, r, arg) { return { cid: arg && arg.cid, token: arg && arg.token, done: false }; },
    valid: function (l, d) { var c = d && chain(l, d.cid); return !!(l.alive && c && c.kind === 'friend' && c.stage === 0 && c.open && c.open.token === d.token && !d.done && npcAlive(l, c)); },
    text: function (l, d) { var c = chain(l, d.cid); return c ? 'Năm ' + c.origin.age + ' tuổi, bạn ở bên ' + c.npc.name + ' khi người ấy ' + (c.data.why || 'gặp chuyện') + '. Giờ đến lượt bạn khó khăn, ' + c.npc.name + ' tìm đến: "Hồi đó có cậu, giờ để tớ."' : ''; },
    opts: [
      { k: 'accept', l: 'Nhận sự giúp đỡ', ai: { w: 1.3 }, run: function (l, r, log, d) { var c = friendStep(l, d, 'accept'); if (!c) return; H.cash(l, V(l, 15), c.npc.name + ' giúp lúc khó khăn'); fx(l, { hap: 6 }); var f = friendObj(l, c); if (f) f.close = U.clamp((f.close || 50) + 6, 0, 100); H.mem(l, c.npc.name + ' giúp bạn qua cơn khó, như bạn từng ở bên người ấy.', 5); log(c.npc.name + ' giúp bạn một khoản và nhiều lời động viên. Có những ân tình đi một vòng rồi quay lại.', 'good'); close(l, c, 'returned'); } },
      { k: 'decline', l: 'Cảm ơn, chỉ cần ngồi nói chuyện', ai: { w: 0.8 }, run: function (l, r, log, d) { var c = friendStep(l, d, 'decline'); if (!c) return; stress(l, -6); fx(l, { hap: 3 }); var f = friendObj(l, c); if (f) f.close = U.clamp((f.close || 50) + 4, 0, 100); log('Bạn không nhận tiền, chỉ ngồi nói chuyện với ' + c.npc.name + ' đến khuya. Nhẹ lòng hơn nhiều.', 'good'); close(l, c, 'bond'); } }
    ]
  });
  SC('ch144_friend_drift', {
    title: function (l, d) { var c = d && chain(l, d.cid); return c ? 'Lâu rồi không gặp ' + c.npc.name : 'Bạn cũ'; },
    prep: function (l, r, arg) { return { cid: arg && arg.cid, token: arg && arg.token, done: false }; },
    valid: function (l, d) { var c = d && chain(l, d.cid); return !!(l.alive && c && c.kind === 'friend' && c.stage === 0 && c.open && c.open.token === d.token && !d.done && npcAlive(l, c)); },
    text: function (l, d) { var c = chain(l, d.cid); return c ? 'Từ đêm ' + c.npc.name + ' gọi lúc ' + (c.data.why || 'gặp chuyện') + ' mà bạn chỉ nhắn vài dòng (' + ago(l, c) + '), hai người ít liên lạc hẳn. Bạn thấy ảnh người ấy trên mạng.' : ''; },
    opts: [
      { k: 'apologize', l: 'Nhắn tin xin lỗi, hẹn cà phê', ai: { w: 1.1, soc: 0.6 }, run: function (l, r, log, d) { var c = friendStep(l, d, 'apologize'); if (!c) return; var f = friendObj(l, c); if (f) f.close = U.clamp((f.close || 50) + 10, 0, 100); fx(l, { hap: 3 }); log('Bạn xin lỗi vì lần ấy. ' + c.npc.name + ' cười: "Tớ cũng giận một thời gian, giờ thì thôi."', 'good'); close(l, c, 'mended'); } },
      { k: 'let', l: 'Để mọi chuyện trôi theo thời gian', ai: { w: 0.7 }, run: function (l, r, log, d) { var c = friendStep(l, d, 'let'); if (!c) return; var f = friendObj(l, c); if (f) f.close = U.clamp((f.close || 50) - 5, 0, 100); log('Bạn bấm thích tấm ảnh rồi lướt qua. Có những người bạn cứ thế xa dần.', 'neutral'); close(l, c, 'drifted'); } }
    ]
  });
  function friendStep(l, d, k) {
    var D = E.DEC[d && d.cid && chain(l, d.cid) && chain(l, d.cid).data.helped ? 'ch144_friend_return' : 'ch144_friend_drift'];
    if (!D || !D.valid(l, d)) return null;
    var c = chain(l, d.cid); d.done = true; c.open = null; c.last = l.age; note(c, k); return c;
  }
  onOrigin('ban_than_kho', function (l, k, d, before) {
    var f = E.friendsOf(l).concat(E.friendsFar?E.friendsFar(l):[]).filter(function (x) { return d.uid894 ? X.uid(l,x)===d.uid894 : x.name === d.n; })[0];
    if (!f || !X) return;
    var unpaid = k === 'cho_vay' && l.money < before.money - V(l, 10);
    var helped = k === 'o_ben' || k === 'cho_vay' && !unpaid;
    if (unpaid) return; // khoản cho vay chưa trả đã có hệ quả riêng (tình bạn rạn) ở sự kiện gốc
    start(l, 'friend', { dec: 'ban_than_kho', k: k }, { npc: { ref: X.uid(l, f), name: f.name }, data: { helped: helped, why: d.why } });
    var c = active(l, 'friend');
    if (c && helped) setWindow(c, [3, 12], l.age);
  });

  // ===================================================================
  // 8. SỨC KHỎE — tai nạn → phục hồi / mặc kệ → ảnh hưởng nhiều năm sau, đổi lối sống
  // ===================================================================
  function manual(l) { var c = l.job && E.jobDef ? E.jobDef(l) : null; return !!c && (/^(worker|poor|farm)$/.test(c.cat || '') || /^(phu_ho|giup_viec|shipper|xe_om|cong_nhan|tho_|bao_ve|tx_)/.test(E.resolveJob(l.job.id))); }
  define('health', {
    stages: [
      { dec: 'ch144_health_rehab', after: [1, 2], p: 0.6, tag: 'fatigue',
        when: function (l) { return free(l); },
        title: 'Vết thương sau tai nạn',
        text: function (l, c) { return 'Từ vụ ' + (c.data.what || 'tai nạn') + ' năm ' + c.origin.age + ' tuổi, ' + (l.flags.dauLung ? 'trở trời là lưng và khớp lại đau âm ỉ.' : 'vết mổ đã lành nhưng tay chân chưa linh hoạt như trước.') + ' Bác sĩ khuyên tập phục hồi chức năng.'; },
        opts: [
          { k: 'physio', l: 'Theo đủ liệu trình vật lý trị liệu', h: function (l) { return '~' + mo(l, V(l, 6)); }, req: function (l) { return l.money > V(l, 6) * 0.5; }, ai: { w: 1.2, smart: 0.5 }, run: function (l, r, log, c) { if (E.medBill) E.medBill(l, V(l, 6), 'Vật lý trị liệu sau tai nạn', log, 0.5); else H.cash(l, -V(l, 6), 'Vật lý trị liệu sau tai nạn'); fx(l, { hea: 6 }); c.data.rehab = true; if (l.flags.dauLung && r() < 0.7) { delete l.flags.dauLung; log('Ba tháng vật lý trị liệu đều đặn, cơn đau lưng cũ gần như biến mất.', 'good'); } else log('Bạn theo đủ liệu trình. Cơ thể hồi phục dần, đi lại nhẹ nhàng hơn.', 'good'); advance(l, c); } },
          { k: 'habit', l: 'Tự tập nhẹ mỗi sáng, ăn uống điều độ', ai: { w: 1 }, run: function (l, r, log, c) { fx(l, { hea: 3 }); stress(l, -3); c.data.habit = true; log('Bạn tập giãn cơ mỗi sáng. Thói quen nhỏ, nhưng giữ được nhiều năm.', 'neutral'); advance(l, c); } },
          { k: 'ignore', l: 'Mặc kệ, đi làm kiếm tiền đã', ai: { w: 0.8, risk: 0.6 }, run: function (l, r, log, c) { if (!l.flags.dauLung && manual(l) && r() < 0.4) { l.flags.dauLung = true; log('Gồng làm việc nặng khi chưa hồi phục hẳn, lưng bắt đầu đau mỗi khi trở trời.', 'bad'); } else log('Bạn gác chuyện tập luyện sang một bên, lao vào công việc.', 'neutral'); advance(l, c); } }
        ] },
      { after: [2, 6], tag: 'fatigue',
        p: function (l) { return l.flags.dauLung ? 0.45 : 0.35; },
        // Đau tái phát thì có lựa chọn; đã tập phục hồi thì chỉ ghi một dòng kết; mặc kệ mà không sao thì khép lại lặng lẽ.
        when: function (l, c) { return free(l) && l.age >= 25 && (!!l.flags.dauLung || !!(c.data.rehab || c.data.habit)); },
        lapse: function (l, c) { close(l, c, l.flags.dauLung ? 'chronic' : 'recovered'); },
        dec: function (l) { return l.flags.dauLung ? 'ch144_health_flare' : null; },
        narrate: function (l, c, log) { fx(l, { hea: 2 }); close(l, c, 'recovered', log, 'Thói quen tập luyện có từ sau vụ ' + (c.data.what || 'tai nạn') + ' năm ' + c.origin.age + ' tuổi giúp bạn khỏe hơn nhiều người cùng tuổi.', 'good'); } }
    ]
  });
  SC('ch144_health_flare', {
    title: 'Vết thương cũ tái phát',
    prep: function (l, r, arg) { return { cid: arg && arg.cid, token: arg && arg.token, done: false }; },
    valid: function (l, d) { var c = d && chain(l, d.cid); return !!(l.alive && c && c.kind === 'health' && c.stage === 1 && c.open && c.open.token === d.token && !d.done && l.flags.dauLung); },
    text: function (l, d) { var c = chain(l, d.cid); return c ? 'Đã ' + (l.age - c.origin.age) + ' năm từ vụ ' + (c.data.what || 'tai nạn') + '. Cơn đau cũ quay lại, có hôm không cúi xuống nổi' + (manual(l) ? '; công việc nặng nhọc càng làm bệnh nặng thêm.' : '.') : ''; },
    opts: [
      { k: 'lighter', l: 'Chuyển sang việc nhẹ nhàng hơn', req: function (l) { return manual(l); }, ai: { w: 1, smart: 0.5 }, run: function (l, r, log, d) { var c = healthStep(l, d, 'lighter'); if (!c) return; l.lastJob = l.job; l.job = null; l.flags.needJob = true; fx(l, { hea: 4, hap: -2 }); log('Bạn nghỉ công việc nặng nhọc, tìm một việc hợp sức khỏe hơn. Thu nhập trước mắt giảm, lưng đỡ đau.', 'neutral'); close(l, c, 'changed_work'); } },
      { k: 'treat', l: 'Điều trị dài hạn, kiên trì tập', h: function (l) { return '~' + mo(l, V(l, 10)); }, ai: { w: 1.1 }, run: function (l, r, log, d) { var c = healthStep(l, d, 'treat'); if (!c) return; if (E.medBill) E.medBill(l, V(l, 10), 'Điều trị đau lưng mạn tính', log, 0.5); else H.cash(l, -V(l, 10), 'Điều trị đau lưng mạn tính'); if (r() < 0.6) { delete l.flags.dauLung; fx(l, { hea: 6 }); log('Một năm kiên trì điều trị, cơn đau cũ lui hẳn.', 'good'); close(l, c, 'recovered'); } else { fx(l, { hea: 2 }); log('Điều trị giúp đỡ đau, nhưng bác sĩ nói bạn phải sống chung với nó.', 'neutral'); close(l, c, 'chronic'); } } },
      { k: 'endure', l: 'Uống thuốc giảm đau, cố tiếp', ai: { w: 0.6, risk: 0.6 }, run: function (l, r, log, d) { var c = healthStep(l, d, 'endure'); if (!c) return; fx(l, { hea: -6, hap: -3 }); log('Bạn uống thuốc giảm đau để đi làm tiếp. Cơn đau thành người bạn đồng hành.', 'bad'); close(l, c, 'chronic'); } }
    ]
  });
  function healthStep(l, d, k) { if (!E.DEC.ch144_health_flare.valid(l, d)) return null; var c = chain(l, d.cid); d.done = true; c.open = null; c.last = l.age; note(c, k); return c; }
  onOrigin('ld_tai_nan_lao_dong', function (l, k) { start(l, 'health', { dec: 'ld_tai_nan_lao_dong', k: k }, { data: { what: 'tai nạn khi làm việc' } }); });
  onOrigin('phau_thuat', function (l, k, d) { if (d && /tai nạn/.test(d.why || '')) start(l, 'health', { dec: 'phau_thuat', k: k }, { data: { what: 'tai nạn giao thông' } }); });

  E.CHAIN144 = {
    KINDS: KINDS, start: start, close: close, advance: advance, chain: chain, active: active, state: state, yearly: yearly,
    summary: function (l) { var s = l.flags && l.flags.chains144; return valid(s) ? { active: s.active.map(function (c) { return { kind: c.kind, stage: c.stage, since: c.since }; }), done: s.done.map(function (c) { return { kind: c.kind, result: c.result, end: c.end }; }) } : { active: [], done: [] }; }
  };
})(globalThis.G);
