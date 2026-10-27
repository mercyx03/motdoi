/* Showbiz — Mốc 5: thực tập sinh K-pop từ 14–16 tuổi (người giám hộ, việc học), đánh giá tháng, debut, chương trình sống còn. */
'use strict';
const assert = require('assert');
const { gameContext } = require('./hardcore-isolation');
const { year } = require('./lib/quick');
const G = gameContext(), E = G.E, H = E.H, I = E.IDOL155, L = E.LIFE138, SH = E.SHOW151;
let checks = 0;
const ok = (c, m) => { assert(c, m); checks++; };
const clone = o => JSON.parse(JSON.stringify(o));
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
function kid(o = {}) {
  const l = E.createLife({ mode: 'vn', seed: o.seed || 1550, year: o.birth || 2009 });
  Object.assign(l, { age: o.age || 15, pending: [], partner: null, jailUntil: null, abroad: null, school: o.school === undefined ? 'THPT' : o.school, sex: o.sex || l.sex });
  l.flags.military = 0; l.st.hea = 85; l.st.soc = 65; l.st.kno = 70;
  L.skill(l, 'sing').level = o.sing == null ? 60 : o.sing; L.skill(l, 'dance').level = o.dance == null ? 60 : o.dance; L.skill(l, 'acting').level = 40;
  return l;
}
function top(l, id) { return l.pending.find(d => d.id === id); }
function choose(l, id, k) { const d = top(l, id); assert(d, 'đang có ' + id + ' (' + l.pending.map(x => x.id) + ')'); const i = d.data.keys.indexOf(k); assert(i >= 0 && d.opts.some(o => o.k === String(i)), id + ' có ' + k + ' (' + d.data.keys + ')'); l.pending = l.pending.filter(x => x !== d); l.pending.unshift(d); E.resolve(l, String(i)); }
function openScout(l) { const d = E.DEC.scout155.make(l, () => 0.5); d.manual = true; l.pending = [d]; return d; }
// Ép may rủi thuận lợi cho bước kiểm tra luồng (audition / bố mẹ dùng hạt giống riêng): thử vài hạt giống
function signed(o = {}) { for (let s = 0; s < 60; s++) { const l = kid(Object.assign({ seed: 2000 + s }, o)); openScout(l); choose(l, 'scout155', 'read'); choose(l, 'scout155', 'audition'); if (I.S(l).offer && I.S(l).offer.audition === 'pass') { choose(l, 'scout155', 'parents'); if (I.S(l).offer.parents === 'yes') { choose(l, 'scout155', 'sign'); return l; } } } throw Error('không tìm được trường hợp ký'); }

// ---------- D1: phát hiện tài năng ----------
{
  const strong = kid({ sing: 75, dance: 70 }), weak = kid({ sing: 10, dance: 10, seed: 2 });
  ok(I.scoutable(strong) && I.scoutChance(strong) > I.scoutChance(weak) && I.scoutChance(weak) > 0, 'cơ hội được chú ý tăng theo tiềm năng, người kém vẫn có cơ hội nhỏ');
  ok(!I.scoutable(kid({ age: 13 })) && !I.scoutable(kid({ age: 17 })), 'chỉ 14–16 tuổi mới có lượt "phát hiện tài năng"');
  const a = kid({ seed: 3 }), b = kid({ seed: 3 }); a.looks134 = 30; b.looks134 = 90;
  if (E.LOOKS134) { a.flags.looks134 = { looks: 30 }; b.flags.looks134 = { looks: 90 }; }
  ok(Math.abs(I.potential(a) - I.potential(b)) <= 8, 'ngoại hình chỉ ảnh hưởng nhỏ tới tiềm năng');
  const x = kid({ sing: 20, dance: 20, seed: 4 }), p0 = I.potential(x); L.skill(x, 'sing').level = 60; L.skill(x, 'dance').level = 60; ok(I.potential(x) > p0 + 15, 'luyện tập nâng tiềm năng');
  ok(E.TRIG.some(t => t.id === 'scout155'), 'có sự kiện được công ty giải trí chú ý');
}

