/* Một Đời — 9.11.0: nhiều lựa chọn hơn ở mọi độ tuổi (tuổi thơ, trung niên, tuổi già).
   · Không thêm hệ thống mới: dùng E.SC, E.TRIG, H.sched, H.mem, H.fx. Engine chỉ thêm "nhịp năm trống": năm nào chưa có chuyện cần quyết thì có cơ hội gặp một tình huống thuộc nhóm T.quiet.
   · Mỗi tình huống có 2 giai đoạn: lựa chọn ban đầu → hệ quả thật sự đến vài năm sau (id + "_f"), phụ thuộc lựa chọn, tuổi, sức khỏe, quan hệ, tiền.
   · Ký ức xuyên đời: l.flags.q9110[id] = { a: tuổi, tag } để chuyện sau nhắc lại chuyện trước. Bản lưu cũ không có khóa này vẫn chạy bình thường.
   · Kết quả chỉ phụ thuộc hoàn cảnh (chỉ số, quan hệ, tiền, tuổi), không gán tính cách theo giàu nghèo, tôn giáo, nghề hay ngoại hình. */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E && E.H, SC = E && E.SC;
  if (!E || !H || !SC) return;
  function fl(l) { return l.flags || (l.flags = {}); }
  function Q(l) { var f = fl(l); return f.q9110 && typeof f.q9110 === 'object' ? f.q9110 : (f.q9110 = {}); }
  function free(l) { return l.alive !== false && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped); }
  function stress(l, n) { if (l.mind) l.mind.stress = U.clamp((l.mind.stress || 0) + n, 0, 100); }
  function st(l, k) { return (l.st && l.st[k]) || 0; }
  function val(x, l, d) { return typeof x === 'function' ? x(l, d) : x; }
  function parentAlive(l) { var f = l.fam || {}; return !!(f.mAlive || (f.fAlive && !f.noDad)); }
  function carer(l) { var f = l.fam || {}; return f.mAlive ? 'mẹ' : f.fAlive && !f.noDad ? 'bố' : 'người nuôi dưỡng'; }
  function apply(l, r, log, res) {
    if (!res) return;
    if (res.fx) H.fx(l, res.fx);
    if (res.stress) stress(l, res.stress);
    if (res.t) log(res.t, res.tone || 'neutral');
    if (res.mem) H.mem(l, res.mem, res.w || 2);
  }
  var ALL = [];
  // QT(id, cfg): cfg.opts[].res(l, r, d) -> { t, tone, fx, stress, mem, tag, next:[min,max] }
  function QT(id, cfg) {
    ALL.push(id);
    SC(id, {
      title: cfg.title, text: cfg.text, tone: cfg.tone || '',
      valid: function (l) { return free(l) && (!cfg.valid || cfg.valid(l)); },
      opts: cfg.opts.map(function (o) {
        return { k: o.k, l: o.l, h: o.h, req: o.req, ai: o.ai || { w: 1 }, run: function (l, r, log, d) {
          var res = o.res(l, r, d || {});
          if (o.risk && r() < o.risk.p) res = { t: o.risk.t, tone: 'bad', fx: o.risk.fx, stress: o.risk.stress, mem: o.risk.mem, tag: res && res.tag, next: res && res.next };
          apply(l, r, log, res);
          Q(l)[id] = { a: l.age, tag: res && res.tag || null };
          if (res && res.tag && res.next && cfg.follow && cfg.follow[res.tag]) H.sched(l, id + '_f', res.next[0] + Math.floor(r() * (res.next[1] - res.next[0] + 1)), { tag: res.tag, a0: l.age });
        } };
      })
    });
    if (cfg.follow) {
      var tags = Object.keys(cfg.follow), fo = [];
      tags.forEach(function (tg) {
        cfg.follow[tg].opts.forEach(function (o) {
          fo.push({ k: tg + '_' + o.k, l: o.l, h: o.h, ai: o.ai || { w: 1 }, req: function (l, d) { return !!d && d.tag === tg; },
            run: function (l, r, log, d) { var res = o.res(l, r, d || {}); apply(l, r, log, res); var q = Q(l); (q[id] || (q[id] = { a: d.a0 })).end = { a: l.age, k: o.k }; } });
        });
      });
      SC(id + '_f', {
        title: function (l, d) { return cfg.follow[d.tag].title; },
        text: function (l, d) { var n = Math.max(0, l.age - (d.a0 == null ? l.age : d.a0)); return (n > 0 ? 'Chuyện ấy đã qua ' + n + ' năm. ' : '') + val(cfg.follow[d.tag].text, l, d); },
        valid: function (l, d) { return free(l) && !!d && !!cfg.follow[d.tag]; },
        opts: fo
      });
    }
    E.TRIG.push({ id: id, quiet: true, child: !!cfg.child, cw: cfg.cw || (cfg.child ? 4 : 1.5), p: cfg.p || 0.03, cd: cfg.a0 >= 20 ? 8 : 99, max: cfg.a0 >= 20 ? 2 : 1,
      when: function (l, a) { return a >= cfg.a0 && a <= cfg.a1 && free(l) && (!cfg.when || cfg.when(l, a)); } });
  }
  function ch(p) { return Math.max(0.05, Math.min(0.95, p)); }
  function UP(s) { return s.replace(/^./, function (c) { return c.toUpperCase(); }); }

  // ======================= TUỔI THƠ (5–16) =======================
  QT('q91_bully', { a0: 6, a1: 15, child: true, title: 'Bạn cùng lớp bị trêu chọc',
    text: function (l) { return 'Trong lớp có một bạn bị cả nhóm trêu chọc dai dẳng' + (st(l, 'soc') < 40 ? ', và bạn cũng từng bị như vậy nên hiểu cảm giác ấy' : '') + '. Hôm nay chuyện đi xa hơn một chút: đồ của bạn ấy bị giấu, cả lớp cười.'; },
    opts: [
      { k: 'help', l: 'Đứng ra bênh bạn', h: 'Có thể được nể, cũng có thể bị lôi vào.', ai: { w: 1.2 }, res: function (l, r) {
        return r() < ch(0.45 + st(l, 'soc') / 250) ? { t: 'Bạn lên tiếng, vài đứa im bặt. Bạn kia nhìn bạn rất lâu rồi khẽ gật đầu.', tone: 'good', fx: { soc: 2, hap: 1 }, tag: 'ally', next: [1, 2], mem: 'Lần đứng ra bênh một bạn bị trêu trong lớp.' }
          : { t: 'Bạn lên tiếng nhưng nhóm kia quay sang trêu cả bạn. Mấy hôm sau bạn ăn trưa một mình.', tone: 'bad', fx: { soc: -2, hap: -2 }, stress: 3, tag: 'target', next: [1, 2], mem: 'Bênh bạn rồi bị cô lập một thời gian.' }; } },
      { k: 'tell', l: 'Kể với thầy cô hoặc người lớn', h: 'Kết quả phụ thuộc người lớn có xử lý đến nơi không.', res: function (l, r) {
        return r() < 0.62 ? { t: 'Thầy cô nói chuyện với cả lớp và gặp riêng nhóm kia. Mọi chuyện dịu đi thấy rõ.', tone: 'good', fx: { kno: 1 }, tag: 'adult', next: [1, 2] }
          : { t: 'Người lớn bảo "trẻ con đùa thôi". Chuyện không đổi, còn bạn bị gọi là mách lẻo.', tone: 'bad', fx: { soc: -1, hap: -1 }, tag: 'ignored', next: [1, 2] }; } },
      { k: 'quiet', risk: { p: 0.35, t: 'Bạn kia thấy bạn đứng nhìn và quay đi. Cả hai đều biết điều đó và bầu không khí giữa hai bạn nguội hẳn.', fx: { hap: -2, soc: -1 }, stress: 3 }, l: 'Im lặng, tránh xa cho yên', h: 'An toàn trước mắt, nhưng bạn sẽ nhớ.', ai: { w: 1.1 }, res: function () { return { t: 'Bạn cúi đầu làm bài. Cả buổi chiều bạn không dám nhìn về phía cuối lớp.', tone: 'neutral', fx: { hap: -1 }, stress: 2, tag: 'silent', next: [1, 3] }; } },
      { k: 'invite', l: 'Rủ bạn ấy chơi cùng nhóm của mình', h: 'Nhẹ nhàng hơn đối đầu.', res: function (l, r) {
        return r() < 0.7 ? { t: 'Giờ ra chơi bạn rủ bạn ấy đá cầu chung. Ban đầu ngượng, sau đó cười được.', tone: 'good', fx: { soc: 2, hap: 1 }, tag: 'ally', next: [1, 2] }
          : { t: 'Nhóm của bạn không thoải mái nên bạn ấy tự rút lui. Bạn thấy áy náy.', tone: 'neutral', fx: { hap: -1 }, tag: 'silent', next: [1, 3] }; } }
    ],
    follow: {
      ally: { title: 'Người bạn từ chuyện cũ', text: 'Bạn ấy giờ hay ngồi cạnh bạn, và có lần nhờ bạn kèm môn mình yếu.',
        opts: [ { k: 'keep', l: 'Giữ liên lạc, giúp bạn học', res: function () { return { t: 'Hai đứa thành bạn thân. Bạn học được cách giảng bài cho người khác.', tone: 'good', fx: { kno: 2, soc: 2 }, mem: 'Một người bạn thân bắt đầu từ lần bênh vực trong lớp.' }; } },
                { k: 'drift', l: 'Chỉ giữ ở mức bạn cùng lớp', res: function () { return { t: 'Hai đứa vẫn chào nhau mỗi ngày, nhưng không thân thêm.', tone: 'neutral' }; } } ] },
      target: { title: 'Bị cô lập', text: 'Nhóm kia vẫn chưa buông tha bạn. Bạn mệt mỏi mỗi sáng đến lớp.',
        opts: [ { k: 'tell', l: 'Nói hết với người lớn trong nhà', res: function (l, r) { return r() < 0.75 ? { t: 'Người lớn đến gặp cô chủ nhiệm. Chỗ ngồi của bạn được đổi, chuyện bớt hẳn.', tone: 'good', fx: { hap: 2 }, stress: -3 } : { t: 'Người lớn khuyên bạn "nhịn đi". Bạn thôi nói thêm.', tone: 'bad', stress: 2 }; } },
                { k: 'find', l: 'Tìm nhóm bạn khác ở câu lạc bộ', res: function () { return { t: 'Bạn kết bạn với những đứa mới quen ở lớp ngoại khóa và bắt đầu thấy dễ thở hơn.', tone: 'good', fx: { soc: 1, hap: 1 } }; } } ] },
      adult: { title: 'Sau khi thầy cô can thiệp', text: 'Không khí lớp khác đi, nhưng vài bạn vẫn lườm bạn vì "đi mách".',
        opts: [ { k: 'fine', l: 'Mặc kệ, vẫn chơi với những bạn tử tế', res: function () { return { t: 'Mọi thứ dần bình thường. Bạn biết rằng nói ra cũng có ích.', tone: 'good', fx: { hap: 1, kno: 1 } }; } },
                { k: 'apol', l: 'Nói chuyện thẳng với một bạn trong nhóm kia', res: function (l, r) { return r() < 0.6 ? { t: 'Bạn kia ngượng ngùng xin lỗi bạn ấy.', tone: 'good', fx: { soc: 1 } } : { t: 'Cuộc nói chuyện kết thúc cụt ngủn. Bạn rút ra là có người chưa sẵn sàng.', tone: 'neutral' }; } } ] },
      ignored: { title: 'Chuyện vẫn chưa xong', text: 'Người lớn chưa làm gì, và lớp vẫn giống cũ.',
        opts: [ { k: 'again', l: 'Thử kể lại với người lớn khác', res: function (l, r) { return r() < 0.6 ? { t: 'Lần này có người nghe nghiêm túc, chuyện được xử lý.', tone: 'good', fx: { hap: 1 } } : { t: 'Vẫn chưa có gì thay đổi. Bạn học cách tự bảo vệ mình trước.', tone: 'neutral', fx: { kno: 1 } }; } },
                { k: 'stay', l: 'Thôi, ráng chịu đến hết năm', res: function () { return { t: 'Hết năm, lớp xáo trộn và chuyện cũng lắng xuống. Bạn vẫn nhớ cảm giác ấy.', tone: 'neutral', stress: 2 }; } } ] },
      silent: { title: 'Điều bạn chưa nói', text: 'Bạn vẫn nghĩ đến lần mình đứng im. Bạn kia dạo này ít nói hơn hẳn.',
        opts: [ { k: 'sorry', l: 'Đến nói chuyện, xin lỗi vì đã đứng ngoài', res: function (l, r) { return r() < 0.7 ? { t: 'Bạn ấy bảo "không sao, cảm ơn vì đã nói". Cả hai nhẹ lòng.', tone: 'good', fx: { hap: 2, soc: 1 }, stress: -2 } : { t: 'Bạn ấy chỉ gật đầu, chưa muốn nói thêm. Bạn hiểu mình cần thời gian.', tone: 'neutral' }; } },
                { k: 'avoid', l: 'Tiếp tục tránh mặt', res: function () { return { t: 'Chuyện cũ qua đi trong im lặng. Bạn vẫn nhớ nó rất lâu sau này.', tone: 'neutral', stress: 1, mem: 'Từng im lặng khi một bạn bị trêu và vẫn còn day dứt.' }; } } ] }
    } });

  QT('q91_pocket', { a0: 6, a1: 13, child: true, title: 'Món tiền nhỏ của riêng mình',
    text: 'Dịp lễ bạn được mừng một khoản nhỏ, lần đầu thật sự thuộc về mình. Trong đầu bạn có ba thứ cùng lúc: món đồ ao ước, một bạn đang gặp khó, và ý nghĩ để dành.',
    opts: [
      { k: 'save', l: 'Bỏ ống heo, để dành', h: 'Chậm nhưng có thứ để mừng sau này.', res: function () { return { t: 'Bạn nhét tiền vào ống heo và nhẩm xem bao lâu thì mua được thứ mình thích.', tone: 'good', fx: { kno: 1 }, tag: 'saved', next: [1, 2] }; } },
      { k: 'spend', l: 'Mua ngay thứ mình thích', h: 'Vui ngay, hết ngay.', ai: { w: 1.3 }, res: function () { return { t: 'Bạn mua món đồ ao ước. Hai tuần sau đã chán, nhưng ít nhất bạn biết mình thích gì.', tone: 'neutral', fx: { hap: 2 }, tag: 'spent', next: [1, 2] }; } },
      { k: 'share', l: 'Góp cho bạn đang cần', h: 'Giúp được người khác, nhưng không lấy lại.', res: function () { return { t: 'Bạn đưa tiền cho bạn kia mua vở. Bạn ấy cảm ơn mãi.', tone: 'good', fx: { soc: 2, hap: 1 }, tag: 'shared', next: [1, 3] }; } },
      { k: 'lend', l: 'Cho bạn mượn, hẹn trả', h: 'Có khi được trả, có khi không.', res: function () { return { t: 'Bạn cho mượn và ghi vào cuốn sổ nhỏ.', tone: 'neutral', tag: 'lent', next: [1, 2] }; } }
    ],
    follow: {
      saved: { title: 'Ống heo đầy', text: 'Ống heo giờ nặng tay. Bạn nhìn thấy một thứ còn muốn hơn món cũ.',
        opts: [ { k: 'buy', l: 'Mua món đồ mình đã dành dụm', res: function () { return { t: 'Món đồ mua bằng tiền tự để dành làm bạn quý nó hơn hẳn.', tone: 'good', fx: { hap: 3 }, mem: 'Lần đầu mua được thứ gì đó bằng tiền tự để dành.' }; } },
                { k: 'more', l: 'Để dành thêm, chưa vội', res: function () { return { t: 'Bạn kiên nhẫn hơn nhiều bạn cùng tuổi, nhưng đôi khi cũng tiếc không dám vui.', tone: 'neutral', fx: { kno: 1 } }; } } ] },
      spent: { title: 'Hết tiền đúng lúc cần', text: 'Lớp có đợt góp tiền đi chơi nhưng ống heo của bạn trống trơn.',
        opts: [ { k: 'ask', l: 'Xin người lớn một ít và hứa tự lo lần sau', res: function (l, r) { return r() < 0.7 ? { t: 'Bạn được cho thêm và tự hứa sẽ tính kỹ hơn.', tone: 'neutral', fx: { kno: 1 } } : { t: 'Nhà đang chật vật nên bạn phải bỏ chuyến đi này. Bạn hiểu tiền không phải thứ muốn là có.', tone: 'bad', fx: { hap: -2, kno: 1 } }; } },
                { k: 'skip', l: 'Thôi không đi', res: function () { return { t: 'Bạn ở nhà và hơi buồn, nhưng cũng nhận ra cần giữ lại một phần.', tone: 'neutral', fx: { hap: -1, kno: 1 } }; } } ] },
      shared: { title: 'Người bạn được giúp', text: 'Bạn kia vẫn nhớ khoản tiền năm xưa và muốn đáp lại bằng cách nào đó.',
        opts: [ { k: 'accept', l: 'Nhận lời mời sang nhà chơi', res: function () { return { t: 'Cả buổi chiều hai đứa chơi trò mới. Gia đình bạn ấy tiếp bạn rất ân cần.', tone: 'good', fx: { soc: 2, hap: 2 } }; } },
                { k: 'wave', l: 'Bảo không cần đâu', res: function () { return { t: 'Bạn ấy vẫn để dành cho bạn một món nhỏ. Bạn nhận mà ngại.', tone: 'neutral', fx: { soc: 1 } }; } } ] },
      lent: { title: 'Cuốn sổ ghi nợ', text: 'Đến hẹn mà bạn kia chưa trả, còn tránh mặt bạn.',
        opts: [ { k: 'ask', l: 'Nhắc nhẹ nhàng', res: function (l, r) { return r() < 0.6 ? { t: 'Bạn kia ngượng, trả được một nửa và hứa trả nốt.', tone: 'neutral', fx: { kno: 1 } } : { t: 'Bạn kia nói quên mất. Bạn học được thêm một bài về cho mượn.', tone: 'bad', fx: { hap: -1, kno: 1 } }; } },
                { k: 'forgive', l: 'Bỏ qua, coi như tặng', res: function () { return { t: 'Bạn xóa dòng đó đi. Tình bạn giữ nguyên, nhưng bạn thận trọng hơn.', tone: 'neutral', fx: { soc: 1 } }; } } ] }
    } });

  QT('q91_hobby', { a0: 5, a1: 13, child: true, title: 'Một thứ để mê',
    text: 'Có ba hướng đang mở ra cho bạn: lớp vẽ và thủ công, đội thể thao của trường, và góc đọc sách ở thư viện gần nhà. Người lớn bảo bạn tự chọn một thứ.',
    opts: [
      { k: 'art', l: 'Vẽ và làm thủ công', res: function () { return { t: 'Bạn mê màu sắc đến quên giờ ăn.', tone: 'good', fx: { hap: 2, kno: 1 }, tag: 'art', next: [2, 4] }; } },
      { k: 'sport', l: 'Chơi thể thao', res: function () { return { t: 'Bạn ra sân mỗi chiều, ngã trầy cả đầu gối vẫn cười.', tone: 'good', fx: { hea: 2, soc: 1 }, tag: 'sport', next: [2, 4] }; } },
      { k: 'read', l: 'Đọc sách ở thư viện', res: function () { return { t: 'Bạn đi hết kệ này sang kệ khác, mượn từng chồng sách.', tone: 'good', fx: { kno: 2 }, tag: 'read', next: [2, 4] }; } },
      { k: 'none', l: 'Chưa muốn chọn, cứ chơi tự do', res: function () { return { t: 'Bạn thử đủ thứ rồi chẳng theo thứ nào, nhưng thấy thoải mái.', tone: 'neutral', fx: { hap: 1 } }; } }
    ],
    follow: {
      art: { title: 'Nét vẽ qua mấy năm', text: 'Giờ bạn vẽ khá hơn, có người rủ bạn tham gia một cuộc thi nhỏ.',
        opts: [ { k: 'join', l: 'Tham gia thi', res: function (l, r) { return r() < 0.4 + st(l, 'kno') / 300 ? { t: 'Bài của bạn được treo ở hành lang trường.', tone: 'good', fx: { hap: 3, soc: 2 }, mem: 'Có bức vẽ được treo ở trường.' } : { t: 'Bạn không đạt giải, nhưng được xem bài của nhiều bạn khác và học hỏi.', tone: 'neutral', fx: { kno: 1 } }; } },
                { k: 'private', l: 'Giữ vẽ cho riêng mình', res: function () { return { t: 'Cuốn sổ vẽ dày dần, là góc yên tĩnh của riêng bạn.', tone: 'good', fx: { hap: 2 }, stress: -2 }; } } ] },
      sport: { title: 'Sân chơi và sức bền', text: 'Đội cần người thi đấu giải của trường, nhưng bạn cũng đang bận học.',
        opts: [ { k: 'play', l: 'Nhận thi đấu', res: function (l, r) { return r() < 0.8 ? { t: 'Đội về nhì. Bạn mệt nhưng học được cách thua và thắng cùng người khác.', tone: 'good', fx: { hea: 1, soc: 2 } } : { t: 'Bạn bị thương nhẹ ở trận cuối và phải nghỉ mấy tuần.', tone: 'bad', fx: { hea: -2 } }; } },
                { k: 'balance', l: 'Chỉ tập thôi, không thi', res: function () { return { t: 'Bạn giữ nhịp học đều, vẫn tập vì thấy khỏe người.', tone: 'neutral', fx: { hea: 1, kno: 1 } }; } } ] },
      read: { title: 'Cái kệ sách quen', text: 'Thủ thư cho bạn mượn thêm sách, còn bạn bè thì rủ ra sân chơi.',
        opts: [ { k: 'share', l: 'Kể cho bạn nghe truyện vừa đọc', res: function () { return { t: 'Cả nhóm ngồi nghe bạn kể. Có vài đứa bắt đầu mượn sách theo.', tone: 'good', fx: { soc: 2, kno: 1 } }; } },
                { k: 'solo', l: 'Ở lại đọc cho hết', res: function () { return { t: 'Bạn đọc xong cả bộ, đầu óc đầy hình ảnh nhưng hơi lạc nhịp với bạn bè.', tone: 'neutral', fx: { kno: 2, soc: -1 } }; } } ] }
    } });

  QT('q91_grade', { a0: 7, a1: 16, child: true, title: 'Bài kiểm tra điểm thấp',
    text: 'Bài kiểm tra trả về với điểm thấp hơn mọi lần, và cần chữ ký xác nhận của người lớn trong nhà.',
    opts: [
      { k: 'show', l: 'Đưa bài và nói thật', h: 'Kết quả phụ thuộc cách người lớn phản ứng.', res: function (l, r) { return r() < 0.7 ? { t: 'Cả nhà ngồi xem lại từng câu sai. Bạn hiểu vì sao mình hỏng phần đó.', tone: 'good', fx: { kno: 2 }, tag: 'helped', next: [1, 2] } : { t: 'Bạn bị mắng một trận rồi bị bắt học thêm khuya. Bạn hiểu bài hơn nhưng nặng lòng.', tone: 'bad', fx: { kno: 1, hap: -2 }, stress: 3, tag: 'pressure', next: [1, 2] }; } },
      { k: 'hide', risk: { p: 0.4, t: 'Người lớn tìm ra bài bị giấu trong cặp. Bạn bị mắng nặng vì không nói thật.', fx: { hap: -2 }, stress: 3 }, l: 'Giấu bài, tự sửa', h: 'Tạm yên, nhưng có thể lộ.', ai: { w: 1.1 }, res: function () { return { t: 'Bạn nhét bài vào đáy cặp và học lại một mình.', tone: 'neutral', stress: 2, tag: 'hidden', next: [1, 2] }; } },
      { k: 'teacher', l: 'Hỏi thầy cô vì sao sai', h: 'Mất thời gian nhưng rõ nguyên nhân.', res: function () { return { t: 'Thầy cô chỉ ra bạn hay đọc lướt đề. Bạn ghi lại và đổi cách làm.', tone: 'good', fx: { kno: 2 }, tag: 'helped', next: [1, 2] }; } }
    ],
    follow: {
      helped: { title: 'Điểm đã khá hơn', text: 'Cách học mới bắt đầu có kết quả. Có bạn nhờ bạn chỉ lại cách làm.',
        opts: [ { k: 'teach', l: 'Chỉ lại cho bạn', res: function () { return { t: 'Bạn giảng lại và hiểu bài sâu hơn.', tone: 'good', fx: { kno: 2, soc: 1 } }; } },
                { k: 'own', l: 'Giữ thời gian cho việc của mình', res: function () { return { t: 'Bạn tiếp tục tiến bộ đều.', tone: 'neutral', fx: { kno: 1 } }; } } ] },
      pressure: { title: 'Áp lực học hành', text: 'Mỗi lần có bài kiểm tra bạn lại căng thẳng, tim đập mạnh.',
        opts: [ { k: 'talk', l: 'Nói với người lớn là bạn đang rất áp lực', res: function (l, r) { return r() < 0.65 ? { t: 'Người lớn lắng nghe và giảm bớt giờ học thêm. Bạn bớt nặng nề.', tone: 'good', fx: { hap: 2 }, stress: -4 } : { t: 'Họ bảo "ai cũng vậy". Bạn thôi nói thêm.', tone: 'bad', stress: 2 }; } },
                { k: 'cope', l: 'Tự tìm cách thư giãn', res: function () { return { t: 'Bạn dành mười phút mỗi tối vẽ hoặc chạy bộ quanh nhà cho đầu óc nhẹ đi.', tone: 'neutral', stress: -2, fx: { hap: 1 } }; } } ] },
      hidden: { title: 'Bí mật bị lộ', text: 'Đến kỳ họp phụ huynh, điểm của bạn sắp được thông báo.',
        opts: [ { k: 'confess', l: 'Tự nói trước khi bị hỏi', res: function (l, r) { return r() < 0.75 ? { t: 'Người lớn ngạc nhiên vì bạn tự nói, chỉ nhắc bạn lần sau đừng giấu.', tone: 'good', fx: { kno: 1 }, stress: -2 } : { t: 'Bạn bị trách vì giấu, nhưng ít nhất mọi chuyện đã rõ.', tone: 'neutral', stress: 1 }; } },
                { k: 'wait', l: 'Chờ xem sao', res: function (l, r) { return r() < 0.5 ? { t: 'Không ai hỏi thêm và bạn được thở phào.', tone: 'neutral' } : { t: 'Bị phát hiện giữa buổi họp, bạn xấu hổ vô cùng.', tone: 'bad', fx: { hap: -2 }, stress: 3 }; } } ] }
    } });

  QT('q91_pet', { a0: 5, a1: 14, child: true, title: 'Một con vật nhỏ',
    text: 'Hàng xóm có ổ mèo con cần nhà mới. Bạn nhìn chúng rất lâu, còn người lớn thì hơi do dự về chuyện chăm và chi phí.',
    opts: [
      { k: 'adopt', l: 'Xin nhận nuôi một con và hứa tự chăm', h: 'Có bạn đồng hành, đổi lại có trách nhiệm.', res: function () { return { t: 'Bạn bế con mèo nhỏ về, đặt tên rồi canh nó cả buổi.', tone: 'good', fx: { hap: 3 }, tag: 'cared', next: [2, 4], mem: 'Con mèo đầu tiên của đời mình.' }; } },
      { k: 'visit', l: 'Chỉ ghé chơi mỗi ngày', res: function () { return { t: 'Bạn ghé nhà hàng xóm chơi với chúng mỗi chiều.', tone: 'neutral', fx: { hap: 1, soc: 1 } }; } },
      { k: 'skip', risk: { p: 0.2, t: 'Mấy hôm sau bạn nghe tin cả ổ mèo đã có chủ, chỉ còn bạn đứng ngẩn ngơ nhìn góc sân trống.', fx: { hap: -1 } }, l: 'Thôi, không nuôi', res: function () { return { t: 'Bạn tiếc nhưng hiểu nhà mình chưa đủ điều kiện.', tone: 'neutral' }; } }
    ],
    follow: {
      cared: { title: 'Người bạn bốn chân', text: 'Con mèo đã lớn, nhưng gần đây nó bỏ ăn và cứ nằm một chỗ.',
        opts: [ { k: 'vet', l: 'Xin đưa đi khám', res: function (l, r) { return r() < 0.7 ? { t: 'Bác sĩ thú y cho thuốc, con mèo khỏe lại sau mấy ngày.', tone: 'good', fx: { hap: 2 } } : { t: 'Dù được chăm kỹ, con mèo vẫn yếu dần rồi mất. Bạn khóc rất nhiều, nhưng biết mình đã cố hết sức.', tone: 'bad', fx: { hap: -4 }, stress: 3, mem: 'Mất con mèo đầu tiên, lần đầu hiểu thế nào là mất mát.' }; } },
                { k: 'watch', l: 'Tự chăm theo cách mình biết', res: function (l, r) { return r() < 0.5 ? { t: 'Con mèo tự khỏi dần.', tone: 'good', fx: { hap: 1 } } : { t: 'Bệnh nặng thêm trước khi bạn kịp nhờ người lớn. Bạn rất hối hận.', tone: 'bad', fx: { hap: -4 }, stress: 4 }; } } ] }
    } });

  // ======================= TRƯỞNG THÀNH & TRUNG NIÊN =======================
  QT('q91_neighbor', { a0: 20, a1: 80, title: 'Chuyện với hàng xóm',
    text: function (l) { return 'Nhà bên cạnh ' + ['hay bật nhạc to vào buổi tối', 'để đồ lấn sang lối đi chung', 'có cây rễ chui sang bên nhà bạn'][Math.floor((l.rs || 1) % 3)] + '. Ban đầu bạn nhịn, nhưng chuyện lặp lại khá nhiều lần.'; },
    opts: [
      { k: 'talk', l: 'Gõ cửa nói chuyện thẳng thắn, ôn hòa', res: function (l, r) { return r() < 0.55 + st(l, 'soc') / 400 ? { t: 'Họ không để ý nên xin lỗi và sửa ngay. Hai bên còn hẹn nhau uống trà.', tone: 'good', fx: { soc: 2 }, tag: 'friendly', next: [1, 3] } : { t: 'Họ phật ý, nói chuyện nặng lời. Từ đó hai nhà tránh nhau.', tone: 'bad', fx: { hap: -2 }, stress: 3, tag: 'cold', next: [1, 3] }; } },
      { k: 'mediator', l: 'Nhờ tổ dân phố hoặc ban quản lý góp ý chung', res: function (l, r) { return r() < 0.6 ? { t: 'Ban quản lý nhắc chung nên không ai mất mặt. Mọi thứ dịu lại.', tone: 'neutral', tag: 'formal', next: [1, 3] } : { t: 'Chuyện kéo dài và hai nhà đều khó chịu.', tone: 'bad', stress: 2, tag: 'cold', next: [1, 3] }; } },
      { k: 'ignore', risk: { p: 0.3, t: 'Nhịn mãi cũng đến lúc bạn bật ra một câu nặng lời giữa sân chung. Cả xóm nghe thấy.', fx: { hap: -2, soc: -2 }, stress: 3 }, l: 'Chịu đựng, tìm cách chống ồn hoặc chắn lối', res: function () { return { t: 'Bạn tự xử lý bằng cách lắp thêm vật cản và nút tai. Phiền nhưng tạm yên.', tone: 'neutral', fx: { hap: -1 }, stress: 2, tag: 'tolerate', next: [1, 3] }; } }
    ],
    follow: {
      friendly: { title: 'Láng giềng tử tế', text: 'Nhà bên nhờ bạn trông giùm nhà vài hôm vì có việc đi xa.',
        opts: [ { k: 'yes', l: 'Nhận trông giúp', res: function () { return { t: 'Bạn tưới cây, nhận thư giùm. Họ quay về mang quà quê cảm ơn.', tone: 'good', fx: { soc: 2, hap: 1 }, mem: 'Có người hàng xóm đáng tin.' }; } },
                { k: 'no', l: 'Từ chối vì ngại trách nhiệm', res: function () { return { t: 'Họ nhờ người khác. Quan hệ vẫn ổn, chỉ nhạt đi.', tone: 'neutral' }; } } ] },
      cold: { title: 'Hai nhà lạnh nhạt', text: 'Không ai chào ai khi gặp. Có lúc cần nhờ nhau mà cả hai đều ngần ngại.',
        opts: [ { k: 'olive', l: 'Chủ động chào và nhắn lời giảng hòa', res: function (l, r) { return r() < 0.6 ? { t: 'Họ đáp lại rụt rè, rồi dần dần cởi mở.', tone: 'good', fx: { soc: 1 }, stress: -2 } : { t: 'Họ vẫn chưa sẵn sàng, bạn không ép nữa.', tone: 'neutral' }; } },
                { k: 'distance', l: 'Giữ khoảng cách lịch sự', res: function () { return { t: 'Bạn sống tử tế nhưng không thân thiết thêm.', tone: 'neutral' }; } } ] },
      formal: { title: 'Sau cuộc họp khu phố', text: 'Chuyện cũ được nhắc chung nên đã lắng, nhưng hai nhà vẫn còn hơi ngượng.',
        opts: [ { k: 'greet', l: 'Chủ động chào hỏi cho tự nhiên', res: function () { return { t: 'Bầu không khí dễ chịu dần.', tone: 'good', fx: { soc: 1 } }; } },
                { k: 'leave', l: 'Cứ để mọi chuyện tự nhiên', res: function () { return { t: 'Hai nhà sống bình thường, không thân không ghét.', tone: 'neutral' }; } } ] },
      tolerate: { title: 'Nhịn đến bao giờ', text: 'Bạn nhận ra mình ngủ kém hơn trước và hay cáu vô cớ.',
        opts: [ { k: 'speak', l: 'Giờ mới nói chuyện với họ', res: function (l, r) { return r() < 0.6 ? { t: 'Họ thật sự không biết bạn khó chịu và đã đổi.', tone: 'good', stress: -4, fx: { hap: 2 } } : { t: 'Họ không đổi nhiều, nhưng ít ra bạn đã nói.', tone: 'neutral', stress: -1 }; } },
                { k: 'move', l: 'Cân nhắc đổi chỗ ở khi có dịp', res: function () { return { t: 'Bạn bắt đầu xem nhà khác, dù chưa quyết.', tone: 'neutral' }; } } ] }
    } });

  QT('q91_oldfriend', { a0: 22, a1: 80, title: 'Bạn cũ liên lạc',
    text: function (l) { var h = Q(l).q91_hobby; return 'Một người bạn lâu ngày không gặp nhắn lại, rủ bạn dự buổi họp mặt của nhóm cũ' + (h && h.tag ? ' — người từng cùng bạn mê ' + ({ art: 'vẽ', sport: 'thể thao', read: 'đọc sách' }[h.tag] || 'chơi') + ' ngày nhỏ' : '') + '. Ai cũng đã đổi khác.'; },
    opts: [
      { k: 'go', risk: { p: 0.12, t: 'Giữa buổi họp có người nhắc chuyện cũ làm bạn tổn thương. Bạn ra về sớm, lòng nặng trĩu.', fx: { hap: -2 }, stress: 2 }, l: 'Đi dự buổi họp mặt', res: function (l, r) { return r() < 0.7 ? { t: 'Mọi người ngạc nhiên rồi cười nói rôm rả. Có người hóa ra vẫn nhớ bạn rất rõ.', tone: 'good', fx: { soc: 3, hap: 2 }, tag: 'back', next: [1, 3] } : { t: 'Buổi họp có vài người khoe khoang, bạn thấy xa lạ nhưng vẫn kịp trò chuyện với một người.', tone: 'neutral', fx: { soc: 1 }, tag: 'back', next: [1, 3] }; } },
      { k: 'gift', l: 'Không đi được, gửi lời hỏi thăm và món quà nhỏ', res: function () { return { t: 'Bạn gửi lời chúc. Vài người nhắn lại cảm ơn.', tone: 'neutral', fx: { soc: 1 } }; } },
      { k: 'skip', l: 'Từ chối, giữ nhịp sống hiện tại', res: function () { return { t: 'Bạn nghĩ đến chuyện cũ một lúc rồi quay lại việc của mình.', tone: 'neutral' }; } }
    ],
    follow: { back: { title: 'Người bạn cũ nhờ vả', text: 'Một người bạn cũ nhắn riêng, nhờ bạn giúp một việc không nhỏ (giới thiệu việc làm, chỗ ở tạm, hoặc vay một khoản).',
      opts: [ { k: 'help', l: 'Giúp trong khả năng, nói rõ giới hạn', res: function (l, r) { return r() < 0.7 ? { t: 'Bạn giúp trong khả năng. Việc được giải quyết và quan hệ thêm gần.', tone: 'good', fx: { soc: 2, karma: 1 } } : { t: 'Việc không thành như mong đợi và hai bên hơi ngại, nhưng không ai trách ai.', tone: 'neutral' }; } },
              { k: 'decline', l: 'Từ chối nhẹ nhàng, giải thích hoàn cảnh', res: function () { return { t: 'Bạn nói rõ hoàn cảnh. Người bạn hiểu, dù có hơi tiếc.', tone: 'neutral' }; } } ] } } });

  QT('q91_checkup', { a0: 35, a1: 85, cw: 1.2, title: 'Kết quả khám sức khỏe',
    text: function (l) { return 'Đợt khám định kỳ có một vài chỉ số nằm ngoài mức bình thường' + (l.age >= 60 ? ', điều khá thường gặp ở tuổi ' + l.age : '') + '. Bác sĩ dặn nên tái khám và điều chỉnh sinh hoạt, nhưng chưa phải chuyện khẩn cấp.'; },
    opts: [
      { k: 'follow', l: 'Tái khám đúng hẹn và đổi thói quen', res: function () { return { t: 'Bạn bớt đồ mặn, đi bộ mỗi sáng và tái khám theo lịch.', tone: 'good', fx: { hea: 2 }, tag: 'careful', next: [1, 2] }; } },
      { k: 'half', l: 'Chỉnh một phần, tái khám khi tiện', res: function () { return { t: 'Bạn thay đổi vài thứ, nhưng chưa đều.', tone: 'neutral', tag: 'half', next: [1, 3] }; } },
      { k: 'ignore', risk: { p: 0.2, t: 'Mấy tháng sau bạn thấy mệt hẳn và phải đi khám gấp. Việc để chậm làm điều trị phức tạp hơn.', fx: { hea: -3 }, stress: 3 }, l: 'Để đó, đợi có triệu chứng mới tính', ai: { w: 0.9 }, res: function () { return { t: 'Cuộc sống bận rộn cuốn bạn đi. Tờ kết quả nằm trong ngăn kéo.', tone: 'neutral', tag: 'ignored', next: [1, 3] }; } }
    ],
    follow: {
      careful: { title: 'Tái khám', text: 'Kết quả mới cho thấy chỉ số có cải thiện rõ.', opts: [ { k: 'keep', l: 'Duy trì thói quen mới', res: function () { return { t: 'Bạn duy trì được nhịp sống lành mạnh hơn và thấy người nhẹ nhõm.', tone: 'good', fx: { hea: 2, hap: 1 } }; } }, { k: 'relax', l: 'Nới lỏng một chút vì đã ổn', res: function () { return { t: 'Bạn nới dần nhưng vẫn giữ vài thói quen chính.', tone: 'neutral', fx: { hea: 1 } }; } } ] },
      half: { title: 'Chỉ số chưa ổn định', text: 'Kết quả khám lần này lưng chừng: chưa xấu hơn nhưng cũng chưa cải thiện.', opts: [ { k: 'commit', l: 'Nghiêm túc hơn từ bây giờ', res: function () { return { t: 'Bạn lập kế hoạch cụ thể và theo đúng.', tone: 'good', fx: { hea: 1 } }; } }, { k: 'later', l: 'Hẹn đợt sau', res: function (l, r) { return r() < 0.3 + (l.age - 35) / 150 ? { t: 'Một vấn đề nhỏ trở nặng hơn và cần điều trị lâu hơn.', tone: 'bad', fx: { hea: -3 }, stress: 2 } : { t: 'Chưa có gì xấu thêm, nhưng bạn vẫn nên chú ý.', tone: 'neutral' }; } } ] },
      ignored: { title: 'Cơ thể nhắc nhở', text: 'Vài triệu chứng nhẹ xuất hiện, đúng với điều bác sĩ dặn năm nào.', opts: [ { k: 'doctor', l: 'Đi khám ngay và làm theo hướng dẫn', res: function (l, r) { return r() < 0.8 ? { t: 'Phát hiện còn sớm nên điều trị khá nhẹ nhàng.', tone: 'good', fx: { hea: -1 }, stress: 2 } : { t: 'Bệnh đã tiến triển hơn dự kiến nên điều trị kéo dài.', tone: 'bad', fx: { hea: -4 }, stress: 4 }; } }, { k: 'delay', l: 'Tiếp tục kéo dài', res: function (l, r) { return r() < 0.35 + (l.age - 35) / 120 ? { t: 'Cơn đau buộc bạn phải nhập viện. Lần này không còn kịp tránh.', tone: 'bad', fx: { hea: -6 }, stress: 5 } : { t: 'Triệu chứng tạm lắng nhưng chưa biến mất.', tone: 'neutral', fx: { hea: -1 } }; } } ] }
    } });

  QT('q91_learn', { a0: 24, a1: 55, when: function (l) { return !!l.job && !l.retired; }, title: 'Cơ hội học thêm',
    text: 'Chỗ làm hoặc một trung tâm gần nhà có khóa học mới, đòi hỏi vài buổi tối mỗi tuần trong nửa năm. Học xong có thể mở thêm hướng đi, nhưng không có gì bảo đảm.',
    opts: [
      { k: 'enroll', l: 'Đăng ký học nghiêm túc', h: 'Tốn thời gian và sức.', res: function () { return { t: 'Nửa năm bận rộn nhưng bạn học được nhiều thứ mới.', tone: 'good', fx: { kno: 3, hea: -1 }, stress: 3, tag: 'studied', next: [1, 2] }; } },
      { k: 'light', l: 'Học bản rút gọn, chỉ lấy phần cần thiết', res: function () { return { t: 'Bạn nắm được phần quan trọng mà vẫn giữ được nhịp sống.', tone: 'neutral', fx: { kno: 1 }, tag: 'studied', next: [1, 2] }; } },
      { k: 'skip', l: 'Bỏ qua, dành thời gian cho gia đình và nghỉ ngơi', res: function () { return { t: 'Bạn giữ được nhịp sống ổn định, dù thỉnh thoảng nghĩ "giá mà".', tone: 'neutral', fx: { hap: 1 } }; } }
    ],
    follow: { studied: { title: 'Kiến thức đã học', text: 'Có một việc mới ở chỗ làm hoặc ngoài thị trường khớp với điều bạn học.',
      opts: [ { k: 'apply', l: 'Xin thử vai trò mới', res: function (l, r) { return r() < 0.55 + st(l, 'kno') / 400 ? { t: 'Bạn được giao thử và làm được. Thu nhập và uy tín nhích lên.', tone: 'good', fx: { money: 0.15, soc: 1 }, mem: 'Từng học thêm và dùng được vào việc.' } : { t: 'Chưa có chỗ trống phù hợp, nhưng kiến thức vẫn là vốn của bạn.', tone: 'neutral', fx: { kno: 1 } }; } },
              { k: 'stay', l: 'Giữ vị trí hiện tại, dùng kiến thức cải tiến công việc', res: function () { return { t: 'Bạn tối ưu quy trình nhỏ, đồng nghiệp ghi nhận.', tone: 'good', fx: { soc: 1 } }; } } ] } } });

  QT('q91_parents', { a0: 34, a1: 66, when: function (l) { return parentAlive(l); }, title: 'Bố mẹ cần người đỡ đần',
    text: 'Sức khỏe của người lớn tuổi trong nhà yếu đi, nhiều việc trước đây tự làm giờ cần người giúp. Anh chị em và gia đình bạn đều có việc riêng, nên phải sắp xếp ai chăm, chăm ra sao.',
    opts: [
      { k: 'plan', l: 'Họp gia đình chia việc rõ ràng', h: 'Công bằng hơn nhưng cần thương lượng.', res: function (l, r) { return r() < 0.7 ? { t: 'Cả nhà thống nhất lịch thay phiên và khoản chi chung. Không ai quá tải.', tone: 'good', fx: { soc: 1 }, tag: 'shared', next: [1, 3] } : { t: 'Cuộc họp có tranh cãi nhưng cuối cùng cũng chia được.', tone: 'neutral', stress: 2, tag: 'shared', next: [1, 3] }; } },
      { k: 'self', risk: { p: 0.35, t: 'Bạn kiệt sức vì vừa chăm vừa làm. Anh chị em trách bạn không nhờ ai, còn bạn thì tủi thân.', fx: { hea: -2, hap: -2 }, stress: 4 }, l: 'Nhận phần lớn việc chăm sóc', h: 'Gần gũi, nhưng dễ kiệt sức.', ai: { w: 1.1 }, res: function () { return { t: 'Bạn dành nhiều thời gian chăm. Cha mẹ yên lòng, còn bạn mệt dần.', tone: 'neutral', fx: { hap: 1, hea: -1 }, stress: 4, tag: 'burden', next: [1, 2] }; } },
      { k: 'hire', l: 'Thuê người hỗ trợ hoặc tìm dịch vụ chăm sóc', h: 'Tốn kém.', res: function () { return { t: 'Có người giúp việc ban ngày nên cả nhà đỡ gánh nặng, dù tốn thêm chi phí.', tone: 'neutral', fx: { money: -0.1 }, tag: 'paid', next: [1, 3] }; } }
    ],
    follow: {
      shared: { title: 'Nhịp chăm sóc đã vào nề nếp', text: 'Có tháng một người trong nhà bận không thay phiên được.', opts: [ { k: 'cover', l: 'Nhận thay phiên đó', res: function () { return { t: 'Bạn nhận thay, đổi lại lần sau được nhờ lại.', tone: 'good', fx: { soc: 1 }, stress: 2 }; } }, { k: 'adjust', l: 'Cùng điều chỉnh lại lịch', res: function () { return { t: 'Cả nhà sắp lại lịch. Có chút phiền nhưng mọi người tôn trọng nhau.', tone: 'neutral' }; } } ] },
      burden: { title: 'Kiệt sức', text: 'Bạn bắt đầu quên bữa và ngủ ít. Các việc riêng cũng chậm lại.', opts: [ { k: 'ask', l: 'Nhờ người thân chia sẻ', res: function (l, r) { return r() < 0.65 ? { t: 'Mọi người nhận thêm phần việc. Bạn thở phào.', tone: 'good', stress: -4 } : { t: 'Không ai nhận thêm vì đều bận, bạn vẫn phải gồng.', tone: 'bad', stress: 3, fx: { hea: -2 } }; } }, { k: 'rest', l: 'Nghỉ ngơi và thuê người phụ vài buổi', res: function () { return { t: 'Bạn bớt mệt, lấy lại sức.', tone: 'good', fx: { hea: 1, money: -0.05 }, stress: -3 }; } } ] },
      paid: { title: 'Người hỗ trợ', text: 'Người lớn tuổi quen người giúp việc dần dần, nhưng cũng mong con cháu ghé thăm nhiều hơn.', opts: [ { k: 'visit', l: 'Sắp xếp ghé thăm đều', res: function () { return { t: 'Những buổi ăn cơm chung làm cả nhà ấm lên.', tone: 'good', fx: { hap: 2, soc: 1 } }; } }, { k: 'busy', l: 'Giữ nhịp như cũ', res: function () { return { t: 'Mọi thứ vẫn ổn, chỉ hơi thiếu hơi ấm gia đình.', tone: 'neutral' }; } } ] }
    } });

  QT('q91_slump', { a0: 26, a1: 62, title: 'Một năm mệt mỏi, mất hứng',
    text: 'Dạo này bạn thức dậy không còn thấy hứng thú như trước. Công việc và các mối quan hệ vẫn ổn, nhưng mọi thứ đều nhạt nhòa.',
    opts: [
      { k: 'rest', l: 'Cho mình nghỉ phép dài và đổi nhịp', res: function () { return { t: 'Bạn dành mấy ngày đi chỗ yên tĩnh, không lịch trình. Đầu óc dần sáng ra.', tone: 'good', fx: { hap: 2, money: -0.05 }, stress: -4, tag: 'rested', next: [1, 2] }; } },
      { k: 'talk', l: 'Nói chuyện với người thân hoặc bạn tin cậy', res: function (l, r) { return r() < 0.7 ? { t: 'Có người lắng nghe nên bạn thấy nhẹ. Hóa ra họ cũng từng như vậy.', tone: 'good', fx: { soc: 1, hap: 2 }, stress: -4, tag: 'rested', next: [1, 2] } : { t: 'Người kia hơi vội vã khuyên "cố lên". Bạn hiểu họ có ý tốt nhưng chưa thấy đỡ.', tone: 'neutral', tag: 'push', next: [1, 2] }; } },
      { k: 'push', risk: { p: 0.4, t: 'Bạn kiệt sức, mắc một lỗi lớn trong công việc và phải xử lý hậu quả vất vả.', fx: { hap: -2, hea: -1 }, stress: 4 }, l: 'Cố gắng làm việc nhiều hơn để quên đi', ai: { w: 1.1 }, res: function () { return { t: 'Bạn lao vào công việc. Bên ngoài trông ổn, bên trong vẫn nặng.', tone: 'neutral', stress: 3, tag: 'push', next: [1, 2] }; } }
    ],
    follow: {
      rested: { title: 'Lấy lại nhịp', text: 'Bạn nhận ra điều gì làm mình kiệt sức và muốn đổi.', opts: [ { k: 'change', l: 'Thay đổi một thói quen lớn', res: function () { return { t: 'Bạn sắp lại lịch làm việc và nghỉ ngơi. Một năm sau bạn thấy khác hẳn.', tone: 'good', fx: { hap: 2, hea: 1 } }; } }, { k: 'same', l: 'Giữ nhịp cũ nhưng để ý hơn', res: function () { return { t: 'Bạn biết dấu hiệu sớm hơn và biết khi nào cần dừng.', tone: 'neutral', fx: { hap: 1 } }; } } ] },
      push: { title: 'Vẫn chưa ổn', text: 'Cảm giác nặng nề không biến mất, thậm chí đôi lúc nặng hơn.', opts: [ { k: 'pro', l: 'Tìm người có chuyên môn để được hỗ trợ', res: function (l, r) { return r() < 0.75 ? { t: 'Có người hướng dẫn nên bạn hiểu mình hơn và bớt nặng nề.', tone: 'good', fx: { hap: 3 }, stress: -6 } : { t: 'Phải thử vài lần mới tìm được người phù hợp, nhưng bạn không bỏ cuộc.', tone: 'neutral', stress: -1 }; } }, { k: 'endure', l: 'Tiếp tục chịu đựng', res: function () { return { t: 'Bạn gồng thêm một năm. Cơ thể bắt đầu có dấu hiệu mệt.', tone: 'bad', fx: { hea: -2, hap: -2 }, stress: 4 }; } } ] }
    } });

  QT('q91_windfall', { a0: 22, a1: 70, title: 'Một khoản tiền bất ngờ',
    text: 'Bạn nhận được một khoản tiền không nhỏ ngoài dự tính (hoàn thuế, thưởng, trả nợ cũ, hay tiền bán đồ). Không đủ đổi đời, nhưng đủ để chọn.',
    opts: [
      { k: 'buffer', l: 'Giữ làm quỹ dự phòng', res: function () { return { t: 'Bạn bỏ vào quỹ riêng và thấy yên tâm hơn mỗi khi nghĩ đến.', tone: 'good', fx: { money: 0.2 }, stress: -2, tag: 'buffer', next: [1, 3] }; } },
      { k: 'family', l: 'Giúp người thân đang cần', res: function () { return { t: 'Bạn chia sẻ một phần. Người thân xúc động, tình cảm gần hơn.', tone: 'good', fx: { money: 0.05, soc: 2, karma: 1 }, tag: 'family', next: [1, 3] }; } },
      { k: 'treat', l: 'Thưởng cho mình một chuyến đi hoặc món đồ đáng nhớ', res: function () { return { t: 'Bạn tận hưởng không áy náy, và có kỷ niệm đẹp.', tone: 'good', fx: { hap: 3, money: 0.03 }, mem: 'Dùng khoản tiền bất ngờ để thưởng cho bản thân.' }; } },
      { k: 'invest', l: 'Thử dùng làm vốn nhỏ cho dự định riêng', res: function (l, r) { return r() < 0.5 ? { t: 'Dự định bắt đầu có kết quả khả quan.', tone: 'good', fx: { money: 0.18 }, tag: 'venture', next: [1, 3] } : { t: 'Dự định gặp khó khăn hơn dự kiến.', tone: 'bad', fx: { money: 0.1 }, stress: 3, tag: 'venture', next: [1, 3] }; } }
    ],
    follow: {
      buffer: { title: 'Quỹ dự phòng phát huy', text: 'Có một khoản chi bất ngờ xuất hiện: sửa chữa lớn hoặc chữa bệnh cho người nhà.', opts: [ { k: 'use', l: 'Dùng quỹ để lo ngay', res: function () { return { t: 'Nhờ có quỹ nên việc xử lý nhanh, không phải vay mượn.', tone: 'good', fx: { money: -0.1, hap: 1 } }; } }, { k: 'borrow', l: 'Giữ quỹ, vay tạm việc khác', res: function () { return { t: 'Bạn xoay xở, hơi vất vả nhưng giữ được quỹ.', tone: 'neutral', stress: 2 }; } } ] },
      family: { title: 'Người thân đã đứng vững', text: 'Người thân bạn giúp năm nào gửi lời cảm ơn và hỏi bạn có cần gì không.', opts: [ { k: 'accept', l: 'Nhận lời mời bữa cơm', res: function () { return { t: 'Cả nhà quây quần vui vẻ.', tone: 'good', fx: { hap: 2, soc: 1 } }; } }, { k: 'modest', l: 'Bảo mọi người cứ lo cho mình', res: function () { return { t: 'Họ vẫn ghi nhớ và giữ trong lòng.', tone: 'neutral', fx: { soc: 1 } }; } } ] },
      venture: { title: 'Dự định riêng', text: 'Sau vài năm, bạn phải quyết định đi tiếp hay dừng.', opts: [ { k: 'grow', l: 'Tiếp tục đầu tư thời gian', res: function (l, r) { return r() < 0.55 ? { t: 'Dự định mở rộng khiêm tốn và đem lại thêm thu nhập.', tone: 'good', fx: { money: 0.15, soc: 1 } } : { t: 'Kết quả không như kỳ vọng, nhưng bạn học được nhiều.', tone: 'neutral', fx: { kno: 2 } }; } }, { k: 'stop', l: 'Dừng lại và quay về công việc ổn định', res: function () { return { t: 'Bạn dừng đúng lúc, không để thiệt hại lớn hơn.', tone: 'neutral', fx: { money: 0.03 } }; } } ] }
    } });

  QT('q91_volunteer', { a0: 25, a1: 80, title: 'Giúp việc chung',
    text: 'Khu bạn ở có đợt dọn dẹp, phát quà hoặc hỗ trợ người già neo đơn do một nhóm tình nguyện tổ chức. Họ cần thêm người, dù chỉ vài giờ cuối tuần.',
    opts: [
      { k: 'join', l: 'Tham gia đều đặn', res: function () { return { t: 'Bạn quen những người mới và thấy việc mình làm có ích.', tone: 'good', fx: { soc: 2, hap: 2, karma: 1 }, tag: 'active', next: [2, 3] }; } },
      { k: 'once', l: 'Đến một buổi cho biết', res: function () { return { t: 'Bạn góp tay một buổi và nhận ra mình hợp hay không hợp với việc này.', tone: 'neutral', fx: { soc: 1 } }; } },
      { k: 'donate', l: 'Không đi được, ủng hộ vật phẩm', res: function () { return { t: 'Bạn gửi một ít đồ dùng cho nhóm.', tone: 'neutral', fx: { karma: 1 } }; } }
    ],
    follow: { active: { title: 'Nhóm tình nguyện', text: 'Nhóm cần người nhận vai trò điều phối, mất nhiều thời gian hơn.', opts: [ { k: 'lead', l: 'Nhận vai trò điều phối', res: function () { return { t: 'Bạn bận hơn nhưng học được cách tổ chức và được nhiều người quý.', tone: 'good', fx: { soc: 3, hap: 1 }, stress: 2 }; } }, { k: 'keep', l: 'Giữ mức tham gia hiện tại', res: function () { return { t: 'Bạn vẫn tham gia đều mà không quá tải.', tone: 'neutral', fx: { soc: 1 } }; } } ] } } });

  // ======================= TRƯỚC NGHỈ HƯU & TUỔI GIÀ =======================
  QT('q91_retireplan', { a0: 54, a1: 61, when: function (l) { return !l.retired; }, cw: 1.4, title: 'Nghĩ về ngày nghỉ làm',
    text: function (l) { return 'Bạn bắt đầu nghĩ đến lúc giảm việc và nghỉ ngơi' + (st(l, 'hea') < 45 ? '; sức khỏe dạo này khiến bạn nghĩ nhiều hơn' : '') + '. Có nhiều cách chuẩn bị, và không cách nào hoàn toàn chắc chắn.'; },
    opts: [
      { k: 'money', l: 'Rà soát tiền bạc, lương hưu và khoản dự phòng', res: function () { return { t: 'Bạn ngồi tính từng khoản thu chi cho các năm sau. Con số khiến bạn bình tĩnh hơn.', tone: 'good', fx: { money: 0.05 }, stress: -2, tag: 'money', next: [1, 3] }; } },
      { k: 'purpose', l: 'Tìm việc hoặc hoạt động để làm khi nghỉ', res: function () { return { t: 'Bạn thử nhiều thứ từ trồng cây đến dạy kèm và biết mình cần một nhịp sinh hoạt.', tone: 'good', fx: { hap: 2, soc: 1 }, tag: 'purpose', next: [1, 3] }; } },
      { k: 'taper', l: 'Xin giảm giờ làm dần', res: function (l, r) { return r() < 0.6 ? { t: 'Nơi làm việc đồng ý cho giảm dần giờ làm.', tone: 'good', fx: { hap: 1 }, tag: 'taper', next: [1, 2] } : { t: 'Không được đồng ý nên bạn phải tính lại.', tone: 'neutral', stress: 2, tag: 'money', next: [1, 3] }; } },
      { k: 'wait', risk: { p: 0.3, t: 'Một khoản chi y tế bất ngờ ập đến khi bạn chưa chuẩn bị gì, buộc phải lấy từ khoản dự phòng ít ỏi.', fx: { money: -0.12 }, stress: 4 }, l: 'Chưa nghĩ đến, cứ làm tiếp', res: function () { return { t: 'Bạn gác lại. Vẫn còn thời gian, hoặc bạn nghĩ vậy.', tone: 'neutral' }; } }
    ],
    follow: {
      money: { title: 'Bản kế hoạch tài chính', text: 'Khi đối chiếu thực tế, có vài khoản chi bạn chưa tính đến (y tế, hỗ trợ con cháu).', opts: [ { k: 'adjust', l: 'Điều chỉnh kế hoạch cho sát thực tế', res: function () { return { t: 'Bạn dựng lại ngân sách và thấy an tâm hơn.', tone: 'good', stress: -2 }; } }, { k: 'work', l: 'Làm thêm vài năm để dự phòng', res: function () { return { t: 'Bạn làm thêm với nhịp nhẹ nhàng hơn.', tone: 'neutral', fx: { money: 0.1, hea: -1 } }; } } ] },
      purpose: { title: 'Việc để làm khi nghỉ', text: 'Một hoạt động bạn thử bắt đầu thành nếp.', opts: [ { k: 'commit', l: 'Dành thời gian đều đặn', res: function () { return { t: 'Bạn có lịch sinh hoạt mới. Ngày nghỉ sau này sẽ không trống rỗng.', tone: 'good', fx: { hap: 2, hea: 1 } }; } }, { k: 'try', l: 'Thử thêm thứ khác', res: function () { return { t: 'Bạn mở rộng vài hướng khác, chưa chốt.', tone: 'neutral' }; } } ] },
      taper: { title: 'Giờ làm đã giảm', text: 'Nhịp mới nhẹ hơn, nhưng đồng nghiệp trẻ bắt đầu nhận phần việc của bạn.', opts: [ { k: 'mentor', l: 'Hướng dẫn người kế nhiệm', res: function () { return { t: 'Bạn truyền lại kinh nghiệm. Đồng nghiệp mến bạn.', tone: 'good', fx: { soc: 2, hap: 1 } }; } }, { k: 'hold', l: 'Giữ việc của mình đến cuối', res: function () { return { t: 'Bạn giữ nhịp quen thuộc đến phút cuối.', tone: 'neutral' }; } } ] }
    } });

  QT('q91_will', { a0: 66, a1: 96, title: 'Chuyện để lại',
    text: function (l) { return 'Bạn đã nghĩ nhiều về những gì sẽ để lại: nhà cửa, đồ kỷ niệm, lời dặn. ' + ((l.kids || []).length ? 'Các con và cháu chưa ai dám nhắc.' : 'Người thân chưa ai dám nhắc.'); },
    opts: [
      { k: 'talk', l: 'Chủ động nói chuyện với người thân', res: function (l, r) { return r() < 0.75 ? { t: 'Bạn nói rõ mong muốn. Lúc đầu ai cũng bối rối, rồi họ cảm ơn bạn vì sự rõ ràng.', tone: 'good', fx: { soc: 2 }, stress: -3, tag: 'clear', next: [1, 3] } : { t: 'Cuộc nói chuyện có chút căng thẳng vì ý kiến khác nhau, nhưng ít ra vấn đề đã ra ánh sáng.', tone: 'neutral', stress: 2, tag: 'clear', next: [1, 3] }; } },
      { k: 'write', risk: { p: 0.1, t: 'Người được nhờ giữ giấy tờ làm thất lạc bản viết. Bạn phải viết lại và lo lắng không yên.', fx: { hap: -1 }, stress: 2 }, l: 'Viết ra giấy rồi nhờ người đáng tin giữ', res: function () { return { t: 'Bạn ghi cẩn thận và nhờ người đáng tin giữ. Lòng nhẹ đi nhiều.', tone: 'good', stress: -2, tag: 'written', next: [1, 3] }; } },
      { k: 'later', risk: { p: 0.3, t: 'Có người trong nhà hiểu sai ý bạn nên cả nhà tranh cãi. Bạn ước gì đã nói rõ sớm hơn.', fx: { hap: -2, soc: -1 }, stress: 3 }, l: 'Để khi khác', res: function () { return { t: 'Bạn gác lại. Cảm giác dở dang vẫn còn đó.', tone: 'neutral', stress: 1 }; } }
    ],
    follow: {
      clear: { title: 'Sau cuộc nói chuyện', text: 'Mọi người vẫn nhắc đến điều bạn dặn, và có người đề nghị giúp bạn thực hiện.', opts: [ { k: 'accept', l: 'Nhận giúp đỡ để sắp xếp', res: function () { return { t: 'Việc sắp xếp xong êm đẹp. Bạn thấy nhẹ lòng.', tone: 'good', stress: -3, fx: { hap: 2 } }; } }, { k: 'own', l: 'Tự lo, không phiền ai', res: function () { return { t: 'Bạn tự làm từng việc nhỏ, mất nhiều sức hơn.', tone: 'neutral', fx: { hea: -1 } }; } } ] },
      written: { title: 'Bản dặn dò', text: 'Có thứ bạn muốn thêm hoặc sửa trong bản ghi.', opts: [ { k: 'edit', l: 'Sửa lại cho rõ', res: function () { return { t: 'Bạn cập nhật và ký lại.', tone: 'good', stress: -1 }; } }, { k: 'keep', l: 'Giữ nguyên', res: function () { return { t: 'Bạn giữ nguyên và nói với người giữ rằng mình tin tưởng họ.', tone: 'neutral' }; } } ] }
    } });

  QT('q91_memoir', { a0: 66, a1: 95, title: 'Kể lại một đời',
    text: function (l) { var h = Q(l).q91_hobby; return 'Con cháu hoặc người trẻ quanh bạn hay hỏi chuyện ngày xưa' + (h && h.tag ? ', nhất là về niềm mê ' + ({ art: 'vẽ', sport: 'thể thao', read: 'sách' }[h.tag] || 'chơi') + ' thuở nhỏ' : '') + '. Bạn có ' + (l.mem || []).length + ' ký ức đáng nhớ và không biết kể thế nào.'; },
    opts: [
      { k: 'tell', l: 'Kể cho họ nghe, từng chút một', res: function () { return { t: 'Bạn kể, họ cười, có lúc im lặng. Lần đầu bạn thấy mình là cầu nối giữa các thế hệ.', tone: 'good', fx: { hap: 3, soc: 2 }, tag: 'told', next: [1, 3] }; } },
      { k: 'write', l: 'Viết hoặc ghi âm lại', res: function () { return { t: 'Bạn dành mỗi sáng viết vài dòng. Có chỗ bạn bật cười, có chỗ phải dừng lại.', tone: 'good', fx: { kno: 1, hap: 2 }, stress: -2, tag: 'written', next: [1, 3] }; } },
      { k: 'rest', l: 'Chưa muốn nhắc lại, giữ cho riêng mình', res: function () { return { t: 'Có những điều bạn muốn giữ riêng. Mọi người tôn trọng.', tone: 'neutral' }; } }
    ],
    follow: {
      told: { title: 'Người nghe vẫn nhớ', text: 'Cháu bạn hoặc người trẻ nào đó kể lại câu chuyện cho bạn bè.', opts: [ { k: 'more', l: 'Kể tiếp những chuyện khác', res: function () { return { t: 'Những câu chuyện của bạn dần thành chuyện của cả nhà.', tone: 'good', fx: { hap: 2, soc: 1 } }; } }, { k: 'rest', l: 'Nghỉ ngơi, để người trẻ hỏi khi cần', res: function () { return { t: 'Bạn giữ sức và vẫn sẵn lòng khi ai đó hỏi.', tone: 'neutral' }; } } ] },
      written: { title: 'Những trang viết', text: 'Cuốn sổ đã dày thêm. Có người đề nghị giúp đánh máy hoặc in thành quyển nhỏ.', opts: [ { k: 'print', l: 'Đồng ý in cho gia đình', res: function () { return { t: 'Cả nhà nhận cuốn sách nhỏ. Có người rơi nước mắt khi đọc.', tone: 'good', fx: { hap: 3, soc: 2 }, mem: 'Cuốn hồi ký nhỏ được in cho gia đình.', w: 4 }; } }, { k: 'keep', l: 'Giữ bản chép tay', res: function () { return { t: 'Bạn giữ cuốn sổ như một người bạn.', tone: 'neutral', fx: { hap: 1 } }; } } ] }
    } });

  QT('q91_living', { a0: 70, a1: 96, title: 'Sống ở đâu cho thuận',
    text: function (l) { return 'Việc đi lại, bậc thang và nấu nướng bắt đầu khó hơn' + (st(l, 'hea') < 40 ? ' rõ rệt' : '') + '. Bạn phải nghĩ xem nên tiếp tục ở nhà cũ, về sống chung với con cháu hay chọn nơi có người hỗ trợ.'; },
    opts: [
      { k: 'stay', l: 'Ở lại nhà cũ, nhờ người đến giúp', h: 'Giữ nếp quen, cần mạng lưới hỗ trợ.', res: function (l, r) { return r() < 0.55 + st(l, 'soc') / 300 ? { t: 'Hàng xóm và người thân luân phiên ghé thăm. Bạn vẫn là chủ nhà của mình.', tone: 'good', fx: { hap: 2 }, tag: 'home', next: [1, 3] } : { t: 'Bạn ở một mình và có những buổi chiều rất yên ắng.', tone: 'neutral', fx: { hap: -1 }, stress: 2, tag: 'home', next: [1, 3] }; } },
      { k: 'family', l: 'Về sống chung với con cháu', h: 'Gần gũi, nhưng cần điều chỉnh nếp sống.', res: function (l, r) { return r() < 0.65 ? { t: 'Bữa cơm đông vui, bạn thấy ấm áp, dù đôi khi hai thế hệ khác nhau thói quen.', tone: 'good', fx: { hap: 2, soc: 1 }, tag: 'family', next: [1, 3] } : { t: 'Cả nhà phải điều chỉnh nhiều và có lúc căng thẳng.', tone: 'neutral', stress: 2, tag: 'family', next: [1, 3] }; } },
      { k: 'care', l: 'Chuyển vào nơi có người chăm sóc', h: 'An toàn hơn, nhưng xa nếp cũ.', res: function () { return { t: 'Bạn dần quen với nơi mới, có người hỗ trợ bất cứ lúc nào.', tone: 'neutral', fx: { hea: 1, hap: -1, money: -0.15 }, tag: 'care', next: [1, 3] }; } }
    ],
    follow: {
      home: { title: 'Một mình trong nhà quen', text: 'Bạn suýt trượt chân ở bậc thềm. Chuyện nhỏ nhưng làm cả nhà lo.', opts: [ { k: 'fix', l: 'Sửa nhà cho an toàn (tay vịn, đèn)', res: function () { return { t: 'Nhà an toàn hơn, bạn vẫn giữ được sự tự lập.', tone: 'good', fx: { money: -0.05, hea: 1 } }; } }, { k: 'wave', l: 'Bảo không sao', res: function (l, r) { return r() < 0.3 ? { t: 'Lần sau bạn thật sự bị ngã và phải nằm viện.', tone: 'bad', fx: { hea: -5 }, stress: 3 } : { t: 'Bạn vẫn ổn, nhưng nỗi lo của mọi người còn đó.', tone: 'neutral' }; } } ] },
      family: { title: 'Hai thế hệ một mái nhà', text: 'Có chuyện nhỏ khiến cả nhà bất đồng, như giờ giấc hay cách dạy cháu.', opts: [ { k: 'talk', l: 'Nói rõ và cùng thỏa thuận', res: function () { return { t: 'Mọi người thống nhất quy ước chung, nhà yên ấm hơn.', tone: 'good', fx: { hap: 2 }, stress: -2 }; } }, { k: 'yield', l: 'Nhường để giữ hòa khí', res: function () { return { t: 'Bạn nhường nhiều hơn, đôi khi thấy mình lạc lõng.', tone: 'neutral', stress: 1 }; } } ] },
      care: { title: 'Nơi ở mới', text: 'Bạn quen được vài người bạn mới, nhưng vẫn nhớ nhà cũ.', opts: [ { k: 'join', l: 'Tham gia các hoạt động chung', res: function () { return { t: 'Bạn có bạn đánh cờ, bạn trò chuyện. Ngày dài bớt trống.', tone: 'good', fx: { soc: 2, hap: 2 } }; } }, { k: 'visit', l: 'Nhờ con cháu đưa về thăm nhà cũ thường xuyên', res: function () { return { t: 'Mỗi lần về thăm nhà, bạn thấy lòng ấm lại.', tone: 'good', fx: { hap: 2 } }; } } ] }
    } });

  QT('q91_garden', { a0: 60, a1: 96, title: 'Một thú vui quanh nhà',
    text: 'Bạn có nhiều thời gian hơn và muốn một việc nhẹ nhàng cho mỗi ngày: chăm vài chậu cây, nuôi cá hoặc tham gia nhóm đi bộ buổi sáng.',
    opts: [
      { k: 'plant', l: 'Trồng cây, chăm vườn nhỏ', res: function () { return { t: 'Mỗi sáng bạn tưới cây, nhìn từng mầm lên. Ngày có nhịp.', tone: 'good', fx: { hap: 2, hea: 1 }, tag: 'plant', next: [1, 2] }; } },
      { k: 'walk', l: 'Tham gia nhóm đi bộ buổi sáng', res: function () { return { t: 'Bạn đi cùng nhóm, vừa đi vừa trò chuyện. Người khỏe hơn và quen thêm người.', tone: 'good', fx: { hea: 2, soc: 2 }, tag: 'walk', next: [1, 2] }; } },
      { k: 'none', risk: { p: 0.3, t: 'Những buổi chiều dài trôi qua chậm chạp. Bạn thấy mình ít vận động và người rã rời.', fx: { hea: -1, hap: -1 } }, l: 'Để ngày trôi tự nhiên', res: function () { return { t: 'Bạn thích sự thong thả, dù đôi lúc thấy trống.', tone: 'neutral' }; } }
    ],
    follow: {
      plant: { title: 'Vườn nhỏ đã xanh', text: 'Cây trái ra nhiều hơn bạn dùng hết.', opts: [ { k: 'share', l: 'Chia cho hàng xóm', res: function () { return { t: 'Người nhận mang đáp lễ, các cuộc nói chuyện qua hàng rào nhiều hơn.', tone: 'good', fx: { soc: 2, hap: 1 } }; } }, { k: 'keep', l: 'Giữ lại dùng', res: function () { return { t: 'Bạn tự nấu ăn từ rau trái tự trồng.', tone: 'neutral', fx: { hea: 1 } }; } } ] },
      walk: { title: 'Nhóm đi bộ', text: 'Một người trong nhóm không đến nhiều hôm liền.', opts: [ { k: 'check', l: 'Ghé thăm xem có chuyện gì', res: function () { return { t: 'Bạn phát hiện người ấy ốm nhẹ và cần người giúp. Việc ghé thăm làm cả hai ấm lòng.', tone: 'good', fx: { soc: 2, karma: 1 } }; } }, { k: 'later', l: 'Chờ xem có ai hỏi thăm', res: function () { return { t: 'Người ấy quay lại sau một thời gian. Bạn nghĩ lần sau nên chủ động hơn.', tone: 'neutral' }; } } ] }
    } });

  // ======================= BỔ SUNG: tuổi nhỏ, trung niên, tuổi già =======================
  QT('q91_toddler_food', { a0: 1, a1: 5, child: true, title: 'Món ăn không chịu ăn',
    text: 'Bữa cơm nào bạn cũng mím môi lắc đầu trước món rau. Người lớn đã thử dỗ, thử ăn cùng.',
    opts: [
      { k: 'taste', l: 'Chịu nếm một miếng nhỏ', res: function (l, r) { return r() < 0.6 ? { t: 'Bạn nếm thử và hóa ra không tệ như tưởng. Người lớn mừng ra mặt.', tone: 'good', fx: { hea: 1 }, tag: 'open', next: [1, 2] } : { t: 'Bạn nhăn mặt nhổ ra, nhưng ít nhất đã thử.', tone: 'neutral', tag: 'open', next: [1, 2] }; } },
      { k: 'refuse', l: 'Khóc và nhất định không ăn', res: function () { return { t: 'Cả bàn ăn căng thẳng một lúc. Cuối cùng bạn ăn cơm trắng và bỏ rau.', tone: 'neutral', fx: { hap: -1 }, tag: 'picky', next: [1, 2] }; } },
      { k: 'help', l: 'Đòi tự xúc và tự chọn', res: function () { return { t: 'Cơm vương vãi khắp bàn nhưng bạn rất tự hào vì tự ăn được.', tone: 'good', fx: { hap: 2, kno: 1 }, tag: 'open', next: [1, 2] }; } }
    ],
    follow: {
      open: { title: 'Bàn ăn đã dễ chịu hơn', text: 'Bạn bắt đầu tò mò món mới và hay hỏi "cái gì đây".', opts: [ { k: 'try', l: 'Thử món lạ cùng mọi người', res: function () { return { t: 'Bạn thử nhiều món hơn và ăn ngon miệng.', tone: 'good', fx: { hea: 1 } }; } }, { k: 'safe', l: 'Giữ mấy món quen', res: function () { return { t: 'Bạn vẫn thích món quen, và không sao cả.', tone: 'neutral' }; } } ] },
      picky: { title: 'Kén ăn kéo dài', text: 'Người lớn lo bạn thiếu chất, còn bạn chỉ muốn vài món quen.', opts: [ { k: 'mix', l: 'Chịu ăn rau khi được trộn khéo', res: function () { return { t: 'Món rau xay trong cháo làm bạn ăn hết sạch mà không biết.', tone: 'good', fx: { hea: 1 } }; } }, { k: 'stay', l: 'Giữ nguyên thói quen', res: function (l, r) { return r() < 0.3 ? { t: 'Bạn hơi gầy và hay ốm vặt. Người lớn phải đổi cách cho ăn.', tone: 'bad', fx: { hea: -1 } } : { t: 'Dần dần khẩu vị của bạn cũng rộng hơn.', tone: 'neutral' }; } } ] }
    } });

  QT('q91_toddler_night', { a0: 1, a1: 6, child: true, title: 'Đêm không dám ngủ một mình',
    text: 'Bạn thức giấc giữa đêm vì tiếng động lạ, bóng cây in trên tường. Phòng tối, tim bạn đập thình thịch.',
    opts: [
      { k: 'call', l: 'Gọi người lớn sang', res: function () { return { t: 'Có người sang vỗ về, bạn ngủ lại ngay. Từ đó bạn biết có thể gọi khi sợ.', tone: 'good', fx: { hap: 1 }, tag: 'safe', next: [1, 2] }; } },
      { k: 'light', l: 'Xin để một cái đèn nhỏ', res: function () { return { t: 'Chiếc đèn ngủ làm bóng cây bớt đáng sợ. Bạn ngủ ngon.', tone: 'good', fx: { hap: 1 }, tag: 'safe', next: [1, 2] }; } },
      { k: 'hide', risk: { p: 0.3, t: 'Bạn khóc không thành tiếng suốt đêm và sáng ra sốt nhẹ vì mệt.', fx: { hea: -1, hap: -1 }, stress: 2 }, l: 'Chui vào chăn, tự ráng', res: function () { return { t: 'Bạn nín thở chờ đến sáng. Sáng ra bạn mệt mà vẫn không nói với ai.', tone: 'neutral', stress: 2, tag: 'alone', next: [1, 2] }; } }
    ],
    follow: {
      safe: { title: 'Đêm đã bớt sợ', text: 'Bạn ngủ ngon hơn và còn kể cho bạn nghe chuyện cái bóng cây.', opts: [ { k: 'share', l: 'Kể cho bạn bè nghe cho vui', res: function () { return { t: 'Cả nhóm bật cười, ai cũng có một nỗi sợ của riêng mình.', tone: 'good', fx: { soc: 1 } }; } }, { k: 'quiet', l: 'Giữ cho riêng mình', res: function () { return { t: 'Bạn giữ chuyện đó như bí mật nhỏ, và không còn sợ nữa.', tone: 'neutral' }; } } ] },
      alone: { title: 'Nỗi sợ vẫn còn', text: 'Đêm nào bạn cũng nín thở đợi trời sáng, ban ngày hay cáu và dễ khóc.', opts: [ { k: 'tell', l: 'Nói với người lớn là bạn sợ', res: function (l, r) { return r() < 0.8 ? { t: 'Người lớn ôm bạn, đổi chỗ ngủ và để đèn. Từ đó bạn ngủ yên hơn.', tone: 'good', stress: -3, fx: { hap: 2 } } : { t: 'Người lớn bảo "lớn rồi đừng sợ". Bạn vẫn sợ nhưng không dám nói nữa.', tone: 'bad', stress: 2 }; } }, { k: 'wait', l: 'Chịu thêm một thời gian', res: function () { return { t: 'Dần dần bạn quen, nhưng vẫn nhớ những đêm dài đó.', tone: 'neutral' }; } } ] }
    } });

  QT('q91_sibling', { a0: 3, a1: 14, child: true, when: function (l) { return (l.sibList || []).length > 0; }, title: 'Tranh nhau với anh chị em',
    text: 'Bạn và anh chị em tranh nhau món đồ chơi duy nhất còn lành. Tiếng cãi vang cả nhà, người lớn sắp ra can.',
    opts: [
      { k: 'share', l: 'Nhường chia thay phiên', res: function (l, r) { return r() < 0.7 ? { t: 'Hai bên chia phiên chơi. Lần đầu thấy hóa ra chia ra lại vui hơn.', tone: 'good', fx: { soc: 2 }, tag: 'close', next: [1, 3] } : { t: 'Bạn nhường nhưng bên kia vẫn giành, bạn thấy hơi thiệt.', tone: 'neutral', tag: 'rift', next: [1, 3] }; } },
      { k: 'fight', l: 'Giành cho bằng được', res: function () { return { t: 'Cuộc giành giật kết thúc bằng một trận khóc. Đồ chơi bị cất đi.', tone: 'bad', fx: { hap: -2 }, stress: 2, tag: 'rift', next: [1, 3] }; } },
      { k: 'adult', l: 'Gọi người lớn phân xử', res: function () { return { t: 'Người lớn phân xử và hai bên chịu thua một nửa. Không ai hoàn toàn hài lòng.', tone: 'neutral', tag: 'rift', next: [1, 3] }; } }
    ],
    follow: {
      close: { title: 'Anh chị em thân hơn', text: 'Hai bên giờ có nhiều trò riêng và hay bảo vệ nhau trước bạn bè.', opts: [ { k: 'back', l: 'Đứng về phía nhau khi có chuyện', res: function () { return { t: 'Có chuyện gì hai bên cũng đứng cùng nhau. Bạn thấy vững hơn.', tone: 'good', fx: { soc: 2, hap: 1 } }; } }, { k: 'own', l: 'Giữ bạn bè riêng của mình', res: function () { return { t: 'Mỗi người có thế giới riêng nhưng vẫn gắn bó.', tone: 'neutral' }; } } ] },
      rift: { title: 'Chuyện cũ chưa nguôi', text: 'Hai bên vẫn hay cãi, nhất là chuyện ai được ưu tiên.', opts: [ { k: 'talk', l: 'Chủ động làm lành', res: function (l, r) { return r() < 0.7 ? { t: 'Hai bên làm lành và thôi tính hơn thiệt.', tone: 'good', fx: { soc: 1, hap: 1 } } : { t: 'Chưa làm lành được ngay, nhưng bạn đã mở lời.', tone: 'neutral' }; } }, { k: 'away', l: 'Cứ tránh nhau cho yên', res: function () { return { t: 'Hai bên ít nói chuyện hơn. Khoảng cách chưa thu hẹp.', tone: 'neutral', fx: { soc: -1 } }; } } ] }
    } });

  QT('q91_hobbyback', { a0: 28, a1: 62, when: function (l) { var h = Q(l).q91_hobby; return !!(h && h.tag && l.age - h.a >= 10); }, title: 'Thú vui cũ quay lại',
    text: function (l) { var h = Q(l).q91_hobby; return 'Bạn tình cờ bắt gặp thứ gắn với niềm mê ' + ({ art: 'vẽ', sport: 'thể thao', read: 'sách' }[h && h.tag] || 'chơi') + ' ngày nhỏ. Nó gọi lại cả một thời. Giờ bạn có việc, trách nhiệm và ít thời gian rảnh hơn.'; },
    opts: [
      { k: 'resume', l: 'Dành mỗi tuần vài giờ cho nó', res: function () { return { t: 'Mỗi cuối tuần bạn dành thời gian cho thú vui cũ. Người nhẹ hơn và vui hơn.', tone: 'good', fx: { hap: 2 }, stress: -3, tag: 'back', next: [2, 4] }; } },
      { k: 'teach', l: 'Rủ người trẻ trong nhà cùng làm', res: function () { return { t: 'Bạn chỉ lại cho người trẻ và hai bên có chuyện để nói chung.', tone: 'good', fx: { soc: 2, hap: 1 }, tag: 'back', next: [2, 4] }; } },
      { k: 'pass', risk: { p: 0.3, t: 'Bạn cất lại kỷ niệm và thấy thiếu hụt một điều gì đó trong những cuối tuần ngày càng giống nhau.', fx: { hap: -1 } }, l: 'Cười rồi cất lại, giờ không còn thời gian', res: function () { return { t: 'Bạn cất lại kỷ niệm và quay về lịch dày đặc. Có chút tiếc.', tone: 'neutral' }; } }
    ],
    follow: { back: { title: 'Thú vui đã thành nếp', text: 'Có người rủ bạn tham gia nhóm cùng sở thích để chia sẻ thường xuyên hơn.', opts: [ { k: 'join', l: 'Tham gia nhóm', res: function () { return { t: 'Bạn quen những người cùng mê. Mỗi lần gặp nhau đều rôm rả.', tone: 'good', fx: { soc: 3, hap: 2 } }; } }, { k: 'solo', l: 'Giữ cho riêng mình', res: function () { return { t: 'Bạn vẫn làm một mình, thấy yên tĩnh và đủ đầy.', tone: 'neutral', fx: { hap: 1 } }; } } ] } } });

  QT('q91_repair', { a0: 26, a1: 70, title: 'Nhà cần sửa',
    text: 'Mái hoặc đường nước trong nhà bắt đầu có dấu hiệu hỏng. Sửa ngay thì tốn tiền, để lâu có thể hỏng nặng hơn.',
    opts: [
      { k: 'now', l: 'Sửa ngay cho chắc', res: function () { return { t: 'Thợ làm xong trong mấy ngày, nhà yên tâm hơn dù ví mỏng đi.', tone: 'good', fx: { money: -0.12, hap: 1 }, stress: -2, tag: 'fixed', next: [2, 4] }; } },
      { k: 'diy', l: 'Tự xử lý tạm bằng cách rẻ hơn', res: function (l, r) { return r() < 0.55 ? { t: 'Cách tạm có tác dụng, nhà tạm ổn.', tone: 'neutral', fx: { money: -0.03 }, tag: 'patched', next: [1, 3] } : { t: 'Chỗ vá không bền, hỏng lại sau vài tuần.', tone: 'bad', fx: { money: -0.04 }, stress: 2, tag: 'patched', next: [1, 3] }; } },
      { k: 'wait', risk: { p: 0.4, t: 'Chỗ hỏng lan rộng nhanh hơn dự tính. Chi phí sửa tăng gần gấp đôi.', fx: { money: -0.1 }, stress: 3 }, l: 'Để đó, ưu tiên khoản khác', res: function () { return { t: 'Bạn dồn tiền cho việc khác. Vấn đề vẫn còn đó.', tone: 'neutral', stress: 1, tag: 'patched', next: [1, 3] }; } }
    ],
    follow: {
      fixed: { title: 'Chỗ đã sửa vẫn bền', text: 'Mùa mưa bão qua đi, chỗ sửa vẫn nguyên và hàng xóm hỏi thợ nào làm.', opts: [ { k: 'recommend', l: 'Giới thiệu thợ cho người quen', res: function () { return { t: 'Người quen cảm ơn bạn và thợ cũng quý bạn.', tone: 'good', fx: { soc: 1 } }; } }, { k: 'quiet', l: 'Không nói gì thêm', res: function () { return { t: 'Nhà yên ổn qua mùa mưa.', tone: 'neutral' }; } } ] },
      patched: { title: 'Hỏng nặng hơn', text: 'Mùa mưa tới, chỗ vá cũ không chịu nổi nữa.', opts: [ { k: 'repair', l: 'Sửa cho đàng hoàng bây giờ', res: function () { return { t: 'Lần này bạn sửa hẳn hoi. Chi phí cao hơn lúc đầu nhưng nhà yên ổn.', tone: 'neutral', fx: { money: -0.18 }, stress: -1 }; } }, { k: 'bandage', l: 'Vá tạm thêm lần nữa', res: function (l, r) { return r() < 0.5 ? { t: 'Chỗ vá chịu được mùa này.', tone: 'neutral', fx: { money: -0.03 } } : { t: 'Nước tràn làm hỏng đồ đạc và bạn phải bỏ khoản lớn để chữa.', tone: 'bad', fx: { money: -0.2 }, stress: 3 }; } } ] }
    } });

  QT('q91_colleague', { a0: 22, a1: 62, when: function (l) { return !!l.job && !l.retired; }, title: 'Mâu thuẫn với đồng nghiệp',
    text: 'Một đồng nghiệp cùng nhóm nhận phần công việc chung về mình, còn bạn thì bị gọi họp để "giải thích". Bạn khá chắc có hiểu lầm hơn là ác ý.',
    opts: [
      { k: 'direct', l: 'Gặp riêng người đó nói chuyện thẳng', res: function (l, r) { return r() < 0.6 ? { t: 'Hai bên nhận ra có hiểu lầm về việc phân công và thống nhất cách làm.', tone: 'good', fx: { soc: 1 }, tag: 'cleared', next: [1, 2] } : { t: 'Người kia phòng thủ và buổi nói chuyện không đi đến đâu.', tone: 'bad', stress: 2, tag: 'strained', next: [1, 2] }; } },
      { k: 'boss', l: 'Trình bày rõ với quản lý bằng chứng cụ thể', res: function (l, r) { return r() < 0.65 ? { t: 'Quản lý xem xét công bằng và làm rõ vai trò từng người.', tone: 'good', tag: 'cleared', next: [1, 2] } : { t: 'Quản lý chưa kịp xử lý và chuyện còn treo.', tone: 'neutral', stress: 2, tag: 'strained', next: [1, 2] }; } },
      { k: 'let', risk: { p: 0.4, t: 'Ấm ức dồn lại, bạn nói một câu gắt trong cuộc họp. Không khí nhóm trở nên khó chịu.', fx: { soc: -2 }, stress: 3 }, l: 'Bỏ qua, tập trung làm tốt phần mình', res: function () { return { t: 'Bạn tiếp tục làm việc, nhưng vẫn còn ấm ức.', tone: 'neutral', stress: 2, tag: 'strained', next: [1, 2] }; } }
    ],
    follow: {
      cleared: { title: 'Phối hợp ăn ý hơn', text: 'Sau chuyện cũ, hai bên phối hợp tốt hơn hẳn và có dự án mới cần cả hai.', opts: [ { k: 'team', l: 'Nhận dự án cùng nhau', res: function () { return { t: 'Dự án đạt kết quả tốt và cả hai đều được ghi nhận.', tone: 'good', fx: { soc: 2, money: 0.05 } }; } }, { k: 'solo', l: 'Chọn việc riêng cho an toàn', res: function () { return { t: 'Bạn chọn việc riêng và giữ quan hệ ở mức công việc.', tone: 'neutral' }; } } ] },
      strained: { title: 'Không khí nặng nề', text: 'Mọi người trong nhóm bắt đầu nhận ra hai bên không còn nói chuyện.', opts: [ { k: 'meet', l: 'Mời người kia uống nước, nói cho rõ', res: function (l, r) { return r() < 0.6 ? { t: 'Cuối cùng hai bên bắt tay làm hòa và rút kinh nghiệm.', tone: 'good', fx: { soc: 1 }, stress: -3 } : { t: 'Cuộc gặp gượng gạo, nhưng ít nhất bầu không khí đỡ căng.', tone: 'neutral' }; } }, { k: 'move', l: 'Xin sang nhóm khác nếu có thể', res: function (l, r) { return r() < 0.5 ? { t: 'Bạn sang nhóm mới, làm lại từ đầu.', tone: 'neutral', fx: { soc: -1 } } : { t: 'Chưa có chỗ trống, bạn tiếp tục như cũ.', tone: 'neutral', stress: 1 }; } } ] }
    } });

  QT('q91_phone', { a0: 62, a1: 92, title: 'Học dùng điện thoại gọi video',
    text: 'Con cháu ở xa muốn gọi video cho bạn mỗi tuần. Màn hình nhỏ, nút bấm khó, chữ chạy nhanh. Bạn vừa muốn học vừa ngại làm phiền.',
    opts: [
      { k: 'learn', l: 'Nhờ người thân chỉ từng bước', res: function (l, r) { return r() < 0.7 ? { t: 'Học vài buổi là bạn gọi được, nhìn thấy mặt cháu và bật cười.', tone: 'good', fx: { hap: 2, kno: 1, soc: 1 }, tag: 'connected', next: [1, 2] } : { t: 'Bạn học khá chậm nhưng không bỏ cuộc. Người thân kiên nhẫn chỉ lại.', tone: 'neutral', fx: { kno: 1 }, tag: 'connected', next: [1, 2] }; } },
      { k: 'call', risk: { p: 0.25, t: 'Cháu gọi video mà bạn không nghe được, hai bên nói hụt hẫng. Bạn thấy mình lạc hậu.', fx: { hap: -1 }, stress: 1 }, l: 'Chỉ dùng gọi thoại thường', res: function () { return { t: 'Bạn thấy yên tâm với cách quen thuộc, dù không nhìn thấy mặt cháu.', tone: 'neutral' }; } },
      { k: 'group', l: 'Tham gia lớp hướng dẫn cho người lớn tuổi ở khu phố', res: function () { return { t: 'Cả lớp cùng học, ai cũng sai thì cười xòa. Bạn quen thêm bạn mới.', tone: 'good', fx: { soc: 2, kno: 1 }, tag: 'connected', next: [1, 2] }; } }
    ],
    follow: { connected: { title: 'Gọi video mỗi tuần', text: 'Buổi gọi video đã thành thói quen. Có hôm có tin bất ngờ về người ở xa.', opts: [ { k: 'ask', l: 'Hỏi han kỹ và đề nghị giúp nếu cần', res: function () { return { t: 'Câu chuyện mở ra nhiều điều bạn chưa biết, hai bên thân hơn.', tone: 'good', fx: { soc: 2, hap: 1 } }; } }, { k: 'keep', l: 'Chỉ nghe và vui cùng', res: function () { return { t: 'Bạn chỉ lắng nghe, vẫn thấy ấm lòng.', tone: 'neutral', fx: { hap: 1 } }; } } ] } } });

  QT('q91_visitor', { a0: 65, a1: 96, when: function (l) { return (l.kids || []).length > 0; }, title: 'Con cháu về thăm',
    text: 'Con cháu báo sẽ về thăm vào dịp cuối tuần, nhưng bạn thì sức yếu hơn trước, nấu nướng và dọn dẹp đều mệt.',
    opts: [
      { k: 'prepare', l: 'Tự chuẩn bị bữa cơm như mọi khi', res: function (l, r) { return r() < 0.75 - Math.max(0, 50 - st(l, 'hea')) / 200 ? { t: 'Bạn nấu những món cả nhà thích. Bữa cơm đông đủ và ấm cúng.', tone: 'good', fx: { hap: 3, soc: 1 }, tag: 'visit', next: [1, 2] } : { t: 'Bạn mệt quá sức, bữa cơm vẫn vui nhưng bạn phải nằm nghỉ cả ngày sau.', tone: 'neutral', fx: { hea: -2, hap: 1 }, tag: 'visit', next: [1, 2] }; } },
      { k: 'order', l: 'Nhờ mang đồ ăn sẵn, cả nhà cùng ăn', res: function () { return { t: 'Cả nhà quây quần ăn uống, bạn có nhiều sức để trò chuyện hơn.', tone: 'good', fx: { hap: 2, soc: 1 }, tag: 'visit', next: [1, 2] }; } },
      { k: 'decline', risk: { p: 0.3, t: 'Bạn chờ ở cửa sổ cả buổi chiều dù đã bảo họ đừng về. Tối đó bạn rất cô đơn.', fx: { hap: -2 }, stress: 2 }, l: 'Hẹn dịp khác vì sợ phiền con cháu', res: function () { return { t: 'Con cháu hơi tiếc nhưng không ép. Bạn thấy hơi cô đơn sau đó.', tone: 'neutral', fx: { hap: -1 } }; } }
    ],
    follow: { visit: { title: 'Lời dặn lúc chia tay', text: 'Lần chia tay trước, người nhà bảo sẽ về thường xuyên hơn. Bạn cũng muốn nói điều gì đó.', opts: [ { k: 'say', l: 'Nói thật điều mình mong', res: function (l, r) { return r() < 0.8 ? { t: 'Người nhà lắng nghe và hứa sắp xếp thăm đều hơn. Bạn nhẹ lòng.', tone: 'good', fx: { hap: 2 }, stress: -2 } : { t: 'Họ bận nên chưa hứa được nhiều. Bạn hiểu và không trách.', tone: 'neutral' }; } }, { k: 'hold', l: 'Giữ trong lòng, không muốn làm phiền', res: function () { return { t: 'Bạn không nói gì, nhưng mong chờ lần sau.', tone: 'neutral', fx: { hap: -1 } }; } } ] } } });

  QT('q91_steps', { a0: 1, a1: 2, child: true, title: 'Những bước đi đầu tiên',
    text: 'Bạn đang vịn mép ghế, chân run run, mắt nhìn về phía người lớn đứng cách vài bước và giang tay ra.',
    opts: [
      { k: 'walk', l: 'Buông tay và bước thử', res: function (l, r) { return r() < 0.6 ? { t: 'Bạn lẫm chẫm đi được ba bước rồi ngã vào lòng người lớn. Cả nhà reo lên.', tone: 'good', fx: { hap: 2, hea: 1 }, tag: 'bold', next: [1, 2] } : { t: 'Bạn ngã ngồi xuống và òa khóc, nhưng vài phút sau lại đứng dậy thử tiếp.', tone: 'neutral', fx: { hap: -1 }, tag: 'bold', next: [1, 2] }; } },
      { k: 'crawl', l: 'Vẫn bò cho chắc, chưa muốn đứng', res: function () { return { t: 'Bạn bò nhanh thoăn thoắt khắp nhà và có vẻ chưa vội đi.', tone: 'neutral', tag: 'careful', next: [1, 2] }; } },
      { k: 'hold', l: 'Nắm tay người lớn đi từng bước', res: function () { return { t: 'Có bàn tay đỡ, bạn đi hết hành lang mà không sợ. Người lớn cười hiền.', tone: 'good', fx: { soc: 1, hap: 1 }, tag: 'careful', next: [1, 2] }; } }
    ],
    follow: {
      bold: { title: 'Chạy nhảy khắp nhà', text: 'Bạn giờ đã chạy lăng xăng, thấy gì cũng muốn chạm vào.', opts: [ { k: 'explore', l: 'Để bạn khám phá trong góc an toàn', res: function () { return { t: 'Góc chơi an toàn giúp bạn tha hồ nghịch mà không bị thương.', tone: 'good', fx: { kno: 1, hap: 1 } }; } }, { k: 'restrain', l: 'Giữ bạn trong tầm tay', res: function (l, r) { return r() < 0.3 ? { t: 'Bạn vùng vẫy và ngã xước đầu gối khi người lớn lơ đễnh một chút.', tone: 'bad', fx: { hea: -1 } } : { t: 'Bạn bị giữ nhiều nên hơi cáu, nhưng an toàn.', tone: 'neutral' }; } } ] },
      careful: { title: 'Thích đi theo nhịp riêng', text: 'Bạn đi vững hơn nhưng vẫn thích dò dẫm trước khi thử điều mới.', opts: [ { k: 'encourage', l: 'Được khuyến khích thử từng chút', res: function () { return { t: 'Mỗi bước nhỏ đều được người lớn khen. Bạn dần tự tin hơn.', tone: 'good', fx: { hap: 1, soc: 1 } }; } }, { k: 'own', l: 'Cứ để bạn tự quen', res: function () { return { t: 'Bạn tự tìm cách riêng và cũng sớm chạy nhảy được như bao bạn khác.', tone: 'neutral' }; } } ] }
    } });

  E.LIFE9110 = { ids: ALL.slice(), Q: Q };
})(globalThis.G);
