/* 9.5.1: (1) thư mời nhập học kèm học bổng cho học sinh có thành tích, để chọn trường thay vì bị xếp tự động;
   (2) học đại học muộn cho người đang sống ở nước khác (tị nạn, thường trú, nhập quốc tịch) sau khi chỉ học tới phổ thông.
   Mở rộng E.DEC.uni, E.EDUCATION54 (study_wishes54), E.GLOBAL919 và chuỗi abroad107 có sẵn; không tạo hệ thống tuyển sinh riêng. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110;
  if (!E.DEC.uni || !E.EDUCATION54 || !X || !E.DEC.study_wishes54) return;
  var ED = E.EDUCATION54;
  function wy(l) { return l.birthYear + l.age; }
  function res(l) { return l.abroad && l.abroad.code || l.country; }
  function st(l) { return l.flags.uni945 || (l.flags.uni945 = {}); }
  function peek(l) { return l.flags && l.flags.uni945 || {}; }
  function R(l, salt) { var h = { rs: ((l.rs | 0) ^ salt) | 0 }; return function () { return U.rand(h); }; }
  function plain(l) { return l && l.alive && ['vn', 'world'].indexOf(l.mode) >= 0 && E.FAMILY53.free(l); }

  // ------------------------------------------------------------------
  // 1. Thành tích và thư mời
  // ------------------------------------------------------------------
  function achiev(l) {
    var pts = 0, why = [], medals = (l.medals || []).length;
    if (medals) { pts += 2; why.push('giải quốc tế'); }
    if (l.flags.tuyenThang) { pts += 2; why.push('giải quốc gia (tuyển thẳng)'); }
    if (l.flags.scholar) { pts += 1; why.push('điểm thi xuất sắc'); }
    if (Number.isFinite(l.examScore) && l.examScore >= 28) pts += 1;
    if ((l.uniTier || 1) >= 1.35) pts += 1;
    return { pts: pts, why: why, medals: medals };
  }
  function cover(l) {
    var a = achiev(l);
    return a.pts >= 3 || a.medals ? { pct: 1, cover: 'full', label: 'toàn phần (học phí và trợ cấp sinh hoạt)' }
      : a.pts >= 2 ? { pct: 0.5, cover: 'tuition', label: '50% học phí' } : { pct: 0.25, cover: 'tuition', label: '25% học phí' };
  }
  function qualified(l, u) {
    var a = achiev(l), sc = Number.isFinite(l.examScore) ? l.examScore : null;
    if (u.nk) return []; // trường năng khiếu cần thi riêng, giữ đúng quy trình xét tuyển có sẵn
    return ED.programs(u).filter(function (p) {
      if (E.ARTS84 && !E.ARTS84.fits(l, u, p.major)) return false;
      if (ED.entryReason && ED.entryReason(l, u, { major: p.major, program: p.name })) return false;
      return a.pts >= 2 || sc != null && sc >= ED.threshold(u, p.major);
    });
  }
  function localOffers(l) {
    var c = cover(l), qs = ED.localSchools(l).filter(function (u) { return qualified(l, u).length; }).sort(function (a, b) { return b.score - a.score; });
    var pick = qs.length <= 3 ? qs : [qs[0], qs[Math.floor(qs.length / 2)], qs[qs.length - 1]];
    return pick.map(function (u, i) {
      var pct = Math.min(1, c.pct + (i === 2 && pick.length > 2 ? 0.25 : 0)), full = pct >= 1;
      return { t: 'local', school: u.id, name: u.name, city: u.city, score: u.score, pct: pct, cover: full ? 'full' : 'tuition', label: full ? 'toàn phần (học phí và trợ cấp sinh hoạt)' : Math.round(pct * 100) + '% học phí' };
    });
  }
  function foreignOffers(l) {
    var g = E.GLOBAL919; if (!g || !E.DEC.abroad107_country || !E.DEC.abroad107_school || wy(l) < 1950) return [];
    if (E.CTX945 && !E.CTX945.emigAllowed(l)) return [];
    var c = cover(l), rr = R(l, 0x945), codes = E.DEC.abroad107_country.def.opts.map(function (o) { return o.k; }).filter(function (k) { return k !== 'cancel' && g.P[k] && G.W.BY[k] && k !== res(l); });
    codes = codes.filter(function (k) {
      var t = g.trackOf(l, k), need = t === 'en' ? 2 : 3;
      return g.instrLevel(l, t) >= need && E.DEC.abroad107_school.valid(l, { at: l.age, lv: 5, country: k, done: false });
    });
    for (var i = codes.length - 1; i > 0; i--) { var j = Math.floor(rr() * (i + 1)), t0 = codes[i]; codes[i] = codes[j]; codes[j] = t0; }
    return codes.slice(0, 2).map(function (k) {
      var p = g.P[k], tiers = (p.schol || []).slice().sort(function (a, b) { return b - a; }), full = c.pct >= 1 && p.full, pct = full ? 1 : Math.min(c.pct, tiers[0] || 0.5);
      return { t: 'foreign', country: k, name: G.W.BY[k].name, pct: pct, cover: full ? 'full' : 'tuition', fullName: full ? p.fullName : null, label: full ? 'toàn phần' + (p.fullName ? ' (' + p.fullName + ')' : '') + ', gồm học phí và trợ cấp sinh hoạt' : Math.round(pct * 100) + '% học phí (không gồm vé máy bay, ăn ở)' };
    });
  }
  // Thư mời hợp lệ được xét như trúng tuyển ở bước nộp nguyện vọng có sẵn (cùng móc với hồ sơ Anh và luật Harvard)
  var ao0 = ED.acceptedOffer872;
  ED.acceptedOffer872 = function (l, u, w) { var o = peek(l).pendingLocal; if (o && u && w && o.age === l.age && o.school === u.id && o.major === w.major) return true; return ao0 ? ao0.apply(this, arguments) : false; };
  function offersOf(l) {
    var s = st(l); if (s.offers && s.offers.age === l.age) return s.offers.list;
    var list = localOffers(l).concat(foreignOffers(l)); s.offers = { age: l.age, list: list }; return list;
  }
  function eligible(l) {
    if (!plain(l) || l.school || l.edu < 3 || l.edu >= 5 || l.age < 17 || l.age > 19 || res(l) !== l.country && !(l.abroad && l.abroad.code === res(l))) return false;
    var s = peek(l); if (s.declinedAt === l.age || s.taken) return false;
    if (achiev(l).pts < 1) return false;
    return offersOf(l).length > 0;
  }
  E.UNI945 = { achiev: achiev, cover: cover, eligible: eligible, offers: offersOf };

  X.menu('offers945', 'Thư mời nhập học và học bổng',
    function (l) { return eligible(l) ? true : 'Chưa có thư mời nào hoặc đã chọn xong'; },
    function (l) {
      var a = achiev(l);
      return 'Nhờ ' + (a.why.length ? a.why.join(', ') : 'kết quả học tập') + ', nhiều trường gửi thư mời nhập học kèm học bổng. Mỗi thư ghi mức hỗ trợ và điều kiện giữ học bổng: phải giữ học lực từ khá trở lên trong suốt khóa. Nhận một thư là bỏ các thư còn lại; thư ở nước ngoài còn phải làm hồ sơ, xin visa và chuyển nơi ở.';
    },
    function (l) {
      var rows = offersOf(l).map(function (o) {
        if (o.t === 'local') return { k: 'L' + o.school, l: o.name + ' · ' + o.city, h: 'Học bổng ' + o.label + ' · điểm chuẩn khoảng ' + o.score, run: function (l, r) { X.next(l, 'offerProg945', r, { school: o.school }); } };
        return { k: 'F' + o.country, l: 'Du học tại ' + o.name, h: 'Học bổng ' + o.label + ' · cần hồ sơ, visa; rời nơi ở hiện tại', run: function (l, r, log) {
          var s = st(l); s.offer = { country: o.country, pct: o.pct, cover: o.cover, name: o.fullName || null, label: o.label, until: l.age + 1 }; s.taken = true;
          log('Bạn nhận thư mời học bổng ' + o.label + ' tại ' + o.name + '. Tiếp theo chọn trường, ngành, nộp hồ sơ và xin visa du học.', 'big'); H.mem(l, 'Tờ thư mời học bổng đi ' + o.name + ' nằm trên bàn, cả nhà đọc đi đọc lại.', 6);
          X.next(l, 'abroad107_school', r, { at: l.age, lv: 5, country: o.country, done: false });
        } };
      });
      rows.push({ k: 'decline', l: 'Không nhận thư nào, tự đăng ký nguyện vọng', h: 'Giữ nguyên cách xét tuyển thông thường theo điểm', run: function (l, r) { st(l).declinedAt = l.age; if (ED.applicant(l)) ED.open(l, r); else l.pending.unshift(E.DEC.uni.make(l, r)); } });
      return rows;
    }, 17);

  X.menu('offerProg945', 'Chọn ngành tại trường đã mời',
    function (l) { return eligible(l) ? true : 'Không còn thư mời hợp lệ'; },
    function (l, d) { var u = ED.schools.find(function (x) { return x.id === (d && d.arg && d.arg.school); }); return u ? 'Trường ' + u.name + ' cho phép chọn ngành trong danh sách bạn đủ điều kiện. Học bổng giữ nguyên với mọi ngành; nhập học xong khó đổi trường.' : 'Chọn ngành'; },
    function (l, arg) {
      var u = ED.schools.find(function (x) { return x.id === arg.school; }), o = offersOf(l).filter(function (x) { return x.school === arg.school; })[0];
      if (!u || !o) return [];
      var rows = qualified(l, u).map(function (p) { return { k: p.key, l: p.name, h: 'Điểm chuẩn khoảng ' + ED.threshold(u, p.major) + '/30', run: function (l, r, log) { enrollLocal(l, r, log, u, p, o); } }; });
      rows.push({ k: 'back', l: 'Quay lại danh sách thư mời', run: function (l, r) { X.next(l, 'offers945', r); } });
      return rows;
    }, 17);

  function enrollLocal(l, r, log, u, p, o) {
    var s = ED.state(l), thr = ED.threshold(u, p.major), direct = !Number.isFinite(l.examScore) || l.examScore < thr;
    st(l).pendingLocal = { school: u.id, major: p.major, age: l.age };
    s.wishes = [{ school: u.id, major: p.major, program: p.name }]; s.wishAge = l.age; s.submitted = false; s.selected = null; s.region = null; s.kind = 'wishes';
    var d = E.DEC.study_wishes54.make(l); E.DEC.study_wishes54.apply(l, d, 'submit', r, log);
    if (!(s.admitted && s.admitted.age === l.age && s.admitted.school === u.id)) return;
    var x = st(l); x.taken = true; x.scholar = { school: u.name, pct: o.pct, cover: o.cover, label: o.label, since: l.age, direct: direct };
    l.flags.scholarGot = true; H.cash(l, l.base * (o.pct >= 1 ? 0.3 : 0.1 * o.pct * 2), 'Học bổng ' + o.label);
    log('Nhận học bổng ' + o.label + ' của ' + u.name + (direct ? ' (xét tuyển thẳng theo thành tích)' : '') + '. Phải giữ học lực khá trở lên mỗi năm để giữ học bổng.', 'big');
    H.mem(l, 'Cầm thư báo học bổng của ' + u.name + ' và gọi ngay về cho gia đình.', 6);
  }
  // Giữ học bổng: học lực tụt thì mất; học bổng toàn phần có trợ cấp sinh hoạt hằng năm.
  function scholarDue(l) { var s = peek(l); return !!(s.scholar && !s.scholar.lost && l.school === 'uni' && l.age > s.scholar.since); }
  function scholarRun(l) {
    var s = st(l).scholar; if (l.st.kno < 56) { s.lost = true; X.log(l, 'Học lực xuống dưới mức quy định, ' + s.school + ' dừng học bổng. Từ năm sau phải tự lo học phí.', 'bad'); H.fx(l, { hap: -6 }); return; }
    if (s.cover === 'full') H.cash(l, l.base * 0.1, 'Trợ cấp sinh hoạt học bổng');
  }

  // Đưa thêm lựa chọn vào ngã rẽ sau phổ thông và để chế độ tự động chọn nó
  var uni = E.DEC.uni, um = uni.make, ua = uni.apply, uauto = uni.auto;
  uni.make = function (l) {
    var d = um.apply(this, arguments);
    if (d && d.opts && eligible(l) && !d.opts.some(function (o) { return o.k === 'offers945'; })) d.opts.unshift({ k: 'offers945', l: 'Xem thư mời nhập học và học bổng (' + offersOf(l).length + ')', h: 'Chọn trường theo thư mời thay vì chỉ xét điểm' });
    return d;
  };
  uni.apply = function (l, d, k, r, log) {
    if (k === 'offers945') { if (d.opts && d.opts.some(function (o) { return o.k === k; }) && eligible(l)) X.next(l, 'offers945', r); return; }
    return ua.apply(this, arguments);
  };
  uni.auto = function (l, d, r) {
    if (d.opts.some(function (o) { return o.k === 'offers945'; })) { if (r() < 0.85) return 'offers945'; d = Object.assign({}, d, { opts: d.opts.filter(function (o) { return o.k !== 'offers945'; }) }); }
    return uauto.call(this, l, d, r);
  };
  // Hồ sơ du học có thư mời: được nhận và hưởng đúng mức học bổng đã ghi trong thư (vẫn phải đủ ngôn ngữ giảng dạy)
  function offerFor(l, d) { var o = peek(l).offer; return o && d && o.country === d.country && d.lv === 5 && o.until >= l.age ? o : null; }
  var g9 = E.GLOBAL919;
  if (g9) {
    var a0 = g9.admit, s0 = g9.scholarship;
    g9.admit = function (l, d, r) { var x = a0.apply(this, arguments); if (offerFor(l, d) && x && x.ok === false && !x.why) return { ok: true, chance: 1, track: g9.trackOf(l, d.country), offer945: true }; return x; };
    g9.scholarship = function (l, d, r) { var x = s0.apply(this, arguments), o = offerFor(l, d); return o ? { pct: o.pct, cover: o.cover, name: o.name } : x; };
  }

  // ------------------------------------------------------------------
  // 2. Học đại học muộn ở nước đang sống
  // ------------------------------------------------------------------
  function refugeeRec(l, code) { var f = l.flags.refugee945; if (f && f.to === code) return f; var h = l.flags.hist920 && l.flags.hist920.refugee; return h && h.to === code ? h : null; }
  // Quyền học đại học theo tình trạng cư trú: công dân; thường trú; người tị nạn sau khi hồ sơ ổn định (2 năm). Người mới đến hoặc chỉ cư trú tạm thì chưa.
  function rights(l) {
    var a = l.abroad;
    if (!a || a.study || a.trapped || !a.code || a.code === l.country) return { ok: false, kind: 'none', why: 'Chưa sống lâu dài ở nước ngoài' };
    var code = a.code;
    if (E.isCitizenOf && E.isCitizenOf(l, code)) return { ok: true, kind: 'citizen', fee: 1, label: 'công dân ' + (G.W.BY[code] ? G.W.BY[code].name : code) };
    var ref = refugeeRec(l, code);
    if (ref) { var yrs = wy(l) - ref.y; return yrs >= 2 ? { ok: true, kind: 'refugee', fee: 1.5, label: 'người tị nạn đã được công nhận' } : { ok: false, kind: 'pending', why: 'Mới đến ' + Math.max(0, yrs) + ' năm, tình trạng tị nạn chưa ổn định; cần thêm ' + (2 - Math.max(0, yrs)) + ' năm hoặc nhập quốc tịch/thường trú ổn định' }; }
    if (a.perm) return { ok: true, kind: 'resident', fee: 1.5, label: 'thường trú' };
    return { ok: false, kind: 'temp', why: 'Chỉ có cư trú tạm thời; cần thường trú, quốc tịch hoặc visa du học' };
  }
  function langInfo(l) {
    var g = E.GLOBAL919, code = res(l); if (!g || !g.P[code]) return { ok: true, need: 0, lv: 0, track: null };
    var t = g.trackOf(l, code), need = t === 'en' ? 2 : 3, lv = g.instrLevel(l, t); return { ok: lv >= need || !!peek(l).bridge, need: need, lv: lv, track: t };
  }
  function lateReady(l) {
    var x = rights(l); return plain(l) && l.age >= 18 && l.age <= 60 && !l.school && !l.retired && l.edu >= 1 && l.edu < 5 && !!l.abroad && x.ok;
  }
  function lateWhy(l) {
    if (!plain(l)) return 'Cần được tự do đi lại'; if (l.age < 18) return 'Cần đủ 18 tuổi'; if (l.school) return 'Đang đi học'; if (l.retired) return 'Đã nghỉ hưu'; if (l.edu >= 5) return 'Đã có bằng đại học';
    if (!l.abroad) return 'Đang sống ở quê nhà: dùng mục đăng ký đại học trong nước'; var x = rights(l); if (!x.ok) return x.why; return true;
  }
  function stage(l) { var s = peek(l); return s.ged && s.ged.at < l.age ? 'ged' : null; }
  X.menu('lateUni945', 'Học đại học ở nước đang sống',
    function (l) { var w = lateWhy(l); return w; },
    function (l) {
      var x = rights(l), g = langInfo(l), s = peek(l), where = G.W.BY[res(l)] ? G.W.BY[res(l)].name : res(l);
      return 'Bạn đang sống ở ' + where + ' với tư cách ' + x.label + (l.edu < 3 ? ', chưa có bằng tốt nghiệp phổ thông' : ', đã có bằng phổ thông') + '. ' +
        (g.track ? 'Ngôn ngữ giảng dạy cần trình độ ' + g.need + '/4, hiện bạn ở mức ' + g.lv + (s.bridge ? ' (đã qua lớp dự bị)' : '') + '. ' : '') +
        'Người học muộn thường xét theo học bạ, bài kiểm tra đầu vào hoặc năm dự bị, không có kỳ thi phổ thông của nước này. Công dân đóng học phí như người bản xứ; thường trú và người tị nạn đóng cao hơn khoảng 1,5 lần.';
    },
    function (l) {
      var x = rights(l), g = langInfo(l), m = x.fee || 1, rows = [];
      if (l.edu < 3) rows.push({ k: 'ged', l: 'Học bổ túc để lấy bằng phổ thông', h: 'Tốn ' + H.money(l, l.base * 0.1 * m) + ', một năm học, kết quả phụ thuộc học lực', why: l.money >= l.base * 0.1 * m ? true : 'Chưa đủ tiền', run: function (l, r, log) { H.cash(l, -l.base * 0.1 * m, 'Học bổ túc phổ thông'); st(l).ged = { at: l.age }; log('Bạn đăng ký lớp bổ túc để lấy bằng phổ thông; kết quả có sau một năm.', 'neutral'); } });
      else {
        rows.push({ k: 'apply', l: 'Nộp hồ sơ đăng ký đại học', h: g.ok ? 'Xét học bạ và bài kiểm tra đầu vào; lệ phí ' + H.money(l, l.base * 0.01 * m) : 'Chưa đủ ngoại ngữ giảng dạy; nên học dự bị trước', why: g.ok ? (l.money >= l.base * 0.01 * m ? true : 'Chưa đủ tiền lệ phí') : 'Cần trình độ ngôn ngữ giảng dạy ' + g.need + '/4 hoặc năm dự bị', run: function (l, r, log) { applyLate(l, r, log, x, g); } });
        rows.push({ k: 'bridge', l: 'Học năm dự bị: ngôn ngữ và bổ sung kiến thức', h: 'Tốn ' + H.money(l, l.base * 0.12 * m) + ', vừa học vừa làm, nộp hồ sơ năm sau', why: peek(l).bridge ? 'Đã học dự bị' : l.money >= l.base * 0.12 * m ? true : 'Chưa đủ tiền', run: function (l, r, log) { H.cash(l, -l.base * 0.12 * m, 'Học năm dự bị đại học'); st(l).bridge = l.age; H.fx(l, { kno: 2 }); log('Bạn theo học lớp dự bị: tiếng ' + (g.track || 'bản địa') + ', bổ sung toán và khoa học, chuẩn bị hồ sơ cho năm sau.', 'good'); } });
      }
      rows.push({ k: 'later', l: 'Chưa phải lúc', h: 'Hỏi lại sau vài năm', run: function (l) { st(l).askedAt = l.age; } });
      return rows;
    }, 18, 'Học tập');

  function applyLate(l, r, log, x, g) {
    var s = st(l); s.tries = (s.tries || 0) + 1; H.cash(l, -l.base * 0.01 * x.fee, 'Lệ phí hồ sơ đại học');
    var base = E.rollExamScore(l, r), pen = Math.max(0, g.need - g.lv) * (peek(l).bridge ? 0 : 1.2), bonus = peek(l).bridge ? 1.5 : 0, recog = x.kind === 'refugee' && !peek(l).bridge && r() < 0.25 ? 1.5 : 0;
    s.priorExam = Number.isFinite(l.examScore) ? l.examScore : null;
    l.examScore = Math.round(U.clamp(base - pen + bonus - recog, 5, 30) * 4) / 4;
    var notes = []; if (pen) notes.push('ngôn ngữ giảng dạy còn yếu'); if (recog) notes.push('bằng cấp cũ chưa được công nhận đầy đủ'); if (bonus) notes.push('đã học năm dự bị');
    log('Bài kiểm tra đầu vào của một trường ở ' + (G.W.BY[res(l)] ? G.W.BY[res(l)].name : res(l)) + ': ' + U.fmtNum(l.examScore, 2) + '/30' + (notes.length ? ' (' + notes.join(', ') + ')' : '') + '.', 'neutral');
    if (!ED.applicant(l)) { log('Hiện chưa đủ điều kiện nộp nguyện vọng.', 'neutral'); return; }
    ED.open(l, r);
  }
  E.UNI945.rights = rights; E.UNI945.lateReady = lateReady;

  // Mỗi năm: kết quả lớp bổ túc, lời mời lại việc học muộn, nhắc sau khi trượt
  function gedDue(l) { var s = peek(l); return !!(s.ged && s.ged.at === l.age - 1 && !s.ged.done && l.edu < 3 && plain(l)); }
  function gedRun(l, r) {
    var s = st(l); s.ged.done = true; var pass = U.clamp(0.35 + (l.st.kno - 40) / 100, 0.2, 0.9);
    if (r() < pass) { l.edu = Math.max(l.edu, 3); X.log(l, 'Đỗ kỳ thi bổ túc, có bằng tốt nghiệp phổ thông. Cửa vào đại học đã mở.', 'big'); H.fx(l, { hap: 6 }); }
    else X.log(l, 'Chưa đỗ kỳ thi bổ túc; có thể đăng ký lại.', 'bad');
  }
  function promptDue(l) {
    if (!lateReady(l) || l.edu < 3 || l.pending.some(function (d) { return /^(lateUni945|study_wishes54|uni|uniFail)$/.test(d.id); })) return false;
    var s = peek(l), asked = s.askedAt; if (asked != null && l.age - asked < 3) return false;
    if ((s.tries || 0) >= 4) return false; return l.age <= 45;
  }
  function promptRun(l, r) { var s = st(l); if (s.bridge && s.bridge < l.age) s.askedAt = null; X.next(l, 'lateUni945', r, {}, { manual: false }); }
  // Dùng móc cuối năm (không thêm sự kiện ngẫu nhiên) để các đời bình thường không bị đổi dãy số ngẫu nhiên; chỉ tiêu thụ số ngẫu nhiên khi đã đủ điều kiện
  function yearHook(l, r) {
    if (!l.alive || !l.flags) return;
    if (scholarDue(l)) scholarRun(l);
    if (gedDue(l)) gedRun(l, r);
    if (promptDue(l) && r() < 0.4) promptRun(l, r);
  }
  E.HOOKS.year.push(yearHook); E.UNI945.yearHook = yearHook;
  // Sau khi trượt xét tuyển, người sống ở nước ngoài vẫn được hỏi lại ở các năm sau
  var uniFail = E.DEC.uniFail;
  if (uniFail && uniFail.apply) { var uf0 = uniFail.apply; uniFail.apply = function (l) { var x = uf0.apply(this, arguments); if (l.abroad && !l.school) { var s = st(l); s.askedAt = null; } return x; }; }
})(G);
