/* Góp ý người chơi — kiểm thử tích hợp 5 kịch bản xuyên mốc A–E và các nguyên tắc chung
   (mã NPC ổn định, không nhầm người trùng tên, NPC đã mất không hoạt động, không đổi nơi ở con vô lý, không nhân đôi tiền / tài sản,
   tương thích bản lưu, dữ liệu có giới hạn, chế độ Tự động và tự chọn). */
'use strict';
const assert = require('assert');
const { gameContext } = require('./hardcore-isolation');
const { year } = require('./lib/quick');
const G = gameContext(), E = G.E, H = E.H, X = E.UPDATE110, C = E.ELITE148, D = E.SOCIAL149, M = E.MARITAL150, WL = E.WILL150, ES = E.ESTATE84;
let checks = 0;
const ok = (c, m) => { assert(c, m); checks++; };
const near = (a, b, m, tol) => ok(Math.abs(a - b) <= (tol == null ? Math.max(1e-6, Math.abs(b) * 1e-9) : tol), m + ': ' + a + ' vs ' + b);
const clone = o => JSON.parse(JSON.stringify(o));
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
function pick(l, id, key, r = () => 0, arg) { const d = E.DEC[id].make(l, r, arg), i = d.data.keys.indexOf(key); assert(i >= 0 && d.opts.some(o => o.k === String(i)), id + ': ' + key + ' (' + d.data.keys + ')'); d.manual = true; l.pending = [d]; E.DEC[id].apply(l, d, String(i), r, say(l)); l.pending = l.pending.filter(x => x !== d); return l.pending[0]; }
function base(o = {}) {
  const l = E.createLife({ mode: 'vn', seed: o.seed || 777, year: 1960 });
  Object.assign(l, { age: o.age || 55, edu: 5, indep: true, school: null, pending: [], job: null, jailUntil: null, abroad: null, ownHouse: true, houseVal: 2000, mortgage: 0, loans: [], props: [], ventures: [] });
  l.flags.military = 0; l.money = l.base * (o.wealth == null ? 3000 : o.wealth);
  l.partner = { name: 'Hà', sex: l.sex === 'M' ? 'F' : 'M', age: l.age - 2, status: 'married', since: 25, alive: true, close: 70, relation108: 'rel-ha' };
  l.kids = [{ name: 'Minh', sex: 'M', born: 25, alive: true, edu: 5, study: 80, close: 70, job: 'giao_vien', rank: 1, inc: 12, parentId: 'k-minh', coParent108: { id: 'rel-ha', name: 'Hà', sex: l.partner.sex } },
    { name: 'Lan', sex: 'F', born: 28, alive: true, edu: 5, study: 70, close: 65, parentId: 'k-lan', coParent108: { id: 'rel-ha', name: 'Hà', sex: l.partner.sex } }];
  return l;
}

// ---------- Kịch bản 1: doanh nghiệp gia đình ----------
{
  const l = base(), co = { name: 'Công ty Ánh Dương', value: 20000, share: 100, sector: 'tech', governance: 0, created: 30, roles: {} };
  E.BUSINESS123.companies(l).push(co);
  const minh = l.kids[0];
  pick(l, 'familyHead148', 'roles'); // mở menu doanh nghiệp sẵn có
  l.pending = [];
  pick(l, 'companyRole133', 'relative', () => 0, { i: 0, role: 'ceo' }); pick(l, 'companyFamily137', X.uid(l, minh), () => 0, { i: 0, role: 'ceo' });
  ok(/Tổng giám đốc/.test(E.kidTitle(minh)) && E.CHILD147.facts(l, minh).some(f => f[0] === 'Nơi làm việc' && f[1] === 'Công ty Ánh Dương'), 'KB1: bổ nhiệm con → hồ sơ gia đình cập nhật');
  const lan = C.relatives(l).find(x => x.name === 'Lan');
  for (let i = 0; i < 12 && !C.S(l).conflicts.some(c => !c.closed); i++) { l.age++; C.familyYear(l, () => 0.1, say(l)); }
  ok(C.S(l).conflicts.some(c => !c.closed && c.a === lan.id), 'KB1: con không có chức vụ phát sinh mâu thuẫn');
  pick(l, 'familyHead148_member', 'grant:allowance', () => 0.9, { id: lan.id });
  ok(C.benefits(l, lan.id).length === 1, 'KB1: cấp phụ cấp cho Lan');
  const key = 'company:' + X.uid(l, co); WL.W(l).manage[key] = 'k0';
  l.alive = false; l.death = { age: l.age, cause: 'tuổi già', year: l.birthYear + l.age };
  const o = E.childOpts(l, l.kids[1]), child = E.createLife(o);
  ok(child.flags.heirWill150 && child.flags.heirWill150.manage[0].manager === 'Minh', 'KB1: đời sau biết ai điều hành');
  const A = ES.allocate(l); ok(A.list.filter(p => p.items.some(x => x.t === 'company137')).length >= 2, 'KB1: cổ phần (sở hữu) chia cho nhiều người, tách khỏi quyền điều hành');
}

