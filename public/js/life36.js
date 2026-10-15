/* Một Đời — v3.6 (góp ý của người chơi):
   · "Chi tiêu": gom các việc tiêu tiền về một chỗ, có chi tiêu định kỳ tự động mỗi năm (du lịch 1 lần/năm, du lịch nước ngoài 1 lần/2 năm,
     khám sức khỏe định kỳ, tập gym, biếu bố mẹ, từ thiện, học thêm, đầu tư đều đặn…) — đỡ phải chọn lại mỗi năm
   · chế độ nghỉ hưu: tự chọn nghỉ hưu; đã nghỉ hưu hẳn thì không còn bị hỏi nhận việc này việc kia (muốn đi làm lại thì tự bấm)
   · chuyển chỗ ở sang thành phố khác (trong nước hoặc nơi đang định cư) */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function A(id, g, label, o) { var x = { id: id, g: g, l: label }; for (var k in o) x[k] = o[k]; E.ACT.push(x); }
  function fx(l, o) { H.fx(l, o); }
  function mo(l, v) { return H.money(l, v); }
  function pick(r, a) { return U.pick(r, a); }
  function ch(r, p) { return r() < p; }
  function vnd(l) { return isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  function V(l, tr) { return vnd(l) ? tr : tr / 90 * l.base; }
  function busy(l) { return (l.jailUntil != null && l.age < l.jailUntil) || (l.abroad && l.abroad.trapped) || (l.flags.military && l.age < l.flags.military); }
  function parentsAlive(l) { return l.fam.mAlive || l.fam.fAlive; }
  function resName(l) { return l.abroad && l.abroad.perm ? l.abroad.name : l.countryName || 'trong nước'; }

  // ===================================================================
  // 1. CHI TIÊU ĐỊNH KỲ
  // ===================================================================
  var DOM_VN = ['Đà Lạt', 'Nha Trang', 'Phú Quốc', 'Sa Pa', 'Hội An', 'Hạ Long', 'Quy Nhơn', 'Đà Nẵng', 'Huế', 'Côn Đảo', 'Ninh Bình', 'Mộc Châu', 'Phan Thiết', 'Hà Giang'];
  var INTL = ['Thái Lan', 'Hàn Quốc', 'Nhật Bản', 'Singapore', 'Trung Quốc', 'Đài Loan', 'Malaysia', 'Pháp', 'Úc', 'Mỹ', 'Ý', 'Thụy Sĩ', 'Indonesia (Bali)', 'Dubai'];
  function domPlace(l, r) {
    if (vnd(l)) return pick(r, DOM_VN.filter(function (p) { return p !== l.place && p !== l.city; }));
    var W = G.W, c = W && W.BY[l.abroad && l.abroad.perm ? l.abroad.code : l.country], cs = (c && c.cities) || [];
    var o = cs.filter(function (x) { return x !== l.place && x !== l.city; });
    return o.length ? pick(r, o) : 'một thị trấn ven biển';
  }
  // c: chi phí mỗi lần (triệu đồng ở VN; nước khác quy theo mức thu nhập)
  var RECUR = [
    { id: 'dl_trong', l: 'Du lịch trong nước', every: 1, c: function (l) { return V(l, 7); },
      ok: function (l) { return true; },
      run: function (l, r) { var p = domPlace(l, r); fx(l, { hap: 4, soc: 1 }); if (l.mind) l.mind.stress = Math.max(0, l.mind.stress - 6); return 'du lịch ' + p; } },
    { id: 'dl_ngoai', l: 'Du lịch nước ngoài', every: 2, c: function (l) { return V(l, 35); },
      ok: function (l) { return l.age >= 16 ? true : 'Từ 16 tuổi'; },
      run: function (l, r) { var home = l.abroad && l.abroad.perm ? l.abroad.name : 'Việt Nam'; var p = pick(r, INTL.filter(function (x) { return x !== home && x !== l.countryName; })); H.visit(l, p.replace(/ \(.*\)$/, '')); fx(l, { hap: 7, soc: 2, kno: 1 }); if (l.mind) l.mind.stress = Math.max(0, l.mind.stress - 8); return 'du lịch ' + p; } },
    { id: 'kham_dk', l: 'Khám sức khỏe định kỳ', every: 1, c: function (l) { return V(l, l.money > l.base * 8 ? 6 : 2.5); },
      ok: function (l) { return true; },
      run: function (l, r) { l.flags.checkupUntil = l.age + 2; fx(l, { hea: 2 }); if (l.ill && !l.ill.treated && !l.ill.early) { l.ill.early = true; l.ill.mult = 1 + (l.ill.m - 1) * 0.3; l.ill.cure = Math.min(0.95, (l.ill.base || l.ill.cure || 0.3) * 2); return 'khám sức khỏe định kỳ (phát hiện sớm ' + l.ill.n + ', điều trị kịp thời)'; } return 'khám sức khỏe định kỳ'; } },
    { id: 'gym', l: 'Tập gym / thể thao đều đặn', every: 1, per: 'cả năm', c: function (l) { return V(l, 6); },
      ok: function (l) { return true; },
      run: function (l) { l.flags.exercise = true; fx(l, { hea: 2, hap: 1 }); if (l.mind) l.mind.stress = Math.max(0, l.mind.stress - 4); return 'tập gym đều đặn'; } },
    { id: 'bieu', l: 'Biếu bố mẹ hằng tháng', every: 1, per: 'cả năm', c: function (l) { return V(l, 24); },
      ok: function (l) { return parentsAlive(l) ? true : 'Bố mẹ đã khuất'; },
      run: function (l) { fx(l, { karma: 2, hap: 1 }); l.flags.caredParents = true; return 'biếu ' + (l.fam.mAlive && l.fam.fAlive ? 'bố mẹ' : l.fam.mAlive ? 'mẹ' : 'bố') + ' mỗi tháng'; } },
    { id: 'tu_thien', l: 'Làm từ thiện', every: 1, c: function (l) { return V(l, 4); },
      ok: function (l) { return true; },
      run: function (l) { fx(l, { karma: 3, hap: 1 }); return 'làm từ thiện'; } },
    { id: 'hoc', l: 'Học một khóa kỹ năng / ngoại ngữ', every: 1, c: function (l) { return V(l, 8); },
      ok: function (l) { return true; },
      run: function (l) { fx(l, { kno: 2 }); return 'học thêm một khóa kỹ năng'; } },
    { id: 'dau_tu', l: 'Đầu tư đều đặn vào quỹ chỉ số (10% thu nhập)', every: 1, c: function (l) { return Math.max(V(l, 5), (l.income || 0) * 0.1); },
      ok: function (l) { return (l.income || 0) > 0 ? true : 'Cần có thu nhập'; },
      run: function (l, r, cost) { var s = vnd(l) ? 'E1VFVN30' : 'SPY'; l.port = l.port || {}; var h = l.port[s] || (l.port[s] = { v: 0, basis: 0 }); h.v += cost; h.basis += cost; return 'mua thêm chứng chỉ quỹ ' + (s === 'SPY' ? 'S&P 500' : 'VN30'); }, invest: true }
  ];
  E.RECUR = RECUR;
  function recurOf(id) { return RECUR.filter(function (x) { return x.id === id; })[0]; }
  function canRecur(l) { return l.alive && l.age >= 16 && (l.indep || l.age >= 18) ? true : 'Từ khi tự lập (16–18 tuổi)'; }
  // danh sách cho giao diện
  E.recurList = function (l) {
    var R = l.recur || {}, base = canRecur(l);
    return RECUR.map(function (x) { var ok = base === true ? x.ok(l) : base; return { id: x.id, l: x.l, every: x.every, per: x.per || (x.every === 1 ? 'mỗi năm' : x.every + ' năm/lần'), cost: mo(l, x.c(l)), on: !!R[x.id], ok: ok }; });
  };
  E.recurToggle = function (l, id) {
    var x = recurOf(id); if (!x) return false;
    l.recur = l.recur || {};
    if (l.recur[id]) { delete l.recur[id]; return false; }
    if (canRecur(l) !== true || x.ok(l) !== true) return false;
    l.recur[id] = true; return true;
  };
  // mỗi năm: tự chi các khoản định kỳ đã bật; không đủ tiền thì tạm bỏ qua năm đó
  E.HOOKS.year.push(function (l, r, log, a) {
    var R = l.recur; if (!R || !l.alive) return;
    if (busy(l)) return;
    var done = [], skip = [], tot = 0, at = l.recurAt || (l.recurAt = {});
    RECUR.forEach(function (x) {
      if (!R[x.id]) return;
      if (x.ok(l) !== true) { delete R[x.id]; return; }
      if (at[x.id] != null && a - at[x.id] < x.every) return;
      var cost = x.c(l);
      if (l.money - cost < (x.invest ? l.base * 0.5 : 0)) { skip.push(x.l.toLowerCase()); return; }
      H.cash(l, -cost, U.cap(x.l));
      tot += cost; at[x.id] = a;
      done.push(x.run(l, r, cost));
    });
    if (done.length) log('Chi tiêu định kỳ: ' + done.join(', ') + ' (chi ' + mo(l, tot) + ').', 'money');
    if (skip.length) log('Năm nay không đủ tiền nên tạm bỏ: ' + skip.join(', ') + '.', 'neutral');
  });

  // ===================================================================
  // 2. NGHỈ HƯU
  // ===================================================================
  function canRetire(l) { return !!l.job && l.age >= (l.sex === 'F' ? 50 : 55) && !E.isCrime(l); }
  function pensionHint(l) {
    if (!vnd(l)) return 'Hưởng lương hưu theo chế độ của ' + resName(l);
    var y = l.si ? Math.round(l.si.yrs) : 0;
    return y >= 15 ? 'Đã đóng BHXH ' + y + ' năm — đủ điều kiện nhận lương hưu hằng tháng' : 'Mới đóng BHXH ' + y + ' năm — chưa đủ 15 năm nên chưa có lương hưu, sống bằng tiền tích lũy';
  }
  function retireNow(l, log) { l.job.retireNow = true; l.flags.retChosen = true; l.flags.fullRetire = true; log('Làm đơn xin nghỉ hưu, chuẩn bị bàn giao công việc.', 'neutral'); }
  if (E.DEC.nghi_viec) E.DEC.nghi_viec.def.opts.splice(1, 0, { k: 'huu', l: 'Nghỉ hưu luôn, không đi làm nữa', h: pensionHint, req: canRetire, ai: { w: 0.3 }, run: function (l, r, log) { retireNow(l, log); } });
  SC('nghi_huu_chon', {
    title: 'Nghỉ hưu?', valid: canRetire,
    text: function (l) { return 'Bạn ' + l.age + ' tuổi, đang làm ' + E.jobTitle(l) + '. ' + pensionHint(l) + '. Nghỉ hưu rồi sẽ không còn bị hỏi nhận việc này việc kia; muốn đi làm lại thì tự vào "Tìm việc".'; },
    opts: [
      { k: 'huu', l: 'Nghỉ hưu, an hưởng tuổi già', ai: { w: 1 }, run: function (l, r, log) { retireNow(l, log); } },
      { k: 'no', l: 'Làm thêm vài năm nữa', ai: { w: 1 }, run: function (l, r, log) { log('Còn khỏe thì còn làm.', 'neutral'); } }
    ]
  });
  A('nghi_huu', 'Công việc', 'Nghỉ hưu', { min: 50, sc: 'nghi_huu_chon', avail: function (l) { return canRetire(l) ? true : !l.job ? 'Chưa có việc' : 'Từ ' + (l.sex === 'F' ? 50 : 55) + ' tuổi'; } });
  // nghỉ hưu (tự chọn hay đến tuổi) thì mặc định nghỉ hẳn; đi làm lại thì thôi
  E.HOOKS.year.push(function (l) { if (l.retired) { if (l.flags.fullRetire == null) l.flags.fullRetire = true; } else if (l.flags.fullRetire) l.flags.fullRetire = null; });
  if (E.DEC.sau_huu) { var sv = E.DEC.sau_huu.def.valid; E.DEC.sau_huu.def.valid = function (l, d) { return !l.flags.retChosen && (!sv || sv(l, d)); }; }
  // tự đi tìm việc sau khi nghỉ hưu = đi làm lại
  var ja0 = E.DEC.job.apply;
  E.DEC.job.apply = function (l, d, k, r, log) {
    var was = l.retired;
    var x = ja0.apply(this, arguments);
    if (was && k !== 'none' && l.job) { l.retired = false; l.flags.fullRetire = null; l.flags.afterRet = Math.max(l.flags.afterRet || 0, l.age + 5); log('Thôi nghỉ hưu, đi làm lại cho vui, cho khỏe.', 'neutral'); }
    return x;
  };
  E.ACT.forEach(function (a) {
    if (a.id === 'tim_viec') { var l0 = a.l; a.l = function (l) { return l.retired ? 'Đi làm lại (đang nghỉ hưu)' : typeof l0 === 'function' ? l0(l) : l0; }; }
  });

  // ===================================================================
  // 3. CHUYỂN CHỖ Ở
  // ===================================================================
  function cities(l) {
    if (vnd(l)) return ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Nha Trang', 'Đà Lạt'].filter(function (c) { return c !== l.movedTo && c !== l.city && c !== (l.prov && l.prov.n); });
    var W = G.W, c = W && W.BY[l.abroad && l.abroad.perm ? l.abroad.code : l.country];
    return ((c && c.cities) || []).filter(function (x) { return x !== l.place && x !== l.city; }).slice(0, 5);
  }
  SC('chuyen_noi_o', {
    title: 'Chuyển chỗ ở',
    valid: function (l) { return l.indep && !l.ownHouse; },
    prep: function (l) { return { cs: cities(l).slice(0, 4) }; },
    text: function (l) { return 'Bạn đang thuê nhà ở ' + (l.place || l.city || 'nơi ở hiện tại') + '. Chuyển đến thành phố khác thì phải thu xếp đồ đạc, đặt cọc nhà mới (khoảng ' + mo(l, V(l, 15)) + '); công việc' + (l.job && H.isEmployee(l) ? ' hiện tại có thể phải xin chuyển hoặc tìm việc mới' : ' và các mối quan hệ cũng phải làm lại từ đầu') + '.'; },
    opts: [0, 1, 2, 3].map(function (i) {
      return { k: 'c' + i, l: function (l, d) { return d.cs[i] ? 'Chuyển đến ' + d.cs[i] : ''; }, req: function (l, d) { return !!d.cs[i]; }, ai: { w: 0.5 },
        run: function (l, r, log, d) {
          var to = d.cs[i]; H.cash(l, -V(l, 15), 'Chuyển nhà, đặt cọc nhà mới');
          if (vnd(l)) H.moveToCity(l, to); else { l.place = to; l.city = to; l.urban = true; }
          l.cityStudent = null;
          if (l.job && H.isEmployee(l) && ch(r, 0.5)) { log('Chuyển đến ' + to + '. Công ty không có chi nhánh ở đó, bạn phải nghỉ việc để tìm việc mới.', 'neutral'); l.job = null; l.flags.needJob = true; }
          else log('Chuyển đến sống ở ' + to + ' — một khởi đầu mới.', 'good');
          fx(l, { hap: 2, soc: -4 }); H.mem(l, 'Ngày kéo vali đến ' + to + ', thuê căn phòng đầu tiên.', 2);
        } };
    }).concat([{ k: 'no', l: 'Thôi, ở lại chỗ cũ', ai: { w: 1 }, run: function (l, r, log) { log('Ở lại chỗ cũ, quen nơi quen chốn.', 'neutral'); } }])
  });
  A('chuyen_noi_o', 'Tiền bạc', 'Chuyển chỗ ở sang thành phố khác', { min: 18, sc: 'chuyen_noi_o', avail: function (l) { return !l.indep ? 'Khi đã tự lập' : l.ownHouse ? 'Đang có nhà riêng — bán / đổi nhà trước' : l.abroad && !l.abroad.perm ? 'Đang ở nước ngoài theo hợp đồng' : cities(l).length ? true : 'Không có nơi nào khác'; } });

  // các việc tiêu tiền gom vào mục "Chi tiêu" (giao diện)
  E.SPEND_ACTS = ['dau_tu', 'ban_dau_tu_moi', 'tim_viec', 'mua_nha', 'doi_nha', 'chuyen_noi_o', 'mua_xe', 'du_lich', 'dau_tu_lon', 'quan_ly_dau_tu', 'khoi_nghiep', 'mua_bao_hiem', 'gui_bo_me', 'tu_thien', 'kham', 'chi_tieu', 'vay_tien', 'tra_no', 'ban_tai_san', 've_so'];
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
