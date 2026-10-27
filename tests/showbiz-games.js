/* Showbiz — Mốc 3: trò chơi nhỏ có luật thật, Running Man / 2 Ngày 1 Đêm dùng trò chơi ở chặng đặc trưng,
   Running Man Hàn Quốc / New Journey to the West, gameshow chiến thuật (The Genius, The Devil's Plan, Bloody Game). */
'use strict';
const assert = require('assert');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, H = E.H, SH = E.SHOW151, M = E.MINI152;
let checks = 0;
const ok = (c, m) => { assert(c, m); checks++; };
const clone = o => JSON.parse(JSON.stringify(o));
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
function life(o = {}) {
  const l = E.createLife({ mode: 'vn', seed: o.seed || 1520, year: o.birth || 1995 });
  Object.assign(l, { age: o.age || 30, edu: 5, indep: true, school: null, pending: [], partner: null, jailUntil: null, abroad: o.abroad || null });
  l.flags.military = 0; l.money = l.base * 10; l.st.kno = o.kno == null ? 80 : o.kno; l.st.hea = 90; l.fame = o.fame || 0;
  if (o.job) E.startJob(l, o.job, () => 0, () => { }, true);
  return l;
}
function top(l, id) { return l.pending.find(d => d.id === id); }
function pick(l, id, k) { const d = top(l, id); assert(d, 'đang có ' + id); const keys = d.data && d.data.keys, key = keys ? String(keys.indexOf(k)) : k; assert(d.opts.some(o => o.k === key), id + ' có ' + k + ' (' + (keys || d.opts.map(o => o.k)) + ')'); l.pending = l.pending.filter(x => x !== d); l.pending.unshift(d); E.resolve(l, key); }
function autoAll(l, ids, max = 400) { let n = 0; while (n++ < max) { const d = l.pending.find(x => ids.includes(x.id)); if (!d) break; l.pending = l.pending.filter(x => x !== d); l.pending.unshift(d); E.resolve(l, E.autoKey(l)); } return n; }

// ---------- Trò chơi nhỏ: luật xác định, người chơi giỏi thắng nhiều hơn ----------
{
  const rate = (kind, good) => { let w = 0; for (let i = 0; i < 300; i++) { const st = M.MINI[kind].init('x' + kind + i, { names: ['A', 'B', 'C'] }); let res, g = 0; do { res = M.MINI[kind].play(st, M.MINI[kind].auto(st, () => good ? 0.01 : 0.99, good ? 0.99 : 0.01)); } while (!res.done && g++ < 20); if (res.won) w++; } return w / 300; };
  for (const k of ['chase', 'clue', 'rps', 'guess']) { const g = rate(k, true), b = rate(k, false); ok(g >= b + 0.3, k + ': chơi đúng chiến thuật thắng nhiều hơn rõ rệt (' + g.toFixed(2) + ' so với ' + b.toFixed(2) + ')'); }
  // Manh mối luôn đủ để xác định duy nhất một nơi
  for (let i = 0; i < 300; i++) { const st = M.MINI.clue.init('c' + i); const P = st.attrs.filter(p => st.clues.every(c => ({ 'Ở ngoài trời': p.out, 'Ở trong nhà': !p.out, 'Gần nước': p.water, 'Không có nước': !p.water, 'Ở trên cao': p.high, 'Không ở trên cao': !p.high, 'Gần lối ra vào': p.gate, 'Xa lối ra vào': !p.gate })[c])); ok(P.length === 1 && P[0].n === st.target, 'manh mối xác định đúng một nơi'); }
  // Đoán số: tìm kiếm nhị phân luôn tìm ra trong 6 lần
  for (let i = 0; i < 200; i++) { const st = M.MINI.guess.init('g' + i); let res; do { { const o = M.MINI.guess.options(st); res = M.MINI.guess.play(st, 'g' + o[Math.floor(o.length / 2)]); } } while (!res.done); ok(res.won, 'đoán giữa khoảng luôn tìm ra số'); }
  // Nim: để lại bội số của 4 là thế thắng
  ok([5, 6, 7, 9, 10, 11].every(n => (n - M.nimBest(n)) % 4 === 0), 'Nim: nước đi tối ưu để lại bội số của 4');
  // Chiến thuật NPC: ăn miếng trả miếng phản bội sau khi bị phản bội
  ok(M.npcPD({ style: 'fair' }, [{ me: 'D' }], () => 0.5) === 'D' && M.npcPD({ style: 'fair' }, [{ me: 'C' }], () => 0.5) === 'C', 'NPC "công bằng" chơi ăn miếng trả miếng');
}