// ---------- Kịch bản 2: quan hệ thượng lưu xuyên sự kiện ----------
{
  const l = base({ seed: 778 });
  const res = C.party(l, () => 0.05, say(l), 'business', 'mid', 'hotel', 'network');
  ok(res && res.met.length, 'KB2: quen người mới ở tiệc');
  const p = res.met.find(x => x.kind === 'business' || x.kind === 'investor') || res.met[0]; p.kind = 'business'; p.trust = 70; p.honesty = 85;
  const id = p.uid110;
  const deal = C.propose(l, () => 0, say(l), p, 'project', C.amounts(l)[0]); ok(deal.ok, 'KB2: bàn thương vụ với chính người đó');
  C.people(l).forEach(q => { if (q !== p && q.kind === 'business') q.kind = 'pro'; });
  l.age++; { let n = 0; C.experience(l, () => [0.9, 0.1][Math.min(n++, 1)], say(l), 'golf'); }
  ok(C.find(l, id) === p && p.met.length >= 3, 'KB2: gặp lại cùng một người, lịch sử được ghi nhớ');
  p.trust = 90; D.befriend(l, () => 0.01, say(l), p); ok(p.friend149, 'KB2: trở thành bạn thân');
  p.kids149 = [{ name: 'Thu', sex: 'F', birth: l.birthYear + l.age - (l.age - 25) + 1, job: 'bác sĩ', alive: true, married: false }]; X.uid(l, p.kids149[0]);
  l.kids[0].born = 25; const cands = D.candidates(l, l.kids[0]); ok(cands.some(x => x.p === p), 'KB2: giới thiệu con với con của chính người bạn đó');
  const twin = C.meet(l, () => 0.3, { kind: 'business' }); twin.name = p.name;
  ok(C.label(l, twin) !== C.label(l, p) && C.find(l, id) === p, 'KB2: người trùng tên không bị nhầm');
  for (let i = 0; i < 6; i++) { l.age++; C.dealYear(l, () => 0.5, say(l)); }
  ok(deal.deal.stage === 'closed' && deal.deal.back <= deal.deal.amt * 2.5, 'KB2: thương vụ kết thúc, lợi nhuận có giới hạn');
  p.alive = false; ok(!E.DEC.social149.make(l, () => 0).data.keys.includes('p:' + id) && !D.candidates(l, l.kids[0]).some(x => x.p === p), 'KB2: người đã mất không còn hoạt động');
}

