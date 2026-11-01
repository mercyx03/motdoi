/* Tình cảm 912: 10 lượt tìm/năm một nguồn đếm, gặp ≠ đồng ý, mở khóa tuổi, làm mới danh sách mập mờ giữ hệ quả. */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, RM = E.ROMANCE912;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
const reload = l => E.migrate(JSON.parse(JSON.stringify(l)));
function single(o = {}) {
  const l = E.createLife({ mode: o.mode || 'vn', seed: o.seed || 9125, year: 1990, country: o.country });
  Object.assign(l, { age: o.age || 28, indep: true, alive: true, school: null, pending: [], sched: [], jailUntil: null, abroad: null, partner: null, exes: 0, money: l.base * 20 });
  l.flags.military = 0; if (o.soc != null) l.st.soc = o.soc; E.migrateExt(l); return l;
}
// Một lượt tìm qua đúng đường người chơi: hành động → bộ lọc → bắt đầu tìm → cách tìm.
function search(l, how) {
  const d = E.act(l, 'tim_nguoi_yeu'); if (!d) return null;
  if (d.id === 'dating108') { const s = d.opts.find(o => o.k === 'search'); if (!s) { l.pending.shift(); return 'no-search'; } E.resolve(l, 'search'); }
  if (!l.pending[0] || l.pending[0].id !== 'tim_nguoi_yeu') return 'no-tn';
  E.resolve(l, how || 'match'); return l.pending[0] || 'done';
}
function drain(l) { let g = 0; while (l.pending.length && g++ < 20) { const d = l.pending[0]; if (d.id === 'love') E.resolve(l, 'no'); else E.resolve(l, E.autoKey(l)); } }

