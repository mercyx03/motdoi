/* Một Đời — MD4 (8.10.22): quan hệ khi gặp khó (D10), tình huống phân biệt đối xử theo bối cảnh (D09), đặt tên con theo văn hóa
   hai bên (D13/D16.2). Dùng người thật trong đời nhân vật (bạn đời, bố mẹ, bạn thân, anh chị em) và mức gắn bó/khoảng cách hiện có;
   không sinh mạng NPC mới. Kết quả phụ thuộc gắn bó, tính cách, khoảng cách, tài chính và may rủi có kiểm soát (băm theo năm),
   không mặc định nghèo/bệnh/ngồi tù là bị bỏ rơi hay giàu thì được yêu. Tối đa một chuỗi khó khăn mở; chờ 3 năm giữa hai lần. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, W = G.W, N = G.NAMES;
  if (!X) return;
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; return h >>> 0; }
  function u(seed) { return hash(seed) / 4294967296; }
  function mo(l, v) { return H.money(l, v); }
  function res(l) { return H.resCode(l); }
  function st(l) { var s = l.flags.bonds919; if (!s || typeof s !== 'object') s = l.flags.bonds919 = { v: 1, hist: [] }; if (!Array.isArray(s.hist)) s.hist = []; return s; }
  function jailed(l) { return l.jailUntil != null && l.age < l.jailUntil; }
  // ================= D10 =================
  function hardship(l) { if (jailed(l)) return 'jail'; if (l.ill && (l.ill.mult || 1) >= 2) return 'ill'; if (!l.job && l.indep && !l.retired && !l.school && l.age >= 22 && l.age < 60) return 'jobless'; if (l.flags.care919 && l.flags.care919.care && l.flags.care919.care.kind === 'family') return 'care'; if (l.abroad && !l.abroad.visit907 && l.age >= 18) return 'far'; return null; }
  var WHY = { jail: 'đang thi hành án', ill: 'đang điều trị bệnh nặng', jobless: 'đang thất nghiệp', care: 'đang cần người chăm sóc', far: 'sống xa nhà ở nước ngoài' };
  // Người có thể đứng bên bạn: lấy từ quan hệ thật, kèm mức gắn bó hiện tại.
  function circle(l) {
    var out = [], f = l.fam || {}, p = l.partner;
    if (p && p.alive !== false && p.name) out.push({ key: 'partner', name: p.name, bond: E.RELATIONS108 ? E.RELATIONS108.bond(l, p) : 60, ref: p, far: !!(p.res919 && p.res919 !== res(l)) });
    if (f.mAlive && f.mName && !f.noMom) out.push({ key: 'mother', name: f.mName, bond: 65, far: !!l.abroad });
    if (f.fAlive && f.fName && !f.noDad) out.push({ key: 'father', name: f.fName, bond: 60, far: !!l.abroad });
    if (l.bff && l.bff.alive !== false && l.bff.name) out.push({ key: 'bff', name: l.bff.name, bond: l.bff.close || 60, ref: l.bff, far: !!l.abroad });
    (l.sibList || []).forEach(function (t) { if (t.alive !== false && (t.n || t.name)) out.push({ key: 'sib:' + (t.n || t.name), name: t.n || t.name, bond: t.close || 55, ref: t, far: !!l.abroad }); });
    return out;
  }
  var TEMPER = ['chu đáo', 'bận rộn với gia đình riêng', 'thẳng tính', 'kín đáo nhưng tận tâm', 'dễ lo lắng'];
  function temper(l, c) { return TEMPER[Math.floor(u(l.id + ':tmp:' + c.name) * TEMPER.length)]; }
  // Phản ứng: gắn bó cao và tính cách tận tâm → giúp; bận rộn/khoảng cách/tài chính eo hẹp → giúp một phần hoặc xa dần. Có may rủi.
  function respond(l, c, kind) {
    var t = temper(l, c), x = u(l.id + ':resp919:' + c.name + ':' + l.age), score = c.bond / 100 + (/chu đáo|tận tâm/.test(t) ? 0.15 : /bận rộn/.test(t) ? -0.15 : 0) - (c.far ? 0.1 : 0) + (kind === 'jail' && /thẳng tính/.test(t) ? -0.1 : 0) - (l.fam && l.fam.q <= 1 && c.key !== 'partner' ? 0.05 : 0);
    return x < score ? 'support' : x < score + 0.25 ? 'partial' : 'distant';
  }
  function start(l, r, log) {
    var s = st(l), kind = hardship(l); if (!kind || s.open || s.last != null && l.age - s.last < 3) return;
    var cs = circle(l); if (!cs.length) return; if (u(l.id + ':hs919:' + l.age) > 0.35) return;
    var c = cs.sort(function (a, b) { return b.bond - a.bond; })[Math.floor(u(l.id + ':who919:' + l.age) * Math.min(2, cs.length))];
    var how = respond(l, c, kind); s.open = { kind: kind, who: c.key, name: c.name, how: how, at: l.age, stage: 'first', temper: temper(l, c) }; s.last = l.age;
    X.next(l, 'bonds919', r, {}, { manual: false });
  }
  X.menu('bonds919', 'Người thân bên cạnh lúc khó khăn', function (l) { var s = st(l); return s.open ? true : 'Không có chuyện cần bàn'; }, function (l) {
    var o = st(l).open; return 'Bạn ' + WHY[o.kind] + '. ' + o.name + ' (' + o.temper + ') ' + (o.stage === 'mend' ? 'và bạn đã xa cách một thời gian. Có thể thử làm hòa; người kia có quyền đồng ý hoặc cần thêm thời gian.' : o.how === 'support' ? 'chủ động hỏi han và muốn giúp: ' + (o.kind === 'jail' ? 'thăm nuôi, gửi thư' : o.kind === 'jobless' ? 'giới thiệu việc, hỗ trợ tạm một khoản' : o.kind === 'far' ? 'gọi video hằng tuần' : 'chăm sóc, đi cùng khám') + '.' : o.how === 'partial' ? 'muốn giúp nhưng cũng đang bận/khó khăn; có thể giúp một phần.' : 'ít liên lạc dần; có thể vì bận, xa hoặc chưa biết nói gì.') + ' Món quà không xóa được mọi tổn thương; mỗi người có ranh giới riêng.';
  }, function (l) {
    var s = st(l), o = s.open, out = [], c = circle(l).find(function (x) { return x.key === o.who; }), gift = l.base * (o.kind === 'jobless' ? 0.08 : 0.03);
    function bond(d) { if (!c) return; if (c.ref && c.ref.affection108 != null) c.ref.affection108 = U.clamp(c.ref.affection108 + d, 0, 100); else if (c.ref) c.ref.close = U.clamp((c.ref.close || 55) + d, 0, 100); }
    function close(t, k) { s.hist.push({ at: l.age, kind: o.kind, who: o.name, how: o.how, out: k }); s.open = null; if (t) { } }
    if (!c) { out.push({ k: 'gone', l: 'Người ấy không còn liên lạc được', run: function () { close(null, 'gone'); } }); return out; }
    if (o.stage === 'mend') {
      out.push({ k: 'mend', l: 'Chủ động gọi điện, nói lời xin lỗi/cảm ơn', run: function (l, r, log) { var ok = u(l.id + ':mend:' + o.name + ':' + l.age) < 0.35 + c.bond / 200; if (ok) { bond(10); H.fx(l, { hap: 5 }); log(o.name + ' đồng ý gặp lại; hai người nói chuyện thẳng thắn và dần gần nhau hơn.', 'good'); close(null, 'mended'); } else { log(o.name + ' cần thêm thời gian. Bạn tôn trọng điều đó.', 'neutral'); o.at = l.age; } } });
      out.push({ k: 'let', l: 'Chấp nhận khoảng cách, giữ lời chúc', run: function (l, r, log) { log('Bạn chấp nhận khoảng cách hiện tại.', 'neutral'); close(null, 'distance'); } });
      return out;
    }
    if (o.how !== 'distant') {
      out.push({ k: 'accept', l: 'Nhận sự giúp đỡ của ' + o.name, h: o.how === 'support' && o.kind === 'jobless' ? 'Có thể kèm khoản hỗ trợ ~' + mo(l, gift) + ' (tự nguyện)' : '', run: function (l, r, log) { if (o.how === 'support' && (o.kind === 'jobless' || o.kind === 'ill')) H.cash(l, gift, 'Người thân hỗ trợ'); bond(4); H.fx(l, { hap: 5 }); if (l.mind) l.mind.stress = U.clamp(l.mind.stress - 8, 0, 100); if (o.kind === 'jobless' && u(l.id + ':ref:' + l.age) < 0.3) l.flags.referral919 = l.age; log(o.name + ' ở bên bạn' + (o.how === 'partial' ? ' khi có thể' : '') + '. ' + (o.kind === 'jobless' ? 'Được giới thiệu vài chỗ phỏng vấn.' : 'Bạn thấy nhẹ lòng hơn.'), 'good'); close(null, 'helped'); } });
      out.push({ k: 'bound', l: 'Cảm ơn nhưng tự lo, nhờ khi thật cần', run: function (l, r, log) { bond(1); log('Bạn cảm ơn và đặt ranh giới; ' + o.name + ' tôn trọng.', 'neutral'); close(null, 'boundary'); } });
      if (o.how === 'support' && (o.kind === 'jobless' || o.kind === 'ill')) out.push({ k: 'repay', l: 'Nhận khoản hỗ trợ, hẹn trả lại khi ổn định', run: function (l, r, log) { H.cash(l, gift, 'Người thân cho mượn'); (l.flags.bonds919.owed || (l.flags.bonds919.owed = [])).push({ to: o.name, v: gift, at: l.age }); bond(3); log('Bạn ghi nhớ khoản mượn ' + mo(l, gift) + ' của ' + o.name + '.', 'neutral'); close(null, 'loan'); } });
    } else {
      out.push({ k: 'reach', l: 'Chủ động liên lạc, nói rõ mình cần gì', run: function (l, r, log) { var ok = u(l.id + ':reach:' + o.name + ':' + l.age) < 0.3 + c.bond / 200; if (ok) { bond(5); H.fx(l, { hap: 4 }); log('Hóa ra ' + o.name + ' chỉ ngại không biết mở lời; hai người hẹn gặp nhau.', 'good'); close(null, 'reached'); } else { bond(-3); log(o.name + ' trả lời ngắn gọn rồi im lặng. Bạn buồn nhưng còn những người khác.', 'neutral'); o.stage = 'mend'; o.at = l.age; } } });
      out.push({ k: 'other', l: 'Tìm hỗ trợ từ bạn bè khác, nhóm cộng đồng', run: function (l, r, log) { H.fx(l, { soc: 2, hap: 2 }); log('Bạn tìm được sự đồng cảm ở một nhóm hỗ trợ.', 'neutral'); o.stage = 'mend'; o.at = l.age; } });
    }
    return out;
  }, 0);
  function year(l, r, log) {
    var s = st(l), o = s.open; if (o && o.stage === 'mend' && l.age - o.at >= 2 && o.ask !== l.age) { o.ask = l.age; X.next(l, 'bonds919', r, {}, { manual: false }); }
    if (o && o.stage === 'first' && l.age - o.at >= 2) { s.hist.push({ at: l.age, kind: o.kind, who: o.name, how: o.how, out: 'faded' }); s.open = null; }
    (s.owed || []).forEach(function (d) { if (!d.paid && l.money > d.v * 6 && l.age - d.at >= 1) { d.paid = l.age; H.cash(l, -d.v, 'Trả lại khoản mượn ' + d.to); log && log('Bạn trả lại ' + d.to + ' khoản đã mượn.', 'neutral'); } });
    start(l, r, log);
  }
  // ================= D09: phân biệt đối xử theo bối cảnh =================
  // Chỉ khi nhân vật thuộc nhóm thiểu số ở nơi đang sống (sống ở nước khác quê, hoặc gia đình đa nguồn gốc); xác suất thấp, có chờ.
  function minority(l) { var anc = E.LIFE138 && E.LIFE138.state(l).ancestry || [l.country]; return res(l) !== l.country || anc.some(function (c) { return c !== res(l); }); }
  var CTX = ['ở trường/lớp học', 'ở chỗ làm', 'khi thuê nhà', 'ở nơi công cộng'];
  // Cơ quan/kênh hỗ trợ theo nước (tên chính thức; quy trình trong game là giản lược).
  var AGENCY = { US: 'EEOC (nơi làm việc) / Office for Civil Rights (trường học)', GB: 'Equality Advisory Support Service, ACAS', FR: 'Défenseur des droits', DE: 'Antidiskriminierungsstelle des Bundes', CA: 'Ủy ban Nhân quyền Canada / ủy ban tỉnh bang', AU: 'Australian Human Rights Commission', JP: 'Cục Nhân quyền, Bộ Tư pháp', KR: 'Ủy ban Nhân quyền Quốc gia Hàn Quốc', NL: 'College voor de Rechten van de Mens', SE: 'Diskrimineringsombudsmannen (DO)', VN: 'nhà trường, công đoàn hoặc chính quyền địa phương' };
  function agency(l) { return AGENCY[res(l)] || 'cơ quan nhân quyền hoặc tổ chức hỗ trợ tại địa phương'; }
  function biasYear(l, log) {
    var s = st(l), c = s.biasCase; if (!c || c.done || c.at >= l.age) return;
    var x = u(l.id + ':bcase:' + c.at), ev = c.evidence ? 0.2 : 0; c.done = l.age;
    c.out = x < 0.35 + ev ? 'violation' : x < 0.7 + ev / 2 ? 'mediated' : 'nofinding';
    log('Kết quả xử lý phản ánh phân biệt đối xử (' + c.ctx + ', qua ' + c.agency + '): ' + { violation: 'xác nhận có vi phạm; người kia bị xử lý theo quy định và phải xin lỗi', mediated: 'hai bên được hòa giải, có cam kết không tái diễn', nofinding: 'chưa đủ căn cứ kết luận; hồ sơ được lưu, bạn được hướng dẫn cách ghi nhận nếu tái diễn' }[c.out] + '.', c.out === 'nofinding' ? 'neutral' : 'good');
    s.biasHist = (s.biasHist || []).concat([{ at: c.at, ctx: c.ctx, out: c.out }]).slice(-6); s.biasCase = null;
  }
  E.SC('bias919', { title: 'Bị đối xử thiếu công bằng', valid: function (l) { var o = st(l).biasOpen; return l.alive && l.age >= 8 && minority(l) && (!o || o.at === l.age); },
    prep: function (l) { var c = CTX[Math.floor(u(l.id + ':bctx:' + l.age) * CTX.length)]; st(l).biasOpen = { at: l.age, ctx: c }; return { ctx: c }; },
    text: function (l, d) { return 'Một người ' + d.ctx + ' nói những lời coi thường nguồn gốc của bạn và đối xử khác với người khác. Đây là hành vi của cá nhân đó, không phải của cả một cộng đồng; nhiều người xung quanh không đồng tình.'; },
    opts: [{ k: 'tell', l: 'Kể với bạn bè/người thân tin cậy', run: function (l, r, log, d) { H.fx(l, { hap: 1, soc: 1 }); if (l.mind) l.mind.stress = U.clamp(l.mind.stress - 4, 0, 100); log('Bạn bè lắng nghe và đứng về phía bạn; bạn thấy không đơn độc.', 'good'); st(l).biasOpen = null; var s = st(l); s.biasHist = (s.biasHist || []).concat([{ at: l.age, ctx: d.ctx, out: 'told' }]).slice(-6); } },
      { k: 'report', l: function (l) { return 'Phản ánh chính thức (' + agency(l) + ')'; }, run: function (l, r, log, d) { var s = st(l), rep0 = (s.biasHist || []).filter(function (h) { return h.ctx === d.ctx && l.age - h.at <= 3; }).length; s.biasCase = { at: l.age, ctx: d.ctx, agency: agency(l), evidence: rep0 > 0, repeat: rep0 }; log('Bạn nộp phản ánh qua ' + agency(l) + (rep0 ? '; lần này có ghi nhận các sự việc trước nên hồ sơ rõ hơn' : '') + '. Kết quả xử lý sẽ có trong năm tới.', 'neutral'); s.biasOpen = null; } },
      { k: 'leave', l: 'Đổi lớp/chỗ làm/nơi ở để tránh môi trường này', req: function (l, d) { return (st(l).biasHist || []).some(function (h) { return h.ctx === d.ctx; }); }, run: function (l, r, log, d) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress - 5, 0, 100); log('Bạn chủ động rời môi trường ' + d.ctx + ' sau nhiều lần bị đối xử thiếu công bằng; việc này có cái giá riêng nhưng giúp bạn an toàn hơn.', 'neutral'); st(l).biasOpen = null; st(l).biasLeft = l.age; } },
      { k: 'talk', l: 'Bình tĩnh nói chuyện, giải thích', run: function (l, r, log) { var ok = u(l.id + ':btalk:' + l.age) < 0.35 + (l.st.soc - 50) / 200; log(ok ? 'Người kia im lặng một lúc rồi nói xin lỗi.' : 'Người kia không thay đổi thái độ; bạn rời đi để giữ an toàn.', 'neutral'); st(l).biasOpen = null; } },
      { k: 'ignore', l: 'Bỏ qua, tránh tiếp xúc', run: function (l, r, log) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + 3, 0, 100); log('Bạn bỏ qua, nhưng chuyện vẫn khiến bạn nghĩ ngợi vài hôm.', 'neutral'); st(l).biasOpen = null; } }] });
  E.TRIG.push({ id: 'bias919', when: function (l, a) { return a >= 8 && minority(l) && !(l.jailUntil != null && a < l.jailUntil); }, p: 0.02, cd: 6, max: 3 });
  // Cân bằng: tình huống tích cực về văn hóa đa nguồn gốc cùng tần suất.
  E.SC('heritage919', { title: 'Hai nền văn hóa trong một ngôi nhà', valid: function (l) { return l.alive && l.age >= 8 && minority(l); }, text: 'Bạn bè tò mò về món ăn, ngày lễ và ngôn ngữ của gia đình bạn.', opts: [{ k: 'share', l: 'Mời bạn bè đến ăn và kể về phong tục nhà mình', run: function (l, r, log) { H.fx(l, { soc: 2, hap: 3 }); log('Buổi chiều vui vẻ; bạn bè thích món ăn quê nhà của bạn.', 'good'); } }, { k: 'skip', l: 'Ngại chia sẻ, để dịp khác', run: function (l, r, log) { log('Bạn để dịp khác.', 'neutral'); } }] });
  E.TRIG.push({ id: 'heritage919', when: function (l, a) { return a >= 8 && minority(l); }, p: 0.02, cd: 6, max: 3 });

  // ================= D13/D16.2: đặt tên con =================
  // Chỉ trong năm sinh, cho con của người chơi; đổi tên không đổi ID (uid110), gia phả hay hồ sơ di truyền.
  function poolOf(cc, r) { var b = W.BY[cc], p = b ? String(b.pool) : 'en'; return p.indexOf(':') >= 0 ? U.wkey(r, p) : p; }
  var SURNAME = { ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es', PT: 'pt', BR: 'pt', DE: 'double', VN: 'father' };
  function kidOptions(l, k) {
    var r = function () { return u(l.id + ':kname:' + X.uid(l, k) + ':' + (r.n = (r.n || 0) + 1)); }, p = l.partner, mine = l.country, theirs = p && p.homeCountry || mine, sex = k.sex === 'F' ? 'F' : 'M';
    var a = N.worldName(r, mine === 'VN' ? 'vn' : poolOf(mine, r), sex), b = N.worldName(r, theirs === 'VN' ? 'vn' : poolOf(theirs, r), sex);
    var mySur = E.ID919 ? E.ID919.nameRec(l).family.join(' ') : l.sur, pSur = p ? String(p.name).trim().split(/\s+/)[/^(VN|CN|KR|JP|TW|HK)$/.test(theirs) ? 0 : String(p.name).trim().split(/\s+/).length - 1] : mySur;
    var fatherSur = l.sex === 'M' ? mySur : pSur, motherSur = l.sex === 'M' ? pSur : mySur, rule = SURNAME[res(l)] || 'father', famFirst = /^(VN|CN|KR|JP|TW|HK)$/.test(res(l));
    function given(n, cc) { var s = String(n.full).split(/\s+/); return /^(VN|CN|KR|JP|TW|HK)$/.test(cc) ? s.slice(1).join(' ') : s.slice(0, -1).join(' ') || s[0]; }
    var one = function (x) { return String(x).split(/[-\s]+/)[0]; }; if (rule === 'double') { fatherSur = one(fatherSur); motherSur = one(motherSur); }
    var surs = rule === 'es' ? [fatherSur + ' ' + motherSur, motherSur + ' ' + fatherSur] : rule === 'pt' ? [motherSur + ' ' + fatherSur] : rule === 'double' ? [fatherSur, motherSur, fatherSur + '-' + motherSur] : [fatherSur, motherSur];
    var gs = [[given(a, mine), 'tên theo văn hóa ' + (W.BY[mine] ? W.BY[mine].name : mine)]]; if (theirs !== mine) gs.push([given(b, theirs), 'tên theo văn hóa ' + (W.BY[theirs] ? W.BY[theirs].name : theirs)], [given(a, mine) + ' ' + given(b, theirs).split(' ')[0], 'tên hai văn hóa']);
    var out = []; gs.forEach(function (g) { surs.slice(0, 2).forEach(function (s) { var full = famFirst ? s + ' ' + g[0] : g[0] + ' ' + s; if (!E.ID919 || E.ID919.validName(full, res(l)) === true) out.push({ full: full, why: g[1] + ', họ ' + s }); }); });
    return out.slice(0, 5);
  }
  E.SC('kidName919', { title: 'Đặt tên cho con', valid: function (l, d) { var k = d && (l.kids || []).find(function (x) { return x.uid110 === d.uid; }); return l.alive && !!k && k.alive !== false && l.age - k.born <= 1 && !k.named919; },
    prep: function (l, r, a) { return { uid: a && a.uid }; },
    text: function (l, d) { var k = l.kids.find(function (x) { return x.uid110 === d.uid; }); return 'Bé ' + (k.sex === 'F' ? 'gái' : 'trai') + ' tạm gọi là ' + k.name + '. Gia đình có thể chọn tên theo văn hóa một bên, hai bên hoặc giữ tên đã đặt; cách ghép họ theo quy định nơi đăng ký khai sinh (' + (W.BY[res(l)] ? W.BY[res(l)].name : res(l)) + '). Đổi tên lúc này không ảnh hưởng hồ sơ di truyền hay giấy tờ khác.'; },
    opts: [0, 1, 2, 3, 4].map(function (i) { return { k: 'n' + i, ai: { w: 0.2 }, req: function (l, d) { var k = l.kids.find(function (x) { return x.uid110 === d.uid; }); return !!k && !!kidOptions(l, k)[i]; }, l: function (l, d) { var k = l.kids.find(function (x) { return x.uid110 === d.uid; }); var o = k && kidOptions(l, k)[i]; return o ? o.full + ' (' + o.why + ')' : ''; }, run: function (l, r, log, d) { var k = l.kids.find(function (x) { return x.uid110 === d.uid; }); if (!k || k.named919) return; var o = kidOptions(l, k)[i]; if (!o) return; var old = k.name; k.nameHist919 = [{ at: l.age, name: old }]; k.name = o.full; k.named919 = l.age; var ps = E.LIFE138 && E.LIFE138.state(l).people[k.uid110]; if (ps) ps.name = o.full; log('Bé được đặt tên ' + o.full + '.', 'good'); } }; }).concat([{ k: 'keep', l: 'Giữ tên đã đặt', ai: { w: 2 }, run: function (l, r, log, d) { var k = l.kids.find(function (x) { return x.uid110 === d.uid; }); if (k) k.named919 = l.age; } }]) });
  function namingYear(l, r) { (l.kids || []).forEach(function (k) { if (k.alive === false || k.named919 != null || l.age - k.born > 0 || k.adopted || k.adopt) return; X.uid(l, k); if (k.askName919) return; k.askName919 = l.age; var d = E.DEC.kidName919.make(l, r, { uid: k.uid110 }); d.manual = false; l.pending.push(d); }); }

  E.HOOKS.year.push(function (l, r, log) { if (!l.alive || !l.flags || !['vn', 'world'].includes(l.mode)) return; var bo = st(l).biasOpen; if (bo && bo.at < l.age) st(l).biasOpen = null; year(l, r, log); biasYear(l, log); namingYear(l, r); });
  var rs0 = E.resolve; E.resolve = function (l) { var out = rs0.apply(this, arguments); if (l && l.alive && l.flags && (l.kids || []).some(function (k) { return k.born === l.age && k.askName919 == null && !k.adopted; })) namingYear(l, function () { return 0.5; }); return out; };
  var mig = E.migrateExt; E.migrateExt = function (l) { if (mig) mig(l); if (l && l.flags && l.flags.bonds919 != null && typeof l.flags.bonds919 !== 'object') delete l.flags.bonds919; };
  E.BONDS919 = { hardship: hardship, circle: circle, respond: respond, start: start, minority: minority, agency: agency, biasYear: biasYear, AGENCY: AGENCY, kidOptions: kidOptions, state: st };
})(globalThis.G);
