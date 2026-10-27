/* GĐ5 — nhịp sự kiện, chống lặp và các tình huống bị chặn ngoài ý muốn. Chạy: node tests/pace-gd5.js */
'use strict';
const assert = require('assert'), fs = require('fs'), path = require('path'), zlib = require('zlib');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, H = E.H, P = E.PACE145, X = E.UPDATE110;
let checks = 0;
const ok = (c, m) => { assert(c, m); checks++; };
const clone = o => JSON.parse(JSON.stringify(o));
function grow(seed, pred) {
  let snap = null; const l = E.createLife({ mode: 'vn', seed, year: 1985 });
  E.runHeadless(l, x => { if (!snap && x.alive && pred(x)) snap = clone(x); });
  if (snap) { snap.pending = []; snap.sched = []; snap.jailUntil = null; snap.abroad = null; delete snap.flags.military; delete snap.flags.pace145; }
  return snap;
}
const married = l => l.partner && l.partner.alive !== false && l.partner.status !== 'dating' && l.partner.age >= 18 && l.age >= 25 && l.age <= 50 && l.indep;
let M = null; for (let s = 600; s < 660 && !M; s++) M = grow(s, married);
ok(M, 'có nhân vật đã kết hôn');

// ---------- 1. Các cảnh hôn nhân / gia đình bị chặn ngoài ý muốn ----------
const scenes = ['marriageGift130', 'marriageTime130', 'marriageBuy130', 'marriageJealous130', 'marriageMoney130'];
for (const id of scenes) {
  const T = E.TRIG.find(t => t.id === id), D = E.DEC[id];
  ok(T.when(M, M.age), id + ': điều kiện trigger đúng khi đã kết hôn');
  ok(D.valid(M, {}), id + ': engine (truyền {}) không còn chặn khi đủ điều kiện — nguyên nhân gốc');
  const d = D.make(M, H.rf(M));
  ok(d.data.who === X.uid(M, M.partner) && D.valid(M, d.data), id + ': dữ liệu chụp đúng bạn đời');
  ok(!D.valid(M, Object.assign({}, d.data, { at: M.age - 1 })), id + ': dữ liệu cũ của năm trước vẫn bị loại');
  ok(!D.valid(M, Object.assign({}, d.data, { who: 'người-khác' })), id + ': dữ liệu của người khác vẫn bị loại');
  ok(!D.valid(M, Object.assign({}, d.data, { done: true })), id + ': cảnh đã chọn không chạy lại');
  const dating = clone(M); dating.partner.status = 'dating';
  ok(!T.when(dating, dating.age) && !D.valid(dating, {}), id + ': đang hẹn hò thì không xuất hiện');
  const widow = clone(M); widow.partner.alive = false;
  ok(!D.valid(widow, {}), id + ': bạn đời đã mất thì không xuất hiện');
  const young = clone(M); young.age = 17;
  ok(!D.valid(young, {}), id + ': dưới 18 tuổi thì không xuất hiện');
}
{
  const D = E.DEC.familyObjection130, U2 = clone(M); U2.partner.status = 'dating'; U2.fam.mAlive = true; const d = D.make(U2, H.rf(U2));
  ok(D.valid(U2, {}) && D.valid(U2, d.data) && !D.valid(U2, Object.assign({}, d.data, { done: true })), 'familyObjection130: hợp lệ với cặp chưa cưới, chặn khi đã chọn');
  ok(!D.valid(M, {}), 'familyObjection130: GĐ6 — không phản đối cưới khi đã kết hôn');
  const single = clone(M); single.partner = null; ok(!D.valid(single, {}), 'familyObjection130: không có người yêu thì không xuất hiện');
}
let S = null; for (let s = 700; s < 760 && !S; s++) S = grow(s, x => !x.partner && x.age >= 20 && x.age <= 35 && x.indep);
ok(S, 'có nhân vật độc thân');
for (const id of ['map_mo101', 'casual101']) {
  const D = E.DEC[id], d = D.make(S, H.rf(S));
  ok(D.valid(S, {}) && D.valid(S, d.data), id + ': độc thân trưởng thành thì có thể xuất hiện');
  ok(!D.valid(S, Object.assign({}, d.data, { at: S.age - 1 })), id + ': dữ liệu năm trước bị loại');
  ok(!D.valid(M, {}), id + ': đã kết hôn thì không xuất hiện');
}
// Cố ý có điều kiện riêng, không phải lỗi: cắt giảm vì AI chỉ khi có rủi ro mất việc
ok(E.DEC.vp_sa_thai_ai && typeof E.layoffRisk === 'function', 'vp_sa_thai_ai: điều kiện rủi ro mất việc (life70) được giữ nguyên');

