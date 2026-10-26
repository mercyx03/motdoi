/* Góp ý người chơi — Mốc D: kết giao, người nổi tiếng, mặt tối giới giải trí, giới thiệu đối tượng cho con, quà tặng, cầu hôn. */
'use strict';
const assert = require('assert');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, C = E.ELITE148, D = E.SOCIAL149;
let checks = 0;
const ok = (c, m) => { assert(c, m); checks++; };
const near = (a, b, m, tol) => ok(Math.abs(a - b) <= (tol == null ? Math.max(1e-6, Math.abs(b) * 1e-9) : tol), m + ': ' + a + ' vs ' + b);
const clone = o => JSON.parse(JSON.stringify(o));
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
const last = l => l.log[l.log.length - 1].t;
function life(o = {}) {
  const l = E.createLife({ mode: 'vn', seed: o.seed || 149, year: 1985 });
  Object.assign(l, { age: o.age || 30, edu: 5, indep: true, school: null, pending: [], job: null, jailUntil: null, abroad: null, ownHouse: true, sex: o.sex || 'M' });
  l.flags.military = 0; l.money = l.base * (o.wealth == null ? 2000 : o.wealth); l.kids = []; l.partner = null;
  return l;
}
function enabled(l, id, arg) { const d = E.DEC[id].make(l, () => 0, arg); return d.opts.filter(o => o.k !== 'cancel').map(o => d.data.keys[+o.k]); }
function keys(l, id, arg) { return E.DEC[id].make(l, () => 0, arg).data.keys; }
function pick(l, id, key, r = () => 0, arg) { const d = E.DEC[id].make(l, r, arg), i = d.data.keys.indexOf(key); assert(i >= 0 && d.opts.some(o => o.k === String(i)), id + ': có lựa chọn ' + key + ' (' + enabled(l, id, arg) + ')'); d.manual = true; l.pending = [d]; E.DEC[id].apply(l, d, String(i), r, say(l)); l.pending = l.pending.filter(x => x !== d); return l.pending[0]; }

// ---------- D1. Kết giao ----------
{
  const l = life({ wealth: 200 });
  const p = D.event(l, () => 0.3, say(l));
  ok(p && p.uid110 && C.people(l).includes(p), 'sự kiện giao lưu: quen một người có mã định danh');
  ok(!enabled(l, 'social149').includes('event'), 'mỗi năm một sự kiện');
  ok(enabled(l, 'social149').includes('p:' + p.uid110), 'người mới quen xuất hiện trong danh sách');
  p.trust = 40; p.warmth = 80;
  const t0 = p.trust; ok(D.meal(l, () => 0.01, say(l), p) && p.trust > t0, 'nhận lời ăn tối: tin cậy tăng');
  ok(!D.meal(l, () => 0.01, say(l), p), 'mỗi năm gặp riêng một lần');
  ok(!enabled(l, 'social149_person', { id: p.uid110 }).includes('advice'), 'chưa đủ tin cậy thì chưa xin lời khuyên');
  // Người địa vị cao hơn nhiều dễ từ chối hơn
  const high = C.meet(l, () => 0.3, { tier: 4 }); high.trust = 40; high.warmth = 40;
  ok(!D.meal(l, () => 0.6, say(l), high) && /bận lịch/.test(last(l)), 'người địa vị cao hơn nhiều có thể từ chối');
  p.trust = 80; ok(D.befriend(l, () => 0.01, say(l), p) && l.friends.some(f => f.contact149 === p.uid110), 'kết thân: thành bạn thân, giữ liên kết với NPC');
  ok(!D.befriend(l, () => 0.01, say(l), p) && l.friends.filter(f => f.contact149 === p.uid110).length === 1, 'không nhân đôi bạn thân');
  p.honesty = 10; l.age++; ok(D.advice(l, () => 0.1, say(l), p) === 'doubtful', 'người thiếu trung thực có thể đưa lời khuyên vụ lợi');
}

