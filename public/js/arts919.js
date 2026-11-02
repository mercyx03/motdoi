/* Một Đời — MD4 D01/D08 (8.10.22): trò chơi tuổi thơ theo nơi sống và nghệ thuật/nhạc cụ/biểu diễn.
   Mở rộng tuổi thơ (CHILDHOOD898, bạn bè E.friendsOf), kỹ năng cá nhân LIFE138 (instrument, dance) và nghề biểu diễn hiện có.
   · D01: mỗi trò có tên địa phương, bản dịch, phạm vi văn hóa (không độc quyền một nước), luật riêng, số người, dụng cụ (có thể
     tự chế, không cần mua), tuổi, địa điểm, cách chơi thích nghi. Lượt chơi có lựa chọn, kết quả theo kỹ năng từng trò của bạn và
     của bạn chơi (người thật trong danh sách bạn bè), có ký ức lần đầu; lợi ích chỉ ở vài lượt đầu mỗi năm (không farm chỉ số).
   · D08: ballet, piano, violin, sáo, clarinet, trumpet, saxophone, guitar acoustic/điện, nhảy hiện đại, trượt patin, trượt băng —
     mỗi môn một kỹ năng riêng; tiến bộ theo thời gian luyện, cách học, giáo viên, độ phù hợp, sức khỏe, động lực, có trần/năm;
     chứng chỉ cấp độ, thi đấu/tuyển chọn, biểu diễn, dạy học, lưu diễn có hợp đồng, phí đoàn, thuế, thị thực làm việc.
   Kết quả băm theo nhân vật + năm + lượt (không tiêu RNG của game, tải lại không đổi). */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, W = G.W, L = E.LIFE138;
  if (!X || !L) return;
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; return h >>> 0; }
  function u(seed) { return hash(seed) / 4294967296; }
  function mo(l, v) { return H.money(l, v); }
  function res(l) { return H.resCode(l); }
  function gdpK(l) { var b = W.BY[res(l)]; return Math.max(0.5, Math.min(2.5, (b ? b.gdp : 10) / 15)); }
  function st(l) { var s = l.flags.arts919; if (!s || typeof s !== 'object') s = l.flags.arts919 = { v: 1, games: {}, plays: {}, fsk: {}, learned: [], arts: {}, tours: [] }; ['games', 'plays', 'fsk', 'arts'].forEach(function (k) { if (!s[k] || typeof s[k] !== 'object') s[k] = {}; }); if (!Array.isArray(s.learned)) s.learned = []; if (!Array.isArray(s.tours)) s.tours = []; return s; }
  // ================= D01: danh mục trò chơi =================
  var GAMES = [
    { id: 'hide', n: 'Trốn tìm (năm mười) · hide-and-seek · 숨바꼭질 (sumbakkokjil)', scope: null, rule: 'Một người nhắm mắt đếm, những người khác đi trốn; người đi tìm bắt được ai thì người đó thua lượt sau. Cách đếm và luật "về đích" khác nhau theo nhóm.', n2: [3, 12], equip: 'không cần', age: [4, 12], place: 'sân, nhà, công viên có người lớn trông', act: 1, adapt: 'Người khiếm thị: người trốn vỗ tay/rung chuông định kỳ; người dùng xe lăn: giới hạn khu vực bằng phẳng.' },
    { id: 'tag', n: 'Đuổi bắt · tag', scope: null, rule: 'Một người đuổi, chạm vào ai thì người đó thành người đuổi.', n2: [3, 15], equip: 'không cần', age: [4, 13], place: 'sân rộng, an toàn', act: 2, adapt: 'Chạm bằng gậy xốp mềm, khu vực nhỏ hơn hoặc đi bộ nhanh thay vì chạy.' },
    { id: 'freeze', n: 'Đóng băng · freeze tag', scope: null, rule: 'Bị chạm phải đứng im như tượng tới khi đồng đội chạm "giải băng"; người đuổi thắng khi đóng băng hết.', n2: [4, 15], equip: 'không cần', age: [5, 13], place: 'sân rộng', act: 2, adapt: 'Giải băng bằng tín hiệu tay cho bạn khiếm thính; vùng chơi nhỏ cho bạn di chuyển chậm.' },
    { id: 'mugung', n: '무궁화 꽃이 피었습니다 (Mugunghwa kkochi pieotseumnida) — trò dừng–chạy', scope: ['KR'], rule: 'Người làm "tượng" quay lưng hô câu, các bạn tiến lại; khi người ấy quay lại ai còn cử động bị gọi tên. Khác trò đóng băng: không có giải cứu bằng chạm.', n2: [3, 12], equip: 'không cần', age: [5, 12], place: 'sân', act: 1, adapt: 'Dùng đèn/bảng màu thay tiếng hô cho bạn khiếm thính.' },
    { id: 'casau', n: 'Cá sấu lên bờ', scope: ['VN'], rule: 'Một bạn làm "cá sấu" ở vùng nước (giữa sân); các bạn phải chạy qua khi đang "dưới nước", lên các ô "bờ" thì an toàn; bị bắt thành cá sấu.', n2: [4, 12], equip: 'phấn vẽ vùng', age: [5, 11], place: 'sân có vạch', act: 2, adapt: 'Ô "bờ" rộng hơn, đi bộ thay chạy.' },
    { id: 'rps', n: 'Oẳn tù tì · rock–paper–scissors · じゃんけん (janken)', scope: null, rule: 'Búa thắng kéo, kéo thắng bao (giấy), bao thắng búa; hòa thì ra lại. Thường dùng để chọn người đi trước.', n2: [2, 2], equip: 'không cần', age: [4, 99], place: 'bất cứ đâu', act: 0, adapt: 'Có thể nói tên hoặc giơ thẻ hình thay cử chỉ tay.' },
    { id: 'tatlon', n: 'Tạt lon', scope: ['VN'], rule: 'Dựng lon (thường đổ cát), đứng sau vạch ném dép cho đổ lon; người giữ lon dựng lại và đuổi bắt người chưa lấy được dép.', n2: [4, 10], equip: 'lon cũ, dép', age: [7, 14], place: 'ngõ, sân rộng, tránh đường xe', act: 2, adapt: 'Ném bóng mềm thay dép, khoảng cách ngắn hơn.' },
    { id: 'khang', n: 'Đánh khăng', scope: ['VN'], rule: 'Dùng que dài hất que ngắn ra xa, đo khoảng cách để tính điểm; bên kia bắt que ngắn để giành lượt.', n2: [2, 8], equip: 'hai que gỗ', age: [9, 15], place: 'bãi đất trống, có người lớn để ý vì que có thể bay trúng người', act: 1, adapt: 'Dùng que xốp và vùng đứng an toàn.' },
    { id: 'oanquan', n: 'Ô ăn quan', scope: ['VN'], rule: 'Bàn 10 ô dân và 2 ô quan; rải sỏi theo chiều, ăn ô sau ô trống; hết quan thì kết thúc, đếm quân.', n2: [2, 2], equip: 'sỏi/hạt, kẻ ô bằng phấn', age: [6, 99], place: 'sân, hiên nhà', act: 0, adapt: 'Ô có gờ nổi cho người khiếm thị.' },
    { id: 'ayatori', n: 'あやとり (ayatori) · trò dây', scope: ['JP'], rule: 'Một vòng dây len quấn trên ngón tay tạo hình cầu, lưới, sao; có thể chơi một mình hoặc đổi tay qua lại hai người.', n2: [1, 2], equip: 'một vòng dây len', age: [5, 99], place: 'trong nhà', act: 0, adapt: 'Dùng dây to, nhiều màu.' },
    { id: 'gonggi', n: '공기 (gonggi)', scope: ['KR'], rule: 'Năm viên đá/nhựa: tung một viên, nhặt viên khác rồi bắt lại; qua các bậc khó dần. Gần với chơi chuyền ở Việt Nam nhưng luật từng bậc khác.', n2: [1, 4], equip: '5 viên nhựa hoặc sỏi', age: [6, 99], place: 'bàn, sàn nhà', act: 0, adapt: 'Viên to hơn, cho phép bắt hai tay.' },
    { id: 'chuyen', n: 'Chơi chuyền (đánh chắt)', scope: ['VN'], rule: 'Tung quả (bóng/quả cà), nhặt que theo bậc một que, hai que… rồi bắt lại; có bài đồng dao theo nhịp.', n2: [1, 4], equip: 'que tre và một quả nhỏ', age: [6, 14], place: 'hiên nhà, sân', act: 0, adapt: 'Bớt que mỗi bậc.' },
    { id: 'hop', n: 'Nhảy lò cò · hopscotch', scope: null, rule: 'Kẻ ô số trên đất, ném vật đánh dấu, nhảy lò cò qua các ô, không giẫm vạch, không vào ô có vật.', n2: [1, 6], equip: 'phấn, viên đá dẹt', age: [5, 12], place: 'sân phẳng', act: 2, adapt: 'Bước thay nhảy, ô to hơn.' },
    { id: 'simon', n: 'Simon Says', scope: ['US', 'GB', 'CA', 'AU', 'NZ', 'IE'], rule: 'Chỉ làm theo lệnh bắt đầu bằng "Simon says…"; làm theo lệnh không có câu đó thì bị loại.', n2: [3, 20], equip: 'không cần', age: [4, 10], place: 'lớp học, sân', act: 1, adapt: 'Lệnh bằng hình ảnh/ký hiệu cho bạn khiếm thính.' },
    { id: 'elastic', n: 'Nhảy dây thun · elástico · French skipping', scope: null, rule: 'Hai người căng dây thun ở mắt cá, đầu gối, hông…; người nhảy làm chuỗi động tác, sai thì đổi lượt.', n2: [3, 6], equip: 'dây thun nối dài', age: [6, 13], place: 'sân, hiên', act: 2, adapt: 'Hạ độ cao dây, động tác bước.' },
    { id: 'ampe', n: 'Ampe (Ghana)', scope: ['GH'], rule: 'Người dẫn và người chơi cùng nhảy, vỗ tay rồi đưa một chân ra trước; tùy vai trò mà trùng chân hay khác chân được điểm.', n2: [2, 12], equip: 'không cần', age: [6, 14], place: 'sân', act: 2, adapt: 'Ngồi đưa tay thay chân.' }
  ];
  function G1(id) { return GAMES.find(function (g) { return g.id === id; }); }
  function known(l, g) { if (!g.scope) return true; if (g.scope.indexOf(res(l)) >= 0 || g.scope.indexOf(l.country) >= 0) return true; return st(l).learned.indexOf(g.id) >= 0; }
  function canMove(l) { var f = l.flags.care919 && l.flags.care919.fn; return !f || !f.eff || f.eff.mobility >= 55; }
  function friends(l) { var a = (E.friendsOf ? E.friendsOf(l) : []).filter(function (f) { return f && f.name; }).map(function (f) { return f.name; }); (l.sibList || []).forEach(function (t) { if (t.alive !== false && Math.abs(t.born || 0) <= 4) a.push(t.n || t.name); }); return a.filter(function (n, i) { return a.indexOf(n) === i; }).slice(0, 6); }
  function gsk(l, id) { return st(l).games[id] || 0; }
  function fsk(l, name, id) { var s = st(l), k = name + '|' + id; if (s.fsk[k] == null) s.fsk[k] = Math.round(20 + u(l.id + ':fsk:' + k) * 50); return s.fsk[k]; }
  function playsLeft(l) { var p = st(l).plays; return p.at === l.age ? Math.max(0, 6 - p.n) : 6; }
  var RPS = ['búa', 'kéo', 'bao'];
  function rpsRound(l, me, i) { var them = Math.floor(u(l.id + ':rps:' + l.age + ':' + (st(l).plays.n || 0) + ':' + i) * 3); return { them: them, out: me === them ? 0 : (me + 3 - them) % 3 === 2 ? 1 : -1 }; } // búa(0)>kéo(1)>bao(2)>búa
  function play(l, id, with_, mode, log, hand) {
    var s = st(l), g = G1(id); if (!g || playsLeft(l) <= 0) return null; if (s.plays.at !== l.age) s.plays = { at: l.age, n: 0, per: {} }; s.plays.n++; s.plays.per[id] = (s.plays.per[id] || 0) + 1;
    var first = !(s.games[id] > 0), mine = gsk(l, id), opp = with_ ? fsk(l, with_, id) : 30, out, tx = '';
    if (id === 'rps' && hand != null) { var i = 0, rr; do { rr = rpsRound(l, hand, i); tx += (i ? ', ra lại: ' : '') + 'bạn ' + RPS[hand] + ' – ' + (with_ || 'bạn') + ' ' + RPS[rr.them]; i++; } while (rr.out === 0 && i < 3); out = rr.out; tx = 'Oẳn tù tì: ' + tx + '. ' + (out > 0 ? 'Bạn được đi trước!' : out < 0 ? (with_ || 'Bạn kia') + ' đi trước.' : 'Hòa ba lần, cả hai cùng cười.'); }
    else { var me = mine * 0.6 + (g.act && !canMove(l) && mode !== 'adapt' ? -15 : 0) + (l.st.hea - 60) * 0.1 + u(l.id + ':g:' + id + ':' + l.age + ':' + s.plays.n) * 40, them = opp * 0.6 + u(l.id + ':o:' + id + ':' + l.age + ':' + s.plays.n) * 40; out = me > them + 4 ? 1 : me < them - 4 ? -1 : 0; tx = (mode === 'adapt' ? 'Cả nhóm chơi ' + g.n.split(' · ')[0] + ' theo luật thích nghi (' + g.adapt.toLowerCase() + ') ' : 'Chơi ' + g.n.split(' · ')[0] + ' ') + (with_ ? 'cùng ' + with_ + '. ' : '. ') + (out > 0 ? 'Bạn thắng lượt này.' : out < 0 ? (with_ || 'Nhóm bạn') + ' thắng lượt này.' : 'Hai bên ngang tài.'); }
    var gain = (mode === 'practice' ? 6 : mode === 'rules' ? 3 : 4) * (1 - mine / 110); s.games[id] = Math.min(100, mine + gain); if (with_) { var k = with_ + '|' + id; s.fsk[k] = Math.min(100, fsk(l, with_, id) + 1.5); }
    if (s.plays.n <= 3) H.fx(l, { hap: out >= 0 ? 2 : 1, soc: with_ ? 1 : 0, hea: g.act >= 2 ? 1 : 0 });
    if (first) H.mem(l, 'Lần đầu chơi ' + g.n.split(' · ')[0] + (with_ ? ' cùng ' + with_ : '') + '.', 2);
    if (out > 0 && !s.firstWin) { s.firstWin = id; H.mem(l, 'Lần đầu thắng ' + g.n.split(' · ')[0] + '.', 2); }
    log(tx + (g.act >= 2 && l.age < 9 ? ' Có người lớn để mắt từ xa.' : ''), out > 0 ? 'good' : 'neutral'); return out;
  }
  X.menu('games919', 'Trò chơi tuổi thơ cùng bạn bè', function (l) { var r = X.reason(l, 4); if (r !== true) return r; return l.age <= 13 ? true : 'Dành cho tuổi thơ (4–13 tuổi)'; }, function (l, d) {
    var a = d && d.arg || {}, g = a.g && G1(a.g);
    if (g) return g.n + ' — ' + g.rule + '\nSố người: ' + g.n2[0] + (g.n2[1] > g.n2[0] ? '–' + g.n2[1] : '') + ' · dụng cụ: ' + g.equip + ' · tuổi ' + g.age[0] + '+ · nơi chơi: ' + g.place + '.\nThích nghi: ' + g.adapt + '\nKỹ năng của bạn: ' + Math.round(gsk(l, g.id)) + '/100.' + (g.scope ? ' Trò phổ biến ở ' + g.scope.map(function (c) { return W.BY[c] ? W.BY[c].name : c; }).join(', ') + ' nhưng không phải độc quyền và không phải trẻ nào cũng chơi.' : '');
    return 'Chọn trò để chơi, học luật hoặc luyện. Lượt chơi còn trong năm: ' + playsLeft(l) + '/6 (vài lượt đầu mới mang lại niềm vui/vận động rõ rệt). Bạn chơi: ' + (friends(l).join(', ') || 'chưa có bạn thân — có thể chơi cùng bạn cùng lớp hoặc anh chị em') + '.';
  }, function (l, arg) {
    var g = arg && arg.g && G1(arg.g), fr = friends(l), out = [];
    if (!g) {
      GAMES.forEach(function (x) { if (l.age < x.age[0] || l.age > x.age[1]) return; if (!known(l, x)) return; out.push({ k: 'g:' + x.id, l: x.n + (gsk(l, x.id) ? ' · kỹ năng ' + Math.round(gsk(l, x.id)) : ''), run: function (l, r) { X.next(l, 'games919', r, { g: x.id }); } }); });
      GAMES.filter(function (x) { return !known(l, x) && l.age >= Math.max(7, x.age[0]) && l.age <= x.age[1]; }).slice(0, 3).forEach(function (x) { out.push({ k: 'learn:' + x.id, l: 'Tìm hiểu trò của nước khác: ' + x.n, h: 'Qua sách, bạn quốc tế hoặc giờ giao lưu ở trường', run: function (l, r, log) { st(l).learned.push(x.id); log('Bạn học luật ' + x.n + ': ' + x.rule, 'neutral'); } }); });
      return out;
    }
    var left = playsLeft(l) > 0 ? true : 'Đã chơi đủ lượt năm nay';
    if (g.id === 'rps') RPS.forEach(function (h, i) { out.push({ k: 'h' + i, l: 'Ra ' + h + (fr[0] ? ' với ' + fr[0] : ''), why: left, run: function (l, r, log) { play(l, 'rps', fr[0] || null, 'play', log, i); } }); });
    else {
      fr.slice(0, 3).forEach(function (n) { out.push({ k: 'with:' + n, l: 'Rủ ' + n + ' chơi', why: left, run: function (l, r, log) { play(l, g.id, n, 'play', log); } }); });
      if (g.n2[0] <= 1 || !fr.length) out.push({ k: 'solo', l: g.n2[0] <= 1 ? 'Chơi một mình / luyện tập' : 'Chơi cùng bạn cùng lớp', why: left, run: function (l, r, log) { play(l, g.id, null, 'practice', log); } });
      if (g.act) out.push({ k: 'adapt', l: 'Đề nghị cả nhóm chơi luật thích nghi', h: g.adapt, why: left, run: function (l, r, log) { play(l, g.id, fr[0] || null, 'adapt', log); } });
      out.push({ k: 'rules', l: 'Học kỹ luật chơi với người lớn/anh chị', why: left, run: function (l, r, log) { play(l, g.id, null, 'rules', log); } });
    }
    out.push({ k: 'back', l: '← Danh sách trò chơi', run: function (l, r) { X.next(l, 'games919', r, {}); } });
    return out;
  }, 4, 'Học tập');

  // ================= D08: nghệ thuật =================
  var ART = {
    ballet: { n: 'múa ba lê', cat: 'dance', buy: 0.01, rent: 0, lesson: [0, 0.04, 0.12], inj: 0.05, age: 4, key: 'dance' }, piano: { n: 'piano', cat: 'music', buy: 0.6, rent: 0.05, lesson: [0, 0.04, 0.1], inj: 0, age: 5, key: 'instrument' },
    violin: { n: 'violin', cat: 'music', buy: 0.08, rent: 0.02, lesson: [0, 0.04, 0.1], inj: 0.005, age: 5, key: 'instrument' }, flute: { n: 'sáo (flute)', cat: 'music', buy: 0.05, rent: 0.015, lesson: [0, 0.03, 0.08], inj: 0, age: 8, key: 'instrument' },
    clarinet: { n: 'clarinet', cat: 'music', buy: 0.06, rent: 0.015, lesson: [0, 0.03, 0.08], inj: 0, age: 9, key: 'instrument' }, trumpet: { n: 'kèn trumpet', cat: 'music', buy: 0.05, rent: 0.015, lesson: [0, 0.03, 0.08], inj: 0, age: 9, key: 'instrument' },
    sax: { n: 'saxophone', cat: 'music', buy: 0.1, rent: 0.02, lesson: [0, 0.03, 0.09], inj: 0, age: 10, key: 'instrument' }, guitar: { n: 'guitar acoustic', cat: 'music', buy: 0.03, rent: 0.01, lesson: [0, 0.03, 0.08], inj: 0, age: 7, key: 'instrument' },
    eguitar: { n: 'guitar điện', cat: 'music', buy: 0.07, rent: 0.02, lesson: [0, 0.03, 0.08], inj: 0, age: 10, key: 'instrument' }, dance: { n: 'nhảy hiện đại / hip-hop', cat: 'dance', buy: 0, rent: 0, lesson: [0, 0.03, 0.08], inj: 0.03, age: 6, key: 'dance' },
    roller: { n: 'trượt patin', cat: 'skate', buy: 0.01, rent: 0.004, lesson: [0, 0.02, 0.06], inj: 0.04, age: 5, key: 'sport' }, ice: { n: 'trượt băng nghệ thuật', cat: 'skate', buy: 0.02, rent: 0.01, lesson: [0, 0.06, 0.15], inj: 0.06, age: 4, key: 'sport', rink: true }
  };
  var MODE = { self: 'Tự học (video, sách)', group: 'Lớp nhóm', private: 'Giáo viên/mentor riêng' }, HRS = { light: ['Luyện nhẹ (2–3 giờ/tuần)', 4], regular: ['Luyện đều (5–7 giờ/tuần)', 8], intense: ['Luyện chuyên sâu (10+ giờ/tuần)', 12] };
  function art(l, id) { var s = st(l); return s.arts[id]; }
  function best(l) { var s = st(l); return Object.keys(s.arts).reduce(function (m, k) { return Math.max(m, s.arts[k].sk || 0); }, 0); }
  function rinkOk(l) { var b = W.BY[res(l)]; return l.urban && b && b.gdp >= 8; }
  function costYear(l, id, a) { var A = ART[id]; return l.base * gdpK(l) * ((A.lesson[['self', 'group', 'private'].indexOf(a.mode)] || 0) + (a.inst === 'rent' ? A.rent : 0) + (a.inst === 'own' ? A.buy * 0.03 : 0) + (A.rink ? 0.02 : 0)) * (a.hrs === 'intense' ? 1.3 : 1); }
  function fit(l, id) { var A = ART[id], t = l.talent || ''; return (A.cat === 'music' && t === 'âm nhạc' || A.cat !== 'music' && /thể thao|diễn xuất/.test(t) ? 1.25 : 1) * (0.8 + u(l.id + ':fit:' + id) * 0.4); }
  function startWhy(l, id) { var A = ART[id]; if (l.age < A.age) return 'Thường bắt đầu từ ' + A.age + ' tuổi'; if (A.rink && !rinkOk(l)) return 'Gần nơi bạn sống không có sân băng'; return true; }
  function artYear(l, log) {
    var s = st(l); Object.keys(s.arts).forEach(function (id) {
      var a = s.arts[id], A = ART[id]; if (!a.on || a.yr === l.age) return; a.yr = l.age;
      var c = costYear(l, id, a), payer = l.indep ? 'self' : 'parents'; if (c > 0) { if (payer === 'self' && l.money < c) { a.on = false; log('Tạm dừng ' + A.n + ' vì chưa đủ tiền học phí/nhạc cụ.', 'neutral'); return; } if (payer === 'parents' && l.fam && l.fam.q <= 2 && a.mode === 'private') { a.mode = 'group'; log('Gia đình không kham nổi học riêng, chuyển sang lớp nhóm ' + A.n + '.', 'neutral'); c = costYear(l, id, a); } H.cash(l, -c, 'Học ' + A.n + (payer === 'parents' ? ' (bố mẹ chi)' : '')); }
      if (a.inj && a.inj >= l.age - 1) { a.inj = null; return; }
      var hea = Math.max(0.4, l.st.hea / 80), mot = 0.7 + u(l.id + ':mot:' + id + ':' + l.age) * 0.6, gain = HRS[a.hrs][1] * { self: 0.85, group: 1, private: 1.3 }[a.mode] * fit(l, id) * hea * mot * (1 - (a.sk || 0) / 105) * (a.inst === 'none' && A.cat === 'music' ? 0.5 : 1);
      a.sk = Math.min(100, (a.sk || 0) + Math.min(14, gain)); a.years = (a.years || 0) + 1;
      if (A.inj && u(l.id + ':inj:' + id + ':' + l.age) < A.inj * (a.hrs === 'intense' ? 1.5 : a.hrs === 'light' ? 0.3 : 0.8)) { a.inj = l.age; a.sk = Math.max(0, a.sk - 3); H.fx(l, { hea: -3 }); log('Bạn bị chấn thương khi tập ' + A.n + '; cần nghỉ hồi phục, năm sau tập lại nhẹ nhàng.', 'bad'); }
      var sk = L.skill(l, A.key); if (typeof sk.level === 'number') sk.level = Math.max(sk.level, Math.round(a.sk));
    });
    s.tours.forEach(function (t) { if (t.status === 'signed' && t.at < l.age) settleTour(l, t, log); });
  }
  function gradeNext(a) { return (a.grade || 0) + 1; }
  function exam(l, id, log) { var a = art(l, id), A = ART[id], g = gradeNext(a), fee = l.base * 0.01 * gdpK(l); H.cash(l, -fee, 'Lệ phí thi chứng chỉ ' + A.n); var need = 8 + g * 9, x = a.sk + u(l.id + ':ex:' + id + ':' + l.age) * 12 - 6; a.examAt = l.age; if (x >= need) { a.grade = g; log('Đạt chứng chỉ ' + A.n + ' cấp ' + g + '/8.', 'good'); if (g === 8) H.mem(l, 'Hoàn thành cấp chứng chỉ cao nhất môn ' + A.n + '.', 4); } else log('Chưa đạt kỳ thi ' + A.n + ' cấp ' + g + '; có thể thi lại năm sau.', 'neutral'); }
  function compete(l, id, log) { var a = art(l, id), A = ART[id], fee = l.base * 0.015 * gdpK(l); H.cash(l, -fee, 'Lệ phí thi/tuyển chọn ' + A.n); a.compAt = l.age; var me = a.sk + u(l.id + ':cp:' + id + ':' + l.age) * 25, field = 50 + u(l.id + ':cf:' + id + ':' + l.age) * 35; if (me > field + 15) { H.cash(l, l.base * 0.03, 'Giải thưởng ' + A.n); H.fx(l, { hap: 8 }); H.mem(l, 'Đoạt giải cuộc thi ' + A.n + '.', 5); log('Bạn đoạt giải cuộc thi ' + A.n + '!', 'big'); a.awards = (a.awards || 0) + 1; } else if (me > field) { H.fx(l, { hap: 3 }); log('Bạn lọt vào vòng chung kết ' + A.n + '.', 'good'); } else log('Chưa có giải ' + A.n + ' lần này; kết quả tùy kỹ năng, chuẩn bị và đối thủ.', 'neutral'); }
  // Lưu diễn: hợp đồng ký trước, doanh thu gộp → phí đoàn, đi lại, đại diện, thuế → thực nhận; ra nước ngoài cần thị thực nghệ sĩ.
  function tourQuote(l, id, dest) { var a = art(l, id), gross = l.base * (0.15 + (a.sk - 60) / 80 + Math.min(1, Math.log10(1 + (l.fame || 0)) / 8)) * (dest !== res(l) ? 1.6 : 1); return { gross: gross, crew: gross * 0.25, travel: l.base * (dest !== res(l) ? 0.12 : 0.04), agent: gross * 0.15, tax: gross * 0.1 }; }
  function settleTour(l, t, log) { t.status = 'done'; var q = t.q, net = q.gross - q.crew - q.travel - q.agent - q.tax; H.cash(l, q.gross, 'Doanh thu lưu diễn (gộp)'); H.cash(l, -q.crew, 'Phí đoàn, kỹ thuật'); H.cash(l, -q.travel, 'Đi lại, lưu trú lưu diễn'); H.cash(l, -q.agent, 'Phí đại diện'); H.cash(l, -q.tax, 'Thuế khấu trừ thù lao lưu diễn'); if (l.mind) l.mind.stress = U.clamp(l.mind.stress + 10, 0, 100); if (l.partner && l.partner.affection108 != null) l.partner.affection108 = U.clamp(l.partner.affection108 - 3, 0, 100); log('Kết thúc lưu diễn ' + (t.dest !== res(l) ? 'tại ' + (W.BY[t.dest] ? W.BY[t.dest].name : t.dest) : 'trong nước') + ': thực nhận ' + mo(l, net) + ' sau phí đoàn, đi lại, đại diện và thuế. Lịch dày khiến bạn mệt và ít thời gian cho gia đình.', 'good'); t.net = net; }
  X.menu('arts919', 'Nghệ thuật, nhạc cụ, múa và trượt', function (l) { return X.reason(l, 4); }, function (l) {
    var s = st(l), on = Object.keys(s.arts);
    return 'Mỗi môn là một kỹ năng riêng. Tiến bộ cần thời gian và cách luyện phù hợp; có tiền giúp tiếp cận giáo viên, nhạc cụ nhưng không bảo đảm thành tài. Ca sĩ không bắt buộc chơi nhạc cụ.' + (on.length ? '\n' + on.map(function (id) { var a = s.arts[id], A = ART[id]; return '• ' + A.n + ': kỹ năng ' + Math.round(a.sk || 0) + '/100' + (a.grade ? ', chứng chỉ cấp ' + a.grade : '') + (a.on ? ' · ' + MODE[a.mode] + ', ' + HRS[a.hrs][0].toLowerCase() + ', ~' + mo(l, costYear(l, id, a)) + '/năm' : ' · đang tạm dừng') + (a.inj === l.age ? ' · đang nghỉ chấn thương' : ''); }).join('\n') : '') +
      (s.tours.length ? '\nLưu diễn: ' + s.tours.slice(-3).map(function (t) { return (W.BY[t.dest] ? W.BY[t.dest].name : t.dest) + ' (' + (t.status === 'done' ? 'thực nhận ' + mo(l, t.net) : 'đã ký, diễn năm sau') + ')'; }).join('; ') : '');
  }, function (l, arg) {
    var s = st(l), out = [];
    if (arg && arg.id) { var id = arg.id, A = ART[id], a = s.arts[id];
      Object.keys(MODE).forEach(function (m) { Object.keys(HRS).forEach(function (h) { if (h === 'intense' && m === 'self') return; out.push({ k: m + ':' + h, l: (a && a.on && a.mode === m && a.hrs === h ? '✓ ' : '') + MODE[m] + ' · ' + HRS[h][0], h: '~' + mo(l, costYear(l, id, { mode: m, hrs: h, inst: a ? a.inst : 'none' })) + '/năm', why: startWhy(l, id), run: function (l, r, log) { var q = s.arts[id] || (s.arts[id] = { sk: 0, inst: 'none', since: l.age }); q.on = true; q.mode = m; q.hrs = h; log('Bạn ' + (q.years ? 'tiếp tục' : 'bắt đầu') + ' học ' + A.n + ': ' + MODE[m].toLowerCase() + ', ' + HRS[h][0].toLowerCase() + '.', 'neutral'); } }); }); });
      if (A.buy > 0 || A.rent > 0) { if (A.rent > 0) out.push({ k: 'rent', l: 'Thuê ' + A.n + ' theo năm', h: mo(l, l.base * A.rent * gdpK(l)) + '/năm', why: a && a.inst === 'rent' ? 'Đang thuê' : true, run: function () { var q = s.arts[id] || (s.arts[id] = { sk: 0, since: l.age }); q.inst = 'rent'; } }); out.push({ k: 'buy', l: 'Mua ' + A.n + ' riêng', h: mo(l, l.base * A.buy * gdpK(l)) + ' · bảo dưỡng hằng năm', why: a && a.inst === 'own' ? 'Đã có' : l.indep && l.money < l.base * A.buy * gdpK(l) ? 'Chưa đủ tiền' : !l.indep && l.fam && l.fam.q <= 2 && A.buy > 0.1 ? 'Gia đình chưa đủ khả năng mua' : true, run: function (l, r, log) { var q = s.arts[id] || (s.arts[id] = { sk: 0, since: l.age }); H.cash(l, -l.base * A.buy * gdpK(l), 'Mua ' + A.n); q.inst = 'own'; log('Có ' + A.n + ' riêng để luyện mỗi ngày.', 'good'); } }); }
      if (a) { out.push({ k: 'stop', l: a.on ? 'Tạm dừng ' + A.n : 'Đang tạm dừng', why: a.on ? true : 'Đã dừng', run: function () { a.on = false; } });
        out.push({ k: 'exam', l: 'Thi chứng chỉ cấp ' + gradeNext(a), why: a.examAt === l.age ? 'Đã thi năm nay' : (a.grade || 0) >= 8 ? 'Đã đạt cấp cao nhất' : true, run: function (l, r, log) { exam(l, id, log); } });
        out.push({ k: 'comp', l: 'Dự thi / tuyển chọn (audition)', why: a.compAt === l.age ? 'Đã thi năm nay' : (a.sk || 0) < 20 ? 'Cần kỹ năng 20+' : true, run: function (l, r, log) { compete(l, id, log); } });
        if (l.age >= 16) out.push({ k: 'gig', l: 'Biểu diễn có thù lao (sự kiện, quán, đám cưới)', why: a.gigAt === l.age ? 'Đã nhận show năm nay' : (a.sk || 0) < 45 ? 'Cần kỹ năng 45+' : true, run: function (l, r, log) { a.gigAt = l.age; var pay = l.base * (0.03 + a.sk / 1000) * gdpK(l); H.cash(l, pay, 'Thù lao biểu diễn ' + A.n); H.fx(l, { hap: 3 }); log('Bạn biểu diễn ' + A.n + ', nhận ' + mo(l, pay) + '.', 'good'); } });
        if (l.age >= 18) out.push({ k: 'teach', l: 'Dạy ' + A.n + ' bán thời gian', why: a.teachAt === l.age ? 'Đã dạy năm nay' : (a.sk || 0) < 60 ? 'Cần kỹ năng 60+' : true, run: function (l, r, log) { a.teachAt = l.age; var pay = l.base * 0.08 * gdpK(l); H.cash(l, pay, 'Thù lao dạy ' + A.n); log('Bạn nhận dạy học viên ' + A.n + ' (' + mo(l, pay) + ').', 'good'); } });
        if (l.age >= 18 && (a.sk || 0) >= 65) ['home', 'abroad'].forEach(function (k) { var dest = k === 'home' ? res(l) : ['JP', 'KR', 'US', 'FR', 'DE', 'SG'].filter(function (c) { return c !== res(l); })[Math.floor(u(l.id + ':td:' + l.age) * 5)], q = tourQuote(l, id, dest), need = k === 'abroad' ? (E.GLOBAL919 ? E.GLOBAL919.entry(l.country, dest).kind : 'visa') : 'right';
          out.push({ k: 'tour:' + k, l: 'Ký hợp đồng lưu diễn ' + (k === 'home' ? 'trong nước' : 'tại ' + (W.BY[dest] ? W.BY[dest].name : dest)), h: 'Gộp ~' + mo(l, q.gross) + ' → thực nhận ~' + mo(l, q.gross - q.crew - q.travel - q.agent - q.tax) + (k === 'abroad' ? ' · cần thị thực biểu diễn/lao động (miễn thị thực du lịch không cho phép biểu diễn có thù lao), lệ phí ' + mo(l, l.base * 0.03) : ''), why: s.tours.some(function (t) { return t.status === 'signed'; }) ? 'Đang có tour chờ diễn' : true,
            run: function (l, r, log) { if (k === 'abroad') { H.cash(l, -l.base * 0.03, 'Thị thực nghệ sĩ biểu diễn'); if (u(l.id + ':artvisa:' + l.age) > 0.8) { log('Thị thực nghệ sĩ chưa được cấp kịp; hợp đồng lưu diễn ở nước ngoài bị hoãn.', 'neutral'); return; } } s.tours.push({ id: id, dest: dest, at: l.age, q: q, status: 'signed', visa: need }); log('Ký hợp đồng lưu diễn; diễn trong năm tới.', 'good'); } }); });
      }
      out.push({ k: 'back', l: '← Danh sách môn', run: function (l, r) { X.next(l, 'arts919', r, {}); } });
      return out;
    }
    Object.keys(ART).forEach(function (id) { var A = ART[id], a = s.arts[id]; out.push({ k: 'a:' + id, l: (a ? '' : 'Học thử ') + A.n + (a ? ' · ' + Math.round(a.sk || 0) + '/100' : ''), why: startWhy(l, id), run: function (l, r, log) { if (!a) { var f = fit(l, id); log('Buổi học thử ' + A.n + ': ' + (f >= 1.1 ? 'giáo viên thấy bạn tiếp thu nhanh.' : f >= 0.95 ? 'bạn thấy khá thú vị.' : 'bạn chưa thấy hứng thú lắm — có thể chọn môn khác.'), 'neutral'); } X.next(l, 'arts919', r, { id: id }); } }); });
    return out;
  }, 4, 'Bản thân');
  E.HOOKS.year.push(function (l, r, log) { if (!l.alive || !l.flags || !l.flags.arts919) return; artYear(l, log); });
  var mig = E.migrateExt; E.migrateExt = function (l) { if (mig) mig(l); if (l && l.flags && l.flags.arts919 != null && typeof l.flags.arts919 !== 'object') delete l.flags.arts919; };
  E.ARTS919 = { GAMES: GAMES, ART: ART, play: play, rpsRound: rpsRound, known: known, playsLeft: playsLeft, friends: friends, gsk: gsk, artYear: artYear, best: best, exam: exam, compete: compete, tourQuote: tourQuote, costYear: costYear, state: st };
})(globalThis.G);
