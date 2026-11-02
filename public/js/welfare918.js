/* Một Đời — Phần C hoàn thiện (8.10.20): các mục còn lại của MD3, mở rộng hệ sẵn có, không tạo sổ tiền song song.
   · C3: chỉ số giá theo ngành (nhà ở, học phí, y tế, đi lại), lãi suất điều hành, tỷ giá — chung theo nước/năm; tác động chi phí
     qua E.livingCost918 (econ918) theo giá tương đối, có trần. Lương công vụ (careers: hệ số × lương cơ sở) và lương hưu điều chỉnh
     theo lương cơ sở 2,53 triệu từ 7/2026 rồi theo kịch bản.
   · C4: BHYT hộ gia đình phải đóng hằng năm (E.hasBHYT / life77); quỹ hưu trí tự nguyện có trừ thuế (tax-resident) và rút đúng/
     trước tuổi; bảo hiểm nhân thọ (expansion.js) có thời gian chờ và loại trừ bệnh có sẵn.
   · C5: làm thêm giờ, phép năm, thực tập cho sinh viên, hỗ trợ người khuyết tật (health915 dev915), thu nhập tối thiểu (giả định).
   · C6: vay sinh viên NHCSXH (giải ngân khi học, chuyển thành khoản vay khi ra trường), miễn học phí trừ vào chi phí con,
     BHYT trẻ dưới 16 (giả định).
   · C7: thuế kinh doanh trừ tiền thật (hộ kinh doanh theo doanh thu / doanh nghiệp theo lợi nhuận), lệ phí trước bạ xe xăng/điện.
   · B×C: cán bộ đề xuất chính sách toàn quốc hoặc thí điểm ở tỉnh mình, trong thẩm quyền, có xét duyệt và hậu quả.
   · C6: căn hộ nhà ở xã hội bán/chuyển trước 5 năm → khoản vay ưu đãi đến hạn ngay.
   Số ngẫu nhiên băm theo nhân vật + năm (không tiêu RNG của game). */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, R = E.ERA917, C9 = E.ECON918, T9 = E.TRAVEL918;
  if (!X || !R || !C9) return;
  var BAL = { sectorCap: [0.9, 1.1], ref: 2.53, bhytRate: 0.045, volMax: 1, volReal: 0.02, volPenalty: 0.1, otPay: 1.5, otHours: { none: 0, some: 100, heavy: 200, max: 300 },
    studentMonth: 4, studentRate: 0.066, disAllow: { severe: 1.0, extreme: 1.25 }, basicIncome: 1, hkdRate: 0.015, hkdFree: 500, tuitionShare: 0.012,
    pubReal: { reform: 0, balanced: 0.003, expanded: 0.006 }, pubCap: 1.15, pensionReal: 0.5 };
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; h = Math.imul(h, 3266489909); h ^= h >>> 16; return h >>> 0; }
  function u(l, tag) { return hash(l.id + ':w918:' + tag + ':' + l.age) / 4294967296; }
  function dec(x, n) { return Number(x).toFixed(n).replace('.', ','); }
  function year(l, a) { return R.year(l, a); }
  function vn(l) { return R.vnHere(l); }
  function mo(l, v) { return H.money(l, v); }
  function ledger(l, vnd) { return E.TAX909 ? E.TAX909.ledger(l, vnd) : vnd; }
  function toVnd(l, v) { return E.TAX909 ? E.TAX909.toVnd(l, v) : v; }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.flags.military && l.age < l.flags.military); }
  function st(l) {
    var s = l.flags.welfare918; if (!s || typeof s !== 'object') s = l.flags.welfare918 = {};
    ['vol', 'work', 'intern', 'loan', 'dis', 'prop'].forEach(function (k) { if (s[k] != null && typeof s[k] !== 'object') delete s[k]; });
    return s;
  }
  function cc(l) { return (l.abroad && l.abroad.perm && l.abroad.code) || l.country || 'VN'; }

  // ================= C3: chỉ số theo ngành, lãi suất, tỷ giá =================
  var SECT = { housing: [-0.003, 0.007], health: [-0.004, 0.006], tuition: [-0.005, 0.004], transport: [-0.008, 0.004] }; // giá ngành so với mặt bằng lương/năm (sổ tiền theo giá 2026, lương thực khu vực tư không tăng)
  function sectorYear(c, t) { var w = function (k) { return hash('sector918:' + c + ':' + k + ':' + t) / 4294967296; }, m = R.macro(c, t), o = {};
    Object.keys(SECT).forEach(function (k) { var r = SECT[k]; o[k] = r[0] + w(k) * (r[1] - r[0]) + (m.shock && k === 'housing' ? -0.01 : 0); });
    o.rate = 0.03 + w('rate') * 0.03 + (m.shock ? 0.02 : 0); o.fx = 0.005 + w('fx') * 0.025 + (m.shock ? 0.03 : 0); return o; }
  function sectors(l, y) {
    y = y == null ? year(l) : y; var c = cc(l), o = { housing: 1, health: 1, tuition: 1, transport: 1, fx: 1 }, last = sectorYear(c, Math.max(2027, y));
    for (var t = 2027; t <= y; t++) { var q = sectorYear(c, t); ['housing', 'health', 'tuition', 'transport'].forEach(function (k) { o[k] *= 1 + q[k]; }); o.fx *= 1 + q.fx; }
    ['housing', 'health', 'tuition', 'transport'].forEach(function (k) { o[k] = U.clamp(o[k], BAL.sectorCap[0], BAL.sectorCap[1]); });
    o.rate = last.rate; return o;
  }
  // Áp chi phí tương đối vào ngân sách năm (sau econ918). Giá thuê theo nhà ở; y tế; đi lại; phần học của chi phí con theo học phí.
  var lc0 = E.livingCost918;
  E.livingCost918 = function (l, F) {
    if (lc0) lc0.apply(this, arguments); if (!l || !F || !l.indep) return;
    var x = sectors(l), kidsSchool = (l.kids || []).filter(function (k) { return k.alive !== false && l.age - k.born >= 3 && l.age - k.born <= 17 && k.custody !== 'other' && k.custody !== 'ex'; }).length;
    if (F.rent > 0) F.rent *= x.housing; if (F.health > 0) F.health *= x.health; // đi lại: áp trong E.vehicleAnnual để bảng nuôi xe khớp ngân sách
    if (F.kids > 0 && kidsSchool) {
      F.kids += kidsSchool * l.base * BAL.tuitionShare * (x.tuition - 1);
      if (vn(l) && R.active(l, 'vn_tuition_2025')) { var off = kidsSchool * l.base * BAL.tuitionShare * x.tuition; F.kids = Math.max(0, F.kids - off); st(l).tuitionSaved = { y: year(l), v: off }; }
    }
    st(l).sect = { y: year(l), housing: x.housing, health: x.health, tuition: x.tuition, transport: x.transport, rate: x.rate, fx: x.fx };
  };

  var va0 = E.vehicleAnnual;
  if (va0) E.vehicleAnnual = function (l) { var v = va0.apply(this, arguments); if (!v || !l || !l.indep) return v; var k = sectors(l).transport; if (k !== 1) { var fixed = (v.lez918 || 0) + (l.rentVeh && !(l.jailUntil != null && l.age < l.jailUntil) ? Math.max(0, l.rentVeh.fuel || 0) * 12 : 0); v.fuel = Math.max(0, v.fuel - fixed) * k + fixed; /* phần theo hợp đồng thuê xe / vùng phát thải không nhân chỉ số */ ['maintenance', 'parking'].forEach(function (f) { v[f] *= k; }); v.total = ['fuel', 'maintenance', 'insurance', 'parking', 'road', 'rent'].reduce(function (n, f) { return n + (v[f] || 0); }, 0); } return v; };
  // ================= C3/C4: lương công vụ và lương hưu theo lương cơ sở =================
  function pubIndex(l, y) {
    y = y == null ? year(l) : y; if (y < 2027) return y === 2026 ? 1 + (BAL.ref / 2.34 - 1) / 2 : 1;
    var g = BAL.pubReal[R.state(l).scen] || BAL.pubReal.balanced, p = R.POLICIES.find(function (q) { return q.id === 'sim_pubwage_index'; }), f = p ? R.effFrom(l, p) : 2028;
    var idx = (BAL.ref / 2.34) / (1 + R.macro('VN', 2026).cpi) * Math.pow(1 + g, Math.max(0, y - Math.max(2027, f == null ? 2028 : f) + 1));
    return Math.min(BAL.pubCap, idx);
  }
  function stateJob(l) { var c = l.job && E.jobDef ? E.jobDef(l) : null; return !!(c && vn(l) && (c.sec === 'state' || c.cat === 'state' || (E.STATE174 && E.STATE174.isVNState(l)))); }
  var cy0 = E.careerYear;
  E.careerYear = function (l, r, log) {
    var out = cy0.apply(this, arguments);
    if (!(out > 0) || !l.alive) return out;
    out = bizTax(l, out, log);
    return out;
  };
  E.wageIndex918 = function (l) { return stateJob(l) ? pubIndex(l) : 1; };
  function pensionYear(l, log) {
    if (!vn(l) || !l.pensioned || !(l.pensionInc > 0)) return; var s = st(l), y = year(l);
    if (s.penAt === y) return; s.penAt = y;
    if (y === 2026 && !s.pen2026) { s.pen2026 = true; l.pensionInc *= 1 + (BAL.ref / 2.34 - 1) * 0.5; log && log('Lương hưu được điều chỉnh theo lương cơ sở mới từ tháng 7/2026.', 'neutral'); return; }
    if (y >= 2027) { var g = (BAL.pubReal[R.state(l).scen] || 0.01) * BAL.pensionReal; l.pensionInc *= 1 + g; s.penIdx = (s.penIdx || 1) * (1 + g); }
  }

  // ================= C7: thuế kinh doanh (trừ tiền thật, Việt Nam, từ 2026) =================
  function owner(l) { var c = l.job && E.jobDef ? E.jobDef(l) : null; return !!(c && (/^kd_/.test(c.id) || c.owner || c.cat === 'biz' && /^(chủ|giám đốc)/.test(c.t[Math.min(l.job.rank || 0, c.t.length - 1)] || ''))); }
  function bizTax(l, out, log) {
    if (!owner(l) || !vn(l) || year(l) < 2026) return out;
    var s = st(l); if (s.taxAt === l.age) return out; s.taxAt = l.age;
    var y = l.yr || (l.yr = { items: [] }); if (E.economy114Income && y.pre918 !== l.age) { var raw = out; out = E.economy114Income(l, raw, 'career'); y.pre918 = l.age; } // thuế trên lợi nhuận sau điều chỉnh bền vững (life115)
    var profitVnd = toVnd(l, out), revBn = profitVnd * 4 / 1000, firm = revBn >= 3 || (l.job.rank || 0) >= 2, tax, how;
    if (!firm) { var revM = profitVnd * 4; tax = revM <= BAL.hkdFree ? 0 : (revM - BAL.hkdFree) * BAL.hkdRate; how = 'hộ kinh doanh, ' + dec(revM / 1000, 2) + ' tỷ doanh thu ước tính'; }
    else { var commute = R.active(l, 'sim_commute_deduct') && s.shuttle ? toVnd(l, l.base * 0.05) : 0, q = C9.cit(revBn, profitVnd, commute); tax = q.tax; how = 'doanh nghiệp, thuế suất ' + Math.round(q.rate * 100) + '%' + (q.saved ? ', ưu đãi xe đưa đón giảm ' + mo(l, ledger(l, q.saved)) : ''); if (commute) H.cash(l, -l.base * 0.05, 'Xe đưa đón người lao động'); }
    var t = ledger(l, tax); s.lastTax = { age: l.age, tax: t, how: how, firm: firm };
    if (t > 0 && log) log('Thuế kinh doanh năm nay (' + how + '): ' + mo(l, t) + '.', 'neutral');
    return Math.max(0, out - t);
  }

  // ================= C4: BHYT hộ gia đình, quỹ hưu trí tự nguyện =================
  function bhytFree(l) { return !!((E.insured && E.insured(l)) || l.age < 6 || l.age >= 75 || l.fam && l.fam.q <= 1 || l.pensioned || l.school); }
  function bhytPremium(l) { return ledger(l, BAL.bhytRate * BAL.ref * 12) * (l.fam && l.fam.q === 2 ? 0.3 : 1); } // hộ cận nghèo được ngân sách hỗ trợ 70% (hộ nghèo đã miễn qua bhytFree)
  function bhytYear(l, log) {
    if (!vn(l) || !l.indep || bhytFree(l) || !l.flags.bhytVol) return;
    var s = st(l); if (s.bhytAt === l.age) return; s.bhytAt = l.age;
    var p = bhytPremium(l); if (l.money < p) { l.flags.bhytVol = false; log && log('Không đủ tiền gia hạn BHYT hộ gia đình; thẻ BHYT hết hiệu lực.', 'bad'); return; }
    H.cash(l, -p, 'BHYT hộ gia đình');
  }
  function volState(l) { var s = st(l); if (!s.vol) s.vol = { m: 0, bal: 0, paid: 0, since: null }; return s.vol; }
  E.pitDeduct918 = function (l) { var v = l.flags && l.flags.welfare918 && l.flags.welfare918.vol; return v && v.m > 0 && v.payAt != null && v.payAt >= l.age - 1 ? Math.min(v.m, BAL.volMax) * 12 : 0; }; // triệu đ/năm, dùng trong tax-resident
  function volYear(l, log) {
    var v = l.flags.welfare918 && l.flags.welfare918.vol; if (!v) return;
    if (v.bal > 0) v.bal *= 1 + BAL.volReal;
    if (v.m > 0 && l.job && l.indep) { var amt = ledger(l, v.m * 12); if (l.money >= amt) { H.cash(l, -amt, 'Đóng quỹ hưu trí tự nguyện'); v.bal += amt; v.paid += amt; v.payAt = l.age; if (v.since == null) v.since = l.age; } else { v.m = 0; log && log('Tạm dừng đóng quỹ hưu trí tự nguyện vì không đủ tiền.', 'neutral'); } }
  }
  function volAge(l) { return Math.ceil(R.retireAge(l, l.sex, year(l)) - 1e-9); }

  // ================= C5: giờ làm, phép năm =================
  function employee(l) { return !!(l.job && (H.isEmployee ? H.isEmployee(l) : true)); }
  function workYear(l, log) {
    var w = st(l).work; if (!w || !employee(l) || !free(l)) return; if (w.at === l.age) return; w.at = l.age;
    var gm = ((l.yr && l.yr.gross) || l.income || 0) / 12, hourly = gm / 208, h = BAL.otHours[w.ot] || 0;
    if (h > 0) { var pay = hourly * h * BAL.otPay * 0.85; H.cash(l, pay, 'Tiền làm thêm giờ (đã trừ thuế, bảo hiểm ước tính)'); if (l.mind) l.mind.stress = U.clamp(l.mind.stress + (h >= 200 ? 7 : 3), 0, 100); if (h >= 200) H.fx(l, { hea: -2 }); w.otTotal = (w.otTotal || 0) + h; }
    if (w.leave === 'full') { if (l.mind) l.mind.stress = U.clamp(l.mind.stress - 3, 0, 100); H.fx(l, { hap: 2 }); }
    else if (w.leave === 'skip') { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + 3, 0, 100); if (l.job) l.job.rep = U.clamp((l.job.rep == null ? 50 : l.job.rep) + 1, 0, 100); }
  }

  // ================= C5: thực tập =================
  function student(l) { return l.school === 'uni' || l.school === 'voc' || l.school === 'abroad'; }
  function internYear(l, log) { var i = st(l).intern; if (!i || i.done || l.age <= i.at) return; i.done = true; var ok = u(l, 'intern') < U.clamp(0.4 + (l.st.kno || 0) / 250 + (i.paid ? 0.05 : 0), 0.3, 0.9); i.ok = ok; log && log(ok ? 'Kỳ thực tập kết thúc tốt; nơi thực tập ghi nhận và hẹn liên hệ khi bạn tốt nghiệp.' : 'Kỳ thực tập kết thúc, bạn học được cách làm việc nhưng chưa có lời mời.', ok ? 'good' : 'neutral'); }
  var off0 = E.offers;
  if (off0) E.offers = function (l, r) {
    var o = off0.apply(this, arguments), i = l && l.flags && l.flags.welfare918 && l.flags.welfare918.intern;
    if (!Array.isArray(o) || !i || !i.ok || l.age - i.at > 4 || student(l)) return o;
    var id = Object.keys(E.CAR).find(function (k) { var c = E.CAR[k]; return c.major === i.major && o.indexOf(k) < 0 && (!E.jobEligible || E.jobEligible(l, c)); });
    if (id) o.unshift(id); return o;
  };

  // ================= C5: người khuyết tật =================
  var SEVERE = { id: 'severe', autism: 'severe', motor: 'severe' };
  function disOf(l, who) { var d = who && who.dev915; if (!d || !d.c) return null; var ks = Object.keys(d.c).filter(function (k) { return SEVERE[k] && d.c[k].known; }); return ks.length ? ks : null; }
  function disPeople(l) { var out = []; if (disOf(l, l)) out.push({ who: l, name: 'Bạn', key: 'self' }); (l.kids || []).forEach(function (k) { if (k.alive !== false && disOf(l, k) && (l.age - k.born < 18 || !k.indep)) out.push({ who: k, name: k.name, key: 'kid:' + k.name }); }); return out; }
  function disYear(l, log) {
    var s = st(l), d = s.dis || {}; if (!vn(l)) return;
    Object.keys(d).forEach(function (k) { var e = d[k]; if (e.status === 'pending' && l.age > e.at) { e.status = 'approved'; e.level = u(l, 'dis' + k) < 0.4 ? 'extreme' : 'severe'; log && log('Hội đồng xác định mức độ khuyết tật ' + (e.level === 'extreme' ? 'đặc biệt nặng' : 'nặng') + ' cho ' + e.name + '; được hưởng trợ cấp xã hội hằng tháng.', 'neutral'); }
      if (e.status === 'approved' && e.paidAt !== l.age) { e.paidAt = l.age; var v = ledger(l, BAL.disAllow[e.level] * 12); H.cash(l, v, 'Trợ cấp xã hội người khuyết tật'); } });
  }

  // ================= C6: vay sinh viên =================
  function studentLoanYear(l, log) {
    var s = st(l), q = s.loan; if (!q || !(q.bal > 0)) return;
    if (student(l)) { q.bal *= 1 + BAL.studentRate; return; }
    if (q.converted) return; q.converted = l.age; l.loans = l.loans || [];
    l.loans.push({ type: 'bank', name: 'vay sinh viên (NHCSXH)', bal: q.bal, rate: BAL.studentRate, minShare: 0.12, late: 0, since: l.age, student918: true });
    log && log('Ra trường: khoản vay sinh viên ' + mo(l, q.bal) + ' bắt đầu trả góp, lãi 0,55%/tháng.', 'neutral'); q.bal = 0;
  }

  // ================= C6: BHYT trẻ em (giả định) =================
  var share0 = E.bhytShare;
  if (share0) E.bhytShare = function (l) { var v = share0.apply(this, arguments); if (v > 0 && l && l.age < 16 && vn(l) && R.active(l, 'sim_child_health')) return 1; return v; };

  // ================= C5: thu nhập tối thiểu (giả định) =================
  function basicYear(l, log) {
    if (!vn(l) || !R.active(l, 'sim_basic_income') || l.age < 18 || l.age > 60 || !l.indep) return;
    var s = st(l); if (s.basicAt === l.age) return; if ((l.income || 0) >= l.base * 0.5) return; s.basicAt = l.age;
    var v = ledger(l, BAL.basicIncome * 12); H.cash(l, v, 'Hỗ trợ thu nhập tối thiểu (thí điểm, kịch bản)'); if (!s.basicLog) { s.basicLog = true; log && log('Chương trình thí điểm hỗ trợ thu nhập tối thiểu (kịch bản An sinh mở rộng) trả 1 triệu/tháng cho người thu nhập rất thấp.', 'good'); }
  }

  // ================= C7: lệ phí trước bạ xe =================
  function evModel(k, n) { return /^(vf3|vf5|vf7|vf8|evo|feliz|theon|yadea)$/.test(k || '') || /điện/i.test(n || ''); }
  function regFee(l, car, ev, price) {
    if (!vn(l)) return 0; var big = /Hà Nội|Hồ Chí Minh/.test(((l.prov || {}).neu || '') + ((l.prov || {}).old || '')), y = year(l);
    var rate = car ? (/Hà Nội/.test((l.prov || {}).neu || '') ? 0.12 : 0.1) : (big && l.urban ? 0.05 : 0.02);
    if (car && ev) rate = y <= 2026 ? 0 : y <= 2028 ? rate * 0.5 : rate;
    return price * rate;
  }
  if (E.DEC.mua_xe_mau) { var mx0 = E.DEC.mua_xe_mau.apply; E.DEC.mua_xe_mau.apply = function (l, d, k) {
    var before = l.vehK + '|' + l.vehBoughtAt + '|' + l.vehName, res = mx0.apply(this, arguments);
    if (l.vehBoughtAt === l.age && before !== l.vehK + '|' + l.vehBoughtAt + '|' + l.vehName && /^[mg]_/.test(k || '')) {
      var car = l.veh === 'ô tô', fee = regFee(l, car, evModel(l.vehK, l.vehName), l.vehVal || 0);
      if (fee > 0) { H.cash(l, -fee, 'Lệ phí trước bạ'); l.log.push({ a: l.age, y: l.birthYear + l.age, t: 'Nộp lệ phí trước bạ ' + mo(l, fee) + ' khi đăng ký ' + (l.vehName || 'xe') + '.', k: 'neutral' }); }
      else if (car && vn(l)) l.log.push({ a: l.age, y: l.birthYear + l.age, t: 'Ô tô điện được miễn lệ phí trước bạ theo chính sách hiện hành.', k: 'neutral' });
    }
    return res; }; }

  // ================= C6: khóa bán nhà ở xã hội 5 năm =================
  function housingLock(l, log) {
    var h = l.flags.econ918 && l.flags.econ918.housing; if (!h || h.status !== 'owner' || l.ownHouse || !(h.noSaleUntil > l.age)) return;
    h.status = 'sold_early'; h.end = l.age;
    var ls = (l.loans || []).filter(function (x) { return x.social918 && x.bal > 0.5; }), due = ls.reduce(function (n, x) { return n + x.bal; }, 0);
    l.loans = (l.loans || []).filter(function (x) { return !x.social918; }); if (due > 0) H.cash(l, -due, 'Trả ngay khoản vay nhà ở xã hội (chuyển nhượng trước 5 năm)');
    log && log('Căn hộ nhà ở xã hội được chuyển đi trước hạn 5 năm: chỉ được bán lại cho đơn vị quản lý hoặc người đủ điều kiện, khoản vay ưu đãi ' + mo(l, due) + ' phải trả ngay.', 'bad');
  }

  // ================= C9: hộ chiếu khi đi học/làm việc nước ngoài =================
  function abroadPassport(l, log) {
    if (!T9 || !l.abroad) return; var t = T9.state(l); if (T9.passport(l)) return;
    var fee = l.country === 'VN' ? ledger(l, 0.2) : l.base * 0.015, own = l.indep; if (own) H.cash(l, -fee, 'Lệ phí hộ chiếu');
    t.passport = { cc: l.country, issued: l.age, until: l.age + (l.age < 14 ? 5 : 10), forTrip: l.abroad.code };
    log && log((own ? 'Bạn làm hộ chiếu' : 'Bố mẹ làm hộ chiếu cho bạn') + ' trước khi sang ' + (l.abroad.name || l.abroad.code) + ' (lệ phí ' + mo(l, fee) + (own ? '' : ', gia đình chi') + ').', 'neutral');
  }

  // ================= B×C: cán bộ đề xuất / thí điểm chính sách =================
  function S174() { return E.STATE174; }
  function polLevel(l) { var S = S174(); return S && S.isVNState(l) ? S.levelOf(l) : 0; }
  function polScope(l) { var p = l.job && l.job.post917; return p && (p.kind === 'province' || p.kind === 'commune') ? 'local' : polLevel(l) >= 7 ? 'national' : polLevel(l) >= 5 && p && p.kind === 'province' ? 'local' : null; }
  var LOCAL = { sim_child_allowance: 1, sim_free_bus: 1, sim_basic_income: 1 }; // chính sách địa phương có thể thí điểm bằng ngân sách tỉnh
  function candidatePolicies(l) { var sc = polScope(l); return R.POLICIES.filter(function (p) { return p.layer === 'simulated' && !p.all && !R.active(l, p.id) && (sc !== 'local' || LOCAL[p.id]); }); }
  function propYear(l, log) {
    var q = st(l).prop; if (!q || !q.pending || l.age <= q.pending.at) return; var p = q.pending; q.pending = null;
    var S = S174(), s = S ? S.state(l) : null, k = s ? s.kpi : { credibility: 50, coordination: 50 }, allies = s && s.b917 ? s.b917.allies.filter(function (a) { return a.active; }).length : 0;
    var chance = U.clamp(0.2 + (k.credibility - 50) / 100 + (k.coordination - 50) / 150 + allies * 0.05 + (p.scope === 'local' ? 0.2 : 0), 0.05, 0.85), ok = u(l, 'prop' + p.id) < chance;
    var e = R.state(l); if (!e.override) e.override = {}; if (!e.pilot) e.pilot = {};
    if (ok && p.scope === 'national') { e.override[p.id] = year(l) + 2; if (s) s.kpi.credibility = U.clamp(s.kpi.credibility + 4, 20, 100); }
    if (ok && p.scope === 'local') { e.pilot[p.id] = { prov: p.prov, from: year(l) + 1, by: l.age }; if (s) s.kpi.coordination = U.clamp(s.kpi.coordination + 3, 20, 100); }
    if (!ok && s) s.kpi.credibility = U.clamp(s.kpi.credibility - 2, 20, 100);
    (q.hist || (q.hist = [])).push({ age: l.age, id: p.id, scope: p.scope, ok: ok }); q.hist = q.hist.slice(-10);
    var pol = R.POLICIES.find(function (x) { return x.id === p.id; });
    log && log(ok ? (p.scope === 'national' ? 'Đề xuất "' + pol.note.slice(0, 60) + '…" được thông qua; áp dụng toàn quốc từ năm ' + (year(l) + 2) + ' (thế giới của đời này).' : 'Thí điểm tại ' + p.prov + ' được phê duyệt, bắt đầu từ năm ' + (year(l) + 1) + '.') : 'Đề xuất chưa được thông qua: hội đồng thẩm định yêu cầu thêm số liệu về nguồn lực và tác động.', ok ? 'good' : 'neutral');
  }

  // ================= menu =================
  X.menu('insurance918', 'BHYT và quỹ hưu trí tự nguyện', function (l) { var r = X.reason(l, 18); return r !== true ? r : vn(l) ? true : 'Áp dụng khi sống tại Việt Nam'; }, function (l) {
    var v = volState(l), has = E.hasBHYT ? E.hasBHYT(l) : false, sh = E.bhytShare ? E.bhytShare(l) : 0;
    return 'BHYT: ' + (has ? 'đang có thẻ, khám đúng tuyến được chi trả ' + Math.round(sh * 100) + '%' + (bhytFree(l) ? ' (thuộc diện được đóng hoặc hỗ trợ)' : ' (BHYT hộ gia đình, tự đóng ' + mo(l, bhytPremium(l)) + '/năm)') : 'chưa có thẻ — viện phí tự trả toàn bộ') + '. Khám trái tuyến hoặc dịch vụ theo yêu cầu: BHYT chỉ trả phần chuẩn hoặc không trả.' +
      '\nQuỹ hưu trí tự nguyện: đang đóng ' + mo(l, ledger(l, v.m)) + '/tháng, số dư ' + mo(l, v.bal) + ' (đã đóng ' + mo(l, v.paid) + '). Khoản đóng được trừ khi tính thuế TNCN tối đa ' + mo(l, ledger(l, BAL.volMax)) + '/tháng (mức theo luật cũ, chưa đọc lại luật 2025). Rút từ tuổi nghỉ hưu (' + volAge(l) + '); rút trước mất ' + Math.round(BAL.volPenalty * 100) + '% (hoàn ưu đãi thuế, phí).' +
      (l.ins ? '\nBảo hiểm nhân thọ: ' + l.ins.name + ' — không chi trả bệnh phát hiện trong năm đầu (thời gian chờ) và bệnh mạn tính có từ trước khi mua.' : '');
  }, function (l) {
    var v = volState(l), out = [];
    if (!(E.hasBHYT && E.hasBHYT(l)) && !bhytFree(l)) out.push({ k: 'bhyt', l: 'Mua BHYT hộ gia đình', h: mo(l, bhytPremium(l)) + '/năm, tự gia hạn mỗi năm', why: l.money >= bhytPremium(l) ? true : 'Chưa đủ tiền', run: function (l, r, log) { if (l.money < bhytPremium(l)) return; H.cash(l, -bhytPremium(l), 'BHYT hộ gia đình'); l.flags.bhytVol = true; st(l).bhytAt = l.age; log('Bạn mua thẻ BHYT hộ gia đình; khám đúng tuyến được chi trả phần lớn viện phí.', 'good'); } });
    if (l.flags.bhytVol && !bhytFree(l)) out.push({ k: 'bhytStop', l: 'Ngừng gia hạn BHYT hộ gia đình', h: 'Hết thẻ thì viện phí tự trả toàn bộ', run: function (l, r, log) { l.flags.bhytVol = false; log('Bạn ngừng gia hạn BHYT.', 'neutral'); } });
    [0, 0.5, 1, 2].forEach(function (m) { out.push({ k: 'v' + m, l: (v.m === m ? '✓ ' : '') + (m ? 'Đóng quỹ hưu trí tự nguyện ' + mo(l, ledger(l, m)) + '/tháng' : 'Không đóng quỹ hưu trí tự nguyện'), h: m ? 'Trừ thuế tối đa 1 triệu/tháng; cần đang đi làm' : '', why: v.m === m ? 'Đang dùng' : m && !l.job ? 'Cần đang đi làm' : true, run: function (l, r, log) { volState(l).m = m; log(m ? 'Đăng ký đóng quỹ hưu trí tự nguyện ' + mo(l, ledger(l, m)) + '/tháng.' : 'Dừng đóng quỹ hưu trí tự nguyện.', 'neutral'); } }); });
    if (v.bal > 0) { var early = l.age < volAge(l); out.push({ k: 'withdraw', l: (early ? 'Rút trước hạn' : 'Rút') + ' quỹ hưu trí tự nguyện (' + mo(l, v.bal * (early ? 1 - BAL.volPenalty : 1)) + ')', h: early ? 'Mất ' + Math.round(BAL.volPenalty * 100) + '% (hoàn ưu đãi thuế, phí)' : 'Đủ tuổi nghỉ hưu, rút toàn bộ', run: function (l, r, log) { var q = volState(l), e = l.age < volAge(l), get = q.bal * (e ? 1 - BAL.volPenalty : 1); if (!(q.bal > 0)) return; H.cash(l, get, 'Rút quỹ hưu trí tự nguyện'); log('Rút quỹ hưu trí tự nguyện ' + mo(l, get) + (e ? ' (trước tuổi, mất ' + mo(l, q.bal - get) + ').' : '.'), e ? 'neutral' : 'good'); q.bal = 0; q.m = 0; } }); }
    return out;
  }, 18, 'Tiền bạc');
  X.menu('work918', 'Giờ làm, tăng ca và phép năm', function (l) { var r = X.reason(l, 18); return r !== true ? r : employee(l) ? true : 'Cần đang làm công ăn lương'; }, function (l) {
    var w = st(l).work || {}, gm = ((l.yr && l.yr.gross) || l.income || 0) / 12;
    return 'Tuần làm việc tiêu chuẩn tối đa 48 giờ; làm thêm ngày thường trả ít nhất 150% lương giờ, tối đa 40 giờ/tháng và 200 giờ/năm (một số ngành 300 giờ), phải có sự đồng ý của người lao động. Phép năm 12 ngày; tiền phép chưa nghỉ chỉ được trả khi thôi việc.\nLương giờ ước tính: ' + mo(l, gm / 208) + '. Đang chọn: tăng ca ' + ({ none: 'không', some: '100 giờ/năm', heavy: '200 giờ/năm', max: '300 giờ/năm' }[w.ot] || 'không') + ', phép năm ' + ({ full: 'nghỉ đủ', skip: 'không nghỉ', part: 'nghỉ một phần' }[w.leave] || 'nghỉ một phần') + '.';
  }, function (l) {
    var w = st(l).work || {}, c = l.job && E.jobDef ? E.jobDef(l) : {}, heavyOk = /^(ind|manu|build|agri|service)$/.test(c.cat || '');
    return [['none', 'Không làm thêm giờ'], ['some', 'Làm thêm khoảng 100 giờ/năm'], ['heavy', 'Làm thêm 200 giờ/năm (mức trần chung)'], ['max', 'Làm thêm 300 giờ/năm (ngành được phép)']].map(function (x) {
      return { k: 'ot:' + x[0], l: (w.ot === x[0] ? '✓ ' : '') + x[1], h: x[0] === 'none' ? '' : 'Lương giờ × 150%; căng thẳng tăng' + (x[0] !== 'some' ? ', sức khỏe giảm nhẹ' : ''), why: w.ot === x[0] ? 'Đang dùng' : x[0] === 'max' && !heavyOk ? 'Ngành nghề hiện tại không thuộc diện làm thêm 300 giờ' : true, run: function (l, r, log) { var q = st(l); q.work = q.work || {}; q.work.ot = x[0]; log('Đăng ký: ' + x[1].toLowerCase() + '.', 'neutral'); } };
    }).concat([['full', 'Nghỉ đủ 12 ngày phép'], ['part', 'Nghỉ phép một phần'], ['skip', 'Không nghỉ phép năm nay']].map(function (x) {
      return { k: 'lv:' + x[0], l: (w.leave === x[0] ? '✓ ' : '') + x[1], h: x[0] === 'skip' ? 'Không có tiền phép trừ khi thôi việc; căng thẳng tăng' : x[0] === 'full' ? 'Giảm căng thẳng' : '', why: w.leave === x[0] ? 'Đang dùng' : true, run: function (l, r, log) { var q = st(l); q.work = q.work || {}; q.work.leave = x[0]; log(x[1] + '.', 'neutral'); } };
    }));
  }, 18, 'Học tập');
  X.menu('intern918', 'Thực tập trong thời gian học', function (l) { var r = X.reason(l, 18); return r !== true ? r : student(l) ? true : 'Cần đang học đại học, cao đẳng hoặc nghề'; }, function (l) {
    var i = st(l).intern; return 'Thực tập theo chương trình học khác hợp đồng lao động: có thể có hoặc không có phụ cấp, nhưng nơi nhận phải bảo đảm an toàn và không giao việc thay người lao động chính thức. Kỳ thực tập tốt giúp có thêm lựa chọn việc làm khi tốt nghiệp, không bảo đảm có việc.' + (i ? '\nĐã thực tập năm ' + i.at + ' tuổi' + (i.done ? (i.ok ? ', được ghi nhận tốt.' : ', chưa có lời mời.') : ', đang diễn ra.') : '');
  }, function (l) {
    var i = st(l).intern, busy = i && !i.done ? 'Đang thực tập' : i && l.age - i.at < 1 ? 'Đã thực tập năm nay' : true;
    return [{ k: 'paid', l: 'Thực tập có phụ cấp', h: 'Phụ cấp ~' + mo(l, l.base * 0.03) + '; cạnh tranh hơn', why: busy, run: function (l, r, log) { var q = st(l); q.intern = { at: l.age, major: l.major, paid: true, done: false }; H.cash(l, l.base * 0.03, 'Phụ cấp thực tập'); if (l.mind) l.mind.stress = U.clamp(l.mind.stress + 3, 0, 100); log('Bạn bắt đầu kỳ thực tập có phụ cấp.', 'neutral'); } },
      { k: 'unpaid', l: 'Thực tập theo chương trình của trường (không phụ cấp)', why: busy, run: function (l, r, log) { var q = st(l); q.intern = { at: l.age, major: l.major, paid: false, done: false }; if (l.mind) l.mind.stress = U.clamp(l.mind.stress + 2, 0, 100); log('Bạn bắt đầu kỳ thực tập theo chương trình học.', 'neutral'); } }];
  }, 18, 'Học tập');
  X.menu('disability918', 'Hỗ trợ người khuyết tật', function (l) { var r = X.reason(l, 16); return r !== true ? r : disPeople(l).length ? true : 'Chưa có người trong gia đình được xác định cần hỗ trợ'; }, function (l) {
    var d = st(l).dis || {};
    return 'Người khuyết tật có quyền học tập, làm việc bình đẳng và được điều chỉnh hợp lý; khuyết tật không làm giảm năng lực toàn diện. Người khuyết tật nặng hoặc đặc biệt nặng được hưởng trợ cấp xã hội hằng tháng sau khi hội đồng xã xác định mức độ.\n' + disPeople(l).map(function (p) { var e = d[p.key]; return '• ' + p.name + ': ' + (e ? (e.status === 'pending' ? 'đang chờ xác định mức độ' : 'khuyết tật ' + (e.level === 'extreme' ? 'đặc biệt nặng' : 'nặng') + ', hưởng ' + mo(l, ledger(l, BAL.disAllow[e.level])) + '/tháng') : 'chưa làm hồ sơ'); }).join('\n');
  }, function (l) {
    var d = st(l).dis || {}, out = [];
    disPeople(l).forEach(function (p) { if (!d[p.key] && vn(l)) out.push({ k: 'reg:' + p.key, l: 'Làm hồ sơ xác định mức độ khuyết tật cho ' + p.name, h: 'Không mất phí; có kết quả năm sau', run: function (l, r, log) { var q = st(l); q.dis = q.dis || {}; if (q.dis[p.key]) return; q.dis[p.key] = { status: 'pending', at: l.age, name: p.name }; log('Nộp hồ sơ xác định mức độ khuyết tật cho ' + p.name + '.', 'neutral'); } }); });
    if (disOf(l, l) && l.job) out.push({ k: 'adjust', l: 'Đề nghị điều chỉnh hợp lý nơi làm việc', h: 'Thiết bị hỗ trợ ' + mo(l, l.base * 0.03) + '; giảm căng thẳng', why: st(l).adjAt === l.age ? 'Đã đề nghị năm nay' : l.money >= l.base * 0.03 ? true : 'Chưa đủ tiền', run: function (l, r, log) { var q = st(l); if (q.adjAt === l.age) return; q.adjAt = l.age; H.cash(l, -l.base * 0.03, 'Thiết bị hỗ trợ tiếp cận'); if (l.mind) l.mind.stress = U.clamp(l.mind.stress - 6, 0, 100); log('Nơi làm việc điều chỉnh giờ giấc và trang bị hỗ trợ; công việc thuận lợi hơn.', 'good'); } });
    return out;
  }, 16, 'Sức khỏe');
  X.menu('studentLoan918', 'Vay vốn sinh viên (NHCSXH)', function (l) { var r = X.reason(l, 18); if (r !== true) return r; if (!student(l) || !vn(l)) return 'Cần đang học đại học, cao đẳng hoặc nghề tại Việt Nam'; return l.fam && l.fam.q <= 2 || (l.money < l.base * 0.5) ? true : 'Dành cho sinh viên hộ nghèo, cận nghèo hoặc hoàn cảnh khó khăn'; }, function (l) {
    var q = st(l).loan; return 'Vay tối đa 4 triệu/tháng (khoảng ' + mo(l, ledger(l, BAL.studentMonth * 10)) + '/năm học), lãi 0,55%/tháng tính trong lúc học; ra trường mới bắt đầu trả góp. ' + (q && q.bal > 0 ? 'Dư nợ hiện tại: ' + mo(l, q.bal) + '.' : 'Chưa vay.');
  }, function (l) {
    var q = st(l).loan; return [{ k: 'borrow', l: 'Vay cho năm học này (' + mo(l, ledger(l, BAL.studentMonth * 10)) + ')', why: q && q.at === l.age ? 'Đã vay năm nay' : true, run: function (l, r, log) { var s = st(l); s.loan = s.loan || { bal: 0 }; if (s.loan.at === l.age) return; var v = ledger(l, BAL.studentMonth * 10); s.loan.at = l.age; s.loan.bal += v; s.loan.converted = null; H.cash(l, v, 'Vay vốn sinh viên'); log('Nhận khoản vay sinh viên ' + mo(l, v) + ' cho năm học.', 'neutral'); } }];
  }, 18, 'Học tập');
  X.menu('policy918', 'Đề xuất và thí điểm chính sách', function (l) { var r = X.reason(l, 25); if (r !== true) return r; if (!polScope(l)) return 'Cần giữ chức vụ cấp tỉnh hoặc cấp bộ trở lên'; return true; }, function (l) {
    var q = st(l).prop || {}, sc = polScope(l), e = R.state(l);
    return (sc === 'national' ? 'Bạn có thể trình đề xuất chính sách toàn quốc; hội đồng thẩm định xét dựa trên uy tín, khả năng phối hợp và sự ủng hộ, không phải tự bạn quyết định. Được thông qua thì có hiệu lực sau 2 năm.' : 'Bạn có thể đề xuất thí điểm trong địa bàn tỉnh mình; chính sách chỉ áp dụng cho người sống tại tỉnh.') +
      ' Mỗi đề xuất tốn ngân sách đơn vị và chỉ một đề xuất mỗi 3 năm. Kết quả chỉ thay đổi thế giới mô phỏng của đời này.' + (q.pending ? '\nĐang thẩm định: ' + q.pending.id + '.' : '') + (q.hist && q.hist.length ? '\nĐã đề xuất: ' + q.hist.map(function (h) { return h.id + ' (' + (h.ok ? 'thông qua' : 'chưa thông qua') + ')'; }).join(', ') + '.' : '') +
      (e.pilot ? Object.keys(e.pilot).map(function (k) { return '\nThí điểm ' + k + ' tại ' + e.pilot[k].prov + ' từ ' + e.pilot[k].from; }).join('') : '');
  }, function (l) {
    var q = st(l).prop || {}, sc = polScope(l), S = S174(), budget = S && E.STATE917 ? E.STATE917.projState(l) : null, cost = l.base * (sc === 'national' ? 1.5 : 0.8);
    var block = q.pending ? 'Đang có đề xuất chờ thẩm định' : q.last != null && l.age - q.last < 3 ? 'Chờ ' + (3 - (l.age - q.last)) + ' năm nữa' : budget && budget.budget < cost ? 'Ngân sách đơn vị không đủ' : true;
    return candidatePolicies(l).map(function (p) {
      return { k: p.id, l: (sc === 'national' ? 'Trình đề xuất toàn quốc: ' : 'Thí điểm tại tỉnh: ') + p.dom + ' — ' + p.note.slice(0, 70) + '…', h: 'Ngân sách đơn vị ' + mo(l, cost) + ' · thẩm định năm sau', why: block,
        run: function (l, r, log) { var s = st(l); s.prop = s.prop || {}; if (s.prop.pending) return; var b = E.STATE917 ? E.STATE917.projState(l) : null; if (b) { if (b.budget < cost) return; b.budget -= cost; } var pv = l.prov && (l.prov.neu || l.prov.old); s.prop.pending = { id: p.id, scope: sc, at: l.age, prov: (l.job.post917 && l.job.post917.territory) || pv }; s.prop.last = l.age; log('Bạn trình ' + (sc === 'national' ? 'đề xuất chính sách toàn quốc' : 'đề án thí điểm') + ': ' + p.dom.toLowerCase() + '. Hội đồng sẽ thẩm định trong năm tới.', 'neutral'); } };
    });
  }, 25, 'Công vụ & quản lý');

  // ================= hook năm, bản lưu =================
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !l.flags || !['vn', 'world'].includes(l.mode)) return;
    pensionYear(l, log); bhytYear(l, log); volYear(l, log); workYear(l, log); internYear(l, log); disYear(l, log); studentLoanYear(l, log); basicYear(l, log); housingLock(l, log); abroadPassport(l, log); propYear(l, log);
  });
  var mig = E.migrateExt; E.migrateExt = function (l) { if (mig) mig(l); if (l && l.flags && l.flags.welfare918 != null && typeof l.flags.welfare918 !== 'object') delete l.flags.welfare918; };
  E.WELFARE918 = { BAL: BAL, state: st, sectors: sectors, sectorYear: sectorYear, pubIndex: pubIndex, bizTax: bizTax, owner: owner, bhytPremium: bhytPremium, bhytFree: bhytFree, regFee: regFee, evModel: evModel, volState: volState, volAge: volAge, disPeople: disPeople, candidatePolicies: candidatePolicies, polScope: polScope };
})(globalThis.G);