// ---------- D2. Người nổi tiếng ----------
{
  const l = life({ wealth: 2000, sex: 'M' });
  const star = C.meet(l, () => 0.3, { kind: 'artist', celeb: true, tier: 3, age: 31 }); star.sex = 'F'; star.trust = 70; star.warmth = 90;
  ok(enabled(l, 'social149_person', { id: star.uid110 }).includes('date'), 'có thể ngỏ ý hẹn hò khi độc thân, đủ thân');
  ok(!enabled(l, 'social149_person', { id: star.uid110 }).includes('collab'), 'chưa có doanh nghiệp thì chưa mời quảng bá');
  const minor = C.meet(l, () => 0.3, { kind: 'artist', celeb: true, age: 22 }); minor.birth = l.birthYear + l.age - 17; minor.trust = 90;
  ok(/trưởng thành/.test(D.dateWhy(l, minor)), 'không có hẹn hò với người chưa trưởng thành');
  const old = C.meet(l, () => 0.3, { kind: 'artist', celeb: true, age: 60 }); old.trust = 90; old.sex = 'F';
  ok(/Chênh lệch tuổi/.test(D.dateWhy(l, old)), 'chênh lệch tuổi quá lớn');
  const fame0 = l.fame || 0;
  ok(D.askDate(l, () => 0.01, say(l), star), 'người nổi tiếng nhận lời');
  ok(l.partner && l.partner.name === star.name && l.partner.status === 'dating' && l.partner.contact149 === star.uid110, 'hẹn hò bằng quy trình hẹn hò của game, liên kết đúng NPC');
  ok((l.fame || 0) > fame0, 'danh tiếng tăng khi công khai');
  const other = C.meet(l, () => 0.3, { kind: 'artist', celeb: true, age: 30 }); other.sex = 'F'; other.trust = 90;
  ok(/đang có người yêu/.test(D.dateWhy(l, other)), 'đang có người yêu thì không ngỏ ý với người khác');
  const l2 = life({ sex: 'M' }); l2.partner = { name: 'Vợ', sex: 'F', age: 30, status: 'married', alive: true };
  const s2 = C.meet(l2, () => 0.3, { kind: 'artist', celeb: true, age: 30 }); s2.trust = 90; s2.sex = 'F';
  ok(/đang có người yêu/.test(D.dateWhy(l2, s2)), 'đã kết hôn thì không có lựa chọn hẹn hò');
  const l3 = life({ sex: 'M' }); const s3 = C.meet(l3, () => 0.3, { kind: 'artist', celeb: true, age: 30 }); s3.trust = 60; s3.sex = 'F'; s3.warmth = 10;
  ok(!D.askDate(l3, () => 0.99, say(l3), s3) && !l3.partner, 'có thể bị từ chối');
  ok(!enabled(l3, 'social149_person', { id: s3.uid110 }).includes('date'), 'mỗi năm ngỏ lời một lần');
  // Quảng bá khi có cơ sở kinh doanh
  const l4 = life(); l4.ventures = [{ k: 'shop', n: 'Cửa hàng', cap: 100 }]; const s4 = C.meet(l4, () => 0.3, { kind: 'artist', celeb: true, tier: 2 }); s4.trust = 90;
  ok(enabled(l4, 'social149_person', { id: s4.uid110 }).includes('collab'), 'có cơ sở kinh doanh: mời quảng bá');
  const m4 = l4.money; D.collab(l4, () => 0.01, say(l4), s4); ok(l4.money < m4, 'thù lao quảng bá bị trừ');
}

