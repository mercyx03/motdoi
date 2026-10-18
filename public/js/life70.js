/* Một Đời — v5.6.3:
   · định cư nước ngoài đủ số năm theo luật từng nước thì được xét nhập quốc tịch
   · esports: đi giải quốc tế phải xin visa; hiếm khi bị từ chối, khi đó tuyển thủ dự bị đánh thay
   · cắt giảm nhân sự chỉ xảy ra với người thật sự làm thuê, không rơi vào người đứng đầu, người làm tự do */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, W = G.W;
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.flags.military && l.age < l.flags.military) && !(l.abroad && l.abroad.trapped); }

  // ===================================================================
  // 1. NHẬP QUỐC TỊCH
  // ===================================================================
  // số năm sống ở nước đó (tính cả thời gian chờ thẻ thường trú) để đủ điều kiện xin nhập quốc tịch; r: phải từ bỏ quốc tịch cũ
  // Nguồn tham khảo: luật quốc tịch các nước (Bồ Đào Nha 10 năm từ 5/2026, Thụy Điển 8 năm từ 6/6/2026, Tây Ban Nha 10 năm,
  // Canada 3/5 năm cư trú sau khi có thường trú, Mỹ 5 năm sau thẻ xanh…). Đây là mức đơn giản hóa cho trò chơi.
  var NAT = {
    US: [6, 0], CA: [4, 0], AU: [4, 0], NZ: [5, 0], GB: [6, 0], IE: [5, 0], DE: [5, 0], FR: [5, 0], NL: [5, 1], BE: [5, 0], LU: [5, 0],
    SE: [8, 0], NO: [8, 0], DK: [9, 0], FI: [8, 0], IS: [7, 0], CH: [10, 0], AT: [10, 1], IT: [10, 0], ES: [10, 1], PT: [10, 0],
    PL: [8, 0], CZ: [5, 0], HU: [8, 0], GR: [7, 0], RU: [5, 0], JP: [5, 1], KR: [5, 1], TW: [5, 1], SG: [5, 1], TH: [10, 1],
    MY: [12, 1], ID: [5, 1], PH: [10, 0], IN: [12, 1], CN: [0, 1], AE: [0, 1], SA: [0, 1], QA: [0, 1], KW: [0, 1],
    BR: [4, 0], AR: [2, 0], MX: [5, 0], CL: [5, 0], CO: [5, 0], ZA: [10, 0], IL: [5, 0], TR: [5, 0], KH: [7, 1], LA: [10, 1]
  };
  function rule(code) { return NAT[code] || [10, 0]; }
  E.NATURALIZE = NAT;
  function resid(l) { return (l.flags.residYrs = l.flags.residYrs || {}); }
  function citizen(l, code) { return (l.flags.citizen || []).indexOf(code) >= 0; }
  E.isCitizenOf = function (l, code) { return code === l.country || citizen(l, code); };
  function where(l) { return l.abroad && l.abroad.perm ? l.abroad.code : null; }
  E.HOOKS.year.unshift(function (l, r, log, a) { // đặt đầu danh sách: độc lập với các hook khác
    var c = where(l); if (!c || !l.alive) return;
    var y = resid(l); y[c] = (y[c] || 0) + 1;
    var R0 = rule(c), need = R0[0];
    if (!need || E.isCitizenOf(l, c) || a < 18 || y[c] < need || !free(l)) return;
    var F = l.flags; if (F.natAsk && F.natAsk[c] != null && a - F.natAsk[c] < 3) return;
    if (l.record && l.flags.releasedAt != null && a - l.flags.releasedAt < 10) return; // có tiền án gần đây thì chưa đủ điều kiện
    (F.natAsk = F.natAsk || {})[c] = a;
    if (F.natNever && F.natNever[c]) return;
    l.pending.push(E.DEC.nhap_quoc_tich.make(l, r, { code: c }));
  });
  SC('nhap_quoc_tich', {
    title: function (l, d) { return 'Nhập quốc tịch ' + d.name; },
    prep: function (l, r, a) { var c = (a && a.code) || where(l), B = W.BY[c] || {}, R0 = rule(c); return { code: c, name: B.name || c, need: R0[0], renounce: !!R0[1], yrs: resid(l)[c] || 0 }; },
    valid: function (l, d) { return !!d && !!d.code && where(l) === d.code && !E.isCitizenOf(l, d.code); },
    text: function (l, d) { return 'Bạn đã sống ở ' + d.name + ' ' + d.yrs + ' năm — đủ điều kiện cư trú ' + d.need + ' năm để xin nhập quốc tịch. Hồ sơ gồm thi ngôn ngữ, hiểu biết xã hội, chứng minh thu nhập và lý lịch.' + (d.renounce ? ' ' + d.name + ' không chấp nhận hai quốc tịch: muốn nhập quốc tịch thì phải thôi quốc tịch ' + (W.BY[l.country] ? W.BY[l.country].name : 'gốc') + '.' : ' ' + d.name + ' cho phép giữ quốc tịch gốc.'); },
    opts: [
      { k: 'nop', l: function (l, d) { return 'Nộp hồ sơ nhập quốc tịch ' + d.name; }, h: function (l) { return 'Lệ phí, thi cử khoảng ' + H.money(l, l.base * 0.06); }, ai: { w: 1.1, smart: 0.6 }, run: function (l, r, log, d) {
        H.cash(l, -l.base * 0.06, 'Hồ sơ nhập quốc tịch');
        var p = 0.7 + (l.st.kno - 50) / 250 + (l.job ? 0.08 : -0.1) + (l.lang && l.lang[d.code] ? 0.1 : 0); if (U.clamp(p, 0.3, 0.97) > r()) {
          (l.flags.citizen = l.flags.citizen || []).push(d.code); if (d.renounce) l.flags.renounced = l.country;
          log('Tuyên thệ nhập quốc tịch ' + d.name + ' sau ' + d.yrs + ' năm sinh sống' + (d.renounce ? ', thôi quốc tịch gốc.' : ', vẫn giữ quốc tịch gốc.') + ' Cầm cuốn hộ chiếu mới, bạn chợt nhớ những ngày đầu đặt chân đến đây.', 'big');
          H.fx(l, { hap: 6 }); H.mem(l, 'Ngày tuyên thệ nhập quốc tịch ' + d.name + '.', 5);
        } else { log('Hồ sơ nhập quốc tịch ' + d.name + ' chưa đạt (bài thi ngôn ngữ, hiểu biết xã hội). Vài năm nữa có thể nộp lại.', 'neutral'); H.fx(l, { hap: -3 }); }
      } },
      { k: 'chua', l: 'Chưa vội, giữ thẻ cư trú như hiện tại', ai: { w: 0.5 }, run: function (l, r, log, d) { log('Chưa nộp hồ sơ nhập quốc tịch ' + d.name + ', vẫn sống bằng thẻ cư trú.', 'neutral'); } },
      { k: 'khong', l: function (l, d) { return d.renounce ? 'Không, giữ quốc tịch gốc' : 'Không có ý định nhập quốc tịch'; }, ai: { w: 0.4 }, run: function (l, r, log, d) { (l.flags.natNever = l.flags.natNever || {})[d.code] = true; log('Quyết định không nhập quốc tịch ' + d.name + (d.renounce ? ', giữ quốc tịch gốc.' : '.'), 'neutral'); } }
    ]
  });
  if (E.MAJOR) E.MAJOR.nhap_quoc_tich = 1;

  // ===================================================================
  // 2. ESPORTS: XIN VISA ĐI GIẢI QUỐC TẾ
  // ===================================================================
  E.esVisa = function (l, r, log, s, ev) {
    s.visa = s.visa || {}; var key = (s.season && s.season.token) + ':' + ev.id;
    if (s.visa[key] != null) return s.visa[key];
    var p = s.visaOk ? 0.02 : 0.04; // bị từ chối visa rất hiếm
    var ok = r() >= p; s.visa[key] = ok;
    if (ok && !s.visaOk) { s.visaOk = true; log('Lần đầu đi giải quốc tế: đội lo hồ sơ, bạn đi phỏng vấn và được cấp visa dự ' + ev.name + ' đúng hạn.', 'good'); }
    else if (!ok) { log('Bị từ chối visa dự ' + ev.name + ' vì hồ sơ chưa kịp xét duyệt. Tuyển thủ dự bị của đội lên đánh thay bạn ở giải này.', 'bad'); H.fx(l, { hap: -8 }); H.mem(l, 'Mùa giải lỡ ' + ev.name + ' vì trượt visa, ngồi nhà xem đồng đội thi đấu.', 4); }
    return ok;
  };

  // ===================================================================
  // 3. CẮT GIẢM NHÂN SỰ ĐÚNG ĐỐI TƯỢNG
  // ===================================================================
  ['cn_cat_giam', 'vp_sa_thai_ai'].forEach(function (id) { var D = E.DEC[id]; if (!D) return; var v0 = D.valid; D.valid = function (l) { return !!E.layoffRisk && E.layoffRisk(l) > 0 && (v0 ? v0.apply(this, arguments) : true); }; });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
