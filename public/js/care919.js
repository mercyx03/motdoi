/* Một Đời — MD4 (8.10.22): năng lực chức năng, chăm sóc liên thế hệ, chăm sóc giảm nhẹ, trẻ sơ sinh.
   Mở rộng health915 (phát triển trẻ), welfare918 (hỗ trợ khuyết tật), health-aging (AGEING899: tự lập, chăm sóc), finale (di nguyện)
   và ERA917/TRAVEL918 (đi lại); không tạo chỉ số sức khỏe thay thế.
   · D02: sáu thang chức năng riêng (nhìn, nghe, vận động, giao tiếp, nhận thức, sức bền); tình trạng bẩm sinh/mắc phải đi qua
     chưa nhận ra → nghi ngờ → đánh giá → chẩn đoán → kế hoạch hỗ trợ. Chẩn đoán không suy ra trí tuệ hay nhân cách. Thiết bị cần
     đánh giá phù hợp, có chi phí/bảo dưỡng/huấn luyện, hỗ trợ chứ không chữa khỏi. Ngôn ngữ ký hiệu dùng mô hình kỹ năng ID919.
   · D03: quên thông thường ≠ suy giảm nhận thức nhẹ ≠ các loại sa sút trí tuệ; tuổi là yếu tố nguy cơ, không phải mốc tự động.
     Người được chẩn đoán vẫn tham gia quyết định và chọn người đại diện khi còn khả năng. Trông trẻ cần người chịu trách nhiệm.
   · D04: chăm sóc giảm nhẹ đi song song điều trị, mọi độ tuổi; tiên lượng là khoảng bất định; di nguyện chăm sóc ≠ di chúc.
     Bucket list suốt đời, điều kiện thực (giấy tờ, tiền, sự đồng ý), hoàn thành ghi nhận một lần.
   · D05: nguy cơ đột tử khi ngủ ở trẻ dưới 1 tuổi tính một lần cho từng bé (băm theo ID bé), phân loại sau đánh giá; máy theo dõi
     KHÔNG giảm nguy cơ (NICHD); không quy lỗi cha mẹ. Tỷ lệ là tham số trò chơi ở mức hiếm (docs/MD4-SOURCES.md). */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, W = G.W;
  if (!X) return;
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; return h >>> 0; }
  function u(seed) { return hash(seed) / 4294967296; }
  function mo(l, v) { return H.money(l, v); }
  function res(l) { return H.resCode(l); }
  function gdp(l) { var b = W.BY[res(l)]; return b ? b.gdp : 10; }
  function cover(l, kind) { return E.HEALTH919 ? E.HEALTH919.cover(l, kind) : 0; }
  function pay(l, gross, why, kind) { var share = cover(l, kind || 'device'), oop = gross * (1 - share); if (oop > 0) H.cash(l, -oop, why); return oop; }
  function st(l) { var s = l.flags.care919; if (!s || typeof s !== 'object') s = l.flags.care919 = { v: 1 }; return s; }
  var F = ['vision', 'hearing', 'mobility', 'comm', 'cognition', 'stamina'];
  var FN = { vision: 'nhìn', hearing: 'nghe', mobility: 'vận động', comm: 'giao tiếp', cognition: 'nhận thức', stamina: 'sức bền' };
  function fresh() { return { vision: 100, hearing: 100, mobility: 100, comm: 100, cognition: 100, stamina: 100, conds: [], devices: {}, acc: {} }; }
  function fn(l) { var s = st(l); if (!s.fn) s.fn = fresh(); return s.fn; }
  // ================= D02: danh mục tình trạng =================
  // f: thang bị ảnh hưởng theo mức độ [nhẹ, vừa, nặng, rất nặng]; dev: thiết bị phù hợp; spot: tuổi thường được nhận ra.
  var COND = {
    hearing: { n: 'suy giảm thính lực', f: { hearing: [75, 55, 30, 8] }, dev: ['aid', 'ci'], spot: [0, 3], note: 'Người điếc có thể nói, đọc môi hoặc dùng ngôn ngữ ký hiệu tùy mỗi người.' },
    vision: { n: 'suy giảm thị lực', f: { vision: [70, 50, 25, 5] }, dev: ['wcane', 'braille', 'magnifier'], spot: [0, 4], note: 'Mức nhìn rất khác nhau giữa mỗi người; mù hoàn toàn chỉ là một phần.' },
    cp: { n: 'bại não', f: { mobility: [75, 55, 30, 15], comm: [95, 85, 65, 45] }, dev: ['scane', 'walker2', 'walker4', 'wheel', 'ewheel', 'aac'], spot: [0, 2], note: 'Bại não chủ yếu ảnh hưởng vận động; nhiều người có nhận thức bình thường.' },
    speech: { n: 'khó khăn lời nói / giao tiếp', f: { comm: [75, 55, 35, 20] }, dev: ['aac'], spot: [2, 5], note: 'Không nói được không có nghĩa là không nghe hay không hiểu.' },
    agehear: { n: 'nghe kém do tuổi', f: { hearing: [80, 62, 40, 20] }, dev: ['aid'], spot: [60, 80], acquired: true },
    cataract: { n: 'đục thủy tinh thể', f: { vision: [75, 55, 35, 20] }, dev: ['surgery'], spot: [60, 85], acquired: true, treatable: true },
    agemob: { n: 'suy giảm vận động khi lớn tuổi', f: { mobility: [75, 58, 38, 20] }, dev: ['scane', 'walker4', 'wheel'], spot: [65, 90], acquired: true }
  };
  var LV = ['nhẹ', 'vừa', 'nặng', 'rất nặng'];
  // Thiết bị: giá và bảo dưỡng (× thu nhập cơ sở), số năm làm quen; gain: phần chức năng được bù (không bao giờ về 100).
  var DEV = {
    aid: { n: 'máy trợ thính', cost: 0.08, keep: 0.01, train: 1, gain: { hearing: 0.55 } }, ci: { n: 'cấy ốc tai điện tử (theo chỉ định)', cost: 0.9, keep: 0.02, train: 2, gain: { hearing: 0.65 }, need: 3 },
    wcane: { n: 'gậy trắng dò đường', cost: 0.01, keep: 0.002, train: 1, gain: { mobility: 0.4 } }, braille: { n: 'học chữ nổi Braille', cost: 0.02, keep: 0, train: 2, gain: { comm: 0.3 } }, magnifier: { n: 'kính lúp/phần mềm đọc màn hình', cost: 0.02, keep: 0.003, train: 0, gain: { vision: 0.25 } },
    scane: { n: 'gậy chống đỡ', cost: 0.005, keep: 0.001, train: 0, gain: { mobility: 0.25 } }, walker2: { n: 'khung tập đi hai bánh', cost: 0.015, keep: 0.002, train: 0, gain: { mobility: 0.35 } }, walker4: { n: 'khung tập đi bốn bánh có phanh', cost: 0.025, keep: 0.003, train: 0, gain: { mobility: 0.4 } },
    wheel: { n: 'xe lăn tay', cost: 0.04, keep: 0.005, train: 1, gain: { mobility: 0.5 } }, ewheel: { n: 'xe lăn điện', cost: 0.35, keep: 0.03, train: 1, gain: { mobility: 0.6 }, need: 2 },
    aac: { n: 'phương tiện giao tiếp hỗ trợ (bảng/thiết bị AAC)', cost: 0.05, keep: 0.005, train: 1, gain: { comm: 0.5 } }, surgery: { n: 'phẫu thuật thay thủy tinh thể', cost: 0.12, keep: 0, train: 0, gain: { vision: 0.85 }, once: true }
  };
  function addCond(l, who, id, lvl, at, how) {
    var f = who === 'self' ? fn(l) : who.fn919 || (who.fn919 = fresh()); if (f.conds.some(function (c) { return c.id === id; })) return null;
    var C = COND[id], spotAge = C.spot[0] + Math.floor(u(l.id + ':spot919:' + id + ':' + (who === 'self' ? 'me' : who.uid110)) * (C.spot[1] - C.spot[0] + 1));
    var c = { id: id, lvl: lvl, onset: at, stage: how === 'screen' ? 'suspected' : 'unnoticed', spot: Math.max(at, spotAge), cog: id === 'cp' && u(l.id + ':cpcog:' + at) < 0.3 };
    f.conds.push(c); apply(f); return c;
  }
  function apply(f) {
    F.forEach(function (k) { f[k] = 100; });
    f.conds.forEach(function (c) { var C = COND[c.id]; if (!C) return; Object.keys(C.f).forEach(function (k) { f[k] = Math.min(f[k], C.f[k][c.lvl]); }); if (c.cog) f.cognition = Math.min(f.cognition, 70); if (c.id === 'dem') f.cognition = Math.min(f.cognition, [80, 55, 30][c.lvl] || 30); });
    f.eff = {}; F.forEach(function (k) { var v = f[k], best = 0; Object.keys(f.devices).forEach(function (d) { var D = DEV[d], x = f.devices[d]; if (D && D.gain[k] && x && x.ready) best = Math.max(best, D.gain[k]); }); f.eff[k] = Math.round(v + (100 - v) * best * (k === 'vision' && f.devices.surgery ? 1 : 0.9)); });
  }
  function independence(f) { apply(f); var e = f.eff; return Math.round(Math.min(e.mobility, (e.vision + 100) / 2, (e.hearing + 100) / 2, (e.comm + 100) / 2, e.cognition) * 0.6 + 40 * (e.stamina / 100)); }
  // Bẩm sinh: tỷ lệ hiếm (tham số trò chơi theo độ lớn của nguồn tổng quan, không phải số đo một quốc gia), cố định theo ID.
  function birthConds(l, who, seed) {
    var x = u(seed + ':c'), lv = u(seed + ':l'), lvl = lv < 0.5 ? 0 : lv < 0.8 ? 1 : lv < 0.95 ? 2 : 3, screen = gdp(l) >= 20;
    if (x < 0.0015) return addCond(l, who, 'hearing', lvl, 0, screen ? 'screen' : null);
    if (x < 0.0020) return addCond(l, who, 'vision', lvl, 0);
    if (x < 0.0040) return addCond(l, who, 'cp', lvl, 0);
    if (x < 0.0100) return addCond(l, who, 'speech', Math.min(2, lvl), 0);
    return null;
  }
  function spotYear(l, who, f, age, log, name) {
    f.conds.forEach(function (c) { if (c.stage === 'unnoticed' && age >= c.spot) { c.stage = 'suspected'; c.suspAt = age; log && log((who === 'self' ? (age < 18 ? 'Người lớn trong nhà' : 'Bạn') : 'Bạn') + ' nhận thấy dấu hiệu ' + COND[c.id].n + (who === 'self' ? '' : ' ở ' + name) + '. Có thể đưa đi đánh giá chuyên môn để biết cần hỗ trợ gì.', 'neutral'); } });
  }
  function assess(l, who, log, name) { var f = who === 'self' ? fn(l) : who.fn919, any = false; if (!f) return; f.conds.forEach(function (c) { if (c.stage === 'suspected') { c.stage = 'diagnosed'; c.dxAt = l.age; any = true; log(U.cap(COND[c.id].n) + ' mức ' + LV[c.lvl] + (who === 'self' ? '' : ' ở ' + name) + ' được xác định. ' + (COND[c.id].note || '') + (c.cog ? ' Có ảnh hưởng một phần đến học tập; cần hỗ trợ riêng.' : c.id === 'cp' ? ' Nhận thức không bị ảnh hưởng.' : ''), 'neutral'); } }); if (any) pay(l, l.base * 0.03, 'Đánh giá chuyên môn chức năng', 'exam'); return any; }
  function devOptions(f) { var out = []; f.conds.forEach(function (c) { if (c.stage !== 'diagnosed') return; (COND[c.id].dev || []).forEach(function (d) { var D = DEV[d]; if (out.indexOf(d) >= 0 || f.devices[d] && (f.devices[d].ready || D.once)) return; if (D.need && c.lvl < D.need) return; out.push(d); }); }); return out; }
  function buyDev(l, who, d, log, name) { var f = who === 'self' ? fn(l) : who.fn919, D = DEV[d]; if (!f || f.devices[d]) return false; var oop = pay(l, l.base * D.cost, 'Thiết bị hỗ trợ: ' + D.n + (name ? ' cho ' + name : ''), 'device'); f.devices[d] = { at: l.age, ready: D.train === 0, readyAt: l.age + D.train }; if (d === 'surgery') { f.conds = f.conds.filter(function (c) { return c.id !== 'cataract'; }); f.devices[d].ready = true; } apply(f); log('Đã có ' + D.n + (name ? ' cho ' + name : '') + ' sau khi đánh giá phù hợp (tự trả ' + mo(l, oop) + ').' + (D.train ? ' Cần thời gian luyện tập để dùng thành thạo.' : ''), 'good'); return true; }
  function devYear(l, f) { Object.keys(f.devices).forEach(function (d) { var x = f.devices[d], D = DEV[d]; if (!D) return; if (!x.ready && l.age >= x.readyAt) x.ready = true; if (D.keep > 0 && x.keptAt !== l.age) { x.keptAt = l.age; pay(l, l.base * D.keep, 'Bảo dưỡng ' + D.n, 'device'); } }); apply(f); }
  var ACCESS = { US: 'Luật ADA: chó hỗ trợ được huấn luyện để làm nhiệm vụ cụ thể được đi cùng ở nơi công cộng; thú cưng an ủi không có quyền này.', GB: 'Equality Act: chó trợ giúp (assistance dog) được vào cửa hàng, dịch vụ.', AU: 'Disability Discrimination Act: chó trợ giúp được đi cùng.', CA: 'Quyền theo từng tỉnh.', VN: 'Quy định về chó hỗ trợ chưa rõ ràng; nhiều nơi có thể từ chối (chưa xác minh).' };

  // ================= D03: nhận thức tuổi già =================
  var DEM = { alz: 'bệnh Alzheimer', vasc: 'sa sút trí tuệ mạch máu', lewy: 'sa sút trí tuệ thể Lewy', ftd: 'sa sút trí tuệ trán–thái dương', mixed: 'sa sút trí tuệ hỗn hợp' };
  function cogYear(l, log) {
    var s = st(l), c = s.cog || (s.cog = { stage: 'none' }), a = l.age, x = u(l.id + ':cog919:' + a);
    if (c.stage === 'none') {
      var p = a >= 60 ? 0.002 * Math.pow(1.1, a - 60) : a >= 40 ? 0.0002 : 0; p *= l.st.kno >= 70 ? 0.85 : 1; if (l.ill && /đột quỵ/.test(l.ill.n || '')) p *= 2;
      if (x < Math.min(0.12, p)) { c.stage = 'symptoms'; c.at = a; c.early = a < 60; log('Bạn hay quên lịch hẹn và lặp lại câu hỏi nhiều hơn trước. Quên thông thường cũng có thể xảy ra; nên đi đánh giá để biết nguyên nhân.', 'neutral'); }
      else if (a >= 50 && x > 0.985 && s.forgotAt == null) { s.forgotAt = a; log('Thỉnh thoảng bạn quên chỗ để chìa khóa rồi nhớ lại — chuyện quên thông thường ở mọi lứa tuổi, không phải dấu hiệu bệnh.', 'neutral'); }
      return;
    }
    if (c.stage === 'symptoms' && a - c.at >= 2) { log('Người thân thấy bạn quên nhiều hơn nên đưa đi khám.', 'neutral'); evaluateCog(l, log); return; }
    if (c.stage === 'mci' && x < 0.1) { c.stage = 'dem'; c.lvl = 0; c.since = a; c.type = c.type || pickType(l, c); var f = fn(l); f.conds.push({ id: 'dem', lvl: 0, onset: a, stage: 'diagnosed' }); apply(f); log('Bác sĩ đánh giá lại: suy giảm nhận thức đã chuyển sang ' + DEM[c.type] + ' giai đoạn nhẹ. Bạn vẫn tự quyết định được nhiều việc; nên chọn người đại diện và kế hoạch chăm sóc khi còn chủ động.', 'bad'); }
    else if (c.stage === 'dem' && c.lvl < 2 && a - c.since >= 2 + Math.floor(u(l.id + ':dl:' + c.lvl) * 3)) { c.lvl++; c.since = a; var g = fn(l), dc = g.conds.find(function (q) { return q.id === 'dem'; }); if (dc) dc.lvl = c.lvl; apply(g); log('Sa sút trí tuệ chuyển sang giai đoạn ' + (c.lvl === 1 ? 'vừa' : 'nặng') + '; cần nhiều hỗ trợ sinh hoạt hơn.', 'bad'); }
    var ag = E.AGEING899 && E.AGEING899.state(l); if (ag && c.stage === 'dem') ag.independence = Math.min(ag.independence, [65, 40, 20][c.lvl]);
  }
  // Khởi phát sớm có yếu tố di truyền trội chỉ ở một nhóm nhỏ (APP/PSEN1/PSEN2); không gán cho mọi ca.
  function pickType(l, c) { var x = u(l.id + ':ctype'); if (c.early) return x < 0.65 ? 'alz' : 'ftd'; var vasc = l.ill && /đột quỵ|tăng huyết áp/.test(l.ill.n || '') ? 0.35 : 0.18; return x < 0.6 ? 'alz' : x < 0.6 + vasc ? 'vasc' : x < 0.88 + vasc / 4 ? 'lewy' : x < 0.93 ? 'ftd' : 'mixed'; }
  function evaluateCog(l, log) { var c = st(l).cog; if (!c || c.stage !== 'symptoms') return; pay(l, l.base * 0.04, 'Đánh giá trí nhớ, nhận thức', 'exam'); var x = u(l.id + ':cogdx:' + c.at); if (x < 0.35) { c.stage = 'none'; log('Kết quả: thay đổi trí nhớ do căng thẳng/thiếu ngủ, không phải bệnh lý thần kinh. Nên theo dõi định kỳ.', 'good'); } else if (x < 0.8) { c.stage = 'mci'; c.dxAt = l.age; log('Kết quả: suy giảm nhận thức nhẹ. Nhiều người giữ ổn định nhiều năm; không phải ai cũng tiến triển thành sa sút trí tuệ.', 'neutral'); } else { c.stage = 'dem'; c.lvl = 0; c.since = l.age; c.type = pickType(l, c); var f = fn(l); f.conds.push({ id: 'dem', lvl: 0, onset: l.age, stage: 'diagnosed' }); apply(f); log('Kết quả: ' + DEM[c.type] + ' giai đoạn nhẹ' + (c.early ? ' (khởi phát sớm; chỉ một phần nhỏ trường hợp do gen trội — cần tư vấn di truyền riêng)' : '') + '.', 'bad'); } }
  // Chăm sóc dài hạn: chi phí năm theo phương án (× thu nhập cơ sở), người chăm trong gia đình chịu tải.
  var CARE = { self: ['Tự lo sinh hoạt', 0], family: ['Người thân hỗ trợ', 0], aide2: ['Người giúp việc chăm sóc 2 giờ/ngày', 0.12], aide6: ['Người chăm sóc 6 giờ/ngày', 0.35], day: ['Trung tâm chăm sóc ban ngày', 0.18], facility: ['Cơ sở chăm sóc dài hạn', 0.6] };
  function careYear(l, log) {
    var s = st(l), p = s.care; if (!p || p.paidAt === l.age) return; p.paidAt = l.age; var C = CARE[p.kind]; if (!C) return;
    if (C[1] > 0) { var oop = pay(l, l.base * C[1] * Math.max(0.5, Math.min(2, gdp(l) / 20)), C[0], 'ltc'); if (l.money < 0 && p.kind === 'facility') log && log('Chi phí cơ sở chăm sóc vượt khả năng chi trả; gia đình cần xem lại phương án.', 'bad'); }
    if (p.kind === 'family' && p.carer) { p.burden = U.clamp((p.burden || 20) + 8 - (p.respite === l.age ? 15 : 0), 0, 100); if (p.burden >= 80 && p.warnAt !== l.age) { p.warnAt = l.age; log && log(p.carer + ' kiệt sức vì chăm sóc lâu ngày. Có thể thuê thêm người hỗ trợ hoặc cho người chăm được nghỉ.', 'bad'); } }
  }
  function careWhy(l, k) { if (k === 'facility' && gdp(l) < 4 && st(l).care && st(l).care.kind !== 'facility') return 'Nơi bạn sống rất ít cơ sở chăm sóc dài hạn; cần đăng ký chờ'; if (k === 'family' && !carers(l).length) return 'Không có người thân ở gần sẵn sàng hỗ trợ'; return true; }
  function carers(l) { var out = []; if (l.partner && l.partner.alive !== false && l.partner.age < 85) out.push(l.partner.name); (l.kids || []).forEach(function (k) { if (k.alive !== false && l.age - k.born >= 18 && k.custody !== 'other') out.push(k.name); }); return out; }
  function falls(l, log) { var f = fn(l), a = l.age; if (a < 70) return; var p = 0.04 * (f.eff && f.eff.mobility < 60 ? 2 : 1) * (E.AGEING899 && E.AGEING899.state(l).adapted ? 0.7 : 1) * (f.devices.walker4 && f.devices.walker4.ready ? 0.8 : 1); if (u(l.id + ':fall919:' + a) < p) { H.fx(l, { hea: -4, hap: -2 }); if (!f.conds.some(function (c) { return c.id === 'agemob'; }) && u(l.id + ':fallc:' + a) < 0.4) addCond(l, 'self', 'agemob', 1, a); log('Bạn bị ngã trong nhà. Sau đợt hồi phục, việc đi lại cần cẩn thận hơn; sắp xếp lại chỗ ở và dụng cụ hỗ trợ giúp giảm nguy cơ.', 'bad'); } }

  // ================= D03: trông trẻ khi cha mẹ đi làm =================
  var CC = { grand: 'Ông bà trông cháu', grandPart: 'Ông bà trông một phần, gửi trẻ phần còn lại', daycare: 'Gửi nhà trẻ / mẫu giáo', nanny: 'Thuê bảo mẫu', partner: 'Bạn đời ở nhà / làm linh hoạt để trông con', self: 'Bạn giảm giờ làm để trông con' };
  function youngest(l) { var ks = (l.kids || []).filter(function (k) { return k.alive !== false && l.age - k.born < 6 && k.custody !== 'other' && k.custody !== 'ex'; }); return ks; }
  function grandOk(l) { var f = l.fam || {}, a = l.age, ok = [];
    if (f.mAlive && f.mAge + a < 78) ok.push('mẹ'); if (f.fAlive && !f.noDad && f.fAge + a < 78) ok.push('bố');
    if (!ok.length) return 'Ông bà không còn hoặc tuổi đã cao'; if (l.abroad && !(l.flags.id919 && (l.flags.id919.familyRes || []).indexOf(res(l)) >= 0)) return 'Ông bà sống ở nước khác';
    if (u(l.id + ':grandwill:' + (l.kids.length)) < 0.25) return 'Ông bà còn đi làm/có kế hoạch riêng, chỉ giúp được khi cần gấp'; return true; }
  function ccCost(l, k, n) { var g = Math.max(0.5, Math.min(2.5, gdp(l) / 15)); return l.base * n * g * { grand: 0, grandPart: 0.05, daycare: 0.12, nanny: 0.3, partner: 0, self: 0 }[k]; }
  function preschoolNote(l) { var c = res(l); return c === 'VN' ? 'Việt Nam: mầm non công lập được miễn học phí từ năm học 2025–2026; tiền ăn, giữ trẻ ngoài giờ, dịch vụ vẫn trả riêng; còn phụ thuộc chỗ trống.' : c === 'FR' ? 'Pháp: đi học bắt buộc từ 3 tuổi (trường mẫu giáo công miễn học phí); giữ trẻ dưới 3 tuổi có phí.' : 'Mẫu giáo bắt buộc/miễn phí hay không tùy nước, năm, tuổi và loại trường; học phí, giữ trẻ, ăn, xe đưa đón là các khoản riêng.'; }
  var cy0 = E.careerYear; E.careerYear = function (l, r, log) { var out = cy0.apply(this, arguments); if (!(out > 0) || !l || !l.flags || !l.flags.care919) return out; var c = l.flags.care919.cc; if (c && c.at != null && youngest(l).length) { if (c.kind === 'self') out *= 0.6; else if (c.kind === 'none') out *= l.partner && l.partner.alive !== false ? 0.9 : 0.75; } return out; };
  function ccYear(l, log) {
    var s = st(l), ks = youngest(l), working = !!l.job && !l.retired; if (!ks.length) { if (s.cc && s.cc.kind) s.cc.ended = l.age; return; }
    if (!s.cc || s.cc.ended != null) { s.cc = { kind: working ? 'none' : 'home', at: l.age }; if (working) X.next(l, 'childcare919', function () { return 0.5; }, {}, { manual: false }); }
    var c = s.cc; if (c.kind === 'grand' || c.kind === 'grandPart') { var g = grandOk(l); if (g !== true && !/chỉ giúp/.test(g)) { log('Ông bà không thể tiếp tục trông cháu (' + g.toLowerCase() + '); cần phương án khác.', 'neutral'); c.kind = working ? 'none' : 'home'; X.next(l, 'childcare919', function () { return 0.5; }, {}, { manual: false }); } }
    var n = ks.filter(function (k) { return l.age - k.born >= 1; }).length; if (c.paidAt !== l.age && n && ccCost(l, c.kind, n) > 0) { c.paidAt = l.age; H.cash(l, -ccCost(l, c.kind, n), CC[c.kind] + ' (' + n + ' trẻ)'); }
    if (c.kind === 'none' && working && c.warnAt !== l.age) { c.warnAt = l.age; log('Chưa có người trông con nhỏ khi bạn đi làm: bạn phải xin về sớm, giảm giờ — thu nhập năm nay thấp hơn.', 'neutral'); }
  }
  X.menu('childcare919', 'Trông con nhỏ khi đi làm', function (l) { var r = X.reason(l, 16); if (r !== true) return r; return youngest(l).length ? true : 'Không có con dưới 6 tuổi'; }, function (l) {
    var c = st(l).cc || {}; return 'Trẻ nhỏ luôn cần người chịu trách nhiệm trông nom. Ông bà có thể giúp nếu sức khỏe, khoảng cách và mong muốn phù hợp — có thể từ chối hoặc chỉ giúp một phần. ' + preschoolNote(l) + '\nĐang chọn: ' + (CC[c.kind] || (c.kind === 'home' ? 'Bạn ở nhà với con' : 'chưa có phương án — thu nhập bị ảnh hưởng')) + '.';
  }, function (l) {
    var n = Math.max(1, youngest(l).filter(function (k) { return l.age - k.born >= 1; }).length), g = grandOk(l), cur = (st(l).cc || {}).kind;
    return [['grand', g], ['grandPart', g === true || /chỉ giúp/.test(g) ? true : g], ['daycare', u(l.id + ':slot919:' + l.age) < (l.urban ? 0.8 : 0.6) ? true : 'Năm nay nhà trẻ gần nhà hết chỗ, đăng ký năm sau'], ['nanny', true], ['partner', l.partner && l.partner.alive !== false ? true : 'Không có bạn đời sống cùng'], ['self', true]].map(function (x) {
      var cost = ccCost(l, x[0], n); return { k: x[0], l: (cur === x[0] ? '✓ ' : '') + CC[x[0]], h: (cost ? '~' + mo(l, cost) + '/năm' : 'Không tốn phí') + (x[0] === 'self' ? ' · thu nhập giảm' : ''), why: cur === x[0] ? 'Đang dùng' : x[1], run: function (l, r, log) { var s = st(l); s.cc = { kind: x[0], at: l.age }; log('Phương án trông con: ' + CC[x[0]].toLowerCase() + '.', 'neutral'); } };
    });
  }, 16, 'Gia đình');

  // ================= D04: chăm sóc giảm nhẹ, cuối đời, bucket list =================
  function serious(l) { var i = l.ill; if (!i) return st(l).cog && st(l).cog.stage === 'dem' && st(l).cog.lvl >= 1; var s = i.plan915 && i.plan915.stage; return (typeof s === 'number' ? s >= 3 : /III|IV/.test(String(s || ''))) || (i.mult || 0) >= 3 || !!(i.organ917 && /G4|G5|mất bù/.test(JSON.stringify(i.organ917))); }
  function prognosis(l) { var i = l.ill, m = i ? i.mult || 1 : 1; return m >= 5 ? 'vài tháng đến khoảng một năm, có thể khác nhiều' : m >= 3 ? 'một đến vài năm, rất khó đoán' : 'nhiều năm với theo dõi phù hợp'; }
  var SETTING = { hospital: 'Đơn vị chăm sóc giảm nhẹ ở bệnh viện', home: 'Tại nhà, điều dưỡng/bác sĩ đến thăm', community: 'Dịch vụ chăm sóc cộng đồng' };
  X.menu('palliative919', 'Chăm sóc giảm nhẹ và di nguyện chăm sóc', function (l) { var r = X.reason(l, 0); if (r !== true && !/tự do/.test(r)) return r; return serious(l) ? true : 'Dành cho người đang có bệnh nặng hoặc tiến triển'; }, function (l) {
    var p = st(l).pal || {}; return 'Chăm sóc giảm nhẹ hỗ trợ triệu chứng, tinh thần và gia đình; có thể đi song song điều trị bệnh ngay từ sớm và không có nghĩa là bỏ điều trị. Tiên lượng hiện tại: ' + prognosis(l) + '. Trả thêm tiền không bảo đảm sống lâu hơn; chọn chăm sóc ít tốn kém hơn không bị coi là sai.' +
      (l.age < 18 ? ' Với trẻ em, cha mẹ/người giám hộ cùng đội ngũ y tế quyết định, trẻ được lắng nghe theo độ tuổi.' : '') +
      '\nĐang dùng: ' + (p.setting ? SETTING[p.setting] : 'chưa') + (p.wishes ? ' · Di nguyện chăm sóc: ' + p.wishes : '') + (p.proxy ? ' · Người đại diện: ' + p.proxy : '') + '. Di nguyện chăm sóc khác di chúc tài sản.';
  }, function (l) {
    var p = st(l).pal || (st(l).pal = {}), g = gdp(l), out = [];
    Object.keys(SETTING).forEach(function (k) { var avail = k === 'hospital' ? g >= 6 || l.urban : k === 'community' ? g >= 15 : true; out.push({ k: 'set:' + k, l: (p.setting === k ? '✓ ' : '') + SETTING[k], h: 'Chi phí tự trả theo bảo hiểm nơi sống', why: p.setting === k ? 'Đang dùng' : avail ? true : 'Nơi bạn sống chưa có dịch vụ này', run: function (l, r, log) { p.setting = k; p.since = p.since == null ? l.age : p.since; pay(l, l.base * (k === 'hospital' ? 0.08 : 0.05), SETTING[k], 'palliative'); H.fx(l, { hap: 4 }); if (l.mind) l.mind.stress = U.clamp(l.mind.stress - 8, 0, 100); log('Bắt đầu chăm sóc giảm nhẹ: ' + SETTING[k].toLowerCase() + '. Đau, mệt và lo âu được kiểm soát tốt hơn; điều trị bệnh vẫn tiếp tục nếu bạn muốn.', 'good'); } }); });
    if (!p.wishes) out.push({ k: 'wish', l: 'Trò chuyện với gia đình về mong muốn chăm sóc', run: function (l, r, log) { p.wishes = ['ở nhà khi có thể', 'gần người thân', 'không muốn can thiệp kéo dài khi không còn lợi ích', 'được nghe nhạc, gặp bạn bè'][Math.floor(u(l.id + ':wish:' + l.age) * 4)]; H.fx(l, { hap: 3 }); log('Gia đình lắng nghe mong muốn của bạn: ' + p.wishes + '. Điều này không thay đổi di chúc tài sản.', 'good'); } });
    var c = carers(l); if (!p.proxy && c.length) out.push({ k: 'proxy', l: 'Chọn người đại diện quyết định y tế: ' + c[0], run: function (l, r, log) { p.proxy = c[0]; log(c[0] + ' đồng ý làm người đại diện khi bạn không thể tự quyết.', 'neutral'); } });
    out.push({ k: 'visit', l: 'Mời bạn bè, người thân đến thăm', why: p.visitAt === l.age ? 'Đã có buổi gặp năm nay' : true, run: function (l, r, log) { p.visitAt = l.age; H.fx(l, { hap: 5, soc: 2 }); log('Một buổi chiều ấm áp bên những người thân quen.', 'good'); } });
    return out;
  }, 0, 'Sức khỏe');
  var BK = { travel: 'Đến thăm', meet: 'Gặp người nổi tiếng mình ngưỡng mộ', perform: 'Biểu diễn trước khán giả một lần', reunion: 'Đoàn tụ với', learn: 'Học được', reconcile: 'Làm hòa với' };
  var DREAM = ['JP', 'FR', 'IT', 'US', 'KR', 'GB', 'AU', 'CH', 'EG', 'PE', 'IS', 'NZ', 'TR', 'ES'];
  function bk(l) { var s = st(l); if (!s.bucket) s.bucket = { items: [], serial: 0 }; return s.bucket; }
  function addItem(l, kind, target, text) { var b = bk(l); if (b.items.filter(function (i) { return i.status === 'open'; }).length >= 6) return null; if (b.items.some(function (i) { return i.kind === kind && i.target === target && i.status !== 'dropped'; })) return null; var it = { id: 'b' + (++b.serial), kind: kind, target: target, text: text, at: l.age, status: 'open', tries: 0 }; b.items.push(it); return it; }
  function suggest(l) {
    var x = u(l.id + ':bk:' + l.age), c = DREAM.filter(function (d) { return d !== res(l) && W.BY[d]; })[Math.floor(x * 10) % 12];
    if (c) addItem(l, 'travel', c, BK.travel + ' ' + W.BY[c].name);
    if (x < 0.5) addItem(l, 'learn', x < 0.25 ? 'lang:' + ['es', 'ja', 'fr', 'it'][Math.floor(x * 16) % 4] : 'art', BK.learn + ' ' + (x < 0.25 ? (E.ID919 ? E.ID919.lname(['es', 'ja', 'fr', 'it'][Math.floor(x * 16) % 4]) : 'một ngoại ngữ') : 'một nhạc cụ/điệu nhảy'));
    if (x > 0.6) addItem(l, 'perform', 'stage', BK.perform);
    var sib = (l.sibList || []).find(function (t) { return t.alive !== false && (t.close || 60) < 45; }); if (sib) addItem(l, 'reunion', 'sib:' + (sib.n || sib.name), BK.reunion + ' ' + (sib.n || sib.name));
    if (x > 0.8) addItem(l, 'meet', 'celeb', BK.meet);
  }
  function attempt(l, it, log) {
    if (it.status !== 'open') return; it.tries++; it.lastTry = l.age; var ok = false, why = '';
    if (it.kind === 'travel') { var e = E.GLOBAL919 ? E.GLOBAL919.entry(l.country, it.target) : { kind: 'free' }, fv = E.GLOBAL919 && E.GLOBAL919.state(l).famVisa[it.target], granted = fv && fv.me && fv.me.ok && fv.me.until >= l.age, cost = l.base * (gdp(l) >= 30 ? 0.08 : 0.25), able = fn(l).eff ? fn(l).eff.mobility >= 30 || fn(l).devices.wheel || fn(l).devices.ewheel : true;
      if ((e.kind === 'visa' || e.kind === 'eta') && !granted) why = 'Cần ' + (e.kind === 'eta' ? 'phép điện tử' : 'thị thực') + ' trước (mục Giấy tờ đi lại của cả gia đình)'; else if (l.money < cost) why = 'Chưa đủ tiền chuyến đi (~' + mo(l, cost) + ')'; else if (!able) why = 'Cần thu xếp hỗ trợ đi lại phù hợp sức khỏe'; else { H.cash(l, -cost, 'Chuyến đi trong danh sách mơ ước'); ok = true; } }
    else if (it.kind === 'learn') { var lv = /^lang:/.test(it.target) ? (E.ID919 ? E.ID919.skill(l, it.target.slice(5)) : 0) : E.ARTS919 ? E.ARTS919.best(l) : 0; ok = lv >= 45; if (!ok) why = 'Cần luyện thêm (hiện ' + Math.round(lv) + '/45)'; }
    else if (it.kind === 'perform') { ok = (E.ARTS919 ? E.ARTS919.best(l) : 0) >= 25 || u(l.id + ':perf:' + it.tries) < 0.5; if (!ok) why = 'Chưa có dịp phù hợp; có thể thử ở sự kiện cộng đồng năm sau'; }
    else if (it.kind === 'meet') { ok = u(l.id + ':meet:' + it.tries + ':' + l.age) < 0.25; if (!ok) why = 'Người ấy từ chối lịch hẹn riêng; vẫn có thể gặp ở buổi giao lưu sau'; }
    else if (it.kind === 'reunion' || it.kind === 'reconcile') { var t = (l.sibList || []).find(function (q) { return 'sib:' + (q.n || q.name) === it.target; }); if (!t || t.alive === false) { it.status = 'dropped'; log('Không thể thực hiện "' + it.text + '" nữa; kỷ niệm vẫn được giữ.', 'neutral'); return; } ok = u(l.id + ':re:' + it.tries + ':' + l.age) < 0.45 + (t.close || 40) / 200; if (ok) t.close = Math.min(100, (t.close || 40) + 20); else why = (t.n || t.name) + ' cần thêm thời gian; không ai bị ép phải gặp'; }
    if (ok) { it.status = 'done'; it.doneAt = l.age; H.fx(l, { hap: 8 }); H.mem(l, 'Hoàn thành điều mong ước: ' + it.text + '.', 6); log('Bạn đã làm được điều trong danh sách mơ ước: ' + it.text + '.', 'big'); }
    else log('Chưa thực hiện được "' + it.text + '": ' + why + '.', 'neutral');
  }
  X.menu('bucket919', 'Danh sách mong ước trong đời (bucket list)', function (l) { return X.reason(l, 16); }, function (l) {
    var b = bk(l); return 'Mong ước có thể đến ở bất kỳ tuổi nào, không cần bệnh nặng. Mỗi điều cần điều kiện thật: giấy tờ, tiền, sức khỏe, sự đồng ý của người khác. Hoàn thành được ghi nhận một lần.\n' + (b.items.map(function (i) { return '• ' + i.text + ' — ' + { open: 'chưa làm' + (i.tries ? ' (đã thử ' + i.tries + ' lần)' : ''), done: 'đã làm năm ' + i.doneAt + ' tuổi', dropped: 'đã bỏ' }[i.status]; }).join('\n') || 'Chưa có mong ước nào.');
  }, function (l) {
    var b = bk(l), out = [];
    b.items.filter(function (i) { return i.status === 'open'; }).forEach(function (i) { out.push({ k: 'do:' + i.id, l: 'Thực hiện: ' + i.text, why: i.lastTry === l.age ? 'Đã thử năm nay' : true, run: function (l, r, log) { attempt(l, i, log); } }); out.push({ k: 'drop:' + i.id, l: 'Bỏ khỏi danh sách: ' + i.text, run: function () { i.status = 'dropped'; } }); });
    DREAM.filter(function (c) { return W.BY[c] && c !== res(l); }).slice(0, 6).forEach(function (c) { if (b.items.some(function (i) { return i.target === c && i.status !== 'dropped'; })) return; out.push({ k: 'add:' + c, l: 'Thêm mong ước: đến ' + W.BY[c].name, run: function (l) { addItem(l, 'travel', c, BK.travel + ' ' + W.BY[c].name); } }); });
    return out.slice(0, 40);
  }, 16, 'Bản thân');

  // ================= D05: trẻ sơ sinh =================
  // Nguy cơ cơ sở (gameplay, mức hiếm): 0,4/1000 trẻ dưới 1 tuổi; sinh non ×2,5, nhẹ cân ×1,5, hút thuốc trong nhà ×2, ngủ an toàn ×0,6.
  // Máy theo dõi/baby monitor KHÔNG tham gia công thức.
  var SUID = { base: 0.0004, pre: 2.5, lbw: 1.5, smoke: 2, safe: 0.6, choke: 0.003 };
  function infant(l, k) { if (k.infant919) return k.infant919; var id = l.id + ':inf919:' + X.uid(l, k), pre = u(id + ':pre') < 0.09, lbw = pre ? u(id + ':lbw') < 0.6 : u(id + ':lbw') < 0.03; k.infant919 = { pre: pre, lbw: lbw, roll: u(id + ':roll'), month: 1 + Math.floor(u(id + ':m') * 6), at: k.born }; return k.infant919; }
  function suidRisk(l, k) { var i = infant(l, k), s = st(l); return SUID.base * (i.pre ? SUID.pre : 1) * (i.lbw ? SUID.lbw : 1) * (l.flags.smokeHome ? SUID.smoke : 1) * (s.safeSleep ? SUID.safe : 1); }
  function infantYear(l, log) {
    var s = st(l);
    (l.kids || []).forEach(function (k) {
      if (k.alive === false) return; var age = l.age - k.born; if (age > 1) return; var i = infant(l, k);
      if (age === 0 && !i.seen) { i.seen = true; if (i.pre) log(k.name + ' sinh non' + (i.lbw ? ', nhẹ cân' : '') + '; cần theo dõi thêm trong năm đầu.', 'neutral'); if (!k.fn919 && !(k.adopted || k.adopt)) birthConds(l, k, l.id + ':kfn919:' + X.uid(l, k)); }
      if (age === 1 && !i.done) { i.done = true; if (i.roll < suidRisk(l, k)) { k.alive = false; k.died = l.age - 1; i.event = { month: i.month, cls: 'pending' }; s.review = { kid: k.name, uid: X.uid(l, k), at: l.age, safe: !!s.safeSleep }; log('Nỗi đau không lời: ' + k.name + ' ra đi khi đang ngủ lúc ' + i.month + ' tháng tuổi. Đội ngũ y tế sẽ đánh giá để tìm hiểu nguyên nhân; đây không phải lỗi của người chăm sóc.', 'bad'); H.mem(l, 'Ngày mất bé ' + k.name + '.', 8); l.st.hap -= 22; } }
      if (age === 0 && !i.chokeDone && u(l.id + ':choke:' + X.uid(l, k)) < SUID.choke) { i.chokeDone = true; var trained = s.aid && s.aid.until >= l.age, ok = u(l.id + ':chokeok:' + X.uid(l, k)) < (trained ? 0.92 : 0.75); log(k.name + ' bị sặc khi ăn. ' + (trained ? 'Nhờ đã học sơ cứu, bạn xử trí ngay và gọi cấp cứu. ' : 'Cả nhà gọi cấp cứu. ') + (ok ? 'Bé ổn sau khi được kiểm tra.' : 'Bé phải nằm viện theo dõi vài ngày rồi hồi phục.'), ok ? 'neutral' : 'bad'); }
    });
    if (s.review && s.review.at < l.age && !s.review.done) { var r0 = s.review, x = u(l.id + ':rev:' + r0.uid), cls = r0.safe ? (x < 0.6 ? 'sids' : 'unknown') : (x < 0.45 ? 'sids' : x < 0.7 ? 'accident' : 'unknown'); r0.done = true; r0.cls = cls; log('Kết quả đánh giá về sự ra đi của ' + r0.kid + ': ' + { sids: 'được xác định là hội chứng đột tử ở trẻ sơ sinh (SIDS) sau khi đã loại trừ các nguyên nhân khác', accident: 'liên quan đến môi trường ngủ (tai nạn ngạt khi ngủ); nhân viên y tế hướng dẫn cách ngủ an toàn cho những lần sau, không quy lỗi', unknown: 'không xác định được nguyên nhân dù đã khám nghiệm đầy đủ' }[cls] + '. Gia đình được giới thiệu nhóm hỗ trợ người mất con.', 'neutral'); }
    if (s.monitor && s.monitor.on && (l.kids || []).some(function (k) { return k.alive !== false && l.age - k.born <= 1; }) && s.monitor.alarmAt !== l.age && u(l.id + ':alarm:' + l.age) < 0.35) { s.monitor.alarmAt = l.age; if (l.mind) l.mind.stress = U.clamp(l.mind.stress + 3, 0, 100); log('Máy theo dõi em bé báo động lúc nửa đêm vì tuột cảm biến; bé vẫn ngủ bình thường. Báo động giả không phải chẩn đoán.', 'neutral'); }
    if (s.monitor && s.monitor.on && s.monitor.batAt !== l.age) { s.monitor.batAt = l.age; H.cash(l, -l.base * 0.002, 'Pin, phụ kiện máy theo dõi em bé'); }
  }
  X.menu('infant919', 'Chăm sóc trẻ sơ sinh: giấc ngủ an toàn, sơ cứu, máy theo dõi', function (l) { var r = X.reason(l, 16); if (r !== true) return r; return (l.kids || []).some(function (k) { return k.alive !== false && l.age - k.born <= 1; }) || l.partner && l.partner.pregnant ? true : 'Dành cho gia đình có trẻ dưới 1 tuổi'; }, function (l) {
    var s = st(l); return 'Giấc ngủ an toàn (nằm ngửa, mặt nệm cứng, không chăn gối mềm, ngủ cùng phòng không cùng giường, không khói thuốc) giúp giảm nguy cơ đột tử khi ngủ nhưng không loại bỏ hoàn toàn. Máy theo dõi tiêu dùng giúp nghe/nhìn bé, KHÔNG phát hiện hay giảm nguy cơ SIDS (NICHD), có thể báo động giả và không thay người trông. Khóa sơ cứu không thay cho cấp cứu chuyên nghiệp.' +
      '\nĐã học ngủ an toàn: ' + (s.safeSleep ? 'có' : 'chưa') + ' · Sơ cứu trẻ nhỏ: ' + (s.aid && s.aid.until >= l.age ? 'chứng nhận còn hạn đến ' + s.aid.until + ' tuổi' : 'chưa/hết hạn') + ' · Máy theo dõi: ' + (s.monitor ? (s.monitor.on ? 'đang dùng' : 'cất đi') + ' (mua lúc ' + s.monitor.at + ' tuổi)' : 'chưa có') + '.';
  }, function (l) {
    var s = st(l), out = [{ k: 'safe', l: 'Học hướng dẫn giấc ngủ an toàn', h: 'Miễn phí ở trạm y tế/bệnh viện', why: s.safeSleep ? 'Đã học' : true, run: function (l, r, log) { s.safeSleep = true; log('Cả nhà thống nhất cách cho bé ngủ an toàn.', 'good'); } },
      { k: 'aid', l: 'Học khóa sơ cứu trẻ nhỏ có chứng nhận', h: mo(l, l.base * 0.01) + ' · hiệu lực 2 năm', why: s.aid && s.aid.until > l.age ? 'Chứng nhận còn hạn' : true, run: function (l, r, log) { H.cash(l, -l.base * 0.01, 'Khóa sơ cứu trẻ nhỏ'); s.aid = { at: l.age, until: l.age + 2 }; log('Bạn hoàn thành khóa sơ cứu trẻ nhỏ. Kỹ năng giúp xử trí ban đầu, không bảo đảm mọi trường hợp.', 'good'); } }];
    if (!s.monitor) out.push({ k: 'monitor', l: 'Mua máy theo dõi em bé (nghe/nhìn)', h: mo(l, l.base * 0.015) + ' · không giảm nguy cơ SIDS', run: function (l, r, log) { H.cash(l, -l.base * 0.015, 'Máy theo dõi em bé'); s.monitor = { at: l.age, on: true }; log('Lắp máy theo dõi để nghe/nhìn bé từ phòng khác.', 'neutral'); } });
    else out.push({ k: 'monitorToggle', l: s.monitor.on ? 'Cất máy theo dõi' : 'Dùng lại máy theo dõi cũ cho bé mới', why: !s.monitor.on && l.age - s.monitor.at > 8 ? 'Máy quá cũ, nên thay' : true, run: function (l) { s.monitor.on = !s.monitor.on; } });
    return out;
  }, 16, 'Gia đình');

  // ================= D02 menu =================
  function people(l) { var out = [{ who: 'self', name: 'Bạn', f: fn(l) }]; (l.kids || []).forEach(function (k) { if (k.alive !== false && k.fn919 && l.age - k.born < 18) out.push({ who: k, name: k.name, f: k.fn919 }); }); return out; }
  X.menu('function919', 'Năng lực chức năng, thiết bị và hỗ trợ tiếp cận', function (l) { var r = X.reason(l, 6); if (r !== true) return r; return people(l).some(function (p) { return p.f.conds.length; }) ? true : 'Chưa ghi nhận nhu cầu hỗ trợ'; }, function (l) {
    return 'Mỗi người có nhu cầu khác nhau; chẩn đoán không quyết định trí tuệ, tính cách hay quyền học tập, làm việc, yêu thương, nuôi con. Thiết bị cần đánh giá phù hợp; đắt hơn không có nghĩa tốt hơn; thiết bị hỗ trợ chứ không chữa khỏi.\n' + people(l).filter(function (p) { return p.f.conds.length; }).map(function (p) { apply(p.f); return '• ' + p.name + ': ' + p.f.conds.map(function (c) { return COND[c.id] ? COND[c.id].n + ' (' + LV[c.lvl] + ', ' + { unnoticed: 'chưa nhận ra', suspected: 'nghi ngờ, chưa đánh giá', diagnosed: 'đã đánh giá' }[c.stage] + ')' : DEM[(st(l).cog || {}).type] || 'sa sút trí tuệ'; }).join(', ') + '; chức năng sau hỗ trợ: ' + F.filter(function (k) { return p.f.eff[k] < 100; }).map(function (k) { return FN[k] + ' ' + p.f.eff[k]; }).join(', ') + (Object.keys(p.f.devices).length ? '; thiết bị: ' + Object.keys(p.f.devices).map(function (d) { return DEV[d].n + (p.f.devices[d].ready ? '' : ' (đang làm quen)'); }).join(', ') : '') + (p.who === 'self' ? '; mức tự lập ' + independence(p.f) + '/100' : ''); }).join('\n') +
      '\nChó hỗ trợ: ' + (ACCESS[res(l)] || 'Quyền đi cùng tùy luật từng nước (chưa xác minh).') + (st(l).dog ? ' Hồ sơ: ' + (st(l).dog.ready ? 'đã có chó hỗ trợ' : 'đang chờ ghép chó đã huấn luyện') + '.' : '');
  }, function (l) {
    var out = [];
    people(l).forEach(function (p) {
      if (p.f.conds.some(function (c) { return c.stage === 'suspected'; })) out.push({ k: 'as:' + (p.who === 'self' ? 'me' : p.who.uid110), l: 'Đưa ' + (p.who === 'self' ? 'bản thân' : p.name) + ' đi đánh giá chuyên môn', h: mo(l, l.base * 0.03) + ' trước bảo hiểm', run: function (l, r, log) { assess(l, p.who, log, p.name); } });
      devOptions(p.f).forEach(function (d) { out.push({ k: 'dv:' + d + ':' + (p.who === 'self' ? 'me' : p.who.uid110), l: DEV[d].n + (p.who === 'self' ? '' : ' cho ' + p.name), h: '~' + mo(l, l.base * DEV[d].cost) + ' trước bảo hiểm/trợ cấp · bảo dưỡng ' + mo(l, l.base * DEV[d].keep) + '/năm', why: l.money >= l.base * DEV[d].cost * 0.3 ? true : 'Chưa đủ tiền phần tự trả', run: function (l, r, log) { buyDev(l, p.who, d, log, p.who === 'self' ? '' : p.name); } }); });
      if (p.f.conds.some(function (c) { return c.id === 'hearing' && c.stage === 'diagnosed' && c.lvl >= 2; }) && E.ID919) { var sl = E.ID919.signOf(res(l)), idst = E.ID919.state(l); if ((idst.signHome || []).indexOf(sl) < 0) out.push({ k: 'sign:' + (p.who === 'self' ? 'me' : p.who.uid110), l: 'Cả nhà học ' + E.ID919.lname(sl) + ' để giao tiếp với ' + (p.who === 'self' ? 'bạn' : p.name), h: 'Tiến bộ dần theo năm, mỗi người khác nhau', run: function (l, r, log) { var q = E.ID919.state(l); q.signHome = (q.signHome || []).concat([sl]); log('Gia đình bắt đầu học ' + E.ID919.lname(sl) + '. Đây là một ngôn ngữ đầy đủ, không phải bản dịch từng chữ của tiếng nói.', 'good'); } }); }
    });
    var me = fn(l);
    if (me.conds.some(function (c) { return c.stage === 'diagnosed' && /vision|hearing|cp/.test(c.id); }) && !st(l).dog && l.age >= 12) out.push({ k: 'dog', l: 'Đăng ký chó hỗ trợ đã được huấn luyện', h: 'Chờ 1–2 năm · chăm sóc ~' + mo(l, l.base * 0.04) + '/năm', run: function (l, r, log) { st(l).dog = { at: l.age, due: l.age + 1 + Math.floor(u(l.id + ':dogw') * 2), ready: false }; log('Hồ sơ đăng ký chó hỗ trợ đã gửi tổ chức huấn luyện; thời gian chờ tùy nguồn chó phù hợp.', 'neutral'); } });
    if (me.conds.some(function (c) { return c.stage === 'diagnosed'; }) && (l.school || l.job)) out.push({ k: 'acc', l: 'Đề nghị điều chỉnh hợp lý ở ' + (l.school ? 'trường học' : 'nơi làm việc'), why: me.acc.at === l.age ? 'Đã đề nghị năm nay' : true, run: function (l, r, log) { me.acc.at = l.age; me.acc.ok = u(l.id + ':acc:' + l.age) < (gdp(l) >= 20 ? 0.85 : 0.6); if (me.acc.ok && l.mind) l.mind.stress = U.clamp(l.mind.stress - 6, 0, 100); log(me.acc.ok ? 'Được bố trí tài liệu tiếp cận, chỗ ngồi/giờ giấc phù hợp.' : 'Đề nghị mới được đáp ứng một phần; có thể nhờ tổ chức hỗ trợ người khuyết tật can thiệp.', me.acc.ok ? 'good' : 'neutral'); } });
    var c = st(l).cog; if (c && c.stage === 'symptoms') out.push({ k: 'cog', l: 'Đi đánh giá trí nhớ, nhận thức', run: function (l, r, log) { evaluateCog(l, log); } });
    if (c && c.stage === 'dem' && c.lvl < 2 && !st(l).proxy) { var cs = carers(l); if (cs.length) out.push({ k: 'proxy', l: 'Chọn người đại diện và ghi kế hoạch chăm sóc khi còn tự quyết: ' + cs[0], run: function (l, r, log) { st(l).proxy = cs[0]; log('Bạn ghi lại mong muốn chăm sóc và chọn ' + cs[0] + ' làm người đại diện.', 'neutral'); } }); }
    if (l.age >= 55) Object.keys(CARE).forEach(function (k) { var cur = st(l).care && st(l).care.kind; out.push({ k: 'care:' + k, l: (cur === k ? '✓ ' : '') + 'Chăm sóc dài hạn: ' + CARE[k][0], h: CARE[k][1] ? '~' + mo(l, l.base * CARE[k][1]) + '/năm trước bảo hiểm' : '', why: cur === k ? 'Đang dùng' : careWhy(l, k), run: function (l, r, log) { var s = st(l), cs = carers(l); s.care = { kind: k, at: l.age, carer: k === 'family' ? cs[0] : null, burden: 20 }; log('Phương án chăm sóc: ' + CARE[k][0].toLowerCase() + (k === 'family' ? ' (' + cs[0] + ' hỗ trợ; không ai buộc phải nghỉ việc)' : '') + '.', 'neutral'); } }); });
    if (st(l).care && st(l).care.kind === 'family') out.push({ k: 'respite', l: 'Thuê người chăm thay để người thân được nghỉ', h: mo(l, l.base * 0.03), run: function (l, r, log) { st(l).care.respite = l.age; H.cash(l, -l.base * 0.03, 'Chăm sóc thay thế ngắn ngày'); log('Người chăm sóc trong gia đình được nghỉ ngơi vài tuần.', 'good'); } });
    return out.slice(0, 50);
  }, 6, 'Sức khỏe');

  // ================= hook năm, tạo đời =================
  var create0 = E.createLife; E.createLife = function (o) { var l = create0.apply(this, arguments); if (l && l.flags && l.age === 0) birthConds(l, 'self', l.id + ':fn919'); return l; };
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !l.flags || !['vn', 'world'].includes(l.mode)) return;
    var s = st(l), f = fn(l); if (s.yearAt === l.age) return; s.yearAt = l.age;
    spotYear(l, 'self', f, l.age, log); devYear(l, f);
    (l.kids || []).forEach(function (k) { if (k.alive !== false && k.fn919 && l.age - k.born < 18) { spotYear(l, k, k.fn919, l.age - k.born, log, k.name); devYear(l, k.fn919); } });
    if (l.age >= 60) { var x = u(l.id + ':acq919:' + l.age); if (x < 0.02 + (l.age - 60) * 0.002) addCond(l, 'self', 'agehear', x < 0.01 ? 1 : 0, l.age); else if (x > 0.985 - (l.age - 60) * 0.001) addCond(l, 'self', 'cataract', 1, l.age); }
    cogYear(l, log); careYear(l, log); falls(l, log); ccYear(l, log); infantYear(l, log);
    if (s.dog && !s.dog.ready && l.age >= s.dog.due) { s.dog.ready = true; if (H.addPet) { var d = H.addPet(l, r, 'chó', 'chó hỗ trợ (Labrador)'); d.service919 = true; s.dog.pet = d.n; } log('Bạn nhận chó hỗ trợ đã được huấn luyện; hai bên cần vài tháng làm quen. Đây là chó làm nhiệm vụ, không phải thú cưng thông thường.', 'good'); }
    if (s.dog && s.dog.ready && s.dog.keptAt !== l.age) { s.dog.keptAt = l.age; H.cash(l, -l.base * 0.04, 'Chăm sóc chó hỗ trợ'); }
    if (l.age >= 16 && [25, 45, 65].indexOf(l.age) >= 0 || serious(l) && !(s.bucket && s.bucket.illAt)) { suggest(l); if (serious(l)) bk(l).illAt = l.age; }
    var ag = E.AGEING899 && l.age >= 60 && E.AGEING899.state(l); if (ag && f.conds.length) ag.independence = Math.min(ag.independence, Math.max(10, independence(f)));
  });
  var mig = E.migrateExt; E.migrateExt = function (l) { if (mig) mig(l); if (l && l.flags && l.flags.care919 != null && typeof l.flags.care919 !== 'object') delete l.flags.care919; };
  E.CARE919 = { COND: COND, DEV: DEV, fn: fn, addCond: addCond, apply: apply, independence: independence, assess: assess, devOptions: devOptions, buyDev: buyDev, birthConds: birthConds, cogYear: cogYear, evaluateCog: evaluateCog, DEM: DEM, CARE: CARE, carers: carers, grandOk: grandOk, ccCost: ccCost, youngest: youngest, serious: serious, prognosis: prognosis, bk: bk, addItem: addItem, attempt: attempt, suggest: suggest, SUID: SUID, infant: infant, suidRisk: suidRisk, infantYear: infantYear, state: st };
})(globalThis.G);
