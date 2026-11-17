/* Một Đời — 9.5.4: thu nhập, chi phí sinh hoạt và giá nhà theo thời đại.
   Trước đây người sinh năm 1960 hay 1985 vẫn có mặt bằng lương và giá nhà của năm nay (thu nhập cơ sở l.base cố định).
   Nay l.base nhân với mức phát triển thật của nước đang sống tại năm đó so với hiện nay (cùng dãy GDP bình quân Maddison mà E.devGdp đã dùng),
   nên lương, chi phí ăn ở, tiền nhà, học phí tính theo bội số thu nhập cơ sở đều thấp hơn tương ứng; giá nhà theo thu nhập; đồ đắt tiền như xe giữ
   giá thực nên so với thu nhập thời ấy là rất đắt. Tiền đã tích lũy giữ nguyên (tiền thực), khi kinh tế lớn lên thì thu nhập lớn theo.
   Người sinh từ 2024 và năm từ 2023 trở đi: hệ số bằng 1, không đổi một byte. Dùng E.ERA920 (không tạo bảng mới), H.setBase, E.HOOKS.year. */
(function (G) {
  'use strict';
  var E = G.E, H = E && E.H;
  if (!E || !H || !H.setBase) return;
  var MIN = 0.06, MAX = 1.25;

  function worldYear(l) { return l.birthYear + l.age; }
  // hệ số thực của năm đang sống so với hiện nay, theo nước đang cư trú
  function rel(l) {
    var X = E.ERA920; if (!X || !X.at || !l || !l.era920) return 1;
    var y = worldYear(l), TO = X.TO || 2023; if (y >= TO) return 1;
    var cc = H.resCode ? H.resCode(l) : l.country, a = X.at(cc, y) || X.at(l.country, y); if (!a || !(a.gdpRel > 0)) return 1;
    var k = Math.min(MAX, a.gdpRel); if (y < 1950) k *= Math.max(0.55, 1 - (1950 - y) * 0.008);
    return Math.max(MIN, k);
  }
  function apply(l) {
    var f = l.flags; if (!f) return;
    var k = rel(l), old = f.eraK954 || 1;
    if (Math.abs(k / old - 1) < 0.004) return;
    l.base *= k / old;
    if (k === 1) delete f.eraK954; else f.eraK954 = k;
  }
  // mọi lần dựng lại thu nhập cơ sở (sinh ra, chuyển nước, về nước) lấy lại hệ số hiện hành
  var setBase = H.setBase;
  H.setBase = function (l) { var out = setBase.apply(this, arguments); var k = rel(l); if (k !== 1 && l.flags) { l.base *= k; l.flags.eraK954 = k; } else if (l.flags) delete l.flags.eraK954; return out; };
  var create = E.createLife;
  E.createLife = function () { var l = create.apply(this, arguments); if (l && l.era920 && l.flags && l.flags.eraK954 == null) apply(l); return l; };
  // mỗi năm thu nhập lớn theo nền kinh tế (chạy trước các hook khác để cả năm dùng cùng một mức)
  E.HOOKS.year.unshift(function (l) { if (l && l.alive && l.era920) apply(l); });
  E.PRICE954 = { rel: rel, apply: apply };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
