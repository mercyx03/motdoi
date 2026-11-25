/* Một Đời — 9.9.1 gỡ chú thích thừa khi chơi.
   Lời nhắc "mô phỏng / hư cấu / nhân vật trong game" đã có ở trang chủ nên không lặp lại trong nội dung cuộc đời.
   Chỉ là lớp lọc khi hiển thị và khi ghi nhật ký/kỷ niệm, không đổi dữ liệu bản lưu; không đụng các nhãn cơ chế như "hạng đấu trong game". */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, RULES = [
    [/\s*\((?:mô phỏng|hư cấu|giả định)\)/gi, ''],
    [/\s*\((?:Nhân vật|Tình huống|Tổ chức|Sự kiện|Diễn biến|Câu chuyện)[^()]{0,60}(?:hư cấu|mô phỏng|trong game)[^()]{0,30}\)\.?/gi, ''],
    [/\s*Tình huống hư cấu\./gi, ''],
    [/\s*(?:Tổ chức và tình huống|Mọi diễn biến[^.\n]{0,60}|Mọi (?:tổ chức|công ty|nhân vật)[^.\n]{0,60}|Diễn biến[^.\n]{0,60}|Nhân vật)[^.\n]{0,40}(?:đều hư cấu|đều là mô phỏng|là mô phỏng|trong game hư cấu)\./gi, ''],
    [/\s*Nhân vật trong game\./gi, '']
  ];
  function clean(t) {
    if (typeof t !== 'string' || !/mô phỏng|hư cấu|giả định|Nhân vật trong game/i.test(t)) return t;
    var o = t; RULES.forEach(function (r) { o = o.replace(r[0], r[1]); });
    return o === t ? t : o.replace(/[ \t]{2,}/g, ' ').replace(/\s+([.,;!?])/g, '$1').replace(/^\s+|\s+$/g, '');
  }
  var narrative = E.lifeNarrative; E.lifeNarrative = function (t) { return clean(narrative ? narrative.apply(this, arguments) : t); };
  var fam = E.famLogic; E.famLogic = function (l, t) { var o = fam ? fam.apply(this, arguments) : t; return typeof o === 'string' ? clean(o) : o; };
  var mem = H.mem; if (typeof mem === 'function') H.mem = function (l, t) { var a = Array.prototype.slice.call(arguments); a[1] = clean(t); return mem.apply(this, a); };
  E.CLEAN991 = { clean: clean };
})(globalThis.G);
