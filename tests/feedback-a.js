/* Góp ý người chơi — Mốc A: con sau nhiều lần ly hôn, về nước sau du học, app hẹn hò, audition, mời bố mẹ về sống chung. */
'use strict';
const assert = require('assert');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, H = E.H;
let checks = 0;
const ok = (c, m) => { assert(c, m); checks++; };
const clone = o => JSON.parse(JSON.stringify(o));
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
function adult(seed, age) {
  const l = E.createLife({ mode: 'vn', seed, year: 1990 });
  Object.assign(l, { age, indep: true, school: null, pending: [], sched: [], jailUntil: null, abroad: null, money: 0, partner: null, kids: [] });
  l.money = l.base * 20; delete l.flags.military; return l;
}
function menu(l, id, arg) { const d = E.DEC[id].make(l, H.rf(l), arg); return { d, rows: d.data.keys || [] }; }
// lựa chọn thật sự bấm được (không tính dòng bị khóa có lý do, không tính 'Để dịp khác')
function enabled(l, id, arg) { const d = E.DEC[id].make(l, H.rf(l), arg); return d.opts.filter(o => o.k !== 'cancel').map(o => d.data.keys[+o.k]); }
function pick(l, id, key, r = () => 0, arg) { const d = E.DEC[id].make(l, r, arg), i = d.data.keys.indexOf(key); assert(i >= 0 && d.opts.some(o => o.k === String(i)), id + ': có lựa chọn ' + key + ' (' + d.data.keys + ')'); l.pending = []; E.DEC[id].apply(l, d, String(i), r, say(l)); return d; }
function spouse(name, rel, age) { return { name, sex: 'F', age, alive: true, status: 'married', since: 25, relation108: rel }; }
function child(name, born, rel, pname) { return { name, sex: 'M', born, alive: true, close: 70, coParent108: { id: rel, name: pname, sex: 'F' } }; }
// Ly hôn như engine: kết thúc quan hệ rồi hook năm phát hiện và mở quyết định quyền nuôi con.
function divorce(l) {
  const dv = E.DEC.divorce.make(l, () => 0.99); E.DEC.divorce.apply(l, dv, 'div', () => 0.99, say(l));
  l.pending = []; E.finishYear(l);
  return l.pending.find(d => d.id === 'quyen_nuoi_con');
}

