/* Khối thi THPT: luôn được chọn, xem/đổi trước kỳ thi, không âm thầm gán A00, giữ nguồn lựa chọn qua lưu/tải. */
'use strict';
const assert = require('assert'), E = require('./hardcore-isolation').gameContext().E;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
const reload = l => E.migrate(JSON.parse(JSON.stringify(l)));
function student(seed, o) {
  const l = E.createLife({ mode: 'vn', seed, year: 2026 });
  l.age = (o && o.age) || 16; l.school = (o && o.school) || 'upper'; l.schoolEnd = (o && o.schoolEnd) || 18; l.edu = 2; l.pending = []; l.sched = [];
  return l;
}
function playYear(l, pick) {
  E.beginYear(l, {}); let g = 0;
  while (l.pending.length && g++ < 64) { const d = l.pending[0]; let k = pick && pick(d, l); if (k && d.id === 'chon_khoi') d.byHand912 = true; E.resolve(l, k || E.autoKey(l)); }
  if (l.alive) E.finishYear(l); g = 0;
  while (l.pending.length && g++ < 64) E.resolve(l, E.autoKey(l));
  E.endYear(l);
}

// 1. Học công và tư: năm 16 tuổi luôn có quyết định chọn khối, kể cả khi hàng đợi đầy.
for (const school of ['upper', 'priv']) for (let seed = 1; seed <= 40; seed++) {
  const l = student(9120 + seed, { school });
  E.beginYear(l, {});
  ok(l.pending.filter(d => d.id === 'chon_khoi').length === 1, school + ' seed ' + seed + ': exactly one khoi decision');
  ok(l.pending.length <= E.DIFFICULTIES.normal.cap, 'mandatory khoi decision respects queue cap');
}
// 2. Người chơi tự chọn: nguồn manual, reload không đổi khối, không kẹt năm học.
{
  const l = student(912001); l.st.kno = 90; // Isolate block selection from admission balance.
  playYear(l, d => d.id === 'chon_khoi' ? 'C00' : null);
  ok(l.khoi === 'C00' && l.flags.khoi912.src === 'manual', 'manual choice recorded');
  const r = reload(l); ok(r.khoi === 'C00' && r.flags.khoi912.src === 'manual', 'reload keeps manual choice');
  E.beginYear(r, {}); ok(!r.pending.some(d => d.id === 'chon_khoi'), 'not asked again after choosing');
  let g = 0; while (r.pending.length && g++ < 64) E.resolve(r, E.autoKey(r)); E.finishYear(r);
  let gg = 0; while (r.pending.length && gg++ < 64) E.resolve(r, E.autoKey(r)); E.endYear(r);
  ok(r.khoi === 'C00' && r.examScore != null && r.edu >= 3, 'graduates with the chosen block');
  ok(r.flags.exam127 ? r.flags.exam127.block === 'C00' : true, 'exam detail uses chosen block, not A00');
  ok(E.KHOI912.locked(r) && E.KHOI912.canChange(r) !== true, 'block locked after exam');
}
// 3. Lưu trước khi trả lời rồi tải lại: quyết định vẫn còn, không nhân đôi.
{
  const l = student(912002); E.beginYear(l, {});
  const r = reload(l); ok(r.pending.filter(d => d.id === 'chon_khoi').length === 1, 'pending khoi survives reload once');
  r.pending.push(JSON.parse(JSON.stringify(r.pending.find(d => d.id === 'chon_khoi'))));
  const r2 = reload(r); ok(r2.pending.filter(d => d.id === 'chon_khoi').length === 1, 'duplicate khoi decisions are collapsed on load');
}
// 4. Bản lưu cũ đã qua 16 tuổi, chưa chọn khối, đang năm thi: vẫn được hỏi trước kỳ thi.
{
  const l = student(912003, { age: 17 }); delete l.flags.khoi912;
  const r = reload(l); E.beginYear(r, {});
  ok(r.pending.some(d => d.id === 'chon_khoi'), 'legacy save in exam year is asked');
  ok(/năm thi/.test(r.pending.find(d => d.id === 'chon_khoi').text), 'exam-year prompt explains urgency');
}
// 5. Bản lưu cũ đã có khối: giữ nguyên, đánh dấu legacy, vẫn cho đổi khi còn đủ điều kiện.
{
  const l = student(912004); l.khoi = 'A00'; delete l.flags.khoi912;
  const r = reload(l);
  ok(r.khoi === 'A00' && r.flags.khoi912.src === 'legacy', 'legacy block kept and marked');
  ok(E.KHOI912.canChange(r) === true, 'legacy block can still be changed before exam');
  const d = E.act(r, 'khoi912'); ok(d && d.opts.some(o => o.k === 'k_D01') && !d.opts.some(o => o.k === 'k_A00'), 'change menu lists other blocks only');
  E.resolve(r, 'k_D01'); ok(r.khoi === 'D01' && r.flags.khoi912.changes === 1 && r.flags.khoi912.src === 'manual', 'changed block via Study menu');
  ok(r.flags.khoi912.hist.slice(-1)[0].from === 'A00', 'history keeps previous block');
}
// 6. Đổi khối: năm thi phải học bù, tối đa 2 lần, hủy không tốn lượt.
{
  const l = student(912005, { age: 17 }); l.khoi = 'A00'; E.migrate(l);
  const kno = l.st.kno; E.act(l, 'khoi912'); E.resolve(l, 'k_B00');
  ok(l.khoi === 'B00' && l.st.kno <= kno - E.KHOI912.BAL.lateKno + 0.001, 'late change costs knowledge');
  const acts = l.acts; l.flags.actAt = {}; E.act(l, 'khoi912'); E.resolve(l, 'cancel'); ok(l.acts === acts && l.khoi === 'B00', 'cancel keeps block and turn');
  l.flags.actAt = {}; E.act(l, 'khoi912'); E.resolve(l, 'k_D01'); ok(l.khoi === 'D01', 'second change allowed');
  l.flags.actAt = {}; ok(E.KHOI912.canChange(l) !== true && !E.act(l, 'khoi912'), 'third change refused by handler');
  l.khoi = 'D01'; const before = l.khoi; E.KHOI912.state(l).changes = 2;
  ok(E.DEC.khoi912.valid(l, { at: l.age }) === false && l.khoi === before, 'handler validates, not only hidden button');
}
// 7. Chế độ tự động rồi chơi tay: nguồn auto, sau đó vẫn đổi được.
{
  const l = student(912006); playYear(l);
  ok(l.khoi && l.flags.khoi912.src === 'auto', 'auto-play records auto source');
  ok(E.KHOI912.canChange(l) === true, 'player can change after auto choice');
}
// 8. Du học / sống ở nước khác: không hỏi, không gán khối; nước khác không có A00.
{
  const l = E.createLife({ mode: 'world', country: 'US', seed: 912007, year: 2026 }); l.age = 16; l.school = 'upper'; l.schoolEnd = 18; l.pending = [];
  E.beginYear(l, {}); ok(!l.pending.some(d => d.id === 'chon_khoi'), 'no khoi decision outside Vietnam');
  ok(E.KHOI912.canChange(l) !== true, 'no khoi menu outside Vietnam');
  for (let i = 0; i < 2 && l.alive; i++) playYear(l);
  ok(!l.khoi, 'no block assigned abroad');
}
// 9. Vào THPT muộn (lưu ban, ra trường 19 tuổi): hỏi ở lớp 11 thực tế, không hỏi lớp 10.
{
  const l = student(912008, { age: 16, schoolEnd: 19 }); E.beginYear(l, {});
  ok(!l.pending.some(d => d.id === 'chon_khoi'), 'grade 10 (late entry) not asked yet');
  const m = student(912009, { age: 17, schoolEnd: 19 }); E.beginYear(m, {});
  ok(m.pending.some(d => d.id === 'chon_khoi'), 'late entry asked in grade 11');
}
// 10. Bổ túc THPT: được hỏi trước khi thi, khối năng khiếu dùng được.
{
  const l = student(912010, { age: 24 }); l.school = null; l.schoolEnd = null; l.flags.gdtx = { lvl: 3, start: 22, until: 25, from: 2 };
  E.beginYear(l, {}); const d = l.pending.find(x => x.id === 'chon_khoi');
  ok(d && /bổ túc/.test(d.text), 'GDTX student is asked');
  ok(d.opts.some(o => o.k === 'H00') && d.opts.some(o => o.k === 'N00'), 'aptitude blocks offered');
  d.byHand912 = true; l.pending = [d]; E.resolve(l, 'N00'); ok(l.khoi === 'N00' && l.flags.nkPrep && l.flags.khoi912.src === 'manual', 'aptitude block chosen manually');
}
// 11. Không có câu trả lời tới kỳ thi (đời do máy / dữ liệu ngoài): nhà trường xếp có ghi nhật ký, không im lặng.
{
  const l = student(912011, { age: 17 }); const logs = [];
  E.HOOKS.gradUpper[0](l, () => .9, (t) => logs.push(t));
  ok(l.khoi && l.flags.khoi912.src === 'school' && logs.length === 1 && /chưa đăng ký khối/.test(logs[0]), 'school fallback is logged and tagged');
}
// 12. Từ nhập học tới xét tuyển: nhiều seed, mọi đường đều có lựa chọn, không ai tốt nghiệp mà thiếu khối hay khối do trường xếp.
{
  let grads = 0, schoolSrc = 0;
  for (let seed = 1; seed <= 120; seed++) {
    const l = E.createLife({ mode: 'vn', seed: 91200 + seed, year: 2026 });
    for (let y = 0; y < 20 && l.alive; y++) playYear(l);
    if (l.examScore != null && l.flags.gdtxGrad == null) { grads++; ok(!!l.khoi, 'graduate has a block'); if (l.flags.khoi912.src === 'school') schoolSrc++; }
  }
  ok(grads > 40 && schoolSrc === 0, 'all regular graduates chose before the exam (' + grads + ')');
}
console.log('Khối thi THPT: ' + count + ' checks passed.');
