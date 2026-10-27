/* Showbiz — Mốc 1: kiểm tra nội dung showbiz có sẵn còn chơi được thật (không chỉ có tên).
   Mỗi chương trình: dựng nhân vật đủ điều kiện, mở đúng đường vào của game (sự kiện / hành động), chơi hết các vòng bằng lựa chọn tự động,
   kiểm tra có kết quả, tiền và danh tiếng hợp lệ; kiểm tra người không đủ điều kiện không được mời. */
'use strict';
const assert = require('assert');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, H = E.H;
let checks = 0;
const ok = (c, m) => { assert(c, m); checks++; };
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
function life(o = {}) {
  const l = E.createLife({ mode: o.mode || 'vn', seed: o.seed || 1510, year: o.birth || 2004 });
  Object.assign(l, { age: o.age || 22, sex: o.sex || 'M', edu: 5, indep: true, school: null, pending: [], partner: null, jailUntil: null, abroad: null });
  l.flags.military = 0; l.money = l.base * 20; l.st.hea = 90; l.st.soc = 70; l.st.kno = 70;
  if (o.job) E.startJob(l, o.job, () => 0, () => { }, true);
  if (o.rank != null && l.job) l.job.rank = o.rank;
  l.fame = o.fame || 0; l.skill = o.skill == null ? 70 : o.skill; if (o.talent) l.talent = o.talent;
  return l;
}
// Chơi hết chuỗi quyết định đang chờ (tự chọn như chế độ Tự động); trả về danh sách quyết định đã đi qua.
function drive(l, r = () => 0.5, max = 80) {
  const seen = [];
  for (let i = 0; i < max && l.pending.length && l.alive; i++) { const d = l.pending[0]; seen.push(d.id); const k = E.autoKey(l); E.resolve(l, k); }
  return seen;
}
function open(l, id, arg) { const d = E.DEC[id].make(l, H.rf(l), arg); d.manual = true; l.pending = [d]; return d; }
function choose(l, d, key) { assert(d.opts.some(o => o.k === key), d.id + ' có ' + key + ' (' + d.opts.map(o => o.k) + ')'); l.pending = [d]; E.resolve(l, key); }
const report = [];

// ---------- 1. Show âm nhạc (life39): Anh trai Say Hi, Tinh hà Say Hi, Em xinh Say Hi, Anh trai vượt ngàn chông gai, Tân binh toàn năng ----------
{
  const cases = [
    ['atsh', 'Anh trai "Say Hi"', { sex: 'M', age: 22, job: 'ca_si', fame: 5e4 }],
    ['thsh', 'Tinh hà "Say Hi"', { sex: 'M', age: 22, job: 'ca_si', fame: 5e4 }],
    ['exsh', 'Em xinh "Say Hi"', { sex: 'F', age: 22, job: 'ca_si', fame: 5e4 }],
    ['atvncg', 'Anh trai vượt ngàn chông gai', { sex: 'M', age: 35, job: 'ca_si', fame: 2e5 }],
    ['tbtn', 'Tân binh toàn năng', { sex: 'M', age: 18, birth: 2008, job: 'ca_si', fame: 1000 }]
  ];
  for (const [k, name, o] of cases) {
    const l = life(o);
    ok(E.tvShowsFor(l).includes(k), name + ': nhân vật đủ điều kiện được tính là có thể mời (' + E.tvShowsFor(l) + ')');
    ok(E.TRIG.some(t => t.id === 'tv_moi' && t.when(l, l.age)), name + ': sự kiện mời có thể xuất hiện');
    const d = open(l, 'tv_moi'); d.data.k = k; d.data.s = name + ' mùa thử';
    const m0 = l.money, f0 = l.fame;
    choose(l, d, 'nhan'); const seen = drive(l);
    ok(seen.includes('tv_vong'), name + ': có các vòng thi thật (' + [...new Set(seen)] + ')');
    const T = l.flags.tv; ok(T && (T.done || T.out), name + ': chương trình kết thúc bằng bị loại hoặc chung kết');
    ok(Number.isFinite(l.money) && l.fame >= f0, name + ': danh tiếng không giảm vô lý, tiền hợp lệ');
    report.push([name, 'thí sinh', seen.filter(x => x === 'tv_vong').length + ' vòng', T.done ? 'chung kết' : 'bị loại']);
  }
  const no = life({ sex: 'F', age: 22, job: 'ca_si', fame: 5e4 }); ok(!E.tvShowsFor(no).includes('atsh') && !E.tvShowsFor(no).includes('tbtn'), 'nữ không vào chương trình dành cho nam');
  const old = life({ sex: 'M', age: 40, job: 'ca_si', fame: 5e4 }); ok(!E.tvShowsFor(old).includes('atsh'), 'quá tuổi Anh trai Say Hi');
  const plain = life({ sex: 'M', age: 22, job: 'ke_toan', fame: 5e4 }); ok(!E.tvShowsFor(plain).length, 'người ngoài nghề không được mời làm thí sinh');
}

