'use strict';
// 9.0.2: rà logic hàng loạt. GCSE do trường đăng ký (study-home857.js) và người nghỉ hưu nhận việc mới (careers.js).
const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, S = E.STUDY857;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
const noop = () => { };
function gb(seed, age) {
  const l = E.createLife({ mode: 'world', country: 'GB', seed, year: 2026 });
  l.city = 'London'; return l;
}
// 1. học sinh Anh: chạy cả đời không còn kẹt ở "trung học"; ai cũng có kết quả GCSE hoặc đã rời trường
{
  let stuck = 0, withGcse = 0, higher = 0;
  for (let i = 0; i < 30; i++) {
    const l = E.createLife({ mode: 'world', country: 'GB', seed: 7000 + i * 11, year: 2026 }); E.runHeadless(l);
    if (l.school === 'lower') stuck++;
    if (l.edu >= 3) higher++;
    if (l.flags.study829 && l.flags.study829.england && l.flags.study829.england.results && Object.keys(l.flags.study829.england.results).length) withGcse++;
  }
  ok(stuck === 0, 'không còn đời nào kẹt ở bậc trung học sau khi chạy hết đời (kẹt ' + stuck + '/30)');
  ok(withGcse >= 15, 'phần lớn học sinh Anh có kết quả GCSE do trường đăng ký (' + withGcse + '/30)');
  ok(higher >= 12, 'có người lên bậc cao hơn trung học (' + higher + '/30)');
}
// 2. trường đăng ký không tốn tiền của học sinh và để lại nhật ký + đăng ký đánh dấu auto
{
  const l = E.createLife({ mode: 'world', country: 'GB', seed: 7001, year: 2026 }); l.city = 'London'; l.age = 15; l.school = 'lower'; l.edu = 1; l.money = 0; l.flags.study829 = {};
  const logs = []; const m0 = l.money, did = S.autoGcse(l, t => logs.push(t));
  ok(did === true, 'trường tự cho thi GCSE khi học sinh chưa tự đăng ký'); ok(l.money === m0, 'không trừ tiền học sinh');
  ok(/trường đăng ký cho bạn dự kỳ thi GCSE/.test(logs.join('|')), 'nhật ký nói rõ trường đăng ký'); ok(l.flags.study829.england.registration.auto === true, 'ghi lại đăng ký do trường');
  ok(S.autoGcse(l, noop) === false, 'đã có kết quả thì không thi lại');
}
// 3. không đè lên lựa chọn của người chơi: chưa đến tuổi, đã chọn lộ trình Sixth Form, không phải học sinh
{
  const mk = o => { const l = E.createLife({ mode: 'world', country: 'GB', seed: 7002, year: 2026 }); l.city = 'London'; Object.assign(l, { age: 15, school: 'lower', edu: 1 }, o || {}); l.flags.study829 = {}; return l; };
  ok(S.autoGcse(mk({ age: 13 }), noop) === false, 'dưới 15 tuổi chưa thi');
  ok(S.autoGcse(mk({ school: null }), noop) === false, 'không còn đi học thì không tự thi');
  const t = mk(); t.flags.study829.track = 'ib'; ok(S.autoGcse(t, noop) === false, 'đã chọn Sixth Form thì không đè');
  const vn = E.createLife({ mode: 'vn', variant: '63', seed: 7003, year: 2026 }); Object.assign(vn, { age: 15, school: 'lower' }); ok(S.autoGcse(vn, noop) === false, 'nước khác không bị ảnh hưởng');
}
// 4. người nghỉ hưu nhận việc mới không bị "nghỉ hưu" lặp lại mỗi năm
{
  const l = E.createLife({ mode: 'world', country: 'US', seed: 7004, year: 2026 });
  Object.assign(l, { age: 68, retired: true, job: null, indep: true, money: l.base * 5 }); l.flags.retOnce = true;
  const logs = []; ok(E.startJob(l, 'kd_tap_hoa', () => .5, t => logs.push(t), false) !== false && l.job, 'nhận được việc mới');
  ok(l.retired === false, 'không còn ghi là đã nghỉ hưu khi đang làm'); ok(l.flags.afterRet >= l.age + 5, 'tuổi nghỉ hưu lần sau được lùi lại');
  ok(/quay lại làm việc/.test(logs.join('|')), 'nhật ký báo quay lại làm việc');
  const q = E.createLife({ mode: 'world', country: 'US', seed: 7005, year: 2026 }); Object.assign(q, { age: 60, retired: false, job: null }); E.startJob(q, 'kd_tap_hoa', () => .5, noop, true);
  ok(!q.flags.afterRet, 'người chưa nghỉ hưu không bị ghi afterRet');
}
// 5. chạy nhiều đời có người nghỉ hưu rồi đi làm lại: không có hai dòng "Nghỉ hưu" liên tiếp hai năm với việc làm xen giữa
{
  let bad = 0, back = 0;
  for (let i = 0; i < 60; i++) {
    const l = E.createLife({ mode: 'world', country: i % 2 ? 'US' : 'CN', seed: 922000 + i * 13, year: 2026 }); E.runHeadless(l);
    const y = l.log.filter(e => /^Nghỉ hưu, nhận lương hưu/.test(e.t)).map(e => e.a);
    for (let j = 1; j < y.length; j++) if (y[j] - y[j - 1] <= 1) bad++;
    if (l.log.some(e => /quay lại làm việc/.test(e.t))) back++;
  }
  ok(bad === 0, 'không có "Nghỉ hưu" lặp ở hai năm liền nhau (' + bad + ')');
}
// 7. trẻ em di cư cùng gia đình không bị gắn cờ cần việc làm; người lớn thì có
{
  const mk = age => { const l = E.createLife({ mode: 'world', country: 'NG', seed: 7010, year: 2026 }); l.age = age; l.job = null; l.school = null; return l; };
  const kid = mk(6); E.H.emigrate(kid, ['DE', 'Đức', 'de'], () => .5, noop); ok(!kid.flags.needJob, 'trẻ 6 tuổi đi cùng gia đình không cần việc làm');
  const adult = mk(24); E.H.emigrate(adult, ['DE', 'Đức', 'de'], () => .5, noop); ok(adult.flags.needJob === true, 'người lớn chưa có việc vẫn cần tìm việc');
}
// 8. nhân vật AI muốn đông con (theo tỷ suất sinh) vẫn được hỏi chuyện sinh thêm sau 2 con, kế hoạch mặc định không chặn
{
  const asks = (want, plan) => {
    let n = 0;
    for (let i = 0; i < 160; i++) {
      const l = E.createLife({ mode: 'world', country: 'NG', seed: 8000 + i, year: 2026 });
      Object.assign(l, { age: 34, sex: 'F', school: null, jailUntil: null, alive: true, indep: true, edu: 3 });
      l.partner = { name: 'Chinedu Obi', sex: 'M', age: 36, status: 'married', since: 26, alive: true, close: 70 };
      l.kids = [{ name: 'A Obi', sex: 'M', born: 24, alive: true }, { name: 'B Obi', sex: 'F', born: 28, alive: true }];
      l.flags.wantKids = want; if (plan) l.flags.familyPlan108 = plan;
      E.beginYear(l, { auto: true }); if (l.pending.some(d => d.id === 'kid')) n++;
    }
    return n;
  };
  const many = asks(6, { want: 2, spacing: 3 }), few = asks(2, { want: 2, spacing: 3 }), chosen = asks(6, { want: 2, spacing: 3, chosenWant874: true });
  ok(many > 0, 'muốn 6 con thì sau 2 con vẫn được hỏi (' + many + '/160)'); ok(few === 0, 'muốn 2 con thì không hỏi thêm (' + few + ')'); ok(chosen === 0, 'kế hoạch 2 con do người chơi đặt thì được tôn trọng (' + chosen + ')');
}
// 6. bản lưu cũ: trạng thái JSON vẫn chạy được
{ const l = E.createLife({ mode: 'world', country: 'GB', seed: 7006, year: 2026 }); const o = JSON.parse(JSON.stringify(l)); delete o.flags.study829; E.runHeadless(o); ok(isFinite(o.money), 'bản lưu không có study829 vẫn chạy hết đời'); }
console.log('PASS logic902: ' + n + ' checks');
