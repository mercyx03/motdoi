/* Showbiz — Mốc 3 (phần 1): trò chơi nhỏ có luật thật, gameshow vận động và gameshow chiến thuật.
   · E.MINI152: các trò có quy tắc xác định (xé bảng tên theo khu vực, suy luận manh mối, oẳn tù tì với người dẫn có thói quen,
     đoán số lớn / nhỏ, bốc thăm bát đắng, đấu giá kín, số lớn nhất duy nhất, thế lưỡng nan tù nhân, bốc sỏi Nim).
     Người chơi đọc được dấu hiệu và suy luận để thắng; NPC chơi theo chiến thuật riêng, không chỉ tung xúc xắc thắng thua.
   · Running Man Việt Nam / 2 Ngày 1 Đêm (life48) giữ nguyên mùa quay, cát-xê, số tập; các chặng đặc trưng (săn manh mối, xé bảng tên,
     giành bữa tối, giành chỗ ngủ) nay được quyết định bằng trò chơi nhỏ tương ứng.
   · Chương trình mới qua E.SHOW151: Running Man Hàn Quốc, New Journey to the West, The Genius, The Devil's Plan, Bloody Game.
   Mọi diễn biến, khách mời và người chơi khác là mô phỏng hư cấu. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, SH = E.SHOW151, C = E.ELITE148;
  var seeded = SH.seeded, hash = SH.hash, V = SH.V;
  function yr(l) { return l.birthYear + l.age; }
  function pick(r, a) { return a[Math.floor(r() * a.length)]; }
  function shuffle(r, a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function ri(r, a, b) { return a + Math.floor(r() * (b - a + 1)); }
  function wit(l) { return U.clamp(SH.knowledge(l) * 0.6 + ((l.st && l.st.soc) || 50) / 250, 0, 1); }
  function fit(l) { return U.clamp(((l.st && l.st.hea) || 60) / 100, 0, 1); }
  function cast(l, r, n, sexes) { return Array.from({ length: n }, function (x, i) { var s = sexes ? sexes[i % sexes.length] : r() < 0.5 ? 'M' : 'F'; return { name: H.stranger(l, r, s), sex: s, skill: 0.35 + r() * 0.5, style: pick(r, ['cautious', 'bold', 'greedy', 'fair', 'random']), honesty: Math.round(15 + r() * 85), pts: 0, out: false }; }); }

  // ===================================================================
  // E.MINI152 — trò chơi nhỏ: init(seed, ctx) → trạng thái; rows(st) → lựa chọn; play(st, key) → { done, won, text }
  // ===================================================================
  var ZONES = ['kho hàng', 'sân thượng', 'hành lang', 'bãi xe'];
  var PLACES = [{ n: 'bể bơi', out: true, water: true, high: false, gate: false }, { n: 'sân thượng', out: true, water: false, high: true, gate: false }, { n: 'phòng chờ', out: false, water: false, high: false, gate: true }, { n: 'nhà kính', out: false, water: true, high: false, gate: false }, { n: 'ban công tầng 5', out: true, water: false, high: true, gate: true }, { n: 'tầng hầm', out: false, water: false, high: false, gate: false }];
  var MOVES = ['búa', 'kéo', 'bao'], BEATS = { 'búa': 'kéo', 'kéo': 'bao', 'bao': 'búa' }, LOSES_TO = { 'kéo': 'búa', 'bao': 'kéo', 'búa': 'bao' };
  var MINI = {
    // Xé bảng tên: 3 vòng; mỗi "thợ săn" đi theo vòng khu vực cố định của mình (đọc được từ lần thấy trước).
    chase: {
      n: 'Xé bảng tên',
      init: function (seed, ctx) { var r = seeded(seed), hunters = (ctx.names || ['A', 'B', 'C']).slice(0, 3).map(function (n) { return { n: n, z: ri(r, 0, 3), step: pick(r, [1, 3]), honest: r() < 0.6, out: false }; }); return { kind: 'chase', round: 0, hunters: hunters, seen: hunters.map(function (h) { return h.z; }), ally: null, elim: 0, alive: true }; },
      where: function (h, round) { return (h.z + h.step * round) % ZONES.length; },
      text: function (st) { return 'Vòng ' + (st.round + 1) + '/3. Lần trước thấy: ' + st.hunters.map(function (h, i) { return h.out ? h.n + ' (đã bị xé bảng tên)' : h.n + ' ở ' + ZONES[st.seen[i]]; }).join(', ') + '. Mỗi người có thói quen di chuyển riêng giữa các khu vực theo một vòng cố định (' + ZONES.join(' → ') + ' → …).' + (st.ally != null ? ' Bạn đang liên minh với ' + st.hunters[st.ally].n + '.' : ''); },
      rows: function (st) { var rows = ZONES.map(function (z, i) { return { k: 'hide' + i, l: 'Ẩn nấp ở ' + z }; }).concat(ZONES.map(function (z, i) { return { k: 'amb' + i, l: 'Phục kích ở ' + z }; })); if (st.ally == null) st.hunters.forEach(function (h, i) { if (!h.out) rows.push({ k: 'ally' + i, l: 'Đề nghị liên minh với ' + h.n }); }); return rows; },
      play: function (st, k) {
        var round = st.round + 1, pos = st.hunters.map(function (h) { return MINI.chase.where(h, round); }), t;
        if (/^ally/.test(k)) { var i = +k.slice(4); st.ally = i; t = st.hunters[i].n + ' gật đầu liên minh' + (st.hunters[i].honest ? '.' : ', nhưng ánh mắt có vẻ toan tính.'); }
        else {
          var z = +k.slice(k.startsWith('hide') ? 4 : 3), here = st.hunters.map(function (h, i) { return { h: h, i: i }; }).filter(function (x) { return !x.h.out && pos[x.i] === z; }), threats = here.filter(function (x) { return !(x.i === st.ally && x.h.honest); });
          if (k.startsWith('hide')) { if (threats.length) { st.alive = false; t = threats[0].h.n + ' tìm thấy chỗ bạn nấp ở ' + ZONES[z] + ' và xé bảng tên của bạn.'; } else t = 'Bạn nấp an toàn ở ' + ZONES[z] + (here.length ? ' (đồng minh đi ngang qua giữ bí mật).' : '.'); }
          else if (threats.length === 1 && here.length === 1) { threats[0].h.out = true; st.elim++; t = 'Bạn phục kích ở ' + ZONES[z] + ' và xé được bảng tên của ' + threats[0].h.n + '!'; }
          else if (threats.length >= 2) { st.alive = false; t = 'Phục kích ở ' + ZONES[z] + ' gặp cùng lúc ' + threats.map(function (x) { return x.h.n; }).join(' và ') + ', bạn bị xé bảng tên.'; }
          else if (here.length && !threats.length) { var al = here[0].h; if (!al.honest) { st.alive = false; t = al.n + ' phản bội liên minh và xé bảng tên của bạn!'; } else t = 'Ở ' + ZONES[z] + ' chỉ có đồng minh của bạn.'; }
          else t = 'Không ai đến ' + ZONES[z] + '.';
        }
        st.seen = pos; st.round = round;
        var done = !st.alive || st.round >= 3 || st.hunters.every(function (h) { return h.out; });
        return { done: done, won: done && st.alive && st.elim >= 1, text: t };
      },
      auto: function (st, r, skill) { var round = st.round + 1, pos = st.hunters.map(function (h, i) { return h.out ? -1 : MINI.chase.where(h, round); }); if (r() < skill) { var lone = ZONES.map(function (z, i) { return pos.filter(function (p) { return p === i; }).length; }), one = lone.indexOf(1), empty = lone.indexOf(0); return one >= 0 && r() < 0.6 ? 'amb' + one : empty >= 0 ? 'hide' + empty : 'hide0'; } return 'hide' + ri(r, 0, 3); }
    },
    // Suy luận manh mối: các gợi ý đủ để chỉ còn đúng một nơi.
    clue: {
      n: 'Săn manh mối',
      init: function (seed) {
        var r = seeded(seed), places = shuffle(r, PLACES).slice(0, 4), target = pick(r, places), attrs = ['out', 'water', 'high', 'gate'], clues = [], cand = places.slice();
        shuffle(r, attrs).forEach(function (a) { if (cand.length <= 1) return; var keep = cand.filter(function (p) { return p[a] === target[a]; }); if (keep.length < cand.length) { cand = keep; clues.push({ out: target.out ? 'Ở ngoài trời' : 'Ở trong nhà', water: target.water ? 'Gần nước' : 'Không có nước', high: target.high ? 'Ở trên cao' : 'Không ở trên cao', gate: target.gate ? 'Gần lối ra vào' : 'Xa lối ra vào' }[a]); } });
        return { kind: 'clue', places: places.map(function (p) { return p.n; }), target: target.n, clues: clues, attrs: places };
      },
      text: function (st) { var desc = st.attrs.map(function (p) { return p.n + ' (' + [p.out ? 'ngoài trời' : 'trong nhà', p.water ? 'có nước' : 'khô ráo', p.high ? 'trên cao' : 'mặt đất', p.gate ? 'gần cổng' : 'xa cổng'].join(', ') + ')'; }).join('; '); return 'Ê-kíp giấu chiếc hộp bí mật ở một trong bốn nơi: ' + desc + '.\nManh mối giành được: ' + st.clues.map(function (c, i) { return (i + 1) + '. ' + c; }).join(' · ') + '.'; },
      rows: function (st) { return st.places.map(function (p, i) { return { k: 'p' + i, l: 'Chạy tới ' + p }; }); },
      play: function (st, k) { var p = st.places[+k.slice(1)], ok = p === st.target; return { done: true, won: ok, text: ok ? 'Chiếc hộp nằm đúng ở ' + p + '!' : 'Hộp không ở ' + p + '; nó nằm ở ' + st.target + '.' }; },
      auto: function (st, r, skill) { return r() < skill ? 'p' + st.places.indexOf(st.target) : 'p' + ri(r, 0, 3); }
    },
    // Oẳn tù tì với người dẫn: người dẫn thường ra thế thắng thế bạn vừa ra (đọc được qua các ván trước).
    rps: {
      n: 'Oẳn tù tì giành bữa tối',
      init: function (seed, ctx) { var r = seeded(seed); return { kind: 'rps', host: ctx.host || 'người dẫn', first: pick(r, MOVES), habit: 0.75, me: 0, them: 0, last: null, round: 0, hist: [], seed: seed }; },
      hostMove: function (st) { var r = seeded(st.seed + ':' + st.round); return st.last && r() < st.habit ? LOSES_TO[st.last] : st.round === 0 ? st.first : pick(r, MOVES); },
      text: function (st) { return 'Thắng 2 trong 3 ván để được chọn món đặc sản. Tỉ số: bạn ' + st.me + ' – ' + st.them + ' ' + st.host + '.' + (st.hist.length ? ' Các ván trước: ' + st.hist.join('; ') + '.' : ' ' + U.cap(st.host) + ' có thói quen riêng, hãy để ý.'); },
      rows: function () { return MOVES.map(function (m) { return { k: m, l: 'Ra ' + m }; }); },
      play: function (st, k) {
        var h = MINI.rps.hostMove(st), res = BEATS[k] === h ? 'thắng' : BEATS[h] === k ? 'thua' : 'hòa';
        if (res === 'thắng') st.me++; else if (res === 'thua') st.them++;
        st.hist.push('bạn ' + k + ' – ' + h + ' (' + res + ')'); st.last = k; st.round++;
        var done = st.me >= 2 || st.them >= 2 || st.round >= 5;
        return { done: done, won: st.me >= 2 || (done && st.me > st.them), text: 'Bạn ra ' + k + ', ' + st.host + ' ra ' + h + ': ' + res + '.' };
      },
      auto: function (st, r, skill) { if (st.last && r() < skill) return LOSES_TO[LOSES_TO[st.last]]; return pick(r, MOVES); }
    },
    // Đoán số 1–50 trong 6 lần, có gợi ý lớn hơn / nhỏ hơn.
    guess: {
      n: 'Đoán số giành chỗ ngủ',
      init: function (seed) { var r = seeded(seed); return { kind: 'guess', secret: ri(r, 1, 50), lo: 1, hi: 50, left: 6, hist: [] }; },
      options: function (st) { var a = st.lo, b = st.hi, s = [a, Math.round(a + (b - a) / 4), Math.round((a + b) / 2), Math.round(a + 3 * (b - a) / 4), b]; return s.filter(function (v, i) { return s.indexOf(v) === i; }); },
      text: function (st) { return 'Ê-kíp giữ một số bí mật từ 1 đến 50. Còn ' + st.left + ' lần đoán; số nằm trong khoảng ' + st.lo + '–' + st.hi + '.' + (st.hist.length ? ' Đã đoán: ' + st.hist.join(', ') + '.' : ''); },
      rows: function (st) { return MINI.guess.options(st).map(function (v) { return { k: 'g' + v, l: 'Đoán ' + v }; }); },
      play: function (st, k) {
        var v = +k.slice(1); st.left--;
        if (v === st.secret) return { done: true, won: true, text: 'Đúng là ' + v + '! Cả đội được ngủ trong nhà.' };
        if (v < st.secret) st.lo = Math.max(st.lo, v + 1); else st.hi = Math.min(st.hi, v - 1);
        st.hist.push(v + (v < st.secret ? ' (lớn hơn)' : ' (nhỏ hơn)'));
        return { done: st.left <= 0, won: false, text: v < st.secret ? 'Số bí mật lớn hơn ' + v + '.' : 'Số bí mật nhỏ hơn ' + v + '.' };
      },
      auto: function (st, r, skill) { var o = MINI.guess.options(st); return 'g' + (r() < skill ? o[Math.floor(o.length / 2)] : pick(r, o)); }
    },
    // Bốc bát: 5 bát, 2 bát đắng; người dẫn liếc về một bát — lúc thật lúc đánh lừa.
    bowls: {
      n: 'Bốc thăm bát đắng',
      init: function (seed, ctx) { var r = seeded(seed), bitter = shuffle(r, [0, 1, 2, 3, 4]).slice(0, 2), truthful = r() < 0.6, look = truthful ? bitter[0] : shuffle(r, [0, 1, 2, 3, 4].filter(function (i) { return bitter.indexOf(i) < 0; }))[0]; return { kind: 'bowls', bitter: bitter, look: look, truthful: truthful, host: ctx.host || 'người dẫn' }; },
      text: function (st) { return 'Năm bát canh giống hệt nhau, hai bát bị pha khổ qua cực đắng. ' + U.cap(st.host) + ' liếc nhìn bát số ' + (st.look + 1) + ' rồi cười bí hiểm (anh ấy hay đánh lừa, nhưng không phải lúc nào cũng vậy).'; },
      rows: function () { return [0, 1, 2, 3, 4].map(function (i) { return { k: 'b' + i, l: 'Chọn bát số ' + (i + 1) }; }); },
      play: function (st, k) { var i = +k.slice(1), bad = st.bitter.indexOf(i) >= 0; return { done: true, won: !bad, text: bad ? 'Bát số ' + (i + 1) + ' đắng nghét! Cả trường quay cười nghiêng ngả.' : 'Bát số ' + (i + 1) + ' là canh ngon. Bát đắng là số ' + st.bitter.map(function (b) { return b + 1; }).join(' và ') + '.' }; },
      auto: function (st, r) { var safe = [0, 1, 2, 3, 4].filter(function (i) { return i !== st.look; }); return 'b' + pick(r, safe); }
    }
  };
  // ---- Trò chiến thuật nhiều người (chương trình chiến thuật) ----
  var STRAT = {
    auction: { n: 'Đấu giá kín', desc: 'Bốn món đồ có giá trị điểm công khai. Mỗi người có 10 chip cho cả trò; ai trả cao nhất cho món nào thì nhận món đó (chip đã trả mất đi). Hòa giá thì không ai nhận.' },
    unique: { n: 'Số lớn nhất duy nhất', desc: 'Mỗi vòng mọi người cùng bí mật chọn một số từ 1 đến 8. Ai chọn số lớn nhất mà không trùng với ai khác được 3 điểm. 3 vòng.' },
    prisoner: { n: 'Hợp tác hay phản bội', desc: 'Bạn bắt cặp với một người trong 3 lượt. Cùng hợp tác: mỗi người 3 điểm. Một người phản bội: người phản bội 5, người kia 0. Cùng phản bội: mỗi người 1.' },
    nim: { n: 'Bốc sỏi (đấu loại)', desc: 'Một đống sỏi; hai người lần lượt bốc 1 đến 3 viên. Ai bốc viên cuối cùng thì thắng. (Gợi ý toán học: để lại cho đối thủ số sỏi chia hết cho 4.)' }
  };
  function npcBid(n, value, chips, r) { if (chips <= 0) return 0; var base = n.style === 'greedy' ? value / 2 : n.style === 'bold' ? value / 3 + 1 : n.style === 'cautious' ? value / 5 : n.style === 'fair' ? value / 4 : r() * value / 2; return Math.max(0, Math.min(chips, Math.round(base + (r() - 0.5) * 2))); }
  function npcUnique(n, r) { return n.style === 'bold' ? ri(r, 6, 8) : n.style === 'cautious' ? ri(r, 1, 4) : n.style === 'greedy' ? 8 : ri(r, 1, 8); }
  function npcPD(n, hist, r) { var lastMe = hist.length ? hist[hist.length - 1].me : 'C'; if (n.style === 'fair') return lastMe; if (n.style === 'greedy') return 'D'; if (n.style === 'cautious') return hist.some(function (h) { return h.me === 'D'; }) ? 'D' : 'C'; if (n.style === 'bold') return hist.length === 2 ? 'D' : 'C'; return r() < 0.5 ? 'C' : 'D'; }
  function nimBest(n) { var k = n % 4; return k === 0 ? 1 : k; }
  E.MINI152 = { MINI: MINI, STRAT: STRAT, ZONES: ZONES, nimBest: nimBest, npcPD: npcPD, npcUnique: npcUnique, npcBid: npcBid };

  // Bước chơi trò nhỏ (dùng chung cho mọi nơi gọi) — trạng thái lưu trong l.flags.mini152 để tải lại không đổi.
  function M(l) { return l.flags.mini152; }
  function startMini(l, r, kind, ctx, done) { var tok = kind + ':' + yr(l) + ':' + (l.flags.miniSerial152 = (l.flags.miniSerial152 || 0) + 1); l.flags.mini152 = { kind: kind, token: tok, st: MINI[kind].init(l.id + tok, ctx || {}), done: done, ctx: ctx || {}, manual: ctx && ctx.manual != null ? !!ctx.manual : true, notes: [] }; X.next(l, 'mini152', r, { token: tok, n: 0 }, { manual: l.flags.mini152.manual }); return l.flags.mini152; }
  var DONE = {};
  X.menu('mini152', function (l) { var m = M(l); return m ? (m.ctx.title || MINI[m.kind].n) : 'Trò chơi'; }, function (l) { return M(l) ? true : 'Không có trò chơi'; },
    function (l, d) { var m = M(l); if (!m || d && d.arg && d.arg.token !== m.token) return 'Trò chơi đã kết thúc.'; return (m.notes.length ? m.notes.slice(-2).join('\n') + '\n\n' : '') + MINI[m.kind].text(m.st); },
    function (l, arg) { var m = M(l); if (!m || arg.token !== m.token || arg.n !== m.notes.length) return []; return MINI[m.kind].rows(m.st).map(function (row) { return { k: row.k, l: row.l, run: function (l, r, log) { var mm = M(l); if (!mm || mm.token !== arg.token || arg.n !== mm.notes.length) return; var res = MINI[mm.kind].play(mm.st, row.k); mm.notes.push(res.text); if (!res.done) { X.next(l, 'mini152', r, { token: mm.token, n: mm.notes.length }, { manual: mm.manual }); return; } delete l.flags.mini152; log((mm.ctx.title || MINI[mm.kind].n) + ': ' + res.text + (res.won ? ' Thắng!' : ''), res.won ? 'good' : 'neutral'); if (DONE[mm.done]) DONE[mm.done](l, r, log, res.won, mm); } }; }); });
  E.DEC.mini152.auto = function (l, d, r) { var m = M(l), keys = d.data && d.data.keys || []; if (!m) return 'cancel'; var k = MINI[m.kind].auto(m.st, r, U.clamp((m.ctx.skill || 0.5), 0.05, 0.95)), i = keys.indexOf(k); return i >= 0 && d.opts.some(function (o) { return o.k === String(i); }) ? String(i) : d.opts[0].k; };

  // ===================================================================
  // Running Man Việt Nam / 2 Ngày 1 Đêm: giữ nguyên thử thách từng chặng (life48, life64);
  // sau mỗi tập hoàn thành có thêm một "nhiệm vụ đặc biệt" bằng trò chơi nhỏ, chỉ ảnh hưởng danh tiếng thưởng và độ thân với dàn cast.
  // ===================================================================
  var VR = E.DEC.vr_vong, vrApply = VR.apply;
  var BONUS = { rm: ['chase', 'clue'], hai: ['rps', 'bowls', 'guess'] };
  function special(v) { var list = v && BONUS[v.k]; return list ? list[(v.completed - 1 + list.length) % list.length] : null; }
  VR.apply = function (l, d, k, r, log) {
    var v = l.flags.variety, before = v && v.completed, out = vrApply.apply(this, arguments);
    v = l.flags.variety;
    if (v && v.completed > before && !l.flags.mini152 && k !== 'quit') {
      var kind = special(v), host = v.k === 'hai' ? 'anh lớn Tràng Dương' : 'anh cả "Thánh Trần"';
      startMini(l, r, kind, { title: (v.k === 'rm' ? 'Running Man Việt Nam' : '2 Ngày 1 Đêm') + ' · Nhiệm vụ đặc biệt tập ' + v.completed + ': ' + MINI[kind].n, host: host, names: (v.opponents || []).slice(0, 3), vtoken: v.token, ep: v.completed, manual: !!(d && d.manual), skill: kind === 'chase' ? (wit(l) + fit(l)) / 2 : wit(l), cast: (v.team || []).slice(1).concat(v.opponents || []) }, 'varietyBonus');
    }
    return out;
  };
  DONE.varietyBonus = function (l, r, log, won, m) {
    var v = l.flags.variety; if (!v || v.token !== m.ctx.vtoken) return;
    var bonus = won ? 6000 : 1500; l.fame = (l.fame || 0) + bonus; v.audienceGain = (v.audienceGain || 0) + bonus; v.bonus152 = (v.bonus152 || 0) + (won ? 1 : 0);
    var mate = (m.ctx.cast || [])[0]; if (mate) { (v.bond152 || (v.bond152 = {}))[mate] = ((v.bond152 || {})[mate] || 0) + (won ? 2 : 1); }
    log((won ? 'Bạn hoàn thành nhiệm vụ đặc biệt' : 'Nhiệm vụ đặc biệt không thành nhưng mang lại nhiều tiếng cười') + ', thêm ' + bonus + ' người theo dõi' + (mate ? '; bạn và ' + mate + ' thân nhau hơn' : '') + '.', won ? 'good' : 'neutral');
  };
  E.VARIETY152 = { special: special };
  // Trò chơi nhỏ bị bỏ dở (để dịp khác / sang năm) không giữ trạng thái treo.
  E.HOOKS.year.push(function (l) { var m = l.flags.mini152; if (m && !(l.pending || []).some(function (d) { return d.id === 'mini152' && d.data && d.data.arg && d.data.arg.token === m.token; })) delete l.flags.mini152; });

  // ===================================================================
  // Gameshow vận động mới: Running Man Hàn Quốc, New Journey to the West (theo tập, chuỗi trò chơi nhỏ)
  // ===================================================================
  function inKorea(l) { return (l.abroad && l.abroad.code === 'KR') || l.country === 'KR'; }
  function krIdol(l) { var a = E.LIFE138 && E.LIFE138.state(l).agency; return !!(a && a.code === 'KR' && (a.status === 'debut' || a.status === 'trainee')); }
  function krStar(l) { return inKorea(l) || krIdol(l) || (l.fame || 0) >= 1e6; }
  E.SHOW151.krStar = krStar;
  var airing = SH.airing;
  SH.airing = function (l, sh) { if (sh.country === 'KR') { var y = yr(l); return y >= sh.from && (!sh.to || y <= sh.to) && krStar(l); } return airing.apply(this, arguments); };
  SH.HANDLERS.variety = {
    start: function (l, r, a, sh) { a.ep = 0; a.eps = a.role === 'guest' ? 1 : 3; a.wins = 0; a.mvp = 0; a.games = sh.games; a.gi = 0; a.bond = {}; a.cast = cast(l, seeded(a.token), 5).map(function (c) { return c.name; }); },
    title: function (l, a) { return 'Tập ' + (a.ep + 1) + '/' + a.eps; },
    text: function (l, a, sh) { return SH.recap(a) + 'Dàn thành viên: ' + a.cast.join(', ') + '. Trò chơi tiếp theo: ' + MINI[a.games[a.gi % a.games.length]].n + '. Đã thắng ' + a.wins + ' trò.' + (Object.keys(a.bond).length ? ' Thân nhất với: ' + Object.keys(a.bond).sort(function (x, y) { return a.bond[y] - a.bond[x]; })[0] + '.' : ''); },
    rows: function (l, a, sh) {
      var self = this;
      return [{ k: 'play', l: 'Bắt đầu trò chơi: ' + MINI[a.games[a.gi % a.games.length]].n, run: function (l, r) { a.step--; a.waiting = true; startMini(l, r, a.games[a.gi % a.games.length], { title: sh.name + ' · ' + MINI[a.games[a.gi % a.games.length]].n, names: a.cast.slice(0, 3), host: 'người dẫn', skill: (wit(l) + fit(l)) / 2, manual: a.manual, token: a.token }, 'show151variety'); } },
        { k: 'team', l: 'Kết thân với một thành viên trước trò chơi', run: function (l, r, log) { var c = pick(r, a.cast); a.bond[c] = (a.bond[c] || 0) + 1; SH.note(a, 'Bạn trò chuyện, đùa giỡn cùng ' + c + '; hai người phối hợp ăn ý hơn.'); } }];
    },
    after: function (l, r, log, a, sh, won) {
      a.waiting = false; a.gi++; if (won) { a.wins++; a.epWins = (a.epWins || 0) + 1; } SH.note(a, (won ? 'Thắng ' : 'Thua ') + MINI[a.games[(a.gi - 1) % a.games.length]].n + '.');
      if (a.gi % 2 === 0) { if (a.epWins >= 2) a.mvp++; a.epWins = 0; a.ep++; } // thắng cả hai trò trong tập: nhân vật nổi bật
      if (a.ep >= a.eps) return SH.finish(l, log, { result: 'quay ' + a.eps + ' tập, thắng ' + a.wins + ' trò' + (a.mvp ? ', ' + a.mvp + ' lần là nhân vật nổi bật' : ''), prize: 0, fame: (a.role === 'guest' ? 3e4 : 9e4) + a.wins * 1e4, good: a.wins > 0, hap: 4, invite: a.wins >= 2 ? { years: 2, why: 'khán giả muốn gặp lại' } : null });
      SH.queue(l, r);
    }
  };
  DONE.show151variety = function (l, r, log, won, m) { var a = SH.S(l).active; if (!a || a.token !== m.ctx.token) return; SH.HANDLERS.variety.after(l, r, log, a, SH.SHOWS[a.id], won); };
  var famousShow = function (l) { var c = SH.jobCat(l); return (l.fame || 0) >= 1e5 && /^(show|media|creator|sport)$/.test(c || '') ? true : 'Cần là nghệ sĩ / người nổi tiếng (≥100.000 người biết đến)'; };
  SH.define('rmkr', { name: 'Running Man (Hàn Quốc)', country: 'KR', genre: 'variety', from: 2010, handler: 'variety', fee: 120, games: ['clue', 'chase'], desc: 'Nhiệm vụ truy tìm manh mối và màn xé bảng tên kinh điển cùng dàn thành viên; khách mời quảng bá dự án.',
    roles: { guest: { n: 'khách mời', gap: 1, why: famousShow } } });
  SH.define('njttw', { name: 'New Journey to the West', country: 'KR', genre: 'variety', from: 2015, handler: 'variety', fee: 100, games: ['rps', 'guess', 'bowls'], desc: 'Hành trình du lịch, trò chơi giành bữa ăn và chỗ ngủ, nhiều tình huống hài hước.',
    roles: { guest: { n: 'khách mời', gap: 1, why: famousShow } } });

  // ===================================================================
  // Gameshow chiến thuật: The Genius, The Devil's Plan, Bloody Game
  // ===================================================================
  SH.HANDLERS.strategy = {
    start: function (l, r, a, sh) { var rr = seeded(a.token); a.players = cast(l, rr, sh.players - 1); a.round = 0; a.pts = 0; a.chips = 0; a.immune = false; a.garnet = 0; a.out = false; this.match(l, a, sh); },
    alive: function (a) { return a.players.filter(function (p) { return !p.out; }); },
    match: function (l, a, sh) {
      var g = sh.games[a.round % sh.games.length], rr = seeded(a.token + ':g' + a.round);
      a.game = { k: g, i: 0, me: 0, npc: {} }; this.alive(a).forEach(function (p) { a.game.npc[p.name] = 0; p.chips = 10; });
      if (g === 'auction') { a.game.items = shuffle(rr, [2, 3, 4, 5, 6, 7]).slice(0, 4); a.game.chips = 10; }
      if (g === 'prisoner') { a.game.partner = pick(rr, this.alive(a)).name; a.game.hist = []; }
      if (a.players.filter(function (p) { return !p.out; }).length <= 1) { a.game = { k: 'nim', i: 0, final: true, stones: 17 + ri(rr, 0, 4), opp: this.alive(a)[0], turn: 'me' }; }
    },
    title: function (l, a, sh) { return 'Vòng ' + (a.round + 1) + ' · ' + STRAT[a.game.k].n + (a.game.final ? ' (chung kết)' : a.game.death ? ' (đấu loại)' : ''); },
    text: function (l, a, sh) {
      var g = a.game, alive = this.alive(a), s = SH.recap(a) + STRAT[g.k].desc + '\nCòn ' + (alive.length + 1) + ' người chơi. Mảnh garnet của bạn: ' + a.garnet + (a.immune ? ' · đang được miễn loại' : '') + '.';
      if (g.k === 'auction') s += '\nMón ' + (g.i + 1) + '/4 trị giá ' + g.items[g.i] + ' điểm. Bạn còn ' + g.chips + ' chip, đã có ' + g.me + ' điểm.';
      if (g.k === 'unique') s += '\nVòng ' + (g.i + 1) + '/3. Điểm của bạn: ' + g.me + '.';
      if (g.k === 'prisoner') s += '\nCặp với ' + g.partner + ' · lượt ' + (g.i + 1) + '/3 · điểm của bạn: ' + g.me + (g.hist.length ? ' · trước đó: ' + g.hist.map(function (h) { return 'bạn ' + (h.me === 'C' ? 'hợp tác' : 'phản bội') + ' / ' + g.partner + ' ' + (h.them === 'C' ? 'hợp tác' : 'phản bội'); }).join('; ') : '') + '.';
      if (g.k === 'nim') s += '\nĐối thủ: ' + g.opp.name + '. Còn ' + g.stones + ' viên sỏi. Đến lượt bạn bốc.';
      return s;
    },
    rows: function (l, a, sh) {
      var g = a.game, self = this, go = function (fn) { return function (l, r, log) { fn(l, r, log); }; };
      if (g.k === 'auction') return Array.from({ length: Math.min(g.chips, 7) + 1 }, function (x, b) { return { k: 'bid' + b, l: b ? 'Trả ' + b + ' chip' : 'Không trả giá món này', run: go(function (l, r, log) { self.auction(l, r, log, a, sh, b); }) }; });
      if (g.k === 'unique') return [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) { return { k: 'n' + n, l: 'Chọn số ' + n, run: go(function (l, r, log) { self.unique(l, r, log, a, sh, n); }) }; });
      if (g.k === 'prisoner') return [{ k: 'C', l: 'Hợp tác', run: go(function (l, r, log) { self.pd(l, r, log, a, sh, 'C'); }) }, { k: 'D', l: 'Phản bội', run: go(function (l, r, log) { self.pd(l, r, log, a, sh, 'D'); }) }];
      return [1, 2, 3].filter(function (n) { return n <= g.stones; }).map(function (n) { return { k: 's' + n, l: 'Bốc ' + n + ' viên', run: go(function (l, r, log) { self.nim(l, r, log, a, sh, n); }) }; });
    },
    auction: function (l, r, log, a, sh, bid) {
      var g = a.game, rr = seeded(a.token + ':a' + a.round + g.i), v = g.items[g.i], best = { who: 'me', bid: bid }, tie = false;
      this.alive(a).forEach(function (p) { var b = npcBid(p, v, p.chips, rr); if (b > best.bid) { best = { who: p, bid: b }; tie = false; } else if (b === best.bid && b > 0) tie = true; });
      if (tie || best.bid === 0) SH.note(a, 'Món ' + v + ' điểm: hòa giá hoặc không ai trả, món bị hủy.');
      else if (best.who === 'me') { g.me += v; g.chips -= bid; SH.note(a, 'Bạn thắng món ' + v + ' điểm với ' + bid + ' chip.'); }
      else { best.who.chips -= best.bid; g.npc[best.who.name] += v; SH.note(a, best.who.name + ' thắng món ' + v + ' điểm với ' + best.bid + ' chip' + (bid ? ' (bạn trả ' + bid + ')' : '') + '.'); }
      g.i++; if (g.i >= 4) this.endMatch(l, r, log, a, sh);
    },
    unique: function (l, r, log, a, sh, n) {
      var g = a.game, rr = seeded(a.token + ':u' + a.round + g.i), picks = { me: n }; this.alive(a).forEach(function (p) { picks[p.name] = npcUnique(p, rr); });
      var counts = {}; Object.keys(picks).forEach(function (k) { counts[picks[k]] = (counts[picks[k]] || 0) + 1; });
      var uniq = Object.keys(picks).filter(function (k) { return counts[picks[k]] === 1; }).sort(function (x, y) { return picks[y] - picks[x]; }), win = uniq[0];
      if (win === 'me') g.me += 3; else if (win) g.npc[win] += 3;
      SH.note(a, 'Vòng ' + (g.i + 1) + ': ' + Object.keys(picks).map(function (k) { return (k === 'me' ? 'bạn' : k) + ' ' + picks[k]; }).join(', ') + ' → ' + (win ? (win === 'me' ? 'bạn' : win) + ' thắng với số ' + picks[win] : 'không có số duy nhất') + '.');
      g.i++; if (g.i >= 3) this.endMatch(l, r, log, a, sh);
    },
    pd: function (l, r, log, a, sh, me) {
      var g = a.game, p = this.alive(a).find(function (x) { return x.name === g.partner; }), rr = seeded(a.token + ':p' + a.round + g.i), them = npcPD(p, g.hist, rr);
      var pay = { CC: [3, 3], CD: [0, 5], DC: [5, 0], DD: [1, 1] }[me + them]; g.me += pay[0]; g.npc[p.name] += pay[1]; g.hist.push({ me: me, them: them });
      this.alive(a).filter(function (x) { return x !== p; }).forEach(function (x) { g.npc[x.name] += ri(rr, 3, 11) / 3 | 0; });
      SH.note(a, 'Lượt ' + (g.i + 1) + ': bạn ' + (me === 'C' ? 'hợp tác' : 'phản bội') + ', ' + p.name + ' ' + (them === 'C' ? 'hợp tác' : 'phản bội') + ' → +' + pay[0] + ' điểm.');
      g.i++; if (g.i >= 3) this.endMatch(l, r, log, a, sh);
    },
    endMatch: function (l, r, log, a, sh) {
      var g = a.game, rr = seeded(a.token + ':e' + a.round), alive = this.alive(a), board = [{ n: 'me', p: g.me }].concat(alive.map(function (p) { return { n: p.name, p: g.npc[p.name] + p.skill * 0.01 }; })).sort(function (x, y) { return y.p - x.p; });
      if (g.k === 'auction') alive.forEach(function (p) { g.npc[p.name] += 0; });
      var winner = board[0].n, loser = board[board.length - 1].n;
      a.immune = winner === 'me'; if (winner === 'me') a.garnet += 2; else { var w = alive.find(function (p) { return p.name === winner; }); if (w) w.pts += 2; }
      SH.note(a, STRAT[g.k].n + ' kết thúc: ' + board.map(function (x) { return (x.n === 'me' ? 'bạn' : x.n) + ' ' + Math.floor(x.p); }).join(' · ') + '. ' + (winner === 'me' ? 'Bạn thắng vòng, nhận 2 garnet và được miễn loại.' : winner + ' thắng vòng.'));
      if (loser === 'me' && !a.immune) { var opp = alive.slice().sort(function (x, y) { return x.skill - y.skill; })[0]; a.game = { k: 'nim', death: true, stones: 13 + ri(rr, 0, 6), opp: opp, i: 0 }; SH.note(a, 'Bạn đứng cuối, phải vào trận đấu loại và chọn ' + opp.name + ' làm đối thủ.'); return; }
      var lp = alive.find(function (p) { return p.name === loser; }) || alive[alive.length - 1], op = pick(rr, alive.filter(function (p) { return p !== lp; }).concat([{ name: 'me', skill: 0 }]).filter(function (p) { return p.name !== 'me'; }));
      if (lp) { var loses = op && rr() < 0.5 + (op.skill - lp.skill) ? lp : op || lp; loses.out = true; SH.note(a, (op ? lp.name + ' đấu loại với ' + op.name + ': ' : '') + loses.name + ' bị loại.'); }
      this.nextRound(l, r, log, a, sh);
    },
    nim: function (l, r, log, a, sh, n) {
      var g = a.game, rr = seeded(a.token + ':nim' + a.round + g.i); g.i++;
      g.stones -= n; if (g.stones <= 0) return this.nimEnd(l, r, log, a, sh, true);
      var take = rr() < g.opp.skill + 0.15 ? nimBest(g.stones) : ri(rr, 1, Math.min(3, g.stones)); g.stones -= take;
      SH.note(a, 'Bạn bốc ' + n + ', ' + g.opp.name + ' bốc ' + take + ' viên.');
      if (g.stones <= 0) return this.nimEnd(l, r, log, a, sh, false);
    },
    nimEnd: function (l, r, log, a, sh, won) {
      var g = a.game;
      if (g.final) return SH.finish(l, log, { result: won ? 'vô địch, đánh bại ' + g.opp.name + ' ở trận chung kết' : 'á quân, thua ' + g.opp.name + ' ở chung kết', prize: V(l, (a.garnet + (won ? 10 : 2)) * 10), fame: won ? 2e5 : 8e4, good: true, hap: won ? 12 : 5, rank: won ? 1 : 2, mem: won ? 'Giành chiến thắng ' + sh.name + ' bằng nước bốc sỏi cuối cùng.' : null });
      if (!won) { return SH.finish(l, log, { result: 'bị loại ở vòng ' + (a.round + 1) + ' sau trận đấu loại với ' + g.opp.name, prize: V(l, a.garnet * 10), fame: 2e4 + a.round * 1e4, good: a.round >= 2, hap: -1, rank: this.alive(a).length + 1 }); }
      g.opp.out = true; SH.note(a, 'Bạn thắng trận đấu loại; ' + g.opp.name + ' rời cuộc chơi.'); this.nextRound(l, r, log, a, sh);
    },
    nextRound: function (l, r, log, a, sh) { a.round++; if (a.round >= sh.rounds && this.alive(a).length > 1) { var rr = seeded(a.token + ':cut'); this.alive(a).sort(function (x, y) { return x.pts - y.pts; }).slice(0, -1).forEach(function (p) { p.out = true; }); } this.match(l, a, sh); },
    auto: function (l, a, r) {
      var g = a.game, sk = U.clamp(SH.knowledge(l) * 0.5 + wit(l) * 0.5, 0.1, 0.95);
      if (g.k === 'auction') return 'bid' + Math.min(g.chips, Math.round(g.items[g.i] / 2.5));
      if (g.k === 'unique') return 'n' + (r() < sk ? ri(r, 5, 7) : ri(r, 1, 8));
      if (g.k === 'prisoner') return g.hist.length && g.hist[g.hist.length - 1].them === 'D' ? 'D' : r() < sk ? 'C' : 'D';
      return 's' + (r() < sk ? nimBest(g.stones) : ri(r, 1, Math.min(3, g.stones)));
    }
  };
  var strategist = function (l) { return l.age < 20 ? 'Từ 20 tuổi' : (l.fame || 0) >= 2e4 || SH.knowledge(l) >= 0.75 ? true : 'Ê-kíp chọn người nổi tiếng hoặc người có trí tuệ nổi bật'; };
  SH.define('genius', { name: 'The Genius', country: 'KR', genre: 'strategy', from: 2013, to: 2015, handler: 'strategy', players: 8, rounds: 6, games: ['auction', 'unique', 'prisoner'], desc: 'Mỗi tập một trò chiến thuật; người thắng nhận garnet và miễn loại, người cuối bảng vào trận đấu loại.',
    roles: { contestant: { n: 'người chơi', once: true, why: strategist } } });
  SH.define('devilsplan', { name: "The Devil's Plan", country: 'KR', genre: 'strategy', from: 2023, handler: 'strategy', players: 8, rounds: 6, games: ['prisoner', 'auction', 'unique'], desc: 'Người chơi sống chung, thi đấu trò logic và chiến thuật để tích garnet; bị loại qua trận đấu loại.',
    roles: { contestant: { n: 'người chơi', once: true, why: strategist } } });
  SH.define('bloodygame', { name: 'Bloody Game', country: 'KR', genre: 'strategy', from: 2021, handler: 'strategy', players: 8, rounds: 5, games: ['prisoner', 'unique', 'auction'], desc: 'Sinh tồn trí tuệ với liên minh và phản bội; tiền thưởng chung phụ thuộc lựa chọn của mọi người.',
    roles: { contestant: { n: 'người chơi', once: true, why: strategist } } });
})(globalThis.G);
