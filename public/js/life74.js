/* Một Đời — v5.9.0:
   · con ngoài hôn nhân: có thai khi đang hẹn hò, chưa cưới — cưới chạy bầu, sinh con khi chưa cưới, làm mẹ đơn thân, nhận con và chu cấp nuôi con, hoặc chưa giữ thai
   · nhiều bạn thân hơn (từ trường lớp, giảng đường, chỗ làm, xóm), có chuyện cùng bạn thân, có thể xa cách theo năm tháng
   · có thể hẹn hò với bạn thân (đúng xu hướng tính dục, chênh lệch tuổi hợp lý)
   · định cư nước ngoài: sốc văn hóa, học tiếng bản xứ, thường trú, công nhận bằng cấp, kỳ thị, Tết xa nhà, gửi tiền về nhà, bảo lãnh bố mẹ, dạy con tiếng mẹ đẻ, cộng đồng đồng hương */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, W = G.W, isVN = H.isVN;
  function fx(l, o) { H.fx(l, o); }
  function stress(l, d) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + d, 0, 100); }
  function ch(r, p) { return r() < p; }
  function vnd(l) { return isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  function V(l, tr) { return vnd(l) ? tr : tr / 90 * l.base; }
  function mo(l, v) { return H.money(l, v); }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function A(id, g, label, o) { var x = { id: id, g: g, l: label }; for (var k in o) x[k] = o[k]; E.ACT.push(x); }
  function T(id, when, p, cd, max) { E.TRIG.push({ id: id, when: function (l, a) { return free(l) && when(l, a); }, p: p, cd: cd || 3, max: max || 4 }); }
  function parents(l) { var f = l.fam || {}; return { m: !f.noMom && f.mAlive, b: !f.noDad && f.fAlive }; }
  function parentWord(l) { var P = parents(l); return P.m && P.b ? 'bố mẹ' : P.m ? 'mẹ' : P.b ? 'bố' : ''; }
  function pay(l, tr, why) { var x = V(l, tr); H.cash(l, -x, why); return x; }

  // ===================================================================
  // 1. CON NGOÀI HÔN NHÂN
  // ===================================================================
  function dating(l) { var p = l.partner; return !!(p && p.alive !== false && p.status === 'dating'); }
  function momAge(l) { var p = l.partner; return l.sex === 'F' ? l.age : p.age; }
  function fertile(l) { var p = l.partner; return dating(l) && p.sex !== l.sex && l.age >= 18 && p.age >= 18 && momAge(l) <= 44; }
  function birth(l, r, log, mark) {
    var n0 = l.kids.length, p = l.partner; if (!p) return null;
    E.DEC.kid.apply(l, { id: 'kid', data: { adopt: false }, opts: [] }, 'yes', r, log);
    var k = l.kids.length > n0 ? l.kids[l.kids.length - 1] : null;
    if (k) { k.oow = true; k.otherParent = p.name; if (mark) for (var x in mark) k[x] = mark[x]; }
    return k;
  }
  function familyTalk(l, r, log) {
    var pw = parentWord(l); if (!pw) return;
    var strict = isVN(l) && !l.urban;
    log(U.pick(r, strict ? [U.cap(pw) + ' giận mấy hôm vì chuyện "chửa trước", hàng xóm xì xào. Rồi ' + pw + ' vẫn đan cho cháu chiếc áo len đầu tiên.', U.cap(pw) + ' lặng người khi nghe tin, sau cùng chỉ dặn: "Đã có con thì phải sống cho có trách nhiệm."'] : [U.cap(pw) + ' bất ngờ, trách bạn không cẩn thận, nhưng rồi vẫn háo hức chờ cháu.', U.cap(pw) + ' ôm bạn: "Chuyện đã vậy, cả nhà cùng lo."']), 'neutral');
  }
  SC('co_bau_som', {
    title: 'Tin bất ngờ', prep: function (l) { return { pid: l.partner ? l.partner.name : '', me: l.sex === 'F' }; },
    valid: function (l, d) { return fertile(l) && (!d || !d.pid || l.partner.name === d.pid); },
    text: function (l, d) { return (d.me ? 'Que thử hai vạch. Bạn đang mang thai con của ' + d.pid + ', khi hai người còn chưa cưới.' : d.pid + ' báo tin đang mang thai con của bạn, khi hai người còn chưa cưới.') + (isVN(l) && !l.urban ? ' Ở quê, chuyện "chửa trước" vẫn còn bị dị nghị.' : '') + ' Hai bạn sẽ làm gì?'; },
    opts: [
      { k: 'cuoi', l: 'Cưới chạy bầu', h: function (l) { return 'Đám cưới nhỏ, gấp · khoảng ' + mo(l, V(l, 40)); }, ai: { w: 1.2 }, run: function (l, r, log, d) {
        var p = l.partner; if (!p) return; if (l.indep) pay(l, 40, 'Đám cưới chạy bầu'); p.status = 'married'; p.since = l.age; l.st.hap += 6; log('Tổ chức đám cưới chạy bầu với ' + p.name + '. ' + (d.me ? 'Bạn mặc chiếc váy cưới rộng để che bụng bầu.' : 'Cô dâu mặc chiếc váy cưới rộng để che bụng bầu.') + ' Đám cưới gấp mà vẫn đủ đầy họ hàng.', 'big');
        familyTalk(l, r, log); var k = birth(l, r, log); if (k) k.oow = false; H.mem(l, 'Đám cưới chạy bầu với ' + p.name + '.', 4); } },
      { k: 'cung_nuoi', l: 'Sinh con, chưa cưới, cùng nhau nuôi', h: 'Con ngoài giá thú, hai bạn vẫn bên nhau', ai: { w: 0.8 }, run: function (l, r, log, d) { familyTalk(l, r, log); var k = birth(l, r, log); if (k) log('Hai bạn chưa cưới nhưng cùng nhau chăm ' + k.name + '. Giấy khai sinh vẫn ghi đủ tên cả bố lẫn mẹ.', 'neutral'); } },
      { k: 'don_than', l: function (l, d) { return d.me ? 'Một mình sinh và nuôi con' : 'Nhận con nhưng không chung sống, chu cấp nuôi con'; }, h: function (l, d) { return d.me ? 'Làm mẹ đơn thân' : 'Gửi tiền nuôi con hằng tháng đến khi con 18 tuổi'; }, ai: { w: 0.4 }, run: function (l, r, log, d) {
        var p = l.partner; if (!p) return; var name = p.name; familyTalk(l, r, log);
        var k = birth(l, r, log, d.me ? null : { custody: 'other' });
        l.partner = null; l.exes = (l.exes || 0) + 1; l.st.hap -= 6; stress(l, 8);
        if (d.me) { l.flags.singleParent = true; log(U.pick(r, [name + ' không muốn có trách nhiệm, cắt đứt liên lạc. Bạn một mình vượt cạn, một mình nuôi con.', 'Hai người chia tay trước ngày sinh. Bạn quyết định làm mẹ đơn thân, ôm con vào lòng mà tự nhủ phải mạnh mẽ.']), 'bad'); H.mem(l, 'Một mình bế con ' + (k ? k.name : '') + ' về nhà sau ngày sinh.', 6); }
        else { log('Bạn và ' + name + ' chia tay, con ở với mẹ. Bạn nhận con, ký giấy chu cấp nuôi con hằng tháng và vẫn thường đến thăm.', 'neutral'); } } },
      { k: 'chua_giu', l: 'Chưa sẵn sàng, quyết định không giữ thai', h: 'Được bác sĩ tư vấn ở cơ sở y tế uy tín', ai: { w: 0.4 }, run: function (l, r, log, d) {
        l.st.hap -= 8; stress(l, 8); log('Sau nhiều đêm suy nghĩ, hai bạn quyết định chưa giữ lại em bé. ' + (d.me ? 'Bạn' : d.pid) + ' đến cơ sở y tế uy tín, được bác sĩ tư vấn kỹ. Chuyện ấy để lại một khoảng lặng rất lâu.', 'bad'); H.mem(l, 'Quyết định khó khăn nhất năm ' + l.age + ' tuổi.', 4);
        if (ch(r, 0.3) && l.partner) { var n = l.partner.name; l.partner = null; l.exes = (l.exes || 0) + 1; log('Sau chuyện ấy, bạn và ' + n + ' dần xa nhau rồi chia tay.', 'bad'); } } }
    ]
  });
  T('co_bau_som', function (l) { return fertile(l) && l.age - l.partner.since >= 1; }, 0.035, 3, 2);
  // tiền chu cấp nuôi con khi con sống với người kia
  E.HOOKS.year.unshift(function (l, r, log, a) {
    if (!l.alive || !l.indep) return;
    (l.kids || []).forEach(function (k) {
      if (k.alive === false || k.custody !== 'other') return; var age = a - k.born; if (age < 0 || age >= 18) return;
      var x = V(l, 48); H.cash(l, -x, 'Tiền chu cấp nuôi con ' + k.name);
      if (age === 0 || age % 5 === 0) log('Gửi tiền nuôi con ' + k.name + ' (' + age + ' tuổi) cho mẹ của bé, cuối tuần đến đón con đi chơi.', 'neutral');
    });
  });

  // ===================================================================
  // 2. NHIỀU BẠN THÂN HƠN
  // ===================================================================
  function friends(l) { return (l.friends || (l.friends = [])); }
  function liveFriends(l) { return friends(l).filter(function (f) { return f.alive !== false; }); }
  function fAge(l, f) { return l.age + (f.d || 0); }
  E.friendsOf = function (l) { return [l.bff].concat(friends(l)).filter(function (f) { return f && f.alive !== false; }); };
  function where(l) { if (l.school && /^(primary|lower|upper|priv)$/.test(l.school)) return ['trường', 'Ngồi cùng bàn, cùng đi học về']; if (l.school && /^(uni|post|phd|voc|police)$/.test(l.school)) return ['giảng đường', 'Cùng nhóm làm bài tập, cùng ở trọ gần nhau']; if (l.job) return ['chỗ làm', 'Cùng ca, cùng ăn trưa, cùng than chuyện công việc']; return ['xóm', 'Hàng xóm sát vách, chiều nào cũng ngồi cà phê với nhau']; }
  SC('ban_than_moi', {
    title: 'Một người bạn mới',
    prep: function (l, r) { var s = r() < 0.6 ? l.sex : (l.sex === 'M' ? 'F' : 'M'), w = where(l); return { n: H.stranger(l, r, s), sex: s, d: U.randint(r, l.age < 18 ? -1 : -4, l.age < 18 ? 1 : 4), w: w[0], how: w[1] }; },
    valid: function (l) { return liveFriends(l).length < 4; },
    text: function (l, d) { return 'Ở ' + d.w + ', bạn ngày càng thân với ' + d.n + ' (' + (d.sex === 'M' ? 'nam' : 'nữ') + ', ' + Math.max(6, l.age + d.d) + ' tuổi). ' + d.how + '.'; },
    opts: [
      { k: 'than', l: 'Kết thân, coi nhau như bạn thân', ai: { w: 1.3, soc: 1 }, run: function (l, r, log, d) { friends(l).push({ name: d.n, sex: d.sex, d: d.d, since: l.age, close: 65, alive: true, from: d.w }); fx(l, { soc: 4, hap: 2 }); log('Từ đó ' + d.n + ' thành một người bạn thân của bạn.', 'good'); H.mem(l, 'Ngày thân với ' + d.n + ' ở ' + d.w + '.', 2); } },
      { k: 'xa', l: 'Chỉ là bạn bình thường', ai: { w: 0.5 }, run: function (l, r, log, d) { log('Bạn và ' + d.n + ' vẫn chào hỏi, nhưng không thân hơn.', 'neutral'); } }
    ]
  });
  T('ban_than_moi', function (l, a) { return a >= 8 && a <= 65 && liveFriends(l).length < 4; }, 0.12, 4, 4);
  function pickFriend(l, r, cond) { var list = E.friendsOf(l).filter(function (f) { return !cond || cond(f); }); return list.length ? U.pick(r, list) : null; }
  SC('ban_than_hen', {
    title: function (l, d) { return 'Hẹn với ' + d.n; },
    prep: function (l, r) { var f = pickFriend(l, r); return { n: f ? f.name : '' }; },
    valid: function (l, d) { return E.friendsOf(l).some(function (f) { return !d || !d.n || f.name === d.n; }) && E.friendsOf(l).length > 0; },
    text: function (l, d) { return d.n + ' nhắn tin: "Lâu rồi không gặp, cuối tuần này rảnh không?"'; },
    opts: [
      { k: 'an', l: 'Đi ăn, đi cà phê', ai: { w: 1.2 }, run: function (l, r, log, d) { var f = find(l, d.n); if (f) f.close = Math.min(100, (f.close || 50) + 6); if (l.age >= 18) H.cash(l, -V(l, 0.3), 'Đi chơi với bạn thân'); fx(l, { hap: 3, soc: 3 }); log(U.pick(r, ['Ngồi với ' + d.n + ' từ chiều đến tối, chuyện cũ chuyện mới kể mãi không hết.', 'Đi ăn với ' + d.n + ', cười đau cả bụng vì mấy chuyện ngày xưa.', d.n + ' rủ đi một quán mới mở, hai đứa chụp cả trăm tấm ảnh.']), 'good'); } },
      { k: 'tam_su', l: 'Ngồi tâm sự chuyện đời', ai: { w: 1 }, run: function (l, r, log, d) { var f = find(l, d.n); if (f) f.close = Math.min(100, (f.close || 50) + 8); stress(l, -6); fx(l, { hap: 2 }); log('Kể cho ' + d.n + ' nghe những chuyện chưa dám nói với ai. Nhẹ lòng hẳn.', 'good'); } },
      { k: 'ban', l: 'Bận, hẹn dịp khác', ai: { w: 0.5 }, run: function (l, r, log, d) { var f = find(l, d.n); if (f) f.close = Math.max(0, (f.close || 50) - 5); log('Bạn từ chối vì bận. ' + d.n + ' nhắn "ok", nghe hơi buồn.', 'neutral'); } }
    ]
  });
  function find(l, n) { return E.friendsOf(l).filter(function (f) { return f.name === n; })[0]; }
  T('ban_than_hen', function (l, a) { return a >= 10 && E.friendsOf(l).length > 0; }, 0.12, 3);
  SC('ban_than_kho', {
    title: function (l, d) { return d.n + ' gặp chuyện'; },
    prep: function (l, r) { var f = pickFriend(l, r, function (f) { return fAge(l, f) >= 18; }); return { n: f ? f.name : '', why: U.pick(r, ['vừa mất việc', 'vừa chia tay người yêu', 'có người nhà nằm viện', 'làm ăn thua lỗ']) }; },
    valid: function (l, d) { return !!(d && d.n && find(l, d.n)) || E.friendsOf(l).some(function (f) { return fAge(l, f) >= 18; }); },
    text: function (l, d) { return d.n + ' ' + d.why + ', gọi cho bạn lúc nửa đêm.'; },
    opts: [
      { k: 'o_ben', l: 'Đến ngay, ở bên an ủi', ai: { w: 1.3, karma: 1 }, run: function (l, r, log, d) { var f = find(l, d.n); if (f) f.close = Math.min(100, (f.close || 50) + 12); fx(l, { karma: 3, soc: 2 }); log('Bạn chạy đến ngay trong đêm, ngồi cạnh ' + d.n + ' đến sáng. Có những lúc chỉ cần có người ở bên.', 'good'); } },
      { k: 'cho_vay', l: 'Cho vay tiền giúp bạn qua khó khăn', req: function (l) { return l.indep && l.money >= V(l, 20); }, h: function (l) { return 'Khoảng ' + mo(l, V(l, 20)); }, ai: { w: 0.8 }, run: function (l, r, log, d) { var f = find(l, d.n); pay(l, 20, 'Cho bạn thân vay'); if (ch(r, 0.7)) { H.cash(l, V(l, 20), 'Bạn thân trả nợ'); if (f) f.close = Math.min(100, (f.close || 50) + 10); log(d.n + ' vượt qua khó khăn, vài tháng sau trả đủ tiền kèm một bữa cơm cảm ơn.', 'good'); } else { if (f) f.close = Math.max(0, (f.close || 50) - 25); log(d.n + ' hẹn mãi không trả, tình bạn bắt đầu có vết rạn.', 'bad'); } } },
      { k: 'ban', l: 'Nhắn tin hỏi han vì đang bận', ai: { w: 0.5 }, run: function (l, r, log, d) { var f = find(l, d.n); if (f) f.close = Math.max(0, (f.close || 50) - 6); log('Bạn chỉ kịp nhắn vài dòng hỏi han.', 'neutral'); } }
    ]
  });
  T('ban_than_kho', function (l, a) { return a >= 18 && E.friendsOf(l).some(function (f) { return fAge(l, f) >= 18; }); }, 0.06, 5);
  // xa cách theo năm tháng, tuổi già mất bạn
  E.HOOKS.year.unshift(function (l, r, log, a) {
    if (!l.alive || !l.friends || !l.friends.length) return;
    l.friends.forEach(function (f) {
      if (f.alive === false) return;
      if (fAge(l, f) >= 70 && r() < (fAge(l, f) - 60) / 400) { f.alive = false; f.died = a; var mate = l.partner && l.partner.name === f.name && l.partner.alive !== false; /* v7.2: bạn thân cũng là vợ / chồng */ if (mate) { log((l.partner.status === 'dating' ? 'Người yêu ' : l.partner.sex === l.sex ? 'Người bạn đời ' : l.partner.sex === 'M' ? 'Chồng ' : 'Vợ ') + f.name + ', người bạn thân từ thuở nào, qua đời ở tuổi ' + fAge(l, f) + '.', 'bad'); if (E.partnerGone) E.partnerGone(l, a); else l.partner = null; fx(l, { hap: -16 }); H.mem(l, 'Ngày mất ' + f.name + ' — vừa là bạn thân, vừa là người thương.', 7); return; } log('Người bạn thân ' + f.name + ' qua đời ở tuổi ' + fAge(l, f) + '. Bạn đứng lặng rất lâu trước di ảnh của bạn.', 'bad'); fx(l, { hap: -8 }); H.mem(l, 'Tiễn người bạn thân ' + f.name + '.', 4); return; }
      if (!f.lover) f.close = Math.max(0, (f.close || 50) - (l.movedTo || (l.abroad && l.abroad.perm) ? 3 : 1));
      if (f.close < 25 && !f.faded) { f.faded = true; log('Mỗi người một cuộc sống, bạn và ' + f.name + ' dần xa cách, chỉ còn chúc mừng sinh nhật trên mạng.', 'neutral'); }
      if (f.lover && !(l.partner && l.partner.name === f.name)) { f.lover = false; f.close = Math.min(f.close, 30); log('Chia tay rồi, bạn và ' + f.name + ' không còn thân như trước.', 'neutral'); }
    });
  });

  // ===================================================================
  // 3. HẸN HÒ VỚI BẠN THÂN
  // ===================================================================
  function okSex(l, s) { return l.orient === 'gay' ? s === l.sex : l.orient === 'bi' ? true : s !== l.sex; }
  function crushes(l) { if (l.partner || l.age < 16) return []; return E.friendsOf(l).filter(function (f) { var fa = l.age + (f.d || 0); return !f.lover && !f.taken && (f.close || 0) >= 55 && okSex(l, f.sex) && fa >= 16 && Math.abs(f.d || 0) <= 10; }); }
  SC('yeu_ban_than', {
    title: 'Tình bạn hay tình yêu?',
    prep: function (l, r) { var c = crushes(l), f = c.length ? U.pick(r, c) : null; return { n: f ? f.name : '' }; },
    valid: function (l, d) { return crushes(l).some(function (f) { return !d || !d.n || f.name === d.n; }); },
    text: function (l, d) { var f = find(l, d.n); return 'Bạn và ' + d.n + ' thân nhau đã ' + Math.max(1, l.age - (f && f.since != null ? f.since : l.age)) + ' năm. Dạo gần đây, mỗi lần ' + d.n + ' cười, tim bạn lại lỡ một nhịp. Nói ra thì sợ mất bạn, không nói thì sợ mất người.'; },
    opts: [
      { k: 'to_tinh', l: 'Tỏ tình', ai: { w: 0.9, risk: 1 }, run: function (l, r, log, d) { var f = find(l, d.n); if (!f) return; if (ch(r, U.clamp(0.3 + (f.close || 50) / 200, 0.3, 0.8))) becomeLovers(l, r, log, f, 'Bạn lấy hết can đảm tỏ tình. ' + f.name + ' im lặng một lúc rồi cười: "Mình cũng thích cậu từ lâu rồi."'); else { f.close = Math.max(0, (f.close || 50) - 20); fx(l, { hap: -5 }); log(f.name + ' từ chối nhẹ nhàng: "Mình chỉ coi cậu là bạn thân thôi." Hai người ngại ngùng mất một thời gian.', 'bad'); } } },
      { k: 'cho', l: 'Chờ xem người ấy có tình cảm không', ai: { w: 0.8 }, run: function (l, r, log, d) { var f = find(l, d.n); if (f && ch(r, 0.3)) becomeLovers(l, r, log, f, 'Một tối đi về, ' + f.name + ' bất ngờ nắm tay bạn: "Mình thích cậu." Hóa ra cả hai cùng chờ nhau.'); else log('Bạn giữ cảm xúc trong lòng, vẫn bên ' + d.n + ' như một người bạn.', 'neutral'); } },
      { k: 'giu', l: 'Giữ tình bạn, không nói ra', ai: { w: 0.7 }, run: function (l, r, log, d) { log('Bạn chọn giữ tình bạn với ' + d.n + '. Có những người, ở bên như bạn đã là đủ.', 'neutral'); } }
    ]
  });
  function becomeLovers(l, r, log, f, t) {
    if (l.partner) return;
    var p = { name: f.name, sex: f.sex, age: l.age + (f.d || 0), status: 'dating', since: l.age, alive: true, fromFriend: true };
    if (p.age >= 18 && H.partnerJob) H.partnerJob(l, p, r);
    l.partner = p; f.lover = true; f.close = Math.min(100, (f.close || 50) + 15);
    if (!l.flags.everDated) { l.flags.everDated = true; if (!l.flags.firstLove) l.flags.firstLove = f.name; }
    log(t + ' Bạn thân thành người yêu.', 'big'); fx(l, { hap: 10 }); H.mem(l, 'Ngày ' + f.name + ' từ bạn thân thành người yêu.', 5);
  }
  T('yeu_ban_than', function (l) { return crushes(l).length > 0; }, 0.07, 4, 3);
  A('to_tinh_ban_than', 'Tình cảm', 'Tỏ tình với bạn thân', { min: 16, sc: 'yeu_ban_than', avail: function (l) { return l.partner ? 'Đang có người yêu / bạn đời' : crushes(l).length ? true : 'Chưa có bạn thân phù hợp'; }, ai: { w: 0.05 } });
  A('hen_ban_than', 'Gia đình & bạn bè', 'Hẹn gặp bạn thân', { min: 8, sc: 'ban_than_hen', avail: function (l) { return E.friendsOf(l).length ? true : 'Chưa có bạn thân'; }, ai: { w: 0.15 } });

  // ===================================================================
  // 4. ĐỊNH CƯ NƯỚC NGOÀI
  // ===================================================================
  var LANG = { US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en', SG: 'en', JP: 'ja', KR: 'ko', CN: 'zh', TW: 'zh', DE: 'de', AT: 'de', CH: 'de' };
  var LNAME = { FR: 'tiếng Pháp', BE: 'tiếng Pháp', ES: 'tiếng Tây Ban Nha', MX: 'tiếng Tây Ban Nha', IT: 'tiếng Ý', PT: 'tiếng Bồ Đào Nha', BR: 'tiếng Bồ Đào Nha', NL: 'tiếng Hà Lan', SE: 'tiếng Thụy Điển', NO: 'tiếng Na Uy', DK: 'tiếng Đan Mạch', FI: 'tiếng Phần Lan', PL: 'tiếng Ba Lan', CZ: 'tiếng Séc', RU: 'tiếng Nga', TH: 'tiếng Thái', MY: 'tiếng Mã Lai', AE: 'tiếng Ả Rập', SA: 'tiếng Ả Rập', IL: 'tiếng Do Thái', TR: 'tiếng Thổ Nhĩ Kỳ' };
  E.langOf = function (code) { return LANG[code] || null; };
  var PR = { US: 'thẻ xanh', CA: 'thường trú nhân (PR)', AU: 'thường trú (PR)', NZ: 'thường trú (resident visa)', GB: 'quyền định cư vĩnh viễn (ILR)', DE: 'giấy phép định cư (Niederlassungserlaubnis)', FR: 'thẻ cư trú dài hạn', JP: 'tư cách vĩnh trú (eijū)', KR: 'thẻ thường trú F-5', TW: 'thẻ cư trú vĩnh viễn (APRC)', SG: 'thường trú nhân (PR)' };
  function settled(l) { return !!(l.alive && l.abroad && l.abroad.perm && !l.abroad.trapped && l.age >= 16 && free(l)); }
  function host(l) { var c = l.abroad.code, B = W.BY[c]; return B ? B.name : (l.abroad.name || c); }
  function homeName(l) { return l.countryName || (W.BY[l.country] && W.BY[l.country].name) || 'quê nhà'; }
  function yrsHere(l) { return Math.max(0, l.age - (l.abroad.since != null ? l.abroad.since : l.age)); }
  function langName(l) { var c = l.abroad.code; return LANG[c] ? { en: 'tiếng Anh', ja: 'tiếng Nhật', ko: 'tiếng Hàn', zh: 'tiếng Trung', de: 'tiếng Đức' }[LANG[c]] : LNAME[c] || 'tiếng bản xứ'; }
  function countryOf(l) { return l.abroad.code; }
  function compat(l) { return isVN(l) || l.country === 'VN' ? 'người Việt' : 'người đồng hương'; }
  E.HOOKS.year.unshift(function (l, r, log, a) { if (l.abroad && l.abroad.perm && l.abroad.since == null) l.abroad.since = a; });
  SC('dc_van_hoa', {
    title: function (l) { return 'Những ngày đầu ở ' + host(l); }, valid: settled,
    text: function (l) { return 'Mọi thứ ở ' + host(l) + ' đều lạ: cách chào hỏi, giờ giấc, đồ ăn, cả cách đổ rác. Nhiều đêm bạn nhớ ' + homeName(l) + ' đến không ngủ được.'; },
    opts: [
      { k: 'hoa_nhap', l: 'Chủ động làm quen người bản xứ, học cách sống ở đây', ai: { w: 1.1, soc: 1 }, run: function (l, r, log) { fx(l, { soc: 4, kno: 2, hap: 2 }); log('Bạn nhận lời mời của hàng xóm, tập nói chuyện bằng ' + langName(l) + ' dù còn vấp váp. Dần dần thấy nơi đây bớt xa lạ.', 'good'); } },
      { k: 'cong_dong', l: 'Tìm đến cộng đồng ' + 'đồng hương', ai: { w: 1 }, run: function (l, r, log) { fx(l, { soc: 3, hap: 3 }); log('Bạn tìm được hội ' + compat(l) + ' ở thành phố, cuối tuần cùng nhau nấu món quê nhà.', 'good'); } },
      { k: 'thu_minh', l: 'Thu mình, chỉ đi làm rồi về nhà', ai: { w: 0.5 }, run: function (l, r, log) { fx(l, { hap: -4 }); stress(l, 5); log('Bạn thu mình trong căn phòng nhỏ, chỉ nói chuyện với người nhà qua điện thoại.', 'bad'); } }
    ]
  });
  T('dc_van_hoa', function (l) { return settled(l) && yrsHere(l) <= 1; }, 0.7, 5, 1);
  SC('dc_hoc_tieng', {
    title: function (l) { return 'Học ' + langName(l); }, valid: settled,
    text: function (l) { return 'Thành phố có lớp ' + langName(l) + ' cho người nhập cư, học buổi tối. Biết tiếng thì dễ tìm việc, dễ thi quốc tịch hơn.'; },
    opts: [
      { k: 'hoc', l: function (l) { return 'Đăng ký lớp ' + langName(l) + ' buổi tối'; }, ai: { w: 1.2, smart: 1 }, run: function (l, r, log) { var k = LANG[countryOf(l)], F = l.flags.localLang || (l.flags.localLang = {}); F[countryOf(l)] = (F[countryOf(l)] || 0) + 1; if (k && H.langNext && H.langNext(l, k) != null) H.studyLang(l, k, r, log); else { pay(l, 3, 'Học ' + langName(l)); fx(l, { kno: 2 }); log('Sau mấy tháng học tối, bạn đã tự đi khám bệnh, làm giấy tờ bằng ' + langName(l) + ' được.', 'good'); } } },
      { k: 'app', l: 'Tự học qua ứng dụng, xem phim bản xứ', ai: { w: 0.8 }, run: function (l, r, log) { var F = l.flags.localLang || (l.flags.localLang = {}); F[countryOf(l)] = (F[countryOf(l)] || 0) + 0.5; fx(l, { kno: 1 }); log('Tối nào cũng học vài từ mới trên ứng dụng, xem phim có phụ đề ' + langName(l) + '.', 'neutral'); } },
      { k: 'khong', l: 'Bận quá, chưa học được', ai: { w: 0.4 }, run: function (l, r, log) { log('Công việc kín lịch, việc học tiếng lại để sau.', 'neutral'); } }
    ]
  });
  T('dc_hoc_tieng', function (l) { return settled(l) && ((l.flags.localLang || {})[countryOf(l)] || 0) < 3; }, 0.18, 3, 3);
  SC('dc_thuong_tru', {
    title: function (l) { return 'Xin ' + (PR[countryOf(l)] || 'thẻ thường trú'); }, valid: function (l) { return settled(l) && !(l.flags.prDone || {})[countryOf(l)]; },
    text: function (l) { return 'Bạn đã sống ở ' + host(l) + ' ' + yrsHere(l) + ' năm. Hồ sơ xin ' + (PR[countryOf(l)] || 'thẻ thường trú') + ' cần chứng minh thu nhập, lý lịch, bảo hiểm và thời gian cư trú.'; },
    opts: [
      { k: 'nop', l: 'Nộp hồ sơ', h: function (l) { return 'Lệ phí, giấy tờ khoảng ' + mo(l, l.base * 0.02); }, ai: { w: 1.2 }, run: function (l, r, log) { H.cash(l, -l.base * 0.02, 'Hồ sơ thường trú'); var P = l.flags.prDone || (l.flags.prDone = {}); if (ch(r, l.job ? 0.75 : 0.45)) { P[countryOf(l)] = l.age; fx(l, { hap: 6 }); log('Nhận thư báo được cấp ' + (PR[countryOf(l)] || 'thẻ thường trú') + '. Từ nay bạn không còn phải gia hạn visa từng năm.', 'big'); H.mem(l, 'Ngày cầm tấm ' + (PR[countryOf(l)] || 'thẻ thường trú') + ' ở ' + host(l) + '.', 4); } else { fx(l, { hap: -3 }); log('Hồ sơ bị yêu cầu bổ sung giấy tờ thu nhập, phải chờ thêm.', 'neutral'); } } },
      { k: 'chua', l: 'Chưa đủ giấy tờ, để sau', ai: { w: 0.4 }, run: function (l, r, log) { log('Bạn gom thêm giấy tờ, hẹn năm sau nộp.', 'neutral'); } }
    ]
  });
  T('dc_thuong_tru', function (l) { return settled(l) && yrsHere(l) >= 3 && !(l.flags.prDone || {})[countryOf(l)]; }, 0.35, 2, 4);
  SC('dc_bang_cap', {
    title: 'Bằng cấp ở xứ người', valid: function (l) { return settled(l) && l.edu >= 4; },
    text: function (l) { return 'Bằng cấp ở ' + homeName(l) + ' chưa được công nhận tương đương ở ' + host(l) + '. Muốn làm đúng ngành phải học chuyển đổi, thi chứng chỉ.'; },
    opts: [
      { k: 'hoc', l: 'Học chuyển đổi, thi chứng chỉ hành nghề', h: function (l) { return 'Khoảng ' + mo(l, l.base * 0.05) + ', mất một hai năm'; }, req: function (l) { return l.money >= l.base * 0.05; }, ai: { w: 1, amb: 1.2 }, run: function (l, r, log) { H.cash(l, -l.base * 0.05, 'Học chuyển đổi bằng cấp'); fx(l, { kno: 3 }); stress(l, 6); l.flags.degreeOK = true; if (l.job) l.job.rep = U.clamp((l.job.rep || 50) + 5, 0, 100); log('Vừa làm vừa học, sau hai năm bạn được công nhận bằng cấp, có thể làm đúng chuyên môn.', 'good'); } },
      { k: 'trai', l: 'Tạm làm việc trái ngành để có thu nhập', ai: { w: 0.8 }, run: function (l, r, log) { fx(l, { hap: -3 }); log('Bạn tạm gác tấm bằng, làm việc chân tay để có thu nhập trước.', 'neutral'); } }
    ]
  });
  T('dc_bang_cap', function (l) { return settled(l) && l.edu >= 4 && yrsHere(l) <= 3 && !l.flags.degreeOK; }, 0.3, 4, 1);
  SC('dc_ky_thi', {
    title: 'Một câu nói khó nghe', valid: settled,
    text: function (l) { return 'Ở ' + U.pick(H.rf(l), ['siêu thị', 'chỗ làm', 'trên xe buýt']) + ', một người buông câu "về nước mày đi" chỉ vì bạn nói giọng nước ngoài.'; },
    opts: [
      { k: 'len_tieng', l: 'Bình tĩnh lên tiếng', ai: { w: 1, karma: 1 }, run: function (l, r, log) { fx(l, { soc: 2, hap: -1 }); log('Bạn bình tĩnh đáp lại. Mấy người xung quanh lên tiếng bênh bạn, người kia lặng lẽ bỏ đi.', 'neutral'); } },
      { k: 'bao_cao', l: 'Báo với quản lý / cơ quan chức năng', ai: { w: 0.8, smart: 1 }, run: function (l, r, log) { fx(l, { hap: -1 }); log('Bạn báo sự việc. Người kia bị nhắc nhở, nơi đó dán thêm biển cấm phân biệt đối xử.', 'neutral'); } },
      { k: 'lo', l: 'Lờ đi, về nhà buồn cả tối', ai: { w: 0.6 }, run: function (l, r, log) { fx(l, { hap: -4 }); stress(l, 4); log('Bạn lờ đi, nhưng câu nói ấy cứ lởn vởn trong đầu cả tối.', 'bad'); } }
    ]
  });
  T('dc_ky_thi', function (l) { return settled(l); }, 0.05, 6, 3);
  SC('dc_tet', {
    title: function (l) { return isVN(l) || l.country === 'VN' ? 'Tết xa nhà' : 'Mùa lễ xa nhà'; }, valid: settled,
    text: function (l) { return (isVN(l) || l.country === 'VN' ? 'Ở ' + host(l) + ' không ai nghỉ Tết. Đêm giao thừa rơi vào ngày đi làm bình thường.' : 'Mùa lễ lớn ở quê nhà, còn ở ' + host(l) + ' vẫn là một ngày đi làm bình thường.') + (parentWord(l) ? ' ' + U.cap(parentWord(l)) + ' gọi điện hỏi năm nay có về không.' : ''); },
    opts: [
      { k: 'cong_dong', l: 'Đón Tết cùng cộng đồng đồng hương', ai: { w: 1.1, soc: 1 }, run: function (l, r, log) { fx(l, { hap: 4, soc: 3 }); log('Hội ' + compat(l) + ' thuê hội trường đón năm mới: gói bánh, múa lân, ai cũng mặc áo truyền thống.', 'good'); } },
      { k: 've', l: 'Mua vé về quê đón Tết', h: function (l) { return 'Vé máy bay khoảng ' + mo(l, l.base * 0.04); }, req: function (l) { return l.money >= l.base * 0.04; }, ai: { w: 0.8 }, run: function (l, r, log) { H.cash(l, -l.base * 0.04, 'Vé máy bay về quê'); fx(l, { hap: 7 }); stress(l, -5); log('Bạn bay về ' + homeName(l) + ' đúng đêm giao thừa. Bước vào nhà nghe mùi bếp quen, mắt cay xè.', 'good'); H.mem(l, 'Cái Tết về nhà sau những năm xa xứ.', 3); } },
      { k: 'video', l: 'Gọi video về nhà', ai: { w: 0.8 }, run: function (l, r, log) { fx(l, { hap: -1 }); log('Gọi video về nhà, màn hình bên kia sum vầy, bên này một mình với bát mì.', 'neutral'); } }
    ]
  });
  T('dc_tet', function (l) { return settled(l); }, 0.2, 2);
  SC('dc_gui_tien', {
    title: 'Gửi tiền về nhà', valid: function (l) { return settled(l) && !!parentWord(l) && l.indep; },
    text: function (l) { return U.cap(parentWord(l)) + ' ở ' + homeName(l) + ' đã có tuổi. Nhiều người đi xa vẫn gửi tiền về hằng tháng.'; },
    opts: [
      { k: 'deu', l: 'Gửi đều đặn mỗi tháng', h: function (l) { return 'Khoảng ' + mo(l, l.base * 0.06) + '/năm'; }, req: function (l) { return l.money >= l.base * 0.06; }, ai: { w: 1, karma: 1 }, run: function (l, r, log) { H.cash(l, -l.base * 0.06, 'Gửi tiền về cho ' + parentWord(l)); fx(l, { hap: 2, karma: 3 }); l.flags.remit = l.age; log('Tháng nào cũng gửi tiền về. ' + U.cap(parentWord(l)) + ' sửa lại mái nhà, khoe với cả xóm.', 'good'); } },
      { k: 'it', l: 'Thỉnh thoảng gửi, dịp lễ Tết', ai: { w: 0.8 }, run: function (l, r, log) { H.cash(l, -l.base * 0.015, 'Gửi tiền về nhà dịp lễ'); log('Dịp lễ Tết bạn gửi về một khoản nhỏ.', 'neutral'); } },
      { k: 'khong', l: 'Chưa đủ dư để gửi', ai: { w: 0.4 }, run: function (l, r, log) { log('Năm nay chi tiêu ở xứ người còn chật vật, chưa gửi được gì về nhà.', 'neutral'); fx(l, { hap: -1 }); } }
    ]
  });
  T('dc_gui_tien', function (l) { return settled(l) && !!parentWord(l) && l.indep; }, 0.15, 4);
  SC('dc_bao_lanh', {
    title: function (l) { return 'Bảo lãnh ' + parentWord(l) + ' sang'; }, valid: function (l) { return settled(l) && !!parentWord(l) && !l.flags.parentsAbroad && l.indep; },
    text: function (l) { return 'Bạn đã ổn định ở ' + host(l) + '. Có thể làm hồ sơ bảo lãnh ' + parentWord(l) + ' sang sống cùng, nhưng phải chứng minh thu nhập và chờ khá lâu. ' + U.cap(parentWord(l)) + ' thì sợ già rồi sang xứ lạ không quen.'; },
    opts: [
      { k: 'bao_lanh', l: 'Làm hồ sơ bảo lãnh', h: function (l) { return 'Phí hồ sơ, vé máy bay khoảng ' + mo(l, l.base * 0.08); }, req: function (l) { return l.money >= l.base * 0.08 && !!l.job; }, ai: { w: 0.8 }, run: function (l, r, log) { H.cash(l, -l.base * 0.08, 'Hồ sơ bảo lãnh ' + parentWord(l)); if (ch(r, 0.6)) { l.flags.parentsAbroad = true; l.flags.caring = true; fx(l, { hap: 8 }); log('Hồ sơ được duyệt. Ngày đón ' + parentWord(l) + ' ở sân bay, bạn ôm thật lâu. Từ nay bữa cơm ở xứ người đã có tiếng nói cười.', 'big'); H.mem(l, 'Ngày đón ' + parentWord(l) + ' sang ' + host(l) + '.', 5); } else { fx(l, { hap: -3 }); log('Hồ sơ bảo lãnh bị từ chối vì chưa đủ điều kiện thu nhập. Bạn hẹn sẽ nộp lại.', 'bad'); } } },
      { k: 've_tham', l: function (l) { return 'Để ' + parentWord(l) + ' ở quê, mỗi năm về thăm'; }, ai: { w: 1 }, run: function (l, r, log) { log('Bạn tôn trọng mong muốn ở lại quê của ' + parentWord(l) + ', hứa năm nào cũng về thăm.', 'neutral'); } }
    ]
  });
  T('dc_bao_lanh', function (l) { return settled(l) && !!parentWord(l) && !l.flags.parentsAbroad && l.indep && yrsHere(l) >= 4 && !!l.job; }, 0.15, 5, 2);
  function kidsHere(l) { return (l.kids || []).filter(function (k) { var x = l.age - k.born; return k.alive !== false && x >= 5 && x <= 15 && k.custody !== 'other'; }); }
  SC('dc_con_tieng_me_de', {
    title: 'Con quên tiếng mẹ đẻ', valid: function (l) { return settled(l) && kidsHere(l).length > 0; },
    text: function (l) { var k = kidsHere(l)[0]; return k.name + ' lớn lên ở ' + host(l) + ', nói ' + langName(l) + ' giỏi hơn tiếng ' + (isVN(l) || l.country === 'VN' ? 'Việt' : 'mẹ đẻ') + ', gọi điện cho ông bà mà nói không trôi.'; },
    opts: [
      { k: 'lop', l: 'Cho con học lớp tiếng mẹ đẻ cuối tuần', h: function (l) { return 'Khoảng ' + mo(l, l.base * 0.01) + '/năm'; }, ai: { w: 1.1 }, run: function (l, r, log) { H.cash(l, -l.base * 0.01, 'Lớp tiếng mẹ đẻ cho con'); kidsHere(l).forEach(function (k) { k.close = U.clamp((k.close || 50) + 3, 0, 100); }); log('Cuối tuần đưa con đến lớp học tiếng ' + (isVN(l) || l.country === 'VN' ? 'Việt' : 'mẹ đẻ') + ' ở chùa / hội đồng hương. Lần sau gọi điện, con chúc ông bà tròn vành rõ chữ.', 'good'); } },
      { k: 'o_nha', l: 'Quy định ở nhà chỉ nói tiếng mẹ đẻ', ai: { w: 0.9 }, run: function (l, r, log) { kidsHere(l).forEach(function (k) { k.close = U.clamp((k.close || 50) + 1, 0, 100); }); log('Cả nhà quy định: bước vào cửa là nói tiếng mẹ đẻ. Con phụng phịu nhưng dần quen.', 'neutral'); } },
      { k: 'tu_nhien', l: 'Để tự nhiên, con sống ở đây thì nói tiếng ở đây', ai: { w: 0.5 }, run: function (l, r, log) { log('Bạn để con tự nhiên. Về sau con hiểu tiếng mẹ đẻ nhưng ngại nói.', 'neutral'); } }
    ]
  });
  T('dc_con_tieng_me_de', function (l) { return settled(l) && kidsHere(l).length > 0; }, 0.15, 6, 1);
  SC('dc_hoi', {
    title: 'Cộng đồng đồng hương', valid: settled,
    text: function (l) { return 'Ở ' + host(l) + ' có hội ' + compat(l) + ': ngày lễ tụ họp, có lớp tiếng mẹ đẻ cho trẻ con, có người giúp người mới sang tìm việc, tìm nhà.'; },
    opts: [
      { k: 'tham_gia', l: 'Tham gia sinh hoạt cuối tuần', ai: { w: 1.1 }, run: function (l, r, log) { fx(l, { soc: 4, hap: 3 }); stress(l, -3); log(U.pick(r, ['Cuối tuần sinh hoạt cùng hội ' + compat(l) + ', nấu nồi phở to cho cả hội.', 'Đi chợ châu Á cùng mấy người đồng hương, mua được cả rau thơm quê nhà.', 'Hội tổ chức đêm văn nghệ, bạn lên hát một bài quê hương mà cả hội rưng rưng.']), 'good'); } },
      { k: 'giup', l: 'Giúp người mới sang tìm việc, tìm nhà', ai: { w: 0.8, karma: 1 }, run: function (l, r, log) { fx(l, { karma: 4, soc: 3 }); log('Bạn chỉ đường cho một gia đình mới sang: thuê nhà, làm giấy tờ, xin việc. Như ngày xưa có người đã giúp bạn.', 'good'); } },
      { k: 'thoi', l: 'Để dịp khác', ai: { w: 0.3 }, run: function () { } }
    ]
  });
  A('dc_cong_dong', 'Gia đình & bạn bè', 'Sinh hoạt cùng cộng đồng đồng hương', { min: 16, sc: 'dc_hoi', avail: function (l) { return settled(l) ? true : 'Không áp dụng'; }, ai: { w: 0.05 } });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
