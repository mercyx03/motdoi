'use strict';
// 9.5.3: tuổi thơ nhỏ (kid953.js): hợp nhất hai tình huống lạc giữa đám đông, chuỗi hậu quả nhiều năm, thất lạc khi chạy loạn,
// các chuyện tuổi thơ mới theo hoàn cảnh, và không có chú thích ngoài lề trong nội dung mới.
const assert = require('node:assert/strict');
const fs = require('fs'), path = require('path');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, H = E.H, C = E.CHAIN144, K = E.KID953;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
function life(o) {
  o = o || {};
  const l = E.createLife({ mode: o.mode || 'vn', country: o.cc, seed: o.seed || 7, year: (o.year || 2000) - (o.age || 0), gender: o.sex || 'M' });
  l.age = o.age == null ? 4 : o.age; l.alive = true; l.pending = []; l.sched = []; l.school = null;
  if (o.urban != null) l.urban = o.urban; if (o.city) { l.city = o.city; l.place = o.city; } if (o.q) l.fam.q = o.q;
  return l;
}
function decide(l, id, k, arg) { const d = E.DEC[id].make(l, H.rf(l), arg); ok(d.opts.some(x => x.k === k), id + ': có phương án ' + k + ' (' + d.opts.map(x => x.k) + ')'); l.pending.unshift(d); E.resolve(l, k); return d; }
function nextStage(l, cid, years) {
  for (let i = 0; i < (years || 12); i++) {
    C.yearly(l, H.rf(l), say(l), l.age);
    const s = l.sched.find(x => x.arg && x.arg.cid === cid);
    l.age++;
    if (s) { l.sched.splice(l.sched.indexOf(s), 1); return s; }
    if (!C.chain(l, cid)) return null;
  }
  return null;
}
const lastLog = l => l.log.length ? l.log[l.log.length - 1].t : '';
const trig = id => E.TRIG.filter(t => t.id === id)[0];

// 1. Nội dung mới không kèm chú thích ngoài lề kiểu "mô phỏng", "giả lập", "tham số", "thử nghiệm"
{
  const src = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'kid953.js'), 'utf8');
  ok(!/mô phỏng|giả lập|hư cấu|thử nghiệm|tham số|ước lượng|trong game|của game/i.test(src), 'kid953.js không có chú thích kiểu mô phỏng, giả lập, tham số');
  const app = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'app.js'), 'utf8');
  ok(!/thử nghiệm: chưa|Thử nghiệm: trước|ước tính từ tuổi thọ/.test(app), 'màn chọn năm sinh không còn chú thích thử nghiệm');
  const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
  ok(html.indexOf('js/life144.js') < html.indexOf('js/kid953.js') && html.indexOf('js/life83.js') < html.indexOf('js/kid953.js') && html.indexOf('js/ctx945.js') < html.indexOf('js/kid953.js') && html.indexOf('js/kid953.js') < html.indexOf('js/app.js'), 'kid953.js nạp sau life83, life144, ctx945 và trước app');
}

// 2. Tình huống lạc: một lần một đời, hiếm hơn nhiều; nơi bị lạc đúng thời và nơi ở
{
  const LOST = new Set(['bi_lac', 'k6_lac_cho', 'k953_lac_so_tan']);
  let lives = 0, withLost = 0, multi = 0;
  for (let i = 0; i < 160; i++) {
    const l = E.createLife({ mode: 'vn', seed: 31000 + i * 7919, year: 2000 }); lives++;
    let c = 0;
    while (l.alive && l.age < 15) {
      E.beginYear(l, { auto: true }); l.pending.forEach(d => { if (LOST.has(d.id)) c++; });
      let g = 0; while (l.pending.length && l.alive && g++ < 64) E.resolve(l, E.autoKey(l));
      if (l.alive) E.finishYear(l); g = 0; while (l.pending.length && l.alive && g++ < 64) E.resolve(l, E.autoKey(l)); E.endYear(l);
    }
    if (c) withLost++; if (c > 1) multi++;
  }
  ok(withLost / lives <= 0.1, 'thời bình: chỉ ' + withLost + '/' + lives + ' đời gặp cảnh lạc giữa đám đông (trước đây khoảng 1/4)');
  ok(multi === 0, 'mỗi đời không gặp quá một lần cảnh lạc');
  for (let i = 0; i < 40; i++) {
    const a = life({ seed: 100 + i, year: 1962, age: 4, urban: false }), t = K.crowd(a);
    ok(!/siêu thị/.test(t.title + t.intro + t.ask), 'năm 1962 ở nông thôn không có siêu thị: ' + t.title);
    const b = life({ seed: 200 + i, mode: 'world', cc: 'JP', year: 1935, age: 4, urban: true }), u = K.crowd(b);
    ok(!/siêu thị/.test(u.title + u.intro), 'năm 1935 chưa có siêu thị: ' + u.title);
  }
  let mall = 0, cho = 0;
  for (let i = 0; i < 80; i++) { const t = K.crowd(life({ seed: 300 + i, year: 2016, age: 4, urban: true })); if (t.k === 'mall') mall++; if (t.k === 'cho') cho++; }
  ok(mall > 5 && cho > 5, 'thành thị 2016 có cả siêu thị (' + mall + ') và chợ (' + cho + ')');
  const tr = life({ seed: 9, year: 1990, age: 4, urban: false }); tr.fam.mJob = 'bán hàng ở chợ'; tr.fam.fJob = 'buôn bán';
  ok(/chợ/.test(K.crowd(tr).intro) || K.crowd(tr).k !== 'cho', 'nhà buôn bán ở chợ: nếu bị lạc ở chợ thì nơi đó đúng là chợ');
}

