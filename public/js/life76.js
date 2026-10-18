/* Một Đời — v6.0.0:
   · sinh viên lên thành phố học: chọn chỗ ở theo điều kiện gia đình (ký túc xá, trọ ghép, trọ riêng, thuê chung cư, bố mẹ mua căn hộ, gia đình tài phiệt mua nhà phố / biệt thự); nhà ở sẵn thành phố đó thì không cần
   · làm thêm khi đi học (phục vụ, gia sư, giao hàng, bán hàng online, lễ tân ca đêm…)
   · những "cơ hội" dễ gặp khi mới lên thành phố — có cái thật, có cái là bẫy, game không nói trước
   · chuyện nghề chi tiết: khách đặt kiểu tóc mullet / side part / undercut, nail mắt mèo, latte art, cocktail, fix bug, ca cấp cứu… xưng hô đúng giới tính */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function fx(l, o) { H.fx(l, o); }
  function stress(l, d) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + d, 0, 100); }
  function ch(r, p) { return r() < p; }
  function vnd(l) { return isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  function V(l, tr) { return vnd(l) ? tr : tr / 90 * l.base; }
  function mo(l, v) { return H.money(l, v); }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function A(id, g, label, o) { var x = { id: id, g: g, l: label }; for (var k in o) x[k] = o[k]; E.ACT.push(x); }
  function T(id, when, p, cd, max, rep) { E.TRIG.push({ id: id, when: function (l, a) { return free(l) && when(l, a); }, p: p, cd: cd || 3, max: max || 4, rep: !!rep }); }
  function you(l) { return l.sex === 'F' ? 'chị' : 'anh'; }
  function pw(l) { var f = l.fam || {}, m = !f.noMom && f.mAlive, b = !f.noDad && f.fAlive; return m && b ? 'bố mẹ' : m ? 'mẹ' : b ? 'bố' : ''; }
  function student(l) { return !!l.school && /^(uni|voc|post|phd)$/.test(l.school); }
  function away(l) { return !!(l.cityStudent && student(l)); }

  // ===================================================================
  // 1. CHỖ Ở KHI LÊN THÀNH PHỐ HỌC
  // ===================================================================
  var HOME = [
    { k: 'ktx', l: 'Ở ký túc xá của trường', r: 0.4, q: 0, t: 'Phòng ký túc xá 8 người, giường tầng, giờ giấc nghiêm, bù lại rẻ và gần giảng đường.' },
    { k: 'ghep', l: 'Thuê trọ ghép với bạn', r: 1.6, q: 0, t: 'Căn phòng trọ 15 m² chia ba người, nóng hầm hập mùa hè, chủ trọ thu tiền điện 4 nghìn một số.' },
    { k: 'rieng', l: 'Thuê phòng trọ riêng khép kín', r: 3.5, q: 2, t: 'Phòng trọ riêng khép kín, có gác lửng, yên tĩnh để học.' },
    { k: 'studio', l: 'Thuê căn hộ dịch vụ / studio', r: 6, q: 3, t: 'Căn hộ dịch vụ đủ nội thất, có máy giặt, thang máy, bảo vệ.' },
    { k: 'thue_cc', l: 'Thuê căn hộ chung cư', r: 12, q: 4, t: 'Căn hộ chung cư hai phòng ngủ gần trường, có hồ bơi và phòng gym.' },
    { k: 'mua_cc', l: function (l) { return U.cap(pw(l) || 'gia đình') + ' mua hẳn một căn chung cư'; }, buy: 4000, q: 5, t: 'Căn hộ chung cư mua hẳn gần trường, sau này ra trường vẫn ở được.' },
    { k: 'biet_thu', l: 'Gia đình mua nhà phố / biệt thự ở thành phố', buy: 20000, elite: true, t: 'Một căn nhà phố mặt tiền, có người giúp việc, tài xế đưa đón.' }
  ];
  function rich(l) { var f = l.fam || {}; return f.elite && l.flags.eliteFollow && !l.flags.eliteCut; }
  function famPays(l, h) { var f = l.fam || {}; return rich(l) || (f.q || 0) >= 4 || !!h.buy; }
  function homeOk(l, h) { var f = l.fam || {}; if (h.elite) return rich(l); if (h.buy) return rich(l) || (f.q || 0) >= 5 && !!pw(l); return (f.q || 0) >= h.q || rich(l); }
  SC('sv_cho_o', {
    title: function (l) { return 'Ở đâu khi lên ' + (l.cityStudent ? l.cityStudent.city : 'thành phố') + ' học?'; },
    valid: function (l) { return away(l) && !l.flags.stuHome; },
    text: function (l) { var f = l.fam || {}; return 'Lên ' + l.cityStudent.city + ' nhập học, việc đầu tiên là tìm chỗ ở. ' + (rich(l) ? 'Gia đình muốn bạn ở thật thoải mái, không phải lo gì.' : (f.q || 0) >= 4 ? U.cap(pw(l) || 'gia đình') + ' sẵn sàng trả tiền nhà cho bạn.' : 'Nhà không dư dả, tiền trọ bạn phải tự cân đối từ tiền ' + (pw(l) || 'gia đình') + ' gửi và tiền làm thêm.'); },
    opts: HOME.map(function (h) {
      return { k: h.k, l: h.l, h: function (l) { return h.buy ? 'Khoảng ' + mo(l, V(l, h.buy)) + ' · gia đình chi' : 'Khoảng ' + mo(l, V(l, h.r)) + '/tháng' + (famPays(l, h) ? ' · gia đình trả' : ''); }, req: function (l) { return homeOk(l, h); }, ai: { w: h.k === 'ktx' || h.k === 'ghep' ? 1.2 : 0.8 },
        run: function (l, r, log) { l.flags.stuHome = { k: h.k, since: l.age, city: l.cityStudent.city, rent: h.r || 0, fam: famPays(l, h), buy: h.buy ? V(l, h.buy) : 0 }; log(h.t + (h.buy ? ' ' + U.cap(pw(l) || 'gia đình') + ' đứng ra mua, bạn chỉ việc dọn vào.' : famPays(l, h) ? ' Tiền nhà do ' + (pw(l) || 'gia đình') + ' trả.' : ''), h.k === 'ktx' || h.k === 'ghep' ? 'neutral' : 'good'); H.mem(l, 'Chỗ ở đầu tiên khi lên ' + l.cityStudent.city + ' học.', 2); } };
    })
  });
  T('sv_cho_o', function (l) { return away(l) && !l.flags.stuHome; }, 1, 1, 1);
  E.HOOKS.year.unshift(function (l, r, log, a) {
    var h = l.flags.stuHome; if (!h || h.done) return;
    if (!away(l)) { // ra trường / thôi học
      h.done = true;
      if (h.buy && !l.ownHouse) { l.ownHouse = true; l.houseVal = h.buy; log('Ra trường, căn nhà ' + (pw(l) || 'gia đình') + ' mua hồi đi học được sang tên cho bạn.', 'good'); }
      else if (!h.buy) log('Ra trường, bạn trả lại ' + ({ ktx: 'giường ký túc xá', ghep: 'căn phòng trọ ghép', rieng: 'phòng trọ', studio: 'căn hộ dịch vụ', thue_cc: 'căn hộ thuê' }[h.k] || 'chỗ trọ') + ' đã gắn bó suốt mấy năm.', 'neutral');
      if (l.flags.ptJob) { log('Nghỉ việc làm thêm ' + l.flags.ptJob.n + ' để bắt đầu công việc sau khi ra trường.', 'neutral'); l.flags.ptJob = null; }
      return;
    }
    if (h.buy || h.fam || h.paidAt === a) return; h.paidAt = a;
    var y = V(l, h.rent) * 12; H.cash(l, -y, 'Tiền trọ ' + h.city);
    if (l.money < 0 && !l.flags.ptJob && E.DEC.sv_lam_them) { log('Tiền trọ, tiền ăn ở ' + h.city + ' vượt quá tiền nhà gửi lên. Bạn phải tính chuyện đi làm thêm.', 'bad'); l.pending.push(E.DEC.sv_lam_them.make(l, r)); }
  });

  // ===================================================================
  // 2. LÀM THÊM KHI ĐI HỌC
  // ===================================================================
  var PT = [
    { k: 'cafe', n: 'phục vụ quán cà phê', m: 3, kno: -1, st: 3, t: 'Ca tối ở quán cà phê, bưng bê đến 11 giờ đêm mới về.' },
    { k: 'gia_su', n: 'gia sư', m: 4, kno: 1, st: 2, t: 'Dạy kèm một học sinh lớp 9 ba buổi một tuần.', req: function (l) { return l.st.kno >= 60; } },
    { k: 'ship', n: 'giao đồ ăn', m: 5, kno: -2, st: 6, hea: -2, t: 'Chạy giao đồ ăn giờ cao điểm, mưa nắng gì cũng phải đi.', req: function (l) { return !!l.veh; } },
    { k: 'online', n: 'bán hàng online', m: 2.5, kno: 0, st: 3, t: 'Nhập quần áo, phụ kiện về bán online cho bạn bè, livestream buổi tối.' },
    { k: 'le_tan', n: 'lễ tân ca đêm khách sạn', m: 4.5, kno: -1, st: 5, hea: -2, t: 'Trực lễ tân ca đêm, tranh thủ ôn bài lúc vắng khách.' },
    { k: 'sk', n: 'nhân viên sự kiện / PG, PB', m: 3, kno: -1, st: 3, t: 'Làm nhân viên sự kiện cuối tuần, đứng cả ngày phát tờ rơi, giới thiệu sản phẩm.' }
  ];
  SC('sv_lam_them', {
    title: 'Đi làm thêm', valid: function (l) { return student(l) && !l.flags.ptJob && l.age >= 17; },
    text: function (l) { return 'Bạn tính đi làm thêm ngoài giờ học' + (away(l) ? ' để đỡ tiền trọ, tiền ăn ở ' + l.cityStudent.city : '') + '. Làm nhiều thì có tiền nhưng ít thời gian học.'; },
    opts: PT.map(function (p) { return { k: p.k, l: U.cap(p.n), h: function (l) { return '~' + mo(l, V(l, p.m)) + '/tháng'; }, req: function (l) { return !p.req || p.req(l); }, ai: { w: 1 }, run: function (l, r, log) { l.flags.ptJob = { k: p.k, n: p.n, since: l.age }; log('Bắt đầu đi làm thêm: ' + p.n + '. ' + p.t, 'neutral'); } }; })
      .concat([{ k: 'khong', l: 'Không, tập trung học', ai: { w: 0.6 }, run: function (l, r, log) { log('Bạn quyết định dành hết thời gian cho việc học.', 'neutral'); } }])
  });
  T('sv_lam_them', function (l, a) { return student(l) && !l.flags.ptJob && a >= 18; }, 0.25, 2, 2);
  A('sv_lam_them', 'Công việc', 'Đi làm thêm (part-time) khi đi học', { min: 17, sc: 'sv_lam_them', avail: function (l) { return !student(l) ? 'Không áp dụng' : l.flags.ptJob ? 'Đang làm thêm: ' + l.flags.ptJob.n : true; }, ai: { w: 0.1 } });
  E.HOOKS.year.unshift(function (l, r, log, a) {
    var j = l.flags.ptJob; if (!j || !l.alive) return;
    if (!student(l)) { if (!l.flags.stuHome || l.flags.stuHome.done) { l.flags.ptJob = null; } return; }
    if (j.paidAt === a || !free(l)) return; j.paidAt = a;
    var p = PT.filter(function (x) { return x.k === j.k; })[0]; if (!p) return;
    H.cash(l, V(l, p.m) * 10, 'Làm thêm: ' + p.n); fx(l, { kno: p.kno, hea: p.hea || 0 }); stress(l, p.st);
    if (a - j.since === 1) log(U.pick(r, ['Một năm vừa học vừa làm ' + p.n + ', bạn quen dần với nhịp sống chạy hai đầu.', 'Tiền làm ' + p.n + ' đủ trả tiền trọ, còn dư chút gửi về cho ' + (pw(l) || 'gia đình') + '.', 'Có hôm làm ' + p.n + ' về muộn, sáng hôm sau ngủ gật trên giảng đường.']), 'neutral');
  });

  // ===================================================================
  // 3. NHỮNG "CƠ HỘI" Ở THÀNH PHỐ (có cái là bẫy)
  // ===================================================================
  function trapEv(id, title, text, opts, when) { SC(id, { title: title, valid: function (l) { return student(l) && l.age >= 17; }, text: text, opts: opts }); T(id, function (l) { return student(l) && l.age >= 17 && (!when || when(l)); }, 0.06, 4, 1); }
  trapEv('sv_viec_nhe', 'Việc làm tại nhà', 'Một tài khoản lạ nhắn tin tuyển cộng tác viên online: chỉ cần "làm nhiệm vụ" đặt đơn hàng trên một trang thương mại, nhận hoa hồng 10% mỗi đơn, làm lúc nào cũng được.', [
    { k: 'thu', l: 'Thử làm vài đơn xem sao', ai: { w: 0.5, risk: 1 }, run: function (l, r, log) { H.cash(l, V(l, 0.05), 'Hoa hồng đơn đầu'); var lost = V(l, ch(r, 0.5) ? 8 : 3); H.cash(l, -lost, 'Nạp tiền "làm nhiệm vụ"'); fx(l, { hap: -8 }); stress(l, 8); log('Hai đơn đầu được trả hoa hồng thật. Đến đơn thứ ba, hệ thống báo phải nạp thêm tiền mới "rút được". Nạp xong thì tài khoản kia biến mất, mất trắng ' + mo(l, lost) + '.', 'bad'); H.mem(l, 'Bài học đắt giá năm nhất đại học.', 3); } },
    { k: 'hoi', l: 'Hỏi anh chị khóa trên trước', ai: { w: 1, smart: 1.3 }, run: function (l, r, log) { fx(l, { kno: 1 }); log('Anh khóa trên nghe xong lắc đầu: "Đừng làm, mấy đứa bạn anh nạp cả chục triệu rồi đấy." Bạn chặn tài khoản kia.', 'good'); } },
    { k: 'bo', l: 'Bỏ qua, không trả lời', ai: { w: 0.9 }, run: function (l, r, log) { log('Bạn không trả lời tin nhắn lạ.', 'neutral'); } }
  ]);
  trapEv('sv_hoi_thao', 'Buổi chia sẻ khởi nghiệp', 'Một chị khóa trên rất thân thiện mời bạn đến buổi chia sẻ "tự do tài chính tuổi 20" ở một văn phòng sang trọng, có cả "diễn giả" đi xe sang.', [
    { k: 'dong', l: 'Đăng ký khóa "học viên" để được hướng dẫn', h: function (l) { return 'Khoảng ' + mo(l, V(l, 15)); }, ai: { w: 0.4, risk: 1 }, run: function (l, r, log) { H.cash(l, -V(l, 15), 'Phí "học viên" hội thảo'); fx(l, { hap: -6, soc: -3 }); log('Đóng tiền xong, bạn được giao chỉ tiêu: rủ thêm bạn bè đăng ký và mua sản phẩm thì mới "lên cấp". Cả lớp bắt đầu né bạn. Mấy tháng sau bạn bỏ, tiền không lấy lại được.', 'bad'); } },
    { k: 'nghe', l: 'Đến nghe thử rồi về', ai: { w: 1 }, run: function (l, r, log) { stress(l, 2); log('Buổi chia sẻ toàn chuyện xe sang, nghỉ dưỡng. Cuối buổi ai cũng bị mời ký hợp đồng ngay. Bạn viện cớ có việc rồi về.', 'neutral'); } },
    { k: 'tu_choi', l: 'Từ chối khéo', ai: { w: 0.8 }, run: function (l, r, log) { log('Bạn từ chối khéo vì lịch học kín.', 'neutral'); } }
  ]);
  trapEv('sv_vay', 'Vay tiền sinh viên', 'Đang thiếu tiền đóng học phí, bạn thấy quảng cáo ứng dụng "hỗ trợ tài chính sinh viên": chỉ cần căn cước và thẻ sinh viên, giải ngân trong 5 phút.', [
    { k: 'vay', l: 'Vay 5 triệu cho kịp đóng học phí', ai: { w: 0.4 }, run: function (l, r, log) { if (H.addLoan) { var n0 = (l.loans || []).length; H.addLoan(l, 'appden', V(l, 5)); var L = (l.loans || [])[n0]; if (L) L.bal *= 1.8; } else H.cash(l, V(l, 5), 'Vay qua ứng dụng'); fx(l, { hap: -5 }); stress(l, 10); log('Tiền về ngay, nhưng phí "dịch vụ", "bảo hiểm" bị trừ trước, lãi tính theo ngày. Chỉ vài tháng, khoản nợ đã gần gấp đôi. Điện thoại bắt đầu nhận những cuộc gọi đòi nợ.', 'bad'); } },
    { k: 'xin', l: 'Hỏi phòng công tác sinh viên về học bổng, hoãn đóng học phí', ai: { w: 1, smart: 1.3 }, run: function (l, r, log) { fx(l, { kno: 1 }); log('Phòng công tác sinh viên cho bạn làm đơn xin đóng học phí chậm và giới thiệu một suất học bổng khó khăn.', 'good'); } },
    { k: 'nha', l: 'Gọi điện nói thật với gia đình', ai: { w: 0.9 }, run: function (l, r, log) { log((pw(l) ? U.cap(pw(l)) : 'Người nhà') + ' thu xếp gửi tiền lên, dặn: "Thiếu thì nói, đừng vay ngoài."', 'neutral'); } }
  ], function (l) { return !l.fam || (l.fam.q || 0) <= 3; });
  trapEv('sv_tro_coc', 'Phòng trọ giá rẻ', 'Trên nhóm tìm trọ có bài đăng căn phòng đẹp, rộng, giá chỉ bằng nửa chỗ khác. Chủ nhà nói đang ở xa, chỉ cần chuyển trước tiền cọc để giữ phòng.', [
    { k: 'coc', l: 'Chuyển cọc ngay kẻo mất phòng', ai: { w: 0.4 }, run: function (l, r, log) { H.cash(l, -V(l, 3), 'Tiền cọc phòng trọ'); fx(l, { hap: -6 }); log('Chuyển cọc xong, số điện thoại kia thuê bao. Đến địa chỉ thì căn phòng đã có người ở từ lâu.', 'bad'); } },
    { k: 'xem', l: 'Hẹn đến xem tận nơi rồi mới cọc', ai: { w: 1.1, smart: 1.2 }, run: function (l, r, log) { log('Người kia cứ lấy cớ bận không cho xem phòng. Bạn thôi, tìm chỗ khác qua người quen.', 'neutral'); } }
  ], function (l) { return away(l); });
  trapEv('sv_keo', 'Kèo bóng đá', 'Bạn cùng phòng rủ góp tiền "vào kèo" trận bóng tối nay qua một trang web: "Kèo thơm, chắc thắng, mai khao cả phòng."', [
    { k: 'gop', l: 'Góp vài trăm cho vui', ai: { w: 0.5, risk: 1 }, run: function (l, r, log) { if (ch(r, 0.4)) { H.cash(l, V(l, 0.5), 'Thắng kèo'); log('Thắng thật, cả phòng đi ăn lẩu. Tuần sau bạn cùng phòng lại rủ, lần này đặt nhiều hơn…', 'neutral'); l.flags.svBet = (l.flags.svBet || 0) + 1; } else { H.cash(l, -V(l, 0.5), 'Thua kèo'); log('Thua. Bạn cùng phòng bảo "gỡ lại tuần sau là được".', 'bad'); } } },
    { k: 'khong', l: 'Không chơi, chỉ xem bóng', ai: { w: 1 }, run: function (l, r, log) { log('Bạn chỉ ngồi xem bóng cùng cả phòng.', 'neutral'); } }
  ]);
  trapEv('sv_mau_anh', 'Lời mời làm mẫu ảnh', 'Một "agency" nhắn tin khen bạn ăn ảnh, mời làm mẫu cho các nhãn hàng, cát-xê cao. Chỉ cần đóng phí chụp bộ ảnh hồ sơ ban đầu.', [
    { k: 'dong', l: 'Đóng phí chụp ảnh hồ sơ', ai: { w: 0.4 }, run: function (l, r, log) { H.cash(l, -V(l, 4), 'Phí chụp ảnh hồ sơ'); fx(l, { hap: -5 }); log('Chụp xong bộ ảnh, "agency" hẹn có job thì gọi. Mấy tháng chẳng thấy ai gọi, trang của họ đã đổi tên.', 'bad'); } },
    { k: 'kiem_tra', l: 'Hỏi tên công ty, hợp đồng rõ ràng trước', ai: { w: 1, smart: 1.2 }, run: function (l, r, log) { log('Bạn hỏi tên công ty và hợp đồng. Bên kia trả lời vòng vo rồi im lặng luôn.', 'neutral'); } },
    { k: 'bo', l: 'Không quan tâm', ai: { w: 0.7 }, run: function (l, r, log) { log('Bạn không trả lời.', 'neutral'); } }
  ]);
  trapEv('sv_tiec', 'Buổi tiệc của nhóm bạn mới', 'Nhóm bạn mới quen rủ đi bar mừng sinh nhật. Giữa buổi, một người chìa ra viên "kẹo" bảo uống vào cho vui, ai cũng thử rồi.', [
    { k: 'thu', l: 'Thử một viên cho khỏi bị nói là "quê"', ai: { w: 0.2, risk: 1.5 }, run: function (l, r, log) { fx(l, { hea: -8, hap: -4 }); stress(l, 8); if (ch(r, 0.25)) log('Đêm đó quán bị kiểm tra. Bạn bị đưa về phường lập biên bản, ' + (pw(l) || 'gia đình') + ' phải lên tận nơi bảo lãnh.', 'bad'); else log('Sáng hôm sau tỉnh dậy đầu đau như búa bổ, không nhớ nổi đêm qua đã làm gì.', 'bad'); } },
    { k: 'tu_choi', l: 'Từ chối, uống nước ngọt rồi về sớm', ai: { w: 1.2 }, run: function (l, r, log) { log('Bạn từ chối, ngồi một lúc rồi xin về sớm. Về sau bạn cũng ít đi với nhóm ấy.', 'neutral'); } }
  ], function (l) { return away(l); });

  // ===================================================================
  // 4. CHUYỆN NGHỀ CHI TIẾT
  // ===================================================================
  // mỗi nghề: cách khách / người liên quan gọi bạn, danh sách tình huống [đề bài, [kỹ thuật, độ khó 0–1], …]
  function U2(l) { return you(l); }
  var JOBS = {
    hair: { ids: ['barber', 'tho_toc'], call: U2, cases: [
      ['Một khách nam đưa ảnh trên mạng, muốn đổi kiểu tóc trước buổi phỏng vấn xin việc.', [['Side part rẽ ngôi lịch lãm', 0.3], ['Undercut gọn gàng', 0.4], ['Two-block kiểu Hàn', 0.5], ['Textured crop', 0.5]]],
      ['Cậu học sinh cấp ba muốn kiểu tóc đang hot trên TikTok để đi chơi cuối tuần.', [['Mullet', 0.6], ['Burst fade', 0.7], ['Uốn con sâu', 0.6], ['Buzz cut', 0.2]]],
      ['Một chị khách muốn làm mới mái tóc dài đã lâu không cắt.', [['Tóc layer tỉa nhẹ', 0.4], ['Bob ngang vai', 0.5], ['Uốn sóng nước', 0.6], ['Nhuộm nâu tây', 0.5], ['Mái thưa Hàn Quốc', 0.3]], 'not:barber'],
      ['Khách quen muốn tẩy tóc lên màu nổi để đi concert.', [['Nhuộm bạch kim', 0.8], ['Nhuộm xanh khói', 0.7], ['Highlight vài lọn', 0.5]]]
    ] },
    nail: { ids: ['nail'], call: U2, cases: [
      ['Cô dâu đặt bộ móng cho ngày cưới, dặn phải thật tinh tế.', [['French tip viền trắng', 0.4], ['Vẽ hoa nổi 3D', 0.7], ['Đính đá ngọc trai', 0.6]]],
      ['Hai cô bạn rủ nhau làm nail đi biển.', [['Nail mắt mèo', 0.5], ['Nail ombre chuyển màu', 0.5], ['Nail thạch trong suốt', 0.4], ['Vẽ hình trái cây', 0.6]]]
    ] },
    makeup: { ids: ['makeup', 'spa', 'stylist'], call: U2, cases: [
      ['Một cô dâu nhờ trang điểm cho lễ ăn hỏi sáng sớm.', [['Trang điểm cô dâu truyền thống', 0.5], ['Trong veo kiểu Hàn', 0.4], ['Sắc sảo kiểu Tây', 0.6]]],
      ['Nhóm học sinh lớp 12 thuê trang điểm chụp kỷ yếu.', [['Trang điểm kỷ yếu nhẹ nhàng', 0.3], ['Phong cách Douyin', 0.6], ['Trang điểm áo dài', 0.4]]]
    ] },
    cook: { ids: ['dau_bep', 'chu_quan_an', 'chu_nha_hang'], call: U2, cases: [
      ['Một đoàn khách nước ngoài đặt bàn, muốn thử món Việt "chuẩn vị".', [['Phở bò tái lăn', 0.5], ['Bún chả Hà Nội', 0.4], ['Cơm tấm sườn bì chả', 0.4], ['Bánh xèo miền Tây', 0.5]]],
      ['Khách đặt tiệc sinh nhật, muốn thực đơn kiểu Âu.', [['Bò Wellington', 0.8], ['Mì Ý sốt kem carbonara', 0.4], ['Cá hồi áp chảo sốt chanh leo', 0.5]]],
      ['Một khách khó tính trả lại món, chê nhạt.', [['Nêm lại và tự mang ra xin lỗi', 0.3], ['Làm lại món mới hoàn toàn', 0.4], ['Giải thích công thức truyền thống', 0.5]]]
    ] },
    barista: { ids: ['barista'], call: U2, cases: [
      ['Một vị khách muốn có ly cà phê đẹp để chụp ảnh.', [['Latte art trái tim', 0.3], ['Latte art thiên nga', 0.7], ['Cà phê muối', 0.3], ['Pour over V60', 0.6]]],
      ['Quán đông nghẹt giờ cao điểm, cả chục order cùng lúc.', [['Làm theo thứ tự, giữ chất lượng', 0.4], ['Pha sẵn cold brew cho nhanh', 0.3], ['Nhờ đồng nghiệp chia quầy', 0.2]]]
    ] },
    bar: { ids: ['bartender'], call: U2, cases: [
      ['Khách quen muốn thử một ly cocktail "đặc biệt".', [['Mojito', 0.3], ['Old Fashioned', 0.5], ['Margarita', 0.4], ['Cocktail sáng tạo riêng', 0.7]]],
      ['Quán tổ chức đêm biểu diễn, chủ quán muốn bạn trổ tài.', [['Flair bartending tung chai', 0.8], ['Pha cocktail lửa', 0.6], ['Tháp ly champagne', 0.5]]]
    ] },
    sew: { ids: ['tho_may', 'tk_thoi_trang'], call: U2, cases: [
      ['Một cô gái đặt may áo dài cưới trong hai tuần.', [['Áo dài gấm thêu tay', 0.8], ['Áo dài lụa trơn', 0.4], ['Áo dài cách tân', 0.6]]],
      ['Một anh khách cần bộ vest may đo cho buổi ra mắt nhà vợ.', [['Vest may đo hai khuy', 0.5], ['Vest ba mảnh có gi-lê', 0.7], ['Sửa vest có sẵn cho vừa', 0.3]]]
    ] },
    moto: { ids: ['tho_sua_xe'], call: U2, cases: [
      ['Một chiếc tay ga đề không nổ, khách cần đi làm gấp.', [['Kiểm tra bugi, ắc quy', 0.3], ['Vệ sinh kim phun xăng điện tử', 0.6], ['Làm lại nồi xe', 0.6]]],
      ['Cậu thanh niên muốn độ lại chiếc xe số.', [['Độ đèn bi cầu', 0.5], ['Thay pô cho đúng luật', 0.3], ['Sơn lại dàn áo', 0.4]]]
    ] },
    dev: { ids: ['dev', 'fl_dev', 'data', 'ky_su'], call: U2, cases: [
      ['Hai giờ chiều, hệ thống báo lỗi, khách hàng không thanh toán được.', [['Rollback bản cập nhật', 0.3], ['Đọc log, tìm đúng chỗ lỗi', 0.6], ['Hotfix thẳng lên production', 0.8]]],
      ['Sếp giao dự án mới, hạn chót một tháng.', [['Làm API cho ứng dụng di động', 0.5], ['Tối ưu cơ sở dữ liệu', 0.6], ['Chuyển hệ thống lên cloud', 0.7], ['Viết test tự động', 0.4]]]
    ] },
    design: { ids: ['thiet_ke', 'fl_thiet_ke', 'kien_truc', 'hoa_si'], call: U2, cases: [
      ['Một tiệm bánh mới mở nhờ làm nhận diện thương hiệu.', [['Thiết kế logo', 0.4], ['Bộ nhận diện thương hiệu đầy đủ', 0.7], ['Poster khai trương', 0.3]]],
      ['Khách hàng sửa đến bản thứ bảy vẫn chưa ưng.', [['Hỏi kỹ lại mong muốn, làm lại từ đầu', 0.5], ['Đưa ba phương án khác nhau', 0.4], ['Giữ quan điểm, giải thích lý do thiết kế', 0.6]]]
    ] },
    photo: { ids: ['nhiep_anh'], call: U2, cases: [
      ['Một cặp đôi đặt chụp ảnh cưới.', [['Chụp ngoại cảnh Đà Lạt', 0.5], ['Chụp concept áo dài phố cổ', 0.5], ['Chụp studio ánh sáng điện ảnh', 0.7]]],
      ['Một nhãn hàng thuê chụp ảnh sản phẩm.', [['Chụp sản phẩm nền trắng', 0.3], ['Chụp lookbook ngoài trời', 0.5], ['Quay video quảng cáo ngắn', 0.7]]]
    ] },
    tattoo: { ids: ['tho_xam'], call: U2, cases: [
      ['Một cô gái muốn xăm hình nhỏ đầu tiên trong đời.', [['Xăm mini line nhành hoa', 0.4], ['Xăm chữ viết tay', 0.5], ['Xăm hình xăm phủ sẹo', 0.7]]],
      ['Khách quen đặt hình xăm lớn kín lưng.', [['Xăm full lưng hình rồng', 0.8], ['Xăm phong cách realistic', 0.8], ['Chia làm nhiều buổi', 0.4]]]
    ] },
    teach: { ids: ['giao_vien', 'gia_su', 'giang_vien', 'gv_mam_non'], call: function (l) { return l.sex === 'F' ? 'cô' : 'thầy'; }, cases: [
      ['Lớp có một học sinh học rất chậm, sắp thi chuyển cấp.', [['Kèm riêng sau giờ học', 0.4], ['Chia nhỏ bài, giao bài vừa sức', 0.5], ['Gặp phụ huynh bàn cách học', 0.3]]],
      ['Bạn được chọn dạy tiết thao giảng cấp quận.', [['Dạy theo dự án nhóm', 0.6], ['Dùng trò chơi khởi động', 0.4], ['Dạy truyền thống, chắc chắn', 0.3]]]
    ] },
    med: { ids: ['bac_si', 'dieu_duong', 'phong_kham', 'nha_si', 'duoc_si'], call: function (l) { return 'bác sĩ'; }, cases: [
      ['Ca trực đêm, một bệnh nhân đau bụng dữ dội được đưa vào.', [['Khám kỹ, siêu âm ngay', 0.4], ['Hội chẩn với đàn anh', 0.3], ['Chuyển mổ cấp cứu', 0.7]]],
      ['Một em bé sốt cao co giật, mẹ bé hoảng loạn.', [['Hạ sốt, xử trí co giật', 0.5], ['Trấn an gia đình trước', 0.3], ['Chuyển viện nhi tuyến trên', 0.4]]]
    ] },
    gym: { ids: ['pt_gym', 'hlv_tt'], call: U2, cases: [
      ['Một khách muốn giảm 10 cân trước đám cưới ba tháng nữa.', [['Giáo án giảm mỡ kết hợp ăn uống', 0.5], ['Tập HIIT cường độ cao', 0.6], ['Tập nhẹ, bền vững', 0.3]]],
      ['Một khách vừa phẫu thuật đầu gối muốn tập lại.', [['Bài phục hồi chức năng', 0.6], ['Tập thân trên trước', 0.3], ['Nhờ chuyên viên vật lý trị liệu', 0.3]]]
    ] },
    drive: { ids: ['tx_cn', 'xe_om', 'shipper', 'tai_xe_tai'], call: U2, cases: [
      ['Khách đặt xe ra sân bay đúng giờ cao điểm, sắp lỡ chuyến bay.', [['Đi đường tắt qua ngõ nhỏ', 0.5], ['Đi đường chính, giữ an toàn', 0.3], ['Gọi trước cho khách đổi chuyến', 0.4]]],
      ['Trời mưa to, đường ngập, vẫn còn mấy đơn hàng chưa giao.', [['Đi đường vòng tránh ngập', 0.4], ['Gọi khách hẹn giao muộn', 0.2], ['Lội nước giao cho kịp', 0.6]]]
    ] },
    office: { ids: ['ke_toan', 'kiem_toan', 'van_phong', 'nhan_su', 'marketing', 'ngan_hang'], call: U2, cases: [
      ['Cuối năm, phòng chạy quyết toán, số liệu lệch mấy trăm triệu.', [['Rà lại từng chứng từ', 0.5], ['Dùng hàm đối chiếu dữ liệu', 0.4], ['Báo cáo cấp trên xin thêm thời gian', 0.2]]],
      ['Công ty ra sản phẩm mới, cần kế hoạch truyền thông gấp.', [['Chạy quảng cáo mạng xã hội', 0.4], ['Mời KOL review', 0.5], ['Tổ chức sự kiện ra mắt', 0.6]]]
    ] },
    law: { ids: ['luat_su', 'cong_chung', 'tro_giup_phap_ly'], call: function () { return 'luật sư'; }, cases: [
      ['Một bà cụ nhờ tư vấn vụ tranh chấp đất với hàng xóm.', [['Hòa giải ở phường trước', 0.3], ['Thu thập giấy tờ, khởi kiện', 0.6], ['Tư vấn miễn phí, chỉ đường thủ tục', 0.3]]],
      ['Một cặp vợ chồng đến tư vấn ly hôn, tranh chấp quyền nuôi con.', [['Khuyên hòa giải vì con', 0.4], ['Chuẩn bị chứng cứ quyền nuôi con', 0.6], ['Thỏa thuận chia tài sản', 0.5]]]
    ] },
    creator: { ids: ['streamer', 'youtuber', 'kol_live', 'fl_video', 'fl_content'], call: U2, cases: [
      ['Kênh đang chững lại, bạn cần một video "bùng nổ".', [['Thử thách 24 giờ', 0.5], ['Review đồ ăn đường phố', 0.4], ['Vlog một ngày đi làm', 0.3], ['Hợp tác với kênh khác', 0.6]]],
      ['Một nhãn hàng mời quảng cáo, sản phẩm bạn chưa dùng thử.', [['Dùng thử một tuần rồi mới nhận', 0.4], ['Nhận ngay, đọc kịch bản sẵn', 0.3], ['Từ chối vì không hợp kênh', 0.2]]]
    ] }
  };
  var BY = {}; Object.keys(JOBS).forEach(function (g) { JOBS[g].ids.forEach(function (id) { BY[id] = g; }); });
  function group(l) { return l.job && !l.retired && BY[E.resolveJob(l.job.id)]; }
  function skill(l) { var j = l.job || {}, c = E.jobDef(l); var s = Math.min(10, j.yrs || 0) * 0.04 + (j.rank || 0) * 0.06 + ((l.st.kno || 50) - 50) / 400; if (c && l.talent && c.talent && c.talent === l.talent) s += 0.1; return s; }
  E.JOB_DETAIL = JOBS;
  SC('nghe_kh', {
    title: function (l) { return 'Một ca làm đáng nhớ · ' + E.jobTitle(l); },
    prep: function (l, r) { var g = group(l); if (!g) return {}; var C = JOBS[g].cases, jid = E.resolveJob(l.job.id), S = l.flags.jobCase || (l.flags.jobCase = {}), fit = C.map(function (_, i) { return i; }).filter(function (i) { return C[i][2] !== 'not:' + jid; }), left = fit.filter(function (i) { return S[g + i] == null || l.age - S[g + i] >= 6; }); var i = left.length ? U.pick(r, left) : U.pick(r, fit); return { g: g, i: i, job: l.job.id }; },
    valid: function (l, d) { return !!group(l) && free(l) && (!d || !d.g || (group(l) === d.g && l.job.id === d.job)); },
    text: function (l, d) { return JOBS[d.g].cases[d.i][0] + ' Bạn chọn cách làm nào?'; },
    opts: [0, 1, 2, 3, 4].map(function (k) {
      return { k: 't' + k, l: function (l, d) { var x = JOBS[d.g].cases[d.i][1][k]; return x ? x[0] : ''; }, h: function (l, d) { var x = JOBS[d.g].cases[d.i][1][k]; return x ? (x[1] >= 0.7 ? 'Khó, cần tay nghề cao' : x[1] >= 0.5 ? 'Vừa sức' : 'Dễ, chắc chắn') : ''; }, req: function (l, d) { return !!JOBS[d.g].cases[d.i][1][k]; }, ai: { w: 1 },
        run: function (l, r, log, d) { work(l, r, log, d, JOBS[d.g].cases[d.i][1][k]); } };
    })
  });
  function work(l, r, log, d, x) {
    var S = l.flags.jobCase || (l.flags.jobCase = {}); S[d.g + d.i] = l.age;
    var p = U.clamp(0.75 + skill(l) - x[1] * 0.55, 0.1, 0.95), call = JOBS[d.g].call(l), name = x[0].charAt(0).toLowerCase() + x[0].slice(1);
    if (ch(r, p)) {
      if (l.job) l.job.rep = U.clamp((l.job.rep == null ? 50 : l.job.rep) + (x[1] >= 0.6 ? 4 : 2), 0, 100);
      if (x[1] >= 0.5 && l.indep) H.cash(l, V(l, 0.2 + x[1] * 0.6), 'Tiền boa / thưởng thêm');
      fx(l, { hap: 3 }); log(U.cap(name) + ': ' + U.pick(r, ['làm xong, người ta khen nức nở: "' + U.cap(call) + ' giỏi thật đấy!"', 'kết quả còn đẹp hơn mong đợi, ảnh được đăng lên mạng kèm lời cảm ơn ' + call + '.', 'mọi thứ suôn sẻ, từ đó có thêm mấy người tìm đến nhờ ' + call + '.']), 'good');
      if (x[1] >= 0.7) H.mem(l, 'Lần làm thành công ' + name + ' — một ca khó trong nghề.', 2);
    } else {
      if (l.job) l.job.rep = U.clamp((l.job.rep == null ? 50 : l.job.rep) - 3, 0, 100);
      fx(l, { hap: -3 }); stress(l, 4); log(U.cap(name) + ': ' + U.pick(r, ['tay nghề chưa tới, kết quả không như ý, bạn phải làm lại và xin lỗi.', 'có trục trặc giữa chừng, người ta không hài lòng. Bạn rút kinh nghiệm cho lần sau.', 'chưa quen kỹ thuật này nên mất gấp đôi thời gian, kết quả chỉ tạm được.']), 'bad');
    }
  }
  T('nghe_kh', function (l) { return !!group(l); }, 0.3, 2, 99, true);
  A('nghe_kh', 'Công việc', 'Nhận một ca / đơn đặc biệt trong nghề', { min: 16, sc: 'nghe_kh', avail: function (l) { return group(l) ? true : 'Không áp dụng với công việc hiện tại'; }, ai: { w: 0.1 } });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
