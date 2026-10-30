/* Góp ý người chơi — Mốc B: nghề nghiệp / thu nhập người thân một nguồn, hồ sơ con chi tiết, menu Gia đình & Tiền bạc 5 nhóm con. */
'use strict';
const assert = require('assert'), fs = require('fs'), path = require('path');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E;
let checks = 0;
const ok = (c, m) => { assert(c, m); checks++; };
const near = (a, b, m) => ok(Math.abs(a - b) < Math.max(1e-6, Math.abs(b) * 1e-9), m + ': ' + a + ' vs ' + b);
const clone = o => JSON.parse(JSON.stringify(o));
const companies = l => E.BUSINESS123.companies(l);
function life() {
  const l = E.createLife({ mode: 'vn', seed: 147 });
  Object.assign(l, { age: 70, edu: 5, indep: true, school: null, money: 50000, pending: [], job: null, record: 0, retired: false });
  l.flags.military = 0; l.flags.dirty = 0; delete l.flags.criminal;
  l.partner = { name: 'Hà', sex: 'F', age: 66, status: 'married', alive: true, job: 'Kế toán', inc: 20, relation108: 'rel-ha' };
  l.kids = [
    { name: 'Con An', sex: 'M', born: 30, alive: true, edu: 5, study: 80, job: 'giao_vien', rank: 1, jyrs: 0, inc: 12, close: 70, coParent108: { id: 'rel-ha', name: 'Hà', sex: 'F' } },
    { name: 'Con An', sex: 'F', born: 34, alive: true, edu: 5, study: 70, job: null, inc: 0, close: 55, coParent108: { id: 'rel-ha', name: 'Hà', sex: 'F' } },
    { name: 'Con Bình', sex: 'M', born: 60, alive: true, edu: 1, study: 72, close: 80, coParent108: { id: 'rel-old', name: 'Lan', sex: 'F' } }
  ];
  companies(l).push({ name: 'Công ty Ánh Dương', value: 10000, share: 100, sector: 'tech', governance: 0, created: 30, roles: { ceo: { kind: 'pro', skill: .85 } } });
  return l;
}
function pick(l, id, key, arg) { const d = E.DEC[id].make(l, () => 0, arg), k = d.data.keys.indexOf(key); assert(k >= 0, id + ':' + key); assert(d.opts.some(o => o.k === String(k)), id + ' disabled ' + key); d.manual = true; l.pending = [d]; return E.resolve(l, String(k)); }
function appoint(l, person, role = 'ceo') {
  pick(l, 'companyRole133', 'relative', { i: 0, role });
  pick(l, 'companyFamily137', E.UPDATE110.uid(l, person), { i: 0, role });
}
const facts = (l, k) => Object.fromEntries(E.CHILD147.facts(l, k));

