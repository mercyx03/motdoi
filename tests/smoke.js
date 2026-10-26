/* Smoke test — kiểm tra nhanh các luồng chính sau mỗi lần nâng cấp (vài phút).
   Chạy: node tests/smoke.js            (tất cả ca)
         node tests/smoke.js save-load  (một vài ca theo tên)
   Smoke test ĐẠT không có nghĩa bộ hồi quy đầy đủ (node tests/regression.js) đã đạt.
   Chỉ đọc trạng thái game; không đổi cấu trúc bản lưu, không gán thêm định danh cho nhân vật. */
'use strict';
const { run, year, settle, badText, clone } = require('./lib/quick');

const SEEDS = [31001, 31002, 31003, 31004, 31005, 31006];
function lives(E, n, extra) { return SEEDS.slice(0, n).map((s, i) => E.createLife(Object.assign({ mode: i % 2 ? 'world' : 'vn', seed: s }, extra || {}))); }
function liveTo(E, l, age) { let g = 0; while (l.alive && l.age < age && g++ < 130) year(E, l); return l; }
function statsOk(t, l, tag) {
  ['hea', 'hap', 'kno', 'soc'].forEach(k => t.ok(Number.isFinite(l.st[k]) && l.st[k] >= 0 && l.st[k] <= 100, tag + ': chỉ số ' + k + ' = ' + l.st[k]));
  t.ok(Number.isFinite(l.money), tag + ': tiền mặt hữu hạn (' + l.money + ')');
}
// Mọi định danh đã có sẵn trên nhân vật (không tạo mới): uid110, parentId của con, uid family100.
function ids(l) {
  const out = [];
  const add = (who, o) => { if (!o) return; if (o.uid110) out.push([who + '.uid110', o.uid110, o]); if (o.parentId) out.push([who + '.parentId', o.parentId, o]); if (o.family100 && o.family100.uid) out.push([who + '.family100', o.family100.uid, o]); };
  add('partner', l.partner); add('bff', l.bff);
  (l.kids || []).forEach((k, i) => add('kids[' + i + ']', k));
  (l.sibList || []).forEach((k, i) => add('sib[' + i + ']', k));
  (l.friends || []).forEach((k, i) => add('friend[' + i + ']', k));
  return out;
}