// 3. Chiến sự hoặc thiên tai nặng: không còn chuyện đi chợ lạc mẹ, mà là thất lạc khi chạy loạn; thời bình không có
{
  const war = life({ seed: 21, year: 1968, age: 5, city: 'Huế' }), peace = life({ seed: 21, year: 2005, age: 5, city: 'Huế' });
  ok(K.turbulent(war) && !K.turbulent(peace), 'Huế 1968 là vùng biến động, Huế 2005 thì không');
  ok(!K.lostOk(war) && trig('bi_lac').when(war, 5) === false && trig('k6_lac_cho').when(war, 4) === false, 'vùng chiến sự: tình huống lạc ở chợ bị chặn');
  ok(trig('k953_lac_so_tan').when(war, 5) === true && trig('k953_lac_so_tan').when(peace, 5) === false, 'thất lạc khi chạy loạn chỉ có ở vùng chiến sự');
  const d = E.DEC.k953_lac_so_tan.make(war, H.rf(war));
  ok(/Chiến sự|còi|bàn tay/i.test(d.text) && d.opts.length === 3, 'cảnh chạy loạn có đủ ba hướng xử trí');
  // hậu quả nhiều giai đoạn: thất lạc lâu → tìm kiếm → đoàn tụ hoặc chưa có tin
  let found = 0, lost = 0, reunited = 0, unresolved = 0;
  for (let i = 0; i < 60; i++) {
    const l = life({ seed: 500 + i, year: 1968, age: 5, city: 'Huế' });
    decide(l, 'k953_lac_so_tan', 'theo');
    ok(l.flags.lost953 === 5, 'đã ghi nhận lần thất lạc');
    const c = C.active(l, 'sep953'); if (!c) continue; lost++;
    ok(c.data.who && c.data.lv >= 2, 'chuỗi nhớ người thất lạc và mức chiến sự');
    const s = nextStage(l, c.id); ok(s && s.id === 'ch953_sep_tin', 'một hai năm sau có tin tức về người thân');
    decide(l, 'ch953_sep_tin', 'cuu', { cid: c.id, token: s.arg.token });
    if (c.data.found) found++;
    for (let y = 0; y < 8 && C.chain(l, c.id); y++) C.yearly(l, H.rf(l), say(l), l.age++);
    const done = (l.flags.chains144.done || []).filter(x => x.kind === 'sep953')[0];
    if (done && done.result === 'reunited') { reunited++; ok(l.mem.some(m => /đoàn tụ/.test(m.t)), 'đoàn tụ được ghi vào ký ức'); }
    if (done && done.result === 'unresolved') { unresolved++; ok(l.flags.missingFam953 === true, 'chưa có tin thì ghi nhận lâu dài'); }
  }
  ok(lost > 0 && reunited > 0 && unresolved > 0, 'có cả đoàn tụ (' + reunited + ') lẫn chưa có tin (' + unresolved + ') trong ' + lost + ' ca thất lạc lâu');
  ok(found >= reunited && found <= lost, 'đoàn tụ chỉ khi tìm kiếm có kết quả');
}

