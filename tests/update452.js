'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert');
const root = path.join(__dirname, '..', 'public'), html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const [, file] of html.matchAll(/<script src="(js\/[^?]+)\?v=[^"]+"><\/script>/g)) if (!['js/app.js', 'js/music.js', 'js/card.js'].includes(file)) vm.runInThisContext(fs.readFileSync(path.join(root, file), 'utf8'), { filename: file });
const { E, U } = globalThis.G;
let checks = 0;
function ok(x, label) { assert.ok(x, label); checks++; }
function rng(seed) { const s = { rs: seed }; return () => U.rand(s); }
function life(seed = 82001, age = 28, year = 2060) { const l = E.createLife({ mode: 'vn', seed, gender: 'M' }); l.age = age; l.birthYear = year - age; l.indep = true; l.pending = []; l.school = null; l.st.hea = 100; l.money = 500; E.startJob(l, 'dien_vien', rng(1), () => {}); l.fame = 5e5; return l; }
function join(l, k, manual = false) { l.pending = [E.DEC.gameshow.make(l, rng(l.rs))]; l.pending[0].manual = manual; E.resolve(l, k); E.resolve(l, 'regular'); delete l.flags.variety.compact; l.flags.variety.stage=0; const d=E.DEC.vr_vong.make(l,rng(l.rs)); d.manual=manual; l.pending=[d]; }
function complete(l) { let guard = 0; while (l.pending.some(d => d.id === 'vr_vong') && guard++ < 40) E.resolve(l, 'team'); ok(guard <= 31, 'chuỗi hữu hạn, không lặp vô tận'); }
ok(globalThis.G.VERSION === JSON.parse(fs.readFileSync(path.join(root, '..', 'package.json'), 'utf8')).version && !html.includes('?v=4.5.1'), 'phiên bản và toàn bộ tài nguyên đã đổi cache key');
const teams = new Set(), tasks = new Set(); let winSeasons = 0, loseSeasons = 0;
for (const k of ['rm', 'hai']) for (let i = 0; i < 35; i++) {
  const l = life(82100 + i), age = l.age, year = l.birthYear + l.age, cash = l.money;
  join(l, k, true); const v = l.flags.variety;
  ok(l.money === cash && v && !v.done, 'chưa quay không được nhận cát-xê trước');
  ok(!E.DEC.tv_moi.valid(l, {}) && !E.DEC.gameshow.valid(l, {}), 'không nhận show âm nhạc / mùa khác khi kín lịch');
  while (l.pending[0] && l.pending[0].id === 'vr_vong') {
    const v = l.flags.variety, all = v.team.concat(v.opponents);
    ok(v.team.length === 4 && v.opponents.length === 4 && new Set(all).size === 8 && v.team[0] === l.name, 'hai đội đủ người, không trùng người / không mất người chơi');
    ok(v.guests.length === 2 && new Set(v.guests).size === 2, 'mỗi chuyến có hai khách mời khác nhau');
    ok(l.pending[0].manual === true, 'chủ động tham gia thì tiếp tục cho tự chọn, kể cả bật tự động');
    ok(l.age === age && l.birthYear + l.age === year, 'các chặng diễn ra trong cùng năm');
    teams.add(v.team.join('|')); tasks.add(v.task);
    E.resolve(l, 'team');
  }
  ok(v.done && v.completed === 6 && v.history.length === 30 && v.paid, 'mỗi mùa có đủ save cũ sáu tập / 30 lựa chọn và quyết toán');
  ok(l.money === cash + v.fee && v.earned === v.fee, 'trả đúng một lần cát-xê hoàn thành');
  ok(new Set(v.routes).size === 6 && new Set(v.tasks).size === 6, 'địa điểm và nhiệm vụ thay đổi theo chuyến');
  ok(!E.DEC.gameshow.valid(l, {}), 'không nhận lại mùa thứ hai trong cùng năm');
  const entries = l.log.filter(e => e.a === age && e.k !== 'money').map(e => e.t);
  ok(new Set(entries).size === entries.length, 'mỗi chuyến có nhật ký riêng, không lặp một kết quả như cùng một sự kiện');
  if (v.wins > 0) winSeasons++; if (v.wins < 6) loseSeasons++;
  if (k === 'rm') for (let ep = 0; ep < 6; ep++) {
    const before = v.history.find(h => h.ep === ep && h.stage === 1), after = v.history.find(h => h.ep === ep && h.stage === 2);
    ok(before.team.filter(n => !after.team.includes(n)).length === 1 && after.score >= before.score, 'đổi đúng một đồng đội và giữ điểm Running Man');
  }
}
ok(teams.size > 100 && tasks.size >= 12 && winSeasons > 10 && loseSeasons > 10, 'đa dạng đội / trò chơi / cả thắng và thua');
{
  const l = life(); join(l, 'hai'); const first = JSON.parse(JSON.stringify(l.pending[0])); E.resolve(l, 'team'); const stage = l.flags.variety.stage;
  E.DEC.vr_vong.apply(l, first, 'team', rng(1), () => {});
  ok(l.flags.variety.stage === stage, 'lựa chọn cũ không cho nhảy vòng hai lần');
  for (let i = 0; i < 4; i++) E.resolve(l, 'team');
  ok(l.flags.variety.completed === 1, 'đã hoàn thành một chuyến');
  E.resolve(l, 'quit'); const v = l.flags.variety, expected = Math.round(v.fee / v.total);
  ok(v.done && v.completed === 1 && v.earned === expected && l.money === 500 + expected, 'rút lui được trả đúng phần đã quay');
  const money = l.money; E.DEC.vr_vong.apply(l, first, 'quit', rng(1), () => {}); ok(l.money === money, 'không nhận lại tiền bằng lựa chọn cũ');
}
{
  const l = life(83000); join(l, 'rm'); for (let i = 0; i < 6; i++) E.resolve(l, 'team');
  const clone = JSON.parse(JSON.stringify(l));
  complete(l); complete(clone);
  ok(JSON.stringify(l.flags.variety) === JSON.stringify(clone.flags.variety) && l.money === clone.money, 'lưu / tải giữa mùa giữ nguyên đội, RNG, điểm và tiền');
}
for (const why of ['jail', 'kill', 'health', 'year']) {
  const l = life(83100); join(l, 'hai'); for (let i = 0; i < 5; i++) E.resolve(l, 'team');
  const log = (t, k) => l.log.push({ t, k });
  if (why === 'jail') { E.H.jail(l, 2, 'kiểm thử', log); ok(!E.DEC.vr_vong.valid(l, {}) && !l.pending.some(d => d.id === 'vr_vong'), 'vào tù dừng quay và dọn lựa chọn'); }
  else if (why === 'kill') { E.H.kill(l, 'kiểm thử', log); ok(l.log.at(-1).k === 'death' && !l.pending.length, 'không kể chuyện quay show sau khi chết'); }
  else { if (why === 'health') l.st.hea = 10; else l.age++; E.VARIETY.year(l, rng(1), log); }
  ok(l.flags.variety.done && l.flags.variety.completed === 1 && l.flags.variety.earned === Math.round(l.flags.variety.fee / l.flags.variety.total), 'gián đoạn chỉ trả phần thực quay: ' + why);
}
{
  const l = life(); join(l, 'rm'); E.resolve(l, 'team'); l.flags.variety.injured = true;
  ok(!E.DEC.vr_vong.make(l, rng(1)).opts.some(o => o.k === 'hard'), 'chấn thương không tiếp tục phần vận động mạnh');
  const young = life(83200, 17); ok(!E.DEC.gameshow.valid(young, {}), 'chưa đủ tuổi không vào mùa quay người lớn');
  const old = life(83200, 76); ok(!E.DEC.gameshow.valid(old, {}), '76 tuổi không vào trò chạy nhảy cường độ cao');
  const music = life(); music.flags.tv = { k: 'atsh', y: music.birthYear + music.age, i: 0 }; ok(!E.DEC.gameshow.valid(music, {}), 'show âm nhạc đang quay chặn lịch show vận động');
  const oldInvite = E.DEC.tv_moi.make(music, rng(1)), current = music.flags.tv;
  E.DEC.tv_moi.apply(music, oldInvite, 'nhan', rng(2), () => {});
  ok(music.flags.tv === current, 'lời mời âm nhạc cũ không ghi đè mùa đang quay');
}
{
  const l = life(83300, 25, 2100); E.startJob(l, 'ca_si', rng(2), () => {}); l.flags.tv = { k: 'thsh', s: 'Tinh Hà mô phỏng', i: E.TV_FMT.thsh.rounds.length - 1, pts: 20, saved: 0, awards: [], leads: 0 };
  const d = E.DEC.tv_vong.make(l, rng(3));
  ok(d.data.m.length === 4 && new Set(d.data.m).size === 4 && !d.data.m.some(n => /HIEUTHUHAI|Quang Hùng|SOOBIN/.test(n)), 'năm 2100 dùng thế hệ nghệ sĩ mới, không kéo nghệ sĩ thật quá tuổi đi thi');
  const money = l.money; const logs = []; E.DEC.tv_vong.apply(l, d, 'ganh', () => 0, t => logs.push(t));
  ok(l.flags.tv.res === 'win' && l.money - money === 1000, 'quán quân Tinh Hà nhận đúng một khoản 1 tỷ');
  const paid = l.money; E.DEC.tv_vong.apply(l, d, 'ganh', () => 0, () => {}); ok(l.money === paid, 'chung kết đã xong không trao tiền giải lần nữa');
  ok(!E.tvShowsFor(l).includes('thsh'), 'quán quân mùa hiện tại không được mời thi lại chính show đó');
}
{
  const l = life(); l.age = 70; l.kids = []; l.partner = { sex: l.sex, alive: true, status: 'cohabit' };
  const text = E.famLogic(l, 'Con cháu tổ chức lễ mừng thọ 70 tuổi.', true);
  ok(/người bạn đời/.test(text) && !/vợ chồng|con cháu/.test(text), 'mừng thọ đúng hoàn cảnh: bạn đời cùng giới, không con cháu');
  l.partner.alive = false;
  ok(!/vợ chồng|người bạn đời/.test(E.famLogic(l, 'Con cháu tổ chức lễ mừng thọ 70 tuổi.', true)), 'không để người bạn đời đã mất tổ chức mừng thọ');
}
console.log('PASS: ' + checks + ' kiểm tra bản 4.5.2.');