// ---------- Running Man Việt Nam / 2 Ngày 1 Đêm: thử thách cũ giữ nguyên, thêm nhiệm vụ đặc biệt sau mỗi tập ----------
{
  for (const k of ['rm', 'hai']) {
    const l = life({ job: 'dien_vien', fame: 3e5, seed: k === 'rm' ? 1 : 2 });
    E.act(l, 'gameshow_moi'); pick(l, 'gameshow', k); pick(l, 'vr_vai_tro', 'regular');
    const v = l.flags.variety; ok(v && v.k === k && v.total === 6, k + ': mùa thành viên cố định 6 tập vẫn như cũ');
    const first = top(l, 'vr_vong'); ok(first && first.opts.some(o => /^pick[0-9]/.test(o.k)) && first.data.challenge51 != null, k + ': thử thách có đáp án của bản cũ vẫn còn ở từng chặng');
    const kinds = new Set(), tokens = new Set(); let n = 0, fee0 = l.money;
    while (!v.done && n++ < 400) {
      const m = top(l, 'mini152'), vr = top(l, 'vr_vong');
      if (m) { kinds.add(l.flags.mini152.kind); tokens.add(l.flags.mini152.token); l.pending = l.pending.filter(x => x !== m); l.pending.unshift(m); E.resolve(l, E.autoKey(l)); }
      else if (vr) { l.pending = l.pending.filter(x => x !== vr); l.pending.unshift(vr); E.resolve(l, E.autoKey(l)); }
      else break;
    }
    while (top(l, 'mini152')) { const m = top(l, 'mini152'); kinds.add(l.flags.mini152.kind); tokens.add(l.flags.mini152.token); l.pending = l.pending.filter(x => x !== m); l.pending.unshift(m); E.resolve(l, E.autoKey(l)); }
    ok(v.done && v.completed === 6, k + ': quay đủ 6 tập (' + v.completed + ')');
    ok(tokens.size === 6, k + ': mỗi tập hoàn thành có một nhiệm vụ đặc biệt (' + tokens.size + ')');
    ok((k === 'rm' ? ['chase', 'clue'] : ['rps', 'bowls', 'guess']).every(x => kinds.has(x)), k + ': nhiệm vụ đặc trưng ' + [...kinds].join(', '));
    ok(l.money > fee0, k + ': nhận cát-xê như cũ');
    ok(!l.flags.mini152, k + ': không còn trò chơi treo');
  }
  // Tải lại giữa trò chơi nhỏ: giữ nguyên trạng thái
  const l = life({ job: 'dien_vien', fame: 3e5, seed: 3 }); E.act(l, 'gameshow_moi'); pick(l, 'gameshow', 'rm'); pick(l, 'vr_vai_tro', 'guest');
  let n = 0; while (!top(l, 'mini152') && top(l, 'vr_vong') && n++ < 10) { const vr = top(l, 'vr_vong'); l.pending = l.pending.filter(x => x !== vr); l.pending.unshift(vr); E.resolve(l, E.autoKey(l)); }
  ok(top(l, 'mini152'), 'hết tập thì mở nhiệm vụ đặc biệt');
  const back = E.migrate(clone(l)); ok(JSON.stringify(back.flags.mini152.st) === JSON.stringify(l.flags.mini152.st), 'tải lại giữa trò chơi: trạng thái giữ nguyên');
}

// ---------- Running Man Hàn Quốc / New Journey to the West ----------
{
  const vn = life({ job: 'ca_si', fame: 3e5 }); ok(SH.canJoin(vn, SH.SHOWS.rmkr, 'guest') !== true, 'ca sĩ Việt Nam bình thường chưa được mời Running Man Hàn Quốc');
  const kr = life({ job: 'ca_si', fame: 3e5, seed: 4 }); kr.abroad = { code: 'KR', perm: true, name: 'Hàn Quốc' };
  ok(SH.canJoin(kr, SH.SHOWS.rmkr, 'guest') === true, 'nghệ sĩ hoạt động ở Hàn Quốc được mời Running Man');
  for (const id of ['rmkr', 'njttw']) {
    const l = life({ job: 'ca_si', fame: 3e5, seed: id.length }); l.abroad = { code: 'KR', perm: true, name: 'Hàn Quốc' };
    SH.begin(l, H.rf(l), say(l), id, 'guest');
    autoAll(l, ['show151_step', 'mini152']);
    const h = SH.S(l).history.slice(-1)[0]; ok(h && h.id === id && /quay 1 tập/.test(h.result) && !SH.S(l).active, id + ': chơi hết tập khách mời: ' + (h && h.result));
    ok(h.earned > 0, id + ': khách mời nhận cát-xê');
  }
}

// ---------- Gameshow chiến thuật ----------
{
  const plain = life({ kno: 40 }); ok(SH.canJoin(plain, SH.SHOWS.genius, 'contestant') !== true, 'người bình thường không đủ điều kiện The Genius');
  for (const id of ['genius', 'devilsplan', 'bloodygame']) {
    for (let s = 0; s < 6; s++) {
      const l = life({ kno: 90, fame: 5e5, seed: 300 + s }); l.abroad = { code: 'KR', perm: true, name: 'Hàn Quốc' };
      if (id === 'genius') { l.birthYear = 1984; l.age = 30; }
      ok(SH.canJoin(l, SH.SHOWS[id], 'contestant') === true, id + ' đủ điều kiện: ' + SH.canJoin(l, SH.SHOWS[id], 'contestant'));
      const m = l.money; SH.begin(l, H.rf(l), say(l), id, 'contestant'); const n = autoAll(l, ['show151_step']);
      const h = SH.S(l).history.slice(-1)[0]; ok(h && !SH.S(l).active && /vô địch|á quân|bị loại/.test(h.result), id + ' #' + s + ': kết thúc có kết quả (' + h.result + ', ' + n + ' bước)');
      ok(l.money >= m && Number.isFinite(l.money), id + ': tiền hợp lệ');
    }
  }
  // Luật đấu giá: hòa giá thì không ai nhận; trả giá trừ chip
  const l = life({ kno: 90, fame: 5e5, seed: 9 }); l.abroad = { code: 'KR', perm: true, name: 'Hàn Quốc' }; SH.begin(l, H.rf(l), say(l), 'devilsplan', 'contestant');
  const a = SH.S(l).active; ok(a.game.k === 'prisoner', "The Devil's Plan mở đầu bằng trò hợp tác / phản bội");
  pick(l, 'show151_step', 'C'); ok(a.game.hist.length === 1 && [0, 3].includes(a.game.me), 'hợp tác: nhận 3 (cùng hợp tác) hoặc 0 (bị phản bội)');
}
console.log('PASS showbiz-games: ' + checks + ' kiểm tra.');
