/* GĐ2 — danh tính, tính cách và quan hệ NPC thống nhất (public/js/life142.js + các module đã nối vào).
   Mỗi ca so với trạng thái trước thao tác; không bài nào sửa dữ liệu game để đạt.
   Chạy: node tests/npc-identity.js [tên ca …]   (ca 15 — regression liên quan — chạy riêng, xem báo cáo GĐ2) */
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const { run, year, settle, clone, ROOT } = require('./lib/quick');
const FIX = path.join(ROOT, 'tests', 'fixtures', 'saves');
const packs = () => fs.readdirSync(FIX).filter(f => f.endsWith('.json.gz')).map(f => JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(FIX, f)))));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const noop = () => {};
// đời đầu tiên (theo seed tăng dần) thỏa điều kiện — đồng hồ kiểm thử được đặt lại nên luôn ra cùng một đời
function findLife(G, pred, base, maxAge) {
  const E = G.E;
  for (let s = base; s < base + 400; s++) {
    G.testClock.reset();
    const l = E.createLife({ mode: s % 3 ? 'vn' : 'world', seed: s });
    for (let g = 0; g < (maxAge || 80) && l.alive; g++) { year(E, l); if (pred(l)) return l; }
  }
  return null;
}
const hasKid = (min) => l => (l.kids || []).some(k => k.alive !== false && l.age - k.born >= (min || 6));
const kidOf = (l, min) => l.kids.find(k => k.alive !== false && l.age - k.born >= (min || 6));
const married = l => l.partner && l.partner.alive !== false && l.partner.status !== 'dating';
function hook(G, needle) { return G.E.HOOKS.year.find(fn => String(fn).indexOf(needle) >= 0); }
function people(l) { return (l.flags.life138 || {}).people || {}; }
function friend(name, since, sex) { return { name, sex: sex || 'M', d: 0, since, close: 60, alive: true, from: 'chỗ làm', loc: 'HOME' }; }

