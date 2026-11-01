/* Gói cố vấn thừa kế: mỗi chuyên môn tối đa +50 từ khóa 5 triệu USD (+30 gói 1 triệu), sổ ghi idempotent, migrate khóa cũ, học phí theo tỷ giá chung. */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, D = E.EDUCATION170, F = ['image', 'etiquette', 'communication', 'management', 'career', 'wealth', 'leadership'];
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
const reload = l => E.migrate(JSON.parse(JSON.stringify(l)));
function parent(o = {}) {
  const l = E.createLife({ mode: o.world ? 'world' : 'vn', country: o.world, seed: o.seed || 9126, year: 1970 });
  Object.assign(l, { age: 40, indep: true, alive: true, pending: [], jailUntil: null, abroad: null });
  l.flags.military = 0; l.money = D.usdAmount(l, 12e6); l.kids = [];
  for (let i = 0; i < (o.kids || 1); i++) l.kids.push({ name: 'Con ' + (i + 1), born: 32 - i, sex: i % 2 ? 'F' : 'M', alive: true, study: 60, close: 95 });
  E.migrateExt(l); return l;
}
const skills = k => (k.education170 && k.education170.skills) || {};
const courses = l => l.flags.expansion110.courses170;
function year(l) { l.age++; const logs = []; D.courseYear(l, () => 0.1, t => logs.push(t)); return logs; }
function enroll(l, i, tier) { return D.enrollHeir(l, E.UPDATE110.uid(l, l.kids[i]), tier || 'heir5m', () => 0.1); }

