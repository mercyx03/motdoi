/* Một Đời — Phần C tiếp (8.10.20): kinh tế hộ gia đình, quyền lợi lao động, nhà ở xã hội, giao thông, thuế doanh nghiệp
   và biến cố gắn với kinh tế. Mở rộng hệ sẵn có, không tạo sổ tiền song song:
   · Phiếu lương đọc đúng dòng tiền của life3 (y.gross, y.si) và tax-resident (E.TAX909); trần căn cứ đóng theo mức tham chiếu.
   · Ngân sách hộ đi qua E.budget114 (engine finance) và E.lifestyleFactor; áp lực giá năm lạm phát cao lấy từ E.ERA917.macro.
     Sổ tiền vẫn theo mặt bằng giá 2026: không nhân tiền mặt, nợ hay giao dịch cũ; chỉ chi phí thiết yếu năm đó tăng/giảm có trần.
   · Nghỉ ốm, đào tạo lại (E.offers), nhà ở xã hội (khoản vay NHCSXH trong l.loans), vùng phát thải thấp và vé xe buýt
     (E.vehicleAnnual / E.travelCost), thuế TNDN ước tính, ba chuỗi biến cố trên E.CHAIN144 qua bộ khởi phát của drama917.
   · Mọi số ngẫu nhiên băm theo nhân vật + năm, không tiêu RNG của game, không reroll khi lưu/tải; mỗi quyết định có token năm. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, R = E.ERA917, CH = E.CHAIN144, D = E.DRAMA917;
  if (!X || !R) return;
  var BAL = { siShare: { bhxh: 8, bhyt: 1.5, bhtn: 1 }, employer: { bhxh: 17.5, bhyt: 3, bhtn: 1 }, pressureCap: [-0.02, 0.05], cutFactor: 0.82,
    sickEnt: [30, 40, 60], sickRate: 0.75, socialRentShare: 0.5, socialPrice: { big: 1100, other: 750 }, socialDown: 0.2, socialRate: 0.054,
    socialIncome: { single: 20, couple: 40 }, evBike: 0.6, lezBus: 0.08, retrainSupport: 0.6 }; // tham số gameplay; số có nguồn ghi ở docs/ERA-POLICY-917.md
  function dec(x, n) { return Number(x).toFixed(n).replace('.', ','); } // số thập phân kiểu Việt
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; h = Math.imul(h, 3266489909); h ^= h >>> 16; return h >>> 0; }
  function u(l, tag) { return hash(l.id + ':e918:' + tag + ':' + l.age) / 4294967296; }
  function year(l) { return R.year(l); }
  function vn(l) { return R.vnHere(l); }
  function mo(l, v) { return H.money(l, v); }
  function ledger(l, vnd) { return E.TAX909 ? E.TAX909.ledger(l, vnd) : vnd; }
  function toVnd(l, v) { return E.TAX909 ? E.TAX909.toVnd(l, v) : v; }
  function st(l) {
    var s = l.flags.econ918; if (!s || typeof s !== 'object') s = l.flags.econ918 = {};
    if (!s.budget || typeof s.budget !== 'object') s.budget = { months: 3, auto: false, cutAt: null };
    if (!s.sick || typeof s.sick !== 'object') s.sick = { history: [] };
    if (!Array.isArray(s.skills)) s.skills = [];
    if (!s.lez || typeof s.lez !== 'object') s.lez = { phase: 0, mode: null };
    return s;
  }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.flags.military && l.age < l.flags.military); }
  function partnerOf(l) { var p = l.partner; return p && p.alive !== false && p.status !== 'dating' && !p.separated908 ? p : null; }

  // ================= C4: phiếu lương — gộp → BHXH/BHYT/BHTN → giảm trừ → thuế → thực nhận =================
  E.siCap918 = function (l) { var y = year(l); return 20 * (y >= 2027 ? 2.53 : y === 2026 ? (2.34 + 2.53) / 2 : 2.34); }; // triệu/tháng, 20 lần mức tham chiếu
  function slip(l) {
    var t = l.flags.tax909, row = t && t.history && t.history[t.history.length - 1], y = l.yr || {};
    var gross = row ? row.gross : y.gross || 0, si = row ? row.insurance : y.si || 0;
    if (!(gross > 0)) return null;
    var tot = BAL.siShare.bhxh + BAL.siShare.bhyt + BAL.siShare.bhtn, inVN = !!(H.inVN && H.inVN(l));
    var parts = inVN ? { bhxh: si * BAL.siShare.bhxh / tot, bhyt: si * BAL.siShare.bhyt / tot, bhtn: si * BAL.siShare.bhtn / tot } : { other: si };
    var tax = row ? row.tax : 0, ded = row ? row.deduction : 0, taxable = row ? row.taxable : 0;
    var adj = row ? row.adj918 || 0 : y.adj918 || 0; // điều chỉnh thu nhập bền vững của life115, áp sau thuế
    return { age: row ? row.age : l.age, gross: gross, si: si, parts: parts, deduction: ded, taxable: taxable, tax: tax, adj: adj, net: gross - si - tax - adj, deps: row ? row.dependents : 0, inVN: inVN, taxed: !!row,
      employer: inVN && si > 0 ? si / 0.105 * (BAL.employer.bhxh + BAL.employer.bhyt + BAL.employer.bhtn) / 100 : 0 };
  }
  X.menu('payslip918', 'Phiếu lương', function (l) { var r = X.reason(l, 16); if (r !== true) return r; return slip(l) ? true : 'Chưa có kỳ lương làm công để xem'; }, function (l) {
    var p = slip(l); if (!p) return 'Chưa có kỳ lương.';
    var m = function (v) { return mo(l, v / 12) + '/tháng (' + mo(l, v) + '/năm)'; };
    return 'Kỳ lương năm ' + (l.birthYear + p.age) + '.\n• Lương gộp: ' + m(p.gross) +
      (p.inVN ? '\n• BHXH 8%: −' + m(p.parts.bhxh) + '\n• BHYT 1,5%: −' + m(p.parts.bhyt) + '\n• BHTN 1%: −' + m(p.parts.bhtn) + ' (căn cứ đóng tối đa ' + mo(l, ledger(l, E.siCap918(l))) + '/tháng)' : '\n• Bảo hiểm bắt buộc: −' + m(p.si)) +
      (p.taxed ? '\n• Giảm trừ gia cảnh: ' + m(p.deduction) + ' (' + p.deps + ' người phụ thuộc)\n• Thu nhập tính thuế: ' + m(p.taxable) + '\n• Thuế TNCN: −' + m(p.tax) : '\n• Thuế TNCN: không áp dụng ở kỳ này (ngoài Việt Nam hoặc trước kỳ thuế 2026)') +
      (p.adj > 0 ? '\n• Điều chỉnh thu nhập bền vững của game: −' + m(p.adj) + ' (cân bằng gameplay cho thu nhập cao, áp sau thuế; không phải khoản luật định)' : '') +
      '\n• Thực nhận: ' + m(p.net) + (p.employer ? '\nĐơn vị sử dụng lao động đóng thêm cho bạn khoảng ' + m(p.employer) + ' (BHXH 17,5%, BHYT 3%, BHTN 1%) — không trừ vào lương.' : '') +
      '\nGiảm thu nhập tính thuế không làm số thuế giảm cùng số tiền: mỗi đồng giảm trừ chỉ bớt phần thuế theo bậc đang chịu.';
  }, function () { return []; }, 18, 'Tiền bạc');
  var ei = E.economy114Income; if (ei) E.economy114Income = function (l, v, source) { var out = ei.apply(this, arguments); if (source === 'career' && l && l.yr && v > 0 && out < v) { l.yr.adj918 = v - out; var t = l.flags && l.flags.tax909, row = t && t.history && t.history[t.history.length - 1]; if (row && row.age === l.age) row.adj918 = v - out; } return out; };
  var prof = E.profile; if (prof) E.profile = function (l) {
    var p = prof.apply(this, arguments), q = slip(l);
    if (q && q.age === l.age && p && Array.isArray(p.jobInfo)) p.jobInfo.push('Phiếu lương: gộp ' + mo(l, q.gross / 12) + ' → bảo hiểm −' + mo(l, q.si / 12) + ' → thuế −' + mo(l, q.tax / 12) + ' → thực nhận ' + mo(l, q.net / 12) + '/tháng');
    return p;
  };

  // ================= C3: ngân sách hộ gia đình, quỹ khẩn cấp, áp lực giá =================
  function cc(l) { return (l.abroad && l.abroad.perm && l.abroad.code) || l.country || 'VN'; }
  function pressure(l) { var m = R.macro(cc(l), year(l)); return U.clamp((m.cpi - 0.035) - (m.real - 0.025) * 0.5, BAL.pressureCap[0], BAL.pressureCap[1]); }
  function essentials(l) { var F = l.fin; if (!F || !l.indep) return l.base * 0.6; return Math.max(0, (F.food || 0) + (F.rent || 0) + (F.travel || 0) + (F.kids || 0) + (F.health || 0)); }
  function socialRenting(l) { var h = l.flags.econ918 && l.flags.econ918.housing; return !!(h && h.status === 'renting' && !l.ownHouse); }
  E.livingCost918 = function (l, F) {
    if (!l || !F || !l.indep) return;
    var p = pressure(l); F.food *= 1 + p; var s = st(l); s.budget.pressure = { y: year(l), p: p };
    if (socialRenting(l) && F.rent > 0) F.rent *= BAL.socialRentShare;
  };
  var lf = E.lifestyleFactor;
  if (lf) E.lifestyleFactor = function (l) { var f = lf.apply(this, arguments), b = l && l.flags && l.flags.econ918 && l.flags.econ918.budget; return b && b.cutAt != null && b.cutAt >= l.age - 1 && f > BAL.cutFactor ? BAL.cutFactor : f; };
  function budgetYear(l, log) {
    var s = st(l), b = s.budget; if (!l.indep || b.at === l.age) return; b.at = l.age;
    var target = essentials(l) / 12 * b.months;
    if (b.auto && l.money < target) { if (b.cutAt == null || b.cutAt < l.age - 1) log('Quỹ khẩn cấp dưới mức ' + b.months + ' tháng chi tiêu thiết yếu; gia đình tự cắt các khoản không cần thiết trong năm tới.', 'neutral'); b.cutAt = l.age; }
    else if (b.cutAt != null && b.cutAt < l.age && l.money >= target * 1.5) b.cutAt = null;
    var q = s.budget.pressure; if (q && q.y === year(l) && q.p >= 0.03 && !b.warnAt) { b.warnAt = l.age; log('Năm nay giá cả tăng nhanh hơn thu nhập: chi tiêu thiết yếu của gia đình đắt hơn khoảng ' + Math.round(q.p * 100) + '%.', 'neutral'); }
    if (b.warnAt != null && l.age - b.warnAt >= 5) b.warnAt = null;
  }
  X.menu('budget918', 'Ngân sách gia đình', function (l) { var r = X.reason(l, 18); if (r !== true) return r; return l.indep ? true : 'Cần tự lập để quản lý ngân sách'; }, function (l) {
    var s = st(l), F = l.fin || {}, ess = essentials(l), ix = R.index(l), p = pressure(l), target = ess / 12 * s.budget.months, items = (F.items || []).slice(0, 6);
    return 'Chi tiêu năm gần nhất — thiết yếu: ăn uống và tiện ích ' + mo(l, F.food || 0) + ', thuê nhà ' + mo(l, F.rent || 0) + (socialRenting(l) ? ' (giá thuê nhà ở xã hội)' : '') + ', đi lại ' + mo(l, F.travel || 0) + ', con cái ' + mo(l, F.kids || 0) + ', y tế ' + mo(l, F.health || 0) + '; cộng ' + mo(l, ess) + '.' +
      (items.length ? '\nKhoản khác đã ghi: ' + items.map(function (x) { return (x.t || 'khoản chi') + ' ' + mo(l, x.v); }).join('; ') + '.' : '') +
      '\nQuỹ khẩn cấp mục tiêu ' + s.budget.months + ' tháng thiết yếu = ' + mo(l, target) + '; tiền hiện có ' + mo(l, l.money) + (l.money >= target ? ' — đủ.' : ' — còn thiếu ' + mo(l, target - l.money) + '.') +
      '\nTự cắt chi khi quỹ thiếu: ' + (s.budget.auto ? 'bật' : 'tắt') + (s.budget.cutAt != null && s.budget.cutAt >= l.age - 1 ? ' (đang cắt chi)' : '') + '. Cách chi tiêu: ' + ({ save: 'tằn tiện', normal: 'bình thường', lavish: 'thoải mái' }[l.spend] || 'bình thường') + '.' +
      '\nÁp lực giá năm nay: ' + (p >= 0 ? '+' : '') + dec(p * 100, 1) + '% chi thiết yếu. Quy đổi so với 2026: giá ×' + dec(ix.cpi, 2) + ', sức mua lương thực tế ×' + dec(ix.real, 2) + '. Số dư, nợ và giao dịch cũ không bị quy đổi lại.';
  }, function (l) {
    var s = st(l), out = [];
    [3, 6, 12].forEach(function (m) { out.push({ k: 'm' + m, l: (s.budget.months === m ? '✓ ' : '') + 'Quỹ khẩn cấp ' + m + ' tháng', why: s.budget.months === m ? 'Đang dùng' : true, run: function (l, r, log) { st(l).budget.months = m; log('Đặt mục tiêu quỹ khẩn cấp ' + m + ' tháng chi tiêu thiết yếu.', 'neutral'); } }); });
    out.push({ k: 'auto', l: s.budget.auto ? 'Tắt tự cắt chi khi quỹ thiếu' : 'Bật tự cắt chi khi quỹ thiếu', h: 'Khi tiền dưới mục tiêu, năm sau tự chuyển sang chi tiêu tằn tiện; không tự mua sắm thêm', run: function (l, r, log) { var b = st(l).budget; b.auto = !b.auto; if (!b.auto) b.cutAt = null; log(b.auto ? 'Bật tự cắt chi khi quỹ khẩn cấp thiếu.' : 'Tắt tự cắt chi.', 'neutral'); } });
    [['save', 'Chi tiêu tằn tiện'], ['normal', 'Chi tiêu bình thường'], ['lavish', 'Chi tiêu thoải mái']].forEach(function (x) { out.push({ k: 's:' + x[0], l: (l.spend === x[0] ? '✓ ' : '') + x[1], why: l.spend === x[0] ? 'Đang dùng' : true, run: function (l, r, log) { l.spend = x[0]; log('Chuyển cách chi tiêu: ' + x[1].toLowerCase() + '.', 'neutral'); } }); });
    return out;
  }, 18, 'Tiền bạc');

  // ================= C5: nghỉ ốm có BHXH =================
  function entitlement(l) { var y = l.si ? l.si.yrs : 0; return y >= 30 ? BAL.sickEnt[2] : y >= 15 ? BAL.sickEnt[1] : BAL.sickEnt[0]; }
  function employee(l) { return !!(l.job && (H.isEmployee ? H.isEmployee(l) : true)); }
  function sickYear(l, r) {
    var s = st(l); if (!free(l) || !l.ill || !employee(l) || s.sick.at === l.age || l.retired) return;
    s.sick.at = l.age; X.next(l, 'sick918', r, { at: l.age }, { manual: false });
  }
  E.SC('sick918', { title: 'Nghỉ ốm hay cố đi làm?',
    prep: function (l, r, arg) {
      var days = 7 + Math.floor(u(l, 'sickdays') * 24) + (l.flags.chronic ? 10 : 0), ins = !!(E.insured && E.insured(l) && vn(l));
      var gm = ((l.yr && l.yr.gross) || l.income || 0) / 12, ent = entitlement(l), paid = ins ? Math.min(days, ent) : 0;
      return { at: arg && arg.at, done: false, days: days, ins: ins, ent: ent, loss: gm / 24 * (paid * (1 - BAL.sickRate) + (days - paid)), half: gm / 24 * (paid * (1 - BAL.sickRate) + (days - paid)) / 2 };
    },
    valid: function (l, d) { return !!(d && !d.done && d.at === l.age && l.alive && employee(l)); },
    text: function (l, d) { return 'Đợt ốm năm nay cần khoảng ' + d.days + ' ngày nghỉ theo bác sĩ. ' + (d.ins ? 'Bạn đang đóng BHXH: nghỉ có xác nhận được quỹ trả 75% lương những ngày nghỉ, tối đa ' + d.ent + ' ngày/năm theo số năm đóng; quá số ngày thì nghỉ không lương.' : 'Bạn không thuộc diện hưởng chế độ ốm đau BHXH ở việc này, nên ngày nghỉ không có lương.') + ' Thu nhập giảm ước tính ' + mo(l, d.loss) + ' nếu nghỉ đủ.'; },
    opts: [
      { k: 'rest', l: 'Nghỉ đủ theo chỉ định', ai: { w: 1.3 }, run: function (l, r, log, d) { if (!E.DEC.sick918.valid(l, d)) return; d.done = true; H.cash(l, -d.loss, d.ins ? 'Phần lương không được quỹ BHXH chi khi nghỉ ốm' : 'Nghỉ ốm không lương'); H.fx(l, { hea: 3 }); if (l.mind) l.mind.stress = U.clamp(l.mind.stress - 3, 0, 100); st(l).sick.history.push({ age: l.age, days: d.days, mode: 'rest' }); st(l).sick.history = st(l).sick.history.slice(-10); log('Bạn nghỉ ' + d.days + ' ngày để hồi phục' + (d.ins ? ', hồ sơ nghỉ ốm được BHXH giải quyết.' : '.'), 'neutral'); } },
      { k: 'half', l: 'Nghỉ một phần, làm nửa ngày', req: function (l, d) { return d.ins; }, ai: { w: 0.7 }, run: function (l, r, log, d) { if (!E.DEC.sick918.valid(l, d)) return; d.done = true; H.cash(l, -d.half, 'Nghỉ ốm nửa ngày'); H.fx(l, { hea: 1 }); st(l).sick.history.push({ age: l.age, days: d.days / 2, mode: 'half' }); log('Bạn xin nghỉ nửa ngày trong đợt điều trị.', 'neutral'); } },
      { k: 'work', l: 'Cố đi làm', ai: { w: 0.5 }, run: function (l, r, log, d) { if (!E.DEC.sick918.valid(l, d)) return; d.done = true; H.fx(l, { hea: -3 }); if (l.mind) l.mind.stress = U.clamp(l.mind.stress + 6, 0, 100); if (u(l, 'sickwork') < 0.3 && l.job) { l.job.rep = U.clamp((l.job.rep == null ? 50 : l.job.rep) - 2, 0, 100); log('Bạn cố đi làm khi chưa khỏe; năng suất giảm và đồng nghiệp lo lây bệnh.', 'bad'); } else log('Bạn đi làm trong lúc ốm, giữ đủ lương nhưng lâu hồi phục hơn.', 'neutral'); st(l).sick.history.push({ age: l.age, days: 0, mode: 'work' }); } }
    ] });

  // ================= C5: đào tạo lại =================
  var COURSES = [
    { k: 'digital', n: 'Kỹ năng số và tin học văn phòng', cost: 0.06, job: null, note: 'Uy tín công việc hiện tại tăng; không đổi nghề' },
    { k: 'cook', n: 'Sơ cấp nấu ăn', cost: 0.05, job: 'dau_bep' },
    { k: 'driver', n: 'Lái xe tải hạng C', cost: 0.07, job: 'tai_xe_tai' },
    { k: 'repair', n: 'Sửa chữa xe máy, ô tô', cost: 0.05, job: 'tho_sua_xe' },
    { k: 'tailor', n: 'May công nghiệp', cost: 0.04, job: 'tho_may' },
    { k: 'care', n: 'Chăm sóc người cao tuổi tại nhà', cost: 0.04, job: 'giup_viec' }
  ];
  function supportShare(l) { return vn(l) && l.si && l.si.yrs >= 1 ? BAL.retrainSupport : 0; }
  function retrainYear(l, log) {
    var s = st(l), c = s.retrain; if (!c || c.done || l.age <= c.start) return;
    c.done = true; c.end = l.age; var k = COURSES.find(function (x) { return x.k === c.k; }); if (!k) return;
    s.skills = s.skills.filter(function (x) { return x.k !== k.k; }).concat([{ k: k.k, at: l.age }]).slice(-6);
    if (!k.job && l.job) l.job.rep = U.clamp((l.job.rep == null ? 50 : l.job.rep) + 4, 0, 100);
    log('Hoàn thành khóa ' + k.n + (k.job ? '; hồ sơ tìm việc có thêm hướng ' + (E.CAR[k.job] ? E.CAR[k.job].t[0] : k.n) + '.' : '; công việc hiện tại được ghi nhận thêm.'), 'good');
  }
  X.menu('retrain918', 'Đào tạo lại, học nghề ngắn hạn', function (l) {
    var r = X.reason(l, 18); if (r !== true) return r; if (l.age > 58) return 'Khóa ngắn hạn dành cho người dưới 59 tuổi';
    if (l.school) return 'Đang đi học'; if (!free(l)) return 'Cần được tự do đi lại'; return true;
  }, function (l) {
    var s = st(l), sh = supportShare(l);
    return 'Học nghề ngắn hạn mất một năm, vẫn có thể đi làm song song. ' + (sh ? 'Bạn từng đóng BHTN nên được hỗ trợ một phần học phí (mức hỗ trợ trong game là giả lập ' + Math.round(sh * 100) + '%; Luật Việc làm 2025 có hỗ trợ đào tạo nghề cho người tham gia BHTN, mức trần chưa xác minh).' : 'Chưa có lịch sử đóng BHTN ở Việt Nam nên tự chi trả học phí.') +
      ' Học xong không bảo đảm có việc: chỉ mở thêm lựa chọn khi tìm việc nếu bạn đủ điều kiện nghề đó.' + (s.retrain && !s.retrain.done ? '\nĐang học: ' + (COURSES.find(function (x) { return x.k === s.retrain.k; }) || {}).n + '.' : '') +
      (s.skills.length ? '\nĐã hoàn thành: ' + s.skills.map(function (x) { return (COURSES.find(function (c) { return c.k === x.k; }) || {}).n + ' (' + x.at + ' tuổi)'; }).join(', ') + '.' : '');
  }, function (l) {
    var s = st(l), sh = supportShare(l);
    return COURSES.map(function (c) {
      var full = l.base * c.cost, own = full * (1 - sh), done = s.skills.some(function (x) { return x.k === c.k && l.age - x.at < 8; });
      return { k: c.k, l: 'Học ' + c.n, h: 'Học phí ' + mo(l, full) + (sh ? ', bạn trả ' + mo(l, own) : '') + (c.note ? ' · ' + c.note : ''), why: s.retrain && !s.retrain.done ? 'Đang có khóa học dở' : done ? 'Đã học khóa này gần đây' : l.money < own ? 'Chưa đủ tiền học phí' : true,
        run: function (l, r, log) { var q = st(l); if (q.retrain && !q.retrain.done || l.money < own) return; H.cash(l, -own, 'Học phí đào tạo lại'); q.retrain = { k: c.k, start: l.age, done: false, paid: own, support: full - own }; if (l.mind) l.mind.stress = U.clamp(l.mind.stress + 2, 0, 100); log('Bạn đăng ký khóa ' + c.n + (sh ? '; quỹ BHTN hỗ trợ phần còn lại.' : '.'), 'neutral'); } };
    });
  }, 18, 'Học tập');
  var off0 = E.offers;
  if (off0) E.offers = function (l, r) {
    var o = off0.apply(this, arguments), s = l && l.flags && l.flags.econ918;
    if (!Array.isArray(o) || !s || !Array.isArray(s.skills)) return o;
    s.skills.forEach(function (x) { var c = COURSES.find(function (k) { return k.k === x.k; }); if (!c || !c.job || l.age - x.at > 4 || o.indexOf(c.job) >= 0 || !E.CAR[c.job]) return; if (E.jobEligible && !E.jobEligible(l, E.CAR[c.job])) return; o.unshift(c.job); });
    return o;
  };

  // ================= C6: nhà ở xã hội =================
  function bigCity(l) { var p = l.prov || {}; return /Hà Nội|Hồ Chí Minh/.test((p.neu || '') + ' ' + (p.old || '')); }
  function monthlyVnd(l) { var own = toVnd(l, ((l.yr && l.yr.gross) || l.income || 0) / 12), p = partnerOf(l), pi = p && p.inc > 0 && isFinite(p.inc) ? toVnd(l, p.inc) : 0; return { own: own, total: own + pi, couple: !!p }; }
  function housingWhy(l) {
    if (!vn(l)) return 'Chính sách nhà ở xã hội của Việt Nam, cần đang sống tại Việt Nam';
    if (!l.indep || l.age < 18) return 'Cần tự lập'; if (l.ownHouse) return 'Đã có nhà thuộc sở hữu';
    if (!l.urban) return 'Mô phỏng nguồn cung nhà ở xã hội tại đô thị';
    var m = monthlyVnd(l), cap = m.couple ? BAL.socialIncome.couple : BAL.socialIncome.single;
    if ((m.couple ? m.total : m.own) > cap) return 'Thu nhập ' + (m.couple ? 'hai vợ chồng' : '') + ' vượt ' + cap + ' triệu/tháng';
    return true;
  }
  function housingYear(l, r, log) {
    var s = st(l), h = s.housing; if (!h) return;
    if (h.status === 'renting' && l.ownHouse) { h.status = 'moved'; h.end = l.age; log('Bạn trả lại căn hộ thuê nhà ở xã hội khi đã có nhà riêng.', 'neutral'); }
    if (h.status === 'waiting' && l.age >= h.due && h.offerAt !== l.age) { h.offerAt = l.age; X.next(l, 'housingOffer918', r, { at: l.age }, { manual: false }); }
  }
  X.menu('housing918', 'Nhà ở xã hội', function (l) { var r = X.reason(l, 18); return r !== true ? r : vn(l) ? true : 'Chính sách nhà ở xã hội của Việt Nam'; }, function (l) {
    var s = st(l), h = s.housing, m = monthlyVnd(l), why = housingWhy(l);
    return 'Điều kiện chính (NĐ 261/2025): chưa có nhà thuộc sở hữu, thu nhập không quá 20 triệu/tháng (độc thân) hoặc 40 triệu/tháng (vợ chồng); vay ưu đãi 5,4%/năm. Nguồn cung có hạn nên phải chờ; đến lượt vẫn xét lại điều kiện. Căn hộ mua không được bán lại trong 5 năm.\nThu nhập hiện tính: ' + mo(l, ledger(l, m.couple ? m.total : m.own)) + '/tháng. ' + (why === true ? 'Đủ điều kiện nộp hồ sơ.' : 'Chưa đủ điều kiện: ' + why + '.') +
      (h ? '\nHồ sơ: ' + ({ waiting: 'đang chờ, dự kiến đến lượt khi bạn ' + h.due + ' tuổi', owner: 'đã mua căn hộ năm ' + h.since + ' tuổi', renting: 'đang thuê từ ' + h.since + ' tuổi', declined: 'đã từ chối/lỡ lượt, nộp lại từ ' + h.reapply + ' tuổi', lapsed: 'không còn đủ điều kiện khi đến lượt', moved: 'đã trả căn thuê' }[h.status] || h.status) + '.' : '');
  }, function (l) {
    var s = st(l), h = s.housing, why = housingWhy(l);
    var busy = h && (h.status === 'waiting' || h.status === 'owner' || h.status === 'renting') ? 'Đã có hồ sơ' : h && h.reapply > l.age ? 'Nộp lại từ ' + h.reapply + ' tuổi' : why;
    var out = [{ k: 'apply', l: 'Nộp hồ sơ mua hoặc thuê nhà ở xã hội', h: 'Không mất phí nộp; thời gian chờ 1–5 năm tùy nguồn cung', why: busy,
      run: function (l, r, log) { var q = st(l); if (q.housing && (q.housing.status === 'waiting' || q.housing.reapply > l.age) || housingWhy(l) !== true) return; var w = 1 + Math.floor(u(l, 'wait') * 3) + (bigCity(l) ? 1 : 0); q.housing = { status: 'waiting', applied: l.age, due: l.age + w }; log('Nộp hồ sơ nhà ở xã hội; dự kiến đến lượt sau khoảng ' + w + ' năm.', 'neutral'); } }];
    if (h && h.status === 'waiting') out.push({ k: 'withdraw', l: 'Rút hồ sơ đang chờ', run: function (l, r, log) { var q = st(l); if (!q.housing || q.housing.status !== 'waiting') return; q.housing = { status: 'declined', reapply: l.age + 1 }; log('Bạn rút hồ sơ nhà ở xã hội.', 'neutral'); } });
    return out;
  }, 18, 'Tiền bạc');
  function socialPrice(l) { return ledger(l, bigCity(l) ? BAL.socialPrice.big : BAL.socialPrice.other); }
  E.SC('housingOffer918', { title: 'Đến lượt nhà ở xã hội',
    prep: function (l, r, arg) { return { at: arg && arg.at, done: false, price: socialPrice(l), ok: housingWhy(l) === true }; },
    valid: function (l, d) { var h = l.flags.econ918 && l.flags.econ918.housing; return !!(d && !d.done && d.at === l.age && h && h.status === 'waiting'); },
    text: function (l, d) { return d.ok ? 'Hồ sơ của bạn đến lượt: căn hộ ' + (bigCity(l) ? 'ở ' + ((l.prov && l.prov.neu) || 'thành phố') : 'tại đô thị tỉnh') + ' giá ' + mo(l, d.price) + '. Mua cần trả trước ' + Math.round(BAL.socialDown * 100) + '% (' + mo(l, d.price * BAL.socialDown) + '), phần còn lại vay Ngân hàng Chính sách xã hội 5,4%/năm; hoặc thuê với giá khoảng một nửa giá thuê thị trường.' : 'Hồ sơ đến lượt nhưng khi xét lại, bạn không còn đủ điều kiện (' + housingWhy(l) + '). Suất được chuyển cho người kế tiếp.'; },
    opts: [
      { k: 'buy', l: 'Mua căn hộ, vay ưu đãi phần còn lại', req: function (l, d) { return d.ok && l.money >= d.price * BAL.socialDown; }, ai: { w: 1.2 }, run: function (l, r, log, d) {
        if (!E.DEC.housingOffer918.valid(l, d) || housingWhy(l) !== true || l.money < d.price * BAL.socialDown) return; d.done = true; var applied = st(l).housing.applied;
        var loan = d.price * (1 - BAL.socialDown); H.cash(l, -d.price, 'Mua căn hộ nhà ở xã hội'); l.loans = l.loans || [];
        l.loans.push({ type: 'home', name: 'vay mua nhà ở xã hội (NHCSXH)', bal: loan, rate: BAL.socialRate, minShare: 0.06, late: 0, since: l.age, social918: true }); H.cash(l, loan, 'Vay ưu đãi Ngân hàng Chính sách xã hội');
        l.ownHouse = true; l.houseVal = d.price; l.houseName = 'Căn hộ nhà ở xã hội'; l.flags.ownedHome = true;
        st(l).housing = { status: 'owner', since: l.age, noSaleUntil: l.age + 5 }; H.fx(l, { hap: 8 }); H.mem(l, 'Nhận căn hộ nhà ở xã hội sau ' + (l.age - (applied == null ? l.age : applied)) + ' năm chờ.', 4);
        log('Bạn nhận căn hộ nhà ở xã hội, vay ưu đãi ' + mo(l, loan) + '.', 'big'); } },
      { k: 'rent', l: 'Thuê căn hộ nhà ở xã hội', req: function (l, d) { return d.ok; }, ai: { w: 0.9 }, run: function (l, r, log, d) { if (!E.DEC.housingOffer918.valid(l, d) || housingWhy(l) !== true) return; d.done = true; st(l).housing = { status: 'renting', since: l.age }; H.fx(l, { hap: 4 }); log('Bạn chuyển vào căn hộ thuê nhà ở xã hội; tiền thuê khoảng một nửa giá thị trường.', 'good'); } },
      { k: 'decline', l: function (l, d) { return d.ok ? 'Từ chối, nhường suất' : 'Đã hiểu'; }, ai: { w: 0.3 }, run: function (l, r, log, d) { if (!E.DEC.housingOffer918.valid(l, d)) return; d.done = true; st(l).housing = { status: d.ok ? 'declined' : 'lapsed', reapply: l.age + 2 }; log(d.ok ? 'Bạn từ chối suất nhà ở xã hội; có thể nộp lại sau 2 năm.' : 'Suất nhà ở xã hội được chuyển cho người kế tiếp.', 'neutral'); } }
    ] });

  // ================= C7: giao thông — vé xe buýt, vùng phát thải thấp Hà Nội =================
  function hanoi(l) { var p = l.prov || {}; return vn(l) && l.urban && /Hà Nội/.test((p.neu || '') + ' ' + (p.old || '')); }
  function lezPhase(y) { return y >= 2030 ? 3 : y >= 2028 ? 2 : y >= 2026 ? 1 : 0; }
  function lezAffected(l, ph) { return hash(l.id + ':lez918:' + ph) / 4294967296 < [0, 0.12, 0.35, 0.7][ph]; }
  function tweak(l, v) {
    if (!v || !l) return v; var s = l.flags && l.flags.econ918;
    if (!l.veh && !l.rentVeh && vn(l) && l.urban && (l.age < 18 || l.age >= 60) && R.active(l, 'sim_free_bus')) { v.fuel *= 0.2; v.freeBus918 = true; }
    if (s && s.lez && s.lez.mode === 'bus' && l.veh === 'xe máy' && !v.ev && hanoi(l)) { v.lez918 = l.base * BAL.lezBus; v.fuel += v.lez918; }
    v.total = ['fuel', 'maintenance', 'insurance', 'parking', 'road', 'rent'].reduce(function (n, k) { return n + (v[k] || 0); }, 0);
    return v;
  }
  var va = E.vehicleAnnual; if (va) { E.vehicleAnnual = function (l) { return tweak(l, va.apply(this, arguments)); }; E.travelCost = function (l) { return E.vehicleAnnual(l).total; }; }
  function lezYear(l, r) {
    if (!hanoi(l) || !free(l) || l.veh !== 'xe máy' || !va) return; var s = st(l), ph = lezPhase(year(l));
    if (ph <= s.lez.phase || !lezAffected(l, ph) || (va(l) || {}).ev) return; s.lez.phase = ph; X.next(l, 'lez918', r, { at: l.age, ph: ph }, { manual: false });
  }
  E.SC('lez918', { title: 'Vùng phát thải thấp ở Hà Nội',
    prep: function (l, r, arg) { return { at: arg && arg.at, ph: arg && arg.ph, done: false }; },
    valid: function (l, d) { return !!(d && !d.done && d.at === l.age && hanoi(l) && l.veh === 'xe máy'); },
    text: function (l, d) { return ['', 'Hà Nội thí điểm vùng phát thải thấp ở khu phố cổ – hồ Hoàn Kiếm: xe máy chạy xăng bị hạn chế theo khung giờ.', 'Vùng phát thải thấp mở rộng ra toàn Vành đai 1 (theo kế hoạch của thành phố).', 'Vùng phát thải thấp mở rộng đến Vành đai 3 (theo kế hoạch của thành phố).'][d.ph] + ' Nơi bạn sống hoặc làm việc nằm trong khu vực áp dụng. Xe máy xăng của bạn vẫn dùng được ngoài giờ và ngoài vùng.'; },
    opts: [
      { k: 'ev', l: function (l) { return 'Đổi sang xe máy điện (~' + mo(l, l.base * BAL.evBike) + ')'; }, req: function (l) { return l.money >= l.base * BAL.evBike; }, ai: { w: 1 }, run: function (l, r, log, d) { if (!E.DEC.lez918.valid(l, d)) return; d.done = true; H.cash(l, -l.base * BAL.evBike, 'Mua xe máy điện'); l.vehK = 'evo'; l.vehName = 'Xe máy điện'; l.vehVal = l.base * BAL.evBike * 0.9; l.vehBoughtAt = l.age; st(l).lez.mode = 'ev'; log('Bạn bán xe xăng, chuyển sang xe máy điện; chi phí nhiên liệu giảm, cần chỗ sạc.', 'neutral'); } },
      { k: 'bus', l: 'Giữ xe xăng, đi xe buýt/metro trong giờ hạn chế', ai: { w: 1.1 }, run: function (l, r, log, d) { if (!E.DEC.lez918.valid(l, d)) return; d.done = true; st(l).lez.mode = 'bus'; if (l.mind) l.mind.stress = U.clamp(l.mind.stress + 1, 0, 100); log('Bạn kết hợp xe buýt/metro trong giờ hạn chế; tốn thêm khoảng ' + mo(l, l.base * BAL.lezBus) + '/năm đi lại.', 'neutral'); } },
      { k: 'avoid', l: 'Đổi lịch, tránh đi vào giờ hạn chế', ai: { w: 0.6 }, run: function (l, r, log, d) { if (!E.DEC.lez918.valid(l, d)) return; d.done = true; st(l).lez.mode = 'avoid'; H.fx(l, { hap: -1 }); log('Bạn sắp xếp lại giờ đi làm, mua sắm để tránh khung giờ hạn chế.', 'neutral'); } }
    ] });

  // ================= C7: thuế TNDN ước tính (Luật 67/2025) =================
  function cit(revenueBn, profit, commute) {
    var rate = revenueBn < 3 ? 0.15 : revenueBn <= 50 ? 0.17 : 0.2, extra = Math.max(0, commute || 0) * 0.5, base = Math.max(0, profit), cap = base * 0.1;
    var deduct = Math.min(extra, cap), taxable = Math.max(0, base - deduct);
    return { rate: rate, taxable: taxable, tax: taxable * rate, saved: deduct * rate, extraDeduct: deduct };
  }
  function owner(l) { return !!(l.job && E.jobDef && /^kd_/.test((E.jobDef(l) || {}).id || '') || E.BUSINESS123 && E.BUSINESS123.equity && E.BUSINESS123.equity(l) > 0); }
  X.menu('biztax918', 'Thuế thu nhập doanh nghiệp (ước tính)', function (l) { var r = X.reason(l, 18); if (r !== true) return r; return owner(l) ? true : 'Cần đang làm chủ kinh doanh'; }, function (l) {
    var prof = Math.max(0, l.income || 0), rev = toVnd(l, prof) * 4 / 1000, q = cit(rev, prof, 0), sim = R.active(l, 'sim_commute_deduct'), q2 = cit(rev, prof, l.base * 0.05);
    return 'Ước tính theo Luật Thuế TNDN 2025: doanh thu năm trước dưới 3 tỷ đồng chịu 15%, từ 3 đến 50 tỷ 17%, trên 50 tỷ 20%. Doanh thu giả định ≈ 4 lần lợi nhuận năm ' + mo(l, prof) + ' → khoảng ' + dec(rev, 1) + ' tỷ đồng → thuế suất ' + Math.round(q.rate * 100) + '%, thuế ước tính ' + mo(l, q.tax) + '.' +
      '\nĐây là bảng tham khảo: sổ tiền của game ghi lợi nhuận kinh doanh vào thu nhập năm và chưa thu riêng thuế TNDN, nên số này không bị trừ thêm.' +
      (sim ? '\nKịch bản giả định đang áp dụng: chi phí xe đưa đón có chứng từ được tính 150%. Ví dụ chi ' + mo(l, l.base * 0.05) + ' thì phần tính thêm ' + mo(l, q2.extraDeduct) + ' giảm thuế ' + mo(l, q2.saved) + ' — đây là giảm thu nhập tính thuế, không hoàn lại số đã chi.' : '');
  }, function () { return []; }, 18, 'Tiền bạc');

  // ================= C11: biến cố gắn với kinh tế và chính sách (trên CHAIN144, qua bộ khởi phát drama917) =================
  if (CH && D && Array.isArray(D.more)) {
    function adv(l, c) { CH.advance(l, c); } function end(l, c, res, log, t, k) { CH.close(l, c, res, log, t, k); }
    function stress(l, d) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + d, 0, 100); }
    CH.define('d918_squeeze', { max: 2,
      cancel: function (l) { if (!l.indep) return { result: 'changed' }; },
      stages: [
        { dec: 'd918_squeeze_1', after: [0, 0], p: 1, when: free, title: 'Giá cả tăng, ngân sách gia đình chật',
          text: function (l, c) { return 'Năm ' + c.data.y + ' giá thực phẩm, điện nước, học phí dịch vụ tăng nhanh hơn thu nhập. Cuối tháng gia đình thường hụt tiền; bạn cần sắp xếp lại chi tiêu.'; },
          opts: [
            { k: 'cut', l: 'Cắt các khoản không thiết yếu hai năm', ai: { w: 1.2 }, run: function (l, r, log, c) { c.data.path = 'cut'; st(l).budget.cutAt = l.age + 1; H.fx(l, { hap: -2 }); log('Cả nhà thống nhất cắt ăn ngoài, mua sắm và du lịch trong hai năm.', 'neutral'); adv(l, c); } },
            { k: 'side', l: 'Nhận thêm việc ngoài giờ', req: function (l) { return !!l.job; }, ai: { w: 0.9, amb: 0.5 }, run: function (l, r, log, c) { c.data.path = 'side'; H.cash(l, l.base * 0.05, 'Việc làm thêm ngoài giờ'); stress(l, 5); log('Bạn nhận thêm việc buổi tối, có thêm ' + mo(l, l.base * 0.05) + ' nhưng ít thời gian cho gia đình.', 'neutral'); adv(l, c); } },
            { k: 'savings', l: 'Dùng tiền tiết kiệm bù vào, giữ nếp sống', ai: { w: 0.6 }, run: function (l, r, log, c) { c.data.path = 'savings'; log('Bạn rút tiết kiệm để giữ nếp sinh hoạt trong lúc chờ giá ổn định.', 'neutral'); adv(l, c); } }
          ] },
        { after: [1, 1], p: 1, when: free, narrate: function (l, c, log) {
          var m = R.macro((l.abroad && l.abroad.perm && l.abroad.code) || l.country || 'VN', year(l)), calm = !m.shock;
          end(l, c, calm ? 'eased' : 'still_tight', log, calm ? 'Giá cả dịu lại; ' + (c.data.path === 'cut' ? 'thói quen chi tiêu tiết kiệm giúp gia đình có lại khoản dự phòng.' : c.data.path === 'side' ? 'bạn cân nhắc bớt việc làm thêm để nghỉ ngơi.' : 'khoản tiết kiệm vơi đi nhưng sinh hoạt không xáo trộn.') : 'Giá vẫn cao năm nay; gia đình tiếp tục thắt chặt.', calm ? 'good' : 'neutral'); } }
      ] });
    CH.define('d918_eldercare', { max: 1,
      cancel: function (l, c) { var f = l.fam || {}; if (c.data.side === 'm' ? !f.mAlive : !f.fAlive) return { result: 'gone', text: 'Chuyện chăm ' + c.data.who + ' khép lại.', kind: 'neutral' }; },
      stages: [
        // Tiếp diễn của tình huống gốc 'care' trong engine ("Mẹ/Bố đã già yếu"): không tự khởi phát chuyện chăm cha mẹ thứ hai.
        { dec: 'd918_eldercare_1', after: [1, 2], p: 1, when: free, title: function (l, c) { return 'Một năm chăm ' + c.data.who; },
          text: function (l, c) { return (c.data.path === 'yes' ? 'Từ khi đón ' + c.data.who + ' về ở cùng, nhà đông hơn và lịch làm việc của bạn phải xếp lại.' : c.data.who.charAt(0).toUpperCase() + c.data.who.slice(1) + ' vẫn ở nhà riêng, nhờ người chăm và tiền bạn gửi về; mỗi lần ốm vặt bạn lại lo.') + ' Dân số già đi nhanh nên dịch vụ chăm sóc tại nhà nhiều hơn nhưng không rẻ.'; },
          opts: [
            { k: 'home', l: function (l, d) { return 'Tiếp tục tự chăm ở nhà'; }, ai: { w: 1.1 }, run: function (l, r, log, c) { c.data.path = 'home'; stress(l, 4); H.fx(l, { hap: 2 }); log('Bạn tiếp tục tự chăm ' + c.data.who + '; cả nhà xếp lại việc để luôn có người ở nhà.', 'neutral'); adv(l, c); } },
            { k: 'carer', l: function (l) { return 'Thuê người chăm sóc tại nhà (' + mo(l, l.base * 0.15) + '/năm)'; }, req: function (l) { return l.money >= l.base * 0.15; }, ai: { w: 0.9 }, run: function (l, r, log, c) { c.data.path = 'carer'; H.cash(l, -l.base * 0.15, 'Thuê người chăm sóc cha mẹ'); log('Bạn thuê người chăm sóc ' + c.data.who + ' ban ngày, tối về thăm.', 'neutral'); adv(l, c); } },
            { k: 'share', l: 'Họp anh chị em, chia lịch chăm', req: function (l) { return (l.sibList || []).some(function (s) { return s.alive; }); }, ai: { w: 1 }, run: function (l, r, log, c) { c.data.path = 'share'; stress(l, 2); log('Anh chị em chia nhau mỗi người vài ngày trong tuần.', 'neutral'); adv(l, c); } }
          ] },
        { after: [1, 2], p: 1, when: free, narrate: function (l, c, log) {
          var ok = u(l, 'elder') < (c.data.path === 'carer' ? 0.75 : c.data.path === 'share' ? 0.65 : 0.6);
          if (c.data.path === 'share') (l.sibList || []).forEach(function (s) { if (s.alive) s.close = U.clamp((s.close || 60) + (ok ? 4 : -4), 0, 100); });
          end(l, c, ok ? 'settled' : 'strained', log, ok ? 'Việc chăm ' + c.data.who + ' dần vào nếp; ' + c.data.who + ' vui hơn khi có người bên cạnh.' : 'Chăm ' + c.data.who + ' kéo dài khiến bạn mệt mỏi; cả nhà cần tính lại cách chia việc.', ok ? 'good' : 'neutral'); } }
      ] });
    var care0 = E.DEC.care && E.DEC.care.apply;
    if (care0) E.DEC.care.apply = function (l, d, k, r, log) {
      var res = care0.apply(this, arguments), who = d && d.data && d.data.who === 'Bố' ? 'bố' : 'mẹ', f = l.fam || {};
      if (l.alive && (k === 'yes' || k === 'no') && (who === 'mẹ' ? f.mAlive : f.fAlive)) CH.start(l, 'd918_eldercare', { dec: 'care', k: k }, { npc: { ref: null, name: who }, data: { who: who, side: who === 'mẹ' ? 'm' : 'f', path: k } });
      return res;
    };
    function officeJob(l) { var c = l.job && E.jobDef ? E.jobDef(l) : null; return !!(c && /^(office|sale|service|ind|manu|law|media)$/.test(c.cat || '')); }
    CH.define('d918_reskill', { max: 1,
      cancel: function (l, c) { if (!l.job || l.job.since !== c.data.since) return { result: 'job_changed' }; },
      stages: [
        { dec: 'd918_reskill_1', after: [0, 1], p: 1, when: free, title: 'Nơi làm việc chuyển đổi số',
          text: function () { return 'Công ty đưa phần mềm mới và tự động hóa vào nhiều khâu. Một số đầu việc của bạn sẽ thay đổi; công ty mở khóa học kỹ năng số, hỗ trợ một nửa học phí.'; },
          opts: [
            { k: 'course', l: 'Đăng ký khóa kỹ năng số (công ty hỗ trợ 50%)', req: function (l) { var s = st(l); return !(s.retrain && !s.retrain.done) && l.money >= l.base * 0.03; }, ai: { w: 1.2 }, run: function (l, r, log, c) { c.data.path = 'course'; var q = st(l); H.cash(l, -l.base * 0.03, 'Học phí kỹ năng số (phần tự trả)'); q.retrain = { k: 'digital', start: l.age, done: false, paid: l.base * 0.03, support: l.base * 0.03, employer: true }; log('Bạn đăng ký khóa kỹ năng số do công ty hỗ trợ.', 'neutral'); adv(l, c); } },
            { k: 'self', l: 'Tự học qua tài liệu và đồng nghiệp', ai: { w: 0.9 }, run: function (l, r, log, c) { c.data.path = 'self'; stress(l, 3); H.fx(l, { kno: 1 }); log('Bạn tự học buổi tối, nhờ đồng nghiệp trẻ chỉ thêm.', 'neutral'); adv(l, c); } },
            { k: 'keep', l: 'Giữ cách làm cũ', ai: { w: 0.4 }, run: function (l, r, log, c) { c.data.path = 'keep'; log('Bạn tiếp tục cách làm quen thuộc.', 'neutral'); adv(l, c); } }
          ] },
        { after: [1, 1], p: 1, when: free, narrate: function (l, c, log) {
          var good = c.data.path !== 'keep'; if (l.job) l.job.rep = U.clamp((l.job.rep == null ? 50 : l.job.rep) + (good ? 3 : -4), 0, 100);
          end(l, c, good ? 'adapted' : 'lagging', log, good ? 'Bạn bắt nhịp với quy trình mới; cấp trên giao thêm việc phân tích.' : 'Quy trình mới chạy nhanh hơn bạn theo kịp; đánh giá cuối năm ghi cần cải thiện kỹ năng số.', good ? 'good' : 'neutral'); } }
      ] });
    D.more.push(function (l) {
      var out = [], y = year(l), m = R.macro((l.abroad && l.abroad.perm && l.abroad.code) || l.country || 'VN', y);
      if (m.shock && l.indep && ((l.kids || []).some(function (k) { return k.alive !== false && l.age - k.born < 22; }) || partnerOf(l))) out.push(['d918_squeeze', 1.4, { npc: { ref: null, name: '' }, data: { y: y } }]);
      if (officeJob(l) && l.age >= 30 && l.age <= 56 && y >= 2027) out.push(['d918_reskill', 0.5, { npc: { ref: null, name: '' }, data: { since: l.job.since } }]);
      return out;
    });
  }

  // ================= hook năm và bản lưu =================
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !l.flags || !['vn', 'world'].includes(l.mode)) return;
    budgetYear(l, log); retrainYear(l, log); housingYear(l, r, log); sickYear(l, r); lezYear(l, r);
  });
  var mig = E.migrateExt; E.migrateExt = function (l) { if (mig) mig(l); if (l && l.flags && l.flags.econ918 != null && typeof l.flags.econ918 !== 'object') delete l.flags.econ918; };
  E.ECON918 = { BAL: BAL, COURSES: COURSES, state: st, slip: slip, pressure: pressure, essentials: essentials, housingWhy: housingWhy, socialPrice: socialPrice, cit: cit, lezPhase: lezPhase, entitlement: entitlement, tweak: tweak };
})(globalThis.G);
