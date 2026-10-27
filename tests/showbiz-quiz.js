/* Showbiz — Mốc 2: bộ máy câu hỏi và gameshow kiến thức (Nhanh Như Chớp, Ai Là Triệu Phú, Đấu Trường 100, Olympia, Siêu Trí Tuệ). */
'use strict';
const assert = require('assert');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, H = E.H, Q = E.QUIZ151, SH = E.SHOW151;
let checks = 0;
const ok = (c, m) => { assert(c, m); checks++; };
const near = (a, b, m) => ok(Math.abs(a - b) < 1e-6, m + ': ' + a + ' vs ' + b);
const clone = o => JSON.parse(JSON.stringify(o));
function life(o = {}) {
  const l = E.createLife({ mode: o.mode || 'vn', seed: o.seed || 1511, year: o.birth || 1995 });
  Object.assign(l, { age: o.age || 30, edu: o.edu == null ? 5 : o.edu, indep: true, school: o.school || null, pending: [], partner: null, jailUntil: null, abroad: null });
  l.flags.military = 0; l.money = l.base * 10; l.st.kno = o.kno == null ? 80 : o.kno; l.fame = o.fame || 0;
  return l;
}
function step(l) { return l.pending.find(d => d.id === 'show151_step'); }
function keyOf(d, k) { const i = d.data.keys.indexOf(k); return i >= 0 && d.opts.some(o => o.k === String(i)) ? String(i) : null; }
// Trả lời câu hiện tại: đúng hoặc sai (chọn phương án sai đầu tiên còn hiện)
function answer(l, right) {
  const d = step(l), a = SH.S(l).active; assert(d && a, 'đang có câu hỏi');
  let k = 'o' + a.q.answer;
  if (!right) { const i = a.q.options.findIndex((o, j) => j !== a.q.answer && !(a.hide || []).includes(j)); k = 'o' + i; }
  const key = keyOf(d, k); assert(key, 'có phương án ' + k + ' (' + d.data.keys + ')');
  l.pending = l.pending.filter(x => x !== d); l.pending.unshift(d); E.resolve(l, key);
}
function choose(l, k) { const d = step(l); const key = keyOf(d, k); assert(key, 'có lựa chọn ' + k + ' (' + d.data.keys + ')'); l.pending = l.pending.filter(x => x !== d); l.pending.unshift(d); E.resolve(l, key); }
function start(l, id, role = 'contestant') { assert.strictEqual(SH.canJoin(l, SH.SHOWS[id], role), true, id + ' đủ điều kiện: ' + SH.canJoin(l, SH.SHOWS[id], role)); const a = SH.begin(l, H.rf(l), (t, k) => l.log.push({ a: l.age, t, k }), id, role); assert(a, 'bắt đầu ' + id); return a; }
function autoplay(l, max = 200) { let n = 0; while (step(l) && n++ < max) { const d = step(l); l.pending = l.pending.filter(x => x !== d); l.pending.unshift(d); E.resolve(l, E.autoKey(l)); } return n; }

// ---------- Bộ máy câu hỏi ----------
{
  let bad = 0, n = 0; const byKind = {}, byDiff = { 1: 0, 2: 0, 3: 0 };
  for (let i = 0; i < 30000; i++) { const q = Q.generate('kt' + i, { diff: 1 + i % 3 }); n++; byKind[q.kind] = (byKind[q.kind] || 0) + 1; byDiff[q.diff]++; if (!Q.verify(q) || !q.explain || !q.text || q.options.length < 2) bad++; }
  ok(bad === 0, '30.000 câu hỏi: đáp án đúng nằm trong phương án, phương án không trùng, có giải thích (' + bad + ' lỗi)');
  ok(Object.keys(byKind).length === Q.kinds.length, 'mọi dạng câu hỏi đều được dùng: ' + Object.keys(byKind).length);
  ok(byDiff[1] && byDiff[2] && byDiff[3], 'có đủ ba mức dễ / trung bình / khó');
  // Tính lại đáp án các câu toán độc lập với bộ sinh
  for (let i = 0; i < 3000; i++) { const q = Q.generate('m' + i, { diff: 1 + i % 3, kinds: ['arith'] }); const expr = q.text.replace('Tính nhanh: ', '').replace('= ?', '').replace(/×/g, '*').replace(/−/g, '-').replace(/:/g, '/'); ok(String(eval(expr)) === q.options[q.answer], 'phép tính ' + q.text + ' đúng'); }
  for (let i = 0; i < 500; i++) { const q = Q.generate('s' + i, { diff: 2, kinds: ['sequence'] }); const nums = q.text.match(/-?\d+/g).map(Number); ok(nums.length >= 5 && q.options[q.answer] !== undefined, 'dãy số có đáp án'); }
  // Không lặp: trong một phiên, 60 câu liên tiếp không trùng chữ ký
  const recent = [], sigs = []; let last;
  for (let i = 0; i < 60; i++) { const q = Q.generate('rep' + i, { diff: 2, recent, lastKind: last }); sigs.push(q.sig); recent.push(q.sig); ok(q.kind !== last, 'không cùng dạng hai câu liền nhau'); last = q.kind; }
  ok(new Set(sigs).size === sigs.length, '60 câu liên tiếp không lặp lại');
  // Bối cảnh quốc tế không hỏi dữ kiện riêng của Việt Nam
  for (let i = 0; i < 400; i++) { const q = Q.generate('w' + i, { diff: 2, kinds: ['fact', 'history'], vn: false }); ok(!/Hội An|Hạ Long|quan họ|Fansipan|Bạch Đằng|Thăng Long|Điện Biên/.test(q.text + q.options.join()), 'bản quốc tế không hỏi dữ kiện riêng Việt Nam'); }
  ok(Q.variants() > 1e6, 'không gian biến thể lớn: ' + Q.variants());
  const same = Q.generate('cố định', { diff: 2 }), again = Q.generate('cố định', { diff: 2 }); ok(JSON.stringify(same) === JSON.stringify(again), 'cùng hạt giống → cùng câu hỏi (tải lại không đổi câu)');
}