// ---------- 2. Xuất hiện thật trong mô phỏng, thủ công và tự động, không quá dày ----------
{
  let manual = 0, auto = 0, gapBad = 0, sameYear = 0;
  for (const mode of [{ auto: false }, { auto: true }]) {
    for (let i = 0; i < 12; i++) {
      const l = clone(M); l.rs = (l.rs + i * 7919) | 0; l.id = M.id + ':' + i + (mode.auto ? 'a' : 'm');
      const seen = [];
      for (let y = 0; y < 12 && l.alive; y++) {
        E.beginYear(l, mode);
        const n = l.pending.filter(d => /^marriage\w+130$/.test(d.id)).length;
        if (n > 1) sameYear++;
        if (n) seen.push(l.age);
        let g = 0; while (l.pending.length && l.alive && g++ < 64) E.resolve(l, E.autoKey(l));
        if (l.alive) E.finishYear(l); g = 0; while (l.pending.length && l.alive && g++ < 64) E.resolve(l, E.autoKey(l)); E.endYear(l);
      }
      for (let k = 1; k < seen.length; k++) if (seen[k] - seen[k - 1] < 3) gapBad++;
      if (mode.auto) auto += seen.length; else manual += seen.length;
    }
  }
  ok(manual > 0 && auto > 0, 'life130: cảnh hôn nhân xuất hiện ở cả chế độ thủ công (' + manual + ') và tự động (' + auto + ')');
  ok(gapBad === 0 && sameYear === 0, 'life130: các cảnh hôn nhân cách nhau ≥ 3 năm, tối đa một cảnh mỗi năm');
  ok((manual + auto) / 24 / 12 < 0.45, 'life130: không quá dày (' + ((manual + auto) / 288).toFixed(2) + ' cảnh/năm hôn nhân)');
}

