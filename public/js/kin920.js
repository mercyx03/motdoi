/* Một Đời — MD5 (8.10.24): kin920 — gia đình hai bên, nơi ở, nội trợ, nuôi dạy con, phản bội không gắn với chu cấp.
   · FAMILY-02: hồ sơ gia đình bên người ấy (cha mẹ sinh học/nuôi, anh chị em, nơi ở, gia cảnh, truyền thống) sinh một lần theo mã
     người (pid920), có người đã mất/chưa biết; không lộ tiền/bí mật khi chưa gặp; tiền cha mẹ không cộng vào tiền người ấy.
   · FAMILY-03: ra mắt cần người ấy đồng ý; trực tiếp/online/thăm nhà; thiện cảm theo cách cư xử, tính cách, quan hệ hai người,
     không theo giàu nghèo/quốc tịch; quà có trần; xin phép là tương tác gia đình, không phải điều kiện cưới của người trưởng thành.
   · FAMILY-04: nơi ở sau cưới (ở riêng thuê/mua, nhà bố mẹ một bên cần chủ nhà đồng ý, tạm ở riêng vì việc/visa); chi phí đúng.
   · HOUSEHOLD: thỏa thuận làm việc/tạm nghỉ/bán thời gian/quản lý gia đình cho mọi giới, cần đồng thuận; tải chăm sóc theo số con,
     thú cưng, người phụ thuộc; giúp việc/bảo mẫu; ngân sách cá nhân; mục tiêu riêng của bạn đời có tiến độ và có thể bỏ dở.
   · PARENTING: hoạt động theo tuổi, kế hoạch học có căng thẳng, điện thoại có thỏa thuận/tạm giữ có thời hạn. Không có hành động đánh
     con: lựa chọn nóng giận chuyển sang dừng lại, xin lỗi, học kiểm soát cảm xúc (WHO: trừng phạt thân thể không cải thiện hành vi).
   · FAMILY-SUPPORT: phản bội là chuỗi hiếm cho mọi cặp đôi theo mức cam kết và chất lượng quan hệ (không theo việc được chu cấp,
     không theo nghề nội trợ), có nghi ngờ khác chứng cứ, trò chuyện, ranh giới, ly thân/ly hôn qua thủ tục chung. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, W = G.W, X = E.UPDATE110;
  if (!X) return;
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; return h >>> 0; }
  function u(seed) { return hash(seed) / 4294967296; }
  function rng(seed) { var a = hash(seed); return function () { a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function mo(l, v) { return H.money(l, v); }
  function st(l) { var s = l.flags.kin920; if (!s || typeof s !== 'object') s = l.flags.kin920 = {}; return s; }
  function clamp(v) { return U.clamp(v, 0, 100); }
  function pid(l, p) { return E.FIN920 ? E.FIN920.pid(l, p) : X.uid(l, p); }
  function partner(l) { var p = l.partner; return p && p.alive !== false ? p : null; }
  function wed(l) { var p = partner(l); return p && p.status === 'married' ? p : null; }
  function adult(l) { return X.reason(l, 18); }
  function stress(l, d) { if (l.mind) l.mind.stress = U.clamp((l.mind.stress || 0) + d, 0, 100); }

  // ================= FAMILY-02: hồ sơ gia đình bên người ấy =================
  var MEANS = ['khó khăn', 'bình thường', 'khá giả', 'giàu có'];
  function surname(l, p) { var parts = String(p.name || '').trim().split(/\s+/), vn = (p.country108 || (H.isVN(l) ? 'VN' : l.country)) === 'VN' || /^(VN|CN|TW|KR|JP)$/.test(p.homeCountry || p.country108 || ''); return vn ? parts[0] : parts[parts.length - 1]; }
  function kin(l, p) {
    p = p || partner(l); if (!p) return null;
    if (p.kin920) return p.kin920;
    var id = pid(l, p), r = rng(l.id + ':kin920:' + id), lw = E.LIFE51 && E.LIFE51.inlaws ? (l.partner === p ? E.LIFE51.inlaws(l) : null) : null;
    var orphan = !!(lw && lw.orphan) || p.orphan === true, sn = surname(l, p);
    function parent(sex, gap) {
      var age = p.age + gap, nm = H.stranger(l, r, sex), parts = nm.split(/\s+/);
      if (sex === 'M' && sn) { if ((p.country108 || l.country) === 'VN' || H.isVN(l) && !p.country108) parts[0] = sn; else parts[parts.length - 1] = sn; nm = parts.join(' '); }
      var dead = orphan || age > 95 || r() < Math.max(0, (age - 55) / 80), known = r() < 0.9;
      var q = { name: nm, sex: sex, alive: !dead, age0: age, at0: l.age, job: dead ? null : age >= 62 ? 'đã nghỉ hưu' : U.pick(r, ['làm nông', 'buôn bán nhỏ', 'công nhân', 'giáo viên', 'nhân viên văn phòng', 'kỹ sư', 'nội trợ', 'kinh doanh', 'bác sĩ', 'lái xe']), known: known, close: 50 + Math.round((r() - 0.5) * 30), kind: 'sinh học' };
      return q;
    }
    var f = parent('M', 24 + Math.floor(r() * 12)), m = parent('F', 22 + Math.floor(r() * 10));
    if (lw && E.LIFE51.mother && l.partner === p) m.alive = !!E.LIFE51.mother(l);
    var adoptive = r() < 0.03, sibs = [], n = r() < 0.25 ? 0 : r() < 0.55 ? 1 : r() < 0.85 ? 2 : 3;
    for (var i = 0; i < n; i++) { var sx = r() < 0.5 ? 'M' : 'F'; sibs.push({ name: H.stranger(l, r, sx), sex: sx, age0: Math.max(1, p.age + Math.round((r() - 0.5) * 14)), at0: l.age, job: null, close: 45 + Math.round(r() * 30) }); }
    var rich = p.wealth919 === 'gia đình khá giả' ? 2 + (r() < 0.3 ? 1 : 0) : null, x = r(), means = rich != null ? rich : x < 0.15 ? 0 : x < 0.7 ? 1 : x < 0.95 ? 2 : 3;
    var guardian = orphan ? (r() < 0.6 ? 'ông bà' : r() < 0.5 ? 'cô/dì' : 'trung tâm bảo trợ') : null;
    p.kin920 = { f: f, m: m, sibs: sibs, adoptive: adoptive, guardian: guardian, home: p.residence108 || p.home63 || (p.homeCountry && W.BY[p.homeCountry] ? W.BY[p.homeCountry].name : null) || 'chưa rõ', means: means, strict: lw ? !!lw.strict : r() < 0.35, aff: 50, met: false, known: false, hist: [] };
    if (adoptive) { f.kind = m.kind = 'nuôi'; }
    return p.kin920;
  }
  function pAge(l, q) { return q.age0 + (l.age - q.at0); }
  function hosts(l, k) { return [k.f, k.m].filter(function (q) { return q.alive && q.known; }); }
  function kinText(l, p) {
    var k = kin(l, p), out = [];
    if (k.guardian && !hosts(l, k).length) out.push('Người ấy lớn lên cùng ' + k.guardian + (k.guardian === 'trung tâm bảo trợ' ? '' : ' (người giám hộ)') + '.');
    [k.f, k.m].forEach(function (q, i) { if (!q.known) { out.push((i ? 'Mẹ' : 'Bố') + ': người ấy không biết nhiều về ' + (i ? 'mẹ' : 'bố') + '.'); return; } out.push((i ? 'Mẹ ' : 'Bố ') + q.kind + ': ' + q.name + (q.alive ? ', ' + pAge(l, q) + ' tuổi' + (k.met && q.job ? ', ' + q.job : '') : ', đã mất')); });
    if (k.sibs.length) out.push('Anh chị em: ' + k.sibs.map(function (s) { return s.name + ' (' + pAge(l, s) + ')'; }).join(', ') + '.');
    out.push('Quê/nơi ở: ' + k.home + '.' + (k.met ? ' Gia cảnh: ' + MEANS[k.means] + (k.strict ? ', nề nếp khá chặt' : ', khá cởi mở') + '.' : ' Gia cảnh, nề nếp: chưa biết khi chưa gặp.'));
    if (k.met) out.push('Thiện cảm của gia đình với bạn: ' + Math.round(k.aff) + '/100.');
    return out.join('\n');
  }

  // ================= FAMILY-03: ra mắt và xây thiện cảm =================
  function respect(l) { return clamp(50 + (l.karma || 0) / 3 + (l.st ? (l.st.soc - 50) / 4 : 0)); }
  function meet(l, p, mode, prep, r, log) {
    var k = kin(l, p), s = st(l), h = hosts(l, k);
    var base = 4 + (respect(l) - 50) / 10 + ((p.close || 50) - 50) / 15 + (prep.study ? 3 : 0) + (prep.gift ? Math.min(3, prep.gift) : 0) + (mode === 'visit' ? 2 : mode === 'online' ? -1 : 0) + (r() - 0.5) * 10;
    if (k.strict && mode === 'online') base -= 2;
    k.met = true; k.metAt = l.age; k.aff = clamp(k.aff + base); k.hist.push({ age: l.age, t: 'ra mắt ' + { meal: 'bữa cơm', visit: 'thăm nhà', online: 'gọi video' }[mode] });
    s.metFor = pid(l, p);
    var mood = base >= 6 ? 'good' : base >= 0 ? 'neutral' : 'bad';
    log(!h.length ? 'Bạn gặp ' + (k.guardian || 'người thân') + ' của ' + p.name + '. Mọi người hỏi han về công việc, dự định của hai bạn.' :
      (mood === 'good' ? 'Buổi ra mắt gia đình ' + p.name + ' diễn ra ấm cúng; ' + h.map(function (q) { return q.sex === 'M' ? 'bố' : 'mẹ'; }).join(' và ') + ' người ấy quý cách bạn cư xử.' :
        mood === 'neutral' ? 'Gia đình ' + p.name + ' đón tiếp lịch sự, còn dè dặt; cần thêm thời gian để hiểu nhau.' : 'Buổi gặp có vài hiểu lầm, không khí hơi gượng. ' + p.name + ' nói sẽ giải thích thêm với gia đình.'), mood);
    if (prep.gift) H.cash(l, -l.base * 0.02 * prep.gift, 'Quà ra mắt gia đình');
    p.close = clamp((p.close || 50) + (mood === 'bad' ? -1 : 2));
  }
  function kinWhy(l) { var a = adult(l); if (a !== true) return a; return partner(l) ? true : 'Cần đang có người yêu hoặc bạn đời'; }
  X.menu('kin920', 'Gia đình bên người ấy: hồ sơ, ra mắt, thăm hỏi', kinWhy, function (l) {
    var p = partner(l); return p.name + ' · ' + (E.FIN920 ? E.FIN920.profile(l, p) : '') + '\n' + kinText(l, p) + '\nThiện cảm của gia đình khác với sự đồng ý của người ấy. Người trưởng thành đủ điều kiện có quyền tự quyết hôn nhân; gia đình phản đối có thể chờ, hòa giải hoặc cưới không cần ủng hộ.';
  }, function (l) {
    var p = partner(l), k = kin(l, p), s = st(l), out = [], did = s.kinAt === l.age && s.kinFor === pid(l, p);
    var consent = p.status !== 'dating' || (p.close || 50) >= 50 || l.age - (p.since || l.age) >= 1;
    if (!k.met) {
      [['meal', 'Ra mắt: ăn cơm cùng gia đình người ấy'], ['visit', 'Ra mắt: về thăm nhà người ấy'], ['online', 'Ra mắt: gọi video (khi ở xa)']].forEach(function (m) {
        out.push({ k: 'meet:' + m[0], l: m[1], h: 'Cần ' + p.name + ' đồng ý · có thể chuẩn bị quà nhỏ', why: did ? 'Đã gặp gia đình năm nay' : !consent ? p.name + ' muốn hai người tìm hiểu thêm trước khi ra mắt' : true, run: function (l, r) { X.next(l, 'kinPrep920', r, { mode: m[0] }); } });
      });
    } else {
      out.push({ k: 'visit', l: 'Thăm hỏi, ăn cơm cùng gia đình', why: did ? 'Đã thăm năm nay' : true, run: function (l, r, log) { s.kinAt = l.age; s.kinFor = pid(l, p); k.aff = clamp(k.aff + 2 + (respect(l) - 50) / 25); log('Bạn cùng ' + p.name + ' về thăm gia đình; mọi người hỏi han chuyện công việc, sức khỏe.', 'good'); } });
      out.push({ k: 'help', l: 'Tự nguyện giúp một việc trong nhà (sửa đồ, chăm người ốm, chuẩn bị giỗ/tiệc)', h: 'Tốn thời gian, không bắt buộc', why: did ? 'Đã thăm năm nay' : true, run: function (l, r, log) { s.kinAt = l.age; s.kinFor = pid(l, p); k.aff = clamp(k.aff + 4); stress(l, 1); log('Bạn xắn tay giúp gia đình ' + p.name + '. Họ cảm ơn, không coi đó là nghĩa vụ.', 'good'); } });
      out.push({ k: 'gift', l: 'Tặng quà dịp lễ', h: '~' + mo(l, l.base * 0.03) + ' · tác động có giới hạn mỗi năm', why: s.giftAt === l.age ? 'Đã tặng quà năm nay' : l.money < l.base * 0.03 ? 'Chưa đủ tiền' : true, run: function (l, r, log) { s.giftAt = l.age; H.cash(l, -l.base * 0.03, 'Quà cho gia đình ' + p.name); var g = k.aff < 60 ? 3 : 1; k.aff = clamp(k.aff + g); log('Gia đình nhận quà, cảm ơn bạn. ' + (g < 2 ? 'Quà không thay được những lần ghé thăm.' : ''), 'neutral'); } });
      if (k.aff < 45) out.push({ k: 'explain', l: 'Ngồi lại giải thích, giải quyết hiểu lầm', why: did ? 'Đã gặp năm nay' : true, run: function (l, r, log) { s.kinAt = l.age; s.kinFor = pid(l, p); var ok = r() < 0.45 + respect(l) / 300 + (p.close || 50) / 400; k.aff = clamp(k.aff + (ok ? 8 : 1)); log(ok ? 'Hai bên nói rõ những điều chưa hiểu; gia đình ' + p.name + ' cởi mở hơn.' : 'Cuộc trò chuyện chưa gỡ được hết khúc mắc; cả hai bên cần thêm thời gian.', ok ? 'good' : 'neutral'); } });
      if (p.status !== 'married') out.push({ k: 'bless', l: 'Xin phép gia đình chuyện cưới', h: 'Tương tác gia đình, không phải điều kiện pháp lý', why: k.blessAt === l.age ? 'Đã xin phép năm nay' : true, run: function (l, r, log) { k.blessAt = l.age; var yes = k.aff >= 55 || r() < k.aff / 120; k.bless = yes; log(yes ? 'Gia đình ' + p.name + ' vui vẻ chúc phúc cho hai bạn.' : 'Gia đình ' + p.name + ' còn băn khoăn, muốn hai bạn chờ thêm. Quyết định cưới vẫn là của hai người.', yes ? 'good' : 'neutral'); if (!yes) k.aff = clamp(k.aff + 1); } });
    }
    return out;
  }, 18, 'Tình cảm & gia đình');
  X.menu('kinPrep920', 'Chuẩn bị buổi ra mắt', kinWhy, 'Chuẩn bị theo khả năng. Quà đắt hơn không làm thiện cảm tăng mãi; quan trọng là sự tôn trọng và cách cư xử.', function (l, arg) {
    var p = partner(l), mode = arg.mode || 'meal';
    return [['plain', 'Đi tay không, ăn mặc gọn gàng, hỏi người ấy về nếp nhà', { study: true }], ['small', 'Mang quà nhỏ (hoa quả, bánh)', { gift: 1, study: true }], ['nice', 'Mang quà chu đáo hơn', { gift: 2, study: true }], ['wing', 'Không chuẩn bị gì', {}]].map(function (x) {
      var cost = l.base * 0.02 * (x[2].gift || 0);
      return { k: x[0], l: x[1], h: cost ? '~' + mo(l, cost) : '', why: l.money < cost ? 'Chưa đủ tiền' : true, run: function (l, r, log) { var s = st(l); if (s.kinAt === l.age && s.kinFor === pid(l, p)) return; s.kinAt = l.age; s.kinFor = pid(l, p); meet(l, p, mode, x[2], r, log); } };
    });
  });

  // ================= FAMILY-04: nơi ở sau cưới =================
  var HOME = { own: 'Ở riêng (thuê hoặc nhà của mình)', mine: 'Ở cùng bố mẹ bạn', theirs: 'Ở cùng gia đình người ấy', apart: 'Tạm ở hai nơi vì công việc/visa' };
  function myParents(l) { return !!(l.fam && (l.fam.mAlive || l.fam.fAlive && !l.fam.noDad)); }
  function homeWhy(l, k) {
    var p = wed(l); if (!p) return 'Cần đã kết hôn';
    if (st(l).home && st(l).home.at === l.age) return 'Đã bàn nơi ở năm nay';
    if (k === 'mine' && !myParents(l)) return 'Bố mẹ bạn không còn để ở cùng';
    if (k === 'theirs') { var q = kin(l, p); if (!hosts(l, q).length) return 'Gia đình người ấy không có ai để ở cùng'; if (!q.met) return 'Cần ra mắt gia đình người ấy trước'; }
    if (k === 'apart' && !(l.abroad || p.res919 && p.res919 !== (E.resCode ? E.resCode(l) : l.country) || l.job)) return 'Chỉ khi có lý do công việc/visa';
    return true;
  }
  function room(l) { var kids = (l.kids || []).filter(function (k) { return k.alive !== false && l.age - k.born < 18 && (!E.FAM920 || E.FAM920.home(l, k) !== 'other'); }).length; return kids + ((l.flags.pets919 && l.flags.pets919.pets || []).filter(function (x) { return x.alive !== false; }).length ? 1 : 0); }
  function setHome(l, k, r, log) {
    var p = wed(l), s = st(l), q = p && kin(l, p), crowd = room(l);
    if (k === 'mine' || k === 'theirs') {
      var host = k === 'mine' ? 70 : q.aff, ok = r() < U.clamp(0.35 + host / 150 - crowd * 0.08 + (k === 'theirs' && q.strict ? -0.05 : 0), 0.05, 0.92);
      var pOk = k === 'mine' ? r() < 0.4 + (p.close || 50) / 250 : true;
      if (!pOk) { log(p.name + ' muốn hai người có không gian riêng hơn; chưa đồng ý về ở nhà bố mẹ bạn.', 'neutral'); s.home = { kind: s.home && s.home.kind || 'own', at: l.age }; return; }
      if (!ok) { log((k === 'mine' ? 'Bố mẹ bạn' : 'Gia đình ' + p.name) + ' chưa đủ chỗ hoặc chưa sẵn sàng cho ' + (crowd ? 'cả nhà và các con, thú cưng' : 'hai người') + ' về ở cùng.', 'neutral'); s.home = { kind: s.home && s.home.kind || 'own', at: l.age }; return; }
    }
    s.home = { kind: k, at: l.age, since: l.age };
    log('Hai bạn thống nhất: ' + HOME[k].toLowerCase() + '. ' + (k === 'theirs' ? 'Sống ở nhà gia đình người ấy không đổi quốc tịch hay quyền sở hữu nhà của ai.' : k === 'mine' || k === 'theirs' ? 'Góp chi phí sinh hoạt chung, không mất tiền thuê nhà.' : k === 'apart' ? 'Chi phí hai nơi ở cao hơn; hai người hẹn gặp nhau định kỳ.' : 'Tự lo chỗ ở theo khả năng.'), 'good');
  }
  X.menu('home920', 'Nơi ở sau khi cưới', function (l) { var a = adult(l); return a !== true ? a : wed(l) ? true : 'Cần đã kết hôn'; }, function (l) {
    var s = st(l).home; return 'Hiện tại: ' + (s ? HOME[s.kind] + ' (từ ' + (s.since != null ? s.since : s.at) + ' tuổi)' : 'chưa bàn, hai người tự lo chỗ ở') + '. Mỗi bên đều có thể đề nghị đổi; ở nhà bố mẹ một bên cần chủ nhà đồng ý, đủ chỗ cho con và thú cưng. Ở chung không chuyển quyền sở hữu nhà.';
  }, function (l) { return Object.keys(HOME).map(function (k) { return { k: k, l: HOME[k], why: homeWhy(l, k), run: function (l, r, log) { if (homeWhy(l, k) !== true) return; setHome(l, k, r, log); } }; }); }, 18, 'Tình cảm & gia đình');
  var lc0 = E.livingCost918; E.livingCost918 = function (l, F) {
    if (lc0) lc0.apply(this, arguments);
    var h = st(l).home; if (!h || !F || !wed(l) || l.jailUntil != null && l.age < l.jailUntil) return;
    if (h.kind === 'mine' || h.kind === 'theirs') { if (F.rent > 0) F.rent = 0; F.food += l.base * 0.03; }
    else if (h.kind === 'apart') F.rent += l.base * 0.05;
  };
  function homeYear(l, r, log) {
    var h = st(l).home, p = wed(l); if (!h) return; if (!p) { delete st(l).home; return; }
    if ((h.kind === 'mine' && !myParents(l)) || h.kind === 'theirs' && !hosts(l, kin(l, p)).length) { log('Hoàn cảnh gia đình thay đổi; hai bạn chuyển sang ở riêng.', 'neutral'); h.kind = 'own'; h.since = l.age; return; }
    if ((h.kind === 'mine' || h.kind === 'theirs') && u(l.id + ':home:' + l.age) < 0.25) {
      var good = u(l.id + ':homeg:' + l.age) < 0.55;
      if (good) { stress(l, -2); log(U.pick(r, ['Ông bà phụ đưa đón cháu, hai bạn có thêm thời gian cho nhau.', 'Cả nhà quây quần ăn cơm tối, những ngày bận rộn nhẹ nhàng hơn.', 'Bố mẹ chia sẻ kinh nghiệm chăm con, bạn đỡ lúng túng hơn.']), 'good'); }
      else { stress(l, 3); if (h.kind === 'theirs') kin(l, p).aff = clamp(kin(l, p).aff - 2); log(U.pick(r, ['Nhiều thế hệ chung nhà, chuyện giờ giấc và riêng tư cần bàn lại.', 'Hai thế hệ khác cách dạy con; cả nhà cần ngồi lại thống nhất.', 'Bạn thấy thiếu không gian riêng; hai vợ chồng tính chuyện sắp xếp lại.']), 'neutral'); }
    }
    if (h.kind === 'apart') p.close = clamp((p.close || 50) - 1);
  }

  // ================= HOUSEHOLD: thỏa thuận nghề và quản lý gia đình =================
  var ARR = { both: 'Cả hai cùng đi làm', part: 'Người ấy làm bán thời gian', pause: 'Người ấy tạm nghỉ việc (có hạn xem lại)', home: 'Người ấy quản lý gia đình (nội trợ, không lương)' };
  function want(l, p) { if (!p.want920) { var x = u(l.id + ':want:' + pid(l, p)); p.want920 = x < 0.45 ? 'career' : x < 0.8 ? 'balance' : 'family'; } return p.want920; }
  function load(l) {
    var kids = (l.kids || []).filter(function (k) { return k.alive !== false && (!E.FAM920 || E.FAM920.home(l, k) !== 'other'); }).reduce(function (t, k) { var a = l.age - k.born; return t + (a < 0 ? 0 : a < 3 ? 3 : a < 6 ? 2 : a < 13 ? 1.5 : a < 18 ? 1 : 0); }, 0);
    var pets = (l.flags.pets919 && l.flags.pets919.pets || []).filter(function (x) { return x.alive !== false; }).length * 0.5, elder = l.flags.caring ? 2 : 0;
    return kids + pets + elder;
  }
  function arrWhy(l, k) {
    var p = wed(l) || partner(l); if (!p || p.status === 'dating') return 'Cần đang sống chung hoặc đã kết hôn';
    var a = st(l).arr; if (a && a.at === l.age) return 'Đã bàn chuyện này năm nay'; if ((a ? a.kind : 'both') === k) return 'Đang áp dụng';
    if (k !== 'both' && !p.job && !(a && a.saved)) return p.name + ' hiện không đi làm';
    return true;
  }
  function agree(l, p, k) { var w = want(l, p), base = k === 'both' ? (w === 'family' ? 0.55 : 0.9) : k === 'part' ? (w === 'career' ? 0.35 : 0.75) : (w === 'family' ? 0.8 : w === 'balance' ? 0.45 : 0.15); return u(l.id + ':arr:' + k + ':' + l.age) < U.clamp(base + load(l) / 40 + ((p.close || 50) - 50) / 300, 0.05, 0.95); }
  function setArr(l, k, log) {
    var p = wed(l) || partner(l), s = st(l), a = s.arr || { kind: 'both' };
    if (!agree(l, p, k)) { s.arr = Object.assign({}, a, { at: l.age }); log(p.name + ' chưa đồng ý: ' + { career: 'muốn tiếp tục phát triển sự nghiệp', balance: 'muốn cân bằng giữa công việc và gia đình', family: 'muốn dành nhiều thời gian cho gia đình hơn' }[want(l, p)] + '. Hai người hẹn bàn lại.', 'neutral'); return; }
    if (k !== 'both' && p.job && !a.saved) { a.saved = { job: p.job, jobId: p.jobId, inc: p.inc, at: l.age }; }
    if (k === 'both' && a.saved) { var gap = l.age - a.saved.at; p.job = a.saved.job; p.jobId = a.saved.jobId; p.inc = a.saved.inc * Math.max(0.7, 1 - gap * 0.04); log(p.name + ' quay lại làm ' + p.job + (gap > 1 ? '; sau ' + gap + ' năm nghỉ, thu nhập khởi điểm thấp hơn trước một chút' : '') + '.', 'good'); delete a.saved; }
    else if (k === 'part') { p.job = (a.saved ? a.saved.job : p.job) + ' (bán thời gian)'; p.inc = (a.saved ? a.saved.inc : p.inc) * 0.5; log(p.name + ' chuyển sang làm bán thời gian, thu nhập khoảng một nửa.', 'neutral'); }
    else if (k === 'pause') { p.job = 'tạm nghỉ việc chăm sóc gia đình'; p.inc = 0; log(p.name + ' tạm nghỉ việc; hai người hẹn xem lại sau ' + 2 + ' năm. Đây là công việc chăm sóc không lương, không phải thất nghiệp.', 'neutral'); }
    else if (k === 'home') { p.job = 'quản lý gia đình (nội trợ)'; p.inc = 0; log(p.name + ' nhận phần quản lý gia đình. Công việc chăm sóc không lương này có giá trị như mọi công việc khác.', 'neutral'); }
    s.arr = { kind: k, at: l.age, since: l.age, review: k === 'pause' ? l.age + 2 : null, saved: a.saved };
    if (p.jobId === null && E.FIN920) E.FIN920.jobTrack(l, p, null);
  }
  X.menu('household920', 'Thỏa thuận công việc và quản lý gia đình', function (l) { var a = adult(l); if (a !== true) return a; var p = partner(l); return p && p.status !== 'dating' ? true : 'Cần đang sống chung hoặc đã kết hôn'; }, function (l) {
    var p = partner(l), s = st(l), a = s.arr || { kind: 'both' }, h = s.help || 'none', b = s.pbudget || 0;
    return 'Hiện tại: ' + ARR[a.kind] + '. Mong muốn của ' + p.name + ': ' + { career: 'ưu tiên sự nghiệp', balance: 'cân bằng', family: 'ưu tiên gia đình' }[want(l, p)] + '. Áp dụng cho mọi giới; người ấy có quyền đồng ý, thương lượng, đổi ý.' +
      '\nTải chăm sóc trong nhà: ' + Math.round(load(l) * 10) / 10 + ' (con nhỏ, thú cưng, người già) · hỗ trợ: ' + { none: 'chưa thuê', nanny: 'bảo mẫu', maid: 'giúp việc theo giờ' }[h] + (b ? ' · ngân sách cá nhân của người ấy ' + mo(l, b) + '/tháng' : '') + '.' + (a.review ? '\nHẹn xem lại khi bạn ' + a.review + ' tuổi.' : '');
  }, function (l) {
    var out = Object.keys(ARR).map(function (k) { return { k: 'arr:' + k, l: 'Đề nghị: ' + ARR[k], why: arrWhy(l, k), run: function (l, r, log) { if (arrWhy(l, k) !== true) return; setArr(l, k, log); } }; });
    var s = st(l), p = partner(l);
    if(E.PLURAL840&&p.status==='married')out.push({k:'plural',l:'Hồ sơ hôn nhân và quyền của từng phối ngẫu',run:(l,r)=>X.next(l,'pluralUnion840',r)});
    if(E.PLURAL840&&E.PLURAL840.people(l).length>=2)out.push({k:'schedule',l:'Lịch chung và quan hệ giữa các phối ngẫu',run:(l,r)=>X.next(l,'pluralHome840',r)});
    [['none', 'Không thuê người giúp', 0], ['maid', 'Thuê giúp việc theo giờ', 0.08], ['nanny', 'Thuê bảo mẫu', 0.18]].forEach(function (x) { out.push({ k: 'help:' + x[0], l: x[1], h: x[2] ? '~' + mo(l, l.base * x[2]) + '/năm' : '', why: (s.help || 'none') === x[0] ? 'Đang áp dụng' : x[2] && l.money < l.base * x[2] ? 'Chưa đủ tiền' : true, run: function (l, r, log) { var ok = x[0] === 'none' || u(l.id + ':help:' + l.age) < 0.85; if (!ok) { log(p.name + ' chưa muốn có người lạ trong nhà lúc này.', 'neutral'); return; } s.help = x[0]; log(x[0] === 'none' ? 'Hai người tự lo việc nhà.' : 'Đã thuê ' + x[1].replace('Thuê ', '') + '; chi phí trả hằng năm từ quỹ chung.', 'neutral'); } }); });
    [0, 0.04, 0.1].forEach(function (f) { var v = l.base * f / 12; out.push({ k: 'pb:' + f, l: f ? 'Thống nhất ngân sách cá nhân cho ' + p.name + ' ' + mo(l, v) + '/tháng' : 'Không đặt ngân sách cá nhân riêng', why: Math.abs((s.pbudget || 0) - v) < 1e-9 ? 'Đang áp dụng' : true, run: function (l, r, log) { s.pbudget = v; log(f ? 'Hai người thống nhất khoản chi cá nhân của ' + p.name + '; khoản lớn hơn vẫn bàn chung.' : 'Không đặt khoản riêng; chi tiêu lớn bàn chung.', 'neutral'); } }); });
    return out;
  }, 18, 'Tình cảm & gia đình');

  // mục tiêu riêng của bạn đời (HOUSEHOLD-03)
  var GOALS = { cook: ['học nấu ăn / làm bánh', 0.03, 2], interior: ['học thiết kế nội thất', 0.06, 2], fit: ['tập yoga / gym / khiêu vũ', 0.03, 1], music: ['học một nhạc cụ', 0.04, 3], lang: ['học ngoại ngữ', 0.04, 2], finance: ['học quản lý tài chính', 0.02, 1], read: ['câu lạc bộ đọc sách', 0.005, 1], travel: ['một chuyến du lịch riêng', 0.08, 1], health: ['chăm sóc sức khỏe, ngoại hình', 0.04, 1], parents: ['tham gia hội phụ huynh, nhóm cộng đồng', 0.01, 1], charity: ['làm từ thiện, bảo trợ', 0.05, 2], study: ['học lại / đi làm lại', 0.05, 2], shop: ['mở một cửa hàng nhỏ', 0.6, 3] };
  function pickGoal(l, p) {
    var t = (p.traits130 || []).join(' '), keys = Object.keys(GOALS).filter(function (k) { return k !== 'shop' || l.money > l.base * 2; });
    var r = rng(l.id + ':goal:' + pid(l, p) + ':' + l.age); return U.wpick(r, keys, function (k) { return (k === 'read' && /hướng nội/.test(t) ? 2 : 1) * (k === 'parents' && (l.kids || []).length ? 2 : 1) * (k === 'finance' && /tiết kiệm/.test(t) ? 2 : 1) * (k === 'charity' && l.money > l.base * 10 ? 1.5 : 1) * (k === 'study' && st(l).arr && st(l).arr.kind !== 'both' ? 2 : 1); });
  }
  function goalYear(l, r, log) {
    var p = partner(l); if (!p || p.status === 'dating') return; var s = st(l), g = p.goal920;
    if (g && !g.end) {
      var busy = load(l) / 8 + (p.job && !/nội trợ|tạm nghỉ/.test(p.job) ? 0.3 : 0) - (s.help === 'nanny' ? 0.3 : s.help === 'maid' ? 0.15 : 0);
      g.prog = Math.min(100, g.prog + Math.round(45 / GOALS[g.k][2] * U.clamp(1 - busy * 0.5, 0.3, 1.2)));
      if (g.prog >= 100) { g.end = 'done'; g.endAt = l.age; p.close = clamp((p.close || 50) + 2); log(p.name + ' hoàn thành mục tiêu: ' + GOALS[g.k][0] + '.', 'good'); if (g.k === 'shop') X.next(l, 'shopAsk920', r, {}, { manual: false }); }
      else if (u(l.id + ':gq:' + l.age) < 0.12 + Math.max(0, busy) * 0.1) { g.end = 'dropped'; g.endAt = l.age; log(p.name + ' tạm gác ' + GOALS[g.k][0] + ' vì quá bận; có thể quay lại sau.', 'neutral'); }
      return;
    }
    if ((!g || l.age - (g.endAt || 0) >= 2) && u(l.id + ':gnew:' + l.age) < 0.3) { var k = pickGoal(l, p); p.goal920 = { k: k, at: l.age, prog: 0 }; X.next(l, 'goalAsk920', r, { k: k }, { manual: false }); }
  }
  E.SC('goalAsk920', { title: 'Dự định riêng của bạn đời', prep: function (l, r, arg) { return { at: l.age, k: arg && arg.k }; }, valid: function (l, d) { var p = partner(l); return !!(p && p.goal920 && d && p.goal920.k === d.k && d.at === l.age && !p.goal920.ok); },
    text: function (l, d) { var p = partner(l), G0 = GOALS[d.k]; return p.name + ' muốn ' + G0[0] + ' (khoảng ' + G0[2] + ' năm, chi phí ~' + mo(l, l.base * G0[1]) + '/năm). Đây là mong muốn của người ấy; bạn có thể ủng hộ, cùng tìm cách tiết kiệm hơn hoặc nói thật về tài chính.'; },
    opts: [{ k: 'yes', l: 'Ủng hộ, chi từ quỹ chung', run: function (l, r, log, d) { var p = partner(l); p.goal920.ok = 'fund'; H.cash(l, -l.base * GOALS[d.k][1], 'Hỗ trợ dự định của ' + p.name); p.close = clamp((p.close || 50) + 3); log('Bạn ủng hộ ' + p.name + ' theo đuổi ' + GOALS[d.k][0] + '.', 'good'); } },
      { k: 'cheap', l: 'Ủng hộ theo cách tiết kiệm (tự học, lớp cộng đồng)', run: function (l, r, log, d) { var p = partner(l); p.goal920.ok = 'cheap'; H.cash(l, -l.base * GOALS[d.k][1] * 0.3, 'Hỗ trợ dự định của ' + p.name); p.close = clamp((p.close || 50) + 1); log('Hai người chọn cách tiết kiệm; ' + p.name + ' vẫn bắt đầu dự định.', 'neutral'); } },
      { k: 'no', l: 'Nói thật năm nay tài chính chưa cho phép', run: function (l, r, log) { var p = partner(l); p.goal920.ok = 'no'; p.goal920.end = 'declined'; p.goal920.endAt = l.age; p.close = clamp((p.close || 50) - 2); log(p.name + ' hiểu, nhưng có chút buồn. Hai người hẹn xem lại sau.', 'neutral'); } }] });
  function shopCompany(l, p, q) {
    var all = E.BUSINESS123.companies(l), c = q.company871 && all.find(function (v) { return X.uid(l, v) === q.company871; });
    if (q.company871) return c || null;
    c = { name: 'Cửa hàng ' + p.name, sector: 'retail', value: Math.max(0, Number(q.val) || 0), share: q.kind === 'stake' ? 50 : 0, created: q.at, governance: 0,
      holders137: [{ id: X.uid(l, p), name: p.name, kind: 'bạn đời', share: q.kind === 'stake' ? 50 : 100 }], partnerShop871: X.uid(l, p) };
    E.BUSINESS133.ensure(c); all.push(c); q.company871 = X.uid(l, c); E.TREASURY165.ensure(l, c, q.at === l.age && !q.legacy871); return c;
  }
  function openShop(l, kind, log) {
    var p = partner(l); if (!p || p.shop920 || l.money < l.base * 1.6) return;
    var cap = l.base * 1.5; H.cash(l, -cap, (kind === 'stake' ? 'Góp vốn cửa hàng của ' : 'Cho vay vốn cửa hàng của ') + p.name);
    p.shop920 = { cap: cap, kind: kind, at: l.age, val: cap, owed: kind === 'loan' ? cap : 0 };
    var c = shopCompany(l, p, p.shop920);
    log(c.name + ' được ghi vào danh mục doanh nghiệp, có sổ tiền mặt, báo cáo và cổ tức hằng năm. ' + (kind === 'stake' ? 'Theo thỏa thuận, bạn góp tiền và giữ 50%; người ấy góp công vận hành và giữ 50%.' : 'Người ấy sở hữu cửa hàng; khoản vay của bạn được trả từ tiền riêng thực có, không cho bạn cổ phần.'), 'good');
  }
  E.SC('shopAsk920', { title: 'Vốn mở cửa hàng', prep: function (l) { var p = partner(l); return { at: l.age, person871: p && X.uid(l, p) }; }, valid: function (l, d) { var p = partner(l); return !!(p && !p.shop920 && d && d.at === l.age && (!d.person871 || d.person871 === X.uid(l, p))); },
    text: function (l) { var p = partner(l); return p.name + ' đã chuẩn bị kế hoạch mở một cửa hàng nhỏ và hỏi bạn về vốn (~' + mo(l, l.base * 1.5) + '). Góp vốn theo thỏa thuận 50/50, người ấy góp công vận hành; cho vay thì người ấy giữ toàn bộ cổ phần. Kinh doanh có thể lãi hoặc lỗ.'; },
    opts: [{ k: 'stake', l: 'Góp vốn, nhận 50% cổ phần', req: function (l) { return l.money >= l.base * 1.6; }, run: function (l, r, log) { openShop(l, 'stake', log); } },
      { k: 'loan', l: 'Cho vay, hẹn trả dần', req: function (l) { return l.money >= l.base * 1.6; }, run: function (l, r, log) { openShop(l, 'loan', log); } },
      { k: 'no', l: 'Chưa đủ khả năng; cùng tìm nguồn khác', run: function (l, r, log) { log('Hai người thống nhất bắt đầu nhỏ hơn hoặc chờ thêm.', 'neutral'); } }] });
  function shopYear(l, r, log) {
    var p = partner(l), q = p && p.shop920; if (!q) return;
    if (!q.closed) {
      if (!q.company871) q.legacy871 = true;
      var c = shopCompany(l, p, q);
      if (!c || c.merged) { q.closed = l.age; log('Cửa hàng không còn hoạt động trong danh mục; khoản vay cá nhân còn lại vẫn được theo dõi.', 'neutral'); }
      else q.val = c.value;
    }
    if (q.yr === l.age) return; q.yr = l.age;
    // Corporate settlement pays dividends once. A personal loan is not company debt.
    if (q.kind === 'loan' && q.owed > 0) {
      E.RELATIVE163.account(l, p); var pay = Math.min(q.owed, Math.max(0, p.savings158) * .15);
      if (pay > 0 && E.RELATIVE163.post(l, p, -pay, 'Trả vốn vay cửa hàng', 'shop871:' + q.company871 + ':' + l.age)) { q.owed -= pay; H.cash(l, pay, p.name + ' trả nợ vốn cửa hàng'); var rows = p.finance163.years, last = rows[rows.length - 1]; if (last && last.age === l.age) { last.savings = p.savings158; last.debt = Math.max(0, Number(p.debt158) || 0) + Math.max(0, Number(p.owe) || 0) + q.owed; last.debtPaid += pay; } }
    }
  }
  var convertShop871 = E.abroadConvert; E.abroadConvert = function (l, f) { var out = convertShop871.apply(this, arguments), q = l.partner && l.partner.shop920; if (q) ['cap', 'val', 'owed'].forEach(function (k) { if (Number.isFinite(q[k])) q[k] *= f; }); return out; };
  function helpYear(l) { var s = st(l), c = { maid: 0.08, nanny: 0.18 }[s.help]; if (c && s.helpPaid !== l.age) { s.helpPaid = l.age; if (l.money < l.base * c) { s.help = 'none'; return; } H.cash(l, -l.base * c, s.help === 'nanny' ? 'Lương bảo mẫu' : 'Giúp việc theo giờ'); }
    if (s.pbudget && s.pbPaid !== l.age && partner(l) && !(partner(l).inc > 0)) { s.pbPaid = l.age; H.cash(l, -s.pbudget * 12, 'Ngân sách cá nhân của ' + partner(l).name); } }
  function arrYear(l, r, log) {
    var s = st(l), a = s.arr, p = partner(l); if (!a) return; if (!p) { delete s.arr; return; }
    var cap = a.kind === 'home' ? 10 : a.kind === 'pause' ? 9 : a.kind === 'part' ? 6 : 3, help = s.help === 'nanny' ? 4 : s.help === 'maid' ? 2 : 0, over = load(l) - cap - help;
    if (over > 0) { stress(l, Math.min(4, over)); if (u(l.id + ':over:' + l.age) < 0.3) log('Việc nhà và chăm con nhiều hơn sức của cả nhà; ' + p.name + ' và bạn cần chia lại việc hoặc thuê thêm người giúp.', 'neutral'); }
    if (a.review === l.age) log('Đến hẹn xem lại việc ' + p.name + ' tạm nghỉ: có thể tiếp tục, làm bán thời gian hoặc quay lại làm (mục Thỏa thuận công việc và quản lý gia đình).', 'neutral');
  }

  // ================= PARENTING =================
  function kid(l, id) { return (l.kids || []).filter(function (k) { return k.alive !== false && X.uid(l, k) === id; })[0]; }
  function kAge(l, k) { return l.age - k.born; }
  function pr(l, k) { if (!k.par920) k.par920 = { stress: 25, motiv: 55, phone: null, n: {}, log: [] }; return k.par920; }
  function fit(l, k, style) { var t = String(k.persona141 && (k.persona141.trait || k.persona141.t) || k.upbringing || ''), x = u(l.id + ':fit:' + X.uid(l, k) + ':' + style); return /nhạy cảm|hướng nội/.test(t) && style === 'push' ? 0.2 : /năng động|hoạt bát/.test(t) && style === 'play' ? 0.9 : 0.35 + x * 0.5; }
  var ACTS = [
    ['read', 'Đọc sách, chơi cùng con', 1, 10, function (l, k, q, log) { k.close = clamp((k.close || 60) + 3); q.stress = clamp(q.stress - 3); log('Những buổi đọc sách, chơi cùng ' + k.name + ' làm hai cha con/mẹ con gần nhau hơn.', 'good'); }],
    ['feel', 'Nói chuyện về cảm xúc', 4, 30, function (l, k, q, log) { k.close = clamp((k.close || 60) + 2); q.stress = clamp(q.stress - 5); log(k.name + ' kể chuyện ở trường, bạn lắng nghe không phán xét.', 'good'); }],
    ['plan', 'Cùng lập kế hoạch học, đồng hành', 6, 18, function (l, k, q, log) { var f = fit(l, k, 'plan'); k.study = Math.min(100, (k.study || 50) + Math.round(2 + f * 3)); q.motiv = clamp(q.motiv + 3); log('Bạn cùng ' + k.name + ' chia nhỏ mục tiêu học; con tự theo dõi tiến độ.', 'good'); }],
    ['push', 'Đặt mục tiêu điểm cao, siết giờ học', 6, 18, function (l, k, q, log) { var f = fit(l, k, 'push'); k.study = Math.min(100, (k.study || 50) + Math.round(f * 5)); q.stress = clamp(q.stress + 10); q.motiv = clamp(q.motiv + (f > 0.5 ? 2 : -6)); k.close = clamp((k.close || 60) - 2); log(f > 0.5 ? k.name + ' chịu áp lực nhưng theo kịp, điểm nhích lên.' : k.name + ' mệt mỏi, mất hứng thú; điểm không tăng như kỳ vọng.', f > 0.5 ? 'neutral' : 'bad'); }],
    ['tutor', 'Thuê gia sư / lớp học thêm (nếu con muốn)', 8, 18, function (l, k, q, log, r) { H.cash(l, -l.base * 0.05, 'Gia sư cho ' + k.name); var ok = q.motiv > 40; k.study = Math.min(100, (k.study || 50) + (ok ? 4 : 1)); q.stress = clamp(q.stress + 3); log(ok ? k.name + ' tiến bộ nhờ gia sư.' : k.name + ' đi học thêm nhưng chưa thật sự hứng thú.', 'neutral'); }, 0.05],
    ['chore', 'Giao việc nhà phù hợp tuổi', 5, 18, function (l, k, q, log) { k.close = clamp((k.close || 60) + 1); log(k.name + ' tự lo phần việc của mình, tự tin hơn.', 'good'); }],
    ['sport', 'Cho con thử thể thao/nghệ thuật con thích', 5, 18, function (l, k, q, log) { H.cash(l, -l.base * 0.02, 'Lớp năng khiếu của ' + k.name); q.stress = clamp(q.stress - 4); q.motiv = clamp(q.motiv + 2); log(k.name + ' tìm thấy niềm vui ở lớp năng khiếu.', 'good'); }, 0.02],
    ['career', 'Trò chuyện hướng nghiệp', 13, 22, function (l, k, q, log) { q.motiv = clamp(q.motiv + 4); log('Bạn kể về các nghề và hỏi ' + k.name + ' muốn gì; quyết định cuối cùng là của con.', 'neutral'); }],
    ['sleep', 'Lịch ngủ, khám sức khỏe định kỳ', 1, 18, function (l, k, q, log) { q.stress = clamp(q.stress - 3); log('Lịch ngủ đều đặn giúp ' + k.name + ' khỏe và tập trung hơn.', 'good'); }],
    ['school', 'Gặp giáo viên, kết nối với trường', 6, 18, function (l, k, q, log) { k.study = Math.min(100, (k.study || 50) + 1); log('Giáo viên chia sẻ điểm mạnh và điều ' + k.name + ' cần hỗ trợ.', 'neutral'); }],
    ['anger', 'Bạn đang rất nóng giận vì con', 3, 18, null]
  ];
  function parWhy(l, k, a) { var x = kAge(l, k), q = pr(l, k); if (x < a[2] || x > a[3]) return 'Phù hợp con ' + a[2] + '–' + a[3] + ' tuổi'; if ((q.n[l.age] || 0) >= 3) return 'Đã làm 3 hoạt động cùng con năm nay'; if (a[5] && l.money < l.base * a[5]) return 'Chưa đủ tiền'; if (a[0] === 'anger' && q.angerAt === l.age) return 'Đã xử lý năm nay'; return true; }
  function kids(l) { return (l.kids || []).filter(function (k) { var a = kAge(l, k); return k.alive !== false && a >= 1 && a <= 22 && (!E.FAM920 || E.FAM920.present(l, k, { invited: true })); }); }
  X.menu('parenting920', 'Nuôi dạy con: hoạt động, học tập, điện thoại', function (l) { var a = adult(l); return a !== true ? a : kids(l).length ? true : 'Chưa có con từ 1 đến 22 tuổi đang liên lạc'; }, function (l, d) {
    var k = d && d.arg && d.arg.id && kid(l, d.arg.id); if (!k) return 'Chọn con. Mỗi con tối đa 3 hoạt động/năm; hiệu quả tùy tính cách, sức khỏe và hỗ trợ của con, không có cách nào hợp với mọi trẻ.';
    var q = pr(l, k), ph = q.phone; return k.name + ' · ' + kAge(l, k) + ' tuổi · học lực ' + Math.round(k.study || 50) + '/100 · gắn bó ' + Math.round(k.close || 60) + ' · căng thẳng ' + Math.round(q.stress) + ' · động lực ' + Math.round(q.motiv) + (ph ? '\nĐiện thoại: ' + (ph.limitTo != null && ph.limitTo >= l.age ? 'đang tạm giữ đến khi bạn ' + ph.limitTo + ' tuổi (' + ph.why + ')' : 'đang dùng' + (ph.rules ? ' theo thỏa thuận: ' + ph.rules : '')) : '');
  }, function (l, arg) {
    var k = arg && arg.id && kid(l, arg.id);
    if (!k) return kids(l).map(function (c) { return { k: X.uid(l, c), l: c.name + ' · ' + kAge(l, c) + ' tuổi', run: function (l, r) { X.next(l, 'parenting920', r, { id: X.uid(l, c) }); } }; });
    var q = pr(l, k), out = ACTS.map(function (a) { return { k: a[0], l: a[1], h: a[5] ? '~' + mo(l, l.base * a[5]) : '', why: parWhy(l, k, a), run: function (l, r, log) { if (parWhy(l, k, a) !== true) return; q.n[l.age] = (q.n[l.age] || 0) + 1; if (a[0] === 'anger') { X.next(l, 'anger920', r, { id: X.uid(l, k) }); return; } a[4](l, k, q, log, r); } }; });
    var x = kAge(l, k), ph = q.phone;
    if (x >= 8) {
      if (!ph) out.push({ k: 'phone', l: 'Mua điện thoại cho con, cùng đặt thỏa thuận', h: '~' + mo(l, l.base * 0.03) + ' + data hằng năm', why: l.money < l.base * 0.03 ? 'Chưa đủ tiền' : true, run: function (l, r, log) { q.phone = { at: l.age, rules: 'giờ dùng, nội dung phù hợp tuổi, không chia sẻ thông tin cá nhân', limitTo: null }; H.cash(l, -l.base * 0.03, 'Điện thoại cho ' + k.name); log(k.name + ' có điện thoại riêng; hai bên thống nhất giờ dùng và cách an toàn trên mạng.', 'good'); } });
      else if (ph.limitTo != null && ph.limitTo >= l.age) out.push({ k: 'restore', l: 'Trao đổi và trả lại điện thoại theo thỏa thuận mới', run: function (l, r, log) { ph.limitTo = null; ph.why = null; k.close = clamp((k.close || 60) + 2); log('Bạn và ' + k.name + ' thống nhất lại cách dùng điện thoại; con nhận lại máy.', 'good'); } });
      else { out.push({ k: 'limit', l: 'Tạm giữ điện thoại 1 năm (có lý do, có hạn)', run: function (l, r, log) { ph.limitTo = l.age + 1; ph.why = 'dùng quá giờ ảnh hưởng giấc ngủ, học tập'; q.stress = clamp(q.stress + 4); k.close = clamp((k.close || 60) - 3); log('Bạn giải thích lý do và tạm giữ điện thoại của ' + k.name + ' đến năm sau.', 'neutral'); } });
        out.push({ k: 'rules', l: 'Cùng con đặt lại thỏa thuận (giờ dùng, quyền riêng tư)', run: function (l, r, log) { ph.rules = 'giờ dùng do hai bên thống nhất; bố mẹ không đọc tin nhắn riêng nếu không có dấu hiệu nguy hiểm'; k.close = clamp((k.close || 60) + 1); log(k.name + ' đồng ý thỏa thuận mới, thấy được tôn trọng.', 'good'); } }); }
    }
    return out.concat([{ k: 'back', l: '← Chọn con khác', run: function (l, r) { X.next(l, 'parenting920', r, {}); } }]);
  }, 18, 'Tình cảm & gia đình');
  // Không có lựa chọn đánh con: nóng giận được chuyển sang cách xử lý an toàn. Đây là quyết định thiết kế (xem báo cáo MD5).
  X.menu('anger920', 'Khi bạn đang rất nóng giận', function (l) { return adult(l); }, 'Trò chơi không có hành động đánh con. Bằng chứng (WHO) cho thấy trừng phạt thân thể không cải thiện hành vi và gây hại lâu dài. Bạn có thể chọn cách dừng cơn giận:', function (l, arg) {
    var k = arg && arg.id && kid(l, arg.id); if (!k) return [];
    var q = pr(l, k);
    return [['pause', 'Dừng lại, ra khỏi phòng vài phút rồi nói chuyện sau', 2, 0], ['apology', 'Lỡ quát mắng — sau đó xin lỗi con và giải thích', 1, 3], ['course', 'Đăng ký khóa nuôi dạy con tích cực / tư vấn kiểm soát cảm xúc', 3, 0]].map(function (x) {
      return { k: x[0], l: x[1], h: x[0] === 'course' ? '~' + mo(l, l.base * 0.02) : '', run: function (l, r, log) { q.angerAt = l.age; q.stress = clamp(q.stress + x[3]); k.close = clamp((k.close || 60) + x[2] - (x[0] === 'apology' ? 2 : 0)); if (x[0] === 'course') { H.cash(l, -l.base * 0.02, 'Khóa nuôi dạy con tích cực'); st(l).course = l.age; stress(l, -3); } log(x[0] === 'pause' ? 'Bạn hít thở, rời phòng một lúc; khi bình tĩnh lại, hai bên nói chuyện về điều đã xảy ra.' : x[0] === 'apology' ? 'Bạn xin lỗi ' + k.name + ' vì đã to tiếng. Con vẫn buồn nhưng thấy bố/mẹ nhận sai.' : 'Bạn học cách nhận biết cơn giận và nói chuyện với con bình tĩnh hơn.', x[0] === 'apology' ? 'neutral' : 'good'); } };
    });
  });
  function parYear(l) {
    kids(l).forEach(function (k) { var q = k.par920; if (!q || q.yr === l.age) return; q.yr = l.age; q.stress = clamp(q.stress - 4); if (q.phone) { if (q.phone.limitTo != null && q.phone.limitTo < l.age) { q.phone.limitTo = null; q.phone.why = null; } if (q.phone.paid !== l.age) { q.phone.paid = l.age; H.cash(l, -l.base * 0.004, 'Data điện thoại của ' + k.name); } } if (q.stress > 70) k.study = Math.max(0, (k.study || 50) - 2); });
  }

  // ================= FAMILY-SUPPORT: phản bội là chuỗi hiếm, không theo chu cấp =================
  function commit(l, p) { if (p.commit920 == null) p.commit920 = 35 + Math.round(u(l.id + ':commit:' + pid(l, p)) * 60); return p.commit920; }
  function cheatP(l, p) {
    var c = commit(l, p), close = p.close == null ? 60 : p.close, h = st(l).home;
    return 0.004 * (100 - c) / 40 * (close < 40 ? 1.6 : close > 75 ? 0.6 : 1) * (h && h.kind === 'apart' ? 1.3 : 1);
  }
  function cheatYear(l, r, log) {
    var p = partner(l), s = st(l); if (!p || l.age < 18 || p.age < 18 || l.jailUntil != null && l.age < l.jailUntil) return;
    var c = s.cheat; if (c && c.who === pid(l, p) && !c.done) return;
    if (s.cheatAt != null && l.age - s.cheatAt < 6) return;
    var x = u(l.id + ':cheat:' + pid(l, p) + ':' + l.age), real = x < cheatP(l, p), doubt = !real && x < cheatP(l, p) + 0.006;
    if (!real && !doubt) return;
    s.cheatAt = l.age; s.cheat = { who: pid(l, p), real: real, at: l.age, done: false };
    X.next(l, 'doubt920', r, {}, { manual: false });
  }
  E.SC('doubt920', { title: 'Những dấu hiệu khó giải thích', prep: function (l) { return { at: l.age }; }, valid: function (l, d) { var c = st(l).cheat, p = partner(l); return !!(c && !c.done && p && c.who === pid(l, p)); },
    text: function (l) { var p = partner(l); return p.name + ' thường xuyên về muộn, giấu điện thoại. Có thể có lý do khác (công việc, chuyện gia đình, một bất ngờ). Nghi ngờ chưa phải là chứng cứ.'; },
    opts: [{ k: 'talk', l: 'Hỏi thẳng, bình tĩnh', run: function (l, r, log) { var c = st(l).cheat, p = partner(l); c.done = true; if (!c.real) { log(p.name + ' giải thích: ' + U.pick(r, ['đang lo một dự án gấp ở công ty', 'đang giúp người thân gặp chuyện', 'đang chuẩn bị một món quà cho bạn']) + '. Hai người nói rõ, nhẹ lòng hơn.', 'good'); p.close = clamp((p.close || 50) + 2); return; } X.next(l, 'truth920', r, {}, { manual: false }); } },
      { k: 'wait', l: 'Quan sát thêm, chưa nói gì', run: function (l, r, log) { var c = st(l).cheat; c.done = true; stress(l, 3); if (c.real && u(l.id + ':see:' + l.age) < 0.5) X.next(l, 'truth920', r, {}, { manual: false }); else log('Mọi chuyện dần trở lại bình thường; bạn không tìm thấy điều gì chắc chắn.', 'neutral'); } },
      { k: 'trust', l: 'Tin người ấy, bỏ qua', run: function (l, r, log) { st(l).cheat.done = true; log('Bạn chọn tin tưởng.', 'neutral'); } }] });
  E.SC('truth920', { title: 'Sự thật', prep: function (l) { return { at: l.age }; }, valid: function (l, d) { var c = st(l).cheat, p = partner(l); return !!(c && c.real && p && c.who === pid(l, p) && !c.closed); },
    text: function (l) { var p = partner(l); return p.name + ' thừa nhận có quan hệ với người khác. Bạn có quyền đặt ranh giới, cần thời gian hoặc kết thúc mối quan hệ; quyết định không cần vội.'; },
    opts: [{ k: 'counsel', l: 'Cùng đi tư vấn, đặt ranh giới rõ ràng', run: function (l, r, log) { var p = partner(l), c = st(l).cheat; c.closed = 'counsel'; H.cash(l, -l.base * 0.02, 'Tư vấn hôn nhân'); var ok = r() < 0.35 + commit(l, p) / 200; p.close = clamp((p.close || 50) + (ok ? -5 : -15)); stress(l, 6); log(ok ? 'Sau nhiều buổi tư vấn, ' + p.name + ' chấm dứt mối quan hệ kia; hai người xây lại lòng tin từng chút.' : 'Hai người đi tư vấn nhưng vết rạn vẫn còn lớn.', ok ? 'neutral' : 'bad'); } },
      { k: 'space', l: 'Tạm sống riêng một thời gian', run: function (l, r, log) { var p = partner(l); st(l).cheat.closed = 'space'; p.close = clamp((p.close || 50) - 12); stress(l, 5); log('Bạn cần khoảng lặng; hai người tạm sống riêng. Ly thân không phải ly hôn.', 'bad'); } },
      { k: 'end', l: 'Kết thúc mối quan hệ', run: function (l, r, log) { var p = partner(l); st(l).cheat.closed = 'end'; if (p.status === 'dating') { log('Bạn chia tay ' + p.name + '.', 'bad'); H.endPartner(l, log, 'split'); l.exes = (l.exes || 0) + 1; } else { log('Bạn quyết định ly hôn; thủ tục và phân chia tài sản theo quy trình chung.', 'bad'); var d = E.DEC.divorce.make(l, r); d.manual = false; l.pending.unshift(d); } } }] });

  // ================= hook năm =================
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !['vn', 'world'].includes(l.mode)) return;
    homeYear(l, r, log); helpYear(l); arrYear(l, r, log); goalYear(l, r, log); shopYear(l, r, log); parYear(l); cheatYear(l, r, log);
  });
  E.KIN920 = { kin: kin, kinText: kinText, meet: meet, setHome: setHome, HOME: HOME, want: want, load: load, setArr: setArr, ARR: ARR, GOALS: GOALS, goalYear: goalYear, shopYear: shopYear, pr: pr, ACTS: ACTS, commit: commit, cheatP: cheatP, cheatYear: cheatYear };
})(globalThis.G);
