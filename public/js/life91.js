/* Một Đời — v7.2.0: drama ở khắp nơi (ngẫu nhiên, tỉ lệ thấp, không phải năm nào cũng có)
   · công sở: bị cướp công, sếp đổ lỗi, tin đồn tình cảm nơi công sở, phe phái trước đợt bổ nhiệm, gửi nhầm tin nói xấu sếp vào nhóm chung,
     "con ông cháu cha" vào làm, danh sách cắt giảm, tiệc tất niên quá chén, bạn thân thành sếp mình, bị sếp quấy rối
   · hàng xóm, chung cư: hát karaoke đến nửa đêm, lấn ranh giới đất, chó thả rông, tranh cãi phí quản lý và chỗ đỗ xe
   · phòng trọ: bạn cùng phòng trốn tiền điện nước
   · mạng xã hội: bị "bóc phốt", bài đăng bất ngờ lan truyền, cãi nhau trong hội nhóm
   · trường học: nhóm bạn tẩy chay, bị nghi gian lận trong giờ thi
   · bạn bè: họp lớp so bì, quỹ du lịch của hội bạn "bốc hơi"
   · đường phố: va quẹt xe, người kia đòi tiền
   Mỗi tình huống chỉ gặp tối đa một hai lần trong đời, tỉ lệ thấp nên nhiều đời không gặp. */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function fx(l, o) { H.fx(l, o); }
  function mo(l, v) { return H.money(l, v); }
  function cash(l, x, why) { H.cash(l, x, why); }
  function stress(l, x) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + x, 0, 100); }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function T(id, when, p, cd, max) { E.TRIG.push({ id: id, when: function (l, a) { return free(l) && when(l, a); }, p: p, cd: cd || 5, max: max || 1 }); }
  function V(l, tr) { return isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm) ? tr : tr / 90 * l.base; }
  function office(l) { if (!l.job || l.retired || (E.isCrime && E.isCrime(l)) || l.job.fam) return false; var c = E.jobDef && E.jobDef(l); return !!c && !c.fame && c.cat !== 'farm' && c.cat !== 'biz' && !(E.isFreelanceJob && E.isFreelanceJob(l)) && (!H.isEmployee || H.isEmployee(l)); }
  function rep(l, d) { if (l.job) l.job.rep = U.clamp((l.job.rep == null ? 50 : l.job.rep) + d, 0, 100); }
  function name(l, r, sx) { return H.stranger(l, r, sx || (r() < 0.5 ? 'M' : 'F')); }
  function given(l, n) { var w = String(n).split(' '); return l.pool === 'vn' ? w[w.length - 1] : w[0]; }

  // ===================================================================
  // 1. CÔNG SỞ
  // ===================================================================
  SC('cs_cuop_cong', {
    title: 'Bị cướp công',
    prep: function (l, r) { return { n: name(l, r) }; },
    valid: office,
    text: function (l, d) { return 'Bản kế hoạch bạn thức trắng ba đêm để làm, trong buổi họp ' + d.n + ' trình bày như ý tưởng của mình. Sếp khen nức nở, không ai nhắc đến tên bạn.'; },
    opts: [
      { k: 'noi', l: 'Lên tiếng ngay trong buổi họp', ai: { w: 0.7, risk: 1 }, run: function (l, r, log, d) { if (ch(r, 0.5)) { rep(l, 8); log('Bạn bình tĩnh mở lịch sử chỉnh sửa tài liệu. Cả phòng im lặng, sếp gật đầu: "Vậy ra là của em." ' + d.n + ' đỏ mặt cúi xuống.', 'good'); fx(l, { hap: 3 }); } else { rep(l, -4); log('Bạn lên tiếng, nhưng bị cho là "tranh công, thiếu tinh thần tập thể". Không khí phòng họp đông cứng.', 'bad'); stress(l, 8); } } },
      { k: 'rieng', l: 'Gặp riêng sếp, đưa bằng chứng', ai: { w: 1.1, smart: 1 }, run: function (l, r, log, d) { rep(l, ch(r, 0.65) ? 6 : 1); log('Bạn gặp riêng sếp, đưa email và bản nháp cũ. Sếp không nói gì nhiều, nhưng từ đó giao việc quan trọng thẳng cho bạn.', 'neutral'); } },
      { k: 'nhin', l: 'Nuốt cục tức, rút kinh nghiệm', ai: { w: 0.8 }, run: function (l, r, log, d) { stress(l, 6); fx(l, { hap: -3 }); log('Bạn im lặng. Từ đó việc gì cũng gửi email có đồng gửi sếp, để lại dấu vết.', 'neutral'); } }
    ]
  });
  T('cs_cuop_cong', function (l, a) { return office(l) && a >= 22 && a <= 55; }, 0.025, 6, 1);
  SC('cs_do_loi', {
    title: 'Sếp đổ lỗi',
    valid: office,
    prep: function (l, r) { return { why: pick(r, ['một hợp đồng bị hủy', 'khách hàng lớn khiếu nại', 'số liệu báo cáo lên trên bị sai', 'dự án trễ hạn hai tháng']) }; },
    text: function (l, d) { return 'Ban giám đốc truy trách nhiệm vì ' + d.why + '. Sếp trực tiếp của bạn, người ký duyệt mọi thứ, quay sang bảo: "Phần này em phụ trách mà."'; },
    opts: [
      { k: 'chung_minh', l: 'Đưa ra email, biên bản chứng minh', ai: { w: 1, smart: 1 }, run: function (l, r, log) { if (ch(r, 0.6)) { log('Bạn đưa đủ email phê duyệt. Ban giám đốc hiểu chuyện, sếp bị khiển trách. Từ đó sếp nhìn bạn không mấy thiện cảm.', 'neutral'); rep(l, 3); stress(l, 5); } else { log('Chứng cứ chưa đủ thuyết phục, bạn vẫn bị trừ thưởng quý.', 'bad'); cash(l, -V(l, 5), 'Bị trừ thưởng vì lỗi dự án'); stress(l, 8); } } },
      { k: 'nhan', l: 'Nhận lỗi thay để giữ êm', ai: { w: 0.7 }, run: function (l, r, log) { cash(l, -V(l, 4), 'Bị trừ thưởng vì nhận lỗi thay'); rep(l, -3); log('Bạn nhận lỗi, bị trừ thưởng. Sếp vỗ vai: "Anh nhớ ơn em." Bạn không chắc câu ấy đáng giá bao nhiêu.', 'neutral'); if (ch(r, 0.3)) l.flags.bossOwes = l.age; } },
      { k: 'nghi', l: 'Nộp đơn nghỉ việc', ai: { w: 0.3, risk: 1 }, run: function (l, r, log) { log('Bạn đặt đơn nghỉ việc lên bàn. "Em không làm ở nơi mình phải gánh lỗi cho người khác."', 'neutral'); l.flags.needJob = true; if (E.quitJob) E.quitJob(l, log); else { l.lastJob = l.job; l.job = null; } fx(l, { hap: 2 }); stress(l, -4); } }
    ]
  });
  T('cs_do_loi', function (l, a) { return office(l) && a >= 23 && a <= 58; }, 0.02, 6, 1);
  SC('cs_tin_don', {
    title: 'Tin đồn ở công ty',
    prep: function (l, r) { var sx = H.partnerSex ? H.partnerSex(l, r) : (l.sex === 'M' ? 'F' : 'M'); return { n: name(l, r, sx) }; },
    valid: office,
    text: function (l, d) { return 'Chỉ vì vài lần đi ăn trưa và về muộn cùng ' + d.n + ' để kịp dự án, cả công ty xì xào hai người "có gì đó".' + (l.partner && l.partner.status !== 'dating' ? ' Tin đồn đến tai cả người nhà bạn.' : ''); },
    opts: [
      { k: 'ke', l: 'Mặc kệ, thanh giả tự thanh', ai: { w: 1 }, run: function (l, r, log, d) { log('Bạn mặc kệ. Vài tháng sau có chuyện khác để bàn, tin đồn tự tắt.', 'neutral'); stress(l, 3); } },
      { k: 'xa', l: 'Giữ khoảng cách với ' + 'người kia', ai: { w: 0.9 }, run: function (l, r, log, d) { log('Bạn chủ động ăn trưa một mình, họp thì gọi thêm người. ' + d.n + ' buồn vì mất một người đồng nghiệp hợp cạ.', 'neutral'); fx(l, { soc: -1 }); } },
      { k: 'noi_thang', l: 'Nói thẳng trong buổi họp phòng', ai: { w: 0.4, risk: 1 }, run: function (l, r, log, d) { if (ch(r, 0.5)) { log('Bạn nói thẳng: "Ai có gì thì hỏi trực tiếp." Cả phòng ngượng, tin đồn chấm dứt.', 'good'); fx(l, { hap: 2 }); } else { log('Càng thanh minh, mọi người càng tin là có chuyện. Bạn mệt mỏi suốt mấy tháng.', 'bad'); stress(l, 8); } } }
    ]
  });
  T('cs_tin_don', function (l, a) { return office(l) && a >= 22 && a <= 50; }, 0.02, 8, 1);
  SC('cs_phe_phai', {
    title: 'Chọn phe',
    prep: function (l, r) { return { a: name(l, r, 'M'), b: name(l, r, 'F') }; },
    valid: function (l) { return office(l) && (l.job.rank || 0) >= 1; },
    text: function (l, d) { return 'Trưởng phòng sắp nghỉ hưu. Hai phó phòng, anh ' + given(l, d.a) + ' và chị ' + given(l, d.b) + ', đều muốn lên thay, cả phòng chia hai phe. Cả hai đều mời bạn đi cà phê riêng.'; },
    opts: [
      { k: 'a', l: function (l, d) { return 'Theo phe anh ' + given(l, d.a); }, ai: { w: 0.7, risk: 0.8 }, run: function (l, r, log, d) { side(l, r, log, d.a); } },
      { k: 'b', l: function (l, d) { return 'Theo phe chị ' + given(l, d.b); }, ai: { w: 0.7, risk: 0.8 }, run: function (l, r, log, d) { side(l, r, log, d.b); } },
      { k: 'trung', l: 'Đứng giữa, chỉ lo làm tốt việc của mình', ai: { w: 1.1 }, run: function (l, r, log) { log('Bạn đứng giữa, ai hỏi cũng chỉ cười. Ai lên cũng không ưu ái bạn, nhưng cũng không ai làm khó bạn.', 'neutral'); } }
    ]
  });
  function side(l, r, log, n) {
    if (ch(r, 0.5)) { rep(l, 10); log(n + ' được bổ nhiệm làm trưởng phòng và nhớ ơn những người ủng hộ mình. Bạn được giao phụ trách mảng quan trọng.', 'good'); if (l.job) l.job.rankSince = Math.max(0, (l.job.rankSince || l.age) - 1); }
    else { rep(l, -8); log('Phe bạn chọn thua. Trưởng phòng mới lạnh nhạt, những việc khó cứ dồn về bạn.', 'bad'); stress(l, 10); }
  }
  T('cs_phe_phai', function (l, a) { return office(l) && (l.job.rank || 0) >= 1 && a >= 27 && a <= 55; }, 0.02, 8, 1);
  SC('cs_gui_nham', {
    title: 'Gửi nhầm tin nhắn',
    valid: office,
    text: 'Bạn định nhắn cho bạn thân một tràng than thở về sếp, nhưng bấm nhầm vào nhóm chat chung của cả phòng, có cả sếp. Dấu "đã xem" hiện lên từng người một.',
    opts: [
      { k: 'thu_hoi', l: 'Thu hồi ngay, giả vờ như không có gì', ai: { w: 1 }, run: function (l, r, log) { if (ch(r, 0.5)) log('Bạn thu hồi kịp, hình như chưa ai chụp màn hình. Bạn thở phào, tim vẫn đập thình thịch cả buổi.', 'neutral'); else { log('Thu hồi rồi nhưng có người đã chụp lại. Ảnh chụp màn hình lan khắp công ty.', 'bad'); rep(l, -8); stress(l, 10); } } },
      { k: 'xin_loi', l: 'Chủ động gặp sếp xin lỗi', ai: { w: 0.8, moral: 1 }, run: function (l, r, log) { if (ch(r, 0.6)) { log('Bạn gõ cửa phòng sếp xin lỗi. Sếp im lặng một lúc rồi bật cười: "Ít ra em nói thật. Góp ý thì cứ nói thẳng với tôi."', 'good'); rep(l, 2); } else { log('Sếp nhận lời xin lỗi, nhưng từ đó bạn không còn được mời họp những việc quan trọng.', 'bad'); rep(l, -6); } } },
      { k: 'dua', l: 'Nhắn thêm "đùa thôi mọi người ơi 😅"', ai: { w: 0.5 }, run: function (l, r, log) { log('Cả nhóm thả biểu tượng cười, sếp im lặng. Sự im lặng ấy kéo dài suốt cuộc họp tuần sau.', 'neutral'); rep(l, -3); stress(l, 5); } }
    ]
  });
  T('cs_gui_nham', function (l, a) { return office(l) && a >= 20 && a <= 55; }, 0.012, 10, 1);
  SC('cs_con_ong_chau_cha', {
    title: 'Nhân viên mới "có ô dù"',
    prep: function (l, r) { return { n: name(l, r) }; },
    valid: office,
    text: function (l, d) { return d.n + ' mới vào làm, là cháu của một vị lãnh đạo cấp trên. Việc gì khó cũng đẩy sang bạn, lỗi thì không ai dám nói. Mới nửa năm đã có tin ' + given(l, d.n) + ' sắp được đề bạt.'; },
    opts: [
      { k: 'kem', l: 'Kèm cặp tử tế, coi như đầu tư quan hệ', ai: { w: 1, soc: 1 }, run: function (l, r, log, d) { if (ch(r, 0.5)) { rep(l, 6); log(d.n + ' học được việc, sau này lên chức vẫn nhớ người đã chỉ bảo mình.', 'good'); } else { log('Bạn kèm cặp hết lòng. Một năm sau ' + d.n + ' lên làm phó phòng, nhìn bạn như người lạ.', 'bad'); fx(l, { hap: -3 }); } } },
      { k: 'tu_choi', l: 'Từ chối làm thay phần việc của người ta', ai: { w: 0.8, risk: 0.6 }, run: function (l, r, log, d) { rep(l, -3); log('Bạn từ chối khéo. Từ đó bạn bị đánh giá "thiếu hợp tác", nhưng ít ra đêm được về đúng giờ.', 'neutral'); } },
      { k: 'tim_viec', l: 'Âm thầm tìm chỗ làm mới', ai: { w: 0.5 }, run: function (l, r, log, d) { l.flags.lookJob = l.age; log('Bạn bắt đầu cập nhật hồ sơ xin việc. "Chỗ này không phải nơi để mình lớn lên."', 'neutral'); } }
    ]
  });
  T('cs_con_ong_chau_cha', function (l, a) { return office(l) && a >= 25 && a <= 55; }, 0.015, 8, 1);
  SC('cs_cat_giam', {
    title: 'Danh sách cắt giảm',
    prep: function (l, r) { return { n: name(l, r) }; },
    valid: office,
    text: function (l, d) { return 'Công ty phải cắt giảm nhân sự. Sếp gọi bạn vào, nói khẽ: "Phòng mình phải cắt một người, giữa em và ' + d.n + '. ' + given(l, d.n) + ' đang nuôi con nhỏ một mình. Em nghĩ sao?"'; },
    opts: [
      { k: 'giu', l: 'Xin được ở lại, mình cũng cần công việc', ai: { w: 1.1 }, run: function (l, r, log, d) { log('Bạn xin ở lại. ' + d.n + ' ôm thùng đồ ra về, bạn không dám nhìn theo. Nhiều đêm sau đó bạn vẫn nghĩ về chuyện ấy.', 'neutral'); stress(l, 6); fx(l, { karma: -1 }); } },
      { k: 'nhuong', l: 'Tình nguyện nghỉ, nhận trợ cấp thôi việc', ai: { w: 0.4, moral: 1.2 }, run: function (l, r, log, d) { var v = (l.income || l.base) * 0.25; cash(l, v, 'Trợ cấp thôi việc'); log('Bạn tình nguyện nghỉ, nhận ' + mo(l, v) + ' trợ cấp. ' + d.n + ' khóc khi biết chuyện: "Em sẽ không quên đâu."', 'neutral'); fx(l, { karma: 8 }); l.flags.needJob = true; if (E.quitJob) E.quitJob(l, log); else { l.lastJob = l.job; l.job = null; } } }
    ]
  });
  T('cs_cat_giam', function (l, a) { return office(l) && a >= 25 && a <= 58; }, 0.008, 10, 1);
  SC('cs_tat_nien', {
    title: 'Tiệc tất niên',
    valid: office,
    text: 'Tiệc tất niên công ty, rượu bia ê hề. Mấy anh bên kinh doanh cứ ép từng ly, "không uống là không nể anh em".',
    opts: [
      { k: 'uong', l: 'Uống tới bến cho vui', ai: { w: 0.7, risk: 1 }, run: function (l, r, log) { if (ch(r, 0.4)) { log(pick(r, ['Bạn say, cầm micro hát ba bài liền, video lan khắp nhóm chat công ty. Ba tháng sau vẫn bị nhắc lại.', 'Say quá, bạn ôm vai sếp tổng gọi "anh trai". Hôm sau đi làm muốn độn thổ.']), 'neutral'); rep(l, -2); } else { log('Uống nhiều nhưng vui, cả phòng thân nhau hơn hẳn.', 'good'); fx(l, { soc: 3 }); } fx(l, { hea: -2 }); } },
      { k: 'tu_choi', l: 'Từ chối, uống nước ngọt', ai: { w: 1, moral: 0.5 }, run: function (l, r, log) { log('Bạn cười xòa, cầm ly nước ngọt cụng với mọi người. Có người bĩu môi, nhưng sáng hôm sau chỉ mình bạn tỉnh táo đi làm.', 'neutral'); } },
      { k: 've_som', l: 'Viện cớ về sớm', ai: { w: 0.6 }, run: function (l, r, log) { log('Bạn xin về sớm vì "nhà có việc". Tiệc vẫn vui, chỉ là bạn bỏ lỡ vài câu chuyện.', 'neutral'); fx(l, { soc: -1 }); } }
    ]
  });
  T('cs_tat_nien', function (l, a) { return office(l) && isVN(l) && a >= 20 && a <= 58; }, 0.03, 6, 2);
  SC('cs_ban_thanh_sep', {
    title: 'Bạn thân thành sếp',
    prep: function (l) { var f = E.friendsOf ? E.friendsOf(l)[0] : null; return { n: f ? f.name : '' }; },
    valid: function (l) { return office(l) && !!(E.friendsOf && E.friendsOf(l).length); },
    text: function (l, d) { return 'Công ty tuyển trưởng phòng mới, người trúng tuyển lại là ' + d.n + ', bạn thân của bạn. Ngày đầu tiên, cả phòng nhìn hai người dò xét.'; },
    opts: [
      { k: 'ro_rang', l: 'Thống nhất: ở công ty là sếp, ra ngoài là bạn', ai: { w: 1.1, smart: 1 }, run: function (l, r, log, d) { log('Hai người nói chuyện thẳng thắn. Ở công ty bạn gọi ' + d.n + ' là "sếp", cuối tuần vẫn đi cà phê như cũ.', 'good'); fx(l, { soc: 2 }); } },
      { k: 'nho', l: 'Nhờ bạn ưu ái một chút', ai: { w: 0.5, risk: 0.6 }, run: function (l, r, log, d) { var f = E.friendsOf(l).filter(function (x) { return x.name === d.n; })[0]; if (ch(r, 0.5)) { rep(l, 4); log(d.n + ' giao cho bạn những dự án hay. Đồng nghiệp xì xào "cánh hẩu".', 'neutral'); } else { if (f) f.close = Math.max(0, (f.close || 60) - 20); log(d.n + ' khó xử: "Mình không thể làm thế." Tình bạn có vết rạn từ đó.', 'bad'); } } },
      { k: 'chuyen', l: 'Xin chuyển phòng cho khỏi khó xử', ai: { w: 0.5 }, run: function (l, r, log, d) { log('Bạn xin chuyển sang phòng khác. Tình bạn giữ được, công việc thì phải làm lại từ đầu với người mới.', 'neutral'); } }
    ]
  });
  T('cs_ban_thanh_sep', function (l, a) { return office(l) && a >= 28 && a <= 50 && !!(E.friendsOf && E.friendsOf(l).length); }, 0.01, 10, 1);
  SC('cs_quay_roi', {
    title: 'Sự quấy rối nơi công sở',
    valid: function (l) { return office(l) && l.age >= 18; },
    text: 'Sếp liên tục nhắn tin riêng lúc khuya, buông những lời bóng gió, có lần cố tình chạm vào người bạn trong thang máy. Bạn thấy khó chịu và sợ hãi.',
    opts: [
      { k: 'to_cao', l: 'Lưu bằng chứng, báo lên phòng nhân sự / công đoàn', ai: { w: 1, moral: 1 }, run: function (l, r, log) { if (ch(r, 0.55)) { log('Bạn lưu lại tin nhắn, gửi lên phòng nhân sự và công đoàn. Sau điều tra, người sếp bị kỷ luật và chuyển công tác. Có vài đồng nghiệp lặng lẽ cảm ơn bạn vì họ cũng từng bị như vậy.', 'good'); fx(l, { hap: 3 }); stress(l, -5); } else { log('Bạn tố cáo, nhưng công ty "xử lý nội bộ" rồi im lặng. Bạn bị cô lập, cuối cùng phải nghỉ việc. Bạn vẫn tin mình đã làm đúng.', 'bad'); stress(l, 12); l.flags.needJob = true; if (E.quitJob) E.quitJob(l, log); else { l.lastJob = l.job; l.job = null; } } H.mem(l, 'Năm bạn lên tiếng về chuyện bị quấy rối ở chỗ làm.', 4); } },
      { k: 'nghi', l: 'Lặng lẽ nghỉ việc, tìm chỗ khác', ai: { w: 0.7 }, run: function (l, r, log) { log('Bạn nộp đơn nghỉ, không nói lý do. Tối hôm ấy bạn kể cho người thân nghe, lần đầu tiên bật khóc.', 'neutral'); stress(l, 6); l.flags.needJob = true; if (E.quitJob) E.quitJob(l, log); else { l.lastJob = l.job; l.job = null; } } },
      { k: 'tu_choi', l: 'Từ chối dứt khoát, giữ khoảng cách', ai: { w: 0.8 }, run: function (l, r, log) { log('Bạn nói rõ: "Mong anh/chị dừng lại." Mọi chuyện dừng, nhưng những đánh giá cuối năm của bạn bỗng thấp hẳn.', 'neutral'); rep(l, -5); stress(l, 8); } }
    ]
  });
  T('cs_quay_roi', function (l, a) { return office(l) && a >= 20 && a <= 45; }, 0.006, 10, 1);

  // ===================================================================
  // 2. HÀNG XÓM, CHUNG CƯ, PHÒNG TRỌ
  // ===================================================================
  SC('hx_karaoke', {
    title: 'Hàng xóm hát karaoke',
    valid: function (l) { return l.indep && isVN(l) && !l.abroad; },
    text: 'Nhà bên cạnh mua dàn loa kẹo kéo, tối nào cũng hát karaoke đến gần nửa đêm. Con nhỏ khóc, người già mất ngủ, bạn sáng ra đi làm với hai mắt thâm quầng.',
    opts: [
      { k: 'sang', l: 'Sang nói chuyện nhẹ nhàng', ai: { w: 1.1, soc: 1 }, run: function (l, r, log) { if (ch(r, 0.55)) log('Bạn sang xin hàng xóm vặn nhỏ sau 10 giờ tối. Họ gãi đầu xin lỗi, còn mời bạn bữa sau sang hát cùng.', 'good'); else { log('Hàng xóm gắt: "Nhà tôi hát nhà tôi!" Hai nhà gặp nhau không chào.', 'bad'); stress(l, 5); } } },
      { k: 'bao', l: 'Báo tổ trưởng dân phố / công an phường', ai: { w: 0.7 }, run: function (l, r, log) { log('Công an phường xuống nhắc nhở, nhà bên bị phạt vì gây ồn ào sau 22 giờ. Tiếng hát tắt hẳn, nhưng ánh mắt hàng xóm thì lạnh đi.', 'neutral'); } },
      { k: 'chiu', l: 'Mua nút bịt tai, chịu đựng', ai: { w: 0.6 }, run: function (l, r, log) { log('Bạn mua nút bịt tai và tập ngủ trong tiếng "Duyên phận". Sau vài tháng, bạn thuộc lòng cả danh sách bài của nhà bên.', 'neutral'); fx(l, { hea: -1 }); stress(l, 4); } }
    ]
  });
  T('hx_karaoke', function (l, a) { return l.indep && isVN(l) && !l.abroad && a >= 20; }, 0.012, 8, 1);
  SC('hx_ranh_gioi', {
    title: 'Tranh chấp ranh giới đất',
    valid: function (l) { return l.ownHouse && !l.urban; },
    text: 'Nhà hàng xóm xây lại tường rào, lấn sang đất nhà bạn gần nửa mét. Họ khăng khăng sổ đỏ nhà họ ghi như thế.',
    opts: [
      { k: 'do_dac', l: 'Mời cán bộ địa chính đo đạc lại', h: function (l) { return 'Phí đo đạc khoảng ' + mo(l, V(l, 3)); }, ai: { w: 1, smart: 1 }, run: function (l, r, log) { cash(l, -V(l, 3), 'Phí đo đạc địa chính'); if (ch(r, 0.65)) log('Địa chính đo lại, đúng là hàng xóm lấn đất. Họ phải lùi tường, hai nhà từ đó chỉ chào nhau qua loa.', 'neutral'); else log('Đo đạc cho thấy mốc giới cũ không rõ ràng. Hai bên đành chia đôi phần tranh chấp.', 'neutral'); } },
      { k: 'nhuong', l: 'Nhường, "bán anh em xa mua láng giềng gần"', ai: { w: 0.8, moral: 0.6 }, run: function (l, r, log) { log('Bạn bỏ qua phần đất nhỏ. Hàng xóm áy náy, Tết năm ấy mang sang biếu cặp bánh chưng.', 'neutral'); fx(l, { karma: 2 }); } },
      { k: 'kien', l: 'Làm đơn ra xã, kiện đến cùng', ai: { w: 0.4, risk: 1 }, run: function (l, r, log) { cash(l, -V(l, 10), 'Chi phí khiếu nại tranh chấp đất'); log('Đơn từ qua lại hai năm trời, hòa giải ở xã rồi lên huyện. Cuối cùng bạn thắng, nhưng hai nhà thành thù.', 'neutral'); stress(l, 12); } }
    ]
  });
  T('hx_ranh_gioi', function (l, a) { return l.ownHouse && !l.urban && isVN(l) && a >= 28; }, 0.012, 10, 1);
  SC('hx_cho_tha_rong', {
    title: 'Chó thả rông',
    valid: function (l) { return l.indep; },
    text: 'Con chó to nhà cuối ngõ không rọ mõm, sáng nào cũng lao ra sủa người đi đường. Hôm qua nó cắn một đứa trẻ trong xóm.',
    opts: [
      { k: 'noi', l: 'Cùng hàng xóm sang yêu cầu xích chó', ai: { w: 1.1, soc: 1 }, run: function (l, r, log) { log('Cả xóm cùng sang. Chủ nhà làm lồng, từ đó ra ngõ không còn phải cầm gậy.', 'good'); } },
      { k: 'bao', l: 'Báo chính quyền địa phương', ai: { w: 0.8 }, run: function (l, r, log) { log('Chủ chó bị nhắc nhở và phạt vì thả rông chó không rọ mõm. Họ cạch mặt bạn, nhưng lũ trẻ trong xóm được đi chơi yên tâm hơn.', 'neutral'); } },
      { k: 'tranh', l: 'Đi đường vòng cho lành', ai: { w: 0.6 }, run: function (l, r, log) { if (ch(r, 0.3)) { cash(l, -V(l, 1.5), 'Tiêm phòng dại sau khi bị chó cắn'); log('Một buổi tối đi vội qua ngõ, bạn bị con chó đớp vào bắp chân, phải đi tiêm phòng dại năm mũi.', 'bad'); fx(l, { hea: -2 }); } else log('Bạn đi đường vòng xa thêm năm phút mỗi ngày.', 'neutral'); } }
    ]
  });
  T('hx_cho_tha_rong', function (l, a) { return l.indep && a >= 18; }, 0.006, 10, 1);
  SC('hx_chung_cu', {
    title: 'Họp cư dân chung cư',
    prep: function (l, r) { return { why: pick(r, ['phí quản lý tăng gấp đôi mà thang máy vẫn hỏng', 'quỹ bảo trì 2% bị chủ đầu tư "giữ hộ" mãi không bàn giao', 'tầng hầm thiếu chỗ đỗ xe, người đến trước chiếm cả hai ô', 'nhà tầng trên sửa nhà, thấm nước xuống trần nhà bạn']) }; },
    valid: function (l) { return l.ownHouse && l.urban; },
    text: function (l, d) { return 'Nhóm chat cư dân sôi sục vì ' + d.why + '. Tối nay có buổi họp cư dân, ai cũng muốn lên tiếng.'; },
    opts: [
      { k: 'dung_dau', l: 'Đứng ra đại diện cư dân', ai: { w: 0.6, soc: 1, amb: 1 }, run: function (l, r, log) { if (ch(r, 0.55)) { log('Bạn thay mặt cư dân làm việc với ban quản lý, có văn bản, có thời hạn xử lý. Cả tòa nhà biết mặt, gặp ở thang máy ai cũng chào.', 'good'); fx(l, { soc: 4 }); } else { log('Bạn đứng ra đại diện, rồi thành mục tiêu chỉ trích của cả hai phía. Nhóm chat cư dân thành chiến trường, bạn tắt thông báo.', 'bad'); stress(l, 8); } } },
      { k: 'ky', l: 'Ký tên chung vào đơn kiến nghị', ai: { w: 1.1 }, run: function (l, r, log) { log('Bạn ký vào đơn kiến nghị cùng hơn trăm hộ. Ba tháng sau mọi chuyện được giải quyết một nửa.', 'neutral'); } },
      { k: 'ke', l: 'Tắt thông báo nhóm, sống yên ổn', ai: { w: 0.7 }, run: function (l, r, log) { log('Bạn tắt thông báo nhóm chat cư dân. Thế giới yên tĩnh hẳn, chỉ thỉnh thoảng thang máy vẫn hỏng.', 'neutral'); } }
    ]
  });
  T('hx_chung_cu', function (l, a) { return l.ownHouse && l.urban && a >= 25; }, 0.012, 6, 2);
  SC('tro_ban_cung_phong', {
    title: 'Bạn cùng phòng trọ',
    prep: function (l, r) { return { n: name(l, r, l.sex), v: V(l, pick(r, [1.2, 2, 3])) }; },
    valid: function (l) { return !l.ownHouse && l.age >= 17 && l.age <= 30 && (l.cityStudent || l.movedTo || l.indep); },
    text: function (l, d) { return d.n + ', bạn ở ghép cùng phòng, ba tháng nay "quên" góp tiền điện nước, tổng cộng ' + mo(l, d.v) + '. Hôm nay chủ trọ đến đòi, nhìn thẳng vào bạn.'; },
    opts: [
      { k: 'tra', l: 'Trả trước, đòi sau', ai: { w: 0.8 }, run: function (l, r, log, d) { cash(l, -d.v, 'Trả thay tiền điện nước phòng trọ'); if (ch(r, 0.5)) { cash(l, d.v, 'Bạn cùng phòng trả tiền điện nước'); log(d.n + ' đi làm thêm có lương, trả đủ, còn mua trà sữa xin lỗi.', 'good'); } else log(d.n + ' dọn đi lúc nửa đêm, để lại cái quạt hỏng và khoản nợ ' + mo(l, d.v) + '.', 'bad'); } },
      { k: 'noi', l: 'Nói thẳng, chia rõ từng khoản', ai: { w: 1.1, smart: 1 }, run: function (l, r, log, d) { log('Bạn lập bảng chia tiền, dán lên cửa tủ lạnh. ' + d.n + ' ngượng, từ đó góp đúng hạn, dù hai người không còn thân như trước.', 'neutral'); } },
      { k: 'chuyen', l: 'Tìm phòng khác ở một mình', ai: { w: 0.5 }, run: function (l, r, log, d) { cash(l, -V(l, 2), 'Tiền cọc phòng trọ mới'); log('Bạn dọn ra ở một mình. Đắt hơn, chật hơn, nhưng không còn phải đếm từng số điện.', 'neutral'); } }
    ]
  });
  T('tro_ban_cung_phong', function (l, a) { return !l.ownHouse && a >= 18 && a <= 30 && (!!l.cityStudent || !!l.movedTo); }, 0.04, 4, 1);

  // ===================================================================
  // 3. MẠNG XÃ HỘI
  // ===================================================================
  SC('mxh_boc_phot', {
    title: 'Bị "bóc phốt"',
    prep: function (l, r) { return { why: pick(r, ['bán hàng online giao chậm', 'một câu bình luận cũ bị cắt ghép', 'chuyện chia tay bị kể một chiều', 'tranh cãi với shipper bị quay lén']) }; },
    valid: function (l) { return l.age >= 16; },
    text: function (l, d) { return 'Một bài "bóc phốt" về bạn chuyện ' + d.why + ' bất ngờ lên xu hướng trong hội nhóm, kèm ảnh và tên thật. Hàng trăm bình luận, có cả người quen.'; },
    opts: [
      { k: 'giai_thich', l: 'Đăng bài giải thích có bằng chứng', ai: { w: 1, smart: 1 }, run: function (l, r, log) { if (ch(r, 0.55)) { log('Bài giải thích đủ tin nhắn, hóa đơn khiến dư luận đổi chiều. Người đăng bài phải gỡ và xin lỗi.', 'good'); fx(l, { hap: 2 }); } else { log('Càng giải thích càng bị "đào" thêm. Bạn khóa trang cá nhân một thời gian.', 'bad'); stress(l, 10); fx(l, { soc: -3 }); } } },
      { k: 'im', l: 'Im lặng chờ bão qua', ai: { w: 0.9 }, run: function (l, r, log) { log('Bạn im lặng, khóa bình luận. Một tuần sau mạng xã hội đã có "phốt" mới, không ai còn nhớ bạn.', 'neutral'); stress(l, 5); } },
      { k: 'kien', l: 'Nhờ luật sư gửi yêu cầu gỡ bài vì vu khống', h: function (l) { return 'Phí luật sư khoảng ' + mo(l, V(l, 8)); }, ai: { w: 0.4, risk: 0.5 }, run: function (l, r, log) { cash(l, -V(l, 8), 'Phí luật sư yêu cầu gỡ bài vu khống'); log('Văn bản của luật sư khiến người đăng bài phải gỡ bài, đăng đính chính. Bạn tốn tiền nhưng lấy lại được danh dự.', 'neutral'); } }
    ]
  });
  T('mxh_boc_phot', function (l, a) { return a >= 16 && a <= 60; }, 0.007, 10, 1);
  E.EVENTS.push({ c: function (l, a) { return free(l) && a >= 15 && a <= 65; }, p: 0.008, cd: 10, run: function (l, a, r, log) {
    var t = pick(r, ['Bức ảnh bạn chụp bà cụ bán rau dưới mưa bỗng có hàng chục nghìn lượt chia sẻ. Có người tìm đến mua hết gánh rau của bà.', 'Một video bạn quay cảnh chú chó đợi chủ trước cổng bệnh viện lan truyền khắp mạng, báo chí xin đăng lại.', 'Bài bạn viết về mẹ được hàng nghìn người chia sẻ, nhiều người nhắn tin: "Đọc xong tôi gọi điện về cho mẹ ngay."']);
    log(t, 'good'); fx(l, { hap: 4, soc: 3 }); l.fame = (l.fame || 0) + 500;
  } });
  SC('mxh_hoi_nhom', {
    title: 'Cãi nhau trong hội nhóm',
    prep: function (l, r) { return { topic: pick(r, ['nên cho trẻ học thêm hay không', 'miền nào ăn ngon nhất', 'mua nhà hay thuê nhà', 'đội bóng nào đá xấu', 'đẻ thường hay đẻ mổ']) }; },
    valid: function (l) { return l.age >= 18; },
    text: function (l, d) { return 'Một bình luận của bạn về chuyện ' + d.topic + ' trong hội nhóm vài trăm nghìn thành viên bị đem ra "ném đá". Tin nhắn chửi bới đổ về hộp thư.'; },
    opts: [
      { k: 'cai', l: 'Cãi tay đôi đến cùng', ai: { w: 0.5, risk: 1 }, run: function (l, r, log) { log('Bạn cãi đến hai giờ sáng, không ai thay đổi quan điểm. Sáng ra bạn tự hỏi mình đã làm gì với buổi tối ấy.', 'neutral'); stress(l, 6); fx(l, { hea: -1 }); } },
      { k: 'roi', l: 'Rời nhóm, chặn người quấy rối', ai: { w: 1.1, smart: 1 }, run: function (l, r, log) { log('Bạn rời nhóm, chặn vài tài khoản. Bảng tin bỗng nhẹ nhàng hẳn.', 'neutral'); stress(l, -2); } }
    ]
  });
  T('mxh_hoi_nhom', function (l, a) { return a >= 18 && a <= 65; }, 0.008, 8, 1);

  // ===================================================================
  // 4. TRƯỜNG HỌC
  // ===================================================================
  SC('th_tay_chay', {
    title: 'Bị nhóm bạn tẩy chay',
    prep: function (l, r) { return { n: name(l, r, l.sex) }; },
    valid: function (l) { return !!l.school && l.age >= 10 && l.age <= 17; },
    text: function (l, d) { return 'Nhóm bạn thân trong lớp lập nhóm chat mới, không có bạn. Đầu têu là ' + d.n + ', người bạn vẫn coi là thân nhất. Giờ ra chơi, cả nhóm đi qua như không thấy bạn.'; },
    opts: [
      { k: 'hoi', l: 'Hỏi thẳng ' + 'xem mình sai ở đâu', ai: { w: 0.9, soc: 1 }, run: function (l, r, log, d) { if (ch(r, 0.5)) { log('Hóa ra chỉ là hiểu lầm vì một câu nói bị truyền sai. Hai đứa ôm nhau khóc ở cầu thang.', 'good'); fx(l, { hap: 3 }); } else { log(d.n + ' nhún vai: "Tại cậu chán thôi." Câu nói ấy đau hơn bạn tưởng.', 'bad'); fx(l, { hap: -5 }); stress(l, 8); } } },
      { k: 'ban_moi', l: 'Tìm nhóm bạn mới', ai: { w: 1 }, run: function (l, r, log) { log('Bạn ngồi cùng bàn với mấy bạn hay đọc sách ở thư viện. Họ ít nói nhưng tử tế.', 'neutral'); fx(l, { soc: 1 }); } },
      { k: 'ke', l: 'Kể với bố mẹ / cô chủ nhiệm', ai: { w: 0.6 }, run: function (l, r, log) { log('Cô chủ nhiệm khéo léo xếp lại chỗ ngồi, tổ chức hoạt động nhóm. Mọi chuyện dần dịu đi.', 'neutral'); } }
    ]
  });
  T('th_tay_chay', function (l, a) { return !!l.school && a >= 10 && a <= 17; }, 0.03, 4, 1);
  SC('th_nghi_gian_lan', {
    title: 'Bị nghi gian lận',
    valid: function (l) { return !!l.school && l.age >= 12 && l.age <= 22; },
    text: 'Giờ kiểm tra, giám thị nhặt được tờ phao dưới chân bàn bạn. Không phải của bạn, nhưng cả phòng thi quay lại nhìn.',
    opts: [
      { k: 'phan_doi', l: 'Bình tĩnh đề nghị kiểm tra chữ viết, camera', ai: { w: 1.1, smart: 1 }, run: function (l, r, log) { if (ch(r, 0.7)) log('Đối chiếu chữ viết và camera, nhà trường xác định tờ phao của bạn ngồi bàn trên. Thầy cô xin lỗi bạn trước lớp.', 'good'); else { log('Không đủ căn cứ, bài của bạn bị trừ điểm "vì nghi vấn". Bạn uất ức cả học kỳ.', 'bad'); fx(l, { hap: -4 }); stress(l, 6); } } },
      { k: 'khoc', l: 'Hoảng quá, bật khóc', ai: { w: 0.6 }, run: function (l, r, log) { log('Bạn bật khóc, không nói được gì. Cô giám thị thương tình cho làm tiếp, nhưng bài thi hôm ấy lộn xộn hẳn.', 'neutral'); fx(l, { kno: -1 }); } }
    ]
  });
  T('th_nghi_gian_lan', function (l, a) { return !!l.school && a >= 12 && a <= 22; }, 0.012, 5, 1);

  // ===================================================================
  // 5. BẠN BÈ
  // ===================================================================
  SC('bb_hop_lop', {
    title: 'Họp lớp',
    prep: function (l, r) { return { n: name(l, r) }; },
    valid: function (l) { return l.age >= 28 && l.indep; },
    text: function (l, d) { return 'Họp lớp sau mười mấy năm. ' + d.n + ' đi xe sang, đeo đồng hồ đắt tiền, hỏi từng người "giờ làm gì, lương bao nhiêu, có nhà chưa". Có bạn ngồi im cả buổi.'; },
    opts: [
      { k: 'vui', l: 'Mặc kệ, cứ vui với những người bạn cũ', ai: { w: 1.2 }, run: function (l, r, log, d) { log('Bạn ngồi cạnh mấy đứa bạn cùng bàn ngày xưa, kể chuyện thầy cô, cười chảy nước mắt. Ai giàu ai nghèo, tối nay không quan trọng.', 'good'); fx(l, { hap: 3, soc: 3 }); } },
      { k: 'so_bi', l: 'Cũng "nổ" một chút cho bằng bạn bằng bè', ai: { w: 0.4, risk: 0.6 }, run: function (l, r, log, d) { cash(l, -V(l, 3), 'Bao cả lớp đi tăng hai'); log('Bạn khoe thăng chức, còn bao cả lớp đi tăng hai. Về nhà nhìn hóa đơn, bạn thấy mình hơi trẻ con.', 'neutral'); } },
      { k: 'thoi', l: 'Lần sau không đi nữa', ai: { w: 0.5 }, run: function (l, r, log, d) { log('Bạn về sớm. Từ đó nhóm lớp nhắn rủ họp, bạn chỉ thả tim.', 'neutral'); fx(l, { soc: -1 }); } }
    ]
  });
  T('bb_hop_lop', function (l, a) { return l.indep && a >= 28 && a <= 60; }, 0.012, 8, 1);
  SC('bb_quy_du_lich', {
    title: 'Quỹ du lịch của hội bạn',
    prep: function (l, r) { return { n: name(l, r), v: V(l, pick(r, [2, 3, 5])) }; },
    valid: function (l) { return l.indep && l.age >= 20; },
    text: function (l, d) { return 'Hội bạn thân góp quỹ đi du lịch cả năm, mỗi người ' + mo(l, d.v) + '. Gần đến ngày đi, ' + d.n + ', người giữ quỹ, nói "đầu tư tạm" vào tiền ảo và mất sạch.'; },
    opts: [
      { k: 'doi', l: 'Yêu cầu trả lại đủ, có hẹn ngày', ai: { w: 1, smart: 1 }, run: function (l, r, log, d) { cash(l, -d.v, 'Góp quỹ du lịch hội bạn'); if (ch(r, 0.55)) { cash(l, d.v, 'Bạn trả lại tiền quỹ du lịch'); log(d.n + ' bán xe máy, trả dần đủ cho cả hội. Chuyến đi hoãn sang năm sau, tình bạn vẫn còn.', 'neutral'); } else { log(d.n + ' hứa mãi rồi lặn mất. Hội bạn tan rã, nhóm chat im lìm.', 'bad'); fx(l, { soc: -3, hap: -3 }); } } },
      { k: 'bo_qua', l: 'Bỏ qua, coi như mất tiền mua bài học', ai: { w: 0.7, moral: 0.5 }, run: function (l, r, log, d) { cash(l, -d.v, 'Mất tiền quỹ du lịch hội bạn'); log('Bạn bỏ qua cho ' + d.n + '. Mất ' + mo(l, d.v) + ', nhưng từ đó bạn không bao giờ góp quỹ mà không có sổ sách rõ ràng.', 'neutral'); } }
    ]
  });
  T('bb_quy_du_lich', function (l, a) { return l.indep && a >= 20 && a <= 45; }, 0.01, 10, 1);

  // ===================================================================
  // 6. ĐƯỜNG PHỐ
  // ===================================================================
  SC('dp_va_quet', {
    title: 'Va quẹt trên đường',
    prep: function (l, r) { return { v: V(l, pick(r, [1, 2, 5])), fault: r() < 0.5 }; },
    valid: function (l) { return !!l.veh && l.age >= 18; },
    text: function (l, d) { return 'Giờ tan tầm, một chiếc xe ' + (d.fault ? 'bạn lỡ va vào' : 'vượt ẩu quẹt vào xe bạn') + '. Người kia xuống xe, lớn tiếng đòi bồi thường ' + mo(l, d.v) + ', người xem tụ lại kín đường.'; },
    opts: [
      { k: 'thuong_luong', l: 'Bình tĩnh thương lượng, chụp ảnh hiện trường', ai: { w: 1.1, smart: 1 }, run: function (l, r, log, d) { if (d.fault) { cash(l, -d.v * 0.6, 'Bồi thường va quẹt xe'); log('Bạn xin lỗi, chụp ảnh, thương lượng xuống còn ' + mo(l, d.v * 0.6) + '. Hai bên bắt tay rồi đi.', 'neutral'); } else log('Bạn chỉ vào camera hành trình. Người kia im bặt, lẩm bẩm vài câu rồi phóng đi.', 'neutral'); } },
      { k: 'goi_csgt', l: 'Gọi cảnh sát giao thông', ai: { w: 0.7 }, run: function (l, r, log, d) { log('Cảnh sát giao thông đến lập biên bản, xác định lỗi rõ ràng. Mất nửa buổi chiều, nhưng không ai bắt nạt được ai.', 'neutral'); if (d.fault) cash(l, -d.v * 0.8, 'Bồi thường va quẹt theo biên bản'); } },
      { k: 'tra_cho_xong', l: 'Trả tiền cho xong chuyện', ai: { w: 0.5 }, run: function (l, r, log, d) { cash(l, -d.v, 'Trả tiền cho xong vụ va quẹt'); log('Bạn rút ví trả ' + mo(l, d.v) + ' cho xong. ' + (d.fault ? 'Coi như bài học lái xe cẩn thận.' : 'Về nhà nghĩ lại vẫn thấy ấm ức.'), 'neutral'); stress(l, 3); } }
    ]
  });
  T('dp_va_quet', function (l, a) { return !!l.veh && a >= 18 && a <= 75; }, 0.01, 6, 2);
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
