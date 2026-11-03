/* Một Đời — 8.10.24: chốt an toàn cho menu MD4/MD5 (…919, …920). Một menu được xếp hàng từ trước (X.next, bản lưu cũ) mà hoàn cảnh
   đã đổi (người liên quan không còn, hồ sơ đã đóng) trước đây có thể ném lỗi khi dựng lựa chọn — 8.10.23 từng dừng regression ở
   global919. Nay dựng lỗi thì trả về hộp "hoàn cảnh đã thay đổi" không có lựa chọn và bị engine loại khỏi hàng chờ (valid = false). */
(function (G) {
  'use strict';
  var E = G.E;
  Object.keys(E.DEC).filter(function (id) { return /(919|920)$/.test(id); }).forEach(function (id) {
    var D = E.DEC[id], make0 = D.make, valid0 = D.valid;
    D.make = function (l) {
      try { return make0.apply(this, arguments); }
      catch (e) { return { id: id, title: 'Hoàn cảnh đã thay đổi', text: 'Mục này không còn áp dụng với hoàn cảnh hiện tại.', opts: [], data: { keys: [], at: l && l.age, broken920: String(e && e.message || e) } }; }
    };
    D.valid = function (l, d) { if (d && d.broken920) return false; return valid0 ? valid0.apply(this, arguments) : true; };
  });
})(globalThis.G);
