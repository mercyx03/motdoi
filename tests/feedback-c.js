/* Góp ý người chơi — Mốc C: tầng lớp, tiệc, thương vụ, NPC bền vững, người đứng đầu gia tộc, trải nghiệm thượng lưu, sưu tầm. */
'use strict';
const assert = require('assert');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, C = E.ELITE148;
let checks = 0;
const ok = (c, m) => { assert(c, m); checks++; };
const near = (a, b, m, tol) => ok(Math.abs(a - b) <= (tol == null ? Math.max(1e-6, Math.abs(b) * 1e-9) : tol), m + ': ' + a + ' vs ' + b);
const clone = o => JSON.parse(JSON.stringify(o));
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
const seq = (...v) => { let i = 0; return () => v[Math.min(i++, v.length - 1)]; };
function life(o = {}) {
  const l = E.createLife({ mode: o.mode || 'vn', seed: o.seed || 148, year: o.year || 1985 });
  Object.assign(l, { age: o.age || 45, edu: 5, indep: true, school: null, pending: [], job: null, jailUntil: null, abroad: null, ownHouse: true });
  l.flags.military = 0; l.money = l.base * (o.wealth == null ? 2000 : o.wealth);
  l.partner = { name: 'Hà', sex: 'F', age: l.age - 2, status: 'married', alive: true, close: 70 };
  l.kids = [{ name: 'Minh', sex: 'M', born: l.age - 22, alive: true, edu: 5, close: 70 }, { name: 'Lan', sex: 'F', born: l.age - 20, alive: true, edu: 5, close: 60 }];
  return l;
}
function rowsOf(l, id, arg) { const d = E.DEC[id].make(l, () => 0, arg); return d.data.keys.map((k, i) => ({ k, o: d.opts[i] && d.opts.find(o => o.k === String(i)) })); }
function enabled(l, id, arg) { const d = E.DEC[id].make(l, () => 0, arg); return d.opts.filter(o => o.k !== 'cancel').map(o => d.data.keys[+o.k]); }
function pick(l, id, key, r = () => 0, arg) { const d = E.DEC[id].make(l, r, arg), i = d.data.keys.indexOf(key); assert(i >= 0 && d.opts.some(o => o.k === String(i)), id + ': có lựa chọn ' + key + ' (' + enabled(l, id, arg) + ')'); d.manual = true; l.pending = [d]; E.DEC[id].apply(l, d, String(i), r, say(l)); l.pending = l.pending.filter(x => x !== d); return l.pending[0]; }
function year(l, r = () => 0.5) { l.age++; E.finishYear(l); l.pending = []; }

// ---------- C1. Tầng lớp ----------
{
  const tiers = [0, 25, 150, 1500, 15000].map(w => { const l = life({ wealth: w }); l.kids = []; l.partner = null; return C.tier(l); });
  ok(JSON.stringify(tiers) === '[0,1,2,3,4]', 'tầng theo tài sản ròng so với mức sống địa phương: ' + tiers);
  const vn = life({ wealth: 0 }), w = life({ mode: 'world', wealth: 0 });
  vn.money = 1e5; w.money = 1e5;
  ok(C.tier(vn) !== C.tier(w) || vn.base === w.base, 'cùng một con số tiền nhưng khác quốc gia thì khác tầng lớp');
  const old = life({ year: 1930, age: 45, wealth: 15000 });
  ok(rowsOf(old, 'elite148').some(x => x.k === 'jet') && !enabled(old, 'elite148').includes('jet') && enabled(old, 'elite148').includes('golf') === false, 'năm 1975 chưa có máy bay riêng, sân golf hạng sang: lựa chọn hiện nhưng bị khóa');
  const poor = life({ wealth: 5 });
  ok(E.DEC.elite148.valid(poor) !== true || !enabled(poor, 'elite148').length, 'người chưa đủ giàu không có trải nghiệm thượng lưu');
}