// 4. Lạc giữa đám đông: chuỗi hậu quả (sợ chỗ đông người hoặc học thuộc địa chỉ), ảnh hưởng đến các chuyện sau
{
  const a = life({ seed: 61, year: 2002, age: 4, urban: false });
  decide(a, 'bi_lac', 'search');
  ok(a.flags.lost953 === 4, 'lạc xong ghi nhận trong đời');
  ok(!K.lostOk(a) && trig('bi_lac').when(a, 5) === false && trig('k6_lac_cho').when(a, 5) === false, 'đã lạc một lần thì hai tình huống đều bị chặn');
  // tách trường hợp sợ và không sợ
  let feared = null, calm = null;
  for (let i = 0; i < 80 && (!feared || !calm); i++) {
    const l = life({ seed: 700 + i, year: 2002, age: 4, urban: i % 2 === 0 });
    decide(l, i % 3 === 0 ? 'k6_lac_cho' : 'bi_lac', i % 3 === 0 ? 'chay' : 'search');
    const c = C.active(l, 'lost953'); ok(!!c, 'lạc xong mở chuỗi lost953');
    if (c.data.fear && !feared) feared = l; if (!c.data.fear && !calm) calm = l;
  }
  ok(feared && calm, 'có cả ca bị sợ và ca bình tĩnh');
  const cf = C.active(feared, 'lost953'), s1 = nextStage(feared, cf.id); ok(s1 && s1.id === 'ch953_lost_after', 'vài năm sau có chuyện nỗi sợ chỗ đông người');
  const d1 = E.DEC.ch953_lost_after.make(feared, H.rf(feared), { cid: cf.id, token: s1.arg.token });
  ok(d1.opts.some(o => o.k === 'tap') && d1.opts.every(o => o.k !== 'thuoc'), 'ca sợ: có phương án tập dần, không có phương án học địa chỉ');
  feared.pending.unshift(d1); E.resolve(feared, 'tranh');
  ok(feared.flags.crowdFear953 === true && !C.chain(feared, cf.id), 'chọn tránh: nỗi sợ còn, chuỗi khép lại');
  let cut = 0, all = 0;
  ['choi_le_hoi', 'concert', 'k6_thieu_nhi'].forEach(id => { const t = trig(id); for (let a2 = 8; a2 <= 20; a2++) { feared.age = a2; const base = life({ seed: 62, year: 2002, age: a2 }); const w = t.when(feared, a2); all++; if (!w) cut++; } });
  ok(cut > 0 && cut < all, 'nỗi sợ làm giảm một phần (không phải tất cả) dịp đông người: ' + cut + '/' + all);
  const cc = C.active(calm, 'lost953'), s2 = nextStage(calm, cc.id);
  const d2 = E.DEC.ch953_lost_after.make(calm, H.rf(calm), { cid: cc.id, token: s2.arg.token });
  ok(d2.opts.some(o => o.k === 'thuoc') && d2.opts.every(o => o.k !== 'tap'), 'ca bình tĩnh: có phương án học địa chỉ');
  calm.pending.unshift(d2); E.resolve(calm, 'thuoc');
  ok(calm.flags.knowsWay953 === true && !!calm.mem.find(m => /địa chỉ/.test(m.t)), 'học thuộc địa chỉ được ghi nhớ');
  const xb = trig('k6_xe_buyt'); const w0 = typeof xb.cw === 'function' ? xb.cw(calm, 11) : xb.cw; calm.flags.knowsWay953 = false; const w1 = typeof xb.cw === 'function' ? xb.cw(calm, 11) : xb.cw;
  ok(w0 > w1, 'biết nhớ đường nhà thì dễ được cho tự đi xe buýt hơn');
  // đêm hội: đứng ở rìa có thể làm nỗi sợ nguôi dần
  let eased = 0;
  for (let i = 0; i < 30; i++) { const l = life({ seed: 900 + i, year: 2002, age: 6 }); l.flags.crowdFear953 = true; decide(l, 'k953_xem_hoi', 'nep'); if (!l.flags.crowdFear953) eased++; }
  ok(eased > 5 && eased < 30, 'đứng ở rìa xem hội làm nguôi nỗi sợ ở một phần các ca (' + eased + '/30)');
  const e = life({ seed: 70, year: 2002, age: 6 }); e.flags.crowdFear953 = true; ok(E.DEC.k953_xem_hoi.make(e, H.rf(e)).opts.every(o => o.k !== 'chen'), 'đang sợ thì không có phương án chen lên hàng đầu');
}

