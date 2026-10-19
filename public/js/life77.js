/* Một Đời — v6.1.0: viện phí & bảo hiểm y tế thống nhất
   · BHYT (Việt Nam): khám chữa bệnh đúng tuyến được chi trả 80%, bạn trả 20%; trẻ dưới 6 tuổi và hộ nghèo 100%; người hưởng lương hưu 95%
   · bệnh viện tư / dịch vụ theo yêu cầu: BHYT không trả phần chênh
   · trẻ chưa tự lập thì bố mẹ trả viện phí, không trừ tiền riêng của con
   · nha khoa: trám răng sâu, lấy cao răng (BHYT trả), niềng răng, bọc răng sứ (tự trả) */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, SC = E.SC, isVN = H.isVN;
  function vnd(l) { return isVN(l) && l.cur === 'vnd' && !(l.abroad && l.abroad.perm); }
  function V(l, tr) { return vnd(l) ? tr : tr / 90 * l.base; }
  function mo(l, v) { return H.money(l, v); }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function parent(l) { var f = l.fam || {}, m = !f.noMom && f.mAlive, b = !f.noDad && f.fAlive; return m && b ? 'bố mẹ' : m ? 'mẹ' : b ? 'bố' : ''; }
  // tỉ lệ bảo hiểm chi trả
  // v7.0: đã định cư hẳn ở nước ngoài thì là bảo hiểm y tế nước sở tại, không phải BHYT Việt Nam
  function vnHome(l) { return isVN(l) && !(l.abroad && l.abroad.perm); }
  function insName(l) { return vnHome(l) ? 'BHYT' : 'bảo hiểm y tế'; }
  E.bhytShare = function (l) {
    if (!E.hasBHYT || !E.hasBHYT(l)) return 0;
    if (!vnHome(l)) return 0.8;
    if (l.age < 6 || (l.fam && l.fam.q <= 1 && !l.indep)) return 1;
    if (l.pensioned || l.age >= 80) return 0.95;
    return 0.8;
  };
  // trả viện phí: cover = 1 (đúng tuyến), 0.5 (dịch vụ: BHYT trả phần chuẩn), 0 (tư nhân / thẩm mỹ)
  E.medBill = function (l, total, why, log, cover) {
    if (!(total > 0)) return 0;
    var share = (cover == null ? 1 : cover) * E.bhytShare(l), ins = total * share, own = total - ins;
    if (!l.indep && l.age < 18) { if (log) log(U.cap(parent(l) || 'gia đình') + ' lo viện phí ' + mo(l, total) + (ins > 0 ? ' (' + insName(l) + ' chi trả ' + Math.round(share * 100) + '%, nhà trả ' + mo(l, own) + ')' : '') + '.', 'neutral'); return 0; }
    H.cash(l, -own, why);
    if (log && ins > 0) log('Viện phí ' + mo(l, total) + ': ' + insName(l) + ' chi trả ' + Math.round(share * 100) + '% (' + mo(l, ins) + '), bạn trả ' + mo(l, own) + '.', 'neutral');
    return own;
  };
  E.medNote = function (l, total, cover) { var s = (cover == null ? 1 : cover) * E.bhytShare(l); return s > 0 ? ' · ' + insName(l) + ' trả ' + Math.round(s * 100) + '%, bạn trả ~' + mo(l, total * (1 - s)) : ''; };

  // nha khoa
  var DENTAL = [
    { k: 'tram', when: function (l) { return l.age >= 6 && l.age <= 75; }, title: 'Răng sâu', text: 'Chiếc răng hàm ê buốt mỗi lần ăn đồ ngọt, soi gương thấy một lỗ đen nhỏ.', opts: [['cong', 'Trám răng ở bệnh viện theo BHYT', 0.4, 1], ['tu', 'Trám ở nha khoa tư, vật liệu tốt hơn', 0.9, 0], ['de', 'Để đó, chưa đau lắm', 0, 0]] },
    { k: 'cao', when: function (l) { return l.age >= 16; }, title: 'Lấy cao răng', text: 'Nướu hay chảy máu khi đánh răng, nha sĩ khuyên nên lấy cao răng.', opts: [['cong', 'Lấy cao răng ở bệnh viện theo BHYT', 0.25, 1], ['tu', 'Làm ở nha khoa tư, kèm đánh bóng', 0.5, 0], ['de', 'Để lần sau', 0, 0]] },
    { k: 'nieng', when: function (l) { return l.age >= 12 && l.age <= 30 && !l.flags.braces; }, title: 'Niềng răng', text: 'Răng mọc lệch, cười hay che miệng. Nha sĩ tư vấn niềng răng hai năm, BHYT không chi trả vì là chỉnh nha thẩm mỹ.', opts: [['mac_cai', 'Niềng mắc cài kim loại', 30, 0], ['trong', 'Niềng trong suốt (khay)', 70, 0], ['de', 'Thôi, để vậy cũng được', 0, 0]] },
    { k: 'su', when: function (l) { return l.age >= 25 && l.indep && !l.flags.veneers; }, title: 'Bọc răng sứ', text: 'Mấy chiếc răng ố vàng, sứt mẻ. Phòng khám quảng cáo bọc sứ "nụ cười Hollywood". BHYT không chi trả.', opts: [['vai', 'Bọc vài chiếc răng cửa', 15, 0], ['ca_ham', 'Bọc cả hàm', 80, 0], ['tay', 'Chỉ tẩy trắng nhẹ', 2, 0], ['de', 'Thôi, giữ răng thật', 0, 0]] }
  ];
  DENTAL.forEach(function (D) {
    var id = 'nha_' + D.k;
    SC(id, {
      title: D.title, valid: function (l) { return free(l) && D.when(l); }, text: D.text,
      opts: D.opts.map(function (o) {
        return { k: o[0], l: o[1], h: function (l) { return o[2] ? 'Khoảng ' + mo(l, V(l, o[2])) + E.medNote(l, V(l, o[2]), o[3]) : 'Không tốn tiền'; }, req: function (l) { return !o[2] || !l.indep || l.money >= V(l, o[2]) * (1 - o[3] * E.bhytShare(l)); }, ai: { w: o[0] === 'de' || o[0] === 'tay' ? 0.6 : o[0] === 'cong' || o[0] === 'mac_cai' || o[0] === 'vai' ? 1.1 : 0.6 },
          run: function (l, r, log) {
            if (!o[2]) { log(D.k === 'tram' ? 'Bạn để đó. Vài tháng sau chiếc răng đau nhức cả đêm.' : (typeof D.title === 'string' ? D.title + ': bạn quyết định để sau.' : 'Bạn quyết định để sau.'), 'neutral'); if (D.k === 'tram') H.fx(l, { hea: -2, hap: -2 }); return; }
            E.medBill(l, V(l, o[2]), D.title + ': ' + o[1].toLowerCase(), log, o[3]);
            if (D.k === 'nieng') { l.flags.braces = l.age; log('Bắt đầu niềng răng. Mấy tuần đầu ăn cháo, cười lộ mắc cài. Hai năm sau tháo niềng, hàm răng đều tăm tắp.', 'good'); H.fx(l, { hap: 3 }); }
            else if (D.k === 'su') { l.flags.veneers = l.age; log(o[0] === 'tay' ? 'Tẩy trắng răng xong, nụ cười sáng hơn hẳn.' : 'Bọc răng sứ xong, nụ cười trắng sáng hẳn.', 'good'); H.fx(l, { hap: 3 }); }
            else { log(D.k === 'tram' ? 'Trám xong, ăn uống không còn ê buốt.' : 'Lấy cao răng xong, nướu hết chảy máu, miệng thơm tho hẳn.', 'good'); H.fx(l, { hea: 1 }); }
          } };
      })
    });
    E.TRIG.push({ id: id, when: function (l, a) { return free(l) && D.when(l); }, p: D.k === 'nieng' ? 0.05 : D.k === 'su' ? 0.02 : 0.05, cd: 4, max: D.k === 'nieng' || D.k === 'su' ? 1 : 3 });
  });
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