// ---------- B1. Bổ nhiệm con làm Tổng giám đốc: hồ sơ, thu nhập một nguồn ----------
{
  const l = life(), an = l.kids[0], twin = l.kids[1], c = companies(l)[0];
  const oldTitle = E.kidTitle(an), oldInc = an.inc;
  appoint(l, an);
  ok(c.roles.ceo.kind === 'relative' && c.roles.ceo.name === 'Con An', 'công ty ghi nhận đúng người được bổ nhiệm');
  ok(an.role147 && an.role147.rid === 'ceo', 'hồ sơ con có chức vụ ngay sau khi bổ nhiệm');
  ok(/Tổng giám đốc/.test(E.kidTitle(an)) && /Ánh Dương/.test(E.kidTitle(an)), 'tên công việc hiện chức vụ và công ty: ' + E.kidTitle(an));
  ok(!twin.role147 && E.kidTitle(twin) === '', 'người con trùng tên không bị gán nhầm chức vụ');
  const pay = E.BUSINESS133.pay(l, c, 'relative');
  near(an.inc, pay / 12, 'thu nhập hằng tháng bằng lương công ty trả');
  ok(an.inc !== oldInc + pay / 12, 'không cộng lương cũ với lương mới');
  near(E.BUSINESS133.effects(l, c).cost, pay, 'công ty chi lương đúng một lần');
  const f = facts(l, an);
  ok(/Tổng giám đốc/.test(f['Công việc chính']) && f['Nơi làm việc'] === 'Công ty Ánh Dương', 'hồ sơ: công việc chính + nơi làm việc');
  ok(f['Nghề trước khi nhận chức'] === oldTitle, 'hồ sơ giữ nghề cũ để biết con từng làm gì');
  ok(E.CAREER147.career(l, an).kind === 'role', 'bộ đọc nghề nghiệp chung trả về chức vụ');
  // Nhiều năm trôi qua: nghề cũ không tự thăng chức, lương vẫn đúng một nguồn
  for (let y = 0; y < 6; y++) { l.age++; E.finishYear(l); l.pending = []; }
  ok(an.rank === 1 && an.role147, 'nghề cũ đứng yên khi đang điều hành công ty');
  near(an.inc, E.BUSINESS133.pay(l, c, 'relative') / 12, 'thu nhập theo lương công ty sau nhiều năm');
  // Lưu và tải lại
  const back = E.migrate(clone(l));
  ok(/Tổng giám đốc/.test(E.kidTitle(back.kids[0])) && !back.kids[1].role147, 'tải lại: chức vụ đúng người');
  // Miễn nhiệm
  pick(l, 'companyRole133', 'none', { i: 0, role: 'ceo' });
  ok(!an.role147 && an.job === 'giao_vien' && an.rank === 1, 'miễn nhiệm: trở lại nghề cũ');
  near(an.inc, E.kidIncome(l, an), 'miễn nhiệm: thu nhập theo nghề cũ');
  ok(E.kidTitle(an) === oldTitle, 'miễn nhiệm: tên công việc về như cũ');
  ok(l.log.some(e => /thôi giữ chức/.test(e.t)), 'nhật ký ghi lại việc thôi chức');
}
// Người không có nghề trước đó, bạn đời được bổ nhiệm, người đã mất
{
  const l = life(), twin = l.kids[1], c = companies(l)[0];
  appoint(l, twin, 'cfo');
  ok(/Giám đốc tài chính/.test(E.kidTitle(twin)), 'con chưa có việc vẫn hiện chức vụ');
  pick(l, 'companyRole133', 'pro', { i: 0, role: 'cfo' });
  ok(!twin.role147 && !twin.job && twin.inc === 0, 'thôi chức: không bịa ra nghề cũ');
  const before = l.partner.inc;
  appoint(l, l.partner, 'coo');
  near(l.partner.inc, E.BUSINESS133.pay(l, c, 'relative') / 12, 'bạn đời: một khoản lương');
  pick(l, 'companyRole133', 'none', { i: 0, role: 'coo' });
  ok(l.partner.inc === before && !l.partner.role147, 'bạn đời thôi chức: thu nhập cũ khôi phục');
  appoint(l, l.kids[0]); l.kids[0].alive = false; l.age++; E.finishYear(l); l.pending = [];
  ok(!c.roles.ceo || c.roles.ceo.kind !== 'relative', 'người đã mất không còn giữ chức');
}

// ---------- B2. Hồ sơ con chi tiết, ổn định ----------
{
  const l = life(), binh = l.kids[2];
  const a = facts(l, binh), b = facts(l, binh);
  ok(JSON.stringify(a) === JSON.stringify(b), 'mở hồ sơ nhiều lần không đổi dữ liệu');
  ['Sức khỏe', 'Dị ứng', 'Lớp', 'Học lực', 'Hạnh kiểm', 'Tiền tiết kiệm', 'Trợ cấp', 'Quà / tiền được tặng', 'Tài sản riêng', 'Tài sản thừa kế'].forEach(k => ok(a[k] != null, 'hồ sơ có mục ' + k));
  ok(a['Lớp'] === 'Lớp ' + (70 - 60 - 5), 'lớp học theo tuổi');
  ok(Object.keys(a).some(k => /Thân thiết · (Bố|Mẹ) \(bạn\)/.test(k)), 'độ thân với người chơi');
  ok(a['Thân thiết · Mẹ Lan'] != null, 'độ thân với mẹ ruột (cha/mẹ kia)');
  ok(a['Thân thiết · Mẹ kế Hà'] != null, 'độ thân với mẹ kế (bạn đời hiện tại không phải mẹ ruột)');
  ok(Object.keys(a).filter(k => /Anh chị em/.test(k)).length === 2, 'độ thân với từng anh chị em');
  ok(facts(l, l.kids[0])['Thân thiết · Mẹ kế Hà'] == null, 'con chung không bị gọi là con riêng');
  const back = E.migrate(clone(l));
  ok(JSON.stringify(facts(back, back.kids[2])) === JSON.stringify(a), 'tải lại bản lưu: hồ sơ giữ nguyên');
  // Bản lưu cũ chưa có dữ liệu hồ sơ
  const old = clone(l); old.kids.forEach(k => delete k.profile147);
  const o = E.migrate(old);
  ok(facts(o, o.kids[2])['Dị ứng'] === a['Dị ứng'], 'bản lưu cũ: thông tin bổ sung tạo theo danh tính, không ngẫu nhiên');
  // Ký ức chuyến du lịch
  E.CHILD147.remember(l, binh, 'Đi biển Nha Trang cùng gia đình', 'good');
  ok(/Nha Trang/.test(facts(l, binh)['Kỷ niệm, cột mốc']), 'kỷ niệm được ghi vào hồ sơ');
  for (let i = 0; i < 40; i++) E.CHILD147.remember(l, binh, 'Kỷ niệm ' + i);
  ok(binh.profile147.memories.length === 20, 'giới hạn số kỷ niệm lưu');
  // Dị ứng xuất hiện với một phần nhỏ trẻ em, không phải mọi trẻ
  let allergic = 0; for (let i = 0; i < 300; i++) { const k = { name: 'Bé ' + i, born: 60, alive: true, uid110: 'k' + i }; E.CHILD147.once(l, k); if (k.profile147.allergy) allergic++; }
  ok(allergic > 10 && allergic < 80, 'tỉ lệ dị ứng hợp lý: ' + allergic + '/300');
}