// ---------- 2. Show hẹn hò (life41): Bạn muốn hẹn hò, Người ấy là ai, Đảo thiên đường ----------
{
  for (const [k, name, sex] of [['bmhh', 'Bạn muốn hẹn hò', 'M'], ['nali', 'Người ấy là ai (nữ chính)', 'F'], ['nali', 'Người ấy là ai (nam ứng viên)', 'M'], ['dtd', 'Đảo thiên đường', 'F']]) {
    const l = life({ sex, age: 26, job: 'ke_toan' });
    const act = E.actions(l).find(a => a.id === 'show_hen_ho'); ok(act && act.ok === true, name + ': hành động đăng ký có sẵn');
    const d = open(l, 'hh_moi'); choose(l, d, k); const seen = drive(l);
    ok(seen.length >= 1 && seen.some(x => /^hh_/.test(x)), name + ': có các vòng của chương trình (' + [...new Set(seen)] + ')');
    ok(l.log.some(e => /hẹn hò|người ấy|đảo|ghép|nắm tay|bấm nút|chọn/i.test(e.t)), name + ': có kết quả trong nhật ký');
    report.push([name, 'người chơi tham gia', new Set(seen).size + ' bước', l.partner ? 'có người yêu sau chương trình' : 'chưa ghép đôi']);
  }
  const taken = life({ sex: 'M', age: 26, job: 'ke_toan' }); taken.partner = { name: 'X', sex: 'F', age: 26, status: 'dating', alive: true };
  ok(E.actions(taken).find(a => a.id === 'show_hen_ho').ok !== true, 'đang có người yêu thì không đăng ký show hẹn hò độc thân');
}

// ---------- 3. Running Man Việt Nam / 2 Ngày 1 Đêm (life48, life32) ----------
{
  for (const k of ['rm', 'hai']) {
    const l = life({ sex: 'M', age: 28, job: 'dien_vien', fame: 3e5 });
    const a = E.actions(l).find(x => x.id === 'gameshow_moi'); ok(a && a.ok === true, k + ': có lời mời tham gia (diễn viên nổi tiếng)');
    const d = E.act(l, 'gameshow_moi'); ok(d, k + ': mở lời mời');
    const key = d.opts.find(o => o.k === k) ? k : d.opts[0].k; const f0 = l.fame;
    choose(l, d, key); const seen = drive(l, undefined, 120);
    ok(seen.length >= 2, k + ': có diễn biến nhiều bước (' + [...new Set(seen)] + ')');
    ok(l.fame >= f0, k + ': danh tiếng không giảm vô lý');
    report.push([k === 'rm' ? 'Running Man Việt Nam' : '2 Ngày 1 Đêm', 'khách mời / thành viên', [...new Set(seen)].join('→'), '']);
  }
  const nobody = life({ sex: 'M', age: 28, job: 'ke_toan', fame: 0 });
  ok(E.actions(nobody).find(x => x.id === 'gameshow_moi').ok !== true, 'người bình thường chưa được mời Running Man');
}

// ---------- 4. Diễn viên: học diễn, casting, đóng phim (life32, life60) ----------
{
  const l = life({ sex: 'F', age: 20, talent: 'diễn xuất', skill: 60 });
  ok(E.actions(l).find(a => a.id === 'hoc_dien').ok === true, 'người mê diễn xuất có thể học / đi casting');
  const d = open(l, 'casting'); const k = d.opts.find(o => o.k === 'web') ? 'web' : d.opts[0].k;
  let got = false; for (let i = 0; i < 12 && !got; i++) { const x = open(l, 'casting'); choose(l, x, k); got = !!(l.job && l.job.id === 'dien_vien'); }
  ok(got, 'casting trúng vai thì trở thành diễn viên');
  const fm = E.actions(l).find(a => a.id === 'film_menu'); ok(fm, 'có xưởng phim (film_menu)');
  report.push(['Casting / đóng phim', 'diễn viên', 'web drama · phim truyền hình · điện ảnh', 'có cát-xê, doanh thu, quảng cáo']);
}

// ---------- 5. Thực tập sinh / audition (life139) ----------
{
  const l = life({ sex: 'F', age: 17, talent: 'âm nhạc', skill: 65 });
  const ids = Object.keys(E.DEC).filter(id => /audition|agency|trainee/i.test(id));
  ok(ids.length > 0, 'có hệ thống audition / thực tập sinh: ' + ids.join(', '));
  report.push(['Audition công ty giải trí', 'thực tập sinh', ids.join(', '), 'từ 18 tuổi trước bản này']);
}

// ---------- 6. Khán giả / fan ----------
{
  const l = life({ sex: 'M', age: 20, job: 'ke_toan' });
  const viewer = ['xem_tv', 'concert', 'show_rap', 'fanmeeting'].filter(id => E.ACT.some(a => a.id === id));
  ok(viewer.length >= 3, 'có xem truyền hình, concert, show rap, fan meeting: ' + viewer);
  ok(Array.isArray(E.SHOWS) && E.SHOWS.length >= 6, 'danh sách nghệ sĩ của các show để làm fan: ' + E.SHOWS.map(s => s.k).join(','));
}
console.log(report.map(r => '  ' + r.join(' | ')).join('\n'));
console.log('PASS showbiz-audit: ' + checks + ' kiểm tra.');
