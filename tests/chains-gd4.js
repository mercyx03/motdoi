/* GĐ4 — hậu quả liên hoàn nhiều năm (public/js/life144.js). Chạy: node tests/chains-gd4.js
   Kiểm: khởi tạo đúng điều kiện, giai đoạn đúng thời điểm, không thực thi hai lần, lưu / tải, danh tính NPC,
   kết thúc chuỗi, nhân vật qua đời, tiền & quan hệ, bản lưu cũ, GĐ3 không đổi, mô phỏng nhiều năm. */
'use strict';
const assert = require('assert'), fs = require('fs'), path = require('path'), zlib = require('zlib');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, H = E.H, C = E.CHAIN144;
let checks = 0;
const paths = []; // nhánh tùy xác suất đã đi qua, in ra để biết phần nào thực sự được kiểm
const ok = (c, m) => { assert(c, m); checks++; };
const clone = o => JSON.parse(JSON.stringify(o));
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
function adult(seed, age) {
  const l = E.createLife({ mode: 'vn', seed, year: 1990 });
  Object.assign(l, { age, indep: true, school: null, schoolEnd: null, pending: [], sched: [], jailUntil: null, abroad: null });
  delete l.flags.military; l.money = l.base * 3; return l;
}
function decide(l, id, k, arg) {
  const d = E.DEC[id].make(l, H.rf(l), arg);
  ok(d.opts.some(o => o.k === k), id + ': có phương án ' + k + ' (' + d.opts.map(o => o.k) + ')');
  l.pending.unshift(d); E.resolve(l, k); return d;
}
// Chỉ chạy hook chuỗi qua từng năm cho tới khi một giai đoạn được hẹn (giữ test tất định, không lẫn sự kiện khác).
function nextStage(l, cid, years) {
  for (let i = 0; i < (years || 15); i++) {
    C.yearly(l, H.rf(l), say(l), l.age);
    const s = l.sched.find(x => x.arg && x.arg.cid === cid);
    l.age++;
    if (s) { l.sched.splice(l.sched.indexOf(s), 1); return s; }
    if (!C.chain(l, cid)) return null;
  }
  return null;
}
function grow(seed, pred, mode) {
  let snap = null;
  const l = E.createLife({ mode: mode || 'vn', seed, year: 1985 });
  E.runHeadless(l, x => { if (!snap && x.alive && pred(x)) snap = clone(x); });
  if (!snap) return null;
  delete snap.flags.chains144; snap.pending = []; snap.sched = []; snap.jailUntil = null; snap.abroad = null; delete snap.flags.military;
  return snap;
}
const chains = l => (l.flags.chains144 || { active: [], done: [] });

