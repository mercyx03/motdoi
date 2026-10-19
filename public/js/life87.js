/* Một Đời — v7.0.0: rà soát lỗi logic toàn hệ thống
   · tuổi kết hôn theo luật: Việt Nam nam từ đủ 20, nữ từ đủ 18 tuổi (Luật Hôn nhân và Gia đình 2014, Điều 8);
     các nước khác từ 18 tuổi. Chưa đủ tuổi thì không có lời cầu hôn / đám cưới; có thai sớm thì về chung sống,
     đợi đủ tuổi mới đăng ký kết hôn */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H;
  function vnLaw(l) { return H.isVN(l) && !(l.abroad && l.abroad.perm); }
  function marryAge(l, sex) { return vnLaw(l) ? (sex === 'M' ? 20 : 18) : 18; }
  function legalToMarry(l) { var p = l.partner; if (!p || p.alive === false) return false; return l.age >= marryAge(l, l.sex) && (p.age == null || p.age >= marryAge(l, p.sex)); }
  E.marryAge = marryAge; E.legalToMarry = legalToMarry;
  function gate(id) { var D = E.DEC[id]; if (!D) return; var v = D.valid; D.valid = function (l, d) { return legalToMarry(l) && (!v || v.apply(this, arguments)); }; }
  gate('marry'); gate('cuoi_to_chuc'); gate('vn_giuc_cuoi');
  // giục cưới chỉ khi cả hai đã đủ tuổi
  E.TRIG.forEach(function (t) { if (t.id === 'vn_giuc_cuoi' || t.id === 'marry') { var w = t.when; t.when = function (l) { return legalToMarry(l) && w.apply(this, arguments); }; } });
  // đám cưới chạy bầu khi chưa đủ tuổi: về chung sống, đủ tuổi mới đăng ký
  var CB = E.DEC.co_bau_som;
  if (CB) {
    var cbAp = CB.apply;
    CB.apply = function (l, d, k, r, log) {
      if (k === 'cuoi' && l.partner && !legalToMarry(l)) {
        var p = l.partner, need = Math.max(marryAge(l, l.sex) - l.age, p.age != null ? marryAge(l, p.sex) - p.age : 0);
        log((vnLaw(l) ? 'Theo Luật Hôn nhân và Gia đình, nam từ đủ 20, nữ từ đủ 18 tuổi mới được đăng ký kết hôn. ' : 'Chưa đủ tuổi kết hôn theo luật. ') + 'Hai gia đình cho hai bạn về ở cùng nhau, hẹn ' + need + ' năm nữa đủ tuổi sẽ làm đám cưới.', 'neutral');
        l.flags.marryWhenLegal = p.name;
        return cbAp.call(this, l, d, 'cung_nuoi', r, log);
      }
      return cbAp.apply(this, arguments);
    };
  }
  // đủ tuổi rồi thì tổ chức đám cưới đã hẹn
  E.HOOKS.year.unshift(function (l, r, log, a) {
    var n = l.flags.marryWhenLegal; if (!n || !l.partner || l.partner.name !== n || l.partner.status === 'married' || l.partner.alive === false) return;
    if (legalToMarry(l)) { l.flags.marryWhenLegal = null; var W = E.DEC.cuoi_to_chuc; if (W && W.valid(l, {})) l.pending.unshift(W.make(l, r)); else if (E.DEC.marry) l.pending.unshift(E.DEC.marry.make(l, r)); }
  });
  // lưới an toàn: không để hôn nhân dưới tuổi luật định xuất hiện từ bất kỳ đường nào
  E.HOOKS.year.unshift(function (l, r, log, a) {
    var p = l.partner; if (!p || p.status !== 'married' || p.alive === false) return;
    if (l.age < marryAge(l, l.sex) && (p.since == null || p.since >= l.age - 1)) { p.status = 'dating'; l.flags.marryWhenLegal = p.name; }
  });
  // nghỉ hưu trước tuổi (lực lượng vũ trang sau sắp xếp tổ chức): chỉ khi đã từ 48 tuổi và có từ 20 năm công tác — trước đây có người 38 tuổi đã nhận lương hưu
  E.TRIG.forEach(function (t) { if (t.id === 'qd_nghi_huu_som') { var w = t.when; t.when = function (l, a) { return l.age >= 48 && (l.workYrs || 0) >= 20 && w.apply(this, arguments); }; } });
  var NHS = E.DEC.qd_nghi_huu_som; if (NHS) { var nv = NHS.valid; NHS.valid = function (l) { return l.age >= 48 && (l.workYrs || 0) >= 20 && (!nv || nv.apply(this, arguments)); }; }
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
