/* Showbiz — Mốc 5: thực tập sinh K-pop từ 13–16 tuổi, đánh giá hằng tháng, debut thần tượng, chương trình sống còn.
   · Mở rộng hệ thống thực tập sinh sẵn có (life139: công ty, chuyển sang nước ngoài, đánh giá năm, debut).
   · Dưới 18 tuổi: cần cha mẹ / người giám hộ đồng ý; việc học phổ thông tiếp tục; không tự sang nước ngoài —
     đào tạo bán thời gian tại trung tâm đối tác trong nước, giờ tập giới hạn, trại hè ngắn ngày ở Seoul cùng người giám hộ.
     Đủ 18 tuổi (hoặc tốt nghiệp THPT) mới chuyển sang luồng thực tập sinh toàn thời gian ở Hàn Quốc của life139.
   · Không có nội dung tình cảm / tình dục với người chưa thành niên; không có người lớn ép buộc, lợi dụng như phần thưởng.
   · Ngoại hình chỉ là một yếu tố nhỏ; luyện tập cải thiện kỹ năng, người ít năng lực ban đầu vẫn có thể tiến bộ.
   · Mọi công ty, thực tập sinh khác, nhóm nhạc và chương trình là mô phỏng hư cấu / lấy cảm hứng từ format thật. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, SH = E.SHOW151, L = E.LIFE138;
  var seeded = SH.seeded, hash = SH.hash, V = SH.V;
  function yr(l) { return l.birthYear + l.age; }
  function pick(r, a) { return a[Math.floor(r() * a.length)]; }
  function ri(r, a, b) { return a + Math.floor(r() * (b - a + 1)); }
  function shuffle(r, a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function mo(l, v) { return H.money(l, v); }
  function S(l) { var s = l.flags.idol155 || (l.flags.idol155 = {}); if (!Array.isArray(s.evals)) s.evals = []; return s; }
  function agency(l) { return L.state(l).agency; }
  function lv(l, k) { return L.skill(l, k).level || 0; }
  function bump(l, k, d) { var s = L.skill(l, k); s.level = U.clamp(s.level + d, 0, 100); return s.level; }
  function korean(l) { var st = L.state(l); return (st.languages && st.languages.KR) || 0; }
  function addKorean(l, d) { var st = L.state(l); st.languages = st.languages || {}; st.languages.KR = Math.min(100, (st.languages.KR || 0) + d); }
  function looks(l) { return E.LOOKS134 && E.LOOKS134.looks ? E.LOOKS134.looks(l) : 50; }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped); }
  // Tiềm năng: kỹ năng thật (hát, nhảy, diễn, nhạc cụ, ngoại ngữ), sự tự tin, sức khỏe, khả năng học; ngoại hình chỉ chiếm phần nhỏ.
  function potential(l) {
    var sing = Math.max(lv(l, 'sing'),lv(l, 'rap') * .85), dance = lv(l, 'dance'), act = lv(l, 'acting'), inst = lv(l, 'instrument'), lang = lv(l, 'language');
    var stage = Math.max(sing, dance) * 0.45 + Math.min(sing, dance) * 0.15 + act * 0.08 + inst * 0.06 + lang * 0.06;
    return U.clamp(stage + ((l.st && l.st.soc) || 50) * 0.08 + ((l.st && l.st.hea) || 60) * 0.04 + ((l.st && l.st.kno) || 50) * 0.04 + (looks(l) - 50) * 0.08 + (l.talent === 'âm nhạc' || l.talent === 'nhảy múa' ? 8 : 0), 0, 100);
  }
  var COMPANIES = [{ name: 'Aurora Entertainment (hư cấu)', rep: 80, split: 0.2, dorm: 'ký túc xá 4 người', school: 'hỗ trợ học phí trường quốc tế' }, { name: 'Starlight Music (hư cấu)', rep: 65, split: 0.3, dorm: 'ký túc xá 3 người', school: 'giờ tập bố trí ngoài giờ học' }, { name: 'Blue Moon Ent. (hư cấu)', rep: 50, split: 0.35, dorm: 'căn hộ chung có quản lý', school: 'gia sư văn hóa hằng tuần' }];
  var CHANNELS = ['Một quản lý tài năng xem bạn biểu diễn ở hội diễn văn nghệ của trường', 'Video bạn nhảy cover được chia sẻ rộng trên mạng', 'Ban tuyển chọn của một công ty Hàn Quốc tổ chức buổi thử giọng tại thành phố', 'Một người quen trong giới giải trí giới thiệu bạn với công ty'];

  function discoveryChannels(l) { var out=[CHANNELS[2], 'Ban tuyển chọn xem phần thử giọng online của bạn'],cs=l.flags.social131&&l.flags.social131.channels||[]; if(l.school)out.push(CHANNELS[0]);if(cs.some(function(c){return c.followers>=500&&(c.videos||[]).length;}))out.push(CHANNELS[1]);if(L.state(l).artMentor157||(l.flags.elite148&&l.flags.elite148.people||[]).some(function(p){return p.kind==='artist'&&p.alive!==false&&p.trust>=50;}))out.push(CHANNELS[3]);return out; }
  // ===================================================================
  // D1 + D2: phát hiện tài năng 13–16 tuổi và quy trình nhận lời (có người giám hộ)
  // ===================================================================
  function scoutable(l) { var s = l.flags.idol155, a = agency(l); return free(l) && l.age >= 13 && l.age <= 16 && !(a && /trainee|debut|offer|junior155/.test(a.status)) && !(s && s.stage && s.stage !== 'none' && s.stage !== 'declined' && s.stage !== 'left') && !(s && s.scoutAt != null && l.age - s.scoutAt < 2); }
  function scoutChance(l) { var p = potential(l), cs=l.flags.social131&&l.flags.social131.channels||[], reach=cs.reduce(function(n,c){return Math.max(n,c.followers||0);},0), bonus=p>=30?Math.min(.06,Math.log10(1+reach)*.01):0; return U.clamp(0.02 + Math.max(0, p - 30) / 300 + bonus, 0.02, 0.35); }
  E.TRIG.push({ id: 'scout155', when: scoutable, p: scoutChance, cd: 2, max: 2 });
  X.menu('scout155', 'Lời mời từ công ty giải trí', function (l) { return free(l) && l.age >= 13 && l.age <= 17 ? true : 'Dành cho 13–17 tuổi'; },
    function (l, d) { var s = S(l), c = s.offer; if (!c) return 'Lời mời đã hết hạn.'; return c.channel + '. ' + c.name + ' (uy tín ' + c.rep + '/100) muốn mời bạn đi audition để vào chương trình thực tập sinh. Bạn đang ' + l.age + ' tuổi nên mọi quyết định cần bố mẹ / người giám hộ đồng ý; việc học phổ thông phải tiếp tục.' + (s.step ? '\n' + s.step : ''); },
    function (l) {
      var s = S(l), c = s.offer; if (!c) return [];
      var rows = [];
      if (!c.read) rows.push({ k: 'read', l: 'Tìm hiểu công ty: hợp đồng, ký túc xá, việc học', run: function (l, r) { c.read = true; s.step = c.name + ': chia doanh thu sau debut cho nghệ sĩ ' + Math.round(c.split * 100) + '% (sau khi trừ chi phí đào tạo), ' + c.dorm + ', ' + c.school + '. Thực tập sinh chưa thành niên tập tối đa ~20 giờ / tuần trong năm học. Không bảo đảm debut.'; X.next(l, 'scout155', r, {}, { manual: s.manual }); } });
      if (!c.audition) rows.push({ k: 'audition', l: 'Tham gia buổi audition', run: function (l, r, log) { audition(l, r, log); if (S(l).offer) X.next(l, 'scout155', r, {}, { manual: s.manual }); } });
      if (c.audition === 'pass' && !c.parents) rows.push({ k: 'parents', l: 'Thưa chuyện với bố mẹ / người giám hộ', run: function (l, r, log) { parents(l, r, log); X.next(l, 'scout155', r, {}, { manual: s.manual }); } });
      if (c.parents === 'yes') rows.push({ k: 'sign', l: 'Ký thỏa thuận đào tạo (cùng người giám hộ) và bắt đầu', run: function (l, r, log) { sign(l, r, log); } });
      rows.push({ k: 'no', l: c.audition === 'fail' || c.parents === 'no' ? 'Khép lại lời mời này' : 'Từ chối lời mời', run: function (l, r, log) { s.stage = 'declined'; delete s.offer; log('Bạn khép lại lời mời của ' + c.name + '. Bạn vẫn có thể luyện tập và thử lại sau.', 'neutral'); } });
      return rows;
    });
  E.DEC.scout155.auto = function (l, d, r) { var keys = d.data && d.data.keys || [], s = S(l), c = s.offer, want = !c ? 'no' : !c.read ? 'read' : !c.audition ? 'audition' : c.audition === 'pass' && !c.parents ? 'parents' : c.parents === 'yes' ? (r() < 0.7 ? 'sign' : 'no') : 'no', i = keys.indexOf(want); return i >= 0 ? String(i) : d.opts[0].k; };
  var scoutMake = E.DEC.scout155.make;
  E.DEC.scout155.make = function (l, r, arg) { var s = S(l); if (!s.offer) { var rr = seeded(l.id + ':scout' + yr(l)); s.offer = Object.assign({}, pick(rr, COMPANIES), { channel: pick(rr, discoveryChannels(l)), at: l.age }); s.scoutAt = l.age; s.stage = 'scouted'; s.step = ''; s.manual = true; } return scoutMake.call(this, l, r, arg); };
  function audition(l, r, log) {
    var s = S(l), c = s.offer, rr = seeded(l.id + ':aud155' + yr(l)), p = potential(l), score = p / 100 + (rr() - 0.5) * 0.3;
    var rounds = [['Hát / rap', lv(l, 'sing')], ['Vũ đạo', lv(l, 'dance')], ['Phỏng vấn, biểu cảm', ((l.st && l.st.soc) || 50) * 0.6 + lv(l, 'acting') * 0.4]];
    c.audition = score >= 0.38 + (c.rep - 50) / 250 ? 'pass' : 'fail';
    s.step = 'Kết quả audition: ' + rounds.map(function (x) { return x[0] + ' ' + (x[1] >= 60 ? 'nổi bật' : x[1] >= 35 ? 'khá' : 'cần luyện thêm'); }).join(', ') + '. ' + (c.audition === 'pass' ? c.name + ' muốn nhận bạn làm thực tập sinh.' : 'Lần này chưa đạt; ban tuyển chọn khuyên bạn luyện tập thêm một hai năm.');
    log('Audition tại ' + c.name + ': ' + (c.audition === 'pass' ? 'đạt' : 'chưa đạt') + '.', c.audition === 'pass' ? 'good' : 'neutral');
  }
  function parents(l, r, log) {
    var s = S(l), c = s.offer, rr = seeded(l.id + ':par155' + yr(l)), tm = E.NPC ? E.NPC.relation(l, 'parent:m') : null, tf = E.NPC ? E.NPC.relation(l, 'parent:f') : null;
    var trust = ((tm && tm.trust) || 60) * 0.5 + ((tf && tf.trust) || 60) * 0.5, study = l.studyScore != null ? l.studyScore : ((l.st && l.st.kno) || 50);
    var p = U.clamp(0.25 + (trust - 50) / 120 + (c.rep - 50) / 200 + (study >= 60 ? 0.1 : -0.05) + (l.fam && l.fam.q >= 4 ? 0.05 : 0), 0.08, 0.9);
    c.parents = rr() < p ? 'yes' : 'no';
    s.step = c.parents === 'yes' ? 'Bố mẹ đồng ý với điều kiện: vẫn đi học đầy đủ, học lực không giảm, được nghỉ khi mệt, gia đình có quyền dừng hợp đồng bất cứ lúc nào.' : 'Bố mẹ chưa đồng ý: lo ảnh hưởng việc học và sức khỏe. Bạn có thể học tốt hơn rồi bàn lại khi lớn hơn.';
    log(c.parents === 'yes' ? 'Bố mẹ đồng ý cho bạn thử sức làm thực tập sinh, kèm điều kiện về việc học.' : 'Bố mẹ chưa đồng ý cho bạn làm thực tập sinh.', 'neutral');
  }
  function sign(l, r, log) {
    var s = S(l), c = s.offer; if (!c || c.parents !== 'yes') return; if(E.CONTRACT162 && L.state(l).agency) E.CONTRACT162.record(l,'kết thúc hồ sơ cũ trước hợp đồng mới');
    s.stage = 'junior'; s.company = c; delete s.offer; s.startAge = l.age; s.months = s.months || 0; s.debt = s.debt || 0; s.rank = null;
    var rr = seeded(l.id + ':peers'); s.peers = s.peers || Array.from({ length: 11 }, function () { var sex = l.sex; return { name: H.stranger(l, rr, sex), skill: Math.round(30 + rr() * 50), grow: 2 + rr() * 4, kind: pick(rr, ['chăm chỉ', 'cạnh tranh', 'hòa đồng', 'thầm lặng', 'tài năng bẩm sinh']), bond: 0, out: false }; });
    L.state(l).agency = { name: c.name, code: 'KR', status: 'junior155', years: 0, started: l.age, minor155: true };
    s.peers.forEach(function(p){ X.uid(l,p); }); if(E.CONTRACT162){ E.CONTRACT162.ensure(l); E.CONTRACT162.record(l,'ký thỏa thuận với người giám hộ'); } log('Bạn ký thỏa thuận đào tạo với ' + c.name + ' cùng bố mẹ: tập bán thời gian ở trung tâm đối tác trong nước, trại hè tại Seoul có người giám hộ đi cùng; việc học phổ thông tiếp tục.', 'big');
    H.mem(l, 'Ngày ký hợp đồng thực tập sinh đầu tiên, có bố mẹ ngồi cạnh.', 4);
  }

  // ===================================================================
  // D3: cuộc sống thực tập sinh — đánh giá hằng tháng (3 kỳ / năm), xếp hạng nội bộ, bạn bè và cạnh tranh
  // ===================================================================
  var FOCUS = { vocal: ['Luyện thanh', 'sing', 4], dance: ['Luyện vũ đạo', 'dance', 4], rap: ['Tập rap, sáng tác lời', 'rap', 4], stage: ['Luyện biểu cảm sân khấu', 'acting', 4], korean: ['Học tiếng Hàn', null, 0], rest: ['Nghỉ ngơi, chăm sóc sức khỏe, học văn hóa', null, 0] };
  function trainee(l) { var s = l.flags.idol155, a = agency(l); return !!(s && (s.stage === 'junior' || s.stage === 'trainee') && a && (a.status === 'junior155' || a.status === 'trainee')); }
  function myScore(l) { return Math.round(lv(l, 'sing') * 0.35 + lv(l, 'dance') * 0.35 + lv(l, 'acting') * 0.15 + korean(l) * 0.1 + ((l.st && l.st.hea) || 60) * 0.05); }
  function ranking(l) { var s = S(l), me = myScore(l), all = s.peers.filter(function (p) { return !p.out; }).map(function (p) { return { name: p.name, sc: p.skill }; }).concat([{ name: 'Bạn', sc: me, me: true }]).sort(function (a, b) { return b.sc - a.sc; }); return { list: all, rank: all.findIndex(function (x) { return x.me; }) + 1, score: me }; }
  X.menu('eval155', function (l) { var s = S(l); return 'Kỳ đánh giá tháng · ' + (s.stage === 'junior' ? 'thực tập sinh bán thời gian' : 'thực tập sinh') + ' · ' + (s.company ? s.company.name : ''); },
    function (l) { return trainee(l) ? true : 'Không còn là thực tập sinh'; },
    function (l) { var s = S(l), rk = ranking(l); return 'Kỳ đánh giá thứ ' + ((s.months || 0) + 1) + '. Điểm hiện tại ' + rk.score + '/100, xếp hạng ' + rk.rank + '/' + rk.list.length + ' trong lứa thực tập sinh. Hát ' + lv(l, 'sing') + ' · nhảy ' + lv(l, 'dance') + ' · biểu cảm ' + lv(l, 'acting') + ' · tiếng Hàn ' + korean(l) + ' · sức khỏe ' + Math.round(l.st.hea) + '.' + (s.stage === 'junior' ? ' Giờ tập giới hạn vì bạn còn đi học.' : '') + (s.note ? '\n' + s.note : '') + '\nTháng này bạn tập trung vào gì?'; },
    function (l) {
      var s = S(l), rows = Object.keys(FOCUS).map(function (k) { return { k: k, l: FOCUS[k][0], run: function (l, r, log) { train(l, r, log, k); } }; });
      var peer = s.peers.filter(function (p) { return !p.out; })[hash(l.id + (s.months || 0)) % Math.max(1, s.peers.filter(function (p) { return !p.out; }).length)];
      if (peer) rows.push({ k: 'friend', l: 'Tập cùng ' + peer.name + ' (' + peer.kind + ')', run: function (l, r, log) { peer.bond += 2; bump(l, 'dance', 2); bump(l, 'sing', 1); s.note = 'Bạn và ' + peer.name + ' thân nhau hơn, giúp nhau sửa từng động tác.'; done(l, r, log); } });
      return rows;
    });
  E.DEC.eval155.auto = function (l, d, r) { var keys = d.data && d.data.keys || [], k = l.st.hea < 45 ? 'rest' : lv(l, 'sing') < lv(l, 'dance') ? 'vocal' : korean(l) < 30 && S(l).stage === 'trainee' ? 'korean' : r() < 0.3 ? 'friend' : 'dance', i = keys.indexOf(k); return i >= 0 ? String(i) : d.opts[0].k; };
  function train(l, r, log, k) {
    var s = S(l), f = FOCUS[k], junior = s.stage === 'junior', gain = junior ? 0.7 : 1;
    if (f[1]) bump(l, f[1], Math.round(f[2] * gain));
    if (k === 'korean') addKorean(l, junior ? 4 : 6);
    if (k === 'rest') H.fx(l, { hea: 6, hap: 3 }); else H.fx(l, { hea: junior ? -1 : -2 });
    if (junior && k !== 'rest' && l.school && l.st) l.st.kno = Math.max(0, l.st.kno - 0.5);
    s.note = f[0] + ' cả tháng.'; done(l, r, log);
  }
  function done(l, r, log) {
    var s = S(l), rr = seeded(l.id + ':m' + (s.months || 0)); s.months = (s.months || 0) + 1; s.mY = (s.mY || 0) + 1;
    s.peers.forEach(function (p) { if (!p.out) p.skill = Math.min(100, p.skill + p.grow * (0.6 + rr() * 0.6)); });
    var rk = ranking(l); s.rank = rk.rank; s.evals.push({ age: l.age, score: rk.score, rank: rk.rank }); if (s.evals.length > 40) s.evals.shift();
    if (s.stage === 'trainee' && rr() < 0.15) { var cut = s.peers.filter(function (p) { return !p.out; }).sort(function (a, b) { return a.skill - b.skill; })[0]; if (cut) { cut.out = true; log(cut.name + ' kết thúc hợp đồng thực tập sinh và về nước.', 'neutral'); } }
    var rival = s.peers.find(function (p) { return !p.out && p.kind === 'cạnh tranh'; }); if (rival && rr() < 0.2) s.note += ' ' + rival.name + ' vượt bạn ở bài kiểm tra vũ đạo, khiến bạn càng muốn cố gắng.';
    log('Đánh giá tháng: ' + rk.score + '/100, hạng ' + rk.rank + '/' + rk.list.length + '.', rk.rank <= 5 ? 'good' : 'neutral');
    if (s.mY < 3 && trainee(l)) X.next(l, 'eval155', r, {}, { manual: !!s.evalManual }); // ba kỳ trong năm
  }
  // ===================================================================
  // D4: debut — đội hình, vị trí, bài hát, ra mắt, quảng bá, fandom, chia doanh thu
  // ===================================================================
  var POS = { vocal: 'giọng ca chính', dance: 'nhảy chính', rap: 'rapper chính', visual: 'gương mặt đại diện', leader: 'trưởng nhóm' };
  var GROUPS = ['NOVA', 'ASTRA', 'LUMEN', 'ORBIT', 'HALO', 'PRISM', 'ECHO', 'VERSE'];
  function formGroup(l, r, log, how, later) {
    var s = S(l), rr = seeded(l.id + ':grp' + yr(l)), size = ri(rr, 4, 7), mates = s.peers.filter(function (p) { return !p.out; }).sort(function (a, b) { return b.skill - a.skill; }).slice(0, size - 1);
    s.group = { name: pick(rr, GROUPS) + (how === 'survival' ? ' (nhóm dự án)' : ''), members: mates.map(function (p) { return p.name; }), position: null, debutAge: l.age, fandom: 0, albums: [], wins: 0, project: how === 'survival', until: how === 'survival' ? l.age + 3 : null };
    s.stage = 'debut'; var a = agency(l); if (a) a.status = 'debut';
    if (!l.job || l.job.id !== 'ca_si') E.startJob(l, 'ca_si', rr, function () { }, true);
    if (later) H.sched(l, 'debut155', 1, { step: 'pos' }); else X.next(l, 'debut155', r, { step: 'pos' }, { manual: s.manual !== false });
  }
  X.menu('debut155', function (l) { var g = S(l).group; return g ? 'Ra mắt cùng ' + g.name : 'Debut'; }, function (l) { return S(l).group ? true : 'Chưa có nhóm'; },
    function (l, d) { var s = S(l), g = s.group, step = d && d.arg && d.arg.step; return step === 'pos' ? 'Công ty công bố đội hình ' + g.name + ': bạn cùng ' + g.members.join(', ') + '. Bạn đảm nhận vị trí nào? (Hát ' + lv(l, 'sing') + ', nhảy ' + lv(l, 'dance') + ', biểu cảm ' + lv(l, 'acting') + '.)' : 'Chọn concept cho bài hát ra mắt.'; },
    function (l, arg) {
      var s = S(l), g = s.group; if (!g) return [];
      if (arg.step === 'pos') return Object.keys(POS).map(function (k) { var need = { vocal: lv(l, 'sing'), dance: lv(l, 'dance'), rap: Math.max(lv(l, 'rap'),lv(l, 'sing') * 0.7 + lv(l, 'acting') * 0.3), visual: looks(l), leader: ((l.st && l.st.soc) || 50) }[k]; return { k: k, l: U.cap(POS[k]) + (need >= 60 ? ' — rất hợp' : need >= 40 ? '' : ' — còn yếu'), run: function (l, r) { g.position = k; X.next(l, 'debut155', r, { step: 'song' }, { manual: s.manual !== false }); } }; });
      return [['bright', 'Tươi sáng, sôi động'], ['dark', 'Mạnh mẽ, cá tính'], ['ballad', 'Nhẹ nhàng, giàu cảm xúc']].map(function (x) { return { k: x[0], l: x[1], run: function (l, r, log) { debut(l, r, log, x[0]); } }; });
    });
  E.DEC.debut155.auto = function (l, d, r) { var keys = d.data && d.data.keys || [], k = d.data.arg.step === 'pos' ? (lv(l, 'dance') >= lv(l, 'sing') ? 'dance' : 'vocal') : pick(r, ['bright', 'dark', 'ballad']), i = keys.indexOf(k); return i >= 0 ? String(i) : d.opts[0].k; };
  function fitPos(l, g) { return { vocal: lv(l, 'sing'), dance: lv(l, 'dance'), rap: Math.max(lv(l, 'rap'),lv(l, 'sing') * 0.7 + lv(l, 'acting') * 0.3), visual: looks(l) * 0.6 + lv(l, 'acting') * 0.4, leader: ((l.st && l.st.soc) || 50) }[g.position] || 40; }
  function debut(l, r, log, concept) {
    var s = S(l), g = s.group, rr = seeded(l.id + ':dbt' + yr(l)), q = U.clamp(fitPos(l, g) / 100 * 0.5 + (s.company ? s.company.rep / 100 : 0.5) * 0.3 + rr() * 0.3, 0, 1.1);
    g.concept = concept; g.fandom = Math.round(2000 + q * 40000); l.fame = (l.fame || 0) + g.fandom * 3;
    g.albums.push({ age: l.age, title: 'Đĩa ra mắt', q: q });
    log(g.name + ' chính thức debut với concept ' + { bright: 'tươi sáng', dark: 'mạnh mẽ', ballad: 'giàu cảm xúc' }[concept] + '; bạn là ' + POS[g.position] + '. Fandom ban đầu khoảng ' + U.fmtNum(g.fandom) + ' người.' + (q >= 0.7 ? ' Màn ra mắt gây tiếng vang!' : ''), 'big');
    H.mem(l, 'Sân khấu debut cùng ' + g.name + '.', 5);
    if (q >= 0.6) SH.S(l).invites.rmkr = { until: yr(l) + 2, why: 'nhóm mới ra mắt quảng bá' };
  }
  // Mỗi năm sau debut: một đợt quảng bá; doanh thu chia theo hợp đồng sau khi trừ nợ đào tạo
  function idolYear(l, r, log) {
    var s = S(l), g = s.group; if (!g || s.stage !== 'debut' || g.disbanded) return;
    if (g.project && l.age >= g.until) { g.disbanded = true; s.stage = 'trainee'; var a = agency(l); if (a) a.status = 'trainee'; log('Nhóm dự án ' + g.name + ' kết thúc hợp đồng; bạn trở về công ty quản lý.', 'neutral'); return; }
    if (l.age === g.debutAge || g.yearAt === l.age) return; // mỗi năm một đợt quảng bá, không xử lý hai lần
    g.yearAt = l.age;
    var rr = seeded(l.id + ':idol' + l.age), q = U.clamp(fitPos(l, g) / 100 * 0.45 + Math.min(1, g.fandom / 2e5) * 0.3 + rr() * 0.35, 0, 1.2);
    g.fandom = Math.round(g.fandom * (1 + q * 0.8) + q * 20000); l.fame = (l.fame || 0) + Math.round(g.fandom * 0.5);
    var revenue = V(l, g.fandom / 100), share = s.company ? s.company.split : 0.25, mine = revenue * share / Math.max(1, g.members.length + 1);
    if (s.debt > 0) { var pay = Math.min(s.debt, mine); s.debt -= pay; mine -= pay; }
    var key = 'idol155:' + l.age; s.paid = s.paid || {}; if (!s.paid[key] && mine > 0) { s.paid[key] = 1; H.cash(l, mine, 'Thu nhập quảng bá cùng ' + g.name); }
    var win = q >= 0.75; if (win) g.wins++;
    var extra = l.age - g.debutAge >= 3 && g.fandom >= 3e5 ? ' Nhóm lưu diễn quốc tế qua nhiều thành phố.' : g.fandom >= 1e5 ? ' Nhóm tổ chức concert và fan meeting.' : '';
    g.albums.push({ age: l.age, title: 'Đĩa thứ ' + (g.albums.length + 1), q: q });
    log(g.name + ' quảng bá đĩa mới: fandom ' + U.fmtNum(g.fandom) + ' người' + (win ? ', giành cúp chương trình âm nhạc' : '') + '. Phần của bạn sau chia doanh thu: ' + mo(l, Math.max(0, mine)) + (s.debt > 0 ? ' (còn trừ dần chi phí đào tạo ' + mo(l, s.debt) + ')' : '') + '.' + extra, win ? 'good' : 'neutral');
    if (g.fandom >= 1e5) SH.S(l).invites.rmkr = { until: yr(l) + 1, why: 'thần tượng nổi tiếng' };
  }

  // ===================================================================
  // D5: chương trình sống còn tuyển thần tượng
  // ===================================================================
  var GRADES = ['A', 'B', 'C', 'D', 'F'];
  SH.HANDLERS.survival = {
    start: function (l, r, a, sh) { var rr = seeded(a.token); a.pool = Array.from({ length: sh.field - 1 }, function () { return { name: H.stranger(l, rr, sh.sex || l.sex), skill: 25 + rr() * 65, votes: rr() }; }); a.round = 0; a.votes = 0; a.grade = null; },
    title: function (l, a, sh) { return sh.rounds[a.round].n; },
    text: function (l, a, sh) { var R = sh.rounds[a.round]; return SH.recap(a) + R.d + (a.grade ? '\nHạng đánh giá của bạn: ' + a.grade + '.' : '') + (a.rank ? ' Thứ hạng bình chọn: ' + a.rank + '/' + (a.pool.filter(function (p) { return !p.out; }).length + 1) + '.' : '') + (R.cut ? ' Sau vòng này chỉ còn ' + R.cut + ' người.' : ''); },
    rows: function (l, a, sh) { var R = sh.rounds[a.round], self = this; if (R.song) return [['song:dark', 'Chọn bài concept mạnh mẽ (vũ đạo khó)'], ['song:ballad', 'Chọn bài giàu cảm xúc (giọng hát nổi bật)'], ['song:bright', 'Chọn bài tươi sáng (cân bằng hát và nhảy)']].map(function (x) { return { k: x[0], l: x[1], run: function (l, r, log) { self.mission(l, r, log, a, sh, x[0]); } }; }); if (R.type === 'grade') return [['vocal', 'Trình diễn giọng hát'], ['dance', 'Trình diễn vũ đạo'], ['all', 'Vừa hát vừa nhảy']].map(function (x) { return { k: x[0], l: x[1], run: function (l, r, log) { self.grade(l, r, log, a, sh, x[0]); } }; }); return Object.keys(POS).filter(function (k) { return k !== 'leader' && k !== 'visual'; }).map(function (k) { return { k: k, l: 'Nhận vị trí ' + POS[k] + ' trong đội', run: function (l, r, log) { self.mission(l, r, log, a, sh, k); } }; }).concat([{ k: 'center', l: 'Tranh vị trí trung tâm (center)', run: function (l, r, log) { self.mission(l, r, log, a, sh, 'center'); } }]); },
    grade: function (l, r, log, a, sh, how) { var sc = how === 'vocal' ? lv(l, 'sing') : how === 'dance' ? lv(l, 'dance') : (lv(l, 'sing') + lv(l, 'dance')) / 2 + 5; a.grade = GRADES[sc >= 80 ? 0 : sc >= 62 ? 1 : sc >= 45 ? 2 : sc >= 30 ? 3 : 4]; a.votes += (5 - GRADES.indexOf(a.grade)) * 2; SH.note(a, 'Đánh giá đầu vào: hạng ' + a.grade + '.'); a.round++; },
    mission: function (l, r, log, a, sh, pos) {
      var rr = seeded(a.token + ':m' + a.round), sk = pos === 'song:dark' ? lv(l, 'dance') : pos === 'song:ballad' ? lv(l, 'sing') : pos === 'song:bright' ? (lv(l, 'sing') + lv(l, 'dance')) / 2 + 4 : pos === 'vocal' ? lv(l, 'sing') : pos === 'dance' ? lv(l, 'dance') : pos === 'rap' ? Math.max(lv(l, 'rap'),lv(l, 'sing') * 0.7 + lv(l, 'acting') * 0.3) : (lv(l, 'sing') + lv(l, 'dance')) / 2;
      var perf = sk + (pos === 'center' ? (rr() < sk / 120 ? 12 : -10) : 3) + (rr() - 0.5) * 20; a.votes += perf / 10 + (looks(l) - 50) / 50;
      a.pool.forEach(function (p) { if (!p.out) p.score = (p.score || 0) + p.skill / 10 + p.votes * 2 + (rr() - 0.5) * 3; });
      var all = a.pool.filter(function (p) { return !p.out; }).map(function (p) { return { p: p, v: p.score }; }).concat([{ me: true, v: a.votes }]).sort(function (x, y) { return y.v - x.v; });
      a.rank = all.findIndex(function (x) { return x.me; }) + 1; var R = sh.rounds[a.round];
      SH.note(a, R.n + ': bạn ' + (/^song/.test(pos) ? 'chọn bài ' + { 'song:dark': 'concept mạnh mẽ', 'song:ballad': 'giàu cảm xúc', 'song:bright': 'tươi sáng' }[pos] : 'đảm nhận ' + (pos === 'center' ? 'vị trí trung tâm' : POS[pos])) + ', tiết mục ' + (perf >= 70 ? 'được giám khảo khen ngợi' : perf >= 50 ? 'ổn định' : 'còn nhiều lỗi') + '; thứ hạng bình chọn ' + a.rank + '/' + all.length + '.');
      if (R.cut) { all.slice(R.cut).forEach(function (x) { if (x.p) x.p.out = true; }); if (a.rank > R.cut) return SH.finish(l, log, { result: 'dừng chân ở ' + R.n + ' (hạng ' + a.rank + ')', fame: 4e4 * (a.round + 1), good: a.round >= 2, hap: -2, rank: a.rank }); }
      a.round++;
      if (a.round >= sh.rounds.length) { var made = a.rank <= sh.debut; SH.finish(l, log, { result: made ? 'lọt vào đội hình debut ' + sh.debut + ' người (hạng ' + a.rank + ')' : 'xếp hạng ' + a.rank + ' chung kết, chưa vào đội hình debut', fame: made ? 6e5 : 1.5e5, good: true, hap: made ? 12 : 3, rank: a.rank, mem: made ? 'Đêm chung kết ' + sh.name + ', tên bạn được xướng trong đội hình debut.' : null }); if (made) { S(l).manual = a.manual; formGroup(l, r, log, 'survival'); } }
    },
    auto: function (l, a, r) { var R = SH.SHOWS[a.id].rounds[a.round]; if (R.song) return lv(l, 'dance') > lv(l, 'sing') + 5 ? 'song:dark' : lv(l, 'sing') > lv(l, 'dance') + 5 ? 'song:ballad' : 'song:bright'; if (R.type === 'grade') return lv(l, 'sing') >= lv(l, 'dance') ? 'vocal' : 'dance'; return lv(l, 'dance') >= lv(l, 'sing') ? 'dance' : 'vocal'; }
  };
  function survivalWhy(sex) { return function (l) { if (sex && l.sex !== sex) return sex === 'F' ? 'Chương trình dành cho nữ' : 'Chương trình dành cho nam'; if (l.age < 15 || l.age > 25) return 'Dành cho 15–25 tuổi'; var a = agency(l); return a && /trainee|junior155/.test(a.status) ? true : 'Cần là thực tập sinh của một công ty giải trí'; }; }
  var ROUNDS = function (cuts) { return [{ n: 'Đánh giá đầu vào', type: 'grade', d: 'Mỗi thực tập sinh biểu diễn một mình để được xếp hạng A–F.' }, { n: 'Nhiệm vụ nhóm', type: 'mission', cut: cuts[0], d: 'Chia đội cùng bài hát, phân vị trí; khán giả bình chọn sau mỗi tiết mục.' }, { n: 'Nhiệm vụ vị trí', type: 'mission', cut: cuts[1], d: 'Thi theo vị trí sở trường; vòng loại thứ hai.' }, { n: 'Nhiệm vụ concept', type: 'mission', song: true, cut: cuts[2], d: 'Chọn bài hát mới theo concept; mỗi bài đòi hỏi thế mạnh khác nhau, áp lực bình chọn tăng.' }, { n: 'Chung kết', type: 'mission', d: 'Đêm chung kết công bố đội hình debut.' }]; };
  SH.define('produce101', { name: 'Produce 101', country: 'KR', genre: 'idol', from: 2016, to: 2019, handler: 'survival', field: 101, debut: 11, rounds: ROUNDS([60, 35, 20]), desc: '101 thực tập sinh, khán giả bình chọn, đội hình debut 11 người.', roles: { trainee: { n: 'thực tập sinh dự thi', once: true, why: survivalWhy(null) } } });
  SH.define('girlsplanet', { name: 'Girls Planet 999', country: 'KR', genre: 'idol', from: 2021, to: 2021, handler: 'survival', field: 99, sex: 'F', debut: 9, rounds: ROUNDS([54, 27, 18]), desc: 'Thực tập sinh nữ từ nhiều quốc gia thi đấu, đội hình debut 9 người.', roles: { trainee: { n: 'thực tập sinh dự thi', once: true, why: survivalWhy('F') } } });
  SH.define('boysplanet', { name: 'Boys Planet', country: 'KR', genre: 'idol', from: 2023, handler: 'survival', field: 98, sex: 'M', debut: 9, rounds: ROUNDS([52, 28, 18]), desc: 'Thực tập sinh nam từ nhiều quốc gia, đội hình debut 9 người.', roles: { trainee: { n: 'thực tập sinh dự thi', once: true, why: survivalWhy('M') } } });
  SH.define('iland', { name: 'I-LAND', country: 'KR', genre: 'idol', from: 2020, handler: 'survival', field: 24, debut: 7, rounds: ROUNDS([18, 12, 9]), desc: 'Thực tập sinh sống trong "I-LAND", tự đánh giá lẫn nhau và được khán giả bình chọn, đội hình debut 7 người.', roles: { trainee: { n: 'thực tập sinh dự thi', once: true, why: survivalWhy(null) } } });
  SH.define('universeticket', { name: 'Universe Ticket', country: 'KR', genre: 'idol', from: 2023, to: 2024, handler: 'survival', field: 82, sex: 'F', debut: 8, rounds: ROUNDS([50, 28, 16]), desc: 'Thực tập sinh nữ thi đấu theo cặp, đội hình debut 8 người.', roles: { trainee: { n: 'thực tập sinh dự thi', once: true, why: survivalWhy('F') } } });
  // Thực tập sinh (kể cả bán thời gian) đủ điều kiện các chương trình Hàn Quốc
  var kr = SH.krStar; SH.krStar = function (l) { var a = agency(l); return kr(l) || !!(a && a.code === 'KR' && /trainee|junior155|debut/.test(a.status)); };

  // ===================================================================
  // Vòng năm: 3 kỳ đánh giá; 18 tuổi / tốt nghiệp → thực tập sinh toàn thời gian (luồng life139); debut khi đủ điều kiện
  // ===================================================================
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !l.flags.idol155) return; var s = S(l), a = agency(l);
    if (s.yearAt === l.age) return; s.yearAt = l.age;
    if (a && a.status === 'debut' && s.stage !== 'debut' && !s.group) { s.stage = 'debut'; s.peers = s.peers || []; var rr = seeded(l.id + ':g139'); s.group = { name: pick(rr, GROUPS), members: [], position: lv(l, 'dance') >= lv(l, 'sing') ? 'dance' : 'vocal', debutAge: l.age, fandom: 5000, albums: [], wins: 0 }; }
    if (s.stage === 'debut') return idolYear(l, r, log);
    if (!trainee(l)) return;
    if (s.stage === 'junior') { s.debt += l.base * 0.05; a.years = (a.years || 0) + 1; }
    if (s.stage === 'trainee') s.debt += l.base * 0.18;
    // 3 kỳ đánh giá trong năm tới (lên lịch, hiện ở đầu năm sau)
    s.mY = 0; H.sched(l, 'eval155', 1);
    if (s.stage === 'junior' && (l.age >= 18 || !l.school && l.age >= 17)) {
      s.stage = 'trainee'; a.status = 'offer'; a.docs = true; a.minor155 = false;
      log('Đủ tuổi / tốt nghiệp phổ thông: ' + s.company.name + ' mời bạn sang Hàn Quốc làm thực tập sinh toàn thời gian. Có thể chuẩn bị và lên đường trong mục Audition.', 'good');
      return;
    }
    var rk = ranking(l), yrs = l.age - (s.startAge || l.age);
    if (s.stage === 'trainee' && a.status === 'trainee' && yrs >= 2 && rk.rank <= 5 && seeded(l.id + ':form' + l.age)() < 0.45) { s.manual = true; formGroup(l, r, log, 'agency', true); log(s.company.name + ' thành lập nhóm mới và chọn bạn vào đội hình!', 'big'); }
  });
  // life139 chuyển trạng thái → đồng bộ
  E.HOOKS.year.push(function (l) { var s = l.flags.idol155, a = agency(l); if (s && s.stage === 'trainee' && a && a.status === 'left') { s.stage = 'left'; } });
  if (E.profile) { var profile = E.profile; E.profile = function (l) { var p = profile.apply(this, arguments), s = l.flags && l.flags.idol155; if (s && p && p.jobInfo) { if (s.group) p.jobInfo.push('Thành viên ' + s.group.name + ' (' + (POS[s.group.position] || 'thành viên') + ') · fandom ' + U.fmtNum(s.group.fandom || 0)); else if (s.stage === 'junior' || s.stage === 'trainee') p.jobInfo.push('Thực tập sinh ' + (s.company ? s.company.name : '') + ' · hạng ' + (s.rank || '?')); } return p; }; }
  var convert = E.abroadConvert; E.abroadConvert = function (l, f) { var out = convert.apply(this, arguments), s = l.flags && l.flags.idol155; if (s && s.debt) s.debt *= f; return out; };

  E.IDOL155 = { S: S, potential: potential, scoutable: scoutable, scoutChance: scoutChance, audition: audition, parents: parents, sign: sign, ranking: ranking, train: train, formGroup: formGroup, debut: debut, idolYear: idolYear, myScore: myScore, POS: POS, trainee: trainee };
})(globalThis.G);