// ---------- Nhanh Như Chớp ----------
{
  const l = life(); const m0 = l.money;
  ok(SH.canJoin(life({ age: 16 }), SH.SHOWS.nnc, 'contestant') !== true, 'dưới 18 tuổi không được làm thí sinh');
  start(l, 'nnc');
  ok(step(l) && /Câu 1\/15/.test(step(l).title), 'câu 1/15');
  ok(step(l).opts.length >= 3, 'có phương án trả lời');
  for (let i = 0; i < 4; i++) answer(l, true);
  ok(SH.S(l).active.streak === 4, 'đúng 4 câu: chuỗi 4');
  // Lưu và tải giữa cuộc thi: cùng câu, cùng chuỗi
  const before = clone(l), back = E.migrate(clone(l));
  ok(back.flags.show151.active.q.text === l.flags.show151.active.q.text && back.flags.show151.active.streak === 4, 'tải lại giữa chừng: giữ nguyên câu hỏi và chuỗi');
  answer(l, false); ok(SH.S(l).active.streak === 0 && SH.S(l).active.best === 4, 'sai: chuỗi về 0, giữ thành tích tốt nhất');
  // Quyết định cũ bấm lại không có tác dụng
  const stale = before.pending.find(d => d.id === 'show151_step'); const qn = SH.S(l).active.qi; l.pending.unshift(stale); E.resolve(l, keyOf(stale, 'o' + before.flags.show151.active.q.answer)); ok(SH.S(l).active.qi === qn, 'bấm lại câu cũ không được tính');
  for (let i = 0; i < 10 && SH.S(l).active; i++) answer(l, true);
  const h = SH.S(l).history.slice(-1)[0];
  ok(!SH.S(l).active && h && h.rank >= 10 && /chiến thắng/.test(h.result), 'đạt 10 câu liên tiếp: chiến thắng');
  near(l.money - m0, SH.V(l, 20), 'nhận đúng 20 triệu đồng');
  SH.pay(l, { token: Object.keys(SH.S(l).paid)[0].replace(/:prize$/, '') }, 'prize', SH.V(l, 20), 'thử trả lại'); near(l.money - m0, SH.V(l, 20), 'không nhận thưởng hai lần');
  ok(SH.S(l).invites.nnc, 'thắng thì được mời trở lại');
  ok(SH.canJoin(l, SH.SHOWS.nnc, 'contestant') !== true, 'không tham gia lại ngay trong năm');
  // Thua: không có tiền
  const l2 = life({ seed: 2 }), m2 = l2.money; start(l2, 'nnc'); for (let i = 0; i < 15 && SH.S(l2).active; i++) answer(l2, i % 3 !== 2);
  ok(!SH.S(l2).active && l2.money === m2, 'không đạt chuỗi 10: không có tiền thưởng');
  // Khách mời nổi tiếng: có cát-xê, tiền thắng gửi quỹ từ thiện
  const c = life({ fame: 3e5 }), cm = c.money; start(c, 'nnc', 'celeb'); const fee = c.money - cm; ok(fee > 0, 'khách mời nổi tiếng nhận cát-xê');
  for (let i = 0; i < 10 && SH.S(c).active; i++) answer(c, true); near(c.money - cm, fee, 'tiền thắng của khách mời không vào tài khoản');
}

