/* Góp ý người chơi — Mốc A: nơi ở của từng người con, về nước / chuyển quốc gia khi đang ở nước ngoài,
   chủ động mời bố mẹ về sống chung. Dùng menu, danh tính và quy đổi tiền sẵn có (X.menu, E.NPC, H.emigrate, E.abroadConvert). */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, W = G.W, CUR = G.CUR;
  function state(l) { return l.flags.feedback146 || (l.flags.feedback146 = {}); }
  function age(l, k) { return l.age - k.born; }
  function kids(l) { return (l.kids || []).filter(function (k) { return k && k.alive !== false && Number.isFinite(k.born) && l.age >= k.born; }); }
  function otherName(k) { return k.coParent108 ? k.coParent108.name : k.otherParent || 'cha/mẹ còn lại'; }
  function withCurrentPartner(l, k) { var p = l.partner, c = k.coParent108; return !!(p && p.alive !== false && c && p.relation108 && c.id === p.relation108); }
  function freeAdult(l) { return X.reason(l, 18); }
  function blocked(l) { return l.jailUntil != null && l.age < l.jailUntil ? 'Đang trong trại giam' : l.abroad && l.abroad.trapped ? 'Đang bị giữ trong trại lừa đảo' : l.flags.military && l.age < l.flags.military ? 'Đang đi nghĩa vụ quân sự' : null; }

  // ===================================================================
  // A1. Nơi ở, quyền chăm sóc và giám hộ của từng người con
  // ===================================================================
  function where(l, k) { return E.kidWhere ? E.kidWhere(l, k) : k.custody === 'ex' || k.custody === 'other' ? 'ở với ' + otherName(k) : k.custody === 'both' ? 'luân phiên hai nhà' : 'sống cùng bạn'; }
  function care(l, k) {
    if (age(l, k) >= 18) return 'đã trưởng thành, tự quyết nơi ở';
    if (k.custody === 'ex' || k.custody === 'other') return otherName(k) + ' trực tiếp chăm sóc; bạn cấp dưỡng và vẫn là cha/mẹ';
    if (k.custody === 'both') return 'hai cha mẹ cùng chăm sóc, luân phiên';
    return 'bạn trực tiếp chăm sóc' + (withCurrentPartner(l, k) ? ' cùng ' + l.partner.name : '');
  }
  function guardian(l, k) {
    if (age(l, k) >= 18) return 'không cần giám hộ';
    if (k.guardian146) return k.guardian146;
    if (k.adopted) return 'bạn là cha/mẹ nuôi hợp pháp';
    return k.coParent108 && !withCurrentPartner(l, k) && !(k.custody === 'me') ? 'hai cha mẹ ruột cùng giám hộ' : 'cha mẹ giám hộ';
  }
  function relation(l, k) { return E.childRelation108 ? E.childRelation108(l, k) : k.adopted ? 'Con nuôi' : 'Con'; }
  // Chỉ con của hai người đã chia tay mới có chuyện "ở với ai": con chung với bạn đời hiện tại thì ở cùng cả hai.
  function separated(l, k) { return age(l, k) < 18 && !withCurrentPartner(l, k) && (k.custody === 'ex' || k.custody === 'other' || k.custody === 'both' || k.custody === 'me' || !!k.coParent108); }
  X.menu('residence146', 'Nơi ở và quyền chăm sóc của các con', function (l) { return freeAdult(l) !== true ? freeAdult(l) : kids(l).length ? true : 'Chưa có con'; },
    function (l) {
      return kids(l).map(function (k) { return k.name + ' (' + age(l, k) + ' tuổi, ' + relation(l, k).toLowerCase() + '): ' + where(l, k) + ' · chăm sóc: ' + care(l, k) + ' · giám hộ: ' + guardian(l, k) + '.'; }).join('\n') +
        '\nĐề nghị đổi nơi ở chỉ áp dụng cho con chưa thành niên của hai người đã chia tay; người cha/mẹ còn lại và con (từ 12 tuổi) có quyền đồng ý hay không. Mỗi con một lần mỗi năm.';
    },
    function (l) {
      var rows = [];
      kids(l).filter(function (k) { return separated(l, k); }).forEach(function (k) {
        [['me', 'Đề nghị ' + k.name + ' về sống cùng bạn'], ['other', 'Để ' + k.name + ' sống cùng ' + otherName(k)], ['both', 'Đề nghị ' + k.name + ' luân phiên hai nhà']].forEach(function (x) {
          if ((k.custody || 'me') === x[0]) return;
          rows.push({ k: (k.parentId || k.name) + ':' + x[0], l: x[1], why: k.residenceAt146 === l.age ? 'Đã bàn nơi ở của con năm nay' : true,
            run: function (l, r, log) {
              if (k.residenceAt146 === l.age) return;
              k.residenceAt146 = l.age;
              var a = age(l, k), close = k.close == null ? 60 : k.close;
              // Người cha/mẹ còn lại đồng ý dễ hơn khi con được ở gần cả hai hoặc khi chính họ đề nghị; con lớn có tiếng nói riêng.
              var p = x[0] === 'other' ? 0.85 : x[0] === 'both' ? 0.55 : 0.4;
              if (a >= 12) p += (close - 55) / 150;
              if (l.abroad && x[0] !== 'other') p -= 0.25;
              if (!l.indep && x[0] === 'me') p -= 0.2;
              if (r() < U.clamp(p, 0.05, 0.95)) {
                k.custody = x[0]; k.custodyAt146 = l.age; delete k.residence112; delete k.homeGift112;
                if (x[0] === 'other') k.close = U.clamp(close - 3, 0, 100); else k.close = U.clamp(close + 4, 0, 100);
                log('Thống nhất nơi ở mới của ' + k.name + ': ' + where(l, k) + '. Hai bên vẫn cùng trách nhiệm với con.', 'good');
              } else log(otherName(k) + (a >= 12 ? ' và ' + k.name : '') + ' chưa đồng ý thay đổi. Nơi ở của ' + k.name + ' giữ như cũ; năm sau có thể bàn lại.', 'neutral');
            } });
        });
      });
      return rows;
    }, 18, 'Tình cảm & gia đình');

  // ===================================================================
  // A2. Đang ở nước ngoài: về quê hương hoặc chuyển sang nước khác
  // ===================================================================
  var DESTS = ['US', 'CA', 'AU', 'DE', 'JP', 'KR', 'FR', 'SG', 'GB'];
  function homeSnap(l) {
    var f = l.flags, rs = f.researchStudy, st = f.study107, en = f.life138 && f.life138.entertainmentHome;
    return rs && !rs.finished && rs.home || st && !st.finished && st.home || en || null;
  }
  function moveCost(l, abroad) { return l.base * (abroad ? 0.5 : 0.25); }
  function situation(l) { var a = l.abroad; return a.research || a.study ? 'study' : a.entertainment139 ? 'trainee' : a.perm ? 'settled' : 'contract'; }
  function why(l, cost) { var b = blocked(l); if (b) return b; if (l.money < cost) return 'Chưa đủ tiền vé và chi phí chuyển đi (' + H.money(l, cost) + ')'; return true; }
  function leaveCommitments(l, log) {
    var a = l.abroad, kind = situation(l), f = l.flags;
    if (kind === 'study') {
      [f.researchStudy, f.study107].forEach(function (s) { if (s && !s.finished) { s.finished = true; s.abandoned146 = l.age; } });
      l.sched = (l.sched || []).filter(function (x) { return !(x.id === 'nc_bao_ve' && x.arg && x.arg.abroad) && x.id !== 'du_hoc_ve'; });
      l.pending = (l.pending || []).filter(function (d) { return !/^(nc_bao_ve|du_hoc_ve|abroad107_finish)$/.test(d.id); });
      if (l.school) { l.school = null; l.schoolEnd = null; }
      l.cityStudent = null;
      if (l.job && E.resolveJob(l.job.id) === 'nghien_cuu') l.job = null;
      log('Bạn dừng chương trình học tại ' + a.name + ' trước khi hoàn thành. Kết quả học tập đã đạt vẫn được giữ.', 'neutral');
    } else if (kind === 'contract') {
      var fine = l.base * 0.2; H.cash(l, -Math.min(fine, Math.max(0, l.money)), 'Chấm dứt hợp đồng lao động ở nước ngoài trước hạn');
      log('Bạn chấm dứt hợp đồng ở ' + a.name + ' trước hạn và chịu phí theo thỏa thuận.', 'neutral');
    } else if (kind === 'trainee') {
      var ag = f.life138 && f.life138.agency; if (ag) ag.status = 'left';
      log('Bạn dừng chương trình thực tập sinh.', 'neutral');
    }
    return kind;
  }
  function sellAbroadHome(l) {
    if (!l.ownHouse) return;
    var debt = (l.loans || []).filter(function (x) { return x.type === 'home'; }).reduce(function (s, x) { return s + x.bal; }, 0) + (l.mortgage || 0);
    H.cash(l, l.houseVal - debt, 'Bán nhà ở nước ngoài, tất toán vay mua nhà');
    l.houseVal = 0; l.ownHouse = false; l.mortgage = 0; l.loans = (l.loans || []).filter(function (x) { return x.type !== 'home'; });
  }
  function returnHome(l, r, log) {
    var a = l.abroad, host = W.BY[a.code], home = W.BY[l.country], h = homeSnap(l) || {}, wasPerm = !!a.perm, kind;
    H.cash(l, -moveCost(l, true), 'Vé máy bay và chuyển đồ về ' + (home ? home.name : 'quê nhà'));
    kind = leaveCommitments(l, log);
    sellAbroadHome(l);
    var homeCur = h.cur || (l.country === 'VN' ? 'vnd' : 'usd');
    var ratio = homeCur === 'vnd' ? CUR.priceLevel(host.gdp) * CUR.VND / 1e6 : CUR.priceLevel(host.gdp) / CUR.priceLevel(home.gdp);
    E.abroadConvert(l, ratio); l.cur = homeCur;
    var vh = l.flags.vnHome || {};
    l.flags.abroadSaved = wasPerm ? { code: a.code, name: a.name, perm: true, pool: a.pool, base: a.base, place: l.place } : null;
    l.abroad = null;
    l.place = h.place || vh.place || (l.prov && l.prov.old) || (home && home.cities[0]) || l.place; l.city = h.city || vh.city || l.place; l.urban = h.urban != null ? h.urban : vh.urban != null ? vh.urban : l.urban;
    H.setBase(l);
    var remote = l.job && /^fl_/.test(E.resolveJob(l.job.id));
    if (!remote) { l.job = null; l.income = 0; l.flags.needJob = true; }
    log('Trở về ' + (home ? home.name : 'quê nhà') + ' sau thời gian ở ' + a.name + '. Tiền và tài sản được quy đổi; quốc tịch gốc giữ nguyên.' + (remote ? ' Vẫn làm việc từ xa.' : ' Bắt đầu tìm việc mới.'), 'big');
    H.mem(l, 'Ngày trở về ' + (home ? home.name : 'quê nhà') + ' từ ' + a.name + '.', 4);
    return kind;
  }
  function moveTo(l, r, log, code) {
    var b = W.BY[code], pool = String(b.pool || 'en').split(',')[0].split(':')[0];
    H.cash(l, -moveCost(l, true), 'Vé máy bay, visa và chuyển đồ sang ' + b.name);
    leaveCommitments(l, log);
    l.flags.abroadSaved = null;
    H.emigrate(l, [code, b.name, pool], r, log);
  }
  X.menu('abroadMove146', 'Về nước / chuyển sang quốc gia khác', function (l) { return freeAdult(l) !== true ? freeAdult(l) : l.abroad ? true : 'Chỉ khi đang sống ở nước ngoài'; },
    function (l) {
      var a = l.abroad, k = situation(l), home = W.BY[l.country];
      return 'Bạn đang ở ' + (l.place || a.name) + ', ' + a.name + (k === 'study' ? ' theo chương trình học' : k === 'contract' ? ' theo hợp đồng lao động' : k === 'trainee' ? ' làm thực tập sinh' : ' (định cư)') + '. Quốc tịch gốc: ' + (home ? home.name : l.countryName) + '.' +
        (k === 'study' ? ' Rời đi bây giờ là dừng chương trình học trước khi hoàn thành.' : k === 'contract' ? ' Rời đi trước hạn phải chịu phí chấm dứt hợp đồng.' : '') + ' Nhà riêng ở nước ngoài (nếu có) sẽ được bán, tiền được quy đổi theo nơi đến.';
    },
    function (l) {
      var a = l.abroad, home = W.BY[l.country], out = [], cost = moveCost(l, true), w = why(l, cost);
      if (home && home.code !== a.code) out.push({ k: 'home', l: 'Về ' + home.name + (situation(l) === 'study' ? ' (dừng chương trình học)' : '') + (w === true ? '' : ' — chưa thể: ' + w), h: '~' + H.money(l, cost),
        run: function (l, r, log) { var w2 = why(l, moveCost(l, true)); if (w2 !== true) { log('Chưa thể về nước: ' + w2 + '.', 'neutral'); return; } returnHome(l, r, log); } });
      DESTS.filter(function (c) { return c !== a.code && c !== l.country && W.BY[c]; }).slice(0, 4).forEach(function (c) {
        var ok = w === true && l.money >= cost + l.base * 0.3 ? true : w !== true ? w : 'Cần thêm tiền dự phòng khi đến nơi mới';
        out.push({ k: c, l: 'Chuyển sang ' + W.BY[c].name + (ok === true ? '' : ' — chưa thể: ' + ok), h: '~' + H.money(l, cost),
          run: function (l, r, log) { var ok2 = why(l, moveCost(l, true)); if (ok2 === true && l.money < moveCost(l, true) + l.base * 0.3) ok2 = 'Cần thêm tiền dự phòng khi đến nơi mới'; if (ok2 !== true) { log('Chưa thể chuyển sang ' + W.BY[c].name + ': ' + ok2 + '.', 'neutral'); return; } moveTo(l, r, log, c); } });
      });
      return out;
    }, 18, 'Đời sống');
  // Hành trình định cư sẵn có (migrate114) chặn khi đang ở nước ngoài: chỉ dẫn sang mục mới thay vì im lặng.
  (E.ACT || []).forEach(function (x) {
    if (x.id !== 'migrate114' || typeof x.avail !== 'function') return;
    var av = x.avail; x.avail = function (l) { var v = av.apply(this, arguments); return v !== true && l.abroad ? 'Đang ở nước ngoài: dùng "Về nước / chuyển sang quốc gia khác"' : v; };
  });

  // ===================================================================
  // A5. Chủ động mời bố / mẹ về sống chung
  // ===================================================================
  function parentAlive(l, side) { var f = l.fam || {}; return side === 'm' ? !!f.mAlive && !f.noMom : !!f.fAlive && !f.noDad; }
  function parentAge(l, side) { var f = l.fam || {}; return (side === 'm' ? f.mAge : f.fAge) + l.age; }
  function trust(l, side) { var q = E.NPC ? E.NPC.relation(l, 'parent:' + side) : null; return q && Number.isFinite(q.trust) ? q.trust : 60; }
  function acceptChance(l, sides) {
    var p = 0.3;
    sides.forEach(function (s) { p += (trust(l, s) - 60) / 250 + (parentAge(l, s) >= 75 ? 0.25 : parentAge(l, s) >= 65 ? 0.12 : 0); });
    p /= sides.length; p += 0.2;
    if (l.ownHouse) p += 0.1; else if (l.money < l.base) p -= 0.1;
    if (l.partner && l.partner.status !== 'dating') p -= 0.05;
    if (l.abroad && l.abroad.perm) p -= 0.2;
    return U.clamp(p, 0.05, 0.9);
  }
  X.menu('parentsHome146', 'Mời bố mẹ về sống chung', function (l) { var w = freeAdult(l); if (w !== true) return w; if (!l.indep) return 'Cần tự lập và có chỗ ở riêng'; if (blocked(l)) return blocked(l); return parentAlive(l, 'm') || parentAlive(l, 'f') ? true : 'Bố mẹ không còn'; },
    function (l) {
      var s = state(l), live = l.flags.caring;
      return (live ? 'Bố mẹ đang sống cùng bạn. ' : 'Bố mẹ đang ở nhà riêng. ') + ['m', 'f'].filter(function (x) { return parentAlive(l, x); }).map(function (x) { return (x === 'm' ? 'Mẹ' : 'Bố') + ' ' + parentAge(l, x) + ' tuổi, tin cậy ' + Math.round(trust(l, x)) + '/100'; }).join(' · ') +
        '. Bố mẹ có quyền đồng ý hay từ chối; nhà và tài sản của ai vẫn thuộc về người đó.' + (s.inviteAt === l.age ? ' Năm nay đã ngỏ lời.' : '');
    },
    function (l) {
      var s = state(l), rows = [], done = s.inviteAt === l.age ? 'Đã ngỏ lời năm nay' : true;
      if (!l.flags.caring) {
        var sides = ['m', 'f'].filter(function (x) { return parentAlive(l, x); });
        sides.forEach(function (x) { rows.push({ k: x, l: 'Mời ' + (x === 'm' ? 'mẹ' : 'bố') + ' về sống cùng', why: done, run: function (l, r, log) { invite(l, r, log, [x]); } }); });
        if (sides.length === 2) rows.push({ k: 'both', l: 'Mời cả bố và mẹ về sống cùng', why: done, run: function (l, r, log) { invite(l, r, log, sides); } });
      } else rows.push({ k: 'home', l: 'Bố mẹ về lại nhà riêng', run: function (l, r, log) { l.flags.caring = false; delete state(l).parentsHome; log('Bố mẹ về lại nhà riêng, cuối tuần con cháu vẫn ghé thăm.', 'neutral'); } });
      return rows;
    }, 18, 'Tình cảm & gia đình');
  function invite(l, r, log, sides) {
    var s = state(l); if (s.inviteAt === l.age || l.flags.caring) return;
    s.inviteAt = l.age;
    var who = sides.length === 2 ? 'bố mẹ' : sides[0] === 'm' ? 'mẹ' : 'bố';
    if (r() < acceptChance(l, sides)) {
      l.flags.caring = true; s.parentsHome = { sides: sides, at: l.age };
      if (l.abroad && l.abroad.perm) l.flags.parentsAbroad = true;
      H.cash(l, -l.base * 0.03, 'Chuẩn bị phòng ở cho ' + who);
      sides.forEach(function (x) { if (E.NPC) E.NPC.adjustTrust(l, 'parent:' + x, 4); });
      H.fx(l, { hap: 3 }); log(U.cap(who) + ' đồng ý về sống cùng. Nhà có thêm người, bữa cơm đông vui hơn.', 'good');
      H.mem(l, 'Ngày đón ' + who + ' về sống chung.', 4);
    } else {
      var reason = l.abroad ? 'không muốn rời quê sang nơi xa' : parentAge(l, sides[0]) < 65 ? 'vẫn còn khỏe, muốn tự lo cuộc sống' : 'quen hàng xóm, họ hàng ở nhà cũ';
      log(U.cap(who) + ' cảm ơn nhưng chưa muốn chuyển: ' + reason + '. Bạn có thể ngỏ lời lại vào năm sau.', 'neutral');
    }
  }

  E.FEEDBACK146 = { residence: { where: where, care: care, guardian: guardian, separated: separated }, abroad: { situation: situation, returnHome: returnHome, moveTo: moveTo, why: why }, parents: { acceptChance: acceptChance, invite: invite } };
})(globalThis.G);
