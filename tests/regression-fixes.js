/* GĐ2.5 — test tái hiện cho từng nguyên nhân gốc của các lỗi regression tồn đọng.
   Mỗi ca được viết để THẤT BẠI trên mã trước khi sửa (tag pre-gd2-5) và đạt sau khi sửa.
   Chạy: node tests/regression-fixes.js [tên ca …] */
'use strict';
const { run, year, settle, clone, badText } = require('./lib/quick');
const noop = () => {};
function logger(l) { return (t, k) => l.log.push({ a: l.age, t, k: k || '' }); }

const cases = [
  { name: 'direct111-school-kept', run(t, G) {
    // Tuyển thẳng: trường người chơi chọn phải được giữ, kể cả ngành Y (trường Y được chọn ở bước sau trên mã cũ → null)
    const E = G.E, ctx = require('./regression-contexts')(G).direct111;
    let tried = 0;
    ['chem', 'bio', 'math', 'english', 'lit'].forEach(sub => {
      const l0 = clone(ctx.life); l0.flags.study54.records = { [sub]: 4 };
      let d; try { d = E.DEC.direct111.make(l0, () => 0.5, ctx.arg); } catch (e) { return; }
      d.opts.filter(o => o.k !== 'cancel').slice(0, 6).forEach(o => {
        const l = clone(l0), dd = E.DEC.direct111.make(l, () => 0.5, ctx.arg), school = o.l.split(' · ')[0];
        dd.manual = true; l.pending.unshift(dd); const n0 = l.log.length;
        E.resolve(l, o.k); settle(E, l, 10); tried++;
        t.ok(l.uniName === school, sub + ' / ' + o.l + ': giữ trường đã chọn (' + l.uniName + ')');
        t.ok(!l.log.slice(n0).some(e => badText(e.t)), sub + ' / ' + o.l + ': nhật ký không có null/undefined');
      });
    });
    t.ok(tried >= 10, 'đã thử ' + tried + ' lựa chọn tuyển thẳng');
  } },
  { name: 'company137-forms', run(t, G) {
    // Phương án của các biểu mẫu doanh nghiệp phải có nhãn & gợi ý dạng chuỗi; tặng cổ phần / sáp nhập không làm mất tài sản
    const E = G.E, ctx = require('./regression-contexts')(G), base = clone(ctx.groupSector133.life);
    base.kids = [{ name: 'Minh Kiểm Thử', sex: 'M', born: 10, alive: true, close: 70 }]; E.NPC.ensureIds(base);
    const B = E.BUSINESS137;
    ['companyName137', 'companyTransfer137', 'companyMerge137'].forEach(id => {
      const d = E.DEC[id].make(clone(base), () => 0.5, { i: 0 });
      t.ok(d.opts.length === 2 && d.opts.every(o => typeof o.k === 'string' && typeof o.l === 'string' && typeof o.h === 'string'), id + ': phương án có khóa, nhãn, gợi ý dạng chuỗi');
      t.ok(!/undefined|null|NaN/.test(d.title + d.text + d.opts.map(o => o.l + o.h).join('')), id + ': nội dung hiển thị sạch');
    });
    // tặng 10% công ty thứ hai (sở hữu 100%) cho con: tổng cổ phần giữ nguyên, tiền mặt không đổi
    const l = clone(base), comp = l.flags.world120.companies, c = comp[1], rel = B.relatives(l).find(x => x.kind === 'child' || /child/.test(x.id)) || B.relatives(l)[0];
    if (t.ok(!!rel, 'có người thân nhận cổ phần')) {
      const d = E.DEC.companyTransfer137.make(l, () => 0.5, { i: 1 }); d.data.recipient = rel.id; d.data.percent = 10; d.manual = true;
      const money = l.money, before = c.share + (c.holders137 || []).reduce((a, h) => a + h.share, 0);
      l.pending.unshift(d); E.resolve(l, 'save');
      const after = c.share + (c.holders137 || []).reduce((a, h) => a + h.share, 0);
      t.ok(c.share === 90 && Math.abs(after - before) < 1e-9 && l.money === money, 'tặng cổ phần: bạn 100% → ' + c.share + '%, tổng ' + before + ' → ' + after + ', tiền mặt không đổi');
    }
    // sáp nhập hai công ty kiểm soát: phần giá trị bạn sở hữu không mất (chỉ trừ phí pháp lý tiền mặt)
    const m = clone(base), A = m.flags.world120.companies.filter(x => x.share > 50);
    if (t.ok(A.length >= 2, 'có hai công ty kiểm soát để sáp nhập')) {
      const owned0 = A.reduce((a, x) => a + x.value * x.share / 100, 0), total0 = A.reduce((a, x) => a + x.value, 0), money0 = m.money;
      // chụp số liệu TRƯỚC khi sáp nhập (object công ty bị cập nhật tại chỗ)
      const ownedA = A.slice(0, 2).reduce((a, x) => a + x.value * x.share / 100, 0), totalA = A.slice(0, 2).reduce((a, x) => a + x.value, 0);
      const d = E.DEC.companyMerge137.make(m, () => 0.5, {}); d.data.selected = A.slice(0, 2).map(x => E.UPDATE110.uid(m, x)); d.data.target = d.data.selected[0]; d.manual = true;
      m.pending.unshift(d); E.resolve(m, 'save');
      const left = m.flags.world120.companies.filter(x => !x.merged), tgt = left.find(x => E.UPDATE110.uid(m, x) === d.data.target);
      t.ok(!!tgt && Math.abs(tgt.value - totalA) < 1e-6 && Math.abs(tgt.value * tgt.share / 100 - ownedA) < 1e-6, 'sáp nhập: giá trị ' + Math.round(totalA) + ' và phần bạn sở hữu ' + Math.round(ownedA) + ' được giữ (' + (tgt && Math.round(tgt.value)) + ' · ' + (tgt && tgt.share) + '%)');
      t.ok(m.money <= money0 && m.money >= money0 - m.base * 0.2 - 1e-9, 'chỉ trừ phí pháp lý tiền mặt');
      t.ok(owned0 > 0 && total0 > 0, 'số liệu ban đầu hợp lệ');
    }
  } },
  { name: 'highschool-fallback-continues', run(t, G) {
    // Trượt lớp 10: trượt cả phương án dự phòng hoặc chọn "chờ đợt sau" thì phải còn cơ hội, không bị kẹt ngoài trường mãi
    const E = G.E, ctx = require('./regression-contexts')(G).highFallback125, log = noop;
    const l = clone(ctx.life); E.DEC.highSchool125.apply(l, E.DEC.highSchool125.make(l, () => 0), '0', () => 0, log); l.pending = [];
    const p = l.flags.world120 || {};
    if (!t.ok(p.hsFailed, 'dựng được trạng thái trượt nguyện vọng 1')) return;
    p.highExam.score = 50; // đủ điểm để có phương án công lập địa phương
    const d = E.DEC.highFallback125.make(l, () => 0.5), keys = d.data.keys;
    const localI = keys.indexOf('local');
    if (t.ok(localI >= 0, 'có phương án công lập địa phương')) {
      E.DEC.highFallback125.apply(l, d, String(localI), () => 0.99, log); // hết chỉ tiêu
      const again = l.pending.find(x => x.id === 'highFallback125');
      t.ok(!l.school && !!again, 'trượt dự phòng → lựa chọn được mở lại ngay (trước đây kẹt, không đi học)');
      t.ok(again && again.data.keys.indexOf('local') < 0 && again.data.keys.indexOf('voc') >= 0, 'lần mở lại không còn phương án vừa trượt, còn trung cấp / chờ đợt sau');
      const v = again.data.keys.indexOf('voc'); E.DEC.highFallback125.apply(l, again, String(v), () => 0.5, log);
      t.ok(l.school === 'voc', 'chọn trung cấp nghề thì được đi học');
    }
    // chờ đợt sau → năm sau được xét lại
    const w = clone(ctx.life); E.DEC.highSchool125.apply(w, E.DEC.highSchool125.make(w, () => 0), '0', () => 0, log); w.pending = [];
    const dw = E.DEC.highFallback125.make(w, () => 0.5); E.DEC.highFallback125.apply(w, dw, String(dw.data.keys.indexOf('wait')), () => 0.5, log);
    const hook = E.HOOKS.year.find(fn => String(fn).indexOf('fallbackAt') >= 0);
    if (t.ok(!!hook, 'có cơ chế xét lại năm sau')) { hook(w, () => 0.5, log, w.age); w.age++; w.pending = []; E.beginYear(w, {}); t.ok(w.pending.some(x => x.id === 'highFallback125'), 'năm sau có lại lựa chọn đi học'); }
  } },
  { name: 'annual-fee-log', run(t, G) {
    // Khoản chăm sóc & học tập thường niên: vẫn thu đủ mỗi năm, nhưng nhật ký không lặp y nguyên một câu mỗi năm
    const E = G.E;
    let lives = 0, worst = 0, paidYears = 0, extraLines = 0;
    for (let i = 0; i < 40; i++) {
      G.testClock.reset(); const l = E.createLife({ mode: 'vn', seed: 70000 + i });
      for (let y = 0; y < 15 && l.alive; y++) { year(E, l); paidYears += ((l.yr && l.yr.familyExpenses) || []).filter(x => /thường niên/.test(x.t)).length; }
      const seen = {}; l.log.filter(e => e.a <= 15).forEach(e => { if (/thanh toán .* từ tiền gia đình|chưa đồng ý chi cho chăm sóc|phương án phù hợp ngân sách/.test(e.t)) { seen[e.t] = (seen[e.t] || 0) + 1; } });
      const rep = Object.values(seen).reduce((a, n) => a + n - 1, 0); worst = Math.max(worst, rep); extraLines += rep; lives++;
    }
    t.ok(paidYears > 0, 'khoản thường niên vẫn được gia đình chi (' + paidYears + ' năm-đời)');
    t.ok(worst <= 1, 'không còn câu chi trả / từ chối lặp y nguyên qua các năm (nhiều nhất ' + worst + ' câu lặp trong một đời, tổng ' + extraLines + ' / ' + lives + ' đời)');
    const k = E.createLife({ mode: 'vn', seed: 70001 }); k.age = 8; const b = E.childExpense(k, k.base * 0.01, 'Lớp vẽ', false);
    t.ok(!b.ok || /cho lớp vẽ/.test(b.note), 'câu thanh toán nói rõ khoản chi: ' + b.note);
  } },
  { name: 'no-income-log-after-death', run(t, G) {
    // Mất giữa năm (vd. tai nạn trong careerYear): không được ghi dòng thu nhập sau dòng qua đời
    const E = G.E;
    [['ca_si', 'ca sĩ'], ['cay_thue', 'cày thuê']].forEach(([job, name]) => {
      G.testClock.reset(); const l = E.createLife({ mode: 'vn', seed: 81000 }); l.age = 30; l.indep = true; l.school = null; l.edu = 5;
      E.startJob(l, job, () => 0.5, noop, true); l.fame = 1e6; l.skill = 80;
      // chỉ trong môi trường kiểm thử: rủi ro nghề nghiệp chắc chắn xảy ra để cái chết xảy ra BÊN TRONG careerYear như ngoài game
      const c = E.CAR[E.resolveJob(job)], haz = c.haz; c.haz = [0, 1, 'tai nạn khi biểu diễn'];
      const lines = []; E.careerYear(l, () => 0.5, (t2) => lines.push(t2), 'work'); c.haz = haz;
      const di = lines.findIndex(x => /^Qua đời/.test(x));
      t.ok(!l.alive && di >= 0 && di === lines.length - 1, name + ': dòng qua đời là dòng cuối (sau đó: ' + lines.slice(di + 1).join(' | ').slice(0, 80) + ')');
    });
  } },
  { name: 'partner-wording', run(t, G) {
    // Câu nhắc tới bạn đời cụ thể phải gọi đúng vợ / chồng / người bạn đời, không để "vợ/chồng" chung chung (cùng giới bị gọi nhầm)
    const E = G.E, ctx = require('./regression-contexts')(G).collectors140;
    [['F', 'F', 'người bạn đời'], ['F', 'M', 'chồng'], ['M', 'F', 'vợ']].forEach(([me, them, word]) => {
      let fled = false;
      for (let i = 0; i < 30 && !fled; i++) {
        const l = clone(ctx.life); l.sex = me; l.rs = (l.rs + i * 7919) | 0;
        l.partner = { name: 'Hà Thu Trang', sex: them, age: 40, alive: true, status: 'married', since: 30 }; E.NPC.ensureIds(l);
        const d = E.DEC.collectors140.make(l, () => 0.5, {}), flee = d.opts.find(o => /trốn|bỏ đi|chuyển đi|đi nơi khác/i.test(o.l));
        if (!flee) continue;
        d.manual = true; l.pending.unshift(d); const n0 = l.log.length; E.resolve(l, flee.k);
        const line = l.log.slice(n0).map(e => e.t).find(x => /^Bạn đưa /.test(x));
        if (!line) continue; fled = true;
        t.ok(line.indexOf('Bạn đưa ' + word + ' ') === 0 && !/vợ\/chồng/.test(line), me + '+' + them + ': "' + line.slice(0, 40) + '…" gọi là "' + word + '"');
      }
      t.ok(fled, me + '+' + them + ': mô phỏng được lựa chọn bỏ trốn');
      const l = clone(ctx.life); l.sex = me; l.partner = { name: 'Hà Thu Trang', sex: them, age: 40, alive: true, status: 'married', since: 30 };
      const rel = E.BUSINESS137.relatives(l).find(x => x.person === l.partner);
      t.ok(rel && rel.label === word && rel.kind === 'vợ/chồng', me + '+' + them + ': danh sách người thân hiển thị "' + (rel && rel.label) + '" (khóa phân loại giữ "' + (rel && rel.kind) + '")');
      const row = rel && E.DEC.companyTransfer137 && E.BUSINESS137.relatives(l).map(p => p.name + ' · ' + (p.label || p.kind)).find(x => x.indexOf('Hà Thu Trang') === 0);
      t.ok(row === 'Hà Thu Trang · ' + word, me + '+' + them + ': dòng chọn người nhận: "' + row + '"');
    });
  } }
];

run('GĐ2.5 — test tái hiện lỗi regression tồn đọng', cases, { timeoutMs: 90000 });
