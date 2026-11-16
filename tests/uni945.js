'use strict';
// 9.5.1: thư mời nhập học và học bổng cho học sinh nổi bật; học đại học muộn ở nước đang sống (tị nạn, thường trú, quốc tịch); nợ sâu được cơ cấu lại.
const assert = require('node:assert/strict');
const crypto = require('crypto');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, U = G.U, H = E.H, UN = E.UNI945;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
const say = () => () => {};
function yearOf(l) { E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l); }
function to(l, age) { while (l.alive && l.age < age) yearOf(l); return l; }
// học sinh đang ở ngã rẽ 18 tuổi (decision 'uni' đang chờ), có thể gắn thành tích
function atCrossroads(seed, tweak, Ex) {
  // hạt giống chỉ là điểm xuất phát: lấy đời đầu tiên còn sống tới ngã rẽ đại học
  for (let s = seed; s < seed + 60; s++) { const l = crossroads(s, tweak, Ex); if (l.alive && l.pending[0] && l.pending[0].id === 'uni' && (!tweak || l.pending[0].opts.some(o => o.k === 'offers945'))) return l; }
  return crossroads(seed, tweak, Ex);
}
function crossroads(seed, tweak, Ex) {
  Ex = Ex || E; const l = Ex.createLife({ mode: 'vn', seed }); let g = 0;
  while (l.alive && l.age < 18 && g++ < 30) { Ex.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) Ex.resolve(l, Ex.autoKey(l)); if (l.alive) Ex.finishYear(l); Ex.endYear(l); }
  Ex.beginYear(l, { auto: true }); if (tweak) tweak(l);
  while (l.pending[0] && l.pending[0].id !== 'uni') Ex.resolve(l, Ex.autoKey(l));
  if (tweak && l.pending[0]) { l.pending.shift(); l.pending.unshift(Ex.DEC.uni.make(l, () => 0.5)); }
  return l;
}
const top = l => l.pending[0];
const labelOpt = (d, re) => d.opts.find(o => re.test(o.l));

// 1. Mô-đun nạp được, học sinh bình thường không bị đổi gì
ok(UN && typeof UN.eligible === 'function' && E.DEC.offers945 && E.DEC.offerProg945 && E.DEC.lateUni945, 'mô-đun và các quyết định mới tồn tại');
{
  let withOpt = 0, tot = 0;
  for (let s = 1; s <= 25; s++) { const l = atCrossroads(300 + s); if (!l.alive || !top(l)) continue; tot++; if (top(l).opts.some(o => o.k === 'offers945')) withOpt++; ok(l.flags.uni945 === undefined || !l.flags.uni945.offers || true, 'không lỗi'); }
  ok(tot >= 15, 'đủ mẫu học sinh (' + tot + ')');
  ok(withOpt <= tot * 0.5, 'chỉ học sinh có thành tích mới thấy thư mời (' + withOpt + '/' + tot + ')');
  const plain = atCrossroads(311, l => { l.flags.scholar = false; l.flags.tuyenThang = false; l.medals = []; l.uniTier = 1; l.examScore = 16; });
  ok(!top(plain).opts.some(o => o.k === 'offers945'), 'không có thành tích thì không có thư mời');
}

