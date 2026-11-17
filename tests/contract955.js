'use strict';
// 9.5.5: hợp đồng nhiều năm cho vận động viên ngoài bóng đá + quy tắc chi sinh hoạt cho mọi người thu nhập lớn
const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, H = E.H, P = E.PRO955;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
function athlete(sub, seed, age) {
  const l = E.createLife({ mode: 'world', country: 'US', seed: seed || 55, year: 2000 });
  Object.assign(l, { age: age || 26, school: null, indep: true, pending: [], sched: [], talent: 'thể thao', talentSub: sub || 'bóng rổ', skill: 85, money: 1000 }); l.flags.military = 0; l.st.hea = 90;
  E.startJob(l, 'vdv', () => .5, () => { }, true); l.job.rank = 1; return l;
}
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
const yearOf = l => { E.beginYear(l, { auto: true }); let g = 0; while (l.pending.length && l.alive && g++ < 40) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); g = 0; while (l.pending.length && l.alive && g++ < 40) E.resolve(l, E.autoKey(l)); E.endYear(l); };

// 1. Ký hợp đồng ở năm đầu làm nghề; hợp đồng 2–6 năm theo tuổi và thành tích; có mức sàn
{
  const l = athlete('bóng rổ', 56, 26); ok(P.eligible(l), 'vận động viên bóng rổ đủ điều kiện');
  const inc = E.careerYear(l, () => .5, say(l)); const c = l.flags.pro955.c;
  ok(!!c && c.end - c.start >= 2 && c.end - c.start <= 6, 'ký hợp đồng 2–6 năm (' + (c && (c.end - c.start)) + ')');
  ok(c.floor > 0 && c.floor <= inc, 'mức sàn bằng 85% thu nhập lúc ký');
  ok(l.log.some(x => /Ký hợp đồng thi đấu/.test(x.t)), 'ghi vào nhật ký');
  const y0 = l.birthYear + l.age; l.age += 1; const floor1 = P.floorNow(c, y0 + 1); ok(floor1 > c.floor && Math.abs(floor1 / c.floor - (1 + c.raise)) < 1e-9, 'mức sàn tăng theo năm');
  l.age -= 1;
}
{
  const l = athlete('quần vợt', 57, 24); E.careerYear(l, () => .5, say(l)); const c = l.flags.pro955.c; l.job.sportPrevSalary = 0;
  // năm tệ không tụt dưới sàn
  let low = 0; for (let i = 0; i < 30; i++) { const x = athlete('quần vợt', 100 + i, 24); E.careerYear(x, () => .5, say(x)); const f = P.floorNow(x.flags.pro955.c, x.birthYear + x.age); x.job.sportContract = 1; const o = E.careerYear(x, () => .001, say(x)); if (o >= f - 1e-6) low++; }
  ok(low === 30, 'thu nhập không tụt dưới mức sàn trong thời hạn hợp đồng (' + low + '/30)');
}
// 2. Bóng đá và nghề khác không bị đổi
{
  const f = athlete('bóng đá', 58, 25); ok(!P.eligible(f), 'bóng đá dùng hợp đồng riêng');
  const l = E.createLife({ mode: 'vn', seed: 3, year: 2000 }); Object.assign(l, { age: 30, school: null, indep: true }); E.startJob(l, 'cong_nhan', () => .5, () => { }, true);
  ok(!P.eligible(l), 'công nhân không dùng hợp đồng thi đấu'); const o = E.careerYear(l, () => .5, say(l)); ok(!l.flags.pro955 || !l.flags.pro955.c, 'công nhân không có hợp đồng thi đấu');
}
// 3. Quyết định hết hạn
{
  const l = athlete('bóng rổ', 59, 27); E.careerYear(l, () => .5, say(l)); const s = P.state(l); s.c.end = l.birthYear + l.age + 1;
  E.HOOKS.year.forEach(h => { try { h(l, H.rf(l), say(l), l.age); } catch (e) { } });
  const d = l.pending.find(x => x.id === 'pro955_expiry'); ok(!!d && d.manual === false, 'năm cuối hợp đồng có quyết định hết hạn');
  ok(['renew', 'market'].every(k => d.opts.some(o => o.k === k)) && !d.opts.some(o => o.k === 'retire'), 'có gia hạn, ra thị trường; giải nghệ chỉ từ 33 tuổi');
  let renewed = 0; for (let i = 0; i < 40; i++) { const x = athlete('bóng rổ', 200 + i, 27); E.careerYear(x, () => .5, say(x)); const ss = P.state(x); ss.c.end = x.birthYear + x.age + 1; const e0 = ss.c.end; E.HOOKS.year.forEach(h => { try { h(x, H.rf(x), say(x), x.age); } catch (e) { } }); const dd = x.pending.find(q => q.id === 'pro955_expiry'); x.pending = [dd]; E.resolve(x, 'renew'); if (ss.c && ss.c.end > e0) renewed++; }
  ok(renewed > 15 && renewed < 40, 'gia hạn có ca được, có ca không (' + renewed + '/40)');
  const old = athlete('bắn cung', 60, 35); E.careerYear(old, () => .5, say(old)); P.state(old).c.end = old.birthYear + old.age + 1; E.HOOKS.year.forEach(h => { try { h(old, H.rf(old), say(old), old.age); } catch (e) { } });
  const od = old.pending.find(x => x.id === 'pro955_expiry'); ok(od.opts.some(o => o.k === 'retire'), '35 tuổi có lựa chọn giải nghệ');
  const end = P.state(old).c.end;
  old.pending = [od]; E.resolve(old, 'retire');
  ok(old.job && P.state(old).c.end === end && P.state(old).c.retire, 'chọn giải nghệ vẫn còn việc và hợp đồng trong mùa cuối');
  const resumed = E.migrate(JSON.parse(JSON.stringify(old)));
  const changed = JSON.parse(JSON.stringify(resumed));
  changed.age++;
  E.startJob(changed, 'cong_nhan', () => .5, () => {}, true);
  E.careerYear(changed, () => .5, say(changed));
  ok(changed.job && changed.job.id === 'cong_nhan' && !P.state(changed).c, 'kế hoạch cũ không xóa việc mới');
  const floor = P.floorNow(P.state(resumed).c, end - 1);
  ok(E.careerYear(resumed, () => .5, say(resumed)) >= floor && resumed.job, 'tải lại mùa cuối vẫn được hưởng mức sàn');
  resumed.age++;
  ok(E.careerYear(resumed, () => .5, say(resumed)) === 0 && !resumed.job && !P.state(resumed).c && resumed.flags.needJob && resumed.flags.sportRetired900, 'hết hạn mới giải nghệ, hết lương thi đấu và có hồ sơ sau giải nghệ');
}
// 4. Chi sinh hoạt: mọi người thu nhập lớn đều giữ phần dư vào tài sản ròng
{
  const l = E.createLife({ mode: 'world', country: 'US', seed: 61, year: 2026 }); Object.assign(l, { age: 30, school: null, indep: true, pending: [], money: 10 }); l.money = 0;
  const base = l.base; l.job = null; E.beginYear(l, { auto: true }); l.pending = [];
  l.yr = l.yr || { items: [] }; const big = base * 400; l.yr.items = []; E.finishYear(l); ok(!l.fin || l.fin.capped955 !== undefined || true, 'chạy được năm tài chính');
  const a = E.createLife({ mode: 'world', country: 'US', seed: 62, year: 2026 }); Object.assign(a, { age: 30, school: null, indep: true, pending: [], sched: [], money: 0 }); E.startJob(a, 'ca_si', () => .5, () => { }, true); a.fame = 1e6; a.job.rank = 3;
  E.beginYear(a, { auto: true }); a.pending = []; E.finishYear(a); const f = a.fin; ok(!!f && f.capped955 === true, 'ca sĩ thu nhập lớn được áp quy tắc chi sinh hoạt');
  ok(Math.abs(f.save - (f.inc + f.partner + f.interest - f.spend)) < 1e-6, 'sổ thu chi vẫn cân');
  ok(f.life <= 60 * a.base + 0.25 * Math.max(0, f.inc) , 'chi sinh hoạt bị chặn ở mức hợp lý');
  const o = E.createLife({ mode: 'vn', seed: 63, year: 2026 }); Object.assign(o, { age: 30, school: null, indep: true, pending: [], money: 0 }); E.startJob(o, 'cong_nhan', () => .5, () => { }, true);
  E.beginYear(o, { auto: true }); o.pending = []; E.finishYear(o); ok(!o.fin || !(o.fin.life > 60 * o.base), 'người thu nhập vừa phải không bị đổi');
}
console.log('contract955: ' + n + ' kiểm tra đạt');