// ---------- 1. Giáo dục: nghỉ học → rào cản → bổ túc → bằng muộn ----------
{
  const l = adult(11, 15); l.school = 'upper'; l.fam.q = 1; l.indep = false; l.edu = 2;
  decide(l, 'nghi_hoc_ngheo', 'quit');
  let c = C.active(l, 'edu');
  ok(c && c.origin.age === 15 && c.origin.dec === 'nghi_hoc_ngheo' && c.data.edu0 === 2, 'edu: nghỉ học mở chuỗi, nhớ tuổi và lựa chọn gốc');
  const l2 = adult(12, 15); l2.school = 'upper'; l2.fam.q = 1; l2.st.kno = 90;
  const d2 = E.DEC.nghi_hoc_ngheo.make(l2, H.rf(l2)); l2.pending.unshift(d2); E.resolve(l2, 'both');
  ok(!!l2.school === !C.active(l2, 'edu'), 'edu: vẫn được đi học thì không mở chuỗi');
  l.indep = true; l.job = null;
  // Rào cản là khả năng, không bắt buộc: nếu cả khoảng 18–22 tuổi không xảy ra thì chuỗi chuyển sang cơ hội học lại.
  const lapsed = clone(l); let ls = nextStage(lapsed, c.id);
  let s = null;
  for (let tries = 0; tries < 12 && !s; tries++) {
    const x = clone(l); x.rs = (l.rs + tries * 104729) | 0; x.id = l.id + ':' + tries;
    const y = nextStage(x, c.id);
    if (y && y.id === 'ch144_edu_barrier') { s = y; Object.assign(l, x); }
    else { ls = y; ok(y && y.id === 'bo_tuc' && C.chain(x, c.id).stage === 1, 'edu: rào cản không xảy ra thì chuyển sang cơ hội học lại'); }
  }
  ok(ls === null || ls.id === 'ch144_edu_barrier' || ls.id === 'bo_tuc', 'edu: chỉ hẹn giai đoạn của chuỗi');
  ok(s && s.at >= 18 && s.at <= 22, 'edu: rào cản bằng cấp đến trong khoảng 18–22 tuổi (' + (s && s.at) + ')');
  c = C.active(l, 'edu');
  ok(c.open && c.open.at === s.at, 'edu: giai đoạn đang mở có token theo năm');
  const d = decide(l, s.id, 'ask', s.arg);
  ok(c.stage === 1 && !c.open && /Năm 15 tuổi/.test(d.text), 'edu: lời kể nhắc đúng năm nghỉ học, chuyển giai đoạn');
  l.job = { id: 'phu_ho', rank: 0, yrs: 1 };
  const s2 = nextStage(l, c.id);
  ok(s2 && s2.id === 'bo_tuc', 'edu: cơ hội học lại dùng đúng lựa chọn bổ túc sẵn có');
  decide(l, 'bo_tuc', 'thpt', s2.arg);
  ok(l.flags.gdtx && c.stage === 2, 'edu: đăng ký bổ túc → chờ nhận bằng');
  l.edu = 3; delete l.flags.gdtx;
  nextStage(l, c.id);
  ok(!C.active(l, 'edu') && chains(l).done.some(x => x.kind === 'edu' && x.result === 'returned'), 'edu: có bằng → đóng chuỗi "returned"');
  ok(l.log.filter(e => /tấm bằng tốt nghiệp phổ thông/.test(e.t)).length === 1, 'edu: dòng kết chỉ ghi một lần');
}

// ---------- 2. Nghề nghiệp: nhường suất → tìm việc → được giới thiệu ----------
{
  const l = adult(21, 32); l.edu = 5; l.st.kno = 70; E.startJob(l, 'van_phong', H.rf(l), say(l), true);
  const giu = clone(l); decide(giu, 'cs_cat_giam', 'giu');
  ok(!C.active(giu, 'career'), 'career: giữ việc thì không mở chuỗi');
  const d0 = decide(l, 'cs_cat_giam', 'nhuong');
  const c = C.active(l, 'career');
  ok(c && c.npc.name === d0.data.n && !l.job && l.lastJob, 'career: nhường suất → chuỗi nhớ đúng người đồng nghiệp');
  const s = nextStage(l, c.id);
  ok(s && s.id === 'ch144_job_search' && s.at === 33, 'career: năm sau còn thất nghiệp thì có lựa chọn tìm việc');
  const m0 = l.money; decide(l, s.id, 'retrain', s.arg);
  ok(l.money < m0 && c.data.retrained && c.stage === 1, 'career: học nghề trừ học phí đúng một lần');
  let s2 = null;
  for (let tries = 0; tries < 12 && !s2; tries++) { const x = clone(l); x.rs = (l.rs + tries * 7919) | 0; x.id = l.id + ':' + tries; const y = nextStage(x, c.id, 8); if (y) { s2 = y; Object.assign(l, x); } else ok(chains(x).done.some(z => z.kind === 'career' && z.result === 'faded'), 'career: hết hạn không gặp lại thì chuỗi khép lặng lẽ'); }
  paths.push(s2 ? 'career:referral' : 'career:faded');
  if (s2) {
    const d = decide(l, s2.id, 'accept', s2.arg);
    ok(new RegExp(d0.data.n).test(d.text) && l.job && E.resolveJob(l.job.id) === 'van_phong', 'career: người đồng nghiệp cũ giới thiệu lại đúng nghề cũ');
    const job = JSON.stringify(l.job), money = l.money;
    E.DEC[s2.id].def.opts.find(o => o.k === 'accept').run(l, H.rf(l), say(l), d.data);
    ok(JSON.stringify(l.job) === job && l.money === money, 'career: chạy lại cùng lựa chọn không có tác dụng lần hai');
  } else ok(chains(l).done.some(x => x.kind === 'career' && x.result === 'faded'), 'career: hết hạn không gặp lại thì chuỗi khép lặng lẽ');
}

