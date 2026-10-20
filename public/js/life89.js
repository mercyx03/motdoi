/* Một Đời — v7.2.0 (góp ý của người chơi):
   · người yêu / bạn đời qua đời thì mọi nơi đều biết người đó đã mất: bạn thân (nếu người yêu vốn là bạn thân) không còn hẹn đi chơi,
     không hỏi vay tiền; không còn "liên lạc lại với người cũ" hay tái hôn với người đã mất. Ngược lại, người bạn thân đang là
     người yêu mà qua đời thì bạn cũng mất người yêu. Bản lưu cũ được dọn lại theo nhật ký.
   · nghề "nở sớm": cầu thủ, vận động viên các môn đỉnh cao sớm và tuyển thủ esports có năng khiếu được học viện / câu lạc bộ /
     đội trẻ mời ký hợp đồng từ 15–17 tuổi; học văn hóa hệ giáo dục thường xuyên ngay trong học viện. Có thể chọn học xong cấp ba
     rồi mới lên đội. */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function pick(r, a) { return U.pick(r, a); }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped); }
  function T(id, when, p, cd, max) { E.TRIG.push({ id: id, when: function (l, a) { return free(l) && when(l, a); }, p: p, cd: cd || 2, max: max || 1 }); }

  // ===================================================================
  // 1. NGƯỜI ĐÃ MẤT THÌ MẤT Ở MỌI NƠI
  // ===================================================================
  function dead(l) { return l.flags.deadPartners || (l.flags.deadPartners = []); }
  function people(l) { return [l.bff].concat(l.friends || []).filter(function (f) { return f && f.name; }); }
  function sameEx(x, d) { return x.name === d.n; } // so theo tên: ngày bắt đầu có thể đổi khi cưới
  E.isDeadPartner = function (l, p) { return !!p && dead(l).some(function (d) { return sameEx({ name: p.name, since: p.since }, d); }); };
  // gọi khi người yêu / bạn đời qua đời
  E.personDied = function (l, p, a) {
    if (!p || !p.name) return;
    p.alive = false; if (p.died == null) p.died = a;
    if (!E.isDeadPartner(l, p)) dead(l).push({ n: p.name, s: p.since, a: a });
    people(l).forEach(function (f) { if (f.name === p.name && (f.lover || p.fromFriend)) { f.alive = false; f.died = a; f.lover = false; } });
    var L = l.flags.exList; if (L) l.flags.exList = L.filter(function (x) { return !sameEx(x, { n: p.name, s: p.since }); });
  };
  E.partnerGone = function (l, a, log, why) { if (l.partner) partnerGone(l, l.partner, a, log, why); };
  function partnerGone(l, p, a, log, why) {
    l.partner = null; p.alive = false; p.died = a;
    if (p.status !== 'dating') l.widowed = (l.widowed || 0) + 1; else l.flags.lateDating = p.name;
    if (log && why) log(why, 'bad');
    E.personDied(l, p, a);
  }
  E.HOOKS.year.unshift(function (l, r, log, a) {
    if (!l.alive) return;
    var F = l.flags;
    // bản lưu cũ: người yêu đã mất nhưng vẫn nằm trong danh sách người cũ / bạn thân còn sống
    if (!F.deathSync72) {
      F.deathSync72 = true;
      (l.log || []).forEach(function (e) {
        var m = /^(?:Người yêu|Vợ|Chồng|Người bạn đời|Bạn trai|Bạn gái|Người ấy) (.+?) qua đời ở tuổi/.exec(e.t || '');
        if (m && !(l.partner && l.partner.name === m[1] && l.partner.alive !== false)) { if (!dead(l).some(function (d) { return d.n === m[1]; })) dead(l).push({ n: m[1], s: null, a: e.a }); }
      });
      dead(l).forEach(function (d) {
        people(l).forEach(function (f) { if (f.name === d.n && f.alive !== false && (f.lover || (l.log || []).some(function (e) { return (e.t || '').indexOf(f.name) >= 0 && /Bạn thân thành người yêu/.test(e.t); }))) { f.alive = false; f.died = d.a; f.lover = false; } });
        if (F.exList) F.exList = F.exList.filter(function (x) { return x.name !== d.n; });
      });
    }
    loverFriendGone(l, a);
  });
  // bạn thân (từng là người yêu cũ) qua đời thì không còn trong danh sách "người cũ"
  E.HOOKS.year.unshift(function (l) {
    var L = l.flags && l.flags.exList; if (!L || !L.length) return;
    var gone = people(l).filter(function (f) { return f.alive === false; }).map(function (f) { return f.name; });
    if (gone.length) l.flags.exList = L.filter(function (x) { return gone.indexOf(x.name) < 0; });
  });
  // tên người lạ không trùng tên người trong nhà, bạn bè, người cũ (trước đây có lúc bạn mới trùng tên con gái vừa sinh)
  var stranger = H.stranger;
  function known(l) {
    var a = [l.name], f = l.fam || {};
    [f.mName, f.fName].forEach(function (n) { if (n) a.push(n); });
    (l.kids || []).forEach(function (k) { a.push(k.name); });
    (l.sibList || []).forEach(function (s) { if (s && (s.n || s.name)) a.push(s.n || s.name); });
    if (l.partner) a.push(l.partner.name);
    people(l).forEach(function (x) { a.push(x.name); });
    ((l.flags && l.flags.exList) || []).forEach(function (x) { a.push(x.name); });
    return a;
  }
  H.stranger = function (l, r, sex) {
    var n = stranger.apply(this, arguments); if (!l || !l.kids) return n;
    var K = known(l);
    for (var i = 0; i < 6 && K.indexOf(n) >= 0; i++) n = stranger.call(this, l, r, sex);
    return n;
  };
  // bạn thân đang là người yêu / bạn đời mà qua đời (tuổi già, tai nạn…) thì cũng là mất người yêu
  function loverFriendGone(l, a) {
    var p = l.partner; if (!l.alive || !p) return;
    if (p.alive !== false && people(l).some(function (f) { return f.name === p.name && f.alive === false; })) {
      partnerGone(l, p, a, null, null);
      H.mem(l, 'Ngày mất ' + p.name + ' — vừa là bạn thân, vừa là người thương.', 7);
    } else if (p.alive === false) partnerGone(l, p, a, null, null);
  }
  E.HOOKS.year.unshift(function (l, r, log, a) { loverFriendGone(l, a); });

  // ===================================================================
  // 2. NGHỀ NỞ SỚM: KÝ HỢP ĐỒNG TỪ 15–17 TUỔI
  // ===================================================================
  // đội trẻ / hệ đào tạo trẻ esports nhận tuyển thủ từ 16 tuổi (trước đây khóa đến 18)
  if (E.CAR.tuyen_thu_es) E.CAR.tuyen_thu_es.minAge = 16;
  var EARLY_SPORT = /^(bóng đá|bơi lội|thể dục dụng cụ|điền kinh|cầu lông|bóng bàn|quần vợt|bóng rổ|bóng chuyền)$/;
  function kindOf(l) { if (l.talent === 'game') return 'es'; if (l.talent === 'thể thao' && EARLY_SPORT.test(l.talentSub || '')) return 'vdv'; return null; }
  function ready(l) {
    var k = kindOf(l); if (!k || l.job || (k === 'es' && l.age < 16)) return false;
    var s = l.skill || 0, bonus = l.flags.vdNkOk ? 12 : 0;
    return s + bonus >= (k === 'es' ? 45 : 42) && l.st.hea >= 50;
  }
  function who(l) { var f = l.fam || {}; return f.mAlive && f.fAlive && !f.noDad ? 'bố mẹ' : f.mAlive ? 'mẹ' : f.fAlive && !f.noDad ? 'bố' : (E.orphanCarer && E.orphanCarer(l)) || 'người giám hộ'; }
  function club(l, r) {
    if (kindOf(l) === 'es') return pick(r, isVN(l) ? ['Team Flash', 'Saigon Phantom', 'GAM Esports', 'Team Secret', 'Box Gaming', 'Cerberus Esports', 'Vikings Esports'] : ['T1', 'G2 Esports', 'Team Liquid', 'Fnatic', 'Paper Rex', 'Team Vitality']);
    var S = E.sportInfo ? E.sportInfo(l) : null;
    if (l.talentSub === 'bóng đá') return pick(r, isVN(l) ? ['Học viện PVF', 'Học viện HAGL – JMG', 'Trung tâm đào tạo trẻ Hà Nội FC', 'Học viện Viettel', 'lò đào tạo Sông Lam Nghệ An'] : ['học viện bóng đá của một câu lạc bộ hạng nhất', 'học viện La Masia của Barcelona', 'học viện bóng đá Ajax', 'học viện của một câu lạc bộ Premier League']);
    return S && S.club ? pick(r, S.club) : (isVN(l) ? 'Trung tâm huấn luyện thể thao quốc gia' : 'trung tâm huấn luyện thể thao quốc gia');
  }
  SC('ky_som', {
    title: function (l) { return kindOf(l) === 'es' ? 'Đội esports mời vào đội trẻ' : 'Lời mời ký hợp đồng trẻ'; },
    prep: function (l, r) { return { c: club(l, r) }; },
    valid: function (l) { return !!l.school && l.age >= 15 && l.age <= 17 && ready(l) && !l.flags.earlyPro; },
    text: function (l, d) {
      var k = kindOf(l);
      if (k === 'es') return d.c + ' theo dõi bạn leo hạng trên máy chủ ' + (l.game || 'game') + ' cả mùa. Họ mời bạn vào đội trẻ (academy): ở gaming house, có lương, tập theo giáo án, học văn hóa hệ giáo dục thường xuyên. ' + U.cap(who(l)) + ' phải ký thay vì bạn chưa đủ 18 tuổi.';
      return 'Tuyển trạch viên của ' + d.c + ' theo dõi bạn ở giải trẻ ' + (l.talentSub || 'thể thao') + '. Họ mời bạn ký hợp đồng đào tạo: bao ăn ở, có trợ cấp, tập chuyên nghiệp, học văn hóa ngay trong học viện. ' + U.cap(who(l)) + ' phải ký thay vì bạn chưa đủ 18 tuổi.';
    },
    opts: [
      { k: 'ky', l: 'Ký hợp đồng, theo nghiệp ngay', h: 'Tập chuyên nghiệp từ sớm, học văn hóa hệ giáo dục thường xuyên', ai: { w: 1.4, amb: 1 }, run: function (l, r, log, d) {
        var k = kindOf(l), id = k === 'es' ? 'tuyen_thu_es' : 'vdv';
        l.flags.earlyPro = { at: l.age, club: d.c, kind: k, gdtx: l.age + Math.max(1, 18 - l.age) };
        l.edu = Math.max(l.edu || 0, 2); l.indep = true;
        E.startJob(l, id, r, function () { }, true);
        l.skill = Math.min(100, (l.skill || 40) + 6);
        log((k === 'es' ? 'Ký hợp đồng đội trẻ ' + d.c + ' năm ' + l.age + ' tuổi. Bạn xách balo lên gaming house, mỗi ngày tập 10 tiếng, buổi tối học văn hóa trực tuyến.' : 'Ký hợp đồng đào tạo với ' + d.c + ' năm ' + l.age + ' tuổi. Sáng tập, chiều tập, tối học văn hóa ở lớp của học viện.') + ' ' + U.cap(who(l)) + ' tiễn bạn đi, vừa mừng vừa lo.', 'big');
        H.fx(l, { hap: 6 }); H.mem(l, k === 'es' ? 'Ngày đầu tiên ở gaming house, mới ' + l.age + ' tuổi.' : 'Ngày đặt chân vào ' + d.c + ', mới ' + l.age + ' tuổi.', 6);
      } },
      { k: 'cho', l: 'Học xong cấp ba rồi mới lên đội', h: 'Giữ con đường học hành; đội vẫn để ngỏ lời mời', ai: { w: 1, smart: 1 }, run: function (l, r, log, d) { l.flags.earlyPro = { wait: true, club: d.c, kind: kindOf(l) }; log('Bạn xin học hết cấp ba. ' + d.c + ' hẹn: "Tốt nghiệp xong cứ liên hệ, cửa vẫn mở."', 'neutral'); } },
      { k: 'thoi', l: 'Từ chối, giữ đam mê làm sở thích', ai: { w: 0.4 }, run: function (l, r, log, d) { l.flags.earlyPro = { no: true }; log('Bạn từ chối lời mời của ' + d.c + '. Đam mê vẫn còn, nhưng bạn chọn một con đường khác.', 'neutral'); } }
    ]
  });
  T('ky_som', function (l, a) { return a >= 15 && a <= 17 && !!l.school && ready(l) && !l.flags.earlyPro; }, 0.45, 1, 1);
  E.MAJOR.ky_som = 1;
  E.ACT.push({ id: 'thu_viec_doi_tre', g: 'Học tập', l: 'Đi thử việc ở học viện / đội trẻ', min: 15, sc: 'ky_som', avail: function (l) { if (!kindOf(l)) return 'Cần năng khiếu thể thao hoặc chơi game'; if (l.age > 17) return 'Chỉ dành cho tuổi 15–17'; if (!l.school) return 'Đang không đi học'; if (l.flags.earlyPro) return 'Đã có lời mời từ trước'; return ready(l) ? true : 'Tay nghề chưa đủ để được chú ý'; }, ai: { w: 0.05 } });
  // học xong cấp ba thì đội giữ lời hẹn
  SC('ky_som_hen', {
    title: 'Đội vẫn giữ lời hẹn', prep: function (l) { var x = l.flags.earlyPro || {}; return { c: x.club || 'Đội cũ' }; },
    valid: function (l) { var x = l.flags.earlyPro; return !!(x && x.wait && !x.done) && !l.school && !(l.job && /^(vdv|tuyen_thu_es)$/.test(E.resolveJob(l.job.id))); },
    text: function (l, d) { return 'Vừa tốt nghiệp, ' + d.c + ' gọi lại: "Suất của em vẫn còn, lên đội chính thức không?"'; },
    opts: [
      { k: 'len', l: 'Lên đội', ai: { w: 1.4 }, run: function (l, r, log, d) { var x = l.flags.earlyPro; x.done = true; E.startJob(l, x.kind === 'es' ? 'tuyen_thu_es' : 'vdv', r, function () { }, true); log('Bạn ký hợp đồng với ' + d.c + '. Con đường đã chờ bạn ba năm.', 'big'); H.fx(l, { hap: 5 }); } },
      { k: 'thoi', l: 'Cảm ơn, mình đã chọn hướng khác', ai: { w: 0.5 }, run: function (l, r, log, d) { l.flags.earlyPro.done = true; log('Bạn cảm ơn ' + d.c + ' và chọn một con đường khác.', 'neutral'); } }
    ]
  });
  T('ky_som_hen', function (l, a) { var x = l.flags.earlyPro; return !!(x && x.wait && !x.done) && a >= 17 && a <= 20 && !l.school && !!kindOf(l); }, 0.8, 1, 1);
  // học văn hóa trong học viện: đủ tuổi thì hoàn thành chương trình giáo dục thường xuyên cấp trung học phổ thông
  E.HOOKS.year.unshift(function (l, r, log, a) {
    var x = l.flags.earlyPro; if (!x || x.wait || x.no || !x.gdtx || x.gdtxDone || a < x.gdtx || !l.alive) return;
    x.gdtxDone = true;
    if (l.job && /^(vdv|tuyen_thu_es)$/.test(E.resolveJob(l.job.id)) && (l.edu || 0) < 3 && r() < 0.8) { l.edu = 3; log('Vừa tập vừa học, bạn hoàn thành chương trình trung học phổ thông hệ giáo dục thường xuyên.', 'good'); }
    else if ((l.edu || 0) < 3) log('Lịch tập dày đặc, bạn bỏ dở chương trình văn hóa, chỉ có bằng trung học cơ sở.', 'neutral');
  });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
