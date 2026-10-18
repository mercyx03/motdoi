/* Một Đời — v3.3: sự kiện & cạm bẫy theo nhóm nghề (theo tài liệu "Sự kiện & cạm bẫy theo nhóm nghề").
   Nguyên tắc: mô phỏng hiện thực nhưng giữ cân bằng — lựa chọn liêm chính luôn có, sai phạm luôn có hậu quả (thường đến muộn,
   qua cơ chế "cờ chờ nổ"), cơ quan chức năng phát hiện và xử lý; mỗi nhóm có sự kiện tốt và người tử tế.
   Mọi nhân vật, tình huống đều hư cấu, không ám chỉ cá nhân hay tổ chức nào. */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC;
  function fx(l, o) { H.fx(l, o); }
  function ch(r, p) { return r() < p; }
  function pick(r, a) { return U.pick(r, a); }
  // khoản phạt / bồi thường lớn: tiền mặt không đủ thì chỉ mất phần đang có cộng một ít vay mượn — không đẩy nợ phình vô hạn
  function cB(l, x, why) { if (x < 0) x = Math.max(x, -(Math.max(0, l.money) / l.base + 1)); H.cash(l, x * l.base, why); }
  function mb(l, x) { return H.mb(l, x); }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function jid(l) { return l.job ? E.resolveJob(l.job.id) : ''; }
  function rk(l) { return l.job ? l.job.rank || 0 : 0; }
  function cat(l) { var c = l.job ? E.jobDef(l) : null; return c ? c.cat : ''; }
  function sec(l) { var c = l.job ? E.jobDef(l) : null; return c ? c.sec : ''; }
  function rep(l, d) { if (l.job) l.job.rep = U.clamp((l.job.rep || 50) + d, 0, 100); }
  function stress(l, d) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + d, 0, 100); }
  function fame(l, n) { l.fame = Math.max(0, (l.fame || 0) * (1 + n * 0.05) + n * 1500); }
  function phot(l) { l.phot = Math.min(3, (l.phot || 0) + 1); }
  function heat(l, d) { l.heat = U.clamp((l.heat || 0) + d, 0, 100); }
  function fire(l, log, t) { if (t) log(t, 'bad'); l.job = null; l.flags.needJob = true; fx(l, { hap: -6 }); }
  function arrest(l, why, sev) { if ((l.sched || []).some(function (s) { return s.id === 'bi_bat'; }) || (l.jailUntil != null && l.age < l.jailUntil)) return; H.sched(l, 'bi_bat', 0, { why: why, sev: sev || 1 }); } // không bị bắt hai lần cùng lúc
  function promote(l) { var c = l.job ? E.jobDef(l) : null; if (c && l.job.rank < c.t.length - 1 && (!E.canAdvance || E.canAdvance(l, c, false))) { l.job.rank++; l.job.yrs = 0; l.job.rankSince = l.age; l.job.rankTracked = l.job.rank; return true; } return false; }

  // ---------- cơ chế "cờ chờ nổ": lựa chọn sai lúc này, hậu quả đến vài năm sau (giữ cả khi đổi nghề, nghỉ hưu) ----------
  var TRAPS = {}, JOBS2 = {};
  E.JOBS2 = JOBS2;
  function trap(l, key) { (l.flags.traps = l.flags.traps || {})[key] = l.age; }
  function TR(key, p, run) { TRAPS[key] = { p: p, run: run }; }
  E.TRAPS = TRAPS;
  E.HOOKS.year.push(function (l, r, log, a) {
    if (!l.alive) return;
    var T = l.flags.traps || {};
    for (var k in T) { var D = TRAPS[k]; if (!D || a - T[k] < 1) continue; if (ch(r, typeof D.p === 'function' ? D.p(l, a - T[k]) : D.p)) { delete T[k]; D.run(l, r, log); if (!l.alive) return; } else if (a - T[k] > 12) delete T[k]; }
    // hậu quả kéo dài
    if (l.flags.dauLung) fx(l, { hea: -1.5 });
    if (l.flags.nailPhoi && a >= 45 && !l.flags.nailPhoiNote) { l.flags.nailPhoiNote = true; log('Ho kéo dài, khó thở: bác sĩ nói phổi tổn thương do hít hóa chất làm móng nhiều năm.', 'bad'); fx(l, { hea: -10 }); }
    if (l.flags.tangLuc >= 3 && !l.flags.timMach) { l.flags.timMach = true; log('Nhiều năm thức đêm, uống nước tăng lực để lái xe — tim bắt đầu đập loạn nhịp.', 'bad'); fx(l, { hea: -10 }); }
    // "nhiệt" của người làm nghề phi pháp: càng ở lâu càng dễ bị bắt
    if (sec(l) === 'crime') { heat(l, 6); if (ch(r, (l.heat || 0) / 500)) { var c = E.jobDef(l); arrest(l, c && c.crime ? c.crime[3] : 'hoạt động phi pháp', 2); } }
    else if (l.heat) heat(l, -10);
    // "phốt" làm người nổi tiếng dễ dính scandal
    if (l.phot && (l.fame || 0) > 1e4 && E.DEC.scandal && ch(r, 0.1 * l.phot)) { H.sched(l, 'scandal', 0); l.phot--; }
  });

  // ---------- định nghĩa gọn ----------
  // jobs: mảng id nghề, hoặc 'free' / 'crime' / 'biz' / 'fame' / '*' (mọi nghề)
  function okJob(l, jobs) {
    if (!l.job) return false;
    if (jobs === '*') return sec(l) !== 'crime';
    if (jobs === 'free') return cat(l) === 'free';
    if (jobs === 'crime') return sec(l) === 'crime';
    if (jobs === 'biz') return cat(l) === 'biz';
    return jobs.indexOf(jid(l)) >= 0;
  }
  function J(id, jobs, rmin, rmax, p, cd, title, text, opts, extra) {
    var when = function (l, a) { return okJob(l, jobs) && rk(l) >= rmin && rk(l) <= rmax && free(l) && (!extra || extra(l, a)); };
    JOBS2[id] = jobs;
    SC(id, { title: title, valid: function (l) { return when(l, l.age); }, text: text, opts: opts.map(function (o) { var fn = typeof o[3] === 'function'; return { k: o[0], l: o[1], h: fn ? '' : o[3] || '', ai: o[2], run: fn ? o[3] : o[4] }; }) });
    E.TRIG.push({ id: id, when: when, p: p, cd: cd, max: 2 });
  }
  // o(k, nhãn, ai, chạy) hoặc o(k, nhãn, ai, gợi ý, chạy)
  var HON = { w: 1.3, bad: -0.5 }, BAD = { bad: 1.2, risk: 0.6, w: 0.6 }, MID = { w: 0.9 };

  // ===================================================================
  // LAO ĐỘNG TỰ DO, NÔNG NGHIỆP, LAO ĐỘNG NƯỚC NGOÀI
  // ===================================================================
  J('ld_tai_nan_lao_dong', ['phu_ho', 'giup_viec', 'shipper', 'xe_om'], 0, 9, 0.08, 3, 'Tai nạn khi làm việc', 'Trượt ngã khi đang làm, phải nghỉ hai tháng. Chủ thầu chỉ gửi "tiền thuốc" 2 triệu rồi thôi.', [
    ['nhan', 'Nhận rồi thôi', MID, function (l, r, log) { cB(l, -0.4, 'Nghỉ làm vì tai nạn'); fx(l, { hea: -8 }); log('Nằm nhà hai tháng, tiền thuốc tự lo, không ai bồi thường.', 'bad'); }],
    ['phap_ly', 'Nhờ trợ giúp pháp lý đòi bồi thường', HON, function (l, r, log) { if (ch(r, 0.5)) { cB(l, 0.6, 'Bồi thường tai nạn lao động'); fx(l, { soc: -3 }); log('Trợ giúp viên pháp lý giúp bạn đòi được tiền bồi thường đúng luật, dù mất mối việc với chủ thầu.', 'good'); } else { fx(l, { hap: -4 }); log('Đi lại khiếu nại mấy tháng, chủ thầu lẩn tránh, chưa đòi được.', 'neutral'); } }],
    ['lam_ngay', 'Đi làm lại ngay khi chưa lành', { risk: 0.8, w: 0.6 }, function (l, r, log) { cB(l, 0.2, 'Đi làm sớm'); l.flags.dauLung = true; log('Gồng mình đi làm khi lưng chưa lành — từ đó cứ trở trời là đau.', 'bad'); }]]);
  J('ld_app_khoa_tk', ['tx_cn', 'shipper'], 0, 9, 0.12, 2, 'Ứng dụng khóa tài khoản', 'Ứng dụng gọi xe khóa tài khoản của bạn vì một khách báo cáo sai, trong khi xe vẫn đang trả góp.', [
    ['khieu_nai', 'Khiếu nại, chờ xét lại', HON, function (l, r, log) { cB(l, -0.15, 'Nghỉ chạy chờ mở khóa'); stress(l, 10); log('Ba tuần chờ đợi, cuối cùng ứng dụng xác nhận khách báo sai và mở khóa.', 'neutral'); }],
    ['doi_app', 'Chuyển sang chạy ứng dụng khác', MID, function (l, r, log) { if (ch(r, 0.7)) log('Chuyển sang ứng dụng khác, vài tuần là quen khách mới.', 'neutral'); else { cB(l, -0.15, 'Thu nhập giảm khi đổi ứng dụng'); log('Ứng dụng mới ít khách, cả năm thu nhập giảm hẳn.', 'bad'); } }],
    ['mua_tk', 'Mua tài khoản của người khác chạy tạm', BAD, function (l, r, log) { cB(l, 0.1, 'Chạy tài khoản mượn'); if (ch(r, 0.25)) { fx(l, { karma: -4 }); fire(l, log, 'Bị phát hiện chạy tài khoản của người khác — khóa vĩnh viễn, mất luôn nghề chạy xe.'); } else log('Chạy tạm bằng tài khoản mua lại, lúc nào cũng nơm nớp.', 'neutral'); }]]);
  J('ld_giup_viec_nghi_trom', ['giup_viec'], 0, 9, 0.07, 4, 'Bị nghi lấy trộm', 'Nhà chủ mất chiếc nhẫn, nghi bạn lấy, đòi khám đồ.', [
    ['cho_kham', 'Đồng ý cho khám', MID, function (l, r, log) { if (ch(r, 0.5)) fire(l, log, 'Khám không thấy gì, nhưng nhà chủ vẫn cho nghỉ việc "cho yên tâm".'); else log('Khám không thấy gì, nhà chủ ngượng ngùng xin lỗi.', 'neutral'); fx(l, { hap: -6 }); }],
    ['nghi', 'Từ chối, nghỉ việc ngay', { w: 0.7 }, function (l, r, log) { cB(l, -0.05, 'Mất lương tháng cuối'); fire(l, log, 'Tự ái, xin nghỉ ngay, mất luôn tháng lương cuối.'); }],
    ['cong_an', 'Nhờ công an phường làm rõ', HON, function (l, r, log) { if (ch(r, 0.6)) { cB(l, 0.1, 'Chủ nhà tăng lương'); fx(l, { karma: 2, hap: 4 }); log('Công an phường đến làm rõ: chiếc nhẫn kẹt sau tủ. Chủ nhà xin lỗi và tăng lương cho bạn.', 'good'); } else { fx(l, { hap: -4 }); log('Không tìm ra nhẫn, hai bên đành chia tay trong im lặng.', 'neutral'); fire(l, log); } }]]);
  J('ld_bao_ve_dem', ['bao_ve'], 0, 9, 0.06, 3, 'Ca trực đêm', 'Ca đêm, bạn thấy một nhóm người lạ đang cắt khóa kho hàng.', [
    ['goi', 'Gọi 113 và quản lý, giữ khoảng cách', HON, function (l, r, log) { rep(l, 8); cB(l, 0.2, 'Thưởng bảo vệ tài sản'); log('Công an đến kịp, bắt quả tang nhóm trộm. Công ty thưởng nóng cho bạn.', 'good'); fx(l, { karma: 3 }); }],
    ['xong', 'Xông ra một mình', { risk: 1.2 }, function (l, r, log) { if (ch(r, 0.4)) { fx(l, { hea: -20 }); log('Một mình xông ra, bị đánh trọng thương phải nhập viện.', 'bad'); } else { fame(l, 3); fx(l, { hap: 6 }); log('Một mình đuổi được cả nhóm trộm, báo địa phương gọi bạn là "người hùng ca đêm".', 'good'); } }],
    ['lo', 'Giả vờ không thấy', BAD, function (l, r, log) { fx(l, { karma: -3 }); if (ch(r, 0.3)) { fx(l, { karma: -2 }); fire(l, log, 'Camera ghi lại cảnh bạn làm ngơ — bị đuổi việc.'); } else log('Sáng ra kho mất hàng, bạn im lặng.', 'neutral'); }]]);
  J('nong_thuong_lai_ep_gia', ['nong', 'sau_rieng', 'nuoi_tom'], 0, 9, 0.2, 2, 'Được mùa mất giá', 'Được mùa nhưng thương lái chỉ trả bằng nửa giá năm ngoái, hàng thì sắp hỏng.', [
    ['ban', 'Bán luôn cho xong', MID, function (l, r, log) { cB(l, -0.3, 'Bán rẻ cho thương lái'); log('Bán đổ bán tháo, cả vụ coi như hòa vốn.', 'bad'); }],
    ['online', 'Chia nhỏ, nhờ người quen bán online', { w: 1, soc: 0.6 }, function (l, r, log) { if (ch(r, 0.5)) { log('Con cháu đăng bán online, bạn bè khắp nơi đặt mua — vụ này hòa vốn.', 'good'); fx(l, { soc: 3 }); } else { cB(l, -0.15, 'Hàng hỏng một phần'); log('Bán được một ít, phần còn lại hỏng mất.', 'neutral'); } }],
    ['giu', 'Giữ lại chờ giá lên', { risk: 0.8 }, function (l, r, log) { if (ch(r, 0.45)) { cB(l, 0.3, 'Bán được giá'); log('Một tháng sau giá lên lại, bán được giá cao.', 'good'); } else { cB(l, -0.4, 'Hàng hỏng chờ giá'); log('Chờ mãi giá không lên, hàng hỏng gần hết.', 'bad'); } }]]);
  J('nong_phan_gia', ['nong', 'sau_rieng', 'nuoi_tom'], 0, 9, 0.1, 3, 'Phân bón, thuốc giá rẻ', 'Đại lý quen chào loại phân bón / thuốc tôm "hàng công ty" rẻ hơn 30%.', [
    ['chinh_hang', 'Chỉ mua hàng chính hãng', HON, function (l, r, log) { log('Mua đúng hàng chính hãng, đắt hơn nhưng yên tâm.', 'neutral'); }],
    ['re', 'Mua hàng rẻ cho đỡ', BAD, function (l, r, log) { cB(l, 0.1, 'Tiết kiệm tiền phân'); trap(l, 'phan_gia'); log('Mua lô phân thuốc giá rẻ, năm nay đỡ được một khoản.', 'neutral'); }]]);
  TR('phan_gia', 0.5, function (l, r, log) { cB(l, -0.8, 'Mất mùa vì phân thuốc giả'); fx(l, { hap: -8 }); log('Lô phân thuốc giá rẻ năm trước hóa ra là hàng giả — cả vụ mất trắng.', 'bad'); });
  J('nong_sau_rieng_coc', ['sau_rieng'], 1, 9, 0.12, 2, 'Thương lái đặt cọc', 'Thương lái đặt cọc mua cả vườn, giá cao hơn chợ 15%, cọc 10%.', [
    ['cong_chung', 'Ký hợp đồng có công chứng', HON, function (l, r, log) { cB(l, 0.3, 'Bán vườn theo hợp đồng'); log('Hợp đồng rõ ràng, giá có rớt thương lái vẫn phải mua đủ.', 'good'); }],
    ['mieng', 'Thỏa thuận miệng cho nhanh', { risk: 0.8 }, function (l, r, log) { if (ch(r, 0.35)) { cB(l, -0.6, 'Thương lái bỏ cọc'); log('Giá rớt, thương lái bỏ cọc. Vườn chín rụng đầy gốc.', 'bad'); fx(l, { hap: -8 }); } else log('May mà thương lái giữ lời, mua đủ cả vườn.', 'good'); }]]);
  J('ngu_bien_dong', ['ngu_dan'], 0, 9, 0.1, 2, 'Biển động', 'Đang ra khơi, đài báo áp thấp nhiệt đới mạnh lên, cá thì đang vào lưới.', [
    ['vao_bo', 'Quay vào bờ ngay', HON, function (l, r, log) { cB(l, -0.15, 'Tiền dầu chuyến đi dở'); log('Quay tàu vào bờ tránh bão, mất tiền dầu nhưng cả tàu an toàn.', 'neutral'); }],
    ['them', 'Thả thêm một mẻ lưới', { risk: 1.3 }, function (l, r, log) { if (ch(r, 0.7)) { cB(l, 0.4, 'Mẻ cá lớn'); log('Kịp thu mẻ cá đầy khoang rồi chạy về trước khi bão tới.', 'good'); } else if (ch(r, 0.04)) { H.kill(l, 'gặp nạn trên biển khi bão tới', log, true); } else { fx(l, { hea: -25 }); cB(l, -0.5, 'Mất ngư cụ trong bão'); log('Tàu gặp sóng lớn, mất hết ngư cụ, bạn bị thương nặng.', 'bad'); } }]]);
  J('ve_chai_do_co', ['ve_chai'], 0, 9, 0.05, 5, 'Chiếc tủ cũ', 'Thu mua được chiếc tủ cũ, bên trong có xấp tiền và giấy tờ của một cụ già.', [
    ['tra', 'Tìm cách trả lại', HON, function (l, r, log) { fx(l, { karma: 8, hap: 4 }); if (ch(r, 0.5)) cB(l, 0.2, 'Gia đình cụ cảm ơn'); log('Lần theo địa chỉ trên giấy tờ, trả lại cho gia đình cụ. Cả nhà họ cảm động rơi nước mắt.', 'good'); H.mem(l, 'Ngày trả lại xấp tiền trong chiếc tủ cũ.', 4); }],
    ['giu', 'Giữ tiền, đốt giấy tờ', BAD, function (l, r, log) { cB(l, 0.5, 'Tiền trong tủ cũ'); fx(l, { karma: -10 }); log('Giữ lại xấp tiền. Đêm đó trằn trọc mãi.', 'bad'); }]]);
  J('xkld_chu_giu_ho_chieu', ['xkld'], 0, 9, 0.15, 3, 'Bị giữ hộ chiếu', 'Chủ sử dụng giữ hộ chiếu, bắt làm thêm giờ không lương.', [
    ['dsq', 'Liên hệ đại sứ quán, công đoàn', HON, function (l, r, log) { if (ch(r, 0.6)) { log('Đại sứ quán can thiệp, bạn được chuyển sang chủ mới tử tế hơn.', 'good'); fx(l, { hap: 4 }); } else { log('Bị cho về nước sớm, hợp đồng dang dở.', 'bad'); if (l.abroad) l.abroad.until = l.age + 1; } }],
    ['bo_tron', 'Bỏ trốn ra ngoài làm chui', BAD, function (l, r, log) { l.flags.lamChui = true; trap(l, 'lam_chui'); cB(l, 0.4, 'Làm chui lương cao'); log('Bỏ trốn ra ngoài làm chui, lương cao hơn nhưng lúc nào cũng sợ bị bắt.', 'neutral'); }],
    ['chiu', 'Cam chịu đến hết hợp đồng', MID, function (l, r, log) { stress(l, 20); fx(l, { hea: -6 }); log('Cắn răng chịu đựng, đếm từng ngày hết hợp đồng.', 'bad'); }]]);
  TR('lam_chui', 0.3, function (l, r, log) { log('Bị cảnh sát nước sở tại bắt vì cư trú bất hợp pháp, trục xuất về nước và cấm nhập cảnh nhiều năm.', 'bad'); if (l.abroad) l.abroad.until = l.age + 1; fx(l, { hap: -10 }); });

  // ===================================================================
  // CÔNG NHÂN & THỢ
  // ===================================================================
  J('cn_cat_giam', ['cong_nhan', 'tho_may'], 0, 9, 0.1, 3, 'Cắt giảm nhân sự', 'Nhà máy mất đơn hàng, cắt giảm 30% công nhân, ưu tiên giữ người dưới 35 tuổi.', [
    ['hoc_nghe', 'Nhận trợ cấp thất nghiệp, đi học nghề mới', { w: 1 }, function (l, r, log) { fx(l, { kno: 5 }); fire(l, log, 'Nhận trợ cấp thất nghiệp, đăng ký học nghề mới.'); }],
    ['chuyen', 'Xin chuyển bộ phận khác, lương thấp hơn', MID, function (l, r, log) { if (l.age >= 35 && ch(r, 0.5)) { fire(l, log, 'Đã ngoài 35 tuổi, tên bạn vẫn nằm trong danh sách cắt giảm.'); return; } cB(l, -0.15, 'Chuyển bộ phận lương thấp'); log('Được giữ lại ở bộ phận khác, lương thấp hơn một chút.', 'neutral'); }]]);
  J('cn_dinh_cong', ['cong_nhan'], 0, 1, 0.06, 4, 'Ngừng việc tập thể', 'Cả xưởng rủ nhau ngừng việc vì bị cắt tiền chuyên cần.', [
    ['tham_gia', 'Tham gia cùng mọi người', { soc: 1 }, function (l, r, log) { if (ch(r, 0.6)) { cB(l, 0.1, 'Công ty trả lại chuyên cần'); fx(l, { soc: 4 }); log('Công đoàn vào cuộc đối thoại, công ty trả lại tiền chuyên cần.', 'good'); } else { log('Công ty không nhượng bộ, tên bạn bị ghi vào sổ, khó lên tổ trưởng.', 'neutral'); l.job.rep = Math.max(0, (l.job.rep || 50) - 10); } }],
    ['di_lam', 'Vẫn đi làm bình thường', MID, function (l, r, log) { fx(l, { soc: -6 }); rep(l, 5); log('Vẫn đi làm, đồng nghiệp xa lánh, quản đốc thì để ý.', 'neutral'); }]]);
  J('tho_dien_dau_tat', ['tho_dien'], 0, 9, 0.12, 2, 'Đấu điện "tắt"', 'Chủ nhà muốn bạn đấu điện qua công tơ để đỡ tiền điện, trả công gấp ba.', [
    ['tu_choi', 'Từ chối', HON, function (l, r, log) { fx(l, { karma: 2 }); log('Từ chối thẳng: "Làm vậy là trộm điện, cháy nổ ai chịu?"', 'good'); }],
    ['lam', 'Làm cho xong', BAD, function (l, r, log) { cB(l, 0.2, 'Công đấu điện'); trap(l, 'dien_tat'); log('Nhận làm, cầm tiền công gấp ba.', 'neutral'); }]]);
  TR('dien_tat', 0.3, function (l, r, log) { cB(l, -0.2, 'Bị phạt vì đấu điện trái phép'); rep(l, -15); log('Điện lực phát hiện đường dây đấu trái phép bạn làm năm trước — bị phạt và nêu tên.', 'bad'); });
  J('tho_dien_giat', ['tho_dien', 'ky_thuat_vien', 'ky_su_co_dien'], 0, 9, 0.05, 4, 'Sửa điện đang có tải', 'Phải sửa gấp lưới điện đang có tải; cắt điện thì cả xưởng phải ngừng.', [
    ['dung_quy_trinh', 'Đòi cắt điện, làm đúng quy trình', HON, function (l, r, log) { rep(l, -3); log('Bị mắng vì làm chậm, nhưng an toàn.', 'neutral'); }],
    ['lam_nong', 'Làm nóng cho kịp', { risk: 1.2 }, function (l, r, log) { if (ch(r, 0.85)) { rep(l, 5); log('Sửa xong khi điện vẫn chạy, cả xưởng khen nhanh.', 'neutral'); } else { fx(l, { hea: -30 }); log('Bị điện giật, ngã từ thang xuống, nằm viện cả tháng.', 'bad'); } }]]);
  J('sua_xe_khach_ep', ['tho_sua_xe'], 1, 9, 0.15, 2, 'Báo giá "đẹp"', 'Khách quen nhờ báo giá sửa xe "đẹp" để đòi bảo hiểm gấp đôi.', [
    ['dung', 'Báo đúng giá', HON, function (l, r, log) { fx(l, { karma: 2 }); log('Báo đúng giá, khách giận bỏ đi, nhưng bạn ngủ ngon.', 'neutral'); }],
    ['lam_theo', 'Làm theo ý khách', BAD, function (l, r, log) { cB(l, 0.1, 'Báo giá khống'); trap(l, 'sua_xe_bh'); log('Ghi hóa đơn khống cho khách.', 'neutral'); }]]);
  TR('sua_xe_bh', 0.2, function (l, r, log) { rep(l, -20); log('Bảo hiểm giám định ra hóa đơn khống — tiệm bị đưa vào danh sách đen.', 'bad'); });
  J('bep_ve_sinh', ['dau_bep'], 0, 9, 0.12, 2, 'Lô thịt sắp quá hạn', 'Kho có lô thịt sắp quá hạn, chủ bảo "ướp kỹ là được".', [
    ['tu_choi', 'Từ chối dùng, báo chủ', HON, function (l, r, log) { if (ch(r, 0.5)) cB(l, -0.03, 'Bị trừ lương'); fx(l, { karma: 3 }); log('Nhất quyết không nấu thịt hỏng.', 'good'); }],
    ['nau', 'Nấu theo lời chủ', BAD, function (l, r, log) { if (ch(r, 0.2)) { fx(l, { karma: -6 }); fire(l, log, 'Khách bị ngộ độc thực phẩm, nhà hàng bị đình chỉ, bạn mất việc.'); } else log('Không ai bị sao, nhưng lòng bạn không yên.', 'neutral'); }],
    ['nghi', 'Lặng lẽ nghỉ, chuyển chỗ khác', MID, function (l, r, log) { fx(l, { hap: -3 }); log('Không muốn dính vào, bạn xin nghỉ tìm chỗ khác.', 'neutral'); fire(l, log); }]]);
  J('bep_cuoc_thi', ['dau_bep'], 1, 9, 0.05, 5, 'Thi nấu ăn trên truyền hình', 'Bạn được mời tham gia một cuộc thi nấu ăn trên truyền hình.', [
    ['thi', 'Tham gia', { w: 1.2, amb: 1 }, function (l, r, log) { if (ch(r, 0.3)) { fame(l, 6); promote(l); log('Vào đến chung kết! Nhà hàng đông khách hẳn, bạn được lên bếp trưởng.', 'big'); } else { fame(l, 1); log('Dừng bước ở vòng loại, nhưng học được nhiều.', 'neutral'); } }],
    ['khong', 'Từ chối', MID, function (l, r, log) { log('Từ chối, tập trung cho căn bếp của mình.', 'neutral'); }]]);
  J('net_tre_tron_hoc', ['quan_net'], 0, 9, 0.2, 2, 'Học sinh trốn học', 'Một nhóm học sinh trốn học ngồi quán net cả ngày; phụ huynh tìm đến làm ầm.', [
    ['nhac', 'Không cho chơi trong giờ học', HON, function (l, r, log) { cB(l, -0.03, 'Doanh thu giảm'); fx(l, { karma: 2 }); log('Treo biển không phục vụ học sinh trong giờ học. Phụ huynh trong xóm quý hẳn.', 'good'); }],
    ['ke', 'Kệ, khách là khách', BAD, function (l, r, log) { if (ch(r, 0.25)) { cB(l, -0.1, 'Bị phạt giờ mở cửa'); log('Phường kiểm tra, quán bị phạt vì phục vụ học sinh trong giờ học.', 'bad'); } else log('Phụ huynh làm ầm một lúc rồi kéo con về.', 'neutral'); }]]);
  J('tai_xe_qua_tai', ['tai_xe_tai'], 0, 9, 0.2, 2, 'Chở quá tải', 'Chủ hàng muốn chở quá tải 40%, trả thêm tiền cho bạn.', [
    ['tu_choi', 'Từ chối', HON, function (l, r, log) { log('Từ chối, mất một mối hàng.', 'neutral'); fx(l, { karma: 1 }); }],
    ['cho', 'Chở luôn', BAD, function (l, r, log) { cB(l, 0.15, 'Tiền chở quá tải'); if (ch(r, 0.05)) { fx(l, { hea: -30, karma: -5 }); log('Xe quá tải mất phanh khi xuống dốc, lật xe — bạn bị thương nặng.', 'bad'); } else if (ch(r, 0.25)) { cB(l, -0.1, 'Phạt quá tải'); log('Bị trạm cân phạt, tước bằng lái 2 tháng.', 'bad'); } else log('Chạy trót lọt, nhưng xe xuống cấp nhanh.', 'neutral'); }]]);
  J('tai_xe_ngu_gat', ['tai_xe_tai'], 0, 9, 0.15, 1, 'Buồn ngủ trên đường', 'Đã lái 14 tiếng, còn 200 km nữa là giao hàng đúng hẹn.', [
    ['nghi', 'Nghỉ ở trạm dừng', HON, function (l, r, log) { cB(l, -0.05, 'Trễ hàng bị phạt'); log('Ngủ một giấc ở trạm dừng, giao trễ nhưng an toàn.', 'neutral'); }],
    ['tang_luc', 'Uống nước tăng lực chạy tiếp', { risk: 1 }, function (l, r, log) { l.flags.tangLuc = (l.flags.tangLuc || 0) + 1; if (ch(r, 0.08)) { fx(l, { hea: -30 }); log('Ngủ gật, xe đâm vào dải phân cách — may còn sống.', 'bad'); } else log('Mắt cay xè nhưng giao hàng đúng hẹn.', 'neutral'); }]]);
  J('mo_sap_lo', ['tho_mo'], 0, 9, 0.05, 3, 'Tiếng nứt trong lò', 'Đường lò có tiếng nứt lạ, ca trưởng vẫn bảo làm tiếp cho kịp sản lượng.', [
    ['dung', 'Báo cáo, đề nghị dừng lò', HON, function (l, r, log) { if (ch(r, 0.4)) { rep(l, 15); fame(l, 2); log('Lò dừng chưa đầy một giờ thì sập thật — cả ca thoát nạn nhờ bạn.', 'big'); H.mem(l, 'Ngày cả ca thoát chết vì bạn dám đề nghị dừng lò.', 5); } else { rep(l, -5); log('Dừng lò kiểm tra, không có gì; ca trưởng cằn nhằn.', 'neutral'); } }],
    ['lam', 'Làm tiếp', { risk: 1.2 }, function (l, r, log) { if (ch(r, 0.1)) { if (ch(r, 0.3)) { H.kill(l, 'sập lò khi đang làm việc', log, true); return; } fx(l, { hea: -40 }); log('Lò sập, bạn bị vùi lấp, được đồng đội cứu ra.', 'bad'); } else log('Hết ca bình an.', 'neutral'); }]]);
  J('gian_khoan_thoi_tiet', ['gian_khoan', 'thuyen_vien'], 0, 9, 0.08, 3, 'Bão ngoài khơi', 'Bão ngoài khơi, chưa có trực thăng đưa về; mạng chập chờn, gia đình lo lắng.', [
    ['binh_tinh', 'Giữ bình tĩnh, làm đúng quy trình', HON, function (l, r, log) { stress(l, 10); if (ch(r, 0.1)) { fx(l, { hea: -15 }); log('Sự cố trong bão, bạn bị thương nhẹ.', 'bad'); } else log('Mấy ngày bão qua đi, mọi người an toàn.', 'neutral'); }],
    ['doi_ve', 'Đòi về bằng được', MID, function (l, r, log) { rep(l, -8); log('Gây căng thẳng với chỉ huy; bão tan mới được về.', 'neutral'); }]]);
  J('thuyen_vien_hang_cam', ['thuyen_vien'], 1, 9, 0.05, 4, 'Container khai sai', 'Phát hiện container khai báo sai, có thể là hàng cấm; thuyền trưởng bảo im.', [
    ['bao', 'Báo cáo cảng vụ', HON, function (l, r, log) { fx(l, { karma: 5 }); if (ch(r, 0.5)) fire(l, log, 'Báo cáo xong, công ty cho bạn nghỉ việc.'); else { rep(l, 8); log('Cảng vụ thu giữ hàng cấm, bạn được khen.', 'good'); } }],
    ['im', 'Im lặng', BAD, function (l, r, log) { if (ch(r, 0.15)) { log('Tàu bị bắt, cả đoàn bị điều tra.', 'bad'); arrest(l, 'liên quan vận chuyển hàng cấm', 1); } else log('Chuyến hàng trót lọt, bạn mất ngủ cả tuần.', 'neutral'); }]]);

  // ===================================================================
  // BUÔN BÁN & KINH DOANH, BÁN HÀNG
  // ===================================================================
  J('kd_hang_nhai', ['kd_online', 'sale_mp', 'kd_tap_hoa'], 0, 9, 0.15, 2, 'Hàng "xách tay" giá rẻ', 'Mối hàng chào mỹ phẩm, sữa "xách tay" giá chỉ bằng 40% hàng chính hãng, lời gấp ba.', [
    ['hoa_don', 'Chỉ bán hàng có hóa đơn', HON, function (l, r, log) { log('Từ chối, chỉ bán hàng rõ nguồn gốc.', 'neutral'); }],
    ['nhap', 'Nhập về bán', BAD, function (l, r, log) { cB(l, 0.3, 'Lời hàng xách tay'); trap(l, 'hang_gia'); log('Nhập lô hàng giá rẻ, bán chạy như tôm tươi.', 'neutral'); }]]);
  TR('hang_gia', 0.25, function (l, r, log) { cB(l, -0.5, 'Bị phạt hàng không rõ nguồn gốc'); rep(l, -20); log('Quản lý thị trường kiểm tra, tịch thu lô hàng không rõ nguồn gốc, phạt nặng. Khách hàng bỏ đi.', 'bad'); });
  J('kd_bom_hang', ['kd_online', 'kd_tu_do'], 1, 9, 0.08, 3, 'Khách sỉ xin trả chậm', 'Khách sỉ quen đặt lô hàng lớn, xin trả chậm 60 ngày.', [
    ['coc', 'Đòi cọc 30%', HON, function (l, r, log) { if (ch(r, 0.5)) log('Khách không chịu cọc, mất đơn.', 'neutral'); else { cB(l, 0.25, 'Lời đơn sỉ'); log('Khách đồng ý cọc, đơn hàng suôn sẻ.', 'good'); } }],
    ['giao', 'Giao hết, tin khách quen', { risk: 1 }, function (l, r, log) { if (ch(r, 0.7)) { cB(l, 0.4, 'Lời đơn sỉ'); log('Khách trả đủ đúng hẹn.', 'good'); } else { cB(l, -0.6, 'Bị khách quỵt'); log('Khách biến mất cùng lô hàng, bạn ôm nợ nhà cung cấp.', 'bad'); fx(l, { hap: -8 }); } }]]);
  J('kd_thue_kiem_tra', ['kd_quan', 'kd_tap_hoa', 'kd_online'], 1, 9, 0.1, 3, 'Đối chiếu thuế', 'Cơ quan thuế yêu cầu đối chiếu doanh thu bán hàng online 3 năm qua.', [
    ['khai_du', 'Kê khai đủ, nộp truy thu', HON, function (l, r, log) { cB(l, -0.3, 'Truy thu thuế'); log('Kê khai đủ, nộp truy thu, từ đó sổ sách minh bạch.', 'neutral'); }],
    ['giau', 'Khai thấp, giấu tài khoản phụ', BAD, function (l, r, log) { if (ch(r, 0.4)) { cB(l, -0.8, 'Phạt trốn thuế'); log('Bị phát hiện giấu doanh thu, phạt gấp đôi số thuế trốn.', 'bad'); } else log('Tạm qua lần này.', 'neutral'); }]]);
  J('vang_bien_dong', ['tiem_vang'], 0, 9, 0.15, 2, 'Giá vàng tăng sốc', 'Giá vàng tăng sốc, khách xếp hàng mua; tiệm còn ít hàng.', [
    ['niem_yet', 'Bán đúng giá niêm yết, giới hạn mỗi người', HON, function (l, r, log) { rep(l, 5); log('Bán đúng giá, khách quý tiệm hơn.', 'good'); }],
    ['gam', 'Găm hàng chờ giá lên thêm', { risk: 1 }, function (l, r, log) { if (ch(r, 0.6)) { cB(l, 0.4, 'Lãi găm vàng'); log('Giá lên thêm, lãi đậm.', 'neutral'); } else { cB(l, -0.3, 'Lỗ găm vàng'); log('Giá đảo chiều, lỗ nặng.', 'bad'); } }],
    ['pha', 'Pha tuổi vàng thấp hơn', BAD, function (l, r, log) { cB(l, 0.3, 'Lời vàng non tuổi'); fx(l, { karma: -6 }); if (ch(r, 0.2)) { log('Bị kiểm định phát hiện vàng non tuổi, tiệm bị đóng cửa.', 'bad'); fire(l, log); } else log('Không ai phát hiện, nhưng tiếng xấu đồn dần.', 'neutral'); }]]);
  J('xuong_chay_no', ['chu_xuong'], 0, 9, 0.04, 5, 'Kiểm tra phòng cháy', 'Đoàn kiểm tra phòng cháy chữa cháy chỉ ra xưởng thiếu lối thoát hiểm; sửa thì tốn nhiều.', [
    ['sua', 'Sửa đúng chuẩn', HON, function (l, r, log) { cB(l, -0.5, 'Cải tạo phòng cháy'); log('Bỏ tiền làm lối thoát hiểm, lắp hệ thống chữa cháy.', 'neutral'); }],
    ['lot_tay', 'Tìm cách "lót tay" cho qua', BAD, function (l, r, log) { cB(l, -0.1, 'Chi phí ngoài'); fx(l, { karma: -5 }); if (ch(r, 0.5)) { log('Đoàn kiểm tra từ chối và lập biên bản vì có dấu hiệu đưa hối lộ — xưởng bị đình chỉ đến khi khắc phục.', 'bad'); cB(l, -0.6, 'Đình chỉ, khắc phục'); } else trap(l, 'xuong_chay'); }]]);
  TR('xuong_chay', 0.05, function (l, r, log) { log('Xưởng bốc cháy, công nhân không có lối thoát — bạn bị khởi tố vì vi phạm quy định phòng cháy.', 'bad'); fx(l, { hap: -20, karma: -10 }); arrest(l, 'vi phạm quy định về phòng cháy chữa cháy gây hậu quả nghiêm trọng', 2); });
  J('kd_doi_tac_rut', ['kd_tu_do'], 2, 9, 0.08, 3, 'Đồng sáng lập rút vốn', 'Người đồng sáng lập muốn rút vốn, mang theo khách hàng lớn nhất.', [
    ['mua_lai', 'Mua lại cổ phần', MID, function (l, r, log) { cB(l, -0.6, 'Mua lại cổ phần'); log('Mua lại cổ phần, giữ được công ty.', 'neutral'); }],
    ['de_di', 'Để họ đi, tái cơ cấu', MID, function (l, r, log) { cB(l, -0.3, 'Doanh thu giảm sau tái cơ cấu'); log('Tái cơ cấu, hai năm doanh thu giảm.', 'neutral'); }],
    ['kien', 'Kiện ra tòa', { risk: 0.8 }, function (l, r, log) { stress(l, 20); if (ch(r, 0.5)) { cB(l, 0.3, 'Thắng kiện'); log('Thắng kiện sau 2 năm.', 'good'); } else { cB(l, -0.3, 'Thua kiện'); log('Thua kiện, mất thêm tiền án phí.', 'bad'); } }]]);
  J('kd_vay_nong_xoay_von', 'biz', 0, 9, 0.08, 2, 'Hụt vốn trả lương', 'Cuối tháng hụt vốn trả lương, ngân hàng chưa giải ngân.', [
    ['ban', 'Bán bớt tài sản', HON, function (l, r, log) { cB(l, -0.2, 'Bán tài sản xoay vốn'); log('Bán bớt tài sản, trả lương đúng hạn.', 'neutral'); }],
    ['vay_nong', 'Vay app / tín dụng đen "chỉ một tuần"', BAD, function (l, r, log) { if (ch(r, 0.5)) log('Trả kịp khoản vay nóng.', 'neutral'); else { H.addLoan(l, 'nong', l.base * 0.4); l.flags.thugDebt = true; log('Ngân hàng giải ngân chậm, khoản vay nóng lãi chồng lãi.', 'bad'); } }]]);
  J('sale_bh_tu_van_sai', ['sale_bh'], 0, 9, 0.15, 2, 'Điều khoản loại trừ', 'Sắp chốt hợp đồng với một người lớn tuổi; nói rõ điều khoản loại trừ thì dễ mất khách.', [
    ['noi_du', 'Nói đủ, nói rõ', HON, function (l, r, log) { fx(l, { karma: 3 }); if (ch(r, 0.5)) log('Khách cân nhắc rồi không mua.', 'neutral'); else { cB(l, 0.1, 'Hoa hồng bảo hiểm'); log('Khách cảm ơn vì được giải thích rõ, ký hợp đồng.', 'good'); } }],
    ['luot', 'Lướt qua cho nhanh', BAD, function (l, r, log) { cB(l, 0.2, 'Hoa hồng bảo hiểm'); trap(l, 'bh_sai'); log('Chốt nhanh hợp đồng, hoa hồng về túi.', 'neutral'); }]]);
  TR('bh_sai', function (l, y) { return y >= 3 ? 0.3 : 0; }, function (l, r, log) { rep(l, -20); log('Khách năm nào bị từ chối chi trả vì điều khoản loại trừ bạn không nói rõ — khiếu nại, bạn bị thu hồi chứng chỉ tư vấn.', 'bad'); if (l.job && jid(l) === 'sale_bh') fire(l, log); });
  J('sale_bds_du_an_ma', ['sale_bds'], 0, 9, 0.1, 2, 'Dự án chưa có sổ', 'Chủ đầu tư mới chào hoa hồng 5% cho dự án chưa có sổ, "pháp lý đang hoàn thiện".', [
    ['tu_choi', 'Từ chối', HON, function (l, r, log) { log('Từ chối bán dự án không rõ pháp lý.', 'neutral'); }],
    ['ban', 'Nhận bán', BAD, function (l, r, log) { cB(l, 0.6, 'Hoa hồng dự án'); trap(l, 'bds_ma'); log('Bán được nhiều căn, hoa hồng lớn.', 'neutral'); }]]);
  TR('bds_ma', 0.4, function (l, r, log) { fame(l, -5); rep(l, -25); cB(l, -0.3, 'Khách đòi tiền'); log('Dự án bạn từng bán bị đình chỉ vì sai phạm pháp lý — khách hàng kéo đến tận nhà đòi tiền.', 'bad'); fx(l, { hap: -10 }); });
  J('sale_oto_chot_ao', ['sale_oto'], 0, 9, 0.15, 2, 'Chốt ảo cuối tháng', 'Cuối tháng thiếu 2 xe để đạt chỉ tiêu; quản lý gợi ý "chốt ảo" bằng tên người quen.', [
    ['that', 'Báo đúng số thật', HON, function (l, r, log) { log('Báo thật, mất thưởng tháng.', 'neutral'); fx(l, { karma: 1 }); }],
    ['ao', 'Chốt ảo', BAD, function (l, r, log) { cB(l, 0.15, 'Thưởng doanh số'); if (ch(r, 0.3)) { cB(l, -0.15, 'Hoàn thưởng'); fire(l, log, 'Tháng sau bị phát hiện chốt ảo, hoàn thưởng và bị đuổi việc.'); } else log('Đạt chỉ tiêu, nhận thưởng.', 'neutral'); }]]);
  J('telesale_data_ban', ['telesale'], 0, 9, 0.12, 2, 'Data khách hàng', 'Đồng nghiệp rao bán file data khách hàng lấy từ công ty cũ.', [
    ['bao', 'Báo quản lý', HON, function (l, r, log) { fx(l, { soc: -3, karma: 3 }); log('Báo quản lý, công ty chấn chỉnh.', 'good'); }],
    ['mua', 'Mua về dùng', BAD, function (l, r, log) { cB(l, 0.1, 'Doanh số tăng'); if (ch(r, 0.15)) arrest(l, 'mua bán trái phép dữ liệu cá nhân', 1); else log('Doanh số tăng vọt, nhưng bạn biết mình đang làm sai.', 'neutral'); }]]);
  J('sale_khach_lon', ['sale_b2b'], 1, 9, 0.06, 4, 'Khách hàng lớn', 'Một khách hàng lớn ở nước ngoài để ý cách bạn chăm sóc khách.', [
    ['theo', 'Theo đuổi, làm thêm giờ', { amb: 1 }, function (l, r, log) { fx(l, { hea: -3 }); if (ch(r, 0.4)) { cB(l, 0.5, 'Hợp đồng lớn'); promote(l); log('Chốt được hợp đồng lớn, được thăng chức sớm!', 'big'); } else log('Làm hết sức nhưng khách chọn đối tác khác.', 'neutral'); }],
    ['giu', 'Giữ nhịp cũ', MID, function (l, r, log) { log('Giữ nhịp làm việc cũ.', 'neutral'); }]]);

  // ===================================================================
  // VĂN PHÒNG
  // ===================================================================
  J('vp_cuop_cong', ['van_phong', 'marketing', 'data'], 0, 2, 0.12, 2, 'Bị cướp công', 'Trưởng nhóm trình bày ý tưởng của bạn với sếp lớn như của mình.', [
    ['im', 'Im lặng', { w: 0.6 }, function (l, r, log) { fx(l, { hap: -5 }); log('Im lặng cho qua, ấm ức mấy ngày.', 'neutral'); }],
    ['email', 'Lần sau gửi email, CC cả sếp lớn', { smart: 1 }, function (l, r, log) { if (ch(r, 0.6)) { rep(l, 6); log('Sếp lớn ghi nhận công sức của bạn.', 'good'); } else { fx(l, { soc: -3 }); log('Trưởng nhóm biết chuyện, ghét ra mặt.', 'neutral'); } }],
    ['noi', 'Nói thẳng trong cuộc họp', { risk: 0.8 }, function (l, r, log) { rep(l, ch(r, 0.5) ? 8 : -8); log('Nói thẳng trong họp — không khí căng như dây đàn.', 'neutral'); }]]);
  J('vp_sa_thai_ai', ['van_phong', 'ke_toan', 'thiet_ke', 'fl_dich', 'fl_content', 'fl_thiet_ke'], 0, 9, 0.08, 3, 'Tự động hóa bằng AI', 'Công ty tự động hóa một phần công việc bằng trí tuệ nhân tạo, sẽ cắt 20% vị trí.', [
    ['hoc', 'Học kỹ năng mới, xin chuyển vai trò', { smart: 1, w: 1.2 }, function (l, r, log) { fx(l, { kno: 6 }); if (ch(r, 0.7)) log('Học thêm cách dùng AI trong công việc, được giữ lại ở vị trí mới.', 'good'); else fire(l, log, 'Học rồi nhưng vẫn nằm trong danh sách cắt giảm.'); }],
    ['ke', 'Không làm gì, chờ xem', { w: 0.5 }, function (l, r, log) { if (ch(r, 0.4)) fire(l, log, 'Bị cắt giảm, mất việc.'); else log('May mắn chưa bị cắt.', 'neutral'); }]]);
  J('kt_lam_dep_so', ['ke_toan'], 1, 9, 0.12, 2, '"Làm đẹp" báo cáo tài chính', 'Giám đốc bảo "làm đẹp" báo cáo tài chính trước khi đi vay ngân hàng.', [
    ['tu_choi', 'Từ chối, ghi nhận bằng văn bản', HON, function (l, r, log) { fx(l, { karma: 4 }); if (ch(r, 0.4)) fire(l, log, 'Từ chối làm sai, bị cho nghỉ việc.'); else log('Giám đốc chùn tay, báo cáo giữ nguyên số thật.', 'good'); }],
    ['lam', 'Làm theo', BAD, function (l, r, log) { cB(l, 0.1, 'Thưởng'); trap(l, 'so_sach'); log('Chỉnh lại số liệu theo ý giám đốc.', 'neutral'); }]]);
  TR('so_sach', 0.2, function (l, r, log) { log('Thanh tra phát hiện báo cáo tài chính bị làm giả — kế toán ký báo cáo phải chịu trách nhiệm cùng.', 'bad'); arrest(l, 'vi phạm quy định về kế toán', 1); });
  J('nh_khach_lua_dao', ['ngan_hang'], 0, 9, 0.1, 2, 'Cụ già bị lừa', 'Một cụ già đến rút toàn bộ tiết kiệm để chuyển cho "công an" gọi qua điện thoại.', [
    ['giu', 'Giữ cụ lại, gọi người nhà', HON, function (l, r, log) { fx(l, { karma: 6 }); if (ch(r, 0.7)) { fame(l, 1); log('Kịp ngăn cụ chuyển tiền cho kẻ lừa đảo giả danh. Báo địa phương đưa tin khen ngợi.', 'good'); H.mem(l, 'Ngày giữ được sổ tiết kiệm cả đời của một cụ già.', 3); } else log('Cụ vẫn nhất quyết chuyển tiền, bạn chỉ kịp báo công an.', 'neutral'); }],
    ['thu_tuc', 'Làm đúng thủ tục rồi để cụ đi', { w: 0.5 }, function (l, r, log) { fx(l, { karma: -3 }); log('Làm đúng thủ tục. Tối về cứ day dứt.', 'neutral'); }]]);
  J('nh_ho_so_vay', ['ngan_hang'], 1, 9, 0.1, 2, 'Lời "cảm ơn" 1%', 'Khách lớn đề nghị "cảm ơn" 1% nếu bạn duyệt khoản vay với tài sản đảm bảo định giá cao.', [
    ['dung', 'Thẩm định đúng', HON, function (l, r, log) { fx(l, { karma: 3 }); log('Thẩm định đúng giá trị tài sản, mất khách lớn.', 'neutral'); }],
    ['duyet', 'Duyệt cho qua', BAD, function (l, r, log) { cB(l, 0.4, 'Tiền "cảm ơn"'); trap(l, 'no_xau_nh'); log('Nhận phong bì, duyệt khoản vay.', 'neutral'); }]]);
  TR('no_xau_nh', function (l, y) { return y >= 2 ? 0.3 : 0; }, function (l, r, log) { log('Khoản vay năm nào thành nợ xấu — cơ quan điều tra vào cuộc, phát hiện việc định giá sai.', 'bad'); arrest(l, 'vi phạm quy định về cho vay', 2); });
  J('dev_su_co_prod', ['dev', 'data'], 1, 9, 0.12, 2, 'Hệ thống sập lúc 2 giờ sáng', 'Hai giờ sáng hệ thống sập sau bản cập nhật của bạn, khách đang mất tiền.', [
    ['sua', 'Thức trắng sửa, viết báo cáo nhận lỗi', HON, function (l, r, log) { fx(l, { hea: -3 }); rep(l, 5); log('Sửa xong lúc bình minh, viết báo cáo nhận lỗi. Sếp đánh giá cao sự trung thực.', 'good'); }],
    ['do_loi', 'Đổ lỗi cho hạ tầng', BAD, function (l, r, log) { if (ch(r, 0.4)) { rep(l, -15); log('Log hệ thống chỉ rõ lỗi từ bản cập nhật của bạn — mất uy tín trong nhóm.', 'bad'); } else log('Tạm qua chuyện.', 'neutral'); }]]);
  J('dev_offer_nuoc_ngoai', ['dev', 'data'], 2, 9, 0.08, 3, 'Lời mời từ nước ngoài', 'Một công ty nước ngoài mời bạn làm từ xa, lương gấp 2,5 lần.', [
    ['nhan', 'Nhận làm từ xa', { amb: 1 }, function (l, r, log) { cB(l, 1, 'Lương làm từ xa'); stress(l, 10); log('Làm việc từ xa cho công ty nước ngoài, thức khuya vì lệch múi giờ nhưng thu nhập tăng vọt.', 'good'); }],
    ['dam_phan', 'Dùng lời mời để đàm phán tăng lương', { smart: 1 }, function (l, r, log) { if (ch(r, 0.5)) { cB(l, 0.3, 'Tăng lương'); log('Công ty giữ chân bằng mức tăng lương 30%.', 'good'); } else log('Công ty không tăng, bạn ở lại.', 'neutral'); }],
    ['o_lai', 'Ở lại công ty hiện tại', MID, function (l, r, log) { log('Ở lại vì đồng đội.', 'neutral'); }]]);
  J('ksxd_ky_nghiem_thu', ['ky_su_xd', 'kien_truc'], 1, 9, 0.12, 2, 'Ép ký nghiệm thu', 'Chủ đầu tư ép ký nghiệm thu khi thép móng chưa đủ chuẩn.', [
    ['khong', 'Không ký', HON, function (l, r, log) { fx(l, { karma: 4 }); log('Không ký, mất dự án nhưng giữ được lương tâm nghề nghiệp.', 'good'); }],
    ['ky', 'Ký cho xong', BAD, function (l, r, log) { cB(l, 0.2, 'Thưởng dự án'); trap(l, 'ksxd'); log('Ký biên bản nghiệm thu.', 'neutral'); }]]);
  TR('ksxd', function (l, y) { return y >= 4 ? 0.1 : 0.02; }, function (l, r, log) { log('Công trình bạn ký nghiệm thu năm nào gặp sự cố nứt lún — kỹ sư ký nghiệm thu bị điều tra.', 'bad'); arrest(l, 'vi phạm quy định về xây dựng', 1); });
  J('ns_sa_thai_ban', ['nhan_su'], 1, 9, 0.1, 3, 'Cho bạn thân nghỉ việc', 'Bạn phải ra quyết định cho nghỉ một người bạn thân ở công ty, vợ họ sắp sinh.', [
    ['bao_truoc', 'Báo trước riêng để họ chuẩn bị', { soc: 1 }, function (l, r, log) { fx(l, { soc: 3 }); if (ch(r, 0.2)) log('Bị khiển trách vì tiết lộ thông tin sớm.', 'neutral'); else log('Bạn ấy kịp tìm việc mới, vẫn giữ tình bạn.', 'good'); }],
    ['quy_trinh', 'Làm đúng quy trình', MID, function (l, r, log) { fx(l, { soc: -8 }); log('Làm đúng quy trình, tình bạn rạn nứt.', 'neutral'); }]]);
  J('log_hang_tam_giu', ['logistics'], 0, 9, 0.1, 2, 'Hàng bị tạm giữ', 'Lô hàng bị hải quan tạm giữ vì thiếu giấy tờ, khách gợi ý "lo" cho nhanh.', [
    ['giay_to', 'Bổ sung giấy tờ đúng quy định', HON, function (l, r, log) { cB(l, -0.1, 'Phạt chậm giao'); log('Bổ sung giấy tờ, cán bộ hải quan hướng dẫn tận tình; hàng thông quan sau vài ngày.', 'neutral'); }],
    ['lo', 'Tìm cách chi tiền ngoài', BAD, function (l, r, log) { fx(l, { karma: -4 }); if (ch(r, 0.5)) { log('Cán bộ hải quan từ chối thẳng và lập biên bản — công ty bị xử phạt vì hành vi đưa hối lộ.', 'bad'); cB(l, -0.2, 'Bị phạt'); } else log('Hàng đi nhanh, nhưng bạn biết mình vừa làm sai.', 'neutral'); }]]);
  J('ls_khach_noi_doi', ['luat_su'], 0, 9, 0.1, 3, 'Thân chủ thú nhận', 'Thân chủ thú nhận riêng rằng họ thực sự phạm tội, nhưng muốn được bào chữa vô tội.', [
    ['gioi_han', 'Bào chữa trong giới hạn nghề nghiệp', HON, function (l, r, log) { rep(l, 3); log('Bào chữa đúng giới hạn: đề nghị tình tiết giảm nhẹ, không dựng chuyện.', 'neutral'); }],
    ['gia', 'Giúp dựng chứng cứ giả', BAD, function (l, r, log) { cB(l, 0.5, 'Thù lao vụ án'); fx(l, { karma: -8 }); if (ch(r, 0.25)) { log('Viện kiểm sát phát hiện chứng cứ giả — bạn bị xóa tên khỏi đoàn luật sư.', 'bad'); arrest(l, 'làm sai lệch hồ sơ vụ án', 2); } }],
    ['tu_choi', 'Từ chối nhận vụ', MID, function (l, r, log) { cB(l, -0.2, 'Mất vụ việc'); log('Từ chối nhận vụ.', 'neutral'); }]]);
  J('tk_dao_y_tuong', ['thiet_ke', 'kien_truc'], 0, 9, 0.1, 2, 'Thiết kế bị dùng chùa', 'Thiết kế của bạn bị một thương hiệu lớn dùng không xin phép.', [
    ['mang', 'Lên mạng lên tiếng', { soc: 0.8 }, function (l, r, log) { if (ch(r, 0.5)) { fame(l, 3); log('Cộng đồng lên tiếng ủng hộ, thương hiệu xin lỗi và bồi thường.', 'good'); } else log('Bài đăng chìm nghỉm.', 'neutral'); }],
    ['luat_su', 'Gửi thư luật sư', { smart: 1 }, function (l, r, log) { cB(l, -0.05, 'Phí luật sư'); if (ch(r, 0.6)) { cB(l, 0.3, 'Bồi thường bản quyền'); log('Được bồi thường bản quyền.', 'good'); } }],
    ['bo_qua', 'Bỏ qua', MID, function (l, r, log) { fx(l, { hap: -4 }); log('Bỏ qua cho mệt.', 'neutral'); }]]);

  // ===================================================================
  // CƠ QUAN NHÀ NƯỚC — mô phỏng có cân bằng: phần lớn cán bộ làm đúng; sai phạm bị thanh tra, kiểm tra phát hiện
  // ===================================================================
  J('nn_tinh_gian', ['cong_chuc', 'vien_chuc', 'can_bo_xa'], 0, 9, 0.012, 10, 'Sắp xếp bộ máy', 'Đơn vị sáp nhập theo chủ trương tinh gọn bộ máy, phòng của bạn giải thể.', [
    ['nghi', 'Nghỉ hưởng chế độ một lần', MID, function (l, r, log) { cB(l, 1.2, 'Chế độ khi tinh giản'); fire(l, log, 'Nghỉ việc, nhận chế độ hỗ trợ theo quy định.'); }],
    ['o_lai', 'Nhận phân công tại đơn vị mới', MID, function (l, r, log) { log('Bạn tiếp tục công tác tại đơn vị mới, giữ bậc nghề hiện tại.', 'neutral'); }],
    ['giu', 'Ứng tuyển vị trí ở đơn vị mới', { amb: 1 }, function (l, r, log) { if (ch(r, 0.35 + rk(l) * 0.05 + (l.st.soc - 50) / 200)) log('Năng lực được ghi nhận, giữ được vị trí ở đơn vị mới.', 'good'); else { if (l.job) l.job.rank = Math.max(0, l.job.rank - 1); log('Không giữ được vị trí, chuyển sang việc khác.', 'neutral'); } }]]);
  E.TRIG.filter(function(t){return t.id==='nn_tinh_gian';}).forEach(function(t){t.max=1;});
  J('xa_dat_dai', ['can_bo_xa'], 1, 9, 0.12, 2, 'Hồ sơ đất thiếu giấy', 'Người dân xin xác nhận nguồn gốc đất để làm sổ; hồ sơ thiếu một giấy, họ "gửi" phong bì.', [
    ['huong_dan', 'Hướng dẫn bổ sung đúng quy định', HON, function (l, r, log) { fx(l, { karma: 2, soc: 2 }); log('Hướng dẫn người dân bổ sung giấy tờ, trả lại phong bì. Họ cảm ơn mãi.', 'good'); }],
    ['nhan', 'Nhận phong bì, ký cho xong', BAD, function (l, r, log) { cB(l, 0.1, 'Phong bì'); trap(l, 'dat_dai'); log('Nhận phong bì, ký xác nhận.', 'neutral'); }]]);
  TR('dat_dai', 0.15, function (l, r, log) { log('Người dân khiếu nại tập thể vụ cấp sổ sai; thanh tra huyện vào cuộc, xác định trách nhiệm cán bộ ký xác nhận.', 'bad'); if (ch(r, 0.5)) arrest(l, 'nhận hối lộ', 1); else { fire(l, log, 'Bị kỷ luật buộc thôi việc.'); } });
  J('xa_ho_ngheo', ['can_bo_xa'], 0, 9, 0.12, 2, 'Danh sách hộ nghèo', 'Danh sách hộ nghèo có người họ hàng của một lãnh đạo xã, trong khi một hộ thật sự khó khăn bị loại.', [
    ['sua', 'Đề xuất sửa danh sách cho công bằng', HON, function (l, r, log) { fx(l, { karma: 4, soc: -2 }); log('Đề xuất rà soát lại; hội nghị dân chủ ở thôn bình xét lại, hộ khó khăn được bổ sung.', 'good'); }],
    ['lam_theo', 'Làm theo cho êm', BAD, function (l, r, log) { fx(l, { karma: -3 }); if (ch(r, 0.2)) { log('Báo chí phản ánh, huyện chỉ đạo rà soát lại, những người liên quan bị kiểm điểm.', 'bad'); rep(l, -10); } }]]);
  J('thue_doanh_nghiep_quen', ['thue'], 1, 9, 0.1, 2, 'Doanh nghiệp người quen', 'Doanh nghiệp của bạn học cũ có dấu hiệu hóa đơn khống, họ mời đi ăn "nói chuyện".', [
    ['dung', 'Xử lý đúng quy định', HON, function (l, r, log) { fx(l, { soc: -6 }); rep(l, 5); log('Từ chối gặp riêng, xử lý hồ sơ đúng quy định.', 'good'); }],
    ['nuong', 'Nương tay', BAD, function (l, r, log) { cB(l, 0.3, 'Quà cảm ơn'); trap(l, 'thue_quen'); log('Nhận quà, "xem xét" nhẹ tay.', 'neutral'); }]]);
  TR('thue_quen', 0.2, function (l, r, log) { log('Cấp trên rà soát lại hồ sơ, phát hiện việc bỏ qua hóa đơn khống — bạn bị điều tra.', 'bad'); arrest(l, 'thiếu trách nhiệm, nhận hối lộ', 1); });
  J('hq_hang_lau_quen', ['hai_quan'], 0, 9, 0.12, 2, 'Lô hàng "người quen"', 'Một lô hàng khai sai mã; có người gọi điện tự xưng "người nhà lãnh đạo" nhờ "xem giúp".', [
    ['kiem', 'Kiểm tra đúng quy định', HON, function (l, r, log) { fx(l, { karma: 4 }); rep(l, 6); log('Kiểm tra đúng quy trình, phát hiện khai sai, lập biên bản. Lãnh đạo chi cục biểu dương bạn.', 'good'); }],
    ['cho_qua', 'Cho qua', BAD, function (l, r, log) { trap(l, 'hq'); log('Cho lô hàng qua.', 'neutral'); }]]);
  TR('hq', 0.2, function (l, r, log) { log('Chuyên án chống buôn lậu khui ra đường dây — những người cho hàng qua đều bị xử lý.', 'bad'); arrest(l, 'tiếp tay cho buôn lậu', 2); });
  J('qltt_bao_ke', ['qltt'], 0, 9, 0.12, 2, 'Quầy hàng giả', 'Chợ đầu mối có quầy hàng giả lớn, chủ quầy đề nghị "đóng tháng".', [
    ['kiem', 'Kiểm tra, tịch thu', HON, function (l, r, log) { rep(l, 5); if (ch(r, 0.3)) { stress(l, 10); log('Tịch thu hàng giả; bị đe dọa nhưng được công an bảo vệ.', 'good'); } else log('Tịch thu cả kho hàng giả, người tiêu dùng được bảo vệ.', 'good'); }],
    ['nhan', 'Nhận "đóng tháng"', BAD, function (l, r, log) { cB(l, 0.2, 'Tiền bảo kê'); trap(l, 'qltt'); log('Nhận tiền, làm ngơ.', 'neutral'); }]]);
  TR('qltt', 0.15, function (l, r, log) { log('Đoàn kiểm tra liên ngành phát hiện đường dây bảo kê hàng giả.', 'bad'); arrest(l, 'nhận hối lộ', 2); });
  J('kiem_lam_go', ['kiem_lam'], 0, 9, 0.12, 2, 'Xe chở gỗ lậu', 'Phát hiện xe chở gỗ lậu ban đêm; lâm tặc đông người, có kẻ cầm hung khí.', [
    ['phoi_hop', 'Ghi lại, báo công an phối hợp', HON, function (l, r, log) { if (ch(r, 0.6)) { rep(l, 8); log('Phối hợp công an bắt gọn xe gỗ lậu, bảo vệ được cánh rừng.', 'good'); } else log('Xe gỗ chạy thoát, nhưng biển số đã được ghi lại.', 'neutral'); }],
    ['chan', 'Chặn một mình', { risk: 1.2 }, function (l, r, log) { if (ch(r, 0.3)) { fx(l, { hea: -25 }); log('Bị lâm tặc hành hung.', 'bad'); } else { rep(l, 10); fame(l, 2); log('Một mình chặn được xe gỗ.', 'good'); } }],
    ['nhan', 'Nhận tiền cho qua', BAD, function (l, r, log) { cB(l, 0.15, 'Tiền cho qua'); fx(l, { karma: -8 }); trap(l, 'pha_rung'); }]]);
  TR('pha_rung', 0.15, function (l, r, log) { log('Vụ phá rừng bị phát hiện, điều tra ra cán bộ kiểm lâm làm ngơ.', 'bad'); arrest(l, 'thiếu trách nhiệm trong quản lý rừng, nhận hối lộ', 2); });
  J('kiem_toan_phat_hien', ['kiem_toan'], 0, 9, 0.1, 3, 'Khoản chi sai', 'Đoàn kiểm toán tìm thấy một khoản chi sai lớn; có người muốn bạn "giảm nhẹ" kết luận.', [
    ['giu', 'Giữ nguyên kết luận', HON, function (l, r, log) { rep(l, 8); fx(l, { karma: 4 }); log('Giữ nguyên kết luận kiểm toán, sai phạm được chuyển xử lý. Trưởng đoàn ủng hộ bạn.', 'good'); }],
    ['lam_theo', 'Làm theo', BAD, function (l, r, log) { fx(l, { karma: -5 }); if (ch(r, 0.2)) arrest(l, 'làm sai lệch kết quả kiểm toán', 1); }]]);
  J('ngoai_giao_bao_ho', ['ngoai_giao'], 1, 9, 0.1, 3, 'Bảo hộ công dân', 'Một công dân Việt bị giam ở nước sở tại, gia đình gọi khắp nơi cầu cứu.', [
    ['theo', 'Theo đuổi vụ việc đến cùng', HON, function (l, r, log) { fx(l, { hea: -3 }); if (ch(r, 0.6)) { fame(l, 2); fx(l, { karma: 5 }); log('Sau nhiều tuần làm việc, đưa được công dân về nước an toàn.', 'big'); H.mem(l, 'Ngày đón người đồng hương trở về ở sân bay.', 4); } else log('Làm hết sức, vụ việc vẫn đang được giải quyết.', 'neutral'); }],
    ['toi_thieu', 'Làm đúng thủ tục tối thiểu', MID, function (l, r, log) { log('Làm đúng thủ tục.', 'neutral'); }]]);
  J('dnnn_du_an_lo', ['dnnn'], 2, 9, 0.06, 4, 'Dự án thua lỗ', 'Dự án nghìn tỷ lỗ nặng, có người muốn "điều chỉnh tổng mức đầu tư" để che.', [
    ['phan_doi', 'Phản đối bằng văn bản', HON, function (l, r, log) { fx(l, { soc: -5, karma: 4 }); log('Phản đối bằng văn bản. Bị cô lập một thời gian, nhưng sau này văn bản đó bảo vệ bạn.', 'good'); }],
    ['ky', 'Ký cùng', BAD, function (l, r, log) { trap(l, 'dnnn'); log('Ký cùng tập thể lãnh đạo.', 'neutral'); }]]);
  TR('dnnn', function (l, y) { return y >= 3 ? 0.08 : 0; }, function (l, r, log) { log('Vụ án kinh tế ở doanh nghiệp được khởi tố — kể cả người đã nghỉ hưu cũng bị gọi lên làm việc.', 'bad'); arrest(l, 'vi phạm quy định về quản lý, sử dụng vốn nhà nước', 2); });
  J('vc_bo_nhiem', ['vien_chuc', 'cong_chuc'], 1, 9, 0.1, 3, 'Ghế trưởng phòng', 'Có ghế trưởng phòng trống, có người rỉ tai phải "chạy" mới chắc.', [
    ['khong', 'Không chạy, để năng lực nói', HON, function (l, r, log) { if (ch(r, 0.45)) { promote(l); log('Được bổ nhiệm qua thi tuyển công khai — đúng người, đúng năng lực.', 'good'); } else log('Người khác được bổ nhiệm; bạn tiếp tục phấn đấu.', 'neutral'); }],
    ['chay', 'Chạy chức', BAD, function (l, r, log) { cB(l, -0.8, 'Chạy chức'); fx(l, { karma: -6 }); if (ch(r, 0.7)) promote(l); trap(l, 'chay_chuc'); log('Bỏ tiền "chạy" ghế trưởng phòng.', 'neutral'); }]]);
  TR('chay_chuc', 0.1, function (l, r, log) { log('Đường dây chạy chức bị phanh phui; người đưa tiền cũng bị xử lý, cách chức.', 'bad'); if (l.job) l.job.rank = Math.max(0, l.job.rank - 2); fx(l, { hap: -12 }); if (ch(r, 0.4)) arrest(l, 'đưa hối lộ', 1); });
  // sự kiện tốt, cán bộ tận tụy
  J('cc_mot_cua', ['cong_chuc', 'can_bo_xa', 'vien_chuc'], 0, 9, 0.06, 5, 'Cải cách thủ tục', 'Bạn có ý tưởng rút gọn quy trình hồ sơ ở bộ phận một cửa, giúp người dân đỡ đi lại nhiều lần.', [
    ['de_xuat', 'Đề xuất với lãnh đạo', { w: 1.3, amb: 0.5 }, function (l, r, log) { if (ch(r, 0.6)) { rep(l, 8); fx(l, { karma: 4, hap: 5 }); log('Đề xuất được áp dụng, người dân làm hồ sơ chỉ còn một lần đi lại. Bạn được tặng giấy khen.', 'good'); H.mem(l, 'Ngày quy trình bạn đề xuất được áp dụng cho cả phường.', 3); } else log('Đề xuất được ghi nhận, chờ thí điểm.', 'neutral'); }],
    ['thoi', 'Thôi, làm đúng phần việc', MID, function (l, r, log) { log('Làm đúng phần việc của mình.', 'neutral'); }]]);

  // ===================================================================
  // CÔNG AN & QUÂN ĐỘI
  // ===================================================================
  J('ca_nguoi_nha_vi_pham', ['cong_an'], 0, 9, 0.1, 3, 'Người nhà vi phạm', 'Em họ bị tạm giữ vì đánh nhau, cả họ gọi bạn "lo cho nó".', [
    ['khong', 'Không can thiệp, để pháp luật xử lý', HON, function (l, r, log) { fx(l, { soc: -6, karma: 3 }); log('Giải thích với cả họ: pháp luật như nhau với mọi người. Em họ được xử lý đúng mức, sau đó hiểu ra.', 'good'); }],
    ['noi_kheo', 'Gọi điện "nói khéo"', BAD, function (l, r, log) { fx(l, { soc: 5 }); if (ch(r, 0.25)) { log('Thanh tra công an phát hiện can thiệp trái quy định — bạn bị kỷ luật, hạ một bậc quân hàm.', 'bad'); if (l.job) l.job.rank = Math.max(0, l.job.rank - 1); } }]]);
  J('ca_clip_mang', ['cong_an'], 0, 3, 0.1, 2, 'Bị quay clip thách thức', 'Đang làm nhiệm vụ, một người quay clip thách thức, câu từng chữ để đăng mạng.', [
    ['binh_tinh', 'Giữ bình tĩnh, làm đúng quy trình', HON, function (l, r, log) { rep(l, 4); if (ch(r, 0.3)) { fame(l, 1); log('Clip lan truyền, cư dân mạng khen cách xử lý điềm tĩnh, đúng mực.', 'good'); } else log('Xử lý đúng quy trình, vụ việc êm xuôi.', 'neutral'); }],
    ['nong', 'Nóng nảy giật điện thoại', BAD, function (l, r, log) { fame(l, -6); log('Clip triệu lượt xem; bạn bị đình chỉ công tác 3 tháng để kiểm điểm.', 'bad'); cB(l, -0.1, 'Đình chỉ công tác'); }]]);
  J('ca_truy_duoi', ['cong_an'], 0, 9, 0.06, 3, 'Truy đuổi', 'Đối tượng phóng xe bỏ chạy ngược chiều trên phố đông người.', [
    ['an_toan', 'Bám theo ở khoảng cách an toàn, báo chốt chặn', HON, function (l, r, log) { if (ch(r, 0.7)) { rep(l, 5); log('Phối hợp chốt chặn, bắt được đối tượng mà không ai bị thương.', 'good'); } else log('Đối tượng tẩu thoát, nhưng đã được nhận diện.', 'neutral'); }],
    ['ep', 'Ép sát', { risk: 1.2 }, function (l, r, log) { if (ch(r, 0.5)) { rep(l, 10); log('Ép sát, bắt gọn đối tượng.', 'good'); } else { rep(l, -10); log('Truy đuổi gây tai nạn cho người đi đường, bạn bị kiểm điểm.', 'bad'); } }]]);
  J('ca_bao_ke_quan_bar', ['cong_an'], 2, 9, 0.08, 3, 'Lời mời "cố vấn"', 'Chủ một chuỗi quán bar mời bạn làm "cố vấn", tháng nào cũng có phong bì.', [
    ['tu_choi', 'Từ chối, báo cáo cấp trên', HON, function (l, r, log) { fx(l, { karma: 3 }); rep(l, 4); log('Từ chối và báo cáo cấp trên. Ít lâu sau quán bị kiểm tra.', 'good'); }],
    ['nhan', 'Nhận', BAD, function (l, r, log) { cB(l, 0.3, 'Phong bì'); trap(l, 'ca_bar'); }]]);
  TR('ca_bar', 0.4, function (l, r, log) { log('Quán bar bị triệt phá vì tổ chức sử dụng ma túy; cơ quan điều tra làm rõ cán bộ nhận tiền bảo kê.', 'bad'); arrest(l, 'nhận hối lộ, bao che', 3); });
  J('ca_luan_chuyen', ['cong_an', 'quan_doi'], 3, 9, 0.12, 4, 'Điều động về biên giới', 'Bạn được điều động về xã biên giới 3 năm.', [
    ['di', 'Nhận nhiệm vụ', { w: 1.2 }, function (l, r, log) { fx(l, { hap: -6, soc: -4, karma: 3 }); l.flags.bienGioi = l.age + 3; log('Nhận nhiệm vụ ở vùng biên — xa nhà, nhưng bà con quý như người nhà.', 'good'); H.mem(l, 'Những năm công tác ở xã biên giới.', 4); }],
    ['xin', 'Xin ở lại vì hoàn cảnh gia đình', MID, function (l, r, log) { log('Trình bày hoàn cảnh, được xem xét ở lại; thăng tiến chậm hơn.', 'neutral'); }]]);
  E.HOOKS.year.push(function (l, r, log, a) { if (l.flags.bienGioi === a && l.job && /^(cong_an|quan_doi)$/.test(jid(l))) { l.flags.bienGioi = null; if (promote(l)) log('Hoàn thành nhiệm vụ ở biên giới, được thăng hàm: ' + E.jobTitle(l) + '.', 'good'); } });
  J('qd_cuu_ho_lu', ['quan_doi', 'cong_an'], 0, 9, 0.1, 2, 'Cứu hộ lũ quét', 'Lũ quét ở miền núi, đơn vị được lệnh vào bản bị cô lập.', [
    ['xung_phong', 'Xung phong tuyến đầu', { w: 1.3 }, function (l, r, log) { fx(l, { hea: -5 }); if (ch(r, 0.05)) { fx(l, { hea: -20 }); log('Bị thương nặng khi cứu người.', 'bad'); } else { fx(l, { karma: 8 }); fame(l, 2); log('Cứu được nhiều người dân ra khỏi vùng lũ, được tặng bằng khen.', 'big'); H.mem(l, 'Đêm cứu dân trong lũ quét.', 5); } }],
    ['hau_can', 'Làm hậu cần', MID, function (l, r, log) { fx(l, { karma: 3 }); log('Lo hậu cần, tiếp tế lương thực cho bà con.', 'good'); }]]);
  J('qd_huan_luyen_tai_nan', ['quan_doi'], 0, 2, 0.05, 3, 'Diễn tập bắn đạn thật', 'Diễn tập bắn đạn thật, một chiến sĩ mới lóng ngóng làm rơi lựu đạn.', [
    ['lao', 'Lao đến xử lý', { risk: 1, w: 1 }, function (l, r, log) { if (ch(r, 0.8)) { fame(l, 3); fx(l, { karma: 6 }); log('Xử lý kịp thời, cứu cả tổ. Được khen thưởng đột xuất.', 'big'); } else { fx(l, { hea: -20 }); log('Bị thương khi xử lý quả lựu đạn.', 'bad'); } }],
    ['nam', 'Hô mọi người nằm xuống', MID, function (l, r, log) { if (ch(r, 0.6)) log('Mọi người nằm xuống kịp, không ai bị thương.', 'good'); else { fx(l, { hea: -8 }); log('Vài người bị thương nhẹ.', 'bad'); } }]]);
  J('qd_bien_dao', ['quan_doi'], 0, 9, 0.06, 5, 'Ra đảo', 'Có đợt tuyển quân nhân ra đảo công tác 1 năm, phụ cấp cao.', [
    ['di', 'Đăng ký ra đảo', { w: 1 }, function (l, r, log) { cB(l, 0.3, 'Phụ cấp công tác đảo'); fx(l, { hap: -5, soc: 4 }); rep(l, 8); log('Một năm công tác ở đảo xa: gió biển, nước ngọt quý như vàng, tình đồng đội gắn bó.', 'big'); H.mem(l, 'Một năm giữa biển khơi, nhìn lá cờ bay trên đảo.', 6); }],
    ['khong', 'Không đăng ký', MID, function (l, r, log) { log('Không đăng ký đợt này.', 'neutral'); }]]);
  J('qd_nghi_huu_som', ['quan_doi', 'cong_an'], 5, 9, 0.1, 5, 'Nghỉ hưu trước tuổi', 'Sau sắp xếp tổ chức, đơn vị đề xuất bạn nghỉ hưu trước tuổi với chế độ ưu đãi.', [
    ['nghi', 'Nghỉ hưu', MID, function (l, r, log) { cB(l, 1.5, 'Chế độ nghỉ hưu trước tuổi'); l.pensioned = true; l.pensionInc = l.pensionInc || (l.income || l.base) * 0.6; l.retired = true; l.job = null; log('Nghỉ hưu trước tuổi theo chế độ, nhận lương hưu.', 'big'); }],
    ['o_lai', 'Ở lại công tác', { amb: 1 }, function (l, r, log) { if (ch(r, 0.2) && promote(l)) log('Tiếp tục công tác và được thăng hàm: ' + E.jobTitle(l) + '.', 'big'); else log('Ở lại công tác đến tuổi nghỉ hưu.', 'neutral'); }]]);
  // sự kiện tốt của lực lượng công an
  J('ca_giup_dan', ['cong_an'], 0, 9, 0.06, 4, 'Em bé đi lạc', 'Một em bé đi lạc khóc giữa chợ, không nhớ địa chỉ nhà.', [
    ['giup', 'Dỗ em, lần tìm gia đình', { w: 1.5 }, function (l, r, log) { fx(l, { karma: 5, hap: 4 }); fame(l, 1); log('Cả đêm lần theo từng manh mối, đưa được em bé về với mẹ. Người mẹ ôm chầm lấy bạn khóc nức nở.', 'good'); H.mem(l, 'Đêm đưa em bé lạc về với mẹ.', 4); }]]);

  // ===================================================================
  // Y TẾ & GIÁO DỤC
  // ===================================================================
  J('yt_hoa_hong_thuoc', ['bac_si'], 1, 9, 0.15, 2, 'Hoa hồng kê đơn', 'Trình dược viên đề nghị "hỗ trợ" 10% nếu bạn kê thuốc của hãng họ thay thuốc tương đương rẻ hơn.', [
    ['phac_do', 'Kê đúng phác đồ', HON, function (l, r, log) { fx(l, { karma: 2 }); log('Kê đơn theo phác đồ, chọn thuốc phù hợp túi tiền bệnh nhân.', 'good'); }],
    ['nhan', 'Nhận hoa hồng', BAD, function (l, r, log) { cB(l, 0.3, 'Hoa hồng thuốc'); trap(l, 'hoa_hong_thuoc'); }]]);
  TR('hoa_hong_thuoc', 0.15, function (l, r, log) { log('Thanh tra Sở Y tế làm rõ đường dây hoa hồng kê đơn — bạn bị đình chỉ hành nghề.', 'bad'); if (l.job && jid(l) === 'bac_si') fire(l, log); fame(l, -3); });
  J('yt_truc_dem_sai_sot', ['bac_si', 'dieu_duong'], 0, 9, 0.08, 2, 'Suýt nhầm thuốc', 'Sau 30 tiếng trực, bạn suýt tiêm nhầm thuốc; may đồng nghiệp phát hiện.', [
    ['bao_cao', 'Báo cáo sự cố, đề xuất giảm ca', HON, function (l, r, log) { rep(l, 3); stress(l, -5); log('Báo cáo sự cố; khoa sắp xếp lại ca trực cho hợp lý.', 'good'); }],
    ['im', 'Im lặng', BAD, function (l, r, log) { stress(l, 10); trap(l, 'truc_dem'); }]]);
  TR('truc_dem', 0.2, function (l, r, log) { log('Lại một ca trực kiệt sức — lần này sai sót xảy ra thật, bệnh nhân bị phản ứng thuốc. Bạn bị kỷ luật.', 'bad'); fx(l, { karma: -5, hap: -10 }); rep(l, -15); });
  J('yt_dich_benh', ['bac_si', 'dieu_duong', 'duoc_si'], 0, 9, 0.03, 10, 'Dịch bệnh bùng phát', 'Dịch bệnh bùng phát, bệnh viện cần người vào khu cách ly.', [
    ['xung_phong', 'Xung phong vào tuyến đầu', { w: 1.3 }, function (l, r, log) { fx(l, { hea: -5, karma: 8 }); rep(l, 10); if (ch(r, 0.1)) { fx(l, { hea: -10 }); log('Nhiễm bệnh trong khu cách ly, may qua khỏi.', 'bad'); } log('Hai tháng xa nhà trong khu cách ly, được tặng bằng khen.', 'big'); H.mem(l, 'Những ngày khoác áo bảo hộ trong khu cách ly.', 6); }],
    ['khoa', 'Ở lại khoa thường', MID, function (l, r, log) { log('Trực khoa thường, gánh thêm việc cho đồng nghiệp đi chống dịch.', 'neutral'); }]]);
  J('dd_bi_lam_nhuc', ['dieu_duong'], 0, 9, 0.12, 2, 'Bị quay clip mắng chửi', 'Người nhà bệnh nhân quay clip mắng chửi bạn vì chờ lâu, đăng lên mạng.', [
    ['binh_tinh', 'Giữ bình tĩnh, nhờ phòng công tác xã hội', HON, function (l, r, log) { stress(l, 8); if (ch(r, 0.3)) log('Cư dân mạng xem đủ đầu đuôi, quay ra bênh bạn.', 'good'); else log('Cố nuốt nước mắt làm tiếp.', 'neutral'); }],
    ['dap', 'Đáp lời', { risk: 0.8 }, function (l, r, log) { fame(l, -3); log('Clip thứ hai lan truyền, bạn bị kiểm điểm.', 'bad'); }]]);
  J('ds_thuoc_khong_don', ['duoc_si'], 2, 9, 0.15, 2, 'Bán thuốc không đơn', 'Khách quen muốn mua kháng sinh, thuốc an thần số lượng lớn không có đơn.', [
    ['tu_choi', 'Từ chối, khuyên đi khám', HON, function (l, r, log) { fx(l, { karma: 2 }); log('Từ chối, khuyên khách đi khám bác sĩ.', 'good'); }],
    ['ban', 'Bán', BAD, function (l, r, log) { cB(l, 0.05, 'Bán thuốc không đơn'); if (ch(r, 0.05)) { fx(l, { karma: -15 }); log('Khách dùng thuốc an thần quá liều phải cấp cứu.', 'bad'); } if (ch(r, 0.15)) { log('Thanh tra phát hiện, nhà thuốc bị đình chỉ.', 'bad'); cB(l, -0.2, 'Đình chỉ nhà thuốc'); } }]]);
  J('nha_si_quang_cao', ['nha_si'], 1, 9, 0.12, 2, 'Đối thủ "bọc sứ 0 đồng"', 'Phòng khám đối thủ chạy quảng cáo "bọc sứ 0 đồng"; bạn mất khách.', [
    ['giu', 'Giữ giá, làm kỹ', HON, function (l, r, log) { cB(l, -0.1, 'Doanh thu giảm'); rep(l, 5); log('Giữ chất lượng; dần dần khách quay lại.', 'good'); }],
    ['bat_chuoc', 'Quảng cáo y hệt, làm ẩu cho nhanh', BAD, function (l, r, log) { cB(l, 0.3, 'Doanh thu tăng'); if (ch(r, 0.2)) { cB(l, -0.4, 'Bồi thường ca hỏng'); log('Ca bọc sứ hỏng tủy, khách kiện.', 'bad'); } }]]);
  J('thu_y_cho_ngao', ['thu_y'], 0, 9, 0.08, 3, 'Chú chó bị xe tông', 'Một người vô gia cư mang con chó bị xe tông đến, không có tiền.', [
    ['chua', 'Chữa miễn phí', { w: 1.5 }, function (l, r, log) { cB(l, -0.03, 'Chữa miễn phí'); fx(l, { karma: 5 }); if (ch(r, 0.3)) { fame(l, 2); log('Clip lan truyền, phòng khám đông khách hẳn.', 'good'); } else log('Chú chó qua khỏi, người đàn ông cảm ơn rối rít.', 'good'); }],
    ['tu_choi', 'Từ chối', { w: 0.3 }, function (l, r, log) { fx(l, { karma: -2 }); log('Từ chối; tối về vẫn nghĩ mãi.', 'neutral'); }]]);
  J('gv_ep_hoc_them', ['giao_vien'], 0, 9, 0.15, 2, 'Dạy thêm học sinh lớp mình', 'Có lời gợi ý mở lớp dạy thêm chính học sinh lớp mình.', [
    ['khong', 'Không dạy thêm học sinh lớp mình', HON, function (l, r, log) { fx(l, { karma: 2 }); log('Giữ nguyên tắc; phụ huynh và học sinh tin tưởng bạn.', 'good'); }],
    ['day', 'Mở lớp', BAD, function (l, r, log) { cB(l, 0.2, 'Dạy thêm'); if (ch(r, 0.2)) { rep(l, -10); log('Phụ huynh phản ánh "ép học thêm", bạn bị kỷ luật.', 'bad'); } }]]);
  J('gv_nang_diem', ['giao_vien'], 1, 9, 0.1, 3, 'Nâng điểm học bạ', 'Có ý kiến muốn "nâng" điểm học bạ cho đạt chỉ tiêu tốt nghiệp.', [
    ['dung', 'Chấm đúng', HON, function (l, r, log) { fx(l, { karma: 3 }); log('Chấm đúng thực chất; ban giám hiệu sau đó cũng ủng hộ.', 'good'); }],
    ['theo', 'Làm theo', BAD, function (l, r, log) { if (ch(r, 0.1)) { rep(l, -15); log('Thanh tra phát hiện nâng điểm, bạn bị kỷ luật.', 'bad'); } }]]);
  J('gv_hoc_sinh_bi_bao_hanh', ['giao_vien', 'gv_mam_non'], 0, 9, 0.06, 3, 'Học sinh có vết bầm', 'Phát hiện một học sinh thường có vết bầm, run sợ khi nhắc tới bố.', [
    ['bao', 'Báo ban giám hiệu và tổng đài bảo vệ trẻ em 111', { w: 1.5 }, function (l, r, log) { fx(l, { karma: 8 }); if (ch(r, 0.6)) { log('Các cơ quan can thiệp kịp thời, em được bảo vệ an toàn.', 'good'); H.mem(l, 'Ngày gọi tổng đài 111 cứu một học trò nhỏ.', 5); } else log('Đã báo, các cơ quan đang theo dõi.', 'neutral'); }],
    ['ke', '"Chuyện nhà người ta"', { w: 0.2 }, function (l, r, log) { fx(l, { karma: -5 }); log('Bạn im lặng — và day dứt mãi.', 'bad'); }]]);
  J('mn_camera', ['gv_mam_non'], 0, 9, 0.1, 2, 'Hiểu nhầm qua camera', 'Phụ huynh xem camera, hiểu nhầm cảnh bạn kéo tay bé là bạo hành, đăng lên mạng.', [
    ['xem_du', 'Mời phụ huynh xem toàn bộ đoạn video', HON, function (l, r, log) { if (ch(r, 0.7)) log('Xem toàn bộ video, phụ huynh hiểu ra và gỡ bài, xin lỗi.', 'good'); else { fx(l, { hap: -6 }); log('Phụ huynh vẫn không tin.', 'bad'); } }],
    ['im', 'Im lặng chờ qua', MID, function (l, r, log) { if (ch(r, 0.5)) fire(l, log, 'Áp lực dư luận, bạn bị cho nghỉ.'); }]]);
  J('gv_dao_van', ['giang_vien', 'nghien_cuu'], 0, 9, 0.1, 3, 'Mua bài báo', 'Cần đủ bài báo quốc tế để xét phó giáo sư, có nhóm rao bán "đứng tên bài báo".', [
    ['tu_lam', 'Tự nghiên cứu, tự viết', HON, function (l, r, log) { fx(l, { kno: 4 }); log('Tự làm, chậm hơn vài năm nhưng chắc chắn.', 'good'); }],
    ['mua', 'Mua bài báo', BAD, function (l, r, log) { promote(l); trap(l, 'dao_van'); log('Mua "đứng tên" bài báo, được xét chức danh sớm.', 'neutral'); }]]);
  TR('dao_van', 0.2, function (l, r, log) { if (l.job) l.job.rank = Math.max(0, l.job.rank - 1); fame(l, -8); log('Bài báo mua bị tạp chí rút do gian lận — chức danh bị hủy.', 'bad'); });
  J('nc_ket_qua_dot_pha', ['nghien_cuu'], 1, 9, 0.04, 5, 'Kết quả đột phá', 'Thí nghiệm cho kết quả bất ngờ, có thể thành công bố lớn.', [
    ['kiem', 'Kiểm chứng lại thật kỹ', { smart: 1, w: 1.3 }, function (l, r, log) { if (ch(r, 0.6)) { fx(l, { kno: 10 }); fame(l, 5); promote(l); log('Công bố được trên tạp chí uy tín, cả ngành biết tên.', 'big'); H.mem(l, 'Ngày bài báo của bạn được đăng trên tạp chí khoa học lớn.', 5); } else log('Kiểm chứng lại thì kết quả chưa chắc chắn; tiếp tục làm.', 'neutral'); }],
    ['ngay', 'Công bố ngay', { risk: 1 }, function (l, r, log) { if (ch(r, 0.4)) { fame(l, -3); log('Lỗi dữ liệu, phải rút bài.', 'bad'); } else { fame(l, 4); log('Công bố thành công.', 'good'); } }]]);
  J('gia_su_hoc_sinh_ca_biet', ['gia_su', 'fl_day'], 0, 9, 0.12, 2, 'Học trò cá biệt', 'Học trò cá biệt dọa "méc mẹ" nếu bạn không làm bài tập hộ.', [
    ['noi', 'Nói chuyện thẳng với phụ huynh', HON, function (l, r, log) { if (ch(r, 0.5)) { fx(l, { karma: 3 }); log('Phụ huynh hiểu chuyện, học trò dần tiến bộ.', 'good'); } else log('Mất lớp dạy kèm.', 'neutral'); }],
    ['lam_ho', 'Làm hộ cho yên', BAD, function (l, r, log) { if (ch(r, 0.3)) log('Học trò thi trượt, phụ huynh đổ lỗi cho bạn.', 'bad'); }]]);

  // ===================================================================
  // SHOWBIZ, BÁO CHÍ, SÁNG TẠO NỘI DUNG
  // ===================================================================
  J('sb_hop_dong_no_le', ['ca_si', 'rapper', 'dien_vien', 'nguoi_mau'], 0, 1, 0.15, 3, 'Hợp đồng 10 năm', 'Công ty giải trí mời ký hợp đồng 10 năm, ăn chia 70/30, phạt vi phạm gấp 10 lần.', [
    ['luat_su', 'Nhờ luật sư sửa điều khoản', { smart: 1, w: 1.2 }, function (l, r, log) { if (ch(r, 0.5)) { fame(l, 2); log('Công ty đồng ý sửa điều khoản công bằng hơn.', 'good'); } else log('Công ty không chịu, bạn tự đi đường riêng.', 'neutral'); }],
    ['ky', 'Ký luôn', { risk: 0.8 }, function (l, r, log) { fame(l, 4); trap(l, 'hd_no_le'); log('Ký hợp đồng, được lăng xê mạnh.', 'neutral'); }],
    ['tu_di', 'Từ chối, tự đi', MID, function (l, r, log) { log('Tự lăn lộn, chậm hơn nhưng tự do.', 'neutral'); }]]);
  TR('hd_no_le', function (l) { return (l.fame || 0) > 1e5 ? 0.3 : 0.05; }, function (l, r, log) { cB(l, -1.5, 'Đền hợp đồng'); log('Nổi tiếng rồi muốn rời công ty — phải đền hợp đồng một khoản lớn.', 'bad'); fx(l, { hap: -10 }); });
  J('sb_loi_moi_rieng', ['dien_vien', 'ca_si', 'nguoi_mau'], 0, 2, 0.08, 3, 'Lời mời "riêng tư"', 'Một nhà đầu tư hứa vai chính nếu bạn "ăn tối riêng" và "thân thiết" hơn.', [
    ['tu_choi', 'Từ chối', HON, function (l, r, log) { fx(l, { karma: 3 }); log('Từ chối thẳng. Mất vai, nhưng giữ được mình.', 'good'); }],
    ['to', 'Tố công khai', { risk: 1 }, function (l, r, log) { if (ch(r, 0.5)) { fame(l, 5); log('Cộng đồng ủng hộ, kẻ quấy rối bị lên án.', 'good'); } else { fame(l, -3); log('Bị "cấm sóng" ngầm một năm.', 'bad'); } }],
    ['chap_nhan', 'Chấp nhận', BAD, function (l, r, log) { fame(l, 5); fx(l, { hap: -10 }); trap(l, 'loi_moi'); log('Nhận được vai chính, nhưng không vui nổi.', 'neutral'); }]]);
  TR('loi_moi', 0.3, function (l, r, log) { phot(l); fame(l, -6); log('Chuyện cũ bị lộ ra, báo lá cải bàn tán khắp nơi.', 'bad'); fx(l, { hap: -8 }); });
  J('sb_tao_phot', ['ca_si', 'rapper', 'youtuber'], 1, 9, 0.1, 2, 'Dựng drama PR', 'Quản lý gợi ý dựng drama tình cảm giả để PR cho sản phẩm mới.', [
    ['khong', 'Không', HON, function (l, r, log) { log('Sản phẩm ra mắt bình thường, nói chuyện bằng chất lượng.', 'neutral'); }],
    ['lam', 'Làm', BAD, function (l, r, log) { fame(l, 4); if (ch(r, 0.4)) { fame(l, -8); phot(l); log('Kịch bản drama bị lộ, khán giả quay lưng.', 'bad'); } }]]);
  J('sb_dao_nhac', ['nhac_si', 'ca_si', 'rapper'], 0, 9, 0.08, 3, 'Nghi án đạo nhạc', 'Ca khúc hit của bạn bị tố giống một bài nước ngoài 8 ô nhịp.', [
    ['chung_minh', 'Chứng minh quá trình sáng tác', HON, function (l, r, log) { if (ch(r, 0.6)) log('Đưa ra bản thu demo, ghi chú sáng tác — được minh oan.', 'good'); else { fame(l, -2); log('Dư luận vẫn chia hai phe.', 'neutral'); } }],
    ['go', 'Xin lỗi, gỡ bài', MID, function (l, r, log) { fame(l, -4); cB(l, -0.1, 'Mất doanh thu bài hát'); log('Xin lỗi và gỡ bài.', 'neutral'); }]]);
  J('sb_show_bi_huy', ['ca_si', 'dj', 'mc_su_kien', 'vu_cong'], 0, 9, 0.1, 2, 'Bầu show quỵt cát-xê', 'Bầu show hủy sát giờ, quỵt cát-xê đã hứa; ê-kíp đòi tiền bạn.', [
    ['tu_tra', 'Tự trả ê-kíp', HON, function (l, r, log) { cB(l, -0.1, 'Trả ê-kíp'); rep(l, 5); log('Tự bỏ tiền trả ê-kíp, cả giới khen bạn sòng phẳng.', 'good'); }],
    ['day', 'Đẩy cho bầu show', MID, function (l, r, log) { fx(l, { soc: -5 }); log('Ê-kíp giận, không làm cùng nữa.', 'neutral'); }],
    ['kien', 'Kiện bầu show', { smart: 0.6 }, function (l, r, log) { if (ch(r, 0.6)) { cB(l, 0.1, 'Thắng kiện'); log('Thắng kiện sau một năm.', 'good'); } else log('Kiện tụng mãi chưa xong.', 'neutral'); }]]);
  J('sb_say_xin', ['ca_si', 'dien_vien', 'rapper', 'dj'], 2, 9, 0.1, 2, 'Tiệc after-party', 'Tiệc after-party có người mời "đồ vui".', [
    ['tu_choi', 'Từ chối, về sớm', HON, function (l, r, log) { log('Từ chối, về sớm.', 'neutral'); }],
    ['thu', 'Thử một lần', BAD, function (l, r, log) { fx(l, { karma: -4 }); if (ch(r, 0.4)) { l.addict.drugs = true; log('"Một lần" thành nhiều lần — bạn bắt đầu nghiện.', 'bad'); } if (ch(r, 0.2)) { fame(l, -15); log('Công an kiểm tra quán, bạn dương tính với ma túy — bị cấm sóng.', 'bad'); } }]]);
  J('dh_chu_de_nhay_cam', ['dv_hai'], 1, 9, 0.1, 2, 'Tiểu phẩm gây tranh cãi', 'Tiểu phẩm chọc cười một vùng miền đang viral, nhưng cũng bị phản ứng dữ dội.', [
    ['xin_loi', 'Xin lỗi, gỡ tiểu phẩm', HON, function (l, r, log) { fame(l, -2); log('Xin lỗi chân thành, khán giả bỏ qua.', 'neutral'); }],
    ['co_chap', 'Cố chấp', { risk: 1 }, function (l, r, log) { if (ch(r, 0.5)) fame(l, 3); else { fame(l, -6); cB(l, -0.1, 'Bị phạt'); log('Bị phạt và bị tẩy chay.', 'bad'); } }]]);
  J('ql_nghe_si_tron_thue', ['ql_nghe_si', 'ca_si', 'kol_live'], 1, 9, 0.1, 3, 'Chia nhỏ cát-xê để giảm thuế', 'Kế toán đề xuất chia cát-xê qua nhiều cá nhân để giảm thuế.', [
    ['dung', 'Kê khai đúng', HON, function (l, r, log) { cB(l, -0.2, 'Nộp thuế đầy đủ'); log('Kê khai và nộp thuế đầy đủ.', 'neutral'); }],
    ['lam', 'Làm theo', BAD, function (l, r, log) { cB(l, 0.3, 'Giảm thuế'); if (ch(r, 0.25)) { cB(l, -0.6, 'Truy thu thuế'); fame(l, -6); log('Bị truy thu thuế, tên bị nêu trên báo.', 'bad'); } }]]);
  J('pv_bai_dat_hang', ['phong_vien'], 0, 9, 0.15, 2, 'Bài viết đặt hàng', 'Một doanh nghiệp trả tiền để bạn viết bài "điều tra" bôi xấu đối thủ.', [
    ['tu_choi', 'Từ chối', HON, function (l, r, log) { fx(l, { karma: 3 }); log('Từ chối — nghề báo sống bằng sự thật.', 'good'); }],
    ['viet', 'Viết', BAD, function (l, r, log) { cB(l, 0.3, 'Tiền bài viết'); if (ch(r, 0.25)) { log('Đối thủ kiện, bạn bị thu thẻ nhà báo.', 'bad'); arrest(l, 'vu khống', 1); } }]]);
  J('pv_nguon_tin_bi_lo', ['phong_vien'], 1, 9, 0.06, 3, 'Bảo vệ nguồn tin', 'Người cung cấp tin cho loạt bài trước bị trả thù; bạn bị ép tiết lộ danh tính.', [
    ['giu', 'Giữ bí mật nguồn tin', { w: 1.5 }, function (l, r, log) { rep(l, 10); stress(l, 15); log('Giữ bí mật nguồn tin bằng mọi giá — đồng nghiệp nể phục.', 'good'); }],
    ['khai', 'Khai ra', { w: 0.2 }, function (l, r, log) { fx(l, { karma: -10 }); rep(l, -30); log('Khai ra nguồn tin — mất uy tín vĩnh viễn trong giới.', 'bad'); }]]);
  J('mc_tv_nham_ten', ['mc_tv'], 0, 9, 0.1, 2, 'Đọc nhầm trên sóng', 'Bạn đọc nhầm tên một vị khách mời quan trọng trên sóng trực tiếp.', [
    ['xin_loi', 'Xin lỗi ngay trên sóng', HON, function (l, r, log) { if (ch(r, 0.7)) { fame(l, 1); log('Xin lỗi duyên dáng, clip thành "khoảnh khắc dễ thương".', 'good'); } else log('Bị nhắc nhở.', 'neutral'); }],
    ['lo', 'Lờ đi', MID, function (l, r, log) { if (ch(r, 0.4)) log('Bị tạm ngừng dẫn chương trình 3 tháng.', 'bad'); }]]);
  J('cr_kenh_bi_hack', ['streamer', 'youtuber', 'kol_live'], 1, 9, 0.1, 2, 'Kênh bị chiếm', 'Kênh triệu người theo dõi bị chiếm, kẻ gian livestream lừa đảo tiền ảo.', [
    ['nen_tang', 'Báo nền tảng, chờ khôi phục', HON, function (l, r, log) { if (ch(r, 0.6)) { l.fame *= 0.8; log('Lấy lại kênh sau một tháng, mất 20% người theo dõi.', 'neutral'); } else { l.fame *= 0.3; log('Không lấy lại được kênh, phải làm lại từ đầu.', 'bad'); } }],
    ['dich_vu', 'Thuê "dịch vụ lấy lại nick"', { risk: 0.8 }, function (l, r, log) { if (ch(r, 0.5)) { cB(l, -0.05, 'Bị lừa dịch vụ lấy nick'); log('Bị "dịch vụ" lừa thêm một lần.', 'bad'); } else log('Lấy lại được kênh.', 'good'); }]]);
  J('cr_quang_cao_ban', ['youtuber', 'kol_live', 'streamer'], 1, 9, 0.15, 2, 'Quảng cáo "chữa ung thư"', 'Nhãn hàng thực phẩm chức năng "chữa ung thư" trả giá cao để bạn review.', [
    ['tu_choi', 'Từ chối', HON, function (l, r, log) { fx(l, { karma: 2 }); log('Từ chối — không đánh đổi sức khỏe người xem.', 'good'); }],
    ['nhan', 'Nhận review', BAD, function (l, r, log) { cB(l, 0.4, 'Review sản phẩm'); if (ch(r, 0.3)) { fame(l, -8); phot(l); cB(l, -0.2, 'Bị xử phạt'); log('Cơ quan chức năng xử phạt quảng cáo sai sự thật.', 'bad'); } if (ch(r, 0.1)) { fx(l, { karma: -10 }); log('Có người bỏ điều trị vì tin quảng cáo của bạn.', 'bad'); } }]]);
  J('cr_noi_tieng_nho_bi', ['youtuber', 'streamer'], 0, 1, 0.05, 4, 'Clip bất ngờ viral', 'Một clip ngẫu hứng bất ngờ đạt 20 triệu lượt xem.', [
    ['deu', 'Nắm thời cơ, ra nội dung đều đặn', { w: 1.3 }, function (l, r, log) { if (ch(r, 0.5)) { fame(l, 6); log('Ra nội dung đều, kênh lên hạng hẳn.', 'big'); } else log('Hút được một lượng người theo dõi mới.', 'good'); }],
    ['o_at', 'Đăng ồ ạt cho kịp trend', MID, function (l, r, log) { if (ch(r, 0.3)) { fx(l, { hap: -4 }); log('Hết hot sau 3 tháng.', 'neutral'); } else fame(l, 3); }]]);

  // ===================================================================
  // LÀM ĐẸP & THỜI TRANG
  // ===================================================================
  J('spa_tham_my_chui', ['spa', 'makeup'], 1, 9, 0.15, 2, 'Tiêm filler "chui"', 'Một "chuyên gia" rủ làm thêm dịch vụ tiêm filler, căng chỉ tại spa, lời gấp năm.', [
    ['tu_choi', 'Từ chối, chỉ làm đúng giấy phép', HON, function (l, r, log) { fx(l, { karma: 2 }); log('Từ chối dịch vụ vượt giấy phép.', 'good'); }],
    ['lam', 'Làm', BAD, function (l, r, log) { cB(l, 0.5, 'Dịch vụ thẩm mỹ chui'); trap(l, 'tham_my_chui'); }]]);
  TR('tham_my_chui', 0.15, function (l, r, log) { cB(l, -1, 'Bồi thường biến chứng'); fx(l, { karma: -8 }); log('Khách tiêm filler bị biến chứng nặng — spa bị đóng cửa, bạn phải bồi thường.', 'bad'); if (ch(r, 0.15)) arrest(l, 'hành nghề khám, chữa bệnh không có giấy phép', 2); });
  J('toc_khach_hong_toc', ['tho_toc', 'barber'], 0, 9, 0.15, 2, 'Khách hỏng tóc', 'Khách nhuộm tẩy xong tóc bị gãy, đòi đền gấp mười và dọa đăng mạng.', [
    ['phuc_hoi', 'Xin lỗi, phục hồi miễn phí, hoàn tiền', HON, function (l, r, log) { cB(l, -0.03, 'Hoàn tiền khách'); rep(l, 3); log('Phục hồi tóc miễn phí, khách nguôi giận.', 'good'); }],
    ['cai', 'Cãi lại', { risk: 0.8 }, function (l, r, log) { if (ch(r, 0.5)) { cB(l, -0.1, 'Tiệm vắng khách'); log('Bài đăng lan rộng, tiệm vắng khách 3 tháng.', 'bad'); } }]]);
  J('nail_hoa_chat', ['nail'], 0, 9, 0.1, 3, 'Hóa chất làm móng', 'Làm nhiều năm trong tiệm kín, bạn bắt đầu ho kéo dài và đau đầu.', [
    ['dau_tu', 'Đầu tư máy hút bụi, khẩu trang chuẩn', HON, function (l, r, log) { cB(l, -0.05, 'Máy hút bụi, khẩu trang'); log('Lắp máy hút bụi, đeo khẩu trang chuẩn — đỡ hẳn.', 'good'); }],
    ['ke', 'Kệ', MID, function (l, r, log) { l.flags.nailPhoi = true; fx(l, { hea: -2 }); }]]);
  J('nail_nuoc_ngoai', ['nail'], 1, 9, 0.08, 4, 'Sang nước ngoài làm nail', 'Người quen mời sang nước ngoài làm nail lương gấp 5, nhưng phải đi theo diện kết hôn giả.', [
    ['hop_phap', 'Chỉ đi theo đường hợp pháp', HON, function (l, r, log) { if (ch(r, 0.2)) { cB(l, 0.5, 'Lương làm nail ở nước ngoài'); log('Sau thời gian dài chờ đợi, đi được theo diện hợp pháp.', 'good'); } else log('Hồ sơ vẫn đang chờ.', 'neutral'); }],
    ['ket_hon_gia', 'Đi diện kết hôn giả', BAD, function (l, r, log) { cB(l, -0.6, 'Phí dịch vụ'); if (ch(r, 0.4)) { log('Bị phát hiện kết hôn giả, trục xuất và cấm nhập cảnh 10 năm.', 'bad'); fx(l, { hap: -10 }); } else { cB(l, 1.5, 'Lương làm nail ở nước ngoài'); log('Sang được nước ngoài làm nail, lương gấp nhiều lần, nhưng sống trong lo sợ.', 'neutral'); } }]]);
  J('xam_khach_vi_thanh_nien', ['tho_xam'], 0, 9, 0.12, 2, 'Khách tuổi vị thành niên', 'Một bạn trông khoảng 16 tuổi đến xăm hình lớn, nói đã đủ 18 nhưng quên căn cước.', [
    ['giay_to', 'Yêu cầu giấy tờ', HON, function (l, r, log) { fx(l, { karma: 2 }); log('Không có giấy tờ thì không xăm.', 'good'); }],
    ['xam', 'Xăm luôn', BAD, function (l, r, log) { cB(l, 0.02, 'Tiền xăm'); if (ch(r, 0.3)) { cB(l, -0.05, 'Bị phạt'); rep(l, -10); log('Phụ huynh đến làm ầm, tiệm bị phạt.', 'bad'); } }]]);
  J('tk_bi_nhai_mau', ['tk_thoi_trang', 'stylist'], 0, 9, 0.12, 2, 'Bộ sưu tập bị nhái', 'Một xưởng lớn nhái bộ sưu tập của bạn, bán rẻ một phần ba trên sàn thương mại điện tử.', [
    ['bao_ho', 'Đăng ký bảo hộ, khiếu nại sàn', { smart: 1 }, function (l, r, log) { cB(l, -0.05, 'Phí bảo hộ'); if (ch(r, 0.6)) log('Sàn gỡ hàng nhái.', 'good'); }],
    ['pr', 'Biến thành cú PR "hàng thật vs hàng nhái"', { soc: 1 }, function (l, r, log) { if (ch(r, 0.5)) { fame(l, 3); cB(l, 0.2, 'Doanh thu tăng'); log('Cú PR thành công, doanh thu tăng.', 'good'); } }]]);
  J('nm_ep_can', ['nguoi_mau'], 0, 9, 0.15, 2, 'Ép giảm cân', 'Công ty yêu cầu giảm 5 kg trong một tháng trước Tuần lễ thời trang.', [
    ['tu_tu', 'Thương lượng, giảm từ từ có chuyên gia', HON, function (l, r, log) { if (ch(r, 0.5)) log('Mất show lần này, nhưng giữ được sức khỏe.', 'neutral'); else log('Công ty đồng ý lộ trình hợp lý.', 'good'); }],
    ['nhin_an', 'Nhịn ăn, dùng thuốc giảm cân trôi nổi', BAD, function (l, r, log) { fx(l, { hea: -10 }); if (ch(r, 0.2)) log('Ngất trên sàn diễn.', 'bad'); }]]);
  J('nhiep_anh_anh_bi_lay', ['nhiep_anh'], 0, 9, 0.12, 2, 'Ảnh bị dùng không phép', 'Ảnh của bạn bị một thương hiệu lớn dùng làm quảng cáo không xin phép.', [
    ['boi_thuong', 'Gửi yêu cầu bồi thường kèm bằng chứng', { smart: 1 }, function (l, r, log) { if (ch(r, 0.6)) { cB(l, 0.2, 'Bồi thường bản quyền ảnh'); log('Được bồi thường bản quyền.', 'good'); } }],
    ['mang', 'Đăng lên mạng tố', { soc: 1 }, function (l, r, log) { if (ch(r, 0.5)) { fame(l, 2); log('Thương hiệu xin lỗi công khai.', 'good'); } }]]);
  J('su_kien_mua_cuoi', ['su_kien'], 1, 9, 0.1, 2, 'Gala cuối năm', 'Một tập đoàn mời tổ chức gala cuối năm với ngân sách lớn chưa từng có.', [
    ['nhan', 'Nhận, dồn hết sức', { amb: 1 }, function (l, r, log) { if (ch(r, 0.7)) { cB(l, 0.6, 'Hợp đồng gala'); rep(l, 10); log('Gala thành công rực rỡ.', 'big'); } else { cB(l, -0.2, 'Phạt hợp đồng'); log('Sự cố kỹ thuật giữa chương trình, bị phạt hợp đồng.', 'bad'); } }],
    ['chia', 'Chia lại cho đối tác lớn hơn', MID, function (l, r, log) { cB(l, 0.1, 'Hoa hồng'); log('Nhường đối tác lớn, nhận hoa hồng an toàn.', 'neutral'); }]]);

  // ===================================================================
  // THỂ THAO, ESPORTS, CỜ
  // ===================================================================
  J('tt_doping', ['vdv'], 1, 9, 0.08, 3, '"Thuốc phục hồi"', 'Có người gợi ý dùng "thuốc phục hồi" không rõ thành phần trước giải lớn.', [
    ['tu_choi', 'Hỏi rõ, từ chối', HON, function (l, r, log) { log('Từ chối, thi đấu bằng sức mình.', 'good'); }],
    ['dung', 'Dùng thử', BAD, function (l, r, log) { l.skill = Math.min(100, (l.skill || 50) + 5); if (ch(r, 0.3)) { fame(l, -10); l.medals = (l.medals || []).slice(0, -1); fire(l, log, 'Xét nghiệm dương tính doping — bị cấm thi đấu 4 năm, tước huy chương.'); } }]]);
  J('pt_khach_chan_thuong', ['pt_gym'], 0, 9, 0.1, 2, 'Khách VIP chấn thương', 'Khách VIP đòi tập nặng quá sức để kịp đám cưới, bị trật khớp.', [
    ['nhan_loi', 'Nhận lỗi, hỗ trợ chi phí', HON, function (l, r, log) { cB(l, -0.05, 'Hỗ trợ khách'); rep(l, 3); log('Nhận phần trách nhiệm, hỗ trợ khách điều trị.', 'good'); }],
    ['do', 'Đổ cho khách tự ý', MID, function (l, r, log) { if (ch(r, 0.4)) { cB(l, -0.1, 'Mất khách'); log('Bị đăng mạng, mất nhiều khách.', 'bad'); } }]]);
  J('pt_ban_thuoc', ['pt_gym'], 0, 9, 0.12, 2, 'Thuốc tăng cơ xách tay', 'Phòng gym muốn PT bán kèm thuốc tăng cơ xách tay, hoa hồng 30%.', [
    ['tu_choi', 'Từ chối', HON, function (l, r, log) { fx(l, { karma: 2 }); log('Từ chối bán thuốc không rõ nguồn gốc.', 'good'); }],
    ['ban', 'Bán', BAD, function (l, r, log) { cB(l, 0.15, 'Hoa hồng thuốc'); if (ch(r, 0.1)) { cB(l, -0.3, 'Bồi thường học viên'); log('Học viên bị tổn thương gan, kiện bạn.', 'bad'); } }]]);
  J('hlv_tt_ap_luc_thanh_tich', ['hlv_tt'], 1, 9, 0.15, 2, 'Áp lực thành tích', 'Đội thua 3 trận liền, dư luận gọi tên bạn.', [
    ['giu', 'Giữ triết lý, cho cầu thủ trẻ ra sân', { amb: 1 }, function (l, r, log) { if (ch(r, 0.4)) { fame(l, 5); log('Lứa trẻ tỏa sáng, đội lội ngược dòng!', 'big'); } else fire(l, log, 'Đội tiếp tục thua, bạn bị sa thải.'); }],
    ['an_toan', 'Chơi an toàn', MID, function (l, r, log) { if (ch(r, 0.6)) log('Giữ được ghế.', 'neutral'); else fire(l, log, 'Vẫn bị sa thải.'); }]]);
  J('es_hop_dong_doi', ['tuyen_thu_es'], 0, 1, 0.15, 2, 'Hợp đồng gaming house', 'Đội mới mời ký hợp đồng 3 năm, bao ăn ở "gaming house", lương chỉ 3 triệu.', [
    ['dam_phan', 'Đọc kỹ, đàm phán', { smart: 1 }, function (l, r, log) { if (ch(r, 0.5)) log('Thêm được điều khoản giải phóng hợp đồng.', 'good'); else log('Đội không đồng ý sửa.', 'neutral'); }],
    ['ky', 'Ký luôn', { risk: 0.6 }, function (l, r, log) { trap(l, 'es_hd'); log('Ký hợp đồng.', 'neutral'); }]]);
  TR('es_hd', function (l) { return (l.fame || 0) > 5e4 ? 0.3 : 0.05; }, function (l, r, log) { fx(l, { hap: -8 }); log('Nổi tiếng rồi, đội lớn hỏi mua nhưng đội cũ "giam" hợp đồng không cho chuyển nhượng.', 'bad'); });
  J('es_ban_do', ['tuyen_thu_es'], 0, 9, 0.08, 3, 'Lời mời bán độ', 'Nhà cái tiếp cận nhờ "thua có kiểm soát" một map.', [
    ['bao', 'Báo ban tổ chức', HON, function (l, r, log) { fx(l, { karma: 4 }); rep(l, 6); log('Báo ban tổ chức, đường dây bán độ bị điều tra.', 'good'); }],
    ['im', 'Từ chối im lặng', MID, function (l, r, log) { if (ch(r, 0.2)) log('Một đồng đội nhận lời, cả đội bị điều tra.', 'bad'); }],
    ['nhan', 'Nhận', BAD, function (l, r, log) { cB(l, 0.3, 'Tiền bán độ'); if (ch(r, 0.3)) { fame(l, -10); fire(l, log, 'Bị phát hiện, cấm thi đấu vĩnh viễn.'); arrest(l, 'tổ chức đánh bạc, gian lận', 1); } }]]);
  J('es_toxic_mang', ['tuyen_thu_es', 'streamer'], 1, 9, 0.12, 2, 'Bị fan chửi', 'Thua trận, bạn bị fan chửi; nóng mắt chửi lại trên stream.', [
    ['xin_loi', 'Xin lỗi, nghỉ mạng một tuần', HON, function (l, r, log) { stress(l, -5); log('Nghỉ ngơi một tuần, quay lại bình tĩnh hơn.', 'good'); }],
    ['chui', 'Chửi tiếp', BAD, function (l, r, log) { fame(l, -5); phot(l); cB(l, -0.05, 'Bị phạt'); log('Clip lan truyền, bị phạt.', 'bad'); }]]);
  J('es_nghien_choi', ['tuyen_thu_es'], 0, 9, 0.15, 2, 'Tập luyện quá sức', 'Tập 14 tiếng mỗi ngày, đau cổ tay và mất ngủ triền miên.', [
    ['giam', 'Giảm giờ tập, tập vật lý trị liệu', HON, function (l, r, log) { l.skill = Math.max(0, (l.skill || 50) - 2); log('Giảm giờ tập, cổ tay đỡ hẳn.', 'good'); }],
    ['co', 'Cố tiếp', { amb: 1 }, function (l, r, log) { fx(l, { hea: -4 }); if (ch(r, 0.25)) fire(l, log, 'Chấn thương cổ tay nặng, phải giải nghệ sớm.'); }]]);
  J('co_gian_lan_thiet_bi', ['ky_thu'], 0, 9, 0.05, 4, 'Nghi gian lận thiết bị', 'Phát hiện đối thủ nghi dùng phần mềm hỗ trợ qua thiết bị giấu kín.', [
    ['khieu_nai', 'Khiếu nại có bằng chứng', { smart: 1 }, function (l, r, log) { if (ch(r, 0.6)) { rep(l, 5); log('Đối thủ bị xử thua.', 'good'); } else log('Không đủ bằng chứng.', 'neutral'); }],
    ['im', 'Im lặng', MID, function (l, r, log) { fx(l, { hap: -5 }); log('Mất danh hiệu vào tay kẻ gian lận.', 'bad'); }]]);
  J('co_hoc_tro_than_dong', ['hlv_co', 'ky_thu'], 2, 9, 0.05, 5, 'Em bé thần đồng cờ', 'Một em bé 7 tuổi ở quê có năng khiếu cờ hiếm thấy, nhà nghèo.', [
    ['day', 'Nhận dạy miễn phí', { w: 1.5 }, function (l, r, log) { cB(l, -0.05, 'Dạy miễn phí'); fx(l, { karma: 6 }); if (ch(r, 0.4)) { fame(l, 3); log('Em bé trở thành kiện tướng — bạn tự hào như con mình.', 'big'); H.mem(l, 'Ngày học trò nhỏ được phong kiện tướng.', 5); } else log('Dạy em mỗi tuần, em tiến bộ từng ngày.', 'good'); }],
    ['gioi_thieu', 'Giới thiệu sang trung tâm', MID, function (l, r, log) { fx(l, { karma: 2 }); log('Giới thiệu em sang trung tâm có học bổng.', 'good'); }]]);

  // ===================================================================
  // FREELANCER
  // ===================================================================
  J('fl_khach_quyt', 'free', 0, 9, 0.15, 2, 'Khách quỵt tiền', 'Giao xong dự án, khách nước ngoài biến mất, chưa thanh toán 70%.', [
    ['rut_kn', 'Bỏ qua, lần sau đòi cọc', { smart: 1 }, function (l, r, log) { cB(l, -0.2, 'Bị quỵt tiền'); l.flags.doiCoc = true; log('Mất tiền dự án, từ nay luôn đòi cọc trước.', 'bad'); }],
    ['to', 'Tố lên cộng đồng nghề', { soc: 1 }, function (l, r, log) { if (ch(r, 0.3)) log('Cộng đồng nghề lên tiếng, khách phải thanh toán.', 'good'); else cB(l, -0.2, 'Bị quỵt tiền'); }]], function (l) { return !l.flags.doiCoc || U.rand(l) < 0.5; });
  J('fl_bhxh_tu_nguyen', 'free', 0, 9, 0.1, 5, 'Bảo hiểm xã hội tự nguyện', 'Bạn nhận ra mình đã ngoài 35 tuổi mà chưa có năm nào đóng bảo hiểm xã hội.', [
    ['dong', 'Đóng BHXH tự nguyện', { smart: 1, w: 1.2 }, function (l, r, log) { l.flags.bhxhTN = true; log('Đăng ký đóng BHXH tự nguyện — về già sẽ có lương hưu.', 'good'); }],
    ['tu_dau_tu', 'Tự đầu tư cho tuổi già', MID, function (l, r, log) { log('Tự để dành, tự đầu tư cho tuổi già.', 'neutral'); }]], function (l, a) { return a >= 35 && !l.flags.bhxhTN; });
  E.HOOKS.year.push(function (l, r, log, a) { if (l.flags.bhxhTN && l.job && cat(l) === 'free' && l.alive && !l.retired && !l.pensioned && (!l.si || l.si.last !== a) && !(l.jailUntil != null && a < l.jailUntil) && !(l.flags.military && a < l.flags.military)) { var m = Math.min((l.income || l.base) / 12, l.base / 6); if (l.money < m * 12 * 0.22) return; H.cash(l, -m * 12 * 0.22, 'BHXH tự nguyện'); l.si = l.si || { yrs: 0, sum: 0 }; l.si.yrs++; l.si.sum += m * 12; l.si.last = a; } });
  J('fl_hop_dong_doc_quyen', ['fl_dev', 'fl_thiet_ke', 'fl_video'], 1, 9, 0.08, 3, 'Hợp đồng độc quyền', 'Một khách lớn đề nghị trả lương cố định, đổi lại bạn không được nhận việc nơi khác.', [
    ['nhan', 'Nhận', MID, function (l, r, log) { cB(l, 0.3, 'Thu nhập ổn định'); trap(l, 'fl_docquyen'); log('Thu nhập ổn định hơn hẳn.', 'good'); }],
    ['tu_do', 'Giữ tự do', MID, function (l, r, log) { log('Giữ tự do, thu nhập thất thường.', 'neutral'); }]]);
  TR('fl_docquyen', 0.3, function (l, r, log) { cB(l, -0.3, 'Mất hợp đồng độc quyền'); log('Khách lớn cắt hợp đồng độc quyền, khách cũ đã đi hết — trắng tay mấy tháng.', 'bad'); });
  J('fl_dich_tai_lieu_mat', ['fl_dich'], 1, 9, 0.08, 3, 'Tài liệu đấu thầu mật', 'Được thuê dịch tài liệu đấu thầu mật của một công ty; người khác đề nghị mua bản dịch.', [
    ['bao_mat', 'Từ chối, giữ bảo mật', HON, function (l, r, log) { rep(l, 5); log('Giữ bảo mật tuyệt đối.', 'good'); }],
    ['ban', 'Bán', BAD, function (l, r, log) { cB(l, 0.3, 'Bán tài liệu'); if (ch(r, 0.3)) { cB(l, -0.5, 'Bồi thường vi phạm hợp đồng'); log('Bị phát hiện, kiện vi phạm hợp đồng, mất mọi khách quen.', 'bad'); } }]]);
  J('fl_content_ai', ['fl_content'], 0, 9, 0.15, 2, 'Bị ép giá vì AI', 'Khách ép giá còn một nửa vì "AI viết được".', [
    ['bien_tap', 'Chuyển sang biên tập, làm chiến lược nội dung', { smart: 1 }, function (l, r, log) { fx(l, { kno: 5 }); if (ch(r, 0.6)) log('Giữ được thu nhập nhờ nâng cấp kỹ năng.', 'good'); else cB(l, -0.1, 'Thu nhập giảm'); }],
    ['ai', 'Dùng AI viết đại trà', { risk: 0.6 }, function (l, r, log) { cB(l, 0.1, 'Nhiều đơn hơn'); if (ch(r, 0.3)) { cB(l, -0.2, 'Mất khách lớn'); log('Khách phát hiện nội dung sao chép, mất khách lớn.', 'bad'); } }]]);
  J('fl_aff_hang_kem', ['fl_aff', 'kol_live'], 0, 9, 0.15, 2, 'Hàng affiliate kém chất lượng', 'Sản phẩm affiliate hoa hồng cao nhất lại là hàng kém chất lượng, nhiều người phản ánh.', [
    ['ngung', 'Ngừng quảng bá', HON, function (l, r, log) { cB(l, -0.1, 'Thu nhập giảm'); fx(l, { karma: 2 }); log('Ngừng quảng bá sản phẩm kém.', 'good'); }],
    ['tiep', 'Tiếp tục', BAD, function (l, r, log) { cB(l, 0.2, 'Hoa hồng affiliate'); if (ch(r, 0.3)) log('Sàn khóa tài khoản vì tỷ lệ hoàn hàng cao.', 'bad'); }]]);
  J('fl_long_tieng_giong_ai', ['fl_long_tieng'], 0, 9, 0.1, 3, 'Giọng nói bị sao chép', 'Phát hiện giọng mình bị sao chép bằng AI để lồng tiếng quảng cáo không xin phép.', [
    ['go', 'Yêu cầu gỡ bỏ, bồi thường', { smart: 1 }, function (l, r, log) { if (ch(r, 0.5)) { cB(l, 0.15, 'Bồi thường giọng nói'); log('Được bồi thường.', 'good'); } }],
    ['ban', 'Bán bản quyền giọng có điều kiện', MID, function (l, r, log) { cB(l, 0.4, 'Bán bản quyền giọng'); log('Bán bản quyền giọng nói, sau đó ít việc hơn.', 'neutral'); }]]);
  J('fl_burnout_lam_dem', 'free', 0, 9, 0.12, 2, 'Làm việc ba múi giờ', 'Nhận việc cho khách ở ba múi giờ, thức trắng liên tục, không ngày nghỉ.', [
    ['lich', 'Đặt lịch làm việc cố định, từ chối bớt', HON, function (l, r, log) { cB(l, -0.1, 'Bớt việc'); stress(l, -10); log('Đặt giờ làm cố định, ngủ đủ giấc trở lại.', 'good'); }],
    ['co', 'Cố tiếp', { amb: 1 }, function (l, r, log) { cB(l, 0.1, 'Làm thêm'); stress(l, 15); }]]);

  // ===================================================================
  // DỊCH VỤ, DU LỊCH & HÀNG KHÔNG
  // ===================================================================
  J('pc_met_moi', ['phi_cong'], 1, 9, 0.1, 2, 'Bay thêm chặng đêm', 'Đã bay đủ giờ, hãng thiếu người, nhờ bạn nhận thêm một chặng đêm.', [
    ['tu_choi', 'Từ chối theo quy định giờ bay', HON, function (l, r, log) { rep(l, -2); log('Từ chối đúng quy định an toàn bay.', 'good'); }],
    ['nhan', 'Nhận', { risk: 0.8 }, function (l, r, log) { cB(l, 0.05, 'Phụ cấp bay thêm'); if (ch(r, 0.03)) { log('Sự cố phải hạ cánh khẩn cấp, bị điều tra.', 'bad'); rep(l, -10); } }]]);
  J('pc_ha_canh_kho', ['phi_cong'], 1, 9, 0.04, 5, 'Hạ cánh trong thời tiết xấu', 'Thời tiết xấu, một động cơ trục trặc — bạn phải đưa cả trăm hành khách hạ cánh an toàn.', [
    ['ok', 'Bình tĩnh xử lý', { w: 1 }, function (l, r, log) { fame(l, 5); rep(l, 15); log('Hạ cánh an toàn cả trăm hành khách, được cả nước ca ngợi.', 'big'); H.mem(l, 'Cú hạ cánh trong bão, cả khoang hành khách vỗ tay.', 7); if (ch(r, 0.3)) stress(l, 20); }]]);
  J('tv_khach_say', ['tiep_vien'], 0, 9, 0.15, 2, 'Hành khách quấy rối', 'Một hành khách say xỉn quấy rối bạn và gây rối trên chuyến bay.', [
    ['bao', 'Báo cơ trưởng, lập biên bản', HON, function (l, r, log) { rep(l, 3); log('Khách gây rối bị lập biên bản, cấm bay.', 'good'); }],
    ['nhin', 'Nhẫn nhịn cho êm', MID, function (l, r, log) { fx(l, { hap: -6 }); stress(l, 10); }]]);
  J('tv_xach_hang', ['tiep_vien', 'phi_cong'], 0, 9, 0.1, 3, 'Nhờ xách tay', 'Người quen nhờ "xách tay" một túi hàng hiệu, trả công hậu, không cho xem bên trong.', [
    ['tu_choi', 'Từ chối', HON, function (l, r, log) { log('Từ chối thẳng.', 'good'); }],
    ['nhan', 'Nhận', BAD, function (l, r, log) { cB(l, 0.1, 'Công xách tay'); if (ch(r, 0.15)) { fire(l, log, 'Bên trong là hàng cấm — bạn bị bắt ngay tại sân bay.'); arrest(l, 'vận chuyển hàng cấm', 2); } }]]);
  J('kskl_su_co', ['kskl'], 0, 9, 0.05, 3, 'Hai máy bay quá gần nhau', 'Hai máy bay được cấp độ cao quá gần nhau, may phát hiện kịp.', [
    ['bao_cao', 'Tự báo cáo sự cố', HON, function (l, r, log) { rep(l, -3); stress(l, 10); log('Tự báo cáo, hệ thống được sửa, không ai bị kỷ luật nặng.', 'good'); }],
    ['giau', 'Giấu đi', BAD, function (l, r, log) { if (ch(r, 0.3)) fire(l, log, 'Bị phát hiện qua dữ liệu radar, đình chỉ công tác.'); }]]);
  J('hdv_ep_mua_sam', ['hdv'], 0, 9, 0.15, 2, 'Ép khách mua sắm', 'Công ty yêu cầu dẫn khách vào điểm mua sắm "đối tác" giá gấp ba, hoa hồng 20%.', [
    ['noi_that', 'Dẫn ít, nói thật giá', HON, function (l, r, log) { rep(l, 3); log('Khách cảm ơn, đánh giá 5 sao.', 'good'); }],
    ['ep', 'Ép khách mua', BAD, function (l, r, log) { cB(l, 0.15, 'Hoa hồng mua sắm'); if (ch(r, 0.2)) fire(l, log, 'Khách tố lên mạng, bạn bị đuổi việc.'); }]]);
  J('hdv_khach_mat_tich', ['hdv'], 0, 9, 0.04, 4, 'Khách mất tích', 'Một khách tách đoàn đi riêng, mất liên lạc ở vùng núi.', [
    ['cuu_ho', 'Báo cứu hộ ngay', HON, function (l, r, log) { if (ch(r, 0.85)) { rep(l, 5); log('Lực lượng cứu hộ tìm thấy khách an toàn.', 'good'); } else log('Tìm kiếm mãi mới thấy, khách bị thương.', 'bad'); }],
    ['cho', 'Chờ thêm vài tiếng', MID, function (l, r, log) { if (ch(r, 0.3)) { rep(l, -15); log('Chậm trễ gây hậu quả, bạn bị kỷ luật.', 'bad'); } }]]);
  J('ks_camera_phong', ['le_tan'], 1, 9, 0.05, 4, 'Camera quay lén', 'Khách phát hiện thiết bị lạ trong phòng, nghi camera quay lén.', [
    ['bao', 'Báo công an, hợp tác điều tra', HON, function (l, r, log) { rep(l, 5); log('Hợp tác điều tra, kẻ lắp camera bị bắt.', 'good'); }],
    ['dap', 'Dập đi "bảo vệ uy tín"', BAD, function (l, r, log) { if (ch(r, 0.4)) { rep(l, -15); log('Vụ việc bị lộ, khách sạn bị phạt nặng, bạn bị liên đới.', 'bad'); } }]]);
  J('barista_mo_quan', ['barista', 'bartender'], 1, 9, 0.08, 3, 'Mở quán riêng', 'Tích lũy được ít vốn, có mặt bằng nhỏ trong hẻm cho thuê rẻ.', [
    ['mo', 'Mở quán riêng', { amb: 1 }, function (l, r, log) { cB(l, -0.4, 'Vốn mở quán'); E.startJob(l, 'kd_quan', r, log); }],
    ['lam_tiep', 'Làm tiếp cho chủ', MID, function (l, r, log) { log('Làm tiếp, tích lũy thêm.', 'neutral'); }]]);
  J('bar_say_lai_xe', ['bartender', 'dj'], 0, 9, 0.12, 2, 'Khách say đòi lái xe', 'Khách quen đã say vẫn đòi tự lái xe về.', [
    ['goi_xe', 'Gọi tài xế hộ, giữ chìa khóa', HON, function (l, r, log) { fx(l, { karma: 3 }); log('Giữ chìa khóa, gọi tài xế đưa khách về.', 'good'); }],
    ['ke', 'Kệ', MID, function (l, r, log) { if (ch(r, 0.1)) { fx(l, { karma: -5 }); log('Khách gặp tai nạn trên đường về.', 'bad'); } }]]);
  J('thu_ngan_thieu_tien', ['thu_ngan'], 0, 9, 0.15, 2, 'Két thiếu tiền', 'Cuối ca, két thiếu 500 nghìn, quản lý bắt đền.', [
    ['den', 'Đền, xin trích camera', HON, function (l, r, log) { if (ch(r, 0.5)) log('Camera cho thấy khách lừa đổi tiền, bạn được trả lại.', 'good'); else cB(l, -0.005, 'Đền tiền thiếu két'); }],
    ['cai', 'Cãi', MID, function (l, r, log) { rep(l, -5); }]]);

  // ===================================================================
  // PHI PHÁP — chỉ mô tả kết cục, không đi vào cách làm
  // ===================================================================
  J('pp_dan_em_khai', ['doi_no', 'ma_tuy', 'buon_lau', 'nha_cai'], 1, 9, 0.12, 2, 'Đàn em bị bắt', 'Một đàn em bị bắt, có tin đồn sẽ khai ra bạn.', [
    ['rua_tay', '"Rửa tay", bỏ đi tỉnh khác', { w: 1 }, function (l, r, log) { heat(l, -30); fx(l, { hap: -8 }); fire(l, log, 'Bỏ hết mối làm ăn, rời khỏi tỉnh.'); }],
    ['o_lai', 'Ở lại cầu may', { risk: 1 }, function (l, r, log) { if (ch(r, 0.5)) arrest(l, (E.jobDef(l).crime || [])[3] || 'hoạt động phi pháp', 2); }],
    ['de_doa', 'Đe dọa gia đình đàn em', BAD, function (l, r, log) { fx(l, { karma: -15 }); heat(l, 30); if (ch(r, 0.6)) arrest(l, 'đe dọa, cản trở điều tra', 3); }]]);
  J('pp_nan_nhan', ['doi_no', 'cho_vay'], 0, 9, 0.1, 3, 'Gia đình con nợ tan nát', 'Một con nợ bị dồn ép đến mức gia đình tan nát, báo chí đưa tin.', [
    ['xoa_no', 'Xóa nợ, bỏ nghề', { w: 1 }, function (l, r, log) { cB(l, -0.5, 'Xóa nợ'); fx(l, { karma: 10 }); fire(l, log, 'Xóa nợ cho họ và bỏ nghề — muốn làm lại cuộc đời.'); }],
    ['tiep', 'Tiếp tục', BAD, function (l, r, log) { fx(l, { karma: -10 }); heat(l, 20); log('Tiếp tục. Đêm nào cũng nằm mơ thấy gương mặt đứa trẻ nhà con nợ.', 'bad'); }]]);
  J('pp_tranh_dia_ban', ['doi_no', 'nha_cai', 'ma_tuy'], 1, 9, 0.1, 2, 'Tranh địa bàn', 'Băng nhóm khác đòi chia địa bàn.', [
    ['nhuong', 'Nhường', MID, function (l, r, log) { cB(l, -0.3, 'Mất địa bàn'); }],
    ['doi_dau', 'Đối đầu', BAD, function (l, r, log) { heat(l, 25); if (ch(r, 0.1)) { H.kill(l, 'thanh toán giữa các băng nhóm', log, true); return; } if (ch(r, 0.3)) { fx(l, { hea: -30 }); log('Bị thương nặng trong một trận ẩu đả.', 'bad'); } }],
    ['rut', 'Rút khỏi nghề', { w: 0.8 }, function (l, r, log) { heat(l, -20); fire(l, log, 'Rút khỏi giới giang hồ, tìm đường làm lại.'); }]]);
  J('pp_rua_tien', 'crime', 1, 9, 0.12, 3, '"Hợp thức hóa" tiền', 'Có người đề nghị "hợp thức hóa" tiền qua một quán ăn, đổi lại chia phần.', [
    ['khong', 'Không dính thêm', { w: 1 }, function (l, r, log) { log('Không dính thêm.', 'neutral'); }],
    ['nhan', 'Nhận', BAD, function (l, r, log) { trap(l, 'rua_tien'); log('Tiền "sạch" để mua nhà.', 'neutral'); }]]);
  TR('rua_tien', 0.1, function (l, r, log) { log('Bị bắt — toàn bộ tài sản liên quan bị tịch thu, kể cả tài sản người thân đứng tên.', 'bad'); l.money = Math.min(l.money, 0); if (l.ownHouse) { l.ownHouse = false; l.houseVal = 0; l.loans = (l.loans || []).filter(function (x) { return x.type !== 'home'; }); l.mortgage = 0; } l.port = {}; l.coins = {}; arrest(l, 'rửa tiền', 3); });
  J('pp_dieu_tra_vien_gia', ['lua_dao', 'nha_cai'], 0, 9, 0.08, 3, 'Đối tác quá hào phóng', 'Một "đối tác" mới rất hào phóng, muốn gặp trực tiếp ông trùm.', [
    ['canh_giac', 'Cảnh giác, cắt liên lạc', { smart: 1 }, function (l, r, log) { log('Cắt liên lạc.', 'neutral'); }],
    ['gap', 'Gặp', { risk: 1 }, function (l, r, log) { if (ch(r, 0.5)) { log('"Đối tác" là trinh sát — cả đường dây bị triệt phá.', 'bad'); arrest(l, (E.jobDef(l).crime || [])[3] || 'hoạt động phi pháp', 3); } }]]);
  J('pp_hoan_luong', 'crime', 0, 9, 0.1, 3, 'Lời mẹ dặn', '"Mẹ chỉ mong con làm ăn lương thiện." — mẹ nói trong lúc ốm nặng.', [
    ['dau_thu', 'Bỏ nghề, ra đầu thú', { w: 1 }, function (l, r, log) { fx(l, { karma: 15 }); if ((l.heat || 0) >= 50) { log('Ra đầu thú, thành khẩn khai báo — được hưởng khoan hồng.', 'big'); arrest(l, (E.jobDef(l).crime || [])[3] || 'hoạt động phi pháp', 1); } else fire(l, log, 'Bỏ nghề, đi làm thuê, bắt đầu lại từ đầu.'); heat(l, -50); H.mem(l, 'Ngày quyết định quay đầu vì lời mẹ.', 6); }],
    ['lam_thue', 'Bỏ nghề, đi làm thuê', { w: 1 }, function (l, r, log) { heat(l, -20); fire(l, log, 'Bỏ nghề, đi làm thuê lương ba cọc ba đồng nhưng ngủ yên giấc.'); fx(l, { karma: 8 }); }],
    ['hua', 'Hứa rồi vẫn làm', BAD, function (l, r, log) { fx(l, { hap: -10 }); }]], function (l) { return l.fam && (l.fam.mAlive); });
  J('scam_kh_giai_cuu', ['scam_kh'], 0, 9, 0.15, 1, 'Mượn được điện thoại', 'Một người trong trại lén cho mượn điện thoại vài phút.', [
    ['nhan_tin', 'Nhắn vị trí cho gia đình, đại sứ quán', { w: 1.3 }, function (l, r, log) { if (ch(r, 0.5)) H.chain(l, 'kh_song'); else log('Tin nhắn đã gửi đi, chờ ngày giải cứu.', 'neutral'); }],
    ['chua', 'Chưa dám', MID, function (l, r, log) { fx(l, { hap: -10 }); }]], function (l) { return !!E.DEC.kh_song; });
  J('trom_nha_nguoi_ngheo', ['trom'], 0, 9, 0.1, 2, 'Căn nhà của cụ già', 'Trong căn nhà vừa vào toàn đồ của một cụ già sống một mình, có ảnh con cháu đã mất.', [
    ['bo_di', 'Bỏ đi tay không', { w: 1 }, function (l, r, log) { fx(l, { karma: 5 }); log('Bỏ đi tay không. Đêm đó bạn nghĩ đến chuyện bỏ nghề.', 'neutral'); if (ch(r, 0.2)) l.flags.upgradeJob = true; }],
    ['lay', 'Lấy hết', BAD, function (l, r, log) { cB(l, 0.02, 'Đồ ăn trộm'); fx(l, { karma: -8 }); }]]);

  // ===================================================================
  // SỰ KIỆN CHUNG NHIỀU NGHỀ
  // ===================================================================
  J('cn_mang_xa_hoi_toxic', '*', 0, 9, 0.1, 2, 'Bị bịa chuyện đời tư', 'Bạn bị bịa chuyện đời tư, bài viết lan khắp các hội nhóm anti.', [
    ['im', 'Im lặng', { w: 1 }, function (l, r, log) { if (ch(r, 0.6)) log('Im lặng, vài tuần sau mọi chuyện tự lắng.', 'neutral'); else fame(l, -2); }],
    ['kien', 'Kiện tác giả', { smart: 1 }, function (l, r, log) { cB(l, -0.1, 'Phí kiện'); if (ch(r, 0.5)) log('Thắng kiện, tác giả phải xin lỗi công khai.', 'good'); }],
    ['phan_phao', 'Phản pháo', { risk: 1 }, function (l, r, log) { if (ch(r, 0.5)) fame(l, 2); else phot(l); }]], function (l) { return (l.fame || 0) >= 2e4; });
  J('cn_cuu_sep', '*', 0, 9, 0.03, 10, 'Sơ cứu sếp', 'Sếp lớn ngất ngay giữa cuộc họp, bạn là người biết sơ cứu.', [
    ['so_cuu', 'Sơ cứu ngay, gọi cấp cứu', { w: 1 }, function (l, r, log) { fx(l, { soc: 5 }); rep(l, 10); if (ch(r, 0.5) && !/^chủ /.test((E.jobDef(l).t[l.job.rank + 1]) || 'chủ ') && promote(l)) log('Sơ cứu kịp thời cứu sống sếp. Ít lâu sau bạn được thăng chức: ' + E.jobTitle(l) + '.', 'big'); else log('Sơ cứu kịp thời, cả công ty biết tên bạn.', 'good'); }]], function (l) { return H.isEmployee(l); });
  J('cn_chuyen_nghe_tuoi_40', '*', 0, 9, 0.08, 5, 'Chán nghề tuổi 40', 'Chán nghề, có cơ hội học lại một nghề khác hoàn toàn.', [
    ['lam_lai', 'Bỏ hết, làm lại từ đầu', { risk: 0.8, amb: 1 }, function (l, r, log) { cB(l, -0.3, 'Học nghề mới'); fx(l, { hap: 8 }); l.flags.upgradeJob = true; log('Quyết định làm lại từ đầu với nghề mới.', 'big'); }],
    ['o_lai', 'Ở lại nghề cũ', MID, function (l, r, log) { log('Ở lại với nghề cũ.', 'neutral'); }]], function (l, a) { return a >= 38 && a <= 45; });
  J('cn_dong_nghiep_ung_thu', '*', 0, 9, 0.02, 8, 'Đồng nghiệp lâm bệnh', 'Đồng nghiệp thân thiết bị ung thư, cả phòng quyên góp.', [
    ['gop_nhieu', 'Góp nhiều, thay ca giúp', { w: 1.2 }, function (l, r, log) { cB(l, -0.05, 'Quyên góp'); fx(l, { karma: 5, hea: -2 }); log('Góp tiền, thay ca giúp suốt mấy tháng.', 'good'); }],
    ['tuong_trung', 'Góp tượng trưng', MID, function (l, r, log) { cB(l, -0.01, 'Quyên góp'); }]]);
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
