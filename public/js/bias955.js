/* Một Đời — 9.5.5: phân biệt đối xử theo thời đại — kỳ thị người đồng tính, song tính và phân biệt chủng tộc, sắc tộc theo nước và năm (data-bias955.js).
   Chỉ là bối cảnh và rào cản của xã hội: rào cản pháp luật, việc làm, nhà ở, an toàn, lựa chọn đối mặt của nhân vật. Không gán tính cách, giá trị hay số phận
   cho bất kỳ nhóm nào; nhân vật thuộc nhóm bị phân biệt hay không được rút theo mã đời (tỷ lệ dân cư), không theo giàu nghèo hay tôn giáo.
   Dùng lại: E.UPDATE110.next (đưa lựa chọn tới người chơi mà chế độ Tự động không đứng chờ), E.HOOKS.year, E.careerYear, H.jail, H.emigrate, H.moveToCity,
   decision 'out' có sẵn (xác suất cha mẹ chấp nhận nay theo năm). Người sinh từ 2024: không đổi một byte (chỉ áp cho đời có l.era920). */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E && E.H, X = E && E.UPDATE110, D = G.CTX945_DATA, B = D && D.BIAS;
  if (!E || !H || !X || !B || !E.SC) return;

  function wy(l) { return l.birthYear + l.age; }
  function code(l) { return H.resCode(l); }
  function hs(l, tag) { var h = 2166136261, s = String(l.rs) + ':bias955:' + tag; for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 15; h = Math.imul(h, 2246822507); h ^= h >>> 13; return (h >>> 0) / 4294967296; }
  function fl(l) { return l.flags.bias955 || (l.flags.bias955 = {}); }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped); }
  function name(c) { var b = G.W && G.W.BY[c]; return b ? b.name : c; }
  function V(l, tr) { return (l.cur === 'vnd' && H.isVN(l) ? tr * ((l.flags && l.flags.eraK954) || 1) : tr / 90 * l.base); }

  // ---------- người đồng tính, song tính ----------
  function lgbtAt(c, y) {
    var t = B.LG[c];
    if (t) { var lv = 0; for (var i = 0; i < t.length; i++) if (y >= t[i][0]) lv = t[i][1]; return lv; }
    var W = G.W; return W && W.CRIM && W.CRIM.indexOf(c) >= 0 ? 2 : (y < 2000 ? 1 : 0);
  }
  function lgbt(l) { return l.era920 ? lgbtAt(code(l), wy(l)) : 0; }
  function isLGB(l) { return l.orient === 'gay' || l.orient === 'bi'; }
  function samePartner(l) { return !!(l.partner && l.partner.alive !== false && l.partner.sex && l.partner.sex === l.sex); }

  // ---------- phân biệt chủng tộc, sắc tộc ----------
  function rows(l) { var c = code(l), y = wy(l); return l.era920 ? B.RACE.filter(function (r) { return r[1] === c && y >= r[2] && y <= r[3]; }) : []; }
  function member(l, r) { var f = fl(l), k = 'm_' + r[0]; if (f[k] == null) f[k] = hs(l, 'grp:' + r[0]) < r[4] ? 1 : 0; return !!f[k]; }
  function levelOf(l, r) { return r[8] && r[9] != null && new RegExp(r[8]).test(String(l.city || l.place || '')) ? r[9] : r[5]; }
  function groups(l) { return rows(l).filter(function (r) { return member(l, r) && levelOf(l, r) >= 1; }).map(function (r) { return { id: r[0], lv: levelOf(l, r), regime: r[6], group: r[7], row: r }; }).sort(function (a, b) { return b.lv - a.lv; }); }
  function top(l) { return groups(l)[0] || null; }

  // thu nhập bị rào cản: nghề bị cấm hoặc trả thấp theo nhóm, không theo năng lực
  var PEN = [0, 0.04, 0.12, 0.25];
  var career = E.careerYear;
  E.careerYear = function (l) {
    var out = career.apply(this, arguments); if (!(out > 0) || !l.era920) return out;
    var g = top(l); return g ? out * (1 - PEN[g.lv]) : out;
  };

  // ---------- nhật ký bối cảnh một lần và khi luật đổi ----------
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !l.era920 || l.age < 8) return;
    var f = fl(l), y = wy(l), c = code(l), noted = f.noted || (f.noted = {});
    groups(l).forEach(function (g) {
      if (noted[g.id]) return; noted[g.id] = 1;
      log('Bạn thuộc ' + g.group + ' ở ' + name(c) + ', nơi đang có ' + g.regime + '.', g.lv >= 3 ? 'bad' : 'neutral');
      H.mem(l, 'Những năm sống trong ' + g.regime + ' ở ' + name(c) + '.', g.lv >= 3 ? 6 : 4);
    });
    if (isLGB(l) && l.age >= 14) {
      var now = lgbtAt(c, y), prev = lgbtAt(c, y - 1);
      if (now < prev) { log(now === 0 ? 'Luật và xã hội ở ' + name(c) + ' đã thay đổi: người đồng tính được bảo vệ và chấp nhận rộng rãi hơn.' : 'Luật ở ' + name(c) + ' thay đổi: quan hệ đồng giới không còn bị truy tố như trước, dù xã hội vẫn còn kỳ thị.', 'good'); H.fx(l, { hap: 4 }); H.mem(l, 'Năm ' + y + ' luật về người đồng tính ở ' + name(c) + ' đổi theo hướng tốt hơn.', 4); }
      else if (now > prev) { log('Luật ở ' + name(c) + ' thay đổi theo hướng khắt khe hơn với người đồng tính.', 'bad'); H.fx(l, { hap: -4 }); stress(l, 4); }
    }
    // quyết định hằng năm
    if (l.age >= 10 && free(l) && (f.raceAt == null || y - f.raceAt >= 3)) { var g = top(l); if (g && hs(l, 'racep:' + y) < [0, 0.05, 0.1, 0.16][g.lv]) { f.raceAt = y; X.next(l, 'bias955_race', r, { id: g.id }, { manual: false }); return; } }
    if (isLGB(l) && l.age >= 16 && l.age <= 65 && free(l) && (f.lgbtAt == null || y - f.lgbtAt >= 4)) { var lv = lgbtAt(c, y); if (lv >= 1 && hs(l, 'lgbtp:' + y) < [0, 0.05, 0.09, 0.14][lv] * (l.orient === 'bi' ? 0.6 : 1) * (f.anon ? 0.6 : 1)) { f.lgbtAt = y; X.next(l, 'bias955_lgbt', r, null, { manual: false }); } }
  });
  function stress(l, n) { if (l.mind) l.mind.stress = U.clamp((l.mind.stress || 0) + n, 0, 100); }

  // ---------- phân biệt chủng tộc: tình huống và lựa chọn ----------
  function incident(l, g) {
    var kid = l.age < 14, lv = g.lv;
    if (lv === 1) return kid ? 'Ở trường, vài bạn và cả một người lớn đối xử với bạn khác đi vì bạn là ' + g.group + '.' : 'Hồ sơ xin việc, thuê nhà hoặc vay vốn của bạn bị ngần ngại mà không ai nói rõ lý do.';
    if (lv === 2) return kid ? 'Bạn bị xếp vào lớp và chỗ ngồi riêng, bị từ chối ở những nơi vui chơi dành cho trẻ em khác.' : 'Một chủ nhà, một chủ xưởng và một cửa hiệu cùng từ chối bạn vì bạn là ' + g.group + ', dù ai cũng biết bạn làm được việc.';
    return kid ? 'Cả nhà bị bắt buộc dọn đến khu riêng, trường cũ không còn nhận bạn.' : 'Chính quyền ban lệnh hạn chế đi lại, nghề nghiệp và nơi ở đối với ' + g.group + '; nhà bạn bị kiểm tra, giấy tờ bị thu giữ.';
  }
  E.SC('bias955_race', {
    title: 'Phân biệt đối xử',
    prep: function (l, r, arg) { return { id: arg && arg.id }; },
    valid: function (l, d) { var g = top(l); return !!(free(l) && g && (!d || !d.id || groups(l).some(function (x) { return x.id === d.id; }))); },
    text: function (l, d) { var g = groups(l).filter(function (x) { return !d || !d.id || x.id === d.id; })[0] || top(l); return g ? incident(l, g) + ' Ở ' + name(code(l)) + ' lúc này có ' + g.regime + '.' : ''; },
    opts: [
      { k: 'chiu', l: 'Nhẫn nhịn, giữ yên cho gia đình', ai: { w: 1.2 }, run: function (l, r, log) { var g = top(l); H.fx(l, { hap: g && g.lv >= 3 ? -5 : -3, soc: -1 }); stress(l, 3); log('Bạn lặng lẽ chịu đựng, tránh va chạm để gia đình được yên. Nỗi bất công nằm lại trong lòng.', 'neutral'); H.mem(l, 'Những lần phải nuốt tủi vì bị phân biệt.', 3); } },
      { k: 'nho', l: 'Nhờ người quen hoặc tổ chức cộng đồng bảo trợ', ai: { w: 1, soc: 1 }, run: function (l, r, log) { var g = top(l), ok = r() < [0, 0.7, 0.5, 0.3][g ? g.lv : 1]; if (ok) { log('Một người quen và hội cộng đồng đứng ra bảo lãnh, bạn có được chỗ làm và chỗ ở an toàn hơn.', 'good'); H.fx(l, { hap: 2, soc: 2 }); } else { log('Hội cộng đồng giúp được chút ít nhưng cánh cửa chính vẫn đóng.', 'neutral'); H.fx(l, { soc: 1 }); } fl(l).network = true; } },
      { k: 'dau', l: 'Cùng cộng đồng lên tiếng đòi công bằng', ai: { w: 0.6, risk: 1, moral: 1 }, req: function (l) { return l.age >= 14; }, run: function (l, r, log) {
        var g = top(l), lv = g ? g.lv : 1, f = fl(l); f.active = true;
        if (r() < 0.35 - 0.05 * lv + (f.network ? 0.08 : 0)) { log('Cuộc đấu tranh bền bỉ của cả cộng đồng đã làm một quy định bất công bị thay đổi. Bạn là một trong những người có mặt.', 'big'); H.fx(l, { hap: 6, soc: 5, karma: 4 }); H.mem(l, 'Ngày chung tay đòi công bằng và thấy kết quả.', 6); }
        else if (lv >= 3 && r() < 0.3 && H.jail) { H.jail(l, 1, 'tham gia biểu tình bị cấm', log); H.fx(l, { karma: 3 }); }
        else { log('Tiếng nói của bạn bị phớt lờ, có người bị ghi tên theo dõi. Bạn mệt nhưng không hối hận.', 'neutral'); H.fx(l, { hap: -2, karma: 3, soc: 2 }); stress(l, 3); }
      } },
      { k: 'di', l: 'Chuyển đến nơi bớt phân biệt, hoặc ra nước ngoài', ai: { w: 0.5, risk: 1 }, req: function (l) { return l.age >= 16 && l.money > -l.base; }, run: function (l, r, log) { moveAway(l, r, log, 'chủng tộc'); } }
    ]
  });
  function betterCity(l) {
    var b = G.W && G.W.BY[code(l)]; if (!b || !H.moveToCity) return null;
    var g = top(l), cur = String(l.city || l.place || '');
    if (!g || !g.row[8] || g.row[5] >= g.lv) return null; var re = new RegExp(g.row[8]);
    var list = (b.cities || []).filter(function (c) { return !re.test(c) && c !== cur; });
    return list.length ? list[Math.floor(hs(l, 'move' + wy(l)) * list.length)] : null;
  }
  function raceRiskAt(c, y) {
    // Các nhóm hiện được mô hình theo từng nước. Dùng rào cản cao nhất đã ghi nhận để sàng lọc điểm đến.
    return B.RACE.reduce(function (risk, row) {
      return row[1] === c && y >= row[2] && y <= row[3] ? Math.max(risk, row[5], row[9] || 0) : risk;
    }, 0);
  }
  function moveAway(l, r, log, why) {
    var city = betterCity(l);
    if (city && why === 'chủng tộc') { H.moveToCity(l, city); H.cash(l, -V(l, 2), 'Chi phí chuyển nơi ở'); H.fx(l, { hap: -1, soc: -2 }); log('Bạn dọn tới ' + city + ', nơi quy định bớt khắt khe hơn, bỏ lại họ hàng và quen biết cũ.', 'neutral'); return; }
    var okAbroad = E.CTX945 && E.CTX945.emigAllowed && E.CTX945.emigAllowed(l);
    var from = code(l), y = wy(l), riskAt = why === 'lgbt' ? lgbtAt : raceRiskAt;
    var here = why === 'lgbt' ? lgbtAt(from, y) : top(l).lv;
    var dest = ['CA', 'GB', 'DE', 'NL', 'FR', 'AU', 'US', 'SE', 'NZ', 'CH'].filter(function (c) {
      return G.W && G.W.BY[c] && c !== from && riskAt(c, y) < here;
    });
    if (okAbroad && dest.length && l.money > l.base * 0.3 && H.emigrate) {
      var c = dest[Math.floor(hs(l, 'dest' + wy(l)) * dest.length)], Bn = G.W.BY[c];
      H.cash(l, -l.base * 0.3, 'Chi phí rời đi'); H.emigrate(l, [c, Bn.name, Bn.pool], r, function (t, k) { l.log.push({ a: l.age, y: wy(l), t: t, k: k || 'neutral' }); });
      log('Bạn rời ' + name(from) + ' để tìm nơi sống bình yên hơn. Xa người thân, bạn phải gây dựng lại các mối quan hệ.', 'big'); H.mem(l, 'Ngày rời nơi ở cũ vì bị phân biệt đối xử.', 6); return;
    }
    H.fx(l, { hap: -2 }); log('Bạn tính chuyện bỏ đi nhưng không có đường đi hay tiền bạc đủ; mọi thứ đành ở lại như cũ.', 'neutral');
  }

  // ---------- kỳ thị người đồng tính, song tính ----------
  function lgbtText(l) {
    var lv = lgbt(l), p = samePartner(l);
    var base = lv >= 3 ? 'Ở ' + name(code(l)) + ' lúc này quan hệ đồng giới bị truy tố nặng hoặc bị đàn áp có tổ chức; bị phát hiện có thể bị bắt, đưa đi "cải tạo" hoặc bị gia đình từ bỏ.'
      : lv === 2 ? 'Ở ' + name(code(l)) + ' lúc này quan hệ đồng giới bị coi là phạm pháp hoặc bị luật pháp phân biệt: không được kết hôn, có thể mất việc, bị đuổi khỏi quân ngũ nếu lộ.'
        : 'Ở ' + name(code(l)) + ' lúc này nhiều người coi đồng tính là điều đáng xấu hổ, luật chưa bảo vệ; công khai có thể làm bạn mất bạn bè và việc làm.';
    return base + (p ? ' Bạn và ' + l.partner.name + ' phải cân nhắc từng bước đi.' : ' Bạn phải cân nhắc mình sống thật đến mức nào và với ai.');
  }
  var EXPOSE = { kin: [0, 0.02, 0.05, 0.08], tham: [0, 0.05, 0.12, 0.2], ket: [0, 0.03, 0.1, 0.2] };
  function exposed(l, r, log, how) {
    var lv = lgbt(l), f = fl(l); f.outed = wy(l);
    if (lv >= 3) {
      if (r() < 0.5 && H.jail) { H.jail(l, 1 + Math.floor(r() * 2), 'quan hệ đồng giới', log); log('Gia đình và người thân bị liên lụy, mọi người xung quanh quay lưng.', 'bad'); H.fx(l, { soc: -8 }); if (l.partner && samePartner(l) && r() < 0.5) { log('Người yêu của bạn bị đưa đi nơi khác, hai người mất liên lạc.', 'bad'); l.partner = null; } }
      else { H.cash(l, -V(l, 4), 'Hối lộ để thoát tội'); log('Bạn bị gọi lên đồn, phải chi một khoản lớn và hứa chấm dứt mới được thả.', 'bad'); H.fx(l, { hap: -8 }); stress(l, 8); }
    } else if (lv === 2) {
      if (l.job && r() < 0.5) { l.lastJob = l.job; l.job = null; l.flags.needJob = true; log('Bị phát hiện, bạn mất việc và bị đồn đại khắp nơi.', 'bad'); H.fx(l, { hap: -7, soc: -6 }); }
      else { H.cash(l, -V(l, 2), 'Bị tống tiền'); log('Có người đe dọa tố giác và đòi tiền để giữ im lặng.', 'bad'); H.fx(l, { hap: -5 }); stress(l, 6); }
    } else { log('Chuyện của bạn bị lan ra; có bạn bè lảng đi, người thân bàn tán, bạn thấy cô đơn.', 'bad'); H.fx(l, { hap: -4, soc: -4 }); f.famTension = true; }
    H.mem(l, 'Cái năm bí mật của mình bị lộ.', 5);
  }
  E.SC('bias955_lgbt', {
    title: 'Giữa bí mật và sống thật',
    valid: function (l) { return !!(free(l) && isLGB(l) && lgbt(l) >= 1); },
    text: function (l) { return lgbtText(l); },
    opts: [
      { k: 'kin', l: 'Giữ kín, chỉ sống thật với vài người rất thân', ai: { w: 1.3 }, run: function (l, r, log) { var lv = lgbt(l); H.fx(l, { hap: -2 }); stress(l, 2); if (r() < EXPOSE.kin[lv]) { log('Dù giữ kín, một điều bạn vô tình để lộ bị người khác nhận ra.', 'bad'); exposed(l, r, log, 'kin'); } else log('Bạn giữ được bí mật, nhưng sống trong dè chừng thành thói quen.', 'neutral'); } },
      { k: 'tham', l: 'Giữ mối quan hệ nhưng thật kín đáo', ai: { w: 0.9 }, req: function (l) { return samePartner(l) || !!(l.partner && l.partner.status === 'dating'); }, run: function (l, r, log) { var lv = lgbt(l); H.fx(l, { hap: 2 }); if (r() < EXPOSE.tham[lv]) { log('Một lần hai người đi cạnh nhau bị ai đó chú ý.', 'bad'); exposed(l, r, log, 'tham'); } else { log('Hai người gặp nhau trong những khoảng riêng tư, nhẹ nhõm nhưng không thể công khai.', 'good'); } } },
      { k: 'ban', l: 'Tìm cộng đồng bạn bè kín đáo để có nơi nương tựa', ai: { w: 0.9, soc: 1 }, run: function (l, r, log) { var lv = lgbt(l); if (r() < EXPOSE.ket[lv]) { log('Buổi tụ tập kín bị phát hiện.', 'bad'); exposed(l, r, log, 'ban'); } else { log('Bạn tìm được một nhóm bạn cùng cảnh ngộ; lần đầu tiên bạn không thấy đơn độc.', 'good'); H.fx(l, { hap: 4, soc: 3 }); fl(l).community = true; H.mem(l, 'Lần đầu tìm được nhóm bạn hiểu mình.', 4); } } },
      { k: 'cong', l: 'Công khai, chấp nhận hậu quả', ai: { w: 0.4, risk: 1, moral: 1 }, run: function (l, r, log) {
        var lv = lgbt(l); l.out = true; var acc = [0.85, 0.55, 0.25, 0.1][lv] + (fl(l).community ? 0.08 : 0);
        if (r() < acc) { log('Bạn công khai và nhận được sự đón nhận của những người quan trọng nhất, dù vẫn có người quay lưng.', 'good'); H.fx(l, { hap: 6, soc: 2 }); H.mem(l, 'Ngày dám sống thật với mọi người.', 6); } else { log('Công khai khiến nhiều người xa lánh và gây hậu quả nặng nề.', 'bad'); exposed(l, r, log, 'cong'); }
      } },
      { k: 'di', l: 'Rời đi, đến nơi bạn có thể thở dễ hơn', ai: { w: 0.5, risk: 1 }, req: function (l) { return l.age >= 18 && l.money > -l.base; }, run: function (l, r, log) { var f = fl(l); if (E.CTX945 && !f.anon) { var b = G.W && G.W.BY[code(l)], big = b && b.cities && b.cities[0]; if (big && String(l.city || l.place) !== big && H.moveToCity && lgbt(l) < 3) { H.moveToCity(l, big); f.anon = true; log('Bạn dọn tới ' + big + ', nơi đông người, dễ ẩn mình và có thêm bạn bè giống mình.', 'neutral'); H.fx(l, { hap: 2, soc: -1 }); return; } } moveAway(l, r, log, 'lgbt'); } }
    ]
  });

  // ---------- decision "out" có sẵn: cha mẹ chấp nhận hay không theo thời đại ----------
  var out = E.DEC.out;
  if (out && out.apply && !out.v955) {
    out.v955 = true; var apply0 = out.apply;
    out.apply = function (l, d, k, r, log) {
      if (k !== 'yes' || !l.era920) return apply0.apply(this, arguments);
      var lv = lgbt(l); l.out = true; var acc = [0.8, 0.55, 0.28, 0.12][lv] + (H.isVN(l) && lv <= 1 ? 0 : 0);
      if (r() < acc) { log('Công khai xu hướng tính dục với gia đình. Bố mẹ ôm bạn vào lòng.', 'good'); l.st.hap += 10; l.st.soc += 4; H.mem(l, 'Cái ôm của bố mẹ ngày bạn dám sống thật với chính mình.', 5); }
      else { log(lv >= 2 ? 'Công khai với gia đình. Bố mẹ sợ hãi và giận dữ, có người bắt bạn thề không nhắc lại, thậm chí đòi đoạn tuyệt.' : 'Công khai với gia đình. Bố mẹ sốc và cần thời gian để chấp nhận.', 'bad'); l.st.hap -= lv >= 2 ? 10 : 6; l.flags.famTension = true; H.mem(l, 'Bữa cơm im lặng sau ngày bạn công khai với gia đình.', 4); }
    };
  }
  // dòng tóm tắt cho màn chọn năm sinh: chỉ nêu rào cản có thật theo luật hoặc chế độ (mức 2 trở lên)
  function hint(c, y) {
    var out = [], lv = lgbtAt(c, y);
    if (lv >= 2) out.push('quan hệ đồng giới ' + (lv >= 3 ? 'bị truy tố nặng hoặc đàn áp' : 'bị coi là phạm pháp hoặc bị luật pháp phân biệt'));
    B.RACE.forEach(function (r) { if (r[1] === c && y >= r[2] && y <= r[3] && r[5] >= 2) out.push(r[6]); });
    return out.length ? ' Xã hội thời này: ' + out.join('; ') + '.' : '';
  }
  // bản lưu cũ: tên công ty, chương trình do trò chơi tự đặt từng ghi kèm "(hư cấu)"; bỏ phần ghi chú để khớp tên mới (không đụng tên gia tộc hoàng gia)
  var NAMES = ['Aurora Entertainment', 'Hồng Tinh Media', 'Sakura Stage', 'Lumière Talents', 'Blue Stage Studios', 'Starlight Music', 'Blue Moon Ent.', 'Nova Entertainment', 'Sao Mai Media', 'Công ty mua bán nợ Phú Quý', 'Nhóm thu hồi nợ Hưng Thịnh', 'Dịch vụ tài chính Kim Long', 'Chương trình làm tóc giả cho bệnh nhi', 'Quỹ tóc giả cộng đồng'];
  var TAG = new RegExp('(' + NAMES.join('|').replace(/[.]/g, '\\.') + ') \\(hư cấu\\)', 'g');
  var migrate955 = E.migrateExt;
  E.migrateExt = function (l) { if (migrate955) migrate955.apply(this, arguments); if (!l || !l.flags) return; ['flags', 'log', 'mem'].forEach(function (k) { if (l[k] == null) return; var t = JSON.stringify(l[k]); if (t.indexOf('(hư cấu)') < 0) return; var u = t.replace(TAG, '$1'); if (u !== t) l[k] = JSON.parse(u); }); };
  E.BIAS955 = { hint: hint, lgbtAt: lgbtAt, lgbt: lgbt, groups: groups, top: top, rows: rows, member: member, levelOf: levelOf, isLGB: isLGB, exposed: exposed, incident: incident, PEN: PEN };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
