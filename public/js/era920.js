/* Một Đời — dữ liệu nền 1950–2023 và nhân khẩu bổ sung đến 2025.
   Mở rộng khung "năm thế giới = năm sinh + tuổi" của era917.js/era902.js; không thêm hệ thống riêng:
   · Tử vong: buildMort/qBase của engine.js được nạp lại mỗi năm với tuổi thọ và tử vong dưới 5 tuổi CỦA NĂM ĐÓ (trước đây cả đời dùng số liệu hiện nay).
     Đời sinh năm Y: tuổi thọ lúc sinh = tuổi thọ hiện hành của nước + (chuỗi UN năm Y − chuỗi UN 2023); năm sau đó cộng chênh lệch của chuỗi UN theo năm. Từ 2023 trở đi trở lại đúng số liệu hiện nay.
   · Sinh con: tổng tỷ suất sinh theo năm (UN WPP) dùng cho cỡ gia đình lúc sinh và số con mong muốn lúc quyết định (E.ERA920.tfrNow).
   · Đô thị hóa theo năm (xác suất sinh ở đô thị), mức phát triển (GDP bình quân tương đối so với 2022, Maddison) cho các ngưỡng phát triển trong engine.js (E.devGdp):
     lao động trẻ em, tảo hôn, lao phổi, tiêm chủng, học tập, nghề của mẹ.
   · Mức phổ cập điện thoại di động và internet THEO NƯỚC VÀ NĂM, dùng cho era902.js (văn bản/cảnh/nghề sai thời) và access890.js.
   · Xác suất chọn nước dùng số sinh từng năm. 1900–1949 dùng tỷ trọng 1950. Năm 2024–2025 dùng dự phóng WPP 2024.
   Giới hạn trung thực: số liệu quốc gia (không phân theo vùng, thành thị/nông thôn hay nhóm người); chính sách, chiến tranh, tên nước thuộc các lớp khác. Mọi hệ số mô hình là tham số trò chơi. */