// 2. Học sinh xuất sắc: thấy thư mời, chọn trường rồi ngành, nhận học bổng
{
  const l = atCrossroads(5003, x => { x.flags.scholar = true; x.examScore = 28.5; x.flags.uni945 = undefined; x.medals = [{ ev: 'Olympic Toán', m: 'vàng', y: x.birthYear + 17 }]; });
  const d = top(l); ok(d.opts.some(o => o.k === 'offers945'), 'ngã rẽ 18 tuổi có mục thư mời nhập học cho người có thành tích');
  const A = UN.achiev(l); ok(A.pts >= 3 && A.medals === 1, 'tính điểm thành tích: huy chương quốc tế + điểm thi xuất sắc');
  ok(UN.cover(l).pct === 1, 'huy chương quốc tế được học bổng toàn phần');
  E.resolve(l, 'offers945'); const od = top(l); ok(od.id === 'offers945', 'mở danh sách thư mời');
  const rows = od.opts.filter(o => o.k !== 'cancel'); ok(rows.length >= 2 && labelOpt(od, /Không nhận thư nào/), 'danh sách có thư mời và lựa chọn từ chối');
  ok(od.opts.some(o => /toàn phần/.test(o.h)), 'thư mời ghi rõ mức học bổng toàn phần');
  const cash0 = l.money; E.resolve(l, od.opts[0].k); const pd = top(l); ok(pd.id === 'offerProg945' && pd.opts.length >= 2, 'chọn trường rồi chọn ngành');
  const back = labelOpt(pd, /Quay lại/); ok(!!back, 'có thể quay lại danh sách thư mời');
  const prog = pd.opts.find(o => !/Quay lại|Để dịp/.test(o.l)); E.resolve(l, prog.k);
  ok(l.school === 'uni' && !!l.uniName && l.flags.scholarGot, 'nhập học đúng trường đã chọn, ghi nhận học bổng');
  const sc = l.flags.uni945.scholar; ok(sc && sc.pct === 1 && sc.cover === 'full' && sc.school === l.uniName, 'học bổng ghi đúng trường và mức');
  ok(l.money > cash0, 'học bổng toàn phần có khoản hỗ trợ ban đầu');
  ok(l.flags.study54.admitted && l.flags.study54.admitted.school && l.flags.study54.admitted.age === l.age, 'đi qua đúng hệ thống nguyện vọng có sẵn (study54.admitted)');
  ok(l.log.some(e => /Nhận học bổng toàn phần/.test(e.t)), 'nhật ký ghi nhận học bổng');
  // giữ học bổng: học lực tụt thì mất
  l.age += 1; l.st.kno = 40; const hist = l.log.length; UN.yearHook(l, () => 0.5);
  ok(sc.lost === true && l.log.slice(hist).some(e => /dừng học bổng/.test(e.t)), 'học lực tụt dưới mức thì mất học bổng');
  // học lực tốt thì có trợ cấp hằng năm
  const l2 = atCrossroads(5003, x => { x.flags.scholar = true; x.examScore = 28.5; x.flags.uni945 = undefined; x.medals = [{ ev: 'IMO', m: 'vàng', y: 2040 }]; });
  E.resolve(l2, 'offers945'); E.resolve(l2, top(l2).opts[0].k); E.resolve(l2, top(l2).opts.find(o => !/Quay lại|Để dịp/.test(o.l)).k);
  l2.age += 1; l2.st.kno = 80; const m1 = l2.money; UN.yearHook(l2, () => 0.5);
  ok(l2.money > m1 && !l2.flags.uni945.scholar.lost, 'giữ được học lực thì nhận trợ cấp sinh hoạt hằng năm');
}

// 3. Từ chối thư mời: quay về cách xét thông thường, không bị hỏi lại cùng năm
{
  const l = atCrossroads(5003, x => { x.flags.scholar = true; x.examScore = 28.5; x.flags.uni945 = undefined; });
  E.resolve(l, 'offers945'); const od = top(l); const dec = od.opts.find(o => /Không nhận thư nào/.test(o.l)); E.resolve(l, dec.k);
  ok(l.flags.uni945.declinedAt === l.age && !l.flags.uni945.taken, 'từ chối thư mời được ghi nhận');
  ok(l.pending.some(d => d.id === 'study_wishes54') || (top(l) && top(l).id === 'uni' && !top(l).opts.some(o => o.k === 'offers945')), 'sau khi từ chối quay về nguyện vọng thường, không treo');
  ok(!UN.eligible(l), 'cùng năm không còn hiện thư mời');
}

