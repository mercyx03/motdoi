/* Showbiz — Mốc 3: show hẹn hò thực tế (Hàn Quốc) và cuộc thi âm nhạc (Rap Việt, Giọng Hát Việt, Vietnam Idol, Ca Sĩ Mặt Nạ, HLV / giám khảo). */
'use strict';
const assert = require('assert');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, H = E.H, SH = E.SHOW151;
let checks = 0;
const ok = (c, m) => { assert(c, m); checks++; };
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
function life(o = {}) {
  const l = E.createLife({ mode: 'vn', seed: o.seed || 1530, year: o.birth || 1996 });
  Object.assign(l, { age: o.age || 26, edu: 5, indep: true, school: null, pending: [], partner: null, jailUntil: null, abroad: o.kr ? { code: 'KR', perm: true, name: 'Hàn Quốc' } : null });
  l.flags.military = 0; l.money = l.base * 10; l.st.kno = 70; l.st.hea = 85; l.st.soc = 70; l.fame = o.fame || 0;
  if (o.job) E.startJob(l, o.job, () => 0, () => { }, true);
  if (o.sing != null && E.LIFE138) E.LIFE138.skill(l, 'sing').level = o.sing;
  if (o.skill != null) l.skill = o.skill;
  return l;
}
function step(l) { return l.pending.find(d => d.id === 'show151_step'); }
function choose(l, k) { const d = step(l), i = d.data.keys.indexOf(k); assert(i >= 0 && d.opts.some(o => o.k === String(i)), 'có ' + k + ' (' + d.data.keys + ')'); l.pending = l.pending.filter(x => x !== d); l.pending.unshift(d); E.resolve(l, String(i)); }
function autoplay(l, max = 300) { let n = 0; while (step(l) && n++ < max) { const d = step(l); l.pending = l.pending.filter(x => x !== d); l.pending.unshift(d); E.resolve(l, E.autoKey(l)); } return n; }
const last = l => SH.S(l).history.slice(-1)[0];

// ---------- Show hẹn hò ----------
{
  ok(SH.canJoin(life(), SH.SHOWS.singlesinferno, 'player') !== true, 'ở Việt Nam bình thường chưa tham gia show hẹn hò Hàn Quốc');
  const taken = life({ kr: true }); taken.partner = { name: 'X', sex: 'F', age: 26, status: 'dating', alive: true };
  ok(/độc thân/.test(SH.canJoin(taken, SH.SHOWS.heartsignal, 'player')), 'đang có người yêu thì không tham gia show độc thân');
  ok(/20–40/.test(SH.canJoin(life({ kr: true, age: 18, birth: 2005 }), SH.SHOWS.iamsolo, 'player')), 'dưới 20 tuổi không tham gia');
  ok(/chia tay/.test(SH.canJoin(life({ kr: true }), SH.SHOWS.exchange, 'player')), 'EXchange cần từng có người yêu cũ');
  // Chơi có chủ đích: chọn đúng gu của một người, cuối chương trình hai người cùng chọn nhau
  const l = life({ kr: true, seed: 5 }); SH.begin(l, H.rf(l), say(l), 'heartsignal', 'player');
  const a = SH.S(l).active; ok(a.people.length === 4 && a.people.every(p => p.sex !== l.sex || l.orient === 'gay'), 'có 4 người tham gia với hồ sơ riêng');
  ok(a.people.every(p => p.name && p.age >= 20 && p.job && p.trait && p.likes), 'hồ sơ gồm tên, tuổi, nghề, tính cách, gu');
  const target = a.people[1];
  choose(l, 'honest');
  let n = 0;
  while (SH.S(l).active && n++ < 80) {
    const A = SH.S(l).active;
    if (A.phase === 'activity') choose(l, 'all');
    else if (A.phase === 'date') choose(l, 'd' + target.id);
    else if (A.phase === 'talk') choose(l, 't' + (A.dateWith === target.id ? target.likes : 'warm'));
    else if (A.phase === 'signal') choose(l, 's' + target.id);
    else if (A.phase === 'event') choose(l, A.event.rows[0][0]);
    else if (A.phase === 'final') choose(l, 'f' + target.id);
    else break;
  }
  const h = last(l); ok(h && h.id === 'heartsignal', 'chương trình kết thúc: ' + (h && h.result));
  ok(target.attr > 55 || /chọn người khác/.test(h.result), 'mức hấp dẫn tăng khi đúng gu (' + target.attr + ')');
  if (/cùng .* chọn nhau/.test(h.result)) { const lv = l.pending.find(d => d.id === 'love'); ok(lv && lv.data.p.name === target.name, 'ghép đôi: mở bước tìm hiểu sau chương trình với đúng người'); E.DEC.love.apply(l, lv, 'yes', () => 0.5, say(l)); ok(l.partner && l.partner.name === target.name && l.partner.status === 'dating', 'tiếp tục hẹn hò sau chương trình'); ok(E.ELITE148.people(l).some(p => p.name === target.name && p.dating153), 'người ấy có danh tính lâu dài trong mạng lưới'); }
  // Một phía chọn thì không thành đôi
  const l2 = life({ kr: true, seed: 6 }); SH.begin(l2, H.rf(l2), say(l2), 'singlesinferno', 'player'); const A2 = SH.S(l2).active; A2.people.forEach(p => { p.attr = 10; p.rival = 60; }); A2.phase = 'final'; A2.day = 4;
  l2.pending = []; SH.queue(l2, H.rf(l2)); choose(l2, 'f' + A2.people[0].id); ok(/chọn người khác/.test(last(l2).result) && !l2.pending.some(d => d.id === 'love'), 'chỉ một phía chọn: không thành đôi, không tự tạo người yêu');
  // Tự động: chơi hết mọi show hẹn hò
  for (const id of ['singlesinferno', 'heartsignal', 'exchange', 'iamsolo']) for (let s = 0; s < 4; s++) { const x = life({ kr: true, seed: 50 + s }); x.exes = 1; SH.begin(x, H.rf(x), say(x), id, 'player'); const steps = autoplay(x); ok(!SH.S(x).active && last(x).id === id && steps > 3, id + ' tự động #' + s + ': ' + last(x).result); }
}