(function (G) {
  'use strict';
  var E = G.E, D = G.ERA920_DATA; if (!E || !D) return;
  var A = G.ERA_BIRTHS980, FROM = D.from, TO = D.to, N = TO - FROM + 1, cache = {}, mortCache = {}, birthWeights = {}, birthSeries = {};
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
  function birthDistribution(y) {
    var point = A ? Math.max(A.from, Math.min(A.to, Number.isFinite(y) ? Math.trunc(y) : A.to)) : null;
    if (birthWeights[point]) return birthWeights[point];
    var counts = {}, total = 0;
    G.W.C.forEach(function (c) {
      var series = A && A.births[c.code] && (birthSeries[c.code] || (birthSeries[c.code] = dec(A.births[c.code], 1)));
      counts[c.code] = series ? series[point - A.from] : Math.round(c.births * 1000);
      total += counts[c.code];
    });
    return (birthWeights[point] = { year: point, projected: !!A && point > A.estimatesTo, counts: counts, total: total });
  }
  function demography(cc, y) {
    var recent = A && A.recent[cc];
    if (recent && y > A.estimatesTo) {
      var point = Math.min(A.to, Math.trunc(y)), v = recent[point - A.estimatesTo - 1];
      return { e0: v[0], tfr: v[1], u5: v[2], year: point, projected: true };
    }
    var s = S(cc), i = idx(y);
    if (!s || !(s.e[i] > 0 && s.t[i] > 0 && s.u[i] > 0)) return null;
    return { e0: s.e[i], tfr: s.t[i], u5: s.u[i], year: Math.max(FROM, Math.min(TO, y)), projected: false };
  }
  // --- tra cứu ---
  function at(cc, y) {
    var s = S(cc); if (!s) return null; var i = idx(y);
    var d = demography(cc, y);
    return { e0: d ? d.e0 : s.e[i], tfr: d ? d.tfr : s.t[i], u5: d ? d.u5 : s.u[i], demographicYear: d && d.year, projected: !!(d && d.projected), urban: s.r[i], gdpRel: s.g[i], mobile: s.m[i], fixed: s.p[i], internet: s.n[i], year: Math.max(FROM, Math.min(TO, y)), u5Observed: !(d && d.projected) && s.uf != null && y >= s.uf, gdpObserved: D.c[cc].gf != null && y >= D.c[cc].gf, clamped: y < FROM || y > TO };
  }
  function mobile(cc, y) { var s = S(cc); return s ? s.m[idx(y)] : null; }
  function net(cc, y) { var s = S(cc); return s ? s.n[idx(y)] : null; }
  // --- 1. lúc sinh: gắn nhãn đời có số liệu theo năm và đặt lại tuổi thọ, tử vong trẻ em, sinh con ---
  function birth(l) {
    var by = l.birthYear; if (by == null || by > (A ? A.to : TO) || by < 1900) return;
    var d = demography(l.country, by), s = S(l.country), z = N - 1;
    if (!d || !s || by > TO && !d.projected) return;
    l.era920 = { cc: l.country, by: by, y: null };
    var referenceE = d.projected ? l.e0nat : s.e[z];
    var referenceU = d.projected ? (l.country === 'VN' ? G.VN.STATS.u5 : G.W.BY[l.country].u5) : s.u[z];
    var de = d.e0 - referenceE - preE(by);
    l.e0 = Math.max(25, l.e0 + de); if (l.e0nat != null) l.e0nat = Math.max(25, l.e0nat + de);
    l.u5 = Math.min(450, l.u5 * d.u5 / referenceU * preU(by));
    l.tfr = l.country === 'VN' ? Math.min(8.5, l.tfr * d.tfr / s.t[z]) : d.tfr;
  }
  // xác suất sinh ở đô thị theo năm: tỷ lệ đô thị hóa năm sinh / hiện nay (>=0.15 để không triệt tiêu)
  function urbanK(l) {
    var by = l.birthYear; if (by == null || by > (A ? A.to : TO) || by < 1900) return 1;
    var s = S(l.country); if (!s) return 1; return Math.max(0.15, Math.min(1.2, s.r[idx(by)] / s.r[N - 1]));
  }
  // --- 2. mỗi năm: nạp lại đường tử vong theo năm thế giới ---
  function buildCached(e0, u5) {
    var k = Math.round(Math.max(25, e0) * 4) + ':' + Math.round(Math.log(Math.max(1, u5)) * 25);
    return mortCache[k] || (mortCache[k] = E.buildMort(Math.max(25, e0), Math.max(1, u5)));
  }
  function mortalityContext(l, cc, y) {
    var m = l.era920, current = demography(cc, y);
    if (cc !== l.country && current) {
      var offset = Number.isFinite(l.e0nat) ? l.e0 - l.e0nat : 0;
      return { e0: current.e0 + offset - preE(y), u5: current.u5 * preU(y), adjusted: true };
    }
    var origin = cc === l.country ? current : demography(l.country, y), birth = m && demography(l.country, m.by);
    return birth && origin ? {
      e0: l.e0 + origin.e0 - birth.e0 + preE(m.by) - preE(y),
      u5: l.u5 * origin.u5 / birth.u5 * preU(y) / preU(m.by),
      adjusted: true
    } : { e0: l.e0, u5: l.u5, adjusted: false };
  }
  function sexGap(l) { return Math.abs((l.e0sex != null ? l.e0sex : l.e0) - l.e0); }
  function refresh(l) {
    if (!l) return;
    var cc = E.H.resCode(l), y = worldYear(l), m = l.era920 || l.flags?.resMort980;
    if (!m && cc === l.country) return;
    if (!m) m = l.flags.resMort980 = {};
    if (m.y === y && m.resCC === cc) return;
    m.y = y; m.resCC = cc;
    var rates = mortalityContext(l, cc, y), e0 = rates.e0, u5 = rates.u5, h = sexGap(l);
    var build = rates.adjusted ? buildCached : E.buildMort;
    m.ka = rates.adjusted ? 1 - CAL.a * Math.max(0, Math.min(1, (CAL.e - e0) / CAL.w)) : 1;
    m.kc = rates.adjusted ? 1 - CAL.c * Math.max(0, Math.min(1, (u5 - CAL.u) / CAL.v)) : 1;
    l.mortM = build(e0 - h, u5); l.mortF = build(e0 + h, u5);
    l.mort = l.sex === 'F' ? l.mortF : l.mortM;
  }
  function parentMort(l, sex) {
    if (E.H.resCode(l) === l.country) return sex === 'F' ? l.mortF : l.mortM;
    var d = mortalityContext(l, l.country, worldYear(l)), h = sexGap(l);
    return (d.adjusted ? buildCached : E.buildMort)(d.e0 + (sex === 'F' ? h : -h), d.u5);
  }
  // Mức sinh địa phương ảnh hưởng tới khuynh hướng tự động của nhân vật.
  function tfrNow(l, cc) {
    cc = cc || E.H.resCode(l);
    if (cc === l.country && !l.era920) return l.tfr || 2;
    var d = demography(cc, worldYear(l));
    if (!d) return l.tfr || 2;
    if (cc !== l.country || cc !== 'VN') return d.tfr;
    var ref = demography(cc, l.era920.by);
    return Math.min(8.5, l.tfr * d.tfr / ref.tfr);
  }
  function familyTarget(l, r) {
    var f = l.flags, bias = f.familyBias980;
    if (!l.era920 && !Number.isFinite(bias) && E.H.resCode(l) === l.country) {
      if (r && !Number.isFinite(f.wantKids)) f.wantKids = Math.max(0, Math.round(tfrNow(l) + G.U.normal(r) * 0.9));
      return f.wantKids;
    }
    if (!Number.isFinite(bias)) {
      if (Number.isFinite(f.wantKids)) bias = f.wantKids - tfrNow(l, l.country);
      else bias = r ? G.U.normal(r) * 0.9 : 0;
      if (r) f.familyBias980 = bias;
    }
    var target = Math.max(0, Math.round(tfrNow(l) + bias));
    if (r) f.wantKids = target;
    return target;
  }
  // --- 4. mức phát triển theo năm cho ngưỡng trong engine.js ---
  function gdp(l) {
    var cc = E.H.resCode(l), destination = cc !== l.country && G.W.BY[cc];
    var base = destination ? destination.gdp : l.gdp;
    if (!l.era920 && !destination) return base;
    var s = S(cc);
    return s ? base * Math.min(1.25, s.g[idx(worldYear(l))]) : base;
  }
  // hệ số bù: engine cộng thêm tử vong từ bệnh nặng, tai nạn, tiêm chủng và sự kiện (hiệu chỉnh CAL ở mức tuổi thọ hiện nay). Ở mức tử vong cao (đời xưa) phần cộng thêm này làm kết quả vượt số liệu UN:
  // đo bằng mô phỏng 100 đời mỗi ca (VN 1950, NG 1960, IN 1950, JP 1950): trẻ chết trước 5 tuổi 29–42% so với 21–32%; hệ số giảm tuyến tính tới −22% (trẻ em, theo tử vong dưới 5) và −20% (người lớn, theo tuổi thọ) rồi bằng 1 ở mức hiện nay.
  var CAL = { a: 0.2, e: 76, w: 22, c: 0.22, u: 8, v: 50 };
  function cal(l, a) { var m = l.era920 || l.flags?.resMort980, k = m && (a < 5 ? m.kc : m.ka); return k == null ? 1 : k; }
  // Năm hôn nhân cùng giới có hiệu lực toàn quốc (đối chiếu bách khoa/Pew 15/11/2026; Canada 2005 là năm luật liên bang, Mexico 2022 là năm đủ các bang, Anh tính Anh và xứ Wales 2014)
  var SSM_Y = { NL: 2001, BE: 2003, ES: 2005, CA: 2005, ZA: 2006, NO: 2009, SE: 2009, PT: 2010, IS: 2010, AR: 2010, DK: 2012, BR: 2013, FR: 2013, UY: 2013, NZ: 2013, GB: 2014, LU: 2015, US: 2015, IE: 2015, CO: 2016, FI: 2017, MT: 2017, DE: 2017, AU: 2017, AT: 2019, EC: 2019, CR: 2020, CL: 2022, CH: 2022, SI: 2022, CU: 2022, MX: 2022, AD: 2023, EE: 2024, GR: 2024, LI: 2025, TH: 2025 };
  function ssmLegal(l, cc) { var m = l && l.era920; if (!m) return true; var y = SSM_Y[cc]; return y == null || worldYear(l) >= y; }
  function tfrModern(cc) { var s = S(cc); return s ? Math.max(0.7, Math.min(8.5, s.t[N - 1])) : null; }
  E.ERA920 = { birthDistribution: birthDistribution, demography: demography, familyTarget: familyTarget, parentMort: parentMort, tfrModern: tfrModern, ssmLegal: ssmLegal, SSM_Y: SSM_Y, cal: cal, CAL: CAL, FROM: FROM, TO: TO, data: D, at: at, mobile: mobile, net: net, birth: birth, urbanK: urbanK, refresh: refresh, tfrNow: tfrNow, gdp: gdp, isEra: isEra, worldYear: worldYear, series: S };
  E.devGdp = gdp;
})(globalThis.G);
