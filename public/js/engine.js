/* Một Đời — bộ máy mô phỏng cuộc đời (lõi).
   Không phụ thuộc DOM: chạy được trong trình duyệt và Node (tests/regression.js).
   Vòng một năm: beginYear (quyết định & tình huống) -> resolve (người chơi / AI) -> finishYear (sự nghiệp, tiền, sự kiện, tử vong) -> endYear.
   Các module careers.js, scenarios.js, finale.js cắm thêm vào các registry DEC / TRIG / ACT / EVENTS / CAR. */
(function (G) {
  'use strict';
  var U = G.U, VN = G.VN, W = G.W, N = G.NAMES, C = G.CUR;
  var REFLECT_AGES = [5, 15, 30, 50, 70];
  var CAL = 0.6;

  var DEC = {}, TRIG = [], ACT = [], EVENTS = [], CAR = {}, LINES = [];
  var DIFFICULTIES = {
    normal: { label: 'Thường', income: 1, passive: 1, pension: 1, events: 1, cap: 3 },
    hardcore: { label: 'Hardcore', income: 0.4, passive: 0.4, pension: 0.65, events: 1.8, cap: 5 }
  };
  function difficulty(l) { return DIFFICULTIES[l.difficulty === 'hardcore' ? 'hardcore' : 'normal']; }

  function RF(life) { return function () { return U.rand(life); }; }
  function isVN(life) { return life.country === 'VN'; }
  function stableService(life) {
    var c=life.job&&E.jobDef&&E.jobDef(life);
    if(!c||c.owner||life.job.fam)return false;
    return c.cat==='uniform'||(c.cat==='state'&&c.id!=='dnnn')||['dieu_tra_vien','chap_hanh_vien','tro_giup_phap_ly'].indexOf(c.id)>=0||life.job.employer==='public';
  }
  function stableParent(job) { return /công chức|viên chức|cán bộ (?:xã|phường)|công an|quân đội|bộ đội|sĩ quan|thẩm phán|kiểm sát|chấp hành viên|kiểm toán viên nhà nước|công lập|bí thư|tỉnh ủy|UBND|bộ trưởng|nghị sĩ/.test(job||''); }
  function resCode(life) { return life.abroad && life.abroad.perm ? life.abroad.code : life.country; }

  // ================= TỬ VONG (Gompertz–Makeham hiệu chỉnh theo tuổi thọ) =================
  function buildMort(e0, u5) {
    var B = 0.085, M = 0.0003 + Math.max(0, 78 - e0) * 0.00022;
    var q0 = Math.min(0.3, u5 / 1000 * 0.7), q14 = Math.min(0.06, u5 / 1000 * 0.3 / 4);
    function ex(A) {
      var S = 1, L = 0;
      for (var x = 0; x <= 110; x++) {
        var q = x === 0 ? q0 : x < 5 ? q14 : 1 - Math.exp(-(A * Math.exp(B * x) + M));
        if (x >= 110) q = 1;
        L += S * (1 - q / 2); S *= 1 - q;
      }
      return L;
    }
    var lo = 1e-9, hi = 0.05;
    for (var i = 0; i < 60; i++) { var mid = Math.sqrt(lo * hi); if (ex(mid) > e0) lo = mid; else hi = mid; }
    return { A: Math.sqrt(lo * hi), B: B, M: M, q0: q0, q14: q14 };
  }
  function qBase(m, x) {
    if (x <= 0) return m.q0;
    if (x < 5) return m.q14;
    if (x >= 110) return 1;
    return 1 - Math.exp(-(m.A * Math.exp(m.B * x) + m.M));
  }
  function hRef(a) { return a < 40 ? 78 : Math.max(30, 78 - (a - 40) * 0.7); }

  // ================= HẰNG SỐ =================
  var MAJORS = { it: 'Kỹ thuật – Công nghệ thông tin', eco: 'Kinh tế – Tài chính', med: 'Y – Dược', edu: 'Sư phạm', law: 'Luật – Báo chí – Xã hội', art: 'Nghệ thuật – Thiết kế' };
  var EDU = ['chưa từng đi học', 'tiểu học', 'trung học cơ sở', 'trung học phổ thông', 'trung cấp / cao đẳng nghề', 'đại học', 'thạc sĩ', 'tiến sĩ'];
  var TALENTS = ['thể thao', 'âm nhạc', 'hội họa', 'toán học', 'ngoại ngữ', 'ăn nói', 'khéo tay', 'game', 'cờ', 'diễn xuất', 'làm đẹp', 'kinh doanh'];
  var SUBS = {
    'thể thao': ['bóng đá', 'bóng đá', 'bóng rổ', 'bóng chuyền', 'bơi lội', 'điền kinh', 'cầu lông', 'bóng bàn', 'võ thuật', 'cử tạ', 'bắn cung', 'quần vợt', 'thể dục dụng cụ', 'đua xe đạp', 'bi-a', 'golf'], // v2.9: thêm bóng rổ, bóng chuyền, thể dục dụng cụ, đua xe đạp, bi-a, golf
    game: ['MOBA', 'FPS'], 'cờ': ['cờ vua', 'cờ tướng']
  };
  var QUINT = ['', 'một trong những gia đình nghèo nhất', 'một gia đình khó khăn', 'một gia đình bình thường', 'một gia đình khá giả', 'một trong những gia đình giàu nhất'];
  // v2.3: khối thi THPT & ngành phù hợp
  var KHOI = {
    A00: { n: 'Toán – Lý – Hóa', m: ['it', 'eco'] }, A01: { n: 'Toán – Lý – Anh', m: ['it', 'eco'] }, B00: { n: 'Toán – Hóa – Sinh', m: ['med'] },
    C00: { n: 'Văn – Sử – Địa', m: ['law', 'edu'] }, D01: { n: 'Toán – Văn – Anh', m: ['eco', 'law', 'edu', 'art'] }, H00: { n: 'Văn – Vẽ', m: ['art'] }
  };
  var CONSCRIPT = ['VN', 'KR', 'KP', 'SG', 'IL', 'RU', 'UA', 'TR', 'EG', 'IR', 'TH', 'CU', 'SY', 'ER', 'GR', 'CY', 'MM'];

  // ================= TIỀN =================
  function moneyCtx(life) {
    if (life.abroad && life.abroad.perm && life.cur !== 'vnd') { var c = W.BY[life.abroad.code]; return { code: life.abroad.code, gdp: c ? c.gdp : life.gdp }; }
    return { code: life.country, gdp: life.gdp };
  }
  function fmtMoney(life, v, withVnd) {
    if (life.cur === 'vnd') return C.fmtVND(v);
    if (life.country && C) { var m = moneyCtx(life); return C.fmtLocal(m.code, m.gdp, v, withVnd); }
    var neg = v < 0; return (neg ? '−' : '') + '$' + U.fmtNum(Math.abs(v));
  }
  function setBase(life) {
    if (life.cur === 'vnd') {
      var w = life.cityWealth || life.wealthIdx;
      life.base = 90 * w * (life.urban ? 1.15 : 0.82);
    } else {
      life.base = G.WEC && G.WEC.baseFor(life.country, life.urban, life.gdp) || life.gdp * 1000 * 0.55 * (life.urban ? 1.1 : 0.8);
    }
    if (life.abroad && (life.abroad.perm || life.abroad.research)) {
      var foreignBase = life.abroad.base;
      var residence = W.BY[life.abroad.code];
      if (G.WEC && residence) {
        var calibrated = G.WEC.baseFor(residence.code, life.urban, residence.gdp);
        if (calibrated != null) { foreignBase = life.cur === 'vnd' ? C.toVND(residence.gdp, calibrated) : calibrated; life.abroad.base = foreignBase; }
      }
      if (!(isFinite(foreignBase) && foreignBase > 0)) {
        var country = W.BY[life.abroad.code];
        if (country) {
          foreignBase = country.gdp * 1000 * 0.55 * 0.75;
          if (life.cur === 'vnd') foreignBase = C.toVND(country.gdp, foreignBase);
          life.abroad.base = foreignBase;
        } else foreignBase = life.base;
      }
      life.base = foreignBase;
    }
  }
  function netWorth(l) {
    var debt = (l.loans || []).reduce(function (s, x) { return s + x.bal; }, 0);
    return l.money + (l.houseVal || 0) + (l.vehVal || 0) + assetTotal(l) - (l.mortgage || 0) - debt;
  }
  // v2.3: tài sản đầu tư (tiết kiệm, vàng, cổ phiếu, đất)
  // v2.4: cộng thêm bất động sản cho thuê (l.props) và vốn trong các cơ sở kinh doanh (l.ventures)
  function assetTotal(l) {
    var A = l.assets, s = A ? (A.save || 0) + (A.gold || 0) + (A.stock || 0) + (A.land || 0) : 0;
    (l.props || []).forEach(function (p) { s += p.v || 0; });
    (l.ventures || []).forEach(function (v) { s += v.cap || 0; });
    return s;
  }
  // v2.3: các module mở rộng đăng ký xử lý thêm vào vòng năm
  var HOOKS = { year: [], gradUpper: [] };
  function runHooks(name, args) { HOOKS[name].forEach(function (fn) { fn.apply(null, args); }); }

  // ================= TRỢ GIÚP CHO CÁC MODULE =================
  var H = {
    rf: RF, isVN: isVN, resCode: resCode,
    clampSt: clampSt,
    // thay đổi chỉ số; o.money tính theo bội số thu nhập cơ sở (base)
    fx: function (l, o, why) {
      var s = l.st;
      if (o.hea) s.hea += o.hea; if (o.hap) s.hap += o.hap; if (o.kno) s.kno += o.kno; if (o.soc) s.soc += o.soc;
      if (o.karma) l.karma = U.clamp((l.karma || 0) + o.karma, -100, 100);
      if (o.money) H.cash(l, o.money * l.base, why || '');
      if (o.fame) l.fame = Math.max(0, (l.fame || 0) * o.fame);
      clampSt(l);
    },
    cash: function (l, v, why) {
      l.money += v;
      if (!l.yr) l.yr = { items: [] };
      if (why && Math.abs(v) > 1e-9) l.yr.items.push({ t: why, v: v });
    },
    mb: function (l, x, vnd) { return fmtMoney(l, x * l.base, vnd); },
    money: function (l, v, vnd) { return fmtMoney(l, v, vnd); },
    mem: function (l, t, w, a) {
      l.mem = l.mem || [];
      l.mem.push({ a: a == null ? l.age : a, t: t, w: w || 1 });
      if (l.mem.length > 60) { l.mem.sort(function (x, y) { return y.w - x.w; }); l.mem.length = 50; l.mem.sort(function (x, y) { return x.a - y.a; }); }
    },
    sched: function (l, id, n, arg) { l.sched = l.sched || []; l.sched.push({ at: l.age + (n || 0), id: id, arg: arg || null }); },
    chain: function (l, id, arg) {
      // v3.1: tình huống nối chuỗi cũng tính vào giới hạn lặp trong đời
      var T = TRIG.filter(function (t) { return t.id === id; })[0], sc = l.flags.scN || (l.flags.scN = {});
      if (T && !T.rep && (sc[id] || 0) >= (T.max || 3)) return;
      if (DEC[id] && (!DEC[id].valid || DEC[id].valid(l, arg || {}))) { l.pending.unshift(DEC[id].make(l, RF(l), arg)); if (T && !T.rep) { sc[id] = (sc[id] || 0) + 1; (l.flags.cd || (l.flags.cd = {}))[id] = l.age; } }
    },
    kill: function (l, cause, log, sudden) {
      if (!l.alive) return;
      l.alive = false; l.death = { age: l.age, cause: cause, year: l.birthYear + l.age, sudden: sudden !== false };
      l.pending = [];
      log('Qua đời vì ' + cause + ' ở tuổi ' + l.age + '.', 'death');
      if (!l.yrs.length || l.yrs[l.yrs.length - 1].a !== l.age) l.yrs.push({ a: l.age, hap: Math.round(l.st.hap), hea: Math.round(l.st.hea) });
    },
    jail: function (l, years, why, log) {
      l.jailUntil = l.age + years + (l._yearRun ? 1 : 0); l.record = (l.record || 0) + 1; // v5.6.4: bị bắt giữa năm thì phần còn lại của năm chưa tính là một năm thụ án
      if (l.job && !/^(xkld)$/.test(l.job.id)) { l.lastJob = l.job; }
      l.job = null; l.school = null;
      log('Bị kết án ' + years + ' năm tù vì ' + why + '.', 'bad');
      H.fx(l, { hap: -20, soc: -15, karma: -5 });
      H.mem(l, 'Ngày nghe tòa tuyên án ' + years + ' năm tù vì ' + why + '.', 5);
      if (l.partner && l.partner.status !== 'dating' && U.rand(l) < 0.35) { log(l.partner.name + ' không chờ được, đã rời bỏ bạn.', 'bad'); l.partner = null; l.exes++; }
    },
    partnerSex: function (l, r) { return l.orient === 'straight' ? (l.sex === 'M' ? 'F' : 'M') : l.orient === 'gay' ? l.sex : (r() < 0.5 ? 'M' : 'F'); },
    stranger: function (l, r, sex) { return strangerName(l, r, sex); },
    name: function (l, r, sex, sur) { return makeName(l, r, sex, sur); },
    canBankLoan: function (l) { var c = l.credit; return (!(c && c.bad) || (l.age - (c.last != null ? c.last : c.since) >= 5)) && l.age < 70; },
    // v2.4: ngân hàng, công ty tài chính, app vay đều có giới hạn tuổi người vay
    loanAgeOk: function (l, type) { return /^(bank|car|card|paylater|fin)$/.test(type) ? l.age < 70 : type === 'appden' ? l.age < 65 : type === 'home' ? l.age < 65 : true; },
    addLoan: function (l, type, amt, log) {
      var T = LOAN_TYPES[type];
      l.loans = l.loans || [];
      if (!H.loanAgeOk(l, type)) return;
      if (type !== 'home' && type !== 'car') { // không ai cho vay thêm khi đã nợ quá nhiều
        var cur = l.loans.filter(function (x) { return x.type !== 'home' && x.type !== 'car'; }).reduce(function (s, x) { return s + x.bal; }, 0);
        amt = Math.max(0, Math.min(amt, l.base * 5 - cur));
        if (amt <= 0) return;
      }
      l.loans.push({ type: type, name: T.name, bal: amt, rate: T.rate, minShare: T.minShare, late: 0, since: l.age });
      H.cash(l, amt, 'Vay ' + T.name);
    },
    // v2.8: lý do qua đời của người thân, bạn bè — hợp với tuổi và thói quen
    deathCause: function (age, r, vice) {
      if (vice === 'alcohol' && r() < 0.5) return 'xơ gan do rượu';
      if (vice === 'drugs' && r() < 0.5) return 'sốc thuốc';
      var pool = age < 15 ? ['đuối nước', 'sốt xuất huyết nặng', 'viêm phổi', 'tai nạn giao thông'] :
        age < 40 ? ['tai nạn giao thông', 'tai nạn giao thông', 'đuối nước', 'ung thư máu', 'tai nạn lao động', 'đột quỵ'] :
        age < 65 ? ['ung thư gan', 'ung thư phổi', 'ung thư dạ dày', 'nhồi máu cơ tim', 'đột quỵ', 'tai nạn giao thông', 'xơ gan'] :
        age < 80 ? ['đột quỵ', 'ung thư', 'suy tim', 'viêm phổi', 'biến chứng tiểu đường', 'nhồi máu cơ tim'] :
        ['tuổi già sức yếu', 'tuổi già sức yếu', 'suy tim', 'viêm phổi', 'đột quỵ', 'ra đi thanh thản trong giấc ngủ'];
      return U.pick(r, pool);
    },
    // v2.5: người làm thuê mới có thể bị "cắt giảm nhân sự" / cho nghỉ — chủ cơ sở, cơ nghiệp gia đình, nghệ sĩ, làm tự do thì không
    isEmployee: function (l) {
      if (!l.job || l.job.fam) return false;
      var c = E.CAR[E.resolveJob ? E.resolveJob(l.job.id) : l.job.id]; if (!c) return true;
      if (c.owner || c.fame || c.cat === 'free' || c.sec === 'farm' || c.sec === 'crime') return false;
      return !/^(chủ|giám đốc công ty|chủ tịch)/.test(c.t[Math.min(l.job.rank || 0, c.t.length - 1)]);
    },
    // v2.4: những nước đã từng đặt chân đến (du lịch, xuất khẩu lao động, du học, định cư)
    visit: function (l, name) { if (!name) return; l.visited = l.visited || []; if (l.visited.indexOf(name) < 0) l.visited.push(name); },
    visited: function (l, name) { return !!((l.visited && l.visited.indexOf(name) >= 0) || (l.abroad && l.abroad.name === name)); },
    debtTotal: function (l) { return (l.loans || []).reduce(function (s, x) { return s + x.bal; }, 0); },
    hasLoan: function (l, type) { return (l.loans || []).some(function (x) { return x.type === type && x.bal > 0.5; }); },
    inBigCity: function (l) {
      if (!isVN(l)) return l.urban && l.city === (W.BY[l.country] ? W.BY[l.country].cities[0] : '');
      var c = l.movedTo || (l.urban ? l.provLabel : '');
      return /Hà Nội|Hồ Chí Minh/.test(c || '') || (l.urban && /Hà Nội|Hồ Chí Minh/.test(l.prov.old));
    },
    aiW: aiW,
    // v2.4: thần tượng có năm sinh — chỉ chọn người đang ở độ tuổi biểu diễn; năm 2060 trở đi phần lớn là thế hệ ca sĩ mới (hư cấu)
    pickIdol: function (r, l) {
      var y = l.birthYear + l.age;
      var pool = (isVN(l) || r() < 0.3 ? IDOLS.vn.concat(IDOLS.world) : IDOLS.world).filter(function (n) { var b = IDOL_BORN[n]; return b && y - b >= 16 && y - b <= 50; });
      var name;
      if (pool.length && r() < Math.min(1, pool.length / 6)) name = U.pick(r, pool);
      else name = U.pick(r, isVN(l) ? IDOLS.next.concat(IDOLS.nextVN) : IDOLS.next);
      l.idolBorn = IDOL_BORN[name] || (y - U.randint(r, 19, 26));
      return name;
    },
    idolAge: function (l) { return l.idol && l.idolBorn ? l.birthYear + l.age - l.idolBorn : null; },
    sameSexLegal: sameSexLegal, partnerWord: partnerWord, QUINT: QUINT,
    inVN: function (l) { return isVN(l) && !l.abroad; }, famFix: function (l, t) { return famFix(l, t); }, schoolOff: function (l, t) { return schoolOff(l, t); } // v3.1
  };
  var LOAN_TYPES = {
    bank: { name: 'vay ngân hàng', rate: 0.09, minShare: 0.12 },
    home: { name: 'vay mua nhà', rate: 0.08, minShare: 0.06 },
    car: { name: 'vay mua xe trả góp', rate: 0.1, minShare: 0.2 },
    card: { name: 'nợ thẻ tín dụng', rate: 0.3, minShare: 0.25 },
    paylater: { name: 'nợ ví trả sau', rate: 0.3, minShare: 0.3 },
    fin: { name: 'vay tiêu dùng (công ty tài chính)', rate: 0.45, minShare: 0.3 },
    appden: { name: 'vay app đen', rate: 2.4, minShare: 0.5 },
    nong: { name: 'vay nóng (tín dụng đen)', rate: 1.5, minShare: 0.4 },
    family: { name: 'vay người thân', rate: 0, minShare: 0.15 }
  };
  var IDOLS = {
    vn: ['Sơn Tùng M-TP', 'Đen Vâu', 'Mỹ Tâm', 'Hà Anh Tuấn', 'HIEUTHUHAI', 'Hoàng Thùy Linh', 'Tăng Duy Tân', 'Bích Phương', 'Vũ.', 'Soobin Hoàng Sơn', 'MONO', 'Tóc Tiên', 'Noo Phước Thịnh', 'Hồ Ngọc Hà', 'Phương Mỹ Chi', 'Anh Trai Say Hi'],
    world: ['Taylor Swift', 'BTS', 'BLACKPINK', 'BIGBANG', 'G-Dragon', 'The Weeknd', 'Bruno Mars', 'Coldplay', 'Ed Sheeran', 'Billie Eilish', 'Ariana Grande', 'Justin Bieber', 'TWICE', 'SEVENTEEN', 'NewJeans', 'Lady Gaga', 'Dua Lipa', 'Olivia Rodrigo', 'Maroon 5', 'Adele'],
    // v2.4: thế hệ thần tượng tương lai (tên hư cấu) cho những năm mà các ngôi sao hôm nay đã về hưu
    next: ['nhóm nhạc NOVA', 'Lyra', 'ARIA', 'Zeno', 'nhóm nhạc STELLAR', 'Kai Rivers', 'Mira', 'ban nhạc The Lanterns', 'nhóm nhạc ORBIT', 'Sena'],
    nextVN: ['Minh Vy', 'Kai Phạm', 'Bảo Khang', 'nhóm nhạc Sao Mai', 'Lam Anh', 'Đông Nghi', 'Rin Trần']
  };
  // năm sinh (nhóm nhạc: năm sinh trung bình các thành viên) — làm tròn
  var IDOL_BORN = {
    'Sơn Tùng M-TP': 1994, 'Đen Vâu': 1989, 'Mỹ Tâm': 1981, 'Hà Anh Tuấn': 1984, 'HIEUTHUHAI': 1999, 'Hoàng Thùy Linh': 1988, 'Tăng Duy Tân': 1996, 'Bích Phương': 1989, 'Vũ.': 1995,
    'Soobin Hoàng Sơn': 1992, 'MONO': 2000, 'Tóc Tiên': 1989, 'Noo Phước Thịnh': 1988, 'Hồ Ngọc Hà': 1984, 'Phương Mỹ Chi': 2003, 'Anh Trai Say Hi': 1998,
    'Taylor Swift': 1989, 'BTS': 1995, 'BLACKPINK': 1996, 'BIGBANG': 1988, 'G-Dragon': 1988, 'The Weeknd': 1990, 'Bruno Mars': 1985, 'Coldplay': 1977, 'Ed Sheeran': 1991, 'Billie Eilish': 2001,
    'Ariana Grande': 1993, 'Justin Bieber': 1994, 'TWICE': 1997, 'SEVENTEEN': 1997, 'NewJeans': 2005, 'Lady Gaga': 1986, 'Dua Lipa': 1995, 'Olivia Rodrigo': 2003, 'Maroon 5': 1979, 'Adele': 1988
  };

  // Trọng số lựa chọn của AI theo tính cách: ai = số | hàm | {w, risk, bad, cost, soc, smart, fun}
  function aiW(l, ai, d) {
    if (ai == null) return 1;
    if (typeof ai === 'number') return ai;
    if (typeof ai === 'function') return Math.max(0, ai(l, d) || 0);
    var t = l.tr || { risk: 50, moral: 60, soc: 50, amb: 50 }, w = ai.w == null ? 1 : ai.w;
    if (ai.risk) w *= Math.exp((t.risk - 50) / 22 * ai.risk);
    if (ai.bad) w *= Math.exp(-((t.moral + (l.karma || 0) * 0.3) - 45) / 16 * ai.bad);
    if (ai.cost) w *= l.money > ai.cost * l.base ? 1 : 0.2;
    if (ai.soc) w *= Math.exp((t.soc - 50) / 30 * ai.soc);
    if (ai.smart) w *= Math.exp((l.st.kno - 50) / 25 * ai.smart);
    if (ai.amb) w *= Math.exp((t.amb - 50) / 25 * ai.amb);
    return Math.max(0, w);
  }

  // v3.1: bố hoặc mẹ đã mất (hoặc gia đình không có bố) thì lời kể không còn nhắc "bố mẹ" như cả hai còn sống
  var FAM_KEEP = /mất|qua đời|giỗ|bàn thờ|thắp hương|nén hương|(^|[^\p{L}])mộ(?![\p{L}])|nhớ|ngày xưa|thuở|hoa hồng|di ảnh|mẹ chồng|mẹ vợ|bố chồng|bố vợ|làm mẹ|làm bố|người mẹ|bà mẹ|ông bố|Đức Mẹ|mẹ đơn thân|mẹ bỉm|bố mẹ đẻ|để lại|hai bên|mẹ con|bố con|cha mẹ|(^|[^\p{L}])[Cc]on [A-ZĐ]|con trai|con gái|các con|cháu|làm cha|nuôi dạy con/u;
  function famFix(l, t) {
    if (!t || typeof t !== 'string' || !l || !l.fam) return t;
    if (E.famLogic) { var t2 = E.famLogic(l, t, false); if (t2 != null) t = t2; }
    // v5.6.1: đang có người yêu thì gọi "người yêu", đã cưới thì gọi "vợ" / "chồng" (cùng giới: "người bạn đời")
    if (l.partner && l.partner.alive !== false && /[Nn]gười yêu \/ bạn đời/.test(t)) { var pw = partnerWord(l, l.partner); t = t.replace(/Người yêu \/ bạn đời/g, U.cap(pw)).replace(/người yêu \/ bạn đời/g, pw); }
    // v4.2: bạn thân đã mất thì các chuyện thường ngày không còn nhắc "bạn thân" nữa
    if (l.bff && !l.bff.alive && l.age > l.bff.died && !/qua đời|mộ|giỗ|nhớ|thuở|ngày xưa|di ảnh/.test(t)) t = t.replace(/(^|[^p{L}])([Nn])gười bạn thân(?! nhất)(?![p{L}])/gu, function (x, p, N) { return p + (N === 'N' ? 'M' : 'm') + 'ột người bạn'; }).replace(/(^|[^p{L}])([Bb])ạn thân(?![p{L}])/gu, function (x, p, B) { return p + B + 'ạn bè'; });
    var f = l.fam, m = !!f.mAlive, b = !!f.fAlive && !f.noDad;
    if ((m && b) || FAM_KEEP.test(t)) return t;
    var fo = f.orphan && f.orphan.adopted == null ? f.orphan : null, oc = fo ? fo.carer : l.flags && l.flags.orphanCarer || null, pw = m ? 'mẹ' : b ? 'bố' : (l.age < 18 ? oc || 'ông bà' : ''); // v7.1: trẻ mồ côi từ nhỏ — người nuôi dưỡng
    if (pw) t = t.replace(/(^|[^\p{L}])([Bb])ố mẹ(?![\p{L}])/gu, function (x, p, B) { return p + (B === 'B' ? pw.charAt(0).toUpperCase() + pw.slice(1) : pw); });
    if (l.age < 18) {
      var hasM = /(^|[^\p{L}])[Mm]ẹ(?![\p{L}])/u.test(t), hasB = /(^|[^\p{L}])[Bb]ố(?![\p{L}])/u.test(t);
      if (!m && hasM && !hasB) t = t.replace(/(^|[^\p{L}])([Mm])ẹ(?![\p{L}])/gu, function (x, p, M) { var w = b ? 'bố' : fo ? fo.one || 'bà' : 'bà'; return p + (M === 'M' ? w.charAt(0).toUpperCase() + w.slice(1) : w); });
      else if (!b && hasB && !hasM) t = t.replace(/(^|[^\p{L}])([Bb])ố(?![\p{L}])/gu, function (x, p, B) { var w = m ? 'mẹ' : fo ? fo.one || 'ông' : 'ông'; return p + (B === 'B' ? w.charAt(0).toUpperCase() + w.slice(1) : w); });
    }
    return t;
  }
  // v3.1: chuyện trường lớp chỉ kể khi đang đi học
  var SCHOOL_TXT = /lớp trưởng|cô giáo|thầy giáo|thầy cô|cô khen|giờ ra chơi|bài kiểm tra|điểm kém|sổ liên lạc|họp phụ huynh|bạn cùng (lớp|bàn)|trong lớp|cả lớp|nhất lớp|cầu thang trường|đến trường|tan học|giờ học|học thêm|cùng bàn|lưu bút|bài vở|ngăn bàn|lớp bên cạnh|cổng trường|thư tình.*lớp/i;
  function schoolOff(l, t) { return l.age >= 6 && l.age <= 17 && !l.school && SCHOOL_TXT.test(t || ''); }
  // v3.1: lựa chọn nào tốn tiền / được tiền thì nhật ký ghi luôn số tiền
  function moneyNote(life, items, i0, out, log) {
    if (!life.alive) return; // đã qua đời giữa chừng thì không ghi thêm gì
    var net = 0, loan = 0, why = [];
    for (var i = i0; i < items.length; i++) { var x = items[i]; if (/^Vay /.test(x.t)) loan += x.v; else { net += x.v; if (why.indexOf(x.t) < 0) why.push(x.t); } }
    if (Math.abs(net) < 1e-9 && !loan) return;
    var tiny = Math.abs(net) < 1e-9;
    var txt = (tiny ? '' : (net < 0 ? 'bạn tự chi ' : 'bạn nhận ') + fmtMoney(life, Math.abs(net)) + (net < 0 ? ' từ tiền riêng' : '')) + (loan > 0 ? (tiny ? 'vay thêm ' : ', vay thêm ') + fmtMoney(life, loan) : '');
    // v6.9.1: trẻ chưa tự lập thì bố mẹ trả; dưới 15 tuổi chưa có tiền tiêu vặt nên bố mẹ trả toàn bộ, 15–17 tuổi tự trả bằng tiền tiêu vặt nếu đủ, thiếu thì bố mẹ bù
    var fm = life.fam || {}, who = fm.mAlive && fm.fAlive && !fm.noDad ? 'bố mẹ' : fm.mAlive ? 'mẹ' : fm.fAlive && !fm.noDad ? 'bố' : (E.orphanCarer && E.orphanCarer(life)) || null; // v7.1: mồ côi từ nhỏ thì người nuôi dưỡng chi
    if (net < 0 && life.age < 18 && !life.indep && who) {
      var cost = -net, before = life.money + cost, self = life.age >= 15 ? Math.min(cost, Math.max(0, before)) : 0, famPay = cost - self;
      if (famPay > 1e-9) { life.money += famPay; if (life.yr) (life.yr.familyExpenses || (life.yr.familyExpenses = [])).push({ t: why.slice(0, 2).join(', '), amount: famPay, payer: who }); }
      txt = (self > 1e-9 ? 'bạn tự chi ' + fmtMoney(life, self) + ' từ tiền tiêu vặt' : '') + (famPay > 1e-9 ? (self > 1e-9 ? ', ' : '') + who + ' chi ' + fmtMoney(life, famPay) : '') + (loan > 0 ? ', vay thêm ' + fmtMoney(life, loan) : '');
    }
    for (var j = out.length - 1; j >= 0; j--) {
      var e = out[j];
      if (e.k === 'money' || e.k === 'death') continue;
      e.t = e.t.replace(/([.!…]*)$/, function (m) { return ' (' + txt + ')' + m; });
      return;
    }
    if (Math.abs(net) >= 1e-9) log(U.cap(why.slice(0, 3).join(', ')) + ': ' + txt + '.', 'money');
  }

  // Định nghĩa tình huống gọn: SC(id, {title, text, prep, opts:[{k,l,h,req,ai,run}]})
  function val(x, l, d) { return typeof x === 'function' ? x(l, d) : x; }
  function releaseUnusedAction(l, d) {
    var x=d&&d.data,id=x&&x.actionId850,year=x&&x.actionYear850;
    if(id&&year===l.age&&l.flags.actAt&&l.flags.actAt[id]===year){delete l.flags.actAt[id];l.acts=Math.max(0,(l.acts||0)-1);delete x.actionId850;delete x.actionYear850;}
  }
  function SC(id, def) {
    DEC[id] = {
      def: def,
      make: function (l, r, arg) {
        var d = def.prep ? def.prep(l, r, arg) : (arg || {});
        if (d == null) d = {};
        var os = def.opts.filter(function (o) { return !o.req || o.req(l, d); }).map(function (o) {
          return { k: o.k, l: famFix(l, val(o.l, l, d)), h: famFix(l, val(o.h, l, d) || '') };
        });
        return { id: id, title: famFix(l, val(def.title, l, d)), text: famFix(l, val(def.text, l, d)), opts: os, data: d, tone: def.tone || '' };
      },
      auto: function (l, dec, r) {
        var os = def.opts.filter(function (o) { return dec.opts.some(function (x) { return x.k === o.k; }); });
        if (!os.length) return dec.opts[0] && dec.opts[0].k;
        return U.wpick(r, os, function (o) { return aiW(l, o.ai, dec.data) + 1e-6; }).k;
      },
      apply: function (l, dec, k, r, log) {
        var o = def.opts.filter(function (x) { return x.k === k; })[0];
        // v2.4: hoàn cảnh đã đổi trong năm (bị bắt, mất việc, hết tiền…) thì lựa chọn không còn hợp lệ → lấy phương án cuối còn làm được (thường là "thôi / giữ nguyên")
        if (o && o.req && !o.req(l, dec.data)) { if(dec.manual){releaseUnusedAction(l,dec);log('Điều kiện của lựa chọn này đã thay đổi; chưa thực hiện và không trừ tiền. Hãy mở lại để chọn phương án phù hợp.','neutral');return;} o = def.opts.filter(function (x) { return !x.req || x.req(l, dec.data); }).pop(); }
        if (o && o.run) o.run(l, r, log, dec.data);
      },
      valid: function (l, d) { return def.valid ? def.valid(l, d) : true; } // v3.2: luôn đọc điều kiện mới nhất (module sau có thể thay đổi)
    };
  }

  // ================= TẠO NHÂN VẬT =================
  function setSex(life, g, r) {
    var pm = life.mode === 'vn' ? 0.528 : 0.512;
    life.orient = 'straight'; life.chosenOrient = false;
    if (g === 'M') life.sex = 'M';
    else if (g === 'F') life.sex = 'F';
    else if (g === 'X') { life.sex = r() < 0.5 ? 'M' : 'F'; life.intersex = true; var xo = r(); life.orient = xo < 0.03 ? 'gay' : xo < 0.07 ? 'bi' : 'straight'; } // v4.5: liên giới
    else if (g === 'gay' || g === 'top') { life.sex = 'M'; life.orient = 'gay'; life.chosenOrient = true; }
    else if (g === 'lesbian') { life.sex = 'F'; life.orient = 'gay'; life.chosenOrient = true; }
    else if (g === 'bi') { life.sex = r() < 0.5 ? 'M' : 'F'; life.orient = 'bi'; life.chosenOrient = true; }
    else {
      life.sex = r() < pm ? 'M' : 'F';
      var x = r();
      life.orient = x < 0.025 ? 'gay' : x < 0.06 ? 'bi' : 'straight';
    }
  }
  function orientLabel(life) {
    // v3.7: ở Việt Nam dùng thêm cách gọi quen thuộc của cộng đồng
    var vn = isVN(life);
    // v5.6.2: người chơi tự chọn tóp mỡ / bột tôm / bé Liên / bi thì hồ sơ ghi đúng cách gọi đã chọn; còn lại ghi trung tính
    var sub = life.orientSub;
    if (life.orient === 'gay' && sub) return life.sex === 'M' ? 'Đồng tính nam' + (vn ? (sub === 'top' ? ' (tóp mỡ)' : sub === 'bot' ? ' (bột tôm)' : '') : '') : 'Đồng tính nữ' + (vn ? ' (bé Liên)' : '');
    if (life.orient === 'bi' && sub) return 'Song tính' + (vn ? ' (bi)' : '');
    if (life.orient === 'gay') return 'LGBTQ+ (đồng tính)';
    if (life.orient === 'bi') return 'LGBTQ+ (song tính)';
    return 'Dị tính';
  }

  function pickOldForEth(eth, r) {
    if (eth.homes) {
      var h = U.wpick(r, eth.homes, function (x, i) { return 1 / (i + 1); });
      if (VN.byName[h]) return VN.byName[h];
    }
    return U.wpick(r, VN.P63, function (p) { return p.pop; });
  }

  function setupVN(life, opts, r) {
    life.country = 'VN'; life.countryName = 'Việt Nam'; life.cur = 'vnd';
    var eth = (opts.eth && VN.ethByName(opts.eth)) || U.wpick(r, VN.ETH, function (e) { return e.share; });
    var old, chosen = opts.prov !== undefined && opts.prov !== null && opts.prov !== '';
    if (opts.oldProv && VN.byName[opts.oldProv]) old = VN.byName[opts.oldProv]; // v2.3: đời con sinh ra ở quê của bố/mẹ
    else if (chosen && life.variant === '63') old = VN.P63[+opts.prov];
    else if (chosen) {
      var np0 = VN.P34[+opts.prov];
      old = U.wpick(r, np0.members, function (p) {
        return p.pop * (eth.homes && eth.homes.indexOf(p.name) >= 0 ? 6 : 1);
      });
    } else old = pickOldForEth(eth, r);
    var np = VN.P34.filter(function (p) { return p.name === old.newName; })[0];
    life.prov = { old: old.name, oldId: old.id, neu: np.name, neuId: np.id, kind: np.kind, region: old.region, merged: np.members.length > 1 };
    life.provLabel = life.variant === '63' ? old.name : np.name;
    life.provNote = life.variant === '34' && np.members.length > 1 && old.name !== np.name ? 'khu vực ' + old.name + ' cũ' : '';
    life.eth = eth.name; life.ethStyle = eth.style;
    var pu = old.urban * (eth.id === 0 ? 1.05 : eth.style === 'hoa' ? 1.5 : 0.35);
    life.urban = r() < U.clamp(pu, 0.03, 0.95);
    if (opts.urban != null) life.urban = !!opts.urban;
    life.coast = old.coast;
    life.region = old.region;
    life.city = old.city;
    life.place = life.urban ? old.city : U.pick(r, VN.RURAL_DESC[old.region]);
    life.wealthIdx = old.wealth;
    life.gdp = VN.STATS.gdpPPP * old.wealth;
    life.religion = U.wkey(r, VN.RELIGION[eth.rel]);
    life.e0nat = VN.STATS.e0;
    life.e0 = VN.STATS.e0 + (old.wealth - 1) * 2.5 + eth.econ * 1.2 + (life.urban ? 0.6 : -0.3);
    life.u5 = VN.STATS.u5 * (1 + Math.max(0, -eth.econ) * 0.8) * (old.wealth < 0.7 ? 1.25 : 1);
    var s = 1.6 * Math.log(old.wealth) + (life.urban ? 0.5 : -0.25) + eth.econ * 0.6;
    life.fam = { q: U.clamp(Math.round(3 + s + U.normal(r) * 1.0), 1, 5) };
    var ht = VN.HOUSE[eth.house] || VN.HOUSE.kinh;
    life.houseType = life.urban && eth.house === 'kinh' ? U.pick(r, ['nhà ống', 'căn hộ chung cư', 'nhà trong hẻm']) : U.pick(r, ht);
    life.tfr = eth.id === 0 ? 1.9 : eth.style === 'hmong' ? 3.2 : 2.4;
    life.pool = 'vn';
  }

  function setupWorld(life, opts, r) {
    var c = (opts.country && W.BY[opts.country]) || U.wpick(r, W.C, function (c) { return c.births; });
    if (c.code === 'VN') {
      life.variant = '34'; life.worldVN = true;
      setupVN(life, {}, r);
      return;
    }
    life.country = c.code; life.countryName = c.name; life.cur = 'usd';
    life.urban = r() < c.urban;
    if (opts.urban != null) life.urban = !!opts.urban;
    var city = U.wpick(r, c.cities, function (x, i) { return 1 / Math.pow(i + 1, 0.8); });
    if (opts.city && c.cities.indexOf(opts.city) >= 0) city = opts.city;
    life.city = city; life.birthCity = city;
    life.place = life.urban ? city : 'vùng nông thôn gần ' + city;
    life.pool = c.pool.indexOf(':') >= 0 ? U.wkey(r, c.pool) : c.pool;
    life.religion = U.wkey(r, W.REL[life.pool] || 'Không rõ:1');
    life.gdp = c.gdp; life.e0nat = c.e0;
    life.e0 = c.e0 + (life.urban ? 0.8 : -0.6);
    life.u5 = c.u5 * (life.urban ? 0.85 : 1.15);
    life.fam = { q: U.clamp(Math.round(3 + (life.urban ? 0.4 : -0.3) + U.normal(r) * 1.1), 1, 5) };
    life.houseType = '';
    life.tfr = U.clamp(1.2 + c.u5 * 0.045, 1.0, 6.8);
    life.coast = r() < 0.3;
  }

  function makeName(life, r, sex, surname) {
    if (life.pool === 'vn') {
      var st = life.ethStyle || 'kinh';
      var v = VN.vnName(r, st, sex, surname);
      return { full: v.full, sub: '', sur: v.sur };
    }
    return N.worldName(r, life.pool, sex, surname);
  }
  // tên cho người ngoài gia đình (bạn đời, bạn bè) — ở VN có thể khác dân tộc
  function strangerName(life, r, sex) {
    if (life.pool === 'vn' && life.ethStyle !== 'kinh' && r() < 0.35) return VN.vnName(r, 'kinh', sex).full;
    if (life.abroad && life.abroad.perm && life.abroad.pool && r() < 0.6) return N.worldName(r, life.abroad.pool, sex).full;
    return makeName(life, r, sex).full;
  }

  var VICE = { gamble: 'mê cờ bạc', alcohol: 'nghiện rượu', gang: 'dính vào giang hồ', drugs: 'nghiện ma túy' };
  function parentJob(life, r, who) {
    var q = life.fam.q, vn = isVN(life), v = life.fam.vice;
    if (who === 'F' && v === 'gang') return vn ? 'giang hồ, đâm thuê chém mướn' : 'làm tay chân cho băng nhóm';
    if (who === 'F' && v === 'gamble') return 'cờ bạc, làm thuê lặt vặt';
    if (who === 'M' && r() < (life.gdp < 5 ? 0.35 : 0.12)) return 'nội trợ';
    if (q <= 2 && r() < 0.07) return 'thất nghiệp';
    if (r() < 0.06) return U.pick(r, q <= 2 ? ['nghệ nhân truyền thống', 'nghệ sĩ sân khấu', 'vũ công'] : q <= 4 ? ['giáo viên thanh nhạc', 'giáo viên múa', 'nhạc sĩ', 'họa sĩ', 'nhiếp ảnh gia', 'biên kịch', 'người làm truyền hình'] : ['ca sĩ', 'diễn viên', 'đạo diễn', 'nhà sản xuất âm nhạc']);
    if (!life.urban) {
      if (q <= 2) return U.pick(r, vn && life.region === 'MNPB' ? ['làm nương rẫy', 'làm ruộng bậc thang', 'chăn nuôi', 'làm thuê'] :
        life.coast ? ['đánh cá', 'nuôi trồng thủy sản', 'làm ruộng', 'làm thuê'] : ['làm ruộng', 'làm thuê theo mùa vụ', 'chăn nuôi', 'trồng rẫy', vn ? 'bán vé số' : 'bán hàng rong']);
      if (q === 3) return U.pick(r, ['làm ruộng', 'buôn bán nhỏ', 'thợ xây', 'công nhân', 'trồng cây ăn trái', 'thợ mộc', 'chạy xe ôm']);
      return U.pick(r, ['chủ trang trại', 'buôn bán', 'giáo viên', vn ? 'cán bộ xã' : 'viên chức địa phương', 'chủ xưởng nhỏ', 'chủ đại lý vật tư nông nghiệp']);
    }
    if (q <= 1) return U.pick(r, ['nhặt ve chai', 'bán vé số dạo', 'phụ hồ', 'giúp việc', 'bán hàng rong', vn ? 'chạy xe ôm' : 'lái xe thuê']);
    if (q === 2) return U.pick(r, ['công nhân', 'bán hàng rong', vn ? 'chạy xe ôm' : 'lái xe', 'phụ hồ', 'giúp việc', 'bảo vệ', 'shipper']);
    if (q === 3) return U.pick(r, ['công nhân', 'nhân viên văn phòng', 'buôn bán', 'thợ may', 'tài xế công nghệ', 'giáo viên', 'y tá', 'thợ sửa xe']);
    if (q === 4) return U.pick(r, ['nhân viên văn phòng', 'kỹ sư', 'giáo viên', 'kế toán', 'công chức', 'chủ cửa hàng', 'công an', 'bác sĩ']);
    return U.pick(r, ['giám đốc công ty', 'bác sĩ', 'doanh nhân', 'kỹ sư phần mềm', 'luật sư', 'trưởng phòng ngân hàng', 'chủ chuỗi nhà hàng', 'giám đốc kinh doanh']);
  }

  // thu nhập tham chiếu (triệu đồng/tháng ở VN) theo nghề của bố mẹ
  // Tham chiếu: thu nhập bình quân lao động 2025 ~8,4 triệu/tháng (thành thị 10,1 · nông thôn 7,3 · nông lâm thủy sản ~4,9 — Cục Thống kê);
  // lương công chức = hệ số × lương cơ sở 2,34 triệu + phụ cấp; chủ kinh doanh thu nhập cao hơn hẳn nhưng bấp bênh.
  var PARENT_PAY = {
    'nội trợ': 0, 'thất nghiệp': 0, 'làm nương rẫy': 3, 'làm ruộng bậc thang': 3, 'chăn nuôi': 5, 'làm thuê': 5, 'đánh cá': 7, 'nuôi trồng thủy sản': 8,
    'làm ruộng': 4.5, 'làm thuê theo mùa vụ': 4, 'trồng rẫy': 4, 'bán vé số': 4.5, 'bán vé số dạo': 4.5, 'bán hàng rong': 5.5, 'buôn bán nhỏ': 8, 'thợ xây': 11, 'công nhân': 8.5,
    'trồng cây ăn trái': 8, 'thợ mộc': 10, 'chạy xe ôm': 6.5, 'chủ trang trại': 25, 'buôn bán': 15, 'giáo viên': 9.5, 'cán bộ xã': 7.5, 'viên chức địa phương': 8.5,
    'chủ xưởng nhỏ': 35, 'chủ đại lý vật tư nông nghiệp': 28, 'nhặt ve chai': 3.5, 'phụ hồ': 8.5, 'giúp việc': 7, 'lái xe thuê': 10, 'lái xe': 10, 'bảo vệ': 7,
    'shipper': 10, 'nhân viên văn phòng': 12, 'thợ may': 8, 'tài xế công nghệ': 11, 'y tá': 9, 'thợ sửa xe': 10, 'kỹ sư': 20, 'kế toán': 12, 'công chức': 11,
    'chủ cửa hàng': 20, 'công an': 14, 'bác sĩ': 22, 'giám đốc công ty': 40, 'doanh nhân': 50, 'kỹ sư phần mềm': 28, 'luật sư': 28, 'trưởng phòng ngân hàng': 30,
    'chủ chuỗi nhà hàng': 45, 'giám đốc kinh doanh': 40, 'cờ bạc, làm thuê lặt vặt': 3, 'giang hồ, đâm thuê chém mướn': 12, 'làm tay chân cho băng nhóm': 10,
    'nghệ nhân truyền thống': 4, 'nghệ sĩ sân khấu': 5, 'vũ công': 6, 'giáo viên thanh nhạc': 10, 'giáo viên múa': 9, 'nhạc sĩ': 12, 'họa sĩ': 8, 'nhiếp ảnh gia': 10, 'biên kịch': 11, 'người làm truyền hình': 12, 'ca sĩ': 35, 'diễn viên': 40, 'đạo diễn': 45, 'nhà sản xuất âm nhạc': 50,
    'bán hàng online': 8, 'bán tạp hóa': 9
  };
  var PARENT_FORMAL = /công nhân|giáo viên|cán bộ xã|viên chức|văn phòng|y tá|kỹ sư|kế toán|công chức|công an|bác sĩ|ngân hàng|bảo vệ|giám đốc kinh doanh|bí thư|tỉnh ủy|UBND tỉnh|bộ trưởng|nghị sĩ/;
  var PARENT_BIZ = /^chủ |doanh nhân|giám đốc công ty|^buôn bán$/;
  // v6.1.0: lý do mất việc của bố / mẹ theo đúng nghề; k = hệ số rủi ro (1 = bình thường), crop = không "thất nghiệp" mà mất mùa / ế ẩm
  var PARENT_LOSS = [
    [/bác sĩ|y tá/, 0.15, [' nghỉ việc khi phòng khám tư nơi đang làm đóng cửa, phải xin vào bệnh viện khác.', ' chuyển công tác, mấy tháng chờ quyết định ở bệnh viện mới.']],
    [/giáo viên/, 0.15, [' mất việc khi trường tư thục nơi đang dạy giải thể.', ' hết hợp đồng giảng dạy, chờ đợt tuyển dụng viên chức mới.']],
    [/công nhân/, 1.2, [' mất việc sau khi nhà máy thu hẹp sản xuất, cắt giảm công nhân.', ' bị cho nghỉ khi xưởng hết đơn hàng xuất khẩu.']],
    [/kỹ sư phần mềm/, 1, [' bị công ty công nghệ cắt giảm nhân sự sau khi dự án lớn dừng lại.']],
    [/kỹ sư/, 0.8, [' tạm nghỉ việc khi công trình kết thúc mà công ty chưa có dự án mới.']],
    [/ngân hàng/, 0.6, [' mất vị trí khi ngân hàng sáp nhập, cơ cấu lại các phòng ban.']],
    [/văn phòng|kế toán/, 1, [' bị công ty cho nghỉ việc trong đợt tái cơ cấu.', ' mất việc khi công ty làm ăn thua lỗ, cắt giảm nhân sự.']],
    [/bảo vệ/, 1, [' mất việc khi công ty bảo vệ hết hợp đồng với tòa nhà.']],
    [/giám đốc kinh doanh/, 0.6, [' rời công ty khi ban lãnh đạo mới thay đổi bộ máy.']],
    [/thợ xây|phụ hồ/, 1, [' hết việc khi công trình xong, chưa có chỗ mới thuê.', ' nghỉ việc mấy tháng vì thị trường xây dựng đóng băng.']],
    [/xe ôm|tài xế công nghệ|lái xe|shipper/, 1, [' chạy xe cả ngày mà ít cuốc, đành tạm nghỉ.', ' bán xe trả nợ, mấy tháng chưa có việc.']],
    [/giúp việc/, 1, [' mất việc khi nhà chủ chuyển đi nơi khác.']],
    [/thợ may|thợ mộc|thợ sửa xe/, 1, [' vắng khách mấy tháng liền, gần như không có thu nhập.']],
    [/vé số|hàng rong|ve chai|làm thuê/, 1, [' không có việc làm một thời gian, mất nguồn thu nhập.', ' hết việc, ngày ngày đi hỏi khắp nơi xem ai cần người.']],
    [/chăn nuôi/, 1, null, 'crop', [' gặp dịch bệnh trên đàn lợn, gà, phải tiêu hủy gần hết, thu nhập sụt mạnh.', ' giá lợn hơi xuống thấp, nuôi ra bán lỗ cả năm.']],
    [/nuôi trồng thủy sản/, 1, null, 'crop', [' gặp dịch bệnh tôm, cả ao tôm chết trắng, thu nhập sụt mạnh.', ' nước ao nhiễm mặn, cá chết hàng loạt, năm nay gần như mất trắng.']],
    [/trồng cây ăn trái/, 1, null, 'crop', [' mất mùa vì hạn mặn, vườn cây ra ít trái, thu nhập giảm hẳn.', ' được mùa mất giá, thương lái ép giá, bán không đủ tiền phân bón.']],
    [/làm ruộng|làm nương|ruộng bậc thang|trồng rẫy|trang trại/, 1, null, 'crop', [' mất mùa vì hạn hán, thu nhập năm nay giảm hẳn.', ' lúa bị sâu bệnh, năng suất giảm một nửa.', ' được mùa mất giá, bán không đủ tiền phân bón.', ' lũ về ngập ruộng, vụ này mất trắng.']],
    [/buôn bán|bán tạp hóa|bán hàng online/, 1, null, 'crop', [' buôn bán ế ẩm cả năm, chợ vắng khách, thu nhập giảm hẳn.', ' bị khách quỵt tiền hàng, vốn liếng hao hụt.']],
    [/đánh cá/, 1, null, 'crop', [' biển động nhiều tháng, tàu nằm bờ, thu nhập giảm hẳn.']]
  ];
  function parentLoss(job) { for (var i = 0; i < PARENT_LOSS.length; i++) if (PARENT_LOSS[i][0].test(job || '')) return PARENT_LOSS[i]; return null; }
  function parentKind(job) {
    if (/nội trợ|thất nghiệp/.test(job)) return 'none';
    if (/cờ bạc|giang hồ|băng nhóm/.test(job)) return 'vice';
    if (PARENT_FORMAL.test(job)) return 'formal';
    if (PARENT_BIZ.test(job)) return 'biz';
    return 'inf';
  }
  function parentScale(life, monthly) { var local = G.WEC && G.WEC.scale(life, null, monthly); return local != null ? local : life.cur === 'vnd' ? Math.pow(life.base / 90, 0.6) : life.base / 90; }
  function parentMonthly(life, job, r) {
    var v = PARENT_PAY[job]; if (v == null) v = 7;
    var x = v * parentScale(life, v) * [1, 0.9, 0.95, 1, 1.05, 1.15][life.fam.q];
    if (r && v > 0) x *= Math.exp(U.normal(r) * 0.12); // mỗi người một mức, không ai giống hệt ai
    return x;
  }
  // Thu nhập bố mẹ thay đổi theo năm: tăng lương, thăng chức, mất việc, nghỉ hưu (lương hưu), về già thu nhập giảm
  function parentYear(life, r, log, who) {
    var f = life.fam, M = who === 'm', alive = M ? f.mAlive : f.fAlive;
    if (!alive) return;
    var age = (M ? f.mAge : f.fAge) + life.age, P = M ? 'Mẹ' : 'Bố';
    if (f.elite && age < 72) return; // v2.5: bố mẹ tài phiệt / chủ ngân hàng / chính khách không "bị cắt giảm nhân sự"
    var key = M ? 'mInc' : 'fInc', jobK = M ? 'mJob' : 'fJob', retK = M ? 'mRet' : 'fRet', lostK = M ? 'mLost' : 'fLost';
    var job = f[jobK], kind = parentKind(job), inc = f[key] || 0, sc = parentScale(life, PARENT_PAY[job] == null ? 7 : PARENT_PAY[job]);
    var ref = PARENT_PAY[job] != null ? PARENT_PAY[job] * sc : ((M ? f.mInc0 : f.fInc0) || 7 * sc), show = function (v) { return fmtMoney(life, v); };
    if (f[retK]) {
      // đã nghỉ: lương hưu giữ nguyên; người không có lương hưu được trợ cấp hưu trí xã hội (Luật BHXH 2024: 500.000 đ/tháng, mức chung cả nước, từ 75 tuổi; hộ nghèo/cận nghèo từ 70 tuổi)
      if (isVN(life) && life.cur === 'vnd' && age >= (life.fam.q <= 2 ? 70 : 75) && inc < 0.5) { f[key] = 0.5; if (!f[retK + 'Tc']) { f[retK + 'Tc'] = true; log(P + ' bắt đầu nhận trợ cấp hưu trí xã hội ' + show(f[key]) + '/tháng.', 'neutral'); } }
      return;
    }
    // nghỉ hưu
    var retAge = kind === 'formal' ? (/công an/.test(job) ? 55 : M ? 60 : 62) : kind === 'biz' ? 65 : kind === 'none' ? 999 : 68 + Math.floor(r() * 5);
    if (age >= retAge) {
      f[retK] = true; f[lostK] = null;
      if (kind === 'formal') { f[key] = inc * (0.55 + r() * 0.15); log(P + ' nghỉ hưu ở tuổi ' + age + ', nhận lương hưu ' + show(f[key]) + '/tháng (trước đó ' + show(inc) + ').', 'neutral'); }
      else if (kind === 'biz') { f[key] = inc * (0.25 + r() * 0.2); log(P + ' giao lại việc làm ăn cho người khác, nghỉ ngơi ở tuổi ' + age + ' — vẫn có ' + show(f[key]) + '/tháng từ cho thuê, cổ tức.', 'neutral'); }
      else { f[key] = 0; log(P + ' tuổi cao sức yếu, thôi ' + job + ' ở tuổi ' + age + '. Không có lương hưu, ' + (life.indep ? 'trông vào con cái.' : 'cả nhà phải chắt bóp hơn.'), life.indep ? 'neutral' : 'bad'); }
      return;
    }
    if (kind === 'none') {
      // thất nghiệp / nội trợ: có khi đi làm lại
      var find = job === 'thất nghiệp' ? 0.3 : life.age >= 6 && age < 55 ? 0.04 : 0;
      if (r() < find) {
        var nj = U.pick(r, life.urban ? ['bán hàng online', 'giúp việc', 'công nhân', 'bán tạp hóa', 'bảo vệ'] : ['làm thuê', 'buôn bán nhỏ', 'công nhân', 'chăn nuôi']);
        f[jobK] = nj; f[key] = parentMonthly(life, nj, r);
        log(P + (job === 'thất nghiệp' ? ' tìm được việc ' : ' quyết định đi làm, nhận việc ') + nj + ', thu nhập ' + show(f[key]) + '/tháng.', 'good');
      }
      return;
    }
    // đang mất việc: tìm việc lại
    if (f[lostK]) {
      if (r() < 0.55) { f[key] = f[lostK] * (0.8 + r() * 0.2); f[lostK] = null; log(P + ' đã có việc làm trở lại, thu nhập ' + show(f[key]) + '/tháng.', 'good'); }
      return;
    }
    // biến động hằng năm
    var drift = kind === 'formal' ? 0.025 + U.normal(r) * 0.03 : kind === 'biz' ? 0.02 + U.normal(r) * 0.15 : 0.01 + U.normal(r) * 0.06;
    if (age >= 58 && kind !== 'formal') drift -= 0.06; // làm nghề tự do khi về già: sức yếu, làm ít đi
    inc *= Math.exp(drift);
    var x = r();
    if (kind === 'formal' && age < 52 && x < 0.05) { inc *= 1.2 + r() * 0.2; log(P + ' được thăng chức, lương tăng lên ' + show(inc) + '/tháng.', 'good'); }
    else if (kind === 'biz' && x < 0.05) { inc *= 1.5 + r() * 0.5; log('Việc làm ăn của ' + P.toLowerCase() + ' phát đạt, thu nhập lên ' + show(inc) + '/tháng.', 'good'); }
    else if (kind === 'biz' && x < 0.09) { inc *= 0.4 + r() * 0.2; log('Việc làm ăn của ' + P.toLowerCase() + ' thua lỗ, thu nhập chỉ còn ' + show(inc) + '/tháng.', 'bad'); if (!life.indep) life.st.hap -= 3; }
    else if (!stableParent(job) && kind !== 'biz' && x >= 0.05 && x < 0.05 + ((kind === 'formal' ? 0.015 : 0.03) * ((parentLoss(job) || [0, 1])[1]))) {
      var PL = parentLoss(job);
      if (PL && PL[3] === 'crop') { inc *= 0.45 + r() * 0.2; log(P + U.pick(r, PL[4]), 'bad'); if (!life.indep) life.st.hap -= 2; f[key] = U.clamp(inc, ref * 0.3, Math.max(ref * 3.5, 1)); return; }
      f[lostK] = inc; f[key] = 0;
      log(P + U.pick(r, PL && PL[2] ? PL[2] : kind === 'formal' ? [' bị cắt giảm nhân sự, mất việc.', ' bị công ty cho nghỉ việc trong đợt tái cơ cấu.'] : [' không có việc làm một thời gian, mất nguồn thu nhập.', ' thất nghiệp mấy tháng liền, phải đi làm thuê lặt vặt.', ' hết việc, ngày ngày đi hỏi khắp nơi xem ai cần người.']), 'bad');
      if (!life.indep) { life.st.hap -= 3; if (!(M ? f.fInc : f.mInc)) { life.flags.famHardship = true; H.mem(life, 'Năm ' + P.toLowerCase() + ' mất việc, bữa cơm nhà mình chỉ còn rau với nước mắm.', 3); } }
      return;
    }
    f[key] = U.clamp(inc, ref * 0.3, Math.max(ref * 3.5, 1));
  }

  function createLife(opts) {
    opts = opts || {};
    var life = {
      v: G.VERSION, sv: SAVE_SCHEMA, id: Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36),
      mode: opts.mode === 'world' ? 'world' : 'vn', variant: opts.variant === '63' ? '63' : '34',
      rs: opts.seed != null ? opts.seed | 0 : U.newSeed(), lifeMin: opts.lifeMin || 30, createdAt: Date.now(),
      difficulty: opts.difficulty === 'hardcore' ? 'hardcore' : 'normal'
    };
    var r = RF(life);
    life.birthYear = opts.year || new Date().getFullYear();
    life.birthMonth = U.randint(r, 1, 12);
    setSex(life, opts.gender || 'random', r);
    if (opts.orient === 'straight') { life.orient = 'straight'; life.chosenOrient = true; }
    else if (opts.orient === 'lgbt') { life.orient = r() < 0.55 ? 'gay' : 'bi'; life.chosenOrient = true; }
    else if (opts.orient === 'top' || opts.orient === 'bot') { life.sex = 'M'; life.intersex = false; life.orient = 'gay'; life.role = opts.orient; life.orientSub = opts.orient; life.chosenOrient = true; } // v5.6.2: tóp mỡ (top) / bột tôm (bot)
    else if (opts.orient === 'les') { life.sex = 'F'; life.intersex = false; life.orient = 'gay'; life.orientSub = 'les'; life.chosenOrient = true; } // bé Liên (les)
    else if (opts.orient === 'bi') { life.orient = 'bi'; life.orientSub = 'bi'; life.chosenOrient = true; } // bi (bisexual)
    if (life.mode === 'vn') setupVN(life, opts, r); else setupWorld(life, opts, r);

    var nm = makeName(life, r, life.sex);
    if (opts.name && String(opts.name).trim()) {
      life.name = String(opts.name).trim().slice(0, 40); life.nameSub = ''; life.custom = true;
      life.sur = life.pool === 'vn' ? life.name.split(/\s+/)[0] : nm.sur;
    } else { life.name = nm.full; life.nameSub = nm.sub; life.sur = nm.sur; }

    // gia đình
    var f = life.fam, tfr = life.tfr, PA = opts.parent || null;
    if (PA && PA.q) f.q = U.clamp(PA.q, 1, 5);
    var pv = [0, 0.25, 0.12, 0.05, 0.02, 0.01][f.q];
    f.vice = r() < pv ? U.wkey(r, 'gamble:4,alcohol:4,gang:1.5,drugs:0.7') : null;
    if (PA) f.vice = PA.vice || null;
    f.mAge = U.clamp(Math.round(30 - (tfr - 1.5) * 1.6 + U.normal(r) * 5), 16, 45);
    f.fAge = U.clamp(f.mAge + Math.round(3 + U.normal(r) * 3), 17, 62);
    f.sibs = Math.min(9, U.poisson(r, Math.max(0, (tfr - 1) * 0.55 + (f.mAge - 25) * 0.06)));
    f.noDad = r() < 0.03;
    f.mJob = parentJob(life, r, 'M'); f.fJob = parentJob(life, r, 'F');
    f.mName = makeName(life, r, 'F').full;
    f.fName = makeName(life, r, 'M', life.sur).full;
    f.mAlive = true; f.fAlive = !f.noDad;
    f.home = f.q <= 1 && !life.urban ? 'nhà tạm' : life.urban && f.q <= 2 ? 'nhà thuê' : 'nhà riêng';

    // tuổi thọ & tử vong
    var gap = /^(ru|ua|lt|lv|ee|ca)$/.test(life.pool) ? 9 : 5;
    life.e0sex = life.e0 + (life.sex === 'F' ? gap / 2 : -gap / 2);
    life.mort = buildMort(life.e0sex, life.u5);
    life.mortM = buildMort(life.e0 - gap / 2, life.u5);
    life.mortF = buildMort(life.e0 + gap / 2, life.u5);
    life.p5 = 1 - (1 - life.mort.q0) * Math.pow(1 - life.mort.q14, 4);

    // chỉ số & tính cách (AI dùng để tự quyết)
    life.st = {
      hea: U.clamp(Math.round(72 + U.normal(r) * 8 + (f.q - 3) * 2), 20, 100),
      hap: U.clamp(Math.round(55 + (f.q - 3) * 3 + U.normal(r) * 6 - (f.vice ? 6 : 0)), 10, 95),
      kno: U.clamp(Math.round(50 + U.normal(r) * 8), 20, 85),
      soc: U.clamp(Math.round(55 + U.normal(r) * 6), 20, 90)
    };
    life.tr = {
      risk: U.clamp(Math.round(45 + U.normal(r) * 15 + (life.sex === 'M' ? 6 : 0) + (f.vice ? 8 : 0)), 5, 95),
      moral: U.clamp(Math.round(62 + U.normal(r) * 14 - (f.vice ? 10 : 0)), 5, 98),
      amb: U.clamp(Math.round(50 + U.normal(r) * 15), 5, 95),
      soc: U.clamp(Math.round(50 + U.normal(r) * 15), 5, 95)
    };
    life.karma = 0;
    life.talent = r() < 0.75 ? U.pick(r, TALENTS) : null;
    life.talentSub = life.talent && SUBS[life.talent] ? U.pick(r, SUBS[life.talent]) : null;
    if (life.talent === 'game') life.game = gameFor(life, r);
    life.skill = life.talent ? U.randint(r, 15, 35) : 5;
    setBase(life);
    f.mInc = parentMonthly(life, f.mJob, r); f.fInc = f.noDad ? 0 : parentMonthly(life, f.fJob, r);
    if (PA) applyParent(life, PA, r); // v2.3: "sống tiếp đời con" — bố mẹ chính là nhân vật đời trước
    if (E.eliteBirth) E.eliteBirth(life, PA); // v2.5: ~1% sinh ra trong gia đình tài phiệt / chủ ngân hàng / chính trị (RNG riêng)
    f.mInc0 = f.mInc; f.fInc0 = f.fInc; // thu nhập lúc bạn chào đời (để so sánh về sau)
    life.money = 0; life.income = 0; life.indep = false; life.houseVal = 0; life.mortgage = 0; life.vehVal = 0;
    life.edu = 0; life.school = null; life.major = null; life.job = null; life.retired = false; life.workYrs = 0; life.uniTier = 1;
    life.partner = null; life.exes = 0; life.widowed = 0; life.kids = []; life.grand = 0; life.ggrand = 0;
    life.abroad = null; life.ill = null; life.out = false; life.realized = false;
    life.veh = null; life.lic = {}; life.loans = []; life.credit = { bad: false, since: null }; life.fame = 0; life.medals = []; life.titles = [];
    life.pets = [];
    life.record = 0; life.jailUntil = null; life.bff = null; life.mem = []; life.sched = []; life.acts = 0; life.spend = 'normal';
    life.sendParents = isVN(life) || f.q <= 3; life.addict = {}; life.idol = null; life.imm = 50;
    life.age = 0; life.alive = true; life.death = null;
    life.focus = 'baby'; life.log = []; life.yrs = []; life.refl = {}; life.pending = []; life.flags = {}; life.yr = { items: [] }; life.fin = null;
    life.yearsInSchool = 0;
    if (f.vice) { life.flags.famHardship = true; if (f.vice === 'gamble' || f.vice === 'drugs') life.flags.famDebt = true; }
    if (f.q <= 1) life.flags.famHardship = true;
    life.birthPlace = placeText(life);
    var r0 = birthSentence(life);
    life.log.push({ a: 0, y: life.birthYear, t: r0, k: 'big' });
    H.mem(life, 'Tiếng khóc chào đời ở ' + (life.urban ? life.place : life.place) + '.', 2, 0);
    if (E.migrateExt) E.migrateExt(life);
    return life;
  }
  // v2.3: đời con — bố/mẹ là nhân vật đời trước (PA.me) và người bạn đời (PA.mate)
  function applyParent(life, PA, r) {
    var f = life.fam, me = PA.me || {}, mate = PA.mate || null;
    var mom = me.sex === 'F' ? me : mate, dad = me.sex === 'M' ? me : mate;
    if (mate && mate.sex === me.sex) { mom = me.sex === 'F' ? me : mate; dad = me.sex === 'F' ? mate : me; } // hai mẹ hoặc hai bố: vẫn hiển thị hai người nuôi dưỡng
    function set(pre, p) {
      if (!p) return;
      f[pre + 'Name'] = p.name; f[pre + 'Age'] = U.clamp(p.age | 0, 15, 70);
      f[pre + 'Job'] = p.job || (p.inc > 0 ? 'đi làm' : 'nội trợ');
      f[pre + 'Inc'] = Math.max(0, +p.inc || 0);
    }
    set('m', mom); set('f', dad);
    if (!dad) { f.noDad = true; f.fAlive = false; f.fInc = 0; } else { f.noDad = false; f.fAlive = true; }
    f.mAlive = !!mom;
    if (!mom) { f.mInc = 0; f.mJob = 'không sống cùng'; }
    f.sibs = U.clamp(PA.sibs | 0, 0, 9);
    if (PA.home) f.home = PA.home;
    if (PA.sur) life.sur = PA.sur;
    life.gen = (PA.gen || 1) + 1;
    life.lineage = (PA.lineage || []).concat([{ n: me.name, y: PA.years || '' }]).slice(-6);
  }
  // v2.8: game theo thể loại (FPS bắn súng · MOBA chiến thuật) và nền tảng (máy tính ở quán net · điện thoại)
  var GAMES = {
    moba: { pc: ['Liên Minh Huyền Thoại', 'Dota 2'], mobile: ['Liên Quân Mobile', 'Mobile Legends: Bang Bang', 'Tốc Chiến'] },
    fps: { pc: ['Valorant', 'CS2', 'Đột Kích (CrossFire)', 'Delta Force'], mobile: ['PUBG Mobile', 'Free Fire', 'Delta Force Mobile', 'Call of Duty Mobile'] }
  };
  function gameFor(l, r, plat) {
    var g = GAMES[(l.talent === 'game' ? l.talentSub : l.gameType) === 'FPS' ? 'fps' : 'moba'];
    if (!isVN(l)) g = { pc: g.pc, mobile: g.mobile.filter(function (x) { return x !== 'Liên Quân Mobile'; }).concat((l.talent === 'game' ? l.talentSub : l.gameType) === 'FPS' ? [] : ['Arena of Valor']) };
    var p = plat || (isVN(l) && (!l.urban || l.fam.q <= 3) && r() < 0.6 ? 'mobile' : r() < 0.5 ? 'mobile' : 'pc');
    return U.pick(r, g[p]);
  }
  // game chơi ở quán net (máy tính) hay trên điện thoại cho người không có năng khiếu game
  function anyGame(l, r, plat) { var t = r() < 0.5 ? 'fps' : 'moba'; return U.pick(r, GAMES[t][plat || (r() < 0.5 ? 'mobile' : 'pc')]); }

  var TW5 = ['Hà Nội', 'Hải Phòng', 'Đà Nẵng', 'Cần Thơ', 'Huế'];
  function provDisplay(life, name) {
    if (/^TP\./.test(name)) return name;
    var city = life.variant === '34' ? TW5.indexOf(name) >= 0 : TW5.indexOf(name) >= 0 && name !== 'Huế';
    return (city ? 'thành phố ' : 'tỉnh ') + name;
  }
  function placeText(life) {
    if (isVN(life)) {
      var label = life.provLabel, where;
      if (life.urban) {
        var city = life.place.replace(/^thành phố /, ''), tw = /^TP\./.test(label) || TW5.indexOf(label) >= 0;
        if (city === label || city === life.prov.old) {
          if (life.variant === '34') where = tw ? 'nội thành ' + label : 'trung tâm ' + provDisplay(life, label);
          else where = tw && label !== 'Huế' ? provDisplay(life, label) : life.place + ', ' + provDisplay(life, label);
        } else where = (life.variant === '34' ? 'khu đô thị ' + city + (life.provNote ? ' (' + life.provNote + ')' : '') : life.place) + ', ' + provDisplay(life, label);
      } else where = life.place + ' thuộc ' + (life.provNote ? life.provNote + ', ' : '') + provDisplay(life, label);
      return where + ', Việt Nam';
    }
    return life.place + ', ' + life.countryName;
  }

  function religionSentence(rel) {
    if (/^Không theo tôn giáo \(/.test(rel)) return 'Gia đình không theo tôn giáo nào, chỉ thờ cúng tổ tiên.';
    if (/^Không/.test(rel)) return 'Gia đình không theo tôn giáo nào.';
    if (/^Không rõ|^Khác/.test(rel)) return '';
    if (/^Tín ngưỡng/.test(rel)) return 'Gia đình giữ ' + rel.charAt(0).toLowerCase() + rel.slice(1) + '.';
    return 'Gia đình theo ' + rel + '.';
  }

  function birthSentence(life) {
    var f = life.fam;
    var s = 'Tháng ' + life.birthMonth + ' năm ' + life.birthYear + ', bạn chào đời là một bé ' + (life.sex === 'M' ? 'trai' : 'gái') +
      ' tại ' + placeText(life) + ', ' + (f.q === 1 || f.q === 5 ? 'thuộc ' : 'trong ') + QUINT[f.q] + '.';
    if (life.eth) s += ' Bạn là người dân tộc ' + life.eth + '.';
    s += f.sibs ? ' Bạn có ' + f.sibs + ' anh chị.' : ' Bạn là con đầu lòng.';
    if (f.noDad) s += ' Mẹ một mình nuôi bạn.';
    else if (f.vice) s += ' Bố bạn ' + VICE[f.vice] + '.';
    s += ' ' + religionSentence(life.religion);
    return s.trim();
  }

  // ================= TRẠNG THÁI NGẮN (dùng cho "sinh cùng giây") =================
  function statusLine(life) {
    if (!life.alive) return 'đã mất ở tuổi ' + life.death.age + ' (' + life.death.cause + ')';
    var a = life.age, parts = [];
    if (life.jailUntil && a < life.jailUntil) parts.push('đang ngồi tù');
    else if (a < 3) parts.push('em bé');
    else if (a < 6) parts.push('tuổi mẫu giáo');
    else if (life.school) parts.push('đang học ' + schoolName(life.school));
    else if (life.retired) parts.push('đã nghỉ hưu');
    else if (life.job) parts.push(jobTitle(life));
    else if (life.flags.military) parts.push('đang tại ngũ');
    else if (a < 15) parts.push('không được đi học');
    else parts.push('chưa có việc làm ổn định');
    if (life.abroad) parts.push('ở ' + life.abroad.name);
    if (life.partner && life.partner.status === 'married') parts.push('đã kết hôn');
    else if (life.partner && life.partner.status === 'cohabit') parts.push('sống cùng người yêu');
    if (life.kids.length) parts.push(life.kids.length + ' con');
    return parts.join(' · ');
  }
  function schoolName(s) {
    return { primary: 'tiểu học', lower: 'THCS', upper: 'THPT', voc: 'trường nghề', uni: 'đại học', post: 'cao học (thạc sĩ)', phd: 'nghiên cứu sinh (tiến sĩ)', priv: 'THPT tư thục', police: 'trường công an / quân đội', abroad: 'du học' }[s] || s;
  }

  // ================= XÁC SUẤT HỌC TẬP =================
  function eduP(life) {
    var g = Math.log(Math.max(0.6, life.gdp));
    var qf = 0.6 + 0.2 * (life.fam.q - 1);
    var uf = life.urban ? 1.12 : 0.92;
    var ef = life.eth && life.eth !== 'Kinh' && life.eth !== 'Hoa' ? 0.75 : 1;
    var kf = 0.55 + life.st.kno / 100;
    var vf = life.fam.vice ? 0.8 : 1;
    return {
      prim: U.clamp(0.6 + 0.2 * g, 0.6, 0.995),
      // v6.8: Việt Nam theo Nemotron-Personas-Vietnam: người 18–29 tuổi chỉ học hết tiểu học khoảng 2% (trước đây game ra ~17%)
      lower: isVN(life) && life.mode === 'vn' ? U.clamp(0.995 - (1 - qf) * 0.06 - (life.urban ? 0 : 0.02) - (ef < 1 ? 0.06 : 0) - (vf < 1 ? 0.04 : 0), 0.8, 0.995) : U.clamp((0.35 + 0.25 * g) * Math.sqrt(qf * uf * ef * vf), 0.25, 0.99),
      upper: U.clamp((0.15 + 0.25 * g) * qf * uf * ef * kf * vf, 0.08, 0.96),
      uni: U.clamp((g - 0.5) * 0.17 * qf * uf * ef * kf * vf, 0.02, 0.85)
    };
  }

  // ================= BỆNH =================
  var ILLS = [
    { n: 'ung thư gan', m: 6, cure: 0.2, w: function (l) { return isVN(l) ? 3 : 1; } },
    { n: 'ung thư phổi', m: 6, cure: 0.18, w: function (l) { return l.flags.smoke ? 4 : 1.2; } },
    { n: 'ung thư vú', m: 3.5, cure: 0.6, w: function (l) { return l.sex === 'F' ? 2.5 : 0; } },
    { n: 'ung thư đại trực tràng', m: 4, cure: 0.45, w: function () { return 1.2; } },
    { n: 'ung thư dạ dày', m: 5, cure: 0.3, w: function (l) { return isVN(l) || l.pool === 'kr' || l.pool === 'jp' ? 1.5 : 0.7; } },
    { n: 'bệnh mạch vành', m: 3, cure: 0.3, f: 'nhồi máu cơ tim', w: function () { return 2; } },
    { n: 'tăng huyết áp nặng', m: 2.3, cure: 0.35, f: 'đột quỵ', w: function () { return 2.5; } },
    { n: 'tiểu đường type 2', m: 1.8, cure: 0.08, f: 'biến chứng tiểu đường', w: function () { return 2; }, chronic: 1 },
    { n: 'lao phổi', m: 3.5, cure: 0.85, w: function (l) { return l.gdp < 6 ? 3 : l.gdp < 20 ? 1 : 0.1; } },
    { n: 'suy thận mạn', m: 3, cure: 0.1, f: 'suy thận', w: function () { return 0.8; }, chronic: 1 },
    { n: 'viêm gan B mạn tính', m: 2, cure: 0.2, f: 'xơ gan', w: function (l) { return isVN(l) || l.pool === 'cn' || /af/.test(l.pool) ? 2 : 0.3; }, chronic: 1 },
    { n: 'xơ gan do rượu', m: 3.5, cure: 0.1, f: 'xơ gan', w: function (l) { return l.addict && l.addict.alcohol ? 4 : 0.2; }, chronic: 1 },
    { n: 'HIV', m: 3, cure: 0, f: 'HIV/AIDS', w: function (l) { return E.hivRisk ? E.hivRisk(l) : 0; }, young: 1, chronic: 1 } // v3.0: chỉ có khi có đường lây (tình dục không an toàn, kim tiêm, mẹ truyền sang con)
  ];
  ILLS.forEach(function (x) { if (/huyết áp/.test(x.n)) x.chronic = 1; });
  // v2.4: tuổi càng cao, cơ thể càng khó vượt qua bệnh nặng (90 tuổi mắc ung thư gần như không thể khỏi hẳn)
  function illAgeK(a) { return a < 60 ? 1 : Math.max(0.04, 1 - (a - 60) * 0.038); }

  // ================= QUYẾT ĐỊNH CỐT LÕI =================
  function opt(k, l, h) { return { k: k, l: l, h: h || '' }; }
  function partnerWord(life, p) {
    if (p.sex === life.sex) return p.status === 'married' || p.status === 'cohabit' ? 'người bạn đời' : 'người yêu';
    if (p.status === 'married') return p.sex === 'M' ? 'chồng' : 'vợ';
    return 'người yêu';
  }
  function sameSexLegal(life) { return W.SSM.indexOf(resCode(life)) >= 0; }

  // nơi học đại học theo vùng
  function uniPlaces(l) {
    if (!isVN(l)) {
      var c = W.BY[l.country];
      return { big: c.cities[0], local: l.urban ? l.city : (c.cities[Math.min(2, c.cities.length - 1)] || c.cities[0]), inCity: l.urban && l.city === c.cities[0] };
    }
    var reg = l.region, old = l.prov.old;
    var north = reg === 'MNPB' || reg === 'DBSH' || /Thanh Hóa|Nghệ An|Hà Tĩnh/.test(old);
    var big = north ? 'Hà Nội' : 'TP. Hồ Chí Minh';
    var local = { MNPB: 'Thái Nguyên', DBSH: 'Hải Phòng', BTB: /Thanh Hóa/.test(old) ? 'Thanh Hóa' : /Nghệ An|Hà Tĩnh/.test(old) ? 'Vinh' : 'Huế', NTB: /Đà Nẵng|Quảng Nam|Quảng Ngãi/.test(old) ? 'Đà Nẵng' : /Bình Định|Phú Yên/.test(old) ? 'Quy Nhơn' : 'Nha Trang', TN: /Lâm Đồng|Đắk Nông/.test(old) ? 'Đà Lạt' : 'Buôn Ma Thuột', DNB: 'Thủ Dầu Một', DBSCL: 'Cần Thơ' }[reg];
    var inCity = H.inBigCity(l);
    if (inCity) big = /Hà Nội/.test(l.movedTo || l.prov.old) ? 'Hà Nội' : 'TP. Hồ Chí Minh';
    return { big: big, local: local, inCity: inCity };
  }

  var CORE = {
    treat: {
      make: function (life, r) {
        var ill = life.ill, cost = Math.round(life.base * (life.gdp > 40 ? 0.15 : 1.1));
        return {
          id: 'treat', title: 'Bạn được chẩn đoán mắc ' + ill.n, data: { cost: cost },
          text: 'Bác sĩ nói cần điều trị sớm. Hiện bạn có ' + fmtMoney(life, life.money) + '. Bạn chọn cách nào?',
          opts: [opt('best', 'Điều trị tích cực ở bệnh viện lớn', 'Chi phí khoảng ' + fmtMoney(life, cost) + (life.money < cost ? ' — phải vay mượn' : '')),
            opt('basic', 'Điều trị ở cơ sở y tế gần nhà', 'Rẻ hơn, hiệu quả thấp hơn'),
            opt('none', 'Không điều trị, tự theo dõi', 'Không tốn tiền, nhưng rủi ro cao')]
        };
      },
      auto: function (life, d, r) { return life.money > d.data.cost * 0.4 || life.gdp > 40 ? 'best' : r() < 0.7 ? 'basic' : 'none'; },
      apply: function (life, d, k, r, log) {
        var ill = life.ill;
        if (!ill) return;
        if (k === 'best') { ill.mult = 1 + (ill.m - 1) * 0.3; ill.cure = Math.min(0.95, ill.base * 1.7); H.cash(life, -d.data.cost, 'Viện phí điều trị ' + ill.n); log('Bắt đầu điều trị ' + ill.n + ' ở bệnh viện tuyến trên.', 'neutral'); }
        else if (k === 'basic') { ill.mult = 1 + (ill.m - 1) * 0.6; ill.cure = ill.base; H.cash(life, -d.data.cost * 0.25, 'Chi phí chữa bệnh'); log('Điều trị ' + ill.n + ' ở cơ sở y tế gần nhà.', 'neutral'); }
        else { ill.mult = ill.m; ill.cure = ill.base * 0.3; log('Quyết định không điều trị ' + ill.n + '.', 'bad'); life.st.hap -= 4; }
        ill.treated = k;
        H.mem(life, 'Ngày bác sĩ báo tin bạn mắc ' + ill.n + '.', 3);
      }
    },
    hs: {
      make: function (life) {
        var vn = isVN(life);
        var o = [opt('thpt', vn ? 'Thi vào lớp 10, học tiếp THPT' : 'Học tiếp trung học phổ thông', vn ? 'Kiến thức càng cao, càng dễ đỗ trường công lập' : ''),
          opt('voc', 'Học trung cấp nghề', 'Ra trường sớm, có tay nghề'),
          opt('work', 'Nghỉ học, đi làm phụ giúp gia đình', 'Có thu nhập ngay')];
        return {
          id: 'hs', title: 'Học xong lớp 9 — đi tiếp con đường nào?',
          text: (vn ? 'Kỳ thi tuyển sinh vào lớp 10 sắp tới. ' : 'Bạn đã học xong bậc trung học cơ sở. ') + 'Gia đình bạn thuộc ' + QUINT[life.fam.q] + '.' + (life.flags.famHardship ? ' Nhà đang lúc khó khăn, bố mẹ nhìn bạn đầy lo lắng.' : ''),
          opts: o
        };
      },
      auto: function (life, d, r) { var p = eduP(life); var x = r(); return x < p.upper ? 'thpt' : x < p.upper + 0.15 ? 'voc' : 'work'; },
      apply: function (life, d, k, r, log) {
        if (k === 'thpt') {
          if (isVN(life)) {
            var pass = U.clamp(0.5 + (life.st.kno - 50) / 70 + (life.focus === 'study' ? 0.1 : 0), 0.15, 0.97);
            if (r() < pass) { life.school = 'upper'; life.schoolEnd = 18; log('Thi đỗ vào lớp 10 trường công lập.', 'good'); life.st.hap += 4; H.mem(life, 'Cầm giấy báo đỗ lớp 10, cả nhà mừng rơi nước mắt.', 2); }
            else if (life.fam.q >= 3) { life.school = 'priv'; life.schoolEnd = 18; log('Trượt nguyện vọng trường công, bố mẹ cho học trường tư thục.', 'bad'); life.st.hap -= 3; }
            else { life.school = 'voc'; life.schoolEnd = 18; log('Trượt lớp 10 công lập, nhà không đủ tiền học trường tư — chuyển sang học nghề.', 'bad'); life.st.hap -= 5; }
          } else { life.school = 'upper'; life.schoolEnd = 18; log('Tiếp tục học trung học phổ thông.', 'neutral'); }
        } else if (k === 'voc') { life.school = 'voc'; life.schoolEnd = 18; log('Vào học trung cấp nghề.', 'neutral'); }
        else { life.school = null; life.flags.needJob = true; log('Nghỉ học sau lớp 9 để đi làm phụ giúp gia đình.', 'bad'); life.st.hap -= 3; H.mem(life, 'Ngày cất cặp sách lên gác, nghỉ học đi làm khi mới 15 tuổi.', 3); life.pending.unshift(DEC.job.make(life, r)); }
      }
    },
    uni: {
      make: function (life, r) {
        var vn = isVN(life), P = uniPlaces(life), f = life.fam;
        var o = [];
        o.push(opt('uni_big', P.inCity ? 'Thi vào đại học ở ' + P.big : 'Lên ' + P.big + ' học đại học', 'Bằng cấp được trọng dụng hơn · chi phí cao · cạm bẫy nơi phố thị'));
        if (!P.inCity) o.push(opt('uni_local', 'Học đại học ở ' + P.local + ' (gần nhà)', 'Tiết kiệm, gần gia đình'));
        if (life.st.kno >= 45 && life.st.hea >= 55) o.push(opt('police', vn ? 'Thi vào trường Công an / Quân đội' : 'Vào học viện cảnh sát / quân đội', 'Ra trường có việc ổn định, kỷ luật nghiêm'));
        if (f.q >= 4 || life.st.kno >= 72) o.push(opt('abroad', 'Đi du học', f.q >= 4 ? 'Bố mẹ có điều kiện, hoặc săn học bổng' : 'Phải săn học bổng hoặc nhờ công ty du học'));
        o.push(opt('voc', 'Học cao đẳng / trường nghề', ''));
        o.push(opt('work', 'Đi làm kiếm tiền ngay', ''));
        if (life.flags.famHardship || /ruộng|nương|rẫy|chăn|cá|buôn/.test(f.fJob + f.mJob)) o.push(opt('home', 'Ở nhà phụ giúp bố mẹ', life.flags.famHardship ? 'Gia đình đang cần bạn' : 'Làm cùng bố mẹ'));
        if (life.sex === 'M' && CONSCRIPT.indexOf(life.country) >= 0) o.push(opt('military', 'Đi nghĩa vụ quân sự', '2 năm rèn luyện trong quân ngũ'));
        if (vn) o.push(opt('xkld', life.flags.famDebt ? 'Đi xuất khẩu lao động, kiếm tiền trả nợ cho nhà' : 'Đi xuất khẩu lao động', 'Thu nhập cao, xa nhà, tốn phí ban đầu'));
        var tries = life.flags.uniTries || 0; // v3.8: thi lại thì tiêu đề, lời kể theo đúng tuổi và số lần thi
        return { id: 'uni', title: tries ? 'Thi lại đại học — lần thứ ' + (tries + 1) : life.age <= 18 ? 'Mười tám tuổi — ngã rẽ đầu tiên của đời người' : 'Ngã rẽ sau phổ thông', data: { P: P },
          text: (tries ? 'Sau ' + (tries === 1 ? 'một năm' : tries + ' năm') + ' ôn thi lại' + (life.examScore != null ? ', điểm thi lần này của bạn là ' + U.fmtNum(life.examScore, 2) : '') + ', bạn lại đứng trước ngã rẽ.' : 'Bạn vừa học xong phổ thông.') + ' Bạn bè xung quanh mỗi người chọn một ngả.' + (life.flags.famDebt ? ' Nhà vẫn còn nợ nần chưa trả hết.' : '') + (P.inCity ? '' : ' Ở quê, ai cũng bảo phải lên ' + P.big + ' mới có tương lai.'), opts: o };
      },
      auto: function (life, d, r) {
        var p = eduP(life), ks = d.opts.map(function (o) { return o.k; });
        return U.wpick(r, ks, function (k) {
          return { uni_big: p.uni * (0.5 + life.tr.amb / 100) * 0.55, uni_local: p.uni * 0.45, police: 0.05, abroad: life.fam.q >= 5 ? 0.3 : 0.06, voc: 0.18,
            work: 0.25 * (1.2 - p.uni), home: life.flags.famHardship ? 0.15 : 0.04, military: 0.07, xkld: life.flags.famDebt ? 0.2 : 0.05 }[k] || 0.05;
        });
      },
      apply: function (life, d, k, r, log) {
        var P = d.data.P;
        if (k === 'uni_big' || k === 'uni_local') {
          var adm = U.clamp(0.2 + (life.st.kno - 50) / 60 + (life.focus === 'study' ? 0.1 : 0) + (life.fam.q - 3) * 0.04 - (k === 'uni_big' ? 0.08 : -0.05), 0.05, 0.95);
          // v2.3: có điểm thi tốt nghiệp THPT thì xét tuyển theo điểm chuẩn (trường lớn ~23 điểm, trường địa phương ~18 điểm)
          if (life.examScore != null) adm = U.clamp(0.5 + (life.examScore - (k === 'uni_big' ? 23 : 18)) / 4 + (life.fam.q - 3) * 0.02, 0.03, 0.97);
          var admitted = !!life.flags.tuyenThang || (life.examScore != null ? life.examScore >= (k === 'uni_big' ? 23 : 18) : life.st.kno >= 95 || r() < adm);
          if (admitted) {
            var city = k === 'uni_big' ? P.big : P.local;
            life.uniTier = k === 'uni_big' ? 1.15 : 1; life.uniCity = city;
            log('Đỗ đại học ở ' + city + '!', 'good'); life.st.hap += 6;
            H.mem(life, 'Ngày nhận giấy báo trúng tuyển đại học ở ' + city + '.', 3);
            if (k === 'uni_big' && !P.inCity) { life.cityStudent = { city: city, since: life.age }; if (isVN(life) && r() < 0.55) H.sched(life, 'ben_xe', 0); }
            life.pending.unshift(DEC.major.make(life));
          } else { log(life.examScore != null ? 'Điểm xét tuyển ' + U.fmtNum(life.examScore, 2) + ' chưa đạt mốc ' + (k === 'uni_big' ? 23 : 18) + ' của nhóm trường đã chọn.' : 'Chưa đạt yêu cầu xét tuyển của nhóm trường đã chọn.', 'bad'); life.st.hap -= 6; life.pending.unshift(DEC.uniFail.make(life)); }
        } else if (k === 'police') {
          var pass = U.clamp(0.15 + (life.st.kno - 45) / 70 + (life.st.hea - 60) / 120, 0.05, 0.85); var passOk = r() < pass;
          if (passOk && isVN(life) && E.DEC.chon_hoc_vien) { log('Đạt sơ tuyển vào các trường quân đội, công an (sức khỏe, lý lịch, điểm thi).', 'good'); life.pending.unshift(E.DEC.chon_hoc_vien.make(life, r)); } // v7.5: tự chọn trường
          else if (passOk) { life.school = 'police'; life.schoolEnd = life.age + 4; life.flags.policeTrack = r() < 0.6 ? 'cong_an' : 'quan_doi'; log('Đỗ vào ' + (life.flags.policeTrack === 'cong_an' ? (isVN(life) ? 'Học viện Cảnh sát nhân dân' : 'học viện cảnh sát') : (isVN(life) ? 'trường Sĩ quan Lục quân' : 'học viện quân sự')) + '.', 'good'); life.st.hap += 6; H.mem(life, 'Lần đầu khoác lên mình bộ quân phục học viên.', 3); }
          else { log('Trượt kỳ thi vào trường công an / quân đội.', 'bad'); life.st.hap -= 5; life.pending.unshift(DEC.uniFail.make(life)); }
        } else if (k === 'abroad') { H.chain(life, 'du_hoc'); }
        else if (k === 'voc') { life.school = 'voc'; life.schoolEnd = life.age + 2; log('Vào học cao đẳng nghề.', 'neutral'); }
        else if (k === 'xkld') { life.pending.unshift(DEC.xkld.make(life, r, true)); }
        else if (k === 'military') { life.flags.milDone = true; life.flags.military = life.age + 2; log('Lên đường nhập ngũ, thực hiện nghĩa vụ quân sự.', 'big'); H.mem(life, 'Buổi sáng tiễn bạn lên đường nhập ngũ, mẹ đứng khóc ở đầu ngõ.', 3); life.st.hea += 4; }
        else if (k === 'home') { life.job = { id: 'phu_giup', rank: 0, yrs: 0 }; life.indep = false; log('Ở nhà phụ giúp bố mẹ, gác lại giấc mơ giảng đường.', 'neutral'); life.st.hap -= 2; life.karma += 3; H.mem(life, 'Năm 18 tuổi, bạn ở lại quê phụ giúp bố mẹ.', 2); }
        else { life.flags.needJob = true; log('Bước vào đời, bắt đầu đi tìm việc.', 'neutral'); life.pending.unshift(DEC.job.make(life, r)); }
      }
    },
    uniFail: {
      make: function (life) {
        var tries = (life && life.flags.uniTries) || 0, more = tries < 2; // v3.8: ôn thi lại tối đa 2 lần (thi 3 lần), tránh kẹt mãi ở ngã rẽ này
        return { id: 'uniFail', title: 'Thi trượt — giờ sao?', text: 'Kết quả không như mong đợi.' + (tries ? ' Đây đã là lần thi thứ ' + (tries + 1) + '.' : '') + (more ? '' : ' Thi đến lần thứ ba vẫn chưa đỗ — đã đến lúc chọn một con đường khác: học nghề, đi làm, rồi học liên thông sau cũng được.'),
          opts: (more ? [opt('retry', 'Ôn thi lại một năm', 'Học thêm một năm, điểm thi thường cao hơn lần trước')] : []).concat([opt('voc', 'Học nghề', ''), opt('work', 'Đi làm', '')]) };
      },
      auto: function (life, d, r) { return r() < 0.3 && life.fam.q >= 3 && d.opts.some(function (o) { return o.k === 'retry'; }) ? 'retry' : r() < 0.5 ? 'voc' : 'work'; },
      apply: function (life, d, k, r, log) {
        if (k === 'retry') { if ((life.flags.uniTries || 0) >= 2) { life.flags.needJob = true; life.pending.unshift(DEC.job.make(life, r)); return; } life.flags.uniTries = (life.flags.uniTries || 0) + 1; life.flags.retryUni = life.age + 1; life.st.kno = U.clamp(life.st.kno + 4, 0, 100); life.flags.retryExamPending = true; log('Quyết định ôn thi lại một năm. Kết quả sẽ có sau kỳ thi năm tới.', 'neutral'); }
        else if (k === 'voc') { life.school = 'voc'; life.schoolEnd = life.age + 2; log('Vào học trường nghề.', 'neutral'); }
        else { life.flags.needJob = true; log('Đi làm kiếm sống.', 'neutral'); life.pending.unshift(DEC.job.make(life, r)); }
      }
    },
    major: {
      make: function (life) {
        var ks = Object.keys(MAJORS), K = KHOI[life.khoi];
        return { id: 'major', title: 'Chọn ngành học', text: 'Bạn muốn học ngành gì?' + (K ? ' Bạn thi khối ' + life.khoi + ' (' + K.n + ').' : ''),
          opts: ks.map(function (k) { return opt(k, MAJORS[k], (k === 'med' ? 'Học 6 năm' : 'Học 4 năm') + (K ? (K.m.indexOf(k) >= 0 ? ' · hợp khối ' + life.khoi : ' · trái khối, khó theo hơn') : '')); }) };
      },
      auto: function (life, d, r) {
        var t = life.talent, K = KHOI[life.khoi];
        return U.wpick(r, Object.keys(MAJORS), function (k) {
          var w = { it: 3, eco: 3, med: 1.5, edu: 1.5, law: 1.2, art: 0.8 }[k];
          if (K) w *= K.m.indexOf(k) >= 0 ? 4 : 0.3;
          if ((t === 'toán học' && k === 'it') || ((t === 'hội họa' || t === 'âm nhạc' || t === 'làm đẹp' || t === 'diễn xuất') && k === 'art') || (t === 'ăn nói' && k === 'law') || ((t === 'ngoại ngữ' || t === 'kinh doanh') && k === 'eco')) w *= 3;
          return w;
        });
      },
      apply: function (life, d, k, r, log) {
        life.major = k; life.majorName = null; life.school = life.abroad && life.abroad.study ? 'abroad' : 'uni'; life.schoolEnd = life.age + (k === 'med' ? 6 : 4);
        if (KHOI[life.khoi] && KHOI[life.khoi].m.indexOf(k) < 0) { life.st.kno -= 3; life.st.hap -= 2; log('Học trái khối — những năm đầu phải học bù vất vả.', 'neutral'); }
        if (life.abroad && life.abroad.study) life.abroad.until = life.schoolEnd;
        if (life.job) { life.job = null; }
        log('Nhập học ngành ' + MAJORS[k] + (life.uniCity ? ' ở ' + life.uniCity : '') + '.', 'good');
      }
    },
    post: {
      make: function () { return { id: 'post', title: 'Học tiếp sau đại học?', text: 'Thầy hướng dẫn khuyên bạn học thạc sĩ.', opts: [opt('yes', 'Học thạc sĩ', '2 năm nữa'), opt('no', 'Đi làm luôn', '')] }; },
      auto: function (life, d, r) { return r() < 0.35 ? 'yes' : 'no'; },
      apply: function (life, d, k, r, log) {
        if (k === 'yes') { life.school = 'post'; life.schoolEnd = life.age + 2; log('Bắt đầu học thạc sĩ.', 'good'); }
        else life.flags.needJob = true;
      }
    },
    job: {
      make: function (life, r) {
        var offers = E.offers(life, r);
        var has = !!life.job;
        return { id: 'job', title: has ? 'Cơ hội đổi việc' : 'Tìm việc làm',
          text: (has ? 'Bạn có thể tìm việc tốt hơn công việc ' + jobTitle(life) + ' hiện tại.' : (life.record ? 'Với tiền án trong hồ sơ, tìm việc chẳng dễ dàng. ' : '') + 'Bạn có vài lựa chọn công việc') + ' (' + (life.urban ? 'ở ' + (life.city || 'thành phố') : 'gần nhà') + ').',
          data: { offers: offers },
          opts: offers.map(function (id) { return opt(id, U.cap(E.offerLabel ? E.offerLabel(life, id) : E.jobLabel(id)), E.offerHint(life, id)); })
            .concat([opt('none', has ? 'Giữ công việc hiện tại' : 'Chưa nhận, tiếp tục tìm', '')]) };
      },
      auto: function (life, d, r) { return U.wpick(r, d.data.offers, function (id) { return E.offerAI(life, id); }); },
      apply: function (life, d, k, r, log) {
        life.flags.upgradeJob = false;
        if (k === 'none') {
          if (life.job) log('Quyết định gắn bó với công việc hiện tại.', 'neutral');
          else { log('Chưa tìm được công việc ưng ý.', 'neutral'); life.flags.needJob = true; }
          return;
        }
        E.startJob(life, k, r, log);
      }
    },
    love: {
      make: function (life, r, arg) {
        var ps = H.partnerSex(life, r);
        var age = U.clamp(life.age + U.randint(r, -3, 5) + (ps === 'M' && life.sex === 'F' ? 2 : 0), 16, 95);
        var nm = H.stranger(life, r, ps); // v7.4.1: không trùng tên người thân, bạn bè, người yêu cũ, người đã mất
        var desc = U.pick(r, ['vui tính', 'trầm tính', 'chăm chỉ', 'hay cười', 'tốt bụng', 'thẳng thắn', 'lãng mạn', 'thực tế', 'có đôi mắt biết cười', 'nấu ăn rất ngon']);
        var where = (arg && arg.where) || U.pick(r, life.age >= 60 ? ['qua con cháu giới thiệu', 'ở câu lạc bộ dưỡng sinh', 'trong một chuyến đi của hội người cao tuổi', 'ở chùa / nhà thờ', 'qua bạn bè cũ'] : life.age >= 40 ? ['qua bạn bè giới thiệu', 'ở chỗ làm', 'trên mạng xã hội', 'trong một đám cưới', 'trong một chuyến đi', 'ở lớp học nấu ăn', 'ở quán cà phê quen'] : life.school ? ['qua bạn bè giới thiệu', 'ở trường', 'trên mạng xã hội', 'ở lớp học thêm', 'trong một chuyến đi', 'ở quán cà phê quen'] : ['qua bạn bè giới thiệu', 'ở chỗ làm', 'trên mạng xã hội', 'trong một đám cưới', 'trong một chuyến đi', 'ở quán cà phê quen']);
        var p = { name: nm, sex: ps, age: age, desc: desc };
        return { id: 'love', title: 'Một người đặc biệt', data: { p: p },
          text: 'Bạn quen ' + nm + ' (' + (ps === 'M' ? 'nam' : 'nữ') + ', ' + age + ' tuổi) ' + where + '. Một người ' + desc + '.',
          opts: [opt('yes', 'Tìm hiểu nhau', ''), opt('no', 'Chỉ làm bạn', '')] };
      },
      auto: function (life, d, r) { return r() < 0.75 ? 'yes' : 'no'; },
      apply: function (life, d, k, r, log) {
        var p = d.data.p;
        if (k === 'yes') {
          life.partner = { name: p.name, sex: p.sex, age: p.age, status: 'dating', since: life.age, alive: true };
          if (!life.flags.everDated) { life.flags.everDated = true; if (!life.flags.firstLove) life.flags.firstLove = p.name; } // v3.0: người yêu đầu tiên chính là mối tình đầu
          log('Bắt đầu hẹn hò với ' + p.name + (life.flags.firstLove === p.name && !life.exes ? ' — mối tình đầu của bạn' : '') + '.', 'good'); life.st.hap += 6;
          H.mem(life, 'Buổi hẹn đầu tiên với ' + p.name + '.', 3);
        } else log('Bạn và ' + p.name + ' chỉ dừng lại ở mức bạn bè.', 'neutral');
      }
    },
    marry: {
      make: function (life) {
        var p = life.partner, same = p.sex === life.sex, legal = sameSexLegal(life);
        var t = 'Đã ' + Math.max(1, life.age - p.since) + ' năm bên ' + p.name + '.';
        var o, wc = isVN(life) ? ' Một đám cưới ở quê tốn khoảng ' + H.mb(life, 0.6) + ', tiền mừng thu lại được phần nào.' : '';
        if (same && !legal) {
          t += isVN(life) ? ' Pháp luật Việt Nam hiện chưa công nhận hôn nhân cùng giới, nhưng hai bạn vẫn có thể về chung một nhà.' : ' Nơi bạn sống chưa công nhận hôn nhân cùng giới.';
          o = [opt('marry', 'Về chung sống với nhau', 'Không có giấy đăng ký kết hôn'), opt('wait', 'Chưa vội', ''), opt('split', 'Chia tay', '')];
        } else o = [opt('marry', 'Tổ chức đám cưới', 'Chi phí cưới hỏi'), opt('small', 'Đăng ký kết hôn, cưới nhỏ', 'Tiết kiệm'), opt('wait', 'Chưa vội', ''), opt('split', 'Chia tay', '')];
        return { id: 'marry', title: 'Tiến tới hôn nhân?', text: t + wc, opts: o };
      },
      auto: function (life, d, r) { var x = r(); return x < 0.45 ? 'marry' : x < 0.55 && d.opts.some(function (o) { return o.k === 'small'; }) ? 'small' : x < 0.88 ? 'wait' : 'split'; },
      apply: function (life, d, k, r, log) {
        var p = life.partner;
        if (k === 'marry' || k === 'small') {
          var same = p.sex === life.sex, legal = sameSexLegal(life);
          p.status = same && !legal ? 'cohabit' : 'married'; p.since = life.age;
          if (p.status === 'married') {
            if (k === 'marry') { H.cash(life, -life.base * 0.6, 'Tổ chức đám cưới'); H.cash(life, life.base * (0.3 + r() * 0.4), 'Tiền mừng cưới'); }
            log((k === 'marry' ? (isVN(life) ? 'Tổ chức đám cưới với ' : 'Kết hôn với ') : 'Đăng ký kết hôn, làm vài mâm cơm thân mật với ') + p.name + '.', 'big');
          } else log('Về chung sống với ' + p.name + '. Một đám cưới nhỏ chỉ có bạn bè thân.', 'big');
          life.st.hap += 10; life.st.soc += 5;
          H.mem(life, p.status === 'cohabit' ? 'Ngày cùng ' + p.name + ' dọn về chung một nhà — chìa khóa có hai cái tên.' : 'Ngày cưới ' + p.name + ' — bạn cười không ngớt.', 5);
        } else if (k === 'split') { log('Chia tay ' + p.name + '.', 'bad'); life.partner = null; life.exes++; life.st.hap -= 8; }
        else { life.flags.marryWait = (life.flags.marryWait || 0) + 1; log(life.flags.marryWait >= 2 ? 'Vẫn chưa sẵn sàng — hai bạn cứ yêu nhau thêm một thời gian nữa.' : 'Hai bạn quyết định chưa vội.', 'neutral'); } // v3.0: càng hoãn thì càng lâu mới hỏi lại
      }
    },
    kid: {
      make: function (life) {
        var p = life.partner, same = p.sex === life.sex;
        var canBirth = !same && (life.sex === 'F' ? life.age <= 45 : p.age <= 45);
        return { id: 'kid', title: same ? 'Làm cha mẹ?' : 'Có thêm em bé?', data: { adopt: !canBirth },
          text: (life.kids.length ? 'Hai bạn đã có ' + life.kids.length + ' con.' : 'Hai bạn chưa có con.') + ' Nuôi một đứa trẻ tốn khoảng ' + fmtMoney(life, life.base * 0.2) + ' mỗi năm.',
          opts: [opt('yes', canBirth ? 'Sinh thêm một em bé' : 'Nhận nuôi một đứa trẻ', ''), opt('no', 'Chưa / không muốn', '')] };
      },
      auto: function (life, d, r) {
        var want = life.flags.wantKids != null ? life.flags.wantKids : (life.flags.wantKids = Math.max(0, Math.round(life.tfr + U.normal(r) * 0.9)));
        if (d.data.adopt) return r() < 0.25 && life.kids.length < Math.max(1, want) ? 'yes' : 'no';
        return life.kids.length < want ? 'yes' : (r() < 0.08 ? 'yes' : 'no');
      },
      apply: function (life, d, k, r, log) {
        if (k !== 'yes') { life.flags.kidNo = (life.flags.kidNo || 0) + 1; life.flags.noKidUntil = life.age + 2 + Math.min(8, life.flags.kidNo * 2); return; } // v3.0: đã từ chối nhiều lần thì lâu mới hỏi lại
        var p = life.partner;
        if (!p) return;
        var cs = r() < 0.512 ? 'M' : 'F';
        var sur = null;
        if (life.sex === 'M' || p.sex === life.sex) sur = life.sur;
        else if (life.pool === 'vn' && life.ethStyle !== 'tn') sur = p.name.split(' ')[0];
        var nm = makeName(life, r, cs, sur).full;
        var vac = life.fam.q >= 3 || life.money > life.base * 0.3 || r() < 0.6;
        life.kids.push({ name: nm, sex: cs, born: life.age, alive: true, adopted: !!d.data.adopt, married: false, kids: 0, vac: vac });
        if (d.data.adopt) log('Nhận nuôi bé ' + nm + '.', 'big');
        else { log('Chào đón ' + (cs === 'M' ? 'con trai' : 'con gái') + ' ' + nm + ' chào đời.', 'big'); if (life.sex === 'F') life.flags.gaveBirth = true; }
        H.mem(life, 'Lần đầu bế ' + nm + ' trên tay.', 5);
        life.st.hap += 8;
      }
    },
    city: {
      make: function (life, r) {
        var dest;
        if (isVN(life)) {
          var reg = life.region;
          dest = reg === 'MNPB' || reg === 'DBSH' ? U.pick(r, ['Hà Nội', 'Hà Nội', 'Bắc Ninh', 'Hải Phòng']) :
            reg === 'BTB' ? U.pick(r, ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng']) :
              reg === 'NTB' || reg === 'TN' ? U.pick(r, ['TP. Hồ Chí Minh', 'Đà Nẵng', 'TP. Hồ Chí Minh']) :
                U.pick(r, life.variant === '63' ? ['TP. Hồ Chí Minh', 'Bình Dương', 'Đồng Nai', 'Cần Thơ'] : ['TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Đồng Nai', 'Cần Thơ']);
        } else dest = W.BY[life.country].cities[0];
        return { id: 'city', title: 'Lên ' + dest + ' lập nghiệp?', data: { dest: dest },
          text: 'Ở quê ít việc làm. Nhiều người cùng trang lứa đã lên ' + dest + ' — thu nhập cao hơn, nhưng chi phí cũng đắt đỏ hơn.',
          opts: [opt('go', 'Khăn gói lên ' + dest, ''), opt('stay', 'Ở lại quê', '')] };
      },
      auto: function (life, d, r) { return r() < (life.fam.q <= 3 ? 0.55 : 0.35) ? 'go' : 'stay'; },
      apply: function (life, d, k, r, log) {
        life.flags.cityAsked = true;
        if (k !== 'go') { log('Quyết định bám trụ ở quê.', 'neutral'); return; }
        moveToCity(life, d.data.dest);
        if (life.job && /^(nong|ngu_dan|farm|fish|phu_giup)$/.test(life.job.id)) life.job = null;
        if (!life.job) life.flags.needJob = true;
        log('Khăn gói lên ' + d.data.dest + ' lập nghiệp, ở trọ trong một căn phòng nhỏ.', 'big'); life.st.soc -= 5;
        H.mem(life, 'Chuyến xe đêm lên ' + d.data.dest + ' với một chiếc ba lô và rất nhiều hy vọng.', 3);
        if (isVN(life) && r() < 0.5) H.sched(life, 'ben_xe', 0);
      }
    },
    xkld: {
      make: function (life, r, fromUni) {
        var c = U.wpick(r, [['JP', 'Nhật Bản', 'thực tập sinh kỹ năng', 3.6, 160], ['KR', 'Hàn Quốc', 'lao động theo chương trình EPS', 4.2, 100], ['TW', 'Đài Loan', 'lao động nhà máy', 3.0, 120], ['DE', 'Đức', 'điều dưỡng viên', 5, 200]],
          function (x) { return { JP: 5, KR: 2, TW: 4, DE: 0.6 }[x[0]]; });
        return { id: 'xkld', title: 'Đi xuất khẩu lao động ' + c[1] + '?', data: { c: c },
          text: 'Một công ty môi giới giới thiệu suất đi ' + c[1] + ' làm ' + c[2] + ' trong 3 năm. Phí ban đầu khoảng ' + fmtMoney(life, c[4]) + '.',
          opts: [opt('go', 'Đi ' + c[1], 'Thu nhập gấp nhiều lần ở quê'), opt('check', 'Tìm hiểu kỹ công ty môi giới trước', 'Chậm hơn nhưng an toàn hơn'), opt('no', 'Ở lại Việt Nam', '')] };
      },
      auto: function (life, d, r) { var x = r(); return x < 0.25 ? 'go' : x < 0.45 ? 'check' : 'no'; },
      apply: function (life, d, k, r, log) {
        life.flags.xkldAsked = true;
        var c = d.data.c;
        if (k === 'no') { log('Từ chối lời mời đi ' + c[1] + '.', 'neutral'); if (!life.job && !life.school) life.flags.needJob = true; return; }
        if (k === 'go' && r() < 0.15) {
          H.cash(life, -c[4] * 0.6, 'Mất tiền cọc cho công ty môi giới ma');
          log('Đóng tiền cọc rồi mới phát hiện công ty môi giới là lừa đảo — mất trắng ' + fmtMoney(life, c[4] * 0.6) + '.', 'bad');
          H.fx(life, { hap: -10 }); H.mem(life, 'Ngày biết mình bị công ty xuất khẩu lao động ma lừa mất tiền.', 3);
          if (!life.job) life.flags.needJob = true;
          return;
        }
        H.cash(life, -c[4], 'Phí xuất khẩu lao động');
        life.abroad = { code: c[0], name: c[1], until: life.age + 3, mult: c[3], perm: false };
        life.prevJob = life.job; life.school = null;
        life.job = { id: 'xkld', rank: 0, yrs: 0, t: c[2] + ' ở ' + c[1] }; life.indep = true; life.flags.needJob = false;
        log((life.money < 0 ? 'Vay tiền đóng phí, sang ' : 'Sang ') + c[1] + ' làm ' + c[2] + '.', 'big'); life.st.soc -= 8; life.st.hap -= 2;
        // v2.4: tiếng bản xứ — có chứng chỉ sẵn thì được đơn hàng tốt hơn, chưa có thì phải học cấp tốc trước khi bay
        var lk = { JP: 'ja', KR: 'ko', TW: 'zh', DE: 'de' }[c[0]];
        if (lk && H.LANG) {
          life.lang = life.lang || {};
          if ((life.lang[lk] || 0) >= 2) { life.abroad.mult *= 1.1; log('Nhờ có sẵn ' + H.langCert(life, lk) + ', bạn được chọn vào đơn hàng lương cao hơn.', 'good'); }
          else { life.lang[lk] = Math.max(life.lang[lk] || 0, 1); log('Trước khi bay, học tiếng cấp tốc 6 tháng ở trung tâm và thi đỗ ' + H.langCert(life, lk) + '.', 'neutral'); }
        }
        H.visit(life, c[1]);
        H.mem(life, 'Ở sân bay Nội Bài, ngoái lại nhìn gia đình lần cuối trước khi sang ' + c[1] + '.', 4);
      }
    },
    emig: {
      make: function (life, r) {
        var pool = life.pool, opts = [['US', 'Hoa Kỳ', 'en'], ['DE', 'Đức', 'de'], ['GB', 'Vương quốc Anh', 'en'], ['CA', 'Canada', 'en'], ['AU', 'Úc', 'en']];
        if (/es_la/.test(pool)) opts = [['US', 'Hoa Kỳ', 'en'], ['ES', 'Tây Ban Nha', 'es']];
        if (/afr|ht/.test(pool)) opts = [['FR', 'Pháp', 'fr'], ['BE', 'Bỉ', 'fr'], ['CA', 'Canada', 'fr']];
        if (/in|pk|bd|np|lk|ph/.test(pool)) opts = [['AE', 'UAE', 'ar'], ['SA', 'Ả Rập Xê Út', 'ar'], ['GB', 'Vương quốc Anh', 'en'], ['US', 'Hoa Kỳ', 'en']];
        if (/ca|tj|az|ua/.test(pool)) opts = [['RU', 'Nga', 'ru'], ['PL', 'Ba Lan', 'pl'], ['DE', 'Đức', 'de']];
        if (/ar|af|fa|so|et/.test(pool)) opts = [['DE', 'Đức', 'de'], ['SE', 'Thụy Điển', 'nord'], ['FR', 'Pháp', 'fr'], ['SA', 'Ả Rập Xê Út', 'ar']];
        var c = U.pick(r, opts);
        return { id: 'emig', title: 'Di cư sang ' + c[1] + '?', data: { c: c },
          text: 'Có một cơ hội làm việc và định cư ở ' + c[1] + '. Bắt đầu lại từ đầu ở một nơi xa lạ.',
          opts: [opt('go', 'Đi ' + c[1], ''), opt('no', 'Ở lại quê hương', '')] };
      },
      auto: function (life, d, r) { return r() < 0.35 ? 'go' : 'no'; },
      apply: function (life, d, k, r, log) {
        life.flags.emigAsked = true;
        if (k !== 'go') { log('Quyết định ở lại ' + life.countryName + '.', 'neutral'); return; }
        emigrate(life, d.data.c, r, log);
      }
    },
    out: {
      make: function (life) {
        return { id: 'out', title: 'Công khai với gia đình?', text: 'Bạn biết mình là người ' + orientLabel(life).toLowerCase() + '. Gia đình vẫn chưa biết.',
          opts: [opt('yes', 'Nói thật với bố mẹ', 'Họ có thể không đón nhận ngay'), opt('no', 'Chưa sẵn sàng', '')] };
      },
      auto: function (life, d, r) { return r() < 0.45 ? 'yes' : 'no'; },
      apply: function (life, d, k, r, log) {
        if (k !== 'yes') { life.flags.outAskedAt = life.age; return; }
        life.out = true;
        var acc = W.SSM.indexOf(resCode(life)) >= 0 ? 0.75 : W.CRIM.indexOf(resCode(life)) >= 0 ? 0.2 : isVN(life) ? 0.55 : 0.45;
        if (r() < acc) { log('Công khai xu hướng tính dục với gia đình. Bố mẹ ôm bạn vào lòng.', 'good'); life.st.hap += 10; life.st.soc += 4; H.mem(life, 'Cái ôm của bố mẹ ngày bạn dám sống thật với chính mình.', 5); }
        else { log('Công khai với gia đình. Bố mẹ sốc và cần thời gian để chấp nhận.', 'bad'); life.st.hap -= 6; life.flags.famTension = true; H.mem(life, 'Bữa cơm im lặng sau ngày bạn công khai với gia đình.', 4); }
      }
    },
    house: {
      make: function (life) {
        var price = housePrice(life), can = H.canBankLoan(life);
        var o = [];
        if (life.money >= price) o.push(opt('cash', 'Mua bằng tiền tích lũy', ''));
        else if (!H.loanAgeOk(life, 'home')) o.push(opt('old', 'Thử vay ngân hàng', 'Ngân hàng hiếm khi cho người trên 65 tuổi vay mua nhà')); // v2.4
        else if (can) o.push(opt('buy', 'Vay ngân hàng để mua', 'Trả góp nhiều năm'));
        else o.push(opt('denied', 'Thử vay ngân hàng', 'Hồ sơ đang có nợ xấu'));
        o.push(opt('no', 'Tiếp tục thuê / ở cùng gia đình', ''));
        return { id: 'house', title: 'Mua nhà?', data: { price: price },
          text: 'Một căn nhà phù hợp có giá khoảng ' + fmtMoney(life, price) + '. Bạn có ' + fmtMoney(life, life.money) + '.', opts: o };
      },
      auto: function (life, d, r) { return d.opts.some(function (o) { return o.k === 'cash'; }) ? (r() < 0.75 ? 'cash' : 'no') : d.opts.some(function (o) { return o.k === 'buy'; }) && r() < 0.65 ? 'buy' : 'no'; },
      apply: function (life, d, k, r, log) {
        if (k === 'no') { life.flags.houseNo = life.age + 3; return; }
        if (k === 'denied') { log('Ngân hàng từ chối cho vay mua nhà vì bạn có tên trong danh sách nợ xấu (CIC).', 'bad'); life.st.hap -= 5; life.flags.houseNo = life.age + 3; return; }
        if (k === 'old') { log('Ngân hàng từ chối: tuổi đã cao, thời hạn vay không đủ để trả góp.', 'neutral'); life.flags.houseNo = life.age + 5; return; }
        var price = d.data.price;
        if (k === 'cash') H.cash(life, -price, 'Mua nhà');
        else {
          var down = Math.max(0, Math.min(life.money, price * 0.3));
          H.cash(life, -price, 'Mua nhà');
          H.addLoan(life, 'home', price - down);
        }
        life.ownHouse = true; life.houseVal = price;
        log('Mua được căn nhà của riêng mình' + (k === 'buy' ? ' (vay ngân hàng, trả góp nhiều năm)' : '') + '.', 'big'); life.st.hap += 8;
        H.mem(life, 'Ngày nhận chìa khóa căn nhà đầu tiên của mình.', 5);
      }
    },
    biz: {
      make: function (life, r) {
        var cost = Math.round(life.base * 1.2);
        var prod = U.pick(r, isVN(life) ? ['quán cà phê', 'quán ăn', 'shop quần áo', 'cửa hàng nước hoa', 'đại lý đồ nhựa', 'cửa hàng vật liệu xây dựng', 'tiệm trà sữa', 'xưởng gỗ nội thất'] : ['quán ăn', 'cửa hàng tiện lợi', 'tiệm sửa chữa', 'shop quần áo', 'xưởng nhỏ']);
        return { id: 'biz', title: 'Tự kinh doanh?', data: { cost: cost, prod: prod },
          text: 'Bạn có ý định mở ' + prod + ' của riêng mình, vốn khoảng ' + fmtMoney(life, cost) + '.',
          opts: [opt('go', 'Liều một phen', 'Có thể thành công lớn hoặc mất vốn'), opt('no', 'Giữ công việc ổn định', '')] };
      },
      auto: function (life, d, r) { return aiW(life, { w: 0.5, risk: 1, amb: 1 }) > r() * 1.6 ? 'go' : 'no'; },
      apply: function (life, d, k, r, log) {
        life.flags.bizAsked = (life.flags.bizAsked || 0) + 1;
        if (k !== 'go') return;
        H.cash(life, -d.data.cost, 'Vốn mở ' + d.data.prod);
        if (r() < 0.3 + life.st.kno / 400 + (life.talent === 'ăn nói' || life.talent === 'kinh doanh' ? 0.12 : 0)) {
          life.job = { id: /xưởng/.test(d.data.prod) ? 'chu_xuong' : /quán|tiệm trà/.test(d.data.prod) ? 'kd_quan' : 'kd_tu_do', rank: 0, yrs: 0, p: d.data.prod }; log('Mở ' + d.data.prod + ' — làm ăn khấm khá.', 'good'); life.st.hap += 6;
          H.mem(life, 'Ngày khai trương ' + d.data.prod + ' của riêng mình.', 4);
        } else { log('Mở ' + d.data.prod + ' nhưng thua lỗ, phải đóng cửa sau một năm.', 'bad'); life.st.hap -= 8; H.cash(life, -d.data.cost * 0.3, 'Thua lỗ kinh doanh'); }
      }
    },
    divorce: {
      make: function (life) {
        return { id: 'divorce', title: 'Hôn nhân rạn nứt', text: 'Bạn và ' + life.partner.name + ' cãi vã triền miên' + (life.money < 0 ? ', phần nhiều vì chuyện tiền bạc' : '') + '.',
          opts: [opt('fix', 'Cố gắng hàn gắn', ''), opt('div', 'Chia tay / ly hôn', '')] };
      },
      auto: function (life, d, r) { return r() < 0.6 ? 'fix' : 'div'; },
      apply: function (life, d, k, r, log) {
        if (k === 'fix') {
          if (r() < 0.65) { log('Hai người ngồi lại với nhau và vượt qua giai đoạn khó khăn.', 'good'); life.st.hap += 3; }
          else { log('Cố gắng hàn gắn nhưng không thành, hai người ly thân.', 'bad'); endPartner(life, log, 'div'); }
        } else endPartner(life, log, 'div');
      }
    },
    care: {
      make: function (life) {
        var who = life.fam.mAlive ? 'Mẹ' : 'Bố';
        return { id: 'care', title: who + ' đã già yếu', data: { who: who }, text: who + ' bạn đã ngoài 70, tóc bạc trắng, đi lại chậm chạp và cần người chăm sóc.',
          opts: [opt('yes', 'Đón ' + who.toLowerCase() + ' về ở cùng chăm sóc', 'Tốn thời gian & tiền bạc'), opt('no', H.sibs && H.sibs(life).length ? 'Gửi tiền về / nhờ anh chị em' : 'Gửi tiền về, thuê người chăm sóc', '')] };
      },
      auto: function (life, d, r) { return r() < 0.7 ? 'yes' : 'no'; },
      apply: function (life, d, k, r, log) {
        life.flags.careDone = true;
        if (!(d.data.who === 'Mẹ' ? life.fam.mAlive : life.fam.fAlive)) return; // v3.4: bố/mẹ đã mất trước khi kịp quyết định
        if (k === 'yes') { log('Đón ' + d.data.who.toLowerCase() + ' về ở cùng để chăm sóc.', 'good'); life.st.soc += 5; life.st.hap += 2; H.cash(life, -life.base * 0.15, 'Chăm sóc ' + d.data.who.toLowerCase()); life.flags.caring = true; life.flags.caredParents = true; life.karma += 5; H.mem(life, 'Những buổi tối ngồi bóp chân cho ' + d.data.who.toLowerCase() + '.', 4); }
        else { log('Gửi tiền chu cấp cho ' + d.data.who.toLowerCase() + ' hằng tháng.', 'neutral'); H.cash(life, -life.base * 0.1, 'Chu cấp cho ' + d.data.who.toLowerCase()); }
      }
    }
  };
  Object.keys(CORE).forEach(function (k) { DEC[k] = CORE[k]; });

  function moveToCity(life, dest) {
    life.urban = true; life.movedTo = dest; life.place = dest; life.city = dest;
    if (isVN(life)) { var p = VN.byName[dest] || VN.byName['TP. Hồ Chí Minh']; life.cityWealth = p.wealth; }
    setBase(life);
  }
  function emigrate(life, c, r, log) {
    var oldCountry = life.abroad && W.BY[life.abroad.code];
    var oldGdp = oldCountry ? oldCountry.gdp : life.gdp;
    var cc = W.BY[c[0]];
    life.abroad = { code: c[0], name: c[1], perm: true, pool: c[2], base: cc.gdp * 1000 * 0.55 * 0.75 };
    life.urban = true; life.place = cc.cities[U.randint(r, 0, Math.min(3, cc.cities.length - 1))]; life.city = life.place;
    if (life.ownHouse) { // bán nhà trước khi đi, trả nợ vay mua nhà
      var homeDebt = (life.loans || []).filter(function (x) { return x.type === 'home'; }).reduce(function (s, x) { return s + x.bal; }, 0) + (life.mortgage || 0);
      life.money += life.houseVal - homeDebt; life.houseVal = 0; life.ownHouse = false; life.mortgage = 0;
      life.loans = (life.loans || []).filter(function (x) { return x.type !== 'home'; });
    }
    if (life.cur === 'vnd') {
      var fx2 = 1e6 / C.VND / C.priceLevel(cc.gdp);
      life.cur = 'usd';
      E.abroadConvert(life, fx2);
    } else {
      E.abroadConvert(life, C.priceLevel(oldGdp) / C.priceLevel(cc.gdp));
    }
    setBase(life);
    if (life.job) life.job = { id: E.resolveJob(life.job.id) === 'nong' ? 'phu_ho' : E.resolveJob(life.job.id), rank: 0, yrs: 0 };
    else life.flags.needJob = true;
    log('Di cư sang ' + c[1] + ', sống ở ' + life.place + '.', 'big'); life.st.soc -= 10;
    H.mem(life, 'Ngày đặt chân đến ' + life.place + ', ' + c[1] + ' — một khởi đầu mới.', 4);
  }
  H.moveToCity = moveToCity; H.emigrate = emigrate; H.setBase = setBase;

  function endPartner(life, log, how) {
    var p = life.partner;
    if (how === 'div') {
      log((p.status === 'married' ? 'Ly hôn với ' : 'Chia tay ') + p.name + ' sau ' + Math.max(1, life.age - p.since) + ' năm.', 'bad');
      life.exes++; life.st.hap -= 10;
      if (life.ownHouse) { life.houseVal *= 0.5; life.mortgage = (life.mortgage || 0) * 0.5; (life.loans || []).forEach(function (x) { if (x.type === 'home') x.bal *= 0.5; }); }
      life.money *= 0.6;
      H.mem(life, 'Ngày ký đơn ly hôn với ' + p.name + '.', 4);
    }
    life.partner = null;
  }
  H.endPartner = endPartner;

  function housePrice(life) {
    if (life.cur === 'vnd') return Math.round((life.urban ? 2600 : 700) * (life.cityWealth || life.wealthIdx));
    return Math.round(life.base * (life.urban ? 6 : 3.5));
  }
  H.housePrice = housePrice;

  // ---------- Thú cưng ----------
  // life: tuổi thọ (năm) · cost: chi phí nuôi mỗi năm (× thu nhập cơ sở) · hap: niềm vui mỗi năm · price: giá mua theo giống (× thu nhập cơ sở)
  var PETS = {
    'chó': { life: [11, 15], cost: 0.045, hap: 3, br: { 'chó ta': 0, 'chó Phú Quốc': 0.06, 'Poodle': 0.05, 'Corgi': 0.12, 'Husky': 0.08, 'Alaska': 0.1, 'Phốc sóc': 0.05, 'Golden': 0.1 } },
    'mèo': { life: [12, 18], cost: 0.035, hap: 3, br: { 'mèo ta': 0, 'mèo mướp': 0, 'mèo Anh lông ngắn': 0.06, 'mèo Ba Tư': 0.07, 'mèo Xiêm': 0.04 } },
    'cá cảnh': { life: [3, 8], cost: 0.008, hap: 1, br: { 'cá vàng': 0.002, 'cá betta': 0.002, 'cá koi': 0.03, 'cá rồng': 0.2 } },
    'chim': { life: [6, 14], cost: 0.012, hap: 2, br: { 'chim chào mào': 0.01, 'chim yến phụng': 0.004, 'vẹt': 0.05 } },
    'hamster': { life: [2, 3], cost: 0.008, hap: 2, br: { 'hamster': 0.002 } },
    'thỏ': { life: [7, 10], cost: 0.012, hap: 2, br: { 'thỏ': 0.005 } },
    'rùa': { life: [25, 50], cost: 0.004, hap: 1, br: { 'rùa tai đỏ': 0.002 } }
  };
  var PET_NAMES = { vn: ['Lu', 'Mực', 'Vàng', 'Bông', 'Mít', 'Na', 'Đốm', 'Miu', 'Bơ', 'Sữa', 'Ki', 'Cún', 'Mướp', 'Bi', 'Su', 'Xoài', 'Tôm', 'Lucky', 'Bin', 'Gạo', 'Kem', 'Nếp'], w: ['Max', 'Luna', 'Bella', 'Milo', 'Coco', 'Charlie', 'Kiki', 'Simba', 'Lucy', 'Rocky', 'Daisy', 'Oscar'] };
  function petName(l, r) { return U.pick(r, isVN(l) ? PET_NAMES.vn : PET_NAMES.w.concat(PET_NAMES.vn.slice(0, 6))); }
  function petLabel(p) { return /^(chó|mèo|cá|chim|thỏ|rùa|hamster|vẹt)/.test(p.br || '') ? p.br : p.k + (p.br && p.br !== p.k ? ' ' + p.br : ''); }
  function pets(l) { return (l.pets || []).filter(function (p) { return p.alive; }); }
  function addPet(l, r, k, br, n) {
    var P = PETS[k] || PETS['chó'];
    var p = { k: k, br: br || k, n: n || petName(l, r), since: l.age, life: U.randint(r, P.life[0], P.life[1]), alive: true };
    l.pets = l.pets || []; l.pets.push(p);
    return p;
  }
  H.pets = pets; H.addPet = addPet; H.petLabel = petLabel; H.petName = petName;

  // ================= VÒNG NĂM =================
  // opts.auto = true: AI tự chủ động làm các hành động (dùng cho chế độ tự động, em bé cùng giây, kiểm thử)
  function beginYear(life, opts) {
    if (!life.alive) return life.pending;
    // Bản lưu cũ có thể còn lựa chọn của năm trước đã hết hạn: bỏ đi thay vì bắt người chơi bấm rồi báo "không còn phù hợp".
    if (life.pending.length) life.pending = life.pending.filter(function (d) { return !DEC[d.id] || !DEC[d.id].valid || DEC[d.id].valid(life, d.data || {}); });
    if (life.pending.length) return life.pending;
    var r = RF(life), a = life.age, q = [];
    life.prevActs = life.acts || 0; life.acts = 0; life.yr = { items: [] };
    var cap = difficulty(life).cap;
    function add(id, arg, src) {
      if (q.length >= cap || !DEC[id] || q.some(function (d) { return d.id === id; })) return;
      if (DEC[id].valid && !DEC[id].valid(life, arg || {})) return; // tình huống hẹn trước không còn phù hợp
      var dm = DEC[id].make(life, r, arg);
      if (schoolOff(life, dm.title + ' ' + dm.text + ' ' + dm.opts.map(function (o) { return o.l; }).join(' '))) return; // v3.1: đã nghỉ học thì không có chuyện trên lớp
      if (src && E.PACE145 && E.PACE145.admit && !E.PACE145.admit(life, dm, q, src)) return; // GĐ5: nhịp sự kiện (chỉ tình huống ngẫu nhiên, hành động AI)
      q.push(dm);
    }

    // Save cũ có thể đã nhận trợ cấp nhưng chưa chạy bước kết thúc năm.
    if (life.flags.military && a >= life.flags.military && life.flags.milVet) { life.flags.military = null; if (life.flags.milReleasedAt == null) life.flags.milReleasedAt = a; }
    // v3.3: đang đi nghĩa vụ quân sự — 2 năm sống trong doanh trại, chỉ có chuyện quân ngũ
    if (life.flags.military && a >= life.flags.military && DEC.nv_xuat_ngu) { add('nv_xuat_ngu'); life.pending = q; prune(life); return life.pending; } // v4.1: đủ 24 tháng mới ra quân (nhập ngũ 18 tuổi → ra quân năm 20 tuổi)
    if (life.flags.military && a < life.flags.military && E.milYear) {
      cap = 4;
      E.milYear(life, r, a).forEach(function (x) { add(x[0], x[1]); });
      life.pending = q; prune(life); return life.pending;
    }
    // trong tù: chỉ có chuyện trong trại giam
    if (life.jailUntil != null && a < life.jailUntil) {
      if (E.jailYear) E.jailYear(life, r, a).forEach(function (x) { add(x[0], x[1]); }); // v4.2: trong tù chỉ có chuyện trong trại giam
      else if (r() < 0.35) add('trai_giam');
      life.pending = q; prune(life); return life.pending;
    }

    // tình huống đã hẹn trước (chuỗi sự kiện)
    if (life.sched && life.sched.length) {
      var due = life.sched.filter(function (s) { return s.at <= a; });
      life.sched = life.sched.filter(function (s) { return s.at > a; });
      due.forEach(function (s) { if (q.length >= cap) life.sched.push(s); else add(s.id, s.arg); });
    }

    // bệnh nặng
    if (!life.ill && a >= 15) {
      var pIll = qBase(life.mort, a) * 2.0 + 0.0015;
      if (life.flags.smoke) pIll *= 1.4;
      if (life.addict && life.addict.alcohol) pIll *= 1.4;
      if (life.flags.checkupUntil >= a) pIll *= 0.6;
      if (r() < pIll) {
        // v2.4: không chẩn đoán lại bệnh đã từng mắc / đang chung sống (tiểu đường không "khỏi" rồi mắc lại);
        // đã từng bị ung thư thì ung thư mới hiếm hơn
        var hist = life.illHist || [], hadCancer = hist.some(function (n) { return /^ung thư/.test(n); });
        var cands = ILLS.filter(function (x) { return (x.young ? a < 50 : a >= 30 || x.n === 'lao phổi') && hist.indexOf(x.n) < 0 && x.w(life) > 0; }); // v3.0: bệnh không có đường mắc (trọng số 0) thì không bao giờ được chọn
        var ill = cands.length ? U.wpick(r, cands, function (x) { return x.w(life) * (hadCancer && /^ung thư/.test(x.n) ? 0.3 : 1); }) : null;
        if (ill) {
          var cure0 = ill.cure * illAgeK(a);
          life.ill = { n: ill.n, m: ill.m, base: cure0, cure: cure0, mult: ill.m, f: ill.f || ill.n, since: a, chronic: !!ill.chronic };
          add('treat');
        }
      }
    }
    // học hành
    if (a === 15 && life.school === 'lower') { life.school = null; life.edu = Math.max(life.edu, 2); add('hs'); }
    if (life.flags.uniNext === a) { life.flags.uniNext = null; add('uni'); }
    if (life.flags.retryUni != null && life.flags.retryUni <= a) { life.flags.retryUni = null; if (life.flags.retryExamPending) { delete life.flags.retryExamPending; var previousExam = life.examScore; life.examScore = E.rollExamScore ? E.rollExamScore(life, r) : Math.min(30, (previousExam || 15) + 1 + r() * 2.5); if (previousExam != null) life.examScore = Math.min(30, Math.max(life.examScore, Math.round((previousExam + 1 + r() * 2.5) * 4) / 4)); life.log.push({a:a,y:life.birthYear+a,t:'Thi lại tốt nghiệp THPT: '+U.fmtNum(life.examScore,2)+' điểm.',k:'neutral'}); if (life.examScore >= 27) life.flags.scholar = true; } add('uni'); } // v3.8: không để cờ "ôn thi lại" treo mãi chặn việc tìm việc
    // việc làm
    var studyDecision = q.some(function (d) { return d.id === 'hs' || d.id === 'uni'; });
    if (!studyDecision && !(life.flags.world120 && life.flags.world120.monastic) && !life.school && (!life.job || life.flags.upgradeJob) && !life.retired && !(life.flags.selfRun && !life.job && (life.ventures || []).length && !life.flags.needJob) && a >= 15 && !life.flags.military && life.flags.retryUni == null &&
      (life.flags.needJob || life.flags.upgradeJob || (a >= 18 && r() < 0.6)) && !(life.abroad && !life.abroad.perm)) add('job');
    // xu hướng tính dục
    if (life.orient !== 'straight' && life.realized && !life.out && a >= 16 && a <= 40 && (life.flags.outAskedAt == null || a - life.flags.outAskedAt >= 3) && r() < 0.2) add('out');
    // tình cảm
    var p = life.partner;
    if (!p && a >= 17 && a <= (E.LOVE_MAX || 60) && !(life.flags.earlyMarried && a < 18)) {
      var pm = 0.13 + (life.focus === 'social' ? 0.07 : 0) - (a > 40 ? 0.08 : 0) + (life.st.soc - 50) / 400 + (E.LOOKS134 ? E.LOOKS134.loveBonus(life) : 0); // ngoại hình ưa nhìn dễ có người yêu hơn
      if (r() < pm) add('love');
    } else if (p && p.status === 'dating' && a - p.since >= 1 && (life.flags.marryAskAt == null || a - life.flags.marryAskAt >= 2 + Math.min(4, life.flags.marryWait || 0)) && r() < 0.4) { add('marry'); life.flags.marryAskAt = a; } // v3.0: không hỏi chuyện cưới năm nào cũng như năm nào
    if (p && p.status !== 'dating' && a <= 50 && (life.flags.noKidUntil == null || a >= life.flags.noKidUntil) && (life.flags.kidAskAt == null || a - life.flags.kidAskAt >= 2) && life.kids.length < (life.flags.familyPlan108 ? life.flags.familyPlan108.want : 2) && !(life.flags.pregnancy108) && (!E.RELATIONS108 || E.RELATIONS108.fertile(life,p)) && r() < (life.kids.length >= 1 ? 0.08 : 0.2)) { add('kid'); life.flags.kidAskAt = a; }
    if (p && p.status !== 'dating' && a - p.since >= 2 && r() < (isVN(life) ? 0.012 : 0.02) * (life.st.hap < 45 ? 2 : 1)) add('divorce');
    // di chuyển
    if (!life.urban && !life.flags.cityAsked && a >= 18 && a <= 35 && !life.school && r() < 0.12) add('city');
    if (isVN(life) && !life.abroad && !life.flags.xkldAsked && a >= 19 && a <= 33 && !life.school && r() < (life.fam.q <= 3 ? 0.07 : 0.02) * (life.flags.famDebt ? 2 : 1)) add('xkld');
    if (!isVN(life) && !life.abroad && !life.flags.emigAsked && a >= 20 && a <= 40 && life.gdp < 25 && r() < 0.03) add('emig');
    // tài sản
    if (!life.ownHouse && life.indep && a >= 25 && (life.flags.houseNo == null || a >= life.flags.houseNo) && life.money >= (E.homeMin ? E.homeMin(life) : housePrice(life)) * (H.loanAgeOk(life, 'home') ? 0.35 : 1) && !(life.abroad && !life.abroad.perm) && r() < 0.5) add('house');
    if (life.job && !/^(kd_|xkld|phu_giup)/.test(life.job.id) && !E.isCrime(life) && a >= 25 && a <= 50 && (life.flags.bizAsked || 0) < 2 && life.money > life.base && r() < 0.04) add('biz');
    if (a >= 40 && a <= 70 && !life.flags.careDone && ((life.fam.mAlive && life.fam.mAge + a >= 72) || (life.fam.fAlive && life.fam.fAge + a >= 72)) && r() < 0.3) add('care');

    // Hardcore có thêm một biến cố riêng; vẫn tuân thủ điều kiện, giới hạn và chuỗi bắt buộc.
    if (E.hardcoreEvent && q.length < cap) {
      var hc = E.hardcoreEvent(life, r, a), beforeHC = q.length;
      if (hc) { add(hc); if (q.length > beforeHC) { (life.flags.hardcoreAt || (life.flags.hardcoreAt = {}))[hc] = a; if (life.difficulty === 'hardcore' && E.hardcoreTriggers) { (life.flags.scN || (life.flags.scN = {}))[hc] = ((life.flags.scN || {})[hc] || 0) + 1; (life.flags.cd || (life.flags.cd = {}))[hc] = a; } } }
    }
    // tình huống ngẫu nhiên đời thường (theo điều kiện)
    var hardcorePool = life.difficulty === 'hardcore' && E.hardcoreTriggers;
    var tr = hardcorePool ? E.hardcoreTriggers(life, a) : TRIG.slice();
    var cdm = life.flags.cd || (life.flags.cd = {}), scN = life.flags.scN || (life.flags.scN = {});
    for (var i = tr.length - 1; i > 0; i--) { var jj = Math.floor(r() * (i + 1)); var tmp = tr[i]; tr[i] = tr[jj]; tr[jj] = tmp; }
    for (var t = 0; t < tr.length && q.length < cap; t++) {
      var T = tr[t];
      if (!DEC[T.id] || !T.when(life, a)) continue;
      // thời gian chờ để tình huống không lặp lại quá dày (v2.4: tối thiểu 2 năm, trừ chuỗi đang diễn ra như nghiện ngập, đòi nợ)
      // v3.0: chống lặp triệt để — chờ tối thiểu 3 năm, mỗi lần đã gặp thì lần sau hiếm hơn, mỗi tình huống chỉ gặp tối đa vài lần trong đời
      var cdT = T.rep ? (T.cd || 0) : Math.max(4, T.cd || 0);
      if (cdT && cdm[T.id] != null && a - cdm[T.id] < cdT) continue;
      var seenN = scN[T.id] || 0;
      if (!T.rep && seenN >= (T.max || 3)) continue;
      var pv = life.flags.prevSeen || {}; // v3.4: chuyện đã gặp ở các đời trước thì đời này ít gặp lại hơn
      var pr = (typeof T.p === 'function' ? T.p(life, a) : T.p) * (T.rep ? 1 : Math.pow(0.7, seenN)) * (pv[T.id] && !T.rep ? 0.4 : 1);
      if (E.CONTEXT143) pr = E.CONTEXT143.probability(T, life, pr);
      if (r() < Math.min(1, pr * difficulty(life).events) && !q.some(function (d) { return d.id === T.id; })) { var n0 = q.length; add(T.id, undefined, T); if (q.length > n0) { cdm[T.id] = a; scN[T.id] = seenN + 1; } }
    }

    // nhịp tuổi thơ: từ 1 đến 14 tuổi, năm nào cũng nên có một lựa chọn hợp lứa tuổi
    if (a >= 1 && a <= 14 && !q.length && (a === 1 || r() < 0.85)) {
      var kidT = (hardcorePool ? [] : TRIG).filter(function (T) {
        return T.child && (!E.CONTEXT143 || E.CONTEXT143.factor(T, life) > 0) && DEC[T.id] && T.when(life, a) && !(T.cd && cdm[T.id] != null && a - cdm[T.id] < T.cd) && (T.rep || (scN[T.id] || 0) < (T.max || 3)) && (!DEC[T.id].valid || DEC[T.id].valid(life, {}));
      });
      if (kidT.length) { var KT = U.wpick(r, kidT, function (T) { return (typeof T.cw === 'function' ? T.cw(life, a) : (T.cw || 1)) * (E.CONTEXT143 ? E.CONTEXT143.factor(T, life) : 1) * Math.pow(0.45, scN[T.id] || 0) * ((life.flags.prevSeen || {})[T.id] ? 0.3 : 1); }); /* v2.5: trọng số theo giới tính, hoàn cảnh; v3.0: tình huống đã gặp ít được chọn lại */ add(KT.id); cdm[KT.id] = a; scN[KT.id] = (scN[KT.id] || 0) + 1; }
    }

    // AI chủ động hành động (khi người chơi bật tự động, hoặc nhân vật do máy điều khiển)
    if (!hardcorePool && opts && (opts.auto || (life.prevActs === 0 && a >= 8)) && q.length < cap && a >= 8 && r() < (opts.auto ? 0.3 : 0.45)) { // Hardcore dùng chuỗi lựa chọn riêng; hành động thủ công vẫn giữ nguyên.
      // v2.4: AI không lặp lại cùng một việc trong vòng 3 năm (trước đây năm nào cũng "xin tăng lương", "mua vé số"…)
      var aAt = life.flags.actAt || (life.flags.actAt = {});
      var aN = life.flags.actN || (life.flags.actN = {});
      var av = ACT.filter(function (x) { return actAvail(life, x) === true && x.ai && !(aAt[x.id] != null && a - aAt[x.id] < 3) && (aN[x.id] || 0) < 3; }); // v3.7: game tự chọn thì mỗi việc tối đa 3 lần một đời
      if (av.length) {
        var pick = U.wpick(r, av, function (x) { return aiW(life, x.ai); });
        if (pick && (!opts.auto || r() < Math.min(1, aiW(life, pick.ai)))) { var n1 = q.length; add(pick.sc || pick.id, pick.arg ? pick.arg(life) : null, { ai: pick, auto: !!opts.auto }); if (q.length > n1) { life.acts++; aAt[pick.id] = a; aN[pick.id] = (aN[pick.id] || 0) + 1; } }
      }
    }

    life.pending = q;
    prune(life);
    return life.pending;
  }

  function resolve(life, key) {
    var d = life.pending[0];
    if (!d) return [];
    if (DEC[d.id] && DEC[d.id].valid && !DEC[d.id].valid(life, d.data || {})) { life.pending.shift(); prune(life); if(d.manual&&life.alive){releaseUnusedAction(life,d);var expired={a:life.age,y:life.birthYear+life.age,t:'Lựa chọn “'+d.title+'” không còn phù hợp với hoàn cảnh hiện tại; chưa thực hiện và không trừ tiền.',k:'neutral'};life.log.push(expired);return [expired];} return []; }
    var r = RF(life), out = [];
    var log = function (t, k) { if (k !== 'big' && k !== 'death' && schoolOff(life, t)) return; if (E.famLogic && k !== 'death') { t = E.famLogic(life, t, true); if (t == null) return; } var e = { a: life.age, y: life.birthYear + life.age, t: E.lossText ? E.lossText(life, famFix(life, t), k) : famFix(life, t), k: k || '' }; life.log.push(e); out.push(e); }; // v3.2: đã nghỉ học thì không kể chuyện trên lớp
    var valid = d.opts.some(function (o) { return o.k === key; });
    if (!valid) key = DEC[d.id] ? DEC[d.id].auto(life, d, r) : null;
    life.pending.shift();
    life.choices = (life.choices || 0) + 1;
    if (!life.yr) life.yr = { items: [] };
    var it0 = life.yr.items.length;
    if (DEC[d.id]) DEC[d.id].apply(life, d, key, r, log);
    if (life.yr && life.yr.items) moneyNote(life, life.yr.items, it0, out, log);
    clampSt(life);
    prune(life);
    return out;
  }
  // Bỏ các quyết định đã xếp hàng nhưng không còn phù hợp sau lựa chọn trước đó
  function prune(life) {
    if (!life.alive) { life.pending = []; return; }
    var inMil = life.flags.military && life.age < life.flags.military;
    life.pending = life.pending.filter(function (d) {
      if (schoolOff(life, (d.title || "") + " " + (d.text || ""))) return false;
      if (inMil && !/^(nv_|treat$|phau_thuat$)/.test(d.id)) return false; // v3.3: đang tại ngũ thì chỉ còn chuyện quân ngũ
      if (life.abroad && life.abroad.trapped && !/^(kh_|treat$|phau_thuat$)/.test(d.id)) return false;
      if (life.jailUntil != null && life.age < life.jailUntil && E.JAIL_OK && !E.JAIL_OK.test(d.id)) return false; // v4.5: trong tù không thi bằng lái, hẹn hò, mua nhà, nhận việc… // v3.8: bị giam trong trại lừa đảo thì không yêu đương, cưới hỏi, mua sắm, chuyển nhà…
      if (life.retired && life.flags.fullRetire && /^(job|nk_nghe|nk_ra_truong|sau_huu|len_chuyen|ru_re|so_thich_nghe|biz|xkld|city)$/.test(d.id)) return false; // v3.6: đã nghỉ hưu hẳn thì không còn bị hỏi nhận việc này việc kia
      var p = life.partner;
      switch (d.id) {
        case 'job': return !(life.job && life.job.fam) && !(life.fam && life.fam.elite && life.flags.eliteFollow && !life.flags.eliteCut && !life.flags.eliteJobDone && life.age <= 24) && !life.school && !(life.abroad && !life.abroad.perm) && (!life.job || life.flags.upgradeJob) && !(life.jailUntil != null && life.age < life.jailUntil);
        case 'marry': return !!(p && p.status === 'dating');
        case 'kid': return !!(p && p.alive !== false && p.age >= 18 && life.age >= 18);
        case 'divorce': return !!(p && p.status !== 'dating');
        case 'love': return !p && life.age <= (E.LOVE_MAX || 120); // v4.2: chỉ tìm một nửa khi dưới 55 tuổi
        case 'house': return !life.ownHouse;
        case 'biz': return !!life.job;
        case 'city': return !life.urban;
        case 'xkld': case 'emig': return !life.abroad;
        case 'treat': return !!life.ill;
        default: return !(DEC[d.id] && DEC[d.id].valid) || DEC[d.id].valid(life, d.data);
      }
    });
  }
  function autoKey(life) { var d = life.pending[0]; return d && DEC[d.id] ? DEC[d.id].auto(life, d, RF(life)) : null; }

  function clampSt(life) {
    var s = life.st;
    s.hea = U.clamp(s.hea, 0, 100); s.hap = U.clamp(s.hap, 0, 100); s.kno = U.clamp(s.kno, 0, 100); s.soc = U.clamp(s.soc, 0, 100);
    life.karma = U.clamp(life.karma || 0, -100, 100);
    if (life.mind && isFinite(life.mind.stress)) life.mind.stress = U.clamp(life.mind.stress, 0, 100); // v2.5: căng thẳng luôn trong 0–100
  }

  // ---------- Hành động chủ động của người chơi ----------
  var ACTS_PER_YEAR = 3;
  // v2.7: dưới 10 tuổi 3 lượt · 10–17 tuổi 7 lượt · từ 18 tuổi không giới hạn
  function actsLimit(l) { return l.age < 10 ? 3 : l.age < 18 ? 7 : Infinity; }
  function actAvail(l, a) {
    if (!l.alive) return 'Đã qua đời';
    if (l.jailUntil != null && l.age < l.jailUntil && !a.jail) return 'Đang ở trong trại giam';
    if (l.abroad && l.abroad.trapped && !a.trap) return 'Không áp dụng — đang bị giam giữ trong trại lừa đảo'; // v3.8
    if (l.flags && l.flags.military && l.age < l.flags.military && !a.mil) return 'Đang đi nghĩa vụ quân sự, sống trong doanh trại';
    if (l.acts >= actsLimit(l)) return 'Đã hết lượt hành động năm nay';
    if (a.min != null && l.age < a.min) return 'Từ ' + a.min + ' tuổi';
    if (a.max != null && l.age > a.max) return 'Không còn phù hợp ở tuổi này';
    if (l.flags && l.flags.actAt && l.flags.actAt[a.id] === l.age) return 'Đã làm việc này năm nay'; // v2.4: tránh lặp cùng một việc trong một năm
    var x = a.avail ? a.avail(l) : true;
    return x === true || x === undefined ? true : (x || 'Chưa thể làm lúc này');
  }
  function actions(l) { return ACT.map(function (a) { return { id: a.id, g: a.g, l: famFix(l, typeof a.l === 'function' ? a.l(l) : a.l), ok: actAvail(l, a) }; }); } // v2.9: tên hành động có thể theo hoàn cảnh (tôn giáo…)
  function act(l, id) {
    var a = ACT.filter(function (x) { return x.id === id; })[0];
    if (!a || actAvail(l, a) !== true) return null;
    var D = DEC[a.sc || a.id];
    if (D.valid && !D.valid(l, { requested: true })) return null;
    l.acts++; (l.flags.actAt || (l.flags.actAt = {}))[a.id] = l.age;
    var d = DEC[a.sc || a.id].make(l, RF(l), a.arg ? a.arg(l) : null);
    d.data = d.data || {}; d.data.requested = true; d.data.actionId850=a.id; d.data.actionYear850=l.age; d.manual = true;
    l.pending.unshift(d);
    return d;
  }

  // ---------- Sự kiện kể chuyện (không cần lựa chọn) ----------
  var CORE_EVENTS = [
    { c: function (l, a) { return a === 1; }, p: 1, run: function (l, a, r, log) { log(U.pick(r, ['Chập chững những bước đi đầu tiên.', 'Bập bẹ gọi tiếng "mẹ" đầu tiên.', 'Biết đi, biết gọi bố mẹ.']), 'good'); H.mem(l, 'Bước chân chập chững đầu tiên, mẹ dang tay đón bạn.', 2); } },
    { c: function (l, a) { return a === 3 && isVN(l); }, p: 0.85, run: function (l, a, r, log) { log('Bắt đầu đi mẫu giáo.', 'neutral'); l.st.soc += 3; } },
    { c: function (l, a) { return a >= 7 && a <= 17 && l.school && l.st.kno > 62; }, p: 0.12, run: function (l, a, r, log) { log(isVN(l) ? U.pick(r, ['Đạt danh hiệu học sinh giỏi.', 'Được tuyên dương học sinh tiêu biểu của trường.', 'Được nhà trường khen thưởng cuối năm.']) : 'Được trường khen thưởng vì học giỏi.', 'good'); l.st.hap += 4; l.st.kno += 2; } },
    { c: function (l, a) { return a >= 6 && a <= 12 && l.talent && !l.flags.talentSeen; }, p: 0.25, run: function (l, a, r, log) { l.flags.talentSeen = true; log('Năng khiếu ' + talentText(l) + ' được thầy cô phát hiện.', 'good'); l.st.hap += 3; l.st.kno += 2; l.skill += 8; H.mem(l, 'Lần đầu được khen có năng khiếu ' + talentText(l) + '.', 3); } },
    { c: function (l, a) { return a >= 6 && a <= 15 && !l.flags.brokeArm; }, p: 0.03, run: function (l, a, r, log) { l.flags.brokeArm = true; log(U.pick(r, ['Bị gãy tay khi chơi đùa.', 'Ngã từ trên cây xuống, gãy tay phải bó bột cả tháng.', 'Trượt chân ở cầu thang trường, gãy tay — cả lớp thay nhau ký tên lên lớp bột.']), 'bad'); l.st.hea -= 3; } },
    { c: function (l, a) { return a >= 7 && a <= 14 && !l.urban && l.fam.q <= 2; }, p: 0.15, run: function (l, a, r, log) { log(isVN(l) ? U.pick(r, ['Sau giờ học phụ bố mẹ chăn trâu, cắt cỏ.', 'Theo mẹ ra đồng cấy lúa những ngày mùa.', 'Đi bộ hàng cây số đến trường mỗi ngày.']) : 'Phụ giúp gia đình việc đồng áng sau giờ học.', 'neutral'); } },
    { c: function (l, a) { return a >= 7 && a <= 14 && l.gdp < 3 && !l.school; }, p: 0.25, run: function (l, a, r, log) { log('Phải đi làm thuê để phụ giúp gia đình dù còn nhỏ.', 'bad'); l.st.hea -= 2; l.st.hap -= 3; } },
    { c: function (l, a) { return a >= 12 && a <= 17 && l.orient !== 'straight' && !l.realized; }, p: function (l, a) { return a <= 13 ? 0.8 : 0.4; }, run: function (l, a, r, log) { l.realized = true; log(E.realizeText ? E.realizeText(l, r) : l.orient === 'bi' ? 'Nhận ra mình có thể rung động với cả bạn nam lẫn bạn nữ.' : 'Nhận ra mình rung động với người cùng giới.', 'big'); } }, // v3.7: phần lớn nhận ra khoảng 12–13 tuổi
    { c: function (l, a) { return a >= 15 && a <= 17 && l.sex === 'F' && !l.partner && earlyMarriageRisk(l) > 0; }, p: function (l) { return earlyMarriageRisk(l); }, run: function (l, a, r, log) {
      var nm = strangerName(l, r, 'M');
      l.partner = { name: nm, sex: 'M', age: a + U.randint(r, 3, 12), status: 'married', since: a, alive: true };
      l.school = null; l.flags.earlyMarried = true; l.flags.needJob = false;
      log('Bị gia đình gả cho ' + nm + ' khi mới ' + a + ' tuổi, phải nghỉ học.', 'bad'); l.st.hap -= 12;
      H.mem(l, 'Ngày bị gả đi khi mới ' + a + ' tuổi.', 5);
    } },
    { c: function (l, a) { return a >= 16 && a <= 24 && !l.partner && !l.flags.firstLove && !l.flags.everDated && !l.exes && !l.widowed; }, p: 0.12, run: function (l, a, r, log) {
      l.flags.firstLove = strangerName(l, r, H.partnerSex(l, r));
      log('Mối tình đầu với ' + l.flags.firstLove + ', rồi mỗi người một ngả.', 'neutral'); l.st.hap += 2;
      H.mem(l, 'Mối tình đầu với ' + l.flags.firstLove + (l.school ? ' — những lá thư tay, những buổi chiều tan học.' : ' — những tin nhắn và buổi chiều cùng đi dạo.'), 3);
    } },
    { c: function (l, a) { return a >= 18 && a <= 25 && CONSCRIPT.indexOf(l.country) >= 0 && l.sex === 'M' && !l.school && !l.abroad && !l.flags.milDone && !l.flags.military && !l.flags.milCalled && (!E.canServe || E.canServe(l)); }, p: function (l) { return l.country === 'KR' || l.country === 'SG' || l.country === 'IL' ? 0.5 : l.country === 'VN' ? 0.035 : 0.06; }, run: function (l, a, r, log) { l.flags.milCalled = true; H.sched(l, 'nv_lenh_goi', 1); log('Nhận thông báo khám tuyển nghĩa vụ quân sự cho đợt năm tới.', 'neutral'); } },
    { c: function (l, a) { return a >= 16 && a <= 30 && l.sex === 'M' && !l.flags.smoke && !l.flags.noSmoke; }, p: function (l) { return isVN(l) || /cn|id|ru|tr|ar|kr/.test(l.pool) ? 0.05 : 0.02; }, run: function (l, a, r, log) { l.flags.smoke = true; log('Bắt đầu hút thuốc lá.', 'bad'); } },
    { c: function (l, a) { return l.flags.smoke && a >= 25; }, p: 0.05, run: function (l, a, r, log) { l.flags.smoke = false; l.flags.noSmoke = true; log('Bỏ được thuốc lá sau nhiều lần thử.', 'good'); l.st.hea += 4; } },
    { c: function (l, a) { return isVN(l) && a >= 18 && l.indep; }, p: 0.07, run: function (l, a, r, log) { if (l.abroad && !(E.parentsWithYouAbroad && E.parentsWithYouAbroad(l))) { log('Đón một cái Tết xa nhà ở ' + l.abroad.name + ', gọi video về nhà mà nghẹn ngào.', 'neutral'); l.st.hap -= 3; H.mem(l, 'Cái Tết xa nhà, nhìn mẹ qua màn hình điện thoại.', 2); } else if (l.abroad) { log('Tết năm nay có bố mẹ ở bên, cả nhà quây quần gói bánh chưng nơi xứ người.', 'good'); l.st.hap += 3; } else { log(U.pick(r, ['Tết năm nay cả nhà sum họp đông đủ.', 'Về quê ăn Tết, gói bánh chưng cùng gia đình.', 'Mùng Một Tết đi chúc Tết họ hàng, lì xì cho bọn trẻ.']), 'good'); l.st.hap += 3; l.st.soc += 2; } } },
    { c: function (l, a) { return l.job && !E.isCrime(l) && a >= 22 && !E.tetBonus; }, p: 0.05, run: function (l, a, r, log) { var x = Math.round(l.base * 0.15), vt = isVN(l) && !l.abroad; H.cash(l, x, vt ? 'Thưởng Tết, lương tháng 13' : 'Thưởng cuối năm'); log((vt ? 'Được thưởng lương tháng 13 và thưởng Tết ' : 'Được thưởng cuối năm ') + fmtMoney(l, x) + '.', 'good'); l.st.hap += 2; } },
    { c: function (l, a) { return a >= 35 && a <= 75 && !l.flags.exercise; }, p: 0.04, run: function (l, a, r, log) { l.flags.exercise = true; log(isVN(l) ? 'Bắt đầu tập thể dục, đi bộ mỗi sáng sớm.' : 'Bắt đầu tập thể dục đều đặn.', 'good'); l.st.hea += 5; } },
    { c: function (l, a) { return isVN(l) && [70, 75, 80, 85, 90, 95, 100].indexOf(a) >= 0; }, p: 1, run: function (l, a, r, log) { log('Con cháu tổ chức lễ mừng thọ ' + a + ' tuổi.', 'good'); l.st.hap += 5; H.mem(l, 'Lễ mừng thọ ' + a + ', con cháu quây quần chúc thọ.', 3); } },
    { c: function (l, a) { return a >= 55 && l.grand > 0; }, p: 0.06, run: function (l, a, r, log) { log(U.pick(r, ['Trông cháu giúp con những ngày con bận rộn.', 'Đón cháu đi học về, ông bà cháu ríu rít cả buổi chiều.', 'Cuối tuần các cháu về chơi, căn nhà rộn tiếng cười.', 'Dạy cháu đọc chữ, kể chuyện ngày xưa cho cháu nghe.']), 'good'); l.st.hap += 3; l.st.soc += 2; } },
    { c: function (l, a) { return l.partner && l.partner.sex === l.sex && l.flags.famTension; }, p: 0.12, run: function (l, a, r, log) { l.flags.famTension = false; log('Bố mẹ dần chấp nhận và đón ' + l.partner.name + ' về nhà ăn cơm.', 'good'); l.st.hap += 8; H.mem(l, 'Bữa cơm đầu tiên bố mẹ gắp thức ăn cho ' + l.partner.name + '.', 4); } },
    { c: function (l, a) { return l.partner && l.partner.status === 'married' && a - l.partner.since === 25; }, p: 1, run: function (l, a, r, log) { log('Kỷ niệm 25 năm ngày cưới với ' + l.partner.name + '.', 'good'); l.st.hap += 4; H.mem(l, 'Đám cưới bạc — 25 năm bên ' + l.partner.name + '.', 4); } },
    { c: function (l, a) { return a >= 18 && l.job && !stableService(l) && !l.job.fam && !l.retired && !E.isCrime(l) && !/^(nong|xkld|phu_giup)/.test(l.job.id); }, p: function (l) { return H.isEmployee(l) && E.layoffRisk ? 0.01 * E.layoffRisk(l) : 0.006; }, run: function (l, a, r, log) { if(stableService(l))return; var jd = E.jobDef(l), jid0 = E.resolveJob(l.job.id); if (H.isEmployee(l) && E.layoffRisk && !E.layoffRisk(l) && !/^(tx_cn|xe_om|shipper)/.test(jid0)) return; log(jid0 === 'giup_viec' ? 'Kinh tế khó khăn, nhà chủ không thuê người giúp việc nữa — bạn phải tìm chỗ làm mới.' : /^(tx_cn|xe_om|shipper)/.test(jid0) ? 'Kinh tế khó khăn, ứng dụng ít cuốc, chạy cả ngày không đủ tiền xăng — đành tạm nghỉ chạy xe.' : H.isEmployee(l) ? 'Kinh tế khó khăn, công ty cắt giảm nhân sự — bạn mất việc.' : jd && (jd.fame || jd.cat === 'free') ? 'Kinh tế khó khăn, khách hàng cắt hết hợp đồng — mấy tháng liền không có việc, đành tạm nghỉ nghề.' : 'Kinh tế khó khăn, sức mua giảm mạnh — làm ăn thua lỗ, phải dừng kinh doanh.', 'bad'); l.job = null; l.flags.needJob = true; l.st.hap -= 7; } },
    { c: function (l, a) { return a >= 45 && a <= 75 && !l.flags.glasses; }, p: 0.08, run: function (l, a, r, log) { l.flags.glasses = true; log('Mắt kém đi, bắt đầu phải đeo kính lão.', 'neutral'); } },
    { c: function (l, a) { return a >= 70; }, p: 0.05, run: function (l, a, r, log) { log(U.pick(r, ['Trí nhớ bắt đầu kém đi, hay quên đồ đạc.', 'Chân yếu, đi lại khó khăn hơn trước.', 'Thính lực giảm, phải nói to mới nghe rõ.']), 'neutral'); l.st.hea -= 3; } }
  ];
  CORE_EVENTS.forEach(function (e) { EVENTS.push(e); });
  var GAME_SUB = { FPS: 'game bắn súng (FPS)', MOBA: 'game chiến thuật đồng đội (MOBA)' };
  function talentText(l) {
    if (!l.talent) return '';
    if (l.talent === 'game') return l.talentSub && GAME_SUB[l.talentSub] ? GAME_SUB[l.talentSub] : 'chơi game';
    return l.talentSub ? l.talent + ' (' + l.talentSub + ')' : l.talent;
  }
  // Ngã rẽ quyết định (thay đổi cả cuộc đời) và lựa chọn thường (chuyện thường ngày)
  var MAJOR = { treat: 1, hs: 1, uni: 1, uniFail: 1, major: 1, post: 1, job: 1, marry: 1, kid: 1, city: 1, xkld: 1, emig: 1, out: 1, house: 1, biz: 1, divorce: 1, care: 1,
    kh_den: 1, du_hoc: 1, nghien_bac: 1, ru_re: 1, kiem_tien_ban: 1, bi_bat: 1, ra_tu: 1, chien_tranh: 1, di_chuc: 1, ve_que: 1, phat_hien: 1, creator_nghi: 1, scandal: 1, nuoi_pet: 0 };
  function isMajor(d) { return !!(d && (d.major || MAJOR[d.id] || (DEC[d.id] && DEC[d.id].def && DEC[d.id].def.major))); }

  function earlyMarriageRisk(l) {
    if (isVN(l)) {
      if (l.ethStyle === 'hmong') return 0.12;
      if (l.eth && l.eth !== 'Kinh' && l.eth !== 'Hoa' && !l.urban) return 0.04;
      return 0.002;
    }
    if (l.gdp < 3) return l.urban ? 0.05 : 0.12;
    if (l.gdp < 8) return l.urban ? 0.015 : 0.05;
    return 0.002;
  }

  // ---------- Tài chính một năm ----------
  function finance(life, r, a, focus, income, log) {
    var F = { inc: income, partner: 0, other: 0, food: 0, rent: 0, travel: 0, kids: 0, parents: 0, health: 0, debt: 0, life: 0, interest: 0, items: (life.yr && life.yr.items) || [] };
    F.other = F.items.reduce(function (s, x) { return s + x.v; }, 0);
    if (!life.indep) {
      // Adult students also use the existing family debt-relief limit.
      // Otherwise a delayed graduation skips the cap for decades.
      if (life.age >= 18 && life.money < -life.base * 3) { var help = -life.base * 3 - life.money; life.money += help; F.other += help; F.items.push({v:help,t:'Hỗ trợ xử lý nợ sinh hoạt khi còn đi học'}); if(!life.flags.debtHelp){life.flags.debtHelp=true;log('Gia đình cùng bạn thu xếp trả bớt nợ sinh hoạt trong thời gian đi học.','neutral');} }
      life.fin = F; return F; }
    var b = life.base, p = life.partner && life.partner.status !== 'dating' && life.partner.alive ? life.partner : null;
    var kidsHome = life.kids.filter(function (k) { return k.alive && a - k.born < 22 && k.custody !== 'other' && k.custody !== 'ex'; }).length; // v5.9.0: con sống với người kia thì trả tiền chu cấp thay vì chi phí nuôi con
    F.partner = p && !(life.jailUntil != null && a < life.jailUntil) && p.inc > 0 && isFinite(p.inc) ? p.inc * 12 * 0.55 : 0; // chỉ góp từ thu nhập thực, không tự tạo thu nhập khi thất nghiệp / đang học
    if (E.economy114Income) F.partner = E.economy114Income(life, F.partner);
    F.partner *= difficulty(life).income;
    if (E.sponsorContributionAllowed && !E.sponsorContributionAllowed(life)) F.partner = 0;
    var styleK = E.lifestyleFactor ? E.lifestyleFactor(life) : ({ save: 0.82, normal: 1, lavish: 1.25 }[life.spend] || 1);
    var wealthK = E.wealthLivingK ? E.wealthLivingK(life, income) : 1; // v5.8.0: nhà giàu chi tiêu sinh hoạt nhiều hơn nhà bình thường, nhà nghèo
    F.food = (b * 0.3 + (p ? b * 0.22 : 0)) * styleK * wealthK;
    var util = (b * 0.15 + (p ? b * 0.13 : 0)) * styleK * wealthK;
    F.food += util;
    F.rent = !life.ownHouse && life.urban ? b * 0.12 : 0;
    F.travel = E.travelCost ? E.travelCost(life, b, a) : life.veh === 'ô tô' ? b * 0.12 : life.veh === 'xe máy' ? b * 0.03 : b * 0.01; // v3.0: xăng xe đổ hằng tuần, bảo hiểm, gửi xe, thuê xe chạy dịch vụ
    F.kids = kidsHome * b * 0.18;
    if (life.retired) {
      // tuổi già: sống tằn tiện, phần lớn ở cùng con cháu
      var adultKids = life.kids.filter(function (k) { return k.alive && a - k.born >= 22; }).length;
      var k = adultKids ? 0.55 : 0.85;
      F.food *= k; F.rent *= adultKids ? 0 : 0.85;
      if (life.money < 0) F.food *= 0.8;
    }
    if (life.abroad && !life.abroad.perm) { F.food *= 1.5; F.rent = b * 0.2; }
    if (life.jailUntil != null && a < life.jailUntil) { F.food = 0; F.rent = 0; F.travel = E.vehicleAnnual ? E.vehicleAnnual(life).total : 0; }
    if (life.flags.military && a < life.flags.military) { F.food = b * 0.03; F.rent = 0; F.travel = E.vehicleAnnual ? E.vehicleAnnual(life).total : 0; F.kids = 0; } // xe để lại vẫn cần bảo dưỡng / bảo hiểm, không đổ xăng khi bị giam hoặc tại ngũ
    if (E.budget114) E.budget114(life, F);
    if (E.vehicleAnnual) F.vehicle = E.vehicleAnnual(life);
    if (E.esportsLiving) E.esportsLiving(life, F, b, styleK, log);
    // gửi tiền cho bố mẹ già
    var parentsOld = (life.fam.mAlive && life.fam.mAge + a >= 58) || (life.fam.fAlive && life.fam.fAge + a >= 58);
    // bố mẹ không có lương hưu thì con phải gửi nhiều hơn; bố mẹ có lương hưu khá thì chỉ biếu chút quà
    var pYear = ((life.fam.mAlive ? life.fam.mInc || 0 : 0) + (life.fam.fAlive ? life.fam.fInc || 0 : 0)) * 12;
    var needy = pYear < b * 0.3;
    if (life.sendParents && parentsOld && income > 0) F.parents = Math.max(b * 0.03, income * (needy ? (life.fam.q <= 2 ? 0.12 : 0.09) : pYear > b ? 0.03 : 0.05));
    if (life.ill) F.health = b * (life.gdp > 40 ? 0.03 : 0.1);
    if (life.flags.chronic) F.health += b * (life.gdp > 40 ? 0.01 : 0.025) * Math.min(2, life.flags.chronic); // thuốc men bệnh mạn tính
    F.pets = pets(life).reduce(function (s, pt) { return s + (PETS[pt.k] || PETS['chó']).cost * b; }, 0);
    if (life.jailUntil != null && a < life.jailUntil) F.pets = 0;
    F.food += F.pets; // gộp vào sinh hoạt để công thức cân đối không đổi; hiển thị riêng một dòng
    // trả nợ (tổng nợ không thế chấp tối đa 5 lần thu nhập cơ sở — chủ nợ không cho vay thêm)
    function capUnsecured() {
      var unsec = (life.loans || []).filter(function (L) { return L.type !== 'home' && L.type !== 'car'; });
      var uTot = unsec.reduce(function (s, L) { return s + L.bal; }, 0);
      if (uTot > b * 5) unsec.forEach(function (L) { L.bal *= b * 5 / uTot; });
    }
    capUnsecured();
    var defaulted = {};
    (life.loans || []).forEach(function (L) {
      if (L.bal <= 0.5) return;
      L.bal *= 1 + L.rate;
      if (L.type !== 'home' && L.type !== 'car') L.bal = Math.min(L.bal, b * 4); // trần nợ tiêu dùng / tín dụng đen
      // vỡ nợ khi trễ hạn kéo dài: bị xử lý như ngoài đời. v2.4: tín dụng đen ra tay ngay năm sau,
      // ngân hàng/công ty tài chính sau 3 năm trễ liên tiếp hoặc 5 năm trễ cộng dồn — không còn khoản nợ "treo" mấy chục năm
      var lim = L.type === 'appden' || L.type === 'nong' ? 2 : 3;
      if ((L.late || 0) >= lim || (L.lateTot || 0) >= 5) {
        if (defaulted[L.type]) { L.bal = 0; L.closed = true; return; } defaulted[L.type] = 1; // v2.8: nhiều khoản cùng loại thì chỉ báo một lần
        if (L.type === 'home') { log('Không trả nổi nợ, ngân hàng phát mại căn nhà.', 'bad'); life.ownHouse = false; life.houseVal = 0; H.fx(life, { hap: -15 }); H.mem(life, 'Ngày ngân hàng niêm phong căn nhà của bạn.', 6); }
        else if (L.type === 'appden' || L.type === 'nong') { log('Bọn đòi nợ kéo đến tận nhà đập phá, đánh bạn một trận rồi "xí xóa" phần còn lại.', 'bad'); H.fx(life, { hea: -10, hap: -10 }); H.mem(life, 'Đêm bọn đòi nợ kéo đến đập phá nhà.', 5); }
        else if (L.type === 'family') { log('Người thân thương tình, xóa khoản nợ cho bạn.', 'neutral'); }
        else { var part = Math.min(L.bal * 0.2, Math.max(0, life.money - F.debt)); F.debt += part; log('Khoản ' + L.name + ' bị chuyển cho công ty thu hồi nợ. Trả được một phần, phần còn lại bị xóa — nhưng tên bạn nằm trong danh sách nợ xấu nhiều năm.', 'bad'); life.credit = { bad: true, since: a }; H.fx(life, { hap: -6 }); }
        L.bal = 0; L.closed = true; return;
      }
      var due = L.pay ? Math.min(L.bal, L.pay) : Math.min(L.bal, Math.max(L.bal * L.minShare, L.type === 'home' ? b * 0.25 : 0)); // v4.4: trả góp có kỳ hạn, số tiền cố định mỗi năm
      var avail = life.money + income + F.partner - F.food - F.rent - F.kids - F.travel - F.parents - F.health - F.debt;
      var paid = avail >= due ? due : Math.max(0, Math.min(due, avail * 0.6));
      L.bal -= paid; F.debt += paid;
      if (L.pay && paid > 0.01) { L.paidN = (L.paidN || 0) + 1; log('Góp tiền trả góp ' + (E.loanWhat ? E.loanWhat(life, L) : L.name) + ' năm thứ ' + L.paidN + (L.term ? '/' + L.term : '') + ': ' + fmtMoney(life, paid) + (L.bal > 0.5 ? ' · còn nợ ' + fmtMoney(life, L.bal) : ' · đã trả xong') + '.', 'money'); }
      if (paid < due * 0.95) {
        L.late = (L.late || 0) + 1; L.lateTot = (L.lateTot || 0) + 1;
        if (/^(bank|home|car|card|paylater|fin)$/.test(L.type)) {
          if (!(life.credit && life.credit.bad)) {
            life.credit = { bad: true, since: a, last: a };
            log('Trễ hạn ' + L.name + ' — bị ghi nhận nợ xấu trên CIC. Từ nay khó vay ngân hàng.', 'bad'); H.fx(life, { hap: -5 });
            H.mem(life, 'Ngày ngân hàng gọi báo bạn đã thành nợ xấu.', 3);
          } else life.credit.last = a;
        }
        if (L.type === 'appden' || L.type === 'nong') life.flags.thugDebt = true;
      } else L.late = 0;
    });
    // v2.4: hết nợ & không trễ hạn thêm 5 năm thì thông tin nợ xấu được xóa khỏi CIC (trước đây hiện "nợ xấu từ năm 2047" đến tận cuối đời)
    if (life.credit && life.credit.bad && a - (life.credit.last != null ? life.credit.last : life.credit.since) >= 5 &&
      !(life.loans || []).some(function (L) { return L.late > 0 && L.bal > 0.5; })) {
      life.credit = { bad: false, since: null };
      log('Đã 5 năm không còn trễ hạn: thông tin nợ xấu được xóa khỏi CIC, hồ sơ tín dụng sạch trở lại.', 'good'); H.fx(life, { hap: 3 });
    }
    // v2.4: ngân hàng không để khoản vay mua nhà kéo dài đến tuổi già — đến 75 tuổi phải tất toán
    (life.loans || []).forEach(function (L) {
      if (L.type !== 'home' || L.bal <= 0.5 || a < 75) return;
      var kidsHelp = life.kids.filter(function (k) { return k.alive && a - k.born >= 25; }).length;
      if (life.money - F.debt >= L.bal) { F.debt += L.bal; log('Dùng tiền tích lũy tất toán khoản vay mua nhà trước khi quá già.', 'good'); }
      else if (kidsHelp && life.money - F.debt + life.base * kidsHelp * 2 >= L.bal) { var own = Math.max(0, Math.min(life.money - F.debt, L.bal)); F.debt += own; log('Các con góp tiền trả nốt khoản vay mua nhà cho ' + (life.sex === 'M' ? 'bố' : 'mẹ') + '.', 'good'); H.mem(life, 'Ngày các con góp tiền trả hết nợ nhà cho mình.', 4); }
      else if (life.ownHouse) { var left = Math.max(0, life.houseVal * 0.9 - L.bal); life.money += left; life.ownHouse = false; life.houseVal = 0; log('Không trả nổi khoản vay mua nhà ở tuổi ' + a + ', phải bán nhà trả ngân hàng' + (left > 0 ? ', còn dư ' + fmtMoney(life, left) + '.' : '.'), 'bad'); H.fx(life, { hap: -10 }); H.mem(life, 'Ngày bán căn nhà đã ở mấy chục năm để trả nợ.', 5); }
      L.bal = 0; L.closed = true;
    });
    capUnsecured();
    life.loans = (life.loans || []).filter(function (L) { if (L.bal <= 0.5) { if (L.type === 'home' && !L.closed) { log('Trả hết khoản vay mua nhà.', 'good'); H.fx(life, { hap: 4 }); } return false; } return true; });
    // tiêu dùng: một phần thu nhập dư
    var ess = F.food + F.rent + F.travel + F.kids + F.parents + F.health + F.debt;
    var surplus = income + F.partner - ess;
    var share = { save: 0.5, normal: 0.75, lavish: 0.95 }[life.spend] || 0.75; // v7.1: tiêu dùng tăng theo thu nhập dư (trước 0,35 / 0,6 / 0,95) — tiết kiệm sát thực tế hơn
    if (life.spend === 'lavish' && life.money > b * 8) share = Math.min(0.97, share + Math.min(0.3, (life.money / b - 8) / 80)); // V5: chỉ tự nâng ngân sách khi chủ động chọn sống thoải mái
    if (life.retired || a >= 62) share = Math.max(share, 0.92); // v7.1: về già tiêu dần khoản dư (sức khỏe, con cháu, hiếu hỉ) thay vì tiếp tục tích lũy
    F.life = life.money >= 0 && surplus > 0 ? surplus * share : 0;
    if (focus === 'rest') F.life += b * 0.06;
    if (life.money < 0) { F.life = 0; var cut = Math.max(0, ess - Math.max(ess * 0.8, income + F.partner)); F.food -= Math.min(cut, F.food * 0.2); }
    F.interest = life.money < 0 ? life.money * 0.06 : life.money * 0.001;
    if (F.interest > 0) F.interest *= difficulty(life).passive;
    var spend = F.food + F.rent + F.travel + F.kids + F.parents + F.health + F.debt + F.life;
    life.money += income + F.partner + F.interest - spend;
    F.spend = spend; F.save = income + F.partner + F.interest - spend;
    if (life.money < -b * 3) {
      life.money = -b * 3;
      if (!life.flags.debtHelp) { life.flags.debtHelp = true; log(life.kids.some(function (k) { return k.alive && a - k.born >= 22; }) ? 'Các con góp tiền giúp trả bớt nợ.' : 'Được người thân giúp đỡ trả bớt nợ.', 'neutral'); }
    }
    if (life.ownHouse) life.houseVal *= 1 + ((life.birthYear + a) % 5 === 0 ? -.025 : .008);
    if (life.vehVal) life.vehVal *= 0.88;
    if (life.mortgage > 0) { // khoản vay mua nhà kiểu cũ (bản 1.0)
      life.mortgage *= 1.07;
      var pay = Math.min(life.mortgage, Math.max(b * 0.25, life.mortgage * 0.08));
      life.mortgage -= pay; life.money -= pay; F.debt += pay; F.spend += pay; F.save -= pay;
      if (life.mortgage < 0.5) { life.mortgage = 0; log('Trả hết khoản vay mua nhà.', 'good'); H.fx(life, { hap: 4 }); }
    }
    life.income = income;
    // còn tài sản bán được thì chưa phải nợ nần
    if (life.money + assetTotal(life) < -b * 2 && !life.flags.debtNoted) { life.flags.debtNoted = true; log('Nợ nần chồng chất, những đêm mất ngủ vì lo trả nợ.', 'bad'); H.fx(life, { hap: -6 }); }
    if (life.money > 0) life.flags.debtNoted = false;
    life.fin = F;
    if (E.RELATIVE163 && p) E.RELATIVE163.close(life, p, p.age, F.partner);
    return F;
  }

  function finishYear(life) {
    if (!life.alive) return [];
    life._yearRun = true;
    var r = RF(life), a = life.age, out = [];
    var log = function (t, k) { if (k !== 'big' && k !== 'death' && k !== 'money' && schoolOff(life, t)) return; if (E.famLogic && k !== 'death' && k !== 'money') { t = E.famLogic(life, t, true); if (t == null) return; } var e = { a: a, y: life.birthYear + a, t: E.lossText ? E.lossText(life, famFix(life, t), k) : famFix(life, t), k: k || '' }; life.log.push(e); out.push(e); }; // v3.5: chưa / không đi học thì không có chuyện trên lớp
    var f = life.fam, st = life.st;
    var focus = a < 6 ? 'baby' : life.focus === 'baby' ? 'study' : life.focus;
    if (a >= 6 && life.focus === 'baby') life.focus = 'study';
    if (a < 15 && focus === 'work') focus = 'study';
    if (a < 21 && focus === 'balance') focus = a < 15 ? 'study' : 'social';
    var inJail = life.jailUntil != null && a < life.jailUntil;
    if (!life.yr) life.yr = { items: [] };

    // ---- Sức đề kháng & tiêm chủng ----
    if (a === 0) {
      var vac = f.q >= 3 || (f.q === 2 && r() < 0.8) || (f.q === 1 && r() < (life.gdp < 5 ? 0.35 : 0.65));
      life.vac = vac;
      life.imm = U.clamp(50 + (vac ? 20 : -10) + (f.q - 3) * 5 + Math.log(Math.max(0.6, life.gdp) / 10) * 6 + U.normal(r) * 8, 5, 95);
      log(vac ? (f.q >= 4 ? 'Được tiêm đủ các mũi vắc-xin, kể cả vắc-xin dịch vụ.' : 'Được tiêm chủng mở rộng đầy đủ.') : 'Nhà nghèo, ở xa trạm y tế — bạn không được tiêm chủng đầy đủ.', vac ? 'neutral' : 'bad');
    }
    if (a >= 1 && a <= 12) {
      var pSick = 0.08 * (1.6 - life.imm / 100) * (f.q <= 1 ? 1.3 : 1);
      if (r() < pSick) {
        log(U.pick(r, ['Bị sốt cao phải nhập viện vài ngày.', 'Bị viêm phổi, nằm viện một tuần.', 'Bị tay chân miệng, cả nhà một phen lo lắng.', life.vac ? 'Bị cúm mùa, sốt li bì mấy hôm.' : 'Bị sởi vì chưa tiêm phòng, mẹ thức trắng mấy đêm.']), 'bad');
        st.hea -= 6; if (f.q <= 2) H.mem(life, 'Những đêm mẹ bế bạn chạy lên trạm xá giữa trời mưa.', 2);
      }
    }

    // ---- Học hành ----
    if (a === 6) {
      if (life.fam.q >= 3 || r() < eduP(life).prim) { life.school = 'primary'; log(isVN(life) ? 'Vào lớp 1. Mặc áo trắng, đeo chiếc cặp mới đến trường.' : 'Bắt đầu đi học tiểu học.', 'good'); H.mem(life, 'Ngày đầu tiên đến trường, nắm chặt tay mẹ không chịu buông.', 3); }
      else { life.school = null; log('Không được đến trường — nhà quá nghèo, trường lại xa.', 'bad'); st.hap -= 4; }
    }
    if (life.school) life.yearsInSchool++;
    if (a === 11 && life.school === 'primary') {
      life.edu = 1;
      if (life.fam.q >= 4 || r() < eduP(life).lower) { life.school = 'lower'; log('Học xong tiểu học, lên ' + (isVN(life) ? 'lớp 6' : 'trung học cơ sở') + '.', 'neutral'); }
      else { life.school = null; log(f.q <= 2 ? 'Nhà nghèo, học hết tiểu học thì phải nghỉ ở nhà phụ giúp bố mẹ.' : life.urban ? 'Học lực yếu, thi không đỗ vào lớp 6 trường công, gia đình đành cho nghỉ học.' : 'Trường cấp hai ở xa, đường sá cách trở, học hết tiểu học thì phải nghỉ học.', 'bad'); st.hap -= 3; }
    }
    if (life.school && life.schoolEnd != null && a + 1 >= life.schoolEnd && !(E.gradFail && E.gradFail(life, r, log, a))) { // v3.9: đại học phải bảo vệ đồ án / khóa luận mới ra trường
      var sc = life.school; life.school = null; life.schoolEnd = null;
      if (sc === 'upper' || sc === 'priv') {
        life.edu = Math.max(life.edu, 3);
        log(isVN(life) ? 'Tốt nghiệp THPT.' : 'Tốt nghiệp trung học phổ thông.', 'good'); life.flags.uniNext = a + 1;
        runHooks('gradUpper', [life, r, log]);
      } else if (sc === 'voc') { life.edu = Math.max(life.edu, 4); log('Hoàn thành chương trình học nghề.', 'good'); life.flags.needJob = true; }
      else if (sc === 'uni' || sc === 'abroad') {
        life.edu = Math.max(life.edu, 5); log('Tốt nghiệp đại học ngành ' + (life.majorName || MAJORS[life.major]) + (sc === 'abroad' ? ' ở ' + (life.abroad ? life.abroad.name : 'nước ngoài') : life.uniCity ? ' ở ' + life.uniCity : '') + '.', 'big'); st.hap += 6;
        H.mem(life, 'Lễ tốt nghiệp — bố mẹ đứng dưới khán đài, mắt rưng rưng.', 4);
        if (sc === 'abroad') H.sched(life, 'du_hoc_ve', 1);
        else {
          if (life.cityStudent && r() < 0.7 && !life.movedTo) { moveToCity(life, life.cityStudent.city); log('Quyết định ở lại ' + life.cityStudent.city + ' lập nghiệp sau khi ra trường.', 'neutral'); }
          life.cityStudent = null;
          if (r() < 0.25 + (st.kno - 60) / 100) life.flags.postNext = a + 1; else life.flags.needJob = true;
        }
      } else if (sc === 'post') { life.edu = Math.max(life.edu, 6); log('Nhận bằng thạc sĩ' + (life.major ? ' ngành ' + (life.majorName || MAJORS[life.major]) : '') + '.', 'big'); life.flags.needJob = true; H.mem(life, 'Ngày nhận bằng thạc sĩ.', 3);
        if (!life.job && r() < 0.18 + (st.kno - 70) / 120) { life.flags.needJob = false; life.pending.push(DEC.phd.make(life, r)); } } // v3.0: có thể học tiếp tiến sĩ
      else if (sc === 'phd') { life.edu = 7; log('Bảo vệ thành công luận án, nhận học vị tiến sĩ' + (life.major ? ' ngành ' + (life.majorName || MAJORS[life.major]) : '') + '.', 'big'); st.hap += 6; life.flags.needJob = true; H.mem(life, 'Ngày bảo vệ luận án tiến sĩ, hội đồng đứng dậy bắt tay bạn.', 5); }
      else if (sc === 'police') {
        life.edu = Math.max(life.edu, 5);
        var tk = life.flags.policeTrack || 'cong_an';
        log('Tốt nghiệp ' + (tk === 'cong_an' ? 'học viện cảnh sát' : 'trường sĩ quan') + ', được phong quân hàm Thiếu úy.', 'big');
        E.startJob(life, tk, r, log); H.mem(life, 'Ngày được gắn quân hàm Thiếu úy.', 4);
      }
    }
    if (life.flags.needJob && life.job) { life.flags.needJob = false; life.flags.upgradeJob = true; }
    if (life.alive && life.flags.postNext === a + 1 && !life.school) { life.flags.postNext = null; life.pending.push(DEC.post.make(life, r)); }

    // ---- Nghĩa vụ quân sự ----
    if (life.flags.military && a >= life.flags.military) {
      life.flags.military = null; if (!life.flags.milVet) log('Hoàn thành nghĩa vụ quân sự, xuất ngũ trở về.', 'good');
      if (isVN(life) && !life.job && r() < 0.12) { E.startJob(life, 'quan_doi', r, log, true); }
      else if (!life.job) life.flags.needJob = true;
    }

    // ---- Lao động có thời hạn ở nước ngoài: hết hạn về nước ----
    if (life.abroad && !life.abroad.perm && !life.abroad.study && !life.abroad.trapped && a + 1 >= life.abroad.until) {
      var stay = r() < 0.12;
      if (stay) { life.abroad.until += 3; log('Gia hạn hợp đồng, ở lại ' + life.abroad.name + ' thêm 3 năm.', 'neutral'); }
      else {
        log('Hết hợp đồng, trở về Việt Nam sau những năm làm việc ở ' + life.abroad.name + '.', 'big');
        H.mem(life, 'Ngày trở về sau những năm làm việc ở ' + life.abroad.name + ', mẹ chạy ra ôm chầm lấy bạn.', 4);
        life.abroad = null; life.job = life.prevJob || null; life.prevJob = null; if (!life.job) life.flags.needJob = true; st.soc += 5; st.hap += 4;
        if (life.flags.famDebt && life.money > life.base) { life.flags.famDebt = false; log('Dùng tiền dành dụm trả hết nợ cho gia đình.', 'good'); H.cash(life, -life.base * 0.8, 'Trả nợ cho gia đình'); H.fx(life, { hap: 8, karma: 5 }); H.mem(life, 'Ngày trả hết nợ cho bố mẹ.', 5); }
      }
    }

    // ---- Sự nghiệp & thu nhập ----
    var income = 0;
    if (inJail) log('Một năm nữa trôi qua sau song sắt' + (life.jailUntil - a > 1 ? ' — còn ' + (life.jailUntil - a - 1) + ' năm.' : '.'), 'bad');
    else income = E.careerYear(life, r, log, focus);
    if (income > 0 && E.economy114Income) income = E.economy114Income(life, income);
    if (income > 0) income *= difficulty(life).income;
    // v2.4: đã có lương hưu mà vẫn kinh doanh / làm thêm thì vẫn nhận lương hưu
    if (!life.retired && life.job && life.pensioned && life.pensionInc) income += life.pensionInc * difficulty(life).pension;
    if (!life.alive) { clampSt(life); return out; } // mất giữa năm (tai nạn nghề nghiệp, thanh toán băng nhóm…)
    var kidIncome = 0;
    if (life.retired) {
      // v2.8: không có lương hưu thì ở VN chỉ có trợ cấp hưu trí xã hội 500.000 đ/tháng từ 75 tuổi (hộ nghèo từ 70)
      income = life.pensioned ? (life.pensionInc != null ? life.pensionInc : (life.lastIncome || life.base) * 0.55) : isVN(life) && life.cur === 'vnd' && !(life.abroad && life.abroad.perm) ? (a >= (life.fam.q <= 2 ? 70 : 75) ? 6 : 0) : life.base * 0.05;
      life.kids.forEach(function (k) { if (k.alive && a - k.born >= 25) kidIncome += E.kidSupport ? E.kidSupport(life, k) : life.base * 0.12; });
      income += kidIncome;
      if (income > 0) income *= difficulty(life).pension;
    }
    if (!life.indep && a >= 18 && !life.school && !(life.job && life.job.id === 'phu_giup')) life.indep = true;
    if (life.job && life.job.id === 'phu_giup' && a >= 20) life.indep = true;
    var F = finance(life, r, a, focus, income, log);
    if (life.indep && (income > 0 || F.spend > 0) && !inJail) {
      var mo = income / 12;
      log((income > 0 ? (life.retired ? (life.pensioned ? 'Lương hưu' : 'Trợ cấp') + (kidIncome > 0 ? ' & con cái biếu ' : ' ') : 'Thu nhập ') + fmtMoney(life, mo) + '/tháng' : 'Không có thu nhập') +
        (F.partner > 0 ? ' · ' + partnerWord(life, life.partner) + ' góp thêm ' + fmtMoney(life, F.partner / 12) + '/tháng' : '') +
        (E.incomeSrc ? E.incomeSrc(life, F, income) : '') + // v3.0: thu nhập đến từ đâu (lương, kinh doanh, cho thuê, lãi tiết kiệm…)
        ' · cả năm chi ' + fmtMoney(life, F.spend) + (F.debt > 0 ? ' (gồm ' + fmtMoney(life, F.debt) + ' trả nợ)' : '') + ' · ' + (F.save >= 0 ? 'để dành được ' + fmtMoney(life, F.save) : 'hụt ' + fmtMoney(life, -F.save)) + '.', 'money');
    }

    // ---- Bạn đời ----
    if (E.syncKnownDeaths) E.syncKnownDeaths(life, a);
    var p = life.partner;
    if (p) {
      p.age++;
      if (p.status === 'dating' && a - p.since >= 1 && r() < 0.12) { var why = E.breakupWhy ? E.breakupWhy(life, p, r) : null; log('Chia tay ' + p.name + (why ? '. ' + why.t : '.'), 'bad'); H.mem(life, why && why.m ? why.m : 'Cuộc chia tay với ' + p.name + ' dưới cơn mưa.', 2); life.partner = null; life.exes++; st.hap -= 7; }
      else if (r() < qBase(p.sex === 'M' ? life.mortM : life.mortF, p.age)) {
        log((partnerWord(life, p) === 'người bạn đời' ? 'Người bạn đời ' : U.cap(partnerWord(life, p)) + ' ') + p.name + ' qua đời ở tuổi ' + p.age + (function (c) { return /thanh thản/.test(c) ? ', ' + c : ' vì ' + c; })(H.deathCause(p.age, r)) + '.', 'bad');
        H.mem(life, 'Ngày tiễn ' + p.name + ' về với đất — một nửa của bạn đã đi xa.', 6);
        life.partner = null; p.alive = false; p.died = a;
        if (p.status !== 'dating') life.widowed++; else life.flags.lateDating = p.name;
        if (E.personDied) E.personDied(life, p, a); // v7.2: bạn thân / người cũ cùng là người này cũng được ghi là đã mất
        st.hap -= 18; st.hea -= 4;
      }
    }

    // ---- Con cái & cháu ----
    life.kids.forEach(function (k) {
      if (!k.alive) return;
      var ka = a - k.born;
      var kq = ka === 0 ? life.mort.q0 : ka < 5 ? life.mort.q14 * (k.vac === false ? 1.6 : 1) : qBase(life.mort, ka) * 0.8;
      if (r() < kq) {
        k.alive = false; k.died = a;
        log('Con ' + k.name + ' qua đời khi ' + (ka === 0 ? 'chưa tròn một tuổi' : 'mới ' + ka + ' tuổi') + ' vì ' + U.pick(r, ka < 5 ? ['viêm phổi', 'sốt cao', 'nhiễm trùng', 'tiêu chảy cấp'] : ka < 30 ? ['tai nạn giao thông', 'đuối nước', 'bệnh hiểm nghèo'] : ['bệnh nặng', 'tai nạn', 'ung thư']) + '.', 'bad');
        H.mem(life, 'Nỗi đau mất con — ' + k.name + ' mãi mãi ' + ka + ' tuổi.', 8);
        st.hap -= 22; st.hea -= 4;
        return;
      }
      if (ka >= 1 && ka <= 6 && r() < (k.vac === false ? 0.12 : 0.06)) { log('Con ' + k.name + ' ốm phải nhập viện nhi, ' + (life.partner && life.partner.alive ? (life.partner.status === 'married' && life.partner.sex !== life.sex ? 'vợ chồng' : 'hai người') + ' thay nhau trực.' : 'một mình bạn thức trắng trông con.'), 'bad'); H.cash(life, -life.base * 0.04, 'Viện phí cho con'); st.hap -= 2; }
      if (ka === 6) log('Con ' + k.name + ' vào lớp 1.', 'good');
      // v2.3: chuyện con 18 tuổi đi học hay đi làm do module mở rộng xử lý (tình huống con_18)
      var marriageHandled = E.childMarriage126 && E.childMarriage126(life, k, r, log);
      if (!marriageHandled && ka >= 23 && ka <= 35 && !k.married && !(k.future126 && k.future126.match) && r() < 0.15) { k.married = true; log('Con ' + k.name + ' lập gia đình.', 'good'); H.cash(life, -life.base * 0.25, 'Lo đám cưới cho con'); st.hap += 4; H.mem(life, 'Dắt tay ' + k.name + ' trong ngày cưới của con.', 4); }
      if (k.married && ka <= 45 && k.kids < 3 && r() < 0.14) {
        k.kids++; life.grand++;
        log((life.grand === 1 ? 'Lên chức ông bà: ' : 'Có thêm cháu: ') + 'con ' + k.name + ' sinh ' + (r() < 0.5 ? 'bé trai' : 'bé gái') + '.', 'good'); st.hap += 5;
        if (life.grand === 1) H.mem(life, 'Lần đầu bế cháu nội ngoại — tiếng gọi "ông bà" đầu tiên.', 4);
      }
      if (ka >= 45 && k.kids > 0 && life.ggrand < 6 && life.flags.ggAt !== a && r() < 0.05) { life.ggrand++; life.flags.ggAt = a; log(life.ggrand === 1 ? 'Có chắt — bốn thế hệ cùng chung một nhà.' : 'Có thêm chắt, nay đã ' + life.ggrand + ' đứa chắt.', 'good'); st.hap += 4; }
    });

    // ---- Bố mẹ ----
    if (a >= 1) { if (!f.mCareer) parentYear(life, r, log, 'm'); if (!f.noDad && !f.fCareer) parentYear(life, r, log, 'f'); } // v7.3: bố / mẹ là nhân vật đời trước thì đi đúng con đường sự nghiệp đã sống
    var mCause = null;
    if (f.mAlive && !(life.flags.heirKeep && life.flags.heirKeep.m != null && a <= life.flags.heirKeep.m) && r() < qBase(life.mortF, f.mAge + a)) { f.mAlive = false; mCause = H.deathCause(f.mAge + a, r); log('Mẹ qua đời ở tuổi ' + (f.mAge + a) + (function (c) { return /thanh thản/.test(c) ? ', ' + c : ' vì ' + c; })(mCause) + '.', 'bad'); st.hap -= 14; H.mem(life, 'Ngày mẹ ra đi. Từ nay không còn ai gọi bạn về ăn cơm.', 7); }
    if (f.fAlive && !(life.flags.heirKeep && life.flags.heirKeep.f != null && a <= life.flags.heirKeep.f) && r() < qBase(life.mortM, f.fAge + a) * (f.vice === 'alcohol' || f.vice === 'drugs' ? 1.8 : f.vice === 'gang' ? 1.5 : 1)) { f.fAlive = false; var fCause = H.deathCause(f.fAge + a, r, f.vice), tries = 0; while (mCause && fCause === mCause && !/tai nạn|tuổi già|thanh thản/.test(fCause) && tries++ < 8) fCause = H.deathCause(f.fAge + a, r, f.vice); // v3.0: bố mẹ mất cùng năm không trùng một bệnh
      log('Bố qua đời ở tuổi ' + (f.fAge + a) + (mCause && fCause === mCause && /tai nạn/.test(fCause) ? ' — cùng mẹ, trong một vụ ' + fCause : mCause && fCause === mCause ? ', cùng năm với mẹ, ' + (/thanh thản/.test(fCause) ? fCause : 'vì ' + fCause) : (function (c) { return /thanh thản/.test(c) ? ', ' + c : ' vì ' + c; })(fCause)) + '.', 'bad'); st.hap -= 14; H.mem(life, 'Ngày bố ra đi, bạn mới hiểu những lời bố nói năm xưa.', 7); }
    if (!f.mAlive && !f.fAlive) life.flags.caring = false;

    // ---- Thú cưng ----
    pets(life).forEach(function (pt) {
      var pa = a - pt.since, P = PETS[pt.k] || PETS['chó'];
      if (pa >= pt.life || (pa >= pt.life - 2 && r() < 0.25)) {
        pt.alive = false; pt.died = a;
        log(U.cap(petLabel(pt)) + ' ' + pt.n + ' già yếu rồi ra đi sau ' + Math.max(1, pa) + ' năm bên bạn.' + (pt.k === 'chó' || pt.k === 'mèo' ? ' Bạn chôn ' + pt.n + ' dưới gốc cây.' : ''), 'bad');
        st.hap -= pt.k === 'chó' || pt.k === 'mèo' ? 8 : 3;
        if (pt.k === 'chó' || pt.k === 'mèo' || pa >= 5) H.mem(life, 'Ngày tiễn ' + pt.n + ' — ' + petLabel(pt) + ' đã ở bên bạn ' + Math.max(1, pa) + ' năm.', pa >= 8 ? 5 : 3);
      } else if (pa >= 1) st.hap += P.hap * (life.widowed && !life.partner ? 0.9 : 0.5);
    });

    // ---- Module mở rộng (tài sản, tâm lý, đời con cái…) ----
    runHooks('year', [life, r, log, a, F]);
    if (!life.alive) { clampSt(life); return out; }

    // ---- Bạn thân ----
    var bf = life.bff;
    if (bf && bf.alive && a > bf.since) {
      bf.close = U.clamp((bf.close || 60) + U.normal(r) * 4 - (life.abroad ? 3 : 0), 0, 100);
      if (r() < qBase(life.mort, a) * 1.1 + (a >= 16 && a <= 40 ? 0.002 : 0)) {
        bf.alive = false; bf.died = a;
        if (life.partner && life.partner.name === bf.name && E.partnerGone) E.partnerGone(life, a);
        if (E.personDied) E.personDied(life, bf, a);
        var why = U.pick(r, a < 40 ? ['tai nạn giao thông', 'đuối nước', 'một cơn bạo bệnh'] : ['ung thư', 'đột quỵ', 'bệnh tim']);
        log('Hung tin: ' + bf.name + ' — người bạn thân từ thuở nhỏ — qua đời vì ' + why + '.', 'bad');
        H.mem(life, 'Ngày tiễn ' + bf.name + ', người bạn thân nhất. Bạn đặt lên mộ ' + (bf.token || 'chiếc ảnh chụp chung năm cấp ba') + '.', 7);
        H.fx(life, { hap: -16, soc: -6 });
      }
    }

    // ---- Sự kiện ngẫu nhiên kể chuyện (tối đa 2) ----
    if (!inJail && !(life.flags.military && a < life.flags.military) && !(life.abroad && life.abroad.trapped)) { // v3.3: trong quân ngũ / v3.8: trong trại lừa đảo không có chuyện đời thường bên ngoài
      var n = 0;
      var evs = EVENTS.slice();
      for (var i = evs.length - 1; i > 0; i--) { var jj = Math.floor(r() * (i + 1)); var tmp = evs[i]; evs[i] = evs[jj]; evs[jj] = tmp; }
      var evAt = life.flags.evAt || (life.flags.evAt = {});
      for (var e = 0; e < evs.length && n < 2 && life.alive; e++) {
        var ev = evs[e], ei = EVENTS.indexOf(ev);
        if (!ev.c(life, a)) continue;
        var pr = typeof ev.p === 'function' ? ev.p(life, a) : ev.p;
        if (pr < 1 && !ev.rep && evAt[ei] != null && a - evAt[ei] < (ev.cd || 3)) continue; // v3.0: chuyện kể ngẫu nhiên không lặp lại năm nào cũng như năm nào
        if (r() < pr) { var o0 = out.length, i0 = life.yr.items.length; ev.run(life, a, r, E.PACE145 && E.PACE145.quietLog ? E.PACE145.quietLog(life, log) : log); /* GĐ5: không kể lại câu giống hệt trong 6 năm */ moneyNote(life, life.yr.items, i0, out.slice(o0), log); if (pr < 1) { n++; evAt[ei] = a; } }
      }
    }
    if (!life.alive) { clampSt(life); return out; }

    // ---- Bệnh: khỏi bệnh? ----
    // v2.4: càng già, cơ hội khỏi càng giảm theo từng năm (không chỉ theo tuổi lúc phát bệnh)
    if (life.ill && life.ill.since < a && r() < life.ill.cure * Math.min(1, illAgeK(a) / illAgeK(life.ill.since)) * (a >= 85 && /^ung thư/.test(life.ill.n) ? 0.3 : 1)) { // v3.4: ung thư ở tuổi rất cao hiếm khi thuyên giảm hoàn toàn
      var IL = life.ill, chronic = IL.chronic || ILLS.some(function (x) { return x.n === IL.n && x.chronic; });
      life.illHist = life.illHist || []; if (life.illHist.indexOf(IL.n) < 0) life.illHist.push(IL.n);
      // bệnh mạn tính không "khỏi": được kiểm soát ổn định, vẫn phải uống thuốc suốt đời
      if (chronic) { log(U.cap(IL.n) + ' đã được kiểm soát ổn định — uống thuốc đều, tái khám định kỳ.', 'good'); life.flags.chronic = (life.flags.chronic || 0) + 1; st.hap += 3; }
      else { log((/^ung thư/.test(IL.n) ? 'Điều trị thành công, ' + IL.n + ' thuyên giảm hoàn toàn.' : 'Đã khỏi ' + IL.n + '.'), 'good'); st.hap += 6; }
      life.ill = null;
    }

    // ---- Chỉ số ----
    var fH = { study: -0.5, health: 3, social: 0.5, work: -2, rest: 1.5, balance: 1, baby: 0 }[focus] || 0;
    var fHap = { study: -1, health: 1, social: 2, work: -1.5, rest: 3, balance: 1, baby: 0 }[focus] || 0;
    var fK = { study: 1.5, health: 0, social: 0, work: 0.3, rest: -0.5, balance: 0.6, baby: 0 }[focus] || 0;
    var fS = { study: -1, health: 0, social: 4, work: -2, rest: 1, balance: 1, baby: 0 }[focus] || 0;
    st.hea += (hRef(a) - st.hea) * 0.12 + fH + U.normal(r) * 2.5 + (f.q - 3) * 0.3 - (life.flags.smoke ? 0.6 : 0) - (life.ill ? 2.5 : 0) + (life.flags.exercise ? 0.4 : 0) - (life.addict && life.addict.alcohol ? 1 : 0) - (life.addict && life.addict.drugs ? 3 : 0) - (inJail ? 1.5 : 0);
    var lnG = Math.log(Math.max(0.6, life.gdp) / 10) * 3;
    var hasP = life.partner && life.partner.status !== 'dating';
    var tgt = 52 + lnG + (f.q - 3) * 2 + (hasP ? 7 : life.partner ? 3 : 0) + (life.kids.some(function (k) { return k.alive; }) ? 3 : 0) +
      (st.hea - 60) * 0.15 + (st.soc - 50) * 0.12 + (life.indep && life.money < 0 ? -6 : 0) +
      (a >= 18 && !life.job && !(life.ventures || []).length && !life.school && !life.retired && !life.flags.military && !(life.partner && life.partner.status === 'married' && life.sex === 'F' && r() < 0.5) ? -6 : 0) +
      (life.orient !== 'straight' && life.realized && !life.out && a >= 16 ? -3 : 0) + (life.abroad && !life.abroad.perm ? -3 : 0) +
      (a < 18 && f.vice ? -4 : 0) + (inJail ? -12 : 0) + (life.flags.thugDebt ? -6 : 0) + (life.spend === 'lavish' ? 2 : life.spend === 'save' ? -1 : 0) + (life.bff && life.bff.alive ? 2 : 0);
    st.hap += (tgt - st.hap) * 0.22 + fHap + U.normal(r) * 3;
    st.kno += (a < 6 ? 1 : life.school ? 1 : 0) + fK - 0.2 - (a > 65 ? 0.6 : 0) + U.normal(r) * 1;
    var sT = 50 + (hasP ? 8 : 0) + Math.min(10, life.kids.length * 2) + (life.grand ? 4 : 0) + (life.bff && life.bff.alive ? 4 : 0);
    st.soc += (sT - st.soc) * 0.12 + fS + U.normal(r) * 2;
    clampSt(life);

    // ---- Tử vong ----
    var hm = U.clamp(Math.exp((hRef(a) - st.hea) / 22), 0.4, 4);
    var qx = qBase(life.mort, a);
    if (a < 5) qx *= Math.sqrt(hm) * (life.vac === false ? 1.3 : 1);
    else {
      // CAL bù lại phần tử vong cộng thêm từ bệnh nặng, thuốc lá, tai nạn & tình huống để tuổi thọ khớp số liệu thật
      qx *= hm * CAL;
      if (life.ill) qx *= life.ill.mult;
      if (life.flags.smoke) qx *= 1.3;
      if (life.addict && life.addict.drugs) qx *= 2;
    }
    if (life.flags.gaveBirth) { qx += life.u5 * 4 / 100000; life.flags.gaveBirth = false; }
    qx = Math.min(0.97, qx);
    if (a >= 115) qx = 1;
    if (r() < qx) {
      var cause = deathCause(life, a, r);
      life.alive = false; life.pending = []; life.death = { age: a, cause: cause, year: life.birthYear + a, sudden: /tai nạn|đuối nước|bạo lực|nhồi máu|đột quỵ/.test(cause) && !life.ill };
      log('Qua đời vì ' + cause + ' ở tuổi ' + a + '.', 'death');
    }

    // v3.0: một dòng nhật ký y hệt đã có trong 8 năm gần đây (hoặc vừa ghi trong năm) thì không ghi lại — tránh nhật ký lặp đi lặp lại
    var seenT = {}, li0 = life.log.length - out.length;
    for (var li = li0 - 1; li >= 0 && life.log[li].a >= a - 8; li--) seenT[life.log[li].t] = 1;
    var dropT = out.filter(function (x) { var dup = (/^(neutral|quiet|good|)$/.test(x.k || '') && !/\d/.test(x.t) && seenT[x.t]) || (x.k !== 'big' && x.k !== 'death' && schoolOff(life, x.t)); seenT[x.t] = 1; return dup; });
    if (dropT.length && dropT.length === out.length) dropT.pop(); // năm nào cũng phải có ít nhất một dòng nhật ký
    if (dropT.length) { life.log = life.log.filter(function (x) { return dropT.indexOf(x) < 0; }); out = out.filter(function (x) { return dropT.indexOf(x) < 0; }); }

    // ---- Một dòng kể về năm nay nếu năm trôi qua lặng lẽ ----
    if (life.alive && !out.some(function (x) { return x.k !== 'money'; })) {
      var line = yearLine(life, a, r);
      for (var tries = 0; line && seenT[line] && tries < 6; tries++) line = yearLine(life, a, r); // v4.1: chọn câu khác nếu câu này đã có trong 8 năm gần đây
      if (line && seenT[line] && E.quietYear) line = E.quietYear(life, a, r);
      else if (line && seenT[line]) line = ['Một năm bình lặng trôi qua.', 'Ngày tháng cứ thế trôi, không có gì đặc biệt.', 'Một năm nữa, cơm áo gạo tiền.', 'Một năm trôi qua, không có gì đáng kể.'].filter(function (t) { return !seenT[t]; })[0] || line;
      var hasYr = false; for (var lj = life.log.length - 1; lj >= 0 && life.log[lj].a === a; lj--) if (life.log[lj].k !== 'money') hasYr = true;
      if (line && (!seenT[line] || !hasYr)) log(line, 'quiet');
    }

    life.yrs.push({ a: a, hap: Math.round(st.hap), hea: Math.round(st.hea) });
    return out;
  }

  function yearLine(l, a, r) {
    for (var i = 0; i < LINES.length; i++) {
      var s = LINES[i](l, a, r);
      if (s) return s;
    }
    return '';
  }

  function deathCause(life, a, r) {
    if (life.ill && r() < 0.75 && a >= 15) return life.ill.f;
    var vn = isVN(life), low = life.gdp < 5, pool = life.pool;
    var africa = /^(afr|afw|afe|afs|et|so|ss|mg|ao)$/.test(pool);
    var tropic = vn || africa || /th|kh|la|mm|id|ph|my|in|bd|br|es_la|pac|car/.test(pool);
    var F = life.sex === 'F';
    var spec;
    if (a < 1) spec = 'biến chứng do sinh non:3,nhiễm trùng sơ sinh:2,ngạt khi sinh:2,dị tật bẩm sinh:2,viêm phổi:2' + (low ? ',tiêu chảy cấp:2' : '') + (africa ? ',sốt rét:3' : '');
    else if (a < 15) spec = 'đuối nước:' + (vn ? 4 : 2) * (life.flags.swim ? 0.3 : 1) + ',tai nạn giao thông:3,viêm phổi:2,ung thư máu:1' + (tropic ? ',sốt xuất huyết:1' : '') + (low ? ',tiêu chảy cấp:2,sởi:1,suy dinh dưỡng:1' : '') + (africa ? ',sốt rét:4' : '');
    else if (a < 40) spec = 'tai nạn giao thông:' + (vn ? 5 : 3) + ',đuối nước:1,tai nạn lao động:2,ung thư:2,bệnh tim:1,lao phổi:' + (low ? 2 : 0.3) +
      ',HIV/AIDS:' + (E.hivRisk ? E.hivRisk(life) * 0.6 : 0) + ',bạo lực:' + (/es_la|afs|car/.test(pool) ? 2.5 : 0.3) + (F && low ? ',biến chứng thai sản:2' : '') + (life.addict && life.addict.drugs ? ',sốc thuốc (quá liều ma túy):4' : '');
    else if (a < 65) spec = 'ung thư gan:' + (vn ? 3 : 1) + ',ung thư phổi:2,đột quỵ:' + (vn ? 3 : 2) + ',nhồi máu cơ tim:2,xơ gan:' + (life.addict && life.addict.alcohol ? 4 : 1) + ',biến chứng tiểu đường:1,tai nạn giao thông:1,ung thư dạ dày:1,lao phổi:' + (low ? 1 : 0.2) + (F ? ',ung thư vú:1.5' : '');
    else spec = 'đột quỵ:' + (vn ? 4 : 3) + ',nhồi máu cơ tim:3,ung thư phổi:2,bệnh phổi tắc nghẽn mạn tính:2,viêm phổi:2,suy tim:2,suy thận:1,Alzheimer:' + (a > 80 ? 2 : 0.5) + ',tuổi già — ra đi thanh thản trong giấc ngủ:' + (a > 85 ? 3 : 0.4);
    return U.wkey(r, spec);
  }

  function endYear(life) {
    life._yearRun = false;
    if (!life.alive) return false;
    life.age++;
    // Chỉ mở cổng trại khi thanh thời gian đã hoàn thành cả năm.
    if (life.jailUntil != null && life.age >= life.jailUntil) {
      life.jailUntil = null;
      life.log.push({ a: life.age, y: life.birthYear + life.age, t: 'Mãn hạn tù, bước ra khỏi cổng trại giam.', k: 'big' });
      H.mem(life, 'Ngày ra tù, bầu trời bên ngoài rộng đến lạ.', 5);
      life.flags.needJob = true;
      H.sched(life, 'ra_tu', 0);
    }
    return REFLECT_AGES.indexOf(life.age) >= 0;
  }

  // Chạy cả đời không cần người chơi (cho "sinh cùng giây" và kiểm thử). AI tự quyết mọi thứ.
  function runHeadless(life, onYear) {
    var guard = 0;
    while (life.alive && guard++ < 130) {
      beginYear(life, { auto: true });
      var g2 = 0;
      while (life.pending.length && life.alive && g2++ < 64) resolve(life, autoKey(life));
      if (life.alive) finishYear(life);
      g2 = 0;
      while (life.pending.length && life.alive && g2++ < 64) resolve(life, autoKey(life));
      if (onYear) onYear(life);
      endYear(life);
    }
    return life;
  }

  function makeCohort(life) {
    var list = [];
    for (var i = 0; i < 4; i++) {
      var o = createLife({ mode: life.mode === 'vn' ? 'vn' : 'world', variant: life.variant, difficulty: life.difficulty, gender: 'random', seed: (life.rs ^ (0x9E3779B9 * (i + 1))) | 0, year: life.birthYear });
      var tl = [];
      runHeadless(o, function (x) { tl[x.age] = statusLine(x); });
      list.push({
        name: o.name, sub: o.nameSub, sex: o.sex, where: isVN(o) ? (o.provLabel || o.prov.old) + (o.mode === 'world' ? ', Việt Nam' : '') : o.birthCity + ', ' + o.countryName,
        q: o.fam.q, eth: o.eth || '', tl: tl, death: o.death, summary: obituary(o)
      });
    }
    return list;
  }

  // ================= CÁO PHÓ =================
  function obituary(life) {
    var s = [];
    s.push('Sinh ra là một bé ' + (life.sex === 'M' ? 'trai' : 'gái') + (life.fam.q === 1 || life.fam.q === 5 ? ' thuộc ' : ' trong ') + QUINT[life.fam.q] + ' ở ' + (life.birthPlace || placeText(life)) + '.');
    if (life.fam.vice && !life.fam.noDad) s.push('Lớn lên bên người bố ' + VICE[life.fam.vice] + '.');
    if (life.movedTo) s.push('Lên ' + life.movedTo + ' lập nghiệp.');
    if (life.death && life.death.age < 6) { s.push('Ra đi vì ' + life.death.cause + ' khi mới ' + (life.death.age === 0 ? 'chưa tròn một tuổi' : life.death.age + ' tuổi') + '.'); return s.join(' '); }
    s.push(life.edu === 0 ? 'Chưa từng được đến trường.' : 'Học hết ' + EDU[life.edu] + (life.major ? ' ngành ' + (life.majorName || MAJORS[life.major]) : '') + (life.flags.studiedAbroad ? ' (du học ' + life.flags.studiedAbroad + ')' : '') + '.');
    var cs = E.careerSummary ? E.careerSummary(life) : '';
    if (cs) s.push(cs);
    else if (life.retired) s.push('Làm việc ' + life.workYrs + ' năm rồi nghỉ hưu.');
    else if (life.job) s.push('Làm ' + jobTitle(life) + '.');
    if (life.abroad && life.abroad.perm) s.push('Di cư và sống ở ' + life.abroad.name + '.');
    if (life.medals && life.medals.length) s.push('Giành ' + life.medals.length + ' huy chương' + (life.medals.some(function (m) { return m.m === 'vàng'; }) ? ', trong đó có huy chương vàng ' + life.medals.filter(function (m) { return m.m === 'vàng'; })[0].ev : '') + '.');
    if (life.titles && life.titles.length) s.push('Đạt danh hiệu ' + life.titles[life.titles.length - 1] + '.');
    if (life.talent && life.flags.talentSeen) s.push('Có năng khiếu ' + talentText(life) + ' từ nhỏ.');
    if (life.record) s.push('Từng ' + life.record + ' lần vào tù.');
    if (life.orient !== 'straight' && life.realized) s.push('Là người ' + orientLabel(life).toLowerCase() + (life.out ? ', đã sống thật với chính mình' : '') + '.');
    if (life.flags.earlyMarried) s.push('Bị gả chồng từ khi còn ở tuổi vị thành niên.');
    if (life.flags.cambodia) s.push(life.flags.cambodia);
    if (life.partner && life.partner.status === 'married') s.push('Đã kết hôn' + (life.exes ? ' (sau ' + life.exes + ' lần đổ vỡ)' : '') + '.');
    else if (life.partner && life.partner.status === 'cohabit') s.push('Sống trọn đời bên người mình thương, dù không có tờ giấy đăng ký kết hôn.');
    else if (life.widowed) s.push('Góa bụa.');
    else if (life.exes) s.push('Từng trải qua ' + life.exes + ' cuộc tình đổ vỡ.');
    else if (life.age >= 25) s.push('Sống độc thân.');
    var alive = life.kids.filter(function (k) { return k.alive; }).length, lost = life.kids.length - alive;
    if (life.kids.length) s.push('Nuôi dạy ' + life.kids.length + ' người con' + (lost ? ', mất ' + lost + ' trong số đó' : '') + '.');
    if (life.grand) s.push('Có ' + life.grand + ' cháu' + (life.ggrand ? ' và ' + life.ggrand + ' chắt' : '') + '.');
    if (life.flags.caredParents) s.push('Chăm sóc bố mẹ lúc tuổi già.');
    if (life.karma >= 40) s.push('Được mọi người nhớ đến là một người tử tế.');
    else if (life.karma <= -40) s.push('Để lại nhiều tai tiếng.');
    if (life.death) s.push('Qua đời vì ' + life.death.cause + ' ở tuổi ' + life.death.age + '.');
    return s.join(' ');
  }

  function jobTitle(life) { return E.jobTitleOf ? E.jobTitleOf(life) : (life.job ? (life.job.t || life.job.id) : null); }

  // ================= PHIÊN BẢN CẤU TRÚC BẢN LƯU =================
  // l.sv: phiên bản cấu trúc dữ liệu của bản lưu (không phải phiên bản game). Bản lưu cũ chưa có sv được coi là 0.
  // Mỗi bước chỉ chạy một lần, theo thứ tự, cho bản lưu có sv nhỏ hơn `to`. Phần chuẩn hóa trường cũ bên dưới
  // (và E.migrateExt của các module) vẫn chạy ở mọi lần nạp như trước, nên bước 0 → 1 chỉ đánh dấu phiên bản.
  var SAVE_SCHEMA = 1;
  var SCHEMA_STEPS = [
    { to: 1, run: function () { } }
  ];
  // Module mở rộng đăng ký bước nâng cấp của mình (ví dụ life142: hợp nhất danh tính & quan hệ NPC)
  function registerSchemaStep(step) {
    if (!step || !(step.to > 0) || typeof step.run !== 'function' || SCHEMA_STEPS.some(function (s) { return s.to === step.to; })) throw Error('Bước nâng cấp cấu trúc không hợp lệ hoặc bị trùng: ' + (step && step.to));
    SCHEMA_STEPS.push(step); SCHEMA_STEPS.sort(function (a, b) { return a.to - b.to; });
    if (step.to > SAVE_SCHEMA) { SAVE_SCHEMA = step.to; if (G.E) G.E.SAVE_SCHEMA = SAVE_SCHEMA; }
    return SAVE_SCHEMA;
  }
  function saveSchema(l) { var v = l && l.sv; return v == null ? 0 : typeof v === 'number' && isFinite(v) && v >= 0 && Math.floor(v) === v ? v : NaN; }
  function schemaError(code, sv) { var e = new Error(code === 'FUTURE_SCHEMA' ? 'Bản lưu thuộc cấu trúc v' + sv + ', mới hơn mức game hỗ trợ (v' + SAVE_SCHEMA + ')' : code === 'BAD_SCHEMA' ? 'Phiên bản cấu trúc bản lưu không hợp lệ' : 'Bản lưu thiếu thông tin cơ bản của nhân vật'); e.code = code; e.sv = sv; return e; }
  // Kiểm tra trước khi nạp, không sửa dữ liệu: { ok, code?, sv, max }
  function checkSave(l) {
    var sv = saveSchema(l), out = { ok: false, sv: sv, max: SAVE_SCHEMA };
    if (!l || typeof l !== 'object' || Array.isArray(l) || typeof l.name !== 'string' || !isFinite(l.age) || !isFinite(l.birthYear)) { out.code = 'INVALID'; return out; }
    if (sv !== sv) { out.code = 'BAD_SCHEMA'; return out; }
    if (sv > SAVE_SCHEMA) { out.code = 'FUTURE_SCHEMA'; return out; }
    out.ok = true; return out;
  }

  // Nâng cấp dữ liệu lưu từ bản cũ để người chơi đang chơi dở không bị mất tiến trình
  function migrate(l) {
    if (!l) return l;
    // Bản lưu của cấu trúc mới hơn: không ép về cấu trúc cũ, không sửa gì — để giao diện giữ nguyên bản lưu và báo cho người chơi.
    var chk = checkSave(l);
    if (!chk.ok) throw schemaError(chk.code, chk.sv);
    for (var si = 0, sv = chk.sv; si < SCHEMA_STEPS.length; si++) if (sv < SCHEMA_STEPS[si].to) { SCHEMA_STEPS[si].run(l); sv = SCHEMA_STEPS[si].to; }
    l.difficulty = l.difficulty === 'hardcore' ? 'hardcore' : 'normal';
    if (l.prov) {
      var admin = VN.P34.find(function (p) { return p.name === l.prov.neu; });
      if (admin) { l.prov.kind = admin.kind; l.prov.neuId = admin.id; }
    }
    l.flags = l.flags || {}; l.refl = l.refl || {}; l.pending = l.pending || []; l.kids = l.kids || []; l.yrs = l.yrs || []; l.log = l.log || [];
    l.tr = l.tr || { risk: 50, moral: 62, amb: 50, soc: 50 };
    if (G.WEC && l.cur !== 'vnd' && G.WEC.context(l).data) setBase(l);
    if (l.karma == null) l.karma = 0;
    l.loans = l.loans || []; l.credit = l.credit || { bad: false, since: null }; l.lic = l.lic || {}; l.mem = l.mem || []; l.sched = l.sched || [];
    l.medals = l.medals || []; l.titles = l.titles || []; l.addict = l.addict || {}; l.yr = l.yr || { items: [] };
    if (l.fame == null) l.fame = 0; if (l.skill == null) l.skill = 20; if (l.imm == null) l.imm = 55; if (l.acts == null) l.acts = 0;
    if (l.spend == null) l.spend = 'normal'; if (l.sendParents == null) l.sendParents = isVN(l); if (l.uniTier == null) l.uniTier = 1; if (l.vehVal == null) l.vehVal = 0;
    if (l.record == null) l.record = 0;
    if (l.fam && l.fam.mInc == null) { l.fam.mInc = parentMonthly(l, l.fam.mJob); l.fam.fInc = l.fam.noDad ? 0 : parentMonthly(l, l.fam.fJob); } // v2.1
    if (l.fam && l.fam.mInc0 == null) { l.fam.mInc0 = l.fam.mInc; l.fam.fInc0 = l.fam.fInc; } // v2.2
    if (!l.pets) { l.pets = []; if (l.flags.pet) { var op = l.flags.pet; l.pets.push({ k: op.k, br: op.k, n: op.n, since: op.since || 0, life: 14, alive: op.alive !== false }); delete l.flags.pet; } } // v2.2
    if (l.job && E.resolveJob) l.job.id = E.resolveJob(l.job.id);
    if (E.migrateExt) E.migrateExt(l); // v2.3: tài sản, tâm lý, đời con cái
    l.pending = l.pending.filter(function (d) { return DEC[d.id]; });
    l.sv = SAVE_SCHEMA;
    return l;
  }

  var E = G.E = {
    DIFFICULTIES: DIFFICULTIES, difficulty: difficulty,
    isStableService: stableService, isStableParent: stableParent, HOOKS: HOOKS, assetTotal: assetTotal, KHOI: KHOI,
    createLife: createLife, beginYear: beginYear, resolve: resolve, autoKey: autoKey, finishYear: finishYear, endYear: endYear,
    runHeadless: runHeadless, makeCohort: makeCohort, netWorth: netWorth, obituary: obituary, statusLine: statusLine, fmtMoney: fmtMoney,
    jobTitle: jobTitle, orientLabel: orientLabel, placeText: placeText, buildMort: buildMort, qBase: qBase, migrate: migrate,
    SAVE_SCHEMA: SAVE_SCHEMA, saveSchema: saveSchema, checkSave: checkSave, registerSchemaStep: registerSchemaStep,
    actions: actions, act: act, actAvail: actAvail, parentMonthly: parentMonthly, PARENT_PAY: PARENT_PAY, parentKind: parentKind, parentYear: parentYear,
    isMajor: isMajor, MAJOR: MAJOR, GAMES: GAMES, gameFor: gameFor, anyGame: anyGame, PETS: PETS, GAME_SUB: GAME_SUB, ACTS_PER_YEAR: ACTS_PER_YEAR, actsLimit: actsLimit, talentText: talentText,
    EDU: EDU, MAJORS: MAJORS, QUINT: QUINT, TALENTS: TALENTS, DEC: DEC, TRIG: TRIG, ACT: ACT, EVENTS: EVENTS, CAR: CAR, LINES: LINES,
    LOAN_TYPES: LOAN_TYPES, IDOLS: IDOLS, IDOL_BORN: IDOL_BORN, VICE: VICE, CONSCRIPT: CONSCRIPT,
    REFLECT_AGES: REFLECT_AGES, schoolName: schoolName, isVN: isVN, H: H, SC: SC, eduP: eduP, uniPlaces: uniPlaces, housePrice: housePrice
  };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