// ---------- Kịch bản 3: hôn nhân và tài sản ----------
{
  const l = E.createLife({ mode: 'vn', seed: 779, year: 1980 });
  Object.assign(l, { age: 30, edu: 5, indep: true, school: null, pending: [], job: null, ownHouse: false, houseVal: 0, mortgage: 0, loans: [], props: [], ventures: [], income: l.base });
  l.flags.military = 0; l.money = l.base * 40; l.kids = [];
  l.partner = { name: 'Mai', sex: l.sex === 'M' ? 'F' : 'M', age: 29, status: 'dating', since: 27, alive: true, affection108: 90, propPref149: 'simple', inc: l.base / 12 };
  pick(l, 'proposal149', 'buy:0'); const ring = C.mine(l).find(x => x.cat === 'ring');
  D.propose(l, () => 0.01, say(l), ring.uid110, 'home'); ok(D.engaged(l) && ring.owner === X.uid(l, l.partner), 'KB3: cầu hôn thành công, nhẫn thuộc về người được cầu hôn');
  let d = E.DEC.marry.make(l, () => 0.5); d.manual = true; l.pending = [d]; E.resolve(l, 'small');
  l.pending = [l.pending.find(x => x.id === 'contract108')]; E.resolve(l, 'default');
  ok(l.partner.status === 'married' && l.partner.marital150 && !D.engaged(l), 'KB3: cưới qua bước thỏa thuận, hết đính hôn');
  const pre = l.partner.marital150.pre; l.money += l.base * 50;
  const gift = D.give(l, () => 0.99, say(l), X.uid(l, l.partner), 'car', 0); ok(gift && gift.owner === X.uid(l, l.partner), 'KB3: tặng ô tô cho vợ/chồng');
  l.kids = [{ name: 'Bé', sex: 'F', born: 31, alive: true, coParent108: { id: l.partner.relation108, name: 'Mai', sex: 'F' } }]; l.age = 35;
  l.pending = []; E.finishYear(l); l.pending = []; l.age++;
  const nw = E.netWorth(l); const dv = E.DEC.divorce.make(l, () => 0.99); E.DEC.divorce.apply(l, dv, 'div', () => 0.99, say(l));
  const c = M.cases(l)[0];
  near(nw - E.netWorth(l), c.paid, 'KB3: ly hôn bảo toàn giá trị', 1e-6);
  ok(gift.owner !== 'me' && ring.owner !== 'me', 'KB3: nhẫn và quà đã tặng không bị chia lại');
  ok(E.netWorth(l) >= Math.min(pre, nw) - c.paid - 1e-6, 'KB3: tài sản riêng trước hôn nhân không bị chia');
  l.pending = []; E.finishYear(l); ok(E.divorceKids(l).length === 1 && E.divorceKids(l)[0].name === 'Bé', 'KB3: chỉ con của cuộc hôn nhân này được bàn quyền nuôi');
}

// ---------- Kịch bản 4 + 5: nhiều thế hệ, di chúc chi tiết ----------
{
  const l = base({ seed: 780, age: 72 }); l.money = 5000; l.houseVal = 3000;
  l.props = [{ k: 'apt', n: 'căn hộ cho thuê', v: 2000, basis: 1500, y: 0.05, since: 50, empty: 0 }];
  const vase = C.addItem(l, { cat: 'vase', name: 'Bình gốm thời Lê', buy: 800 });
  const given = C.addItem(l, { cat: 'gift:car', name: 'Ô tô đã tặng Lan', buy: 600, owner: X.uid(l, l.kids[1]) });
  WL.W(l).specific['item:' + vase.uid110] = 'k1';
  const prop = WL.assets(l).find(a => a.key.startsWith('prop:')); WL.W(l).specific[prop.key] = 'k0';
  WL.W(l).executor = { key: 'lawyer', name: 'Văn phòng luật độc lập', kind: 'lawyer' };
  l.alive = false; l.death = { age: 72, cause: 'tuổi già', year: l.birthYear + 72 };
  const A = ES.allocate(l), est = E.WILL70.estate(l), total = A.list.reduce((s, p) => s + p.items.reduce((t, x) => t + x.v, 0) + p.cash, 0);
  near(total, est.net, 'KB5: tổng phân chia đúng bằng di sản ròng', 1e-6);
  ok(!ES.items(l).some(x => x.n === 'Ô tô đã tặng Lan'), 'KB5: quà đã tặng không bị đem chia');
  ok(A.list.find(p => p.kid === 0).items.some(x => x.t === 'prop') && A.list.find(p => p.kid === 1).items.some(x => x.t === 'item148'), 'KB5: tài sản cụ thể về đúng người');
  const assigned = A.list.reduce((a, p) => a.concat(p.items), []); ok(new Set(assigned).size === assigned.length, 'KB5: không giao một tài sản hai lần');
  const o = E.childOpts(l, l.kids[1]), child = E.createLife(o); child.age = Math.max(18, o.parent.heir.at); child.indep = true;
  E.HOOKS.year.forEach(fn => { if (/heirOf/.test(String(fn))) fn(child, H.rf(child), say(child), child.age); });
  WL.heirYear(child, () => 0.5, say(child)); WL.heirYear(child, () => 0.5, say(child));
  ok(C.mine(child).filter(x => x.name === 'Bình gốm thời Lê').length === 1, 'KB4: đời con nhận bình gốm đúng một lần');
  ok(E.finale(l).some(s => s.h === 'Thi hành di chúc'), 'KB5: khúc cuối đời có phần thi hành di chúc');
}