// ---------- D3. Mặt tối giới giải trí ----------
{
  const l = life(); l.job = Object.keys(E.CAR).find(k => E.CAR[k].fame);
  ok(D.showbiz(l), 'nhận biết người làm nghề giải trí');
  const d = E.DEC.dark149.make(l, () => 0.1);
  ok(d.opts.map(o => o.k).sort().join() === 'expose,help,leave,refuse', 'chỉ có các lựa chọn từ chối / tìm hỗ trợ / lên tiếng / đổi hướng — không có lựa chọn chấp nhận');
  const abuser = C.find(l, d.data.pid); ok(abuser && abuser.abuser149 && abuser.fictional, 'người lạm quyền là nhân vật hư cấu');
  ok(!C.contacts(l, p => !p.abuser149 && p.alive !== false).includes(abuser) && !keys(l, 'social149').includes('p:' + abuser.uid110), 'không xuất hiện như một người quen để kết giao');
  E.DEC.dark149.apply(l, d, 'help', () => 0.3, say(l));
  const c = D.S(l).darkCase; ok(c && !c.closed && c.until > l.age, 'tìm hỗ trợ: vụ việc cần thời gian, không giải quyết ngay');
  D.darkYear(l, () => 0.3, say(l)); ok(!c.closed, 'chưa đến hạn thì chưa có kết quả');
  l.age = c.until; D.darkYear(l, () => 0.3, say(l)); ok(c.closed && c.result === 'được bảo vệ' && abuser.sanctioned149, 'có kết luận sau một thời gian');
  ok(!E.TRIG.find(t => t.id === 'dark149').when(l), 'không lặp lại ngay sau một vụ việc');
  l.age += 6; ok(E.TRIG.find(t => t.id === 'dark149').when(l), 'nhiều năm sau có thể gặp lại áp lực khác');
  // Lên tiếng không có bằng chứng
  const l2 = life(); l2.job = l.job; const d2 = E.DEC.dark149.make(l2, () => 0.1);
  E.DEC.dark149.apply(l2, d2, 'expose', () => 0.9, say(l2)); l2.age++; const rep0 = C.S(l2).rep; D.darkYear(l2, () => 0.9, say(l2));
  ok(D.S(l2).darkCase.result === 'bị phản bác' && C.S(l2).rep < rep0, 'lên tiếng thiếu bằng chứng có thể bị phản bác');
  // Từ chối / đổi hướng kết thúc ngay
  const l3 = life(); l3.job = l.job; const d3 = E.DEC.dark149.make(l3, () => 0.1); E.DEC.dark149.apply(l3, d3, 'leave', () => 0.5, say(l3));
  ok(D.S(l3).darkCase.closed && l3.flags.leftAgency149 === l3.age, 'đổi hướng: rời công ty');
  // Tự động chọn một lựa chọn an toàn
  const keyAuto = E.DEC.dark149.auto(l3, E.DEC.dark149.make(l3, () => 0.1), () => 0.3); ok(['refuse', 'help', 'expose', 'leave'].includes(keyAuto), 'chế độ Tự động chọn một trong các lựa chọn an toàn');
  const plain = life(); ok(!D.showbiz(plain) && !E.TRIG.find(t => t.id === 'dark149').when(plain), 'không xảy ra với người ngoài nghề');
}