// ---------- 3. Điều tiết mật độ: admit() ----------
{
  const l = clone(M), shock = { id: 'test_shock', title: 'Tai nạn trên đường đi làm', text: 'Một vụ tai nạn.', opts: [] }, daily = { id: 'test_daily', title: 'Bữa cơm cuối tuần', text: 'Cả nhà quây quần.', opts: [] };
  ok(P.tier(shock) === 'shock' && P.tier(daily) === 'daily' && P.tier({ id: 'job', title: 'Tìm việc', text: '' }) === 'major', 'mức: biến cố / đời thường / quyết định quan trọng');
  ok(P.admit(l, daily, [shock, shock], {}), 'đời thường vẫn được nhận khi năm đã có biến cố');
  ok(!P.admit(l, shock, [shock, Object.assign({}, shock, { id: 'x2' })], {}), 'không thêm biến cố thứ ba trong một năm');
  let pass = 0; for (let i = 0; i < 200; i++) { const x = clone(l); x.id = 'p' + i; if (P.admit(x, shock, [Object.assign({}, shock, { id: 'x1' })], {})) pass++; }
  ok(pass > 30 && pass < 120, 'biến cố thứ hai trong năm: giảm chứ không cấm (' + pass + '/200)');
  ok(P.admit(l, shock, [], {}), 'năm yên ả: biến cố vẫn có thể xảy ra');
  ok(!P.admit(l, daily, [daily, shock], { ai: {}, auto: true }), 'chế độ tự động: hành động AI tự chọn không thêm vào năm đã có 2 lựa chọn');
  ok(P.admit(l, daily, [daily, shock], { ai: {} }), 'chế độ thủ công: năm trước bỏ trống thì game vẫn tự chọn giúp một việc (GĐ6)');
  ok(P.admit(l, daily, [daily], { ai: {} }), 'hành động AI vẫn có ở năm thưa');
  const g = clone(M); P.state(g).h.push([g.age - 1, 'd', 'marriage130', 'quà', 'marriageGift130']);
  ok(!P.admit(g, { id: 'marriageTime130', title: 'Bạn đời cần thêm thời gian', text: '' }, [], {}), 'nhóm chủ đề: cảnh hôn nhân trong 3 năm bị hoãn');
  g.age += 3; ok(P.admit(g, { id: 'marriageTime130', title: 'Bạn đời cần thêm thời gian', text: '' }, [], {}), 'nhóm chủ đề: hết khoảng cách thì được xuất hiện lại');
  const n = clone(M); P.state(n).h.push([n.age - 1, 'd', '', P.sig({ title: 'Họp lớp cuối năm' }), 'a_id']);
  ok(!P.admit(n, { id: 'b_id', title: 'Họp lớp cuối năm', text: '' }, [], {}), 'chống trùng: tình huống khác ID cùng nội dung trong 3 năm bị loại');
  ok(P.admit(n, { id: 'b_id', title: 'Họp lớp cuối năm', text: '' }, [], { rep: true }), 'chống trùng: chuỗi đang diễn ra (rep) được giữ');
  ok(P.sig({ title: 'Hùng gặp chuyện', data: { n: 'Hùng' } }) === P.sig({ title: 'Lan gặp chuyện', data: { n: 'Lan' } }) && P.sig({ title: 'Gặp lại Minh An ở quê' }) === P.sig({ title: 'Gặp lại Thu Hà ở quê' }), 'dấu vân bỏ tên riêng');
}

// ---------- 4. Bị loại thì không mất cooldown, năm không bị khóa trắng ----------
{
  const admit = P.admit; let rejected = 0, yes = new Set(), no = new Set();
  P.admit = function (l, d, q, src) { const r = !(src && !src.ai && P.tier(d) === 'shock') && admit.apply(this, arguments); (r ? yes : no).add(d.id); if (!r) rejected++; return r; };
  let filled = 0, years = 0, leaked = 0;
  for (let i = 0; i < 6; i++) {
    const l = clone(M); l.id = 'cd' + i; l.rs = (l.rs + i * 104729) | 0;
    for (let y = 0; y < 10 && l.alive; y++) {
      yes.clear(); no.clear(); E.beginYear(l, { auto: true }); years++; if (l.pending.length) filled++;
      no.forEach(id => { if (!yes.has(id) && l.flags.cd && l.flags.cd[id] === l.age) leaked++; });
      let g = 0; while (l.pending.length && l.alive && g++ < 64) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); g = 0; while (l.pending.length && l.alive && g++ < 64) E.resolve(l, E.autoKey(l)); E.endYear(l);
    }
  }
  P.admit = admit;
  ok(rejected > 0 && leaked === 0, 'tình huống bị điều tiết không bị tính cooldown (' + rejected + ' lần loại)');
  ok(filled / years > 0.5, 'loại biến cố vẫn còn tình huống khác trong năm (' + filled + '/' + years + ')');
}

