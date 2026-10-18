/* Một Đời — v4.3 (góp ý của người chơi):
   · mất mát người thân: lần đầu tiên (dù là bố mẹ, ông bà, anh chị em…) mới là "lần đầu hiểu thế nào là mất mát"; những lần sau là nỗi đau chồng lên nỗi đau
   · sức khỏe tinh thần: bạn bè gặp khủng hoảng (hỏi thẳng, lắng nghe, đưa đến hỗ trợ), những ngày tăm tối của chính mình, nỗi đau sau mất mát — có thông tin đường dây hỗ trợ
   · định kiến nghề nghiệp: thợ xăm, shipper, người nhặt ve chai, nam điều dưỡng / giáo viên mầm non, ca sĩ, streamer, tuyển thủ esports, thợ nail, bartender, giúp việc, nông dân, công nhân…
     — một người lạ tử tế, lựa chọn của bạn trở thành ký ức và được nhắc lại về sau */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function fx(l, o) { H.fx(l, o); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function inJail(l) { return l.jailUntil != null && l.age < l.jailUntil; }
  function free(l) { return !inJail(l) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function T(id, when, p, cd, max) { E.TRIG.push({ id: id, when: function (l, a) { return free(l) && when(l, a); }, p: p, cd: cd || 4, max: max || 1 }); }
  function stress(l, x) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + x, 0, 100); }
  function job(l) { return l.job ? E.resolveJob(l.job.id) : null; }
  function vnHere(l) { return isVN(l) && !(l.abroad && l.abroad.perm); }
  var HOTLINE = 'Ở Việt Nam có Đường dây nóng Ngày Mai 096 306 1414 (miễn phí, tham vấn tâm lý cho người trầm cảm, khủng hoảng và người thân); khi nguy cấp gọi cấp cứu 115.';
  function hotline(l) { return vnHere(l) ? HOTLINE : 'Ở nhiều nước có đường dây hỗ trợ khủng hoảng miễn phí (findahelpline.com); khi nguy cấp gọi số cấp cứu.'; }
  E.HOTLINE = hotline;

  // ===================================================================
  // 1. MẤT MÁT NGƯỜI THÂN: LẦN ĐẦU VÀ NHỮNG LẦN SAU
  // ===================================================================
  var LOSS = /^(Ông nội|Bà nội|Ông ngoại|Bà ngoại|Bố|Mẹ|Chồng|Vợ|Người bạn đời|Anh|Chị|Em|Con) [^.]*qua đời|^Hung tin: .* qua đời/;
  var FIRST_OLD = / ?Lần đầu bạn hiểu thế nào là mất mát\./;
  var LATER = ['Lại thêm một lần tiễn biệt người thân — vết thương cũ chưa kịp lành đã có thêm vết mới.', 'Nỗi đau ngày trước chưa nguôi, giờ lại thêm một nỗi đau nữa.', 'Lại một lần đứng trước di ảnh người thân, bạn thấy mình như vừa mất thêm một phần ký ức.'];
  var MANY = ['Đã qua bao lần tiễn biệt, nhưng chưa lần nào bớt đau.', 'Mỗi người ra đi lại mang theo một phần của bạn.', 'Càng lớn càng quen với những đám tang, nhưng chẳng bao giờ quen được cảm giác mất mát.', 'Những người thương cứ lần lượt đi xa, căn nhà mỗi năm lại thêm một chỗ trống.'];
  function who(t) { var m = t.match(LOSS); return m ? m[1] || 'bff' : null; }
  E.lossText = function (l, t, k) {
    if (k !== 'bad' || typeof t !== 'string' || !LOSS.test(t) || !l || !l.flags) return t;
    var w = who(t), a = l.age; t = t.replace(FIRST_OLD, '');
    if (w === 'Con' && !/^Con [A-ZÀ-Ỹ]/.test(t)) return t;
    var F = l.flags, n = F.lossN = (F.lossN || 0) + 1;
    if (a < 4) { F.lossBaby = true; return t + ' Khi ấy bạn còn quá nhỏ để nhớ, chỉ lớn lên qua những tấm ảnh và lời kể của người lớn.'; }
    var felt = F.lossFelt = (F.lossFelt || 0) + 1, extra;
    if (felt === 1) extra = (w === 'Bố' || w === 'Mẹ') && a < 18 ? 'Mới ' + a + ' tuổi, lần đầu bạn hiểu thế nào là mất mát — một khoảng trống chẳng gì lấp được.' : 'Lần đầu bạn hiểu thế nào là mất mát.';
    else if (w === 'Con') extra = 'Không nỗi đau nào lớn bằng cảnh người đầu bạc tiễn kẻ đầu xanh.';
    else if (/^(Chồng|Vợ|Người bạn đời)$/.test(w)) extra = 'Một nửa của bạn đã đi xa — ' + (felt === 2 ? 'nỗi đau này còn lớn hơn tất cả những lần trước.' : 'bao lần tiễn biệt cũng không đau bằng lần này.');
    else if ((w === 'Bố' || w === 'Mẹ') && F.lossParent) extra = 'Giờ bạn không còn bố mẹ nữa — từ nay không còn ai để gọi "bố ơi, mẹ ơi" mỗi lần về nhà.';
    else extra = felt === 2 ? LATER[(n + a) % LATER.length] : MANY[(n + a) % MANY.length];
    if (w === 'Bố' || w === 'Mẹ') F.lossParent = true;
    F.lossAt = a; F.lossWho = w;
    return t + ' ' + extra;
  };

  // ===================================================================
  // 2. SỨC KHỎE TINH THẦN, PHÒNG CHỐNG TỰ TỬ
  // ===================================================================
  SC('ban_khung_hoang', {
    title: 'Tin nhắn lúc nửa đêm',
    prep: function (l, r) { var n = l.bff && l.bff.alive ? l.bff.name : H.stranger(l, r, pick(r, ['M', 'F'])); return { n: n, bff: !!(l.bff && l.bff.alive && n === l.bff.name) }; },
    text: function (l, d) { return 'Một đêm khuya, ' + d.n + (d.bff ? ' — người bạn thân nhất —' : ', người bạn đã lâu không liên lạc,') + ' nhắn cho bạn: "Mệt quá rồi. Chắc không ai cần mình nữa đâu." Rồi im lặng, không trả lời thêm.'; },
    opts: [
      { k: 'goi', l: 'Gọi điện ngay, hỏi thẳng xem bạn ấy có đang nghĩ đến chuyện tự tử không, rồi lắng nghe', h: 'Hỏi thẳng không làm ý nghĩ đó lớn thêm — lắng nghe và cùng tìm hỗ trợ chuyên môn', ai: { w: 1.6, soc: 1 },
        run: function (l, r, log, d) { log('Gọi ngay cho ' + d.n + ', hỏi thẳng, rồi lắng nghe đến tận gần sáng. Hôm sau hai người cùng tìm đến nơi tư vấn tâm lý. ' + hotline(l), 'good'); fx(l, { karma: 8, soc: 3 }); l.flags.savedFriend = d.n; H.mem(l, 'Đêm gọi điện cho ' + d.n + ' đến gần sáng. Mấy tháng sau ' + d.n + ' nói: "Cảm ơn mày đã gọi."', 6); } },
      { k: 'nhan', l: 'Nhắn lại: "Cố lên, ai cũng có lúc thế mà"', ai: { w: 0.7 },
        run: function (l, r, log, d) { if (ch(r, 0.5)) log(d.n + ' chỉ thả một biểu tượng cảm xúc. Mấy hôm sau bạn mới biết ' + d.n + ' đã phải vào viện vì khủng hoảng tâm lý — may mà gia đình kịp phát hiện. Bạn hiểu ra: một lời "cố lên" đôi khi là chưa đủ. ' + hotline(l), 'bad'); else log(d.n + ' trả lời "ừ, cảm ơn". Bạn hẹn cuối tuần gặp nhau, ngồi cà phê nói chuyện cả buổi.', 'neutral'); fx(l, { soc: 1 }); } },
      { k: 'nguoi_than', l: 'Gọi cho người nhà bạn ấy, rồi cùng đến tận nơi', ai: { w: 1, smart: 1 },
        run: function (l, r, log, d) { log('Gọi cho người nhà ' + d.n + ' rồi cùng chạy đến. Cả nhà ngồi bên ' + d.n + ' đến sáng, hôm sau đưa đi khám ở chuyên khoa tâm thần. ' + hotline(l), 'good'); fx(l, { karma: 6 }); H.mem(l, 'Đêm cùng gia đình ' + d.n + ' chạy đến bên bạn ấy.', 5); } }
    ]
  });
  T('ban_khung_hoang', function (l, a) { return a >= 15 && a <= 80; }, 0.012, 8, 1);
  SC('nhung_ngay_toi', {
    title: 'Những ngày tăm tối', valid: function (l) { return !!l.mind && l.mind.stress >= 60 && l.st.hap < 40; },
    text: 'Đã mấy tuần nay bạn mất ngủ, chẳng muốn ăn, chẳng muốn gặp ai. Có những đêm bạn nghĩ giá như mình biến mất thì mọi người sẽ nhẹ nhõm hơn.',
    opts: [
      { k: 'noi', l: 'Nói thật với người thân, người bạn tin tưởng', ai: { w: 1.3, soc: 1 }, run: function (l, r, log) { var w = l.partner ? l.partner.name : l.fam.mAlive ? 'mẹ' : l.fam.fAlive ? 'bố' : l.bff && l.bff.alive ? l.bff.name : 'một người bạn'; log('Lấy hết can đảm nói với ' + w + '. ' + U.cap(w) + ' không trách, chỉ ôm bạn thật lâu, rồi cùng bạn đi khám. Bạn không phải một mình.', 'good'); stress(l, -25); fx(l, { hap: 8 }); H.mem(l, 'Ngày nói thật với ' + w + ' về những ngày tăm tối.', 5); } },
      { k: 'goi', l: 'Gọi đường dây hỗ trợ tâm lý', h: function (l) { return vnHere(l) ? 'Đường dây nóng Ngày Mai 096 306 1414, miễn phí' : 'đường dây hỗ trợ khủng hoảng miễn phí'; }, ai: { w: 1, smart: 1 }, run: function (l, r, log) { log('Gọi đường dây hỗ trợ. Người ở đầu dây bên kia lắng nghe, không phán xét, chỉ cho bạn những bước nhỏ để vượt qua đêm nay và nơi khám gần nhất. ' + hotline(l), 'good'); stress(l, -18); fx(l, { hap: 5 }); } },
      { k: 'kham', l: 'Đi khám bác sĩ chuyên khoa tâm thần / tâm lý', h: function (l) { return 'Khoảng ' + H.money(l, isVN(l) && l.cur === 'vnd' ? 3 : 3 / 90 * l.base) + ' mỗi đợt'; }, ai: { w: 1, smart: 1.2 }, run: function (l, r, log) { H.cash(l, -(isVN(l) && l.cur === 'vnd' ? 3 : 3 / 90 * l.base), 'Khám, điều trị tâm lý'); log('Đi khám, được chẩn đoán trầm cảm mức độ vừa. Uống thuốc, trị liệu tâm lý vài tháng, những buổi sáng dần có nắng trở lại.', 'good'); stress(l, -30); fx(l, { hap: 10 }); l.flags.therapy = true; } },
      { k: 'giu', l: 'Giữ trong lòng, tự mình chịu đựng', ai: { w: 0.4 }, run: function (l, r, log) { log('Giữ tất cả trong lòng. Mọi thứ nặng dần lên. Đến một ngày, bạn biết mình cần được giúp đỡ — trầm cảm là bệnh, và bệnh thì cần chữa. ' + hotline(l), 'bad'); stress(l, 6); fx(l, { hap: -4, hea: -3 }); } }
    ]
  });
  T('nhung_ngay_toi', function (l, a) { return a >= 13 && !!l.mind && l.mind.stress >= 65 && l.st.hap < 35; }, 0.07, 8, 2);
  SC('sau_mat_mat', {
    title: 'Sau ngày tiễn biệt', valid: function (l) { return l.flags.lossAt != null && l.age - l.flags.lossAt <= 1; },
    text: 'Người thân mất đã mấy tháng, nhưng bạn vẫn hay vô thức gọi tên, vẫn để nguyên đồ đạc của người ấy, có những đêm khóc một mình.',
    opts: [
      { k: 'chia_se', l: 'Ngồi lại với gia đình, cùng kể về người đã khuất', ai: { w: 1.3, soc: 1 }, run: function (l, r, log) { log('Cả nhà ngồi lại kể chuyện về người đã khuất, vừa khóc vừa cười. Nỗi đau vẫn còn, nhưng không còn phải mang một mình.', 'good'); stress(l, -12); fx(l, { hap: 5, soc: 2 }); } },
      { k: 'viec', l: 'Lao vào công việc cho quên', ai: { w: 0.8 }, run: function (l, r, log) { log('Lao vào làm việc từ sáng đến tối. Đến lúc dừng lại, nỗi buồn vẫn ở đó.', 'neutral'); stress(l, 6); } },
      { k: 'tu_van', l: 'Tìm đến chuyên gia tâm lý', ai: { w: 0.5, smart: 1 }, run: function (l, r, log) { H.cash(l, -(isVN(l) && l.cur === 'vnd' ? 2 : 2 / 90 * l.base), 'Tư vấn tâm lý'); log('Đi gặp chuyên gia tâm lý vài buổi, học cách sống cùng nỗi nhớ.', 'good'); stress(l, -18); fx(l, { hap: 4 }); } }
    ]
  });
  T('sau_mat_mat', function (l, a) { return a >= 12 && l.flags.lossAt != null && a - l.flags.lossAt <= 1 && (l.flags.lossFelt || 0) >= 1; }, 0.3, 6, 3);

  // ===================================================================
  // 3. ĐỊNH KIẾN NGHỀ NGHIỆP — MỘT NGƯỜI LẠ TỬ TẾ, MỘT KÝ ỨC VỀ SAU
  // ===================================================================
  var STG = [
    { k: 'xam', jobs: ['tho_xam'], title: 'Ở trạm xe buýt',
      scene: 'Bạn là thợ xăm, luôn xem mỗi hình xăm là nghệ thuật, là cách mỗi người lưu giữ câu chuyện của riêng mình. Một buổi chiều đợi xe buýt, bạn nghe một người phụ nữ nói với con: "Tránh xa mấy người xăm trổ ra con, nhìn là biết chẳng tốt đẹp gì." Bạn im lặng, kéo tay áo xuống che những hình xăm.',
      who: 'bà cụ', kind: 'Một bà cụ ngồi bên khẽ mỉm cười: "Cháu à, người ta nhìn thấy hình xăm trên da cháu, nhưng đâu thấy hết những điều trong lòng cháu. Bà gặp người chẳng có lấy một hình xăm mà lòng dạ đầy vết xấu, cũng gặp người xăm kín hai tay mà trái tim rất đỗi tử tế. Hình xăm chỉ nói lên điều cháu thích, còn cách cháu sống mới nói lên cháu là ai."',
      quote: 'Hình xăm chỉ nói lên điều cháu thích, còn cách cháu sống mới nói lên cháu là ai', end: 'Bà cụ vỗ nhẹ lên tay bạn. Chiếc xe buýt từ từ vào trạm. Lần đầu tiên trong ngày, bạn không còn muốn kéo tay áo xuống nữa.',
      fu: 'Một cô gái trẻ đến tiệm, đặt lên bàn tấm ảnh người mẹ vừa mất: "Em muốn xăm nét chữ mẹ viết, để lúc nào mẹ cũng ở bên em."', fuDo: 'Xăm thật tỉ mỉ, không lấy tiền công', fuDone: 'Bạn xăm từng nét chữ thật tỉ mỉ. Cô gái nhìn cổ tay mình rồi bật khóc: "Đúng chữ mẹ em rồi."' },
    { k: 'ship', jobs: ['shipper', 'tx_cn', 'xe_om'], title: 'Câu nói ở đầu ngõ',
      scene: 'Đang chờ khách nhận hàng, bạn nghe một người mẹ dặn con: "Không chịu học thì sau này đi giao hàng như chú kia, nắng mưa khổ cả đời." Bạn cúi xuống chỉnh lại thùng hàng, giả như không nghe thấy.',
      who: 'ông cụ', kind: 'Ông cụ ngồi uống trà đầu ngõ gọi bạn lại, rót cho chén trà: "Đừng để bụng cháu ạ. Mấy năm dịch bệnh, cả phố này sống nhờ những đứa như cháu. Nghề nào nuôi được mình bằng mồ hôi thì nghề đó đáng quý."',
      quote: 'Nghề nào nuôi được mình bằng mồ hôi thì nghề đó đáng quý', end: 'Bạn uống cạn chén trà, cảm ơn ông rồi nổ máy đi tiếp. Con đường hôm ấy bỗng như ngắn lại.',
      fu: 'Trời mưa bão, có đơn thuốc gấp cho một bà cụ sống một mình ở hẻm sâu, chẳng ai nhận.', fuDo: 'Đội mưa đi giao', fuDone: 'Bạn đội mưa mang thuốc đến. Bà cụ nắm tay bạn, dúi cho mấy cái bánh: "Có cháu bà mới qua được đêm nay."' },
    { k: 've_chai', jobs: ['ve_chai', 've_so', 'phu_ho'], title: 'Ánh mắt ngoài chợ',
      scene: 'Bạn đi ngang một quán cà phê, cậu thanh niên bàn bên bịt mũi, nói đủ to cho cả quán nghe: "Nhìn là biết nghèo vì lười." Bạn rảo bước thật nhanh.',
      who: 'cô chủ quán', kind: 'Cô chủ quán chạy theo, đưa cho bạn chai nước mát: "Em đừng nghe nó. Cô biết em, sáng nào cũng thấy em đi từ lúc trời chưa sáng. Người ta không biết mình đã cố gắng thế nào đâu, chỉ mình biết thôi."',
      quote: 'Người ta không biết mình đã cố gắng thế nào, chỉ mình biết thôi', end: 'Bạn cầm chai nước, đứng lặng một lúc. Rồi lại đi tiếp, lưng thẳng hơn một chút.',
      fu: 'Bạn nhặt được một chiếc ví có cả chục triệu đồng và giấy tờ của một người lạ.', fuDo: 'Mang ví đến tận nhà trả lại', fuDone: 'Bạn tìm đến tận nhà trả lại chiếc ví. Người ta ngỡ ngàng, còn bạn chỉ cười: "Của ai thì trả người nấy."' },
    { k: 'nam_nu', jobs: ['dieu_duong', 'gv_mam_non'], cond: function (l) { return l.sex === 'M'; }, title: '"Con trai mà làm nghề con gái"',
      scene: function (l) { return 'Đám cưới họ hàng, mấy ông chú cười cợt: "Con trai mà đi ' + (job(l) === 'gv_mam_non' ? 'trông trẻ mẫu giáo' : 'làm điều dưỡng, bưng bô cho người ta') + ', chẳng ra dáng đàn ông." Bạn cười trừ, rót thêm chén rượu.'; },
      who: 'bà nội', kind: function (l) { return 'Tối ấy bà ' + (l.fam && l.fam.mAlive ? 'nội' : 'ngoại') + ' gọi bạn vào buồng: "Ngày xưa ông cháu cũng chăm bà từng thìa cháo lúc bà ốm. Đàn ông tử tế là người biết thương người khác, chứ đâu phải ở cái nghề."'; },
      quote: 'Đàn ông tử tế là người biết thương người khác, chứ đâu phải ở cái nghề', end: 'Bạn ngồi bên bà thật lâu. Sáng hôm sau đi làm, bạn chẳng còn thấy ngại khi người ta hỏi mình làm nghề gì.',
      fu: function (l) { return job(l) === 'gv_mam_non' ? 'Một bé trong lớp mất bố, cả tuần không nói chuyện với ai, chỉ ôm khư khư con gấu bông.' : 'Một bệnh nhân già neo đơn sắp xuất viện, không có ai đón về.'; }, fuDo: 'Dành thêm thời gian ở bên', fuDone: function (l) { return job(l) === 'gv_mam_non' ? 'Bạn ngồi chơi với bé mỗi giờ ra chơi. Một tuần sau, bé ôm cổ bạn: "Con thương thầy."' : 'Bạn gọi xe, đưa ông về tận nhà, dặn hàng xóm trông giúp. Ông nắm tay bạn mãi không buông.'; } },
    { k: 'nghe_si', jobs: ['ca_si', 'dien_vien', 'vu_cong', 'rapper', 'dv_hai'], title: '"Xướng ca vô loài"',
      scene: 'Một người hàng xóm lớn tuổi nói với bố mẹ bạn: "Cho con đi hát hò, nhảy nhót làm gì, xướng ca vô loài, chẳng ra gì đâu."',
      who: 'cô giáo cũ', kind: 'Hôm sau, cô giáo dạy văn năm cấp ba nhắn cho bạn: "Cô xem clip em diễn rồi. Có những ngày cô mệt mỏi, nghe em hát lại thấy nhẹ lòng. Mang được niềm vui cho người khác là một nghề cao quý, em nhé."',
      quote: 'Mang được niềm vui cho người khác là một nghề cao quý', end: 'Bạn đọc tin nhắn mấy lần, chụp màn hình lưu lại.',
      fu: 'Bạn được mời diễn miễn phí cho các em nhỏ ở khoa ung bướu nhi.', fuDo: 'Nhận lời, diễn hết mình', fuDone: 'Bạn diễn hết mình trong căn phòng nhỏ. Một em bé đầu trọc cười khanh khách, đòi bạn diễn thêm một bài nữa.' },
    { k: 'mang', jobs: ['streamer', 'youtuber', 'kol_live', 'fl_aff'], title: '"Nghề ảo"',
      scene: 'Bữa cơm Tết, bác cả hỏi bạn làm gì. Nghe xong bác lắc đầu: "Ngồi nói trước cái điện thoại mà gọi là nghề à? Nghề ảo, mai mốt hết thời thì ăn gì?"',
      who: 'em họ', kind: 'Đứa em họ học lớp 9 kéo bạn ra sân: "Anh/chị đừng buồn. Em học được bao nhiêu thứ từ video của anh/chị. Bạn em cũng xem. Thế là thật mà."',
      quote: 'Em học được bao nhiêu thứ từ video của anh chị — thế là thật mà', end: 'Bạn xoa đầu đứa em. Tối ấy về, bạn lên ý tưởng cho video mới, hào hứng như ngày đầu.',
      fu: 'Một người xem nhắn riêng: video của bạn đã giúp họ qua những ngày khó khăn nhất.', fuDo: 'Làm một video tử tế cho những người như vậy', fuDone: 'Bạn làm một video về những ngày khó khăn và nơi có thể tìm sự giúp đỡ. Video ấy không nhiều lượt xem nhất, nhưng là video bạn tự hào nhất.' },
    { k: 'game', jobs: ['tuyen_thu_es', 'coach_es', 'caster_es', 'cay_thue'], title: '"Chơi game mà cũng gọi là nghề"',
      scene: 'Ra mắt nhà người yêu, bố người ấy hỏi nghề nghiệp. Nghe bạn nói xong, ông đặt đũa xuống: "Chơi game thì là chơi, sao gọi là nghề được?"',
      who: 'mẹ người ấy', kind: 'Lúc rửa bát, mẹ người ấy khẽ nói: "Bác thấy cháu tập luyện từ sáng đến đêm, thua thì xem lại từng ván. Nghề nào cũng vậy thôi, nghiêm túc với nó thì nó là nghề. Từ từ bác trai sẽ hiểu."',
      quote: 'Nghiêm túc với nó thì nó là nghề', end: 'Bạn cảm ơn bác, lòng nhẹ đi một nửa.',
      fu: 'Đội bạn vào chung kết, cả nhà người ấy ngồi xem trực tiếp.', fuDo: 'Thi đấu hết mình', fuDone: 'Bạn thi đấu hết mình. Tan trận, có tin nhắn từ bố người ấy: "Hay đấy. Lần sau bác đi xem trực tiếp."' },
    { k: 'nail', jobs: ['nail', 'tho_toc', 'barber', 'spa'], title: 'Lời ở tiệm',
      scene: 'Một vị khách sang trọng vừa làm móng vừa nói chuyện điện thoại: "Học hành không tới nơi thì mới đi làm nail, làm tóc thôi." Bạn vẫn cúi xuống làm, tay hơi run.',
      who: 'cô khách quen', kind: 'Cô khách quen ngồi ghế bên chờ đến lượt, nói nhỏ: "Cô làm bác sĩ ba chục năm, cô biết một đôi tay khéo phải luyện bao lâu. Ai làm người khác đẹp lên, tự tin lên, người đó làm nghề tử tế."',
      quote: 'Ai làm người khác đẹp lên, tự tin lên, người đó làm nghề tử tế', end: 'Bạn ngẩng lên cười với cô. Bộ móng hôm ấy là bộ đẹp nhất trong tuần.',
      fu: 'Một cô dâu nghèo đến tiệm, bẽn lẽn hỏi giá làm đẹp ngày cưới, đếm đi đếm lại xấp tiền ít ỏi.', fuDo: 'Làm đẹp cho cô dâu, chỉ lấy tiền vật liệu', fuDone: 'Bạn làm đẹp cho cô dâu, chỉ lấy tiền vật liệu. Hôm cưới, cô gửi ảnh: "Chị ơi, em chưa bao giờ thấy mình đẹp như thế."' },
    { k: 'bar', jobs: ['bartender', 'dj'], title: '"Làm quán bar thì hư hỏng"',
      scene: 'Hàng xóm xì xào với mẹ bạn: "Con bà đi làm đêm ở quán bar à? Môi trường đó thì kiểu gì chẳng hư."',
      who: 'mẹ', kind: function (l) { return (l.fam && l.fam.mAlive ? 'Mẹ' : 'Bố') + ' về nhà, nấu cho bạn bát mì lúc nửa đêm: "Mẹ không cần biết người ta nói gì. Mẹ biết con mẹ đi làm đêm về vẫn nhắn hỏi mẹ ngủ chưa. Thế là đủ."'; },
      quote: 'Mẹ biết con mẹ đi làm đêm về vẫn nhắn hỏi mẹ ngủ chưa. Thế là đủ', end: 'Bạn ăn hết bát mì, chẳng nói được câu nào.',
      fu: 'Một vị khách say mèm định tự lái xe về.', fuDo: 'Giữ chìa khóa, gọi xe đưa khách về', fuDone: 'Bạn giữ chìa khóa, gọi xe đưa khách về tận nhà. Hôm sau ông quay lại cảm ơn: "Tối qua cậu/cô đã cứu một gia đình đấy."' },
    { k: 'giup_viec', jobs: ['giup_viec'], title: '"Đồ ô-sin"',
      scene: 'Đứa con nhà chủ cãi nhau với bạn bè, buột miệng chỉ bạn: "Ô-sin nhà tao thì biết gì!" Bạn lặng lẽ dọn bàn ăn.',
      who: 'bà chủ nhà', kind: 'Tối ấy bà chủ nhà gọi đứa con ra xin lỗi bạn, rồi nói với bạn: "Chị lo cho cả nhà này như người nhà. Không có chị, nhà này không thành nếp được đâu."',
      quote: 'Không có chị, nhà này không thành nếp được', end: 'Đứa trẻ lí nhí xin lỗi. Bạn xoa đầu nó, bỏ qua.',
      fu: 'Đứa trẻ nhà chủ năm nào giờ đã lớn, đỗ đại học, về thăm.', fuDo: 'Nấu món nó thích nhất', fuDone: 'Bạn nấu món nó thích nhất. Nó ôm bạn: "Hồi đó con dại. Cảm ơn cô đã thương con như con ruột."' },
    { k: 'nong', jobs: ['nong'], title: '"Học không tới nơi mới về làm ruộng"',
      scene: 'Ngày họp lớp, một người bạn cũ cười: "Học xong lại về cuốc đất à? Phí cả mấy năm đi học."',
      who: 'cô bán hàng ngoài chợ', kind: 'Mấy hôm sau mang rau ra chợ, cô bán hàng quen dúi thêm tiền: "Rau nhà cháu sạch, khách cô hỏi mãi. Không có người trồng lúa, trồng rau thì ai cũng đói. Cháu cứ ngẩng đầu mà sống."',
      quote: 'Không có người trồng lúa, trồng rau thì ai cũng đói', end: 'Bạn cười, gánh rau về, thấy nắng chiều hôm ấy đẹp lạ.',
      fu: 'Mùa lũ, làng bên mất trắng, bà con kêu gọi gạo, rau cho vùng lũ.', fuDo: 'Gom gạo, rau nhà trồng gửi đi', fuDone: 'Bạn gom mấy bao gạo, mấy sọt rau nhà trồng gửi lên xe cứu trợ. Lần đầu bạn thấy những luống rau của mình nuôi được cả người dưng.' },
    { k: 'cong_nhan', jobs: ['cong_nhan', 'tho_han', 'tho_mo'], title: '"Làm công nhân thì cả đời khổ"',
      scene: 'Về quê, một người họ hàng xa so bì: "Con nhà tôi làm văn phòng, ngồi máy lạnh. Đi làm công nhân thì cả đời khổ thôi."',
      who: 'bố', kind: function (l) { return (l.fam && l.fam.fAlive ? 'Bố' : 'Mẹ') + ' rót cho bạn chén rượu, nói nhỏ: "Cái áo con mặc, cái điện thoại người ta cầm, cái gì chẳng do người như con làm ra. Bố tự hào về con."'; },
      quote: 'Cái gì người ta dùng chẳng do người như con làm ra', end: 'Bạn cạn chén rượu, mắt cay cay.',
      fu: 'Trong ca làm, một công nhân mới vào bị máy kẹp tay, cả chuyền hoảng loạn.', fuDo: 'Ngắt máy, sơ cứu, đưa đi viện', fuDone: 'Bạn ngắt máy kịp thời, sơ cứu rồi đưa người ấy đi viện. Bàn tay giữ lại được. Cả chuyền gọi bạn là "anh cả / chị cả".' }
  ];
  function stgVal(l, S, f) { return S.jobs.indexOf(job(l)) >= 0 && (!S.cond || S.cond(l)) && f(l); }
  function val(x, l) { return typeof x === 'function' ? x(l) : x; }
  E.STIGMA = STG.map(function (S) { return S.k; });
  STG.forEach(function (S) {
    var id = 'dk_' + S.k, fid = id + '_nho';
    SC(id, {
      title: S.title, valid: function (l) { return stgVal(l, S, function () { return !(l.flags.dk || {})[S.k]; }); },
      text: function (l) { return val(S.scene, l) + ' ' + val(S.kind, l); },
      opts: [
        { k: 'tam_su', l: function (l) { return 'Ngồi lại tâm sự với ' + val(S.who, l); }, ai: { w: 1.1, soc: 1 }, run: function (l, r, log) { (l.flags.dk = l.flags.dk || {})[S.k] = { c: 'tam_su', a: l.age }; log('Bạn ngồi lại kể cho ' + val(S.who, l) + ' nghe về nghề của mình, những vất vả chẳng ai thấy. ' + S.end, 'good'); stress(l, -10); fx(l, { hap: 5, soc: 2 }); H.mem(l, 'Lời ' + val(S.who, l) + ' năm ấy: "' + S.quote + '."', 5); } },
        { k: 'tu_tin', l: 'Cảm ơn, và tự tin với nghề của mình', ai: { w: 1.2 }, run: function (l, r, log) { (l.flags.dk = l.flags.dk || {})[S.k] = { c: 'tu_tin', a: l.age }; log('Bạn cảm ơn ' + val(S.who, l) + '. ' + S.end, 'good'); stress(l, -6); fx(l, { hap: 6, karma: 2 }); l.flags.jobPride = (l.flags.jobPride || 0) + 1; H.mem(l, 'Lời ' + val(S.who, l) + ' năm ấy: "' + S.quote + '."', 4); } },
        { k: 'buon', l: 'Cảm ơn, nhưng vẫn giữ nỗi buồn trong lòng', ai: { w: 0.6 }, run: function (l, r, log) { (l.flags.dk = l.flags.dk || {})[S.k] = { c: 'buon', a: l.age }; log('Bạn gật đầu cảm ơn, nhưng câu nói lúc trước cứ văng vẳng mãi. Tối về nằm nghĩ, vẫn thấy chạnh lòng.', 'neutral'); stress(l, 5); fx(l, { hap: -2 }); } }
      ]
    });
    T(id, function (l) { return stgVal(l, S, function () { return !(l.flags.dk || {})[S.k] && l.job.yrs >= 1; }); }, 0.12, 4, 1);
    SC(fid, {
      title: function (l) { return 'Nghề ' + E.jobTitle(l); }, valid: function (l) { return stgVal(l, S, function () { var x = (l.flags.dk || {})[S.k]; return !!x && !x.fu && l.age - x.a >= 2; }); },
      text: function (l) { var x = l.flags.dk[S.k]; return val(S.fu, l) + (x.c === 'buon' ? ' Bạn chợt nhớ những ánh nhìn dè bỉu năm nào, rồi lại tự hỏi: mình làm nghề này để làm gì?' : ' Bạn chợt nhớ lời ' + val(S.who, l) + ' năm nào: "' + S.quote + '."'); },
      opts: [
        { k: 'lam', l: S.fuDo, ai: { w: 1.4 }, run: function (l, r, log) { var x = l.flags.dk[S.k]; x.fu = l.age; log(val(S.fuDone, l) + (x.c === 'buon' ? ' Khoảnh khắc ấy, nỗi buồn năm nào bỗng nhẹ đi — bạn hiểu ra giá trị của nghề mình.' : ' Lời ' + val(S.who, l) + ' năm nào lại vang lên trong đầu, và bạn mỉm cười.'), 'good'); fx(l, { hap: 8, karma: 5 }); stress(l, -8); H.mem(l, U.cap(val(S.fuDone, l)), 5); } },
        { k: 'thoi', l: 'Làm theo đúng quy trình, như mọi ngày', ai: { w: 0.5 }, run: function (l, r, log) { l.flags.dk[S.k].fu = l.age; log('Bạn làm đúng phần việc của mình, như mọi ngày.', 'neutral'); } }
      ]
    });
    T(fid, function (l) { return stgVal(l, S, function () { var x = (l.flags.dk || {})[S.k]; return !!x && !x.fu && l.age - x.a >= 2; }); }, 0.2, 4, 1);
  });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