// ---------- 3. Kinh doanh: vay nóng → chủ nợ → mở rộng / đóng cửa ----------
{
  let l = null;
  for (let i = 0; i < 60 && !l; i++) {
    const x = adult(300 + i, 30); E.startJob(x, 'kd_quan', H.rf(x), say(x), true); x.loans = [];
    decide(x, 'kd_vay_nong_xoay_von', 'vay_nong');
    if ((x.loans || []).some(L => L.type === 'nong')) l = x; else ok(!C.active(x, 'biz'), 'biz: trả kịp vay nóng thì không mở chuỗi');
  }
  ok(l, 'biz: tìm được ca vay nóng thành nợ');
  const c = C.active(l, 'biz');
  ok(c && c.data.loan === 'nong' && c.data.since === 30, 'biz: chuỗi gắn đúng khoản vay (loại, năm)');
  const s = nextStage(l, c.id);
  ok(s && s.id === 'ch144_biz_debt', 'biz: chủ nợ tìm đến năm sau');
  const before = l.loans.length, L = l.loans.find(x => x.type === 'nong');
  const roll = clone(l), rc = C.chain(roll, c.id); decide(roll, s.id, 'roll', s.arg);
  ok(roll.loans.length === before && rc.data.rolled, 'biz: đảo nợ không tạo khoản vay trùng');
  decide(l, s.id, 'sell', s.arg);
  ok(l.loans.length === before && L.bal <= 0.5 && c.data.cleared, 'biz: bán hàng trả dứt, không thêm khoản vay mới');
  l.loans = l.loans.filter(x => x.bal > 0.5);
  const s2 = nextStage(l, c.id);
  ok(s2 && s2.id === 'ch144_biz_crossroad', 'biz: sau khi trả xong có ngã rẽ kinh doanh');
  const d = decide(l, s2.id, 'steady', s2.arg);
  ok(d.data.clear && !C.active(l, 'biz') && chains(l).done.some(x => x.result === 'steady'), 'biz: chọn giữ quy mô → kết thúc');
  // vỡ nợ: khoản vay bị engine xóa sau khi trễ hạn → không bị kể là "đã trả xong"
  const v = adult(390, 30); E.startJob(v, 'kd_quan', H.rf(v), say(v), true);
  v.loans = [{ type: 'nong', name: 'vay nóng', bal: v.base * 0.4, rate: 1.5, minShare: .4, late: 2, since: 30 }];
  const vc = C.start(v, 'biz', { dec: 'kd_vay_nong_xoay_von', k: 'vay_nong' }, { data: { loan: 'nong', since: 30 } });
  C.yearly(v, H.rf(v), say(v), 30); v.age++; v.sched = [];
  v.loans = [];
  C.yearly(v, H.rf(v), say(v), 31);
  ok(vc.stage === 1 && !v.log.some(e => /trả dứt điểm/.test(e.t)), 'biz: vỡ nợ không bị ghi nhầm là đã trả');
}

// ---------- 4. Tài chính: vay chữa bệnh → đến hạn → trả hết ----------
{
  const l = adult(41, 35); l.fam.mAlive = true; l.loans = [];
  decide(l, 'vd_vay_chua_benh', 'ho_hang');
  const c = C.active(l, 'debt'), L = l.loans.find(x => x.type === 'family');
  ok(c && L && c.data.loan === 'family' && c.data.who, 'debt: vay họ hàng mở chuỗi nợ gắn đúng khoản vay');
  const s = nextStage(l, c.id);
  ok(s && s.id === 'ch144_debt_due' && s.at <= c.due, 'debt: đến hạn trong khoảng hẹn');
  const bal = L.bal, n = l.loans.length; l.money = bal * 2;
  const d = decide(l, s.id, 'pay', s.arg);
  ok(Math.abs(L.bal - bal / 2) < 1e-6 && l.loans.length === n, 'debt: trả một nửa đúng khoản, không tạo khoản vay mới');
  E.resolve(l, 'pay'); l.pending.unshift(d); E.resolve(l, 'pay');
  ok(Math.abs(L.bal - bal / 2) < 1e-6, 'debt: lựa chọn đã dùng không trừ tiền lần hai');
  L.bal = 0; l.loans = [];
  C.yearly(l, H.rf(l), say(l), l.age); C.yearly(l, H.rf(l), say(l), l.age + 1);
  ok(!C.active(l, 'debt') && l.log.filter(e => /trả hết khoản vay lo viện phí/.test(e.t)).length === 1, 'debt: trả hết → kết thúc, ghi một lần');
}