// ---------- Ai Là Triệu Phú ----------
{
  const l = life(); start(l, 'altp'); const L = SH.ladder(l, SH.SHOWS.altp);
  ok(L.length === 15 && Math.abs(L[14] - SH.V(l, 150)) < 1e-6, 'thang 15 câu, câu cuối 150 triệu trước năm 2026');
  const d = step(l); ['fifty', 'audience', 'phone', 'expert'].forEach(k => ok(d.data.keys.includes(k), 'có quyền trợ giúp ' + k));
  choose(l, 'fifty'); ok(SH.S(l).active.hide.length === 2 && !step(l).data.keys.includes('fifty'), '50:50 bỏ hai phương án sai, chỉ dùng một lần');
  ok(!SH.S(l).active.hide.includes(SH.S(l).active.q.answer), '50:50 không bỏ đáp án đúng');
  answer(l, true); choose(l, 'audience'); ok(/Khán giả: /.test(SH.S(l).active.hint) && /\d+%/.test(SH.S(l).active.hint), 'khán giả bình chọn có tỉ lệ');
  const pct = SH.S(l).active.hint.match(/(\d+)%/g).map(x => +x.replace('%', '')); ok(pct.reduce((a, b) => a + b, 0) === 100, 'tỉ lệ khán giả cộng đủ 100%');
  for (let i = 0; i < 5; i++) answer(l, true);
  const m0 = l.money; choose(l, 'stop'); near(l.money - m0, L[5], 'dừng cuộc chơi sau 6 câu: mang về tiền câu 6');
  const l2 = life({ seed: 3 }); start(l2, 'altp'); for (let i = 0; i < 7; i++) answer(l2, true); const m2 = l2.money; answer(l2, false); near(l2.money - m2, L[4], 'sai sau mốc câu 5: về mốc an toàn câu 5');
  const l3 = life({ seed: 4 }); start(l3, 'altp'); const m3 = l3.money; answer(l3, false); ok(l3.money === m3, 'sai câu 1: không có tiền');
  const l4 = life({ seed: 5, birth: 1998 }); l4.age = 30; ok(Math.abs(SH.ladder(l4, SH.SHOWS.altp)[14] - SH.V(l4, 500)) < 1e-6, 'từ năm 2026: câu 15 trị giá 500 triệu');
  const l5 = life({ seed: 6 }); start(l5, 'altp'); for (let i = 0; i < 15 && SH.S(l5).active; i++) answer(l5, true); ok(SH.S(l5).history.slice(-1)[0].result === 'vượt qua cả 15 câu hỏi', 'vượt qua 15 câu');
  const w = life({ mode: 'world', seed: 7 }); ok(SH.canJoin(w, SH.SHOWS.altp, 'contestant') !== true && SH.canJoin(w, SH.SHOWS.millionaire, 'contestant') === true, 'ở nước ngoài tham gia bản quốc tế, không phải bản Việt Nam');
}

// ---------- Đấu Trường 100 ----------
{
  const old = life({ birth: 1980, seed: 8 }); old.age = 30; // năm 2010
  ok(SH.canJoin(old, SH.SHOWS.dt100, 'contestant') === true, 'năm 2010 có Đấu Trường 100');
  ok(SH.canJoin(life(), SH.SHOWS.dt100, 'contestant') !== true, 'sau 2015 chương trình đã ngừng sản xuất');
  start(old, 'dt100'); answer(old, true); const a = SH.S(old).active; ok(a.mob < 100 && a.bank > 0, 'mỗi câu đúng loại bớt người, tiền tích lũy tăng');
  answer(old, true); answer(old, true); const bank = SH.S(old).active.bank, m = old.money; choose(old, 'stop'); near(old.money - m, bank, 'dừng lại nhận tiền tích lũy');
  const o2 = life({ birth: 1980, seed: 9 }); o2.age = 30; start(o2, 'dt100'); answer(o2, true); const m2 = o2.money; answer(o2, false); ok(o2.money === m2, 'trả lời sai: mất toàn bộ tiền tích lũy');
}

