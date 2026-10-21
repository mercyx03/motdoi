/* Một Kiếp Người — tiện ích dùng chung (chạy được cả trên trình duyệt lẫn Node để test) */
(function (G) {
  'use strict';
  G.VERSION = '8.2.0';

  // RNG có seed (mulberry32). Trạng thái lưu thẳng trong object để có thể lưu/tiếp tục.
  function rand(holder) {
    var t = (holder.rs = (holder.rs + 0x6D2B79F5) | 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  var U = {
    rand: rand,
    newSeed: function () { return (Math.random() * 4294967296) | 0; },
    clamp: function (x, a, b) { return x < a ? a : x > b ? b : x; },
    pick: function (r, arr) { return arr[Math.floor(r() * arr.length)]; },
    chance: function (r, p) { return r() < p; },
    randint: function (r, a, b) { return a + Math.floor(r() * (b - a + 1)); },
    normal: function (r) {
      var u = 1 - r(), v = r();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    },
    // chọn theo trọng số: items là mảng, w(item, i) trả về trọng số
    wpick: function (r, items, w) {
      var tot = 0, i, ws = [];
      for (i = 0; i < items.length; i++) { var x = Math.max(0, w(items[i], i)); ws.push(x); tot += x; }
      if (tot <= 0) return items[Math.floor(r() * items.length)];
      var t = r() * tot;
      for (i = 0; i < items.length; i++) { t -= ws[i]; if (t < 0) return items[i]; }
      for (i = items.length - 1; i > 0 && !(ws[i] > 0); i--); // v3.0: sai số làm tròn không được chọn phải mục có trọng số 0
      return items[i];
    },
    // "a:3,b:1" -> chọn khóa theo trọng số
    wkey: function (r, spec) {
      var parts = spec.split(',').map(function (s) { var p = s.split(':'); return [p[0].trim(), p.length > 1 ? +p[1] : 1]; });
      return U.wpick(r, parts, function (p) { return p[1]; })[0];
    },
    poisson: function (r, lam) {
      var L = Math.exp(-lam), k = 0, p = 1;
      do { k++; p *= r(); } while (p > L && k < 30);
      return k - 1;
    },
    fmtNum: function (n, d) {
      return Number(n).toLocaleString('vi-VN', { maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: 0 });
    },
    esc: function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    },
    cap: function (s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  };
  G.U = U;
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