// ---------- 5. Gia đình: phản đối bố/mẹ đi bước nữa → xa cách → hòa giải / mất ----------
{
  const l = adult(51, 34); Object.assign(l.fam, { mAlive: true, fAlive: false, mAge: 26 }); l.flags.parentLostAt = 30;
  decide(l, 'di_buoc_nua', 'phan_doi');
  const c = C.active(l, 'family');
  ok(c && c.data.side === 'm', 'family: phản đối mẹ đi bước nữa mở chuỗi với đúng người');
  const t0 = E.NPC.relation(l, 'parent:m').trust;
  const s = nextStage(l, c.id);
  ok(s && s.id === 'ch144_fam_distance', 'family: khoảng cách xuất hiện');
  decide(l, s.id, 'visit', s.arg);
  ok(E.NPC.relation(l, 'parent:m').trust === t0 + 6, 'family: về thăm tăng tin cậy ở nguồn chuẩn GĐ2 đúng một lần');
  const l2 = clone(l); l2.fam.mAlive = false;
  C.yearly(l2, H.rf(l2), say(l2), l2.age); C.yearly(l2, H.rf(l2), say(l2), l2.age + 1);
  ok(!C.active(l2, 'family') && chains(l2).done.some(x => x.result === 'lost') && l2.log.filter(e => /chưa kịp nói ra/.test(e.t)).length === 1, 'family: mẹ mất trước khi hòa giải → khép chuỗi, ghi một lần');
  const s2 = nextStage(l, c.id);
  paths.push(s2 ? 'family:reconcile' : 'family:lapsed');
  if (s2) { decide(l, s2.id, 'reconcile', s2.arg); ok(chains(l).done.some(x => x.result === 'reconciled'), 'family: hòa giải → kết thúc'); }
  else ok(!C.active(l, 'family'), 'family: hết hạn thì khép chuỗi');
}

// ---------- 6. Hôn nhân: rạn nứt, chọn hàn gắn → khủng hoảng lòng tin ----------
let married = null;
for (let s = 600; s < 640 && !married; s++) married = grow(s, x => x.partner && x.partner.alive !== false && x.partner.status !== 'dating' && x.age >= 28 && x.age <= 45 && x.indep);
ok(married, 'marriage: có nhân vật đã kết hôn để kiểm');
{
  let l = null;
  for (let i = 0; i < 30 && !l; i++) { const x = clone(married); x.rs = (x.rs + i * 7919) | 0; const p = x.partner; decide(x, 'divorce', 'fix'); if (x.partner === p && C.active(x, 'marriage')) l = x; else ok(!C.active(x, 'marriage'), 'marriage: ly thân thì không mở chuỗi'); }
  ok(l, 'marriage: hàn gắn thành công mở chuỗi');
  const div = clone(married); decide(div, 'divorce', 'div'); ok(!C.active(div, 'marriage'), 'marriage: chọn ly hôn không mở chuỗi');
  const c = C.active(l, 'marriage'), uid = c.npc.ref;
  ok(E.NPC.same(l, G.E.UPDATE110.uid(l, l.partner), uid), 'marriage: chuỗi giữ uid bạn đời');
  l.partner.name = l.partner.name + ' (đổi tên)';
  const s = nextStage(l, c.id);
  ok(s && C.active(l, 'marriage'), 'marriage: đổi tên không làm mất người liên quan');
  const t0 = E.NPC.relation(l, uid).trust; l.money = l.base * 3;
  decide(l, s.id, 'counsel', s.arg);
  ok(E.NPC.relation(l, uid).trust === Math.min(100, t0 + 8), 'marriage: tư vấn tăng tin cậy bạn đời ở family100');
  const other = clone(l); other.partner = Object.assign(clone(other.partner), { uid110: 'someone-else', name: 'Người khác' });
  C.yearly(other, H.rf(other), say(other), other.age);
  ok(!C.active(other, 'marriage'), 'marriage: bạn đời đã khác người → hủy chuỗi');
}