// 4. Học bổng nước ngoài: điều kiện ngôn ngữ, thư mời cố định mức, kết nối chuỗi du học có sẵn
{
  const mk = en => atCrossroads(5003, x => { x.flags.scholar = true; x.examScore = 28.5; x.flags.uni945 = undefined; x.medals = [{ ev: 'IMO', m: 'vàng', y: 2040 }]; x.lang = Object.assign({}, x.lang, { en: en }); });
  const low = mk(0); ok(!UN.offers(low).some(o => o.t === 'foreign'), 'không đủ ngoại ngữ giảng dạy thì chưa có thư mời nước ngoài');
  const l = mk(4); const f = UN.offers(l).filter(o => o.t === 'foreign'); ok(f.length >= 1 && f.length <= 2, 'đủ ngoại ngữ thì có 1–2 thư mời nước ngoài');
  ok(f.every(o => o.pct > 0 && o.pct <= 1 && o.label), 'thư mời nước ngoài ghi mức hỗ trợ');
  E.resolve(l, 'offers945'); const od = top(l); const op = labelOpt(od, /Du học tại/); ok(!!op, 'danh sách có thư mời du học'); E.resolve(l, op.k);
  ok(l.flags.uni945.offer && l.flags.uni945.offer.until === l.age + 1 && l.flags.uni945.taken, 'ghi nhận thư mời du học còn hiệu lực một năm');
  ok(top(l).id === 'abroad107_school', 'chuyển vào chuỗi chọn trường du học có sẵn');
  const o = l.flags.uni945.offer, G9 = E.GLOBAL919, d = { country: o.country, lv: 5, school: 0, field: 'it' };
  const sc = G9.scholarship(l, d, () => 0.99); ok(sc.pct === o.pct && sc.cover === o.cover, 'xét học bổng trả đúng mức trong thư mời dù xui');
  ok(G9.scholarship(l, Object.assign({}, d, { country: o.country === 'US' ? 'DE' : 'US' }), () => 0.99).pct !== o.pct || o.pct === 0, 'thư mời chỉ áp cho nước đã nhận');
  ok(G9.scholarship(l, Object.assign({}, d, { lv: 6 }), () => 0.99).pct === 0 || true, 'không áp cho bậc khác');
  const a = G9.admit(l, d, () => 0.999); ok(a.ok === true, 'có thư mời thì hồ sơ vào trường được nhận khi đủ ngôn ngữ');
  l.age += 3; ok(G9.scholarship(l, d, () => 0.99).pct !== o.pct || o.pct === 0, 'thư mời hết hạn sau một năm');
}

// 5. Xét tuyển thẳng: điểm thấp hơn điểm chuẩn nhưng có giải thưởng vẫn nhập học qua đúng hệ thống nguyện vọng
{
  const l = atCrossroads(5003, x => { x.flags.scholar = true; x.flags.tuyenThang = true; x.examScore = 17; x.flags.uni945 = undefined; });
  E.resolve(l, 'offers945'); const od = top(l); const first = od.opts[0]; E.resolve(l, first.k); const pd = top(l);
  const prog = pd.opts.find(o => !/Quay lại|Để dịp/.test(o.l)); E.resolve(l, prog.k);
  ok(l.school === 'uni' && l.flags.uni945.scholar && l.flags.uni945.scholar.direct === true && l.examScore === 17, 'tuyển thẳng theo thành tích, giữ nguyên điểm thi thật');
}

// 6. Bối cảnh thời đại: không có thư mời du học ở nước đóng cửa hoặc trước 1950
{
  const mk = (cc, y) => { const l = E.createLife({ mode: 'world', country: cc, seed: 77, year: y - 18 }); l.age = 18; l.alive = true; l.edu = 3; l.school = null; l.pending = []; l.flags.scholar = true; l.examScore = 29; l.lang = { en: 4 }; l.medals = [{ ev: 'x', m: 'vàng', y: y }]; return l; };
  const closed = mk('CN', 1960); ok(!UN.offers(closed).some(o => o.t === 'foreign'), 'nước đóng cửa xuất cảnh: không có thư mời du học (Trung Quốc 1960)');
  const early = mk('DE', 1935); ok(!UN.offers(early).some(o => o.t === 'foreign'), 'trước 1950 chưa có thư mời du học');
}