// ---------- C2. Tiệc: chọn loại → quy mô / địa điểm → khách; khách có thể từ chối ----------
{
  const l = life(), before = l.money;
  ok(enabled(l, 'party148').includes('birthday') && enabled(l, 'party148').includes('anniversary'), 'có tiệc sinh nhật, tiệc kỷ niệm khi đã cưới');
  { const single = life(); single.partner = null; ok(!enabled(single, 'party148').includes('anniversary'), 'chưa cưới thì không có tiệc kỷ niệm ngày cưới'); }
  let d = pick(l, 'party148', 'birthday');
  ok(d && d.id === 'party148_plan', 'bước 2: quy mô và địa điểm');
  const plan = enabled(l, 'party148_plan', { type: 'birthday' });
  ok(plan.includes('mid:hotel') && !plan.includes('grand:home'), 'tiệc lớn không tổ chức ở nhà: ' + plan.length);
  const cost = C.partyCost(l, 'birthday', 'mid', 'hotel');
  d = pick(l, 'party148_plan', 'mid:hotel', () => 0, { type: 'birthday' });
  ok(d && d.id === 'party148_guests', 'bước 3: khách mời');
  const n0 = C.people(l).length;
  pick(l, 'party148_guests', 'network', () => 0.01, { type: 'birthday', size: 'mid', venue: 'hotel' });
  near(before - l.money, cost, 'chi phí trừ đúng một lần', 1e-6);
  ok(C.people(l).length > n0, 'làm quen người mới tại tiệc');
  ok(C.people(l).every(p => p.uid110 && p.fictional), 'người mới có mã định danh cố định và là nhân vật hư cấu');
  ok(!enabled(l, 'party148').includes('birthday'), 'mỗi loại tiệc một lần mỗi năm');
  const m0 = l.money; ok(C.party(l, () => 0, () => { }, 'birthday', 'mid', 'hotel', 'family') === null && l.money === m0, 'tổ chức lại cùng loại trong năm bị chặn, không trừ tiền');
  // Mọi khách từ chối khi may rủi xấu → tiệc vắng, uy tín giảm
  const l2 = life(), rep0 = C.S(l2).rep, res = C.party(l2, () => 0.995, () => { }, 'birthday', 'small', 'restaurant', 'friends');
  ok(res.came.length === 0 && res.declined.length > 0, 'khách có quyền từ chối');
  ok(C.S(l2).rep <= rep0, 'tiệc vắng không tăng uy tín');
  // Phô trương: tiệc quá đắt so với tài sản
  const l3 = life({ wealth: 120 });
  const r3 = C.party(l3, () => 0.3, say(l3), 'birthday', 'big', 'hotel', 'friends');
  ok(r3 && C.S(l3).rep < 50 && /phô trương/.test(l3.log[l3.log.length - 1].t), 'tiệc vượt khả năng bị bàn tán là phô trương');
  const l3b = life({ wealth: 5000 }), r3b = C.party(l3b, () => 0.3, say(l3b), 'birthday', 'big', 'hotel', 'friends');
  ok(r3b && !/phô trương/.test(l3b.log[l3b.log.length - 1].t), 'cùng bữa tiệc với người giàu hơn thì không bị coi là phô trương');
  ok(C.party(life({ wealth: 25 }), () => 0.3, () => { }, 'birthday', 'big', 'restaurant', 'friends') === null, 'quy mô lớn cần đúng tầng lớp kể cả khi gọi trực tiếp');
  // Tối đa 2 bữa tiệc / năm
  const l4 = life(); C.party(l4, () => 0.3, () => { }, 'birthday', 'small', 'home', 'family'); C.party(l4, () => 0.3, () => { }, 'business', 'mid', 'restaurant', 'network');
  ok(E.DEC.party148.valid(l4) !== true, 'tối đa 2 bữa tiệc mỗi năm');
  year(l4); ok(E.DEC.party148.valid(l4) === true, 'năm sau tổ chức tiếp được');
  // Thiếu tiền: hiện lý do
  const l5 = life({ wealth: 1 }); l5.money = l5.base * 0.4;
  ok(!enabled(l5, 'party148_plan', { type: 'birthday' }).length, 'không đủ tiền mặt: không chọn được địa điểm');
}

