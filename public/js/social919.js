/* Một Đời — Quan hệ xã hội mở rộng (8.10.23).
   · Lỗi đã tái hiện: bộ lọc "Thu nhập cao" của hẹn hò (life114) gần như không bao giờ ra người phù hợp. Người được gặp chỉ được gán nghề
     phổ thông với bậc nghề theo tuổi (family.js) rồi mới bị lọc; thu nhập ≥ 3 lần mức cơ sở hầu như không xuất hiện. Nay khi bộ lọc
     không khớp, có thêm khả năng gặp người thu nhập cao theo hoàn cảnh thật của bạn (sống ở thành phố, tài sản, vòng quan hệ thượng
     lưu, đã dự sự kiện giao lưu); không bảo đảm, có thể không gặp ai. Giàu không đồng nghĩa tính cách tốt hay xấu.
   · Sự kiện cùng doanh nhân/người nổi tiếng trong danh bạ (ELITE148, celeb912): yến tiệc/gala, cùng làm từ thiện, diễn đàn
     kinh doanh/golf, đấu giá nghệ thuật. Người kia có thể từ chối; tin cậy tăng theo tính cách của họ; có thể được giới thiệu người mới.
   · Cha hoặc mẹ là ca sĩ/diễn viên nổi tiếng (nhân vật hư cấu của đời này): bị trêu ở trường, phóng viên chờ trước cổng, người lạ
     bám theo (chuỗi nhiều năm có báo cha mẹ/cơ quan chức năng), nhưng cũng có cơ hội và áp lực bị so sánh. Tần suất cân bằng. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, C = E.ELITE148;
  if (!X) return;
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; return h >>> 0; }
  function u(seed) { return hash(seed) / 4294967296; }
  function mo(l, v) { return H.money(l, v); }
  function st(l) { var s = l.flags.social919; if (!s || typeof s !== 'object') s = l.flags.social919 = { events: {}, n: {} }; if (!s.events) s.events = {}; if (!s.n) s.n = {}; return s; }

  // ================= Hẹn hò: nhóm người thu nhập cao =================
  function filt(l) { return l.flags.life114 || {}; }
  function eliteTier(l) { return C && C.tier ? C.tier(l) : 0; }
  function reach(l) { return U.clamp(0.2 + (l.urban ? 0.15 : 0) + Math.min(0.25, Math.max(0, l.money) / Math.max(1, l.base) / 40) + eliteTier(l) * 0.08 + (st(l).galaAt != null && l.age - st(l).galaAt <= 2 ? 0.1 : 0), 0.1, 0.8); }
  function richJob(l, p, cat, mult, r) {
    var need = l.base * mult / 12, best = [];
    Object.keys(E.CAR).forEach(function (id) { var c = E.CAR[id]; if (c.hidden || c.fame || c.sec === 'crime' || c.skillRank != null || c.vnOnly && !H.isVN(l)) return; if (cat && cat !== 'any' && c.cat !== cat) return; for (var rk = 0; rk < c.t.length; rk++) { var m = E.monthlyEst(l, id, rk); if (m >= need) { best.push({ id: id, rk: rk, m: m, w: (c.w || 1) / (1 + rk) }); break; } } });
    if (!best.length) return false; var x = U.wpick(r, best, function (b) { return b.w; }), c = E.CAR[x.id];
    p.jobId = x.id; p.job = c.t[x.rk]; p.inc = Math.max(need * (1.05 + r() * 0.8), x.m); p.age = Math.max(p.age, 26 + x.rk * 3); p.rich919 = true; p.wealth919 = r() < 0.4 ? 'gia đình khá giả' : 'tự gây dựng sự nghiệp'; return true;
  }
  var lm = E.DEC.love.make, la = E.DEC.love.apply;
  E.DEC.love.make = function (l, r, arg) {
    var d = lm.apply(this, arguments), f = filt(l);
    if (!d || !d.data || !d.data.noMatch114 || l.age < 22) return d;
    if (f.dateIncome !== 'high' && f.dateIncome !== 'stable' && (!f.dateJob || f.dateJob === 'any')) return d;
    if (r() > reach(l)) { d.text += ' Người thu nhập cao thường gặp qua công việc, sự kiện giao lưu hoặc người quen giới thiệu; bạn có thể mở rộng vòng quan hệ.'; return d; }
    var p = d.data.p, mult = f.dateIncome === 'high' ? 3 : f.dateIncome === 'stable' ? 0.7 : 0;
    if (!richJob(l, p, f.dateJob, mult, r)) return d;
    delete d.data.noMatch114; d.text = 'Bạn quen ' + p.name + ' (' + (p.sex === 'M' ? 'nam' : 'nữ') + ', ' + p.age + ' tuổi) qua một buổi gặp gỡ ' + (l.urban ? 'ở thành phố' : 'qua người quen') + ', đang làm ' + p.job + ' (' + p.wealth919 + '). Một người ' + (p.desc || 'dễ gần') + '. Thu nhập không nói lên tính cách; hai người cần thời gian tìm hiểu.';
    if (!d.opts.some(function (o) { return o.k === 'yes'; })) d.opts.unshift({ k: 'yes', l: 'Tìm hiểu nhau', h: '' });
    return d;
  };

  // ================= Sự kiện cùng doanh nhân / người nổi tiếng =================
  var EV = {
    gala: ['Cùng dự yến tiệc / gala', 0.02, 'mọi giới', 3], charity: ['Cùng tổ chức một hoạt động từ thiện', 0.05, 'mọi giới', 8], forum: ['Diễn đàn kinh doanh / một vòng golf', 0.015, 'business', 5], auction: ['Đấu giá nghệ thuật / khai mạc triển lãm', 0.03, 'artist', 6]
  };
  function contacts(l) { return C && C.contacts ? C.contacts(l, function (p) { return p.fictional !== false; }).slice(0, 15) : []; }
  function trustOf(p) { return p.rel912 ? p.rel912.trust : p.trust || 0; }
  function addTrust(l, p, d, where) { if (p.rel912) p.rel912.trust = U.clamp(p.rel912.trust + d, 0, 100); if (C.seen) C.seen(l, p, where, p.rel912 ? 0 : d); }
  function evWhy(l, p, k) { var s = st(l), E0 = EV[k]; if (l.age < 18) return 'Cần đủ 18 tuổi'; if ((s.n[l.age] || 0) >= 3) return 'Đã dự 3 sự kiện năm nay'; if (s.events[p.uid110] === l.age) return 'Đã gặp người này trong một sự kiện năm nay'; if (E0[2] === 'business' && !/business|investor/.test(p.kind)) return 'Dành cho doanh nhân, nhà đầu tư'; if (E0[2] === 'artist' && !(p.kind === 'artist' || p.celeb)) return 'Dành cho giới nghệ sĩ'; var c = l.base * E0[1] * (1 + eliteTier(l) * 0.5); if (l.money < c) return 'Chưa đủ chi phí'; return true; }
  function runEv(l, p, k, r, log) {
    var s = st(l), E0 = EV[k], c = l.base * E0[1] * (1 + eliteTier(l) * 0.5); if (evWhy(l, p, k) !== true) return; H.cash(l, -c, E0[0]); s.events[p.uid110] = l.age; s.n[l.age] = (s.n[l.age] || 0) + 1; if (k === 'gala') s.galaAt = l.age;
    var gap = Math.max(0, (p.tier || 0) - eliteTier(l)), yes = r() < U.clamp(0.75 - gap * 0.12 + trustOf(p) / 300 + (p.warmth || 50) / 400, 0.15, 0.95);
    if (!yes) { log(p.name + ' bận lịch, gửi lời cảm ơn nhưng không tham gia cùng bạn lần này.', 'neutral'); return; }
    var g = E0[3] + Math.round((p.warmth || 50) / 25);
    if (k === 'charity') { H.fx(l, { karma: 3 }); l.fame = (l.fame || 0) + 2000; if ((p.honesty || 50) < 30) { g = Math.round(g / 2); log('Buổi từ thiện với ' + p.name + ' diễn ra, nhưng bạn nhận ra người kia quan tâm truyền thông hơn người được giúp.', 'neutral'); } else log('Bạn và ' + p.name + ' cùng tổ chức chương trình từ thiện; số tiền và hiện vật đến đúng người cần.', 'good'); }
    else if (k === 'gala') { log('Bạn cùng ' + p.name + ' dự yến tiệc, được giới thiệu với nhiều người trong giới.', 'good'); if (C.meet && r() < 0.5) { var q = C.meet(l, r, { kind: p.kind, where: 'yến tiệc cùng ' + p.name, tier: p.tier }); log('Bạn làm quen thêm ' + q.name + ' (' + q.job + ').', 'neutral'); } }
    else if (k === 'forum') { log('Sau diễn đàn/vòng golf, ' + p.name + ' trao đổi về cơ hội hợp tác.', 'good'); if (r() < 0.3 + (p.ambition || 50) / 300) { l.flags.referral919 = l.age; log(p.name + ' giới thiệu bạn với một đối tác đang tìm người.', 'good'); } }
    else { log('Bạn cùng ' + p.name + ' dự buổi đấu giá/triển lãm, nói chuyện về nghệ thuật cả buổi.', 'good'); }
    addTrust(l, p, g, E0[0].toLowerCase());
  }
  X.menu('eliteEvents919', 'Sự kiện cùng doanh nhân và người nổi tiếng', function (l) { var r = X.reason(l, 18); if (r !== true) return r; return contacts(l).length ? true : 'Chưa quen doanh nhân hay người nổi tiếng nào'; }, function (l, d) {
    var a = d && d.arg || {}, p = a.id && C.find(l, a.id); if (p) return p.name + ' · ' + (p.job || '') + ' · tin cậy ' + Math.round(trustOf(p)) + '/100. Mỗi sự kiện tốn chi phí, người kia có thể từ chối; quan hệ phát triển dần qua nhiều lần gặp.';
    return 'Mời người quen trong giới doanh nhân/nghệ sĩ cùng tham gia sự kiện. Tối đa 3 sự kiện/năm. Các nhân vật trong danh bạ là hư cấu.';
  }, function (l, arg) {
    var p = arg && arg.id && C.find(l, arg.id);
    if (!p) return contacts(l).map(function (q) { return { k: q.uid110, l: q.name + ' · ' + (q.job || q.kind) + ' · tin cậy ' + Math.round(trustOf(q)), run: function (l, r) { X.next(l, 'eliteEvents919', r, { id: q.uid110 }); } }; });
    return Object.keys(EV).map(function (k) { return { k: k, l: EV[k][0] + ' với ' + p.name, h: '~' + mo(l, l.base * EV[k][1] * (1 + eliteTier(l) * 0.5)), why: evWhy(l, p, k), run: function (l, r, log) { runEv(l, p, k, r, log); } }; }).concat([{ k: 'back', l: '← Danh bạ', run: function (l, r) { X.next(l, 'eliteEvents919', r, {}); } }]);
  }, 18, 'Tình cảm & gia đình');

  // ================= Cha/mẹ là ca sĩ hoặc diễn viên nổi tiếng =================
  var cr0 = E.createLife; E.createLife = function (o) {
    var l = cr0.apply(this, arguments); if (!l || !l.flags || o && o.parent || l.fam.orphan || l.flags.tempCare919) return l;
    var q = l.fam.q || 3, p = (o && o.celebParent) ? 1 : q >= 5 ? 0.02 : q === 4 ? 0.01 : q === 3 ? 0.004 : 0.0015; if (u(l.id + ':cp919') >= p) return l;
    var side = u(l.id + ':cps') < 0.5 ? 'm' : 'f'; if (side === 'f' && (l.fam.noDad || !l.fam.fAlive)) side = 'm';
    var kind = u(l.id + ':cpk') < 0.5 ? 'ca sĩ' : 'diễn viên', fame = Math.round(5e5 + u(l.id + ':cpf') * 1.5e7);
    l.fam[side + 'Job'] = kind + ' nổi tiếng'; l.fam[side + 'Inc'] = Math.max(l.fam[side + 'Inc'] || 0, l.base / 12 * (3 + u(l.id + ':cpi') * 9)); l.fam[side + 'Inc0'] = l.fam[side + 'Inc'];
    l.flags.celebParent919 = { side: side, kind: kind, name: l.fam[side + 'Name'], fame: fame, fictional: true };
    if (l.log[0]) l.log[0].t += ' ' + (side === 'm' ? 'Mẹ' : 'Bố') + ' bạn là ' + kind + ' nổi tiếng ' + l.fam[side + 'Name'] + '; ngay từ ngày bạn chào đời, báo chí đã đưa tin.';
    return l;
  };
  function cp(l) { var c = l.flags.celebParent919; if (!c) return null; return c; }
  var KIDEV = ['tease', 'paparazzi', 'stalker', 'perk', 'compare', 'perk2'];
  E.SC('celebKid919', { title: 'Con của người nổi tiếng', valid: function (l, d) { return l.alive && !!cp(l) && l.age >= 5 && l.age <= 25; },
    prep: function (l, r) { var s = st(l), list = KIDEV.filter(function (k) { return !(k === 'stalker' && (l.age < 10 || s.stalk && !s.stalk.done)) && !(s.lastKid === k); }), k = list[Math.floor(r() * list.length)]; s.lastKid = k; return { k: k }; },
    text: function (l, d) { var c = cp(l), who = (c.side === 'm' ? 'mẹ' : 'bố'); return { tease: 'Ở trường, vài bạn trêu chọc, bắt chước bài hát/vai diễn của ' + who + ' bạn và nói bạn "được ưu ái".', paparazzi: 'Phóng viên ảnh chờ trước cổng trường để chụp con của ' + c.kind + ' ' + c.name + '.', stalker: 'Mấy tuần nay một người lạ xuất hiện nhiều lần gần nhà và trường, có vẻ bám theo bạn.', perk: who.charAt(0).toUpperCase() + who.slice(1) + ' đưa bạn vào hậu trường một chương trình lớn; bạn gặp nhiều nghệ sĩ.', compare: 'Thầy cô và bạn bè hay so sánh bạn với ' + who + ': "con nhà nòi chắc cũng giỏi".', perk2: 'Một quỹ học bổng mời bạn tham gia trại hè nghệ thuật nhờ quen biết của gia đình — bạn có thể nhận hoặc tự nộp hồ sơ như mọi người.' }[d.k] + ' Mọi người đều có cuộc sống riêng; nổi tiếng của cha mẹ không quyết định bạn là ai.'; },
    opts: [{ k: 'a', l: function (l, d) { return { tease: 'Nói chuyện với giáo viên chủ nhiệm', paparazzi: 'Nhờ đội ngũ của cha/mẹ đề nghị báo chí tôn trọng quyền riêng tư của trẻ', stalker: 'Kể ngay với cha mẹ và nhà trường, báo cơ quan chức năng', perk: 'Lặng lẽ quan sát, học hỏi', compare: 'Nói thẳng rằng mình muốn được nhìn nhận là chính mình', perk2: 'Tự nộp hồ sơ như mọi người' }[d.k]; }, run: function (l, r, log, d) { ev(l, r, log, d.k, 'a'); } },
      { k: 'b', l: function (l, d) { return { tease: 'Kệ, chơi với những bạn thật lòng', paparazzi: 'Đeo khẩu trang, đi lối khác', stalker: 'Giữ im lặng, tự tránh mặt', perk: 'Chụp ảnh khoe lên mạng', compare: 'Cố gắng chứng minh bằng thành tích', perk2: 'Nhận suất giới thiệu của gia đình' }[d.k]; }, run: function (l, r, log, d) { ev(l, r, log, d.k, 'b'); } }] });
  function ev(l, r, log, k, c) {
    var s = st(l), stress = function (x) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + x, 0, 100); };
    if (k === 'tease') { if (c === 'a') { H.fx(l, { hap: 1 }); log('Giáo viên nhắc nhở cả lớp; chuyện trêu chọc giảm hẳn.', 'good'); } else { H.fx(l, { soc: 1 }); stress(3); log('Bạn chọn bạn mà chơi; vẫn buồn đôi lúc nhưng có nhóm bạn thân thật lòng.', 'neutral'); } }
    if (k === 'paparazzi') { if (c === 'a') { log('Đội ngũ của gia đình gửi yêu cầu; nhiều tờ báo cam kết che mặt trẻ em.', 'good'); stress(-2); } else { stress(4); log('Bạn đi lối khác; ảnh vẫn bị đăng nhưng mờ mặt.', 'neutral'); } }
    if (k === 'stalker') { s.stalk = { at: l.age, told: c === 'a', done: false }; if (c === 'a') { log('Cha mẹ thuê thêm bảo vệ, nhà trường và cơ quan chức năng nắm thông tin; người lạ bị yêu cầu giữ khoảng cách.', 'neutral'); stress(4); } else { stress(8); log('Bạn giữ im lặng và tránh mặt, nhưng nỗi sợ cứ đeo bám.', 'bad'); } }
    if (k === 'perk') { if (c === 'a') { H.fx(l, { soc: 2, kno: 1 }); log('Bạn học được nhiều điều về công việc phía sau sân khấu.', 'good'); } else { l.fame = (l.fame || 0) + 5000; H.fx(l, { hap: 2 }); log('Ảnh hậu trường được chia sẻ nhiều; bạn có thêm người theo dõi tò mò.', 'neutral'); } }
    if (k === 'compare') { if (c === 'a') { H.fx(l, { hap: 2 }); log('Mọi người dần nhìn bạn như một người riêng biệt.', 'good'); } else { H.fx(l, { kno: 2 }); stress(5); log('Bạn chăm chỉ hơn, nhưng áp lực phải "bằng cha mẹ" khá nặng.', 'neutral'); } }
    if (k === 'perk2') { if (c === 'a') { var ok = r() < 0.5; H.fx(l, { hap: ok ? 4 : 0 }); log(ok ? 'Bạn được nhận vào trại hè bằng chính hồ sơ của mình.' : 'Hồ sơ chưa được chọn năm nay; bạn rút kinh nghiệm cho lần sau.', 'neutral'); } else { H.fx(l, { hap: 3 }); H.fx(l, { karma: -1 }); log('Bạn vào trại hè nhờ suất giới thiệu; vài bạn xì xào về "quan hệ".', 'neutral'); } }
  }
  function stalkYear(l, log) { var s = st(l), q = s.stalk; if (!q || q.done || l.age <= q.at) return; q.done = l.age; if (q.told) log('Người bám theo năm ngoái bị xử lý theo quy định và không còn xuất hiện; bạn được hướng dẫn cách giữ an toàn.', 'good'); else { var bad = u(l.id + ':stk:' + l.age) < 0.4; log(bad ? 'Người lạ tiếp tục bám theo; một lần tiến lại quá gần khiến bạn hoảng sợ. Cha mẹ biết chuyện và báo cơ quan chức năng.' : 'Người lạ không còn xuất hiện; bạn vẫn dè chừng mỗi lần tan học.', bad ? 'bad' : 'neutral'); if (bad && l.mind) l.mind.stress = U.clamp(l.mind.stress + 10, 0, 100); } }
  E.TRIG.push({ id: 'celebKid919', when: function (l, a) { return !!cp(l) && a >= 5 && a <= 25 && !(l.jailUntil != null && a < l.jailUntil); }, p: 0.18, cd: 2, max: 8 });
  // Con của người nổi tiếng vào nghề biểu diễn: khán giả tò mò ban đầu, nhưng giữ được hay không là do năng lực.
  var sj0 = E.startJob; E.startJob = function (l, id, r, log) { var had = l.job && l.job.id, out = sj0.apply(this, arguments); var c = cp(l), car = E.CAR && E.CAR[id]; if (c && car && car.fame && had !== id && !st(l).debut) { st(l).debut = l.age; l.fame = Math.max(l.fame || 0, 3e4); if (typeof log === 'function') log('Khán giả tò mò về con của ' + c.kind + ' ' + c.name + '; bạn có sự chú ý ban đầu, nhưng giữ được hay không là do năng lực.', 'neutral'); } return out; };
  var prof0 = E.profile; E.profile = function (l) { var p = prof0.apply(this, arguments), c = l.flags && l.flags.celebParent919; if (p && p.jobInfo && c) p.jobInfo.push((c.side === 'm' ? 'Mẹ' : 'Bố') + ' là ' + c.kind + ' nổi tiếng ' + c.name + ' (nhân vật hư cấu)'); return p; };
  E.HOOKS.year.push(function (l, r, log) { if (!l.alive || !l.flags || !l.flags.social919 && !l.flags.celebParent919) return; stalkYear(l, log); });
  var mig = E.migrateExt; E.migrateExt = function (l) { if (mig) mig(l); if (l && l.flags && l.flags.social919 != null && typeof l.flags.social919 !== 'object') delete l.flags.social919; };
  E.SOCIAL919 = { reach: reach, richJob: richJob, EV: EV, evWhy: evWhy, runEv: runEv, contacts: contacts, cp: cp, ev: ev, state: st };
})(globalThis.G);
