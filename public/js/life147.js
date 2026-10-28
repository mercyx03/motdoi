/* Góp ý người chơi — Mốc B: nghề nghiệp / thu nhập NPC đọc từ một nguồn, hồ sơ con chi tiết, gom menu thành nhóm con.
   · Chức vụ trong công ty: nguồn duy nhất là roles[*].personId của công ty / tập đoàn (life133, life137).
     Con được bổ nhiệm điều hành toàn thời gian thì đó là việc chính; nghề cũ được giữ trong prevJob147 để khôi phục khi miễn nhiệm.
   · Hồ sơ con tổng hợp dữ liệu sẵn có (persona141, family53, family100…); thông tin chưa có (dị ứng, độ thân với cha/mẹ kia,
     anh chị em) được tạo một lần theo danh tính và lưu lại, không ngẫu nhiên lại khi mở hồ sơ. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, kidTitle = E.kidTitle, kidIncome = E.kidIncome;
  function hash(s) { var n = 2166136261; for (var i = 0; i < s.length; i++) n = Math.imul(n ^ s.charCodeAt(i), 16777619); return n >>> 0; }
  function unit(l, k, salt) { return hash([l.id, k.uid110 || k.parentId || k.name, salt].join(':')) / 4294967296; }
  function age(l, k) { return l.age - k.born; }
  function uid(l, k) { return X.uid(l, k); }

  // ===================================================================
  // B1. Nghề nghiệp, chức vụ, nơi làm việc, thu nhập của người thân — một nguồn
  // ===================================================================
  function companies(l) {
    var out = [], B = E.BUSINESS123, Q = E.BUSINESS137;
    if (B && B.companies) (B.companies(l) || []).forEach(function (c) { if (c && !c.merged) out.push(c); });
    var g = Q && Q.roleCompany ? Q.roleCompany(l, { group: true }) : null; if (g) out.push(g);
    return out;
  }
  // Chức vụ điều hành hiện tại của một người (đúng uid, không theo tên)
  function roleOf(l, person) {
    if (!person || !E.BUSINESS133) return null;
    var id = uid(l, person), R = E.BUSINESS133, found = null;
    companies(l).forEach(function (c) {
      var roles = c.roles || {};
      Object.keys(roles).forEach(function (rid) { var x = roles[rid]; if (!found && x && x.kind === 'relative' && E.NPC.same(l, x.personId, id) && R.roles[rid]) found = { company: c, rid: rid, title: R.roles[rid].n, place: c.name || 'Doanh nghiệp gia đình', year: E.LEADERS169?E.LEADERS169.pay(l,c,x):R.pay(l, c, 'relative'), since: x.since }; });
    });
    return found;
  }
  function career(l, k) {
    var r = roleOf(l, k), base = k.job && E.CAR[k.job] ? E.kidTitleBase(k) : null;
    if (r) return { main: r.title, place: r.place, monthly: r.year / 12, role: r.title + ' · ' + r.place, previous: base, kind: 'role' };
    return { main: base || (age(l, k) < 18 ? null : 'Chưa có việc làm'), place: k.workplace147 || null, monthly: k.inc || 0, role: null, kind: base ? 'job' : 'none' };
  }
  // Đồng bộ con / vợ chồng / anh chị em với chức vụ: một khoản thu nhập; nghề cũ đứng yên trong prevJob147 và được khôi phục khi thôi chức.
  function people(l) {
    var out = (l.kids || []).map(function (k) { return { p: k, kid: true }; });
    if (l.partner && l.partner.status === 'married') out.push({ p: l.partner, partner: true });
    (l.sibList || []).forEach(function (s) { out.push({ p: s, sib: true }); });
    return out.filter(function (x) { return x.p && x.p.alive !== false; });
  }
  function syncCareer(l, log) {
    people(l).forEach(function (x) {
      var k = x.p, r = roleOf(l, k), cur = k.role147;
      if (r) {
        if (!cur) k.prevJob147 = { job: k.job || null, rank: k.rank || 0, inc: k.inc || 0 };
        if (!cur || cur.rid !== r.rid || cur.place !== r.place) { k.role147 = { rid: r.rid, title: r.title, place: r.place, since: r.since }; if (log && !cur) log((k.name || k.n) + ' nhận chức ' + r.title + ' tại ' + r.place + '; hồ sơ gia đình đã cập nhật.', 'neutral'); }
        if (x.kid) { k.job = k.prevJob147.job; k.rank = k.prevJob147.rank; k.jyrs = -99; } /* nghề cũ không tự thăng chức trong lúc điều hành công ty */
        if (!x.sib) k.inc = r.year / 12;
      } else if (cur) {
        var p = k.prevJob147 || {}, old = x.kid && age(l, k) >= 60;
        if (x.kid) { k.job = old ? null : p.job; k.rank = p.rank || 0; k.jyrs = 0; k.inc = k.job ? kidIncome(l, k) : old ? (p.inc || 0) * 0.5 : 0; }
        else if (x.partner) k.inc = p.inc || 0;
        delete k.role147; delete k.prevJob147;
        if (log) log((k.name || k.n) + ' thôi giữ chức ' + cur.title + ' tại ' + cur.place + (x.kid && k.job ? ', trở lại công việc trước đây.' : '.'), 'neutral');
      }
    });
  }
  E.kidTitleBase = kidTitle;
  E.kidTitle = function (k) { return k && k.role147 ? k.role147.title + ' · ' + k.role147.place : kidTitle.apply(this, arguments); };
  E.kidIncome = function (l, k) { var r = k && k.role147 ? roleOf(l, k) : null; return r ? r.year / 12 : kidIncome.apply(this, arguments); };
  E.HOOKS.year.push(function (l, r, log) { if (l.alive) syncCareer(l, log); });
  // Bổ nhiệm / miễn nhiệm có hiệu lực ngay, không chờ hết năm.
  ['companyFamily137', 'companyRole133', 'groupRoles137', 'childSuccession139', 'childrenSuccession139', 'companies123'].forEach(function (id) {
    var D = E.DEC[id]; if (!D || typeof D.apply !== 'function') return;
    var ap = D.apply; D.apply = function (l) { var out = ap.apply(this, arguments); if (l && l.alive) syncCareer(l, function (t, k) { l.log.push({ a: l.age, y: l.birthYear + l.age, t: t, k: k || 'neutral' }); }); return out; };
  });

  // ===================================================================
  // B2. Hồ sơ con chi tiết, liên tục theo thời gian
  // ===================================================================
  var ALLERGY = ['hải sản', 'phấn hoa', 'đậu phộng', 'sữa bò', 'bụi nhà', 'lông mèo'];
  function once(l, k) {
    if (k.profile147) return k.profile147;
    var a = unit(l, k, 'allergy');
    k.profile147 = { allergy: a < 0.12 ? ALLERGY[Math.floor(unit(l, k, 'which') * ALLERGY.length)] : null, otherClose: Math.round(45 + unit(l, k, 'other') * 40), sib: {}, memories: [] };
    return k.profile147;
  }
  function sibClose(l, k, s) { var p = once(l, k), key = s.uid110 || uid(l, s); if (p.sib[key] == null) p.sib[key] = Math.round(40 + unit(l, k, 'sib:' + key) * 50); return p.sib[key]; }
  function remember(l, k, text, kind) { var p = once(l, k); p.memories.push({ a: age(l, k), t: text, k: kind || 'neutral' }); if (p.memories.length > 20) p.memories.splice(0, p.memories.length - 20); }
  function conduct(k) {
    var t = k.persona141 && k.persona141.traits || {}, v = k.vice;
    if (v) return 'Yếu';
    var s = (t.regulation || 50) * 0.5 + (t.empathy || 50) * 0.3 + (100 - (t.impulse || 50)) * 0.2;
    return s >= 65 ? 'Tốt' : s >= 50 ? 'Khá' : s >= 38 ? 'Trung bình' : 'Yếu';
  }
  function academic(l, k) {
    var a = age(l, k), st = k.study == null ? 50 : k.study, band = k.persona141 && k.persona141.school && k.persona141.school.band;
    var school = k.family53 && E.FAMILY53 && E.FAMILY53.schools && E.FAMILY53.schools[k.family53.school];
    return {
      school: a >= 6 && a < 18 && k.vice !== 'bỏ học' ? (school ? school.name : 'Trường công lập') : a >= 18 ? (k.edu >= 5 ? 'Đã tốt nghiệp đại học' : k.edu >= 3 ? 'Đã tốt nghiệp phổ thông' : 'Đã thôi học') : a >= 3 ? 'Mẫu giáo' : '—',
      grade: a >= 6 && a < 18 ? 'Lớp ' + Math.min(12, a - 5) : null,
      score: a >= 6 ? Math.round(st) / 10 : null,
      band: band || (st >= 80 ? 'giỏi' : st >= 65 ? 'khá' : st >= 50 ? 'trung bình' : 'yếu'),
      conduct: a >= 6 ? conduct(k) : null,
      awards: ((k.persona141 && k.persona141.milestones) || []).map(function (m) { return m.text + ' (' + m.age + ' tuổi)'; })
    };
  }
  function health(l, k) {
    var p = once(l, k), issues = [];
    if (k.vice === 'nghiện rượu' || k.vice === 'nghiện ma túy') issues.push(k.vice);
    if (k.ill) issues.push(typeof k.ill === 'string' ? k.ill : k.ill.n || 'đang điều trị bệnh');
    if (k.jail) issues.push('đang chấp hành án');
    return { status: k.alive === false ? 'Đã mất' : issues.length ? 'Cần theo dõi' : 'Khỏe mạnh', issues: issues, allergy: p.allergy };
  }
  function relations(l, k) {
    var p = once(l, k), out = [], you = l.sex === 'M' ? 'Bố (bạn)' : 'Mẹ (bạn)', other = k.coParent108 ? (k.coParent108.sex === 'M' ? 'Bố' : 'Mẹ') + ' ' + k.coParent108.name : null;
    var trust = k.persona141 ? k.persona141.trust : null;
    out.push([you, Math.round(k.close == null ? 60 : k.close) + '/100' + (trust != null ? ' · tin cậy ' + Math.round(trust) + '/100' : '')]);
    if (other) out.push([other, p.otherClose + '/100']);
    var partner = l.partner;
    if (partner && partner.alive !== false && !(k.coParent108 && partner.relation108 === k.coParent108.id)) {
      if (p.stepClose == null) p.stepClose = Math.round(35 + unit(l, k, 'step:' + (partner.uid110 || partner.name)) * 40);
      out.push([(partner.sex === 'M' ? 'Bố kế ' : 'Mẹ kế ') + partner.name, p.stepClose + '/100']);
    }
    var sibs = (l.kids || []).filter(function (s) { return s !== k && s.alive !== false; }).slice(0, 6);
    sibs.forEach(function (s) { var dup = sibs.some(function (o) { return o !== s && o.name === s.name; }) || s.name === k.name; out.push(['Anh chị em ' + s.name + (dup ? ' (' + age(l, s) + ' tuổi)' : ''), sibClose(l, k, s) + '/100']); });
    if (l.fam && (l.fam.mAlive || l.fam.fAlive)) out.push(['Ông bà', Math.round(U.clamp((k.close == null ? 60 : k.close) - 5 + unit(l, k, 'gp') * 20, 0, 100)) + '/100']);
    return out;
  }
  function money(l, k) {
    var s = k.support114, gifts = (k.gifts112 || []).filter(function (g) { return g && g.data; });
    return {
      income: k.inc ? H.money(l, k.inc) + '/tháng' : 'Chưa có thu nhập',
      savings: s && s.balance ? H.money(l, s.balance) + ' (khoản bạn gửi hỗ trợ)' : '—',
      allowance: k.support130 && !k.support130.stopped ? H.money(l, k.support130.monthly) + '/tháng' : s && s.monthly ? H.money(l, s.monthly) + '/tháng' : 'Theo từng khoản',
      gifts: gifts.length ? gifts.map(function (g) { return g.data.n || g.kind; }).join(', ') : (k.gotAt != null ? 'Đã nhận quà / tiền từ bạn năm ' + (k.gotAt - k.born) + ' tuổi' : '—'),
      assets: (k.assets148 || []).length ? k.assets148.map(function (x) { return x.name; }).join(', ') : k.homeGift112 ? 'Nhà được tặng' : '—',
      inherited: k.inherited148 ? H.money(l, k.inherited148) : '—'
    };
  }
  function memories(l, k) {
    var p = once(l, k), out = [];
    ((k.persona141 && k.persona141.memories) || []).forEach(function (m) { out.push(m.age + ' tuổi: ' + m.text); });
    p.memories.forEach(function (m) { out.push(m.a + ' tuổi: ' + m.t); });
    if (k.married) out.push('Đã lập gia đình' + (k.spouse126 ? ' với ' + k.spouse126.name : ''));
    return out.slice(-12);
  }
  function profile(l, k) { return { career: career(l, k), academic: academic(l, k), health: health(l, k), relations: relations(l, k), money: money(l, k), memories: memories(l, k) }; }
  // Dòng hiển thị cho trang hồ sơ (ứng dụng chỉ cần ghép vào danh sách)
  function facts(l, k) {
    var p = profile(l, k), out = [], a = age(l, k);
    if (p.career.main && a >= 15) { out.push(['Công việc chính', p.career.main]); if (p.career.place) out.push(['Nơi làm việc', p.career.place]); out.push(['Thu nhập', p.career.monthly ? H.money(l, p.career.monthly) + '/tháng' : '—']); if (p.career.kind === 'role' && p.career.previous) out.push(['Nghề trước khi nhận chức', p.career.previous]); }
    out.push(['Sức khỏe', p.health.status + (p.health.issues.length ? ' · ' + p.health.issues.join(', ') : '')]);
    out.push(['Dị ứng', p.health.allergy || 'Chưa ghi nhận']);
    if (a >= 3) { if (p.academic.grade) out.push(['Lớp', p.academic.grade]); else if (a >= 18) out.push(['Trình độ', p.academic.school]); if (p.academic.score != null && a < 18) out.push(['Học lực', p.academic.band + ' · điểm TB ' + p.academic.score.toFixed(1)]); if (p.academic.conduct && a < 18) out.push(['Hạnh kiểm', p.academic.conduct]); }
    if (p.academic.awards.length) out.push(['Thành tích', p.academic.awards.join('; ')]);
    p.relations.forEach(function (r) { out.push(['Thân thiết · ' + r[0], r[1]]); });
    out.push(['Tiền tiết kiệm', p.money.savings], ['Trợ cấp', p.money.allowance], ['Quà / tiền được tặng', p.money.gifts], ['Tài sản riêng', p.money.assets], ['Tài sản thừa kế', p.money.inherited]);
    if (p.memories.length) out.push(['Kỷ niệm, cột mốc', p.memories.join(' · ')]);
    return out;
  }
  // Chuyến du lịch gia đình có con đi cùng được ghi vào ký ức của từng con.
  (function () {
    var D = E.DEC.familyTrip114; if (!D) return; var ap = D.apply;
    D.apply = function (l) { var n = (l.log || []).length, out = ap.apply(this, arguments); var t = (l.log || []).slice(n).map(function (e) { return e.t; }).join(' ');
      if (t && /du lịch|chuyến đi|nghỉ dưỡng/i.test(t)) (l.kids || []).filter(function (k) { return k.alive !== false && age(l, k) >= 3 && k.custody !== 'ex' && k.custody !== 'other'; }).forEach(function (k) { remember(l, k, 'Chuyến du lịch cùng gia đình', 'good'); });
      return out; };
  })();

  // ===================================================================
  // B3 / B4. Gom hành động: 5 nhóm Gia đình & tình cảm, 5 nhóm Tiền bạc & tài sản
  // ===================================================================
  var FAMILY = 'Gia đình', MONEY = '💰 Tiền bạc & tài sản';
  var SUB = {
    love: [FAMILY, '1. Tình yêu & hôn nhân'], kids: [FAMILY, '2. Sinh con & nuôi con'], manage: [FAMILY, '3. Quản lý con cái'], kin: [FAMILY, '4. Quan hệ gia đình'], events: [FAMILY, '5. Hoạt động & sự kiện gia đình'],
    spend: [MONEY, '6. Chi tiêu & sinh hoạt'], bank: [MONEY, '7. Ngân hàng & vay vốn'], invest: [MONEY, '8. Đầu tư'], estate: [MONEY, '9. Kinh doanh & bất động sản'], things: [MONEY, '10. Phương tiện & tài sản']
  };
  var MAP = {
    love: 'tim_nguoi_yeu hen_ho cau_hon proposal149 dating108 dateFilters114 network108 bond108 affair107 breakup114 ly_hon show_hen_ho to_tinh_ban_than lien_lac_nguoi_cu que_hen_ho gift50 mua_nuoc chu_cap chu_cap_dung sn_quan_he tc_dieu_kien wealthWish130 supportRules130 family100_romance proposal149 prenup150',
    kids: 'sinh_con familyPlan108 orphanage129 succession112 nuoi_day_con',
    manage: 'childGuide108 support114 childSupport130 future126 children141 gift112 childHome112 custody129 residence146 family100_children weddings129 matchmaking149',
    kin: 'familyProfiles138 cases113 guardian138 family100_parents tham_bo_me gap_anh_chi parentsHome146 familyHead148',
    events: 'familyTrip114 grandCare129 schoolMeeting129 celebration129 party148 gifts149',
    spend: 'chi_tieu budget114 gui_bo_me mua_bao_hiem mua_nuoc_ban',
    bank: 'bank112 vay_tien tra_no repay114',
    invest: 'dau_tu market_menu ban_dau_tu_moi ve_so',
    estate: 'dau_tu_lon quan_ly_dau_tu mua_nha doi_nha homes112 chuyen_noi_o assetTeam123 deal148',
    things: 'mua_xe tra_xe_thue ban_tai_san di_chuc70 will150 collect148'
  };
  var BY_ID = {};
  Object.keys(MAP).forEach(function (s) { MAP[s].split(' ').forEach(function (id) { BY_ID[id] = SUB[s]; }); });
  var BY_GROUP = { 'Tình cảm': SUB.love, 'Tình cảm & gia đình': SUB.kin, 'Gia đình': SUB.kin, 'Tiền bạc': SUB.things };
  function place(action) { return BY_ID[action.id] || BY_GROUP[action.g] || null; }
  // Chia danh sách hành động thành nhóm lớn và nhóm con; mục "Chi tiêu & sinh hoạt" vẫn là lối tắt tới các việc tiêu tiền như trước.
  function build(acts, spendIds) {
    var groups = {}, subs = {}, spend = SUB.spend[1];
    function put(top, sub, x) { (subs[top] = subs[top] || {}); (subs[top][sub] = subs[top][sub] || []).push(x); }
    acts.forEach(function (x) { var pl = place(x); if (pl) { (groups[pl[0]] = groups[pl[0]] || []).push(x); put(pl[0], pl[1], x); } else (groups[x.g] = groups[x.g] || []).push(x); });
    (spendIds || []).forEach(function (id) { var x = acts.filter(function (a) { return a.id === id; })[0]; if (!x) return; var pl = place(x); if (pl && pl[1] === spend) return; put(MONEY, spend, x); });
    Object.keys(subs).forEach(function (top) { var ordered = {}; Object.keys(SUB).forEach(function (k) { if (SUB[k][0] === top && subs[top][SUB[k][1]]) ordered[SUB[k][1]] = subs[top][SUB[k][1]]; }); subs[top] = ordered; groups[top] = groups[top] || []; });
    return { groups: groups, subs: subs };
  }
  E.MENU147 = { FAMILY: FAMILY, MONEY: MONEY, place: place, build: build, subs: function (top) { return Object.keys(SUB).filter(function (k) { return SUB[k][0] === top; }).map(function (k) { return SUB[k][1]; }); }, SPEND_SUB: SUB.spend[1] };

  E.CAREER147 = { roleOf: roleOf, career: career, sync: syncCareer, companies: companies };
  E.CHILD147 = { profile: profile, facts: facts, remember: remember, once: once };
})(globalThis.G);
