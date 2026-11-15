/* Một Đời — 9.5 sửa dữ liệu tôn giáo theo nước.
   Lỗi cũ: tôn giáo được chọn theo "nhóm tên" dùng chung cho nhiều nước (ví dụ cả Rwanda, Kenya, Uganda, Tanzania, Burundi dùng một bảng; mười chín nước Ả Rập một bảng),
   rồi mọi người "Kitô giáo" được chia ĐỀU cho Công giáo, Tin Lành, Chính thống giáo Đông phương và Anh giáo (faith830.js). Hệ quả: người Rwanda có 20% theo Chính thống giáo Đông phương và 22% Anh giáo,
   nhiều nước Bắc Phi và vùng Vịnh có Kitô hữu bản địa. Nay có bảng theo từng nước cho các nhóm tên dùng chung, và Kitô hữu được chia theo giáo phái chiếm ưu thế của nước đó.
   Số liệu là ước tính làm tròn từ Pew Research Center "The Global Religious Landscape" (2010) và "Religious Composition by Country" (2010–2020) cùng CIA World Factbook; mức độ chính xác ±5 điểm phần trăm, tham số trò chơi, không đổi theo năm sinh.
   Không gán tính cách hay hoàn cảnh theo tôn giáo; đây chỉ là phân bố tôn giáo của dân cư từng nước. */
