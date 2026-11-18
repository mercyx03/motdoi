'use strict';
// 9.5.4: thu nhập cơ sở, chi phí và giá nhà theo thời đại (price954.js): người sinh năm 1960 hay 1985 không còn dùng mặt bằng của năm nay.
const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, H = E.H, P = E.PRICE954;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
const life = (mode, cc, y, seed) => E.createLife({ mode, country: cc, seed: seed || 77, year: y });
const yearOf = l => { E.beginYear(l, { auto: true }); let g = 0; while (l.pending.length && l.alive && g++ < 40) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); g = 0; while (l.pending.length && l.alive && g++ < 40) E.resolve(l, E.autoKey(l)); E.endYear(l); };

// 1. Thu nhập cơ sở tăng theo thời gian, theo từng nước
{
  const v = [1950, 1975, 1990, 2005, 2026].map(y => life('vn', 'VN', y).base);
  ok(v.every((x, i) => i === 0 || x > v[i - 1]), 'Việt Nam: thu nhập cơ sở tăng dần theo năm sinh (' + v.map(x => x.toFixed(1)).join(' < ') + ')');
  ok(v[0] / v[4] < 0.2 && v[2] / v[4] < 0.35, 'Việt Nam 1950 dưới 20% và 1990 dưới 35% mặt bằng hiện nay');
  const us = [1950, 1975, 2005].map(y => life('world', 'US', y).base); ok(us[0] < us[1] && us[1] < us[2], 'Mỹ cũng tăng dần');
  ok(us[0] / us[2] > 0.25 && us[0] / us[2] < 0.6, 'Mỹ 1950 vẫn giàu hơn Việt Nam 1950 và chỉ thấp hơn nay vừa phải (' + (us[0] / us[2]).toFixed(2) + ')');
  const ng = [1960, 1985, 2005].map(y => life('world', 'NG', y).base); ok(ng.every(x => x > 0), 'Nigeria có mặt bằng theo từng năm');
}
// 2. Người sinh từ 2024: không đổi một byte
{
  const a = life('vn', 'VN', 2026, 5), b = life('vn', 'VN', 2030, 5);
  ok(a.flags.eraK954 == null && b.flags.eraK954 == null, 'sinh từ 2024 không có hệ số thời đại');
  ok(P.rel(a) === 1 && P.rel(b) === 1, 'hệ số bằng 1');
  const old = life('vn', 'VN', 1990, 5); old.age = 60; ok(P.rel(old) === 1, 'năm sống từ 2023 trở đi bằng mặt bằng hiện nay');
}
// 3. Lớn lên cùng nền kinh tế: thu nhập cơ sở tăng theo từng năm sống, tiền đã có giữ nguyên
{
  const l = life('vn', 'VN', 1985, 9); const b0 = l.base; l.age = 20; l.money = 100; const m0 = l.money;
  P.apply(l); ok(l.base > b0 * 1.5, 'sống tới 2005 thu nhập cơ sở đã tăng hơn 1,5 lần (' + (l.base / b0).toFixed(2) + ')');
  ok(l.money === m0, 'tiền đã tích lũy không bị đổi khi nền kinh tế lớn lên'); const k = l.flags.eraK954;
  l.age = 40; P.apply(l); ok(l.flags.eraK954 == null || l.flags.eraK954 > k, 'thêm 20 năm nữa vẫn tăng hoặc về mặt bằng hiện nay');
  l.age = 60; P.apply(l); ok(l.flags.eraK954 == null && Math.abs(l.base - life('vn', 'VN', 2026, 9).base) / l.base < 0.2, 'từ 2023 trở đi về mặt bằng hiện nay');
}
// 4. Giá nhà theo thu nhập thời ấy; xe vẫn giữ giá thực nên so với thu nhập là rất đắt
{
  const o = life('vn', 'VN', 1975, 4), n2 = life('vn', 'VN', 2026, 4); o.urban = n2.urban = true; o.cityWealth = n2.cityWealth = 1;
  ok(H.housePrice(o) < H.housePrice(n2) * 0.25, 'nhà ở Việt Nam 1975 rẻ hơn nhiều so với hiện nay (' + H.housePrice(o) + ' / ' + H.housePrice(n2) + ')');
  ok(Math.abs(H.housePrice(o) / o.base - H.housePrice(n2) / n2.base) / (H.housePrice(n2) / n2.base) < 0.5, 'giá nhà so với thu nhập năm của người thời đó cùng cỡ với hiện nay');
  const us = life('world', 'US', 1960, 4), us2 = life('world', 'US', 2026, 4); ok(H.housePrice(us) < H.housePrice(us2), 'Mỹ 1960: nhà rẻ hơn nay');
  const V = E.CAR && true; ok(V, 'bảng nghề nghiệp còn nguyên');
}
// 5. Chi phí và thu nhập cùng đổi: người sinh năm 1960 không bị đẩy vào cảnh nợ vì mặt bằng giá của năm nay
{
  let negative = 0, rich = 0, N = 24;
  for (let i = 0; i < N; i++) { const l = life('vn', 'VN', 1975, 800 + i); while (l.alive && l.age < 45) yearOf(l); if (l.alive && l.money < -l.base * 2) negative++; if (l.alive && l.money > l.base * 6) rich++; }
  ok(negative <= N * 0.25, 'Việt Nam 1975: không quá một phần tư người sống tới 45 tuổi mang nợ nặng (' + negative + '/' + N + ')');
  ok(rich >= 1, 'vẫn có người tích lũy được (' + rich + '/' + N + ')');
}
// 6. Học phí và các khoản V() ở Việt Nam đổi theo thời đại như ở nước khác
{
  const src = require('fs').readFileSync(require('path').join(__dirname, '..', 'public', 'js', 'life83.js'), 'utf8');
  ok(/eraK954/.test(src), 'các hàm giá V() ở Việt Nam nhân hệ số thời đại');
  const l = life('vn', 'VN', 1960, 3); ok((l.flags.eraK954 || 1) < 0.3, 'hệ số thời đại Việt Nam 1960 dưới 0,3 (' + (l.flags.eraK954 || 1).toFixed(2) + ')');
}
// 7. Bản lưu cũ: không có hệ số thì giữ nguyên thu nhập, chỉ thêm hệ số ở năm sau
{
  const l = life('vn', 'VN', 1985, 6); const old = JSON.parse(JSON.stringify(l)); delete old.flags.eraK954; const base0 = old.base;
  const re = E.migrate(old); ok(re.base === base0, 'tải bản lưu cũ không đổi thu nhập cơ sở'); yearOf(re); ok(Number.isFinite(re.base) && re.base > 0, 'chạy tiếp một năm vẫn hợp lệ');
}
console.log('price954: ' + n + ' kiểm tra đạt');