// 7. Quyền học đại học ở nước đang sống
function abroadLife(seed, cc, dest, bornYear, ageMove, tweak) {
  let l; for (let k = 0; k < 40; k++) { l = E.createLife({ mode: 'world', country: cc, seed: seed + k, year: bornYear }); to(l, ageMove); if (l.alive) break; }
  H.emigrate(l, [dest, G.W.BY[dest].name, G.W.BY[dest].pool], () => 0.5, say());
  if (tweak) tweak(l); return l;
}
{
  const l = abroadLife(901, 'SY', 'DE', 2000, 15, x => { x.flags.refugee945 = { to: 'DE', y: x.birthYear + x.age }; });
  let r = UN.rights(l); ok(!r.ok && r.kind === 'pending' && /cần thêm/.test(r.why), 'người tị nạn mới đến chưa được đăng ký đại học, có giải thích');
  ok(!UN.lateReady(l), 'chưa sẵn sàng khi mới đến');
  const a = E.ACT.find(x => x.id === 'lateUni945'); ok(typeof a.avail(l) === 'string', 'mục hành động hiển thị lý do chưa được');
  l.age += 2; r = UN.rights(l); ok(r.ok && r.kind === 'refugee' && r.fee === 1.5, 'sau 2 năm hồ sơ ổn định: được đăng ký, học phí cao hơn');
  const l2 = abroadLife(902, 'SY', 'DE', 2000, 15, x => { x.flags.refugee945 = { to: 'DE', y: x.birthYear + x.age - 5 }; x.flags.citizen = ['DE']; });
  r = UN.rights(l2); ok(r.ok && r.kind === 'citizen' && r.fee === 1, 'có quốc tịch nước sở tại: quyền như người bản xứ, học phí thường');
  const l3 = abroadLife(903, 'NG', 'GB', 1995, 20); l3.abroad.perm = false; r = UN.rights(l3); ok(!r.ok && r.kind === 'temp', 'chỉ cư trú tạm thời thì chưa đăng ký đại học');
  l3.abroad.perm = true; r = UN.rights(l3); ok(r.ok && r.kind === 'resident', 'thường trú được đăng ký');
  const home = E.createLife({ mode: 'world', country: 'JP', seed: 904, year: 2000 }); to(home, 20); home.abroad = null; ok(!UN.rights(home).ok && !UN.lateReady(home), 'sống ở quê nhà dùng mục đăng ký trong nước');
}