// ---------- D4. Giới thiệu đối tượng cho con ----------
{
  const l = life({ age: 55 });
  l.kids = [{ name: 'Minh', sex: 'M', born: 27, alive: true, edu: 5, close: 80, parentId: 'kid-minh' }, { name: 'An', sex: 'M', born: 29, alive: true, edu: 5, close: 80, parentId: 'kid-an' }];
  const friend = C.meet(l, () => 0.3, { kind: 'business', age: 58 }); friend.trust = 70;
  friend.kids149 = [{ name: 'Thu', sex: 'F', birth: l.birthYear + l.age - 27, job: 'bác sĩ', alive: true, married: false, parent149: friend.uid110 }, { name: 'Bé Na', sex: 'F', birth: l.birthYear + l.age - 12, job: 'học sinh', alive: true, married: false, parent149: friend.uid110 }];
  friend.kids149.forEach(k => E.UPDATE110.uid(l, k));
  const thu = friend.kids149[0], minh = l.kids[0], an = l.kids[1];
  const cands = D.candidates(l, minh);
  ok(cands.length === 1 && cands[0].c === thu && cands[0].p === friend, 'chỉ giới thiệu người trưởng thành, tuổi phù hợp, là con của người quen thật');
  const auto = C.meet(l, () => 0.3, { kind: 'pro', age: 60 }); auto.trust = 70;
  const a1 = JSON.stringify(D.kidsOf(l, auto).map(k => [k.name, k.birth, k.uid110])), a2 = JSON.stringify(D.kidsOf(l, auto).map(k => [k.name, k.birth, k.uid110]));
  ok(a1 === a2, 'con của người quen được tạo một lần, ổn định');
  // Gia đình bên kia từ chối
  ok(D.introduce(l, () => 0.99, say(l), minh, thu, friend) === false && !l.pending.length, 'gia đình bên kia có thể từ chối');
  ok(!enabled(l, 'matchmaking149').some(k => k.startsWith(E.UPDATE110.uid(l, minh))), 'mỗi năm giới thiệu cho một người con một lần');
  l.age++;
  ok(D.introduce(l, () => 0.01, say(l), minh, thu, friend) === true && l.pending[0].id === 'childMatch126', 'bên kia đồng ý: con bạn được hỏi ý kiến');
  const dm = l.pending[0]; ok(dm.data.arg.person.uid149 === thu.uid110, 'hồ sơ là đúng người thật trong mạng lưới');
  l.pending = []; const i = dm.data.keys.indexOf('introduce'); E.DEC.childMatch126.apply(l, dm, String(i), () => 0.01, say(l));
  const s = E.FAMILY126.init(l, minh); ok(s.match && s.match.person.uid149 === thu.uid110 && thu.matched149, 'con đồng ý tìm hiểu');
  ok(!D.candidates(l, an).some(x => x.c === thu), 'một người không được giới thiệu cho hai người con cùng lúc');
  { // hợp nhau thấp: dừng tìm hiểu, người kia được tự do
    const snap = clone({ m: s.match, t: thu.matched149 }); s.match.person.compatibility = 0.1; l.age += 2; E.childMarriage126(l, minh, () => 0.1, say(l));
    ok(!s.match && !thu.matched149, 'không hợp nhau: dừng tìm hiểu, người được giới thiệu không còn bị giữ chỗ');
    s.match = snap.m; thu.matched149 = snap.t; s.match.since = l.age; }
  s.match.person.compatibility = 0.9;
  for (let y = 0; y < 8 && !minh.married; y++) { l.age++; l.pending = []; E.childMarriage126(l, minh, () => 0.1, say(l));
    const w = l.pending.find(x => x.id === 'childWedding129'); if (w) { const keys = w.data.keys; l.pending = []; E.DEC.childWedding129.apply(l, w, String(keys.indexOf(keys.includes('yes') ? 'yes' : keys[0])), () => 0.1, say(l)); } }
  ok(minh.married && thu.married && friend.inlaw149, 'kết hôn tự nguyện: hai gia đình thành thông gia');
  // Con từ chối
  const l2 = life({ age: 55 }); l2.kids = [{ name: 'Hà', sex: 'F', born: 27, alive: true, close: 10, parentId: 'k2' }];
  const f2 = C.meet(l2, () => 0.3, { age: 58 }); f2.trust = 90; f2.kids149 = [{ name: 'Long', sex: 'M', birth: l2.birthYear + l2.age - 28, job: 'kỹ sư', alive: true, married: false }]; E.UPDATE110.uid(l2, f2.kids149[0]);
  D.introduce(l2, () => 0.01, say(l2), l2.kids[0], f2.kids149[0], f2); const dm2 = l2.pending[0]; l2.pending = [];
  E.DEC.childMatch126.apply(l2, dm2, String(dm2.data.keys.indexOf('introduce')), () => 0.99, say(l2));
  ok(!E.FAMILY126.init(l2, l2.kids[0]).match && !f2.kids149[0].matched149, 'con có quyền từ chối');
  friend.alive = false; ok(!D.candidates(l, an).length, 'người quen đã mất không còn được dùng để giới thiệu');
}