// ---------- C3 + C4. Thương vụ với cùng một NPC qua nhiều sự kiện ----------
{
  const l = life(), r = () => 0.2;
  const minh = C.meet(l, r, { kind: 'business', where: 'tiệc gặp gỡ đối tác', tier: 3 });
  const id = minh.uid110; minh.trust = 20; minh.honesty = 80;
  ok(!enabled(l, 'deal148').includes('p:' + id), 'chưa đủ tin cậy thì chưa bàn hợp tác');
  minh.trust = 70;
  ok(enabled(l, 'deal148').includes('p:' + id), 'đủ tin cậy: có thể bàn hợp tác');
  const amts = C.amounts(l); ok(amts.length && amts.every(a => a <= l.money), 'mức vốn đề xuất nằm trong khả năng');
  const cash = l.money;
  pick(l, 'deal148', 'p:' + id);
  pick(l, 'deal148_terms', 'project:0', () => 0, { pid: id });
  const deal = C.S(l).deals[0];
  ok(deal && deal.pid === id && deal.stage === 'active', 'thương vụ ghi đúng đối tác theo mã định danh');
  near(cash - l.money, deal.amt, 'vốn góp bị trừ một lần', 1e-6);
  ok(!enabled(l, 'deal148').includes('p:' + id), 'mỗi đối tác bàn một lần mỗi năm');
  ok(minh.met.some(m => /ký thỏa thuận/.test(m.where)) && minh.met[0].where === 'tiệc gặp gỡ đối tác', 'lịch sử gặp gỡ được ghi nhớ');
  // Gặp lại ở sự kiện khác: cùng người, không tạo bản sao
  const n = C.people(l).length; C.seen(l, minh, 'sân golf', 2);
  ok(C.people(l).length === n && C.find(l, id) === minh, 'gặp lại cùng một NPC');
  // Không trả tiền trước hạn, đáo hạn trả có giới hạn
  year(l); ok(deal.stage === 'active' && !deal.back, 'chưa đến hạn thì chưa trả tiền');
  for (let i = 0; i < 4; i++) year(l);
  ok(deal.stage === 'closed' && deal.back >= 0 && deal.back <= deal.amt * 2.5, 'đáo hạn: thu về có giới hạn ' + deal.back + '/' + deal.amt);
  // Tải lại: NPC giữ nguyên mã
  const back = E.migrate(clone(l));
  ok(back.flags.elite148.people.some(p => p.uid110 === id && p.name === minh.name), 'tải lại bản lưu giữ đúng NPC');
}
{
  // Đối tác thiếu trung thực: tranh chấp nhiều giai đoạn, không tự giải quyết
  const l = life(), p = C.meet(l, () => 0.3, { kind: 'investor', tier: 3 }); p.trust = 80; p.honesty = 10;
  const res = C.propose(l, () => 0, () => { }, p, 'startup', C.amounts(l)[0]);
  ok(res.ok, 'đối tác nhận lời');
  const d = res.deal;
  for (let i = 0; i < 4; i++) { l.age++; C.dealYear(l, () => 0.1, say(l)); }
  ok(d.stage === 'dispute' && p.trust <= 10, 'không hoàn vốn: chuyển sang tranh chấp');
  ok(enabled(l, 'deal148_track', { id: d.uid110 }).includes('sue'), 'có thể khởi kiện');
  pick(l, 'deal148_track', 'sue', () => 0.5, { id: d.uid110 });
  ok(d.stage === 'dispute' && d.suit, 'vụ kiện kéo dài, chưa xong ngay');
  ok(!enabled(l, 'deal148_track', { id: d.uid110 }).length, 'đang chờ tòa thì không làm lại');
  for (let i = 0; i < 3 && d.stage !== 'closed'; i++) { l.age++; C.dealYear(l, () => 0.1, say(l)); }
  ok(d.stage === 'closed' && (d.back || 0) <= d.amt, 'tòa xử xong; thu hồi không vượt vốn');
  // Tối đa 3 thương vụ đang mở
  const l2 = life();
  for (let i = 0; i < 4; i++) { const q = C.meet(l2, () => 0.4, { kind: 'business', tier: 3 }); q.trust = 90; C.propose(l2, () => 0, () => { }, q, 'project', C.amounts(l2)[0]); }
  ok(C.S(l2).deals.filter(x => x.stage === 'active').length === 3, 'tối đa 3 thương vụ đang chạy');
  // Rút vốn sớm
  const x = C.S(l2).deals[0], m = l2.money; pick(l2, 'deal148_track', 'exit', () => 0.5, { id: x.uid110 });
  ok(x.stage === 'closed' && l2.money - m < x.amt && l2.money > m, 'rút sớm mất một phần vốn');
  // Đối tác từ chối khi quy mô quá lớn so với họ
  const small = C.meet(l2, () => 0.4, { kind: 'business', tier: 0 }); small.trust = 60;
  ok(C.dealChance(l2, small, 'project', l2.base * 500) < C.dealChance(l2, small, 'project', l2.base * 0.5), 'quy mô vượt khả năng đối tác thì khó được nhận lời');
  // NPC qua đời: không còn trong danh sách bàn hợp tác
  small.alive = false; ok(!rowsOf(l2, 'deal148').some(z => z.k === 'p:' + small.uid110), 'NPC đã mất không còn hoạt động');
  // Trùng tên: nhãn phân biệt
  const a = C.meet(l2, () => 0.4, { kind: 'business' }), b = C.meet(l2, () => 0.4, { kind: 'business' }); b.name = a.name; b.birth = a.birth + 3;
  ok(C.label(l2, a) !== C.label(l2, b), 'hai NPC trùng tên có nhãn khác nhau');
  // Dữ liệu có giới hạn
  for (let i = 0; i < 90; i++) C.meet(l2, () => (i % 10) / 10, {});
  ok(C.people(l2).length <= 60 && C.S(l2).deals.every(dd => dd.stage === 'closed' || C.find(l2, dd.pid)), 'mạng lưới tối đa 60 người, không xóa đối tác đang làm ăn');
}

