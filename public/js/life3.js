/* Một Đời — v3.0 (bản cập nhật lớn):
   · HIV chỉ lây qua quan hệ tình dục không an toàn, kim tiêm, hoặc từ mẹ sang con — không "tự nhiên" mắc
   · lương theo trình độ (thạc sĩ, tiến sĩ, chứng chỉ ngoại ngữ), đóng BHXH, BHYT, BHTN; lương hưu theo số năm đóng
   · làm đúng sở trường thì năng suất cao, lương cao, vui hơn; làm việc không thích dễ căng thẳng (thang 0–100) → trầm cảm
   · năng khiếu có cấp độ (EXP) · bằng lái B hết hạn sau 10 năm, A1/A vĩnh viễn · IELTS, TOPIK, HSK hết hạn sau 2 năm
   · xăng xe đổ hằng tuần, thuê xe chạy dịch vụ (Xanh SM, Grab), thay pin xe điện 2 năm một lần
   · hẹn hò qua ứng dụng (Tinder, Bumble, Hinge, Facebook Hẹn hò, Blued, HER…) · thu nhập chi tiết đến từ đâu · hồ sơ chi tiết */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function T(id, when, p, cd) { E.TRIG.push({ id: id, when: when, p: p, cd: cd || 0 }); }
  function A(id, g, label, o) { var x = { id: id, g: g, l: label }; for (var k in o) x[k] = o[k]; E.ACT.push(x); }
  function EV(c, p, run) { E.EVENTS.push({ c: c, p: p, run: run }); }
  function fx(l, o) { H.fx(l, o); }
  function mo(l, v) { return H.money(l, v); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped); }
  function yr(l, a) { return l.birthYear + (a == null ? l.age : a); }
  function vnd(l) { return isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  // số tiền ghi theo triệu đồng ở Việt Nam; nước khác quy đổi theo mức sống
  function V(l, tr) { return vnd(l) ? tr : tr / 90 * l.base; }
  function wrapApply(id, after) { var D = E.DEC[id]; if (!D) return; var ap = D.apply; D.apply = function (l, dec, k, r, log) { var x = ap.apply(this, arguments); after(l, dec, k, r, log); return x; }; }
  function jobC(l) { return l.job ? E.jobDef(l) : null; }
  function hobbyName(l) { var h = l.hobby && E.leisure && E.leisure.HOBBY[l.hobby]; return h ? h.n : ''; }

  // ===================================================================
  // 1. CHỐNG LẶP: chuỗi sự kiện đang diễn ra (nghiện cờ bạc, đòi nợ, kỳ thi năng khiếu từng cấp) vẫn được lặp
  // ===================================================================
  E.TRIG.forEach(function (t) { if (/^(khung_bo|nghien_bac|nk_thi)$/.test(t.id)) { t.rep = true; t.cd = Math.max(t.cd || 0, t.id === 'nk_thi' ? 1 : 2); } });

  // ===================================================================
  // 2. HIV: chỉ có khi có đường lây
  // ===================================================================
  E.hivRisk = function (l) {
    var f = l.flags || {}, w = 0;
    if (f.hivMom) w += 3;
    if (l.addict && l.addict.drugs && f.inject) w += 2.5;
    if (f.injYrs) w += Math.min(3, f.injYrs) * 0.4; // đã từng chích chung kim tiêm: có thể đã nhiễm từ trước, giờ mới phát hiện
    if (f.unsafe) w += Math.min(3, f.unsafe * 0.5) * (l.pool === 'afs' ? 3 : /^(af|et|ao)/.test(l.pool || '') ? 1.5 : 1);
    return w;
  };
  function hivRoute(l) {
    var f = l.flags, r = [];
    if (f.hivMom) r.push('lây từ mẹ trong lúc mang thai, khi sinh');
    if (l.addict && l.addict.drugs && f.inject) r.push('dùng chung kim tiêm khi chích ma túy');
    if (f.unsafe) r.push('quan hệ tình dục không dùng bao cao su');
    return r.join(' hoặc ') || 'chưa rõ';
  }
  // một mối quan hệ ngoài luồng thường không phòng bị
  ['ngoai_tinh', 'khung_hoang_40'].forEach(function (id) { wrapApply(id, function (l, d, k, r) { if (k === 'affair' && ch(r, 0.4)) l.flags.unsafe = (l.flags.unsafe || 0) + 1; }); });
  var tm0 = E.DEC.treat.make;
  E.DEC.treat.make = function (l, r) {
    var d = tm0.apply(this, arguments);
    if (l.ill && l.ill.n === 'HIV') d.text = 'Xét nghiệm dương tính với HIV. Đường lây nhiều khả năng do ' + hivRoute(l) + '. Bác sĩ nói điều trị ARV sớm, uống thuốc đều thì vẫn sống, làm việc gần như bình thường. ' + d.text.replace(/^Bác sĩ nói cần điều trị sớm\. /, '');
    return d;
  };

  // ===================================================================
  // 3. HỌC TIẾN SĨ
  // ===================================================================
  SC('phd', {
    title: 'Học tiếp tiến sĩ?', major: 1,
    text: function (l) { return 'Bạn vừa nhận bằng thạc sĩ. Thầy hướng dẫn muốn nhận bạn làm nghiên cứu sinh tiến sĩ (3–4 năm, có học bổng nhỏ và việc trợ giảng). Có học vị tiến sĩ thì làm giảng viên, nghiên cứu viên, chuyên gia được trả cao hơn hẳn.'; },
    opts: [
      { k: 'yes', l: 'Làm nghiên cứu sinh tiến sĩ', h: '3–4 năm, thu nhập thấp trong lúc học', ai: { smart: 1.2, amb: 0.8, w: 0.8 }, run: function (l, r, log) { l.school = 'phd'; l.schoolEnd = l.age + U.randint(r, 3, 4); log('Trở thành nghiên cứu sinh tiến sĩ' + (l.major ? ' ngành ' + (l.majorName || E.MAJORS[l.major]) : '') + '.', 'good'); fx(l, { kno: 4 }); } },
      { k: 'no', l: 'Đi làm luôn với bằng thạc sĩ', ai: { w: 1.2 }, run: function (l, r, log) { l.flags.needJob = true; log('Cầm bằng thạc sĩ đi xin việc.', 'neutral'); } }
    ]
  });
  E.MAJOR.phd = 1;

  // ===================================================================
  // 4. VIỆC LÀM: sở trường, chứng chỉ, bảo hiểm
  // ===================================================================
  var FIT = {
    'toán học': /^(ke_toan|ngan_hang|ngan_hang_cao|dev|ky_su|ky_su_xd|ky_su_co_dien|data|kiem_toan|thue|nghien_cuu|giang_vien|giao_vien|fl_dev|kien_truc|logistics|gia_su|chu_dau_tu)$/,
    'ngoại ngữ': /^(fl_dich|hdv|tiep_vien|ngoai_giao|le_tan|giang_vien|giao_vien|gia_su|marketing|sale_b2b|phi_cong|fl_day)$/,
    'âm nhạc': /^(ca_si|rapper|nhac_si|dj|vu_cong|giao_vien|ql_nghe_si)$/,
    'hội họa': /^(thiet_ke|fl_thiet_ke|nhiep_anh|tho_xam|kien_truc|tk_thoi_trang|makeup|fl_video|dao_dien|nail)$/,
    'ăn nói': /^(luat_su|mc_tv|mc_su_kien|dv_hai|telesale|sale_bh|sale_bds|sale_oto|sale_mp|sale_b2b|chinh_tri|chinh_khach|giao_vien|giang_vien|kol_live|youtuber|hdv|fl_long_tieng|phong_vien|kiem_sat|tham_phan|tro_giup_phap_ly)$/,
    'khéo tay': /^(tho_may|tho_dien|tho_sua_xe|tho_han|ky_thuat_vien|dau_bep|tho_moc|tho_mo|nail|tho_toc|barber|spa|makeup|nha_si|ky_su_co_dien|kien_truc)$/,
    'kinh doanh': /^(kd_|chu_|tiem_|sale_|telesale|marketing|cam_do|ngan_hang)/,
    'thể thao': /^(vdv|hlv_tt|pt_gym|quan_doi|cong_an)$/,
    'game': /^(tuyen_thu_es|coach_es|caster_es|dau_tu_es|streamer|quan_net|dev|fl_dev)$/,
    'cờ': /^(ky_thu|hlv_co|nghien_cuu|dev)$/,
    'làm đẹp': /^(tho_toc|nail|makeup|stylist|tk_thoi_trang|nguoi_mau|barber|spa)$/,
    'diễn xuất': /^(dien_vien|dv_hai|nguoi_mau|mc_tv|mc_su_kien|kol_live|youtuber|fl_long_tieng)$/
  };
  var HOB_JOB = { rap: /^(rapper|dj|ca_si)$/, nhay: /^(vu_cong|pt_gym|ca_si)$/, guitar: /^(nhac_si|ca_si|giao_vien)$/, ve: /^(thiet_ke|fl_thiet_ke|kien_truc|tho_xam)$/, chupanh: /^(nhiep_anh|fl_video|phong_vien)$/,
    nauan: /^(dau_bep|chu_quan_an|chu_nha_hang|kd_quan)$/, doc: /^(phong_vien|bien_kich|giao_vien|giang_vien|nghien_cuu|fl_content|luat_su)$/, kpop: /^(vu_cong|ca_si|fl_dich|tk_thoi_trang)$/, bongda: /^(vdv|hlv_tt|pt_gym)$/ };
  // +1: đúng sở trường / đam mê · −1: có sở trường rõ rệt nhưng làm việc chẳng liên quan · 0: bình thường
  function fitOf(l, c) {
    if (!c || c.sec === 'crime' || /^(phu_giup|xkld|scam_kh)$/.test(c.id)) return 0;
    var t = l.talent, hb = l.hobby;
    if (t && (c.talent === t || (FIT[t] && FIT[t].test(c.id)))) return 1;
    if (hb && HOB_JOB[hb] && HOB_JOB[hb].test(c.id) && (l.hobbySk || 0) >= 30) return 1;
    if ((t && (l.skill || 0) >= 30) || (hb && (l.hobbySk || 0) >= 45)) return -1;
    return 0;
  }
  E.jobFit = fitOf;
  // chứng chỉ ngoại ngữ còn hạn: được trả thêm ở nghề văn phòng, dịch vụ, giáo dục…
  var EXPIRE = { en: 2, ko: 2, zh: 2 }; // IELTS, TOPIK, HSK có giá trị 2 năm; JLPT, Goethe không thời hạn
  function certValid(l, k) { return !!(l.lang && l.lang[k]) && !(l.langExp && l.langExp[k]) && (!EXPIRE[k] || !l.langAt || l.langAt[k] == null || l.age - l.langAt[k] < EXPIRE[k]); }
  E.certValid = certValid;
  E.certBonus = function (l, c) {
    if (!c || c.sec === 'crime' || c.fame) return 1;
    var k = 1, en = (l.lang && l.lang.en) || 0, office = /^(office|service|edu|law|state|media|free|sale|med)$/.test(c.cat);
    if (office && en >= 3 && certValid(l, 'en')) k *= en >= 4 ? 1.1 : 1.06;
    if (office && ['ja', 'ko', 'zh', 'de'].some(function (x) { return ((l.lang && l.lang[x]) || 0) >= 3 && certValid(l, x); })) k *= 1.04;
    return k;
  };
  // người làm công ăn lương ở khu vực chính thức đóng BHXH 8% · BHYT 1,5% · BHTN 1% (tối đa trên 46,8 triệu/tháng)
  function insured(l) {
    var c = jobC(l);
    return !!(c && (E.pensionCovered ? E.pensionCovered(l, c) : c.sec === 'formal' && H.isEmployee(l)) && c.id !== 'xkld' && !l.pensioned && !(l.flags.military && l.age < l.flags.military) && !(l.abroad && !l.abroad.perm) && !(l.jailUntil != null && l.age < l.jailUntil));
  }
  E.insured = insured;
  function siRate(l) { return H.inVN(l) ? 0.105 : 0.08; }
  E.siLabel = function (l) { return H.inVN(l) ? 'BHXH, BHYT, BHTN' : 'bảo hiểm xã hội & y tế'; };
  var LVN = ['Mới tập', 'Làm quen', 'Khá', 'Giỏi', 'Rất giỏi', 'Xuất sắc', 'Tinh anh', 'Chuyên nghiệp', 'Bậc thầy', 'Huyền thoại'];
  function tLevel(sk) { return Math.min(10, 1 + Math.floor((sk || 0) / 10)); }
  E.talentLevel = function (l, sk) { var s = sk == null ? (l.skill || 0) : sk, lv = tLevel(s); return { lv: lv, name: LVN[lv - 1], exp: lv >= 10 ? 100 : Math.round((s % 10) * 10), next: lv >= 10 ? null : LVN[lv] }; };

  var cy0 = E.careerYear;
  E.careerYear = function (l, r, log, focus) {
    var c0 = jobC(l), job0 = l.job, ins0 = insured(l), rent = l.rentVeh;
    var inc = cy0.apply(this, arguments);
    if (!l.alive) return inc;
    var y = l.yr || (l.yr = { items: [] });
    y.gross = 0; y.si = 0;
    if (!c0 || !(inc > 0)) return inc;
    // thuê ô tô chạy dịch vụ thì chở được khách đi xa, cuốc xe giá cao hơn chạy xe máy
    if (rent && rent.car && E.wealth.isDriver(l)) inc *= 1.6;
    // năng suất theo sở trường
    var fit = fitOf(l, c0);
    if (c0.sec !== 'crime') {
      if (fit > 0) { inc *= 1.04 + tLevel(l.skill) * 0.012; fx(l, { hap: 1.5 }); if (l.mind) l.mind.stress -= 3; }
      else if (fit < 0) { inc *= 0.96; fx(l, { hap: -1 }); if (l.mind) l.mind.stress += 4; }
    }
    if (job0 && fit !== 0 && !job0.fitNoted && l.job === job0) {
      job0.fitNoted = true;
      var tw = l.talent ? E.talentText(l) : (l.hobby && hobbyName(l)) || 'sở thích của bạn';
      log(fit > 0 ? 'Công việc ' + E.jobTitle(l) + ' đúng sở trường (' + tw + ') — làm việc say mê, ' + (H.isEmployee(l) ? (E.hasBoss && !E.hasBoss(l) ? 'năng suất cao, cả đơn vị nể phục.' : 'năng suất cao hơn đồng nghiệp, được cấp trên để ý.') : 'làm ra sản phẩm tốt, khách hàng tin tưởng quay lại.') : 'Công việc ' + E.jobTitle(l) + ' chẳng liên quan gì đến ' + tw + ' — đi làm chủ yếu vì đồng lương, nhiều hôm chán nản, dễ căng thẳng.', fit > 0 ? 'good' : 'neutral');
    }
    y.gross = inc;
    if (ins0 && (!l.si || l.si.last !== l.age)) {
      var capY = V(l, 46.8 * 12), basis = Math.min(inc, capY), si = basis * siRate(l);
      inc -= si; y.si = si;
      l.si = l.si || { yrs: 0, sum: 0 }; l.si.yrs++; l.si.sum += basis; l.si.last = l.age; l.si.m = basis / 12;
      if (l.si.yrs === 1) log('Được ký hợp đồng lao động chính thức, đóng ' + E.siLabel(l) + ' — đủ 15 năm đóng sẽ có lương hưu.', 'neutral');
    }
    // vừa mất việc mà đã đóng BHTN: nhận trợ cấp thất nghiệp 60% lương, 3–12 tháng
    if (ins0 && H.inVN(l) && !l.job && !l.retired && l.si && l.si.yrs >= 1 && l.alive) {
      var months = Math.min(12, Math.max(3, l.si.yrs)), ben = l.si.m * 0.6 * months;
      H.cash(l, ben, 'Trợ cấp thất nghiệp (BHTN)');
      log('Làm thủ tục nhận trợ cấp thất nghiệp: ' + mo(l, l.si.m * 0.6) + '/tháng trong ' + months + ' tháng, trong lúc tìm việc mới.', 'neutral');
    }
    return inc;
  };
  // người có bằng thạc sĩ / tiến sĩ được mời vào vị trí lương cao tương xứng
  var off0 = E.offers;
  E.offers = function (l, r) {
    var o = off0.apply(this, arguments);
    if (l.edu >= 6 && o.length && E.jobEligible) {
      var est = function (id) { var c = E.CAR[id]; return E.monthlyEst(l, id, E.startRank(l, c)); };
      var cands = Object.keys(E.CAR).filter(function (id) { var c = E.CAR[id]; return c.edu >= 5 && o.indexOf(id) < 0 && E.jobEligible(l, c); });
      if (l.edu >= 7) { var ac = cands.filter(function (id) { return /^(giang_vien|nghien_cuu)$/.test(id); }); if (ac.length) cands = ac.concat(cands.filter(function (id) { return ac.indexOf(id) < 0; })); }
      else cands.sort(function (a, b) { return est(b) - est(a); });
      if (cands.length) {
        var acad = l.edu >= 7 && /^(giang_vien|nghien_cuu)$/.test(cands[0]), best = acad ? cands[0] : cands[Math.floor(r() * Math.min(4, cands.length))];
        var low = o.slice().sort(function (a, b) { return est(a) - est(b); })[0];
        if (acad || est(best) > est(low)) o[o.indexOf(low)] = best; // tiến sĩ luôn có lời mời từ trường đại học / viện nghiên cứu
      }
    }
    return o;
  };
  var oh0 = E.offerHint;
  E.offerHint = function (l, id) {
    var s = oh0.apply(this, arguments), c = E.CAR[E.resolveJob(id)];
    if (!c) return s;
    var fake = { job: { id: id, rank: 0 } }; for (var k in l) if (!(k in fake)) fake[k] = l[k];
    if (fitOf(l, c) > 0) s += ' · đúng sở trường';
    if (E.pensionCovered ? E.pensionCovered(fake, c) : c.sec === 'formal' && H.isEmployee(fake)) s += ' · có đóng ' + E.siLabel(l);
    return s;
  };
  // BHYT chi trả phần lớn viện phí
  function bhyt(l) { return isVN(l) ? (insured(l) || l.age < 6 || l.age >= 75 || l.fam.q <= 1 || l.pensioned || !!l.school || !!l.flags.bhytVol) : l.gdp > 25; }
  E.hasBHYT = bhyt;
  var ta0 = E.DEC.treat.apply;
  E.DEC.treat.apply = function (l, d, k, r, log) {
    var m0 = l.money, x = ta0.apply(this, arguments), spent = m0 - l.money;
    var share = E.bhytShare ? E.bhytShare(l) : (bhyt(l) ? 0.8 : 0), priv = k === 'best' && d.data && d.data.priv;
    if (spent > 0 && share > 0 && priv) { H.cash(l, spent * share, H.inVN(l) ? 'BHYT chi trả phần viện phí chuẩn' : 'Bảo hiểm chi trả phần chuẩn'); }
    else if (spent > 0 && share > 0) { var back = spent * share; H.cash(l, back, H.inVN(l) ? 'BHYT chi trả viện phí' : 'Bảo hiểm y tế chi trả'); log('Viện phí ' + mo(l, spent) + ': ' + (H.inVN(l) ? 'BHYT' : 'bảo hiểm') + ' chi trả ' + Math.round(share * 100) + '% (' + mo(l, back) + '), bạn trả ' + mo(l, spent - back) + '.', 'good'); }
    return x;
  };

  // ===================================================================
  // 5. BẰNG LÁI & CHỨNG CHỈ HẾT HẠN
  // ===================================================================
  function stampLic(l, had) { l.licAt = l.licAt || {}; ['A1', 'A', 'B'].forEach(function (k) { if (l.lic[k] && !(had && had[k])) l.licAt[k] = l.age; }); }
  if (E.DEC.bang_lai) { var bl0 = E.DEC.bang_lai.apply; E.DEC.bang_lai.apply = function (l) { var had = {}; for (var k in l.lic) had[k] = l.lic[k]; var x = bl0.apply(this, arguments); stampLic(l, had); if (l.lic.B) l.flags.licDue = false; return x; }; }
  var sl0 = H.studyLang;
  H.studyLang = function (l, k) { var v0 = (l.lang && l.lang[k]) || 0, x = sl0.apply(this, arguments); if (((l.lang && l.lang[k]) || 0) > v0) { (l.langAt = l.langAt || {})[k] = l.age; if (l.langExp) l.langExp[k] = false; } return x; };
  SC('gplx_het_han', {
    title: 'Bằng lái ô tô hết hạn',
    valid: function (l) { return !!(l.lic && l.lic.B && l.licAt && l.licAt.B != null && l.age - l.licAt.B >= 10); },
    text: function (l) { return (H.inVN(l) ? 'Bằng lái ô tô hạng B của bạn (cấp năm ' + yr(l, l.licAt.B) + ') đã hết hạn 10 năm. Bằng xe máy A1 / A dùng vĩnh viễn, còn bằng ô tô muốn lái tiếp phải khám sức khỏe và làm thủ tục đổi bằng.' : 'Bằng lái ô tô của bạn (cấp năm ' + yr(l, l.licAt.B) + ') đã đến kỳ gia hạn 10 năm. Muốn lái tiếp phải kiểm tra sức khỏe và làm thủ tục đổi bằng.') + (l.veh === 'ô tô' ? ' Bạn đang đi ' + (l.vehName || 'ô tô') + '.' : ''); },
    opts: [
      { k: 'renew', l: 'Đi khám sức khỏe, đổi bằng mới', h: function (l) { return 'Lệ phí đổi bằng và khám sức khỏe khoảng ' + mo(l, V(l, 0.7)); }, ai: function (l) { return l.veh === 'ô tô' || l.age < 65 ? 2 : 0.4; }, run: function (l, r, log) {
        l.flags.licDue = false;
        if (l.st.hea < 25 || l.age >= 85) { l.lic.B = false; log('Khám sức khỏe không đạt yêu cầu lái ô tô — bằng không được đổi.', 'bad'); return; }
        H.cash(l, -V(l, 0.7), 'Đổi bằng lái ô tô'); l.licAt.B = l.age; log('Đổi bằng lái ' + (H.inVN(l) ? 'hạng B ' : 'ô tô ') + 'thành công, có giá trị thêm 10 năm (đến năm ' + yr(l, l.age + 10) + ').', 'good');
      } },
      { k: 'no', l: 'Không đổi nữa, ít khi lái ô tô', ai: function (l) { return l.veh === 'ô tô' ? 0.1 : l.age >= 65 ? 2 : 0.6; }, run: function (l, r, log) { l.flags.licDue = false; l.lic.B = false; l.flags.licExpB = yr(l); log('Để bằng lái ô tô hết hạn' + (l.veh === 'ô tô' ? ' — từ giờ cầm lái là lái xe không có bằng hợp lệ, dễ bị phạt nặng.' : '.'), 'neutral'); } }
    ]
  });
  var CERTN = { en: 'IELTS', ko: 'TOPIK', zh: 'HSK' };
  function certText(l, k) { return H.langCert(l, k); }
  SC('chung_chi_het_han', {
    title: function (l, d) { return 'Chứng chỉ ' + CERTN[d.k] + ' hết hạn'; },
    prep: function (l, r, arg) { return arg && arg.k ? arg : { k: 'en' }; },
    valid: function (l, d) { var k = (d && d.k) || 'en'; return !!(l.lang && l.lang[k]) && !(l.langExp && l.langExp[k]) && l.langAt && l.langAt[k] != null && l.age - l.langAt[k] >= 2; },
    text: function (l, d) { return 'Chứng chỉ ' + certText(l, d.k) + ' của bạn đã hết hạn (chỉ có giá trị 2 năm). Trình độ thì vẫn còn, nhưng nộp hồ sơ xin việc, du học hay định cư phải có chứng chỉ còn hạn. Bạn có muốn thi lại không?'; },
    opts: [
      { k: 'retest', l: 'Đăng ký thi lại', h: function (l, d) { return 'Lệ phí thi khoảng ' + mo(l, V(l, d.k === 'en' ? 4.7 : 1.6)); }, ai: function (l) { return l.age < 40 ? 1.5 : 0.5; }, run: function (l, r, log, d) {
        var k = d.k; H.cash(l, -V(l, k === 'en' ? 4.7 : 1.6), 'Thi lại ' + CERTN[k]);
        var v = l.lang[k], x = r() + (l.st.kno - 60) / 200, max = H.LANG[k].lv.length;
        if (x > 0.85 && v < max) l.lang[k] = v + 1; else if (x < 0.15 && v > 1) l.lang[k] = v - 1;
        (l.langAt = l.langAt || {})[k] = l.age; (l.langExp = l.langExp || {})[k] = false; (l.flags.certDue = l.flags.certDue || {})[k] = false;
        log('Thi lại ' + CERTN[k] + ': đạt ' + certText(l, k) + (l.lang[k] > v ? ' — cao hơn lần trước!' : l.lang[k] < v ? ' — thấp hơn lần trước vì lâu không dùng.' : '.') , l.lang[k] >= v ? 'good' : 'neutral');
      } },
      { k: 'no', l: 'Thôi, không cần nữa', ai: function (l) { return l.age >= 40 ? 1.5 : 0.6; }, run: function (l, r, log, d) { (l.langExp = l.langExp || {})[d.k] = true; (l.flags.certDue = l.flags.certDue || {})[d.k] = false; log('Để chứng chỉ ' + CERTN[d.k] + ' hết hạn.', 'neutral'); } }
    ]
  });
  function certMatters(l) { var c = jobC(l); return l.age <= 45 && (!!l.school || !l.job || !!(c && /^(office|service|edu|law|state|media|free|sale|med)$/.test(c.cat)) || !!(l.abroad && l.abroad.study)); }

  // ===================================================================
  // 6. XE CỘ: xăng đổ hằng tuần, thuê xe chạy dịch vụ
  // ===================================================================
  // tiền xăng (hoặc sạc) mỗi tuần, triệu đồng
  function fuelWeek(l) {
    if (l.age < 16 && l.veh !== 'xe đạp') return 0;
    var k = l.vehK || '', s = l.vehSeg || '', ev = /^(vf3|vf5|vf7|vf8|evo|feliz|theon|yadea)$/.test(k) || /điện/.test(l.vehName || ''), w;
    if (l.veh === 'ô tô') w = ev ? 0.13 : s === 'super' || (l.vehTier || 1) >= 4 ? 0.95 : s === 'sport' || (l.vehTier || 1) === 3 ? 0.6 : (l.vehTier || 1) === 2 ? 0.5 : /^(fortuner|everest)$/.test(k) ? 0.45 : 0.36;
    else if (l.veh === 'xe máy') w = ev ? 0.025 : k === 'z900' ? 0.25 : s === 'con' ? 0.1 : s === 'ga' ? 0.09 : 0.07;
    else if (l.veh === 'xe đạp') w = 0;
    else w = l.urban ? 0.1 : 0.05; // xe buýt, xe ôm, đi nhờ
    if (l.age >= 70) w *= 0.5;
    return w;
  }
  E.fuelWeek = function (l) { return V(l, fuelWeek(l)); };
  E.travelCost = function (l, b, a) {
    var fw = fuelWeek(l), fix;
    if (l.veh === 'ô tô') fix = 1.56 + (l.vehVal ? Math.min(l.vehVal * 0.012, vnd(l) ? 60 : l.vehVal) : 6) + (l.urban ? 14 : 2) + 6; // phí đường bộ, bảo hiểm thân vỏ, gửi xe, bảo dưỡng
    else if (l.veh === 'xe máy') fix = 0.1 + (l.urban ? 1.2 : 0.2) + 0.8; // bảo hiểm bắt buộc, gửi xe, thay nhớt
    else if (l.veh === 'xe đạp') fix = 0.3;
    else fix = 0;
    var tot = V(l, fw * 52 + fix);
    var R = l.rentVeh; if (R) tot += (R.fee + R.fuel) * 12;
    if (!vnd(l)) tot = Math.max(tot * 0.8, (l.veh === 'ô tô' ? b * 0.12 : l.veh === 'xe máy' ? b * 0.03 : b * 0.01));
    return tot;
  };
  var RENT = [
    { k: 'xsm_car', n: 'VinFast VF 5 (taxi điện Xanh SM)', fee: 7.5, fuel: 1.5, ev: true, car: true, lic: 'B', h: 'Thuê ~7,5 triệu/tháng · sạc điện ~1,5 triệu/tháng · cuốc ô tô giá cao hơn xe máy' },
    { k: 'grab_car', n: 'Toyota Vios (chạy Grab, Be)', fee: 9, fuel: 5, ev: false, car: true, lic: 'B', h: 'Thuê ~9 triệu/tháng · tự đổ xăng ~5 triệu/tháng' },
    { k: 'xsm_bike', n: 'xe máy điện VinFast (Xanh SM Bike)', fee: 1.2, fuel: 0.25, ev: true, car: false, lic: 'A1', h: 'Thuê ~1,2 triệu/tháng · sạc ~250 nghìn/tháng · không tốn xăng' }
  ];
  SC('thue_xe', {
    title: 'Thuê xe chạy dịch vụ', valid: function (l) { return E.wealth.isDriver(l) && !l.rentVeh; },
    text: function (l) { return 'Thay vì bỏ khoản tiền lớn mua xe, nhiều tài xế thuê xe theo tháng để chạy ' + (H.inVN(l) && yr(l) >= 2023 ? 'Xanh SM, Grab, Be' : H.inVN(l) && yr(l) >= 2014 ? 'Grab, dịch vụ gọi xe' : 'dịch vụ gọi xe') + '. Xe điện thì phải bảo dưỡng định kỳ, hai năm kiểm tra / thay pin một lần; xe xăng thì tự đổ xăng.'; },
    opts: RENT.map(function (x) {
      return { k: x.k, l: function (l) { var nm = H.inVN(l) && yr(l) >= 2023 ? x.n : x.k === 'xsm_car' ? 'ô tô điện chạy dịch vụ' : x.k === 'grab_car' ? (H.inVN(l) && yr(l) >= 2014 ? x.n : 'ô tô sedan chạy dịch vụ') : 'xe máy điện chạy dịch vụ'; return 'Thuê ' + nm; }, h: function (l) { return vnd(l) && H.inVN(l) ? x.h : 'Tiền thuê ~' + mo(l, V(l, x.fee)) + '/tháng · ' + (x.ev ? 'sạc' : 'xăng') + ' ~' + mo(l, V(l, x.fuel)) + '/tháng'; },
        req: function (l) { return !!l.lic[x.lic]; }, ai: { w: x.car ? 1 : 0.8 },
        run: function (l, r, log) { var nm = H.inVN(l) && yr(l) >= 2023 ? x.n : x.k === 'xsm_car' ? 'ô tô điện chạy dịch vụ' : x.k === 'grab_car' ? (H.inVN(l) && yr(l) >= 2014 ? x.n : 'ô tô sedan chạy dịch vụ') : 'xe máy điện chạy dịch vụ'; l.rentVeh = { k: x.k, n: nm, fee: V(l, x.fee), fuel: V(l, x.fuel), ev: x.ev, car: x.car, since: l.age, bat: l.age }; log('Thuê ' + nm + ' theo tháng để chạy dịch vụ.', 'good'); fx(l, { hap: 2 }); } };
    }).concat([{ k: 'no', l: 'Thôi, chạy xe của mình', ai: { w: 0.8 }, run: function () { } }])
  });
  SC('tra_xe_thue', {
    title: 'Trả xe thuê', valid: function (l) { return !!l.rentVeh; },
    text: function (l) { return 'Bạn đang thuê ' + l.rentVeh.n + ', mỗi tháng tốn ' + mo(l, l.rentVeh.fee + l.rentVeh.fuel) + ' cả tiền thuê lẫn ' + (l.rentVeh.ev ? 'sạc' : 'xăng') + '.'; },
    opts: [{ k: 'return', l: 'Trả xe, không thuê nữa', run: function (l, r, log) { log('Trả lại ' + l.rentVeh.n + '.', 'neutral'); l.rentVeh = null; } }, { k: 'keep', l: 'Tiếp tục thuê', run: function () { } }]
  });
  A('tra_xe_thue', 'Tiền bạc', 'Trả xe đang thuê', { min: 18, avail: function (l) { return l.rentVeh ? true : 'Không thuê xe'; } });

  // ===================================================================
  // 7. MUA SẮM HỢP TUỔI, TÌM NGƯỜI YÊU HỢP TUỔI, HẸN HÒ QUA ỨNG DỤNG
  // ===================================================================
  function itemsFor(l) {
    var a = l.age, F = l.sex === 'F', pw = H.parentsWord ? H.parentsWord(l) : '';
    if (a < 30) return [['chiếc iPhone đời mới nhất', 0.3], ['chiếc xe tay ga SH', 1], [F ? 'chiếc túi hàng hiệu' : 'đôi giày sneaker bản giới hạn', F ? 0.4 : 0.12], ['bộ máy tính chơi game xịn', 0.35], ['chiếc đồng hồ thông minh', 0.1], ['chiếc máy ảnh để quay vlog', 0.25]];
    if (a < 50) return [['chiếc tivi to cho cả nhà', 0.15], ['chiếc đồng hồ hàng hiệu', 0.6], ['bộ sofa da mới', 0.3], ['chiếc máy rửa bát và robot hút bụi', 0.2], ['chiếc xe đạp thể thao', 0.15], [F ? 'chiếc túi hàng hiệu' : 'bộ gậy golf', 0.4]].concat(pw ? [['chiếc ghế massage cho ' + pw, 0.5]] : []);
    return [['chiếc ghế massage toàn thân', 0.5], ['chiếc máy lọc không khí, lọc nước', 0.12], ['bộ ấm chén, tranh treo phòng khách', 0.2], ['chiếc đồng hồ hàng hiệu', 0.6], ['chiếc tivi màn hình lớn để xem thời sự', 0.15]];
  }
  if (E.DEC.mua_sam) {
    var MS = E.DEC.mua_sam.def;
    MS.prep = function (l, r) { var it = pick(r, itemsFor(l)); return { n: it[0], p: it[1] }; };
    MS.valid = function (l) { return l.money < l.base * 25; }; // giàu có thì chẳng còn là "cơn thèm" phải cân nhắc
    MS.text = function (l, d) { var a = l.age; return 'Bạn rất muốn mua ' + d.n + ' (khoảng ' + H.mb(l, d.p) + '). ' + (a < 30 ? 'Bạn bè ai cũng có.' : a < 50 ? 'Quảng cáo cứ hiện lên mỗi lần lướt mạng.' : 'Con cháu bảo cứ mua đi cho sướng tuổi già.') + ' Trong tài khoản hiện có ' + H.money(l, l.money) + '.'; };
    MS.opts.forEach(function (o) {
      if (/^(card|paylater|appden)$/.test(o.k)) { var rq = o.req; o.req = function (l, d) { return l.money < d.p * l.base && (!rq || rq(l, d)); }; } // đủ tiền thì không ai đi vay
      if (o.k === 'save') { o.l = function (l, d) { return l.money >= d.p * l.base ? 'Thôi, không thật sự cần' : 'Để dành, khi nào đủ tiền mới mua'; }; }
    });
  }
  var DAT = {
    tinder: { n: 'Tinder', h: 'Đông người dùng nhất, quẹt nhanh — nhiều người chỉ tìm vui qua đường', p: 0.55, hook: 0.35, scam: 0.06, ok: function (l) { return l.age <= 45; } },
    bumble: { n: 'Bumble', h: 'Con gái nhắn tin trước, ít bị làm phiền', p: 0.5, hook: 0.12, scam: 0.04, ok: function (l) { return l.age <= 45; } },
    hinge: { n: 'Hinge', h: '"Ứng dụng sinh ra để được xóa" — hợp người muốn yêu nghiêm túc', p: 0.5, hook: 0.05, scam: 0.03, serious: 1, ok: function (l) { return l.age >= 20 && l.age <= 45; } },
    fb: { n: 'Facebook Hẹn hò', h: 'Gợi ý theo bạn chung, nhiều người ở gần', p: 0.45, hook: 0.08, scam: 0.08, ok: function (l) { return l.age <= 65; } },
    blued: { n: 'Blued', h: 'Ứng dụng hẹn hò dành cho nam đồng tính, song tính', p: 0.6, hook: 0.4, scam: 0.05, ok: function (l) { return l.sex === 'M' && l.orient !== 'straight' && l.age <= 55; } },
    her: { n: 'HER', h: 'Ứng dụng dành cho nữ đồng tính, song tính', p: 0.5, hook: 0.08, scam: 0.03, ok: function (l) { return l.sex === 'F' && l.orient !== 'straight' && l.age <= 55; } },
    trung_nien: { n: 'nhóm kết bạn tuổi trung niên trên mạng xã hội', h: 'Nhiều người cùng cảnh, nhưng cũng nhiều kẻ lừa tình', p: 0.4, hook: 0, scam: 0.15, ok: function (l) { return l.age >= 45; } }
  };
  SC('app_hen_ho', {
    title: 'Chọn ứng dụng hẹn hò', valid: function (l) { return !l.partner && l.age >= 18; },
    text: function (l) { return l.age >= 45 ? 'Con cái khuyên bạn thử kết bạn trên mạng. Bạn chọn cách nào?' : 'Bạn tải vài ứng dụng hẹn hò về máy. Mỗi app một kiểu người dùng:'; },
    opts: Object.keys(DAT).map(function (k) {
      var x = DAT[k];
      return { k: k, l: U.cap(x.n), h: x.h, req: function (l) { return x.ok(l); }, ai: { w: x.serious ? 1 : 0.9, risk: x.hook > 0.2 ? 0.6 : 0 }, run: function (l, r, log) { appDate(l, r, log, k); } };
    }).concat([{ k: 'no', l: 'Thôi, xóa app', ai: { w: 0.2 }, run: function (l, r, log) { log('Tải về rồi lại xóa, thấy không hợp với mình.', 'neutral'); } }])
  });
  function appDate(l, r, log, k) {
    var x = DAT[k], y = r();
    if (y < x.scam) { H.cash(l, -l.base * 0.1, 'Bị lừa tình qua mạng'); log('Quen một "người tình" trên ' + x.n + ', được hứa gửi quà từ nước ngoài rồi bị bắt chuyển "phí hải quan". Mất tiền, mất niềm tin.', 'bad'); fx(l, { hap: -8 }); return; }
    if (y < x.scam + x.p) {
      var ps = H.partnerSex(l, r), nm = H.stranger(l, r, ps);
      if (l.age <= 45 && ch(r, x.hook)) { l.pending.unshift(E.DEC.qua_dem.make(l, r, { app: x.n, name: nm })); return; }
      l.pending.unshift(E.DEC.love.make(l, r, { where: 'qua ' + x.n }));
      return;
    }
    log('Quẹt ' + x.n + ' mỏi tay, nhắn được vài người rồi im bặt.', 'neutral');
  }
  SC('qua_dem', {
    title: function (l, d) { return 'Hẹn gặp qua ' + d.app; },
    prep: function (l, r, arg) { return arg && arg.name ? arg : { app: 'Tinder', name: H.stranger(l, r, H.partnerSex(l, r)) }; },
    valid: function (l) { return l.age >= 18; },
    text: function (l, d) { return 'Nói chuyện vài hôm trên ' + d.app + ', ' + d.name + ' rủ bạn đi chơi tối nay rồi "về chỗ mình".'; },
    opts: [
      { k: 'safe', l: 'Đi, nhưng nhất định dùng bao cao su', ai: { w: 1.2, smart: 0.6 }, run: function (l, r, log, d) { log('Một đêm vui với ' + d.name + ', cả hai đều cẩn thận.', 'neutral'); fx(l, { hap: 3 }); if (ch(r, 0.25)) l.pending.unshift(E.DEC.love.make(l, r, { where: 'qua ' + d.app + ' — từ một buổi hẹn tưởng chỉ qua đường' })); } },
      { k: 'unsafe', l: 'Đi luôn, không phòng bị gì', h: 'Nguy cơ bệnh lây qua đường tình dục, HIV', ai: { risk: 1.2, smart: -1, w: 0.5 }, run: function (l, r, log, d) {
        l.flags.unsafe = (l.flags.unsafe || 0) + 1; fx(l, { hap: 3 });
        if (ch(r, 0.1)) { log('Vài tuần sau thấy khó chịu, đi khám thì mắc bệnh lây qua đường tình dục — may là chữa khỏi được. Bác sĩ dặn đi xét nghiệm HIV định kỳ.', 'bad'); fx(l, { hea: -4, hap: -4 }); H.cash(l, -l.base * 0.02, 'Khám chữa bệnh'); }
        else log('Một đêm "phiêu" với ' + d.name + ' mà không phòng bị gì.', 'neutral');
      } },
      { k: 'coffee', l: 'Chỉ đi cà phê làm quen thôi', ai: { w: 1 }, run: function (l, r, log, d) { if (ch(r, 0.4)) l.pending.unshift(E.DEC.love.make(l, r, { where: 'qua ' + d.app })); else log('Đi cà phê với ' + d.name + ', nói chuyện vui nhưng không thấy "rung động".', 'neutral'); } },
      { k: 'no', l: 'Thôi, không gặp', ai: { w: 0.6 }, run: function (l, r, log) { log('Từ chối khéo rồi xóa app.', 'neutral'); } }
    ]
  });
  if (E.DEC.tim_nguoi_yeu) {
    var TN = E.DEC.tim_nguoi_yeu.def, oldOpts = TN.opts, ob = function (k) { return oldOpts.filter(function (o) { return o.k === k; })[0]; };
    TN.text = function (l) {
      var a = l.age;
      return a < 30 ? 'Bạn bè lần lượt có đôi. Bạn quyết định chủ động tìm một nửa của mình.' : a < 45 ? 'Bạn bè đã yên bề gia thất, ' + (l.fam.mAlive || l.fam.fAlive ? 'bố mẹ giục mãi chuyện lập gia đình' : 'căn nhà đi làm về vắng tanh') + '. Bạn quyết định chủ động hơn.' : a < 60 ? 'Sau nhiều năm một mình, bạn muốn tìm một người cùng đi nốt quãng đường còn lại.' : 'Tuổi xế chiều, con cháu bận rộn, bạn muốn có một người bầu bạn sớm hôm.';
    };
    TN.opts = [
      { k: 'app', l: function (l) { return l.age >= 45 ? 'Kết bạn qua mạng (' + (H.inVN(l) && yr(l) >= 2013 ? 'Facebook Hẹn hò, nhóm Zalo…' : 'nhóm kết bạn trực tuyến…') + ')' : 'Dùng ứng dụng hẹn hò (Tinder, Bumble…)'; }, req: function (l) { return l.age >= 18 && l.age <= 70; }, ai: { risk: 0.6 }, run: function (l, r, log) { l.pending.unshift(E.DEC.app_hen_ho.make(l, r)); } },
      ob('match'),
      { k: 'work', l: function (l) { return l.age >= 60 || l.retired ? 'Tham gia câu lạc bộ dưỡng sinh, hội người cao tuổi' : l.school ? 'Để ý một người ở trường' : 'Để ý một người ở chỗ làm'; }, ai: { w: 1 }, run: function (l, r, log) { var where = l.age >= 60 || l.retired ? 'ở câu lạc bộ dưỡng sinh' : l.school ? 'ở trường' : 'ở chỗ làm'; if (ch(r, 0.55)) l.pending.unshift(E.DEC.love.make(l, r, { where: where })); else log(l.age >= 60 ? 'Đi sinh hoạt đều đặn, vui là chính, chưa gặp ai hợp.' : 'Người ấy đã có người yêu.', 'neutral'); } },
      { k: 'club', l: function (l) { return l.age >= 50 ? 'Đi khiêu vũ, sinh hoạt câu lạc bộ' : 'Đi bar, câu lạc bộ, sự kiện'; }, ai: { soc: 1.2, cost: 0.05 }, run: function (l, r, log) { H.cash(l, -l.base * 0.03, 'Đi chơi'); if (ch(r, 0.4)) l.pending.unshift(E.DEC.love.make(l, r, { where: l.age >= 50 ? 'ở lớp khiêu vũ' : 'trong một buổi tiệc' })); else log('Một buổi tối vui, nhưng không thêm số điện thoại nào.', 'neutral'); } }
    ].filter(Boolean);
  }

  // ===================================================================
  // 8. GAME HỢP TUỔI
  // ===================================================================
  function ageGame(l, r) {
    var a = l.age, c = jobC(l);
    if (l.game && (a < 30 || (c && /^(esport|creator)$/.test(c.cat)) || (l.talent === 'game' && a < 40))) return l.game;
    return pick(r, a < 12 ? ['Minecraft', 'Roblox', 'Play Together', 'Liên Quân Mobile'] : a < 18 ? ['Liên Quân Mobile', 'Free Fire', 'PUBG Mobile', 'Roblox', 'Minecraft', 'FC Online'] :
      a < 30 ? ['Liên Minh Huyền Thoại', 'Valorant', 'FC Online', 'PUBG', 'Liên Quân Mobile', 'Genshin Impact'] : a < 45 ? ['FC Online', 'Liên Minh Huyền Thoại', 'Đế Chế (Age of Empires)', 'game đua xe', 'Call of Duty'] :
      a < 60 ? (H.inVN(l) || /^(CN|TW|SG|MY)$/.test(H.resCode(l)) ? ['cờ tướng online', 'Tiến lên miền Nam', 'FC Online', 'Đế Chế (Age of Empires)', 'Candy Crush'] : ['cờ vua online', 'bài Solitaire', 'FC Online', 'Age of Empires', 'Candy Crush']) : (H.inVN(l) || /^(CN|TW|SG|MY)$/.test(H.resCode(l)) ? ['cờ tướng online', 'Tiến lên miền Nam', 'Candy Crush', 'ô chữ, sudoku'] : ['cờ vua online', 'bài Solitaire', 'Candy Crush', 'ô chữ, sudoku']));
  }
  E.ageGame = ageGame;
  if (E.DEC.choi_game_nha) E.DEC.choi_game_nha.def.prep = function (l, r) { return { g: ageGame(l, r) }; };

  // ===================================================================
  // 9. ĐỘI, ĐOÀN (Việt Nam): khăn quàng đỏ từ lớp 3, không phải lớp 1
  // ===================================================================
  EV(function (l, a) { return H.inVN(l) && a === 8 && l.school === 'primary' && !l.flags.doi; }, 0.92, function (l, a, r, log) { l.flags.doi = true; log('Được kết nạp vào Đội Thiếu niên Tiền phong Hồ Chí Minh — lần đầu thắt chiếc khăn quàng đỏ lên vai.', 'good'); fx(l, { hap: 3 }); H.mem(l, 'Ngày được kết nạp Đội, mẹ là chiếc khăn quàng đỏ phẳng phiu.', 2); });
  EV(function (l, a) { return H.inVN(l) && a >= 16 && a <= 18 && (l.school === 'upper' || l.school === 'priv') && !l.flags.doan; }, 0.35, function (l, a, r, log) { l.flags.doan = true; log('Được kết nạp Đoàn Thanh niên Cộng sản Hồ Chí Minh, cài huy hiệu Đoàn lên áo.', 'good'); fx(l, { soc: 2 }); });

  // ===================================================================
  // 10. VÒNG NĂM: căng thẳng, năng khiếu, bằng lái, chứng chỉ, xe thuê, thu nhập chi tiết
  // ===================================================================
  E.stressLabel = function (s) { return s >= 85 ? 'báo động' : s >= 70 ? 'quá tải' : s >= 50 ? 'căng thẳng' : s >= 30 ? 'bình thường' : 'thư thái'; };
  // phân loại các khoản thu trong năm
  function incomeParts(l) {
    var y = l.yr || {}, F = l.fin || {}, items = y.items || [], P = { biz: 0, rent: 0, bonus: 0, family: 0, gov: 0, other: 0 };
    items.forEach(function (x) {
      var t = x.t || '';
      if (/^(Lãi|Lỗ) /.test(t) && !/tiết kiệm|chứng khoán|vàng|tiền mã hóa|đất nền/.test(t)) P.biz += x.v;
      else if (/^Tiền cho thuê/.test(t)) P.rent += x.v;
      else if (x.v > 0 && /[Tt]hưởng/.test(t)) P.bonus += x.v;
      else if (x.v > 0 && /chu cấp|tiêu vặt|lì xì|biếu/.test(t)) P.family += x.v;
      else if (x.v > 0 && /BHTN|BHYT|trợ cấp|Bảo hiểm/.test(t)) P.gov += x.v;
    });
    var rows = [], inc = F.inc || 0;
    if (y.gross > 0) { rows.push({ k: 'Lương / thu nhập từ công việc', v: y.gross }); if (y.si > 0) rows.push({ k: 'Đóng ' + E.siLabel(l) + ' (' + (H.inVN(l) ? '10,5%' : '8%') + ')', v: -y.si }); }
    else if (inc > 0) rows.push({ k: l.retired ? (l.pensioned ? 'Lương hưu & con cái biếu' : 'Trợ cấp & con cái biếu') : 'Thu nhập', v: inc });
    if (P.biz) rows.push({ k: 'Lợi nhuận kinh doanh (cửa hàng của bạn)', v: P.biz });
    if (P.rent) rows.push({ k: 'Tiền cho thuê nhà', v: P.rent });
    if (F.interest) rows.push({ k: F.interest >= 0 ? 'Lãi tiền gửi' : 'Lãi phải trả (tiêu lố)', v: F.interest });
    if (P.bonus) rows.push({ k: 'Tiền thưởng', v: P.bonus });
    if (P.family) rows.push({ k: 'Gia đình cho', v: P.family });
    if (P.gov) rows.push({ k: 'Bảo hiểm chi trả, trợ cấp', v: P.gov });
    if (F.partner) rows.push({ k: 'Bạn đời góp', v: F.partner });
    return rows;
  }
  E.incomeParts = incomeParts;
  E.incomeSrc = function (l, F, income) {
    var y = l.yr || {};
    return y.si > 0 ? ' (lương ' + mo(l, y.gross / 12) + '/tháng, đã trừ ' + E.siLabel(l) + ' ' + mo(l, y.si / 12) + '/tháng)' : '';
  };
  E.HOOKS.year.push(function (l, r, log, a, F) {
    if (!l.alive) return;
    var f = l.flags;
    // mẹ mang HIV: nhờ điều trị dự phòng, phần lớn trẻ không bị lây
    if (a === 0 && f.hivMomChecked == null) {
      f.hivMomChecked = true;
      var pMom = l.pool === 'afs' ? 0.12 : /^(af|et|ao)/.test(l.pool || '') ? 0.03 : isVN(l) ? 0.0015 : 0.001;
      if (ch(r, pMom)) {
        if (ch(r, l.gdp > 5 || l.urban ? 0.03 : 0.2)) { f.hivMom = true; l.ill = { n: 'HIV', m: 1.6, base: 0, cure: 0, mult: 1.6, f: 'HIV/AIDS', since: 0, chronic: true }; log('Mẹ mang HIV và bạn bị lây từ mẹ khi sinh — phải uống thuốc ARV hằng ngày từ bé.', 'bad'); }
        else log('Mẹ mang HIV nhưng được điều trị dự phòng lây truyền mẹ con — bạn chào đời khỏe mạnh, không bị lây.', 'neutral');
      }
    }
    if (l.addict && l.addict.drugs && f.inject == null && a >= 14) { f.inject = ch(r, 0.35); if (f.inject) log('Chuyển sang chích ma túy, dùng chung kim tiêm với bạn nghiện.', 'bad'); }
    if (l.addict && l.addict.drugs && f.inject) f.injYrs = (f.injYrs || 0) + 1;
    if (a === 18 && f.bhytVol == null) f.bhytVol = ch(r, 0.65);
    // nghiên cứu sinh có học bổng, trợ giảng
    if (l.school === 'phd') H.cash(l, l.base * 0.35, 'Học bổng & trợ giảng nghiên cứu sinh');
    // căng thẳng ảnh hưởng sức khỏe, các mối quan hệ; kéo dài thì dễ trầm cảm
    var M = l.mind;
    if (M && a >= 12) {
      if (M.stress >= 60) l.st.soc -= (M.stress - 55) / 12;
      if (M.stress >= 75 && l.partner && (f.fightAt == null || a - f.fightAt >= 3) && ch(r, 0.3)) { f.fightAt = a; log('Căng thẳng triền miên khiến bạn hay cáu gắt, ' + l.partner.name + ' nhiều lần giận dỗi bỏ về.', 'bad'); fx(l, { hap: -3, soc: -2 }); }
      M.hiYrs = M.stress >= 80 ? (M.hiYrs || 0) + 1 : 0;
      if (M.hiYrs >= 2 && (f.depAt == null || a - f.depAt >= 6) && ch(r, 0.35)) { f.depAt = a; log('Căng thẳng kéo dài nhiều năm: mất ngủ, chán ăn, không còn thấy vui với bất cứ điều gì — những dấu hiệu của trầm cảm.', 'bad'); H.sched(l, 'tram_cam', 1); }
    }
    // năng khiếu: rèn giũa thì lên cấp
    if (l.talent && a >= 6) {
      var c = jobC(l);
      if (!(c && (c.skillRank != null || c.fame))) {
        var g = c && fitOf(l, c) > 0 ? 1.2 : f.nk && !f.nk.stop ? 0 : a < 25 ? 0.5 : 0.15;
        l.skill = Math.min(100, (l.skill || 20) + g);
      }
      var lv = tLevel(l.skill);
      if (f.tLv == null) f.tLv = lv;
      else if (lv > f.tLv) { f.tLv = lv; if (lv >= 3) log('Năng khiếu ' + E.talentText(l) + ' lên cấp ' + lv + ' — "' + LVN[lv - 1] + '".', 'good'); }
    }
    // bằng lái: B hết hạn sau 10 năm
    l.licAt = l.licAt || {};
    ['A1', 'A', 'B'].forEach(function (k) { if (l.lic && l.lic[k] && l.licAt[k] == null) l.licAt[k] = a; });
    if (l.lic && l.lic.B && a - l.licAt.B >= 10 && !f.licDue && free(l)) { f.licDue = true; H.sched(l, 'gplx_het_han', 0); }
    // chứng chỉ ngoại ngữ hết hạn sau 2 năm
    l.langAt = l.langAt || {}; l.langExp = l.langExp || {};
    Object.keys(EXPIRE).forEach(function (k) {
      if (!(l.lang && l.lang[k])) return;
      if (l.langAt[k] == null) l.langAt[k] = a;
      if (!l.langExp[k] && a - l.langAt[k] >= EXPIRE[k]) {
        var due = f.certDue || (f.certDue = {});
        if (certMatters(l) && free(l)) { if (!due[k]) { due[k] = true; H.sched(l, 'chung_chi_het_han', 0, { k: k }); } }
        else { l.langExp[k] = true; log('Chứng chỉ ' + H.langCert(l, k) + ' hết hạn sau 2 năm — trình độ vẫn còn, nhưng muốn nộp hồ sơ thì phải thi lại.', 'neutral'); }
      }
    });
    // xe thuê: thôi chạy dịch vụ thì trả xe; xe điện 2 năm bảo dưỡng pin một lần
    var R = l.rentVeh;
    if (R) {
      if (!E.wealth.isDriver(l) || l.retired) { log('Không chạy dịch vụ nữa, trả lại ' + R.n + '.', 'neutral'); l.rentVeh = null; }
      else if (R.ev && a - R.bat >= 2) { R.bat = a; var bc = V(l, R.car ? 3 : 3.5); H.cash(l, -bc, R.car ? 'Bảo dưỡng 2 năm, kiểm tra pin xe điện' : 'Đổi pin xe máy điện'); log(R.car ? 'Tròn 2 năm thuê xe: đưa ' + R.n + ' đi bảo dưỡng, kiểm tra và cân bằng pin, tốn ' + mo(l, bc) + '.' : 'Pin xe máy điện chai sau 2 năm chạy liên tục, phải đổi pin mới ' + mo(l, bc) + '.', 'neutral'); }
    }
    // xe điện của mình: 3 năm thay / bảo dưỡng pin
    if (l.vehK && /^(evo|feliz|theon|yadea)$/.test(l.vehK)) { l.vehBat = l.vehBat == null ? a : l.vehBat; if (a - l.vehBat >= (l.vehBatN ? 4 : 3)) { l.vehBat = a; var pc = V(l, 4); H.cash(l, -pc, 'Thay pin xe máy điện'); l.vehBatN = (l.vehBatN || 0) + 1; log(l.vehBatN === 1 ? 'Pin ' + (l.vehName || 'xe máy điện') + ' chai sau 3 năm, thay pin mới hết ' + mo(l, pc) + '.' : U.pick(r, ['Lại đến kỳ thay pin ' + (l.vehName || 'xe máy điện') + ' (lần thứ ' + l.vehBatN + '), hết ' + mo(l, pc) + '.', 'Pin xe yếu dần, đi được nửa quãng đã báo hết — thay bộ pin mới ' + mo(l, pc) + '.', 'Cửa hàng kiểm tra pin ' + (l.vehName || 'xe máy điện') + ' thấy dung lượng còn thấp, thay mới hết ' + mo(l, pc) + '.']) , 'neutral'); } }
    // tổng thu nhập trong năm đến từ đâu (khi có nhiều nguồn)
    if (l.indep && F) {
      var rows = incomeParts(l).filter(function (x) { return !/^Bạn đời/.test(x.k); });
      var extra = rows.filter(function (x) { return (/kinh doanh|cho thuê/.test(x.k) && Math.abs(x.v) >= l.base * 0.05) || (/Lãi tiền gửi/.test(x.k) && x.v >= l.base * 0.3); });
      if (extra.length && rows.length >= 2) log('Thu nhập cả năm đến từ: ' + rows.map(function (x) { return x.k.replace(/ \(.*\)$/, '').toLowerCase() + ' ' + (x.v < 0 ? '−' : '') + mo(l, Math.abs(x.v)); }).join(' · ') + '.', 'money');
    }
  });

  // ===================================================================
  // 11. HỒ SƠ CHI TIẾT (dùng cho giao diện)
  // ===================================================================
  var ACH = /giải (Nhất|Nhì|Ba|Khuyến khích)|huy chương|[Vv]ô địch|Tốt nghiệp|Nhận bằng|học vị|thăng|bổ nhiệm|Lên hạng|nút (bạc|vàng|kim cương)|triệu người|kỷ lục|học bổng|tuyển thẳng|Khai trương|TRÚNG|Đạt danh hiệu|Mở chi nhánh|kết nạp|lên cấp/;
  E.profile = function (l) {
    var c = jobC(l), P = {};
    var vens = (l.ventures || []).map(function (v) { return 'chủ ' + v.n + (v.br > 1 ? ' (' + v.br + ' cơ sở)' : ''); });
    P.job = l.job ? U.cap(E.jobTitle(l)) + (vens.length ? ' · ' + vens.join(', ') : '') : vens.length ? U.cap(vens.join(', ')) : l.retired ? 'Đã nghỉ hưu' + (l.peakTitle ? ' (trước là ' + l.peakTitle + ')' : '') : l.school ? 'Đang đi học' : l.age < 15 ? 'Còn nhỏ' : 'Chưa có việc làm';
    P.jobInfo = [];
    if (c) {
      if (l.job.yrs) P.jobInfo.push('đã làm ' + (l.job.sen || l.job.yrs) + ' năm');
      if (insured(l)) P.jobInfo.push('hợp đồng chính thức, có đóng ' + E.siLabel(l));
      var fit = fitOf(l, c); if (fit > 0) P.jobInfo.push('đúng sở trường — năng suất cao'); else if (fit < 0) P.jobInfo.push('không đúng sở thích — dễ căng thẳng');
      if (l.rentVeh) P.jobInfo.push('đang thuê ' + l.rentVeh.n);
    }
    var y = l.yr || {};
    P.salary = y.gross > 0 ? { gross: y.gross / 12, net: (y.gross - (y.si || 0)) / 12 } : l.income > 0 ? { gross: l.income / 12, net: l.income / 12 } : null;
    P.si = l.si ? { yrs: l.si.yrs, pension: l.pensionInc ? l.pensionInc / 12 : null } : null;
    P.income = incomeParts(l);
    // tài sản
    var A = l.assets || {}, as = [];
    if (l.indep || l.money > 0) as.push(['Tiền mặt / tài khoản', l.money]);
    ['save', 'gold', 'stock', 'land'].forEach(function (k) { if (A[k] > 0.5) as.push([U.cap((E.ASSET_NAME || {})[k] || k), A[k]]); });
    if (l.ownHouse && l.houseVal > 0) as.push([U.cap(l.houseName && l.houseName !== 'nhà riêng' ? l.houseName : 'nhà ở'), l.houseVal]);
    (l.props || []).forEach(function (p) { as.push([U.cap(p.n), p.v]); });
    (l.ventures || []).forEach(function (v) { as.push([U.cap(v.n) + (v.br > 1 ? ' (' + v.br + ' cơ sở)' : ''), v.cap]); });
    if (l.veh && l.vehVal > 0) as.push([U.cap(l.vehName || l.veh), l.vehVal]);
    var debt = H.debtTotal(l) + (l.mortgage || 0); if (debt > 0.5) as.push(['Các khoản nợ', -debt]);
    P.assets = as; P.net = E.netWorth(l);
    // sở thích, năng khiếu
    P.hobbies = [];
    if (l.hobby && hobbyName(l)) P.hobbies.push({ n: hobbyName(l), lv: E.talentLevel(l, l.hobbySk || 0) });
    if (l.idol) P.hobbies.push({ n: 'thần tượng ' + l.idol });
    if (l.game && l.age < 40) P.hobbies.push({ n: 'chơi game ' + l.game });
    P.talent = l.talent ? { n: E.talentText(l), lv: E.talentLevel(l) } : null;
    // học vấn & bằng cấp
    var ed = [], e = l.edu || 0;
    if (e >= 1) ed.push('Tốt nghiệp tiểu học'); if (e >= 2) ed.push('Tốt nghiệp trung học cơ sở'); if (e >= 3) ed.push('Tốt nghiệp trung học phổ thông');
    if (e === 4) ed.push('Bằng trung cấp / cao đẳng nghề');
    if (e >= 5) ed.push('Bằng cử nhân / kỹ sư' + (l.major && (l.majorName || E.MAJORS[l.major]) ? ' ngành ' + (l.majorName || E.MAJORS[l.major]) : '') + (l.uniCity ? ' (' + l.uniCity + ')' : ''));
    if (e >= 6) ed.push('Bằng thạc sĩ'); if (e >= 7) ed.push('Học vị tiến sĩ');
    if (l.school) ed.push('Đang học: ' + E.schoolName(l.school) + (l.schoolEnd ? ' (dự kiến xong năm ' + yr(l, l.schoolEnd) + ')' : ''));
    P.eduLevel = l.age < 6 ? 'Chưa đến tuổi đi học' : U.cap(E.EDU[e] || '');
    P.edu = ed;
    // chứng chỉ, bằng lái
    var ct = [];
    Object.keys(l.lang || {}).forEach(function (k) { if (!l.lang[k]) return; var exp = EXPIRE[k], at = (l.langAt || {})[k]; ct.push(H.langCert(l, k) + (exp ? (l.langExp && l.langExp[k] ? ' · đã hết hạn' : at != null ? ' · còn hạn đến năm ' + yr(l, at + exp) : '') : ' · không thời hạn')); });
    if (l.lic && l.lic.A1) ct.push((H.inVN(l) ? 'Bằng lái xe máy A1' : 'Bằng lái xe máy') + ' · không thời hạn');
    if (l.lic && l.lic.A) ct.push((H.inVN(l) ? 'Bằng lái xe mô tô A' : 'Bằng lái mô tô phân khối lớn') + ' · không thời hạn');
    if (l.lic && l.lic.B) ct.push((H.inVN(l) ? 'Bằng lái ô tô B' : 'Bằng lái ô tô') + (l.licAt && l.licAt.B != null ? ' · hết hạn năm ' + yr(l, l.licAt.B + 10) : ''));
    else if (l.flags.licExpB) ct.push((H.inVN(l) ? 'Bằng lái ô tô B' : 'Bằng lái ô tô') + ' · đã hết hạn (năm ' + l.flags.licExpB + ')');
    P.certs = ct;
    // thành tựu
    var ach = [], seen = {};
    (l.medals || []).forEach(function (m) { var t = 'Huy chương ' + m.m + ' ' + m.ev; if (!seen[t]) { seen[t] = 1; ach.push({ y: m.y, t: t }); } });
    (l.titles || []).forEach(function (t) { if (!seen[t]) { seen[t] = 1; ach.push({ y: null, t: 'Danh hiệu ' + t }); } });
    // chỉ thành tựu của chính mình — bỏ chuyện bố mẹ, anh chị em, bạn đời, con cái được thăng chức, tốt nghiệp…
    var others = [l.partner && l.partner.name, l.fam && l.fam.mName, l.fam && l.fam.fName, l.bff && l.bff.name].concat((l.kids || []).map(function (k) { return k.name; }), (l.sibList || []).map(function (s) { return s.n; })).filter(Boolean);
    var notMine = /^(Mẹ|Bố|Con |Anh |Chị |Em |Vợ |Chồng |Cháu |Người yêu |Bạn đời |Bạn thân )/;
    (l.log || []).forEach(function (x) {
      if ((x.k === 'big' || x.k === 'good') && ACH.test(x.t) && !seen[x.t] && !notMine.test(x.t) && !/^\p{Lu}\p{Ll}* \p{Lu}/u.test(x.t) && !others.some(function (n) { return x.t.indexOf(n) >= 0; })) { seen[x.t] = 1; ach.push({ y: x.y, a: x.a, t: x.t }); }
    });
    P.ach = ach.slice(-30);
    P.stress = l.mind ? { v: Math.round(l.mind.stress), label: E.stressLabel(l.mind.stress) } : null;
    return P;
  };

  // ===================================================================
  // 12. v3.1 — LỰA CHỌN THƯỜNG NGÀY THEO NƠI ĐANG SỐNG; VỀ THĂM BỐ MẸ TỐN TIỀN THEO KHOẢNG CÁCH; GỢI Ý CHI PHÍ
  // ===================================================================
  var ZONE_REG = { MNPB: 'N', DBSH: 'N', BTB: 'C', NTB: 'C', TN: 'S', DNB: 'S', DBSCL: 'S' };
  function zoneOfCity(c) {
    if (!c) return null;
    if (/Hà Nội|Hải Phòng|Thái Nguyên|Bắc Ninh|Nam Định|Hạ Long|Lào Cai/.test(c)) return 'N';
    if (/Đà Nẵng|Huế|Vinh|Quy Nhơn|Nha Trang|Thanh Hóa|Quảng/.test(c)) return 'C';
    if (/Hồ Chí Minh|Cần Thơ|Thủ Dầu Một|Biên Hòa|Vũng Tàu|Buôn Ma Thuột|Đà Lạt/.test(c)) return 'S';
    return null;
  }
  function homeZone(l) { return ZONE_REG[l.region] || 'S'; }
  // bạn đang sống ở đâu: nước nào, miền nào (Việt Nam)
  function where(l) {
    if (l.abroad) return { vn: false, country: l.abroad.name, code: l.abroad.code, perm: !!l.abroad.perm };
    if (!isVN(l)) return { vn: false, country: l.countryName, code: l.country, home: true };
    var city = (l.cityStudent && l.cityStudent.city) || l.movedTo || null;
    return { vn: true, city: city, zone: zoneOfCity(city) || homeZone(l), away: !!city };
  }
  E.where = where;
  // chuyến về thăm bố mẹ: xa hay gần, đi bằng gì, tốn bao nhiêu
  function trip(l) {
    var w = where(l), home = isVN(l) ? (l.provLabel || (l.prov && l.prov.old) || 'quê nhà') : (l.city || l.countryName);
    if (livesWith(l)) return { same: true, cost: 0, how: 'ở cùng nhà', to: home };
    if (!isVN(l) && !l.abroad) return { same: false, cost: l.base * 0.01, how: 'về nhà bố mẹ', to: home, near: true };
    if (!w.vn) { var farC = /Hoa Kỳ|Canada|Úc|Anh|Đức|Pháp|châu Âu|New Zealand|Ý|Hà Lan|Thụy|Ba Lan|Séc/.test(w.country); return { same: false, abroad: true, cost: isVN(l) ? V(l, farC ? 28 : 10) : l.base * (farC ? 0.25 : 0.1), how: 'mua vé máy bay từ ' + w.country + ' về', to: home }; }
    if (!w.away) return { same: false, near: true, cost: V(l, 0.3), how: 'chạy xe sang nhà bố mẹ', to: home };
    if (w.zone === homeZone(l)) return { same: false, mid: true, cost: V(l, 1.3), how: 'bắt xe khách từ ' + w.city + ' về quê', to: home };
    return { same: false, flight: true, cost: V(l, 4), how: 'mua vé máy bay từ ' + w.city + ' về quê', to: home };
  }
  E.homeTrip = trip;
  // v3.8.1: đang sống cùng nhà với bố mẹ (đã đón bố mẹ về ở cùng, hoặc chưa ra ở riêng, chưa lập gia đình)
  function livesWith(l) { return !!(l.flags.caring || (!l.indep && !l.abroad && !l.cityStudent && !l.movedTo)); }
  E.livesWithParents = livesWith;
  function pw(l) { return l.fam.mAlive && l.fam.fAlive && !l.fam.noDad ? 'bố mẹ' : l.fam.mAlive ? 'mẹ' : (l.fam.fAlive && !l.fam.noDad) ? 'bố' : ''; }
  if (E.DEC.tham_bo_me) {
    var TB = E.DEC.tham_bo_me.def, goOld = TB.opts.filter(function (o) { return o.k === 'go'; })[0];
    TB.valid = function (l) { return !!pw(l); };
    TB.text = function (l) {
      var f = l.fam, a = l.age, p = pw(l), t = trip(l);
      var ages = p === 'bố mẹ' ? (f.mAge + a) + ' và ' + (f.fAge + a) : p === 'mẹ' ? (f.mAge + a) : (f.fAge + a);
      return U.cap(p) + ' giờ đã ' + ages + ' tuổi' + (p === 'bố mẹ' ? '' : ', ở một mình từ ngày ' + (p === 'mẹ' ? 'bố' : 'mẹ') + ' mất') + '. ' +
        (t.same ? 'Bạn đang sống cùng nhà với ' + p + '.' : t.near ? 'Nhà ' + p + ' ở gần, chạy xe một lát là tới.' : 'Bạn đang ở ' + (where(l).city || where(l).country) + ', ' + p + ' ở ' + t.to + ' — muốn về phải ' + t.how + ' (đi lại, quà cáp khoảng ' + mo(l, t.cost) + ').') + ' Lâu rồi bạn chưa dành thời gian cho ' + p + '.';
    };
    TB.opts = [
      { k: 'go', l: function (l) { var t = trip(l), p = pw(l); return t.same ? 'Dành trọn một ngày cho ' + p + ' (đưa đi chơi, đi chùa, đi khám…)' : t.abroad ? 'Bay về Việt Nam thăm ' + p : t.flight ? 'Bay về quê thăm ' + p : t.mid ? 'Bắt xe khách về quê thăm ' + p : 'Về ăn cơm với ' + p; },
        h: function (l) { var t = trip(l); return t.cost > 0 ? (t.abroad || t.flight ? 'Vé máy bay khứ hồi, quà cáp' : t.mid ? 'Vé xe khách, quà cáp' : 'Xăng xe, ít quà') + ' ~' + mo(l, t.cost) : 'Không tốn tiền'; },
        run: function (l, r, log) {
          var t = trip(l), p = pw(l);
          if (t.same) { var tx = pick(r, ['Sáng đưa ' + p + ' đi chợ, chiều cả nhà cùng nấu một bữa cơm thịnh soạn.', 'Đưa ' + p + ' đi chùa, rồi dạo công viên, chụp mấy tấm ảnh kỷ niệm.', 'Cả ngày ngồi nghe ' + p + ' kể chuyện ngày xưa, tiện tay sửa cái quạt, thay bóng đèn.', 'Đưa ' + p + ' đi khám sức khỏe định kỳ, trưa ghé quán bún quen ăn cùng nhau.', 'Tắt điện thoại, cả ngày chỉ ở bên ' + p + ': pha ấm trà, xem lại album ảnh cũ.']); H.cash(l, -V(l, 0.3), 'Đưa ' + p + ' đi chơi'); log(tx, 'good'); fx(l, { hap: 5, soc: 3, karma: 2 }); H.mem(l, tx, 3); return; }
          if (t.cost > 0) H.cash(l, -t.cost, (t.abroad ? 'Vé máy bay về nước thăm ' : t.flight ? 'Vé máy bay về quê thăm ' : t.mid ? 'Vé xe về quê thăm ' : 'Về thăm ') + p);
          var m0 = l.money, it = (l.yr || { items: [] }).items, n0 = it.length;
          goOld.run(l, r, function (txt, k) { log((t.abroad ? 'Bay về Việt Nam sau bao lâu xa nhà. ' : t.flight || t.mid ? U.cap(t.how) + '. ' : '') + txt, k); });
          l.money = m0; it.splice(n0, it.length - n0); // chi phí đã tính theo khoảng cách ở trên
          if (t.abroad || t.flight) fx(l, { hap: 3 });
        } },
      { k: 'week', l: function (l) { return 'Xin nghỉ phép, về ở với ' + pw(l) + ' cả tuần'; }, req: function (l) { return !trip(l).same && !trip(l).near; }, h: function (l) { return 'Tiền đi lại & quà ~' + mo(l, trip(l).cost * 1.3) + (l.job ? ', mất vài ngày công' : ''); },
        run: function (l, r, log) { var t = trip(l), p = pw(l); H.cash(l, -t.cost * 1.3, 'Về quê ở với ' + p + ' một tuần'); if (l.job && l.income > 0) H.cash(l, -l.income / 52, 'Nghỉ không lương'); log('Về ở với ' + p + ' trọn một tuần — ' + pick(r, ['sáng đi chợ, chiều nấu cơm, tối ngồi nghe kể chuyện ngày xưa.', 'sửa lại mái nhà dột, dọn khu vườn cỏ mọc um tùm.', 'đưa ' + p + ' đi khám sức khỏe, mua thêm ít đồ dùng trong nhà.']), 'good'); fx(l, { hap: 9, soc: 4, karma: 3 }); if (l.mind) l.mind.stress -= 8; H.mem(l, 'Một tuần ở nhà với ' + p + ', thấy mình như đứa trẻ ngày nào.', 4); } },
      { k: 'call', l: 'Gọi video hỏi thăm', h: 'Không tốn tiền', req: function (l) { return !trip(l).same; }, run: function (l, r, log) { var p = pw(l); log('Gọi video cho ' + p + ' gần một tiếng. ' + pick(r, [U.cap(p) + ' cứ dặn đi dặn lại phải giữ sức khỏe.', U.cap(p) + ' khoe mấy chuyện ở quê, cười suốt.', 'Thấy ' + p + ' gầy đi, bạn hứa sẽ sớm về.']), 'good'); fx(l, { hap: 2, soc: 1 }); } },
      { k: 'an_toi', l: function (l) { return 'Tối nay về sớm, ăn cơm cùng ' + pw(l); }, h: 'Không tốn tiền', req: function (l) { return trip(l).same; }, run: function (l, r, log) { var p = pw(l); log('Về sớm ăn cơm tối cùng ' + p + '. ' + pick(r, [U.cap(p) + ' gắp cho bạn miếng ngon nhất, kể chuyện hàng xóm cả buổi.', 'Ăn xong cả nhà ngồi xem thời sự, ' + p + ' hỏi han chuyện công việc.', U.cap(p) + ' vui hẳn, bảo lâu lắm rồi mới thấy bạn về sớm.']), 'good'); fx(l, { hap: 3, soc: 2, karma: 1 }); } },
      { k: 'send', l: function (l) { return (trip(l).same ? 'Biếu ' : 'Gửi tiền về biếu ') + pw(l); }, req: function (l) { return l.indep && l.money > l.base * 0.12; }, h: function (l) { return '~' + mo(l, l.base * 0.1); }, run: function (l, r, log) { H.cash(l, -l.base * 0.1, 'Gửi tiền biếu ' + pw(l)); if (trip(l).same) { log('Dúi vào tay ' + pw(l) + ' một khoản tiền tiêu vặt, ' + pw(l) + ' mắng "bày vẽ" mà mắt cười.', 'good'); fx(l, { hap: 3, karma: 2 }); return; } log('Chuyển khoản biếu ' + pw(l) + ' một khoản, ' + pw(l) + ' gọi lại mắng "tiêu xài hoang phí" mà giọng vui hẳn.', 'good'); fx(l, { hap: 3, karma: 2 }); } }
    ];
  }
  // Tết về quê: xa nhà thì tốn tiền vé
  E.EVENTS.forEach(function (ev) {
    var src = ev.run.toString();
    if (/Về quê ăn Tết, gói bánh chưng/.test(src)) {
      var run0 = ev.run;
      ev.run = function (l, a, r, log) {
        run0.call(this, l, a, r, function (t, k) {
          if (/^Về quê ăn Tết/.test(t)) { var tp = trip(l); if (!tp.same && !tp.near && !tp.abroad && tp.cost > 0) { H.cash(l, -tp.cost * 1.5, 'Vé xe / máy bay về quê ăn Tết'); t = U.cap(tp.how) + ' ăn Tết (vé mùa Tết đắt gấp rưỡi), gói bánh chưng cùng gia đình.'; } }
          log(t, k);
        });
      };
    }
    // phong tục ở quê (tảo mộ, giỗ, ông Công ông Táo, hang đá cả xứ…) chỉ khi đang sống ở Việt Nam
    if (/Thanh minh|ông Công ông Táo|Ngày giỗ ông|Rằm tháng Giêng|tảo mộ|hang đá Giáng sinh|xứ đạo|rước kiệu/.test(src)) {
      var c0 = ev.c; ev.c = function (l, a) { return (/ông Công ông Táo|Ngày giỗ ông/.test(src) ? (H.inVN(l) || (H.hasVNOrigin && H.hasVNOrigin(l) && l.abroad && l.abroad.perm)) : H.inVN(l)) && c0.apply(this, arguments); };
    }
  });

  // địa điểm du lịch, dã ngoại, đi phượt theo nơi đang sống
  var VN_TRAVEL = { N: ['Sa Pa', 'Hạ Long', 'Ninh Bình', 'Hà Giang', 'Mộc Châu', 'Cát Bà'], C: ['Hội An', 'Huế', 'Quy Nhơn', 'Phong Nha', 'Nha Trang', 'Đà Lạt'], S: ['Vũng Tàu', 'Phú Quốc', 'Đà Lạt', 'Côn Đảo', 'Mũi Né', 'Cần Thơ'] };
  var VN_NATURE = { N: ['vườn quốc gia Cúc Phương', 'vườn quốc gia Ba Vì', 'Tam Đảo', 'Fansipan', 'núi Mẫu Sơn'], C: ['vườn quốc gia Bạch Mã', 'Bà Nà', 'bán đảo Sơn Trà', 'Phong Nha – Kẻ Bàng'], S: ['núi Bà Đen', 'vườn quốc gia Cát Tiên', 'đỉnh Langbiang', 'Tà Năng – Phan Dũng', 'núi Chứa Chan'] };
  var VN_PHUOT = { N: ['Hà Giang', 'Tà Xùa', 'Mộc Châu', 'Mù Cang Chải'], C: ['Măng Đen', 'đèo Hải Vân', 'Lý Sơn', 'Phú Yên'], S: ['Đà Lạt', 'Côn Đảo', 'Mũi Né', 'quần đảo Nam Du'] };
  var SPOTS = {
    'Nhật Bản': [['Kyoto', 'Hokkaido', 'Okinawa', 'Osaka'], ['núi Phú Sĩ', 'vườn quốc gia Nikko', 'rừng tre Arashiyama']],
    'Hàn Quốc': [['đảo Jeju', 'Busan', 'Gyeongju'], ['núi Seorak', 'núi Bukhansan', 'núi Hallasan']],
    'Đài Loan': [['Đài Trung', 'Cao Hùng', 'Hoa Liên'], ['núi A Lý', 'hẻm núi Thái Lỗ Các', 'Ngọc Sơn']],
    'Trung Quốc': [['Quế Lâm', 'Thượng Hải', 'Tây An'], ['Trương Gia Giới', 'Hoàng Sơn']],
    'Thái Lan': [['Phuket', 'Chiang Mai', 'Pattaya'], ['núi Doi Inthanon', 'vườn quốc gia Khao Yai']],
    'Singapore': [['đảo Sentosa', 'Vịnh Marina'], ['khu bảo tồn MacRitchie', 'đồi Bukit Timah']],
    'Malaysia': [['Penang', 'Langkawi', 'Malacca'], ['cao nguyên Cameron', 'núi Kinabalu']],
    'Úc': [['Gold Coast', 'Melbourne', 'Tasmania'], ['dãy Blue Mountains', 'công viên Grampians']],
    'Hoa Kỳ': [['Las Vegas', 'San Francisco', 'Hawaii', 'New York'], ['công viên Yosemite', 'hẻm núi Grand Canyon', 'Yellowstone']],
    'Canada': [['Vancouver', 'Québec', 'Toronto'], ['công viên Banff', 'thác Niagara']],
    'Anh': [['Edinburgh', 'Bath', 'Cornwall'], ['vùng hồ Lake District', 'vườn quốc gia Snowdonia']],
    'Đức': [['Munich', 'Hamburg', 'Berlin'], ['Rừng Đen', 'dãy Alps vùng Bavaria']],
    'Pháp': [['Nice', 'Lyon', 'Bordeaux'], ['dãy Alps', 'vùng Provence']]
  };
  function spots(w, i) { var s = SPOTS[w.country]; return s ? s[i] : [i ? 'một công viên quốc gia ở ' + w.country : 'một thành phố biển ở ' + w.country]; }
  function vnPick(r, T, w) { return r() < 0.7 ? pick(r, T[w.zone]) : pick(r, [].concat(T.N, T.C, T.S)); }
  function nearTrip(l, r) { var w = where(l); return w.vn ? vnPick(r, VN_TRAVEL, w) : pick(r, spots(w, 0)); }
  function natureSpot(l, r) { var w = where(l); return w.vn ? vnPick(r, VN_NATURE, w) : pick(r, spots(w, 1)); }
  function phuotSpot(l, r) { var w = where(l); return w.vn ? vnPick(r, VN_PHUOT, w) : pick(r, spots(w, 1).concat(spots(w, 0))); }
  E.nearTrip = nearTrip; E.natureSpot = natureSpot;
  if (E.DEC.leo_nui) E.DEC.leo_nui.def.prep = function (l, r) { return { p: natureSpot(l, r) }; };
  if (E.DEC.phuot) E.DEC.phuot.def.prep = function (l, r) { return { p: phuotSpot(l, r) }; };
  if (E.DEC.du_lich) {
    var DL = E.DEC.du_lich.def, dl0 = DL.prep;
    DL.prep = function (l, r) {
      var d = dl0.apply(this, arguments), w = where(l);
      d.near = nearTrip(l, r);
      if (!w.vn && (d.far === w.country)) d.far = 'Việt Nam';
      return d;
    };
  }
  E.EVENTS.forEach(function (ev) {
    if (ev.travelCompat) {
      ev.run = function (l, a, r, log) {
        var w = where(l), abroadTrip = l.money > l.base * 2 && r() < 0.5;
        var dest = abroadTrip ? pick(r, ['Thái Lan', 'Hàn Quốc', 'Nhật Bản', 'Singapore', 'Đài Loan', 'châu Âu'].filter(function (x) { return x !== w.country; })) : nearTrip(l, r);
        var cost = abroadTrip ? 0.15 : 0.05;
        H.cash(l, -l.base * cost, 'Du lịch'); H.visit(l, dest);
        log('Đi du lịch ' + dest + (l.partner ? ' cùng ' + H.partnerWord(l, l.partner) : '') + '.', 'good'); fx(l, { hap: 4 });
      };
    }
  });

  // gợi ý chi phí cho lựa chọn chưa ghi giá: chạy thử lựa chọn trên một bản sao của nhân vật
  E.optCosts = function (l, d) {
    var res = {}, D = E.DEC[d && d.id]; if (!D || !d.opts) return res;
    var base;
    try { base = JSON.stringify(l); } catch (e) { return res; }
    d.opts.forEach(function (o) {
      if (o.h && /\d/.test(o.h)) return; // đã ghi giá
      var nets = [];
      for (var t = 0; t < 3; t++) {
        try {
          var c = JSON.parse(base); c.pending = []; c.yr = { items: [] }; c.rs = (c.rs + 7919 * (t + 1)) | 0; c.log = c.log.slice(-30);
          D.apply(c, JSON.parse(JSON.stringify(d)), o.k, function () { return U.rand(c); }, function () { });
          var net = 0; c.yr.items.forEach(function (x) { if (!/^Vay /.test(x.t)) net += x.v; });
          nets.push(net);
        } catch (e) { return; }
      }
      if (!nets.length) return;
      var lo = Math.min.apply(null, nets), hi = Math.max.apply(null, nets), thr = l.base * 0.002;
      if (hi <= -thr) res[o.k] = 'Chi phí khoảng ' + mo(l, -hi) + (lo < hi * 1.3 ? ' – ' + mo(l, -lo) : '');
      else if (lo <= -thr) res[o.k] = 'Có thể tốn đến ' + mo(l, -lo);
    });
    return res;
  };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