const cases = [
  { name: 'create-life', run(t, G) {
    const E = G.E;
    const opts = [{ mode: 'vn', variant: '34' }, { mode: 'vn', variant: '63' }, { mode: 'world' }, { mode: 'vn', difficulty: 'hardcore' }, { mode: 'world', difficulty: 'hardcore' }];
    opts.forEach((o, i) => {
      const l = E.createLife(Object.assign({ seed: 30100 + i }, o)), tag = JSON.stringify(o);
      t.ok(l.alive && l.age === 0, tag + ': sinh ra, 0 tuổi');
      t.ok(!badText(l.name) && l.name.trim().length > 1, tag + ': tên hợp lệ "' + l.name + '"');
      t.ok(l.sex === 'M' || l.sex === 'F', tag + ': giới tính hợp lệ');
      t.ok(!badText(E.placeText(l)), tag + ': nơi sinh hiển thị sạch');
      t.ok(Number.isFinite(l.birthYear) && l.fam && Number.isFinite(l.fam.q), tag + ': năm sinh & gia đình');
      t.ok(l.difficulty === (o.difficulty || 'normal'), tag + ': độ khó đúng');
      t.ok(Array.isArray(l.pending) && Array.isArray(l.log) && Array.isArray(l.kids), tag + ': cấu trúc mảng cơ bản');
      statsOk(t, l, tag);
      t.ok(!badText(E.statusLine(l)), tag + ': dòng trạng thái sạch');
    });
  } },
  { name: 'seed-determinism', run(t, G) {
    const { loadGame } = require('./lib/quick');
    const play = (g, s, m) => { const E = g.E, l = E.createLife({ mode: m, seed: s }); for (let y = 0; y < 40 && l.alive; y++) year(E, l); return JSON.stringify(l.log); };
    // với đồng hồ kiểm thử cố định (mỗi lần chạy nạp game mới để đồng hồ về điểm xuất phát): bắt buộc tái lập được
    [[31001, 'vn'], [31002, 'world']].forEach(([s, m]) => t.ok(play(loadGame(), s, m) === play(loadGame(), s, m), 'seed ' + s + ' (' + m + '): hai lần chạy cho cùng nhật ký với đồng hồ kiểm thử'));
    // với giờ thật: ghi nhận hiện trạng (life.id ngẫu nhiên làm hạt giống cho life126/130/138/141) — cảnh báo, không chặn
    const a = loadGame({ realClock: true }), b = loadGame({ realClock: true });
    const same = [[31001, 'vn'], [31002, 'world']].filter(([s, m]) => play(a, s, m) === play(b, s, m)).length;
    if (same < 2) t.warn('Đã biết: với giờ thật, cùng seed cho ra đời khác nhau (' + (2 - same) + '/2 mẫu) vì createLife đặt life.id = Date.now()+Math.random() và life126/130/138/141 băm theo l.id. Lưu/tải không bị ảnh hưởng (id nằm trong bản lưu).');
    else t.info('với giờ thật, cùng seed vẫn cho cùng nhật ký');
  } },
  { name: 'aging', run(t, G) {
    const E = G.E;
    lives(E, 4).forEach((l, i) => {
      const by = l.birthYear;
      for (let y = 0; y < 30 && l.alive; y++) {
        const a = l.age; year(E, l);
        if (l.alive) t.ok(l.age === a + 1, '#' + i + ': mỗi năm tăng đúng 1 tuổi (' + a + ' → ' + l.age + ')');
        t.ok(l.birthYear === by, '#' + i + ': năm sinh không đổi');
        statsOk(t, l, '#' + i + ' tuổi ' + l.age);
      }
      if (l.alive) t.ok(l.yrs.length === l.age, '#' + i + ': bản đồ đời đủ ' + l.age + ' năm (' + l.yrs.length + ')');
      t.ok(!l.log.some(e => badText(e.t)), '#' + i + ': nhật ký không có chữ hỏng');
      t.ok(l.log.every((e, j) => j === 0 || e.a >= l.log[j - 1].a), '#' + i + ': nhật ký theo thứ tự tuổi');
    });
  } },
  { name: 'decisions', timeoutMs: 120000, run(t, G) {
    const E = G.E;
    let made = 0, tried = 0, ids = {};
    lives(E, 4).forEach((l, i) => {
      for (let y = 0; y < 40 && l.alive; y++) {
        E.beginYear(l, { auto: true });
        // thử MỌI phương án của lựa chọn đầu tiên trên bản sao, rồi để AI chọn trên đời thật
        if (l.pending.length) {
          const d = l.pending[0]; made++; ids[d.id] = 1;
          t.ok(E.DEC[d.id] && d.opts.length > 0, '#' + i + ' "' + d.id + '": có định nghĩa và phương án');
          t.ok(!badText(d.title) && !badText(d.text) && d.opts.every(o => !badText(o.l)), '#' + i + ' "' + d.id + '": nội dung sạch');
          d.opts.forEach(o => { const c = clone(l); tried++; E.resolve(c, o.k); settle(E, c, 20); statsOk(t, c, '#' + i + ' ' + d.id + '/' + o.k); });
          const ak = E.autoKey(clone(l)); // gọi một lần, trên bản sao: autoKey tiêu một số ngẫu nhiên
          t.ok(d.opts.some(o => o.k === ak), '#' + i + ' "' + d.id + '": AI chọn phương án hợp lệ (' + ak + ')');
        }
        settle(E, l); if (l.alive) E.finishYear(l); settle(E, l); E.endYear(l);
        t.ok(l.pending.length === 0, '#' + i + ': không còn lựa chọn treo sau khi kết thúc năm');
      }
      // hành động chủ động của người chơi
      if (l.alive) {
        const av = E.actions(l).filter(a => a.ok === true);
        t.ok(av.length > 0, '#' + i + ': có hành động chủ động khả dụng ở tuổi ' + l.age);
        const c = clone(l), d = av.length && E.act(c, av[0].id);
        if (d) { E.resolve(c, E.autoKey(c)); settle(E, c, 20); statsOk(t, c, '#' + i + ' hành động ' + av[0].id); }
      }
    });
    t.info(made + ' lựa chọn thật (' + Object.keys(ids).length + ' loại), ' + tried + ' phương án thử trên bản sao');
    t.ok(made >= 40, 'đủ lựa chọn phát sinh trong 4 đời × 40 năm (' + made + ')');
  } },
  { name: 'npc-identity', timeoutMs: 120000, run(t, G) {
    const E = G.E;
    let seenIds = 0;
    lives(E, 6).forEach((l, i) => {
      const first = new Map(); // đối tượng → định danh đầu tiên
      for (let y = 0; y < 70 && l.alive; y++) {
        year(E, l);
        const cur = ids(l), live = new Map();
        cur.forEach(([where, id, o]) => {
          const key = where.split('.')[1] + ':' + id;
          if (o.alive !== false) { t.ok(!live.has(key) || live.get(key) === o, '#' + i + ' tuổi ' + l.age + ': định danh ' + key + ' bị dùng cho hai người khác nhau'); live.set(key, o); }
          const kind = where.split('.')[1], prev = first.get(o) || {};
          if (prev[kind]) t.ok(prev[kind] === id, '#' + i + ': ' + where + ' đổi định danh ' + prev[kind] + ' → ' + id);
          else { prev[kind] = id; first.set(o, prev); seenIds++; }
        });
        // hồ sơ người quen (life138): người đã có trong hồ sơ không biến mất giữa chừng
        const people = l.flags.life138 && l.flags.life138.people;
        if (people) { const keys = Object.keys(people); if (l._smokePeople) t.ok(l._smokePeople.every(k => keys.includes(k)), '#' + i + ' tuổi ' + l.age + ': hồ sơ người quen bị mất mục'); Object.defineProperty(l, '_smokePeople', { value: keys, writable: true, enumerable: false, configurable: true }); }
      }
      // định danh còn nguyên sau khi lưu → tải (JSON + migrate như app.js)
      const before = ids(l).map(x => x[0] + '=' + x[1]).sort().join('|');
      const after = ids(E.migrate(clone(l))).map(x => x[0] + '=' + x[1]).sort().join('|');
      t.ok(before === after, '#' + i + ': định danh nhân vật giữ nguyên sau lưu/tải');
    });
    t.info(seenIds + ' định danh nhân vật được theo dõi qua các năm');
  } },
  { name: 'family-relations', timeoutMs: 120000, run(t, G) {
    const E = G.E;
    let partners = 0, kids = 0, friends = 0;
    lives(E, 6).forEach((l, i) => {
      for (let y = 0; y < 75 && l.alive; y++) {
        year(E, l);
        const p = l.partner;
        if (p) {
          partners++;
          t.ok(!badText(p.name) && p.alive !== false, '#' + i + ' tuổi ' + l.age + ': người yêu/bạn đời hợp lệ và còn sống');
          if (p.status !== 'dating') t.ok(l.age >= 16 && p.age >= 16, '#' + i + ': kết hôn/chung sống khi cả hai đủ tuổi (' + l.age + '/' + p.age + ')');
        }
        (l.kids || []).forEach(k => {
          t.ok(!badText(k.name) && Number.isFinite(k.born), '#' + i + ': hồ sơ con hợp lệ');
          t.ok(k.born <= l.age, '#' + i + ': con ' + k.name + ' sinh sau tuổi hiện tại (' + k.born + ' > ' + l.age + ')');
          if (!(k.adopt || k.adopted || k.step)) t.ok(k.born >= 12, '#' + i + ': con ruột ' + k.name + ' sinh khi bạn ' + k.born + ' tuổi');
        });
        if (l.bff) t.ok(!badText(l.bff.name), '#' + i + ': bạn thân có tên');
        t.ok(l.fam && typeof l.fam.mAlive === 'boolean' || l.fam.mAlive == null || l.fam.mAlive === 0 || l.fam.mAlive === 1, '#' + i + ': trạng thái mẹ hợp lệ');
      }
      kids += (l.kids || []).length; friends += (l.friends || []).length + (l.bff ? 1 : 0);
    });
    t.info('năm có bạn đời: ' + partners + ', tổng số con: ' + kids + ', bạn bè: ' + friends);
    t.ok(partners > 0 && kids > 0, 'mẫu có cả bạn đời và con cái để kiểm tra');
  } },
  { name: 'career-finance', timeoutMs: 120000, run(t, G) {
    const E = G.E;
    let withJob = 0, withLoan = 0;
    lives(E, 6).forEach((l, i) => {
      for (let y = 0; y < 60 && l.alive; y++) {
        year(E, l);
        if (l.job) {
          withJob++;
          const id = E.resolveJob(l.job.id);
          t.ok(!!E.CAR[id], '#' + i + ' tuổi ' + l.age + ': nghề "' + l.job.id + '" có trong danh mục');
          t.ok(!badText(E.jobTitle(l) || ''), '#' + i + ': chức danh sạch');
        }
        (l.loans || []).forEach(x => t.ok(Number.isFinite(x.bal) && x.bal >= -1e-6, '#' + i + ': dư nợ hợp lệ (' + x.bal + ')'));
        if ((l.loans || []).length) withLoan++;
        t.ok(Number.isFinite(E.netWorth(l)) && Number.isFinite(E.assetTotal(l)), '#' + i + ': tài sản ròng hữu hạn');
        t.ok(Number.isFinite(l.houseVal || 0) && (l.houseVal || 0) >= 0, '#' + i + ': giá trị nhà hợp lệ');
        if (l.yr && l.yr.items) t.ok(l.yr.items.every(x => Number.isFinite(x.v)), '#' + i + ': các khoản thu chi trong năm hữu hạn');
      }
    });
    t.info('năm có việc làm: ' + withJob + ', năm có khoản vay: ' + withLoan);
    t.ok(withJob > 0, 'mẫu có người đi làm');
  } },
  { name: 'long-term-events', timeoutMs: 120000, run(t, G) {
    const E = G.E, H = E.H;
    let scheduled = 0, traps = 0, mems = 0;
    lives(E, 6).forEach((l, i) => {
      for (let y = 0; y < 70 && l.alive; y++) {
        const dueBefore = (l.sched || []).filter(s => s.at <= l.age + 1).length;
        year(E, l);
        // lịch hẹn đã đến hạn phải được xử lý (kích hoạt, hoặc dời lại vì đã đủ lựa chọn trong năm) — không treo vô hạn
        (l.sched || []).forEach(s => t.ok(Number.isFinite(s.at) && typeof s.id === 'string', '#' + i + ': lịch hẹn hợp lệ'));
        const stale = (l.sched || []).filter(s => s.at < l.age - 10);
        t.ok(!stale.length, '#' + i + ' tuổi ' + l.age + ': lịch hẹn quá hạn hơn 10 năm chưa xử lý: ' + stale.map(s => s.id + '@' + s.at).join(', '));
        scheduled += dueBefore;
        const T = l.flags.traps || {};
        Object.keys(T).forEach(k => { traps++; t.ok(l.age - T[k] <= 13, '#' + i + ': hậu quả trễ "' + k + '" quá 13 năm vẫn treo'); });
      }
      t.ok((l.mem || []).length <= 60, '#' + i + ': ký ức được giới hạn (' + (l.mem || []).length + ')');
      t.ok((l.mem || []).every(m => !badText(m.t) && Number.isFinite(m.a)), '#' + i + ': ký ức sạch');
      mems += (l.mem || []).length;
    });
    // hẹn trước một tình huống có thật rồi chắc chắn nó xuất hiện đúng năm
    const l = E.createLife({ mode: 'vn', seed: 31999 }); liveTo(E, l, 30);
    if (l.alive) {
      const id = Object.keys(E.DEC).find(k => { try { const d = E.DEC[k].make(clone(l), () => 0.5); return d.opts.length && (!E.DEC[k].valid || E.DEC[k].valid(l, d.data)) && /^(cn_|nk_|ban_than|que_)/.test(k); } catch (e) { return false; } });
      if (id) { l.sched = []; H.sched(l, id, 1); year(E, l); E.beginYear(l, { auto: true }); t.ok(l.pending.some(d => d.id === id) || !(E.DEC[id].valid ? E.DEC[id].valid(l, {}) : true), 'tình huống hẹn trước "' + id + '" xuất hiện đúng năm'); settle(E, l); }
      else t.info('không tìm được tình huống mẫu để hẹn trước ở tuổi 30');
    }
    t.info('lịch hẹn đến hạn: ' + scheduled + ', lượt hậu quả trễ đang treo: ' + traps + ', ký ức: ' + mems);
  } },
  { name: 'save-load', timeoutMs: 120000, run(t, G) {
    const E = G.E;
    let drift = 0;
    lives(E, 6).forEach((a, i) => {
      liveTo(E, a, 25 + i * 5);
      if (!a.alive) return;
      const raw = JSON.stringify({ life: a, cohort: [], speed: 1, auto: false, at: 0 }); // đúng cấu trúc app.js ghi vào localStorage
      const b = JSON.parse(raw).life, c = E.migrate(JSON.parse(raw).life);
      t.ok(JSON.stringify(clone(a)) === JSON.stringify(b), '#' + i + ': JSON giữ nguyên mọi trường (không có hàm / vòng tham chiếu)');
      ['name', 'age', 'sex', 'birthYear', 'money', 'mode', 'difficulty'].forEach(k => t.ok(JSON.stringify(c[k]) === JSON.stringify(a[k]), '#' + i + ': sau migrate giữ ' + k));
      t.ok(c.kids.length === a.kids.length && c.log.length === a.log.length, '#' + i + ': sau migrate giữ con cái & nhật ký');
      t.ok((c.partner && c.partner.name) === (a.partner && a.partner.name), '#' + i + ': sau migrate giữ bạn đời');
      // tiếp tục cùng seed: bản đã lưu/tải (không migrate) phải cho kết quả y hệt bản chơi liền mạch
      for (let y = 0; y < 15; y++) { if (a.alive) year(E, a); if (b.alive) year(E, b); if (c.alive) year(E, c); }
      t.ok(JSON.stringify(a.log) === JSON.stringify(b.log) && a.alive === b.alive, '#' + i + ': lưu/tải giữa chừng tiếp tục y hệt (tất định)');
      // đường của app.js có migrate: chỉ cảnh báo nếu kết quả rẽ khác (không mất dữ liệu nhưng tương lai bị đổi khi tải lại)
      if (JSON.stringify(a.log) !== JSON.stringify(c.log)) { drift++; t.warn('#' + i + ': sau E.migrate, 15 năm tiếp theo khác bản chơi liền mạch (migrate làm đổi trạng thái ngẫu nhiên hoặc dữ liệu)'); }
      t.ok(c.alive ? c.pending.length === 0 : true, '#' + i + ': bản đã tải chạy tiếp bình thường');
    });
    // lưu giữa năm khi đang có lựa chọn chờ
    const l = E.createLife({ mode: 'vn', seed: 31777 }); liveTo(E, l, 20);
    let tries = 0; while (l.alive && tries++ < 20) { E.beginYear(l, { auto: false }); if (l.pending.length) break; settle(E, l); E.finishYear(l); settle(E, l); E.endYear(l); }
    if (l.pending.length) {
      const c = E.migrate(JSON.parse(JSON.stringify({ life: l })).life);
      t.ok(c.pending.length === l.pending.length, 'lựa chọn đang chờ còn nguyên sau lưu/tải (' + c.pending.length + '/' + l.pending.length + ')');
      t.ok(c.pending.every(d => E.DEC[d.id] && d.opts.length), 'lựa chọn đang chờ vẫn có định nghĩa');
      E.resolve(c, c.pending[0].opts[0].k); settle(E, c); statsOk(t, c, 'giải quyết lựa chọn sau khi tải');
    }
    if (drift) t.info(drift + ' đời rẽ khác sau migrate (xem cảnh báo)');
  } },
  { name: 'dead-npcs', timeoutMs: 150000, run(t, G) {
    const E = G.E;
    let deaths = 0;
    SEEDS.concat([31011, 31012, 31013, 31014]).forEach((s, i) => {
      const l = E.createLife({ mode: i % 2 ? 'world' : 'vn', seed: s });
      const dead = new Map(), deadParents = {}, deadIds = new Set();
      for (let y = 0; y < 95 && l.alive; y++) {
        year(E, l);
        const f = l.fam || {};
        ['m', 'f'].forEach(k => { if (deadParents[k]) t.ok(!f[k + 'Alive'], '#' + i + ' tuổi ' + l.age + ': ' + (k === 'm' ? 'mẹ' : 'bố') + ' đã mất lại sống lại'); else if (f[k + 'Alive'] === false && !(k === 'f' && f.noDad)) deadParents[k] = l.age; });
        // anh chị em lưu tên ở `n`; `kids` của anh chị em / con là SỐ cháu, không phải mảng
        const people = [l.bff].concat(l.kids || [], l.sibList || [], l.friends || []).filter(Boolean);
        const nm = o => o.name || o.n || '(không tên)', nk = o => Array.isArray(o.kids) ? o.kids.length : Number(o.kids) || 0;
        people.forEach(o => {
          if (dead.has(o)) {
            const snap = dead.get(o);
            t.ok(o.alive === false, '#' + i + ' tuổi ' + l.age + ': ' + nm(o) + ' đã mất lại được đánh dấu còn sống');
            t.ok(JSON.stringify(o.job || null) === snap.job, '#' + i + ' tuổi ' + l.age + ': ' + nm(o) + ' đã mất nhưng vẫn đổi nghề');
            t.ok(nk(o) <= snap.kids, '#' + i + ' tuổi ' + l.age + ': ' + nm(o) + ' đã mất nhưng vẫn có thêm con (' + snap.kids + ' → ' + nk(o) + ')');
          } else if (o.alive === false) { dead.set(o, { job: JSON.stringify(o.job || null), kids: nk(o) }); deaths++; [o.uid110, o.parentId, o.family100 && o.family100.uid].filter(Boolean).forEach(x => deadIds.add(x)); }
        });
        // bạn đời đã mất không còn là bạn đời hiện tại
        if (l.partner) t.ok(l.partner.alive !== false, '#' + i + ': bạn đời hiện tại được đánh dấu đã mất');
        // không có lựa chọn nào đang chờ nhắm vào người đã mất (dò theo định danh, không dò theo tên)
        E.beginYear(clone(l), { auto: true }).forEach(d => { const s = JSON.stringify(d.data || {}); deadIds.forEach(x => t.ok(s.indexOf('"' + x + '"') < 0, '#' + i + ' tuổi ' + l.age + ': lựa chọn "' + d.id + '" nhắm vào người đã mất (' + x + ')')); });
      }
      deaths += Object.keys(deadParents).length;
    });
    t.info(deaths + ' lượt người thân / bạn bè qua đời được theo dõi');
    t.ok(deaths > 0, 'mẫu có người thân qua đời để kiểm tra');
  } },
  { name: 'references', timeoutMs: 120000, run(t, G) {
    const E = G.E;
    lives(E, 6).forEach((l, i) => {
      for (let y = 0; y < 70 && l.alive; y++) {
        year(E, l);
        const kidIds = new Set((l.kids || []).map(k => k.parentId).filter(Boolean));
        // tiểu sử con (life141) chỉ gắn với người con có trong danh sách
        (l.kids || []).forEach(k => { if (k.persona141) t.ok(Number.isFinite(k.persona141.born) ? k.persona141.born === k.born : true, '#' + i + ': tiểu sử con khớp năm sinh ' + k.name); });
        // vụ việc gia đình (life113) phải trỏ tới người còn trong gia đình, hoặc đã đóng
        const cases = l.flags.expansion110 && l.flags.expansion110.cases || [];
        cases.filter(c => !c.closed).forEach(c => {
          const [kind, ...rest] = String(c.person).split(':');
          if (kind === 'child') t.ok((l.kids || []).some(k => k.uid110 === rest.join(':')), '#' + i + ': vụ việc mở trỏ tới người con không còn trong hồ sơ (' + c.person + ')');
        });
        // định danh con không trùng
        t.ok(kidIds.size === (l.kids || []).filter(k => k.parentId).length, '#' + i + ': định danh con (parentId) bị trùng');
        // mọi lựa chọn được hẹn trước đều có định nghĩa
        (l.sched || []).forEach(s => t.ok(!!E.DEC[s.id], '#' + i + ': lịch hẹn trỏ tới tình huống không tồn tại "' + s.id + '"'));
        if (l.partner && l.partner.family100) t.ok(typeof l.partner.family100.uid === 'string', '#' + i + ': hồ sơ quan hệ bạn đời có định danh');
      }
    });
  } }
];

run('Smoke test Một Đời', cases, { timeoutMs: 90000, footer: 'Lưu ý: đây là smoke test. Bộ hồi quy đầy đủ là tests/regression.js (rất lâu; có thể chạy theo nhóm bằng tests/regression-shard.js).' });
