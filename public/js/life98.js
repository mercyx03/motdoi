/* v7.7.0 — Chiến dịch sinh tồn riêng cho Hardcore. Không thay đổi registry TRIG của chế độ thường. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, catalog = [], legacy = E.HARDCORE_EVENTS.slice();
  var rules = E.DIFFICULTIES.hardcore;
  rules.income = 0.18; rules.passive = 0.12; rules.pension = 0.45; rules.events = 1; rules.cap = 6;
  function hard(l) { return l.difficulty === 'hardcore'; }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.flags.military && l.age < l.flags.military) && !(l.abroad && l.abroad.trapped); }
  function care(l) { var f = l.fam || {}; return f.mAlive && f.fAlive && !f.noDad ? 'bố mẹ' : f.mAlive ? 'mẹ' : f.fAlive && !f.noDad ? 'bố' : 'người chăm sóc'; }
  function context(l) {
    var f = l.fam || {}, family = l.age < 18 || !l.indep;
    if (family) {
      var inc = ((f.mAlive ? f.mInc || 0 : 0) + (f.fAlive && !f.noDad ? f.fInc || 0 : 0)) * 12 / Math.max(1, l.base);
      if (f.elite || l.royal || f.q >= 4 || inc >= 2.6) return 'wealthy';
      return f.q >= 3 || inc >= 1.6 ? 'comfortable' : 'struggling';
    }
    var worth = E.netWorth(l) / Math.max(1, l.base), cash = l.money / Math.max(1, l.base);
    if (cash >= 5 || (worth >= 40 && cash >= 1)) return 'wealthy';
    return cash >= 0.5 || (l.ownHouse && cash >= 0.2) ? 'comfortable' : 'struggling';
  }
  E.hardcoreContext = context;
  function environment(h, c) {
    if (c === 'wealthy') return h.pressure >= 70 ? 'kỳ vọng cao, ít lắng nghe' : h.pressure >= 45 ? 'bận rộn, ít thời gian bên con' : 'đủ đầy, có người lắng nghe';
    if (c === 'comfortable') return h.pressure >= 70 ? 'khắt khe, thường so sánh' : h.pressure >= 45 ? 'bận rộn, khó chia sẻ' : 'ổn định, có chỗ dựa';
    return h.pressure >= 70 ? 'khắt khe, ít lắng nghe' : h.pressure >= 45 ? 'căng thẳng vì cơm áo' : 'thiếu thốn nhưng biết đùm bọc';
  }
  function state(l) {
    if (l.flags.hcSurvival) {
      var old = l.flags.hcSurvival;
      // Repair existing saves too; an exhausted abstract meter never makes a rich household poor.
      if (l.age < 18) { old.style = environment(old, context(l)); if (context(l) === 'wealthy') { old.resources = 100; old.gap = 0; } }
      return old;
    }
    var r = H.rf(l), x = r(), q = (l.fam && l.fam.q) || 2;
    var h = l.flags.hcSurvival = { resources: Math.min(75, 14 + q * 9), gap: 0, emotion: 28 + Math.floor(r() * 15), trauma: x < 0.68 ? 18 : 8,
      pressure: x < 0.68 ? 75 : x < 0.92 ? 50 : 25, style: x < 0.34 ? 'khắt khe, thường so sánh' : x < 0.68 ? 'bất ổn, ít lắng nghe' : x < 0.92 ? 'căng thẳng vì cơm áo' : 'có chỗ dựa nhưng thiếu điều kiện',
      training: 0, support: 0, seen: {}, breakthroughRoll: r(), opportunity: false, resolved: 0 };
    h.style = environment(h, context(l)); if (context(l) === 'wealthy') h.resources = 100;
    return h;
  }
  var create = E.createLife;
  E.createLife = function (opts) { var l = create.apply(this, arguments); if (hard(l)) { var h = state(l); l.st.hap = Math.min(l.st.hap, 38 + h.emotion * 0.35); } return l; };
  var policies = {
    protect: { reserve: -7, emotion: 2, trauma: -1, hap: 1, label: 'Dùng quỹ gia đình để bảo vệ sức khỏe, cảm xúc' },
    endure: { reserve: 2, emotion: -2, trauma: 3, hap: -2, kno: -0.5, stress: 2, label: 'Tiết kiệm trước mắt, tăng tổn thương và áp lực' },
    learn: { reserve: -3, emotion: -1, kno: 2, hea: -0.4, training: 1, label: 'Đổi thời gian và sức lực lấy nền tảng học tập' },
    support: { reserve: -2, fee: 0.15, emotion: 3, trauma: -2, soc: 1, stress: -3, support: 0.25, label: 'Tìm chỗ dựa; tốn thời gian hoặc một phần chi phí' },
    defy: { reserve: 0, emotion: 1, trauma: 2, soc: -1, hap: -1, label: 'Giữ tiếng nói của mình, chấp nhận xung đột' },
    patch: { reserve: -2, fee: 0.25, emotion: -1, hea: -0.5, label: 'Giải quyết tạm với chi phí thấp, còn bất tiện' },
    rest: { reserve: -3, fee: 0.35, emotion: 2, hea: 0.7, kno: -0.7, stress: -4, label: 'Giữ sức và ổn định cảm xúc, chậm tiến độ' },
    work: { reserve: 5, fee: 0, emotion: -2, kno: -1, hea: -0.7, stress: 3, label: 'Góp sức xoay xở, ít thời gian học và nghỉ' },
    plan: { reserve: -3, fee: 0, emotion: 0.5, trauma: -0.5, kno: 0.5, hea: -0.2, training: 0.25, label: 'Xử lý từng bước, tốn thời gian và chậm tiến độ khác' },
    pay: { reserve: -7, fee: 1, emotion: 1, stress: -1, label: 'Trả đủ chi phí để giải quyết dứt điểm' },
    hold: { reserve: 1, fee: 0, emotion: -2, stress: 3, hap: -1, label: 'Giữ tiền nhưng áp lực chưa được giải quyết' },
    train: { reserve: -4, fee: 0.45, emotion: 1, kno: 2, training: 1, stress: 1, label: 'Đầu tư tay nghề; chưa có thu nhập ngay' },
    overwork: { reserve: 4, fee: 0.1, emotion: -2, hea: -1.5, stress: 5, label: 'Gắng thêm để bù đắp, hao sức và căng thẳng' },
    boundary: { reserve: 0, fee: 0, emotion: 1, trauma: -1, stress: 1, soc: -1, label: 'Đặt giới hạn; quan hệ có thể căng thẳng' },
    recover: { reserve: -3, fee: 0.35, emotion: 2, trauma: -2, stress: -5, hea: 1, label: 'Phục hồi có kế hoạch, tốn thời gian và chi phí' },
    quit: { reserve: 0, fee: 0.25, emotion: 1, stress: -3, quit: true, label: 'Rời công việc hiện tại; phải tìm việc lại' }
  };
  var phases = { baby: [0, 2], preschool: [3, 5], primary: [6, 10], teen: [11, 14], youth: [15, 17], young: [18, 29], adult: [30, 49], middle: [50, 64], elder: [65, 115] };
  function bound(h) { h.emotion = U.clamp(h.emotion, 0, 100); h.trauma = U.clamp(h.trauma, 0, 100); h.resources = U.clamp(h.resources, 0, 100); h.gap = U.clamp(h.gap, 0, 100); }
  function amount(l, r) { return l.base * (0.045 + r() * 0.10) * (l.age >= 65 ? 0.75 : 1); }
  function apply(l, p, d, label, log, r) {
    var h = state(l), family = l.age < 18 || !l.indep, fee = family ? 0 : d.amount * (p.fee || 0);
    if (p === policies.support && l.money < fee) fee = 0;
    if (!family && fee > 0) H.cash(l, -fee, label);
    h.emotion += p.emotion || 0; h.trauma += p.trauma || 0; h.training += p.training || 0; h.support = Math.min(6, h.support + (p.support || 0));
    if (p === policies.support) h.supportAt = l.age;
    H.fx(l, { hea: p.hea || 0, hap: p.hap || 0, kno: p.kno || 0, soc: p.soc || 0 });
    if (l.mind && l.age >= 12) l.mind.stress = U.clamp(l.mind.stress + (p.stress || 0), 0, 100);
    if (p.quit && l.job && !E.isStableService(l)) { l.lastJob = l.job; l.job = null; l.flags.needJob = true; }
    h.resolved++; l.flags.hardcoreShocks = (l.flags.hardcoreShocks || 0) + 1; bound(h);
    log(label + (fee > 0 ? ': ' + H.money(l, fee) + '.' : '.'), p.emotion > 1 ? 'neutral' : 'bad');
    if (l.age >= 3 && l.age < 18 && r && /^(Xin|Nhờ người lớn|Nhờ người thân)/.test(label)) {
      if (r() < h.pressure / 120) { h.emotion = Math.max(0,h.emotion-Math.max(0,p.emotion||0)*0.7); h.trauma = Math.min(100,h.trauma+1); log(U.cap(care(l)) + ' chưa chịu nghe hết. Bạn buồn, dù đã cố nói điều mình cần.', 'bad'); }
      else log(U.cap(care(l)) + ' dừng lại để nghe bạn nói. Lần này, lời đề nghị được tiếp nhận.', 'good');
    }
  }
  var alternatives = {};
  function alternative(key, title, text, opts) { alternatives[key] = { title: title, text: text, opts: opts }; }
  var childChoices = {
    nha_tre: [['Nói với cô rằng con đang sợ','support'],['Im lặng dù vẫn chưa quen lớp','endure'],['Thử làm quen với một bạn trước','plan']],
    so_sanh: [['Nói con muốn được thử từ từ','protect'],['Im lặng vì sợ bị chê thêm','endure'],['Kể với một người lớn mình tin','support']],
    so_hai: [['Nói rõ điều đang làm mình sợ','protect'],['Cố nín dù vẫn rất sợ','endure'],['Xin nắm tay người quen một lúc','support']],
    chuyen_tro: [['Xin mang theo món đồ mình quen','plan'],['Giữ nỗi buồn, không nói gì','endure'],['Nói mình nhớ chỗ ở cũ','support']],
    do_choi_cu: [['Nhờ người lớn cùng sửa món đồ','support'],['Giấu nỗi buồn và cất món đồ đi','endure'],['Thử làm món đồ chơi từ giấy','plan']],
    la_mang: [['Nói mình lỡ tay rồi phụ nhặt đồ an toàn','protect'],['Không dám thử nữa vì sợ bị mắng','endure'],['Kể lại chuyện với người mình tin','support']],
    gio_an: [['Nói mình cần thêm một chút thời gian','plan'],['Cố ăn thật nhanh dù đang khó chịu','endure'],['Nói khi đã no hoặc thấy không khỏe','protect']],
    giao_tiep: [['Tự xem tranh rồi kể điều mình thấy','learn'],['Lặng lẽ chơi một mình','patch'],['Xin người thân nghe một câu chuyện','support']],
    chia_tay: [['Nói con muốn chào tạm biệt trước','protect'],['Nén khóc dù chưa thấy yên tâm','endure'],['Tìm cô giáo và nói mình nhớ nhà','support']],
    den_hoc: [['Xin người lớn giúp sắp chỗ học','support'],['Tìm lúc yên tĩnh để đọc bài','learn'],['Cố học dù thường bị ngắt quãng','patch']],
    viec_nha: [['Xin để việc nhà sau giờ học','plan'],['Nhận hết vì sợ người lớn giận','work'],['Nhờ người thân chia giúp một phần','support']]
  };
  function version(l, key, title, text, opts) { var v = context(l) !== 'struggling' && alternatives[key] || { title: title, text: text, opts: opts }; return l.age >= 3 && l.age < 11 && childChoices[key] ? { title:v.title, text:v.text, opts:childChoices[key] } : v; }
  function story(phase, key, title, text, opts, need) {
    var ages = phases[phase], id = 'hc_story_' + key;
    var meta = { id: id, phase: phase, min: ages[0], max: ages[1], cd: ages[1] < 18 ? 20 : 4, maxN: ages[1] < 18 ? 1 : 30, need: need || '' };
    catalog.push(meta);
    if (phase === 'baby') {
      E.SC(id,{title:title,tone:'dark',valid:function(l){return hard(l)&&free(l)&&l.age<3;},text:function(l){return version(l,key,title,text,opts).text.replace(/\{care\}/g,care(l));},opts:[]});
      return;
    }
    E.SC(id, {
      title: function (l) { return version(l, key, title, text, opts).title; }, tone: 'dark',
      valid: function (l) { return hard(l) && free(l) && l.age >= meta.min && l.age <= meta.max && (need !== 'school' || !!l.school) && (need !== 'job' || (!!l.job && !l.retired && !E.isStableService(l))) && (need !== 'unemployed' || (!l.job && !l.school && !l.retired)); },
      prep: function (l, r, arg) { return { amount: arg && isFinite(arg.amount) && arg.amount >= 0 ? arg.amount : amount(l, r) }; },
      text: function (l) { return version(l, key, title, text, opts).text.replace(/\{care\}/g, care(l)); },
      opts: opts.map(function (o, i) { function choice(l) { return version(l, key, title, text, opts).opts[i]; } return { k: 'c' + i, l: function (l) { return choice(l)[0]; }, ai: { w: i === 1 ? 1.1 : 1 },
        req: function (l, d) { var p = policies[choice(l)[1]]; return (p !== policies.support || state(l).supportAt !== l.age) && (p === policies.support || l.age < 18 || !l.indep || !p.fee || l.money >= d.amount * p.fee); },
        h: function (l, d) { var p = policies[choice(l)[1]]; return l.age >= 18 && l.indep && p.fee ? (p === policies.support && l.money < d.amount * p.fee ? 'Tư vấn cộng đồng miễn phí' : H.money(l, d.amount * p.fee)) : ''; },
        run: function (l, r, log, d) { var o = choice(l), p = policies[o[1]], h = state(l); h.seen[id] = (h.seen[id] || 0) + 1; apply(l, p, d, o[0], log, r); if (E.hardcoreFollowup) E.hardcoreFollowup(l, key, o[1]); }
      }; }).concat([
        { k: 'slow', l: 'Chia nhỏ việc, chấp nhận tiến độ chậm', req: function (l) { return l.age >= 18; }, h: 'Không trả phí', ai: { w: 0.5 }, run: function (l, r, log, d) { var h = state(l); h.seen[id] = (h.seen[id] || 0) + 1; apply(l, policies.plan, d, 'Giải quyết từng bước: ' + version(l, key, title, text, opts).title.toLowerCase(), log); } },
        { k: 'wait', l: function (l) { return context(l) === 'struggling' ? 'Tạm cầm cự, giữ tiền cho nhu cầu thiết yếu' : 'Chưa giải quyết, giữ nhịp sống hiện tại'; }, req: function (l) { return l.age >= 18; }, h: 'Không trả phí', ai: { w: 0.5 }, run: function (l, r, log, d) { var h = state(l); h.seen[id] = (h.seen[id] || 0) + 1; apply(l, policies.hold, d, 'Gác lại chuyện ' + version(l, key, title, text, opts).title.toLowerCase(), log); } }
      ])
    });
  }
  // The campaign catalog is intentionally separate from E.TRIG.
  story('baby','sau_sinh','Khoản thiếu sau ngày chào đời','Sau khi bạn chào đời, {care} phải chia một khoản dự phòng mỏng cho nhiều nhu cầu.',[['Ưu tiên chăm sóc, hoãn mua sắm','protect'],['Cắt các khoản chăm sóc chưa cấp bách','endure'],['Nhờ điểm hỗ trợ cộng đồng','support']]);
  story('baby','giac_ngu','Người lớn kiệt sức vì thiếu ngủ','Bạn quấy đêm; người chăm sóc thiếu ngủ, trong nhà dễ cáu gắt.',[['Chia lại lịch trông trẻ','plan'],['Cố chịu, ai mệt tự xoay xở','endure'],['Xin một người tin cậy đỡ ca','support']]);
  story('baby','bua_an','Bữa ăn phải cân đong','Tiền ăn và những nhu cầu thiết yếu cạnh tranh với nhau. Gia đình phải quyết định khoản nào ưu tiên.',[['Giữ phần dinh dưỡng cho bé','protect'],['Thay bằng phương án rẻ nhất','patch'],['Nhờ tư vấn bữa ăn tiết kiệm','plan']]);
  story('baby','nguoi_trong','Không có người trông ổn định','Lịch trông trẻ bị đứt quãng, {care} phải xoay ca làm và giờ chăm bạn.',[['Chấp nhận giảm thời gian làm để chăm','protect'],['Đổi người trông liên tục cho kịp việc','endure'],['Tìm nhóm trông trẻ hỗ trợ nhau','support']]);
  story('baby','khong_khi','Tiếng cãi vã quanh chiếc nôi','Áp lực cơm áo khiến những người lớn trong nhà thường lớn tiếng gần chỗ bạn ngủ.',[['Thống nhất ngừng tranh cãi trước mặt bé','protect'],['Bỏ qua vì cho rằng bé chưa hiểu','endure'],['Tách chỗ nghỉ và chia việc rõ ràng','plan']]);
  story('baby','tai_kham','Lần hẹn tái khám khó thu xếp','Một lịch kiểm tra sức khỏe định kỳ trùng ngày làm việc khó xin nghỉ.',[['Thu xếp đi đúng lịch','protect'],['Hoãn một đợt để giữ công việc','patch'],['Hỏi cơ sở y tế lịch phù hợp hơn','support']]);
  story('baby','nha_am','Chỗ ngủ ẩm và bí','Phòng ở ẩm, quần áo lâu khô. Gia đình phải chọn cách cải thiện chỗ ngủ của bạn.',[['Sửa lại chỗ nghỉ cho khô thoáng','protect'],['Chỉ che chắn tạm','patch'],['Sắp xếp lại sinh hoạt, ưu tiên chỗ bé','plan']]);
  story('baby','do_dung','Đồ thiết yếu đến kỳ thay','Một số đồ chăm trẻ đã xuống cấp đúng lúc quỹ dự phòng cạn.',[['Thay những món thực sự cần','protect'],['Dùng tiếp dù còn bất tiện','endure'],['Tìm đồ còn tốt từ nhóm hỗ trợ','support']]);
  story('baby','gan_ket','Không đủ thời gian vỗ về','Những người chăm sóc quá bận, bạn thường phải chờ khá lâu mới được dỗ dành.',[['Chừa một khoảng riêng để gần gũi bé','protect'],['Để bé tự nín cho người lớn làm việc','endure'],['Chia lại việc để có người ở cạnh','plan']]);
  story('preschool','nha_tre','Chỗ gửi trẻ không vừa túi tiền','Chỗ gửi trẻ phù hợp vượt khoản gia đình dự tính, còn chỗ rẻ hơn khá xa.',[['Giữ chỗ phù hợp, cắt chi khác','protect'],['Đi xa mỗi ngày để giảm phí','patch'],['Tìm suất hỗ trợ tại địa phương','support']]);
  story('preschool','so_sanh','Bị đem so với đứa trẻ khác','{care} liên tục đem bạn so với một đứa trẻ lanh lợi hơn. Bạn bắt đầu sợ làm sai.',[['Người lớn ngừng so sánh, dạy từng bước','protect'],['Ép bạn cố hơn bằng lời chê','endure'],['Nhờ người có kinh nghiệm góp ý','support']]);
  story('preschool','so_hai','Nỗi sợ bị coi là làm nũng','Bạn sợ một nơi lạ nhưng người lớn đang vội, khó kiên nhẫn nghe bạn.',[['Cho bạn thời gian làm quen','protect'],['Buộc phải tự chịu ngay','endure'],['Nhờ một người quen đi cùng buổi đầu','support']]);
  story('preschool','chuyen_tro','Gia đình phải đổi chỗ ở','Việc chuyển chỗ ở khiến nhịp sinh hoạt của bạn đảo lộn.',[['Giữ lại đồ quen và nếp ngủ','plan'],['Ưu tiên chuyển cho nhanh','patch'],['Dành thời gian giúp bạn thích nghi','protect']]);
  story('preschool','do_choi_cu','Món đồ chơi được vá nhiều lần','Món đồ bạn thích lại hỏng; gia đình không dễ mua món thay thế.',[['Cùng sửa, coi đó là thời gian bên nhau','support'],['Bỏ đi và bắt bạn thôi đòi hỏi','endure'],['Làm món thay thế từ đồ sẵn có','plan']]);
  story('preschool','la_mang','Một lỗi nhỏ bị mắng rất lâu','Bạn làm đổ đồ. Phản ứng gay gắt của người lớn khiến bạn né tránh thử điều mới.',[['Giải thích rồi cùng dọn','protect'],['Mắng để bạn nhớ thật lâu','endure'],['Nhận ra quá lời, chủ động làm hòa','support']]);
  story('preschool','gio_an','Bữa ăn trong căng thẳng','Bạn ăn chậm, còn người lớn phải chạy đua với giờ làm.',[['Điều chỉnh giờ ăn, kiên nhẫn hơn','plan'],['Gây sức ép để ăn cho nhanh','endure'],['Giảm việc khác để giữ nhịp ăn ngủ','protect']]);
  story('preschool','giao_tiep','Ít cơ hội trò chuyện và khám phá','Trong nhà ai cũng bận; những lần kể chuyện, đi dạo với bạn ngày càng thưa.',[['Dành thời gian đọc và nói chuyện','learn'],['Chấp nhận để bạn tự chơi phần lớn','patch'],['Tham gia hoạt động cộng đồng phù hợp','support']]);
  story('preschool','chia_tay','Khóc khi phải xa người chăm sóc','Bạn khóc nhiều lúc được đưa đến chỗ gửi; người lớn cũng đang căng thẳng.',[['Tập chia tay từng bước','protect'],['Đưa đi thật nhanh dù bạn hoảng','endure'],['Nhờ người trông phối hợp làm quen','support']]);
  story('primary','sach_cu','Bộ sách đã qua nhiều tay','Bộ sách có trang thiếu và nhiều chỗ khó đọc, trong khi bài học vẫn phải theo kịp.',[['Mượn sách để chép bổ sung','learn'],['Dùng tạm, bỏ những phần thiếu','endure'],['Hỏi nơi hỗ trợ học liệu','support']],'school');
  story('primary','hoc_phi_phu','Các khoản thu nhỏ dồn lại','Đầu kỳ, nhiều khoản nhỏ cùng đến hạn. Gia đình phải chia lại quỹ sinh hoạt.',[['Lập danh sách ưu tiên cùng người lớn','plan'],['Giấu phiếu thu vì sợ bị mắng','endure'],['Nhờ nhà trường hướng dẫn hỗ trợ','support']],'school');
  story('primary','diem_thap','Điểm thấp đổi lấy một buổi tối nặng nề','{care} chú ý đến điểm số hơn điều bạn đang chưa hiểu.',[['Hỏi lại bài dù sợ bị chê','learn'],['Im lặng nhận mọi lời trách','endure'],['Tìm người hướng dẫn kiên nhẫn','support']],'school');
  story('primary','sang_som','Buổi sáng phải tự xoay xở','Người lớn đi làm sớm, bạn phải chuẩn bị nhiều việc hơn bạn bè cùng tuổi.',[['Chuẩn bị từ tối hôm trước','plan'],['Cố làm mọi việc trong vội vàng','work'],['Nhờ người tin cậy cùng kiểm tra','support']]);
  story('primary','bi_treu','Bị trêu vì đồ dùng cũ','Những lời trêu chọc làm bạn ngại xuất hiện trước bạn bè.',[['Nói với người lớn đáng tin','support'],['Giấu cảm xúc, chịu đựng một mình','endure'],['Tập nói rõ giới hạn của mình','defy']],'school');
  story('primary','den_hoc','Góc học tập thiếu ánh sáng','Chỗ học phải chia sẻ với sinh hoạt của cả nhà, bạn khó tập trung.',[['Dành một khoản sửa góc học','protect'],['Đổi giờ học để yên tĩnh hơn','learn'],['Học tạm trong điều kiện hiện có','patch']],'school');
  story('primary','viec_nha','Việc nhà chen vào giờ học','Bạn được giao thêm việc vừa sức, nhưng thời gian học và nghỉ bắt đầu thiếu.',[['Thống nhất giờ học không bị ngắt','plan'],['Nhận hết việc để tránh xung đột','work'],['Nhờ chia lại việc trong nhà','support']]);
  story('primary','mong_doi','Luôn phải là đứa trẻ ngoan','Bạn ít dám nói mệt vì sợ khiến người lớn thất vọng.',[['Tập nói điều mình đang cần','defy'],['Cố tỏ ra ổn dù rất buồn','endure'],['Tìm một người chịu lắng nghe','support']]);
  story('primary','duong_xa','Đường đến nơi học vất vả','Việc đi lại mất nhiều thời gian và khiến bạn ít giờ nghỉ hơn.',[['Sắp xếp lại giờ ngủ và chuẩn bị','plan'],['Dậy sớm hơn, chấp nhận mệt','work'],['Tìm người đi cùng và hỗ trợ','support']],'school');
  story('primary','bat_loi','Một lần bị hiểu lầm','Bạn giải thích nhưng không được tin, cảm giác bất lực theo bạn nhiều ngày.',[['Trình bày lại khi mọi người bình tĩnh','plan'],['Chịu nhận lỗi cho xong','endure'],['Nhờ người chứng kiến giúp nói rõ','support']]);
  story('primary','ngoai_khoa','Cơ hội trải nghiệm phải bỏ dở','Một hoạt động bạn rất thích cần thêm thời gian và kinh phí.',[['Ưu tiên học điều cần nhất','learn'],['Bỏ tất cả để gia đình đỡ lo','endure'],['Tìm phương án ít tốn kém hơn','support']],'school');
  story('primary','thieu_ngu','Thiếu ngủ vì nhịp sống trong nhà','Âm thanh và giờ giấc trong nhà làm bạn thường khó ngủ đủ.',[['Thống nhất lại giờ yên tĩnh','plan'],['Cố chịu, làm bù vào hôm sau','endure'],['Ưu tiên nghỉ dù chậm việc','rest']]);
  story('primary','khong_duoc_khoc','Bị bảo không được khóc','Khi bạn buồn, {care} gạt đi thay vì hỏi điều gì đã xảy ra.',[['Tìm cách kể lại cảm xúc','defy'],['Nén lại và tự trách mình','endure'],['Tâm sự với người an toàn hơn','support']]);
  story('primary','doi_lop','Khó hòa nhập sau thay đổi','Một thay đổi môi trường khiến bạn phải làm quen lại từ đầu.',[['Bắt đầu bằng một người bạn','support'],['Thu mình để tránh bị từ chối','endure'],['Tập tham gia từng việc nhỏ','learn']]);
  story('primary','qua_tai','Lịch học vượt sức','Người lớn xếp thêm nhiều việc học vì sợ bạn thua kém.',[['Xin giảm bớt một phần lịch','rest'],['Cố theo hết để được công nhận','learn'],['Nhờ người lớn khác cùng trao đổi','support']],'school');
  story('teen','diem_so','Cảm giác chỉ có giá trị khi điểm cao','Những lời khen chỉ đến khi bạn đạt điểm tốt; một lần sa sút trở thành áp lực lớn.',[['Tập trung hiểu bài thay vì chứng minh mình','learn'],['Giấu kết quả và chịu lo một mình','endure'],['Tìm người giúp tách điểm số khỏi giá trị bản thân','support']],'school');
  story('teen','quyen_rieng','Không có khoảng riêng','{care} muốn kiểm soát mọi chuyện, khiến bạn ít dám chia sẻ thật lòng.',[['Thương lượng một giới hạn cụ thể','defy'],['Làm theo tất cả để tránh cãi vã','endure'],['Nhờ người đáng tin làm cầu nối','support']]);
  story('teen','ban_be','Tình bạn bị nghi ngờ','Bạn bị gây sức ép phải cắt một mối quan hệ đang giúp mình bớt cô đơn.',[['Giải thích bằng những việc cụ thể','plan'],['Cắt liên lạc và chịu buồn','endure'],['Giữ kết nối có chừng mực','defy']]);
  story('teen','phu_giup','Gia đình cần thêm một đôi tay','Bạn phải dành nhiều buổi để hỗ trợ sinh hoạt, quỹ thời gian cho bản thân co lại.',[['Chia lịch để vẫn giữ việc học','plan'],['Gánh thêm dù kiệt sức','work'],['Xin giảm các kỳ vọng khác','rest']]);
  story('teen','mang_xa_hoi','So sánh mình với cuộc sống người khác','Những hình ảnh hào nhoáng làm bạn thấy mình thua kém và xấu hổ về xuất phát điểm.',[['Giảm tiếp xúc, giữ nhịp sống riêng','rest'],['Cố che giấu hoàn cảnh','endure'],['Nói chuyện thật với người tin cậy','support']]);
  story('teen','sai_lam_cu','Lỗi cũ liên tục bị nhắc lại','Một sai sót đã qua vẫn được dùng để phủ nhận nỗ lực hiện tại của bạn.',[['Nói rõ điều đó đang làm mình tổn thương','defy'],['Im lặng vì nghĩ mình đáng bị trách','endure'],['Tìm nơi giúp mình nhìn lại công bằng','support']]);
  story('teen','chon_mon','Môn học yêu thích bị xem nhẹ','Bạn muốn theo đuổi một môn, nhưng gia đình chỉ nhìn vào điều họ cho là dễ kiếm sống.',[['Tìm hiểu lộ trình và trình bày kế hoạch','learn'],['Bỏ sở thích để tránh tranh cãi','endure'],['Nhờ người có chuyên môn góp ý','support']],'school');
  story('teen','lo_au','Nỗi lo kéo dài khó gọi tên','Bạn hay căng thẳng nhưng không biết nói với ai; việc học và giấc ngủ đều bị ảnh hưởng.',[['Xin một buổi tư vấn phù hợp','support'],['Cố tự chịu để khỏi làm phiền','endure'],['Giảm tải và ổn định sinh hoạt','rest']]);
  story('teen','tai_lieu','Thiếu tài liệu để theo kịp','Bạn phải lựa chọn giữa mua học liệu và những khoản thiết yếu khác.',[['Tự hệ thống phần kiến thức đang có','learn'],['Bỏ những phần khó tiếp cận','patch'],['Tìm học liệu và nhóm học hỗ trợ','support']],'school');
  story('teen','danh_gia','Bị đánh giá là không có tương lai','Một lời kết luận nặng nề khiến bạn ngần ngại thử lại sau thất bại.',[['Đặt mục tiêu nhỏ có thể kiểm chứng','plan'],['Tin lời ấy và giảm cố gắng','endure'],['Tìm một người cố vấn khác','support']]);
  story('teen','gioi_han','Luôn phải đứng giữa căng thẳng của người lớn','Bạn được kéo vào những bất đồng không phải trách nhiệm của mình.',[['Nói rõ việc nào mình không thể gánh','defy'],['Cố làm vừa lòng tất cả','endure'],['Tìm người lớn an toàn để nhờ giúp','support']]);
  story('teen','ky_thi','Một kỳ đánh giá đến lúc tinh thần đi xuống','Bạn vẫn phải theo tiến độ trong khi cảm xúc và sức lực đều hụt.',[['Ôn phần cốt lõi có kế hoạch','learn'],['Cố nhồi thêm, ít nghỉ hơn','work'],['Giữ sức và chấp nhận mục tiêu thấp hơn','rest']],'school');
  story('youth','hoc_hay_lam','Áp lực kiếm tiền xuất hiện sớm','Gia đình muốn bạn sớm góp sức, trong khi nền tảng học tập còn dang dở.',[['Tìm lộ trình học nghề có kế hoạch','learn'],['Gác việc học để phụ gia đình','work'],['Nhờ tư vấn phương án hỗ trợ học tiếp','support']]);
  story('youth','tuong_lai','Tương lai bị quyết định thay','{care} muốn bạn đi theo một hướng dù bạn chưa hiểu mình phù hợp với điều gì.',[['Tìm hiểu năng lực trước khi quyết','plan'],['Chọn theo áp lực để nhà yên','endure'],['Nhờ người am hiểu cùng trao đổi','support']]);
  story('youth','on_thi','Ôn thi trong môi trường thiếu yên tĩnh','Việc trong nhà và những lời gây sức ép khiến mỗi giờ học đều khó tập trung.',[['Chia phần kiến thức và tự luyện','learn'],['Cố học đêm để bù lại','work'],['Tìm chỗ học và nhóm hỗ trợ','support']],'school');
  story('youth','hoc_phi','Chi phí học tiếp thành chủ đề căng thẳng','Mỗi lần nói đến học tiếp lại kéo theo tranh cãi về tiền và kỳ vọng.',[['Lập ngân sách cùng lộ trình thực tế','plan'],['Thôi nói vì sợ bị trách','endure'],['Tìm suất hỗ trợ và tư vấn nghề','support']]);
  story('youth','dong_trang_lua','Bạn bè có điều kiện đi nhanh hơn','Bạn nhìn thấy khoảng cách về thời gian, quan hệ và cơ hội, rồi tự nghi ngờ mình.',[['Tập trung một kỹ năng có thể học đều','learn'],['Thu mình vì thấy không có cửa','endure'],['Tìm nhóm cùng hoàn cảnh để tiến bộ','support']]);
  story('youth','bi_phu_nhan','Nỗ lực chưa được công nhận','Bạn đã cố gắng nhưng điều nhận lại vẫn là lời so sánh với người khác.',[['Ghi nhận tiến bộ bằng mục tiêu riêng','plan'],['Làm nhiều hơn để xin sự công nhận','work'],['Tập đặt giới hạn với lời chê','defy']]);
  story('youth','giay_to','Thiếu một bước chuẩn bị cho hồ sơ','Một thủ tục hoặc thông tin đến muộn làm kế hoạch học nghề, học tiếp bị chậm.',[['Tự kiểm tra và làm lại từng bước','learn'],['Chấp nhận bỏ cơ hội lần này','patch'],['Nhờ nơi tư vấn hướng dẫn','support']]);
  story('youth','duoi_suc','Cảm giác đuối sức trước ngã rẽ','Bạn sắp phải lựa chọn lớn nhưng đã mệt vì áp lực kéo dài.',[['Giảm tải để suy nghĩ tỉnh táo','rest'],['Quyết thật nhanh để khỏi bị thúc','endure'],['Tìm người nghe mình trước khi quyết','support']]);
  story('youth','niem_tin','Khó tin rằng mình có thể sống khác','Môi trường lớn lên làm bạn nghĩ thất bại là điều đã được định sẵn.',[['Thử một mục tiêu nhỏ và theo dõi kết quả','learn'],['Chỉ cố qua ngày, không tính xa','endure'],['Tìm một hình mẫu có xuất phát điểm gần mình','support']]);

  story('young','viec_dau','Việc đầu tiên không đủ trang trải','Một công việc chỉ đủ trả phần nhỏ chi phí; bạn phải chọn cách xây nền hay cầm cự.',[['Giữ việc và học thêm tay nghề','train'],['Nhận thêm ca dù hao sức','overwork'],['Lập lại ngân sách, giảm các khoản chưa cần','plan']]);
  story('young','phong_tro','Tiền chỗ ở ăn vào khoản dự phòng','Chi phí sinh hoạt và điều kiện chỗ ở buộc bạn đánh đổi giữa tiền, giấc ngủ và sự an toàn.',[['Chi đủ để ổn định chỗ ở','pay'],['Chấp nhận điều kiện tạm','patch'],['Tìm người hỗ trợ phương án hợp lý','support']]);
  story('young','ho_so_viec','Hồ sơ xin việc liên tục bị bỏ qua','Nhiều lần gửi hồ sơ chưa có kết quả. Bạn bắt đầu nghĩ mình không đủ tốt.',[['Học kỹ năng còn thiếu và sửa hồ sơ','train'],['Nộp thật nhiều trong mệt mỏi','overwork'],['Nhờ người có kinh nghiệm góp ý','support']],'unemployed');
  story('young','lam_khong_luong','Đề nghị làm thử kéo dài','Một cơ hội nghề nghiệp đòi bạn bỏ thêm thời gian trước khi có khoản thu rõ ràng.',[['Chỉ nhận phạm vi công việc có thỏa thuận','boundary'],['Cố làm thêm để được giữ lại','overwork'],['Đầu tư kỹ năng rồi tìm hướng khác','train']]);
  story('young','ky_nang_thieu','Thiếu đúng kỹ năng được yêu cầu','Bạn nhìn thấy một cơ hội nhưng còn thiếu kỹ năng hoặc chứng chỉ cần thiết.',[['Học đúng phần còn thiếu','train'],['Tạm giữ hướng hiện tại','hold'],['Nhờ cố vấn chọn lộ trình ít tốn kém','support']]);
  story('young','gui_ve','Áp lực phải chứng minh bằng tiền','Những người xung quanh trông đợi bạn sớm mang tiền về, trong khi bản thân vẫn thiếu ổn định.',[['Nói rõ mức mình có thể gánh','boundary'],['Gắng thêm để đáp ứng kỳ vọng','overwork'],['Thống nhất một kế hoạch cụ thể','plan']]);
  story('young','noi_kho','Thói quen tự trách theo đến tuổi lớn','Khi gặp một thất bại, những lời phủ nhận cũ lại vang lên trong đầu bạn.',[['Tìm hỗ trợ để hiểu vòng tự trách','recover'],['Dồn thêm công việc để khỏi nghĩ','overwork'],['Bắt đầu bằng một kế hoạch nhỏ','plan']]);
  story('young','doi_tac','Một thỏa thuận thiếu chắc chắn','Bạn phải lựa chọn giữa khoản thu trước mắt và những điều khoản chưa rõ ràng.',[['Dành công sức kiểm tra, yêu cầu rõ ràng','plan'],['Chấp nhận áp lực để giữ cơ hội','hold'],['Bỏ một khoản nhờ tư vấn phù hợp','pay']]);
  story('young','dut_viec','Công việc bấp bênh làm bạn khó thở','Lịch làm thay đổi và đòi hỏi tăng lên, còn khoản thu không tương xứng.',[['Ở lại nhưng đặt giới hạn công việc','boundary'],['Tiếp tục nhận thêm việc','overwork'],['Rời việc để tìm chỗ khác','quit']],'job');
  story('young','mang_luoi','Thiếu người chỉ đường','Bạn không có mạng lưới quan hệ để hỏi những điều cơ bản về việc làm và cơ hội.',[['Tham gia một nhóm nghề phù hợp','support'],['Tự học và xây từng kỹ năng','train'],['Chỉ bám những gì mình đã biết','hold']]);
  story('young','quy_du_phong','Một khoản phát sinh xóa kế hoạch tiết kiệm','Khoản dành dụm ít ỏi phải cạnh tranh với một nhu cầu thiết yếu mới.',[['Giải quyết đủ và lập lại quỹ','pay'],['Khắc phục tạm để giữ tiền','patch'],['Nhờ hỗ trợ, chia nhỏ việc phải làm','support']]);
  story('young','gan_bo','Khó gần gũi vì sợ bị tổn thương','Những trải nghiệm cũ khiến bạn khó tin vào sự hỗ trợ của người khác.',[['Tập xây một quan hệ có giới hạn an toàn','support'],['Giữ khoảng cách với tất cả','hold'],['Dành thời gian phục hồi cảm xúc','recover']]);
  story('adult','hai_dau','Trách nhiệm chồng lên nhau','Công việc, sinh hoạt và những lời nhờ cậy cùng đòi thời gian, trong khi sức lực có hạn.',[['Chia lại trách nhiệm cho rõ','boundary'],['Tự gánh thêm để mọi việc yên','overwork'],['Lập thứ tự ưu tiên cùng người liên quan','plan']]);
  story('adult','dung_chan','Nhiều năm mà thu nhập vẫn khó tăng','Bạn cảm thấy mắc kẹt: chỉ làm đủ qua tháng thì khó đầu tư cho bước tiếp theo.',[['Học một kỹ năng có thể dùng ngay','train'],['Làm thêm giờ để vá trước mắt','overwork'],['Nhờ người trong nghề xem lại lộ trình','support']]);
  story('adult','bi_chen','Bị đẩy phần khó mà ít được ghi nhận','Công việc tăng lên, còn công sức của bạn không được nhìn nhận tương xứng.',[['Làm rõ trách nhiệm và kết quả','boundary'],['Nhận thêm để hy vọng được công nhận','overwork'],['Đầu tư năng lực để có lựa chọn khác','train']]);
  story('adult','suc_ben','Sức bền bị bào mòn','Nhịp sống kéo dài khiến bạn có ít sức hơn để học điều mới hay chăm bản thân.',[['Dành một đợt để phục hồi','recover'],['Cố vượt qua bằng nhiều giờ làm hơn','overwork'],['Chia nhỏ mục tiêu để giữ nhịp','plan']]);
  story('adult','nang_do','Lần đầu gặp người chịu hướng dẫn','Một người có kinh nghiệm sẵn sàng góp ý, nhưng bạn phải dành thời gian và công sức theo đến cùng.',[['Đầu tư nghiêm túc cho hướng dẫn này','train'],['Chỉ xin vài lời khuyên trước mắt','support'],['Hoãn lại vì còn quá nhiều áp lực','hold']]);
  story('adult','chi_phi_nghe','Nghề thay đổi, kỹ năng cũ hụt dần','Cách làm việc mới khiến kinh nghiệm cũ chưa đủ để giữ thu nhập.',[['Học lại phần công cụ cần thiết','train'],['Cố làm nhiều hơn bằng cách cũ','overwork'],['Nhờ nhóm nghề chia sẻ cách chuyển đổi','support']]);
  story('adult','khong_duoc_tu_choi','Khó từ chối vì sợ mất chỗ đứng','Bạn nhận ra mình thường đồng ý cả khi đã quá tải, giống cách từng làm lúc nhỏ.',[['Tập từ chối từng yêu cầu quá mức','boundary'],['Tiếp tục làm vừa lòng mọi người','overwork'],['Tìm hỗ trợ để thay đổi thói quen','recover']]);
  story('adult','cham_tra','Một khoản phải thu đến chậm','Tiền chưa về đúng lúc, trong khi những khoản thiết yếu vẫn phải xử lý.',[['Sắp lại dòng tiền và yêu cầu lịch rõ ràng','plan'],['Cắt mọi thứ có thể cắt tạm','patch'],['Nhận việc phụ để bù khoảng trống','overwork']]);
  story('adult','kho_bat_dau','Sợ bắt đầu vì từng thất bại','Một hướng đi mới có vẻ phù hợp, nhưng bạn liên tục nghĩ đến những lần bị chê trước đây.',[['Thử từng bước nhỏ có kiểm soát','train'],['Giữ nguyên dù đang bế tắc','hold'],['Nhờ người cố vấn đánh giá cùng','support']]);
  story('adult','rang_buoc','Những kỳ vọng cũ vẫn theo sát','Dù đã trưởng thành, bạn vẫn bị gây sức ép phải sống theo lựa chọn của người khác.',[['Nêu rõ giới hạn và trách nhiệm của mình','boundary'],['Nhượng bộ để tránh một cuộc cãi vã','hold'],['Tìm chỗ dựa để giữ lựa chọn dài hạn','support']]);
  story('adult','viec_xau_di','Chỗ làm trở nên khó chịu đựng','Điều kiện làm việc bấp bênh hơn; ở lại hay rời đi đều có giá phải trả.',[['Giữ giới hạn trong lúc tìm phương án','boundary'],['Ở lại và cố gắng bù phần thiếu','overwork'],['Rời công việc hiện tại','quit']],'job');
  story('adult','nghi_ngoi','Một khoảng nghỉ cũng thành bài toán tiền','Bạn cần nghỉ để hồi sức nhưng lo mọi khoản sẽ dồn lại.',[['Dành ngân sách cho một đợt hồi phục','recover'],['Tiếp tục gồng để giữ dòng tiền','overwork'],['Nhờ hỗ trợ, sắp lại nhịp sống','support']]);
  story('middle','nghe_moi','Đổi nghề khi đã có tuổi','Một kỹ năng từng nuôi sống bạn không còn đủ đáp ứng công việc hiện tại.',[['Học phần nghề mới thực sự cần','train'],['Bám cách cũ, làm thêm cho đủ','overwork'],['Nhờ tư vấn hướng chuyển vừa sức','support']]);
  story('middle','suc_khoe_tien','Giữ sức khỏe hay giữ khoản dự phòng','Nhu cầu chăm sức khỏe và những khoản sinh hoạt buộc bạn phải sắp lại ưu tiên.',[['Ưu tiên chăm sóc, cắt khoản chưa cần','recover'],['Chỉ xử lý những phần cấp bách','patch'],['Lập lại kế hoạch với người hỗ trợ','plan']]);
  story('middle','tuoi_tac','Bị đánh giá thấp vì tuổi tác','Bạn cảm thấy kinh nghiệm của mình không còn được lắng nghe như trước.',[['Cập nhật kỹ năng để chứng minh bằng việc làm','train'],['Tự làm nhiều hơn dù hao sức','overwork'],['Tìm môi trường và người ghi nhận phù hợp','support']]);
  story('middle','nha_xuong_cap','Những đồ dùng cũ đồng loạt xuống cấp','Nhiều thứ thiết yếu đã dùng quá lâu, thay cùng lúc vượt sức quỹ hiện tại.',[['Thay phần quan trọng nhất','pay'],['Sửa tạm, kéo dài thời gian dùng','patch'],['Chia lịch xử lý từng khoản','plan']]);
  story('middle','hut_du_phong','Quỹ cho tuổi già chậm hơn dự tính','Bạn nhìn lại và thấy khoản tích lũy còn xa mức mình từng hy vọng.',[['Điều chỉnh mục tiêu và kế hoạch chi','plan'],['Cố nhận thêm việc dù ít sức','overwork'],['Nhờ người đáng tin cùng rà ngân sách','support']]);
  story('middle','ton_thuong_cu','Những chuyện cũ trở lại lúc mệt mỏi','Khi sức lực giảm, cảm giác bị phủ nhận từ thời nhỏ lại khiến bạn khó giữ bình tĩnh.',[['Tìm hỗ trợ để gỡ từng phần','recover'],['Dồn mình vào công việc cho quên','overwork'],['Tập đặt giới hạn với những điều gây tổn thương','boundary']]);
  story('middle','co_doc','Khó nhờ ai dù đang rất cần','Bạn quen tự gánh nên thấy xấu hổ khi cần một bàn tay hỗ trợ.',[['Bắt đầu bằng một lời nhờ cụ thể','support'],['Tiếp tục tự chịu mọi việc','hold'],['Chia lại việc và trách nhiệm','boundary']]);
  story('middle','tinh_gon','Phải thu gọn cách sống','Thu nhập không tăng theo những nhu cầu mới, bạn phải bỏ bớt một số kỳ vọng.',[['Giữ phần thiết yếu và kế hoạch dài hạn','plan'],['Cắt cả những nhu cầu phục hồi','patch'],['Tìm cách giảm gánh nặng cùng người khác','support']]);
  story('middle','cham_nha','Việc chăm sóc chiếm phần lớn thời gian','Những nhu cầu hỗ trợ trong gia đình khiến bạn ít giờ dành cho công việc và bản thân.',[['Chia lại lịch và nguồn lực','plan'],['Tự ôm hết để khỏi phiền ai','overwork'],['Tìm một nguồn hỗ trợ phù hợp','support']]);
  story('middle','lam_vua_suc','Chấp nhận giới hạn sức lực','Bạn phải chọn giữa thêm một khoản thu nhỏ và giữ khả năng làm việc lâu dài.',[['Ưu tiên hồi phục để đi đường dài','recover'],['Nhận thêm phần việc ngay lúc này','overwork'],['Sắp lại công việc cho vừa sức','plan']]);
  story('elder','chi_phi_thuoc','Những khoản chăm sóc đều đặn','Những nhu cầu nhỏ về chăm sóc kéo dài khiến ngân sách tuổi già khó cân đối.',[['Dành đủ phần thiết yếu, giảm khoản khác','pay'],['Thu xếp tạm và theo dõi sát','patch'],['Nhờ hướng dẫn nguồn hỗ trợ phù hợp','support']]);
  story('elder','song_mot_minh','Tự xoay xở những việc từng rất dễ','Một việc sinh hoạt nhỏ giờ cần nhiều thời gian và sức lực hơn.',[['Thuê hoặc nhờ hỗ trợ phần khó','support'],['Cố tự làm để đỡ tốn','hold'],['Sắp lại môi trường sống cho thuận tiện','plan']]);
  story('elder','lo_tien','Nỗi lo tiền vẫn chưa thôi','Bạn khó nghỉ ngơi trọn vẹn khi nghĩ đến các khoản sắp đến hạn.',[['Rà lại phần thiết yếu cùng người tin cậy','plan'],['Nén lo lắng, tự cắt thêm chi tiêu','hold'],['Tìm hỗ trợ cho cả ngân sách và tinh thần','support']]);
  story('elder','di_lai','Đi lại trở thành một khoản lớn','Một lịch hẹn cần thiết kéo theo nhiều chi phí và công sức di chuyển.',[['Thu xếp đủ điều kiện đi lại','pay'],['Chọn cách tạm, chấp nhận bất tiện','patch'],['Nhờ người hỗ trợ sắp lịch phù hợp','support']]);
  story('elder','bi_gat_di','Ý kiến bị xem là không còn quan trọng','Bạn buồn khi những quyết định liên quan đến mình được nói qua mà ít hỏi ý.',[['Nói rõ điều mình vẫn muốn tự quyết','boundary'],['Im lặng để khỏi bị xem là phiền','hold'],['Tìm người chịu nghe và truyền đạt giúp','support']]);
  story('elder','thiet_bi','Một thiết bị sinh hoạt lại hỏng','Món đồ thiết yếu hỏng đúng khi thu nhập đã ít khả năng tăng.',[['Thay phần cần thiết cho an toàn','pay'],['Sửa tạm để tiếp tục dùng','patch'],['Lập lại cách dùng để giảm phụ thuộc','plan']]);
  story('elder','ky_uc','Ký ức khó khăn trỗi dậy','Một chuyện nhỏ khiến bạn nhớ lại những lần bị bỏ mặc hoặc phủ nhận trước đây.',[['Chia sẻ với người khiến mình thấy an toàn','support'],['Giữ trong lòng như đã quen','hold'],['Dành thời gian chăm lại cảm xúc','recover']]);
  story('elder','chap_nhan','Khó chấp nhận việc cần được giúp','Bạn sợ thành gánh nặng nên thường cố quá sức với những việc hằng ngày.',[['Chọn rõ phần nào nên nhờ hỗ trợ','plan'],['Tiếp tục cố để không phiền ai','hold'],['Xây một mạng lưới hỗ trợ vừa đủ','support']]);
  story('elder','tiet_kiem','Tiết kiệm đến mức quên nhu cầu của mình','Thói quen thiếu thốn làm bạn ngại cả những khoản thực sự cần cho sức khỏe và sự thoải mái.',[['Dành một phần hợp lý để chăm mình','recover'],['Giữ mọi khoản phòng khi có chuyện','hold'],['Nhờ người tin cậy cùng cân đối','support']]);
  story('elder','giu_lien_he','Giữ liên hệ cũng cần công sức','Bạn muốn có người để trò chuyện nhưng ngại mở lời và ngại làm phiền.',[['Chủ động một cuộc liên hệ nhỏ','support'],['Thu mình để khỏi phải nhờ vả','hold'],['Sắp lịch sinh hoạt có kết nối','plan']]);

  // Material scarcity has different causes and choices when basic needs are already covered.
  alternative('sau_sinh','Những cuộc gọi bên ngoài phòng bé','Sau ngày bạn chào đời, {care} vẫn bận với công việc. Người được thuê chăm bạn có mặt nhiều hơn người thân.',[['Tắt điện thoại, dành giờ riêng bên bé','protect'],['Giao hết cho người chăm để tiếp tục làm việc','endure'],['Chia lịch để người nhà luôn có mặt','plan']]);
  alternative('bua_an','Mỗi người một lời quanh bữa ăn','Đồ ăn được chuẩn bị đầy đủ, nhưng người lớn bất đồng về cách cho bạn ăn. Bữa ăn thường bị gián đoạn bởi những lời trách nhau.',[['Thống nhất cách chăm với người có chuyên môn','support'],['Ép ăn cho hết dù bé phản ứng','endure'],['Theo nhịp ăn của bé, ghi lại điều phù hợp','plan']]);
  alternative('nguoi_trong','Thay người chăm mà không báo trước','Bạn vừa quen một người chăm thì gia đình lại đổi người theo lịch công việc. Mỗi lần thức dậy, bạn tìm một gương mặt quen.',[['Cho người cũ và mới cùng chăm một thời gian','protect'],['Đổi ngay vì người lớn đã sắp lịch','endure'],['Giữ một người thân bên bé khi chuyển ca','plan']]);
  alternative('khong_khi','Cuộc tranh cãi ngoài phòng bé','{care} bất đồng về công việc và cách nuôi dạy. Tiếng lớn của người lớn thường lọt vào phòng bạn.',[['Ngừng tranh cãi khi ở gần bé','protect'],['Cho rằng phòng riêng đã đủ để bé không bị ảnh hưởng','endure'],['Dành một lúc khác để bàn chuyện người lớn','plan']]);
  alternative('tai_kham','Một lịch hẹn bị đẩy cho người khác','Gia đình đã đặt lịch khám, nhưng đến ngày thì ai cũng bận. Hồ sơ được giao cho người chăm trong khi bác sĩ cần hỏi người thân.',[['Một người thân đi cùng và nghe hướng dẫn','protect'],['Để người chăm tự lo toàn bộ','endure'],['Đổi lịch để người nhà có thể tham dự','plan']]);
  alternative('nha_am','Căn phòng đẹp nhưng khó ngủ','Phòng được trang bị đủ thứ, nhưng đèn và tiếng thiết bị khiến bạn khó ngủ. Người lớn lại sợ thay đổi sẽ làm hỏng nếp đã đặt ra.',[['Điều chỉnh phòng theo giấc ngủ của bé','protect'],['Giữ nguyên vì đã nhờ người thiết kế','endure'],['Thử từng thay đổi nhỏ rồi quan sát','plan']]);
  alternative('do_dung','Đồ mới liên tục, điều quen thuộc biến mất','Người lớn thường thay đồ chăm bé theo lời giới thiệu mới. Chiếc chăn bạn đã quen cũng bị cất đi mà không ai để ý.',[['Giữ lại món quen còn an toàn','protect'],['Thay tất cả theo bộ mới cho đồng nhất','endure'],['Hỏi người thường chăm bé trước khi thay','support']]);
  alternative('nha_tre','Ngôi trường được chọn thay bạn','Gia đình chọn nơi gửi trẻ theo danh tiếng, nhưng bạn sợ lớp quá đông và không quen nhịp sinh hoạt ở đó.',[['Cho bé thử lớp và trao đổi với cô','protect'],['Giữ quyết định vì trường được nhiều người khen','endure'],['Tìm môi trường hợp với bé hơn','plan']]);
  alternative('do_choi_cu','Món đồ cũ bị thay bằng đồ mới','Món đồ bạn thích bị hỏng. Người lớn mua ngay một món đắt hơn, nhưng bạn vẫn tìm món cũ vì những lần được chơi cùng người thân.',[['Cùng sửa món cũ và ngồi chơi với bé','support'],['Cất món cũ, bắt bé nhận đồ mới','endure'],['Hỏi bé muốn giữ lại điều gì','plan']]);
  alternative('sach_cu','Bộ sách được chọn theo thành tích','Bạn có đủ sách, nhưng người lớn muốn bạn học những cuốn vượt xa bài trên lớp. Bạn ngại nói rằng mình chưa hiểu.',[['Đọc từ phần vừa sức rồi hỏi lại','learn'],['Giả vờ hiểu để khỏi bị chê','endure'],['Nhờ người hướng dẫn chọn mức phù hợp','support']]);
  alternative('hoc_phi_phu','Khoản đóng góp đi cùng kỳ vọng','Gia đình đáp ứng các khoản của trường rất nhanh. Đổi lại, bạn thường được nhắc rằng với điều kiện như thế thì không được phép thua bạn bè.',[['Nói rõ điều đang khó trong việc học','plan'],['Giấu những lần sa sút vì sợ phụ lòng','endure'],['Nhờ cô giáo cùng trao đổi với gia đình','support']]);
  alternative('bi_treu','Bị nhìn qua điều kiện gia đình','Một vài bạn cho rằng điểm tốt hay đồ dùng của bạn đều nhờ gia đình lo sẵn. Bạn muốn được nhìn nhận bằng chính những gì mình làm.',[['Nói chuyện với người lớn đáng tin','support'],['Thu mình, không kể chuyện ở nhà nữa','endure'],['Nói rõ khi lời trêu đi quá xa','defy']]);
  alternative('den_hoc','Có phòng học riêng nhưng thiếu yên tĩnh','Bạn có góc học đầy đủ, nhưng liên tục bị gọi kiểm tra tiến độ, đổi gia sư và nhắc về điểm số.',[['Thỏa thuận một khoảng học không bị ngắt','plan'],['Làm thêm bài để người lớn yên tâm','learn'],['Im lặng học theo từng lần bị gọi','endure']]);
  alternative('ngoai_khoa','Hoạt động yêu thích không được coi trọng','Gia đình có thể thu xếp cho bạn tham gia, nhưng chỉ muốn chọn những lớp được xem là có ích cho hồ sơ thành tích.',[['Trình bày lý do muốn theo hoạt động này','learn'],['Bỏ sở thích để theo lịch đã chọn','endure'],['Nhờ giáo viên trao đổi về điều bạn thích','support']]);
  alternative('phu_giup','Lịch gia đình chiếm hết cuối tuần','Bạn được yêu cầu đi cùng người lớn trong những buổi gặp và hoạt động của gia đình. Thời gian học, nghỉ và gặp bạn bè ngày càng ít.',[['Thống nhất những buổi thực sự cần có mặt','plan'],['Đi đủ mọi buổi dù đã rất mệt','work'],['Xin giữ lại một ngày nghỉ của riêng mình','rest']]);
  alternative('mang_xa_hoi','Luôn phải trông như đang sống tốt','Hình ảnh gia đình và bạn được chia sẻ rất chỉn chu. Bạn thấy khó nói mình buồn khi mọi người đều cho rằng bạn chẳng thiếu gì.',[['Giảm thời gian xem và giữ khoảng riêng','rest'],['Cố đăng những điều vui để không ai hỏi','endure'],['Kể thật với một người mình tin','support']]);
  alternative('tai_lieu','Đủ học liệu nhưng không được tự chọn cách học','Bạn được mua nhiều khóa và tài liệu. Khi muốn học theo cách khác, bạn bị nhắc phải theo đúng thứ gia đình đã đầu tư.',[['Chọn phần phù hợp rồi giải thích kết quả','learn'],['Làm cho đủ các khóa dù không theo kịp','endure'],['Nhờ giáo viên cùng sắp lại tài liệu','support']]);
  alternative('hoc_hay_lam','Con đường nghề nghiệp đã được xếp sẵn','Gia đình đã nhờ người quen tìm một lộ trình cho bạn. Bạn chưa chắc mình muốn đi theo, nhưng việc từ chối bị xem là không biết quý cơ hội.',[['Tìm hiểu nghề và năng lực của mình trước','learn'],['Làm theo để tránh khiến gia đình mất mặt','endure'],['Nhờ người hướng nghiệp trao đổi cùng','support']]);
  alternative('hoc_phi','Được lo học phí, phải theo ngành đã chọn','Gia đình sẵn sàng trả tiền học nhưng muốn quyết định nơi học và ngành học. Điều bạn thích lại không nằm trong kế hoạch ấy.',[['Chuẩn bị một lộ trình riêng có căn cứ','plan'],['Im lặng nhận lựa chọn của gia đình','endure'],['Nhờ người am hiểu cùng nói chuyện','support']]);
  alternative('dong_trang_lua','Không muốn mọi thành quả bị quy về gia đình','Bạn có nhiều cơ hội hơn một số bạn bè, nhưng cũng thường nghe rằng mọi thứ của mình đều đã được sắp sẵn.',[['Theo đuổi một kỹ năng và tự làm đến cùng','learn'],['Tránh thử vì sợ bị đem ra so sánh','endure'],['Tìm nhóm có thể góp ý thẳng thắn','support']]);
  alternative('viec_dau','Công việc đầu dưới cái bóng gia đình','Công việc mới cho bạn chỗ bắt đầu, nhưng những người xung quanh kỳ vọng bạn phải tiến nhanh và luôn giữ hình ảnh thành công.',[['Học tay nghề, đặt mục tiêu vừa sức','train'],['Nhận hết việc để chứng minh mình','overwork'],['Thống nhất tiêu chí công việc rõ ràng','plan']]);
  alternative('phong_tro','Chỗ ở đầy đủ nhưng khó có khoảng riêng','Bạn thu xếp được chỗ ở ổn định. Những người liên quan vẫn muốn can thiệp vào giờ giấc và cách bạn sắp đặt cuộc sống.',[['Thu xếp lại chỗ ở để có không gian riêng','pay'],['Nhượng bộ để tránh tranh cãi','hold'],['Trao đổi về ranh giới sinh hoạt','boundary']]);
  alternative('gui_ve','Thành công luôn phải đem ra so sánh','Khoản bạn làm ra bị đặt cạnh thành tích người quen. Bạn cảm thấy mình phải liên tục chứng minh rằng đã đủ giỏi.',[['Nói rõ mục tiêu và giới hạn của mình','boundary'],['Nhận thêm việc để đuổi kịp lời so sánh','overwork'],['Đặt lại một kế hoạch do mình lựa chọn','plan']]);
  alternative('mang_luoi','Có nhiều mối quen nhưng thiếu người nói thật','Những lời giới thiệu đến với bạn khá dễ dàng. Khó hơn là tìm người dám chỉ ra điểm yếu mà không nể quan hệ hay lợi ích.',[['Tìm một người cố vấn độc lập','support'],['Tự học và nhờ đánh giá bằng sản phẩm','train'],['Chỉ nghe những người đã quen từ trước','hold']]);
  alternative('quy_du_phong','Một khoản chi trở thành cuộc tranh cãi','Bạn có thể thu xếp khoản phát sinh, nhưng người liên quan bất đồng về ai được quyết định và khoản nào đáng chi.',[['Xử lý nhu cầu cần thiết, làm rõ thỏa thuận','pay'],['Giải quyết tạm để tránh bàn thêm','patch'],['Nhờ người trung lập giúp trao đổi','support']]);
  alternative('dung_chan','Điều kiện tốt mà vẫn thấy mắc kẹt','Bạn không phải lo từng bữa, nhưng công việc lặp lại và kỳ vọng bên ngoài khiến bạn khó biết mình thực sự muốn tiến theo hướng nào.',[['Học một kỹ năng mình muốn làm chủ','train'],['Làm nhiều hơn để giữ hình ảnh bận rộn','overwork'],['Tìm cố vấn độc lập để xem lại hướng đi','support']]);
  alternative('cham_tra','Một khoản phải thu kéo theo bất đồng','Khoản thanh toán chậm chưa làm sinh hoạt đình trệ, nhưng cách đối tác lảng tránh khiến bạn khó tin vào những lời hẹn tiếp theo.',[['Yêu cầu lịch thanh toán bằng văn bản','plan'],['Tạm nhượng bộ để giữ quan hệ','hold'],['Dành công sức kiểm tra lại hợp đồng','boundary']]);
  alternative('nghi_ngoi','Có thể nghỉ nhưng không dám dừng','Bạn thu xếp được chi phí nghỉ ngơi, nhưng lại thấy có lỗi khi không làm việc hoặc sợ người khác cho rằng mình đã tụt lại.',[['Dành một đợt nghỉ và hỗ trợ hồi phục','recover'],['Tiếp tục nhận việc để khỏi thấy có lỗi','overwork'],['Nhờ người giúp tháo bớt trách nhiệm','support']]);
  alternative('suc_khoe_tien','Việc chăm sức khỏe liên tục bị lùi','Chi phí không phải trở ngại chính. Bạn vẫn hoãn việc chăm mình vì lịch công việc và những lời nhờ cậy không dứt.',[['Giữ lịch chăm sức khỏe đã hẹn','recover'],['Chỉ xử lý tạm để quay lại công việc','patch'],['Chia lại lịch và việc với người liên quan','plan']]);
  alternative('nha_xuong_cap','Sửa nhà thành cuộc giằng co','Bạn có thể thu xếp việc sửa và thay đồ, nhưng những người liên quan muốn quyết định theo ý riêng. Công việc bị kéo dài qua nhiều lần tranh luận.',[['Thuê người kiểm tra, chốt phần cần sửa','pay'],['Làm tạm một phần để tránh tranh cãi','patch'],['Thống nhất từng hạng mục trước khi làm','plan']]);
  alternative('hut_du_phong','Khó buông việc dù đã có tích lũy','Bạn đã có nền tảng cho tuổi già, nhưng vẫn sợ mất vị trí hoặc mất quyền quyết định nếu giảm công việc.',[['Lập kế hoạch bàn giao và giới hạn trách nhiệm','plan'],['Tiếp tục nhận việc để giữ vai trò','overwork'],['Trao đổi với người tư vấn độc lập','support']]);
  alternative('tinh_gon','Bỏ bớt những cuộc hẹn không còn muốn giữ','Bạn duy trì nhiều cuộc gặp và cam kết vì thể diện. Ngày trống để nghỉ ngơi ngày càng hiếm.',[['Giữ lại những việc thực sự có ý nghĩa','plan'],['Chỉ bớt những việc dễ từ chối nhất','patch'],['Nhờ người cùng sắp lại trách nhiệm','support']]);
  alternative('chi_phi_thuoc','Có người lo thuốc nhưng ít ai hỏi ý','Việc chăm sóc được thu xếp đầy đủ. Bạn vẫn thấy buồn khi mọi người chỉ trao đổi với nhau về lịch uống thuốc mà ít hỏi bạn đang cảm thấy thế nào.',[['Đặt lịch trao đổi trực tiếp với người chăm','pay'],['Thuận theo lịch dù còn điều muốn hỏi','hold'],['Nhờ một người chịu nghe nói giúp','support']]);
  alternative('lo_tien','Lo mất quyền quyết định về tài sản','Những cuộc bàn bạc về tài sản làm bạn bất an. Bạn muốn được hỏi ý trong khi người khác cho rằng họ đang lo giúp.',[['Rà lại giấy tờ và nói rõ mong muốn','plan'],['Im lặng để tránh gia đình căng thẳng','hold'],['Tìm tư vấn độc lập và người tin cậy','support']]);
  alternative('di_lai','Chuyến đi đã lo xong nhưng thiếu người bên cạnh','Phương tiện và lịch hẹn đã được sắp xếp. Bạn vẫn mong có một người thân cùng đi và nghe điều mình muốn nói.',[['Thu xếp người đồng hành phù hợp','pay'],['Đi theo lịch, giữ nỗi buồn cho riêng mình','hold'],['Chủ động nhờ một người mình tin','support']]);
  alternative('thiet_bi','Đồ dùng đổi mới mà chẳng ai hỏi','Người khác thay thiết bị trong nhà để bạn dùng thuận tiện hơn. Bạn lại khó quen và thấy mình không còn được quyết định những điều nhỏ.',[['Nhờ hướng dẫn và chỉnh theo thói quen của mình','pay'],['Cố dùng dù còn rất lúng túng','hold'],['Giữ lại cách dùng quen, đổi từng bước','plan']]);
  alternative('tiet_kiem','Ngại tiêu cho mình vì sợ bị phán xét','Bạn có thể chi cho nhu cầu riêng, nhưng những lời bình phẩm về lối sống khiến bạn ngần ngại cả những điều mình muốn.',[['Chọn một khoản hợp lý để chăm mình','recover'],['Gác mong muốn lại để khỏi bị bàn tán','hold'],['Tâm sự với người tôn trọng lựa chọn của mình','support']]);
  alternative('nghe_moi','Học lại nghề khi đã có chỗ đứng','Cách làm việc đã thay đổi. Bạn muốn học lại nhưng ngại bị người trẻ nhìn thấy những điều mình chưa biết.',[['Học công cụ mới từ phần cần nhất','train'],['Cố làm nhiều hơn để che phần chưa biết','overwork'],['Tìm nhóm cùng học không nặng chuyện tuổi tác','support']]);
  alternative('song_mot_minh','Khó quen với người hỗ trợ trong nhà','Bạn có thể thu xếp người giúp việc, nhưng chưa quen việc có người khác động vào những thứ mình từng tự lo.',[['Tìm người phù hợp và thống nhất cách giúp','support'],['Tự ôm hết việc dù đã ít sức','hold'],['Chọn rõ phần nào mình vẫn muốn tự làm','plan']]);
  function eligible(l, a) {
    var h = state(l), at = l.flags.hardcoreAt || {}, cd = l.flags.cd || {};
    return catalog.filter(function (m) { var seen = h.seen[m.id] || 0, last = Math.max(at[m.id] == null ? -999 : at[m.id], cd[m.id] == null ? -999 : cd[m.id]); return a >= m.min && a <= m.max && seen < m.maxN && a - last >= m.cd && E.DEC[m.id].valid(l, {}); });
  }
  function select(l, r, a, count) {
    var h = state(l), pool = eligible(l, a), out = [];
    while (pool.length && out.length < count) {
      var m = U.wpick(r, pool, function (x) { return 1 / (1 + (h.seen[x.id] || 0) * 2); });
      out.push(m); pool.splice(pool.indexOf(m), 1);
    }
    return out;
  }
  E.hardcoreEvent = function (l, r, a) { if (!hard(l) || !free(l) || a < 3) return null; var x = select(l, r, a, 1); return x.length ? x[0].id : null; };
  E.hardcoreTriggers = function (l, a) {
    if (!hard(l) || !free(l) || a < 3) return [];
    return select(l, H.rf(l), a, a < 18 || a >= 50 ? 2 : 3).map(function (m) { return { id: m.id, when: function (x) { return E.DEC[m.id].valid(x, {}); }, p: 1, cd: m.cd, max: m.maxN }; });
  };
  E.HARDCORE_CATALOG = catalog;
  E.hardcoreState = function (l) { return hard(l) ? state(l) : null; };
  var chains = [
    ['cho_o','Vấn đề chỗ ở chưa kết thúc','Phương án tạm trước đây không còn đủ. Bạn phải xử lý tiếp thay vì coi như khó khăn đã qua.'],
    ['tu_tin','Sự tự tin bị bào mòn','Sau những lần nén cảm xúc, bạn bắt đầu tránh cả những cơ hội mình có thể thử.'],
    ['tay_nghe','Học một kỹ năng chưa đủ để đổi đời','Bạn đã bắt đầu, nhưng cần duy trì luyện tập và tìm cơ hội dùng kỹ năng đó.']
  ];
  E.HARDCORE_CHAINS = [];
  chains.forEach(function (row) {
    [1, 2].forEach(function (step) {
      var id = 'hc_chain_' + row[0] + '_' + step; E.HARDCORE_CHAINS.push({ id: id, name: row[0], step: step });
      E.SC(id, { title: row[1] + (step === 2 ? ' · lần lựa chọn tiếp theo' : ''), tone: 'dark',
        valid: function (l) { return hard(l) && free(l) && !!state(l).chains && state(l).chains[row[0]] === step; },
        prep: function (l, r) { return { amount: amount(l, r) * (step === 2 ? 1.4 : 1) }; }, text: row[2],
        opts: [
          { k: 'giai_quyet', l: 'Dành nguồn lực để giải quyết đến nơi', req: function (l, d) { return l.age < 18 || !l.indep || l.money >= d.amount; }, h: function (l, d) { return l.age < 18 || !l.indep ? 'Dùng quỹ gia đình; không trừ tiền cá nhân' : H.money(l, d.amount); }, ai: { w: 1 }, run: function (l, r, log, d) { var h = state(l); apply(l, l.age < 18 || !l.indep ? policies.protect : policies.pay, d, 'Giải quyết vấn đề kéo dài', log); h.chains[row[0]] = 0; if (row[0] === 'tay_nghe') h.training += 2; else h.trauma = Math.max(0, h.trauma - 3); } },
          { k: 'tung_buoc', l: 'Tìm hỗ trợ, làm từng bước trong khả năng', ai: { w: 1.3 }, run: function (l, r, log, d) { var h = state(l); apply(l, policies.plan, d, 'Tiếp tục xử lý từng bước', log); if (step === 1) { h.chains[row[0]] = 2; H.sched(l, 'hc_chain_' + row[0] + '_2', 2); } else { h.chains[row[0]] = 0; h.training += row[0] === 'tay_nghe' ? 1 : 0; } } },
          { k: 'de_do', l: 'Gác lại vì chưa đủ sức', ai: { w: 0.7 }, run: function (l, r, log, d) { var h = state(l); apply(l, policies.hold, d, 'Gác một vấn đề chưa giải quyết', log); h.trauma = Math.min(100, h.trauma + 2); if (step === 1) { h.chains[row[0]] = 2; H.sched(l, 'hc_chain_' + row[0] + '_2', 2); } else h.chains[row[0]] = 0; } }
        ]
      });
    });
  });
  E.hardcoreFollowup = function (l, key, policy) {
    var name = /^(nha_am|chuyen_tro|nha_xuong_cap|phong_tro)$/.test(key) && /^(patch|endure|hold)$/.test(policy) ? 'cho_o' : /^(sai_lam_cu|khong_duoc_khoc|niem_tin|bi_phu_nhan)$/.test(key) && policy === 'endure' ? 'tu_tin' : /^(ky_nang_thieu|nghe_moi|chi_phi_nghe)$/.test(key) && policy === 'train' ? 'tay_nghe' : null;
    if (!name) return; var h = state(l); h.chains = h.chains || {}; h.chainStarted = h.chainStarted || {};
    if (h.chains[name] || (h.chainStarted[name] != null && l.age - h.chainStarted[name] < 8)) return;
    h.chainStarted[name] = l.age; h.chains[name] = 1; H.sched(l, 'hc_chain_' + name + '_1', 1);
  };
  var roles = [
    ['mil','ca_truc','Ca trực làm nhịp ngủ đảo lộn','Bạn phải thích nghi với kỷ luật và những ca làm nhiệm vụ thay đổi.'],
    ['mil','xa_nha','Áp lực khi ở xa chỗ dựa','Sinh hoạt trong đơn vị gợi lại cảm giác phải tự chịu mọi việc.'],
    ['jail','thich_nghi','Những ngày phải thích nghi trong trại','Môi trường giam giữ khiến bạn khó giữ tinh thần ổn định.'],
    ['jail','lo_sau_nay','Lo lắng về ngày trở về','Bạn vừa phải qua ngày hiện tại vừa lo khả năng làm lại sau khi chấp hành án.'],
    ['trapped','giu_binh_tinh','Giữ bình tĩnh trong hoàn cảnh bị giữ','Bạn cần giữ sức và làm theo hướng dẫn hỗ trợ chính thức khi có thể.'],
    ['trapped','cho_ho_tro','Chờ một đầu mối hỗ trợ đáng tin','Áp lực và sự bất định khiến bạn dễ hoảng; tìm hỗ trợ an toàn quan trọng hơn lời hứa của người lạ.']
  ];
  function role(l) { return l.jailUntil != null && l.age < l.jailUntil ? 'jail' : l.flags.military && l.age < l.flags.military ? 'mil' : l.abroad && l.abroad.trapped ? 'trapped' : ''; }
  E.HARDCORE_ROLES = [];
  roles.forEach(function (x) {
    var id = 'hc_role_' + x[1]; E.HARDCORE_ROLES.push({ id: id, role: x[0] });
    E.SC(id, { title: x[2], text: x[3], tone: 'dark', valid: function (l) { return hard(l) && l.alive && role(l) === x[0]; }, opts: [
      { k: 'on_dinh', l: 'Giữ nếp sinh hoạt, làm từng việc có thể', ai: { w: 1.3 }, run: function (l, r, log) { var h = state(l); h.emotion = Math.min(100, h.emotion + 0.5); H.fx(l, { hap: -1 }); log('Bạn giữ một nhịp nhỏ để không bị cuốn hết vào lo âu. Hoàn cảnh chưa thay đổi ngay.', 'neutral'); } },
      { k: 'nen', l: 'Nén lại, cố chịu một mình', ai: { w: 0.7 }, run: function (l, r, log) { var h = state(l); h.emotion = Math.max(0, h.emotion - 2); h.trauma = Math.min(100, h.trauma + 2); H.fx(l, { hap: -2 }); log('Bạn cố chịu một mình, nhưng áp lực trong lòng nặng hơn.', 'bad'); } }
    ] });
  });
  function roleEvent(l, r, type) { var pool = E.HARDCORE_ROLES.filter(function (x) { return x.role === type; }); return U.pick(r, pool).id; }
  [['milYear','mil'], ['jailYear','jail']].forEach(function (pair) { var old = E[pair[0]]; if (!old) return; E[pair[0]] = function (l, r) { var events = old.apply(this, arguments); if (!hard(l)) return events; return [[roleEvent(l, r, pair[1]), null]].concat(events); }; });
  var begin = E.beginYear;
  E.beginYear = function (l) { var had = l.pending && l.pending.length, result = begin.apply(this, arguments); if (hard(l) && !had && l.alive && role(l) === 'trapped' && l.pending.length < 4) l.pending.push(E.DEC[roleEvent(l, H.rf(l), 'trapped')].make(l, H.rf(l))); return result; };
  E.HARDCORE_EVENTS = legacy.concat(catalog.map(function (x) { return x.id; }), E.HARDCORE_CHAINS.map(function (x) { return x.id; }), E.HARDCORE_ROLES.map(function (x) { return x.id; }), ['hc_buoc_ngoat']);
  var migrate = E.migrate;
  E.migrate = function (l) {
    var x = migrate.apply(this, arguments);
    if (x && hard(x)) {
      var h = state(x);
      if (h.contextStories !== 2) {
        // Update already-open decisions from 7.7.0 without advancing the life RNG or rerolling their fee.
        var seed = { rs: (x.rs ^ 0x7701) | 0 };
        x.pending = (x.pending || []).filter(function (d) { return x.age >= 3 || !/^hc_story_/.test(d.id); }).map(function (d) { if (!/^hc_story_/.test(d.id) || !E.DEC[d.id]) return d; var fresh = E.DEC[d.id].make(x, function () { return U.rand(seed); }, d.data); if (d.manual) fresh.manual = true; return fresh; });
        h.contextStories = 2;
      }
    }
    return x;
  };
  var birth = E.birthContext;
  if (birth) E.birthContext = function (l) {
    var result = birth.apply(this, arguments); if (!hard(l)) return result;
    var h = state(l); return { label: 'Môi trường lớn lên', text: U.cap(care(l)) + ' ' + h.style + '.' };
  };
  // Những ngã rẽ bắt buộc vẫn dùng cơ chế cũ, chỉ thay lời dẫn của quyết định Hardcore mới tạo.
  var intros = {
    hs: ['Ngã rẽ sau những năm học đầu', 'Gia đình và bạn cần nói chuyện về hướng học tiếp.'],
    uni: ['Chọn hướng học tiếp', 'Bạn đứng trước lựa chọn về ngành học và cuộc sống sắp tới.'],
    job: ['Bắt đầu tìm việc', 'Bạn xem lại những điều mình biết làm và những nơi đang tuyển.'],
    marry: ['Nghĩ về chuyện xây gia đình', 'Hai người cần nói rõ mong muốn và trách nhiệm trước khi quyết định.'],
    kid: ['Có thêm người cần mình chăm sóc', 'Bạn phải cân nhắc sức lực, cảm xúc và khoản dự phòng trước một trách nhiệm kéo dài nhiều năm.'],
    house: ['Một chỗ ở, nhiều năm phải xoay xở', 'Chi phí nhà ở và lãi vay không giảm theo mức lương Hardcore.'],
    biz: ['Kinh doanh khi không có nhiều lần thử lại', 'Lãi dương rất thấp, khoản lỗ và vốn phải bỏ ra vẫn giữ nguyên.'],
    post: ['Học thêm hay giữ dòng tiền', 'Một bậc học nữa có thể mở cửa, nhưng cũng lấy đi thời gian và quỹ dự phòng.']
  };
  Object.keys(intros).forEach(function (id) { var D = E.DEC[id]; if (!D) return; var make = D.make; D.make = function (l) { var d = make.apply(this, arguments); if (hard(l)) { d.title = intros[id][0]; d.text = intros[id][1] + '\n\n' + d.text; } return d; }; });
  var exam = E.rollExamScore;
  if (exam) E.rollExamScore = function (l) {
    var value = exam.apply(this, arguments); if (!hard(l)) return value;
    var h = state(l), penalty = Math.max(0, 1.5 + h.trauma * 0.025 + Math.max(0, 40 - h.emotion) * 0.025 - h.training * 0.12 - h.support * 0.3);
    if (h.breakthroughRoll < 0.06 && h.training >= 3 && h.emotion >= 28) penalty *= 0.25;
    return Math.max(0, Math.round((value - penalty) * 4) / 4);
  };
  var career = E.careerYear;
  E.careerYear = function (l) { var income = career.apply(this, arguments); if (!hard(l) || !(income > 0)) return income; var h = state(l); return income * (h.boostUntil && l.age < h.boostUntil ? 4 : h.breakthrough ? 1.5 : 1); };
  function fee(l, before, out) {
    if (!hard(l) || !l.alive || !l.yr || !l.yr.items) return out;
    var gross = l.yr.items.slice(before).reduce(function (s, row) { return s + (row.v > 0 && /^(Thưởng|Tiền thưởng|Cát-xê|Nhuận bút|Hoa hồng|Tiền công|Thu nhập từ)/i.test(row.t || '') ? row.v : 0); }, 0);
    if (!(gross > 0)) return out;
    var cut = gross * 0.82; H.cash(l, -cut, 'Hardcore: hao hụt khoản thu không thường xuyên');
    var e = { a: l.age, y: l.birthYear + l.age, k: 'money', t: 'Hardcore: khoản thu không thường xuyên ' + H.money(l, gross) + ' chịu chi phí và hao hụt ' + H.money(l, cut) + ', thực giữ lại ' + H.money(l, gross - cut) + '.' };
    l.log.push(e); if (Array.isArray(out)) out.push(e);
    if (l.fin) l.fin.other = l.yr.items.reduce(function (s, x) { return s + x.v; }, 0);
    return out;
  }
  ['resolve', 'finishYear'].forEach(function (name) { var previous = E[name]; E[name] = function (l) { if (!hard(l)) return previous.apply(this, arguments); var before = l.yr && l.yr.items ? l.yr.items.length : 0; return fee(l, before, previous.apply(this, arguments)); }; });
  // Vết hằn không biến mất khi đủ 18 tuổi; sự hỗ trợ và luyện tập vẫn có thể giúp phục hồi.
  E.hardcoreYear = function (l, r, log, a) {
    if (!hard(l) || !l.alive) return;
    var h = state(l), familyPressure = a < 18 ? h.pressure / 45 : h.trauma / 65;
    if (a < 3 && h.infantAt !== a) {
      h.infantAt = a;
      var m = U.pick(r, catalog.filter(function (x) { return x.phase === 'baby'; })), key = m.id.replace('hc_story_', ''), def = E.DEC[m.id], d = def.make(l,r);
      log(d.text, 'neutral');
      if (r() < h.pressure / 110) { h.emotion -= 1.5; h.trauma += 2; H.fx(l,{hap:-1}); log('Bạn khóc rồi thiếp đi; tiếng người lớn vẫn còn vẳng quanh chỗ ngủ.', 'bad'); }
      else { h.emotion += 1; h.trauma = Math.max(0,h.trauma-0.5); log('Một người thân ở bên vỗ về, bạn dần ngủ yên.', 'good'); }
      l.flags.hardcoreShocks = (l.flags.hardcoreShocks||0)+1;
    }
    if (a < 18 && h.reserveAt !== a) { h.reserveAt = a; h.resources = context(l) === 'wealthy' ? 100 : context(l) === 'comfortable' ? Math.max(50, h.resources) : Math.min(100, h.resources + 6); }
    if (a >= 6) h.emotion += h.support * 0.12 - familyPressure - h.trauma * 0.006;
    if (a >= 12 && l.mind) l.mind.stress = U.clamp(l.mind.stress + familyPressure + h.trauma / 45 - h.support * 0.3, 0, 100);
    if (a >= 18 && h.support >= 2) h.trauma = Math.max(0, h.trauma - 0.5);
    bound(h); l.st.hap = Math.min(l.st.hap, 43 + h.emotion * 0.28 + h.support);
    if (a >= 12 && (h.emotion < 25 || h.trauma > 65) && (h.feltAt == null || a - h.feltAt >= 4)) {
      h.feltAt = a; log(a < 18 ? 'Áp lực trong môi trường lớn lên khiến bạn ít dám nói điều mình cần. Cảm xúc khó ổn định, chuyện học cũng nặng hơn.' : 'Những năm lớn lên trong căng thẳng vẫn ảnh hưởng cách bạn nhìn mình. Bạn dễ tự trách và mất bình tĩnh trước một cơ hội mới.', 'bad');
    }
    if (!h.opportunity && a >= 24 && a <= 55 && free(l) && h.breakthroughRoll < 0.06 && h.training >= 3 && h.emotion >= 28 && h.trauma < 85 && l.job && r() < 0.12) { h.opportunity = true; H.sched(l, 'hc_buoc_ngoat', 1); }
  };
  E.HOOKS.year.unshift(E.hardcoreYear);
  E.SC('hc_buoc_ngoat', {
    title: 'Một cánh cửa hiếm khi mở', tone: 'dark', valid: function (l) { return hard(l) && free(l) && !!l.job && !l.retired; },
    text: function () { return 'Sau những lần học và thử lại, bạn được đề xuất một dự án có người hướng dẫn. Đây là cơ hội hiếm, cần nhiều công sức; nó không bảo đảm bạn sẽ giàu.'; },
    opts: [
      { k: 'thu', l: 'Nhận cơ hội, làm từng bước có kiểm soát', ai: { w: 1.5 }, run: function (l, r, log) { var h = state(l); h.breakthrough = true; h.boostUntil = l.age + 5; h.emotion = Math.min(100, h.emotion + 5); H.fx(l, { kno: 3, hea: -2 }); log('Bạn bước vào dự án. Trong 5 năm tới cơ hội thu nhập tốt hơn, nhưng vẫn phải gánh chi phí và rủi ro; sau đó nền tảng nghề chỉ được cải thiện một phần.', 'big'); } },
      { k: 'giu', l: 'Giữ nhịp sống hiện tại, không nhận thêm', ai: { w: 0.5 }, run: function (l, r, log) { log('Bạn không nhận dự án, ưu tiên sự ổn định. Bỏ một cơ hội không có nghĩa là bạn đã thất bại.', 'neutral'); } }
    ]
  });
  // Dùng các hoạt động phục hồi có sẵn; không thêm mục hành động vào chế độ khác.
  ['tri_lieu', 'kiet_suc'].forEach(function (id) { var D = E.DEC[id]; if (!D) return; var before = D.apply; D.apply = function (l, d, k) { var result = before.apply(this, arguments); if (hard(l) && (id === 'tri_lieu' || k === 'therapy')) { var h = state(l); h.emotion += 4; h.trauma -= 4; h.support = Math.min(6, h.support + 0.5); bound(h); } return result; }; });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
