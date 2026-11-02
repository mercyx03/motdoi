/* Một Đời — Làm đẹp (8.10.23): tóc, bấm khuyên, trang sức trong một mục.
   Lỗi đã sửa: trước đây có hai nơi đổi tóc không khớp nhau — "Tóc và hiến tóc" (health915: cờ đã nhuộm/đã tẩy dùng cho điều kiện hiến tóc)
   và "Danh tính" (identity919: màu nhuộm hiển thị). Nay mọi thay đổi tóc ghi vào một hồ sơ duy nhất l.flags.hair915 (độ dài, đã nhuộm,
   đã tẩy, level tẩy, màu đang nhuộm, kiểu, độ hư tổn); mục hiến tóc và mô tả ngoại hình đều đọc từ đây.
   · Tẩy tóc theo level 1–4 (mỗi lần nâng 1–2 level, hư tổn tăng; tóc quá yếu thì salon từ chối). Màu nhuộm cần nền đủ sáng:
     màu tối/nâu không cần tẩy, màu nổi cần level 2+, pastel/bạch kim cần level 3–4. Tóc tự nhiên sáng màu được tính sẵn level nền.
   · Tạo kiểu (cắt, uốn, duỗi, tết, highlight/ombré) có giá, thời gian giữ, hư tổn; phục hồi tóc giảm hư tổn. Tóc mọc ra là màu tự nhiên.
   · Bấm khuyên theo vị trí: trẻ vị thành niên cần cha mẹ đồng ý (dưới 16 chỉ dái tai); có thời gian lành, rủi ro viêm nhỏ; có thể tháo.
   · Trang sức: mua, đeo, bán lại (giá bán lại thấp hơn giá mua); bông tai cần lỗ tai đã lành. Giá là tham số trò chơi theo thu nhập cơ sở.
   Màu nhuộm, khuyên, trang sức không di truyền và không đổi ngoại hình tự nhiên (ID919). */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, W = G.W;
  if (!X) return;
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; return h >>> 0; }
  function u(seed) { return hash(seed) / 4294967296; }
  function mo(l, v) { return H.money(l, v); }
  function k(l) { var b = W.BY[H.resCode(l)]; return Math.max(0.6, Math.min(2.5, (b ? b.gdp : 10) / 15)); }
  // Hồ sơ tóc dùng chung (khởi tạo giống health915 để không lệch dữ liệu).
  function hair(l) {
    var h = l.flags.hair915; if (!h) { var x = u(l.id + ':hair915'); h = l.flags.hair915 = { len: Math.round(5 + x * (l.sex === 'F' ? 40 : 8)), dyed: false, bleached: false, at: l.age }; }
    if (h.lift == null) { h.lift = h.bleached ? 2 : 0; h.dmg = h.bleached ? 30 : 0; h.color = h.dyed ? (h.bleached ? 'sáng màu' : 'nâu') : null; h.style = h.style || null; var old = l.flags.id919 && l.flags.id919.dye; if (old && old.hair) { h.color = old.hair; h.dyed = true; delete old.hair; } }
    return h;
  }
  function natLift(l) { var p = E.ID919 && l.flags.id919 && l.flags.id919.pheno; return !p ? 0 : p.red ? 1 : p.hair < 0.34 ? 3 : p.hair < 0.54 ? 2 : p.hair < 0.66 ? 1 : 0; }
  function lift(l) { return Math.max(hair(l).lift, natLift(l)); }
  var COLORS = [['đen', 0], ['nâu hạt dẻ', 0], ['nâu socola', 0], ['đỏ rượu vang', 0], ['nâu caramel', 1], ['vàng mật ong', 2], ['đỏ tươi', 2], ['cam đồng', 2], ['xanh dương', 3], ['tím', 3], ['xanh rêu', 3], ['hồng pastel', 4], ['xám khói', 4], ['bạch kim', 4]];
  var STYLES = { cut: ['Cắt tỉa, tạo kiểu mới', 0.003, 0], bob: ['Cắt bob / tóc ngắn', 0.004, 0], perm: ['Uốn xoăn', 0.012, 12], straight: ['Duỗi thẳng', 0.012, 12], braid: ['Tết tóc / box braids', 0.01, 3], high: ['Highlight vài lọn', 0.01, 0], ombre: ['Nhuộm ombré', 0.015, 0] };
  function bleachWhy(l, n) { var h = hair(l); if (l.age < 14) return 'Chưa đủ tuổi để tẩy tóc'; if (h.len < 3) return 'Tóc quá ngắn'; if (lift(l) >= 4) return 'Đã ở level sáng nhất'; if (h.dmg + n * 18 > 95) return 'Tóc đang quá yếu; salon khuyên phục hồi trước'; if (h.bleachAt === l.age && h.liftYear + n > 2) return 'Một năm không nên tẩy quá 2 level'; return true; }
  function cost(l, x) { return l.base * x * k(l); }
  function payWhy(l, c) { return l.indep ? (l.money >= c ? true : 'Chưa đủ tiền') : l.fam && l.fam.q <= 2 && c > l.base * 0.01 ? 'Gia đình chưa đồng ý khoản này' : true; }
  function pay(l, c, why) { H.cash(l, -c, why + (l.indep ? '' : ' (bố mẹ chi)')); }
  // ---- khuyên, trang sức ----
  var PIERCE = { lobe: ['dái tai', 1, 0.01], helix: ['vành tai', 1, 0.03], nose: ['mũi', 1, 0.03], brow: ['chân mày', 1, 0.04], lip: ['môi', 1, 0.04], navel: ['rốn', 2, 0.05] };
  var JEWEL = { ring: ['Nhẫn bạc', 0.01, null], chain: ['Dây chuyền vàng 18K', 0.08, null], studs: ['Bông tai vàng', 0.04, 'lobe'], diamond: ['Bông tai kim cương', 0.6, 'lobe'], cuff: ['Khuyên vành tai bạc', 0.008, 'helix'], nosering: ['Khuyên mũi titan', 0.006, 'nose'], watch: ['Đồng hồ cao cấp', 1.2, null], bracelet: ['Vòng tay ngọc', 0.15, null] };
  function bs(l) { var s = l.flags.beauty919; if (!s || typeof s !== 'object') s = l.flags.beauty919 = { pierce: {}, jewel: [], serial: 0 }; if (!s.pierce) s.pierce = {}; if (!Array.isArray(s.jewel)) s.jewel = []; return s; }
  function pierceWhy(l, pos) { var p = bs(l).pierce[pos]; if (p && !p.removed) return 'Đã bấm'; if (l.age < 16 && pos !== 'lobe') return 'Dưới 16 tuổi chỉ bấm dái tai, cần cha mẹ đồng ý'; if (l.age < 18 && !l.indep && l.fam && l.fam.q <= 1) return 'Cần cha mẹ đồng ý'; return true; }
  function healed(l, pos) { var p = bs(l).pierce[pos]; return !!(p && !p.removed && l.age >= p.healAt); }
  function desc(l) { var h = hair(l), s = bs(l), out = []; out.push('tóc dài ~' + h.len + ' cm' + (h.color ? ', nhuộm ' + h.color : '') + (h.lift ? ', đã tẩy level ' + h.lift : '') + (h.style ? ', kiểu ' + STYLES[h.style][0].toLowerCase() : '') + (h.dmg >= 60 ? ', tóc hư tổn' : '')); var ps = Object.keys(s.pierce).filter(function (p) { return !s.pierce[p].removed; }); if (ps.length) out.push('bấm khuyên ' + ps.map(function (p) { return PIERCE[p][0]; }).join(', ')); var wear = s.jewel.filter(function (j) { return j.wear && !j.sold; }); if (wear.length) out.push('đeo ' + wear.map(function (j) { return JEWEL[j.k][0].toLowerCase(); }).join(', ')); return out.join(' · '); }

  X.menu('beauty919', 'Làm đẹp: tóc, bấm khuyên, trang sức', function (l) { return X.reason(l, 6); }, function (l, d) {
    var a = d && d.arg || {}, h = hair(l);
    if (a.tab === 'color') return 'Màu nhuộm cần nền tóc đủ sáng. Nền hiện tại: level ' + lift(l) + (natLift(l) > h.lift ? ' (tóc tự nhiên sáng màu)' : '') + '. Tóc mọc ra là màu tự nhiên; màu nhuộm không di truyền.' + (function () { var lk = COLORS.filter(function (c) { return c[1] > lift(l); }); return lk.length ? '\nCần tẩy thêm mới nhuộm được: ' + lk.map(function (c) { return c[0] + ' (level ' + c[1] + ')'; }).join(', ') + '.' : ''; })();
    if (a.tab === 'bleach') return 'Tẩy tóc nâng nền sáng hơn để lên màu nổi. Mỗi lần tẩy làm tóc yếu đi (hư tổn ' + Math.round(h.dmg) + '/100); hư tổn cao dễ gãy rụng. Một năm không nên tẩy quá 2 level.';
    if (a.tab === 'pierce') return 'Bấm khuyên ở nơi có giấy phép, dụng cụ vô trùng. Vết bấm cần thời gian lành; có thể viêm nếu chăm sóc kém. Một số nơi làm việc có quy định trang phục.';
    if (a.tab === 'jewel') return 'Trang sức mua theo giá bán lẻ, bán lại thường thấp hơn. Bông tai cần lỗ tai đã lành.' + (bs(l).jewel.filter(function (j) { return !j.sold; }).length ? '\nĐang có: ' + bs(l).jewel.filter(function (j) { return !j.sold; }).map(function (j) { return JEWEL[j.k][0] + (j.wear ? ' (đang đeo)' : ''); }).join(', ') + '.' : '');
    return 'Ngoại hình hiện tại: ' + desc(l) + '. Màu tóc nhuộm, khuyên và trang sức là lựa chọn cá nhân, không đổi ngoại hình tự nhiên. Các mục hiến tóc dùng chung hồ sơ tóc này.';
  }, function (l, arg) {
    var h = hair(l), s = bs(l), out = [], tab = arg && arg.tab, back = { k: 'back', l: '← Làm đẹp', run: function (l, r) { X.next(l, 'beauty919', r, {}); } };
    if (!tab) {
      [['color', 'Nhuộm tóc'], ['bleach', 'Tẩy tóc (nâng level)'], ['style', 'Làm tóc, tạo kiểu'], ['pierce', 'Bấm khuyên'], ['jewel', 'Trang sức']].forEach(function (t) { out.push({ k: t[0], l: t[1], run: function (l, r) { X.next(l, 'beauty919', r, { tab: t[0] }); } }); });
      out.push({ k: 'care', l: 'Phục hồi, dưỡng tóc tại salon', h: mo(l, cost(l, 0.004)), why: h.dmg <= 5 ? 'Tóc đang khỏe' : payWhy(l, cost(l, 0.004)), run: function (l, r, log) { pay(l, cost(l, 0.004), 'Phục hồi tóc'); h.dmg = Math.max(0, h.dmg - 30); log('Tóc được phục hồi, mềm mượt hơn.', 'good'); } });
      if (h.color || h.lift) out.push({ k: 'natural', l: 'Nhuộm phủ về màu gần tự nhiên', h: mo(l, cost(l, 0.004)), why: payWhy(l, cost(l, 0.004)), run: function (l, r, log) { pay(l, cost(l, 0.004), 'Nhuộm phủ tóc'); h.color = null; h.dyed = true; log('Tóc được nhuộm phủ về tông gần màu tự nhiên; phần tóc mới mọc là màu thật.', 'neutral'); } });
      return out;
    }
    if (tab === 'color') COLORS.forEach(function (c) { var need = c[1], ok = lift(l) >= need; out.push({ k: 'c:' + c[0], l: (h.color === c[0] ? '✓ ' : '') + 'Nhuộm ' + c[0], h: mo(l, cost(l, 0.006 + need * 0.002)) + (need ? ' · cần nền level ' + need : ''), why: l.age < 12 ? 'Chưa đủ tuổi' : h.color === c[0] ? 'Đang dùng' : !ok ? 'Cần tẩy lên level ' + need + ' trước (đang ' + lift(l) + ')' : payWhy(l, cost(l, 0.006 + need * 0.002)), run: function (l, r, log) { pay(l, cost(l, 0.006 + need * 0.002), 'Nhuộm tóc ' + c[0]); h.color = c[0]; h.dyed = true; h.dmg = Math.min(100, h.dmg + 4); h.colorAt = l.age; if (h.happyAt !== l.age) { h.happyAt = l.age; H.fx(l, { hap: 2 }); } log('Bạn nhuộm tóc màu ' + c[0] + '.', 'good'); } }); });
    if (tab === 'bleach') [1, 2].forEach(function (n) { var c = cost(l, 0.008 * n); out.push({ k: 'b' + n, l: 'Tẩy nâng ' + n + ' level (lên level ' + Math.min(4, lift(l) + n) + ')', h: mo(l, c) + ' · hư tổn +' + n * 18, why: lift(l) + n > 4 ? 'Vượt level tối đa' : bleachWhy(l, n) !== true ? bleachWhy(l, n) : payWhy(l, c), run: function (l, r, log) { if (bleachWhy(l, n) !== true) return; pay(l, c, 'Tẩy tóc'); h.lift = Math.min(4, lift(l) + n); h.bleached = true; h.dyed = true; h.color = h.lift >= 3 ? 'vàng sáng sau tẩy' : 'nâu sáng sau tẩy'; if (h.bleachAt !== l.age) { h.bleachAt = l.age; h.liftYear = 0; } h.liftYear += n; h.dmg = Math.min(100, h.dmg + n * 18); log('Tóc được tẩy lên level ' + h.lift + '. Giờ có thể nhuộm các màu cần nền sáng.', 'neutral'); if (h.dmg >= 80 && u(l.id + ':break:' + l.age) < 0.4) { h.len = Math.max(3, h.len - 8); log('Tóc hư tổn nặng, gãy rụng một đoạn; nên phục hồi trước khi làm tiếp.', 'bad'); } } }); });
    if (tab === 'style') Object.keys(STYLES).forEach(function (sk) { var S = STYLES[sk], c = cost(l, S[1]); out.push({ k: 's:' + sk, l: (h.style === sk ? '✓ ' : '') + S[0], h: mo(l, c) + (S[2] ? ' · hư tổn +' + S[2] : ''), why: (sk === 'perm' || sk === 'straight' || sk === 'ombre' || sk === 'high') && l.age < 14 ? 'Chưa đủ tuổi' : sk === 'braid' && h.len < 10 || sk === 'bob' && h.len < 8 ? 'Tóc chưa đủ dài' : sk === 'ombre' && lift(l) < 2 ? 'Cần nền tẩy level 2+' : payWhy(l, c), run: function (l, r, log) { pay(l, c, S[0]); h.style = sk; h.styleAt = l.age; h.dmg = Math.min(100, h.dmg + S[2]); if (sk === 'bob') h.len = Math.min(h.len, 12); if (sk === 'cut') h.len = Math.max(3, h.len - 3); if (sk === 'high' || sk === 'ombre') h.dyed = true; if (h.happyAt !== l.age) { h.happyAt = l.age; H.fx(l, { hap: 2 }); } log('Làm tóc: ' + S[0].toLowerCase() + '.', 'good'); } }); });
    if (tab === 'pierce') Object.keys(PIERCE).forEach(function (pos) { var P = PIERCE[pos], c = cost(l, P[2]), cur = s.pierce[pos] && !s.pierce[pos].removed;
      out.push(cur ? { k: 'rm:' + pos, l: 'Tháo khuyên ' + P[0], run: function (l, r, log) { s.pierce[pos].removed = l.age; log('Bạn tháo khuyên ' + P[0] + '; lỗ có thể tự liền theo thời gian.', 'neutral'); } }
        : { k: 'p:' + pos, l: 'Bấm khuyên ' + P[0], h: mo(l, c) + ' · lành sau ~' + (P[1] > 1 ? 'hơn một năm' : 'vài tháng'), why: pierceWhy(l, pos) !== true ? pierceWhy(l, pos) : payWhy(l, c), run: function (l, r, log) { if (pierceWhy(l, pos) !== true) return; pay(l, c, 'Bấm khuyên ' + P[0]); s.pierce[pos] = { at: l.age, healAt: l.age + P[1] }; var inf = u(l.id + ':pi:' + pos + ':' + l.age) < 0.06; if (inf) { H.fx(l, { hea: -1 }); log('Vết bấm khuyên ' + P[0] + ' bị viêm nhẹ; chăm sóc đúng cách vài tuần thì ổn.', 'neutral'); } else log('Bấm khuyên ' + P[0] + '. Nhớ vệ sinh đến khi lành.', 'good'); if (l.job && E.jobDef && /state|military|police/.test((E.jobDef(l) || {}).cat || '') && pos !== 'lobe') log('Nơi làm việc có quy định trang phục; có thể phải tháo khuyên khi làm nhiệm vụ.', 'neutral'); } }); });
    if (tab === 'jewel') {
      Object.keys(JEWEL).forEach(function (jk) { var J = JEWEL[jk], c = cost(l, J[1]); out.push({ k: 'j:' + jk, l: 'Mua ' + J[0], h: mo(l, c) + (J[2] ? ' · cần lỗ khuyên ' + PIERCE[J[2]][0] + ' đã lành' : ''), why: l.age < 12 && J[1] > 0.02 ? 'Chưa phù hợp tuổi' : J[2] && !healed(l, J[2]) ? 'Cần bấm khuyên ' + PIERCE[J[2]][0] + ' và chờ lành' : payWhy(l, c), run: function (l, r, log) { pay(l, c, 'Mua ' + J[0]); s.jewel.push({ id: 'j' + (++s.serial), k: jk, at: l.age, paid: c, wear: true }); log('Bạn mua ' + J[0].toLowerCase() + '.', 'good'); } }); });
      s.jewel.filter(function (j) { return !j.sold; }).slice(0, 8).forEach(function (j) { var J = JEWEL[j.k], v = j.paid * (/vàng|kim cương/.test(J[0]) ? 0.75 : 0.45);
        out.push({ k: 'w:' + j.id, l: (j.wear ? 'Cất ' : 'Đeo ') + J[0].toLowerCase(), why: !j.wear && J[2] && !healed(l, J[2]) ? 'Lỗ khuyên chưa lành hoặc đã tháo' : true, run: function () { j.wear = !j.wear; } });
        if (l.indep) out.push({ k: 'sell:' + j.id, l: 'Bán lại ' + J[0].toLowerCase(), h: '~' + mo(l, v), run: function (l, r, log) { if (j.sold) return; j.sold = l.age; H.cash(l, v, 'Bán lại ' + J[0]); log('Bán lại ' + J[0].toLowerCase() + ' được ' + mo(l, v) + '.', 'neutral'); } }); });
    }
    out.push(back); return out;
  }, 6, 'Bản thân');
  // Tóc mọc: phần tóc mới là màu tự nhiên; sau khi mọc dài và cắt bỏ phần nhuộm thì về màu thật; hư tổn giảm dần khi không hóa chất.
  E.HOOKS.year.push(function (l) { if (!l.alive || !l.flags) return; var h = l.flags.hair915; if (!h || h.lift == null || h.yr919 === l.age) return; h.yr919 = l.age; h.dmg = Math.max(0, (h.dmg || 0) - 6); var since = l.age - Math.max(h.colorAt || 0, h.bleachAt || 0); if ((h.color || h.lift) && since >= 3 && h.len >= 30) { h.color = null; h.lift = 0; h.bleached = false; h.dyed = false; } });
  // Mô tả ngoại hình (ID919) đọc màu nhuộm từ hồ sơ tóc dùng chung.
  if (E.ID919) { var d0 = E.ID919.describe; E.ID919.describe = function (p, dye) { return d0(p, dye); }; }
  var prof0 = E.profile; E.profile = function (l) { var p = prof0.apply(this, arguments); if (p && p.jobInfo && l.flags && (l.flags.hair915 || l.flags.beauty919)) p.jobInfo.push('Làm đẹp: ' + desc(l)); return p; };
  var mig = E.migrateExt; E.migrateExt = function (l) { if (mig) mig(l); if (l && l.flags && l.flags.beauty919 != null && typeof l.flags.beauty919 !== 'object') delete l.flags.beauty919; };
  E.BEAUTY919 = { hair: hair, lift: lift, natLift: natLift, COLORS: COLORS, STYLES: STYLES, PIERCE: PIERCE, JEWEL: JEWEL, bleachWhy: bleachWhy, pierceWhy: pierceWhy, healed: healed, desc: desc, state: bs };
})(globalThis.G);
