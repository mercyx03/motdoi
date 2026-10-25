/* Một Đời — v4.1 (góp ý của người chơi):
   · nghĩa vụ quân sự đủ 24 tháng (nhập ngũ 18 tuổi → ra quân năm 20 tuổi), năm thứ hai có nhiều chuyện quân ngũ hơn; trợ cấp xuất ngũ theo mức mới
   · con cái: thành tài (thủ khoa, học bổng du học, giám đốc, bác sĩ giỏi…) hoặc phá gia chi tử (cờ bạc, nợ tín dụng đen…)
   · đất, vàng mất giá: được chọn bán cắt lỗ, giữ chờ hồi, hay mua thêm
   · cặp đôi đồng giới: ở Việt Nam chung sống, hoặc sang nước đã hợp pháp hóa hôn nhân đồng giới để kết hôn và sống ở đó
   · đang định cư nước ngoài: làm việc từ xa cho công ty Việt Nam, về Việt Nam sống một thời gian rồi quay lại (đổi tiền, vé máy bay) */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN, C = G.CUR, W = G.W;
  function A(id, g, label, o) { var x = { id: id, g: g, l: label }; for (var k in o) x[k] = o[k]; E.ACT.push(x); }
  function fx(l, o) { H.fx(l, o); }
  function mo(l, v) { return H.money(l, v); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function vnd(l) { return isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  function V(l, tr) { return vnd(l) ? tr : tr / 90 * l.base; }
  function yr(l) { return l.birthYear + l.age; }
  function T(id, when, p, cd, max) { E.TRIG.push({ id: id, when: function (l, a) { return free(l) && when(l, a); }, p: p, cd: cd || 4, max: max || 1 }); }

  // ===================================================================
  // 1. QUÂN NGŨ: NĂM THỨ HAI NHIỀU CHUYỆN HƠN, TRỢ CẤP XUẤT NGŨ MỚI
  // ===================================================================
  function NV(id, title, text, opts) { SC(id, { title: title, major: 0, text: text, opts: opts.map(function (o) { return { k: o[0], l: o[1], ai: o[2], run: o[3] }; }) }); if (E.MAJOR) E.MAJOR[id] = 0; }
  NV('nv_ban_dan', 'Kiểm tra bắn đạn thật', 'Đơn vị kiểm tra bắn đạn thật bài 1 với súng AK. Bắn đạt giỏi thì được khen, bắn trượt thì cả tiểu đội chạy thêm 5 km.', [
    ['tap', 'Tối nào cũng tập ngắm bắn, tập nín thở', { w: 1.2, amb: 1 }, function (l, r, log) { if (ch(r, 0.6)) { log('Ba viên trúng vòng 9, vòng 10 — đạt loại giỏi, được chỉ huy khen trước hàng quân.', 'good'); l.flags.milGood = true; fx(l, { hap: 4 }); } else log('Bắn đạt yêu cầu, không xuất sắc nhưng không phải chạy phạt.', 'neutral'); }],
    ['hen', 'Tập vừa phải, cầu may', { w: 0.8 }, function (l, r, log) { if (ch(r, 0.35)) log('Một viên trượt bia, cả tiểu đội phải chạy thêm 5 km. Đồng đội vẫn cười xòa.', 'neutral'); else log('Bắn đạt yêu cầu.', 'neutral'); }]]);
  NV('nv_hanh_quan', 'Hành quân dã ngoại', 'Đơn vị hành quân dã ngoại 30 km, mang đủ quân tư trang, ăn ngủ trong rừng ba ngày.', [
    ['deo', 'Cắn răng đi hết, còn vác giúp đồng đội', { w: 1.2 }, function (l, r, log) { fx(l, { hea: 2, soc: 3 }); log('Vai rớm máu, chân phồng rộp, nhưng đi hết chặng và vác giúp đồng đội bị bong gân. Cả tiểu đội nể.', 'good'); }],
    ['xin', 'Xin đi xe hậu cần vì đau chân', { w: 0.4 }, function (l, r, log) { log('Ngồi xe hậu cần nửa chặng, bị đồng đội trêu cả tháng.', 'neutral'); }]]);
  NV('nv_tet', 'Tết trong quân ngũ', 'Lần đầu ăn Tết xa nhà. Đơn vị gói bánh chưng, tổ chức văn nghệ, nhưng đêm giao thừa bạn vẫn phải đứng gác.', [
    ['gac', 'Đứng gác đêm giao thừa, nghe pháo hoa từ xa', { w: 1 }, function (l, r, log) { fx(l, { hap: -1, karma: 2 }); log('Đứng gác đêm giao thừa, nghe tiếng pháo hoa vọng lại từ thị trấn, nghĩ về bữa cơm ở nhà.', 'neutral'); H.mem(l, 'Đêm giao thừa đứng gác ở đơn vị, nhớ nhà đến nghẹn.', 4); }],
    ['van_nghe', 'Lên hát một bài trong đêm văn nghệ', { soc: 1 }, function (l, r, log) { fx(l, { hap: 3, soc: 2 }); log('Hát bài "Tết nhà mình" trong đêm văn nghệ đơn vị, cả hội trường hát theo.', 'good'); }]]);
  NV('nv_dien_thoai', 'Chiếc điện thoại lén', 'Đồng đội rủ giấu một chiếc điện thoại để tối lén gọi về cho người yêu — quân đội chỉ cho dùng điện thoại vào cuối tuần.', [
    ['khong', 'Từ chối, giữ đúng kỷ luật', { w: 1.2 }, function (l, r, log) { log('Từ chối, chờ đến cuối tuần mới gọi về nhà. Đợt kiểm tra đột xuất, cả trung đội có mấy người bị kỷ luật — bạn không có tên.', 'good'); fx(l, { karma: 2 }); }],
    ['co', 'Lén dùng chung', { risk: 0.8, w: 0.5 }, function (l, r, log) { if (ch(r, 0.4)) { log('Bị phát hiện trong đợt kiểm tra đột xuất, bị kiểm điểm trước đơn vị, cắt phép một đợt.', 'bad'); fx(l, { hap: -4 }); l.flags.milGood = false; } else log('Lén gọi được mấy cuộc, may mà không bị phát hiện.', 'neutral'); }]]);
  NV('nv_thu_nha', 'Thư từ hậu phương', function (l) { return l.partner && l.partner.status === 'dating' ? l.partner.name + ' gọi điện vào cuối tuần, giọng buồn buồn: "Hai năm lâu quá ' + E.xung(l).you + ' ạ…"' : 'Mẹ gửi lên một thùng quà: mấy hộp ruốc, gói lạc rang, kèm lá thư viết tay dặn ăn uống đủ.'; }, [
    ['vung', 'Động viên, hẹn ngày trở về', { w: 1.2 }, function (l, r, log) { if (l.partner && l.partner.status === 'dating') { if (ch(r, 0.7)) { log('Hứa ngày ra quân sẽ về ngay. ' + l.partner.name + ' bảo sẽ chờ.', 'good'); fx(l, { hap: 3 }); } else { log(l.partner.name + ' nói lời chia tay qua điện thoại. Đêm đó bạn ngồi một mình ở bãi tập.', 'bad'); H.endPartner(l, log, 'split'); l.exes++; fx(l, { hap: -8 }); } } else { log('Chia thùng quà của mẹ cho cả tiểu đội, ai cũng khen ruốc mẹ làm ngon.', 'good'); fx(l, { hap: 3, soc: 2 }); } }]]);
  NV('nv_hoi_thao', 'Hội thao quân sự', 'Sư đoàn tổ chức hội thao: chạy vũ trang, ném lựu đạn xa, vượt vật cản.', [
    ['thi', 'Xung phong thi đấu', { amb: 1, w: 1 }, function (l, r, log) { if (ch(r, 0.3 + l.st.hea / 300)) { log('Giành giải nhất nội dung vượt vật cản, được tặng giấy khen.', 'good'); l.flags.milGood = true; fx(l, { hap: 5 }); } else log('Thi hết sức, về giữa bảng. Vui là chính.', 'neutral'); }],
    ['co_vu', 'Ngồi cổ vũ đồng đội', { w: 0.8 }, function (l, r, log) { log('Hò hét cổ vũ đến khản giọng.', 'neutral'); }]]);
  NV('nv_tang_gia', 'Tăng gia sản xuất', 'Ngoài giờ huấn luyện, đơn vị giao bạn chăm vườn rau, chuồng lợn để cải thiện bữa ăn.', [
    ['cham', 'Chăm chỉ làm', { w: 1.2 }, function (l, r, log) { fx(l, { hea: 1, karma: 1 }); log('Vườn rau xanh mướt, đàn lợn béo tròn — bữa ăn của đơn vị có thêm thịt, có thêm rau.', 'good'); }],
    ['loi', 'Làm cho có', { w: 0.4 }, function (l, r, log) { log('Làm qua loa, rau héo một góc, bị nhắc nhở.', 'neutral'); }]]);
  var POOL = ['nv_dien_tap', 'nv_cuu_ho', 'nv_phep', 'nv_dong_doi', 'nv_ban_dan', 'nv_hanh_quan', 'nv_tet', 'nv_dien_thoai', 'nv_thu_nha', 'nv_hoi_thao', 'nv_tang_gia'];
  E.milYear = function (l, r, a) {
    var L = [], seen = (l.flags.milSeen = l.flags.milSeen || {});
    if (!l.flags.milTB) L.push(['nv_tan_binh'], ['nv_don_vi']);
    var pool = POOL.filter(function (id) { return E.DEC[id] && !seen[id]; });
    if (isVN(l) && l.flags.milGood && !l.flags.milDang && E.DEC.nv_dang) pool.push('nv_dang');
    for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
    var n = l.flags.milTB ? 3 : 2; // năm đầu trong quân ngũ: tân binh + về đơn vị + 2 chuyện; năm sau: 3 chuyện
    pool.slice(0, n).forEach(function (id) { L.push([id]); seen[id] = 1; });
    return L;
  };
  // trợ cấp xuất ngũ: trợ cấp một lần (2 tháng lương cơ sở / năm) + trợ cấp tạo việc làm (6 tháng) — lương cơ sở 2,53 triệu (2026);
  // từ 2027 theo mức đề xuất mới: 5 tháng / năm + 8 tháng tạo việc làm
  function allowance(l) { var y = yr(l); return y >= 2027 ? 45.5 : y >= 2026 ? 25.3 : 23.4; }
  E.milAllowance = allowance;
  if (E.DEC.nv_xuat_ngu) E.DEC.nv_xuat_ngu.def.opts.forEach(function (o) {
    if (o.k !== 've') return;
    o.h = function (l) { return 'Trợ cấp xuất ngũ và tạo việc làm khoảng ' + mo(l, V(l, allowance(l))) + ', được hỗ trợ học nghề'; };
    o.run = function (l, r, log) { var x = V(l, allowance(l)); H.cash(l, x, 'Trợ cấp xuất ngũ, tạo việc làm'); l.flags.milVet = true; log('Ra quân sau 24 tháng, nhận trợ cấp xuất ngũ và trợ cấp tạo việc làm ' + mo(l, x) + '. Chia tay đồng đội trong nước mắt rồi về quê.', 'big'); H.mem(l, 'Ngày ra quân, cả tiểu đội ôm nhau ở cổng doanh trại.', 5); fx(l, { hap: 5 }); };
  });

  // ===================================================================
  // 2. CON THÀNH TÀI / PHÁ GIA CHI TỬ
  // ===================================================================
  function kidsOf(l, f) { return (l.kids || []).filter(function (k) { return k.alive && f(k, l.age - k.born); }); }
  SC('con_thanh_tai', {
    title: 'Con thành tài', valid: function (l) { return kidsOf(l, function (k, a) { return a >= 18 && a <= 45 && (k.study || 50) >= 65; }).length > 0; },
    prep: function (l, r) { var k = pick(r, kidsOf(l, function (k, a) { return a >= 18 && a <= 45 && (k.study || 50) >= 65; })); var a = l.age - k.born;
      return { n: k.name, t: a <= 22 ? pick(r, ['đỗ thủ khoa đầu vào đại học', 'giành học bổng toàn phần du học thạc sĩ ở nước ngoài', 'đạt giải trong kỳ thi Olympic sinh viên toàn quốc']) : pick(r, ['được bổ nhiệm giám đốc chi nhánh', 'trở thành bác sĩ giỏi có tiếng ở bệnh viện tỉnh', 'khởi nghiệp thành công, được báo chí viết bài', 'bảo vệ luận án tiến sĩ ở nước ngoài']) }; },
    text: function (l, d) { return 'Con ' + d.n + ' ' + d.t + '. Cả họ gọi điện chúc mừng.'; },
    opts: [
      { k: 'tiec', l: 'Làm mâm cơm mừng, mời họ hàng', ai: { w: 1, soc: 0.8 }, run: function (l, r, log, d) { H.cash(l, -V(l, 5), 'Làm cỗ mừng con'); log('Làm mấy mâm cơm mừng con ' + d.n + ' ' + d.t + ', họ hàng khen nức nở.', 'good'); fx(l, { hap: 8, soc: 3 }); H.mem(l, 'Ngày con ' + d.n + ' ' + d.t + '.', 6); } },
      { k: 'dan', l: 'Mừng thầm, dặn con giữ khiêm tốn', ai: { w: 1, smart: 0.8 }, run: function (l, r, log, d) { log('Gọi điện dặn con: "Giỏi rồi thì càng phải khiêm tốn." ' + d.n + ' cười bảo bố mẹ lúc nào cũng thế.', 'good'); fx(l, { hap: 6 }); } }
    ]
  });
  T('con_thanh_tai', function (l) { return kidsOf(l, function (k, a) { return a >= 18 && a <= 45 && (k.study || 50) >= 65; }).length > 0; }, 0.05, 6, 2);
  function sellHouse(l, why) { H.cash(l, l.houseVal - (l.mortgage || 0), why); l.ownHouse = false; l.houseVal = 0; l.mortgage = 0; l.loans = (l.loans || []).filter(function (x) { if (x.type === 'home') { H.cash(l, -x.bal, 'Tất toán vay mua nhà'); return false; } return true; }); }
  SC('con_pha_gia', {
    title: 'Đứa con phá gia chi tử', valid: function (l) { return kidsOf(l, function (k, a) { return a >= 18 && a <= 45 && ((k.study || 50) < 45 || k.vice); }).length > 0; },
    prep: function (l, r) { var k = pick(r, kidsOf(l, function (k, a) { return a >= 18 && a <= 45 && ((k.study || 50) < 45 || k.vice); })); return { n: k.name, debt: Math.round(80 + r() * 400) }; },
    text: function (l, d) { return 'Con ' + d.n + ' mê cờ bạc, cá độ bóng đá, vay cả tín dụng đen. Hôm nay mấy thanh niên xăm trổ đến tận nhà đòi nợ ' + mo(l, V(l, d.debt)) + ', dọa "không trả thì đừng trách".'; },
    opts: [
      { k: 'tra', l: 'Gom tiền trả nợ cho con lần này', ai: { w: 1 }, run: function (l, r, log, d) { var x = Math.min(V(l, d.debt), Math.max(0, l.money) + l.base); H.cash(l, -x, 'Trả nợ cờ bạc cho con'); var k = (l.kids || []).filter(function (c) { return c.name === d.n; })[0]; if (k) k.vice = 'cờ bạc'; log('Gom ' + mo(l, x) + ' trả nợ cho con. ' + (ch(r, 0.5) ? d.n + ' quỳ xuống hứa bỏ cờ bạc.' : 'Mấy tháng sau ' + d.n + ' lại chứng nào tật nấy.'), 'bad'); fx(l, { hap: -8 }); if (l.mind) l.mind.stress = Math.min(100, l.mind.stress + 10); } },
      { k: 'cong_an', l: 'Trình báo công an về nhóm đòi nợ, bắt con tự chịu trách nhiệm', ai: { w: 1, smart: 1 }, run: function (l, r, log, d) { log('Trình báo công an: nhóm đòi nợ bị triệu tập vì cho vay nặng lãi, đe dọa. Bạn không trả thay, bắt ' + d.n + ' đi làm trả dần — đau lòng nhưng con dần tỉnh ngộ.', 'neutral'); var k = (l.kids || []).filter(function (c) { return c.name === d.n; })[0]; if (k) { k.close = Math.max(0, (k.close || 50) - 10); k.vice = null; } fx(l, { hap: -4 }); } },
      { k: 'ban_nha', l: 'Bán đất, bán nhà trả nợ cho con', req: function (l) { return l.ownHouse || (l.assets && l.assets.land > 0.5); }, ai: { w: 0.3 }, run: function (l, r, log, d) { if (l.assets && l.assets.land > 0.5) { H.cash(l, l.assets.land, 'Bán đất'); l.assets.land = 0; log('Bán mảnh đất dành dụm cả đời để trả nợ cho con ' + d.n + '.', 'bad'); } else { sellHouse(l, 'Bán nhà'); log('Bán cả căn nhà để trả nợ cho con, cả nhà dọn đi ở trọ.', 'bad'); } H.cash(l, -V(l, d.debt), 'Trả nợ cho con'); fx(l, { hap: -12 }); H.mem(l, 'Ngày bán tài sản trả nợ cho con ' + d.n + '.', 5); } }
    ]
  });
  T('con_pha_gia', function (l) { return kidsOf(l, function (k, a) { return a >= 18 && a <= 45 && ((k.study || 50) < 45 || k.vice); }).length > 0; }, 0.035, 6, 2);

  // ===================================================================
  // 3. ĐẤT, VÀNG MẤT GIÁ: BÁN HAY GIỮ
  // ===================================================================
  var ANAME = { land: 'lô đất', gold: 'số vàng tích trữ', stock: 'danh mục cổ phiếu' };
  E.HOOKS.year.push(function (l, r, log, a) {
    var A = l.assets, B = l.basis; if (!A || !B || !l.alive || !free(l)) return;
    ['land', 'gold'].some(function (k) {
      if (!(A[k] > l.base * 0.5) || !(B[k] > 0)) return false;
      var loss = 1 - A[k] / B[k], at = (l.flags.dropAt = l.flags.dropAt || {});
      if (loss < 0.15 || (at[k] != null && a - at[k] < 3)) return false;
      at[k] = a; l.pending.push(E.DEC.tai_san_giam.make(l, r, { k: k, loss: loss })); return true;
    });
  });
  SC('tai_san_giam', {
    title: function (l, d) { return U.cap(ANAME[d.k]) + ' mất giá'; },
    valid: function (l, d) { return !!(l.assets && d && d.k && l.assets[d.k] > 0.5); },
    prep: function (l, r, a) { return a || { k: 'land', loss: 0.2 }; },
    text: function (l, d) { var A = l.assets, B = l.basis; return U.cap(ANAME[d.k]) + ' bạn mua ' + mo(l, B[d.k]) + ' giờ chỉ còn khoảng ' + mo(l, A[d.k]) + ' (giảm ' + Math.round(d.loss * 100) + '%). ' + (d.k === 'land' ? 'Thị trường đóng băng, rao bán mãi không ai hỏi.' : 'Giá vàng thế giới lao dốc, tiệm vàng mua vào thấp hơn bán ra cả triệu đồng một lượng.') + ' Bạn tính sao?'; },
    opts: [
      { k: 'ban', l: 'Bán ngay, cắt lỗ', ai: { w: 0.7, risk: -0.5 }, run: function (l, r, log, d) { var A = l.assets, v = A[d.k] * (d.k === 'land' ? 0.9 : 0.97); H.cash(l, v, 'Bán ' + ANAME[d.k]); log('Bán ' + ANAME[d.k] + ' được ' + mo(l, v) + ', chấp nhận lỗ ' + mo(l, Math.max(0, l.basis[d.k] - v)) + '. Nhẹ người.', 'neutral'); A[d.k] = 0; l.basis[d.k] = 0; fx(l, { hap: -3 }); } },
      { k: 'ban_nua', l: 'Bán một nửa, giữ một nửa', ai: { w: 0.8 }, run: function (l, r, log, d) { var A = l.assets, half = A[d.k] / 2, v = half * (d.k === 'land' ? 0.9 : 0.97); H.cash(l, v, 'Bán bớt ' + ANAME[d.k]); A[d.k] -= half; l.basis[d.k] /= 2; log('Bán một nửa ' + ANAME[d.k] + ' lấy ' + mo(l, v) + ' tiền mặt cho chắc, nửa còn lại chờ giá hồi.', 'neutral'); } },
      { k: 'giu', l: 'Giữ, chờ thị trường hồi', ai: { w: 1.1 }, run: function (l, r, log, d) { log('Quyết định giữ ' + ANAME[d.k] + ', "đất không ăn không uống, chờ được".', 'neutral'); if (l.mind) l.mind.stress = Math.min(100, l.mind.stress + 4); } },
      { k: 'them', l: 'Mua thêm khi giá đang rẻ', req: function (l) { return l.money > l.base; }, ai: { w: 0.5, risk: 0.8 }, run: function (l, r, log, d) { var x = Math.min(l.money * 0.4, l.base * 3); H.cash(l, -x, 'Mua thêm ' + ANAME[d.k]); l.assets[d.k] += x; l.basis[d.k] += x; log('Mua thêm ' + ANAME[d.k] + ' giá rẻ ' + mo(l, x) + ' — "người khác sợ hãi thì mình tham lam".', 'neutral'); } }
    ]
  });

  // ===================================================================
  // 4. CẶP ĐÔI ĐỒNG GIỚI: SANG NƯỚC ĐÃ CÔNG NHẬN HÔN NHÂN ĐỒNG GIỚI
  // ===================================================================
  var SSM = ['TH', 'AU', 'CA', 'US', 'NL', 'DE', 'FR', 'GB', 'ES', 'NZ', 'SE', 'IE', 'BE', 'DK', 'NO', 'CH', 'AT', 'PT', 'FI', 'IS', 'LU', 'MT', 'BR', 'AR', 'MX', 'CL', 'CO', 'UY', 'ZA', 'CR', 'EE', 'SI', 'GR', 'EC', 'CU', 'AD', 'LI'].filter(function (c) { return W && W.BY[c] && W.SSM.indexOf(c) >= 0; });
  E.SSM_LIST = SSM;
  var mk0 = E.DEC.marry.make, ap0 = E.DEC.marry.apply;
  E.DEC.marry.make = function (l, r) {
    var d = mk0.apply(this, arguments), p = l.partner;
    if (p && p.sex === l.sex && !H.sameSexLegal(l) && SSM.length) {
      d.opts.splice(1, 0, { k: 'nuoc_ngoai', l: 'Cùng sang một nước đã công nhận hôn nhân đồng giới để kết hôn và sinh sống', h: 'Kết hôn hợp pháp · chuyển cả cuộc sống sang nước đó · chi phí thủ tục, vé máy bay' });
      d.text += ' Nhiều nước đã công nhận hôn nhân cùng giới — gần nhất là Thái Lan, xa hơn có Úc, Canada, Mỹ, Hà Lan, Đức…';
    }
    return d;
  };
  var au0 = E.DEC.marry.auto;
  E.DEC.marry.auto = function (l, d, r) { if (d.opts.some(function (o) { return o.k === 'nuoc_ngoai'; }) && r() < 0.12) return 'nuoc_ngoai'; return au0.apply(this, arguments); };
  E.DEC.marry.apply = function (l, d, k, r, log) { if (k === 'nuoc_ngoai') { l.pending.unshift(E.DEC.ket_hon_nn.make(l, r, { p: 0 })); return; } return ap0.apply(this, arguments); };
  var PER = 8;
  SC('ket_hon_nn', {
    title: 'Chọn nước để kết hôn và sinh sống', valid: function (l) { return !!(l.partner && l.partner.sex === l.sex); },
    prep: function (l, r, a) { var p = (a && a.p) || 0; return { p: p, cs: SSM.slice(p * PER, p * PER + PER) }; },
    text: function (l, d) { return 'Các nước đã hợp pháp hóa hôn nhân đồng giới. Sang đó, hai bạn đăng ký kết hôn và bắt đầu cuộc sống mới: tìm việc, thuê nhà, mua sắm bằng tiền nước đó. Tiền tiết kiệm sẽ được quy đổi theo tỉ giá.'; },
    opts: Array.apply(null, Array(PER)).map(function (_, i) {
      return { k: 'n' + i, l: function (l, d) { var c = d.cs[i]; return c ? W.BY[c].name : ''; }, h: function (l, d) { var c = d.cs[i]; if (!c) return ''; var B = W.BY[c]; return (c === 'TH' ? 'gần Việt Nam, hợp pháp từ 2025 · ' : '') + 'mức sống ' + (B.gdp >= 50 ? 'cao' : B.gdp >= 20 ? 'khá' : 'trung bình') + ' · thành phố: ' + B.cities.slice(0, 2).join(', '); }, req: function (l, d) { return !!d.cs[i]; }, ai: { w: 1 },
        run: function (l, r, log, d) { var c = d.cs[i]; moveAbroadMarried(l, r, log, c); } };
    }).concat([
      { k: 'them', l: 'Xem thêm các nước khác ›', req: function (l, d) { return SSM.length > (d.p + 1) * PER; }, ai: { w: 0 }, run: function (l, r, log, d) { l.pending.unshift(E.DEC.ket_hon_nn.make(l, r, { p: d.p + 1 })); } },
      { k: 'o_lai', l: 'Thôi, ở lại Việt Nam, sống chung là đủ', ai: { w: 0.5 }, run: function (l, r, log) { ap0.call(E.DEC.marry, l, { data: {} }, 'marry', r, log); } }
    ])
  });
  function moveAbroadMarried(l, r, log, c) {
    var B = W.BY[c], pool = String(B.pool || 'en').split(',')[0].split(':')[0];
    var cost = c === 'TH' ? 25 : 70; if (!vnd(l)) cost = l.abroad && l.abroad.perm ? cost / toVNDf(l) : V(l, cost); l.money -= cost; var costTxt = mo(l, cost);
    l.flags.vnHome = { place: l.place, city: l.city, urban: l.urban, movedTo: l.movedTo, cityWealth: l.cityWealth };
    H.emigrate(l, [c, B.name, pool], r, log);
    l.partner.status = 'married'; l.partner.since = l.age; l.flags.ssmAbroad = c;
    log('Đăng ký kết hôn với ' + l.partner.name + ' ở ' + B.name + ' — tờ giấy hôn thú mà ở quê nhà chưa thể có. Thủ tục, vé máy bay, ổn định chỗ ở hết khoảng ' + costTxt + '.', 'big'); fx(l, { hap: 12 });
    H.mem(l, 'Ngày ký giấy kết hôn với ' + l.partner.name + ' ở ' + B.name + '.', 8);
  }
  E.moveAbroadMarried = moveAbroadMarried;

  // ===================================================================
  // 5. ĐỊNH CƯ NƯỚC NGOÀI: LÀM VIỆC TỪ XA, VỀ VIỆT NAM MỘT THỜI GIAN, QUAY LẠI
  // ===================================================================
  function vnBorn(l) { return l.country === 'VN'; }
  function resGdp(l) { var B = l.abroad && W.BY[l.abroad.code]; return B ? B.gdp : l.gdp; }
  // tiền nước ngoài ↔ triệu đồng theo tỉ giá thực
  function toVNDf(l) { return C.priceLevel(resGdp(l)) * C.VND / 1e6; }
  function convertAll(l, f) {
    if (!(isFinite(f) && f > 0)) throw new Error('Invalid currency conversion');
    function fields(o, names) { if (o) names.forEach(function (k) { if (typeof o[k] === 'number' && isFinite(o[k])) o[k] *= f; }); }
    fields(l, ['money', 'mortgage', 'houseVal', 'vehVal', 'income', 'lastIncome', 'pensionInc']);
    // Deferred inheritance is money too: convert once with the rest of the estate.
    fields(l.flags, ['heirTrust']);
    var world120 = l.flags && l.flags.world120;
    if (world120) { (world120.companies || []).forEach(function (company) { fields(company, ['value','peak','lastProfit','chairCost137']);fields(company.fresh,['amt']); }); fields(world120.charity, ['own', 'total']); }

    fields(l.flags && l.flags.heirOf, ['amt', 'pay']);
    var inheritedItems = [].concat(l.flags && l.flags.heirOf && l.flags.heirOf.items || [], l.flags && l.flags.heirItemsTrust && l.flags.heirItemsTrust.items || []);
    var convertedItems = new Set();
    inheritedItems.forEach(function (item) { if (!item || convertedItems.has(item)) return; convertedItems.add(item); fields(item, ['v']); if(E.BUSINESS137)E.BUSINESS137.scaleItem(item,f); fields(item.data, ['v', 'basis', 'cap', 'unit', 'R']); });
    (l.loans || []).forEach(function (x) { fields(x, ['bal']); });
    [l.assets, l.basis].forEach(function (A) { if (A) fields(A, Object.keys(A)); });
    [l.port, l.coins].forEach(function (P) { if (P) Object.keys(P).forEach(function (k) { fields(P[k], ['v', 'basis']); }); });
    fields(l.si, ['sum', 'm']);
    fields(l.partner, ['inc']);
    fields(l.fam, ['mInc', 'fInc', 'mInc0', 'fInc0', 'mLost', 'fLost']);
    [l.job, l.lastJob].forEach(function (j, i, all) { if (!i || j !== all[0]) fields(j, ['last', 'floor', 'sportPrevSalary']); });
    (l.props || []).forEach(function (p) { fields(p, ['v', 'basis']); });
    (l.ventures || []).forEach(function (v) { fields(v, ['cap', 'unit', 'R']); fields(v.last, ['rev', 'cost', 'prof']); });
    // marketBook prices and positions retain their explicitly named VND/USD currencies.
  }
  E.abroadConvert = convertAll;
  function flight(l) { return 15 / toVNDf(l); } // vé máy bay khứ hồi ~15 triệu đồng, tính ra tiền nước sở tại
  SC('ve_vn_song', {
    title: 'Về Việt Nam sống một thời gian', valid: function (l) { return vnBorn(l) && !!(l.abroad && l.abroad.perm); },
    text: function (l) { return 'Bạn đang sống ở ' + l.abroad.name + '. Về Việt Nam ở một thời gian thì phải bán / thanh lý nhà cửa, xe bên này, đổi tiền sang tiền Việt, mua vé máy bay (khoảng ' + mo(l, flight(l)) + ').' + (l.job ? ' Công việc hiện tại sẽ phải nghỉ, trừ khi làm việc từ xa.' : ''); },
    opts: [
      { k: 've', l: 'Về Việt Nam', ai: { w: 0.6 }, run: function (l, r, log) {
        var name = l.abroad.name, code = l.abroad.code;
        H.cash(l, -flight(l), 'Vé máy bay về Việt Nam');
        if (l.ownHouse) { log('Bán căn nhà ở ' + name + ' được ' + mo(l, l.houseVal) + '.', 'neutral'); sellHouse(l, 'Bán nhà ở ' + name); }
        var remote = l.job && /^fl_/.test(E.resolveJob(l.job.id));
        var f = toVNDf(l); l.flags.abroadSaved = { code: code, name: name, perm: true, pool: l.abroad.pool, base: l.abroad.base, place: l.place }; l.abroad = null; l.cur = 'vnd'; convertAll(l, f);
        var h = l.flags.vnHome || {}; l.place = h.place || (l.prov && l.prov.old) || l.place; l.city = h.city || l.place; l.urban = h.urban != null ? h.urban : l.urban; l.movedTo = h.movedTo; if (h.cityWealth) l.cityWealth = h.cityWealth; H.setBase(l);
        if (!remote) { l.job = null; l.flags.needJob = true; }
        log('Về Việt Nam sống một thời gian sau những năm ở ' + name + '. Tiền tiết kiệm đổi sang tiền Việt được ' + mo(l, Math.max(0, l.money)) + '.' + (remote ? ' Vẫn làm việc từ xa như cũ.' : ''), 'big');
        fx(l, { hap: 6, soc: 4 }); H.mem(l, 'Ngày đặt chân về Việt Nam sau bao năm xa xứ.', 5);
      } },
      { k: 'khong', l: 'Thôi, chỉ bay về thăm nhà rồi quay lại', ai: { w: 1 }, run: function (l, r, log) { if (E.DEC.tham_bo_me && (l.fam.mAlive || l.fam.fAlive)) l.pending.unshift(E.DEC.tham_bo_me.make(l, r)); else log('Gác lại dự định về nước.', 'neutral'); } }
    ]
  });
  A('ve_vn_song', 'Gia đình & bạn bè', 'Về Việt Nam sống một thời gian', { min: 20, sc: 've_vn_song', avail: function (l) { return !vnBorn(l) || !(l.abroad && l.abroad.perm) ? 'Không áp dụng' : (l.ventures || []).length ? 'Đang có cơ sở kinh doanh ở nước ngoài' : true; } });
  SC('quay_lai_nn', {
    title: function (l) { return 'Quay lại ' + l.flags.abroadSaved.name; }, valid: function (l) { return !!l.flags.abroadSaved && !l.abroad; },
    text: function (l) { var S = l.flags.abroadSaved; return 'Bạn tính quay lại ' + S.name + '. Phải đổi tiền Việt sang tiền nước đó, mua vé máy bay (khoảng ' + mo(l, 25) + '), tìm lại chỗ ở, việc làm.' + (l.ownHouse ? ' Căn nhà ở Việt Nam sẽ bán đi.' : ''); },
    opts: [
      { k: 'di', l: function (l) { return 'Quay lại ' + l.flags.abroadSaved.name; }, req: function (l) { return l.money >= 25; }, ai: { w: 0.6 }, run: function (l, r, log) {
        var S = l.flags.abroadSaved; H.cash(l, -25, 'Vé máy bay sang ' + S.name);
        if (l.ownHouse) sellHouse(l, 'Bán nhà ở Việt Nam');
        var remote = l.job && /^fl_/.test(E.resolveJob(l.job.id));
        l.flags.vnHome = { place: l.place, city: l.city, urban: l.urban, movedTo: l.movedTo, cityWealth: l.cityWealth };
        l.abroad = { code: S.code, name: S.name, perm: true, pool: S.pool, base: S.base }; l.cur = 'usd'; convertAll(l, 1 / toVNDf(l)); l.place = S.place; l.city = S.place; l.urban = true; l.flags.abroadSaved = null; H.setBase(l);
        if (!remote) { l.job = null; l.flags.needJob = true; }
        log('Quay lại ' + S.name + ', đổi tiền Việt được ' + mo(l, Math.max(0, l.money)) + '. Bắt đầu lại ở ' + S.place + '.', 'big');
      } },
      { k: 'o', l: 'Ở hẳn Việt Nam', ai: { w: 1 }, run: function (l, r, log) { log('Quyết định ở hẳn Việt Nam, gần gia đình.', 'neutral'); l.flags.abroadSaved = null; } }
    ]
  });
  A('quay_lai_nn', 'Gia đình & bạn bè', 'Quay lại nước đã định cư', { min: 20, sc: 'quay_lai_nn', avail: function (l) { return l.flags.abroadSaved && !l.abroad ? true : 'Không áp dụng'; } });
  // làm việc từ xa cho công ty Việt Nam
  SC('viec_remote', {
    title: 'Làm việc từ xa', valid: function (l) { return vnBorn(l) && !!(l.abroad && l.abroad.perm); },
    text: function (l) { return 'Sống ở ' + l.abroad.name + ' nhưng vẫn có thể nhận việc từ xa cho công ty, khách hàng ở Việt Nam qua mạng (lệch múi giờ thì phải họp đêm).'; },
    opts: [
      { k: 'fl_dev', l: 'Lập trình viên làm từ xa', req: function (l) { return l.edu >= 5; }, ai: { w: 1 }, run: function (l, r, log) { E.startJob(l, 'fl_dev', r, log); log('Nhận làm lập trình từ xa cho một công ty phần mềm ở Việt Nam.', 'neutral'); } },
      { k: 'fl_dich', l: 'Biên dịch, phiên dịch online', ai: { w: 1 }, run: function (l, r, log) { E.startJob(l, 'fl_dich', r, log); } },
      { k: 'fl_content', l: 'Viết nội dung, làm marketing online', ai: { w: 0.8 }, run: function (l, r, log) { E.startJob(l, 'fl_content', r, log); } },
      { k: 'fl_day', l: 'Dạy tiếng Việt / dạy học online', req: function (l) { return l.edu >= 5; }, ai: { w: 0.8 }, run: function (l, r, log) { E.startJob(l, 'fl_day', r, log); } },
      { k: 'khong', l: 'Thôi, tìm việc ở nước sở tại', ai: { w: 0.6 }, run: function (l, r, log) { l.flags.needJob = true; } }
    ]
  });
  A('viec_remote', 'Công việc', 'Làm việc từ xa cho công ty Việt Nam', { min: 18, sc: 'viec_remote', avail: function (l) { return vnBorn(l) && l.abroad && l.abroad.perm ? true : 'Không áp dụng'; } });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