// ---------- A1. Kết hôn, ly hôn, tái hôn, ly hôn lần hai ----------
{
  const l = adult(4601, 30);
  l.partner = spouse('Lan', 'rel-1', 30); l.kids.push(child('An', 27, 'rel-1', 'Lan'));
  E.finishYear(l); l.pending = []; l.age = 31;
  let d = divorce(l);
  ok(d && /con An/.test(d.text), 'ly hôn lần 1: phân xử đúng con của Lan');
  l.pending = [d]; E.resolve(l, 'ex');
  const an = l.kids.find(k => k.name === 'An');
  ok(an.custody === 'ex', 'An ở với mẹ (Lan)');
  l.partner = spouse('Mai', 'rel-2', 32); l.partner.since = 32; l.age = 33; l.kids.push(child('Bình', 33, 'rel-2', 'Mai')); l.kids.push(child('Cúc', 34, 'rel-2', 'Mai')); l.age = 36;
  E.finishYear(l); l.pending = [];
  d = divorce(l);
  ok(d, 'ly hôn lần 2: có quyết định quyền nuôi con');
  ok(/2 đứa con nhỏ/.test(d.text) && !/An/.test(d.text), 'chỉ phân xử Bình và Cúc, không đưa An vào: ' + d.text);
  l.pending = [d]; E.resolve(l, 'nuoi');
  ok(an.custody === 'ex', 'An vẫn ở với Lan như thỏa thuận cũ');
  ok(l.kids.filter(k => k.name !== 'An').every(k => k.custody === 'me'), 'Bình, Cúc về với bạn');
  const saved = E.migrate(JSON.parse(JSON.stringify(l)));
  ok(saved.kids.map(k => k.custody).join() === l.kids.map(k => k.custody).join(), 'tải lại bản lưu không đổi nơi ở của con');
  // bản lưu cũ: con không có thông tin người cùng nuôi nhưng đã có quyết định nơi ở thì không bị đưa vào lần ly hôn sau
  const old = adult(4602, 40); old.partner = spouse('Hoa', 'rel-9', 40); old.kids.push({ name: 'Dũng', sex: 'M', born: 33, alive: true, custody: 'ex' });
  E.finishYear(old); old.pending = []; old.age = 41;
  ok(!divorce(old), 'bản lưu cũ: con riêng đã có nơi ở không bị phân xử lại');
  // xem và đề nghị đổi nơi ở của từng con
  const m = menu(l, 'residence146');
  ok(/An \(.*ở với Lan|An .*Lan/.test(m.d.text) && /giám hộ/.test(m.d.text), 'mục nơi ở hiện nơi sống, chăm sóc, giám hộ của từng con');
  pick(l, 'residence146', an.parentId ? an.parentId + ':me' : 'An:me');
  ok(an.custody === 'me' && an.residenceAt146 === l.age, 'đề nghị được đồng ý: An về sống cùng bạn');
  const anKey = an.parentId || 'An';
  ok(menu(l, 'residence146').rows.some(k => k.indexOf(anKey + ':') === 0) && !enabled(l, 'residence146').some(k => k.indexOf(anKey + ':') === 0), 'mỗi con chỉ bàn nơi ở một lần mỗi năm (dòng vẫn hiện, bị khóa có lý do)');
  const cur = adult(4603, 35); cur.partner = spouse('Thu', 'rel-5', 34); cur.kids.push(child('Em', 31, 'rel-5', 'Thu'));
  ok(menu(cur, 'residence146').rows.length === 0, 'con chung với bạn đời hiện tại không có mục đổi nơi ở');
}

// ---------- A2. Du học tiến sĩ ở Nhật Bản rồi về Việt Nam / chuyển nước khác ----------
{
  const base = adult(4610, 26); base.edu = 6; base.st.kno = 95; base.lang = { jp: 5 }; base.langExp = {};
  E.startResearchStudy(base, ['JP', 'Nhật Bản', 'jp'], () => 0.5, say(base));
  ok(base.abroad && base.abroad.code === 'JP' && base.abroad.study, 'đang học tiến sĩ ở Nhật Bản');
  ok(E.actions(base).some(a => a.id === 'abroadMove146' && a.ok === true), 'có hành động về nước / chuyển quốc gia khi đang du học');
  const l = clone(base), moneyJP = l.money;
  const m = menu(l, 'abroadMove146');
  ok(m.rows.includes('home') && m.rows.length >= 3, 'có lựa chọn về Việt Nam và sang nước khác');
  pick(l, 'abroadMove146', 'home');
  ok(!l.abroad && l.cur === 'vnd' && l.country === 'VN', 'về Việt Nam, tiền quy đổi sang VND, quốc tịch giữ nguyên');
  const ratio = G.CUR.priceLevel(G.W.BY.JP.gdp) * G.CUR.VND / 1e6, expected = (moneyJP - base.base * 0.5) * ratio;
  ok(Math.abs(l.money - expected) <= Math.abs(expected) * 0.01 + 1e-6, 'quy đổi tiền theo đúng tỷ giá và mức giá nơi đến (' + l.money.toFixed(2) + ' ≈ ' + expected.toFixed(2) + ')');
  ok(!l.sched.some(x => x.id === 'nc_bao_ve') && l.flags.researchStudy.abandoned146 === l.age && !l.job, 'dừng chương trình học: không còn lịch bảo vệ, không còn học bổng');
  ok(!E.actions(l).some(a => a.id === 'abroadMove146' && a.ok === true), 'ở quê nhà thì mục này không còn mở');
  const u = clone(base); pick(u, 'abroadMove146', 'US');
  ok(u.abroad && u.abroad.code === 'US' && u.abroad.perm && u.country === 'VN', 'chuyển sang Hoa Kỳ định cư, quốc tịch gốc giữ nguyên');
  const poor = clone(base); poor.money = 0;
  const pm = E.DEC.abroadMove146.make(poor, H.rf(poor));
  ok(pm.opts.some(o => /chưa thể: Chưa đủ tiền/.test(o.l)), 'thiếu điều kiện thì hiện lý do, không ẩn lựa chọn');
  pick(poor, 'abroadMove146', 'home');
  ok(poor.abroad && poor.abroad.code === 'JP', 'chọn khi chưa đủ điều kiện thì không di chuyển');
  const mig = E.actions(base).find(a => a.id === 'migrate114');
  ok(!mig || mig.ok === true || /Về nước \/ chuyển sang quốc gia khác/.test(mig.ok), 'hồ sơ định cư cũ chỉ dẫn sang mục mới khi đang ở nước ngoài');
}

// ---------- A3. App hẹn hò ----------
{
  const l = adult(4620, 27);
  const t0 = Date.now(); const d = E.DEC.app_ho_so.make(l, () => 0.5, { app: 'Tinder', fresh: true });
  ok(Date.now() - t0 < 1000 && l.flags.appSwipe.list.length === 5, 'nguồn ngẫu nhiên lặp lại không làm treo khi tạo hồ sơ (trước đây vòng lặp vô hạn)');
  ok(l.flags.appSwipe.list.every(p => p.likes.length === 2 && p.likes[0] !== p.likes[1]), 'mỗi hồ sơ có 2 sở thích khác nhau');
  const names = l.flags.appSwipe.list.map(p => p.n).join();
  E.DEC.app_ho_so.make(l, H.rf(l), d.data);
  ok(l.flags.appSwipe.list.map(p => p.n).join() === names, 'mở lại hộp lựa chọn không đổi danh sách hồ sơ');
  let errors = 0, runs = 0;
  for (const variant of ['single', 'divorced', 'widowed', 'world']) {
    for (let s = 0; s < 6; s++) {
      const x = variant === 'world' ? Object.assign(E.createLife({ mode: 'world', seed: 4630 + s, year: 1990 }), { age: 30, indep: true, pending: [], partner: null }) : adult(4630 + s, 24 + s * 6);
      if (variant === 'divorced') { x.exes = 1; x.flags.divAt = x.age - 1; }
      if (variant === 'widowed') { x.widowed = 1; x.flags.widowAt = x.age - 1; }
      for (const app of ['tinder', 'bumble', 'fb', 'litmatch']) for (const k of ['p0', 'p3', 'luot', 'thoat']) {
        const y = clone(x); runs++;
        try { E.act(y, 'tim_nguoi_yeu'); E.resolve(y, 'app'); E.resolve(y, app); E.resolve(y, k); let g = 0; while (y.pending.length && g++ < 20) E.resolve(y, E.autoKey(y)); } catch (e) { errors++; }
      }
    }
  }
  ok(errors === 0, 'app hẹn hò không lỗi ở độc thân / ly hôn / góa / thế giới (' + runs + ' lượt, ' + errors + ' lỗi)');
}

// ---------- A4. Audition: chuẩn bị hồ sơ → đăng ký → các vòng → kết quả ----------
{
  const L = E.LIFE138, l = adult(4640, 19);
  ['sing', 'dance', 'acting'].forEach(k => L.skill(l, k).level = 40);
  const m = menu(l, 'audition139');
  ok(m.rows.indexOf('pf_photo') >= 0 && m.rows.indexOf('pf_video') >= 0 && m.rows.indexOf('pf_photo') < m.rows.indexOf('KR'), 'bước chuẩn bị hồ sơ đứng trước đăng ký audition');
  pick(l, 'audition139', 'pf_photo', () => 0.5); pick(l, 'audition139', 'pf_video', () => 0.5);
  const pf = L.state(l).portfolio139;
  ok(pf.photo > 0 && pf.video > 0, 'có ảnh và video trong hồ sơ ứng viên');
  const fail = clone(l); pick(fail, 'audition139', 'KR', () => 0.99);
  const a = L.state(fail).agency;
  ok(a.status === 'rejected' && a.rounds.length >= 1 && a.rounds.every(x => x.name && x.why) && /Aurora/.test(a.name), 'chưa đạt: ghi đơn vị tuyển chọn, từng vòng và lý do');
  ok(fail.log.some(e => /Vòng hồ sơ: /.test(e.t)), 'nhật ký kể kết quả từng vòng');
  const pass = clone(l); pick(pass, 'audition139', 'JP', () => 0);
  ok(L.state(pass).agency.status === 'offer' && L.state(pass).agency.rounds.length === 3, 'đạt cả 3 vòng → đề nghị thực tập sinh');
  const old = clone(l); old.age = 29;
  ok(E.DEC.audition139.make(old, () => 0).opts.filter(o => /Đăng ký audition/.test(o.l)).length === 0, 'quá tuổi thực tập sinh thì không đăng ký được');
}

// ---------- A5. Mời bố mẹ về sống chung ----------
{
  const l = adult(4650, 40); Object.assign(l.fam, { mAlive: true, fAlive: true, mAge: 28, fAge: 30 }); l.flags.caring = false;
  const m = menu(l, 'parentsHome146');
  ok(['m', 'f', 'both'].every(k => m.rows.includes(k)), 'mời bố, mẹ hoặc cả hai');
  const no = clone(l); pick(no, 'parentsHome146', 'both', () => 0.99);
  ok(!no.flags.caring && no.log.some(e => /chưa muốn chuyển/.test(e.t)), 'bố mẹ có quyền từ chối, có lý do');
  ok(menu(no, 'parentsHome146').rows.length === 3 && enabled(no, 'parentsHome146').length === 0, 'mỗi năm ngỏ lời một lần (dòng bị khóa có lý do)');
  const house = l.houseVal, own = l.ownHouse;
  pick(l, 'parentsHome146', 'm', () => 0);
  ok(l.flags.caring && l.houseVal === house && l.ownHouse === own, 'mẹ đồng ý về sống cùng; nhà và tài sản không đổi chủ');
  l.age++; ok(menu(l, 'parentsHome146').rows.includes('home'), 'có thể để bố mẹ về lại nhà riêng');
  const dep = adult(4651, 20); dep.indep = false; ok(!E.actions(dep).some(a => a.id === 'parentsHome146' && a.ok === true), 'chưa tự lập thì chưa mời được');
}

console.log('PASS feedback-a: ' + checks + ' kiểm tra.');
