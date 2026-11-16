'use strict';
// 9.5.4: phần thừa kế của từng con (E.heirShare, dùng cho "sống tiếp đời con") phải khớp bản di sản đã chia lại
// (vợ/chồng được ít nhất 2/3 suất, phí thi hành) và phần chia tài sản ở màn cuối đời (E.ESTATE84.allocate).
const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const E = gameContext().E;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
let checked = 0, spouse = 0, company = 0;
for (let i = 0; i < 500 && checked < 40; i++) {
  const P = E.createLife({ mode: 'vn', seed: 61400 + i }); E.runHeadless(P);
  if (!P.death || P.death.age < 40 || !(E.netWorth(P) > 0) || !P.kids.some(k => k.alive)) continue;
  const A = E.ESTATE84.allocate(P), est = E.WILL70.estate(P);
  P.kids.forEach((k, idx) => {
    if (k.alive === false) return;
    const p = A.list.find(x => x.kid === idx), sh = E.heirShare(P, k), forKid = E.WILL70.forKid(P, idx);
    ok(Math.abs(sh - forKid) < 1e-9, 'heirShare bằng forKid');
    ok(Math.abs(sh - (p ? p.amount : 0)) < 1e-6 * Math.max(1, sh), 'phần của con thứ ' + idx + ' khớp phần chia ở màn cuối đời (' + sh.toFixed(1) + ' / ' + (p ? p.amount : 0).toFixed(1) + ')');
  });
  const total = est.list.concat(est.law).reduce((s, x) => s + x.amount, 0);
  ok(total <= est.net + 1e-6, 'tổng phần chia không vượt di sản ròng');
  const kidSum = P.kids.reduce((s, k, idx) => s + (k.alive === false ? 0 : E.heirShare(P, k)), 0);
  ok(kidSum <= est.net + 1e-6, 'tổng phần các con không vượt di sản ròng');
  if (P.partner && P.partner.status === 'married' && P.partner.alive !== false) spouse++;
  if (A.items.some(x => x.t === 'company137')) company++;
  checked++;
}
ok(checked >= 20, 'đủ đời để kiểm (' + checked + ')'); ok(spouse >= 3, 'có đời còn vợ/chồng khi mất (' + spouse + ')');
console.log('inherit954: ' + n + ' kiểm tra đạt (' + checked + ' đời, ' + spouse + ' còn vợ/chồng, ' + company + ' có cổ phần doanh nghiệp)');