// 5. Các chuyện tuổi thơ mới: kết quả phụ thuộc hoàn cảnh (nơi ở, tiếp cận y tế, người trông, thời bình hay loạn)
{
  const hi = life({ seed: 11, year: 2018, age: 3, urban: true, q: 4 }), lo = life({ seed: 11, year: 1962, age: 3, urban: false, q: 1, city: 'Huế' });
  ok(K.access(hi) > K.access(lo), 'nơi gần cơ sở y tế và thời nay dễ cấp cứu hơn nơi xa, thời chiến (' + K.access(hi) + ' > ' + K.access(lo) + ')');
  let hiCost = 0, loCost = 0, hiHea = 0, loHea = 0, nh = 0, nl = 0;
  for (let i = 0; i < 40; i++) {
    const a = life({ seed: 1000 + i, year: 2018, age: 3, urban: true, q: 4 }), b = life({ seed: 1000 + i, year: 1962, age: 3, urban: false, q: 1, city: 'Huế' });
    [a, b].forEach((l, j) => { const h0 = l.st.hea; decide(l, 'k953_an_nham', 'khoc'); (j ? (loHea += h0 - l.st.hea, nl++) : (hiHea += h0 - l.st.hea, nh++)); });
  }
  ok(loHea / nl > hiHea / nh, 'nuốt nhầm: nơi xa cơ sở y tế chịu nhiều tổn hại hơn (' + (loHea / nl).toFixed(2) + ' > ' + (hiHea / nh).toFixed(2) + ')');
  // sốt: nhà không có cách đi khám ngay dễ gặp biến chứng hơn
  let c1 = 0, c2 = 0;
  for (let i = 0; i < 120; i++) {
    const a = life({ seed: 2000 + i, year: 2018, age: 3, urban: true, q: 4 }), b = life({ seed: 2000 + i, year: 1962, age: 3, urban: false, q: 1, city: 'Huế' });
    decide(a, 'k953_sot_dem', 'nha'); decide(b, 'k953_sot_dem', 'nha'); if (a.flags.febrile953) c1++; if (b.flags.febrile953) c2++;
  }
  ok(c2 > c1, 'sốt ở nơi xa y tế, thời chiến dễ co giật hơn (' + c2 + ' > ' + c1 + ')');
  // chuyện hậu quả kéo dài: co giật do sốt có thể tái phát vài năm sau rồi hết
  const f = life({ seed: 5, year: 2010, age: 2 }); f.flags.febrile953 = true; let rec = 0; const hook = E.HOOKS.year;
  for (let i = 0; i < 40; i++) { const g = life({ seed: 6000 + i, year: 2010, age: 2 }); g.flags.febrile953 = true; for (let a = 2; a <= 7; a++) { g.age = a; hook.forEach(h => { try { h(g, H.rf(g), say(g), a); } catch (e) { } }); } if (g.log.some(x => /sốt cao nữa/.test(x.t))) rec++; ok(!g.flags.febrile953, 'đến năm bảy tuổi cơn co giật do sốt không còn nữa'); }
  ok(rec > 0 && rec < 40, 'có ca tái phát, có ca không (' + rec + '/40)');
  // nhà có thêm em: dùng danh sách anh chị em có sẵn
  const s = life({ seed: 8, year: 2005, age: 4 }); s.sibList = [{ n: 'Nguyễn Văn Bo', sex: 'M', born: 3, alive: true, close: 60 }];
  ok(trig('k953_sinh_em').when(s, 4) === true && trig('k953_sinh_em').when(life({ seed: 8, year: 2005, age: 4 }), 4) === (!!K.newSib(life({ seed: 8, year: 2005, age: 4 }))), 'nhà có thêm em chỉ xảy ra khi có em mới sinh');
  const c0 = s.sibList[0].close; decide(s, 'k953_sinh_em', 'tuhao'); ok(s.sibList[0].close > c0, 'tự hào đón em làm tình cảm anh chị em tốt hơn');
  const s2 = life({ seed: 8, year: 2005, age: 4 }); s2.sibList = [{ n: 'Nguyễn Thị Na', sex: 'F', born: 3, alive: true, close: 60 }]; decide(s2, 'k953_sinh_em', 'doi'); ok(s2.sibList[0].close < 60, 'dỗi và đòi chú ý làm tình cảm anh chị em giảm');
  // nước: chỉ nông thôn hoặc ven biển; ở thành phố nội đô không có
  ok(trig('k953_gan_nuoc').when(life({ seed: 3, year: 2005, age: 4, urban: false }), 4) === true && trig('k953_gan_nuoc').when(Object.assign(life({ seed: 3, year: 2005, age: 4, urban: true }), { coast: false }), 4) === false, 'chuyện bờ nước chỉ có ở nông thôn hoặc ven biển');
  // học bơi sau lần suýt đuối nước làm bớt sợ
  const w = life({ seed: 4, year: 2005, age: 7 }); w.flags.waterFear953 = true; decide(w, 'k_hoc_boi', 'hoc'); ok(!w.flags.waterFear953, 'có người hướng dẫn tập bơi làm bớt sợ nước');
  // bếp lửa, nơi ở và thời đại quyết định vật nóng trong nhà
  const vw = life({ seed: 12, year: 1962, age: 3, urban: false }), vm = life({ seed: 12, year: 2018, age: 3, urban: true });
  ok(!/nồi cơm điện|siêu tốc/.test(E.DEC.k953_nong_bep.make(vw, H.rf(vw)).text), 'năm 1962 chưa có nồi cơm điện hay ấm siêu tốc');
  let cwn = 0; for (let i = 0; i < 30; i++) if (/nồi cơm điện|siêu tốc|phích/.test(E.DEC.k953_nong_bep.make(life({ seed: 12 + i, year: 2018, age: 3, urban: true }), H.rf(vw)).text)) cwn++;
  ok(cwn > 5, 'năm 2018 ở thành phố xuất hiện đồ điện trong nhà (' + cwn + '/30)');
  // cân bằng: có chuyện tốt, xấu và trung tính trong nhóm mới
  const kinds = { good: 0, bad: 0, neutral: 0 };
  for (let i = 0; i < 60; i++) ['k953_nong_bep', 'k953_gan_nuoc', 'k953_an_nham', 'k953_sot_dem', 'k953_xem_hoi', 'k953_gia_vo', 'k953_chuyen_xa', 'k953_nhat_rau'].forEach(id => { const l = life({ seed: 3000 + i, year: 2005, age: 4, urban: i % 2 === 0 }); const d = E.DEC[id].make(l, H.rf(l)); l.pending.unshift(d); E.resolve(l, d.opts[0].k); const k = l.log.length ? l.log[l.log.length - 1].k : ''; if (kinds[k] != null) kinds[k]++; });
  ok(kinds.good > 20 && kinds.bad > 5 && kinds.neutral > 20, 'có đủ chuyện vui, buồn và bình thường: ' + JSON.stringify(kinds));
}

