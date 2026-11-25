/* Một Đời — 9.9.1 nghề đường phố theo từng nước và thời kỳ.
   Mở rộng bảng nghề E.CAR (careers.js), không lập hệ thống mới: mỗi nghề có cửa sổ năm theo nước (jobBlocked của era902),
   nên người nghèo ở Việt Nam có đánh giày, bán báo dạo, đạp xích lô…, còn nước khác có nghề tương ứng (okada ở Nigeria, becak ở Indonesia,
   lau kính ở ngã tư Mexico, giữ xe tự phát ở Brazil…). Thu nhập thấp, nhiều rủi ro; chỉ người đủ tuổi và đúng thời mới nhận được. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, CAR = E.CAR;
  function win(list, from, to) { var w = {}; list.split(' ').forEach(function (c) { w[c] = [from, to]; }); return w; }
  function merge() { var o = {}; Array.prototype.slice.call(arguments).forEach(function (w) { Object.keys(w).forEach(function (k) { o[k] = w[k]; }); }); return o; }
  // [id, danh xưng, thu nhập triệu/tháng (thang VN), năm tối thiểu mỗi bậc, tùy chọn, cửa sổ năm theo nước]
  var JOBS = [
    ['danh_giay', ['trẻ đánh giày, thợ đánh giày dạo'], [3.2], [], { minAge: 10, w: 0.6 },
      win('VN IN PK BD LK NP MM KH PH ID TH EG MA DZ TN TR NG GH KE ET CO PE BO EC BR MX GT HN SV NI DO CU', 1900, 2025)],
    ['ban_bao_dao', ['trẻ bán báo dạo, người bán báo ngoài phố'], [3.5], [], { minAge: 10, w: 0.5 },
      merge(win('VN IN PK BD EG MA DZ TN TR CO PE BO BR MX PH ID TH NG GH KE ET LK NP', 1900, 2012))],
    ['xich_lo', ['người đạp xích lô, kéo xe chở khách'], [5], [], { minAge: 16, w: 0.7, sex: [1.8, 0.05], haz: [0.02, 0.001, 'tai nạn giao thông'] },
      merge(win('VN', 1900, 2005), win('CN', 1900, 1965), win('JP', 1900, 1950), win('IN BD PK LK NP MM', 1900, 2025), win('ID', 1930, 2025), win('TH', 1930, 1995), win('KH', 1900, 2015), win('PH', 1950, 2025), win('MY SG', 1900, 1975))],
    ['boc_vac', ['phu bốc vác, khuân vác thuê', 'tổ trưởng đội bốc vác'], [7, 11], [4], { minAge: 16, w: 0.7, sex: [1.8, 0.1], haz: [0.02, 0.0012, 'tai nạn lao động'] },
      win('VN CN IN PK BD ID PH TH KH LA MM LK NP EG MA DZ TN NG GH KE ET TZ UG CD SN CI CM CO PE BO BR MX GT HN', 1900, 2025)],
    ['ban_nga_tu', ['người bán hàng rong ở ngã tư, đèn đỏ'], [4], [], { minAge: 10, w: 0.5, haz: [0.02, 0.001, 'tai nạn giao thông'] },
      win('MX BR AR CO PE CL EG NG GH KE ZA PH ID TH IN PK VN', 1975, 2025)],
    ['giu_xe', ['người trông xe, giữ xe tự phát'], [4.5], [], { minAge: 14, w: 0.6 },
      win('VN ZA BR AR CO MX PE ID IN PH EG NG', 1960, 2025)],
    ['hat_rong', ['nghệ sĩ hát rong, đàn hát xin tiền'], [3], [], { minAge: 8, w: 0.3, talent: null },
      merge(win('VN', 1900, 1995), win('ID MX BR IN EG TR RO', 1900, 2025))],
    ['taxi_mo_to', ['tài xế mô tô taxi (okada, boda boda, ojek…)'], [7], [], { minAge: 18, w: 0.8, sex: [1.8, 0.05], haz: [0.03, 0.002, 'tai nạn giao thông'] },
      win('NG UG KE TZ RW CM BJ TG GH SL LR MW ZM CD CG GA TD BI ML BF NE CI KH TH PH ID', 1990, 2025)],
    ['ban_xo_so', ['người bán vé số dạo'], [4], [], { minAge: 14, w: 0.5 },
      win('TH MX CO PE ES IN LK KH MM PH AR', 1950, 2025)],
    ['rua_xe', ['người rửa xe thuê'], [4.5], [], { minAge: 14, w: 0.5, sex: [1.5, 0.3] },
      win('VN IN PK BD ID PH TH EG NG GH KE ZA CO PE BR MX', 1985, 2025)]
  ];
  JOBS.forEach(function (x) {
    var o = x[4] || {};
    CAR[x[0]] = { id: x[0], t: x[1], vn: x[2], yrs: x[3], cat: 'poor', sec: 'inf', edu: 0, sigma: 0.12, fail: 0, w: o.w || 0.5, minAge: o.minAge, sex: o.sex, haz: o.haz, street991: x[5] };
  });
  function worldYear(l) { return l && l.birthYear != null ? l.birthYear + (l.age || 0) : 9999; }
  function ok(l, c) {
    if (!c || !c.street991) return true;
    var cc = H.resCode(l), r = c.street991[cc], y = worldYear(l);
    return !!r && y >= r[0] && y <= r[1];
  }
  var P = E.ERA902; if (P && P.jobBlocked) { var jb = P.jobBlocked; P.jobBlocked = function (l, id, c) { var cc = c || CAR[id]; if (cc && cc.street991 && !ok(l, cc)) return true; return jb.apply(this, arguments); }; }
  E.STREET991 = { JOBS: JOBS.map(function (x) { return x[0]; }), ok: ok };
})(globalThis.G);
