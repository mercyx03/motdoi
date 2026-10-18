/* Một Đời — v5.9.2:
   · xưng hô đúng giới tính / quan hệ trong các câu thoại còn viết cứng ("Chị ơi…", "Anh biết tôi là ai không?"…)
   · E.callYou(l, p): người p gọi bạn là gì (anh / chị / em) — dùng chung cho các lời thoại của người yêu, bạn đời */
(function (G) {
  'use strict';
  var U = G.U, E = G.E;
  // người yêu / bạn đời gọi bạn: khác giới thì nam là "anh", nữ là "em"; cùng giới thì theo tuổi
  E.callYou = function (l, p) {
    if (!p) return l.sex === 'F' ? 'chị' : 'anh';
    if (p.sex !== l.sex) return l.sex === 'M' ? 'anh' : 'em';
    return (p.age || l.age) <= l.age ? (l.sex === 'M' ? 'anh' : 'chị') : 'em';
  };
  // câu thoại người khác nói với bạn: đổi "anh" ↔ "chị" theo giới tính của bạn
  var FIX = [
    ['"Chị ơi, em chưa bao giờ thấy mình đẹp như thế', '"Anh ơi, em chưa bao giờ thấy mình đẹp như thế', 'M'],
    ['"Chị lo cho cả nhà này như người nhà. Không có chị,', '"Anh lo cho cả nhà này như người nhà. Không có anh,', 'M'],
    ['"Anh biết tôi là ai không?"', '"Chị biết tôi là ai không?"', 'F']
  ];
  var fl = E.famLogic;
  E.famLogic = function (l, t, isLog) {
    if (typeof t === 'string' && l) for (var i = 0; i < FIX.length; i++) if (l.sex === FIX[i][2] && t.indexOf(FIX[i][0]) >= 0) t = t.split(FIX[i][0]).join(FIX[i][1]);
    if (typeof t === 'string' && l && isLog && E.hasFamily && !E.hasFamily(l)) t = t.replace('chiều về quây quần ăn bữa xả chay', 'chiều đến thánh đường cùng bà con ăn bữa xả chay'); // không còn ai trong gia đình
    return fl ? fl.call(this, l, t, isLog) : t;
  };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
