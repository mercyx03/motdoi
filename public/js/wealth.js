/* Một Đời — v2.4: tiêu dùng theo mức giàu có (xe điện → siêu xe, nhà phố → dinh thự), bất động sản cho thuê,
   mở cửa hàng / nhà hàng có chi nhánh hoặc phá sản, anh chị em ruột, chứng chỉ ngoại ngữ theo nơi định đến,
   kinh doanh sau khi nghỉ hưu, ghi nhớ những nước đã đặt chân đến. */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function T(id, when, p, cd) { E.TRIG.push({ id: id, when: when, p: p, cd: cd || 0 }); }
  function A(id, g, label, o) { var x = { id: id, g: g, l: label }; for (var k in o) x[k] = o[k]; E.ACT.push(x); }
  function EV(c, p, run) { E.EVENTS.push({ c: c, p: p, run: run }); }
  function fx(l, o) { H.fx(l, o); }
  function cashB(l, x, why) { H.cash(l, x * l.base, why); }
  function mb(l, x) { return H.mb(l, x); }
  function mo(l, v) { return H.money(l, v); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function free(l) { return !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped); }
  function cash(l) { return Math.max(0, l.money); }

  // ===================================================================
  // 1. NGOẠI NGỮ: chứng chỉ theo nơi định đến
  // ===================================================================
  var LANG = {
    en: { n: 'tiếng Anh', cert: 'IELTS', lv: ['4.5', '5.5', '6.5', '7.5', '8.5'], land: 'nước nói tiếng Anh' },
    ja: { n: 'tiếng Nhật', cert: 'JLPT', lv: ['N5', 'N4', 'N3', 'N2', 'N1'], land: 'Nhật Bản' },
    ko: { n: 'tiếng Hàn', cert: 'TOPIK', lv: ['cấp 1', 'cấp 2', 'cấp 3', 'cấp 4', 'cấp 5', 'cấp 6'], land: 'Hàn Quốc' },
    zh: { n: 'tiếng Trung', cert: 'HSK', lv: ['1', '2', '3', '4', '5', '6'], land: 'Trung Quốc / Đài Loan' },
    de: { n: 'tiếng Đức', cert: 'Goethe', lv: ['A1', 'A2', 'B1', 'B2', 'C1'], land: 'Đức' }
  };
  var LANG_OF = { JP: 'ja', KR: 'ko', TW: 'zh', CN: 'zh', HK: 'zh', DE: 'de', AT: 'de', CH: 'de', US: 'en', GB: 'en', AU: 'en', CA: 'en', NZ: 'en', IE: 'en', SG: 'en' };
  var LANG_OF_NAME = { 'Nhật Bản': 'ja', 'Hàn Quốc': 'ko', 'Đài Loan': 'zh', 'Trung Quốc': 'zh', 'Đức': 'de', 'Hoa Kỳ': 'en', 'Úc': 'en', 'Anh': 'en', 'Canada': 'en', 'Singapore': 'en' };
  function langLv(l, k) { return (l.lang && l.lang[k]) || 0; }
  function langCert(l, k) { var L = LANG[k], v = langLv(l, k); return v ? L.cert + ' ' + L.lv[v - 1] : ''; }
  function langNext(l, k) { var v = langLv(l, k); return v < LANG[k].lv.length ? v + 1 : null; }
  // ngôn ngữ phù hợp hoàn cảnh: đang/định sang nước nào thì học tiếng nước đó
  function langCtx(l) {
    var ab = l.abroad, k = ab ? (LANG_OF[ab.code] || LANG_OF_NAME[ab.name]) : null;
    if (k) return k;
    if (l.flags && l.flags.langGoal) return l.flags.langGoal;
    return null;
  }
  function langLabel(l, k) {
    var L = LANG[k], nx = langNext(l, k);
    if (nx == null) return 'Đã có ' + langCert(l, k) + ' — trình độ cao nhất';
    return 'Học ' + L.n + ' — thi ' + L.cert + ' ' + L.lv[nx - 1] + (langLv(l, k) ? ' (đang có ' + L.lv[langLv(l, k) - 1] + ')' : '');
  }
  function inLand(l, k) { return !!(l.abroad && (LANG_OF[l.abroad.code] || LANG_OF_NAME[l.abroad.name]) === k); }
  function studyLang(l, k, r, log) {
    var L = LANG[k], v = langLv(l, k), nx = langNext(l, k);
    if (nx == null) { log('Bạn đã có chứng chỉ ' + L.n + ' cao nhất.', 'neutral'); return; }
    cashB(l, -(0.03 + v * 0.01), 'Học ' + L.n);
    var p = U.clamp(0.78 - v * 0.1 + (l.st.kno - 50) / 150 + (inLand(l, k) ? 0.2 : 0) - (l.age > 45 ? 0.1 : 0), 0.15, 0.95);
    l.lang = l.lang || {};
    if (ch(r, p)) {
      l.lang[k] = nx; l.uniTier = (l.uniTier || 1) + 0.03;
      log('Thi đỗ ' + langCert(l, k) + '! ' + (inLand(l, k) ? 'Giao tiếp với người bản xứ tự tin hẳn, chủ cũng nể hơn.' : nx >= 3 ? 'Hồ sơ xin việc sáng hẳn lên.' : 'Bước đầu đã đọc hiểu được kha khá.'), 'good');
      fx(l, { kno: 3, hap: 3 });
      if (inLand(l, k) && l.abroad.mult) l.abroad.mult *= 1.05;
      if (nx === LANG[k].lv.length) H.mem(l, 'Ngày cầm tấm chứng chỉ ' + langCert(l, k) + ' — bao năm học ' + L.n + ' không uổng.', 4);
    } else { log('Thi ' + L.cert + ' ' + L.lv[nx - 1] + ' nhưng trượt. Hẹn kỳ thi sau.', 'neutral'); fx(l, { kno: 1, hap: -2 }); }
  }
  H.LANG = LANG; H.langCert = langCert; H.langNext = langNext; H.langCtx = langCtx; H.langLabel = langLabel; H.studyLang = studyLang;

  // ===================================================================
  // 2. XE CỘ THEO MỨC GIÀU CÓ
  // tier: 0 xe máy · 1 ô tô điện / phổ thông · 2 hạng sang · 3 xe thể thao · 4 siêu xe
  // ===================================================================
  var CARS = [
    { k: 'ev', n: 'ô tô điện cỡ nhỏ', ex: 'VinFast VF 5', p: 5, t: 1, up: 0 },
    { k: 'pt', n: 'ô tô phổ thông', ex: 'Toyota Vios, Honda City', p: 7, t: 1, up: 0 },
    { k: 'suv', n: 'SUV gia đình 7 chỗ', ex: 'Ford Everest, Toyota Fortuner', p: 12, t: 1, up: 0.02 },
    { k: 'lux', n: 'xe hạng sang', ex: 'Mercedes, BMW, Lexus', p: 25, t: 2, up: 0.12 },
    { k: 'sport', n: 'xe thể thao', ex: 'Porsche 911', p: 80, t: 3, up: 0.4 },
    { k: 'super', n: 'siêu xe', ex: 'Lamborghini, Ferrari', p: 220, t: 4, up: 1.2 }
  ];
  function carPrice(l, c) { return c.p * (isVN(l) ? 1 : 0.5); }
  function vehTier(l) { return l.veh === 'ô tô' ? (l.vehTier || 1) : 0; }
  function carByK(k) { return CARS.filter(function (c) { return c.k === k; })[0]; }
  // đổi xe: bán xe cũ (theo giá trị còn lại) rồi mua xe mới
  function buyCar(l, c, loan, log) {
    var price = carPrice(l, c);
    if (l.veh && l.vehVal > 0) { H.cash(l, l.vehVal, 'Bán ' + (l.vehName || l.veh) + ' cũ'); log('Bán lại ' + (l.vehName || l.veh) + ' cũ được ' + mo(l, l.vehVal) + '.', 'neutral'); }
    cashB(l, -price, 'Mua ' + c.n);
    if (loan) H.addLoan(l, 'car', price * l.base * 0.7);
    var first = l.veh !== 'ô tô';
    l.veh = 'ô tô'; l.vehVal = price * l.base; l.vehTier = c.t; l.vehName = c.n; l.vehK = c.k;
    log('Tậu ' + c.n + ' (' + c.ex + ')' + (loan ? ', vay ngân hàng 70%' : '') + '.', c.t >= 3 ? 'big' : 'good');
    fx(l, { hap: 6 + c.t * 3, soc: c.t >= 2 ? 3 : 0 });
    if (first) H.mem(l, 'Lần đầu lái chiếc ô tô của chính mình về quê, cả xóm ra xem.', 4);
    else if (c.t >= 3) H.mem(l, 'Ngày chiếc ' + c.n + ' lăn bánh ra khỏi showroom, người qua đường ngoái lại nhìn.', 5);
    if (!l.lic.B) log('Bạn chưa có bằng lái ô tô — ra đường có nguy cơ bị phạt.', 'neutral');
  }
  var oldCar = E.DEC.mua_xe.def;
  SC('mua_xe', {
    title: 'Mua xe', prep: oldCar.prep,
    text: function (l, d) {
      var cur = l.veh === 'ô tô' ? 'Bạn đang đi ' + (l.vehName || 'ô tô') + ' (còn giá khoảng ' + mo(l, l.vehVal || 0) + '). ' : '';
      return cur + 'Xe máy khoảng ' + mb(l, d.moto) + ', ô tô từ ' + mb(l, carPrice(l, CARS[0])) + ' (xe điện) đến hơn ' + mb(l, carPrice(l, CARS[5])) + ' (siêu xe). Hiện bạn có ' + mo(l, l.money) + '.';
    },
    opts: oldCar.opts.filter(function (o) { return /^(moto|moto_tg|ev)$/.test(o.k); }).concat(CARS.map(function (c) {
      return {
        k: 'car_' + c.k, l: function (l) { return (l.veh === 'ô tô' ? 'Đổi sang ' : 'Mua ') + c.n + ' (' + c.ex + ')'; },
        h: function (l) { return mo(l, carPrice(l, c) * l.base) + (c.up ? ' · nuôi xe ~' + mb(l, c.up) + '/năm' : ''); },
        req: function (l) { return vehTier(l) < c.t || (vehTier(l) === c.t && l.vehK !== c.k && c.t === 1); },
        ai: { w: c.t <= 1 ? 1.2 : 0.5, amb: c.t >= 2 ? 1 : 0 },
        run: function (l, r, log) {
          var price = carPrice(l, c) * l.base, have = l.money + (l.veh ? l.vehVal || 0 : 0);
          if (have >= price) buyCar(l, c, false, log);
          else if (c.t <= 2 && have >= price * 0.3 && H.canBankLoan(l) && (l.income || 0) > 0) buyCar(l, c, true, log);
          else { log('Ra showroom xem ' + c.n + ' rồi lặng lẽ về — chưa đủ tiền' + (c.t <= 2 ? ' và ngân hàng không duyệt khoản vay.' : '.'), 'neutral'); fx(l, { hap: -2 }); }
        }
      };
    })).concat([{ k: 'no', l: 'Thôi, chưa mua', ai: { w: 0.5 }, run: function () { } }])
  });
  E.ACT.forEach(function (a) { if (a.id === 'mua_xe') { a.l = 'Mua xe / đổi xe'; a.avail = function (l) { return vehTier(l) >= 4 ? 'Đã có siêu xe' : true; }; a.ai = function (l) { return E.netWorth(l) > l.base * 40 && vehTier(l) < 3 ? 0.3 : vehTier(l) >= 1 ? 0.04 : 0.4; }; } });

  // ===================================================================
  // 3. NHÀ Ở THEO MỨC GIÀU CÓ: nhà bình thường → nhà phố → căn hộ cao cấp → biệt thự → dinh thự
  // ===================================================================
  var HOMES = [
    { t: 1, n: 'nhà bình thường', k: 1, up: 0 },
    { t: 2, n: 'nhà phố nhiều tầng', k: 2, up: 0.01 },
    { t: 3, n: 'căn hộ cao cấp', k: 2.6, up: 0.04 },
    { t: 4, n: 'biệt thự có sân vườn', k: 6, up: 0.12 },
    { t: 5, n: 'dinh thự', k: 18, up: 0.45 }
  ];
  function homeTier(l) { return l.ownHouse ? (l.houseTier || 1) : 0; }
  function homeName(l) { return l.ownHouse ? (l.houseName || 'nhà riêng') : ''; }
  function homeDebt(l) { return (l.loans || []).filter(function (x) { return x.type === 'home'; }).reduce(function (s, x) { return s + x.bal; }, 0) + (l.mortgage || 0); }
  SC('doi_nha', {
    title: 'Đổi nhà', valid: function (l) { return l.ownHouse && l.indep; },
    text: function (l) { return 'Bạn đang ở ' + homeName(l) + ' trị giá khoảng ' + mo(l, l.houseVal) + (homeDebt(l) > 0.5 ? ' (còn nợ ngân hàng ' + mo(l, homeDebt(l)) + ')' : '') + '. Tiền mặt ' + mo(l, l.money) + '. Bán nhà cũ để lên nhà mới?'; },
    opts: HOMES.slice(1).map(function (h) {
      return {
        k: 'h' + h.t, l: function (l) { return 'Chuyển lên ' + h.n; }, h: function (l) { return mo(l, H.housePrice(l) * h.k) + (h.up ? ' · chi phí duy trì ~' + mb(l, h.up) + '/năm' : ''); },
        req: function (l) { return homeTier(l) < h.t; }, ai: { w: h.t <= 3 ? 1 : 0.5, amb: 1 },
        run: function (l, r, log) {
          var price = H.housePrice(l) * h.k, net = l.houseVal - homeDebt(l), have = l.money + net;
          var canLoan = H.canBankLoan(l) && (l.income || 0) > 0 && H.loanAgeOk(l, 'home');
          if (have < price && !(canLoan && have >= price * 0.5)) { log('Đi xem ' + h.n + ' vài lần, tính tới tính lui vẫn chưa đủ tiền.', 'neutral'); return; }
          // bán nhà cũ, tất toán nợ nhà cũ
          var oldDebt = homeDebt(l);
          H.cash(l, l.houseVal, 'Bán nhà cũ');
          if (oldDebt > 0.5) H.cash(l, -oldDebt, 'Tất toán nợ nhà cũ');
          l.loans = (l.loans || []).filter(function (x) { return x.type !== 'home'; }); l.mortgage = 0;
          H.cash(l, -price, 'Mua ' + h.n);
          if (l.money < 0) H.addLoan(l, 'home', -l.money + l.base * 0.2);
          l.houseVal = price; l.houseTier = h.t; l.houseName = h.n;
          log('Bán nhà cũ, dọn về ' + h.n + (homeDebt(l) > 0.5 ? ' (vay ngân hàng phần còn thiếu)' : '') + '.', 'big');
          fx(l, { hap: 6 + h.t, soc: h.t >= 4 ? 4 : 1 });
          H.mem(l, h.t >= 4 ? 'Đêm đầu tiên ở ' + h.n + ', đi một vòng quanh nhà mà vẫn chưa tin là của mình.' : 'Ngày chuyển về ' + h.n + '.', h.t >= 4 ? 5 : 3);
        }
      };
    }).concat([{ k: 'no', l: 'Ở nhà cũ cho quen', ai: { w: 1 }, run: function () { } }])
  });
  A('doi_nha', 'Tiền bạc', 'Đổi nhà to hơn', { min: 25, avail: function (l) { return !l.ownHouse ? 'Chưa có nhà riêng' : homeTier(l) >= 5 ? 'Đã ở dinh thự' : l.money + l.houseVal - homeDebt(l) < H.housePrice(l) * 1.5 ? 'Chưa đủ tiền' : true; }, ai: function (l) { return E.netWorth(l) > H.housePrice(l) * 4 ? 0.25 : 0.02; } });
  // lần đầu mua nhà: gắn hạng nhà
  E.HOOKS.year.push(function (l) { if (l.ownHouse && !l.houseTier) { l.houseTier = 1; l.houseName = l.houseName || 'nhà riêng'; } if (!l.ownHouse) { l.houseTier = 0; } });

  // ===================================================================
  // 4. ĐẦU TƯ KINH DOANH: nhà cho thuê, cửa hàng, nhà hàng — có lãi thì mở chi nhánh, thua lỗ thì phá sản
  // ===================================================================
  var PROPS = [
    { k: 'apt', n: 'căn hộ cho thuê', mult: 0.8, y: 0.05 },
    { k: 'shop', n: 'nhà mặt phố cho thuê', mult: 2.5, y: 0.06 },
    { k: 'kiot', n: 'ki-ốt ở chợ cho thuê', mult: 0.35, y: 0.07 }
  ];
  var BIZ = [
    { k: 'store', n: 'cửa hàng tiện lợi', cap: 2, mu: 0.12, sd: 0.22 },
    { k: 'cafe', n: 'quán cà phê', cap: 1.5, mu: 0.1, sd: 0.3 },
    { k: 'rest', n: 'nhà hàng', cap: 5, mu: 0.15, sd: 0.32 },
    { k: 'spa', n: 'spa / thẩm mỹ viện', cap: 4, mu: 0.16, sd: 0.3 },
    { k: 'gym', n: 'phòng tập gym', cap: 3, mu: 0.11, sd: 0.25 }
  ];
  function propPrice(l, p) { return H.housePrice(l) * p.mult; }
  SC('dau_tu_lon', {
    title: 'Đầu tư làm ăn',
    text: function (l) {
      var n = (l.props || []).length, v = (l.ventures || []).length;
      return 'Bạn có ' + mo(l, l.money) + ' tiền mặt' + (n ? ', ' + n + ' bất động sản cho thuê' : '') + (v ? ', ' + v + ' cơ sở kinh doanh' : '') + '. Tiền để không thì mất giá, đầu tư thì có lãi có lỗ.';
    },
    opts: PROPS.map(function (p) {
      return { k: 'p_' + p.k, l: 'Mua ' + p.n, h: function (l) { return mo(l, propPrice(l, p)) + ' · thu tiền thuê ~' + Math.round(p.y * 100) + '%/năm'; },
        req: function (l) { return cash(l) >= propPrice(l, p); }, ai: { w: 1, smart: 0.5 },
        run: function (l, r, log) {
          var v = propPrice(l, p); H.cash(l, -v, 'Mua ' + p.n);
          (l.props = l.props || []).push({ k: p.k, n: p.n, v: v, basis: v, y: p.y, since: l.age, empty: 0 });
          log('Mua ' + p.n + ' giá ' + mo(l, v) + ', tìm được người thuê ngay tháng sau.', 'good'); fx(l, { hap: 4 });
          if ((l.props || []).length === 1) H.mem(l, 'Tháng đầu tiên nhận tiền cho thuê nhà — tiền tự sinh ra tiền.', 3);
        } };
    }).concat(BIZ.map(function (b) {
      return { k: 'b_' + b.k, l: 'Mở ' + b.n, h: function (l) { return 'Vốn ~' + mb(l, b.cap) + ' · có thể lãi to, có thể phá sản'; },
        req: function (l) { return cash(l) >= b.cap * l.base && !(l.ventures || []).some(function (v) { return v.k === b.k; }); }, ai: { w: 0.6, risk: 1, amb: 1 },
        run: function (l, r, log) {
          var cap = b.cap * l.base; H.cash(l, -cap, 'Vốn mở ' + b.n);
          (l.ventures = l.ventures || []).push({ k: b.k, n: b.n, cap: cap, unit: cap, br: 1, mu: b.mu + (l.talent === 'kinh doanh' || l.talent === 'ăn nói' ? 0.04 : 0) + (l.st.kno - 50) / 1000, sd: b.sd, yrs: 0, bad: 0, good: 0 });
          log('Khai trương ' + b.n + ' với số vốn ' + mo(l, cap) + '.', 'big'); fx(l, { hap: 6 }); H.mem(l, 'Ngày khai trương ' + b.n + ', pháo giấy đỏ rực trước cửa.', 4);
        } };
    })).concat([{ k: 'no', l: 'Thôi, để tiền gửi tiết kiệm', ai: { w: 0.8 }, run: function (l, r, log) { log('Chưa đầu tư gì thêm.', 'neutral'); } }])
  });
  A('dau_tu_lon', 'Tiền bạc', 'Mua nhà cho thuê / mở cửa hàng', { min: 22, avail: function (l) { return !l.indep ? 'Chưa tự lập' : cash(l) < Math.min(H.housePrice(l) * 0.35, l.base * 1.5) ? 'Cần nhiều vốn hơn' : true; }, ai: function (l) { return cash(l) > l.base * 4 ? 0.35 : 0.04; } });

  SC('mo_chi_nhanh', {
    title: 'Mở thêm chi nhánh?', prep: function (l) { var v = (l.ventures || []).filter(function (x) { return x.good >= 2; })[0]; return v ? { k: v.k } : null; },
    valid: function (l, d) { return (l.ventures || []).some(function (x) { return x.good >= 2; }); },
    text: function (l, d) { var v = ven(l, d.k); return v ? U.cap(v.n) + ' của bạn (' + v.br + ' cơ sở) làm ăn phát đạt mấy năm liền. Mở thêm một chi nhánh cần khoảng ' + mo(l, v.unit) + '. Tiền mặt hiện có ' + mo(l, l.money) + '.' : ''; },
    opts: [
      { k: 'yes', l: 'Mở thêm chi nhánh', req: function (l, d) { var v = ven(l, d.k); return v && cash(l) >= v.unit; }, ai: { w: 1.2, amb: 1, risk: 0.5 }, run: function (l, r, log, d) { var v = ven(l, d.k); if (!v) return; H.cash(l, -v.unit, 'Mở chi nhánh ' + v.n); v.br++; v.cap += v.unit; v.good = 0; log('Mở chi nhánh thứ ' + v.br + ' của ' + v.n + '.', 'big'); fx(l, { hap: 6 }); if (v.br === 3) H.mem(l, U.cap(v.n) + ' của bạn đã thành chuỗi ' + v.br + ' cơ sở.', 5); } },
      { k: 'loan', l: 'Vay ngân hàng để mở chi nhánh', req: function (l, d) { var v = ven(l, d.k); return v && cash(l) < v.unit && H.canBankLoan(l); }, ai: { risk: 1.2, amb: 1 }, run: function (l, r, log, d) { var v = ven(l, d.k); if (!v) return; H.addLoan(l, 'bank', v.unit * 0.7); H.cash(l, -v.unit, 'Mở chi nhánh ' + v.n); v.br++; v.cap += v.unit; v.good = 0; log('Vay ngân hàng mở chi nhánh thứ ' + v.br + ' của ' + v.n + '.', 'big'); } },
      { k: 'no', l: 'Giữ quy mô hiện tại cho chắc', ai: { w: 1 }, run: function (l, r, log, d) { var v = ven(l, d.k); if (v) v.good = 0; log('Giữ nguyên quy mô, tập trung làm cho tốt.', 'neutral'); } }
    ]
  });
  function ven(l, k) { return (l.ventures || []).filter(function (x) { return x.k === k; })[0]; }

  SC('quan_ly_dau_tu', {
    title: 'Bán bớt tài sản đầu tư', valid: function (l) { return (l.props || []).length + (l.ventures || []).length > 0; },
    text: function (l) {
      var s = (l.props || []).map(function (p) { return p.n + ' ' + mo(l, p.v); }).concat((l.ventures || []).map(function (v) { return v.n + ' (' + v.br + ' cơ sở, vốn ' + mo(l, v.cap) + ')'; }));
      return 'Đang có: ' + s.join(' · ') + '.';
    },
    opts: [
      { k: 'prop', l: function (l) { var p = (l.props || [])[0]; return p ? 'Bán ' + p.n + ' (~' + mo(l, p.v) + ')' : ''; }, req: function (l) { return (l.props || []).length > 0; }, ai: { w: 1 }, run: function (l, r, log) { sellProp(l, 0, log); } },
      { k: 'biz', l: function (l) { var v = (l.ventures || [])[0]; return v ? 'Sang nhượng ' + v.n + ' (~' + mo(l, v.cap * 0.7) + ')' : ''; }, req: function (l) { return (l.ventures || []).length > 0; }, ai: { w: 1 }, run: function (l, r, log) { closeVen(l, 0, log, 0.7, 'Sang nhượng'); } },
      { k: 'keep', l: 'Thôi, cứ giữ', ai: { w: 1 }, run: function () { } }
    ]
  });
  A('quan_ly_dau_tu', 'Tiền bạc', 'Bán nhà cho thuê / sang nhượng cửa hàng', { min: 22, avail: function (l) { return (l.props || []).length + (l.ventures || []).length ? true : 'Chưa có'; } });
  function sellProp(l, i, log) { var p = l.props[i]; if (!p) return; H.cash(l, p.v, 'Bán ' + p.n); l.props.splice(i, 1); log('Bán ' + p.n + ' được ' + mo(l, p.v) + ' (' + (p.v >= p.basis ? 'lãi ' + mo(l, p.v - p.basis) : 'lỗ ' + mo(l, p.basis - p.v)) + ').', p.v >= p.basis ? 'good' : 'bad'); }
  function closeVen(l, i, log, k, how) { var v = l.ventures[i]; if (!v) return; var got = v.cap * k; if (got > 0) H.cash(l, got, how + ' ' + v.n); l.ventures.splice(i, 1); log(how + ' ' + v.n + (got > 0 ? ', thu về ' + mo(l, got) + '.' : '.'), k >= 0.6 ? 'neutral' : 'bad'); }

  function investYear(l, r, log, a) {
    var mkt = l.mkt ? l.mkt.land : 'bình thường';
    // nhà cho thuê: giá theo thị trường đất, tiền thuê theo năm; thỉnh thoảng bỏ trống
    (l.props || []).forEach(function (p) {
      var g = { 'bình thường': 0.03, 'sốt': 0.15, 'vỡ bong bóng': -0.2, 'đóng băng': -0.02 }[mkt] || 0.02;
      p.v = Math.max(p.basis * 0.3, p.v * (1 + g + U.normal(r) * 0.03));
      if (ch(r, 0.12)) { p.empty++; log(U.cap(p.n) + ' bỏ trống mấy tháng chưa có khách thuê.', 'neutral'); H.cash(l, p.v * p.y * 0.4, 'Tiền cho thuê ' + p.n); }
      else H.cash(l, p.v * p.y, 'Tiền cho thuê ' + p.n);
    });
    // cơ sở kinh doanh: lãi lỗ mỗi năm; lãi đều thì được mời mở chi nhánh; lỗ liên tiếp thì phá sản
    for (var i = (l.ventures || []).length - 1; i >= 0; i--) {
      var v = l.ventures[i]; v.yrs++;
      var econ = l.mkt && l.mkt.stock === 'sập' ? -0.12 : l.mkt && l.mkt.stock === 'tăng mạnh' ? 0.04 : 0;
      var rate = v.mu + econ + U.normal(r) * v.sd - (v.yrs === 1 ? 0.08 : 0) + (v.br > 1 ? 0.02 : 0);
      var prof = v.cap * rate;
      H.cash(l, prof, prof >= 0 ? 'Lãi ' + v.n : 'Lỗ ' + v.n);
      if (rate > 0.12) { v.good++; v.bad = 0; } else if (rate < -0.05) { v.bad++; v.good = 0; } else { v.good = Math.max(0, v.good - 1); }
      if (Math.abs(prof) > l.base * 0.1 || ch(r, 0.25)) log(U.cap(v.n) + (v.br > 1 ? ' (' + v.br + ' cơ sở)' : '') + (prof >= 0 ? ' lãi ' + mo(l, prof) + ' năm nay.' : ' lỗ ' + mo(l, -prof) + ' năm nay.'), prof >= 0 ? 'good' : 'bad');
      if (v.bad >= 3 || (v.bad >= 2 && l.money < 0)) {
        if (v.br > 1 && v.bad < 4) { v.br--; v.cap -= v.unit; v.bad = 1; log('Thua lỗ kéo dài, phải đóng bớt một chi nhánh ' + v.n + ', còn ' + v.br + ' cơ sở.', 'bad'); fx(l, { hap: -6 }); }
        else { closeVen(l, i, log, 0.15, 'Phá sản, đóng cửa'); fx(l, { hap: -15 }); if (l.mind) l.mind.stress = Math.min(100, l.mind.stress + 15); H.mem(l, 'Ngày gỡ tấm biển ' + v.n + ' xuống — bao nhiêu vốn liếng đổ sông đổ biển.', 6); }
        continue;
      }
      if (v.good >= 2 && free(l) && a < 75 && ch(r, 0.6) && !(l.sched || []).some(function (s) { return s.id === 'mo_chi_nhanh'; })) H.sched(l, 'mo_chi_nhanh', 1);
      v.cap *= 1 + Math.max(-0.1, Math.min(0.05, rate * 0.2)); v.unit = v.cap / v.br;
    }
    // về già hoặc nợ nần: bán bớt
    if (l.money < -l.base * 1.5 && (l.props || []).length) { log('Nợ nần dồn dập, phải bán bất động sản cho thuê.', 'bad'); sellProp(l, 0, log); }
    // chi phí duy trì nhà to, xe sang
    var hu = HOMES.filter(function (h) { return h.t === homeTier(l); })[0], cu = l.veh === 'ô tô' && l.vehK ? carByK(l.vehK) : null;
    var upk = (hu ? hu.up : 0) + (cu ? cu.up : 0);
    if (upk > 0 && l.indep) H.cash(l, -upk * l.base, 'Chi phí duy trì nhà, xe');
  }

  // ===================================================================
  // 5. ANH CHỊ EM RUỘT
  // ===================================================================
  var SIB_JOBS = ['công nhân', 'giáo viên', 'kế toán', 'buôn bán nhỏ', 'làm nông', 'kỹ sư', 'nhân viên văn phòng', 'tài xế', 'y tá', 'thợ may', 'chủ quán ăn', 'đi xuất khẩu lao động'];
  function initSibs(l) {
    if (l.sibList) return;
    var h = { rs: (l.rs ^ 0x51b5a7) | 0 }, r = function () { return U.rand(h); };
    l.sibList = [];
    for (var i = 0; i < (l.fam.sibs || 0); i++) l.sibList.push(newSib(l, r, -(2 + i * 2 + Math.floor(r() * 2))));
  }
  function newSib(l, r, born) {
    var sex = r() < 0.5 ? 'M' : 'F';
    var nm = H.name(l, r, sex, l.sur);
    return { n: nm.full || nm, sex: sex, born: born, alive: true, close: 55 + Math.floor(r() * 30), job: pick(r, SIB_JOBS), wed: false, kids: 0, q: U.clamp(l.fam.q + Math.round(U.normal(r)), 1, 5) };
  }
  function sibAge(l, s) { return l.age - s.born; }
  function sibs(l) { return (l.sibList || []).filter(function (s) { return s.alive; }); }
  // cách gọi theo vai vế: anh/chị (lớn hơn), em (nhỏ hơn)
  function sibWord(l, s) { return s.born < 0 ? (s.sex === 'M' ? 'anh' : 'chị') : 'em'; }
  function sibCall(l, s) { return sibWord(l, s) + ' ' + String(s.n).split(' ').slice(-1)[0]; }
  H.sibs = sibs; H.sibCall = sibCall; H.sibWord = sibWord;
  E.sibAge = sibAge;

  function sibYear(l, r, log, a) {
    initSibs(l);
    // mẹ sinh em bé (em út) khi bạn còn nhỏ
    var f = l.fam, young = (l.sibList || []).filter(function (s) { return s.born > 0; }).length;
    if (a >= 1 && a <= 12 && f.mAlive && f.mAge + a <= 40 && young < 2 && ch(r, (l.tfr || 2) > 2.2 ? 0.08 : 0.035)) {
      var s = newSib(l, r, a); l.sibList.push(s); f.ysibs = (f.ysibs || 0) + 1;
      log('Mẹ sinh em bé — bạn có thêm ' + (s.sex === 'M' ? 'em trai' : 'em gái') + ' tên ' + s.n + '.', 'good'); fx(l, { hap: 3 });
      H.mem(l, 'Ngày đầu tiên được bế ' + (s.sex === 'M' ? 'em trai' : 'em gái') + ' bé xíu.', 3);
    }
    sibs(l).forEach(function (s) {
      var sa = sibAge(l, s), w = sibCall(l, s);
      // anh chị em lập gia đình, sinh con
      if (!s.wed && sa >= 22 && sa <= 38 && ch(r, 0.14)) { s.wed = true; log('Đám cưới của ' + w + '. Cả nhà tất bật mấy ngày liền.', 'good'); fx(l, { hap: 2, soc: 2 }); s.close += 2; }
      // cháu gọi bạn: con của anh/chị → chú/cô (bên nội) hoặc cậu/dì (bên ngoại); con của em → bác
      if (s.wed && s.kids < 3 && sa >= 24 && sa <= 42 && ch(r, 0.1)) { s.kids++; if (s.kids === 1 && a >= 6) log(U.cap(w) + ' sinh con đầu lòng — bạn lên chức ' + (s.born > 0 ? 'bác' : s.sex === 'M' ? (l.sex === 'M' ? 'chú' : 'cô') : (l.sex === 'M' ? 'cậu' : 'dì')) + '.', 'good'); }
      // anh chị em mất (tuổi già, bệnh tật, tai nạn hiếm)
      var q = sa < 40 ? 0.0012 : Math.min(0.5, 0.002 * Math.exp((sa - 50) * 0.085));
      if (ch(r, q)) { s.alive = false; log(U.cap(w) + ' qua đời ở tuổi ' + sa + '.', 'bad'); fx(l, { hap: s.close > 70 ? -14 : -8 }); H.mem(l, 'Ngày tiễn ' + w + ' — người cùng lớn lên dưới một mái nhà.', s.close > 70 ? 5 : 4); }
      s.close = U.clamp(s.close + (ch(r, 0.5) ? -1 : 0), 10, 100);
    });
  }

  // tuổi nhỏ: tranh giành, bênh vực
  SC('sib_tre', {
    title: 'Anh chị em trong nhà', prep: function (l, r) { var ss = sibs(l).filter(function (s) { return Math.abs(sibAge(l, s) - l.age) <= 8 && sibAge(l, s) >= 3; }); if (!ss.length) return null; var s = pick(r, ss); return { i: l.sibList.indexOf(s), t: pick(r, ['giành nhau cái điều khiển tivi', 'tranh nhau cái đùi gà trong mâm cơm', 'cãi nhau vì ai phải rửa bát', 'giành nhau chiếc xe đạp để đi chơi']) }; },
    valid: function (l) { return sibs(l).some(function (s) { return Math.abs(sibAge(l, s) - l.age) <= 8 && sibAge(l, s) >= 3; }); },
    text: function (l, d) { var s = l.sibList[d.i]; return 'Bạn với ' + sibCall(l, s) + ' ' + d.t + '.'; },
    opts: [
      { k: 'give', l: 'Nhường', ai: { w: 1.2 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; s.close += 6; log('Nhường ' + sibCall(l, s) + '. Mẹ khen bạn biết điều.', 'good'); fx(l, { karma: 1 }); } },
      { k: 'tell', l: 'Mách bố mẹ', ai: { w: 0.8 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; s.close -= 2; log('Mách bố mẹ, cả hai cùng bị mắng.', 'neutral'); } },
      { k: 'fight', l: 'Không nhường, cãi đến cùng', ai: { risk: 1 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; s.close -= 5; var two = s.born < 0 ? (s.sex === 'M' ? 'Hai anh em' : 'Hai chị em') : (l.sex === 'M' ? 'Hai anh em' : 'Hai chị em'); log(two + ' ' + pick(r, ['giận nhau cả tuần không nói chuyện.', 'cãi nhau to, bị mẹ phạt đứng mỗi đứa một góc.', 'chiến tranh lạnh mấy ngày, rồi lại chia nhau gói bim bim.']), 'bad'); fx(l, { hap: -2 }); } }
    ]
  });
  T('sib_tre', function (l, a) { return a >= 5 && a <= 16 && sibs(l).length > 0; }, 0.12, 3);
  EV(function (l, a) { return a >= 6 && a <= 15 && sibs(l).some(function (s) { return s.born < 0 && sibAge(l, s) >= 12; }); }, 0.06, function (l, a, r, log) {
    var s = pick(r, sibs(l).filter(function (s) { return s.born < 0 && sibAge(l, s) >= 12; })), w = sibCall(l, s);
    var t = pick(r, [U.cap(w) + ' chở bạn đi học bằng chiếc xe đạp cũ.', U.cap(w) + ' giảng lại bài toán khó cho bạn đến khuya.', U.cap(w) + ' đứng ra bênh bạn khi bị đám trẻ trong xóm bắt nạt.']);
    log(t, 'good'); s.close += 4; fx(l, { hap: 2 }); H.mem(l, t, 2);
  });
  // lớn lên: vay tiền, gặp khó khăn, chia tài sản
  SC('sib_vay', {
    title: 'Anh chị em hỏi vay tiền', prep: function (l, r) { var ss = sibs(l).filter(function (s) { return sibAge(l, s) >= 22; }); if (!ss.length) return null; var s = pick(r, ss); return { i: l.sibList.indexOf(s), x: pick(r, [0.2, 0.4, 0.8]), why: pick(r, ['mở quán', 'chữa bệnh cho con', 'trả nợ', 'đặt cọc mua nhà', 'làm ăn bị lỗ']) }; },
    valid: function (l) { return l.indep && sibs(l).some(function (s) { return sibAge(l, s) >= 22; }); },
    text: function (l, d) { var s = l.sibList[d.i]; return U.cap(sibCall(l, s)) + ' ngập ngừng hỏi vay ' + mb(l, d.x) + ' để ' + d.why + '. Tiền mặt của bạn: ' + mo(l, l.money) + '.'; },
    opts: [
      { k: 'lend', l: 'Cho vay', req: function (l, d) { return l.money >= d.x * l.base; }, ai: { w: 1, soc: 0.6 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; cashB(l, -d.x, 'Cho ' + sibCall(l, s) + ' vay'); s.close += 6; if (ch(r, 0.6)) { H.sched(l, 'sib_tra', U.randint(r, 1, 4), { i: d.i, x: d.x }); log('Cho ' + sibCall(l, s) + ' vay ' + mb(l, d.x) + '. "Người nhà cả, khi nào có thì trả."', 'good'); } else { log('Cho ' + sibCall(l, s) + ' vay ' + mb(l, d.x) + ' — mà trong lòng biết khó đòi.', 'neutral'); } fx(l, { karma: 2 }); } },
      { k: 'gift', l: 'Cho luôn, không cần trả', req: function (l, d) { return l.money >= d.x * l.base * 2; }, ai: { w: 0.5, soc: 1 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; cashB(l, -d.x, 'Giúp ' + sibCall(l, s)); s.close += 12; log('Đưa ' + sibCall(l, s) + ' ' + mb(l, d.x) + ', dặn cứ cầm lấy mà lo việc.', 'good'); fx(l, { karma: 4, hap: 2 }); H.mem(l, 'Lần giúp ' + sibCall(l, s) + ' lúc khó khăn.', 3); } },
      { k: 'no', l: 'Từ chối khéo', ai: { w: 0.8 }, run: function (l, r, log, d) { var s = l.sibList[d.i]; s.close -= 8; log('Từ chối cho ' + sibCall(l, s) + ' vay. Bữa cơm gia đình sau đó có phần gượng gạo.', 'neutral'); } }
    ]
  });
  T('sib_vay', function (l, a) { return a >= 24 && a <= 70 && l.indep && free(l); }, 0.05, 5);
  SC('sib_tra', {
    title: 'Trả nợ', prep: function (l, r, arg) { if (arg && arg.i != null) return arg; var s = sibs(l)[0]; return s ? { i: l.sibList.indexOf(s), x: 0.2 } : {}; },
    valid: function (l, d) { var s = d && l.sibList && l.sibList[d.i]; return !!(s && s.alive); },
    text: function (l, d) { return U.cap(sibCall(l, l.sibList[d.i])) + ' mang tiền sang trả.'; },
    opts: [{ k: 'ok', l: 'Nhận lại', run: function (l, r, log, d) { var s = l.sibList[d.i]; cashB(l, d.x, sibCall(l, s) + ' trả nợ'); s.close += 3; log(U.cap(sibCall(l, s)) + ' trả lại ' + mb(l, d.x) + ' đã vay, kèm túi quà quê.', 'good'); } }]
  });
  SC('sib_gap', {
    title: 'Anh chị em', prep: function (l, r) { var s = pick(r, sibs(l)); return s ? { i: l.sibList.indexOf(s) } : null; },
    valid: function (l) { return sibs(l).length > 0; },
    text: function (l, d) { var s = l.sibList[d.i]; return U.cap(sibCall(l, s)) + ' năm nay ' + sibAge(l, s) + ' tuổi, ' + (sibAge(l, s) >= 18 ? 'đang ' + (sibAge(l, s) >= 65 ? 'nghỉ ngơi tuổi già' : 'làm ' + s.job) : 'còn đi học') + (s.kids ? ', có ' + s.kids + ' con' : '') + '.'; },
    opts: [
      { k: 'meal', l: 'Rủ cả nhà tụ họp ăn một bữa', run: function (l, r, log, d) { var s = l.sibList[d.i]; s.close += 8; var t = pick(r, ['Anh chị em ngồi ôn lại chuyện hồi bé, cười chảy nước mắt.', 'Bữa cơm đông đủ, lũ trẻ con chạy khắp nhà.', 'Cả nhà nâng ly, hẹn năm nào cũng tụ họp như thế này.']); log('Tụ họp với ' + sibCall(l, s) + '. ' + t, 'good'); cashB(l, -0.01, 'Họp mặt gia đình'); fx(l, { hap: 5, soc: 4 }); if (ch(r, 0.3)) H.mem(l, t, 3); } },
      { k: 'trip', l: 'Rủ đi du lịch chung', req: function (l) { return l.money > l.base * 0.15 && l.indep; }, run: function (l, r, log, d) { var s = l.sibList[d.i]; s.close += 12; cashB(l, -0.12, 'Du lịch cùng anh chị em'); log('Hai nhà cùng đi du lịch một chuyến — lâu lắm mới được gần nhau như thế.', 'good'); fx(l, { hap: 8, soc: 4 }); H.mem(l, 'Chuyến du lịch cùng ' + sibCall(l, s) + '.', 3); } },
      { k: 'help', l: function (l, d) { return 'Phụ giúp ' + sibCall(l, l.sibList[d.i]) + ' một khoản'; }, h: function (l) { return mb(l, 0.2); }, req: function (l, d) { var s = l.sibList[d.i]; return l.indep && l.money > l.base * 0.4 && s.q <= 2 && sibAge(l, s) >= 18; }, run: function (l, r, log, d) { var s = l.sibList[d.i]; s.close += 10; cashB(l, -0.2, 'Giúp ' + sibCall(l, s)); log('Gửi ' + sibCall(l, s) + ' ít tiền trang trải, nhà ' + sibWord(l, s) + ' đang khó.', 'good'); fx(l, { karma: 3 }); } },
      { k: 'call', l: 'Chỉ gọi điện hỏi thăm', run: function (l, r, log, d) { var s = l.sibList[d.i]; s.close += 2; log('Gọi điện hỏi thăm ' + sibCall(l, s) + '.', 'neutral'); fx(l, { soc: 1 }); } }
    ]
  });
  A('gap_anh_chi', 'Gia đình & bạn bè', 'Gặp anh chị em', { min: 8, sc: 'sib_gap', avail: function (l) { return sibs(l).length ? true : 'Không có anh chị em'; }, ai: { w: 0.2, soc: 1 } });
  // chia tài sản khi bố mẹ đều đã mất
  SC('chia_tai_san', {
    title: 'Chia tài sản bố mẹ để lại', prep: function (l) { return { v: H.housePrice(l) * (l.fam.q >= 4 ? 1.2 : 0.6) }; },
    valid: function (l) { return !l.fam.mAlive && !l.fam.fAlive && sibs(l).length > 0 && !l.flags.inherit; },
    text: function (l, d) { return 'Bố mẹ đều đã khuất, để lại căn nhà và mảnh đất ở quê trị giá khoảng ' + mo(l, d.v) + '. Anh chị em ' + (sibs(l).length + 1) + ' người ngồi lại bàn chuyện chia.'; },
    opts: [
      { k: 'equal', l: 'Chia đều cho tất cả', ai: { w: 1.4 }, run: function (l, r, log, d) { l.flags.inherit = true; H.cash(l, d.v / (sibs(l).length + 1), 'Phần tài sản bố mẹ để lại'); sibs(l).forEach(function (s) { s.close += 3; }); log('Anh chị em chia đều phần tài sản bố mẹ để lại, êm thấm.', 'good'); } },
      { k: 'yield', l: 'Nhường phần mình cho anh chị em khó khăn hơn', ai: { w: 0.6, soc: 1 }, run: function (l, r, log) { l.flags.inherit = true; sibs(l).forEach(function (s) { s.close += 10; }); log('Nhường phần thừa kế cho anh chị em. "Mình còn lo được, để các anh chị em giữ lấy hương hỏa."', 'good'); fx(l, { karma: 6, hap: 3 }); H.mem(l, 'Ngày nhường phần đất hương hỏa cho anh chị em.', 4); } },
      { k: 'more', l: 'Đòi phần hơn vì đã chăm bố mẹ nhiều hơn', ai: { risk: 1, bad: 0.6 }, run: function (l, r, log, d) { l.flags.inherit = true; if (ch(r, 0.5)) { H.cash(l, d.v / (sibs(l).length + 1) * 1.5, 'Phần tài sản bố mẹ để lại'); log('Được chia phần hơn, nhưng anh chị em từ đó ít qua lại.', 'neutral'); sibs(l).forEach(function (s) { s.close -= 20; }); } else { cashB(l, -0.15, 'Án phí tranh chấp thừa kế'); log('Anh chị em kéo nhau ra tòa vì chuyện chia đất. Tình thân sứt mẻ.', 'bad'); sibs(l).forEach(function (s) { s.close -= 35; }); fx(l, { hap: -10, karma: -4 }); H.mem(l, 'Phiên tòa chia thừa kế giữa anh chị em ruột.', 5); } } }
    ]
  });
  T('chia_tai_san', function (l, a) { return a >= 25 && sibs(l).length > 0 && !l.fam.mAlive && !l.fam.fAlive && !l.flags.inherit && free(l); }, 0.5);
  E.MAJOR.chia_tai_san = 1;

  // ===================================================================
  // 6. SAU KHI NGHỈ HƯU: an hưởng hay kinh doanh tiếp
  // ===================================================================
  SC('sau_huu', {
    title: 'Nghỉ hưu rồi, làm gì tiếp?', valid: function (l) { return l.retired && l.alive; },
    text: function (l) { return 'Bạn vừa nghỉ hưu, sức khỏe còn tốt, có ' + mo(l, l.money) + ' tiền mặt. Nhiều người cùng tuổi vẫn mở quán, buôn bán nhỏ hay mua nhà cho thuê để có thêm thu nhập.'; },
    opts: [
      { k: 'rest', l: 'An hưởng tuổi già', ai: { w: 1.2 }, run: function (l, r, log) { log('Nghỉ ngơi thật sự: sáng tập thể dục, chiều chăm cháu, tối xem thời sự.', 'good'); fx(l, { hap: 4 }); } },
      { k: 'shop', l: 'Mở cửa hàng / quán nhỏ', h: function (l) { return 'Vốn ~' + mb(l, 0.8); }, req: function (l) { return cash(l) >= l.base * 0.8; }, ai: { w: 0.8, amb: 1, risk: 0.5 }, run: function (l, r, log) {
        cashB(l, -0.8, 'Vốn mở cửa hàng tuổi hưu');
        if (ch(r, 0.55 + (l.st.kno - 50) / 300)) { var id = ch(r, 0.5) ? 'kd_tap_hoa' : 'kd_quan'; l.retired = false; E.startJob(l, id, r, log, true); l.flags.afterRet = l.age + U.randint(r, 6, 12); log('Nghỉ hưu mà không chịu ngồi yên: mở ' + (l.job.p || (id === 'kd_tap_hoa' ? 'tiệm tạp hóa' : 'quán ăn')) + ' trước nhà, vẫn nhận lương hưu đều.', 'big'); fx(l, { hap: 5 }); H.mem(l, 'Ngày khai trương cửa hàng ở tuổi ' + l.age + '.', 4); }
        else { log('Mở cửa hàng được một năm thì ế, đành sang nhượng lại, mất một phần vốn.', 'bad'); cashB(l, 0.4, 'Sang nhượng cửa hàng'); fx(l, { hap: -4 }); }
      } },
      { k: 'rent', l: 'Mua ki-ốt / căn hộ cho thuê lấy lãi', req: function (l) { return cash(l) >= propPrice(l, PROPS[2]); }, ai: { w: 1, smart: 0.6 }, run: function (l, r, log) { var p = cash(l) >= propPrice(l, PROPS[0]) * 1.2 ? PROPS[0] : PROPS[2]; var v = propPrice(l, p); H.cash(l, -v, 'Mua ' + p.n); (l.props = l.props || []).push({ k: p.k, n: p.n, v: v, basis: v, y: p.y, since: l.age, empty: 0 }); log('Dồn tiền hưu mua ' + p.n + ', mỗi tháng có thêm tiền thuê.', 'good'); fx(l, { hap: 3 }); } }
    ]
  });

  // ===================================================================
  // ĐĂNG KÝ VÀO VÒNG NĂM
  // ===================================================================
  var oldMig = E.migrateExt;
  E.migrateExt = function (l) { oldMig(l); if (l.fam) initSibs(l); return l; };
  E.HOOKS.year.push(function (l, r, log, a) {
    initSibs(l);
    if (l.abroad && l.abroad.name) H.visit(l, l.abroad.name);
    // sống ở nước ngoài lâu thì tiếng bản xứ tự lên
    var k = l.abroad ? (LANG_OF[l.abroad.code] || LANG_OF_NAME[l.abroad.name]) : null;
    if (k && k !== 'en' && langNext(l, k) != null && ch(r, 0.3)) { l.lang = l.lang || {}; l.lang[k] = langNext(l, k); log('Sống ở ' + l.abroad.name + ' lâu ngày, ' + LANG[k].n + ' lên hẳn — thi đỗ ' + langCert(l, k) + '.', 'good'); }
    sibYear(l, r, log, a);
    if (l.indep && ((l.props || []).length || (l.ventures || []).length || l.vehK || homeTier(l) >= 2)) investYear(l, r, log, a);
  });
  E.wealth = { CARS: CARS, HOMES: HOMES, PROPS: PROPS, BIZ: BIZ, LANG: LANG, investYear: investYear, sibYear: sibYear, initSibs: initSibs, homeTier: homeTier, vehTier: vehTier };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
