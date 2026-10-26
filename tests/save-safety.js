/* GĐ1 — an toàn dữ liệu & tương thích bản lưu.
   Kiểm tra cơ chế phiên bản cấu trúc (l.sv / E.checkSave / E.migrate) và lớp lưu trữ G.SaveStore (public/js/save-store.js)
   bằng một localStorage giả lập trong bộ nhớ (có hạn mức, bị chặn, hoặc nhận lệnh mà không lưu).
   Không bài nào sửa hay xóa dữ liệu để đạt: mọi so sánh đều với bản gốc trước khi thao tác.
   Chạy: node tests/save-safety.js [tên ca …] */
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const { run, year, settle, clone, ROOT } = require('./lib/quick');
const KEY = 'mkn.current';
const FIX = path.join(ROOT, 'tests', 'fixtures', 'saves');
const packs = () => fs.readdirSync(FIX).filter(f => f.endsWith('.json.gz')).map(f => JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(FIX, f)))));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// localStorage giả lập: hạn mức tính theo tổng số ký tự khóa + giá trị (giống cách đa số trình duyệt đếm)
function storage(opt) {
  opt = opt || {};
  const m = new Map();
  const used = () => { let n = 0; m.forEach((v, k) => { n += k.length + v.length; }); return n; };
  const err = (name, code) => { const e = new Error(name); e.name = name; e.code = code; return e; };
  return {
    map: m, quota: opt.quota || 5000000, mode: opt.mode || 'ok',
    get length() { return m.size; }, key(i) { return [...m.keys()][i] || null; },
    getItem(k) { if (this.mode === 'blocked') throw err('SecurityError', 18); return m.has(k) ? m.get(k) : null; },
    setItem(k, v) {
      if (this.mode === 'blocked') throw err('SecurityError', 18);
      if (this.mode === 'silent') return;
      v = String(v); const after = used() - (m.has(k) ? k.length + m.get(k).length : 0) + k.length + v.length;
      if (this.mode === 'full' || after > this.quota) throw err('QuotaExceededError', 22);
      m.set(k, v);
    },
    removeItem(k) { if (this.mode === 'blocked') throw err('SecurityError', 18); m.delete(k); }
  };
}
function freshLife(G, seed, mode, years) { G.testClock.reset(); const E = G.E, l = E.createLife({ mode: mode || 'vn', seed }); for (let y = 0; y < (years || 30) && l.alive; y++) year(E, l); return l; }
const wrap = l => ({ life: l, cohort: [], speed: 1, auto: false, at: 1 });

// lưu → tải lại một đời có nhiều quan hệ, so từng phần với bản gốc
function roundTrip(t, G, sample, who) {
  const E = G.E, S = G.SaveStore;
  const raw = JSON.stringify(wrap(sample)), st = storage();
  t.ok(S.write(KEY, JSON.parse(raw), null, st).ok, who + ': lưu được');
  const r = S.inspect(KEY, E, null, st), l = r.life, b = JSON.parse(raw).life;
  t.ok(r.status === 'ok', who + ': tải lại được');
  const ppl = x => (x.flags.life138 || {}).people || {};
  t.ok(same(ppl(l), ppl(b)), who + ': giữ nguyên toàn bộ hồ sơ người quen (' + Object.keys(ppl(b)).length + ' người)');
  t.ok(same(l.kids, b.kids), who + ': giữ nguyên con cái, tính cách, ký ức của con (' + b.kids.length + ')');
  t.ok(same(l.partner, b.partner) && same(l.bff, b.bff), who + ': giữ nguyên bạn đời / bạn thân và hồ sơ quan hệ');
  t.ok(same(l.friends, b.friends) && same(l.sibList, b.sibList), who + ': giữ nguyên bạn bè, anh chị em (' + (b.friends || []).length + ' / ' + (b.sibList || []).length + ')');
  t.ok(same(l.fam, b.fam), who + ': giữ nguyên gia đình gốc, tính cách bố mẹ');
  t.ok(same(l.flags.family100, b.flags.family100) && same(l.flags.family130, b.flags.family130), who + ': giữ nguyên tin cậy / căng thẳng (family100), ranh giới (family130)');
  t.ok(same(l.job, b.job) && same(l.lastJob, b.lastJob) && same(l.flags.career109, b.flags.career109), who + ': giữ nguyên nghề và lịch sử công tác');
  t.ok(l.money === b.money && same(l.loans, b.loans) && same(l.assets, b.assets) && same(l.props, b.props) && same(l.ventures, b.ventures), who + ': giữ nguyên tiền, nợ, tài sản');
  t.ok(same(l.log, b.log) && same(l.mem, b.mem), who + ': giữ nguyên nhật ký và ký ức');
  t.ok(same(l.pending, b.pending) && same(l.sched, b.sched) && l.rs === b.rs, who + ': giữ nguyên lựa chọn đang chờ, lịch hẹn và trạng thái ngẫu nhiên');
  t.info(who + ': ' + Object.keys(ppl(b)).length + ' người quen, ' + b.kids.length + ' con, ' + (b.friends || []).length + ' bạn, ' + Math.round(raw.length / 1024) + ' KB');
}

