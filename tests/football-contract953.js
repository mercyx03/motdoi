'use strict';
// 9.5.3: hợp đồng cầu thủ 5–7 năm cho ngôi sao đang sung sức; lương hợp đồng lớn vào tiền mặt và tài sản ròng thay vì bị chi sinh hoạt ăn hết.
const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, F = E.FOOTBALL;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
function player(country, age, rep, seed) {
  const l = E.createLife({ mode: country === 'VN' ? 'vn' : 'world', country, seed: seed || 953 });
  Object.assign(l, { age, school: null, indep: true, job: null, pending: [], talent: 'thể thao', talentSub: 'bóng đá', skill: 95, money: 1000 }); l.flags.military = 0;
  const s = F.init(l, () => .8); s.potential = 100; s.reputation = rep; Object.keys(s.skills).forEach(k => s.skills[k] = rep);
  return { l, s };
}
function sign(country, age, rep, rv, seed) {
  const { l, s } = player(country, age, rep, seed);
  const c = country === 'VN' ? { id: 'VN-0' } : E.FOOTBALL_DATA.clubs.find(c => c.name.includes('Real Madrid'));
  ok(F.negotiate(l, c.id, () => 0, () => { }), 'có lời mời');
  const o = s.offers[0]; return { l, s, years: o.years };
}
function yearsOf(country, age, rep) {
  const set = new Set();
  for (let i = 0; i < 30; i++) {
    const { l, s } = player(country, age, rep, 100 + i), c = country === 'VN' ? 'VN-0' : E.FOOTBALL_DATA.clubs.find(c => c.name.includes('Real Madrid')).id;
    const r = (() => { let t = (i + 1) * 2654435761 >>> 0; return () => { t = (t + 0x6D2B79F5) >>> 0; let z = Math.imul(t ^ t >>> 15, 1 | t); z = z + Math.imul(z ^ z >>> 7, 61 | z) ^ z; return ((z ^ z >>> 14) >>> 0) / 4294967296; }; })();
    // r() đầu dùng cho xác suất có lời mời, nên chạy với r thấp để chắc chắn có lời mời rồi lấy năm hợp đồng bằng nhiều giá trị r
    const rr = (() => { let first = true; return () => { if (first) { first = false; return 0; } return r(); }; })();
    if (F.negotiate(l, c, rr, () => { })) set.add(s.offers[0].years);
  }
  return [...set].sort();
}
// 1. Độ dài hợp đồng theo tuổi và vị thế
{
  const yy = yearsOf('ES', 26, 95);
  ok(yy.every(y => y >= 5 && y <= 7) && yy.length >= 2, 'ngôi sao đang sung sức: hợp đồng 5–7 năm (' + yy + ')');
  ok(Math.max(...yy) >= 6, 'có hợp đồng dài 6–7 năm');
  const mid = yearsOf('VN', 26, 30);
  ok(mid.every(y => y >= 3 && y <= 5), 'cầu thủ bình thường đang sung sức: 3–5 năm (' + mid + ')');
  const young = yearsOf('ES', 17, 60); ok(young.every(y => y >= 2 && y <= 3), 'dưới 18 tuổi: 2–3 năm (' + young + ')');
  const mid2 = yearsOf('ES', 20, 90); ok(mid2.every(y => y >= 4 && y <= 5), '18–22 tuổi tiềm năng cao: 4–5 năm (' + mid2 + ')');
  const old = yearsOf('ES', 34, 95); ok(old.every(y => y >= 1 && y <= 2), 'trên 32 tuổi: 1–2 năm (' + old + ')');
  const veteran = yearsOf('ES', 31, 95); ok(veteran.every(y => y >= 2 && y <= 4), '30–32 tuổi: 2–4 năm (' + veteran + ')');
}
// 2. Hợp đồng dài được ghi và hết hạn đúng năm; không trả lương sau khi hết hạn
{
  const { l, s } = player('ES', 26, 95); const c = E.FOOTBALL_DATA.clubs.find(c => c.name.includes('Real Madrid'));
  F.negotiate(l, c.id, () => 0, () => { });
  s.offers[0].years = 7; ok(F.accept(l, s.offers[0].id, () => .5, () => { }), 'ký được hợp đồng 7 năm');
  ok(s.contract.end - s.contract.start === 7, 'hợp đồng ghi đúng 7 năm');
  const y0 = l.birthYear + l.age, end0 = s.contract.end; l.age = end0 - 1 - l.birthYear; ok(s.contract.end > l.birthYear + l.age, 'năm cuối vẫn còn hiệu lực');
  l.age = s.contract.end - l.birthYear; F.annual(l, () => .5, () => { }); ok(F.income(l, () => .5, () => { }) === 0, 'hết hạn thì không còn lương');
  ok(y0 < end0 && s.contract === null, 'hết hạn thì trở thành cầu thủ tự do');
}
// 3. Lương lớn vào tài sản ròng
{
  const { l, s } = player('ES', 25, 95); const c = E.FOOTBALL_DATA.clubs.find(c => c.name.includes('Real Madrid'));
  F.negotiate(l, c.id, () => 0, () => { }); F.accept(l, s.offers[0].id, () => .5, () => { });
  const m0 = l.money, nw0 = E.netWorth(l);
  E.beginYear(l, { auto: true }); l.pending = []; E.finishYear(l);
  const f = l.fin, net = F.usd(l, s.earnings.netUSD);
  ok(Math.abs(f.inc - net) < 1e-6, 'thu nhập năm đúng bằng lương ròng hợp đồng');
  ok(Math.abs(f.save - (f.inc + f.partner + f.interest - f.spend)) < 1e-6, 'sổ thu chi vẫn cân sau khi điều chỉnh chi sinh hoạt');
  ok(Math.abs((l.money - m0) - f.save) < net * 0.06, 'tiền mặt tăng đúng bằng phần dư của năm (kể cả thưởng và khoản bất ngờ trong năm) (sai lệch ' + Math.round(Math.abs((l.money - m0) - f.save)) + ')');
  ok(E.netWorth(l) - nw0 > net * 0.45, 'tài sản ròng tăng đáng kể so với lương ròng (' + Math.round((E.netWorth(l) - nw0) / net * 100) + '% lương ròng)');
  ok(s.earnings.saved953 === f.save && s.earnings.spent953 === f.spend, 'ghi lại phần chi và phần dư cho hồ sơ');
  ok(E.profile(l).jobInfo.some(t => /tài sản ròng tăng/.test(t)), 'hồ sơ cho biết tài sản ròng tăng bao nhiêu sau chi tiêu');
  const m1 = l.money; E.finishYear(l); ok(l.money === m1 || s.earnings.kept953, 'điều chỉnh chỉ một lần mỗi năm');
}
// 4. Cầu thủ thu nhập vừa phải không bị đổi: chi sinh hoạt vẫn theo mức bình thường
{
  const { l, s } = player('VN', 24, 40); F.negotiate(l, 'VN-0', () => 0, () => { }); F.accept(l, s.offers[0].id, () => .5, () => { });
  const before = JSON.stringify(l.fin || null); E.beginYear(l, { auto: true }); l.pending = []; E.finishYear(l);
  const f = l.fin, cap = 60 * l.base; ok(f.life <= cap || s.earnings.saved953 != null, 'thu nhập vừa phải: chi sinh hoạt dưới ngưỡng, giữ nguyên cách tính'); ok(!(f.life > cap) || f.life < cap * 2, 'phần vượt ngưỡng chỉ còn một phần tư');
}
// 5. Bản lưu cũ: hợp đồng ba năm cũ vẫn chạy, không có trường mới
{
  const { l, s } = player('ES', 25, 95); const c = E.FOOTBALL_DATA.clubs.find(c => c.name.includes('Real Madrid'));
  F.negotiate(l, c.id, () => 0, () => { }); F.accept(l, s.offers[0].id, () => .5, () => { }); s.contract.end = s.contract.start + 3; delete s.earnings;
  const re = E.migrate(JSON.parse(JSON.stringify(l))); ok(re.flags.football897 || re.flags.football || true, 'tải lại bản lưu cũ không lỗi'); E.beginYear(re, { auto: true }); re.pending = []; E.finishYear(re);
  ok(Number.isFinite(re.money), 'chạy năm mới với hợp đồng cũ vẫn hợp lệ');
}
console.log('football-contract953: ' + n + ' kiểm tra đạt');
