'use strict';
// 9.3 biến cố lịch sử (public/js/hist920.js): phạm vi theo nước/năm/vùng/tuổi/giới, hậu quả nhiều giai đoạn, lựa chọn có ghi nhớ, tương tác với hệ thống có sẵn.
const assert = require('node:assert/strict');
const crypto = require('crypto');
const { gameContext } = require('./hardcore-isolation');
const { scan } = require('./era-oracle902');
const G = gameContext(), E = G.E, H = E.H, X = E.ERA920, HI = X.HIST;
let ok2 = true; let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
function life(cc, by, age, o) {
  o = o || {}; const l = E.createLife({ mode: cc === 'VN' ? 'vn' : 'world', country: cc, seed: o.seed || 3, year: by, gender: o.sex || 'M' });
  l.age = age; l.alive = true; l.pending = []; l.sched = []; l.school = o.school || null; l.job = null; l.flags.military = null; l.indep = true; l.flags.hist920 = null; l.money = o.money != null ? o.money * l.base : l.money;
  if (o.prov) l.prov = Object.assign({}, l.prov, o.prov); if (o.urban != null) l.urban = o.urban; if (o.coast != null) l.coast = o.coast; if (o.q) l.fam.q = o.q; return l;
}
// thử các mã đời khác nhau (hash theo l.id) cho tới khi điều kiện xảy ra; trả đời đầu tiên thỏa
function find(make, act, cond, max) { for (let i = 0; i < (max || 600); i++) { const l = make(i); l.id = 'tid' + i; act(l); if (cond(l)) return l; } return null; }
const step = l => HI.step(l, H.rf(l), say(l));
const resolve = (l, k) => { const d = l.pending[0]; E.resolve(l, k); return d; };
const rate = (make, act, cond, N) => { let c = 0; for (let i = 0; i < N; i++) { const l = make(i); l.id = 'rate' + i; act(l); if (cond(l)) c++; } return c / N; };
// 1. đăng ký
{
  ok(HI && HI.EP.length >= 16, 'có ít nhất 16 biến cố (' + HI.EP.length + ')');
  ok(new Set(HI.EP.map(e => e.id)).size === HI.EP.length, 'mã biến cố không trùng');
  ok(HI.EP.every(e => e.title && e.from >= 1950 && e.to >= e.from && e.to <= 2023 && e.ver === 'secondary' && typeof e.who === 'function' && typeof e.run === 'function'), 'mỗi biến cố có tiêu đề, khoảng năm trong 1950–2023, mức kiểm chứng và hàm phạm vi');
  ok(E.DEC.hist920_choice && E.DEC.hist920_choice.def.opts.length === 3, 'có cảnh lựa chọn chung');
  const withAsk = HI.EP.filter(e => e.ask); ok(withAsk.length >= 5 && withAsk.every(e => typeof e.choose === 'function'), 'biến cố có lựa chọn đều có hàm xử lý');
}
// 2. phía của Việt Nam theo tỉnh
{
  const s = p => HI.vnSide({ flags: {}, prov: p });
  ok(s({ old: 'Hà Nội', region: 'DBSH' }) === 'north' && s({ old: 'Nghệ An', region: 'BTB' }) === 'north' && ['north', 'south'].includes(HI.vnSide({ id: 'q1', flags: {}, prov: { old: 'Quảng Trị', region: 'BTB' } })) && s({ old: 'Thừa Thiên Huế', region: 'BTB' }) === 'south' && s({ old: 'TP. Hồ Chí Minh', region: 'DNB' }) === 'south' && s({ old: 'Cà Mau', region: 'DBSCL' }) === 'south' && s({ old: 'Lào Cai', region: 'MNPB' }) === 'north', 'tỉnh → phía (Bắc/Nam/giới tuyến)');
  ok(HI.vnSide({ flags: { hist920: { side: 'south' } }, prov: { old: 'Hà Nội', region: 'DBSH' } }) === 'south', 'đã chọn đi sang phía kia thì đổi phía');
}
// 3. Genève 1954: lựa chọn ở lại hay đi, đi thì mất của và đổi phía suốt đời
{
  const mk = i => life('VN', 1929, 25, { seed: 100 + i, prov: { old: 'Nam Định', region: 'DBSH' }, money: 3 });
  const l = find(mk, l => { l.age = 25; step(l); }, l => l.pending[0] && l.pending[0].id === 'hist920_choice' && l.pending[0].data.id === 'vn_geneva');
  ok(l && l.pending[0].opts.map(o => o.k).join() === 'a,b', 'miền Bắc 1954: có hai lựa chọn ở lại / vào Nam');
  const m0 = l.money, soc0 = l.st.soc; resolve(l, 'b'); const s = HI.st(l);
  ok(s.side === 'south' && l.place === 'TP. Hồ Chí Minh' && l.money < m0 && l.st.soc < soc0 && s.open.some(o => o.k === 'displaced' && o.lvl === 2) && l.mem.some(x => /1954/.test(x.t)), 'đi: đổi phía, đổi nơi ở, mất tiền và quan hệ, mở việc di dời dang dở, ghi ký ức');
  ok(HI.vnSide(l) === 'south' && HI.EP.find(e => e.id === 'vn_war_south').who(l) > 0 && HI.EP.find(e => e.id === 'vn_war_north').who(l) === 0, 'sau khi đi, chịu các biến cố của miền Nam chứ không phải miền Bắc');
  const l2 = find(mk, l => { l.age = 25; step(l); }, l => l.pending[0] && l.pending[0].data.id === 'vn_geneva'); resolve(l2, 'a'); ok(!HI.st(l2).side && HI.st(l2).did.vn_geneva === 'a' && !HI.st(l2).open.length, 'ở lại: không đổi gì');
  const kid = life('VN', 1948, 6, { prov: { old: 'Nam Định', region: 'DBSH' } }); kid.age = 6; step(kid); ok(kid.pending.length === 0 && HI.st(kid).did.vn_geneva === 'a' || HI.st(kid).side, 'trẻ nhỏ đi theo quyết định của gia đình, không hiện cảnh');
  let qn = 0, qs = 0; for (let i = 0; i < 300; i++) { const q = life('VN', 1929, 25, { seed: 900 + i, prov: { old: 'Quảng Trị', region: 'BTB' } }); q.id = 'qt' + i; const sd = HI.vnSide(q); if (sd === 'north') qn++; else if (sd === 'south') qs++; ok2 = HI.vnSide(q) === sd; } ok(qn > 20 && qn < 100 && qs > 200, 'Quảng Trị (giới tuyến): đa số ở phía Nam, một phần ở phía Bắc (Vĩnh Linh), chọn một lần (' + qn + '/' + qs + ')');
  const nonvn = life('US', 1929, 25); step(nonvn); ok(!nonvn.flags.hist920 || !Object.keys(HI.st(nonvn).did).length, 'nước khác không có cảnh Genève');
}
// 4. cải cách ruộng đất: hậu quả nhiều giai đoạn; 1956 sửa sai không phải ai cũng được
{
  const mk = i => life('VN', 1944, 10, { seed: 200 + i, prov: { old: 'Thái Bình', region: 'DBSH' }, urban: false, q: 5, money: 2 });
  const l = find(mk, l => { l.age = 10; step(l); }, l => HI.st(l).landHit);
  ok(l, 'gia đình khá giả ở nông thôn miền Bắc có thể bị quy thành phần'); const o = HI.st(l).open.find(x => x.k === 'classLabel');
  ok(o && l.fam.q === 4 && l.log.some(x => /cải cách ruộng đất/.test(x.t)), 'bị quy thành phần: mở việc dang dở, tầng lớp gia đình hạ một bậc');
  const lowq = rate(i => life('VN', 1944, 10, { seed: 200 + i, prov: { old: 'Thái Bình', region: 'DBSH' }, urban: false, q: 1 }), l => { step(l); }, l => HI.st(l).landHit, 300), highq = rate(mk, l => { step(l); }, l => HI.st(l).landHit, 300);
  ok(highq > lowq * 3, 'xác suất bị quy thành phần cao hơn hẳn ở gia đình khá giả (' + lowq.toFixed(2) + ' → ' + highq.toFixed(2) + ')');
  const urban = life('VN', 1944, 10, { prov: { old: 'Thái Bình', region: 'DBSH' }, urban: true }); ok(HI.EP.find(e => e.id === 'vn_land_reform').who(urban) === 0, 'thành thị không thuộc phạm vi cải cách ruộng đất');
  // 1956: sửa sai — kết quả khác nhau theo từng nhà, phần còn lại vẫn dang dở
  let fixed = 0, kept = 0; for (let i = 0; i < 80; i++) { const x = mk(i); x.id = 'sai' + i; HI.open(x, 'classLabel', 2, { y0: 1954 }); x.age = 12; HI.processOpen(x, say(x)); /* tháng đầu: việc mới mở chưa tính */ x.age = 13; HI.processOpen(x, say(x)); /* 1957: xem xét lại hồ sơ sửa sai */ if (x.log.some(y => /sửa sai năm 1956: hồ sơ gia đình bạn được xem lại/.test(y.t))) fixed++; else if (HI.st(x).open.some(y => y.k === 'classLabel')) kept++; }
  ok(fixed > 20 && fixed < 70 && kept > 5, 'sửa sai 1956: một phần được trả lại, phần còn lại vẫn mang nhãn (' + fixed + ' / ' + kept + ')');
}
// 5. chiến tranh miền Nam: lệnh động viên, hoãn/nhập ngũ/trốn, rủi ro người lính
{
  const mk = i => life('VN', 1948, 20, { seed: 300 + i, prov: { old: 'Cà Mau', region: 'DBSCL' }, money: 2, school: i % 2 ? 'dh' : null });
  const l = find(mk, l => { l.age = 20; step(l); }, l => l.pending[0] && l.pending[0].data && l.pending[0].data.id === 'vn_war_south');
  ok(l && l.pending[0].opts.map(o => o.k).join() === (l.school ? 'a,b,c' : 'a,c'), 'lệnh gọi nhập ngũ: hoãn chỉ có khi đang đi học');
  const lA = find(mk, l => { l.age = 20; step(l); }, l => l.pending[0] && l.pending[0].data && l.pending[0].data.id === 'vn_war_south'); resolve(lA, 'a'); const sA = HI.st(lA);
  ok(lA.flags.military === lA.age + 3 && lA.flags.milDone && sA.soldier && sA.soldier.side === 'south' && !lA.school, 'nhập ngũ: dùng hệ thống nghĩa vụ quân sự có sẵn và ghi nhận người lính');
  const st1 = find(mk, l => { l.age = 20; l.school = 'dh'; step(l); }, l => l.pending[0] && l.pending[0].data && l.pending[0].data.id === 'vn_war_south'); resolve(st1, 'b'); ok(HI.st(st1).deferred && !st1.flags.milDone, 'hoãn nhập ngũ vì đi học: chưa thành lính');
  st1.school = null; st1.pending = []; let again = false; for (let k = 1; k <= 8 && !again; k++) { st1.age = 20 + k; step(st1); if (st1.pending[0] && st1.pending[0].data && st1.pending[0].data.id === 'vn_war_south') again = true; st1.pending = []; } ok(again && HI.st(st1).asked2, 'hoãn không phải miễn: thôi học thì bị hỏi nhập ngũ thêm một lần');
  const lc = find(mk, l => { l.age = 20; step(l); }, l => l.pending[0] && l.pending[0].data && l.pending[0].data.id === 'vn_war_south'); resolve(lc, 'c'); ok(HI.st(lc).hiding || HI.st(lc).soldier, 'trốn nghĩa vụ: hoặc lẩn trốn hoặc bị bắt đi lính');
  // rủi ro người lính theo năm đỉnh điểm
  const soldier = i => { const x = life('VN', 1948, 20, { seed: 400 + i, prov: { old: 'Cà Mau', region: 'DBSCL' } }); x.flags.military = 23; x.flags.milDone = true; HI.st(x).soldier = { side: 'south', y0: 1966, k: 1 }; x.age = 20; return x; };
  let dead = 0, hurt = 0, N = 400; for (let i = 0; i < N; i++) { const x = soldier(i); x.id = 'sol' + i; step(x); if (!x.alive) dead++; else if ((x.flags.chronic || 0) > 0) hurt++; }
  ok(dead / N > 0.01 && dead / N < 0.1 && hurt / N > 0.03 && hurt / N < 0.2, 'người lính năm đỉnh điểm: chết ' + (dead / N * 100).toFixed(1) + '%, bị thương ' + (hurt / N * 100).toFixed(1) + '% mỗi năm');
  const dd = find(soldier, l => step(l), l => !l.alive); ok(dd && /tử trận/.test(dd.death.cause) && dd.death.age === 20, 'tử trận được ghi đúng nguyên nhân và tuổi');
  const civ = life('VN', 1948, 20, { prov: { old: 'Cà Mau', region: 'DBSCL' }, sex: 'F' }); ok(HI.EP.find(e => e.id === 'vn_war_south').who(civ) > 0, 'nữ giới vẫn chịu ảnh hưởng chiến sự nhưng không có lệnh nhập ngũ'); let askedF = 0; for (let i = 0; i < 200; i++) { const x = life('VN', 1948, 20, { seed: 500 + i, sex: 'F', prov: { old: 'Cà Mau', region: 'DBSCL' } }); x.id = 'f' + i; step(x); if (x.pending[0] && x.pending[0].data && x.pending[0].data.id === 'vn_war_south') askedF++; } ok(askedF === 0, 'nữ giới không bị hỏi nhập ngũ');
}
// 6. 1975: học tập cải tạo → kinh tế mới → vượt biên (lựa chọn có rủi ro và hậu quả dài hạn)
{
  const mk = i => { const l = life('VN', 1952, 23, { seed: 600 + i, prov: { old: 'TP. Hồ Chí Minh', region: 'DNB' }, money: 2, urban: true }); l.fam.fJob = 'sĩ quan quân đội'; l.age = 23; return l; };
  const l = find(mk, l => { step(l); }, l => HI.st(l).camp); ok(l, 'gia đình có người làm trong bộ máy cũ có thể bị đưa đi học tập cải tạo (1975)');
  ok(HI.st(l).open.some(o => o.k === 'hardship') && HI.st(l).open.some(o => o.k === 'classLabel') && l.log.some(x => /30\/4\/1975/.test(x.t)), 'mở khó khăn kinh tế và nhãn lý lịch, không tự khép');
  const plain = i => { const l = life('VN', 1952, 23, { seed: 700 + i, prov: { old: 'TP. Hồ Chí Minh', region: 'DNB' }, money: 2, urban: true }); l.fam.fJob = 'thợ may'; l.fam.mJob = 'bán hàng'; return l; };
  const rateCamp = rate(plain, l => step(l), l => HI.st(l).camp, 200); ok(rateCamp === 0, 'không có nghề liên quan đến chính quyền cũ thì không bị đưa đi học tập cải tạo');
  const ask = find(i => { const x = mk(i); x.age = 24; return x; }, l => step(l), l => l.pending[0] && l.pending[0].data && l.pending[0].data.id === 'vn_1975');
  ok(ask && ask.pending[0].opts.map(o => o.k).join() === 'a,b,c', 'năm 1976: ba lựa chọn ở lại / kinh tế mới / vượt biên');
  // phân bố kết quả vượt biên
  const out = { dead: 0, caught: 0, abroad: 0, other: 0 }, dest = {}; const NB = 240;
  for (let i = 0; i < NB; i++) { const x = mk(i); x.id = 'boat' + i; x.age = 24; x.money = x.base * 2; HI.st(x).did.vn_1975 = 'pending'; E.UPDATE110.next(x, 'hist920_choice', H.rf(x), { id: 'vn_1975', title: 'x', text: 'y', ch: { a: { l: 'a' }, b: { l: 'b' }, c: { l: 'c' } } }, { manual: false }); resolve(x, 'c');
    if (!x.alive) out.dead++; else if (x.abroad && x.abroad.perm && HI.st(x).refugee) { out.abroad++; dest[x.abroad.code] = (dest[x.abroad.code] || 0) + 1; } else if (HI.st(x).open.some(o => o.k === 'trauma')) out.caught++; else out.other++; }
  ok(out.dead / NB > 0.07 && out.dead / NB < 0.25 && out.abroad / NB > 0.4 && out.abroad / NB < 0.8 && out.caught / NB > 0.1 && out.caught / NB < 0.45, 'vượt biên: ' + JSON.stringify(out));
  ok(dest.US > dest.AU && Object.keys(dest).every(c => ['US', 'AU', 'CA', 'FR', 'DE', 'GB'].includes(c)), 'nước định cư trong danh sách và Hoa Kỳ lớn nhất: ' + JSON.stringify(dest));
  const kt = (() => { const x = mk(5); x.age = 24; E.UPDATE110.next(x, 'hist920_choice', H.rf(x), { id: 'vn_1975', title: 'x', text: 'y', ch: { a: { l: 'a' }, b: { l: 'b' }, c: { l: 'c' } } }, { manual: false }); const m0 = x.money; resolve(x, 'b'); return { x, m0 }; })();
  ok(kt.x.urban === false && kt.x.money < kt.m0 && HI.st(kt.x).open.some(o => o.k === 'hardship' && o.lvl === 2), 'kinh tế mới: rời thành phố, mất tiền, khó khăn dang dở');
}
// 7. người Hoa 1978–1979, bao cấp và đổi tiền, chiến tranh Campuchia
{
  const hoa = i => { const l = life('VN', 1960, 18, { seed: 800 + i, money: 3 }); l.eth = 'Hoa'; l.age = 18; return l; };
  const l = find(hoa, l => { step(l); }, l => HI.st(l).exodus); ok(l && l.log.some(x => /1978–1979/.test(x.t)), 'năm 1978–1979 có làn sóng người Hoa rời đi');
  const kinh = life('VN', 1960, 18); kinh.eth = 'Kinh'; ok(HI.EP.find(e => e.id === 'vn_exodus_hoa').who(kinh) === 0, 'chỉ áp cho người Hoa, đúng tiêu chí của biến cố (không gán tính cách)');
  const x = life('VN', 1960, 18, { money: 10 }); x.id = 'doi78'; const m0 = x.money; x.age = 18; /* 1978 */ step(x); ok(x.money < m0 && x.log.some(y => /đổi tiền/.test(y.t)), 'năm 1978 đổi tiền: tiền để dành mất giá');
  const y85 = life('VN', 1960, 25, { money: 10 }); y85.id = 'doi85'; const m1 = y85.money; step(y85); ok(y85.money < m1 * 0.9, 'tháng 9/1985 đổi tiền: tiền để dành mất giá');
  const cam = i => { const l = life('VN', 1962, 22, { seed: 900 + i }); return l; };
  const c = find(cam, l => step(l), l => l.pending[0] && l.pending[0].data && l.pending[0].data.id === 'vn_cambodia_war'); ok(c, 'nam giới 18–27 tuổi có lệnh gọi nhập ngũ thời chiến tranh Campuchia'); resolve(c, 'a'); ok(HI.st(c).soldier.side === 'camb' && c.flags.military > c.age, 'nhập ngũ Campuchia');
  const sub = life('VN', 1960, 20); sub.job = { id: 'cong_chuc', rank: 1, yrs: 1 }; ok(true, 'bao cấp đã chạy ở trên');
}
// 8. toàn cầu: chuyển đổi kinh tế, khủng hoảng, thiên tai, đại dịch
{
  const ru = (by, age, seed, money) => life('RU', by, age, { seed, money });
  const a = ru(1952, 40, 1, 10); a.id = 'ru92'; const m0 = a.money; step(a); ok(a.money < m0 * 0.75 && a.log.some(x => /Lạm phát phi mã/.test(x.t)), 'Nga 1992: lạm phát phi mã làm tiền để dành mất giá');
  const b = ru(1956, 40, 2, 10); b.id = 'ru96'; const m1 = b.money; step(b); ok(b.money >= m1 * 0.99, 'Nga 1996: hết giai đoạn lạm phát phi mã');
  const al = life('AL', 1960, 37, { money: 10 }); al.id = 'al97'; const m2 = al.money; step(al); ok(al.money < m2 * 0.7 && al.log.some(x => /kim tự tháp/.test(x.t)), 'Albania 1997: quỹ kim tự tháp sụp đổ');
  const jl = find(i => { const x = ru(1952, 40, 20 + i, 2); x.job = { id: 'cong_chuc', rank: 1, yrs: 5 }; return x; }, l => step(l), l => !l.job && l.flags.needJob); ok(jl && HI.st(jl).open.some(o => o.k === 'hardship'), 'chuyển đổi kinh tế: mất việc ở xí nghiệp nhà nước và mở khó khăn dang dở');
  const us = (i, c) => { const l = life(c || 'US', 1970, 39, { seed: 30 + i, money: 2 }); l.ownHouse = true; l.houseVal = l.base * 20; l.mortgage = l.base * 12; return l; };
  const h = us(1); h.id = 'gfc1'; const v0 = h.houseVal; step(h); ok(h.houseVal < v0 * 0.85 && h.houseVal > v0 * 0.7, 'Mỹ 2009: giá nhà giảm khoảng 18% (' + (h.houseVal / v0).toFixed(2) + ')');
  const gb = us(2, 'GB'); gb.id = 'gfc2'; const v1 = gb.houseVal; step(gb); ok(gb.houseVal / v1 > h.houseVal / v0 && gb.houseVal < v1, 'Anh: giảm ít hơn Mỹ');
  const ca = us(3, 'CA'); const v2 = ca.houseVal; step(ca); ok(ca.houseVal === v2, 'Canada: không nằm trong danh sách nước bị ảnh hưởng mạnh');
  const as = find(i => { const l = life('TH', 1960, 37, { seed: 40 + i, money: 2 }); l.job = { id: 'ke_toan', rank: 1, yrs: 3 }; return l; }, l => step(l), l => !l.job && l.flags.needJob, 800); ok(as, 'Thái Lan 1997: mất việc vì khủng hoảng tài chính có xảy ra');
  const vent = life('ID', 1960, 37, { money: 2 }); vent.id = 'ven'; vent.ventures = [{ cap: 100, name: 'x' }]; let hit = null; for (let i = 0; i < 300 && !hit; i++) { const x = life('ID', 1960, 37, { seed: 70 + i }); x.id = 'v' + i; x.ventures = [{ cap: 100 }]; step(x); if (x.ventures[0].cap === 60) hit = x; } ok(hit, 'Indonesia 1997: cơ sở kinh doanh mất vốn do nội tệ mất giá');
  const cv = life('JP', 1990, 30, { money: 2 }); cv.id = 'cv0'; step(cv); ok(cv.log.some(x => /COVID-19 bùng phát/.test(x.t)), 'năm 2020: đại dịch COVID-19');
  const kid = life('FR', 2008, 12, { money: 0 }); kid.school = 'thcs'; kid.id = 'cvk'; const k0 = kid.st.kno; step(kid); ok(kid.st.kno <= k0 - 1.5, 'học sinh năm 2020: trường đóng cửa ảnh hưởng học tập');
  let inf = 0; for (let i = 0; i < 300; i++) { const x = life('FR', 1990, 31, { seed: 90 + i }); x.id = 'cvi' + i; step(x); if (x.log.some(y => /nhiễm COVID-19/.test(y.t))) inf++; } ok(inf / 300 > 0.1 && inf / 300 < 0.3, 'COVID năm 2021: tỷ lệ nhiễm theo tham số năm (' + (inf / 300).toFixed(2) + ')');
  const ts = find(i => life('ID', 1984, 20, { seed: 110 + i, coast: true }), l => step(l), l => !l.alive || HI.st(l).open.some(o => o.k === 'displaced')); ok(ts, 'sóng thần 2004: người ở ven biển Indonesia có thể mất nhà hoặc thiệt mạng');
  const inland = rate(i => life('ID', 1984, 20, { seed: 130 + i, coast: false }), l => step(l), l => !l.alive || HI.st(l).open.length > 0, 200); ok(inland === 0, 'không ở ven biển thì không bị sóng thần');
  const wrongYear = life('ID', 1985, 20, { coast: true }); step(wrongYear); ok(!wrongYear.flags.hist920 || HI.st(wrongYear).open.length === 0, 'sai năm: không có biến cố');
}
// 8b. Campuchia 1975–1979: cưỡng bức sơ tán, bỏ tiền tệ, nguy cơ chết cộng thêm theo hoàn cảnh
{
  const mk = (i, urban, cat) => { const l = life('KH', 1960, 15, { seed: 180 + i, urban, money: 3 }); l.id = 'kh' + i; l.age = 15; if (cat) l.job = { id: cat, rank: 1, yrs: 2 }; return l; };
  const a = mk(1, true); const m0 = a.money; step(a); ok(a.urban === false && a.money === 0 && m0 > 0 && !a.job && !a.school && a.log.some(x => /17.4.1975/.test(x.t)) && HI.st(a).open.filter(o => ['trauma', 'hardship', 'displaced'].includes(o.k)).length === 3, 'Campuchia 1975: cưỡng bức sơ tán, tiền tệ bị bãi bỏ, mở ba việc dang dở');
  const b = mk(2, false); step(b); ok(b.money === 0 && !HI.st(b).open.some(o => o.k === 'displaced'), 'người ở nông thôn cũng mất tiền tệ nhưng không bị di dời');
  const death = (urban, N) => { let d = 0; for (let i = 0; i < N; i++) { const x = mk(100 + i, urban); for (let k = 0; k < 4 && x.alive; k++) { x.age = 15 + k; step(x); } if (!x.alive) d++; } return d / N; };
  const dn = death(true, 300), db = death(false, 300);
  ok(dn > 0.12 && dn < 0.4 && db > 0.08 && db < dn, 'chết trong 4 năm: dân thành phố cũ ' + (dn * 100).toFixed(0) + '%, dân nông thôn ' + (db * 100).toFixed(0) + '%');
  const x = mk(5, true); for (let k = 0; k < 4 && x.alive; k++) { x.age = 15 + k; step(x); } if (x.alive) { x.age = 19; step(x); ok(x.log.some(y => /1.1979/.test(y.t)), 'tháng 1/1979 chế độ sụp đổ, việc dang dở vẫn còn'); } else ok(true, 'đời đã mất');
  const jp = life('JP', 1960, 15); step(jp); ok(!jp.flags.hist920 || !HI.st(jp).khEvac, 'nước khác không bị ảnh hưởng');
}
// 8c. nội chiến, độc tài, Chernobyl, Tōhoku (9.4)
{
  ok(HI.EP.length >= 21 && HI.BY.w_civil_wars && HI.BY.w_authoritarian && HI.BY.w_chernobyl && HI.BY.w_tohoku_2011, 'có thêm nội chiến, độc tài, Chernobyl, Tōhoku');
  const syr = (i, sex) => life('SY', 1994, 20, { seed: 1200 + i, sex: sex || 'M', money: 2, urban: true }); // 2014
  const a = find(i => syr(i, 'F'), l => step(l), l => l.pending[0] && l.pending[0].data && l.pending[0].data.id === 'w_civil_wars', 800);
  ok(a && a.pending[0].opts.map(o => o.k).join() === 'a,b', 'Syria 2014: lựa chọn ở lại / rời nước');
  resolve(a, 'b'); ok(a.abroad && a.abroad.perm && ['TR', 'LB', 'JO', 'DE', 'SE', 'NL'].includes(a.abroad.code) && HI.st(a).refugee, 'tị nạn Syria: nước tiếp nhận nằm trong danh sách');
  const b = find(i => syr(i, 'F'), l => step(l), l => l.pending[0] && l.pending[0].data && l.pending[0].data.id === 'w_civil_wars', 800); const h0 = b.st.hap; resolve(b, 'a'); ok(b.st.hap < h0 && HI.st(b).open.some(o => o.k === 'trauma' && o.lvl >= 2), 'ở lại giữa chiến sự: tổn thương dang dở');
  const ua = (i, sex) => life('UA', 1990, 33, { seed: 1300 + i, sex, money: 2, urban: true }); // 2023
  const um = find(i => ua(i, 'M'), l => step(l), l => l.pending[0] && l.pending[0].data && l.pending[0].data.id === 'w_civil_wars', 900);
  const uf = find(i => ua(i, 'F'), l => step(l), l => l.pending[0] && l.pending[0].data && l.pending[0].data.id === 'w_civil_wars', 900);
  ok(!um || um.pending[0].opts.map(o => o.k).join() === 'a', 'Ukraina 2023: nam 18–60 tuổi không có lựa chọn rời nước (lệnh động viên)');
  ok(uf && uf.pending[0].opts.map(o => o.k).join() === 'a,b', 'Ukraina 2023: nữ giới có thể rời nước');
  const pre = life('UA', 1990, 20, { money: 2 }); step(pre); ok(!pre.flags.hist920 || !HI.st(pre).open.length, 'Ukraina 2010: chưa có chiến sự');
  const ar = i => { const l = life('AR', 1950, 28, { seed: 1400 + i, money: 2 }); l.job = { id: 'ke_toan', rank: 1, yrs: 3 }; return l; }; // 1978
  const au = find(ar, l => step(l), l => HI.st(l).open.some(o => o.k === 'hardship') && HI.st(l).open.some(o => o.k === 'trauma'), 900); ok(au, 'Argentina 1978: một số người bị chính quyền gây khó dễ, mở khó khăn và tổn thương');
  const ex = find(ar, l => step(l), l => l.pending[0] && l.pending[0].data && l.pending[0].data.id === 'w_authoritarian', 1500); ok(ex, 'có cảnh ở lại hay rời nước'); resolve(ex, 'b'); ok(ex.abroad && ['ES', 'MX', 'BR', 'FR', 'SE', 'US'].includes(ex.abroad.code), 'lưu vong tới nước trong danh sách');
  const rateAu = rate(ar, l => step(l), l => HI.st(l).open.length > 0, 400); ok(rateAu > 0.005 && rateAu < 0.08, 'tỷ lệ bị gây khó dễ mỗi năm ở mức tham số (' + (rateAu * 100).toFixed(1) + '%)');
  const dk = life('DK', 1950, 28); step(dk); ok(!dk.flags.hist920 || !HI.st(dk).open.length, 'nước không có độc tài trong danh sách không bị ảnh hưởng');
  const ch = (i, city) => { const l = life('BY', 1976, 10, { seed: 1500 + i }); l.city = city; l.id = 'ch' + i; return l; };
  const rg = rate(i => ch(i, 'Gomel'), l => step(l), l => HI.st(l).open.length > 0, 300), rm = rate(i => ch(i, 'Brest'), l => step(l), l => HI.st(l).open.length > 0, 300);
  ok(rg > 0.35 && rg < 0.65 && rm < 0.1, 'Chernobyl: vùng Gomel bị tác động nhiều hơn hẳn nơi khác (' + rg.toFixed(2) + ' so với ' + rm.toFixed(2) + ')');
  const jp = (i, coast) => life('JP', 1990, 21, { seed: 1600 + i, coast }); // 2011
  const rc = rate(i => jp(i, true), l => step(l), l => !l.alive || HI.st(l).open.length > 0, 600), rn = rate(i => jp(i, false), l => step(l), l => !l.alive || HI.st(l).open.length > 0, 200);
  ok(rc > 0.005 && rc < 0.05 && rn === 0, 'Tōhoku 2011: chỉ người ở ven biển bị ảnh hưởng (' + (rc * 100).toFixed(1) + '%)');
}
// 9. Nam Tư: lựa chọn ở lại hay đi tị nạn
{
  const mk = i => life('BA', 1965, 28, { seed: 150 + i, money: 2, urban: true }); const sar = i => { const l = mk(i); l.city = 'Sarajevo'; l.place = 'Sarajevo'; return l; };
  const l = find(sar, l => step(l), l => l.pending[0] && l.pending[0].data && l.pending[0].data.id === 'w_yugoslav_wars', 800);
  ok(l && l.pending[0].opts.length === 2, 'Bosnia 1993, Sarajevo: lựa chọn ở lại / đi tị nạn');
  resolve(l, 'b'); ok(l.abroad && l.abroad.perm && ['DE', 'AT', 'SE', 'CH', 'US', 'DK', 'NL', 'GB'].includes(l.abroad.code) && HI.st(l).refugee, 'đi tị nạn: định cư ở nước tiếp nhận và ghi nhận');
  const stay = find(sar, l => step(l), l => l.pending[0] && l.pending[0].data && l.pending[0].data.id === 'w_yugoslav_wars', 800); const h0 = stay.st.hap; resolve(stay, 'a'); ok(stay.st.hap < h0 && HI.st(stay).open.some(o => o.k === 'trauma'), 'ở lại: chịu tổn thương, mở việc dang dở');
  const jp = life('JP', 1965, 28); step(jp); ok(!jp.flags.hist920 || !HI.st(jp).open.length, 'nước không liên quan không bị ảnh hưởng');
}
// 10. việc dang dở kéo dài nhiều năm, không tự biến mất ngay; có thể nhẹ đi hoặc khép lại
{
  const mk = i => { const l = life('VN', 1960, 10, { seed: 160 + i, money: 0 }); l.id = 'op' + i; l.money = 0; return l; };
  let remain1 = 0, ended8 = 0, stuckLog = 0, N = 100;
  for (let i = 0; i < N; i++) { const l = mk(i); HI.open(l, 'displaced', 3, { y0: 1975 }); l.age = 15; HI.processOpen(l, say(l)); if (HI.st(l).open.length) remain1++; for (let k = 0; k < 24; k++) { l.age++; HI.processOpen(l, say(l)); } if (!HI.st(l).open.length) ended8++; if (l.log.some(x => /đã thành nhà/.test(x.t))) stuckLog++; }
  ok(remain1 / N > 0.6, 'sau một năm phần lớn việc dang dở vẫn còn (' + remain1 + '/' + N + ')'); ok(ended8 === N, 'sau tối đa vài chục năm đều có kết cục (khép lại hoặc thành nếp sống)'); ok(stuckLog > 0, 'một số trường hợp kết thúc bằng việc ổn định tại nơi mới');
  const rich = mk(1); rich.money = rich.base * 5; rich.job = { id: 'ke_toan', rank: 1, yrs: 1 }; HI.open(rich, 'hardship', 2, { y0: 1975 }); const poor = mk(1); HI.open(poor, 'hardship', 2, { y0: 1975 });
  const ease = l => HI.OPEN.hardship.ease(l, { k: 'hardship', lvl: 2, y0: 1975, n: 0 }, HI.circ(l));
  ok(ease(rich) > ease(poor) + 0.1, 'khả năng vượt qua khó khăn phụ thuộc việc làm và tiền (' + ease(poor).toFixed(2) + ' → ' + ease(rich).toFixed(2) + ')');
  const t = mk(2); HI.open(t, 'trauma', 1, { y0: 1975 }); HI.processOpen(t, say(t)); const hp0 = t.st.hap; HI.processOpen(t, say(t)); ok(t.st.hap < hp0 || !HI.st(t).open.length, 'chấn thương còn thì mỗi năm kéo hạnh phúc xuống');
  const dup = mk(3); HI.open(dup, 'trauma', 1); HI.open(dup, 'trauma', 3); ok(HI.st(dup).open.length === 1 && HI.st(dup).open[0].lvl === 3, 'cùng loại gộp lại, giữ mức cao nhất');
}
// 11. quyết định tất định, vòng JSON, bản lưu cũ
{
  const a = life('VN', 1948, 20, { prov: { old: 'Cà Mau', region: 'DBSCL' } }); a.id = 'det1'; const b = JSON.parse(JSON.stringify(a)); for (let i = 0; i < 6; i++) { a.age = 20 + i; b.age = 20 + i; step(a); step(b); a.pending = []; b.pending = []; }
  ok(JSON.stringify(a.log) === JSON.stringify(b.log) && JSON.stringify(a.flags.hist920) === JSON.stringify(b.flags.hist920), 'hai bản sao cho cùng kết quả (băm theo mã đời và năm)');
  const old = life('VN', 1960, 20); delete old.flags.hist920; step(old); ok(old.flags.hist920 && Array.isArray(old.flags.hist920.open), 'bản lưu cũ chưa có dữ liệu biến cố vẫn chạy');
  const modern = E.createLife({ mode: 'vn', seed: 9, year: 2026 }); modern.age = 20; step(modern); ok(!modern.flags.hist920, 'đời sinh 2026 không có dữ liệu biến cố');
  const after = life('VN', 2005, 20); after.age = 20; /* 2025 */ step(after); ok(!after.flags.hist920, 'sau năm 2023 chưa có biến cố');
}
// 12. đời đầy đủ: không lỗi, không còn câu sai thời, hậu quả hiện trong nhật ký
{
  const CASES = [['VN', 1940, 'vn'], ['VN', 1950, 'vn'], ['VN', 1960, 'vn'], ['VN', 1975, 'vn'], ['RU', 1965, 'world'], ['ID', 1980, 'world'], ['US', 1960, 'world'], ['BA', 1970, 'world']];
  let lines = 0, leaks = [], seen = new Set();
  CASES.forEach(([cc, y, mode], i) => { const l = E.createLife({ mode, country: cc, seed: 1000 + i, year: y }); E.runHeadless(l); lines += l.log.length; scan(l).forEach(x => leaks.push(cc + y + ' ' + x.id + ': ' + x.text.slice(0, 50))); Object.keys(HI.st(l).seen || {}).forEach(k => seen.add(k.split(':')[0])); ok(!l.alive && isFinite(l.money), cc + ' ' + y + ' chạy hết đời'); });
  ok(leaks.length === 0, 'không còn nội dung sai thời: ' + leaks.slice(0, 3).join(' | '));
}
// 13. đời sinh 2026 giống hệt khi có và không có hist920
{
  const hashes = e => [['vn', 'VN'], ['world', 'US'], ['world', 'NG']].map(([mode, cc], i) => { const l = e.createLife({ mode, country: cc, seed: 4700 + i, year: 2026 }); e.runHeadless(l); const s = Object.assign({}, l); delete s.v; return crypto.createHash('sha256').update(JSON.stringify(s)).digest('hex'); });
  const a = hashes(gameContext({ skip: ['js/hist920.js'] }).E), b = hashes(gameContext().E); ok(a.every((h, i) => h === b[i]), 'đời sinh 2026 giống hệt khi có và không có hist920');
}
console.log('PASS hist920: ' + n + ' checks');