const cases = [
  { name: '1-no-schema-version', run(t, G) {
    const E = G.E, S = G.SaveStore;
    t.ok(E.SAVE_SCHEMA === 1, 'engine khai báo phiên bản cấu trúc hiện tại = 1');
    t.ok(freshLife(G, 41001, 'vn', 0).sv === E.SAVE_SCHEMA, 'cuộc đời mới tạo mang sv hiện tại');
    let n = 0;
    packs().forEach(p => p.saves.forEach(item => {
      const tag = 'v' + p.version + ' ' + item.scenario, raw = JSON.stringify(item.save);
      if (item.save.life.sv != null) return;
      n++;
      t.ok(E.saveSchema(item.save.life) === 0 && E.checkSave(item.save.life).ok, tag + ': bản lưu không có sv được nhận là cấu trúc 0, hợp lệ');
      const st = storage(); st.setItem(KEY, raw);
      const r = S.inspect(KEY, E, null, st);
      t.ok(r.status === 'ok' && r.life.sv === E.SAVE_SCHEMA, tag + ': nạp được và nâng lên sv ' + E.SAVE_SCHEMA + ' (' + r.status + ')');
      t.ok(st.getItem(KEY) === raw, tag + ': việc kiểm tra / nâng cấp không ghi đè bản lưu gốc trong bộ nhớ');
      t.ok(r.life.name === item.save.life.name && r.life.age === item.save.life.age && r.life.log.length >= item.save.life.log.length, tag + ': giữ tên, tuổi, nhật ký');
      t.ok(!st.getItem(KEY + '.held'), tag + ': bản lưu tốt không bị chép sang khóa phụ');
    }));
    t.info(n + ' bản lưu cũ không có sv đã được nạp');
    t.ok(n >= 50, 'đủ mẫu bản lưu cũ (' + n + ')');
  } },
  { name: '2-migrate-idempotent', timeoutMs: 120000, run(t, G) {
    const E = G.E;
    const lives = [];
    packs().forEach(p => p.saves.forEach(item => lives.push(['v' + p.version + ' ' + item.scenario, item.save.life])));
    [41011, 41012, 41013].forEach((s, i) => lives.push(['đời mới #' + i, freshLife(G, s, i % 2 ? 'world' : 'vn', 40)]));
    lives.forEach(([tag, l0]) => {
      const once = E.migrate(clone(l0)), twice = E.migrate(clone(once)), thrice = E.migrate(clone(twice));
      t.ok(same(once, twice) && same(twice, thrice), tag + ': migrate nhiều lần cho kết quả như một lần');
      const inPlace = clone(once); E.migrate(inPlace);
      t.ok(same(inPlace, once), tag + ': migrate lại trên chính đối tượng đã nâng cấp không đổi gì');
      // không xóa trường chưa nhận diện
      const extra = clone(l0); extra.futureField = { keep: [1, 2, 3] }; extra.flags = extra.flags || {}; extra.flags.unknownModule = { a: 1 };
      const m = E.migrate(extra);
      t.ok(same(m.futureField, { keep: [1, 2, 3] }) && same(m.flags.unknownModule, { a: 1 }), tag + ': giữ trường chưa nhận diện');
    });
    t.info(lives.length + ' cuộc đời được migrate 3 lần');
  } },
  { name: '3-corrupt-json', run(t, G) {
    const E = G.E, S = G.SaveStore;
    const good = JSON.stringify(wrap(freshLife(G, 41021, 'vn', 20)));
    const bad = good.slice(0, Math.floor(good.length * 0.6)); // bị cắt giữa chừng (tắt máy lúc đang ghi…)
    const st = storage(); st.setItem(KEY, bad);
    const r = S.inspect(KEY, E, null, st);
    t.ok(r.status === 'corrupt', 'JSON hỏng được nhận diện (' + r.status + ')');
    t.ok(st.getItem(KEY) === bad, 'bản hỏng vẫn còn nguyên ở khóa chính');
    const held = S.held(KEY, st);
    t.ok(held.length === 1 && held[0].raw === bad, 'bản hỏng được cất sang khóa phụ để còn tải về');
    S.inspect(KEY, E, null, st); S.read(KEY, st);
    t.ok(S.held(KEY, st).length === 1, 'đọc lại nhiều lần không chép thêm bản trùng');
    t.ok(S.errors(st).some(e => e.code === 'CORRUPT'), 'lỗi đọc được ghi nhận');
    // ghi đời mới sau đó: bản hỏng vẫn còn ở khóa phụ
    t.ok(S.write(KEY, wrap(freshLife(G, 41022, 'vn', 3)), null, st).ok, 'vẫn ghi được đời mới');
    t.ok(S.held(KEY, st)[0].raw === bad, 'bản hỏng không mất khi ghi đời mới');
    // khóa phụ có giới hạn, không phình vô hạn
    S.hold(KEY, bad + 'x', 't', st); S.hold(KEY, bad + 'y', 't', st); S.hold(KEY, bad + 'z', 't', st);
    t.ok(S.held(KEY, st).length === 2, 'khóa phụ giữ tối đa 2 bản');
    // cấu trúc thiếu dữ liệu cơ bản
    [['không có life', JSON.stringify({ cohort: [] })], ['life thiếu tên', JSON.stringify(wrap({ alive: true, age: 3, birthYear: 2026 }))], ['mảng', '[1,2]'], ['chuỗi rỗng JSON', '""']].forEach(([why, raw]) => {
      const s2 = storage(); s2.setItem(KEY, raw);
      const x = S.inspect(KEY, E, null, s2);
      t.ok(x.status === 'invalid' || x.status === 'empty', why + ': báo không hợp lệ, không cố nạp (' + x.status + ')');
      t.ok(s2.getItem(KEY) === raw, why + ': không ghi đè');
    });
    // LS.get kiểu cũ trả mặc định nhưng không mất dữ liệu
    const s3 = storage(); s3.setItem('mkn.memorial', '[{"id":1,'); const rd = S.read('mkn.memorial', s3);
    t.ok(rd.status === 'corrupt' && S.held('mkn.memorial', s3).length === 1, 'đài tưởng niệm hỏng cũng được cất trước khi có thể bị ghi đè');
  } },
  { name: '4-storage-full', run(t, G) {
    const S = G.SaveStore;
    const life = freshLife(G, 41031, 'vn', 25), data = wrap(life), size = JSON.stringify(data).length;
    // đầy bộ nhớ
    const st = storage({ quota: size + 200 }); st.setItem('other', 'x'.repeat(500));
    let r = S.write(KEY, data, null, st);
    t.ok(!r.ok && r.code === 'QUOTA', 'đầy bộ nhớ → mã QUOTA (' + r.code + ')');
    t.ok(st.getItem(KEY) === null && st.getItem('other').length === 500, 'không xóa dữ liệu khác để lấy chỗ');
    t.ok(S.message('QUOTA').includes('CHƯA'), 'thông báo nói rõ là CHƯA lưu');
    // bị chặn (ẩn danh / quyền riêng tư)
    r = S.write(KEY, data, null, storage({ mode: 'blocked' }));
    t.ok(!r.ok && r.code === 'BLOCKED', 'bị chặn → mã BLOCKED (' + r.code + ')');
    t.ok(S.inspect(KEY, G.E, null, storage({ mode: 'blocked' })).status === 'blocked', 'đọc khi bị chặn → trạng thái blocked');
    // nhận lệnh mà không lưu
    r = S.write(KEY, data, null, storage({ mode: 'silent' }));
    t.ok(!r.ok && r.code === 'VERIFY', 'trình duyệt "nuốt" dữ liệu → phát hiện bằng đọc lại (' + r.code + ')');
    // không đóng gói được
    const cyc = { life: { name: 'x' } }; cyc.life.self = cyc;
    r = S.write(KEY, cyc, null, storage()); t.ok(!r.ok && r.code === 'SERIALIZE', 'vòng tham chiếu → SERIALIZE');
    r = S.write(KEY, { n: BigInt(1) }, null, storage()); t.ok(!r.ok && r.code === 'SERIALIZE', 'BigInt → SERIALIZE');
    r = S.write(KEY, undefined, null, storage()); t.ok(!r.ok && r.code === 'SERIALIZE', 'không có dữ liệu → SERIALIZE');
    // bản quá lớn: không cố ghi
    const s4 = storage(); r = S.write(KEY, data, { max: 1000 }, s4);
    t.ok(!r.ok && r.code === 'TOO_LARGE' && s4.getItem(KEY) === null, 'vượt ngưỡng → TOO_LARGE, không ghi');
    t.ok(S.errors(s4).some(e => e.code === 'TOO_LARGE'), 'lỗi được ghi nhận để kiểm tra');
    const log = JSON.parse(s4.getItem('mkn.saveErrors')); t.ok(Array.isArray(log) && log.length <= 10 && JSON.stringify(log).length < 3000, 'nhật ký lỗi trong bộ nhớ nhỏ, có giới hạn');
  } },
  { name: '5-failed-save-keeps-old', run(t, G) {
    const E = G.E, S = G.SaveStore;
    const l = freshLife(G, 41041, 'vn', 30), st = storage();
    t.ok(S.write(KEY, wrap(l), null, st).ok, 'lần lưu đầu thành công');
    const before = st.getItem(KEY), age0 = l.age;
    for (let y = 0; y < 5 && l.alive; y++) year(E, l);
    st.mode = 'full';
    const r = S.write(KEY, wrap(l), null, st);
    t.ok(!r.ok, 'lần lưu sau thất bại vì đầy bộ nhớ');
    t.ok(st.getItem(KEY) === before, 'bản lưu trước vẫn y nguyên');
    st.mode = 'ok';
    const back = S.inspect(KEY, E, null, st);
    t.ok(back.status === 'ok' && back.life.age === age0, 'tải lại được bản lưu cũ (tuổi ' + age0 + ')');
    t.ok(S.write(KEY, wrap(l), null, st).ok && JSON.parse(st.getItem(KEY)).life.age === l.age, 'khi còn chỗ, thử lưu lại thành công');
    // cất bản không mở được thất bại (đầy) → báo false để giao diện không ghi đè
    const s2 = storage(); s2.setItem(KEY, '{"bad":'); s2.mode = 'full';
    t.ok(S.hold(KEY, '{"bad":', 'corrupt', s2) === false && s2.getItem(KEY) === '{"bad":', 'không cất được bản hỏng → trả false, bản hỏng vẫn còn');
    // kết thúc đời: đài tưởng niệm lưu thất bại thì không được bỏ bản đang chơi
    const dead = freshLife(G, 41042, 'vn', 130); if (dead.alive) { dead.alive = false; dead.death = { age: dead.age, cause: 'kiểm thử' }; }
    const s3 = storage(); s3.setItem(KEY, JSON.stringify(wrap(dead))); s3.mode = 'full';
    const store = { get: (k, d) => { const x = S.read(k, s3); return x.status === 'ok' ? x.value : d; }, set: (k, v) => S.write(k, v, null, s3).ok };
    const ok = G.MemorialHistory.save(dead, [], [], store, { where: 'x', years: 'y', summary: 'z' });
    t.ok(ok === false && s3.getItem(KEY) !== null, 'đài tưởng niệm lưu thất bại → báo false, bản đang chơi còn nguyên (app chỉ xóa khi lưu thành công)');
  } },
  { name: '6-future-schema', run(t, G) {
    const E = G.E, S = G.SaveStore;
    const l = freshLife(G, 41051, 'world', 20); l.sv = E.SAVE_SCHEMA + 1; l.flags.fromTheFuture = { x: 1 };
    const before = JSON.stringify(l);
    const chk = E.checkSave(l);
    t.ok(!chk.ok && chk.code === 'FUTURE_SCHEMA' && chk.sv === E.SAVE_SCHEMA + 1, 'nhận diện cấu trúc mới hơn mức hỗ trợ');
    let code = null; try { E.migrate(l); } catch (e) { code = e.code; }
    t.ok(code === 'FUTURE_SCHEMA', 'E.migrate từ chối (không ép về cấu trúc cũ) — ' + code);
    t.ok(JSON.stringify(l) === before, 'đối tượng không bị sửa chút nào');
    const st = storage(), raw = JSON.stringify(wrap(l)); st.setItem(KEY, raw);
    const r = S.inspect(KEY, E, null, st);
    t.ok(r.status === 'future' && r.sv === E.SAVE_SCHEMA + 1 && r.max === E.SAVE_SCHEMA, 'trạng thái future, kèm phiên bản để báo người chơi');
    t.ok(st.getItem(KEY) === raw, 'bản lưu tương lai giữ nguyên trong bộ nhớ');
    [['chuỗi', 'x'], ['âm', -1], ['thập phân', 1.5]].forEach(([why, v]) => { const b = clone(l); b.sv = v; t.ok(E.checkSave(b).code === 'BAD_SCHEMA', 'sv ' + why + ' → BAD_SCHEMA'); let c = null; try { E.migrate(b); } catch (e) { c = e.code; } t.ok(c === 'BAD_SCHEMA', 'migrate từ chối sv ' + why); });
  } },
  { name: '7-hundred-year-life', timeoutMs: 120000, run(t, G) {
    const E = G.E, S = G.SaveStore;
    [[100047, 'vn'], [100062, 'world']].forEach(([seed, mode]) => {
      G.testClock.reset();
      const l = E.createLife({ mode, seed }); let snap100 = null, g = 0;
      while (l.alive && g++ < 130) { year(E, l); if (l.age === 100 && l.alive) snap100 = JSON.stringify(wrap(l)); }
      const age = l.death ? l.death.age : l.age, tag = 'seed ' + seed + ' (' + mode + ')';
      t.ok(age >= 100, tag + ': sống tới ' + age + ' tuổi');
      t.ok(!!snap100, tag + ': có bản lưu ở tuổi 100');
      if (!snap100) return;
      const st = storage(), r = S.write(KEY, JSON.parse(snap100), null, st);
      t.ok(r.ok, tag + ': lưu được bản 100 tuổi (' + Math.round(snap100.length / 1024) + ' KB)');
      t.ok(snap100.length < S.WARN_CHARS, tag + ': dưới ngưỡng cảnh báo ' + Math.round(S.WARN_CHARS / 1024) + ' KB');
      const back = S.inspect(KEY, E, null, st);
      t.ok(back.status === 'ok' && back.life.age === 100, tag + ': tải lại bản 100 tuổi');
      t.ok(same(E.migrate(clone(back.life)), back.life), tag + ': migrate ổn định ở tuổi 100');
      const c = back.life; for (let y = 0; y < 10 && c.alive; y++) year(E, c);
      t.ok(c.alive ? c.age > 100 : !!c.death, tag + ': chơi tiếp sau khi tải ở tuổi 100');
      t.info(tag + ': ' + Math.round(snap100.length / 1024) + ' KB ở tuổi 100 · ' + Object.keys((c.flags.life138 || {}).people || {}).length + ' người quen · ' + c.log.length + ' dòng nhật ký');
    });
  } },
  { name: '8-many-npcs', timeoutMs: 120000, run(t, G) {
    const E = G.E, S = G.SaveStore;
    // chọn đời có nhiều người quen / con / bạn bè nhất trong một nhóm mẫu
    let best = null, score = -1;
    for (let i = 0; i < 24; i++) { const l = freshLife(G, 41100 + i, i % 2 ? 'world' : 'vn', 65); if (!l.alive) continue; const s = Object.keys((l.flags.life138 || {}).people || {}).length + 5 * (l.kids || []).length + 3 * (l.friends || []).length + (l.partner ? 5 : 0); if (s > score) { score = s; best = l; } }
    t.ok(!!best, 'tìm được đời nhiều quan hệ');
    if (!best) return;
    // thêm bản lưu cũ có nhiều con nhất trong fixture GĐ0
    let many = null; packs().forEach(p => p.saves.forEach(it => { if (!many || it.save.life.kids.length > many.kids.length) many = E.migrate(clone(it.save.life)); }));
    roundTrip(t, G, best, 'đời mới nhiều người quen'); roundTrip(t, G, many, 'bản lưu cũ nhiều con nhất');
  } },
  { name: '9-cloud-limit', run(t, G) {
    const S = G.SaveStore, L = S.CLOUD;
    const small = { v: 1, ach: {}, tree: [], mem: [], recent: [], cur: { life: { name: 'A' } } };
    let p = S.cloudPack(small); t.ok(p.ok && !p.droppedCur && p.data === small, 'dữ liệu nhỏ gửi nguyên vẹn');
    // cuộc đời đang chơi quá lớn → bỏ phần đó, vẫn gửi phần còn lại
    const bigCur = { v: 1, ach: { a: 1 }, tree: [], mem: [], recent: [], cur: { life: { name: 'A', log: 'x'.repeat(L.chars) } } };
    p = S.cloudPack(bigCur); t.ok(p.ok && p.droppedCur && p.data.cur === null && p.data.ach.a === 1 && bigCur.cur !== null, 'quá lớn → bỏ cuộc đời đang chơi khỏi gói gửi, không sửa dữ liệu gốc');
    // vẫn quá lớn sau khi bỏ → không gửi, báo lỗi
    const tooBig = { v: 1, ach: {}, tree: [], mem: ['x'.repeat(L.chars + 10)], recent: [], cur: null };
    p = S.cloudPack(tooBig); t.ok(!p.ok && p.code === 'SAVE_TOO_LARGE', 'vẫn quá lớn → SAVE_TOO_LARGE, không gửi');
    // tiếng Việt có dấu: số ký tự dưới giới hạn nhưng số byte UTF-8 vượt giới hạn máy chủ (trước đây chỉ đếm ký tự)
    const viet = 'Ước mơ được đặt chân đến Hà Nội. ';
    const vn = { v: 1, ach: {}, tree: [], mem: [viet.repeat(Math.floor(L.chars * 0.9 / viet.length))], recent: [], cur: null };
    const t1 = JSON.stringify(vn);
    t.ok(t1.length < L.chars && S.bytes(t1) > L.bytes, 'mẫu tiếng Việt: ' + Math.round(t1.length / 1000) + 'k ký tự nhưng ' + Math.round(S.bytes(t1) / 1000) + 'k byte');
    p = S.cloudPack(vn); t.ok(!p.ok && p.code === 'SAVE_TOO_LARGE', 'phát hiện vượt giới hạn byte trước khi gửi');
    t.ok(S.bytes('aĐườ😀') === Buffer.byteLength('aĐườ😀'), 'đếm byte UTF-8 chính xác (kể cả ký tự 4 byte)');
    // dữ liệu thật: đời 100 tuổi đang chơi + 60 đời ở đài tưởng niệm + gia phả 400 đời
    const E = G.E; G.testClock.reset(); const l = E.createLife({ mode: 'vn', seed: 100047 }); let g = 0; while (l.alive && g++ < 100) year(E, l);
    const dead = freshLife(G, 41201, 'vn', 130), store = { m: {}, get(k, d) { return k in this.m ? JSON.parse(this.m[k]) : d; }, set(k, v) { this.m[k] = JSON.stringify(v); return true; } };
    if (!dead.alive) G.MemorialHistory.save(dead, [{ age: 1, t: 'x' }], [], store, { where: 'Hà Nội', years: '2026–2100', summary: E.obituary(dead) });
    const rec = (store.get('mkn.memorial', [])[0]) || { id: 'x' };
    const mem = Array.from({ length: 60 }, (_, i) => Object.assign({}, rec, { id: 'm' + i }));
    const tree = Array.from({ length: 400 }, (_, i) => ({ id: 't' + i, n: 'Nguyễn Văn Thành ' + i, pid: i ? 't' + (i - 1) : null, at: i, b: 2026, d: 2100, q: 3 }));
    const real = { v: 1, ach: {}, tree, mem, recent: [], cur: wrap(l) };
    p = S.cloudPack(real);
    t.ok(p.ok && !p.droppedCur, 'tài khoản đầy đủ (đời đang chơi ' + l.age + ' tuổi + 60 đời tưởng niệm + 400 gia phả) gửi được nguyên vẹn: ' + Math.round(p.bytes / 1024) + ' KB');
    t.info('dung lượng gói tài khoản thực tế: ' + Math.round(p.chars / 1024) + ' K ký tự / ' + Math.round(p.bytes / 1024) + ' KB, giới hạn ' + Math.round(L.bytes / 1024) + ' KB');
  } },
  { name: '10-reload-continue', timeoutMs: 150000, run(t, G) {
    const E = G.E, S = G.SaveStore;
    // bản lưu cũ: lưu → tải (migrate) → chơi 20 năm → lưu → tải lại → khớp từng byte, chơi tiếp được
    let n = 0;
    packs().forEach(p => p.saves.forEach(item => {
      const tag = 'v' + p.version + ' ' + item.scenario, st = storage();
      st.setItem(KEY, JSON.stringify(item.save));
      let r = S.inspect(KEY, E, null, st); if (!t.ok(r.status === 'ok', tag + ': nạp được')) return;
      const l = r.life, kids0 = l.kids.length, log0 = l.log.length;
      settle(E, l); for (let y = 0; y < 20 && l.alive; y++) year(E, l);
      if (!l.alive) { t.ok(!!l.death, tag + ': qua đời có ghi nhận'); return; }
      t.ok(S.write(KEY, wrap(l), null, st).ok, tag + ': lưu lại sau 20 năm');
      r = S.inspect(KEY, E, null, st);
      t.ok(r.status === 'ok' && same(r.life, l), tag + ': tải lại khớp hoàn toàn với bản trong bộ nhớ');
      t.ok(r.life.kids.length >= kids0 && r.life.log.length > log0, tag + ': không mất con, nhật ký tiếp tục');
      for (let y = 0; y < 5 && r.life.alive; y++) year(E, r.life);
      n++;
    }));
    t.info(n + ' bản lưu cũ chơi thêm 25 năm qua hai lần lưu / tải');
    // đời mới: lưu / tải (có migrate) giữa chừng cho đúng kết quả như chơi liền mạch
    [41301, 41302, 41303, 41304].forEach((s, i) => {
      const a = freshLife(G, s, i % 2 ? 'world' : 'vn', 30); if (!a.alive) return;
      const st = storage(); S.write(KEY, wrap(a), null, st);
      const b = S.inspect(KEY, E, null, st).life;
      for (let y = 0; y < 25; y++) { if (a.alive) year(E, a); if (b.alive) year(E, b); }
      t.ok(same(a.log, b.log) && a.alive === b.alive, 'đời #' + i + ': lưu / tải giữa chừng (qua migrate) cho cùng diễn biến như chơi liền mạch');
    });
  } }
];

run('GĐ1 — an toàn dữ liệu & tương thích bản lưu', cases, { timeoutMs: 90000 });
