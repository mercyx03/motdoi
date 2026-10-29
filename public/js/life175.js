/* Hai chương trình truyền hình mới trên bộ máy SHOW151: Bếp Trưởng Tranh Tài (ẩm thực) và Chuyện Đời Người Nổi Tiếng (talk show).
   Diễn biến, thí sinh, khách mời và câu chuyện đều là mô phỏng hư cấu; kết quả phụ thuộc năng lực, danh tiếng, giao tiếp và lựa chọn của nhân vật. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, SH = E.SHOW151;
  function yr(l) { return l.birthYear + l.age; }
  function seeded(s) { return SH.seeded(s); }
  function pick(r, a) { return a[Math.floor(r() * a.length)]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function soc(l) { return clamp(((l.st && l.st.soc) || 50) / 100, 0, 1); }
  function jobId(l) { return l.job ? l.job.id : ''; }
  function mo(l, v) { return H.money(l, v); }
  function state(l) {
    var s = l.flags.chef175 || (l.flags.chef175 = {});
    if (typeof s.rep !== 'number') s.rep = 0;
    if (typeof s.practice !== 'number') s.practice = 0;
    if (!Array.isArray(s.history)) s.history = [];
    if (!Array.isArray(s.leaks)) s.leaks = [];
    return s;
  }

  // ===================================================================
  // Năng lực nấu ăn: không có kỹ năng riêng trước đây nên tính từ nghề bếp, sở thích, học vấn và các lần thi đấu
  // ===================================================================
  function cook(l) {
    var s = state(l), level = 10 + s.practice + Math.min(10, ((l.st && l.st.kno) || 40) / 10);
    if (jobId(l) === 'dau_bep') level += 24 + ((l.job.rank || 0) * 14) + Math.min(12, l.job.yrs || 0);
    if (l.hobby === 'nauan') level += 16;
    return clamp(Math.round(level), 0, 100);
  }

  // ===================================================================
  // Bếp Trưởng Tranh Tài
  // ===================================================================
  var ROUNDS = [
    { n: 'Vòng 1 · Nguyên liệu bí mật', need: 0.28, d: 'Mở hộp nguyên liệu bí mật và có 45 phút để nấu một món hoàn chỉnh.' },
    { n: 'Vòng 2 · Hương vị vùng miền', need: 0.32, d: 'Mỗi đầu bếp bốc thăm một vùng ẩm thực và phải giữ đúng bản sắc món ăn.' },
    { n: 'Vòng 3 · Thử thách đồng đội', need: 0.36, d: 'Chia đội nấu bữa tiệc cho 40 khách; phối hợp và chia việc quyết định kết quả.' },
    { n: 'Vòng 4 · Bán kết nhà hàng', need: 0.40, d: 'Nấu thực đơn hai món cho thực khách thật, giám khảo chấm cả tốc độ lẫn độ ổn định.' }
  ];
  var FINAL = { n: 'Chung kết · Ba món', need: 0.44, d: 'Khai vị, món chính, tráng miệng trước hội đồng giám khảo; chỉ một người giành ngôi Bếp trưởng.' };
  var STYLES = [['safe', 'Nấu món sở trường, giữ chắc tay'], ['creative', 'Sáng tạo mạo hiểm, tạo dấu ấn riêng'], ['technical', 'Kỹ thuật chính xác, trình bày tinh tế']];
  var JUDGE_STYLES = [['fair', 'Chấm công tâm theo tiêu chuẩn nhà hàng'], ['strict', 'Nghiêm khắc, chỉ ra từng lỗi'], ['gentle', 'Động viên, góp ý nhẹ nhàng'], ['bias', 'Ưu ái một thí sinh quen biết']];

  SH.HANDLERS.chef175 = {
    start: function (l, r, a) { a.round = 0; a.total = a.role === 'judge' ? 4 : ROUNDS.length + 1; a.cook = cook(l); a.score = 0; a.tension = 0; },
    stage: function (a) { return a.round < ROUNDS.length ? ROUNDS[a.round] : FINAL; },
    title: function (l, a) { return a.role === 'judge' ? 'Ghế giám khảo · tập ' + (a.round + 1) + '/' + a.total : this.stage(a).n; },
    text: function (l, a, sh) {
      if (a.role === 'judge') return SH.recap(a) + 'Tập ' + (a.round + 1) + ': các đầu bếp trình bày món ăn trước bạn. Cách chấm của bạn ảnh hưởng tới uy tín ẩm thực và hình ảnh trước khán giả.';
      var st = this.stage(a);
      return SH.recap(a) + st.d + '\nNăng lực nấu ăn của bạn lúc này: ' + a.cook + '/100.' + (a.round === 0 ? ' Cách xử lý quyết định điểm số; nấu an toàn ít sai nhưng khó gây ấn tượng, sáng tạo có thể bứt phá hoặc hỏng món.' : '');
    },
    rows: function (l, a, sh) {
      var self = this;
      if (a.role === 'judge') return JUDGE_STYLES.map(function (x) { return { k: x[0], l: x[1], run: function (l, r, log) { self.judge(l, r, log, a, sh, x[0]); } }; });
      return STYLES.map(function (x) { return { k: x[0], l: x[1], run: function (l, r, log) { self.cookRound(l, r, log, a, sh, x[0]); } }; });
    },
    cookRound: function (l, r, log, a, sh, how) {
      var rr = seeded(a.token + ':c' + a.round), c = a.cook / 100, st = this.stage(a), final = a.round >= ROUNDS.length;
      var adj = how === 'safe' ? 0.12 + (rr() - 0.5) * 0.2 : how === 'creative' ? (c >= 0.55 ? 0.1 : -0.02) + (rr() - 0.4) * 0.55 : 0.05 + c * 0.12 + (rr() - 0.5) * 0.3;
      var score = c * 0.55 + adj + (rr() - 0.5) * 0.1, ok = score >= st.need;
      var comment = ok ? (score > st.need + 0.2 ? 'Giám khảo khen món ăn có bản sắc và được nêm nếm rất chuẩn.' : 'Món ăn đạt yêu cầu, vẫn còn vài điểm cần hoàn thiện.') : (how === 'creative' ? 'Ý tưởng táo bạo nhưng chưa cân bằng được vị.' : 'Món ăn thiếu điểm nhấn, giám khảo chưa thuyết phục.');
      a.score += score;
      if (!final) {
        SH.note(a, st.n + ': ' + comment + (ok ? ' Bạn đi tiếp.' : ' Bạn dừng bước tại đây.'));
        if (!ok) return this.end(l, log, a, sh, 'out', [10, 8, 6, 4][a.round]);
        a.round++; return;
      }
      var rival = 0.42 + rr() * 0.3, win = ok && score >= rival;
      SH.note(a, st.n + ': ' + comment + (win ? ' Hội đồng chọn bạn là Bếp trưởng của mùa.' : ' Đối thủ cuối cùng nhỉnh hơn một chút.'));
      return this.end(l, log, a, sh, win ? 'win' : 'second', win ? 1 : 2);
    },
    end: function (l, log, a, sh, how, rank) {
      var s = state(l), prize = how === 'win' ? SH.V(l, 300) : 0;
      s.practice = Math.min(40, s.practice + 2 + a.round);
      s.rep = clamp(s.rep + (how === 'win' ? 25 : how === 'second' ? 12 : 3 + a.round), 0, 100);
      s.history.push({ year: yr(l), rank: rank, how: how, season: a.season });
      if (s.history.length > 20) s.history.shift();
      var good = how === 'win' || how === 'second';
      return SH.finish(l, log, {
        result: how === 'win' ? 'vô địch, đoạt danh hiệu Bếp trưởng' : how === 'second' ? 'về nhì chung cuộc' : 'dừng bước ở vòng ' + (a.round + 1),
        prize: prize, fame: how === 'win' ? 2.5e5 : how === 'second' ? 1e5 : 2e4 + a.round * 1.5e4, good: good, hap: how === 'win' ? 9 : good ? 5 : 1, rank: rank,
        mem: how === 'win' ? 'Giây phút tên mình được xướng lên ở chung kết Bếp Trưởng Tranh Tài.' : null,
        invite: good ? { id: 'cheftv', years: 2, why: 'để lại ấn tượng về ẩm thực' } : null
      });
    },
    judge: function (l, r, log, a, sh, how) {
      var rr = seeded(a.token + ':j' + a.round), skill = a.cook / 100;
      if (how === 'fair') a.tension += skill >= 0.4 ? 2 : 1;
      else if (how === 'strict') a.tension += skill >= 0.5 ? 2 : 0;
      else if (how === 'gentle') a.tension += 1;
      else a.tension += rr() < 0.55 ? -3 : 1;
      SH.note(a, { fair: 'Khán giả đánh giá bạn chấm điểm có chuyên môn.', strict: skill >= 0.5 ? 'Nhận xét kỹ thuật của bạn được giới đầu bếp trích lại.' : 'Nhận xét gay gắt bị cho là thiếu thuyết phục vì bạn chưa đủ kinh nghiệm bếp.', gentle: 'Các thí sinh cảm ơn sự động viên của bạn.', bias: a.tension < 0 ? 'Việc ưu ái thí sinh quen biết bị khán giả phát hiện và chỉ trích.' : 'Việc chấm điểm của bạn tạm chưa bị ai nghi ngờ.' }[how]);
      a.round++;
      if (a.round >= a.total) {
        var s = state(l); s.rep = clamp(s.rep + (a.tension >= 0 ? 8 : -6), 0, 100);
        return SH.finish(l, log, { result: 'hoàn thành ' + a.total + ' tập ngồi ghế giám khảo' + (a.tension < 0 ? ', gây tranh cãi về sự công bằng' : ''), fame: a.tension >= 0 ? 1.2e5 : 3e4, good: a.tension >= 0, hap: 3 });
      }
    },
    auto: function (l, a, r) { return a.role === 'judge' ? 'fair' : (a.cook >= 55 ? pick(r, ['technical', 'creative', 'safe']) : 'safe'); }
  };
  SH.define('cheftv', {
    name: 'Bếp Trưởng Tranh Tài', country: 'VN', genre: 'cooking', from: 2012, handler: 'chef175', fee: 120,
    desc: 'Các đầu bếp thi nấu qua 4 vòng loại và chung kết ba món. Thắng cuộc tăng danh tiếng ẩm thực, mở cơ hội làm bếp trưởng hoặc kinh doanh nhà hàng.',
    roles: {
      contestant: { n: 'đầu bếp thi đấu', gap: 2, why: function (l) { return l.age < 16 ? 'Từ 16 tuổi' : cook(l) >= 22 || jobId(l) === 'dau_bep' ? true : 'Cần nền tảng nấu ăn (làm bếp, sở thích nấu ăn hoặc đã luyện tập)'; } },
      judge: { n: 'giám khảo khách mời', gap: 2, fee: 250, why: function (l) { return (l.fame || 0) >= 3e5 && cook(l) >= 55 ? true : 'Dành cho đầu bếp rất có tiếng (danh tiếng cao, năng lực nấu ăn từ 55)'; } }
    }
  });

  // Cơ hội sau khi nổi tiếng ẩm thực
  function offerWhy(l) { var w = X.reason(l, 16); return w !== true ? w : state(l).rep >= 15 ? true : 'Cần có danh tiếng ẩm thực từ các chương trình nấu ăn'; }
  X.menu('chefOffers175', 'Cơ hội từ danh tiếng ẩm thực', offerWhy,
    function (l) { var s = state(l); return 'Danh tiếng ẩm thực ' + s.rep + '/100 · năng lực nấu ăn ' + cook(l) + '/100. Các lời mời đến từ chương trình bạn đã tham gia; mỗi hướng đi có chi phí và rủi ro riêng.'; },
    function (l) {
      var s = state(l), capital = l.base * 40, jobOk = !l.job || ['dau_bep', 'kd_quan'].includes(jobId(l));
      return [
        { k: 'chef', l: 'Nhận lời làm bếp trưởng nhà hàng nổi tiếng', h: 'Nghề đầu bếp, cấp bếp trưởng', why: s.offerYear === l.age ? 'Đã nhận lời mời trong năm nay' : !l.job || jobId(l) === 'dau_bep' ? true : 'Cần nghỉ công việc hiện tại trước',
          run: function (l, r, log) { s.offerYear = l.age; if (jobId(l) === 'dau_bep') l.job.rank = Math.max(l.job.rank || 0, 2); else { E.startJob(l, 'dau_bep', r, log, true); if (jobId(l) === 'dau_bep') l.job.rank = 2; } log('Nhờ danh tiếng ẩm thực, bạn được mời làm bếp trưởng một nhà hàng có tiếng.', 'good'); H.fx(l, { hap: 4 }); } },
        { k: 'restaurant', l: 'Mở nhà hàng mang tên mình · vốn ' + mo(l, capital), h: 'Trở thành chủ quán, thu nhập và rủi ro kinh doanh', why: !jobOk ? 'Cần nghỉ công việc hiện tại trước' : l.money < capital + l.base ? 'Chưa đủ vốn và quỹ dự phòng' : true,
          run: function (l, r, log) { H.cash(l, -capital, 'Vốn mở nhà hàng'); E.startJob(l, 'kd_quan', r, log, true); if (jobId(l) === 'kd_quan') { l.job.p = 'nhà hàng ' + String(l.name).split(' ').pop(); l.job.rank = s.rep >= 50 ? 1 : 0; } s.restaurant = l.age; log('Bạn khai trương nhà hàng mang dấu ấn riêng; khách tới vì tên tuổi từ chương trình, giữ chân họ lại phải bằng chất lượng.', 'good'); } },
        { k: 'book', l: 'Ra sách và kênh dạy nấu ăn', h: 'Cần danh tiếng ẩm thực từ 25', why: s.rep < 25 ? 'Cần danh tiếng ẩm thực từ 25' : s.bookYear && l.age - s.bookYear < 3 ? 'Mới ra sách gần đây' : true,
          run: function (l, r, log) { var gain = l.base * (2 + s.rep / 10); s.bookYear = l.age; H.cash(l, gain, 'Nhuận bút sách nấu ăn'); l.fame = (l.fame || 0) + 4e4; log('Cuốn sách nấu ăn của bạn bán khá tốt, mang về ' + mo(l, gain) + '.', 'good'); } }
      ];
    }, 16, 'Giải trí & trải nghiệm');

  // ===================================================================
  // Chuyện Đời Người Nổi Tiếng (talk show): khách mời hoặc người dẫn chương trình
  // ===================================================================
  function topics(l) {
    var out = [
      { id: 'career', q: 'Điều gì đã giúp bạn đi tới hôm nay, và đâu là lúc bạn muốn bỏ cuộc nhất?', pr: false, leak: 'một giai đoạn bạn từng định bỏ nghề' },
      { id: 'dream', q: 'Nếu được làm lại, bạn sẽ thay đổi quyết định nào trong cuộc đời?', pr: false, leak: 'một quyết định bạn vẫn day dứt' },
      { id: 'money', q: 'Cuộc sống tài chính phía sau hào quang của bạn thực sự ra sao?', pr: true, leak: 'tình hình tài chính thật của bạn' },
      { id: 'past', q: 'Những năm tháng chưa ai biết đến bạn, khi đó bạn đã trải qua điều gì?', pr: true, leak: 'một chuyện khó khăn thời chưa nổi tiếng' }
    ];
    if (l.partner) out.push({ id: 'love', q: 'Chuyện tình cảm của bạn: điều gì khán giả chưa từng được biết?', pr: true, leak: 'chuyện riêng trong tình cảm' });
    if ((l.kids || []).length) out.push({ id: 'family', q: 'Làm cha mẹ cuộc sống có nhiều áp lực. Bạn đã nhờ ai và đã hối tiếc điều gì?', pr: true, leak: 'áp lực trong chuyện gia đình' });
    if (l.ill) out.push({ id: 'health', q: 'Bạn đã giữ kín điều gì về sức khỏe của mình?', pr: true, leak: 'tình trạng sức khỏe của bạn' });
    return out;
  }
  var STANCES = [['honest', 'Kể thật lòng, không né tránh'], ['tactful', 'Trả lời khéo, giữ ranh giới riêng tư'], ['humor', 'Đùa vui để chuyển chủ đề'], ['shock', 'Tiết lộ điều chưa ai biết để gây chú ý']];
  var HOST_WAYS = [['deep', 'Đi sâu vào câu chuyện, khơi nỗi niềm'], ['respect', 'Tôn trọng ranh giới, hỏi tinh tế'], ['funny', 'Giữ không khí nhẹ nhàng, hài hước'], ['dig', 'Khai thác bí mật để gây sốc cho khán giả']];
  function bookable(l) {
    var f = l.fame || 0; if (f < 2e4) return false;
    var chance = clamp(0.25 + Math.log10(f / 2e4 + 1) * 0.55, 0.25, 0.95);
    return seeded(l.id + ':talk175:' + yr(l))() < chance;
  }
  SH.HANDLERS.talk175 = {
    start: function (l, r, a) {
      a.round = 0; a.img = 0; a.debate = 0; a.leaks = [];
      if (a.role === 'host') { a.total = 4; a.rating = 0; a.backlash = 0; a.trust = 0; a.guests = []; this.guest(l, a); return; }
      var rr = seeded(a.token + ':topics'), pool = topics(l), qs = [];
      while (qs.length < 4 && pool.length) qs.push(pool.splice(Math.floor(rr() * pool.length), 1)[0]);
      a.topics = qs; a.total = qs.length;
    },
    guest: function (l, a) { var rr = seeded(a.token + ':g' + a.round), g = H.stranger(l, rr, rr() < 0.5 ? 'M' : 'F'); a.guestName = g + ' (' + pick(rr, ['ca sĩ', 'diễn viên', 'vận động viên', 'doanh nhân', 'nghệ sĩ hài', 'người dẫn chương trình']) + ')'; a.guests.push(a.guestName); },
    title: function (l, a) { return a.role === 'host' ? 'Dẫn chương trình · tập ' + (a.round + 1) + '/' + a.total : 'Câu hỏi ' + (a.round + 1) + '/' + a.total; },
    text: function (l, a) {
      if (a.role === 'host') return SH.recap(a) + 'Khách mời tập này: ' + a.guestName + '. Cách bạn dẫn dắt quyết định tỉ suất người xem, độ tin cậy của khách và hình ảnh của chính bạn. Kỹ năng giao tiếp hiện tại: ' + Math.round(soc(l) * 100) + '/100.';
      return SH.recap(a) + 'Người dẫn chương trình hỏi: “' + a.topics[a.round].q + '”';
    },
    rows: function (l, a, sh) {
      var self = this;
      if (a.role === 'host') return HOST_WAYS.map(function (x) { return { k: x[0], l: x[1], run: function (l, r, log) { self.hostEpisode(l, r, log, a, sh, x[0]); } }; });
      return STANCES.map(function (x) { return { k: x[0], l: x[1], run: function (l, r, log) { self.answer(l, r, log, a, sh, x[0]); } }; });
    },
    answer: function (l, r, log, a, sh, how) {
      var rr = seeded(a.token + ':q' + a.round), t = a.topics[a.round], sc = soc(l), img, debate = false, leak = false, line;
      if (how === 'honest') { leak = t.pr && rr() < 0.6; img = leak ? (rr() < 0.5 ? 1 : -1) : 2; debate = leak && rr() < 0.4; line = leak ? 'Bạn kể thật; khán giả bất ngờ trước ' + t.leak + '.' : 'Bạn trả lời chân thành, khán giả cảm kích.'; }
      else if (how === 'tactful') { img = sc >= 0.5 ? 2 : 1; debate = rr() < 0.08; line = 'Bạn trả lời khéo, giữ được ranh giới riêng tư.'; }
      else if (how === 'humor') { var win = rr() < 0.4 + sc * 0.45; img = win ? 2 : -1; debate = !win && rr() < 0.5; line = win ? 'Câu đùa của bạn khiến cả trường quay bật cười.' : 'Câu đùa không đúng lúc khiến không khí hơi gượng.'; }
      else { leak = rr() < 0.7; debate = true; img = rr() < 0.35 ? 1 : -2; line = 'Lời tiết lộ khiến trường quay im lặng' + (leak ? '; ' + t.leak + ' của bạn không còn là chuyện riêng.' : ', nhưng chưa rõ thật hay chỉ để gây chú ý.'); }
      a.img += img; if (debate) a.debate++; if (leak) a.leaks.push(t.leak);
      SH.note(a, line); a.round++;
      if (a.round >= a.total) return this.endGuest(l, log, a, sh);
    },
    endGuest: function (l, log, a, sh) {
      var s = state(l), leaks = a.leaks.length, fame = Math.max(2e4, 6e4 + a.img * 2e4 + a.debate * 5e4 + leaks * 3e4);
      if (leaks) { s.leaks.push({ year: yr(l), items: a.leaks.slice() }); if (s.leaks.length > 10) s.leaks.shift(); }
      var good = a.img >= 2 && !leaks;
      return SH.finish(l, log, {
        result: a.img >= 5 ? 'gây thiện cảm mạnh với khán giả' : a.img >= 1 ? 'để lại hình ảnh đẹp' : 'gây nhiều tranh luận' + (leaks ? ', làm lộ ' + a.leaks.join(', ') : ''),
        fame: fame, good: good, hap: a.img >= 3 ? 5 : a.img <= -1 ? -4 : 1,
        mem: leaks ? 'Sau buổi ghi hình, ' + a.leaks[0] + ' đã trở thành chủ đề bàn tán.' : null,
        invite: a.img >= 3 ? { id: 'lifetalk', years: 3, why: 'câu chuyện của bạn gây được thiện cảm' } : null
      });
    },
    hostEpisode: function (l, r, log, a, sh, how) {
      var rr = seeded(a.token + ':h' + a.round), sc = soc(l), base = 0.4 + sc * 0.35 + Math.min(0.15, (l.fame || 0) / 6e6), rating = base, line;
      if (how === 'deep') { rating += sc >= 0.6 ? 0.1 : -0.05; a.trust += sc >= 0.6 ? 1 : 0; line = sc >= 0.6 ? 'Bạn dẫn dắt khéo, khách mời mở lòng và tập phát sóng được khen.' : 'Bạn đi sâu nhưng thiếu tinh tế, khách mời có phần dè chừng.'; }
      else if (how === 'respect') { rating += 0.04; a.trust += 2; line = 'Khách mời cảm thấy được tôn trọng và nói thoải mái hơn dự kiến.'; }
      else if (how === 'funny') { rating += 0.06; a.trust += 1; line = 'Tập nhẹ nhàng, nhiều tiếng cười; ít khoảnh khắc đáng nhớ nhưng lượt xem ổn định.'; }
      else { rating += 0.18; var bl = rr() < 0.5; if (bl) a.backlash++; a.trust -= 2; line = bl ? 'Tập phát sóng gây sốc, tỉ suất cao nhưng bị chỉ trích vì xâm phạm đời tư khách mời.' : 'Tập gây sốc và được bàn tán sôi nổi mà chưa bị phản ứng gay gắt.'; }
      rating = clamp(rating + (rr() - 0.5) * 0.12, 0.1, 1); a.rating += rating;
      SH.note(a, 'Tập ' + (a.round + 1) + ' với ' + a.guestName + ': ' + line + ' Tỉ suất ' + Math.round(rating * 100) + '/100.');
      a.round++;
      if (a.round >= a.total) {
        var avg = a.rating / a.total, good = avg >= 0.6 && a.backlash === 0, top = avg >= 0.7;
        return SH.finish(l, log, { result: 'dẫn xong ' + a.total + ' tập, tỉ suất trung bình ' + Math.round(avg * 100) + '/100' + (a.backlash ? ', ' + a.backlash + ' tập bị chỉ trích' : ''), fame: Math.round(5e4 + avg * 2e5 - a.backlash * 3e4), good: good, hap: top ? 6 : good ? 3 : -2, invite: top ? { id: 'lifetalk', years: 3, why: 'tỉ suất người xem tốt' } : null });
      }
      this.guest(l, a);
    },
    auto: function (l, a, r) { return a.role === 'host' ? (soc(l) >= 0.6 ? 'deep' : 'respect') : 'tactful'; }
  };
  SH.define('lifetalk', {
    name: 'Chuyện Đời Người Nổi Tiếng', country: 'VN', genre: 'talk', from: 2010, handler: 'talk175', fee: 80,
    desc: 'Talk show phỏng vấn đời tư người nổi tiếng. Khách mời trả lời bốn câu hỏi: câu trả lời có thể làm đẹp hình ảnh, gây tranh luận hoặc làm lộ bí mật riêng tư.',
    roles: {
      guest: { n: 'khách mời', gap: 1, why: function (l) { return (l.fame || 0) < 2e4 ? 'Cần có danh tiếng (khán giả đã biết tới bạn)' : bookable(l) ? true : 'Năm nay chưa có lời mời; danh tiếng càng cao càng dễ được mời'; } },
      host: { n: 'người dẫn chương trình', gap: 2, fee: 250, why: function (l) { return l.age < 25 ? 'Từ 25 tuổi' : !(SH.famous(l) || jobId(l) === 'mc_tv') ? 'Cần danh tiếng hoặc kinh nghiệm dẫn chương trình' : soc(l) >= 0.6 ? true : 'Cần kỹ năng giao tiếp tốt (từ 60/100)'; } }
    }
  });

  // Hồ sơ cá nhân: danh hiệu ẩm thực và những chuyện từng bị tiết lộ
  if (E.profile) { var profile = E.profile; E.profile = function (l) { var p = profile.apply(this, arguments), s = l.flags && l.flags.chef175; if (s && p && p.jobInfo) { if (s.rep > 0) p.jobInfo.push('Danh tiếng ẩm thực ' + s.rep + '/100'); s.history.filter(function (h) { return h.how === 'win'; }).slice(-2).forEach(function (h) { p.jobInfo.push('Bếp trưởng Bếp Trưởng Tranh Tài (' + h.year + ')'); }); } return p; }; }
  var convert = E.abroadConvert; E.abroadConvert = function (l, f) { return convert.apply(this, arguments); };
  E.CHEF175 = { cook: cook, state: state, topics: topics, bookable: bookable };
})(globalThis.G);
