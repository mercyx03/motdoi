/* Một Đời — v8.4.0
   · Khối thi năng khiếu có trường thật: H00 (Văn – Hình họa – Bố cục màu), V00 (Toán – Lý – Vẽ mỹ thuật), S00 (Văn + năng khiếu sân khấu – điện ảnh),
     N00 (Văn + năng khiếu âm nhạc). Danh sách nguyện vọng có các trường Mỹ thuật, Kiến trúc, Sân khấu – Điện ảnh, Âm nhạc, Nghệ thuật;
     mỗi trường ghi rõ khối xét tuyển, trường hợp khối được đưa lên đầu, trường nghệ thuật có thêm vòng thi năng khiếu (thang 10).
   · Học bổ túc văn hóa (giáo dục thường xuyên) cho người nghỉ học sớm: vừa đi làm vừa học buổi tối, xong THPT thì thi tốt nghiệp,
     rồi có thể thi đại học, học đại học vừa làm vừa học, hoặc xin việc đòi hỏi bằng cấp cao hơn.
   Điểm chuẩn, điểm năng khiếu trong game là mô phỏng. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, SC = E.SC, isVN = H.inVN;
  var EDU54 = E.EDUCATION54, WISH = E.DEC.study_wishes54;
  function fx(l, o) { H.fx(l, o); }
  function vnd(l) { return isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  function V(l, tr) { return vnd(l) ? tr : tr / 90 * l.base; }
  function mo(l, v) { return H.money(l, v); }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.flags.military && l.age < l.flags.military) && !(l.abroad && l.abroad.trapped); }
  function stress(l, d) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + d, 0, 100); }
  function sc(n) { return U.fmtNum(n, 2).replace(/,?0+$/, ''); }

  // ===================================================================
  // 1. KHỐI THI NĂNG KHIẾU
  // ===================================================================
  var NK_BLOCKS = { H00: 1, V00: 1, S00: 1, N00: 1 };
  E.KHOI.H00 = { n: 'Văn – Hình họa – Bố cục màu', m: ['art', 'edu'] };
  E.KHOI.V00 = { n: 'Toán – Lý – Vẽ mỹ thuật (kiến trúc)', m: ['art'] };
  E.KHOI.S00 = { n: 'Văn – Năng khiếu sân khấu, điện ảnh', m: ['art'] };
  E.KHOI.N00 = { n: 'Văn – Năng khiếu âm nhạc', m: ['art', 'edu'] };
  var KHOI_FOR_TALENT = { 'hội họa': 'H00', 'diễn xuất': 'S00', 'âm nhạc': 'N00' };
  // thêm các khối mới vào tình huống "Chọn khối thi" (tình huống được tạo trước khi có các khối này)
  var CK = E.DEC.chon_khoi;
  if (CK && CK.def) {
    CK.def.opts = CK.def.opts.filter(function (o) { return o.k !== 'H00'; });
    [['H00', 'Hợp ngành Hội họa, Thiết kế đồ họa – thời trang, Kiến trúc, Sư phạm mỹ thuật · thi vẽ năng khiếu', 'hội họa', 0.6],
      ['V00', 'Hợp ngành Kiến trúc, Quy hoạch, Thiết kế nội thất · thi Toán, Lý và Vẽ mỹ thuật', 'hội họa', 0.5],
      ['S00', 'Hợp ngành Diễn viên kịch – điện ảnh, Đạo diễn · thi diễn xuất, hát – múa, hình thể', 'diễn xuất', 0.3],
      ['N00', 'Hợp ngành Thanh nhạc, Nhạc cụ, Sư phạm âm nhạc · thi hát, xướng âm – thẩm âm', 'âm nhạc', 0.3]].forEach(function (x) {
      var k = x[0], K = E.KHOI[k];
      CK.def.opts.push({ k: k, l: 'Khối ' + k + ' (' + K.n + ')', h: x[1],
        ai: function (l) { return (l.talent === x[2] ? 6 : 1) * x[3]; },
        run: function (l, r, log) { l.khoi = k; l.flags.nkPrep = 1; log('Chọn khối ' + k + ' (' + K.n + '). Ngoài giờ học văn hóa, bạn đi học thêm năng khiếu ' + (k === 'S00' ? 'diễn xuất, hát – múa' : k === 'N00' ? 'thanh nhạc, xướng âm' : 'vẽ hình họa, bố cục màu') + ' để thi vào trường chuyên ngành.', 'neutral'); } });
    });
  }

  // ===================================================================
  // 2. TRƯỜNG NGHỆ THUẬT TRONG DANH SÁCH NGUYỆN VỌNG & XÉT THEO KHỐI
  // ===================================================================
  var SCHOOLS = EDU54.schools;
  // [mã, tên, miền, thành phố, mốc điểm văn hóa, ngành, khối xét, nội dung thi năng khiếu, tên ngành, nghề sau khi ra trường, năng khiếu phù hợp, điểm năng khiếu tối thiểu]
  [['mtvn', 'Trường Đại học Mỹ thuật Việt Nam', 'Bắc', 'Hà Nội', 17, ['art'], ['H00'], 'Hình họa (vẽ tượng) và Bố cục màu', 'Hội họa', ['hoa_si', 'thiet_ke', 'giao_vien'], 'hội họa', 5],
    ['mtcn', 'Trường Đại học Mỹ thuật Công nghiệp', 'Bắc', 'Hà Nội', 19, ['art'], ['H00'], 'Hình họa và Trang trí màu', 'Thiết kế đồ họa – thời trang', ['thiet_ke', 'tk_thoi_trang', 'fl_thiet_ke'], 'hội họa', 5.5],
    ['hau', 'Trường Đại học Kiến trúc Hà Nội', 'Bắc', 'Hà Nội', 21, ['art'], ['V00', 'H00'], 'Vẽ mỹ thuật (vẽ tượng)', 'Kiến trúc', ['kien_truc', 'thiet_ke'], 'hội họa', 5],
    ['skda', 'Trường Đại học Sân khấu – Điện ảnh Hà Nội', 'Bắc', 'Hà Nội', 15, ['art'], ['S00'], 'Diễn tiểu phẩm, hát – múa, đọc thơ và kiểm tra hình thể', 'Diễn viên kịch – điện ảnh', ['dien_vien', 'mc_tv', 'dao_dien'], 'diễn xuất', 6],
    ['hvan', 'Học viện Âm nhạc Quốc gia Việt Nam', 'Bắc', 'Hà Nội', 15, ['art'], ['N00'], 'Thanh nhạc, xướng âm – thẩm âm', 'Thanh nhạc', ['ca_si', 'nhac_si', 'giang_vien'], 'âm nhạc', 6.5],
    ['spnttw', 'Trường Đại học Sư phạm Nghệ thuật Trung ương', 'Bắc', 'Hà Nội', 16, ['edu', 'art'], ['H00', 'N00'], 'Vẽ hình họa – trang trí (mỹ thuật) hoặc hát – thẩm âm (âm nhạc)', 'Sư phạm Mỹ thuật – Âm nhạc', ['giao_vien', 'hoa_si', 'ca_si'], null, 5],
    ['hufa', 'Trường Đại học Nghệ thuật – Đại học Huế', 'Trung', 'Huế', 16, ['art'], ['H00'], 'Hình họa và Bố cục màu', 'Hội họa – Thiết kế', ['hoa_si', 'thiet_ke', 'fl_thiet_ke'], 'hội họa', 5],
    ['dau', 'Trường Đại học Kiến trúc Đà Nẵng', 'Trung', 'Đà Nẵng', 17, ['art'], ['V00', 'H00'], 'Vẽ mỹ thuật', 'Kiến trúc', ['kien_truc', 'thiet_ke'], 'hội họa', 5],
    ['hcmufa', 'Trường Đại học Mỹ thuật TP. Hồ Chí Minh', 'Nam', 'TP. Hồ Chí Minh', 17, ['art'], ['H00'], 'Hình họa và Bố cục màu', 'Hội họa', ['hoa_si', 'thiet_ke', 'giao_vien'], 'hội họa', 5],
    ['uah', 'Trường Đại học Kiến trúc TP. Hồ Chí Minh', 'Nam', 'TP. Hồ Chí Minh', 21, ['art'], ['V00', 'H00'], 'Vẽ mỹ thuật (vẽ tượng)', 'Kiến trúc', ['kien_truc', 'thiet_ke'], 'hội họa', 5],
    ['skdahcm', 'Trường Đại học Sân khấu – Điện ảnh TP. Hồ Chí Minh', 'Nam', 'TP. Hồ Chí Minh', 15, ['art'], ['S00'], 'Diễn tiểu phẩm, hát – múa và kiểm tra hình thể', 'Diễn viên kịch – điện ảnh', ['dien_vien', 'mc_tv'], 'diễn xuất', 6],
    ['nvhcm', 'Nhạc viện TP. Hồ Chí Minh', 'Nam', 'TP. Hồ Chí Minh', 15, ['art'], ['N00'], 'Thanh nhạc, xướng âm – thẩm âm', 'Thanh nhạc', ['ca_si', 'nhac_si'], 'âm nhạc', 6.5]
  ].forEach(function (x) {
    if (SCHOOLS.some(function (s) { return s.id === x[0]; })) return;
    SCHOOLS.push({ id: x[0], name: x[1], region: x[2], city: x[3], score: x[4], majors: x[5], blocks: x[6], nk: x[7], mn: x[8], jobs: x[9], talent: x[10], nkPass: x[11] });
  });
  // khối xét tuyển của các trường thường: theo ngành
  var BLOCKS = { it: ['A00', 'A01'], eco: ['A00', 'A01', 'D01'], med: ['B00'], edu: ['A00', 'B00', 'C00', 'D01'], law: ['A00', 'C00', 'D01'], art: ['H00'] };
  function school(id) { return SCHOOLS.filter(function (s) { return s.id === id; })[0]; }
  function blocksOf(u, m) {
    if (u.blocks) return u.blocks;
    var out = [];
    (m ? [m] : u.majors).forEach(function (x) { (BLOCKS[x] || []).forEach(function (b) { if (out.indexOf(b) < 0) out.push(b); }); });
    return out;
  }
  // chưa chọn khối (đời lưu cũ, học ở nước ngoài về…) thì không chặn hồ sơ
  function fits(l, u, m) { return !l.khoi || blocksOf(u, m).indexOf(l.khoi) >= 0; }
  function nkLabel(u) { return 'Thi năng khiếu: ' + u.nk + ' · cần ≥' + sc(u.nkPass) + '/10'; }
  function ct(x) { var u = school(x.school); return u ? u.name + ' · ' + (u.mn || E.MAJORS[x.major]) : ''; }
  // điểm thi năng khiếu (thang 10): ôn khối năng khiếu, luyện thi và năng khiếu thật quyết định
  function nkScore(l, u, r) {
    var match = u.talent ? l.talent === u.talent : /hội họa|âm nhạc/.test(l.talent || '');
    var s = (/S00|N00/.test(u.blocks.join()) ? 2.8 : 3.4) + (l.khoi && u.blocks.indexOf(l.khoi) >= 0 ? 0.8 : 0) + (l.flags.nkPrep ? 0.8 : 0) +
      (l.flags.tPrep || 0) * 0.8 + Math.max(0, l.flags.luyenThi || 0) * 0.3 + (match ? U.clamp(((l.skill || 20) - 30) / 18, 0, 3.5) : 0) + U.normal(r) * 0.9;
    return Math.round(U.clamp(s, 0, 10) * 4) / 4;
  }
  E.ARTS84 = { blocksOf: blocksOf, fits: fits, nkScore: nkScore, school: school };

  // hiển thị: trường hợp khối của bạn lên đầu, ghi rõ khối xét tuyển; trường nghệ thuật ghi nội dung thi năng khiếu
  var wm = WISH.make, wa = WISH.apply, wauto = WISH.auto;
  WISH.make = function (l) {
    var d = wm.apply(this, arguments), s = EDU54.state(l), K = l.khoi && E.KHOI[l.khoi];
    if (s.selected) {
      var u = school(s.selected);
      if (u) d.opts.forEach(function (o) {
        if (o.k.indexOf('major_') !== 0) return;
        var m = o.k.slice(6);
        if (u.nk) { o.l = u.mn + (u.majors.length > 1 && m === 'edu' ? ' (hệ sư phạm)' : ''); o.h = 'Mốc văn hóa mô phỏng ' + u.score + '/30 · ' + nkLabel(u); }
        o.h += ' · xét khối ' + blocksOf(u, m).join(', ') + (l.khoi ? fits(l, u, m) ? ' · ✓ hợp khối ' + l.khoi : ' · ✗ không xét khối ' + l.khoi + ' của bạn' : '');
      });
    } else if (s.region) {
      d.opts.forEach(function (o) {
        if (o.k.indexOf('school_') !== 0) return;
        var u = school(o.k.slice(7)); if (!u) return;
        o.h = u.city + ' · xét khối ' + blocksOf(u).join(', ') + (u.nk ? ' · có thi năng khiếu' : '') + (l.khoi ? fits(l, u) ? ' · ✓ hợp khối ' + l.khoi : '' : '');
        o._fit = !l.khoi ? 0 : fits(l, u) ? 2 : 0;
      });
      var back = d.opts.filter(function (o) { return o.k.indexOf('school_') !== 0; }), list = d.opts.filter(function (o) { return o.k.indexOf('school_') === 0; });
      list.sort(function (a, b) { return (b._fit || 0) - (a._fit || 0); });
      list.forEach(function (o) { delete o._fit; });
      d.opts = list.concat(back);
    } else {
      d.opts.forEach(function (o) { if (o.k.indexOf('remove_') === 0) { var x = s.wishes[+o.k.slice(7)]; if (x) o.l = 'Bỏ NV' + (+o.k.slice(7) + 1) + ': ' + ct(x); } });
    }
    var list2 = s.wishes.length ? s.wishes.map(function (x, i) { return 'NV' + (i + 1) + ': ' + ct(x); }).join('; ') : 'Chưa có nguyện vọng';
    d.text = list2 + '. ' + (K ? 'Bạn thi khối ' + l.khoi + ' (' + K.n + ') — chỉ trường xét khối này mới nhận hồ sơ' + (NK_BLOCKS[l.khoi] ? ', trường nghệ thuật có thêm vòng thi năng khiếu' : '') + '. ' : '') +
      'Chọn tối đa 5 trường/ngành theo thứ tự yêu thích. Xét nguyện vọng đầu tiên đủ điểm; điểm trong game là mô phỏng.';
    return d;
  };
  // máy tự chọn: chỉ chọn trường hợp khối
  WISH.auto = function (l, d, r) {
    var s = EDU54.state(l);
    if (s.region && !s.selected && l.khoi) {
      var fit = d.opts.filter(function (o) { var u = o.k.indexOf('school_') === 0 && school(o.k.slice(7)); return u && fits(l, u); });
      if (fit.length) {
        var score = Number.isFinite(l.examScore) ? l.examScore : 20;
        var ok = fit.filter(function (o) { return school(o.k.slice(7)).score <= score; });
        return (ok[0] || fit[fit.length - 1]).k;
      }
      return 'back';
    }
    if (s.selected && l.khoi) {
      var u = school(s.selected), m = u && u.majors.filter(function (x) { return fits(l, u, x); })[0];
      if (m) return 'major_' + m;
    }
    if (!s.selected && !s.region && !s.wishes.length && l.khoi && NK_BLOCKS[l.khoi]) {
      var regs = ['Bắc', 'Trung', 'Nam'].filter(function (g) { return SCHOOLS.some(function (u) { return u.region === g && fits(l, u); }); });
      if (regs.length) return 'region_' + U.pick(r, regs);
    }
    return wauto.apply(this, arguments);
  };
  // nộp hồ sơ: chỉ xét nguyện vọng hợp khối; trường nghệ thuật thi thêm năng khiếu
  WISH.apply = function (l, d, k, r, log) {
    if (k !== 'submit') return wa.apply(this, arguments);
    var s = EDU54.state(l);
    if (!WISH.valid(l, d.data) || d.data.view !== (s.selected || s.region || 'list') || !d.opts.some(function (o) { return o.k === k; }) || !s.wishes.length) return;
    s.submitted = true; s.kind = null;
    if (!Number.isFinite(l.examScore)) { l.examScore = E.rollExamScore(l, r); if (l.examScore >= 27) l.flags.scholar = true; } // GĐ6: cùng quy tắc học bổng với lượt thi chính
    log('Điểm xét tuyển: ' + U.fmtNum(l.examScore, 2) + '/30' + (l.khoi ? ' (khối ' + l.khoi + ')' : '') + '.', 'neutral');
    var found = null, nkDone = {};
    for (var i = 0; i < s.wishes.length && !found; i++) {
      var x = s.wishes[i], u = school(x.school); if (!u) continue;
      if (!fits(l, u, x.major)) { log('NV' + (i + 1) + ' (' + u.name + ') không xét khối ' + l.khoi + ' — hồ sơ không hợp lệ.', 'neutral'); continue; }
      var entryReason = EDU54.entryReason && EDU54.entryReason(l, u);
      if (entryReason) { log('NV' + (i + 1) + ' (' + u.name + ') không đủ điều kiện: ' + entryReason + '.', 'neutral'); continue; }
      if (u.nk) {
        var t = nkDone[u.id] != null ? nkDone[u.id] : (nkDone[u.id] = nkScore(l, u, r));
        var cult = l.examScore >= u.score;
        log('Thi năng khiếu tại ' + u.name + ' (' + u.nk + '): ' + sc(t) + '/10' + (t >= u.nkPass ? ' — đạt.' : ' — chưa đạt.') + (t >= u.nkPass && !cult ? ' Nhưng điểm văn hóa chưa đủ mốc ' + u.score + '.' : ''), t >= u.nkPass ? 'good' : 'neutral');
        if (t >= u.nkPass && cult) found = x;
      } else if (l.examScore >= EDU54.threshold(u, x.major) || EDU54.direct(l, x.major)) found = x;
    }
    if (!found) { log('Chưa đạt các nguyện vọng đã nộp. Bạn có thể ôn thi lại, học nghề hoặc đi làm.', 'neutral'); l.pending.unshift(E.DEC.uniFail.make(l, r)); return; }
    var a = school(found.school);
    s.admitted = { school: found.school, major: found.major, program: found.program, age: l.age };
    l.uniName = a.name; l.uniCity = a.city; l.uniTier = a.nk ? (a.score >= 19 ? 1.15 : 1.08) : a.score >= 25 ? 1.15 : 1; l.cityStudent = { city: a.city, since: l.age };
    E.DEC.major.apply(l, E.DEC.major.make(l), found.major, r, log);
    if (found.program) l.majorName = found.program;
    if (a.nk) {
      l.majorName = a.mn;
      // ra trường được gợi ý nghề đúng chuyên ngành (dùng chung luồng của các trường năng khiếu)
      l.flags.tSchool = { id: a.id, n: a.name, mn: a.mn, jobs: a.jobs.slice(), cd: false, at: l.age };
      if (a.talent && l.talent === a.talent) l.skill = Math.min(100, (l.skill || 20) + 3);
    }
    log('Trúng tuyển NV' + (s.wishes.indexOf(found) + 1) + ': ' + ct(found) + (!a.nk && EDU54.direct(l, found.major) ? ' · xét thành tích học sinh giỏi.' : '.'), 'big');
    H.mem(l, 'Nhập học ' + ct(found) + '.', 4);
  };

  // ===================================================================
  // 3. HỌC BỔ TÚC VĂN HÓA (GIÁO DỤC THƯỜNG XUYÊN) — vừa làm vừa học buổi tối
  // ===================================================================
  function gdtxOk(l) {
    if (!free(l)) return 'Không áp dụng lúc này';
    if (l.edu >= 3) return 'Đã có bằng tốt nghiệp phổ thông';
    if (l.school) return 'Đang đi học';
    if (l.flags.gdtx) return 'Đang học bổ túc';
    if (l.flags.hsFail && l.edu === 2 && l.age < 21) return 'Có thể đăng ký thi lại tốt nghiệp THPT';
    return true;
  }
  function fee(l) { return V(l, isVN(l) ? 4 : 8); }
  function startGdtx(l, lvl, years, log, note) {
    l.flags.gdtx = { country897:H.resCode(l), from: l.edu, lvl: lvl, until: l.age + years, start: l.age, fee: fee(l) };
    log(note, 'good'); fx(l, { hap: 3 }); stress(l, 4);
    H.mem(l, 'Năm ' + l.age + ' tuổi, bạn cắp sách đi học lại lớp buổi tối.', 4);
  }
  SC('bo_tuc', {
    title: function (l) { return isVN(l) ? 'Học bổ túc văn hóa' : 'Học lại phổ thông (lớp buổi tối)'; },
    valid: function (l) { return gdtxOk(l) === true; },
    text: function (l) {
      return 'Bạn mới học hết ' + E.EDU[l.edu] + '. ' + (isVN(l) ? 'Trung tâm giáo dục thường xuyên gần nhà mở lớp bổ túc buổi tối cho người đi làm' : 'Trường cộng đồng gần nhà mở lớp phổ thông buổi tối cho người lớn') +
        ' — học phí khoảng ' + mo(l, fee(l)) + '/năm, ban ngày vẫn đi làm bình thường. Có bằng tốt nghiệp phổ thông, bạn sẽ thi được đại học, học nghề bậc cao và ứng tuyển nhiều việc lương tốt hơn.';
    },
    opts: [
      { k: 'thcs', l: 'Học bổ túc THCS (lớp 6–9) buổi tối', h: '2 năm · xong thì học tiếp THPT', req: function (l) { return l.edu < 2; }, ai: { w: 0.6, smart: 0.6 },
        run: function (l, r, log) { startGdtx(l, 2, 2, log, 'Đăng ký học bổ túc THCS buổi tối. Ngồi học cùng lớp toàn những người đi làm như mình.'); } },
      { k: 'lien', l: 'Học liền bổ túc THCS và THPT', h: '5 năm · ra bằng tốt nghiệp THPT', req: function (l) { return l.edu < 2; }, ai: { w: 0.8, amb: 1 },
        run: function (l, r, log) { startGdtx(l, 3, 5, log, 'Đăng ký học bổ túc từ lớp 6 đến lớp 12 buổi tối — con đường dài nhưng bạn quyết tâm.'); } },
      { k: 'thpt', l: 'Học bổ túc THPT (lớp 10–12) buổi tối', h: '3 năm · thi tốt nghiệp THPT như học sinh chính quy', req: function (l) { return l.edu === 2; }, ai: { w: 1, amb: 1 },
        run: function (l, r, log) { startGdtx(l, 3, 3, log, 'Đăng ký học bổ túc THPT buổi tối. Ba năm nữa sẽ thi tốt nghiệp cùng các em học sinh.'); } },
      { k: 'no', l: 'Thôi, đi làm kiếm tiền đã', ai: { w: 1.2 }, run: function (l, r, log) { l.flags.gdtxNo = l.age; log('Gác lại chuyện học, tập trung đi làm.', 'neutral'); } }
    ]
  });
  E.ACT.push({ id: 'bo_tuc', g: 'Học tập', l: 'Học bổ túc văn hóa', min: 16, max: 60, sc: 'bo_tuc',
    avail: function (l) { return gdtxOk(l); }, ai: function (l) { return l.edu < 3 && l.age >= 18 && l.age <= 35 && l.money > 0 ? 0.08 : 0; } });
  // người nghỉ học sớm, đã đi làm: thỉnh thoảng có người gợi ý đi học lại
  E.TRIG.push({ id: 'bo_tuc', when: function (l, a) { return a >= 17 && a <= 40 && l.edu < 3 && gdtxOk(l) === true && (!!l.job || l.indep) && (l.flags.gdtxNo == null || a - l.flags.gdtxNo >= 6); }, p: 0.07, cd: 5, max: 3 });

  // mỗi năm: đóng học phí, học buổi tối; đến hạn thì nhận bằng
  E.HOOKS.year.push(gdtxYear);
  function gdtxYear(l, r, log, a) {
    var g = l.flags.gdtx; if (!g || !l.alive) return;
    if (!free(l) || (l.abroad && !l.abroad.perm)) { log('Hoàn cảnh thay đổi, bạn đành bỏ dở lớp bổ túc.', 'bad'); delete l.flags.gdtx; return; }
    if (l.indep) H.cash(l, -g.fee, 'Học phí bổ túc văn hóa');
    fx(l, { kno: 3, hea: l.job ? -1 : 0 }); stress(l, l.job ? 3 : 1);
    if (a < g.until - 1 && l.mind && l.mind.stress > 88 && r() < 0.3) { log('Vừa làm vừa học kiệt sức quá, bạn xin bảo lưu, nghỉ lớp bổ túc.', 'bad'); delete l.flags.gdtx; return; }
    // học liền: hết 2 năm đầu thì có bằng THCS
    if (g.lvl === 3 && l.edu < 2 && a >= g.until - 3) { l.edu = 2; log('Hoàn thành chương trình bổ túc THCS, học tiếp lên THPT buổi tối.', 'good'); }
    if (a + 1 < g.until) return;
    delete l.flags.gdtx;
    if (g.lvl === 2) {
      l.edu = Math.max(l.edu, 2); log('Nhận bằng tốt nghiệp THCS hệ bổ túc.', 'good'); fx(l, { hap: 4 });
      if (l.job) l.flags.upgradeJob = true;
      return;
    }
    // THPT: thi tốt nghiệp như học sinh chính quy (điểm thi, trượt thì được thi lại)
    l.edu = Math.max(l.edu, 3);
    log('Học xong chương trình bổ túc THPT sau ' + (a + 1 - g.start) + ' năm vừa làm vừa học.', 'good');
    log(isVN(l) ? 'Tốt nghiệp THPT.' : 'Tốt nghiệp trung học phổ thông.', 'good');
    l.flags.gdtxGrad = a;
    if(H.inVN(l))E.HOOKS.gradUpper.forEach(function (fn) { fn(l, r, log); });
    if (l.edu < 3) return; // trượt tốt nghiệp: đã hẹn thi lại
    H.mem(l, 'Ngày cầm tấm bằng tốt nghiệp THPT hệ bổ túc, ở tuổi ' + (a + 1) + '.', 5); fx(l, { hap: 8 });
    l.pending.push(E.DEC.bo_tuc_xong.make(l, r));
  }
  // sau khi có bằng THPT: học tiếp hay đổi việc
  SC('bo_tuc_xong', {
    title: 'Có bằng tốt nghiệp phổ thông rồi — tiếp theo?',
    valid: function (l) { return l.edu >= 3 && !l.school && free(l); },
    text: function (l) { return 'Tấm bằng tốt nghiệp THPT mở ra những cánh cửa trước đây đóng lại với bạn' + (l.job ? ' — đang làm ' + E.jobTitle(l) + '.' : '.'); },
    opts: [
      { k: 'dh', l: 'Đăng ký thi đại học chính quy', h: 'Học toàn thời gian, phải nghỉ việc nếu đỗ', req: function (l) { return !!(EDU54.applicant && EDU54.applicant(l)); }, ai: { w: 0.5, amb: 1 },
        run: function (l, r, log) { log('Quyết định đăng ký thi đại học như các bạn trẻ.', 'neutral'); EDU54.open(l, r); } },
      { k: 'tai_chuc', l: 'Học đại học vừa làm vừa học (buổi tối, cuối tuần)', h: function (l) { return '4 năm · giữ được việc làm · khoảng ' + mo(l, V(l, 15)) + '/năm'; }, ai: { w: 0.8, smart: 0.6 },
        run: function (l, r, log) { H.cash(l, -V(l, 15), 'Học phí đại học vừa làm vừa học'); H.sched(l, 'xong_van_bang', 4); log('Đăng ký học đại học hệ vừa làm vừa học — thêm bốn năm đi về muộn.', 'neutral'); stress(l, 5); } },
      { k: 'nghe', l: 'Học cao đẳng nghề để có tay nghề vững', h: '2 năm · nghỉ việc đi học', ai: { w: 0.5 },
        run: function (l, r, log) { if (l.job) { l.lastJob = l.job; l.job = null; l.income = 0; } l.school = 'voc'; l.schoolEnd = l.age + 2; l.flags.needJob = false; log('Nghỉ việc, vào học cao đẳng nghề.', 'neutral'); } },
      { k: 'viec', l: 'Đi tìm việc tốt hơn với tấm bằng mới', ai: { w: 1 },
        run: function (l, r, log) { l.flags.upgradeJob = true; if (!l.job) l.flags.needJob = true; log('Cập nhật hồ sơ xin việc: đã có bằng tốt nghiệp THPT.', 'good'); } }
    ]
  });
  if (E.MAJOR) { E.MAJOR.bo_tuc = 1; E.MAJOR.bo_tuc_xong = 1; }
  E.GDTX84 = { ok: gdtxOk, fee: fee, yearHook: gdtxYear };
})(G);
