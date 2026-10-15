/* Một Đời — v3.8 (tiếp): ca sĩ được mời tham gia show thực tế âm nhạc
   · Anh trai "Say Hi" (ca sĩ nam trẻ, tân binh tiềm năng hoặc đã nổi): Bài nhóm liên quân → Livestage 1 → 2 → 3 → 4 (Dance battle) → Chung kết (Best 5, quán quân)
   · Em xinh "Say Hi" (ca sĩ nữ trẻ): cùng thể thức
   · Anh trai vượt ngàn chông gai (nghệ sĩ nam có tên tuổi, từ 30 tuổi): Đêm Hội ngộ → Công diễn 1 → 5 → Đêm chung kết (Gia tộc Anh tài Toàn năng)
   Mỗi vòng ghép đội ngẫu nhiên với các anh trai / em xinh / anh tài thật của chương trình; có thể bị loại rồi được bình chọn cứu / hồi sinh, hoặc vô địch nếu đủ mạnh.
   Diễn biến hư cấu, chỉ mô phỏng thể thức chương trình. */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function fx(l, o) { H.fx(l, o); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function mo(l, v) { return H.money(l, v); }
  function vnd(l) { return isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  function V(l, tr) { return vnd(l) ? tr : tr / 90 * l.base; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function yr(l) { return l.birthYear + l.age; }
  function jid(l) { return l.job ? E.resolveJob(l.job.id) : ''; }
  function promote(l) { var c = l.job ? E.jobDef(l) : null; if (c && l.job.rank < c.t.length - 1) { l.job.rank++; l.job.yrs = 0; return true; } return false; }
  function shuffle(r, a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function given(l) { var w = String(l.name || '').split(' '); return w[w.length - 1] || 'bạn'; }

  // ---------- thể thức ----------
  var FMT = {
    atsh: { pre: 'anh trai', rounds: [
      { n: 'Bài nhóm liên quân', d: '30 anh trai chia thành hai liên quân, cùng dàn dựng một bài hát mở màn để khán giả làm quen.', cut: 0 },
      { n: 'Livestage 1', d: 'Chia đội 5 người, mỗi đội dàn dựng một tiết mục. Khán giả trường quay bình chọn, nhóm cuối bảng có nguy cơ dừng chân.', cut: 0.5 },
      { n: 'Livestage 2', d: 'Tích điểm cá nhân để giành quyền chọn đồng đội, rồi thi đấu theo đề bài mới.', cut: 0.58 },
      { n: 'Livestage 3', d: 'Hai liên quân, mỗi bên 3 ca khúc mới phải kết nối thành một EP. Đề bài khó hơn hẳn.', cut: 0.63 },
      { n: 'Livestage 4 — Dance battle', d: 'Vòng đối đầu vũ đạo: mỗi đội làm việc với một biên đạo, ai nhảy yếu sẽ lộ ngay trên sân khấu.', cut: 0.68, dance: true },
      { n: 'Chung kết', d: 'Đêm chung kết trực tiếp: chọn ra nhóm "Best 5" và quán quân bằng bình chọn của khán giả.', final: true }] },
    atvncg: { pre: 'anh tài', rounds: [
      { n: 'Đêm Hội ngộ', d: 'Các anh tài lần lượt trình diễn sở trường, được chia vào các "nhà" — những người anh em sẽ cùng nhau vượt chông gai.', cut: 0 },
      { n: 'Công diễn 1', d: 'Mỗi nhà dàn dựng một tiết mục: hát, nhảy, chơi nhạc cụ, võ thuật… khán giả trường quay chấm điểm.', cut: 0.48 },
      { n: 'Công diễn 2', d: 'Các nhà được xáo lại, thi đấu đối đầu theo cặp. Nhà thua có nguy cơ mất người.', cut: 0.55 },
      { n: 'Công diễn 3', d: 'Mỗi nhà sản xuất một ca khúc mới, thi đấu truy kích vòng tròn rồi kết hợp thành liên minh.', cut: 0.6 },
      { n: 'Công diễn 4', d: 'Tiết mục kết hợp cùng khách mời đặc biệt, đòi hỏi cả thể lực lẫn tinh thần đồng đội.', cut: 0.64 },
      { n: 'Công diễn 5', d: 'Vòng cuối trước chung kết — chỉ những anh tài bền bỉ nhất được ở lại.', cut: 0.68 },
      { n: 'Đêm chung kết', d: 'Đêm chung kết chọn ra các thành viên "Gia tộc Anh tài Toàn năng".', final: true }] }
  };
  FMT.exsh = { pre: 'em xinh', rounds: FMT.atsh.rounds.map(function (x) { var y = {}; for (var k in x) y[k] = x[k]; y.d = y.d.replace(/anh trai/g, 'em xinh'); return y; }) };
  function season(l, k) {
    var y = yr(l);
    if (k === 'atsh') return 'Anh trai "Say Hi" mùa ' + Math.max(1, y - 2023);
    if (k === 'exsh') return 'Em xinh "Say Hi" mùa ' + Math.max(1, y - 2024);
    return 'Anh trai vượt ngàn chông gai ' + y;
  }
  // bạn diễn: nghệ sĩ thật của chương trình cùng vũ trụ
  function pool(k) {
    var S = E.SHOWS || [];
    var ids = k === 'atsh' ? ['atsh1', 'atsh2', 'thsh'] : k === 'exsh' ? ['exsh'] : ['atvncg24', 'atvncg26'];
    var all = []; S.forEach(function (s) { if (ids.indexOf(s.k) >= 0) s.m.forEach(function (m) { if (all.indexOf(m) < 0) all.push(m); }); });
    return all.length ? all : ['nghệ sĩ khách mời'];
  }
  function team(l, r, n) { var T = l.flags.tv; return shuffle(r, pool(T.k)).slice(0, n).map(function (m) { return FMT[T.k].pre + ' ' + m; }); }
  function base(l) { return Math.min(1, (l.skill || 40) / 100) * 0.55 + Math.min(0.3, Math.log10((l.fame || 0) + 10) / 22) + (l.st.hea >= 60 ? 0.05 : 0); }

  // ---------- lời mời ----------
  function canATSH(l) { return l.sex === 'M' && l.age >= 18 && l.age <= 35 && /^(ca_si|rapper|nhac_si)$/.test(jid(l)) && ((l.fame || 0) > 2e4 || (l.job && l.job.rank >= 1)); }
  function canEXSH(l) { return l.sex === 'F' && l.age >= 18 && l.age <= 33 && /^(ca_si|rapper|nhac_si)$/.test(jid(l)) && ((l.fame || 0) > 2e4 || (l.job && l.job.rank >= 1)); }
  function canATV(l) { return l.sex === 'M' && l.age >= 30 && l.age <= 55 && /^(ca_si|rapper|nhac_si|dien_vien|mc_tv|dv_hai|dao_dien|vdv|hlv_tt|youtuber|streamer)$/.test(jid(l)) && (l.fame || 0) > 6e4; }
  SC('tv_moi', {
    title: 'Lời mời tham gia chương trình',
    valid: function (l) { return isVN(l) && !l.flags.tv && (canATSH(l) || canEXSH(l) || canATV(l)); },
    prep: function (l, r) { var k = canATV(l) && (!canATSH(l) || ch(r, 0.5)) ? 'atvncg' : canEXSH(l) ? 'exsh' : 'atsh'; return { k: k, s: season(l, k) }; },
    text: function (l, d) { return 'Nhà sản xuất mời bạn tham gia ' + d.s + ' — ' + (d.k === 'atvncg' ? 'chương trình quy tụ những nghệ sĩ nam đa tài, nhiều tuổi nghề. Sẽ có hát, nhảy, nhạc cụ, võ thuật, thử thách thể lực.' : 'chương trình thực tế âm nhạc hot nhất, quy tụ ' + (d.k === 'exsh' ? 'các nữ nghệ sĩ trẻ' : 'các nam nghệ sĩ trẻ') + '. Khán giả bình chọn quyết định ai ở lại.') + ' Tham gia thì kín lịch mấy tháng, áp lực lớn, nhưng có thể đổi đời.'; },
    opts: [
      { k: 'nhan', l: 'Nhận lời', ai: { w: 1.3, amb: 1 }, run: function (l, r, log, d) { l.flags.tv = { k: d.k, s: d.s, i: 0, pts: 0, y: yr(l), saved: 0 }; log('Nhận lời tham gia ' + d.s + '!', 'big'); l.fame = (l.fame || 0) + 2e4; l.pending.unshift(E.DEC.tv_vong.make(l, r)); } },
      { k: 'tu_choi', l: 'Từ chối, tập trung làm nhạc', ai: { w: 0.5 }, run: function (l, r, log, d) { l.flags.tv = { k: d.k, s: d.s, no: true }; log('Từ chối lời mời ' + d.s + ', tập trung vào dự án riêng.', 'neutral'); } }
    ]
  });
  E.TRIG.push({ id: 'tv_moi', when: function (l, a) { return free(l) && isVN(l) && !l.flags.tv && (canATSH(l) || canEXSH(l) || canATV(l)); }, p: 0.18, cd: 2, max: 2 });
  E.MAJOR && (E.MAJOR.tv_moi = 1);

  // ---------- từng vòng ----------
  SC('tv_vong', {
    title: function (l) { var T = l.flags.tv, R0 = FMT[T.k].rounds[T.i]; return T.s + ' · ' + R0.n; },
    valid: function (l) { return !!(l.flags.tv && !l.flags.tv.no && !l.flags.tv.out && !l.flags.tv.done); },
    prep: function (l, r) { var T = l.flags.tv, R0 = FMT[T.k].rounds[T.i]; return { m: team(l, r, R0.final ? 4 : 4), lead: ch(r, 0.25) }; },
    text: function (l) {
      var T = l.flags.tv, R0 = FMT[T.k].rounds[T.i], d = arguments[1];
      return R0.d + (R0.final ? ' Bạn bước vào chung kết cùng ' : ' Bạn được ghép ' + (T.k === 'atvncg' ? 'nhà' : 'đội') + ' với ') + d.m.join(', ') + '.' + (d.lead ? ' Bạn được bầu làm đội trưởng.' : '') + (R0.dance && T.dance ? ' Mấy tuần tập nhảy ngày đêm vừa qua sắp được đền đáp.' : '');
    },
    opts: [
      { k: 'ganh', l: function (l) { var R0 = FMT[l.flags.tv.k].rounds[l.flags.tv.i]; return R0.dance ? 'Nhận vị trí center, nhảy hết sức' : R0.final ? 'Dốc toàn lực cho tiết mục cuối cùng' : 'Nhận phần khó nhất, "gánh" cả đội'; }, ai: { w: 1, amb: 1, risk: 0.5 }, run: function (l, r, log, d) { perform(l, r, log, d, 0.12, 0.22); } },
      { k: 'an_toan', l: 'Chọn phần sở trường, diễn chắc chắn', ai: { w: 1.1 }, run: function (l, r, log, d) { perform(l, r, log, d, 0.05, 0.1); } },
      { k: 'sang_tao', l: function (l) { return l.flags.tv.k === 'atvncg' ? 'Thử thách bản thân: học nhạc cụ / võ thuật mới cho tiết mục' : 'Đề xuất bản phối, ý tưởng sân khấu mới lạ'; }, ai: { w: 0.8, smart: 0.6 }, run: function (l, r, log, d) { perform(l, r, log, d, 0.15, 0.32); } }
    ]
  });
  function perform(l, r, log, d, bonus, spread) {
    var T = l.flags.tv, R0 = FMT[T.k].rounds[T.i];
    var p = base(l) + bonus + (r() - 0.5) * spread * 2 + (r() - 0.5) * 0.2 + (d.lead ? 0.03 : 0) + (R0.dance ? (T.dance ? 0.12 : -0.08) : 0);
    T.pts += p; T.last = p; l.skill = Math.min(100, (l.skill || 40) + 2);
    var mate = pick(r, d.m);
    if (R0.final) return finale(l, r, log);
    var good = p >= (R0.cut || 0) + 0.18;
    log(R0.n + ' (' + T.s + '): ' + (good ? pick(r, ['tiết mục của đội bùng nổ, khán giả đứng dậy vỗ tay, bạn lọt top bình chọn cá nhân.', 'bạn và ' + mate + ' có màn song ca được cắt clip lan truyền khắp mạng xã hội.', 'phần trình diễn của bạn được giám khảo khen "đẳng cấp".']) : p >= (R0.cut || 0) ? pick(r, ['đội diễn ổn, bạn an toàn đi tiếp.', 'tiết mục tròn trịa, chưa thật sự nổi bật.', mate + ' quên lời nhưng cả đội vẫn gỡ lại được.']) : pick(r, R0.dance ? ['bạn lệch nhịp ở đoạn cao trào, cả đội phải nhảy bù.', 'bạn quên vũ đạo giữa sân khấu, đứng hình mất mấy giây.'] : ['bạn hụt hơi ở nốt cao, điểm bình chọn tụt hẳn.', 'đội bất đồng ý tưởng đến phút chót, tiết mục rời rạc.', 'bạn quên lời ở đoạn điệp khúc, điểm bình chọn tụt hẳn.'])), good ? 'good' : p >= (R0.cut || 0) ? 'neutral' : 'bad');
    l.fame = (l.fame || 0) * (good ? 1.25 : 1.08) + (good ? 3e4 : 8e3);
    if (good) fx(l, { hap: 4 }); if (l.mind) l.mind.stress = Math.min(100, l.mind.stress + 4);
    if (R0.cut && p < R0.cut) { l.pending.unshift(E.DEC.tv_loai.make(l, r)); return; }
    next(l, r);
  }
  function next(l, r) {
    var T = l.flags.tv; T.i++;
    var R1 = FMT[T.k].rounds[T.i];
    if (R1 && R1.dance) { l.pending.unshift(E.DEC.tv_tap_nhay.make(l, r)); return; }
    if (R1) l.pending.unshift(E.DEC.tv_vong.make(l, r));
  }
  SC('tv_tap_nhay', {
    title: 'Trước vòng Dance battle', valid: function (l) { return !!(l.flags.tv && !l.flags.tv.out && !l.flags.tv.done); },
    text: function (l) { return 'Vòng tới là Dance battle. Biên đạo giao bài nhảy khó, cả đội chỉ có ba tuần.' + ((l.skill || 40) < 50 ? ' Bạn vốn không phải người nhảy giỏi.' : ''); },
    opts: [
      { k: 'tap', l: 'Tập nhảy 10 tiếng mỗi ngày, ở lại phòng tập đến khuya', ai: { w: 1.2, amb: 1 }, run: function (l, r, log) { l.flags.tv.dance = true; fx(l, { hea: -2 }); log('Ba tuần tập nhảy ngày đêm, đầu gối bầm tím nhưng bài nhảy đã thuộc từng nhịp.', 'neutral'); l.pending.unshift(E.DEC.tv_vong.make(l, r)); } },
      { k: 'vua', l: 'Tập vừa phải, giữ sức cho giọng hát', ai: { w: 0.8 }, run: function (l, r, log) { log('Tập vừa phải, giữ giọng. Hi vọng phần hát bù được phần nhảy.', 'neutral'); l.pending.unshift(E.DEC.tv_vong.make(l, r)); } }
    ]
  });
  // bị loại → được bình chọn cứu / hồi sinh
  SC('tv_loai', {
    title: function (l) { return 'Nguy cơ dừng chân · ' + l.flags.tv.s; }, valid: function (l) { return !!(l.flags.tv && !l.flags.tv.out); },
    text: function (l) { var T = l.flags.tv; return 'Kết quả ' + FMT[T.k].rounds[T.i].n + ': bạn nằm trong nhóm có điểm thấp nhất, có nguy cơ dừng chân. ' + (T.k === 'atvncg' ? 'Theo luật hồi sinh, các anh tài còn lại sẽ bỏ phiếu chọn người được quay lại.' : 'Cổng bình chọn trực tuyến vẫn mở — anh trai dẫn đầu bình chọn có thể được cứu.') + (T.saved ? ' Bạn đã từng được cứu một lần.' : ''); },
    opts: [
      { k: 'fan', l: function (l) { return l.flags.tv.k === 'atvncg' ? 'Hi vọng vào lá phiếu của các anh tài' : 'Kêu gọi fan bình chọn cứu'; }, ai: { w: 1.2 }, run: function (l, r, log) {
        var T = l.flags.tv, pr = T.saved ? 0.15 : T.k === 'atvncg' ? 0.25 + l.st.soc / 300 : 0.15 + Math.min(0.4, Math.log10((l.fame || 0) + 10) / 15);
        if (ch(r, pr)) { T.saved++; log(T.k === 'atvncg' ? 'Các anh tài bỏ phiếu hồi sinh bạn! Ôm nhau khóc giữa sân khấu, bạn trở lại "nhà" cũ.' : 'Fandom cày bình chọn suốt đêm — bạn được cứu ở phút chót! Cả trường quay vỡ òa.', 'big'); fx(l, { hap: 10 }); H.mem(l, 'Khoảnh khắc được ' + (T.k === 'atvncg' ? 'các anh em hồi sinh' : 'fan bình chọn cứu') + ' ở ' + T.s + '.', 7); l.fame = (l.fame || 0) * 1.3; next(l, r); }
        else out(l, log); } },
      { k: 'chap_nhan', l: 'Chấp nhận dừng chân, cảm ơn khán giả', ai: { w: 0.6 }, run: function (l, r, log) { out(l, log); } }
    ]
  });
  function out(l, log) {
    var T = l.flags.tv; T.out = true; T.done = true;
    var at = FMT[T.k].rounds[T.i].n;
    log('Dừng chân ở ' + at + ' — ' + T.s + '. Dù không đi tiếp, khán giả đã nhớ tên bạn.', 'neutral');
    l.fame = (l.fame || 0) * 1.4 + 5e4; fx(l, { hap: -4 });
    if (T.i >= 3 && promote(l)) log('Sau chương trình, lời mời biểu diễn tăng hẳn: bạn trở thành ' + E.jobTitle(l) + '.', 'good');
    H.mem(l, 'Hành trình ở ' + T.s + ' — dừng chân ở ' + at + '.', 5);
  }
  function finale(l, r, log) {
    var T = l.flags.tv, avg = T.pts / (T.i + 1) + (T.saved ? -0.05 : 0) + Math.min(0.15, Math.log10((l.fame || 0) + 10) / 50);
    T.done = true;
    if (T.k === 'atvncg') {
      if ((avg >= 0.8 && ch(r, 0.75)) || ch(r, 0.25)) { T.res = 'giatoc'; log('Đêm chung kết ' + T.s + ': bạn được gọi tên vào "Gia tộc Anh tài Toàn năng"! Các anh tài ôm chầm lấy nhau.', 'big'); l.fame = (l.fame || 0) * 2 + 2e5; promote(l); H.mem(l, 'Đêm được gọi tên vào Gia tộc Anh tài Toàn năng.', 8); }
      else { T.res = 'final'; log('Đêm chung kết ' + T.s + ': bạn không có tên trong Gia tộc Anh tài Toàn năng, nhưng ra về cùng những người anh em và sự yêu mến của khán giả.', 'good'); l.fame = (l.fame || 0) * 1.5 + 8e4; }
      fx(l, { hap: 10 }); H.cash(l, V(l, 200), 'Cát-xê chương trình, show diễn sau chung kết'); return;
    }
    var win = avg >= 0.9 && ch(r, 0.22 + (avg - 0.9) * 2.5), best = win || (avg >= 0.84 && ch(r, 0.6)) || ch(r, 0.08);
    if (win) { T.res = 'win'; log('QUÁN QUÂN ' + T.s.toUpperCase() + '! Pháo hoa rực trời, cả nước gọi tên ' + FMT[T.k].pre + ' ' + given(l) + '.', 'big'); l.fame = (l.fame || 0) * 3 + 1e6; promote(l); promote(l); H.cash(l, V(l, 1000), 'Giải quán quân và hợp đồng sau chương trình'); H.mem(l, 'Đêm đăng quang quán quân ' + T.s + ', tay run run cầm cúp.', 10); fx(l, { hap: 20 }); }
    else if (best) { T.res = 'best5'; log('Chung kết ' + T.s + ': bạn lọt vào nhóm "Best 5" — sẽ ra mắt nhóm nhạc và đi tour cùng các ' + FMT[T.k].pre + ' khác.', 'big'); l.fame = (l.fame || 0) * 2 + 3e5; promote(l); H.cash(l, V(l, 400), 'Hợp đồng nhóm Best 5'); H.mem(l, 'Ngày được gọi tên vào Best 5 ' + T.s + '.', 8); fx(l, { hap: 14 }); }
    else { T.res = 'final'; log('Chung kết ' + T.s + ': không vào Best 5, nhưng bạn đã đi đến chặng cuối và có cả một cộng đồng fan.', 'good'); l.fame = (l.fame || 0) * 1.6 + 1e5; promote(l); fx(l, { hap: 8 }); }
  }
  E.TV_FMT = FMT;
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