// ---------- Đường Lên Đỉnh Olympia ----------
{
  const hs = life({ age: 17, birth: 2008, school: 'THPT chuyên', kno: 90, seed: 10 });
  ok(SH.canJoin(hs, SH.SHOWS.olympia, 'contestant') === true, 'học sinh THPT giỏi được cử đi thi');
  ok(SH.canJoin(life({ age: 17, birth: 2008, school: 'THPT', kno: 30 }), SH.SHOWS.olympia, 'contestant') !== true, 'học lực chưa đủ thì chưa được cử');
  ok(SH.canJoin(life({ age: 25 }), SH.SHOWS.olympia, 'contestant') !== true, 'người lớn không thi Olympia');
  start(hs, 'olympia');
  ok(/Khởi động/.test(step(hs).title), 'bắt đầu phần Khởi động');
  const p0 = SH.S(hs).active.pts; answer(hs, true); const a = SH.S(hs).active; ok(a.pts === p0 + 10 || a.npc.some(n => n.pts === 10), 'Khởi động: đúng +10 (hoặc đối thủ bấm chuông nhanh hơn)');
  const parts = new Set(); let n = 0;
  while (SH.S(hs).active && n++ < 200) { parts.add(SH.S(hs).active.part + ':' + SH.S(hs).active.stage); const d = step(hs); if (d.data.keys.includes('v30')) choose(hs, 'v30'); else answer(hs, true); }
  ok(['kd', 'cnv', 'tt', 'vd'].every(p => [...parts].some(x => x.startsWith(p + ':'))), 'đi qua đủ bốn phần thi: ' + [...parts].join(','));
  const h = SH.S(hs).history.slice(-1)[0]; ok(h && /vô địch|xếp thứ/.test(h.result), 'có kết quả: ' + h.result);
  ok(/một lần/.test(SH.canJoin(hs, SH.SHOWS.olympia, 'contestant')), 'mỗi người thi Olympia một lần: ' + SH.canJoin(hs, SH.SHOWS.olympia, 'contestant'));
}

// ---------- Siêu Trí Tuệ ----------
{
  const l = life({ seed: 11, kno: 85 }); start(l, 'stt');
  ok(/Hãy ghi nhớ/.test(step(l).text) && step(l).data.keys.includes('ready'), 'thử thách ghi nhớ: xem dãy trước rồi mới hỏi');
  const memo = SH.S(l).active.memo; choose(l, 'ready');
  ok(!step(l).text.includes(memo) && /vị trí thứ|ngay sau/.test(step(l).text), 'khi hỏi không còn hiện dãy cần nhớ');
  let n = 0; while (SH.S(l).active && n++ < 40) { const d = step(l); if (d.data.keys.includes('ready')) choose(l, 'ready'); else answer(l, true); }
  ok(/biệt đội|dừng chân/.test(SH.S(l).history.slice(-1)[0].result), 'có kết quả cuối');
}

// ---------- Chế độ Tự động, bỏ dở, lời mời ----------
{
  for (const [id, o] of [['nnc', {}], ['altp', {}], ['olympia', { age: 17, birth: 2008, school: 'THPT', kno: 85 }], ['stt', {}], ['dt100', { birth: 1980, age: 30 }]]) {
    for (let s = 0; s < 6; s++) { const l = life(Object.assign({ seed: 100 + s }, o)); if (o.age) l.age = o.age; const m = l.money; start(l, id); const n = autoplay(l); ok(!SH.S(l).active && n > 0 && Number.isFinite(l.money) && l.money >= m - 1e-9, id + ' tự động #' + s + ': chơi hết, tiền hợp lệ (' + n + ' bước)'); }
  }
  const l = life({ seed: 200 }); start(l, 'altp'); answer(l, true); answer(l, true); l.pending = []; const m = l.money;
  E.HOOKS.year.forEach(fn => { if (/show151/.test(String(fn))) fn(l, () => 0.5, (t) => l.log.push({ a: l.age, t })); });
  ok(!SH.S(l).active && l.money > m, 'bỏ dở Ai Là Triệu Phú: khép lại, giữ tiền đã chắc chắn');
  const star = life({ seed: 201, fame: 5e5 }); ok(SH.inviteFor(star).some(x => x.id === 'nnc' && x.role === 'celeb'), 'người nổi tiếng nhận lời mời làm khách mời');
  ok(!SH.inviteFor(life({ seed: 202 })).length, 'người bình thường không tự nhận lời mời');
  const menu = E.DEC.show151.make(star, () => 0); ok(menu.data.keys.length >= 5, 'menu liệt kê các chương trình và vai trò: ' + menu.data.keys.join(','));
  ok(E.ACT.some(a => a.id === 'show151' && a.g === 'Giải trí & trải nghiệm'), 'có hành động "Chương trình truyền hình"');
}
console.log('Câu hỏi: ' + Q.kinds.length + ' dạng sinh theo quy tắc, ' + Q.facts + ' câu dữ kiện cố định, bảng ' + JSON.stringify(Q.tables) + ', không gian biến thể ' + Q.variants());
console.log('PASS showbiz-quiz: ' + checks + ' kiểm tra.');
