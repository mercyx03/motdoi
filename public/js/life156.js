/* Showbiz — Mốc 6: liên kết các hệ thống giải trí.
   · Thành tựu cho các cột mốc mới (dùng E.addAchievements sẵn có).
   · Làm tốt ở một gameshow kiến thức → được khán giả biết đến → lời mời sang một gameshow kiến thức khác (đủ điều kiện mới tham gia được).
   · Mọi chương trình đã tham gia, vai diễn, nhóm nhạc đã được ghi vào hồ sơ ở từng module (E.profile); ở đây chỉ nối các mạch. */
(function (G) {
  'use strict';
  var E = G.E, SH = E.SHOW151;
  function yr(l) { return l.birthYear + l.age; }
  function hist(l) { return (l.flags && l.flags.show151 && l.flags.show151.history) || []; }
  function genre(id) { var s = SH.SHOWS[id]; return s && s.genre; }
  if (E.addAchievements) E.addAchievements([
    ['sb_nnc', '⚡', 'Nhanh như chớp', 'Trả lời đúng 10 câu liên tiếp trong Nhanh Như Chớp', function (l) { return hist(l).some(function (h) { return h.id === 'nnc' && h.rank >= 10; }); }],
    ['sb_altp', '💰', 'Chinh phục câu hỏi số 15', 'Vượt qua cả 15 câu hỏi Ai Là Triệu Phú', function (l) { return hist(l).some(function (h) { return (h.id === 'altp' || h.id === 'millionaire') && /15 câu/.test(h.result); }); }],
    ['sb_olympia', '🏆', 'Vòng nguyệt quế năm', 'Vô địch Chung kết năm Đường Lên Đỉnh Olympia', function (l) { return !!l.flags.olympiaChampion151; }],
    ['sb_brain', '🧠', 'Biệt đội siêu trí tuệ', 'Vượt qua ba vòng Siêu Trí Tuệ Việt Nam', function (l) { return hist(l).some(function (h) { return h.id === 'stt' && /biệt đội/.test(h.result); }); }],
    ['sb_strategy', '♟️', 'Bậc thầy chiến thuật', 'Vô địch một gameshow chiến thuật', function (l) { return hist(l).some(function (h) { return genre(h.id) === 'strategy' && h.rank === 1; }); }],
    ['sb_music', '🎤', 'Quán quân', 'Vô địch một cuộc thi âm nhạc trên truyền hình', function (l) { return (l.flags.musicWin153 || []).length > 0; }],
    ['sb_couple', '💞', 'Thành đôi trên sóng', 'Cùng một người chọn nhau trong show hẹn hò', function (l) { return hist(l).some(function (h) { return genre(h.id) === 'dating' && /chọn nhau/.test(h.result); }); }],
    ['sb_award', '🎬', 'Giải thưởng điện ảnh', 'Đoạt một giải thưởng diễn xuất', function (l) { var s = l.flags.actor154; return !!(s && s.awards.some(function (a) { return a.won; })); }],
    ['sb_star', '🌟', 'Ngôi sao điện ảnh', 'Trở thành ngôi sao điện ảnh', function (l) { return !!(l.job && l.job.id === 'dien_vien' && l.job.rank >= 4); }],
    ['sb_debut', '✨', 'Ngày debut', 'Ra mắt cùng một nhóm nhạc thần tượng', function (l) { var s = l.flags.idol155; return !!(s && s.group); }],
    ['sb_survival', '🎟️', 'Tấm vé debut', 'Lọt vào đội hình debut của một chương trình sống còn', function (l) { return hist(l).some(function (h) { return genre(h.id) === 'idol' && /lọt vào đội hình/.test(h.result); }); }]
  ]);
  // Gameshow kiến thức: thành tích tốt mở lời mời sang chương trình kiến thức khác (một lần cho mỗi kết quả)
  E.HOOKS.year.push(function (l) {
    var s = l.flags && l.flags.show151; if (!s || !l.alive) return;
    s.history.forEach(function (h) {
      if (h.cross156 || genre(h.id) !== 'quiz' || h.role === 'celeb') return; h.cross156 = true;
      var good = h.prize > 0 || h.rank >= 7 || /vô địch|biệt đội/.test(h.result); if (!good) return;
      var next = Object.keys(SH.SHOWS).filter(function (id) { return id !== h.id && genre(id) === 'quiz' && SH.SHOWS[id].roles.contestant && SH.airing(l, SH.SHOWS[id]); })[0];
      if (next && !s.invites[next]) s.invites[next] = { until: yr(l) + 2, why: 'khán giả nhớ bạn từ ' + h.name };
    });
  });

  // Hồ sơ truyền thông nối scandal sẵn có; không thay quan hệ thật bằng cặp đôi quảng bá.
  var X = E.UPDATE110, H = E.H, U = G.U;
  function media(l) { var s = l.flags.media156 || (l.flags.media156 = { trust: 60, history: [] }); if (!Array.isArray(s.contracts)) s.contracts = []; return s; }
  function eligible(l) { var w = X.reason(l, 18); if (w !== true) return w; return (l.fame || 0) >= 50000 || l.flags.media156 && (l.flags.media156.active || owedMedia(l) > 0 || l.flags.media156.contracts && l.flags.media156.contracts.some(function (x) { return x.claim && x.claim.stage !== 'closed'; })) ? true : 'Cần được công chúng biết đến'; }
  var topics = { private: 'Tin hẹn hò bí mật', service: 'Fanservice bị hiểu thành lời hứa tình cảm', ship: 'Xào couple gây tranh cãi', rumor: 'Tin đồn và phát ngôn bị cắt ghép', conduct: 'Tranh cãi về hành vi và trách nhiệm' };
  function openCase(l, kind) {
    var s = media(l); if (s.active) return s.active;
    s.serial = (s.serial || 0) + 1;
    s.active = { id: s.serial, kind: kind, name: l.partner && l.partner.name || null, partnerId: l.partner && (l.partner.uid110 || l.partner.contact148 || l.partner.name), at: l.age, stage: 'verify', severity: kind === 'ship' ? 24 : 16, evidence: false, response: null, followAt: null, contracts: s.contracts.filter(function (x) { return x.status === 'signed' && l.age <= x.end; }).map(function (x) { return x.id; }) };
    return s.active;
  }
  function samePartner(l, c) { return l.partner && (l.partner.uid110 || l.partner.contact148 || l.partner.name) === c.partnerId; }
  X.menu('media156', 'Showbiz: truyền thông và giải quyết scandal', eligible,
    function (l) { var s = media(l), c = s.active; return 'Niềm tin công chúng: ' + s.trust + '/100. ' + (c ? topics[c.kind] + (c.name ? ' · người liên quan: ' + c.name : '') + '. ' + ({ verify: 'Cần kiểm chứng trước khi phản hồi.', respond: 'Chọn cách lên tiếng; đời tư không đồng nghĩa với sai phạm.', follow: 'Đã phản hồi; chờ sang năm để xem hậu quả và tiếp tục xử lý.' })[c.stage] + ' Mức căng thẳng: ' + c.severity + '/100.' : 'Thống nhất ranh giới với người yêu và cách quảng bá với ê-kíp. Không biến lời đồn thành kết luận.') + (s.history.length ? '\nHồ sơ gần nhất: ' + s.history[s.history.length - 1].result : ''); },
    function (l) {
      var s = media(l), c = s.active, rows = [];
      function row(k, label, fn, why) { rows.push({ k: k, l: label, why: why || true, run: function (l, r, log) { if (eligible(l) !== true) return; fn(l, r, log); if (k !== 'contracts') X.next(l, 'media156', r); } }); }
      row('contracts', 'Hợp đồng quảng cáo và yêu cầu bồi thường', function (l, r) { X.next(l, 'mediaContracts156', r); });
      if (!c) {
        row('private', 'Thống nhất giữ kín chuyện hẹn hò', function (l, r, log) { s.policy = 'private'; s.policyAt = l.age; s.partnerId = l.partner.uid110 || l.partner.contact148 || l.partner.name; log('Bạn trao đổi riêng với ' + l.partner.name + ', thống nhất chưa công khai; không phủ nhận hay coi tình yêu là lỗi.', 'neutral'); }, l.partner && l.partner.age >= 18 ? true : 'Cần người yêu trưởng thành');
        row('service', 'Fanservice có ranh giới rõ ràng', function (l, r, log) { s.policy = 'service'; s.policyAt = l.age; s.trust = Math.min(100, s.trust + 2); log('Ê-kíp công bố tương tác sân khấu là biểu diễn, không hứa hẹn tình cảm với fan.', 'neutral'); }, s.policyAt === l.age ? 'Đã thống nhất quảng bá năm nay' : true);
        row('ship', 'Nhận đề nghị xào couple để quảng bá', function (l, r, log) { var p = E.ELITE148.meet(l, r, { kind: 'artist', celeb: true, where: 'buổi trao đổi quảng bá', tier: 2 }); if (p.honesty >= 65) { s.policyAt = l.age; log(p.name + ' chỉ đồng ý quảng bá với ranh giới rõ ràng, từ chối tạo hiểu lầm hẹn hò.', 'neutral'); return; } s.policy = 'ship'; s.policyAt = l.age; l.fame = Math.round((l.fame || 0) * 1.04); var c = openCase(l, 'ship'); c.name = p.name; c.contact148 = p.uid110; log(p.name + ' nhận lời quảng bá chung. Clip ghép đôi thu hút chú ý nhưng khán giả hỏi đâu là diễn, đâu là thật. Bạn cần làm rõ với ê-kíp và người liên quan.', 'neutral'); }, s.policyAt === l.age ? 'Đã thống nhất quảng bá năm nay' : true);
        return rows;
      }
      if (c.stage === 'verify') {
        row('verify', 'Đối chiếu clip gốc, hỏi người liên quan và ê-kíp', function (l, r, log) { c.evidence = true; c.stage = 'respond'; log('Bạn lưu clip gốc và trao đổi riêng. ' + (c.kind === 'rumor' ? 'Có ngữ cảnh bị cắt bỏ; cần đính chính bằng chứng.' : c.kind === 'conduct' ? 'Đối chiếu hành vi được nêu và phần trách nhiệm cần khắc phục; không dùng đời tư để đánh lạc hướng.' : 'Cần phân biệt đời tư, biểu diễn và kỳ vọng do quảng bá tạo ra.'), 'neutral'); });
        row('rush', 'Phản hồi ngay khi chưa kiểm chứng', function () { c.stage = 'respond'; c.severity += 8; });
      } else if (c.stage === 'respond') {
        [['clarify', 'Làm rõ bằng chứng, giữ kín thông tin riêng'], ['repair', 'Nhận trách nhiệm phần mình, sửa hành vi và thông điệp'], ['attack', 'Công kích người chất vấn, tiếp tục úp mở'], ['silent', 'Tạm im lặng, ngừng nội dung gây hiểu nhầm']].forEach(function (item) {
          row(item[0], item[1], function (l, r, log) { c.response = item[0]; c.stage = 'follow'; c.followAt = l.age; demandMedia(l, c, log); var good = c.response === 'clarify' && c.evidence && c.kind !== 'conduct' || c.response === 'repair' && (c.kind === 'ship' || c.kind === 'service' || c.kind === 'conduct'); c.severity = U.clamp(c.severity + (good ? -10 : c.response === 'attack' ? 25 : 6), 0, 100); s.trust = U.clamp(s.trust + (good ? 3 : c.response === 'attack' ? -15 : -4), 0, 100); l.fame = Math.round((l.fame || 0) * (c.response === 'attack' ? 0.85 : good ? 0.99 : 0.95)); if (samePartner(l, c)) l.partner.close = U.clamp((l.partner.close || 50) + (good ? 2 : -6), 0, 100); H.fx(l, { hap: good ? -1 : -6 }); log('Bạn đã phản hồi. Nhãn hàng và khán giả còn chờ hành động tiếp theo; vụ việc chưa tự khép lại.', 'neutral'); });
        });
      } else if (l.age > c.followAt) {
        row('follow', 'Cập nhật đính chính và thực hiện ranh giới đã hứa', function (l, r, log) { c.severity = Math.max(0, c.severity - (c.evidence ? 18 : 8)); c.followAt = l.age; s.trust = Math.min(100, s.trust + 4); if (c.severity <= 10) { c.result = topics[c.kind] + ': đã làm rõ và theo dõi hậu quả'; s.history.push(c); if (s.history.length > 24) s.history.shift(); delete s.active; s.policy = 'service'; log(c.result + '.', 'good'); } else log('Vụ việc dịu lại nhưng cần thêm thời gian; uy tín chưa hồi phục hoàn toàn.', 'neutral'); });
      }
      return rows;
    }, 18, 'Công việc');
  // Scandal tự phát vẫn giữ mã cũ và tương thích pending cũ; thêm đường xử lý có hồ sơ.
  E.SC('media_case156', { title: 'Showbiz: dư luận cần lời giải thích', valid: function (l) { return eligible(l) === true; }, text: 'Có tin bàn tán về đời tư hoặc cách quảng bá. Hãy kiểm chứng trước khi kết luận.', opts: [{ k: 'review', l: 'Mở hồ sơ giải quyết scandal', run: function (l, r) { var s = media(l), kind = s.policy === 'private' && l.partner && (l.partner.uid110 || l.partner.contact148 || l.partner.name) === s.partnerId ? 'private' : s.policy === 'ship' ? 'ship' : s.policy === 'service' ? 'service' : 'rumor'; openCase(l, kind); X.next(l, 'media156', r); } }] });
  E.TRIG.push({ id: 'media_case156', when: function (l) { return eligible(l) === true && !(l.flags.media156 && l.flags.media156.active); }, p: function (l) { var s = l.flags.media156; return s && s.policy === 'ship' ? 0.18 : 0.06; }, cd: 3, max: 12, rep: true });
  var oldScandal = E.DEC.scandal;
  if (oldScandal && oldScandal.def) oldScandal.def.opts.push({ k: 'case156', req: function (l) { return eligible(l) === true; }, l: 'Kiểm chứng và xử lý qua hồ sơ truyền thông', run: function (l, r, log, d) { openCase(l, /quỵt|lỡ phát ngôn/.test(d.t || '') ? 'conduct' : 'rumor'); X.next(l, 'media156', r); } });

  // Bỏ bê hồ sơ không xóa hậu quả; mỗi năm chỉ cập nhật một lần.
  E.HOOKS.year.push(function (l) {
    var s = l.flags.media156, c = s && s.active;
    if (!l.alive || !c || c.yearAt === l.age || l.age <= c.at) return;
    c.yearAt = l.age;
    var since = c.followAt == null ? c.at : c.followAt;
    if (l.age - since > 1) { c.severity = Math.min(100, c.severity + 5); s.trust = Math.max(0, s.trust - 3); l.fame = Math.round((l.fame || 0) * 0.97); }
  });

  // Hợp đồng là sổ nghĩa vụ riêng của nghề showbiz, liên kết tài sản và đổi tiền hiện có.
  function owedMedia(l) { var s = l.flags.media156; return s && s.contracts ? s.contracts.reduce(function (n, x) { return n + (x.claim && x.claim.bal || 0); }, 0) : 0; }
  function demandMedia(l, c, log) {
    var s = media(l);
    s.contracts.forEach(function (x) {
      if (x.claim || (c.contracts || []).indexOf(x.id) < 0) return;
      x.status = 'terminated';
      x.claim = { caseId: c.id, stage: 'demand', at: l.age, demand: x.fee * x.rate / 100, grounds: c.kind === 'conduct' || c.kind === 'ship', evidence: c.evidence, response: c.response, bal: 0, paid: 0, fees: 0, late: 0 };
      log(x.brand + ' tạm dừng chiến dịch và gửi yêu cầu bồi thường ' + x.rate + '% cát-xê đã nhận: ' + H.money(l, x.claim.demand) + '. Đây mới là yêu cầu, chưa phải khoản nợ được chấp nhận. Mở Hợp đồng để đối chiếu, thương lượng hoặc phản đối.', 'bad');
    });
  }
  function findContract(l, id) { return media(l).contracts.find(function (x) { return x.id === id; }); }
  function contractText(l, x) {
    var q = x.claim, text = x.brand + ' · cát-xê đã nhận ' + H.money(l, x.fee) + ' · điều khoản bồi thường ' + x.rate + '% cát-xê (tổng yêu cầu, không cộng hoàn cát-xê lần nữa). Hiệu lực: tuổi ' + x.start + '–' + x.end + '. Điều khoản hợp đồng áp dụng khi vi phạm cam kết trung thực trong quảng bá/hành vi gây thiệt hại; hẹn hò riêng tư không tự thành vi phạm.';
    if (!q) return text + (l.age > x.end ? ' Hết hiệu lực, không có yêu cầu bồi thường.' : ' Chưa có yêu cầu bồi thường.');
    var stages = { demand: 'Nhãn hàng gửi yêu cầu, chưa xác nhận nghĩa vụ; không phản hồi trong 2 năm sẽ chuyển giải quyết tranh chấp', review: 'Đã đối chiếu hợp đồng và chứng cứ', dispute: 'Đang giải quyết tranh chấp, kết quả được cập nhật sang năm', payment: 'Đã xác nhận nghĩa vụ thanh toán', closed: q.withdrawn ? 'Yêu cầu đã được rút/bác bỏ' : 'Đã tất toán' };
    return text + '\n' + stages[q.stage] + '. Yêu cầu ban đầu: ' + H.money(l, q.demand) + '. Dư nợ đã xác nhận: ' + H.money(l, q.bal) + '. Đã trả: ' + H.money(l, q.paid) + '. Phí chậm trả đã ghi: ' + H.money(l, q.fees) + (q.offer != null ? '. Đề nghị hòa giải: ' + H.money(l, q.offer) : '') + (q.schedule ? '. Trả dần mỗi năm ' + H.money(l, q.installment) + '; tự trích tối đa tiền sẵn có sau dự phòng sinh hoạt, thiếu tiền vẫn còn nợ.' : '') + (q.stage === 'payment' ? ' Chậm trả: 2% dư nợ/năm, tổng phí tối đa 20% nghĩa vụ gốc đã xác nhận.' : '');
  }
  function agree(l, x, amount, log) { var q = x.claim; if (!q || q.stage === 'payment' || q.stage === 'closed') return; q.principal = amount; q.bal = amount; q.stage = amount > 0 ? 'payment' : 'closed'; q.due = l.age + 1; if (!amount) q.withdrawn = true; log(x.brand + (amount ? ': xác nhận nghĩa vụ ' + H.money(l, amount) + ', chưa tự trừ tiền.' : ': yêu cầu bị rút/bác bỏ, không phát sinh nợ.'), amount ? 'neutral' : 'good'); }
  function payMedia(l, x, amount, log) { var q = x.claim; if (!q || q.stage !== 'payment') return 0; var paid = Math.max(0, Math.min(q.bal, l.money, amount)); if (!(paid > 0)) return 0; H.cash(l, -paid, 'Bồi thường hợp đồng ' + x.brand); q.paid += paid; q.bal = Math.max(0, q.bal - paid); if (q.bal < 1e-8) { q.bal = 0; q.stage = 'closed'; x.status = 'closed'; log('Đã tất toán bồi thường với ' + x.brand + '.', 'good'); } return paid; }
  X.menu('mediaContracts156', 'Showbiz: hợp đồng và bồi thường', eligible,
    function (l) { var s = media(l); return 'Nợ bồi thường đã xác nhận: ' + H.money(l, owedMedia(l)) + '. Yêu cầu chưa được chấp nhận/tranh chấp chưa có kết quả không tính là nợ. Các điều khoản được ghi theo hợp đồng đã ký. Không tự tạo nợ cho hợp đồng từ bản lưu cũ chưa ghi điều khoản. ' + (s.contracts.length ? 'Chọn hợp đồng để xem từng bước.' : 'Chưa ký hợp đồng quảng cáo có điều khoản mới.'); },
    function (l) { return media(l).contracts.slice().sort(function (a,b) { return Number(!!(b.claim && b.claim.stage !== 'closed')) - Number(!!(a.claim && a.claim.stage !== 'closed')) || b.id - a.id; }).slice(0,50).map(function (x) { return { k: String(x.id), l: x.brand + ' · ' + x.rate + '% · ' + (x.claim ? 'Có hồ sơ bồi thường' : l.age > x.end ? 'Hết hạn' : 'Đang hiệu lực'), run: function (l,r) { X.next(l,'mediaClaim156',r,{id:x.id}); } }; }); }, 18, 'Công việc');
  X.menu('mediaClaim156', 'Hồ sơ hợp đồng showbiz', eligible,
    function (l,d) { var x=findContract(l,d && d.arg && d.arg.id); return x ? contractText(l,x) : 'Không tìm thấy hợp đồng.'; },
    function (l,arg) {
      var x=findContract(l,arg.id), q=x && x.claim, rows=[]; if(!x || !q) return rows;
      function row(k,label,fn,why) { rows.push({k:k,l:label,why:why || true,run:function(l,r,log){ fn(l,r,log); X.next(l,'mediaClaim156',r,{id:x.id}); }}); }
      if(q.stage==='demand') row('review','Đối chiếu điều khoản, cát-xê đã nhận và chứng cứ',function(l,r,log){ q.stage='review'; q.reviewedAt=l.age; log('Đã kiểm tra: '+(q.grounds?'có hành vi cần chịu trách nhiệm theo cam kết.':'đời tư/tin đồn không chứng minh vi phạm điều khoản; có thể phản đối yêu cầu.'),'neutral'); });
      if(q.stage==='review') {
        row('negotiate','Thương lượng giảm mức bồi thường',function(l,r,log){ if(q.offer!=null) return; var discount=q.response==='repair' && q.evidence ? .4 : media(l).trust>=60 ? .25 : .1; q.offer=q.demand*(1-discount); log('Nhãn hàng đề nghị giảm '+Math.round(discount*100)+'%, còn '+H.money(l,q.offer)+'. Chưa trừ tiền; bạn có thể nhận hoặc phản đối.','neutral'); },q.offer!=null?'Đã có đề nghị, mở lại không đổi mức':true);
        if(q.offer!=null) row('accept','Chấp nhận hòa giải '+H.money(l,q.offer),function(l,r,log){agree(l,x,q.offer,log);});
        row('acceptFull','Chấp nhận yêu cầu đầy đủ '+H.money(l,q.demand),function(l,r,log){agree(l,x,q.demand,log);});
        row('dispute','Phản đối yêu cầu, chuyển giải quyết tranh chấp',function(l,r,log){q.stage='dispute';q.decisionAt=l.age+1;log('Hai bên lưu hợp đồng và chứng cứ, chờ kết quả sang năm. Mở lại hồ sơ không đổi kết quả.','neutral');});
      }
      if(q.stage==='dispute' && l.age>=q.decisionAt) row('verdict','Nhận kết quả đối chiếu tranh chấp',function(l,r,log){agree(l,x,q.grounds?q.demand:0,log);});
      if(q.stage==='payment') {
        row('pay','Trả hết '+H.money(l,q.bal),function(l,r,log){payMedia(l,x,q.bal,log);},l.money>=q.bal?true:'Chưa đủ tiền; có thể trả một phần hoặc trả dần');
        row('partial','Dùng 25% tiền hiện có trả một phần',function(l,r,log){var v=payMedia(l,x,Math.max(0,l.money)*.25,log);log('Đã trả '+H.money(l,v)+', dư nợ '+H.money(l,q.bal)+'.','neutral');},l.money>0?true:'Không có tiền sẵn có');
        row('schedule','Thỏa thuận trả dần trong 3 năm',function(l,r,log){q.schedule=true;q.installment=q.bal/3;q.due=l.age+1;q.planAt=l.age;log('Đã thống nhất lịch trả dần: mỗi năm '+H.money(l,q.installment)+'. Khoản chưa trả vẫn là nợ; thiếu tiền có thể phát sinh chậm trả.','neutral');},q.schedule?'Đã có lịch trả dần':true);
      }
      return rows;
    },18);
  E.HOOKS.year.push(function(l){
    var s=l.flags.media156;if(!l.alive || !s || !s.contracts) return;
    var log=function(t,k){l.log.push({a:l.age,y:yr(l),t:t,k:k||'neutral'});};
    s.contracts.forEach(function(x){var q=x.claim;if(!q)return;
      if((q.stage==='demand' || q.stage==='review') && l.age-q.at>=2){q.stage='dispute';q.decisionAt=l.age+1;log(x.brand+': yêu cầu chưa được phản hồi suốt 2 năm, chuyển sang giải quyết tranh chấp; năm tới sẽ có kết quả theo chứng cứ.','bad');}
      if(q.stage==='dispute' && l.age>=q.decisionAt)agree(l,x,q.grounds?q.demand:0,log);
      if(q.stage!=='payment' || q.yearAt===l.age || l.age<q.due)return;q.yearAt=l.age;
      var expected=q.schedule?Math.min(q.installment,q.bal):q.bal, paid=0;
      if(q.schedule) paid=payMedia(l,x,Math.min(expected,Math.max(0,l.money-(l.base||1)*.25)),log);
      if(q.stage==='closed')return;
      if(paid+1e-8<expected){q.late++;var fee=Math.min(q.bal*.02,Math.max(0,q.principal*.2-q.fees));q.fees+=fee;q.bal+=fee;s.trust=Math.max(0,s.trust-2);log(x.brand+': kỳ bồi thường còn thiếu '+H.money(l,expected-paid)+', phí chậm trả '+H.money(l,fee)+', tổng dư nợ '+H.money(l,q.bal)+'.','bad');}
      q.due=l.age+1;
    });
  });
  var oldNet=E.netWorth;E.netWorth=function(l){return oldNet.apply(this,arguments)-owedMedia(l);};
  var oldProfile=E.profile;E.profile=function(l){var p=oldProfile.apply(this,arguments);if(owedMedia(l)>0 && p.assets)p.assets.push(['Bồi thường hợp đồng showbiz',-owedMedia(l)]);return p;};
  var oldConvert=E.abroadConvert;E.abroadConvert=function(l,f){var out=oldConvert.apply(this,arguments),s=l.flags.media156;if(s && s.contracts)s.contracts.forEach(function(x){x.fee*=f;var q=x.claim;if(q)['demand','bal','paid','fees','offer','principal','installment'].forEach(function(k){if(Number.isFinite(q[k]))q[k]*=f;});});return out;};
  // Nhãn hàng xem niềm tin và hồ sơ còn mở trước khi ký; bản lưu cũ giữ hành vi cũ.
  var ad = E.DEC.quang_cao && E.DEC.quang_cao.def;
  if (ad) {
    var adPrep=ad.prep,adText=ad.text;
    ad.prep=function(l,r,arg){var d=adPrep(l,r,arg);d.mediaRate156=[200,300,500][Math.floor(r()*3)];return d;};
    ad.text=function(l,d){return adText(l,d)+' Điều khoản hợp đồng: nếu vi phạm cam kết trung thực trong quảng bá/hành vi gây thiệt hại, nhãn hàng có thể yêu cầu '+(d.mediaRate156||300)+'% cát-xê đã nhận trong 2 năm. Đây là tổng yêu cầu, không cộng hoàn cát-xê thêm lần nữa. Có thể thương lượng gói an toàn: nhận 75% cát-xê, trần bồi thường 100%.';};
    var safeRun=ad.opts.find(function(o){return o.k==='ok';}).run;
    ad.opts.push({k:'capped156',l:'Thương lượng gói an toàn: 75% cát-xê, trần bồi thường 100%',run:function(l,r,log,d){safeRun(l,r,log,Object.assign({},d,{fee:d.fee*.75}));}});
  }
  if (ad) ad.opts.forEach(function (o) {
    if (o.k === 'no') return;
    var run = o.run;
    o.run = function (l, r, log, d) { var s = l.flags.media156; if (s && (s.trust < 35 || s.contracts && s.contracts.some(function(x){return x.claim && x.claim.stage==='payment' && x.claim.late>=2;}) || s.active && s.active.severity >= 40)) { log('Nhãn hàng hoãn ký hợp đồng, chờ bạn làm rõ hồ sơ và khôi phục niềm tin. Bạn chưa nhận cát-xê.', 'neutral'); return; } if(d.mediaContractId156) { log('Hợp đồng này đã ký, không nhận tiền hai lần.','neutral'); return; } run(l, r, log, d);
      if (!Number.isFinite(d.mediaRate156)) return; // Pending cũ chưa công bố điều khoản: không hồi tố.
      s=media(l);s.contractSerial=(s.contractSerial||0)+1;var id=s.contractSerial;d.mediaContractId156=id;
      var fee=d.fee*(o.k==='dubious'?1.5:o.k==='capped156'?.75:1),rate=o.k==='capped156'?100:d.mediaRate156||300;
      s.contracts.push({id:id,brand:d.brand,fee:fee,rate:rate,start:l.age,end:l.age+2,status:'signed'});
      log('Đã lưu hợp đồng '+d.brand+': nhận '+H.money(l,fee)+', điều khoản bồi thường '+rate+'% = '+H.money(l,fee*rate/100)+', hiệu lực 2 năm.','neutral');
    };
  });
  E.MEDIA156 = { state: media, open: openCase, eligible: eligible, owed: owedMedia, demand: demandMedia, pay: payMedia, text: contractText };
  E.SHOWBIZ156 = { achievements: true };
})(globalThis.G);
