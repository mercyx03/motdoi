/* Một Đời — v5.6.4:
   · chuyện "anh chị" tuổi thơ chỉ khi thật sự có anh chị ruột
   · người già không còn "tập gym", chuyển sang đi bộ, dưỡng sinh
   · đa số nghề có lương hưu: chủ cơ sở kinh doanh tự đóng BHXH tự nguyện; nghề tự do, vé số, xe ôm… vẫn không có */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H;

  // ===================================================================
  // 1. ANH CHỊ RUỘT
  // ===================================================================
  function olderSib(l) { return (l.sibList || []).some(function (s) { return s.alive && s.born < 0; }); }
  E.hasOlderSib = olderSib;
  function opt(id, k) { var D = E.DEC[id]; return D && D.def ? D.def.opts.filter(function (o) { return o.k === k; })[0] : null; }
  var ma = opt('k_mat_dien', 'ma'); if (ma) ma.l = function (l) { return olderSib(l) ? 'Ngồi nghe anh chị kể chuyện ma' : 'Ngồi nghe mấy anh chị trong xóm kể chuyện ma'; };
  var cu = opt('k_sach_cu', 'cu'); if (cu) cu.l = function (l) { return olderSib(l) ? 'Dùng sách cũ của anh chị, bọc lại thật đẹp' : 'Xin lại sách cũ của anh chị hàng xóm, bọc lại thật đẹp'; };
  var vo = opt('k_ke_hoach_nho', 'vo'); if (vo) vo.req = function (l) { return olderSib(l); };

  // ===================================================================
  // 2. TUỔI GIÀ KHÔNG TẬP GYM
  // ===================================================================
  (E.RECUR || []).forEach(function (x) {
    if (x.id !== 'gym') return;
    x.l = 'Tập thể dục, thể thao đều đặn';
    var run0 = x.run; x.run = function (l) { var t = run0.apply(this, arguments); return l.age >= 60 ? 'đi bộ, tập dưỡng sinh mỗi sáng' : t; };
  });

  // ===================================================================
  // 3. LƯƠNG HƯU CHO ĐA SỐ NGHỀ
  // ===================================================================
  var pol = E.pensionPolicy;
  if (pol) E.pensionPolicy = function (l, c) {
    var p = pol.apply(this, arguments);
    if (!p.covered && /^Chủ cơ sở/.test(p.reason) && H.isVN(l)) return { covered: true, voluntary: true, reason: 'Chủ cơ sở kinh doanh: tự đóng BHXH tự nguyện hằng năm để có lương hưu' };
    return p;
  };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
