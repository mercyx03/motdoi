/* Một Đời — Phần B (8.10.19): chiều sâu công vụ trên nền STATE174 (life174), không thay mô hình chức vụ cũ.
   · Hồ sơ chức vụ (l.job.post917): cơ quan cụ thể (bộ nào, tỉnh nào), trạng thái, ngày nhận, lịch sử chuyển chức có phân loại
     (thăng chức / điều động ngang / chuyển xuống / từ nhiệm / kỷ luật). Bản lưu cũ không có bằng chứng thì ghi "chưa xác định"
     và cho người chơi hoàn thiện — không tự bịa bộ/tỉnh rồi viết lại lịch sử.
   · Nhân sự trong thẩm quyền: cán bộ NPC có hồ sơ (năng lực, liêm chính — chỉ biết sau khi đánh giá, thâm niên, tính cách, lịch sử);
     giao việc, đánh giá, đề nghị/quyết định bổ nhiệm tùy thẩm quyền, yêu cầu giải trình, đề nghị kỷ luật; giới hạn số việc mỗi năm.
   · Người được nâng đỡ (đồng minh): nhớ người đã giúp, có thể hỗ trợ phối hợp hoặc bất đồng; không bảo đảm thăng chức.
   · Dự án công: ngân sách đơn vị tách hẳn tiền riêng của người chơi, giới hạn 2 dự án, tiến độ nhiều năm, biến số ngoài kiểm soát,
     thất bại/giải trình. Từ nhiệm có xác nhận; kỷ luật khi liêm chính thấp có quy trình giải trình.
   Cơ quan và người trong game là hư cấu theo cấu trúc; danh sách bộ theo cơ cấu Chính phủ từ 2025 (14 bộ, 3 cơ quan ngang bộ)
   là mô phỏng giản lược, cần đối chiếu khi thay đổi. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, S = E.STATE174, C = E.WORLD120;
  if (!S || !X) return;
  var MINISTRIES = ['Bộ Quốc phòng', 'Bộ Công an', 'Bộ Ngoại giao', 'Bộ Nội vụ', 'Bộ Tư pháp', 'Bộ Tài chính', 'Bộ Công Thương', 'Bộ Nông nghiệp và Môi trường', 'Bộ Xây dựng', 'Bộ Văn hóa, Thể thao và Du lịch', 'Bộ Khoa học và Công nghệ', 'Bộ Giáo dục và Đào tạo', 'Bộ Y tế', 'Bộ Dân tộc và Tôn giáo'];
  var BY_MAJOR = { law: 'Bộ Tư pháp', eco: 'Bộ Tài chính', edu: 'Bộ Giáo dục và Đào tạo', it: 'Bộ Khoa học và Công nghệ', med: 'Bộ Y tế', eng: 'Bộ Xây dựng', agri: 'Bộ Nông nghiệp và Môi trường', art: 'Bộ Văn hóa, Thể thao và Du lịch', lang: 'Bộ Ngoại giao' };
  // Tham số gameplay.
  var BAL = { staffActs: 3, staffSize: 4, budgetPerLevel: 1.5, maxProjects: 2, shock: 0.12, disciplineChance: 0.15 };
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; h = Math.imul(h, 3266489909); h ^= h >>> 16; return h >>> 0; }
  function rng(seed) { var x = hash(seed) || 1; return function () { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
  function jid(l) { return l.job ? E.resolveJob(l.job.id) : null; }
  function lv(l) { return S.levelOf(l); }
  function st(l) { var s = S.state(l); if (!s.b917 || typeof s.b917 !== 'object') s.b917 = { staff: [], allies: [], proj: { active: [], done: [], budgetAt: null, budget: 0 }, acts: {}, serial: 0, hist: [] }; return s.b917; }
  function province(l) { return l.prov && (l.prov.neu || l.prov.old) || null; }

  // ================= 1. Hồ sơ chức vụ: cơ quan, địa bàn, lịch sử có phân loại =================
  function scopeOf(l, j, rk) {
    if (j === 'ngan_hang_nn') return { agency: rk === 4 ? 'Ngân hàng Nhà nước chi nhánh ' + (province(l) || 'tỉnh (chưa xác định)') : 'Ngân hàng Nhà nước Việt Nam', kind: 'sbv' };
    if (j === 'thanh_tra') return { agency: rk <= 3 ? 'Thanh tra ' + (province(l) ? 'tỉnh ' + province(l) : 'tỉnh (chưa xác định)') : 'Thanh tra Chính phủ', kind: 'inspect' };
    if (j === 'trung_uong' || (j === 'hanh_chinh_cong' && rk >= 9)) {
      if (j === 'trung_uong' && rk >= 6) return { agency: 'Chính phủ', kind: 'gov' };
      return { agency: BY_MAJOR[l.major] || 'Bộ Nội vụ', kind: 'ministry' };
    }
    if ((j === 'hanh_chinh_cong' && rk >= 7) || (j === 'chinh_tri' && rk >= 3 && rk <= 5)) return { agency: 'UBND tỉnh', territory: province(l), kind: 'province' };
    if (j === 'dang_uy') return rk >= 7 ? { agency: 'Trung ương Đảng', kind: 'party_central' } : { agency: 'Tỉnh ủy', territory: province(l), kind: 'province' };
    if (j === 'chinh_tri' && rk >= 6) return { agency: 'Trung ương Đảng', kind: 'party_central' };
    if (j === 'hanh_chinh_cong' && rk <= 4 || j === 'can_bo_xa') return { agency: 'UBND cấp xã', territory: province(l), kind: 'commune' };
    return null;
  }
  function key(l) { return l.job ? jid(l) + ':' + (l.job.rank || 0) + ':' + (l.job.since == null ? '' : l.job.since) : ''; }
  function classify(fromLv, toLv, why) { return why || (toLv > fromLv ? 'thăng chức / bổ nhiệm' : toLv === fromLv ? 'điều động ngang' : 'chuyển xuống vị trí thấp hơn'); }
  function syncPost(l, why) {
    if (!l || !l.job || !S.isVNState(l)) return null;
    var p = l.job.post917, k = key(l), here = S.levelOf(l);
    if (p && p.key === k) return p;
    var fresh = l.job.rankSince === l.age || l.job.since === l.age || !!p || !!why;
    var sc = scopeOf(l, jid(l), l.job.rank || 0);
    var np = { key: k, job: jid(l), rank: l.job.rank || 0, level: here, since: l.age, status: 'chính thức',
      agency: sc ? (fresh ? sc.agency : null) : null, territory: sc && sc.territory !== undefined ? (fresh ? sc.territory : null) : undefined, kind: sc ? sc.kind : 'other',
      inferred: !fresh && !!sc, hist: p && Array.isArray(p.hist) ? p.hist.slice(-11) : [] };
    if (p) np.hist.push({ age: l.age, from: p.title || '', fromLevel: p.level, to: E.jobTitle(l), toLevel: here, type: classify(p.level, here, why) });
    if (sc && sc.kind === 'ministry' && fresh && p && p.kind === 'ministry' && p.agency) np.agency = p.agency; // điều động trong cùng bộ giữ nguyên bộ
    l.job.post917 = np; np.title = baseTitle(l);
    if (jid(l) === 'ngan_hang_nn' && !(l.job.employer123 && /Ngân hàng Nhà nước/.test(l.job.employer123.name || ''))) l.job.employer123 = { name: (l.job.rank || 0) === 4 ? 'Ngân hàng Nhà nước chi nhánh tỉnh' : 'Ngân hàng Nhà nước Việt Nam', factor: 1.08 };
    return np;
  }
  var title0 = E.jobTitle, inTitle = false;
  function baseTitle(l) { inTitle = true; try { return title0.apply(this, [l]); } finally { inTitle = false; } }
  E.jobTitle = function (l) {
    var t = title0.apply(this, arguments);
    if (inTitle || !l || !l.job || !l.job.post917 || l.job.post917.key !== key(l) || typeof t !== 'string') return t;
    var p = l.job.post917;
    if (p.kind === 'ministry' && /bộ trưởng|thứ trưởng|vụ trưởng|cục trưởng|chuyên viên cấp bộ|chuyên viên chính cấp bộ/i.test(t) && !/Bộ [A-ZĐ]/.test(t)) return t + ' · ' + (p.agency || 'bộ chưa xác định');
    if (p.kind === 'province' && /tỉnh/i.test(t) && !/tỉnh [A-ZĐÂ]/.test(t)) {
      var city = !!(l.prov && l.prov.kind === 'Thành phố' && p.territory === province(l));
      if (city) t = t.replace('Tỉnh ủy', 'Thành ủy').replace('tỉnh ủy', 'thành ủy').replace('UBND tỉnh', 'UBND thành phố');
      return t + ' · ' + (p.territory ? (city ? 'thành phố ' + p.territory.replace(/^TP\. ?/, '') : 'tỉnh ' + p.territory) : 'tỉnh chưa xác định');
    }
    return t;
  };
  E.HOOKS.year.push(function (l) { if (l.alive && l.job && S.isVNState(l)) syncPost(l); });
  var mig = E.migrateExt; E.migrateExt = function (l) { if (mig) mig(l); if (l && l.job && l.job.post917 && typeof l.job.post917 !== 'object') delete l.job.post917; };

  // ================= 2. Từ nhiệm có xác nhận, kỷ luật có giải trình =================
  function lower(l, type, log, text) {
    var before = E.jobTitle(l), bl = S.levelOf(l), c = E.jobDef(l); if (!c || (l.job.rank || 0) <= 0) return false;
    l.job.rank = (l.job.rank || 0) - 1; l.job.rankTracked = l.job.rank; l.job.rankSince = l.age; delete l.job.t;
    syncPost(l, type); var s = S.state(l); s.history.push({ age: l.age, year: l.birthYear + l.age, type: type, from: before, to: E.jobTitle(l), agency: (S.posOf(l) || {}).agency || '' });
    if (s.history.length > 25) s.history.shift();
    if (log) log(text + ' ' + before + ' (bậc ' + bl + ') → ' + E.jobTitle(l) + ' (bậc ' + S.levelOf(l) + ').', 'neutral');
    return true;
  }
  E.SC('stepDown917', { title: 'Xác nhận xin thôi giữ chức vụ',
    prep: function (l) { return { key: key(l), at: l.age }; },
    valid: function (l, d) { return !!(l.job && S.isVNState(l) && d && d.key === key(l) && d.at === l.age && (l.job.rank || 0) > 0); },
    text: function (l) { return 'Bạn đề nghị thôi giữ chức ' + E.jobTitle(l) + ' và nhận vị trí thấp hơn một bậc trong cùng ngạch. Đây là chuyển xuống có lý do, được ghi vào hồ sơ; không phải thăng tiến. Thu nhập và thẩm quyền giảm theo vị trí mới.'; },
    opts: [{ k: 'confirm', l: 'Xác nhận thôi giữ chức', run: function (l, r, log, d) { if (!E.DEC.stepDown917.valid(l, d)) return; d.at = -1; lower(l, 'từ nhiệm theo nguyện vọng', log, 'Quyết định cho thôi giữ chức theo nguyện vọng:'); H.fx(l, { hap: 2 }); if (l.mind) l.mind.stress = U.clamp(l.mind.stress - 8, 0, 100); } },
      { k: 'cancel', l: 'Suy nghĩ lại, giữ chức vụ hiện tại', run: function (l, r, log) { log('Bạn rút lại đề nghị, tiếp tục giữ chức vụ.', 'neutral'); } }] });
  C.incident('discipline917', 'Kiểm điểm trách nhiệm người đứng đầu', function (l) { return S.isVNState(l) && (S.state(l).kpi.integrity < 40 || (l.flags.dirty || 0) > 0) && (l.job.rank || 0) > 0 ? true : 'Không có nội dung cần kiểm điểm'; },
    function (l) { return 'Cơ quan kiểm tra nêu dấu hiệu vi phạm trong quản lý tại ' + ((l.job.post917 && l.job.post917.agency) || 'đơn vị') + ' (liêm chính ' + S.state(l).kpi.integrity + '/100). Bạn được giải trình trước khi có kết luận; kỷ luật nếu có phải theo quy trình và có lý do ghi trong hồ sơ.'; },
    function (l) { return [
      { k: 'explain', l: 'Giải trình đầy đủ, nộp hồ sơ chứng minh', run: function (l, r, log) { var s = S.state(l), p = U.clamp(0.25 + s.kpi.integrity / 120 - (l.flags.dirty || 0) * 0.1, 0.05, 0.85); if (r() < p) { s.kpi.credibility = U.clamp(s.kpi.credibility + 2, 20, 100); log('Giải trình được chấp nhận một phần; đơn vị phải khắc phục thiếu sót, chức vụ giữ nguyên.', 'neutral'); } else { lower(l, 'kỷ luật cách chức', log, 'Kết luận kiểm tra: kỷ luật cách chức, chuyển'); s.kpi.credibility = U.clamp(s.kpi.credibility - 6, 20, 100); } } },
      { k: 'accept', l: 'Nhận trách nhiệm, chấp nhận hình thức khiển trách', run: function (l, r, log) { var s = S.state(l); s.kpi.integrity = U.clamp(s.kpi.integrity + 6, 10, 100); s.kpi.credibility = U.clamp(s.kpi.credibility - 3, 20, 100); s.planned = false; log('Bạn nhận khiển trách; tạm ra khỏi quy hoạch, giữ chức vụ và phải khắc phục.', 'bad'); } }
    ]; });
  C.event('discipline917', function (l) { return S.isVNState(l) && (l.job.rank || 0) > 0 && (S.state(l).kpi.integrity < 40 || (l.flags.dirty || 0) > 0); }, BAL.disciplineChance);

  // ================= 3. Nhân sự trong thẩm quyền và người được nâng đỡ =================
  var ROLES = ['chuyên viên', 'chuyên viên chính', 'phó trưởng phòng', 'trưởng phòng'];
  var TRAITS = ['tận tụy', 'cầu toàn', 'năng động', 'thận trọng', 'ít tham vọng', 'tham vọng', 'nguyên tắc', 'khéo giao tiếp'];
  function authority(l) { var v = lv(l); return v >= 6 ? 'decide' : v >= 4 ? 'propose' : 'none'; }
  function authorityText(l) { var a = authority(l); return a === 'decide' ? 'Bạn quyết định bổ nhiệm cấp phòng trong đơn vị; chức danh do cấp trên quản lý vẫn chỉ được đề nghị.' : a === 'propose' ? 'Bạn được đề nghị bổ nhiệm, kỷ luật; quyết định thuộc lãnh đạo cấp trên.' : 'Vị trí hiện tại chưa có thẩm quyền về nhân sự.'; }
  function staff(l) {
    var b = st(l);
    if (authority(l) !== 'none' && b.staffFor !== key(l)) {
      b.staff.forEach(function (p) { if (p.status === 'active') { p.status = 'former'; p.hist.push(l.age + ': bạn chuyển công tác'); } });
      var r = rng(l.id + ':staff917:' + key(l));
      for (var i = 0; i < BAL.staffSize; i++) b.staff.push({ id: l.id + ':s917:' + (++b.serial), name: H.stranger(l, r, r() < 0.5 ? 'M' : 'F'), role: Math.floor(r() * 3), comp: Math.round(40 + r() * 45), integ: Math.round(35 + r() * 60), known: false, seniority: 1 + Math.floor(r() * 15), trait: TRAITS[Math.floor(r() * TRAITS.length)], trust: 50, status: 'active', hist: [], born: l.age - 25 - Math.floor(r() * 25) });
      b.staffFor = key(l);
      if (b.staff.length > 24) b.staff = b.staff.filter(function (p) { return p.status === 'active' || p.ally; }).slice(-24);
    }
    return b.staff.filter(function (p) { return p.status === 'active'; });
  }
  function actsLeft(l) { var b = st(l); return b.acts.at === l.age ? BAL.staffActs - b.acts.n : BAL.staffActs; }
  function useAct(l) { var b = st(l); if (b.acts.at !== l.age) b.acts = { at: l.age, n: 0 }; b.acts.n++; }
  function phist(p, l, t) { p.hist.push(l.age + ': ' + t); if (p.hist.length > 10) p.hist.shift(); }
  function staffWhy(l) { return !S.isVNState(l) ? 'Chỉ áp dụng khi công tác trong khu vực nhà nước Việt Nam' : authority(l) === 'none' ? 'Vị trí hiện tại chưa có thẩm quyền về nhân sự (cần từ bậc 4)' : true; }
  X.menu('staff917', 'Nhân sự trong đơn vị', staffWhy, function (l) {
    var b = st(l); return authorityText(l) + ' Còn ' + Math.max(0, actsLeft(l)) + '/' + BAL.staffActs + ' việc nhân sự trong năm. Thành tích đến từ nhiệm vụ và kết quả, không từ số lần bấm.\n' +
      staff(l).map(function (p) { return '• ' + p.name + ' — ' + ROLES[p.role] + ', năng lực ' + p.comp + ', liêm chính ' + (p.known ? p.integ : 'chưa đánh giá') + ', thâm niên ' + (p.seniority + l.age - (p.since || l.age)) + ' năm, ' + p.trait + (p.ally ? ', người bạn từng nâng đỡ' : ''); }).join('\n') +
      (b.allies.length ? '\nNgười được bạn nâng đỡ: ' + b.allies.map(function (a) { return a.name + ' (' + a.where + (a.active ? '' : ', không còn giữ chức') + ')'; }).join('; ') : '');
  }, function (l) {
    return staff(l).map(function (p) { return { k: 'p:' + p.id, l: p.name + ' · ' + ROLES[p.role], h: 'Năng lực ' + p.comp + ' · ' + p.trait, run: function (l, r) { X.next(l, 'staffPerson917', r, { id: p.id }); } }; });
  }, 18, 'Công vụ & quản lý');
  function person(l, id) { return st(l).staff.find(function (p) { return p.id === id && p.status === 'active'; }); }
  X.menu('staffPerson917', 'Hồ sơ cán bộ', staffWhy, function (l, d) {
    var p = person(l, d && d.arg && d.arg.id); if (!p) return 'Người này không còn trong đơn vị.';
    return p.name + ' — ' + ROLES[p.role] + '. Năng lực ' + p.comp + '/100 · liêm chính ' + (p.known ? p.integ + '/100' : 'chưa đánh giá (chỉ biết sau đánh giá)') + ' · ' + p.trait + ' · tin tưởng bạn ' + p.trust + '/100.\nLịch sử: ' + (p.hist.join('; ') || 'chưa có') + '\n' + authorityText(l);
  }, function (l, a) {
    var p = person(l, a.id); if (!p) return [];
    var none = actsLeft(l) <= 0 ? 'Đã dùng hết việc nhân sự trong năm' : true, out = [];
    out.push({ k: 'task', l: 'Giao một nhiệm vụ chuyên môn có thời hạn', h: 'Năng lực tăng nếu hoàn thành; cần thời gian', why: none, run: function (l, r, log) { var q = person(l, a.id); if (!q || actsLeft(l) <= 0) return; useAct(l); var ok = r() < 0.4 + q.comp / 200; if (ok) { q.comp = Math.min(100, q.comp + 3); q.trust = Math.min(100, q.trust + 4); S.state(l).kpi.management = U.clamp(S.state(l).kpi.management + 1, 20, 100); phist(q, l, 'hoàn thành nhiệm vụ được giao'); log(q.name + ' hoàn thành nhiệm vụ đúng hạn.', 'good'); } else { phist(q, l, 'chậm tiến độ nhiệm vụ'); log(q.name + ' chậm tiến độ; bạn cần đôn đốc thêm.', 'neutral'); } } });
    out.push({ k: 'eval', l: 'Đánh giá cán bộ cuối năm', why: p.evalAt === l.age ? 'Đã đánh giá năm nay' : none, run: function (l, r, log) { var q = person(l, a.id); if (!q || actsLeft(l) <= 0 || q.evalAt === l.age) return; useAct(l); q.evalAt = l.age; q.known = true; phist(q, l, 'được đánh giá'); log('Đánh giá ' + q.name + ': năng lực ' + q.comp + ', liêm chính ' + q.integ + '.', 'neutral'); } });
    var canPromote = authority(l) !== 'none' && p.role < ROLES.length - 1 && p.comp >= 60;
    out.push({ k: 'promote', l: authority(l) === 'decide' ? 'Quyết định bổ nhiệm lên ' + ROLES[Math.min(p.role + 1, 3)] : 'Đề nghị cấp trên bổ nhiệm lên ' + ROLES[Math.min(p.role + 1, 3)], h: 'Cần năng lực ≥ 60; người được đề nghị có thể từ chối', why: !canPromote ? (p.role >= 3 ? 'Đã ở vị trí cao nhất đơn vị quản lý' : 'Năng lực chưa đủ') : p.promoteAt === l.age ? 'Đã xét năm nay' : none,
      run: function (l, r, log) { var q = person(l, a.id); if (!q || actsLeft(l) <= 0 || q.promoteAt === l.age) return; useAct(l); q.promoteAt = l.age;
        if (q.trait === 'ít tham vọng' && r() < 0.6) { phist(q, l, 'từ chối đề nghị bổ nhiệm'); log(q.name + ' cảm ơn nhưng muốn tiếp tục làm chuyên môn, chưa nhận chức.', 'neutral'); return; }
        var approved = authority(l) === 'decide' || r() < 0.35 + q.comp / 250;
        if (!approved) { phist(q, l, 'được đề nghị bổ nhiệm, cấp trên chưa duyệt'); log('Cấp trên chưa duyệt đề nghị bổ nhiệm ' + q.name + '; hồ sơ được xem xét lại đợt sau.', 'neutral'); return; }
        q.role++; q.trust = Math.min(100, q.trust + 10); phist(q, l, 'được bổ nhiệm ' + ROLES[q.role]);
        var b = st(l); if (!b.allies.some(function (x) { return x.id === q.id; })) b.allies.push({ id: q.id, name: q.name, since: l.age, where: ((l.job.post917 && l.job.post917.agency) || 'đơn vị cũ'), trust: q.trust, active: true, helped: 0, disagreed: 0 }); q.ally = true;
        log(q.name + ' được bổ nhiệm ' + ROLES[q.role] + '. Người này nhớ sự nâng đỡ của bạn, nhưng điều đó không bảo đảm ủng hộ vô điều kiện.', 'good'); } });
    out.push({ k: 'explain', l: 'Yêu cầu giải trình về sai sót', h: 'Chỉ hợp lý khi đã đánh giá thấy vấn đề', why: !p.known ? 'Cần đánh giá trước khi yêu cầu giải trình' : p.integ >= 55 ? 'Không có dấu hiệu sai phạm' : none,
      run: function (l, r, log) { var q = person(l, a.id); if (!q || actsLeft(l) <= 0) return; useAct(l); q.integ = Math.min(100, q.integ + 8); q.trust = Math.max(0, q.trust - 5); phist(q, l, 'giải trình sai sót'); log(q.name + ' giải trình và cam kết khắc phục; sai sót được ghi nhận.', 'neutral'); } });
    out.push({ k: 'discipline', l: authority(l) === 'decide' ? 'Kỷ luật / miễn nhiệm chức vụ cấp phòng' : 'Đề nghị cấp trên kỷ luật', h: 'Chỉ khi đã đánh giá có sai phạm rõ', why: !p.known || p.integ >= 40 ? 'Chưa có căn cứ sai phạm rõ ràng' : none,
      run: function (l, r, log) { var q = person(l, a.id); if (!q || actsLeft(l) <= 0) return; useAct(l); if (authority(l) === 'decide' || r() < 0.6) { q.status = 'removed'; phist(q, l, 'bị kỷ luật, rời vị trí'); log(q.name + ' bị kỷ luật theo quy trình, rời vị trí. Người này vẫn còn trong giới công vụ và nhớ chuyện này.', 'neutral'); } else { phist(q, l, 'được đề nghị kỷ luật, cấp trên yêu cầu bổ sung hồ sơ'); log('Cấp trên yêu cầu bổ sung chứng cứ trước khi kỷ luật ' + q.name + '.', 'neutral'); } } });
    return out;
  }, 18);
  // Người được nâng đỡ: mỗi năm có thể giúp phối hợp, giới thiệu thông tin công khai, hoặc bất đồng; người rời chức không còn quyền cũ.
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !l.flags.state174 || !l.flags.state174.b917) return; var b = st(l); if (b.allyAt === l.age) return; b.allyAt = l.age;
    var R = rng(l.id + ':ally917:' + l.age);
    b.allies.forEach(function (a) {
      var p = b.staff.find(function (x) { return x.id === a.id; }); if (!p) return;
      var age = l.age - (p.born || l.age - 40) + 40; if (a.active && (p.status === 'removed' || l.age - a.since > 20 || R() < 0.03)) { a.active = false; return; }
      if (!a.active || !S.isVNState(l)) return;
      var x = R();
      if (x < 0.15 + a.trust / 1000) { a.helped++; var s = S.state(l); s.kpi.coordination = U.clamp(s.kpi.coordination + 2, 20, 100); if (log) log(a.name + ' (người bạn từng nâng đỡ) phối hợp tốt giữa hai đơn vị, công việc liên ngành trôi chảy hơn.', 'good'); }
      else if (x > 0.93) { a.disagreed++; a.trust = Math.max(0, a.trust - 10); if (log) log(a.name + ' công khai không đồng tình với một đề xuất của bạn vì nguyên tắc chuyên môn. Quan hệ chùng xuống nhưng không đổ vỡ.', 'neutral'); }
    });
  });

  // ================= 4. Dự án công: ngân sách đơn vị, tiến độ nhiều năm, biến số ngoài kiểm soát =================
  var PROJ = {
    hanh_chinh_dia_phuong: [['Nâng cấp bộ phận một cửa', 1.2, 2], ['Đường liên thôn và thoát nước', 2.5, 3], ['Số hóa hồ sơ hộ tịch', 1, 2]],
    so_nganh: [['Đề án quy hoạch chuyên ngành tỉnh', 1.5, 2], ['Chương trình kiểm tra chất lượng dịch vụ', 1, 2], ['Hạ tầng dữ liệu ngành', 2, 3]],
    ngan_hang_nn: [['Hệ thống giám sát an toàn tín dụng', 2, 3], ['Đề án thanh toán không tiền mặt', 1.5, 2], ['Rà soát nợ xấu nhóm ngân hàng nhỏ', 1.2, 2]],
    trung_uong: [['Dự thảo luật sửa đổi', 1.5, 3], ['Chương trình mục tiêu vùng', 3, 3], ['Cải cách thủ tục cấp bộ', 1, 2]],
    dang_doan_the: [['Rà soát quy hoạch cán bộ nhiệm kỳ', 1, 2], ['Chuyên đề kiểm tra, giám sát', 1.2, 2]],
    thanh_tra_kiem_toan: [['Thanh tra chuyên đề dự án đầu tư', 1.2, 2], ['Giải quyết khiếu nại tồn đọng', 1, 2]],
    tai_chinh_thue_hq: [['Chống thất thu và hóa đơn điện tử', 1.5, 2], ['Tự động hóa thông quan', 2, 3]],
    _: [['Cải tiến quy trình nội bộ', 1, 2], ['Nâng cao chất lượng dịch vụ công', 1.5, 2]]
  };
  function projState(l) { var p = st(l).proj; var cap = l.base * Math.max(1, lv(l)) * BAL.budgetPerLevel; if (p.budgetAt !== l.age) { p.budgetAt = l.age; p.budget = cap; } p.cap = cap; return p; }
  function projWhy(l) { return !S.isVNState(l) ? 'Chỉ áp dụng khi công tác trong khu vực nhà nước Việt Nam' : lv(l) < 3 ? 'Cần giữ vị trí từ bậc 3 để chủ trì dự án' : true; }
  function money(l, v) { return H.money(l, v); }
  X.menu('project917', 'Dự án công và ngân sách đơn vị', projWhy, function (l) {
    var p = projState(l); return 'Ngân sách đơn vị năm nay: ' + money(l, p.budget) + ' / ' + money(l, p.cap) + ' — tiền công, không phải tài sản của bạn, không đưa vào thừa kế. Tối đa ' + BAL.maxProjects + ' dự án cùng lúc; kết quả tính một lần mỗi năm, có biến số ngoài kiểm soát.\n' +
      (p.active.map(function (x) { return '• ' + x.name + ': năm ' + x.year + '/' + x.dur + ', chất lượng ' + x.quality + '/100'; }).join('\n') || 'Chưa có dự án đang chạy.') +
      (p.done.length ? '\nĐã kết thúc: ' + p.done.slice(-4).map(function (x) { return x.name + ' (' + x.result + ')'; }).join('; ') : '');
  }, function (l) {
    var p = projState(l), br = (S.posOf(l) || {}).branch, list = PROJ[br] || PROJ._, out = [];
    list.forEach(function (t, i) { var cost = l.base * t[1] * Math.max(1, lv(l) / 3); out.push({ k: 'new' + i, l: 'Chủ trì: ' + t[0], h: 'Ngân sách ' + money(l, cost) + ' · ' + t[2] + ' năm', why: p.active.length >= BAL.maxProjects ? 'Đang chủ trì đủ ' + BAL.maxProjects + ' dự án' : p.active.some(function (x) { return x.name === t[0]; }) ? 'Dự án này đang chạy' : p.budget < cost ? 'Ngân sách đơn vị năm nay không đủ' : true,
      run: function (l, r, log) { var q = projState(l); if (q.active.length >= BAL.maxProjects || q.budget < cost) return; q.budget -= cost; q.active.push({ id: l.id + ':p917:' + (++st(l).serial), name: t[0], cost: cost, dur: t[2], year: 0, quality: 50, start: l.age, branch: br }); log('Bạn được giao chủ trì "' + t[0] + '" với ngân sách ' + money(l, cost) + '. Kết quả sẽ được đánh giá qua từng năm.', 'neutral'); } }); });
    p.active.forEach(function (x) {
      out.push({ k: 'boost:' + x.id, l: 'Tăng cường giám sát chất lượng: ' + x.name, h: 'Tốn thêm 20% ngân sách năm nay', why: x.boostAt === l.age ? 'Đã tăng cường năm nay' : p.budget < x.cost * 0.2 ? 'Không đủ ngân sách' : true, run: function (l) { var q = projState(l), y = q.active.find(function (z) { return z.id === x.id; }); if (!y || y.boostAt === l.age || q.budget < y.cost * 0.2) return; q.budget -= y.cost * 0.2; y.boostAt = l.age; y.quality = Math.min(100, y.quality + 8); } });
      out.push({ k: 'stop:' + x.id, l: 'Dừng dự án và giải trình: ' + x.name, h: 'Hoàn phần ngân sách chưa dùng; tín nhiệm giảm nhẹ', run: function (l, r, log) { var q = projState(l), i = q.active.findIndex(function (z) { return z.id === x.id; }); if (i < 0) return; var y = q.active.splice(i, 1)[0]; q.budget += y.cost * (1 - y.year / y.dur) * 0.5; y.result = 'dừng có giải trình'; q.done.push(y); var s = S.state(l); s.kpi.credibility = U.clamp(s.kpi.credibility - 2, 20, 100); log('Dự án "' + y.name + '" dừng lại; bạn giải trình lý do trước cấp trên.', 'neutral'); } });
    });
    return out;
  }, 18, 'Công vụ & quản lý');
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !l.flags.state174 || !l.flags.state174.b917) return; var p = st(l).proj; if (!p.active.length || p.yearAt === l.age) return; p.yearAt = l.age;
    var s = S.state(l), crew = (st(l).staff || []).filter(function (x) { return x.status === 'active'; }), help = crew.length ? crew.reduce(function (n, x) { return n + x.comp; }, 0) / crew.length : 50;
    p.active.slice().forEach(function (x) {
      if (x.start === l.age) return;
      if (!S.isVNState(l) || (x.branch && (S.posOf(l) || {}).branch !== x.branch)) { p.active.splice(p.active.indexOf(x), 1); x.result = 'bàn giao khi chuyển công tác'; p.done.push(x); if (log) log('Dự án "' + x.name + '" được bàn giao cho người kế nhiệm khi bạn chuyển công tác.', 'neutral'); return; }
      var R = rng(l.id + ':' + x.id + ':' + l.age);
      x.year++; x.quality = U.clamp(Math.round(x.quality + (s.kpi.expertise - 60) / 8 + (s.kpi.management - 60) / 10 + (help - 55) / 10 + (R() - 0.5) * 10), 0, 100);
      if (R() < BAL.shock) { x.quality = Math.max(0, x.quality - 12); if (log) log('Biến động ngoài kiểm soát (thời tiết, giá vật tư, thay đổi quy định) làm chậm dự án "' + x.name + '".', 'neutral'); }
      if (x.year < x.dur) return;
      p.active.splice(p.active.indexOf(x), 1); p.done.push(x); if (p.done.length > 12) p.done.shift();
      if (x.quality >= 55) { x.result = 'đạt'; s.kpi.expertise = U.clamp(s.kpi.expertise + 3, 20, 100); s.kpi.credibility = U.clamp(s.kpi.credibility + 4, 20, 100); if (E.PUBLIC116 && E.PUBLIC116.record) { var pr = E.PUBLIC116.record(l); pr.projects = (pr.projects || 0) + 1; pr.points = Math.min(20, (pr.points || 0) + 2); } if (log) log('Nghiệm thu "' + x.name + '": đạt yêu cầu (chất lượng ' + x.quality + '/100). Người dân và đơn vị liên quan ghi nhận kết quả.', 'good'); }
      else { x.result = 'không đạt'; s.kpi.credibility = U.clamp(s.kpi.credibility - 5, 20, 100); s.kpi.management = U.clamp(s.kpi.management - 2, 20, 100); if (log) log('"' + x.name + '" không đạt nghiệm thu (chất lượng ' + x.quality + '/100); bạn phải giải trình và đề xuất khắc phục.', 'bad'); }
    });
  });

  // ================= 5. Lối vào: từ nhiệm, hoàn thiện hồ sơ cơ quan =================
  X.menu('post917', 'Hồ sơ chức vụ, cơ quan và lịch sử chuyển chức', function (l) { return S.isVNState(l) ? true : 'Chỉ áp dụng khi công tác trong khu vực nhà nước Việt Nam'; }, function (l) {
    var p = syncPost(l) || {}; return 'Chức vụ: ' + E.jobTitle(l) + ' · bậc ' + lv(l) + '/10 · ' + (p.status || 'chính thức') + ' từ năm ' + (l.birthYear + (p.since == null ? l.age : p.since)) + '.\nCơ quan: ' + (p.agency || (p.kind === 'other' ? (S.posOf(l) || {}).agency : 'chưa xác định')) + (p.territory !== undefined ? ' · địa bàn: ' + (p.territory || 'chưa xác định') : '') + '.\n' + authorityText(l) + '\nLịch sử: ' + ((p.hist || []).map(function (h) { return 'tuổi ' + h.age + ' — ' + h.type + ': ' + h.from + ' → ' + h.to; }).join('; ') || 'chưa có chuyển chức được ghi');
  }, function (l) {
    var p = syncPost(l) || {}, out = [];
    if (p.kind === 'ministry' && !p.agency) MINISTRIES.forEach(function (m, i) { out.push({ k: 'm' + i, l: 'Hoàn thiện hồ sơ: đang công tác tại ' + m, run: function (l) { var q = syncPost(l); if (q && !q.agency) { q.agency = m; q.inferred = false; } } }); });
    if (p.kind === 'province' && !p.territory && province(l)) out.push({ k: 'prov', l: 'Hoàn thiện hồ sơ: địa bàn ' + province(l) + ' (nơi đang sống)', run: function (l) { var q = syncPost(l); if (q && !q.territory) { q.territory = province(l); q.inferred = false; } } });
    out.push({ k: 'down', l: 'Xin thôi giữ chức, nhận vị trí thấp hơn một bậc', h: 'Cần xác nhận ở bước sau; ghi là chuyển xuống có lý do', why: (l.job.rank || 0) > 0 ? true : 'Đang ở vị trí đầu ngạch', run: function (l, r) { X.next(l, 'stepDown917', r, {}); } });
    return out;
  }, 18, 'Công vụ & quản lý');

  E.STATE917 = { MINISTRIES: MINISTRIES, BAL: BAL, ROLES: ROLES, syncPost: syncPost, scopeOf: scopeOf, staff: staff, authority: authority, projState: projState, state: st, lower: lower, actsLeft: actsLeft };
})(globalThis.G);