// 1. Học phí theo tỷ giá chung: VN ≈ 127 tỷ đồng, Mỹ 5 triệu USD danh nghĩa; trả đúng một lần.
{
  const l = parent(), us = parent({ world: 'US', seed: 91261 });
  ok(Math.abs(D.usdAmount(l, 5e6) - 5e6 * G.CUR.VND / 1e6) < 1e-6, 'VN fee = 5M × 25,400 đ (in million-đồng units)');
  ok(Math.abs(D.usdAmount(us, 5e6) * G.CUR.priceLevel(us.gdp) - 5e6) < 1e-3, 'US fee = 5M nominal USD');
  const m = l.money; const k = enroll(l, 0); ok(k && Math.abs(m - l.money - D.usdAmount(l, 5e6)) < 1e-6, 'fee charged once');
  year(l); ok(Math.abs(m - l.money - D.usdAmount(l, 5e6)) < 1e-6, 'no further fee during study');
}
// 2. Đủ 10 năm: mỗi chuyên môn đúng +50 từ khóa; năm 11 không cộng thêm; 9 năm chưa hoàn thành.
{
  const l = parent(), k = enroll(l, 0), kid = l.kids[0];
  for (let y = 1; y <= 9; y++) year(l);
  ok(k.status === 'active' && F.every(f => skills(kid)[f] === 32), '9 years: 70% share (32/field), not completed');
  year(l); ok(k.status === 'completed' && F.every(f => skills(kid)[f] === 50), '10 years: exactly +50 per field');
  ok(F.every(f => k.ledger912[f] === 50), 'ledger records 50 per field');
  year(l); year(l); ok(F.every(f => skills(kid)[f] === 50), 'year 11+: no extra gain');
  const r = reload(l); r.age++; D.courseYear(r, () => .1, () => {}); ok(F.every(f => skills(r.kids[0])[f] === 50), 'reload after completion: no double gain');
  ok(/đã cộng 350\/350/.test(D.heirSummary(l, k)), 'summary shows granted/max');
}
// 3. Học viên chỉ số 90: không vượt thang 100.
{
  const l = parent({ seed: 91263 }), kid = l.kids[0]; kid.education170 = { courses: [], skills: {}, history: [] }; F.forEach(f => { kid.education170.skills[f] = 90; });
  enroll(l, 0); for (let y = 1; y <= 12; y++) year(l); ok(F.every(f => skills(kid)[f] === 100), 'capped at 100');
}
// 4. Gói 1 triệu USD: +30/chuyên môn.
{
  const l = parent({ seed: 91264 }); enroll(l, 0, 'heir1m'); for (let y = 1; y <= 10; y++) year(l); ok(F.every(f => skills(l.kids[0])[f] === 30), '1M tier: +30 per field');
}
// 5. Bản lưu giữa khóa theo luật cũ (5 năm, chưa có sổ ghi): không thu phí lại, tính phần đã nhận, tổng cuối vẫn 50/chuyên môn.
{
  const l = parent({ seed: 91265 }), k = enroll(l, 0), kid = l.kids[0];
  // dựng trạng thái cũ: 4 năm đã chạy theo luật 4 điểm/năm luân phiên
  for (let y = 1; y <= 4; y++) { l.age++; k.lastAt = l.age; k.progress = y; kid.education170.skills[F[(y - 1) % 7]] = (kid.education170.skills[F[(y - 1) % 7]] || 0) + 4; }
  delete k.ledger912; delete k.done912; delete k.policy912;
  const r = reload(l), money = r.money, rk = courses(r)[0];
  for (let y = 5; y <= 10; y++) { r.age++; D.courseYear(r, () => .1, () => {}); }
  ok(r.money === money, 'migration charges nothing');
  ok(rk.status === 'completed' && F.every(f => skills(r.kids[0])[f] === 50), 'mid-course save completes at exactly 50 per field');
}
// 6. Khóa đã hoàn thành theo luật cũ: bù một lần có thông báo, không lặp; người học đã mất không được bù.
{
  const l = parent({ seed: 91266, kids: 2 }); const a = enroll(l, 0); l.kids[1].close = 95; l.kids[1].education170 = null;
  for (const [i, k] of [[0, a]]) { k.status = 'completed'; k.finished = l.age; k.progress = 10; delete k.policy912; delete k.ledger912; const kid = l.kids[i]; F.forEach((f, j) => { kid.education170.skills[f] = 15 + (j < 3 ? 8 : 4); }); }
  const b = D.enrollHeir(l, E.UPDATE110.uid(l, l.kids[1]), 'heir5m', () => .1); b.status = 'completed'; b.progress = 10; delete b.policy912; l.kids[1].alive = false;
  const comp = E.HOOKS.year.find(fn => /Bù theo chính sách mới/.test(fn.toString())), logs = [];
  comp(l, () => .1, t => logs.push(t));
  ok(logs.length === 1 && /cộng thêm/.test(logs[0]) && F.every(f => skills(l.kids[0])[f] === 50), 'old completed course topped up once to 50');
  ok(b.policy912 === 1 && !Object.keys(skills(l.kids[1])).length, 'dead learner not compensated');
  comp(l, () => .1, t => logs.push(t)); ok(logs.length === 1, 'compensation not repeated');
}
// 7. Người học mất giữa khóa: dừng, không cộng thêm; nhiều trẻ học cùng lúc độc lập.
{
  const l = parent({ seed: 91267, kids: 2 }); const a = enroll(l, 0), b = enroll(l, 1);
  ok(a && b && a.id !== b.id, 'two children enrolled');
  for (let y = 1; y <= 3; y++) year(l);
  l.kids[0].alive = false; const before = JSON.stringify(skills(l.kids[0]));
  for (let y = 4; y <= 10; y++) year(l);
  ok(a.status === 'ended' && JSON.stringify(skills(l.kids[0])) === before, 'deceased learner: course ended, no gains after death');
  ok(b.status === 'completed' && F.every(f => skills(l.kids[1])[f] === 50), 'sibling course unaffected');
}
// 8. Không tự hoàn thành chỉ vì đã đến tuổi cuối khóa: thiếu năm học thì phải học tiếp.
{
  const l = parent({ seed: 91268 }), k = enroll(l, 0); for (let y = 1; y <= 5; y++) year(l);
  l.age += 5; D.courseYear(l, () => .1, () => {}); // nhảy 5 năm (ví dụ năm bị bỏ qua) → chỉ tính 1 năm học
  ok(k.status === 'active' && k.done912 === 6, 'skipped years do not count as study years');
  for (let y = 0; y < 4; y++) year(l); ok(k.status === 'completed', 'completes after the 10th real study year');
}
// 9. Không đạt đánh giá: giữ phần đã học, không có phần 30% hoàn thành.
{
  const l = parent({ seed: 91269 }), k = enroll(l, 0); k.roll = 0.999; k.fit = 0.85;
  for (let y = 1; y <= 10; y++) year(l);
  ok(k.status === 'not-passed' && F.every(f => skills(l.kids[0])[f] === 35), 'not passed: keeps 70% (35), no completion share');
}
console.log('Gói cố vấn thừa kế: ' + count + ' checks passed.');