// ---------- Nguyên tắc chung ----------
{
  // Mã NPC ổn định qua lưu / tải; nơi ở của con không đổi khi tải lại; dữ liệu có giới hạn
  const l = base({ seed: 781 });
  for (let i = 0; i < 120; i++) C.meet(l, () => (i % 7) / 7, {});
  l.kids[1].custody = 'ex'; l.kids[1].born = l.age - 10;
  const ids = C.people(l).map(p => p.uid110), back = E.migrate(clone(l));
  ok(JSON.stringify(back.flags.elite148.people.map(p => p.uid110)) === JSON.stringify(ids), 'mã NPC giữ nguyên sau khi tải lại');
  ok(back.kids[1].custody === 'ex', 'nơi ở của con không đổi khi tải lại');
  ok(C.people(l).length <= 60, 'mạng lưới NPC có giới hạn');
  for (let i = 0; i < 60; i++) E.CHILD147.remember(l, l.kids[0], 'k' + i); ok(l.kids[0].profile147.memories.length <= 20, 'kỷ niệm có giới hạn');
  for (let i = 0; i < 40; i++) C.conflict(l, C.relatives(l)[0], null, 'mâu thuẫn ' + i); ok(C.S(l).conflicts.length <= 20, 'mâu thuẫn có giới hạn');
}
{
  // Chế độ Tự động và bản lưu cũ: chơi nhiều đời với mọi hệ thống mới, không lỗi, tiền luôn hữu hạn
  let lives = 0, years = 0;
  for (let i = 0; i < 16; i++) {
    const l = E.createLife({ mode: i % 2 ? 'world' : 'vn', seed: 61000 + i });
    for (let y = 0; y < 80 && l.alive; y++) { year(E, l); years++; ok(Number.isFinite(l.money) && Number.isFinite(E.netWorth(l)), 'tiền và tài sản hữu hạn'); }
    const s = l.flags.elite148; if (s) ok(s.people.length <= 60 && s.items.length <= 80 && s.deals.length <= 30, 'dữ liệu mới có giới hạn');
    const back = E.migrate(clone(l)); ok(back && back.age === l.age, 'tải lại được sau khi chơi'); lives++;
  }
  ok(lives === 16 && years > 600, 'tự chơi ' + lives + ' đời, ' + years + ' năm');
  // Bản lưu cũ chưa có dữ liệu mới
  const old = base({ seed: 782 }); ['elite148', 'social149', 'marital150', 'will150'].forEach(k => delete old.flags[k]); old.kids.forEach(k => { delete k.profile147; delete k.role147; });
  const m = E.migrate(clone(old)); for (let y = 0; y < 3; y++) year(E, m); ok(m.alive !== undefined && Number.isFinite(m.money), 'bản lưu cũ chơi tiếp bình thường');
}
console.log('PASS integration-feedback: ' + checks + ' kiểm tra.');