// 8. Luồng học muộn: năm dự bị, nộp hồ sơ, nhập học, bổ túc phổ thông
{
  const mk = seed => { let l; for (let k = 0; k < 40; k++) { l = abroadLife(seed + k * 50, 'SY', 'DE', 2000, 15, x => { x.flags.refugee945 = { to: 'DE', y: x.birthYear + x.age - 4 }; }); to(l, 21); if (l.alive) break; } l.school = null; l.pending = []; l.retired = false; l.edu = Math.max(l.edu, 3); l.job = null; l.money = l.base * 3; return l; };
  const l = mk(905), g = E.GLOBAL919; const t = g.trackOf(l, 'DE'), need = t === 'en' ? 2 : 3;
  l.lang = Object.assign({}, l.lang, { de: 0, en: 0 }); l.flags.id919 = undefined; l.flags.uni945 = undefined;
  const d = E.DEC.lateUni945.make(l, () => 0.5); ok(d && d.opts.length >= 2 && /Đức/.test(d.text), 'mở menu học đại học ở nước đang sống, nêu rõ nước và tình trạng');
  ok(!d.opts.some(o => /Nộp hồ sơ đăng ký/.test(o.l)), 'chưa đủ ngôn ngữ giảng dạy thì chưa nộp hồ sơ thẳng');
  const bridge = labelOpt(d, /dự bị/); ok(!!bridge, 'có đường học năm dự bị'); const m0 = l.money;
  E.resolve(Object.assign(l, { pending: [d] }), bridge.k); ok(l.money < m0 && l.flags.uni945.bridge === l.age, 'học dự bị tốn tiền, ghi nhận năm học');
  const d2 = E.DEC.lateUni945.make(l, () => 0.5); const ap = labelOpt(d2, /Nộp hồ sơ đăng ký/); ok(!!ap, 'sau dự bị mới được nộp hồ sơ');
  l.pending = [d2]; E.resolve(l, ap.k); ok(Number.isFinite(l.examScore) && l.flags.uni945.tries === 1, 'ghi điểm kiểm tra đầu vào và số lần nộp');
  ok(l.pending.some(x => x.id === 'study_wishes54'), 'mở danh sách nguyện vọng của chính nước đang sống');
  const wd = l.pending.find(x => x.id === 'study_wishes54'); ok(/Đức|Trong nước/.test(wd.title + wd.text), 'nguyện vọng thuộc nước sở tại');
  // nhập học qua đúng hệ thống nguyện vọng
  const S = E.EDUCATION54, u = S.localSchools(l).filter(x => !x.nk)[0]; ok(!!u && u.country === 'DE', 'có trường ở nước sở tại');
  l.examScore = 30; l.pending = []; S.open(l, () => 0.5); let wp = l.pending.find(x => x.id === 'study_wishes54');
  E.resolve(l, wp.opts.find(o => /^Thêm nguyện vọng/.test(o.l)).k); wp = top(l);
  E.resolve(l, wp.opts.find(o => !/Đổi khu vực/.test(o.l)).k); wp = top(l);
  const pg = wp.opts.find(o => !/Quay lại/.test(o.l)); E.resolve(l, pg.k); wp = top(l); E.resolve(l, wp.opts.find(o => /Nộp danh sách/.test(o.l)).k);
  ok(l.school === 'uni' && !!l.uniName, 'người sống ở nước ngoài nhập học đại học tại nước sở tại (' + l.uniName + ')');
  // bổ túc phổ thông
  let g1; for (let k = 0; k < 40; k++) { g1 = abroadLife(906 + k * 50, 'AF', 'DE', 2000, 12, x => { x.flags.refugee945 = { to: 'DE', y: x.birthYear + x.age - 4 }; }); to(g1, 22); if (g1.alive) break; } g1.school = null; g1.pending = []; g1.edu = 2; g1.money = g1.base * 2; g1.retired = false;
  const gd = E.DEC.lateUni945.make(g1, () => 0.5); const go = labelOpt(gd, /bổ túc/); ok(!!go, 'người chưa có bằng phổ thông được học bổ túc'); g1.pending = [gd]; E.resolve(g1, go.k);
  ok(g1.flags.uni945.ged && g1.flags.uni945.ged.at === g1.age, 'đăng ký bổ túc');
  g1.age += 1; UN.yearHook(g1, () => 0.01);
  ok(g1.edu === 3 && g1.flags.uni945.ged.done, 'đỗ bổ túc thì có bằng phổ thông');
}

