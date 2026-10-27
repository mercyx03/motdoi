/* GĐ6 — kiểm thử tích hợp GĐ1–GĐ5 ở các điểm giao nhau. Chạy: node tests/integration-gd6.js */
'use strict';
const assert = require('assert'), fs = require('fs'), path = require('path');
const { gameContext } = require('./hardcore-isolation');
let checks = 0;
const ok = (c, m) => { assert(c, m); checks++; };

function year(E, l) {
  E.beginYear(l, { auto: true });
  let g = 0; while (l.pending.length && l.alive && g++ < 64) E.resolve(l, E.autoKey(l));
  if (l.alive) E.finishYear(l);
  g = 0; while (l.pending.length && l.alive && g++ < 64) E.resolve(l, E.autoKey(l));
  E.endYear(l);
}

// ---------- 1. Mô phỏng: chọn không làm nhảy tuổi, không có cảnh với người đã mất / sai trạng thái ----------
{
  const E = gameContext().E, X = E.UPDATE110, bad = { age: [], m130: [], obj: [], chainDead: [], single: [] };
  let applied = 0, m130 = 0, obj = 0, chains = 0;
  Object.keys(E.DEC).forEach(id => {
    const D = E.DEC[id], ap = D.apply;
    D.apply = function (l, d) {
      const a = l.age, p = l.partner; applied++;
      if (/^marriage\w+130$/.test(id)) { m130++; if (!(p && p.alive !== false && p.status !== 'dating' && d.data && d.data.who === X.uid(l, p))) bad.m130.push(id + '@' + a); }
      if (id === 'familyObjection130') { obj++; if (!(p && p.alive !== false && p.status !== 'married')) bad.obj.push(a); }
      if (/^ch144_love_/.test(id)) { chains++; if (!(p && p.alive !== false)) bad.chainDead.push(a); }
      if (/^(map_mo101|casual101)$/.test(id) && p) bad.single.push(id + '@' + a);
      const r = ap.apply(this, arguments);
      if (l.age !== a) bad.age.push(id + ' ' + a + '→' + l.age);
      return r;
    };
  });
  let lives = 0;
  for (let i = 0; i < 40; i++) { const l = E.createLife({ mode: i % 3 ? 'vn' : 'world', seed: 61000 + i * 7919, difficulty: i % 10 === 9 ? 'hardcore' : 'normal' }); E.runHeadless(l); lives++; }
  ok(bad.age.length === 0, 'chọn phương án không làm đổi tuổi (' + bad.age.slice(0, 3) + ')');
  ok(bad.m130.length === 0, 'cảnh hôn nhân chỉ với bạn đời còn sống, đã cưới, đúng người (' + bad.m130.slice(0, 3) + ')');
  ok(bad.obj.length === 0, 'gia đình phản đối chỉ với cặp chưa cưới (' + bad.obj.slice(0, 3) + ')');
  ok(bad.chainDead.length === 0, 'chuỗi hôn nhân GĐ4 không chạy khi bạn đời đã mất');
  ok(bad.single.length === 0, 'chuyện mập mờ / một đêm chỉ khi độc thân (' + bad.single.slice(0, 3) + ')');
  ok(applied > 1000 && m130 > 0, 'mô phỏng ' + lives + ' đời, ' + applied + ' lựa chọn, ' + m130 + ' cảnh hôn nhân, ' + obj + ' phản đối, ' + chains + ' lựa chọn chuỗi hôn nhân');
}

// ---------- 2. Lưu / tải giữa đời: chuỗi GĐ4 + lịch sử GĐ5 + NPC GĐ2 tiếp tục giống hệt ----------
{
  let tried = 0, withState = 0;
  for (let i = 0; i < 8; i++) {
    const A = gameContext().E, B = gameContext().E; // hai ngữ cảnh cùng trạng thái đồng hồ / Math.random
    const a = A.createLife({ mode: 'vn', seed: 72000 + i * 104729, year: 1985 }), b = B.createLife({ mode: 'vn', seed: 72000 + i * 104729, year: 1985 });
    ok(JSON.stringify(a) === JSON.stringify(b), 'hai ngữ cảnh tạo cùng một đời (#' + i + ')');
    while (a.alive && a.age < 38) { year(A, a); year(B, b); }
    if (!a.alive) continue;
    tried++;
    if ((a.flags.chains144 && a.flags.chains144.done.length + a.flags.chains144.active.length) || (a.flags.pace145 && a.flags.pace145.h.length)) withState++;
    const reloaded = B.migrate(JSON.parse(JSON.stringify(b))); // như app.js khi bấm "Tiếp tục sống"
    for (let y = 0; y < 12 && a.alive; y++) { year(A, a); year(B, reloaded); }
    ok(JSON.stringify(a) === JSON.stringify(reloaded), 'lưu / tải ở 38 tuổi rồi chơi tiếp 12 năm cho kết quả giống hệt (#' + i + ')');
  }
  ok(tried >= 5 && withState >= 3, 'đã kiểm ' + tried + ' đời, ' + withState + ' đời có dữ liệu GĐ4/GĐ5 lúc lưu');
}