// ---------- D2: nhận lời có người giám hộ, việc học tiếp tục ----------
{
  const l = kid({ seed: 5 }); openScout(l);
  const d = top(l, 'scout155'); ok(/(bố mẹ|mẹ|bố) \/ người giám hộ đồng ý/.test(d.text) && /việc học phổ thông/.test(d.text), 'lời mời nói rõ cần người giám hộ, phải tiếp tục học');
  ok(!d.data.keys.includes('sign') && !d.data.keys.includes('parents'), 'chưa audition thì chưa thể ký hay thưa bố mẹ');
  choose(l, 'scout155', 'read'); ok(/20 giờ \/ tuần/.test(I.S(l).step) && /Không bảo đảm debut/.test(I.S(l).step), 'tìm hiểu công ty: hợp đồng, giờ tập giới hạn cho trẻ vị thành niên');
  const s = signed(); const st = I.S(s), a = L.state(s).agency;
  ok(st.stage === 'junior' && a.status === 'junior155' && a.minor155, 'ký thỏa thuận: thực tập sinh bán thời gian');
  ok(s.school === 'THPT' && !s.abroad, 'vẫn đi học, không sang nước ngoài khi chưa đủ 18 tuổi');
  ok(st.peers.length === 11 && st.peers.every(p => p.name && p.skill > 0 && p.kind), 'có 11 thực tập sinh khác với năng lực, tính cách riêng');
  // Bố mẹ từ chối
  let refused = false; for (let i = 0; i < 60 && !refused; i++) { const l2 = kid({ seed: 3000 + i }); openScout(l2); choose(l2, 'scout155', 'audition'); if (I.S(l2).offer && I.S(l2).offer.audition === 'pass') { choose(l2, 'scout155', 'parents'); if (I.S(l2).offer.parents === 'no') { refused = true; ok(!top(l2, 'scout155') || !top(l2, 'scout155').data.keys.includes('sign'), 'bố mẹ chưa đồng ý: không thể ký'); } } }
  ok(refused, 'có trường hợp bố mẹ chưa đồng ý');
  let failed = false; for (let i = 0; i < 40 && !failed; i++) { const l3 = kid({ seed: 4000 + i, sing: 15, dance: 15 }); openScout(l3); choose(l3, 'scout155', 'audition'); failed = I.S(l3).offer && I.S(l3).offer.audition === 'fail'; }
  ok(failed, 'kỹ năng yếu có thể trượt audition');
}

// ---------- D3: đánh giá tháng, xếp hạng, 18 tuổi chuyển sang toàn thời gian ----------
{
  const l = signed({ age: 15 }); const st = I.S(l); const back = E.migrate(clone(l)); ok(back.flags.idol155.stage === 'junior', 'tải lại giữ trạng thái thực tập sinh');
  const sing0 = L.skill(l, 'sing').level, debt0 = st.debt;
  year(E, l); // cuối năm lên lịch đánh giá
  ok(st.debt > debt0, 'chi phí đào tạo được ghi nợ để trừ sau khi có thu nhập');
  year(E, l); // năm sau: 3 kỳ đánh giá (tự động)
  ok(st.months >= 3, 'có 3 kỳ đánh giá trong năm (' + st.months + ')');
  ok(st.evals.length >= 3 && st.evals.every(e => e.rank >= 1 && e.rank <= 12), 'mỗi kỳ có điểm và thứ hạng trong lứa');
  ok(L.skill(l, 'sing').level !== sing0 || L.skill(l, 'dance').level !== 60, 'luyện tập thay đổi kỹ năng');
  ok(l.school, 'vẫn đi học trong thời gian thực tập bán thời gian');
  while (l.age < 18) year(E, l);
  year(E, l);
  const a = L.state(l).agency; ok(st.stage === 'trainee' && a.status === 'offer' && a.docs, 'đủ 18 tuổi: được mời sang Hàn Quốc toàn thời gian qua luồng sẵn có (' + a.status + ')');
  ok(E.DEC.audition139 && E.DEC.audition139.make(l, () => 0).data.keys.includes('prep'), 'mục Audition sẵn có hiện bước chuẩn bị sang nước ngoài');
}

// ---------- D4: debut ----------
{
  const l = signed({ age: 16, sing: 85, dance: 85 }); const st = I.S(l); st.stage = 'trainee'; L.state(l).agency.status = 'trainee'; st.startAge = 14; l.age = 19; l.abroad = { code: 'KR', perm: false, name: 'Hàn Quốc', entertainment139: true };
  st.peers.forEach(p => { p.skill = 30; });
  let formed = false; for (let i = 0; i < 8 && !formed; i++) { l.age++; E.HOOKS.year.forEach(fn => { if (/idol155/.test(String(fn)) && /formGroup/.test(String(fn))) fn(l, () => 0.5, say(l)); }); formed = !!st.group; }
  ok(formed && st.stage === 'debut' && L.state(l).agency.status === 'debut' && l.job.id === 'ca_si', 'xếp hạng cao: được chọn vào đội hình, chuyển sang nghệ sĩ');
  ok(l.sched.some(x => x.id === 'debut155'), 'bước chọn vị trí được lên lịch');
  l.pending = [E.DEC.debut155.make(l, () => 0, { step: 'pos' })]; l.pending[0].manual = true;
  ok(Object.keys(I.POS).every(k => l.pending[0].data.keys.includes(k)), 'chọn vị trí: hát, nhảy, rap, gương mặt, trưởng nhóm');
  choose(l, 'debut155', 'dance'); choose(l, 'debut155', 'bright');
  ok(st.group.position === 'dance' && st.group.fandom > 0 && st.group.albums.length === 1, 'ra mắt: vị trí, fandom, đĩa đầu');
  st.debt = l.base * 0.5; const m0 = l.money, debt0 = st.debt; l.age++; I.idolYear(l, () => 0.5, say(l));
  ok(st.debt < debt0, 'thu nhập trừ dần nợ đào tạo trước');
  const m1 = l.money; I.idolYear(l, () => 0.5, say(l)); ok(l.money === m1, 'không nhận thu nhập hai lần trong một năm');
  for (let i = 0; i < 4; i++) { l.age++; I.idolYear(l, () => 0.5, say(l)); }
  ok(st.group.albums.length >= 5 && st.group.fandom > 5000, 'quảng bá nhiều năm, fandom tăng');
}

