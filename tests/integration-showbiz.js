/* Showbiz — Mốc 6: tích hợp bốn con đường (diễn viên, idol, người bình thường đi gameshow, hẹn hò trên truyền hình)
   và các nguyên tắc chung: NPC giữ danh tính, không cộng tiền hai lần, không nhận thưởng hai lần khi tải lại,
   điều kiện độ tuổi / nghề / quốc gia / thời gian, hồ sơ – nhật ký – thành tựu, chế độ Tự động. */
'use strict';
const assert = require('assert');
const { gameContext } = require('./hardcore-isolation');
const { year } = require('./lib/quick');
const G = gameContext(), E = G.E, H = E.H, SH = E.SHOW151, A = E.ACTOR154, I = E.IDOL155, L = E.LIFE138, C = E.ELITE148;
let checks = 0;
const ok = (c, m) => { assert(c, m); checks++; };
const near = (a, b, m) => ok(Math.abs(a - b) < 1e-6, m + ': ' + a + ' vs ' + b);
const clone = o => JSON.parse(JSON.stringify(o));
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
function top(l, id) { return l.pending.find(d => d.id === id); }
function choose(l, id, k) { const d = top(l, id); assert(d, 'đang có ' + id + ' (' + l.pending.map(x => x.id) + ')'); const keys = d.data && d.data.keys, key = keys ? String(keys.indexOf(k)) : k; assert(d.opts.some(o => o.k === key), id + ' có ' + k + ' (' + (keys || d.opts.map(o => o.k)) + ')'); l.pending = l.pending.filter(x => x !== d); l.pending.unshift(d); E.resolve(l, key); }
function drive(l, ids, max = 300) { let n = 0; while (n++ < max) { const d = l.pending.find(x => ids.includes(x.id)); if (!d) break; l.pending = l.pending.filter(x => x !== d); l.pending.unshift(d); E.resolve(l, E.autoKey(l)); } }
const ach = l => E.achievementsOf(l).map(a => a.id);
const prof = l => (E.profile(l).jobInfo || []).join(' | ');
function base(o) { const l = E.createLife({ mode: 'vn', seed: o.seed, year: o.birth }); Object.assign(l, { age: o.age, edu: 5, indep: o.age >= 18, school: null, pending: [], partner: null, jailUntil: null, abroad: null }); l.flags.military = 0; l.money = l.base * 10; l.st.hea = 90; l.st.soc = 70; l.st.kno = 80; return l; }
function yearHooks(l, needle) { l.age++; E.HOOKS.year.forEach(fn => { if (String(fn).includes(needle)) fn(l, () => 0.5, say(l)); }); }

