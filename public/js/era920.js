/* Một Đời — 9.2 (giai đoạn 2 bối cảnh lịch sử): số liệu quốc gia THEO NĂM 1950–2023 cho đời sinh trước 2024.
   Mở rộng khung "năm thế giới = năm sinh + tuổi" của era917.js/era902.js; không thêm hệ thống riêng:
   · Tử vong: buildMort/qBase của engine.js được nạp lại mỗi năm với tuổi thọ và tử vong dưới 5 tuổi CỦA NĂM ĐÓ (trước đây cả đời dùng số liệu hiện nay).
     Đời sinh năm Y: tuổi thọ lúc sinh = tuổi thọ hiện hành của nước + (chuỗi UN năm Y − chuỗi UN 2023); năm sau đó cộng chênh lệch của chuỗi UN theo năm. Từ 2023 trở đi trở lại đúng số liệu hiện nay.
   · Sinh con: tổng tỷ suất sinh theo năm (UN WPP) dùng cho cỡ gia đình lúc sinh và số con mong muốn lúc quyết định (E.ERA920.tfrNow).
   · Đô thị hóa theo năm (xác suất sinh ở đô thị), mức phát triển (GDP bình quân tương đối so với 2022, Maddison) cho các ngưỡng phát triển trong engine.js (E.devGdp):
     lao động trẻ em, tảo hôn, lao phổi, tiêm chủng, học tập, nghề của mẹ.
   · Mức phổ cập điện thoại di động và internet THEO NƯỚC VÀ NĂM, dùng cho era902.js (văn bản/cảnh/nghề sai thời) và access890.js.
   · Đời sinh từ 2024 trở đi không đổi một byte (đường tắt). Đời sinh 1900–1949: chưa có số liệu theo năm của nước → dùng mức 1950 (đã ghi rõ trên màn thiết lập).
   Giới hạn trung thực: số liệu quốc gia (không phân theo vùng, thành thị/nông thôn hay nhóm người); chính sách, chiến tranh, tên nước thuộc các lớp khác. Mọi hệ số mô hình là tham số trò chơi. */
