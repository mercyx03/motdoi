/* Showbiz — Mốc 3 (phần 2): show hẹn hò thực tế và cuộc thi âm nhạc.
   · Hẹn hò (Single's Inferno, Heart Signal, EXchange / Transit Love, I Am Solo): người tham gia có hồ sơ, tính cách, gu riêng;
     mức hấp dẫn thay đổi theo hoạt động, buổi hẹn, tin nhắn ẩn danh, cạnh tranh tình cảm; cuối chương trình cả hai phải cùng chọn nhau.
     Ghép đôi thành công → tiếp tục tìm hiểu bằng quy trình hẹn hò sẵn có (có quyền từ chối). Chỉ người độc thân, đủ tuổi.
   · Âm nhạc (Rap Việt, Giọng Hát Việt, Vietnam Idol, Ca Sĩ Mặt Nạ): mỗi chương trình có chuỗi vòng riêng — giấu mặt / quay ghế,
     chọn nón vàng, thử giọng với ba giám khảo, đối đầu, loại trực tiếp, liveshow bình chọn, mặt nạ — chấm theo kỹ năng thật (life138),
     bài hát chọn, chuẩn bị, danh tiếng và câu chuyện. Người nổi tiếng có thể làm huấn luyện viên / giám khảo.
   · Người dẫn Người Ấy Là Ai, Đảo Thiên Đường, Bạn Muốn Hẹn Hò (life41) giữ nguyên.
   Format là mô phỏng lấy cảm hứng từ chương trình thật; thí sinh, giám khảo, diễn biến đều hư cấu. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, SH = E.SHOW151, C = E.ELITE148;
  var seeded = SH.seeded, hash = SH.hash, V = SH.V;
  function yr(l) { return l.birthYear + l.age; }
  function pick(r, a) { return a[Math.floor(r() * a.length)]; }
  function shuffle(r, a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function ri(r, a, b) { return a + Math.floor(r() * (b - a + 1)); }
  function jid(l) { return l.job ? (E.resolveJob ? E.resolveJob(l.job.id) : l.job.id) : ''; }

  // ===================================================================
  // Show hẹn hò thực tế
  // ===================================================================
  var TRAITS = { warm: 'ấm áp, chu đáo', fun: 'vui tính, hoạt ngôn', drive: 'tham vọng, quyết đoán' };
  var JOBS = ['bác sĩ', 'luật sư', 'kiến trúc sư', 'đầu bếp', 'huấn luyện viên thể hình', 'nhà thiết kế', 'kỹ sư phần mềm', 'giáo viên', 'người mẫu', 'nhân viên ngân hàng'];
  function single(l) { return !(l.partner && l.partner.alive !== false && l.partner.status !== 'ended'); }
  function datingWhy(l) { if (l.age < 20 || l.age > 40) return 'Dành cho người 20–40 tuổi'; if (!single(l)) return 'Chỉ dành cho người đang độc thân'; return true; }
  function profile(rr, l, sex, i) { var t = pick(rr, Object.keys(TRAITS)); return { id: 'p' + i, name: H.stranger(l, rr, sex), sex: sex, age: Math.max(20, l.age + ri(rr, -4, 4)), job: pick(rr, JOBS), trait: t, likes: pick(rr, Object.keys(TRAITS)), attr: 0, rival: 0 }; }
  SH.HANDLERS.dating = {
    start: function (l, r, a, sh) {
      var rr = seeded(a.token), want = H.partnerSex(l, rr), own = l.sex, appeal = E.datingAppeal ? E.datingAppeal(l) : 0.4;
      a.people = Array.from({ length: sh.cast }, function (x, i) { var p = profile(rr, l, want, i); p.attr = Math.round(25 + appeal * 40 + rr() * 15); return p; });
      a.rivals = Array.from({ length: 2 }, function (x, i) { var p = profile(rr, l, own, 'r' + i); p.target = 'p' + (i % sh.cast); return p; });
      a.rivals.forEach(function (rv) { var t = a.people.find(function (p) { return p.id === rv.target; }); t.rival = Math.round(35 + rr() * 30); });
      if (sh.ex) { var ex = a.people[0]; ex.ex = true; ex.attr = Math.round(45 + rr() * 20); ex.history = 'từng yêu nhau ' + ri(rr, 1, 4) + ' năm rồi chia tay vì ' + pick(rr, ['bất đồng về tương lai', 'khoảng cách địa lý', 'áp lực công việc', 'thiếu thời gian cho nhau']); }
      a.day = 0; a.phase = sh.intro ? 'intro' : 'activity'; a.privilege = false; a.inbox = [];
    },
    title: function (l, a, sh) { return a.phase === 'final' ? 'Lựa chọn cuối cùng' : 'Ngày ' + (a.day + 1) + '/' + sh.days + ' · ' + ({ intro: 'Giới thiệu bản thân', activity: sh.activity, date: 'Hẹn hò', talk: 'Buổi hẹn', signal: 'Tin nhắn ẩn danh', event: 'Tình huống' }[a.phase] || 'Hằng ngày'); },
    who: function (a, p) { return p.name + ' (' + p.age + ', ' + p.job + ', ' + TRAITS[p.trait] + (p.ex ? ', người yêu cũ — ' + p.history : '') + ')'; },
    text: function (l, a, sh) {
      var self = this, s = SH.recap(a) + sh.desc + '\nNhững người bạn quan tâm: ' + a.people.map(function (p) { return self.who(a, p); }).join('; ') + '.';
      if (a.phase === 'intro') s += '\nBuổi đầu tiên mọi người chưa biết tuổi, nghề nghiệp của nhau. Bạn giới thiệu bản thân thế nào?';
      if (a.phase === 'activity') s += '\n' + sh.activity + ': người thắng được ' + sh.reward + '.';
      if (a.phase === 'date') s += a.privilege ? '\nBạn có đặc quyền chọn người đi hẹn.' : '\nBạn có thể mời một người đi hẹn; người ấy có thể đồng ý hoặc từ chối.';
      if (a.phase === 'signal') s += '\nMỗi tối gửi một tin nhắn ẩn danh cho người mình rung động nhất.' + (a.inbox.length ? ' Tối qua bạn nhận được ' + a.inbox.length + ' tin nhắn.' : '');
      if (a.phase === 'event') s += '\n' + a.event.text;
      if (a.phase === 'final') s += '\nĐêm cuối, mỗi người bí mật chọn một người. Chỉ khi hai người cùng chọn nhau mới thành đôi.';
      return s;
    },
    rows: function (l, a, sh) {
      var self = this, rows = [];
      if (a.phase === 'intro') return [['honest', 'Kể chân thật về công việc và gia đình'], ['joke', 'Tạo không khí vui vẻ'], ['mystery', 'Giữ bí ẩn, để mọi người tò mò']].map(function (x) { return { k: x[0], l: x[1], run: function (l, r) { self.intro(l, r, a, sh, x[0]); } }; });
      if (a.phase === 'activity') return [['all', 'Dốc sức thi đấu'], ['help', 'Giúp đỡ đồng đội, ghi điểm thiện cảm'], ['easy', 'Chơi vui, không quá cố']].map(function (x) { return { k: x[0], l: x[1], run: function (l, r) { self.activity(l, r, a, sh, x[0]); } }; });
      if (a.phase === 'date') { a.people.forEach(function (p) { rows.push({ k: 'd' + p.id, l: 'Mời ' + p.name + ' đi hẹn', run: function (l, r) { a.dateWith = p.id; a.phase = 'talk'; } }); }); rows.push({ k: 'skip', l: 'Hôm nay không hẹn ai', run: function (l, r) { self.nextPhase(l, r, a, sh); } }); return rows; }
      if (a.phase === 'talk') { var p = a.people.find(function (x) { return x.id === a.dateWith; }); return [['warm', 'Lắng nghe, quan tâm đến cảm xúc của ' + p.name], ['fun', 'Pha trò, cùng làm điều bất ngờ'], ['drive', 'Nói về mục tiêu sự nghiệp, tương lai']].map(function (x) { return { k: 't' + x[0], l: x[1], run: function (l, r) { self.talk(l, r, a, sh, p, x[0]); } }; }); }
      if (a.phase === 'signal') { a.people.forEach(function (p) { rows.push({ k: 's' + p.id, l: 'Gửi tin nhắn cho ' + p.name, run: function (l, r) { p.attr += p.likes === 'warm' ? 4 : 2; SH.note(a, 'Bạn gửi tin nhắn ẩn danh cho ' + p.name + '.'); self.nextPhase(l, r, a, sh); } }); }); return rows; }
      if (a.phase === 'event') return a.event.rows.map(function (x) { return { k: x[0], l: x[1], run: function (l, r) { self.resolve(l, r, a, sh, x[0]); } }; });
      if (a.phase === 'final') { a.people.forEach(function (p) { rows.push({ k: 'f' + p.id, l: 'Chọn ' + p.name, run: function (l, r, log) { self.final(l, r, log, a, sh, p); } }); }); rows.push({ k: 'none', l: 'Không chọn ai, ra về một mình', run: function (l, r, log) { self.final(l, r, log, a, sh, null); } }); return rows; }
      return rows;
    },
    intro: function (l, r, a, sh, how) { a.people.forEach(function (p) { p.attr += how === 'honest' ? (p.likes === 'warm' ? 6 : 3) : how === 'joke' ? (p.likes === 'fun' ? 6 : 2) : (p.likes === 'drive' ? 5 : 1); }); SH.note(a, 'Bạn giới thiệu bản thân ' + { honest: 'chân thật', joke: 'vui vẻ', mystery: 'bí ẩn' }[how] + '.'); a.phase = 'activity'; },
    activity: function (l, r, a, sh, how) {
      var rr = seeded(a.token + ':act' + a.day), power = U.clamp(((l.st && l.st.hea) || 60) / 160 + ((l.st && l.st.soc) || 50) / 300 + (how === 'all' ? 0.2 : how === 'help' ? 0.05 : -0.1), 0.05, 0.95), won = rr() < power;
      a.privilege = won;
      if (how === 'help') a.people.forEach(function (p) { if (p.likes === 'warm') p.attr += 4; });
      SH.note(a, sh.activity + ': ' + (won ? 'bạn thắng và được ' + sh.reward + '.' : 'bạn chưa thắng lần này.'));
      a.phase = 'date';
    },
    talk: function (l, r, a, sh, p, style) {
      var rr = seeded(a.token + ':d' + a.day + p.id), accept = a.privilege || rr() < U.clamp(0.35 + (p.attr - p.rival) / 80, 0.1, 0.95);
      if (!accept) { SH.note(a, p.name + ' cảm ơn nhưng đã nhận lời đi hẹn với người khác.'); p.attr -= 1; return this.nextPhase(l, r, a, sh); }
      var gain = style === p.likes ? 10 + ri(rr, 0, 4) : 3 + ri(rr, 0, 2); p.attr += gain;
      SH.note(a, 'Buổi hẹn với ' + p.name + (sh.place && a.privilege ? ' ở ' + sh.place : '') + ': ' + (style === p.likes ? 'hai người trò chuyện rất hợp, ' + p.name + ' cười nhiều hơn hẳn.' : 'không khí dễ chịu nhưng chưa thật sự "chạm".'));
      if (a.privilege && sh.place) p.attr += 3;
      this.nextPhase(l, r, a, sh);
    },
    nextPhase: function (l, r, a, sh) {
      var rr = seeded(a.token + ':n' + a.day);
      if (a.phase === 'date' || a.phase === 'talk') {
        if (sh.signal) { a.phase = 'signal'; a.inbox = a.people.filter(function (p) { return p.attr >= 50 && p.attr >= p.rival; }).map(function (p) { return p.id; }); return; }
      }
      // tình huống: đối thủ tình cảm hoặc người yêu cũ
      if (a.phase !== 'event' && rr() < 0.45) { var top = a.people.slice().sort(function (x, y) { return y.attr - x.attr; })[0], rv = a.rivals.find(function (x) { return x.target === top.id; });
        if (sh.ex && a.people[0].ex && rr() < 0.5) { a.event = { kind: 'ex', who: a.people[0].id, text: 'Người yêu cũ ' + a.people[0].name + ' rủ bạn nói chuyện riêng về chuyện ngày trước.', rows: [['reconcile', 'Thẳng thắn nói về những điều chưa nói'], ['move', 'Nói rõ mình muốn bắt đầu lại với người mới']] }; a.phase = 'event'; return; }
        if (rv) { a.event = { kind: 'rival', who: top.id, rival: rv.name, text: rv.name + ' cũng đang theo đuổi ' + top.name + ' và mời người ấy đi dạo tối nay.', rows: [['open', 'Công khai bày tỏ tình cảm với ' + top.name], ['talk', 'Nói chuyện thẳng thắn với ' + rv.name], ['back', 'Lùi lại, tôn trọng lựa chọn của ' + top.name]] }; a.phase = 'event'; return; } }
      this.endDay(l, r, a, sh);
    },
    resolve: function (l, r, a, sh, how) {
      var ev = a.event, p = a.people.find(function (x) { return x.id === ev.who; }), rr = seeded(a.token + ':ev' + a.day);
      if (ev.kind === 'ex') { if (how === 'reconcile') { p.attr += rr() < 0.5 ? 8 : -4; SH.note(a, 'Hai người nói về chuyện cũ; ' + (p.attr >= 55 ? 'khoảng cách dần thu hẹp.' : 'vẫn còn nhiều điều chưa thể vượt qua.')); } else { p.attr -= 6; a.people.slice(1).forEach(function (q) { q.attr += 2; }); SH.note(a, 'Bạn nói rõ muốn bước tiếp; ' + p.name + ' tôn trọng quyết định.'); } }
      else { if (how === 'open') { var w = rr() < U.clamp(0.5 + (p.attr - p.rival) / 60, 0.1, 0.9); p.attr += w ? 8 : -3; p.rival += w ? -5 : 6; SH.note(a, w ? p.name + ' cảm động trước sự thẳng thắn của bạn.' : p.name + ' bối rối, cần thêm thời gian.'); } else if (how === 'talk') { p.rival -= 3; SH.note(a, 'Bạn và ' + ev.rival + ' nói chuyện như hai người trưởng thành; không khí trong nhà bớt căng thẳng.'); } else { p.attr -= 2; p.rival += 4; SH.note(a, 'Bạn lùi lại để ' + p.name + ' tự lựa chọn.'); } }
      this.endDay(l, r, a, sh);
    },
    endDay: function (l, r, a, sh) { var rr = seeded(a.token + ':drift' + a.day); a.rivals.forEach(function (rv) { var t = a.people.find(function (p) { return p.id === rv.target; }); t.rival += ri(rr, 0, 4); }); a.day++; a.phase = a.day >= sh.days ? 'final' : 'activity'; },
    final: function (l, r, log, a, sh, p) {
      var chooser = function (q) { return q.attr >= 55 && q.attr >= q.rival ? 'me' : 'rival'; };
      if (!p) return SH.finish(l, log, { result: 'không chọn ai, ra về một mình', fame: sh.fame / 2, good: false, hap: -1 });
      var mutual = chooser(p) === 'me';
      if (mutual) {
        var lv = E.DEC.love.make(l, r, { where: sh.name }); lv.data.p.name = p.name; lv.data.p.sex = p.sex; lv.data.p.age = p.age; lv.data.p.job = p.job;
        lv.text = 'Sau ' + sh.name + ', bạn và ' + p.name + ' (' + p.age + ' tuổi, ' + p.job + ') tiếp tục nhắn tin mỗi ngày. Hai người có muốn chính thức tìm hiểu nhau?'; lv.manual = a.manual;
        SH.finish(l, log, { result: 'cùng ' + p.name + ' chọn nhau trong đêm cuối', fame: sh.fame, good: true, hap: 8, mem: 'Đêm cuối ' + sh.name + ', bạn và ' + p.name + ' cùng chọn nhau.' });
        l.pending.unshift(lv);
        if (C && C.S) { var c = C.meet(l, seeded(a.token + ':c'), { kind: 'pro', where: sh.name, tier: C.tier(l) }); c.name = p.name; c.sex = p.sex; c.birth = yr(l) - p.age; c.job = U.cap(p.job); c.trust = 70; c.dating153 = true; }
        return;
      }
      SH.finish(l, log, { result: 'chọn ' + p.name + ' nhưng ' + p.name + ' chọn người khác', fame: sh.fame * 0.7, good: false, hap: -4 });
    },
    auto: function (l, a, r) {
      if (a.phase === 'intro') return 'honest'; if (a.phase === 'activity') return r() < 0.5 ? 'all' : 'help';
      var best = a.people.slice().sort(function (x, y) { return (y.attr - y.rival) - (x.attr - x.rival); })[0];
      if (a.phase === 'date') return 'd' + best.id; if (a.phase === 'talk') { var p = a.people.find(function (x) { return x.id === a.dateWith; }); return 't' + (r() < 0.6 ? p.likes : pick(r, Object.keys(TRAITS))); }
      if (a.phase === 'signal') return 's' + best.id; if (a.phase === 'event') return a.event.rows[0][0];
      return best.attr >= 50 ? 'f' + best.id : 'none';
    }
  };
  function krSingle(l) { var w = datingWhy(l); if (w !== true) return w; return SH.krStar(l) ? true : 'Chương trình tuyển người đang sống / làm việc tại Hàn Quốc'; }
  SH.define('singlesinferno', { name: "Single's Inferno", country: 'KR', genre: 'dating', from: 2021, handler: 'dating', cast: 4, days: 4, activity: 'Thử thách thể lực', reward: 'đi "Thiên đường" (khu nghỉ dưỡng sang trọng) cùng người mình chọn — nếu người ấy cũng chọn mình', place: 'khu nghỉ dưỡng "Thiên đường"', fame: 9e4, desc: 'Những người độc thân sống trên hòn đảo hoang "Địa ngục"; cặp đôi chọn nhau được lên "Thiên đường".',
    roles: { player: { n: 'người tham gia', once: true, why: krSingle } } });
  SH.define('heartsignal', { name: 'Heart Signal', country: 'KR', genre: 'dating', from: 2017, handler: 'dating', cast: 4, days: 5, signal: true, intro: true, activity: 'Buổi hẹn nhóm', reward: 'quyền chọn trước người đi hẹn', fame: 6e4, desc: 'Những người độc thân sống chung một ngôi nhà, mỗi tối gửi tin nhắn ẩn danh cho người mình rung động.',
    roles: { player: { n: 'người tham gia', once: true, why: krSingle } } });
  SH.define('exchange', { name: 'EXchange (Transit Love)', country: 'KR', genre: 'dating', from: 2021, handler: 'dating', cast: 4, days: 5, ex: true, signal: true, activity: 'Trò chơi cặp đôi', reward: 'quyền chọn trước người đi hẹn', fame: 7e4, desc: 'Các cặp từng yêu nhau cùng sống chung với những người mới; người yêu cũ của bạn cũng ở trong nhà.',
    roles: { player: { n: 'người tham gia', once: true, why: function (l) { var w = krSingle(l); return w !== true ? w : (l.exes || 0) > 0 ? true : 'Cần từng có một mối tình đã chia tay'; } } } });
  SH.define('iamsolo', { name: 'I Am Solo', country: 'KR', genre: 'dating', from: 2021, handler: 'dating', cast: 4, days: 4, intro: true, activity: 'Buổi giới thiệu bản thân và chọn bàn ăn', reward: 'được ưu tiên chọn người hẹn riêng', fame: 4e4, desc: 'Những người độc thân dùng biệt danh, giới thiệu bản thân, chọn người hẹn riêng và đưa ra lựa chọn cuối.',
    roles: { player: { n: 'người tham gia', once: true, why: krSingle } } });

  // ===================================================================
  // Cuộc thi âm nhạc
  // ===================================================================
  function L138(l, k) { return E.LIFE138 && E.LIFE138.skill ? E.LIFE138.skill(l, k).level || 0 : 0; }
  function voice(l, rap) { var base = Math.max(rap ? L138(l, 'sing') * 0.4 : L138(l, 'sing'), (l.skill || 0) * (/^(ca_si|rapper|nhac_si)$/.test(jid(l)) || l.talent === 'âm nhạc' ? 1 : 0.5)); if (rap) base = Math.max(base, /rapper/.test(jid(l)) ? l.skill || 0 : 0); return U.clamp(base / 100, 0.05, 1); }
  var SONGS = { safe: 'Bài sở trường, phong cách quen thuộc', bold: 'Thử thách bản thân với phong cách mới', crowd: 'Bản hit khán giả yêu thích' };
  function perform(l, a, choice, rr) { var v = voice(l, a.rap), q = v * 0.65 + (choice === 'safe' ? 0.1 : choice === 'crowd' ? 0.07 : 0) + (choice === 'bold' ? (rr() < 0.4 + v * 0.3 ? 0.22 : -0.08) : 0) + (a.prep || 0) + (rr() - 0.5) * 0.14; a.prep = 0; return U.clamp(q, 0, 1.2); }
  function npcQ(n, rr) { return U.clamp(n.skill * 0.75 + 0.08 + (rr() - 0.5) * 0.2, 0, 1.2); }
  var COACHES = ['Huấn luyện viên A', 'Huấn luyện viên B', 'Huấn luyện viên C', 'Huấn luyện viên D'];
  SH.HANDLERS.music = {
    start: function (l, r, a, sh) { var rr = seeded(a.token); a.si = 0; a.rap = !!sh.rap; a.pool = Array.from({ length: 10 }, function (x, i) { var s = rr() < 0.5 ? 'M' : 'F'; return { name: H.stranger(l, rr, s), skill: 0.45 + rr() * 0.45, story: rr() }; }); a.coach = null; a.story = 0; a.votes = 0; a.mask = sh.mask ? pick(rr, ['Cáo Tuyết', 'Voi Bản Đôn', 'Cú Mèo', 'Cá Chép', 'Kỳ Lân', 'Bướm Đêm']) : null; a.clue = 0; a.alive = true; a.skipNext = false; },
    stage: function (a, sh) { return sh.stages[a.si]; },
    title: function (l, a, sh) { return this.stage(a, sh).n; },
    text: function (l, a, sh) { var st = this.stage(a, sh); return SH.recap(a) + st.d + (a.coach ? '\nĐội của: ' + a.coach + '.' : '') + (a.mask ? '\nBạn hóa thân thành "' + a.mask + '"; ban cố vấn đã đoán trúng ' + a.clue + '/3 gợi ý về bạn.' : '') + (st.type === 'chooseCoach' ? '\nCác HLV đã chọn bạn: ' + a.turned.join(', ') + '.' : '\nChọn cách trình diễn.'); },
    rows: function (l, a, sh) {
      var self = this, st = this.stage(a, sh);
      if (st.type === 'chooseCoach') return a.turned.map(function (c, i) { return { k: 'c' + i, l: 'Về đội ' + c, run: function (l, r, log) { a.coach = c; SH.note(a, 'Bạn chọn về đội ' + c + '.'); self.advance(l, r, log, a, sh); } }; });
      var rows = Object.keys(SONGS).map(function (k) { return { k: k, l: SONGS[k], run: function (l, r, log) { self.play(l, r, log, a, sh, k); } }; });
      rows.push({ k: 'prep', l: 'Tập thêm với vocal coach trước đêm diễn', run: function (l, r) { a.step--; a.prep = 0.06; if (E.LIFE138) { var s = E.LIFE138.skill(l, 'sing'); s.level = Math.min(100, s.level + 1); } SH.note(a, 'Bạn tập thêm cả tuần, giọng hát chắc hơn.'); } });
      if (st.type === 'live' || st.type === 'final') rows.push({ k: 'story', l: 'Chia sẻ câu chuyện cá nhân trên sân khấu', run: function (l, r) { a.step--; a.story = Math.min(0.12, a.story + 0.06); SH.note(a, 'Câu chuyện của bạn chạm đến nhiều khán giả.'); } });
      if (st.type === 'mask') rows.push({ k: 'hide', l: 'Đổi giọng, giấu kỹ thân phận', run: function (l, r, log) { a.hideVoice = true; self.play(l, r, log, a, sh, 'safe'); } });
      return rows;
    },
    play: function (l, r, log, a, sh, choice) {
      var st = this.stage(a, sh), rr = seeded(a.token + ':s' + a.si), q = perform(l, a, choice, rr), fame = Math.min(0.15, Math.log10(1 + (l.fame || 0)) / 50), ok, msg;
      if (st.type === 'blind' || st.type === 'select') {
        a.turned = COACHES.filter(function (c, i) { return q + (rr() - 0.5) * 0.1 > 0.52 + i * 0.04; });
        if (!a.turned.length) { ok = false; msg = 'Không huấn luyện viên nào ' + (st.type === 'blind' ? 'quay ghế' : 'chọn') + ' bạn.'; }
        else { ok = true; msg = a.turned.length + ' huấn luyện viên ' + (st.type === 'blind' ? 'quay ghế' : 'chọn') + ' bạn.' + (st.type === 'select' && a.turned.length === 4 ? ' Cả bốn HLV đều chọn: bạn nhận NÓN VÀNG, đi thẳng qua vòng đối đầu!' : ''); if (st.type === 'select' && a.turned.length === 4) a.skipNext = true; }
      } else if (st.type === 'audition') { var yes = [0.5, 0.56, 0.62].filter(function (t) { return q > t + (rr() - 0.5) * 0.12; }).length; ok = yes >= 2; msg = yes + '/3 giám khảo đồng ý' + (yes === 3 ? ' — nhận tấm vé vàng!' : ok ? ', bạn đi tiếp.' : ', bạn dừng bước.'); }
      else if (st.type === 'battle' || st.type === 'knockout') { var opps = shuffle(rr, a.pool).slice(0, st.type === 'battle' ? 1 : 2), best = Math.max.apply(null, opps.map(function (o) { return npcQ(o, rr); })); ok = q >= best; if (!ok && st.type === 'battle' && rr() < 0.25) { ok = true; msg = 'Bạn thua ' + opps[0].name + ' nhưng một huấn luyện viên khác bấm nút giành bạn về đội!'; } else msg = (ok ? 'Bạn vượt qua ' : 'Bạn dừng bước trước ') + opps.map(function (o) { return o.name; }).join(', ') + '.'; }
      else if (st.type === 'mask') { var guessed = !a.hideVoice && rr() < 0.3 + fame * 2; if (guessed) a.clue++; a.hideVoice = false; var rivals = shuffle(rr, a.pool).slice(0, 3).map(function (o) { return npcQ(o, rr); }); ok = q + 0.05 > Math.min.apply(null, rivals) && a.clue < 3; msg = (guessed ? 'Ban cố vấn đoán thêm một gợi ý về thân phận bạn. ' : '') + (ok ? 'Khán giả bình chọn cho bạn đi tiếp.' : 'Bình chọn thấp nhất — bạn phải tháo mặt nạ!'); }
      else { var total = q * 0.6 + fame + a.story + (rr() - 0.5) * 0.1, field = shuffle(rr, a.pool).slice(0, st.field || 4).map(function (o) { return o.skill * 0.65 + o.story * 0.12 + (rr() - 0.5) * 0.15; }).sort(function (x, y) { return y - x; }); var place = field.filter(function (v) { return v > total; }).length + 1; a.lastPlace = place; ok = st.type === 'final' ? place === 1 : place <= (st.keep || field.length); msg = st.type === 'final' ? (place === 1 ? 'Khán giả bình chọn bạn là quán quân!' : 'Bạn xếp hạng ' + place + ' chung cuộc.') : 'Bạn xếp hạng ' + place + '/' + (field.length + 1) + ' về bình chọn' + (ok ? ', an toàn.' : ', phải dừng chân.'); }
      SH.note(a, st.n + ': ' + msg);
      if (st.type === 'final' || st.type === 'mask' && a.si === sh.stages.length - 1 && ok) return this.end(l, log, a, sh, st.type === 'final' ? a.lastPlace === 1 : ok, st.type === 'final' ? a.lastPlace : 1);
      if (!ok) return this.end(l, log, a, sh, false, null);
      if (st.type === 'blind' || st.type === 'select') { if (a.turned.length > 1) { a.pendingCoach = true; return; } a.coach = a.turned[0]; } // nhiều HLV chọn: bước kế tiếp là chọn đội
      this.advance(l, r, log, a, sh);
    },
    advance: function (l, r, log, a, sh) { a.pendingCoach = false; a.si++; if (a.skipNext && sh.stages[a.si] && sh.stages[a.si].type === 'battle') { a.si++; a.skipNext = false; } if (a.si >= sh.stages.length) return this.end(l, log, a, sh, true, 1); },
    end: function (l, log, a, sh, win, place) {
      var st = this.stage(a, sh) || sh.stages[sh.stages.length - 1], reached = st ? st.n : 'chung kết';
      if (win && place === 1) { l.flags.musicWin153 = (l.flags.musicWin153 || []).concat([sh.id]); }
      var res = win && place === 1 ? (sh.mask ? 'giành Mặt nạ vàng' : 'quán quân') : place ? 'xếp hạng ' + place + ' chung kết' : 'dừng chân ở ' + reached;
      SH.finish(l, log, { result: res, prize: win && place === 1 ? V(l, sh.prize) : 0, fame: win && place === 1 ? sh.fame * 4 : sh.fame * (a.si + 1) / sh.stages.length, good: win || a.si >= 2, hap: win ? 12 : a.si >= 2 ? 4 : -2, rank: place, mem: win && place === 1 ? 'Nâng cúp ' + sh.name + '.' : null, invite: win ? { years: 3 } : null });
      if (win && place === 1 && !l.job && E.startJob) E.startJob(l, sh.rap ? 'rapper' : 'ca_si', seeded(a.token), function () { }, true);
    },
    auto: function (l, a, r) { var st = this.stage(a, SH.SHOWS[a.id]); if (a.pendingCoach) return 'c0'; if (st.type === 'mask' && r() < 0.5) return 'hide'; return voice(l, a.rap) > 0.7 ? (r() < 0.3 ? 'bold' : 'safe') : r() < 0.5 ? 'crowd' : 'safe'; }
  };
  // chọn HLV khi nhiều người quay ghế: chèn bước tạm, giữ chỉ số vòng
  var musicRows = SH.HANDLERS.music.rows;
  SH.HANDLERS.music.rows = function (l, a, sh) { if (a.pendingCoach) { var self = this; return a.turned.map(function (c, i) { return { k: 'c' + i, l: 'Về đội ' + c, run: function (l, r, log) { a.coach = c; SH.note(a, 'Bạn chọn về đội ' + c + '.'); self.advance(l, r, log, a, sh); } }; }); } return musicRows.apply(this, arguments); };
  var musicText = SH.HANDLERS.music.text;
  SH.HANDLERS.music.text = function (l, a, sh) { if (a.pendingCoach) return SH.recap(a) + 'Nhiều huấn luyện viên muốn có bạn: ' + a.turned.join(', ') + '. Bạn về đội ai?'; return musicText.apply(this, arguments); };
  function singer(l, o) { o = o || {}; if (l.age < (o.min || 18) || l.age > (o.max || 35)) return 'Dành cho người ' + (o.min || 18) + '–' + (o.max || 35) + ' tuổi'; if ((l.fame || 0) >= (o.fameMax || 5e5)) return 'Bạn đã quá nổi tiếng để làm thí sinh'; var j = jid(l); if (o.rap ? /rapper/.test(j) || L138(l, 'sing') >= 30 || l.talent === 'âm nhạc' : /^(ca_si|rapper|nhac_si)$/.test(j) || l.talent === 'âm nhạc' || L138(l, 'sing') >= 35) return true; return 'Cần có năng khiếu / kỹ năng ca hát' + (o.rap ? ', rap' : ''); }
  SH.define('rapviet', { name: 'Rap Việt', country: 'VN', genre: 'music', from: 2020, handler: 'music', rap: true, prize: 500, fame: 4e4, desc: 'Vòng tuyển chọn (HLV chọn, cả bốn chọn thì nhận nón vàng) → đối đầu → bứt phá → bán kết → chung kết.',
    stages: [{ n: 'Vòng tuyển chọn', type: 'select', d: 'Bạn trình diễn trước bốn huấn luyện viên; HLV nào thích sẽ chọn bạn.' }, { n: 'Vòng đối đầu', type: 'battle', d: 'Đối đầu trực tiếp với một rapper khác trong đội.' }, { n: 'Vòng bứt phá', type: 'knockout', d: 'Ba rapper cùng đội, HLV chọn một người đi tiếp.' }, { n: 'Bán kết', type: 'live', field: 5, keep: 3, d: 'Biểu diễn trực tiếp, khán giả bình chọn.' }, { n: 'Chung kết', type: 'final', field: 4, d: 'Đêm chung kết chọn quán quân.' }],
    roles: { contestant: { n: 'thí sinh', gap: 1, why: function (l) { return singer(l, { rap: true }); } } } });
  SH.define('ghv', { name: 'Giọng Hát Việt', country: 'VN', genre: 'music', from: 2012, to: 2019, handler: 'music', prize: 500, fame: 4e4, desc: 'Giấu mặt (HLV quay ghế chỉ nghe giọng) → đối đầu → loại trực tiếp → liveshow → chung kết.',
    stages: [{ n: 'Vòng giấu mặt', type: 'blind', d: 'Các HLV ngồi quay lưng, chỉ nghe giọng hát; ai thích sẽ quay ghế.' }, { n: 'Vòng đối đầu', type: 'battle', d: 'Song ca đối đầu với một thí sinh cùng đội, HLV chọn người đi tiếp; HLV khác có thể giành bạn.' }, { n: 'Vòng loại trực tiếp', type: 'knockout', d: 'Ba thí sinh lần lượt hát, HLV giữ lại một người.' }, { n: 'Liveshow', type: 'live', field: 6, keep: 4, d: 'Truyền hình trực tiếp, khán giả bình chọn.' }, { n: 'Chung kết', type: 'final', field: 3, d: 'Đêm chung kết.' }],
    roles: { contestant: { n: 'thí sinh', gap: 1, why: function (l) { return singer(l); } } } });
  SH.define('vnidol', { name: 'Vietnam Idol', country: 'VN', genre: 'music', from: 2007, handler: 'music', prize: 300, fame: 4e4, desc: 'Thử giọng trước ba giám khảo (cần ít nhất hai đồng ý), vòng nhà hát, các đêm Gala bình chọn và chung kết.',
    stages: [{ n: 'Vòng thử giọng', type: 'audition', d: 'Hát trước ba giám khảo; cần ít nhất hai người đồng ý.' }, { n: 'Vòng nhà hát', type: 'knockout', d: 'Thử thách theo nhóm và solo, giám khảo loại dần.' }, { n: 'Gala 1', type: 'live', field: 8, keep: 6, d: 'Đêm Gala trực tiếp, khán giả nhắn tin bình chọn.' }, { n: 'Gala 2', type: 'live', field: 5, keep: 3, d: 'Gala tiếp theo, áp lực lớn hơn.' }, { n: 'Chung kết', type: 'final', field: 2, d: 'Đêm chung kết.' }],
    roles: { contestant: { n: 'thí sinh', gap: 1, why: function (l) { return singer(l, { min: 16, max: 30, fameMax: 2e5 }); } } } });
  var vnAir = SH.airing;
  SH.airing = function (l, sh) { if (sh.id === 'vnidol') { var y = yr(l); if (y >= 2017 && y <= 2022) return false; } return vnAir.apply(this, arguments); }; // Vietnam Idol tạm dừng 2017–2022, trở lại 2023
  SH.define('csmn', { name: 'Ca Sĩ Mặt Nạ', country: 'VN', genre: 'music', from: 2022, to: 2023, handler: 'music', mask: true, prize: 200, fame: 6e4, desc: 'Ca sĩ nổi tiếng hóa thân trong mặt nạ; ban cố vấn đoán thân phận, ai bình chọn thấp nhất phải tháo mặt nạ; cuối cùng là Mặt nạ vàng.',
    stages: [{ n: 'Vòng 1', type: 'mask', d: 'Màn ra mắt của các mascot.' }, { n: 'Vòng 2', type: 'mask', d: 'Các mascot đối đầu, ban cố vấn đưa ra phỏng đoán.' }, { n: 'Bán kết', type: 'mask', d: 'Những mascot còn lại, gợi ý ngày càng rõ.' }, { n: 'Chung kết', type: 'mask', d: 'Tranh Mặt nạ vàng.' }],
    roles: { celeb: { n: 'ca sĩ trong mặt nạ', once: true, why: function (l) { var j = jid(l); return (l.fame || 0) >= 2e5 && (/^(ca_si|rapper|nhac_si|dien_vien|dv_hai|mc_tv)$/.test(j)) ? true : 'Dành cho nghệ sĩ nổi tiếng (≥200.000 người biết đến)'; } } } });

  // ---- Huấn luyện viên / giám khảo: người nổi tiếng dẫn dắt đội trong cả mùa ----
  SH.HANDLERS.coach = {
    start: function (l, r, a, sh) { var rr = seeded(a.token); a.pool = Array.from({ length: 6 }, function () { var s = rr() < 0.5 ? 'M' : 'F'; return { name: H.stranger(l, rr, s), skill: 0.35 + rr() * 0.55, look: rr() }; }); a.team = []; a.round = 0; },
    title: function (l, a) { return a.team.length < 3 ? 'Chọn thí sinh cho đội (' + a.team.length + '/3)' : 'Dẫn dắt đội · vòng ' + (a.round + 1) + '/3'; },
    text: function (l, a, sh) { return SH.recap(a) + 'Bạn là ' + sh.roles[a.role].n + ' của ' + sh.name + '. ' + (a.team.length < 3 ? 'Hãy chọn những giọng ca bạn tin tưởng (đánh giá bằng tai nghề của bạn).' : 'Đội của bạn: ' + a.team.map(function (t) { return t.name; }).join(', ') + '. Chọn cách huấn luyện cho vòng này.'); },
    rows: function (l, a, sh) {
      var self = this;
      if (a.team.length < 3) return a.pool.filter(function (p) { return a.team.indexOf(p) < 0; }).map(function (p, i) { var hint = p.skill > 0.7 ? 'giọng hát rất có nghề' : p.skill > 0.55 ? 'giọng khá, cần mài giũa' : 'nhiều cảm xúc nhưng kỹ thuật còn non'; return { k: 'pick' + a.pool.indexOf(p), l: 'Chọn ' + p.name + ' — ' + hint, run: function (l, r) { a.team.push(p); } }; });
      return [['tech', 'Tập trung kỹ thuật thanh nhạc'], ['emotion', 'Khơi gợi cảm xúc, câu chuyện'], ['stage', 'Dàn dựng sân khấu ấn tượng']].map(function (x) { return { k: x[0], l: x[1], run: function (l, r, log) { self.round(l, r, log, a, sh, x[0]); } }; });
    },
    round: function (l, r, log, a, sh, how) {
      var rr = seeded(a.token + ':r' + a.round), skillBonus = Math.min(0.1, voice(l, sh.rap) * 0.1);
      a.team.forEach(function (t) { t.score = (t.score || 0) + t.skill + skillBonus + (how === 'tech' ? (1 - t.skill) * 0.1 : how === 'emotion' ? t.look * 0.08 : 0.06) + (rr() - 0.5) * 0.15; });
      var weakest = a.team.slice().sort(function (x, y) { return x.score - y.score; })[0]; if (a.round < 2 && a.team.length > 1) { a.team.splice(a.team.indexOf(weakest), 1); SH.note(a, weakest.name + ' dừng chân; đội còn ' + a.team.length + ' người.'); }
      a.round++;
      if (a.round >= 3) { var star = a.team[0], champion = star && star.score / 3 + rr() * 0.2 > 0.78; SH.finish(l, log, { result: (champion ? 'thí sinh ' + star.name + ' của đội bạn đăng quang' : 'đội bạn có ' + (star ? star.name : 'thí sinh') + ' vào chung kết'), fame: champion ? 3e5 : 1.2e5, good: true, hap: champion ? 8 : 4, rank: champion ? 1 : 2 }); if (C && C.S && star) { var c = C.meet(l, rr, { kind: 'artist', where: sh.name, tier: Math.max(1, C.tier(l) - 1) }); c.name = star.name; c.job = 'Ca sĩ'; c.trust = 75; c.mentee153 = true; } }
    },
    auto: function (l, a, r) { if (a.team.length < 3) { var best = a.pool.filter(function (p) { return a.team.indexOf(p) < 0; }).sort(function (x, y) { return y.skill - x.skill; })[0]; return 'pick' + a.pool.indexOf(best); } return pick(r, ['tech', 'emotion', 'stage']); }
  };
  function bigStar(l, rap) { var j = jid(l); return l.age >= 26 && (l.fame || 0) >= 1e6 && (rap ? /^(rapper|ca_si|nhac_si)$/.test(j) : /^(ca_si|rapper|nhac_si)$/.test(j)) ? true : 'Dành cho nghệ sĩ âm nhạc rất nổi tiếng (≥1.000.000 người biết đến), từ 26 tuổi'; }
  ['rapviet', 'ghv', 'vnidol'].forEach(function (id) {
    var sh = SH.SHOWS[id], role = id === 'vnidol' ? 'judge' : 'coach';
    sh.roles[role] = { n: id === 'vnidol' ? 'giám khảo' : 'huấn luyện viên', gap: 1, why: function (l) { return bigStar(l, id === 'rapviet'); }, handler: 'coach', fee: 400 };
  });
})(globalThis.G);