// ---------- 7. Bạn bè: danh tính theo uid, không nhầm người trùng tên ----------
let social = null;
for (let s = 700; s < 760 && !social; s++) social = grow(s, x => x.age >= 25 && x.age <= 40 && x.indep && E.friendsOf(x).filter(f => x.age + (f.d || 0) >= 18).length >= 2);
ok(social, 'friend: có nhân vật nhiều bạn để kiểm');
{
  const l = clone(social), fs2 = E.friendsOf(l).filter(f => l.age + (f.d || 0) >= 18), A = fs2[0], B = fs2[1];
  B.name = A.name; // hai người bạn trùng tên
  const d = E.DEC.ban_than_kho.make(l, H.rf(l)); d.data.n = A.name; d.data.uid894 = E.UPDATE110.uid(l, A); l.pending.unshift(d); E.resolve(l, 'o_ben');
  const c = C.active(l, 'friend');
  ok(c && c.data.helped && c.npc.ref === A.uid110, 'friend: chuỗi gắn uid người bạn được giúp');
  B.alive = false;
  C.yearly(l, H.rf(l), say(l), l.age);
  ok(C.active(l, 'friend'), 'friend: người trùng tên qua đời không làm hủy chuỗi');
  const l2 = clone(l); l2.friends.concat([l2.bff]).filter(f => f && f.uid110 === A.uid110).forEach(f => { f.alive = false; });
  C.yearly(l2, H.rf(l2), say(l2), l2.age);
  ok(!C.active(l2, 'friend') && chains(l2).done.some(x => x.result === 'gone'), 'friend: đúng người ấy qua đời → hủy chuỗi');
  l.job = null; l.retired = false; l.money = -l.base;
  const s = nextStage(l, c.id, 14);
  paths.push(s ? 'friend:return' : 'friend:lapsed');
  if (s) {
    const m0 = l.money; const dd = decide(l, s.id, 'accept', s.arg);
    ok(l.money > m0 && new RegExp(A.name).test(dd.text), 'friend: người bạn quay lại giúp đúng một khoản');
    const m1 = l.money; l.pending.unshift(dd); E.resolve(l, 'accept');
    ok(l.money === m1, 'friend: không nhận tiền lần hai từ cùng lựa chọn');
  } else ok(!C.active(l, 'friend'), 'friend: hết hạn → khép chuỗi');
}

// ---------- 8. Sức khỏe: tai nạn lao động → mặc kệ → tái phát → đổi việc ----------
{
  const l = adult(81, 30); E.startJob(l, 'shipper', H.rf(l), say(l), true);
  decide(l, 'ld_tai_nan_lao_dong', 'lam_ngay');
  const c = C.active(l, 'health');
  ok(c && l.flags.dauLung, 'health: đi làm khi chưa lành → chuỗi sức khỏe, đau lưng mạn tính');
  const s = nextStage(l, c.id);
  decide(l, s.id, 'ignore', s.arg);
  const s2 = nextStage(l, c.id, 8);
  paths.push(s2 ? 'health:flare' : 'health:chronic');
  if (s2) { ok(s2.id === 'ch144_health_flare', 'health: tái phát vì còn đau lưng'); decide(l, s2.id, 'lighter', s2.arg); ok(!l.job && l.flags.needJob && chains(l).done.some(x => x.result === 'changed_work'), 'health: chuyển việc nhẹ → kết thúc'); }
  else ok(chains(l).done.some(x => x.result === 'chronic'), 'health: hết hạn khi vẫn đau → ghi nhận mạn tính');
  const g = adult(82, 30); E.startJob(g, 'shipper', H.rf(g), say(g), true); decide(g, 'ld_tai_nan_lao_dong', 'nhan');
  const gc = C.active(g, 'health'), gs = nextStage(g, gc.id); g.money = g.base * 3;
  decide(g, gs.id, 'habit', gs.arg); nextStage(g, gc.id, 8);
  ok(!C.active(g, 'health') && g.log.filter(e => /Thói quen tập luyện có từ sau vụ/.test(e.t)).length <= 1, 'health: tập luyện → kết thúc tốt, không lặp dòng kết');
}

