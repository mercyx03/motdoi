/* Một Đời — v2.5: tuổi thơ 0–15 đa dạng hơn: nhiều tình huống ngẫu nhiên theo độ tuổi, giới tính, nông thôn/thành thị, giàu/nghèo;
   các dòng kể chuyện không lặp lại trong cùng một đời. */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function fx(l, o) { H.fx(l, o); }
  function cashB(l, x, why) { H.cash(l, x * l.base, why); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped); }
  function boy(l) { return l.sex === 'M'; }
  function girl(l) { return l.sex === 'F'; }
  function sexW(l, m, f) { return boy(l) ? m : f; }
  function mom(l) { return l.fam.mAlive ? 'mẹ' : l.fam.fAlive ? 'bố' : 'bà'; }
  function dad(l) { return l.fam.fAlive && !l.fam.noDad ? 'bố' : l.fam.mAlive ? 'mẹ' : 'ông'; }
  function rich(l) { return l.fam.q >= 4; }
  function poor(l) { return l.fam.q <= 2; }
  function talent(l, t, p, r) { if (!l.talent && r() < p) l.talent = t; if (l.talent === t) l.skill = Math.min(100, (l.skill || 20) + 4); }
  // tình huống tuổi thơ: cw có thể là hàm (theo giới tính, hoàn cảnh)
  function CT(id, when, cd, cw) { E.TRIG.push({ id: id, when: function (l, a) { return free(l) && when(l, a); }, p: function (l, a) { var w = typeof cw === 'function' ? cw(l, a) : (cw || 1); return 0.1 * Math.min(1.5, w); }, cd: cd || 3, child: true, cw: cw || 1 }); } // v3.7: xác suất xuất hiện cũng theo trọng số (giới tính, hoàn cảnh)
  // chọn câu chưa dùng trong đời này → không lặp lại
  function fresh(l, r, arr) {
    var seen = l.flags.kidSeen || (l.flags.kidSeen = []);
    var ok = arr.filter(function (t) { return t && seen.indexOf(t) < 0; });
    if (!ok.length) return null;
    var t = pick(r, ok); seen.push(t); if (seen.length > 120) seen.shift();
    return t;
  }

  // ===================================================================
  // 1. NHỮNG DÒNG KỂ CHUYỆN NHỎ (không cần lựa chọn) — chia theo tuổi, giới tính, hoàn cảnh
  // ===================================================================
  function kidLines(l, a) {
    var vn = H.inVN(l), m = mom(l), d = dad(l), L = [], y = l.birthYear + a;
    if (a <= 1) L.push('Lần đầu biết lẫy, cả nhà vỗ tay rần rần.', 'Mọc chiếc răng sữa đầu tiên, đêm nào cũng quấy khóc.', (l.fam.mAlive ? 'Bập bẹ tiếng đầu tiên — là "bà", không phải "mẹ".' : 'Bập bẹ tiếng đầu tiên — là "bà".'), 'Lần đầu ăn dặm, phun cháo đầy mặt ' + m + '.', 'Nắm chặt ngón tay ' + d + ' không chịu buông.');
    if (a >= 1 && a <= 3) L.push('Biết vẫy tay "bai bai" với khách đến nhà.', 'Ôm chặt chiếc chăn nhỏ đi khắp nhà, không cho ai giặt.', 'Bị ngã u đầu khi chạy theo con mèo.', 'Lần đầu được đi sở thú, sợ khóc thét khi thấy con voi.', 'Học được câu hát đầu tiên, hát đi hát lại cả ngày.', 'Lén bốc vụng đường trong hũ, bị bắt quả tang.');
    if (a >= 3 && a <= 6) {
      L.push('Hỏi "tại sao?" đến cả trăm lần mỗi ngày.', 'Vẽ lên tường nhà một "bức tranh" to đùng, bị mắng một trận.', 'Có một người bạn tưởng tượng tên là "Bin".', 'Sợ ma, tối nào cũng đòi ngủ với ' + m + '.', 'Lần đầu tự buộc được dây giày.', 'Rụng chiếc răng sữa đầu tiên, ' + (vn ? 'ném lên mái nhà theo lời bà dặn.' : 'giấu dưới gối chờ "tiên răng".'));
      L.push(sexW(l, 'Mặc áo choàng siêu nhân, nhảy từ ghế xuống đất "bay".', 'Lấy khăn của mẹ quấn làm váy công chúa, đi diễn khắp nhà.'), sexW(l, 'Mê xe máy xúc, đứng xem công trình cả buổi.', 'Tết tóc cho búp bê, bắt cả nhà khen đẹp.'));
      if (!l.urban) L.push('Theo ' + d + ' ra đồng bắt châu chấu, cào cào.', vn ? 'Lần đầu được cưỡi lên lưng trâu.' : 'Chạy nhảy trên đồng cỏ quê nhà.');
      else L.push('Được ' + d + ' chở đi một vòng phố đêm, mắt tròn xoe nhìn đèn.', 'Lần đầu đi thang máy, nắm chặt tay ' + m + '.');
    }
    if (a >= 6 && a <= 10) {
      L.push('Được cô khen chữ đẹp, về khoe cả nhà.', 'Lần đầu bị điểm kém, giấu sổ liên lạc dưới gầm giường.', 'Đổi được bộ sưu tập thẻ bài hiếm nhất lớp.', 'Bị cô phạt đứng góc lớp vì nói chuyện riêng.', 'Ốm sốt mấy ngày, được ' + m + ' nấu cháo hành.', 'Lần đầu ngủ lại nhà bạn, nửa đêm khóc đòi về.');
      if (boy(l)) L.push(vn ? 'Chơi bắn bi, đánh khăng với tụi con trai cả buổi chiều.' : 'Chơi bắn bi, đuổi bắt với tụi con trai cả buổi chiều.', 'Thả diều đến khi trời tối mịt.', 'Bị bạn gái cùng bàn kẻ "đường biên giới" giữa bàn.', 'Leo cây bị ngã, trầy hết đầu gối.', vn ? 'Đá bóng bằng quả bưởi trong sân.' : 'Đá bóng nhựa trong sân.');
      else L.push(vn ? 'Nhảy dây, chơi ô ăn quan với đám bạn gái giờ ra chơi.' : 'Nhảy dây, chơi lò cò với đám bạn gái giờ ra chơi.', 'Sưu tầm cả hộp giấy viết thư thơm.', 'Học tết tóc cho em, cho bạn.', 'Chơi đồ hàng, nấu "cơm" bằng lá cây với hoa dại.', 'Được bà dạy thêu chiếc khăn tay đầu tiên.');
      if (!l.urban) L.push(vn ? 'Đi bắt cá, mò cua ngoài ruộng về khoe ' + m + '.' : 'Ra suối bắt cá nhỏ về khoe ' + m + '.', vn ? 'Chăn trâu, thả diều trên bờ đê lộng gió.' : 'Thả diều trên cánh đồng lộng gió.', 'Mùa gặt theo ' + m + ' ra đồng, nằm trên đống rơm ngắm trời.');
      else L.push('Đi học thêm tiếng Anh mỗi tối, ngồi sau xe ' + m + ' ngủ gật.', 'Được dẫn đi siêu thị, chọn được một món đồ ăn vặt.');
      if (poor(l)) L.push(E.hasOlderSib && !E.hasOlderSib(l) ? 'Mặc lại quần áo cũ người quen cho, ống quần xắn mấy vòng.' : 'Mặc lại quần áo cũ của anh chị, ống quần xắn mấy vòng.', 'Mơ ước có một đôi giày mới đi học.');
      if (rich(l)) L.push('Cùng người chăm sóc cân nhắc một kỳ nghỉ theo lịch của cả nhà.', 'Có góc học sở thích riêng, tự chọn bức vẽ hoặc bài nhạc muốn thử.');
    }
    if (a >= 10 && a <= 15) {
      L.push('Lần đầu được làm lớp trưởng, oai lắm.', 'Thức khuya đọc trộm truyện dưới chăn bằng đèn pin.', 'Viết nhật ký, khóa bằng ổ khóa nhỏ xíu.', 'Cãi nhau với bạn thân rồi làm lành sau ba ngày.', y >= 2000 ? 'Bị ' + m + ' tịch thu điện thoại vì thức khuya.' : 'Bị ' + m + ' tịch thu truyện tranh vì thức khuya.', 'Lần đầu đi chơi xa cùng lớp, cả đêm không ngủ.', 'Vỡ giọng, bị cả lớp trêu.');
      if (boy(l)) L.push('Lần đầu đạp xe thả dốc, tim muốn nhảy ra ngoài.', 'Tụ tập đá bóng sau giờ học đến tối mịt.', 'Lén tập hút thử điếu thuốc của ai đó rồi ho sặc sụa — và không bao giờ thử lại.', 'Cao vọt lên, quần áo năm ngoái đã ngắn cũn.');
      else L.push('Mê đọc truyện tình cảm, khóc sưng mắt.', 'Lần đầu được ' + m + ' dẫn đi mua áo ngực, ngại đỏ mặt.', y >= 2008 ? 'Cùng nhóm bạn gái chụp ảnh "sống ảo" ở quán trà sữa.' : 'Cùng nhóm bạn gái dạo phố ăn quà vặt sau giờ học.', y >= 2008 ? 'Tập trang điểm theo video trên mạng, bị ' + m + ' bắt rửa mặt.' : 'Lén tập trang điểm trước gương, bị ' + m + ' bắt rửa mặt.', 'Có ' + (l.orient === 'straight' ? 'cậu bạn' : 'người bạn') + ' lớp bên cạnh hay đứng đợi ở cổng trường.');
      if (!l.urban && poor(l)) L.push('Sau giờ học phụ ' + m + ' cắt cỏ, nấu cám heo.', 'Đi bộ mấy cây số đến trường, chiều về chân rã rời.');
    }
    return L;
  }
  E.EVENTS.push({ c: function (l, a) { return a >= 0 && a <= 15 && free(l); }, p: function (l, a) { return a <= 5 ? 0.75 : 0.5; }, run: function (l, a, r, log) {
    var t = fresh(l, r, kidLines(l, a)); if (!t) return;
    log(t, /mắng|phạt|kém|ốm|ngã|khóc|sợ|ho sặc|rã rời/.test(t) ? 'neutral' : 'good');
    if (/u đầu|ngã|trầy/.test(t)) fx(l, { hea: -1 }); else fx(l, { hap: 1 });
    if (r() < 0.15) H.mem(l, t, 2);
  } });

  // ===================================================================
  // 2. TÌNH HUỐNG CÓ LỰA CHỌN
  // ===================================================================
  SC('nhat_vi_be', {
    title: 'Chiếc ví rơi trên đường', prep: function (l, r) { return { x: pick(r, [0.005, 0.01, 0.02]) }; },
    text: 'Trên đường đi học về, bạn nhặt được một chiếc ví, bên trong có kha khá tiền và tấm thẻ căn cước.',
    opts: [
      { k: 'return', l: function (l) { return H.inVN(l) ? 'Mang đến đồn công an / trả lại' : 'Mang đến đồn cảnh sát / trả lại'; }, run: function (l, r, log) { fx(l, { karma: 5, hap: 2 }); log('Mang ví đến ' + (H.inVN(l) ? 'công an phường' : 'đồn cảnh sát') + '. Người mất tìm đến cảm ơn'+(l.school?', còn viết thư khen gửi nhà trường.':', gửi tặng bạn một lá thư cảm ơn.'), 'good'); H.mem(l, l.school?'Lá thư khen của nhà trường vì nhặt được của rơi trả người đánh mất.':'Lá thư cảm ơn vì nhặt được của rơi trả người đánh mất.', 3); } },
      { k: 'keep', l: 'Giữ lại tiền, vứt ví đi', run: function (l, r, log, d) { cashB(l, d.x, 'Tiền nhặt được'); fx(l, { karma: -5 }); log('Giữ lại tiền. Mấy hôm liền không dám nhìn vào mắt ' + mom(l) + '.', 'neutral'); } },
      { k: 'parent', l: function (l) { return 'Mang về đưa ' + (l.fam.mAlive && l.fam.fAlive ? 'bố mẹ' : mom(l)); }, run: function (l, r, log) { fx(l, { karma: 3 }); log('Mang về nhà. Cả nhà cùng đi tìm người đánh rơi.', 'good'); } }
    ]
  });
  CT('nhat_vi_be', function (l, a) { return a >= 7 && a <= 14 && l.school; }, 99);

  SC('trom_xoai', {
    title: function (l) { return H.inVN(l) ? 'Cây xoài nhà hàng xóm' : 'Cây ăn quả nhà hàng xóm'; }, text: function (l) { return H.inVN(l) ? 'Cây xoài nhà ông Tư sai trĩu quả, chìa cả sang bờ rào. Tụi bạn rủ trưa nay lúc ông ngủ thì trèo hái.' : 'Cây ăn quả nhà bác hàng xóm sai trĩu, chìa cả sang bờ rào. Tụi bạn rủ trưa nay trèo lên hái.'; },
    opts: [
      { k: 'go', l: 'Trèo lên hái', run: function (l, r, log) { var vn = H.inVN(l); if (ch(r, 0.3)) { log('Bị chó nhà ' + (vn ? 'ông Tư' : 'hàng xóm') + ' đuổi chạy té khói, rách cả quần.', 'bad'); fx(l, { hap: -2 }); H.mem(l, 'Trưa hè bị chó đuổi vì trèo hái trộm ' + (vn ? 'xoài' : 'quả') + '.', 3); } else if (ch(r, 0.15)) { log('Trượt chân ngã từ trên cây xuống, bong gân cổ chân.', 'bad'); fx(l, { hea: -5 }); } else { log(vn ? 'Cả bọn ngồi bờ mương chấm xoài xanh với muối ớt, chua tê đầu lưỡi.' : 'Cả bọn ngồi dưới bóng cây chia nhau từng quả chín ngọt lịm.', 'good'); fx(l, { hap: 4, soc: 2 }); H.mem(l, vn ? 'Những trưa hè chấm xoài xanh với muối ớt.' : 'Trưa hè cùng đám bạn chia nhau quả hái trên cây.', 3); } } },
      { k: 'watch', l: 'Đứng dưới canh chừng', run: function (l, r, log) { log('Đứng canh, được chia hai quả ' + (H.inVN(l) ? 'xoài' : 'ngon') + '.', 'neutral'); fx(l, { hap: 2 }); } },
      { k: 'ask', l: function (l) { return 'Sang xin ' + (H.inVN(l) ? 'ông Tư' : 'bác hàng xóm') + ' đàng hoàng'; }, run: function (l, r, log) { fx(l, { karma: 3 }); log('Sang xin, ' + (H.inVN(l) ? 'ông Tư' : 'bác hàng xóm') + ' cười rồi hái cho cả rổ.', 'good'); } }
    ]
  });
  CT('trom_xoai', function (l, a) { return a >= 6 && a <= 12 && !l.urban; }, 99, function (l) { return boy(l) ? 1.4 : 0.8; });

  SC('tam_song', {
    title: 'Trưa hè oi ả', text: function (l) { return 'Tụi bạn rủ ra ' + (l.coast ? 'biển' : 'sông') + ' tắm cho mát. Người lớn vẫn dặn chỗ đó có xoáy nước.'; },
    opts: [
      { k: 'swim', l: 'Đi tắm cùng tụi bạn', run: function (l, r, log) { if (!l.flags.swim && ch(r, 0.04)) { if (ch(r, 0.25)) { H.kill(l, 'đuối nước', log, true); return; } log('Bị đuối nước, may được người lớn kéo lên kịp.', 'bad'); fx(l, { hea: -10 }); H.mem(l, 'Lần suýt chết đuối năm ' + l.age + ' tuổi.', 6); } else { log('Tắm sông cả buổi chiều, về bị ' + mom(l) + ' cầm roi đứng đợi ở cổng.', 'neutral'); fx(l, { hap: 3 }); } } },
      { k: 'no', l: 'Không đi, nhớ lời người lớn dặn', run: function (l, r, log) { log('Ở nhà. Chiều hôm ấy cả xóm xôn xao vì có đứa trẻ suýt đuối nước.', 'neutral'); fx(l, { karma: 1 }); } },
      { k: 'learn', l: 'Xin bố mẹ cho đi học bơi tử tế', run: function (l, r, log) { l.flags.swim = true; log('Được cho đi học bơi ở hồ bơi huyện. Giờ đã bơi được ếch.', 'good'); fx(l, { hea: 2 }); } }
    ]
  });
  CT('tam_song', function (l, a) { return a >= 8 && a <= 14 && !l.urban && H.inVN(l); }, 4, function (l) { return boy(l) ? 1.3 : 0.6; });

  SC('ban_moi', {
    title: 'Bạn mới chuyển đến', prep: function (l, r) { var s = r() < 0.5 ? 'M' : 'F'; return { n: H.stranger(l, r, s), s: s, why: pick(r, ['nói giọng vùng khác', 'mặc đồ cũ sờn', 'nhút nhát, ít nói', 'đeo kính dày cộp']) }; },
    text: function (l, d) { return 'Lớp có ' + (d.s === 'M' ? 'bạn nam' : 'bạn nữ') + ' mới tên ' + d.n + ' chuyển đến, ' + d.why + '. Mấy đứa trong lớp bắt đầu trêu chọc.'; },
    opts: [
      { k: 'friend', l: 'Rủ bạn ấy chơi cùng', run: function (l, r, log, d) { fx(l, { karma: 4, soc: 3 }); log('Rủ ' + d.n + ' chơi cùng nhóm. Bạn ấy cười lần đầu tiên từ ngày chuyển đến.', 'good'); if (!l.bff && ch(r, 0.4)) { l.bff = { name: d.n, sex: d.s, since: l.age, alive: true, close: 70, token: 'chiếc ảnh chụp chung năm lớp ' + Math.max(1, l.age - 5) }; log('Từ đó ' + d.n + ' thành bạn thân nhất của bạn.', 'good'); H.mem(l, 'Ngày quen ' + d.n + ' — người bạn mới chuyển đến.', 4); } } },
      { k: 'ignore', l: 'Mặc kệ, không phải việc của mình', run: function (l, r, log) { log('Không tham gia, cũng không bênh.', 'neutral'); } },
      { k: 'join', l: 'Hùa theo cả lớp trêu', run: function (l, r, log, d) { fx(l, { karma: -5 }); log('Hùa theo trêu ' + d.n + '. Tối về nằm nghĩ mãi, thấy áy náy.', 'bad'); H.mem(l, 'Lần hùa theo cả lớp trêu ' + d.n + ' — điều bạn ân hận.', 3); } }
    ]
  });
  CT('ban_moi', function (l, a) { return a >= 7 && a <= 13 && l.school; }, 99);

  SC('hoi_khoe', {
    title: 'Hội khỏe Phù Đổng', prep: function (l, r) { return { m: pick(r, boy(l) ? ['chạy 100 mét', 'nhảy xa', 'bóng đá mini', 'đá cầu'] : ['chạy 60 mét', 'nhảy dây', 'cầu lông', 'đá cầu']) }; },
    text: function (l, d) { return 'Trường tổ chức Hội khỏe Phù Đổng. Thầy thể dục gọi bạn vào đội tuyển môn ' + d.m + '.'; },
    opts: [
      { k: 'join', l: 'Đăng ký thi, tập luyện mỗi chiều', run: function (l, r, log, d) { fx(l, { hea: 3 }); if (ch(r, 0.25 + (l.talent === 'thể thao' ? 0.35 : 0))) { log('Giành huy chương vàng môn ' + d.m + ' cấp huyện!', 'big'); talent(l, 'thể thao', 0.3, r); fx(l, { hap: 6 }); H.mem(l, 'Tấm huy chương ' + d.m + ' Hội khỏe Phù Đổng.', 4); } else log('Thi ' + d.m + ' nhưng không có giải. Vui vì được cả lớp cổ vũ.', 'neutral'); } },
      { k: 'cheer', l: 'Từ chối, đứng ngoài cổ vũ', run: function (l, r, log) { log('Ngồi hàng ghế cổ vũ, hét khản cả cổ.', 'neutral'); fx(l, { soc: 2 }); } }
    ]
  });
  CT('hoi_khoe', function (l, a) { return a >= 8 && a <= 14 && l.school && H.inVN(l); }, 3);

  SC('ve_tranh', {
    title: 'Cuộc thi vẽ tranh', prep: function (l, r) { return { t: pick(r, ['Em yêu biển đảo quê hương', 'Ngôi nhà mơ ước', 'Thành phố tương lai', 'Gia đình em', 'Bảo vệ môi trường']) }; },
    text: function (l, d) { return 'Trường phát động cuộc thi vẽ tranh chủ đề "' + d.t + '".'; },
    opts: [
      { k: 'draw', l: 'Thức khuya vẽ thật kỹ', run: function (l, r, log, d) { if (ch(r, 0.25 + (l.talent === 'hội họa' ? 0.45 : 0))) { log('Bức tranh "' + d.t + '" đoạt giải nhất, được treo ở phòng truyền thống.', 'big'); talent(l, 'hội họa', 0.4, r); fx(l, { hap: 6 }); H.mem(l, 'Bức tranh đoạt giải được treo ở trường.', 4); } else { log('Nộp tranh, được giải khuyến khích.', 'good'); fx(l, { hap: 2 }); talent(l, 'hội họa', 0.1, r); } } },
      { k: 'help', l: function (l) { return 'Nhờ ' + (l.fam.mAlive && l.fam.fAlive ? 'bố mẹ' : mom(l)) + ' vẽ giúp'; }, run: function (l, r, log) { fx(l, { karma: -2 }); log(ch(r, 0.4) ? 'Tranh "bố mẹ vẽ" đẹp quá, cô giáo nhìn là biết ngay.' : 'Bức tranh được giải ba. Bạn biết đó không phải tranh của mình.', 'neutral'); } },
      { k: 'skip', l: 'Không tham gia', run: function (l, r, log) { log('Bỏ qua cuộc thi vẽ.', 'neutral'); } }
    ]
  });
  CT('ve_tranh', function (l, a) { return a >= 6 && a <= 12 && l.school; }, 4);

  SC('sinh_nhat', {
    title: 'Sinh nhật', prep: function (l, r) { return { n: l.age }; },
    text: function (l, d) { return 'Sắp đến sinh nhật ' + d.n + ' tuổi. ' + (poor(l) ? 'Nhà không dư dả gì.' : rich(l) ? 'Bố mẹ hỏi con muốn tổ chức thế nào.' : 'Bạn ước có một bữa tiệc nhỏ.'); },
    opts: [
      { k: 'party', l: function (l) { return rich(l) ? 'Tổ chức tiệc ở nhà hàng, mời cả lớp' : 'Mời vài đứa bạn thân đến nhà'; }, req: function (l) { return !poor(l); }, run: function (l, r, log) { cashB(l, rich(l) ? -0.03 : -0.005, 'Tiệc sinh nhật'); fx(l, { hap: 5, soc: 3 }); log(rich(l) ? 'Tiệc sinh nhật ở nhà hàng, có cả ảo thuật gia. Cả lớp trầm trồ.' : 'Mấy đứa bạn đến nhà, cùng thổi nến, ăn bánh kem.', 'good'); if (ch(r, 0.25)) H.mem(l, 'Bữa tiệc sinh nhật ' + l.age + ' tuổi.', 2); } },
      { k: 'simple', l: 'Chỉ cần cả nhà ăn một bữa cơm', run: function (l, r, log) { fx(l, { hap: 3 }); var M = mom(l).charAt(0).toUpperCase() + mom(l).slice(1), vn = H.inVN(l) || (H.hasVNOrigin && H.hasVNOrigin(l)); log(poor(l) ? pick(r, vn ? [M + ' luộc cho quả trứng, cắm một cây nến lên bát xôi. Bạn nhớ mãi.', M + ' nấu nồi chè đậu đen, cả nhà ngồi hát chúc mừng sinh nhật.', 'Được ' + mom(l) + ' mua cho gói bánh và một que kem — vậy là vui cả ngày.'] : [M + ' làm một chiếc bánh nhỏ tại nhà, cắm một cây nến chúc mừng. Bạn nhớ mãi.', M + ' nấu món ăn bạn thích nhất, cả nhà ngồi hát chúc mừng sinh nhật.', 'Được ' + mom(l) + ' mua cho gói bánh ngọt và một que kem — vậy là vui cả ngày.']) : pick(r, ['Cả nhà ăn bữa cơm, ' + mom(l) + ' mua cái bánh kem nhỏ.', 'Cả nhà đi ăn cùng nhau, thổi nến trên chiếc bánh kem có tên mình.', M + ' tự tay làm bánh, vẽ chữ chúc mừng méo xệch mà ngon lạ.']), 'good'); if (poor(l)) H.mem(l, vn ? 'Cây nến cắm trên bát xôi ngày sinh nhật.' : 'Chiếc bánh nhỏ tự làm với một cây nến ngày sinh nhật.', 4); } },
      { k: 'gift', l: 'Xin một món quà thay vì tiệc', run: function (l, r, log) { var g = pick(r, boy(l) ? ['bộ lego', 'quả bóng đá', 'xe đạp mới', 'bộ truyện tranh'] : ['con gấu bông to', 'bộ bút màu', 'chiếc váy mới', 'bộ truyện tranh']); fx(l, { hap: 4 }); log('Được tặng ' + g + ' — món quà sinh nhật nhớ nhất tuổi thơ.', 'good'); } }
    ]
  });
  CT('sinh_nhat', function (l, a) { return a >= 4 && a <= 13; }, 3);

  SC('to_ong', {
    title: 'Tổ ong trên cây', text: 'Đám bạn phát hiện một tổ ong vò vẽ to bằng quả bưởi trên cây sau nhà, rủ nhau lấy que chọc.',
    opts: [
      { k: 'poke', l: 'Chọc thử xem sao', run: function (l, r, log) { if (ch(r, 0.55)) { log('Ong vỡ tổ bay ra, bị đốt sưng vù mặt, phải đi trạm xá.', 'bad'); fx(l, { hea: -6, hap: -3 }); H.mem(l, 'Lần bị ong đốt sưng mặt vì chọc tổ ong.', 3); } else { log('Chọc xong cả bọn chạy thục mạng, may không ai bị đốt.', 'neutral'); fx(l, { hap: 2 }); } } },
      { k: 'tell', l: 'Về báo người lớn', run: function (l, r, log) { fx(l, { karma: 2 }); log('Về báo người lớn. ' + 'Tối đó ' + dad(l) + ' gọi người đến đốt tổ ong.', 'good'); } }
    ]
  });
  CT('to_ong', function (l, a) { return a >= 5 && a <= 11 && !l.urban; }, 99, function (l) { return boy(l) ? 1.3 : 0.6; });

  SC('dien_thoai_be', {
    title: function (l) { return 'Chiếc điện thoại của ' + mom(l); }, text: function (l) { return 'Nhân lúc ' + mom(l) + ' ngủ trưa, bạn lén lấy điện thoại. Mật khẩu là ngày sinh của bạn.'; },
    opts: [
      { k: 'yt', l: 'Xem hoạt hình trên mạng', run: function (l, r, log) { fx(l, { hap: 2, kno: -1 }); log('Xem hoạt hình liền ba tiếng, mắt đỏ hoe.', 'neutral'); } },
      { k: 'game', l: 'Tải game về chơi', run: function (l, r, log) { if (ch(r, 0.25)) { cashB(l, -0.01, 'Lỡ nạp tiền trong game'); log('Bấm nhầm nạp tiền trong game, tài khoản ' + mom(l) + ' bị trừ cả trăm nghìn. Ăn một trận đòn nhớ đời.', 'bad'); fx(l, { hap: -4 }); } else { log('Chơi game cả buổi chiều, giấu điện thoại về chỗ cũ trót lọt.', 'neutral'); fx(l, { hap: 2 }); } } },
      { k: 'no', l: 'Thôi, trả lại chỗ cũ', run: function (l, r, log) { fx(l, { karma: 1 }); log('Đặt điện thoại về chỗ cũ, ra sân chơi.', 'neutral'); } }
    ]
  });
  CT('dien_thoai_be', function (l, a) { return a >= 4 && a <= 9 && (l.birthYear + a) >= 2007 && (l.urban || l.fam.q >= 3) && (l.fam.mAlive || l.fam.fAlive); }, 99);

  SC('da_bong_vo_kinh', {
    title: 'Quả bóng bay qua cửa kính', text: 'Đang đá bóng ngoài ngõ, bạn sút một quả thật mạnh — "choang!" — cửa kính nhà bác hàng xóm vỡ tan.',
    opts: [
      { k: 'admit', l: 'Sang nhận lỗi', run: function (l, r, log) { fx(l, { karma: 4 }); cashB(l, -0.005, 'Đền cửa kính'); log('Sang nhận lỗi, ' + dad(l) + ' đền tiền kính. Bác hàng xóm còn khen thật thà.', 'good'); } },
      { k: 'run', l: 'Cả bọn bỏ chạy', run: function (l, r, log) { fx(l, { karma: -3 }); if (ch(r, 0.5)) { log('Bác hàng xóm cầm quả bóng sang tận nhà. Bị ' + dad(l) + ' phạt quỳ cả buổi.', 'bad'); fx(l, { hap: -3 }); } else log('Chạy thoát. Mất luôn quả bóng.', 'neutral'); } }
    ]
  });
  CT('da_bong_vo_kinh', function (l, a) { return a >= 7 && a <= 13 && boy(l); }, 99);

  SC('thach_danh', {
    title: 'Lời thách sau giờ học', prep: function (l, r) { return { n: H.stranger(l, r, 'M') }; },
    text: function (l, d) { return d.n + ' lớp bên cạnh thách bạn ra sau trường "nói chuyện" vì một câu đùa trên mạng.'; },
    opts: [
      { k: 'fight', l: 'Ra đánh nhau', run: function (l, r, log, d) { fx(l, { karma: -2 }); if (ch(r, 0.5)) { log('Đánh nhau một trận, mặt mũi bầm dập. Cả hai bị mời phụ huynh, viết bản kiểm điểm.', 'bad'); fx(l, { hea: -4, hap: -3 }); } else { log('Đánh thắng ' + d.n + '. Từ đó không ai dám trêu bạn — nhưng bị hạ hạnh kiểm.', 'neutral'); fx(l, { soc: 2 }); } } },
      { k: 'talk', l: 'Gặp nhưng nói chuyện cho ra lẽ', run: function (l, r, log, d) { fx(l, { karma: 3 }); log(ch(r, 0.6) ? 'Hóa ra hiểu lầm. Hai đứa bắt tay, sau thành bạn.' : 'Nói mãi không xong, nhưng cũng không ai động tay.', 'good'); } },
      { k: 'teacher', l: 'Báo thầy chủ nhiệm', run: function (l, r, log) { log('Báo thầy, thầy gọi cả hai lên hòa giải.', 'neutral'); fx(l, { soc: -1 }); } }
    ]
  });
  CT('thach_danh', function (l, a) { return a >= 11 && a <= 15 && l.school; }, 99, function (l) { return boy(l) ? 1.5 : 0.1; });

  SC('dua_xe_dap', {
    title: 'Con dốc đầu làng', text: 'Tụi bạn thách đua xe đạp thả dốc, ai bóp phanh trước là thua.',
    opts: [
      { k: 'race', l: 'Đua, không bóp phanh', run: function (l, r, log) { if (ch(r, 0.25)) { log('Mất lái lao xuống ruộng, gãy tay phải bó bột cả tháng.', 'bad'); fx(l, { hea: -8 }); H.mem(l, 'Cánh tay bó bột sau lần thả dốc không phanh.', 3); } else { log('Về nhất! Gió thổi rát mặt, sướng run người.', 'good'); fx(l, { hap: 4, soc: 2 }); } } },
      { k: 'safe', l: 'Vừa đi vừa bóp phanh', run: function (l, r, log) { log('Thua cuộc, bị trêu "nhát gan". Nhưng không trầy xước gì.', 'neutral'); } }
    ]
  });
  CT('dua_xe_dap', function (l, a) { return a >= 10 && a <= 14 && boy(l) && !l.urban; }, 99);

  SC('kpop', {
    title: 'Thần tượng', prep: function (l, r) { return { n: l.idol || H.pickIdol(r, l) }; },
    text: function (l, d) { return 'Bạn mê ' + d.n + ' như điếu đổ. Album mới ra mắt, kèm thẻ ảnh có chữ ký — đắt bằng tiền tiêu vặt ba tháng.'; },
    opts: [
      { k: 'buy', l: 'Nhịn ăn sáng để mua', run: function (l, r, log, d) { if (!l.idol) l.idol = d.n; cashB(l, -0.004, 'Album ' + d.n); fx(l, { hap: 5, hea: -1 }); log('Ôm album ' + d.n + ' về, mở ra trúng đúng thẻ ảnh mình thích nhất. Hét ầm cả nhà.', 'good'); H.mem(l, 'Chiếc album ' + d.n + ' mua bằng tiền nhịn ăn sáng.', 3); } },
      { k: 'fanclub', l: 'Tham gia fanclub, cày view cho thần tượng', run: function (l, r, log, d) { if (!l.idol) l.idol = d.n; fx(l, { soc: 3, kno: -1 }); log('Thức khuya cày view, bình chọn cho ' + d.n + ' cùng hội bạn trên mạng.', 'neutral'); } },
      { k: 'no', l: 'Thôi, nghe nhạc thôi là đủ', run: function (l, r, log) { log('Chỉ nghe nhạc, dán poster trong phòng.', 'neutral'); } }
    ]
  });
  CT('kpop', function (l, a) { return a >= 11 && a <= 15 && (!!l.idol || !isVN(l)); }, 4, function (l) { return girl(l) ? 1.6 : 0.4; });

  SC('nau_com', {
    title: 'Lần đầu vào bếp', text: function (l) { return (l.fam.mAlive ? 'Mẹ' : 'Bố') + ' về muộn. Lần đầu tiên bạn tự nấu bữa tối cho cả nhà.'; },
    opts: [
      { k: 'cook', l: 'Nấu cơm, rán trứng, luộc rau', run: function (l, r, log) { if (ch(r, 0.35)) { log('Cơm khê, trứng cháy. Cả nhà vẫn ăn hết, còn khen ngon.', 'good'); } else log('Bữa cơm đầu tay tròn vị. ' + (l.fam.mAlive ? 'Mẹ' : 'Bố') + ' về ngạc nhiên lắm.', 'good'); fx(l, { hap: 3, karma: 2 }); H.mem(l, 'Bữa cơm đầu tiên tự tay nấu cho cả nhà.', 3); } },
      { k: 'noodle', l: 'Úp mì gói cho nhanh', run: function (l, r, log) { log('Úp gói mì, ăn xong ngồi chờ người lớn về.', 'neutral'); } }
    ]
  });
  CT('nau_com', function (l, a) { return a >= 9 && a <= 14 && (l.fam.mAlive || l.fam.fAlive); }, 99, function (l) { return girl(l) ? 1.3 : 0.9; });

  SC('son_moi', {
    title: 'Thỏi son của mẹ', text: function (l) { return 'Thấy mấy bạn trong lớp đánh son, bạn lén lấy thỏi son của ' + (l.fam.mAlive ? 'mẹ' : 'chị họ') + ' bỏ vào cặp.'; },
    opts: [
      { k: 'wear', l: 'Đánh son đi học', run: function (l, r, log) { if (ch(r, 0.5)) { log('Bị cô chủ nhiệm nhắc nhở trước lớp, xấu hổ đỏ mặt.', 'bad'); fx(l, { hap: -2 }); } else { log('Cả nhóm bạn khen xinh. Vui cả ngày.', 'good'); fx(l, { hap: 3, soc: 2 }); } talent(l, 'làm đẹp', 0.15, r); } },
      { k: 'ask', l: 'Xin mẹ dạy trang điểm nhẹ nhàng', req: function (l) { return l.fam.mAlive; }, run: function (l, r, log) { fx(l, { soc: 2 }); log('Mẹ cười, dạy bạn cách tô son nhẹ cho hợp tuổi. Hai mẹ con nói chuyện cả buổi tối.', 'good'); talent(l, 'làm đẹp', 0.2, r); } },
      { k: 'back', l: 'Trả lại chỗ cũ', run: function (l, r, log) { log('Lặng lẽ đặt thỏi son về bàn trang điểm.', 'neutral'); } }
    ]
  });
  CT('son_moi', function (l, a) { return a >= 12 && a <= 15 && girl(l); }, 99);

  SC('toc_dai', {
    title: 'Mái tóc', text: function (l) { return 'Hè này ' + mom(l) + ' muốn cắt tóc bạn thật ngắn cho mát, đỡ chấy. Bạn thì muốn nuôi tóc dài như mấy chị trong xóm.'; },
    opts: [
      { k: 'long', l: 'Năn nỉ được để tóc dài', run: function (l, r, log) { fx(l, { hap: 3 }); log('Được nuôi tóc dài, sáng nào cũng tự tết tóc đi học.', 'good'); } },
      { k: 'short', l: 'Cắt ngắn cho gọn', run: function (l, r, log) { log('Cắt tóc ngắn cũn, cả tuần không dám soi gương. Nhưng mà mát thật.', 'neutral'); } },
      { k: 'dye', l: 'Đòi nhuộm highlight như idol', run: function (l, r, log) { if (ch(r, 0.3)) { log('Được cho nhuộm mấy lọn tóc màu hồng. Đầu năm học bị nhà trường bắt nhuộm đen lại.', 'neutral'); fx(l, { hap: 2 }); } else { log('Bị mắng: "Học sinh nhuộm tóc cái gì!"', 'bad'); fx(l, { hap: -1 }); } } }
    ]
  });
  CT('toc_dai', function (l, a) { return a >= 7 && a <= 13 && girl(l) && (l.fam.mAlive || l.fam.fAlive); }, 99);

  SC('thu_nac_danh', {
    title: 'Lá thư không tên', text: 'Mở ngăn bàn, bạn thấy một lá thư gấp hình trái tim, không đề tên người gửi, chỉ ghi: "Tớ thích cậu từ hồi đầu năm."',
    opts: [
      { k: 'find', l: 'Âm thầm tìm xem ai gửi', run: function (l, r, log) { log(ch(r, 0.5) ? 'Nhận ra nét chữ của bạn cùng lớp ngồi bàn cuối. Hai đứa ngại không dám nhìn nhau.' : 'Tìm mãi không ra. Lá thư được cất kỹ trong hộp bút.', 'good'); fx(l, { hap: 4 }); H.mem(l, 'Lá thư gấp hình trái tim trong ngăn bàn năm ' + l.age + ' tuổi.', 3); } },
      { k: 'show', l: 'Đưa cho bạn thân xem', run: function (l, r, log) { log(ch(r, 0.4) ? 'Bạn thân lỡ miệng, cả lớp biết chuyện. Trêu suốt cả tháng.' : 'Hai đứa thì thầm đoán già đoán non cả buổi.', 'neutral'); fx(l, { soc: 1 }); } },
      { k: 'throw', l: 'Vứt đi, đang tuổi ăn tuổi học', run: function (l, r, log) { log('Vứt lá thư đi. Tự nhủ phải tập trung học.', 'neutral'); fx(l, { kno: 1 }); } }
    ]
  });
  CT('thu_nac_danh', function (l, a) { return a >= 11 && a <= 15 && l.school; }, 99, function (l) { return girl(l) ? 1.3 : 0.8; });

  SC('nap_game', {
    title: 'Skin mới ra mắt', prep: function (l, r) { var vn = H.inVN(l); return { g: l.game || pick(r, girl(l) ? ['Play Together', 'Roblox', vn ? 'Liên Quân Mobile' : 'Mobile Legends', 'Minecraft'] : [vn ? 'Liên Quân Mobile' : 'Mobile Legends: Bang Bang', 'Free Fire', 'PUBG Mobile', 'Roblox', 'Minecraft']) }; },
    text: function (l, d) { return d.g + ' vừa ra skin giới hạn. Cả nhóm bạn đều có, chỉ mình bạn chưa.'; },
    opts: [
      { k: 'beg', l: 'Năn nỉ bố mẹ nạp tiền', run: function (l, r, log) { if (!poor(l) && ch(r, 0.4)) { cashB(l, -0.002, 'Nạp game'); log('Được nạp cho một lần, với điều kiện cuối kỳ phải học khá.', 'neutral'); fx(l, { hap: 3 }); } else { log('Bị từ chối thẳng: "Tiền đâu mà nạp game!"', 'neutral'); fx(l, { hap: -1 }); } } },
      { k: 'card', l: 'Lén lấy tiền mua thẻ cào', run: function (l, r, log) { fx(l, { karma: -4 }); if (ch(r, 0.5)) { log('Bị phát hiện lấy tiền trong ví. Ăn một trận đòn, bị cấm chơi game cả tháng.', 'bad'); fx(l, { hap: -5 }); } else { log('Nạp được skin mới. Nhưng lòng thấp thỏm mãi.', 'neutral'); fx(l, { hap: 2 }); } } },
      { k: 'no', l: 'Kệ, chơi đồ mặc định cũng được', run: function (l, r, log) { fx(l, { karma: 1 }); log('Chơi bằng trang phục mặc định, vẫn thắng đều.', 'good'); } }
    ]
  });
  CT('nap_game', function (l, a) { return a >= 9 && a <= 15 && (l.birthYear + a) >= 2006; }, 4, function (l) { return l.talent === 'game' ? 2 : boy(l) ? 1 : 0.35; });

  SC('tiktok', {
    title: 'Video đầu tiên', prep: function (l, r) { return { t: pick(r, girl(l) ? ['nhảy theo bài hát đang hot', 'trang điểm biến hình', 'nấu món ăn vặt', 'hát cover'] : ['chơi game hài hước', 'tâng bóng', 'troll em ở nhà', 'hát cover']) }; },
    text: function (l, d) { return 'Bạn quay một video ' + d.t + ' đăng lên mạng.'; },
    opts: [
      { k: 'post', l: 'Đăng công khai', run: function (l, r, log, d) { if (ch(r, 0.08)) { log('Video ' + d.t + ' bất ngờ viral, cả trường nhận ra bạn!', 'big'); l.fame = (l.fame || 0) + 3000; fx(l, { hap: 6, soc: 3 }); H.mem(l, 'Video ' + d.t + ' viral năm ' + l.age + ' tuổi.', 4); } else if (ch(r, 0.15)) { log('Bị một nhóm vào bình luận chê bai ác ý. Buồn mất mấy hôm.', 'bad'); fx(l, { hap: -4 }); if (l.mind) l.mind.stress += 5; } else { log('Video được vài trăm lượt xem, đủ vui.', 'neutral'); fx(l, { hap: 2 }); } } },
      { k: 'friends', l: 'Chỉ để chế độ bạn bè', run: function (l, r, log) { log('Chỉ bạn bè xem, ai cũng thả tim.', 'good'); fx(l, { hap: 2 }); } }
    ]
  });
  CT('tiktok', function (l, a) { return a >= 12 && a <= 15 && (l.birthYear + a) >= 2010 && (l.urban || l.fam.q >= 3); }, 99);

  SC('meo_ket', {
    title: 'Chú mèo trên cây', text: 'Một chú mèo con kêu thảm thiết trên ngọn cây trước cổng trường, không trèo xuống được.',
    opts: [
      { k: 'climb', l: 'Trèo lên cứu', run: function (l, r, log) { if (ch(r, 0.2)) { log('Cứu được mèo nhưng bị cào xước cả tay, lại ngã trầy chân.', 'neutral'); fx(l, { hea: -2, karma: 3 }); } else { log('Trèo lên ôm được chú mèo xuống. Cả đám học sinh vỗ tay.', 'good'); fx(l, { karma: 4, hap: 3 }); } H.chain(l, 'meo_theo'); } },
      { k: 'adult', l: 'Gọi bác bảo vệ giúp', run: function (l, r, log) { log('Bác bảo vệ bắc thang đưa mèo xuống. Bạn ôm chú mèo vào lòng vuốt ve mãi.', 'good'); fx(l, { karma: 2 }); H.chain(l, 'meo_theo'); } },
      { k: 'leave', l: 'Đi qua, sợ muộn học', run: function (l, r, log) { log('Đi qua, cả buổi học cứ nghĩ đến chú mèo.', 'neutral'); } }
    ]
  });
  CT('meo_ket', function (l, a) { return a >= 6 && a <= 13 && l.school; }, 99);
  // v6.5: chú mèo mến bạn — được chọn mang về hay không, mang về thì có thú cưng thật và đặt tên
  SC('meo_theo', {
    title: 'Chú mèo đi theo bạn',
    text: function (l) { return 'Tan học, chú mèo con cứ lẽo đẽo đi theo sau, dụi đầu vào chân bạn rồi kêu meo meo. Có vẻ nó đã mến bạn và muốn được về với bạn.' + (H.pets(l).length >= 3 ? ' Nhưng nhà đã nuôi khá nhiều con vật rồi.' : ''); },
    opts: [
      { k: 'take', l: 'Ôm mèo về, xin bố mẹ cho nuôi', h: function (l) { return H.pets(l).length >= 3 ? 'Nhà đã đủ thú cưng' : 'Có thêm một người bạn nhỏ · được đặt tên'; }, req: function (l) { return H.pets(l).length < 3; }, ai: { soc: 1, w: 1.3 }, run: function (l, r, log) { var p = H.addPet(l, r, 'mèo', 'mèo ta', pick(r, ['Mun', 'Cam', 'Bé Mèo', 'Sữa', 'Mướp', 'Bông'])); log((l.fam.q <= 1 ? 'Bố mẹ thở dài vì nhà còn chật vật, nhưng rồi cũng gật đầu. ' : 'Bố mẹ mỉm cười gật đầu. ') + 'Từ nay nhà có thêm chú mèo ' + p.n + '.', 'good'); fx(l, { hap: 5, karma: 1 }); l.flags.meoTheo = true; H.mem(l, 'Ôm chú mèo con đi theo mình từ cổng trường về nhà.', 3); } },
      { k: 'friend', l: 'Nhờ bạn cùng lớp mang về nuôi giúp', ai: { w: 0.8 }, run: function (l, r, log) { log('Đứa bạn thân reo lên nhận nuôi. Thỉnh thoảng bạn lại sang nhà nó chơi với chú mèo.', 'good'); fx(l, { hap: 2, soc: 1 }); } },
      { k: 'leave', l: 'Vuốt ve rồi để nó ở lại trường', ai: { w: 0.6 }, run: function (l, r, log) { log('Bạn vuốt ve chú mèo rồi đi về. Mấy hôm sau, bác bảo vệ bắt đầu cho nó ăn cơm thừa.', 'neutral'); } }
    ]
  });

  SC('chuyen_ma', {
    title: 'Đêm kể chuyện ma', text: 'Mất điện. Đám trẻ trong xóm ngồi quây quần, thằng lớn nhất bắt đầu kể chuyện ma ở cây đa đầu làng.',
    opts: [
      { k: 'listen', l: 'Ngồi nghe đến hết', run: function (l, r, log) { log(ch(r, 0.5) ? 'Nghe xong cả đêm không dám đi vệ sinh một mình.' : 'Nghe xong cười ha hả, chẳng sợ gì.', 'neutral'); fx(l, { soc: 2 }); } },
      { k: 'dare', l: 'Nhận lời thách ra cây đa một mình', run: function (l, r, log) { fx(l, { soc: 3 }); if (ch(r, 0.3)) { log('Ra đến nơi thì một con cú vụt bay ra, chạy về một mạch, ngã trầy đầu gối.', 'neutral'); fx(l, { hea: -2 }); } else { log('Ra cây đa một mình rồi về, được cả bọn phong "gan dạ nhất xóm".', 'good'); fx(l, { hap: 3 }); H.mem(l, 'Đêm một mình ra cây đa đầu làng.', 2); } } },
      { k: 'home', l: function (l) { return 'Chạy về nhà với ' + mom(l); }, run: function (l, r, log) { log('Chạy về nhà rúc vào lòng người lớn.', 'neutral'); } }
    ]
  });
  CT('chuyen_ma', function (l, a) { return a >= 6 && a <= 12 && H.inVN(l); }, 99);

  SC('choi_le_hoi', {
    title: function (l) { return H.inVN(l) ? 'Hội làng' : 'Lễ hội trong vùng'; }, prep: function (l, r) { return { x: 0.003 }; },
    text: function (l) { return (H.inVN(l) ? 'Làng mở hội: có đu quay, bắn súng nước trúng thưởng, kẹo kéo, tò he.' : 'Lễ hội trong vùng có vòng quay, trò chơi trúng thưởng, quầy bánh kẹo.') + ' Trong túi bạn có ít tiền ' + (H.inVN(l) ? 'mừng tuổi' : 'tiêu vặt') + '.'; },
    opts: [
      { k: 'game', l: 'Chơi trò trúng thưởng', run: function (l, r, log, d) { cashB(l, -d.x, 'Chơi hội'); log(ch(r, 0.2) ? 'Trúng một con gấu bông to, ôm về khoe cả xóm!' : 'Tiêu hết tiền mà không trúng gì. Bài học đầu đời về "trò may rủi".', 'neutral'); fx(l, { hap: 2 }); } },
      { k: 'eat', l: function (l) { return H.inVN(l) ? 'Mua đồ ăn vặt, tò he' : 'Mua kẹo bông, đồ ăn lễ hội'; }, run: function (l, r, log, d) { cashB(l, -d.x, 'Đồ ăn lễ hội'); log(H.inVN(l) ? 'Mua tò he hình con gà, kẹo kéo dài cả gang tay.' : 'Mua cây kẹo bông to đùng và bánh nướng thơm lừng.', 'good'); fx(l, { hap: 3 }); } },
      { k: 'save', l: 'Đi xem, giữ tiền lại', run: function (l, r, log) { log('Đi xem một vòng, về nhà còn nguyên tiền.', 'neutral'); fx(l, { kno: 1 }); } }
    ]
  });
  CT('choi_le_hoi', function (l, a) { return a >= 4 && a <= 11; }, 4);

  // quán net: con gái ít được rủ đi net hơn (trừ khi có năng khiếu game)
  E.TRIG.forEach(function (t) {
    if (t.id === 'net_coi') { var p0 = t.p; t.p = function (l, a) { var p = typeof p0 === 'function' ? p0(l, a) : p0; return girl(l) && l.talent !== 'game' ? p * 0.15 : p; }; t.cw = function (l) { return girl(l) && l.talent !== 'game' ? 0.1 : 1; }; }
    if (t.id === 'quay_cop' || t.id === 'bat_nat') t.cw = 0.8;
  });
  E.childhood = { kidLines: kidLines, fresh: fresh };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
