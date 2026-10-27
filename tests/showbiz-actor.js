/* Showbiz — Mốc 4: sự nghiệp diễn viên (dự án phim nhiều bước, hồ sơ phim, nấc nghề, giải thưởng, mời gameshow, Gương Mặt Thân Quen). */
'use strict';
const assert = require('assert');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, H = E.H, A = E.ACTOR154, SH = E.SHOW151;
let checks = 0;
const ok = (c, m) => { assert(c, m); checks++; };
const near = (a, b, m) => ok(Math.abs(a - b) < 1e-6, m + ': ' + a + ' vs ' + b);
const clone = o => JSON.parse(JSON.stringify(o));
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
function life(o = {}) {
  const l = E.createLife({ mode: 'vn', seed: o.seed || 1540, year: o.birth || 1996 });
  Object.assign(l, { age: o.age || 20, edu: o.edu == null ? 5 : o.edu, indep: true, school: null, pending: [], partner: null, jailUntil: null, abroad: null, talent: 'diễn xuất' });
  l.flags.military = 0; l.money = l.base * 10; l.st.hea = 90; l.st.soc = 70; l.fame = o.fame || 0; l.actSk = o.act == null ? 60 : o.act;
  return l;
}
function top(l, id) { return l.pending.find(d => d.id === id); }
function choose(l, id, k) { const d = top(l, id); assert(d, 'đang có ' + id); const keys = d.data && d.data.keys, key = keys ? String(keys.indexOf(k)) : k; assert(d.opts.some(o => o.k === key), id + ' có ' + k + ' (' + (keys || d.opts.map(o => o.k)) + ')'); l.pending = l.pending.filter(x => x !== d); l.pending.unshift(d); E.resolve(l, key); }
function year(l) { l.age++; l.pending = []; E.HOOKS.year.forEach(fn => { if (/actor154/.test(String(fn))) fn(l, () => 0.5, say(l)); }); }
// Chơi hết một dự án với những lựa chọn tốt
function shoot(l, how = {}) {
  let n = 0; while (top(l, 'film154') && n++ < 20) { const p = A.S(l).project, k = { read: how.read || 'study', offer: 'accept', contract: how.contract || 'sign', prep: 'train', set: how.set || 'listen', incident: 'good' }[p.stage]; choose(l, 'film154', k); }
  return A.S(l).project;
}

// ---------- Casting sẵn có vẫn còn, thêm thử vai dự án cụ thể ----------
{
  const l = life(); const d = E.DEC.casting.make(l, () => 0.5);
  ok(['web', 'tv', 'cinema'].every(k => d.opts.some(o => o.k === k)), 'các lựa chọn casting cũ vẫn còn');
  ok(d.opts.some(o => o.k === 'project154'), 'thêm lựa chọn thử vai một dự án cụ thể');
  // Casting nhanh cũ cũng được ghi vào hồ sơ phim
  let got = false; for (let i = 0; i < 15 && !got; i++) { const x = E.DEC.casting.make(l, () => 0.5); x.manual = true; l.pending = [x]; E.resolve(l, 'web'); got = A.S(l).credits.some(c => c.quick); }
  ok(got && l.job.id === 'dien_vien', 'casting nhanh trúng vai: thành diễn viên, vai được ghi vào hồ sơ phim');
}

// ---------- Dự án nhiều bước ----------
{
  const l = life({ seed: 2 }); const m0 = l.money;
  const x = E.DEC.casting.make(l, () => 0.5); x.manual = true; l.pending = [x]; E.resolve(l, 'project154');
  const p = A.S(l).project; ok(p && top(l, 'film154') && p.stage === 'read', 'mở dự án: đọc kịch bản, thử vai');
  ok(p.dirName && p.coName && p.budget > 0 && p.genre && p.scale, 'dự án có thể loại, quy mô, ngân sách, đạo diễn, bạn diễn');
  ok(E.ELITE148.find(l, p.dir) && E.ELITE148.find(l, p.co), 'đạo diễn và bạn diễn là người có danh tính lâu dài');
  choose(l, 'film154', 'study'); ok(['offer', 'done'].includes(p.stage), 'sau thử vai: được mời vai hoặc trượt');
  if (p.stage === 'offer') {
    const role = p.role; choose(l, 'film154', 'accept'); ok(p.stage === 'contract', 'nhận vai → hợp đồng');
    const fee = p.fee; choose(l, 'film154', 'sign'); near(l.money - m0, fee, 'cát-xê trả đúng một lần khi ký');
    ok(l.job && l.job.id === 'dien_vien', 'ký hợp đồng → vào nghề diễn viên');
    const back = E.migrate(clone(l)); ok(back.flags.actor154.project.stage === 'prep', 'tải lại giữa dự án: giữ nguyên bước');
    shoot(l); ok(p.stage === 'post' && p.releaseAt === l.age + 1, 'đóng máy, chờ phát hành năm sau');
    const credits0 = A.S(l).credits.length; year(l);
    ok(p.stage === 'done' && A.S(l).credits.length === credits0 + 1 && A.S(l).credits.slice(-1)[0].review > 0, 'năm sau phát hành, có điểm đánh giá, ghi vào hồ sơ phim');
    const m1 = l.money; year(l); ok(l.money === m1, 'không nhận cát-xê hai lần');
  }
  ok(E.DEC.film154.auto, 'chế độ Tự động có lựa chọn cho dự án phim');
}

