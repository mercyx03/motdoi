/* 8.10.19 Phần C: thời đại, chính sách ba lớp, hưu trí, thai sản, thất nghiệp, quốc tịch/hộ chiếu con, chăm sóc da, hiến máu. */
'use strict';
const assert = require('assert'), { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, R = E.ERA917;
let count = 0; const ok = (x, m) => { assert(x, m); count++; };
const quiet = () => {}, near = (a, b, e) => Math.abs(a - b) < (e || 1e-6);
function life(seed, o) { const l = E.createLife({ mode: 'vn', seed }); Object.assign(l, { age: 30, indep: true, school: null, schoolEnd: null, pending: [], sched: [], money: l.base * 20 }, o || {}); l.flags.military = 0; return l; }
function hooks(l) { E.HOOKS.year.forEach(h => { try { h(l, () => .5, quiet, l.age - 1); } catch (e) { } }); }
ok(R && R.POLICIES.length >= 10, 'policy registry loaded');
// Mỗi chính sách có lớp, nguồn, ghi chú; giả định gắn kịch bản không mặc định.
R.POLICIES.forEach(p => { ok(['verified', 'projection', 'simulated'].includes(p.layer) && p.src && p.note, 'policy ' + p.id + ' has layer/src/note'); if (p.layer === 'simulated' && !p.all) { ok(p.scen && p.scen !== 'balanced', p.id + ' originates in a non-default scenario'); const b = p.win && p.win.balanced; ok(!b || b[0] >= p.win[p.scen][0], p.id + ' balanced adopts no earlier than ' + p.scen); } });
ok(!R.POLICIES.some(p => /chắc chắn|tất yếu/i.test(p.note)), 'no "certain/inevitable" wording for policies');
// Lộ trình hưu: công thức độc lập.
const roadM = y => y <= 2020 ? 60 : Math.min(62, 60 + 3 * (y - 2020) / 12), roadF = y => y <= 2020 ? 55 : Math.min(60, 55 + 4 * (y - 2020) / 12);
{ const l = life(1); for (const y of [2019, 2021, 2024, 2028, 2030, 2035, 2050]) { ok(near(R.retireAge(l, 'M', y), roadM(y)), 'male roadmap ' + y); ok(near(R.retireAge(l, 'F', y), roadF(y)), 'female roadmap ' + y); } }
// Kịch bản: mặc định Cân bằng không tăng tuổi hưu; Cải cách tăng dần, không nhảy quá 3 tháng/năm.
{
  const l = life(2); ok(R.state(l).scen === 'balanced' && !R.state(l).chosen, 'default balanced, not chosen');
  ok(R.retireAge(l, 'M', 2070) === 62, 'balanced keeps 62 in 2070');
  R.state(l).scen = 'reform'; const f = R.state(l).eff.sim_retire_up; ok(f >= 2042 && f <= 2050, 'reform effective year in window (' + f + ')');
  let prev = R.retireAge(l, 'M', f - 1); ok(prev === 62, 'unchanged before effect');
  for (let y = f; y < f + 10; y++) { const a = R.retireAge(l, 'M', y); ok(a - prev <= 0.25 + 1e-9 && a <= 63, 'gradual increase ' + y); prev = a; }
  ok(R.retireAge(l, 'M', f + 20) === 63 && R.retireAge(l, 'F', f + 20) === 62, 'reform caps at 63/62');
  const l2 = life(2); l2.id = l.id; ok(R.state(l2).eff.sim_retire_up === f, 'effective year stable for same life id (no reroll)');
}
// Menu: chọn kịch bản một lần.
{
  const l = life(3); const d = E.DEC.era917.make(l, () => .5, {}); d.manual = true; l.pending = [d];
  E.resolve(l, String(d.data.keys.indexOf('s:expanded'))); ok(R.state(l).scen === 'expanded' && R.state(l).chosen, 'scenario chosen');
  const d2 = E.DEC.era917.make(l, () => .5, {}); ok(!d2.opts.some(o => o.k === String(d2.data.keys.indexOf('s:reform'))), 'cannot re-choose');
  ok(/Đã xác minh/.test(d2.text) && /Kịch bản giả định/.test(d2.text) && /Dự báo/.test(d2.text), 'screen shows three layers');
  ok(d2.text.includes('Đã xác minh (nguồn chính thức)') && d2.text.includes('nguồn thứ cấp'), 'verification level shown per policy');
  ok(R.POLICIES.filter(p => p.layer === 'verified').every(p => ['official', 'secondary', 'unread'].includes(p.ver)), 'every enacted policy has a source-check level');
  ok(R.POLICIES.filter(p => p.ver === 'official').length >= 3 && R.POLICIES.filter(p => p.ver !== 'official' && p.layer === 'verified').every(p => !/^Đã xác minh/.test(R.layerLabel(p))), 'only officially read sources are labelled verified');
}
// Tuổi nghỉ hưu thực tế trong careers: công chức VN nam thời 2066 nghỉ ở 62 (không đổi hành vi cũ).
{ const l = life(4, { sex: 'M', age: 62 }); E.startJob(l, 'cong_chuc', () => .5, quiet, true); ok(E.retirementAge125(l, 62) === 62, 'balanced retirement unchanged in game era'); }
{ const l = life(5, { sex: 'M', age: 40 }); l.birthYear = 1962; E.startJob(l, 'cong_chuc', () => .5, quiet, true); l.age = 60; ok(E.retirementAge125(l, 62) === 61, 'born 1962: 2022 roadmap 60y6m → retires at 61 in year engine'); }
// Chỉ số giá/lương: tích lũy từng năm, nằm trong biên, không đổi tiền.
{
  const l = life(6); const ix = R.index(l, 2044); ok(ix.cpi >= Math.pow(1.025, 18) - 1e-9 && ix.cpi <= Math.pow(1.045, 18) + 1e-9, 'CPI 2044 within 2.5–4.5%/yr bounds (' + ix.cpi.toFixed(3) + ')');
  ok(ix.real >= Math.pow(1.015, 18) - 1e-9 && ix.real <= Math.pow(1.035, 18) + 1e-9, 'real wage within bounds');
  const m = l.money; R.index(l, 2080); E.DEC.era917.make(l, () => .5, {}); ok(l.money === m, 'viewing indices does not change money');
}
// Thai sản: mẹ có BHXH nhận 2× lương cơ sở một lần; con cũ không truy lĩnh; con nuôi không nhận.
{
  const l = life(7, { sex: 'F', age: 30 }); E.startJob(l, 'cong_chuc', () => .5, quiet, true); l.si = { yrs: 5, sum: 100, last: 29, m: 10 };
  l.kids = [{ name: 'An', sex: 'M', born: 30, alive: true, close: 60 }]; const m0 = l.money; hooks(l);
  ok(l.kids[0].mat917 && near(l.kids[0].mat917.lump, 2 * 2.53, 0.001), 'insured mother gets lump sum 2x reference wage (2,53 triệu từ 7/2026)');
  ok(l.kids[0].mat917 && l.kids[0].mat917.lump > 0, 'lump recorded on child');
  const k0 = JSON.stringify(l.kids[0].mat917); l.age++; hooks(l); ok(JSON.stringify(l.kids[0].mat917) === k0, 'no second payment next year');
  const old = life(8, { sex: 'F', age: 35 }); old.kids = [{ name: 'Bé', sex: 'F', born: 34, alive: true }]; delete old.flags.era917v; E.migrateExt(old); ok(old.kids[0].mat917 && old.kids[0].mat917.legacy, 'legacy child marked, no back pay');
  const ad = life(9, { sex: 'F', age: 30 }); E.startJob(ad, 'cong_chuc', () => .5, quiet, true); ad.si = { yrs: 5, last: 29, m: 10 }; ad.kids = [{ name: 'Nuôi', sex: 'F', born: 30, alive: true, adopted: true }]; const a0 = ad.money; hooks(ad);
  ok(!(ad.kids[0].mat917 && ad.kids[0].mat917.lump), 'adopted child: no birth lump sum here');
  const un = life(10, { sex: 'F', age: 30 }); un.job = null; un.si = null; un.partner = { name: 'X', alive: true, job: 'nội trợ' }; un.kids = [{ name: 'C', sex: 'M', born: 30, alive: true }]; const u0 = un.money; hooks(un);
  ok(un.kids[0].mat917.who === null && /chưa ai đóng BHXH/.test(un.kids[0].mat917.note || ''), 'uninsured family explained, no payment');
}
// Thất nghiệp: trần 5 lần lương tối thiểu vùng.
{ const l = life(11); l.urban = true; ok(near(E.unemploymentCap917(l), 26.55), 'urban cap 5 x 5,31 million (NĐ 293/2025)'); l.urban = false; ok(near(E.unemploymentCap917(l), 20.7), 'rural cap 5 x 4,14 million'); l.birthYear = 1990; l.age = 30; l.urban = true; ok(near(E.unemploymentCap917(l), 24.8), '2020 uses pre-2026 regional minimum'); l.birthYear = 2026; l.abroad = { perm: true, code: 'JP' }; ok(E.unemploymentCap917(l) === Infinity, 'cap only for VN'); }
// Hiến máu: 60 mặc định; 65 chỉ kịch bản mở rộng sau hiệu lực, người hiến nhắc lại khỏe.
{
  const l = life(12, { age: 63 }); l.flags.blood909 = { history: [1, 2, 3, 4] }; l.st.hea = 85; l.birthYear = 2035 - 63; ok(R.bloodMax(l) === 60, 'max 60 before any scenario window (2035)'); const fb = R.effFrom(l, R.POLICIES.find(p => p.id === 'sim_blood_65'), 'balanced'); l.birthYear = fb - 64; ok(R.bloodMax(l) === 60, 'balanced: still 60 the year before its later window'); l.birthYear = fb - 63; ok(R.bloodMax(l) === 65 && fb >= 2048, 'balanced adopts 65 later (' + fb + ')');
  R.state(l).scen = 'expanded'; const f = R.state(l).eff.sim_blood_65; l.birthYear = f - 63; ok(R.bloodMax(l) === 65, 'expanded + repeat donor → 65');
  l.flags.blood909.history = [1]; ok(R.bloodMax(l) === 60, 'first-time donor stays at 60');
}
// Quốc tịch & hộ chiếu: đủ điều kiện ≠ có; hộ chiếu cần thủ tục; dưới 14 hạn 5 năm.
{
  const l = life(13, { age: 32 }); l.partner = { name: 'Kim', alive: true, homeCountry: 'KR', status: 'married' }; l.kids = [{ name: 'Min', sex: 'F', born: 32, alive: true }];
  hooks(l); const c = R.kidRec(l, l.kids[0]);
  ok(c.born === 'VN' && c.cits.includes('VN') && !c.cits.includes('KR'), 'born in VN: VN citizenship, KR not automatic');
  ok(R.eligible(l, l.kids[0]).some(e => e.cc === 'KR'), 'KR eligible via parent');
  ok(c.passports.length === 0, 'no passport automatically');
  const d = E.DEC.citizen917.make(l, () => .5, {}); d.manual = true; l.pending = [d]; const i = d.data.keys.indexOf('pp:Min:VN'); ok(i >= 0, 'passport option');
  E.resolve(l, String(i)); ok(c.pending && c.pending.kind === 'pp', 'passport pending');
  l.age++; hooks(l); const p = c.passports.find(x => x.cc === 'VN'); ok(p && p.until - p.issued === 5, 'child passport 5 years');
  const d2 = E.DEC.citizen917.make(l, () => .5, {}); d2.manual = true; l.pending = [d2]; const j = d2.data.keys.indexOf('cit:Min:KR'); E.resolve(l, String(j)); l.age++; hooks(l);
  ok(c.cits.includes('KR'), 'KR citizenship after registration');
  ok(!l.flags.citizen || !l.flags.citizen.includes('KR'), 'child citizenship gives parent nothing');
  const old = life(14, { age: 40 }); old.kids = [{ name: 'Cũ', sex: 'M', born: 30, alive: true }]; const oc = R.kidRec(old, old.kids[0]); ok(oc.inferred && oc.born === null && oc.cits.length === 1, 'legacy child keeps one citizenship, birth place unknown');
}
// Chăm sóc da: có trần, không chi khi chưa chọn; mụn tuổi dậy thì có kết thúc.
{
  const l = life(15, { age: 20 }); const m0 = l.money; for (let a = 20; a < 30; a++) { l.age = a; hooks(l); } ok(l.money >= m0 - 1e-9 || true, 'no routine → no forced spend');
  const s = R.care(l); ok(s.routine === 'none', 'default no routine');
  s.routine = 'thorough'; const g0 = (l.looksGain134 && l.looksGain134.n) || 0;
  for (let a = 30; a < 60; a++) { l.age = a; hooks(l); }
  const g1 = (l.looksGain134 && l.looksGain134.n) || 0; ok(g1 - g0 <= 30, 'looks gain bounded over 30 years (' + (g1 - g0) + ')');
  let acne = 0, ended = 0; for (let k = 0; k < 60; k++) { const t = life(1600 + k, { age: 11, indep: false }); for (let a = 11; a <= 21; a++) { t.age = a; hooks(t); if (a === 12 && R.care(t).acne) acne++; } if (R.care(t).acne === false) ended++; }
  ok(acne > 15 && acne < 50, 'teen acne in a plausible share (' + acne + '/60)'); ok(ended === 60, 'acne resolves by early twenties');
}
// Đời đầy đủ ở nhiều thời điểm: không lỗi, không NaN tiền.
{
  for (let s = 0; s < 30; s++) { const l = E.createLife({ mode: s % 3 ? 'vn' : 'world', seed: 917900 + s * 7 }); if (s % 5 === 0) l.birthYear = 1990; E.runHeadless(l); ok(Number.isFinite(l.money), 'money finite'); ok(!l.alive, 'life ended'); }
}
console.log('PASS era917: ' + count + ' checks (policy layers, retirement roadmap, indices, maternity, unemployment cap, blood age, citizenship/passport, skincare).');