// ---------- B3 / B4. Menu nhóm con ----------
{
  const M = E.MENU147, seen = new Map();
  ok(M.subs(M.FAMILY).length === 5 && M.subs(M.MONEY).length === 5, 'mỗi menu có đúng 5 nhóm con');
  for (const [mode, age, money] of [['vn', 18, 10], ['vn', 30, 500], ['vn', 45, 5000], ['vn', 70, 50000], ['world', 35, 800]]) {
    const l = E.createLife({ mode, seed: 7 + age, year: 1980 }); Object.assign(l, { age, indep: true, school: null }); l.money = l.base * money;
    const acts = E.actions(l), built = M.build(acts, E.SPEND_ACTS);
    const count = Object.values(built.groups).reduce((s, x) => s + x.length, 0);
    ok(count === acts.length, mode + ' ' + age + ': không mất và không nhân đôi hành động (' + count + '/' + acts.length + ')');
    acts.forEach(x => seen.set(x.id, x.g));
    Object.keys(built.subs).forEach(top => {
      ok([M.FAMILY,M.MONEY,'Đời sống','Học tập & công việc','Giải trí & sáng tạo'].includes(top), 'các nhóm con thuộc menu hiện hành');
      const placed = new Set(); Object.values(built.subs[top]).forEach(list => list.forEach(x => placed.add(x)));
      built.groups[top].forEach(x => ok(placed.has(x), x.id + ' nằm trong một nhóm con'));
    });
    if (built.subs[M.MONEY]) E.SPEND_ACTS.forEach(id => { const x = acts.find(a => a.id === id); if (x) ok(Object.values(built.groups).some(rows=>rows.some(a=>a.id===x.id)), id + ' vẫn có trong Chi tiêu & sinh hoạt'); });
  }
  // Mọi hành động trước đây thuộc nhóm tình cảm / gia đình / tiền bạc đều được xếp vào nhóm con
  [...seen].filter(([, g]) => /^(Tình cảm|Tình cảm & gia đình|Gia đình|Tiền bạc)$/.test(g)).forEach(([id, g]) => ok(M.place({ id, g }), id + ' (' + g + ') có nhóm con'));
  ['residence146', 'parentsHome146', 'custody129', 'familyTrip114', 'bank112', 'market_menu', 'homes112', 'mua_xe', 'cau_hon', 'sinh_con'].forEach(id => ok(M.place({ id, g: seen.get(id) }), id + ' có chỗ trong menu mới'));
  ok(M.place({ id: 'cau_hon' })[1] === '1. Tình yêu & hôn nhân' && M.place({ id: 'bank112' })[1] === '7. Ngân hàng & vay vốn' && M.place({ id: 'familyTrip114' })[1] === '5. Hoạt động & sự kiện gia đình', 'xếp đúng ý nghĩa');
  const app = fs.readFileSync(path.join(__dirname, '../public/js/app.js'), 'utf8');
  ok(/E\.MENU147, SPEND = M\.MONEY/.test(app) && /data-asub=""/.test(app) && /mkn\.actsub/.test(app), 'giao diện dùng nhóm con, có nút quay lại menu cha và ghi nhớ lựa chọn');
  ok(/subSel === SPENDSUB \? recurHtml/.test(app), 'chi tiêu định kỳ nằm trong Chi tiêu & sinh hoạt');
  ok(/E\.CHILD147\.facts/.test(app), 'trang hồ sơ con dùng dữ liệu hồ sơ chi tiết');
  ok(/life147\.js/.test(fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8')), 'index.html nạp life147');
}
console.log('feedback-b: ' + checks + ' checks passed');