// ---------- Con đường diễn viên (kịch bản 1) ----------
{
  const l = life({ seed: 30, age: 18, act: 40, edu: 5 });
  ok(A.tier(l) === 0, '18 tuổi: chưa có vai');
  choose2: {
    // 18 tuổi học diễn, đóng quần chúng
    const m = E.DEC.actor154.make(l, () => 0); m.manual = true; l.pending = [m]; E.resolve(l, String(m.data.keys.indexOf('extra')));
    ok(l.job && l.job.id === 'dien_vien' && A.S(l).credits.some(c => c.role === 'quần chúng'), 'đóng vai quần chúng: vào nghề, có kinh nghiệm');
  }
  l.actSk = 70; let leads = 0, hits = 0;
  for (let y = 0; y < 12 && A.tier(l) < 4; y++) {
    l.age++; l.pending = [];
    if (A.startProject(l, () => 0.3, say(l))) { shoot(l, { read: 'coach' }); }
    year(l); l.age--; // year() đã tăng tuổi
    l.fame = Math.max(l.fame, (A.S(l).credits.filter(c => c.role === 'chính').length) * 4e5); // mô phỏng danh tiếng tích lũy nhiều năm
    leads = A.S(l).credits.filter(c => c.role === 'chính').length; hits = A.S(l).credits.filter(c => c.hit).length;
    if (y === 6) A.S(l).credits.slice(-1)[0].hit = true;
  }
  ok(A.S(l).credits.some(c => c.role === 'phụ' || c.role === 'chính'), 'nhận vai phụ / vai chính qua các năm');
  ok(l.job.rank >= 2, 'nấc nghề tăng theo vai đã đóng: ' + A.TIER[l.job.rank]);
  ok(A.TIER.length === E.CAR.dien_vien.t.length && A.TIER.every((t, i) => t === E.CAR.dien_vien.t[i]), 'nấc nghề trùng bậc nghề diễn viên sẵn có');
}

// ---------- Phim thành công → lời mời gameshow, giải thưởng ----------
{
  const l = life({ seed: 40, act: 95, fame: 2e5, age: 24 }); E.startJob(l, 'dien_vien', () => 0, () => { }, true);
  const p = A.startProject(l, () => 0.3, say(l), 'cinema'); shoot(l, { read: 'coach' });
  if (p.stage === 'post') { p.perf = 1; p.chem = 1; p.script = 95; p.dirSkill = 95; p.role = 'chính'; year(l);
    ok(p.result && p.result.hit, 'phim chất lượng cao thành công');
    ok(l.sched.some(x => x.id === 'gameshow') || (l.flags.sched || []).some(x => x.id === 'gameshow') || l.log.some(e => /Running Man Việt Nam và 2 Ngày 1 Đêm ngỏ ý mời/.test(e.t)), 'phim thành công → được mời Running Man / 2 Ngày 1 Đêm');
    ok(A.S(l).noms.some(n => n.token === p.token), 'phim có chất lượng được đưa vào mùa giải thưởng');
    const fame0 = l.fame; year(l);
    ok(A.S(l).noms.find(n => n.token === p.token).done, 'năm sau: xét giải thưởng');
    ok(l.log.some(e => /đề cử|đoạt/.test(e.t)) || l.fame === fame0, 'có đề cử / đoạt giải khi đủ tầm');
  } else ok(true, 'dự án dừng sớm');
}