// ---------- Âm nhạc ----------
{
  ok(SH.canJoin(life({ job: 'ke_toan' }), SH.SHOWS.rapviet, 'contestant') !== true, 'người không có năng khiếu không thi Rap Việt');
  ok(SH.canJoin(life({ job: 'rapper' }), SH.SHOWS.rapviet, 'contestant') === true, 'rapper được thi Rap Việt');
  const old = life({ job: 'ca_si', birth: 1988 }); old.age = 26; ok(SH.canJoin(old, SH.SHOWS.ghv, 'contestant') === true, 'năm 2014 có Giọng Hát Việt');
  const now = life({ job: 'ca_si' }); ok(/ngừng/.test(SH.canJoin(now, SH.SHOWS.ghv, 'contestant')), 'Giọng Hát Việt đã ngừng sau 2019');
  const idolGap = life({ job: 'ca_si', birth: 1995, age: 25 }); idolGap.age = 25; ok(SH.canJoin(idolGap, SH.SHOWS.vnidol, 'contestant') !== true, 'Vietnam Idol tạm dừng 2017–2022 (năm ' + (idolGap.birthYear + idolGap.age) + ')');
  const idolBack = life({ job: 'ca_si', birth: 1999, age: 24 }); idolBack.age = 24; ok(SH.canJoin(idolBack, SH.SHOWS.vnidol, 'contestant') === true, 'Vietnam Idol trở lại năm 2023');
  ok(/nổi tiếng/.test(SH.canJoin(life({ job: 'ca_si' }), SH.SHOWS.csmn, 'celeb') || ''), 'Ca Sĩ Mặt Nạ chỉ dành cho nghệ sĩ nổi tiếng');
  // Giọng hát tốt đi xa hơn giọng hát kém (thống kê trên nhiều lượt)
  const reach = (sing, id, extra) => { let tot = 0; for (let s = 0; s < 30; s++) { const x = life(Object.assign({ job: 'ca_si', sing, skill: sing, seed: 900 + s }, extra || {})); SH.begin(x, H.rf(x), say(x), id, 'contestant'); autoplay(x); tot += SH.S(x).history.slice(-1)[0].result === 'quán quân' ? 6 : (x.flags.show151.history.slice(-1)[0].rank ? 4 : 0) + (/dừng chân ở Vòng (tuyển chọn|giấu mặt)/.test(last(x).result) ? 0 : 1); } return tot; };
  const good = reach(90, 'rapviet', { job: 'rapper' }), bad = reach(15, 'rapviet', { job: 'rapper' });
  ok(good > bad, 'giọng / kỹ năng tốt đi xa hơn (' + good + ' so với ' + bad + ')');
  // Nón vàng: cả bốn HLV chọn thì bỏ qua vòng đối đầu
  let golden = false; for (let s = 0; s < 40 && !golden; s++) { const x = life({ job: 'rapper', sing: 100, skill: 100, seed: 1200 + s }); SH.begin(x, H.rf(x), say(x), 'rapviet', 'contestant'); choose(x, 'safe'); if (SH.S(x).active && SH.S(x).active.skipNext) { golden = true; ok(SH.S(x).active.turned.length === 4, 'nón vàng khi cả bốn HLV chọn'); while (SH.S(x).active && SH.S(x).active.pendingCoach) choose(x, 'c0'); ok(!SH.S(x).active || SH.S(x).active.si === 2, 'nón vàng: vào thẳng vòng bứt phá'); } }
  ok(golden, 'có trường hợp nhận nón vàng');
  // Giấu mặt: nhiều HLV quay ghế thì được chọn đội
  let chooseTeam = false; for (let s = 0; s < 40 && !chooseTeam; s++) { const x = life({ job: 'ca_si', birth: 1988, sing: 95, skill: 95, seed: 1400 + s }); x.age = 26; SH.begin(x, H.rf(x), say(x), 'ghv', 'contestant'); choose(x, 'safe'); const A = SH.S(x).active; if (A && A.pendingCoach) { chooseTeam = true; ok(/Bạn về đội ai/.test(step(x).text), 'có bước chọn HLV'); choose(x, 'c1'); ok(SH.S(x).active.coach === A.turned[1], 'về đúng đội đã chọn'); } }
  ok(chooseTeam, 'có trường hợp nhiều HLV quay ghế');
  // Ca Sĩ Mặt Nạ: lộ đủ 3 gợi ý thì phải tháo mặt nạ
  const star = life({ job: 'ca_si', fame: 5e5, birth: 1996, sing: 80, skill: 80, seed: 7 }); star.age = 26; SH.begin(star, H.rf(star), say(star), 'csmn', 'celeb');
  ok(SH.S(star).active.mask && step(star).data.keys.includes('hide'), 'có mặt nạ và lựa chọn giấu thân phận'); autoplay(star); ok(/Mặt nạ vàng|dừng chân/.test(last(star).result), 'Ca Sĩ Mặt Nạ có kết quả: ' + last(star).result);
  // HLV / giám khảo
  const coach = life({ job: 'ca_si', fame: 2e6, age: 32, seed: 8 }); ok(SH.canJoin(coach, SH.SHOWS.rapviet, 'coach') === true, 'ca sĩ rất nổi tiếng làm HLV Rap Việt');
  ok(SH.canJoin(life({ job: 'ca_si', fame: 5e4, age: 32 }), SH.SHOWS.rapviet, 'coach') !== true, 'chưa đủ nổi tiếng thì chưa làm HLV');
  const m = coach.money; SH.begin(coach, H.rf(coach), say(coach), 'rapviet', 'coach'); ok(coach.money > m, 'HLV nhận cát-xê');
  ok(/Chọn thí sinh/.test(step(coach).title), 'HLV chọn thí sinh cho đội'); autoplay(coach); ok(/đội bạn/.test(last(coach).result) && last(coach).role === 'coach', 'HLV đi hết mùa: ' + last(coach).result);
  // Tự động: mọi cuộc thi âm nhạc chơi hết
  for (const [id, o] of [['rapviet', { job: 'rapper' }], ['ghv', { job: 'ca_si', birth: 1988 }], ['vnidol', { job: 'ca_si', birth: 1999, age: 24 }], ['csmn', { job: 'ca_si', fame: 5e5, birth: 1997 }]]) for (let s = 0; s < 5; s++) { const x = life(Object.assign({ seed: 70 + s, sing: 60, skill: 60 }, o)); if (o.age) x.age = o.age; const role = id === 'csmn' ? 'celeb' : 'contestant'; assert.strictEqual(SH.canJoin(x, SH.SHOWS[id], role), true, id + ' đủ điều kiện ' + SH.canJoin(x, SH.SHOWS[id], role)); SH.begin(x, H.rf(x), say(x), id, role); autoplay(x); ok(!SH.S(x).active && last(x).id === id, id + ' tự động #' + s + ': ' + last(x).result); }
}
console.log('PASS showbiz-dating-music: ' + checks + ' kiểm tra.');
