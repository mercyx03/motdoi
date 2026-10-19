/* Một Đời — v6.5.0
   · thêm nhiều chuyện tuổi thơ đa dạng, mỗi chuyện có nhiều cách mở đầu / kết quả ngẫu nhiên
   · khi bạn mất: từng người con phản ứng theo đúng con người của mình (đứa con hư hỏng nghẹn ngào nhận ra bố / mẹ đã hy sinh thế nào,
     đứa con thành đạt, đứa con ở xa, đứa con còn nhỏ, đứa con đang thụ án…)
   · sống tiếp đời con: chọn bắt đầu từ lúc chào đời (bố / mẹ ra đi đúng tuổi, để lại đúng phần thừa kế)
     hoặc tiếp tục ngay ở tuổi hiện tại của con và nhận thừa kế */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC;
  function vnd(l) { return H.isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  function V(l, tr) { return vnd(l) ? tr : tr / 90 * l.base; }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped); }
  function m(l) { return l.fam.mAlive ? 'mẹ' : l.fam.fAlive && !l.fam.noDad ? 'bố' : 'bà'; }
  function b(l) { return l.fam.fAlive && !l.fam.noDad ? 'bố' : l.fam.mAlive ? 'mẹ' : 'ông'; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function both(l) { return l.fam.mAlive && l.fam.fAlive && !l.fam.noDad; }
  function vn(l) { return H.isVN(l) && l.mode === 'vn'; }
  function rural(l) { return !l.urban; }
  function school(l) { return !!l.school; }
  function txt(t, l, r) { if (typeof t === 'function') t = t(l, r); if (Array.isArray(t)) t = pick(r, t); return t; }

  // ===================================================================
  // 1. CHUYỆN TUỔI THƠ — mỗi chuyện chỉ gặp một lần, mở đầu ngẫu nhiên, kết quả ngẫu nhiên
  //    lựa chọn: { k, l, ai, req, h, cost, out: [[xác suất, lời kể, chỉ số, sắc thái], …], fail }
  // ===================================================================
  function KID(id, a0, a1, title, texts, opts, when, cw) {
    if (!Array.isArray(texts)) texts = [texts];
    SC(id, {
      title: title,
      prep: function (l, r) { return { v: Math.floor(r() * texts.length) }; },
      text: function (l, d) { var t = texts[(d && d.v) || 0] || texts[0]; return typeof t === 'function' ? t(l) : t; },
      opts: opts.map(function (o) {
        return { k: o.k, l: o.l, h: o.h || '', req: o.req, ai: o.ai || { w: 1 }, run: function (l, r, log, d) {
          if (o.cost) { var c = V(l, o.cost), bill = !l.indep && E.childExpense ? E.childExpense(l, c, o.why || title, false) : null;
            if (bill) { if (!bill.ok) { log(txt(o.fail || 'Nhà chưa có điều kiện cho khoản này.', l, r), 'neutral'); return; } log(bill.note, 'neutral'); }
            else if (l.money >= c) H.cash(l, -c, o.why || title); else { log(txt(o.fail || 'Chưa đủ tiền cho khoản này.', l, r), 'neutral'); return; } }
          var x = r(), acc = 0, out = o.out[o.out.length - 1];
          for (var i = 0; i < o.out.length; i++) { acc += o.out[i][0]; if (x < acc) { out = o.out[i]; break; } }
          log(txt(out[1], l, r), out[3] || 'neutral'); if (out[2]) H.fx(l, out[2]);
          if (out[4]) out[4](l, r, log, d);
        } };
      })
    });
    E.TRIG.push({ id: id, when: function (l, a) { return a >= a0 && a <= a1 && free(l) && (!when || when(l, a)); }, p: 0.08, cd: 99, child: true, cw: cw || 1, max: 1 });
  }
  function mem(t, w) { return function (l) { H.mem(l, t, w || 2); }; }
  function stress(n) { return function (l) { if (l.mind) l.mind.stress = U.clamp((l.mind.stress || 0) + n, 0, 100); }; }

  KID('k6_lac_cho', 3, 6, 'Lạc mất mẹ', [
    function (l) { return 'Theo ' + m(l) + ' đi chợ, mải nhìn sạp đồ chơi, quay lại thì không thấy ' + m(l) + ' đâu.'; },
    function (l) { return 'Đi siêu thị cùng ' + m(l) + ', bạn mải ngắm tủ kem rồi lạc lúc nào không hay.'; },
    function (l) { return 'Hội chợ đông nghịt người. Bàn tay đang nắm bỗng tuột mất, xung quanh toàn người lạ.'; }], [
    { k: 'dung', l: 'Đứng yên tại chỗ, khóc to gọi mẹ', out: [[1, function (l) { return cap(m(l)) + ' hớt hải quay lại, ôm chầm lấy bạn. Cả hai cùng khóc.'; }, { hap: -1 }, 'neutral']] },
    { k: 'nho', l: 'Nhờ cô bán hàng / chú bảo vệ giúp', ai: { smart: 1, w: 1.2 }, out: [[1, function (l) { return 'Cô bán hàng gọi loa, mấy phút sau ' + m(l) + ' chạy tới. Ai cũng khen bạn khôn.'; }, { kno: 1, soc: 1 }, 'good']] },
    { k: 'chay', l: 'Chạy đi tìm khắp nơi', ai: { risk: 1 }, out: [[0.5, 'Chạy lung tung càng lạc xa hơn, mãi tới chiều mới có người tốt bụng dắt về nhà.', { hap: -3 }, 'bad', stress(4)], [0.5, function (l) { return 'May sao chạy ra đúng cổng thì gặp ' + m(l) + ' đang cuống cuồng tìm.'; }, null, 'neutral']] }]);

  KID('k6_ve_tuong', 3, 6, 'Bức tranh trên tường', ['Nhà vừa quét vôi trắng tinh, bạn cầm bút sáp vẽ kín một mảng tường.', 'Bạn lấy son của mẹ vẽ một con mèo thật to lên cửa tủ.'], [
    { k: 'khoe', l: 'Hớn hở khoe với bố mẹ', out: [[0.5, 'Bố mẹ dở khóc dở cười, rồi chụp ảnh "tác phẩm" làm kỷ niệm. Bức ảnh ấy được giữ mấy chục năm.', { hap: 3 }, 'good', mem('Bức tranh bút sáp đầu tiên trên tường nhà.', 2)], [0.5, 'Bị mắng một trận, phải cầm giẻ lau cả buổi chiều.', { hap: -2 }, 'bad']] },
    { k: 'giau', l: 'Kéo ghế che lại', out: [[1, 'Mấy tháng sau dọn nhà mới lộ ra, cả nhà cười lăn.', { hap: 2 }, 'neutral']] }]);

  KID('k6_karaoke', 5, 10, 'Ca sĩ nhí đám cưới', ['Đám cưới chị họ, chú MC mời "ca sĩ nhí" của gia đình lên hát một bài.', 'Liên hoan cuối năm của cơ quan bố mẹ, mọi người giục bạn lên hát.'], [
    { k: 'hat', l: 'Mạnh dạn cầm micro', ai: { soc: 1 }, out: [[0.6, 'Hát lạc tông nhưng cả hội trường vỗ tay rần rần, còn được dúi mấy phong bao lì xì.', { hap: 3, soc: 2 }, 'good'], [0.4, function (l) { return 'Đứng trên sân khấu thì quên sạch lời, chạy tót xuống trốn sau lưng ' + m(l) + '.'; }, { hap: -1 }, 'neutral']] },
    { k: 'tron', l: 'Lắc đầu, nấp sau lưng mẹ', out: [[1, 'Nấp kỹ, chỉ dám ngồi ăn hết đĩa nem rán.', null, 'neutral']] }]);

  KID('k6_ca_vang', 5, 10, 'Chú cá vàng nổi bụng', 'Sáng ra, chú cá vàng trong bể nổi lên mặt nước, không bơi nữa.', [
    { k: 'chon', l: 'Chôn cá dưới gốc cây, cắm một que kem làm bia', ai: { w: 1.2 }, out: [[1, 'Bạn chôn cá dưới gốc cây, cắm que kem làm bia. Lần đầu tiên hiểu thế nào là mất đi.', { hap: -2, karma: 1 }, 'neutral', mem('Chôn chú cá vàng dưới gốc cây, lần đầu hiểu thế nào là mất đi.', 2)]] },
    { k: 'hoi', l: 'Hỏi bố mẹ vì sao cá chết', ai: { smart: 1 }, out: [[1, 'Bố mẹ giải thích về nước bẩn, cho ăn quá nhiều. Bạn hứa lần sau sẽ chăm kỹ hơn.', { kno: 2 }, 'neutral']] },
    { k: 'khoc', l: 'Khóc cả ngày', out: [[1, 'Khóc cả ngày, tối được bố dắt đi mua hai con cá mới.', { hap: -1 }, 'neutral']] }], function (l) { return l.fam.q >= 2; });

  KID('k6_quy_lop', 8, 12, 'Tiền quỹ lớp', 'Cô giao bạn giữ tiền quỹ lớp. Một hôm đếm lại, thiếu mất một ít.', [
    { k: 'bao', l: 'Báo thật với cô', ai: { moral: 1, w: 1.2 }, out: [[0.7, 'Cô không trách, cả lớp kiểm lại thì ra một bạn ghi sổ nhầm. Cô càng tin bạn.', { karma: 3, soc: 1 }, 'good'], [0.3, 'Không tìm ra chỗ thiếu, cô bảo cả lớp góp thêm. Bạn được khen vì trung thực.', { karma: 3 }, 'good']] },
    { k: 'bu', l: 'Lặng lẽ đập heo đất bù vào', out: [[1, 'Đập heo đất bù vào. Không ai biết, nhưng bạn thấy mình đã làm đúng.', { karma: 2, hap: -1 }, 'neutral']] },
    { k: 'giau', l: 'Im lặng, mong không ai phát hiện', ai: { bad: 1 }, out: [[0.5, 'Cuối kỳ thiếu tiền, cả lớp xì xào. Bạn mất chức thủ quỹ.', { soc: -3, karma: -2 }, 'bad'], [0.5, 'Không ai để ý, nhưng bạn áy náy suốt cả năm.', { hap: -2 }, 'neutral']] }], school);

  KID('k6_nghi_oan', 8, 13, 'Bị nghi oan', ['Bạn cùng bàn mất tiền ăn sáng, có đứa chỉ tay về phía bạn.', 'Chiếc máy tính cầm tay của lớp trưởng biến mất, mấy đứa nhìn bạn đầy nghi ngờ.'], [
    { k: 'hoi', l: 'Bình tĩnh nhờ cô tìm hiểu rõ', ai: { smart: 1, w: 1.2 }, out: [[1, 'Mọi chuyện sáng tỏ: món đồ rơi ở ngăn bàn khác. Bạn kia đỏ mặt xin lỗi.', { soc: 2 }, 'good']] },
    { k: 'cai', l: 'Cãi nhau tay đôi', ai: { risk: 1 }, out: [[1, 'Hai đứa cãi nhau to, bị mời phụ huynh. Hôm sau tìm thấy đồ, chẳng ai xin lỗi ai.', { soc: -2, hap: -2 }, 'bad']] },
    { k: 've', l: 'Về kể với bố mẹ', out: [[1, function (l) { return cap(b(l)) + ' lên trường nói chuyện với cô. Cô xin lỗi vì đã để bạn bị nghi oan.'; }, { hap: 1 }, 'neutral']] }], school);

  KID('k6_ban_dac_biet', 7, 12, 'Người bạn đặc biệt', ['Lớp có bạn mới đi chân tập tễnh, mấy đứa nghịch ngợm hay nhại dáng đi.', 'Bạn mới chuyển đến nói lắp, mỗi lần đứng lên trả bài là cả lớp cười ồ.'], [
    { k: 'ben', l: 'Ngồi cạnh, rủ bạn ấy chơi cùng', ai: { moral: 1, w: 1.2 }, out: [[1, 'Bạn trở thành người bạn đầu tiên của bạn ấy ở lớp. Nhiều năm sau hai đứa vẫn thân.', { karma: 5, soc: 2 }, 'good', mem('Ngồi cạnh người bạn bị cả lớp trêu chọc.', 3)]] },
    { k: 'bao', l: 'Báo cô chuyện bạn bị trêu', out: [[1, 'Cô nói chuyện với cả lớp, chuyện trêu chọc thưa dần.', { karma: 3 }, 'good']] },
    { k: 'theo', l: 'Cười theo cho hợp nhóm', ai: { bad: 1, w: 0.6 }, out: [[1, 'Cười theo cho hợp nhóm. Tối về nghĩ lại, bạn thấy xấu hổ.', { karma: -3 }, 'bad']] }], school);

  KID('k6_thieu_nhi', 4, 10, 'Tết Thiếu nhi 1/6', 'Mùng 1 tháng 6, nhà văn hóa tổ chức vui Tết Thiếu nhi, có phát quà và trò chơi dân gian.', [
    { k: 'choi', l: 'Chơi kéo co, bịt mắt bắt dê, nhận quà', out: [[1, function (l, r) { return 'Chơi hết trò này đến trò khác, cuối buổi ' + pick(r, ['được một hộp bút màu', 'được túi kẹo và quyển truyện tranh', 'được quả bóng bay hình con vật', 'được một chiếc cặp sách mới']) + '.'; }, { hap: 3, soc: 1 }, 'good']] },
    { k: 'mua', l: 'Lên múa hát văn nghệ', ai: { soc: 1 }, out: [[1, 'Lên múa bài "Bắc kim thang", lóng ngóng mà cả xóm vỗ tay.', { hap: 2, soc: 3 }, 'good']] },
    { k: 'nha', l: 'Ở nhà xem hoạt hình', out: [[1, 'Ở nhà xem hoạt hình cả buổi, chiều nghe bạn kể mà tiếc.', { hap: 1 }, 'neutral']] }], vn);

  KID('k6_hoc_dan', 6, 12, 'Tiếng đàn nhà bên', ['Chiều nào nhà hàng xóm cũng vang tiếng piano, bạn đứng nép cửa nghe mãi.', 'Ở trung tâm văn hóa có lớp organ, guitar thiếu nhi chiêu sinh.'], [
    { k: 'hoc', l: 'Xin bố mẹ cho đi học đàn', cost: 3, why: 'Học phí lớp đàn', h: function (l) { return 'Khoảng ' + H.money(l, V(l, 3)) + ' một khóa'; }, fail: 'Bố mẹ nói khéo nhà chưa có điều kiện. Bạn tự tập trên cây đàn đồ chơi.', out: [[1, 'Mỗi tuần hai buổi học đàn. Cuối năm bạn đàn trọn vẹn một bản nhạc trước cả nhà.', { hap: 3, kno: 2 }, 'good', function (l, r) { if (!l.talent && r() < 0.25) l.talent = 'âm nhạc'; if (l.talent === 'âm nhạc') l.skill = Math.min(100, (l.skill || 20) + 4); }]] },
    { k: 'tu', l: 'Tự học qua video trên mạng', out: [[1, 'Mày mò tự học qua video, gảy được vài hợp âm, đủ để hát cho cả nhà nghe.', { hap: 2, kno: 1 }, 'good']] },
    { k: 'thoi', l: 'Thôi, thích nghe hơn chơi', out: [[1, 'Bạn thích ngồi nghe hơn. Tiếng đàn chiều ấy thành ký ức êm đềm.', { hap: 1 }, 'neutral']] }]);

  KID('k6_vo', 7, 12, 'Lớp võ mùa hè', [function (l) { return 'Câu lạc bộ ' + (vn(l) ? 'Vovinam' : 'Taekwondo') + ' ở nhà văn hóa chiêu sinh lớp hè.'; }, 'Câu lạc bộ Karate ở trường mở lớp hè, các anh chị mặc võ phục trông thật oai.'], [
    { k: 'hoc', l: 'Đăng ký học võ', cost: 1.5, why: 'Học phí lớp võ', h: function (l) { return 'Khoảng ' + H.money(l, V(l, 1.5)) + ' cả hè'; }, fail: 'Nhà chưa có tiền, bạn đứng ngoài cửa sổ xem các anh chị tập.', out: [[0.7, 'Cả mùa hè tập võ, lên được đai mới, người rắn rỏi hẳn.', { hea: 3, hap: 2 }, 'good'], [0.3, 'Tập được nửa khóa thì bong gân cổ chân, nhưng vẫn quyết tập tiếp đến buổi cuối.', { hea: 1, hap: 1 }, 'neutral']] },
    { k: 'khong', l: 'Ở nhà chơi', out: [[1, 'Mùa hè trôi qua bên tivi và mấy trò chơi quen.', null, 'neutral']] }]);

  KID('k6_nga_cay', 5, 11, 'Cú ngã', ['Trèo cây ổi nhà hàng xóm hái quả, cành gãy, bạn ngã sõng soài.', 'Đạp xe thả dốc, phanh không ăn, bạn ngã lăn ra đường.', 'Chơi đuổi bắt trên cầu thang, bạn trượt chân ngã đập tay xuống bậc.'], [
    { k: 'ke', l: 'Khóc, kể ngay với bố mẹ', ai: { w: 1.3 }, out: [[0.55, function (l) { return 'Bó bột tay một tháng, ' + (l.school ? 'cả lớp' : 'cả nhà') + ' thi nhau ký tên, vẽ hình lên lớp bột trắng.'; }, { hea: -4, hap: -1 }, 'neutral'], [0.45, 'Chỉ trầy xước, bác sĩ sát trùng rồi cho về. Từ đó bạn trèo cẩn thận hơn.', { hea: -1 }, 'neutral']] },
    { k: 'giau', l: 'Giấu bố mẹ vì sợ bị mắng', ai: { w: 0.6 }, out: [[0.6, 'Tay sưng vù mới bị phát hiện. Bác sĩ bảo đến muộn thêm chút nữa là xương liền lệch.', { hea: -6, hap: -2 }, 'bad'], [0.4, 'Đau mấy hôm rồi cũng đỡ. Vết sẹo nhỏ ở đầu gối theo bạn mãi.', { hea: -2 }, 'neutral']] }]);

  KID('k6_ruou_gio', 11, 14, 'Chén rượu ngày giỗ', [function (l) { return 'Ngày giỗ ông, mấy chú bác rót rượu mời: “' + (l.sex === 'M' ? 'Lớn rồi, làm một chén cho ra dáng đàn ông!' : 'Con gái cũng làm một chén cho vui!') + '”'; }, 'Tất niên ở nhà bác cả, cả mâm giục bạn "nâng ly" với người lớn.'], [
    { k: 'tu_choi', l: 'Lễ phép từ chối, xin uống nước ngọt', ai: { smart: 1, w: 1.3 }, out: [[1, 'Từ chối khéo, bác cười xòa xoa đầu bạn.', { karma: 1 }, 'good']] },
    { k: 'thu', l: 'Uống thử một chén', out: [[1, 'Chén rượu cay xè, mặt đỏ gay, cả buổi chiều nằm li bì.', { hea: -2, hap: -1 }, 'neutral']] },
    { k: 'nhieu', l: 'Uống liền mấy chén cho oai', ai: { risk: 1, w: 0.5 }, out: [[1, function (l) { return 'Uống mấy chén liền, nôn thốc nôn tháo, bị ' + m(l) + ' mắng cho một trận.'; }, { hea: -4 }, 'bad']] }], vn);

  KID('k6_vape', 12, 14, 'Thuốc lá điện tử', ['Mấy đứa bạn lén rủ thử thuốc lá điện tử mùi trái cây sau giờ học: “Thơm lắm, không sao đâu”.', 'Đứa bạn khoe "pod" mới mua trên mạng, rủ cả nhóm hút thử trong nhà vệ sinh.'], [
    { k: 'tu_choi', l: 'Từ chối, bỏ về', ai: { smart: 1, w: 1.3 }, out: [[1, 'Bạn lắc đầu bỏ về. Ít lâu sau trường phát hiện, cả nhóm kia bị kỷ luật.', { karma: 2, hea: 1 }, 'good']] },
    { k: 'thu', l: 'Thử một hơi', out: [[1, 'Thử một hơi, ho sặc sụa, chóng mặt. Bạn không đụng vào nữa.', { hea: -1 }, 'neutral']] },
    { k: 'mua', l: 'Thử rồi mua luôn một cây', ai: { risk: 1, w: 0.4 }, out: [[1, 'Lén mua một cây, hút giấu trong nhà vệ sinh. Mấy tháng sau bị phát hiện, cả nhà sốc.', { hea: -4, karma: -2, hap: -2 }, 'bad', stress(5)]] }], school);

  KID('k6_phim_ma', 9, 13, 'Bộ phim kinh dị', ['Anh họ rủ xem phim ma lúc nửa đêm, tắt hết đèn cho "có không khí".', 'Ngủ lại nhà bạn, cả bọn rủ nhau xem phim kinh dị trên điện thoại.'], [
    { k: 'xem', l: 'Xem đến hết, trùm chăn kín đầu', ai: { risk: 1 }, out: [[1, 'Xem hết phim, cả tuần không dám tắt đèn đi ngủ.', { hap: 1 }, 'neutral']] },
    { k: 'tat', l: 'Xem nửa chừng rồi xin tắt', out: [[1, 'Xem nửa chừng thì sợ quá, cả bọn chuyển sang xem hoạt hình. Ai cũng thở phào.', { hap: 1 }, 'neutral']] },
    { k: 'ngu', l: 'Đi ngủ trước', out: [[1, 'Đi ngủ trước, sáng ra nghe kể lại mà vẫn sởn gai ốc.', null, 'neutral']] }]);

  KID('k6_bai_tho', 9, 13, 'Báo tường ngày Nhà giáo', [function (l) { return 'Lớp làm báo tường chào mừng ngày Nhà giáo' + (vn(l) ? ' 20/11' : '') + ', cô giao bạn viết một bài thơ.'; }], [
    { k: 'viet', l: 'Thức khuya viết bài thơ về cô', ai: { w: 1.2 }, out: [[0.6, 'Bài thơ được đọc trước toàn trường. Cô giáo rưng rưng.', { kno: 2, hap: 3 }, 'good', mem('Bài thơ tặng cô được đọc trước toàn trường.', 2)], [0.4, 'Vần chưa chuẩn nhưng cô vẫn dán bài thơ vào giữa tờ báo.', { hap: 1 }, 'good']] },
    { k: 've', l: 'Xin vẽ tranh thay vì viết', out: [[1, 'Bức tranh bó hoa tặng cô được dán ngay trang đầu tờ báo tường.', { hap: 2 }, 'good']] },
    { k: 'chep', l: 'Chép một bài thơ trên mạng', ai: { bad: 1, w: 0.5 }, out: [[0.5, 'Cô nhận ra bài thơ chép mạng, nhẹ nhàng nhắc bạn trước lớp. Bạn xấu hổ đỏ mặt.', { karma: -2, hap: -2 }, 'bad'], [0.5, 'Không ai phát hiện, nhưng lời khen nghe chẳng vui.', { karma: -1 }, 'neutral']] }], school);

  KID('k6_nguoi_la', 10, 14, 'Người lạ trên mạng', ['Một tài khoản lạ kết bạn, khen bạn dễ thương, hỏi tên trường, địa chỉ nhà rồi rủ gặp mặt.', 'Một "anh / chị" trong nhóm game hứa tặng quà, chỉ cần gửi ảnh và nói nhà ở đâu.'], [
    { k: 'ke', l: 'Kể ngay với bố mẹ', ai: { smart: 1, w: 1.4 }, out: [[1, 'Bố mẹ chặn tài khoản và báo cho nhà trường. Hóa ra kẻ đó từng dụ dỗ nhiều bạn nhỏ khác.', { karma: 2, kno: 1 }, 'good']] },
    { k: 'chan', l: 'Tự chặn, không trả lời', out: [[1, 'Bạn chặn ngay. Một bài học nhớ đời về an toàn trên mạng.', { kno: 1 }, 'good']] },
    { k: 'gap', l: 'Đồng ý gặp ở quán trà sữa', ai: { risk: 1, w: 0.3 }, out: [[1, 'Đến điểm hẹn, bạn thấy một người đàn ông lạ lớn tuổi đang đợi. Bạn sợ hãi bỏ chạy về nhà, kể hết với gia đình.', { hap: -4 }, 'bad', stress(8)]] }]);

  KID('k6_lua_game', 10, 14, 'Kim cương miễn phí', 'Có người nhắn tin hứa tặng trang phục hiếm, kim cương miễn phí, chỉ cần gửi mật khẩu tài khoản game.', [
    { k: 'khong', l: 'Không gửi, báo cáo tài khoản đó', ai: { smart: 1, w: 1.2 }, out: [[1, 'Bạn báo cáo tài khoản lừa đảo. Mấy hôm sau thấy cả trường đồn có đứa mất nick vì tin lời nó.', { kno: 1 }, 'good']] },
    { k: 'gui', l: 'Gửi thử xem sao', ai: { risk: 1, w: 0.5 }, out: [[1, 'Gửi mật khẩu xong, tài khoản cày mấy năm bay mất. Bạn khóc cả đêm.', { hap: -4 }, 'bad']] },
    { k: 'hoi', l: 'Hỏi anh chị / bố mẹ trước', out: [[1, 'Anh chị bảo đó là trò lừa đảo. Bạn thoát nạn.', { kno: 1 }, 'good']] }]);

  KID('k6_hat_dau', 5, 9, 'Hạt đậu nảy mầm', 'Cô giáo phát mỗi bạn vài hạt đậu xanh, về gieo vào cốc bông gòn rồi quan sát.', [
    { k: 'cham', l: 'Tưới nước, đặt cạnh cửa sổ mỗi ngày', ai: { smart: 1, w: 1.2 }, out: [[1, 'Mầm đậu vươn cao từng ngày, bạn đo và ghi lại mỗi sáng. Cô cho bạn lên kể trước lớp.', { kno: 2, hap: 2 }, 'good']] },
    { k: 'vuon', l: 'Đem ra vườn trồng cùng ông bà', req: rural, out: [[1, 'Cây đậu leo giàn, cuối mùa ông bà nấu cho bữa chè đậu xanh từ chính tay bạn trồng.', { hap: 3, karma: 1 }, 'good']] },
    { k: 'quen', l: 'Để đó rồi quên', out: [[1, 'Cốc đậu khô héo, bạn tiếc rẻ mãi.', { hap: -1 }, 'neutral']] }], school);

  KID('k6_ngap', 6, 12, 'Nước ngập đường', ['Mưa lớn mấy ngày liền, nước ngập ngang đầu gối, đường tới trường thành sông.', 'Triều cường dâng, cả con ngõ ngập nước, cá từ ao tràn cả ra đường.'], [
    { k: 'loi', l: 'Xắn quần lội nước đi học', out: [[1, 'Lội nước tới trường, ướt hết sách vở nhưng không nghỉ buổi nào.', { kno: 1, hea: -1 }, 'neutral']] },
    { k: 'ca', l: 'Rủ bạn đi bắt cá', ai: { risk: 1 }, out: [[0.8, 'Mấy đứa hò nhau bắt được cả xô cá, bữa tối có nồi cá kho.', { hap: 4, soc: 1 }, 'good'], [0.2, 'Mải bắt cá, bạn trượt chân xuống rãnh sâu, may có người kéo lên. Về bị mắng một trận nhớ đời.', { hea: -2, hap: -2 }, 'bad']] },
    { k: 'don', l: 'Ở nhà phụ kê đồ lên cao', ai: { moral: 1 }, out: [[1, 'Phụ bố mẹ kê đồ lên cao. Nhà không hư hại gì nhiều.', { karma: 2 }, 'good']] }], function (l) { return vn(l) || rural(l); });

  KID('k6_dieu', 6, 12, 'Cánh diều mùa hè', 'Gió nam thổi lồng lộng trên đê, lũ trẻ trong xóm thi nhau thả diều.', [
    { k: 'lam', l: 'Tự vót tre làm diều sáo', ai: { smart: 1 }, out: [[0.7, 'Diều tự làm bay cao, tiếng sáo vi vu cả buổi chiều.', { hap: 4, kno: 1 }, 'good', mem('Cánh diều sáo tự làm bay cao trên đê.', 2)], [0.3, 'Diều nặng quá, mới lên đã cắm đầu xuống ruộng. Cả bọn cười lăn.', { hap: 2 }, 'neutral']] },
    { k: 'mua', l: 'Xin tiền mua diều nilon', out: [[1, 'Diều nilon bay ngon lành, cả chiều chạy theo gió trên đê.', { hap: 2 }, 'good']] },
    { k: 'xem', l: 'Ngồi xem các anh chị thả', out: [[1, 'Ngồi xem trên đê, ngắm hoàng hôn đỏ rực.', { hap: 1 }, 'neutral']] }], rural);

  KID('k6_cau_ca', 7, 13, 'Buổi đi câu', [function (l) { return cap(b(l)) + ' rủ bạn đi câu cá ở hồ đầu làng từ sáng sớm.'; }, function (l) { return 'Cuối tuần, ' + b(l) + ' chở bạn ra bờ sông, mang theo hai cần câu và gói xôi.'; }], [
    { k: 'di', l: 'Dậy sớm đi câu', ai: { w: 1.3 }, out: [[0.45, function (l) { return 'Câu được con cá to nhất đời, ' + b(l) + ' khen mãi với hàng xóm.'; }, { hap: 4 }, 'good'], [0.55, function (l) { return 'Cả buổi chẳng được con nào, nhưng hai ' + (b(l) === 'bố' ? 'bố con' : 'ông cháu') + ' nói chuyện với nhau nhiều hơn cả năm cộng lại.'; }, { hap: 3 }, 'good', mem('Buổi sáng ngồi câu cá bên bờ sông, chẳng được con nào mà vui.', 3)]] },
    { k: 'ngu', l: 'Ngủ nướng', out: [[1, 'Ngủ nướng. Mãi sau này lớn lên, bạn tiếc vì đã không đi.', null, 'neutral']] }], function (l) { return b(l) !== 'mẹ'; });

  KID('k6_de', 8, 12, 'Bắt dế chọi', 'Mùa hè, lũ trẻ trong xóm rủ nhau ra bờ ruộng đổ nước bắt dế chọi.', [
    { k: 'bat', l: 'Đi bắt dế', ai: { risk: 1 }, out: [[0.6, 'Bắt được con dế than "chiến tướng", thắng liền mấy trận.', { hap: 4, soc: 2 }, 'good'], [0.4, 'Đổ nước cả buổi chỉ được con dế nhỏ xíu, thua ngay trận đầu.', { hap: 1 }, 'neutral']] },
    { k: 'nuoi', l: 'Bắt về nuôi, không cho chọi', out: [[1, 'Nuôi dế trong hộp diêm, đêm nào cũng nghe nó gáy.', { hap: 2, karma: 1 }, 'good']] },
    { k: 'khong', l: 'Ở nhà', out: [[1, 'Ở nhà nghe tụi bạn kể chuyện "chiến tướng" mà nóng ruột.', null, 'neutral']] }], rural, function (l) { return l.sex === 'M' ? 1.2 : 0.6; });

  KID('k6_the_bai', 9, 13, 'Cơn sốt thẻ bài', 'Cả lớp mê sưu tập thẻ bài nhân vật; ai có thẻ hiếm là được cả lớp vây quanh.', [
    { k: 'mua', l: 'Dồn tiền ăn sáng mua thẻ', ai: { risk: 1 }, out: [[0.4, 'Nhịn ăn sáng mấy tuần, bóc được một thẻ hiếm, vui cả tháng.', { hap: 3, hea: -1 }, 'good'], [0.6, 'Nhịn ăn sáng mấy tuần mà toàn thẻ trùng. Bạn thấy tiếc tiền ghê.', { hea: -1, hap: -1 }, 'neutral']] },
    { k: 'doi', l: 'Đổi thẻ với bạn', ai: { soc: 1 }, out: [[1, 'Giờ ra chơi nào cũng ngồi đổi thẻ, quen thêm cả bạn lớp bên.', { soc: 2, hap: 1 }, 'good']] },
    { k: 'khong', l: 'Không theo phong trào', out: [[1, 'Không theo, ba tháng sau phong trào cũng tàn.', null, 'neutral']] }], school);

  KID('k6_gian_ban', 8, 13, 'Giận bạn thân', 'Đứa bạn thân dạo này toàn chơi với nhóm khác, để bạn ngồi một mình giờ ra chơi.', [
    { k: 'noi', l: 'Thẳng thắn nói chuyện', ai: { soc: 1, w: 1.2 }, out: [[0.75, 'Hóa ra bạn ấy tưởng bạn giận mình. Hai đứa làm lành, thân hơn trước.', { soc: 3, hap: 2 }, 'good'], [0.25, 'Bạn ấy bảo muốn chơi với nhóm mới. Bạn buồn, nhưng học được cách buông.', { hap: -2 }, 'neutral']] },
    { k: 'moi', l: 'Kết thêm bạn mới', out: [[1, 'Bạn chủ động bắt chuyện với mấy bạn bàn dưới, giờ ra chơi lại rộn ràng.', { soc: 2 }, 'good']] },
    { k: 'gian', l: 'Giận dỗi, nghỉ chơi luôn', out: [[1, 'Nghỉ chơi cả năm học. Lớn lên nghĩ lại mới thấy tiếc.', { hap: -3, soc: -1 }, 'bad']] }], school);

  KID('k6_cai_nhau', 6, 13, 'Tiếng cãi vã sau cánh cửa', ['Đêm khuya, bạn nghe bố mẹ cãi nhau to tiếng chuyện tiền nong.', 'Bữa cơm bỗng im bặt, rồi bố mẹ lớn tiếng với nhau, bát đũa va loảng xoảng.'], [
    { k: 'chan', l: 'Trùm chăn, ôm gối khóc', out: [[1, 'Bạn trùm chăn khóc thút thít. Sáng hôm sau bố mẹ vẫn cố tỏ ra bình thường.', { hap: -4 }, 'bad', stress(6)]] },
    { k: 'xin', l: 'Chạy ra xin bố mẹ đừng cãi nhau', out: [[0.6, 'Bố mẹ khựng lại, ôm lấy bạn. Tối đó cả nhà ngồi nói chuyện lại với nhau.', { hap: 1 }, 'good'], [0.4, 'Bố mẹ bảo bạn vào phòng. Cảm giác bất lực theo bạn rất lâu.', { hap: -3 }, 'bad', stress(5)]] },
    { k: 'thu', l: 'Viết lá thư nhỏ đặt lên bàn', ai: { w: 1.2 }, out: [[1, 'Lá thư nguệch ngoạc “Con thương bố mẹ” khiến cả hai lặng đi. Từ đó bố mẹ cố nói chuyện nhỏ nhẹ hơn.', { hap: 2 }, 'good', mem('Lá thư nhỏ “Con thương bố mẹ” đặt trên bàn.', 3)]] }], both);

  KID('k6_ba_vien', 8, 14, 'Bà nằm viện', ['Bà ngoại ốm nặng phải nằm viện mấy tuần.', 'Ông nội bị ngã, phải mổ và nằm viện.'], [
    { k: 'tham', l: 'Xin theo bố mẹ vào viện thăm', ai: { moral: 1, w: 1.3 }, out: [[1, 'Bạn ngồi bóp chân, kể chuyện ở trường. Người già cười móm mém: “Cháu ông bà lớn thật rồi”.', { karma: 3, hap: 1 }, 'good', mem('Ngồi bóp chân cho ông bà trong viện.', 3)]] },
    { k: 'thiep', l: 'Làm tấm thiệp chúc mau khỏe', out: [[1, 'Tấm thiệp vẽ nguệch ngoạc được dựng cạnh giường bệnh suốt mấy tuần.', { karma: 2 }, 'good']] },
    { k: 'hoc', l: 'Ở nhà học bài', out: [[1, 'Ở nhà học bài. Ít lâu sau người già khỏe lại, về nhà.', null, 'neutral']] }]);

  KID('k6_em_ho', 6, 12, 'Em họ về ở cùng', 'Bố mẹ của em họ đi làm ăn xa, gửi em ở nhà bạn một thời gian.', [
    { k: 'nhuong', l: 'Nhường đồ chơi, chỉ em học bài', ai: { moral: 1, w: 1.2 }, out: [[1, 'Em họ quấn bạn như hình với bóng. Ngày em về, cả hai đứa khóc.', { karma: 3, soc: 1 }, 'good']] },
    { k: 'kho_chiu', l: 'Khó chịu vì phải chia phòng', out: [[1, 'Hai đứa tranh nhau cái quạt, cãi nhau suốt. Mãi sau mới quen.', { hap: -2 }, 'neutral']] }]);

  KID('k6_doi_tuyen', 9, 13, 'Đội tuyển của trường', [function () { return 'Thầy thể dục chọn bạn vào đội bóng đá của trường đi thi giải cấp huyện.'; }, function () { return 'Cô chọn bạn vào đội cầu lông / điền kinh của trường dự hội khỏe Phù Đổng.'; }], [
    { k: 'tap', l: 'Tập luyện hết mình', ai: { w: 1.2 }, out: [[0.45, 'Đội giành huy chương, bạn được tuyên dương dưới cờ.', { hea: 3, hap: 4, soc: 2 }, 'good', mem('Đứng trên bục nhận huy chương cùng đội tuyển của trường.', 3)], [0.55, 'Đội dừng bước ở bán kết, nhưng bạn khỏe hẳn lên, quen thêm nhiều bạn.', { hea: 3, hap: 1, soc: 1 }, 'neutral']] },
    { k: 'thoi', l: 'Từ chối để tập trung học', ai: { smart: 1 }, out: [[1, 'Bạn từ chối để tập trung học. Điểm cuối kỳ khá lên.', { kno: 1 }, 'neutral']] }], school);

  KID('k6_banh_chung', 5, 12, 'Gói bánh chưng', 'Chiều 28 Tết, cả nhà quây quần bên mâm lá dong gói bánh chưng.', [
    { k: 'goi', l: 'Xin gói một chiếc bánh nhỏ của riêng mình', out: [[1, 'Chiếc bánh méo xẹo nhưng là chiếc bánh ngon nhất Tết năm ấy.', { hap: 4 }, 'good', mem('Chiếc bánh chưng méo xẹo tự tay gói ngày Tết.', 3)]] },
    { k: 'trong', l: 'Thức trông nồi bánh', out: [[1, 'Ngồi bên bếp lửa nghe người lớn kể chuyện ngày xưa, ngủ gục lúc nào không hay.', { hap: 3 }, 'good']] },
    { k: 'choi', l: 'Chạy đi chơi với bạn', out: [[1, 'Chạy đi chơi pháo que với bạn, về đến nhà thì bánh đã vớt xong.', { hap: 1 }, 'neutral']] }], vn);

  KID('k6_quyen_gop', 7, 12, 'Ủng hộ vùng lũ', [function (l) { return 'Trường phát động quyên góp ủng hộ các bạn nhỏ ' + (vn(l) ? 'miền Trung' : 'vùng thiên tai') + ' vừa bị lũ cuốn trôi nhà cửa.'; }], [
    { k: 'dap', l: 'Đập heo đất ủng hộ hết', ai: { moral: 1, w: 1.2 }, out: [[1, 'Đập heo đất, đếm từng đồng xu đem lên trường. Cô giáo xoa đầu bạn mãi.', { karma: 5, hap: 2 }, 'good', mem('Đập heo đất ủng hộ các bạn vùng lũ.', 2)]] },
    { k: 'nua', l: 'Ủng hộ một nửa', out: [[1, 'Góp một nửa số tiền để dành, nửa còn lại để mua sách.', { karma: 3 }, 'good']] },
    { k: 'do', l: 'Gom sách vở, quần áo cũ gửi đi', out: [[1, 'Gom cả thùng sách vở, quần áo gửi đi, kèm một lá thư hỏi thăm.', { karma: 3, hap: 1 }, 'good']] }], school);

  KID('k6_day_thi', 11, 14, 'Tuổi dậy thì', [function (l) { return l.sex === 'M' ? 'Giọng bạn vỡ ra ồm ồm, mặt lấm tấm mụn, cả lớp trêu là "vịt đực".' : 'Lần đầu tiên "đến tháng", bạn hoảng hốt không biết phải làm sao.'; }], [
    { k: 'hoi', l: 'Hỏi bố mẹ', ai: { w: 1.2 }, out: [[1, function (l) { var p = l.sex === 'F' ? (l.fam.mAlive ? 'mẹ' : m(l)) : (l.fam.fAlive && !l.fam.noDad ? 'bố' : m(l)); return cap(p) + ' ân cần giải thích, chuẩn bị đồ dùng cho bạn. Bạn thấy nhẹ lòng hẳn.'; }, { hap: 2, kno: 1 }, 'good']] },
    { k: 'mang', l: 'Tự tìm hiểu trên mạng', out: [[1, 'Đọc được nhiều thông tin đúng có, sai có, nhưng cũng hiểu cơ thể mình hơn.', { kno: 1 }, 'neutral']] },
    { k: 'giau', l: 'Xấu hổ, giấu kín', out: [[1, 'Giấu kín mấy tháng, lo lắng một mình.', { hap: -2 }, 'neutral', stress(4)]] }]);

  KID('k6_cho_phien', 5, 10, 'Món đồ chơi ở chợ', [function (l) { return 'Theo ' + m(l) + ' đi chợ phiên, bạn nhìn thấy món đồ chơi mơ ước.'; }, function (l) { return 'Đi siêu thị với ' + m(l) + ', bạn đứng mãi trước kệ đồ chơi.'; }], [
    { k: 'doi', l: 'Ăn vạ đòi mua bằng được', ai: { risk: 1 }, out: [[0.5, function (l) { return cap(m(l)) + ' chiều, mua cho. Về nhà chơi được ba hôm thì chán.'; }, { hap: 1 }, 'neutral'], [0.5, function (l) { return cap(m(l)) + ' không mua, kéo về. Bạn hờn cả buổi.'; }, { hap: -2 }, 'neutral']] },
    { k: 'xach', l: 'Phụ mẹ xách đồ', ai: { moral: 1 }, out: [[1, function (l) { return 'Xách giỏ rau cho ' + m(l) + ', được thưởng cây kẹo bông.'; }, { karma: 2, hap: 2 }, 'good']] },
    { k: 'de_danh', l: 'Hỏi giá rồi về tự để dành tiền', ai: { smart: 1 }, out: [[1, 'Ba tháng nhịn quà vặt, bạn tự mua được món đồ chơi ấy. Cảm giác thật khác.', { hap: 3, kno: 1 }, 'good']] }]);

  KID('k6_ngu_rieng', 6, 10, 'Đêm đầu ngủ một mình', 'Bố mẹ dọn cho bạn một góc ngủ riêng. Đêm đầu tiên, bóng tối như có ai đang nhìn.', [
    { k: 'den', l: 'Xin bật đèn ngủ', out: [[1, 'Có ánh đèn vàng, bạn ngủ ngon lành.', { hap: 1 }, 'neutral']] },
    { k: 'chay', l: 'Ôm gối chạy sang phòng bố mẹ', out: [[1, 'Ngủ ké bố mẹ thêm một tuần nữa mới quen.', { hap: 2 }, 'neutral']] },
    { k: 'gan', l: 'Tự nhủ mình đã lớn', ai: { w: 1.1 }, out: [[1, 'Đếm cừu đến ba trăm thì ngủ thiếp. Sáng ra thấy mình lớn hẳn.', { hap: 1, soc: 1 }, 'good']] }], function (l) { return l.fam.q >= 3 || l.urban; });

  KID('k6_xe_buyt', 10, 14, 'Lần đầu tự đi xe buýt', 'Bố mẹ bận, lần đầu tiên bạn phải tự đi xe buýt tới lớp học thêm.', [
    { k: 'di', l: 'Tự đi', ai: { w: 1.2 }, out: [[0.65, 'Tự đi trót lọt, thấy mình như người lớn.', { soc: 2, hap: 2, kno: 1 }, 'good'], [0.35, function (l) { return 'Ngồi quá bến, phải gọi điện nhờ ' + m(l) + ' đón. Lần sau thì thuộc đường.'; }, { hap: -1 }, 'neutral']] },
    { k: 'nho', l: 'Nhờ hàng xóm chở đi', out: [[1, 'Nhờ bác hàng xóm chở đi, dọc đường được nghe kể đủ chuyện.', null, 'neutral']] }], function (l) { return l.urban; });

  KID('k6_can_thi', 8, 13, 'Nhìn bảng không rõ', 'Dạo này bạn phải nheo mắt mới đọc được chữ trên bảng.', [
    { k: 'kham', l: 'Nói với bố mẹ để đi khám mắt', ai: { smart: 1, w: 1.3 }, out: [[1, 'Bác sĩ bảo bạn bị cận, phải đeo kính. Đeo kính vào, cả thế giới bỗng rõ nét.', { kno: 1, hap: 1 }, 'neutral', function (l) { l.flags.glasses = true; if (!l.indep && E.childExpense) E.childExpense(l, V(l, 0.8), 'Cắt kính cận', true); }]] },
    { k: 'giau', l: 'Giấu, cứ ngồi nheo mắt', out: [[1, 'Cứ nheo mắt mãi, độ cận tăng nhanh. Cuối năm vẫn phải đi cắt kính, dày hơn hẳn.', { hea: -2, kno: -1 }, 'bad', function (l) { l.flags.glasses = true; }]] }], school);

  KID('k6_phu_quan', 11, 14, 'Phụ quán nước', 'Cô hàng xóm mở quán nước, nhờ bạn phụ dọn bàn cuối tuần, trả ít tiền công.', [
    { k: 'me', l: 'Đi làm, đưa tiền công cho mẹ', ai: { moral: 1, w: 1.2 }, out: [[1, function (l) { return 'Mấy đồng tiền công đưa cả cho ' + m(l) + '. ' + cap(m(l)) + ' cầm tiền mà rơm rớm nước mắt.'; }, { karma: 3, hap: 1 }, 'good', mem('Lần đầu đưa tiền công tự kiếm cho gia đình.', 3)]] },
    { k: 'sach', l: 'Đi làm, để dành mua sách', out: [[1, 'Để dành tiền công mua được bộ sách mơ ước.', { kno: 1, hap: 2 }, 'good']] },
    { k: 'hoc', l: 'Ở nhà học bài', out: [[1, 'Ở nhà học bài, cuối tuần vẫn ghé quán phụ cô vài việc lặt vặt.', { kno: 1 }, 'neutral']] }], function (l) { return l.fam.q <= 2; });

  KID('k6_diem_kem', 8, 13, 'Con điểm đỏ', 'Bài kiểm tra bị điểm 3 đỏ chót, cô yêu cầu bố mẹ ký vào.', [
    { k: 'that', l: 'Đưa bố mẹ ký, hứa sẽ cố gắng', ai: { moral: 1, w: 1.2 }, out: [[0.6, function (l) { return cap(b(l)) + ' thở dài nhưng ngồi kèm bạn học mỗi tối. Bài sau được 8 điểm.'; }, { kno: 3 }, 'good'], [0.4, 'Bị mắng một trận, nhưng nhẹ người vì đã nói thật.', { hap: -1, karma: 1 }, 'neutral']] },
    { k: 'sua', l: 'Sửa số 3 thành số 8', ai: { bad: 1, w: 0.5 }, out: [[0.5, 'Cô phát hiện chữ số bị sửa, mời phụ huynh lên trường. Đó là lần đầu bạn thấy bố mẹ thất vọng đến vậy.', { karma: -3, hap: -4 }, 'bad'], [0.5, 'Thoát được lần này, nhưng thấp thỏm cả học kỳ.', { karma: -2 }, 'neutral']] },
    { k: 'gia', l: 'Tự giả chữ ký', ai: { bad: 1, w: 0.4 }, out: [[1, 'Chữ ký nguệch ngoạc bị cô nhận ra ngay. Bạn bị viết bản kiểm điểm.', { karma: -2, hap: -2 }, 'bad']] }], school);

  KID('k6_bao', 6, 13, 'Đêm bão', 'Đài báo cơn bão lớn sắp đổ bộ. Cả nhà hối hả chằng chống nhà cửa.', [
    { k: 'phu', l: 'Phụ bố mẹ chằng mái, kê đồ', ai: { moral: 1, w: 1.2 }, out: [[0.7, 'Cả nhà thức trắng đêm bão. Sáng ra mái tôn bay mất một góc nhưng mọi người đều an toàn.', { karma: 2 }, 'neutral', mem('Đêm bão cả nhà cùng giữ mái nhà.', 3)], [0.3, 'Bão đi qua nhẹ hơn dự báo. Cả xóm sang nhà nhau phụ dọn cây đổ.', { karma: 2, soc: 1 }, 'good']] },
    { k: 'nep', l: 'Ôm em nép trong góc nhà', out: [[1, 'Gió rít suốt đêm, bạn ôm chặt em, thì thầm hát cho em đỡ sợ.', { hap: -2 }, 'neutral', stress(3)]] }], vn);

  KID('k6_casting', 7, 13, 'Tuyển diễn viên nhí', 'Một công ty quảng cáo tuyển diễn viên nhí, phụ huynh trong nhóm lớp rủ nhau cho con đi thử vai.', [
    { k: 'di', l: 'Đi thử vai', ai: { soc: 1 }, out: [[0.25, 'Bạn được chọn đóng quảng cáo sữa, mặt lên tivi cả tháng. Họ hàng gọi điện chúc mừng rối rít.', { hap: 5, soc: 3 }, 'good', function (l, r) { if (!l.talent && r() < 0.4) l.talent = 'diễn xuất'; H.mem(l, 'Lần đầu thấy mặt mình trên tivi.', 3); }], [0.75, 'Không được chọn, nhưng được biết hậu trường quay phim trông thế nào.', { hap: 1 }, 'neutral']] },
    { k: 'khong', l: 'Không đi', out: [[1, 'Không đi. Mấy tuần sau thấy bạn cùng lớp trên tivi, hơi chạnh lòng.', null, 'neutral']] }], function (l) { return l.urban; });

  KID('k6_nhuong_ghe', 8, 13, 'Chiếc ghế trên xe', 'Trên chuyến xe khách về quê, một bà cụ đứng chênh vênh vì hết ghế.', [
    { k: 'nhuong', l: 'Đứng dậy nhường ghế', ai: { moral: 1, w: 1.3 }, out: [[1, 'Bà cụ cảm ơn, dúi cho bạn quả cam. Cả xe nhìn bạn trìu mến.', { karma: 3, hap: 1 }, 'good']] },
    { k: 'ngu', l: 'Giả vờ ngủ', ai: { bad: 1, w: 0.5 }, out: [[1, 'Nhắm mắt giả vờ ngủ, nhưng cả đường cứ thấy ngượng.', { karma: -2 }, 'neutral']] }]);

  KID('k6_can_ban', 8, 13, 'Trước cổng trường', 'Mấy anh lớp trên chặn đường, đòi tiền một bạn nhỏ lớp dưới.', [
    { k: 'goi', l: 'Chạy đi gọi bác bảo vệ', ai: { smart: 1, w: 1.3 }, out: [[1, 'Bác bảo vệ ra kịp, nhóm kia bỏ chạy. Bạn nhỏ cảm ơn rối rít.', { karma: 3 }, 'good']] },
    { k: 'can', l: 'Lao vào can', ai: { risk: 1 }, out: [[0.5, 'Nhóm kia chột dạ bỏ đi. Từ đó bạn nhỏ lớp dưới coi bạn như anh chị ruột.', { karma: 4, soc: 2 }, 'good'], [0.5, 'Bị xô ngã trầy cả tay, nhưng bạn nhỏ thoát được.', { hea: -2, karma: 4 }, 'neutral']] },
    { k: 'qua', l: 'Lặng lẽ đi qua', ai: { w: 0.6 }, out: [[1, 'Lặng lẽ đi qua. Ánh mắt hoảng sợ của bạn nhỏ ám ảnh bạn mấy hôm.', { karma: -2 }, 'neutral']] }], school);

  KID('k6_thu_tuong_lai', 10, 14, 'Lá thư gửi tương lai', 'Cô chủ nhiệm cho cả lớp viết thư gửi chính mình của 20 năm sau, niêm phong cất đi.', [
    { k: 'mo', l: 'Viết về ước mơ của mình', out: [[1, 'Bạn viết kín hai trang giấy về ước mơ, gấp lại thật cẩn thận.', { hap: 2, kno: 1 }, 'good', function (l) { l.flags.k6Thu = { at: l.age + 20, k: 'mo' }; }]] },
    { k: 'bo_me', l: 'Viết về bố mẹ', out: [[1, 'Bạn viết về bố mẹ, về những điều chưa bao giờ dám nói.', { hap: 2, karma: 1 }, 'good', function (l) { l.flags.k6Thu = { at: l.age + 20, k: 'bo_me' }; }]] },
    { k: 'qua_loa', l: 'Viết qua loa vài dòng', out: [[1, 'Viết vội vài dòng rồi nộp, chẳng nghĩ ngợi gì.', null, 'neutral', function (l) { l.flags.k6Thu = { at: l.age + 20, k: 'qua_loa' }; }]] }], school);

  KID('k6_ve_que', 6, 12, 'Mùa hè ở quê', [function (l) { return 'Hè này bố mẹ gửi bạn về quê ở với ông bà cả tháng.'; }], [
    { k: 'tam_ao', l: 'Theo bọn trẻ trong làng đi chăn trâu, tắm mưa', ai: { soc: 1 }, out: [[1, 'Chăn trâu, tắm mưa, nướng khoai trên đồng. Đen nhẻm mà vui chưa từng thấy.', { hap: 4, hea: 2, soc: 2 }, 'good', mem('Mùa hè đen nhẻm ở quê cùng ông bà.', 3)]] },
    { k: 'nho_nha', l: 'Nhớ nhà, đòi về sớm', out: [[1, 'Khóc nhè đòi về, được một tuần thì bố mẹ lên đón.', { hap: -1 }, 'neutral']] }], function (l) { return l.urban; });

  // thư gửi tương lai: 20 năm sau mở ra đọc
  E.HOOKS.year.unshift(function (l, r, log, a) {
    var t = l.flags && l.flags.k6Thu; if (!t || a !== t.at || !l.alive) return;
    l.flags.k6Thu = null;
    var job = l.job ? E.jobTitle(l) : null;
    log(t.k === 'mo' ? 'Nhà trường gửi lại lá thư bạn viết năm ' + (l.birthYear + a - 20) + '. Ước mơ năm ấy ' + (job ? 'khác xa công việc ' + job + ' bây giờ, nhưng' : 'giờ đã khác, nhưng') + ' đọc lại vẫn thấy mắt cay cay.'
      : t.k === 'bo_me' ? 'Nhà trường gửi lại lá thư năm lớp ' + Math.max(5, t.at - 26) + '. Đọc những dòng viết về bố mẹ' + (!l.fam.mAlive && !l.fam.fAlive ? ' khi cả hai đã không còn, bạn bật khóc.' : ', bạn gọi điện về nhà ngay trong tối ấy.')
      : 'Nhận lại lá thư viết vội năm nào, chỉ vài dòng nguệch ngoạc. Bạn bật cười, rồi thấy tiếc vì đã không viết nhiều hơn.', 'neutral');
    H.mem(l, 'Mở lá thư mình viết từ 20 năm trước.', 3);
  });

  // ===================================================================
  // 2. KHI BẠN RA ĐI: CÁC CON PHẢN ỨNG THEO ĐÚNG CON NGƯỜI CỦA MÌNH
  // ===================================================================
  function hashStr(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h | 0; }
  function rngFor(l, salt) { var h = { rs: (l.rs ^ hashStr(salt)) | 0 }; return function () { return U.rand(h); }; }
  var BAD = /^(cờ bạc|ma túy|đua xe|game|bỏ học)$/;
  function kidType(l, k) {
    var ka = l.death.age - k.born;
    if (k.jail && ka < k.jail) return 'jail';
    if (ka < 12) return 'little';
    if (ka < 18) return 'teen';
    if (BAD.test(k.vice || '') || k.owe > 0 || k.askedVon && k.close < 40) return 'spoiled';
    if (k.close < 35) return 'distant';
    if (k.abroadStudy || k.abroad) return 'far';
    if (k.edu >= 5 && k.job && k.close >= 45) return 'success';
    if (k.close >= 75) return 'devoted';
    return 'ordinary';
  }
  function sacrifices(l, k) {
    var s = [], P = l.sex === 'M' ? 'bố' : 'mẹ', ka = l.death.age - k.born;
    if (k.vice === 'cờ bạc' || k.owe > 0) s.push('những lần ' + P + ' lặng lẽ gom tiền trả nợ thay mình mà không một lời trách móc');
    if (k.vice === 'ma túy' || k.vice === 'đua xe') s.push('những đêm ' + P + ' thức trắng đi tìm mình khắp các ngõ ngách');
    if (k.vice === 'bỏ học' || k.vice === 'game') s.push('những lần ' + P + ' năn nỉ thầy cô cho mình đi học lại');
    if (k.gotAt != null || k.askedVon) s.push('số tiền ' + P + ' đưa mình làm vốn, ' + P + ' bảo là tiền để dành, thật ra là tiền dưỡng già');
    if (k.uniUntil || k.tuition || k.edu >= 5) s.push('những năm ' + P + ' bớt ăn bớt mặc để đóng học phí cho mình');
    if (l.flags.hardLot === true || E.netWorth(l) < l.base * 3) s.push('những năm nhà túng thiếu, ' + P + ' nhường mình bát cơm đầy, còn mình chỉ ăn rau');
    if (l.workYrs > 30) s.push(l.workYrs + ' năm ' + P + ' đi làm không nghỉ, đôi tay chai sạn');
    s.push('những lần ' + P + ' đứng đợi ngoài cổng trường dưới mưa');
    s.push('chiếc áo cũ ' + P + ' mặc suốt mười năm để dành tiền mua cho mình đôi giày mới');
    if (ka >= 30) s.push('những cuộc gọi của ' + P + ' mà mình bấm từ chối vì "đang bận"');
    return s;
  }
  function reaction(l, k, i, share, will) {
    var r = rngFor(l, 'kid:' + i + ':' + k.name), t = kidType(l, k), P = l.sex === 'M' ? 'bố' : 'mẹ', n = k.name;
    var sac0 = sacrifices(l, k), warm = t === 'spoiled' || t === 'distant' ? sac0 : sac0.filter(function (x) { return !/từ chối|trả nợ|tìm mình|năn nỉ/.test(x); }), sac = warm.length ? warm : sac0, s1 = pick(r, sac), s2 = pick(r, sac.filter(function (x) { return x !== s1; }).concat([s1]));
    var got = share > 0 ? ' Phần di sản ' + H.money(l, share) + ' ' + P + ' để lại, ' + n : '';
    var noteLine = will && will.note ? ' Đọc đến dòng ' + P + ' viết trong di chúc, ' + n + ' gục đầu xuống bàn.' : '';
    var lines = {
      spoiled: [
        n + ' về đến nhà khi ' + P + ' đã nằm yên trong quan tài. Đứng lặng thật lâu trước di ảnh, ' + n + ' bỗng quỵ xuống, nghẹn ngào như đứa trẻ. Đến lúc ấy mới nhớ lại ' + s1 + ', và ' + s2 + '.' + noteLine,
        'Dọn đồ của ' + P + ', ' + n + ' tìm thấy cuốn sổ cũ ghi từng khoản tiền ' + P + ' đã lo cho mình, trang cuối chỉ một dòng: “Chỉ mong con nên người.” ' + n + ' ôm cuốn sổ khóc không thành tiếng, lần đầu tiên hiểu mình đã làm ' + P + ' khổ đến nhường nào.',
        n + ' — đứa con khiến ' + P + ' bạc tóc nhiều nhất — quỳ suốt đêm bên linh cữu. “' + cap(P) + ' ơi, con biết lỗi rồi… sao ' + P + ' không đợi con thêm chút nữa?” Không ai trả lời. Chỉ có ngọn nến lặng lẽ cháy.'],
      distant: [
        n + ' nhận tin giữa một cuộc họp. Nhiều năm rồi hai ' + (P === 'bố' ? 'bố con' : 'mẹ con') + ' ít nói chuyện với nhau. Trên đường về, ' + n + ' mở lại tin nhắn cuối cùng ' + P + ' gửi, chưa từng trả lời: “Con có khỏe không?”',
        n + ' về muộn, đứng ở cuối hàng người đưa tang như một người khách. Đến khi nắp quan tài đóng lại, ' + n + ' mới bật khóc — vì những lời xin lỗi, những lời cảm ơn, giờ không còn ai để nói.',
        'Những năm cuối, ' + n + ' luôn hẹn “để dịp khác con về”. Dịp khác đã không bao giờ đến. ' + n + ' ngồi một mình trong căn phòng cũ của ' + P + ', nhìn tấm ảnh hai ' + (P === 'bố' ? 'bố con' : 'mẹ con') + ' chụp năm nào, nước mắt cứ thế rơi.'],
      far: [
        n + ' đang ở xa, bay suốt đêm mà vẫn không kịp nhìn mặt ' + P + ' lần cuối. Ngồi trong khoang máy bay tối om, ' + n + ' nhớ lại ngày ' + P + ' tiễn mình ra sân bay, dúi vội phong bì tiền vào tay rồi quay đi giấu nước mắt.',
        'Cuộc gọi video cuối cùng, ' + P + ' bảo “Con cứ lo việc của con, ' + P + ' khỏe mà.” ' + n + ' về đến nơi thì chỉ còn kịp thắp nén nhang. Người con xa xứ ôm lấy bức di ảnh, khóc như chưa từng được khóc.'],
      success: [
        n + ' đứng lên đọc điếu văn, giọng run run: “Mọi thứ con có hôm nay đều bắt đầu từ ' + s1 + '.” Cả hội trường lặng đi. ' + n + ' không đọc hết được, gập tờ giấy lại và khóc.',
        'Người ta khen ' + n + ' thành đạt, nhưng ' + n + ' chỉ nhớ ' + s1 + '. Ngày đưa ' + P + ' về nơi an nghỉ, ' + n + ' tự tay bê di ảnh suốt quãng đường dài.'],
      devoted: [
        n + ' ở bên ' + P + ' đến hơi thở cuối cùng, nắm bàn tay gầy guộc cho tới khi nó lạnh dần. Đêm ấy ' + n + ' không khóc thành tiếng, chỉ ngồi lặng bên giường, khẽ kéo lại tấm chăn như sợ ' + P + ' lạnh.',
        n + ' lo trọn hậu sự, việc gì cũng tự tay làm. Đến lúc mọi người về hết, ' + n + ' mới ngồi xuống bậc thềm, nhìn đôi dép ' + P + ' vẫn để ở cửa, rồi bật khóc nức nở.'],
      ordinary: [
        n + ' khóc nấc khi nghe tin. Cả đêm thức canh linh cữu, ' + n + ' kể cho các cháu nghe về ' + s1 + '.',
        n + ' lặng lẽ xếp lại quần áo của ' + P + ', mỗi chiếc áo gợi lại một kỷ niệm. Đến chiếc áo len ' + P + ' hay mặc mùa đông, ' + n + ' áp mặt vào, như vẫn còn hơi ấm.'],
      little: [
        n + ' mới ' + (l.death.age - k.born) + ' tuổi, chưa hiểu hết chuyện gì đang xảy ra. Bé cứ hỏi mãi: “Bao giờ ' + P + ' dậy?”, rồi ôm chiếc gối của ' + P + ' ngủ thiếp đi.',
        'Đứa con nhỏ ' + n + ' đứng nép bên chân người lớn, mặc bộ áo tang rộng thùng thình. Mấy năm sau, mỗi lần nhớ ' + P + ', bé lại lấy tấm ảnh ra hôn lên đó.'],
      teen: [
        n + ' đang tuổi mới lớn, vẫn còn giận ' + P + ' vì một trận cãi nhau tuần trước. Giờ thì chẳng còn ai để làm lành. ' + n + ' khóa trái cửa phòng, khóc suốt đêm.',
        n + ' cố tỏ ra mạnh mẽ, không rơi một giọt nước mắt trong đám tang. Chỉ đến khi mở tủ thấy hộp cơm ' + P + ' chuẩn bị sẵn cho mình, ' + n + ' mới òa lên.'],
      jail: [
        n + ' đang thụ án, được trại giam cho phép về chịu tang có cán bộ đi kèm. Quỳ trước linh cữu, ' + n + ' nghẹn ngào: “Con bất hiếu… con chưa kịp làm lại cuộc đời cho ' + P + ' xem.”',
        'Tin dữ đến trại giam qua lá thư của người nhà. Đêm ấy, ' + n + ' ngồi lặng trong phòng giam, nhớ lại lần cuối ' + P + ' vào thăm, cách tấm kính vẫn cố mỉm cười. ' + n + ' tự hứa sẽ sống tử tế khi ra tù, vì ' + P + '.']
    };
    var line = pick(r, lines[t] || lines.ordinary);
    if (share > 0 && t === 'spoiled') line += got + ' không dám tiêu một đồng, gửi tiết kiệm và tự hứa sẽ làm lại cuộc đời.';
    else if (share > 0 && t === 'success') line += got + ' trích ra một phần làm học bổng mang tên ' + P + '.';
    else if (share === 0 && will && will.plan !== 'personal' && t === 'spoiled') line += ' Trong di chúc, ' + P + ' không để lại tài sản cho ' + n + ', chỉ một lời nhắn. ' + n + ' không oán trách — vì biết ' + P + ' đã cho mình quá nhiều khi còn sống.';
    var GP = P === 'bố' ? 'ông' : 'bà';
    if (k.married && k.kids > 0 && t !== 'little' && t !== 'teen' && l.death.age - k.born < 50 && r() < 0.5) line += [' Đứa con nhỏ của ' + n + ' kéo áo hỏi: “Sao ' + GP + ' ngủ mãi thế?”', ' Bên cạnh, con của ' + n + ' lí nhí: “Con chưa kịp khoe ' + GP + ' giấy khen.”', ' ' + n + ' ôm con vào lòng, dặn: “Sau này con nhớ thương ' + GP + ' nhé, ' + GP + ' thương con nhất nhà.”'][i % 3];
    return line;
  }
  function spouseLine(l) {
    var p = l.partner; if (!p || p.alive === false || p.status === 'dating') return null;
    var r = rngFor(l, 'spouse'), y = l.death.age >= 60 ? 'mấy chục năm' : 'bao năm';
    return pick(r, [
      p.name + ' ngồi lặng bên giường, tay vẫn nắm tay ' + l.name + ' rất lâu sau khi bác sĩ đã lắc đầu. “' + y + ' rồi, sao mình đi trước?”',
      p.name + ' lặng lẽ pha hai tách trà như mọi buổi sáng, rồi chợt nhớ chỉ còn một người. Tách trà thứ hai nguội dần trên bàn.',
      'Sau đám tang, ' + p.name + ' vẫn để nguyên chiếc gối của ' + l.name + ' bên cạnh, mỗi đêm khẽ nói vài câu như người kia vẫn còn nghe.']);
  }
  var fin = E.finale;
  E.finale = function (l) {
    var st = fin.apply(this, arguments);
    if (!l.death || l.death.age < 18) return st;
    var live = (l.kids || []).map(function (k, i) { return { k: k, i: i }; }).filter(function (x) { return x.k.alive !== false; });
    var W = E.WILL70, will = l.flags.will70 || null, lines = [];
    var sp = spouseLine(l); if (sp) lines.push(sp);
    live.forEach(function (x) { var share = W && W.forKid ? W.forKid(l, x.i) : 0; lines.push(reaction(l, x.k, x.i, share, will)); });
    if ((l.grand || 0) > 0 && live.length) lines.push('Các cháu xếp hàng thắp nhang. Đứa lớn nhất đọc bài văn viết về ' + (l.sex === 'M' ? 'ông' : 'bà') + ', cả nhà ai cũng khóc.');
    if (!lines.length) {
      var fr = E.friendsOf ? E.friendsOf(l) : [];
      lines.push(fr.length ? 'Không con cái, không người bạn đời bên cạnh. ' + fr.map(function (f) { return f.name; }).slice(0, 2).join(' và ') + ' lo hậu sự chu đáo như người nhà, đứng lại thật lâu sau khi mọi người đã về.' : 'Đám tang vắng vẻ, chỉ có vài người hàng xóm và chính quyền địa phương lo hậu sự. Một bó hoa trắng không đề tên được ai đó đặt lại bên mộ.');
    }
    st.push({ h: live.length ? 'Khi các con hay tin' : 'Ngày tiễn biệt', x: live.length ? 'Mỗi người con khóc theo một cách, nhớ về ' + (l.sex === 'M' ? 'bố' : 'mẹ') + ' theo một cách:' : '', list: lines });
    return st;
  };
  E.kidGrief = { type: kidType, reaction: reaction };

  // ===================================================================
  // 3. SỐNG TIẾP ĐỜI CON — từ lúc chào đời hoặc ngay ở tuổi hiện tại, nhận thừa kế
  // ===================================================================
  function ctx(l) { return l.abroad && l.abroad.perm ? l.abroad.code : l.country; }
  function kidAgeAtEnd(l, k) { return (l.death ? l.death.age : l.age) - (k.born || 0); }
  E.heirShare = function (l, k) { var i = l.kids.indexOf(k); if (i < 0 || !E.WILL70 || !E.WILL70.estate) return 0; return E.WILL70.forKid(l, i); };
  var childOpts = E.childOpts;
  E.childOpts = function (l, k) {
    var o = childOpts.apply(this, arguments), i = l.kids.indexOf(k), w = l.flags.will70;
    var p = l.partner, mateKeep = !!(p && p.alive !== false && p.status !== 'dating' && k.mate && p.name === k.mate.name);
    o.parent.heir = { side: l.sex === 'F' ? 'm' : 'f', mateKeep: mateKeep, at: Math.max(0, kidAgeAtEnd(l, k)), age: l.death ? l.death.age : l.age, cause: l.death ? l.death.cause : '', name: l.name, sex: l.sex,
      amt: l.death ? Math.max(0, E.heirShare(l, k)) : 0, debt: l.death && E.netWorth(l) < 0, base: l.base, cur: l.cur, ctx: ctx(l), note: w && w.note ? String(w.note).slice(0, 400) : '', idx: i,
      rec: { edu: k.edu || 0, married: !!k.married, job: !!k.job, kids: k.kids || 0, vice: k.vice || null } };
    return o;
  };
  var createLife = E.createLife;
  E.createLife = function (opts) {
    var life = createLife.apply(this, arguments), h = opts && opts.parent && opts.parent.heir;
    if (h && h.at > 0) {
      var keep = {}; keep[h.side] = h.at; if (h.mateKeep) keep[h.side === 'm' ? 'f' : 'm'] = h.at;
      life.flags.heirKeep = keep;
      var amt = h.amt > 0 ? (h.cur === life.cur && h.ctx === ctx(life) ? h.amt : h.amt / h.base * life.base) : 0;
      life.flags.heirOf = { at: h.at, side: h.side, name: h.name, sex: h.sex, age: h.age, cause: h.cause, amt: amt, debt: h.debt, note: h.note };
    }
    return life;
  };
  E.HOOKS.year.unshift(function (l, r, log, a) {
    var h = l.flags.heirOf, f = l.fam;
    if (l.flags.heirTrust > 0 && a >= 18) { var t = l.flags.heirTrust; l.flags.heirTrust = 0; H.cash(l, t, 'Nhận phần thừa kế được giữ hộ'); log('Tròn 18 tuổi, bạn nhận lại phần thừa kế ' + H.money(l, t) + ' mà ' + (h && h.sex === 'M' ? 'bố' : 'mẹ') + ' để lại, người giám hộ đã giữ hộ bấy lâu.', 'good'); }
    if (!h || h.done || a !== h.at) return;
    h.done = true; if (l.flags.heirKeep) l.flags.heirKeep = null;
    var P = h.sex === 'M' ? 'Bố' : 'Mẹ', p = P.toLowerCase();
    if (f[h.side + 'Alive']) {
      f[h.side + 'Alive'] = false;
      log(P + ' ' + h.name + ' qua đời ở tuổi ' + h.age + (h.cause ? (/thanh thản/.test(h.cause) ? ', ' + h.cause : ' vì ' + h.cause) : '') + '.', 'bad');
      l.st.hap -= 14; H.mem(l, 'Ngày ' + p + ' ' + h.name + ' ra đi.', 7);
      if (!f.mAlive && !f.fAlive) l.flags.caring = false;
    }
    if (h.note) log('Trong di chúc, ' + p + ' để lại lời nhắn: “' + h.note + '”', 'big');
    if (h.amt > 0) {
      if (a >= 18) { H.cash(l, h.amt, 'Thừa kế từ ' + p + ' ' + h.name); log('Theo di chúc / pháp luật, bạn được hưởng ' + H.money(l, h.amt) + ' từ di sản của ' + p + '.', 'good'); }
      else { l.flags.heirTrust = (l.flags.heirTrust || 0) + h.amt; log('Phần thừa kế ' + H.money(l, h.amt) + ' của bạn được người giám hộ giữ hộ đến khi bạn tròn 18 tuổi.', 'neutral'); }
    } else if (h.debt) log(P + ' để lại khoản nợ, nhưng theo luật người thừa kế chỉ trả nợ trong phạm vi di sản được hưởng, nên bạn không phải gánh thêm.', 'neutral');
  });
  // tiếp tục ngay ở tuổi hiện tại của con: dựng lại những năm đã qua (máy tự chọn), chọn bản giống hồ sơ của con nhất
  function ffTo(life, at) {
    var guard = 0;
    while (life.alive && life.age < at && guard++ < 130) {
      E.beginYear(life, { auto: true }); var g = 0;
      while (life.pending.length && life.alive && g++ < 64) E.resolve(life, E.autoKey(life));
      if (life.alive) E.finishYear(life); g = 0;
      while (life.pending.length && life.alive && g++ < 64) E.resolve(life, E.autoKey(life));
      E.endYear(life);
    }
    return life.alive && life.age === at;
  }
  function score(life, rec) {
    var sc = -Math.abs((life.edu || 0) - rec.edu) * 2;
    var wed = !!(life.partner && life.partner.status !== 'dating' && life.partner.alive !== false);
    if (wed === rec.married) sc += 2;
    if (!!life.job === rec.job) sc += 1;
    sc -= Math.abs((life.kids || []).length - rec.kids) * 0.7;
    if (rec.vice === 'bỏ học' && life.edu <= 2) sc += 1;
    if (life.jailUntil != null && life.age < life.jailUntil) sc -= 3;
    return sc;
  }
  E.heirAtAge = function (l, k, tries) {
    var o = E.childOpts(l, k), h = o.parent.heir, at = h.at, best = null, bs = -1e9, n = tries || 6;
    if (at <= 0) return E.createLife(o);
    var t0 = Date.now();
    for (var i = 0; i < n; i++) {
      var life = E.createLife(Object.assign({}, o, { seed: (l.rs ^ hashStr(k.name + ':' + i) ^ (i * 7919)) | 0 }));
      if (!ffTo(life, at)) continue;
      var s = score(life, h.rec); if (s > bs) { bs = s; best = life; }
      if (bs >= 3 || (best && Date.now() - t0 > 2500)) break;
    }
    if (!best) return null;
    best.pending = [];
    best.flags.heirFF = { from: h.name, at: at };
    best.log.push({ a: at, y: best.birthYear + at, t: 'Bạn tiếp tục cuộc đời của ' + best.name + ' ở tuổi ' + at + ', năm ' + (l.sex === 'M' ? 'bố' : 'mẹ') + ' ' + h.name + ' ra đi.', k: 'big' });
    return best;
  };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