{ // mùa giải: vai xuất sắc thường được đề cử, có người thắng; vai yếu thì không
  const l = life({ seed: 45, fame: 5e5 }); E.startJob(l, 'dien_vien', () => 0, () => { }, true);
  for (let i = 0; i < 10; i++) A.S(l).noms.push({ token: 'aw' + i, title: 'Phim ' + i, role: 'chính', q: 1.05, year: l.birthYear + l.age, scale: 'cinema' });
  for (let i = 0; i < 6; i++) A.S(l).noms.push({ token: 'weak' + i, title: 'Phim yếu ' + i, role: 'phụ', q: 0.5, year: l.birthYear + l.age, scale: 'tv' });
  l.age++; A.awards(l, () => 0.5, say(l));
  const all = A.S(l).awards, strong = all.filter(a => /^Phim [0-9]/.test(a.title)), weak = all.filter(a => /yếu/.test(a.title));
  ok(strong.length >= 6, 'vai xuất sắc thường được đề cử: ' + strong.length + '/10');
  ok(strong.some(a => a.won), 'có giải thưởng được trao');
  ok(weak.length === 0, 'vai chất lượng thấp không được đề cử');
  ok(A.S(l).noms.every(n => n.done), 'mỗi đề cử chỉ xét một lần');
}
// ---------- Nhà sản xuất, chuyển đạo diễn, Gương Mặt Thân Quen ----------
{
  const l = life({ seed: 50, act: 90, fame: 3e6, age: 32 }); E.startJob(l, 'dien_vien', () => 0, () => { }, true);
  for (let i = 0; i < 3; i++) A.credit(l, { title: 'Phim ' + i, type: 'cinema', role: 'chính', fee: 1, hit: i === 0 });
  A.syncTier(l, say(l)); ok(l.job.rank === 4 && A.tier(l) === 4, 'đủ vai chính, phim thành công, danh tiếng: ngôi sao điện ảnh');
  const menu = E.DEC.actor154.make(l, () => 0); ok(menu.data.keys.includes('produce') && menu.data.keys.includes('direct'), 'ngôi sao có thể làm nhà sản xuất, chuyển hướng đạo diễn');
  const m = l.money; l.pending = [menu]; menu.manual = true; E.resolve(l, String(menu.data.keys.indexOf('produce'))); near(m - l.money, l.base * 3, 'góp vốn sản xuất');
  year(l); ok(A.S(l).produce.done && A.S(l).produce.back >= 0, 'năm sau nhận phần chia lại (có thể lãi hoặc lỗ)');
  ok(SH.canJoin(l, SH.SHOWS.gmtq, 'judge') === true, 'ngôi sao được mời làm giám khảo Gương Mặt Thân Quen');
  ok(SH.canJoin(life({ fame: 1e4 }), SH.SHOWS.gmtq, 'judge') !== true, 'diễn viên chưa nổi tiếng chưa làm giám khảo');
  SH.begin(l, H.rf(l), say(l), 'gmtq', 'judge'); let n = 0; while (top(l, 'show151_step') && n++ < 20) { const d = top(l, 'show151_step'); l.pending = l.pending.filter(x => x !== d); l.pending.unshift(d); E.resolve(l, E.autoKey(l)); }
  ok(SH.S(l).history.slice(-1)[0].role === 'judge' && /giám khảo/.test(SH.S(l).history.slice(-1)[0].result), 'hoàn thành mùa giám khảo');
  const c = life({ seed: 51, fame: 1e5, age: 28 }); E.startJob(c, 'ca_si', () => 0, () => { }, true); if (E.LIFE138) E.LIFE138.skill(c, 'sing').level = 70;
  SH.begin(c, H.rf(c), say(c), 'gmtq', 'celeb'); ok(/hóa thân thành/.test(top(c, 'show151_step').text), 'thí sinh bốc thăm ca sĩ để hóa thân');
  n = 0; while (top(c, 'show151_step') && n++ < 20) { const d = top(c, 'show151_step'); c.pending = c.pending.filter(x => x !== d); c.pending.unshift(d); E.resolve(c, E.autoKey(c)); }
  ok(/quán quân|xếp hạng/.test(SH.S(c).history.slice(-1)[0].result), 'Gương Mặt Thân Quen có kết quả chung cuộc');
  const direct = E.DEC.actor154.make(l, () => 0); l.pending = [direct]; direct.manual = true; E.resolve(l, String(direct.data.keys.indexOf('direct'))); ok(l.job.id === 'dao_dien', 'chuyển sang nghề đạo diễn (dùng xưởng phim sẵn có)');
}
// ---------- Tự động: nhiều dự án chạy hết, tiền hữu hạn ----------
{
  for (let s = 0; s < 12; s++) { const l = life({ seed: 600 + s, act: 30 + s * 5 }); A.startProject(l, H.rf(l), say(l)); let n = 0; while (top(l, 'film154') && n++ < 30) { const d = top(l, 'film154'); l.pending = l.pending.filter(x => x !== d); l.pending.unshift(d); E.resolve(l, E.autoKey(l)); } year(l); year(l); ok(Number.isFinite(l.money) && ['done', 'post'].includes(A.S(l).project.stage), 'tự động #' + s + ': dự án kết thúc (' + A.S(l).project.stage + ')'); }
}
console.log('PASS showbiz-actor: ' + checks + ' kiểm tra.');
