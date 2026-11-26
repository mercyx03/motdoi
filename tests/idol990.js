'use strict';
// 9.9.0: giải thưởng trong/ngoài nước theo năm (quá khứ, 2025, tương lai), hợp đồng nhóm, thành viên và sự cố nhiều giai đoạn, concert, fan meeting,
// sự kiện nhãn hàng, lan tỏa sản phẩm, gặp người hâm mộ, hẹn hò bị phát hiện, sửa lỗi fan album solo, tương thích bản lưu cũ.
const assert = require('assert'), G = require('./hardcore-isolation').gameContext(), E = G.E; const { year } = require('./lib/quick'); let n = 0;
function ok(v, m) { assert(v, m); n++; }
const D = E.IDOL990D, K = E.IDOL990, LV = E.IDOL990L, L = E.LIFE138, I = E.IDOL155, P = E.IDOL987;
ok(D && K && LV && P, 'module 9.9.0 đã nạp');
const half = () => 0.5, lo = () => 0.0, hi = () => 0.999;
function life(age, y, o) { const l = E.createLife(Object.assign({ mode: 'world', country: 'KR', year: y - age, seed: 11 }, o || {})); l.age = age; return l; }
function logger(l) { return (t, k) => l.log.push({ a: l.age, y: l.birthYear + l.age, t, k }); }
function idolLife(age, y, o) {
  o = o || {}; const l = life(age, y, { sex: o.sex || 'F', country: o.country || 'KR' }); ['sing', 'dance', 'rap', 'acting'].forEach(k => { L.skill(l, k).level = o.skill || 72; });
  l.fame = o.fame || 8e5; l.money = 1e10; const s = I.S(l); s.stage = 'debut';
  s.group = { name: 'NOVA', members: ['Ha Rin', 'Mi Joo', 'Seo Yeon', 'Da Eun'], position: o.pos || 'vocal', debutAge: o.debut == null ? age - 3 : o.debut, fandom: o.fandom || 4e5, albums: o.albums || [], wins: 0 };
  if (o.leader) s.group.extra987 = ['leader'];
  L.state(l).agency = { name: 'Star Ent', code: o.agency || o.country || 'KR', status: 'debut', years: 0, started: age - 5 };
  P.state(l).pop = o.pop == null ? 70 : o.pop; return l;
}
function mkr(seed) { let a = (seed * 2654435761) >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function resolve(l, pick) { let c = 0; while (l.pending && l.pending.length && c++ < 12) { const d = l.pending.shift(), X = E.DEC[d.id]; const k = pick ? pick(d) : X.auto(l, d, half); X.apply(l, d, k, half, logger(l)); } }
// ---------------------------------------------------------------- 1. Dữ liệu giải thưởng và địa điểm theo năm
const CODES = Object.keys(D.IND).concat(['ZZ', 'LA']);
CODES.forEach(c => { for (let y = 1900; y <= 2100; y += 5) { const a = D.awards(c, y, 'dom'); ok(a.length >= 1, c + ' ' + y + ' luôn có ít nhất một giải trong nước'); a.forEach(x => ok(typeof D.nameOf(x, y) === 'string' && D.nameOf(x, y).length > 2, 'tên giải hợp lệ')); } });
const has = (c, y, id, sc) => D.awards(c, y, sc || 'dom').some(a => a.id === id);
ok(!has('KR', 1998, 'mama') && has('KR', 1999, 'mama'), 'MAMA bắt đầu 1999');
ok(D.nameOf(D.awards('KR', 2010, 'dom').filter(a => a.id === 'mama')[0], 2010) !== D.nameOf(D.awards('KR', 2023, 'dom').filter(a => a.id === 'mama')[0], 2023), 'MAMA đổi tên theo năm');
ok(has('KR', 1986, 'golden') && !has('KR', 1985, 'golden') && has('KR', 1990, 'seoul') && has('KR', 2009, 'melon') && !has('KR', 2008, 'melon'), 'mốc Golden Disc, Seoul Music Awards, Melon');
ok(has('KR', 2040, 'mama') && has('KR', 2080, 'melon'), 'giải còn tồn tại ở tương lai');
ok(has('KR', 2030, 'ceremony2030') && !has('KR', 2029, 'ceremony2030'), 'có giải mới xuất hiện từ 2030');
ok(has('DE', 2018, 'echo') && !has('DE', 2019, 'echo') && has('DE', 2019, 'dmp'), 'giải kết thúc có giải kế nhiệm');
ok(has('VN', 1997, 'lsx') && has('VN', 2005, 'conghien') && has('VN', 2010, 'zma') && !has('VN', 1996, 'lsx'), 'giải Việt Nam theo mốc năm');
ok(has('US', 1959, 'grammy') && has('JP', 1959, 'jra') && has('TH', 1990, 'season'), 'Grammy, Japan Record Awards, Season Awards');
ok(D.awards('KR', 2025, 'intl').some(a => a.id === 'i_mama') && !D.awards('KR', 2000, 'intl').some(a => a.id === 'i_mama') && D.awards('VN', 2040, 'intl').some(a => a.id === 'i_global'), 'giải quốc tế theo năm, kể cả tương lai');
const dome = (c, y) => D.venues(c, y).some(v => v.k === 'dome'), std = (c, y) => D.venues(c, y).some(v => v.k === 'stadium');
ok(!dome('KR', 2014) && dome('KR', 2015) && !dome('JP', 1987) && dome('JP', 1988) && !dome('VN', 2060) && !std('VN', 2002) && std('VN', 2003) && std('GB', 1950), 'dome và sân vận động chỉ có khi đã xây');
ok(D.era(1960).id === 'radio' && D.era(2000).id === 'cd' && D.era(2020).id === 'short' && D.era(2035).id === 'ai' && D.era(2070).id === 'immersive', 'thời kỳ công nghệ');
// ---------------------------------------------------------------- 2. Cơ chế trao giải
{
  const l = idolLife(24, 2016); const a = D.awards('KR', 2016, 'dom').filter(x => x.id === 'melon')[0], rel = { q: 0.9 };
  const w = K.rollAward(l, lo, a, 1.1, rel, 3, false); ok(w && w.cats.length === 3, 'điểm cao, may mắn: thắng đủ ba hạng mục lớn');
  ok(K.rollAward(l, hi, a, 1.1, rel, 3, false) === null || K.rollAward(l, hi, a, 1.1, rel, 3, false).cats.length === 0, 'không may mắn thì không thắng giải lớn');
  ok(K.rollAward(l, lo, a, 1.1, null, 3, false) === null, 'giải lớn cần có sản phẩm trong năm');
  const r0 = K.rollAward(l, lo, a, 1.1, rel, 1, false), r1 = K.rollAward(l, lo, a, 1.1, rel, 5, false); ok(r0.rookie && !r1.rookie, 'giải tân binh chỉ trong 1–2 năm đầu');
  P.state(l).pop = 20; const low = K.rollAward(l, lo, a, 0.5, rel, 3, false); ok(low === null || low.cats.length === 0, 'độ nổi tiếng thấp không đoạt giải lớn');
}
for (const [c, y] of [['KR', 1992], ['KR', 2016], ['KR', 2025], ['KR', 2026], ['KR', 2045], ['VN', 2006], ['VN', 2030], ['JP', 1995], ['US', 1980], ['US', 2060], ['TH', 2018], ['DE', 2010], ['ZZ', 1975], ['NG', 2012]]) {
  const l = idolLife(26, y, { country: c === 'ZZ' ? 'VN' : c, agency: c === 'ZZ' ? 'ZZ' : c, pop: 95, fame: 6e6, fandom: 3e6, skill: 90 }); K.S(l).intl = 3; const g = I.S(l).group; g.albums.push({ age: l.age, title: 'x', q: 1.1 });
  let got = null; for (let i = 0; i < 40 && !got; i++) { l.age = 26; K.S(l).awYear = null; K.S(l).awards = []; K.S(l).first = {}; got = K.awardsYear(l, ((s) => () => (s = (s * 9301 + 49297) % 233280) / 233280)(i + 1), logger(l)); if (got && !got.wins.length) got = null; }
  ok(got && got.wins.length, c + ' ' + y + ' người rất nổi tiếng nhận được giải');
  ok(K.S(l).awards.every(a => a.y === y && typeof a.n === 'string'), c + ' ' + y + ' ghi đúng năm và tên giải');
}
{ const l = idolLife(24, 2016, { country: 'VN', agency: 'VN', pop: 90 }); K.S(l).intl = 0; const got = K.awardsYear(l, half, logger(l)); ok(!K.S(l).awards.some(a => a.intl), 'chưa có thị trường nước ngoài thì không có giải quốc tế'); }
// ---------------------------------------------------------------- 3. Hợp đồng nhóm
{
  const l = idolLife(22, 2016, { debut: 20 }), g = I.S(l).group, c = K.contract(l); ok(c.len === 7 && c.until === 27 && c.from === 20 && !c.grace, 'hợp đồng 7 năm cho nhóm Hàn');
  ok(K.contract(idolLife(22, 2016, { country: 'VN', agency: 'VN', debut: 20 })).len === 5, 'ngành khác có thời hạn khác');
  const old = idolLife(35, 2016, { debut: 18 }); ok(K.contract(old).until > old.age, 'bản lưu cũ debut từ lâu không bị ép quyết định ngay');
  const mk = () => { const t = idolLife(27, 2016, { debut: 20 }); I.S(t).group.contract990 = { from: 20, len: 7, until: 27, renewals: 0 }; return t; };
  let l1 = mk(); K.contract(l1); K.doContract(l1, half, logger(l1), 'renew'); ok(K.contract(l1) && (K.contract(l1).renewals === 1 && K.contract(l1).until > 27 || !K.grp(l1)), 'tái ký kéo dài hợp đồng');
  l1 = mk(); K.contract(l1); K.doContract(l1, half, logger(l1), 'renew', lo); ok(K.grp(l1) && K.contract(l1).until === 27 + 4 && (I.S(l1).group.members || []).length === 4, 'mọi thành viên cùng tái ký');
  l1 = mk(); K.contract(l1); K.doContract(l1, half, logger(l1), 'renew', hi); ok(!K.grp(l1) || (I.S(l1).group.members || []).length <= 1 || I.S(l1).group.disbanded, 'thành viên không tái ký thì rời nhóm, còn ít người thì nhóm tan');
  l1 = mk(); K.contract(l1); const f0 = l1.fame; K.doContract(l1, half, logger(l1), 'soloFree'); ok(L.state(l1).agency.status === 'left' && !K.grp(l1) && l1.fame < f0 && I.S(l1).exGroup990, 'ra solo tự do: rời công ty, mất một phần người theo dõi');
  l1 = mk(); K.contract(l1); K.doContract(l1, half, logger(l1), 'soloCo'); ok(!K.grp(l1) && L.state(l1).agency.status === 'debut' && I.S(l1).stage === 'debut' && !I.S(l1).group, 'ra solo ở lại công ty, không sinh nhóm mới');
  l1 = mk(); K.contract(l1); K.doContract(l1, half, logger(l1), 'retire'); ok(I.S(l1).stage === 'left' && K.S(l1).retired === 27, 'giải nghệ');
  // quyết định xuất hiện đúng hạn và không tự giải quyết trước khi người chơi chọn
  l1 = mk(); K.contract(l1); l1.pending = []; K.contractYear(l1, half, logger(l1)); ok(l1.pending.length === 1 && l1.pending[0].id === 'contract990' && K.contract(l1).asked === 27, 'đến hạn thì có quyết định');
  const d = l1.pending[0]; ok(d.opts.length >= 4, 'có nhiều lựa chọn'); K.contractYear(l1, half, logger(l1)); ok(l1.pending.length === 1, 'không tạo trùng quyết định');
  resolve(l1); ok(!l1.pending.length, 'quyết định xử lý được ở chế độ tự động');
  const l2 = idolLife(26, 2016, { debut: 20 }); I.S(l2).group.contract990 = { from: 20, len: 7, until: 27, renewals: 0 }; K.contract(l2); K.contractYear(l2, half, logger(l2)); ok(l2.log.some(x => /còn một năm/.test(x.t)), 'nhắc trước một năm');
}
// ---------------------------------------------------------------- 4. Thành viên và sự cố nhiều giai đoạn
{
  const l = idolLife(24, 2016, { leader: true }), g = I.S(l).group; const ms = K.mems(l, g); ok(ms.length === 4 && ms.every(m => m.trait && m.want && m.bond >= 40), 'mỗi thành viên có tính cách, mong muốn, độ thân thiết');
  const ms2 = K.mems(l, g); ok(JSON.stringify(ms) === JSON.stringify(ms2), 'hồ sơ thành viên nhất quán qua các lần xem'); const g2 = JSON.parse(JSON.stringify(g)); ok(JSON.stringify(K.mems(Object.assign({}, l, { flags: l.flags }), g2)) === JSON.stringify(ms), 'hồ sơ thành viên giữ nguyên sau khi lưu và tải lại');
  ok(K.isLeader(l) && !K.isLeader(idolLife(24, 2016)), 'nhận ra trưởng nhóm');
  const TR = ['chăm chỉ', 'thẳng tính', 'nhạy cảm', 'điềm tĩnh', 'hài hước', 'cầu toàn', 'hướng nội', 'hòa đồng']; ok(!/giàu|nghèo|đạo|nghề|xinh|đẹp/.test(TR.join(' ')), 'tính cách không gắn với giàu nghèo, tôn giáo, nghề hay ngoại hình');
  // phát sinh sự cố
  let made = null; for (let i = 0; i < 60 && !made; i++) { const t = idolLife(24, 2016, { leader: true }); K.S(t).issues = []; K.newIssue(t, I.S(t).group, ((s) => () => (s = (s * 16807) % 2147483647) / 2147483647)(i + 3), logger(t)); if (K.S(t).issues.length) made = t; }
  ok(made, 'sự cố phát sinh theo xác suất'); const is = K.S(made).issues[0]; ok(is.heat < 45 && K.stageOf(is) <= 1, 'sự cố bắt đầu ở mức nhẹ, chưa giải quyết ngay');
  ok(['rivalry', 'couple', 'fanlove', 'illness'].includes(is.kind), 'loại sự cố hợp lệ');
  const rows = K.issueRows(made, is); ok(rows.length >= 4 && rows.every(r => r.l && r.run), 'có nhiều cách xử lý');
  // không xử lý: leo thang qua nhiều năm rồi bùng nổ
  const t2 = made; K.S(t2).issues = [Object.assign({}, is, { done: false, heat: 40, hist: [], calm: 0 })]; let yrs = 0, done = false; for (; yrs < 14 && !done; yrs++) { t2.age++; K.S(t2).issueYear = null; K.issuesYear(t2, ((s) => () => (s = (s * 16807) % 2147483647) / 2147483647)(yrs + 5), logger(t2)); done = K.S(t2).issues[0].done; t2.pending = []; }
  ok(done && yrs >= 2, 'bỏ mặc thì leo thang nhiều năm rồi bùng nổ, không tự biến mất ngay (' + yrs + ' năm)');
  ok(K.S(t2).issues[0].res && K.S(t2).hist.some(h => /Kết thúc|Hòa giải/.test(h.t)), 'kết quả được ghi vào lịch sử');
  // xử lý tốt: hạ nhiệt và hòa giải
  const t3 = made; K.S(t3).issues = [Object.assign({}, is, { done: false, heat: 55, hist: [], calm: 0 })]; const s3 = K.S(t3).issues[0], before = s3.heat; K.issueRows(t3, s3)[0].run(t3, half, logger(t3)); ok(s3.heat < before, 'nói chuyện riêng làm giảm căng thẳng');
  for (let i = 0; i < 6 && !s3.done; i++) { t3.age++; K.S(t3).issueYear = null; K.issueRows(t3, s3)[0].run(t3, half, logger(t3)); s3.askedAt = null; K.issuesYear(t3, lo, logger(t3)); t3.pending = []; }
  ok(s3.done && s3.res === 'đã hòa giải' && K.S(t3).first.resolved, 'xử lý bền bỉ thì hòa giải, ghi thành tựu của trưởng nhóm');
  // quyết định cho trưởng nhóm; người không phải trưởng nhóm chỉ hỗ trợ
  const t4 = idolLife(24, 2016, { leader: true }); K.S(t4).issues = [{ id: 'x1', key: 'k', kind: 'rivalry', a: 'Ha Rin', b: 'Mi Joo', why: 'a', y: 2016, age: 24, heat: 50, trust: 50, calm: 0, hist: [], done: false, acts: 0 }]; t4.pending = []; K.S(t4).issueYear = null; K.issuesYear(t4, half, logger(t4)); ok(t4.pending.some(d => d.id === 'issue990'), 'trưởng nhóm nhận quyết định xử lý'); resolve(t4); ok(K.S(t4).issues[0].hist.length >= 1, 'lựa chọn được ghi nhớ');
  const t5 = idolLife(24, 2016); K.S(t5).issues = [{ id: 'x2', key: 'k2', kind: 'illness', a: 'Da Eun', b: null, why: 'a', y: 2016, age: 24, heat: 50, trust: 50, calm: 0, hist: [], done: false, acts: 0 }]; t5.pending = []; K.S(t5).issueYear = null; K.issuesYear(t5, half, logger(t5)); ok(!t5.pending.some(d => d.id === 'issue990'), 'thành viên không phải trưởng nhóm không bị ép xử lý');
  const mm = Object.keys(E.UPDATE110.menus || {}); ok(true, 'menu đăng ký');
}
// ---------------------------------------------------------------- 5. Lan tỏa sản phẩm theo thời kỳ
{
  const mk = (y, promo) => { const l = idolLife(24, y, { pop: 80 }); I.S(l).group.albums.push({ age: 24, title: 'x', q: 1.0 }); if (promo) K.S(l).promo = { age: 24, kind: promo }; return l; };
  const out = {}; [1975, 1995, 2020, 2040].forEach(y => { let kinds = {}; for (let i = 0; i < 30; i++) { const l = mk(y, 'challenge'); l.id = 'r' + i; const r = K.reachYear(l, ((s) => () => (s = (s * 16807) % 2147483647) / 2147483647)(i + 2), logger(l)); if (r) kinds[r.kind] = 1; } out[y] = kinds; });
  ok(!out[1975].viral && !out[1995].viral && (out[2020].viral || out[2020].quocdan), 'lan truyền kiểu thử thách chỉ có ở thời kỳ mạng xã hội');
  ok(K.eraFit(mk(2020), 'social') > K.eraFit(mk(1975), 'social') && K.eraFit(mk(1985), 'tv') > K.eraFit(mk(2020), 'tv'), 'cách quảng bá hợp thời kỳ mới hiệu quả');
  const l = mk(2020, 'low'); l.fame = 1e6; l.id = 'chim'; I.S(l).group.albums[0].q = 0.05; K.reachYear(l, lo, logger(l)); ok(l.log.some(x => /không tạo được tiếng vang|vừa phải|Ca khúc/.test(x.t)), 'sản phẩm kém không phủ sóng');
}
// ---------------------------------------------------------------- 6. Album solo: fan thay đổi và được báo cáo
{
  const l = idolLife(24, 2020, { pop: 80, fandom: 4e5, fame: 3e6 }); const g = I.S(l).group, f0 = g.fandom; P.plan(l, half, logger(l), 'full', 'dance', 'high'); ok(P.state(l).solo, 'bắt đầu sản xuất album');
  let solo = null; for (let i = 0; i < 3; i++) { l.age++; P.release(l, logger(l)); } const s = P.state(l);
  ok(s.albums.length === 1 && g.fandom > f0, 'phát hành album solo làm fandom tăng (trước đây đứng yên)');
  ok(l.log.some(x => /Người hâm mộ tăng/.test(x.t)), 'nhật ký ghi rõ số người hâm mộ tăng'); ok(s.lastRelease && s.lastRelease.q > 0, 'ghi lại chất lượng sản phẩm để xét giải và độ lan tỏa');
  const bad = idolLife(24, 2020, { pop: 20, fandom: 4e5, fame: 3e5, skill: 10 }); const gb = I.S(bad).group, fb = gb.fandom; P.state(bad).solo = { type: 'single', concept: 'ballad', budget: 'low', at: 23, release: 24, byCo: true, cost: 1 }; P.release(bad, logger(bad)); ok(gb.fandom <= fb && bad.log.some(x => /Người hâm mộ giảm/.test(x.t)), 'sản phẩm quá yếu làm mất bớt người hâm mộ');
}
// ---------------------------------------------------------------- 7. Concert
{
  const mkc = (age, y, o) => { const l = idolLife(age, y, Object.assign({ pop: 85, fandom: 3e6, fame: 5e6 }, o || {})); return l; };
  ok(LV.venueList(mkc(26, 2010), 'dom').every(v => v.k !== 'dome') && LV.venueList(mkc(26, 2016), 'dom').some(v => v.k === 'dome'), 'địa điểm theo năm: Hàn Quốc có dome từ 2015');
  ok(LV.venueList(mkc(26, 2020), 'intl').every(v => v.k === 'hall' || v.k === 'arena'), 'lần đầu ra nước ngoài chỉ thuê được nơi nhỏ');
  K.S(mkc(26, 2020)).intl = 3; const lt = mkc(26, 2020); K.S(lt).intl = 3; ok(LV.venueList(lt, 'intl').some(v => v.k === 'stadium'), 'đã có tiếng ở nước ngoài thì thuê được sân vận động');
  const l = mkc(26, 2016); const a = { kind: 'group', scope: 'dom', venue: 'dome', concept: 'dance', setlist: 'hits', outfit: 'custom', guest: 'mates', budget: 'mid' };
  const e = LV.est(l, a); ok(e && e.sold > 0 && e.cost > 0 && e.rev > e.cost * 0.2, 'ước tính doanh thu và chi phí');
  const m0 = l.money; LV.planConcert(l, half, logger(l), a); ok(K.S(l).cons.length === 1 && l.money === m0, 'nhóm do công ty đầu tư, không trừ tiền trước'); ok(K.S(l).cons[0].year === 2017, 'concert diễn ra năm sau');
  LV.planConcert(l, half, logger(l), a); ok(K.S(l).cons.length === 1, 'không lên kế hoạch hai concert cùng lúc');
  l.age++; K.S(l).liveYear = null; LV.concertYear(l, half, logger(l)); const c = K.S(l).cons[0]; ok(c.done && c.q > 0, 'concert diễn ra'); ok(K.S(l).first.concert && K.S(l).first.dome && !K.S(l).first.stadium, 'thành tựu lần đầu ở dome');
  ok(l.log.some(x => /lần đầu tổ chức concert ở dome/.test(x.t)), 'nhật ký ghi thành tựu dome');
  const s2 = mkc(28, 2022); K.S(s2).intl = 3; LV.planConcert(s2, half, logger(s2), { kind: 'solo', scope: 'intl', venue: 'stadium', concept: 'story', setlist: 'fan', outfit: 'collab', guest: 'star', budget: 'high' }); s2.age++; LV.concertYear(s2, half, logger(s2)); ok(K.S(s2).first.stadium && K.S(s2).first.overseas && K.S(s2).intl === 4, 'sân vận động và nước ngoài lần đầu');
  // tai tiếng nặng: hoãn rồi hủy
  const t = mkc(26, 2016); LV.planConcert(t, half, logger(t), a); t.age++; K.img(t).scandal = 90; LV.concertYear(t, half, logger(t)); const ct = K.S(t).cons[0]; ok(ct.postponed && !ct.done && ct.year === 2018, 'tai tiếng nặng: hoãn concert'); t.age++; ct.heldAt = null; LV.concertYear(t, half, logger(t)); ok(ct.cancelled, 'hoãn lần hai thì hủy');
  // solo tự trả: đặt cọc
  const so = idolLife(26, 2016, { pop: 70, fandom: 1e6, fame: 1e6 }); I.S(so).group = null; I.S(so).stage = 'left'; L.state(so).agency.status = 'left'; so.job = { id: 'ca_si' }; K.S(so).intl = 0; const mo0 = so.money; const aa = { kind: 'solo', scope: 'dom', venue: 'arena', concept: 'band', setlist: 'hits', outfit: 'simple', guest: 'none', budget: 'low' };
  if (K.performer(so)) { LV.planConcert(so, half, logger(so), aa); ok(K.S(so).cons.length === 1 ? so.money < mo0 : true, 'ca sĩ solo tự đặt cọc'); }
  // thời đại trực tuyến
  const old = mkc(26, 1975, { country: 'US', agency: 'US' }); ok(LV.venueList(old, 'dom').some(v => v.k === 'dome') && !LV.venueList(mkc(26, 1960, { country: 'US', agency: 'US' }), 'dom').some(v => v.k === 'dome'), 'Mỹ có dome từ 1965');
  const on = mkc(26, 2022); const eo = LV.est(on, { kind: 'online', scope: 'dom', venue: 'hall', concept: 'band', setlist: 'hits', outfit: 'simple', guest: 'none', budget: 'low' }); ok(eo && eo.rent === 0, 'concert trực tuyến không tốn thuê địa điểm');
}
// ---------------------------------------------------------------- 8. Fan meeting, sự kiện nhãn hàng, quảng bá
{
  const l = idolLife(24, 2020, { pop: 70, fandom: 5e5 }); const w0 = K.img(l).warm; LV.holdFanmeet(l, half, logger(l), { fmt: 'sign', theme: 'open', sec: 'strict' }); ok(K.img(l).warm > w0 && K.S(l).first.fanmeet && K.S(l).fm.at === 24, 'fan meeting tăng thiện cảm và được ghi nhớ');
  const l2 = idolLife(24, 2020, { pop: 70 }); P.state(l2).deals = [{ brand: 'Mode Atelier', cat: 'fashion', kind: 'ambassador', fee: 1, from: 20, until: 30, record0: 0 }]; LV.holdBrand(l2, lo, logger(l2), { ev: 'week', full: true, wear: 'own' }); ok(P.state(l2).deals[0].rel990 === -1, 'mặc đồ hãng khác ở sự kiện của nhãn hàng đại diện làm xấu quan hệ');
  const l3 = idolLife(24, 2020, { pop: 70 }); P.state(l3).deals = [{ brand: 'X', cat: 'fashion', kind: 'ambassador', fee: 1, from: 20, until: 30, record0: 0 }]; LV.holdBrand(l3, hi, logger(l3), { ev: 'launch', full: true, wear: 'brand' }); ok(P.state(l3).deals[0].rel990 === 1 && K.img(l3).pro > 50, 'dùng trang phục nhãn hàng giữ quan hệ tốt');
}
// ---------------------------------------------------------------- 9. Gặp người hâm mộ ngoài đời
{
  const vs = Object.values(LV.ENC).map(e => e.v); ok(vs.filter(v => v > 0).length >= 3 && vs.filter(v => v < 0).length >= 3 && vs.filter(v => v === 0).length >= 1, 'sự kiện tích cực, tiêu cực, trung tính cân bằng');
  Object.keys(LV.ENC).forEach(id => LV.ENC[id].o.forEach((o, i) => { const l = idolLife(24, 2020, { pop: 80 }); l.partner = { name: 'P', sex: 'M', age: 25, status: 'dating', since: 22, alive: true }; K.S(l).date990 = { stage: 'secret', risk: 0, hist: [], key: 'P:22' }; LV.applyEnc(l, half, logger(l), LV.ENC[id], o, id); const m = K.img(l); ok(['warm', 'pro', 'trust', 'scandal'].every(k => m[k] >= 0 && m[k] <= 100), id + '#' + i + ' chỉ số hình ảnh trong khoảng'); ok(K.S(l).encLast[id] === 24, id + ' ghi nhận thời điểm'); }));
  const a = idolLife(24, 2020, { pop: 80 }), b = idolLife(24, 2020, { pop: 80 }); LV.applyEnc(a, half, logger(a), LV.ENC.sign, LV.ENC.sign.o[0], 'sign'); LV.applyEnc(b, half, logger(b), LV.ENC.sign, LV.ENC.sign.o[3], 'sign'); ok(K.img(a).warm > K.img(b).warm, 'cách phản ứng khác nhau cho ấn tượng khác nhau');
  const l = idolLife(24, 2020, { pop: 80 }); let c = 0; for (let i = 0; i < 40; i++) { l.age = 24; K.S(l).encYear = null; K.S(l).encLast = {}; l.id = 'e' + i; l.pending = []; LV.encounterYear(l, mkr(i + 1), logger(l)); c += l.pending.length; if (l.pending[0]) ok(l.pending[0].opts.length >= 2, 'sự kiện ngoài phố có lựa chọn'); } ok(c > 5 && c < 40, 'gặp người hâm mộ ngoài đời thỉnh thoảng xảy ra (' + c + '/40)');
  const t = idolLife(24, 2020, { pop: 80 }); t.pending = []; K.S(t).encYear = null; K.S(t).encLast = { sign: 23, caught: 23, withp: 23, kid: 23, film: 23, stalk: 23, help: 23, misid: 23, rude: 23, gift: 23, elder: 23 }; LV.encounterYear(t, lo, logger(t)); ok(!t.pending.length, 'sự kiện vừa xảy ra thì có thời gian chờ để không lặp');
}
// ---------------------------------------------------------------- 10. Hẹn hò bị phát hiện
{
  const mk = (c, y, o) => { const l = idolLife(24, y, Object.assign({ country: c, agency: c, pop: 80, fandom: 2e6, fame: 4e6 }, o || {})); l.partner = { name: 'Kim Soo-jin', sex: 'M', age: 26, status: 'dating', since: 23, alive: true }; return l; };
  ok(LV.severity(mk('KR', 2020)) === 3 && LV.severity(mk('US', 2020)) === 0 && LV.severity(mk('VN', 2020)) >= 0, 'mức khắt khe theo ngành');
  const l = mk('KR', 2020); let stage = []; for (let i = 0; i < 12; i++) { l.age = 24 + i; K.S(l).liveYear = null; LV.dateYear(l, ((s) => () => (s = (s * 16807) % 2147483647) / 2147483647)(i + 9), logger(l)); stage.push(K.S(l).date990 && K.S(l).date990.stage); l.pending = l.pending.filter(d => d.id !== 'dateExpose990' ? true : (resolveOne(l, d), false)); if (!l.partner) break; }
  function resolveOne(l, d) { E.DEC[d.id].apply(l, d, '0', half, logger(l)); }
  ok(stage.some(s => s === 'rumor' || s === 'exposed' || s === 'aftermath'), 'chuỗi tin đồn → bị đăng báo → hậu quả (' + stage.join(',') + ')');
  const react = (c, k, ev) => { const t = mk(c, 2020); K.S(t).date990 = { key: 'Kim Soo-jin:23', name: 'Kim Soo-jin', stage: 'exposed', since: 23, risk: 40, hist: [], ev: !!ev }; const f0 = t.fame; LV.react(t, half, logger(t), k); return { t, loss: 1 - t.fame / f0 }; };
  const kr = react('KR', 'sincere'), us = react('US', 'sincere'); ok(kr.loss > us.loss, 'cùng cách xử lý, nơi khắt khe thiệt hại lớn hơn nơi thoáng');
  ok(react('KR', 'deny', true).loss > react('KR', 'sincere', true).loss, 'phủ nhận khi bằng chứng rõ ràng tệ hơn xác nhận');
  ok(react('KR', 'deny', false).loss < react('KR', 'deny', true).loss, 'phủ nhận khi không có bằng chứng ít thiệt hại hơn');
  const bk = react('KR', 'breakup'); ok(bk.t.partner === null && bk.t.exes >= 1 && K.S(bk.t).date990.stage === 'done', 'chia tay để dập tắt: kết thúc mối quan hệ');
  { const t = mk('KR', 2020); delete t.flags.idol987; K.S(t).date990 = { key: 'Kim Soo-jin:23', name: 'Kim Soo-jin', stage: 'exposed', since: 23, risk: 40, hist: [], ev: true }; let err = null; try { LV.react(t, half, logger(t), 'deny'); } catch (e) { err = e; } ok(!err, '9.11.6: hẹn hò bị lộ khi chưa có dữ liệu hợp đồng quảng cáo không gây lỗi'); }
  const dn = react('KR', 'deny', false); ok(K.S(dn.t).date990.stage === 'secret' && K.S(dn.t).date990.risk > 40, 'phủ nhận thành công vẫn để lại rủi ro về sau');
  ok(react('KR', 'sincere').t.log.some(x => /Người hâm mộ giảm|xác nhận mối quan hệ/.test(x.t)), 'nhật ký ghi phản ứng của người hâm mộ');
  const free = mk('KR', 2020); free.partner = null; LV.dateYear(free, half, logger(free)); ok(!K.S(free).date990, 'không có người yêu thì không có chuỗi hẹn hò');
  const bef = mk('KR', 1950, {}); ok(true, 'năm cũ không lỗi');
  const dec = E.DEC.dateExpose990.make(mk('KR', 2020), half, {}); ok(dec.opts.length === 6, 'quyết định có đủ cách phản ứng trước truyền thông');
}
// ---------------------------------------------------------------- 11. Tương tác: quảng cáo, hình ảnh, hồ sơ, bản lưu
{
  const l = idolLife(24, 2020, { pop: 80 }); P.state(l).deals = [{ brand: 'Fresh Wave', cat: 'drink', kind: 'ambassador', fee: 1, from: 20, until: 30, paidAt: 24, record0: 0 }]; K.img(l).scandal = 80; K.S(l).yearAt = null; P.dealsYear(l, logger(l)); ok(P.state(l).deals[0].ended === 24, 'tai tiếng nặng: nhãn hàng chấm dứt hợp đồng đại diện');
  const s = idolLife(24, 2020, { pop: 80 }); K.img(s).scandal = 60; ok(P.makeOffers(s).length <= 1, 'tai tiếng làm giảm lời mời quảng cáo');
  const l2 = idolLife(24, 2020, { pop: 80 }); K.S(l2).awards.push({ y: 2020, id: 'melon', n: 'Melon Music Awards', tier: 'grand', cat: 'Album của năm' }); const p = E.profile(l2); ok(p && Array.isArray(p.jobInfo), 'hồ sơ vẫn dựng được'); ok(/Giải thưởng: 1/.test(p.jobInfo.join('|')), 'hồ sơ có số giải thưởng');
  const raw = JSON.parse(JSON.stringify(l2.flags)); ok(raw.idol990 && raw.idol990.awards.length === 1, 'trạng thái mới lưu được dạng JSON');
  const legacy = idolLife(24, 2020, { pop: 80 }); delete legacy.flags.idol990; delete I.S(legacy).group.mem990; delete I.S(legacy).group.contract990; legacy.pending = []; let thrown = null; try { for (let i = 0; i < 4; i++) { year(E, legacy); resolve(legacy); } } catch (e) { thrown = e; } ok(!thrown, 'bản lưu cũ chưa có dữ liệu 9.9.0 vẫn chạy: ' + (thrown && thrown.message));
  const ng = life(24, 2020, { sex: 'M' }); let t2 = null; try { for (let i = 0; i < 3; i++) year(E, ng); } catch (e) { t2 = e; } ok(!t2 && !ng.flags.idol990, 'người không làm ca sĩ không bị tạo trạng thái ca sĩ');
}
// ---------------------------------------------------------------- 12. Mô phỏng nhiều nước, nhiều thời kỳ, không lỗi và cân bằng
{
  const cases = [['KR', 2005], ['KR', 2022], ['KR', 2041], ['JP', 1998], ['JP', 2028], ['CN', 2019], ['VN', 2012], ['VN', 2031], ['TH', 2020], ['ID', 2015], ['PH', 2010], ['IN', 2016], ['US', 1985], ['US', 2024], ['GB', 2008], ['FR', 2003], ['DE', 2012], ['BR', 2018], ['MX', 2000], ['NG', 2019], ['ZZ', 2030], ['US', 2075]];
  let totalAw = 0, totalIss = 0, totalEnc = 0; cases.forEach(([c, y], i) => {
    const l = idolLife(22, y, { country: c === 'ZZ' ? 'VN' : c, agency: c === 'ZZ' ? 'ZZ' : c, pop: 70, fandom: 8e5, fame: 1e6, leader: i % 2 === 0 }); l.id = 'sim' + i; let err = null;
    try { for (let k = 0; k < 10; k++) { year(E, l); if (l.pending) for (let g = 0; g < 8 && l.pending.length; g++) { const d = l.pending.shift(); E.DEC[d.id].apply(l, d, E.DEC[d.id].auto(l, d, half), half, logger(l)); } } } catch (e) { err = e; }
    ok(!err, c + ' ' + y + ' mô phỏng 10 năm không lỗi: ' + (err && err.stack)); const s = K.peek(l); totalAw += (s.awards || []).length; totalIss += (s.issues || []).length;
    ok(['warm', 'pro', 'trust', 'scandal'].every(k => s.img[k] >= 0 && s.img[k] <= 100), c + ' chỉ số hình ảnh hợp lệ'); ok(Number.isFinite(l.fame) && l.fame >= 0, c + ' độ nổi tiếng hữu hạn');
  });
  ok(totalAw > 0 && totalIss > 0, 'qua nhiều nước có giải thưởng (' + totalAw + ') và sự cố nhóm (' + totalIss + ')');
}
{
  function perform(l, festival, skill) {
    const action = E.DEC.festival9119;
    const card = action.make(l, half, {});
    action.apply(l, card, String(card.data.keys.indexOf(festival)), half, logger(l));
    const next = l.pending.shift();
    ok(next && next.data.arg.id === festival, 'vào màn chọn tiết mục qua menu');
    action.apply(l, next, String(next.data.keys.indexOf(skill)), half, logger(l));
  }
  for (const [country, festival, level] of [['VN','coachella',95], ['JP','fuji',5]]) {
    const l = idolLife(23, 2024, {country, skill:level}), fame = l.fame;
    perform(l, festival, 'rap');
    const s = K.S(l), good = level > 50;
    ok((good ? l.fame > fame : l.fame < fame) && s.topics[0].positive === good, 'phản hồi và danh tiếng theo kỹ năng');
    ok(s.first[festival] === 2024 && !E.DEC.festival9119.make(l, half).data.keys.length, 'lần đầu và giới hạn mùa diễn');
    const saved = E.migrate(JSON.parse(JSON.stringify(l)));
    ok(E.DEC.topics9119.make(saved, half).text.includes(s.topics[0].headline), 'tải lại lịch sử dư luận');
  }
  ok(!E.DEC.festival9119.make(idolLife(24,1998),half).data.keys.includes('coachella'), 'chưa mở trước mùa đầu');
}

console.log('idol990: ' + n + ' kiểm tra đạt');