(function (G) {
  'use strict';
  var E = G.E, D = G.ERA920_DATA; if (!E || !D) return;
  var FROM = D.from, TO = D.to, N = TO - FROM + 1, cache = {}, mortCache = {};
  function dec(s, sc) { var p = String(s).split(','), v = +p[0], o = [v / sc], i; for (i = 1; i < p.length; i++) { v += +p[i]; o.push(v / sc); } return o; }
  function S(cc) {
    if (cache[cc] !== undefined) return cache[cc];
    var c = D.c[cc]; if (!c) return (cache[cc] = null);
    return (cache[cc] = { e: dec(c.e, D.sc.e), t: dec(c.t, D.sc.t), u: dec(c.u, D.sc.u), r: dec(c.r, D.sc.r), g: dec(c.g, D.sc.g), m: dec(c.m, D.sc.m), p: dec(c.p, D.sc.p), n: dec(c.n, D.sc.n), uf: c.uf, gf: c.gf });
  }
  function worldYear(l) { return l && l.birthYear != null ? l.birthYear + (l.age || 0) : 9999; }
  function idx(y) { return y < FROM ? 0 : y > TO ? N - 1 : y - FROM; }
  // 9.5: trước 1950 chưa có chuỗi UN theo nước; thay vì dùng nguyên mức 1950, lùi dần theo xu hướng toàn cầu (tuổi thọ lúc sinh khoảng 32 năm 1900 và 46–47 năm 1950, Our World in Data/UN: khoảng 0,3 năm mỗi năm; tử vong dưới 5 tuổi cao hơn khoảng 1,2% mỗi năm lùi). Đây là hệ số mô hình, không phải số liệu từng nước.
  function preE(y) { return Math.min(15, Math.max(0, FROM - y) * 0.3); }
  function preU(y) { return 1 + Math.min(0.7, Math.max(0, FROM - y) * 0.012); }
  function isEra(l) { return !!(l && l.era920); }
  // --- tra cứu ---
  function at(cc, y) {
    var s = S(cc); if (!s) return null; var i = idx(y);
    return { e0: s.e[i], tfr: s.t[i], u5: s.u[i], urban: s.r[i], gdpRel: s.g[i], mobile: s.m[i], fixed: s.p[i], internet: s.n[i], year: Math.max(FROM, Math.min(TO, y)), u5Observed: s.uf != null && y >= s.uf, gdpObserved: D.c[cc].gf != null && y >= D.c[cc].gf, clamped: y < FROM || y > TO };
  }
  function mobile(cc, y) { var s = S(cc); return s ? s.m[idx(y)] : null; }
  function net(cc, y) { var s = S(cc); return s ? s.n[idx(y)] : null; }
  // --- 1. lúc sinh: gắn nhãn đời có số liệu theo năm và đặt lại tuổi thọ, tử vong trẻ em, sinh con ---
  function birth(l) {
    var by = l.birthYear; if (by == null || by > TO || by < 1900) return;
    var s = S(l.country); if (!s) return;
    var i = idx(by), z = N - 1, de = s.e[i] - s.e[z];
    l.era920 = { cc: l.country, by: by, y: null };
    de -= preE(by); l.e0 = Math.max(25, l.e0 + de); if (l.e0nat != null) l.e0nat = Math.max(25, l.e0nat + de);
    l.u5 = Math.min(450, l.u5 * s.u[i] / s.u[z] * preU(by));
    l.tfr = l.country === 'VN' ? Math.min(8.5, l.tfr * s.t[i] / s.t[z]) : s.t[i]; // trần 8,5 con: mức cao nhất trong số liệu UN
  }
  // xác suất sinh ở đô thị theo năm: tỷ lệ đô thị hóa năm sinh / hiện nay (>=0.15 để không triệt tiêu)
  function urbanK(l) {
    var by = l.birthYear; if (by == null || by > TO || by < 1900) return 1;
    var s = S(l.country); if (!s) return 1; return Math.max(0.15, Math.min(1.2, s.r[idx(by)] / s.r[N - 1]));
  }
  // --- 2. mỗi năm: nạp lại đường tử vong theo năm thế giới ---
  function buildCached(e0, u5) {
    var k = Math.round(Math.max(25, e0) * 4) + ':' + Math.round(Math.log(Math.max(1, u5)) * 25);
    return mortCache[k] || (mortCache[k] = E.buildMort(Math.max(25, e0), Math.max(1, u5)));
  }
  function refresh(l) {
    var m = l && l.era920; if (!m) return;
    var y = worldYear(l); if (m.y === y) return; m.y = y;
    var s = S(m.cc); if (!s) return;
    var i = idx(y), b = idx(m.by), e0 = l.e0 + (s.e[i] - s.e[b]) + (preE(m.by) - preE(y)), u5 = l.u5 * (s.u[i] / s.u[b]) * (preU(y) / preU(m.by)), h = Math.abs((l.e0sex != null ? l.e0sex : l.e0) - l.e0);
    m.ka = 1 - CAL.a * Math.max(0, Math.min(1, (CAL.e - e0) / CAL.w)); m.kc = 1 - CAL.c * Math.max(0, Math.min(1, (u5 - CAL.u) / CAL.v)); // bù phần tử vong cộng thêm của engine ở mức tử vong cao (xem cal)
    l.mort = buildCached(l.e0sex != null && l.sex === 'F' ? e0 + h : e0 - h, u5);
    l.mortM = buildCached(e0 - h, u5); l.mortF = buildCached(e0 + h, u5);
  }
  // --- 3. số con mong muốn theo tỷ suất sinh của năm quyết định ---
  function tfrNow(l) {
    var m = l && l.era920; if (!m) return l.tfr; var s = S(m.cc); if (!s) return l.tfr;
    var i = idx(worldYear(l)), b = idx(m.by);
    return m.cc === 'VN' ? Math.min(8.5, l.tfr * s.t[i] / s.t[b]) : s.t[i];
  }
  // --- 4. mức phát triển theo năm cho ngưỡng trong engine.js ---
  function gdp(l) { var m = l && l.era920; if (!m) return l.gdp; var s = S(m.cc); if (!s) return l.gdp; return l.gdp * Math.min(1.25, s.g[idx(worldYear(l))]); }
  // hệ số bù: engine cộng thêm tử vong từ bệnh nặng, tai nạn, tiêm chủng và sự kiện (hiệu chỉnh CAL ở mức tuổi thọ hiện nay). Ở mức tử vong cao (đời xưa) phần cộng thêm này làm kết quả vượt số liệu UN:
  // đo bằng mô phỏng 100 đời mỗi ca (VN 1950, NG 1960, IN 1950, JP 1950): trẻ chết trước 5 tuổi 29–42% so với 21–32%; hệ số giảm tuyến tính tới −22% (trẻ em, theo tử vong dưới 5) và −20% (người lớn, theo tuổi thọ) rồi bằng 1 ở mức hiện nay.
  var CAL = { a: 0.2, e: 76, w: 22, c: 0.22, u: 8, v: 50 };
  function cal(l, a) { var m = l.era920, k = m && (a < 5 ? m.kc : m.ka); return k == null ? 1 : k; }
  // Năm hôn nhân cùng giới có hiệu lực toàn quốc (đối chiếu bách khoa/Pew 15/11/2026; Canada 2005 là năm luật liên bang, Mexico 2022 là năm đủ các bang, Anh tính Anh và xứ Wales 2014)
  var SSM_Y = { NL: 2001, BE: 2003, ES: 2005, CA: 2005, ZA: 2006, NO: 2009, SE: 2009, PT: 2010, IS: 2010, AR: 2010, DK: 2012, BR: 2013, FR: 2013, UY: 2013, NZ: 2013, GB: 2014, LU: 2015, US: 2015, IE: 2015, CO: 2016, FI: 2017, MT: 2017, DE: 2017, AU: 2017, AT: 2019, EC: 2019, CR: 2020, CL: 2022, CH: 2022, SI: 2022, CU: 2022, MX: 2022, AD: 2023, EE: 2024, GR: 2024, LI: 2025, TH: 2025 };
  function ssmLegal(l, cc) { var m = l && l.era920; if (!m) return true; var y = SSM_Y[cc]; return y == null || worldYear(l) >= y; }
  function tfrModern(cc) { var s = S(cc); return s ? Math.max(0.7, Math.min(8.5, s.t[N - 1])) : null; }
  E.ERA920 = { tfrModern: tfrModern, ssmLegal: ssmLegal, SSM_Y: SSM_Y, cal: cal, CAL: CAL, FROM: FROM, TO: TO, data: D, at: at, mobile: mobile, net: net, birth: birth, urbanK: urbanK, refresh: refresh, tfrNow: tfrNow, gdp: gdp, isEra: isEra, worldYear: worldYear, series: S };
  E.devGdp = gdp;
})(globalThis.G);