// ---------- C5. Người đứng đầu gia tộc ----------
{
  const l = life(); E.BUSINESS123.companies(l).push({ name: 'Công ty Ánh Dương', value: 10000, share: 80, sector: 'tech', governance: 0, created: 30, roles: {} });
  ok(E.DEC.familyHead148.valid(l) === true, 'có quyền đứng đầu gia tộc');
  ok(enabled(l, 'familyHead148').includes('roles'), 'bổ nhiệm người thân khi nắm quyền chi phối công ty');
  const young = life({ age: 30 }); ok(E.DEC.familyHead148.valid(young) !== true, 'chưa đủ tuổi');
  const minority = life(); E.BUSINESS123.companies(minority).push({ name: 'B', value: 100, share: 30, sector: 'tech', governance: 0, created: 30, roles: {} });
  ok(!enabled(minority, 'familyHead148').includes('roles'), 'không nắm trên 50% cổ phần thì không bổ nhiệm');
  // Họp gia đình
  const res = C.meeting(l, () => 0.1, say(l));
  ok(res.came.length >= 2, 'họp gia đình có người đến');
  ok(!enabled(l, 'familyHead148').includes('meeting'), 'họp một lần mỗi năm');
  // Cấp quyền lợi: trừ tiền mỗi năm từ tiền của bạn
  const minh = C.relatives(l).find(x => x.name === 'Minh');
  pick(l, 'familyHead148_member', 'grant:home', () => 0.9, { id: minh.id });
  ok(C.benefits(l, minh.id).length === 1, 'cấp hỗ trợ nhà ở');
  const m0 = l.money; C.familyYear(l, () => 0.9, say(l));
  near(m0 - l.money, l.base * 0.3, 'quyền lợi chi từ tiền của bạn mỗi năm', 1e-6);
  // Người thân giàu có thể từ chối
  const lan = C.relatives(l).find(x => x.name === 'Lan'); lan.p.inc = l.base; C.grant(l, () => 0.1, say(l), lan, 'allowance');
  ok(!C.benefits(l, lan.id).length, 'người thân tự chủ tài chính có thể từ chối');
  // Thu hồi: giảm thân thiết, có thể sinh mâu thuẫn
  const close0 = minh.p.close; pick(l, 'familyHead148_member', 'revoke:home', () => 0.1, { id: minh.id });
  ok(minh.p.close < close0 && C.S(l).conflicts.some(c => !c.closed && c.a === minh.id), 'thu hồi quyền lợi gây mâu thuẫn');
  // Mâu thuẫn không tự biến mất, leo thang theo năm
  const c = C.S(l).conflicts.find(x => !x.closed); c.at = l.age - 1; const sev = c.sev;
  l.age++; C.familyYear(l, () => 0.9, say(l));
  ok(!c.closed && c.sev === sev + 1, 'mâu thuẫn để lâu thì tăng dần');
  ok(enabled(l, 'familyHead148').includes('c:' + c.uid110), 'mâu thuẫn hiện trong menu để giải quyết');
  pick(l, 'familyHead148_conflict', 'talk', () => 0.01, { id: c.uid110 });
  ok(c.closed, 'hòa giải thành công');
  // Chức vụ chênh lệch giữa các con tạo mâu thuẫn thực tế
  minh.p.role147 = { rid: 'ceo', title: 'CEO', place: 'Ánh Dương' };
  for (let i = 0; i < 10 && !C.S(l).conflicts.some(x => !x.closed && /giữ chức/.test(x.text)); i++) { l.age++; C.familyYear(l, () => 0.1, say(l)); }
  ok(C.S(l).conflicts.some(x => !x.closed && /giữ chức/.test(x.text)), 'con không có chức vụ không phục');
  // Không động đến tài sản riêng của người thân
  lan.p.savings = 123; const before = JSON.stringify(lan.p.savings); C.familyYear(l, () => 0.5, say(l));
  ok(JSON.stringify(lan.p.savings) === before, 'tài sản riêng người thân giữ nguyên');
}

