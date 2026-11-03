/* Một Đời — MD5 (8.10.24): party920 — một dịch vụ tiệc cho cả menu "Tổ chức tiệc" và bàn làm việc gia chủ.
   · PARTY-01: trước đây khi có nhân sự sự kiện, bấm "Tổ chức tiệc" bị chuyển sang bàn làm việc chỉ còn 3 cỡ cố định, mất chọn loại
     tiệc. Nay hai lối vào đều giữ đủ lựa chọn (app.js) và cùng đi qua E.ELITE148.party.
   · PARTY-02: thêm quy mô 1.000 khách (địa điểm lớn). Khách mời, xác nhận (RSVP) và khách thực dự tính theo nhóm (cohort); chỉ người
     quen có tên được lưu hồ sơ, không tạo 1.000 NPC. Tình cảm từ tiệc với cùng một người tối đa một lần mỗi năm (không farm bằng
     nhiều tiệc), tiệc đắt hơn không tăng thiện cảm thêm. Tiền tiệc là tiền cá nhân; không dùng quỹ doanh nghiệp/công vụ. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, N = E.ELITE148;
  if (!X || !N) return;
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; return h >>> 0; }
  function u(seed) { return hash(seed) / 4294967296; }
  var HEADS = { small: 15, mid: 60, big: 200, grand: 500, huge: 1000 };
  function st(l) { var s = l.flags.party920; if (!s || typeof s !== 'object') s = l.flags.party920 = { boost: {} }; if (!s.boost) s.boost = {}; return s; }
  // ảnh chụp mức thân thiết trước tiệc để giới hạn mỗi người một lần tăng/năm
  function snap(l) {
    var m = {};
    (N.contacts ? N.contacts(l, function () { return true; }) : []).forEach(function (p) { if (p.uid110) m['c:' + p.uid110] = { o: p, k: 'trust', v: p.trust }; });
    (l.friends || []).concat(l.bff ? [l.bff] : []).forEach(function (f) { m['f:' + X.uid(l, f)] = { o: f, k: 'close', v: f.close }; });
    (N.relatives ? N.relatives(l) : []).forEach(function (x) { if (x.id) m['r:' + x.id] = { o: x, k: 'close', v: x.close }; });
    return m;
  }
  function capGains(l, before) {
    var s = st(l), capped = 0;
    Object.keys(before).forEach(function (id) {
      var b = before[id], now = b.o[b.k]; if (!(now > b.v)) return;
      if (s.boost[id] === l.age) { b.o[b.k] = b.v; capped++; } else s.boost[id] = l.age;
    });
    Object.keys(s.boost).forEach(function (id) { if (l.age - s.boost[id] > 2) delete s.boost[id]; });
    return capped;
  }
  var party0 = N.party;
  N.party = function (l, r, log, type, size, venue, guests, config) {
    var before = snap(l), out = party0.apply(this, arguments);
    if (!out || !out.record) return out;
    var heads = HEADS[size] || 15, named = out.came.length, invited = heads + Math.round(heads * 0.15);
    var rate = U.clamp(0.55 + (guests === 'family' ? 0.2 : 0) + (out.score - 0.5) * 0.3 - (heads >= 500 ? 0.1 : 0), 0.25, 0.92), rsvp = Math.max(named, Math.round(invited * rate));
    var show = Math.max(named, Math.min(heads, Math.round(rsvp * (0.82 + u(l.id + ':show:' + l.age + ':' + type) * 0.13))));
    var capped = capGains(l, before);
    out.record.cohort920 = { invited: invited, rsvp: rsvp, attended: show, named: named, capped: capped };
    if (heads >= 200 || capped) log('Khách mời khoảng ' + invited + ', xác nhận ' + rsvp + ', thực đến ' + show + ' (trong đó ' + named + ' người quen có tên)' + (capped ? '; ' + capped + ' người đã dự tiệc của bạn năm nay nên lần này không thân thiết thêm' : '') + '.', 'neutral');
    return out;
  };
  // menu cũ gọi hàm party nội bộ; định nghĩa lại bước khách mời để đi qua cùng dịch vụ (có cohort và trần quan hệ)
  var GUESTS = { family: 'Chỉ gia đình, họ hàng', friends: 'Gia đình và bạn bè', network: 'Gia đình, bạn bè và người quen trong giới làm ăn', star: 'Mời thêm người nổi tiếng góp vui' };
  var gx = E.DEC.party148_guests, choices0 = gx && gx.def && gx.def.opts;
  X.menu('party148_guests', 'Danh sách khách mời', function (l) { return X.reason(l, 18); }, function (l, d) {
    var a = d && d.arg || {}; return 'Khách mời quyết định có đến hay không tùy độ thân thiết, lịch bận, khoảng cách và vị thế của bạn. Mời ' + (HEADS[a.size] || 15) + ' khách không có nghĩa tất cả sẽ đến. Mỗi người chỉ thân thiết thêm nhờ tiệc một lần mỗi năm; tiệc đắt hơn không làm ai quý bạn hơn. Chi phí trả bằng tiền cá nhân.' + (a.type ? ' Chi phí dự kiến ' + H.money(l, N.partyCost(l, a.type, a.size, a.venue)) + '.' : '');
  }, function (l, arg) {
    if (!arg.type || !HEADS[arg.size]) return [];
    var t = N.tier(l);
    return Object.keys(GUESTS).map(function (g) {
      var why = g === 'network' && t < 1 ? 'Cần thuộc tầng ' + N.TIERS[1].n : g === 'star' && t < 2 ? 'Cần thuộc tầng ' + N.TIERS[2].n : true;
      if (arg.size === 'small' && (g === 'network' || g === 'star')) why = 'Tiệc thân mật không phù hợp mời rộng';
      if ((arg.size === 'grand' || arg.size === 'huge') && g === 'family') why = 'Quy mô này cần mời rộng hơn gia đình';
      return { k: g, l: GUESTS[g], why: why, run: function (l, r, log) { if (!N.party(l, r, log, arg.type, arg.size, arg.venue, g)) log('Bữa tiệc chưa thể tổ chức: điều kiện, tiền hoặc lịch đã thay đổi; chưa trừ tiền.', 'neutral'); } };
    });
  });
  // văn bản menu chính: chỉ dẫn lối vào bàn làm việc khi có nhân sự sự kiện
  var pm = E.DEC.party148, text0 = pm && pm.def && pm.def.text;
  if (pm && typeof text0 === 'function') pm.def.text = function (l) { var t = text0.apply(this, arguments); return t + (E.OFFICE171 && E.OFFICE171.desk.person(l, 'events') ? ' Bạn cũng có thể nhờ nhân sự lập dự toán chi tiết ở Bàn làm việc → Chuẩn bị tiệc; hai cách dùng chung lịch tiệc, giới hạn 2 tiệc/năm.' : ''); };
  E.PARTY920 = { HEADS: HEADS, snap: snap, capGains: capGains };
})(globalThis.G);