const cases = [
  { name: '1-same-name-distinct-ids', run(t, G) {
    const E = G.E, l = findLife(G, l => l.age >= 30, 61000);
    const f1 = friend('Nguyễn Văn An', l.age - 10), f2 = friend('Nguyễn Văn An', l.age - 2);
    l.friends = (l.friends || []).concat([f1, f2]); E.NPC.ensureIds(l);
    t.ok(f1.uid110 && f2.uid110 && f1.uid110 !== f2.uid110, 'hai người bạn trùng họ tên có hai định danh khác nhau');
    t.ok(E.NPC.find(l, f1.uid110).obj === f1 && E.NPC.find(l, f2.uid110).obj === f2, 'tra đúng từng người theo định danh');
    E.personDied(l, f1, l.age);
    t.ok(f1.alive === false && f2.alive !== false, 'một người qua đời không kéo theo người trùng tên');
    // bạn đời qua đời; sau đó gặp người mới trùng tên
    l.partner = { name: 'Trần Thị Bình', sex: 'F', age: l.age, status: 'married', since: l.age - 5, alive: true }; E.NPC.ensureIds(l);
    const oldUid = l.partner.uid110; E.partnerGone(l, l.age);
    t.ok(!l.partner && (l.flags.deadPartners || []).some(d => d.uid === oldUid), 'bạn đời mất được ghi theo định danh');
    const f3 = friend('Trần Thị Bình', l.age + 1, 'F'); l.friends.push(f3); E.NPC.ensureIds(l);
    E.syncKnownDeaths(l, l.age + 1);
    t.ok(f3.alive !== false, 'người bạn mới trùng tên với bạn đời đã mất không bị đánh dấu đã mất');
    const np = { name: 'Trần Thị Bình', sex: 'F', age: l.age, status: 'dating', since: l.age + 2, alive: true }; l.partner = np; E.NPC.ensureIds(l);
    E.syncKnownDeaths(l, l.age + 2);
    t.ok(l.partner === np && np.alive !== false && !E.isDeadPartner(l, np), 'người yêu mới trùng tên không bị coi là người đã mất');
    // hai người cũ trùng tên không bị gộp
    const h80 = hook(G, 'flags.lastP'), h142 = hook(G, 'adoptIdent(l)'), r = () => 0.5;
    l.partner = null; l.flags.lastP = null; l.flags.exList = [];
    const x1 = { name: 'Lê Văn Cường', sex: 'M', age: l.age, status: 'dating', since: l.age, alive: true }; l.partner = x1; E.NPC.ensureIds(l);
    h80(l, r, noop, l.age); h142(l, r, noop, l.age); l.partner = null; l.age++; h80(l, r, noop, l.age); h142(l, r, noop, l.age);
    const x2 = { name: 'Lê Văn Cường', sex: 'M', age: l.age, status: 'dating', since: l.age, alive: true }; l.partner = x2; E.NPC.ensureIds(l);
    h80(l, r, noop, l.age); h142(l, r, noop, l.age); l.partner = null; l.age++; h80(l, r, noop, l.age); h142(l, r, noop, l.age);
    const ex = l.flags.exList.filter(x => x.name === 'Lê Văn Cường');
    t.ok(ex.length === 2 && ex[0].uid === x1.uid110 && ex[1].uid === x2.uid110, 'hai người cũ trùng tên là hai hồ sơ riêng (' + ex.length + ')');
  } },
  { name: '2-job-change-keeps-id', run(t, G) {
    const E = G.E, l = findLife(G, l => married(l) && hasKid(6)(l) && (l.friends || []).length > 0, 62000);
    if (!t.ok(!!l, 'có đời mẫu')) return;
    E.LIFE138.sync(l);
    const who = [l.partner, kidOf(l), l.friends[0]], ids = who.map(o => o.uid110), keys = Object.keys(people(l)).length;
    who.forEach((o, i) => { o.job = ['bác sĩ', 'kỹ sư', 'đầu bếp'][i]; });
    for (let y = 0; y < 3 && l.alive; y++) year(E, l);
    E.LIFE138.sync(l);
    who.forEach((o, i) => { t.ok(o.uid110 === ids[i], 'đổi nghề không đổi định danh (' + (o.name || o.n) + ')'); const f = E.NPC.find(l, ids[i]); t.ok(!f || f.obj === o || !f.obj, 'tra định danh vẫn ra đúng người'); });
    t.ok(people(l)[ids[0]] && people(l)[ids[1]], 'hồ sơ người quen giữ nguyên khóa');
    t.ok(Object.keys(people(l)).length >= keys, 'không mất hồ sơ người quen');
  } },
  { name: '3-move-keeps-identity', run(t, G) {
    const E = G.E, l = findLife(G, l => married(l) && (l.friends || []).length > 0 && E.isVN(l) && !l.abroad, 63000);
    if (!t.ok(!!l, 'có đời mẫu')) return;
    const who = [l.partner, l.friends[0]].concat(l.kids || [], l.sibList || []), ids = who.map(o => o.uid110), serial = (l.flags.expansion110 || {}).serial;
    const dest = l.prov && l.prov.old === 'Đà Nẵng' ? 'Hà Nội' : 'Đà Nẵng';
    E.WORLD120.move(l, dest, noop, 'Chuyển nơi ở'); l.friends[0].loc = 'xa';
    E.NPC.ensureIds(l);
    t.ok(l.prov.old === dest, 'người chơi đã chuyển tới ' + dest);
    t.ok(who.every((o, i) => o.uid110 === ids[i]), 'chuyển nơi sống không đổi định danh ai');
    t.ok((l.flags.expansion110 || {}).serial === serial, 'không cấp thêm định danh mới');
    t.ok(E.NPC.find(l, ids[0]).obj === l.partner && E.NPC.find(l, ids[0]).kind === 'partner', 'bạn đời vẫn tra đúng');
  } },
  { name: '4-parent-trait-consistent', run(t, G) {
    const E = G.E, l = findLife(G, l => l.age >= 8 && l.fam.mAlive && l.fam.fAlive && !l.fam.noDad, 64000, 12);
    if (!t.ok(!!l, 'có đời mẫu')) return;
    const s = E.LIFE138.sync(l);
    ['m', 'f'].forEach(side => {
      const key = l.fam[side + 'Trait'], label = E.PARENT_TRAITS[key].n, who = side === 'm' ? 'mẹ' : 'bố';
      ['parent:' + side, side === 'm' ? 'mother' : 'father', 'parent:' + side + ':' + l.fam[side + 'Name']].forEach(ref => t.ok(E.NPC.trait(l, ref).label === label, who + ': mọi dạng tham chiếu (' + ref + ') đọc cùng một tính cách "' + label + '"'));
      t.ok(E.parentTraitText(l, side).indexOf(label) === 0, who + ': bảng gia đình hiển thị "' + label + '"');
      t.ok(E.LIFE138.describe(l, s.people[side === 'm' ? 'mother' : 'father']).indexOf(label) >= 0, who + ': hồ sơ người quen hiển thị cùng tính cách');
      t.ok(E.FAMILY100.style(l, 'parent', side) === key, who + ': phản ứng trong family100 theo cùng tính cách');
    });
    // chi tiêu cho con do người chăm sóc quyết theo tính cách thật, không theo nhãn life138 cũ
    const kid = clone(l); kid.indep = false; kid.age = Math.min(kid.age, 12); const ks = E.LIFE138.sync(kid); ks.care = 'mẹ'; kid.money = kid.base * 50;
    ks.people.mother.trait = 'cởi mở'; // nhãn cũ trái với tính cách thật
    kid.fam.mTrait = 'nghiem'; t.ok(E.LIFE138.fund(kid, 0.01, 'lớp học', () => 0.8, noop) === false, 'mẹ nghiêm khắc (chance .55) từ chối ở r=0.8 dù nhãn life138 cũ ghi "cởi mở"');
    kid.fam.mTrait = 'coi_mo'; t.ok(E.LIFE138.fund(kid, 0.01, 'lớp học', () => 0.8, noop) === true, 'mẹ cởi mở (chance .9) đồng ý ở r=0.8');
  } },
  { name: '5-partner-trait-consistent', timeoutMs: 120000, run(t, G) {
    const E = G.E, l = findLife(G, married, 65000);
    if (!t.ok(!!l, 'có đời mẫu')) return;
    const p = l.partner, tr = E.FAMILY130.personality(l, p).slice(), s = E.LIFE138.sync(l);
    t.ok(same(E.NPC.trait(l, p.uid110).keys, tr), 'nguồn chuẩn là traits130: ' + tr.join(', '));
    t.ok(E.LIFE138.describe(l, s.people[p.uid110]).indexOf(tr.join(', ')) >= 0, 'hồ sơ người quen hiển thị cùng tính cách');
    const map = { 'nhạy cảm': 'anxious', 'ghen tuông': 'anxious', 'gia trưởng': 'independent', 'nóng tính': 'direct', 'hướng nội': 'private', 'hoạt bát': 'direct', 'tiết kiệm': 'independent', 'hài hước': 'direct' };
    t.ok(E.FAMILY100.style(l, 'partner', 0) === map[tr[0]], 'phản ứng family100 suy từ cùng tính cách (' + E.FAMILY100.style(l, 'partner', 0) + ')');
    // đổi tên sau cưới không đổi tính cách
    const c = clone(l), cp = c.partner; cp.nameBeforeCustomization = cp.name; cp.name = 'Tên Mới Đặt'; delete cp.traits130;
    t.ok(same(E.FAMILY130.personality(c, cp), tr), 'đổi tên không đổi tính cách');
    // chia tay rồi quay lại: cùng danh tính, cùng tính cách, giữ lịch sử quan hệ
    const h80 = hook(G, 'flags.lastP'), h142 = hook(G, 'adoptIdent(l)'), r = () => 0.5;
    const f = E.FAMILY100.info(l, 'partner', 0); f.trust = 30; f.tension = 70;
    const uid = p.uid110; h80(l, r, noop, l.age); h142(l, r, noop, l.age);
    l.partner = null; l.age++; h80(l, r, noop, l.age); h142(l, r, noop, l.age);
    const ex = (l.flags.exList || []).find(x => x.uid === uid);
    t.ok(!!ex && ex.ident && same(ex.ident.traits130, tr) && ex.ident.family100.trust === 30, 'hồ sơ người cũ giữ danh tính, tính cách và quan hệ');
    l.flags.exList = [ex]; // "Gặp lại người cũ" chọn ngẫu nhiên trong các người cũ: chỉ để lại người cần kiểm tra
    l.age += 2; let back = null;
    for (let i = 0; i < 40 && !back; i++) { const c2 = clone(l); c2.rs = (c2.rs + i * 7919) | 0; const d = E.DEC.quay_lai_cu.make(c2, () => 0.01); if (!d.opts.some(o => o.k === 'quay_lai')) continue; c2.pending.unshift(d); E.resolve(c2, 'quay_lai'); if (c2.partner && c2.partner.reunited) back = c2; }
    if (!t.ok(!!back, 'mô phỏng được một lần quay lại')) return;
    const np = back.partner, rv = E.NPC.relation(back, np);
    t.ok(np.uid110 === uid, 'quay lại vẫn là cùng một người (định danh ' + np.uid110 + ')');
    t.ok(same(np.traits130, tr), 'tính cách không bị tạo lại');
    t.ok(rv.trust === 30 && rv.tension === 70, 'không tự thân thiết trở lại: tin cậy ' + rv.trust + ', căng thẳng ' + rv.tension);
  } },
  { name: '6-child-traits-preserved', timeoutMs: 120000, run(t, G) {
    const E = G.E;
    let n = 0;
    packs().forEach(p => p.saves.forEach(it => { const kids = (it.save.life.kids || []).filter(k => k.persona141); if (!kids.length) return; const m = E.migrate(clone(it.save.life)); kids.forEach(k => { n++; const k2 = m.kids.find(x => x.name === k.name && x.born === k.born); t.ok(same(k2.persona141.traits, k.persona141.traits) && same(k2.persona141.memories, k.persona141.memories), 'v' + p.version + ': giữ nguyên tính cách & ký ức của ' + k.name); }); }));
    const l = findLife(G, hasKid(10), 66000);
    if (!t.ok(!!l, 'có đời mẫu')) return;
    for (let y = 0; y < 12 && l.alive; y++) {
      year(E, l);
      (l.kids || []).filter(k => k.alive !== false && k.persona141).forEach(k => {
        n++;
        const c = E.NPC.childTrait(l, k), tr = k.persona141.traits, lb = c.label || '';
        const clash = /hướng ngoại/.test(lb) && tr.extro < 40 || /nhút nhát|hướng nội/.test(lb) && tr.extro > 60 || /mạnh mẽ/.test(lb) && tr.sensitive > 60 || /bốc đồng/.test(lb) && tr.impulse < 40;
        t.ok(c.source === 'persona141' && !clash, k.name + ' tuổi ' + (l.age - k.born) + ': nhãn "' + lb + '" khớp persona141');
        const s = E.LIFE138.sync(l); t.ok(E.LIFE138.describe(l, s.people[k.uid110]).indexOf(lb) >= 0, k.name + ': hồ sơ người quen hiển thị cùng nhãn');
      });
    }
    t.info(n + ' lượt kiểm tra tính cách con');
  } },
  { name: '7-trust-cross-module', run(t, G) {
    const E = G.E, l = findLife(G, l => married(l) && hasKid(8)(l), 67000);
    if (!t.ok(!!l, 'có đời mẫu')) return;
    const k = kidOf(l, 8), p = k.persona141 || E.CHILD141.init(l, k);
    // family100 → persona141, đọc lại ở family100, life138, cầu nối
    const before = p.trust, d = E.DEC.family100_child_time.make(l, () => 0.5); d.manual = true; l.pending.unshift(d); E.resolve(l, 'listen');
    t.ok(p.trust > before, 'lắng nghe con (family100) làm tăng tin cậy chuẩn: ' + before + ' → ' + p.trust);
    t.ok(E.FAMILY100.summary(l, 'child', l.kids.indexOf(k)).indexOf('Tin cậy ' + Math.round(p.trust) + '/100') === 0, 'family100 hiển thị đúng giá trị đó');
    t.ok(E.NPC.relation(l, k.uid110).trust === p.trust && E.NPC.relation(l, k.parentId).trust === p.trust, 'tra theo uid hay parentId đều ra cùng giá trị');
    // life138 làm hòa: chỉ hiện khi tin cậy chuẩn < 50, cộng vào nguồn chuẩn
    p.trust = 40; E.LIFE138.sync(l);
    let pm = E.DEC.personProfile138.make(l, () => 0.5, { id: k.uid110 }), rec = pm.opts.find(o => /làm hòa/.test(o.l));
    t.ok(!!rec, 'hồ sơ người quen thấy con đang giận (đọc tin cậy chuẩn = 40)');
    if (rec) { pm.manual = true; l.pending.unshift(pm); E.resolve(l, rec.k); t.ok(p.trust === 55, 'làm hòa trong hồ sơ cộng vào tin cậy chuẩn: ' + p.trust); }
    // bạn đời: trò chuyện trong hồ sơ → family100
    E.LIFE138.sync(l); const pt = l.partner, f0 = E.NPC.relation(l, pt).trust;
    pm = E.DEC.personProfile138.make(l, () => 0.5, { id: pt.uid110 }); const talk = pm.opts.find(o => /Trò chuyện/.test(o.l));
    if (t.ok(!!talk, 'có thể trò chuyện với bạn đời')) { pm.manual = true; l.pending.unshift(pm); E.resolve(l, talk.k); t.ok(pt.family100.trust === Math.min(100, f0 + 5) && E.FAMILY100.summary(l, 'partner', 0).indexOf('Tin cậy ' + Math.round(pt.family100.trust)) === 0, 'trò chuyện với bạn đời trong hồ sơ: family100 ' + f0 + ' → ' + pt.family100.trust); }
  } },
  { name: '8-no-double-count', run(t, G) {
    const E = G.E, l = findLife(G, hasKid(8), 68000);
    if (!t.ok(!!l, 'có đời mẫu')) return;
    const k = kidOf(l, 8), p = k.persona141 || E.CHILD141.init(l, k); E.LIFE138.sync(l);
    const raw = () => ({ persona: p.trust, f100: k.family100 ? k.family100.trust : null, l138: people(l)[k.uid110].trust, close: k.close });
    // hồ sơ: trò chuyện +5 đúng một lần, đúng một chỗ
    p.trust = 50; let a = raw();
    let pm = E.DEC.personProfile138.make(l, () => 0.5, { id: k.uid110 }); pm.manual = true; l.pending.unshift(pm); E.resolve(l, pm.opts.find(o => /Trò chuyện/.test(o.l)).k);
    let b = raw();
    t.ok(b.persona === a.persona + 5 && b.f100 === a.f100 && b.l138 === a.l138 && b.close === a.close, 'trò chuyện: chỉ tin cậy chuẩn +5 (' + JSON.stringify(a) + ' → ' + JSON.stringify(b) + ')');
    // family100: một lần "lắng nghe" chỉ ghi vào tin cậy chuẩn; bản cũ family100.trust không đổi
    a = raw(); const d = E.DEC.family100_child_time.make(l, () => 0.5); d.manual = true; l.pending.unshift(d); E.resolve(l, 'listen'); b = raw();
    // lần đầu dùng family100 cho người con này thì bản ghi được tạo với mặc định 60 — đó là tạo mới, không phải cộng điểm
    t.ok(b.persona - a.persona >= 2 && b.persona - a.persona <= 5 && b.f100 === (a.f100 == null ? 60 : a.f100) && b.l138 === a.l138, 'lắng nghe: +' + (b.persona - a.persona) + ' vào tin cậy chuẩn (2, hoặc 2+3 khi con mở lòng), không ghi thêm chỗ khác (' + JSON.stringify(a) + ' → ' + JSON.stringify(b) + ')');
    // hai lần đọc không làm đổi giá trị
    const r1 = E.NPC.relation(l, k), r2 = E.NPC.relation(l, k.uid110);
    t.ok(same(r1, r2) && p.trust === b.persona, 'đọc quan hệ không làm thay đổi dữ liệu');
  } },
  { name: '9-dead-npc-not-recreated', run(t, G) {
    const E = G.E, l = findLife(G, l => hasKid(8)(l), 69000);
    if (!t.ok(!!l, 'có đời mẫu')) return;
    const k = kidOf(l, 8), idx = l.kids.indexOf(k), uid = k.uid110; E.CHILD141.init(l, k);
    const d = E.DEC.family100_child_time.make(l, () => 0.5); d.manual = true;
    k.alive = false; k.died = l.age; const tr = k.persona141.trust;
    t.ok(E.NPC.adjustTrust(l, uid, 10) === null && k.persona141.trust === tr, 'không đổi quan hệ với người đã mất');
    t.ok(E.NPC.find(l, uid).alive === false, 'tra cứu báo đúng là đã mất');
    l.pending.unshift(d); E.resolve(l, 'listen');
    t.ok(k.alive === false && k.persona141.trust === tr, 'lựa chọn cũ nhắc tới người đã mất không còn hiệu lực, không "sống lại"');
    for (let y = 0; y < 3 && l.alive; y++) year(E, l);
    const s = E.LIFE138.sync(l);
    t.ok(l.kids[idx] === k && k.alive === false && s.people[uid] && s.people[uid].alive === false, 'qua nhiều năm vẫn là đã mất ở mọi nơi');
    t.ok(!l.kids.some((x, i) => i !== idx && x.uid110 === uid), 'không có bản sao mới mang định danh cũ');
    // bạn đời đã mất không thể "quay lại" như người cũ
    if (l.partner) { const pu = l.partner.uid110; E.partnerGone(l, l.age); const h80 = hook(G, 'flags.lastP'); l.age++; h80(l, () => 0.5, noop, l.age); t.ok(!(l.flags.exList || []).some(x => x.uid === pu && !x.closed && !x.dead && !E.isDeadPartner(l, x)), 'bạn đời đã mất không thành người cũ có thể quay lại'); }
  } },
  { name: '10-old-saves-keep-relations', timeoutMs: 120000, run(t, G) {
    const E = G.E;
    let n = 0, merged = 0, aliased = 0;
    packs().forEach(pk => pk.saves.forEach(it => {
      const b = it.save.life, m = E.migrate(clone(b)), tag = 'v' + pk.version + ' ' + it.scenario, P0 = people(b), P1 = people(m);
      n++;
      t.ok(Object.keys(P0).every(key => P1[key]), tag + ': không mất hồ sơ người quen (' + Object.keys(P0).length + ')');
      t.ok(same((b.kids || []).map(k => [k.name, k.born, k.alive, k.close]), (m.kids || []).map(k => [k.name, k.born, k.alive, k.close])), tag + ': giữ con cái và độ gắn bó');
      t.ok((b.partner && b.partner.name) === (m.partner && m.partner.name) && (!b.partner || !b.partner.uid110 || b.partner.uid110 === m.partner.uid110), tag + ': giữ bạn đời và định danh cũ');
      t.ok(same((b.friends || []).map(f => [f.name, f.close, f.alive, f.uid110 || null]), (m.friends || []).map(f => [f.name, f.close, f.alive, b.friends.find(x => x.name === f.name && x.since === f.since).uid110 ? f.uid110 : null])), tag + ': giữ bạn bè, độ thân, định danh cũ');
      if (b.partner && b.partner.family100) t.ok(m.partner.family100.tension === b.partner.family100.tension, tag + ': giữ căng thẳng với bạn đời');
      // gộp tin cậy từ các bản sao vào nguồn chuẩn đúng một lần
      (b.kids || []).forEach(k => {
        if (k.alive === false) return;
        const k2 = m.kids.find(x => x.name === k.name && x.born === k.born);
        if (!k.persona141 || !k2.persona141) return;
        const want = Math.max(0, Math.min(100, Math.round(k.persona141.trust + (k.family100 && Number.isFinite(k.family100.trust) ? k.family100.trust - 60 : 0) + (k.uid110 && P0[k.uid110] ? P0[k.uid110].trust - 55 : 0))));
        if (want !== k.persona141.trust) merged++;
        t.ok(k2.persona141.trust === want, tag + ': tin cậy của ' + k.name + ' = ' + k2.persona141.trust + ' (mong đợi ' + want + ')');
      });
      if (m.flags.npcAlias142) {
        aliased++;
        // bạn thân ↔ người yêu của bản lưu cũ: hai uid cũ giữ nguyên, được nối bằng bí danh thành một người
        const pt = m.partner, fr = [m.bff].concat(m.friends || []).find(f => f && f.lover && f.name === pt.name);
        t.ok(pt && fr && pt.uid110 !== fr.uid110 && E.NPC.same(m, pt.uid110, fr.uid110), tag + ': bạn thân và người yêu là cùng một người (uid cũ giữ nguyên, nối bằng bí danh)');
        t.ok(E.NPC.find(m, pt.uid110).obj === pt, tag + ': tra uid của người yêu ra đúng bạn đời hiện tại');
        if (people(m)[pt.uid110] && people(m)[fr.uid110]) t.ok(E.NPC.hiddenAlias(m, pt.uid110) && !E.NPC.hiddenAlias(m, fr.uid110), tag + ': hồ sơ người quen chỉ hiện một lần, bản kia được giữ nhưng ẩn');
        const c = clone(m), cp = c.partner, cf = [c.bff].concat(c.friends || []).find(f => f && f.uid110 === fr.uid110);
        cf.name = cf.name + ' '; // tên lệch một ký tự: chỉ còn danh tính nối hai bản ghi
        E.personDied(c, cp, c.age);
        t.ok(cf.alive === false, tag + ': người yêu mất thì bản ghi bạn thân của cùng người ấy cũng là đã mất (theo danh tính, không theo tên)');
      }
    }));
    t.info(n + ' bản lưu · ' + merged + ' người con có tin cậy được gộp · ' + aliased + ' bản lưu có liên kết bạn thân ↔ người yêu');
    // fixture tự chơi hiếm khi dùng các menu quan hệ → dựng một bản lưu cấu trúc v1 có số liệu đã biết để kiểm phép gộp
    const base = findLife(G, l => married(l) && hasKid(8)(l), 75000);
    if (!t.ok(!!base, 'có đời mẫu để dựng bản lưu v1')) return;
    E.LIFE138.sync(base);
    const v1 = clone(base), k = kidOf(v1, 8); v1.sv = 1;
    const P = v1.flags.life138.people;
    k.persona141 = k.persona141 || clone(E.CHILD141.init(base, kidOf(base, 8)));
    k.persona141.trust = 60; k.family100 = { uid: 'child:99', trust: 72, tension: 20, lastActivity: -1 }; P[k.uid110].trust = 60;   // +12 (family100) +5 (life138)
    v1.partner.family100 = { uid: 'partner:98', trust: 50, tension: 30, lastActivity: -1 }; P[v1.partner.uid110].trust = 70;           // +15 (life138)
    if (v1.flags.family100 && v1.flags.family100.parents) delete v1.flags.family100.parents.m; P.mother.trust = 40;                     // −15, chưa có family100
    const m1 = E.migrate(clone(v1)), k1 = m1.kids.find(x => x.uid110 === k.uid110);
    t.ok(k1.persona141.trust === 77, 'con: 60 + (72−60) + (60−55) = 77 → ' + k1.persona141.trust);
    t.ok(m1.partner.family100.trust === 65 && m1.partner.family100.tension === 30, 'bạn đời: 50 + (70−55) = 65, căng thẳng giữ 30 → ' + m1.partner.family100.trust);
    const mom = m1.fam.mAlive ? m1.flags.family100.parents.m.family100 : null;
    t.ok(!m1.fam.mAlive || mom.trust === 45, 'mẹ: tạo family100 60 + (40−55) = 45 → ' + (mom && mom.trust));
    t.ok(k1.family100.trust === 72 && m1.flags.life138.people[k.uid110].trust === 60, 'trường cũ giữ nguyên trong bản lưu (không xóa), chỉ không còn được đọc');
    const m2 = E.migrate(clone(m1));
    t.ok(same(m1, m2), 'gộp đúng một lần: migrate lại không cộng thêm');
    t.ok(E.NPC.relation(m1, k1).trust === 77 && E.FAMILY100.summary(m1, 'child', m1.kids.indexOf(k1)).indexOf('Tin cậy 77/100') === 0, 'mọi module đọc cùng giá trị sau khi gộp');
  } },
  { name: '11-migrate-twice', timeoutMs: 120000, run(t, G) {
    const E = G.E, lives = [];
    packs().forEach(p => p.saves.forEach(it => lives.push(['v' + p.version + ' ' + it.scenario, it.save.life])));
    [71001, 71002].forEach(s => { G.testClock.reset(); const l = E.createLife({ mode: 'vn', seed: s }); for (let y = 0; y < 50 && l.alive; y++) year(E, l); lives.push(['đời mới ' + s, l]); });
    lives.forEach(([tag, l0]) => {
      const a = E.migrate(clone(l0)), b = E.migrate(clone(a));
      t.ok(same(a, b), tag + ': migrate lần hai không đổi gì');
      t.ok(Object.keys(people(a)).length === Object.keys(people(b)).length && (a.kids || []).length === (b.kids || []).length && (a.friends || []).length === (b.friends || []).length, tag + ': không sinh thêm người');
      t.ok(a.sv === E.SAVE_SCHEMA, tag + ': lên cấu trúc v' + E.SAVE_SCHEMA);
    });
  } },
  { name: '12-no-duplicates-over-years', timeoutMs: 150000, run(t, G) {
    const E = G.E;
    let checks = 0;
    for (let i = 0; i < 10; i++) {
      G.testClock.reset(); const l = E.createLife({ mode: i % 2 ? 'world' : 'vn', seed: 72000 + i * 11 });
      for (let y = 0; y < 90 && l.alive; y++) {
        year(E, l);
        const live = [l.partner, l.bff].concat(l.kids || [], l.sibList || [], l.friends || []).filter(o => o && o.alive !== false), by = {};
        live.forEach(o => { const c = E.NPC.canon(l, o.uid110); (by[c] = by[c] || []).push(o); });
        Object.keys(by).forEach(c => { const g = by[c]; checks++; t.ok(g.length === 1 || g.length === 2 && g[0].name === g[1].name && g.some(o => o.fromFriend) && g.some(o => o.lover), '#' + i + ' tuổi ' + l.age + ': ' + g.length + ' bản ghi dùng chung định danh ' + c); });
        const kids = (l.kids || []).map(k => k.parentId).filter(Boolean); t.ok(new Set(kids).size === kids.length, '#' + i + ': định danh con không trùng');
        const ex = (l.flags.exList || []).map(x => x.uid).filter(Boolean); t.ok(new Set(ex).size === ex.length, '#' + i + ' tuổi ' + l.age + ': không có hai hồ sơ người cũ cùng một người');
        if (l.partner && l.partner.uid110) t.ok(!(l.flags.exList || []).some(x => x.uid && E.NPC.same(l, x.uid, l.partner.uid110) && !x.closed), '#' + i + ': người đang yêu không đồng thời là "người cũ" còn mở');
      }
      const P = people(l), seen = {};
      Object.keys(P).filter(k => /:110:/.test(k) && !E.NPC.hiddenAlias(l, k)).forEach(k => { const c = E.NPC.canon(l, k); t.ok(!seen[c], '#' + i + ': hồ sơ người quen hiện hai lần cho cùng một người (' + c + ')'); seen[c] = 1; });
    }
    t.info(checks + ' lượt kiểm tra định danh');
  } },
  { name: '13-independent-lives', timeoutMs: 120000, run(t, G) {
    const E = G.E, A = findLife(G, l => (l.kids || []).some(k => k.alive !== false && l.age - k.born >= 18), 73000, 90);
    if (!t.ok(!!A, 'có đời cha/mẹ có con trưởng thành')) return;
    const k = A.kids.find(k => k.alive !== false && A.age - k.born >= 18), snapA = JSON.stringify(A);
    const B = E.createLife(E.childOpts(A, k));
    const refs = o => { const s = new Set(); (function walk(x) { if (!x || typeof x !== 'object' || s.has(x)) return; s.add(x); Object.keys(x).forEach(key => walk(x[key])); })(o); return s; };
    const ra = refs(A), shared = [...refs(B)].filter(o => ra.has(o));
    t.ok(shared.length === 0, 'đời con không dùng chung object dữ liệu với đời cha/mẹ (' + shared.length + ' object chung)');
    for (let y = 0; y < 15 && B.alive; y++) year(E, B);
    (B.sibList || []).forEach(s => { s.close = 1; s.job = 'đổi trong đời con'; }); if (B.partner) B.partner.name = 'Đổi trong đời con';
    t.ok(JSON.stringify(A) === snapA, 'chơi và sửa đời con không làm thay đổi đời cha/mẹ');
    const C = E.createLife({ mode: A.mode, seed: A.rs }); const rc = refs(C);
    t.ok(![...ra].some(o => rc.has(o)), 'hai đời độc lập không chia sẻ object');
  } },
  { name: '14-pending-after-reload', run(t, G) {
    const E = G.E, l = findLife(G, l => married(l) && hasKid(8)(l), 74000);
    if (!t.ok(!!l, 'có đời mẫu')) return;
    const k = kidOf(l, 8);
    const d1 = E.DEC.family100_child_time.make(l, () => 0.5), d2 = E.DEC.family100_romance.make(l, () => 0.5);
    d1.manual = true; l.pending = [d1];
    const saved = JSON.parse(JSON.stringify({ life: l })), m = E.migrate(saved.life), pd = m.pending[0];
    t.ok(pd && pd.id === 'family100_child_time' && E.DEC[pd.id].valid(m, pd.data), 'lựa chọn đang chờ vẫn hợp lệ sau khi tải');
    const who = E.NPC.find(m, pd.data.uid);
    t.ok(who && who.kind === 'child' && who.obj.name === k.name && who.obj.born === k.born && who.obj.uid110 === k.uid110, 'tham chiếu trong lựa chọn trỏ đúng người con (' + (who && who.obj.name) + ')');
    const kk = m.kids.find(x => x.uid110 === k.uid110), before = kk.persona141.trust;
    E.resolve(m, 'listen');
    t.ok(kk.persona141.trust > before && m.kids.filter(x => x !== kk).every(x => !x.persona141 || x.persona141.trust === (l.kids.find(y => y.uid110 === x.uid110).persona141 || {}).trust), 'chọn xong chỉ tác động đúng người con đó');
    t.ok(d2 && d2.id === 'family100_romance', 'tạo được lựa chọn với bạn đời để kiểm tra');
  } }
];

run('GĐ2 — danh tính, tính cách và quan hệ NPC', cases, { timeoutMs: 90000 });
