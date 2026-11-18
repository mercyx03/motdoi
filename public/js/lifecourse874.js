/* 8.10.77: đối chiếu với 1in8b Engine (nguồn: WHO GHE, World Bank WDI, UN WPP).
   1) Nguyên nhân qua đời theo nước, tuổi và giới: tỷ trọng ba nhóm (truyền nhiễm–thai sản–dinh dưỡng / bệnh không lây / chấn thương)
      của từng nước so với thế giới; trong nhóm, tai nạn giao thông, bạo lực, lao, sốt rét, HIV, tiêu chảy, ngộ độc theo tỷ lệ của nước đó.
      Thói quen (rượu, ma túy, biết bơi, thuốc lá) và bệnh đang mắc vẫn được tính. Người thân dùng cùng cơ chế.
   2) Điện lưới tại nhà: xác suất có điện theo nước, năm, thành thị/nông thôn và nhóm thu nhập; nhà chưa có điện được kéo điện dần
      theo tốc độ phủ điện thực tế của nước đó. Khi chưa có điện, trẻ học bài dưới đèn dầu; ngày có điện được ghi vào ký ức. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, D = E.WDI874;
  if (!D) return;
  var W = D.world;
  var TROPIC = /^(VN|TH|KH|LA|MM|ID|PH|MY|SG|BN|TL|IN|BD|LK|NP|PK|BR|MX|CO|VE|PE|EC|BO|PY|NI|HN|GT|SV|CR|PA|CU|DO|HT|JM|PR|TT|NG|GH|CI|SN|ML|BF|NE|CM|CD|CG|GA|AO|KE|TZ|UG|RW|BI|MZ|MG|ZM|ZW|MW|SD|SS|ET|SO|ER|DJ|YE|FJ|PG|SB|VU)$/;
  var EAST = /^(VN|CN|KR|KP|JP|MN|TW|HK|MO|TH|KH|LA|MM)$/;
  function data(code) { return code && D.health[code] && D.health[code].comm != null ? D.health[code] : null; }
  function rel(c, k, cap) { var v = c[k], w = W[k]; if (v == null || !w) return 1; return Math.min(cap || 6, Math.max(0.05, v / w)); }
  function pick(r, o) { var t = 0, k; for (k in o) if (o[k] > 0) t += o[k]; if (t <= 0) return null; var x = r() * t; for (k in o) if (o[k] > 0) { x -= o[k]; if (x <= 0) return k; } for (k in o) if (o[k] > 0) return k; return null; }
  // tỷ trọng nhóm nguyên nhân theo tuổi ở mức thế giới (GHE 2019 làm tròn), nhân với độ lệch của nước
  function band(a) { return a < 1 ? [0.8, 0.15, 0.05] : a < 5 ? [0.55, 0.2, 0.25] : a < 15 ? [0.35, 0.3, 0.35] : a < 30 ? [0.2, 0.3, 0.5] : a < 50 ? [0.15, 0.6, 0.25] : a < 70 ? [0.08, 0.86, 0.06] : [0.07, 0.9, 0.03]; }
  function cause(ctx, a, r) {
    var c = data(ctx.code); if (!c) return null;
    var ncd = Math.max(5, 100 - c.comm - (c.inj || W.inj)), wn = 100 - W.comm - W.inj, b = band(a);
    var g = pick(r, { comm: b[0] * rel(c, 'comm'), ncd: b[1] * ncd / wn, inj: b[2] * rel(c, 'inj', 4) });
    var F = ctx.sex === 'F', o = {};
    if (g === 'comm') {
      if (a < 1) { o['biến chứng do sinh non'] = 3; o['nhiễm trùng sơ sinh'] = 2; o['ngạt khi sinh'] = 2; o['viêm phổi'] = 2; }
      else { o['viêm phổi'] = a >= 70 ? 5 : 3; if (a >= 15) { o['lao phổi'] = 1.2 * rel(c, 'tb'); o['HIV/AIDS'] = (c.hiv || 0) / Math.max(0.1, W.hiv) * (ctx.hivRisk != null ? ctx.hivRisk * 2 : 1); } }
      o['tiêu chảy cấp'] = (a < 5 ? 2 : a >= 70 ? 0.8 : 0.6) * rel(c, 'wash');
      if (c.mal > 1) o['sốt rét'] = (a < 5 ? 2.5 : 0.8) * rel(c, 'mal');
      if (a < 5) o['suy dinh dưỡng'] = 0.6 * rel(c, 'wash');
      if (a >= 1 && TROPIC.test(ctx.code)) o['sốt xuất huyết'] = a < 15 ? 0.6 : 0.2;
      if (F && a >= 15 && a < 50) o['biến chứng thai sản'] = 1.5 * rel(c, 'comm');
    } else if (g === 'inj') {
      o['tai nạn giao thông'] = (a < 5 ? 1.5 : 3) * rel(c, 'road');
      o['đuối nước'] = (a < 15 ? 3 : 0.8) * (ctx.swim ? 0.3 : 1);
      if (a >= 15) o['bạo lực'] = 1.2 * rel(c, 'hom', 10);
      if (a >= 18 && a < 65) o['tai nạn lao động'] = 1.2;
      o['té ngã'] = a >= 65 ? 3 : 0.4;
      o['hỏa hoạn, bỏng'] = 0.4;
      o['ngộ độc'] = 0.4 * rel(c, 'pois');
      if (ctx.drugs) o['sốc thuốc (quá liều ma túy)'] = 4;
    } else {
      var cv = rel(c, 'ncd3070', 2.5), alc = ctx.alcohol ? 4 : 1, smoke = ctx.smoke ? 1.6 : 1;
      if (a < 15) { if (a < 5) o['dị tật bẩm sinh'] = 3; o['ung thư máu'] = 1.5; o['bệnh tim bẩm sinh'] = a < 5 ? 1 : 0.4; }
      else if (a < 40) { o['ung thư'] = 2; o['bệnh tim'] = 1.2 * cv; o['đột quỵ'] = 0.6 * cv; o['xơ gan'] = 0.4 * alc; o['bệnh thận mạn'] = 0.3; }
      else if (a < 70) {
        o['nhồi máu cơ tim'] = 2.5 * cv; o['đột quỵ'] = 2.2 * cv * (EAST.test(ctx.code) ? 1.3 : 1); o['ung thư phổi'] = 1.6 * smoke;
        o['ung thư gan'] = EAST.test(ctx.code) ? 2 : 0.6; o['ung thư dạ dày'] = EAST.test(ctx.code) ? 1.4 : 0.7; if (F) o['ung thư vú'] = 1.4; else o['ung thư tuyến tiền liệt'] = 0.5;
        o['xơ gan'] = 0.8 * alc; o['biến chứng tiểu đường'] = 1; o['bệnh phổi tắc nghẽn mạn tính'] = 0.8 * smoke; o['bệnh thận mạn'] = 0.6;
      } else {
        o['đột quỵ'] = 3 * cv; o['nhồi máu cơ tim'] = 3 * cv; o['suy tim'] = 2; o['ung thư phổi'] = 1.5 * smoke; o['bệnh phổi tắc nghẽn mạn tính'] = 2 * smoke;
        o['Alzheimer'] = a > 80 ? 2 : 0.5; o['suy thận'] = 1; o['biến chứng tiểu đường'] = 1; o['tuổi già — ra đi thanh thản trong giấc ngủ'] = a > 85 ? 3 : 0.4;
      }
    }
    return pick(r, o);
  }
  function ctxOf(l, code, sex) {
    return { code: code, sex: sex, swim: !!(l && l.flags && l.flags.swim), smoke: !!(l && l.flags && l.flags.smoke), alcohol: !!(l && l.addict && l.addict.alcohol), drugs: !!(l && l.addict && l.addict.drugs), hivRisk: l && E.hivRisk ? E.hivRisk(l) : null };
  }
  function residence(l) { return E.resCode ? E.resCode(l) : (l.abroad && l.abroad.code) || l.country || 'VN'; }
  // nhân vật chính: giữ bệnh đang mắc như cũ; nước chưa có số liệu dùng bảng cũ
  function forLife(l, a, r, base) {
    if (!data(residence(l))) return base(l, a, r);
    if (l.ill && a >= 15 && r() < 0.75) return l.ill.f;
    return cause(ctxOf(l, residence(l), l.sex), a, r) || base(l, a, r);
  }
  // người thân: rượu, ma túy như cũ; người thân sống ở quê gốc dùng nước gốc
  var baseRel = H.deathCause;
  H.deathCause = function (age, r, vice, l, sex, code) {
    if (!l) return baseRel.apply(this, arguments);
    if (vice === 'alcohol' && r() < 0.5) return 'xơ gan do rượu';
    if (vice === 'drugs' && r() < 0.5) return 'sốc thuốc';
    var cc = code || l.country || 'VN';
    return (data(cc) && cause({ code: cc, sex: sex || (r() < 0.5 ? 'F' : 'M') }, age, r)) || baseRel(age, r);
  };

  // ---- điện lưới tại nhà ----
  function national(code, year) {
    var s = D.elec[code];
    if (!s) return D.health[code] || code === 'VN' ? 100 : null;
    var Y = D.elecYears, pts = [];
    s.forEach(function (v, i) { if (v != null) pts.push([Y[i], v]); });
    if (!pts.length) return null;
    if (year >= pts[pts.length - 1][0]) return pts[pts.length - 1][1];
    if (year <= pts[0][0]) {
      var slope = pts.length > 1 ? Math.max(0, (pts[1][1] - pts[0][1]) / (pts[1][0] - pts[0][0])) : 0;
      return Math.max(1, Math.min(100, pts[0][1] - slope * (pts[0][0] - year)));
    }
    for (var i = 1; i < pts.length; i++) if (year <= pts[i][0]) { var p = pts[i - 1], q = pts[i]; return p[1] + (q[1] - p[1]) * (year - p[0]) / (q[0] - p[0]); }
    return pts[pts.length - 1][1];
  }
  var QODDS = [0.55, 0.8, 1, 1.3, 1.9];
  function access(code, year, urban, q) {
    var n = national(code, year); if (n == null) return null; if (n >= 99.5) return 100;
    var h = D.health[code] || {}, last = national(code, 2023) || n, ratio = urban ? (h.elecU != null ? h.elecU / Math.max(1, last) : 1.1) : (h.elecR != null ? h.elecR / Math.max(1, last) : 0.85);
    var p = Math.max(0.5, Math.min(99.5, n * ratio)) / 100, odds = p / (1 - p) * QODDS[Math.max(1, Math.min(5, q || 3)) - 1];
    return 100 * odds / (1 + odds);
  }
  function homeCode(l) { return l.abroad && l.abroad.perm ? residence(l) : l.country || 'VN'; }
  function yearOf(l) { return l.birthYear + l.age; }
  function setup(l, r) {
    var p = access(homeCode(l), yearOf(l), !!l.urban, l.fam && l.fam.q);
    l.elec874 = { home: p == null || r() * 100 < p, since: null, lamp: 0 };
    if (l.elec874.home) l.elec874.since = l.age === 0 ? 0 : null;
    return l.elec874;
  }
  function yearly(l, r, log) {
    if (!l || !l.alive || !l.fam) return;
    var s = l.elec874 || setup(l, r); if (s.home) return;
    var code = homeCode(l), y = yearOf(l), now = access(code, y, !!l.urban, l.fam.q), before = access(code, y - 1, !!l.urban, l.fam.q);
    if (now == null || now >= 99.5) { s.home = true; s.since = l.age; return; }
    var hazard = Math.max(0.02, (now - before) / Math.max(1, 100 - before)) * (l.urban ? 1.5 : 1) * (l.age >= 18 && l.indep && l.money > (l.base || 1) * 6 ? 1.6 : 1);
    if (r() < Math.min(0.6, hazard)) {
      s.home = true; s.since = l.age;
      log(l.age < 18 ? 'Nhà bạn được kéo điện lưới. Tối đó cả nhà bật bóng đèn điện, không còn phải thắp đèn dầu.' : 'Nơi bạn ở được kéo điện lưới. Từ nay có đèn điện, quạt và có thể sạc điện thoại tại nhà.', 'good');
      if (H.mem) H.mem(l, l.age < 18 ? 'Tối đầu tiên nhà có điện, cả xóm sang xem bóng đèn sáng.' : 'Ngày nơi ở có điện lưới.', 3);
      if (l.st) l.st.hap = Math.min(100, (l.st.hap || 50) + 3);
      return;
    }
    if (l.age >= 6 && l.age <= 17 && l.school !== null && l.st) {
      s.lamp++; l.st.kno = Math.max(0, (l.st.kno || 0) - 0.6);
      if (s.lamp === 1) log('Nhà chưa có điện lưới; buổi tối bạn học bài dưới ánh đèn dầu.', 'neutral');
    }
  }
  E.HOOKS.year.push(yearly);
  E.LIFECOURSE874 = { yearly: yearly, cause: cause, forLife: forLife, national: national, access: access, setup: setup, data: data };
})(globalThis.G);