// ---------- 9. Lưu / tải giữa chừng, không nhân đôi ----------
{
  const l = adult(91, 35); l.fam.mAlive = true; l.loans = [];
  decide(l, 'vd_vay_chua_benh', 'ho_hang');
  const c = C.active(l, 'debt'); C.yearly(l, H.rf(l), say(l), l.age);
  let s = null; for (let i = 0; i < 4 && !s; i++) { s = l.sched.find(x => x.arg && x.arg.cid === c.id); if (!s) { l.age++; C.yearly(l, H.rf(l), say(l), l.age); } }
  ok(s, 'save: có giai đoạn đang hẹn');
  const saved = JSON.stringify(l), r = E.migrate(JSON.parse(saved));
  ok(r.sched.filter(x => x.arg && x.arg.cid === c.id).length === 1 && chains(r).active.length === 1, 'save: tải lại giữ đúng một lịch hẹn, một chuỗi');
  E.migrate(r); ok(chains(r).active.length === 1 && chains(r).done.length === 0, 'save: migrate hai lần không đổi');
  r.age = s.at; r.sched = [];
  const d = E.DEC[s.id].make(r, H.rf(r), s.arg), copy = clone(d), L = r.loans.find(x => x.type === 'family'), bal = L.bal; r.money = bal * 3;
  r.pending.unshift(d); E.resolve(r, 'pay');
  const r2 = E.migrate(JSON.parse(JSON.stringify(r)));
  r2.pending.unshift(copy); E.resolve(r2, 'pay');
  ok(Math.abs(r2.loans.find(x => x.type === 'family').bal - bal / 2) < 1e-6, 'save: quyết định cũ còn sót sau khi tải không trả nợ lần hai');
  const bad = adult(92, 30); bad.flags.chains144 = 'hỏng'; E.migrate(bad); ok(bad.flags.chains144 === undefined, 'save: dữ liệu chuỗi hỏng được bỏ an toàn');
  const part = adult(93, 30); part.flags.chains144 = { v: 1, seq: 3, active: [{ id: 'x' }, { id: 'edu:1', kind: 'edu', stage: 0, origin: { age: 15 } }], done: [] }; E.migrate(part);
  ok(part.flags.chains144.active.length === 1 && Array.isArray(part.flags.chains144.active[0].hist), 'save: lọc bản ghi thiếu trường, bổ sung mảng rỗng');
  const fut = adult(94, 30); fut.flags.chains144 = { v: 1, seq: 1, active: [{ id: 'new:1', kind: 'tuong_lai', stage: 0, origin: { age: 20 }, hist: [], data: {} }], done: [] };
  C.yearly(fut, H.rf(fut), say(fut), 30); ok(fut.flags.chains144.active.length === 1, 'save: loại chuỗi của phiên bản mới hơn được giữ nguyên');
}

// ---------- 10. Qua đời, giới hạn, một lựa chọn chuỗi mỗi năm ----------
{
  const l = adult(101, 40); l.fam.mAlive = true; l.loans = [];
  decide(l, 'vd_vay_chua_benh', 'ho_hang');
  const c = C.active(l, 'debt'); C.yearly(l, H.rf(l), say(l), l.age);
  let s = null; for (let i = 0; i < 4 && !s; i++) { s = l.sched.find(x => x.arg && x.arg.cid === c.id); if (!s) { l.age++; C.yearly(l, H.rf(l), say(l), l.age); } }
  const d = E.DEC[s.id].make(l, H.rf(l), s.arg);
  l.alive = false; l.death = { age: l.age };
  ok(!E.DEC[s.id].valid(l, d.data), 'death: lựa chọn chuỗi không còn hợp lệ khi đã mất');
  const json = JSON.stringify(l.flags.chains144); C.yearly(l, H.rf(l), say(l), l.age);
  ok(JSON.stringify(l.flags.chains144) === json, 'death: hook không xử lý chuỗi sau khi mất');
  const m = adult(102, 40), kinds = ['edu', 'career', 'biz', 'debt', 'family', 'marriage', 'friend', 'health'];
  kinds.forEach(k => C.start(m, k, { dec: 'test', k: 'x' }, { npc: { ref: 'parent:m', name: 'A' }, data: { loan: 'family', since: 40, side: 'm' } }));
  ok(chains(m).active.length === 4, 'cap: tối đa 4 chuỗi cùng lúc');
  for (let i = 0; i < 20; i++) { C.state(m).active.slice().forEach(x => C.close(m, x, 'test')); kinds.forEach(k => C.start(m, k, { dec: 'test', k: 'x' }, { data: {} })); }
  ok(chains(m).done.length <= 12 && kinds.every(k => (chains(m).count[k] || 0) <= (C.KINDS[k].max || 2)), 'cap: lịch sử ≤ 12, mỗi loại tối đa ' + kinds.map(k => C.KINDS[k].max || 2));
}