// ---------- 5. GĐ3 và GĐ4 ----------
{
  ok(E.TRIG.filter(t => t.contextTags).length === 50 && typeof E.CONTEXT143.probability === 'function', 'GĐ3: 50 trigger có trọng số hoàn cảnh');
  const T = E.TRIG.find(t => t.contextTags && /marriage/.test(t.id));
  ok(T && E.CONTEXT143.factor(T, M) >= 0.5 && E.CONTEXT143.factor(T, M) <= 2, 'GĐ3: hệ số vẫn áp dụng cho cảnh hôn nhân vừa mở lại');
  const engine = fs.readFileSync(path.join(__dirname, '..', 'public/js/engine.js'), 'utf8');
  ok(/E\.CONTEXT143\.probability\(T, life, pr\)/.test(engine) && /add\(T\.id, undefined, T\)/.test(engine), 'engine: vẫn nhân hệ số GĐ3 trước khi điều tiết GĐ5');
  // Lựa chọn chuỗi GĐ4 đi qua lịch hẹn, không qua bộ điều tiết: năm đầy biến cố vẫn hiện đúng một lựa chọn chuỗi.
  // Giai đoạn chuỗi là xác suất theo nhân vật: thử vài biến thể (không đổi gameplay) để chắc chắn có một lần được hẹn.
  let l = null, c = null, at = null;
  for (let v = 0; v < 12 && at == null; v++) {
    l = clone(M); l.id = M.id + ':chain' + v; l.fam.mAlive = true; l.loans = [{ type: 'family', name: 'vay người thân', bal: l.base, rate: 0, minShare: .15, late: 0, since: l.age }];
    c = E.CHAIN144.start(l, 'debt', { dec: 'test', k: 'x' }, { data: { loan: 'family', since: l.age, who: 'mẹ' } });
    P.state(l).h.push([l.age + 1, 's', '', 'a', 'x1'], [l.age + 1, 's', '', 'b', 'x2']);
    for (let i = 0; i < 5 && at == null; i++) { E.CHAIN144.yearly(l, H.rf(l), () => {}, l.age); const s = l.sched.find(x => x.arg && x.arg.cid === c.id); if (s) at = s.at; else l.age++; }
  }
  ok(at != null, 'GĐ4: chuỗi vẫn hẹn được giai đoạn');
  l.age = at; P.state(l).h.push([at, 's', '', 'c', 'x3'], [at, 's', '', 'd', 'x4']);
  E.beginYear(l, { auto: true });
  ok(l.pending.filter(d => d.data && d.data.cid === c.id).length === 1, 'GĐ4: hậu quả đã hẹn không bị bộ điều tiết chặn');
  ok(l.pending.filter(d => /^ch144_/.test(d.id)).length <= 1, 'GĐ4: vẫn tối đa một lựa chọn chuỗi mỗi năm');
}

// ---------- 6. Nhật ký kể chuyện, du lịch, dữ liệu gọn ----------
{
  const l = clone(M); l.log = [];
  const raw = (t, k) => l.log.push({ a: l.age, t, k }), log = P.quietLog(l, raw);
  log('Sáng tưới cây, chiều đánh cờ với hàng xóm.', 'neutral'); l.age += 3; log('Sáng tưới cây, chiều đánh cờ với hàng xóm.', 'neutral');
  ok(l.log.length === 1, 'nhật ký: câu kể giống hệt trong 6 năm bị bỏ');
  log('Lương hưu 5 triệu đ/tháng.', 'money'); log('Lương hưu 5 triệu đ/tháng.', 'money');
  ok(l.log.length === 3, 'nhật ký: dòng tiền bạc không bị lọc');
  l.age += 4; log('Sáng tưới cây, chiều đánh cờ với hàng xóm.', 'neutral');
  ok(l.log.length === 4, 'nhật ký: sau 6 năm câu kể được xuất hiện lại');
  ok(fs.readFileSync(path.join(__dirname, '..', 'public/js/engine.js'), 'utf8').includes('ev.run(life, a, r, E.PACE145 && E.PACE145.quietLog ? E.PACE145.quietLog(life, log) : log)'), 'nhật ký: engine cho mọi sự kiện kể chuyện qua bộ lọc');
  ok(E.EVENTS.some(x => String(x.run).includes("'nv_lenh_goi'")), 'nhật ký: mã nguồn sự kiện vẫn tra cứu được (không bị bọc)');
  const t = clone(M); t.id = 'trip'; ok(P.tripOk(t), 'du lịch: năm thưa có thể được rủ đi chơi');
  P.state(t).trip = t.age; ok(!P.tripOk(t), 'du lịch: tối đa một lời rủ ngẫu nhiên mỗi năm');
  const t2 = clone(M); P.state(t2).h.push([t2.age, 's', '', 'x', 'treat']); ok(!P.tripOk(t2), 'du lịch: không rủ đi chơi trong năm có biến cố lớn');
  const big = clone(M); for (let i = 0; i < 60; i++) E.DEC.marriageGift130.apply(big, Object.assign(E.DEC.marriageGift130.make(big, H.rf(big)), { id: 'marriageGift130' }), 'thanks', H.rf(big), () => {}) , big.age++;
  ok(P.state(big).h.length <= 24, 'lịch sử điều tiết giữ tối đa 24 dòng (' + P.state(big).h.length + ')');
  const bad = clone(M); bad.flags.pace145 = 'hỏng'; E.migrate(bad); ok(bad.flags.pace145 === undefined, 'bản lưu: dữ liệu điều tiết hỏng được bỏ an toàn');
  const ok2 = clone(M); ok2.flags.pace145 = { v: 1, h: [[30, 'd', '', 'a', 'x'], 'rác', [31, 's', '', 'b', 'y']] }; E.migrate(ok2); E.migrate(ok2);
  ok(ok2.flags.pace145.h.length === 2, 'bản lưu: lọc dòng hỏng, migrate hai lần không đổi');
}

