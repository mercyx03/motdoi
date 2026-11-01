/* Mở rộng quan hệ người nổi tiếng: dùng contact life148, nhiều người trẻ trưởng thành, chuỗi làm quen → hẹn hò trong một năm, giữ ID, người đã kết hôn không tự bỏ gia đình. */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, CB = E.CELEB912, C = E.ELITE148;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
const reload = l => E.migrate(JSON.parse(JSON.stringify(l)));
function player(o = {}) {
  const l = E.createLife({ mode: 'vn', seed: o.seed || 9128, year: 1995 });
  Object.assign(l, { age: o.age || 28, indep: true, alive: true, pending: [], sched: [], jailUntil: null, abroad: null, partner: o.partner || null, fame: o.fame || 0, karma: 0 });
  l.flags.military = 0; l.money = l.base * 50; l.st.soc = o.soc == null ? 70 : o.soc; E.migrateExt(l); return l;
}
function open(l, id, arg) { const d = E.DEC[id].make(l, () => 0, arg); d.manual = true; d.data.requested = true; d.data.actionYear850 = l.age; l.pending = [d]; return d; }
function press(l, key) { const d = l.pending[0], i = d.data.keys.indexOf(key); assert(i >= 0, d.id + ' has ' + key + ' in ' + d.data.keys.join(',')); E.resolve(l, String(i)); return l.pending[0]; }
function has(l, key) { const d = l.pending[0]; const i = d.data.keys.indexOf(key); return i >= 0 && d.opts.some(o => o.k === String(i)); }

