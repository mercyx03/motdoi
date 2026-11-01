/* Một Đời — Phần B8 (8.10.19): biến cố cuộc đời nhiều giai đoạn trên bộ điều phối chuỗi sẵn có E.CHAIN144 (life144),
   không thêm hook ngẫu nhiên độc lập: tối đa 4 chuỗi cùng lúc và một lựa chọn chuỗi mỗi năm do CHAIN144 quản lý.
   · Bộ khởi phát chung: mỗi năm tối đa một chuỗi mới; tối đa 2 chuỗi drama917 đang mở; mỗi loại chờ 6 năm; xác suất theo
     hoàn cảnh (tuổi, quan hệ, nghề, tiền, nơi sống) và cường độ người chơi chọn (Êm đềm / Cân bằng / Nhiều biến động).
     Cường độ chỉ đổi tần suất khởi phát, không đổi mức hậu quả. Số ngẫu nhiên băm theo nhân vật + năm, không reroll khi lưu/tải.
   · Mỗi chuỗi: phát hiện → lựa chọn → phản hồi năm sau → kết thúc; luôn có hướng giảm thiệt hại, từ chối tham gia hoặc tìm hỗ trợ.
     Người liên quan chết/rời đi/đổi hoàn cảnh thì chuỗi khép lại (điều kiện hủy của CHAIN144). Không gán ngoại tình, bệnh hiểm
     nghèo hay phạm pháp làm biến cố ngẫu nhiên. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, CH = E.CHAIN144;
  if (!CH || !X) return;
  var MODES = { calm: { n: 'Êm đềm', k: 0.5 }, balanced: { n: 'Cân bằng', k: 1 }, eventful: { n: 'Nhiều biến động', k: 1.6 } };
  var BAL = { base: 0.14, cooldown: 6, maxOpen: 2 }; // tham số gameplay
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; h = Math.imul(h, 3266489909); h ^= h >>> 16; return h >>> 0; }
  function roll(l, tag) { return hash((l.rs || 0) + ':' + l.id + ':d917:' + tag + ':' + l.age) / 4294967296; }
  function prng(l, tag) { var a = hash(l.id + ':' + tag + ':' + l.age); return function () { a = (a + 0x6D2B79F5) >>> 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function st(l) { var s = l.flags.drama917; if (!s || typeof s !== 'object') s = l.flags.drama917 = { mode: 'balanced', last: {}, started: 0 }; if (!MODES[s.mode]) s.mode = 'balanced'; if (!s.last) s.last = {}; return s; }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.flags.military && l.age < l.flags.military); }
  function fx(l, o) { H.fx(l, o); }
  function stress(l, d) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + d, 0, 100); }
  function mo(l, v) { return H.money(l, v); }
  function adv(l, c) { CH.advance(l, c); }
  function end(l, c, res, log, t, k) { CH.close(l, c, res, log, t, k); }
  function sib(l, c) { return (l.sibList || []).find(function (s) { return s.n === c.npc.name && s.alive; }); }
  function kid(l, c) { return (l.kids || []).find(function (k) { return k.name === c.npc.name && k.alive !== false; }); }
  function ally(l) { var b = l.flags.state174 && l.flags.state174.b917; return b ? b.allies.filter(function (a) { return a.active; })[0] : null; }
  function owner(l) { return !!(E.BUSINESS123 && E.BUSINESS123.equity && E.BUSINESS123.equity(l) > 0) || !!(l.job && E.jobDef && (E.jobDef(l) || {}).cat === 'biz'); }

  // ---------- 1. Gia đình / thừa kế: tranh chấp di sản ----------
  CH.define('d917_will', { max: 1,
    cancel: function (l, c) { if (!sib(l, c)) return { result: 'gone', text: 'Chuyện di sản khép lại khi ' + c.npc.name + ' không còn.', kind: 'neutral' }; },
    stages: [
      { dec: 'd917_will_1', after: [0, 1], p: 1, when: free, title: 'Di sản bố mẹ để lại',
        text: function (l, c) { return 'Sau khi ' + (c.data.who || 'bố/mẹ') + ' mất, ' + c.npc.name + ' cho rằng phần chia căn nhà và khoản tiết kiệm chưa công bằng. Không có di chúc rõ ràng; họ hàng mỗi người một ý.'; },
        opts: [
          { k: 'mediate', l: 'Mời họ hàng làm chứng, ngồi lại hòa giải', ai: { w: 1.3 }, run: function (l, r, log, c) { c.data.path = 'mediate'; stress(l, 4); log('Buổi hòa giải căng thẳng nhưng hai bên chịu nói chuyện; thỏa thuận tạm sẽ được xem lại năm sau.', 'neutral'); adv(l, c); } },
          { k: 'law', l: 'Chia theo pháp luật về thừa kế', h: 'Phí thủ tục nhỏ', ai: { w: 1 }, run: function (l, r, log, c) { c.data.path = 'law'; H.cash(l, -Math.min(Math.max(0, l.money), l.base * 0.03), 'Thủ tục khai nhận di sản'); log('Bạn đề nghị chia theo pháp luật; ' + c.npc.name + ' miễn cưỡng đồng ý nhưng chưa vui.', 'neutral'); adv(l, c); } },
          { k: 'yield', l: 'Nhường bớt phần mình để giữ hòa khí', ai: { w: 0.8, moral: 1 }, run: function (l, r, log, c) { c.data.path = 'yield'; var s = sib(l, c); if (s) s.close = Math.min(100, (s.close || 60) + 10); fx(l, { hap: 2, karma: 2 }); log('Bạn nhường một phần. Không thiệt hại lớn về tiền bằng mất anh em.', 'good'); adv(l, c); } }
        ] },
      { dec: 'd917_will_2', after: [1, 2], p: 0.9, when: free, title: function (l, c) { return 'Một năm sau chuyện di sản với ' + c.npc.name; },
        text: function (l, c) { return c.data.path === 'yield' ? c.npc.name + ' tìm đến cảm ơn, ngỏ ý góp tiền sửa mộ bố mẹ.' : c.npc.name + ' vẫn còn chút khúc mắc; dịp giỗ sắp tới là lúc hai người gặp lại.'; },
        opts: [
          { k: 'meet', l: 'Chủ động gặp, nói chuyện thẳng thắn', ai: { w: 1.2 }, run: function (l, r, log, c) { var s = sib(l, c), ok = roll(l, 'will') < (c.data.path === 'law' ? 0.55 : 0.8); if (s) s.close = U.clamp((s.close || 60) + (ok ? 12 : -5), 0, 100); end(l, c, ok ? 'reconciled' : 'distant', log, ok ? 'Hai người làm hòa; chuyện cũ không còn nhắc trong bữa cơm giỗ.' : c.npc.name + ' vẫn giữ khoảng cách. Bạn chấp nhận rằng có những chuyện cần thêm thời gian.', ok ? 'good' : 'neutral'); } },
          { k: 'space', l: 'Giữ khoảng cách một thời gian', ai: { w: 0.7 }, run: function (l, r, log, c) { var s = sib(l, c); if (s) s.close = Math.max(0, (s.close || 60) - 5); end(l, c, 'distant', log, 'Bạn giữ khoảng cách; gia đình ít tụ họp hơn.', 'neutral'); } }
        ] }
    ] });
  // ---------- 2. Người thân giấu khó khăn tài chính ----------
  CH.define('d917_debt', { max: 1,
    cancel: function (l, c) { if (c.data.kind === 'sib' && !sib(l, c)) return { result: 'gone' }; },
    stages: [
      { dec: 'd917_debt_1', after: [0, 1], p: 1, when: free, title: 'Người thân giấu chuyện nợ',
        text: function (l, c) { return 'Bạn tình cờ biết ' + c.npc.name + ' nợ một khoản lớn sau thất bại làm ăn và giấu cả nhà. Người ấy ngại nói vì sợ phiền bạn.'; },
        opts: [
          { k: 'pay', l: function (l) { return 'Giúp trả một phần (' + mo(l, l.base * 0.3) + ')'; }, req: function (l) { return l.money > l.base * 0.6; }, ai: { w: 1 }, run: function (l, r, log, c) { H.cash(l, -l.base * 0.3, 'Giúp người thân trả nợ'); c.data.path = 'pay'; log('Bạn giúp một phần, kèm điều kiện cùng lập kế hoạch trả phần còn lại.', 'neutral'); adv(l, c); } },
          { k: 'plan', l: 'Cùng ngồi lập kế hoạch trả nợ, không đưa tiền', ai: { w: 1.2, smart: 0.6 }, run: function (l, r, log, c) { c.data.path = 'plan'; fx(l, { soc: 1 }); log('Hai người liệt kê các khoản, ưu tiên khoản lãi cao, tìm việc làm thêm.', 'neutral'); adv(l, c); } },
          { k: 'out', l: 'Không can thiệp, khuyên tìm tư vấn chuyên môn', ai: { w: 0.7 }, run: function (l, r, log, c) { c.data.path = 'out'; log('Bạn giới thiệu nơi tư vấn tài chính và giữ ranh giới của mình.', 'neutral'); adv(l, c); } }
        ] },
      { after: [1, 2], p: 1, when: free, narrate: function (l, c, log) {
        var ok = roll(l, 'debt') < (c.data.path === 'out' ? 0.4 : 0.7), s = c.data.kind === 'sib' ? sib(l, c) : null;
        if (s) s.close = U.clamp((s.close || 60) + (ok ? 6 : -4), 0, 100);
        end(l, c, ok ? 'recovered' : 'struggling', log, ok ? c.npc.name + ' trả được phần lớn khoản nợ, tình hình gia đình nhẹ đi.' : c.npc.name + ' vẫn chật vật với khoản nợ; bạn biết không thể gánh thay tất cả.', ok ? 'good' : 'neutral'); } }
    ] });
  // ---------- 3. Tình yêu: tin đồn cần kiểm chứng ----------
  CH.define('d917_rumor', { max: 1,
    cancel: function (l, c) { if (!l.partner || l.partner.alive === false || l.partner.name !== c.npc.name) return { result: 'changed' }; },
    stages: [
      { dec: 'd917_rumor_1', after: [0, 1], p: 1, when: free, title: 'Tin đồn về người ấy',
        text: function (l, c) { return 'Một người quen kể thấy ' + c.npc.name + ' đi ăn tối với ai đó. Bạn không có bằng chứng; tin đồn thường thiếu bối cảnh.'; },
        opts: [
          { k: 'ask', l: 'Hỏi thẳng, bình tĩnh', ai: { w: 1.3 }, run: function (l, r, log, c) { c.data.path = 'ask'; log('Bạn hỏi thẳng. ' + c.npc.name + ' kể đó là buổi gặp đồng nghiệp cũ; hai người hẹn nói chuyện tiếp về chuyện tin nhau.', 'neutral'); adv(l, c); } },
          { k: 'check', l: 'Âm thầm tự kiểm chứng', ai: { w: 0.6 }, run: function (l, r, log, c) { c.data.path = 'check'; stress(l, 4); log('Bạn để ý thêm vài tuần, lòng không yên.', 'neutral'); adv(l, c); } },
          { k: 'ignore', l: 'Không để tin đồn ảnh hưởng', ai: { w: 0.8 }, run: function (l, r, log, c) { c.data.path = 'ignore'; log('Bạn chọn tin người mình yêu hơn lời kể của người khác.', 'neutral'); adv(l, c); } }
        ] },
      { after: [1, 1], p: 1, when: free, narrate: function (l, c, log) {
        var p = l.partner; if (!p) return end(l, c, 'changed');
        var a = p.affection108 != null ? p.affection108 : 60, delta = c.data.path === 'ask' ? 6 : c.data.path === 'check' ? -6 : 2;
        p.affection108 = U.clamp(a + delta, 0, 100);
        end(l, c, 'settled', log, c.data.path === 'check' ? 'Tin đồn hóa ra không có gì, nhưng việc âm thầm theo dõi khiến ' + p.name + ' buồn khi biết chuyện.' : 'Tin đồn không đúng. Hai người hiểu nhau hơn sau lần nói chuyện thẳng thắn.', c.data.path === 'check' ? 'neutral' : 'good'); } }
    ] });
  // ---------- 4. Công việc: mâu thuẫn công lao ----------
  CH.define('d917_credit', { max: 2,
    cancel: function (l, c) { if (!l.job || l.job.since !== c.data.since) return { result: 'job_changed' }; },
    stages: [
      { dec: 'd917_credit_1', after: [0, 1], p: 1, when: free, title: 'Ai là người làm dự án?',
        text: function (l, c) { return 'Trong buổi tổng kết, ' + c.npc.name + ' trình bày kết quả dự án nhóm như công của riêng mình. Bạn giữ email và bản nháp chứng minh phần việc của bạn.'; },
        opts: [
          { k: 'talk', l: 'Nói chuyện riêng với ' + 'đồng nghiệp trước', ai: { w: 1.2 }, run: function (l, r, log, c) { c.data.path = 'talk'; log('Bạn nói chuyện riêng; ' + c.npc.name + ' lúng túng, hứa sẽ ghi nhận lại với cấp trên.', 'neutral'); adv(l, c); } },
          { k: 'report', l: 'Báo cấp trên kèm bằng chứng', ai: { w: 0.9, amb: 0.8 }, run: function (l, r, log, c) { c.data.path = 'report'; stress(l, 3); log('Cấp trên tiếp nhận bằng chứng và hẹn xem xét khi đánh giá cuối năm.', 'neutral'); adv(l, c); } },
          { k: 'let', l: 'Bỏ qua, tập trung việc tiếp theo', ai: { w: 0.7 }, run: function (l, r, log, c) { c.data.path = 'let'; fx(l, { hap: -2 }); log('Bạn bỏ qua lần này, nhưng ghi nhớ cách làm việc với người này.', 'neutral'); adv(l, c); } }
        ] },
      { after: [1, 1], p: 1, when: free, narrate: function (l, c, log) {
        var ok = c.data.path === 'let' ? false : roll(l, 'credit') < (c.data.path === 'report' ? 0.75 : 0.6);
        if (l.job) l.job.rep = U.clamp((l.job.rep == null ? 50 : l.job.rep) + (ok ? 4 : c.data.path === 'let' ? -1 : -2), 0, 100);
        end(l, c, ok ? 'credited' : 'unresolved', log, ok ? 'Đánh giá cuối năm ghi nhận đúng phần việc của bạn; uy tín trong nhóm tăng.' : 'Chuyện công lao không được làm rõ; bạn rút kinh nghiệm lưu lại mọi đầu việc.', ok ? 'good' : 'neutral'); } }
    ] });
  // ---------- 5. Kinh doanh: đối tác rút vốn ----------
  CH.define('d917_partner', { max: 1,
    cancel: function (l) { if (!owner(l)) return { result: 'closed' }; },
    stages: [
      { dec: 'd917_partner_1', after: [0, 1], p: 1, when: free, title: 'Đối tác muốn rút vốn',
        text: function (l, c) { return c.npc.name + ', người góp vốn cùng bạn, cần tiền cho việc gia đình và muốn rút phần vốn trong năm nay.'; },
        opts: [
          { k: 'buy', l: function (l) { return 'Mua lại phần vốn (' + mo(l, l.base * 1.2) + ')'; }, req: function (l) { return l.money > l.base * 1.5; }, ai: { w: 1 }, run: function (l, r, log, c) { H.cash(l, -l.base * 1.2, 'Mua lại phần vốn của đối tác'); c.data.path = 'buy'; log('Bạn mua lại phần vốn; quyền quyết định nhiều hơn, tiền mặt ít đi.', 'neutral'); adv(l, c); } },
          { k: 'investor', l: 'Tìm nhà đầu tư mới thay thế', ai: { w: 1.1, amb: 0.6 }, run: function (l, r, log, c) { c.data.path = 'investor'; stress(l, 4); log('Bạn bắt đầu gặp các nhà đầu tư; quá trình có thể kéo dài.', 'neutral'); adv(l, c); } },
          { k: 'shrink', l: 'Thu hẹp quy mô để trả vốn', ai: { w: 0.8 }, run: function (l, r, log, c) { c.data.path = 'shrink'; fx(l, { hap: -2 }); log('Bạn thu hẹp hoạt động để hoàn vốn cho đối tác.', 'neutral'); adv(l, c); } }
        ] },
      { after: [1, 2], p: 1, when: free, narrate: function (l, c, log) {
        var ok = c.data.path === 'buy' || roll(l, 'partner') < (c.data.path === 'investor' ? 0.55 : 0.75);
        if (!ok && c.data.path === 'investor') H.cash(l, -Math.min(Math.max(0, l.money), l.base * 0.4), 'Hoàn vốn cho đối tác khi chưa có nhà đầu tư mới');
        end(l, c, ok ? 'stable' : 'strained', log, ok ? 'Việc kinh doanh ổn định trở lại sau đợt thay đổi vốn; quan hệ với người cũ vẫn tốt.' : 'Chưa tìm được nhà đầu tư kịp; bạn phải tự xoay khoản hoàn vốn.', ok ? 'good' : 'bad'); } }
    ] });
  // ---------- 6. Công vụ: khiếu nại của người dân ----------
  function vnState(l) { return !!(E.STATE174 && E.STATE174.isVNState(l)); }
  CH.define('d917_complaint', { max: 2,
    cancel: function (l) { if (!vnState(l)) return { result: 'moved' }; },
    stages: [
      { dec: 'd917_complaint_1', after: [0, 1], p: 1, when: free, title: 'Đơn khiếu nại gửi đơn vị bạn',
        text: function (l, c) { return 'Một nhóm người dân gửi đơn phản ánh hồ sơ của họ bị chậm nhiều tháng tại đơn vị. Báo chí địa phương bắt đầu quan tâm.'; },
        opts: [
          { k: 'meet', l: 'Trực tiếp tiếp dân, kiểm tra từng hồ sơ', ai: { w: 1.3 }, run: function (l, r, log, c) { c.data.path = 'meet'; stress(l, 3); log('Bạn tiếp dân, lập tổ rà soát; tiến độ xử lý sẽ được báo cáo năm sau.', 'neutral'); adv(l, c); } },
          { k: 'delegate', l: 'Giao cấp dưới xử lý theo quy trình', ai: { w: 1 }, run: function (l, r, log, c) { c.data.path = 'delegate'; log('Bạn giao phòng chuyên môn xử lý và yêu cầu báo cáo.', 'neutral'); adv(l, c); } },
          { k: 'reject', l: 'Bác đơn vì đã đúng quy định', ai: { w: 0.4 }, run: function (l, r, log, c) { c.data.path = 'reject'; log('Bạn trả lời bằng văn bản rằng đơn vị làm đúng quy định.', 'neutral'); adv(l, c); } }
        ] },
      { after: [1, 1], p: 1, when: free, narrate: function (l, c, log) {
        var s = E.STATE174.state(l), ok = roll(l, 'complaint') < (c.data.path === 'meet' ? 0.8 : c.data.path === 'delegate' ? 0.55 : 0.3);
        s.kpi.credibility = U.clamp(s.kpi.credibility + (ok ? 5 : -6), 20, 100); if (!ok) s.kpi.management = U.clamp(s.kpi.management - 2, 20, 100);
        end(l, c, ok ? 'resolved' : 'escalated', log, ok ? 'Phần lớn hồ sơ tồn được giải quyết; người dân ghi nhận.' : 'Khiếu nại kéo dài lên cấp trên; bạn phải giải trình về trách nhiệm quản lý.', ok ? 'good' : 'bad'); } }
    ] });
  // ---------- 7. Người được nâng đỡ bất đồng ----------
  CH.define('d917_protege', { max: 1,
    cancel: function (l, c) { var a = ally(l); if (!a || a.name !== c.npc.name || !vnState(l)) return { result: 'gone' }; },
    stages: [
      { dec: 'd917_protege_1', after: [0, 1], p: 1, when: free, title: function (l, c) { return c.npc.name + ' phản đối phương án của bạn'; },
        text: function (l, c) { return c.npc.name + ', người bạn từng đề nghị bổ nhiệm, phản đối phương án phân bổ ngân sách bạn đưa ra vì cho rằng thiệt cho đơn vị khác.'; },
        opts: [
          { k: 'listen', l: 'Nghe lập luận, điều chỉnh nếu hợp lý', ai: { w: 1.3 }, run: function (l, r, log, c) { c.data.path = 'listen'; log('Bạn tổ chức họp lại, nghe thêm ý kiến chuyên môn.', 'neutral'); adv(l, c); } },
          { k: 'keep', l: 'Giữ phương án, giải thích căn cứ', ai: { w: 0.9 }, run: function (l, r, log, c) { c.data.path = 'keep'; log('Bạn giữ phương án và giải thích căn cứ bằng văn bản.', 'neutral'); adv(l, c); } }
        ] },
      { after: [1, 1], p: 1, when: free, narrate: function (l, c, log) {
        var a = ally(l), s = E.STATE174.state(l); if (!a) return end(l, c, 'gone');
        a.trust = U.clamp(a.trust + (c.data.path === 'listen' ? 8 : -6), 0, 100); s.kpi.coordination = U.clamp(s.kpi.coordination + (c.data.path === 'listen' ? 3 : 0), 20, 100);
        end(l, c, 'settled', log, c.data.path === 'listen' ? 'Phương án điều chỉnh được hai đơn vị đồng thuận; ' + a.name + ' càng nể bạn.' : 'Phương án được thực hiện; ' + a.name + ' vẫn giữ ý kiến riêng, quan hệ công việc có phần dè dặt.', c.data.path === 'listen' ? 'good' : 'neutral'); } }
    ] });
  // ---------- 8. Con gặp khó khăn ở trường ----------
  CH.define('d917_school', { max: 2,
    cancel: function (l, c) { var k = kid(l, c); if (!k || l.age - k.born > 18) return { result: 'grown' }; },
    stages: [
      { dec: 'd917_school_1', after: [0, 1], p: 1, when: free, title: function (l, c) { return c.npc.name + ' gặp khó ở trường'; },
        text: function (l, c) { return 'Giáo viên báo ' + c.npc.name + ' gần đây sa sút và hay buồn; có thể do áp lực học hoặc va chạm với bạn bè. Con chưa muốn kể.'; },
        opts: [
          { k: 'teacher', l: 'Gặp giáo viên và nói chuyện riêng với con', ai: { w: 1.3 }, run: function (l, r, log, c) { c.data.path = 'teacher'; log('Bạn gặp giáo viên, dành thời gian đi dạo và nghe con nói.', 'neutral'); adv(l, c); } },
          { k: 'tutor', l: function (l) { return 'Thuê gia sư (' + mo(l, l.base * 0.08) + '/năm)'; }, req: function (l) { return l.money > l.base * 0.2; }, ai: { w: 0.9 }, run: function (l, r, log, c) { H.cash(l, -l.base * 0.08, 'Gia sư cho con'); c.data.path = 'tutor'; log('Bạn thuê gia sư kèm thêm môn con yếu.', 'neutral'); adv(l, c); } },
          { k: 'self', l: 'Để con tự xoay xở, theo dõi thêm', ai: { w: 0.5 }, run: function (l, r, log, c) { c.data.path = 'self'; log('Bạn để con tự điều chỉnh, hẹn xem lại học kỳ sau.', 'neutral'); adv(l, c); } }
        ] },
      { after: [1, 1], p: 1, when: free, narrate: function (l, c, log) {
        var k = kid(l, c); if (!k) return end(l, c, 'grown');
        var ok = roll(l, 'school') < (c.data.path === 'teacher' ? 0.8 : c.data.path === 'tutor' ? 0.65 : 0.4);
        k.close = U.clamp((k.close || 60) + (c.data.path === 'teacher' ? 6 : 1), 0, 100); if (k.study != null) k.study = U.clamp(k.study + (ok ? 6 : -3), 0, 100);
        end(l, c, ok ? 'recovered' : 'ongoing', log, ok ? k.name + ' dần lấy lại nhịp học và vui hơn.' : k.name + ' vẫn còn khó khăn; bạn tiếp tục đồng hành, có thể cần hỗ trợ chuyên môn.', ok ? 'good' : 'neutral'); } }
    ] });
  // ---------- 9. Di cư: nghề không được công nhận khi chuyển nước ----------
  CH.define('d917_move', { max: 1,
    cancel: function (l) { if (!l.abroad || !l.abroad.perm) return { result: 'moved_back' }; },
    stages: [
      { dec: 'd917_move_1', after: [0, 1], p: 1, when: free, title: 'Bằng cấp chưa được công nhận',
        text: function (l, c) { return 'Ở ' + l.abroad.name + ', nhà tuyển dụng yêu cầu chứng chỉ hành nghề địa phương; kinh nghiệm cũ chưa được tính đủ.'; },
        opts: [
          { k: 'cert', l: function (l) { return 'Học chứng chỉ địa phương (' + mo(l, l.base * 0.15) + ')'; }, req: function (l) { return l.money > l.base * 0.3; }, ai: { w: 1.2 }, run: function (l, r, log, c) { H.cash(l, -l.base * 0.15, 'Chứng chỉ hành nghề địa phương'); c.data.path = 'cert'; stress(l, 3); log('Bạn đăng ký khóa học và kỳ thi chứng chỉ.', 'neutral'); adv(l, c); } },
          { k: 'lower', l: 'Nhận việc thấp hơn để có kinh nghiệm bản địa', ai: { w: 1 }, run: function (l, r, log, c) { c.data.path = 'lower'; fx(l, { hap: -2 }); log('Bạn nhận một vị trí thấp hơn để bắt đầu lại.', 'neutral'); adv(l, c); } }
        ] },
      { after: [1, 2], p: 1, when: free, narrate: function (l, c, log) {
        var ok = roll(l, 'move') < (c.data.path === 'cert' ? 0.7 : 0.5); if (ok && l.job) l.job.rep = U.clamp((l.job.rep == null ? 50 : l.job.rep) + 5, 0, 100);
        end(l, c, ok ? 'recognised' : 'slow', log, ok ? 'Bạn được công nhận chuyên môn ở ' + l.abroad.name + ', cơ hội nghề nghiệp mở rộng.' : 'Quá trình công nhận còn chậm; bạn tích lũy thêm kinh nghiệm bản địa.', ok ? 'good' : 'neutral'); } }
    ] });

  // ---------- Bộ khởi phát chung ----------
  function candidates(l) {
    var out = [], parentGone = !(l.fam && l.fam.fAlive) || !(l.fam && l.fam.mAlive), sibs = (l.sibList || []).filter(function (s) { return s.alive && l.age - s.born >= 18; });
    if (l.age >= 25 && parentGone && sibs.length && !st(l).willDone) out.push(['d917_will', 0.8, { npc: { ref: null, name: sibs[0].n }, data: { who: !l.fam.fAlive ? 'bố' : 'mẹ' } }]);
    if (l.age >= 22 && sibs.length) out.push(['d917_debt', 0.6, { npc: { ref: null, name: sibs[Math.floor(roll(l, 'pick') * sibs.length)].n }, data: { kind: 'sib' } }]);
    if (l.age >= 18 && l.partner && l.partner.alive !== false) out.push(['d917_rumor', 0.5, { npc: { ref: null, name: l.partner.name }, data: {} }]);
    if (l.job && l.age >= 20 && !l.retired) out.push(['d917_credit', 0.8, { npc: { ref: null, name: H.stranger(l, prng(l, 'colleague')) }, data: { since: l.job.since } }]);
    if (owner(l)) out.push(['d917_partner', 0.6, { npc: { ref: null, name: H.stranger(l, prng(l, 'partner')) }, data: {} }]);
    if (vnState(l) && E.STATE174.levelOf(l) >= 3) out.push(['d917_complaint', 0.9, { npc: { ref: null, name: 'người dân' }, data: {} }]);
    var a = ally(l); if (a && vnState(l)) out.push(['d917_protege', 0.6, { npc: { ref: null, name: a.name }, data: {} }]);
    var kids = (l.kids || []).filter(function (k) { return k.alive !== false && l.age - k.born >= 7 && l.age - k.born <= 16; });
    if (kids.length) out.push(['d917_school', 0.9, { npc: { ref: null, name: kids[Math.floor(roll(l, 'kid') * kids.length)].name }, data: {} }]);
    if (l.abroad && l.abroad.perm && l.age >= 22) out.push(['d917_move', 0.7, { npc: { ref: null, name: '' }, data: {} }]);
    return out;
  }
  function openCount(l) { var s = l.flags.chains144; return s && Array.isArray(s.active) ? s.active.filter(function (c) { return /^d917_/.test(c.kind); }).length : 0; }
  function tryStart(l, log) {
    var s = st(l); if (!free(l) || l.age < 12 || s.at === l.age) return null; s.at = l.age;
    if (openCount(l) >= BAL.maxOpen) return null;
    if (roll(l, 'start') >= BAL.base * MODES[s.mode].k) return null;
    var pool = candidates(l).filter(function (x) { return s.last[x[0]] == null || l.age - s.last[x[0]] >= BAL.cooldown; });
    if (!pool.length) return null;
    var tot = pool.reduce(function (n, x) { return n + x[1]; }, 0), pick = roll(l, 'which') * tot, chosen = pool[0];
    for (var i = 0; i < pool.length; i++) { pick -= pool[i][1]; if (pick <= 0) { chosen = pool[i]; break; } }
    var c = CH.start(l, chosen[0], { dec: 'drama917', k: s.mode }, chosen[2]);
    if (c) { s.last[chosen[0]] = l.age; s.started++; if (chosen[0] === 'd917_will') s.willDone = true; }
    return c;
  }
  E.HOOKS.year.push(function (l, r, log) { if (l.alive && ['vn', 'world'].includes(l.mode)) tryStart(l, log); });
  X.menu('drama917', 'Nhịp biến cố của cuộc đời', function (l) { return X.reason(l, 12); }, function (l) {
    var s = st(l); return 'Hiện tại: ' + MODES[s.mode].n + '. Cường độ chỉ đổi tần suất khởi phát những chuyện nhiều năm (gia đình, tình cảm, công việc, kinh doanh, công vụ, con cái, di cư); không làm hậu quả nặng hơn. Mặc định là Cân bằng; có thể đổi mỗi năm một lần.' + (openCount(l) ? ' Đang có ' + openCount(l) + ' chuyện kéo dài.' : '');
  }, function (l) {
    var s = st(l); return Object.keys(MODES).map(function (k) { return { k: k, l: (s.mode === k ? '✓ ' : '') + MODES[k].n, h: k === 'calm' ? 'Ít biến cố hơn, cuộc đời êm hơn' : k === 'eventful' ? 'Nhiều chuyện xảy ra hơn, không nặng hơn' : 'Mặc định', why: s.mode === k ? 'Đang dùng' : s.modeAt === l.age ? 'Đã đổi năm nay' : true, run: function (l, r, log) { var q = st(l); if (q.modeAt === l.age) return; q.mode = k; q.modeAt = l.age; log('Nhịp biến cố chuyển sang: ' + MODES[k].n + '.', 'neutral'); } }; });
  }, 12, 'Đời sống');
  var mig = E.migrateExt; E.migrateExt = function (l) { if (mig) mig(l); if (l && l.flags && l.flags.drama917 != null && typeof l.flags.drama917 !== 'object') delete l.flags.drama917; };
  E.DRAMA917 = { MODES: MODES, BAL: BAL, state: st, candidates: candidates, tryStart: tryStart, openCount: openCount };
})(globalThis.G);