// ---------- C6. Trải nghiệm và sưu tầm ----------
{
  const l = life({ year: 1975, age: 45 });
  ok(enabled(l, 'elite148').includes('golf') && enabled(l, 'elite148').includes('horse'), 'trải nghiệm theo tầng lớp');
  const m0 = l.money, p = C.experience(l, () => 0.1, say(l), 'golf');
  near(m0 - l.money, l.base * 0.3, 'chi phí trải nghiệm', 1e-6);
  ok(p && p.kind === 'business', 'quen người mới trên sân golf');
  ok(!enabled(l, 'elite148').includes('golf'), 'mỗi trải nghiệm một lần mỗi năm');
  // Mua — giá trị thay đổi — bán
  const nw0 = E.netWorth(l);
  pick(l, 'collect148', 'buy:watch'); pick(l, 'collect148_buy', '1', () => 0.5, { cat: 'watch' });
  const w = C.mine(l)[0];
  ok(w && w.owner === 'me' && w.cat === 'watch', 'đồng hồ thuộc sở hữu của bạn');
  near(E.netWorth(l), nw0, 'mua bằng tiền mặt: tài sản ròng không đổi (tiền → đồ vật)', 1e-6);
  const v0 = w.value; for (let i = 0; i < 5; i++) C.itemsYear(l, () => 0.9, () => { });
  ok(w.value > v0, 'giá trị có thể tăng');
  for (let i = 0; i < 60; i++) C.itemsYear(l, () => 0, () => { });
  ok(w.value >= w.buy * 0.1 - 1e-9, 'giá trị có thể giảm nhưng không âm');
  // Tặng: đổi chủ, rời tài sản của bạn, không nhân đôi
  const nw1 = E.netWorth(l), minh = C.relatives(l).find(x => x.name === 'Minh');
  pick(l, 'collect148_item', 'give:' + minh.id, () => 0.5, { id: w.uid110 });
  ok(w.owner === minh.id && !C.mine(l).includes(w), 'món quà thuộc về người nhận');
  near(nw1 - E.netWorth(l), w.value, 'tài sản ròng giảm đúng giá trị món quà', 1e-6);
  ok(!enabled(l, 'collect148_item', { id: w.uid110 }).length, 'không thể bán món đã tặng');
  ok(C.sell(l, () => 0.5, () => { }, w) === 0, 'bán món của người khác bị chặn');
  // Bán
  const x = C.buy(l, () => 0.5, () => { }, 'painting', 0), c0 = l.money; pick(l, 'collect148_item', 'sell', () => 0.5, { id: x.uid110 });
  ok(!C.items(l).includes(x) && l.money > c0 && l.money - c0 <= x.value * 0.95 + 1e-9, 'bán đấu giá mất phí, món rời bộ sưu tập');
  // Du thuyền: chi phí duy trì; không đủ tiền thì bán gấp
  const rich = life({ wealth: 15000, year: 1980 }); const y = C.buy(rich, () => 0.5, () => { }, 'yacht', 0);
  ok(y && C.mine(rich).includes(y), 'mua du thuyền');
  near(C.partyCost(rich, 'birthday', 'small', 'yacht'), 15 * 0.03 * rich.base * 0.4, 'có du thuyền riêng thì tiệc trên du thuyền rẻ hơn');
  rich.money = 0; C.itemsYear(rich, () => 0.5, say(rich));
  ok(!C.mine(rich).includes(y) && rich.money > 0, 'không đủ phí duy trì thì phải bán');
  // Quy đổi tiền khi chuyển nước
  const l2 = life(); const z = C.buy(l2, () => 0.5, () => { }, 'vase', 0), v = z.value; E.abroadConvert(l2, 0.01);
  near(z.value, v * 0.01, 'giá trị đồ sưu tầm được quy đổi tiền tệ');
}

// ---------- Bản lưu cũ và vòng năm ----------
{
  const l = life(); delete l.flags.elite148; const nw = E.netWorth(l);
  year(l); ok(!l.flags.elite148, 'bản lưu cũ không bị thêm dữ liệu khi chưa dùng tính năng');
  ok(Number.isFinite(nw), 'tài sản ròng vẫn tính được');
  const m = E.migrate(clone(life())); ok(m && m.alive, 'tải bản lưu bình thường');
  // NPC già đi và có thể qua đời
  const l2 = life(); const old = C.meet(l2, () => 0.5, { age: 79 }); old.trust = 70;
  for (let i = 0; i < 25 && old.alive; i++) year(l2);
  ok(old.alive === false && old.died, 'NPC lớn tuổi có thể qua đời');
  ok(!C.contacts(l2).includes(old), 'NPC đã mất không còn trong danh sách liên lạc');
}
console.log('PASS feedback-c: ' + checks + ' kiểm tra.');