// ---------- 11. Bản lưu cũ chơi tiếp được ----------
{
  const dir = path.join(__dirname, 'fixtures', 'saves');
  let n = 0;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json.gz'))) {
    const pack = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(dir, f))));
    for (const item of pack.saves || pack.items || []) {
      const l = E.migrate(clone(item.save.life)); if (!l.alive) continue;
      for (let y = 0; y < 6 && l.alive; y++) { E.beginYear(l, { auto: true }); let g = 0; while (l.pending.length && l.alive && g++ < 64) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); g = 0; while (l.pending.length && l.alive && g++ < 64) E.resolve(l, E.autoKey(l)); E.endYear(l); }
      const s = l.flags.chains144; ok(s === undefined || (Array.isArray(s.active) && s.active.length <= 4), f + ': bản lưu cũ chơi tiếp 6 năm, chuỗi hợp lệ'); n++;
    }
  }
  ok(n >= 10, 'saves: đã chạy ' + n + ' bản lưu cũ');
}

// ---------- 12. GĐ3 giữ nguyên & mô phỏng nhiều năm ----------
{
  // Hai ngữ cảnh mới, cùng trạng thái đồng hồ / Math.random (life.id phụ thuộc chúng), chỉ khác có hay không GĐ4.
  const dependents=['js/childhood-context.js','js/health-aging.js'];
  const E = gameContext({skip:dependents}).E, without = gameContext({ skip: dependents.concat(['js/life144.js']) }).E;
  ok(E.TRIG.filter(t => t.contextTags).length === 50 && without.TRIG.filter(t => t.contextTags).length === 50, 'GĐ3: vẫn đúng 50 trigger có hệ số hoàn cảnh');
  let same = 0, touched = 0, applied = 0, perYear = 0, afterDeath = 0, newLoans = 0, lives = 0;
  const started = {};
  Object.keys(E.DEC).filter(id => /^ch144_/.test(id)).forEach(id => { const D = E.DEC[id], a = D.apply; D.apply = function (l) { const n = (l.loans || []).length; if (!l.alive) afterDeath++; l._c144 = l._c144 || {}; l._c144[l.age] = (l._c144[l.age] || 0) + 1; if (l._c144[l.age] > 1) perYear++; applied++; const r = a.apply(this, arguments); if ((l.loans || []).length > n) newLoans++; return r; }; });
  for (let i = 0; i < 40; i++) {
    const o = { mode: i % 3 ? 'vn' : 'world', seed: 9000 + i * 104729, year: 1980 + i % 30 };
    const a = E.createLife(o), b = without.createLife(o);
    E.runHeadless(a); without.runHeadless(b); lives++;
    const s = a.flags.chains144; delete a._c144;
    if (!s) { ok(JSON.stringify(a) === JSON.stringify(b), 'GĐ3: đời không chạm chuỗi giống từng byte khi bỏ GĐ4 (#' + i + ')'); same++; }
    else { touched++; s.done.concat(s.active).forEach(c => { started[c.kind] = (started[c.kind] || 0) + 1; }); ok(s.active.length <= 4 && s.done.length <= 12, 'sim: giới hạn chuỗi (#' + i + ')'); }
  }
  ok(perYear === 0 && afterDeath === 0 && newLoans === 0, 'sim: ≤1 lựa chọn chuỗi mỗi năm, không xử lý sau khi mất, không tạo khoản vay (' + [perYear, afterDeath, newLoans] + ')');
  ok(same > 0 && touched > 0 && applied > 0, 'sim: có đời chạm chuỗi và đời không chạm');
  console.log('   Mô phỏng ' + lives + ' đời: ' + touched + ' đời có chuỗi, ' + applied + ' lựa chọn chuỗi; loại: ' + JSON.stringify(started) + '; ' + same + ' đời không chạm chuỗi giống GĐ3 từng byte.');
}

console.log('   Nhánh xác suất đã kiểm: ' + paths.join(', '));
console.log('PASS chains-gd4: ' + checks + ' kiểm tra.');