// ---------- 3. Giao diện: đổi Tự động / Chỉ ngã rẽ lớn khi đang có lựa chọn ----------
{
  const app = fs.readFileSync(path.join(__dirname, '..', 'public/js/app.js'), 'utf8');
  ok(/#autoBtn'\)\.onclick = function \(\) \{[^}]*reapplyDecisionMode\(\)/.test(app) && /S\.minorOnly = !S\.minorOnly;[^\n]*reapplyDecisionMode\(\)/.test(app), 'đổi chế độ áp dụng ngay cho lựa chọn đang mở');
  ok(/function reapplyDecisionMode\(\)[\s\S]{0,400}showDecision\(\)/.test(app), 'lựa chọn đang mở được hiện lại theo chế độ mới');
}

// ---------- 4. Chế độ Tự động không đứng chờ sự kiện do hệ thống đưa tới ----------
{
  const E = gameContext().E, C = E.WORLD120;
  const l = E.createLife({ mode: 'vn', seed: 81001, year: 1995 }); l.age = 20; l.pending = [];
  ok(C.queue(l, 'weather125', E.H.rf(l), undefined, { manual: false }) && l.pending[0].manual === false, 'sự kiện hệ thống (thời tiết) không bị coi là người chơi tự mở');
  l.pending = []; C.queue(l, 'weather125', E.H.rf(l));
  ok(l.pending[0].manual === true, 'luồng người chơi tự mở vẫn giữ quyền tự chọn (mặc định cũ)');
  let systemManual = 0, systemTotal = 0;
  for (let i = 0; i < 25; i++) {
    const x = E.createLife({ mode: 'vn', seed: 82000 + i * 7919 });
    for (let y = 0; y < 90 && x.alive; y++) {
      E.beginYear(x, { auto: true }); let g = 0; while (x.pending.length && x.alive && g++ < 64) E.resolve(x, E.autoKey(x));
      if (x.alive) E.finishYear(x);
      x.pending.forEach(d => { if (/^(weather125|collectors140|abroad107_finish|crisis123|law122|patron125|bribe125)$/.test(d.id)) { systemTotal++; if (d.manual) systemManual++; } });
      g = 0; while (x.pending.length && x.alive && g++ < 64) E.resolve(x, E.autoKey(x)); E.endYear(x);
    }
  }
  ok(systemTotal > 0 && systemManual === 0, 'mô phỏng: ' + systemTotal + ' sự kiện hệ thống được xếp hàng, không cái nào chặn chế độ Tự động');
  const old = E.createLife({ mode: 'vn', seed: 83000 }); old.pending = [Object.assign(E.DEC.weather125.make(old, E.H.rf(old)), { manual: true })];
  E.migrate(old); ok(old.pending[0].manual === false, 'bản lưu cũ còn sự kiện hệ thống bị gắn nhầm được gỡ khi tải');
  const asked = E.createLife({ mode: 'vn', seed: 83001 }); asked.pending = [Object.assign(E.DEC.weather125.make(asked, E.H.rf(asked)), { manual: true, data: { requested: true } })];
  E.migrate(asked); ok(asked.pending[0].manual === true, 'lựa chọn người chơi tự bấm vẫn giữ nguyên khi tải');
  const app = fs.readFileSync(path.join(__dirname, '..', 'public/js/app.js'), 'utf8');
  ok(/if \(!byHand && !wasManual\) S\.life\.pending\.forEach\(function \(x\) \{ if \(queued0\.indexOf\(x\) < 0\) x\.manual = false; \}\);/.test(app), 'bước nối tiếp của lựa chọn AI vừa chốt được AI làm tiếp');
}

console.log('PASS integration-gd6: ' + checks + ' kiểm tra.');