// 1. Mười lượt mỗi năm, một nguồn đếm; mở bộ lọc không trừ; lượt 11 bị chặn trong handler; sang năm reset; reload giữ.
{
  const l = single({ seed: 912501 });
  const f = E.act(l, 'dating108'); E.resolve(l, 'age26'); ok(l.pending[0] && l.pending[0].id === 'dating108', 'filter menu reopens'); E.resolve(l, 'close');
  ok(RM.used(l) === 0, 'changing filters costs no search');
  for (let i = 0; i < 10; i++) { const r = search(l, 'match'); ok(r !== null && r !== 'no-search', 'search ' + (i + 1) + ' allowed'); drain(l); }
  ok(RM.used(l) === 10 && RM.left(l) === 0, '10 searches used');
  ok(E.actions(l).find(a => a.id === 'tim_nguoi_yeu').ok !== true, 'action explains quota exhausted');
  const d = E.act(l, 'dating108'); ok(d && !d.opts.some(o => o.k === 'search') && /10\/10/.test(d.text), 'filters still open; search hidden with count');
  l.pending = [];
  const tn = E.DEC.tim_nguoi_yeu.make(l, () => .5); tn.manual = true; l.pending = [tn]; const logs = E.resolve(l, 'match');
  ok(RM.used(l) === 10 && !l.pending.some(x => x.id === 'love'), '11th search refused in handler, nothing happens');
  const r = reload(l); ok(RM.used(r) === 10, 'reload keeps count (no reroll)');
  r.age++; ok(RM.left(r) === 10, 'new year resets quota');
}
// 2. Gặp ≠ đồng ý: người gặp qua lượt tìm có thể từ chối; nguồn khác (chuyện đời) giữ cơ chế cũ.
{
  let yes = 0, total = 0;
  for (let s = 0; s < 200; s++) { const l = single({ seed: 913000 + s }); const lv = E.DEC.love.make(l, () => .4, { where: 'qua người quen mai mối' }); lv.data.search912 = true; lv.manual = true; l.pending = [lv]; E.resolve(l, 'yes'); total++; if (l.partner) yes++; }
  ok(yes > total * 0.2 && yes < total * 0.9, 'some accept, some decline (' + yes + '/' + total + ')');
  const l = single({ seed: 913999 }); const story = E.DEC.love.make(l, () => .4, {}); l.pending = [story]; E.resolve(l, 'yes'); ok(l.partner && l.partner.status === 'dating', 'non-search love unchanged');
  const m = single({ seed: 913998 }); const lv = E.DEC.love.make(m, () => .4, {}); lv.data.search912 = true; m.pending = [lv];
  const before = RM.acceptance(m, lv.data.p); RM.state(m).streak = 3; ok(RM.acceptance(m, lv.data.p) > before, 'consecutive declines soften (no endless streak)');
  ok(RM.acceptance(m, lv.data.p) < 1, 'never guaranteed');
}
// 3. Yếu tố rõ ràng: giao tiếp, ngoại hình, khoảng cách tuổi ảnh hưởng; không có điểm theo tôn giáo/giàu nghèo cố định.
{
  const a = single({ seed: 914001, soc: 90 }), b = single({ seed: 914001, soc: 15 }); const p = { name: 'X', age: 28, sex: 'F' };
  ok(RM.acceptance(a, p) > RM.acceptance(b, p), 'better social connection helps');
  ok(RM.acceptance(a, { name: 'Y', age: 28 }) > RM.acceptance(a, { name: 'Z', age: 52 }), 'large age gap lowers acceptance');
  const keys = RM.factors(a, p).map(f => f[0]); ok(!keys.includes('religion') && !keys.includes('ethnic'), 'no religion/ethnicity factor');
}
// 4. Tuổi 60 vẫn tìm được; quyết định "love" từ lượt tìm không bị engine bỏ sau 55 tuổi.
{
  let met = 0, partners = 0;
  for (let s = 0; s < 40; s++) { const l = single({ seed: 915000 + s, age: 62 }); const r = search(l, 'match'); ok(r !== null && r !== 'no-search', 'age 62 can search'); if (l.pending[0] && l.pending[0].id === 'love') { met++; ok(l.pending[0].data.search912, 'love tagged as search'); E.resolve(l, 'yes'); if (l.partner) partners++; } }
  ok(met > 10 && partners > 0, 'older singles meet and some start dating (' + met + ' met, ' + partners + ' dating)');
}
// 5. Tuổi 16–17: vẫn dùng chung bộ đếm, nhánh tuổi teen (không vào cơ chế người lớn).
{
  const l = single({ seed: 916001, age: 17 }); l.indep = false; l.school = 'upper'; l.schoolEnd = 18;
  const d = E.act(l, 'tim_nguoi_yeu'); ok(d && d.id === 'tim_nguoi_yeu', 'teen goes straight to the teen scene');
  E.resolve(l, 'work'); ok(RM.used(l) === 1, 'teen search counted');
  ok(E.actions(l).find(a => a.id === 'network108').ok !== true, 'adult relationship network not available to minors');
}
// 6. Đang có người yêu: không tìm; tình huống cũ đang chờ trong bản lưu cũ vẫn chạy như trước.
{
  const l = single({ seed: 916101 }); l.partner = { name: 'A', sex: 'F', age: 28, status: 'dating', since: 26, alive: true };
  ok(E.actions(l).find(a => a.id === 'tim_nguoi_yeu').ok !== true, 'partnered: search not available');
  const o = single({ seed: 916102 }); delete o.flags.romance912; const lv = E.DEC.love.make(o, () => .4, {}); o.pending = [lv]; const r = reload(o); E.resolve(r, 'yes'); ok(r.partner, 'old pending love from save behaves as before');
}
// 7. Danh sách mập mờ: làm quen tốn lượt tìm, tối đa 5; làm mới có xác nhận, giữ gia đình bí mật/con/thai kỳ, 1 lần/năm.
{
  const l = single({ seed: 917001, age: 30 }); l.sex = 'M';
  E.act(l, 'network108'); for (let i = 0; i < 6; i++) { const d = l.pending[0]; ok(d && d.id === 'network108', 'network menu reopens'); if (d.opts.some(o => o.k === 'new')) E.resolve(l, 'new'); } l.pending = [];
  ok(l.flags.network108.length === 5 && RM.used(l) === 5, 'five acquaintances, each used one search');
  const sec = l.flags.network108[4]; sec.secret108 = true; sec.status = 'private';
  const p0 = l.flags.network108[0]; l.flags.pregnancy108 = { due: l.age + 1, parent: { relation108: p0.relation108, name: p0.name }, source: 'outside' };
  l.kids.push({ name: 'Bé', sex: 'F', born: l.age - 2, alive: true, coParent108: { id: l.flags.network108[1].relation108, name: l.flags.network108[1].name } });
  const ids = l.flags.network108.map(p => p.relation108);
  l.flags.actAt = {}; const d = E.act(l, 'network108'); ok(d.opts.some(o => o.k === 'reset912'), 'reset option shown'); E.resolve(l, 'reset912');
  const c = l.pending[0]; ok(c.id === 'network912_reset' && /Sẽ kết thúc 4 mối quan hệ/.test(c.text) && /Giữ nguyên 1 gia đình bí mật/.test(c.text), 'confirmation lists count and kept secret family');
  E.resolve(l, 'confirm');
  ok(l.flags.network108.length === 1 && l.flags.network108[0] === sec, 'only secret family remains');
  ok(l.flags.network912.ended.length === 4 && l.flags.network912.ended.every(p => p.status === 'ended' && ids.includes(p.relation108)), 'ended people archived with identity');
  ok(l.flags.pregnancy108 && l.flags.pregnancy108.parent.relation108 === p0.relation108 && l.kids.some(k => k.coParent108), 'pregnancy and child untouched');
  l.flags.actAt = {}; ok(RM.resetReason(l) !== true && !E.act(l, 'network108').opts.some(o => o.k === 'reset912'), 'second reset same year refused');
  E.resolve(l, 'new'); ok(l.flags.network108.length === 2 && RM.used(l) === 6, 'can meet someone new after reset (uses quota)'); l.pending = [];
  const r = reload(l); ok(r.flags.network912.ended.length === 4 && r.flags.network108.length === 2, 'reload keeps archive and active list');
  r.age++; ok(RM.resetReason(r) === true, 'reset available again next year');
}
// 8. Kết thúc từng người không cần lượt gặp; danh sách trống có trạng thái rõ.
{
  const l = single({ seed: 917101, age: 30 }); const d = E.act(l, 'network108'); E.resolve(l, 'new'); l.pending = [];
  l.flags.meet108 = { at: l.age, n: 99 }; const p = l.flags.network108[0];
  const n = E.DEC.network108_person.make(l, () => .5, { at: l.age, who: p.relation108, done: false }); n.manual = true; l.pending = [n]; E.resolve(l, 'end');
  ok(l.flags.network108.length === 0 && l.flags.network912.ended.length === 1, 'ending works with no meets left');
  ok(RM.resetReason(l) === 'Danh sách đang trống', 'empty list explained');
}
// 9. Người cũ có thể quay lại sau ≥2 năm với cùng danh tính và tuổi đúng.
{
  let back = 0;
  for (let s = 0; s < 60 && !back; s++) {
    const l = single({ seed: 917200 + s, age: 30 }); const d = E.act(l, 'network108'); E.resolve(l, 'new'); l.pending = []; const p = l.flags.network108[0], age0 = p.age, id = p.relation108;
    const n = E.DEC.network108_person.make(l, () => .5, { at: l.age, who: id, done: false }); n.manual = true; l.pending = [n]; E.resolve(l, 'end');
    l.age += 3; l.flags.actAt = {}; E.act(l, 'network108'); for (let i = 0; i < 5; i++) { if (!l.pending[0] || l.pending[0].id !== 'network108') break; E.resolve(l, 'new'); const q = l.flags.network108.find(x => x.relation108 === id); if (q) { back++; ok(q.age === age0 + 3, 'reconnected person aged correctly'); break; } }
  }
  ok(back === 1, 'an ended acquaintance can reappear later');
}
console.log('Tình cảm 912: ' + count + ' checks passed.');
