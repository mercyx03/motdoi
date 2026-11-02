/* Một Đời — v7.5.0 (góp ý của người chơi)
   · "sống tiếp đời con" ở tuổi hiện tại: giữ đúng nghề, bậc, thâm niên, học vấn của người con như đã hiển thị ở đời trước
     (trước đây những năm đã qua được dựng lại ngẫu nhiên nên nghề bị đổi)
   · cho biết mọi người đang ở đâu: bạn (ở quê, lên thành phố, du học, đi làm ở nước ngoài, định cư…), bố mẹ (ở cùng nhà / ở quê),
     từng người con (ở cùng bạn, đi du học, đi làm ở riêng, đã lập gia đình)
   · tự chọn trường quân đội, công an khi thi đại học: Học viện An ninh nhân dân, Học viện Cảnh sát nhân dân, Học viện Kỹ thuật Quân sự,
     Học viện Quân y, Học viện Hải quân, Học viện Biên phòng, Học viện Phòng không – Không quân, Học viện Hậu cần, các trường Sĩ quan
     Lục quân, Chính trị, Thông tin, Pháo binh, Đặc công…, Đại học Phòng cháy chữa cháy
   · lộ trình thăng quân hàm theo Luật Sĩ quan QĐND và Luật CAND: Thiếu úy → Trung úy 2 năm → Thượng úy 3 năm → Đại úy 3 năm →
     Thiếu tá, Trung tá, Thượng tá, Đại tá mỗi bậc 4 năm; muốn lên Thượng tá phải qua học viện đào tạo cán bộ cấp trung (Học viện Lục quân,
     Học viện Chính trị / Học viện Chính trị CAND), lên tướng phải qua Học viện Quốc phòng / lớp cao cấp */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function pick(r, a) { return U.pick(r, a); }
  function mo(l, v) { return H.money(l, v); }

  // ===================================================================
  // 1. ĐỜI CON Ở TUỔI HIỆN TẠI: GIỮ NGHỀ NHƯ ĐỜI TRƯỚC
  // ===================================================================
  var childOpts = E.childOpts;
  E.childOpts = function (l, k) {
    var o = childOpts.apply(this, arguments), h = o.parent && o.parent.heir;
    if (h && h.rec) { h.rec.jobId = k.job || null; h.rec.rank = k.rank || 0; h.rec.jyrs = k.jyrs || 0; h.rec.uniLeft = k.uniUntil ? Math.max(1, k.uniUntil - (h.at || 0)) : 0; h.rec.abroadStudy = !!k.abroadStudy; h.rec.eduExact = k.edu || 0; }
    return o;
  };
  var heirAtAge = E.heirAtAge;
  if (heirAtAge) E.heirAtAge = function (l, k, tries) {
    var best = heirAtAge.apply(this, arguments); if (!best) return best;
    var rec = (E.childOpts(l, k).parent.heir || {}).rec || {}, h0 = { rs: (best.rs ^ 0x96a1) | 0 }, r = function () { return U.rand(h0); };
    // Restore the selected child's recorded values after reconstructing elapsed years.
    if(E.LOOKS134)best.looks134=E.LOOKS134.kidLooks(l,k);
    ['hea','hap','kno','soc'].forEach(function(key){if(k.st&&Number.isFinite(k.st[key]))best.st[key]=U.clamp(k.st[key],0,100);else if(Number.isFinite(k[key]))best.st[key]=U.clamp(k[key],0,100);});
    if(Number.isFinite(k.study))best.st.kno=U.clamp(k.study,0,100);
    if(k.profile147)best.allergy=k.profile147.allergy;
    best.edu = rec.eduExact || 0;
    if (rec.uniLeft > 0) { if (best.job) { best.lastJob = best.job; best.job = null; } best.school = 'uni'; best.schoolEnd = best.age + rec.uniLeft; best.indep = false; if (rec.abroadStudy) best.flags.heirAbroadStudy = true; }
    else if (rec.jobId && E.CAR[rec.jobId]) {
      best.school = null; best.schoolEnd = null; best.cityStudent = null;
      if (!best.job || E.resolveJob(best.job.id) !== rec.jobId) { best.school = null; best.schoolEnd = null; E.startJob(best, rec.jobId, r, function () { }, true); }
      if (best.job) { var c = E.CAR[rec.jobId]; best.job.rank = Math.min(rec.rank || 0, c.t.length - 1); best.job.rankTracked = best.job.rank; best.job.rankSince = best.age - Math.max(0, rec.jyrs || 0); best.job.yrs = rec.jyrs || 0; best.indep = true; }
    } else {
      best.job = null;
      if (best.age >= 18) { best.school = null; best.schoolEnd = null; best.cityStudent = null; }
      best.flags.needJob = best.age >= 18 && !best.retired;
    }
    return best;
  };

  // ===================================================================
  // 2. AI ĐANG Ở ĐÂU
  // ===================================================================
  function together(l) { return E.parentsWithYouAbroad ? E.parentsWithYouAbroad(l) : !!(l.flags.parentsAbroad && l.abroad && l.abroad.perm); }
  function homeName(l) { return isVN(l) ? (l.provLabel || (l.prov && l.prov.old) || 'quê nhà') : (l.city || l.countryName || 'quê nhà'); }
  function guardian(l) { if(l.flags.life138&&l.flags.life138.care)return l.flags.life138.care;var f = l.fam || {}; return f.mAlive && f.fAlive && !f.noDad ? 'bố mẹ' : f.mAlive ? 'mẹ' : f.fAlive && !f.noDad ? 'bố' : (E.orphanCarer && E.orphanCarer(l)) || 'người thân'; }
  E.whereNow = function (l) {
    if (l.jailUntil != null && l.age < l.jailUntil) return 'Đang thụ án trong trại giam';
    var A = l.abroad;
    if (A) {
      var n = A.name || 'nước ngoài';
      if (A.trapped) return 'Đang bị giữ ở ' + n;
      if (A.study) return 'Đang du học ở ' + n;
      if (A.perm) return 'Định cư ở ' + n + (together(l) ? ', sống cùng ' + guardian(l) : '');
      return 'Đang đi làm ở ' + n + ', gia đình ở ' + homeName(l);
    }
    if (l.flags.military && l.age < l.flags.military) return 'Đang tại ngũ trong doanh trại';
    if (l.age < 18 && !l.indep) return 'Sống cùng ' + guardian(l) + ' ở ' + homeName(l) + ' (' + (l.fam.home || 'nhà riêng') + ')';
    if (l.cityStudent) return 'Sinh viên ở trọ tại ' + (l.cityStudent.city || l.cityStudent || 'thành phố');
    if (l.school === 'police') return 'Học viên ở ký túc xá ' + ((l.flags.academy && l.flags.academy.n) || 'học viện');
    var city = l.movedTo ? 'ở ' + l.movedTo : 'ở ' + homeName(l);
    var house = l.ownHouse ? 'Sống trong ' + (l.houseName && l.houseName !== 'nhà riêng' ? l.houseName : 'nhà riêng') : E.livesWithParents && E.livesWithParents(l) ? 'Sống cùng ' + guardian(l) : l.urban || l.movedTo ? 'Thuê nhà' : 'Sống ở quê';
    return house + ' ' + city;
  };
  E.parentWhere = function (l) {
    if (E.livesWithParents && E.livesWithParents(l)) return together(l) ? 'sống cùng bạn ở ' + l.abroad.name : 'ở cùng nhà với bạn';
    if (l.abroad) return 'ở ' + homeName(l);
    if (l.movedTo || l.cityStudent) return 'ở quê ' + homeName(l);
    return 'ở gần nhà bạn';
  };
  E.kidWhere = function (l, k) {
    if (!k || k.alive === false) return '';
    var ka = l.age - k.born, here = l.abroad && l.abroad.perm ? ' ở ' + l.abroad.name : '';
    if (k.jail && ka < k.jail) return 'trong trại giam';
    if (k.custody === 'other' || k.custody === 'ex') return 'ở với ' + (l.sex === 'M' ? 'mẹ' : 'bố') + ' của bé';
    if (k.custody === 'both' && ka < 18) return 'luân phiên ở nhà bố và mẹ';
    if (k.uniUntil && k.abroadStudy) return 'đang du học';
    if (ka < 18) return 'sống cùng bạn' + here;
    if (k.uniUntil) return 'ở trọ đi học đại học';
    if (k.married || (k.kids || 0) > 0) return 'đã lập gia đình, ở riêng';
    if (k.job) return ka < 28 ? 'đi làm, vẫn ở cùng bạn' + here : 'đi làm, ở riêng';
    return 'ở cùng bạn' + here;
  };

  // ===================================================================
  // 3. TRƯỜNG QUÂN ĐỘI, CÔNG AN
  // ===================================================================
  // [mã, tên trường, lực lượng, binh chủng / ngành, điểm kiến thức tối thiểu, sức khỏe tối thiểu]
  var ACAD = [
    ['hv_an_ninh', 'Học viện An ninh nhân dân', 'cong_an', 'An ninh', 62, 60],
    ['hv_canh_sat', 'Học viện Cảnh sát nhân dân', 'cong_an', 'Cảnh sát', 60, 60],
    ['dh_an_ninh', 'Trường Đại học An ninh nhân dân', 'cong_an', 'An ninh', 52, 58],
    ['dh_canh_sat', 'Trường Đại học Cảnh sát nhân dân', 'cong_an', 'Cảnh sát', 50, 58],
    ['dh_pccc', 'Trường Đại học Phòng cháy chữa cháy', 'cong_an', 'Cảnh sát PCCC và cứu nạn, cứu hộ', 50, 62],
    ['dh_kthc_cand', 'Trường Đại học Kỹ thuật – Hậu cần CAND', 'cong_an', 'Kỹ thuật – Hậu cần', 50, 55],
    ['hv_ktqs', 'Học viện Kỹ thuật Quân sự', 'quan_doi', 'Kỹ thuật', 66, 58],
    ['hv_quan_y', 'Học viện Quân y', 'quan_doi', 'Quân y', 68, 58],
    ['hv_hai_quan', 'Học viện Hải quân', 'quan_doi', 'Hải quân', 52, 65],
    ['hv_bien_phong', 'Học viện Biên phòng', 'quan_doi', 'Bộ đội Biên phòng', 52, 62],
    ['hv_pk_kq', 'Học viện Phòng không – Không quân', 'quan_doi', 'Phòng không – Không quân', 55, 65],
    ['hv_hau_can', 'Học viện Hậu cần', 'quan_doi', 'Hậu cần', 52, 58],
    ['sq_luc_quan', 'Trường Sĩ quan Lục quân 1 (Đại học Trần Quốc Tuấn)', 'quan_doi', 'Lục quân', 48, 62],
    ['sq_chinh_tri', 'Trường Sĩ quan Chính trị (Đại học Chính trị)', 'quan_doi', 'Chính trị', 50, 58],
    ['sq_thong_tin', 'Trường Sĩ quan Thông tin', 'quan_doi', 'Thông tin liên lạc', 48, 58],
    ['sq_dac_cong', 'Trường Sĩ quan Đặc công', 'quan_doi', 'Đặc công', 45, 72]
  ];
  E.ACADEMIES = ACAD;
  function acad(l) { return l.flags.academy || null; }
  SC('chon_hoc_vien', {
    title: 'Chọn trường quân đội, công an',
    text: function (l) { return 'Bạn đủ điều kiện sơ tuyển (sức khỏe, lý lịch, điểm thi). Hồ sơ được nộp vào một trường. Trường càng "hot" thì điểm chuẩn càng cao. Học 4 năm (Quân y 6 năm), ra trường được phong quân hàm Thiếu úy và phân công công tác.'; },
    opts: ACAD.map(function (x) {
      return { k: x[0], l: x[1], h: (x[2] === 'cong_an' ? 'Công an nhân dân' : 'Quân đội nhân dân') + ' · ' + x[3], req: function (l) { return (l.st.kno || 0) >= x[4] - 8 && (l.st.hea || 0) >= x[5] - 8; }, ai: { w: x[4] >= 60 ? 0.8 : 1 },
        run: function (l, r, log) {
          var hard = (x[4] - (l.st.kno || 0)) / 25 + (x[5] - (l.st.hea || 0)) / 40, p = U.clamp(0.75 - hard, 0.2, 0.95);
          if (r() < p) {
            l.flags.academy = { id: x[0], n: x[1], track: x[2], br: x[3] }; l.flags.policeTrack = x[2]; l.school = 'police'; l.schoolEnd = l.age + (x[0] === 'hv_quan_y' ? 6 : 4);
            log('Đỗ vào ' + x[1] + ', ngành ' + x[3] + '. Ngày nhập học, cả nhà tiễn bạn ra cổng trường, bộ quân phục học viên mới tinh.', 'big'); H.fx(l, { hap: 6 }); H.mem(l, 'Ngày nhập học ' + x[1] + '.', 4);
          } else {
            l.flags.academy = null; l.school = null; l.schoolEnd = null;
            log('Thiếu điểm chuẩn vào ' + x[1] + '. Bạn đành chọn hướng khác.', 'bad'); H.fx(l, { hap: -5 });
            if (E.DEC.uniFail) l.pending.unshift(E.DEC.uniFail.make(l, r));
          }
        } };
    })
  });
  E.MAJOR.chon_hoc_vien = 1;
  // tên nghề kèm binh chủng / lực lượng
  var jt = E.jobTitle;
  E.jobTitle = function (l) { var t = jt.apply(this, arguments), x = acad(l), id = l.job && E.resolveJob(l.job.id); if (x && (id === 'quan_doi' || id === 'cong_an') && x.track === id && t && t.indexOf(x.br) < 0) t += ' · ' + x.br; return t; };
  // học viện nâng cao giữa sự nghiệp
  function uni(l) { var id = l.job && E.resolveJob(l.job.id); return id === 'quan_doi' || id === 'cong_an' ? id : null; }
  var MID = { quan_doi: [['hv_luc_quan', 'Học viện Lục quân', 'đào tạo chỉ huy tham mưu cấp trung đoàn, sư đoàn'], ['hv_chinh_tri', 'Học viện Chính trị', 'đào tạo chính ủy, chính trị viên cấp trung, sư đoàn']], cong_an: [['hv_ct_cand', 'Học viện Chính trị Công an nhân dân', 'bồi dưỡng lãnh đạo, chỉ huy cấp phòng, cấp tỉnh'], ['hv_an_ninh_sdh', 'Học viện An ninh / Cảnh sát (hệ sau đại học)', 'học thạc sĩ chuyên ngành, làm cán bộ nghiệp vụ']] };
  E.HOOKS.year.unshift(function (l, r, log, a) {
    var s = l.flags.midAcadStudy;
    if (!s) return;
    if (uni(l) !== s.track || l.retired) { l.flags.midAcadStudy = null; log('Dừng khóa học ' + s.n + ' do không còn công tác trong lực lượng.', 'neutral'); return; }
    if (a < s.until || (l.jailUntil != null && a < l.jailUntil)) return;
    l.flags.midAcadStudy = null;
    l.flags.midAcad = { id: s.id, n: s.n, at: a };
    l.edu = Math.max(l.edu, 6);
    log('Sau hai năm học ' + s.n + ', bạn tốt nghiệp và trở về đơn vị.', 'good');
    H.fx(l, { kno: 4, hap: 2 }); H.mem(l, 'Ngày tốt nghiệp ' + s.n + '.', 3);
  });
  SC('hv_nang_cao', {
    title: 'Cử đi học nâng cao',
    prep: function (l) { return { u: uni(l) }; },
    valid: function (l) { return !!uni(l) && l.job.rank >= 3 && l.job.rank <= 5 && !l.flags.midAcad && !l.flags.midAcadStudy; },
    text: function (l, d) { return 'Bạn mang quân hàm ' + E.jobTitle(l) + ', được đơn vị đề xuất cử đi học 2 năm. Muốn được bổ nhiệm cấp cao hơn, gần như ai cũng phải qua lớp đào tạo này.'; },
    opts: [0, 1].map(function (i) { return { k: 'h' + i, l: function (l, d) { var m = MID[d.u || uni(l) || 'quan_doi'][i]; return 'Học ' + m[1]; }, h: function (l, d) { return MID[d.u || uni(l) || 'quan_doi'][i][2]; }, ai: { w: 1, amb: 1 }, run: function (l, r, log, d) { if (l.flags.midAcad || l.flags.midAcadStudy) return; var track = uni(l), m = MID[track][i]; l.flags.midAcadStudy = { id: m[0], n: m[1], track: track, at: l.age, until: l.age + 2 }; log('Bắt đầu khóa học hai năm tại ' + m[1] + ', ' + m[2] + '.', 'big'); } }; }).concat([
      { k: 'thoi', l: 'Xin ở lại đơn vị, chưa đi học', ai: { w: 0.3 }, run: function (l, r, log) { l.flags.midAcadNo = (l.flags.midAcadNo || 0) + 1; log('Bạn xin ở lại đơn vị. Cơ hội thăng tiến lên cấp cao vì thế mà chậm lại.', 'neutral'); } }])
  });
  E.TRIG.push({ id: 'hv_nang_cao', when: function (l, a) { return !!uni(l) && l.job.rank >= 3 && l.job.rank <= 5 && !l.flags.midAcad && !l.flags.midAcadStudy && (l.flags.midAcadNo || 0) < 2 && !(l.jailUntil != null && a < l.jailUntil); }, p: 0.35, cd: 3, max: 3 });
  SC('hv_quoc_phong', {
    title: function (l) { return uni(l) === 'cong_an' ? 'Lớp cao cấp lý luận chính trị' : 'Học viện Quốc phòng'; },
    valid: function (l) { return !!uni(l) && l.job.rank === 7 && !!l.flags.midAcad && !l.flags.topAcad; },
    text: function (l) { return uni(l) === 'cong_an' ? 'Là Đại tá, bạn được cử đi học lớp cao cấp lý luận chính trị và bồi dưỡng cán bộ lãnh đạo cấp cao — điều kiện để được xem xét phong hàm cấp tướng.' : 'Là Đại tá, bạn được cử đi học Học viện Quốc phòng — nơi đào tạo cán bộ chiến lược, chiến dịch. Đây là bậc học gần như bắt buộc trước khi được xem xét phong hàm cấp tướng.'; },
    opts: [{ k: 'di', l: 'Đi học', ai: { w: 1.2, amb: 1 }, run: function (l, r, log) { l.flags.topAcad = l.age; log(uni(l) === 'cong_an' ? 'Hoàn thành lớp cao cấp lý luận chính trị.' : 'Tốt nghiệp Học viện Quốc phòng.', 'good'); H.fx(l, { kno: 3 }); } },
      { k: 'thoi', l: 'Không đi, sắp đến tuổi nghỉ hưu', ai: { w: 0.4 }, run: function (l, r, log) { l.flags.topAcad = -1; log('Bạn nhường suất học cho người trẻ hơn.', 'neutral'); } }]
  });
  E.TRIG.push({ id: 'hv_quoc_phong', when: function (l) { return !!uni(l) && l.job.rank === 7 && !!l.flags.midAcad && !l.flags.topAcad; }, p: 0.4, cd: 2, max: 2 });
  // điều kiện thăng quân hàm: lên Thượng tá phải qua học viện cấp trung, lên tướng phải qua Học viện Quốc phòng / lớp cao cấp
  var ca = E.canAdvance;
  if (ca) E.canAdvance = function (l, c, yearEnd) {
    var ok = ca.apply(this, arguments); if (!ok || !c || (c.id !== 'quan_doi' && c.id !== 'cong_an') || !l.job) return ok;
    if (l.job.rank === 5 && !l.flags.midAcad) return false;
    if (l.job.rank === 7 && !(l.flags.topAcad > 0)) return false;
    return true;
  };
  // lộ trình thăng quân hàm
  var LAW = [2, 3, 3, 4, 4, 4, 4, 4];
  ['quan_doi', 'cong_an'].forEach(function (id) { E.CAR[id].yrs = LAW.slice(); });
  SC('lo_trinh_quan_ham', {
    title: 'Lộ trình thăng quân hàm',
    valid: function (l) { return !!uni(l); },
    text: function (l) {
      var c = E.jobDef(l), rk = l.job.rank, since = l.job.rankSince != null ? l.job.rankSince : l.age - (l.job.yrs || 0), inRank = l.age - since;
      var rows = c.t.map(function (t, i) { var mark = i < rk ? '✔ ' : i === rk ? '▶ ' : '○ '; var y = i < c.t.length - 1 ? ' → lên ' + c.t[i + 1] + ' sau tối thiểu ' + c.yrs[i] + ' năm' + (i === 5 ? ' (cần qua ' + (uni(l) === 'cong_an' ? 'Học viện Chính trị CAND' : 'Học viện Lục quân / Học viện Chính trị') + ')' : i === 7 ? ' (cần qua ' + (uni(l) === 'cong_an' ? 'lớp cao cấp' : 'Học viện Quốc phòng') + ', xét theo chức vụ)' : '') : ''; return mark + t + y; });
      var need = c.yrs[rk] || 0, left = Math.max(0, need - inRank);
      return 'Quân hàm hiện tại: ' + c.t[rk] + ' (' + inRank + ' năm ở bậc này' + (rk < c.t.length - 1 ? ', còn khoảng ' + left + ' năm nữa đủ niên hạn' : '') + ').\n' + rows.join('\n') + '\nLộ trình mô phỏng trong game: đủ thời gian chưa chắc được thăng hàm; còn cần hoàn thành nhiệm vụ, đủ sức khỏe, học nâng cao và có chức vụ phù hợp.';
    },
    opts: [{ k: 'ok', l: 'Đã hiểu', ai: { w: 1 }, run: function () { } }]
  });
  E.ACT.push({ id: 'xem_quan_ham', g: 'Công việc', l: 'Xem lộ trình thăng quân hàm', min: 18, sc: 'lo_trinh_quan_ham', avail: function (l) { return uni(l) ? true : 'Chỉ dành cho quân đội, công an'; } });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