// ---------- Con đường 1 — Diễn viên: 18 học diễn → 20 vai phụ → 23 phim nổi tiếng → 24 Running Man → 26 vai chính → 30 ngôi sao ----------
{
  const l = base({ seed: 1560, birth: 1996, age: 18 }); l.talent = 'diễn xuất'; l.actSk = 40;
  const m = E.DEC.actor154.make(l, () => 0); m.manual = true; l.pending = [m]; E.resolve(l, String(m.data.keys.indexOf('extra')));
  ok(l.job.id === 'dien_vien' && A.tier(l) === 0, '18 tuổi: đóng quần chúng, vào nghề');
  // 20 tuổi: vai phụ
  l.age = 20; l.actSk = 55; let p = null; for (let s = 0; s < 12 && !(p && p.role === 'phụ'); s++) { delete A.S(l).project; l.pending = []; p = A.startProject(l, () => 0.3, say(l), 'tv'); choose(l, 'film154', 'instinct'); if (p.stage === 'offer' && p.role !== 'phụ') { p.stage = 'done'; } }
  if (p.stage === 'offer') { choose(l, 'film154', 'accept'); choose(l, 'film154', 'sign'); drive(l, ['film154']); yearHooks(l, 'actor154'); }
  ok(A.S(l).credits.some(c => c.role === 'phụ') && A.tier(l) >= 1, '20 tuổi: vai phụ, nấc diễn viên vai phụ');
  const director = p.dir;
  // 23 tuổi: phim nổi tiếng
  l.age = 23; l.actSk = 85; l.fame = 2e5; delete A.S(l).project; l.pending = [];
  const hit = A.startProject(l, () => 0.3, say(l), 'cinema'); choose(l, 'film154', 'coach');
  if (hit.stage === 'offer') { hit.role = 'chính'; choose(l, 'film154', 'accept'); choose(l, 'film154', 'sign'); drive(l, ['film154']); hit.perf = 1; hit.chem = 1; hit.script = 95; hit.dirSkill = 95; yearHooks(l, 'actor154'); }
  ok(hit.result && hit.result.hit, '23 tuổi: phim thành công');
  ok(l.sched.some(x => x.id === 'gameshow'), 'phim thành công → lời mời Running Man / 2 Ngày 1 Đêm được lên lịch');
  // 24 tuổi: Running Man Việt Nam
  l.pending = []; const gs = E.DEC.gameshow.make(l, () => 0.5); gs.manual = true; l.pending = [gs]; choose(l, 'gameshow', 'rm'); choose(l, 'vr_vai_tro', 'guest');
  drive(l, ['vr_vong', 'mini152']); ok(l.flags.variety && l.flags.variety.done, '24 tuổi: tham gia Running Man Việt Nam');
  // 26–30: nhiều vai chính, giải thưởng → ngôi sao
  for (let i = 0; i < 3; i++) A.credit(l, { title: 'Phim chính ' + i, type: 'cinema', role: 'chính', fee: 1, hit: i === 1 });
  l.fame = 2e6; l.age = 30; A.syncTier(l, say(l)); ok(l.job.rank === 4 && ach(l).includes('sb_star'), '30 tuổi: ngôi sao điện ảnh, có thành tựu');
  ok(/Phim "/.test(prof(l)), 'hồ sơ ghi các phim đã đóng');
  ok(director && C.find(l, director) && C.find(l, director).met.length >= 1, 'đạo diễn cũ vẫn là cùng một người quen trong mạng lưới');
  ok(SH.canJoin(l, SH.SHOWS.gmtq, 'judge') === true, 'ngôi sao được mời làm giám khảo');
}

// ---------- Con đường 2 — Idol: 15 được chú ý → 16 đào tạo → 19 sống còn → 20 debut → 22 gameshow → 25 lưu diễn ----------
{
  let l = null;
  for (let s = 0; s < 80 && !l; s++) { const x = base({ seed: 1600 + s, birth: 2005, age: 15 }); x.indep = false; x.school = 'THPT'; x.sex = 'M'; L.skill(x, 'sing').level = 75; L.skill(x, 'dance').level = 80; const d = E.DEC.scout155.make(x, () => 0.5); d.manual = true; x.pending = [d]; choose(x, 'scout155', 'audition'); if (I.S(x).offer && I.S(x).offer.audition === 'pass') { choose(x, 'scout155', 'parents'); if (I.S(x).offer.parents === 'yes') { choose(x, 'scout155', 'sign'); l = x; } } }
  ok(l && I.S(l).stage === 'junior' && l.school, '15 tuổi: được chú ý, ký thỏa thuận cùng bố mẹ, vẫn đi học');
  for (let a = 15; a < 18; a++) year(E, l);
  ok(I.S(l).months >= 3 && I.S(l).evals.length >= 3, '16–17 tuổi: các kỳ đánh giá tháng');
  year(E, l);
  ok(L.state(l).agency.status === 'offer', '18 tuổi: đề nghị sang Hàn Quốc toàn thời gian (luồng sẵn có)');
  // sang Hàn (giản lược bước làm hồ sơ của luồng sẵn có), 19 tuổi dự thi Boys Planet (2024)
  L.state(l).agency.status = 'trainee'; I.S(l).stage = 'trainee'; l.abroad = { code: 'KR', perm: false, name: 'Hàn Quốc', entertainment139: true }; l.age = 19;
  ok(SH.canJoin(l, SH.SHOWS.boysplanet, 'trainee') === true, '19 tuổi: thực tập sinh đủ điều kiện Boys Planet (' + (l.birthYear + l.age) + ')');
  L.skill(l, 'sing').level = 95; L.skill(l, 'dance').level = 95;
  SH.begin(l, H.rf(l), say(l), 'boysplanet', 'trainee'); drive(l, ['show151_step']);
  const sv = SH.S(l).history.slice(-1)[0];
  if (!I.S(l).group) { I.formGroup(l, H.rf(l), say(l), 'agency'); }
  drive(l, ['debut155']);
  ok(I.S(l).group && l.job.id === 'ca_si', '20 tuổi: debut (' + (sv ? sv.result : '') + ')');
  ok(ach(l).includes('sb_debut'), 'thành tựu ngày debut');
  for (let a = 0; a < 3; a++) { l.age++; I.idolYear(l, () => 0.5, say(l)); }
  I.S(l).group.fandom = Math.max(I.S(l).group.fandom, 2e5); l.age++; I.idolYear(l, () => 0.5, say(l));
  ok(SH.S(l).invites.rmkr, '22 tuổi: nhóm nổi tiếng được mời Running Man Hàn Quốc');
  SH.begin(l, H.rf(l), say(l), 'rmkr', 'guest'); drive(l, ['show151_step', 'mini152']); ok(SH.S(l).history.slice(-1)[0].id === 'rmkr', 'xuất hiện trên chương trình giải trí');
  if (I.S(l).group.disbanded) { ok(I.S(l).stage === 'trainee', 'nhóm dự án hết hạn: trở về công ty'); delete I.S(l).group; I.formGroup(l, H.rf(l), say(l), 'agency'); drive(l, ['debut155']); ok(I.S(l).group && !I.S(l).group.project, 'công ty cho debut trong nhóm chính thức'); }
  I.S(l).group.fandom = 4e5; I.S(l).group.debutAge = l.age - 5; l.age++; I.idolYear(l, () => 0.5, say(l));
  ok(l.log.some(e => /lưu diễn quốc tế/.test(e.t)), '25 tuổi: lưu diễn quốc tế');
  ok(/Thành viên /.test(prof(l)), 'hồ sơ ghi nhóm nhạc');
}

// ---------- Con đường 3 — Người bình thường: Nhanh Như Chớp → tiền thưởng → được biết đến → chương trình khác ----------
{
  const l = base({ seed: 1700, birth: 1996, age: 25 }); E.startJob(l, 'ke_toan', () => 0, () => { }, true);
  const m0 = l.money; SH.begin(l, H.rf(l), say(l), 'nnc', 'contestant');
  for (let i = 0; i < 10; i++) { const a = SH.S(l).active, d = top(l, 'show151_step'); l.pending = l.pending.filter(x => x !== d); l.pending.unshift(d); E.resolve(l, String(d.data.keys.indexOf('o' + a.q.answer))); }
  near(l.money - m0, SH.V(l, 20), 'thắng 10 câu liên tiếp: nhận 20 triệu');
  ok(l.fame > 0 && ach(l).includes('sb_nnc'), 'được khán giả biết đến, có thành tựu');
  // tải lại bản lưu, chạy lại vòng năm: không nhận thưởng lần nữa
  const back = E.migrate(clone(l)), key = Object.keys(back.flags.show151.paid).find(k => /:prize$/.test(k)), mb = back.money;
  ok(key && SH.pay(back, { token: key.replace(/:prize$/, '') }, 'prize', SH.V(back, 20), 'thử trả lại') === 0 && back.money === mb, 'tải lại: khoản thưởng đã nhận không thể nhận lần nữa');
  ok(!back.flags.show151.active && back.flags.show151.history.length === l.flags.show151.history.length, 'tải lại: không mở lại cuộc thi đã kết thúc');
  yearHooks(l, 'cross156'); ok(SH.S(l).invites.altp && SH.inviteFor(l).some(x => x.id === 'altp'), 'được mời sang Ai Là Triệu Phú');
  ok(/Nhanh Như Chớp/.test(prof(l)), 'hồ sơ ghi chương trình đã tham gia');
}

// ---------- Con đường 4 — Hẹn hò: show hẹn hò → thành đôi → tiếp tục yêu → có thể kết hôn ----------
{
  let l = null, target = null;
  for (let s = 0; s < 30 && !l; s++) {
    const x = base({ seed: 1800 + s, birth: 1996, age: 27 }); x.abroad = { code: 'KR', perm: true, name: 'Hàn Quốc' };
    SH.begin(x, H.rf(x), say(x), 'heartsignal', 'player'); const A2 = SH.S(x).active; const t = A2.people[0]; t.attr = 80; t.rival = 0;
    let n = 0; while (SH.S(x).active && n++ < 60) { const B = SH.S(x).active; const k = B.phase === 'intro' ? 'honest' : B.phase === 'activity' ? 'all' : B.phase === 'date' ? 'd' + t.id : B.phase === 'talk' ? 't' + t.likes : B.phase === 'signal' ? 's' + t.id : B.phase === 'event' ? B.event.rows[0][0] : 'f' + t.id; choose(x, 'show151_step', k); }
    if (top(x, 'love')) { l = x; target = t; }
  }
  ok(l, '27 tuổi: cùng một người chọn nhau trong Heart Signal');
  const lv = top(l, 'love'); l.pending = [lv]; E.resolve(l, 'yes');
  ok(l.partner && l.partner.name === target.name && l.partner.status === 'dating', 'tiếp tục hẹn hò sau chương trình');
  ok(C.people(l).some(p => p.name === target.name && p.dating153), 'người ấy có danh tính lâu dài');
  ok(ach(l).includes('sb_couple'), 'thành tựu thành đôi trên sóng');
  l.age += 2; l.partner.since = l.age - 2; l.partner.affection108 = 90; const mk = E.DEC.marry.make(l, () => 0.5); mk.manual = true; l.pending = [mk]; E.resolve(l, 'small');
  const ct = top(l, 'contract108'); if (ct) { l.pending = [ct]; E.resolve(l, 'default'); }
  ok(l.partner.status === 'married', 'về sau có thể kết hôn qua luồng cưới sẵn có');
  ok(SH.canJoin(l, SH.SHOWS.heartsignal, 'player') !== true, 'đã kết hôn thì không tham gia show độc thân nữa');
}

// ---------- Nguyên tắc chung ----------
{
  // Độ tuổi: trẻ em không vào show hẹn hò / chiến thuật; học sinh mới thi Olympia; Ai Là Triệu Phú từ 18
  const kid = base({ seed: 1900, birth: 2010, age: 15 }); kid.abroad = { code: 'KR', perm: true, name: 'Hàn Quốc' };
  ['singlesinferno', 'heartsignal', 'genius', 'devilsplan', 'altp', 'nnc'].forEach(id => { const r = Object.keys(SH.SHOWS[id].roles)[0]; ok(SH.canJoin(kid, SH.SHOWS[id], r) !== true, '15 tuổi không tham gia ' + id); });
  // Mỗi chương trình có format thật (không chỉ tên): đều có handler với start / rows / auto
  Object.keys(SH.SHOWS).forEach(id => { const sh = SH.SHOWS[id]; Object.keys(sh.roles).forEach(role => { const h = SH.HANDLERS[sh.roles[role].handler || sh.handler]; ok(h && h.start && h.rows && h.text, id + '/' + role + ': có luật chơi riêng'); }); });
  ok(Object.keys(SH.SHOWS).length === 27&&SH.SHOWS.lifetalk&&Object.values(SH.SHOWS).some(s=>s.handler==='chef175'), 'danh mục có 27 chương trình, gồm nấu ăn và talk show (cộng 10 chương trình sẵn có ở life39, life41, life48): ' + Object.keys(SH.SHOWS).length);
  // Không cộng tiền hai lần: bấm lại một bước cũ sau khi đã trả lời
  const l = base({ seed: 1901, birth: 1996, age: 30 }); SH.begin(l, H.rf(l), say(l), 'altp', 'contestant');
  const old = clone(top(l, 'show151_step')), a = SH.S(l).active; choose(l, 'show151_step', 'o' + a.q.answer); const q1 = SH.S(l).active.qi;
  l.pending.unshift(old); E.resolve(l, String(old.data.keys.indexOf('o' + a.q.answer))); ok(SH.S(l).active.qi === q1, 'bước cũ bị bỏ qua');
  // Chế độ Tự động: nhiều đời dài với mọi hệ thống mới, không lỗi, tiền hữu hạn
  let n = 0;
  for (let s = 0; s < 10; s++) { const x = E.createLife({ mode: s % 3 ? 'vn' : 'world', seed: 81000 + s }); for (let y = 0; y < 70 && x.alive; y++) { year(E, x); n++; } ok(Number.isFinite(x.money) && Number.isFinite(E.netWorth(x)), 'tự chơi #' + s + ' hợp lệ'); const sb = x.flags.show151; if (sb) ok(sb.history.length <= 60 && !sb.active || sb.active, 'dữ liệu chương trình có giới hạn'); }
  ok(n > 400, 'tự chơi ' + n + ' năm');
}
console.log('PASS integration-showbiz: ' + checks + ' kiểm tra.');
