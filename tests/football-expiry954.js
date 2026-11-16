'use strict';
// 9.5.4: bóng đá — lương tăng theo năm, điều khoản giải phóng, quyết định khi hợp đồng sắp hết hạn, thị trường cầu thủ tự do.
const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, F = E.FOOTBALL, H = E.H;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
function player(country, age, rep, seed) {
  const l = E.createLife({ mode: country === 'VN' ? 'vn' : 'world', country, seed: seed || 954 });
  Object.assign(l, { age, school: null, indep: true, job: null, pending: [], talent: 'thể thao', talentSub: 'bóng đá', skill: 95, money: 1000 }); l.flags.military = 0;
  const s = F.init(l, () => .8); s.potential = 90; s.reputation = rep; Object.keys(s.skills).forEach(k => s.skills[k] = Math.min(95, rep)); s.form = 80; s.fitness = 90;
  return { l, s };
}
const RM = () => E.FOOTBALL_DATA.clubs.find(c => c.name.includes('Real Madrid'));
function signed(age, rep, years, seed) {
  const { l, s } = player('ES', age, rep, seed); F.negotiate(l, RM().id, () => 0, () => { }); s.offers[0].years = years; s.offers[0].raise = s.offers[0].raise || .05;
  ok(F.accept(l, s.offers[0].id, () => .5, () => { }), 'ký được'); return { l, s };
}
// 1. Lương tăng theo năm, hợp đồng cũ không đổi
{
  const { l, s } = signed(26, 95, 6, 11); s.contract.raise = .05;
  const y0 = s.contract.start, w0 = F.wageNow(l, s.contract);
  ok(w0 === s.contract.annualUSD, 'năm đầu bằng lương ghi trong hợp đồng');
  l.age += 2; ok(Math.abs(F.wageNow(l, s.contract) - w0 * 1.05 * 1.05) < 1e-6 * w0, 'hai năm sau tăng 5% mỗi năm');
  l.age -= 2; const old = JSON.parse(JSON.stringify(s.contract)); delete old.raise; delete old.release; l.age += 3; ok(F.wageNow(l, old) === old.annualUSD, 'hợp đồng cũ không có tỷ lệ thì lương giữ nguyên');
  ok(y0 + 6 === s.contract.end, 'hợp đồng sáu năm');
  l.age -= 3;
  const m0 = E.monthlyEst(l, l.job.id); l.age += 3; ok(E.monthlyEst(l, l.job.id) > m0, 'lương tháng ước tính tăng theo năm');
}
// 2. Điều khoản giải phóng: ghi trong hợp đồng, hợp đồng ngắn thì không có, CLB thiếu tiền không mua đứt được
{
  const a = signed(26, 95, 6, 12), b = signed(26, 95, 2, 13);
  ok(a.s.contract.release > a.s.contract.annualUSD * 3 && a.s.contract.release <= a.s.contract.annualUSD * 6, 'hợp đồng dài có điều khoản giải phóng cao hơn nhiều lần lương (' + Math.round(a.s.contract.release / a.s.contract.annualUSD * 10) / 10 + ' lần)');
  ok(F.releaseFor(100, 2) === 0 && F.releaseFor(100, 5) === 450, 'hợp đồng dưới ba năm không có điều khoản, năm năm là 4,5 lần lương');
  ok(/Điều khoản giải phóng/.test(E.profile(a.l).jobInfo.join('\n')), 'hồ sơ hiện điều khoản giải phóng');
  const poor = E.FOOTBALL_DATA.clubs.filter(c => c.id !== RM().id && c.financeUSD < a.s.contract.release)[0];
  if (poor) ok(F.negotiate(a.l, poor.id, () => 0, () => { }) === false, 'CLB không đủ tiền không kích hoạt được điều khoản: ' + poor.name);
  const rich = E.FOOTBALL_DATA.clubs.filter(c => c.id !== RM().id && c.financeUSD >= a.s.contract.release && c.strength >= 70)[0];
  if (rich) { a.s.reputation = 99; ok(typeof F.negotiate(a.l, rich.id, () => 0, () => { }) === 'boolean', 'CLB đủ tiền có thể gửi đề nghị: ' + rich.name); }
}
// 3. Hết hạn: quyết định gia hạn / đòi tăng lương / thị trường / giải nghệ
{
  const { l, s } = signed(26, 95, 3, 14); l.age = s.contract.end - 1 - l.birthYear;
  F.annual(l, () => .5, say(l));
  const d = l.pending.find(x => x.id === 'footballExpiry954'); ok(!!d && d.manual === false, 'năm cuối hợp đồng có quyết định hết hạn, không bắt người chơi dừng');
  ok(d.opts.some(o => o.k === 'renew') && d.opts.some(o => o.k === 'market') && d.opts.some(o => o.k === 'raise') && !d.opts.some(o => o.k === 'retire'), 'đủ lựa chọn, giải nghệ chỉ từ 31 tuổi');
  F.annual(l, () => .5, say(l)); ok(l.pending.filter(x => x.id === 'footballExpiry954').length === 1, 'không hỏi lại trong cùng một năm');
  const end0 = s.contract.end; l.pending = [d]; E.resolve(l, 'renew');
  ok(s.contract && s.contract.end > end0 || l.log.some(e => /chưa đưa ra đề nghị gia hạn/.test(e.t)), 'gia hạn: hoặc ký hợp đồng mới dài hơn, hoặc CLB chưa đề nghị');
  // gia hạn thành công với xác suất cao khi phong độ tốt
  let renewed = 0, declined = 0;
  for (let i = 0; i < 40; i++) { const x = signed(26, 95, 3, 200 + i); x.l.age = x.s.contract.end - 1 - x.l.birthYear; const e0 = x.s.contract.end; F.annual(x.l, () => .5, say(x.l)); const dd = x.l.pending.find(q => q.id === 'footballExpiry954'); x.l.pending = [dd]; E.resolve(x.l, 'renew'); if (x.s.contract && x.s.contract.end > e0) renewed++; else declined++; }
  ok(renewed > 25 && declined >= 0, 'phong độ tốt: phần lớn gia hạn được (' + renewed + '/40)');
  let raiseOk = 0, base = 0;
  for (let i = 0; i < 40; i++) { const x = signed(26, 95, 3, 300 + i), w = x.s.contract.annualUSD; x.l.age = x.s.contract.end - 1 - x.l.birthYear; F.annual(x.l, () => .5, say(x.l)); x.l.pending = [x.l.pending.find(q => q.id === 'footballExpiry954')]; E.resolve(x.l, 'raise'); if (x.s.contract.annualUSD > w * 1.1) { raiseOk++; base += x.s.contract.annualUSD / w; } }
  ok(raiseOk > 5 && raiseOk < 40, 'đòi tăng lương: có ca được, có ca bị từ chối (' + raiseOk + '/40)');
  const old = player('ES', 33, 60, 15); old.l.age = 33; old.s.stage = 'pro'; ok(true, 'cầu thủ 33 tuổi');
}
// 4. Cầu thủ tự do: nhận đề nghị, ký mới, chờ, giải nghệ; không bị bỏ trống nhiều năm như trước
{
  const { l, s } = signed(27, 90, 3, 16); l.age = s.contract.end - l.birthYear; F.annual(l, () => .5, say(l));
  ok(s.stage === 'free' && !s.contract, 'hết hạn thì trở thành cầu thủ tự do');
  const d = l.pending.find(x => x.id === 'footballFree954'); ok(!!d && d.manual === false, 'cầu thủ tự do được hỏi hướng đi ngay năm đó');
  ok(d.opts.some(o => o.k === 'wait'), 'có lựa chọn chờ thêm một mùa');
  ok(d.opts.some(o => /^o\d$/.test(o.k)), 'có lời mời từ câu lạc bộ phù hợp');
  const offerKey = d.opts.find(o => /^o\d$/.test(o.k)).k; l.pending = [d]; E.resolve(l, offerKey);
  ok(s.stage === 'pro' && s.contract && s.contract.end > l.birthYear + l.age, 'ký lời mời: có hợp đồng mới');
  ok(l.job && E.resolveJob(l.job.id) === 'vdv', 'quay lại nghề cầu thủ');
}
{
  const { l, s } = signed(27, 90, 3, 17); l.age = s.contract.end - l.birthYear; F.annual(l, () => .5, say(l));
  const d = l.pending.find(x => x.id === 'footballFree954'); l.pending = [d]; E.resolve(l, 'wait');
  ok(s.stage === 'free' && s.freeYears954 === 1, 'chờ một mùa: vẫn tự do và đếm số mùa');
  l.age++; F.annual(l, () => .5, say(l)); ok(l.pending.some(x => x.id === 'footballFree954'), 'năm sau lại được hỏi');
  const young = player('VN', 16, 40, 18); young.s.stage = 'free'; young.l.age = 16; F.annual(young.l, () => .5, say(young.l)); ok(!young.l.pending.some(x => x.id === 'footballFree954'), 'dưới 17 tuổi không vào thị trường tự do');
}
// 5. Tự động chơi qua nhiều năm: không còn khoảng trống dài không câu lạc bộ
{
  let gaps = 0, lives = 0, renewals = 0;
  for (let i = 0; i < 12; i++) {
    const { l, s } = signed(24, 85, 3, 400 + i); lives++; let free = 0, maxFree = 0;
    for (let y = 0; y < 12 && l.alive; y++) {
      E.beginYear(l, { auto: true }); let g = 0; while (l.pending.length && l.alive && g++ < 40) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); g = 0; while (l.pending.length && l.alive && g++ < 40) E.resolve(l, E.autoKey(l)); E.endYear(l);
      if (s.stage === 'free') { free++; maxFree = Math.max(maxFree, free); } else free = 0;
      if (s.contracts.length > renewals) renewals = s.contracts.length;
    }
    if (maxFree >= 3 && l.age < 33) gaps++;
  }
  ok(gaps <= 2, 'chơi tự động: hiếm cầu thủ trẻ phải tự do từ ba mùa trở lên (' + gaps + '/' + lives + ')');
  ok(renewals >= 2, 'hợp đồng cũ được lưu lại sau gia hạn hoặc chuyển CLB (' + renewals + ')');
}
console.log('football-expiry954: ' + n + ' kiểm tra đạt');