// ---------- D5. Quà tặng ----------
{
  const l = life({ age: 50, wealth: 500 });
  l.partner = { name: 'Hà', sex: 'F', age: 48, status: 'married', alive: true, close: 60, affection108: 60 };
  l.kids = [{ name: 'Minh', sex: 'M', born: 25, alive: true, close: 60, parentId: 'm' }, { name: 'Bé', sex: 'F', born: 40, alive: true, close: 80, parentId: 'b' }];
  const R = D.recipients(l);
  ok(R.some(x => x.kind === 'vợ/chồng') && R.filter(x => x.kind === 'con').length === 2, 'người nhận: vợ/chồng, các con');
  const kid = R.find(x => x.name === 'Bé'), minh = R.find(x => x.name === 'Minh');
  ok(!enabled(l, 'gifts149_pick', { to: kid.id }).some(k => /^(car|motorbike|supercar)/.test(k)) && enabled(l, 'gifts149_pick', { to: kid.id }).includes('phone:0'), 'con nhỏ không được tặng xe, vẫn tặng điện thoại được');
  const nw = E.netWorth(l), m = l.money;
  const item = D.give(l, () => 0.99, say(l), minh.id, 'car', 0);
  ok(item && item.owner === minh.id && item.ownerName === 'Minh', 'ô tô thuộc về người con');
  near(m - l.money, l.base * 2, 'trả tiền đúng giá', 1e-6);
  near(nw - E.netWorth(l), l.base * 2, 'tài sản của bạn giảm đúng giá trị món quà (không còn tính là của bạn)', 1e-6);
  ok(!C.mine(l).includes(item), 'món quà không còn trong tài sản của bạn');
  ok(D.give(l, () => 0.99, say(l), minh.id, 'phone', 0) === null, 'mỗi người một món quà lớn mỗi năm');
  ok(/Ô tô cỡ nhỏ/.test(E.CHILD147.facts(l, l.kids[0]).find(f => f[0] === 'Tài sản riêng')[1]), 'hồ sơ con hiện tài sản riêng');
  ok(l.kids[0].close > 60, 'quà làm tăng thân thiết');
  // Quà quá đắt so với khả năng: có thể bị từ chối, không trừ tiền
  const poor = life({ age: 50, wealth: 25 }); poor.money = poor.base * 25; poor.partner = { name: 'Lan', sex: 'F', age: 49, status: 'married', alive: true, close: 40 };
  const pid = D.recipients(poor)[0].id, m2 = poor.money;
  ok(D.give(poor, () => 0.01, say(poor), pid, 'car', 0) === false && poor.money === m2, 'món quá đắt có thể bị từ chối, không mất tiền');
  ok(!enabled(life({ wealth: 200 }), 'gifts149_pick', { to: 'x' }).length, 'người nhận không tồn tại: không có lựa chọn');
  const back = E.migrate(clone(l)); ok(back.flags.elite148.items.some(x => x.owner === minh.id && x.name === 'Ô tô cỡ nhỏ'), 'tải lại: món quà vẫn của người nhận');
}