(function (G) {
  'use strict';
  var E = G.E; if (!E) return;
  // nhãn trùng với W.REL / faith830.js: Công giáo, Tin Lành, Chính thống giáo Đông phương, Anh giáo, Hồi giáo, Hindu giáo, Phật giáo, Không tôn giáo, Tín ngưỡng truyền thống, Khác
  var T = {
    // Đông Phi và Hồ Lớn
    RW: 'Công giáo:44,Tin Lành:49,Hồi giáo:2,Không tôn giáo:3,Khác:2', BI: 'Công giáo:62,Tin Lành:28,Hồi giáo:3,Tín ngưỡng truyền thống:5,Khác:2', KE: 'Tin Lành:55,Anh giáo:5,Công giáo:23,Hồi giáo:11,Tín ngưỡng truyền thống:3,Không tôn giáo:3',
    TZ: 'Công giáo:28,Tin Lành:30,Hồi giáo:34,Tín ngưỡng truyền thống:6,Khác:2', UG: 'Công giáo:39,Anh giáo:32,Tin Lành:13,Hồi giáo:12,Khác:4', ET: 'Chính thống giáo Đông phương:43,Hồi giáo:34,Tin Lành:19,Công giáo:1,Tín ngưỡng truyền thống:3', ER: 'Chính thống giáo Đông phương:50,Hồi giáo:49,Công giáo:1',
    // Tây Phi
    NG: 'Hồi giáo:49,Tin Lành:30,Công giáo:15,Anh giáo:4,Tín ngưỡng truyền thống:2', GH: 'Tin Lành:60,Công giáo:11,Hồi giáo:18,Tín ngưỡng truyền thống:8,Không tôn giáo:3', LR: 'Tin Lành:70,Công giáo:6,Hồi giáo:12,Tín ngưỡng truyền thống:8,Không tôn giáo:4', SL: 'Hồi giáo:78,Tin Lành:12,Công giáo:7,Tín ngưỡng truyền thống:3',
    BJ: 'Công giáo:26,Tin Lành:22,Hồi giáo:28,Tín ngưỡng truyền thống:23,Khác:1', BF: 'Hồi giáo:61,Công giáo:19,Tin Lành:4,Tín ngưỡng truyền thống:15,Khác:1', CI: 'Hồi giáo:42,Công giáo:17,Tin Lành:17,Tín ngưỡng truyền thống:12,Không tôn giáo:12', GM: 'Hồi giáo:95,Công giáo:2,Tin Lành:2,Khác:1', GN: 'Hồi giáo:85,Công giáo:5,Tin Lành:3,Tín ngưỡng truyền thống:7',
    ML: 'Hồi giáo:95,Công giáo:1,Tin Lành:1,Tín ngưỡng truyền thống:3', NE: 'Hồi giáo:99,Khác:1', SN: 'Hồi giáo:96,Công giáo:3,Khác:1', TG: 'Công giáo:28,Tin Lành:15,Hồi giáo:14,Tín ngưỡng truyền thống:36,Khác:7',
    // Trung Phi
    CM: 'Công giáo:38,Tin Lành:26,Hồi giáo:21,Tín ngưỡng truyền thống:12,Khác:3', CF: 'Công giáo:29,Tin Lành:60,Hồi giáo:9,Tín ngưỡng truyền thống:2', CG: 'Công giáo:36,Tin Lành:50,Hồi giáo:2,Tín ngưỡng truyền thống:6,Không tôn giáo:6', CD: 'Công giáo:42,Tin Lành:49,Hồi giáo:2,Tín ngưỡng truyền thống:4,Khác:3', GA: 'Công giáo:42,Tin Lành:35,Hồi giáo:10,Tín ngưỡng truyền thống:5,Không tôn giáo:8', GQ: 'Công giáo:88,Tin Lành:5,Hồi giáo:2,Tín ngưỡng truyền thống:5',
    TD: 'Hồi giáo:56,Công giáo:20,Tin Lành:20,Tín ngưỡng truyền thống:4',
    // Nam Phi
    ZA: 'Tin Lành:66,Công giáo:8,Anh giáo:4,Hồi giáo:2,Hindu giáo:1,Tín ngưỡng truyền thống:4,Không tôn giáo:15', BW: 'Tin Lành:70,Công giáo:5,Anh giáo:4,Tín ngưỡng truyền thống:6,Không tôn giáo:15', ZM: 'Tin Lành:75,Công giáo:20,Khác:5', ZW: 'Tin Lành:65,Công giáo:9,Anh giáo:10,Tín ngưỡng truyền thống:8,Không tôn giáo:8', MW: 'Tin Lành:65,Công giáo:17,Hồi giáo:13,Khác:5', NA: 'Tin Lành:80,Công giáo:17,Khác:3', LS: 'Tin Lành:70,Công giáo:28,Khác:2', SZ: 'Tin Lành:80,Công giáo:8,Tín ngưỡng truyền thống:10,Hồi giáo:1,Khác:1',
    MZ: 'Công giáo:28,Tin Lành:30,Hồi giáo:18,Tín ngưỡng truyền thống:10,Không tôn giáo:14', AO: 'Công giáo:56,Tin Lành:34,Tín ngưỡng truyền thống:5,Không tôn giáo:5', SS: 'Công giáo:30,Tin Lành:35,Tín ngưỡng truyền thống:30,Hồi giáo:5', MG: 'Tin Lành:42,Công giáo:40,Tín ngưỡng truyền thống:15,Hồi giáo:3', CV: 'Công giáo:85,Tin Lành:11,Không tôn giáo:4', GW: 'Hồi giáo:45,Công giáo:15,Tin Lành:8,Tín ngưỡng truyền thống:30,Không tôn giáo:2', ST: 'Công giáo:55,Tin Lành:30,Không tôn giáo:15', TL: 'Công giáo:97,Tin Lành:2,Hồi giáo:1',
    // Bắc Phi, Trung Đông
    EG: 'Hồi giáo:90,Chính thống giáo Đông phương:9,Công giáo:1', LB: 'Hồi giáo:60,Công giáo:26,Chính thống giáo Đông phương:9,Khác:5', SY: 'Hồi giáo:90,Chính thống giáo Đông phương:5,Công giáo:2,Khác:3', IQ: 'Hồi giáo:98,Công giáo:1,Khác:1', JO: 'Hồi giáo:97,Chính thống giáo Đông phương:2,Khác:1', PS: 'Hồi giáo:94,Chính thống giáo Đông phương:1,Tin Lành:1,Khác:4',
    SD: 'Hồi giáo:97,Công giáo:1,Chính thống giáo Đông phương:1,Khác:1', DZ: 'Hồi giáo:99,Khác:1', TN: 'Hồi giáo:99,Khác:1', LY: 'Hồi giáo:97,Khác:3', MA: 'Hồi giáo:99,Khác:1', MR: 'Hồi giáo:100', SA: 'Hồi giáo:98,Khác:2', KW: 'Hồi giáo:97,Khác:3', BH: 'Hồi giáo:90,Hindu giáo:5,Công giáo:3,Khác:2', OM: 'Hồi giáo:95,Hindu giáo:3,Khác:2', YE: 'Hồi giáo:99,Khác:1', KM: 'Hồi giáo:99,Khác:1', MV: 'Hồi giáo:100',
    // Balkan
    HR: 'Công giáo:86,Chính thống giáo Đông phương:4,Hồi giáo:1,Không tôn giáo:7,Khác:2', SI: 'Công giáo:58,Chính thống giáo Đông phương:2,Hồi giáo:2,Không tôn giáo:35,Khác:3', RS: 'Chính thống giáo Đông phương:85,Công giáo:5,Hồi giáo:3,Không tôn giáo:5,Khác:2', BA: 'Hồi giáo:51,Chính thống giáo Đông phương:31,Công giáo:15,Không tôn giáo:3', ME: 'Chính thống giáo Đông phương:72,Hồi giáo:19,Công giáo:3,Không tôn giáo:6', MK: 'Chính thống giáo Đông phương:65,Hồi giáo:33,Khác:2',
    // Mỹ Latinh
    AR: 'Công giáo:77,Tin Lành:9,Không tôn giáo:12,Khác:2', BO: 'Công giáo:77,Tin Lành:16,Không tôn giáo:5,Khác:2', CL: 'Công giáo:67,Tin Lành:16,Không tôn giáo:16,Khác:1', CO: 'Công giáo:79,Tin Lành:13,Không tôn giáo:6,Khác:2', CR: 'Công giáo:76,Tin Lành:14,Không tôn giáo:9,Khác:1', CU: 'Công giáo:60,Tin Lành:5,Không tôn giáo:23,Khác:12', DO: 'Công giáo:68,Tin Lành:18,Không tôn giáo:12,Khác:2',
    EC: 'Công giáo:80,Tin Lành:13,Không tôn giáo:5,Khác:2', SV: 'Công giáo:50,Tin Lành:36,Không tôn giáo:12,Khác:2', GT: 'Công giáo:50,Tin Lành:41,Không tôn giáo:7,Khác:2', HN: 'Công giáo:46,Tin Lành:41,Không tôn giáo:11,Khác:2', MX: 'Công giáo:83,Tin Lành:8,Không tôn giáo:5,Khác:4', NI: 'Công giáo:50,Tin Lành:33,Không tôn giáo:15,Khác:2', PA: 'Công giáo:70,Tin Lành:17,Không tôn giáo:11,Khác:2',
    PY: 'Công giáo:89,Tin Lành:7,Không tôn giáo:2,Khác:2', PE: 'Công giáo:76,Tin Lành:17,Không tôn giáo:5,Khác:2', UY: 'Công giáo:47,Tin Lành:11,Không tôn giáo:40,Khác:2', VE: 'Công giáo:71,Tin Lành:17,Không tôn giáo:10,Khác:2',
    // Nước giàu có nhóm tên trộn nhiều nguồn gốc di cư làm tỷ lệ Hồi giáo bị đẩy lên gấp đôi; dùng tỷ lệ cả nước
    DE: 'Không tôn giáo:38,Công giáo:27,Tin Lành:25,Hồi giáo:6,Khác:4', FR: 'Công giáo:47,Không tôn giáo:40,Hồi giáo:8,Tin Lành:2,Khác:3', CH: 'Công giáo:36,Tin Lành:25,Không tôn giáo:30,Hồi giáo:5,Khác:4', SE: 'Tin Lành:52,Không tôn giáo:37,Hồi giáo:6,Công giáo:2,Khác:3', BE: 'Công giáo:55,Không tôn giáo:30,Hồi giáo:7,Tin Lành:3,Khác:5', GB: 'Anh giáo:22,Công giáo:9,Tin Lành:11,Không tôn giáo:38,Hồi giáo:7,Hindu giáo:2,Khác:11',
    US: 'Tin Lành:42,Công giáo:21,Không tôn giáo:27,Do Thái giáo:2,Hồi giáo:1,Hindu giáo:1,Phật giáo:1,Khác:5', CA: 'Công giáo:30,Tin Lành:20,Anh giáo:6,Không tôn giáo:35,Hồi giáo:4,Hindu giáo:2,Phật giáo:1,Khác:2', AU: 'Công giáo:23,Anh giáo:13,Tin Lành:12,Không tôn giáo:39,Hồi giáo:3,Hindu giáo:3,Phật giáo:3,Khác:4', NZ: 'Anh giáo:12,Công giáo:10,Tin Lành:15,Không tôn giáo:48,Hindu giáo:3,Phật giáo:2,Hồi giáo:1,Khác:9',
    // Thái Bình Dương
    PG: 'Tin Lành:65,Công giáo:27,Tín ngưỡng truyền thống:6,Khác:2', KI: 'Công giáo:56,Tin Lành:33,Khác:11', WS: 'Tin Lành:70,Công giáo:20,Khác:10', TO: 'Tin Lành:85,Công giáo:15', SB: 'Tin Lành:55,Công giáo:20,Anh giáo:20,Khác:5', VU: 'Tin Lành:70,Công giáo:15,Anh giáo:12,Khác:3', FM: 'Công giáo:55,Tin Lành:42,Khác:3', MH: 'Tin Lành:80,Công giáo:10,Khác:10', NR: 'Tin Lành:65,Công giáo:30,Khác:5', PW: 'Công giáo:50,Tin Lành:45,Khác:5', TV: 'Tin Lành:95,Khác:5'
  };
  // Giáo phái mặc định cho "Kitô giáo" chung chung theo nước/nhóm khi bảng trên không có sẵn (Công giáo, Tin Lành, Chính thống giáo Đông phương, Anh giáo)
  var DEN = {
    US: [35, 58, 2, 5], CA: [53, 36, 4, 7], AU: [44, 20, 3, 33], NZ: [28, 40, 2, 30], GB: [11, 14, 1, 74], IE: [88, 4, 3, 5], DE: [47, 48, 5, 0], NL: [50, 45, 2, 3], CH: [52, 45, 2, 1], AT: [75, 20, 5, 0], BE: [90, 6, 2, 2], FR: [93, 5, 2, 0], ES: [97, 2, 1, 0], PT: [95, 4, 1, 0], IT: [96, 2, 2, 0], PL: [95, 2, 3, 0], HU: [60, 35, 5, 0], CZ: [80, 15, 5, 0], SK: [75, 20, 5, 0],
    SE: [5, 93, 2, 0], NO: [5, 93, 2, 0], DK: [3, 96, 1, 0], FI: [1, 96, 3, 0], IS: [3, 96, 1, 0], EE: [2, 35, 63, 0], LV: [25, 35, 40, 0], LT: [87, 5, 8, 0], RU: [1, 3, 96, 0], UA: [10, 3, 87, 0], BY: [10, 3, 87, 0], RO: [10, 6, 84, 0], BG: [2, 3, 95, 0], GR: [2, 1, 97, 0], CY: [1, 1, 97, 1], GE: [1, 1, 98, 0], AM: [3, 2, 95, 0],
    PH: [88, 12, 0, 0], KR: [40, 60, 0, 0], IN: [55, 40, 5, 0], ID: [30, 70, 0, 0], LK: [85, 15, 0, 0], VN: [60, 40, 0, 0], JP: [20, 70, 10, 0], CN: [25, 75, 0, 0], BR: [75, 25, 0, 0], HT: [65, 35, 0, 0], JM: [3, 85, 0, 12], TT: [30, 55, 1, 14]
  };
  var REGION = { afr: [38, 55, 2, 5], afw: [25, 62, 1, 12], afe: [35, 55, 2, 8], afs: [15, 70, 1, 14], ar: [35, 10, 50, 5], es_la: [80, 20, 0, 0], car: [20, 65, 0, 15], pac: [30, 62, 0, 8], ao: [55, 40, 0, 5] };
  function weights(l) {
    if (!l || l.mode === 'vn' || l.country === 'VN' || !l.country) return null; var s = T[l.country]; return s || null;
  }
  function denom(l, key, hash) {
    var c = l && l.country, d = DEN[c] || REGION[l && l.pool] || null; if (!d) return null;
    var sum = d[0] + d[1] + d[2] + d[3]; if (!(sum > 0)) return null; var x = (hash % 1000) / 1000 * sum, labels = ['Công giáo', 'Tin Lành', 'Chính thống giáo Đông phương', 'Anh giáo'];
    for (var i = 0; i < 4; i++) { x -= d[i]; if (x < 0) return labels[i]; } return labels[0];
  }
  E.REL945 = { TABLE: T, DEN: DEN, REGION: REGION, weights: weights, denom: denom };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
