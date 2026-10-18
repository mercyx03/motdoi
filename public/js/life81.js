/* Một Đời — v6.4.0: những cuộc đời không màu hồng
   · một phần nhỏ các cuộc đời (nhiều hơn ở nhà nghèo, vùng quê) gặp "vận đen": rớt trường năng khiếu, bỏ học đi làm công nhân,
     xin việc mãi không được, lên thành phố lập nghiệp, tăng ca triền miên, ngoài 35 bị cho nghỉ, bị nợ lương, tai nạn lao động,
     vay nợ chữa bệnh cho người thân, về già không lương hưu…
   · không báo trước là "vận đen" — chỉ là những chuyện khó khăn đến thường hơn; mỗi chuyện chỉ gặp một, hai lần trong đời */
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
  function pw(l) { var f = l.fam || {}, m = !f.noMom && f.mAlive, b = !f.noDad && f.fAlive; return m && b ? 'bố mẹ' : m ? 'mẹ' : b ? 'bố' : ''; }
  function jid(l) { return l.job ? E.resolveJob(l.job.id) : ''; }
  function worker(l) { return /^(cong_nhan|phu_ho|tho_may|tho_han|tho_dien|tho_moc|tho_mo|tho_sua_xe|bao_ve|giup_viec|phuc_vu)$/.test(jid(l)); }
  function poor(l) { return l.indep ? (l.income || 0) < l.base * 1.1 && l.money < l.base * 2 : (l.fam && l.fam.q <= 2); }
  function hard(l) { return l.flags.hardLot === true; }
  function P(base, k) { return function (l) { return base * (hard(l) ? (k || 4) : 1); }; }
  function T(id, when, p, cd, max) { E.TRIG.push({ id: id, when: function (l, a) { return free(l) && isVN(l) && when(l, a); }, p: p, cd: cd || 4, max: max || 1 }); }
  function city(l, r) { return U.pick(r, ['Đà Nẵng', 'TP. Hồ Chí Minh', 'Bình Dương', 'Hà Nội', 'Bắc Ninh']); }
  function moveTo(l, c) { l.urban = true; l.movedTo = c; l.place = c; l.city = c; }
  function work(l, r, log, id) { if (E.startJob) E.startJob(l, id, r, log); }

  // ai sẽ gặp "vận đen": nhà càng nghèo, ở quê càng dễ gặp (người chơi không được báo)
  E.HOOKS.year.unshift(function (l, r, log, a) {
    if (l.flags.hardLot != null || a < 10 || !isVN(l)) return;
    var f = l.fam || {}; if (f.elite) { l.flags.hardLot = false; return; }
    var p = [0.3, 0.3, 0.2, 0.1, 0.05, 0.02][f.q || 3] * (l.urban ? 0.8 : 1.3);
    l.flags.hardLot = r() < p;
  });

  // 1. Trường năng khiếu
  SC('vd_nang_khieu', {
    title: 'Trường năng khiếu của tỉnh', valid: function (l) { return !!l.school && l.age >= 13 && l.age <= 16 && !l.flags.vdNk; },
    text: function (l) { return 'Thầy thể dục giới thiệu bạn thi vào trường năng khiếu thể thao của tỉnh: ở nội trú, tập luyện cả ngày, học văn hóa buổi tối. ' + (l.fam && l.fam.q <= 2 ? 'Nhà nghèo, ' + (pw(l) || 'gia đình') + ' mong bạn có một con đường khác ruộng đồng.' : U.cap(pw(l) || 'gia đình') + ' còn đắn đo.'); },
    opts: [
      { k: 'di', l: 'Vào trường năng khiếu, theo đuổi thể thao', ai: { w: 0.8, amb: 1.2 }, run: function (l, r, log) { l.flags.vdNk = l.age; log('Bạn khăn gói vào trường năng khiếu của tỉnh, sáng tập chiều tập, tối học văn hóa.', 'neutral'); H.sched(l, 'vd_nang_khieu_kq', 2); } },
      { k: 'o', l: 'Ở lại học văn hóa như bình thường', ai: { w: 1 }, run: function (l, r, log) { l.flags.vdNk = -1; log('Bạn ở lại trường cũ, học văn hóa như các bạn.', 'neutral'); } }
    ]
  });
  T('vd_nang_khieu', function (l, a) { return a >= 13 && a <= 15 && !!l.school && !l.flags.vdNk && (l.talent === 'thể thao' || (l.st.hea >= 80 && !l.urban)); }, P(0.12, 2), 3, 1);
  SC('vd_nang_khieu_kq', {
    title: 'Sau hai năm ở trường năng khiếu', valid: function (l) { return l.flags.vdNk > 0 && l.alive; },
    prep: function (l, r) { var win = r() < (hard(l) ? 0.12 : 0.35) + (l.talent === 'thể thao' ? 0.15 : 0); l.flags.vdNkOk = win; return { win: win }; },
    text: function (l, d) { return d.win ? 'Bạn được giữ lại đội tuyển trẻ của tỉnh, có trợ cấp tập luyện.' : U.pick(H.rf(l), ['Chấn thương dây chằng đầu gối, bạn không được giữ lại đội. Hai năm học văn hóa buổi tối, kiến thức hổng một mảng lớn.', 'Đợt sàng lọc cuối năm, bạn không lọt vào danh sách giữ lại. Rời trường năng khiếu, chương trình văn hóa đã bỏ quá xa.']) + (d.win ? '' : ' Giờ tính sao?'); },
    opts: [
      { k: 'tiep', l: 'Tiếp tục tập luyện ở đội tuyển', req: function (l, d) { return d.win; }, ai: { w: 1 }, run: function (l, r, log) { if (l.talent === 'thể thao') l.skill = Math.min(100, (l.skill || 30) + 10); fx(l, { hap: 6, hea: 2 }); log('Bạn được giữ lại đội tuyển trẻ, ngày ngày tập luyện chờ cơ hội thi đấu.', 'good'); } },
      { k: 'cong_nhan', l: 'Nghỉ học, đi làm công nhân luôn', req: function (l, d) { return !d.win; }, ai: { w: 1.2 }, run: function (l, r, log) { l.school = null; l.schoolEnd = null; l.edu = Math.max(l.edu || 0, 2); l.indep = true; work(l, r, log, 'cong_nhan'); fx(l, { hap: -6 }); log('Bạn bỏ học, theo người quen vào khu công nghiệp làm công nhân. Năm ấy bạn mới ' + l.age + ' tuổi.', 'bad'); H.mem(l, 'Ngày rời trường năng khiếu, cất đôi giày tập vào gầm giường.', 4); } },
      { k: 'hoc_lai', l: 'Xin học lại bổ túc văn hóa', req: function (l, d) { return !d.win; }, ai: { w: 0.8, smart: 1.2 }, run: function (l, r, log) { l.school = 'upper'; l.schoolEnd = l.age + 2; fx(l, { kno: 2, hap: -2 }); log('Bạn xin học bổ túc văn hóa, học cùng lớp với những bạn nhỏ hơn mình hai tuổi.', 'neutral'); } },
      { k: 'phu', l: 'Về nhà phụ ' + 'gia đình làm ruộng', req: function (l, d) { return !d.win; }, ai: { w: 0.6 }, run: function (l, r, log) { l.school = null; l.schoolEnd = null; l.edu = Math.max(l.edu || 0, 2); work(l, r, log, 'phu_giup'); fx(l, { hap: -5 }); log('Bạn về quê phụ gia đình làm ruộng, chiều chiều nhìn bạn bè đạp xe đi học.', 'bad'); } }
    ]
  });

  // 2. Xin việc mãi không được
  SC('vd_xin_viec', {
    title: 'Xin việc mãi không được', valid: function (l) { return !l.job && !l.school && l.age >= 18 && l.age <= 35 && !l.retired; },
    text: function (l) { return 'Mấy tháng nay bạn nộp hồ sơ khắp nơi ở ' + (l.urban ? 'thành phố' : 'huyện') + ', chỗ thì chê không có bằng cấp, chỗ thì bảo "khi nào cần sẽ gọi". Tiền trong túi cạn dần.'; },
    opts: [
      { k: 'ra_tp', l: 'Khăn gói lên thành phố lập nghiệp', req: function (l) { return !l.urban || !l.movedTo; }, h: function (l) { return 'Tiền xe, tiền trọ tháng đầu khoảng ' + mo(l, V(l, 4)); }, ai: { w: 1.1, amb: 1.2 }, run: function (l, r, log) { var c = city(l, r); H.cash(l, -V(l, 4), 'Lên ' + c + ' lập nghiệp'); moveTo(l, c); l.indep = true; if (r() < 0.65) { var j = U.pick(r, ['cong_nhan', 'phuc_vu', 'shipper', 'bao_ve']); work(l, r, log, j); log('Bạn bắt xe khách lên ' + c + ', thuê phòng trọ 12 m², mấy tuần sau xin được việc ' + (E.jobTitle && l.job ? E.jobTitle(l) : 'làm thuê') + '.', 'neutral'); } else { fx(l, { hap: -6 }); stress(l, 8); log('Bạn lên ' + c + ' lập nghiệp, nhưng mấy tháng vẫn chưa xin được việc ổn định, sống nhờ những ca làm thời vụ.', 'bad'); } H.mem(l, 'Chuyến xe khách đêm lên ' + c + ' với một ba lô quần áo.', 3); } },
      { k: 'kcn', l: 'Vào khu công nghiệp làm công nhân', ai: { w: 1 }, run: function (l, r, log) { l.indep = true; work(l, r, log, 'cong_nhan'); log('Bạn xin vào làm công nhân ở khu công nghiệp, lương cơ bản cộng tăng ca.', 'neutral'); } },
      { k: 'xkld', l: 'Đăng ký đi xuất khẩu lao động', req: function () { return !!E.DEC.xkld; }, ai: { w: 0.6, risk: 1 }, run: function (l, r) { l.pending.unshift(E.DEC.xkld.make(l, r, true)); } },
      { k: 'cho', l: 'Ở nhà chờ thêm', ai: { w: 0.4 }, run: function (l, r, log) { fx(l, { hap: -4 }); stress(l, 5); log('Bạn ở nhà chờ, ngày ngày lướt mạng tìm việc, nghe hàng xóm hỏi "bao giờ đi làm?"', 'bad'); } }
    ]
  });
  T('vd_xin_viec', function (l, a) { return !l.job && !l.school && a >= 18 && a <= 35 && !l.retired && (l.edu || 0) <= 3; }, P(0.15, 2.5), 3, 2);

  // 3. Đời công nhân
  SC('vd_tang_ca', {
    title: 'Tăng ca mùa cao điểm', valid: worker,
    text: 'Tháng cao điểm đơn hàng, xưởng tăng ca đến 10 giờ đêm, cả tháng không có ngày nghỉ. Lương cơ bản không đủ sống, ai cũng trông vào tiền tăng ca.',
    opts: [
      { k: 'het', l: 'Tăng ca hết mức', h: function (l) { return 'Thêm ~' + mo(l, V(l, 4)) + '/tháng, rất mệt'; }, ai: { w: 1, amb: 1 }, run: function (l, r, log) { H.cash(l, V(l, 12), 'Tiền tăng ca'); fx(l, { hea: -4, hap: -2 }); stress(l, 8); log(U.pick(r, ['Ba tháng tăng ca liên tục, về phòng trọ là ngủ gục, gầy rộc đi mấy cân.', 'Tăng ca đến khuya, sáng 6 giờ lại vào ca, tay chân lúc nào cũng rã rời.']), 'neutral'); } },
      { k: 'vua', l: 'Tăng ca vừa sức', ai: { w: 1.1 }, run: function (l, r, log) { H.cash(l, V(l, 5), 'Tiền tăng ca'); fx(l, { hea: -1 }); log('Bạn tăng ca vừa phải, cuối tuần vẫn giữ một ngày nghỉ.', 'neutral'); } },
      { k: 'khong', l: 'Không tăng ca, giữ sức khỏe', ai: { w: 0.5 }, run: function (l, r, log) { if (l.job) l.job.rep = U.clamp((l.job.rep || 50) - 3, 0, 100); log('Bạn không tăng ca. Tổ trưởng không vui, tháng đó lương chỉ đủ tiền trọ và tiền ăn.', 'neutral'); } }
    ]
  });
  T('vd_tang_ca', worker, P(0.12, 2), 3, 2);
  SC('vd_qua_35', {
    title: 'Ngoài 35 tuổi', valid: function (l) { return jid(l) === 'cong_nhan' && l.age >= 35; },
    text: 'Nhà máy cắt giảm, ưu tiên giữ công nhân trẻ. Bạn đã ngoài 35, tên nằm trong danh sách cho nghỉ. Đi xin việc ở xưởng khác, chỗ nào cũng tuyển dưới 35 tuổi.',
    opts: [
      { k: 'xe_om', l: 'Chạy xe ôm công nghệ', req: function (l) { return !!l.veh; }, ai: { w: 1 }, run: function (l, r, log) { work(l, r, log, 'tx_cn'); log('Bạn đăng ký chạy xe công nghệ, nắng mưa ngoài đường từ sáng đến tối.', 'neutral'); fx(l, { hap: -3 }); } },
      { k: 'ban', l: 'Bán hàng rong, buôn bán nhỏ', ai: { w: 0.9 }, run: function (l, r, log) { work(l, r, log, 'ban_rong'); log('Bạn mua chiếc xe đẩy cũ, sáng bán xôi, chiều bán nước mía.', 'neutral'); fx(l, { hap: -3 }); } },
      { k: 've_que', l: 'Về quê làm ruộng', ai: { w: 0.7 }, run: function (l, r, log) { l.urban = false; l.movedTo = null; work(l, r, log, 'nong'); log('Bạn khăn gói về quê sau bao năm ở trọ, ra đồng làm ruộng như ' + (pw(l) || 'người trong làng') + '.', 'neutral'); } },
      { k: 'tim', l: 'Tìm xưởng nhỏ khác chịu nhận', ai: { w: 0.8 }, run: function (l, r, log) { if (r() < 0.5) { work(l, r, log, 'cong_nhan'); if (l.job) l.job.rank = 0; log('Một xưởng nhỏ chịu nhận bạn, lương thấp hơn chỗ cũ, không có bảo hiểm.', 'neutral'); } else { l.job = null; l.flags.needJob = true; fx(l, { hap: -6 }); stress(l, 8); log('Hỏi khắp các xưởng, chỗ nào cũng lắc đầu. Bạn ở nhà, sống bằng chút tiền trợ cấp thất nghiệp.', 'bad'); } } }
    ]
  });
  T('vd_qua_35', function (l, a) { return jid(l) === 'cong_nhan' && a >= 35 && a <= 50; }, P(0.08, 3), 5, 1);
  E.DEC.vd_qua_35 && (function () { var ap = E.DEC.vd_qua_35.apply; E.DEC.vd_qua_35.apply = function (l) { if (jid(l) === 'cong_nhan') { l.lastJob = l.job; l.job = null; } return ap.apply(this, arguments); }; })();
  SC('vd_no_luong', {
    title: 'Chủ xưởng bỏ trốn', valid: worker,
    text: 'Sáng đi làm, cổng xưởng khóa chặt. Chủ xưởng ôm tiền bỏ trốn, nợ cả trăm công nhân hai tháng lương.',
    opts: [
      { k: 'kien_nghi', l: 'Cùng anh chị em công nhân làm đơn lên cơ quan lao động', ai: { w: 1.1 }, run: function (l, r, log) { if (r() < 0.4) { H.cash(l, V(l, 6), 'Truy lĩnh một phần tiền lương'); log('Mấy tháng sau, cơ quan chức năng phát mại máy móc, mỗi người được trả lại một phần tiền lương.', 'neutral'); } else { fx(l, { hap: -6 }); log('Đơn từ gửi đi khắp nơi, chủ xưởng vẫn chưa tìm thấy. Hai tháng lương coi như mất.', 'bad'); } l.job = null; l.flags.needJob = true; } },
      { k: 'tim', l: 'Đi tìm việc mới ngay', ai: { w: 0.9 }, run: function (l, r, log) { l.job = null; l.flags.needJob = true; fx(l, { hap: -5 }); log('Bạn chấp nhận mất hai tháng lương, sáng hôm sau đã đi xin việc ở xưởng khác.', 'bad'); } }
    ]
  });
  T('vd_no_luong', worker, P(0.03, 4), 6, 1);
  SC('vd_tai_nan_ld', {
    title: 'Tai nạn lao động', valid: worker,
    text: function (l) { return jid(l) === 'phu_ho' ? 'Giàn giáo bị sập, bạn ngã từ tầng hai xuống.' : 'Máy dập bị kẹt, bạn đưa tay vào gỡ thì máy chạy lại.'; },
    opts: [
      { k: 'vien', l: 'Đi viện, đòi chủ bồi thường theo luật', ai: { w: 1.1 }, run: function (l, r, log) { fx(l, { hea: -12, hap: -6 }); if (E.medBill) E.medBill(l, V(l, 25), 'Điều trị tai nạn lao động', log, 1); if (r() < 0.6) { H.cash(l, V(l, 20), 'Bồi thường tai nạn lao động'); log('Chủ xưởng chịu bồi thường theo luật sau nhiều lần đôi co.', 'neutral'); } else log('Chủ xưởng chỉ hỗ trợ vài triệu rồi lảng tránh, bạn không có hợp đồng nên khó đòi.', 'bad'); H.mem(l, 'Vết sẹo từ tai nạn ở xưởng năm ' + l.age + ' tuổi.', 4); } },
      { k: 'nhan', l: 'Nhận vài triệu "hỗ trợ" rồi thôi', ai: { w: 0.7 }, run: function (l, r, log) { fx(l, { hea: -14, hap: -8 }); H.cash(l, V(l, 5), 'Hỗ trợ tai nạn'); log('Bạn nhận vài triệu "hỗ trợ", tự lo phần còn lại. Bàn tay về sau cầm nắm không còn khéo như trước.', 'bad'); } }
    ]
  });
  T('vd_tai_nan_ld', worker, P(0.025, 3), 8, 1);
  SC('vd_benh_nghe', {
    title: 'Bệnh nghề nghiệp', valid: function (l) { return worker(l) && (l.job.yrs || 0) >= 8; },
    text: 'Bao năm hít bụi vải, bụi gỗ trong xưởng, bạn ho kéo dài mấy tháng không dứt. Bác sĩ nghi bệnh phổi nghề nghiệp.',
    opts: [
      { k: 'kham', l: 'Đi khám, xin đổi sang khâu ít bụi', ai: { w: 1.1 }, run: function (l, r, log) { if (E.medBill) E.medBill(l, V(l, 3), 'Khám bệnh nghề nghiệp', log, 1); fx(l, { hea: -3 }); log('Bạn được chẩn đoán viêm phổi do bụi, xin đổi sang khâu đóng gói.', 'neutral'); } },
      { k: 'chiu', l: 'Uống thuốc, làm tiếp vì cần tiền', ai: { w: 0.8 }, run: function (l, r, log) { fx(l, { hea: -8 }); log('Bạn uống thuốc rồi đi làm tiếp. Cơn ho cứ kéo dài, đêm nào cũng trằn trọc.', 'bad'); } }
    ]
  });
  T('vd_benh_nghe', function (l) { return worker(l) && (l.job.yrs || 0) >= 8; }, P(0.03, 3), 8, 1);

  // 4. Nợ nần vì người thân
  SC('vd_vay_chua_benh', {
    title: function (l) { return U.cap(pw(l) || 'người thân') + ' ốm nặng'; }, valid: function (l) { return !!pw(l) && l.indep && l.age >= 20; },
    text: function (l) { return U.cap(pw(l)) + ' nhập viện, bác sĩ nói phải mổ gấp, chi phí ngoài bảo hiểm khoảng ' + mo(l, V(l, 60)) + '. Tiền tiết kiệm của bạn không đủ.'; },
    opts: [
      { k: 'ho_hang', l: 'Vay họ hàng, anh em', ai: { w: 1.1 }, run: function (l, r, log) { if (H.addLoan) H.addLoan(l, 'family', V(l, 60)); H.cash(l, -V(l, 60), 'Viện phí cho ' + pw(l)); fx(l, { hap: -4 }); log('Bạn đi vay khắp họ hàng, mỗi nhà một ít, đủ tiền cho ' + pw(l) + ' lên bàn mổ.', 'neutral'); } },
      { k: 'nong', l: 'Vay nóng cho kịp', ai: { w: 0.5, risk: 1 }, run: function (l, r, log) { if (H.addLoan) H.addLoan(l, 'nong', V(l, 60)); H.cash(l, -V(l, 60), 'Viện phí cho ' + pw(l)); fx(l, { hap: -6 }); stress(l, 10); log('Không kịp xoay xở, bạn vay nóng. Ca mổ thành công, nhưng khoản nợ lãi ngày bắt đầu lớn dần.', 'bad'); } },
      { k: 'ban', l: 'Bán xe, bán đồ đạc có giá trị', req: function (l) { return !!l.veh; }, ai: { w: 0.8 }, run: function (l, r, log) { var v = l.vehVal || V(l, 15); l.veh = null; l.vehName = null; l.vehVal = 0; H.cash(l, v - V(l, 60), 'Bán xe lo viện phí'); fx(l, { hap: -5 }); log('Bạn bán chiếc xe, gom góp thêm để lo viện phí cho ' + pw(l) + '. Từ đó đi làm bằng xe buýt.', 'neutral'); } },
      { k: 'khong', l: 'Đưa ' + 'về điều trị ở bệnh viện tuyến dưới cho rẻ', ai: { w: 0.4 }, run: function (l, r, log) { fx(l, { hap: -8 }); log('Không đủ tiền, gia đình đưa ' + pw(l) + ' về bệnh viện tuyến dưới điều trị. Cả nhà chỉ biết cầu mong.', 'bad'); } }
    ]
  });
  T('vd_vay_chua_benh', function (l) { return !!pw(l) && l.indep && l.age >= 20 && poor(l); }, P(0.04, 3), 8, 1);
  SC('vd_hoc_phi_con', {
    title: 'Tiền học của con', valid: function (l) { return l.indep && (l.kids || []).some(function (k) { var x = l.age - k.born; return k.alive !== false && x >= 11 && x <= 17 && k.custody !== 'other'; }); },
    text: 'Đầu năm học, tiền học, tiền sách, tiền học thêm của con dồn vào một lúc. Lương tháng này đã hết từ giữa tháng.',
    opts: [
      { k: 'ca_dem', l: 'Nhận thêm việc ca đêm', ai: { w: 1 }, run: function (l, r, log) { H.cash(l, V(l, 8), 'Làm thêm ca đêm'); fx(l, { hea: -4 }); stress(l, 6); log('Bạn nhận thêm việc ca đêm, ngủ mỗi ngày bốn tiếng, đủ tiền cho con đi học.', 'neutral'); } },
      { k: 'vay', l: 'Vay mượn cho con đi học', ai: { w: 0.8 }, run: function (l, r, log) { if (H.addLoan) H.addLoan(l, 'family', V(l, 10)); log('Bạn vay người quen đóng học phí cho con, tự nhủ năm sau sẽ trả.', 'neutral'); } },
      { k: 'nghi', l: 'Cho con nghỉ học thêm, chỉ học trên lớp', ai: { w: 0.7 }, run: function (l, r, log) { log('Bạn cho con nghỉ học thêm. Con buồn mấy hôm, rồi tự học ở nhà.', 'neutral'); fx(l, { hap: -2 }); } }
    ]
  });
  T('vd_hoc_phi_con', function (l) { return l.indep && poor(l) && (l.kids || []).some(function (k) { var x = l.age - k.born; return k.alive !== false && x >= 11 && x <= 17; }); }, P(0.08, 2), 4, 2);

  // 5. Ở trọ thành phố
  SC('vd_tro', {
    title: 'Phòng trọ', valid: function (l) { return l.urban && !l.ownHouse && l.indep; },
    prep: function (l, r) { return { k: r() < 0.5 ? 'gia' : 'chay' }; },
    text: function (l, d) { return d.k === 'gia' ? 'Chủ trọ báo tăng giá phòng thêm 30%, ai không ở được thì cuối tháng dọn đi.' : 'Nửa đêm, dãy trọ bên cạnh chập điện bốc cháy. Bạn chỉ kịp ôm chiếc điện thoại chạy ra ngoài.'; },
    opts: [
      { k: 'chiu', l: function (l, d) { return d.k === 'gia' ? 'Chịu giá mới, cắt bớt chi tiêu' : 'Tá túc nhà người quen, sắm lại đồ đạc'; }, ai: { w: 1 }, run: function (l, r, log, d) { if (d.k === 'gia') { H.cash(l, -V(l, 10), 'Tiền trọ tăng'); log('Bạn chịu giá mới, bớt ăn sáng, bớt đi chơi.', 'neutral'); } else { H.cash(l, -V(l, 8), 'Sắm lại đồ đạc sau vụ cháy'); fx(l, { hap: -6 }); log('Đồ đạc cháy rụi. Bạn ở nhờ nhà người quen mấy tuần rồi sắm lại từ đầu.', 'bad'); H.mem(l, 'Đêm dãy trọ bốc cháy.', 3); } } },
      { k: 'don', l: 'Dọn ra trọ xa hơn, rẻ hơn', ai: { w: 0.9 }, run: function (l, r, log, d) { stress(l, 4); log('Bạn dọn ra một phòng trọ xa trung tâm, mỗi ngày đi làm thêm gần một tiếng.', 'neutral'); } }
    ]
  });
  T('vd_tro', function (l) { return l.urban && !l.ownHouse && l.indep && poor(l); }, P(0.06, 2.5), 5, 2);

  // 6. Bị lừa, bị quỵt
  SC('vd_co_xkld', {
    title: 'Môi giới đi làm nước ngoài', valid: function (l) { return l.age >= 19 && l.age <= 38 && !l.abroad && poor(l); },
    text: 'Một "cò" giới thiệu đơn hàng đi làm ở nước ngoài lương cao, chỉ cần đóng trước phí môi giới, làm hồ sơ trong ba tháng.',
    opts: [
      { k: 'dong', l: 'Vay tiền đóng phí cho kịp đơn hàng', ai: { w: 0.4, risk: 1 }, run: function (l, r, log) { if (H.addLoan) H.addLoan(l, 'family', V(l, 80)); H.cash(l, -V(l, 80), 'Phí môi giới đi làm nước ngoài'); fx(l, { hap: -10 }); stress(l, 12); log('Đóng tiền xong, hẹn mãi không thấy lịch bay. Đến văn phòng thì đã đóng cửa. Khoản vay 80 triệu vẫn còn đó.', 'bad'); H.mem(l, 'Năm bị lừa mất tiền môi giới đi làm nước ngoài.', 4); } },
      { k: 'kiem_tra', l: 'Kiểm tra công ty có giấy phép hay không trước', ai: { w: 1, smart: 1.2 }, run: function (l, r, log) { log('Tra cứu mới biết công ty kia không có giấy phép đưa người đi làm việc ở nước ngoài. Bạn không đóng đồng nào.', 'good'); } },
      { k: 'thoi', l: 'Thôi, không đi', ai: { w: 0.7 }, run: function (l, r, log) { log('Bạn từ chối, ở lại tìm việc trong nước.', 'neutral'); } }
    ]
  });
  T('vd_co_xkld', function (l, a) { return a >= 19 && a <= 38 && !l.abroad && poor(l); }, P(0.03, 3), 8, 1);

  // 7. Nông nghiệp, buôn bán nhỏ thất bát
  SC('vd_mat_mua', {
    title: 'Mất mùa', valid: function (l) { return /^(nong|sau_rieng|nuoi_tom|phu_giup)$/.test(jid(l)) && l.indep; },
    text: 'Năm nay hạn mặn, cả vụ gần như mất trắng. Tiền phân bón, giống mua chịu từ đầu vụ vẫn còn nợ đại lý.',
    opts: [
      { k: 'vay', l: 'Vay tiếp làm vụ sau', ai: { w: 1 }, run: function (l, r, log) { if (H.addLoan) H.addLoan(l, 'bank', V(l, 30)); fx(l, { hap: -4 }); log('Bạn vay ngân hàng chính sách làm vụ sau, mong trời thương.', 'neutral'); } },
      { k: 'lam_thue', l: 'Đi làm thuê thêm trả nợ', ai: { w: 0.9 }, run: function (l, r, log) { H.cash(l, V(l, 8), 'Làm thuê thêm'); fx(l, { hea: -3 }); log('Ngoài ruộng nhà, bạn đi làm thuê cho các vườn khác lấy tiền trả nợ đại lý.', 'neutral'); } },
      { k: 'ban_dat', l: 'Bán bớt một sào ruộng trả nợ', ai: { w: 0.5 }, run: function (l, r, log) { H.cash(l, V(l, 40), 'Bán bớt ruộng'); fx(l, { hap: -6 }); log('Bạn bán bớt một sào ruộng trả hết nợ. Ruộng nhà mỗi năm một ít đi.', 'bad'); } }
    ]
  });
  T('vd_mat_mua', function (l) { return /^(nong|sau_rieng|nuoi_tom|phu_giup)$/.test(jid(l)) && l.indep; }, P(0.06, 3), 5, 2);

  // 8. Về già không lương hưu
  SC('vd_gia_ngheo', {
    title: 'Tuổi già không lương hưu', valid: function (l) { return l.age >= 62 && !l.pensioned && l.money < l.base * 3; },
    text: 'Không có lương hưu, tiền dành dụm cũng cạn. Tuổi đã cao nhưng bạn vẫn phải tính chuyện kiếm sống.',
    opts: [
      { k: 've_chai', l: 'Đi nhặt ve chai, bán vé số', ai: { w: 0.9 }, run: function (l, r, log) { work(l, r, log, U.pick(r, ['ve_chai', 've_so'])); fx(l, { hea: -3, hap: -3 }); log('Sáng nào bạn cũng dậy sớm đi nhặt ve chai, bán vé số, mỗi ngày kiếm vài chục nghìn.', 'bad'); } },
      { k: 'con', l: 'Nhờ con cái phụ giúp', req: function (l) { return (l.kids || []).some(function (k) { return k.alive !== false && l.age - k.born >= 22; }); }, ai: { w: 1.1 }, run: function (l, r, log) { H.cash(l, V(l, 15), 'Con cái phụ giúp'); log('Các con mỗi tháng gửi về một ít. Con cũng chật vật, nên bạn chi tiêu dè sẻn từng đồng.', 'neutral'); } },
      { k: 'tro_cap', l: 'Làm hồ sơ xin trợ cấp xã hội', ai: { w: 1 }, run: function (l, r, log) { H.cash(l, V(l, 6), 'Trợ cấp xã hội'); log('Bạn làm hồ sơ xin trợ cấp, mỗi tháng nhận một khoản nhỏ, đủ tiền gạo.', 'neutral'); } }
    ]
  });
  T('vd_gia_ngheo', function (l) { return isVN(l) && l.age >= 62 && !l.pensioned && l.money < l.base * 3; }, P(0.15, 2), 6, 2);

  // 9. Tết không về
  SC('vd_tet_khong_ve', {
    title: 'Tết này không về', valid: function (l) { return !!l.movedTo && !!pw(l) && poor(l); },
    text: function (l) { return 'Cuối năm, tiền thưởng chẳng được bao nhiêu, vé xe Tết lại tăng gấp đôi. ' + U.cap(pw(l)) + ' gọi điện hỏi Tết có về không.'; },
    opts: [
      { k: 've', l: 'Vẫn về, Tết là phải về', ai: { w: 1 }, run: function (l, r, log) { H.cash(l, -V(l, 3), 'Vé xe về quê ăn Tết'); fx(l, { hap: 5 }); log('Bạn chắt bóp đủ tiền vé, chen chúc trên chuyến xe đêm về quê ăn Tết.', 'good'); } },
      { k: 'o_lai', l: 'Ở lại, nhận trực Tết lấy lương gấp ba', ai: { w: 0.8 }, run: function (l, r, log) { H.cash(l, V(l, 3), 'Trực Tết'); fx(l, { hap: -5 }); log('Bạn ở lại trực Tết. Đêm giao thừa ngồi một mình trong phòng trọ, gọi video về nhà.', 'bad'); H.mem(l, 'Cái Tết một mình ở phòng trọ.', 3); } }
    ]
  });
  T('vd_tet_khong_ve', function (l) { return !!l.movedTo && !!pw(l) && poor(l); }, P(0.06, 3), 4, 2);

  // 10. những khoản chi bất ngờ dồn dập với người đang khó khăn
  var SHOCK = [
    ['Chiếc xe máy cũ hỏng giữa đường, sửa hết', 3], ['Trong họ liên tiếp có đám cưới, đám giỗ, tiền mừng tiền phúng hết', 4], ['Bị mất trộm chiếc điện thoại trên xe buýt, phải mua chiếc khác hết', 4],
    ['Mưa bão làm dột mái nhà, sửa lại hết', 6], ['Người nhà ốm vặt liên miên, tiền thuốc men hết', 3], ['Bị phạt nguội vì vượt đèn đỏ, nộp phạt hết', 2],
    ['Tiền điện mùa nóng tăng vọt, cộng tiền nước, tiền rác hết', 2], ['Cho người quen vay rồi người ấy biệt tăm, mất', 5], ['Tủ lạnh, máy giặt cũ hỏng cùng tháng, sửa hết', 3],
    ['Đóng tiền xây nhà văn hóa, quỹ khuyến học của thôn hết', 1], ['Đi khám răng đau nhức, nhổ và trám hết', 1.5], ['Bị lừa mua phải lô hàng kém chất lượng khi buôn thêm, lỗ', 4]
  ];
  E.HOOKS.year.unshift(function (l, r, log, a) {
    if (!hard(l) || !l.indep || !l.alive || !free(l) || !isVN(l) || !poor(l) || r() >= 0.5) return;
    var S = l.flags.vdShock || (l.flags.vdShock = {}), left = SHOCK.filter(function (x, i) { return S[i] == null || a - S[i] >= 15; });
    if (!left.length) return; var x = U.pick(r, left); S[SHOCK.indexOf(x)] = a;
    var amt = V(l, x[1] * (1.2 + r() * 0.8)); H.cash(l, -amt, 'Chi phí bất ngờ'); log(x[0] + ' ' + mo(l, amt) + '.', 'bad'); stress(l, 3);
  });
  // người gặp vận đen hay kẹt ở việc lương thấp, chậm được tăng lương
  var cy = E.careerYear;
  if (cy) E.careerYear = function (l) { var inc = cy.apply(this, arguments); if (hard(l) && isVN(l) && typeof inc === 'number' && inc > 0 && (worker(l) || /^(tx_cn|xe_om|shipper|ban_rong|ve_chai|ve_so|nong|phu_giup)$/.test(jid(l)))) inc *= 0.85; return inc; };
  E.vanDen = hard;
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
