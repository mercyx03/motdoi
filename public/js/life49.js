/* v4.5.3 — thâm niên thật, bối cảnh khởi đầu và quan hệ chu cấp có điều kiện. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U;
  function free(l) { return l.alive && l.age >= 18 && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  E.canAdvance = function (l, c, yearEnd) {
    if (!l.job || !c || l.job.rank >= c.t.length - 1) return false;
    if (c.fame || c.skillRank != null) return true;
    var j = l.job, min = c.minAge || 15;
    if (l.age < min) return false;
    if (j.rankSince == null) {
      var h = (l.jobsHist || []).filter(function (h) { return E.resolveJob(h.id) === c.id; }).pop();
      j.rankSince = Math.max(min, h ? h.from : l.age - Math.min(j.yrs || 0, l.workYrs == null ? j.yrs || 0 : l.workYrs));
      j.rankTracked = j.rank;
    }
    if (j.rankTracked !== j.rank) { j.rankSince = l.age; j.rankTracked = j.rank; }
    return l.age - j.rankSince + (yearEnd ? 1 : 0) >= Math.max(1, (c.yrs && c.yrs[j.rank]) || 3);
  };
  // Chỉ xin xét lương một lần mỗi năm; "điểm kinh nghiệm" không thay năm công tác.
  var raise = E.DEC.tang_luong;
  raise.def.opts.forEach(function (o) { if (o.k !== 'ask') return;
    o.req = function (l) { return !!l.job && l.job.raiseAt !== l.age && l.flags.raiseAt !== l.age; };
    o.run = function (l, r, log) {
      var j = l.job, c = E.jobDef(l); if (!j || j.raiseAt === l.age || l.flags.raiseAt === l.age) return;
      j.raiseAt = l.age; l.flags.raiseAt = l.age;
      var p = 0.15 + (l.st.kno - 50) / 200 + Math.min(4, j.yrs || 0) * 0.04;
      if (!c.ladder && E.canAdvance(l, c, false) && r() < p) {
        j.rank++; j.yrs = 0; j.rankSince = l.age; j.rankTracked = j.rank;
        log('Được xét thăng chức sau thời gian công tác: ' + E.jobTitle(l) + '.', 'good'); H.fx(l, { hap: 6 });
      } else if (r() < 0.5) { H.cash(l, l.base * 0.05, 'Thưởng công việc trong năm'); log('Chưa đủ điều kiện thăng chức; được thưởng một khoản trong năm.', 'neutral'); }
      else { log('Đề xuất được ghi nhận, tiếp tục tích lũy kinh nghiệm cho kỳ xét sau.', 'neutral'); }
    };
  });
  E.ACT.forEach(function (a) { if (a.id === 'tang_luong') { var before = a.avail; a.avail = function (l) { var x = before ? before(l) : true; return x === true && l.job && (l.job.raiseAt === l.age || l.flags.raiseAt === l.age) ? 'Đã xét lương trong năm nay' : x; }; } });

  // Biến thể cố định theo nhân vật: vẽ lại giao diện không đổi câu hoặc tiêu hao RNG cuộc đời.
  E.birthContext = function (l) {
    var f = l.fam || {}, seed = 2166136261, key = [l.name, l.birthYear, l.birthMonth, l.pool].join('|');
    for (var i = 0; i < key.length; i++) seed = Math.imul(seed ^ key.charCodeAt(i), 16777619) >>> 0;
    function choose(a) { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return a[(seed >>> 0) % a.length]; }
    var wealth = [null,
      ['Gia đình nghèo, thu nhập chỉ vừa đủ lo bữa ăn hằng ngày', 'Nhà thiếu thốn, khoản chi nào cũng phải cân nhắc', 'Kinh tế chật vật, gia đình chưa có khoản dự phòng', 'Gia đình nghèo, chuyện học hành cần được dành dụm từ sớm'],
      ['Gia đình có thu nhập thấp, sống tiết kiệm', 'Kinh tế còn eo hẹp, phải chắt chiu từng tháng', 'Nhà không dư dả, ưu tiên các nhu cầu thiết yếu', 'Gia đình ít tiền tích lũy, khó xoay xở khi có khoản chi lớn'],
      ['Gia đình có kinh tế trung bình, cuộc sống vừa đủ', 'Thu nhập gia đình đủ trang trải sinh hoạt, không quá dư dả', 'Nhà có mức sống bình dân, các khoản lớn cần lên kế hoạch', 'Gia đình không giàu, nhưng có thể lo những nhu cầu cơ bản'],
      ['Gia đình khá giả, có điều kiện đầu tư cho việc học', 'Kinh tế gia đình tương đối dư dả, ít áp lực chi tiêu thường ngày', 'Nhà khá giả, có khoản dự phòng cho tương lai', 'Gia đình có điều kiện, việc ăn ở và học hành thuận lợi'],
      ['Gia đình giàu có, nền tảng tài chính vững vàng', 'Sinh ra trong gia đình giàu, có nhiều lựa chọn học tập', 'Nhà rất dư dả, tiền sinh hoạt ít khi là nỗi lo', 'Gia đình giàu có, có nguồn lực hỗ trợ con cái lập nghiệp']
    ];
    var q = Math.max(1, Math.min(5, Math.round(f.q || 3))), parts = [choose(wealth[q])], severe = false;
    var mom = f.mAlive !== false, dad = f.fAlive !== false && !f.noDad;
    if (!mom && !dad) { parts.push('không còn bố mẹ bên cạnh từ khi chào đời'); severe = true; }
    else {
      if (f.vice && dad) { parts.push('bố ' + (E.VICE[f.vice] || 'gặp vấn đề nghiêm trọng') + ', khiến cuộc sống trong nhà nhiều bất ổn'); severe = true; }
      if (f.noDad && mom) parts.push(choose(['mẹ một mình chăm sóc và vun vén cho con', 'lớn lên bên mẹ, thiếu sự hiện diện của bố', 'mẹ đảm đương việc chăm sóc và nuôi con']));
      else if (!dad && mom) parts.push('mẹ là người trực tiếp chăm sóc, bố đã mất');
      else if (!mom && dad) parts.push('bố chăm sóc con sau khi mẹ qua đời');
      if (!severe) {
        var adult = mom && dad ? 'bố mẹ' : mom ? 'mẹ' : 'bố';
        parts.push(choose([
          adult + ' coi trọng thành tích, kỳ vọng con học giỏi và có nghề ổn định',
          adult + ' ưu tiên sức khỏe, mong con lớn lên vui vẻ',
          adult + ' đặt nhiều quy tắc, con được chăm lo nhưng ít tự quyết',
          adult + ' khuyến khích tự lập, cho con thử sở thích riêng',
          adult + ' thường bận công việc, thời gian dành cho con còn hạn chế',
          adult + ' coi trọng nề nếp, thường nhắc con cư xử lễ phép',
          adult + ' quan tâm nhưng hay lo xa, muốn biết rõ mọi lựa chọn của con',
          adult + ' sẵn sàng lắng nghe, ít so sánh con với người khác'
        ]));
      }
      if ((dad && f.fJob === 'thất nghiệp') || (mom && f.mJob === 'thất nghiệp')) parts.push('trong nhà đang có người chưa tìm được việc');
      if (f.elite) parts.push(choose(['gia đình mong con nối nghiệp, tạo thêm áp lực lựa chọn tương lai', 'gia thế đem lại cơ hội nhưng cũng khiến con bị kỳ vọng giữ danh tiếng', 'có nền tảng nghề nghiệp từ gia đình, song con vẫn phải tìm hướng đi riêng']));
      if (f.sibs >= 4) parts.push('nhà đông anh chị em, sự quan tâm và nguồn lực phải chia sẻ');
      else if (f.sibs > 0) parts.push('có anh chị em cùng lớn lên, vừa có bạn vừa phải học cách nhường nhịn');
    }
    if (!l.urban && l.coast) parts.push(choose(['sống ở vùng ven biển, nhịp sinh hoạt gắn với thời tiết', 'môi trường lớn lên là một vùng ven biển']));
    else if (E.isVN(l) && l.region === 'MNPB' && !l.urban) parts.push('sống ở vùng núi, việc đi lại và đến trường có thể xa');
    return { label: 'Bối cảnh gia đình', severe: severe, text: parts.join('; ') + '.' };
  };

  function money(l, tr) { return H.isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm) ? tr : tr / 90 * l.base; }
  function state(l) { return l.flags.sponsor; }
  function allowance(l, s) { return s.cur && s.cur !== l.cur ? money(l, s.nominal) : s.monthly; }
  function supported(l) { var s = state(l), p = l.partner; return free(l) && !!s && s.active && !!p && p.alive !== false && p.name === s.name; }
  function canOffer(l, d) {
    if (!free(l) || l.age > 40 || (state(l) && state(l).active)) return false;
    if (d && d.expectedName !== undefined && (l.partner ? l.partner.name : '') !== d.expectedName) return false;
    return !l.partner || (l.partner.status === 'dating' && l.partner.alive !== false && l.partner.age - l.age >= 10 && l.partner.inc >= money(l, 150));
  }
  function endSupport(l, log, breakup) {
    var s = state(l); if (!s || !s.active) return;
    s.active = false;
    if (breakup && l.partner && l.partner.name === s.name) { l.partner = null; l.exes = (l.exes || 0) + 1; }
    log(breakup ? 'Chấm dứt quan hệ với ' + s.name + ', ngừng nhận chu cấp. Tiền và tài sản riêng vẫn thuộc về bạn.' : 'Ngừng nhận chu cấp, giữ công việc, bạn bè và quyền tự quyết. Nếu tiếp tục tìm hiểu nhau, hai người cần một mối quan hệ bình đẳng.', 'neutral');
  }
  function boundary(l, r, log) {
    var s = state(l);
    var x = r();
    if (x < 0.55) { s.control = Math.max(0, s.control - 15); log(s.name + ' đồng ý lùi lại, tôn trọng giới hạn bạn đặt ra, vẫn chu cấp đều đặn như cũ.', 'good'); H.fx(l, { hap: 3, soc: 2 }); }
    else if (x < 0.8) { s.control = Math.max(0, s.control - 5); log(s.name + ' không vui, giận dỗi mấy hôm, nhưng vẫn gửi khoản chu cấp như đã hứa. Bạn không phải đổi quyền riêng tư lấy tiền.', 'neutral'); H.fx(l, { hap: 1 }); }
    else { s.withheldUntil = l.age; log(s.name + ' không đồng ý và ngừng khoản chu cấp trong năm nay. Bạn vẫn có thể tự đi làm hoặc chấm dứt quan hệ.', 'bad'); H.fx(l, { hap: -3 }); }
  }
  E.SC('sn_loi_moi', {
    title: 'Một lời đề nghị chu cấp', valid: canOffer,
    prep: function (l, r) {
      var p = l.partner ? Object.assign({}, l.partner) : { age: l.age + U.randint(r, 12, 25), job: U.pick(r, ['chủ doanh nghiệp', 'nhà đầu tư', 'chủ chuỗi khách sạn']), inc: money(l, U.randint(r, 400, 1200)) };
      // Tên và giới tính phải được sinh từ cùng một lựa chọn tương thích xu hướng.
      if (!l.partner) { p.sex = H.partnerSex(l, r); p.name = H.stranger(l, r, p.sex); }
      if (!p.job) p.job = 'kinh doanh / đầu tư';
      return { p: p, expectedName: l.partner ? l.partner.name : '', monthly: Math.min(p.inc * 0.2, money(l, U.randint(r, 40, 160))) };
    },
    text: function (l, d) { return d.p.name + ', ' + d.p.age + ' tuổi, ' + d.p.job + ', ngỏ lời tìm hiểu và chu cấp khoảng ' + H.money(l, d.monthly) + '/tháng. Đổi lại, người ấy muốn biết bạn đi đâu, gặp ai và có thể gây áp lực lên công việc, cách ăn mặc, quan hệ bạn bè. Bạn có quyền từ chối hoặc rút lui sau này; nhận tiền không làm mất quyền tự quyết.'; },
    opts: [
      { k: 'accept', l: 'Nhận lời, bắt đầu mối quan hệ có chu cấp', req: canOffer, ai: { w: 0.5 }, run: function (l, r, log, d) {
        if (!canOffer(l, d)) return;
        if (!l.partner) { l.partner = { name: d.p.name, sex: d.p.sex, age: d.p.age, job: d.p.job, jobId: null, inc: d.p.inc, incKnown: true, status: 'dating', since: l.age, alive: true }; l.flags.everDated = true; if (!l.flags.firstLove) l.flags.firstLove = d.p.name; }
        l.flags.sponsor = { name: d.p.name, active: true, monthly: d.monthly, cur: l.cur, nominal: d.monthly / money(l, 1), control: 35, since: l.age };
        log('Nhận lời tìm hiểu ' + d.p.name + ' và khoản chu cấp dự kiến ' + H.money(l, d.monthly) + '/tháng. Khoản thực nhận phụ thuộc quan hệ còn tiếp tục và điều kiện trong năm.', 'big');
        H.chain(l, 'sn_kiem_soat');
      } },
      { k: 'decline', l: 'Từ chối, muốn tự chủ tài chính và tình cảm', ai: { w: 1.2 }, run: function (l, r, log) { log('Từ chối lời đề nghị, giữ tự chủ về tài chính và tình cảm.', 'neutral'); } }
    ]
  });
  function options(comply) { return [
    { k: 'comply', l: comply, ai: { w: 0.6 }, run: function (l, r, log) { var s = state(l); s.control = Math.min(100, s.control + 15); H.fx(l, { hap: -4, soc: -3 }); if (l.mind) l.mind.stress = Math.min(100, l.mind.stress + 7); log('Chấp nhận yêu cầu. Khoản tiền giúp bớt áp lực sinh hoạt, nhưng bạn ngày càng cảm thấy bị kiểm soát.', 'bad'); } },
    { k: 'boundary', l: 'Đặt ranh giới, không đổi quyền riêng tư lấy tiền', ai: { w: 1.2 }, run: boundary },
    { k: 'stop', l: 'Dừng nhận chu cấp', ai: { w: 0.8 }, run: function (l, r, log) { endSupport(l, log, false); } },
    { k: 'leave', l: 'Chấm dứt mối quan hệ', ai: { w: 0.5 }, run: function (l, r, log) { endSupport(l, log, true); } }
  ]; }
  function scene(id, title, text, opts) {
    E.SC(id, { title: title, text: text, prep: function (l) { return { name: state(l).name }; }, valid: function (l, d) { return supported(l) && (!d || !d.name || d.name === state(l).name); }, opts: opts || options('Nhượng bộ lần này') });
    var apply = E.DEC[id].apply; E.DEC[id].apply = function (l, d, k, r, log) { if (!E.DEC[id].valid(l, d.data)) return; return apply.call(this,l,d,k,r,function(t,tone){log(title+': '+t,tone);}); };
  }
  scene('sn_kiem_soat', 'Tiền bạc và quyền riêng tư', function (l) { return state(l).name + ' muốn bạn luôn báo vị trí và cho xem điện thoại. Bạn thấy mình đang phải giải thích từng cuộc gặp gỡ.'; }, options('Đồng ý báo lịch trình và cho xem điện thoại'));
  scene('sn_ban_be', 'Một cuộc hẹn bị ngăn cản', 'Người chu cấp không muốn bạn đi gặp nhóm bạn thân, viện lý do đã lo tiền cho bạn thì bạn nên ưu tiên người ấy.', options('Hủy buổi gặp bạn bè'));
  scene('sn_an_mac', 'Áp lực thay đổi hình ảnh', 'Người ấy yêu cầu bạn thay đổi quần áo và cách xuất hiện trên mạng xã hội cho vừa ý mình.', options('Làm theo yêu cầu về quần áo và mạng xã hội'));
  scene('sn_nghi_viec', 'Muốn bạn nghỉ việc', 'Người ấy nói sẽ lo sinh hoạt phí nếu bạn nghỉ việc, tránh tiếp xúc với đồng nghiệp. Nghỉ việc khiến bạn mất nguồn thu riêng.', [
    { k: 'quit', l: 'Đồng ý nghỉ việc, chấp nhận phụ thuộc hơn', req: function (l) { return !!l.job; }, ai: { w: 0.3 }, run: function (l, r, log) { l.lastJob = l.job; l.job = null; l.flags.needJob = false; state(l).control = Math.min(100, state(l).control + 25); log('Chủ động nghỉ việc theo đề nghị. Bạn vẫn có quyền tìm việc lại sau này, nhưng hiện chỉ còn trông vào khoản chu cấp.', 'bad'); H.fx(l, { hap: -4 }); } },
    { k: 'keep', l: 'Giữ công việc và thu nhập của mình', ai: { w: 1.5 }, run: boundary },
    { k: 'stop', l: 'Dừng nhận chu cấp để giữ tự chủ', ai: { w: 1 }, run: function (l, r, log) { endSupport(l, log, false); } }
  ]);
  scene('sn_gian_doan', 'Khoản chu cấp không về', 'Đến kỳ, người ấy trì hoãn khoản tiền đã hứa. Những khoản chi hằng ngày vẫn phải tự xoay xở.', [
    { k: 'talk', l: 'Hỏi rõ, chuẩn bị ngân sách tự lập', ai: { w: 1.3 }, run: function (l, r, log) { state(l).withheldUntil = l.age; log('Không tính khoản tiền chưa nhận là thu nhập. Bắt đầu dự trù chi tiêu bằng tiền đang có.', 'neutral'); } },
    { k: 'wait', l: 'Tiếp tục chờ', ai: { w: 0.7 }, run: function (l, r, log) { state(l).withheldUntil = l.age; H.fx(l, { hap: -4 }); log('Tiếp tục chờ, năm nay không có khoản chu cấp như dự kiến.', 'bad'); } },
    { k: 'stop', l: 'Ngừng phụ thuộc vào khoản tiền này', ai: { w: 1 }, run: function (l, r, log) { endSupport(l, log, false); } }
  ]);
  scene('sn_quan_he', 'Quyền quyết định của bạn', function (l) { var s = state(l); return 'Khoản chu cấp dự kiến: ' + H.money(l, allowance(l, s)) + '/tháng. Mức kiểm soát: ' + s.control + '/100. Bạn có thể đặt lại ranh giới hoặc dừng nhận tiền bất cứ lúc nào.'; }, options('Tiếp tục thỏa thuận hiện tại'));
  E.ACT.push({ id: 'sn_quan_he', g: 'Tình cảm', l: 'Quan hệ chu cấp / đặt lại ranh giới', min: 18, sc: 'sn_quan_he', avail: function (l) { return supported(l) ? true : 'Không có quan hệ chu cấp đang tiếp tục'; } });
  E.TRIG.push({ id: 'sn_loi_moi', when: canOffer, p: 0.13, cd: 4, max: 3 });
  ['sn_kiem_soat', 'sn_ban_be', 'sn_an_mac', 'sn_gian_doan', 'sn_nghi_viec'].forEach(function (id) { E.TRIG.push({ id: id, when: function (l) { return supported(l) && (id !== 'sn_nghi_viec' || !!l.job); }, p: 0.25, cd: 2, rep: true }); });
  E.MAJOR.sn_loi_moi = 1;
  function sponsorYear(l, r, log, a) {
    var s = state(l); if (!s || !s.active) return;
    if (!l.partner || l.partner.name !== s.name || l.partner.alive === false) { s.active = false; return; }
    if (!free(l) || l.partner.status !== 'dating' || s.paidAt === a) return;
    s.paidAt = a;
    if (s.withheldUntil != null && a <= s.withheldUntil) { log('Năm nay không nhận khoản chu cấp đã hứa từ ' + s.name + '.', 'neutral'); return; }
    var monthly = allowance(l, s);
    var amount = Math.min(monthly, Math.max(0, l.partner.inc || 0) * 0.2) * 12;
    H.cash(l, amount, 'Chu cấp tình cảm từ ' + s.name);
    log('Nhận chu cấp thực tế từ ' + s.name + ': ' + H.money(l, amount) + ' trong năm.', 'money');
  }
  E.HOOKS.year.push(sponsorYear);
  E.sponsorYear = sponsorYear;
  E.sponsorActive = supported;
  E.sponsorContributionAllowed = function (l) { var s = state(l); return !s || !s.active || !l.partner || l.partner.name !== s.name || s.withheldUntil == null || l.age > s.withheldUntil; };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
