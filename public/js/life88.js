/* Một Đời — v7.1.0: xuất thân mồ côi ngẫu nhiên
   · khoảng 1–4% ca sinh (nhà càng nghèo càng dễ gặp) không còn bố mẹ bên cạnh từ khi chào đời — dùng RNG riêng nên các đời khác không đổi
   · bốn hoàn cảnh: ông bà nuôi, họ hàng cưu mang, mái ấm / trại trẻ mồ côi (hoặc gia đình nuôi dưỡng tạm thời ở nước ngoài), bị bỏ rơi trước cổng chùa
   · người nuôi dưỡng chi tiêu cho bạn đến tuổi tự lập; không có thừa kế, không ai chu cấp, ra đời với hai bàn tay trắng
   · trẻ ở mái ấm có thể được một gia đình nhận làm con nuôi; người lớn tuổi nuôi bạn có thể mất trước khi bạn trưởng thành
   · học bổng cho trẻ mồ côi, ngày rời mái ấm, tìm lại bố mẹ ruột, thành tựu dành riêng */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function inJail(l) { return l.jailUntil != null && l.age < l.jailUntil; }
  function free(l) { return !inJail(l) && !(l.abroad && l.abroad.trapped); }
  function T(id, when, p, cd, max) { E.TRIG.push({ id: id, when: function (l, a) { return free(l) && when(l, a); }, p: p, cd: cd || 4, max: max || 1 }); }
  function O(l) { return l && l.fam && l.fam.orphan || null; }
  function raised(l) { var o = O(l); return o && !o.adopted ? o : null; }
  function stress(l, x) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + x, 0, 100); }
  var RICH = /^(us|gb|ca|au|nz|de|fr|nl|se|no|dk|fi|ie|be|at|ch)$/;
  var KIND = {
    ong_ba: { carer: 'ông bà', one: 'bà', label: 'ông bà nuôi nấng' },
    ho_hang: { carer: 'cô chú', one: 'cô', label: 'họ hàng cưu mang' },
    mai_am: { carer: 'các cô ở mái ấm', one: 'cô bảo mẫu', label: 'lớn lên ở mái ấm trẻ mồ côi' },
    chua: { carer: 'sư cô', one: 'sư cô', label: 'được nhà chùa nuôi dưỡng' }
  };
  function kindOf(l) { var o = O(l); return o ? KIND[o.kind] : null; }
  E.isOrphanBorn = function (l) { return !!raised(l); };
  // người nuôi dưỡng trẻ không còn bố mẹ (mồ côi từ khi chào đời, hoặc bố mẹ mất khi còn nhỏ)
  E.orphanCarer = function (l) {
    if (!l || !l.fam || l.age >= 18 || l.indep) return null;
    var o = raised(l); if (o) return o.carer;
    var f = l.fam; if (f.mAlive || (f.fAlive && !f.noDad)) return null;
    return l.flags && l.flags.orphanCarer || null;
  };

  function setup(l, h) {
    var f = l.fam, vn = isVN(l), rich = RICH.test(l.pool || '') || (l.gdp || 0) >= 30;
    var w = vn ? 'ong_ba:5,ho_hang:3,mai_am:2.5,chua:1' : rich ? 'ong_ba:3,ho_hang:3,mai_am:3' : 'ong_ba:5,ho_hang:3,mai_am:2.5';
    var kind = U.wkey(function () { return U.rand(h); }, w), K = KIND[kind];
    var o = { kind: kind, carer: K.carer, one: K.one, unknown: kind === 'chua' || (kind === 'mai_am' && U.rand(h) < 0.5) };
    if (kind === 'mai_am' && rich) { o.carer = 'gia đình nuôi dưỡng tạm thời'; o.one = 'mẹ nuôi tạm thời'; o.foster = true; }
    o.cause = o.unknown ? null : pick(function () { return U.rand(h); }, ['mất trong một vụ tai nạn giao thông', 'mất trong một trận lũ dữ', 'lần lượt qua đời vì bạo bệnh', 'mất trong một vụ cháy nhà', 'mất trong một vụ sập công trình']);
    o.carerAge = kind === 'ong_ba' ? 52 + Math.floor(U.rand(h) * 16) : 30 + Math.floor(U.rand(h) * 18);
    f.orphan = o;
    f.mAlive = false; f.fAlive = false; f.mInc = 0; f.fInc = 0; f.vice = null;
    if (o.unknown) { f.noDad = true; f.mName = 'Không rõ'; f.mJob = 'không rõ tung tích'; f.fJob = ''; f.sibs = 0; }
    else { f.noDad = false; f.mJob = 'đã mất'; f.fJob = 'đã mất'; }
    if (kind === 'mai_am' || kind === 'chua') { f.q = 1; f.home = kind === 'chua' ? 'nhà chùa' : (o.foster ? 'nhà nuôi dưỡng tạm thời' : 'mái ấm'); f.sibs = o.unknown ? 0 : f.sibs; }
    else { f.q = Math.max(1, f.q - 1); }
    l.sendParents = false; l.flags.famHardship = true; l.flags.orphanBorn = kind; l.flags.birthQ = f.q;
    var s = l.log[0] ? l.log[0].t : '';
    s = s.replace(/,? (thuộc|trong) (một trong những gia đình|một gia đình)[^.]*\./, '.').replace(/ Bạn có \d+ anh chị\.| Bạn là con đầu lòng\.| Mẹ một mình nuôi bạn\.| Bố bạn [^.]*\./g, '');
    var add = o.unknown
      ? (kind === 'chua' ? ' Một sáng sớm, sư cô quét sân thấy bạn nằm trong chiếc giỏ nhựa trước cổng chùa, quấn chiếc khăn mỏng, kèm mảnh giấy ghi ngày sinh. Không ai biết bố mẹ bạn là ai.'
        : ' Bạn được tìm thấy ở ' + pick(function () { return U.rand(h); }, ['cổng bệnh viện', 'trạm y tế', 'một bến xe']) + ' khi mới vài ngày tuổi, rồi được đưa vào ' + (o.foster ? 'một gia đình nuôi dưỡng tạm thời' : 'mái ấm trẻ mồ côi') + '. Không ai biết bố mẹ bạn là ai.')
      : ' Khi bạn còn đỏ hỏn, bố mẹ ' + o.cause + '. ' + (kind === 'ong_ba' ? 'Ông bà ' + (U.rand(h) < 0.5 ? 'nội' : 'ngoại') + ' đón bạn về nuôi.' : kind === 'ho_hang' ? 'Cô chú bên ' + (U.rand(h) < 0.5 ? 'nội' : 'ngoại') + ' cưu mang bạn, dù nhà cũng chẳng dư dả.' : 'Không còn người thân đủ sức nuôi, bạn được đưa vào ' + (o.foster ? 'một gia đình nuôi dưỡng tạm thời' : 'mái ấm trẻ mồ côi') + '.');
    if (l.log[0]) { l.log[0].t = s + add; l.log[0].k = 'big'; }
    H.mem(l, o.unknown ? 'Không ai biết bạn chào đời ở đâu, chỉ có mảnh giấy ghi ngày sinh.' : 'Bố mẹ ra đi khi bạn còn chưa kịp nhớ mặt.', 5, 0);
  }

  var createLife = E.createLife;
  E.createLife = function (opts) {
    var l = createLife.apply(this, arguments), PA = opts && opts.parent;
    if (PA || (opts && opts.noOrphan) || l.fam.elite || (l.flags && l.flags.royal)) return l;
    var h = { rs: (l.rs ^ 0x0a1f4a7) | 0 }, x = U.rand(h), p = [0, 0.04, 0.025, 0.014, 0.008, 0.004][l.fam.q] || 0.01;
    if (opts && opts.orphan) p = 1;
    if (x < p) setup(l, h);
    return l;
  };

  // bối cảnh xuất phát
  var bc = E.birthContext;
  if (bc) E.birthContext = function (l) {
    var o = raised(l), x = bc.apply(this, arguments);
    if (o && x && l.age < 18) x.text = U.cap(KIND[o.kind] && o.foster ? 'lớn lên trong gia đình nuôi dưỡng tạm thời' : KIND[o.kind].label) + ', ' + (o.unknown ? 'không rõ bố mẹ ruột là ai' : 'bố mẹ mất khi bạn còn đỏ hỏn') + '. Không có chỗ dựa tài chính, mọi thứ phải tự gây dựng';
    return x;
  };

  // người nuôi dưỡng già yếu, qua đời
  E.HOOKS.year.unshift(function (l, r, log, a) {
    var o = raised(l); if (!o || !l.alive || a < 1 || a > 17) return;
    if ((o.kind === 'ong_ba' || o.kind === 'ho_hang') && !o.carerGone) {
      var age = o.carerAge + a, q = age < 60 ? 0.004 : age < 70 ? 0.015 : age < 80 ? 0.045 : 0.12;
      if (r() < q) {
        o.carerGone = a;
        log(o.kind === 'ong_ba' ? 'Bà qua đời ở tuổi ' + age + '. Người đã thay bố mẹ nuôi bạn khôn lớn ra đi, bạn chuyển về ở với ' + (o.kind2 = pick(r, ['cô ruột', 'chú ruột', 'bác ruột'])) + '.' : 'Chú qua đời vì bạo bệnh. Cô một mình gồng gánh, bạn tự nhủ phải lớn thật nhanh.', 'bad');
        o.carer = o.kind === 'ong_ba' ? o.kind2 : 'cô'; o.one = 'cô';
        H.fx(l, { hap: -10 }); stress(l, 15); H.mem(l, 'Ngày người nuôi mình khôn lớn ra đi.', 6); if (l.fam.q > 1) l.fam.q--;
      }
    }
  });

  // tuổi thơ không có bố mẹ
  E.EVENTS.push({ c: function (l, a) { return !!raised(l) && a >= 4 && a <= 17; }, p: 0.3, cd: 3, run: function (l, a, r, log) {
    var o = raised(l), k = o.carerGone ? 'ho_hang' : o.kind, vn = isVN(l);
    var t = k === 'ong_ba' ? ['Bà còng lưng ra đồng từ tờ mờ sáng, tối về vẫn ngồi vá áo cho bạn dưới bóng đèn.', 'Ông chở bạn đi học bằng chiếc xe đạp cũ, đến dốc thì hai ông cháu cùng xuống dắt.', 'Hôm họp phụ huynh, bà là người lớn tuổi nhất trong lớp. Bạn vừa thương vừa thấy tủi.', 'Bà hay kể chuyện ngày xưa của bố mẹ bạn. Bạn nghe mãi không chán.']
      : k === 'ho_hang' ? ['Nhà cô chú đông con, bạn quen nhường phần ngon cho các em.', 'Bạn nghe lỏm được cô chú bàn chuyện tiền học của mình, đêm đó bạn trằn trọc mãi.', 'Chú ít nói nhưng hay dúi cho bạn ít tiền ăn sáng, dặn đừng nói với ai.', 'Bạn tự giặt quần áo, tự nấu cơm từ năm lên tám để đỡ đần cô chú.']
      : k === 'chua' ? ['Sáng nào bạn cũng dậy từ bốn giờ quét sân chùa cùng các chú tiểu.', 'Sư cô dạy bạn chữ và dạy cả cách sống tử tế. "Không có bố mẹ thì con càng phải thương người."', 'Rằm tháng Bảy, khách thập phương về chùa đông. Bạn lặng nhìn những đứa trẻ được bố mẹ dắt tay.', 'Bạn mặc lại quần áo cũ của các anh chị đi trước, đôi dép đứt quai được buộc lại bằng dây thép.']
      : o.foster ? ['Lại chuyển sang một gia đình nuôi dưỡng mới. Bạn quen với việc sống trong vali.', 'Cán bộ xã hội đến thăm định kỳ, hỏi bạn có ổn không. Bạn gật đầu, như mọi lần.', 'Gia đình nuôi dưỡng tạm thời đối xử tốt, nhưng bạn biết mình chỉ là khách.']
      : ['Bữa cơm ở mái ấm có hai mươi đứa trẻ ngồi chung một mâm dài. Đứa lớn gắp cho đứa bé.', 'Các cô ở mái ấm thay nhau thức đêm khi bạn sốt cao.', vn ? 'Trung thu, một đoàn từ thiện đến phát bánh, ai cũng chụp ảnh với bọn trẻ rồi về.' : 'Một nhóm tình nguyện đến tổ chức tiệc sinh nhật chung cho cả mái ấm.', 'Ngày Tết, mái ấm vắng hẳn vì có đứa được họ hàng đón về. Bạn ở lại cùng các cô.', 'Bạn có một người anh em cùng mái ấm, hai đứa hứa sau này lớn lên sẽ đỡ đần nhau.'];
    if (!l.school) t = t.filter(function (s) { return !/phụ huynh|đi học/.test(s); }); if (!t.length) return;
    log(pick(r, t), 'neutral');
    if (ch(r, 0.5)) H.fx(l, { hap: -1 }); else H.fx(l, { soc: 1, karma: 1 });
  } });
  E.EVENTS.push({ c: function (l, a) { return !!raised(l) && a >= 7 && a <= 15; }, p: 0.08, cd: 5, run: function (l, a, r, log) {
    log(pick(r, ['Bài văn "Tả mẹ của em", bạn ngồi nhìn trang giấy trắng rất lâu rồi viết về ' + raised(l).one + '.', 'Có đứa bạn trêu bạn là "đứa không có bố mẹ". Bạn không khóc, chỉ siết chặt tay.', 'Ngày 8/3, cả lớp làm thiệp tặng mẹ. Bạn làm một tấm và tặng ' + raised(l).one + '.']), 'neutral');
    H.fx(l, { hap: -2 }); stress(l, 4);
  } });

  // con nuôi
  SC('mc_nhan_nuoi', {
    title: 'Có người muốn nhận bạn làm con nuôi',
    prep: function (l, r) { return { m: H.name(l, r, 'F').full, f: H.name(l, r, 'M').full, q: U.wkey(r, '2:2,3:4,4:3,5:1') | 0 }; },
    valid: function (l) { var o = raised(l); return !!o && (o.kind === 'mai_am' || o.kind === 'chua') && l.age >= 1 && l.age <= 9; },
    text: function (l, d) { return 'Một cặp vợ chồng hiếm muộn đến ' + (raised(l).kind === 'chua' ? 'chùa' : 'mái ấm') + ' nhiều lần, ngồi chơi với bạn cả buổi. Họ làm thủ tục xin nhận bạn làm con nuôi.'; },
    opts: [
      { k: 'theo', l: 'Về nhà mới', ai: { w: 3 }, run: function (l, r, log, d) {
        var f = l.fam, o = f.orphan, vn = isVN(l);
        o.adopted = l.age; f.mAlive = true; f.fAlive = true; f.noDad = false; f.mName = d.m; f.fName = d.f; f.q = U.clamp(d.q, 2, 5);
        var J = vn ? ['giáo viên', 'nhân viên văn phòng', 'kinh doanh nhỏ', 'công chức', 'kỹ sư', 'bác sĩ', 'công nhân'] : ['giáo viên', 'nhân viên văn phòng', 'kỹ sư', 'y tá', 'chủ cửa hàng'];
        f.mJob = pick(r, J); f.fJob = pick(r, J); f.mInc = E.parentMonthly(l, f.mJob, r) * (0.6 + f.q * 0.2); f.fInc = E.parentMonthly(l, f.fJob, r) * (0.6 + f.q * 0.2); f.mInc0 = f.mInc; f.fInc0 = f.fInc;
        f.mAge = U.clamp(Math.round(33 + r() * 10) - l.age, 20, 50); f.fAge = f.mAge + 2; f.sibs = 0; f.home = 'nhà riêng';
        l.sendParents = vn || f.q <= 3; l.flags.famHardship = f.q <= 1;
        log('Thủ tục nhận con nuôi hoàn tất. Bạn có bố mẹ: ' + d.f + ' và ' + d.m + '. Đêm đầu tiên ở nhà mới, mẹ ngồi bên giường đến khi bạn ngủ.', 'big');
        H.fx(l, { hap: 10 }); stress(l, -10); H.mem(l, 'Ngày có bố mẹ, có một ngôi nhà để về.', 7);
      } },
      { k: 'o_lai', l: 'Khóc, níu áo các cô không chịu đi', ai: { w: 0.4 }, run: function (l, r, log) { log('Bạn khóc cả buổi, níu áo ' + raised(l).one + ' không buông. Cặp vợ chồng thương mà đành ra về.', 'neutral'); H.fx(l, { hap: -2 }); } }
    ]
  });
  T('mc_nhan_nuoi', function (l, a) { var o = raised(l); return !!o && (o.kind === 'mai_am' || o.kind === 'chua') && a >= 1 && a <= 9 && !(l.abroad); }, 0.12, 2, 1);

  // học bổng
  SC('mc_hoc_bong', {
    title: 'Học bổng cho học sinh mồ côi',
    text: function (l) { return (isVN(l) ? 'Một quỹ khuyến học' : 'Một tổ chức từ thiện') + ' trao học bổng cho học sinh mồ côi vượt khó. Thầy chủ nhiệm muốn giới thiệu bạn, nhưng phải viết bài kể về hoàn cảnh của mình.'; },
    valid: function (l) { return !!raised(l) && !!l.school; },
    opts: [
      { k: 'viet', l: 'Viết thật lòng về hoàn cảnh của mình', ai: { w: 2 }, run: function (l, r, log) { var v = l.base * (0.05 + r() * 0.06); H.cash(l, v, 'Học bổng cho học sinh mồ côi'); l.flags.orphanScholar = true; log('Bạn viết về ' + raised(l).one + ', về những bữa cơm đạm bạc. Bạn nhận học bổng ' + H.money(l, v) + ', đủ mua sách vở và một đôi giày mới.', 'good'); H.fx(l, { hap: 4, kno: 1 }); } },
      { k: 'thoi', l: 'Từ chối, không muốn ai thương hại', ai: { w: 0.5, risk: 1 }, run: function (l, r, log) { log('Bạn từ chối. "Em tự lo được." Thầy chủ nhiệm nhìn bạn rất lâu.', 'neutral'); H.fx(l, { hap: -1 }); } }
    ]
  });
  T('mc_hoc_bong', function (l, a) { return !!raised(l) && !!l.school && a >= 10 && a <= 17; }, 0.25, 3, 1);

  // rời mái ấm
  E.HOOKS.year.unshift(function (l, r, log, a) {
    var o = raised(l); if (!o || a !== 18 || o.left || !l.alive) return;
    o.left = a;
    if (o.kind === 'mai_am' || o.kind === 'chua') {
      var gift = l.base * 0.03; H.cash(l, gift, o.kind === 'chua' ? 'Sư cô cho làm vốn' : 'Mái ấm hỗ trợ khi ra đời');
      log((o.kind === 'chua' ? 'Mười tám tuổi, bạn chào sư cô rời chùa. Sư cô dúi vào tay bạn ' : o.foster ? 'Mười tám tuổi, bạn hết tuổi được nuôi dưỡng tạm thời. Cán bộ xã hội trao cho bạn ' : 'Mười tám tuổi, bạn rời mái ấm với một chiếc ba lô và ') + H.money(l, gift) + '. Từ nay không còn ai lo cơm áo cho bạn nữa.', 'big');
      H.mem(l, o.kind === 'chua' ? 'Ngày rời cổng chùa, quay lại vẫn thấy sư cô đứng nhìn theo.' : 'Ngày rời mái ấm với chiếc ba lô cũ.', 5);
    } else log('Mười tám tuổi. ' + U.cap(o.carer) + ' đã làm hết sức mình. Từ đây bạn phải tự lo lấy thân.', 'neutral');
  });

  // tìm lại bố mẹ ruột
  SC('mc_tim_bo_me', {
    title: 'Tìm lại bố mẹ ruột',
    text: 'Mảnh giấy ghi ngày sinh bạn vẫn giữ trong ví. Một chương trình truyền hình tìm người thân đang nhận hồ sơ, có hỗ trợ xét nghiệm ADN miễn phí.',
    valid: function (l) { var o = O(l); return !!o && o.unknown && !o.searched; },
    opts: [
      { k: 'tim', l: 'Gửi hồ sơ tìm người thân', ai: { w: 1.2 }, run: function (l, r, log) {
        var o = O(l); o.searched = l.age;
        if (ch(r, 0.3)) { o.found = l.age; log(pick(r, ['Ba tháng sau, chương trình báo tin: mẫu ADN trùng khớp. Mẹ ruột của bạn ở một tỉnh khác, năm ấy mới mười bảy tuổi, bị gia đình ép bỏ con. Hai mẹ con ôm nhau khóc nghẹn trên sân khấu.', 'Có người nhận ra vết bớt trên vai bạn. Bố mẹ ruột tìm đến, giờ đã có gia đình riêng. Cuộc gặp lúng túng, nhưng bạn cuối cùng cũng biết mình từ đâu đến.']), 'big'); H.fx(l, { hap: 8 }); H.mem(l, 'Ngày tìm lại được người sinh ra mình.', 8); }
        else { log('Hồ sơ đăng lên, có vài cuộc gọi nhưng xét nghiệm đều không khớp. Bạn cất mảnh giấy vào ví, như cũ.', 'neutral'); H.fx(l, { hap: -3 }); }
      } },
      { k: 'thoi', l: 'Thôi, người nuôi mình mới là gia đình', ai: { w: 1 }, run: function (l, r, log) { O(l).searched = l.age; log('Bạn quyết định không tìm nữa. Người đã nuôi bạn khôn lớn mới là gia đình.', 'neutral'); H.fx(l, { hap: 1 }); } }
    ]
  });
  T('mc_tim_bo_me', function (l, a) { var o = O(l); return !!o && o.unknown && !o.searched && a >= 20 && a <= 45; }, 0.15, 5, 1);

  // người lớn lên không có bố mẹ: giỗ bố mẹ, ngày cưới không có người đưa dâu
  E.EVENTS.push({ c: function (l, a) { var o = O(l); return !!o && !o.adopted && !o.unknown && a >= 18 && isVN(l) && !l.abroad; }, p: 0.05, cd: 8, run: function (l, a, r, log) {
    log(pick(r, ['Ngày giỗ bố mẹ, bạn thắp hương trước tấm ảnh duy nhất còn giữ được. Bạn đã lớn hơn tuổi bố mẹ lúc ấy.', 'Bạn về thăm ' + (O(l).kind === 'ong_ba' ? 'mộ ông bà và bố mẹ' : 'cô chú') + ', mang theo ít quà. Cô bảo: "Bố mẹ con mà thấy con bây giờ thì mừng lắm."']), 'neutral');
  } });
  E.EVENTS.push({ c: function (l, a) { var o = O(l); return !!o && !o.adopted && (o.kind === 'mai_am' || o.kind === 'chua') && a >= 25 && l.money > l.base * 2; }, p: 0.06, cd: 10, run: function (l, a, r, log) {
    var v = l.base * 0.04; H.cash(l, -v, O(l).kind === 'chua' ? 'Công đức nhà chùa nơi mình lớn lên' : 'Ủng hộ mái ấm nơi mình lớn lên');
    log(O(l).kind === 'chua' ? 'Bạn về chùa thăm sư cô, công đức ' + H.money(l, v) + '. Sân chùa vẫn y như ngày bạn quét lá.' : 'Bạn quay về mái ấm cũ, mang theo quà và ' + H.money(l, v) + ' cho các em. Lũ trẻ nhìn bạn như ngày xưa bạn nhìn các anh chị.', 'good');
    H.fx(l, { hap: 4, karma: 3 }); l.flags.orphanGaveBack = true;
  } });

  if (E.addAchievements) E.addAchievements([
    ['tay_trang', '🌱', 'Tay trắng dựng nghiệp', 'Xuất thân mồ côi, cuối đời có tài sản từ 30 lần thu nhập cơ sở', function (l) { return !!O(l) && !O(l).adopted && E.netWorth && E.netWorth(l) >= l.base * 30; }],
    ['co_nha', '🏡', 'Có một mái nhà', 'Lớn lên ở mái ấm hoặc nhà chùa, được một gia đình nhận làm con nuôi', function (l) { var o = O(l); return !!o && o.adopted != null; }],
    ['nguon_coi', '🧬', 'Tìm về nguồn cội', 'Tìm lại được bố mẹ ruột', function (l) { var o = O(l); return !!o && o.found != null; }],
    ['uong_nuoc', '🙏', 'Uống nước nhớ nguồn', 'Quay về giúp đỡ mái ấm / ngôi chùa nơi mình lớn lên', function (l) { return !!l.flags.orphanGaveBack; }]
  ]);
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