// ---------- D5: chương trình sống còn ----------
{
  ok(SH.canJoin(kid({ age: 18, birth: 2000 }), SH.SHOWS.produce101, 'trainee') !== true, 'người không phải thực tập sinh không dự thi');
  const t = signed({ age: 16, birth: 2000, sex: 'F' }); t.age = 18; L.state(t).agency.status = 'trainee'; I.S(t).stage = 'trainee';
  ok(SH.canJoin(t, SH.SHOWS.produce101, 'trainee') === true, 'thực tập sinh đủ điều kiện Produce 101 (' + (t.birthYear + t.age) + ')');
  { const t2 = signed({ age: 16, birth: 2005, sex: 'F' }); t2.age = 18; L.state(t2).agency.status = 'trainee'; ok(/dành cho nam/.test(SH.canJoin(t2, SH.SHOWS.boysplanet, 'trainee') || ''), 'Boys Planet chỉ dành cho nam: ' + SH.canJoin(t2, SH.SHOWS.boysplanet, 'trainee')); }
  let debuted = 0, out = 0;
  for (let s = 0; s < 12; s++) {
    const x = signed({ age: 16, birth: 2003, seed: 7000 + s * 61, sex: 'F', sing: 50 + s * 4, dance: 50 + s * 4 }); x.age = 18; L.state(x).agency.status = 'trainee'; I.S(x).stage = 'trainee'; x.st.hea = 90;
    SH.begin(x, H.rf(x), say(x), 'girlsplanet', 'trainee');
    let n = 0; while (top(x, 'show151_step') && n++ < 30) { const d = top(x, 'show151_step'); x.pending = x.pending.filter(y => y !== d); x.pending.unshift(d); E.resolve(x, E.autoKey(x)); }
    const h = SH.S(x).history.slice(-1)[0]; ok(h && h.id === 'girlsplanet' && /debut|dừng chân|xếp hạng/.test(h.result), 'sống còn #' + s + ': ' + h.result);
    if (/lọt vào đội hình/.test(h.result)) { debuted++; ok(I.S(x).group && I.S(x).group.project, 'vào đội hình: nhóm dự án'); } else out++;
    ok(!x.partner, 'không phát sinh quan hệ tình cảm trong chương trình có người chưa thành niên');
  }
  ok(debuted >= 1 && out >= 1, 'có người debut, có người dừng chân (không mặc định thắng): ' + debuted + '/' + (debuted + out));
}

{ // vòng concept: chọn bài hát hợp thế mạnh
  const x = signed({ age: 16, birth: 2000, seed: 7777, sex: 'F', sing: 90, dance: 30 }); x.age = 18; L.state(x).agency.status = 'trainee'; I.S(x).stage = 'trainee';
  SH.begin(x, H.rf(x), say(x), 'produce101', 'trainee'); const A = SH.S(x).active; A.round = 3; x.pending = []; SH.queue(x, H.rf(x));
  const d = top(x, 'show151_step'); ok(['song:dark', 'song:ballad', 'song:bright'].every(k => d.data.keys.includes(k)), 'vòng concept có chọn bài hát');
  ok(E.DEC.show151_step.auto(x, d, () => 0.5) === String(d.data.keys.indexOf('song:ballad')), 'giọng hát mạnh thì chọn bài giàu cảm xúc');
}
// ---------- Tự động: một đời được chú ý từ 15 tuổi, chạy tiếp nhiều năm không lỗi ----------
{
  for (let s = 0; s < 5; s++) { const l = signed({ seed: 9000 + s * 37, age: 15 }); for (let y = 0; y < 10 && l.alive; y++) year(E, l); ok(Number.isFinite(l.money) && ['junior', 'trainee', 'debut', 'left'].includes(I.S(l).stage), 'tự động #' + s + ': ' + I.S(l).stage + ', ' + l.age + ' tuổi'); }
}
console.log('PASS showbiz-idol: ' + checks + ' kiểm tra.');
