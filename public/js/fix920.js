/* Một Đời — MD5 hoàn thiện phần tồn (8.10.24): fix920.
   · FAMILY-01: mỗi người yêu/bạn đời có mã người (pid920 = uid110), ghi nhận hồ sơ lúc giới thiệu (intro920) và lịch sử nghề
     (jobHist920). Nghề đổi thật có tuổi, lý do và dòng nhật ký; thông tin lúc giới thiệu không bị viết lại.
   · CHILD: con ngoài hôn nhân của người chơi nam (người kia mang thai) mặc định sống ở hộ người trực tiếp chăm sóc, không tự
     vào nhà vợ/chồng hiện tại; công khai, xác minh và ở chung là ba trạng thái khác nhau. present() dùng chung cho sự kiện gia đình.
   · FIN-03: thủ tục ly hôn khi một bên đang chấp hành án (đơn thuận tình/đơn phương, hòa giải, hoãn, mất liên lạc, quyết định).
     Không tự ly hôn sau X năm; kết thúc bằng hệ ly hôn chung của game (H.endPartner 'div').
   · FIN-04: quy tắc đổi diện tại chỗ sau khóa tiếng; một màn hình cư trú đọc chung hồ sơ định cư (life114), thường trú (md4b)
     và đoàn tụ vợ/chồng (global919), chặn nộp trùng cùng nước.
   · FIN-05: quốc tịch trẻ nhận nuôi quốc tế theo từng nước; hồ sơ hỗ trợ tiêu hủy gia súc có mã, một lần; tùy chọn nội dung
     nhạy cảm (đầy đủ / nhẹ nhàng / tắt sự kiện mất con nhỏ). */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, W = G.W, X = E.UPDATE110;
  if (!X) return;
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; return h >>> 0; }
  function u(seed) { return hash(seed) / 4294967296; }
  function mo(l, v) { return H.money(l, v); }
  function st(l) { var s = l.flags.fin920; if (!s || typeof s !== 'object') s = l.flags.fin920 = {}; return s; }
  function cname(c) { return W.BY[c] ? W.BY[c].name : c; }
  function jailed(l) { return l.jailUntil != null && l.age < l.jailUntil; }
  function res(l) { return E.resCode ? E.resCode(l) : (l.abroad && l.abroad.code) || l.country; }

  // ================= FAMILY-01: một người, một hồ sơ nghề =================
  function pid(l, p) { return p.pid920 || (p.pid920 = X.uid(l, p)); }
  function jobTrack(l, p, log) {
    if (!p || p.alive === false || p.name == null) return; pid(l, p);
    if (p.jobLast920 === undefined) { p.jobLast920 = p.job || null; p.jobIdLast920 = p.jobId || null; return; }
    if (p.job === p.jobLast920) return;
    var from = p.jobLast920, c = p.jobIdLast920 && E.CAR[p.jobIdLast920], why = from == null ? 'bổ sung hồ sơ' : from === 'sinh viên' || /^học sinh/.test(from) ? 'ra trường' : p.job === 'đã nghỉ hưu' ? 'nghỉ hưu' : c && c.t.indexOf(p.job) >= 0 ? 'thăng chức' : 'đổi việc';
    (p.jobHist920 || (p.jobHist920 = [])).push({ age: l.age, y: l.birthYear + l.age, from: from, to: p.job, why: why });
    if (p.jobHist920.length > 20) p.jobHist920 = p.jobHist920.slice(-20);
    if (why === 'đổi việc' && log) log(p.name + ' chuyển sang làm ' + p.job + (from ? ' (trước đây ' + from + ')' : '') + '.', 'neutral');
    p.jobLast920 = p.job; p.jobIdLast920 = p.jobId || null;
  }
  function profile(l, p) {
    if (!p) return '';
    var t = 'Nghề hiện tại: ' + (p.job || 'chưa biết') + '.', i = p.intro920;
    if (i && i.job && i.job !== p.job) t += ' Thông tin lúc giới thiệu (bạn ' + i.age + ' tuổi): ' + i.job + '; hiện đã đổi nghề.';
    else if (i && i.job) t += ' Đúng như lúc được giới thiệu (bạn ' + i.age + ' tuổi).';
    var h = (p.jobHist920 || []).filter(function (x) { return x.why !== 'bổ sung hồ sơ'; }).slice(-4);
    if (h.length) t += ' Quá trình: ' + h.map(function (x) { return x.why + ' ở tuổi bạn ' + x.age + ' (' + (x.from || '?') + ' → ' + x.to + ')'; }).join('; ') + '.';
    return t;
  }
  var lmk = E.DEC.love.make, lap = E.DEC.love.apply;
  E.DEC.love.make = function (l, r, arg) {
    var d = lmk.apply(this, arguments), p = d && d.data && d.data.p;
    if (p && !p.intro920) p.intro920 = { age: l.age, job: p.job || null, where: arg && arg.where || null };
    return d;
  };
  E.DEC.love.apply = function (l, d, k) {
    var out = lap.apply(this, arguments), p = d && d.data && d.data.p, q = l.partner;
    // hồ sơ được tạo lại ở các wrapper trước (life108 sinh lại tuổi/nghề) thì giữ ảnh chụp của chính người được giới thiệu
    if (p && q && q.name === p.name && !q.intro920) { q.intro920 = { age: l.age, job: p.job || q.job || null, where: p.intro920 && p.intro920.where }; /* hồ sơ lúc nhận lời = hồ sơ người chơi đã đọc */ q.jobLast920 = q.job || null; q.jobIdLast920 = q.jobId || null; pid(l, q); }
    return out;
  };

  // ================= CHILD: hộ gia đình, công khai và quyền tham dự =================
  function outside(k) { return k.birthContext108 === 'outside' || k.birthContext108 === 'affair'; }
  function home(l, k) {
    if (k.custody === 'other' || k.custody === 'ex') return 'other';
    if (k.custody === 'both') return 'both';
    if (k.custody === 'me') return 'family';
    return k.branch908 && k.branch908.home === 'other' ? 'other' : 'family';
  }
  // bạn đời/người thân biết về đứa trẻ: con sống cùng nhà thì ai cũng biết; con ở hộ khác chỉ khi đã công khai
  function visible(l, k) { if (!outside(k) || home(l, k) !== 'other') return true; return !!(k.branch908 && k.branch908.public); }
  function present(l, k, o) {
    o = o || {}; if (!k || k.alive === false) return false;
    var h = home(l, k);
    if (h === 'other' && !(o.invited && visible(l, k))) return false;
    if (o.withPartner && !visible(l, k)) return false;
    return true;
  }
  function settleKids(l, log) {
    var moved = [];
    (l.kids || []).forEach(function (k) {
      if (k.alive === false || k.custody || !outside(k) || l.sex !== 'M' || l.age - k.born >= 18) return;
      k.custody = 'other'; k.custody920 = l.age; if (k.branch908) k.branch908.home = 'other'; moved.push(k.name);
    });
    if (moved.length && log && !st(l).childNote) { st(l).childNote = l.age; log('Hồ sơ gia đình ghi ' + moved.join(', ') + ' đang sống với người trực tiếp chăm sóc; bạn vẫn là cha và có trách nhiệm cấp dưỡng. Có thể bàn nơi ở trong mục “Nơi sống của con ngoài hôn nhân”.', 'neutral'); }
  }

  // ================= FIN-03: ly hôn khi đang chấp hành án =================
  function spouse(l) { var p = l.partner; return p && p.alive !== false && p.status === 'married' ? p : null; }
  function dcase(l) { var c = st(l).div; return c && !c.closed ? c : null; }
  function divWhy(l) { var r = X.reason(l, 18); if (r !== true && !jailed(l)) return r; if (!spouse(l)) return 'Cần đang trong hôn nhân'; return jailed(l) || spouse(l).separated919 != null || dcase(l) ? true : 'Dành cho hôn nhân khi một bên đang chấp hành án hoặc đã ly thân vì án tù'; }
  function bond(l, p) { return E.RELATIONS108 ? E.RELATIONS108.bond(l, p) : p.close || 50; }
  function openCase(l, by, mutual, aid, log) {
    var p = spouse(l), fee = aid ? 0 : l.base * (mutual ? 0.01 : 0.03);
    if (!p || dcase(l)) return; if (fee) H.cash(l, -fee, 'Án phí, chi phí hồ sơ ly hôn');
    st(l).div = { id: l.id + ':div920:' + l.age, by: by, mutual: mutual, aid: aid, at: l.age, due: l.age + 1, stage: 'filed', post: 0, who: pid(l, p), name: p.name };
    log((by === 'me' ? 'Bạn nộp đơn ' : p.name + ' nộp đơn ') + (mutual ? 'thuận tình ly hôn' : 'ly hôn đơn phương') + ' lên tòa có thẩm quyền' + (jailed(l) ? '; trại giam hỗ trợ chuyển hồ sơ và lấy ý kiến của bạn' : '') + '. Hôn nhân vẫn còn hiệu lực cho đến khi có quyết định.', 'neutral');
  }
  function divYear(l, r, log) {
    var p = spouse(l), c = dcase(l);
    if (c && (!p || pid(l, p) !== c.who)) { c.closed = 'moot'; c.stage = 'closed'; return; }
    if (!c && p && jailed(l) && p.separated919 != null && (p.affection108 == null ? (p.close || 50) : p.affection108) < 35 && u(l.id + ':divby:' + l.age) < 0.3) { openCase(l, 'partner', u(l.id + ':divm:' + l.age) < 0.5, true, log); return; }
    if (!c || l.age < c.due) return;
    if (c.stage === 'filed' && u(c.id + ':contact') < 0.08 && !c.notice) { c.notice = true; c.stage = 'nocontact'; c.due = l.age + 1; log('Tòa chưa tống đạt được giấy tờ cho ' + (c.by === 'me' ? c.name : 'bạn') + '; hồ sơ chờ thủ tục thông báo, thêm khoảng một năm.', 'neutral'); return; }
    var granted = c.mutual || c.post >= 2 || u(c.id + ':dec:' + c.post) < 0.7;
    if (!granted) { c.post++; c.stage = 'postponed'; c.due = l.age + 1; log('Phiên hòa giải chưa thành, tòa hoãn để thu thập thêm ý kiến và chứng cứ về con chung, tài sản.', 'neutral'); return; }
    c.stage = 'granted'; c.closed = l.age; c.decided = l.age;
    log('Tòa ra quyết định ' + (c.mutual ? 'công nhận thuận tình ly hôn' : 'giải quyết ly hôn') + ' giữa bạn và ' + c.name + '. Quyền nuôi con, cấp dưỡng và tài sản được giải quyết theo quyết định.', 'bad');
    H.endPartner(l, log, 'div');
  }
  X.menu('divorceCase920', 'Ly hôn khi đang chấp hành án', divWhy, function (l) {
    var c = dcase(l), p = spouse(l);
    return 'Ly thân không làm chấm dứt hôn nhân. Vợ, chồng (kể cả người đang chấp hành án) có quyền yêu cầu tòa giải quyết ly hôn; thủ tục gồm nộp đơn, hòa giải, có thể hoãn hoặc chờ thông báo khi không liên lạc được, rồi mới có quyết định. Chưa có quyết định thì hôn nhân vẫn còn.' +
      (p ? '\n' + p.name + (p.separated919 != null ? ' · đã ly thân từ khi bạn ' + p.separated919 + ' tuổi' : '') : '') +
      (c ? '\nHồ sơ: ' + (c.by === 'me' ? 'bạn nộp' : 'người ấy nộp') + ', ' + (c.mutual ? 'thuận tình' : 'đơn phương') + ' — ' + { filed: 'chờ hòa giải', postponed: 'đang hoãn', nocontact: 'chờ thông báo' }[c.stage] + ', dự kiến xét khi bạn ' + c.due + ' tuổi.' : '');
  }, function (l) {
    var c = dcase(l), p = spouse(l), poor = l.money < l.base;
    if (c) return [{ k: 'withdraw', l: c.by === 'me' ? 'Rút đơn (hai người muốn giữ hôn nhân)' : 'Nói chuyện với người ấy về việc rút đơn', why: c.by === 'me' || bond(l, p) >= 45 ? true : 'Người ấy giữ quyết định nộp đơn', run: function (l, r, log) { c.closed = 'withdrawn'; c.stage = 'withdrawn'; log('Đơn ly hôn được rút; hai người vẫn là vợ chồng.', 'neutral'); } }];
    return [
      { k: 'mutual', l: 'Bàn với ' + p.name + ' để nộp đơn thuận tình', h: 'Người ấy có quyền đồng ý hoặc không', run: function (l, r, log) { var yes = u(l.id + ':divok:' + l.age) < U.clamp(0.75 - bond(l, p) / 200, 0.2, 0.85); if (!yes) { log(p.name + ' chưa đồng ý ly hôn lúc này. Bạn vẫn có thể nộp đơn đơn phương.', 'neutral'); return; } openCase(l, 'me', true, poor, log); } },
      { k: 'single', l: 'Nộp đơn ly hôn đơn phương', h: poor ? 'Được trợ giúp pháp lý miễn phí' : '~' + mo(l, l.base * 0.03), run: function (l, r, log) { openCase(l, 'me', false, poor, log); } }
    ];
  }, 18, 'Tình cảm & gia đình');
  // người đang thụ án vẫn mở được mục này (X.reason chặn người không tự do)
  E.ACT.forEach(function (a) { if (a.id === 'divorceCase920') a.avail = divWhy; });
  var dv0 = E.DEC.divorceCase920.valid; E.DEC.divorceCase920.valid = function (l, d) { return divWhy(l) === true && (!d || d.at == null || d.at === l.age && !d.done || d.data && d.data.requested); };

  // ================= FIN-04: cư trú, đổi diện, hồ sơ trùng =================
  // Đổi diện tại chỗ sau khóa tiếng ngắn hạn. Chỉ GB đã đọc nguồn chính thức; các nước còn lại là nguồn thứ cấp, ghi rõ.
  var SWITCH = {
    GB: { mode: 'leave', ok: 'official', note: 'Visa học ngắn hạn ở Anh không cho chuyển sang visa sinh viên từ trong nước; phải nộp từ nước nhà (gov.uk/student-visa/switch-to-this-visa).' },
    JP: { mode: 'onshore', ok: 'secondary', note: 'Nhật: đổi/gia hạn tư cách lưu trú du học tại cục xuất nhập cảnh (nguồn thứ cấp, chưa đọc nguyên văn).' },
    KR: { mode: 'onshore', ok: 'secondary', note: 'Hàn: đổi D-4 sang D-2 tại chỗ (nguồn thứ cấp).' },
    DE: { mode: 'onshore', ok: 'secondary', note: 'Đức: từ khóa tiếng có thể xin giấy phép du học tại Sở ngoại kiều (nguồn thứ cấp).' },
    AU: { mode: 'onshore', ok: 'secondary', note: 'Úc: nộp visa sinh viên mới khi còn trong nước nếu visa hiện tại không có điều kiện cấm (nguồn thứ cấp).' },
    CA: { mode: 'onshore', ok: 'secondary', note: 'Canada: đổi giấy phép học tại chỗ khi còn hiệu lực (nguồn thứ cấp).' },
    US: { mode: 'onshore', ok: 'secondary', note: 'Mỹ: chuyển trường trong diện F-1 qua SEVIS (nguồn thứ cấp).' }
  };
  function switchRule(c) { return SWITCH[c] || { mode: 'home', ok: 'unverified', note: 'Quy định đổi diện tại chỗ của ' + cname(c) + ' chưa xác minh; trò chơi xử lý như nộp từ nước nhà.' }; }
  function cases(l) {
    var out = [], m = l.flags.life114 || {}, b = l.flags.md4b || {}, g = E.GLOBAL919 ? E.GLOBAL919.state(l) : {}, f = g.res && g.res.file;
    if (m.migration) out.push({ src: 'life114', kind: 'skilled', dest: m.migration.country, t: 'Hồ sơ định cư diện lao động kỹ năng', stage: 'đang xét đến ' + m.migration.due + ' tuổi' });
    if (m.approved) out.push({ src: 'life114', kind: 'skilled', dest: m.approved.country, t: 'Hồ sơ định cư đã chấp thuận', stage: 'chờ chuyển trước ' + m.approved.until + ' tuổi', ready: true });
    if (b.pr && !b.pr.done) out.push({ src: 'md4b', kind: 'pr', dest: b.pr.code, t: 'Hồ sơ thường trú tại nơi đang làm việc', stage: 'đang xét' });
    if (f && (f.stage === 'submitted' || f.stage === 'rfe')) out.push({ src: 'global919', kind: 'spouse', dest: f.dest, t: f.dir === 'in' ? 'Hồ sơ bảo lãnh bạn đời' : 'Hồ sơ cư trú diện vợ/chồng', stage: f.stage === 'rfe' ? 'cần bổ sung giấy tờ' : 'đang xét' });
    return out;
  }
  function resBlock(l, dest, kind) {
    if (kind === 'skilled' && l.abroad && l.abroad.perm && l.abroad.code === dest) return 'Bạn đã có quyền cư trú lâu dài tại ' + cname(dest);
    var c = cases(l).filter(function (x) { return x.dest === dest && x.kind !== kind && (x.kind !== 'spouse' || kind !== 'spouse'); })[0];
    return c ? 'Đang có “' + c.t.toLowerCase() + '” cho ' + cname(dest) + ' (' + c.stage + '); không nộp hai hồ sơ cùng lúc' : null;
  }
  function citizenships(l) { var c = [l.country].concat(l.flags.citizen || []); return c.filter(function (x, i) { return x && c.indexOf(x) === i; }); }
  function residence(l) {
    var a = l.abroad; if (!a) return 'Đang sống tại ' + cname(l.country) + ' (công dân).';
    var kind = a.perm ? 'thường trú / định cư' : a.study || a.langCourse919 ? 'cư trú tạm diện học tập' : a.visit907 ? 'thăm thân / du lịch ngắn hạn' : 'cư trú tạm diện lao động';
    var work = a.perm ? 'được làm việc' : a.study || a.langCourse919 ? 'làm thêm theo giới hạn của visa du học (tùy nước)' : a.visit907 ? 'không được làm việc' : 'làm việc theo giấy phép';
    return 'Đang sống tại ' + cname(a.code) + ': ' + kind + (a.until ? ' đến ' + a.until + ' tuổi' : '') + ' · quyền làm việc: ' + work + '.';
  }
  X.menu('residence920', 'Tình trạng cư trú, quốc tịch và hồ sơ đang mở', function (l) { return X.reason(l, 16); }, function (l) {
    var cs = cases(l);
    return residence(l) + '\nQuốc tịch đang có: ' + citizenships(l).map(cname).join(', ') + '. Cư trú tạm, du học, quyền làm việc, thường trú và quốc tịch là các bước riêng.' +
      (cs.length ? '\nHồ sơ đang mở:' + cs.map(function (x) { return '\n• ' + x.t + ' — ' + cname(x.dest) + ': ' + x.stage; }).join('') : '\nKhông có hồ sơ cư trú nào đang mở.') + '\nMỗi nước chỉ một hồ sơ cùng lúc; mở hồ sơ ở mục bên dưới, các mục cũ dùng cùng dữ liệu này.';
  }, function (l) {
    var out = [];
    [['migrate114', 'Hồ sơ định cư từ trong nước'], ['move114', 'Xác nhận chuyển định cư đã duyệt'], ['pr919', 'Thường trú tại nước đang làm việc'], ['spouse919', 'Nơi sống sau kết hôn / đoàn tụ'], ['naturalize114', 'Xin nhập quốc tịch nơi định cư']].forEach(function (x) {
      var a = E.ACT.filter(function (y) { return y.id === x[0]; })[0], why = a && a.avail ? a.avail(l) : E.DEC[x[0]] && E.DEC[x[0]].valid(l) ? true : 'Chưa áp dụng';
      out.push({ k: x[0], l: x[1], why: why, run: function (l, r) { if (x[0] === 'naturalize114') { var d = E.DEC.nhap_quoc_tich.make(l, r, { code: l.abroad && l.abroad.code }); d.manual = true; l.pending.unshift(d); } else X.next(l, x[0], r); } });
    });
    return out;
  }, 16, 'Đời sống');

  // ================= FIN-05: quốc tịch con nuôi quốc tế =================
  // auto: tự có khi đủ điều kiện; apply: phải nộp hồ sơ xét cấp; nat: nhập tịch giản lược. ok: mức kiểm chứng của nguồn.
  var ADOPT = {
    US: { how: 'auto', ok: 'secondary', t: 'Mỹ (Đạo luật Quốc tịch Trẻ em 2000): trẻ dưới 18 tuổi, đã hoàn tất nhận nuôi ở nước ngoài và nhập cảnh diện thường trú (IR-3) tự có quốc tịch khi sống cùng cha/mẹ công dân' },
    DE: { how: 'auto', ok: 'official', t: 'Đức (§6 StAG): trẻ chưa đủ 18 tuổi lúc nộp đơn nhận nuôi, được nhận nuôi hợp lệ theo luật Đức (bản án nước ngoài phải chấm dứt quan hệ với cha mẹ cũ và tương đương luật Đức) có quốc tịch Đức' },
    FR: { how: 'auto', ok: 'secondary', t: 'Pháp: nhận nuôi trọn vẹn (adoption plénière) cho quốc tịch Pháp; nhận nuôi đơn giản phải khai báo riêng' },
    GB: { how: 'apply', ok: 'secondary', t: 'Anh: nhận nuôi theo tòa án Anh hoặc Công ước La Hay khi cha/mẹ là công dân và cư trú tại Anh thì tự có; trường hợp khác phải đăng ký' },
    CA: { how: 'apply', ok: 'secondary', t: 'Canada: nộp hồ sơ cấp quốc tịch cho con nuôi (không tự động)' },
    AU: { how: 'apply', ok: 'secondary', t: 'Úc: nộp hồ sơ cấp quốc tịch (conferral) cho trẻ nhận nuôi theo Công ước La Hay' },
    JP: { how: 'nat', ok: 'secondary', t: 'Nhật: nhận nuôi không tự cho quốc tịch; trẻ có thể nhập tịch giản lược sau khoảng một năm cư trú' }
  };
  function adoptCit(l, a, log) {
    var cc = a.citPending.cc, R = ADOPT[cc], c = a.citPending;
    if (E.isCitizenOf && E.isCitizenOf(l, cc)) { a.citPending = null; return true; }
    function grant(t) { a.citPending = null; l.flags.citizen = l.flags.citizen || []; if (l.flags.citizen.indexOf(cc) < 0) l.flags.citizen.push(cc); a.cit920 = { cc: cc, at: l.age, how: R ? R.how : 'unverified' }; log(t, 'good'); }
    if (!R) {
      if (!c.note920) { c.note920 = true; log('Quy định quốc tịch cho trẻ nhận nuôi của ' + cname(cc) + ' chưa được xác minh trong trò chơi; gia đình nộp hồ sơ theo diện xét cấp, có thể mất thêm thời gian.', 'neutral'); c.due = Math.max(c.due, l.age + 1); return true; }
      if (l.age < c.due) return true;
      grant('Hồ sơ quốc tịch ' + cname(cc) + ' của bạn được chấp thuận (quy định giản lược, chưa xác minh). Quốc tịch gốc vẫn ghi trong hồ sơ; giữ hai quốc tịch hay không tùy luật mỗi nước.'); return true;
    }
    if (R.how === 'auto') { if (l.age >= 18 && !c.under18) { a.citPending = null; log('Bạn đã đủ 18 tuổi khi thủ tục hoàn tất nên không thuộc diện tự có quốc tịch ' + cname(cc) + ' theo cha mẹ nuôi; có thể nhập tịch theo diện thường.', 'neutral'); return true; } grant(R.t + '. Bạn có quốc tịch ' + cname(cc) + ' từ khi đủ điều kiện, không cần chờ thêm.'); return true; }
    if (!c.filed920) { c.filed920 = l.age; c.due = l.age + (R.how === 'nat' ? 1 : 1); log(R.t + '. Gia đình nộp hồ sơ cho bạn; trong lúc chờ, bạn cư trú hợp pháp theo diện con của thường trú nhân/công dân.', 'neutral'); return true; }
    if (l.age < c.due) return true;
    if (u(l.id + ':acit:' + cc + ':' + c.filed920) < 0.9 || c.retry920) grant('Hồ sơ quốc tịch ' + cname(cc) + ' theo cha mẹ nuôi được chấp thuận.');
    else { c.retry920 = true; c.due = l.age + 1; log('Hồ sơ quốc tịch ' + cname(cc) + ' cần bổ sung giấy tờ; xét lại năm sau.', 'neutral'); }
    return true;
  }

  // Hỗ trợ tiêu hủy: một mã hồ sơ cho mỗi ổ dịch, trần mỗi năm, đàn vừa nhập trong năm cần xác minh nguồn gốc.
  var CULL = { rate: 0.35, cap: 2, label: 'Mức ước tính; hỗ trợ theo nước và thời kỳ chưa được đối chiếu văn bản' };
  function cullClaim(l, f, d, n, amount, log) {
    var s = st(l), out = f.out || {}, id = (out.k || 'herd') + ':' + (d && d.id) + ':' + (out.at != null ? out.at : l.age);
    s.claims = s.claims || {}; if (s.claims[id]) { log('Hồ sơ hỗ trợ cho ổ dịch này đã được giải quyết trước đó; không chi lần hai.', 'neutral'); return 0; }
    var fresh = f.buy920 && f.buy920[out.k] === l.age, used = Object.keys(s.claims).filter(function (k) { return s.claims[k].age === l.age; }).reduce(function (t, k) { return t + s.claims[k].paid; }, 0);
    var pay = Math.max(0, Math.min(amount * (fresh ? 0.5 : 1), l.base * CULL.cap - used));
    s.claims[id] = { age: l.age, n: n, asked: amount, paid: pay, fresh: fresh };
    if (pay > 0) H.cash(l, pay, 'Hỗ trợ tiêu hủy (hồ sơ ' + id + ')');
    log('Hồ sơ hỗ trợ tiêu hủy ' + n + ' con được duyệt: ' + mo(l, pay) + (fresh ? ' (đàn mới nhập trong năm, chỉ hỗ trợ một phần chờ xác minh nguồn gốc)' : '') + '. ' + CULL.label + '.', 'neutral');
    return pay;
  }

  // Nội dung nhạy cảm: full = đầy đủ; mild = lọc trình bày (sự kiện vẫn xảy ra, lời kể nhẹ nhàng); off = không tạo mới sự kiện trẻ dưới 5 tuổi qua đời.
  var SENS = { full: 'Mô tả đầy đủ', mild: 'Mô tả nhẹ nhàng (chỉ đổi lời kể)', off: 'Tắt sự kiện mất con nhỏ (không tạo mới)' };
  function sensMode(l) { var m = l && l.flags && l.flags.sens920 || G.sens920; return SENS[m] ? m : 'full'; }
  var SOFT = [/^Con (.+?) qua đời khi (?:chưa tròn một tuổi|mới [0-4] tuổi) vì .*$/, /^Nỗi đau không lời: (.+?) ra đi khi đang ngủ.*$/, /^Con (.+?) qua đời vì biến chứng của .* khi [0-4] tuổi\.$/];
  function soften(l) {
    if (sensMode(l) !== 'mild') return;
    (l.log || []).slice(-40).forEach(function (e) { if (e.soft920) return; for (var i = 0; i < SOFT.length; i++) { var m = SOFT[i].exec(e.t || ''); if (m) { e.t = 'Gia đình mất bé ' + m[1] + '. Người thân và nhân viên y tế ở bên hỗ trợ cả nhà vượt qua những ngày khó khăn.'; e.soft920 = true; return; } } });
  }
  var endY = E.endYear; E.endYear = function (l) { var out = endY.apply(this, arguments); try { soften(l); } catch (e) { } return out; };
  E.SENS920 = { MODES: SENS, mode: sensMode, blocks: function (l) { return sensMode(l) === 'off'; }, set: function (l, m) { if (!SENS[m]) return false; if (l && l.flags) l.flags.sens920 = m; G.sens920 = m; return true; }, soften: soften };

  // ================= hook năm, bản lưu =================
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !['vn', 'world'].includes(l.mode)) return;
    jobTrack(l, l.partner, log); settleKids(l, log); divYear(l, r, log);
  });
  var mig = E.migrateExt; E.migrateExt = function (l) {
    if (mig) mig(l); if (!l || !l.flags) return;
    var p = l.partner; if (p && p.jobLast920 === undefined) { p.jobLast920 = p.job || null; p.jobIdLast920 = p.jobId || null; }
    if (l.flags.sens920 == null && G.sens920) l.flags.sens920 = G.sens920;
  };
  E.FIN920 = { pid: pid, jobTrack: jobTrack, profile: profile, home: home, visible: visible, present: present, settleKids: settleKids, divYear: divYear, openCase: openCase, switchRule: switchRule, SWITCH: SWITCH, cases: cases, resBlock: resBlock, residence: residence, ADOPT: ADOPT, adoptCit: adoptCit, cullClaim: cullClaim, CULL: CULL };
  E.FAM920 = { present: present, home: home, visible: visible };
})(globalThis.G);
