/* Một Đời — v2.5: nghề mới & hướng đi logic giữa các nghề, sự kiện riêng theo từng nghề
   (thám tử, công an theo ngành, luật sư, thẩm phán, bác sĩ, giáo viên, chủ quán, tiệm điện thoại, cầm đồ, xây dựng, nhà báo, môi giới, ngân hàng),
   và ~1% sinh ra trong gia đình tài phiệt / chủ ngân hàng / chính trị — giàu có nhưng phải theo khuôn phép, từ chối sắp xếp thì bị cắt chu cấp. */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function T(id, when, p, cd) { E.TRIG.push({ id: id, when: when, p: p, cd: cd || 0 }); }
  function EV(c, p, run) { E.EVENTS.push({ c: c, p: p, run: run }); }
  function fx(l, o) { H.fx(l, o); }
  function cashB(l, x, why) { H.cash(l, x * l.base, why); }
  function mb(l, x) { return H.mb(l, x); }
  function mo(l, v) { return H.money(l, v); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped); }
  function jid(l) { return l.job ? E.resolveJob(l.job.id) : null; }
  function hasJob(l, ids) { return !!(l.job && ids.indexOf(jid(l)) >= 0); }
  function rank(l) { return l.job ? l.job.rank || 0 : 0; }
  function yr(l) { return l.birthYear + l.age; }
  function rep(l, d) { if (l.job) l.job.rep = U.clamp((l.job.rep || 50) + d, 0, 100); } // uy tín trong nghề: ảnh hưởng thăng tiến
  function cash(l) { return Math.max(0, l.money); }

  // ===================================================================
  // 1. NGHỀ MỚI (cùng cấu trúc với careers.js)
  // ===================================================================
  function addJob(id, t, vn, yrs, o) {
    E.CAR[id] = { id: id, t: t, vn: vn, yrs: yrs, cat: o.cat || 'other', sec: o.sec || 'inf', edu: o.edu || 0, major: o.major, majors: o.majors, soft: o.soft,
      talent: o.talent, sex: o.sex, haz: o.haz, crime: o.crime, fame: o.fame, sigma: o.sigma || 0.12, fail: o.fail || 0, hidden: o.hidden, w: o.w || 1,
      rural: o.rural, coast: o.coast, vnOnly: o.vn, ladder: o.ladder, skillRank: o.skillRank, maxAge: o.maxAge, prod: o.prod, promo: o.promo, loss: o.loss, tag: o.tag, owner: o.owner };
  }
  addJob('chu_quan_an', ['phụ quán', 'chủ quán ăn', 'chủ chuỗi quán ăn'], [6, 18, 60], [3, 6], { cat: 'biz', sec: 'inf', edu: 1, sigma: 0.45, fail: 0.03, w: 0.6, prod: ['quán phở', 'quán cơm tấm', 'quán bún bò', 'quán lẩu', 'quán nướng', 'quán bánh mì'] });
  addJob('chu_nha_hang', ['quản lý nhà hàng', 'chủ nhà hàng', 'chủ chuỗi nhà hàng'], [15, 45, 150], [4, 6], { cat: 'biz', sec: 'inf', edu: 2, sigma: 0.5, fail: 0.04, w: 0.25, prod: ['nhà hàng hải sản', 'nhà hàng tiệc cưới', 'nhà hàng lẩu nướng', 'nhà hàng chay', 'nhà hàng Nhật'] });
  addJob('tiem_dt', ['nhân viên bán điện thoại', 'kỹ thuật viên sửa điện thoại', 'chủ tiệm điện thoại', 'chủ chuỗi cửa hàng điện thoại'], [7, 12, 30, 100], [2, 4, 6], { cat: 'biz', sec: 'inf', edu: 1, sigma: 0.4, w: 0.6 });
  addJob('tham_tu', ['cộng tác viên văn phòng thám tử', 'thám tử tư', 'chủ văn phòng thám tử'], [7, 14, 35], [3, 6], { cat: 'other', sec: 'inf', edu: 3, sigma: 0.5, w: 0.25, vn: 1 });
  addJob('cong_chung', ['thư ký nghiệp vụ công chứng', 'công chứng viên', 'trưởng văn phòng công chứng'], [9, 30, 70], [3, 6], { cat: 'office', sec: 'formal', edu: 5, major: 'law', w: 0.4 });
  addJob('phong_kham', ['chủ phòng khám tư', 'chủ chuỗi phòng khám'], [60, 200], [6], { cat: 'med', sec: 'inf', edu: 5, major: 'med', hidden: 1, sigma: 0.4, fail: 0.02 });
  addJob('chu_dau_tu', ['chủ đầu tư dự án nhỏ', 'chủ đầu tư bất động sản', 'chủ tịch tập đoàn bất động sản'], [40, 200, 1500], [4, 8], { cat: 'biz', sec: 'inf', edu: 2, hidden: 1, sigma: 0.9, fail: 0.07, owner: 1 });
  // --- dành cho gia đình siêu giàu (ẩn, chỉ vào được qua gia đình hoặc đi lên từ dưới) ---
  addJob('tai_phiet', ['thành viên ban điều hành tập đoàn', 'phó tổng giám đốc tập đoàn', 'tổng giám đốc tập đoàn', 'chủ tịch tập đoàn'], [200, 800, 3000, 20000], [3, 5, 6], { cat: 'biz', sec: 'inf', edu: 5, hidden: 1, sigma: 0.35, owner: 1, prod: ['tập đoàn bất động sản', 'tập đoàn bán lẻ', 'tập đoàn công nghiệp', 'tập đoàn hàng không', 'tập đoàn thép', 'tập đoàn thực phẩm'] });
  addJob('ngan_hang_cao', ['giám đốc khối ngân hàng', 'phó tổng giám đốc ngân hàng', 'tổng giám đốc ngân hàng', 'chủ tịch HĐQT ngân hàng'], [150, 350, 900, 2500], [3, 5, 6], { cat: 'office', sec: 'formal', edu: 5, major: 'eco', hidden: 1, sigma: 0.2, owner: 1 });
  addJob('chinh_tri', ['chuyên viên văn phòng tỉnh ủy', 'phó bí thư huyện ủy', 'bí thư huyện ủy', 'phó chủ tịch UBND tỉnh', 'chủ tịch UBND tỉnh', 'bí thư tỉnh ủy', 'ủy viên Trung ương Đảng'], [12, 18, 22, 30, 36, 42, 55], [3, 4, 5, 5, 5, 6], { cat: 'state', sec: 'formal', edu: 5, hidden: 1, vn: 1, promo: 0.12, loss: 0.002 });
  addJob('chinh_khach', ['trợ lý nghị sĩ', 'ủy viên hội đồng thành phố', 'thị trưởng', 'nghị sĩ quốc hội', 'bộ trưởng'], [12, 20, 35, 45, 60], [3, 5, 6, 6], { cat: 'state', sec: 'formal', edu: 5, hidden: 1, promo: 0.12, loss: 0.01 });
  E.PARENT_PAY['chủ tịch tập đoàn'] = 6000; E.PARENT_PAY['phó chủ tịch tập đoàn'] = 2500;
  E.PARENT_PAY['chủ tịch HĐQT ngân hàng'] = 2500; E.PARENT_PAY['tổng giám đốc ngân hàng'] = 900;
  E.PARENT_PAY['bí thư tỉnh ủy'] = 45; E.PARENT_PAY['phó chủ tịch UBND tỉnh'] = 32; E.PARENT_PAY['bộ trưởng'] = 60; E.PARENT_PAY['nghị sĩ quốc hội'] = 45;

  // công an theo ngành
  var POLICE_BR = { gt: 'Cảnh sát giao thông', hs: 'Cảnh sát hình sự', mt: 'Cảnh sát điều tra tội phạm ma túy', kt: 'Cảnh sát kinh tế', cd: 'Cảnh sát cơ động', kv: 'Công an khu vực' };
  E.POLICE_BR = POLICE_BR;
  function policeBr(l, r) {
    if (!hasJob(l, ['cong_an'])) return null;
    if (!l.job.br) l.job.br = U.wkey(r || H.rf(l), 'gt:0.25,hs:0.2,mt:0.12,kt:0.13,cd:0.1,kv:0.2');
    return l.job.br;
  }

  // ===================================================================
  // 2. HƯỚNG ĐI LOGIC GIỮA CÁC NGHỀ: làm lâu, có vốn → mở riêng / chuyển ngành gần
  // [nghề đích, bậc vào, vốn (× thu nhập cơ sở), điều kiện bậc tối thiểu, lời mời]
  // ===================================================================
  var PATHS = {
    phuc_vu: [['chu_quan_an', 1, 0.8, 1, 'Làm quản lý quán bao năm, bạn đã thuộc lòng nghề. Hay là ra mở quán ăn của riêng mình?']],
    dau_bep: [['chu_quan_an', 1, 0.8, 1, 'Tay nghề bếp đã vững. Mở một quán ăn nhỏ của riêng mình?'], ['chu_nha_hang', 1, 3, 2, 'Làm bếp trưởng nhiều năm, có người rủ góp vốn mở nhà hàng, bạn đứng bếp và làm chủ.']],
    chu_quan_an: [['chu_nha_hang', 1, 3, 1, 'Quán ăn đông khách quanh năm. Nâng lên thành nhà hàng khang trang?']],
    barista: [['kd_quan', 0, 0.8, 1, 'Pha chế lâu năm, khách quen nhiều. Mở quán cà phê của riêng mình?']],
    tiem_dt: [['tiem_dt', 2, 1, 1, 'Sửa điện thoại giỏi, khách tìm đến tận nơi. Thuê mặt bằng mở tiệm riêng?']],
    tho_sua_xe: [['tho_sua_xe', 2, 0.5, 1, 'Tay nghề đã vững. Thuê mặt bằng mở tiệm sửa xe riêng?']],
    cam_do: [['cam_do', 1, 1.5, 0, 'Làm ở tiệm cầm đồ lâu, bạn hiểu hết cái nghề. Tự mở một tiệm?']],
    tiem_vang: [['tiem_vang', 1, 4, 0, 'Đã rành nghề kim hoàn và có mối quen. Mở tiệm vàng riêng?']],
    cong_an: [['tham_tu', 1, 0.3, 3, 'Một văn phòng thám tử tư mời bạn về với mức thu nhập gấp mấy lần lương ngành, nhờ kinh nghiệm điều tra.']],
    tham_phan: [['luat_su', 2, 0.2, 2, 'Một hãng luật lớn mời bạn rời tòa án về làm luật sư thành viên.']],
    kiem_sat: [['luat_su', 2, 0.2, 2, 'Một hãng luật lớn mời bạn rời viện kiểm sát về làm luật sư thành viên.']],
    luat_su: [['cong_chung', 1, 0.5, 1, 'Có thể chuyển sang làm công chứng viên — đều đặn, ít căng thẳng hơn.']],
    bac_si: [['phong_kham', 0, 3, 2, 'Có tiếng trong nghề, bệnh nhân tìm đến tận nhà. Mở phòng khám tư?']],
    nha_si: [['nha_si', 2, 2, 1, 'Mở phòng khám nha khoa của riêng mình?']],
    giao_vien: [['gia_su', 1, 0.5, 1, 'Nhiều phụ huynh xin gửi con học thêm. Mở trung tâm dạy thêm?']],
    ky_su_xd: [['phu_ho', 3, 1, 1, 'Quen biết nhiều chủ đầu tư. Ra lập đội thầu xây dựng riêng?']],
    sale_bds: [['chu_dau_tu', 0, 5, 1, 'Có vốn và có mối, bạn tính tự gom đất làm chủ đầu tư dự án nhỏ.']],
    ngan_hang: [['ngan_hang_cao', 0, 0, 3, 'Ngân hàng đề bạt bạn lên cấp điều hành khối.']],
    dev: [['kd_tu_do', 1, 1, 2, 'Mấy đồng nghiệp rủ ra làm startup công nghệ, bạn làm giám đốc kỹ thuật kiêm cổ đông.']],
    shipper: [['kd_online', 0, 0.2, 0, 'Giao hàng lâu, bạn hiểu dân mua online thích gì. Tự mở shop online?']],
    tx_cn: [['tai_xe_tai', 1, 0.1, 0, 'Có người giới thiệu chỗ lái xe tải đường dài, thu nhập khá hơn.']],
    kd_tu_do: [['chu_dau_tu', 0, 8, 2, 'Công ty làm ăn tốt, bạn tính lấn sân đầu tư bất động sản.']]
  };
  function pathFor(l) {
    var ps = PATHS[jid(l)]; if (!ps) return null;
    return ps.filter(function (p) { return rank(l) >= p[3] && !(p[0] === jid(l) && rank(l) >= p[1]); })[0] || null;
  }
  SC('chuyen_huong', {
    title: 'Ngã rẽ sự nghiệp', prep: function (l) { var p = pathFor(l); return p ? { to: p[0], rk: p[1], cost: p[2], t: p[4] } : null; },
    valid: function (l) { return !!(l.job && pathFor(l)); },
    text: function (l, d) { return d.t + (d.cost ? ' Cần khoảng ' + mb(l, d.cost) + ' vốn ban đầu, hiện bạn có ' + mo(l, l.money) + '.' : ''); },
    opts: [
      { k: 'go', l: function (l, d) { return 'Chuyển sang làm ' + E.CAR[d.to].t[Math.min(d.rk, E.CAR[d.to].t.length - 1)]; }, req: function (l, d) { return cash(l) >= d.cost * l.base * 0.6; }, ai: { w: 1, amb: 1, risk: 0.5 },
        run: function (l, r, log, d) {
          var from = E.jobTitle(l);
          if (d.cost) cashB(l, -d.cost, 'Vốn chuyển hướng sự nghiệp');
          if (d.to === jid(l)) { l.job.rank = d.rk; l.job.yrs = 0; }
          else { E.startJob(l, d.to, r, log, true); l.job.rank = Math.min(d.rk, E.CAR[d.to].t.length - 1); }
          log('Rời vị trí ' + from + ', chuyển sang làm ' + E.jobTitle(l) + '.', 'big'); fx(l, { hap: 5 });
          H.mem(l, 'Ngày quyết định rẽ hướng: từ ' + from + ' thành ' + E.jobTitle(l) + '.', 4);
        } },
      { k: 'stay', l: 'Thôi, cứ làm việc đang làm', ai: { w: 1.2 }, run: function (l, r, log) { log('Quyết định gắn bó với công việc hiện tại.', 'neutral'); } }
    ]
  });
  T('chuyen_huong', function (l, a) { return l.job && l.job.yrs >= 3 && a >= 24 && a <= 58 && !!pathFor(l) && free(l); }, 0.08, 6);

  // ===================================================================
  // 3. SỰ KIỆN RIÊNG THEO NGHỀ
  // ===================================================================
  // ---- Thám tử tư: ở Việt Nam phần lớn là vụ theo dõi ngoại tình, thù lao vài chục triệu một vụ ----
  var TT_CASES = [
    { w: 6, t: 'Một bà chủ chuỗi spa nghi chồng ngoại tình, muốn có ảnh và địa chỉ "nhà nhỏ".', fee: 0.4 },
    { w: 3, t: 'Một ông giám đốc muốn biết vợ trẻ đi đâu mỗi tối thứ Năm.', fee: 0.5 },
    { w: 2, t: 'Một doanh nghiệp thuê xác minh đối tác sắp ký hợp đồng chục tỷ có phải "công ty ma".', fee: 0.6 },
    { w: 1.5, t: 'Gia đình nhờ tìm cô con gái bỏ nhà đi theo người yêu quen trên mạng.', fee: 0.25 },
    { w: 1, t: 'Một người mẹ nghi con trai mới lớn dính vào đường dây cá độ.', fee: 0.2 },
    { w: 0.4, t: 'Gia đình nạn nhân không tin kết luận "tự tử", nhờ âm thầm tìm hiểu thêm.', fee: 0.8 }
  ];
  SC('tt_vu', {
    title: 'Vụ việc mới', prep: function (l, r) { var c = U.wpick(r, TT_CASES, function (x) { return x.w; }); return { t: c.t, fee: c.fee * (1 + rank(l) * 0.4) }; },
    valid: function (l) { return hasJob(l, ['tham_tu']); },
    text: function (l, d) { return d.t + ' Thù lao khoảng ' + mb(l, d.fee) + ' nếu xong việc.'; },
    opts: [
      { k: 'careful', l: 'Theo dõi kiên nhẫn, đúng luật', h: 'Chậm, an toàn', ai: { w: 1.4, smart: 1 }, run: function (l, r, log, d) {
        var p = U.clamp(0.45 + (l.st.kno - 50) / 150 + rank(l) * 0.08 + ((l.job.rep || 50) - 50) / 200, 0.2, 0.9);
        if (ch(r, p)) { cashB(l, d.fee, 'Thù lao vụ thám tử'); rep(l, 5); log(ch(r, 0.3) ? 'Hoàn thành xuất sắc: đủ hình ảnh, giờ giấc, địa chỉ. Khách hàng thưởng thêm và giới thiệu bạn bè.' : 'Xong vụ việc, giao đủ bằng chứng cho khách hàng.', 'good'); if (ch(r, 0.3)) cashB(l, d.fee * 0.5, 'Thưởng thêm từ khách'); fx(l, { hap: 4 }); }
        else { rep(l, -4); log('Bám theo cả tháng vẫn không có kết quả. Khách hàng chỉ trả phí cơ bản.', 'neutral'); cashB(l, d.fee * 0.2, 'Phí cơ bản vụ thám tử'); }
      } },
      { k: 'gps', l: 'Lén gắn định vị, cài phần mềm theo dõi', h: 'Nhanh nhưng phạm luật', ai: { risk: 1, bad: 0.8 }, run: function (l, r, log, d) {
        fx(l, { karma: -4 });
        if (ch(r, 0.2)) { log('Đối tượng phát hiện thiết bị định vị, báo công an. Bạn bị phạt nặng vì xâm phạm bí mật đời tư.', 'bad'); cashB(l, -0.3, 'Phạt xâm phạm đời tư'); rep(l, -15); if (ch(r, 0.25)) H.sched(l, 'bi_bat', 0, { why: 'xâm phạm bí mật đời tư', sev: 1 }); }
        else { cashB(l, d.fee, 'Thù lao vụ thám tử'); rep(l, 2); log('Có bằng chứng chỉ sau một tuần. Khách hài lòng — miễn là không ai biết bạn làm cách nào.', 'neutral'); }
      } },
      { k: 'caught', l: 'Bám sát tận nơi để chụp cho rõ', h: 'Ảnh đẹp, dễ bị lộ', ai: { risk: 1.2 }, run: function (l, r, log, d) {
        if (ch(r, 0.3)) { log('Bị phát hiện khi đang chụp ảnh. Đối tượng gọi người đến đánh, đập vỡ máy ảnh.', 'bad'); fx(l, { hea: -10, hap: -5 }); cashB(l, -0.1, 'Máy ảnh bị đập vỡ'); rep(l, -6); }
        else { cashB(l, d.fee * 1.3, 'Thù lao vụ thám tử'); rep(l, 6); log('Ảnh rõ từng khuôn mặt. Khách hàng trả thêm vì bằng chứng "không thể chối cãi".', 'good'); }
      } },
      { k: 'no', l: 'Từ chối vụ này', ai: { w: 0.4 }, run: function (l, r, log) { log('Từ chối vụ việc — có những chuyện không nên dính vào.', 'neutral'); } }
    ]
  });
  T('tt_vu', function (l) { return hasJob(l, ['tham_tu']) && free(l); }, 0.55, 1);

  // ---- Công an theo ngành ----
  var CA_CASES = {
    gt: [{ t: 'Đang làm nhiệm vụ ở chốt, bạn dừng một chiếc xe sang chạy ẩu. Tài xế nồng nặc mùi rượu, rút điện thoại: "Anh biết tôi là ai không?"', danger: 0, bribe: 0.15 },
      { t: 'Ca trực đêm, một nhóm thanh niên đua xe lạng lách, lao thẳng vào chốt khi bị yêu cầu dừng.', danger: 0.04, bribe: 0 },
      { t: 'Một người quen của sếp vi phạm nồng độ cồn, gọi điện "nhờ anh em linh động".', danger: 0, bribe: 0.05 }],
    hs: [{ t: 'Chuyên án truy bắt nghi phạm giết người đang lẩn trốn trong một khu trọ.', danger: 0.05, bribe: 0 },
      { t: 'Băng cướp giật dùng hung khí hoạt động liên tỉnh, cả đội phải phục kích nhiều đêm liền.', danger: 0.04, bribe: 0 },
      { t: 'Gia đình nghi phạm một vụ cố ý gây thương tích tìm đến, đặt phong bì lên bàn xin "nhẹ tay".', danger: 0, bribe: 0.4 }],
    mt: [{ t: 'Chuyên án triệt phá đường dây ma túy xuyên biên giới, đối tượng có súng và sẵn sàng chống trả.', danger: 0.08, bribe: 0 },
      { t: 'Một trùm ma túy cho người nhắn: chỉ cần bạn "nhắm mắt" một đêm, tiền sẽ có ngay.', danger: 0.02, bribe: 2 }],
    kt: [{ t: 'Chuyên án đường dây lừa đảo việc nhẹ lương cao đưa người sang Campuchia. Cần phối hợp giải cứu nạn nhân.', danger: 0.02, bribe: 0 },
      { t: 'Doanh nghiệp làm hàng giả cỡ lớn bị phát hiện, chủ doanh nghiệp đề nghị "lo" cho cả đội.', danger: 0, bribe: 1 },
      { t: 'Đường dây lừa đảo đầu tư tiền ảo chiếm đoạt hàng trăm tỷ của người dân.', danger: 0, bribe: 0 }],
    cd: [{ t: 'Được điều động giữ an ninh trận chung kết bóng đá, cổ động viên quá khích đốt pháo sáng.', danger: 0.01, bribe: 0 },
      { t: 'Tham gia cứu hộ người dân trong trận lũ lịch sử.', danger: 0.03, bribe: 0 }],
    kv: [{ t: 'Hai nhà hàng xóm trong khu vực xô xát vì tranh chấp lối đi, gọi bạn đến giải quyết.', danger: 0.005, bribe: 0 },
      { t: 'Phát hiện một ổ nhóm cho vay nặng lãi đang hoạt động trong khu dân cư.', danger: 0.02, bribe: 0.3 }]
  };
  SC('ca_chuyen_an', {
    title: function (l) { return (POLICE_BR[policeBr(l)] || 'Công an') + ' · nhiệm vụ mới'; },
    prep: function (l, r) { var b = policeBr(l, r); if (!b) return null; var c = pick(r, CA_CASES[b]); return { b: b, t: c.t, danger: c.danger, bribe: c.bribe }; },
    valid: function (l) { return hasJob(l, ['cong_an']) && isVN(l); },
    text: function (l, d) { return d.t; },
    opts: [
      { k: 'law', l: 'Làm đúng quy trình, đúng pháp luật', ai: { w: 1.5 }, run: function (l, r, log, d) {
        if (d.danger && ch(r, d.danger * 0.5)) { H.kill(l, 'hy sinh khi làm nhiệm vụ', log, true); return; }
        rep(l, 6); fx(l, { karma: 3, hap: 3 });
        log(d.b === 'gt' ? 'Lập biên bản, tạm giữ phương tiện đúng quy định. Clip người vi phạm "dọa" bạn lan truyền, dân mạng khen bạn cứng rắn.' : d.bribe ? 'Từ chối phong bì, làm hồ sơ đúng quy định.' : 'Phối hợp đồng đội hoàn thành nhiệm vụ, được đơn vị biểu dương.', 'good');
        if (ch(r, 0.25)) { log('Được tặng bằng khen vì thành tích xuất sắc trong chuyên án.', 'good'); H.mem(l, 'Ngày nhận bằng khen trước toàn đơn vị.', 3); }
      } },
      { k: 'brave', l: 'Xông lên đi đầu', req: function (l, d) { return d.danger > 0; }, h: 'Lập công lớn, nguy hiểm tính mạng', ai: { risk: 1.2, w: 0.6 }, run: function (l, r, log, d) {
        if (ch(r, d.danger * 1.5)) { H.kill(l, 'hy sinh khi làm nhiệm vụ', log, true); return; }
        if (ch(r, 0.3)) { log('Bị đối tượng chống trả, bị thương nặng phải nằm viện nhiều tuần.', 'bad'); fx(l, { hea: -15 }); }
        rep(l, 12); log('Trực tiếp khống chế đối tượng, phá thành công chuyên án. Được đề nghị tặng Huân chương Chiến công.', 'big'); fx(l, { hap: 8, karma: 4 });
        if (l.job.rank < E.CAR.cong_an.t.length - 1 && ch(r, 0.4) && l.job.yrs >= 1) { l.job.rank++; l.job.yrs = 0; log('Được thăng quân hàm vượt cấp lên ' + E.CAR.cong_an.t[l.job.rank] + ' nhờ thành tích.', 'big'); }
        H.mem(l, 'Chuyên án năm ' + yr(l) + ' — lần bạn đi đầu đối mặt với tội phạm.', 6);
        if (d.b === 'mt' || d.b === 'hs') l.flags.revenge = (l.flags.revenge || 0) + 1;
      } },
      { k: 'bribe', l: 'Nhận tiền, cho qua', req: function (l, d) { return d.bribe > 0; }, h: function (l, d) { return '~' + mb(l, d.bribe) + ' · có thể bị phát hiện, đi tù'; }, ai: { bad: 1.5, w: 0.5 }, run: function (l, r, log, d) {
        cashB(l, d.bribe, 'Tiền "bôi trơn"'); fx(l, { karma: -12 }); l.flags.dirty = (l.flags.dirty || 0) + 1;
        log('Nhận tiền và cho qua. Đêm đó bạn trằn trọc mãi.', 'bad');
        if (ch(r, 0.15 + d.bribe * 0.08)) { log('Camera và tin nhắn bị thanh tra thu thập. Bạn bị đình chỉ công tác, khởi tố tội nhận hối lộ.', 'bad'); l.job = null; l.flags.needJob = true; H.sched(l, 'bi_bat', 0, { why: 'nhận hối lộ', sev: 2 }); }
      } },
      { k: 'pass', l: 'Báo cáo cấp trên, chờ chỉ đạo', ai: { w: 0.8 }, run: function (l, r, log) { rep(l, 1); log('Báo cáo lên trên, làm theo chỉ đạo. An toàn, nhưng không ai nhớ tên bạn.', 'neutral'); } }
    ]
  });
  T('ca_chuyen_an', function (l) { return hasJob(l, ['cong_an']) && isVN(l) && free(l); }, 0.35, 1);
  // bị trả thù sau những chuyên án lớn
  SC('ca_tra_thu', {
    title: 'Lời đe dọa', valid: function (l) { return hasJob(l, ['cong_an']) && (l.flags.revenge || 0) > 0; },
    text: 'Đàn em của tên trùm bị bạn bắt cho người theo dõi nhà bạn, nhắn tin: "Mày có vợ con mà."',
    opts: [
      { k: 'guard', l: 'Báo đơn vị, bố trí bảo vệ gia đình', ai: { w: 1.4 }, run: function (l, r, log) { l.flags.revenge = 0; if (ch(r, 0.04)) { H.kill(l, 'bị tội phạm trả thù', log, true); return; } log('Đơn vị bố trí lực lượng bảo vệ, bắt được kẻ theo dõi.', 'good'); fx(l, { hap: -3 }); } },
      { k: 'move', l: 'Xin chuyển công tác sang địa bàn khác', ai: { w: 0.8 }, run: function (l, r, log) { l.flags.revenge = 0; l.job.br = 'kv'; log('Chuyển công tác về làm công an khu vực ở địa bàn khác, cả nhà dọn đi.', 'neutral'); fx(l, { hap: -4 }); } },
      { k: 'ignore', l: 'Mặc kệ, không sợ', ai: { risk: 1.3 }, run: function (l, r, log) { if (ch(r, 0.12)) { H.kill(l, 'bị tội phạm trả thù', log, true); return; } log('Không có chuyện gì xảy ra… lần này.', 'neutral'); fx(l, { hap: -2 }); } }
    ]
  });
  T('ca_tra_thu', function (l) { return hasJob(l, ['cong_an']) && (l.flags.revenge || 0) > 0 && free(l); }, 0.25);

  // ---- Luật sư ----
  SC('ls_vu_an', {
    title: 'Hồ sơ vụ án mới', prep: function (l, r) { return pick(r, [
      { t: 'Một đại gia nhờ bạn đại diện trong vụ ly hôn tranh chấp tài sản hàng trăm tỷ.', fee: 1, kind: 'civ' },
      { t: 'Một doanh nghiệp bị kiện vi phạm hợp đồng, cần luật sư tranh tụng.', fee: 0.6, kind: 'civ' },
      { t: 'Một thiếu niên nghèo bị cáo buộc cướp tài sản, gia đình không có tiền thuê luật sư.', fee: 0, kind: 'free' },
      { t: 'Con trai một ông chủ lớn gây tai nạn chết người, gia đình muốn "bằng mọi giá" được hưởng án treo.', fee: 1.5, kind: 'dirty' }
    ]); },
    valid: function (l) { return hasJob(l, ['luat_su']) && l.job.rank >= 1; },
    text: function (l, d) { return d.t + (d.fee ? ' Thù lao khoảng ' + mb(l, d.fee * (1 + rank(l) * 0.3)) + '.' : ' Trợ giúp pháp lý miễn phí.'); },
    opts: [
      { k: 'fight', l: 'Nhận vụ, chuẩn bị hồ sơ thật kỹ', ai: { w: 1.4, smart: 1 }, run: function (l, r, log, d) {
        var p = U.clamp(0.4 + (l.st.kno - 50) / 120 + rank(l) * 0.07 + ((l.job.rep || 50) - 50) / 150, 0.15, 0.9);
        if (ch(r, p)) { cashB(l, d.fee * (1 + rank(l) * 0.3), 'Thù lao luật sư'); rep(l, 8); log(d.kind === 'free' ? 'Chứng minh được thân chủ bị oan, tòa tuyên vô tội. Mẹ cậu bé quỳ xuống cảm ơn bạn.' : 'Thắng kiện! Tên bạn bắt đầu được nhắc đến trong giới luật.', 'good'); fx(l, { hap: 6, karma: d.kind === 'free' ? 8 : 1 }); if (d.kind === 'free') H.mem(l, 'Phiên tòa minh oan cho cậu bé nghèo.', 5); }
        else { cashB(l, d.fee * 0.3, 'Phí luật sư'); rep(l, -4); log('Thua kiện. Thân chủ thất vọng, bạn mất mấy đêm xem lại hồ sơ.', 'bad'); fx(l, { hap: -4 }); }
      } },
      { k: 'fix', l: 'Nhận tiền "lo" cho thân chủ qua quen biết', req: function (l, d) { return d.kind === 'dirty'; }, h: 'Tiền lớn, có thể bị tước thẻ luật sư', ai: { bad: 1.4 }, run: function (l, r, log, d) {
        fx(l, { karma: -10 }); l.flags.dirty = (l.flags.dirty || 0) + 1;
        if (ch(r, 0.25)) { log('Đường dây "chạy án" bị phanh phui. Bạn bị tước thẻ luật sư và khởi tố tội môi giới hối lộ.', 'bad'); l.job = null; l.flags.needJob = true; H.sched(l, 'bi_bat', 0, { why: 'môi giới hối lộ', sev: 2 }); }
        else { cashB(l, d.fee * 3, 'Tiền "lo" vụ án'); log('Vụ án được "xử nhẹ". Tiền về túi, nhưng gia đình nạn nhân khóc ngất ngoài hành lang tòa.', 'bad'); }
      } },
      { k: 'no', l: 'Từ chối vụ này', ai: { w: 0.5 }, run: function (l, r, log) { log('Từ chối nhận vụ án.', 'neutral'); } }
    ]
  });
  T('ls_vu_an', function (l) { return hasJob(l, ['luat_su']) && l.job.rank >= 1 && free(l); }, 0.4, 1);

  // ---- Thẩm phán / kiểm sát viên: "chạy án" ----
  SC('tp_chay_an', {
    title: 'Phong bì trước phiên tòa', prep: function (l, r) { return { x: pick(r, [0.5, 1, 3]) * (1 + rank(l) * 0.5) }; },
    valid: function (l) { return hasJob(l, ['tham_phan', 'kiem_sat']) && l.job.rank >= 1; },
    text: function (l, d) { return 'Trước phiên xử một vụ án kinh tế, người nhà bị cáo tìm đến tận nhà, để lại túi quà ' + mb(l, d.x) + ' cùng lời nhắn "mong được xem xét".'; },
    opts: [
      { k: 'refuse', l: 'Trả lại, xử đúng pháp luật', ai: { w: 1.5 }, run: function (l, r, log) { rep(l, 6); fx(l, { karma: 8, hap: 2 }); log('Gửi trả túi quà, xét xử đúng người đúng tội.', 'good'); if (ch(r, 0.2)) H.mem(l, 'Lần từ chối túi tiền trước phiên tòa — lương tâm thanh thản.', 3); } },
      { k: 'report', l: 'Báo cáo lên cấp trên về hành vi đưa hối lộ', ai: { w: 0.8, smart: 1 }, run: function (l, r, log) { rep(l, 10); fx(l, { karma: 10 }); log('Báo cáo hành vi đưa hối lộ, người đưa bị xử lý. Bạn được đánh giá cao về liêm chính.', 'good'); } },
      { k: 'take', l: 'Nhận, "nương tay" một chút', ai: { bad: 1.6 }, run: function (l, r, log, d) {
        cashB(l, d.x, 'Tiền "chạy án"'); fx(l, { karma: -15 }); l.flags.dirty = (l.flags.dirty || 0) + 1;
        if (ch(r, 0.2)) { log('Bản án bị kháng nghị, thanh tra vào cuộc. Bạn bị khởi tố tội nhận hối lộ.', 'bad'); l.job = null; l.flags.needJob = true; H.sched(l, 'bi_bat', 0, { why: 'nhận hối lộ', sev: 3 }); }
        else log('Bản án "nhẹ nhàng" hơn đề nghị. Không ai biết vì sao.', 'bad');
      } }
    ]
  });
  T('tp_chay_an', function (l) { return hasJob(l, ['tham_phan', 'kiem_sat']) && l.job.rank >= 1 && free(l); }, 0.12, 2);

  // ---- Bác sĩ, điều dưỡng ----
  SC('bs_ca_kho', {
    title: 'Ca bệnh nguy kịch', valid: function (l) { return hasJob(l, ['bac_si', 'phong_kham']) && l.job.rank >= 1; },
    text: 'Nửa đêm, một bệnh nhân tai nạn được đưa vào trong tình trạng nguy kịch. Ca mổ rất khó, chuyển tuyến thì có thể không kịp.',
    opts: [
      { k: 'op', l: 'Trực tiếp mổ cấp cứu', ai: { w: 1.3, smart: 1 }, run: function (l, r, log) {
        var p = U.clamp(0.5 + (l.st.kno - 50) / 100 + rank(l) * 0.06, 0.25, 0.92);
        if (ch(r, p)) { rep(l, 10); fx(l, { hap: 8, karma: 4 }); log('Ca mổ kéo dài 7 tiếng — bệnh nhân qua cơn nguy kịch. Báo chí viết bài về "bác sĩ trực đêm".', 'big'); H.mem(l, 'Ca mổ cứu sống bệnh nhân nguy kịch, bước ra khỏi phòng mổ trời đã sáng.', 5); }
        else { rep(l, -5); fx(l, { hap: -10 }); log('Đã cố hết sức nhưng bệnh nhân không qua khỏi. Gia đình họ gào khóc ngoài hành lang.', 'bad'); if (ch(r, 0.3)) H.sched(l, 'bs_hanh_hung', 0); }
      } },
      { k: 'transfer', l: 'Sơ cứu và chuyển tuyến trên', ai: { w: 1 }, run: function (l, r, log) { log('Sơ cứu ổn định rồi chuyển lên tuyến trên. Không biết sau đó bệnh nhân ra sao.', 'neutral'); } }
    ]
  });
  T('bs_ca_kho', function (l) { return hasJob(l, ['bac_si', 'phong_kham']) && l.job.rank >= 1 && free(l); }, 0.2, 2);
  SC('bs_hanh_hung', {
    title: 'Người nhà bệnh nhân quá khích', valid: function (l) { return hasJob(l, ['bac_si', 'dieu_duong', 'phong_kham']); },
    text: 'Người nhà một bệnh nhân say rượu xông vào phòng trực, lớn tiếng đổ lỗi bạn chữa sai rồi lao vào định đánh.',
    opts: [
      { k: 'calm', l: 'Bình tĩnh giải thích, gọi bảo vệ', ai: { w: 1.4 }, run: function (l, r, log) { if (ch(r, 0.3)) { log('Bị đánh mấy cú trước khi bảo vệ kịp đến. Clip được đăng lên mạng, cả nước lên tiếng bảo vệ y bác sĩ.', 'bad'); fx(l, { hea: -6, hap: -6 }); } else log('Bảo vệ kịp can ngăn, người nhà sau đó xin lỗi.', 'neutral'); } },
      { k: 'sue', l: 'Báo công an xử lý đến cùng', ai: { w: 0.8 }, run: function (l, r, log) { log('Đối tượng bị khởi tố tội gây rối trật tự công cộng.', 'neutral'); fx(l, { hap: -2 }); } }
    ]
  });
  T('bs_hanh_hung', function (l) { return hasJob(l, ['bac_si', 'dieu_duong']) && free(l); }, 0.03, 4);

  // ---- Giáo viên ----
  SC('gv_phu_huynh', {
    title: 'Chuyện ở trường', prep: function (l, r) { return { k: pick(r, ['them', 'diem', 'ca_biet']) }; },
    valid: function (l) { return hasJob(l, ['giao_vien', 'gv_mam_non']); },
    text: function (l, d) { return d.k === 'them' ? 'Nhà trường cấm dạy thêm tràn lan, nhưng phụ huynh cả lớp xin bạn mở lớp học thêm buổi tối.' : d.k === 'diem' ? 'Một phụ huynh có chức có quyền gặp riêng, gợi ý "nâng điểm" để con đạt học sinh giỏi.' : 'Một học sinh cá biệt đánh bạn trong lớp, quay clip đăng mạng. Phụ huynh em đó lại bênh con.'; },
    opts: [
      { k: 'good', l: function (l, d) { return d.k === 'them' ? 'Mở lớp học thêm đúng quy định, thu vừa phải' : d.k === 'diem' ? 'Từ chối, chấm đúng năng lực' : 'Gặp riêng gia đình, kiên nhẫn giáo dục em'; }, ai: { w: 1.4 }, run: function (l, r, log, d) {
        if (d.k === 'them') { cashB(l, 0.25, 'Dạy thêm'); log('Mở lớp học thêm buổi tối, thu thêm được ít tiền trang trải.', 'good'); fx(l, { hea: -2 }); }
        else if (d.k === 'diem') { fx(l, { karma: 6 }); rep(l, 4); log('Từ chối khéo. Phụ huynh không vui, nhưng bạn ngủ ngon.', 'good'); }
        else { fx(l, { karma: 5, hap: -2 }); if (ch(r, 0.6)) { log('Sau nhiều buổi trò chuyện, em ấy thay đổi hẳn. Cuối năm em viết thư cảm ơn cô thầy.', 'good'); H.mem(l, 'Lá thư của cậu học trò cá biệt năm ấy.', 4); } else log('Em ấy vẫn chưa thay đổi, nhưng bạn không bỏ cuộc.', 'neutral'); }
      } },
      { k: 'bad', l: function (l, d) { return d.k === 'them' ? 'Ép cả lớp đi học thêm, ai không học thì "để ý"' : d.k === 'diem' ? 'Nâng điểm, nhận quà' : 'Xin chuyển em đó sang lớp khác'; }, ai: { bad: 1 }, run: function (l, r, log, d) {
        if (d.k === 'them') { cashB(l, 0.6, 'Dạy thêm'); fx(l, { karma: -6 }); if (ch(r, 0.25)) { log('Phụ huynh phản ánh lên báo chuyện ép học thêm. Bạn bị kỷ luật cảnh cáo.', 'bad'); rep(l, -15); fx(l, { hap: -8 }); } else log('Lớp học thêm đông nghịt, tiền vào đều.', 'neutral'); }
        else if (d.k === 'diem') { cashB(l, 0.15, 'Quà phụ huynh'); fx(l, { karma: -8 }); log('Nâng điểm cho em học sinh. Cả lớp xì xào.', 'bad'); }
        else { log('Em học sinh bị chuyển lớp. Vấn đề chỉ chuyển sang chỗ khác.', 'neutral'); }
      } }
    ]
  });
  T('gv_phu_huynh', function (l) { return hasJob(l, ['giao_vien']) && free(l); }, 0.15, 2);

  // ---- Chủ quán ăn / nhà hàng / quán cà phê ----
  SC('qa_su_co', {
    title: 'Chuyện ở quán', prep: function (l, r) { return { k: pick(r, ['ngo_doc', 'review', 'mat_bang', 'nhan_vien']), n: l.job.p || 'quán' }; },
    valid: function (l) { return hasJob(l, ['chu_quan_an', 'chu_nha_hang', 'kd_quan']) && (rank(l) >= 1 || jid(l) === 'kd_quan'); },
    text: function (l, d) { return { ngo_doc: 'Một bàn khách ăn ở ' + d.n + ' xong bị đau bụng, đăng bài tố quán làm ngộ độc. Đoàn kiểm tra an toàn thực phẩm sắp đến.', review: 'Một food reviewer hơn triệu người theo dõi ghé ' + d.n + ' quay clip. Món ăn hôm đó bếp làm hơi vội.', mat_bang: 'Chủ nhà báo tăng tiền thuê mặt bằng 40% từ tháng sau, không đồng ý thì trả mặt bằng.', nhan_vien: 'Bếp chính đòi tăng lương gấp rưỡi, không thì nghỉ ngay giữa mùa đông khách.' }[d.k]; },
    opts: [
      { k: 'a', l: function (l, d) { return { ngo_doc: 'Xin lỗi, đền bù, rà soát lại khâu nguyên liệu', review: 'Mời reviewer quay lại hôm khác, tự tay nấu', mat_bang: 'Chấp nhận giá mới, tăng giá món', nhan_vien: 'Tăng lương giữ người' }[d.k]; }, ai: { w: 1.3 }, run: function (l, r, log, d) {
        if (d.k === 'ngo_doc') { cashB(l, -0.15, 'Đền bù khách, rà soát bếp'); log('Đền bù cho khách, thay nhà cung cấp. Đoàn kiểm tra đạt, khách quen vẫn ủng hộ.', 'neutral'); }
        else if (d.k === 'review') { if (ch(r, 0.6)) { log('Clip khen hết lời — quán đông nghịt cả tháng, phải thuê thêm người.', 'big'); cashB(l, 0.5, 'Doanh thu tăng sau clip review'); l.job.yrs++; } else log('Clip chấm điểm "tạm được". Không đông thêm mà cũng không vắng đi.', 'neutral'); }
        else if (d.k === 'mat_bang') { cashB(l, -0.3, 'Tăng tiền thuê mặt bằng'); log('Chấp nhận giá thuê mới, tăng giá món. Vài khách quen phàn nàn.', 'neutral'); }
        else { cashB(l, -0.15, 'Tăng lương bếp chính'); log('Tăng lương giữ chân bếp chính, quán vẫn chạy đều.', 'neutral'); }
      } },
      { k: 'b', l: function (l, d) { return { ngo_doc: 'Chối, thuê người "dẹp" bài đăng', review: 'Gửi "phong bì" nhờ clip khen', mat_bang: 'Trả mặt bằng, tìm chỗ mới', nhan_vien: 'Cho nghỉ, tự đứng bếp' }[d.k]; }, ai: { risk: 1 }, run: function (l, r, log, d) {
        if (d.k === 'ngo_doc') { fx(l, { karma: -6 }); if (ch(r, 0.5)) { log('Bài đăng lan rộng hơn vì bị "dẹp". Đoàn kiểm tra phát hiện nguyên liệu không rõ nguồn gốc — quán bị phạt và đình chỉ 3 tháng.', 'bad'); cashB(l, -0.6, 'Phạt & đình chỉ kinh doanh'); fx(l, { hap: -10 }); } else log('Bài đăng chìm dần. Chuyện qua đi.', 'neutral'); }
        else if (d.k === 'review') { cashB(l, -0.1, 'Phong bì reviewer'); if (ch(r, 0.3)) { log('Dân mạng phát hiện clip "khen có tiền", quay ra tẩy chay quán.', 'bad'); cashB(l, -0.3, 'Doanh thu giảm'); } else log('Clip khen ngợi, quán đông hơn hẳn.', 'good'); }
        else if (d.k === 'mat_bang') { cashB(l, -0.4, 'Chuyển mặt bằng'); if (ch(r, 0.5)) log('Chỗ mới rộng hơn, khách cũ vẫn tìm đến.', 'good'); else { log('Chỗ mới vắng khách, mất nửa năm mới gây dựng lại.', 'bad'); fx(l, { hap: -6 }); } }
        else { fx(l, { hea: -5 }); log('Cho bếp chính nghỉ, tự mình đứng bếp từ sáng đến khuya.', 'neutral'); }
      } }
    ]
  });
  T('qa_su_co', function (l) { return hasJob(l, ['chu_quan_an', 'chu_nha_hang', 'kd_quan']) && free(l); }, 0.25, 1);

  // ---- Tiệm điện thoại ----
  SC('dt_may_gian', {
    title: 'Chiếc điện thoại giá rẻ', valid: function (l) { return hasJob(l, ['tiem_dt']); },
    text: 'Một thanh niên mang đến chiếc iPhone đời mới, không hộp, không hóa đơn, bán rẻ bằng một nửa giá thị trường: "Bán gấp anh ơi."',
    opts: [
      { k: 'no', l: 'Từ chối, đòi giấy tờ chứng minh', ai: { w: 1.4 }, run: function (l, r, log) { fx(l, { karma: 3 }); log('Từ chối mua máy không rõ nguồn gốc. Hai hôm sau công an đến hỏi về một vụ cướp điện thoại.', 'good'); } },
      { k: 'buy', l: 'Mua rẻ, bán lại kiếm lời', ai: { bad: 1, risk: 1 }, run: function (l, r, log) { fx(l, { karma: -6 }); if (ch(r, 0.3)) { log('Máy là tang vật một vụ cướp. Bạn bị xử lý tội tiêu thụ tài sản do người khác phạm tội mà có.', 'bad'); cashB(l, -0.2, 'Phạt tiêu thụ đồ gian'); if (ch(r, 0.3)) H.sched(l, 'bi_bat', 0, { why: 'tiêu thụ tài sản do người khác phạm tội mà có', sev: 1 }); } else { cashB(l, 0.08, 'Lời bán máy'); log('Bán lại lời gấp đôi.', 'neutral'); } } },
      { k: 'report', l: 'Giữ chân người bán, báo công an', ai: { w: 0.6, risk: 0.5 }, run: function (l, r, log) { if (ch(r, 0.2)) { log('Đối tượng bỏ chạy, sau đó quay lại đập kính tiệm.', 'bad'); cashB(l, -0.05, 'Sửa kính cửa tiệm'); } else { log('Công an bắt được đối tượng — hóa ra là cả một nhóm chuyên cướp giật.', 'good'); fx(l, { karma: 5 }); } } }
    ]
  });
  T('dt_may_gian', function (l) { return hasJob(l, ['tiem_dt']) && free(l); }, 0.15, 2);

  // ---- Cầm đồ ----
  SC('cd_xe_gian', {
    title: 'Khách cắm xe', valid: function (l) { return hasJob(l, ['cam_do']); },
    text: 'Một người mang xe SH đến cắm, không có giấy tờ, chỉ cần lấy nhanh tiền mặt. Bên cạnh đó một bà cụ xin cắm chiếc nhẫn cưới lấy tiền viện phí cho chồng.',
    opts: [
      { k: 'law', l: 'Từ chối xe không giấy tờ, cho bà cụ cầm với lãi thấp', ai: { w: 1.4 }, run: function (l, r, log) { fx(l, { karma: 6 }); log('Từ chối chiếc xe không rõ nguồn gốc. Bà cụ cảm ơn rối rít.', 'good'); } },
      { k: 'take', l: 'Nhận cả hai, lãi theo "giá thị trường"', ai: { bad: 1, risk: 1 }, run: function (l, r, log) { fx(l, { karma: -6 }); cashB(l, 0.1, 'Lãi cầm đồ'); if (ch(r, 0.3)) { log('Chiếc xe là tài sản trộm cắp. Công an thu hồi xe, bạn mất trắng tiền đã đưa và bị phạt.', 'bad'); cashB(l, -0.4, 'Mất tiền xe gian, bị phạt'); } else log('Hết hạn không ai chuộc xe, bạn thanh lý được một khoản.', 'neutral'); } }
    ]
  });
  T('cd_xe_gian', function (l) { return hasJob(l, ['cam_do']) && free(l); }, 0.15, 2);

  // ---- Xây dựng ----
  SC('xd_vat_lieu', {
    title: 'Công trình đang thi công', valid: function (l) { return hasJob(l, ['ky_su_xd']) || (hasJob(l, ['phu_ho']) && rank(l) >= 2); },
    text: 'Nhà cung cấp gợi ý thay thép đúng chuẩn bằng loại rẻ hơn, "chênh lệch anh em chia nhau, mắt thường không ai nhìn ra".',
    opts: [
      { k: 'no', l: 'Từ chối, làm đúng thiết kế', ai: { w: 1.5 }, run: function (l, r, log) { fx(l, { karma: 5 }); rep(l, 3); log('Làm đúng thiết kế. Công trình nghiệm thu đạt chuẩn.', 'good'); } },
      { k: 'yes', l: 'Đồng ý "rút ruột" một ít', ai: { bad: 1.4 }, run: function (l, r, log) {
        cashB(l, 0.5, 'Tiền chênh lệch vật liệu'); fx(l, { karma: -12 }); l.flags.dirty = (l.flags.dirty || 0) + 1;
        if (ch(r, 0.12)) { log('Một mảng tường công trình sập khi đang thi công, công nhân bị thương nặng. Bạn bị khởi tố.', 'bad'); H.mem(l, 'Ngày công trình đổ sập vì những cây thép không đủ chuẩn.', 6); H.sched(l, 'bi_bat', 0, { why: 'vi phạm quy định về xây dựng gây hậu quả nghiêm trọng', sev: 2 }); }
        else log('Công trình vẫn nghiệm thu. Bạn không dám đi ngang qua đó.', 'bad');
      } }
    ]
  });
  T('xd_vat_lieu', function (l) { return (hasJob(l, ['ky_su_xd']) || (hasJob(l, ['phu_ho']) && rank(l) >= 2)) && free(l); }, 0.1, 3);

  // ---- Nhà báo ----
  SC('pv_dieu_tra', {
    title: 'Loạt bài điều tra', valid: function (l) { return hasJob(l, ['phong_vien']); },
    text: 'Bạn thu thập được bằng chứng về một xưởng sản xuất thực phẩm bẩn cung cấp cho hàng trăm trường học. Chủ xưởng gọi điện "mời cà phê".',
    opts: [
      { k: 'publish', l: 'Đăng bài, theo đến cùng', ai: { w: 1.3 }, run: function (l, r, log) { rep(l, 10); fx(l, { karma: 8, hap: 4 }); if (ch(r, 0.15)) { log('Đăng bài xong bị nhóm côn đồ chặn đường hành hung.', 'bad'); fx(l, { hea: -10 }); } log('Loạt bài gây chấn động, cơ quan chức năng vào cuộc đóng cửa xưởng. Bạn được giải báo chí quốc gia.', 'big'); H.mem(l, 'Loạt bài điều tra về xưởng thực phẩm bẩn.', 5); } },
      { k: 'sell', l: 'Nhận tiền, "ém" bài', ai: { bad: 1.4 }, run: function (l, r, log) { cashB(l, 0.8, 'Tiền "ém" bài'); fx(l, { karma: -15 }); l.flags.dirty = (l.flags.dirty || 0) + 1; if (ch(r, 0.2)) { log('Đồng nghiệp phanh phui chuyện bạn nhận tiền. Bạn bị thu thẻ nhà báo, khởi tố tội cưỡng đoạt tài sản.', 'bad'); l.job = null; l.flags.needJob = true; H.sched(l, 'bi_bat', 0, { why: 'cưỡng đoạt tài sản', sev: 2 }); } else log('Bài viết không bao giờ được đăng. Bọn trẻ vẫn ăn suất cơm đó.', 'bad'); } },
      { k: 'drop', l: 'Bỏ qua cho an toàn', ai: { w: 0.6 }, run: function (l, r, log) { log('Bỏ qua đề tài. Bạn tự nhủ "không phải việc của mình".', 'neutral'); fx(l, { hap: -2 }); } }
    ]
  });
  T('pv_dieu_tra', function (l) { return hasJob(l, ['phong_vien']) && free(l); }, 0.12, 3);

  // ---- Môi giới bất động sản ----
  SC('bds_deal', {
    title: 'Thương vụ lớn', valid: function (l) { return hasJob(l, ['sale_bds']); },
    text: function (l) { return 'Một khách Việt kiều muốn mua lô đất giá chục tỷ. ' + (l.mkt && l.mkt.land === 'sốt' ? 'Đất đang sốt, ' : '') + 'Chủ đất muốn bạn "thổi giá" thêm, phần chênh chia đôi.'; },
    opts: [
      { k: 'honest', l: 'Môi giới đúng giá, lấy hoa hồng', ai: { w: 1.3 }, run: function (l, r, log) { if (ch(r, 0.55)) { cashB(l, 0.5, 'Hoa hồng môi giới'); rep(l, 5); log('Chốt deal! Hoa hồng một lần bằng cả năm làm văn phòng.', 'big'); } else log('Khách đổi ý vào phút chót. Công cốc mấy tháng.', 'bad'); } },
      { k: 'inflate', l: 'Thổi giá, ăn chênh lệch', ai: { bad: 1.2, risk: 1 }, run: function (l, r, log) { fx(l, { karma: -8 }); if (ch(r, 0.25)) { log('Khách phát hiện bị thổi giá, kiện ra tòa và tung lên mạng. Bạn mất trắng.', 'bad'); rep(l, -20); cashB(l, -0.2, 'Án phí'); } else { cashB(l, 1.2, 'Chênh lệch "thổi giá"'); log('Chốt deal với giá đã thổi, ôm một cục tiền chênh.', 'neutral'); } } }
    ]
  });
  T('bds_deal', function (l) { return hasJob(l, ['sale_bds']) && free(l); }, 0.3, 1);

  // ---- Ngân hàng ----
  SC('nh_chi_tieu', {
    title: 'Chỉ tiêu cuối quý', valid: function (l) { return hasJob(l, ['ngan_hang', 'ngan_hang_cao']); },
    text: function (l) { return rank(l) >= 2 || jid(l) === 'ngan_hang_cao' ? 'Một "sếp lớn" ép bạn duyệt khoản vay nghìn tỷ cho công ty "sân sau" dù tài sản thế chấp bị định giá khống.' : 'Chi nhánh giao chỉ tiêu bán bảo hiểm. Cách nhanh nhất: "gài" bảo hiểm vào hồ sơ vay của khách.'; },
    opts: [
      { k: 'right', l: 'Làm đúng quy định, chấp nhận không đạt chỉ tiêu', ai: { w: 1.3 }, run: function (l, r, log) { fx(l, { karma: 4, hap: -2 }); rep(l, -2); log('Làm đúng quy định. Bị nhắc nhở trong cuộc họp, nhưng hồ sơ sạch.', 'neutral'); } },
      { k: 'push', l: function (l) { return rank(l) >= 2 || jid(l) === 'ngan_hang_cao' ? 'Ký duyệt theo chỉ đạo' : 'Gài bảo hiểm cho khách'; }, ai: { bad: 1, amb: 0.5 }, run: function (l, r, log) {
        var big = rank(l) >= 2 || jid(l) === 'ngan_hang_cao';
        fx(l, { karma: big ? -10 : -4 }); cashB(l, big ? 1.5 : 0.1, big ? 'Thưởng "ngoài"' : 'Thưởng chỉ tiêu');
        if (big) { l.flags.dirty = (l.flags.dirty || 0) + 1; if (ch(r, 0.2)) { log('Khoản vay thành nợ xấu, cơ quan điều tra vào cuộc. Bạn bị khởi tố tội vi phạm quy định cho vay.', 'bad'); l.job = null; l.flags.needJob = true; H.sched(l, 'bi_bat', 0, { why: 'vi phạm quy định về cho vay gây hậu quả nghiêm trọng', sev: 3 }); return; } log('Ký duyệt. Tiền thưởng về đều — và nỗi lo cũng thế.', 'bad'); }
        else log('Đạt chỉ tiêu. Một khách hàng gọi điện mắng vì "không hề biết có mua bảo hiểm".', 'neutral');
      } }
    ]
  });
  T('nh_chi_tieu', function (l) { return hasJob(l, ['ngan_hang', 'ngan_hang_cao']) && free(l); }, 0.15, 2);

  // ---- Chính trị: bầu cử, "cơ chế", thanh tra kỷ luật ----
  function electionYear(l) { var y = yr(l); return isVN(l) ? (y - 2026) % 5 === 0 : y % 4 === 0; }
  SC('ct_bau_cu', {
    title: function (l) { return isVN(l) ? 'Bầu cử đại biểu Quốc hội' : 'Mùa bầu cử'; },
    valid: function (l) { return hasJob(l, ['chinh_tri', 'chinh_khach']) && rank(l) >= 2; },
    text: function (l) { return isVN(l) ? 'Bạn được giới thiệu ứng cử đại biểu Quốc hội khóa mới. Phải tiếp xúc cử tri ở nhiều xã vùng sâu.' : 'Đảng của bạn đề cử bạn ra tranh cử. Đối thủ đang dẫn trước trong các cuộc thăm dò.'; },
    opts: [
      { k: 'campaign', l: 'Đi khắp địa bàn, lắng nghe cử tri', ai: { w: 1.4, soc: 1 }, run: function (l, r, log) {
        var p = U.clamp(0.5 + (l.st.soc - 50) / 120 + (l.karma || 0) / 200 + (l.flags.eliteBoost ? 0.15 : 0), 0.2, 0.92);
        fx(l, { hea: -3 });
        if (ch(r, p)) { l.flags.daibieu = (l.flags.daibieu || 0) + 1; log(isVN(l) ? 'Trúng cử đại biểu Quốc hội với số phiếu cao.' : 'Thắng cử sát nút!', 'big'); fx(l, { hap: 8 }); H.mem(l, 'Đêm nghe công bố kết quả bầu cử năm ' + yr(l) + '.', 5); if (rank(l) < E.CAR[jid(l)].t.length - 1 && ch(r, 0.4)) { l.job.rank++; l.job.yrs = 0; log('Được giao trọng trách mới: ' + E.jobTitle(l) + '.', 'big'); } }
        else { log(isVN(l) ? 'Không trúng cử lần này.' : 'Thất cử.', 'bad'); fx(l, { hap: -6 }); }
      } },
      { k: 'money', l: 'Chi tiền "vận động" ngầm', ai: { bad: 1.3, risk: 1 }, run: function (l, r, log) { cashB(l, -1, 'Chi phí vận động'); fx(l, { karma: -8 }); l.flags.dirty = (l.flags.dirty || 0) + 1; if (ch(r, 0.6)) { l.flags.daibieu = (l.flags.daibieu || 0) + 1; log('Trúng cử. Ai cũng biết cái giá của nó.', 'neutral'); } else log('Mất tiền mà vẫn thất cử.', 'bad'); } },
      { k: 'skip', l: 'Xin rút, nhường người khác', ai: { w: 0.4 }, run: function (l, r, log) { log('Xin rút khỏi danh sách ứng cử.', 'neutral'); } }
    ]
  });
  T('ct_bau_cu', function (l) { return hasJob(l, ['chinh_tri', 'chinh_khach']) && rank(l) >= 2 && electionYear(l) && free(l); }, 0.9);
  SC('ct_co_che', {
    title: 'Lời đề nghị "cơ chế"', valid: function (l) { return hasJob(l, ['chinh_tri', 'chinh_khach']) && rank(l) >= 1; },
    text: 'Chủ một tập đoàn xin gặp riêng: dự án khu đô thị cần được "tạo điều kiện" chuyển đổi đất. Ông ta nói sẽ "không quên ơn".',
    opts: [
      { k: 'no', l: 'Từ chối, yêu cầu làm đúng quy trình', ai: { w: 1.5 }, run: function (l, r, log) { fx(l, { karma: 8 }); log('Từ chối thẳng. Dự án phải làm đủ thủ tục như mọi người.', 'good'); } },
      { k: 'yes', l: 'Nhận "quà cảm ơn", ký tạo điều kiện', ai: { bad: 1.6, amb: 0.5 }, run: function (l, r, log) { cashB(l, 3 + rank(l) * 2, '"Quà cảm ơn"'); fx(l, { karma: -15 }); l.flags.dirty = (l.flags.dirty || 0) + 2; log('Dự án được "bật đèn xanh". Một chiếc vali được gửi đến nhà.', 'bad'); } }
    ]
  });
  T('ct_co_che', function (l) { return hasJob(l, ['chinh_tri', 'chinh_khach']) && rank(l) >= 1 && free(l); }, 0.12, 3);
  SC('ct_ky_luat', {
    title: 'Đoàn thanh tra', tone: 'dark', valid: function (l) { return (l.flags.dirty || 0) > 0 && !!l.job; },
    text: 'Đoàn thanh tra, kiểm tra về làm việc. Những dự án, khoản tiền năm xưa đang được rà soát lại từng tờ giấy.',
    opts: [
      { k: 'confess', l: 'Thành khẩn khai báo, nộp lại tiền', ai: { w: 1.2 }, run: function (l, r, log) { var x = Math.min(cash(l), l.base * (l.flags.dirty || 1) * 2); H.cash(l, -x, 'Nộp lại tiền sai phạm'); log('Thành khẩn khai báo, nộp lại ' + mo(l, x) + '. Bị kỷ luật cách chức, được xem xét giảm nhẹ.', 'bad'); l.flags.dirty = 0; if (ch(r, 0.4)) H.sched(l, 'bi_bat', 0, { why: 'lợi dụng chức vụ quyền hạn', sev: 1 }); else { l.job = null; l.flags.needJob = true; } fx(l, { hap: -15 }); H.mem(l, 'Ngày nhận quyết định kỷ luật.', 5); } },
      { k: 'deny', l: 'Chối, nhờ quan hệ "chạy"', ai: { risk: 1.2, bad: 0.8 }, run: function (l, r, log) { if (ch(r, 0.35)) { log('Thoát được lần này nhờ "ô dù". Nhưng hồ sơ vẫn nằm đó.', 'neutral'); cashB(l, -1, 'Chi phí "chạy"'); } else { log('Bằng chứng quá rõ. Bạn bị bắt tạm giam, báo chí đưa tin khắp nơi.', 'bad'); l.flags.dirty = 0; H.sched(l, 'bi_bat', 0, { why: 'nhận hối lộ, lợi dụng chức vụ', sev: 3 }); } } }
    ]
  });
  T('ct_ky_luat', function (l) { return (l.flags.dirty || 0) > 0 && l.job && free(l); }, function (l) { return Math.min(0.4, 0.04 * l.flags.dirty * (hasJob(l, ['chinh_tri', 'chinh_khach', 'ngan_hang_cao', 'tai_phiet']) ? 1.5 : 1)); }, 2);

  // ---- Tài phiệt: khủng hoảng trái phiếu, thâu tóm ----
  SC('tp_trai_phieu', {
    title: 'Trái phiếu đến hạn', valid: function (l) { return hasJob(l, ['tai_phiet', 'chu_dau_tu']) && rank(l) >= 1; },
    text: 'Thị trường đóng băng, hàng nghìn tỷ trái phiếu của tập đoàn sắp đến hạn trả. Dòng tiền gần như cạn.',
    opts: [
      { k: 'sell', l: 'Bán bớt dự án, cổ phần để trả nợ đúng hạn', ai: { w: 1.3, smart: 1 }, run: function (l, r, log) { var A = l.assets; if (A && A.stock > 0.5) A.stock *= 0.6; cashB(l, -3, 'Trả nợ trái phiếu'); log('Bán tháo nhiều dự án, cổ phần để trả nợ đúng hạn. Tập đoàn thu nhỏ nhưng giữ được uy tín.', 'neutral'); fx(l, { hap: -6 }); } },
      { k: 'roll', l: 'Phát hành thêm trái phiếu lãi cao "đảo nợ"', ai: { risk: 1.4, bad: 0.6 }, run: function (l, r, log) { fx(l, { karma: -8 }); if (ch(r, 0.3)) { log('Cơ quan điều tra khởi tố vụ án lừa đảo trong phát hành trái phiếu. Hàng nghìn nhà đầu tư kéo đến trụ sở.', 'bad'); H.mem(l, 'Ngày bị bắt giữa tâm bão trái phiếu.', 7); H.sched(l, 'bi_bat', 0, { why: 'lừa đảo chiếm đoạt tài sản trong phát hành trái phiếu', sev: 3 }); } else log('Đảo nợ thành công thêm một vòng. Quả bom được hẹn giờ lại.', 'neutral'); } },
      { k: 'extend', l: 'Đàm phán gia hạn với trái chủ', ai: { w: 1 }, run: function (l, r, log) { if (ch(r, 0.6)) log('Trái chủ đồng ý gia hạn hai năm, đổi lấy lãi suất cao hơn.', 'neutral'); else { log('Đàm phán thất bại, cổ phiếu tập đoàn bị bán tháo.', 'bad'); var A = l.assets; if (A && A.stock > 0.5) A.stock *= 0.5; } } }
    ]
  });
  T('tp_trai_phieu', function (l) { return hasJob(l, ['tai_phiet', 'chu_dau_tu']) && rank(l) >= 1 && free(l) && l.mkt && (l.mkt.land === 'đóng băng' || l.mkt.land === 'vỡ bong bóng'); }, 0.4, 4);
  SC('tp_thau_tom', {
    title: 'Cơ hội thâu tóm', valid: function (l) { return hasJob(l, ['tai_phiet', 'kd_tu_do']) && rank(l) >= 2; },
    text: 'Một đối thủ cạnh tranh đang khó khăn, sẵn sàng bán lại toàn bộ công ty với giá rẻ.',
    opts: [
      { k: 'buy', l: 'Thâu tóm', ai: { amb: 1, risk: 0.8 }, run: function (l, r, log) { if (ch(r, 0.55)) { cashB(l, 5, 'Lợi nhuận sau thâu tóm'); log('Thâu tóm thành công, thị phần tăng gấp rưỡi.', 'big'); fx(l, { hap: 6 }); } else { cashB(l, -4, 'Lỗ sau thâu tóm'); log('Mua phải "cái vỏ" đầy nợ ẩn. Mất mấy năm mới xử lý xong.', 'bad'); fx(l, { hap: -6 }); } } },
      { k: 'no', l: 'Tập trung vào mảng đang làm', ai: { w: 1 }, run: function (l, r, log) { log('Bỏ qua thương vụ, tập trung vào thế mạnh.', 'neutral'); } }
    ]
  });
  T('tp_thau_tom', function (l) { return hasJob(l, ['tai_phiet', 'kd_tu_do']) && rank(l) >= 2 && free(l); }, 0.1, 4);

  // ===================================================================
  // 4. GIA ĐÌNH SIÊU GIÀU (~1%): tài phiệt · chủ ngân hàng · chính trị
  // ===================================================================
  var ELITE = {
    tp: { n: 'tài phiệt', dad: 'chủ tịch tập đoàn', mom: 'phó chủ tịch tập đoàn', job: 'tai_phiet', major: 'eco', allow: 5, inherit: 3000 },
    nh: { n: 'chủ ngân hàng', dad: 'chủ tịch HĐQT ngân hàng', mom: 'tổng giám đốc ngân hàng', job: 'ngan_hang_cao', major: 'eco', allow: 3, inherit: 800 },
    ct: { n: 'chính trị', dad: 'bí thư tỉnh ủy', mom: 'phó chủ tịch UBND tỉnh', job: 'chinh_tri', major: 'law', allow: 1, inherit: 60 }
  };
  function elite(l) { return l.fam && l.fam.elite ? ELITE[l.fam.elite] : null; }
  function eliteJob(l) { var e = elite(l); return e ? (e.job === 'chinh_tri' && !isVN(l) ? 'chinh_khach' : e.job) : null; }
  function follower(l) { return !!(elite(l) && l.flags.eliteFollow && !l.flags.eliteCut); }
  E.eliteBirth = function (l, PA) {
    var f = l.fam, kind = PA && PA.elite ? PA.elite : null;
    if (!kind && !PA) {
      var h = { rs: (l.rs ^ 0x7e1173) | 0 }, x = U.rand(h);
      if (l.urban && x < 0.045) kind = U.rand(h) < 0.5 ? 'tp' : U.rand(h) < 0.5 ? 'nh' : 'ct'; // ~1% tổng số ca sinh (chỉ ở thành thị)
    }
    if (!kind) return;
    var e = ELITE[kind];
    f.elite = kind; f.q = 5; f.vice = null; f.noDad = false; f.fAlive = true; f.home = 'nhà riêng';
    if (!PA) {
      f.fJob = isVN(l) || kind !== 'ct' ? e.dad : 'nghị sĩ quốc hội'; f.mJob = isVN(l) || kind !== 'ct' ? e.mom : 'bộ trưởng';
      f.fInc = E.parentMonthly(l, f.fJob, null); f.mInc = E.parentMonthly(l, f.mJob, null);
    }
    l.houseType = isVN(l) ? 'biệt thự' : '';
  };
  function eliteLog(l, a, r, log) {
    var e = elite(l); if (!e) return;
    if (a === 0) log('Bạn chào đời trong một gia đình ' + e.n + ': bố là ' + l.fam.fJob + ', mẹ là ' + l.fam.mJob + '. Ngay từ ngày đầu đã có bảo mẫu riêng.', 'big');
  }
  // tuổi thơ gia giáo, khuôn phép
  EV(function (l, a) { return !!elite(l) && a >= 4 && a <= 16; }, 0.25, function (l, a, r, log) {
    var e = elite(l);
    var t = pick(r, ['Học trường quốc tế, có tài xế riêng đưa đón, vệ sĩ đi theo mỗi khi ra phố.', 'Bữa cơm nào cũng phải ngồi đúng chỗ, mời đủ người lớn, không được cầm điện thoại trên bàn.',
      'Mẹ dặn không được chơi với "bọn trẻ trong xóm", chỉ chơi với con các gia đình cùng giới.', 'Lịch học kín từ sáng đến tối: piano, golf, tiếng Anh, tiếng Trung, lễ nghi.',
      e.n === 'chính trị' ? 'Nhà lúc nào cũng có khách đến "thăm" bố, quà cáp chất đầy phòng khách.' : 'Sinh nhật được tổ chức ở khách sạn năm sao, bạn bè toàn con nhà đại gia.',
      'Mỗi lần đi đâu bố mẹ đều nhắc: "Con mang họ của gia đình, đừng làm mất mặt."']);
    log(t, 'neutral'); if (/không được|phải|nhắc/.test(t)) fx(l, { hap: -1 }); else fx(l, { hap: 1 });
  });
  // 17 tuổi: gia đình sắp xếp con đường
  SC('elite_dinh_huong', {
    title: 'Con đường gia đình đã vạch sẵn', valid: function (l) { return !!elite(l) && !l.flags.eliteChoice; },
    text: function (l) { var e = elite(l); return e.n === 'chính trị' ? 'Bố gọi bạn vào thư phòng: "Con sẽ học Luật, rồi về làm ở văn phòng tỉnh ủy. Đường công danh bố đã lo." Bạn thì mơ một con đường khác.' : 'Bố mẹ đã chọn sẵn: du học ngành Quản trị kinh doanh ở Mỹ, về nước vào ban điều hành ' + (e.job === 'ngan_hang_cao' ? 'ngân hàng' : 'tập đoàn') + ' gia đình. "Nhà này cần người kế nghiệp."'; },
    opts: [
      { k: 'follow', l: 'Nghe theo sắp xếp của gia đình', h: 'Chu cấp đầy đủ, tương lai trải thảm đỏ', ai: { w: 1.6 }, run: function (l, r, log) { l.flags.eliteChoice = true; l.flags.eliteFollow = true; l.flags.eliteBoost = eliteJob(l); log('Gật đầu nghe theo bố mẹ. Con đường phía trước đã được trải thảm.', 'big'); fx(l, { hap: -2 }); } },
      { k: 'own', l: 'Từ chối, tự chọn con đường riêng', h: 'Bị cắt chu cấp, có thể mất quyền thừa kế', ai: { risk: 1.2, amb: 0.5, w: 0.4 }, run: function (l, r, log) { l.flags.eliteChoice = true; l.flags.eliteCut = true; log('Bạn nói "không". Bố đập bàn: "Từ nay tự lo lấy thân!" Thẻ tín dụng bị khóa ngay hôm sau.', 'big'); fx(l, { hap: -6, karma: 2 }); H.mem(l, 'Ngày nói "không" với con đường bố mẹ vạch sẵn.', 6); } },
      { k: 'deal', l: 'Thỏa hiệp: học ngành gia đình chọn, giữ đam mê riêng', ai: { w: 0.8, smart: 0.6 }, run: function (l, r, log) { l.flags.eliteChoice = true; l.flags.eliteFollow = true; l.flags.eliteBoost = eliteJob(l); l.flags.eliteSoft = true; log('Thỏa hiệp với gia đình: học ngành bố mẹ muốn, nhưng giữ cho mình khoảng trời riêng.', 'neutral'); } }
    ]
  });
  T('elite_dinh_huong', function (l, a) { return !!elite(l) && a >= 17 && a <= 19 && !l.flags.eliteChoice && free(l); }, 1);
  E.MAJOR.elite_dinh_huong = 1;
  // hôn nhân sắp đặt
  SC('elite_hon_nhan', {
    title: 'Mối hôn sự môn đăng hộ đối', prep: function (l, r) { var sx = H.partnerSex(l, r); return { n: H.stranger(l, r, sx), sex: sx, who: pick(r, ['con gái út một chủ tịch tập đoàn bất động sản', 'con trai một gia đình chủ ngân hàng', 'cháu nội một vị nguyên bộ trưởng', 'con một gia đình đại gia ngành thép']) }; },
    valid: function (l) { return follower(l) && !l.flags.eliteMarry && !(l.partner && l.partner.status !== 'dating'); },
    text: function (l, d) { return 'Gia đình sắp xếp cho bạn gặp ' + d.n + ' — ' + d.who + '. "Hai nhà mà thành thông gia thì cả hai cùng lớn mạnh."' + (l.partner ? ' Trong khi đó bạn đang yêu ' + l.partner.name + '.' : ''); },
    opts: [
      { k: 'yes', l: 'Đồng ý kết hôn theo sắp xếp', ai: { w: 1.2 }, run: function (l, r, log, d) { l.flags.eliteMarry = true; if (l.partner) { log('Chia tay ' + l.partner.name + ' trong nước mắt.', 'bad'); l.exes++; } l.partner = { name: d.n, sex: d.sex, age: l.age + U.randint(r, -2, 3), status: 'married', since: l.age, alive: true }; log('Đám cưới xa hoa ở khách sạn năm sao, báo chí gọi là "đám cưới thế kỷ". Hai gia đình bắt tay nhau.', 'big'); cashB(l, 20, 'Của hồi môn & quà cưới'); fx(l, { hap: -2 }); H.mem(l, 'Đám cưới thế kỷ với ' + d.n + ' — người bạn mới gặp vài lần.', 6); } },
      { k: 'love', l: function (l) { return l.partner ? 'Xin cưới người mình yêu' : 'Xin được tự tìm hiểu, tự yêu'; }, ai: { w: 0.8 }, run: function (l, r, log) { l.flags.eliteMarry = true; if (ch(r, 0.4)) { log('Bố mẹ giận suốt nửa năm, rồi cũng mềm lòng: "Miễn là con hạnh phúc."', 'good'); fx(l, { hap: 4 }); } else { l.flags.eliteCut = true; log('Bố mẹ tuyên bố: không nghe lời thì đừng hòng nhận một đồng nào. Bạn bị gạch tên khỏi ban điều hành.', 'bad'); fx(l, { hap: -6 }); if (l.job && jid(l) === eliteJob(l)) { l.job = null; l.flags.needJob = true; } } } }
    ]
  });
  T('elite_hon_nhan', function (l, a) { return follower(l) && a >= 23 && a <= 32 && !l.flags.eliteMarry && free(l); }, 0.3, 2);
  E.MAJOR.elite_hon_nhan = 1;
  // bị cắt chu cấp: về sau có cơ hội hòa giải
  SC('elite_hoa_giai', {
    title: 'Cuộc gọi từ nhà', valid: function (l) { return !!elite(l) && l.flags.eliteCut && !l.flags.eliteReconcile && (l.fam.fAlive || l.fam.mAlive); },
    text: function (l) { return (l.fam.fAlive ? 'Bố' : 'Mẹ') + ' giờ đã già, gọi bạn về nhà ăn cơm sau bao năm im lặng. "Về đi con, nhà này vẫn cần con."'; },
    opts: [
      { k: 'back', l: 'Về nhà, làm lành với gia đình', ai: { w: 1.2, soc: 1 }, run: function (l, r, log) { l.flags.eliteReconcile = true; l.flags.eliteCut = false; l.flags.eliteFollow = true; l.flags.eliteJobDone = false; l.flags.eliteBoost = eliteJob(l); log('Về nhà sau bao năm. Bố mẹ già đi nhiều quá. Cả nhà ngồi ăn cơm, không ai nhắc chuyện cũ.', 'big'); fx(l, { hap: 10 }); H.mem(l, 'Bữa cơm làm lành với bố mẹ sau bao năm xa cách.', 6); } },
      { k: 'no', l: 'Cảm ơn, nhưng con đã có cuộc đời riêng', ai: { w: 0.6 }, run: function (l, r, log) { l.flags.eliteReconcile = true; log('Bạn về thăm, nhưng từ chối quay lại guồng máy của gia đình.', 'neutral'); fx(l, { hap: 2 }); } }
    ]
  });
  T('elite_hoa_giai', function (l, a) { return !!elite(l) && l.flags.eliteCut && !l.flags.eliteReconcile && a >= 30 && (l.fam.fAlive || l.fam.mAlive) && free(l); }, 0.08, 3);
  // tranh quyền thừa kế với anh chị em
  SC('elite_tranh_quyen', {
    title: 'Cuộc chiến thừa kế', valid: function (l) { return follower(l) && !l.flags.eliteHeir && H.sibs && H.sibs(l).length > 0; },
    text: function (l) { var s = H.sibs(l)[0]; return 'Bố tuyên bố sẽ chọn người kế nhiệm. ' + U.cap(H.sibCall(l, s)) + ' cũng muốn chiếc ghế ấy, đã âm thầm gom phiếu các cổ đông.'; },
    opts: [
      { k: 'fight', l: 'Tranh đến cùng', ai: { amb: 1.2, risk: 0.6 }, run: function (l, r, log) { l.flags.eliteHeir = true; H.sibs(l).forEach(function (s) { s.close -= 30; }); if (ch(r, 0.5 + (l.st.kno - 50) / 150)) { l.flags.eliteSeat = true; log('Giành được sự ủng hộ của đa số cổ đông, bạn được chọn làm người kế nghiệp. Anh chị em từ đó không nhìn mặt nhau.', 'big'); } else log('Thua trong cuộc bỏ phiếu. Chiếc ghế thuộc về người khác.', 'bad'); } },
      { k: 'share', l: 'Đề nghị cùng điều hành, chia lĩnh vực', ai: { w: 1, soc: 1 }, run: function (l, r, log) { l.flags.eliteHeir = true; l.flags.eliteSeat = true; log('Anh chị em chia nhau điều hành từng mảng. Gia đình giữ được hòa khí.', 'good'); H.sibs(l).forEach(function (s) { s.close += 5; }); } },
      { k: 'yield', l: 'Nhường, chỉ giữ phần cổ phần của mình', ai: { w: 0.6 }, run: function (l, r, log) { l.flags.eliteHeir = true; log('Bạn rút lui, giữ cổ phần và sự bình yên.', 'neutral'); fx(l, { hap: 3 }); } }
    ]
  });
  T('elite_tranh_quyen', function (l, a) { return follower(l) && a >= 30 && a <= 55 && !l.flags.eliteHeir && H.sibs && H.sibs(l).length > 0 && free(l); }, 0.12, 3);
  E.MAJOR.elite_tranh_quyen = 1;

  function eliteYear(l, r, log, a) {
    var e = elite(l); if (!e) return;
    if (a === 0) eliteLog(l, a, r, log);
    // du học theo sắp xếp
    if (follower(l) && a >= 18 && a <= 20 && !l.flags.eliteStudy && l.edu >= 3 && !(l.abroad && l.abroad.perm)) {
      l.flags.eliteStudy = true;
      if (e.n === 'chính trị' && isVN(l)) { if (l.abroad && l.abroad.study) { l.abroad = null; l.uniCity = null; } l.major = 'law'; if (l.school !== 'uni') { l.school = 'uni'; l.schoolEnd = a + 4; } l.uniTier = Math.max(l.uniTier || 1, 1.25); log('Theo sắp xếp của gia đình, vào học ngành Luật ở một trường danh tiếng.', 'neutral'); }
      else { l.major = e.major; l.school = 'abroad'; l.schoolEnd = a + 4; l.abroad = { code: 'US', name: 'Hoa Kỳ', study: true, until: a + 4, pool: 'en' }; l.flags.studiedAbroad = 'Hoa Kỳ'; l.uniTier = 1.5; l.uniCity = 'Hoa Kỳ'; log('Theo sắp xếp của gia đình, sang Mỹ học Quản trị kinh doanh ở một trường danh tiếng. Có căn hộ riêng gần trường.', 'big'); }
      if (l.job) l.job = null;
    }
    // chu cấp
    if (follower(l) && a >= 16 && a <= 40) cashB(l, e.allow, 'Gia đình chu cấp');
    // ra trường: vào thẳng cơ nghiệp gia đình
    var ej = eliteJob(l);
    if (follower(l) && !l.school && a >= 21 && !(l.abroad && !l.abroad.perm) && (!l.job || jid(l) !== ej) && !l.flags.eliteJobDone && free(l)) {
      l.flags.eliteJobDone = true;
      if (l.abroad && l.abroad.study) l.abroad = null;
      E.startJob(l, ej, r, log, true); l.edu = Math.max(l.edu, 5); l.job.fam = true; // cơ nghiệp gia đình: không bị "cắt giảm nhân sự"
      log('Về ' + (e.n === 'chính trị' ? 'nhận công tác: ' : 'gia nhập cơ nghiệp gia đình: ') + E.jobTitle(l) + '. Ai cũng biết bạn là con ai.', 'big');
      H.mem(l, 'Ngày đầu tiên đi làm ở ' + (e.n === 'chính trị' ? 'cơ quan bố sắp xếp' : 'tòa nhà mang tên gia đình') + '.', 4);
    }
    // bố/mẹ có biến cố: bị kỷ luật (chính trị) hoặc làm ăn sa sút
    if (!l.flags.famFall && (l.fam.fAlive || l.fam.mAlive) && ch(r, e.n === 'chính trị' ? 0.01 : 0.004)) {
      l.flags.famFall = true;
      log(e.n === 'chính trị' ? 'Bố bị kỷ luật, cách hết chức vụ sau một đợt thanh tra. Những người từng tấp nập đến nhà bỗng biến mất.' : 'Tập đoàn của gia đình rơi vào khủng hoảng, cổ phiếu mất nửa giá trị, bố phải bán bớt tài sản.', 'bad');
      fx(l, { hap: -10 }); l.flags.eliteBoost = null; H.mem(l, 'Năm gia đình sa sút, mới biết ai là bạn thật.', 5);
    }
    // thừa kế khi bố mẹ đều đã mất
    if (!l.fam.fAlive && !l.fam.mAlive && !l.flags.eliteInherit && a >= 18) {
      l.flags.eliteInherit = true;
      if (l.flags.eliteCut) { log('Bố mẹ đã khuất. Bạn không có tên trong di chúc — cái giá của lần nói "không" năm ấy.', 'bad'); fx(l, { hap: -6 }); }
      else {
        var share = e.inherit * (l.flags.famFall ? 0.3 : 1) / Math.max(1, (H.sibs ? H.sibs(l).length : 0) + 1) * (l.flags.eliteSeat ? 1.5 : 1);
        l.assets = l.assets || {}; l.basis = l.basis || {};
        if (e.n === 'chính trị') { H.cash(l, share * l.base, 'Thừa kế'); log('Nhận phần thừa kế bố mẹ để lại: nhà cửa, đất đai ' + mo(l, share * l.base) + '.', 'good'); }
        else { l.assets.stock = (l.assets.stock || 0) + share * l.base; l.basis.stock = (l.basis.stock || 0) + share * l.base; log('Thừa kế cổ phần ' + (e.job === 'ngan_hang_cao' ? 'ngân hàng' : 'tập đoàn') + ' trị giá ' + mo(l, share * l.base) + '.', 'big'); }
        if (l.job && jid(l) === ej && (l.flags.eliteSeat || !(H.sibs && H.sibs(l).length)) && rank(l) < E.CAR[ej].t.length - 1) { l.job.rank = E.CAR[ej].t.length - 1; l.job.yrs = 0; log('Chính thức ngồi vào ghế ' + E.jobTitle(l) + '.', 'big'); H.mem(l, 'Ngày ngồi vào chiếc ghế của bố.', 6); }
      }
    }
  }

  // ===================================================================
  // ĐĂNG KÝ VÀO VÒNG NĂM
  // ===================================================================
  E.HOOKS.year.push(function (l, r, log, a) {
    if (hasJob(l, ['cong_an'])) policeBr(l, r);
    if (l.job && l.job.rep == null && (hasJob(l, ['tham_tu', 'luat_su', 'cong_an', 'bac_si', 'phong_vien', 'sale_bds']))) l.job.rep = 50;
    eliteYear(l, r, log, a);
  });
  // đang giữ ghế trong cơ nghiệp gia đình thì không "nhảy việc" (muốn đi thì phải chủ động nghỉ việc)
  E.ACT.forEach(function (a) { if (a.id === 'tim_viec') { var av = a.avail; a.avail = function (l) { return l.job && l.job.fam ? 'Đang giữ vị trí trong cơ nghiệp gia đình' : av ? av(l) : true; }; } });
  // du học theo sắp xếp gia đình thì không ở lại định cư
  var dhv = E.DEC.du_hoc_ve && E.DEC.du_hoc_ve.def;
  if (dhv) dhv.opts.forEach(function (o) { if (o.k === 'stay') { var q = o.req; o.req = function (l, d) { return !follower(l) && (!q || q(l, d)); }; } });
  // childOpts: đời con tiếp nối gia đình siêu giàu (nếu chưa bị cắt chu cấp)
  var oldChild = E.childOpts;
  E.childOpts = function (l, k) { var o = oldChild(l, k); if (elite(l) && !l.flags.eliteCut) o.parent.elite = l.fam.elite; return o; };
  E.jobs = { PATHS: PATHS, ELITE: ELITE, pathFor: pathFor, policeBr: policeBr, elite: elite, eliteJob: eliteJob, eliteYear: eliteYear };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