// 6. Lựa chọn tuổi nhỏ không nằm im một chỗ: các tuổi 2–7 có nhiều chuyện hơn, không bị một chuyện áp đảo
{
  const ids = new Set(E.TRIG.filter(t => t.child && /^k953_/.test(t.id)).map(t => t.id));
  ok(ids.size >= 10, 'có đủ mười chuyện tuổi thơ mới (' + ids.size + ')');
  for (let a = 2; a <= 7; a++) { const l = life({ seed: 77, year: 2005, age: a, urban: false }); const pool = E.TRIG.filter(t => t.child && E.DEC[t.id] && t.when(l, a)); ok(pool.length >= (a === 2 ? 4 : 8), 'tuổi ' + a + ' có đủ chuyện tuổi thơ có thể xảy ra (' + pool.length + ')'); }
  const lostW = ['bi_lac', 'k6_lac_cho'].map(id => trig(id).cw); ok(lostW.every(w => typeof w === 'number' && w <= 0.25), 'trọng số hai chuyện lạc đã giảm mạnh');
}

// 7. Bản lưu cũ và tương thích
{
  const l = life({ seed: 15, year: 2000, age: 4 }); const old = JSON.parse(JSON.stringify(l)); delete old.flags.lost953;
  const d = E.DEC.bi_lac.make(old, H.rf(old)); ok(d.opts.map(o => o.k).join() === 'stay,ask,search', 'bản lưu cũ: chuyện lạc ở chợ vẫn giữ nguyên ba phương án');
  const d2 = E.DEC.k6_lac_cho.make(old, H.rf(old)); ok(d2.opts.map(o => o.k).join() === 'dung,nho,chay', 'bản lưu cũ: "Lạc mất mẹ" vẫn giữ nguyên ba phương án');
  const saved = JSON.parse(JSON.stringify(Object.assign(life({ seed: 16, year: 2000, age: 4 }), {}))); decide(saved, 'bi_lac', 'ask');
  const reload = E.migrate(JSON.parse(JSON.stringify(saved))); ok(C.active(reload, 'lost953') && reload.flags.lost953 === 4, 'lưu rồi tải lại vẫn còn chuỗi và lần lạc');
  const m = life({ seed: 17, year: 2000, age: 20 }); ok(typeof E.runHeadless === 'function', 'chạy trọn đời không lỗi'); E.runHeadless(E.createLife({ mode: 'vn', seed: 18, year: 1975 }));
}
console.log('kid953: ' + n + ' kiểm tra đạt');
