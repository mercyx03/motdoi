/* Một Đời — v3.2:
   · nhà ở chia theo loại (nhà cấp 4, chung cư mini, chung cư cũ, chung cư thương mại, nhà phố, chung cư cao cấp, biệt thự, dinh thự), giá theo nơi ở
   · bệnh viện công (xếp hàng lấy số từ sáng sớm, nằm ghép, chờ lấy thuốc) và bệnh viện tư; phẫu thuật; răng khôn mọc lệch
   · nghề diễn viên: casting, cát-xê web drama / phim truyền hình / điện ảnh, doanh thu phòng vé, hợp đồng quảng cáo, học diễn xuất, game show
   · nhắn tin tán tỉnh (bị ghost, mập mờ), chênh lệch tuổi trong tình yêu, biệt danh hội bạn đặt
   · thi lại chứng chỉ ngoại ngữ trong "Việc bạn muốn làm" · tiền mã hóa theo tỉ lệ thực tế hơn */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function T(id, when, p, cd, max) { E.TRIG.push({ id: id, when: when, p: p, cd: cd || 0, max: max }); }
  function A(id, g, label, o) { var x = { id: id, g: g, l: label }; for (var k in o) x[k] = o[k]; E.ACT.push(x); }
  function EV(c, p, run) { E.EVENTS.push({ c: c, p: p, run: run }); }
  function fx(l, o) { H.fx(l, o); }
  function mo(l, v) { return H.money(l, v); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped); }
  function vnd(l) { return isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  function V(l, tr) { return vnd(l) ? tr : tr / 90 * l.base; }
  function rng(r, a, b) { return a + (b - a) * r(); }
  function jobC(l) { return l.job ? E.jobDef(l) : null; }
  function rich(l) { return l.money > l.base * 8 || (!l.indep && l.fam.q >= 5); }

  // ===================================================================
  // 1. NHÀ Ở THEO LOẠI
  // ===================================================================
  // giá tham khảo (triệu đồng, làm tròn): big = Hà Nội / TP.HCM · urb = thành phố, thị xã tỉnh · rur = nông thôn
  var HT = [
    { k: 'cap4', n: 'nhà cấp 4', t: 1, p: { big: 2600, urb: 1200, rur: 450 }, d: 'nhà một tầng mái ngói / mái tôn, có sân nhỏ' },
    { k: 'mini', n: 'căn hộ chung cư mini', t: 1, p: { big: 1300, urb: 750 }, d: '35–45 m², trong hẻm, pháp lý thường không chắc' },
    { k: 'cu', n: 'căn hộ chung cư cũ (khu tập thể)', t: 1, p: { big: 2000, urb: 900 }, d: 'rộng nhưng xuống cấp, ít khi có thang máy' },
    { k: 'cc', n: 'căn hộ chung cư thương mại 2 phòng ngủ', t: 2, p: { big: 3800, urb: 1900 }, d: 'thang máy, bảo vệ, khu vui chơi cho trẻ' },
    { k: 'lau', n: 'nhà phố 3–4 tầng', t: 2, p: { big: 8000, urb: 3200, rur: 1600 }, d: 'nhà lầu mặt ngõ / mặt đường, vừa ở vừa kinh doanh được' },
    { k: 'ccc', n: 'căn hộ chung cư cao cấp', t: 3, p: { big: 9000, urb: 4000 }, d: 'hồ bơi, phòng gym, view đẹp, phí quản lý cao' },
    { k: 'bt', n: 'biệt thự có sân vườn', t: 4, p: { big: 30000, urb: 12000, rur: 6000 }, d: 'sân vườn rộng, gara ô tô' },
    { k: 'dt', n: 'dinh thự', t: 5, p: { big: 100000, urb: 45000, rur: 20000 }, d: 'hàng nghìn m², có người giúp việc, bảo vệ riêng' }
  ];
  // v3.6: sống ở nước ngoài (định cư, hoặc sinh ra ở nước khác) thì mua nhà theo kiểu và giá của nước đó — giá tính theo số năm thu nhập trung bình ở đó
  var HTW = [
    { k: 'w_studio', n: 'căn hộ studio', t: 1, m: { big: 7, urb: 4.5, rur: 3 }, d: 'một phòng, gọn cho người độc thân' },
    { k: 'w_apt', n: 'căn hộ 2 phòng ngủ', t: 2, m: { big: 11, urb: 7, rur: 4.5 }, d: 'chung cư có thang máy, gần phương tiện công cộng' },
    { k: 'w_town', n: 'nhà liền kề (townhouse)', t: 2, m: { big: 14, urb: 9, rur: 6 }, d: '2 tầng, có sân sau nhỏ, gara một xe' },
    { k: 'w_house', n: 'nhà riêng có sân vườn ở ngoại ô', t: 3, m: { big: 20, urb: 12, rur: 8 }, d: '3–4 phòng ngủ, gara, sân vườn rộng' },
    { k: 'w_villa', n: 'biệt thự', t: 4, m: { big: 50, urb: 30, rur: 18 }, d: 'khu nhà giàu, hồ bơi riêng' },
    { k: 'w_mansion', n: 'dinh thự', t: 5, m: { big: 150, urb: 90, rur: 55 }, d: 'hàng nghìn m², nhân viên phục vụ riêng' }
  ];
  function abroadRes(l) { return !vnd(l); }
  function resCity(l) { var W = G.W, c = W && W.BY[l.abroad && l.abroad.perm ? l.abroad.code : l.country]; return { place: l.place || l.city || (c && c.cities[0]) || 'thành phố', big: !!(c && (l.place || l.city) && c.cities.slice(0, 2).indexOf(l.place || l.city) >= 0) }; }
  function cls(l) { if (abroadRes(l)) { var rc = resCity(l); return rc.big ? 'big' : l.urban ? 'urb' : 'rur'; } return H.inBigCity(l) ? 'big' : (l.urban || l.movedTo) ? 'urb' : 'rur'; }
  function hPrice(l, h, r) {
    var c = cls(l);
    if (h.m) { var g = (G.W && G.W.BY[l.abroad && l.abroad.perm ? l.abroad.code : l.country] || {}).gdp || l.gdp || 20; return h.m[c] * g * 1000 * 0.55 * (l.urban ? 1.1 : 0.8) * (g < 8 ? 1.6 : g < 20 ? 1.25 : 1) * (r ? rng(r, 0.9, 1.15) : 1); } // nước thu nhập thấp: giá nhà / thu nhập cao hơn
    var p = h.p[c] != null ? h.p[c] : h.p.urb;
    if (!vnd(l)) return p / 90 * l.base * 0.35 * (r ? rng(r, 0.9, 1.15) : 1);
    return Math.round(p * (c !== 'big' && l.cityWealth ? Math.min(1.3, Math.max(0.7, l.cityWealth)) : 1) * (r ? rng(r, 0.88, 1.18) : 1));
  }
  function avail(l) { if (abroadRes(l)) return HTW; var c = cls(l); return HT.filter(function (h) { return h.p[c] != null; }); }
  function homeDebt(l) { return (l.loans || []).filter(function (x) { return x.type === 'home'; }).reduce(function (s, x) { return s + x.bal; }, 0) + (l.mortgage || 0); }
  function have(l) { return Math.max(0, l.money) + (l.ownHouse ? Math.max(0, (l.houseVal || 0) - homeDebt(l)) : 0); }
  function canLoan(l, price) { return l.indep && H.canBankLoan(l) && H.loanAgeOk(l, 'home') && (l.income || 0) > 0 && price * 0.7 <= Math.max(l.income || 0, l.base * 0.5) * 9; }
  E.homeMin = function (l) { return Math.min.apply(null, avail(l).map(function (h) { return hPrice(l, h); })); };
  E.HOME_TYPES = HT; E.HOME_TYPES_W = HTW;
  function buyHome(l, h, price, loan, log) {
    if (l.ownHouse) {
      var sold = l.houseVal || 0, debt = homeDebt(l);
      H.cash(l, sold, 'Bán ' + (l.houseName || 'nhà cũ'));
      (l.loans || []).forEach(function (x) { if (x.type === 'home') { H.cash(l, -x.bal, 'Tất toán khoản vay mua nhà cũ'); x.bal = 0; } });
      l.loans = (l.loans || []).filter(function (x) { return x.bal > 0.5; }); if (l.mortgage) { H.cash(l, -l.mortgage, 'Tất toán khoản vay mua nhà cũ'); l.mortgage = 0; }
      log('Bán ' + (l.houseName || 'căn nhà cũ') + ' được ' + mo(l, sold) + (debt > 0.5 ? ', trả hết ' + mo(l, debt) + ' nợ ngân hàng' : '') + '.', 'neutral');
    }
    H.cash(l, -price, 'Mua ' + h.n);
    if (loan) H.addLoan(l, 'home', price * 0.7);
    var first = !l.flags.ownedHome;
    l.ownHouse = true; l.houseVal = price; l.houseTier = h.t; l.houseName = h.n; l.houseK = h.k; l.flags.ownedHome = true;
    log('Mua ' + h.n + ' giá ' + mo(l, price) + (loan ? ' (trả trước 30%, vay ngân hàng 70%, trả góp nhiều năm)' : ' bằng tiền tích lũy') + '.', h.t >= 4 ? 'big' : 'big');
    fx(l, { hap: 6 + h.t * 2 });
    H.mem(l, first ? 'Ngày nhận chìa khóa ' + h.n + ' — căn nhà đầu tiên của chính mình.' : 'Ngày chuyển về ' + h.n + '.', first ? 5 : 3);
  }
  function okH(l, d, h) { var p = d.pr[h.k]; if (p == null) return false; if (d.up && !(h.t > (l.houseTier || 1) || (h.t === (l.houseTier || 1) && p > (l.houseVal || 0) * 1.3 && h.k !== l.houseK))) return false; return have(l) >= p || (have(l) >= p * 0.3 && canLoan(l, p)); }
  function homeDef(up) {
    return {
      title: up ? 'Đổi nhà' : 'Mua nhà', major: up ? 0 : 1,
      prep: function (l, r) { var pr = {}; avail(l).forEach(function (h) { pr[h.k] = hPrice(l, h, r); }); return { pr: pr, up: up }; },
      valid: function (l) { return up ? !!l.ownHouse && l.indep : !l.ownHouse; },
      text: function (l, d) {
        return (l.ownHouse ? 'Bạn đang ở ' + (l.houseName || 'nhà riêng') + ' trị giá khoảng ' + mo(l, l.houseVal) + (homeDebt(l) > 0.5 ? ' (còn nợ ngân hàng ' + mo(l, homeDebt(l)) + ')' : '') + '. ' : '') +
          'Tiền mặt hiện có ' + mo(l, Math.max(0, l.money)) + '. Giá nhà ' + (abroadRes(l) ? 'ở ' + resCity(l).place + (l.abroad && l.abroad.perm ? ', ' + l.abroad.name : '') : cls(l) === 'big' ? 'ở ' + (/Hà Nội/.test(l.movedTo || (l.prov && l.prov.old) || '') ? 'Hà Nội' : 'TP. Hồ Chí Minh') : cls(l) === 'urb' ? 'ở thành phố tỉnh' : 'ở quê') + ' tham khảo (từ rẻ đến đắt):' +
          (avail(l).some(function (h) { return okH(l, d, h); }) ? '' : ' ' + HT.filter(function (h) { return d.pr[h.k] != null; }).slice(0, 5).map(function (h) { return h.n + ' ~' + mo(l, d.pr[h.k]); }).join('; ') + '. Hiện chưa đủ tiền trả trước 30% (hoặc chưa vay được ngân hàng) cho loại nào — hãy tích lũy thêm.');
      },
      opts: HT.concat(HTW).map(function (h) {
        return {
          k: 'n_' + h.k,
          l: function (l, d) { return U.cap(h.n) + ' — ' + mo(l, d.pr[h.k]); },
          h: function (l, d) { var p = d.pr[h.k]; return h.d + ' · ' + (have(l) >= p ? 'trả thẳng được' : 'trả trước ' + mo(l, p * 0.3) + ', vay ngân hàng ' + mo(l, p * 0.7) + ' (trả góp ~' + mo(l, p * 0.7 * 0.12) + '/năm)'); },
          req: function (l, d) { return okH(l, d, h); },
          ai: function (l, d) { var p = d.pr[h.k]; return have(l) >= p ? 1 + h.t * 0.4 : 0.5; },
          run: function (l, r, log, d) { var p = d.pr[h.k], loan = have(l) < p; if (loan && !canLoan(l, p)) { log('Ngân hàng từ chối cho vay mua ' + h.n + ': ' + (H.canBankLoan(l) ? 'thu nhập không đủ.' : 'hồ sơ đang có nợ xấu.'), 'bad'); fx(l, { hap: -4 }); l.flags.houseNo = l.age + 3; return; } buyHome(l, h, p, loan, log); }
        };
      }).concat([{ k: 'no', l: up ? 'Ở nhà cũ cho quen' : 'Tiếp tục thuê / ở cùng gia đình', ai: { w: 1 }, run: function (l) { if (!up) { l.flags.houseNoN = (l.flags.houseNoN || 0) + 1; l.flags.houseNo = l.age + 5 + Math.min(10, l.flags.houseNoN * 3); } } }])
    };
  }
  SC('house', homeDef(false));
  SC('doi_nha', homeDef(true));
  E.ACT.forEach(function (a) {
    if (a.id === 'doi_nha') { a.l = function (l) { return abroadRes(l) ? 'Đổi nhà (nhà rộng hơn, biệt thự…)' : 'Đổi nhà (nhà phố, chung cư cao cấp, biệt thự…)'; }; a.avail = function (l) { return !l.ownHouse ? 'Chưa có nhà riêng' : (l.houseTier || 1) >= 5 ? 'Đã ở dinh thự' : true; }; }
    if (a.id === 'mua_nha') a.l = function (l) { return abroadRes(l) ? 'Mua nhà (căn hộ, nhà riêng…)' : 'Mua nhà (nhà cấp 4, chung cư, nhà phố…)'; };
  });

  // ===================================================================
  // 2. BỆNH VIỆN CÔNG / TƯ, PHẪU THUẬT, RĂNG KHÔN
  // ===================================================================
  var BIG_ILL = /ung thư|mạch vành|dạ dày|đại trực tràng|vú|phổi|suy thận/;
  var tm0 = E.DEC.treat.make;
  E.DEC.treat.make = function (l, r) {
    var d = tm0.apply(this, arguments), pv = rich(l) && l.gdp >= 3;
    d.data.priv = pv;
    d.opts.forEach(function (o) {
      if (o.k === 'best') { o.l = pv ? 'Điều trị ở bệnh viện tư / khoa quốc tế' : 'Lên bệnh viện tuyến trên (bệnh viện công lớn)'; o.h = (pv ? 'Phòng riêng, khám ngay, không phải chờ' : 'Bác sĩ giỏi nhưng quá tải: xếp hàng lấy số, nằm ghép giường') + ' · khoảng ' + mo(l, d.data.cost * (pv ? 1.8 : 1)) + (l.money < d.data.cost * (pv ? 1.8 : 1) ? ' — phải vay mượn' : ''); }
      if (o.k === 'basic') { o.l = 'Điều trị ở bệnh viện huyện / tỉnh gần nhà'; o.h = 'Rẻ hơn (~' + mo(l, d.data.cost * 0.25) + '), ít thiết bị, hiệu quả thấp hơn'; }
    });
    return d;
  };
  var ta0 = E.DEC.treat.apply;
  E.DEC.treat.apply = function (l, d, k, r, log) {
    var x = ta0.apply(this, arguments), ill = l.ill;
    if (k === 'best' && d.data.priv) { H.cash(l, -d.data.cost * 0.8, 'Phụ phí bệnh viện tư'); log(pick(r, ['Vào bệnh viện tư: phòng riêng, bác sĩ khám ngay trong ngày, không phải xếp hàng chờ đợi.', 'Chữa ở bệnh viện tư: đặt lịch qua điện thoại, đến là có bác sĩ khám, y tá chăm sóc tận tình.', 'Nằm phòng dịch vụ ở bệnh viện tư, người nhà được ở cùng, thuốc men đầy đủ — đắt nhưng yên tâm.']), 'neutral'); }
    else if (k === 'best') log(pick(r, ['Bệnh viện tuyến trên quá tải: 4 giờ sáng đã phải dậy xếp hàng lấy số, chờ khám đến chiều, nằm ghép giường với hai người lạ.', 'Mỗi lần tái khám lại dậy từ tờ mờ sáng bắt xe lên viện, xếp hàng lấy số, chờ kết quả xét nghiệm, rồi đứng đợi lấy thuốc cả tiếng.']), 'neutral');
    else if (k === 'basic') log('Bệnh viện gần nhà đông bệnh nhân, ít máy móc; nhiều xét nghiệm phải chuyển lên tuyến trên.', 'neutral');
    if (ill && k !== 'none' && BIG_ILL.test(ill.n) && ch(r, 0.6)) H.chain(l, 'phau_thuat', { why: 'mổ ' + ill.n, ill: true });
    return x;
  };
  SC('phau_thuat', {
    title: 'Phải phẫu thuật', major: 1,
    prep: function (l, r, arg) { return arg && arg.why ? arg : { why: 'mổ cấp cứu' }; },
    text: function (l, d) { return 'Bác sĩ chỉ định ' + d.why + '. Bạn chọn mổ ở đâu?' + (E.hasBHYT && E.hasBHYT(l) ? ' (Bạn có bảo hiểm y tế.)' : ' (Bạn không có bảo hiểm y tế.)'); },
    opts: [
      { k: 'cong', l: 'Bệnh viện công, theo bảo hiểm', h: function (l) { return 'Chờ lịch mổ vài tuần, nằm phòng đông · viện phí ~' + mo(l, V(l, 18)) + (E.medNote ? E.medNote(l, V(l, 18), 1) : ''); }, ai: function (l) { return rich(l) ? 0.3 : 1.5; }, run: function (l, r, log, d) { op(l, r, log, d, V(l, 18), 0.08, 1, 'Chờ ba tuần mới đến lịch mổ, sau mổ nằm phòng tám giường, người nhà trải chiếu ngủ dưới gầm giường.'); } },
      { k: 'dichvu', l: 'Mổ dịch vụ ở bệnh viện công, tự chọn bác sĩ', h: function (l) { return 'Mổ sớm hơn, phòng ít người · ~' + mo(l, V(l, 45)) + (E.medNote ? E.medNote(l, V(l, 45), 0.5) : ''); }, ai: { w: 1 }, run: function (l, r, log, d) { op(l, r, log, d, V(l, 45), 0.05, 0.5, 'Mổ dịch vụ, được chọn bác sĩ giỏi, nằm phòng hai giường.'); } },
      { k: 'tu', l: 'Bệnh viện tư / quốc tế', h: function (l) { return 'Mổ ngay, phòng riêng, chăm sóc chu đáo · ~' + mo(l, V(l, 140)); }, req: function (l) { return l.money > V(l, 140) * 0.5; }, ai: function (l) { return rich(l) ? 2 : 0.2; }, run: function (l, r, log, d) { op(l, r, log, d, V(l, 140), 0.04, 0, 'Mổ ở bệnh viện tư: phòng riêng như khách sạn, y tá túc trực cả ngày.'); } }
    ]
  });
  function op(l, r, log, d, cost, risk, cover, txt) {
    if (E.medBill) E.medBill(l, cost, 'Phẫu thuật: ' + d.why, log, cover); else H.cash(l, -cost, 'Phẫu thuật: ' + d.why);
    if (ch(r, risk)) { log(txt + ' Sau mổ bị biến chứng, phải nằm viện thêm một tháng.', 'bad'); fx(l, { hea: -8, hap: -6 }); if (E.medBill) E.medBill(l, cost * 0.3, 'Điều trị biến chứng sau mổ', log, cover); else H.cash(l, -cost * 0.3, 'Điều trị biến chứng sau mổ'); }
    else { log(txt + ' Ca mổ thành công.', 'good'); fx(l, { hea: d.ill ? 3 : 6, hap: 2 }); }
    if (d.ill && l.ill) { l.ill.cure = Math.min(0.95, l.ill.cure * 1.35); l.ill.mult = Math.max(1, l.ill.mult * 0.85); }
    H.mem(l, 'Lần nằm trên bàn mổ — ' + d.why + '.', 3);
  }
  EV(function (l, a) { return a >= 16 && a <= 75 && (l.veh === 'xe máy' || l.veh === 'ô tô') && free(l); }, 0.005, function (l, a, r, log) { log('Bị tai nạn giao thông, gãy xương phải mổ.', 'bad'); fx(l, { hea: -10, hap: -4 }); H.sched(l, 'phau_thuat', 0, { why: 'mổ kết hợp xương sau tai nạn giao thông' }); });
  SC('rang_khon', {
    title: 'Răng khôn mọc lệch', prep: function (l, r, arg) { return { worse: !!(arg && arg.worse) }; },
    text: function (l, d) { return (d.worse ? 'Chiếc răng khôn để lâu giờ sưng tấy, há miệng không nổi, ăn gì cũng đau.' : 'Chiếc răng khôn mọc lệch đâm vào răng bên cạnh, cứ vài tuần lại sưng đau.') + ' Nha sĩ bảo nên nhổ.'; },
    opts: [
      { k: 'public', l: 'Nhổ ở khoa răng hàm mặt bệnh viện công', h: function (l) { return 'Xếp hàng lấy số từ sáng sớm · ~' + mo(l, V(l, 1.5)) + (E.medNote ? E.medNote(l, V(l, 1.5), 1) : ''); }, ai: function (l) { return rich(l) ? 0.3 : 1.4; }, run: function (l, r, log) { if (E.medBill) E.medBill(l, V(l, 1.5), 'Nhổ răng khôn', log, 1); else H.cash(l, -V(l, 1.5), 'Nhổ răng khôn'); l.flags.wisdom = true; log('Dậy từ 5 giờ sáng xếp hàng lấy số, chờ cả buổi mới đến lượt nhổ răng khôn. Má sưng như quả bóng mất ba ngày.', 'neutral'); fx(l, { hea: 1, hap: -1 }); } },
      { k: 'private', l: 'Nhổ ở nha khoa tư (máy siêu âm, ít đau)', h: function (l) { return 'Hẹn giờ, không phải chờ · ~' + mo(l, V(l, 4)); }, ai: function (l) { return rich(l) ? 2 : 0.6; }, run: function (l, r, log) { if (E.medBill) E.medBill(l, V(l, 4), 'Nhổ răng khôn ở nha khoa tư', log, 0); else H.cash(l, -V(l, 4), 'Nhổ răng khôn ở nha khoa tư'); l.flags.wisdom = true; log('Nhổ răng khôn ở nha khoa tư, hẹn đúng giờ, làm nhanh, về nhà vẫn ăn cháo được.', 'good'); } },
      { k: 'wait', l: 'Uống thuốc giảm đau, để đó tính sau', ai: { w: 0.5 }, run: function (l, r, log, d) { log('Uống thuốc giảm đau cho qua.', 'neutral'); fx(l, { hap: -2 }); if (!d.worse) H.sched(l, 'rang_khon', 2, { worse: true }); } }
    ]
  });
  T('rang_khon', function (l, a) { return a >= 17 && a <= 30 && !l.flags.wisdom && free(l); }, 0.07, 4, 1);
  if (E.DEC.kham) {
    E.DEC.kham.def.text = function (l) { return 'Lâu rồi bạn chưa khám sức khỏe. Bệnh viện công thì rẻ nhưng đông, bệnh viện tư thì nhanh mà đắt.'; };
    var go0 = E.DEC.kham.def.opts.filter(function (o) { return o.k === 'go'; })[0];
    var runGo = function (l, r, log, cost, txt, cover) { var m0 = l.money, it = l.yr.items, n0 = it.length; go0.run(l, r, function () { }); l.money = m0; it.splice(n0, it.length - n0); if (E.medBill) E.medBill(l, cost, 'Khám sức khỏe', log, cover); else H.cash(l, -cost, 'Khám sức khỏe tổng quát'); log(txt + (l.ill && l.ill.treated ? '' : ''), 'neutral'); if (l.ill && !l.ill.treated) log('Đi khám phát hiện sớm ' + l.ill.n + ', điều trị kịp thời.', 'good'); };
    E.DEC.kham.def.opts = [
      { k: 'go', l: 'Khám ở bệnh viện công', h: function (l) { return 'Dậy từ 5 giờ sáng xếp hàng lấy số, chờ cả buổi · ~' + mo(l, V(l, 0.8)) + (E.medNote ? E.medNote(l, V(l, 0.8), 1) : ''); }, ai: function (l) { return rich(l) ? 0.4 : 1.2; }, run: function (l, r, log) { runGo(l, r, log, V(l, 0.8), 'Khám tổng quát ở bệnh viện công: 5 giờ sáng đã xếp hàng lấy số, chờ xét nghiệm, chờ kết quả, rồi đứng đợi lấy thuốc đến trưa.', 1); } },
      { k: 'private', l: 'Gói khám ở bệnh viện tư / khoa quốc tế', h: function (l) { return 'Hẹn giờ, khám nhanh, có kết quả trong ngày · ~' + mo(l, V(l, 4)); }, ai: function (l) { return rich(l) ? 1.5 : 0.3; }, run: function (l, r, log) { runGo(l, r, log, V(l, 4), 'Mua gói khám ở bệnh viện tư: có người hướng dẫn từng phòng, xong trong một buổi sáng.', 0); } },
      { k: 'no', l: 'Thôi, khỏe mà', run: function () { } }
    ];
  }

  // ===================================================================
  // 3. NGHỀ DIỄN VIÊN: CASTING, CÁT-XÊ, DOANH THU PHIM, QUẢNG CÁO, GAME SHOW
  // ===================================================================
  function isActor(l) { return !!(l.job && l.job.id === 'dien_vien'); }
  function act(l) { if (l.actSk == null) l.actSk = l.talent === 'diễn xuất' ? Math.max(30, l.skill || 30) : 22; return l.actSk; }
  function fameK(l) { var f = l.fame || 0; return f >= 1e6 ? 3 : f >= 1e5 ? 2 : f >= 2e4 ? 1.4 : 1; }
  var PROJ = {
    web: { n: 'phim web drama', lead: [70, 150], sup: [20, 45], need: 0 },
    tv: { n: 'phim truyền hình dài tập', lead: [250, 800], sup: [60, 150], need: 40 },
    cinema: { n: 'phim điện ảnh chiếu rạp', lead: [400, 3000], sup: [100, 300], need: 55 }
  };
  SC('casting', {
    title: 'Lời mời casting',
    valid: function (l) { return l.age >= 14 && free(l); },
    text: function (l) { return (isActor(l) ? 'Quản lý gửi cho bạn mấy kịch bản đang tìm diễn viên.' : 'Một đoàn phim đang tuyển diễn viên mới, bạn bè rủ bạn thử sức.') + (l.job && !isActor(l) ? " Nếu trúng vai và theo đuổi diễn xuất, bạn sẽ rời công việc cùng mức lương hiện tại. Tài năng và may mắn có thể đưa bạn thành diễn viên hạng A, nhưng bạn cũng có thể chỉ nhận vai phụ hoặc quần chúng." : '') + ' Khả năng diễn xuất của bạn: ' + Math.round(act(l)) + '/100' + ((l.fame || 0) >= 1e4 ? ', có ' + E.fmtFollowers(l.fame) + ' người hâm mộ' : '') + '.'; },
    opts: Object.keys(PROJ).map(function (k) {
      var P = PROJ[k];
      return { k: k, l: 'Casting ' + P.n,
        h: function (l) { var f = fameK(l); return 'Cát-xê vai chính ~' + mo(l, V(l, P.lead[0] * f)) + '–' + mo(l, V(l, P.lead[1] * f)) + ', vai phụ ~' + mo(l, V(l, P.sup[0] * f)) + '–' + mo(l, V(l, P.sup[1] * f)) + (P.need ? ' · cần diễn xuất khá' : '') + (l.job && !isActor(l) ? ' · Trúng vai: chuyển nghề, mất việc và lương hiện tại' : ''); },
        req: function (l) { return act(l) >= P.need - 15 || (l.fame || 0) >= 1e5; },
        ai: function (l) { return act(l) >= P.need ? 1 + P.need / 40 : 0.4; },
        run: function (l, r, log) { cast(l, r, log, k); } };
    }).concat([
      { k: 'train', l: 'Chưa nhận vai, dành thời gian học diễn xuất', h: function (l) { return 'Lớp diễn xuất ~' + mo(l, V(l, 12)); }, ai: { w: 0.6, smart: 0.5 }, run: function (l, r, log) { H.cash(l, -V(l, 12), 'Học diễn xuất'); l.actSk = Math.min(100, act(l) + 8); log('Đăng ký lớp diễn xuất cả năm: tập thoại, tập biểu cảm, học cách khóc thật trước ống kính.', 'good'); } },
      { k: 'no', l: 'Thôi, bỏ qua', ai: { w: 0.3 }, run: function () { } }
    ])
  });
  // Refresh text of already saved career choices without rerolling prep/options.
  E.refreshActingWarning = function (l, d) {
    if (!d || (d.id !== 'casting' && d.id !== 'len_chuyen')) return;
    if (d.id === 'len_chuyen' && (!d.data || d.data.id !== 'dien_vien')) return;
    var def = E.DEC[d.id].def;
    d.text = def.text(l, d.data || {});
    if (d.id === 'casting') d.opts.forEach(function (o) {
      var source = def.opts.filter(function (x) { return x.k === o.k; })[0];
      if (source && typeof source.h === 'function') o.h = source.h(l, d.data || {});
    });
  };
  function cast(l, r, log, k) {
    var P = PROJ[k], s = act(l), f = l.fame || 0;
    var p = U.clamp(0.3 + (s - P.need) / 120 + Math.log(f + 10) / Math.LN10 / 30, 0.12, 0.9);
    if (!ch(r, p)) { log('Đi casting ' + P.n + ', qua hai vòng rồi trượt ở vòng cuối. "Lần sau em quay lại nhé."', 'neutral'); fx(l, { hap: -2 }); l.actSk = Math.min(100, s + 1); return; }
    var lead = ch(r, U.clamp(p - 0.15 + (f >= 1e5 ? 0.25 : 0), 0.1, 0.9)), range = lead ? P.lead : P.sup, fee = V(l, rng(r, range[0], range[1]) * fameK(l));
    if (!isActor(l)) { E.startJob(l, 'dien_vien', r, log, true); log('Lần đầu trúng vai — chính thức bước vào nghề diễn viên.', 'big'); }
    H.cash(l, fee, 'Cát-xê ' + P.n);
    l.actSk = Math.min(100, s + (lead ? 5 : 3));
    var t = 'Nhận vai ' + (lead ? 'chính' : 'phụ') + ' trong một ' + P.n + ', cát-xê ' + mo(l, fee) + '.';
    if (k !== 'cinema') { l.fame = Math.max(l.fame || 0, 300) * (lead ? rng(r, 1.3, 2.2) : rng(r, 1.05, 1.4)) + (lead ? 5000 : 800); log(t + (lead && ch(r, 0.15) ? ' Phim lên top thịnh hành, khán giả nhớ tên bạn.' : ''), 'good'); fx(l, { hap: lead ? 6 : 3 }); return; }
    // phim điện ảnh: doanh thu phòng vé quyết định số phận
    var q = s / 100 * 0.6 + Math.log(f + 10) / Math.LN10 / 7 * 0.4 + U.normal(r) * 0.25, rev = Math.exp(2.4 + q * 3 + U.normal(r) * 0.6); // tỷ đồng
    var revT = isVN(l) ? U.fmtNum(Math.round(rev)) + ' tỷ đồng' : mo(l, V(l, rev * 1000));
    if (rev >= 300) { l.fame = (l.fame || 0) * 4 + 1e6; log(t + ' Phim thành bom tấn, doanh thu ' + revT + ' — bạn trở thành ngôi sao, lời mời đóng phim và quảng cáo đến dồn dập!', 'big'); fx(l, { hap: 14 }); H.mem(l, 'Đêm công chiếu bộ phim doanh thu ' + revT + ', khán giả đứng dậy vỗ tay.', 7); H.sched(l, 'quang_cao', 0); H.sched(l, 'casting', 1); }
    else if (rev >= 100) { l.fame = (l.fame || 0) * 2.5 + 3e5; log(t + ' Phim đạt doanh thu ' + revT + ' — tên bạn phủ sóng mạng xã hội, các nhãn hàng tìm đến.', 'big'); fx(l, { hap: 10 }); H.mem(l, 'Bộ phim trăm tỷ đầu tiên trong đời.', 5); H.sched(l, 'quang_cao', 0); }
    else if (rev >= 20) { l.fame = (l.fame || 0) * 1.3 + 2e4; log(t + ' Phim thu ' + revT + ', hòa vốn, được khen diễn tròn vai.', 'good'); fx(l, { hap: 4 }); }
    else { l.fame = (l.fame || 0) * 0.85; log(t + ' Phim thất bại phòng vé, chỉ thu ' + revT + ', bị chê kịch bản yếu.', 'bad'); fx(l, { hap: -5 }); }
  }
  SC('quang_cao', {
    title: 'Hợp đồng quảng cáo',
    prep: function (l, r) { var f = l.fame || 0; return { fee: V(l, f >= 1e6 ? rng(r, 1000, 5000) : f >= 1e5 ? rng(r, 250, 900) : rng(r, 40, 150)), brand: pick(r, ['một hãng điện thoại', 'một thương hiệu mỹ phẩm', 'một hãng sữa', 'một ngân hàng', 'một hãng thời trang', 'một chuỗi cà phê']) }; },
    valid: function (l) { return (l.fame || 0) >= 2e4; },
    text: function (l, d) { return U.cap(d.brand) + ' mời bạn làm gương mặt đại diện, thù lao ' + mo(l, d.fee) + '. Cùng lúc, một hãng "thực phẩm chức năng thần dược" cũng trả giá cao gấp rưỡi.'; },
    opts: [
      { k: 'ok', l: 'Nhận làm đại diện cho nhãn hàng uy tín', ai: { w: 1.4 }, run: function (l, r, log, d) { H.cash(l, d.fee, 'Hợp đồng quảng cáo'); l.fame = (l.fame || 0) * 1.1; log('Ký hợp đồng đại diện ' + d.brand + ', thù lao ' + mo(l, d.fee) + '. Biển quảng cáo in mặt bạn khắp các ngã tư.', 'good'); fx(l, { hap: 5 }); } },
      { k: 'dubious', l: 'Nhận quảng cáo "thần dược" giá cao', ai: { bad: 1, risk: 1 }, run: function (l, r, log, d) { H.cash(l, d.fee * 1.5, 'Quảng cáo thực phẩm chức năng'); if (ch(r, 0.3)) { l.fame = (l.fame || 0) * 0.6; H.cash(l, -V(l, 70), 'Bị phạt vì quảng cáo sai sự thật'); log('Sản phẩm bị phanh phui là hàng kém chất lượng. Bạn bị phạt vì quảng cáo sai sự thật, khán giả tẩy chay.', 'bad'); fx(l, { hap: -12, karma: -6 }); } else { log('Nhận quảng cáo "thần dược", tiền về nhiều mà lòng không yên.', 'neutral'); fx(l, { karma: -3 }); } } },
      { k: 'no', l: 'Từ chối hết, tập trung đóng phim', ai: { w: 0.4 }, run: function (l, r, log) { log('Từ chối quảng cáo để giữ hình ảnh, tập trung cho vai diễn.', 'neutral'); l.actSk = Math.min(100, act(l) + 2); } }
    ]
  });
  var SHOWS = {
    rm: { n: 'Running Man Việt Nam', host: 'anh cả biệt danh "Thánh Trần" nổi tiếng hay nâng đỡ người mới: chỉ bạn cách tạo điểm nhấn, nhường cho bạn những khoảnh khắc chiến thắng' },
    hai: { n: '2 Ngày 1 Đêm', host: '"anh lớn" Tràng Dương nổi tiếng hay "bắt nạt" thành viên mới: dồn hết việc nặng cho bạn, chơi khăm ở mọi trò chơi, còn giành cả phần ăn' }
  };
  SC('gameshow', {
    title: 'Lời mời tham gia game show', major: 0,
    prep: function (l, r) { var f = l.fame || 0; return { fee: V(l, f >= 1e6 ? rng(r, 1200, 3000) : rng(r, 300, 900)) }; },
    valid: function (l) { return (l.fame || 0) >= 1e5; },
    text: function (l, d) { return 'Hai chương trình thực tế ăn khách mời bạn tham gia cả mùa, cát-xê khoảng ' + mo(l, d.fee) + '. Quay ngoài trời, dầm mưa dãi nắng, nhưng khán giả cả nước theo dõi.'; },
    opts: [
      { k: 'rm', l: 'Tham gia Running Man Việt Nam', ai: { w: 1 }, run: function (l, r, log, d) { show(l, r, log, d, 'rm'); } },
      { k: 'hai', l: 'Tham gia 2 Ngày 1 Đêm', ai: { w: 1 }, run: function (l, r, log, d) { show(l, r, log, d, 'hai'); } },
      { k: 'no', l: 'Từ chối, lịch quay phim kín rồi', ai: { w: 0.5 }, run: function () { } }
    ]
  });
  function show(l, r, log, d, k) { H.cash(l, d.fee, 'Cát-xê game show ' + SHOWS[k].n); l.fame = (l.fame || 0) * 1.25 + 5e4; log('Tham gia ' + SHOWS[k].n + ', cát-xê cả mùa ' + mo(l, d.fee) + '.', 'big'); fx(l, { hap: 5 }); H.chain(l, 'gameshow_dong', { k: k }); }
  SC('gameshow_dong', {
    title: function (l, d) { return 'Hậu trường ' + SHOWS[d.k].n; }, prep: function (l, r, arg) { return arg && arg.k ? arg : { k: 'rm' }; },
    text: function (l, d) { return 'Trong ' + SHOWS[d.k].n + ' có ' + SHOWS[d.k].host + '. (Nhân vật trong game.)'; },
    opts: [
      { k: 'chiu', l: function (l, d) { return d.k === 'hai' ? 'Chịu trận, diễn vai "em út bị bắt nạt"' : 'Học hỏi anh cả, làm tốt vai trò của mình'; }, ai: { w: 1.2 }, run: function (l, r, log, d) { if (d.k === 'hai') { l.fame *= 1.4; log('Khán giả thích thú với cặp "anh lớn bắt nạt – em út chịu trận", clip của bạn lên xu hướng.', 'good'); fx(l, { hap: -1 }); } else { l.fame *= 1.3; l.actSk = Math.min(100, act(l) + 5); log('Anh cả tận tình chỉ dạy, bạn tiến bộ từng tập và được khán giả thương.', 'good'); fx(l, { hap: 5, soc: 4 }); } } },
      { k: 'phan', l: function (l, d) { return d.k === 'hai' ? 'Phản pháo lại cho vui' : 'Tranh thủ tỏa sáng, giành chiến thắng'; }, ai: { risk: 1 }, run: function (l, r, log, d) { if (ch(r, 0.55)) { l.fame *= 1.6; log(d.k === 'hai' ? 'Màn "trả đũa" anh lớn khiến cả trường quay cười nghiêng ngả — tập phát sóng hút triệu lượt xem.' : 'Giành chiến thắng chung cuộc, cả nước nhớ mặt bạn.', 'big'); fx(l, { hap: 8 }); } else { l.fame *= 0.92; log('Cư dân mạng chê bạn "lấn lướt", "hỗn với đàn anh". Mấy ngày liền bị bình luận chỉ trích.', 'bad'); fx(l, { hap: -6 }); } } },
      { k: 'nho', l: 'Làm thân với các thành viên, nhờ giới thiệu vai diễn', ai: { soc: 1 }, run: function (l, r, log) { log('Thân thiết với cả ê-kíp; một thành viên giới thiệu bạn vào dự án phim mới.', 'good'); fx(l, { soc: 5 }); H.sched(l, 'casting', 1); } }
    ]
  });
  SC('hoc_dien', {
    title: 'Trau dồi diễn xuất', text: function (l) { return 'Khả năng diễn xuất hiện tại: ' + Math.round(act(l)) + '/100. Diễn viên muốn có vai lớn thì phải không ngừng học.'; },
    opts: [
      { k: 'class', l: 'Học lớp diễn xuất chuyên nghiệp', h: function (l) { return '~' + mo(l, V(l, 15)); }, ai: { w: 1 }, run: function (l, r, log) { H.cash(l, -V(l, 15), 'Học diễn xuất'); l.actSk = Math.min(100, act(l) + 8); log('Học một khóa diễn xuất với thầy giỏi, tiến bộ rõ rệt.', 'good'); } },
      { k: 'self', l: 'Tự xem phim, tập thoại trước gương', h: 'Không tốn tiền', ai: { w: 0.8 }, run: function (l, r, log) { l.actSk = Math.min(100, act(l) + 3); log('Tối nào cũng tập thoại trước gương, phân tích từng cảnh phim hay.', 'neutral'); } },
      { k: 'cast', l: 'Đi casting tìm vai', ai: { w: 1 }, run: function (l, r, log) { H.chain(l, 'casting'); } }
    ]
  });
  A('hoc_dien', 'Công việc', 'Học diễn xuất / đi casting', { min: 14, avail: function (l) { var c = jobC(l); return isActor(l) || l.talent === 'diễn xuất' || (c && c.cat === 'show') ? true : 'Dành cho người mê diễn xuất'; }, ai: function (l) { return isActor(l) ? 0.5 : 0.08; } });
  T('casting', function (l, a) { return isActor(l) && free(l) && ((l.flags.scN || {}).casting || 0) < 8; }, 0.5, 2, 99); // v3.7: casting cách năm một lần, không năm nào cũng hỏi
  T('casting', function (l, a) { return !isActor(l) && l.talent === 'diễn xuất' && a >= 16 && a <= 35 && !l.school && free(l); }, 0.1, 4, 3);
  T('gameshow', function (l, a) { var c = jobC(l); return (l.fame || 0) >= 1e5 && a >= 18 && a <= 55 && c && /^(show|media|creator|sport)$/.test(c.cat) && free(l); }, 0.2, 3, 3);
  E.TRIG.forEach(function (t) { if (t.id === 'casting' && t.max === 99) t.rep = true; });
  // sau khi trúng số công khai, người lạ và họ hàng tìm đến liên tục — chuỗi sự kiện, không tính vào giới hạn lặp
  E.TRIG.forEach(function (t) { if (/^(ts_nguoi_la|ts_ho_hang)$/.test(t.id)) { t.rep = true; t.cd = Math.max(t.cd || 0, 1); } });

  // ===================================================================
  // 4. TÌNH YÊU: NHẮN TIN TÁN TỈNH, CHÊNH LỆCH TUỔI, BIỆT DANH HỘI BẠN
  // ===================================================================
  SC('nhan_tin', {
    title: 'Nhắn tin tán tỉnh', valid: function (l) { return !l.partner && l.age >= 15; },
    prep: function (l, r) { var s = H.partnerSex(l, r); return { n: H.stranger(l, r, s), s: s, where: pick(r, l.school ? ['bạn học khác lớp', 'người quen trên mạng xã hội', 'bạn của bạn thân'] : ['đồng nghiệp ở công ty bên cạnh', 'người quen trên mạng xã hội', 'bạn của bạn thân', 'người gặp ở phòng gym']) }; },
    text: function (l, d) { return 'Bạn để ý ' + d.n + ' (' + d.where + ') và bắt đầu nhắn tin làm quen. Tin nhắn nào cũng được trả lời bằng một biểu tượng cảm xúc.'; },
    opts: [
      { k: 'flirt', l: 'Nhắn tiếp, tán tỉnh ra mặt', ai: { w: 1, soc: 0.8 }, run: function (l, r, log, d) {
        var x = r();
        if (x < 0.3) { log('Nhắn tin cho ' + d.n + ' được hai tuần thì bị "ghost": tin nhắn hiện "đã xem" rồi im bặt.', 'bad'); fx(l, { hap: -4 }); }
        else if (x < 0.6) { l.flags.mapMo = d.n; log('Với ' + d.n + ' cứ mập mờ: tối nào cũng nhắn, cuối tuần đi cà phê, nhưng chẳng ai nói ra là gì của nhau.', 'neutral'); fx(l, { hap: 2 }); }
        else l.pending.unshift(E.DEC.love.make(l, r, { where: 'qua những tin nhắn làm quen' }));
      } },
      { k: 'slow', l: 'Từ từ, để xem người ta có ý không', ai: { w: 0.8 }, run: function (l, r, log, d) { if (ch(r, 0.35)) l.pending.unshift(E.DEC.love.make(l, r, { where: 'sau mấy tháng nhắn tin qua lại' })); else log('Nhắn qua nhắn lại vài lần rồi cũng thưa dần.', 'neutral'); } },
      { k: 'stop', l: 'Thôi, không nhắn nữa', ai: { w: 0.4 }, run: function (l, r, log) { log('Xóa đoạn chat, tập trung cho việc của mình.', 'neutral'); } }
    ]
  });
  T('nhan_tin', function (l, a) { return a >= 15 && a <= 45 && !l.partner && free(l); }, 0.1, 4, 3);
  // chênh lệch tuổi: thỉnh thoảng người ấy hơn / kém nhiều tuổi
  var lm0 = E.DEC.love.make;
  E.DEC.love.make = function (l, r, arg) {
    var d = lm0.apply(this, arguments), p = d.data.p, a0 = p.age;
    if (l.age >= 18 && ch(r, 0.16)) {
      p.age = ch(r, 0.55) ? l.age + U.randint(r, 6, 15) : Math.max(18, l.age - U.randint(r, 3, 9));
      d.text = d.text.split(', ' + a0 + ' tuổi)').join(', ' + p.age + ' tuổi)');
    }
    return d;
  };
  wrapAfter('love', function (l, d, k) {
    var p = l.partner; if (k !== 'yes' || !p || p.since !== l.age) return null;
    var gap = p.age - l.age, F = l.sex === 'F', pM = p.sex === 'M';
    if (F && pM && gap <= -4) return 'Người yêu kém bạn ' + (-gap) + ' tuổi — hội bạn trêu bạn "quen hồng hài nhi".';
    if (F && pM && gap >= 10) return 'Người yêu hơn bạn ' + gap + ' tuổi — đám bạn gọi đùa anh ấy là "ngưu ma vương".';
    if (!F && !pM && gap >= 4) return 'Bạn kém người yêu ' + gap + ' tuổi — thành "phi công trẻ lái máy bay", bị bạn bè trêu suốt.';
    if (!F && !pM && gap <= -10) return 'Bạn hơn người yêu ' + (-gap) + ' tuổi — bạn bè trêu "trâu già gặm cỏ non".';
    return null;
  });
  function wrapAfter(id, f) { var D = E.DEC[id], ap = D.apply; D.apply = function (l, dec, k, r, log) { var x = ap.apply(this, arguments), t = f(l, dec, k); if (t) log(t, 'neutral'); return x; }; }
  // biệt danh hội bạn thân đặt sau khi bạn công khai
  E.HOOKS.year.push(function (l, r, log, a) {
    if (!l.alive || l.flags.nick || !l.out || l.orient === 'straight' || !isVN(l)) return;
    l.flags.nick = true;
    log(true ? 'Từ ngày công khai, hội bạn thân vẫn quý bạn như xưa: "Mày vẫn là mày, có gì đâu mà phải giấu."' : l.orient === 'bi' ? 'Từ ngày công khai, hội bạn thân gọi bạn là "bi" — "thích ai thì thích, miễn người ta tử tế".' : l.sex === 'F' ? 'Từ ngày công khai, hội bạn thân gọi bạn trìu mến là "bé Liên" — ai cũng bênh bạn chằm chặp.' : 'Từ ngày công khai, hội bạn thân đặt cho bạn biệt danh "' + (l.role === 'top' ? 'tóp mỡ' : 'bột tôm') + '" — gọi riết thành quen, cả hội cười suốt.', 'good');
    fx(l, { soc: 3 });
  });

  // về già có của ăn của để thì cho con cháu tiền mua nhà, làm vốn (rất phổ biến ở Việt Nam)
  E.HOOKS.year.push(function (l, r, log, a) {
    if (!l.alive || a < 52 || !l.indep || l.money < l.base * 15 || (l.flags.giftAt != null && a - l.flags.giftAt < 4)) return;
    var ks = l.kids.filter(function (k) { return k.alive && a - k.born >= 22; }); if (!ks.length || !ch(r, 0.35)) return;
    var k = pick(r, ks), x = l.money * rng(r, 0.12, 0.25); l.flags.giftAt = a;
    H.cash(l, -x, 'Cho con ' + k.name); k.close = Math.min(100, (k.close || 50) + 8);
    log('Cho con ' + k.name + ' ' + mo(l, x) + ' ' + pick(r, ['mua nhà', 'làm vốn kinh doanh', 'lo cho các cháu ăn học', 'trả nợ ngân hàng']) + ' — "bố mẹ còn khỏe, giúp được gì thì giúp".', 'good');
    fx(l, { hap: 4, karma: 2 });
  });
  E.HOOKS.year[E.HOOKS.year.length - 1].legacyAutoGift = true;

  // ===================================================================
  // 5. THI LẠI CHỨNG CHỈ (tự chọn trong "Việc bạn muốn làm"), TIỀN MÃ HÓA
  // ===================================================================
  var CERT_K = ['en', 'ko', 'zh'];
  function expired(l) { return CERT_K.filter(function (k) { return l.lang && l.lang[k] && l.langExp && l.langExp[k]; }); }
  A('thi_lai_cc', 'Học tập', 'Thi lại IELTS / TOPIK / HSK đã hết hạn', { min: 16, sc: 'chung_chi_het_han', arg: function (l) { return { k: expired(l)[0] || 'en', manual: true }; },
    avail: function (l) { return expired(l).length ? true : 'Không có chứng chỉ nào hết hạn'; } });
  if (E.DEC.chung_chi_het_han) {
    var cv0 = E.DEC.chung_chi_het_han.def.valid;
    E.DEC.chung_chi_het_han.def.valid = function (l, d) { if (!d || !d.k) return expired(l).length > 0 || cv0(l, d); return d.manual ? !!(l.lang && l.lang[d.k]) : cv0(l, d); };
  }
  if (E.DEC.dau_tu) E.DEC.dau_tu.def.opts.forEach(function (o) {
    if (o.k !== 'crypto') return;
    o.h = 'Rất rủi ro: phần lớn người chơi thua lỗ';
    o.run = function (l, r, log) {
      var m = Math.max(0, l.money) * 0.3, x = r();
      if (m <= l.base * 0.01) { log('Không còn tiền nhàn rỗi để chơi tiền mã hóa.', 'neutral'); return; }
      if (x < 0.3) { H.cash(l, -m * 0.9, 'Mất trắng tiền mã hóa'); log('Đồng coin "tiềm năng" bị rút thảm (rug pull), sàn đóng cửa — mất gần như toàn bộ.', 'bad'); fx(l, { hap: -15 }); H.mem(l, 'Ngày nhìn tài khoản tiền ảo về gần con số 0.', 5); }
      else if (x < 0.65) { H.cash(l, -m * 0.45, 'Lỗ tiền mã hóa'); log('Mua đúng đỉnh, cắt lỗ gần một nửa.', 'bad'); fx(l, { hap: -6 }); }
      else if (x < 0.9) { H.cash(l, m * 0.4, 'Lãi tiền mã hóa'); log('Tiền ảo tăng giá, chốt lời được một ít.', 'good'); fx(l, { hap: 4 }); }
      else if (x < 0.98) { H.cash(l, m * 1.5, 'Lãi lớn tiền mã hóa'); log('Gặp sóng lớn, tài khoản tăng gấp rưỡi.', 'good'); fx(l, { hap: 8 }); }
      else { H.cash(l, m * 4, 'Lãi rất lớn tiền mã hóa'); log('Hiếm có: đồng coin tăng gấp năm lần!', 'big'); fx(l, { hap: 12 }); }
    };
  });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
