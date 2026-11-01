/* Bệnh mắc phải, ung thư theo giai đoạn, phát triển trẻ và sức khỏe tâm thần (8.10.16). Mô phỏng trò chơi — không phải tư vấn y khoa.
   Nguồn, tham số gameplay và phần giản lược: docs/HEALTH-GENETICS-912-SOURCES.md (mục 8.10.16).
   · Mở rộng life.ill sẵn có của engine (cure = khả năng thuyên giảm mỗi năm, mult = hệ số tử vong) và quyết định "treat": không tạo hệ y tế song song.
   · Ung thư có giai đoạn I–IV khi chẩn đoán (khám định kỳ giúp phát hiện sớm hơn); phác đồ theo chỉ định: phẫu thuật, hóa trị, xạ trị,
     chăm sóc hỗ trợ, theo dõi. Đáp ứng tùy loại/giai đoạn/tuổi/tiếp cận và có ngẫu nhiên có kiểm soát; không mặc định trẻ khỏi, già chết.
   · Hóa trị có tác dụng phụ theo phác đồ giản lược (không phải ai cũng rụng tóc); chế phẩm máu chỉ khi có chỉ định; buồng truyền là lựa chọn
     tiếp cận tĩnh mạch có chi phí và nguy cơ biến chứng, không tăng khả năng khỏi.
   · Sau thuyên giảm: theo dõi 5 năm có nguy cơ tái phát theo giai đoạn. Hiến máu: tạm hoãn khi đang điều trị và theo chính sách game
     đơn giản hóa (không phải quy định chung cho mọi nước).
   · Phát triển trẻ: tự kỷ, ADHD, chậm ngôn ngữ, chậm vận động, khuyết tật trí tuệ, lo âu, OCD là các mô hình riêng. Một dấu hiệu không đủ
     chẩn đoán; cần đánh giá chuyên môn. Hỗ trợ cải thiện kỹ năng theo thời gian, không "chữa khỏi"; không gán nguyên nhân cho cách nuôi dạy. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110;
  var V = 1;
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; }
  function rng(seed) { var x = hash(seed) || 1; return function () { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
  function logTo(l) { return function (t, k) { l.log.push({ a: l.age, y: l.birthYear + l.age, t: t, k: k || '' }); }; }

  // ===================== 11.4 UNG THƯ THEO GIAI ĐOẠN =====================
  // Hệ số theo giai đoạn (tham số gameplay; xu hướng theo SEER: khu trú sống lâu hơn nhiều so với di căn xa).
  var STAGE = { I: { cure: 1.5, mult: 0.7, n: 'giai đoạn I (khu trú)' }, II: { cure: 1.15, mult: 1, n: 'giai đoạn II' }, III: { cure: 0.75, mult: 1.3, n: 'giai đoạn III (lan tại vùng)' }, IV: { cure: 0.35, mult: 1.8, n: 'giai đoạn IV (di căn xa)' } };
  var RADIO = /phổi|vú|đại trực tràng|dạ dày/; // loại có xạ trị trong phác đồ giản lược của game
  var MOD = {
    surgery: { n: 'Phẫu thuật', cost: 0.3, stages: ['I', 'II', 'III'], h: 'Cắt bỏ khối u khi còn khu trú hoặc lan tại vùng' },
    chemo: { n: 'Hóa trị', cost: 0.25, stages: ['II', 'III', 'IV'], h: 'Có tác dụng phụ; mức độ khác nhau theo phác đồ và cơ thể' },
    radio: { n: 'Xạ trị', cost: 0.2, stages: ['I', 'II', 'III'], h: 'Chỉ định với một số loại và vị trí', req: function (ill) { return RADIO.test(ill.n); } },
    support: { n: 'Chăm sóc hỗ trợ, giảm triệu chứng', cost: 0.05, stages: ['I', 'II', 'III', 'IV'], h: 'Dinh dưỡng, giảm đau, hỗ trợ tâm lý cho người bệnh và gia đình' }
  };
  function cancer(ill) { return !!(ill && /^ung thư/.test(ill.n)); }
  function plan(l) { var ill = l.ill; return ill && ill.plan915; }
  function stageOf(l, ill) {
    var r = rng(l.id + ':stage915:' + ill.n + ':' + ill.since), early = (l.flags.checkupUntil >= l.age ? 0.15 : 0) + Math.min(0.15, (l.gdp || 10) / 300), x = r() - early;
    return x < 0.25 ? 'I' : x < 0.55 ? 'II' : x < 0.8 ? 'III' : 'IV';
  }
  function ensurePlan(l) {
    var ill = l.ill; if (!cancer(ill)) return null;
    if (!ill.plan915) { var st = stageOf(l, ill); ill.plan915 = { v: V, stage: st, mods: {}, side: [], port: null, transfused: [], regimen: rng(l.id + ':reg915:' + ill.since)() < 0.5 ? 'A' : 'B', at: l.age }; }
    return ill.plan915;
  }
  var treat = E.DEC.treat;
  var tMake = treat.make, tApply = treat.apply;
  treat.make = function (l) { var d = tMake.apply(this, arguments), p = ensurePlan(l); if (p) d.text = 'Kết quả sinh thiết và chẩn đoán hình ảnh: ' + STAGE[p.stage].n + '. ' + d.text + ' Sau bước này bạn chọn phác đồ cụ thể theo chỉ định của bác sĩ.'; return d; };
  treat.apply = function (l, d, k, r, log) {
    var out = tApply.apply(this, arguments), p = ensurePlan(l);
    if (p && l.ill && !p.applied) {
      p.applied = true; var S = STAGE[p.stage]; l.ill.cure = Math.min(0.95, l.ill.cure * S.cure); l.ill.mult = 1; p.setting = k; // nguy cơ tử vong do ung thư chuyển hẳn sang nguy cơ theo giai đoạn (hazard), không cộng chồng với hệ số cũ
      if (k !== 'none') X.next(l, 'cancerPlan915', r, {}, { manual: false });
    }
    return out;
  };
  function modReason(l, k) { var p = plan(l), M = MOD[k]; if (!p) return 'Không có điều trị ung thư đang diễn ra'; if (p.mods[k]) return 'Đã có trong phác đồ'; if (M.stages.indexOf(p.stage) < 0) return 'Không có chỉ định ở ' + STAGE[p.stage].n; if (M.req && !M.req(l.ill)) return 'Không có chỉ định với loại ung thư này'; if (l.money < l.base * M.cost) return 'Thiếu chi phí'; return true; }
  function sideEffects(l, p, log) {
    var r = rng(l.id + ':side915:' + l.age + ':' + p.at), alop = p.regimen === 'A' ? 0.8 : 0.25, list = [];
    if (r() < 0.7) list.push('mệt mỏi'); if (r() < 0.5) list.push('buồn nôn'); if (r() < alop) list.push('rụng tóc');
    if (r() < 0.2) list.push('giảm bạch cầu'); if (r() < 0.25) list.push('thiếu máu'); if (r() < 0.1) list.push('giảm tiểu cầu');
    p.side = list; if (list.indexOf('rụng tóc') >= 0) { var h = hair(l); h.len = 0; h.lostAt = l.age; }
    H.fx(l, { hea: -2 - (list.indexOf('giảm bạch cầu') >= 0 ? 4 : 0), hap: -3 });
    log('Hóa trị đợt này gây ' + (list.length ? list.join(', ') : 'ít tác dụng phụ') + '. ' + (list.indexOf('rụng tóc') < 0 ? 'Bạn không bị rụng tóc — không phải phác đồ nào cũng gây rụng tóc. ' : 'Tóc thường mọc lại sau khi ngừng hóa trị. ') + (list.indexOf('thiếu máu') >= 0 || list.indexOf('giảm tiểu cầu') >= 0 ? 'Bác sĩ cân nhắc truyền chế phẩm máu theo chỉ định.' : ''), 'neutral');
  }
  X.menu('cancerPlan915', 'Phác đồ điều trị ung thư', function (l) { return plan(l) ? true : 'Không có điều trị ung thư đang diễn ra'; },
    function (l) { var p = plan(l); if (!p) return ''; return l.ill.n + ' · ' + STAGE[p.stage].n + '. Chọn từng phương pháp theo chỉ định; mỗi phương pháp có chi phí và tác động riêng. Không phương pháp nào bảo đảm khỏi bệnh; đáp ứng còn tùy loại, giai đoạn, thể trạng và khả năng tiếp cận điều trị.' + (Object.keys(p.mods).length ? ' Đã chọn: ' + Object.keys(p.mods).map(function (k) { return MOD[k].n.toLowerCase(); }).join(', ') + '.' : '') + (p.side.length ? ' Tác dụng phụ gần nhất: ' + p.side.join(', ') + '.' : '') + (p.port ? ' Có buồng truyền dưới da.' : ''); },
    function (l) {
      var p = plan(l); if (!p) return []; var out = [];
      Object.keys(MOD).forEach(function (k) { var M = MOD[k], why = modReason(l, k); out.push({ k: 'm:' + k, l: M.n + ' · ' + H.money(l, l.base * M.cost), h: M.h, why: why,
        run: function (l, r, log) { var p = plan(l); if (!p || modReason(l, k) !== true) return; H.cash(l, -l.base * M.cost, M.n + ' ' + l.ill.n); p.mods[k] = l.age; var ill = l.ill;
          if (k === 'surgery') ill.cure = Math.min(0.95, ill.cure * (p.stage === 'III' ? 1.15 : 1.3));
          if (k === 'chemo') { if (p.stage === 'IV') p.hazK = (p.hazK || 1) * 0.8; else ill.cure = Math.min(0.95, ill.cure * 1.2); sideEffects(l, p, log); }
          if (k === 'radio') { ill.cure = Math.min(0.95, ill.cure * 1.15); H.fx(l, { hea: -2 }); log('Xạ trị theo lịch; vùng da chiếu xạ có thể kích ứng, mệt tăng dần trong đợt điều trị.', 'neutral'); }
          if (k === 'support') { if (p.stage === 'IV') p.hazK = (p.hazK || 1) * 0.9; H.fx(l, { hap: 4 }); log('Đội chăm sóc hỗ trợ giúp giảm đau, giữ dinh dưỡng và hỗ trợ tâm lý cho cả gia đình.', 'good'); }
          if (k !== 'chemo' && k !== 'radio' && k !== 'support') log('Đã thực hiện ' + M.n.toLowerCase() + '.', 'neutral');
          X.next(l, 'cancerPlan915', r, {}, { manual: false }); } }); });
      if (p.mods.chemo && !p.port) out.push({ k: 'port', l: 'Đặt buồng truyền dưới da (chemoport) · ' + H.money(l, l.base * 0.03), h: 'Giúp truyền thuốc dài ngày thuận tiện hơn; có nguy cơ nhiễm trùng, tắc, huyết khối và cần chăm sóc định kỳ. Không làm tăng khả năng khỏi.', why: l.money >= l.base * 0.03 ? true : 'Thiếu chi phí',
        run: function (l, r, log) { var p = plan(l); if (!p || p.port || l.money < l.base * 0.03) return; H.cash(l, -l.base * 0.03, 'Đặt buồng truyền dưới da'); p.port = { at: l.age, complications: 0 }; log('Đặt buồng truyền dưới da qua một thủ thuật nhỏ; cần giữ vệ sinh và tráng rửa định kỳ.', 'neutral'); X.next(l, 'cancerPlan915', r, {}, { manual: false }); } });
      var need = p.side.filter(function (s) { return s === 'thiếu máu' || s === 'giảm tiểu cầu'; });
      need.forEach(function (s) { var kind = s === 'thiếu máu' ? 'hồng cầu' : 'tiểu cầu'; if (p.transfused.some(function (t) { return t.at === l.age && t.kind === kind; })) return;
        out.push({ k: 'tx:' + kind, l: 'Truyền ' + kind + ' theo chỉ định', h: 'Chỉ dùng khi xét nghiệm cho thấy ' + s + '; không phải cách chữa bệnh chung', run: function (l, r, log) { var p = plan(l); if (!p) return; p.transfused.push({ at: l.age, kind: kind }); (l.flags.transfused915 || (l.flags.transfused915 = [])).push({ at: l.age, kind: kind }); H.fx(l, { hea: 3 }); p.side = p.side.filter(function (x) { return x !== s; }); log('Được truyền ' + kind + ' theo chỉ định, chỉ số cải thiện. Chế phẩm đến từ những người hiến máu.', 'neutral'); X.next(l, 'cancerPlan915', r, {}, { manual: false }); } }); });
      return out;
    }, 18);
  // Mỗi năm: buồng truyền có thể biến chứng; sau thuyên giảm theo dõi 5 năm, có thể tái phát theo giai đoạn.
  var RELAPSE = { I: 0.02, II: 0.04, III: 0.08, IV: 0.15 };
  // Nguy cơ tử vong riêng của ung thư mỗi năm (tham số gameplay theo xu hướng sống còn 5 năm của SEER: khu trú cao, di căn xa thấp).
  // Trước đây engine chỉ nhân hệ số với tử vong nền theo tuổi nên người trẻ giai đoạn IV không điều trị vẫn sống ~88% sau 5 năm.
  var HAZ = { I: 0.006, II: 0.02, III: 0.05, IV: 0.2 };
  function hazard(l, p) { var treated = p.setting && p.setting !== 'none' && Object.keys(p.mods).some(function (k) { return k !== 'support'; }); return Math.min(0.6, HAZ[p.stage] * (p.hazK || 1) * (treated ? (p.setting === 'basic' ? 1.4 : 1) : 2.2) * (1 + Math.max(0, l.age - 60) / 60)); }
  function cancerYear(l, r, log) {
    var s = l.flags.cancer915 || (l.flags.cancer915 = { history: [] }), p = plan(l);
    if (p) { s.active = { n: l.ill.n, stage: p.stage, since: l.ill.since }; if (p.port) { var R = rng(l.id + ':port915:' + l.age); if (R() < 0.04) { p.port.complications++; H.fx(l, { hea: -4 }); log('Buồng truyền bị nhiễm trùng / tắc, phải điều trị thêm.', 'bad'); } else if (l.money >= l.base * 0.005) H.cash(l, -l.base * 0.005, 'Chăm sóc buồng truyền'); }
      if (p.at < l.age && rng(l.id + ':haz915:' + l.age)() < hazard(l, p)) { H.kill(l, l.ill.n, log); return; }
      if (p.mods.chemo && p.mods.chemo < l.age && p.chemoYear !== l.age) { p.chemoYear = l.age; sideEffects(l, p, log); } return; }
    if (s.active && !l.ill) { s.history.push({ n: s.active.n, stage: s.active.stage, remission: l.age }); s.follow = { n: s.active.n, stage: s.active.stage, since: l.age }; delete s.active; log('Bác sĩ hẹn tái khám định kỳ trong 5 năm sau thuyên giảm; thuyên giảm chưa có nghĩa là không thể tái phát.', 'neutral'); return; }
    var f = s.follow; if (!f || l.ill) return;
    if (l.age - f.since > 5) { delete s.follow; return; }
    var R2 = rng(l.id + ':relapse915:' + l.age);
    if (R2() < RELAPSE[f.stage]) { delete s.follow; l.ill = { n: f.n + ' (tái phát)', m: 5, base: 0.15, cure: 0.15, mult: 4, f: f.n, since: l.age, chronic: false }; l.ill.plan915 = { v: V, stage: f.stage === 'IV' ? 'IV' : 'III', mods: {}, side: [], port: null, transfused: [], regimen: 'A', at: l.age, relapse: true }; log('Lần tái khám phát hiện ' + f.n + ' tái phát. Cần lập lại phác đồ điều trị.', 'bad'); H.sched(l, 'treat', 0); }
  }

  // ===================== Lao: phác đồ 6 tháng và tuân thủ =====================
  function tbYear(l, r, log) {
    var ill = l.ill; if (!ill || ill.n !== 'lao phổi' || !ill.treated || ill.treated === 'none' || ill.tb915) return;
    ill.tb915 = { at: l.age }; X.next(l, 'tb915', r, {}, { manual: false });
  }
  E.SC('tb915', { title: 'Phác đồ điều trị lao 6 tháng', prep: function (l) { return { at: l.age, done: false }; }, valid: function (l, d) { return !!(l.ill && l.ill.n === 'lao phổi' && (!d || d.at == null || d.at === l.age && !d.done)); },
    text: 'Điều trị lao cần uống thuốc đều đặn ít nhất 6 tháng, kể cả khi đã thấy khỏe. Bỏ dở có thể làm bệnh quay lại và khó chữa hơn.',
    opts: [{ k: 'full', l: 'Uống thuốc đủ 6 tháng, tái khám theo lịch', ai: { w: 1.4 }, run: function (l, r, log, d) { if (!l.ill) return; d.done = true; l.ill.cure = Math.min(0.95, l.ill.cure * 1.1); l.ill.tb915.adherence = 'full'; log('Bạn theo đủ phác đồ, không tự ý ngừng thuốc khi thấy đỡ.', 'good'); } },
      { k: 'stop', l: 'Thấy khỏe thì ngừng thuốc sớm', ai: { w: 0.4 }, run: function (l, r, log, d) { if (!l.ill) return; d.done = true; l.ill.cure *= 0.5; l.ill.mult *= 1.2; l.ill.tb915.adherence = 'stopped'; log('Ngừng thuốc sớm; nguy cơ bệnh quay lại và kháng thuốc tăng.', 'bad'); } }] });

  // ===================== Mất ngủ, lupus =====================
  // Lupus: tỷ lệ mắc mới mỗi năm (tham số gameplay; hiện mắc ở Mỹ ~73/100.000, nữ nhiều hơn nam khoảng 9 lần).
  var LUPUS = { F: 0.00005, M: 0.0000055 };
  function sleep(l) { return l.flags.sleep915 || null; }
  function chronicYear(l, r, log) {
    var R = rng(l.id + ':chronic915:' + l.age), stress = l.mind && l.mind.stress || 0, s = sleep(l);
    if (!s && l.age >= 18 && R() < (stress >= 70 ? 0.08 : stress >= 50 ? 0.03 : 0.01)) { l.flags.sleep915 = s = { since: l.age, plan: 'none', severity: 1 }; log('Mấy tháng nay bạn khó ngủ, hay thức giấc giữa đêm và mệt vào ban ngày.', 'neutral'); }
    if (s) { if (s.plan === 'cbt' && R() < 0.45) { delete l.flags.sleep915; log('Giấc ngủ cải thiện rõ sau liệu trình thay đổi thói quen ngủ.', 'good'); } else if (s.plan === 'pills') { H.fx(l, { hap: 1 }); if (R() < 0.15) { s.dependence = true; log('Bạn khó ngủ nếu thiếu thuốc; bác sĩ khuyên giảm dần và chuyển sang liệu pháp hành vi.', 'neutral'); } } else { H.fx(l, { hap: -2, hea: -1 }); if (stress < 40 && R() < 0.25) { delete l.flags.sleep915; log('Áp lực giảm, giấc ngủ dần trở lại bình thường.', 'good'); } } }
    // Lupus ban đỏ hệ thống: hiếm, nữ nhiều hơn nam, thường khởi phát 15–45 tuổi; diễn tiến từng đợt.
    var lu = l.flags.lupus915;
    if (!lu && l.age >= 15 && l.age <= 45 && R() < LUPUS[l.sex === 'F' ? 'F' : 'M']) { l.flags.lupus915 = lu = { since: l.age, known: false, care: 'none' }; }
    if (lu) { if (!lu.known && R() < 0.5) { lu.known = true; lu.care = 'basic'; log('Sau nhiều lần đau khớp, nổi ban và mệt kéo dài, bạn được chẩn đoán lupus ban đỏ hệ thống — bệnh tự miễn diễn tiến từng đợt, cần theo dõi lâu dài.', 'bad'); }
      var flare = R() < (lu.care === 'basic' ? 0.15 : 0.4); if (flare) { H.fx(l, { hea: lu.care === 'basic' ? -3 : -8, hap: -3 }); if (lu.known) log('Lupus có một đợt bùng phát; bác sĩ điều chỉnh thuốc.', 'neutral'); if (!lu.kidney && R() < (lu.care === 'basic' ? 0.03 : 0.1)) { lu.kidney = l.age; log('Lupus ảnh hưởng tới thận; cần theo dõi chức năng thận chặt chẽ — đây là biến chứng của bệnh gốc, không phải bệnh riêng.', 'bad'); } }
      if (lu.known && l.money >= l.base * 0.03) H.cash(l, -l.base * 0.03, 'Thuốc và tái khám lupus'); else if (lu.known) lu.care = 'none'; }
  }
  X.menu('sleep915', 'Giấc ngủ', function (l) { return sleep(l) ? true : 'Hiện không có vấn đề giấc ngủ'; }, 'Mất ngủ kéo dài ảnh hưởng tâm trạng và sức khỏe. Liệu pháp hành vi cho mất ngủ thường là lựa chọn đầu tiên; thuốc ngủ chỉ dùng ngắn hạn theo chỉ định.',
    function (l) { return [{ k: 'cbt', l: 'Liệu pháp hành vi cho mất ngủ (CBT-I) · ' + H.money(l, l.base * 0.02), why: l.money >= l.base * 0.02 ? true : 'Thiếu chi phí', run: function (l, r, log) { var s = sleep(l); if (!s || l.money < l.base * 0.02) return; H.cash(l, -l.base * 0.02, 'Liệu pháp mất ngủ'); s.plan = 'cbt'; log('Bắt đầu liệu trình: giờ ngủ cố định, hạn chế nằm trên giường khi không ngủ, ghi nhật ký giấc ngủ.', 'neutral'); } },
      { k: 'pills', l: 'Xin bác sĩ kê thuốc ngủ ngắn hạn', run: function (l, r, log) { var s = sleep(l); if (!s) return; s.plan = 'pills'; log('Được kê thuốc ngủ ngắn hạn, kèm dặn không tự kéo dài.', 'neutral'); } }]; }, 18, 'Sức khỏe');

  // ===================== Tóc và hiến tóc =====================
  // Tóc mọc khoảng 12–15 cm mỗi năm (tham số gameplay). Hai chương trình hiến tóc dưới đây là HƯ CẤU, điều kiện khác nhau.
  var HAIR = [{ k: 'p1', n: 'Chương trình làm tóc giả cho bệnh nhi (hư cấu)', min: 20, dyed: true, bleached: false }, { k: 'p2', n: 'Quỹ tóc giả cộng đồng (hư cấu)', min: 30, dyed: true, bleached: true }];
  function hair(l) { var h = l.flags.hair915; if (!h) { var r = rng(l.id + ':hair915'); h = l.flags.hair915 = { len: Math.round(5 + r() * (l.sex === 'F' ? 40 : 8)), dyed: false, bleached: false, at: l.age }; } return h; }
  function hairYear(l) { var h = hair(l); if (h.at === l.age) return; var yrs = l.age - h.at; h.at = l.age; if (!(l.ill && plan(l) && plan(l).side.indexOf('rụng tóc') >= 0)) h.len = Math.min(120, h.len + 13 * yrs); }
  X.menu('hair915', 'Tóc và hiến tóc', function (l) { return X.reason(l, 12); }, function (l) { var h = hair(l); return 'Tóc hiện dài khoảng ' + h.len + ' cm' + (h.dyed ? ', đã nhuộm' : '') + (h.bleached ? ', đã tẩy' : '') + '. Mỗi chương trình có điều kiện riêng; cắt hiến sẽ trừ đúng phần tóc đã cắt và tóc cần thời gian mọc lại.'; },
    function (l) { var h = hair(l), out = HAIR.map(function (P) { var ok = h.len - 5 >= P.min && (!h.bleached || P.bleached) && (!h.dyed || P.dyed); return { k: P.k, l: 'Hiến cho ' + P.n, h: 'Cần tối thiểu ' + P.min + ' cm' + (P.bleached ? '' : ', không nhận tóc đã tẩy'), why: ok ? true : h.bleached && !P.bleached ? 'Chương trình này không nhận tóc đã tẩy' : 'Tóc chưa đủ dài (cần giữ lại khoảng 5 cm)',
      run: function (l, r, log) { var x = hair(l); if (!(x.len - 5 >= P.min) || x.bleached && !P.bleached) return; var cut = x.len - 5; x.len = 5; x.donated = (x.donated || 0) + 1; H.fx(l, { hap: 4, karma: 2 }); log('Bạn cắt ' + cut + ' cm tóc gửi ' + P.n + '. Tóc còn khoảng 5 cm, sẽ mọc lại dần.', 'good'); } }; });
      out.push({ k: 'dye', l: h.dyed ? 'Tẩy tóc để đổi màu sáng' : 'Nhuộm tóc', run: function (l, r, log) { var x = hair(l); if (x.dyed) x.bleached = true; else x.dyed = true; log(x.bleached ? 'Bạn tẩy tóc để lên màu sáng.' : 'Bạn nhuộm tóc màu mới.', 'neutral'); } });
      return out; }, 12, 'Sức khỏe');

  // ===================== Hiến máu: tạm hoãn theo chính sách game =====================
  E.HEALTH915 = E.HEALTH915 || {};
  E.HEALTH915.deferral = function (l) {
    var tx = (l.flags.transfused915 || []).filter(function (t) { return l.age - t.at < 1; });
    if (tx.length) return 'Vừa được truyền chế phẩm máu trong 12 tháng qua; tạm hoãn hiến theo chính sách đơn giản hóa của game';
    var c = l.flags.cancer915; if (c && (c.active || c.follow)) return 'Đang điều trị hoặc đang theo dõi sau ung thư; cần bác sĩ đánh giá (chính sách game, mỗi nơi quy định khác nhau)';
    return null;
  };

  // ===================== 11.5 PHÁT TRIỂN TRẺ VÀ SỨC KHỎE TÂM THẦN =====================
  // Tỷ lệ (tham số gameplay, tham khảo số liệu CDC Mỹ: tự kỷ ~1/31, nam nhiều hơn nữ hơn 3 lần; ADHD từng được chẩn đoán ~9–11%).
  var DEV = {
    autism: { n: 'Rối loạn phổ tự kỷ', p: { M: 0.05, F: 0.014 }, signs: [1, 3], supports: ['speech', 'ot', 'school', 'psy'], hint: 'chậm nói, ít giao tiếp bằng mắt, thích lặp lại một hoạt động' },
    adhd: { n: 'Rối loạn tăng động giảm chú ý (ADHD)', p: { M: 0.12, F: 0.055 }, signs: [4, 8], supports: ['school', 'psy', 'med'], hint: 'khó tập trung, hay quên, khó ngồi yên trong lớp' },
    lang: { n: 'Chậm phát triển ngôn ngữ', p: { M: 0.06, F: 0.04 }, signs: [2, 3], supports: ['speech'], hint: 'nói ít từ hơn bạn cùng tuổi', resolve: 0.4 },
    motor: { n: 'Chậm phát triển vận động', p: { M: 0.02, F: 0.015 }, signs: [1, 2], supports: ['ot'], hint: 'chậm biết đi, vụng về khi vận động', resolve: 0.3 },
    id: { n: 'Khuyết tật trí tuệ', p: { M: 0.012, F: 0.008 }, signs: [3, 6], supports: ['speech', 'ot', 'school'], hint: 'chậm ở nhiều lĩnh vực: ngôn ngữ, tự phục vụ, học tập' },
    anxiety: { n: 'Rối loạn lo âu', p: { M: 0.07, F: 0.1 }, signs: [7, 16], supports: ['psy'], hint: 'lo lắng kéo dài, sợ đi học, đau bụng mỗi sáng' },
    ocd: { n: 'Rối loạn ám ảnh cưỡng chế (OCD)', p: { M: 0.01, F: 0.01 }, signs: [10, 17], supports: ['psy', 'med'], hint: 'ý nghĩ lặp đi lặp lại, phải kiểm tra hoặc rửa tay nhiều lần' }
  };
  var SUP = { speech: { n: 'Can thiệp ngôn ngữ – giao tiếp', cost: 0.04 }, ot: { n: 'Hoạt động trị liệu / vận động trị liệu', cost: 0.04 }, school: { n: 'Điều chỉnh học tập ở trường', cost: 0.01 }, psy: { n: 'Hỗ trợ tâm lý (trị liệu nhận thức – hành vi phù hợp lứa tuổi)', cost: 0.03 }, med: { n: 'Khám chuyên khoa về thuốc (nếu bác sĩ chỉ định)', cost: 0.02 } };
  function devOf(l, k) {
    if (k.dev915) return k.dev915;
    if (k.legacy912 || !k.genes912) return null; // chỉ trẻ sinh từ bản di truyền trở đi, để không gán đặc điểm mới cho trẻ cũ
    var r = rng(l.id + ':dev915:' + X.uid(l, k)), d = { v: V, c: {} }, t21 = k.genes912 && k.genes912.t21;
    Object.keys(DEV).forEach(function (id) { var D = DEV[id], p = D.p[k.sex] || D.p.F; if (id === 'id' && t21) p = 1; if (id === 'motor' && t21) p = 0.8; if (id === 'adhd' && d.c.autism) p = 0.4; if (r() < p) d.c[id] = { at: k.born + D.signs[0] + Math.floor(r() * (D.signs[1] - D.signs[0] + 1)), signs: false, known: false, sup: {}, skill: 30 + Math.floor(r() * 30), resp: 0.6 + r() * 0.8 }; });
    k.dev915 = d; return d;
  }
  function devYear(l, r, log) {
    (l.kids || []).forEach(function (k) {
      if (k.alive === false || l.age - k.born >= 18) return; var d = devOf(l, k); if (!d || d.y === l.age) return; d.y = l.age;
      Object.keys(d.c).forEach(function (id) {
        var x = d.c[id], D = DEV[id], R = rng(l.id + ':devy915:' + X.uid(l, k) + ':' + id + ':' + l.age);
        if (l.age < x.at) return;
        if (!x.signs) { x.signs = l.age; if (!x.resolved) X.next(l, 'devConcern915', r, { kid: X.uid(l, k), id: id }, { manual: false }); return; }
        if (D.resolve && !x.known && !x.resolved && R() < D.resolve) { x.resolved = l.age; log(k.name + ' đã bắt kịp bạn cùng tuổi ở lĩnh vực ' + (id === 'lang' ? 'ngôn ngữ' : 'vận động') + '.', 'good'); return; }
        if (x.resolved) return;
        var sup = Object.keys(x.sup).filter(function (s) { return x.sup[s]; }), cost = sup.reduce(function (n, s) { return n + l.base * SUP[s].cost; }, 0);
        if (cost > 0) { if (l.money >= cost) H.cash(l, -cost, 'Hỗ trợ phát triển cho ' + k.name); else { sup = []; if (x.unpaid !== l.age) { x.unpaid = l.age; log('Chưa đủ tiền duy trì hỗ trợ cho ' + k.name + ' năm nay.', 'neutral'); } } }
        var fit = sup.filter(function (s) { return D.supports.indexOf(s) >= 0; }).length;
        x.skill = U.clamp(x.skill + (fit ? Math.round((2 + fit * 2) * x.resp) : R() < 0.3 ? 1 : 0), 0, 100);
        k.study = U.clamp((k.study || 50) + (fit ? 1 : x.known ? 0 : -1), 0, 100);
        if (fit) k.close = U.clamp((k.close || 50) + 1, 0, 100);
        if (l.mind && x.known && !fit) l.mind.stress = Math.min(100, (l.mind.stress || 0) + 1);
      });
    });
  }
  function kidBy(l, id) { return (l.kids || []).find(function (k) { return X.uid(l, k) === id; }); }
  E.SC('devConcern915', {
    title: 'Dấu hiệu cần để ý ở con',
    prep: function (l, r, a) { return Object.assign({ at: l.age, done: false }, a || {}); },
    valid: function (l, d) { var k = d && d.kid && kidBy(l, d.kid); return !!(k && k.alive !== false && k.dev915 && k.dev915.c[d.id] && !k.dev915.c[d.id].known && (d.at == null || d.at === l.age && !d.done)); },
    text: function (l, d) { var k = kidBy(l, d.kid), D = DEV[d.id]; return k ? 'Thầy cô và người thân nhận thấy ' + k.name + ' (' + (l.age - k.born) + ' tuổi) ' + D.hint + '. Một dấu hiệu chưa đủ để kết luận; trẻ phát triển theo nhịp riêng. Đánh giá chuyên môn giúp hiểu con cần hỗ trợ gì. Đây không phải lỗi của cách nuôi dạy.' : ''; },
    opts: [{ k: 'eval', l: 'Đưa con đi đánh giá phát triển chuyên môn', h: function (l) { return 'Khoảng ' + H.money(l, l.base * 0.02); }, ai: { w: 1.2 }, run: function (l, r, log, d) {
      var k = kidBy(l, d.kid); if (!k || l.money < l.base * 0.02) return; d.done = true; H.cash(l, -l.base * 0.02, 'Đánh giá phát triển cho ' + k.name); var x = k.dev915.c[d.id];
      if (r() < 0.6 + Math.min(0.35, (l.gdp || 10) / 100)) { x.known = 'confirmed'; x.dx = l.age; log('Chuyên gia đánh giá ' + k.name + ' có ' + DEV[d.id].n.toLowerCase() + '. Con vẫn có thể học, làm việc và có các mối quan hệ; hỗ trợ phù hợp giúp con tiến bộ theo cách riêng.', 'neutral'); }
      else log('Lần đánh giá này chưa đủ căn cứ kết luận; chuyên gia hẹn theo dõi thêm.', 'neutral'); } },
      { k: 'wait', l: 'Theo dõi thêm một thời gian', ai: { w: 0.8 }, run: function (l, r, log, d) { var k = kidBy(l, d.kid); if (!k) return; d.done = true; k.dev915.c[d.id].signs = false; k.dev915.c[d.id].at = l.age + 1; log('Gia đình quyết định theo dõi thêm ' + k.name + ' và sẽ đi khám nếu dấu hiệu còn kéo dài.', 'neutral'); } }]
  });
  function devKids(l) { return (l.kids || []).filter(function (k) { return k.alive !== false && k.dev915 && Object.keys(k.dev915.c).some(function (id) { return k.dev915.c[id].known && !k.dev915.c[id].resolved; }); }); }
  X.menu('devCare915', 'Hỗ trợ phát triển cho con', function (l) { return devKids(l).length ? true : 'Chưa có con nào có kết quả đánh giá cần hỗ trợ'; },
    'Mỗi trẻ cần kế hoạch riêng; không có một phương pháp phù hợp mọi trẻ hay bảo đảm "chữa khỏi". Hỗ trợ sớm giúp cải thiện kỹ năng và chất lượng sống.',
    function (l) { var out = []; devKids(l).forEach(function (k) { Object.keys(k.dev915.c).forEach(function (id) { var x = k.dev915.c[id]; if (!x.known || x.resolved) return;
      DEV[id].supports.forEach(function (s) { var on = !!x.sup[s]; out.push({ k: X.uid(l, k) + ':' + id + ':' + s, l: (on ? 'Dừng ' : 'Bắt đầu ') + SUP[s].n.toLowerCase() + ' cho ' + k.name, h: DEV[id].n + ' · kỹ năng hiện tại ' + x.skill + '/100 · ' + H.money(l, l.base * SUP[s].cost) + '/năm', run: function (l, r, log) { x.sup[s] = !on; log((on ? 'Dừng ' : 'Bắt đầu ') + SUP[s].n.toLowerCase() + ' cho ' + k.name + '.', 'neutral'); } }); }); }); }); return out; }, 18, 'Gia đình');
  if (E.STANDING158) { var rf = E.STANDING158.relativeFacts; E.STANDING158.relativeFacts = function (l, p, child) { var out = rf.apply(this, arguments); if (child && p.dev915) { var x = Object.keys(p.dev915.c).filter(function (id) { return p.dev915.c[id].known; }).map(function (id) { var c = p.dev915.c[id], sup = Object.keys(c.sup).filter(function (s) { return c.sup[s]; }); return DEV[id].n + (c.resolved ? ' · đã bắt kịp' : ' · kỹ năng ' + c.skill + '/100' + (sup.length ? ' · đang hỗ trợ: ' + sup.map(function (s) { return SUP[s].n.toLowerCase(); }).join(', ') : '')); }); if (x.length) out.push(['Phát triển & tâm lý', x.join('; ')]); } return out; }; }

  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive) return; var s = l.flags.health915 || (l.flags.health915 = { v: V }); if (s.y === l.age) return; s.y = l.age;
    if (l.ill && cancer(l.ill)) ensurePlan(l);
    cancerYear(l, r, log); tbYear(l, r, log); chronicYear(l, r, log); hairYear(l); devYear(l, r, log);
  });
  var migrate = E.migrateExt;
  E.migrateExt = function (l) { if (migrate) migrate(l); if (!l || !l.flags) return; ['health915', 'cancer915', 'sleep915', 'lupus915', 'hair915'].forEach(function (k) { if (l.flags[k] != null && typeof l.flags[k] !== 'object') delete l.flags[k]; }); };
  Object.assign(E.HEALTH915, { STAGE: STAGE, MOD: MOD, DEV: DEV, SUP: SUP, HAIR: HAIR, LUPUS: LUPUS, ensurePlan: ensurePlan, hazard: hazard, HAZ: HAZ, stageOf: stageOf, devOf: devOf, devYear: devYear, cancerYear: cancerYear, chronicYear: chronicYear, hair: hair, hairYear: hairYear, RELAPSE: RELAPSE });
})(globalThis.G);