// 1. Danh sách: người nổi tiếng là contact life148 (uid bền), có nhiều người 18–35; mở lại không tạo thêm; năm sau gặp thêm vài người.
{
  const l = player(); open(l, 'celeb912', {});
  const list = CB.celebs(l); ok(list.length >= 3 && list.every(p => p.uid110 && C.find(l, p.uid110) === p), 'celebrities are life148 contacts with stable ids');
  open(l, 'celeb912', {}); ok(CB.celebs(l).length === list.length, 'reopening does not generate more');
  let young = 0, total = 0;
  for (let s = 0; s < 40; s++) { const m = player({ seed: 912900 + s }); CB.scout(m); CB.celebs(m).forEach(p => { total++; if (CB.age(m, p) <= 35) young++; }); }
  ok(young / total > 0.45 && young < total, 'many young adults (18–35) but older people still appear (' + young + '/' + total + ')');
  ok(CB.celebs(l).every(p => CB.age(l, p) >= 18), 'all adults');
  const ages = list.map(p => CB.age(l, p)); l.age++; open(l, 'celeb912', {}); ok(list.every((p, i) => CB.age(l, p) === ages[i] + 1), 'existing NPCs age normally, not rejuvenated');
  ok(CB.celebs(l).length > list.length, 'new people met the next year');
  const r = reload(l); ok(CB.celebs(r).map(p => p.uid110 + p.fame912 + p.marital912).join() === CB.celebs(l).map(p => p.uid110 + p.fame912 + p.marital912).join(), 'profiles stable across reload');
}
// 2. Chuỗi trong một năm: làm quen → đi chơi → trò chuyện → hẹn hò; người yêu giữ liên kết contact148; quà không nhảy cóc.
{
  let dated = 0, tries = 0;
  for (let s = 0; s < 60; s++) {
    const l = player({ seed: 913100 + s, soc: 85 }); open(l, 'celeb912', {});
    const p = CB.celebs(l).find(q => { CB.ensure(l, q); return q.marital912 === 'single' && (q.orient912 === 'bi' || (q.orient912 === 'gay' ? q.sex === l.sex : q.sex !== l.sex)); }); if (!p) continue; tries++;
    open(l, 'celebPerson912', { id: p.uid110 });
    for (let i = 0; i < 6 && l.pending[0] && l.pending[0].id === 'celebPerson912'; i++) {
      const st = p.rel912.stage;
      if (has(l, 'date')) { press(l, 'date'); break; }
      if (st === 'stranger' && has(l, 'invite')) press(l, 'invite');
      else if (has(l, 'outing')) press(l, 'outing'); else break;
    }
    if (l.partner && l.partner.contact148 === p.uid110) { dated++; ok(p.rel912.stage === 'dating' && l.partner.name === p.name, 'partner keeps the same identity'); }
  }
  ok(tries > 10 && dated > 0 && dated < tries, 'some reach dating within one year, not all (' + dated + '/' + tries + ')');
  const l = player({ seed: 913500 }); open(l, 'celeb912', {}); const p = CB.celebs(l)[0]; const rel = CB.ensure(l, p); rel.stage = 'acquaintance';
  for (let i = 0; i < 10; i++) { rel.n = 0; l.flags.celeb912.used = 0; open(l, 'celebPerson912', { id: p.uid110 }); press(l, 'gift'); }
  ok(rel.trust <= CB.BAL.giftCap && rel.stage === 'acquaintance', 'expensive gifts do not skip stages or exceed cap');
}
// 3. Giới hạn tương tác: 6 mỗi người, 10 mỗi năm, kiểm tra trong handler; sang năm reset.
{
  const l = player({ seed: 913600 }); open(l, 'celeb912', {}); const [a, b, c] = CB.celebs(l);
  open(l, 'celebPerson912', { id: a.uid110 }); for (let i = 0; i < 6; i++) press(l, a.rel912.stage === 'stranger' ? 'invite' : 'talk');
  ok(a.rel912.n === 6 && !has(l, 'talk') && !has(l, 'invite'), 'per-person limit reached');
  [b, c].forEach(p => { CB.ensure(l, p).stage = 'acquaintance'; open(l, 'celebPerson912', { id: p.uid110 }); for (let i = 0; i < 6 && has(l, 'talk'); i++) press(l, 'talk'); });
  ok(CB.left(l) === 0, 'yearly limit reached');
  const t0 = c.rel912.trust; E.DEC.celebPerson912.make(l, () => 0, { id: c.uid110 }); ok(c.rel912.trust === t0, 'no action beyond limit');
  l.age++; ok(CB.left(l) === CB.BAL.yearMax, 'next year resets');
}
// 4. Người đã kết hôn: từ chối hẹn hò; một đêm hiếm khi đồng ý; dưới 18 không có lựa chọn người lớn.
{
  const l = player({ seed: 913700 }); open(l, 'celeb912', {}); const p = CB.celebs(l)[0]; const rel = CB.ensure(l, p);
  p.marital912 = 'married'; rel.stage = 'close'; rel.trust = 95; p.orient912 = 'bi';
  open(l, 'celebPerson912', { id: p.uid110 }); press(l, 'date');
  ok(!l.partner && p.marital912 === 'married' && /đã có gia đình/.test(rel.hist.slice(-1)[0]), 'married celebrity declines and keeps family');
  const teen = player({ seed: 913701, age: 17 }); ok(E.actions(teen).find(x => x.id === 'celeb912').ok !== true, 'minors have no access');
}
// 5. Phản bội có hậu quả; tình trạng cập nhật mỗi năm đúng một lần; người yêu chia tay thì quan hệ trở lại bạn bè.
{
  const mate = { name: 'Vợ', sex: 'F', age: 28, status: 'married', since: 24, alive: true, close: 80 };
  let hit = false;
  for (let s = 0; s < 80 && !hit; s++) { const l = player({ seed: 913800 + s, partner: Object.assign({}, mate) }); l.sex = 'M'; open(l, 'celeb912', {}); const p = CB.celebs(l).find(q => q.sex === 'F'); if (!p) continue; const rel = CB.ensure(l, p); rel.stage = 'friend'; rel.trust = 60; p.openness912 = 1; p.orient912 = 'straight';
    open(l, 'celebPerson912', { id: p.uid110 }); press(l, 'night'); if (/một đêm tự nguyện/.test(rel.hist.slice(-1)[0] || '')) { ok(l.partner.close < 80 && l.karma < 0, 'infidelity affects partner and karma'); hit = true; } }
  ok(hit, 'consensual one-night path reachable');
  const l = player({ seed: 914000 }); open(l, 'celeb912', {}); const p = CB.celebs(l)[0]; CB.ensure(l, p).stage = 'dating';
  l.age++; const hook = E.HOOKS.year.find(f => /celebYear912/.test(f.toString())); hook(l); const m1 = p.marital912; hook(l);
  ok(p.marital912 === m1 && p.rel912.y === l.age, 'status changes once per year only');
  ok(p.rel912.stage === 'friend', 'dating without a matching partner falls back to friends');
}
console.log('Quan hệ người nổi tiếng: ' + count + ' checks passed.');