// ---------- 7. Bản lưu cũ chơi tiếp ----------
{
  const dir = path.join(__dirname, 'fixtures', 'saves'); let n = 0;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json.gz'))) {
    for (const item of JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(dir, f)))).saves) {
      const l = E.migrate(clone(item.save.life)); if (!l.alive) continue;
      for (let y = 0; y < 5 && l.alive; y++) { E.beginYear(l, { auto: true }); let g = 0; while (l.pending.length && l.alive && g++ < 64) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); g = 0; while (l.pending.length && l.alive && g++ < 64) E.resolve(l, E.autoKey(l)); E.endYear(l); }
      const s = l.flags.pace145; ok(s === undefined || s.h.length <= 24, f + ': bản lưu cũ chơi tiếp 5 năm'); n++;
    }
  }
  ok(n >= 10, 'đã chạy ' + n + ' bản lưu cũ');
}

// ---------- 8. Mô phỏng: bất biến nhịp ----------
{
  const fresh = gameContext().E; let lives = 0, years = 0, quiet = 0, trips = 0, repeatsNarr = 0;
  for (let i = 0; i < 30; i++) {
    const l = fresh.createLife({ mode: i % 3 ? 'vn' : 'world', seed: 31000 + i * 7919 });
    const randomTripYears = {};
    const log0 = l.log.length; void log0;
    fresh.runHeadless(l, x => { const s = x.flags.pace145; if (s && s.trip === x.age) randomTripYears[x.age] = 1; });
    lives++; years += l.age + 1;
    const h = (l.flags.pace145 || { h: [] }).h; ok(h.length <= 24, 'sim: lịch sử gọn');
    const m130 = l.log.filter(e => /hiểu lầm một cuộc trò chuyện|món quà nhỏ cho bạn/.test(e.t)).length; void m130;
    const narr = {}; l.log.forEach(e => { if (/^(Sáng tưới cây|Ngồi hiên nhà|Tập dưỡng sinh)/.test(e.t)) { (narr[e.t] = narr[e.t] || []).push(e.a); } });
    for (const t in narr) for (let k = 1; k < narr[t].length; k++) if (narr[t][k] - narr[t][k - 1] <= 6) repeatsNarr++;
    trips += Object.keys(randomTripYears).length; if (!h.length) quiet++;
  }
  ok(repeatsNarr === 0, 'sim: câu kể đời thường giống hệt không lặp trong 6 năm (' + repeatsNarr + ')');
  console.log('   Mô phỏng ' + lives + ' đời / ' + years + ' năm: ' + trips + ' năm có chuyến đi, ' + quiet + ' đời không có lịch sử điều tiết.');
}

console.log('PASS pace-gd5: ' + checks + ' kiểm tra.');