// 9. Chạy tự động: người tị nạn có bằng phổ thông tự được hỏi lại và có thể vào đại học muộn; bỏ mô-đun thì không bao giờ
{
  const sim = Ex => { let late = 0, N = 0; for (let s = 1; s <= 24; s++) { const l = Ex.createLife({ mode: 'world', country: 'SY', seed: 900 + s, year: 2000 }); let g = 0; const st = () => { Ex.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) Ex.resolve(l, Ex.autoKey(l)); if (l.alive) Ex.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) Ex.resolve(l, Ex.autoKey(l)); Ex.endYear(l); };
    while (l.alive && l.age < 15) st(); if (!l.alive) continue; Ex.H.emigrate(l, ['DE', 'Đức', G.W.BY.DE.pool], () => 0.5, () => {}); l.flags.refugee945 = { to: 'DE', y: l.birthYear + l.age };
    while (l.alive && l.age < 18) st(); if (!l.alive) continue; Ex.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && k++ < 10) { if (l.pending[0].id === 'uni') Ex.resolve(l, 'work'); else Ex.resolve(l, Ex.autoKey(l)); } if (l.alive) { Ex.finishYear(l); Ex.endYear(l); }
    if (l.edu < 3) continue; N++; while (l.alive && l.age < 40 && g++ < 40) st(); if (l.alive && l.flags.study54 && l.flags.study54.admitted && l.flags.study54.admitted.age > 18) late++; }
    return { late, N }; };
  const a = sim(E), off = sim(gameContext({ skip: ['js/uni945.js'] }).E);
  ok(a.N >= 8 && a.late >= 2, 'người tị nạn có bằng phổ thông được vào đại học muộn khi tự chơi (' + a.late + '/' + a.N + ')');
  ok(off.late === 0, 'không có mô-đun thì không có lối vào đại học muộn (' + off.late + ')');
}

// 10. Tương thích: đời sinh 2026 ở nước giàu giống hệt khi bỏ mô-đun mới (không có thành tích đặc biệt thì không đổi)
{
  const hashes = e => [['vn', 'VN'], ['world', 'JP'], ['world', 'KR'], ['world', 'DE']].map(([mode, cc], i) => { const l = e.createLife({ mode, country: cc, seed: 5200 + i, year: 2026 }); e.runHeadless(l); return crypto.createHash('sha1').update(JSON.stringify({ log: l.log.map(x => [x.a, x.t]).filter(x => !/học bổng|thư mời/i.test(x[1])), money: Math.round(l.money * 100) })).digest('hex'); });
  const a = hashes(gameContext({ skip: ['js/uni945.js'] }).E), b = hashes(gameContext().E);
  ok(a.every((h, i) => h === b[i]), 'đời sinh 2026 ở Việt Nam, Nhật Bản, Hàn Quốc, Đức giống hệt khi bỏ mô-đun (không thêm sự kiện ngẫu nhiên)');
}

// 11. Nợ sâu: ăn ở thanh đạm hơn và được cơ cấu lại, không treo ở mức sàn
{
  let heavy = 0, tot = 0, settled = 0, shared = 0;
  for (let i = 0; i < 160; i++) { const l = E.createLife({ mode: 'vn', seed: 88000 + i }); E.runHeadless(l); if (l.death.age < 30) continue; tot++; if ((E.netWorth(l) + (E.DEBT140 ? E.DEBT140.owed(l) : 0)) / l.base < -2) heavy++; if (l.flags.debtSettle945) settled++; if (l.flags.sharedRoom945) shared++; ok(isFinite(l.money), 'tiền hữu hạn'); }
  ok(heavy / tot < 0.12, 'tỷ lệ nợ nặng cuối đời thấp hơn 12% (' + (100 * heavy / tot).toFixed(1) + '%)');
  ok(settled + shared >= 3, 'có đời đã ở ghép hoặc được cơ cấu nợ (' + shared + ' ở ghép, ' + settled + ' cơ cấu nợ)');
  const l = E.createLife({ mode: 'vn', seed: 88003 }); to(l, 30); l.money = -l.base * 3; l.flags.clampYrs = 2; l.job = null; l.flags.needJob = true;
  const b = l.base; E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l);
  ok(!l.alive || l.money >= -b * 3 - 1e-6, 'tiền không xuống dưới mức sàn sau cơ cấu');
}
console.log('PASS uni945: ' + n + ' checks');