// ---------- D6. Cầu hôn ----------
{
  function dating(o = {}) { const l = life({ age: 30, wealth: o.wealth == null ? 100 : o.wealth }); l.partner = { name: 'Mai', sex: 'F', age: 29, status: 'dating', since: 27, alive: true, affection108: o.bond || 85 }; l.partner.propPref149 = o.pref || 'simple'; return l; }
  const l = dating();
  const a = E.act(l, 'cau_hon'); ok(a && a.id === 'proposal149', 'nút Cầu hôn mở chuỗi cầu hôn');
  l.pending = [];
  ok(enabled(l, 'proposal149').includes('none') && enabled(l, 'proposal149').includes('skip'), 'có thể cầu hôn không cần nhẫn, hoặc bàn thẳng chuyện về chung nhà như trước');
  const m = l.money;
  let d = pick(l, 'proposal149', 'buy:1');
  const ring = C.mine(l).find(x => x.cat === 'ring'); ok(ring && d.id === 'proposal149_venue', 'mua nhẫn rồi chọn nơi');
  ok(l.money < m, 'tiền nhẫn bị trừ');
  pick(l, 'proposal149_venue', 'home', () => 0.01, { ring: ring.uid110 });
  ok(D.engaged(l) && l.partner.status === 'dating', 'nhận lời: đính hôn, chưa tự động kết hôn');
  ok(ring.owner === E.UPDATE110.uid(l, l.partner), 'nhẫn thuộc về người được cầu hôn');
  ok(enabled(l, 'proposal149').join() === 'wedding', 'đã đính hôn: bước tiếp theo là bàn chuyện cưới');
  d = pick(l, 'proposal149', 'wedding'); ok(d && d.id === 'marry' && d.opts.some(o => o.k === 'marry'), 'bàn chuyện cưới bằng quyết định cưới sẵn có');
  l.pending = []; E.DEC.marry.apply(l, d, 'small', () => 0.5, say(l));
  const ct = l.pending.find(x => x.id === 'contract108'); ok(ct, 'bước thỏa thuận tài sản trước khi cưới vẫn giữ nguyên'); l.pending = []; E.DEC.contract108.apply(l, ct, 'default', () => 0.1, say(l));
  ok(l.partner.status === 'married' && !l.partner.engaged149 && l.partner.engagedDone149, 'cưới xong thì hết trạng thái đính hôn');
  // Từ chối: nhẫn vẫn là của bạn, có thời gian chờ
  const l2 = dating({ bond: 55, pref: 'private' });
  const r2 = C.addItem(l2, { cat: 'ring', name: 'Nhẫn vàng trơn', buy: l2.base * 0.05 });
  const res = D.propose(l2, () => 0.99, say(l2), r2.uid110, 'concert');
  ok(res && !res.yes && r2.owner === 'me' && !D.engaged(l2), 'bị từ chối: nhẫn vẫn của bạn');
  ok(l2.partner.affection108 < 55, 'cầu hôn công khai bị từ chối làm tình cảm giảm');
  ok(enabled(l2, 'proposal149').filter(k => k !== 'skip').length === 0, 'cần chờ trước khi cầu hôn lại');
  // Sở thích của người ấy ảnh hưởng xác suất; nhẫn không bắt buộc
  const p1 = dating({ pref: 'private' }), p2 = dating({ pref: 'private' });
  ok(D.acceptChance(p1, null, 'concert') < D.acceptChance(p2, null, 'home'), 'người thích riêng tư khó nhận lời khi bị cầu hôn trước đám đông');
  const s1 = dating({ pref: 'simple' }); ok(D.acceptChance(s1, null, 'home') >= 0.7, 'không có nhẫn vẫn có thể được nhận lời');
  const short = dating(); short.partner.since = 30; ok(D.acceptChance(short, null, 'home') < D.acceptChance(dating(), null, 'home'), 'mới quen chưa lâu thì khó nhận lời');
  // Chia tay khi đang đính hôn
  const l3 = dating(); D.propose(l3, () => 0.01, say(l3), null, 'home'); const p = l3.partner; const dm = E.DEC.marry.make(l3, () => 0.5);
  E.DEC.marry.apply(l3, dm, 'split', () => 0.5, say(l3)); ok(!l3.partner && !p.engaged149, 'chia tay: hủy đính hôn');
  // Chế độ Tự động không mua nhẫn đắt
  const l4 = dating(); const ad = E.DEC.proposal149.make(l4, () => 0.3); const k4 = ad.data.keys[+E.DEC.proposal149.auto(l4, ad, () => 0.3)];
  ok(['none', 'skip'].includes(k4), 'Tự động chọn cầu hôn giản dị hoặc bàn chuyện về chung nhà: ' + k4);
}
console.log('PASS feedback-d: ' + checks + ' kiểm tra.');
